# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-08-23
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 内计划

| 顺序 | 小阶段 | 状态 | 产出 |
|---:|---|---|---|
| 1 | 读取 Step 4 双轴框架并回答全局问题 | completed | 七组成部分冻结规则 |
| 2 | 诊断 draft 8 部分与正式 7 BC 差异 | completed | `truth core` / maintenance 归位 |
| 3 | Presence and Host Collaboration 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 4 | Inbound Boundary 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 5 | Runtime Mediation 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 6 | Outbound Boundary 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 7 | Interaction Trace 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 8 | External Context Mirror 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 9 | Member Read Model 小循环 | completed / pass | capability、候选对象、接缝、停审 |
| 10 | 跨组成部分闭环 / Step 6 门禁审计 | completed / pass | 34 个对象候选与后续位置无冲突 |

## 2. 本步输入与全局问题回答

### 2.1 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 4 七组成部分候选与跨层矩阵 | 冻结本 Step 业务组织轴 |
| Step 3 20 条硬约束 | 审查 capability、候选对象与接缝是否越界 |
| 正式 00 C1~C5、FR-001~012、IB-001~015 | 确保每项需求能力有结构承接 |
| 正式 01 BC01~07、数据 owner 与交互表 | 确保每部分 owner / non-owner / seam 不漂移 |

### 2.2 全局问题回答与复杂度判断

- 本仓正式划分为 7 个业务主要组成部分,与 `BC-L2M-01~07` 一一对应;没有缺少业务责任的纯 adapter / job 模块。
- 每个部分均有至少 3 个 capability,且每个 capability 都能指出输入、输出、本地状态影响、external collaboration 与 Step 6~9 承接位置。
- `Member truth core` 不是第八部分,而是 Presence / Inbound / Runtime Mediation / Outbound / Trace 共同遵守的 local owner、body-free、append-history invariant。
- draft 的 `Safe material and maintenance` 不再独立:publication material 归 Outbound,observation material 归 Trace,refresh / rebuild / reconcile 是各 owner 部分的 Operations 主体。
- 对象候选共 34 个,需要在 Step 6 按七部分拆附录逐对象正式化;正式 §6 只保留对象总览和边界摘要。
- API / consumer / job / port / store / DTO 不进入对象池;它们分别进入 Step 7 或详细设计。

## 3. 当前材料诊断与设计取舍

| 议题 | 诊断 | 取舍 |
|---|---|---|
| draft 8 组成部分 | `truth core` 与 `safe material / maintenance` 是横切 invariant / 实现形态,不是独立业务责任 | 采用正式 7 BC 一一映射 |
| BC 与代码主体是否同名 | 业务语言稳定,但不能直接成为目录 | 组成部分沿用 BC 名;内部列 service / object / port / job |
| trace 是否拥有所有 source fact | 若拥有会形成第二 truth | Trace 只追加 link / gap / observation material,源事实归 1~4 |
| Mirror 是否成为共享 cache / hub | 会复制 external schema、授权与 registry | 只做 neutral resolution / freshness / gap |
| Read Model 是否与 Mirror 合并 | source resolution 与 derived consumer view 状态不同 | 保持两部分,均无 core write authority |
| 对象数量是否压成每部分一个 aggregate | 会形成 mega-object 并隐藏 decision / attempt / gap | 保留 34 个候选,Step 6 分附录正式化 |

## 4. 组成部分总表

