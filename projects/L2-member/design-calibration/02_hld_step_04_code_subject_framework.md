# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-08-23
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标与边界

把正式 01 的 7 个限界上下文转译为后续可落码的代码主体骨架,同时把“业务主要组成部分”和“Inbound / Application / Domain / Ports / Persistence / Projection / Handoff”等实现分层分开。本步允许点名 service、policy、record、view、port 和 job 骨架,但对象正式化由 Step 6 完成,接口分类由 Step 7 完成。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 目标 / 深度 | 只形成 language-neutral、transport-neutral 主体骨架 |
| Step 3 `HLD-C-L2M-001~020` | 约束主体、owner、body、history、projection、依赖与 pending |
| 正式 01 §6 | `BC-L2M-01~07` 与统一语言 |
| 正式 01 §7 | sync / async / state / background / read / storage 逻辑承载责任 |
| 正式 01 §8 | 五个架构责任层和 inward dependency |
| 正式 01 §9~§10 | 数据 owner、一致性与通信类型 |

## 3. SOP 问题回答

### 3.1 七个架构上下文分别落到哪些代码主体骨架

| 架构上下文 | Application / domain 主体骨架 | Boundary / carrier 主体骨架 |
|---|---|---|
| `BC-L2M-01` Presence and Host Collaboration | `PresenceApplicationService`、`HostCollaborationService`、presence / admission / host-attempt objects、`PresenceAdmissionPolicy` | `PresenceCommandApi`、`HostFeedbackConsumer`、subject / identity / credential resolver ports、`HostCollaborationPort`、presence truth store |
| `BC-L2M-02` Inbound Boundary | `InboundBoundaryService`、`SubscriptionScopeService`、scope / fact / screening / rule-snapshot objects、`InboundScreeningPolicy` | `InboundFactConsumer`、`ScreeningRuleSourceConsumer`、Bus intake port、rule source port、inbound truth store |
| `BC-L2M-03` Runtime Mediation | `RuntimeMediationService`、delivery / submission / reception objects、`RuntimeMediationPolicy` | `RuntimeDeliveryCommandApi`、`RuntimeMaterialConsumer`、`RuntimeEntryPort`、`RuntimeMaterialSourcePort`、mediation truth store |
| `BC-L2M-04` Outbound Boundary | `OutboundBoundaryService`、outbound decision / material / attempt / gap objects、`OutboundMaterialPolicy` | `DeliveryFeedbackConsumer`、`PublicationRelayJob`、`EventPublicationPort`、`DeliveryFeedbackSourcePort`、outbound truth store |
| `BC-L2M-05` Interaction Trace | `InteractionTraceService`、trace / observation material / attempt / gap objects、`TraceMaterialPolicy` | `InteractionTraceQueryApi`、`ObservationRelayJob`、`ObservationHandoffPort`、trace truth store |
| `BC-L2M-06` External Context Mirror | `ExternalContextMirrorService`、snapshot / resolution / gap objects、`MirrorResolutionPolicy` | source update consumers、`ExternalContextRefreshJob`、owner-specific resolver ports、mirror support store |
| `BC-L2M-07` Member Read Model | `MemberReadModelService`、summary / outlet / diagnostic / projection-state objects、`ReadProjectionPolicy` | `MemberQueryApi`、`MemberProjectionRebuildJob`、`GapReconciliationJob`、projection store |

### 3.2 哪些主体属于 Inbound / Operations 与 Application Services

| 实现类别 | 主体 | 上限 |
|---|---|---|
| Inbound Command / Query | `PresenceCommandApi`、`RuntimeDeliveryCommandApi`、`InteractionTraceQueryApi`、`MemberQueryApi` | 解析 language-neutral input / query context,不直接决定或写 store |
| Inbound Consumer | `HostFeedbackConsumer`、`InboundFactConsumer`、`ScreeningRuleSourceConsumer`、`RuntimeMaterialConsumer`、`DeliveryFeedbackConsumer`、external source update consumers | 校验 envelope / source / duplicate 后交 application,不覆盖 core truth |
| Operations | `PublicationRelayJob`、`ObservationRelayJob`、`ExternalContextRefreshJob`、`MemberProjectionRebuildJob`、`GapReconciliationJob` | 只基于 committed fact 继续 handoff / refresh / rebuild / reconcile,不创造源决定 |
| Application Services | Presence、Host Collaboration、Subscription Scope、Inbound Boundary、Runtime Mediation、Outbound Boundary、Interaction Trace、External Context Mirror、Member Read Model services | 编排 idempotency、domain rule、store / port、local commit / external handoff,不替代 domain invariant |

### 3.3 哪些属于 Domain,哪些属于 Ports / Persistence / Projection / Handoff

