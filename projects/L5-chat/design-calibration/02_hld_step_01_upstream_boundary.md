# L5-chat 02 · Step 1 上游输入边界

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：确认概要设计可承接哪些需求、架构和上游 owner 结论，并把仍未收稳的内容排除在本步输入之外。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 1；`standards/document/概要设计书写规范.md` §4.1。
> 修改范围：只写校准材料，不实现代码、不固化未确认 API/DTO/schema、不修改任何上游项目。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 读取输入 | 项目台账、01 flow、00/01 正式文档、draft/01～03、02 SOP/书写规范/中间产物规范、专项上游正式 `00～07` 和必要台账 | `done` | 已按恢复顺序串行读取 |
| 回答 SOP 问题 | 需求、架构、稳定性和未收稳项边界回答 | `done` | 每项均能回指正式来源 |
| 历史材料诊断 | 旧 `02-概要设计.md`、README、旧 Chat 文档和 draft 的污染分类 | `done` | 未将历史结论当作输入 |
| 设计取舍 | 确定本步只做输入映射，不提前展开代码、对象、接口、流程和状态 | `done` | 符合 Step 1 执行约束 |
| 结构化产物 | 上游关系映射表、本文不再回答/必须回答清单 | `done` | 可直接回填正式 §1 |
| 复杂度判断 | 判断本步不需要图；复杂性延后至 Step 4～9 | `done` | §1 禁止画图 |
| 回填草稿 | §1 回填草稿 | `done` | 未新增概要结论 |
| 自检与门禁 | 三层门禁输入、自检、下一步条件 | `done` | `pass`，允许创建 Step 2 |

## 2. 本步输入

### 2.1 本项目正式输入

| 来源 | 已确认可承接的内容 | 当前使用边界 |
|---|---|---|
| `projects/L5-chat/00-需求文档.md` | Chat 的产品定位、N1～N4 能力闭环、功能边界、owner truth 与 Chat-local truth 区分、SDK-only 接入、结果门控、变化/恢复、安全与可访问性要求、Desktop-first 范围 | 只承接已收稳的需求前提；不在本步重写用户故事、功能需求或验收标准。 |
| `projects/L5-chat/01-架构设计.md` | 客户端产品架构、主要架构单元、L0-sdk 唯一业务接入边界、平台 shell 与共享客户端语义分离、受限本地状态、formal change/resume、数据所有权和 fail-closed 红线 | 只承接架构级边界；不在本步重做系统上下文、子域、部署、技术取舍或 ADR。 |
| `projects/L5-chat/draft/01_项目作用与交互对象.md` | UI 与 SDK 的分工、跨端产品定位、owner 交互对象和 boundary vocabulary 的候选 | 仅作为候选和历史诊断材料；需在后续 Step 重新收敛。 |
| `projects/L5-chat/draft/02_功能推演.md` | 页面/路由族、Turn 展示、草稿/选择、GateCard、Artifact、成员/项目摘要、变化/恢复等体验候选 | 不把页面名、组件名或临时状态直接升级为正式对象。 |
| `projects/L5-chat/draft/03_模块划分与分层.md` | shared client core、SDK adapter、view model、store/reducer、缓存/恢复、platform shell 的候选分层 | 不把候选层写成代码目录、实现事实或最终技术绑定。 |

### 2.2 专项上游与全局输入

