# Step 9. 状态机与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-08-25
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与边界

本步把 Step 6 的对象状态、Step 7 的状态触发接口和 Step 8 的处理流收束为独立的状态语义。状态机只表达 member 所拥有的 local truth、support truth、attempt、gap、resolution 与 projection freshness；不吸收 Runtime loop / context / plan / outcome、host health / session、Bus delivery、Governance decision、Tools registry、Conversation truth、Artifact evidence 或 Observability backend 状态。

Step 9 严格按 `CP01 -> CP02 -> CP03 -> CP04 -> CP05 -> CP06 -> CP07` 串行。CP01~CP07 与跨状态一致性审计均已停审通过；其结论作为后续 Step 的固定输入，不重开状态 owner。状态迁移清单是概要级骨架，不是 enum、数据库列、并发实现或错误码全集。

## 2. Step 内计划

| 顺序 | 模块 | 输出文件 | 状态 | 门禁 |
|---:|---|---|---|---|
| 1 | 全局状态族、命名和传播规则 | 本主控文件 §3~§6 | completed / pass | 状态 owner、外部 truth 排除、触发类别和传播方向已冻结 |
| 2 | CP01 Presence / Host | `02_hld_step_09_state_machine_presence_host.md` | completed / pass / stop_review | admission、presence、host attempt 状态与传播已停审 |
| 3 | CP02 Inbound | `02_hld_step_09_state_machine_inbound.md` | completed / pass / stop_review | scope、intake、screening 状态与传播已停审 |
| 4 | CP03 Runtime Mediation | `02_hld_step_09_state_machine_runtime_mediation.md` | completed / pass / stop_review | delivery、submission、result link、reception 状态与传播已停审 |
| 5 | CP04 Outbound | `02_hld_step_09_state_machine_outbound.md` | completed / pass / stop_review | outbound、publication、gap 状态与传播已停审 |
| 6 | CP05 Interaction Trace | `02_hld_step_09_state_machine_trace.md` | completed / pass / stop_review | interaction gap、observation attempt 状态与传播已停审 |
| 7 | CP06 External Context Mirror | `02_hld_step_09_state_machine_external_mirror.md` | completed / pass / stop_review | snapshot、resolution、gap 状态与传播已停审 |
| 8 | CP07 Member Read Model | `02_hld_step_09_state_machine_read_model.md` | completed / pass / stop_review | projection、outlet 状态与传播已停审 |
| 9 | 跨状态一致性审计与最终 gate | 本主控文件 §7~§10 | completed / pass / stop_review | 34/34 对象、接口、流、迁移、方向与 pending 口径已核验通过 |

## 3. SOP 问题回答

### 3.1 本仓有哪些正式状态族

本仓不是一个压平所有语义的 `MemberLifecycleState`。正式状态族按七个业务组成部分归属：

