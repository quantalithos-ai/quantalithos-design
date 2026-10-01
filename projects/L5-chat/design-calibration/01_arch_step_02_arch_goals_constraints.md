# Step 2 · 明确架构目标与约束

> 架构主题：把需求基线转译为客户端架构必须守住的结构目标、不可变约束、当前阶段取舍和架构非目标。  
> 当前状态：已完成问题回答、历史诊断、取舍、结构化产物、回填草稿和自检；允许进入 Step 3。  
> 直接输入：`01_arch_step_01_requirements_baseline.md`、正式 `00-需求文档.md`、前置 `draft/01~03`、全局依赖规则及已停审上游架构边界。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 · 明确架构目标与约束 |
| 前置门禁 | Step 1 `pass` |
| 本步输出 | 架构目标表、不可变约束表、当前阶段可接受取舍表、架构非目标表 |
| 正式回填 | §2 业务背景与驱动力、§3 约束条件 |
| 本步不展开 | 职责边界、上下文图、容器、依赖图、数据策略、交互方式和技术机制 |

## 2. SOP 问题回答

### 2.1 这个仓在架构层面要确保什么成立？

1. 一个共享的客户端产品 core 能够承接 N1～N4，而不把各 owner 的业务 truth 搬入客户端。
2. 所有业务读取、意图发起、正式变化和安全引用都从 `L0-sdk` 进入，UI、store 和 shell 没有旁路入口。
3. view model 和 renderer 能够在同一页面上组合多个 owner 的安全材料，同时保留每个来源的可见性、新鲜度、版本和降级姿态。
4. local intent、transport 状态、owner receipt/result、formal change 和恢复状态可以独立演进，unknown、gap、revoked、stale、blocked 等结果不会被压平。
5. Desktop、Web 和后续 Mobile 的平台差异只改变宿主能力，不改变业务状态、owner 权限或结果语义。
6. 离线、重启、断线、cursor 失效和 visibility 撤销都存在安全的局部恢复路径；恢复失败时可以停止、裁剪或等待，而不是伪造成功。
7. 客户端缓存、草稿、诊断和通知都能遵守最小披露，外部正文、credential、secret 和 raw payload 不进入不必要的持有面。
8. owner 合同未闭合时，架构仍能表达 read-only、unavailable、stale、blocked、unknown 和 deferred，而不是把空实现包装为 ready。

### 2.2 哪些约束不可变？

不可变约束必须保护真相 ownership、业务接入边界、失败语义、跨端语义和安全披露边界。它们不是技术偏好，后续 Step 不能用组件便利、传输习惯或平台能力绕开。

### 2.3 哪些约束是当前阶段可以接受的取舍？

当前可以接受的取舍集中在 exact owner contract、平台覆盖面、外围体验和数值 authority：先保证架构边界与主线状态语义成立，再等待正式 SDK/owner 合同、兼容矩阵和测量基线。取舍必须保持可见，不能把延后项目写成已关闭能力。

### 2.4 哪些事项不属于本仓架构当前要解决的问题？

服务端领域 truth、通用 SDK 设计、内部 bus 运行时、Runtime/Tools 执行、外部平台映射、Observability backend、Workspace projection truth、认证授权裁决和完整离线业务工作流均不属于 Chat 架构主线。Chat 只定义这些边界如何被安全消费和展示。

## 3. 历史材料诊断

| 历史口径 | 架构问题 | 当前处理 |
|---|---|---|
| 旧文档把“管理者入口”与多域对象编织成单一业务界面 | 将产品入口误写为跨域业务聚合 owner | 架构目标改为 safe material 组合与客户端体验承接。 |
| 旧文档将 React/Svelte、Tauri/Electron、SSE/WS 等候选混在约束章节 | 技术产品和传输方式尚未有 authority，不应成为不可变约束 | 平台方向保留为阶段取舍，具体技术机制后置到 Step 10/11。 |
| 旧文档把 <500ms、<2s、99.9%、500+ 和 10w 规模写成成功标准 | 数值缺少 workload、owner、测量和证据来源 | 约束只保留行为级局部进展、有限放大和可解释降级。 |
| 旧文档把完整离线、通知、员工登录和管理视图放进主线 | 混合了外围体验、认证/宿主职责与业务 truth | 按核心 N1～N4、外围增强、边界外能力分层。 |

## 4. 架构目标表