| 来源 | 本概要设计承接的稳定边界 | 未闭合部分的处理 |
|---|---|---|
| `projects/L0-sdk/00-需求文档.md`～`07-实施计划.md` | SDK 是官方客户端接入层；提供 typed query/command/event、认证/传输/错误/重试/trace/redaction/resume 等正式能力的边界；不拥有 UI、产品工作流或 owner truth | Chat 只按能力类别设计 SDK adapter；具体方法、DTO、schema、版本和 exact surface 仍受 `CHAT-UP-001` 约束。 |
| `projects/L1-conversation/00-需求文档.md`～`07-实施计划.md` | Conversation、Turn、Participant、scope/visibility、对话变化和恢复由 conversation owner 负责 | Chat 只承接安全读取、受控意图和正式变化消费；visibility/cursor/resume 细节未闭合时不向下固化。 |
| `projects/L1-identity/00-需求文档.md`～`07-实施计划.md` | actor、GlobalMember、身份生命周期和身份语境由 identity owner 负责 | Chat 只承接安全身份摘要和入口语境；不创建身份、不推断授权。 |
| `projects/L1-work/00-需求文档.md`～`07-实施计划.md` | Project、ProjectMember、WorkItem、Iteration 和项目进度由 work owner 负责 | Chat 只承接项目/工作摘要入口；不推进项目、不生成完成结论。 |
| `projects/L1-governance/00-需求文档.md`～`07-实施计划.md` | Gate、Approval、Decision、Policy、Control 和治理结果由 governance owner 负责 | Chat 只承接 GateCard 显化和受控意图入口；receipt、幂等和结果 contract 未闭合时保持 pending/unknown。 |
| `projects/L1-artifact/00-需求文档.md`～`07-实施计划.md` | Artifact 正文、版本、血缘、Evidence/Baseline 和 safe preview/ref 由 artifact owner 负责 | Chat 只承接 body-free ref、summary、preview 结果或不可用原因；不持有正文。 |
| `projects/L1-workspace/00-需求文档.md`～`07-实施计划.md` | Workspace 跨域 read model、attention、freshness、cursor、export 由 workspace owner 负责 | `WS-UP-001~008` 未闭合时不构造 Chat projection、不重建 Inbox 或 attention truth。 |
| `projects/L2-member/00-需求文档.md`～`07-实施计划.md` | 成员容器内在场、交互边界、筛选/投递/出站尝试语义由 member owner 负责 | Chat 只显示安全摘要，不把 UI presence 当身份或 runtime truth。 |
| `projects/L2-runtime/00-需求文档.md`～`07-实施计划.md` | Runtime run、decision、checkpoint、outcome 和 handoff attempt 由 runtime owner 负责 | Chat 只承接安全摘要与状态解释，不执行推理、工具或 handoff。 |
| `projects/L4-observability/00-需求文档.md`～`07-实施计划.md` | 低敏观测、审计投影、evidence/report handoff 和 Observability backend 由 observability owner 负责 | Chat 只保留低敏诊断入口和 safe correlation/ref 方向；不直写 backend、不把 UI log 当 truth。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L5 并行窗口、项目依赖裁剪和 owner 顺序 | `L6-bridges` 只作并行兄弟边界参考，不吸收其未停审设计。 |
| `standards/document/概要设计讨论流程_SOP.md`、`概要设计书写规范.md`、`设计文档讨论中间产物规范.md` | 本文必须从输入边界下沉到代码主体骨架，但按 Step 独立形成中间产物和三层门禁 | 本步只做边界映射，不提前展开 §4～§13 内容。 |

## 3. SOP 问题回答

### 3.1 当前概要设计要承接哪些需求结论？

承接 `00-需求文档.md` 已收稳的四条产品主线：安全协作语境进入与保持、正式协作事实安全显化、用户意图受控发起与结果反馈、变化/失败/离线/恢复连续性。承接的不是需求文字本身，而是这些主线对客户端结构的前置约束：Chat-local 交互状态必须与 owner truth 分离，正式事实只能通过 SDK safe material 进入，业务结果必须由正式 receipt/result/change 门控，无法验证的语境必须 fail-closed。

### 3.2 当前概要设计要承接哪些架构结论？

承接 `01-架构设计.md` 已收稳的客户端边界：L0-sdk 是唯一业务接入 seam；共享客户端产品语义与平台 shell 分离；客户端同步入口、连续性承接和本地受限状态是运行承载角色；Chat 只拥有 route/context、selection/focus、draft、local intent/attempt、recovery context、展示缓存和平台体验状态；owner 事实、授权、生命周期、正文、事件 delivery 和 Observability backend 留在正式 owner。

### 3.3 哪些结论足够稳定，可直接作为概要设计输入？

以下结论足够稳定：

- Chat 是跨平台客户端产品层，V1 以 Desktop-first 为范围；具体 shell 仍是候选承载，不等于实现事实。
- 业务访问只能经过 `L0-sdk`，不能通过私有 API、内部 bus 或共享数据库补齐。
- Chat-local 状态、owner safe material、结果姿态和恢复姿态必须分层表达。
- `confirmed` 需要正式 owner receipt/result/change；`unknown` 不得盲目重放可能产生副作用的动作。
- 页面、路由、view model、store、reducer、adapter、缓存/恢复和可访问性属于本概要设计需要下沉的客户端结构方向。
- Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability 的真相不进入 Chat 对象定义。

### 3.4 哪些相关结论仍未收稳？

以下内容不能作为本步的精确结构输入：SDK 的方法名、DTO、事件 schema、change cursor/resume token、命令 receipt 具体字段、治理幂等合同、Artifact preview wire contract、Workspace safe view 字段、诊断 envelope、平台兼容矩阵、缓存留存上限和任何性能数字。它们在后续概要章节只能以能力类别、结果姿态和 blocker 方式出现，直到 owner/SDK 正式合同闭合。

