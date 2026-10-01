# Step 1 · 确认需求基线

> 文档：`01-架构设计.md`  
> 架构主题：确认哪些需求结论已经足以支撑架构推导，以及哪些仍需保持 pending / blocked。  
> 当前状态：已完成本 Step 的问题回答、历史诊断、取舍、结构化产物、回填草稿和自检；允许进入 Step 2。  
> 约束：本文件只提炼架构前提，不重写需求文档，不定义容器、协议、DTO、代码目录或技术实现。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 · 确认需求基线 |
| 输入 | `projects/L5-chat/00-需求文档.md`；`00_req_step_01_upstream_relation.md`；`00_req_step_02_position_boundary.md`；`00_req_step_04_goals_non_goals.md`；`00_req_step_07_core_capability_loop.md`；`00_req_step_11_data_requirements_ownership.md`；`00_req_step_12_interfaces_dependencies.md`；`00_req_step_13_non_functional_requirements.md`；`00_req_step_14_acceptance_criteria.md`；`00_req_step_15_risks_open_questions.md`；`00_req_step_16_traceability_matrix.md`；全局依赖规则；已停审上游 01 架构边界；`draft/01~03` |
| 直接回填 | 正式 `01` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵 |
| 不在本步完成 | 架构目标、职责表、系统上下文图、子域、容器、依赖图、数据策略、通信方式、技术选型、ADR 正文 |
| 当前 gate | `pass` |

## 2. SOP 问题回答

### 2.1 当前架构依赖哪些需求结论？

当前架构推导依赖以下已收稳的需求结论：

1. `L5-chat` 是客户端产品层，拥有 UI、页面、导航、路由、view model、client store、草稿、选择/焦点、展示缓存、恢复语境、可访问性和跨端体验。
2. `L0-sdk` 是唯一业务接入边界；Chat 不直接访问 owner 私有 API、内部 bus、共享数据库或 sibling package。
3. Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime 和 Observability truth 分别归正式 owner；Chat 只消费安全 view、summary、ref、preview、receipt、result 和正式 change。
4. Chat 的核心能力闭环为：N1 安全协作语境进入与保持；N2 正式协作事实安全显化；N3 用户意图受控发起与结果反馈；N4 变化、失败、离线与恢复连续性。
5. 客户端必须区分 route/context、selection、draft、local intent/attempt、submitted/pending、confirmed/rejected/failed/unknown、fresh/stale/partial/unavailable/blocked/reconnecting 等不同状态语义。
6. 按钮点击、表单校验、HTTP/WebSocket/AG-UI ACK、通知、toast、optimistic state、缓存命中和平台连接状态都不能代表 owner 业务成功。
7. 业务变化只能经 SDK 暴露的正式 change/event/resume 进入；Chat 不猜 topic、offset、顺序或 bus delivery。
8. Chat 可持有的数据分为 Chat-owned local truth、owner safe display snapshot、external ref 和 forbidden body 四类；外部正文、凭据、secret、runtime/provider/tool/bridge/observability raw body 不进入 Chat 数据生命周期。
9. actor、scope、visibility、授权语境不可验证、过期、撤销或冲突时，客户端必须 fail-closed；缓存和离线状态不能延长授权。
10. V1 采用 Desktop-first；Web 保留共享 UI 扩展面，Mobile 暂为后续候选。平台 shell 只提供窗口、输入、通知、存储、深链和辅助技术能力，不改变业务语义。

### 2.2 哪些需求结论已经稳定？

| 架构前提 | 稳定性 | 架构含义 |
|---|---|---|
| 客户端产品定位 | 已稳定 | 架构主语必须是客户端产品结构，而不是 Conversation 或 SDK 服务。 |
| owner truth 分离 | 已稳定 | 所有内部单元都只能持有 local state 或 owner-derived safe material。 |
| SDK-only 业务接入 | 已稳定 | 外部接缝必须收敛为 SDK adapter；私有 API、内部 bus 和共享数据库是禁止路径。 |
| N1～N4 能力闭环 | 已稳定 | 架构单元、运行承载和横切约束必须能够承接四个节点。 |
| 状态轴分离 | 已稳定 | 架构不能用一个总状态压平可见性、新鲜度、传输、命令和本地体验。 |
| fail-closed 与 cache-not-authority | 已稳定 | 权限失效、恢复和离线必须在结构上允许收紧、过期和阻塞。 |
| Desktop-first 产品范围 | 已稳定为当前产品方向 | 当前架构优先保证 Desktop shell 与共享 core 的语义闭合；Web/Mobile 不得反向扩大 V1。 |
| 禁止正文与低敏诊断边界 | 已稳定 | 数据边界、存储承载和诊断接缝不能把 raw body 或 secret 带入客户端。 |

