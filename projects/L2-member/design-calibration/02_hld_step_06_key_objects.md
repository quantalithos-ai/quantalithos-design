# Step 6. 关键对象轮廓主控

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-08-23
> 状态: completed / pass / CP01~07_stop_review / cross_object_audit_pass
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标与边界

从 Step 5 的 34 个对象候选中逐项正式化 language-neutral 骨架。每个对象必须有 capability 来源、所属组成部分、对象类型、关键字段类型、按需状态、带类型参数的成员 / 工厂函数和禁止事项。本步不定义完整 schema、repository / port、DTO、数据库列、完整 signature 或实现。

## 2. Step 内计划

| 顺序 | 模块 | 输出文件 | 状态 | 门禁 |
|---:|---|---|---|---|
| 1 | 全局问题回答与候选筛选 | 本主控文件 §3~§5 | completed / pass | 34 个候选有唯一归属;field / interface / implementation 已分流 |
| 2 | CP01 Presence / Host 对象 | `02_hld_step_06_key_objects_presence_host.md` | completed / pass | 5/5 对象已正式化并停审 |
| 3 | CP02 Inbound 对象 | `02_hld_step_06_key_objects_inbound.md` | completed / pass | 5/5 对象已正式化并停审 |
| 4 | CP03 Runtime Mediation 对象 | `02_hld_step_06_key_objects_runtime_mediation.md` | completed / pass | 5/5 对象、typed functions、Runtime truth 引用边界与写后审计通过 |
| 5 | CP04 Outbound 对象 | `02_hld_step_06_key_objects_outbound.md` | completed / pass | 5/5 对象、typed functions、出站五层状态与写后审计通过 |
| 6 | CP05 Interaction Trace 对象 | `02_hld_step_06_key_objects_trace.md` | completed / pass | 5/5 对象、typed functions、trace / observed 边界与写后审计通过 |
| 7 | CP06 External Mirror 对象 | `02_hld_step_06_key_objects_external_mirror.md` | completed / pass | 4/4 对象、typed functions、neutral resolution 与写后审计通过 |
| 8 | CP07 Read Model 对象 | `02_hld_step_06_key_objects_read_model.md` | completed / pass | 5/5 对象、typed functions、projection no-write 与写后审计通过 |
| 9 | Step 8 / 9 反查与跨对象审计 | 本主控文件 §6~§10 | completed / pass | 34/34 唯一对象、对象链、状态分层、blocker 与依赖类型审计通过 |

## 3. 全局问题回答与取舍

### 3.1 哪些对象必须点名

如果不正式化以下对象,详细设计会重新发明或压平至少一条已收稳语义:startup admission vs presence、scope vs screening、delivery decision vs Runtime result、outbound decision vs publication attempt、trace link vs source fact、external resolution vs authorization、projection view vs truth。因此 Step 5 的 34 个候选全部进入独立对象章节,不再剔除其中任何一个。

### 3.2 哪些名称只作为字段类型

| 名称类别 | 示例 | 筛选结论 | 原因 |
|---|---|---|---|
| Core shared primitives | `ActorContext`、`CommandMetadata`、`IdempotencyKey`、`TraceContext`、`Timestamp`、`Digest`、`TypedRef` | 字段 / interface context | Core authority;不得在 member shadow object |
| 外部主体 / 身份 refs | `ProjectMemberRef`、`GlobalMemberRef`、`StartupContextRef`、`CredentialRef` | 字段类型 | Truth 归 Work / Identity / credential owner |
| Runtime refs | `RuntimeTriggerContextRef`、`RuntimeAdmissionDecisionRef`、`RuntimeOutcomeRef`、`RuntimeSafeHandoffMaterialRef` | 字段类型 | Runtime objects 归 Runtime;exact mapping pending |
| Bus / downstream refs | `SourceEventRef`、`BusDeliveryRef`、`DownstreamFeedbackRef`、`ObservationFeedbackRef` | 字段类型 | Delivery / observed / accepted truth 外置 |
| policy / tool / method refs | `PolicySnapshotRef`、`ToolContractViewRef`、`CapabilityBindingViewRef`、`MethodDefinitionRef` | 字段类型 | External definition / decision truth 外置 |
| purpose / category / state value | `InteractionPurpose`、`SafeReasonCategory`、`SourceFreshness`、各 `*Status` | value / enum field type | 由所属对象状态表解释,不单独升格为 domain owner |

