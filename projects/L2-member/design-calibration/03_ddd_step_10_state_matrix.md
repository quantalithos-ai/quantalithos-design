# Step 10. 状态机与转换矩阵

> 项目：`L2-member`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10
> 对应书写规范：`standards/document/详细设计书写规范.md` §5.9
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 参考粒度与格式：`projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`
> 未来回填：`03-详细设计.md` §9「状态机与转换矩阵」
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`

## 1. Step 状态

| 项 | 记录 |
|---|---|
| 当前 Step | Step 10：状态机与转换矩阵。 |
| 前序门禁 | Step 6 已定义状态 enum / factory / transition helper；Step 9 已完成 10 Command、16 Query、14 Consumer、24 blocked event candidate、5 Job 的函数流。 |
| 本步目标 | 将状态 enum、对象函数和处理流收敛为逐状态机可编码的状态集合、ASCII 图、转换矩阵、非法转换与测试切口。 |
| 当前结果 | `completed / pass_with_upstream_and_design_blockers / stop_review`。28 个状态主语均已逐项停审；不可执行的迁移和协议来源缺口保持显式。 |
| 本步完成门禁 | 状态主语筛选完成；每个入选主语都有独立状态集合、ASCII 图、转换矩阵、非法转换表和停审记录；跨状态审计完成。 |
| 当前上限 | 本 Step 完成后立即停审。不得读取、创建或写入 Step 11；不得修改正式 `03-详细设计.md`。 |
| 实现 / 提交 | 不实现代码，不创建实现仓，不伪造测试或证据，不提交 commit。 |

### 1.1 Step 内批次

| 顺序 | 批次 | 内容 | 状态 |
|---:|---|---|---|
| 1 | 10.0 | 输入、SOP 回答、状态主语筛选、状态族、通用规则 | completed |
| 2 | 10.1 | CP01 Presence / Host 三个状态机 | completed / pass_with_upstream_blockers |
| 3 | 10.2 | CP02 Inbound 三个状态机 | completed / pass_with_design_gap |
| 4 | 10.3 | CP03 Runtime Mediation 三个状态机 | completed / pass_with_upstream_blockers |
| 5 | 10.4 | CP04 Outbound 三个状态机 | completed / pass_with_upstream_blockers |
| 6 | 10.5 | CP05 Interaction Trace 两个状态机 | completed |
| 7 | 10.6 | CP06 External Context Mirror 两个状态机 | completed / pass_with_upstream_blockers |
| 8 | 10.7 | CP07 Member Read Model 一个状态机 | completed |
| 9 | 10.8 | application / infra 四个技术状态机 | completed / pass_with_design_blockers |
| 10 | 10.9 | api / worker / jobs 七个 entry / result / registration 状态机 | completed / pass_with_design_blockers |
| 11 | 10.10 | 非法错误、Query、事件、依赖、测试、跨状态和历史污染审计 | completed / stop_review |

## 2. 本步输入与效力

| 输入 | 用途 | 使用边界 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 状态 enum、字段、factory、transition helper、错误 carrier。 | 状态矩阵不能发明 Step 6 不存在的对象方法。 |
| `03_ddd_step_08_protocol_contracts.md` | 10/16/14/24/5 协议分母、entry / result carrier、typed replay。 | `L2M-UP-005` 未关闭前，24 event 只能是 blocked semantic candidate。 |
| `03_ddd_step_09_function_flows.md` | exact flow、service method、UoW 和本地副作用。 | 以 §21 canonical index、§22 审计和 §27 final gate 为准。 |
| `02_hld_step_09_state_machine.md` 及 CP01~CP07 附录 | 概要状态 owner、主迁移、禁止迁移和传播方向。 | HLD 迁移若没有 Step 6 同层 helper，必须标记不可执行，不能让 repository 冒充 domain transition。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | versioned read / save、typed Store、UoW、adapter outcome。 | repository 负责持久化，不拥有领域状态迁移规则。 |
| 详细设计 SOP / 书写规范 / 真相源标准 | 状态主语筛选、逐状态机停审和可落码性门禁。 | 任何状态前置、来源、错误和副作用必须有正式回指。 |
| `L1-governance` Step 10 | 粒度、逐状态机格式、跨状态审计方法。 | 不继承 Governance 状态、outbox、错误名或业务语义。 |

## 3. SOP 问题回答

| 问题 | 本步回答 |
|---|---|
| 哪些对象是候选状态主语？ | Step 6 中被 Step 9 创建、推进、读取、暴露或 replay 的 disposition、lifecycle、availability、entry / result / registration carrier。 |
| 哪些候选被排除？ | immutable material / decision link / view revision、纯 policy、ref / ID / revision / watermark / cursor、schema、retry counter、外部 truth、无独立生命周期的分类或 marker。 |
| 当前仓有多少正式状态主语？ | 17 个业务 / support / projection 主语，加 11 个 application / infra / entry 技术主语，共 28 个；没有 `GlobalState` / `SystemState`。 |
| 如何区分 lifecycle 与 disposition？ | lifecycle object 可以通过 Step 6 helper产生 successor；disposition / entry result 由 factory 一次选择，创建后不可原地迁移。二者都逐项写矩阵，但后者只有 `factory -> variant`。 |
| 触发函数从哪里来？ | 只来自 Step 6 factory / member method、Step 9 named flow 或明确的 entry result factory；repository `save_*` 不是领域 trigger。 |
| 非法迁移返回什么？ | domain：`DomainError::IllegalTransition(SafeReasonCategory)`；application：`ApplicationError::ContractViolation`；infra/api/worker/jobs：各自 `*Error::ContractViolation`。不使用不存在的 `InvalidStateTransition`。 |
| Query 是否能迁移状态？ | 不能。16 个 Query 全部 no-write，不 reserve、不 refresh、不 rebuild、不 reconcile、不 handoff、不创建 successor。 |
| 状态副作用是什么？ | 仅本仓 local successor、immutable record、typed stored result / receipt / report、trace / projection candidate 或 gap；不声明外部 acceptance、delivery、observed、health、authorization 或 readiness。 |
| event / outbox 如何处理？ | `L2M-UP-005` 未关闭前不定义 event envelope、payload、source、subject、route、topic、publisher、outbox、delivery 或 retry；24 个 candidate 不进入状态矩阵。 |
| 单状态机如何停审？ | enum、状态名、trigger、前置字段、错误、副作用、测试切口逐项核对；缺 helper 或来源时保留 blocker / design gap。 |

## 4. 当前材料诊断与设计取舍

| 诊断 | 风险 | 本步取舍 |
|---|---|---|
| HLD 把部分 immutable decision 的“新 basis”写成旧记录状态变化。 | 实现可能原地重开历史。 | immutable decision 只允许新 record；矩阵把 `<new> -> variant` 与旧记录 successor 分开。 |
| `SubscriptionScopeStatus::Active -> Superseded` 在 HLD 有语义，但 Step 6 没有 `supersede` helper。 | `save_scope_successor` 被误当成 domain transition，或 `Superseded` 永远不可构造。 | 本迁移标为 `reserved / not callable`；进入实现前必须回开 Step 6 或在后续正式裁决中删除该变体。 |
| HLD 曾允许 `RuntimeSubmissionAttempt::Unknown -> ResultLinked`。 | 绕过 Step 6 `link_result` 的 `Submitted` 前置。 | 本步只保留 `Submitted -> ResultLinked`；Unknown 继续 fence，新事实必须走独立 formal resolution / successor 设计。 |
| `PublicationGapStatus` 没有 `Unknown`。 | 从其它 gap 状态机复制不存在的状态。 | Publication gap 仅 `Open / ResolutionPending / Resolved / Superseded`；attempt Unknown 通过 `gap_ref` 关联 Open gap。 |
| adapter availability 只有 enabled / disabled factory 与 degrade / unavailable helper。 | 实现自行补“恢复为 Enabled”。 | 不定义恢复迁移；恢复只能创建新的 availability marker，不能在旧 marker 上升级。 |
| API / worker / jobs disposition 是 boundary result。 | 被误写成 durable process lifecycle。 | 只写 factory-selected result graph；同一 carrier 不迁移，下一次 invocation 创建新 result。 |
| 旧 README 存在 CloudEvents、AG-UI、UDS、launch token 等预设。 | 未核验 transport 被写成状态 trigger / delivery truth。 | 全部只留历史污染记录；本步不出现 route、ack、listener、session 或 token lifecycle 状态。 |

## 5. 状态主语筛选

### 5.1 入选主语

| 候选主语 | 来源对象 / 字段 | 进入 Step 10 | 原因 | 状态族 |
|---|---|---|---|---|
| `StartupAdmissionDisposition` | `StartupAdmission.disposition` | 是 | 一次 local admission 的 immutable decision。 | business decision |
| `MemberPresenceStatus` | `MemberPresence.status` | 是 | 显式 member-local lifecycle。 | business lifecycle |
| `HostCollaborationAttemptStatus` | `HostCollaborationAttempt.status` | 是 | host seam local attempt successor。 | handoff attempt |
| `SubscriptionScopeStatus` | `SubscriptionScopeDecision.status` | 是 | current / historical scope decision。 | business decision |
| `InboundIntakeDisposition` | `InboundFactRecord.intake_disposition` | 是 | 单次 body-free intake 分类。 | source intake |
| `ScreeningDisposition` | `ScreeningDecision.disposition` | 是 | member-side pre-screen decision。 | business decision |
| `RuntimeDeliveryDisposition` | `RuntimeDeliveryDecision.disposition` | 是 | Runtime submission eligibility decision。 | business decision |
| `RuntimeSubmissionAttemptStatus` | `RuntimeSubmissionAttempt.status` | 是 | Runtime seam local attempt successor。 | handoff attempt |
| `RuntimeMaterialReceptionDisposition` | `RuntimeMaterialReception.disposition` | 是 | Runtime safe-material local reception 分类。 | source intake |
| `OutboundDisposition` | `OutboundDecision.disposition` | 是 | local material-creation eligibility。 | business decision |
| `PublicationAttemptStatus` | `PublicationAttempt.status` | 是 | publication seam local attempt successor。 | handoff attempt |
| `PublicationGapStatus` | `PublicationGap.status` | 是 | publication relation gap lifecycle。 | gap / reconciliation |
| `InteractionGapStatus` | `InteractionGap.status` | 是 | trace relation gap lifecycle。 | gap / reconciliation |
| `ObservationAttemptStatus` | `ObservationAttempt.status` | 是 | observation seam local attempt successor。 | handoff attempt |
| `ExternalContextResolutionStatus` | `ExternalContextResolution.status` | 是 | purpose / scope specific immutable neutral conclusion。 | source/reference |
| `ExternalContextGapStatus` | `ExternalContextGap.status` | 是 | external-context gap lifecycle。 | source/reference gap |
| `MemberProjectionStatus` | `MemberProjectionState.status` | 是 | per-kind projection freshness / rebuild lifecycle。 | projection maintenance |
| `MemberIdempotencyState` | `MemberIdempotencyRecord.state` | 是 | non-query technical reservation lifecycle。 | idempotency / replay |
| `MemberAdapterAvailabilityState` | `MemberAdapterAvailability.state` | 是 | adapter slot marker lifecycle。 | runtime / adapter |
| `MemberRuntimeBuildState` | `MemberRuntimeBuilderState.build_state` | 是 | facade assembly lifecycle。 | runtime / assembly |
| `BlockedSeamDisposition` | `BlockedSeamState.disposition` | 是 | fail-closed seam marker。 | runtime / adapter |
| `MemberApiHandlerDisposition` | `MemberApiHandlerResult.disposition` | 是 | factory-selected API boundary result。 | entry result |
| `MemberConsumerEntryState` | `MemberInboundConsumerEntry.entry_state` | 是 | factory-selected pre-dispatch posture。 | worker entry |
| `MemberWorkerRegistrationState` | `MemberWorkerRegistration.state` | 是 | logical Consumer declaration posture。 | worker registration |
| `MemberConsumerItemDisposition` | `MemberConsumerItemResult.disposition` | 是 | factory-selected worker item result。 | worker result |
| `MemberJobEntryState` | `MemberOperationsJobEntry.entry_state` | 是 | factory-selected job pre-dispatch posture。 | jobs entry |
| `MemberJobRunDisposition` | `MemberJobRunResult.disposition` | 是 | factory-selected logical job result。 | jobs result |
| `MemberJobRegistrationState` | `MemberJobRunnerRegistration.state` | 是 | logical job declaration posture。 | jobs registration |

### 5.2 明确排除

| 候选 | 是否进入 | 排除理由 |
|---|---|---|
| `RuntimeResultClassification` | 否 | immutable `RuntimeResultLink` 中的外部结果安全分类，不由 member 迁移。 |
| `CapabilityOutletStatus` | 否 | immutable `CapabilityOutletView` revision 分类；变化创建新 view。 |
| `ProjectionFreshness` / `ProjectionVisibility` | 否 | Query / view helper，不拥有生命周期。 |
| `CapabilityOutletActivation` | 否 | 明确 activation input，不是状态 owner。 |
| `MemberInfraStoreState` | 否 | 其 availability 已由 `MemberAdapterAvailabilityState` 承接；watermark / issue 是 marker，不新增重复状态机。 |
| material / snapshot / link / view revision | 否 | immutable record；新依据创建新 ID / revision。 |
| policy / resolver outcome helper | 否 | 纯 guard / value object；不持久化 lifecycle。 |
| ID / ref / revision / watermark / cursor / schema / digest | 否 | identity、顺序、协议或比较载体，不是状态。 |
| retry counter / lock / cache / SQL row state | 否 | 后续实现细节，当前 Step 无 owner。 |
| Runtime / host / Bus / Governance / Conversation / Tools / Artifact / observability 状态 | 否 | 外部 owner truth，只能以 typed ref / safe resolution 进入。 |
| `GlobalState` / `SystemState` / `MemberLifecycleState` | 否 | Step 6 不存在，新增会压平 28 个 owner。 |

## 6. 状态族与矩阵批次

| 批次 | 状态族 | 状态机 | 所属模块 | 主要触发来源 |
|---|---|---|---|---|
| 10.1 | CP01 business / attempt | StartupAdmission、MemberPresence、HostCollaborationAttempt | domain CP01 | 4 Command + HostFeedbackConsumer |
| 10.2 | CP02 business / intake | SubscriptionScope、InboundIntake、Screening | domain CP02 | 2 Command + InboundFactConsumer |
| 10.3 | CP03 business / attempt / reception | RuntimeDelivery、RuntimeSubmissionAttempt、RuntimeMaterialReception | domain CP03 | 2 Command + RuntimeMaterialConsumer |
| 10.4 | CP04 business / attempt / gap | OutboundDecision、PublicationAttempt、PublicationGap | domain CP04 | committed-fact Consumer、DeliveryFeedbackConsumer、PublicationRelay |
| 10.5 | CP05 gap / attempt | InteractionGap、ObservationAttempt | domain CP05 | MemberCommittedFactConsumer、ObservationFeedbackConsumer、ObservationRelay |
| 10.6 | CP06 source / gap | ExternalContextResolution、ExternalContextGap | domain CP06 | 2 Command + 5 source Consumers + refresh Job |
| 10.7 | CP07 projection | MemberProjectionState | domain CP07 | 2 committed-fact Consumers + 2 Jobs |
| 10.8 | application / infra | Idempotency、AdapterAvailability、RuntimeBuild、BlockedSeam | application / infra | reserve/complete/conflict、builder / adapter assembly |
| 10.9 | entry / result | API handler、worker entry / registration / item、job entry / result / registration | api / worker / jobs | entry factory、result factory、registry assembly |

## 7. 通用状态矩阵规则

| 规则 | 当前正式口径 |
|---|---|
| 状态名 | 必须逐字使用 Step 6 enum variant；不新增同义词。 |
| `<new>` | 表示 factory 创建新 record，不是已有 record 的隐式状态。 |
| successor | domain lifecycle helper返回新 revision / record；不得原地覆盖历史。 |
| decision / material / link / view | immutable；新 evidence 创建新 decision、link、view 或 resolution。 |
| Unknown | fence；时间、默认值、Query、retry、last-known 或 fake success不能升级。 |
| Ready / Submitted / Resolved / Current | 分别仅表示 member-local ready、本仓 seam invocation、local gap/source sufficiency、同 kind projection coverage。 |
| Query | 永远 no-write；只调用 read / policy mapper。 |
| 状态副作用 | 仅 local successor、typed stored carrier、trace / projection candidate、gap / safe issue；不得声称外部成功。 |
| event 副作用 | 当前为 none。24 semantic candidate 受 `L2M-UP-005` 阻塞，不能写 envelope / outbox / publisher / route / delivery / retry。 |
| version | 现有 record successor必须使用 Step 7 matching versioned read；revision / watermark / source version不能替代 `MemberStoreVersion`。 |
| 非法转换错误 | domain=`DomainError::IllegalTransition(SafeReasonCategory)`；application=`ApplicationError::ContractViolation`；infra/api/worker/jobs=`*Error::ContractViolation`。 |
| factory 参数错误 | 使用所属层已有 missing / invariant / invalid-entry error；不能把构造错误伪装成状态迁移。 |

### 7.1 非法转换的统一处理

| 场景 | 处理 | 写副作用 |
|---|---|---|
| domain helper 收到不允许的 From/To | 返回 `DomainError::IllegalTransition`。 | 不保存 successor，不调用外部 seam。 |
| application technical state组合非法 | 返回 `ApplicationError::ContractViolation`。 | 不完成 idempotency，不重跑。 |
| infra / entry / result carrier组合非法 | 返回本 crate `ContractViolation`。 | 不构造 positive carrier，不启动 listener / runner。 |
| terminal / immutable record 被要求重开 | 拒绝；要求新 record / successor chain。 | 保留历史。 |
| Query 尝试写状态 | contract violation；Query response 保守映射。 | 严格 no-write。 |
| upstream contract 缺失 | 返回 Blocked / Waiting / Unknown 等已有安全 surface。 | 可保存 local blocker / gap / result；不伪造 source truth。 |

## 8. 可落码性 blocker 与当前门禁

| ID / 项 | 状态 | 影响 | 当前处理 |
|---|---|---|---|
| `L2M-UP-001~008` | open | host、image、Runtime、event、credential、screening、subject exact seam。 | positive path 保持 blocked / pending / unknown；不影响 local matrix 成文。 |
| `L2M-DDD-001` | open | 目标实现仓 / crate 不存在。 | 只写 planned contract，不声称 compile。 |
| `L2M-DDD-002` | open | physical persistence / UoW / transaction 未裁决。 | 本步只写 logical successor / version要求。 |
| `L2M-DDD-003` | new / open | Step 8 要求 14 Consumer 保存并 replay 完整 `MemberConsumerReceipt`，完整 receipt 需要 authority / schema 等完整 `MemberConsumerSource`；Step 6 `MemberOperationContext` 只有较窄 `MemberConsumerSourceIdentity`，application 无法无损重建完整 receipt source。 | 禁止默认 authority/schema、空 detail、fake source、shell ref 或隐式参数。Step 6/8/9 的 source/context/receipt 构造面必须在进入实现前 targeted repair。 |
| `L2M-DDD-004` | new / open | CP04 的 `Prepared` attempt 与 `Open` gap 没有一条已闭合的 Step 9 创建路径：reception flow 只 append decision/material，relay 却只扫描 prepared；unknown 分支传入未构造/保存的 `new_gap_ref()`。此外 `PublicationGap::supersede` 的 Step 6 文案提到不存在的 `Unknown` 状态。 | `Eligible -> material -> Prepared`、route/contract gap、unknown fence 均不得假装已可执行。进入实现前须使 factory、Store append、UoW 顺序、relay selector 与合法 status 集合一致。 |
| `L2M-DDD-005` | new / open | CP05 `ObservationRelayFlow` 以两个参数调用 Step 6 单参数 `ObservationAttempt::mark_unknown`，且未 append matching `InteractionGap`；HLD 所需的 unknown-gap fence 没有可回指的 field / factory / flow closure。 | unknown 只可停留在 attempt fence；不得伪造 gap link、observed、retry 或 report success。需在 Step 6/7/9 针对 attempt–gap relation 选择并闭合一个设计。 |
| `L2M-DDD-006` | new / open | CP06 `RequestExternalContextRefreshFlow` 用 `ExternalContextGap::open(..., ResolutionPending, ...)` 创建新 gap，而 Step 6 factory 只允许 `Open / Blocked / Unknown` initial status；`Unknown -> ResolutionPending` 也没有当前 helper。 | 不得绕过 factory 或直接设字段。需裁决为先 `Open` 后 `request_refresh` 的同 UoW successor，或扩充经审计的 factory/helper 与 HLD 矩阵。 |
| `L2M-DDD-007` | new / open | CP07 HLD/Step 9 所需 `Degraded`、`Unknown`、optional disable/activate 和完整 rebuild failure coverage，未由 Step 6 提供同层 transition helper；Step 9 还把不存在于 domain successor 的 `store_version()` 当作 save version。 | 本步只保留已有 `initialize / mark_stale / start_rebuild / complete_rebuild / mark_failed` 边；其余 HLD intent 不可调用。版本必须来自 `Versioned<MemberProjectionState>`，不能由 domain object 伪造。 |
| scope supersede helper gap | open design gap | HLD 的 `Active -> Superseded` 没有 Step 6 同层 helper。 | 当前迁移不可调用；不得让 `save_scope_successor` 冒充 domain transition。Step 11/17 前须回开 Step 6 或删除不可达状态。 |
| 24 outbound semantic event candidates | blocked by `L2M-UP-005` | event activation / propagation。 | 不进入任何状态副作用。 |

## 9. CP01 Presence / Host 状态矩阵

### 9.1 `StartupAdmissionDisposition`

归属：`domain::presence::StartupAdmission`。这是一次 factory-selected immutable decision，不是可重开的 lifecycle。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | local startup prerequisites 可证明。 | 是 | `permits_presence`；作为新 `MemberPresence` 的 basis。 |
| `Rejected` | verified local invariant 拒绝本次 admission。 | 是 | Query / trace / projection read。 |
| `Blocked` | required owner/source contract 不可证明。 | 本 record 不可变；业务可用新 command 重试 | Query / trace；新 basis 创建新 admission。 |

#### 状态转换图

```text
<new AdmitMemberStartup>
      | PresenceAdmissionPolicy::evaluate
      +--> Accepted
      +--> Rejected
      +--> Blocked