| ID | 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|---|
| `CP-L2M-01` | Presence and Host Collaboration | 验证项目型启动语境,维护本地 presence,形成 host request / signal / report 与 attempt | Presence / Host services、admission / presence / material / attempt / policy | ProjectMember / GlobalMember、credential、container、registry、session、health truth |
| `CP-L2M-02` | Inbound Boundary | 维护 subscription scope,承接入站 fact ref,瞬时检查并形成四态 screening | Scope / Inbound services、fact / screening / policies | Bus delivery、Policy decision、Runtime admission、raw body persistence |
| `CP-L2M-03` | Runtime Mediation | 从 eligible inbound 形成 controlled delivery,关联 Runtime admission,承接 committed material | Runtime Mediation service、delivery / submission / result link / reception / policy | run、context、plan、outcome、IPC transport truth |
| `CP-L2M-04` | Outbound Boundary | 校验 committed source,形成 outbound decision / body-free material / publication attempt / gap | Outbound service、material / attempt / gap / policy、relay job | Runtime outcome、Bus delivery、downstream accepted / observed、conversation truth |
| `CP-L2M-05` | Interaction Trace | 关联本地 committed facts,形成 body-free trace / observation material / attempt / gap | Trace service、trace / gap / observation objects、relay job | source fact、完整日志、evidence、observed truth |
| `CP-L2M-06` | External Context Mirror | 把 external ref / safe snapshot 转成 neutral resolution / freshness / gap | Mirror service、snapshot / resolution / gap / policy、refresh job | external truth、authorization、registry、definition body、自动修复 |
| `CP-L2M-07` | Member Read Model | 从 committed facts / neutral resolution 派生 summary、outlet、diagnostic view,支持重建 | Read Model service、views / projection state / policy、query / rebuild jobs | core write、external truth、authorization、complete log |

## 5. 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| Presence / Host | `StartupAdmission`;`MemberPresence`;`HostCollaborationMaterial`;`HostCollaborationAttempt` | `PresenceAdmissionPolicy` | - | ProjectMember / GlobalMember / credential / host feedback refs 仅字段类型 | attempt 与 presence change 由源对象 + Trace 关联 | 前述 5 个对象 |
| Inbound | `SubscriptionScopeDecision`;`InboundFactRecord`;`ScreeningDecision` | `SubscriptionScopePolicy`;`InboundScreeningPolicy` | - | fact / rule source refs 仅字段类型;safe snapshot 归 Mirror | fact / decision append,由 Trace 关联 | 前述 5 个对象 |
| Runtime Mediation | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`RuntimeResultLink`;`RuntimeMaterialReception` | `RuntimeMediationPolicy` | - | Runtime trigger / admission / material refs 仅字段类型 | attempt / link append,由 Trace 关联 | 前述 5 个对象 |
| Outbound | `OutboundDecision`;`MemberOutboundMaterial`;`PublicationAttempt`;`PublicationGap` | `OutboundMaterialPolicy` | - | Runtime material / Bus delivery refs 仅字段类型 | attempt / gap append,由 Trace 关联 | 前述 5 个对象 |
| Interaction Trace | `InteractionTraceEntry`;`InteractionGap`;`ObservationMaterial`;`ObservationAttempt` | `TraceMaterialPolicy` | body-free query shape 留 Step 7 | local fact / external feedback refs 仅字段类型 | 本部分即 audit / history link owner | 前述 5 个对象 |
| External Mirror | `ExternalContextSnapshot`;`ExternalContextResolution`;`ExternalContextGap` | `MirrorResolutionPolicy` | neutral availability / freshness 由 resolution 表达 | owner typed refs 是字段类型 | resolution / gap append | 前述 4 个对象 |
| Member Read Model | `MemberProjectionState` | `ReadProjectionPolicy` | `MemberSummaryView`;`CapabilityOutletView`;`MemberDiagnosticView` | source watermark / ref 是字段类型 | rebuild / freshness history 由 state + Trace 关联 | 前述 5 个对象 |

## 6. 各部分交互总图

#### 各部分交互总图

```text
Host / Work / Identity ---> [1 Presence and Host Collaboration]
                                      |
                                      | admitted subject / presence
                                      v
Bus facts -----------------> [2 Inbound Boundary]
                                      |
                                      | screened fact context
                                      v
                              [3 Runtime Mediation] <----> L2-runtime
                                      |
                                      | committed material reception
                                      v
                              [4 Outbound Boundary] ------> Bus / consumers
                                      |
        committed facts from 1--4 ---+---> [5 Interaction Trace]
                                             |           |
                                             |           +--> observation handoff
External truth owners ------> [6 External Context Mirror]
                                      | neutral resolution / freshness
                                      v
committed facts from 1--6 ---------> [7 Member Read Model] ---> read consumers
```

