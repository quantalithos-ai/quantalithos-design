# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-08-25
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与边界

本步把 Step 4~11 已经收稳的代码主体、业务主要组成部分、对象、接口、处理流、状态、异常边界与配置影响，明确交付为未来 `03-详细设计.md` 的输入。目的不是提前编写详细设计，而是防止详细设计重新发明主语、以匿名 DTO 或 generic adapter 偷渡新 owner，或把开放的跨仓接缝暗改成已闭口协议。

| 项目 | 本步结论 |
|---|---|
| 可承接范围 | 仅承接已经由 Step 4~11 停审的 member-local / member-support / derived-read 主语和结构骨架。 |
| 详细设计职责 | 将已收稳骨架展开为类型、字段、函数、Port / Store、事务、错误、配置实现契约与测试切口。 |
| 不在本步做什么 | 不新增业务对象、接口、流程、状态、跨仓协议、配置 key、产品选型、实施任务或测试结果。 |
| 开放接缝口径 | 仅 transport-neutral logical seam 可被承接；exact carrier、schema、route、credential、image、Runtime / host 正向合同仍不进入稳定清单。 |
| 文档门禁 | 旧 `03-详细设计.md` 仍属 historical material。只有正式 `02` 在 Step 14 重建并停审、且用户再次批准进入 `03` 后，才可创建新的详细设计 flow 和正式正文。 |

### 1.1 本步输入

| 输入 | 已收稳内容 | 本步如何使用 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 七个业务组成部分与实现分层双轴、9 个 Application Service、入口 / Job / Port / Store 骨架 | 冻结详细设计不得重划的主体与层次。 |
| `02_hld_step_05_components_boundary.md` | CP01~CP07 职责、capability、非职责、相互方向 | 冻结组件 owner、数据边界与无第八业务组成部分原则。 |
| `02_hld_step_06_key_objects.md` 及七个对象附录 | 34 个对象、对象类别、关键字段 / typed function 骨架和禁止事项 | 冻结详细设计必须逐项落码的对象集合。 |
| `02_hld_step_07_api_interface_skeleton.md` 及七个接口附录 | `10 / 16 / 14 / 24 / 5` 接口分类、metadata、逻辑 Port / Store 分类 | 冻结 use-case / read / consumer / event / job 的边界。 |
| `02_hld_step_08_processing_flows.md` 及七个流程附录 | Command、Query、Consumer、Job 的处理流和单向传播 | 冻结 local-truth-first、no-write、unknown fence 与无反向写。 |
| `02_hld_step_09_state_machine.md` 及七个状态附录 | 分对象状态族、允许 / 禁止迁移、append / successor 与 freshness 语义 | 冻结无全局 `MemberLifecycleState` 和状态不可偷换规则。 |
| `02_hld_step_10_exceptions_boundaries.md` | 主线断点、forbidden-body、duplicate / late、projection 和 seam 的异常口径 | 冻结错误模型必须覆盖的设计级边界。 |
| `02_hld_step_11_configuration_impact.md` | 配置影响面、不可配置化红线、03 / 04 分工 | 冻结配置只经 bootstrap / Application 注入既有结构。 |

## 2. SOP 问题回答与当前材料诊断

### 2.1 哪些代码主体框架已经收稳，详细设计不能重新发明

以下七个业务主要组成部分与其职责边界已经稳定。它们是“member 做什么”的主语；`adapter`、`repository`、`port`、`job`、物理进程或协议只是承载方式，不得在详细设计中被升格为第八业务组成部分。

