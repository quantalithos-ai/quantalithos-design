# 01 架构 Step 4：系统边界与上下文

> 对应正式章节：`01-架构设计.md` §5 系统边界与上下文  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 3 已通过门禁。本步只说明 Console 在全局系统中的位置、正式上下文对象、输入/输出面和依赖失效姿态；不展开内部职责、限界上下文、容器、数据所有权、接口 schema、route 或实现层依赖。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取台账、flow、Step 1~3、正式 `00` §6/§12、SOP Step 4 与规范 §4.5 | done | §2 |
| 回答全局位置、上下游、输入/输出面、边界对象与失效问题 | done | §3 |
| 诊断旧上下文图的角色、接口、聚合中心和 SLA 污染 | done | §4 |
| 选择主图分组粒度并记录取舍 | done | §5 |
| 输出规范化系统上下文图、关系表和边界说明 | done | §6 |
| 判断复杂度、形成正式 §5 回填草稿 | done | §7~§8 |
| 保留 pending、完成自检和三层门禁 | done | §9~§10 |

本步不拆附录。主图把专项 owner 收缩为三组正式上下文对象，配套表逐 owner 说明边界；分组只降低图复杂度，不合并任何 owner truth。

## 2. 本步输入

| 输入 | 本步用法 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 提供正式 owner、访问边界、结果语义和依赖 pending。 |
| `01_arch_step_02_goals_constraints.md` | 提供 Console 客户端边界、owner-partitioned 消费、局部降级和架构非目标。 |
| `01_arch_step_03_responsibility_boundary.md` | 提供做/不做、易混职责、输入/输出上限和边界红线。 |
| `00-需求文档.md` §6、§12 | 提供本仓依赖裁剪、产品能力面、外部依赖与同步/异步结果语义；本步不继承接口粒度。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` §4.1/§5 | 提供 L5 产品层通过 SDK 消费正式服务的全局位置；依赖类型细分留到 Step 7。 |
| 专项上游正式文档 | 确认各 owner 只作为正式来源/治理依赖，不把实现或未闭口 surface 写入主图。 |
| 架构 SOP Step 4、书写规范 §4.5 | 约束主图对象类型、关系类型、数量、布局、配套表和边界说明。 |
| 旧 `01` §4、README、draft 上下文草图 | 只做 historical material 污染诊断。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓在全局系统中的位置是什么？ | `L5-console` 位于 Layer 5 产品/分发层，是浏览器与辅助技术环境中的组织治理和管理入口；它通过 `L0-sdk` / 正式服务边界消费 L1~L4 owner 的管理能力，不成为 Server、聚合真相仓或治理裁决中心。 |
| 它有哪些正式上游？ | 共享安全定义来源 `L0-core`、官方访问边界 `L0-sdk`，以及 identity/member、work/process/workspace、method/governance/artifact、capability/observability/archive/sandbox 等正式 owner。scope/visibility/资格由相应正式 owner 提供，不单独发明新的 Console authority。 |
| 它有哪些正式下游？ | 当前没有以 Console UI state 为业务 truth 的下游。浏览器/辅助技术入口环境消费 Console 的客户端体验；条件化安全诊断消费者和未来 L5/L6 正式 link/ref 只属于外围输出，不进入核心业务主链。 |
| 它从外部接收哪些输入面？ | 接收共享安全引用/错误语义、正式 actor/scope/visibility/资格、各 owner 的安全查询结果与引用、命令 receipt/result/reconciliation（若正式开放）、状态失效提示（若 SDK 正式封装）以及用户经入口环境形成的导航、查询与受控意图。 |
| 它向外部提供哪些输出面？ | 向入口环境提供导航、状态解释、草稿/请求呈现、错误恢复和可访问交互；经正式边界向 owner 提交明确的受控意图；可条件化输出无 forbidden body 的客户端诊断和正式安全 link/ref。它不输出业务事件、owner truth、verdict 或 readiness。 |
| 哪些外部系统或相邻仓构成正式上下文边界？ | 主图保留入口环境、L0 contract/access、身份/工作/Workspace owners、方法/治理/制品 owners、能力/观测/归档/Sandbox owners 五类对象。未停审 L5/L6、内部数据库/总线、mock、文档来源和用户角色不进入主图。 |
| 依赖失效时，本仓的降级口径是什么？ | actor/scope/visibility 无法验证时受保护面 fail-closed；单一业务 owner 失败时仅其依赖区域 partial/stale/unavailable/blocked，不能扩散或被其他成功掩盖；SDK/正式 surface 缺失时不得私有旁路；unknown 命令先正式回查，不能回查则保持 unknown。 |

## 4. 当前材料与旧文档问题诊断

| 历史表现 | 问题 | 本步处置 |
|---|---|---|
| 旧上下文图把“管理者/合规官/方法制定者/SRE/Auditor”画进图。 | 角色属于需求层，不是规范允许的系统上下文对象。 | 主图使用“浏览器/辅助技术入口环境”，角色差异留在 `00`。 |
| 旧图在关系线上写 `queries / verify / metrics`，并把 SDK 标成 `core auth + queries`。 | 混入接口能力、调用细节并暗示 SDK/Console 拥有认证。 | 图只使用 input/output/dependency；具体能力面放配套表且不写接口名。 |
| 旧图以 `quantalithos-console` 为多域聚合治理中心。 | 把客户端入口误写成跨域 truth 或治理中心。 | Console 作为中心图对象仅表示被设计仓，不表示 truth 中心；owner 群组保持独立。 |
| 旧 §4.3 为每个 API 写死 `99.9%/99.95%` SLA 和统一 skeleton 降级。 | 无 authority 数字与不同 owner 失效语义混在上下文层。 | 删除数字；采用身份语境 fail-closed、业务 owner 局部降级的行为口径。 |
| draft 图写 query/command adapter、SDK 和下游产品连接。 | 候选方向合理，但包含实现名和未经停审的产品输出。 | 只保留正式访问边界与入口环境；其他产品 link/ref 维持 pending。 |
| 旧材料遗漏 Workspace、Archive、Sandbox 或混入 Provider。 | 上下文不完整且使用历史能力对象。 | 按当前正式 owner 清单覆盖，Provider Contract 不成为上下文对象。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步口径 | 原因 |
|---|---|---|---|
| 中心含义 | Console 是治理/聚合中心 | Console 是客户端入口和消费边界 | 中央位置只为图布局，不能改变 truth owner。 |
| 外部对象 | 角色、API、技术组件和部分服务混列 | 入口环境、L0 contract/access 与正式 owner 群组 | 对齐系统上下文允许对象类型。 |
| 关系 | 查询、验证、指标、接口和调用箭头 | 输入、输出、依赖 | 避免提前进入 Step 7/9 和协议设计。 |
| 失效 | 统一 SLA 与 skeleton fallback | 语境 fail-closed、owner 局部降级、缺 surface blocked | 对齐正式需求中的差异化安全姿态。 |
| 下游 | UI state 可隐含供其他产品消费 | 当前无业务 truth 下游；外围只允许正式 link/ref 或安全诊断 | 防止产品间私有状态依赖。 |

### 5.2 设计取舍

| 方案 | 优点 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 在一张图逐一画 13 个专项 owner | 对象最完整。 | 超出图对象建议数量，连线噪声会掩盖边界。 | 不采用；图分三组，表逐项展开。 |
| B. 把所有 owner 合成一个 Server 节点 | 图最简单。 | 会抹平 truth owner、局部失效和 activation 差异。 | 不采用。 |
| C. 主图保留 3 个 owner 群组并在关系表逐 owner说明 | 图清晰且不丢失正式归属。 | 读者需结合表理解细节。 | 采用。 |
| D. 把其他 L5/L6 产品画成正式下游 | 能显示未来导航关系。 | 项目未停审，可能把候选 link/ref 写成当前事实。 | 不采用；保留 pending。 |
| E. 把内部事件总线作为直接上游 | 可表达状态提示。 | 会暗示 Console 订阅私有 bus 并拥有 projection/cursor。 | 不采用；仅 `L0-sdk` 正式封装提示可作为可选输入。 |

## 6. 结构化中间产物

### 6.1 系统上下文图

#### 系统上下文图：L5-console

```text
                         +-----------------------------+
                         | L0-core / L0-sdk            |
                         | shared contract and access  |
                         +--------------+--------------+
                                        | dependency / input
                                        v