### 3.5 哪些边界决定当前不应展开到哪里？

- 不展开服务端领域对象的字段、生命周期、授权和数据库结构。
- 不展开 SDK 内部实现、传输协议、事件 broker、topic、offset 或完整 schema。
- 不把页面组件候选、路由候选或客户端 store 名称写成已存在的代码目录或实现。
- 不在概要设计中实现离线业务、离线审批、Runtime 推理、Tools 执行、Bridges 映射或 Observability backend。
- 不在 Step 1 提前收口对象字段、API 表、处理流和状态机；这些属于后续 Step。

## 4. 历史材料与边界污染诊断

| 历史材料口径 | 分类 | Step 1 处置 |
|---|---|---|
| 旧 `02-概要设计.md` 的“人话理解”、组件树式主要部分、固定指标和旧依赖表 | `historical_material`；含 `boundary_violation` 风险 | 不局部修补；正式 02 在 Step 14 删除后重建。 |
| `README.md` 中固定 React/Svelte/Tauri/React Native、AG-UI 17、SSE/WebSocket 和目录结构 | `historical_contamination` | 只记录为候选/污染诊断；具体载体和协议不作为 Step 1 输入。 |
| draft/01～03 的 Desktop-first、Tauri、React/TypeScript、Capacitor、页面与模块候选 | `candidate_input` | 可提供讨论词汇和候选结构，必须经过 Step 2～9 重新停审。 |
| 旧对象名可能把 Chat view model 当 Conversation/Member/Runtime truth | `boundary_violation` | 只允许作为客户端展示模型候选；owner truth 仍由上游正式文档拥有。 |
| 旧 AG-UI ACK、按钮点击、transport ACK 等于业务成功 | `boundary_violation` | 沿用 00/01 的结果门控和 unknown 规则，不进入概要主语。 |
| `L6-bridges` 未停审外部映射设计 | `parallel_sibling_input_forbidden` | 不作为本概要设计输入，仅保留外部映射不归 Chat 的边界。 |

## 5. 设计取舍

### 5.1 本步采用的输入层级

正式 `00` 和 `01` 是当前 Chat 的直接基线；专项 owner 正式 `00～07` 只在各自边界范围内提供 truth-owner 前提；draft 只提供候选结构；README/旧正式文件只用于污染诊断。输入层级不因旧材料更具体而改变。

### 5.2 本步不提前锁定的名称

页面、路由、组件、store、reducer、adapter、projection、cache entry、resume record 等名称在后续 Step 可以作为概要设计主语候选，但本步不把它们认定为代码目录、实现文件、公共 API 或已存在的类型。这样既能让 Step 4～9 下沉到可落码骨架，又不会把设计候选伪装成实现事实。

### 5.3 本步不画图的原因

Step 1 的正式输出是文档关系和回答边界。依照书写规范 §4.1，本章禁止画上游依赖图、系统上下文图或文档关系图；真正需要图示的代码主体、组成部分交互、处理流和状态传播留给 Step 4、5、8、9。

## 6. 结构化中间产物