| 已收稳业务主要组成部分 | 已收稳职责 | 详细设计不得改写为 |
|---|---|---|
| CP01 Presence and Host Collaboration | 验证项目型启动语境、维护 local presence，形成本地 host collaboration material / attempt 并接收反馈关联。 | host registry、session、health、container lifecycle truth。 |
| CP02 Inbound Boundary | 维护 scope、承接 body-free inbound fact、执行瞬时筛选并形成 member screening。 | Bus delivery truth、Governance rule / approval truth、raw body store。 |
| CP03 Runtime Mediation | 形成 controlled Runtime delivery、local submission attempt / result link，承接 committed safe Runtime material。 | Runtime loop、run、context、plan、outcome 或 Runtime carrier truth。 |
| CP04 Outbound Boundary | 从已承接 material 形成 outbound decision、safe material、publication attempt / gap。 | delivery、downstream acceptance、Conversation truth 或 observed truth。 |
| CP05 Interaction Trace | 关联 committed member facts，形成 body-free trace / observation material / attempt / gap。 | complete log、evidence、observability backend 或 observed truth。 |
| CP06 External Context Mirror | 将 owner-provided ref / safe snapshot 转为 neutral resolution、freshness 和 gap。 | Governance / Tools / Method / host / Runtime 等来源 truth、authorization 或 registry。 |
| CP07 Member Read Model | 从 committed facts 与 neutral resolutions 派生 summary、outlet、diagnostics 和可重建投影状态。 | core / support truth write owner、capability registry 或 invocation gateway。 |

实现分层也已稳定：Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Local Handoff Continuation。详细设计可决定 module、trait、constructor、unit-of-work 和 adapter 的具体形式，但不得反转依赖方向：入口 / Job 不作领域裁决，Domain 不读取 transport 或 config，Query 不写入，Trace / Mirror / Read Model 不反向修改 source truth。

稳定的 Application Service 主语为 `PresenceApplicationService`、`HostCollaborationService`、`SubscriptionScopeService`、`InboundBoundaryService`、`RuntimeMediationService`、`OutboundBoundaryService`、`InteractionTraceService`、`ExternalContextMirrorService` 与 `MemberReadModelService`。它们可以在详细设计中拆出私有 helper，但不得借拆分改变 capability 归属。

### 2.2 哪些对象、接口、处理流和状态机已经成为详细设计输入

#### 34 个关键对象

| 组成部分 | 已由概要设计收稳的对象 | 详细设计的对象级展开边界 |
|---|---|---|
| CP01 | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt`、`PresenceAdmissionPolicy` | admission / presence / attempt 的本地状态与 immutable material；不得形成 host acceptance 或 health 对象。 |
| CP02 | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、`SubscriptionScopePolicy`、`InboundScreeningPolicy` | scope revision、body-free fact、四态 screening 与 guard；不得存 raw body 或重裁 Governance truth。 |
| CP03 | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception`、`RuntimeMediationPolicy` | 本地 delivery qualification、attempt、external classification link、safe reception 与 guard；不得复制 Runtime run / outcome。 |
| CP04 | `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、`OutboundMaterialPolicy` | local decision、immutable material、attempt / gap 与 guard；不得把 submitted 写成 delivered / accepted / observed。 |
| CP05 | `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy` | committed-only trace、body-free observation material、attempt / gap 与 guard；不得形成 evidence 或 complete log truth。 |
| CP06 | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy` | owner-neutral snapshot / resolution / gap；不得将 resolution 命名或实现为 authorization、health 或 registry。 |
| CP07 | `MemberSummaryView`、`CapabilityOutletView`、`MemberProjectionState`、`MemberDiagnosticView`、`ReadProjectionPolicy` | immutable views、唯一可变 projection state 与 read guard；不得让 view 取得 write / authorization 权。 |

`ProjectMemberRef + GlobalMemberRef` 是当前唯一已收稳的项目型正向执行主语与身份锚组合；未定义的主语不由详细设计补造，而维持 fail-closed。Core shared primitive、外部 owner ref、event / feedback ref、purpose / reason / freshness 值类型仍是字段或协议槽位，不得 shadow 为 member-domain object。

#### 接口分类与处理流

