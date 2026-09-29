# Step 8. 关键处理流 / 重要函数数据流

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 8。

- [x] 读取项目 ledger、02 flow、Step 5~7、正式 01 §9/§10/§13。
- [x] 回答写路径、读路径、consumer、job、事务和函数粒度问题。
- [x] 先建立通用骨架，再按 CP1→CP6 覆盖全部正式入口并逐项停审。
- [x] 为 3 Command、5 写状态 Consumer、17 个影响一致性/外部副作用的 Job 提供独立处理流。
- [x] 为 5 Query 建立 no-write 安全读取路径；完成跨流和历史污染审计。

## 2. 本步输入、问题回答与设计取舍

处理流只使用 Step 6 的 26 个正式对象与 Step 7 的入口/required port。Command 先核验上下文和幂等，再在本地事务提交请求/意图；Consumer 先核验 envelope、输入绑定与既有结果；Job 只推进持久意图，外部调用与本地事务分离；Query 先做现时访问判断，再组合已提交状态，全程 no-write。

必须在概要层点名：snapshot fence、固定 manifest/input revision、local transaction、external intent-before-effect、commit-unknown reconcile、per-owner restore item 与 current authorization/redaction。完整 trait 调用链、DDL、错误码、重试次数、超时和锁策略留 03/04。

旧材料把“capture→store→index→restore”画成单成功链，无法表达 partial、外部副作用未知和 owner-specific handoff。本步采用 25 条写/推进流加 5 条查询口径，宁可保留多轴局部结果，也不聚合成虚假的全局成功。

## 3. 通用处理约束

| 路径 | 结构骨架 | 必须保留的分支 |
|---|---|---|
| Command | Inbound → actor/authority/idempotency → domain admission/intent → 本地原子提交 → safe result | rejected、blocked、same-key-different-input、version conflict、local commit unknown |
| Consumer | Trusted envelope → source/event/input binding → 既有结果核对 → domain apply → 本地原子提交 | duplicate、stale、conflicting、unknown、unmatched feedback |
| Operations Job | persisted intent/attempt → 前置与 fence → 外部调用或纯本地计算 → result/reconcile → stage update | partial、unsupported、integrity-failed、commit-unknown、superseded |
| Query | actor/current access → read Archive-owned state → redaction/visibility → safe response | not available、partial、stale、blocked、unknown；任何分支均 no-write |

外部 I/O 不包进 Archive 本地事务；调用前必须已有本地 intent/attempt。外部返回后以 expected version 与固定输入绑定写入；若本地提交结果未知，先按本地 key/ref 核对，不能重发外部动作。

## 4. CP1 请求与作业协调

#### RequestArchive 处理流

```text
Command / RequestArchive
  │ actor + metadata + key + declared scope + authority ref
  ▼
ArchiveRequestService
  shape / authority / same-key input check
  ▼
ArchiveRequest.admit(...) + ArchiveJob.queue(...)
  ▼
ArchiveStorePort / local transaction
  request + job + initial stage record
  ▼
ArchiveRequestResult
  accepted / rejected / blocked; never archive-complete
```

关键设计点：`admit(ArchiveRequestId request_id, DeclaredArchiveScope scope, ActorRef actor, AuthorityRef authority_ref, IdempotencyKey idempotency_key, SafeInputDigest input_digest)` 只建立本地受理；同 key 异 digest 冲突；提交 unknown 按 request/key 读回。

#### RequestRestore 处理流

```text
Command / RequestRestore
  │ actor + metadata + key + bundle + target owners + authority
  ▼
ArchiveRequestService / RestoreService
  current access + fixed bundle + explicit owner range
  ▼
RestoreRequest.admit(...) + ArchiveJob.queue(...)
  ▼
ArchiveStorePort / local transaction
  request + restore job + initial stage record
  ▼
RestoreRequestResult
  accepted / rejected / blocked; no owner write
```

关键设计点：受理不创建 handoff；目标 owner 不暗含全域；Bundle 不可访问、输入版本不支持或 authority 不能证明时阻塞。

#### AdvanceArchiveJob 处理流