| 分层 | 主体类别 | 判断口径 |
|---|---|---|
| Domain truth / state / record | presence、scope、screening、delivery / submission / reception、outbound、attempt / gap、trace / observation | 只表达 member local truth / support truth,不得复制 external truth |
| Domain policy / guard | admission、screening、mediation、outbound material、trace material、mirror resolution、read projection policies | 只消费已验证 inputs / snapshots,不直接读 transport 或 runtime config |
| External ports | subject / identity / credential / host / Bus / Governance / Runtime / Tools / Method / Conversation / Observability source or handoff ports | 本仓 inward contract;source-specific adapter 在外侧实现 |
| Persistence ports | presence / inbound / mediation / outbound / trace / mirror stores | 保存本仓 truth / support truth;具体 DB、transaction、schema 后移 |
| Projection | summary / outlet / diagnostic / explanation views 与 projection state | 可重建、无写权、freshness / gap 可见 |
| Handoff | host request / signal / report、event publication、observation material 的 local attempt / relay trigger | 只记录本地形成 / 提交;不声明 accepted / delivery / observed |

### 3.4 哪些名称必须先点名

必须在概要层稳定以下主语:

- 7 个业务主要组成部分候选,名称与架构 BC 对齐。
- 9 个 application service 主语:`PresenceApplicationService`、`HostCollaborationService`、`SubscriptionScopeService`、`InboundBoundaryService`、`RuntimeMediationService`、`OutboundBoundaryService`、`InteractionTraceService`、`ExternalContextMirrorService`、`MemberReadModelService`。
- 关键入口与 continuation:`PresenceCommandApi`、`RuntimeDeliveryCommandApi`、`InboundFactConsumer`、`RuntimeMaterialConsumer`、`DeliveryFeedbackConsumer`、`MemberQueryApi`、5 类 Operations Job。
- 关键 policy / guard、truth store、projection store 和 external ports 的职责类别。
- Step 6 对象候选名可在映射中出现,但最终对象集合、字段和函数必须由 Step 5 candidate pool 与 Step 6 筛选后确认。

### 3.5 哪些内容不应在本步展开

源码目录、crate / package、文件名、trait / struct 完整定义、handler framework、HTTP / gRPC / UDS、CloudEvent type / topic / payload、DB / queue / scheduler、repository method、transaction / outbox carrier、配置键、deployment / process topology 均不进入本 Step。

## 4. 架构模块到代码主体映射图

#### 架构模块到代码主体映射图

```text
L2-member
|
+-- 1. Presence and Host Collaboration
|   +-- PresenceCommandApi / PresenceApplicationService
|   +-- HostCollaborationService / HostFeedbackConsumer
|   +-- presence, admission, host-attempt domain subjects
|   +-- subject / identity / credential / host ports
|
+-- 2. Inbound Boundary
|   +-- InboundFactConsumer / ScreeningRuleSourceConsumer
|   +-- SubscriptionScopeService / InboundBoundaryService
|   +-- scope, fact, screening, rule-snapshot domain subjects
|   +-- Bus intake / rule-source ports
|
+-- 3. Runtime Mediation
|   +-- RuntimeDeliveryCommandApi / RuntimeMaterialConsumer
|   +-- RuntimeMediationService
|   +-- delivery, submission, reception domain subjects
|   +-- Runtime entry / committed-material ports
|
+-- 4. Outbound Boundary
|   +-- OutboundBoundaryService / DeliveryFeedbackConsumer
|   +-- PublicationRelayJob
|   +-- outbound, safe-material, attempt, gap domain subjects
|   +-- event publication / delivery-feedback ports
|
+-- 5. Interaction Trace
|   +-- InteractionTraceService / InteractionTraceQueryApi
|   +-- ObservationRelayJob
|   +-- trace, observation-material, attempt, gap subjects
|   +-- observation handoff port
|
+-- 6. External Context Mirror
|   +-- ExternalContextMirrorService / source update consumers
|   +-- ExternalContextRefreshJob
|   +-- snapshot, resolution, mirror-gap support subjects
|   +-- owner-specific resolver ports
|
+-- 7. Member Read Model
    +-- MemberReadModelService / MemberQueryApi
    +-- MemberProjectionRebuildJob / GapReconciliationJob
    +-- summary, capability-outlet, diagnostics, projection state
    +-- read projection store
```

关键说明:

- 图从正式 7 BC 映射到代码主体骨架,不表示源码目录、物理 process、部署单元或固定调用顺序。
- `Member truth core` 是 1~5 共同遵守的 owner / body / history invariant,不是第八个组成部分或共享大聚合。
- External Context Mirror 只承载 neutral resolution / freshness / gap;Member Read Model 只承载可重建 view,二者都无 core write authority。
- Runtime、host、Bus、Governance、Work、Identity、Tools / Method 与 downstream 只通过 inward ports 出现,不成为本仓内部模型。