existing record: no in-place transition
```

关键说明：`Blocked` 不能原地变 `Accepted`；credential、subject 或 source basis 变化时必须创建新 admission ID。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Accepted` | `StartupAdmission::decide(...)` | `AdmitMemberStartupFlow` | project/global 双锚一致；startup、credential 和 required resolutions 可证明；policy 返回 Accepted | append immutable admission | typed command result；trace / projection candidate；无 event/outbox | `DomainError::MissingRequiredInput` / `InvariantViolation` |
| `<new>` | `Rejected` | `StartupAdmission::decide(...)` | `AdmitMemberStartupFlow` | 可证明 subject/scope/input invariant 不满足；safe reason 存在 | append immutable admission | stored rejection/result；无 presence | 同上 |
| `<new>` | `Blocked` | `StartupAdmission::decide(...)` | `AdmitMemberStartupFlow` | owner/source/credential proof missing、stale、conflict 或 unknown；safe reason 存在 | append immutable admission | blocked-aware typed result；无 positive seam | 同上 |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| 任一 existing variant -> 任一 variant | admission immutable；新 evidence 不是旧 record 的 transition。 | 拒绝 mutation；新 command 创建新 ID。 |
| `Rejected` / `Blocked` -> `Accepted` by Query/time/default | 绕过 fail-closed proof。 | no-write / no successor。 |
| 非 `Accepted` -> new presence | `permits_presence()` 为 false。 | `DomainError::InvariantViolation`。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 与 Step 6 完全一致。 |
| trigger / 前置 | pass_with_upstream_blockers | exact credential / subject proof 受 `L2M-UP-006/008` 限制。 |
| illegal / effect | pass | immutable、无外部成功、无 event/outbox。 |
| 测试切口 | planned | 三个 factory 分支、missing proof、旧 record 不可重开、Accepted-only presence。 |

### 9.2 `MemberPresenceStatus`

归属：`domain::presence::MemberPresence`。每次迁移通过 `transition_to(...)` 形成 successor revision。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Starting` | 已由 accepted admission 建立，尚未 local-ready。 | 否 | Ready / Degraded / Draining / Unknown / Terminated successor。 |
| `Ready` | member-local prerequisites 满足。 | 否 | guarded inbound、Degraded / Draining / Unknown / Terminated successor。 |
| `Degraded` | 可解释 local degradation。 | 否 | constrained inbound、new Degraded / Draining / Unknown / Terminated successor。 |
| `Draining` | 停止建立新入站主线。 | 否 | Unknown / Terminated successor。 |
| `Terminated` | local presence 显式终止。 | 是 | read only。 |
| `Unknown` | local posture 无法证明的 fence。 | 否 | 仅带 formal local basis 的显式 successor。 |

#### 状态转换图

```text
<Accepted StartupAdmission> -> Starting -> Ready
                                  |        |
                                  +------> Degraded
                                  +------> Draining -> Terminated
                                  +------> Unknown

Unknown -- explicit formal local basis --> Starting / Ready / Degraded / Draining / Terminated
Terminated --X--> any state
```

关键说明：`Ready` 只表示 member-local ready；heartbeat、host health、container/process signal 都不是 trigger。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Starting` | `MemberPresence::start_from(...)` | `EstablishMemberPresenceFlow` | admission Accepted 且双锚一致；new ID / initial revision | append initial presence | typed result；trace / projection candidate | `DomainError::InvariantViolation` |
| `Starting` | `Ready` | `transition_to(Ready, reason, next_revision)` | `TransitionMemberPresenceFlow` | explicit target/reason；member-local prerequisites 可证明；expected revision + Store version match | append Ready successor | stored result；trace / projection candidate | `DomainError::IllegalTransition` |
| `Starting` / `Ready` / `Degraded` | `Degraded` | `transition_to(Degraded, reason, next_revision)` | `TransitionMemberPresenceFlow` | explicit safe degradation reason；不把 external health 当 local truth | append Degraded successor | same local effects | `DomainError::IllegalTransition` |
| `Starting` / `Ready` / `Degraded` | `Draining` | `transition_to(Draining, reason, next_revision)` | `TransitionMemberPresenceFlow` | explicit stop-new-intake basis | append Draining successor | new intake guarded off；stored result | `DomainError::IllegalTransition` |
| `Starting` / `Ready` / `Degraded` / `Draining` | `Unknown` | `transition_to(Unknown, reason, next_revision)` | `TransitionMemberPresenceFlow` | local integrity/posture cannot be proven；safe reason present | append Unknown fence | stored conservative result | `DomainError::IllegalTransition` |
| `Starting` / `Ready` / `Degraded` / `Draining` | `Terminated` | `transition_to(Terminated, reason, next_revision)` | `TransitionMemberPresenceFlow` | explicit terminal basis；revision/version match | append terminal successor | stop new local interaction; history retained | `DomainError::IllegalTransition` |
| `Unknown` | `Starting` / `Ready` / `Degraded` / `Draining` / `Terminated` | `transition_to(target, reason, next_revision)` | `TransitionMemberPresenceFlow` | new explicit command plus formal local basis for exact target；不能由 elapsed time / retry 推导 | append exact successor | stored result；no external claim | `DomainError::IllegalTransition` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Terminated -> *` | terminal history 不可重开。 | 新 admission / presence chain；当前 helper返回 `IllegalTransition`。 |
| `Draining -> Starting/Ready/Degraded` | draining 已停止新入站，不能自动恢复。 | `IllegalTransition`。 |
| `Ready` from host feedback / heartbeat / process signal | external observation 不是 local transition basis。 | 不调用 helper。 |
| `Unknown -> Ready` by timer/retry/Query | Unknown 是 fence。 | no-write；必须新 explicit command + basis。 |
| same revision overwrite | successor 必须使用 next revision + matching Store version。 | conflict / contract violation；不覆盖。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 六态逐字一致。 |
| trigger / 前置 | pass | `start_from` / `transition_to` 均存在。 |
| illegal / effect | pass | terminal、unknown、revision 与 local-only ready 均闭合。 |
| 测试切口 | planned | factory、每条合法边、Terminated fence、Draining fence、Unknown explicit basis、version conflict。 |

### 9.3 `HostCollaborationAttemptStatus`

归属：`domain::host_collaboration::HostCollaborationAttempt`。它只描述本仓 host seam attempt，不描述 host acceptance / session / health。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | body-free material-backed attempt 已建立。 | 否 | submit、block、unknown。 |
| `Submitted` | 本仓调用 formal host seam 并保存 submission ref。 | 否 | link feedback、unknown。 |
| `FeedbackLinked` | formal host feedback ref 已关联。 | 是 | read / trace only。 |
| `Blocked` | 调用前 seam / prerequisite 不成立。 | 是（本 attempt） | 新 basis 创建新 attempt。 |
| `Unknown` | side effect 无法证明。 | 是（本 attempt fence） | formal evidence 仅供评估新 successor / attempt，不自动重放。 |

#### 状态转换图

```text
<eligible material + formal boundary> -> Prepared -> Submitted -> FeedbackLinked
                                          |           |
                                          +-> Blocked +-> Unknown
                                          +----------------> Unknown
```

关键说明：当前 Step 9 没有已闭合的 host relay flow；`Prepared -> Submitted` 保留为 Step 6 callable contract，但 positive orchestration 受 `L2M-UP-001` 阻塞。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Prepared` | `HostCollaborationAttempt::prepare(...)` | `PrepareHostCollaborationFlow` | committed body-free material；formal `HostBoundaryRef`；stable idempotency key | append Prepared attempt | material + attempt + typed result；no host call | `DomainError::InvariantViolation` |
| `Prepared` | `Submitted` | `mark_submitted(submission_ref, attempted_at)` | host continuation not yet closed | formal seam was invoked and returned typed `HostSubmissionRef`；`L2M-UP-001` must close orchestration | append Submitted successor | local submission ref / time only | `DomainError::IllegalTransition` |
| `Submitted` | `FeedbackLinked` | `link_feedback(feedback_ref)` | `HostFeedbackConsumerFlow` | owner-specific source/correlation validated；typed feedback ref | append FeedbackLinked successor | typed consumer receipt / trace candidate；不改 presence | `DomainError::IllegalTransition` |
| `Prepared` | `Blocked` | `mark_blocked(reason)` | `PrepareHostCollaborationFlow` guarded branch | attempt 已能合法 prepare，但调用前 prerequisite/seam fails；safe reason present | append Blocked successor | blocked result；no seam invocation | `DomainError::IllegalTransition` |
| `Prepared` / `Submitted` | `Unknown` | `mark_unknown(reason)` | host continuation guarded branch | side effect / submission result cannot be proven；original key retained | append Unknown fence | local gap / conservative result as available | `DomainError::IllegalTransition` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Prepared -> FeedbackLinked` | 必须先证明本仓 seam invocation。 | `IllegalTransition`。 |
| `Unknown -> Prepared/Submitted/FeedbackLinked` | Unknown 不能自动解封；Step 6 无恢复 helper。 | 新 formal basis + new attempt / future explicit design。 |
| `Blocked -> Submitted` | blocked attempt 不可重开。 | 新 attempt。 |
| missing HostBoundaryRef -> fabricate Prepared/Blocked attempt | `prepare` 必须有 formal boundary；不能默认 ref。 | 返回 blocked command surface，不构造 attempt。 |
| `Submitted` interpreted as host accepted/healthy | owner truth 越界。 | 只返回 local posture。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 五态一致。 |
| trigger / 前置 | pass_with_upstream_blocker | methods 存在；positive relay flow / exact host contract受 `L2M-UP-001` 阻塞。 |
| illegal / effect | pass | Submitted/FeedbackLinked 不膨胀为 host truth。 |
| 测试切口 | planned | Prepared factory、submit/link ordering、blocked/unknown fence、missing boundary no fake attempt。 |

## 10. CP02 Inbound Boundary 状态矩阵

### 10.1 `SubscriptionScopeStatus`

归属：`domain::inbound::SubscriptionScopeDecision`。决定本身 append-only；replacement 创建新 decision。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 当前 member-local intake scope。 | 否 | `covers` / `can_screen`；等待显式 replacement。 |
| `Superseded` | 后继 scope 已替代本记录。 | 是 | historical read only。 |
| `Rejected` | proposed scope 违反 verified boundary。 | 是（本 record） | read；新 command 创建新 decision。 |
| `Blocked` | required source proof 不足。 | 是（本 record） | read；新 basis 创建新 decision。 |

#### 状态转换图

```text
<new scope command> -> Active / Rejected / Blocked
                         |
                         +-- replacement committed --> Superseded
                              (reserved: Step 6 helper missing)
```

关键说明：`Active -> Superseded` 是 HLD 语义，但当前没有 `SubscriptionScopeDecision::supersede(...)`；repository save 不能代替该 domain transition。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Active` | `SubscriptionScopeDecision::decide(...)` | `EstablishSubscriptionScopeFlow` / `ReplaceSubscriptionScopeFlow` | non-terminal matching presence；project subject；purpose/scope/freshness resolution sufficient；new revision | append new Active decision | update current lookup; typed result; trace / projection candidate | `DomainError::InvariantViolation` |
| `<new>` | `Rejected` | `SubscriptionScopeDecision::decide(...)` | same flows | policy proves scope expansion / subject / input invalid；safe reason | append Rejected decision | typed conservative result；current Active unchanged | 同上 |
| `<new>` | `Blocked` | `SubscriptionScopeDecision::decide(...)` | same flows | source resolution missing/stale/conflict/unknown；safe reason | append Blocked decision | no current-scope promotion | 同上 |
| `Active` | `Superseded` | **missing Step 6 helper; not callable** | `ReplaceSubscriptionScopeFlow` intent only | new Active decision for same subject/presence has committed；expected version matches | desired old-record successor | must be same UoW as current-index replacement | 不得调用；若实现私自更新则 contract violation |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Rejected/Blocked -> Active` on same record | decision immutable。 | new decision ID。 |
| `Superseded -> Active` | historical record不能重新成为 current。 | reject; new decision。 |
| `Active -> Superseded` via repository private field update | 缺同层 domain helper。 | design gap保持开放；不得实现猜测。 |
| non-Active used by new intake | `can_screen()` 为 false。 | blocked consumer result。 |
| Query/time/source update silently changes scope | no-write / append-only。 | no state write。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 四态一致。 |
| trigger / 前置 | pass_with_design_gap | 三个 factory state闭合；`Active -> Superseded` helper缺失。 |
| illegal / effect | pass | repository 不被伪装成 domain trigger。 |
| 测试切口 | planned / blocked_partially | 三个 factory分支可测；supersede测试待 targeted repair。 |

### 10.2 `InboundIntakeDisposition`

归属：`domain::inbound::InboundFactRecord`。这是一次 immutable intake classification，不是 Bus receipt / worker lifecycle。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | body-free source descriptor 可进入 screening。 | 是 | `can_screen` / create ScreeningDecision。 |
| `Duplicate` | 语义相同 source fact 已记录。 | 是 | replay existing receipt only。 |
| `Unsupported` | source kind/schema/fact shape 不支持。 | 是 | safe refusal only。 |
| `Blocked` | source/scope/inspection proof 不足。 | 是 | safe blocked result only。 |

#### 状态转换图

```text
<validated source item> -> Accepted