+--------------------------------+  +----+---------------+  +--------------------------------+
| identity / member / work /     |  |     L5-console     |  | method / governance /         |
| process / workspace owners     |->| client management  |<-| artifact owners                |
+--------------------------------+  | experience boundary|  +--------------------------------+
                                    +----+---------------+
                                         ^              |
                                         | input        | input / output
+----------------------------------------+----+          v
| capability / observability / archive /     |  +-------+---------------------+
| sandbox owners                              |  | browser / assistive         |
+---------------------------------------------+  | technology entry environment|
                                                 +-----------------------------+
```

图示说明：

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。
- 三个 owner 群组只用于控制图对象数量；每个仓仍保持独立 truth、合同、状态和失效边界。
- `L0-core / L0-sdk` 表示共享定义与官方访问依赖，不表示 Console 或 SDK 拥有认证、治理或业务事实。
- 入口环境承载用户交互的输入/输出，不是授权来源；相邻 L5/L6 产品未停审，未画入当前主图。

### 6.2 上下游与输入/输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享安全引用、错误和关联语境定义 | 只承接正式共享定义，不复制业务领域实现。 |
| `L0-sdk` | 输入/输出 | 依赖 | 正式 owner 访问、结果、引用和错误语义 | 是默认业务访问边界；exact client surface 未闭口时相关能力 blocked。 |
| `L1-identity` | 输入 | 来源 | actor/member 身份语境、生命周期安全摘要与引用 | 身份和认证 truth 不归 Console；不可验证语境影响所有受保护能力。 |
| `L2-member-service` | 输入/输出 | 来源/消费 | 成员宿主状态、安全引用和正式开放的管理意图 | 宿主、session 和执行生命周期不归 Console。 |
| `L1-work` | 输入/输出 | 来源/消费 | 项目、成员关系、工作状态和正式开放的管理意图 | 不由 Console 推进项目、工作或成员 truth。 |
| `L1-process` | 输入/输出 | 来源/消费 | 过程/活动安全状态、引用和正式开放入口 | Console 不推进流程，也不从页面推导过程 readiness。 |
| `L1-workspace` | 输入 | 来源 | 条件化 Workspace 安全视图与引用 | safe read/export 范围 pending；projection/cursor/rebuild 不迁入 Console。 |
| `L3-method-library` | 输入/输出 | 来源/消费 | 方法目录、版本安全摘要及条件化管理意图 | 本地草稿归 Console，正式资产和发布结果归方法库。 |
| `L1-governance` | 输入/输出 | 治理依赖 | visibility/资格、Governance/SoA/AIIA/Control/Gate 正式状态与决定 | Console 不复制 Policy/Gate 规则或生成 verdict。 |
| `L1-artifact` | 输入 | 来源 | artifact/evidence 安全摘要和引用 | 正文、版本链、baseline 和 evidence truth 不归 Console。 |
| `L3-capability-hub` | 输入/输出 | 来源/消费 | 注册、暴露、适配、访问复核安全状态与条件化管理意图 | 不创建 registry truth、secret 或 capability readiness。 |
| `L4-observability` | 输入/输出 | 来源/消费 | audit/metric/lineage/validation/report 安全结果与条件化诊断入口 | 正式 audit/report truth 归 Observability；诊断接缝仍 pending。 |
| `L4-archive` | 输入/输出 | 来源/消费 | 归档、完整性、兼容性、恢复、handoff 状态与条件化意图 | activation 未闭口时 read-only/blocked；不执行或裁定归档。 |
| `L4-sandbox` | 输入/输出 | 来源/消费 | 隔离、运行、捕获和清理安全状态与获准入口 | Console 不执行隔离、控制运行或推导 readiness。 |
| 浏览器 / 辅助技术入口环境 | 输入/输出 | 入口 | 导航/查询/管理意图输入与可感知、可操作的客户端反馈 | 入口环境不授予权限；兼容组合和精确支持矩阵 pending。 |
| 安全诊断消费者（条件化） | 输出 | 消费 | 最小、无 forbidden body 的客户端交互诊断 | sink 缺失不得改变业务结果；诊断不构成 audit/evidence。 |

### 6.3 依赖失效与降级边界

| 失效对象 / 条件 | Console 的架构姿态 | 明确不得发生 |
|---|---|---|
| 正式 actor/scope 无法验证、过期、撤销或冲突 | 对受保护内容和提交整体 fail-closed，保留最小恢复入口。 | 不得用旧 session、URL、缓存或偏好继续披露或提交。 |
| visibility/资格/Policy/Gate 结果 unknown 或不可得 | 相关入口和动作保持 restricted/unknown/blocked，解释遵守最小披露。 | 不得由菜单、角色字符串、feature flag 或客户端规则补 allow。 |
| 单一业务 owner 超时、不可用、结果过期或部分 | 只影响能证明依赖该 owner 的区域，分别呈现 stale/partial/unavailable。 | 不得将故障扩散为全局结论，也不得用其他 owner 成功掩盖。 |
| `L0-sdk` 或正式 owner surface 未开放 | 相应正向能力保持 read-only/blocked；保留不依赖该能力的安全壳。 | 不得转为数据库、repository、私有 API/bus 或 mock 旁路。 |
| command 响应中断或正式结果 unknown | 仅在正式 surface 存在时回查；否则保持 unknown 并阻止无依据重放。 | 不得将 receipt/transport success 当作完成或自动重试副作用。 |
| 安全字段、redaction 或多轴状态无法证明 | 裁剪为更小摘要/ref，必要时不呈现。 | 不得透传 raw/hidden body 或猜测完整、当前、一致。 |
| 安全诊断 sink 缺失或失败 | 业务呈现和恢复语义保持不变，诊断独立降级。 | 不得把诊断故障当 owner 失败、放宽权限或阻断安全恢复。 |

### 6.4 边界说明

入口环境、L0 共享定义/访问边界和三组正式 owner 构成 Console 的核心系统上下文，因为它们分别提供交互入口、统一接入约束和业务/治理结果来源。owner 分组仅用于控制主图复杂度，关系表保留每个 truth owner 的独立输入、输出和失效上限。内部数据库、repository、总线、mock、文档来源和用户角色不属于系统上下文对象；未停审的其他 L5/L6 项目只保留未来正式 link/ref 候选。Console 当前不向任何系统提供可作为业务 truth 的输出，其输出仅是入口体验、经正式边界提交的意图以及条件化安全诊断。

### 6.5 Step 5 承接输入

| Step 5 需要收敛 | 本步提供的边界 |
|---|---|
| 本仓内部语义为何需要划分 | 入口交互、正式访问约束、owner-safe 视图、受控意图/结果和韧性职责必须分层，不能按外部 owner truth 建核心域。 |
| 外部语义如何进入本仓 | 只以正式 actor/scope/visibility、owner-safe result/ref 和状态姿态进入，不吸收外部正文。 |
| 本地影子结构上限 | 仅 Console-owned 交互 truth、可失效快照和引用；不得形成 projection/cursor/rebuild。 |
| 跨上下文失效原则 | 安全语境 fail-closed，业务 owner 局部降级，unknown 挂起，诊断独立。 |

## 7. 复杂度判断

本步需覆盖 13 个专项 owner、入口环境和条件化诊断消费者，若逐一画入主图会超过规范建议对象数。采用“1 个中心仓 + L0 边界 + 3 个 owner 群组 + 入口环境”的主图，并在关系表逐 owner 展开，可同时保持图清晰和 owner 独立性；不需要拆附录。系统上下文不等于依赖分类，compile/runtime/event 将在 Step 7 单独审计。

## 8. 正式 §5 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“系统上下文图”“上下游与输入/输出面表”“依赖失效与降级边界”和“待确认事项”小节。

正式 §5 应原样承接 §6.1 的上下文图及图示说明，压缩承接 §6.2 的关系表，并保留 §6.3 的失效边界。正文需明确：Console 位于 L5 产品层，通过 L0 SDK/正式服务边界消费 L1~L4 owner 能力；三组 owner 只为图示收缩，不合并 truth；当前没有将 UI state 提供给下游作为业务事实的输出；未停审 L5/L6 不进入当前主图。不得在正式章节加入接口名、事件名、route、组件、协议或运行时调用顺序。

## 9. 待确认事项

本步不新增需求层待确认项。`CON-Q-034~043` 直接限制关系表中若干正向输入/输出面，`CON-Q-045~047` 限制量化、入口兼容和外围链接，但不改变系统上下文的 owner 关系。

| 待确认范围 | 当前系统上下文口径 |
|---|---|
| owner exact surface 与 activation | owner 保持正式上下文对象；未闭口能力只标输入/输出候选并保持 blocked/read-only，不声明 integrated。 |
| scope/visibility/safe-field/reconciliation | 关系保持能力级，具体字段和协议后移；安全上限不放宽。 |
| Workspace/Method/Capability/Observability/Archive/Sandbox 正向接缝 | 各自保持独立 owner；不能因为同处一个图组而推导共同合同或 readiness。 |
| 浏览器/辅助技术兼容与诊断 envelope | 入口和诊断上下文成立，精确组合和载荷仍 pending。 |
| 其他 L5/L6 产品 | 仅未来正式 link/ref 候选，不画入当前上下文主图。 |

## 10. 自检、三层门禁与进入 Step 5 条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确全局位置、正式上下游和输入/输出面 | pass | §3、§6.1~§6.2 已覆盖。 |
| 图中对象是否仅为仓、系统、外部能力或入口环境 | pass | 未画角色、文档、内部模块、DTO 或组件。 |
| 图中关系是否只使用输入/输出/依赖 | pass | 未使用具体 query、command、event 或协议名。 |
| owner 分组是否误合并 truth | pass | 图注和关系表明确每个 owner 独立。 |
| 是否定义依赖失效姿态 | pass | §6.3 区分语境 fail-closed、owner 局部降级、unknown 和诊断故障。 |
| 是否继承旧 SLA、聚合中心或历史接口 | pass | 无数字，无 Provider Contract，无接口名。 |
| 是否提前展开内部上下文、容器、数据或依赖类型 | pass | 相关内容均后移 Step 5~9。 |
| 正式 `01` 是否被提前写入 | pass | 只创建当前 calibration。 |

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 上下文图、逐 owner 关系表、边界说明和失效姿态已收稳，未混入协议或实现。 | 更新 flow 与台账，激活 Step 5。 |
| 文档级 | `pass_to_step_5` | 正式 §5 回填基础已形成；正式 `01` 继续等待 Step 16。 | 创建并完成 `01_arch_step_05_bounded_context_subdomains.md`。 |
| 项目级 | `pass_with_open_contracts` | exact surface/activation 仍 pending，但不阻塞内部语义边界按安全上限划分。 | 进入 Step 5；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