| 已收稳骨架 | 详细设计必须继续展开 | 必须保持的语义 |
|---|---|---|
| 10 个 Command API | request / result DTO、actor、metadata、idempotency、validation、expected-version、stored result、error mapping 与 transaction boundary。 | 每个 Command 只改变 member local / support truth；system trigger 也不能匿名写入。 |
| 16 个 Query API | request / response、visibility、page / ordering（如适用）、freshness / gap / unavailable / optional surface 与 no-write tests。 | Query 不触发 refresh、rebuild、reconcile、gap 创建或任何外部副作用。 |
| 14 个 Inbound Consumer | envelope、source identity、schema version、dedup、ordering / conflict、body gate、receipt / quarantine surface 与 application re-entry。 | external 与 internal committed-fact Consumer 不混同；Consumer 不取得 source-owner truth。 |
| 24 个 semantic Outbound Event | semantic kind、local source ref、change / correlation identity、safe payload DTO、outbox candidate、compatibility 与 publication error surface。 | 仅是已提交本地事实的语义候选；不是既定 carrier、topic、route、delivery 或 integration。 |
| 5 个 Operations Job | job input / report surface、scope、cursor、watermark、idempotency、partial failure 与 continuation policy。 | Job 只继续 relay、refresh、rebuild 或 reconciliation，不能创建 / 修复 core 或 external truth。 |
| 30 个 unique Port / Store 及逻辑 seam | trait / repository 读取写入面、typed request / result、blocked-aware error、adapter responsibility、store consistency 与 unit-of-work 接口。 | compile / runtime / event / ref / adapter / fake / persistence 必须保持分类，不把运行期或事件协作伪装成 package dependency。 |

Step 8 的流族是详细设计的编排骨架：通用 Command write、stable Query read、external Consumer、internal committed-fact Consumer、Operations Job，以及 CP01~CP07 各自已单列的 admission / screening / Runtime mediation / publication / trace / mirror / projection 流。详细设计必须为这些已命名入口补足函数调用、读取面、写入面、事务与失败分支，不得改写其输入来源、提交顺序或单向传播。

#### 状态、历史与异常边界

状态按对象分层而非收敛成一个生命周期。详细设计需要将各对象的状态名、初始态、可重入条件、终止 / successor 规则、并发控制和错误映射写成状态矩阵；但必须保持以下概要结论：

- `ready`、`active`、`passed`、`eligible`、`accepted`、`submitted`、`resolved`、`current` 与 `available` 均仅在各自对象语义内成立，不能代答外部 owner 的成功。
- `unknown` 是来源或副作用无法证明时的 fence；`blocked`、`pending`、`stale`、`gap`、`degraded`、`failed` 不因时间、retry、Query、默认值或配置静默升级。
- decision、scope、fact、link、attempt、gap、snapshot、resolution 和 projection revision 采用 append / successor history；不删除或原地覆盖历史。
- CP06 是 Governance rule 与 Tools / Method capability source update 的唯一 member-side consumer owner；CP07 只消费 CP06 已提交的 resolution / gap，且不反写。

Step 10 已冻结的异常边界也必须成为详细错误模型的输入：主语 / credential 不足、rule source 不充分、forbidden-body、Runtime / host / carrier seam 不可证明、duplicate / late / out-of-order、feedback / trace gap、Mirror stale / conflict、projection / outlet 不可证明，均须有 explicit conservative surface，而非默认成功或本地补造外部事实。

## 3. 详细设计继续展开方向

### 3.1 对象、状态与数据归属契约

`03-详细设计.md` 应逐个将 34 个对象收敛为可落码契约：对象类别、typed identity / ref、字段来源、状态 / revision / timestamp / reason / trace / watermark、factory 和成员函数、前置 / 后置条件、DomainError、serialization / compatibility、history / correction 和持久化读取写入面。每个字段都必须能回指 owner 或明确派生规则；每个 state transition 都必须能回指 Command、Consumer 或 Job，并在测试与验收中保留同一语义。

对 `MemberSummaryView`、`CapabilityOutletView`、`MemberDiagnosticView` 与 `MemberProjectionState`，详细设计还必须明确 projection identity、source watermark、freshness、rebuild source、visibility、not-ready / stale / unavailable 表面；不能从外部 source 临时拼装 view，也不能让 `available` 代表 registry、authorization、invocation 或 execution readiness。

### 3.2 协议、Port、adapter 与事务契约

详细设计应把已收稳的 Command / Query / Consumer / semantic Event / Job 骨架扩展为输入输出 DTO、传递类型、错误模型、idempotency / duplicate result surface 和版本兼容规则；为每条使用外部 ref 或 safe snapshot 的规则补正式 resolver / Port 读取面。对 Consumer、Event 和 Host / Runtime / downstream / source-owner seam，只能定义 blocked-aware、owner-specific logical contract；没有上游 authority 的 exact envelope、route、payload、credential 或 adapter activation 不得自行设定。