duplicate / unsupported / blocked
  -> worker or idempotency result surface
  -> no in-place InboundFactRecord transition
```

关键说明：Step 6 enum 穷举四类 intake 语义；当前 Step 9 fresh application flow只持久化 `Accepted` record，duplicate / unsupported / blocked 在 idempotency / worker boundary 返回，不编造第二 fact。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Accepted` | `InboundFactRecord::record(..., Accepted, ...)` | `InboundFactConsumerFlow` | owner/source/schema/body gate通过；current Active scope covers descriptor；safe inspection marker；correlation complete | append immutable body-free fact | screening may follow in same UoW；typed receipt; no raw body | `DomainError::InvariantViolation` |
| boundary result | `Duplicate` | no new fact factory in current flow | `InboundFactConsumerFlow` duplicate branch | matching idempotency key/channel/operation/digest and full stored receipt available | no new record | typed receipt replay only | `ApplicationError::ContractViolation` if receipt missing/mismatched |
| boundary result | `Unsupported` | no new fact factory in current flow | worker pre-dispatch | unsupported schema/kind proven | no domain record | `MemberConsumerItemDisposition::UnsupportedSchema` | `WorkerError::ContractViolation` |
| boundary result | `Blocked` | no new fact factory in current flow | worker/application blocked branch | authority/scope/body/source proof insufficient | no positive domain record | blocked receipt/result if constructible; `L2M-DDD-003` may block full receipt | `ApplicationError::ContractViolation` / `WorkerError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| any existing record -> other disposition | intake record immutable。 | create no replacement; classify next item separately。 |
| Duplicate -> Accepted by rerun | duplicate must replay stored carrier。 | fail closed if stored receipt unavailable。 |
| Unsupported/Blocked -> Accepted by default schema/authority | would fabricate source proof。 | worker refusal / blocked。 |
| raw body persisted to justify Accepted | violates body-free invariant。 | quarantine / contract error。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 四态一致。 |
| trigger / 前置 | pass_with_design_blocker | Accepted factory闭合；full duplicate/blocked receipt受 `L2M-DDD-003` 影响。 |
| illegal / effect | pass | no Bus delivery claim；no raw body。 |
| 测试切口 | planned | Accepted-only persistence、duplicate no-rerun、unsupported pre-dispatch、blocked no defaults。 |

### 10.3 `ScreeningDisposition`

归属：`domain::inbound::ScreeningDecision`。每个 decision immutable；rule/source变化创建新 decision，而不是重裁旧记录。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Passed` | member pre-screen requirements 满足。 | 是 | enter CP03 delivery evaluation。 |
| `Degraded` | formal narrowed rule允许受限 evaluation。 | 是 | constrained CP03 evaluation only。 |
| `Blocked` | verified boundary violation。 | 是 | read / trace only。 |
| `Pending` | rule/source/evaluation input不足。 | 是（本 decision） | wait for new formal basis and create new decision。 |

#### 状态转换图

```text
<Accepted InboundFact + Active Scope + Rule Resolution>
       | InboundScreeningPolicy::evaluate
       +--> Passed
       +--> Degraded
       +--> Blocked
       +--> Pending

existing decision: immutable
```

关键说明：`Passed` 不是 Governance approval 或 Runtime acceptance；`Degraded` 也不能被 Query / projection 升为 Passed。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Passed` | `ScreeningDecision::decide(...)` | `InboundFactConsumerFlow` | Accepted fact；matching Active scope；fresh purpose-specific rule resolution；clean body-free summary；policy Passed | append immutable decision | typed receipt；CP03 eligibility only; trace/projection candidate | `DomainError::InvariantViolation` |
| `<new>` | `Degraded` | `ScreeningDecision::decide(...)` | same flow | accepted fact + policy `permits_degraded` with formal narrowed basis；safe reason/source refs | append immutable decision | constrained eligibility; no authorization claim | 同上 |
| `<new>` | `Blocked` | `ScreeningDecision::decide(...)` | same flow | known scope/rule/safety violation | append immutable decision | no Runtime submission | 同上 |
| `<new>` | `Pending` | `ScreeningDecision::decide(...)` | same flow | rule/freshness/required input not sufficient | append immutable decision | no Runtime submission; gap/read candidate | 同上 |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Pending/Blocked -> Passed/Degraded` on same record | new basis requires new immutable decision。 | new ID / correlation; old history retained。 |
| `Degraded -> Passed` by Query/projection | read layers cannot write or widen semantics。 | no-write。 |
| non-Accepted intake -> any screening decision | only accepted fact can screen。 | invariant error / blocked result。 |
| rule body / local allowlist directly selects Passed | formal rule resolution required。 | fail closed。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 四态一致。 |
| trigger / 前置 | pass_with_upstream_blocker | exact rule taxonomy/source受 `L2M-UP-007` 限制。 |
| illegal / effect | pass | immutable、no re-screen、no Runtime/Governance truth。 |
| 测试切口 | planned | 四 factory分支、degraded formal basis、pending no promotion、accepted-only input。 |

## 11. CP03 Runtime Mediation 状态矩阵

### 11.1 `RuntimeDeliveryDisposition`

归属：`domain::runtime_mediation::RuntimeDeliveryDecision`。这是 immutable member-local eligibility decision。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Eligible` | exact Runtime boundary / entry mapping与 CP02 basis 可证明。 | 是 | prepare one local Runtime submission attempt。 |
| `Rejected` | verified local prerequisite不成立。 | 是 | read / trace only。 |
| `Blocked` | Runtime boundary / contract不能证明。 | 是 | read / blocked result。 |
| `Pending` | required source resolution仍等待。 | 是（本 decision） | new basis creates new decision。 |

#### 状态转换图

```text
<screening + inbound + Runtime resolution>
       | RuntimeMediationPolicy::evaluate_delivery
       +--> Eligible
       +--> Rejected
       +--> Blocked
       +--> Pending
```

关键说明：`Eligible` 只允许本仓准备 attempt；它不是 Runtime admission、run creation 或 outcome。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Eligible` | `RuntimeDeliveryDecision::decide(...)` | `SubmitScreenedFactToRuntimeFlow` | matching Accepted fact + permitted screening；project subject/correlation；formal entry mapping；`entry_contract_ref=Some` | append immutable decision | may prepare attempt; trace/projection candidate | `DomainError::InvariantViolation` |
| `<new>` | `Rejected` | same factory | same flow | screening/subject/material shape known invalid | append immutable decision | no Runtime call | 同上 |
| `<new>` | `Blocked` | same factory | same flow | boundary/mapping/contract absent or conflicting | append immutable decision | blocked typed result; no Runtime call | 同上 |
| `<new>` | `Pending` | same factory | same flow | source resolution pending, without exact mapping proof | append immutable decision | waiting/blocked result; no Runtime call | 同上 |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| existing decision -> another disposition | decision immutable。 | create new decision for new basis。 |
| `Blocked/Pending -> Eligible` by config/default | exact upstream mapping required。 | fail closed under `L2M-UP-003`。 |
| non-Eligible -> prepare attempt | `permits_submission()` false。 | invariant error。 |
| Runtime result link mutates decision | result owner is separate immutable link。 | no write to decision。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | 四态一致。 |
| trigger / 前置 | pass_with_upstream_blocker | exact entry mapping受 `L2M-UP-003` 阻塞。 |
| illegal / effect | pass | no Runtime lifecycle inflation。 |
| 测试切口 | planned | four factory branches、Eligible requires entry contract、non-Eligible cannot prepare。 |

### 11.2 `RuntimeSubmissionAttemptStatus`

归属：`domain::runtime_mediation::RuntimeSubmissionAttempt`。状态变化形成 attempt successor；`Submitted` 只证明本仓调用 seam。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | Eligible decision 已形成 local attempt。 | 否 | submit、block、unknown。 |
| `Submitted` | formal Runtime entry seam 已调用。 | 否 | link result、unknown。 |
| `ResultLinked` | matching formal Runtime result link 已关联。 | 是 | read / trace only。 |
| `Blocked` | invocation前 prerequisite不成立。 | 是（本 attempt） | new decision/attempt only。 |
| `Unknown` | submit side effect cannot be proven。 | 是（fence） | formal resolution may support a separately designed successor; no blind replay。 |

#### 状态转换图

```text
<Eligible decision> -> Prepared -> Submitted -> ResultLinked
                         |            |
                         +-> Blocked  +-> Unknown
                         +----------------> Unknown

Unknown --X--> ResultLinked in current Step 6 contract
```

关键说明：HLD 的 `Unknown -> ResultLinked` 不被继承；Step 6 `link_result(...)` 仅允许 `Submitted -> ResultLinked`。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Prepared` | `RuntimeSubmissionAttempt::prepare(...)` | `SubmitScreenedFactToRuntimeFlow` | Eligible decision with exact boundary/contract；stable key；new attempt ID | append Prepared attempt before seam | local-first attempt record | `DomainError::InvariantViolation` |
| `Prepared` | `Submitted` | `mark_submitted(submission_ref, attempted_at)` | same flow | RuntimeEntryPort invoked；typed submission ref returned；Clock time supplied | append Submitted successor | typed result; no Runtime accepted claim | `DomainError::IllegalTransition` |
| `Prepared` | `Blocked` | `mark_blocked(reason)` | same flow guarded branch | invocation前 mapping/seam/local prerequisite proven invalid；safe reason | append Blocked successor | no Runtime call | `DomainError::IllegalTransition` |
| `Prepared` / `Submitted` | `Unknown` | `mark_unknown(reason)` | same flow | submit result / side effect / post-seam commit cannot be proven；original key retained | append Unknown successor/fence | conservative result + gap candidate | `DomainError::IllegalTransition` |
| `Submitted` | `ResultLinked` | `link_result(&result_link)` | `LinkRuntimeAdmissionResultFlow` | formal result source validated；link matches attempt/correlation；version matches | append ResultLinked successor | append immutable link in same UoW; no Runtime truth write | `DomainError::IllegalTransition` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Prepared -> ResultLinked` | no proven invocation/submission ref。 | `IllegalTransition`。 |
| `Unknown -> ResultLinked` | Step 6 helper forbids it；unknown fence cannot be bypassed。 | keep attempt Unknown; future explicit recovery design required。 |
| `Blocked/ResultLinked -> Submitted` | terminal for this attempt。 | create new attempt only when independently authorized。 |
| `Submitted` interpreted as Runtime accepted/run created | external truth越界。 | local posture only。 |
| duplicate command calls Runtime again | duplicate must typed replay。 | application contract violation if stored result unavailable。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | five variants consistent。 |
| trigger / 前置 | pass_with_upstream_blockers | exact entry/result source受 `L2M-UP-003/004` 限制。 |
| illegal / effect | pass | Unknown fence与Submitted语义明确。 |
| 测试切口 | planned | local-first ordering、all legal edges、Unknown no link/retry、duplicate no resubmit。 |

### 11.3 `RuntimeMaterialReceptionDisposition`

归属：`domain::runtime_mediation::RuntimeMaterialReception`。这是 immutable local reception classification，不复制 Runtime material / outcome body。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | source/correlation/body gate sufficient。 | 是 | enter CP04 outbound evaluation。 |
| `Rejected` | known material/source boundary violation。 | 是 | read / trace only。 |
| `Duplicate` | same committed material already handled。 | 是 | replay existing receipt only。 |
| `Late` | old correlation material cannot replace current path。 | 是 | append-safe trace / receipt only。 |
| `Blocked` | source-family/contract proof absent。 | 是 | safe blocked result。 |
| `Unknown` | commitment/integrity cannot be proven。 | 是 | fence; no outbound evaluation。 |

#### 状态转换图

```text
<Runtime safe-material item>
      | RuntimeMediationPolicy::evaluate_reception
      +--> Accepted / Rejected / Duplicate / Late / Blocked / Unknown

existing reception: immutable
```

关键说明：`Accepted` 只表示 member local reception，不表示 Runtime outcome、publication 或 downstream success。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Accepted` | `RuntimeMaterialReception::receive(...)` | `RuntimeMaterialConsumerFlow` | formal source validation；committed refs/correlation/digest；body-free metadata；policy Accepted | append immutable reception | typed receipt; CP04 candidate; trace/projection candidate | `DomainError::InvariantViolation` |
| `<new>` | `Rejected` | same factory | same flow | known source/material/body boundary violation | append safe classification when flow admits record | no CP04 continuation | 同上 |
| duplicate boundary | `Duplicate` | no reprocessing; stored receipt replay | same flow duplicate branch | matching key/digest + complete stored receipt | no new reception | replay only; `L2M-DDD-003` blocks fabricated receipt | `ApplicationError::ContractViolation` |
| `<new>` | `Late` | same factory | same flow late branch | formal source attributable but correlation/order is older | append immutable late classification | trace/receipt only; no overwrite | `DomainError::InvariantViolation` |
| `<new>` | `Blocked` | same factory | same flow | source family / exact contract unavailable | append safe classification when constructible | blocked receipt/result; no CP04 | 同上 |
| `<new>` | `Unknown` | same factory | same flow | commitment/integrity/ordering cannot be proven | append Unknown classification | fence; no CP04 | 同上 |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| existing reception -> another disposition | immutable classification。 | new source item/reception ID。 |
| `Duplicate/Late/Blocked/Unknown -> Accepted` by retry/time | would overwrite history / fence。 | no transition。 |
| non-Accepted enters CP04 | `permits_outbound_evaluation()` false。 | contract violation / blocked result。 |
| body/ref expansion after receipt | no Runtime truth copy。 | reject carrier。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | pass | six variants consistent。 |
| trigger / 前置 | pass_with_upstream_and_design_blockers | exact source contract `L2M-UP-004/005`; full receipt `L2M-DDD-003`。 |
| illegal / effect | pass | immutable, Accepted-only CP04, no Runtime truth。 |
| 测试切口 | planned | six classifications、duplicate no rerun、late no overwrite、body-free invariant。 |

## 12. CP04 Outbound Boundary 状态矩阵

### 12.1 `OutboundDisposition`

归属：`domain::outbound::OutboundDecision`。这是从一条已接受的 Runtime material reception 和 purpose-specific neutral resolution 得出的 immutable local decision；不拥有 publication、delivery、Conversation 或 downstream truth。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Eligible` | source、target、purpose 和 body-free gate 已在 member-local 层证明。 | 是 | 仅作为 `MemberOutboundMaterial::create(...)` 的 basis。 |
| `Rejected` | 已证明 source、purpose、target 或 material rule 不合法。 | 是 | read / trace only。 |
| `Blocked` | formal publication seam、source family 或 required resolution 不能证明。 | 是 | fail-closed read；可在有已闭合 factory/flow 时关联 local gap。 |
| `Pending` | target 或 publication resolution 尚未形成足够依据。 | 是 | read / wait for a new basis。 |

#### 状态转换图

```text
<accepted RuntimeMaterialReception + matching purpose resolution>
                 | OutboundDecision::decide
                 +--> Eligible --(new material only)--> MemberOutboundMaterial
                 +--> Rejected
                 +--> Blocked
                 +--> Pending

existing decision: no in-place transition; new reception/resolution means new decision
```

关键说明：`Eligible` 不等于 material 已提交，也不等于 `PublicationAttempt::Prepared`、seam invoked、delivery、downstream acceptance 或 observation。当前 Step 9 的 CP04 consumer 只追加 decision/material；它没有闭合 Prepared attempt 的创建链，故不得把本图的 material 后续写成已可执行的 attempt 路径。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Eligible` | `OutboundDecision::decide(...)` | `RuntimeMaterialReceptionConsumerFlow` | reception 已为 `Accepted` 且 subject/correlation match；purpose 为 `OutboundPublication`；matching target resolution 对该 purpose/scope `usable_for(...)`；body-free policy pass | append immutable eligible decision | 可创建 immutable material；Prepared attempt 仍受 `L2M-DDD-004` 阻塞；无 event/outbox | `DomainError::InvariantViolation` |
| `<new>` | `Rejected` | same factory | same flow | source/purpose/target/material rule 已知不满足 | append immutable rejected decision | typed local receipt/result；不创建 material/attempt，不调用 seam | `DomainError::InvariantViolation` |
| `<new>` | `Blocked` | same factory | same flow | formal boundary、source family 或 resolution conflicting/absent，无法证明正向路径 | append immutable blocked decision | fail-closed receipt/result；不可默认 target、route 或 gap ref | `DomainError::InvariantViolation` |
| `<new>` | `Pending` | same factory | same flow | required target/publication resolution 尚待形成，但尚无可证明 positive mapping | append immutable pending decision | waiting/blocked surface；不创建 material/attempt | `DomainError::InvariantViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| existing decision -> another disposition | decision 是 immutable basis，不可由 feedback、gap、Query 或 Job 原地重裁。 | new reception/resolution evidence 形成新 decision ID。 |
| `Rejected/Blocked/Pending -> Eligible` by timeout/config/default | positive path 需要新的 exact source/resolution proof。 | fail closed；不得复用 last-known target。 |
| `Eligible -> Prepared/Submitted` on the decision record | material、attempt 与 decision 是不同对象。 | 先新建 material；attempt path 受 `L2M-DDD-004` 限制。 |
| any disposition -> delivery/accepted/observed | 这些均是 foreign-owner truth。 | 不存在该 member 状态。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / immutable rule | pass | 四个 variant 与 Step 6 一致。 |
| trigger / basis | pass_with_upstream_blockers | target/publication resolution 受 `L2M-UP-004/005` 限制。 |
| positive continuation | blocked | current consumer 未创建/保存 Prepared attempt，见 `L2M-DDD-004`。 |
| 测试切口 | planned | accepted-only source、four decision branches、no default target、eligible does not imply attempt。 |

