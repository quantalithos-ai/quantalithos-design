# Step 10. 状态机与转换矩阵

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填章节: `03-详细设计.md` §9 状态机与转换矩阵
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 6 对象状态 enum、Step 8 protocol、Step 9 function flow 基础上,定义 L4-sandbox 当前 boundary 必须遵守的状态集合、允许迁移、禁止迁移、触发函数、前置条件和副作用。本步不写 DDL、事务隔离级别、配置 key、真实测试结果、run_id、evidence alias、验收签署、实施 commit boundary 或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 10 | 是。Step 9 审查点后用户已回复“同意”,允许进入 Step 10。 |
| 项目级台账是否允许进入 Step 10 | 是。`project_execution_ledger.md` 原恢复点为 Step 9 `pass_wait_review`,用户确认后可进入 Step 10。 |
| 文档级 flow 是否允许进入 Step 10 | 是。`03_ddd_calibration_flow.md` 原记录 Step 10 `blocked_by_step_9_review`,用户确认后门禁满足。 |
| 是否已读取 Step 9 flow | 是。Step 9 已闭口 Command / Query / Consumer / Relay / Job 的触发 flow、事务顺序、状态副作用和 Step 10 handoff。 |
| 是否已读取 Step 6 状态 enum / transition 小节 | 是。Step 6 已闭口 status carrier、domain truth、application result / receipt / report、infra adapter state 和 entry shell。 |
| 是否已读取详细设计 SOP Step 10 | 是。本步必须先筛状态主语,再按状态机输出集合、图、矩阵、非法转换和停审记录。 |
| 是否已读取详细设计书写规范 §5.9 | 是。本步必须输出状态集合表、ASCII 状态图、状态转换矩阵和非法转换处理表。 |
| 是否已读取真相源标准相关条目 | 是。已检查状态主语筛选、state-machine-to-carrier、transition helper、illegal transition、factory 初始状态和 phase ownership 规则。 |
| 是否发现阻塞 Step 10 的上游 blocker | 未发现阻塞本步生成的 blocker。Step 9 的 query selector / index 缺口继续作为 Step 11 handoff,本步不临时发明 finder 或 projection index。 |

---

## 2. 本步目标

本步把 `L4-sandbox` 已在 Step 6 命名的状态 enum 与 Step 9 的实际触发 flow 对齐,让实现者可以按矩阵实现状态校验代码。状态机不是全局混表,每个状态主语都必须有明确 owner、carrier、触发函数、前置条件和副作用边界。

本步必须闭口:

- execution environment identity、intake、reference resolution 的状态转换。
- resource limits、filesystem / network / process boundary、backend capability、isolation handle、lease / reaper 的状态转换。
- policy execution、high-risk action、fail-closed、security redline 的状态转换。
- controlled run、capture、material / observability handoff 的状态转换。
- failure classification、control、cleanup guard、redline containment 的状态转换。
- projection、derived、reconciliation、relay、idempotency、stored result、consumer receipt、job report 的状态转换。
- query no-write surface 和 entry / adapter 技术状态的非 truth 生命周期口径。

本步不处理:

- Step 11 的持久化 shape、索引、物理 outbox、version token 和 cursor 物理赋值。
- Step 12 的完整错误 taxonomy、public error 映射、恢复策略和 rejected trace 规则。
- Step 13 的幂等窗口、digest canonicalization、并发冲突和 retry/backoff。
- Step 14 的配置项、默认值、环境矩阵和 adapter wiring。
- Step 16 的完整测试方案或真实执行结果。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 当前需求基线 | 提供隔离运行、fail-closed、cleanup/redline、安全红线和 query no-write 需求边界。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前架构基线 | 提供独立 truth center、依赖方向、运行承载、安全外部边界和一致性分层。 |
| `projects/L4-sandbox/02-概要设计.md` | 当前概要基线 | 提供 6 组状态机轮廓、关键处理流和异常边界。 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供状态 enum、对象字段、factory、transition method 和状态闭环审计。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository / port / adapter callable surface、versioned read 和 UoW owner。 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 command / query / event / job DTO intent、receipt、report 和 public status surface。 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供触发 flow、transaction 边界、状态副作用、query no-write、relay no-rollback 和 job no-repair。 |
| L1 governance / artifact Step 10 | 已读取 | 仅参考状态矩阵粒度、批次组织、停审表写法,不继承业务状态。 |

---

## 4. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| Step 6 / Step 9 中哪些对象、marker、helper 或 entry result 是候选状态主语 | 候选包括 domain truth status、reference/projection/derived/relay maintenance status、application idempotency / stored result、query access decision、consumer receipt、job report、adapter availability 和 runtime config status。 |
| 哪些候选对象排除在 Step 10 状态矩阵外 | typed ref、opaque id、value object、kind enum、marker-only carrier、DTO wrapper、audit trace、page cursor、retry counter、external truth status 和 API envelope disposition 不进入状态矩阵。 |
| 当前仓有哪些正式状态机 | 本步正式状态机按 8 个状态族组织: intake/identity/reference、boundary/capability/handle/lease、policy/high-risk、run/capture/handoff、failure/control/cleanup/redline、read/projection/derived/report、relay、application replay / entry-job 技术状态。当前重验目标为 30 个状态机 owner、31 个 canonical status enum；共享 registry 仍有 39 个 status declarations，其中部分是 finite kind / technical carrier，不单独形成状态机。 |
| 每个状态机属于哪类状态族 | §8 的状态主语筛选表和 §9 的状态族分组表逐项列出。 |
| 每个状态机归属于哪个模块和 Step 6 enum | §10 批次表逐项列出模块和 enum;状态名必须与 Step 6 §10~§14 / §25 的 enum label 一致。 |
| 哪些函数触发状态转换 | 每个矩阵行的触发函数回指 Step 6 object method / factory、Step 7 repository atomic marker surface 或 Step 9 flow。 |
| 每个转换的前置条件、副作用和错误是什么 | 每个矩阵行列出 loaded truth / DTO / repository / adapter outcome / policy decision 前置条件、状态字段副作用、flow 副作用和非法错误。 |
| 非法转换应该返回什么错误 | 当前统一写 `DomainError::InvalidStateTransition`、`ApplicationErrorKind::Domain` / `ApplicationErrorKind::Validation` 或 `ApplicationErrorKind::NoWriteViolation` 占位;Step 12 继续细化 exact error variant 和 public mapping。 |
| 是否存在同名 / 近义状态冲突 | 已通过当前跨状态机审计收口: `Failed` 在不同状态机中只表达各自 owner 的失败,不得互相替代;handoff 的 `Delivered` 不等于 source truth accepted;relay lifecycle 的成功态是 `Published`;`Unknown` 只属于 side-effect / commit recovery observation,不是 lifecycle status。 |

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本步处理 |
|---|---|---|
| 旧 `03` 五段主线 | 旧 session / isolation / command / output / control 容易被写成单一大状态机。 | 不采用旧主线;按 Step 6 对象 owner 和 Step 9 flow 分状态机。 |
| Query surface | Query view status 容易被误认为 truth lifecycle。 | `QueryAccessStatus` 只作为 read / visibility surface;query 不写 truth、不修 projection、不触发 cleanup/release。 |
| Relay / handoff | publish 或 handoff failure 容易回滚 source truth。 | `SandboxEventRelayStatus`、`HandoffTargetProgressStatus`、`HandoffFactStatus` 与 source truth 状态分离;failure 只更新 owning relay / target progress / aggregate / report。 |
| Cleanup / redline | job 或 query 可能隐式 release environment / redline。 | `CleanupGuardStatus` 和 `RedlineContainmentStatus` 明确 release 需要 guard;query/job 只能暴露或推进已授权 marker。 |
| Factory 初始状态 | factory 若直接创建目标终态,command transition 会变成 no-op。 | 矩阵明确 factory 初始态和 command transition;当前 flow 会调用的 transition 必须有合法 from-state。 |
| Step 11 index 缺口 | 直接 selector 缺 finder 时可能诱导实现临时扫描。 | 本步状态矩阵不新增 finder;相关 query 状态只读取 Step 7 已有 surface,索引留 Step 11。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 写一张 `SandboxGlobalState` 总表 | 看起来统一。 | 混淆 business truth、projection、relay、entry、adapter;实现无法知道状态保存位置。 | 不采用。 |
| B. 只写 Step 6 状态闭环摘要 | 篇幅短。 | 不足以实现非法转换、前置条件和测试切口。 | 不采用。 |
| C. 按状态主语分组,每个状态机写集合、图、矩阵、停审 | 可落码、可回指 Step 6/9/12/16。 | 文档较长。 | 采用。 |
| D. 把 query / job 的状态作为 core truth 修复入口 | 简化恢复叙事。 | 违反 query no-write 和 job no core repair。 | 不采用。 |
| E. 为当前 matrix 新增未在 Step 6 的状态 label | 可覆盖更多未来场景。 | 违反 state-machine-to-carrier mapping;实现会自补 enum。 | 不采用;未来状态标为 reserved 或交后续设计。 |

---

## 7. 通用状态矩阵规则

| 规则 | 正式口径 |
|---|---|
| 状态名来源 | 必须使用 Step 6 已定义 enum variant;不得新增同义状态或中文口语状态。`CaptureFactStatus`、`HandoffTargetProgressStatus`、`HandoffFactStatus`是当前 canonical names；`CaptureStatus`、`HandoffStatus`只保留为 historical material。 |
| trigger 来源 | 必须是 Step 6 factory / member method、Step 7 repository marker update、Step 9 flow 中已列 application service 或 adapter outcome mapper。 |
| 前置条件来源 | 只能引用 loaded truth、DTO 字段、repository versioned read、resolver outcome、policy decision、adapter outcome、stored snapshot 或 job input。 |
| 副作用边界 | domain method 只改对象字段;trace、audit、relay、projection stale、stored result、cursor 和 commit 顺序由 Step 9 application flow 编排。 |
| 非法转换错误 | domain object 返回 `DomainError::InvalidStateTransition`;application / job 层映射为 `SandboxApplicationError`。Step 12 细化 exact variant。 |
| terminal 状态 | 标为终态的状态不得重新打开;需要重新处理时必须创建新 truth / new marker / replacement flow。 |
| query 状态 | query 只能读取并暴露状态;不得 begin write UoW、refresh、rebuild、handoff、cleanup、redline 或 append trace。 |
| maintenance 状态 | reference / projection / derived / relay / job report 状态不得反写 context、boundary、policy、run、capture 等 core truth。 |
| version 来源 | 更新 existing state 必须经 Step 7 / Step 11 的 versioned read/list;不得扫描 fake map 或解析 ref。 |
| source cursor | accepted truth cursor 只来自 UoW / repository committed cursor;reference marker cursor 只来自 `assign_reference_marker_cursor()`。 |
| reserved 状态 / 转换 | 若状态或转换只为后续 phase 预留,必须标为 `reserved`;当前 Step 9 flow 不得调用。 |

---

## 8. 状态主语筛选表

| 候选主语 | 来源对象 / 字段 | 是否进入 Step 10 | 原因 | 状态族 |
|---|---|---|---|---|
| `ControlledExecutionContext.intake_status` | `ControlledExecutionIntakeStatus` | 是 | Step 9 intake flow 推进 accepted / rejected,直接决定是否可建立 boundary / launch。 | intake / identity |
| `ExecutionEnvironmentIdentity.identity_status` | `ExecutionEnvironmentIdentityStatus` | 是 | execution environment identity 是 sandbox 责任锚点,失效后必须阻断后续 execution。 | intake / identity |
| `ExecutionContextResolution.resolution_status` | `ExecutionContextResolutionStatus` | 是 | 一次 intake context resolution value;只与该 context 的受理 guard 共同决定 accepted / pending / rejected。 | intake / resolution |
| `ContextReferenceResolution.resolution_status` | `ContextReferenceResolutionStatus` | 是 | 一次 intake external-reference 边界记录;不能替代 context 整体 resolution。 | intake / resolution |
| `BoundaryEstablishmentDecision.decision_status` | `BoundaryEstablishmentDecisionStatus` | 是 | backend / capability 裁定结果决定 coherent boundary 是否成立。 | boundary / capability |
| `CoherentBoundary.boundary_status` | `CoherentBoundaryStatus` | 是 | resource / filesystem / network / process boundary 的实际 coherent truth。 | boundary / capability |
| `BackendCapabilitySummary.capability_status` | `BackendCapabilitySummaryStatus` | 是 | capability stale / unsupported / unknown 直接阻断新的 boundary establishment。 | boundary / capability |
| `IsolationEnvironmentHandle.handle_status` | `IsolationEnvironmentHandleStatus` | 是 | handle created / active / release / orphan 影响 cleanup / lease / reaper。 | boundary / handle |
| `LeaseRecord.lease_status` | `LeaseRecordStatus` | 是 | lease expiry 和 orphan suspected 触发 reaper 与 cleanup guard。 | cleanup / lease |
| `OrphanRecoveryRecord.orphan_status` | `OrphanRecoveryRecordStatus` | 是 | reaper job 需要记录 suspected / confirmed / recovered / failed。 | cleanup / reaper |
| `PolicyApplicabilitySnapshot.applicability_status` | `PolicyApplicabilityStatus` | 是 | missing / stale / conflicted 必须 fail-closed,不得 allow。 | policy / high-risk |
| `PolicyExecutionDecision.decision_status` | `PolicyExecutionDecisionStatus` | 是 | launch policy 的 accepted / rejected / blocked / fail-closed 真相。 | policy / high-risk |
| `HighRiskActionDecision.action_status` | `HighRiskActionDecisionStatus` | 是 | high-risk action 非 allowed 必须阻断 launch 或触发 redline。 | policy / high-risk |
| `ControlledExecutionRun.run_status` | `ControlledExecutionRunStatus` | 是 | sandbox-owned run lifecycle,但不表达 runtime agent loop 内部状态。 | run / capture |
| `CaptureFact.capture_status` | `CaptureFactStatus` | 是,immutable classifier | `record(...)` 创建时直接定格 complete / partial / failed / unavailable;没有 `Pending` 或原地重试。 | run / capture |
| `HandoffTargetProgress.progress_status` | `HandoffTargetProgressStatus` | 是 | 每个 committed target 的 attempt-before-call、finite observation、same-attempt recovery 和 terminal guard 都由该 owner 持有；它嵌入 `HandoffFact`，不形成独立 repository。 | handoff / propagation |
| `HandoffFact.handoff_status` | `HandoffFactStatus` | 是 | batch aggregate 只从完整 target progress set 机械派生；handoff delivered / retryable / failed 不回滚 capture truth，但影响 cleanup；material handoff 不使用 `DeadLetter`。 | handoff / propagation |
| `FailureClassification.failure_status` | `FailureClassificationStatus` | 是 | failure pending/classified/terminal 影响后续 execution 和 cleanup。 | failure / control |
| `ControlFact.control_status` | `ControlFactStatus` | 是 | control accepted / conflicted / completed / failed 是安全控制事实。 | failure / control |
| `CleanupGuard.guard_status` | `CleanupGuardStatus` | 是 | cleanup/release 前置门禁,non-allowed 不得 release。 | cleanup / redline |
| `RedlineContainment.containment_status` | `RedlineContainmentStatus` | 是 | security redline 不是 advisory-only,必须 containment / handoff / release guard。 | cleanup / redline |
| `ReferenceResolutionState.resolution_status` | `ReferenceResolutionStateStatus` | 是 | 长期 reference refresh state 影响 projection stale / degraded,不反写 core truth。 | source / reference |
| `SandboxReadProjection.projection_status` | `SandboxReadProjectionStatus` | 是 | projection fresh/stale/rebuilding/degraded/unavailable 影响 query surface。 | projection / read |
| `DerivedInspectPreviewTrendState.derived_status` | `DerivedInspectPreviewTrendStatus` | 是 | derived inspect / preview / trend 的唯一 persisted maintenance owner;comparison / reconciliation 不共享本状态。 | projection / derived |
| `SandboxReconciliationReport.report_status` | `SandboxReconciliationReportStatus` | 是,immutable classifier | reconciliation report factory result,不修复 core truth,不存在 `Pending -> Completed`。 | report / reconciliation |
| `SandboxEventRelayRecord.relay_status` | `SandboxEventRelayStatus` | 是 | relay publish/retry/dead-letter 状态;成功态是 `Published`,source truth 不回滚。 | outbox / relay |
| `SandboxIdempotencyRecord.record_status` | `SandboxIdempotencyRecordStatus` | 是 | command / consumer / job atomic reserve、completion 与 failure 判断依赖该状态。 | idempotency / replay |
| `SandboxStoredOperationResult.result_status` | `SandboxStoredOperationResultStatus` | 是,immutable classifier | stored accepted / rejected / failed result决定 duplicate 能否 exact replay;lookup integrity gap不伪造 lifecycle variant。 | idempotency / replay |
| `SandboxQueryAccessDecision.visibility_status` | `QueryAccessStatus` | 是,但只作为 read surface | query no-write 的 visible / degraded / unavailable surface,不替代 truth lifecycle。 | read / visibility |
| `SandboxConsumerReceipt.receipt_status` | `SandboxConsumerReceiptStatus` | 是,public finite result | worker ack / retry / quarantine / no-op 决策依赖 receipt status;不是 domain lifecycle。 | entry / consumer |
| `SandboxJobExitDisposition.report_status` | `SandboxJobReportStatus` | 是,public finite result | job duplicate replay 和 exit disposition 依赖 report status;不是 domain lifecycle。 | job report |
| `AdapterAvailabilityState.availability_status` | `AdapterAvailabilityStatus` | 是,但只作为 infra technical state | entry / service 可据此返回 degraded / unavailable,但不得改变 business allow。 | runtime / adapter |
| `SandboxRuntimeConfigSummary.config_status` | `RuntimeConfigStatus` | 是,但只作为 startup technical state | startup blocked / degraded surface,配置不得弱化 hard guard。 | runtime / config |
| `SandboxAuditTrace` | append-only trace record | 否 | audit 没有可修改生命周期;只允许 append 新 trace。 | excluded |
| `SandboxOpaqueRef` / `SandboxTypedRef` / `ExternalSourceRef` | typed ref / id | 否 | 纯 ref / id 不改变允许操作。 | excluded |
| `ForbiddenExternalBodyMarkerSet` / `ReferenceRefreshMarker` / `DerivedRebuildMarker` | marker / ref-set | 否 | marker 是 transition 参数或来源,不是独立状态机。 | excluded |
| `CapturedMaterialRef` / `ObservabilityMaterialRef` | body-free material ref | 否 | 只保存 ref / kind / digest,不拥有 artifact / observability truth。 | excluded |
| `BoundaryLimitKind` / `MaterialKind` / `SandboxEventKind` / `SandboxTraceKind` | kind enum | 否 | 分类字段不是生命周期状态。 | excluded |
| `SandboxApiCommandEnvelope` / `SandboxApiQueryEnvelope` | DTO wrapper / entry envelope | 否 | entry envelope 只映射 metadata 和 digest,不持久化生命周期。 | excluded |
| `EntryDisposition` | API response disposition | 否 | 同步 entry 结果不作为 repository state;由 Step 8/12 public mapping 处理。 | excluded |
| page cursor / retry counter / SQL lock | 技术实现细节 | 否 | 不得进入设计 truth lifecycle。 | excluded |

