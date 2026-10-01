## Step 4. 目标与非目标

### 1. Step 状态

- 状态：`[x] 已确认`
- 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 4
- 回填章节：正式 `00-需求文档.md` §4「目标与非目标」
- 当前模块：`goals-and-scope`

#### 1.1 Step 内计划

- [x] 读取 Step 2~3、用户“展示由 Chat、必要能力由 SDK”取舍和上游 owner 边界。
- [x] 逐项回答目标、验证方向、后移事项和 owner 转交问题。
- [x] 诊断旧文档中把功能清单、技术方案和未经证实数字写成目标的问题。
- [x] 选择“体验状态成立 + owner boundary 成立”作为目标主轴。
- [x] 形成目标 / 非目标 / 范围分层表。
- [x] 判断不拆附录，具体功能在 Step 7~9 展开。
- [x] 形成正式 §4 回填草稿。
- [x] 自检通过，允许进入 Step 5。

### 2. 本步输入

- `00_req_step_02_position_boundary.md`
- `00_req_step_03_problem_context.md`
- `00_req_step_01_upstream_relation.md` 的 SDK capability register
- 用户已确认的产品定位：Chat 侧重展示与交互，必要通用能力由 SDK 提供
- `L0-sdk` 非目标：不提供 UI、页面状态、产品工作流或完整离线策略

### 3. SOP 问题回答

#### 3.1 需求结束后必须成立哪些状态、边界或能力？

| 目标 ID | 目标 | 可验证方向 |
|---|---|---|
| `G-CHAT-001` | 统一协作入口成立 | Web / Desktop / Mobile 能以同一产品语义进入 group、channel、dm、thread，并显示当前可见上下文。 |
| `G-CHAT-002` | owner truth 与客户端状态分离 | 每类上游事实都通过 SDK safe view / result / event 消费；Chat 的 store、缓存和 view model 不能成为第二 truth。 |
| `G-CHAT-003` | 对话与 Turn 展示成立 | 普通、成员、系统、治理、产物等 Turn 类型能按正式 owner 结果渲染，变化、分页、缺口和不可见状态可解释。 |
| `G-CHAT-004` | 发送与受控命令体验成立 | 草稿、选择、提交 intent、optimistic、confirmed、failed、unknown 和 retry 状态可区分；正式成功由 owner result / event 确认。 |
| `G-CHAT-005` | Gate / cross-domain 显化成立 | GateCard、项目进度、成员状态和 Artifact 引用能在授权范围内呈现，并提供受控 SDK 命令入口或只读降级。 |
| `G-CHAT-006` | 多端同步与恢复成立 | 变化 cursor、重连、重复 / 乱序 / 迟到、离线展示缓存和恢复状态有明确客户端语义；未知命令结果不自动重放。 |
| `G-CHAT-007` | 安全、可访问性和可诊断性成立 | 不可见内容 fail-closed，敏感正文不进入客户端不必要的缓存 / 日志，关键路径可键盘和辅助技术操作，降级原因可理解。 |
| `G-CHAT-008` | SDK 改进边界可追踪 | Chat 所需的 SDK capability、gap、owner、阻塞影响和后置能力均有登记，不通过 Chat 私有协议解决。 |

#### 3.2 每个目标如何被验证？

Step 4 只确定验证方向，不伪造真实测试结果：

- `G-CHAT-001`：跨端页面 / 路由和核心路径对照；
- `G-CHAT-002`：source ref / view / store 对账和 no-write 负向切口；
- `G-CHAT-003`：事件 reducer、渲染矩阵、分页 / gap / not-visible 场景；
- `G-CHAT-004`：command result / receipt / retry / duplicate / unknown 场景；
- `G-CHAT-005`：Gate、Project、Member、Artifact safe view 与权限降级场景；
- `G-CHAT-006`：cursor resume、断线、重复、乱序、离线恢复和多端同步场景；
- `G-CHAT-007`：可访问性检查、redaction / security negative flow 和低敏诊断材料；
- `G-CHAT-008`：SDK surface / gap registry 与后续接口追溯矩阵。

#### 3.3 哪些相关事项明确不纳入当前范围？

| 非目标 ID | 非目标 | 转交 owner / 后续阶段 |
|---|---|---|
| `NG-CHAT-001` | Conversation、Turn、Participant、Project、Member、Gate、Artifact、Workspace、Runtime、Observability 的业务真相、持久化和生命周期 | 对应正式 owner |
| `NG-CHAT-002` | 通用 SDK 的协议、传输、认证、重试、错误、事件客户端或跨语言 surface 实现 | `L0-sdk` |
| `NG-CHAT-003` | 内部 bus 直连、broker / topic / ACK / DLQ / replay 运行时 | `L0-bus` / `L0-sdk` 正式 seam |
| `NG-CHAT-004` | Runtime 推理、计划、Tool 执行、Capability / Sandbox、Member 容器编排 | `L2-runtime`、`L2-tools`、`L3-capability-hub`、`L4-sandbox`、`L2-member-service` |
| `NG-CHAT-005` | Bridges 的 Slack / Mattermost 等外部平台映射和外部消息正文 | `L6-bridges` |
| `NG-CHAT-006` | Observability backend、原始日志、metrics store、审计存储和最终验收报告 | `L4-observability` |
| `NG-CHAT-007` | 完全离线业务工作流、离线审批成功、离线创建 / 修改业务对象 | 后续专项；当前只允许展示缓存与显式待恢复状态 |
| `NG-CHAT-008` | IDE、代码编辑、部署宿主、复杂管理后台和外部 GRC | 其他产品 / 能力项目 |
| `NG-CHAT-009` | 未有 authority 支撑的具体框架、性能数字、容量、可用率和公共包名 | Step 13~14 或后续架构 / 配置阶段 |