### 3.3 哪些名称留给 Step 7 或详细设计

| 类别 | 名称 | 去向 |
|---|---|---|
| API / Consumer / Job | `PresenceCommandApi`、`InboundFactConsumer`、`RuntimeMaterialConsumer`、`PublicationRelayJob`、`MemberQueryApi` 等 | Step 7 / Step 8 |
| External Port | `HostCollaborationPort`、`RuntimeEntryPort`、`EventPublicationPort`、owner resolver ports 等 | Step 7 / 03 |
| Store / Repository | presence / inbound / mediation / outbound / trace / mirror / projection stores | Step 7 persistence port / 03 transaction design |
| DTO / envelope / response | command / query / event DTO、host / Runtime / Bus carrier | 03;exact external contracts受 blocker |
| implementation | table / index / outbox carrier / cache / queue / scheduler / retry helper | 03 / 04 / 07 |

### 3.4 对象拆分与复杂度取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 单一 `Member` / `MemberFacade` aggregate | 不采用 | 会把 subject、presence、screening、Runtime、outbound、projection 再次压成 persona |
| 每个外部 ref 都包装为 member object | 不采用 | 会 shadow owner;只有 snapshot / resolution / gap 形成 member support truth |
| 每个组成部分一个 policy mega-object | 不采用 | scope / screening 等具有不同 invariant;保留 Step 5 候选边界 |
| 按七部分附录拆分 | 采用 | 每个对象独立成节且正式正文可保持摘要层 |
| 独立对象分布图 | 不画 | 七部分分布表已足够清楚,额外图不会增加判断信息 |

## 4. 对象候选池筛选说明

### 4.1 正式关键对象与附录

| 组成部分 | 正式对象 | 数量 | 展开文件 |
|---|---|---:|---|
| CP01 Presence / Host | `StartupAdmission`;`MemberPresence`;`HostCollaborationMaterial`;`HostCollaborationAttempt`;`PresenceAdmissionPolicy` | 5 | `02_hld_step_06_key_objects_presence_host.md` |
| CP02 Inbound | `SubscriptionScopeDecision`;`InboundFactRecord`;`ScreeningDecision`;`SubscriptionScopePolicy`;`InboundScreeningPolicy` | 5 | `02_hld_step_06_key_objects_inbound.md` |
| CP03 Runtime Mediation | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`RuntimeResultLink`;`RuntimeMaterialReception`;`RuntimeMediationPolicy` | 5 | `02_hld_step_06_key_objects_runtime_mediation.md` |
| CP04 Outbound | `OutboundDecision`;`MemberOutboundMaterial`;`PublicationAttempt`;`PublicationGap`;`OutboundMaterialPolicy` | 5 | `02_hld_step_06_key_objects_outbound.md` |
| CP05 Interaction Trace | `InteractionTraceEntry`;`InteractionGap`;`ObservationMaterial`;`ObservationAttempt`;`TraceMaterialPolicy` | 5 | `02_hld_step_06_key_objects_trace.md` |
| CP06 External Mirror | `ExternalContextSnapshot`;`ExternalContextResolution`;`ExternalContextGap`;`MirrorResolutionPolicy` | 4 | `02_hld_step_06_key_objects_external_mirror.md` |
| CP07 Read Model | `MemberSummaryView`;`CapabilityOutletView`;`MemberProjectionState`;`MemberDiagnosticView`;`ReadProjectionPolicy` | 5 | `02_hld_step_06_key_objects_read_model.md` |
| Total | 所有 Step 5 “必须独立展开”候选 | 34 | 7 annexes |

### 4.2 候选筛选完整性