每个写路径需明确 validation、load、Domain method、local fact / history / trace / outbox candidate / projection-stale、stored result 的 unit-of-work 边界。外部 handoff 必须在 local commit 后作为 attempt / gap continuation；feedback 只能形成 owner-specific link、classification、successor 或 gap，不能回滚 source decision。每个 Query 需有稳定读取面且可证明 no-write。

### 3.3 配置、错误与测试承接

详细设计应把 Step 11 的轮廓转为 effective configuration / provenance / version / scope、`ConfigLoader`、`ConfigValidator`、`ConfigError`、`RuntimeConfig` / `AdapterConfig` / `JobConfig`、runtime builder / Application injection 与 pending-aware validation 的实现契约。Domain、policy 与 Query 不直读配置；配置不能改变 subject、owner、fail-closed、forbidden-body、状态红线、append history、source-owner、dependency 分类或开放接缝状态。

详细设计还必须给后续 `05-测试方案.md`、`06-验收标准.md` 留下可追溯切口：状态迁移与不变量、Command idempotency、Query no-write、Consumer dedup / version / forbidden-body、unknown side-effect fence、outbound / observation gap、Mirror freshness、projection rebuild、optional outlet，以及不可配置化边界的负向场景。这里只定义未来测试应覆盖的结构，不声明任何测试已执行、通过或形成证据。

## 4. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 项目型正向主语为 `ProjectMemberRef + GlobalMemberRef`；member 仅拥有 container-local interaction truth。 | 定义 subject / identity resolution Port、matching guard、typed input 与 fail-closed error；不创建第三种执行主语。 |
| CP01~CP07 七个业务主要组成部分及其 owner / non-owner 边界。 | 为每个组成部分定义 module / service / repository / Port / adapter / projection 的正式职责，不增设第八业务组成部分。 |
| Inbound / Operations、Application、Domain / Policy、Ports / External Seams、Persistence / Projection、Local Handoff 的实现分层。 | 定义 package / module、trait、constructor、dependency injection、unit-of-work 与 adapter 外侧翻译；保持 inward dependency。 |
| 9 个 Application Service 主语。 | 定义每个 service 的 use-case 函数、输入输出、依赖 Port / Store、事务编排与错误映射；不让 service 复制 external owner truth。 |
| 34 个关键对象及其能力、字段 / 函数骨架、对象类别与禁止事项。 | 逐对象定义完整字段、typed ref、factory / method、state / history、DomainError、repository contract、serialization 和 fixture 策略。 |
| 10 Commands、16 Queries、14 Consumers、24 semantic Events、5 Jobs 的分类、归属和 metadata 槽位。 | 逐接口定义 DTO、传递类型、version、idempotency、visibility、dedup、result / report、error、outbox / receipt 与 compatibility；exact external carrier 仍须由 authority 闭口。 |
| owner-specific Port / Store、依赖分类和 no generic external adapter 原则。 | 定义每个 Port / Store 的 trait、读取写入面、blocked-aware result、fake 边界、adapter selection 与 local persistence consistency；不把 runtime / event / ref 关系写成 compile dependency。 |
| CP01~CP07 的 Command、Consumer、Query、Job 和 local handoff 处理流。 | 定义函数编排、load / save 顺序、idempotency、transaction、outbox candidate、feedback link、partial failure 与 recovery path。 |
| 对象化状态族、允许 / 禁止迁移、append / successor history、unknown fence 和单向传播。 | 定义 enum、状态矩阵、initial / terminal / re-entry、expected-version、concurrency、history factory、error mapping 和 state tests。 |
| local-truth-first、body-free、fail-closed、Query no-write、Trace / Mirror / Read Model 无反向写。 | 将这些约束落实到 schema guard、Domain invariant、Port result、transaction、adapter、negative test 和 acceptance mapping。 |
| CP06 的唯一 rule / capability source consumer owner，以及 CP07 仅消费 committed resolution / gap。 | 定义 source-specific Consumer、resolution read Port、projection input、dedup / freshness / conflict handling；不新增 CP02 / CP07 direct source consumer。 |
| summary、diagnostics、optional capability outlet 与 projection rebuild / reconcile 边界。 | 定义 view schema、watermark、visibility、stale / unavailable surface、rebuild input / cursor / report；`available`不得扩大为授权或执行就绪。 |
| 配置只影响 bootstrap / Application 注入的 Port、Job、可选投影和 validated typed input。 | 定义 effective config、validation、provenance、builder、adapter / job config 和 config error；具体 key / default / format 留给 `04`。 |