### 12.2 `PublicationAttemptStatus`

归属：`domain::outbound::PublicationAttempt`。每次转换产生 append-only local successor；`Submitted` 只表示 member 调用了 formal publication seam，`FeedbackLinked` 只表示 formal feedback ref 已关联。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | immutable material 已选定，本仓尚未调用 seam。 | 否 | relay submit、block 或 unknown fence。 |
| `Submitted` | seam invocation 的本地记录已形成。 | 否 | feedback link 或 unknown fence。 |
| `FeedbackLinked` | matching formal downstream feedback ref 已关联。 | 是 | read / trace / projection only。 |
| `Blocked` | invocation 前 prerequisite 已知不能满足。 | 是（本 attempt） | read；新 basis 才能形成新 attempt。 |
| `Unknown` | publication side effect 或提交结果不能证明。 | 是（fence） | wait for formal evidence；禁止 blind retry。 |

#### 状态转换图

```text
<eligible material> -- PublicationAttempt::prepare --> Prepared
                                                   | \
                                                   |  +--> Blocked
                                                   v
                                                Submitted --> FeedbackLinked
                                                   |
Prepared ------------------------------------------+--> Unknown

Unknown --X--> Submitted / FeedbackLinked in the current contract
```

`Prepared` 的 local-first 记录、unknown gap 与 selector 当前没有一条闭合 Step 9 创建链：consumer 不 append Prepared，relay 只扫描 Prepared，unknown 分支也没有已创建并保存的 `gap_ref`。因此上述合法 domain edge 仅是 target contract，不是当前可执行 flow，见 `L2M-DDD-004`。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Prepared` | `PublicationAttempt::prepare(...)` | intended `RuntimeMaterialReceptionConsumerFlow` local preparation phase | eligible decision、matching body-free material、formal boundary ref、stable idempotency key | append Prepared attempt before any seam call | 当前无 completed append/UoW/selector chain；`L2M-DDD-004` blocks execution | `DomainError::InvariantViolation` |
| `Prepared` | `Submitted` | `mark_submitted(submission_ref, attempted_at)` | `PublicationRelayFlow` | prepared record/version loaded；formal handoff invoked；typed submission ref and Clock value returned | append Submitted successor | local result/report only; no delivery/acceptance/event claim | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Prepared` | `Blocked` | `mark_blocked(reason)` | `PublicationRelayFlow` guarded branch | route/seam/material/fence precondition proven unavailable before invocation | append Blocked successor | no handoff call; conservative report/result | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Prepared` / `Submitted` | `Unknown` | `mark_unknown(reason, gap_ref)` | `PublicationRelayFlow` | side effect/result cannot be proven; a matching `Open` gap has already been created and committed; original key retained | append Unknown successor | no blind replay; current flow lacks the required persisted gap relation (`L2M-DDD-004`) | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Submitted` | `FeedbackLinked` | `link_feedback(feedback_ref)` | `DeliveryFeedbackConsumerFlow` | owner-validated formal feedback matches attempt/subject/correlation; correct version loaded | append FeedbackLinked successor | may resolve a matching local gap if it already exists; never claims delivered | `DomainError::IllegalTransition(SafeReasonCategory)` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Prepared -> FeedbackLinked` | no proven local invocation/submission ref。 | `IllegalTransition`。 |
| `Blocked/FeedbackLinked/Unknown -> Submitted` | terminal/fence posture cannot be reopened on the same attempt。 | formal new evidence may support a separately designed new attempt only。 |
| `Unknown -> FeedbackLinked` | current helper requires `Submitted`; unknown cannot be bypassed by late/default feedback。 | preserve fence and record a separately designed resolution relation. |
| `Submitted` or `FeedbackLinked` interpreted as delivery/acceptance | attempt owns local invocation/ref linkage only。 | no such state/effect is emitted. |
| retry executes seam before typed duplicate/evidence check | violates idempotency and unknown fence。 | `ApplicationError::ContractViolation`; no seam call。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / helper | pass | five variants and all named Step 6 helpers accounted for。 |
| flow reachability | blocked | Prepared creation, gap creation and relay selector do not form one executable chain (`L2M-DDD-004`)。 |
| foreign truth fence | pass | Submitted/FeedbackLinked never mean delivery/acceptance/observed。 |
| 测试切口 | planned | local-first ordering、five legal edges、unknown no retry、feedback correlation、duplicate no handoff。 |

### 12.3 `PublicationGapStatus`

归属：`domain::outbound::PublicationGap`。这是 member-owned unresolved relation lifecycle，不是 downstream delivery lifecycle；`Resolved` 只关闭本地 relation 的解释缺口。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | 已知 route/contract/submission/feedback relation 未闭合。 | 否 | request resolution、resolve、supersede。 |
| `ResolutionPending` | 已存在 formal resolution request ref。 | 否 | resolve、supersede。 |
| `Resolved` | matching formal feedback/ref 已解释本地 gap。 | 是（本 relation） | read; HLD 的 supersession intent 尚未获得 Step 6 callable guard。 |
| `Superseded` | successor gap 已承接局部处理。 | 是 | history/read only。 |

#### 状态转换图

```text
<known local gap basis> -- PublicationGap::open --> Open --> ResolutionPending --> Resolved
                                                    |             |
                                                    +-----------> Superseded
Resolved -- HLD intent only / no Step 6 guard --> Superseded
```

注意：`PublicationGapStatus` 没有 `Unknown`。Step 6 `supersede` 说明文字中出现 `Unknown -> Superseded`，该源状态不存在，不能进入矩阵或实现。

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Open` | `PublicationGap::open(...)` | intended `RuntimeMaterialReceptionConsumerFlow` / `PublicationRelayFlow` / `DeliveryFeedbackConsumerFlow` branch | decision match；category/safe reason valid；attempt optional only for route/contract gap and required for submission-unknown | append Open gap | current Step 9 has no closed open-gap creation/UoW path; `L2M-DDD-004` | `DomainError::InvariantViolation` |
| `Open` | `ResolutionPending` | `request_resolution(request_ref)` | `PublicationRelayFlow` | formal resolution request ref exists; request does not imply route/delivery result | append pending successor | no event/outbox/retry declaration | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Open` / `ResolutionPending` | `Resolved` | `resolve(feedback_ref, resolved_at)` | `DeliveryFeedbackConsumerFlow` | owner-validated matching feedback/ref and Clock; only local gap relation is explained | append resolved successor | matching attempt may independently link feedback; no delivery claim | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Open` / `ResolutionPending` | `Superseded` | `supersede(successor_gap)` | `PublicationRelayFlow` / `DeliveryFeedbackConsumerFlow` | new same-decision successor gap is already committed and linked | append superseded successor | history retained; no source rollback | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Resolved` | `Superseded` | HLD intent; no Step 6 source guard is documented | no callable Step 9 flow | HLD permits a new gap context, but detailed helper contract must first be repaired | **reserved / not callable**; do not call repository save as a transition | `DomainError::IllegalTransition(SafeReasonCategory)` until repair |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `<new> -> ResolutionPending/Resolved/Superseded` | factory only creates `Open`; pending/resolved/superseded require explicit relation evidence. | reject construction。 |
| `Unknown -> Superseded` | `Unknown` is not a `PublicationGapStatus` variant. | reject as contract typo; `L2M-DDD-004` remains open。 |
| `Resolved -> Open` | closure history cannot be overwritten. | new gap ID for a new unresolved relation。 |
| Query resolves/supersedes gap | Query has no reconciliation or write authority. | no write; `ApplicationError::ContractViolation`。 |
| gap resolution interpreted as publication success/unblock | local explanation is not downstream truth or retry authorization. | keep policy/idempotency checks independent。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / source-name audit | pass_with_design_blocker | four real variants retained; invalid `Unknown` prose is excluded and recorded in `L2M-DDD-004`。 |
| helper / HLD alignment | pass_with_design_gap | `Resolved -> Superseded` is HLD intent but not an executable Step 6 guard。 |
| creation / relay closure | blocked | no completed prepared/gap factory→append→selector chain。 |
| 测试切口 | planned | factory Open-only、request ref required、local-only resolve、supersession history、no Unknown variant。 |

## 13. CP05 Interaction Trace 状态矩阵

### 13.1 `InteractionGapStatus`

归属：`domain::interaction_trace::InteractionGap`。该对象保留 committed interaction chain 的 relation gap；它不修复 source fact、publication、observation、evidence 或 external owner truth。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | missing/correlation/order relation 有本地可证明 basis。 | 否 | request resolution、resolve、supersede。 |
| `Blocked` | required owner/source/seam 未闭口或不可用。 | 否 | resolve/supersede；HLD 的 pending intent currently lacks a matching Step 6 guard。 |
| `ResolutionPending` | formal resolution request 已链接。 | 否 | resolve/supersede。 |
| `Resolved` | formal/local `GapResolutionRef` 已解释此 local gap。 | 是（本 relation） | read or later explicit supersession。 |
| `Unknown` | impact/order/side effect 无法证明。 | 否（fence） | resolve/supersede; no inferred promotion。 |
| `Superseded` | successor gap 已承接后续处理。 | 是 | history/read only。 |

#### 状态转换图

```text
<committed-fact / trace relation basis>
       +--> Open ------> ResolutionPending -----> Resolved
       +--> Blocked ----> (HLD pending intent; no current helper)
       +--> Unknown ----> (HLD pending intent; no current helper)
       \______________________________________________> Superseded

Open / Blocked / ResolutionPending / Unknown --> Resolved
Open / Blocked / ResolutionPending / Resolved / Unknown --> Superseded
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Open` | `InteractionGap::open(...)` | `MemberCommittedFactConsumerFlow` / attributable CP05 continuation | missing ref/correlation/order relation is safely classified; source/correlation values are not guessed | append Open gap | trace/query/projection retain incomplete posture | `DomainError::InvariantViolation` |
| `<new>` | `Blocked` | same factory | same flow / `ObservationRelayFlow` guarded branch | required owner/source/seam is known unavailable or unbound | append Blocked gap | no source repair or handoff | `DomainError::InvariantViolation` |
| `<new>` | `Unknown` | same factory | `MemberCommittedFactConsumerFlow` / attributable unknown branch | effect/order/impact cannot be proven; safe reason and correlation retained | append Unknown gap | fence; no automatic retry or source inference | `DomainError::InvariantViolation` |
| `Open` | `ResolutionPending` | `request_resolution(request_ref)` | explicit reconciliation continuation only | formal request ref exists; no Query initiation | append pending successor | no resolver result claim | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Blocked` / `Unknown` | `ResolutionPending` | HLD intent; current `request_resolution` only documents `Open` source | no callable Step 9 flow | must add a detailed helper guard before use | **reserved / not callable** | `DomainError::IllegalTransition(SafeReasonCategory)` until repair |
| `Open` / `Blocked` / `ResolutionPending` / `Unknown` | `Resolved` | `resolve(resolution_ref, resolved_at)` | `ObservationFeedbackConsumerFlow` or formal resolution incorporation | matching subject/correlation/formal resolution; no missing source fact is fabricated | append resolved successor | local explanation only; no observed/source-success claim | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Open` / `Blocked` / `ResolutionPending` / `Resolved` / `Unknown` | `Superseded` | `supersede(successor_gap)` | append-only reconciliation continuation | matching subject/correlation successor gap already exists | append superseded successor | history retained; no trace/source rollback | `DomainError::IllegalTransition(SafeReasonCategory)` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `<new> -> ResolutionPending/Resolved/Superseded` | initial factory only permits `Open/Blocked/Unknown`. | reject construction。 |
| `Resolved -> Open/Blocked/Unknown` | closure cannot be overwritten by a new uncertainty. | create a new gap if there is new evidence。 |
| `Unknown -> Resolved` without a matching formal ref | Unknown is a fence, not missing default data. | reject; preserve safe reason。 |
| Query changes any gap state | Query does not own trace reconciliation. | no write。 |
| gap resolve creates trace/source fact | a resolution explains relation only. | use a separately committed source path。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / initial states | pass | six variants and three legal factory states agree。 |
| HLD / Step 6 pending edge | pass_with_design_gap | HLD has `Blocked/Unknown -> ResolutionPending`; Step 6 does not presently make it callable。 |
| foreign truth / no-write | pass | resolved is local explanation only。 |
| 测试切口 | planned | three factory branches、request source guard、resolution correlation、supersession history、Query no-write。 |

### 13.2 `ObservationAttemptStatus`

归属：`domain::interaction_trace::ObservationAttempt`。这是 body-free observation handoff 的 local invocation posture；不拥有 backend ingest、retention、observed、evidence、verdict 或 report truth。

#### 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | committed trace/gap 已形成 safe observation material，尚未调用 seam。 | 否 | submit、block、unknown。 |
| `Submitted` | member 已调用 observation seam。 | 否 | link formal feedback or mark unknown。 |
| `FeedbackLinked` | formal observation feedback ref 已关联。 | 是 | read / trace / projection only。 |
| `Blocked` | safety/boundary precondition 在调用前不能满足。 | 是（本 attempt） | read; a new basis is required for a new attempt。 |
| `Unknown` | side effect/submission result 无法证明。 | 是（fence） | wait for exact evidence; no blind replay。 |

#### 状态转换图

```text
<safe ObservationMaterial> -> Prepared -> Submitted -> FeedbackLinked
                              |              |
                              +-> Blocked     +-> Unknown
                              +------------------> Unknown

Unknown --X--> Submitted / FeedbackLinked
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Prepared` | `ObservationAttempt::prepare(...)` | `ObservationRelayFlow` local preparation phase | committed trace/gap input, body-free/low-cardinality material, formal boundary ref and stable idempotency key | append Prepared attempt before seam | local-first selector/report path; no backend claim | `DomainError::InvariantViolation` |
| `Prepared` | `Submitted` | `mark_submitted(submission_ref, attempted_at)` | `ObservationRelayFlow` | prepared record/version loaded; handoff invoked; typed submission ref and Clock supplied | append Submitted successor | local report/result only; no ingest/observed/evidence claim | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Prepared` | `Blocked` | `mark_blocked(safe_reason)` | `ObservationRelayFlow` guarded branch | boundary/body/cardinality/contract/fence precondition fails before call | append Blocked successor | no handoff call | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Prepared` / `Submitted` | `Unknown` | `mark_unknown(safe_reason)` | `ObservationRelayFlow` | side effect cannot be proven; original key retained | append Unknown successor | current flow incorrectly passes a second `new_gap_ref()` argument and does not append a matching `InteractionGap`; `L2M-DDD-005` blocks a complete unknown path | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Submitted` | `FeedbackLinked` | `link_feedback(feedback_ref)` | `ObservationFeedbackConsumerFlow` | formal feedback validates source/attempt/correlation and expected version | append FeedbackLinked successor | no mutation of trace/material/source fact; no observed claim | `DomainError::IllegalTransition(SafeReasonCategory)` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Prepared -> FeedbackLinked` | no proven seam invocation/submission ref。 | `IllegalTransition`。 |
| `Blocked/FeedbackLinked/Unknown -> Submitted` | terminal/fence state cannot reopen same attempt。 | separately designed new attempt only。 |
| `Unknown -> FeedbackLinked` | helper requires `Submitted`; late/default feedback cannot bypass the fence。 | retain Unknown and record formal resolution through its owner。 |
| submitted/feedback-linked -> observed/evidence/verdict | observation backend owns those truths. | no member transition or event claims。 |
| unknown branch invents an InteractionGap ref | current attempt has no `gap_ref` field and the helper has one argument. | block implementation under `L2M-DDD-005`。 |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / helper | pass | five variants and named helper set are consistent。 |
| unknown path | blocked | Step 9 arity mismatch and no persisted matching InteractionGap (`L2M-DDD-005`)。 |
| backend/evidence separation | pass | no state denotes ingest, observed, evidence or verdict。 |
| 测试切口 | planned | local-first prepare、legal edge table、unknown no replay、feedback correlation、no backend access。 |

## 14. CP06 External Context Mirror 状态矩阵

CP06 只保存 member-side 的 body-free snapshot、purpose/scope-specific neutral resolution 和 local gap。它不保存或迁移 Work / Identity、Governance、Runtime、Tools / Method、host / route、Bus 或外部 owner truth。`ExternalContextSnapshot` 是 immutable point-in-time support fact，`MirrorResolutionPolicy` 是 pure guard，均不另建可变状态机。

### 14.1 `ExternalContextResolutionStatus`

归属：`domain::external_context_mirror::ExternalContextResolution`。这不是一个会原地改变状态的 record；每次 source evidence、scope 或 purpose 的再评价都必须产生新的 immutable resolution。下表中“old → new”仅表示 application 对旧记录建立后继关系，绝不表示对旧记录写回。

#### 状态集合

| 状态 | 作用 | 是否终态（单条 record） | 可作为 positive policy 输入 |
|---|---|---|---|
| `Resolved` | matching owner-safe snapshot、purpose、scope 与 freshness 已足以形成中性充分性结论。 | 是 | 是，但只代表 neutral source sufficiency。 |
| `Stale` | 已知 snapshot / evidence 落后于所需 freshness。 | 是 | 否。 |
| `Conflict` | owner、version、scope 或多份 source evidence 不能安全归并。 | 是 | 否。 |
| `Unresolved` | source、mapping、snapshot 或 formal evidence 还不足。 | 是 | 否。 |
| `Unavailable` | named formal owner seam 当前不可用。 | 是 | 否。 |
| `Unknown` | completeness、integrity 或 resolution-side condition 不能证明。 | 是（fence） | 否。 |

#### 状态转换图

```text
<new purpose + scope evaluation>
       |
       +--> Resolved
       +--> Stale
       +--> Conflict
       +--> Unresolved
       +--> Unavailable
       +--> Unknown