| 候选来源 | 数量 | 正式展开 | 仅字段类型 | Step 7 / 03 | 未处理 |
|---|---:|---:|---:|---:|---:|
| Step 5 “必须独立展开” | 34 | 34 | 0 | 0 | 0 |
| Step 5 Reference / Boundary 线索 | 类别型 | 0 | 全部 | ports / DTO 按类别 | 0 |
| Step 4 API / port / store / job 主体 | 类别型 | 0 | 0 | 全部 | 0 |

## 5. 对象命名与边界纪律

- `MemberPresence` 只表达本地在场,不叫 `MemberRuntimePersona`。
- `RuntimeDeliveryDecision` 是 member 是否提交的本地决定,不叫 `RuntimeAdmissionDecision`。
- `RuntimeResultLink` / `RuntimeMaterialReception` 只关联 external truth,不复制 Runtime object。
- `MemberOutboundMaterial` 明确属于 member,不与 Runtime / Tools 的同名 `SafeHandoffMaterial` 混用。
- `PublicationAttempt` / `ObservationAttempt` 表达本地提交,不使用 delivered / observed 命名。
- `ExternalContextResolution` 是 neutral consumption state,不叫 Authorization / Health / Acceptance。
- `CapabilityOutletView` 是 projection,不叫 registry / capability catalog。

## 6. Step 8 处理流预反查清单

| 预计处理流 | 必须反查对象 |
|---|---|
| startup admission / presence transition / host collaboration | CP01 全部 5 对象 |
| subscription / inbound fact / screening | CP02 全部 5 对象 + CP06 resolution |
| controlled Runtime delivery / result link / material reception | CP03 全部 5 对象 |
| outbound decision / material / publication / feedback | CP04 全部 5 对象 |
| trace append / observation handoff | CP05 全部 5 对象 |
| source refresh / resolution / gap | CP06 全部 4 对象 |
| summary / outlet / diagnostic projection / query / rebuild | CP07 全部 5 对象 |

## 7. Step 9 状态预反查清单

| 状态主题 | 对象来源 |
|---|---|
| startup admission / presence / host attempt | `StartupAdmission`;`MemberPresence`;`HostCollaborationAttempt` |
| subscription scope / screening | `SubscriptionScopeDecision`;`ScreeningDecision` |
| Runtime delivery / submission / reception | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`RuntimeMaterialReception` |
| outbound / publication / gap | `OutboundDecision`;`PublicationAttempt`;`PublicationGap` |
| interaction / observation gap and attempt | `InteractionGap`;`ObservationAttempt` |
| source resolution / gap | `ExternalContextResolution`;`ExternalContextGap` |
| projection / outlet availability | `MemberProjectionState`;`CapabilityOutletView` |

## 8. 七部分逐部分停审

| 部分 | 对象数 | 逐对象字段 / 状态 / typed function | owner 与禁止事项 | 结论 |
|---|---:|---|---|---|
| CP01 Presence / Host | 5 | pass | project subject / local presence 与 host truth 分离;cross audit 补齐 material purpose、host boundary / submission ref 与 typed resolution evidence | stop_review |
| CP02 Inbound | 5 | pass | body-free intake、scope、screening、Policy / Runtime state 分离 | stop_review |
| CP03 Runtime Mediation | 5 | pass | local delivery / attempt / link / reception 与 Runtime truth 分离 | stop_review |
| CP04 Outbound | 5 | pass | decision / material / attempt / gap 与 delivery / accepted / observed 分离 | stop_review |
| CP05 Interaction Trace | 5 | pass | source fact / trace / observation attempt / observed 分离 | stop_review |
| CP06 External Context Mirror | 4 | pass | snapshot / neutral resolution / gap 与 external business truth 分离 | stop_review |
| CP07 Member Read Model | 5 | pass | summary / outlet / diagnostics / state 可重建、no-write、non-authorizing | stop_review |
| Total | 34 | 34/34 独立对象章节;名称唯一 | 无隐藏第八部分、无隐式 mega-object | pass |

