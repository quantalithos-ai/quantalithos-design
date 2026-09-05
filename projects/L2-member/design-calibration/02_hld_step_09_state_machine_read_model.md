# Step 9 附录 CP07. Member Read Model 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP07 的 `MemberSummaryView`、`CapabilityOutletView`、`MemberProjectionState`、`MemberDiagnosticView`、`ReadProjectionPolicy`
> 对应接口 / 流: Step 7 CP07 与 Step 8 CP07
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 状态、输入与模块门禁

| 项目 | 内容 |
|---|---|
| 当前模块 | CP07 Member Read Model 的 projection freshness / rebuild posture 与 optional capability outlet 分类的状态归属、迁移和传播。 |
| 输入 | Step 6 CP07 的五个对象骨架、Step 7 CP07 的三类 Query、两个 Consumer、两个 Job 与只读 Port、Step 8 CP07 的 source-update / rebuild / reconcile / Query 流，以及 Step 9 主控统一状态规则。 |
| 结构化输出 | 两个状态定义表、两张 ASCII 图、允许 / 禁止迁移、对象反查、source-owner 审计与 pending 审计。 |
| gate_status | pass |
| gate_reason | projection state、immutable view revision、optional outlet 分类、committed-source-only rebuild、unique CP06 capability source owner 与 no-write Query 边界已收稳。 |
| next_allowed_action | 更新 Step 9 主控、概要 flow 与项目台账至 `state_machines:cross_component_audit`；随后才允许执行 Step 9 跨状态一致性审计。 |
| source_files | `02_hld_step_06_key_objects_read_model.md`;`02_hld_step_07_interfaces_read_model.md`;`02_hld_step_08_flows_read_model.md`;`02_hld_step_09_state_machine.md` |

## 2. SOP 问题回答与当前材料诊断

### 2.1 本部分哪些状态影响主线

CP07 不建立与 CP01~06 竞争的 `MemberLifecycleState`。它有一个正式可迁移状态主体：按 `summary`、`capability_outlet`、`diagnostic` projection kind 分别持有的 `MemberProjectionStatus`。`CapabilityOutletStatus` 是 immutable `CapabilityOutletView` revision 中的显式来源充分性分类；它必须随 successor view 表达，不能被误写成 Tools registry、authorization 或 invocation 的生命周期。

`MemberSummaryView`、`MemberDiagnosticView` 与每个 `CapabilityOutletView` revision 均不可变、可重建、可追溯；`ReadProjectionPolicy` 是 guard，均不拥有可变业务生命周期。summary 是必需 read surface；outlet 与 diagnostic 是可裁剪增强面，其 disabled / not_available 不得阻断 CP01~06 核心写路径或 summary 的独立语义。

| 问题 | 收敛回答 |
|---|---|
| 哪些状态属于 CP07 | 仅某一 projection kind 的 freshness / rebuildability / service posture，以及 capability outlet revision 的 activation / source-sufficiency 分类。 |
| 每个状态是否能进入正常主线 | `MemberProjectionState.current` 仅在完整覆盖可证明 target watermark 时可作为该 projection kind 的 current surface；outlet `available` 仅可作为安全展示面，不授权任何动作。 |
| 哪些入口触发迁移 | `MemberProjectionUpdateConsumer` 只标 stale / target watermark；`CapabilityOutletSourceUpdateConsumer` 只承接 CP06 已提交 capability resolution / gap；两个 Job 形成 projection successor；Query 无写入。 |
| 是否有同名状态冲突 | `current` 不等于 Runtime current / host healthy；`available` 不等于 registry member、authorized、invocable 或 executable；`failed` 不是 CP01~06 source failure；`gap` 不是 CP04/05/06 source gap 已被关闭。 |
| 状态如何传播 | CP07 只向 body-free Query、projection event candidate、rebuild / reconciliation continuation 传播；它不反向写任何 local core/support truth 或外部 owner truth。 |

### 2.2 当前材料诊断

