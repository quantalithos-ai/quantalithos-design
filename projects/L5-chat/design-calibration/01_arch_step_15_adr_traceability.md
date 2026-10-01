# Step 15 · ADR 与需求追溯

> 架构主题：把 `L5-chat` 已停审的关键架构决定与需求、约束、风险和取舍来源连接起来，并建立长期 ADR 索引。
> 当前状态：已完成需求追溯矩阵、漏项检查、ADR 索引、逐决定停审和跨 ADR/追溯审计；允许进入 Step 16。
> 直接输入：Step 1～14 校准产物、`00-需求文档.md` §1～§16、`00_req_step_16_traceability_matrix.md`、`01_arch_step_14_risks_open_questions.md`。
> 本步限制：只做来源—承接—索引映射；不新增架构结论、不创建 ADR 正文、不把普通实现选择或未定事项升格为 ADR。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 · ADR 与需求追溯 |
| 前置门禁 | Step 14 `pass` |
| 本步目标 | 建立需求结论/约束到架构承接结果的正式映射，并索引长期关键决定。 |
| 本步输出 | 需求追溯矩阵、漏项检查表、ADR 索引、逐决定停审、跨架构单元总审计。 |
| 本步不展开 | ADR 正文、实现选择、任务、测试证据、未确认合同和新架构判断。 |
| 来源纪律 | 主矩阵只写已成立映射；未闭合关系进入漏项表和 Step 14 风险/待确认，不强行补齐。 |

## 2. SOP 问题回答

### 2.1 哪些架构决定需要沉淀为 ADR？

需要长期保留的决定是那些会持续影响 Chat 边界、owner truth、依赖方向、数据一致性、通信承接、跨端演进和安全恢复的决定：

- `L0-sdk` 作为唯一业务接入边界，外部语义不得直穿核心。
- Chat 只拥有局部客户端 truth，owner-safe 材料采用只读投影/引用，禁止外部正文入仓。
- 共享客户端语义 core 与平台 shell 分离，V1 Desktop-first 但不建立平台专属业务语义。
- 多轴状态和正式结果门控，unknown 不盲重放。
- formal change/resume 通过 SDK 异步承接，恢复和缺口采用后台延后收敛。
- 受限本地持久化、fail-closed、撤销/过期清理和最小披露。
- 跨域组合只做 safe material 显化，不创建 Chat 聚合 truth 或执行 Runtime/Tools/Bridges/Observability backend 职责。

### 2.2 每个决定对应哪些需求、约束、风险或取舍？

每项 ADR 都回指 `G-CHAT-*`、`N1~N4`、`AB-CHAT-*`、`BR-CHAT-*`、`NG-CHAT-*`、`RISK-CHAT-*`、`CHAT-UP-*` 或 Step 11 的方案取舍。映射只引用已完成校准结果，不把 Step 14 的待确认项当成决定来源。

### 2.3 是否存在没有需求来源的架构设计？

当前主链没有孤儿架构决定。共享语义与 shell 分离、safe projection、结果门控、formal change/resume、受限缓存、fail-closed、低敏诊断和可访问性均可回溯到需求目标、边界约束、功能/规则或风险项。具体 React/Tauri/Capacitor、状态库、存储库和传输仍是候选，因此不进入 ADR。

### 2.4 是否存在没有架构承接的核心需求或约束？

核心 G/N/F/BR 需求均有架构承接；仍未闭环的 exact SDK/owner/platform/diagnostic/quality contracts 在漏项表中保留。它们不是被忽略，而是由于缺 authority 只能保持 pending/blocked/deferred/read-only/stale/unknown，不能用架构推测填补。

### 2.5 哪些取舍和红线必须长期可追溯？