---

## 9. 状态族分组表

| 状态族 | 状态机 | 所属模块 | 主要触发来源 | 停审顺序 |
|---|---|---|---|---|
| intake / identity / reference | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`ContextReferenceResolution`;`ReferenceResolutionState` | `domain` | `OpenControlledExecutionContextFlow`;reference consumers / refresh jobs | 10.1 |
| boundary / capability / handle / lease | `BoundaryEstablishmentDecision`;`CoherentBoundary`;`BackendCapabilitySummary`;`IsolationEnvironmentHandle`;`LeaseRecord`;`OrphanRecoveryRecord` | `domain` / `infra` | `EstablishExecutionBoundaryFlow`;backend capability refresh;lease reaper | 10.2 |
| policy / high-risk | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | `domain` | `EvaluatePolicyExecutionFlow`;policy summary consumer | 10.3 |
| run / capture / handoff | `ControlledExecutionRun`;`CaptureFact`;`HandoffTargetProgress`;`HandoffFact` | `domain` | `StartControlledExecutionRunFlow`;`RecordCaptureResultFlow`;`OpenMaterialHandoffFlow`;target delivery / same-attempt inspection;handoff feedback / retry job | 10.4 |
| failure / control / cleanup / redline | `FailureClassification`;`ControlFact`;`CleanupGuard`;`RedlineContainment` | `domain` | failure / control / cleanup / redline command flows;investigation handoff consumer | 10.5 |
| read / projection / derived / reconciliation | `SandboxQueryAccessDecision`;`SandboxReadProjection`;`DerivedInspectPreviewTrendState`;`SandboxReconciliationReport` | `application` / `domain` / `contracts` | query service;projection rebuild job;derived maintenance job;reconciliation job | 10.6 |
| outbox / relay | `SandboxEventRelayRecord` | `domain` | accepted source transaction;`PublishSandboxEventRelayFlow`;relay feedback consumer | 10.7 |
| idempotency / stored replay / entry-job report / adapter | `SandboxIdempotencyRecord`;`SandboxStoredOperationResult`;`SandboxConsumerReceipt`;`SandboxJobExitDisposition`;`AdapterAvailabilityState`;`SandboxRuntimeConfigSummary` | `application` / `worker` / `jobs` / `infra` | shared command / consumer / job templates;runtime builder / health check | 10.8 |

---

## 10. 状态矩阵批次表

| 批次 | 状态机 | 所属模块 | 状态 enum | 触发 flow / 函数 | 停审状态 |
|---|---|---|---|---|---|
| 10.1 | ControlledExecutionContext | domain | `ControlledExecutionIntakeStatus` | `OpenControlledExecutionContextFlow`;`ControlledExecutionContext::accept/reject/close` | done |
| 10.1 | ExecutionEnvironmentIdentity | domain | `ExecutionEnvironmentIdentityStatus` | `ExecutionEnvironmentIdentity::bind/close/invalidate` | done |
| 10.1 | ExecutionContextResolution | domain | `ExecutionContextResolutionStatus` | resolver outcome;immutable value replacement in owning context flow | done_after_regression |
| 10.1 | ContextReferenceResolution | domain | `ContextReferenceResolutionStatus` | intake reference resolver outcome;owning relation update | done_after_regression |
| 10.1 | ReferenceResolutionState | domain | `ReferenceResolutionStateStatus` | reference consumer / refresh job;`track_resolved/track_non_resolved/mark_stale` | done_after_regression |
| 10.2 | BoundaryEstablishmentDecision | domain | `BoundaryEstablishmentDecisionStatus` | `EstablishExecutionBoundaryFlow`;typed capability/backend outcome mapper | done_after_regression |
| 10.2 | CoherentBoundary | domain | `CoherentBoundaryStatus` | required factory;`record_pending_capability/record_established/record_rejected/record_establishment_failed/mark_failed/mark_released` | done_after_regression |
| 10.2 | BackendCapabilitySummary | domain / infra | `BackendCapabilitySummaryStatus` | typed capability candidate factory / refresh job | done_after_regression |
| 10.2 | IsolationEnvironmentHandle | domain | `IsolationEnvironmentHandleStatus` | isolation backend candidate factory;run activation;cleanup/reaper | done_after_regression |
| 10.2 | LeaseRecord / OrphanRecoveryRecord | domain | `LeaseRecordStatus`;`OrphanRecoveryRecordStatus` | lease open / expiry / reaper job | done_after_regression |
| 10.3 | PolicyApplicabilitySnapshot | domain | `PolicyApplicabilityStatus` | policy summary port | done |
| 10.3 | PolicyExecutionDecision | domain | `PolicyExecutionDecisionStatus` | `EvaluatePolicyExecutionFlow`;`PolicyExecutionDecision::accept/reject/fail_closed/block` | done |
| 10.3 | HighRiskActionDecision | domain | `HighRiskActionDecisionStatus` | `HighRiskActionDecision::decide`;redline flow | done |
| 10.4 | ControlledExecutionRun | domain | `ControlledExecutionRunStatus` | `StartControlledExecutionRunFlow`;`mark_running/mark_completed/mark_failed/mark_terminated` | done |
| 10.4 | CaptureFact | domain | `CaptureFactStatus` | `RecordCaptureResultFlow`;capture candidate factory | done |
| 10.4 | HandoffTargetProgress | domain, embedded in `HandoffFact` | `HandoffTargetProgressStatus` | `HandoffTargetProgress::pending_for_target/begin_attempt/apply_observation`;same-attempt recovery | done_after_regression |
| 10.4 | HandoffFact | domain | `HandoffFactStatus` | `HandoffFact::open/begin_target_attempt/apply_target_observation`;handoff feedback;retry job | done_after_regression |
| 10.5 | FailureClassification | domain | `FailureClassificationStatus` | `ClassifySandboxFailureFlow`;failure seed from control/redline | done |
| 10.5 | ControlFact | domain | `ControlFactStatus` | `SubmitSandboxControlFlow`;consumer mapped command | done |
| 10.5 | CleanupGuard | domain | `CleanupGuardStatus` | `EvaluateCleanupReadinessFlow`;pending cleanup job | done |
| 10.5 | RedlineContainment | domain | `RedlineContainmentStatus` | `RecordRedlineContainmentFlow`;investigation handoff job / consumer | done |
| 10.6 | SandboxQueryAccessDecision | application | `QueryAccessStatus` | query service factories only;no write | done |
| 10.6 | SandboxReadProjection | domain / projection | `SandboxReadProjectionStatus` | projection stale / rebuild job | done_after_regression |
| 10.6 | DerivedInspectPreviewTrendState | domain / derived | `DerivedInspectPreviewTrendStatus` | derived maintenance job | done_after_regression |
| 10.6 | SandboxReconciliationReport | contracts / jobs | `SandboxReconciliationReportStatus` | immutable reconciliation report factory | done_after_regression |
| 10.7 | SandboxEventRelayRecord | domain / relay | `SandboxEventRelayStatus` | source tx append;publish job;relay feedback consumer | done_after_regression |
| 10.8 | SandboxIdempotencyRecord | application | `SandboxIdempotencyRecordStatus` | reserve / complete / failure;duplicate/conflict are invocation outcomes | done_after_regression |
| 10.8 | SandboxStoredOperationResult | application | `SandboxStoredOperationResultStatus` | immutable stored result save / exact replay | done_after_regression |
| 10.8 | SandboxConsumerReceipt | worker | `SandboxConsumerReceiptStatus` | consumer accepted / duplicate / delayed / failed / quarantine / no-op | done_after_regression |
| 10.8 | SandboxJobExitDisposition | jobs | `SandboxJobReportStatus` | job report accumulator finish / stored replay overlay | done_after_regression |
| 10.8 | AdapterAvailabilityState / RuntimeConfigSummary | infra | `AdapterAvailabilityStatus`;`RuntimeConfigStatus` | startup validation / health check | done |
| 10.9 | final audit | cross-step | all states | naming / trigger / test / phase audit | done |

---

## 11. 状态机写法模板

```text
[StateMachineName]
  StateA -> StateB
  StateA -> TerminalX
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|

---

## 12. Intake / Identity / Reference 状态矩阵

### 12.1 `ControlledExecutionIntakeStatus`

```text
[ControlledExecutionContext]
  factory -> PendingResolution
  PendingResolution -> Accepted
  PendingResolution -> Rejected
  PendingResolution -> Unresolved
  Unresolved -> PendingResolution
  Unresolved -> Rejected
  Accepted -> Closed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingResolution` | context 已打开,等待 body-free refs / responsibility summary 解析。 | 否 | `accept`;`reject`;`mark_unresolved` |
| `Accepted` | context 已形成正式 sandbox execution context,可继续 boundary / policy / run。 | 否 | `attach_boundary`;`attach_policy_decision`;`close`;被 launch precheck 读取 |
| `Rejected` | intake 被拒绝,不得 launch。 | 是 | query / audit read only |
| `Unresolved` | 必需 refs 缺失或冲突,当前不能 accepted。 | 否 | `mark_unresolved` 后的 refresh retry;`reject`;`close` |
| `Closed` | context 已收束,只读。 | 是 | query / audit read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingResolution` | `ControlledExecutionContext::open_pending(context_ref, source_refs, responsibility_context)` | `OpenControlledExecutionContextFlow` | source refs、responsibility context、context ref 已由 DTO / id generator 提供;不保存外部 body | 写 `context_ref/source_refs/responsibility_context`;`intake_status=PendingResolution` | begin UoW;reserve idempotency;stage context | `ApplicationErrorKind::Validation` |
| `PendingResolution` | `Accepted` | `ControlledExecutionContext::accept(&resolution, &identity)` | `OpenControlledExecutionContextFlow` | `ExecutionContextResolution.supports_execution_identity()==true`;identity 已由 `ExecutionEnvironmentIdentity::bind(...)` 构造且 context ref 一致 | `intake_status=Accepted`;写 `resolution_ref`;保留 trace ref | save context + identity;append audit;append `SandboxExecutionContextChanged`;stale projections;stored result | `DomainError::InvalidStateTransition` |
| `PendingResolution` | `Rejected` | `ControlledExecutionContext::reject(reason, trace_ref)` | `OpenControlledExecutionContextFlow` | resolver / validator 给出 forbidden body、scope invalid、policy-independent rejection reason | `intake_status=Rejected`;写 audit trace ref | save rejected context;append rejected event if canonical payload exists;stored result | `DomainError::InvalidStateTransition` |
| `PendingResolution` | `Unresolved` | `ControlledExecutionContext::mark_unresolved(reason)` | `OpenControlledExecutionContextFlow` | required ref missing / conflicted / unavailable;reason 来自 resolver outcome | `intake_status=Unresolved`;写 `resolution_ref` 或 unresolved reason marker | save context;stored rejected / unresolved result;affected projections stale | `DomainError::InvalidStateTransition` |
| `Unresolved` | `PendingResolution` | `ControlledExecutionContext::open_pending(...)` replacement flow or `mark_unresolved` retry surface | reference refresh / reserved intake retry | 只能由新 command 或正式 refresh retry 重新打开;不得由 query 隐式修复 | new context 或 same context retry marker;不得覆盖 rejected truth | Step 11 / Step 13 定义 retry identity and idempotency | `DomainError::InvalidStateTransition` |
| `Unresolved` | `Rejected` | `ControlledExecutionContext::reject(reason, trace_ref)` | intake rejection / cleanup close path | unresolved 已确定不能恢复;reason body-free | `intake_status=Rejected` | save context;append audit / stored result | `DomainError::InvalidStateTransition` |
| `Accepted` | `Closed` | `ControlledExecutionContext::close(reason)` | cleanup / control close path | run / capture / handoff / cleanup guard 已收束;close reason body-free | `intake_status=Closed` | save context;append audit / relay;stale projections | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Rejected -> Accepted` | rejected 是终态;必须新建 context。 | `DomainError::InvalidStateTransition` | Step 12 定义 rejected trace 是否追加。 |
| `Closed -> Accepted/PendingResolution` | closed 只读。 | `DomainError::InvalidStateTransition` | 新执行必须新建 context。 |
| `Accepted -> PendingResolution` | 已 accepted 的 truth 不因 reference stale 被降级为 pending;只标记 reference/projection stale。 | `DomainError::InvalidStateTransition` | reference state / projection stale 独立处理。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ControlledExecutionIntakeStatus` 已在 Step 6 定义。 |
| 触发函数是否存在 | 通过 | `open_pending/accept/reject/close` 已定义;`mark_unresolved` 来自 Step 6 变体表,Step 12 细化 exact error。 |
| 前置条件是否闭合 | 通过 | resolver outcome、identity、trace、reason 均有 Step 6 / 7 carrier。 |
| 副作用是否闭合 | 通过 | Step 9 intake flow 已闭口 audit / relay / stale / stored result / cursor。 |
| 测试切口 | 通过 | accepted、unresolved、rejected、terminal illegal、duplicate replay。 |