| 诊断项 | 风险 | 收敛处理 |
|---|---|---|
| 将 projection `current` 由最近一次 rebuild 或 last-known view 推断 | source 已前进、来源不完整或 body gate 失败仍会被伪装为 current | `current` 必须证明 applied watermark 覆盖 target watermark，且 required committed refs / neutral resolutions 完整。 |
| 将 outlet `available` 当 capability registry / authorization | member 会越权持有 Tools / Method 或 Governance truth | available 只说明 selected safe refs 与 CP06 resolution 对展示面充分；调用仍走 Runtime -> Tools 正式链。 |
| 将 CP07 Consumer 做成直连 Tools / Method 或 generic projection hub | 会绕过 CP06 owner-specific anti-corruption seam，并混淆所有 source 语义 | Tools / Method source update 只由 CP06 `CapabilityContextUpdateConsumer` 接收；CP07 只读已提交 capability resolution / gap。 |
| rebuild 或 reconcile 修复 source gap / source truth | 派生投影取得第二写源，历史与 owner 边界失真 | Job 只创建 view / state successor，或更新 projection surface；CP04/05/06 source gap 只能由原 owner flow 关闭。 |
| Query 隐式安排 rebuild、刷新或切换 outlet | 读操作造成副作用，且 stale / gap 被隐藏 | 三类 Query 均返回 explicit not-ready / stale / degraded / unknown / not_available / gap surface，不作写入。 |

## 3. 设计取舍与改动前后对比

| 议题 | 未采用 / 改前风险 | 采用的状态设计 | 原因 |
|---|---|---|---|
| 全仓 read-model 单一状态 | summary、outlet、diagnostic 的 activation / freshness 被压平，任选一个成功会代答另一个 | `MemberProjectionState` 以 projection kind 独立维护；各 view revision 独立不可变 | 来源要求、可选性和消费者语义不同。 |
| outlet 自建 registry status | 展示面会吞并 capability definition、provider、authorization 与 execution truth | `CapabilityOutletStatus` 只标 ref-derived projection sufficiency | 保持 CP06、Tools 与 Runtime 的唯一 owner。 |
| Consumer 直接重建 view | event body、重复投递或不完整 source 可能形成错误内容 | Consumer 只标 stale / target / outlet marker；rebuild 是独立 Job | 将接收、重建、query 与 source truth 分层。 |
| failed / unknown 自动恢复 | 本地错误或不可证明 side effect 会被时间 / retry / Query 掩盖 | 仅新的 committed-source rebuild / explicit activation basis 可形成 successor | 保持 fail-closed 与可追溯 history。 |
| reconcile 关闭 publication / trace / external gap | projection 会冒充 source owner 已完成修复 | reconcile 只更新 projection 所见 gap refs 与 freshness | 缺口解释和 source truth 不能倒置。 |

## 4. 状态归属与定义

### 4.1 `MemberProjectionState` / `MemberProjectionStatus`

每个 `ProjectMemberRef + MemberProjectionKind` 都有独立的 projection state revision。state 的 `source_watermark` 表示已应用的 committed local fact / neutral resolution 位置；`target_watermark` 表示已知应追赶的位置。不同 kind 不共享 current 证明：summary 的 current 不自动使 optional outlet 或 diagnostic current，反之亦然。

| 状态 | 含义 | 是否可进入该 projection 的正常 read 主线 | 触发入口 / 流 |
|---|---|---|---|
| `current` | required committed sources 与 neutral resolutions 已被完整、可验证地应用，且 `source_watermark` 覆盖 `target_watermark`。 | 是；仅对同一 projection kind 的一致性提示有效。 | `MemberProjectionRebuildJob` 成功完成，或初始化时 initial watermark 已可证明完整。 |
| `stale` | source 已前进、target watermark 高于 applied watermark，或新 committed source 使现有 revision 不再可声明 current。 | 受限；仅在 Query consistency hint 允许时以显式 stale surface 返回。 | `MemberProjectionUpdateConsumer`；`CapabilityOutletSourceUpdateConsumer` 的受影响 projection marker；reconcile 的落后判定。 |
| `rebuilding` | 已开始从 committed refs / resolutions 形成新 revision，旧 view 仍不具备 current 声明。 | 否；Query 返回 rebuilding / prior-stale / not-ready posture，不得承诺新内容。 | `MemberProjectionRebuildJob` 调用 `start_rebuild(...)`。 |
| `degraded` | 已知部分 source / resolution 缺失、受限或存在可安全暴露的 gap，但可形成有限 body-free projection surface。 | 受限；必须暴露 limiting reason、watermark 与 gap refs。 | rebuild / reconciliation 对已提交不足 source 形成 successor。 |
| `failed` | 最近一次 local rebuild / store continuation 未形成可提交 projection revision，或其结果不能证明完整性。 | 否；返回 unavailable / failed posture，不得伪装 current。 | `MemberProjectionRebuildJob` 调用 `mark_failed(...)`。 |
| `disabled` | 该 optional projection kind 明确未激活 / 被裁剪；不是 source 不存在、registry 不存在或 authorization denied。 | 否；返回 explicit disabled / not_available surface。 | 初始化或受控 activation boundary 的 successor；不得由 Query 隐式切换。 |
| `unknown` | source completeness、watermark、rebuild side effect 或 state-store result无法证明。 | 否；保留 fence 与 safe reason，不从 last-known view 推断 current。 | Consumer / Job 遇到可归因但不可证明的 source / side effect。 |