<any prior immutable resolution + new formal evidence>
       |
       +--> <new record in one status above>

old record --X--> any in-place status mutation
Unknown --X--> Resolved by time / Query / retry / last-known snapshot
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Resolved` | `ExternalContextResolution::resolve(...)` | `ResolveExternalContextFlow`；五条 owner-specific source-update Consumer；`ExternalContextRefreshFlow` | matching owner-specific source；`snapshot.is_body_free()`；exact subject/purpose/scope；freshness proof；`MirrorResolutionPolicy` 选择 Resolved | append immutable resolution；不改任何旧 resolution | optional matching snapshot 已先 append；consumer may evaluate later local policy; no authorization / health / delivery claim | `DomainError::InvariantViolation`；application mapping failure 为 `ApplicationError::ContractViolation` |
| `<new>` | `Stale` | same factory | same flows | selected snapshot exists but policy proves freshness insufficient | append immutable stale resolution | append applicable local gap / projected stale posture only; no source refresh claim | same |
| `<new>` | `Conflict` | same factory | same flows | owner/version/scope/evidence conflict is explicit and cannot be selected safely | append immutable conflict resolution | append applicable local gap; no winner selection or cross-purpose reuse | same |
| `<new>` | `Unresolved` | same factory | same flows | required source, mapping or matching snapshot is absent | append immutable unresolved resolution | append applicable gap / blocked command or consumer outcome | same |
| `<new>` | `Unavailable` | same factory | `ResolveExternalContextFlow` / `ExternalContextRefreshFlow` / affected source-update Consumer | named owner-specific resolver is unavailable and no safe result exists | append immutable unavailable resolution | append applicable gap; do not infer owner health or source deletion | same |
| `<new>` | `Unknown` | same factory | same flows | source completeness, integrity, ordering or side effect cannot be proven | append immutable unknown fence | append applicable gap; forbid positive continuation and blind retry | same |
| any old status | one **new** status record | `ExternalContextResolution::resolve(...)` on new evaluation; never a method on old record | `ResolveExternalContextFlow` / source-update Consumer / refresh Job | new formal evidence; same consumer purpose and exact required scope for any intended replacement relation | append new resolution ID; old record remains readable history | affected future policy / projection may observe new ref; prior CP01~05 facts are not rewritten | `DomainError::InvariantViolation` / `ApplicationError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| any status -> another status on the same `resolution_id` | resolution is immutable support truth. | reject mutation; append a new evaluation record only. |
| `Resolved` reused for another purpose or wider/narrower scope | purpose and scope are part of the proof, not optional labels. | `usable_for(...) == false`; fail closed and create a separately evaluated record if warranted. |
| `Stale` / `Conflict` / `Unresolved` / `Unavailable` / `Unknown -> Resolved` by Query, time, retry or default | none is new owner evidence. | preserve fail-closed status; Query is no-write. |
| `Resolved -> authorization / approval / host healthy / Runtime accepted / capability invocable` | CP06 only owns neutral source sufficiency. | do not emit a member transition or positive foreign claim. |
| source update overwrites an already committed CP01~05 decision, attempt, material or trace | support truth has one-way future-policy influence only. | reject cross-owner write; use original CP owner flow. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / immutable factory | pass | six variants all arise only through `resolve(...)`; no in-place successor helper exists or is needed. |
| purpose / scope isolation | pass | `usable_for` and factory inputs require exact purpose/scope; positive result remains neutral. |
| owner-specific source boundary | pass_with_upstream_blockers | named source resolver paths depend on `L2M-UP-001/003/004/006/007`; generic resolver remains forbidden. |
| Query / foreign truth boundary | pass | Query cannot create resolution; resolution never grants external business truth. |
| 测试切口 | planned | six policy outcomes、cross-purpose rejection、immutable new ID、body gate、unavailable/unknown fence、no-write Query。 |

### 14.2 `ExternalContextGapStatus`

归属：`domain::external_context_mirror::ExternalContextGap`。gap 是 append-only local consumer-insufficiency relation；它既不是 source owner repair record，也不是 downstream / Runtime / host result。每个合法 transition 返回 successor gap，旧 gap 及其 reason、scope 和 relation history 均保留。

#### 状态集合

| 状态 | 作用 | 是否终态（本 revision） | 关键约束 |
|---|---|---|---|
| `Open` | 已知 source missing、stale、conflict 或 mapping insufficiency，尚无 refresh relation。 | 否 | factory initial state。 |
| `Blocked` | exact contract / owner seam 禁止 positive resolution。 | 否 | factory initial state；不是外部 owner 的负面 truth。 |
| `ResolutionPending` | formal refresh request 已被 local boundary 接受。 | 否 | must carry `refresh_request_ref`。 |
| `Resolved` | matching new neutral resolution 已被关联，local gap relation 已闭合。 | 否（可被 supersede） | must carry matching `resolution_ref` and `resolved_at`。 |
| `Unknown` | source / refresh side effect 或 completeness cannot be proven。 | 否（fence） | factory initial state；cannot silently retry. |
| `Superseded` | new same-purpose/scope gap takes responsibility。 | 是 | must carry `successor_gap_ref`。 |

#### 状态转换图

```text
<new proven insufficiency> --> Open / Blocked / Unknown
          |                         |       |
          |                         +-------+--> ResolutionPending
          |                                     (only Open / Blocked callable now)
          +--> Resolved  <--------------------- matching neutral resolution
          |      ^
          |      | (Open / Blocked / ResolutionPending / Unknown)
          +------> Superseded <---------------- any non-superseded revision

Unknown -- -reserved-> ResolutionPending  [HLD intent; no Step 6 helper]
Superseded --X--> Open / Blocked / Pending / Resolved / Unknown
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Open` | `ExternalContextGap::open(...)` | `ResolveExternalContextFlow`；five source-update Consumer；`ExternalContextRefreshFlow` | known local insufficiency; typed source ref if known; exact purpose/scope; category/reason; initial status is permitted | append Open gap | affected path remains explicit blocked/pending posture; no external repair claim | `DomainError::InvariantViolation` |
| `<new>` | `Blocked` | same factory | same flows; blocked seam mapping | exact contract, owner seam or source boundary prevents positive path | append Blocked gap | preserve named blocker / safe reason; no generic adapter fallback | same |
| `<new>` | `Unknown` | same factory | same flows | source/refresher integrity or effect cannot be proven | append Unknown gap | fence positive continuation; no default source or blind replay | same |
| `Open` / `Blocked` | `ResolutionPending` | `ExternalContextGap::request_refresh(refresh_request_ref)` | `RequestExternalContextRefreshFlow` | matching existing gap; formal request ref returned; exact purpose/scope relation retained | append successor with request ref | command only registers refresh; it does not synchronously resolve source | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Unknown` | `ResolutionPending` | **reserved; no callable Step 6 helper** | HLD desired refresh branch | HLD allows an explicit request relation, but Step 6 helper admits only Open / Blocked | no legal successor can be constructed at current detail level | `L2M-DDD-006`; do not bypass factory or write field directly | `ApplicationError::ContractViolation` |
| `Open` / `Blocked` / `ResolutionPending` / `Unknown` | `Resolved` | `ExternalContextGap::resolve(resolution_ref, resolved_at)` | `ExternalContextRefreshFlow` / owner-specific source-update continuation | application proves new committed resolution has the same consumer purpose and required scope | append resolved successor with resolution ref/time | closes only local gap relation; affected consumer still evaluates resolution/policy independently | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Open` / `Blocked` / `ResolutionPending` / `Resolved` / `Unknown` | `Superseded` | `ExternalContextGap::supersede(successor_gap_ref)` | resolve / refresh / source-update relation selection | successor gap is committed and application proves same purpose/scope | append superseded successor preserving history | no deletion or overwrite of snapshots/resolutions/gaps | `DomainError::IllegalTransition(SafeReasonCategory)` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `<new> -> ResolutionPending` | factory only admits `Open` / `Blocked` / `Unknown`; a request ref is mandatory for pending. | reject; current Step 9 no-gap branch is `L2M-DDD-006`. |
| `Unknown -> ResolutionPending` by direct field write | HLD intent is not a callable Step 6 transition. | keep unknown fence and record `L2M-DDD-006`; no implementation shortcut. |
| any status -> `Resolved` without matching purpose/scope resolution | local gap cannot be closed by unrelated source evidence. | reject relation; retain current gap or append a separately scoped gap. |
| `Superseded -> any active state` | successor owns follow-up; history must remain append-only. | create a new gap only from new insufficiency, never reopen this revision. |
| `Resolved` means source repair, authorization, health or consumer action success | local relation closure does not own foreign/source/consumer truth. | no automatic positive CP01~07 transition. |
| Query creates / refreshes / resolves / supersedes a gap | Query has no mirror write authority. | return read surface only. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| initial / successor closure | pass_with_design_gap | Open/Blocked/Unknown factory and normal successor methods are aligned; no-gap `ResolutionPending` path is not. |
| HLD ↔ Step 6 refresh edge | blocked | HLD includes `Unknown -> ResolutionPending`, while `request_refresh` only accepts Open/Blocked; retain as reserved (`L2M-DDD-006`). |
| source / foreign truth separation | pass | resolved is a local relation only; no owner repair or authorization claim. |
| Query no-write | pass | all gap state changes are Command/Consumer/Job-only. |
| 测试切口 | planned | three factory states、request ref invariant、same-purpose resolve、supersession history、unknown no-default、illegal no-gap pending、Query no-write。 |

## 15. CP07 Member Read Model 状态矩阵

CP07 的唯一可变 domain state subject 是一个 `ProjectMemberRef + MemberProjectionKind` 下的 `MemberProjectionState`。`MemberSummaryView`、`MemberDiagnosticView` 与 `CapabilityOutletView` 是 immutable revisions；`CapabilityOutletStatus` 是 outlet revision 的分类，不能被误写成独立 registry / authorization / invocation state machine。

### 15.1 `MemberProjectionStatus`

归属：`domain::member_read_model::MemberProjectionState`。每次迁移形成 state successor；一个 projection kind 的 `Current` 不证明任何另一个 kind、host、Runtime、Tools、Conversation 或 external source 的 currentness。

#### 状态集合

| 状态 | 作用 | Query 可服务面 | 当前 Step 6 helper 覆盖 |
|---|---|---|---|
| `Current` | same-kind required committed sources/resolutions 覆盖 target watermark。 | can serve only under visibility and consistency policy。 | initialize / complete rebuild。 |
| `Stale` | known target watermark has advanced beyond applied state or prior surface is no longer current。 | explicit stale surface only when hint allows。 | `mark_stale`。 |
| `Rebuilding` | committed-source-only rebuild is underway; old view cannot claim current。 | not-ready / rebuilding posture。 | `start_rebuild`。 |
| `Degraded` | policy permits a constrained, body-free surface with explicit gap/reason。 | degraded surface only。 | enum exists; no transition helper. |
| `Failed` | latest local rebuild / state-store continuation failed to prove a successor。 | not-ready / failed posture。 | `mark_failed` from Rebuilding only in this matrix。 |
| `Disabled` | optional kind is explicitly not activated / pruned。 | explicit disabled/not-available surface。 | initialize only; no activate/deactivate helper. |
| `Unknown` | source coverage, watermark or rebuild side effect cannot be proven。 | no current claim。 | enum exists; no transition helper. |

#### 状态转换图

```text
<new explicit activation> --> Current / Disabled

Current / Degraded / Failed / Unknown --mark_stale--> Stale
Current / Stale / Degraded / Failed / Unknown --start_rebuild--> Rebuilding
Rebuilding --complete_rebuild--> Current
Rebuilding --mark_failed--> Failed

HLD intent retained as reserved (no Step 6 helper):
  {Stale, Rebuilding, Degraded} -> Degraded
  {Stale, Rebuilding, Degraded, Failed} -> Unknown
  active states -> Disabled; Disabled -> Rebuilding after explicit activation

Query --X--> any transition
Current --X--> Current merely because time, retry, default or last-known view changed
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Current` | `MemberProjectionState::initialize(...)` | runtime projection bootstrap / validated assembly only | required projection activated; initial watermark and committed-source coverage are provable; required kind is not optional-disabled | append initial Current state | no view is guessed from empty / last-known data; later view revision remains a separate immutable object | `DomainError::InvariantViolation` |
| `<new>` | `Disabled` | `MemberProjectionState::initialize(...)` | runtime projection bootstrap / validated optional activation | projection kind is optional and explicit activation says disabled | append initial Disabled state | no CP01~06 source or optional-view deletion claim | `DomainError::InvariantViolation` |
| `Current` / `Degraded` / `Failed` / `Unknown` | `Stale` | `mark_stale(target_watermark, safe_reason)` | `MemberProjectionUpdateConsumerFlow`; `CapabilityOutletSourceUpdateConsumerFlow`; `GapReconciliationFlow` | committed source/gap/resolution proves target advancement; safe reason supplied | append stale successor with target watermark | Consumer does not rebuild view or mutate source facts; save uses loaded `Versioned<MemberProjectionState>.version` | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Current` / `Stale` / `Degraded` / `Failed` / `Unknown` | `Rebuilding` | `start_rebuild(target_watermark, safe_reason)` | `MemberProjectionRebuildFlow` | active non-disabled state; target watermark and committed-source read basis are validated | append rebuilding successor | old view remains stale/not-ready; no source repair; successor save must receive store version from `Versioned` wrapper | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Rebuilding` | `Current` | `complete_rebuild(applied_watermark, updated_at)` | `MemberProjectionRebuildFlow` | required coverage/body-free policy/scope hold; applied watermark covers target; `rebuildable`; no blocking gap; new immutable view revision is appendable | append current successor | append appropriate view revision first/atomically; never claim another kind Current | `DomainError::IllegalTransition(SafeReasonCategory)` |
| `Rebuilding` | `Failed` | `mark_failed(safe_reason, updated_at)` | `MemberProjectionRebuildFlow` failure branch | a local rebuild or state-store continuation cannot prove a committed successor | append failed successor | no automatic retry, source mutation or external-failure conclusion | `DomainError::IllegalTransition(SafeReasonCategory)` |
| HLD source states | `Degraded` | **reserved; no Step 6 helper** | rebuild / reconciliation desired posture | HLD permits constrained body-free surface, but no member function currently constructs this successor | no callable transition in current detailed design | `L2M-DDD-007`; do not set `status` directly | `ApplicationError::ContractViolation` |
| HLD source states | `Unknown` | **reserved; no Step 6 helper** | consumer / job desired fence | HLD calls for unknown on unprovable source/side effect, but no transition helper exists | no callable transition in current detailed design | `L2M-DDD-007`; preserve existing safe state instead of inventing Unknown successor | `ApplicationError::ContractViolation` |
| active state / `Disabled` | `Disabled` / `Rebuilding` | **reserved; no Step 6 activation helper** | optional deactivation / reactivation intent | HLD has explicit activation basis requirement, but Step 6 exposes initialize only | no callable successor | `L2M-DDD-007`; no Query/config direct state write | `ApplicationError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Stale` / `Failed` / `Unknown` / `Degraded` / `Disabled -> Current` outside `complete_rebuild` | current requires new same-kind coverage proof and a rebuilding successor. | reject; run only a future closed rebuild path. |
| Query -> stale/rebuild/current/degraded/disabled/unknown | reads do not own projection maintenance. | no write; map `can_serve(...)` to an explicit read posture. |
| `MemberProjectionUpdateConsumer` directly creates a view or invokes rebuild | Consumer only marks source advancement. | reject cross-flow responsibility; use the Job boundary. |
| state save uses `successor.store_version()` | the domain successor has no storage version; optimistic version belongs to loaded `Versioned<MemberProjectionState>`. | block Step 9 fragment under `L2M-DDD-007`; correct only in a later authorized design revision. |
| outlet `Available` / `Current` grants tool invocation, provider route, approval or execution | CP07 exposes a body-free projection only. | return non-authorizing outlet surface; no foreign call. |
| reconciliation resolves CP04/05/06 gaps | read model has no source-gap ownership. | only create projection successor / diagnostic posture. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| existing helper coverage | pass_with_design_gap | initialize、mark_stale、start_rebuild、complete_rebuild and conservative rebuilding->failed edge have exact matrices. |
| HLD desired posture coverage | blocked | Degraded/Unknown/disable/activate edges lack same-layer helpers; all remain reserved as `L2M-DDD-007`. |
| immutable view / source owner separation | pass | views are append-only revisions; projection state cannot repair CP01~06 or foreign truth. |
| version / Query audit | blocked_for_flow_fix | Step 9 calls nonexistent `store_version()`; Query remains explicitly no-write (`L2M-DDD-007`). |
| 测试切口 | planned | per-kind initial coverage、target watermark stale、rebuild coverage/current, rebuilding failure、no cross-kind current、reserved-edge refusal、Query no-write。 |

## 16. application / infra 技术状态矩阵

本节的状态只描述 member-local technical reservation、assembly 或 fail-closed seam posture。它们不替代 CP01~CP07 domain truth，不把一次 logical boundary result 写成 external execution、delivery、health、authorization、container lifecycle 或 evidence。

### 16.1 `MemberIdempotencyState`

归属：`application::idempotency::MemberIdempotencyRecord`。它只保护一个非 Query 的 canonical operation/key/digest 三元组；状态机不表达 command、Consumer 或 Job 的业务完成，更不表达任何 foreign effect。

#### 状态集合

