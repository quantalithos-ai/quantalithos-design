# Step 7. API / 接口骨架

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 7。

- [x] 读取项目 ledger、02 flow、Step 5~6、正式 01 §10 与接口分类规范。
- [x] 回答 Command/Query/Inbound/Outbound/Operations 分类及上下文问题。
- [x] 按 CP1→CP6 完成接口归属、对象承接、读写边界和逐项停审。
- [x] 完成分类、命名、处理流覆盖和历史污染审计。

## 2. 本步输入、问题回答与诊断

输入为 26 个已停审对象、六 CP capability、正式 01 的同步/后台/异步运行角色和外部通信边界。

1. Command 只显式受理 archive/restore 请求或受控 lifecycle action；不执行长任务、不写 owner truth。
2. Query 只读取 Archive-owned 状态、固定 manifest、assessment、placement 和 handoff 记录；无查询修复、隐式取回或重验。
3. Inbound Consumer 只消费正式 owner/governance/storage/receiver 的触发或反馈 envelope；事件不是 authority、delivery truth 或 commit。
4. Operations Job 只推进已持久化意图：capture、assembly、verification、placement/lifecycle、restore/handoff/reconcile。
5. Outbound Event 只允许传播本仓已提交事实；当前事件族/Bus 合同未核验，列为 required candidate，不宣称 topic/provider ready。
6. Command 需要 `ActorContext`、`CommandMetadata`、幂等键；Query 需要 `ActorContext` 与 `QueryMetadata`；Consumer 需要可信 envelope、event id、source identity/schema/version 与消费幂等语境。

旧 02 的 archive/search/restore CRUD 会把长作业写成同步成功、查询写入 cache、restore 写成 replay。本步改为“受理—后台推进—只读状态—正式反馈”四类边界，并把内部 service/port 与公开入口分开。

## 3. 接口分类说明

| 类别 | 上下文骨架 | 允许效果 | 明确禁止 |
|---|---|---|---|
| Command API | ActorContext、CommandMetadata、IdempotencyKey、typed request | 提交/复用本地请求、作业或获准动作意图 | 同步声称 archive/restore 完成；owner/governance 写入 |
| Query API | ActorContext、QueryMetadata、typed selector | 只读 Archive-owned state/view | capture、repair、retrieval、verification、handoff 或 cache 写入 |
| Inbound Event Consumer | TrustedEventEnvelope、ExternalEventId、source/version/schema/decision refs | 记录正式触发/反馈并唤醒既有工作 | 把 event arrival 当 authority、commit 或 delivery success |
| Outbound Event | ArchiveCommittedFactEnvelope candidate | 传播已提交本地事实 | 代表 owner 发布业务事实；伪造 Bus topic/receipt |
| Operations Job | WorkerContext、已持久 job/attempt/action ref、expected version | 推进阶段、调用 port、保存局部结果与 reconcile | 无意图副作用、盲重试 commit-unknown、跨域事务 |

接口名是 L4-archive 本地稳定用例主语，不声明对端存在同名 API、event 或 job。

## 4. CP1 请求与作业协调

### Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `RequestArchive` | ActorContext、CommandMetadata、IdempotencyKey、DeclaredArchiveScope、AuthorityRef | ArchiveRequestResult（Accepted/Rejected/Blocked + request/job ref） | 核验本地 shape 与正式依据，按 key/digest 查重，受理并排队 | ArchiveRequest、ArchiveJob、初始 ArchiveJobStageRecord 同一局部事务 |
| `RequestRestore` | ActorContext、CommandMetadata、IdempotencyKey、ArchiveBundleRef、RestoreTargetOwnerSet、RestoreAuthorityRef | RestoreRequestResult（Accepted/Rejected/Blocked + request/job ref） | 核验 Bundle 引用与显式 owner 范围，按 key/digest 查重 | RestoreRequest、ArchiveJob、初始 ArchiveJobStageRecord 同一局部事务 |

### Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetArchiveJobStatus` | ActorContext、QueryMetadata、ArchiveJobRef 或 OperationRequestRef | SafeArchiveJobStatusView 或 SafeNotAvailable | ArchiveRequest/RestoreRequest、ArchiveJob、阶段记录及各 CP 姿态 | no-write；不从 aggregate Completed 推导项目状态或 owner restore 成功 |

### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `AdvanceArchiveJob` | WorkerContext、持久 ArchiveJob、expected ArchiveJobVersion、各 CP 已提交结果 | JobAdvanceResult；新阶段/聚合姿态/阻塞依据 | 只协调阶段；外部调用由所属 CP job 执行；未知不乐观完成 |