## 5. 概要设计回退规则

如果详细设计发现已列主语需要新增、删除、合并、改名、改变 owner 或改变其之间的正常传播方向，说明概要设计尚未真正收稳。必须先回到对应概要 Step 修正中间产物并重做受影响审计；不得在 `03-详细设计.md` 中以私有类型、额外 DTO、generic record、adapter special-case 或“实现细节”暗改。

| 详细设计发现的变化 | 必须回退位置 | 不允许的规避方式 |
|---|---|---|
| 需要改变项目型执行主语、truth owner、外部边界、依赖分类或 body 规则。 | Step 1~3；必要时回到正式 `00` / `01` 及对应上游 owner。 | 以 config、adapter、默认值或 ref string 伪造新边界。 |
| 需要新增 / 删除业务主要组成部分，或让 adapter / Job / Store 取得业务组成部分 owner。 | Step 4~5。 | 新建“共享 MemberService”或 mega aggregate 吸收跨 CP 职责。 |
| 需要新增 / 删除 / 合并关键对象，或给 view / ref / external owner 赋予 local lifecycle。 | Step 6。 | 用匿名 map、untyped payload、generic record 或 projection 字段隐藏新对象。 |
| 需要新增 / 删除 Command、Query、Consumer、semantic Event、Job 或改变接口类别。 | Step 7。 | 将写行为塞进 Query、将 source update 写成 generic Consumer，或把逻辑 Event 当已闭口 route。 |
| 需要改变处理流顺序、local commit 与 side effect 的边界、feedback 传播方向或 CP06 / CP07 单向关系。 | Step 8。 | 在 adapter、retry、job 或 callback 中反向改写 source truth。 |
| 需要新增状态族、改变状态含义 / 禁止迁移、把 unknown / gap / stale 静默升级。 | Step 9。 | 用 retry 次数、时间、缓存、默认成功或配置开关修改状态语义。 |
| 需要放宽 forbidden-body、fail-closed、duplicate / late、projection 或 pending seam 的处理边界。 | Step 10。 | 将原始正文、secret、definition body、complete log 或 external success 补进 member record / view。 |
| 需要改变配置影响面，或允许配置绕过 owner、状态、安全、history、source-owner 或 pending 红线。 | Step 11。 | 以 environment key、feature flag、profile 或 deployment 参数突破领域约束。 |

## 6. 不进入本承接清单的内容

`L2M-UP-001~008` 以及下列未闭合项不属于稳定的详细设计输入。它们必须在 Step 13 作为风险 / 待确认事项按影响和 fail-closed 口径记录；它们的精确合同只能由相应上游或并行兄弟项目在获得 authority 后提供。

| 不进入稳定承接项 | 原因与后续归属 |
|---|---|
| `L2M-UP-001` host registration / feedback / IPC / credential direction；`L2M-UP-006` credential owner contract | 需求级 owner 分工已经成立，但 exact carrier、field、credential 与 positive integration 未闭口；Step 13 记录 pending，03 只能定义 blocked-aware logical Port。 |
| `L2M-UP-002` image release、manifest、pinned entry、compatibility、handoff / confirmation | image supply truth 属于 sibling；不形成 member business object 或 package dependency；Step 13 记录 pending。 |
| `L2M-UP-003/004` Runtime entry mapping、handoff / source family、出站方向 | Runtime loop / run / context / plan / outcome 不归 member；精确 mapping 未闭口；Step 13 记录 blocked seam。 |
| `L2M-UP-005` member-specific Core schema / event family / route | 不得从 CloudEvents / W3C / old README 推导 type、source、subject、payload 或 route；Step 13 记录 schema / route pending。 |
| `L2M-UP-007` policy effective / screening taxonomy | member 只消费 formal result / safe snapshot；local allowlist、default pass 或 rule body 不可承接；Step 13 记录 source pending。 |
| `L2M-UP-008` 非项目型 / personal 运行主语 | 当前无 authority 定义第三种主语；只保留 fail-closed；Step 13 记录 subject scope pending。 |
| 完整协议 schema、物理 transport、DB / queue / scheduler / deployment 产品、配置 key / default / secret、具体 retry / retention 数值 | 分别留给 03 的实现契约、04 的配置说明和后续经批准的技术决策；本步不选边。 |
| 完整测试用例、测试结果、验收证据、实施 phase / commit boundary、排期或提交策略 | 分别留给 `05`、`06`、`07`；本步不伪造 run、report、evidence、verdict、signoff 或 readiness。 |