### 12.2 `ExecutionEnvironmentIdentityStatus`

```text
[ExecutionEnvironmentIdentity]
  factory -> Active
  Active -> Closed
  Active -> Invalidated
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | identity 可作为 boundary、policy、capture、cleanup 的责任锚点。 | 否 | `can_anchor_boundary`;`close`;`invalidate` |
| `Closed` | identity 已收束,只读。 | 是 | query / audit read only |
| `Invalidated` | identity 失效,必须阻断后续 boundary / run。 | 是 | failure / rejected surface read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Active` | `ExecutionEnvironmentIdentity::bind(identity_ref, &context, responsibility_anchor, trace_context)` | `OpenControlledExecutionContextFlow` | context 已 accepted 或同 transaction 即将 accepted;responsibility anchor 有 actor/work/trace safe refs | 写 identity fields;`identity_status=Active` | save identity with context;append intake audit / relay | `DomainError::InvalidStateTransition` |
| `Active` | `Closed` | `ExecutionEnvironmentIdentity::close(trace_ref)` | cleanup / context close path | context 可以 close;trace ref 正式来源 | `identity_status=Closed` | save identity;append audit;stale projection | `DomainError::InvalidStateTransition` |
| `Active` | `Invalidated` | `ExecutionEnvironmentIdentity::invalidate(reason)` | failure / control / redline path | reason 来自 failure/control/redline marker;不得来自 raw adapter error | `identity_status=Invalidated` | save identity or safety group;append failure/control/redline audit | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Closed -> Active` | closed identity 不能重新作为责任锚点。 | `DomainError::InvalidStateTransition` | 新 context / identity。 |
| `Invalidated -> Active/Closed` | invalidated 表示失效;只能新建 identity。 | `DomainError::InvalidStateTransition` | Step 12 定义恢复为新 command。 |
| `Active -> Active` by duplicate | duplicate replay 不重写 identity。 | `ApplicationErrorKind::IdempotencyConflict` 或 stored replay | idempotency stored result。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ExecutionEnvironmentIdentityStatus` 已在 Step 6 定义。 |
| 触发函数是否存在 | 通过 | `bind/close/invalidate/can_anchor_boundary` 已定义。 |
| 前置条件是否闭合 | 通过 | context、responsibility anchor、reason、trace 均已闭口。 |
| 副作用是否闭合 | 通过 | identity 只保存 sandbox responsibility anchor,不拥有 actor/member lifecycle。 |
| 测试切口 | 通过 | active can anchor;closed/invalidated cannot anchor;no external identity body。 |

### 12.3 Resolution owner split

`ReferenceResolutionStatus` 是 historical invalid split name。当前三个 owner 的 variant、生命周期与写入权限不同,禁止 alias、跨 enum 比较或用一个 resolver outcome 同时改写三个状态。

```text
ExecutionContextResolutionStatus
  factory/resolver value -> Resolved | Partial | Unresolved | Conflicted

ContextReferenceResolutionStatus
  factory/resolver value -> Complete | Stale | Unavailable | Invalid

ReferenceResolutionStateStatus
  factory -> Resolved | Unresolved | Invalid | Unavailable
  Resolved -> Stale
  refreshed replacement -> Resolved | Unresolved | Invalid | Unavailable
```

| enum / 状态 | 作用 | mutable transition | 允许的关键操作 |
|---|---|---|---|
| `ExecutionContextResolutionStatus::Resolved` | 一次 context resolution 足以支持 intake guard。 | 无;owning flow 用新 value 替换 | accept / continue guard |
| `ExecutionContextResolutionStatus::Partial / Unresolved / Conflicted` | 一次 context resolution 不足、缺失或冲突。 | 无;owning flow 用新 value 替换 | pending / reject / explicit re-evaluation |
| `ContextReferenceResolutionStatus::Complete` | 本次 intake refs 已解析为 body-free safe summary。 | owning relation 可消费新 resolver value | support normal intake path |
| `ContextReferenceResolutionStatus::Stale / Unavailable / Invalid` | refs 过期、来源不可用或边界非法。 | owning relation 可消费新 resolver value | pending / reject / delayed |
| `ReferenceResolutionStateStatus::Resolved` | tracked ref 与 safe summary 当前可用。 | `mark_stale` | read / re-evaluation |
| `ReferenceResolutionStateStatus::Stale` | source version 已变化。 | 以新 tracked state replacement 收口 | refresh |
| `ReferenceResolutionStateStatus::Unresolved / Invalid / Unavailable` | 长期 tracked state 无法安全使用。 | 以新 tracked state replacement 收口 | degraded / blocked / refresh |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `ExecutionContextResolutionStatus::{Resolved,Partial,Unresolved,Conflicted}` | `ExecutionContextResolution::{resolved,record_partial_resolution,mark_unresolved,reject}` | `OpenControlledExecutionContextFlow` / explicit re-evaluation | exact context/source refs;typed resolver outcomes;forbidden body rejected | owning resolution value fixed | same UoW with intake decision/audit/stored result where required | exact object error / `ApplicationErrorKind::Validation` |
| factory / replacement | `ContextReferenceResolutionStatus::{Complete,Stale,Unavailable,Invalid}` | `ContextReferenceResolution::{complete,...}` + closed outcome mapper | intake reference resolution / source change consumer | exact external ref;safe summary relation;typed source outcome | owning reference-resolution record fixed or replaced | no external truth write;intake remains fail-closed when non-Complete | exact object error / `ApplicationErrorKind::PortUnavailable` |
| factory | `ReferenceResolutionStateStatus::{Resolved,Unresolved,Invalid,Unavailable}` | `ReferenceResolutionState::{track_resolved,track_non_resolved}` | reference consumer / `RefreshSandboxReferenceStates` | exact tracked refs;body-free summary or typed non-resolved outcome | new tracked state fixed | save reference state;mark projection stale if source relation changed | exact object error / `ApplicationErrorKind::Validation` |
| `ReferenceResolutionStateStatus::Resolved` | `ReferenceResolutionStateStatus::Stale` | `ReferenceResolutionState::mark_stale` | reference changed consumer | exact state/version and marker;source change authorized | status stale;marker updated | same UoW assigns reference marker cursor;core truth unchanged | exact object error / version conflict |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| 三个 resolution enum 互相赋值或比较 | owner、variant 与生命周期均不同。 | compile-time type mismatch / exact relation error | 选择字段 owning enum并走对应 factory。 |
| raw event 直接写 `Resolved / Complete` | source event不是 resolver truth。 | validation / reference unresolved | 调用正式 resolver或返回 delayed。 |
| query 把 tracked `Stale / Unavailable` 改为 `Resolved` | query no-write。 | no-write violation | maintenance flow创建/替换 tracked state。 |
| `ContextReferenceResolutionStatus::Complete` 被当作 context accepted | reference完整不等于整体 context guard成立。 | exact relation error | 同时验证 `ExecutionContextResolutionStatus` 与 intake guard。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | 三个 canonical enum已分别定义;historical `ReferenceResolutionStatus` active usage为0。 |
| 触发函数是否存在 | 通过 | resolver factory、reference repository save、`mark_stale` 均有 Step 6/7/9 来源。 |
| 前置条件是否闭合 | 通过 | resolver outcome、tracked refs、marker、expected version 均闭口。 |
| 副作用是否闭合 | 通过 | reference path 只写 owning resolution / reference state / projection stale,不反写 core truth。 |
| 测试切口 | 通过 | three-owner split、factory relation、tracked stale、forbidden body、query no-write、projection stale propagation。 |

---

## 13. Boundary / Capability / Handle / Lease 状态矩阵

### 13.1 `BoundaryEstablishmentDecisionStatus` 与 `CoherentBoundaryStatus`

```text
[BoundaryEstablishmentDecision]
  factory -> Established | Rejected | PendingCapability | Unsupported | Failed

[CoherentBoundary]
  factory -> Required
  Required -> Established | Rejected | PendingCapability | Failed
  PendingCapability -> Established | Rejected | Failed
  Established -> Failed | Released
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `BoundaryEstablishmentDecisionStatus::Established` | backend/capability 裁定成立。 | 是 | create coherent boundary;start run |
| `Rejected` | requirement 不合法或不可满足。 | 是 | failure classification / query |
| `PendingCapability` | capability stale / unknown,等待 refresh。 | 否 | capability refresh;retry establish |
| `Unsupported` | backend明确不支持至少一项必需限制。 | 是 | rejected surface / new requirement only |
| `Failed` | adapter / backend establish failed。 | 是 | failure classification / cleanup guard |
| `CoherentBoundaryStatus::Required` | 完整 boundary requirement 已形成,尚未建立。 | 否 | establish / reject / wait capability |
| `Established` | resource / filesystem / network / process boundary 整体成立且有 matching handle。 | 否 | launch;cleanup release;failure |
| `PendingCapability` | coherent boundary等待可验证 capability。 | 否 | refresh / retry establishment |
| `Rejected` / `Failed` | boundary被拒绝或建立后失败。 | 是 | read / safety follow-up |
| `Released` | boundary 对应 handle 已释放。 | 是 | query / audit read only |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | any decision status | `BoundaryEstablishmentDecision::{established,rejected,...}` + closed mapper | `EstablishExecutionBoundaryFlow` | exact requirement;fresh checked capability for success;typed adapter outcome;no weak fallback | immutable decision value fixed | owning boundary consumes decision;stored result / audit records exact result | exact decision error |
| factory | `Required` | `CoherentBoundary::required(...)` | `EstablishExecutionBoundaryFlow` | context accepted;identity active且匹配;四维 requirements及profile/generation同代 | boundary_status required | save/stage exact boundary owner according to flow | exact boundary error |
| `Required` | `PendingCapability` | `CoherentBoundary::record_pending_capability(...)` | boundary flow / capability refresh handoff | capability unknown/stale;未形成 allow | status pending capability | preserve requirement;no handle/lease/launch | exact boundary error |
| `Required / PendingCapability` | `Established` | `CoherentBoundary::record_established(...)` | `EstablishExecutionBoundaryFlow` | immutable decision established;checked fresh capability;matching `Created | Active` handle;four dimensions same generation | status established;bind exact handle/capability/decision | atomic boundary group;lease/audit/relay/stored result | exact boundary error |
| `Required / PendingCapability` | `Rejected` | `CoherentBoundary::record_rejected(...)` | `EstablishExecutionBoundaryFlow` | decision rejected or unsupported;no handle admitted | status rejected;safe reason | save rejection group;zero launch | exact boundary error |
| `Required / PendingCapability` | `Failed` | `CoherentBoundary::record_establishment_failed(...)` | `EstablishExecutionBoundaryFlow` | typed establishment failure;partial external effect handled by lifecycle/cleanup owner | status failed;safe reason | safety follow-up;no weak success | exact boundary error |
| `Established` | `Failed` | `CoherentBoundary::mark_failed(...)` | lifecycle consumer / safety flow | body-free lifecycle/resource breach observation matches boundary | status failed | failure/cleanup owners advance;run history unchanged | exact boundary error |
| `Established` | `Released` | `CoherentBoundary::mark_released(...)` after checked release | cleanup / reaper guarded release | cleanup guard `Allowed`;exact handle release confirmed | status released | save handle/lease/boundary safety group | exact boundary error |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Rejected/Failed/Released -> Established` | terminal / released boundary cannot be re-established;create new boundary. | exact boundary transition error | new command with new boundary ref. |
| `PendingCapability -> Established` without fresh capability | stale/unknown cannot become allow by default. | `DomainError::InvalidStateTransition` | capability refresh required. |
| `Established -> Released` by query/job cleanup bypass | release requires explicit cleanup guard and adapter outcome. | `ApplicationErrorKind::Validation` | Step 12 release rejection. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `BoundaryEstablishmentDecisionStatus` and `CoherentBoundaryStatus` 已定义;historical short names active usage为0。 |
| 触发函数是否存在 | 通过 | requirement factory、adapter outcome mapper、`CoherentBoundary::established/rejected`、release port 均有来源。 |
| 前置条件是否闭合 | 通过 | requirements、capability、handle、cleanup guard、reason 都是 Step 6/7 carrier。 |
| 副作用是否闭合 | 通过 | boundary group save、relay、stored result、lease seed 已在 Step 9。 |
| 测试切口 | 通过 | established、unsupported rejected、pending capability、adapter failed、no weak fallback、release requires guard。 |

### 13.2 `BackendCapabilitySummaryStatus` 与 `IsolationEnvironmentHandleStatus`