### 6.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L5-chat/00-需求文档.md` §2、§4、§7、§10～§13 | Chat 的客户端产品定位、四节点能力闭环、结果门控、SDK-only、安全与恢复约束 | 将能力闭环转译为可落码的客户端主体、对象、接口、处理流和状态骨架。 |
| `projects/L5-chat/01-架构设计.md` §4、§6～§10 | Chat 职责边界、客户端架构单元、实现依赖方向、数据归属、一致性和通信类别 | 将同步入口、连续性承接、本地受限状态、共享客户端语义和平台接缝下沉为概要设计主要组成部分。 |
| `projects/L5-chat/01-架构设计.md` §11～§15 | SDK-only、safe projection、结果门控、Desktop-first、fail-closed、风险与 blocker 姿态 | 将稳定机制转译为对象、接口、关键处理流、状态传播、异常边界和配置影响轮廓；不重新做技术选型。 |
| `projects/L0-sdk/00-需求文档.md`～`07-实施计划.md` | 官方客户端接入层的角色与不拥有 UI/业务 truth 的边界 | 定义 Chat 的 SDK adapter 所需能力类别、输入/输出边界和未闭合 contract 的挂起姿态。 |
| `projects/L1-conversation/00-需求文档.md`～`07-实施计划.md` | Conversation/Turn/Participant 与 visibility/change/resume 的 owner 边界 | 组织对话入口、Turn 显化、发送意图和变化消费的客户端骨架，不复制 Conversation truth。 |
| `projects/L1-identity/00-需求文档.md`～`07-实施计划.md` | actor、GlobalMember 和身份生命周期 owner 边界 | 组织安全身份摘要与入口状态的消费骨架，不实现认证或授权。 |
| `projects/L1-work/00-需求文档.md`～`07-实施计划.md` | Project/ProjectMember/WorkItem/Iteration owner 边界 | 组织项目进度和协作摘要入口，不推进工作事实。 |
| `projects/L1-governance/00-需求文档.md`～`07-实施计划.md` | Gate/Decision/Policy/Approval owner 边界 | 组织 GateCard 的安全显化、受控意图和正式结果姿态，不本地审批。 |
| `projects/L1-artifact/00-需求文档.md`～`07-实施计划.md` | Artifact/Evidence/Baseline、版本/血缘和 safe preview/ref owner 边界 | 组织引用卡片、预览入口和不可用姿态，不持有正文或血缘。 |
| `projects/L1-workspace/00-需求文档.md`～`07-实施计划.md` | Workspace safe view、attention、freshness、cursor、export owner 边界 | 只组织已授权的工作区入口消费，不重建跨域投影。 |
| `projects/L2-member/00-需求文档.md`～`07-实施计划.md` | 容器内成员交互边界 owner | 组织成员状态入口的安全消费，不把 UI presence 升级为身份或运行真相。 |
| `projects/L2-runtime/00-需求文档.md`～`07-实施计划.md` | Runtime run/decision/checkpoint/outcome/handoff owner | 组织运行摘要和等待/阻塞/失败/未知显化，不执行 Runtime 或 Tools。 |
| `projects/L4-observability/00-需求文档.md`～`07-实施计划.md` | 低敏诊断、审计/报告 handoff 和 backend owner 边界 | 组织客户端诊断入口和安全关联方向，不建立观测后端或正式证据。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L5 并行窗口、依赖裁剪和兄弟项目边界 | 约束本概要设计只消费已闭合上游；不吸收未停审 `L6-bridges`。 |

### 6.2 本文不再回答

- 需求目标、用户故事、功能需求、验收标准和需求追溯矩阵的重新定义。
- 系统上下文、限界上下文、数据 owner、依赖方向、技术选型、ADR 和架构方案取舍的重新定义。
- Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime 或 Observability 的正式 truth、授权、生命周期、正文和持久化模型。
- L0-sdk 的通用 SDK 实现、认证/传输/错误/重试协议、内部 bus、broker、topic、offset 和完整事件 schema。
- Runtime 推理、Tools 执行、Capability/Sandbox、Bridges 外部平台映射和 Observability backend。
- 固定前端框架、代码目录、包名、API path、数据库、部署参数、性能数字和 readiness 结论。

### 6.3 本文必须回答

- Chat 的客户端可落码主体如何从架构单元映射为主要组成部分和实现分层。
- 页面/路由、共享产品语义、view model、client store、SDK adapter、event reducer、缓存/恢复和平台 shell 的职责边界如何划分。
- Chat-local 对象骨架与 owner-safe view/ref/result/change 的引用边界如何表达，并如何避免 shadow truth。
- query/command/event/resume/operations 等接口类别如何进入 Chat，哪些输入需要 actor/context、metadata、幂等和来源语境。
- 发送、治理意图、正式变化、重连/缺口/恢复和安全预览等关键处理流如何在不伪造 owner contract 的情况下表达。
- `draft / submitted / pending / confirmed / rejected / failed / unknown` 与 `fresh / stale / gap / reconnecting / restricted / unavailable / blocked / needs-action` 等状态轴如何分离、传播和降级。
- 异常边界、配置影响、详细设计承接清单以及当前 SDK/owner blocker 如何进入正式概要设计。

## 7. 回填草稿（正式 §1）

> 校准来源：本文件 `§6.1 上游关系映射表`、`§6.2 本文不再回答`、`§6.3 本文必须回答`。

本概要设计承接已停审的 `projects/L5-chat/00-需求文档.md` 与 `projects/L5-chat/01-架构设计.md`，并在 `L0-sdk` 及各正式 owner 当前 `00～07` 的边界内继续下沉。承接内容包括 Chat 的客户端产品定位、四节点能力闭环、SDK-only 接入、Chat-local truth 与 owner truth 分离、正式结果门控、formal change/resume、受限本地状态、Desktop-first 范围和 fail-closed 约束；专项 owner 文档只提供各自 truth、可见性和变化能力的归属前提。本文继续把这些前提转译为可落码的代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机和配置影响轮廓；未闭合的 SDK/owner exact surface 保持 `pending / blocked / waiting`，不在 Chat 内补造。