```text
Operations / AdvanceArchiveJob
  │ persisted job + expected job version
  ▼
ArchiveRequestService
  read component postures; no external side effect
  ▼
ArchiveJob.recompute(...) / advance(...) or block(...)
  ▼
ArchiveStorePort / local transaction
  current stage + immutable stage record
  ▼
JobAdvanceResult
  local aggregate posture only
```

关键设计点：`recompute(JobComponentPostureSet component_postures)` 不把 partial/unknown 压成 Completed；阶段迁移和历史记录同事务；业务 archived/restored 不由本流设置。

#### GetArchiveJobStatus 处理流

```text
Query / GetArchiveJobStatus
  │ actor + query metadata + request/job selector
  ▼
current access decision
  ▼
ArchiveStorePort / read request, job, stage and CP postures
  ▼
safe composition + redaction
  ▼
SafeArchiveJobStatusView / SafeNotAvailable
  no write, no retry, no side effect
```

关键设计点：空记录不证明 rollback；外部 ref、finding 和材料身份仍受当前访问边界；查询不推进 job。

#### CP1 处理流停审

两个 P0 Command、协调 Job 与状态 Query 均有独立口径；admission、job 和业务状态分离，`pass`。

## 5. CP2 来源绑定与采集

#### ConsumeArchiveTrigger 处理流

```text
Inbound Event / ConsumeArchiveTrigger
  │ trusted owner envelope + event id + decision/version refs
  ▼
source authenticity / event dedupe / applicability
  ▼
trigger-to-request admission mapping
  ▼
ArchiveStorePort / local result or blocker
  ▼
TriggerConsumeResult
  event receipt never equals approval or completion
```

关键设计点：只有正式 owner event family 闭合后才可启用；映射仍复用 `RequestArchive` admission，不绕过 authority 与幂等；无法解释时只记录安全 blocker。

#### ConsumeSourceExportFeedback 处理流

```text
Inbound Event / ConsumeSourceExportFeedback
  │ trusted envelope + attempt ref + source version/fence/coverage
  ▼
match ArchiveSourceBinding and CaptureAttempt
  ▼
CaptureCoverage.assess(...) + findings
  ▼
ArchiveStorePort / expected attempt version
  attempt + coverage + findings atomically
  ▼
SourceFeedbackConsumeResult
  unmatched / unknown remains visible
```

关键设计点：`assess(DeclaredScopeRef declared_scope_ref, OwnerCoverageEvidence evidence, SourceCaptureFindingRefSet findings)` 只使用 owner 证明；timeout/无 payload 不是 empty/missing；反馈不能跨 attempt 或 source。

#### PlanArchiveSources 处理流

```text
Operations / PlanArchiveSources
  │ accepted request + frozen DeclaredArchiveScope
  ▼
SourceCaptureService
  source-authority matrix + required/conditional/auxiliary classification
  ▼
ArchiveSourceBinding.plan(...)
  per-source planned / bound / blocked
  ▼
ArchiveStorePort / local transaction
  binding set + job posture
  ▼
SourceBindingPlanResult
```

关键设计点：不固定八类 source 全部必选；workspace 和 observability 不得升格为 canonical；exact port 不存在时保留 Planned/Blocked。

#### CaptureArchiveSource 处理流

```text
Operations / CaptureArchiveSource
  │ bound source + persisted CaptureAttempt + requested fence
  ▼
SourceCaptureService / SourceExportPort
  owner-specific runtime export outside local transaction
  ▼
approved material refs + version/fence/coverage or failure
  ▼
CaptureAttempt.settle(...) / block(...)
  ▼
ArchiveStorePort / expected attempt version
  attempt + coverage + findings atomically
```

关键设计点：外部调用前保存 attempt；每 owner 版本/fence 独立；`settle(ArchivedMaterialRefSet materials, SourceVersionRef version, CaptureCoverage coverage)` 不转移 material truth。

#### ReconcileSourceCapture 处理流