必须长期追溯的红线包括 SDK-only、禁止 owner truth 复制、禁止内部 bus 直订、禁止正文/secret/raw log、结果门控、unknown 不重放、fail-closed、平台 shell 不改业务语义、Workspace/Observability/Runtime 不被 Chat 吸收，以及 Desktop-first 只是范围顺序而不是平台专属语义。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| 把 ADR 写成技术栈清单 | 普通实现选择占据长期决策索引。 | 只索引边界、真相、承接、结果和演进决定。 |
| 用章节编号对照代替需求追溯 | 看似覆盖，实际没有需求结论到架构结果的理由。 | 矩阵逐行写来源、具体结论、架构承接、位置和说明。 |
| 把未闭合 SDK/owner 问题写成 ADR | 未确认项被错误固化，阻碍后续校准。 | 未闭合项进入漏项/风险/待确认，不进入 ADR。 |
| 把普通 UI 功能当长期决策 | 功能清单与架构决定混淆。 | 只有跨边界、数据、通信、演进和安全长期影响的决定入索引。 |
| 在 Step 15 新增“统一聚合模型”或“已支持平台” | 正式装配阶段产生未讨论结论/ready 事实。 | 只引用前 1～14 Step 已通过内容。 |

## 4. 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` `G-CHAT-001`；`N1`；`F-CHAT-001~003` | 在正式 actor/scope/visibility 下提供 group/channel/dm/thread、项目和相关协作入口，并支持恢复、撤销和离开。 | 安全语境与导航支撑核心体验；route/context 是 Chat-local，scope/visibility 经 SDK 验证，失效时 fail-closed。 | §4 职责边界；§5 系统边界；§6 子域；§8 依赖；§9 数据；§10 交互；§13 横切 | 架构把入口需求转译为安全语境、局部路由和清理边界，没有把 route 当 owner truth。 |
| `G-CHAT-002`；`NG-CHAT-001~003`；`AB-CHAT-001~003`；`BR-CHAT-007~013/018/021~022` | owner truth 只能经正式 safe view/ref/result/change 消费；不得直连 owner、bus 或共享 DB。 | SDK-only 外部接缝、owner-safe 只读投影、依赖裁剪、禁止依赖和 forbidden body/write 红线。 | §4；§5；§6；§8；§9；§11；§13；§15 | 该映射直接保护 Chat 不形成 Conversation/Governance/Artifact/Workspace/Runtime 第二真相。 |
| `G-CHAT-003`；`N2`；`F-CHAT-004/008`；`BR-CHAT-007~013/021~026` | Turn 表现、线程关系、来源、新鲜度、变化、分页、缺口和不可见状态必须可理解。 | 协作体验语境、owner-safe material、来源/freshness、formal change/resume、stale/gap/partial/unavailable 状态。 | §6 子域；§9 数据；§10 交互；§11 技术机制；§13 横切 | 展示能力被定义为安全投影和变化承接，不是 Conversation lifecycle owner。 |
| `G-CHAT-004`；`N3`；`F-CHAT-009~012`；`BR-CHAT-014~020` | 草稿、选择、提交、optimistic、confirmed/rejected/failed/unknown 和重试边界必须区分。 | 受控协作意图核心子域、多轴状态、结果门控、unknown probe/等待、禁止盲重放。 | §6 子域；§8 依赖；§9 数据/一致性；§10 交互；§11 技术机制；§13 横切 | 统一承接 local intent 与 owner result，防止按钮/ACK/toast 成为业务完成。 |
| `G-CHAT-005`；`N2`；`F-CHAT-005~008`；`BR-CHAT-011~013` | GateCard、项目/成员/运行摘要和 Artifact 引用/预览必须在正式 visibility/Policy/治理结果允许时显化。 | safe projection/ref、来源和 visibility 保持、owner 分域展示、GateCard/Artifact 不拥有治理或正文 truth。 | §5 系统边界；§6 子域；§8 依赖；§9 数据；§10 交互；§13 横切 | 架构将跨域显化限制为安全消费材料和受控入口。 |
| `G-CHAT-006`；`N4`；`F-CHAT-013~016`；`BR-CHAT-021~026` | 正式变化、重复/乱序/缺口/cursor 失效、断线、Desktop 重启和离线展示必须有客户端语义。 | formal change/resume、连续性承接、受限本地状态、后台延后恢复、stale/gap/unknown/requery。 | §7 容器；§9 数据/一致性；§10 交互；§12 取舍；§13 横切；§14 演进 | 变化传播与恢复被分开于 owner truth 和本地投影，不保证离线业务成功。 |
| `G-CHAT-007`；`N1/N2/N3/N4`；`F-CHAT-017`；`BR-CHAT-001~006/027~028` | 无法验证语境时 fail-closed；敏感材料最小披露；核心路径支持键盘/辅助技术；诊断不泄露 raw body。 | fail-closed、最小披露、撤销/登出清理、共享可访问语义、低敏诊断 handoff 和平台 shell 隔离。 | §8 依赖；§9 数据；§11 技术机制；§13 横切；§15 风险 | 安全和可访问性被提升为跨边界架构约束，不留到 UI 末端。 |
| `G-CHAT-008`；`NG-CHAT-002/003`；`AB-CHAT-002/010`；`RISK-CHAT-001/002/003/007` | SDK gap、owner 合同和协议未闭合时必须可追踪，不以 Chat 私有协议填补。 | 依赖裁剪、候选/blocked 口径、风险/待确认台账和不新增未确认结论纪律。 | §8 依赖；§11 技术；§12 取舍；§14 演进；§15 风险 | 架构将缺口显式化，避免为了装配文档而虚构 surface/readiness。 |
| `00-需求文档.md` `NG-CHAT-004~008` | Chat 不做 Runtime/Tools/Sandbox、Bridges、Observability backend、IDE/复杂后台或未经授权指标。 | 职责排除、依赖裁剪、禁止依赖表、部署边界和不采用路径。 | §4；§5；§7；§8；§11；§12 | 非目标形成保护边界，不被重写成后续 Chat 主线。 |
| `00-需求文档.md` `BR-CHAT-014~020`；`AC-CHAT-003` | 本地意图、transport ACK、receipt/result 和 owner confirmed 必须分层。 | 结果门控、多轴状态、同步接收 + 异步结果、unknown 挂起。 | §9 数据；§10 交互；§11 技术；§13 横切 | 追溯到交互/数据/机制三处，未把单个 UI 行为当架构决定。 |
| `00-需求文档.md` `BR-CHAT-021~028`；`AC-CHAT-004` | formal change/resume、重复/乱序/gap、缓存失效、诊断和撤销必须可解释。 | 连续性承接、受限投影、低敏观测、fail-closed 和恢复阶段。 | §7；§9；§10；§13；§14 | 变化与恢复主线承接了需求，不依赖内部 bus 或 raw log。 |
| `00-需求文档.md` `AC-DR-CHAT-001~005`、`AC-NFR-CHAT-001~007` | 数据归属、禁止正文、安全、追溯、幂等、可观测、可访问和跨端语义需具备架构承接。 | 数据归属表、禁存/禁写红线、横切约束、技术机制、演进触发和风险挂起。 | §9；§11；§13；§14；§15 | 精确数值/证据缺 authority 的部分保留在风险和待确认，不伪造验收。 |