`current` 是严格的 projection completeness 结论，不代表 member presence、host lifecycle、Runtime admission / run / outcome、Bus delivery、Governance authorization、Tools availability、Conversation truth 或 observation backend 状态。`degraded` 可以有安全摘要，但不可以隐藏 source insufficiency；`failed` 与 `unknown` 都必须保留 explicit successor / recovery basis。

### 4.2 `CapabilityOutletView` / `CapabilityOutletStatus`

`CapabilityOutletView` revision 由 `MemberProjectionState(projection_kind=capability_outlet)` 的 freshness 承接；其 `activation_status` 只对该 immutable revision 分类。它不是可变 registry entry，也不拥有独立的 external action lifecycle。

| 状态 | 含义 | 是否可进入 capability outlet 的展示主线 | 触发入口 / 流 |
|---|---|---|---|
| `available` | outlet 已激活，所有展示项的 Tool contract / binding / method safe refs 与 matching CP06 committed resolution、scope、freshness 和 watermark 均足够。 | 是；只允许 body-free capability display。 | `MemberProjectionRebuildJob` 投影成功；前置是 CP06 已提交 capability resolution。 |
| `not_available` | outlet 被明确裁剪、未激活，或本轮安全展示不提供该 optional projection。 | 是，作为显式 absence surface；不影响 summary。 | 初始化 / explicit activation posture / rebuild 形成 successor。 |
| `stale` | outlet source ref 或 matching resolution 已落后于可证明 target watermark。 | 受限；必须暴露 stale，不可冒充 available。 | `CapabilityOutletSourceUpdateConsumer` 标记，或 rebuild 发现 source 落后。 |
| `gap` | required safe ref、binding、method mapping、CP06 capability resolution 或 exact consumer contract 未闭口 / 不充分。 | 否；只能返回 gap / not-ready surface。 | `CapabilityOutletSourceUpdateConsumer` 消费 CP06 committed gap，或 rebuild / reconcile 发现缺口。 |

`available` 永远不等于 capability registry membership、Governance authorization、provider route reachable、tool invocation permission、tool execution readiness 或 execution result。`not_available` 也不表达拒绝、失效或外部 owner 的负面结论；它只表达 optional member projection 没有提供 outlet。

### 4.3 不拥有独立可变状态的 CP07 对象

| 对象 | 状态归属 | 说明 |
|---|---|---|
| `MemberSummaryView` | 对应 summary `MemberProjectionState` | 每个 view revision 不可变；新的 committed source 通过 state stale / rebuilding 与 successor summary 表达。 |
| `MemberDiagnosticView` | 对应 diagnostic `MemberProjectionState` | optional view；缺失、disabled 或 degraded 不影响 summary / core flow。 |
| `CapabilityOutletView` revision | 对应 outlet `MemberProjectionState` + revision 内 `CapabilityOutletStatus` | revision 本身不原地迁移；状态分类变化创建 successor view。 |
| `ReadProjectionPolicy` | 无业务生命周期 | 只作为 committed-source-only、body-free、visibility、no-write 与 non-authorizing guard。 |

## 5. 状态流转图

#### CP07 Projection 状态流转图

```text
Committed CP01~06 fact / neutral resolution
            │ MemberProjectionUpdateConsumer
            ▼
MemberProjectionState
  current ──────────────> stale ───────────────> rebuilding
      │                      │                       │
      │                      ├──────────────> degraded │
      │                      └──────────────> unknown  │
      │                                                  │ complete coverage
      └──────────────────────────────────────────────────┤
                                                         ▼
                                                       current
                                                         │
                   local rebuild / store failure ───────┼──> failed
                   source / side-effect unprovable ─────┴──> unknown

optional projection: <new> -> disabled -- explicit activation basis --> rebuilding
```