```text
[BackendCapabilitySummary]
  factory -> Fresh | Stale | Unknown | Unsupported
  refresh -> replacement summary

[IsolationEnvironmentHandle]
  factory -> Created
  Created -> Active
  Created -> ReleasePending | OrphanSuspected
  Active -> ReleasePending
  ReleasePending -> Released
  Active -> OrphanSuspected
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | capability 可用于 boundary establish。 | 否 | `supports(requirements)` |
| `Stale` | capability 需刷新,不得直接 allow。 | 否 | refresh |
| `Unsupported` | backend 不支持要求。 | 是 | rejected surface |
| `Unknown` | capability 未知。 | 否 | refresh / pending |
| source unavailable | 不是 summary lifecycle variant;由 typed port outcome / application result 表达。 | 不适用 | pending capability / degraded report |
| `Created` | backend environment已建立但尚未进入受控运行。 | 否 | activate / guarded release / orphan inspect |
| `Active` | handle 可被 run / cleanup guard 引用。 | 否 | `mark_release_pending`;`mark_orphan_suspected`;inspect |
| `ReleasePending` | release 已开始但未确认。 | 否 | release ack / fail |
| `Released` | handle 已释放。 | 是 | query / audit read only |
| `OrphanSuspected` | handle 可能孤儿,必须进入 reaper / cleanup。 | 否 | orphan recovery |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory / replacement | `Fresh / Stale / Unknown / Unsupported` | `BackendCapabilitySummary` closed factories from typed candidate | boundary flow / capability refresh job | backend profile/ref/generation exact;body-free checked candidate | immutable summary status and supported limits fixed | save replacement summary/marker;affected read projection stale | exact capability error / `ApplicationErrorKind::PortUnavailable` |
| factory | `Created` | `IsolationEnvironmentHandle` establishment factory | `EstablishExecutionBoundaryFlow` | adapter established stable handle ref;exact capability/generation lineage | handle_status created | save with owning boundary establishment group | exact handle error |
| `Created` | `Active` | owning activation transition | `EstablishExecutionBoundaryFlow` / run preflight | coherent boundary established;lease open;identity/generation match | handle_status active | subsequent run guard may consume;no launch implied by status alone | exact handle error |
| `Active` | `ReleasePending` | `IsolationEnvironmentHandle::mark_release_pending()` | cleanup release flow reserved | cleanup guard allowed;lease active/expired;handle active | handle_status release pending | call release adapter;save safety group | `DomainError::InvalidStateTransition` |
| `ReleasePending` | `Released` | release outcome mapper + lease `mark_released()` | cleanup release flow reserved / reaper | `IsolationBackendPort.release_environment` confirms release | handle_status released;lease released | save safety group;append cleanup event | `DomainError::InvalidStateTransition` |
| `Created / Active` | `OrphanSuspected` | `IsolationEnvironmentHandle::mark_orphan_suspected(reason)` | `RunLeaseOrphanReaperFlow`;lifecycle consumer | expired/orphan lease or matching lifecycle uncertainty | handle_status orphan suspected | create `OrphanRecoveryRecord`;cleanup guard pending | exact handle error |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Unsupported -> Fresh` in same summary | summary是snapshot classifier,刷新必须创建replacement。 | exact capability error | refresh creates replacement summary. |
| `Released -> Active` | released handle cannot be resurrected. | `DomainError::InvalidStateTransition` | new boundary / handle required. |
| `OrphanSuspected -> Active` by query | reaper / lifecycle inspect owns recovery;query no-write. | `ApplicationErrorKind::NoWriteViolation` | reaper job report. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `BackendCapabilitySummaryStatus` and `IsolationEnvironmentHandleStatus` 已定义;不存在 active `Unavailable/Failed` variant。 |
| 触发函数是否存在 | 通过 | capability ports、handle factory / transition、release port 有 Step 6/7 来源。 |
| 前置条件是否闭合 | 通过 | backend profile、capability summary、cleanup guard、lease selection 均已闭口。 |
| 副作用是否闭合 | 通过 | no raw SDK response, no weak fallback, no release without guard。 |
| 测试切口 | 通过 | unknown not allow、unsupported rejected、active release pending、released terminal、orphan suspected。 |

### 13.3 `LeaseRecordStatus` 与 `OrphanRecoveryRecordStatus`

```text
[LeaseRecord]
  factory -> Active
  Active -> Expiring
  Active -> Expired
  Expiring -> Expired
  Expired -> OrphanSuspected
  Active -> Released
  Expired -> Released

[OrphanRecoveryRecord]
  factory -> Suspected
  Suspected -> Confirmed
  Confirmed -> Recovering
  Recovering -> Recovered
  Suspected -> Failed
  Confirmed -> Failed
  Recovering -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `LeaseRecordStatus::Active` | isolation handle lease 有效。 | 否 | expiry check;release |
| `Expiring` | lease 接近过期,可被 reaper 预选。 | 否 | expire;release |
| `Expired` | lease 已过期,必须 reaper / cleanup 检查。 | 否 | orphan suspect;release if guard allowed |
| `Released` | lease 已释放。 | 是 | query / audit read only |
| `OrphanSuspected` | lease 指向的环境可能孤儿。 | 否 | orphan recovery |
| `OrphanRecoveryRecordStatus::Suspected` | reaper 记录疑似 orphan。 | 否 | confirm;fail |
| `Confirmed` | lifecycle inspection 确认 orphan risk。 | 否 | recover;fail |
| `Recovering` | cleanup/release 正在收束。 | 否 | recovered;fail |
| `Recovered` | orphan 收束完成。 | 是 | report read only |
| `Failed` | orphan recovery 失败。 | 是 | report / manual follow-up |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Active` | `LeaseRecord::open(lease_ref, &handle, lease_window)` | `EstablishExecutionBoundaryFlow` | handle active;lease window from backend adapter / config summary / clock | lease_status active;write lease_window | save boundary/lease seed | `DomainError::InvalidStateTransition` |
| `Active` | `Expiring` | repository/job marker based on `LeaseRecord::is_expired(now)==false` and near-expiry policy | reaper preparation | current time within expiring window;policy summary from config later | lease_status expiring;write reaper marker | job report item;no release | `DomainError::InvalidStateTransition` |
| `Active` / `Expiring` | `Expired` | `SandboxMaintenanceSelectionRepository.list_expired_leases(now, page)` selected item + safety update | `RunLeaseOrphanReaperFlow` | `LeaseRecord::is_expired(now)==true`;versioned lease loaded | lease_status expired;write reaper marker | inspect lifecycle;job report item | `DomainError::InvalidStateTransition` |
| `Expired` | `OrphanSuspected` | `LeaseRecord` safety update + `OrphanRecoveryRecord::suspect(...)` | `RunLeaseOrphanReaperFlow` | backend lifecycle summary unavailable / indicates active external lifecycle;cleanup guard not yet allowed | lease_status orphan suspected | save orphan record;cleanup guard pending;report item | `DomainError::InvalidStateTransition` |
| `Active` / `Expired` | `Released` | `LeaseRecord::mark_released()` | cleanup release / reaper guarded release | cleanup guard allowed;release adapter confirms or no active external environment | lease_status released | save safety group;report item;append cleanup event | `DomainError::InvalidStateTransition` |
| factory | `Suspected` | `OrphanRecoveryRecord::suspect(orphan_record_ref, &lease, lifecycle)` | `RunLeaseOrphanReaperFlow` | lease expired or orphan suspected;lifecycle summary body-free | orphan_status suspected | save safety group;job report | `DomainError::InvalidStateTransition` |
| `Suspected` | `Confirmed` | `OrphanRecoveryRecord::confirm(lifecycle)` | reaper / lifecycle consumer | inspection confirms orphan risk | orphan_status confirmed | cleanup guard pending / report item | `DomainError::InvalidStateTransition` |
| `Confirmed` | `Recovering` | guarded recovery service | reaper reserved release path | cleanup guard allowed;release attempt started | orphan_status recovering | call release port;save report | `DomainError::InvalidStateTransition` |
| `Recovering` | `Recovered` | release outcome mapper | reaper reserved release path | release confirmed;lease marked released | orphan_status recovered | stored job report;cleanup event | `DomainError::InvalidStateTransition` |
| `Suspected` / `Confirmed` / `Recovering` | `Failed` | recovery failure mapper | reaper | sanitized failure reason | orphan_status failed | job partial failed;manual investigation marker | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Released -> Active/Expired` | released lease terminal。 | `DomainError::InvalidStateTransition` | new lease required. |
| `Active -> OrphanSuspected` without expiry/lifecycle evidence | cannot mark orphan without selection or lifecycle summary。 | `DomainError::InvalidStateTransition` | reaper must inspect. |
| `Recovered -> Failed` | recovered terminal for this orphan record。 | `DomainError::InvalidStateTransition` | create new record for later incident. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `LeaseRecordStatus`;`OrphanRecoveryRecordStatus` 已定义;historical short names active usage为0。 |
| 触发函数是否存在 | 通过 | `open/is_expired/mark_released/suspect/confirm/list_expired_leases/inspect_handle` 已由 Step 6/7/9 承接。 |
| 前置条件是否闭合 | 通过 | lease window、now、backend lifecycle summary、cleanup guard 均有 carrier。 |
| 副作用是否闭合 | 通过 | reaper 不绕过 cleanup guard;不重写 backend truth。 |
| 测试切口 | 通过 | expired selection、orphan suspected、release guarded、released terminal。 |

---

## 14. Policy / High-Risk 状态矩阵

### 14.1 `PolicyApplicabilityStatus`

```text
[PolicyApplicabilitySnapshot]
  factory -> Applicable
  factory -> Missing
  factory -> Conflicted
  factory -> Unsupported
  factory -> Stale
  Missing -> Applicable
  Stale -> Applicable
  Conflicted -> Applicable
  Unsupported -> Applicable
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Applicable` | policy / authorization summary 足以裁定。 | 否 | create accepted / rejected policy decision |
| `Missing` | 缺少必须 policy / authorization input。 | 否 | fail-closed;refresh |
| `Conflicted` | policy / authorization summary 冲突。 | 否 | fail-closed;refresh |
| `Unsupported` | policy source 不支持当前 boundary / action。 | 否 | fail-closed;operator follow-up |
| `Stale` | policy summary 过期。 | 否 | fail-closed;refresh |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory / any non-terminal | one of listed states | `PolicyApplicabilitySnapshot::from_policy_summary(...)` | `EvaluatePolicyExecutionFlow`;policy summary refresh | policy port returns body-free refs、authorization summary and applicability status | write `applicability_status`;high-risk markers copied separately | save policy group or reference state;append policy event / stored result | `DomainError::InvalidStateTransition` |
| `Missing` / `Conflicted` / `Unsupported` / `Stale` | `Applicable` | new policy summary snapshot | policy refresh / new evaluate command | refreshed summary is compatible with same context and boundary requirement | new snapshot or replacement snapshot status applicable | old decision remains historical;new command evaluates new decision | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| non-`Applicable` -> policy allow | fail-closed requirement;missing/stale/conflicted/unsupported cannot launch. | `DomainError::InvalidStateTransition` | `PolicyFailClosed` mapping in Step 12。 |
| policy refresh by query | query no-write。 | `ApplicationErrorKind::NoWriteViolation` | refresh job or command only。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `PolicyApplicabilityStatus` 已在 Step 6 support carrier 闭口。 |
| 触发函数是否存在 | 通过 | `PolicySummaryPort.load_policy_applicability` and snapshot factory 已定义。 |
| 前置条件是否闭合 | 通过 | policy refs、authorization summary、boundary requirement、trace context 已闭口。 |
| 副作用是否闭合 | 通过 | policy source truth 外部拥有,sandbox 只保存 refs / summary / status。 |
| 测试切口 | 通过 | missing/stale/conflicted/unsupported all fail-closed;no policy body persisted。 |

### 14.2 `PolicyExecutionDecisionStatus` 与 `HighRiskActionDecisionStatus`

```text
[PolicyExecutionDecision]
  Pending -> Accepted
  Pending -> Rejected
  Pending -> Blocked
  Pending -> FailClosed

[HighRiskActionDecision]
  PendingAuthorization -> Allowed
  PendingAuthorization -> Blocked
  PendingAuthorization -> Unsupported
  Allowed -> Blocked
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PolicyExecutionDecisionStatus::Pending` | 等待 policy / authorization input。 | 否 | accept / reject / block / fail_closed |
| `Accepted` | policy 允许 launch。 | 否 | `permits_execution`;start run |
| `Rejected` | policy 拒绝 launch。 | 是 | failure classification |
| `Blocked` | high-risk 或 redline 阻断 launch。 | 是 | redline containment / failure classification |
| `FailClosed` | 缺失或 unsafe input 触发保守失败。 | 是 | failure classification / retry with new policy summary |
| `HighRiskActionDecisionStatus::Allowed` | 高风险动作被正式允许。 | 否 | policy decision may remain accepted |
| `Blocked` | 高风险动作阻断。 | 是 | redline / failure |
| `PendingAuthorization` | 等待正式授权摘要。 | 否 | refresh / fail-closed |
| `Unsupported` | 当前动作不支持。 | 是 | reject / fail-closed |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | pending decision seed from `PolicyApplicabilitySnapshot` | `EvaluatePolicyExecutionFlow` | context and boundary requirement loaded;policy snapshot exists | decision_status pending | continue same flow to final decision | `DomainError::InvalidStateTransition` |
| `Pending` | `Accepted` | `PolicyExecutionDecision::accept(decision_ref, snapshot, requirements, trace_ref)` | `EvaluatePolicyExecutionFlow` | snapshot applicable;`authorization_disposition=Allowed`;high-risk decision `Allowed` | decision_status accepted;reason body-free | save policy group;append `SandboxPolicyDecisionChanged`;stored result | `DomainError::InvalidStateTransition` |
| `Pending` | `Rejected` | `PolicyExecutionDecision::reject(...)` | `EvaluatePolicyExecutionFlow` | policy summary explicitly denies execution | decision_status rejected;reason | save policy group;failure seed optional | `DomainError::InvalidStateTransition` |
| `Pending` | `Blocked` | `PolicyExecutionDecision::block(...)` or `HighRiskActionDecision::decide(...)` result | `EvaluatePolicyExecutionFlow`;redline command | high-risk marker blocked or unauthorized high-risk action found | decision_status blocked;link high-risk decision | save policy group;optional redline/failure handoff | `DomainError::InvalidStateTransition` |
| `Pending` | `FailClosed` | `PolicyExecutionDecision::fail_closed(decision_ref, snapshot, requirements, reason, trace_ref)` | `EvaluatePolicyExecutionFlow` | snapshot missing / stale / conflicted / unsupported,或authorization Missing / Conflicted / Unsupported | decision_status fail-closed;reason | save policy group;append event;stored result | `DomainError::InvalidStateTransition` |
| `PendingAuthorization` | `Allowed` | `HighRiskActionDecision::decide(action_decision_ref, decision_ref, markers)` | policy flow | all markers have explicit `source_disposition=Allowed`;empty marker set is allowed when no high-risk action requested | action_status allowed | save high-risk decision with policy group | `DomainError::InvalidStateTransition` |
| `PendingAuthorization` / `Allowed` | `Blocked` | `HighRiskActionDecision::decide(...)` | policy / redline flow | any marker blocked or unknown with fail-closed rule | action_status blocked;block_reason | redline / failure seed;no launch | `DomainError::InvalidStateTransition` |
| `PendingAuthorization` | `Unsupported` | `HighRiskActionDecision::decide(...)` | policy flow | marker unsupported | action_status unsupported | decision fail-closed / rejected | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Rejected/Blocked/FailClosed -> Accepted` | terminal decision for this evaluation;new policy evaluation required. | `DomainError::InvalidStateTransition` | new command / new decision ref。 |
| `Accepted -> Blocked` by query | query cannot revise launch policy. | `ApplicationErrorKind::NoWriteViolation` | redline command must create containment/failure. |
| `Unsupported -> Allowed` same high-risk decision | unsupported is terminal for this decision. | `DomainError::InvalidStateTransition` | new decision after new summary。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `PolicyExecutionDecisionStatus`;`HighRiskActionDecisionStatus` 已定义。 |
| 触发函数是否存在 | 通过 | policy decision factories and `HighRiskActionDecision::decide` 已定义。 |
| 前置条件是否闭合 | 通过 | snapshot、requirements、markers、reason、trace 均有 carrier。 |
| 副作用是否闭合 | 通过 | accepted 允许 run;non-accepted blocks launch and can seed failure/redline。 |
| 测试切口 | 通过 | accepted, rejected, fail-closed, high-risk blocked, non-accepted cannot start run。 |