## 9. 跨对象闭环审计

### 9.1 对象链与唯一写权

| 链路 | 输入对象 / 外部引用 | 本地新事实 | 不得被本地事实替代的 external truth |
|---|---|---|---|
| startup / presence | subject / identity / startup / credential resolutions | `StartupAdmission` -> `MemberPresence` -> `HostCollaborationMaterial` / `HostCollaborationAttempt` | host acceptance / registry / session / health / lifecycle |
| inbound / screening | `MemberPresence` + source resolution + `SourceEventRef` | `SubscriptionScopeDecision` -> `InboundFactRecord` -> `ScreeningDecision` | Bus delivery / Policy effective / Governance decision |
| Runtime entry | `ScreeningDecision` + `InboundFactRecord` + Runtime mapping resolution | `RuntimeDeliveryDecision` -> `RuntimeSubmissionAttempt` -> `RuntimeResultLink` | Runtime admission / run / context / plan / outcome |
| Runtime committed output | Runtime outcome / safe material refs | `RuntimeMaterialReception` | Runtime outcome / material ownership |
| outbound publication | `RuntimeMaterialReception` + target resolution | `OutboundDecision` -> `MemberOutboundMaterial` -> `PublicationAttempt` / `PublicationGap` | Bus delivery / Conversation fact / downstream accepted / observed |
| interaction trace | CP01~04 committed refs | `InteractionTraceEntry` / `InteractionGap` -> `ObservationMaterial` / `ObservationAttempt` | source facts / complete log / evidence / backend observed |
| external mirror | owner-specific typed ref / safe material | `ExternalContextSnapshot` -> `ExternalContextResolution` / `ExternalContextGap` | authorization / health / acceptance / registry / definition truth |
| member read | CP01~06 committed refs / resolutions + watermark | `MemberProjectionState` -> summary / outlet / diagnostic revisions | core / support / external truth;consumer write authority |

### 9.2 状态分层

| 容易压平的状态 | 已采用对象分层 | 审计结论 |
|---|---|---|
| startup accepted / presence ready / host accepted / healthy | `StartupAdmission`;`MemberPresence`;`HostCollaborationAttempt`;`HostFeedbackRef` | 四层分离;local ready 不代答 host。 |
| scope active / screening passed / Runtime eligible / Runtime accepted | `SubscriptionScopeDecision`;`ScreeningDecision`;`RuntimeDeliveryDecision`;`RuntimeResultLink` | 四层分离;passed 不直接创建 run。 |
| Runtime outcome / reception / outbound eligible / material / submitted / delivered / accepted | Runtime refs;`RuntimeMaterialReception`;`OutboundDecision`;`MemberOutboundMaterial`;`PublicationAttempt`;external feedback refs | local truth first;无单一 success。 |
| trace linked / observation submitted / observed / evidence verdict | `InteractionTraceEntry`;`ObservationAttempt`;`ObservationFeedbackRef`;external evidence owner | attempt 不升级 observed / evidence。 |
| external snapshot / resolved / authorized / healthy / available | `ExternalContextSnapshot`;`ExternalContextResolution`;consumer policy;external owner | resolved 只表示消费输入充分。 |
| view available / source current / invocation authorized | `CapabilityOutletView`;`MemberProjectionState`;external refs | outlet 只读且 non-authorizing。 |

### 9.3 数据与失败边界

| 审计项 | 结论 | 依据 |
|---|---|---|
| forbidden body 不成为对象字段 | pass | raw event / model output / hidden reasoning / secret / definition body / complete log / evidence body 均只出现在禁止事项。 |
| 外部 truth 只以 ref / safe category / point-in-time snapshot 出现 | pass | Runtime、host、Bus、Governance、Conversation、Tools、Method 与 Observability 均无本地生命周期对象。 |
| duplicate / late / out-of-order 不覆盖历史 | pass | decision revision、result / feedback link、successor gap 与新 attempt 均采用追加语义。 |
| unknown side effect 有 fence | pass | host / Runtime / publication / observation attempts 均要求正式 resolution / idempotency evidence 后再评估。 |
| Trace / Mirror / Read Model 不反写 core | pass | trace 失败只开 gap;Mirror 中立;projection / Query / rebuild 无 core write。 |
| 可选 outlet / diagnostics 不阻塞核心 | pass | `not_available` / `disabled` / gap 显式,C1~C4 不依赖其 current。 |