## 5. 追溯漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 承接关系未闭环 | `CHAT-UP-001` SDK exact surface 与 `G-CHAT-002/008` 的实现级承接 | SDK 接缝、后续概要/详细设计和正向能力 | 架构级已承接；exact contract 未闭环 | 当前只能追溯到能力级边界和风险台账，不能主观补 DTO/API/schema。 |
| 承接关系未闭环 | `CHAT-UP-002` Conversation visibility/cursor/resume 与 `G-CHAT-003/006` | Turn 变化、重连、分页和恢复 | 架构级已承接；消费合同 pending | stale/gap/requery/unknown 已收稳，但正式 owner 语义仍需确认。 |
| 承接关系未闭环 | `CHAT-UP-003` Governance receipt/idempotency/result 与 `G-CHAT-004/005` | GateCard、治理意图和 confirmed | 架构级已承接；正向 result blocked | 不把 GateCard 点击或 ACK 追溯成 Decision confirmed。 |
| 承接关系未闭环 | `CHAT-UP-004` Artifact preview/ref/visibility 与 `G-CHAT-005` | Artifact 引用/预览、正文边界 | 架构级已承接；preview contract pending | 只追溯 safe ref/summary/preview-unavailable。 |
| 承接关系未闭环 | `CHAT-UP-005`、`WS-UP-001~008` Workspace view/export/attention 与 `G-CHAT-001/005/006` | Inbox、跨项目摘要、恢复和 attention | 架构级已承接；Workspace safe surface blocked | 不在 Chat 生成 projection/attention truth。 |
| 承接关系未闭环 | `CHAT-UP-006` Identity/Work/Member/Runtime 摘要来源与 `G-CHAT-005` | 跨域摘要、成员/项目/运行卡片 | 分域承接已成立；层级对齐 pending | 暂不建立跨 owner 统一生命周期。 |
| 承接关系未闭环 | `CHAT-UP-007`、`OPEN-CHAT-012` 诊断 envelope 与 `G-CHAT-007/008` | 低敏诊断、unknown/recovery 定位 | 低敏边界已承接；exact envelope deferred | 不把 UI log/raw payload 当 Observability truth。 |
| 架构判断缺来源 | 具体性能、SLO、兼容矩阵、持久化上限和诊断证据粒度 | `CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-008~012` | 保留为待确认，不进入已成立矩阵 | 缺 authority、工作负载或平台矩阵，不能补数字。 |
| 载体选择未闭环 | React/TypeScript、Tauri、Web/Mobile shell 和具体状态/存储库 | §11、§12、§14 及后续概要设计 | candidate/deferred | 架构机制已追溯，具体载体不是当前 ADR。 |