### 本部分停审

受理、查询与阶段协调分别承接 ArchiveRequest/RestoreRequest/ArchiveJob；无同步全流程成功、无业务批准写权，`pass`。

## 5. CP2 来源绑定与采集

### Inbound Event Consumer

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeArchiveTrigger` | 项目状态/治理等明确 owning domain 的正式触发候选 | TrustedEventEnvelope、ExternalEventId、OwnerSourceRef、OwnerDecisionRef、TriggerVersionRef | 去重后的 trigger finding 或对既有/新 RequestArchive 用例的唤醒语境 | exact event family 受 AR-UP-002/003 阻塞；事件不能自行批准或直接创建 Completed job |
| `ConsumeSourceExportFeedback` | owner source export/query 异步反馈候选 | TrustedEventEnvelope、ExternalEventId、SourceBindingRef、CaptureAttemptRef、SourceVersion/Fence/Coverage refs、MaterialRefSet | CaptureAttempt/CaptureCoverage/SourceCaptureFinding 的保守更新 | exact schema 未核验；只接受与既有 attempt 匹配的反馈，不把 unknown 当 empty |

### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `PlanArchiveSources` | WorkerContext、Accepted ArchiveRequest、source-authority matrix、expected job version | SourceBindingPlanResult；ArchiveSourceBinding 集合或 blocker | 不固定全部 source 必选；workspace/observability 保持 auxiliary 类别 |
| `CaptureArchiveSource` | WorkerContext、Bound ArchiveSourceBinding、CaptureAttempt、expected attempt/version | SourceCaptureResult；material refs、source version/fence/coverage/findings | 经 SourceExportPort runtime 调用；不共享数据库，不从 projection 补 canonical 缺口 |
| `ReconcileSourceCapture` | WorkerContext、Blocked/Failed/InProgress CaptureAttempt、正式 probe/result | ReconciledCaptureResult | 仅核对既有 attempt；是否新 attempt 必须显式，事件/cache 不作 owner truth |

### 内部 required port（非公开 API）

| Port | 输入 / 输出骨架 | 关系与边界 |
|---|---|---|
| `SourceExportPort` family | SourceCaptureRequest → OwnerApprovedMaterialResult/OwnerCaptureFailure | runtime + adapter + ref；每 owner exact contract 受 AR-UP-001/006~008 阻塞 |

### 本部分停审

source 计划、采集、异步反馈与核对均承接 CP2 对象；event 与 runtime port 未伪装 compile dependency，`pass_with AR-UP-001/002/003/006~008`。

## 6. CP3 Bundle 清单与闭包

### Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetArchiveBundle` | ActorContext、QueryMetadata、ArchiveBundleRef、OptionalManifestRevisionId | SafeArchiveBundleView 或 SafeNotAvailable | ArchiveBundle、BundleManifest、ManifestEntry、ManifestClosure、ClosureFinding | no-write；manifest/ref 不替代 source truth，不自动 assembly/repair |

### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `AssembleBundleManifest` | WorkerContext、ArchiveBundle、固定 source inventory、expected bundle version | ManifestAssemblyResult；新 BundleManifest revision、entries、closure/findings | 只从已持久化 CP2 结果构造；旧 revision 不覆盖 |
| `SealArchiveBundle` | WorkerContext、ClosureReady Bundle、固定 verification/placement basis、expected bundle version | BundleSealResult | 只提交 Archive-owned Sealed；不设置项目 archived，不私造 digest/storage success |

### 本部分停审

查询与两项 job 覆盖 assembly/closure/seal；read 无写入，closure 与外部成功未混同，`pass`。

## 7. CP4 完整性与兼容评估

### Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `VerifyArchiveBundle` | ActorContext、QueryMetadata、ArchiveBundleRef、ManifestRevisionId、VerificationReadSelection | SafeBundleVerificationView 或 SafeNotAvailable | 已提交 VerificationAssessment、CompatibilityAssessment、VerificationFinding | 名称表示读取验证结果，不触发重验；Unknown/Blocked/Unsupported 可见 |

### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `AssessBundleIntegrity` | WorkerContext、固定 VerificationInputBinding、persisted assessment ref | VerificationJobResult | 经 IntegrityCapabilityPort；无算法/key/capability 即 Blocked，不生成 digest/signature |
| `AssessBundleCompatibility` | WorkerContext、固定 manifest/schema refs、CompatibilityTargetContext | CompatibilityJobResult | 不自动迁移，不把 read 支持结论复用于 restore receiver |

### 内部 required port（非公开 API）