## 7. 当前材料诊断与设计取舍

| 风险 / 旧材料倾向 | 未采用做法 | 本步取舍 |
|---|---|---|
| 旧 `03` 或 README 中的 CloudEvents、AG-UI、UDS、launch token、具体进程 / SLA 线索容易回流。 | 将历史载体和性能 / 部署假设当作 03 的稳定协议输入。 | 只承接 Step 4~11 已复核的 transport-neutral 逻辑槽位；历史材料继续留作污染审计输入。 |
| 详细设计可能因需要字段或 adapter 而重划主语。 | 以“实现细化”为由新增 owner、对象、Consumer 或状态。 | 用 §5 回退表要求先回到对应概要 Step；03 只细化已收稳主语。 |
| 开放 seam 可能被列入“未来要实现”的稳定项。 | 把 pending schema、route、host / Runtime / image 正向合同写进承接清单。 | `L2M-UP-001~008` 全部排除到 Step 13；03 只能写 fail-closed / blocked-aware 契约。 |
| 测试、配置与实施边界混入承接表。 | 以任务、默认值、测试全集或 commit plan 代替设计输入。 | 只列将由 03 定义的结构性契约和未来测试切口，不形成 04~07 的正式内容。 |

## 8. 回填草稿

正式 `02-概要设计.md` 的 §12 应：

1. 使用 §4 的两列详细设计承接清单表作为主体；
2. 摘录 §2 中七个组成部分、34 个对象、`10 / 16 / 14 / 24 / 5` 分类、流与状态的稳定范围；
3. 摘录 §3 的对象 / 协议 / 事务 / 配置 / 测试继续展开方向；
4. 保留 §5 的明确回退规则：详细设计发现主语变更必须先回退概要设计，不能暗改；
5. 不把 §6 的开放项写成稳定结论，转由 Step 13 记录风险与待确认事项；
6. 不写开发任务、排期、完整 schema、配置 key、测试用例全集、实现结果或 readiness。

## 9. Step 12 停审与进入下一步条件

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 4~11 稳定输入覆盖 | pass | 七个组成部分、9 个 Application Service、34 个对象、`10 / 16 / 14 / 24 / 5` 接口分类、处理流、状态、异常与配置均可回指。 |
| 详细设计展开方向清楚 | pass | 对象 / 状态、协议 / Port / adapter / transaction、配置 / 错误 / 测试切口均已定义到03的职责边界。 |
| 主语与 owner 不被重新发明 | pass | §5 对 Step 1~11 的回退点逐项明确；不允许以实现细节暗改。 |
| pending 诚实性 | pass | `L2M-UP-001~008` 未进入稳定承接项，统一留给 Step 13。 |
| 未越界进入后续文档 | pass | 未写正式03、04、05、06、07内容，未写开发任务、排期、测试结果、证据或实施结论。 |
| 正式正文写入门禁 | hold | 正式 `02-概要设计.md` 只能在 Step 14 从空文件重建；本 Step 不修改它。 |

Step 12 结论为 `completed / pass / stop_review`。下一允许动作是读取 Step 13 的 SOP 与书写规范输入，更新三层台账到 `risks_open_questions` 并创建 `02_hld_step_13_risks_open_questions.md`；不得提前创建 Step 14 或改写正式 `02-概要设计.md`。
