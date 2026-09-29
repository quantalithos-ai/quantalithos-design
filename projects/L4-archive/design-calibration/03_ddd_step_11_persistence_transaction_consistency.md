# L4-archive 03 Step 11：持久化、事务与一致性契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填位置：未来正式 `03-详细设计.md` §10
> 日期：2026-09-12
> 状态：`completed / pass_with_upstream_blockers / stop_review`

## 1. Step 状态、输入与完成上限

| 项目 | 本 Step 结论 |
|---|---|
| 前置与授权 | Step 01～10 已完成；用户明确授权 Step 11，未授权 Step 12 |
| 直接输入 | 正式 `00/01/02`；Step 06 对象；Step 07 repository/UoW；Step 08 协议；Step 09 flows；Step 10 状态矩阵 |
| 规范输入 | 详细设计 SOP Step 11、书写规范 §5.10、设计真相源闭环与可落码性标准的 version/UoW/read-set/result/projection/outbox 条款 |
| 粒度参考 | `L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`；只参考组织和落码粒度，不继承治理主语、projection/outbox 或存储选择 |
| 本步目标 | 收稳 26 个正式对象、技术 sidecar、结果、claim/checkpoint 的 logical store、既有 repository 语义、事务边界、一致性和 fake/durable parity |
| 不在本步 | 物理数据库、DDL/migration、provider、算法、KMS/secret、压缩/schema evolution、容量数值、错误恢复算法、并发重试算法和正式 03 装配 |
| 事实上限 | 本文件是设计中间产物；不证明目标实现仓、数据库、外部合同、归档/恢复成功、测试结果或 readiness |