关键说明：

- `current` 只允许出现在 complete rebuild / provable initialization 之后；从 `failed`、`unknown`、`degraded` 或 `disabled` 不能通过时间、retry、Query 或默认值自动回到 current。
- `stale` 表示读取面落后于可证明 target watermark；Consumer 只产生该 marker，不在接收 event 时重建或修复 source truth。
- `degraded` 是可安全服务有限 projection 的状态，不是把 source gap、stale 或 unknown 静默缩小；每个 kind 保持独立的 watermark 与 safe reason。
- 图不表达 projection store schema、job scheduler、lease、batch、retry 或实际 job result；这些留给后续详细设计与实施计划。

#### CP07 Outlet 与状态传播关系图

```text
CP06 CapabilityContextUpdateConsumer
            │ committed capability resolution / gap + safe refs
            ▼
CapabilityOutletSourceUpdateConsumer
            │
            ├─ source sufficient but revision behind -> outlet stale marker
            ├─ source / mapping insufficient        -> outlet gap marker
            └─ optional outlet disabled             -> not_available marker
            │
            ▼
MemberProjectionRebuildJob
            │
            ├─ matching refs + resolution -> CapabilityOutletView.available
            └─ no authorized display       -> not_available / stale / gap successor
            │
            ▼
MemberCapabilityOutletChanged candidate / GetCapabilityOutlet
            -> body-free projection surface only
```

关键说明：

- Tools / Method source event 不进入 CP07；唯一 source update owner 是 CP06 `CapabilityContextUpdateConsumer`，CP07 只消费其已提交的 neutral resolution / gap 与 safe refs。
- `MemberProjectionUpdateConsumer` 对 CP01~06 committed facts / resolutions 只写 projection stale / target watermark；它不向 CP01~06 反写任何 decision、attempt、gap、snapshot 或 resolution。
- `GapReconciliationJob` 只能改变 projection 所见 gap refs / freshness；它不能关闭 CP04 `PublicationGap`、CP05 `InteractionGap` 或 CP06 `ExternalContextGap`。
- event candidate / Query surface 不等于 exact SDK mapping、Bus carrier、delivery、authorization、invocation 或 execution；`L2M-UP-005` 仍是 pending。

## 6. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `MemberProjectionState` | `<new> -> current` | projection 已激活，initial watermark 与 required committed sources 的完整覆盖可证明 | 创建对应 kind 的 current initial state；不得用空 / last-known view 猜测。 |
| `MemberProjectionState` | `<new> -> disabled` | optional outlet / diagnostic projection 明确未激活或裁剪 | 创建 disabled state；不影响 summary 或 CP01~06。 |
| `MemberProjectionState` | `current / stale / degraded -> stale` | `MemberProjectionUpdateConsumer` 确认 source owner committed fact / resolution 使 target watermark 前进 | 追加 stale / target successor；不重建 view、不改 source truth。 |
| `MemberProjectionState` | `current / stale / degraded / failed / unknown -> rebuilding` | `MemberProjectionRebuildJob` 获得可验证 target watermark 与 committed-source read basis | 记录 rebuild target；旧 revision 仍是 stale / not-ready surface。 |
| `MemberProjectionState` | `disabled -> rebuilding` | optional projection 有 explicit activation basis，且 Job 已建立 committed-source rebuild target | 形成新的 activation / rebuild successor；不由 Query 或 external source event 隐式激活。 |
| `MemberProjectionState` | `rebuilding -> current` | `complete_rebuild(...)` 验证 required source coverage、body-free policy、scope 与 applied watermark 覆盖 target | 提交新的 view revision / current state；只对该 kind 生效。 |
| `MemberProjectionState` | `rebuilding / stale / degraded -> degraded` | source / resolution 已知不完整但可以安全形成有限 projection surface | 追加 degraded state / safe reason / gap refs；不得将其标为 current。 |
| `MemberProjectionState` | `rebuilding -> failed` | local rebuild / projection-store continuation 未能形成可证明提交 | `mark_failed(...)` 形成 state successor；不推断 CP01~06 或 external source 错误。 |
| `MemberProjectionState` | `stale / rebuilding / degraded / failed -> unknown` | watermark、source completeness、rebuild side effect 或 store result不可证明 | 追加 unknown fence；禁止利用旧 view 默认恢复。 |
| `MemberProjectionState` | `current / stale / rebuilding / degraded / failed / unknown -> disabled` | 仅 optional kind 收到 explicit deactivation / pruning basis | 创建 disabled successor；不删除 history、不将 source truth 解释为 removed。 |
| `CapabilityOutletView` | `<new> -> available` | outlet active，CP06 committed capability resolution、safe refs、scope、freshness 与 target watermark 全部匹配 | 创建 immutable available revision；不授予 invocation。 |
| `CapabilityOutletView` | `<new> -> not_available` | outlet 未激活 / 被裁剪或 optional display 不提供 | 创建 immutable absence revision；不等于 denied / registry missing。 |
| `CapabilityOutletView` | `available / not_available / stale / gap -> stale` | 已提交 capability resolution / ref 的 target watermark 前进但 outlet revision 落后 | 创建 stale successor / marker；不直连 Tools / Method source。 |
| `CapabilityOutletView` | `available / not_available / stale / gap -> gap` | CP06 committed capability gap、ref / mapping / scope / exact contract 不充分 | 创建 gap successor；不伪造 registry、authorization 或 safe ref。 |
| `CapabilityOutletView` | `stale / gap / not_available -> available` | 新 rebuild 使用 matching CP06 committed resolution / safe refs，且 active / coverage 均成立 | 创建新的 available revision；旧 revision 保留 history。 |