关键说明:

- 纵向 1->2->3->4 表达存在与交互主线的语义依赖,不表示单线程或固定时序;在场期间入站 / 出站可并发。
- Trace 只关联 1~4 已提交本地事实;Mirror 只提供 external source 的 neutral resolution;二者都不成为源 owner。
- Read Model 只消费 committed facts / resolution,其失败或滞后不阻塞 1~5 的本地提交。
- 图不表达协议字段、函数调用链、transaction、topic、transport、process 或部署拓扑。

## 7. CP-L2M-01 Presence and Host Collaboration

### 7.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 验证并受理项目型启动语境 | ProjectMemberRef、GlobalMemberRef、startup / credential refs、source resolution | `StartupAdmission` | accepted / rejected / blocked 新事实;仅 accepted 可建 presence | §6 / §7 / §8 / §9 |
| 建立与显式推进本地在场 | accepted admission、presence transition intent | `MemberPresence` | starting / ready / degraded / draining / terminated / unknown 显式变化 | §6 / §7 / §8 / §9 |
| 形成 host collaboration material | presence fact、purpose、safe status category | `HostCollaborationMaterial` | body-free material committed | §6 / §7 / §8 |
| 提交并关联 host feedback | material、host port response / feedback ref | `HostCollaborationAttempt` | local attempted / blocked / unknown;不形成 health truth | §6 / §7 / §8 / §9 |

### 7.2 代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `PresenceCommandApi`;`HostFeedbackConsumer` | Inbound | 受理显式 command / feedback | §7 / §8 |
| `PresenceApplicationService`;`HostCollaborationService` | Application | 编排 admission、transition、material、attempt | §8 / 03 |
| 5 个对象候选 | Domain / policy / record | 承载 local presence / host collaboration | §6 / §9 |
| subject / identity / credential / host ports;presence store | Port / persistence | 隔离 external owner 与本地保存 | §7 / 03 |

### 7.3 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `StartupAdmission`;`MemberPresence`;`HostCollaborationMaterial`;`HostCollaborationAttempt` | 四者独立成节;不能把 host feedback 写成 presence / health |
| Policy | `PresenceAdmissionPolicy` | 独立成节;验证 subject / anchor / source,不签发凭据 |
| Reference | ProjectMemberRef、GlobalMemberRef、StartupContextRef、HostFeedbackRef | 只作字段类型,不独立成 member 对象 |
| History | presence changes / attempts | 由源对象与 Trace link 承接,不新增 mega audit object |

### 7.4 非职责、接缝与停审

- 不拥有 Work / Identity lifecycle、credential issue / revoke、container lifecycle、endpoint registry、host session、health / restart verdict。
- 向 Inbound 提供 admitted subject / current local presence;向 Trace 提供 committed fact refs;向 Mirror 消费 neutral resolution;向 host 只提交 material / attempt。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 有对象 / 接口 / flow / state 承接 | pass | exact host / credential contract 继续 `L2M-UP-001/006` |
| 候选对象回指功能 | pass | 删除旧 persona / session 对象 |
| 接缝与非职责清楚 | pass | host external state 只按 ref 关联 |
| 未越入 schema / transport | pass | carrier 后移 |

## 8. CP-L2M-02 Inbound Boundary

### 8.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 建立 / 调整订阅范围 | admitted subject、identity / role source resolution | `SubscriptionScopeDecision` | 新 scope decision;invalid source rejected | §6~§9 |
| 承接入站事实语境 | Bus envelope / fact ref、source metadata | `InboundFactRecord` | body-free intake fact;duplicate 分类 | §6~§9 |
| 执行授权瞬时检查并筛选 | fact context、rule resolution、scope | `ScreeningDecision` | passed / degraded / blocked / pending;不保存 raw body | §6~§10 |
| 承接规则变化线索 | rule update event / snapshot resolution | affected decision candidates / stale marker | 不重裁既有 decision,触发新 intake / refresh 语境 | §7~§10 |