---

## 15. Run / Capture / Handoff 状态矩阵

### 15.1 `ControlledExecutionRunStatus`

```text
[ControlledExecutionRun]
  factory -> Preparing
  Preparing -> Running
  Preparing -> Failed
  Running -> Completed
  Running -> Failed
  Running -> Terminated
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Preparing` | run 已准备但 backend launch 尚未进入 running。 | 否 | `mark_running`;`mark_failed` |
| `Running` | sandbox-owned run 正在执行。 | 否 | `mark_completed`;`mark_failed`;`mark_terminated` |
| `Completed` | run 完成。 | 是 | capture result |
| `Failed` | run 失败。 | 是 | failure classification;capture failure material |
| `Terminated` | control / timeout 终止。 | 是 | failure/control surface |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Preparing` | `ControlledExecutionRun::prepare(run_ref, context, boundary, policy, handle)` | `StartControlledExecutionRunFlow` | context accepted;boundary coherent;policy accepted;handle active | run_status preparing;write refs | stage run before backend launch | `DomainError::InvalidStateTransition` |
| `Preparing` | `Running` | `ControlledExecutionRun::mark_running(started_at)` | `StartControlledExecutionRunFlow` | isolation launch outcome established;clock now available | run_status running;write started_at | save run;append `SandboxRunChanged`;stored result | `DomainError::InvalidStateTransition` |
| `Preparing` | `Failed` | `ControlledExecutionRun::mark_failed(reason, finished_at)` | `StartControlledExecutionRunFlow` | launch adapter failed/unavailable or boundary/policy precheck failed after run prepare | run_status failed;write finished_at | failure classification seed;stored result | `DomainError::InvalidStateTransition` |
| `Running` | `Completed` | `ControlledExecutionRun::mark_completed(finished_at)` | lifecycle / capture-driven completion path | backend lifecycle / capture input confirms completion;not terminated | run_status completed;write finished_at | capture command may follow;append run event | `DomainError::InvalidStateTransition` |
| `Running` | `Failed` | `ControlledExecutionRun::mark_failed(reason, finished_at)` | lifecycle / capture / failure flow | backend failure / resource exceeded / timeout marker | run_status failed;write finished_at | failure classification;cleanup guard | `DomainError::InvalidStateTransition` |
| `Running` | `Terminated` | `ControlledExecutionRun::mark_terminated(reason, finished_at)` | control / timeout flow | accepted control fact kill/cancel/timeout;termination outcome body-free | run_status terminated;write finished_at | control/failure event;cleanup guard | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Completed/Failed/Terminated -> Running` | terminal run cannot restart;new run required. | `DomainError::InvalidStateTransition` | new command. |
| `Preparing -> Completed` | backend must first mark running or failed;completion without start hides launch truth. | `DomainError::InvalidStateTransition` | failure if backend reports inconsistent lifecycle. |
| any transition from runtime agent loop internals | sandbox does not own runtime agent loop state. | `ApplicationErrorKind::Validation` | store only stable backend summary. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ControlledExecutionRunStatus` 已定义。 |
| 触发函数是否存在 | 通过 | `prepare/mark_running/mark_completed/mark_failed/mark_terminated` 已定义。 |
| 前置条件是否闭合 | 通过 | context、boundary、policy、handle、clock、adapter outcome 有来源。 |
| 副作用是否闭合 | 通过 | no tools semantic execution;run truth separated from capture / runtime internals。 |
| 测试切口 | 通过 | running success, failed before start, policy denied, terminal cannot restart。 |

### 15.2 `CaptureFactStatus`

```text
[CaptureFact]
  record(...) -> Complete | Partial | Failed | Unavailable
  immutable after creation
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Complete` | capture refs 完整。 | 是 | material / observability handoff |
| `Partial` | capture 部分可用。 | 是 | degraded handoff / cleanup guard |
| `Failed` | capture 失败。 | 是 | failure classification / cleanup guard |
| `Unavailable` | capture source 不可用。 | 是 | failure/degraded surface |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Complete / Partial / Failed / Unavailable` | `CaptureFact::record(identity_bundle, run, guard, candidate, decision, materials, audit_trace_ref, captured_at)` | `RecordCaptureResultFlow` | run `Completed`;all lineage exact;closed completeness decision matches checked body-free candidate;material rows exact when allowed | immutable fact receives exact canonical status,keys/gaps/markers/reasons and observability ref | atomic capture/material/observability/audit/relay/projection/stored-result group;adapter failure does not fabricate material | `CaptureFactError` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Partial/Failed/Unavailable -> Complete` same capture | capture fact is immutable after creation;没有 transition method。 | `CaptureFactError` / no callable surface | exact replay同一fact;确认未提交时复用预绑定identity,不得生成第二truth。 |
| `Pending -> *` | `Pending`不是 `CaptureFactStatus` variant;in-flight属于application/adapter call。 | compile-time mismatch | application outcome按record matrix定格。 |
| capture status from artifact store | artifact truth external;capture only stores refs/digest. | `ApplicationErrorKind::Validation` | artifact handoff separate. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `CaptureFactStatus` exact 4 variants已定义;historical `CaptureStatus`和`Pending` active usage为0。 |
| 触发函数是否存在 | 通过 | 唯一 `CaptureFact::record(...)` 与 completeness decision闭合。 |
| 前置条件是否闭合 | 通过 | run, material refs, observability refs, reason have carriers。 |
| 副作用是否闭合 | 通过 | capture does not become artifact truth;handoff failure cannot rollback capture。 |
| 测试切口 | 通过 | complete/partial/failed/unavailable;no stdout/stderr body persisted。 |

### 15.3 `HandoffTargetProgressStatus`

```text
factory -> Pending
Pending -> Attempting
Retryable -> Attempting
Attempting -> Delivered | Retryable | Failed
Delivered | Failed -> terminal
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | target纳入fixed plan,尚无持久化attempt。 | 否 | begin exact attempt |
| `Attempting` | unique attempt已先提交,等待typed observation或same-attempt inspect。 | 否 | apply matching observation |
| `Delivered` | exact attempt有matching body-free receipt。 | 是 | read / aggregate derive |
| `Retryable` | typed observation允许在not-before age后重试。 | 否 | begin next exact attempt |
| `Failed` | target进入不可自动重试终态。 | 是 | report / manual recovery design |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `HandoffTargetProgress::pending_for_target(...)` via `HandoffFact::open(...)` | `OpenMaterialHandoffFlow` | ownership decision allowed;target plan exact;source lineage/material coverage valid | no attempt/receipt/reason;count 0 | same UoW saves complete pending progress set;external delivery calls `=0` | `HandoffTargetProgressError` / `HandoffFactError` |
| `Pending / Retryable` | `Attempting` | `HandoffFact::begin_target_attempt(...)` -> `HandoffTargetProgress::begin_attempt(...)` | delivery owner / `RetryPendingMaterialHandoffs` | exact target;new attempt ref;retry checked age meets not-before when retrying | persist attempt ref/start/count;clear prior retry fields as specified | commit attempt before exactly one `HandoffTargetDeliveryPort::deliver` call | exact progress/handoff error |
| `Attempting` | `Delivered / Retryable / Failed` | `HandoffFact::apply_target_observation(...)` -> progress `apply_observation(...)` | post-delivery / feedback / same-attempt recovery | observation exact matches handoff,target,attempt;closed outcome field relation valid | receipt or safe reason/retry age set mechanically | fresh read + CAS;aggregate/material lifecycle recomputed;source/earlier targets unchanged | exact progress/handoff error |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Delivered / Failed -> Attempting` | per-target terminal state cannot auto-reopen。 | exact progress transition error | future formal recovery creates authorized replacement path;current retry selects only `Retryable`。 |
| direct `Pending / Retryable -> Delivered` | attempt-before-call truth would be skipped。 | exact progress transition error | persist `Attempting`,then call/inspect exact attempt。 |
| handoff failure -> capture rollback | capture truth is already committed and independent。 | `DomainError::InvalidStateTransition` | save handoff failure / job report。 |
| query retry | query no-write and no adapter call。 | `ApplicationErrorKind::NoWriteViolation` | retry job or command. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `HandoffTargetProgressStatus` exact 5 variants已定义;material handoff不使用`DeadLetter`。 |
| 触发函数是否存在 | 通过 | `pending_for_target/begin_attempt/apply_observation`及aggregate wrappers已定义。 |
| 前置条件是否闭合 | 通过 | fixed target plan, exact attempt identity, typed observation, receipt/reason/retry age relation均闭合。 |
| 副作用是否闭合 | 通过 | no rollback capture;observability handoff does not assert observability store truth。 |
| 测试切口 | 通过 | attempt-before-call、same-attempt recovery、Delivered/Failed terminal、Retryable retry age、earlier target no rollback。 |

### 15.4 `HandoffFactStatus` aggregate derive

`HandoffFactStatus` 不是由 adapter 单次返回直接设置。它始终从完整 `HandoffTargetProgressSet` 和可选 cleanup guard override机械派生：

```text
cleanup guard ref present -> BlockedByCleanupGuard
else any target Failed    -> Failed
else any target Retryable -> Retryable
else all target Delivered -> Delivered
else                       -> Pending
```

| aggregate status | exact relation | 写入 owner / effect |
|---|---|---|
| `Pending` | 至少一项 `Pending | Attempting`,且无 `Failed | Retryable`;或其他未完成组合 | `open`或progress推进后derive;不得调用delivery adapter作为opening的一部分 |
| `Delivered` | complete target set全部 `Delivered` | terminal success for this batch;不迁移下游formal truth ownership |
| `Retryable` | 无failed且至少一项retryable | retry job只选择retryable targets,不重发delivered targets |
| `Failed` | 至少一项failed | auto-retry terminal;safe reason来自plan顺序首个failed target |
| `BlockedByCleanupGuard` | exact cleanup guard block observation存在 | override只改变aggregate display;progress及receipts不变 |

| 触发 | 函数 | 前置条件 | 副作用 / 禁止项 |
|---|---|---|---|
| open batch | `HandoffFact::open(...)` | allowed ownership decision、exact source/material/target relation | 创建全Pending progress并derive Pending;同UoW更新selected source lifecycle;external call `=0` |
| progress observation | `begin_target_attempt/apply_target_observation` | exact target/attempt and expected Version | 每次progress更新后重新derive;一个target失败不得删除earlier receipt或回滚capture/run |
| cleanup block / unblock | `mark_blocked_by_cleanup_guard/clear_cleanup_guard_block` | checked exact cleanup observation或`require_handoff_unblocked` | block不改progress;unblock从现有progress重算,不重放delivery |

`HandoffFactStatus`没有`DeadLetter`;`Failed`保持material handoff exhausted语义。`Unknown`只表示delivery side effect/commit recovery尚不能分类,必须inspect同一attempt,不能写入本aggregate或per-target enum。

---

## 16. Failure / Control / Cleanup / Redline 状态矩阵

### 16.1 `FailureClassificationStatus` 与 `ControlFactStatus`

```text
[FailureClassification]
  factory -> PendingInput
  PendingInput -> Classified
  Classified -> Terminal
  Classified -> Superseded

[ControlFact]
  factory -> Accepted
  Accepted -> Completed
  Accepted -> Failed
  Accepted -> Conflicted
  factory -> IgnoredDuplicate
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingInput` | failure source marker 不足,不能伪装 success。 | 否 | classify |
| `Classified` | failure kind 已稳定。 | 否 | terminal / supersede |
| `Superseded` | failure classification 被后续事实替代。 | 是 | read only |
| `Terminal` | terminal failure,必须阻断后续 execution。 | 是 | cleanup / redline / report |
| `Accepted` | control fact accepted。 | 否 | complete / fail / conflict |
| `IgnoredDuplicate` | duplicate control 已有 stored result。 | 是 | stored replay |
| `Conflicted` | control 与已有控制冲突。 | 是 | public error / audit |
| `Completed` | control 已收束。 | 是 | read only |
| `Failed` | control 处理失败。 | 是 | failure classification |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingInput` | `FailureClassification::classify(failure_ref, context_ref, SandboxFailureKind::Unknown, markers)` | `ClassifySandboxFailureFlow` | source markers empty or unknown;context exists | failure_status pending input | save safety group;append `SandboxFailureChanged`;stored result | `DomainError::InvalidStateTransition` |
| factory / `PendingInput` | `Classified` | `FailureClassification::classify(...)` | failure/control/redline/capture flows | failure kind known and source markers present | failure_status classified;write kind / markers | save safety group;append failure event | `DomainError::InvalidStateTransition` |
| `Classified` | `Terminal` | terminal failure classifier | failure flow / cleanup guard | failure kind terminal by policy;cleanup guard may be required | failure_status terminal | block further execution;cleanup guard / redline if required | `DomainError::InvalidStateTransition` |
| `Classified` | `Superseded` | supersede failure marker | reserved recovery / correction path | replacement failure classification exists | failure_status superseded | append audit;stale projection | `DomainError::InvalidStateTransition` |
| factory | `Accepted` | `ControlFact::accept(control_ref, context_ref, control_kind, source)` | `SubmitSandboxControlFlow`;`ConsumeSandboxControlRequestedFlow` | context exists;control source trusted;idempotency reserved | control_status accepted | save safety group;optional failure seed;event/stored result | `DomainError::InvalidStateTransition` |
| factory | `IgnoredDuplicate` | stored receipt / result replay | control consumer / command duplicate | idempotency duplicate matches existing stored result | no new control fact or a duplicate receipt marker only | return stored result;no repository mutation | `ApplicationErrorKind::IdempotencyConflict` |
| `Accepted` | `Conflicted` | `ControlFact::conflicts_with(existing)` result mapping | `SubmitSandboxControlFlow` | incompatible existing control loaded with version | control_status conflicted | save rejected control or stored rejected result;append event | `DomainError::InvalidStateTransition` |
| `Accepted` | `Completed` | control completion mapper | control/lifecycle feedback reserved | backend/control effect completed and body-free outcome present | control_status completed | save safety group;append control event | `DomainError::InvalidStateTransition` |
| `Accepted` | `Failed` | control failure mapper | control / lifecycle feedback | control effect failed with sanitized reason | control_status failed;failure_ref optional | failure classification seed;stored result | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Terminal -> Classified/PendingInput` | terminal failure cannot be reopened. | `DomainError::InvalidStateTransition` | new failure classification. |
| `Conflicted -> Accepted` | conflict terminal for this control fact. | `DomainError::InvalidStateTransition` | new command with conflict resolution. |
| duplicate replay writes new control | duplicate must return stored result. | `ApplicationErrorKind::IdempotencyConflict` | stored result replay. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `FailureClassificationStatus`;`ControlFactStatus` 已定义。 |
| 触发函数是否存在 | 通过 | `classify/accept/conflicts_with` and command/consumer flows defined。 |
| 前置条件是否闭合 | 通过 | failure kind, control source, existing control, idempotency have carriers。 |
| 副作用是否闭合 | 通过 | control does not perform business replay or runtime recovery directly。 |
| 测试切口 | 通过 | unknown pending, classified terminal, conflict, duplicate replay, no runtime recover。 |

### 16.2 `CleanupGuardStatus` 与 `RedlineContainmentStatus`

```text
[CleanupGuard]
  factory -> PendingEvidence
  PendingEvidence -> PendingInvestigation
  PendingEvidence -> Blocked
  PendingEvidence -> Allowed
  PendingInvestigation -> Blocked
  PendingInvestigation -> Allowed
  Blocked -> Allowed
  Allowed -> Completed