### 4. 当前文档问题诊断

| 旧内容 | 问题 | 修订 |
|---|---|---|
| 旧 `00` G-1~G-7 | 目标大多是页面数量、固定字段、500ms、100% 等候选数字，未说明 owner 合同和证据来源 | 改成状态 / 边界 / 能力成立目标，数值后置。 |
| 旧 `00` NG-5 | “完全离线不做”过于粗糙，没有区分展示缓存、命令 unknown 和恢复 | 改成离线展示允许，离线业务成功禁止伪造。 |
| 旧 `01` “目标架构” | 把“协作操作系统前台”当作无限扩张口号 | 限定为可消费正式能力的客户端入口。 |
| 旧 `05/06` | 先写测试对象和通过率，目标来源不清 | 先定义目标闭环，再在后续文档生成测试和验收切口。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标性质 | 页面和性能数字 | 客户端体验、状态、恢复、安全和 owner boundary | 使目标与当前证据能力匹配。 |
| 离线 | 统一排除 | 区分展示缓存与业务提交 | 支持跨平台体验，禁止错误成功。 |
| SDK | 依赖包存在即视为目标成立 | SDK capability / gap 可追踪，Chat 不实现通用能力 | 对齐用户倾向。 |
| Gate | “卡片完整 / 提交成功” | 显化 + controlled command + confirmed result 分层 | 保护治理真相。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 以固定 UI 页面和数字为目标 | 容易写验收 | 缺少 owner / 状态语义，容易伪造 ready | 不采用。 |
| 以“所有上游能力都在 Chat 可用”为目标 | 表面完整 | 受未闭合合同影响，导致跨仓越权 | 不采用。 |
| 以可消费能力、状态分层和安全恢复为目标 | 能在上游部分阻塞时保持诚实，适合跨平台 | 需要较多状态定义 | 采用。 |

### 7. 结构化中间产物

#### 7.1 范围三层

```text
P0 核心：导航 / 展示 / 发送与变化 / Gate 入口 / 安全状态 / 恢复
P1 增强：Workspace 聚合、Artifact 深度预览、搜索、通知、跨端偏好
P2 后置：复杂管理、完全离线业务、IDE、外部平台、全量服务覆盖
```

#### 7.2 目标到边界映射

| 目标 | 客户端责任 | SDK / owner 前置 | 未闭合时姿态 |
|---|---|---|---|
| G-CHAT-003 | 渲染和 reducer | Conversation query / event / cursor | stale / gap / not-visible |
| G-CHAT-004 | draft / intent / status | owner command result / idempotency | submitted / unknown / retry |
| G-CHAT-005 | cards / panels / action entry | Governance / Work / Identity / Artifact safe surface | read-only / blocked |
| G-CHAT-006 | cache / resume / merge | SDK resume / cursor / dedupe semantics | degraded / manual retry |
| G-CHAT-007 | a11y / redaction / disclosure | owner visibility / safe view / observability seam | fail-closed |

### 8. 回填草稿

正式 `00-需求文档.md` §4 可回填为：

> 本次需求的目标是建立一个可信的跨平台协作客户端：它能够在授权范围内统一进入和展示多种对话入口，消费各 owner 的正式 safe view、变化和受控命令结果，区分草稿、提交意图、optimistic、confirmed、failed、unknown 和恢复状态，并在跨端、弱网、缓存、可访问性和客户端安全边界上保持可解释。
>
> 本次需求不把任何上游业务 truth、通用 SDK、内部 bus、Runtime / Tools / Bridges / Observability backend、完全离线业务工作流、IDE 或管理后台纳入 Chat。未闭合的上游合同只能进入 `pending / blocked / waiting / degraded / fail-closed` 姿态，不能用 fake、ACK、静态缓存或历史文档把目标标成已成立。

### 9. 待确认事项

- P0 / P1 的具体产品发布切片待在架构和实施阶段按 owner contract 再裁剪。
- 跨平台是否所有能力同等开放，或 Mobile 首批只开放阅读、通知和审批入口，需要后续确认。
- 离线展示缓存的保留范围、加密策略和失效时间需要在配置 / 安全阶段确认。

### 10. 进入下一步条件