## 7. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| `failed`、`unknown`、`degraded` 或 `stale` 因时间、retry、Query、默认值或 last-known view 自动变 `current` | current 需要新的 complete coverage proof 与已提交 successor。 |
| `MemberProjectionUpdateConsumer` 直接创建 current view、执行 rebuild、修复 source fact / resolution 或关闭 source gap | Consumer 只标 stale / target watermark，projection 与 source owner 必须分离。 |
| CP07 直连 Tools / Method source event，或以 `ToolSafeViewReadPort` 伪装 compile / registry dependency | CP06 `CapabilityContextUpdateConsumer` 是唯一 capability source update owner；Port 只读 safe refs。 |
| `CapabilityOutletView.available` 自动授权 tool invocation、provider route、execution 或 Governance approval | outlet 是 member-visible projection，不是 authorization / registry / execution gateway。 |
| `CapabilityOutletView.gap` / `not_available` 被解释为 Tools registry 已删除、host 不健康或 source owner 的业务结论 | outlet 分类只表达 optional display 的 source sufficiency / activation。 |
| `GapReconciliationJob` 将 CP04 / CP05 / CP06 source gap 标 resolved / superseded，或触发 `ResolveExternalContext`、publication / observation relay | CP07 只能更新 read projection surface，不能取得 source gap owner 权。 |
| summary / diagnostic / outlet revision 被 Query、feedback、source event 或 Job 原地改写 | view revision immutable；变化必须以新的 rebuild / successor revision 表达。 |
| Query 创建 projection state、激活 outlet、刷新 source、安排 Job 或隐藏 stale / gap / unknown | Query 是 no-write read surface。 |
| CP07 current / available / diagnostic 反向改变 CP01~06 decision、attempt、trace、gap、snapshot、resolution 或任何外部 truth | projection 是终端派生面，不拥有 core / support / external write authority。 |

## 8. 状态触发覆盖、对象反查与传播审计

| 状态主体 / 非状态对象 | Step 7 触发接口 | Step 8 处理流 | 传播 / Query 承接 | 审计结论 |
|---|---|---|---|---|
| `MemberProjectionState` | `MemberProjectionUpdateConsumer`;`MemberProjectionRebuildJob`;`GapReconciliationJob` | CP07 §2 / §4 / §5 | `MemberProjectionStateChanged`;三类 Query | pass；唯一 projection freshness / rebuild owner。 |
| `CapabilityOutletStatus` / `CapabilityOutletView` | `CapabilityOutletSourceUpdateConsumer`;`MemberProjectionRebuildJob` | CP07 §3 / §4 | `MemberCapabilityOutletChanged`;`GetCapabilityOutlet` | pass；revision immutable，available non-authorizing。 |
| `MemberSummaryView` | `MemberProjectionRebuildJob` | CP07 §4 | `MemberSummaryProjectionChanged`;`GetMemberSummary` | pass；summary revision 无独立可变状态。 |
| `MemberDiagnosticView` | `MemberProjectionRebuildJob` | CP07 §4 | `MemberDiagnosticViewChanged`;`GetMemberDiagnostics` | pass；optional / body-free，无独立可变状态。 |
| `ReadProjectionPolicy` | Consumer / Job / Query guard | CP07 §2~§6 | 无独立 lifecycle / event | pass；只约束 committed-source、visibility、freshness 与 no-write。 |