### 9.4 上游 pending 对象影响

| Pending | 直接受影响对象 | 当前对象级口径 |
|---|---|---|
| `L2M-UP-001` host exact contract | `HostCollaborationMaterial`;`HostCollaborationAttempt`;CP06 resolution / gap | 只保留 transport-neutral refs;正向 carrier blocked。 |
| `L2M-UP-002` image release / consumer contract | 无业务对象;后续 implementation supply / host handoff | 不把 image / manifest / compatibility 升格为 member truth。 |
| `L2M-UP-003` Runtime entry mapping | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`RuntimeResultLink` | mapping 缺失为 blocked;不私造 trigger schema。 |
| `L2M-UP-004` Runtime handoff / event source family | `RuntimeMaterialReception`;`PublicationAttempt`;`PublicationGap`;`ObservationAttempt` | source / route 不可证明时 blocked / gap。 |
| `L2M-UP-005` Core member schema / event family | intake / publication / observation boundary refs | 共享 primitive 仅承接 Core authority;member-specific carrier 后移。 |
| `L2M-UP-006` credential / startup identity | `StartupAdmission`;`PresenceAdmissionPolicy`;CP06 resolution / gap | unverifiable 必须 blocked。 |
| `L2M-UP-007` screening rule source | `ScreeningDecision`;`InboundScreeningPolicy`;CP06 resolution / gap | unknown / stale / conflict 不得 passed。 |
| `L2M-UP-008` execution subject scope | CP01~05 所有 subject-bearing objects;CP07 views | 当前只支持 `ProjectMemberRef`;第三种主语 fail closed。 |

### 9.5 依赖类型审计

| 依赖类别 | Step 6 表达 | 结论 |
|---|---|---|
| compile | Core shared primitive / authority candidate | 唯一 package dependency 候选;具体 member schema pending。 |
| runtime | host / Runtime / owner resolver / publication / observation boundary refs | 只形成 Step 7 ports 候选,不写 sibling package。 |
| event | source event、feedback、committed material refs | delivery / route / retry truth 外置。 |
| ref | Work / Identity / Governance / Runtime / Tools / Method / downstream typed refs | 不转移 owner,不复制 body。 |
| adapter | owner-specific adapter 候选 | 留 03;无 generic external adapter。 |
| fake | 当前对象层无 fake | 后续测试替身不得伪装 real integration。 |

## 10. Step 6 最终 gate

| Gate | 结论 | 说明 |
|---|---|---|
| 34 个候选全部有唯一归属 | pass | 5 + 5 + 5 + 5 + 5 + 4 + 5 = 34,无重名。 |
| 每个对象可追溯 capability | pass | 七附录分别回链 Step 5 §7~§13。 |
| 对象粒度可落码且未越界到详细设计 | pass | 已有关键字段类型、状态、typed member / factory functions 与禁止事项;未写 schema / repository / transport / implementation。 |
| Step 8 流程可反查 | pass | §6 的七组处理流均有完整输入、local fact、attempt / gap 与派生对象。 |
| Step 9 状态可反查 | pass | §7 的七组状态主题无跨 owner 压平。 |
| 历史污染排除 | pass | 只在否决项出现 persona / mega-object;未继承 AG-UI、UDS、launch token、固定 event family / SLA、Rust / supervisord。 |
| 非伪造 | pass | 未声明 implementation、test、run、artifact、evidence、verdict、signoff 或 readiness。 |

Step 6 结论为 `completed / pass / stop_review`。下一允许动作是读取 Step 7 规范输入并创建 `02_hld_step_07_api_interface_skeleton.md`;Step 7 通过前不得创建 Step 8。