## 6. ADR 索引表

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| `ADR-CHAT-001` | 以 `L0-sdk` 作为唯一业务接入边界，外部语义经正式接缝进入 | 防止页面/核心直连 owner 私有 API、内部 bus 或共享 DB | 职责边界 / 依赖方向 / 关键交互 | 长期决定 Chat 如何接入所有 owner 能力，需独立保留；来源：`G-CHAT-002/008`、`AB-CHAT-002`、`NG-CHAT-002/003`、`RISK-CHAT-001`。 |
| `ADR-CHAT-002` | Chat 只拥有客户端局部 truth，owner-safe 材料以只读投影/引用消费 | 防止 Conversation、Governance、Artifact、Workspace、Runtime 等 truth 在客户端复制或反写 | 数据所有权 / 一致性 / 技术机制 | 长期决定真相与消费面的分层；来源：`G-CHAT-002/005`、`BR-CHAT-007~013/018`、`AC-DR-CHAT-*`。 |
| `ADR-CHAT-003` | 共享客户端语义 core 与平台 shell 分离，V1 采用 Desktop-first 范围 | 防止平台差异复制业务语义并阻塞跨端演进 | 容器部署 / 技术选型 / 备选取舍 / 演进 | 长期影响 Desktop/Web/Mobile 的承载边界；具体 shell 产品不属于该 ADR。来源：`G-CHAT-001/006/007`、`OPEN-CHAT-009~011`。 |
| `ADR-CHAT-004` | 使用多轴状态和正式结果门控，unknown 不自动重放 | 防止按钮、ACK、optimistic、缓存和连接状态被误报为业务成功 | 数据一致性 / 关键交互 / 横切韧性 | 长期决定发送、治理、恢复和审计解释；来源：`G-CHAT-004`、`BR-CHAT-014~020`、`RISK-CHAT-003/009`。 |
| `ADR-CHAT-005` | formal change/resume 通过 SDK 异步承接，缺口/恢复采用后台延后收敛 | 防止跨边界事实传播被强压进同步闭环或暴露内部 bus | 关键交互 / 技术机制 / 演进 | 长期决定变化、重连、分页和恢复主线；来源：`G-CHAT-003/006`、`BR-CHAT-021~026`、`RISK-CHAT-002`。 |
| `ADR-CHAT-006` | 采用受限本地持久化、fail-closed、撤销/过期清理和最小披露 | 支持重启/草稿/离线展示，同时不延长授权或保存 forbidden body | 数据所有权 / 安全 / 韧性 / 横切 | 长期决定本地缓存、恢复和隐私边界；来源：`G-CHAT-006/007`、`BR-CHAT-001~006/027`、`RISK-CHAT-009`。 |
| `ADR-CHAT-007` | 跨域卡片和预览只显化 safe view/ref/summary/preview，不创建聚合 truth | 防止 GateCard、Artifact、Workspace、Member、Project、Runtime 显化吸收 owner 生命周期 | 子域 / 数据 / 交互 / 备选取舍 | 长期决定客户端展示组合和 owner 隔离；来源：`G-CHAT-005`、`BR-CHAT-011~013`、`CHAT-UP-004/005/006`。 |
| `ADR-CHAT-008` | 未闭合 SDK/owner/platform/diagnostic 合同保持显式 blocker，不建立 Chat shadow contract | 防止正式装配或实现阶段脑补 readiness、数字、协议和证据 | 风险 / 演进 / 追溯 / 变更控制 | 长期决定缺口处理纪律；来源：`G-CHAT-008`、`AB-CHAT-010`、`RISK-CHAT-001/010`、Step 14 风险/待确认表。 |