### 2.3 哪些需求仍然待确认？

| 待确认需求 | 当前状态 | 对架构的影响 |
|---|---|---|
| `CHAT-UP-001`：SDK typed query/command/event/ref、error、receipt、resume、redaction 和 retry surface | `blocked / pending` | 只能定义 SDK adapter 的架构角色，不能固化 exact API、DTO 或事件 schema。 |
| `CHAT-UP-002`：Conversation visibility、scope、分页、cursor、change identity 和 resume 消费合同 | `blocked / pending` | 只能定义正式变化消费与恢复边界，不能宣称某种 transport 或 cursor 已成立。 |
| `CHAT-UP-003`：Governance Gate/Decision 授权语境、receipt、幂等和 Decision event | `blocked / pending` | Gate interaction 只能作为受控意图边界，不能在架构层声称确认闭环已就绪。 |
| `CHAT-UP-004`：Artifact safe ref、preview、版本和 visibility contract | `blocked / pending` | 只能定义安全预览 / 引用接缝，不能把 Artifact body 或版本血缘纳入客户端。 |
| `CHAT-UP-005`：Workspace safe view、freshness、attention、cursor 和 export contract | `blocked / pending` | Workspace 消费只能保持 source-aware、stale/partial/blocked，不能在 Chat 重新聚合。 |
| `CHAT-UP-006`：Identity、Work、Member、Runtime 摘要层级与来源 | `blocked / pending` | 跨 owner view composer 只能组合已获准摘要，不能自行推断生命周期或完成结论。 |
| `CHAT-UP-007`：Observability 低敏诊断、correlation/ref、handoff 和 sink 隔离 | `blocked / deferred` | 只能保留低敏诊断意图与隔离接缝，不能直写 backend 或把 UI 日志当 observation truth。 |
| `WS-UP-001~008` | `blocked / open` | Workspace 相关架构不得把 safe view、attention、freshness、cursor 或 export 缺口润色为 ready。 |
| `CHAT-NF-Q-001~005` | `open` | 精确性能、SLO、兼容矩阵、诊断 envelope 和 owner quality authority 不能在架构层伪造数字。 |
| `CHAT-AC-Q-001~004` | `open` | 正向 owner contract、数值验收、跨端支持组合和诊断证据粒度保持条件化。 |
| `OPEN-CHAT-009~012` | `open` | 平台/辅助技术矩阵、持久化上限、跨端恢复差异和诊断关联粒度继续挂起。 |

### 2.4 哪些需求会直接影响架构边界？

| 需求结论 | 直接影响的架构判断 |
|---|---|
| Chat 不拥有 owner truth | 决定核心语义必须是 Chat-local experience，而不是复制 Conversation/Governance/Artifact/Workspace/Runtime 子域。 |
| SDK-only 接入 | 决定所有外部业务能力必须通过单一 SDK adapter seam 进入；跨仓关系不能下沉为源码依赖。 |
| N1 安全进入 | 决定 session/scope/visibility 语境必须是入口和路由边界的前置条件。 |
| N2 安全显化 | 决定 view model 与 renderer 只承接 safe view/ref/summary，并携带来源/版本/visibility/freshness。 |
| N3 受控意图 | 决定 command intent coordinator 与 owner receipt/result 必须独立于 presentation、transport 和本地 optimistic 状态。 |
| N4 变化与恢复 | 决定 formal change consumer、reducer、cache/recovery 和 platform lifecycle 必须拆开表达。 |
| Desktop-first 与跨端语义 | 决定共享客户端 core 与 shell 能力适配分层，不能让平台差异改变业务状态语义。 |
| forbidden body 与最小披露 | 决定本地持久化、诊断、通知、deep link、剪贴板和预览必须受安全边界约束。 |

### 2.5 哪些需求会直接影响数据所有权？

| 需求结论 | 数据所有权后果 |
|---|---|
| Chat-owned local state 明确列举 | route/context、selection/focus、draft、attempt、recovery、display preference 可由 Chat 负责。 |
| owner safe snapshot 只能被消费 | safe view、summary、preview metadata 和 source marker 是外部来源影子，不得转成 Chat truth。 |
| external ref 不转移 ownership | Conversation/Turn、Gate/Decision、Artifact、Workspace、Runtime、Observability ref 只能提供回链。 |
| forbidden body 禁止进入生命周期 | 不得设计 body 存储、共享正文缓存、raw diagnostics 或本地复制版本链。 |
| cache 不延长 visibility | cache 必须携带版本/可见性/新鲜度语境，并允许撤销、过期和清理。 |