| 状态 | 作用 | 是否终态 | 关键约束 |
|---|---|---|---|
| `Reserved` | matching non-Query operation has claimed a key and has no stored public result yet。 | 否 | result ref must be absent。 |
| `Completed` | matching typed stored result has been saved and can be replayed。 | 是 | result ref must be present and match operation. |
| `Conflict` | same key was seen with a different channel, operation or canonical digest。 | 是 | result ref absent; safe conflict reason required. |

#### 状态转换图

```text
<validated Command / Consumer / OperationsJob context>
                       |
                    reserve
                       v
                  Reserved
                  /      \
          complete        mark_conflict
                v              v
            Completed       Conflict

Query --X--> Reserved
Completed / Conflict --X--> Reserved on same record
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Reserved` | `MemberIdempotencyRecord::reserve(record_id, context, digest)` | all 10 Command、14 Consumer、5 Job fresh paths | validated non-Query `MemberOperationContext`; canonical digest; generated record ID; key is not already a matching completed record | append/reserve technical record | reservation occurs before member-local write path; it proves neither domain success nor external effect | `ApplicationError::ContractViolation` |
| `Reserved` | `Completed` | `complete(result_ref)` | successful fresh Command / Consumer / Job completion | matching typed stored result/public report was saved atomically with local outcome; result operation/kind matches | append completed successor | duplicate path may replay stored surface only; never rerun domain/Consumer/Job work | `ApplicationError::ContractViolation` |
| `Reserved` | `Conflict` | `mark_conflict(safe_reason)` | idempotency reserve / comparison conflict branch in any write flow | same key maps to a different channel, operation name or canonical request digest | append conflict successor | return conservative conflict/rejection surface; do not reveal body or rerun | `ApplicationError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Query -> Reserved` or Query reads reservation as a replay mechanism | Query is explicitly no-write and has no idempotency key. | reject context construction; do not reserve, complete or conflict a record. |
| `Reserved -> Completed` without matching stored result | result pointer is the replay proof. | reject; do not synthesize a result from current facts. |
| `Completed -> Reserved/Conflict`, `Conflict -> Reserved/Completed` on same record | completed/conflict closes this key-record revision. | preserve record/history; a new operation relation must be independently resolved. |
| duplicate is rerun after `Completed` | replay must consume the saved typed result. | return stored result or `Stored*Unavailable`; no transition. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| non-Query reservation closure | pass | reserve/complete/conflict map to the exact Step 6 methods. |
| Query separation | pass | no Query factory or transition exists. |
| typed replay boundary | pass_with_future_port_work | Step 7/13 still own concrete get/save/missing/concurrency mechanics; this matrix does not invent them. |
| 测试切口 | planned | command/consumer/job reserve、matching completion、mismatch conflict、duplicate no rerun、Query no-write、stored-result missing。 |

### 16.2 `MemberAdapterAvailabilityState`

归属：`infra::availability::MemberAdapterAvailability`。它是 one infra slot 的 redacted injectability marker，不是 adapter reachability、host health、Runtime acceptance、source owner availability或业务 capability truth。

#### 状态集合

| 状态 | 作用 | 是否可注入 | 关键约束 |
|---|---|---|---|
| `Enabled` | validated adapter can be injected into the member runtime。 | 是 | not proof that a foreign seam succeeds. |
| `DisabledByConfig` | validated configuration intentionally omits the slot。 | 否 | not a source/owner negative result. |
| `Degraded` | slot can be injected only with explicit constrained surface。 | 是 | redacted issue required. |
| `Unavailable` | slot cannot currently be used safely。 | 否 | redacted issue required; no positive fallback. |

#### 状态转换图

```text
<validated assembly plan> --> Enabled / DisabledByConfig
Enabled --mark_degraded--> Degraded --mark_unavailable--> Unavailable
Enabled -------------------------------mark_unavailable--> Unavailable

Degraded / Unavailable --X--> Enabled  [no recovery helper]
DisabledByConfig --X--> Enabled by state write  [requires a new validated assembly]
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Enabled` | `MemberAdapterAvailability::enabled(slot, config_ref)` | infra builder assembly; no CP business flow | validated adapter config/reference and named slot | create enabled marker | may be recorded by runtime builder; does not invoke adapter | `InfraError::InvalidConfiguration` / `InfraError::ContractViolation` |
| `<new>` | `DisabledByConfig` | `disabled_by_config(slot, config_ref, issue_ref)` | infra builder assembly | explicit validated optional omission | create disabled marker | builder must expose disabled posture; no source truth mutation | same |
| `Enabled` | `Degraded` | `mark_degraded(issue_ref)` | safe adapter/assembly outcome mapping | redacted issue identifies constrained local slot | create degraded successor marker | callers must surface degradation; no foreign call or retry policy is implied | `InfraError::ContractViolation` |
| `Enabled` / `Degraded` | `Unavailable` | `mark_unavailable(issue_ref)` | safe adapter/assembly outcome mapping | redacted issue proves slot cannot be safely used | create unavailable successor marker | blocks positive slot use; no default/fake implementation may replace it | `InfraError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Degraded` / `Unavailable -> Enabled` by timeout, probe success, retry or Query | Step 6 offers no recovery helper or validated reassembly transition. | retain conservative marker; a later authorized assembly design must introduce a new validated carrier. |
| `DisabledByConfig -> Enabled` by direct state field write | configuration intent cannot be bypassed by adapter code. | build a fresh validated assembly only. |
| `Enabled` means host/Runtime/Bus/downstream healthy or source current | availability is local injectability only. | do not create a domain/external positive transition. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| factory / degradation edges | pass | exact factories and degrade/unavailable helpers are represented. |
| recovery semantics | deliberately deferred | no recovery helper exists; matrix does not infer one. |
| foreign-truth boundary | pass | no availability state answers seam success or owner health. |
| 测试切口 | planned | enabled/disabled factory validation、degraded issue requirement、unavailable no fallback、forbidden recovery、no adapter invocation。 |

### 16.3 `MemberRuntimeBuildState`

归属：`infra::runtime_builder::MemberRuntimeBuilderState`。它只表示 local facade composition progress；`Ready` 的唯一含义是 member-local application facade can be exposed. It does not mean container started, image released, host lifecycle accepted, IPC bound, Runtime loop ready or external adapter successful.

#### 状态集合

| 状态 | 作用 | 是否可暴露 facade | 关键约束 |
|---|---|---|---|
| `NotStarted` | validated config is selected but validation has not begun。 | 否 | initial factory state. |
| `ValidatingConfig` | required config refs/slots are being checked。 | 否 | no half runtime. |
| `Assembling` | services, Stores and adapters are being composed。 | 否 | adapter marker collection may evolve. |
| `Ready` | a usable local application facade was assembled。 | 是 | no foreign lifecycle implication. |
| `Failed` | non-ready assembly did not safely expose facade。 | 否 | no half runtime exposure. |

#### 状态转换图

```text
<validated config> -> NotStarted -> ValidatingConfig -> Assembling -> Ready
                           |               |               |
                           +---------------+---------------> Failed

Assembling --record_adapter--> Assembling  (same business state, new marker successor)
Ready --X--> Failed / NotStarted  [no helper]
Failed --X--> ValidatingConfig / Assembling  [fresh build required]
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `NotStarted` | `MemberRuntimeBuilderState::for_config(config_ref)` | infra composition bootstrap; no CP business flow | config ref already validated | create builder state | no entry/facade is exposed | `InfraError::InvalidConfiguration` |
| `NotStarted` | `ValidatingConfig` | `start_validation()` | infra composition bootstrap | exact initial state | create validation successor | validate refs/mandatory slots only; no domain or adapter invocation | `InfraError::ContractViolation` |
| `ValidatingConfig` | `Assembling` | `start_assembly()` | infra composition bootstrap | required validation succeeds; blocking mandatory slots are not unavailable | create assembling successor | begin local composition; no container/lifecycle claim | `InfraError::ContractViolation` |
| `Assembling` | `Assembling` | `record_adapter(availability)` | infra composition bootstrap | slot is unique and marker is valid | create same-state successor with updated ordered marker set | does not instantiate external truth or call adapter | `InfraError::ContractViolation` |
| `Assembling` | `Ready` | `mark_ready()` | infra composition bootstrap | facade is complete; mandatory blocked seam cannot appear enabled | create ready successor | permits local facade exposure only | `InfraError::ContractViolation` |
| `NotStarted` / `ValidatingConfig` / `Assembling` | `Failed` | `mark_failed(issue_ref)` | infra composition failure branch | redacted issue; state is non-ready | create failed successor | reject api/worker/jobs positive entry exposure | `InfraError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Ready -> Failed` through this state machine | `mark_failed` is explicitly non-ready only; runtime teardown/lifecycle is out of scope. | reject; do not invent process lifecycle. |
| `Failed -> ValidatingConfig/Assembling/Ready` | no restart helper or state reset is defined. | create a separately validated fresh builder only when later authorized. |
| API/worker/jobs accepts a positive invocation before Ready | no half runtime may expose facade. | entry must return blocked/not-ready surface. |
| Ready means member-service/container/image/sandbox readiness | those truths belong outside this repository. | do not propagate this state across that boundary. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| ordered assembly helpers | pass | all five concrete states and `record_adapter` same-state successor are covered. |
| restart / teardown | deliberately deferred | no helper exists; container/host lifecycle remains out of scope. |
| facade meaning | pass | Ready is local assembly only. |
| 测试切口 | planned | config validation order、mandatory slot gate、adapter uniqueness、ready exposure、non-ready failure、forbidden restart/lifecycle claim。 |

### 16.4 `BlockedSeamDisposition`

归属：`infra::blocked_seams::BlockedSeamState`。这是 project ledger blocker 的 fail-closed marker。四个 variant 都阻断 positive path；它不是“等待后自动成功”的 workflow，也没有 Ready/Resolved/Succeeded variant。

#### 状态集合

| 状态 | 作用 | 是否阻断 positive path | 关键约束 |
|---|---|---|---|
| `Pending` | a needed formal contract is expected but no positive binding exists。 | 是 | no default adapter. |
| `Blocked` | contract is absent/inconsistent and positive execution is prohibited。 | 是 | safe reason is mandatory. |
| `Waiting` | a formally requested external resolution remains outstanding。 | 是 | does not itself dispatch/request. |
| `Unknown` | side effect or source condition cannot be proven safely。 | 是 | unknown fence; no blind replay. |

#### 状态转换图

```text
<named ledger blocker + safe evidence>
       |
       +--> Pending / Blocked / Waiting / Unknown

all four --X--> Ready / Submitted / Accepted / Delivered / Resolved
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Pending` | `BlockedSeamState::from_blocker(...)` | any blocked adapter / composition mapping | named `MemberProjectBlockerId`, matching seam family, safe reason; no positive contract | create fail-closed marker | surface pending only; no adapter invocation | `InfraError::ContractViolation` |
| `<new>` | `Blocked` | same factory | blocked adapter / command/consumer/job conservative path | known absent/inconsistent required seam | create fail-closed marker | no fallback, route, IPC, outbox or fake success | same |
| `<new>` | `Waiting` | same factory | source/refresh relation mapping | formal external resolution relation is known but not complete | create fail-closed marker | remains non-positive; does not start request/dispatch itself | same |
| `<new>` | `Unknown` | same factory | uncertain source/side-effect mapping | proof cannot establish safe external or local seam result | create unknown fence marker | forbids blind replay or optimistic status | same |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| any disposition -> positive lifecycle status | the enum intentionally has no positive state. | block operation until authoritative contract/evidence is separately closed. |
| `Waiting` starts refresh / dispatch implicitly | marker describes a posture, not an operation. | use the owning Command/Job only after its contract is closed. |
| blocker is hidden by generic adapter, fake, config default or last-known result | that would erase named ledger evidence. | preserve blocker ID/reason and fail closed. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| fail-closed vocabulary | pass | all variants are factory-selected and block positive path. |
| ledger / sibling boundary | pass_with_upstream_blockers | `L2M-UP-001~008` remain open; marker does not replace sibling/Core contracts. |
| false-positive prevention | pass | no success transition exists. |
| 测试切口 | planned | each blocker family/disposition、missing safe ref、waiting no dispatch、unknown no replay、fake/default refusal。 |

## 17. api / worker / jobs 边界状态矩阵

本节七个 state/disposition 是 logical entry、result 或 registry assembly carrier。它们由 named factory/registration selection 一次性构造，不是 durable domain workflow；它们绝不声称 transport route、broker acknowledgement、listener、scheduler、process、container、external side effect、artifact、evidence、verdict、signoff 或 readiness。

### 17.1 `MemberApiHandlerDisposition`

归属：`api::result::MemberApiHandlerResult`。一个 handler result 是 transport-neutral terminal shell；它不再迁移。Command 与 Query 的 state space 必须保持分离，Query 不能借 `CommandAccepted` 形成写路径。

#### 状态集合

| 状态 | entry kind | 作用 | 必须/禁止关联 |
|---|---|---|---|
| `CommandAccepted` | Command | fresh command produced a stored member-local result surface。 | matching `application_result_ref` required. |
| `DuplicateReplayed` | Command | matching stored command result is replayed without rerun。 | matching `application_result_ref` required. |
| `QueryServed` | Query | visible current or explicitly stale-allowed body-free surface is selected。 | visible + Current/Stale serve posture; no result ref. |
| `QueryDegraded` | Query | visible/restricted constrained body-free read surface is selected。 | Degraded serve posture; no result ref. |
| `QueryNotReady` | Query | consistency requirement cannot be fulfilled。 | NotReady serve posture; no result ref. |
| `QueryNotVisible` | Query | visibility policy does not allow the requested surface。 | Denied/Unknown visibility + NotVisible posture; no result ref. |
| `Rejected` | Command or Query | boundary rejected input before application execution。 | non-empty safe issues; no result/read posture. |

#### 状态转换图

```text
validated Command -> CommandAccepted / DuplicateReplayed
                     \-> Rejected

validated Query ----> QueryServed / QueryDegraded / QueryNotReady / QueryNotVisible
                     \-> Rejected

all result shells are terminal; Query --X--> CommandAccepted / DuplicateReplayed
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `CommandAccepted` | `MemberApiHandlerResult::command_accepted(entry, result_ref)` | any of 10 Command API entry paths | validated Command entry; matching typed stored result has already been saved | construct terminal result shell | response mapper may read the member-local result surface; no host/Runtime/downstream claim | `ApiError::ContractViolation` |
| `<new>` | `DuplicateReplayed` | `duplicate_replayed(entry, result_ref)` | Command duplicate path | validated Command entry; matching stored command result found | construct terminal replay shell | no application/domain/adapter rerun | `ApiError::ContractViolation` |
| `<new>` | `QueryServed` | `query_surface(entry, decision)` | any of 16 Query flows | Query entry validated; policy decision is Visible and Current/Stale serve posture | construct terminal read shell | no reserve, refresh, rebuild or state write | `ApiError::ContractViolation` |
| `<new>` | `QueryDegraded` | same factory | Query flows | Query entry validated; decision supplies allowed Visible/Restricted + Degraded posture | construct terminal constrained read shell | no repair / capability invocation / source claim | same |
| `<new>` | `QueryNotReady` | same factory | Query flows | explicit consistency hint is unsatisfied and decision maps to NotReady | construct terminal not-ready shell | no implicit rebuild or stale concealment | same |
| `<new>` | `QueryNotVisible` | same factory | Query flows | decision maps visibility Denied/Unknown to NotVisible | construct terminal non-visible shell | body-free view is not leaked; no authorization assertion | same |
| `<new>` | `Rejected` | `rejected(entry_kind, entry_ref, operation_name, issue_refs)` | API command/query pre-application validation | metadata, trace, key/no-write marker or entry mapping invalid; ordered non-empty safe issues | construct terminal rejection shell | do not construct application context or write local truth | `ApiError::InvalidEntry` / `ApiError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| any built result -> another disposition | result is a terminal assembly carrier, not a workflow record. | construct a new result only for a new logical entry. |
| Query -> `CommandAccepted` / `DuplicateReplayed` | Query has no write key or stored result route. | reject entry/result compatibility. |
| Command -> any Query disposition | Command has no visibility/serve posture. | reject entry/result compatibility. |
| `QueryServed` hides stale/degraded/not-visible state | explicit decision posture is mandatory. | use exact Query disposition; no generic success. |
| `CommandAccepted` means foreign accepted/delivered/observed | stored result is member-local only. | no external success assertion. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Command/Query exclusivity | pass | seven variants map to exact factories and field pairing. |
| Query no-write | pass | every Query disposition is terminal read assembly only. |
| transport/external separation | pass_with_upstream_blockers | no HTTP/RPC/UDS or member event carrier is defined; `L2M-UP-001/005` remain open. |
| 测试切口 | planned | all seven factory branches、result/read field pairing、duplicate no rerun、not-visible no body leak、Query no-write。 |

### 17.2 `MemberConsumerEntryState`

归属：`worker::entry::MemberInboundConsumerEntry`。这是 one external or committed-fact item 的 pre-dispatch boundary posture。它只决定能否构造 application context；entry 本身不表明 message received/acked、route subscribed、worker running 或 source owner current。

#### 状态集合

| 状态 | 作用 | 可进入 application | 关键约束 |
|---|---|---|---|
| `ReadyForDispatch` | all owner-specific metadata, source/kind, schema, dedup, trace and body gate checks pass。 | 是 | issues empty. |
| `Blocked` | required source/owner/local seam cannot prove positive path。 | 否 | issues non-empty. |
| `Rejected` | input metadata/mapping is invalid before dispatch。 | 否 | issues non-empty. |
| `UnsupportedSchema` | declared finite Consumer cannot accept schema version。 | 否 | issues non-empty. |
| `Quarantined` | forbidden body posture was isolated at boundary。 | 否 | issues non-empty; never dispatch. |

#### 状态转换图

```text
external envelope / committed fact
        |
        +--> ReadyForDispatch --> application context
        +--> Blocked / Rejected / UnsupportedSchema / Quarantined