## 7. ADR 逐项停审记录

| ADR | 对应架构单元 / 跨单元审计 | 需求/约束/风险来源 | 长期性判断 | 停审 |
|---|---|---|---|---|
| `ADR-CHAT-001` | 外部接缝角色；A～G 依赖总审计 | `G-CHAT-002/008`、`AB-CHAT-002`、`RISK-CHAT-001` | 影响所有 owner 接入和后续演进，不是局部实现。 | `pass` |
| `ADR-CHAT-002` | A/F/G 数据归属与跨数据审计 | `G-CHAT-002/005`、`BR-CHAT-007~013`、`AC-DR-CHAT-*` | 影响所有消费面、缓存和正文边界。 | `pass` |
| `ADR-CHAT-003` | Step 6 容器 + E 平台单元 + Step 13 演进 | `G-CHAT-001/006/007`、`OPEN-CHAT-009~011` | 影响跨端承载和业务语义一致，不是 shell API 选择。 | `pass` |
| `ADR-CHAT-004` | B 意图单元 + 数据/交互/韧性总审计 | `G-CHAT-004`、`BR-CHAT-014~020`、`RISK-CHAT-003` | 影响副作用、治理、恢复和审计解释。 | `pass` |
| `ADR-CHAT-005` | D 连续性单元 + Step 9 通信审计 | `G-CHAT-003/006`、`BR-CHAT-021~026`、`RISK-CHAT-002` | 影响所有正式变化与恢复承接。 | `pass` |
| `ADR-CHAT-006` | C/G 安全与本地投影 + Step 12 横切审计 | `G-CHAT-006/007`、`BR-CHAT-001~006/027`、`RISK-CHAT-009` | 影响设备持有面、撤销、离线和隐私。 | `pass` |
| `ADR-CHAT-007` | A/F + Gate/Artifact/Workspace 跨上下文审计 | `G-CHAT-005`、`BR-CHAT-011~013`、`CHAT-UP-004~006` | 影响跨域产品入口和 owner 演进。 | `pass` |
| `ADR-CHAT-008` | Step 14 风险/待确认总审计 | `G-CHAT-008`、`AB-CHAT-010`、`RISK-CHAT-001/010` | 影响所有后续文档能否保持真实，不是项目管理偏好。 | `pass` |