### 2.6 哪些需求会直接影响依赖方向或一致性策略？

| 需求结论 | 依赖 / 一致性后果 |
|---|---|
| L0-sdk 是唯一业务边界 | Presentation、view model、store 和 shell 不得反向依赖 owner 仓或 bus。 |
| formal change 只能经 SDK | reducer 依赖 adapter 输入，不依赖 broker、topic、offset 或内部事件结构。 |
| owner result 才能收口业务状态 | local intent、transport ACK、receipt/result 和 owner confirmed 必须分层，unknown 不能盲重放。 |
| 跨 owner 展示必须保留各自来源 | view composer 允许组合展示，但不形成跨域聚合真相；任何一源失败只局部降级。 |
| cache/recovery 是 Chat-local | 本地恢复只能重新查询、重连或显示受限旧视图，不能回写 owner truth。 |

## 3. 历史材料诊断与差异结论

旧 `01-架构设计.md` 的主要污染项如下：

| 历史口径 | 问题 | 本 Step 处理 |
|---|---|---|
| 将 Chat 作为多域业务对象编织的“统一业务界面” | 容易把展示层写成 owner truth 或跨域聚合 owner | 架构基线只承认 Chat-local experience 与 owner safe material 组合。 |
| 固定 group/channel/dm/thread 为协议级结构，并保留 AG-UI 17、SSE/WS 候选 | 把产品体验分类和传输技术提前变成架构事实 | 仅保留语境和正式 change/resume 能力，协议后置到 SDK/后续文档。 |
| `<500ms`、`<2s`、`≥99.9%`、`500+`、10w 等数字 | 当前无 authority、workload 和 evidence | 只保留行为级质量口径，数值保持 `CHAT-NF-Q-*`/`OPEN-CHAT-*`。 |
| “GateCard 审批”与点击/ACK 直连 | 混淆 UI intent、transport 和 Governance result | 只允许受控意图 + receipt/result/unknown 分层。 |
| “员工登录视图”被当作 Chat 业务能力 | 可能侵入 Identity、host、session 或 credential owner | 只保留 safe actor/member entry state，不定义认证、生命周期或宿主登录 truth。 |
| 组件、timeline registry、前端模块名被提前固化 | 将概要/详细实现结构提前写入架构基线 | 仅保留架构角色与单元候选，exact component/route/DTO 后置。 |

## 4. 架构硬约束候选清单

下列约束直接由已确认需求推导，后续 Step 2～15 必须承接，不能在整理阶段弱化：

| ID | 架构硬约束 | 保护的需求边界 |
|---|---|---|
| `AB-CHAT-001` | Chat 的核心架构主语是客户端产品体验与本地交互状态，不是任何 owner 业务 truth。 | `G-CHAT-001/002`、`NG-CHAT-001` |
| `AB-CHAT-002` | 所有业务 query、command、formal change 和 ref 必须经 `L0-sdk` 正式接入；不直连 owner 私有 API、内部 bus 或共享数据库。 | `G-CHAT-002/008`、`BR-CHAT-018/021/022` |
| `AB-CHAT-003` | owner-derived view、safe summary、preview metadata 和 ref 必须保留来源、版本/水位、visibility 和 freshness；本地组合不生成跨域 truth。 | `G-CHAT-005`、`BR-CHAT-007~013` |
| `AB-CHAT-004` | Chat-owned local state 只包括 route/context、selection/focus、draft、attempt、recovery、display preference 和明确的客户端状态轴。 | §11 数据归属、`BR-CHAT-004/014/024` |
| `AB-CHAT-005` | presentation、view model、store、SDK adapter、change reducer 和 platform shell 必须保持职责分离；平台 shell 不能改变业务语义。 | `G-CHAT-006/007`、`BR-CHAT-028` |
| `AB-CHAT-006` | local intent、transport ACK、receipt/result、owner confirmed、formal change 和 local cache 必须是独立状态来源；unknown 不得盲重放副作用。 | `G-CHAT-004`、`BR-CHAT-014~020` |
| `AB-CHAT-007` | 变化、分页、重连、恢复、离线展示和缓存失效必须允许 duplicate/乱序/gap/expired/revoked/stale/blocked/unknown 等姿态显式存在。 | `G-CHAT-006`、`BR-CHAT-021~026` |
| `AB-CHAT-008` | actor/scope/visibility 无法验证、过期、撤销或冲突时，架构必须支持 fail-closed、清理或受限展示，不以缓存或深链放行。 | `G-CHAT-007`、`BR-CHAT-001~006` |
| `AB-CHAT-009` | 外部正文、credential/token/secret、raw log、provider/tool/runtime/bridge body 和未脱敏 payload 不进入 Chat 持有、缓存、诊断或 handoff 生命周期。 | `BR-CHAT-010/027`、NFR-CHAT-008~014 |
| `AB-CHAT-010` | 架构层不锁定 API path、DTO、事件 schema、topic、transport、代码目录、数据库或具体测试/运行事实；未确认项进入风险/待确认。 | `OPEN-CHAT-*`、`CHAT-AC-Q-*` |