```text
Operations / ReconcileSourceCapture
  │ existing in-progress/blocked/failed attempt + probe context
  ▼
SourceCaptureService
  local result lookup before owner probe
  ▼
SourceExportPort / formal status or result probe
  ▼
settle existing attempt or require explicit replacement
  ▼
ReconciledCaptureResult
  no blind recapture, no hidden overwrite
```

关键设计点：明确失败后的 retry 创建新 attempt 并可 `supersede(CaptureAttemptId replacement_attempt_id)`；若对端不支持 probe，不猜成功或缺失。

#### CP2 处理流停审

两 Consumer、三 Job 均绑定 source/attempt/fence；canonical/auxiliary 与 runtime/event/ref 边界保持，`pass_with AR-UP-001/002/003/006~008`。

## 6. CP3 Bundle 清单与闭包

#### AssembleBundleManifest 处理流

```text
Operations / AssembleBundleManifest
  │ bundle + frozen request + persisted source inventory
  ▼
BundleAssemblyService
  build declared and actual ManifestEntry sets
  ▼
ManifestClosure.evaluate(...)
  complete / incomplete / overfull / invalid / unknown
  ▼
BundleManifest.freeze(...) + ArchiveBundle.attach_manifest(...)
  ▼
ArchiveStorePort / new immutable revision transaction
```

关键设计点：`evaluate(ManifestRevisionId revision, ManifestEntrySet declared_entries, ManifestEntrySet actual_entries)` 是确定输入上的纯计算；修正产生新 revision；不回源、不选择 provider/algorithm。

#### SealArchiveBundle 处理流

```text
Operations / SealArchiveBundle
  │ ClosureReady bundle + fixed manifest revision
  ▼
BundleAssemblyService
  read matching verification, compatibility and placement basis
  ▼
ArchiveBundle.seal(...)
  all required Archive-owned preconditions or blocked
  ▼
ArchiveStorePort / expected bundle version
  sealed state + stage record atomically
  ▼
BundleSealResult
  never project archived business status
```

关键设计点：closure、verification 与 placement 必须绑定同一输入 revision；任何 required 轴 Unknown/Blocked/Failed 都不能 Sealed；是否要求哪些 verification/placement 前置在 03 由正式规则闭合。

#### GetArchiveBundle 处理流

```text
Query / GetArchiveBundle
  │ actor + bundle/revision selector
  ▼
current access and disclosure decision
  ▼
ArchiveStorePort / bundle + immutable manifest + findings
  ▼
source/material ref redaction + posture composition
  ▼
SafeArchiveBundleView / SafeNotAvailable
  no assemble, seal, capture or repair
```

关键设计点：查询可显示 partial/unknown，不从 material count 计算虚假 completeness；未获准 ref 和正文不进入响应。

#### CP3 处理流停审

assembly、seal 和 read 分离，revision 与闭包输入固定；无隐式修复或业务状态写入，`pass`。

## 7. CP4 完整性与兼容评估

#### AssessBundleIntegrity 处理流

```text
Operations / AssessBundleIntegrity
  │ persisted assessment + fixed VerificationInputBinding
  ▼
BundleVerificationService / IntegrityCapabilityPort
  invoke formal capability outside local transaction
  ▼
IntegrityCapabilityFeedback / unknown or unavailable
  ▼
VerificationAssessment.settle(...) + VerificationFinding
  ▼
ArchiveStorePort / input match + local atomic result
```

关键设计点：`settle(IntegrityCapabilityFeedback feedback)` 只映射正式反馈；不生成算法、digest、signature、key；新 revision 或重验建立新 assessment。

#### AssessBundleCompatibility 处理流

```text
Operations / AssessBundleCompatibility
  │ manifest revision + schema refs + target context
  ▼
BundleVerificationService / CompatibilityCapabilityPort
  target-specific formal assessment
  ▼
supported / unsupported / unknown / conflicting
  ▼
CompatibilityAssessment + VerificationFinding
  ▼
ArchiveStorePort / immutable assessment result
```

关键设计点：读取、验证与每个 restore receiver 的 target context 不可互换；未获正式 schema evolution/转换合同时不自动迁移。

#### VerifyArchiveBundle 处理流