| Port | 输入 / 输出骨架 | 关系与边界 |
|---|---|---|
| `IntegrityCapabilityPort` | FixedVerificationInput → IntegrityCapabilityFeedback | runtime + adapter + ref；provider、算法、key/KMS 未闭合 |
| `CompatibilityCapabilityPort` | ManifestVersionContext → CompatibilityCapabilityFeedback | runtime + adapter + ref；schema authority/reader/receiver 合同未闭合 |

### 本部分停审

只读 Verify 与两项后台 assessment 分离；外部能力只作为 required port，`pass_with AR-UP-004/009`。

## 8. CP5 存储与生命周期执行

### Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `RequestLifecycleExecution` | ActorContext、CommandMetadata、IdempotencyKey、BundleRevisionRef、GovernanceDecisionRef、LifecycleActionKind | LifecycleRequestResult（Eligible/Blocked/Conflict + execution ref） | 核对正式 decision ref 适用性和当前冲突，记录受控动作语境 | LifecycleExecution；必要时初始 ExternalActionRecord，仅本地意图 |

### Inbound Event Consumer

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeGovernanceDecisionChange` | governance/明确 owner 正式决定变化候选 | TrustedEventEnvelope、ExternalEventId、GovernanceDecisionRef、DecisionValidityRef | 相关 execution 重新判定或 Blocked finding/唤醒 | 不解释 policy；旧 release/delete 不覆盖新 hold；exact family 受 AR-UP-003 阻塞 |
| `ConsumeStorageActionFeedback` | storage capability 正式反馈候选 | TrustedEventEnvelope、ExternalEventId、ExternalActionRef、StorageCommit/Retrieval feedback ref | ArchivePlacement/LifecycleExecution/ExternalActionRecord 保守更新 | ACK 不等于 commit；timeout/重复反馈按 action id/digest 核对 |

### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `PlaceArchiveBundle` | WorkerContext、fixed BundleRevisionRef、ArchivePlacement intent | PlacementJobResult | 经 ArchiveStoragePort；先落 intent；commit unknown 先 probe |
| `RetrieveArchiveBundle` | WorkerContext、ArchivePlacement、retrieval intent | RetrievalJobResult | 只更新 retrieval 轴；不以请求已发送声明 Retrievable |
| `ExecuteArchiveLifecycle` | WorkerContext、Eligible LifecycleExecution、ExternalActionRecord | LifecycleJobResult | 只执行正式决定；hold/conflict/invalid decision 即阻塞 |
| `ReconcileExternalAction` | WorkerContext、CommitUnknown placement/execution/action、probe context | ExternalActionReconcileResult | 先核对再 retry/compensate；不盲重放 |

### 内部 required port（非公开 API）

| Port | 输入 / 输出骨架 | 关系与边界 |
|---|---|---|
| `GovernanceDecisionPort` | DecisionRef → applicability/validity result | runtime + ref；policy 与授权归 owner |
| `ArchiveStoragePort` | placement/retrieval/lifecycle intent → ack/commit/probe result | runtime + adapter + ref；供应商、tier、SLA、secret 未确定 |

### 本部分停审

decision consumption、intent、feedback、commit-unknown 与 reconcile 分类清楚；无默认期限/provider/delete 权，`pass_with AR-UP-003/005`。

## 9. CP6 恢复计划与交接

### Query API

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetRestorePlan` | ActorContext、QueryMetadata、RestorePlanRef | SafeRestorePlanView 或 SafeNotAvailable | RestorePlan、RestoreItem、RestoreHandoff、HandoffOutcome、CompensationRecord | no-write；per-owner outcome 独立，不推导项目 restored |
| `GetRestoreHandoffStatus` | ActorContext、QueryMetadata、RestoreHandoffRef 或 RestoreItemRef | SafeRestoreHandoffView 或 SafeNotAvailable | handoff/outcome/compensation 历史 | 不调用 receiver probe/retry，不泄露未授权材料/ref |