[RedlineContainment]
  factory -> Detected
  Detected -> Contained
  Contained -> HandoffPending
  HandoffPending -> Released
  Contained -> Terminal
  HandoffPending -> Terminal
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `CleanupGuardStatus::PendingEvidence` | capture / handoff / audit / investigation evidence 尚不完整。 | 否 | evaluate |
| `PendingInvestigation` | 等待 investigation handoff summary。 | 否 | evaluate after handoff |
| `Blocked` | cleanup/release 被 guard 阻断。 | 否 | reevaluate |
| `Allowed` | cleanup/release 可被显式 release flow 调用。 | 否 | mark_completed / release |
| `Completed` | cleanup guard 已完成。 | 是 | read only |
| `RedlineContainmentStatus::Detected` | redline 被检测。 | 否 | contain |
| `Contained` | redline 已隔离 / containment 生效。 | 否 | handoff pending / terminal |
| `HandoffPending` | security / investigation handoff 未完成。 | 否 | release / terminal after handoff |
| `Released` | release guard 允许后的释放完成。 | 是 | read only |
| `Terminal` | redline 处理收束但不可释放或需人工处置。 | 是 | report / audit |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingEvidence` / `PendingInvestigation` / `Blocked` / `Allowed` | `CleanupGuard::evaluate(cleanup_guard_ref, context_ref, capture_ref, handoff_ref, investigation_summary)` | `EvaluateCleanupReadinessFlow`;`EvaluatePendingCleanupGuardsFlow` | loaded capture/handoff/investigation summary;redline state if required;all body-free | guard_status from evaluator;blocking reasons updated | save safety group;append `SandboxCleanupChanged`;stored result/job report | `DomainError::InvalidStateTransition` |
| `PendingEvidence` | `PendingInvestigation` | `CleanupGuard::evaluate(...)` | cleanup command/job | capture/handoff evidence present;investigation summary missing | guard_status pending investigation | query surface pending;no release | `DomainError::InvalidStateTransition` |
| `PendingEvidence` / `PendingInvestigation` | `Blocked` | `CleanupGuard::blocked(...)` | cleanup command/job | handoff non-terminal, redline not contained, or evidence invalid | guard_status blocked;write blocking reasons | cleanup event;stored result;no release | `DomainError::InvalidStateTransition` |
| `PendingEvidence` / `PendingInvestigation` / `Blocked` | `Allowed` | `CleanupGuard::allowed(...)` | cleanup command/job | capture safe;handoff terminal or not required;investigation satisfied;redline containment compatible | guard_status allowed;clear blocking reasons | release may be triggered by explicit later flow only | `DomainError::InvalidStateTransition` |
| `Allowed` | `Completed` | `CleanupGuard::mark_completed()` | cleanup release reserved | release adapter confirms;lease/handle released | guard_status completed | save safety group;append cleanup event | `DomainError::InvalidStateTransition` |
| factory | `Detected` | `RedlineContainment::detect(redline_ref, context_ref, redline_kind)` | `RecordRedlineContainmentFlow` | redline kind from policy/runtime/filesystem/network/process/secret marker | containment_status detected | save redline;optional failure seed;event/stored result | `DomainError::InvalidStateTransition` |
| `Detected` | `Contained` | `RedlineContainment::contain(...)` | redline flow | containment action summary present;no advisory-only path | containment_status contained | investigation handoff may follow | `DomainError::InvalidStateTransition` |
| `Contained` | `HandoffPending` | `RedlineContainment::handoff_pending(...)` | redline flow / investigation job | investigation handoff required and not delivered | containment_status handoff pending | call investigation handoff port;cleanup blocked | `DomainError::InvalidStateTransition` |
| `HandoffPending` | `Released` | `RedlineContainment::release(...)` | investigation handoff consumer / cleanup release reserved | investigation summary delivered;cleanup guard allowed | containment_status released;release_guard_ref set | save redline + cleanup;append event | `DomainError::InvalidStateTransition` |
| `Contained` / `HandoffPending` | `Terminal` | terminal containment mapper | redline command/job | no release allowed or manual terminal reason | containment_status terminal | job report/manual follow-up;no release | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| non-`Allowed` cleanup -> release | evidence/handoff/investigation/redline guard not satisfied. | `DomainError::InvalidStateTransition` | Step 12 maps cleanup release rejection. |
| `Detected -> Released` | redline must be contained and handoff/guard satisfied. | `DomainError::InvalidStateTransition` | containment + investigation first. |
| query/job implicit release | query no-write;job no bypass unless explicit release flow exists and guard allowed. | `ApplicationErrorKind::NoWriteViolation` | cleanup command / release flow. |
| redline advisory only | detected redline must create containment truth. | `DomainError::InvalidStateTransition` | security redline event / failure seed. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `CleanupGuardStatus`;`RedlineContainmentStatus` 已定义。 |
| 触发函数是否存在 | 通过 | `evaluate/blocked/allowed/mark_completed/detect/contain/handoff_pending/release` 有对象或 flow 来源;release exact error mapping Step 12。 |
| 前置条件是否闭合 | 通过 | capture, handoff, investigation summary, redline kind, release guard have carriers。 |
| 副作用是否闭合 | 通过 | cleanup/release requires guard;redline not advisory-only;no investigation body persisted。 |
| 测试切口 | 通过 | allowed/blocked/pending investigation, detected/contained/handoff pending, release forbidden without guard。 |

---

## 17. Read / Projection / Derived / Reconciliation 状态矩阵

### 17.1 `SandboxQueryAccessStatus` and `SandboxQuerySurfaceStatus`

```text
[SandboxQueryAccessDecision]
  factory -> Permitted
  factory -> NotVisible
  factory -> Restricted
  factory -> Unavailable

final response (not a persisted lifecycle)
  -> Visible | Empty | NotVisible | Restricted | Stale | Degraded | Failed
   | Rebuilding | Disabled | MissingProjection | Unavailable
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Permitted` | query 可调用exact full reader。 | 是 | assemble final surface |
| `NotVisible` | caller 不可见。 | 是 | redacted / no body |
| `Restricted` | caller / scope 受限。 | 是 | restricted surface |
| `Unavailable` | access authority/dependency不可用,fail-closed。 | 是 | unavailable response;target read=0 |
| `SandboxQuerySurfaceStatus::*` | access之后的finite response classifier。 | 是 | response/cache output only;不反写access或truth |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Permitted` | `SandboxQueryAccessDecision::permitted(query_kind, context)` | all Query flows | ApiQuery context,actor,operation,digest exact;authority allows full read | immutable access decision | exact full reader then final surface mapper;write=0 | `ApplicationError` |
| factory | `NotVisible / Restricted / Unavailable` | exact access decision factory | all Query flows | actor/scope/access dependency result known;reason relation valid | immutable access decision | NotVisible/Unavailable target read=0;Restricted only authorized redacted reader | `ApplicationError` |
| response factory | any allowed `SandboxQuerySurfaceStatus` | query-specific checked response mapper | query flows | access status and exact read/projection/dependency outcome satisfy closed mapping | no persisted state mutation | no refresh/rebuild/UoW/id/audit/relay/handoff/cleanup | `ApplicationErrorKind::Validation` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| any query status -> truth success | query access is read surface,not truth lifecycle. | `ApplicationErrorKind::NoWriteViolation` | none;caller may run command/job. |
| final `Degraded/Stale -> Visible` by query-side rebuild | query cannot rebuild / refresh。 | `ApplicationErrorKind::NoWriteViolation` | rebuild job. |
| `NotVisible/Unavailable` target lookup | access-first rule requires zero target/index/body read。 | `ApplicationErrorKind::NoWriteViolation` / access error | return exact surface only。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SandboxQueryAccessStatus` exact 4 variants与`SandboxQuerySurfaceStatus` exact 11 variants已定义;historical `QueryAccessStatus` active usage为0。 |
| 触发函数是否存在 | 通过 | access factories和query-specific final surface mapper已定义。 |
| 前置条件是否闭合 | 通过 | projection/reference/visibility sources use Step 7 read ports。 |
| 副作用是否闭合 | 通过 | query no-write。 |
| 测试切口 | 通过 | visible,not visible,degraded,missing projection,no UoW begin。 |

### 17.2 `SandboxReadProjectionStatus` 与 `DerivedInspectPreviewTrendStatus`

```text
[SandboxReadProjection]
  factory -> Fresh
  Fresh -> Stale
  Stale -> Rebuilding
  Rebuilding -> Fresh
  Rebuilding -> Degraded
  Rebuilding -> Unavailable
  Fresh -> Degraded
  Degraded -> Stale

[DerivedInspectPreviewTrendState]
  factory -> Fresh
  Fresh -> Stale
  Stale -> Rebuilding
  Rebuilding -> Fresh
  Rebuilding -> Failed
  Rebuilding -> Unavailable
  Failed -> Stale
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `SandboxReadProjectionStatus::Fresh` | projection 与 committed truth snapshot 对齐。 | 否 | query visible;mark stale |
| `Stale` | projection 需 rebuild。 | 否 | rebuild |
| `Rebuilding` | rebuild 正在进行。 | 否 | finish fresh / degraded / unavailable |
| `Degraded` | projection 可读但不完整。 | 否 | rebuild retry;query degraded |
| `Unavailable` | projection 缺失或不可读。 | 否 | rebuild / query unavailable |
| `DerivedInspectPreviewTrendStatus::Fresh` | derived material 与 source refs 对齐。 | 否 | query visible;mark stale |
| `Failed` | derived rebuild 失败。 | 否 | retry;query degraded |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Fresh` | `SandboxReadProjection::create(projection_ref, context_ref, status_view_refs)` | projection rebuild job | rebuild snapshot exists;view refs from repository | projection_status fresh | save projection;job report success | `DomainError::InvalidStateTransition` |
| `Fresh` / `Degraded` | `Stale` | `SandboxProjectionRepository::mark_projection_stale(&uow, projection_ref, marker)` | accepted command / reference consumer | affected projection refs listed by repository;marker cursor from UoW | projection_status stale;write degraded/stale marker | reference marker cursor or truth cursor;no ad-hoc view ref | `ApplicationErrorKind::Validation` |
| `Stale` | `Rebuilding` | rebuild job state update | `RebuildSandboxReadProjectionsFlow` | versioned projection loaded;rebuild snapshot available | projection_status rebuilding | per-item UoW;job report item | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Fresh` | `SandboxReadProjection::rebuild_from_truth(...)` / save projection | `RebuildSandboxReadProjectionsFlow` | snapshot complete;factory succeeds | projection_status fresh;update view refs | save projection expected version;report success | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Degraded` / `Unavailable` | rebuild failure mapper | `RebuildSandboxReadProjectionsFlow` | snapshot partial/missing or projection store unavailable | projection_status degraded/unavailable;marker reason | report degraded/failed;query degraded | `DomainError::InvalidStateTransition` |
| factory | `Fresh` | `DerivedInspectPreviewTrendState::from_sources(derived_ref, source_refs, derived_kind)` | `MaintainDerivedInspectPreviewTrendFlow` | source refs body-free and sufficient | freshness_status fresh | save derived state;report success | `DomainError::InvalidStateTransition` |
| `Fresh` / `Failed` | `Stale` | `DerivedRebuildMarker` update | accepted source / derived job | source refs changed or explicit rebuild requested | freshness_status stale;write rebuild marker | job report / projection stale | `DomainError::InvalidStateTransition` |
| `Stale` | `Rebuilding` | derived job state update | `MaintainDerivedInspectPreviewTrendFlow` | versioned derived state loaded | freshness_status rebuilding | per-item UoW | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Fresh` / `Failed` / `Unavailable` | derived builder outcome mapper | `MaintainDerivedInspectPreviewTrendFlow` | builder completes, fails, or required source unavailable | freshness_status target;failure summary when failed | save derived state;report item;no core failure | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| projection / derived failure -> core failure | derived/read failure must not rewrite run/context truth. | `DomainError::InvalidStateTransition` | job report / degraded query only. |
| query `Stale -> Fresh` | query cannot rebuild。 | `ApplicationErrorKind::NoWriteViolation` | rebuild job. |
| mark stale by constructing projection ref from context string | affected refs must come from repository read surface. | `ApplicationErrorKind::Validation` | Step 11 index handoff. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SandboxReadProjectionStatus`;`DerivedInspectPreviewTrendStatus` 已定义;historical short names active usage为0。 |
| 触发函数是否存在 | 通过 | projection repository and derived repository methods defined in Step 7。 |
| 前置条件是否闭合 | 通过 | rebuild snapshot, affected projection refs, source refs, expected version have formal sources。 |
| 副作用是否闭合 | 通过 | no query rebuild;no core truth repair。 |
| 测试切口 | 通过 | stale/fresh/rebuilding/degraded/unavailable, derived failed not core failure。 |

### 17.3 `SandboxReconciliationReportStatus`

```text
[SandboxReconciliationReport]
  factory -> Clean
  factory -> IssuesFound
  factory -> Degraded
  factory -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Clean` | 对账未发现 unresolved finding。 | 是 | report read |
| `IssuesFound` | 发现需关注的问题。 | 是 | finding relay / report read |
| `Degraded` | report 不完整但安全可读。 | 是 | rerun job |
| `Failed` | report 生成失败。 | 是 | rerun job / failed report |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Clean` | `SandboxReconciliationReport` canonical immutable factory | `RunSandboxReconciliationFlow` | verified exact scope/basis coverage complete;no finding refs | report_status clean;finding refs empty | save full report group;stored job report | exact report error |
| factory | `IssuesFound` | canonical reconciliation report assembly | `RunSandboxReconciliationFlow` | ordered findings generated from verified body-free snapshot | report_status issues found;finding refs stored | save report;required finding relay in same group | exact report error |
| factory | `Degraded` | degraded report assembly | `RunSandboxReconciliationFlow` | snapshot partial / missing but safe degraded marker exists | report_status degraded;degraded marker | stored job report;no core repair | `ApplicationErrorKind::Validation` |
| factory | `Failed` | typed reconciliation assembly-failure factory | `RunSandboxReconciliationFlow` | valid failed basis and sanitized reason;generic job error不得随意造report | immutable failed report | stored report/job status mechanical mapping;no repair | exact report error |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| report status -> truth repair | reconciliation report does not repair core truth. | `ApplicationErrorKind::NoWriteViolation` | follow-up command required. |
| scope-only latest lookup by query without index | Step 11 index not defined in current boundary. | `ApplicationErrorKind::Validation` | Step 11 persistence/index handoff. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SandboxReconciliationReportStatus` 已定义;factory classifier无transition。 |
| 触发函数是否存在 | 通过 | report clean factory and report assembly path defined。 |
| 前置条件是否闭合 | 通过 | snapshot item, finding refs, degraded marker have carriers。 |
| 副作用是否闭合 | 通过 | report stored/replayed;does not repair truth。 |
| 测试切口 | 通过 | clean, issues found, degraded snapshot, failed report, duplicate replay。 |

---

## 18. Outbox / Relay 状态矩阵

### 18.1 `SandboxEventRelayStatus`

```text
[SandboxEventRelayRecord]
  factory -> Pending
  Pending -> Published
  Pending -> Retryable
  Pending -> Failed
  Pending -> DeadLetter
  Retryable -> Published
  Retryable -> Failed
  Retryable -> DeadLetter
  Failed -> Retryable
  Failed -> DeadLetter
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | relay 已追加,等待 publish。 | 否 | publish |
| `Published` | publisher 已确认或收到可验证delivery feedback。 | 是 | read/report |
| `Failed` | publish failed,可由 policy 决定 retry or dead-letter。 | 否 | retry / dead-letter |
| `Retryable` | 可重试 publish。 | 否 | publish retry |
| `DeadLetter` | 不再自动 publish。 | 是 | operations report |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `SandboxEventRelayRecord::pending(relay_ref, source_truth_ref, event_kind)` | accepted command / maintenance source transaction | canonical payload source exists;source cursor assigned by UoW;event kind matches Step 8 payload | relay_status pending;attempts 0 | append pending relay in same source tx;stored result includes relay refs | `DomainError::InvalidStateTransition` |
| `Pending` / `Retryable` | `Published` | exact relay observation mapper + relay CAS save | `PublishSandboxEventRelayFlow`;relay feedback consumer | exact committed attempt and frozen payload;candidate `Published`;versioned relay loaded | relay_status published;matching receipt;clear active attempt | job report success;source truth/cursor unchanged | exact relay transition error |
| `Pending` / `Failed` | `Retryable` | publisher outcome mapper | publish job | outcome retryable and retry policy not exhausted | relay_status retryable;last_error body-free | job report retryable;no source rollback | `DomainError::InvalidStateTransition` |
| `Pending` / `Retryable` | `Failed` | local/integrity failure mapper | publish job | failure classified before/after exact call with sanitized reason | relay_status failed;last_error | job report failed;source unchanged | exact relay transition error |
| `Pending` / `Retryable` / `Failed` | `DeadLetter` | `EventPublisherAdapterOutcome::dead_letter(reason)` mapping | publish job / feedback consumer | outcome dead-letter or retry exhausted | relay_status dead-letter;last_error | job report dead-letter;source truth unchanged | `DomainError::InvalidStateTransition` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| `Published/DeadLetter -> Pending` | terminal relay status for this record. | exact relay transition error | new relay record only if new source event. |
| publisher observation `Unknown` -> any lifecycle status | unknown只说明side effect/commit recovery不确定,不是finite status。 | exact observation/recovery error | inspect same exact attempt;不得猜Published/Retryable/Failed。 |
| publish failure -> source truth rollback | source truth committed before relay publish. | `DomainError::InvalidStateTransition` | report / retry / dead-letter. |
| event kind as payload substitute | event kind does not carry Step 8 payload fields. | `ApplicationErrorKind::Validation` | no relay append if payload source missing. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SandboxEventRelayStatus` exact variants为`Pending/Published/Failed/Retryable/DeadLetter`。 |
| 触发函数是否存在 | 通过 | pending factory、relay repository save、publisher outcome mapper defined。 |
| 前置条件是否闭合 | 通过 | source truth ref、event kind、payload source、expected version, outcome have sources。 |
| 副作用是否闭合 | 通过 | append and publish separated;publish failure no rollback。 |
| 测试切口 | 通过 | pending append, published, retryable, failed, dead-letter, unknown inspect, one-call budget, source unchanged。 |

---

## 19. Idempotency / Stored Replay / Entry / Adapter 状态矩阵

### 19.1 `SandboxIdempotencyRecordStatus` 与 `SandboxStoredOperationResultStatus`

```text
[SandboxIdempotencyRecord]
  factory -> Reserved
  Reserved -> Completed
  Reserved -> Failed