non-ready entry --X--> ReadyForDispatch by mutation
Quarantined --X--> payload inspection / application dispatch
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `ReadyForDispatch` | `MemberInboundConsumerEntry::from_external_envelope(...)` / `from_committed_fact(...)` | 14 Consumer entry paths | registered finite kind; matching external/committed source; supported schema; dedup/trace; allowed body posture; no issues | construct ready entry | `to_operation_context` may be called; no payload persistence or delivery claim | `WorkerError::ContractViolation` |
| `<new>` | `Blocked` | same factories | Consumer source/seam conservative branch | required owner/source/local precondition cannot form a positive path | construct blocked entry | worker must return blocked result; no application context | `WorkerError::InvalidEntry` / `WorkerError::ContractViolation` |
| `<new>` | `Rejected` | same factories | Consumer metadata validation branch | kind/source/trace/dedup/entry mapping invalid | construct rejected entry | pre-application refusal only | same |
| `<new>` | `UnsupportedSchema` | same factories | Consumer schema gate | declared finite Consumer lacks compatible schema mapping | construct unsupported entry | no generic Consumer fallback | same |
| `<new>` | `Quarantined` | same factories | Consumer body gate | forbidden `TransientInspection(Rejected)` or equivalent unsafe carrier | construct quarantined entry | body is not retained; no application dispatch | same |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| non-ready state -> `ReadyForDispatch` on same entry | entry classification is a boundary fact; later input needs a new validated entry. | do not mutate; construct a new entry only from new trusted input. |
| external source converted to committed fact, or vice versa | source variants are intentionally non-interchangeable. | reject factory validation. |
| `Quarantined -> ReadyForDispatch` after retaining/re-inspecting body | body boundary has already rejected the carrier. | retain quarantine result; do not persist/forward body. |
| unsupported kind/schema uses generic listener fallback | finite owner-specific matrix is mandatory. | reject and retain unsupported posture. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| five entry postures | pass | both factory forms own all five variants. |
| source/body isolation | pass | external vs committed source stays typed; body is never in entry. |
| activation/event boundary | pass_with_upstream_blockers | `L2M-UP-005` blocks formal envelope/route/ack semantics. |
| 测试切口 | planned | 10+4 kind/source mapping、schema gate、dedup/trace validation、body quarantine、non-ready no context、no generic fallback。 |

### 17.3 `MemberWorkerRegistrationState`

归属：`worker::registry::MemberWorkerRegistration` within `MemberWorkerRegistryState`。这描述 logical Consumer declaration 的 assembly posture，不是 listener lifecycle；registration 不会启动 worker 或订阅任何 event source。

#### 状态集合

| 状态 | 作用 | 允许 logical dispatch precondition | 关键约束 |
|---|---|---|---|
| `Registered` | finite Consumer declaration is complete for separately validated entry construction。 | 是 | does not prove binding/listener. |
| `Blocked` | a source-specific assembly binding remains fail-closed。 | 否 | named blocker/issue remains visible. |
| `DisabledByConfig` | validated config deliberately omits declaration。 | 否 | no automatic enable. |

#### 状态转换图

```text
<validated assembly plan> --> Registered / Blocked / DisabledByConfig

all registration records are assembly declarations;
they do not transition into listener-running or source-subscribed states.
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Registered` | `MemberWorkerRegistryState::register(registration)` | runtime composition; Consumer entry precondition only | one of 14 finite kinds; unique entry ref/kind; validated logical declaration | add registration carrier | enables only later local entry validation; no listener/route claim | `WorkerError::ContractViolation` |
| `<new>` | `Blocked` | same function | runtime composition blocked mapping | named owner-specific binding cannot be closed safely | add blocked declaration | entry must classify item non-positive; no generic binding | same |
| `<new>` | `DisabledByConfig` | same function | runtime composition config mapping | validated configuration explicitly omits kind | add disabled declaration | no logical dispatch / activation | same |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Blocked` / `DisabledByConfig -> Registered` by runtime flag or item arrival | no mutable registration transition helper exists and config/binding cannot be bypassed. | require later authorized validated assembly; do not mutate registry record. |
| `Registered -> listener running / subscribed / ack enabled` | registry owns declaration only. | no state exists; transport binding remains later/upstream work. |
| missing kind becomes `Registered` via generic external consumer | all 14 kinds are finite. | reject registration. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| finite declaration posture | pass | register function and three state variants agree. |
| lifecycle separation | pass | no listener/broker/container state is introduced. |
| upstream binding | blocked | exact event carrier/route/binding remain blocked by `L2M-UP-001/003/004/005/006/007`. |
| 测试切口 | planned | 14-kind uniqueness、blocked/disabled no dispatch、duplicate registration、no generic fallback、no listener side effect。 |

### 17.4 `MemberConsumerItemDisposition`

归属：`worker::result::MemberConsumerItemResult`。它是 one logical item 的 local handling result shell。`Blocked` may invite a separately designed later continuation, but this shell never mutates into `Accepted`; a later attempt requires a new validated entry/result.

#### 状态集合

| 状态 | 作用 | item terminal | 必须/禁止关联 |
|---|---|---|---|
| `Accepted` | application saved a fresh member-local result surface。 | 是 | result ref required; issues/relations empty. |
| `DuplicateReplayed` | matching stored local result was replayed。 | 是 | result ref required; no rerun. |
| `LateClassified` | attributable late item was classified without overwriting prior truth。 | 是 | non-empty unresolved refs/issues. |
| `Blocked` | current local precondition prevents a positive handling path。 | 否（仅可由新 entry later reconsider） | non-empty unresolved refs/issues. |
| `Rejected` | item refused before application execution。 | 是 | issues required; result ref absent. |
| `UnsupportedSchema` | schema refusal before application execution。 | 是 | issues required; result ref absent. |
| `Quarantined` | unsafe body carrier isolated before application execution。 | 是 | issues required; result ref absent. |

#### 状态转换图

```text
validated Consumer entry
      |
      +--> Accepted / DuplicateReplayed / LateClassified / Blocked
      +--> Rejected / UnsupportedSchema / Quarantined

each result is a terminal shell for its entry;
Blocked --X--> Accepted on the same result (new entry required)
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Accepted` | `MemberConsumerItemResult::accepted(entry, result_ref)` | any fresh Consumer flow | ready entry; matching result was saved through typed stored-result face | construct result shell | does not prove broker ack or source-owner success | `WorkerError::ContractViolation` |
| `<new>` | `DuplicateReplayed` | `duplicate_replayed(entry, result_ref)` | Consumer duplicate path | ready entry; matching stored consumer receipt/result exists | construct replay shell | no domain transition, adapter call, scan or Job run | same |
| `<new>` | `LateClassified` | `late_classified(entry, unresolved_refs, issue_refs)` | feedback / committed-fact late branch | attributable late relation; non-empty ordered refs/issues | construct late shell | prior truth stays unchanged; no rollback/reclassification | same |
| `<new>` | `Blocked` | `blocked(entry, unresolved_refs, issue_refs)` | any Consumer conservative branch | required source/owner/body/local proof missing; non-empty refs/issues | construct blocked shell | no retry/DLQ/scheduler behavior is implied | same |
| `<new>` | `Rejected` | `refused(entry, Rejected, issue_refs)` | pre-application Consumer validation | non-empty safe issues | construct refusal shell | no app context/reservation/domain write | `WorkerError::InvalidEntry` / `WorkerError::ContractViolation` |
| `<new>` | `UnsupportedSchema` | `refused(entry, UnsupportedSchema, issue_refs)` | schema gate | declared Consumer cannot map schema | construct refusal shell | no generic schema compatibility path | same |
| `<new>` | `Quarantined` | `refused(entry, Quarantined, issue_refs)` | body gate | unsafe carrier isolated | construct refusal shell | no payload persistence/inspection/dispatch | same |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| any result disposition -> another on same result | result is immutable boundary output. | construct a new result for a separately validated later entry only. |
| `Blocked -> Accepted` by retry on same result | retry policy is not owned by this carrier. | retain blocked result; no blind replay. |
| `DuplicateReplayed -> Accepted` by reprocessing | duplicate requires stored-result replay only. | return `StoredReceiptUnavailable` if missing, not rerun. |
| accepted/duplicate claims ack, delivery, external acceptance, observation or evidence | those are foreign/transport truths. | no such field or transition. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| seven result factories | pass | all variants map to named Step 6 factories. |
| blocked / duplicate fence | pass_with_future_port_work | concrete stored result retrieval and continuation policy remain later ports/Steps. |
| event/broker separation | pass_with_upstream_blockers | no ack/DLQ/retry/route semantics are inferred. |
| 测试切口 | planned | seven branches、result/issue/ref pairing、late no overwrite、duplicate no rerun、blocked no retry、no broker success claim。 |

### 17.5 `MemberJobEntryState`

归属：`jobs::entry::MemberOperationsJobEntry`。它 is a pre-application posture for one of five fixed logical Operations Jobs. `job_invocation_ref` is correlation only, never an actual scheduler/process run record.

#### 状态集合

| 状态 | 作用 | 可进入 application | 关键约束 |
|---|---|---|---|
| `ReadyForDispatch` | metadata and fixed registration permit facade dispatch。 | 是 | issues empty. |
| `Blocked` | a required source/local/seam precondition prevents positive continuation。 | 否 | issues non-empty. |
| `DisabledByConfig` | validated config deliberately omits fixed job kind。 | 否 | issues non-empty. |
| `Rejected` | metadata/kind mapping invalid before application dispatch。 | 否 | issues non-empty. |

#### 状态转换图

```text
trusted logical Job metadata
       |
       +--> ReadyForDispatch --> operation context / report assembly
       +--> Blocked / DisabledByConfig / Rejected

non-ready --X--> ReadyForDispatch by mutation
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `ReadyForDispatch` | `MemberOperationsJobEntry::from_metadata(...)` | five Job entry paths | registered fixed kind; canonical operation mapping; trusted actor/trace/logical invocation/key; no issues | construct ready entry | may construct application context/report assembly; does not execute job | `JobError::ContractViolation` |
| `<new>` | `Blocked` | same factory | Job blocked seam/source branch | required continuation relation or seam cannot safely proceed | construct blocked entry | later result must be conservative/rejected; no application call | `JobError::InvalidEntry` / `JobError::ContractViolation` |
| `<new>` | `DisabledByConfig` | same factory | Job config gate | validated config deliberately disables kind | construct disabled entry | no schedule/runner/dispatch claim | same |
| `<new>` | `Rejected` | same factory | Job metadata validation | kind/operation/invocation/trace/key/state pairing invalid | construct rejected entry | no context, report assembly, idempotency reservation or domain change | same |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| non-ready entry -> `ReadyForDispatch` on same entry | boundary classification is immutable and config/seam guards cannot be bypassed. | create new entry only after new validated metadata/assembly. |
| Ready entry directly scans Store, transitions domain or calls adapter | entry only constructs context/report assembly then calls application facade. | reject layer violation. |
| logical invocation means actual run/evidence/artifact | this state has no scheduler/process truth. | do not create such result/state. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| four entry states | pass | `from_metadata` owns exact state/issue pairing. |
| five-kind isolation | pass | no sixth/generic job or scheduler state is introduced. |
| runtime binding | blocked | scheduler/config activation belongs later and must not be inferred from Ready. |
| 测试切口 | planned | five kind mapping、metadata validation、blocked/disabled no context、logical invocation-only、no direct Store/adapter call。 |

### 17.6 `MemberJobRunDisposition`

归属：`jobs::result::MemberJobRunResult`。它 is a body-free result shell for one logical continuation. Each non-rejected disposition requires a typed stored job report surface, but none proves a scheduler run, publication delivery, observation ingest, source currentness or gap repair.

#### 状态集合

| 状态 | 作用 | report/result constraints |
|---|---|---|
| `Completed` | local continuation completed with no unresolved report refs。 | result ref + fresh report; issues empty. |
| `PartiallyCompleted` | local successors and unresolved relations coexist。 | result ref + fresh report + issues; advanced/unresolved refs. |
| `Waiting` | formal feedback/resolution/source update is required。 | result ref + fresh report + issues. |
| `Blocked` | precondition/seam blocks positive continuation。 | result ref + fresh report + issues. |
| `Unknown` | local effect/source condition cannot be proven。 | result ref + fresh report + issues; no blind retry. |
| `DuplicateReplayed` | matching stored report is replayed without rerun。 | result ref; transport layer later reads same report schema. |
| `Rejected` | jobs boundary refused before application execution。 | no result ref/report; issues required. |

#### 状态转换图

```text
ready Job entry --> Completed / PartiallyCompleted / Waiting / Blocked / Unknown
                 \-> DuplicateReplayed
non-ready entry -> Rejected

all result shells are terminal;
DuplicateReplayed --X--> fresh execution
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Completed` | `MemberJobRunResult::completed(entry, result_ref, report)` | fresh Job path with no unresolved relations | ready entry; matching stored result/report; report has no unresolved work | construct terminal completed shell | local report only; no external success claim | `JobError::ContractViolation` |
| `<new>` | `PartiallyCompleted` | `partial(entry, result_ref, report, issue_refs)` | Job branch with some local successor and unresolved refs | ready entry; matching stored result/report; report has advanced + unresolved refs; non-empty issues | construct terminal partial shell | reports local progress only; does not repair source gaps | same |
| `<new>` | `Waiting` | `waiting_or_conservative(entry, Waiting, result_ref, report, issue_refs)` | refresh/feedback/source-wait branch | ready entry; matching stored result/report; non-empty safe issues | construct terminal waiting shell | does not start scheduler/dispatch/retry | same |
| `<new>` | `Blocked` | `waiting_or_conservative(entry, Blocked, result_ref, report, issue_refs)` | required seam/precondition blocked branch | ready entry; matching stored result/report; non-empty issues | construct terminal blocked shell | no fallback positive path | same |
| `<new>` | `Unknown` | `waiting_or_conservative(entry, Unknown, result_ref, report, issue_refs)` | unprovable source/side-effect branch | ready entry; matching stored result/report; non-empty issues | construct terminal unknown fence | no blind replay or external effect claim | same |
| `<new>` | `DuplicateReplayed` | `duplicate_replayed(entry, result_ref)` | idempotency duplicate path | ready entry; matching typed stored job result/report exists | construct terminal replay shell | no scan, domain transition, source refresh, handoff or rebuild | same |
| `<new>` | `Rejected` | `rejected(entry, issue_refs)` | non-ready Job entry branch | blocked/disabled/rejected entry; non-empty issues | construct terminal rejection shell | no reservation, report, domain write or external call | `JobError::InvalidEntry` / `JobError::ContractViolation` |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| any built result -> another disposition | result is terminal output for one logical invocation. | make a new validated invocation/result only. |
| `DuplicateReplayed -> Completed` by rerun | duplicate replay must be typed stored report retrieval. | return stored report/missing error; do not run job again. |
| `Rejected -> Waiting/Blocked/Completed` | rejected entry never entered application and has no result/report. | preserve refusal; no reserve/report creation. |
| `Completed` means external delivery/observed/current/gap resolved | report contains only local refs and unresolved posture. | no foreign/domain assertion. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| seven result branches | pass | all variants map to exact result factories. |
| duplicate/report parity | pass_with_future_port_work | concrete stored-report lookup/missing/concurrency behavior remains later work. |
| scheduler/evidence separation | pass | no real run, artifact, test, evidence, verdict or signoff state exists. |
| 测试切口 | planned | seven factories、report/result/issue pairing、partial refs、unknown no replay、duplicate no rerun、rejected no mutation。 |

### 17.7 `MemberJobRegistrationState`

归属：`jobs::registry::MemberJobRunnerRegistration` within `MemberJobRunnerRegistryState`。它 describes one fixed logical job declaration, not cron, queue, runner process or actual schedule activation.

#### 状态集合

| 状态 | 作用 | allows logical entry validation | 关键约束 |
|---|---|---|---|
| `Registered` | fixed job declaration is assembled for separately validated invocation。 | 是 | not scheduler-ready. |
| `Blocked` | required binding remains fail-closed。 | 否 | no generic runner fallback. |
| `DisabledByConfig` | validated config omits fixed job kind。 | 否 | no implicit enable. |

#### 状态转换图

```text
<validated runtime assembly plan> --> Registered / Blocked / DisabledByConfig

all records are logical declarations;
none transitions to scheduled, running, retried or completed.
```

#### 转换矩阵

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `<new>` | `Registered` | `MemberJobRunnerRegistryState::register(registration)` | runtime composition; five Job entry precondition | fixed unique job kind/entry ref and validated assembly declaration | add registered declaration | later entry validation only; no schedule/run process | `JobError::ContractViolation` |
| `<new>` | `Blocked` | same function | runtime composition blocked mapping | required job binding/seam cannot be safely closed | add blocked declaration | jobs entry remains non-positive; no generic runner | same |
| `<new>` | `DisabledByConfig` | same function | runtime composition config mapping | validated configuration explicitly omits kind | add disabled declaration | no job activation/schedule | same |

#### 非法转换

| 非法 From / To | 原因 | 处理 |
|---|---|---|
| `Blocked` / `DisabledByConfig -> Registered` by entry request or config flag mutation | registration is an assembly declaration and has no recovery/enable helper. | require a future validated assembly revision; do not mutate record. |
| `Registered -> scheduled/running/retrying/completed` | scheduler and real execution are explicitly out of scope. | no state/event is created. |
| omitted kind is handled by a generic sixth runner | only five finite job kinds exist. | reject assembly. |