本 Step 不新增 Step 07 未定义的 repository 方法。函数签名的唯一真相仍是 Step 07；本文只给出其 logical persistence、key/index/version、事务与错误语义。持续 blocker 为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`，无新增 owning-project blocker。

## 2. 分批写入与内部停审

| 批次 | 内容 | 状态 |
|---|---|---|
| 11.1 | SOP 回答、问题诊断、取舍、数据所有权实现表 | completed / internal_review_pass |
| 11.2 | logical store、主键/唯一键/索引/version/cursor 契约 | completed / internal_review_pass_with_pending |
| 11.3 | Step 07 repository 函数族持久化语义、fake/durable parity | completed / internal_review_pass |
| 11.4 | 3 Command、5 Query、5 Consumer、17 Job 与 worker/effect 事务边界 | completed / internal_review_pass_with_upstream_blockers |
| 11.5 | 一致性、失败恢复、跨 Step 06～10 闭环与停审检查 | completed / stop_review |

## 3. SOP 问题回答

| 问题 | 回答 / 取舍 |
|---|---|
| 哪些数据由本仓拥有？ | 归档/恢复请求，Archive 作业，source binding/capture 观察，Bundle/manifest/closure，assessment，placement/lifecycle/action，restore plan/item/handoff/outcome/compensation，以及本地 operation result、visibility binding、claim/checkpoint/ordinal/transaction probe。 |
| 哪些只是引用、快照或投影？ | 八类 source 的 owner-approved snapshot/material/ref、governance decision ref、workspace projection、artifact/lineage ref、observability material、storage/receiver/crypto evidence 都不是本仓 canonical truth。`DeclaredArchiveScope` 与 `GovernanceDecisionRef` 分别内嵌其 owning record，不建影子主表。 |
| repository 如何定义？ | 完整 callable surface 已在 Step 07 固定；本文按 `Admission/Capture/Bundle/Assessment/StorageState/Restore/OperationResult/VisibilityResolution/WorkerControl/FixedInput/WorkerCandidate` 分族裁定持久化语义。 |
| 哪些 flow 需要事务？ | 3 Command、5 Consumer、17 Job 的每次本地状态/结果提交都需要短 UoW；5 Query 只使用 committed read session。任何 external I/O 均在 intent/attempt 提交后、UoW 外执行，反馈另开 UoW。 |
| 如何控制并发？ | mutable truth 使用 `Versioned<T>` + `ExpectedVersion`；UoW 还验证所有 guard read、negative read、range predicate 和 worker claim/fence，达到 serializable-equivalent read-set。没有 last-write-wins/upsert。 |
| 是否有 outbox/projection？ | 没有独立 Archive projection truth；五个 Query 在 committed read snapshot 即时安全组装。`AR-HLD-Q-001` 未关闭，禁止创建 outbox/publisher store、状态机或 delivery evidence。 |
| 事件发布或 projection 失败如何恢复？ | 当前没有这两类本地写面，因此不存在异步补偿。未来若 outbound 被正式解锁，必须回退 02 Step 6～9 与 03 Step 4～11 重新闭合；本 Step 不预建。 |

## 4. 问题诊断与设计取舍

### 4.1 当前问题诊断

| 来源 | 问题 | 本 Step 处置 |
|---|---|---|
| Step 07 | callable surface 已完整，但尚未统一映射 logical store、唯一键、索引、read-set 和 commit probe | §6～§11 固定语义，不另造 API |
| Step 09 | 多个外部 flow 已写 intent-before-effect，但 intent、结果、checkpoint 原子性需统一 | §9～§10 按 prepare/effect/reconcile 三段事务固化 |
| Step 10 | 18 个状态主语需要明确 mutable/immutable、version 与 history 落点 | §5～§7 逐对象裁定 |
| Step 08 | `ArchiveRepositoryCursorMapping` 形状存在，但 codec 或持久映射责任未闭合 | 登记 `pending/fail-closed`；不私造 cursor store、签名或加密算法 |
| external authority | storage/crypto/source/receiver/governance exact 合同尚有 blocker | 只持久正式 mapped input/outcome/ref；缺合同不能构造正向状态 |
| outbound candidate | 三个 candidate 没有正式 event family/payload/topic | `AR-HLD-Q-001` 下保持 no outbox/no publisher/no delivery truth |

### 4.2 关键取舍

| 议题 | 选择 | 约束 |
|---|---|---|
| 物理数据库/DDL | 只定义 logical contract | durable adapter 可合并或拆表，但必须保持等价 key/index/version/transaction；不指定 PostgreSQL/S3 等历史选择 |
| aggregate 存储 | object boundary + logical child/member collection | 可物理序列化成一行或规范化多行；repository 必须完整 round-trip，不能暴露部分 aggregate 为成功 |
| immutable append | 同键同完整内容幂等复用 | 同键异内容 `UniqueConflict`；不得覆盖、静默 merge 或以时间判 latest |
| optimistic update | `Absent` create；`Exact(version)` update | version 只能来自当前 snapshot/Tx 的 versioned read；禁止 hard-code、cursor、timestamp、owner version替代 |
| isolation | serializable-equivalent read-set | 除写行 CAS 外，必须验证 guard/negative/range/fence；backend 做不到即 `ContractBlocked` |
| Query | committed snapshot 即时组装 | no write UoW、cache repair、result reservation、external effect；Archive 无独立 projection store |
| 本地 commit unknown | `ArchiveTransactionRef + probe_commit` | 不盲重试；probe 的缺失/不确定不能当 Aborted |
| 外部 commit unknown | 固定 intent + typed probe/reconcile | 新 operation/result 记录保守结果；不复用已完成 operation 盲重发 |
| cursor mapping | 当前 pending | 在 codec/config/持久映射 owner 闭合前继续页 fail-closed；不得令 public cursor 等于 repository cursor |

## 5. 数据所有权实现表

### 5.1 两个 contracts 对象与 24 个 domain 对象

| 数据对象 | logical owner / 持久归属 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `DeclaredArchiveScope`（contracts 1/2） | 内嵌 `ArchiveRequest`；不设独立 mutable truth | C01/E01 admission append | admission、binding、manifest、visibility | immutable；`get_declared_scope` 以 request+scope version 精确解析；不得返回另一 revision |
| `GovernanceDecisionRef`（contracts 2/2） | 内嵌 `LifecycleExecution` 的原决定/current history | C03/E03/J11/J12-L 保存 mapped ref | lifecycle guard/query | immutable body-free ref；owner version 不等本地 `RecordVersion`；不建 RetentionPolicy/hold/delete truth |
| `ArchiveRequest`（domain 1/24） | admission request collection | C01/E01 | job/source/query | immutable append；key 内容冲突拒绝；Accepted 不等 archived |
| `ArchiveJob`（2/24） | job aggregate collection | C01/C02/E01 admission；J01 aggregate/stage advance | job query/worker；其他 Jobs 提交 component truth 供 J01 读取 | mutable CAS；request 唯一 job；stage/component result 与对应 transition 同一相关 UoW |
| `ArchiveJobStageRecord`（3/24） | append-only stage history | admission/J01 | job query/resume | PK 与 `(job, ordinal)` 唯一；与对应 job transition 原子提交 |
| `ArchiveSourceBinding`（4/24） | source binding collection | J02 | J03/J05/query | mutable CAS；`(request, selector, requiredness identity)` 约束重复；workspace 不可升级 canonical |
| `CaptureAttempt`（5/24） | capture attempt collection | J03/J04/E02 | manifest/verification/query | mutable CAS；attempt input 固定；late/conflicting 不覆盖旧 attempt |
| `CaptureCoverage`（6/24） | `CaptureAttempt` nested final coverage | J04/E02 随 attempt 保存 | J05/J06/query | 与 settled attempt 同 UoW/同 key；无独立 mutable version |
| `SourceCaptureFinding`（7/24） | append-only source finding | J03/J04/E02 | job/query/audit-safe result | immutable；`(attempt, finding id)`；raw owner/provider body forbidden |
| `ArchiveBundle`（8/24） | bundle aggregate collection | J05/J06 | C02/Q02/J13 | mutable CAS；archive request 唯一 bundle；current revision/manifest/seal basis 同步 |
| `BundleManifest`（9/24） | immutable manifest revision collection | J05 | Q02/J06/J13/J14 | manifest、entries、closure、source sidecar 原子 append；revision 不可覆盖 |
| `ManifestEntry`（10/24） | nested immutable manifest member | 仅 `append_manifest` | bundle/restore/query | `(revision, entry id)` 与 material identity 约束；不提供独立 update |
| `ManifestClosure`（11/24） | nested immutable manifest closure | 仅 `append_manifest` | J06/J13/query | declared/actual exact sets 与 findings 完整保存；分页未尽不得 Complete |
| `ClosureFinding`（12/24） | append-only closure finding | J05 | J06/query/result | immutable；绑定 exact revision；不删除旧 finding |
| `VerificationAssessment`（13/24） | verification assessment collection | J07 | Q03/J06/J13 | mutable CAS 支持 Pending/InProgress 到终态；input binding 固定；Verified 需正式 evidence |
| `CompatibilityAssessment`（14/24） | immutable target-specific assessment | J08 | Q03/J06/J13 | `(revision,target,schemas,assessment id)` exact；不做“最新成功”fallback |
| `VerificationFinding`（15/24） | append-only assessment finding | J07/J08 | Q03/J06/J13/result | immutable；绑定 assessment；adapter draft 不生成本地 ID |
| `ArchivePlacement`（16/24） | placement/retrieval state collection | J09/J10/J12/E04-P | Q02/J06/J13/J14 | mutable CAS；placement commit 与 retrievability 两轴独立；ACK 不等 Committed |
| `LifecycleExecution`（17/24） | lifecycle execution collection | C03/E03/E04-L/J11/J12-L | Q02/worker | mutable CAS；decision history保留；只消费正式治理结论，不反写治理/项目状态 |
| `ExternalActionRecord`（18/24） | external action intent/history collection | C03/J09/J10/J11/J12/E04 | routing/reconcile/query | mutable CAS；effect key 唯一；persisted target 决定 E04/J12 互斥路由；观察历史不覆盖 |
| `RestoreRequest`（19/24） | admission request collection | C02 | plan/job/query | immutable append；owner set、bundle revision、authority 固定；Accepted 不等 restorable/restored |
| `RestorePlan`（20/24） | restore plan aggregate collection | J13；E05/J16/J17 仅在完整 item posture 可重算时更新 | Q04/J14～J17 | mutable CAS；`(request, plan_revision)` 唯一；frozen item set 精确覆盖；无跨 owner transaction |
| `RestoreItem`（21/24） | per-owner item collection | J13～J17/E05 | Q04/Q05/worker | mutable CAS；owner/revision/entry set 固定；一个 owner 结果不传播其他 owner |
| `RestoreHandoff`（22/24） | receiver intent/history collection | J15/J16/E05 | Q04/Q05/J17 | mutable CAS；receiver effect key 唯一；intent-before-effect；ACK/Success/Unknown 独立 |
| `HandoffOutcome`（23/24） | append-only receiver observation | J16/E05 | handoff/item/query/result | immutable；同反馈同内容可复用，冲突另存并触发 reconcile，不覆盖历史 |
| `CompensationRecord`（24/24） | compensation intent/history collection | J17 | item/query/result | mutable CAS；独立 receiver key/input；Completed 不改原 handoff 或 owner state |

### 5.2 技术载体、fixed input 与外部材料归属

| 数据/载体 | 本地持久归属 | 一致性规则 | 明确不拥有 |
|---|---|---|---|
| `BoundSourceRecord` | binding-keyed formal outcome sidecar | `Planned` binding 已提交后，外调输入从 immutable request/scope + binding fields 精确重构；正式 Bound outcome 与 binding transition 同 UoW 追加本记录 | owner source truth/contract body |
| `SourceCaptureInput` / `CapturedSourceRecord` | attempt-keyed input/final mapped observation | input 在 effect 前提交；final record 与 settled attempt/findings 同 UoW | L1 live DB、未获准正文 |
| `ManifestSourceRecord` | manifest-keyed exact selection sidecar | 与 manifest revision/entries/closure 同 append | 重新扫描 owner current state的权力 |
| `CompatibilityInput` / `VerificationInputBinding` | assessment-keyed/referenced fixed input | 先于 assess；terminal assessment 与同一 fixed input exact match | 算法、key、schema authority |
| `StorageDispatchInput` | `StorageIntent` keyed immutable sidecar | 与 action/placement/lifecycle intent 同 UoW；dispatch 从此读回 | provider secret、endpoint truth、object-store ownership |
| `PreparedRestoreMaterial` | restore-item keyed immutable material/ref sidecar | exact owner/revision/entries；与 item MaterialReady transition 同 UoW | Artifact body/lineage、owner canonical truth |
| `HandoffDispatchInput` | handoff-keyed immutable sidecar | 与 handoff intent + item attach 同 UoW；receiver dispatch 只读此输入 | receiver DB 写权 |
| `CompensationDispatchInput` | compensation-keyed immutable sidecar | 与 compensation Planned/InProgress intent 同 UoW | 补偿授权或 owner decision truth |
| `ArchiveVisibilityBinding` | root request keyed immutable relation | 与被受理 request 原子提交；query 每次重评 current visibility | permission cache、identity/governance truth |
| `ArchiveIdempotencyRecord` + `CompleteArchiveResult` | operation-keyed reservation + result collection | complete stored result → complete reservation → business/history/checkpoint 一起 commit | 当前 truth 重算结果、raw payload/body |
| `WorkerClaim` / `WorkerCheckpoint` | claim collection / append-only checkpoint collection | claim/fence 在业务 commit 时重验；checkpoint 与完整 result 同 UoW | owner/business authority、Bus ACK truth |
| ordinal allocators | per request/target/entry-target counter state | allocation 与 consuming record 同 Tx；rollback 无可见 ordinal | record version、owner sequence |
| `ArchiveTransactionRef` / commit outcome | durable transaction outcome registry or backend-equivalent stable probe surface | begin 后可稳定 probe；Unknown 不降级 Aborted | external effect commit truth |
| `ArchiveRepositoryCursorMapping` | `pending`：stateless authenticated codec 或 durable mapping 尚未裁定 | public/private cursor 必须分离并绑定 principal/visibility/selector/snapshot/order/kind；未闭口 fail-closed | cursor 伪装 version/fence/permission |
| owner snapshots/material refs | captured source/manifest entry/assessment/restore material 中的 typed ref/value | 按 source-authority class 保真；来源 version/fence/coverage 不跨 owner 比较 | identity/conversation/work/process/governance/artifact/workspace/observability canonical truth |

### 5.3 明确不持久化的对象与载体

| 对象 / 载体 | 处置 | 理由 |
|---|---|---|
| 五类 `Safe*View`、safe metadata 与全部 Step 08 DTO/response | 在一个 read snapshot 内即时组装，不保存 | 它们是披露裁剪后的读结果；保存会形成第二份 projection truth 或泄露旧权限结果 |
| `ArchiveReadResolution`、`CurrentArchiveDisclosure`、`ArchiveReadVisibilityDecision` | invocation-local；只保存其根 relation `ArchiveVisibilityBinding` | current visibility 必须每次由正式 capability 重评，不做 permission cache |
| `ExternalEffectCorrelation`、`ExternalDispatchPermit` | 从 persisted intent/current authority 构造，调用后丢弃 | correlation 的组成字段已在 action/handoff/compensation 与 fixed input 中；permit 不能变永久授权 |
| `ArchiveOperationContext` 与 protocol envelope | 不整体保存；只把正式 operation key、result trace、request/record 必需字段分别持久化 | 避免复制 actor/transport metadata 成业务 truth；完整 replay 由 typed result surface承担 |
| `ArchiveRuntimeBindings`、`AdapterAvailabilityMarker`、`ArchiveRuntimeAssembly` | runtime/config state；Step 14 决定是否需要 infra-local durable state，不进入 Archive business store | provider/config/secret owner 未闭合；availability 不等业务 readiness |
| `ArchiveCommandEntry` / `ArchiveQueryEntry` / `ArchiveWorkerEntry` / `WorkerItemDisposition` | process-local entry state，不作业务或 durable worker truth | durable resume 只由 operation result、claim、checkpoint 与业务对象提供；不得以 runner 内存状态证明完成 |
| external port response raw body/error | 禁止保存 | 只允许 Step 07 mapper 产出的 typed safe outcome/ref/finding；不复制 sibling/provider truth |

### 5.4 Source-authority persistence matrix

| SourceClass | 正式 owner | 保存的 material class / provenance | 本地可做 | 禁止升级 |
|---|---|---|---|---|
| Identity | `L1-identity` | `CanonicalSnapshot` + owner/version/fence/coverage refs | 保存获准 snapshot/material ref 与 capture posture | identity body/current truth |
| Conversation | `L1-conversation` | `CanonicalSnapshot` + owner version/coverage | 保存获准正文材料或 ref 的固定清单 | 未授权 conversation body |
| Work | `L1-work` | `CanonicalSnapshot` / approved decision ref | 保存项目/work snapshot引用与明确 coverage | archived/dissolved/restored 状态写权 |
| Process | `L1-process` | `CanonicalSnapshot` + instance/checkpoint provenance | 保存 owner-approved continuity material | 重放或推进 runtime execution |
| Governance | `L1-governance` 或明确 owner | `CanonicalSnapshot` / `DecisionReference` | 保存正式决定 ref、版本、scope、validity | retention/hold/delete/risk 裁决 |
| Artifact | `L1-artifact` | `ArtifactMaterial` + artifact/version/lineage/baseline/coverage ref | 保存 approved material/ref closure | 通用 Artifact 正文/血缘 truth |
| WorkspaceProjection | `L1-workspace` | `WorkspaceProjection` + revision/generation/source coverage | 仅保存显式 Auxiliary 投影材料 | 任一 L1 canonical truth 或缺口补全 |
| ObservabilityMaterial | `L4-observability` | `ObservabilityMaterial` + redaction/coverage refs | 保存获准脱敏材料/ref | 完整审计链或观测后端 truth |

## 6. Logical store / collection 契约

本表不是 DDL。一个 durable adapter 可以合并或规范化这些 collection；只要 Step 07 的聚合读取/保存保持完整、事务语义等价、fake 与 durable 行为一致即可。

| Logical store / collection | 用途 | 主键 / 唯一键 | 必需查询索引 | version |
|---|---|---|---|---|
| `archive_requests` | archive admission + nested scope | PK `archive_request_ref`；immutable content；operation key 由 idempotency store 唯一 | project/scope 只供 exact relation，不提供跨 owner truth scan | none / immutable |
| `restore_requests` | restore admission | PK `restore_request_ref`；immutable | bundle revision、target owner set exact relation | none / immutable |
| `archive_jobs` | job aggregate | PK `job_ref`；unique `request_ref` | request lookup、candidate posture/stage | `record_version` / `job_version` 同 token |
| `archive_job_stages` | stage history | PK `stage_id`；store-internal unique `(job_ref, append_ordinal)`；ordinal 由 `append_stage` 原子分配，不新增 public port | `(job_ref, append_ordinal, stage_id)` | none / append-only |
| `archive_source_bindings` | per-slice binding | PK `binding_ref`；unique active/frozen declaration identity `(request,selector,requiredness)` | request + stable binding identity/state | `record_version` |
| `archive_capture_attempts` | capture progress + nested coverage | PK `attempt_ref` | `(binding_ref, stable attempt identity/state)` | `record_version` |
| `captured_source_records` | fixed final owner-mapped inventory | PK/unique `attempt_ref` | exact attempt | none / immutable |
| `source_capture_findings` | safe source findings | PK `finding_ref` | `(attempt_ref, finding_ref)` | none / append-only |
| `archive_bundles` | bundle aggregate/current revision/seal basis | PK `bundle_ref`；unique `archive_request_ref` | request, current revision/state | `record_version` / `bundle_version` 同 token |
| `bundle_manifests` | immutable manifest+entries+closure | PK `manifest_ref`；unique `revision_ref` and `(bundle_ref, manifest_revision)` | bundle revision/order; entry role; closure | none / immutable aggregate |
| `closure_findings` | closure history | PK `finding_ref` | `(revision_ref, finding_ref)` | none / append-only |
| `verification_assessments` | integrity assessment progress | PK `verification_ref` | exact `VerificationInputBinding`, revision/posture | `record_version` |
| `compatibility_assessments` | immutable target result | PK `compatibility_ref`；同 PK 内容不可变；允许同 selection 的多次明确 assessment | `(revision,target,schemas,compatibility_ref)` | none / immutable |
| `verification_findings` | integrity/compatibility findings | PK `finding_ref` | `(assessment_ref, finding_ref)` | none / append-only |
| `archive_placements` | placement/retrieval state | PK `placement_ref` | `(revision_ref, placement_ref/state)` | `record_version` |
| `lifecycle_executions` | governance-bound lifecycle state | PK `execution_ref` | revision；owner+decision identity/version for affected lookup | `record_version` |
| `external_actions` | external effect intent/history/target | PK `action_ref`；unique full `StorageEffectKey`；key 与 persisted digest/correlation 不匹配即冲突 | target；effect key；posture | `record_version` |
| `storage_dispatch_inputs` | fixed storage input | PK/unique `storage_intent` | exact intent | none / immutable |
| `restore_plans` | plan aggregate | PK `plan_ref`；unique `(restore_request_ref, plan_revision)` | request, revision/state | `record_version`; plan revision separate |
| `restore_items` | per-owner restore progress | PK `item_ref` | `(plan_ref,item_ref)`；owner/state | `record_version` |
| `restore_materials` | prepared material/ref set | PK/unique `item_ref` | exact item | none / immutable |
| `restore_handoffs` | receiver intent/history | PK `handoff_ref`；unique `(handoff-family, ReceiverEffectKey)`；key 与 fixed input不匹配即冲突 | item；effect key；state | `record_version` |
| `handoff_outcomes` | receiver observations | PK `outcome_ref`；仅同 PK 同完整内容可幂等复用 | `(handoff_ref,outcome_ref)` | none / append-only |
| `compensation_records` | compensation state/history | PK `compensation_ref`；unique `(compensation-family, ReceiverEffectKey)`；不得与handoff family混用 | handoff；effect key；state | `record_version` |
| `handoff_dispatch_inputs` / `compensation_dispatch_inputs` | fixed receiver inputs | PK handoff/compensation ref | exact owner record | none / immutable |
| `fixed_source_inputs` | bound source、capture input、manifest source selection、compatibility input | one PK per owning record (`binding/attempt/manifest/assessment`) | exact owning ref | none / immutable |
| `archive_visibility_bindings` | admission root → formal disclosure scope relation | PK/unique root request | root and typed subject traversal | none / immutable |
| `archive_operation_reservations` | non-query idempotency | unique full `ArchiveOperationKey=(scope,channel,operation,key)` | result/state；operation key | `record_version` |
| `archive_complete_results` | immutable complete command/receipt/report replay | PK `result_ref`；unique `surface_ref`；unique operation key after save | result/surface/operation | none / immutable |
| `worker_claims` | exclusive worker lease/fence | PK `claim_id`；unique active exclusion group per business target | target/entry/holder/state | store-side `RecordVersion` |
| `worker_checkpoints` | committed resume point | PK `checkpoint_id`；unique `(entry,target,sequence)`；result relation exact | latest `(entry,target)` | none / append-only |
| `archive_ordinals` | plan/effect/checkpoint monotonic allocation | PK typed namespace+owner key | exact namespace/key | internal CAS/serialization token |
| `archive_transaction_outcomes` | stable local commit probe abstraction | PK `transaction_ref` | outcome only | backend-defined internal token; not domain version |
| `worker_candidate_indexes` | bounded selection derived from committed Archive truth | typed `(operation,target)` candidate identity | operation + stable target order + eligibility predicates | no separate business truth; same transaction as source rows |

### 6.1 Index、identity、version 与 cursor 规则

| 规则 | 可落码约束 |
|---|---|
| PK/typed identity | 所有 ref 必须按类型和 namespace 编码；row ID、URL/path、provider key、fake map key 不能替代正式 ref |
| stable list | page order 使用 typed identity 或明确 append ordinal；必须绑定 parent/filter/order/snapshot。`next=None` 才表示耗尽 |
| negative/range index | `find_*` 未命中和 `list_*` predicate 都进入 Tx read-set；提交验证唯一键与 phantom，不能只验证返回 rows |
| `ExpectedVersion::Absent` | 仅 create；若 PK/唯一键已有，同完整 immutable append规则或 `UniqueConflict/VersionConflict`，不得 update |
| `ExpectedVersion::Exact(v)` | 只接受当前 Tx/committed snapshot versioned read所得 token；对象内部 version 与 wrapper/token 必须一致 |
| staged version | `Staged<K>.version` 只表示当前 UoW staged token，不是 commit evidence；commit Unknown 后不得直接公开为 committed |
| owner versions | source/decision/schema/provider/receiver version 保持 opaque、各 owner 单独比较；不作为 Archive CAS token |
| ordinal | 分配和消费同 Tx；rollback 可产生内部空洞但无可见已提交事实；禁止 `max+1` 无保护计算 |
| transaction identity | `ArchiveTransactionRef` 在 `begin` 返回后稳定，进程恢复可 probe；不得用 operation/result/trace ID 代替 |
| repository cursor | repository-private，绑定 store+snapshot+typed selection+order+last position；不能作为 public cursor/version/fence |
| public cursor mapping | codec/persistent map 选择仍 pending。算法、key/config、expiry/容量未闭合前继续页返回 blocked/typed unavailable；不得默认 base64、签名算法或内存映射 |

## 7. Step 07 Repository 持久化语义

### 7.1 UoW、read session 与 aggregate traits

| 既有函数 / trait | 持久化与事务要求 | 返回 / 错误语义 |
|---|---|---|
| `ArchiveReadStorePort::open_read` | 打开一个 committed、repeatable snapshot；随后所有 get/list/resolve/candidate 必须同 snapshot | store unavailable；snapshot 不能建立则失败，不退化为 current-per-call |
| `ArchiveReadSession::{snapshot_ref,close}` | ref 唯一标识本地 read snapshot；close 无写副作用 | expired/foreign snapshot typed error；close 不生成 evidence |
| `ArchiveStorePort::begin` | 分配 stable transaction ref、read snapshot 与 initial version source；Tx 可读己写 | 不能创建 serializable-equivalent Tx 时 `ContractBlocked/Unavailable` |
| `ArchiveUnitOfWork::{transaction_ref,snapshot_ref,initial_version}` | 所有 staged read/write/ordinal/claim guard 属同一 handle | foreign handle 或跨 store混用拒绝 |
| `ArchiveUnitOfWork::commit` | 原子验证 CAS、guard/negative/range read-set、唯一键、claim/fence，再使 truth/history/sidecar/result/checkpoint 可见 | `Committed/Aborted/Unknown`；可能已提交的失联只能 Unknown |
| `ArchiveUnitOfWork::rollback` | 仅在可证明提交未开始时撤销 staged state | 无 staged truth/history/result/checkpoint 可见；Unknown 不能伪装 rollback success |
| `ArchiveStorePort::probe_commit` | 按 transaction ref 查询稳定 outcome；纯 probe、无 retry/effect | Committed/Aborted/Pending/Unknown；不存在或不可证明不等 Aborted |
| `ArchiveReadPorts` / `ArchiveWritePorts` | read session 只实现 read aggregate；Tx 实现读写 aggregate；不得从 read wrapper逃逸底层写 handle | `ForeignHandle/InconsistentRead` 等安全错误 |

### 7.2 Admission / Capture / Bundle

| 既有 repository 面 | Logical store / key | version / transaction / consistency |
|---|---|---|
| `AdmissionRead` exact get/find/list | requests/jobs/stages；job-by-request 与 stage range index | immutable request exact；job list/get返回 version；negative find与stage range进入 read-set |
| `append_archive_request` / `append_restore_request` | request PK | immutable append；同 key同完整内容可复用，异内容冲突；Accepted admission 与 visibility/job/result 同 UoW |
| `save_job` / `append_stage` | job PK / stage PK | create=`Absent`，update=`Exact`；发生 stage transition 时二者与完整 result/checkpoint 同 UoW |
| `CaptureRead` exact/list/coverage/source/finding | binding/attempt/captured source/findings | list predicate、coverage/source negative read均纳入 closure guard；versioned mutable rows完整返回 |
| `save_binding` + `append_bound_source` | binding PK + same binding sidecar | prepare UoW先以`save_binding(Absent)`提交完整 Planned binding；`SourceBindingInput`随后只能由immutable request/scope +该binding字段重构；正式outcome UoW以`save_binding(Exact)`和`append_bound_source`原子保存authority/contract/participation/fence；sidecar以后不可覆盖 |
| `save_capture` + `append_capture_input` | attempt PK + input sidecar | intent/attempt首次提交先于 source call；同 key异 input `InputConflict` |
| `append_captured_source` / `append_source_finding` | attempt-key final inventory / finding PK | final observation、coverage、attempt transition、findings、result同反馈 UoW；partial/unknown如实保存 |
| `BundleRead` exact/find/list entry/closure/finding | bundle/manifest aggregate/findings | `find_bundle_by_request` 和 revision uniqueness进入read-set；entries完整分页才可closure/seal |
| `save_bundle` | bundle PK | current revision/assembly origin/seal basis CAS；不能用旧 closure 或 current-store fallback |
| `append_manifest` + `append_manifest_sources` | manifest/revision unique + fixed selection | manifest、entries、closure、source selection原子 immutable append；任何子项失败整次 rollback |
| `append_closure_finding` | finding PK | 同内容 duplicate可复用；异内容冲突；与产生它的 manifest/result同 UoW |

### 7.3 Assessment / StorageState / Restore

| 既有 repository 面 | Logical store / key | version / transaction / consistency |
|---|---|---|
| `AssessmentRead` get/list | verification/compatibility/findings | selection 精确含 revision/target/schema；禁止 latest-success lookup；range/read-set用于 seal guard |
| `save_verification` | verification PK | intent create与 input binding固定；反馈 update用 current Exact version；Verified/evidence/finding/result同 UoW |
| `append_compatibility` / `append_verification_finding` | immutable assessment/finding PK | exact input/target；同 key同内容复用，异内容冲突 |
| `StorageStateRead` get/list/find action/intent | placement/lifecycle/action/storage input | decision/revision/target/effect-key indexes完整；E04/J12先读 persisted target再路由 |
| `save_placement` / `save_lifecycle` / `save_action` | mutable PKs | 相关 aggregate/action在同 feedback/reconcile UoW CAS；ACK不能填commit ref，Unknown不能变Failed |
| `append_storage_intent` | unique StorageIntent | 与 action及placement/lifecycle intent同 UoW、先于外部 I/O；以后只读固定输入 |
| `RestoreRead` get/list/find/material/intent | plan/item/handoff/outcome/compensation+sidecars | per-owner exact；range predicates保证plan recompute完整集；effect key lookup negative read进入Tx |
| `save_plan` / `save_item` | mutable plan/item PK | create/update CAS；item set/plan posture必须从完整 frozen set计算；不跨 owner做分布式Tx |
| `save_handoff` + `append_handoff_intent` | handoff PK + same-key fixed input | intent与 item attach 同 UoW；外部调用后用新 Tx/Exact version反馈 |
| `append_handoff_outcome` | outcome PK | observation append-only；同 handoff/item transition/result原子；冲突观察不覆盖旧结果 |
| `save_compensation` + `append_compensation_intent` | compensation PK + fixed input | authority/action/key/input固定；intent先提交；结果不能重写原 handoff |
| `append_restore_material` | item-key immutable sidecar | exact owner/revision/entries/basis；与 item MaterialReady transition/result同 UoW |

### 7.4 Operation result、visibility、worker、fixed input 与 candidate

| 既有 repository 面 | 持久化与一致性语义 |
|---|---|
| `OperationResultRead` 四个 get/find | 必须从同一 operation/result/surface indexes返回同一个完整 `CompleteArchiveResult`；Completed reservation无 payload为 `ResultMissing`，不得重构 |
| `reserve_operation` | full `ArchiveOperationKey` 唯一；同 key同 digest返回 Existing/Replay；异 digest Conflict且不修改原 record；Query禁止调用 |
| `save_complete_result` | 保存 shell+全部 typed payload/details/原 key/digest；immutable；必须先于 `complete_operation` |
| `complete_operation` | 仅接受本 Tx中已存且 kind/key/digest/ref全匹配的 result与 reservation current version；与业务状态/history/checkpoint原子提交 |
| `resolve_read` | 从 visibility root relation按 typed selector遍历；resolution snapshot必须等session snapshot；missing不暴露存在性、不从ID字符串推scope |
| `append_visibility_binding` | 仅 admission root；与 request Accepted及result同 UoW；immutable；current permission仍由外部 visibility port重评 |
| `WorkerControlRead` | claim/version和checkpoint exact/latest；latest order只来自 sequence，不来自 timestamp |
| `protect_with_claim` | 注册 claim/fence/operation/target guard；commit再次验证 active、expiry、排他组和同一 fence；不只是入口时检查 |
| `append_checkpoint_for_result` | sequence由同Tx allocator；只能引用本Tx已staged完整result；与 result/reservation/business state同 commit |
| `WorkerLeasePort::{acquire,renew,release}` | 独立短事务/原子操作；按business target排他而非仅entry；renew/release使用current claim version；lease clock属store |
| `FixedInputRead/Write` | 四类 sidecar以owning ref唯一、immutable、完整 round-trip；missing是前提缺失，不能从current config/fake map补 |
| `OrdinalWrite` | 每个 typed namespace单调；与消费它的 plan/action/checkpoint同Tx；不等CAS/version/evidence |
| `WorkerCandidateRead::list_candidates` | 只从 committed source rows+正式candidate index读取；返回expected version只能来自对应versioned row；不生成计划/状态/authority |

### 7.5 逐函数覆盖索引

下表用方法分组穷举 Step 07 的全部 local store callable surface。每个方法的完整参数、返回和 error enum 仍以 Step 07 为准；本表的作用是证明没有仅写 save 而漏掉 DTO/flow/state 所需 read 面。

| Trait | 读取函数（逐签名方法名） | 写入 / lifecycle 函数 | 语义落点 |
|---|---|---|---|
| `ArchiveReadSession` | `snapshot_ref` | `close` | §7.1 committed snapshot / no-write |
| `ArchiveUnitOfWork` | `transaction_ref`、`snapshot_ref`、`initial_version` | `commit`、`rollback` | §7.1、§9.1、§10.5 |
| `ArchiveReadStorePort` / `ArchiveStorePort` | `open_read`、`probe_commit` | `begin` | §7.1；probe 无副作用 |
| `AdmissionRead/Write` | `get_archive_request`、`get_restore_request`、`get_declared_scope`、`get_job_with_version`、`find_job_by_request`、`get_stage`、`list_stages` | `append_archive_request`、`append_restore_request`、`save_job`、`append_stage` | §7.2 admission/job/stage |
| `CaptureRead/Write` | `get_binding_with_version`、`list_bindings`、`get_capture_with_version`、`list_captures`、`get_capture_coverage`、`get_captured_source`、`get_source_finding`、`list_source_findings` | `save_binding`、`save_capture`、`append_captured_source`、`append_source_finding` | §7.2 binding/attempt/observation |
| `BundleRead/Write` | `get_bundle_with_version`、`find_bundle_by_request`、`get_manifest`、`find_manifest_by_revision`、`list_manifests`、`get_manifest_entry`、`list_manifest_entries`、`get_manifest_closure`、`get_closure_finding`、`list_closure_findings` | `save_bundle`、`append_manifest`、`append_closure_finding` | §7.2 immutable aggregate + CAS |
| `AssessmentRead/Write` | `get_verification_with_version`、`list_verifications`、`get_compatibility`、`list_compatibilities`、`get_verification_finding`、`list_verification_findings` | `save_verification`、`append_compatibility`、`append_verification_finding` | §7.3 exact input/target |
| `StorageStateRead/Write` | `get_placement_with_version`、`list_placements`、`get_lifecycle_with_version`、`list_lifecycles`、`list_lifecycles_by_decision`、`get_action_with_version`、`find_action_by_key`、`list_actions`、`get_storage_intent` | `save_placement`、`save_lifecycle`、`save_action`、`append_storage_intent` | §7.3 target routing/effect history |
| `RestoreRead/Write` | `get_plan_with_version`、`list_plans`、`get_item_with_version`、`list_items`、`get_handoff_with_version`、`find_handoff_by_key`、`list_handoffs`、`get_handoff_outcome`、`list_handoff_outcomes`、`get_compensation_with_version`、`find_compensation_by_key`、`list_compensations`、`get_restore_material`、`get_handoff_intent`、`get_compensation_intent` | `save_plan`、`save_item`、`save_handoff`、`append_handoff_outcome`、`save_compensation`、`append_restore_material`、`append_handoff_intent`、`append_compensation_intent` | §7.3 per-owner exact set/history |
| `OperationResultRead/Write` | `get_reservation_with_version`、`get_complete_result`、`find_complete_result_by_operation`、`get_result_by_surface` | `reserve_operation`、`save_complete_result`、`complete_operation` | §7.4 result-before-complete |
| `VisibilityResolutionRead/Write` | `resolve_read` | `append_visibility_binding` | §7.4 root relation/current disclosure separation |
| `WorkerControlRead/Write` | `get_claim_with_version`、`latest_checkpoint`、`get_checkpoint` | `protect_with_claim`、`append_checkpoint_for_result` | §7.4、§10.5 |
| `WorkerLeasePort` | — | `acquire`、`renew`、`release` | §7.4、§10.5 short atomic lease operation |
| `FixedInputRead/Write` | `get_bound_source`、`get_capture_input`、`get_compatibility_input`、`get_manifest_sources` | `append_bound_source`、`append_capture_input`、`append_compatibility_input`、`append_manifest_sources` | §5.2、§7.4 immutable sidecar |
| `OrdinalWrite` | — | `next_plan_revision`、`next_effect_attempt`、`next_checkpoint_sequence` | §6.1、§7.4 transactional allocator |
| `WorkerCandidateRead` | `list_candidates` | — | §6、§7.4 committed candidate index |

`ArchiveReadPorts` 与 `ArchiveWritePorts` 只聚合上表 capability，不增加函数。`ArchiveIdSource`、`ArchiveClock`、authority/visibility/source/integrity/compatibility/governance/storage/receiver ports 是 support 或 external capability，不是 repository；它们的结果只有经上表 UoW 保存后才成为本地事实。

### 7.6 Support / external capability 的持久化接缝

| 非 repository capability | 持久化接缝 | 约束 |
|---|---|---|
| `ArchiveIdSource` 的 25 个 `*_id/*_ref` 方法 | 返回值只在对应 append/save/result UoW 中作为本地 identity 使用 | 冲突由 logical PK/unique key 拒绝；ID 本身不是已提交事实、版本、digest 或 evidence |
| `ArchiveClock::recorded_at` | 复制到对应 domain observation/result/history | 本地观察时间；不证明 owner event time、lease validity 或 commit time |
| `ArchiveAuthorityPort::{authorize,resolve_admission_visibility,authorize_replay}` | Allowed 的正式 evidence/ref 只进入 exact request/visibility binding或本次披露结果；replay 不改 stored result | authority调用在本地 Tx 外；Denied/Unavailable不得通过 fake/default 转 Allowed |
| `ArchiveVisibilityPort::evaluate` | 不持久 current decision；只用于本次 safe view/result disclosure | query/replay no-write；旧 basis 不缓存成permission |
| `SourceExportPort` / `IntegrityCapabilityPort` / `CompatibilityCapabilityPort` | 只把 typed mapped outcome保存到本地对象/finding/sidecar | external call在UoW外；raw body/算法/key不入store；unknown不升级success |
| `GovernanceDecisionPort` | mapped decision ref/basis进入lifecycle history | 不保存policy/retention/hold/delete truth；每次危险dispatch前current recheck |
| `ArchiveStoragePort` / `RestoreReceiverPort` | 只从已提交fixed input调用；typed observation进入action/handoff/compensation history | external commit与本地commit分离；ACK/timeout不等Committed/Succeeded |

`resolve_admission_visibility` 的输出只能通过 `append_visibility_binding` 与 Accepted admission 同 UoW 落盘；`authorize_replay` 只决定能否披露既有完整 result，不创建第二份 result。support capability 的实现与 availability 属 infra/config，不能绕过本 Step logical store。

## 8. Fake / durable adapter 等价契约

| 维度 | 两者都必须满足 | 禁止 fake shortcut |
|---|---|---|
| aggregate round-trip | 26对象全部字段、nested set/history/basis/version完整读回 | 只存状态字符串、私有 side map补字段 |
| unique/immutable | 所有PK/operation/effect/revision/sidecar唯一键；同内容append复用、异内容冲突 | HashMap insert覆盖、last-write-wins |
| CAS | `Absent/Exact`语义、对象内部version与wrapper一致、staged≠committed | 默认version 0/1、忽略expected version |
| snapshot | get/list/negative/range来自同一fixed committed snapshot | 每次调用读current、跨页混snapshot |
| serializable-equivalent | commit验证guard read、negative lookup、range predicate、unique key、claim/fence | 仅写行CAS、测试中跳过phantom/fence |
| result replay | 保存完整25种non-query payload，same operation原样返回 | 只存result ref/counter后重扫truth |
| fixed input | source/manifest/assessment/storage/material/handoff/compensation sidecar显式保存 | 从当前config/provider/fake fixture重建旧input |
| commit probe | transaction ref稳定；Unknown可被probe，无blind retry | Unknown直接当rollback或Committed |
| worker | target排他、fence/lease clock、sequence与checkpoint-result原子 | process mutex、wall clock、max+1 |
| cursor | private cursor绑定snapshot/selection/order；public mapping未闭合时均fail-closed | 直接序列化repository cursor或只在fake内存保存未声明mapping |
| external boundary | fake只能返回typed正式shape，不能绕过intent-before-effect或mint evidence | fake默认Verified/Committed/Succeeded/Allowed |
| owner truth | 只保存body-free approved material/ref与provenance | fake复制L1/workspace/artifact/observability canonical body并允许写回 |

## 9. 通用事务与一致性模型

### 9.1 本地 write UoW 顺序

```text
final local UoW:
  begin -> stable transaction_ref/snapshot
    -> reserve or load the exact existing reservation/result
    -> exact reads + negative reads + bounded range reads
    -> validate domain/authority/fixed-input/claim guards
    -> stage business truth + immutable history/sidecars
    -> save_complete_result
    -> complete_operation
    -> append_checkpoint_for_result (worker jobs only)
    -> commit: CAS + read-set + unique + fence validation
    -> if Unknown: probe_commit(transaction_ref), never blind retry
```

`save_complete_result → complete_operation` 是最终结果事务的固定顺序。若 flow 不发生 accepted business mutation（例如确定拒绝/blocked），也必须按其 Step 09/08 合同保存完整可重放结果；它与 reservation completion 同一 UoW，但不得生成不存在的 accepted truth、authority/evidence。若明确使用 `ArchiveRequest::reject/block` 或 `RestoreRequest::reject/block` 形成终态 admission record，该 request 与对应 result 同 UoW 保存，但绝不创建 Job/stage；纯 envelope/shape 拒绝则只保存结果。任何 rollback 都不能留下可见 result、reservation Completed、checkpoint、stage/history 或 ordinal consumption。

### 9.2 外部 effect 三段式

```text
UoW A (prepare): reserve -> claim guard -> persist immutable intent/attempt/fixed input
  -> keep reservation Reserved -> commit/probe
outside UoW: dispatch or probe using the exact persisted input and current formal permit
UoW B (finalize): load the same reservation -> re-read fixed input/target/current versions/authority/fence
  -> persist typed observation/state/history -> save complete result -> complete reservation
  -> append checkpoint -> commit/probe
```

- UoW A 未确认 Committed 时禁止外部调用；`Unknown` 必须先 probe。
- UoW A 不保存“外部已完成”的 result、不调用 `complete_operation`、不追加本次完成 checkpoint；crash 后以 Reserved reservation + persisted intent 恢复。
- 外部 call 不持有数据库 Tx/row lock；不得把外部 transaction 纳入本地 two-phase commit。
- `MayHaveDispatched` 进入 `CommitUnknown/ReconcileRequired`；不能当 `NotDispatched` 重试。
- UoW B 必须拒绝 mixed attempt、stale version/fence、wrong owner/target、changed fixed input。
- lifecycle、handoff、compensation 派发前重核正式 authority；本地保存的旧 proof 不是永久许可。

### 9.3 Read-set 与 snapshot fence

| Guard 类型 | 必须记录 / 提交时验证 | 典型 flow |
|---|---|---|
| mutable row | identity+loaded version | 所有 save；job/bundle/plan/item/action/handoff |
| immutable exact row | identity+content/revision存在性 | manifest、fixed input、outcome/result |
| negative read | lookup key仍不存在 | job/bundle-by-request、effect key、operation key、revision create |
| range predicate | parent/filter/order/完整范围未发生phantom | closure、seal、plan aggregate、affected lifecycle、candidate scan |
| source fence | 仅保存并比较owner正式opaque fence/coverage，不当本地Tx fence | capture/manifest/seal |
| worker fence | claim/target/holder/lease/fence仍有效且排他 | 17 Job的每个truth/result Tx |
| visibility | query同read snapshot resolution与loaded subject一致；外部current decision仅作披露 | Q01～Q05 |

## 10. 逐入口事务边界

### 10.1 Commands（C01～C03）

| 入口 | 开始 / 提交 | 同 UoW 必须完成 | 外部边界与回滚 |
|---|---|---|---|
| C01 RequestArchive | authority/visibility正式输入已取得后 begin；完整response保存后commit | 所有可持久分支：reservation+完整result+complete。Accepted：archive request+nested scope、job+initial stage、visibility binding；domain Rejected/Blocked：终态 request 可选且不得有 job/stage | authority调用不在Tx；envelope/shape拒绝只写result；任一key/shape/read-set失败全回滚；commit Unknown只probe |
| C02 RequestRestore | current external authority输入已取得后 begin；Tx内重读bundle/assessment/revision | 所有可持久分支：reservation+完整result+complete。Accepted：restore request、冻结的target owner set、job+initial stage、visibility binding；domain Rejected/Blocked：终态 request 可选且不得有 job/stage | 不调用receiver、不要求receiver mapping；bundle/assessment/revision mismatch不得造Accepted或job；receiver由持有`RestoreReceiverPort`的`RestoreService`在J13/J15解析或重验；纯shape拒绝只写result |
| C03 RequestLifecycleExecution | formal decision lookup/check完成后 begin | 所有分支：reservation+完整result+complete。仅Accepted：lifecycle+action intent、storage fixed input若已正式构造 | 不dispatch storage；hold/delete/risk合同缺失保存Blocked result且不写execution/action；intent部分失败全回滚 |

### 10.2 Queries（Q01～Q05，strict no-write）

| 入口 | Read snapshot | 组装范围 | 禁止 |
|---|---|---|---|
| Q01 GetArchiveJobStatus | one `ArchiveReadSession` | visibility resolution、job/version、stages、required component postures | begin/reserve/result/cache/repair/external call |
| Q02 GetArchiveBundle | one session/revision | bundle、manifest/entries/closure、placement/lifecycle safe summaries | assembly/seal/retrieve、跨snapshot拼页 |
| Q03 VerifyArchiveBundle | one session/exact target | committed verification/compatibility/findings | assess/probe/mint Verified |
| Q04 GetRestorePlan | one session/plan revision | plan、complete visible item/handoff/outcome subset；plan state不从redacted subset重算 | receiver/compensation、repair plan |
| Q05 GetRestoreHandoffStatus | one session/handoff | handoff/outcomes/compensations按current visibility裁剪 | probe/retry/compensate、ACK推Success |

所有 Query 的 repository read 与 safe view 组装在同 committed snapshot；`ArchiveVisibilityPort::evaluate` 是只读外部正式决定，不允许回写本地。public cursor mapping pending 时仅第一页/无continuation的合法路径可用；需要继续页而映射合同未闭合必须 fail-closed，不能暴露 private cursor。

### 10.3 Consumers（E01～E05）

| 入口 | 开始 / 提交 | 同 UoW 必须完成 | 一致性 / ACK |
|---|---|---|---|
| E01 ArchiveTrigger | trusted envelope完成后 begin | event operation reservation；被允许的admission记录/job/stage/visibility；完整receipt/result/complete | local commit确认后才允许transport ACK；不以event决定project状态 |
| E02 SourceExportFeedback | exact attempt/key/input correlation后 begin | capture/coverage/captured source/findings；完整receipt/result/complete | 无external call；late/conflicting另存保守结果；commit Unknown不ACK成功 |
| E03 GovernanceDecisionChange | 找到受影响range并逐项current check后按bounded item UoW | lifecycle/action保守transition与decision basis；完整processed items/receipt/result | 不保存governance truth、不dispatch；range read防漏项，partial显式 |
| E04 StorageActionFeedback | persisted action target读取后路由P或L；begin对应branch Tx | exact action+placement或lifecycle transition/history；receipt/result/complete | 两branch互斥；ACK observation不等storage commit；wrong target全拒绝 |
| E05 RestoreReceiverFeedback | effect key→handoff、fixed input/owner correlation后 begin | immutable outcome；handoff+item/plan必要保守更新；receipt/result/complete | 不写receiver/owner DB；Succeeded须formal commit ref；冲突保留历史 |

consumer transport ACK 在本地 commit 可证明成功后由外部 host 处理；ACK 本身不是 Archive/store/owner success truth。duplicate 读取完整已存 receipt，不重新解析、重新调用 owner 或再写 history。

### 10.4 Operations Jobs（J01～J17）

| Job | 本地事务阶段 | 同事务原子集 | 外部 I/O / reconcile |
|---|---|---|---|
| J01 AdvanceArchiveJob | one protected UoW | job CAS、stage append、完整report/result/complete、checkpoint | none；完整component range/read-set防partial聚合 |
| J02 PlanArchiveSources | per binding prepare UoW；formal bind outcome另UoW | prepare：完整Planned binding；outcome：Bound/Blocked transition+`BoundSourceRecord`+report/checkpoint | `SourceBindingInput`仅从immutable request/scope+committed binding重构后调用`bind_source`；未有正式probe语义时may-have-dispatched/unknown保持Reserved+Blocked/Unknown，不重复bind |
| J03 CaptureArchiveSource | intent UoW + result UoW | attempt InProgress+capture input；后续capture/coverage/source/findings+report/checkpoint | `capture`在外；may-have-dispatched→Unknown，交J04 probe |
| J04 ReconcileSourceCapture | result UoW | exact attempt/input/typed probe outcome/findings/report/checkpoint | `probe_capture`在外；NotFound不证明无effect |
| J05 AssembleBundleManifest | one protected UoW | bundle CAS；manifest+entries+closure+source sidecar+findings；report/complete/checkpoint | none；required source/selection完整range guard |
| J06 SealArchiveBundle | one protected UoW | exact bundle seal basis+state；report/complete/checkpoint | none；manifest/coverage/assessment/placement read-set全验证 |
| J07 AssessBundleIntegrity | intent UoW + outcome UoW | verification intent/fixed binding；后续assessment/findings/report/checkpoint | resolve/assess/probe在外；无正式crypto合同只能Blocked/Unknown |
| J08 AssessBundleCompatibility | intent UoW + outcome UoW | fixed compatibility input；immutable assessment/findings/report/checkpoint | assess在外；target/schema exact，不自动migration |
| J09 PlaceArchiveBundle | intent UoW + outcome UoW | placement/action/storage input；后续typed observation+state/history/report/checkpoint | dispatch在外；ACK≠Committed；unknown交J12 |
| J10 RetrieveArchiveBundle | intent UoW + outcome UoW | retrieval action/input；后续retrievability observation与placement轴、report/checkpoint | dispatch/probe/inspect在外；availability不替代commit |
| J11 ExecuteArchiveLifecycle | intent UoW + outcome UoW | lifecycle/action/storage input；后续typed observation+decision basis+report/checkpoint | dispatch前重新current check；hold/expiry不明fail-closed |
| J12 ReconcileExternalAction | outcome UoW | persisted target branch对应action+placement/lifecycle；report/complete/checkpoint | probe在外；P/L互斥；NotFound/Unknown不重发 |
| J13 BuildRestorePlan | per-owner receiver resolve后 one protected UoW | plan revision allocation；plan+完整item set；typed receiver outcome/fixed mapping；report/complete/checkpoint | `RestoreService`在Tx外按C02冻结owner set调用`RestoreReceiverPort::resolve`；Tx内重读exact request/manifest/owner range并验证outcome，缺失/unsupported/conflicting生成对应Blocked item，不缩小owner set |
| J14 PrepareRestoreMaterial | prepare reservation UoW + result UoW | prepare阶段以immutable item+manifest/source sidecars及operation digest固定输入；结果阶段保存item-key material/ref+item transition、report/complete/checkpoint | source prepare在外；不从current config重建；partial/stale/missing/integrityfailed不造material |
| J15 DispatchRestoreHandoff | current receiver resolve + intent UoW + outcome UoW | current resolve与J13 fixed mapping一致后，handoff+input+item attach；后续observation/handoff/item/report/checkpoint | `RestoreService`在Tx外先调用同一`RestoreReceiverPort::resolve`重验；mapping漂移在intent/dispatch前Blocked；receiver dispatch在外；per-owner key；unknown交J16 |
| J16 ReconcileRestoreHandoff | outcome UoW | outcome append；handoff/item/plan保守更新；report/complete/checkpoint | probe_handoff在外；conflict不覆盖旧outcome |
| J17 ExecuteRestoreCompensation | intent UoW + outcome UoW | compensation+input+item pending；后续result history/compensation/item/report/checkpoint | compensate/probe在外；完成不改原handoff/owner truth |

每个 Job 的每个业务写 UoW 都必须调用 `protect_with_claim` 并重读 fixed input/current versions。prepare UoW 只提交 reservation+intent/attempt/fixed input，reservation 保持 `Reserved`；只有该 invocation 的最终 outcome UoW 执行 `save_complete_result → complete_operation → append_checkpoint_for_result`。`CommitUnknown` 可作为保守的最终本地 result；后续 J04/J12/J16 等正式 reconcile 是另一个已定义 Job/operation，不覆盖原 result。具体 namespace/digest/retry算法由 Step 13 闭合，在此之前生产执行保持 blocked。

### 10.5 Worker lease 与 local commit probe

| 场景 | 原子边界 | 失败姿态 |
|---|---|---|
| acquire | 对business target排他检查+claim/fence/lease创建的短store事务 | Busy/Missing/Blocked；不创建业务truth |
| renew | loaded claim version+same holder/fence的短CAS | stale/expired返回拒绝；不延长旧fence |
| release | current version/fence短CAS到Released | 不证明external effect rollback |
| protected business commit | truth/result/checkpoint提交前再验claim active/expiry/fence/exclusion group | stale claim全UoW abort；不得只丢checkpoint保留truth |
| commit returns Unknown | 保存transaction ref于调用上下文并调用`probe_commit` | probe Committed则读取result；Aborted才允许新操作；Pending/Unknown继续协调，不盲重试 |
| process crash/no return | operation key+transaction ref双重核对 | 先probe，再查reservation/result/checkpoint；矛盾为consistency defect，不选择方便分支 |

## 11. 一致性策略与失败恢复

### 11.1 一致性策略表

| 场景 | 策略 | 恢复 / 补偿 | 禁止 |
|---|---|---|---|
| local mutable update | CAS + serializable-equivalent read-set | VersionConflict回滚；新操作重读后重新决策 | overwrite/LWW/upsert |
| immutable append duplicate | key+完整content equality | equality则原ref replay；不等则UniqueConflict | 部分字段相同就merge |
| admission/job/stage | 单UoW | probe local commit；完整result replay | request成功而job/stage缺失 |
| manifest/closure | immutable aggregate append + bundle CAS | 新revision重做；旧revision不改 | 部分entry提交、workspace补canonical |
| seal | exact-set/range/negative guards | mismatch保持Blocked/Conflicting，新操作重评 | 旧assessment/placement解锁新revision |
| idempotency/result | full operation key+digest；result before complete | missing result为consistency defect；不重跑 | Completed只存ref/shell |
| source external effect | input committed before capture/probe | MayHaveDispatched只probe；late result按attempt关联 | timeout直接retry/markFailed |
| storage lifecycle effect | action+fixed input先提交；反馈新Tx | J12 probe；typed outcome唯一commit来源 | ACK/HTTP成功等于storage commit |
| restore handoff | per-owner intent/input/outcome histories | J16 probe；冲突保留；必要时formal compensation | Bundle直接写owner DB、跨owner全局success |
| compensation | 独立intent/key/history | probe or blocked/manual disposition | 抹掉original handoff或伪造success |
| query | one committed read snapshot + current disclosure | expired/mismatch返回Stale/Unknown/NotAvailable | query repair/cache write |
| worker | target exclusion+claim fence+atomic checkpoint/result | 新claim恢复；旧fence只读checkpoint | process lock代替durable fence |
| owner material | immutable approved ref + provenance | missing/partial/stale/conflict显式保存 | Archive反写owner truth |
| outbound | blocked/no store | `AR-HLD-Q-001`关闭后回退设计 | 预建outbox/publisher/delivery evidence |

### 11.2 失败恢复表

| 失败 / 不确定性 | 本地已提交事实 | 下一安全动作 | 不得声明 |
|---|---|---|---|
| begin/read失败 | 无新事实 | typed unavailable/blocked | operation accepted |
| local validation/CAS/read-set失败 | Tx aborted，无本次staged事实 | 返回conflict/stale；新operation重读 | 部分成功 |
| local commit Unknown | 可能全部提交或都未提交 | `probe_commit(transaction_ref)` + exact result/reservation read | aborted/committed任一猜测 |
| complete reservation但result missing | consistency defect | fail-closed、记录安全诊断，Step12定义公开映射 | duplicate重跑 |
| intent commit Unknown | external call尚不得开始 | 先probe本地commit | 未派发因此可重建intent |
| external call `NotDispatched` definite | intent已提交，effect未发生 | 新明确retry/reconcile operation按Step13策略 | 原operation未发生 |
| external call `MayHaveDispatched` | intent已提交，effect未知 | 保存CommitUnknown并调用对应probe Job | definite failure/rollback |
| probe NotFound/Unknown | intent与unknown history已提交 | 保持Unknown/ReconcileRequired，等待formal evidence | no external effect |
| feedback fixed-input/version/fence mismatch | 原truth/history保留 | 保存conflict/late finding或拒绝，不覆盖 | 最新feedback自动正确 |
| claim expires before commit | 本UoW abort | 新claim读取checkpoint/result/transaction probe | external effect rollback |
| visibility revoked/unavailable | truth仍存在但不可披露 | NotAvailable/Unknown；不改result/truth | existence或旧payload可披露 |
| cursor mapping unavailable | 首次snapshot可能存在，continuation不可安全验证 | typed blocked/unavailable，重新发起明确新query | 拼接旧cursor与新snapshot |
| external contract/config missing | 本地可有Blocked intent/result | 保持fail-closed；等待owning project闭合 | provider/crypto/storage/receiver ready |

### 11.3 跨 store / aggregate 不变量

1. Accepted `ArchiveRequest/RestoreRequest` 必须恰有一个同 kind `ArchiveJob` 并与 operation result 一致；Rejected/Blocked request 可以保存终态 admission truth，但不得拥有 job；同 request 永远不得出现两个 job。
2. `ArchiveJob` stage transition 必须有对应 append-only stage record；stage record不得存在于回滚的 job transition之外。
3. Settled capture 的 `CaptureCoverage`、`CapturedSourceRecord` 和 fixed input必须与同一 attempt exact match；finding不能跨attempt。
4. manifest entries、closure、source selection和revision是一个immutable aggregate；任何一部分missing为corrupt/incomplete，不允许seal。
5. verification/compatibility/placement与seal basis必须绑定同一bundle revision和input；任何latest fallback禁止。
6. storage/lifecycle action的`ExternalActionTargetRef`与effect key/input一一对应；E04/J12只能进入一个branch。
7. restore plan item set冻结；handoff/outcome/compensation必须沿plan→item→owner→receiver→material链精确关联。
8. reservation Completed、`CompleteArchiveResult`、stored surface以及worker checkpoint必须指向同operation/result；任一缺失都是一致性缺陷。
9. Archive-local transaction/snapshot/version/fence不得替代owner snapshot fence、storage commit或receiver commit。
10. workspace projection始终Auxiliary；无论行数、generation或coverage如何，都不能补canonical source缺口。

## 12. Outbox、projection 与 evidence 边界

| 项 | 当前裁定 | 未来解锁门禁 |
|---|---|---|
| Archive projection store | 不存在；五Query即时组装safe view | 若新增缓存/投影，必须先补正式identity、read/write/mark-stale/rebuild UoW、query degraded与fake parity |
| Archive outbox | 不存在；三个outbound仅blocked candidates | `AR-HLD-Q-001`正式决定event family/payload/producer/consumer后，回退02 Step6～9和03 Step4～11 |
| publisher/delivery evidence | 不存在 | 必须有stored payload snapshot、delivery state/version、probe/retry/duplicate语义后才可设计 |
| observability backend | 不属于本仓 | Step15只能定义本地安全observation/audit seam，不能建后端truth |
| Bundle/digest/signature evidence | 只保存formal ref/typed assessment | `AR-UP-004~005`闭合authority/algorithm/key/storage contract前不得构造Verified/Committed/readiness |

因此本 Step 对 SOP 的“outbox / projection 失败”回答是明确的“不适用且禁止预建”，不是遗漏。若未来决定存在这些机制，当前 Step 11 必须重新打开审核。

## 13. Cross-step closure audit

| 审查项 | 结论 | 证据 / 上限 |
|---|---|---|
| 26 正式对象是否有唯一持久落点 | pass | §5.1逐项覆盖2 contracts+24 domain；contracts对象内嵌，不建shadow truth |
| 技术sidecar是否有save/get闭环 | pass | §5.2、§6、§7.4覆盖source/manifest/assessment/storage/material/handoff/compensation |
| Step 07 callable surface是否越界 | pass | §7仅引用既有trait/function；未新增repository method |
| optimistic version来源 | pass | §6.1；Absent create，Exact只来自current versioned read；owner version/cursor/time forbidden |
| guard/read-set/phantom | pass_at_design | §9.3要求serializable-equivalent；backend未选，不能声明实现ready |
| 30 logical entries / 32 method surfaces | pass | §10覆盖3C+5Q+5E+17J，E04/J12 persisted-target互斥 |
| state matrix persistence | pass | 18状态主语映射mutable/immutable/history/claim store；ACK/commit/unknown分离 |
| duplicate replay | pass_at_design | 完整25 non-query payload + reservation/result/checkpoint atomicity；digest算法留Step13且当前blocked |
| Query no-write | pass | one read snapshot，无projection/cache/result/repair/external effect |
| source authority / owner boundary | pass_with_upstream_blockers | §5.4；exact export/receiver/storage/crypto合同仍由AR-UP-*阻断 |
| outbox/projection | pass_by_explicit_absence | §12；无outbox/publisher/delivery或独立projectiontruth |
| cursor mapping | pending / fail-closed | codec或persistent mapping尚未裁定；未新增store/算法；继续页不能被标ready |
| fake/durable parity | pass_at_contract | §8；尚无实现或测试证据 |
| local commit unknown | pass | transaction ref+probe；不blind retry、不将absence当abort |

本 Step 闭环审计发现并即时校正了前序局部漂移，未增加对象、接口、入口或状态分母：Step 09 J02 改为先提交完整 Planned binding 再调用 `bind_source`，且在该 port 无 probe 时保持 Unknown/Blocked、不借 E02/J04 推断；Step 08/09 C02 移除提前的 receiver mapping 要求，mapping 只由持有 `RestoreReceiverPort` 的 `RestoreService` 在 J13/J15 解析或重验；Step 10 明确 `WorkerEntry` 完成/失败/停止仅为进程内状态，异 digest 只返回 Conflict 而不改写原 reservation，并将 acquire trait 名统一为 `WorkerLeasePort`；同时校正 Step 09/10 页眉完成状态。Step 06 已有的 `mark_conflict` 受控处置语义与上述规则一致，无需回改。未来正式 Step 19 装配时按本文回填 §10；这些校正不推进后续 Step。

## 14. Step 12～16 承接

| 后续 Step | 应先读取 | 必须承接 |
|---|---|---|
| Step 12 错误/恢复 | SOP Step12、书写规范§5.11、本文§9～§11、Step07 errors、Step09/10 | store/port/domain/API error映射；commit unknown、corrupt/missing result、stale claim、partial/unsupported/conflict恢复 |
| Step 13 并发/幂等 | SOP Step13、书写规范§5.12、本文read-set/result/fence | operation namespace、canonical digest、duplicate/reentry/retry/backoff与external unknown规则；无算法则blocked |
| Step 14 配置 | SOP Step14、正式04规范、provider/blocker表 | store/provider/cursor codec/lease/page/budget/crypto/receiver slots；无默认值/secret truth |
| Step 15 observability | SOP Step15、L4-observability正式边界 | safe observation、trace/audit refs、redaction；不建observability backend |
| Step 16 test cuts | SOP Step16、本文§8/§9/§11/§13 | repository contract、CAS/read-set/phantom、result replay、commit probe、claim fence、no-write query、owner boundary负向测试 |

## 15. 前后对比、待确认与停审门禁

**前**：Step 07 已有完整接口，Step 09/10 已有 flow/state，但物理无关的 logical key/index/version、aggregate atomicity、30入口事务切分、read-set/commit probe和fake parity尚未形成单一实现契约。

**后**：26个正式对象与全部technical sidecar均有logical store归属；Step07每族repository都有持久化语义；3 Command、5 Query、5 Consumer、17 Job逐项闭合事务；外部effect统一intent-before-effect；本地unknown统一transaction probe；outbox/projection明确不存在而非漏写。

仍待确认：`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`，以及已归入后续本地设计的 operation digest/namespace、cursor mapping、provider/config/lease/budget。后者尚不足以声明production readiness，但没有新增跨仓 blocker ID。

| 完成门禁 | 结果 |
|---|---|
| SOP问题、诊断、取舍已记录 | pass |
| 数据所有权实现表 | pass：26对象+technical sidecar+8 source classes |
| logical store / key / index / version | pass_with_pending_cursor_mapping |
| Repository函数持久化语义 | pass：严格复用Step07 callable surface |
| transaction boundary | pass：30 logical entries / 32 surfaces |
| consistency/failure recovery | pass_with_upstream_blockers |
| fake/durable parity | pass_at_contract_only |
| formal 03写入 | not allowed until Step19 |
| Step12 | not authorized / not created |
| 下一动作 | `stop_review`，等待用户审查并明确授权Step12 |

本轮未写源码、未创建目标实现仓、未执行项目测试、未生成真实bundle/digest/signature/material/report/evidence/verdict/signoff/readiness，也未提交commit。