[SandboxStoredOperationResult]
  factory -> Completed
  factory -> Rejected
  factory -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Reserved` | operation 已占位,可执行一次。 | 否 | complete / fail |
| `Completed` | idempotency record 完成,可 replay stored result。 | 是 | duplicate invocation reads stored result;record不迁移 |
| `Failed` | operation failed before replayable result stored。 | 是 | retry/new request according to Step 13 |
| `SandboxStoredOperationResultStatus::Completed` | public accepted/completed result 可 replay。 | 是 | replay |
| `Rejected` | rejected public result 可 replay。 | 是 | replay rejected result |
| `Failed` | failed public result已完整保存并可 replay。 | 是 | replay failed result |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Reserved` | `SandboxIdempotencyRecord::reserve(idempotency_ref, &ctx)` / repository `reserve` | command / consumer / job template | context requires idempotency;digest canonicalized;key present | record_status reserved | begin UoW;continue mutation | `ApplicationErrorKind::Validation` |
| `Reserved` | `Completed` | `SandboxIdempotencyRecord::mark_completed(stored_result_ref)` / repository `complete` | mutation templates | stored result saved;stored_result_ref from stored repository | record_status completed;write stored_result_ref | complete idempotency before cursor/commit | `ApplicationErrorKind::Internal` |
| `Reserved` | `Failed` | `SandboxIdempotencyRepository::fail(...)` | mutation rollback/rejected failure path | failure before replayable result | record_status failed | rollback or save failed result per Step 8 replayability | `ApplicationErrorKind::Internal` |
| no state transition | duplicate / conflict invocation outcome | atomic reservation repository result | duplicate replay path | matching completed record or different digest/operation | existing record unchanged | matching duplicate exact replay;conflict returns error;both mutation=0 | `ApplicationErrorKind::IdempotencyConflict` / `DuplicateMissingResult` |
| factory | `Completed` / `Rejected` / `Failed` | `SandboxStoredOperationResult::from_service_outcome(...)` / `failed(...)` | mutation templates | outcome has public result ref and result kind | result_status from outcome | save stored result;link idempotency | `ApplicationErrorKind::Internal` |
| no lifecycle variant | missing/wrong/corrupt lookup | stored result repository typed error | duplicate replay | idempotency completed but exact full stored surface不可验证 | no write | return integrity / duplicate missing result;do not recompute | `ApplicationErrorKind::DuplicateMissingResult` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| duplicate invocation -> new `Reserved` | duplicate replay must not re-execute。 | `ApplicationErrorKind::IdempotencyConflict` | stored result only. |
| missing lookup -> recompute | missing result是integrity error,不是 `SandboxStoredOperationResultStatus`。 | `ApplicationErrorKind::DuplicateMissingResult` | Step 12 recovery. |
| `Failed -> Completed` same record | failed without replayable result terminal for that record. | `ApplicationErrorKind::IdempotencyConflict` | new key / retry rules Step 13. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SandboxIdempotencyRecordStatus`;`SandboxStoredOperationResultStatus` 已定义;`Conflict/Duplicate/Unavailable`不伪装为persisted variant。 |
| 触发函数是否存在 | 通过 | reserve/complete/fail/save/get repositories defined in Step 7。 |
| 前置条件是否闭合 | 通过 | operation name, digest, idempotency key, stored result ref have carriers。 |
| 副作用是否闭合 | 通过 | duplicate replay no mutation;stored result saves public result ref only。 |
| 测试切口 | 通过 | reserve/complete/duplicate/conflict/missing result/no recompute。 |

### 19.2 `SandboxConsumerReceiptStatus` 与 `SandboxJobReportStatus`

```text
[SandboxConsumerReceipt]
  factory -> Accepted
  factory -> Duplicate
  factory -> Delayed
  factory -> Rejected
  factory -> Failed
  factory -> Quarantined
  factory -> NoOp

[SandboxJobExitDisposition]
  factory -> Succeeded
  factory -> PartialFailed
  factory -> Failed
  factory -> Skipped
  factory -> Degraded
  duplicate overlay -> DuplicateReplayed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | consumer processed event and can ack。 | 是 | ack |
| `Duplicate` | event duplicate, stored receipt returned。 | 是 | ack |
| `Delayed` | event should retry later。 | 是 | no ack / retry |
| `Rejected` | event rejected safely。 | 是 | ack or quarantine by policy |
| `Failed` | consumer failed。 | 是 | retry / report |
| `Quarantined` | event unsafe or mismatched。 | 是 | quarantine / manual follow-up |
| `NoOp` | event合法且无需提交本地变化。 | 是 | ack / replay exact receipt |
| `Succeeded` | job fully succeeded。 | 是 | exit success |
| `PartialFailed` | some items failed。 | 是 | exit partial / report |
| `Failed` | job failed。 | 是 | exit failure / stored report |
| `Skipped` | job intentionally skipped。 | 是 | report |
| `Degraded` | job incomplete but safely reported。 | 是 | report / rerun |
| `DuplicateReplayed` | invocation-level duplicate返回原完整report。 | 是 | return stored report;不重跑job |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | any `SandboxConsumerReceiptStatus` | exact `SandboxConsumerReceipt` factory | consumer flows | envelope valid or duplicate/delayed/reject/quarantine/no-op reason relation known | immutable receipt status/result fixed | save full typed receipt if applicable;ack/retry/quarantine disposition | `ApplicationErrorKind::Validation` |
| factory / duplicate overlay | any `SandboxJobReportStatus` | `SandboxJobReportAccumulator::finish_report(...)` / exact stored replay overlay | operations job flows | item refs/counts/reasons complete;duplicate has exact stored report | report status and exit disposition derived | save full typed report for fresh run;duplicate write/call=0 | `ApplicationErrorKind::Internal` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| consumer duplicate -> flow re-execution | duplicate receipt must replay stored receipt。 | `ApplicationErrorKind::IdempotencyConflict` | stored receipt. |
| job duplicate -> rerun job | duplicate job returns stored report。 | `ApplicationErrorKind::IdempotencyConflict` | stored report. |
| consumer/job repairs core truth outside service | entry must call application facade only。 | `ApplicationErrorKind::Validation` | command/service flow. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SandboxConsumerReceiptStatus`;`SandboxJobReportStatus` exact variants已定义。 |
| 触发函数是否存在 | 通过 | receipt factories, accumulator, job exit disposition defined。 |
| 前置条件是否闭合 | 通过 | envelope, stored result, item refs, degraded markers have carriers。 |
| 副作用是否闭合 | 通过 | no core truth repair;report refs persisted for replay。 |
| 测试切口 | 通过 | accepted/duplicate/delayed/quarantine, job succeeded/partial/failed/skipped/degraded。 |

### 19.3 `AdapterAvailabilityStatus` 与 `RuntimeConfigStatus`

```text
[AdapterAvailabilityState]
  factory -> Available
  factory -> Degraded
  factory -> Unavailable
  factory -> Disabled
  Available -> Degraded
  Available -> Unavailable
  Degraded -> Available
  Unavailable -> Available