本文不再回答：
- 需求目标、用户故事、验收标准和需求追溯。
- 系统上下文、子域、数据 owner、架构方案取舍和技术选型。
- 各 owner 的领域 truth、授权、生命周期、正文、持久化和事件 delivery。
- 通用 SDK、内部 bus、Runtime/Tools、Bridges、Observability backend 和部署运维细节。

本文必须回答：
- Chat 代码主体、主要组成部分、对象、接口、处理流和状态机如何在现有边界内落位。
- UI 页面/路由、view model、client store、SDK adapter、event reducer、缓存/恢复和平台 shell 如何协作而不形成第二真相。
- 未闭合合同如何以 blocked、unknown、stale、unavailable 或 needs-action 进入概要结构并交给后续详细设计。

## 8. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| `L0-sdk` 对 Chat 场景的 exact query/command/event/ref/change/resume surface | 后续 API 骨架和 adapter 输入输出 | 只按能力级边界设计；不固化方法名、DTO 或 schema。 |
| Conversation、Governance、Artifact、Workspace 等 owner 的 visibility/cursor/receipt/preview 合同 | 后续页面、对象和处理流正向成立 | 维持只读、stale/gap/blocked/unavailable/unknown。 |
| Desktop shell、Web shared UI、Mobile 临时方案的最终载体与支持矩阵 | 后续平台 adapter 和配置影响 | Desktop-first；载体保持 candidate，不宣称 ready。 |

## 9. 自检与门禁

### 9.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否只确认输入边界，没有提前定义对象/接口/处理流/状态机？ | 是；这些内容只列为 Step 2～9 必须回答的方向。 |
| 是否区分正式输入、候选 draft 与 historical material？ | 是；正式 `00/01` 为直接基线，draft 为候选，旧文档/README 为历史材料。 |
| 是否覆盖专项 owner 和 L0-sdk 的职责边界？ | 是；已列出 L0-sdk、L1/L2/L4 各 owner 的承接与排除。 |
| 是否把未闭合合同写成已确认事实？ | 否；均保留 pending/blocked/waiting 或条件化口径。 |
| 是否把 L6-bridges 未停审设计作为输入？ | 否；仅记录 sibling boundary。 |
| 是否保留正式章节可追溯入口？ | 是；回填草稿明确指向本 Step 的具体小节。 |
| 是否满足三层门禁所需状态字段？ | 是；本文件、02 flow 和项目台账均有状态、gate_reason、next action 或来源入口。 |

### 9.2 进入下一步条件

- 已明确概要设计承接的需求、架构、全局和 owner 输入。
- 已区分稳定输入与未闭合合同，且未用 Chat 私有协议补齐缺口。
- 已形成正式 §1 所需的关系映射、`本文不再回答` 和 `本文必须回答`。
- 未提前展开 Step 2 之后的代码主体、对象、接口、流程和状态机细节。
- 项目级台账、02 flow 和本 Step 文件一致，允许创建并执行 Step 2。

### 9.3 门禁结论

`gate_status = pass`。Step 1 已完成，下一动作是创建并执行 `02_hld_step_02_scope.md`；上游 `CHAT-UP-*`、`WS-UP-*` 和 `OPEN-CHAT-*` 继续作为继承 blocker，不阻止本步进入范围讨论，但会限制后续正向接口和实现级结论。

## 2026-10-01 当前逐章复核（覆盖旧删除重建口径）

计划与输入：串行读取台账、flow、Step1 SOP及现有§1，核对修复后01的ADR009/010、正式Process§1～3和SDK能力边界；当前保留原文件逐章修复。

SOP回答：稳定输入为Desktop-first、七单元、SDK-only和Chat-local分界；新增项目五标签/分层流程/双向群聊/目录可承接体验结构。Process为流程truth owner，Work为项目与工作truth，Governance为Gate/Decision；正向投影、关系与目录合同未收稳，不展开私造字段/API。

诊断与取舍：旧§1遗漏Process及冻结原型，身份与目录混称，receipt确认条件过宽。原型仅为体验输入；补正式Process来源及CHAT-UP008/009、CHAT-BASE001。旧重建指令只属历史。

结构产物/回填：正式§1.1来源映射及§1.3必须回答已原位修复；本步不提前定义对象或接口。复杂度采用来源表，无需新图。

自检：来源/owner/候选/未确认合同分开；00/01未改；未将原型或SDK骨架写为可用能力。当前Step1 done，gate pass（章节完整性），合同仍blocked；允许Step2。未实现、未测试、未提交。