| 状态族 | 主要对象 | 语义边界 |
|---|---|---|
| Presence / Host | `StartupAdmission`、`MemberPresence`、`HostCollaborationAttempt` | member 是否受理、处于何种本地在场姿态、一次 host seam 尝试的本地姿态 |
| Inbound | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision` | scope、入站承接和四态 member screening |
| Runtime Mediation | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception` | controlled delivery、提交尝试、Runtime ref 关联、safe material 承接 |
| Outbound | `OutboundDecision`、`PublicationAttempt`、`PublicationGap` | 出站资格、publication attempt、未闭合的 publication gap |
| Interaction Trace | `InteractionGap`、`ObservationAttempt` | 交互关联缺口和 observation handoff attempt |
| External Context Mirror | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap` | source snapshot、consumer-purpose neutral resolution、source gap |
| Member Read Model | `MemberProjectionState`、`CapabilityOutletView` | projection freshness / rebuild posture 和 outlet availability |

`HostCollaborationMaterial`、`MemberOutboundMaterial`、`InteractionTraceEntry`、`ObservationMaterial`、各类 view revision 与 policy 是 immutable / derived / policy 主体，不拥有独立可变生命周期；它们的形成或 revision 由所属 source / projection 状态承接。

### 3.2 状态含义与正常主线

- `accepted` / `active` / `passed` / `eligible` 只表示本仓相应 local decision 足以进入下一 member-side 处理流，不表示相邻 owner 已接受或完成。
- `starting` / `ready` / `degraded` / `draining` / `terminated` / `unknown` 只属于 `MemberPresence`；宿主不可达可以在有明确 local basis 时触发 `degraded`，不能由 host health 或 heartbeat 隐式覆盖。
- `submitted` / `feedback_linked` 只描述本地 attempt 与外部 ref 关联；不得解释为 delivered、accepted、healthy、observed 或 evidence。
- `blocked`、`pending`、`unknown`、`stale`、`gap`、`unavailable` 是可见的保守结果，不得被默认值、旧快照或配置开关改写为正常主线。
- projection 的 `current` 只在来源 watermark 覆盖且完整性可证明时成立；outlet `available` 只代表安全 ref / resolution 足够，不代表授权或可调用。

### 3.3 状态迁移触发类别

| 触发类别 | 允许改变的状态 | 典型 Step 7 / 8 入口 | 不得改变 |
|---|---|---|---|
| Command | local decision、presence、scope、delivery、outbound、resolution、显式 transition | `AdmitMemberStartup`、`TransitionMemberPresence`、scope / delivery / resolve Commands | 外部 owner truth、Query surface 的隐式状态 |
| External Consumer | feedback link、committed reception、mirror snapshot / resolution / gap、projection stale marker | `HostFeedbackConsumer`、`RuntimeMaterialConsumer`、CP06 source Consumers、Read Model Consumers | Governance decision、Runtime run / outcome、host health、source owner truth |
| Internal committed-fact Consumer | trace link / gap、projection stale / watermark、下游准备事实 | `MemberCommittedFactConsumer`、`MemberProjectionUpdateConsumer`、`CapabilityOutletSourceUpdateConsumer` | source fact、core decision、external acceptance |
| Operations Job | publication / observation attempt continuation、refresh、projection rebuild / reconcile | 五个 Step 7 Jobs | core truth、外部 truth、unknown side effect 的猜测结论 |
| Query | 无持久状态迁移 | 16 个 Query | 任意 truth、gap、refresh、rebuild、outbox 或 resolver 状态 |

### 3.4 统一历史与 revision 规则

- 决策、scope、fact、link、attempt、gap、snapshot、resolution 与 projection state 均以 revision / successor / append 语义保留历史；不得通过删除或原地覆盖修正历史。
- 一个状态名称跨组成部分出现时，必须以对象名和状态类型限定，例如 `MemberPresenceStatus.ready` 不等于 `RuntimeResultClassification.accepted`，`ExternalContextResolutionStatus.resolved` 不等于 `CapabilityOutletStatus.available`。
- `unknown` 是 side-effect 或来源完整性无法证明的 fence。只有新的正式 resolution、可回链 feedback 或显式 command basis 才能形成 successor / 新 revision；不能以 retry 次数或时间流逝自动升级。

## 4. 状态传播总规则

#### 状态传播关系图

```text
<Committed local state revision>
        │
        ▼
<Semantic Event Candidate / local trace link>
        │
        ├─ <same-owner continuation> -> <attempt / gap / resolution>
        │
        ├─ <MemberFact consumer> -> <trace or projection stale marker>
        │
        └─ <Read Query> -> <body-free status / freshness surface>