#### 单状态机停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| fixed three-variant declaration | pass | registry register/lookup semantics align. |
| five-kind completeness | pass | each configured kind must be registered/blocked/disabled explicitly. |
| scheduler boundary | pass | no cron/queue/lease/retry/process state leaks in. |
| 测试切口 | planned | five-kind uniqueness、blocked/disabled no entry、duplicate registration、no sixth runner、no scheduling side effect。 |

## 18. 跨状态机副作用与边界一致性审计

本节是对前述 28 个独立状态机的横向静态审计，不新增全局状态机、共享状态字段或实现行为。实际保存顺序、事务、版本比较和重试策略仍不在本 Step 裁决。

| 副作用 / 边界 | 允许的状态机与本地结果 | 禁止的错误推论 | 审计结论 |
|---|---|---|---|
| immutable decision / reception | CP02 intake / screening、CP03 delivery / reception、CP04 outbound、CP06 resolution 的 `<new> -> variant` 构造。 | 在既有 decision / reception 上原地改写 basis、把 Late 改为 Accepted、以 Query 重裁。 | pass；新证据只能形成新 record。 |
| local lifecycle successor | `MemberPresence`、四类 attempt、gap、projection、idempotency、availability、build state 的已存在 Step 6 helper。 | 把 repository `save_*`、selector 或配置 flag 当作领域迁移函数。 | pass_with_design_blockers；实际 version / UoW 留 `L2M-DDD-002`，无 helper 的边保持 reserved。 |
| local attempt / gap | `Prepared / Submitted / Unknown / Blocked` 只表明 member-local seam posture；gap 只表明本地关系未闭合或已本地关闭。 | 把 `Submitted`、`Resolved`、`FeedbackLinked`、`ResultLinked` 写成 host、Runtime、Bus、Conversation 或外部 owner 的成功、交付、观察或修复 truth。 | pass；CP04、CP05、CP06 的创建 / 关联缺口保持 `L2M-DDD-004~006`。 |
| typed stored result / receipt / report | Command、Consumer、Job 的 terminal result 只能引用匹配的 typed stored surface；duplicate 仅 replay。 | stored surface 缺失时重新运行 command / consumer / job，或凭空构造完整 receipt。 | pass_with_design_blockers；完整 Consumer source/receipt 受 `L2M-DDD-003` 阻塞。 |
| projection / visibility | `MemberProjectionStatus` 由维护 path 的既有 helper 推进；Query 可返回 fresh / stale / unavailable posture。 | Query reserve、refresh、rebuild、reconcile、handoff、创建 successor 或把 `Current` 外溢为系统 ready。 | pass_with_design_blocker；CP07 未落码的 HLD intent 保持 `L2M-DDD-007`。 |
| boundary entry / result | API、worker、Job entry/result/registration 只承载本次分类或 logical declaration。 | 将 `ReadyForDispatch`、`Registered`、`Completed` 解释成 listener、scheduler、process、queue、delivery 或 evidence 已实际发生。 | pass。 |
| event / outbox | 本 Step 没有任何 event / outbox 状态转换或副作用。 | 由 state name 推导 envelope、route、topic、publisher、outbox、delivery、ack 或 retry。 | blocked_by `L2M-UP-005`；见 §21.2。 |

## 19. HLD ↔ Step 6 ↔ Step 9 触发闭环审计

转换只有同时具备概要语义、Step 6 可调用 factory / helper 和 Step 9 可回指 flow 时，才可列为当前可调用边。HLD 意图本身不授权 repository、flow 或实现绕过对象契约。

| 审计对象 | HLD / Step 6 / Step 9 对照 | 当前裁决 | 影响 |
|---|---|---|---|
| 28 个状态主语的正式名称 | HLD 状态轮廓经 Step 6 enum 收窄，Step 9 的 Command / Query / Consumer / Job 均可回指相应主语。 | pass_for_current_matrix。 | 所有已列矩阵只使用 Step 6 已定义的变体；不创建 `GlobalState` / `SystemState`。 |
| `SubscriptionScopeStatus` | HLD 有 `Active -> Superseded` 语义；Step 6 无 `supersede` helper；Step 9 无可调用 flow。 | reserved / not callable。 | 不得以 `save_scope_successor` 伪造领域迁移；需未来经授权的对象契约裁决。 |
| `RuntimeSubmissionAttemptStatus` | HLD 曾把 `Unknown -> ResultLinked` 视为可能；Step 6 `link_result` 前置为 `Submitted`；Step 9 可回指的 link flow 同样需要 `Submitted`。 | `Unknown -> ResultLinked` illegal；仅 `Submitted -> ResultLinked` 可列。 | Unknown 保持 fence，不能用反馈重写不可证明的既有 attempt。 |
| CP04 publication attempt / gap | Step 6 有尝试与 gap 类型，但 Step 9 reception 未闭合 `Eligible -> material -> Prepared` 的构造、保存与 relay selector 链；unknown 分支也没有已保存 gap。 | `L2M-DDD-004` open。 | 不把 Prepared、Open gap、relay 或 `mark_unknown(..., gap_ref)` 写成当前可执行正向路径。 |
| CP05 observation attempt / interaction gap | Step 6 `mark_unknown` 是单参数；Step 9 以第二个 `new_gap_ref()` 调用，且没有 matching `InteractionGap` append。 | `L2M-DDD-005` open。 | Unknown 仅是 attempt fence；不宣称 gap 已建立、已观测或可 retry。 |
| CP06 external-context gap | Step 9 refresh 直接要求以 `ResolutionPending` 创建新 gap；Step 6 factory 只允许 `Open / Blocked / Unknown` 初始状态，亦无 `Unknown -> ResolutionPending` helper。 | `L2M-DDD-006` open。 | 不得直接写 status 字段；需先裁决合法初始构造与后继迁移。 |
| CP07 projection | HLD / Step 9 意图包含 `Degraded`、`Unknown`、disable / activate 等；Step 6 只有 `initialize`、`mark_stale`、`start_rebuild`、`complete_rebuild`、`mark_failed`，并且 Step 9 引用了不存在的 `store_version()`。 | `L2M-DDD-007` open。 | 仅保留五条已有 helper 边；save version 必须来自 `Versioned<MemberProjectionState>`，不得由 domain object 伪造。 |
| Consumer replay receipt | Step 8 / Step 9 要求完整 `MemberConsumerReceipt` replay；Step 6 application context 仅保留较窄 `MemberConsumerSourceIdentity`。 | `L2M-DDD-003` open。 | 不默认 authority / schema，不拼空 source、不伪造 receipt；duplicate / blocked 正向完成面受限。 |

## 20. 命名、触发函数、非法转换与验收名称审计

| 审计项 | 结论 | 约束 / 缺口 |
|---|---|---|
| 状态 enum 名 | pass | 每个状态集合都回指 Step 6 的 enum / state value / disposition；没有新增业务状态名。 |
| 同名近义词 | pass_with_scoping_rule | `Accepted`、`Blocked`、`Unknown`、`Ready`、`Submitted`、`Resolved`、`Duplicate` 只能随其完整对象类型解释；不得跨对象传播。尤其 `Ready` 不是 host / container / Runtime readiness，`Submitted` 不是外部成功，`Resolved` 不是 source-owner repair。 |
| terminal result 命名 | pass | `DuplicateReplayed` 是 stored-result replay，`Duplicate` 是 source/reception classification；`Late` 保留历史事实，不重写 current truth。 |
| trigger 覆盖 | pass_with_explicit_reservations | 每条可调用迁移列出 Step 6 factory / helper 及 Step 9 flow；§19 所列 seven 类未闭口事项不被误报为 trigger。 |
| 非法转换错误 | pass_for_current_contract | domain 使用 `DomainError::IllegalTransition(SafeReasonCategory)` 或 factory `InvariantViolation`；application / infra / API / worker / job 使用各自 `*Error::ContractViolation` 或 entry validation error。不使用不存在的 `InvalidStateTransition`。 |
| reserved 状态调用 | pass_with_blockers | `Superseded`、CP04 / CP05 / CP06 未闭合边和 CP07 未提供 helper 的 HLD 意图均不可由当前 boundary 调用。 |
| 测试 / 验收名称来源 | planned | 后续测试与验收文档尚未获授权创建；它们只能引用本文件的完整类型加正式 variant，不能回用 README 的口语状态或把 blocker 当作已通过。 |

## 21. Query、event / outbox 与依赖分类审计

### 21.1 Query no-write

| 范围 | 静态审计结论 | 禁止动作 |
|---|---|---|
| 16 个 Query | pass；只读取 local fact / safe view / projection posture / typed ref 并组装 response。 | 不 reserve idempotency、不 refresh、不 rebuild、不 reconcile、不 handoff、不写 gap / attempt / receipt / report / projection successor。 |
| `MemberProjectionStatus` 暴露 | pass_with `L2M-DDD-007` | Query 只能显示已存状态或 conservative unavailable surface；不能利用读路径补齐 `Degraded`、`Unknown`、version 或 rebuild。 |
| blocked / unknown / stale surface | pass | 必须保留 safe issue / marker，不以默认 target、last-known value 或重新扫描制造正向结论。 |

### 21.2 Event / outbox

24 个 outbound semantic event candidate 仍是语义候选，而不是 event contract、outbox record 或状态机。`L2M-UP-005` 未关闭时，本仓不得定义或暗示以下任一项：envelope、payload、type、source、subject、schema、route、topic、publisher、outbox、delivery、ack、retry 或 dead-letter。因此本文件不为事件创建 `Pending / Published / Failed` 等状态，也不将 attempt 或 gap 同义化为事件交付。

### 21.3 依赖分类

| 分类 | 当前允许的设计表达 | 不得伪装为 |
|---|---|---|
| compile dependency | 仅 planned Core shared primitive / trait candidate；member-specific shared carrier仍受 `L2M-UP-005` 限制。 | 将 `L2-runtime`、`L2-tools`、member-service、member-images、Bus 或 L1 truth owner 写成 package / crate 依赖。 |
| runtime dependency | host collaboration、Runtime entry / safe material、owner-specific resolver、publication / observation seam、runtime builder slot。 | local availability / build state 等于宿主、镜像、Runtime、IPC、container 或 sandbox ready。 |
| event dependency | owner-specific Consumer source 与 committed-fact continuation 的逻辑来源。 | broker ack、route、listener、delivery、event package dependency 或本地 CloudEvents schema。 |
| ref dependency | Identity、Work、Governance、Conversation、Runtime、Tools 等 owner truth 的 typed ref / safe category / neutral resolution。 | 复制 conversation、approval、capability registry、tool execution、Runtime outcome、artifact body 或 external truth。 |
| adapter dependency | Step 7 已定义的 owner-specific future Port / adapter slot，未可用时为 blocked seam。 | MCP / A2A / API adapter、UDS / HTTP / RPC、credential、image、host lifecycle 的本仓 owner 实现。 |
| fake dependency | 无。 | 用 runtime / event / ref / adapter 协作冒充 compile dependency，或用 placeholder / default / shell ref 填补 blocker。 |

## 22. 测试切口、历史污染、改动对比与设计取舍

### 22.1 计划中的最小测试切口（未执行）

| 测试族 | 应验证的状态契约 | 当前状态 |
|---|---|---|
| lifecycle / immutable | 合法 helper/factory 边可构造；非法边返回对应错误；immutable record 不能原地重裁。 | planned。 |
| attempt / gap fence | `Submitted` 不等于外部成功；Unknown 不盲重放；无 gap helper / relation 时保守阻断。 | planned；CP04~06 需先关闭各自 design gap。 |
| Consumer / Job replay | duplicate 只返回 matching typed stored receipt / report；缺失或不匹配显式失败、绝不 rerun。 | planned；Consumer 完整 receipt 受 `L2M-DDD-003` 限制。 |
| Query | 16 Query 无任何 write、reserve、refresh、rebuild 或状态推进。 | planned。 |
| entry / registry | API / worker / job 的 non-ready / rejected / disabled 分支不进入 application，不产生 scheduler / listener / delivery truth。 | planned。 |
| projection / build / adapter | 五条 CP07 已有 helper 边、facade-only `Ready`、availability marker 不产生外部 readiness。 | planned；CP07 扩展意图受 `L2M-DDD-007` 限制。 |
| event separation | 24 candidates 不生成 event/outbox/publish state，不伪造 delivery / retry。 | planned / blocked_by `L2M-UP-005`。 |

以上是测试设计入口，不是测试结果、run、artifact、report、evidence、verdict、signoff 或 readiness。

### 22.2 historical-material 污染复核

| historical material | 旧预设 | 本 Step 处理 |
|---|---|---|
| `README.md` | CloudEvents、AG-UI、UDS gRPC、member-service gRPC port、launch token、supervisord、P95 数字。 | 全部仅作污染审计输入；未成为 state、trigger、event / route、IPC、process lifecycle、performance gate 或 readiness truth。 |
| 旧正式 `03-详细设计.md` | historical material，不能替代本轮 Step 6 / 8 / 9 / 10 校准来源。 | 未直接继承状态、错误、transport 或 actor 语义。 |
| 上游 / sibling 未稳定材料 | exact host lifecycle、image release、Runtime trigger / handoff、member event carrier、credential、screening、execution subject。 | 只以 `L2M-UP-001~008` 记录 pending / blocker，不由本地状态名自动补齐。 |

### 22.3 本 Step 与前序材料的校准差异

| 对比对象 | 先前风险 / 不确定性 | Step 10 形成的受控结论 |
|---|---|---|
| HLD 状态轮廓 | 一些语义边没有同层 helper，容易被视为可实现。 | 每条边以 Step 6 callable surface 筛选；无 helper 的边明确 reserved / blocked。 |
| Step 6 对象契约 | enum / factory 存在，但跨对象转换、非法边和终态边界分散。 | 28 个主语逐个给出集合、ASCII 图、矩阵、非法转换和停审。 |
| Step 9 flow | flow 可能引用不存在参数、version 或 gap relation。 | 精确登记 `L2M-DDD-003~007`，不把 flow 片段升级为可执行设计。 |
| historical README | transport / process 的旧方案可能污染 member-local state。 | 把 transport、delivery、IPC、image、host lifecycle 与 member-local attempt / gap / facade state 分离。 |

### 22.4 设计取舍

1. 以不可变 decision / receipt / result 及显式 successor 取代“原记录恢复为成功”，保障历史事实不被反馈或读路径重写。
2. 以 member-local attempt、gap 和 conservative `Blocked / Unknown` 表达边界不确定性，不占有 Runtime、host、Bus、Conversation、governance 或外部 owner 的 truth。
3. 以 28 个受类型限定的状态机代替全局状态，使 `Accepted`、`Ready`、`Resolved` 等近义名称不产生跨模块误推。
4. 以缺 helper 即 reserved / blocked 的门禁取代 repository 或 config flag 的隐式迁移；这牺牲了表面上的正向流程完整度，换取可落码性和 fail-closed 行为。
5. 在 `L2M-UP-005` 未关闭前不引入 outbox / delivery state，避免把 event 协作伪装成本仓持久化或 package 责任。

## 23. `03-详细设计.md` §9 回填草稿（未写入正式正文）

仅当 Step 19 已完成且用户另行授权 `formal_03_write_allowed = true` 时，正式 §9 应按以下结构从本中间产物回填；当前不得复制或写入正式 `03-详细设计.md`。

| 正式 §9 小节 | 应回填的受控内容 | calibration source |
|---|---|---|
| §9.1 状态主语与通用规则 | 28 个状态主语、状态族、immutable / lifecycle / disposition 区分、错误与 no-global-state 规则。 | 本文件 §5~8。 |
| §9.2~§9.8 CP01~CP07 | 各 CP 的状态集合、ASCII 图、转换矩阵、非法边和单机停审结论。 | 本文件 §9~15。 |
| §9.9 technical / boundary states | idempotency、availability、build、blocked seam 与 API / worker / Job entry/result/registration 的终态边界。 | 本文件 §16~17。 |
| §9.10 跨状态约束 | 命名限定、helper / flow 回指、Query no-write、event-outbox 禁止、依赖分类、planned test cuts。 | 本文件 §18~22。 |
| §9.11 pending / blockers | `L2M-UP-001~008` 与 `L2M-DDD-001~007` 的保守口径；其中 flow / helper 对齐问题为 `003~007`；不得改写为已实现或已联调。 | 本文件 §8、§19、§21~22。 |

## 24. Step 10 完成条件与停审结论

| 完成条件 | 结论 |
|---|---|
| 状态主语筛选与状态族分组 | completed；排除了 ref、ID、纯 value / DTO wrapper、外部 truth、cache / lock / retry counter 和无独立生命周期 marker。 |
| 逐状态机状态集合、ASCII 图、转换矩阵、非法转换表 | completed；28/28 均已逐项停审。 |
| 状态名、trigger、前置字段、错误、副作用与测试切口审计 | completed / pass_with_upstream_and_design_blockers；结论见 §18~22。 |
| HLD ↔ Step 6 ↔ Step 9 对照 | completed；`L2M-DDD-003~007` 未伪关闭。 |
| Query / event / dependency / historical-material 审计 | completed；16 Query no-write，24 event candidate 继续 blocked，依赖无伪装，旧 README 未继承。 |
| 正式正文、实现、提交与证据 | none；未修改正式 `03-详细设计.md`，未实现代码、未运行测试、未创建 artifact / report / evidence，未提交 commit。 |

```text
step_10_status = completed / pass_with_upstream_and_design_blockers / stop_review
current_document = 03-详细设计.md
current_step = Step_10_state_matrix_completed_stop_review
current_module = cross_state_audit
next_allowed_action = wait_for_new_explicit_user_confirmation_before_step_11
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```