- 目标可验证但未伪造运行数字。
- 非目标明确指向 owner 或后续阶段。
- P0 / P1 / P2 范围和阻塞姿态可被后续能力、功能和接口章节复用。
- Step 4 自检通过，允许进入 Step 5。

### 11. 原型修复回写

原型确认目标需覆盖项目详情/项目进度一体化、项目与群聊双向进入、公司级成员目录、BPMN 整体与阶段视图、并行流程和 Gate 显化；这些目标仍限于展示、导航、受控入口和状态表达。客户端不因此拥有项目、成员或治理真相。

- 新增目标：`G-CHAT-009~010`。
- 新增非目标：`NG-CHAT-010`，不把流程计算、成员裁决或审批成功判定放入 Chat。
- Step 4 自检：目标与非目标已与冻结原型逐项对齐，未引入实现方案。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

| 目标 | 必须成立的结果 | 验证方向 |
|---|---|---|
| `G-CHAT-001` 统一协作入口 | group/channel/dm/thread 及相关项目语境在正式可见范围内可进入，并能解释当前选择。 | 跨端入口、路由和语境状态对照。 |
| `G-CHAT-002` owner truth 分离 | owner 事实只经 SDK safe view/result/change 被消费；store、缓存和 view model 不形成第二真相。 | 来源/归属对账与禁止反写边界。 |
| `G-CHAT-003` 对话与 Turn 显化 | 不同 Turn 表现、线程关系、变化、分页、缺口和不可见状态可理解。 | 渲染、变化和降级语义。 |
| `G-CHAT-004` 受控意图与结果 | 草稿、选择、提交、optimistic、正式确认、拒绝、失败、unknown 和重试边界可区分。 | command receipt/result 与状态分层。 |
| `G-CHAT-005` 跨域安全显化 | GateCard、项目/成员/运行摘要和 Artifact 引用在授权范围内显示；缺合同可只读或 blocked。 | safe view/ref、受控入口与降级状态。 |
| `G-CHAT-006` 多端与恢复 | cursor/resume、重复/乱序/缺口、离线展示缓存、重连和 Desktop 重启有明确客户端语义。 | 变化、恢复与多端语义对照。 |
| `G-CHAT-007` 安全与可访问性 | 不可验证语境 fail-closed；敏感正文不进入不必要的持有面；核心路径可通过键盘和受支持辅助技术完成。 | 最小披露、状态解释和等价路径。 |
| `G-CHAT-008` SDK gap 可追踪 | 必需 SDK capability、owner、影响和阻塞姿态可追溯，不用 Chat 私有协议填补。 | SDK gap register 与接口/风险映射。 |
| `G-CHAT-009` 项目流程可理解下钻 | 用户可从项目详情进入整体流程、阶段子流程和节点详情，并区分并行网关与 Governance Gate。 | 流程投影、层级导航、节点来源和分支状态对照。 |
| `G-CHAT-010` 项目与群聊关系可理解 | 用户可从群聊进入绑定项目，也可从项目进入多个关联群聊；成员集合按当前语境分别判断。 | 绑定投影、可见性、双向导航和多群聊场景对照。 |

| 非目标 | 归属或当前处理 |
|---|---|
| `NG-CHAT-001` Conversation、Turn、Participant、Project、Member、Gate、Artifact、Workspace、Runtime、Observability 的业务 truth 与生命周期 | 各正式 owner。 |
| `NG-CHAT-002` 通用 SDK、认证/传输/事件/错误/重试协议实现 | `L0-sdk`。 |
| `NG-CHAT-003` 内部 bus 直连及 broker/topic/ACK/replay 运行时 | `L0-bus` 与 SDK 正式 seam。 |
| `NG-CHAT-004` Runtime 推理、Tools 执行、Capability/Sandbox、Member 容器编排 | 对应专项 owner。 |
| `NG-CHAT-005` 外部平台映射与外部消息正文 | `L6-bridges`。 |
| `NG-CHAT-006` Observability backend、原始日志与正式审计/验收报告 | `L4-observability` 等正式 owner。 |
| `NG-CHAT-007` 完全离线业务工作流或离线审批成功 | 当前仅允许展示缓存、草稿和待恢复状态。 |
| `NG-CHAT-008` IDE、代码编辑、部署宿主、复杂管理后台和外部 GRC | 其他产品或能力项目。 |
| `NG-CHAT-009` 无 authority 的固定框架、性能、容量、可用率和公共包名 | 维持候选或待确认。 |
| `NG-CHAT-010` Chat 自行编排 BPMN、项目完成、并行汇聚或治理审批 | 由 Work / Governance 提供正式结果；Chat 只展示和发起受控入口。 |

V1 采用 Desktop-first 的产品范围；React/TypeScript 共享客户端 core、Tauri Desktop shell 和后续 Mobile Capacitor 均为 draft/后续设计候选，不作为当前需求层的正式协议或交付已完成事实。

项目详情、项目进度、关联群聊和成员目录属于 V1 的展示需求；具体 owner projection、权限和 SDK surface 仍由后续章节登记为依赖或待确认项。