| ID | 架构目标 | 说明 |
|---|---|---|
| `AG-CHAT-001` | 承载共享客户端产品 core | 让 N1～N4 的路由、展示、意图、变化和恢复在共享语义下成立，避免 Desktop/Web/Mobile 各自形成不同业务客户端。 |
| `AG-CHAT-002` | 守住 owner truth 与客户端局部状态分离 | Chat 只持有 route、selection、draft、attempt、recovery、展示偏好和状态姿态；Conversation、Governance、Artifact、Workspace、Member、Runtime 等 truth 留在正式 owner。 |
| `AG-CHAT-003` | 让正式 safe material 可组合、可回链、可降级 | 多 owner 内容可以在同一产品入口显化，但每个 view 保留来源、visibility、freshness、版本和不可用原因，避免跨域聚合成第二真相。 |
| `AG-CHAT-004` | 支撑受控意图与结果分层 | 页面动作、local intent、提交姿态、receipt/result、owner confirmed/rejected 和 unknown 具备不同架构位置，避免按钮或 transport ACK 关闭业务状态。 |
| `AG-CHAT-005` | 支撑正式变化与恢复连续性 | SDK formal change/resume、reducer、缓存和恢复语境能够处理重复、乱序、缺口、过期、撤销、断线和重启，不把连接状态当业务事实。 |
| `AG-CHAT-006` | 让跨端 shell 不改变业务语义 | Desktop-first、Web shared UI 和后续 Mobile shell 只承载窗口、输入、通知、存储、深链和辅助技术，不重新定义权限、结果或 owner 生命周期。 |
| `AG-CHAT-007` | 守住最小披露与本地安全边界 | 预览、缓存、通知、deep link、诊断和本地持久化只接受获准 safe material，不保存 forbidden body、credential、secret 或未脱敏 payload。 |
| `AG-CHAT-008` | 允许未闭合合同安全降级 | SDK/owner/workspace/observability exact contract 未闭合时，架构仍能表达 read-only、blocked、stale、unavailable、deferred、unknown 和 needs-action，而不伪造 ready。 |
| `AG-CHAT-009` | 让客户端变化可观测但不越权 | 客户端可产生低敏诊断意图、错误类别和安全 correlation，支持排查连接/缓存/恢复问题，但不把 UI 日志升级为 Observability backend truth。 |

## 5. 不可变约束表

| ID | 约束 | 说明 |
|---|---|---|
| `IC-CHAT-001` | 不拥有 Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime 或 Observability backend truth | 这些对象的生命周期、授权、状态和正文必须由正式 owner 维护。 |
| `IC-CHAT-002` | 业务 query、command、formal change、resume 和 ref 只能经 `L0-sdk` | 禁止页面直连私有 API、内部 bus、共享数据库或 owner package。 |
| `IC-CHAT-003` | 不把 Chat-local 状态升级为业务结果 | route、selection、draft、optimistic、cache、按钮点击、toast、通知和 transport ACK 都不构成 owner confirmed。 |
| `IC-CHAT-004` | 不把 owner safe material 组合为跨域真相 | view composer 可以组合展示，但不得跨 owner 推断权限、完成、生命周期、审批或运行结果。 |
| `IC-CHAT-005` | 不以缓存、深链、空列表、对象名称或错误差异推断可见性/存在性 | actor、scope、visibility 和授权语境不可验证时必须 fail-closed。 |
| `IC-CHAT-006` | 正式变化只能由 SDK 提供 | 不猜 topic、offset、墙上时间顺序或 broker delivery；reducer 只处理 formal change/resume 输入。 |
| `IC-CHAT-007` | unknown 不得盲重放可能产生副作用的命令 | unknown 必须进入查询、探测、等待或用户决策路径，不能用网络恢复替代业务确认。 |
| `IC-CHAT-008` | 缓存、离线展示和重启恢复不得延长授权或确认业务完成 | 本地快照必须保留版本/visibility/freshness 语境，撤销/过期时清理或裁剪。 |
| `IC-CHAT-009` | 外部正文、credential、token、secret、raw log、provider/tool/runtime/bridge body 和未脱敏 payload 不得进入 Chat 持有面 | 渲染、缓存、错误、诊断、导出、通知和 deep link 均适用。 |
| `IC-CHAT-010` | 平台 shell 不拥有业务权限、结果或生命周期 | Tauri/Web/Capacitor 只提供宿主能力；平台 API 返回不等于业务成功。 |
| `IC-CHAT-011` | 运行期/事件协作依赖不写成源码依赖 | 只有正式共享契约可成为 compile candidate；owner 能力经 SDK adapter、ref 或 event seam 消费。 |
| `IC-CHAT-012` | 未闭合合同不得被表述为 ready、integrated、verified 或 accepted | 设计正文、校准材料和后续实施边界必须保持 pending/blocked/deferred/unknown。 |