### 8.2 代码主体、对象线索与停审

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `InboundFactConsumer`;`ScreeningRuleSourceConsumer` | Inbound | 承接 Bus fact / rule change | §7 / §8 |
| `SubscriptionScopeService`;`InboundBoundaryService` | Application | 编排 scope、inspection、screening | §8 / 03 |
| 5 个对象候选 | Domain / policy / record | scope、fact、screening 与 guards | §6 / §9 |
| Bus intake / rule-source ports;inbound store | Port / persistence | 外部 carrier 与本地事实边界 | §7 / 03 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `SubscriptionScopeDecision`;`InboundFactRecord`;`ScreeningDecision` | 独立成节;fact record 必须 body-free |
| Policy | `SubscriptionScopePolicy`;`InboundScreeningPolicy` | 独立成节;不得内置 allowlist / policy truth |
| Reference | fact / rule / scope source refs | 字段类型;safe snapshot 由 Mirror 对象承载 |
| Audit | fact -> screening association | 由对象 ref + Trace link 承接 |

- 不拥有 Bus delivery / route、Governance policy / authorization、Runtime admission、raw body、语义推理或本地 allowlist。
- 接缝:Presence 提供 subject;Mirror 提供 rule / source resolution;向 Runtime Mediation 只交 passed / degraded 的受控语境;向 Trace 交 committed refs。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability / object source | pass | rule taxonomy 继续 `L2M-UP-007` |
| transient inspection / persistence 分离 | pass | raw body 无对象候选 |
| screening / policy / Runtime 分层 | pass | 三者状态不共用 |
| 未越界 | pass | exact event schema `L2M-UP-005` pending |

## 9. CP-L2M-03 Runtime Mediation

### 9.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成 controlled Runtime delivery | eligible screening、fact / scope / source refs | `RuntimeDeliveryDecision` | submitted eligibility 本地决定 | §6~§9 |
| 提交 Runtime entry | delivery decision、Runtime port | `RuntimeSubmissionAttempt` | attempted / rejected / waiting / blocked / unknown local fact | §6~§10 |
| 关联 Runtime admission / result | attempt、formal response ref | `RuntimeResultLink` | append link;不成为 Runtime truth | §6~§10 |
| 承接 committed Runtime material | formal material ref、source / correlation | `RuntimeMaterialReception` | accepted / rejected / duplicate / late / unknown reception | §6~§10 |

### 9.2 代码主体、对象线索与停审

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `RuntimeDeliveryCommandApi`;`RuntimeMaterialConsumer` | Inbound | 受理本地 delivery intent / Runtime material | §7 / §8 |
| `RuntimeMediationService` | Application | 编排 decision、attempt、link、reception | §8 / 03 |
| 5 个对象候选 | Domain / policy / record | member 侧 Runtime seam local truth | §6 / §9 |
| `RuntimeEntryPort`;`RuntimeMaterialSourcePort`;mediation store | Port / persistence | 保护双 owner 与 carrier-neutral seam | §7 / 03 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`RuntimeResultLink`;`RuntimeMaterialReception` | 四者独立;admission / outcome 只作 refs |
| Policy | `RuntimeMediationPolicy` | 独立;duplicate / late / unknown / body gate |
| Boundary | RuntimeTrigger / Admission / SafeHandoff refs | 字段类型 / port DTO slot,不 shadow Runtime objects |
| History | attempt / result / reception append | 由对象 + Trace link 承接 |

- 不拥有 Runtime run、context、goal / plan、memory、checkpoint、decision、outcome、handoff attempt 或 transport。
- 接缝:从 Inbound 取 eligible local fact;经 Runtime port 提交;向 Outbound 只交 validated material reception;向 Trace 交 refs。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| member / Runtime owner 分层 | pass | exact mapping `L2M-UP-003/004` pending |
| decision / attempt / result / reception 可区分 | pass | 不使用单一 delivery success |
| unknown fenced | pass | 不设计盲重放 |
| 未复制 Runtime 对象 | pass | 只保留 typed slots |

## 10. CP-L2M-04 Outbound Boundary