## 8. 跨架构单元总审计

| 架构单元 | 职责边界 | 依赖方向 | 数据所有权 | 交互方式 | 横切约束 | ADR/追溯 | 结论 |
|---|---|---|---|---|---|---|---|
| A 协作体验语境 | 客户端显化，不拥有 owner truth | 只经编排/承接和 safe material | route/selection/focus 为 local truth；owner view 为 projection/ref | view 同步读取，owner change 异步，恢复后台 | 安全、来源、可访问、性能 | `ADR-CHAT-002/007`；G-CHAT-001~005 | `pass` |
| B 受控协作意图 | local intent/attempt 和结果姿态 | 只经 SDK 接缝出站，不直写 owner | draft/attempt local；receipt/result owner | 意图同步收口，结果异步/探测后台 | 结果门控、审计、unknown、幂等 | `ADR-CHAT-001/004`；G-CHAT-004 | `pass` |
| C 安全语境与导航 | 入口、路由、清理和安全位置 | SDK/platform 接缝，不裁决权限 | route/cleanup local；visibility owner | 入口同步判断，撤销异步，清理后台 | fail-closed、最小披露、AT | `ADR-CHAT-001/003/006`；G-CHAT-001/007 | `pass` |
| D 变化与恢复连续性 | formal change/resume、gap、reconnect、unknown | SDK formal boundary，不直订 bus | recovery metadata/projection local；change owner | 异步变化，后台恢复，受控 requery | 韧性、观测、性能、配置 | `ADR-CHAT-005/006`；G-CHAT-003/006 | `pass` |
| E 平台体验与可访问性 | shell/AT 宿主和等价表达 | 平台接缝，不改业务语义 | focus/capability local | 宿主同步/异步/后台能力 | 安全、可访问、跨端、配置 | `ADR-CHAT-003/006`；G-CHAT-006/007 | `pass` |
| F owner-safe 材料镜像 | 最小 safe view/ref/summary/preview/result/change | SDK-only，禁止私有 owner | projection/ref local；owner truth 外置 | safe query 同步，变化异步，预览/缺口后台 | redaction、追溯、性能 | `ADR-CHAT-001/002/007`；G-CHAT-002/005 | `pass` |
| G 本地展示与恢复投影 | 缓存、草稿、恢复快照和清理 | 技术承载边界，不共享 DB | local truth/projection；禁止正文/反写 | 本地同步，清理/恢复后台 | 最小披露、韧性、配置 | `ADR-CHAT-004/006/008`；G-CHAT-006/007 | `pass` |

## 9. 追溯与 ADR 审计

| 审计项 | 结果 | 证据 / 处理 |
|---|---|---|
| 是否有需求来源的架构决定 | `pass` | 八项 ADR 均回指 G/N/F/BR/AB/NG/RISK 或 Step 11 取舍。 |
| 是否有架构承接的核心需求 | `pass` | G-CHAT-001~008、N1~N4、F-CHAT 核心组和 BR/AC 组均有承接位置。 |
| 是否把未确认项写成 ADR | `none` | exact SDK/owner/platform/diagnostic/quality 项保留在漏项/风险/待确认。 |
| 是否把普通实现选择写成 ADR | `none` | React/Tauri/状态库/存储库/传输协议未进入 ADR。 |
| 是否有孤儿架构决定 | `none` | 所有长期决定都能回到依赖、数据、交互、横切、演进或取舍主线。 |
| 是否有孤儿核心需求 | `none` | 核心入口、owner 分离、Turn、意图、跨域显化、恢复、安全和 SDK gap 均已映射。 |
| 是否暴露追溯缺口 | `pass` | SDK/owner/platform/diagnostic exact contract 和数值 authority 在漏项表明确保留。 |
| 是否新增未确认结论 | `none` | Step 15 只重组前文已停审内容，无新架构判断。 |
| 是否完成跨单元总审计 | `pass` | A～G 的职责、依赖、数据、交互、横切、ADR 和追溯均无 unresolved 冲突。 |