### 8.1 source owner 与无反向写审计

| source / change 类型 | 唯一允许的接收 / owner | CP07 可做的事 | CP07 不可做的事 |
|---|---|---|---|
| CP01~05 local committed fact | `MemberProjectionUpdateConsumer` | 标记受影响 projection stale / target watermark | 改写 source decision、presence、attempt、trace或 gap。 |
| CP06 general committed resolution / gap | `MemberProjectionUpdateConsumer` | 标记 projection stale / target watermark | 重算或覆盖 CP06 resolution / gap。 |
| Tools / Method capability source update | CP06 `CapabilityContextUpdateConsumer`，随后 `CapabilityOutletSourceUpdateConsumer` | 消费 CP06 已提交 capability resolution / gap 与 safe refs，形成 outlet marker / successor | 直连 source event、复制 definition / registry、授权 invocation。 |
| projection rebuild / local projection issue | `MemberProjectionRebuildJob` / `GapReconciliationJob` | 新 view / state revision、projection gap surface | 修改 source truth、关闭 CP04/05/06 gap、调用业务 Command。 |
| read demand / downstream consumer | 三类 Query | 读取 body-free surface、显式 freshness | 触发 refresh、rebuild、activation、resolution或外部副作用。 |

## 9. 待确认事项与 CP07 停审

| 待确认项 | 当前状态 | 对 CP07 的影响与处理 |
|---|---|---|
| `L2M-UP-002` image / pinned entry consumer contract | pending / blocked | 不把 image release / host assembly 写入 projection state；缺口只可经已提交 source / gap 形成 not-ready posture。 |
| `L2M-UP-005` member event family、carrier、SDK mapping | pending / blocked | projection change 仅为 semantic event candidate；不声明 carrier、delivery、SDK availability 或 integration readiness。 |
| capability safe-view ref、binding、method definition 的 exact shape | pending / blocked | 仅使用 typed safe refs / neutral resolution 占位；source 不充分时 outlet stale / gap / not_available。 |
| projection activation、rebuild scheduling、storage / retention 与 conflict strategy | deferred | 当前只定义 explicit activation basis、watermark、successor与 no-write边界；实现契约留 03 / 04 / 07。 |

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | projection state 是唯一可变主体；outlet status 是 immutable revision 分类；其余 views / policy 未被误升格。 |
| Step 7 / 8 触发覆盖 | pass | 两个 Consumer、两个 Job、三个 Query、read ports 与 projection event candidate 可反查。 |
| allowed / forbidden 清楚 | pass | watermark coverage、rebuild、degraded / failed / unknown fence、optional activation与 outlet non-authorizing已明确。 |
| 同名 / 近义状态未压平 | pass | current / available / disabled / gap 均绑定对象和 scope，不代答 Runtime、host、registry、authorization或 source gap。 |
| 状态传播不过度 | pass | 只向 read surface、projection event candidate与 job continuation传播；无 source / external 反向写。 |
| forbidden body 边界 | pass | raw body、definition body、provider route、secret、hidden reasoning、complete log、evidence / verdict均不进入 projection state、view、event或 Query。 |
| pending 诚实性 | pass | `L2M-UP-002/005`、safe-view exact contract与调度 / storage契约保持 pending / blocked / deferred，不伪造 integration或 readiness。 |
| 未下沉到详细设计 | pass | 未定义 store schema、SQL、枚举实现、job scheduler、lease、retry、real run、测试结果、artifact或 evidence。 |

CP07 结论为 `completed / pass / stop_review`。下一允许动作是把七个组成部分的状态附录回填为 completed，并执行 Step 9 跨状态一致性审计；通过前不得创建 Step 10。