## 5. 实现分层视图

#### 实现分层视图

```text
External command / query / event / feedback / scheduled trigger
                              |
                              v
+------------------------------------------------------------------+
| Inbound / Operations                                             |
| APIs / Consumers / Relay, Refresh, Rebuild, Reconcile Jobs       |
+------------------------------+-----------------------------------+
                               |
                               v
+------------------------------------------------------------------+
| Application Services                                             |
| Presence / Host / Scope / Inbound / Runtime / Outbound / Trace / |
| Mirror / Read Model coordination                                 |
+------------------------------+-----------------------------------+
                               |
                               v
+------------------------------------------------------------------+
| Domain Model and Policies                                        |
| member local truth / support truth / guards / append history     |
+------------------+---------------------------+-------------------+
                   |                           |
                   v                           v
+--------------------------------+  +------------------------------+
| Ports and External Seams       |  | Persistence / Projection     |
| host / Bus / Runtime / owners  |  | truth stores / support store |
| event / observation handoff    |  | rebuildable read projections |
+----------------+---------------+  +---------------+--------------+
                 |                                  ^
                 v                                  |
+------------------------------------------------------------------+
| Local Handoff Continuation                                       |
| host signal / publication / observation attempt and gap relay    |
+------------------------------------------------------------------+
```

关键说明:

- 箭头表达允许的编排方向,不是函数调用链、transaction 或 network topology。
- Inbound / Operations 不做 domain decision;Application 不能绕过 Domain 直接改 truth;Domain 不读取 adapter / transport / config。
- External ports 与 persistence / projection 都服从 inward contract;具体产品、schema 和 adapter 实现后移。
- Local Handoff 只继续提交已成立事实并形成 attempt / gap;external feedback 以新事实回到 Inbound,不得逆写源决定。

## 6. 业务主要组成部分与实现分层关系

### 6.1 双轴关系表

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 从 `BC-L2M-01~07` 承接的七类业务责任,回答 member 在 presence、inbound、Runtime seam、outbound、trace、mirror、read model 上“做什么”。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Local Handoff,回答这些业务主体如何被代码承载。 |
| 关系 | 每个业务组成部分跨多个实现层;同一个实现层服务多个组成部分。两者是正交视角,不能互相替代。 |
| 后续展开 | Step 5~9 按七个业务组成部分小循环;每个部分内部再标注对象、接口、flow、state 属于哪个实现层。 |

### 6.2 组成部分跨层承载矩阵

| 组成部分 | Inbound / Ops | Application | Domain / Policy | Ports / Store / Projection / Handoff |
|---|---|---|---|---|
| Presence / Host | command、host feedback | presence / host services | admission、presence、host attempt | subject / identity / credential / host ports;presence store |
| Inbound | fact / rule consumers | scope / inbound services | scope、screening、rule snapshot | Bus / rule ports;inbound store |
| Runtime Mediation | delivery command、material consumer | mediation service | delivery、submission、reception | Runtime ports;mediation store |
| Outbound | feedback consumer、relay job | outbound service | decision、material、attempt、gap | publication / feedback ports;outbound store |
| Interaction Trace | trace query、observation relay | trace service | trace / observation records and policy | observation port;trace store |
| External Mirror | source consumers、refresh job | mirror service | resolution / snapshot / gap policy | resolver ports;mirror support store |
| Member Read Model | query、rebuild / reconcile jobs | read-model service | projection policy / view state | projection store;no core write port |

### 6.3 关键判断

- 正式业务主要组成部分候选固定为七个,Step 5 只能合并 / 改名时给出对正式 BC 的完整映射和不丢 capability 证明。
- `PresenceCommandApi`、`InboundFactConsumer`、`PublicationRelayJob` 是入口 / 运维主体,不是业务组成部分。
- `Application Services` 是用例编排层,不是“第八模块”;Domain Model 也不是某个集中式 member mega-object。
- `Port`、`Store`、`Projection`、`Handoff` 是边界 / carrier 类型,不取得 external truth 或业务组成部分 owner。
- adapter 只在 port 外侧翻译 source-specific carrier;其成功状态不能直接成为 domain success。

## 7. 外部端口候选与依赖分类