## 10. 正式回填草稿

### 10.1 §16 需求追溯矩阵

需求追溯以 `G-CHAT-001~008`、`N1~N4`、`F-CHAT-001~017`、`BR-CHAT-*`、`AC-CHAT-*`、`AC-DR-CHAT-*`、`AC-NFR-CHAT-*`、`AB-CHAT-*` 和 `NG-CHAT-*` 为主轴，分别映射到职责/系统边界、子域、容器、依赖、数据所有权、一致性、通信、技术机制、横切、演进和风险章节。主矩阵只写已成立的来源—架构承接关系；`CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*` 和 `OPEN-CHAT-*` 的 exact 合同、数值、兼容和诊断缺口留在漏项与风险/待确认表，不被伪装成已闭环。

### 10.2 §17 ADR 索引

正式索引保留八项长期决定：`ADR-CHAT-001` SDK-only 正式接入；`ADR-CHAT-002` Chat-local truth 与 safe projection/ref；`ADR-CHAT-003` shared core + shell 分离和 Desktop-first；`ADR-CHAT-004` 多轴状态/结果门控/unknown；`ADR-CHAT-005` formal change/resume 与后台延后承接；`ADR-CHAT-006` 受限持久化/fail-closed/清理；`ADR-CHAT-007` 跨域 safe material 显化而不聚合 truth；`ADR-CHAT-008` 未闭合合同显式 blocker、不建 shadow contract。索引不表示 ADR 正文、代码或实现已存在，只为正式架构结果提供长期可回链的决定编号。

## 11. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否建立需求来源—架构承接映射 | `pass` | 主矩阵逐项写出来源、具体结论、架构结果、位置和理由。 |
| 是否暴露追溯缺口 | `pass` | exact SDK/owner/platform/diagnostic/quality 缺口进入漏项表。 |
| 是否只索引长期架构决定 | `pass` | 八项 ADR 均影响边界、truth、依赖、通信、恢复或演进；普通技术载体未进入。 |
| 每个 ADR 是否回指停审单元与来源 | `pass` | ADR 停审表逐项标出架构单元/总审计和需求/风险来源。 |
| 是否完成跨单元总审计 | `pass` | A～G 无职责、依赖、数据、通信、横切或追溯冲突。 |
| 是否新增未确认结论 | `none` | 本 Step 只重组已停审内容。 |
| 是否保持风险/待确认分离 | `pass` | 未闭合合同未进入 ADR 定论，仍在 Step 14。 |
| 是否完成正式 §16/§17 回填草稿 | `pass` | 追溯矩阵、漏项和 ADR 索引均已形成。 |

## 12. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| ADR/追溯级 | `pass` | 八项 ADR 已逐项停审，核心需求映射和追溯缺口均显式收口。 | 允许进入 Step 16，整理正式 `01`。 |
| Step / 模块级 | `pass` | 需求矩阵、漏项表、ADR 索引和跨架构单元总审计完成。 | 更新 flow 与项目台账后创建 Step 16。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 16；旧正式文件仍保持 historical material。 | 继续 Step 16；按已停审结论装配，不新增分析。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 inherited blockers，进入正式文档整理。 |


### 本轮 Step 15 模块 A 独立自检

- 问题：项目/流程展示有需求与验收来源吗？
- 诊断：旧矩阵覆盖止于017。
- 取舍：F018/020、US019/021、AC011/013 接到§6/9/10/13。
- 结构化/回填：ADR009只读流程分层，不定义 schema。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。


### 本轮 Step 15 模块 ADR-CHAT-010 独立自检

- 问题：是否只是标签排布？
- 诊断：项目/群聊/成员的统一页面可能被解释为统一授权。
- 取舍：保留统一项目语境但关系/目标授权分立。
- 结构化/回填：来源Step2/3/5/9与F018/019/021、AC011/012/014；不决定绑定owner或目录provider。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 15 模块 ADR-CHAT-009 独立自检