### 10.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 校验 committed source 并形成出站决定 | `RuntimeMaterialReception`、target / purpose resolution | `OutboundDecision` | eligible / rejected / blocked / pending local decision | §6~§10 |
| 形成 member body-free 材料 | decision、allowed refs、redaction profile | `MemberOutboundMaterial` | immutable local material | §6~§9 |
| 提交正式 event / handoff seam | material、publication port | `PublicationAttempt` / `PublicationGap` | prepared / attempted / blocked / unknown;不声明 delivery | §6~§10 |
| 承接 delivery / downstream feedback | attempt、formal feedback ref | new attempt link / gap closure context | append only,不逆写 decision | §7~§10 |

### 10.2 代码主体、对象线索与停审

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `DeliveryFeedbackConsumer`;`PublicationRelayJob` | Inbound / Operations | 承接反馈 / 继续提交 | §7 / §8 |
| `OutboundBoundaryService` | Application | 编排 decision、material、attempt、gap | §8 / 03 |
| 5 个对象候选 | Domain / policy / record | 本地出站与 publication truth | §6 / §9 |
| publication / feedback ports;outbound store | Port / persistence | 隔离 Bus / downstream owner | §7 / 03 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `OutboundDecision`;`MemberOutboundMaterial`;`PublicationAttempt`;`PublicationGap` | 独立;material 与 attempt 不互相替代 |
| Policy | `OutboundMaterialPolicy` | 独立;source / body / target / purpose gate |
| Reference | Runtime material / Bus delivery / downstream refs | 字段类型,不保存 body |
| History | attempts / gaps / feedback links | append;由对象 + Trace 关联 |

- 不拥有 Runtime outcome、Bus delivery / retry / DLQ、Conversation / Artifact、downstream accepted / observed。
- 接缝:消费 Runtime reception / Mirror resolution;向 Bus / downstream port 提交 material;向 Trace 提交 committed local refs。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 五层出站状态未压平 | pass | route / source family 继续 pending |
| body-free material 独立 | pass | 不复用 Runtime material body |
| local truth first | pass | external failure 不回滚 |
| 无 generic outbound adapter | pass | 仅正式 event / handoff port |

## 11. CP-L2M-05 Interaction Trace

### 11.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 追加交互关联 | 1~4 committed fact refs、subject / source / purpose / correlation | `InteractionTraceEntry` | immutable link | §6~§9 |
| 显式记录关联缺口 | expected / actual refs、safe reason | `InteractionGap` | open / blocked / resolved / unknown gap fact | §6~§10 |
| 形成安全观测材料 | trace refs、safe categories、redaction | `ObservationMaterial` | body-free immutable material | §6~§9 |
| 提交观测交接 | material、observation port | `ObservationAttempt` | prepared / attempted / blocked / unknown / feedback-linked | §6~§10 |

### 11.2 代码主体、对象线索与停审

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `InteractionTraceQueryApi`;`ObservationRelayJob` | Query / Operations | body-free trace read / observation submit | §7 / §8 |
| `InteractionTraceService` | Application | append link / gap / material / attempt | §8 / 03 |
| 5 个对象候选 | Domain / policy / record | trace / observation local truth | §6 / §9 |
| trace store / observation port | Persistence / port | 保存 links,提交 safe material | §7 / 03 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Audit / History | `InteractionTraceEntry`;`InteractionGap` | 独立;link 不拥有 source fact |
| Material / Attempt | `ObservationMaterial`;`ObservationAttempt` | 独立;attempt 不等于 observed |
| Policy | `TraceMaterialPolicy` | 独立;minimal / redacted / low-cardinality gate |
| Reference | local fact / external feedback refs | 字段类型;无正文 |

- 不拥有源 decision、complete log、metric backend、evidence、archive、delivered / observed truth。
- 接缝:只消费 1~4 committed refs;向 Read Model 提供 safe trace source;向 observation boundary 提交 material / attempt。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| trace 与 source truth 分离 | pass | 不建 central event truth |
| observation attempt / observed 分离 | pass | route 继续 `L2M-UP-004/005` |
| body / cardinality 边界 | pass | 不保存完整日志 |
| failure isolation | pass | trace / observation failure 不回滚源事实 |