## 6. 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| V1 平台范围 | Desktop-first；先保证桌面主路径和共享 core 的语义成立，Web 保留扩展面，Mobile 不作为 V1 前置。 |
| Desktop shell 技术产品 | Tauri 作为当前候选，但具体产品绑定、窗口模型和 native seam 后置到关键技术选型与配置阶段。 |
| Shared UI/core 技术产品 | React/TypeScript 作为当前候选方向，架构层先固定共享语义与平台隔离，不在本步锁 package 或目录。 |
| Mobile 体验 | 暂按 Capacitor 复用共享 UI 的候选路径保留；移动特有能力、支持矩阵和后台恢复不进入 V1 主线。 |
| Exact SDK/owner surface | 先固定 adapter 角色、输入输出类别和降级姿态；方法名、DTO、协议和事件 schema 等待正式合同。 |
| Workspace/InBox 体验 | 只消费 Workspace safe view/export/attention；不在 Chat 重新聚合 projection、freshness 或授权。 |
| 离线能力 | 支持受限阅读缓存、草稿和恢复提示；不支持离线审批成功、离线业务写入或完全离线工作流。 |
| 搜索、通知、富文本和附件 | 作为外围增强；只有正式 owner/平台 contract 具备时启用，不阻塞 N1～N4 架构主线。 |
| 精确性能、可用率和兼容矩阵 | 当前只保留行为级不被无关 owner 阻塞、有界恢复、fail-closed 和等价可访问性口径，不写数字。 |
| 低敏诊断 | 先保留 client-side intent、错误类别和安全 correlation；Observability handoff exact envelope 后置。 |

## 7. 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 或 Observability backend truth | 这些属于正式 owner；Chat 只定义消费和展示边界。 |
| 不设计通用 SDK、认证、传输、重试、错误和事件协议实现 | `L0-sdk` 拥有客户端接入能力；Chat 只适配正式 surface。 |
| 不设计内部 bus、broker、topic、offset、replay、delivery 或事件主干 | Chat 不直订 bus，变化通过 SDK formal surface 进入。 |
| 不设计 Runtime 推理、Tools 执行、Capability、Sandbox 或 Member 容器编排 | 这些属于 L2/L3/L4 owner；Chat 只显示 safe status 或提供受控入口。 |
| 不设计 Bridges 外部平台映射或外部消息正文 | `L6-bridges` 是边界参考，未停审设计不进入正式输入。 |
| 不设计 Workspace projection truth、跨项目聚合算法或统一授权中心 | Chat 只消费 Workspace safe view，不自建第二投影或授权 truth。 |
| 不设计完整离线业务系统、离线审批、离线命令队列或自动副作用回放 | 当前只支持安全展示、草稿和恢复提示。 |
| 不在本步定义具体框架、package、代码目录、API path、DTO、事件 schema、数据库、配置键、测试步骤或运行证据 | 这些内容分别属于后续架构/概要/详细/配置/测试/实施阶段。 |

## 8. 复杂度判断与架构单元前置建议

| 判断项 | 结论 |
|---|---|
| 是否需要系统上下文图 | 需要。Chat 与 L0-sdk、各 owner、平台 shell、低敏诊断和消费方的边界容易混淆。 |
| 是否需要内部上下文关系图 | 需要。客户端产品 core、语境/导航、safe view 组合、意图、变化恢复和 shell 之间需独立审查。 |
| 是否需要容器/部署图 | 需要，但只能表达同步入口、共享客户端运行承载、变化/恢复承接、本地受限存储和平台 shell 角色，不能写源码模块。 |
| 是否需要依赖裁剪图 | 需要。Chat 是 Layer 5 产品，必须明确仅 compile `L0-core`/正式 SDK 类型候选，其余为 runtime/ref/event/adapter/fake 或下游消费关系。 |
| 是否需要按架构单元逐个停审 | 需要。Step 5、7、8、9、12、15 逐单元审查，防止把 view model、store、SDK adapter 和 shell 混成一个“前端层”。 |
| 是否可以在本步选择具体技术栈 | 不可以。本步只收敛目标和约束；具体机制/平台候选进入 Step 10/11。 |

## 9. 正式回填草稿

### 9.1 §2 业务背景与驱动力