- 问题：是否值得长期保留？
- 诊断：图库/流程状态容易把展示变成执行。
- 取舍：保留Process只读分层与Gateway/Gate分立。
- 结构化/回填：来源Step3/5/8/10与F018/020、AC011/013；是边界决定，具体库/schema仍pending。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与旧材料诊断

新增功能、质量、风险是否全覆盖？A～G 已独立审查。旧矩阵遗漏 G009/010、F018～021、AC-FR011～014、RISK011/012和OPEN013～015；旧AB引用在当前00未定义，NG范围不全，AC-NFR范围错误地止于007。替换为正式00存在的编号；不从旧 cal补不存在的 ID。

### 结构化结果与回填

§16追加四个功能行（US→F→结构→AC）、新增 gap行；既有行修复未定义 AB引用和 AC-NFR001～024范围。§17增加 ADR009“只读流程材料分层，Process/Gateway与Governance Gate分立”，ADR010“统一项目详情，绑定与三类成员独立验证”。都是长期边界决定，来源为 F018～021 与 IC013～015，不替上游决定 schema。

复杂度：表足够，A～G无孤儿新增功能；source、result、配置/测试切口与ADR互相承接；OPEN与CHAT-UP不被 ADR 关闭。自检：矩阵不新增需求，不修改00或后续正式文档。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：新增四项功能追溯与两项长期 ADR 完成，缺失来源保持漏项。
- next_allowed_action：进入 Step 16，重新读取其 SOP 与前序输入。

### 编号复核修正

再次核对 00 §14.3：正式质量验收只定义 AC-NFR-CHAT-001～007；001～024 是 NFR-CHAT 质量要求范围，不能混作验收编号。00 §16 新增行中的 AC-NFR-CHAT-008～024 无正式定义，本轮在 01 §15/§16 保留上游编号缺口；本节“AC-NFR范围错误地止于007”改以“保留正式验收001～007并同时追溯NFR001～024”为准。NG-CHAT-009 是无 authority 的框架/指标，NG-CHAT-010 是流程/汇聚/审批编排，不将009误指复杂后台。本轮不改正式00。



### 本轮 Step 15 模块 G 独立自检

- 问题：缓存恢复会形成第二关系吗？
- 诊断：旧选择可能跨范围。
- 取舍：ADR006/008与局部 state 责任承接。
- 结构化/回填：缓存不是绑定或权限证据；跨设备同步未假定。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 15 模块 F 独立自检

- 问题：流程/绑定/目录材料能追到 owner 吗？
- 诊断：00 Process authority 缺口不能隐去。
- 取舍：Process/Work/Governance/source provider 分立。
- 结构化/回填：CHAT-UP008/009与OPEN013～015进漏项表。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 15 模块 E 独立自检

- 问题：图库和 shell 是长期 ADR 吗？
- 诊断：具体产品仍 candidate。
- 取舍：ADR003/006守跨端与清理；图形机制进009。
- 结构化/回填：不把 bpmn-js/React/Tauri 产品当已定实现。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 15 模块 D 独立自检

- 问题：新来源失效是否已有约束？
- 诊断：Process 不在旧恢复矩阵。
- 取舍：F013～016/020 与 source-local gap/revoke 责任衔接。
- 结构化/回填：§9/10/13保留各来源 cursor，不生成全局水位。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 15 模块 C 独立自检

- 问题：关联群聊与目录入口能定位到哪？
- 诊断：旧矩阵缺019/021。
- 取舍：US020/022→F019/021→AC012/014。
- 结构化/回填：ADR010统一项目语境，成员/关系独立验证。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 15 模块 B 独立自检

- 问题：结果门控与新增节点动作是否有追溯？
- 诊断：节点按钮不能替代审批来源。
- 取舍：既有 F010～012/ADR004 继续承接。
- 结构化/回填：正式结果与业务 receipt 含义不可扩大。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。