```text
Query / VerifyArchiveBundle
  │ actor + bundle + exact manifest revision + selection
  ▼
current access decision
  ▼
ArchiveStorePort / matching assessments and findings
  ▼
input-match check + safe redaction
  ▼
SafeBundleVerificationView / SafeNotAvailable
  no provider call and no re-verification
```

关键设计点：API 名中的 Verify 表示读取验证姿态；若只有旧 revision 结果，返回 stale/not-available 而非 Verified。

#### CP4 处理流停审

integrity、compatibility 和只读验证分轴；所有 provider 调用在 intent/input binding 后进行，`pass_with AR-UP-004/009`。

## 8. CP5 存储与生命周期执行

#### RequestLifecycleExecution 处理流

```text
Command / RequestLifecycleExecution
  │ actor + key + bundle revision + GovernanceDecisionRef + action
  ▼
LifecycleExecutionService / GovernanceDecisionPort
  current applicability, validity, hold/conflict check
  ▼
LifecycleExecution.eligible(...) or blocked/conflict result
  ▼
ArchiveStorePort / local transaction
  execution + optional initial external action intent
  ▼
LifecycleRequestResult
  eligible is not executed or committed
```

关键设计点：同 key 异 input 冲突；decision 读取在本地写事务外，但提交需绑定决定版本；Archive 不解释期限、hold、delete 或 risk policy。

#### ConsumeGovernanceDecisionChange 处理流

```text
Inbound Event / ConsumeGovernanceDecisionChange
  │ trusted governance envelope + decision/version/validity refs
  ▼
event dedupe + formal applicability resolution
  ▼
locate affected placement/lifecycle executions
  ▼
block, invalidate eligibility or wake reconcile
  ▼
ArchiveStorePort / per-target local updates
  old release/delete never overrides newer hold
```

关键设计点：事件只是变化提示/正式 ref 载体；跨 Bundle fan-out 不宣称全局事务；现时 decision 无法证明时相关危险动作 fail-closed。

#### ConsumeStorageActionFeedback 处理流

```text
Inbound Event / ConsumeStorageActionFeedback
  │ trusted storage envelope + action id + feedback ref
  ▼
match ExternalActionRecord key/digest/attempt
  ▼
map ack / commit / failure / commit-unknown
  ▼
ArchivePlacement or LifecycleExecution.apply_feedback(...)
  ▼
ArchiveStorePort / expected local version
  duplicate is stable; unmatched is quarantined
```

关键设计点：ACK 和 transport delivery 不等于 durable commit；feedback 不能跨 action/target；provider 原始 payload 不进入领域 truth。

#### PlaceArchiveBundle 处理流

```text
Operations / PlaceArchiveBundle
  │ fixed bundle revision + persisted placement intent/action
  ▼
PlacementService / ArchiveStoragePort
  dispatch idempotent external action
  ▼
storage ack / commit / failure / timeout
  ▼
ArchivePlacement.settle(...) + ExternalActionRecord.settle(...)
  ▼
ArchiveStorePort / local result
  timeout becomes CommitUnknown, then reconcile
```

关键设计点：外部调用前已通过 `record_intent(...)` 保存 action；本流不选择 provider/tier/secret；local commit unknown 先读本地 action 结果。

#### RetrieveArchiveBundle 处理流

```text
Operations / RetrieveArchiveBundle
  │ placement + persisted retrieval intent
  ▼
PlacementService / ArchiveStoragePort
  dispatch retrieval request
  ▼
retrieval feedback / probe
  ▼
ArchivePlacement.record_retrieval(...)
  ▼
ArchiveStorePort / retrieval-axis update
  placement commit state remains independent
```

关键设计点：Requested 不等于 Retrievable；恢复只能消费当前可取回证明；取回失败不反向修改 manifest/verification。

#### ExecuteArchiveLifecycle 处理流

```text
Operations / ExecuteArchiveLifecycle
  │ eligible execution + persisted ExternalActionRecord
  ▼
re-read decision validity / hold / target version
  ▼
LifecycleExecutionService / ArchiveStoragePort
  dispatch allowed action
  ▼
ack / commit / failure / timeout
  ▼
LifecycleExecution.apply_feedback(...) + local result
```