`L5-chat` 需要把分散在多个正式 owner 中的安全协作事实组织成用户可理解、可操作、可恢复的跨平台客户端体验。架构设计的价值不在于复制 Conversation、Governance、Artifact、Workspace 或 Runtime，而在于建立共享客户端 core、正式 SDK 接缝、局部状态、变化恢复和平台 shell 的稳定结构，使 N1～N4 在多端体验中保持同一业务语义。

| 架构目标 | 说明 |
|---|---|
| 承载共享客户端产品 core | 让语境进入、正式显化、受控意图和恢复连续性共享同一状态语义。 |
| 守住 owner truth 与客户端局部状态分离 | 防止 UI、cache、draft 或 optimistic 状态成为第二业务真相。 |
| 支撑 safe material 的组合和降级 | 让多 owner view 在同一入口显化，同时保留来源、visibility、freshness 和失败姿态。 |
| 支撑受控意图与结果分层 | 防止按钮、ACK 或本地状态误报发送、审批或其他业务完成。 |
| 支撑正式变化与恢复连续性 | 让重连、缺口、撤销、重启和离线展示保持可解释且不越权。 |
| 让跨端 shell 保持同一业务语义 | Desktop、Web 和 Mobile 能按平台能力降级，而不改变 owner 结果。 |
| 守住最小披露与低敏诊断 | 防止正文、secret 和 raw payload 进入渲染、缓存、诊断或 handoff 生命周期。 |

### 9.2 §3 约束条件

正式架构必须遵守 §5 的不可变约束。当前可接受的架构收缩是 Desktop-first、exact owner surface 后置、受限离线展示、外围能力条件化和数值 authority 后置；这些取舍不授予 Chat 任何 owner truth、认证权限或业务成功结论。服务端领域、通用 SDK、内部 bus、Runtime/Tools、Bridges、Workspace projection 和完整离线工作流均不属于本架构主线。

## 10. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否形成结构性架构目标而非功能清单 | pass | 9 项目标均写成客户端架构必须确保的结构结果。 |
| 是否区分不可变约束、阶段取舍和架构非目标 | pass | 三张表分别表达边界红线、当前收缩和范围排除。 |
| 是否把技术产品/协议提前锁死 | pass | Tauri/React/Capacitor只作为候选取舍保留，未进入不可变约束。 |
| 是否保留 pending / blocked 上游合同 | pass | `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*` 和 `CHAT-AC-Q-*` 未被润色为 ready。 |
| 是否写入实现、API、数据库或测试事实 | pass | 没有。 |
| 是否完成正式回填草稿 | pass | §2、§3 贡献已形成。 |
| 是否足以进入 Step 3 | pass | 目标、红线、取舍和非目标已收稳，可进入职责边界。 |

## 11. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 架构目标、不可变约束、当前取舍、非目标和回填草稿完成并通过自检。 | 创建并执行 Step 3 `01_arch_step_03_responsibility_boundary.md`。 |
| 文档级 | `pass` | 目标与约束足以指导职责边界，不确定项已保留。 | 进入 Step 3。 |
| 项目级 | `in_progress` | 正式 `01` 仍在校准链；未允许进入 `02`。 | 继续串行完成 Step 3。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与旧材料诊断

- 必须确保什么？项目详情统一组织五个标签，项目进度包含整体/阶段/节点层级；项目与群聊往返保持上下文，公司目录不推断成员范围。
- 不可变约束是什么？并行分支状态与汇聚结论只能读取 Process；Gate 独立由 Governance 提供；跨 owner 不能组成一份虚构的共同版本。
- 当前可接受什么？无 projection 则 unavailable/blocked，可分别读取获准模块；完整 BPMN 执行、全公司目录覆盖和绑定写入未确认。
- 旧材料缺陷：AG-CHAT-001～009 与 IC-CHAT-001～012 只有通用语义，OPEN 范围止于012，未约束新增关系。

### 取舍与结构化结果

保留原目标，增加 AG-CHAT-010（统一项目/流程体验）、AG-CHAT-011（三类成员入口）；增加 IC-CHAT-013～015（流程/绑定/成员边界）。项目与进度整合是展示架构决定；一群聊最多一个项目是产品约束目标，正式 owner 尚待确认。不新增指标与 schema。

回填 §2.3 和 §3.1/3.4；继承 OPEN-CHAT-013～015。复杂度：目标和约束表足够；流程图后续 §6。自检：目标可判断，约束不计算 Process/Gate，未宣布全员目录可用。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：项目流程与成员入口的目标、不可变约束和挂起边界已补齐。
- next_allowed_action：进入 Step 3，重新读取其 SOP 与前序输入。