```

关键说明：
- 图表达本地状态 revision 如何向本仓 trace、attempt、gap、resolution 和 projection surface 传播。
- 图不表达 Bus route、outbox carrier、host / Runtime / downstream acceptance 或具体事务实现。
- 任一外部反馈只能形成 owner-specific ref / classification；它不能沿传播链反向改写 source truth。

### 4.1 状态传播规则

| 来源状态变化 | 本仓允许传播到 | 本仓禁止传播到 |
|---|---|---|
| CP01~CP04 committed fact / decision / attempt | CP05 trace、CP07 projection、semantic event candidate、同 owner continuation | 外部 acceptance / observed / health / registry |
| CP06 snapshot / resolution / gap | 受影响 owner 的 blocked / pending / stale / degraded posture、CP07 projection | Governance / Runtime / host / Tools source truth |
| CP04 / CP05 attempt 或 gap | feedback link、successor gap、trace、projection diagnostics | 已成立 decision / source fact |
| CP07 projection state | Query freshness、rebuild / reconcile continuation | 任一 core/support source truth |
| Query result | consumer-visible posture | 任何持久状态或隐式 Job |

### 4.2 外部 truth 排除

本步不定义以下状态：Runtime loop / run / context / plan / outcome、host registration acceptance / session / health、Bus delivered / retry / route、Governance policy effective / approval、Tools registry / invocation authorization、Conversation accepted / observed、Artifact evidence、Observability backend health。它们只能以 `TypedRef`、safe snapshot、feedback ref 或 neutral resolution 进入本仓状态判断。

## 5. 状态命名冲突与复杂度取舍

| 议题 | 结论 | 理由 |
|---|---|---|
| 单一 `MemberLifecycleState` | 不采用 | 会把 admission、presence、screening、attempt、gap、resolution 和 projection freshness 混成一个不可审计成功语义。 |
| 把 immutable material / view 当生命周期对象 | 不采用 | material / view revision 通过 source 或 projection state 承接，避免第二写源。 |
| 复用 `accepted` 表示所有成功 | 不采用 | `StartupAdmission`、Runtime result、feedback 与 external resolution 的 owner 和证据不同。 |
| 以 `ready` 代答宿主或 Runtime | 禁止 | local presence ready 不等于 host healthy / Runtime ready。 |
| 用 stale / gap 隐藏未闭口 seam | 禁止 | stale / gap 是消费者可见的设计结果，不是待实现的默认值。 |
| 为每个状态预设物理 enum / DB 列 | 不采用 | 物理 carrier、并发、错误、版本和 retention 留给 03 / 04。 |

## 6. 上游 pending 对 Step 9 的影响

| Pending | 受影响状态 | 当前口径 |
|---|---|---|
| `L2M-UP-001` | `HostCollaborationAttemptStatus`、CP01 host posture、CP06 host-route resolution | exact feedback / submission contract 未闭口时保持 blocked / unknown / feedback-linked，不定义 host accepted / session / health 状态。 |
| `L2M-UP-002` | CP01 host handoff 前置 | image / pinned entry 不形成 member 状态；缺失只影响 host seam 的 blocked / pending surface。 |
| `L2M-UP-003` | Runtime delivery / submission / result link | mapping 未闭口时只能 blocked / pending / unknown，不建立 Runtime admission 状态。 |
| `L2M-UP-004` | material reception、publication、observation | source family / direction 未闭口时保持 blocked / gap / unknown。 |
| `L2M-UP-005` | 所有 event / committed-fact propagation | exact carrier / route 未闭口，语义 event 和 logical envelope 不等于 integration 状态。 |
| `L2M-UP-006` | `StartupAdmission` 与 presence starting 前置 | credential verification 不可证明时 admission blocked / rejected，不能进入 presence。 |
| `L2M-UP-007` | screening / rule resolution | rule source stale / conflict / unknown 只能 pending / blocked / 受控 degraded。 |
| `L2M-UP-008` | 所有 subject-bearing 状态 | 只允许 `ProjectMemberRef` 正向路径；其他主语状态 blocked。 |

## 7. 逐部分状态停审结论

| 部分 | 状态族 | 逐部分停审 | 当前结论 |
|---|---|---|---|
| CP01 Presence / Host | admission、presence、host attempt | completed / pass / stop_review | pass |
| CP02 Inbound | scope、intake、screening | completed / pass / stop_review | pass |
| CP03 Runtime Mediation | delivery、submission、result link、reception | completed / pass / stop_review | pass |
| CP04 Outbound | outbound、publication、gap | completed / pass / stop_review | pass |
| CP05 Interaction Trace | interaction gap、observation attempt | completed / pass / stop_review | pass |
| CP06 External Context Mirror | snapshot、resolution、gap | completed / pass / stop_review | pass |
| CP07 Member Read Model | projection、outlet | completed / pass / stop_review | pass |

CP01~CP07 的逐部分状态机均已停审。以下跨状态审计只复核它们之间的完整性与方向；不重开任一部分的 owner、接口或上游合同。

## 8. 跨状态一致性审计

### 8.1 34 个对象的状态归属与反查

| 组成部分 | 对象与状态归属 / 非状态说明 | 数量 | Step 7 / 8 反查结论 |
|---|---|---:|---|
| CP01 Presence / Host | `StartupAdmission`、`MemberPresence`、`HostCollaborationAttempt` 是状态主体；`HostCollaborationMaterial` immutable；`PresenceAdmissionPolicy` guard。 | 5/5 | 4 Commands、`HostFeedbackConsumer`、2 Queries 与本地 host continuation 均可回指。 |
| CP02 Inbound | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision` 是状态主体；`SubscriptionScopePolicy`、`InboundScreeningPolicy` 为 guard。 | 5/5 | 2 Commands、`InboundFactConsumer`、2 Queries；规则 source 只经 CP06 neutral resolution 读取。 |
| CP03 Runtime Mediation | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeMaterialReception` 是状态主体；`RuntimeResultLink` 为 immutable external classification link；`RuntimeMediationPolicy` 为 guard。 | 5/5 | 2 Commands、`RuntimeMaterialConsumer`、2 Queries；entry 与 result link 处理流均已单列。 |
| CP04 Outbound | `OutboundDecision`、`PublicationAttempt`、`PublicationGap` 是状态主体；`MemberOutboundMaterial` immutable；`OutboundMaterialPolicy` 为 guard。 | 5/5 | 2 Consumers、`PublicationRelayJob`、2 Queries；仅 CP03 accepted reception 进入 evaluation。 |
| CP05 Interaction Trace | `InteractionGap`、`ObservationAttempt` 是状态主体；`InteractionTraceEntry`、`ObservationMaterial` immutable；`TraceMaterialPolicy` 为 guard。 | 5/5 | 2 Consumers、`ObservationRelayJob`、3 Queries；只消费 CP01~04 committed refs。 |
| CP06 External Context Mirror | `ExternalContextResolution`、`ExternalContextGap` 是状态主体；`ExternalContextSnapshot` immutable；`MirrorResolutionPolicy` 为 guard。 | 4/4 | 2 Commands、5 owner-specific Consumers、`ExternalContextRefreshJob`、2 Queries 均已回指。 |
| CP07 Member Read Model | `MemberProjectionState` 是唯一可变状态主体；`CapabilityOutletStatus` 是 immutable `CapabilityOutletView` revision 分类；`MemberSummaryView`、`MemberDiagnosticView` immutable；`ReadProjectionPolicy` 为 guard。 | 5/5 | 2 internal Consumers、2 Jobs、3 Queries；只消费 committed refs / neutral resolutions。 |
| Total | 34 个 Step 6 正式对象都被归入状态主体、immutable revision / fact 或 policy guard；没有缺失对象，也没有新增第八部分状态 owner。 | 34/34 | pass |

### 8.2 接口、处理流与状态触发覆盖

| 类别 | CP01 | CP02 | CP03 | CP04 | CP05 | CP06 | CP07 | 总计与状态审计结论 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Command | 4 | 2 | 2 | 0 | 0 | 2 | 0 | 10；所有写迁移都有 `ActorContext`、metadata 与 idempotency 骨架，且不改变 external truth。 |
| Query | 2 | 2 | 2 | 2 | 3 | 2 | 3 | 16；全部 no-write，不触发 transition、refresh、rebuild、reconcile 或外部副作用。 |
| Consumer | 1 | 1 | 1 | 2 | 2 | 5 | 2 | 14；10 个 external 与 4 个 committed-fact Consumer 均有 source / schema / dedup / trace 分类，状态变化回指其组件流。 |
| semantic Event | 3 | 3 | 4 | 4 | 4 | 2 | 4 | 24；只从 committed local revision / projection candidate 派生，非已闭口 carrier、route 或 delivery。 |
| Operations Job | 0 | 0 | 0 | 1 | 1 | 1 | 2 | 5；只承接 local continuation、refresh 或 projection revision，未知副作用保持 fence。 |

分类总数与 Step 7 / Step 8 的 `10 / 16 / 14 / 24 / 5` 一致。每一类状态变迁都能回指 Command、Consumer、Job 或显式 local continuation；各 Query 不拥有写入例外。

### 8.3 同名 / 近义状态语义审计

| 易混淆状态 | 绑定对象与唯一语义 | 不得代答的语义 | 结论 |
|---|---|---|---|
| `accepted` | `StartupAdmission` 是本地启动受理；`InboundFactRecord` 是 body-free intake；`RuntimeResultLink` 是 immutable external result classification；`RuntimeMaterialReception` 是 safe material 承接分类。 | host acceptance、Bus delivery、Runtime run / outcome、outbound qualification。 | pass |
| `ready` / `active` / `passed` / `eligible` | `MemberPresence.ready`、`SubscriptionScopeDecision.active`、`ScreeningDecision.passed`、CP03 / CP04 各自的 `*Decision.eligible` 均按对象、输入和后续资格限定。 | host health、Governance approval、Runtime acceptance、publication / downstream success。 | pass |
| `submitted` / `feedback_linked` | host、Runtime、publication、observation各 attempt 的 local seam invocation / feedback-ref posture。 | delivered、accepted、observed、evidence、report 或 external business completion。 | pass |
| `resolved` / `gap` | CP04 / CP05 / CP06 的 `*Gap.resolved` 只关闭各自 local relation / source gap；CP06 resolution 是 purpose-specific neutral source sufficiency。 | source truth 修复、authorization、health、publication success、outlet availability。 | pass |
| `stale` / `current` / `available` | CP06 stale 绑定 neutral resolution；CP07 `current` 绑定 same-kind watermark coverage；outlet `available` 绑定 safe display refs / resolution。 | Runtime / host currentness、registry membership、invocation authorization、execution readiness。 | pass |
| `blocked` / `pending` / `unknown` / `degraded` | 每个值均携带 owner object、safe reason、source / side-effect或 scope语境；`unknown` 为 fence，`degraded` 只在显式 policy / safe surface 下可服务。 | 自动 retry、默认放行、last-known replacement、跨组件写入。 | pass |

### 8.4 迁移、历史与传播方向审计

| 审计面 | 静态复核结论 | 边界 |
|---|---|---|
| 允许迁移 | 所有正常路径均先形成 owner-local decision / fact，再进入同 owner attempt、gap、link、rebuild 或受限的下一组件资格；`accepted reception -> CP04 evaluation` 是唯一明示的 CP03 到 CP04资格链。 | 不存在跨组件直接把一个状态写成外部成功的路径。 |
| 禁止迁移 | `unknown`、`stale`、`gap`、`blocked`、`pending`、`failed`、`degraded` 不会因时间、retry、Query、默认值或配置而静默升级；attempt unknown 不能盲重放。 | 新事实必须形成 successor / revision，历史不删除、不原地覆盖。 |
| committed-fact 传播 | CP01~04 local facts 可单向进入 CP05 trace 与 CP07 projection；CP06 resolution / gap 可只影响后续 policy posture 与 CP07 projection。 | CP05 / CP07 不回写 source decision、attempt、snapshot、resolution 或 gap。 |
| event / read 传播 | semantic event 只表达候选语义；Query 只返回 body-free status / freshness / gap surface。 | 不等于 Bus carrier、outbox delivery、SDK mapping、downstream receipt 或 observed truth。 |
| projection 传播 | CP07 only drives read freshness、rebuild / reconciliation continuation 和 projection event candidate。 | current / available / diagnostic 不改变 CP01~06或任何 external owner truth。 |

### 8.5 唯一 source owner 与无反向写审计

| 事实 / source 家族 | 唯一接收或 source owner | 允许下游方向 | 禁止方向 |
|---|---|---|---|
| Governance rule update | CP06 `PolicyContextUpdateConsumer` | CP02 仅通过 `ScreeningRuleSourcePort` 读取已提交 neutral resolution。 | CP02 不接第二个 Governance Consumer，不写 Policy / approval truth。 |
| Tools / Method capability update | CP06 `CapabilityContextUpdateConsumer` | CP07 `CapabilityOutletSourceUpdateConsumer` 只消费 CP06 已提交 capability resolution / gap 与 safe refs。 | CP07 不直连 Tools / Method event，不复制 definition / registry，不授权 invocation。 |
| host / Runtime / downstream feedback | CP01、CP03、CP04、CP05 各自 owner-specific feedback / material Consumer。 | 仅形成对应 local link、classification、attempt successor或 gap。 | feedback 不重裁 source decision，不成为 host / Runtime / Bus / downstream truth。 |
| local member facts | 产生它们的 CP01~CP06 owner Command / Consumer。 | CP05 trace、CP07 projection、body-free semantic event candidate。 | Trace、Mirror、Read Model、Query 与 Job 不反向写 core / support truth。 |
| publication / observation / external source gap | CP04、CP05、CP06 各自 gap owner。 | CP07 reconcile 仅更新 projection surface。 | `GapReconciliationJob` 不关闭、supersede 或修复 source gap，不调用业务 Command。 |

### 8.6 Pending、forbidden-body 与非伪造口径审计

| 审计面 | 结论 | 当前口径 |
|---|---|---|
| `L2M-UP-001~008` | pass | exact host / image / Runtime / event / credential / policy / subject contracts仍为 pending / blocked / fail-closed；仅产生 object-bound blocked、pending、stale、gap、unknown或受控 degraded surface。 |
| forbidden body | pass | raw inbound / Runtime / model body、hidden reasoning、secret、Tool / Method definition body、provider route、complete log、evidence body均不进入状态对象、semantic event、trace、projection或 Query。 |
| dependency分类 | pass | Core shared primitive仍是唯一 compile candidate；其余状态输入保持 runtime、event、ref、adapter、fake或 persistence 边界，未伪装为 package dependency。 |
| 非伪造声明 | pass | 本审计仅比较已写设计骨架与台账；不声明实现、commit、run、测试结果、artifact、report、evidence、verdict、signoff、联调或 readiness。 |

### 8.7 跨状态审计结论与详细设计承接

| Gate | 结论 | 说明 |
|---|---|---|
| 状态唯一归属与 34/34 反查 | pass | 每个对象都明确为状态 owner、immutable / derived revision 或 policy guard；没有全仓 mega lifecycle。 |
| Step 7 / 8 触发覆盖 | pass | `10 / 16 / 14 / 24 / 5` 与全部状态附录回指一致。 |
| 同名状态、迁移与历史语义 | pass | 成功、attempt、gap、resolution、freshness和optional outlet未压平；successor / append-only规则一致。 |
| source owner、传播与无反向写 | pass | CP06 的 Governance / capability source owner唯一，CP05 / CP07单向消费，Query无写。 |
| pending、forbidden-body与外部truth边界 | pass | 未闭口合同继续显式保守，外部状态未被本仓状态代答。 |
| Step 10 进入条件 | pass | 状态口径足以让 Step 10 只讨论会改变主线理解的异常与边界，不需重开状态 owner。 |

Step 9 结论为 `completed / pass / stop_review`。下一允许动作是读取 Step 10 的 SOP 输入并创建 `02_hld_step_10_exceptions_boundaries.md`；不得提前创建 Step 11。

## 9. Step 9 回填草稿（待 Step 14 装配）

正式 `02-概要设计.md` §9 只汇总：

1. 七组状态族和每组状态 owner。
2. 各对象的概要状态定义、正常主线资格和关键迁移。
3. 允许 / 禁止迁移红线。
4. 状态传播关系与 Query / Consumer / Job 的影响边界。
5. `L2M-UP-001~008` 对状态激活的 blocked / pending 影响。

详细 enum variant、初始 / 终态、expected revision、并发冲突、错误映射、retry / retention、物理 carrier 和测试矩阵留给 `03-详细设计.md` 与后续文档。

## 10. 当前门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 全局状态族与 owner 边界 | pass | 七部分状态族已从 Step 6 对象和 Step 8 流抽取，外部 truth 明确排除。 |
| CP01 状态附录 | completed / pass / stop_review | 已完成 admission、presence、host attempt 状态与传播审计。 |
| CP02 状态附录 | completed / pass / stop_review | 已完成 scope、intake、screening 状态与传播审计。 |
| CP03 状态附录 | completed / pass / stop_review | 已完成 delivery、submission、result link、reception 状态与传播审计。 |
| CP04 状态附录 | completed / pass / stop_review | 已完成 outbound、publication、gap 状态与传播审计。 |
| CP05 状态附录 | completed / pass / stop_review | 已完成 interaction gap、observation attempt 状态与传播审计。 |
| CP06 状态附录 | completed / pass / stop_review | 已完成 snapshot、resolution、gap 状态与传播审计。 |
| CP07 状态附录 | completed / pass / stop_review | 已完成 projection、outlet 状态与传播审计。 |
| Step 9 跨状态总审计 | completed / pass / stop_review | 34/34 对象、`10 / 16 / 14 / 24 / 5` 接口分类、唯一 source owner、无反向写、pending与forbidden-body审计通过。 |
| Step 10 | allowed | Step 9 已完成；仅允许读取 Step 10 输入并创建异常与边界场景中间产物。 |

当前允许动作：读取 Step 10 对应 SOP输入，更新三层台账到 `Step 10 / exceptions_boundaries`，并创建 `02_hld_step_10_exceptions_boundaries.md`；未经 Step 10 通过不得进入 Step 11。