[SandboxRuntimeConfigSummary]
  factory -> Valid
  factory -> StartupBlocked
  factory -> Degraded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Available` | adapter 可调用。 | 否 | call allowed by service guard |
| `Degraded` | adapter 降级但部分 surface 可用。 | 否 | degraded read / maintenance path |
| `Unavailable` | adapter 不可用。 | 否 | port unavailable error |
| `Disabled` | adapter 被配置禁用。 | 否 | no call;hard guard still active |
| `Valid` | runtime config 可启动。 | 是 | startup success |
| `StartupBlocked` | runtime config 阻断启动。 | 是 | startup error |
| `Degraded` | runtime config 降级启动。 | 是 | read/job degraded surface |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory / any non-disabled | target availability | `AdapterAvailabilityState::available/degraded/unavailable/disabled(...)` | runtime builder / health check | health check / config validation returns sanitized reason | availability_status target | service maps to application error or degraded surface | `InfraError` / `ApplicationErrorKind::PortUnavailable` |
| factory | `Valid` / `StartupBlocked` / `Degraded` | `SandboxRuntimeConfigSummary::from_validated_config(...)` | startup/runtime builder | config loader/validator produced profile refs;no raw secret/body | config_status target;write disabled adapter kinds | entry startup / degraded result;no domain truth change | `InfraError` |

| 禁止迁移 | 非法原因 | 错误 | 审计 / 恢复 handoff |
|---|---|---|---|
| adapter `Disabled` disables fail-closed guard | config cannot weaken domain hard guard. | `InfraError` / `ApplicationErrorKind::Validation` | startup blocked. |
| adapter availability decides business allow | availability is technical state,not policy/boundary truth. | `ApplicationErrorKind::Validation` | policy/boundary decisions remain owner. |
| config stores secret/raw endpoint | config summary stores profile refs only. | `InfraError` | Step 14 config design. |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `AdapterAvailabilityStatus`;`RuntimeConfigStatus` 已定义。 |
| 触发函数是否存在 | 通过 | availability factories and config summary factory defined。 |
| 前置条件是否闭合 | 通过 | adapter kind, reason, validated_at, profile refs have carriers。 |
| 副作用是否闭合 | 通过 | technical state cannot override business truth。 |
| 测试切口 | 通过 | startup blocked, degraded read surface, unavailable adapter maps error, hard guard unchanged。 |

---

## 20. 单状态机停审汇总

本表使用既有测试族 ID,不为新增 owner 整体重编号。`STA-003` 是 resolution family 审计槽：canonical state inventory由 `ReferenceResolutionStateStatus` 计数,同时强制回查两个一次性 immutable classifier `ExecutionContextResolutionStatus` 与 `ContextReferenceResolutionStatus`;三者禁止 alias。`STA-020` 同时审计 access-first `SandboxQueryAccessStatus` 与最终 `SandboxQuerySurfaceStatus`,但只有后者属于 Step 6 shared status registry。

| STA | owner / canonical enum | graph / classifier | trigger / side effect closure | 停审 |
|---|---|---|---|---|
| `STA-001` | `ControlledExecutionContext / ControlledExecutionIntakeStatus` | transition | exact intake flow;terminal guard | pass |
| `STA-002` | `ExecutionEnvironmentIdentity / ExecutionEnvironmentIdentityStatus` | transition | bind/close/invalidate;no member lifecycle | pass |
| `STA-003` | resolution family / `ReferenceResolutionStateStatus` | transition + two immutable companions | resolver-only mapping;query no-write | pass |
| `STA-004` | `BoundaryEstablishmentDecisionStatus` | immutable decision classifier | typed capability/backend outcome | pass |
| `STA-005` | `CoherentBoundaryStatus` | transition | four-dimension coherence;guarded release | pass |
| `STA-006` | `BackendCapabilitySummaryStatus` | immutable snapshot classifier | checked freshness;no weak fallback | pass |
| `STA-007` | `IsolationEnvironmentHandleStatus` | transition | created/active/release/orphan;no resurrection | pass |
| `STA-008` | `LeaseRecordStatus` | transition | clock/expiry/release evidence | pass |
| `STA-009` | `OrphanRecoveryRecordStatus` | transition | guarded inspect/recover;terminal retention | pass |
| `STA-010` | `PolicyApplicabilityStatus` | snapshot classifier | non-applicable fail-closed | pass |
| `STA-011` | `PolicyExecutionDecisionStatus` | decision transition | accepted only after exact guard | pass |
| `STA-012` | `HighRiskActionDecisionStatus` | immutable decision classifier | non-Allowed launch calls `=0` | pass |
| `STA-013` | `ControlledExecutionRunStatus` | transition | no runtime agent-loop state | pass |
| `STA-014` | `CaptureFactStatus` | immutable classifier | `CaptureFact::record`;no `Pending` | pass |
| `STA-015` | `HandoffFactStatus` | mechanical aggregate | complete progress set;no `DeadLetter` | pass |
| `STA-016` | `FailureClassificationStatus` | transition | formal source relation;terminal guard | pass |
| `STA-017` | `ControlFactStatus` | transition / duplicate factory | no runtime recovery ownership | pass |
| `STA-018` | `CleanupGuardStatus` | transition / derive | non-Allowed release calls `=0` | pass |
| `STA-019` | `RedlineContainmentStatus` | transition | containment non-advisory | pass |
| `STA-020` | query decision/surface / `SandboxQuerySurfaceStatus` | finite read classifier | access first;all writes `=0` | pass |
| `STA-021` | `SandboxReadProjectionStatus` | transition | snapshot rebuild only;query no repair | pass |
| `STA-022` | `DerivedInspectPreviewTrendStatus` | transition | failure remains read-side only | pass |
| `STA-023` | `SandboxReconciliationReportStatus` | immutable classifier | full report factory;no core repair | pass |
| `STA-024` | `SandboxEventRelayStatus` | transition | `Published`;unknown inspect;source no rollback | pass |
| `STA-025` | `SandboxIdempotencyRecordStatus` | transition | one reservation winner;duplicate/conflict no state variant | pass |
| `STA-026` | `SandboxStoredOperationResultStatus` | immutable classifier | exact replay;missing is integrity error | pass |
| `STA-027` | `SandboxConsumerReceiptStatus` | public finite result | exact ack/retry/quarantine/no-op | pass |
| `STA-028` | `SandboxJobReportStatus` | public finite result | full stored report;duplicate no rerun | pass |
| `STA-029` | `AdapterAvailabilityStatus` | technical state | cannot authorize business allow | pass |
| `STA-030` | `RuntimeConfigStatus` | startup classifier | hard requirement blocks startup | pass |
| `STA-031` | `HandoffTargetProgressStatus` | transition | attempt-before-call;same-attempt inspect;terminal guard | pass |

### 20.1 Count baseline

| count surface | historical reviewed baseline | current DesignReopen baseline | arithmetic / scope |
|---|---:|---:|---|
| state machines / owner-level state subjects | 29 | **30** | 新增唯一 owner `HandoffTargetProgress`;finite classifier与read/public mapping仍按既有项目计数规则处理。 |
| canonical status enum entries in Step 10 inventory | 30 | **31** | 保留 `STA-001~030`,新增 `STA-031`;不整体重编号。 |
| shared status declarations in Step 6 registry | 38 | **39** | Step 6新增 `HandoffTargetProgressStatus`;包含不全部进入Step 10 transition inventory的visible/public/technical declarations。 |

三组数字不能互换。`31` 是后续 STA/TC 设计分母,`39` 不是状态机测试分母；本表是静态设计盘点,不表示任一测试已执行或通过。

---

## 21. 跨状态机命名 / 触发 / 测试审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态名是否均来自 Step 6 enum | 通过。本文未新增 Step 6 之外的正式状态 label。 | none |
| `Failed` 同名状态是否混淆 | 未混淆。run/capture/handoff/relay/job/adapter 的 `Failed` 只作用于各自 owner。 | Step 12 继续细化 error kind,不得用一个 failure code 覆盖全部状态机。 |
| `Delivered` / `Published` 是否被误当 source truth success | 未误用。handoff `Delivered`只表示完整target plan交接成功;relay只使用`Published`;两者均不改变 capture / source truth。 | none |
| `Visible` / `Fresh` 是否被误当 truth success | 未误用。query visible / projection fresh 只是 read surface。 | none |
| query no-write 是否保持 | 通过。query access, projection, derived, reconciliation 均未允许 query 修复状态。 | none |
| job no core repair 是否保持 | 通过。rebuild / reconciliation / retry / reaper job 只能维护 marker / projection / derived / relay / report,不能 accepted context / policy / run。 | none |
| cleanup / redline release 是否受 guard 控制 | 通过。release 必须经 cleanup guard allowed,redline 不 advisory-only。 | Step 12 细化 release rejection 和 recovery。 |
| adapter technical state 是否替代 business allow | 未替代。adapter availability / runtime config 只影响 technical surface,不修改 policy / boundary truth。 | none |
| factory initial/classifier是否与flow一致 | 通过。intake pending、coherent boundary required、run preparing、handoff progress pending、idempotency reserved均有合法迁移;capture/reconciliation/stored result直接immutable定格。 | none |
| transition helper 是否有同层 surface | 通过 with Step 11 handoff。domain methods、repository save/list、adapter outcome mapper 已在 Step 6/7/9;物理持久化由 Step 11 映射。 | Step 11 不得改变状态语义。 |
| phase reserved 是否被当前 flow 调用 | 未发现。release / retry exhaustion / future reopen 等均标记为 reserved 或由后续 Step 12/13/14 承接。 | none |
| 测试 / 验收状态名是否应统一 | 是。后续 05/06/07 必须使用本文 enum label,不得回到旧 README 口语状态。 | 05/06/07 承接。 |

---

## 22. 非法转换处理总表

| 非法转换类别 | 代表场景 | 当前错误口径 | Step 12 handoff | 测试切口 |
|---|---|---|---|---|
| terminal reopen | `Rejected -> Accepted`;`Closed -> Active`;`Released -> Active` | `DomainError::InvalidStateTransition` | 定义 exact domain error variant 和 public mapping。 | terminal cannot reopen |
| fail-closed bypass | `PolicyApplicabilityStatus::Missing -> Accepted decision` | `DomainError::InvalidStateTransition` / `ApplicationErrorKind::Validation` | 映射 `PolicyFailClosed`。 | missing/stale policy no allow |
| weak boundary fallback | unsupported boundary -> coherent | `DomainError::InvalidStateTransition` | 映射 boundary rejected / redline if applicable。 | no silent degrade |
| query write | query rebuilds projection, refreshes reference, retries handoff or releases cleanup | `ApplicationErrorKind::NoWriteViolation` | 定义 public no-write violation。 | assert no write UoW |
| job core repair | reconciliation fixes context / policy / run truth | `ApplicationErrorKind::Validation` | 定义 job no-repair error / report item。 | report only,truth unchanged |
| no-rollback violation | handoff / publish failure rolls back capture / source truth | `DomainError::InvalidStateTransition` | 定义 handoff/relay recovery and report mapping。 | capture/source unchanged |
| duplicate recompute | idempotency duplicate reruns command / consumer / job | `ApplicationErrorKind::IdempotencyConflict` / `DuplicateMissingResult` | 定义 duplicate missing result recovery。 | stored result replay |
| unsupported adapter string classification | service parses raw adapter error into domain state | `ApplicationErrorKind::PortUnavailable` / `Validation` | 定义 adapter outcome error variants。 | fake/durable outcome parity |
| cursor misuse | page cursor / timestamp / id used as truth cursor | `ApplicationErrorKind::Internal` | 定义 cursor invariant error and evidence。 | cursor source assertion |
| external body persistence | capture / reference / policy / observability body stored in sandbox truth | `ApplicationErrorKind::Validation` / `DomainError::InvalidStateTransition` | 定义 forbidden body mapping。 | forbidden body rejected |

---

## 23. Step 11~13 handoff items

| 后续 Step | 承接项 | 约束 |
|---|---|---|
| Step 11 persistence / transaction | state carrier persistence shape、expected version、repository atomic update、truth cursor / reference marker cursor physical assignment、projection index、latest report index、rollback visibility。 | 不得改变本文状态 enum、允许迁移和 owner;只能映射物理存储与事务行为。 |
| Step 11 persistence / index | Step 9 query selector gap: projection-by-context、direct handoff/failure/cleanup/redline selector、latest reconciliation by scope。 | 当前 boundary 仍返回 validation / missing projection;不得临时扫描 storage 或拼 ref。 |
| Step 12 error / recovery | `InvalidStateTransition` 精确 variant、policy fail-closed、boundary rejected、cleanup release rejection、redline handoff failed、relay dead-letter、duplicate missing result、consumer quarantine、job partial failed。 | 错误模型必须覆盖本文所有非法转换总表项。 |
| Step 13 concurrency / idempotency | idempotency digest、reserve/duplicate conflict、expected version conflict、stored result save/get ordering、job report replay、consumer receipt replay。 | duplicate 不得重算;concurrent write 不得放宽状态迁移。 |
| Step 14 config / external binding | runtime config status、adapter availability、lease window / retry / retention / disabled adapter kinds。 | 配置不得弱化 fail-closed、cleanup guard、redline containment 或 no-egress/host boundary。 |
| Step 16 test cuts | 每个状态机至少一个合法迁移和一个非法迁移测试;query no-write、relay no-rollback、job no-repair、cursor source 测试。 | 不伪造真实测试结果;只定义测试切口。 |

---

## 24. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§9 可按以下结构回填。本步不直接修改正式 `03`。

```md
## 9. 状态机与转换矩阵

> 校准来源:
> - `design-calibration/03_ddd_step_06_object_contracts.md`
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_10_state_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“状态主语筛选表”“状态矩阵批次表”“跨状态机命名 / 触发 / 测试审计表”和“非法转换处理总表”,了解本文状态机如何从对象契约和函数级 flow 收敛。

本章将 L4-sandbox 状态机按状态主语拆分,不使用全局 `SandboxGlobalState`。核心状态族包括 intake / identity / reference、boundary / capability / handle / lease、policy / high-risk、run / capture / handoff、failure / control / cleanup / redline、read / projection / derived / reconciliation、relay、idempotency / stored replay / entry-job / adapter technical states。

状态名必须使用 Step 6 已定义 enum variant。query 只读不写,job 不修 core truth,relay / handoff failure 不回滚 source truth,cleanup / redline release 必须经过 guard。
```

---

## 25. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 10 |
|---|---|---|
| Step 11 是否把 lease expiry 持久化为状态字段还是由 lease window + selection 派生 | 本文定义允许迁移和状态语义;物理 shape 留 Step 11。 | 否 |
| Query direct selector index 是否实现 | 当前不实现;Step 9 / 本文继续要求缺 finder/index 时返回 validation / degraded / missing projection。 | 否 |
| Release flow 是否在当前 phase 实现 | 本文只规定 release 必须 cleanup guard allowed;exact command / job binding 和 recovery 留 Step 12/13/14/07。 | 否 |
| retry/backoff/dead-letter 阈值 | material handoff只有`Retryable/Failed`,不使用`DeadLetter`;relay的retry/dead-letter数值留 Step 13/14。 | 否 |
| exact public error code | 本文只给 `DomainError::InvalidStateTransition` / application error kind 占位;Step 12 细化。 | 否 |

---

## 26. 自检

| 检查项 | 结论 |
|---|---|
| 是否创建 Step 10 中间产物 | 通过。本文为 `03_ddd_step_10_state_matrix.md`。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式文档仍等 Step 19 装配。 |
| 是否提前创建 Step 11 | 未创建。 |
| 是否先筛选状态主语 | 通过。§8 已区分进入 / 排除状态矩阵的主语。 |
| 是否按状态机逐个定义状态集合和矩阵 | 通过。§12~§19与§20按31个canonical inventory entries分组,未写全局混表。 |
| 状态名是否来自 Step 6 | 通过。未新增 Step 6 之外的正式状态 label。 |
| 触发函数是否能回指 Step 6/7/9 | 通过。domain method、repository save/list、adapter outcome mapper、application flow 均有来源。 |
| 是否闭合重点边界 | 通过。execution environment identity、resource limits、filesystem/network/process boundary、policy fail-closed、run/capture/handoff、observability material handoff、failure classification、cleanup/lease/reaper、redline 均有状态 owner。 |
| 是否混入禁止范围 | 未混入。tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval truth 均未进入 sandbox 状态机。 |
| 是否发现上游 blocker | 未发现阻塞 Step 10 的上游 blocker。Step 11 persistence / index handoff 已列出。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 27. 进入下一步条件

```text
当前 Step 10 已完成并停在用户审查点。

用户确认后,才能进入 Step 11 `定义持久化、事务与一致性契约`。
进入 Step 11 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_10_state_matrix.md`
4. `03_ddd_step_07_trait_port_adapter_contracts.md`
5. `03_ddd_step_09_function_flows.md`
6. 详细设计 SOP Step 11
7. 详细设计书写规范 §5.10
8. 真相源标准中 repository read/write parity、transaction ordering、projection rebuild、stored result、cursor 和 rollback visibility 相关条目

Step 11 必须闭口持久化 shape、repository exact schema、transaction / UoW order、version / cursor、projection/index、stored result 和 consistency 分层;不得在用户确认前创建 Step 11 文件。
```

---

## 28. 下游验收回查记录

| 回查 ID | 发现日期 | 发现位置 | 与本步 canonical 矩阵差异 | 回写结果 | 契约影响 |
|---|---|---|---|---|---|
| `SBX-ACC-STATE-NAME-001` | 2026-07-15 | 正式`03-详细设计.md`§9.4、§15.3 | 概览示例把run初态写为`Pending`,并把属于`FailureClassificationStatus`的`Classified`接到`ControlledExecutionRunStatus`;测试切口还出现了非正式`Publishing`、不存在的reconciliation `Pending -> Completed`以及其他口语状态。 | 当前DesignReopen再次按Step 6 canonical owner重验:run使用`Preparing`;relay exact set为`Pending / Published / Failed / Retryable / DeadLetter`;reconciliation为immutable factory classifier。 | 不新增业务状态;历史`Delivered` relay writeback已失效并被current matrix覆盖。 |
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | 2026-07-17 | `07` Step 6 `CB-SBX-05A/05B` | Boundary factory前置条件原包含尚未产生的policy summary,与phase顺序冲突。 | factory迁移改为accepted context + active identity + explicit requirements + validated profile / activated generation;Policy状态机仍在后序独立启动。 | 状态enum与迁移数量不变;仅校正factory guard与触发输入。 |

## 29. DesignReopen current closeout override (`v7.8`)

本节覆盖§1、§24、§26和§27中“尚未回填正式文档 / 停在原用户审查点”的历史流程快照。用户已明确授权一次性完成剩余设计收口；Step 10 current inventory已按Step 6/7权威契约重验,可传播到Step 16、正式`03~07`和planned implementation materials。

```text
current_plan_version = v7.8-closeout
step_10_design_static_status = completed
state_machine_count = 30
step_10_canonical_status_enum_count = 31
step_6_shared_status_declaration_count = 39
stable_test_inventory = STA-001..STA-031
historical_baseline = 29_state_machines/30_step10_enums/38_shared_declarations
new_owner = HandoffTargetProgress/HandoffTargetProgressStatus
capture_pending_variant = absent
material_handoff_dead_letter_variant = absent
relay_success_variant = Published
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = downstream_static_design_propagation
```