## 5. 未关闭需求风险清单

| 风险 | 架构影响 | 当前保守口径 | 是否阻塞架构推导 |
|---|---|---|---|
| SDK public surface 漂移 | adapter、view model、reducer 和 shell 接缝可能反复变化 | 只定义能力级边界和 adapter 角色，不写 exact callable surface | 有条件阻塞正向接口细化，不阻塞边界级架构 |
| Conversation / Workspace cursor 与 visibility 合同未闭合 | change consumer、recovery 和本地缓存无法宣称实时闭环 | 采用 formal change/resume、局部 stale/gap/blocked/requery 语义 | 阻塞 exact transport/contract，不阻塞容器角色 |
| Governance receipt / idempotency / Decision event 未闭合 | Gate interaction 可能误报 confirmed 或重复副作用 | 维持 submitted/pending/unknown/read-only，确认依赖 owner result | 阻塞正向审批闭环，不阻塞受控入口架构 |
| Artifact safe preview / ref 未闭合 | preview adapter 可能越权带入正文或版本真相 | 只保留 body-free ref/summary/preview-unavailable seam | 阻塞 preview exact contract，不阻塞展示边界 |
| 跨 owner 摘要层级未对齐 | view composer 可能串成员、项目和运行生命周期 | 分域 safe view、显式来源、局部降级，不跨域推断 | 不阻塞架构单元，阻塞聚合语义闭口 |
| Workspace open contracts | attention/freshness/export 不能在 Chat 侧重建 | 只消费正式 workspace safe view；缺失时 blocked/stale/unavailable | 阻塞 Workspace 正向接入，不阻塞 Chat shell/core 分层 |
| 精确 NFR、兼容矩阵和诊断 envelope 缺 authority | 无法在架构层固定性能/可用性/支持设备数值 | 保留行为级安全、局部隔离、有界恢复和等价可访问性 | 阻塞数值化和 exact evidence，不阻塞结构目标 |
| Mobile/多端支持组合尚未闭合 | shell 能力差异可能造成业务语义漂移 | Desktop-first；Web shared UI；Mobile 仅候选 adapter | 阻塞兼容矩阵，不阻塞共享 core + shell 方向 |

## 6. 架构可推导性判断

| 判断项 | 结论 |
|---|---|
| 是否足以进入架构目标讨论 | 是。产品边界、核心闭环、owner separation、SDK-only 和状态语义已稳定。 |
| 是否足以固化 exact API / DTO / protocol | 否。`CHAT-UP-*`、`WS-UP-*` 和 SDK surface 尚未闭合。 |
| 是否足以确定架构责任层和内部单元 | 是。可按体验核心、外部接缝、局部状态、变化恢复和平台 shell 组织。 |
| 是否足以确定数据真相归属 | 是。Chat-local / safe snapshot / external ref / forbidden body 已明确。 |
| 是否足以确定具体部署产品、框架和协议 | 否。只能在架构层讨论技术机制和候选路径，具体产品留待后续文档/authority。 |
| 是否需要将未确认项写入风险 | 是。所有 exact surface、数值、兼容矩阵、持久化和诊断 envelope 都必须保持 open。 |

## 7. 正式回填草稿

### 7.1 §1 与上游文档的关系声明（Step 1 贡献）

本文首先承接 `projects/L5-chat/00-需求文档.md` 已停审的需求基线，再结合 `L0-sdk` 以及 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime、Observability 当前正式 owner 边界，把需求层的客户端定位、SDK-only 接入、local state ownership、safe view 消费和失败/恢复语义转译为架构结构。本文不重新定义这些 owner 的业务 truth、授权、状态、事件或持久化语义，也不把 `L6-bridges` 未停审设计作为正式输入。

### 7.2 §3 约束条件（Step 1 贡献）