### Inbound Event Consumer

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeRestoreReceiverFeedback` | 各 owner 正式 receiver feedback 候选 | TrustedEventEnvelope、ExternalEventId、RestoreHandoffRef、ReceiverOutcome/Commit refs | HandoffOutcome、RestoreHandoff/RestoreItem/RestorePlan 保守更新 | receiver-specific；ACK/event arrival 不等于 business restored；exact family 受 AR-UP-009 阻塞 |

### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `BuildRestorePlan` | WorkerContext、Accepted RestoreRequest、fixed bundle/assessment/placement inputs | RestorePlanBuildResult；per-owner RestoreItem 或 blocker | 不创建跨域事务；每 item 独立检查完整性、兼容性、可取回和 receiver |
| `PrepareRestoreMaterial` | WorkerContext、RestoreItem、approved manifest/material refs | RestoreMaterialResult | 只形成 target-owner 最小材料 ref；不生成 owner schema 或写权限 |
| `DispatchRestoreHandoff` | WorkerContext、MaterialReady RestoreItem、persisted RestoreHandoff intent | RestoreDispatchResult | 经 owner-specific RestoreReceiverPort；先落 intent；ACK 不等 commit |
| `ReconcileRestoreHandoff` | WorkerContext、CommitUnknown/ReconcileRequired handoff、receiver probe result | HandoffReconcileResult | 先核对后决定 retry/compensation/manual；不盲重放 |
| `ExecuteRestoreCompensation` | WorkerContext、authorized CompensationRecord | CompensationResult | 仅按正式 authority 经 receiver 执行；不抹除原 handoff |

### 内部 required port（非公开 API）

| Port | 输入 / 输出骨架 | 关系与边界 |
|---|---|---|
| `RestoreReceiverPort` family | OwnerSpecificRestoreHandoff → receiver ack/outcome/probe/compensation result | runtime + adapter + ref；各 owner exact contract 与 commit 语义受 AR-UP-009 阻塞 |

### 本部分停审

plan/material/handoff/reconcile/compensation 与两个只读面完整承接 CP6 对象；无直接数据库写入或全域成功，`pass_with AR-UP-002/009`。

## 10. Outbound Event 候选边界

| Event candidate | 产生来源 | 主要消费者候选 | 说明 |
|---|---|---|---|
| `ArchiveJobPostureChanged` | 已提交 ArchiveJob stage/posture | operation/status consumers | 只传播本地作业姿态；事件族、schema、Bus 接入未核验，不作为 ready 合同。 |
| `ArchiveBundleSealed` | ArchiveBundle Sealed 本地提交 | authorized archive consumers | 不代表项目 archived；不得代发 owner 业务事实。 |
| `RestoreHandoffPostureChanged` | per-owner RestoreHandoff/Outcome 提交 | authorized status consumers | 不代表 owner committed/restored；每 owner 独立。 |

若出站合同未闭合，正式实现只能保留本地 committed fact/outbox seam 候选或不发送；不能以文档命名伪造 topic、delivery evidence 或 consumer readiness。

## 11. 接口覆盖与跨接口审计

| CP | 正式入口 / seam | Step 8 必须承接 | 审计结论 |
|---|---|---|---|
| CP1 | 2 Command、1 Query、1 Job | 两个 admission 流、job coordination | pass |
| CP2 | 2 Consumer、3 Job、SourceExportPort | source capture 与 reconcile；触发/feedback 流 | pass_with_blockers |
| CP3 | 1 Query、2 Job | assembly、seal、bundle read | pass |
| CP4 | 1 Query、2 Job、2 capability port | integrity/compatibility 与 verify read | pass_with_blockers |
| CP5 | 1 Command、2 Consumer、4 Job、2 port | lifecycle request；placement/action/reconcile | pass_with_blockers |
| CP6 | 2 Query、1 Consumer、5 Job、receiver port | plan、material/handoff/reconcile/compensation/read | pass_with_blockers |

| 审计项 | 结论 | 说明 |
|---|---|---|
| 分类 | pass | Command 受理/意图，Query no-write，Consumer 正式反馈，Job 推进持久事实。 |
| 对象承接 | pass | 所有入口均回指 Step 6 对象；service/port/DTO 未升格为 truth。 |
| 外部合同 | blocked_not_fabricated | event/port/outbound 均标 candidate/required；AR-UP-001~009 保留。 |
| 幂等与未知提交 | pass | command/action/handoff 有 typed key/digest；commit unknown 先 reconcile。 |
| 依赖分类 | pass_with_AR_ARCH_001 | runtime/event/ref/adapter 与 compile 分开；无 SDK 反向依赖。 |
| 历史污染 | pass | 无 cached ArchiveIndex、同步 replay、provider API、固定 SLA/topic。 |

## 12. 回填草稿、待确认与进入下一步条件

正式 §7 摘录分类表、按 CP 的有效接口表、required port 和 outbound candidate 边界；逐 CP 讨论与停审仅保留在本文件。

待确认：所有 owner export/trigger/feedback、governance decision、integrity/schema、storage 与 restore receiver exact contract 仍受 `AR-UP-001~009` 阻塞；Outbound event family 也未预签。

接口分类、输入输出骨架、对象归属与读写边界已完成，Step 8 必展路径有明确索引。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 8。