## 12. CP-L2M-06 External Context Mirror

### 12.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 捕获安全来源快照 | typed source ref、version / digest、scope / freshness | `ExternalContextSnapshot` | point-in-time body-free support fact | §6~§9 |
| 形成中立解析结论 | source / snapshot / consumer purpose | `ExternalContextResolution` | resolved / stale / conflict / unresolved / unavailable / unknown | §6~§10 |
| 显式记录来源缺口 | expected source、resolution context | `ExternalContextGap` | open / blocked / resolved / unknown | §6~§10 |
| 受控 refresh | source update / refresh trigger、existing snapshot | new snapshot / resolution / gap | 新事实;不静默覆盖、不自动授权 | §7~§10 |

### 12.2 代码主体、对象线索与停审

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| source update consumers;`ExternalContextRefreshJob` | Inbound / Operations | 接收变化线索 / 受控刷新 | §7 / §8 |
| `ExternalContextMirrorService` | Application | capture / resolve / gap / refresh 编排 | §8 / 03 |
| 4 个对象候选 | Support truth / policy | neutral snapshot / resolution / gap | §6 / §9 |
| owner-specific resolver ports;mirror store | Port / persistence | 隔离 source schema 与本地 support truth | §7 / 03 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Support Truth / State | `ExternalContextSnapshot`;`ExternalContextResolution`;`ExternalContextGap` | 独立;必须带 source / scope / freshness |
| Policy | `MirrorResolutionPolicy` | 独立;不能把 resolved 写成 authorized / healthy / accepted |
| Boundary | Work / Identity / Governance / Runtime / Tools / Method / host refs | 字段类型 + resolver ports,不复制 source body |
| History | refresh / resolution / gap append | 对象自身 + Trace 关联 |

- 不拥有 external business truth、credential / policy / health / authorization / registry、definition body 或 generic hub。
- 接缝:向 1~5 / 7 输出 neutral resolution,从 owner ports 读取 safe material;所有调用方仍执行自己的 domain policy。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| anti-corruption 而非 cache / hub | pass | 不提供任意外部 adapter |
| freshness / conflict / unknown 显式 | pass | 无 last-known-as-current |
| consumer policy 不被 Mirror 替代 | pass | resolved != authorized |
| source contracts 不伪闭口 | pass | `L2M-UP-001~008` 继续挂起 |

## 13. CP-L2M-07 Member Read Model

### 13.1 本部分职责与 capability

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 派生成员摘要 | 1~6 committed refs、source watermark | `MemberSummaryView` | current / stale / rebuilding / degraded / unknown projection | §6~§10 |
| 派生能力出口 | Tools / Method safe refs、activation scope、Mirror resolution | `CapabilityOutletView` | available / not_available / stale / gap;非 authorization | §6~§11 |
| 派生诊断 / 解释视图 | safe facts / trace / source categories | `MemberDiagnosticView` | optional,read-only,body-free | §6~§10 |
| 重建与对账 | committed facts、watermark、gap context | `MemberProjectionState` + rebuilt views | 不创造 / 修复 core truth | §6~§10 |
| 安全查询 | query context、visibility policy、projection | view / explicit gap | 无写副作用 | §7 / §8 |