| Port 候选 | 对端 / 内容 | 依赖类型 | 当前状态 |
|---|---|---|---|
| `ProjectMemberSourcePort` | Work `ProjectMemberRef` / project scope | runtime(ref) | formal owner stable;exact carrier later |
| `IdentityAnchorSourcePort` | Identity `GlobalMemberRef` safe resolution | runtime(ref) | formal owner stable |
| `StartupCredentialVerifierPort` | credential ref verification | runtime | `L2M-UP-006` pending |
| `HostCollaborationPort` | request / liveness signal / status report / feedback ref | runtime | `L2M-UP-001` pending exact contract |
| `InboundEventPort` / `EventPublicationPort` | Bus fact intake / safe material submission | event | Core schema / route `L2M-UP-005` pending |
| `ScreeningRuleSourcePort` | Governance effective result / safe snapshot | runtime + event(ref form) | `L2M-UP-007` pending taxonomy |
| `RuntimeEntryPort` / `RuntimeMaterialSourcePort` | trigger admission / committed safe material | runtime | `L2M-UP-003/004` pending mapping / source family |
| `ToolContractViewSourcePort` / `MethodDefinitionViewSourcePort` | outlet ref / safe view | runtime(ref),optional | source owner stable;activation optional |
| `ObservationHandoffPort` | body-free observation material | event / handoff | route / observed boundary pending |
| truth / support / projection store ports | local member data | technical carrier behind inward contract | product / schema / transaction pending |

这些端口都不是 package dependency。只有未来确认使用 Core 正式 shared contract 的部分可形成 compile dependency;不得由本表推导 sibling package、adapter readiness 或 integration pass。

## 8. 当前材料问题诊断与改动对比

| historical / draft 主体 | 诊断 | 当前替代 |
|---|---|---|
| `MemberRuntimePersona` | mega-object 吸收身份、能力、Runtime 状态 | Presence local truth + external refs + derived views 分离 |
| `ExecutionActorBinding` | 让 member 成为执行主语 owner | subject acceptance + Runtime mediation correlation,truth 外置 |
| `Member truth core` 作为独立模块 | 容易成为共享可写大模型 | 1~5 的共同 invariant,不单列业务组成部分 |
| `Safe material and maintenance` 合并模块 | observation trace、publication 和 projection 状态语义不同 | 分别归 Outbound、Trace、Read Model;job 作为实现层主体 |
| 旧 B1~B6 / 五部分 | 管道 / persona 粒度与正式 7 BC 不一致 | 七组成部分候选与双轴实现分层 |

## 9. 设计取舍

| 方案 | 优点 | 问题 | 结论 |
|---|---|---|---|
| 按 7 BC 一比一变成目录 | 简单 | 架构上下文不等于物理代码组织 | 不采用目录结论;采用业务组成部分映射 |
| 按六个实现层作为业务模块 | 容易写代码 | 丢失 capability / owner 小循环 | 不采用 |
| 七业务组成部分 × 六实现层 | 同时保护业务责任与落码承载 | 主语较多,需 Step 5~9 严格反查 | 采用 |
| 建立中心 `MemberFacade` mega-service / object | 调用入口集中 | 重新合并 truth、projection、adapter,重现旧 persona 污染 | 不采用;可有薄入口,无 owner 权 |
| 现在锁 transport / store / outbox | 看似更具体 | exact contracts、workload 和 authority 未闭口 | 不采用;只点 inward ports / carrier responsibility |

## 10. 结构化中间产物

- 架构模块到代码主体映射图:§4。
- 实现分层视图:§5。
- 双轴关系与跨层矩阵:§6。
- 外部端口与依赖分类:§7。
- Step 5 组成部分候选:Presence and Host Collaboration、Inbound Boundary、Runtime Mediation、Outbound Boundary、Interaction Trace、External Context Mirror、Member Read Model。

## 11. 回填草稿

正式 §4 摘录 §4、§5、§6.1 与 §6.3。正式正文保留两张图及 2~5 条关键说明,不复制端口全表或过程诊断;具体 port 进入正式 §7。

## 12. 待确认事项

本 Step 不要求 physical transport、process count、store、transaction 或 event family 闭口。Step 5 必须验证七个组成部分均有独立 capability、候选对象和不承担项;若某部分只有 adapter / job 而无业务责任,应在 Step 5 退回重分。

## 13. 进入下一步条件与停审

| 门禁 | 结果 |
|---|---|
| 7 BC 均映射到代码主体骨架 | pass;见 §3.1 / §4 |
| 两张强制 ASCII 图与关键说明齐全 | pass;见 §4 / §5 |
| 业务组成部分与实现分层明确分开 | pass;见 §6 |
| 外部 owner 只通过 ports 出现且依赖分类真实 | pass;见 §7 |
| 未写目录、完整类型、协议、DB 或部署 | pass |
| Step 5 候选可逐部分展开 | pass;见 §10 |

Step 4 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / 项目台账至 Step 5,然后创建 `02_hld_step_05_components_boundary.md` 并维护 Step 内逐组成部分计划。