关键设计点：执行前再次核对新 hold/conflict；delete/transition 必须有正式 action authority；Committed 也只代表外部执行反馈，不代表治理决定 truth 被 Archive 拥有。

#### ReconcileExternalAction 处理流

```text
Operations / ReconcileExternalAction
  │ CommitUnknown placement/execution/action
  ▼
local result lookup + same intent digest check
  ▼
ArchiveStoragePort / formal probe if supported
  ▼
LifecycleExecution.reconcile(...) or placement settle
  ▼
committed / failed / still unknown / compensation-required
  no blind replay
```

关键设计点：probe 不支持时保留 unknown 并转人工/获准补偿；retry 必须复用正式幂等语境或建立明确新 attempt，不能 last-write-wins。

#### CP5 处理流停审

Command、两 Consumer、四 Job 均保留 decision/action/ack/commit/unknown 分层；无 policy/provider 真相越界，`pass_with AR-UP-003/005`。

## 9. CP6 恢复计划与交接

#### ConsumeRestoreReceiverFeedback 处理流

```text
Inbound Event / ConsumeRestoreReceiverFeedback
  │ trusted receiver envelope + event id + handoff/outcome refs
  ▼
match owner-specific RestoreHandoff and input digest
  ▼
HandoffOutcome.observe(...)
  ▼
RestoreHandoff.apply(...) + RestoreItem.apply_outcome(...)
  ▼
ArchiveStorePort / outcome + item + plan posture atomically
  never set owner business state
```

关键设计点：不同 owner 反馈不共享事件键或 commit 语义；ACK、Succeeded、Rejected、Conflicting、CommitUnknown 明确区分；unmatched 反馈不写入其他 item。

#### BuildRestorePlan 处理流

```text
Operations / BuildRestorePlan
  │ accepted RestoreRequest + fixed bundle revision
  ▼
RestoreService
  read closure / integrity / compatibility / retrieval / authority
  ▼
per-owner RestoreItem.plan(...)
  blocked reasons remain item-specific
  ▼
RestorePlan.freeze(...) / recompute(...)
  ▼
ArchiveStorePort / immutable plan revision transaction
```

关键设计点：每个 owner/slice 独立 item；计划冻结后不能静默换 manifest、material 或 receiver；Global Ready 不能吞掉 blocked optional/required 差异。

#### PrepareRestoreMaterial 处理流

```text
Operations / PrepareRestoreMaterial
  │ planned item + approved manifest entries + current eligibility
  ▼
RestoreService
  verify owner match, integrity, target compatibility and retrieval
  ▼
minimal owner-specific materialization through approved seam
  ▼
RestoreItem.bind_material(...)
  ▼
ArchiveStorePort / MaterialReady or explicit Blocked
```

关键设计点：材料只来自固定 manifest/ref；unsupported-version、integrity-failed、missing/stale/conflicting 或 unavailable 均阻塞；不创造 owner schema/正文/写权。

#### DispatchRestoreHandoff 处理流

```text
Operations / DispatchRestoreHandoff
  │ MaterialReady item + persisted RestoreHandoff intent
  ▼
RestoreService / owner-specific RestoreReceiverPort
  dispatch idempotent handoff outside local transaction
  ▼
receiver ack / outcome / timeout
  ▼
HandoffOutcome + RestoreHandoff / RestoreItem update
  ▼
ArchiveStorePort / local result
  timeout becomes CommitUnknown
```

关键设计点：调用前 `record_intent(...)` 已提交；不共享 owner 数据库或事务；Succeeded 仅保存 receiver 声明，不代替 owner business truth。

#### ReconcileRestoreHandoff 处理流

```text
Operations / ReconcileRestoreHandoff
  │ CommitUnknown or ReconcileRequired handoff
  ▼
local outcome lookup + receiver/input binding check
  ▼
RestoreReceiverPort / owner-specific probe
  ▼
confirmed outcome / still unknown / conflict
  ▼
RestoreHandoff + RestoreItem + plan posture update
  retry or compensation only after explicit decision
```