### 13.2 代码主体、对象线索与停审

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MemberQueryApi`;projection update consumers | Query / Inbound | 只读供给 / 触发投影更新 | §7 / §8 |
| `MemberProjectionRebuildJob`;`GapReconciliationJob` | Operations | 重建 / 对账 | §7 / §8 |
| `MemberReadModelService` | Application | project / rebuild / query 编排 | §8 / 03 |
| 5 个对象候选 | Projection / policy / state | summary / outlet / diagnostics / freshness | §6 / §9 |
| projection store | Persistence / projection | 保存可重建视图 | §7 / 03 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Projection | `MemberSummaryView`;`CapabilityOutletView`;`MemberDiagnosticView` | 独立;diagnostic 标 optional |
| State | `MemberProjectionState` | 独立;watermark / freshness / rebuildability |
| Policy | `ReadProjectionPolicy` | 独立;visibility / body / no-write / source sufficiency |
| Reference | local fact refs / source watermark / tool / method refs | 字段类型;不复制 definition / body |

- 不拥有任何 core / support / external truth、authorization、registry、complete history / log 或 consumer write。
- 接缝:只消费 1~6 committed facts / resolution;Query 只返回 projection / explicit freshness;没有反向 core port。

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| summary 必需,outlet 激活可裁剪 | pass | outlet 结构保留且 non-authorizing |
| projection no-write / rebuildable | pass | 无 core write port |
| derived failure isolation | pass | C1~C4 不依赖 view current |
| optional diagnostics 不扩权 | pass | 只读 body-free |

## 14. 总体边界与跨组成部分闭环审计

### 14.1 总体边界

- `CP01~05` 分别拥有自身 local facts;Trace 只能关联,不能成为统一 source truth。
- `CP06` 拥有 external consumption 的 support truth;`CP07` 拥有可重建 projection;二者不写 `CP01~05`。
- local decision / material / attempt / gap 与 external accepted / delivery / observed / healthy 全部保持分层。
- API、port、store、job、DTO 和 field ref 不升级成业务对象;具体 schema / carrier / implementation 后移。

### 14.2 跨组成部分闭环审计

| 审计项 | 结论 | 纠正 / 说明 |
|---|---|---|
| 7 BC capability 是否完整 | pass | C1~C5、FR-001~012、IB-001~015 均有部分归属 |
| 重复 owner | pass | subject / screening / Runtime / outbound / trace / resolution / projection 各有唯一 owner |
| Trace 是否复制 source truth | pass | 只保留 typed link / gap / safe observation material |
| Mirror / Read Model 是否反写 | pass | 无 core write capability / port |
| material / attempt / external status 是否混用 | pass | host、Runtime、publication、observation 均单独分层 |
| 候选对象遗漏 | pass | truth / state / policy / projection / reference / audit / history 维度均已判断 |
| 候选对象重复 | pass | `Gap` 按 publication / interaction / external context 分域;语义不共享 |
| API / port / DTO 误入对象池 | pass | ref / response / envelope / ports 均留 Step 7 / 03 |
| 后续展开悬空 | pass | 34 个候选进 Step 6;interfaces -> Step 7;flows -> Step 8;states -> Step 9 |
| sibling / schema pending 伪闭口 | pass | 只形成 inward slots,不声明 mapping / route / readiness |

### 14.3 Step 6 展开门禁

Step 6 必须:

1. 按七组成部分分别建立对象附录,逐一说明 candidate 成立或剔除理由。
2. 对 34 个“必须独立展开”候选给出基本信息、关键字段类型、状态、成员函数、工厂函数和禁止事项。
3. 证明每个对象回指至少一个 capability;若剔除必须明确落为 field type / API / port / detailed-design item。
4. 不把 Core / Runtime / host / Bus / Governance / Tools 等 external object 复制为 member object。

## 15. 回填草稿、待确认与停审

正式 §5 摘录 §4 总表、§5 对象发现表、§6 交互图和各部分 capability / 非职责 / seam 的收口摘要。逐部分停审、过程诊断和跨审计保留在本文件。

本 Step 不新增阻塞 Step 6 的事项。34 个候选只是对象池,不是已正式成立对象;exact external ref / schema 类型继续由 `L2M-UP-001~008` 约束。

| 进入下一步条件 | 结果 |
|---|---|
| 七部分 capability、代码主体、候选对象、非职责、接缝均齐全 | pass |
| 每部分已独立停审 | pass |
| 各部分交互图符合概要粒度 | pass |
| 跨部分重复 / owner / 遗漏 / 悬空审计无 unresolved 冲突 | pass |
| 对象字段 / 函数尚未在本 Step 展开 | pass |

Step 5 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / 项目台账至 Step 6,创建对象主控文件及七个组成部分附录,按 `CP01 -> ... -> CP07 -> cross-object audit` 串行正式化。