架构设计必须保持以下不可变前提：Chat 只拥有客户端体验和局部状态；业务能力只能经 `L0-sdk` 进入；owner-derived material 只能以 safe view/ref/summary/preview 形态被消费；按钮、ACK、缓存和连接状态不构成业务成功；unknown、stale、gap、revoked、blocked 和 unavailable 必须能在结构上表达；客户端不持有外部正文、凭据或未脱敏运行/观测材料。当前阶段可接受 Desktop-first、Web/Mobile 支持面收缩和 exact owner surface 延后，但不得把这些取舍写成 owner truth、readiness 或已闭合协议。

### 7.3 §16 需求追溯矩阵（Step 1 贡献）

| 需求基线 | 架构承接方向 | 后续章节 |
|---|---|---|
| `G-CHAT-001/002` 与 `AB-CHAT-001~003` | 客户端产品边界、SDK-only 接入和来源保持 | §4、§5、§8、§9 |
| `G-CHAT-003/004` 与 `AB-CHAT-006` | 显化核心、意图/结果分层和 formal change 处理 | §6、§9、§10 |
| `G-CHAT-005/007` 与 `AB-CHAT-003/008/009` | safe view、fail-closed、最小披露和 forbidden body | §4、§5、§9、§13 |
| `G-CHAT-006/008` 与 `AB-CHAT-005/007/010` | 共享 core、变化恢复、跨端 shell 和 pending contract | §6～§14 |

## 8. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否逐项回答需求基线、稳定性、待确认和架构影响问题 | pass | §2.1～§2.6 已覆盖。 |
| 是否区分稳定需求与 pending / blocked 需求 | pass | `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 保持原状态。 |
| 是否完成旧 `01` historical 污染诊断 | pass | 旧指标、协议、组件和职责越界已列明处理口径。 |
| 是否把需求层结论转译为架构前提而非实现细节 | pass | 未定义 API、DTO、schema、代码目录、数据库或测试结果。 |
| 是否新增未确认 owner truth 或数值承诺 | pass | 没有；所有精确 surface 与数值继续挂起。 |
| 是否完成正式回填草稿 | pass | §1、§3、§16 的 Step 1 贡献已形成。 |
| 是否足以进入 Step 2 | pass | 需求边界足以支持架构目标与约束讨论；exact contract 仍在后续风险中保留。 |

## 9. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 需求基线、架构硬约束、未关闭需求风险和 Step 1 回填草稿已形成并通过自检。 | 创建并执行 Step 2 `01_arch_step_02_arch_goals_constraints.md`。 |
| 文档级 | `pass` | Step 1 足以支撑后续架构目标讨论；未确认项已显式保留。 | 进入 Step 2。 |
| 项目级 | `in_progress` | 用户已授权完整 `01`；当前仍处于 `01` 校准链，未允许进入 `02`。 | 继续串行完成 Step 2。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与诊断

1. 稳定前提是什么？00 F-CHAT-018～021 与 AC-FR-CHAT-011～014确立项目详情、流程下钻、双向入口、成员集合区分；OPEN-CHAT-013～015 未确认 SDK/owner 合同。
2. 原型能证明什么？只表达已认可的信息层级和交互意图，不能证明关系、审批、事件或 SDK 已实现。
3. 流程事实归谁？补读 L1-process/01 §2～§3确认 ProcessInstance、Activity、Token/Gateway 归 Process；Project/WorkItem 归 Work，Gate/Decision 归 Governance。00 OPEN-CHAT-014 未列出 Process，登记来源缺口，不能假定 Work/Governance 单独提供流程真相。
4. 公司人员是否等同 GlobalMember？Identity 正式定位为平台级 AI 员工身份；“公司级目录”不代表人类/AI 全目录能力已正式提供，provider/授权范围仍待确认。

旧 §1 缺冻结原型和 Process 来源；其不得局部修补措辞属于前轮 full-restart，改成本轮逐章回归重审。

### 取舍、结构化结果与回填

采用当前 00、冻结原型交互决定、正式 owner 核对的来源分层。新增 Process 仅作为经 SDK 的消费 authority，不引入 package 依赖或 BPMN 引擎；绑定、流程版本/撤销和目录覆盖继续 blocked。

输入：00 §7～§16、原型停审/信息架构记录、L1-process/01 §2～§3、L0-sdk/01 §1～§3。回填 §1 来源表及说明。复杂度：来源表足够，无独立图。自检：需求编号有来源；原型不是 schema；不改已停审 00。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：当前需求与原型来源分层完成；新增流程 owner 缺口显式保留。
- next_allowed_action：进入 Step 2，重新读取其 SOP 与前序输入。