关键设计点：不支持 probe 时不能自动重放；conflicting/unknown 保留并要求人工或正式 compensation authority；其他 owner item 不受推导。

#### ExecuteRestoreCompensation 处理流

```text
Operations / ExecuteRestoreCompensation
  │ authorized CompensationRecord + original handoff
  ▼
RestoreService
  verify authority, target and current receiver capability
  ▼
RestoreReceiverPort / approved compensation action
  ▼
feedback / timeout
  ▼
CompensationRecord.apply_feedback(...)
  preserve original handoff and outcome history
```

关键设计点：补偿意图同样先本地持久化；timeout 为 CommitUnknown；Completed 不抹除原副作用，也不反向宣布 owner truth 已恢复。

#### GetRestorePlan 处理流

```text
Query / GetRestorePlan
  │ actor + plan selector
  ▼
current access decision
  ▼
ArchiveStorePort / plan + item + safe posture
  ▼
per-owner material/ref redaction
  ▼
SafeRestorePlanView / SafeNotAvailable
  no retrieval, preparation, dispatch or reconcile
```

关键设计点：Partial/Blocked/CommitUnknown 必须逐 item 可见但受权限裁剪；不将 HandoffComplete 显示为项目 Restored。

#### GetRestoreHandoffStatus 处理流

```text
Query / GetRestoreHandoffStatus
  │ actor + item/handoff selector
  ▼
current owner/material disclosure decision
  ▼
ArchiveStorePort / handoff + outcomes + compensation history
  ▼
safe result composition
  ▼
SafeRestoreHandoffView / SafeNotAvailable
  no receiver probe, retry or compensation
```

关键设计点：旧成功也须当前访问许可；无记录不等于 rollback；query 不消费 receiver event 或改变 plan posture。

#### CP6 处理流停审

Consumer、五 Job、两 Query 均有独立口径；per-owner、fixed input、intent/result、commit-unknown/compensation 保持，`pass_with AR-UP-002/009`。

## 10. Outbound candidate 与未展开接口取舍

`ArchiveJobPostureChanged`、`ArchiveBundleSealed`、`RestoreHandoffPostureChanged` 尚无已核验事件合同，因此本步不画 publisher 成功流。若 03 获得正式合同，只能从与本地状态同事务的 committed fact/outbox record 启动，传播失败不得回滚已提交业务状态，也不得生成虚假 delivery evidence。当前没有合法依据把 outbox record 增补为 Step 6 正式对象。

required ports 是处理流接缝，不是外部 API 实现；其 exact 函数、schema、错误映射和 adapter 文件留 03，provider 参数留 04。

## 11. 跨处理流一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 7 入口覆盖 | pass | 3 Command、5 Consumer、17 Job、5 Query 均有独立图或明确 no-write 图。 |
| Step 6 对象引用 | pass | 所有正式状态主语均已在 Step 6 定义；未新增领域对象。 |
| 原子边界 | pass | 仅声明 Archive 本地原子提交；外部 I/O 与跨 owner 均不在事务内。 |
| snapshot fence / revision | pass | capture、manifest、assessment、placement、restore 均绑定确定输入。 |
| 幂等 / commit unknown | pass | request、external action、handoff 先查 key/digest/result；未知先 reconcile。 |
| 查询边界 | pass | 5 Query 均 no-write，不触发 capture/verify/retrieve/restore/retry。 |
| 外部合同 | blocked_not_fabricated | owner/provider/receiver/outbound contract 仍为 required seam。 |
| 历史污染 | pass | 无同步全链路成功、cached index、replay、共享数据库、固定 SLA/provider。 |

## 12. 回填草稿、待确认与进入下一步条件

正式 §8 摘录通用约束及关键流；为控制正式正文密度，可把同类反馈/查询流保留为表格，但不得丢失 intent-before-effect、fence、per-owner、no-write 与 unknown-reconcile 判断。

待确认仍为各外部 exact contract、outbox/event family、事务性 committed fact 能力及所有 provider/receiver probe 语义；本步未预签这些能力。

六 CP 已逐项停审，接口覆盖、对象引用、事务边界与未知副作用处置通过。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 9。
