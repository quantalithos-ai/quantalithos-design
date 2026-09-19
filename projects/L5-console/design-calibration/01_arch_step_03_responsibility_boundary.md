# 01 架构 Step 3：职责边界

> 对应正式章节：`01-架构设计.md` §4 职责边界  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 2 已通过门禁。本步只收敛 Console 的“做什么 / 不做什么 / 易混淆职责 / 边界红线”，不重画系统上下文图，不展开限界上下文、容器、数据所有权、接口协议或实现结构。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取项目台账、架构 flow、Step 1/2、正式 `00` §2/§10/§11 和架构规范 §4.4 | done | §2 |
| 回答职责、非职责、易混职责和隐式行为问题 | done | §3 |
| 诊断旧正式 `01`、README 和 draft 的职责串线 | done | §4 |
| 比较职责归属方案并作取舍 | done | §5 |
| 输出职责边界表、做/不做清单和边界红线 | done | §6 |
| 判断复杂度、形成 §4 回填草稿 | done | §7~§8 |
| 自检、保留 pending 并更新三层门禁 | done | §9~§10 |

本步不拆模块。Console 的管理主题将在 Step 4 的外部上下文和 Step 5 的内部语义结构中继续展开；本文件只定义这些主题在职责分工中的归属上限。

## 2. 本步输入

| 输入 | 用法 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 提供 Console 交互 truth、owner truth、SDK-only、结果分层、forbidden-body 和 fail-closed 基线。 |
| `01_arch_step_02_goals_constraints.md` | 提供 `AG-CON-*`、`IC-CON-*`、阶段取舍和架构非目标。 |
| `00-需求文档.md` §2、§10、§11 | 提供仓定位、业务规则、数据归属和各 owner 的职责边界。 |
| `00-需求文档.md` §9、§12 | 只用于确认管理主题消费面和受控查询/意图的职责范围，不锁接口形态。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 3 | 规定本步输出职责边界、非职责、易混职责和边界红线。 |
| `standards/document/架构设计书写规范.md` §4.4 | 规定 `职责项 / 类型 / 说明` 表结构及“做 / 不做 / 易混淆职责”三类。 |
| 旧 `01-架构设计.md`、README、`draft/01~03` | 只做历史污染和候选粒度审计。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓具体做什么？ | Console 承担客户端管理体验的统一边界：维持会话壳与导航连续性，承接正式 actor/scope/visibility/资格的呈现约束，组织 owner-safe 查询结果和安全回链，保存未提交意图与请求交互状态，忠实呈现 owner 正式结果，并提供局部降级、恢复、焦点和辅助技术等跨页面交互责任。 |
| 这个仓具体不做什么？ | 不承担成员、项目、工作、过程、治理、制品/evidence、Workspace、方法、能力注册、观测、归档或 sandbox 的正式 truth；不承担认证、授权/Policy/Gate/审批裁决、业务副作用、领域校验、幂等决定、正式审计/报告/证据正文、执行隔离或服务端跨域聚合。 |
| 哪些能力看起来相关但必须属于其他仓？ | actor/credential/scope 语境归身份和安全 owner；visibility/资格/Policy/Gate 决定归正式治理或授权 owner；各管理主题的状态和结果归对应 L1/L2/L3/L4 owner；Workspace projection/cursor/rebuild 归 Workspace；audit/metric/report/evidence 正文归 Observability/Artifact；Archive/Sandbox 的执行和终态归各自 owner；Chat/Runner/Sync/Marketplace/Bridges 主流程归相邻产品。 |
| 哪些行为绝不能隐式发生？ | 不能由 route、菜单、按钮、缓存、客户端角色或本地偏好授予授权；不能把 view model、局部卡片、颜色、固定数字或客户端阈值升级为治理/合规/readiness 结论；不能把 transport、receipt、toast、刷新或 optimistic state 说成 owner 已完成；不能在 unknown 时无正式依据重放；不能把 forbidden body、内部规则或外部正文写入 Console 生命周期；不能把客户端诊断当作正式 audit/evidence。 |
| 哪些边界如果不写清最容易串线？ | “session 壳与认证主体”“入口可见与授权决定”“owner-safe 快照与业务 truth”“筛选/联合视图与跨域结论”“草稿/receipt 与正式对象/结果”“客户端诊断与审计/evidence”“管理入口与 owner 主流程”“局部状态提示与 readiness”八组边界最容易被混淆。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料表现 | 职责问题 | 本步处置 |
|---|---|---|
| 旧 `01` 将 Console 定义为组织治理“中心”，并把多域聚合、审计回放、哈希验证和统一治理核心写成主职责。 | 消费面被升级为治理、审计或证据真相，且把跨域结论归给客户端。 | 改为“组织管理入口 + owner-safe 呈现”；正式决定、审计、证据和报告仍归 owner。 |
| 旧 `01` 的 Members/Projects/Governance/Audit/Metrics/Capability/Permissions 等上下文清单直接写成 Console 子域。 | 把外部业务对象和本地呈现职责混为本仓领域真相。 | 仅保留管理主题消费职责；主题真相与命令副作用明确排除。 |
| 旧 `01` 的 shared governance core、policy-aware guards、query adapters、widget registry 等被写成共享内部职责。 | 技术/概要/详细设计内容提前决定职责，并暗示本地 RBAC、聚合或组件注册。 | 只保留可审查的结构责任；实现形态后移到后续架构 Step。 |
| 旧 README 与 draft 将 Provider Contract、固定控制项/指标、审计 hash、报告和 readiness 作为页面能力。 | 历史协议、固定集合和派生结论反向定义 Console 责任。 | 统一标记为历史污染；只承接 owner 返回的安全状态和引用。 |
| `draft/03_模块划分与分层.md` 候选了 application orchestration、view-model policy、adapters、controlled state 和 test seams。 | 候选模块有粒度参考价值，但尚未经过本轮架构边界、owner contract 和正式门禁。 | 不把候选模块名升级为正式职责或实现承诺；职责层只描述归属和保护边界。 |
| `00` §2/§10/§11 已明确 Console 仅拥有客户端交互事实。 | 若架构仍写“聚合治理中心”，会直接与已停审需求冲突。 | 以 `00` 为唯一新真相，Step 3 只把需求边界转成架构职责。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步口径 | 变化理由 |
|---|---|---|---|
| 职责主语 | 页面族、治理面板和技术组件 | 客户端管理体验、owner-safe 消费、结果呈现和韧性边界 | 架构职责必须说明谁负责什么边界，而不是列功能或实现对象。 |
| 外部业务域 | Console “编织”或“聚合”多域事实 | 各 owner 保有 truth，Console 只组织安全消费面 | 防止形成第二真相和跨域 verdict。 |
| 权限 | 菜单/按钮/前端 guard 可能承担授权 | 正式 visibility/资格/Policy/Gate 决定，客户端只能收紧 | 保护撤销、最小披露和 fail-closed。 |
| 写入语义 | 页面操作可被视为管理事实 | Console 只承载草稿和请求经历；副作用与正式结果归 owner | 保持命令结果、审计和幂等边界。 |
| 审计与诊断 | 前端回放、hash、导出形成审计能力 | 客户端诊断只说明交互经历；正式 audit/evidence/report 由 owner 提供 | 避免把产品 telemetry 伪装为正式记录。 |

### 5.2 设计取舍

| 方案 | 优点 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 按页面族把成员、治理、审计、能力等都定义为 Console 领域职责 | 页面映射直观。 | 会把外部 truth、规则和结果吸入 Console，造成第二真相。 | 不采用。 |
| B. 只把 Console 定义成导航壳，不承担主题消费职责 | 边界极窄。 | 无法说明组织管理入口如何提供安全查询、回链和受控结果呈现。 | 不采用。 |
| C. 定义 Console 为客户端管理体验边界，主题按 owner 分域消费 | 能保留产品价值并保护 owner truth；可继续映射到后续上下文和交互设计。 | 需要接受主题能力按合同独立开放、局部降级和多轴状态。 | 采用。 |
| D. 在职责层固定 SDK adapter、组件 registry、缓存和路由组织 | 便于直接进入实现。 | 越过容器、技术选型、概要和详细设计，且可能伪造未存在的 client surface。 | 不采用。 |
| E. 把审计、报告、evidence 和 readiness 都列为“只读职责” | 看似仍不写入。 | 只读呈现也可能偷换正式裁决、正文和完成语义。 | 不采用；只承担安全呈现与回链，不承担其 truth。 |

## 6. 结构化中间产物

### 6.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 客户端会话壳和交互连续性 | 做 | Console 负责管理体验的会话壳，不把连续性解释为认证或持续授权。 |
| 页面导航、入口组织和受控信息架构 | 做 | Console 负责把正式可见范围组织成可理解入口，但入口本身不授予权限。 |
| 正式 actor/scope/visibility/资格姿态的安全呈现 | 做 | Console 负责忠实呈现正式决定及其允许的解释粒度，不生成决定。 |
| owner-safe 查询结果、来源状态和安全回链的客户端组织 | 做 | Console 负责让来源、时效、覆盖、可用性和一致性可理解，不改变来源事实。 |
| 未提交管理意图、表单草稿和提交前复核呈现 | 做 | Console 负责用户意图的交互连续性，草稿不成为正式对象或批准。 |
| 请求交互经历和 owner 正式结果的分层呈现 | 做 | Console 负责区分提交/受理/处理中/确认/拒绝/未知，不替 owner 宣布完成。 |
| 八类管理主题的 owner-partitioned 消费入口 | 做 | Console 负责组织员工、项目/Workspace、方法、治理/evidence、审计/指标、Capability、Archive、Sandbox 的安全消费面；各主题 truth 不归 Console。 |
| 局部错误、部分/过期/冲突/未知状态的保守解释与恢复 | 做 | Console 负责安全遮蔽、重验、重试、回查、退出和草稿保持等交互责任，不修复 owner truth。 |
| 焦点、键盘、读屏和非颜色语义的等价管理路径 | 做 | Console 负责使语境、资格、数据、确认、错误和恢复可感知、可操作。 |
| 安全裁剪的客户端交互诊断呈现 | 做 | Console 可说明交互/请求经历，但不把诊断升级为业务审计或 evidence。 |
| 身份、认证、credential、actor/session/scope 正式 truth | 不做 | 这些事实归身份或安全入口 owner；Console 只消费允许呈现的安全语境。 |
| 成员、项目、工作、过程、Workspace 和方法资产正式 truth | 不做 | 这些对象的生命周期、正文、版本和业务规则归各自 owner。 |
| Governance/SoA/AIIA/Control/Gate/Policy 决定与审批裁决 | 不做 | Console 只能呈现正式决定和安全引用，不能生成、放宽或替代裁决。 |
| Artifact/evidence/audit/metric/report 正文、版本链和正式 verdict | 不做 | Console 只消费安全摘要/引用和 owner 正式结果，不保存或生成正文。 |
| Capability registry、暴露/适配、secret、access-review 和 readiness truth | 不做 | Capability Hub 等 owner 保有注册、访问治理和运行语义。 |
| Archive 包体、完整性/兼容性/恢复事实与 Sandbox 执行隔离 | 不做 | Archive/Sandbox owner 负责执行与终态，Console 只呈现状态和获准入口。 |
| 领域副作用、服务端校验、幂等决定、reconciliation 和最终结果 | 不做 | Console 只能提交受控意图并呈现 owner 结果，不能在客户端复制业务规则。 |
| 数据库、内部 repository、私有 bus 或服务源码访问 | 不做 | 所有业务能力必须走 SDK 或正式服务边界；私有旁路会打穿 owner 保护。 |
| Chat、Runner、Sync、Marketplace、Bridges 的主流程和私有状态 | 不做 | 相邻产品各自拥有主流程；未停审内容不进入本仓职责。 |

### 6.2 做 / 不做清单

**做：**

- 组织正式管理能力的客户端入口、导航和交互连续性。
- 呈现正式 actor/scope、visibility、资格和 owner-safe 状态，并保留安全回链。
- 管理草稿、筛选/排序/布局、请求交互状态、错误/恢复和可访问呈现。
- 对各 owner 的管理主题提供可裁剪的查询、下钻和受控意图入口。
- 在正式能力未开放或状态不确定时维持 `read-only / partial / blocked / unknown` 等保守上限。

**不做：**

- 不成为任何外部业务、治理、证据、观测、归档、能力或 sandbox 真相源。
- 不认证、不授权、不生成 Policy/Gate/审批/合规/readiness 决定。
- 不执行领域副作用、隔离执行、归档恢复、报告生成或 evidence materialization。
- 不直连数据库、内部存储、repository、私有 bus 或服务源码。
- 不把客户端状态、传输状态、诊断、颜色或固定数字升级为正式事实。

### 6.3 易混淆职责表

| 易混淆职责 | Console 的上限 | 正式归属判断 |
|---|---|---|
| session 壳 vs 认证主体 | 维护交互连续性、失效呈现和退出姿态 | credential、认证、actor/scope truth 不归 Console。 |
| 入口可见 vs 授权/资格 | 按正式结果裁剪并解释入口 | visibility、资格、Policy/Gate 决定不归 Console。 |
| view model / 快照 vs 业务 truth | 组织 owner-safe 摘要、状态和引用 | 业务对象、版本、决定和结果仍归 owner。 |
| 联合视图 vs 跨域 verdict/readiness | 分 owner 展示并保留来源、coverage、consistency | 不生成统一健康、合规、审计、能力或运行结论。 |
| 草稿 / receipt / pending vs 正式对象 / committed result | 保留用户意图和请求经历，忠实呈现 owner result | 正式对象、副作用、幂等、审批和最终结果归 owner。 |
| 客户端诊断 vs audit/evidence/history | 记录最小交互/请求诊断 | 正式审计、证据、报告和业务历史归 Observability/Artifact/owner。 |
| 管理入口 vs owner 主流程 | 提供导航、查询和获准请求入口 | 成员、工作、方法、治理、归档和 sandbox 主流程不迁入 Console。 |
| 局部状态 vs readiness | 显示分域状态轴和限制 | readiness、合规、审批和运行结论不得由 UI 推导。 |

### 6.4 边界红线清单

- 不得由菜单、route、按钮、客户端角色、feature flag、缓存或先前页面状态授予访问或动作资格。
- 不得绕过 `L0-sdk` / 正式服务边界直连数据库、内部 repository、私有 bus、服务源码或另建跨域聚合后端。
- 不得将 owner-safe snapshot、view model、客户端缓存、筛选结果或联合卡片升级为业务、治理、审计、能力、归档、运行或 readiness truth。
- 不得把 HTTP/SDK transport success、receipt、accepted、toast、刷新、缓存失效或 optimistic state 表述为 owner 正式完成。
- 不得在副作用结果为 unknown 时无正式幂等或 reconciliation 依据自动重放；无法回查时必须保持 unknown/blocked。
- 不得让正式 actor/scope/visibility/资格的撤销、过期、冲突或 unknown 被旧客户端状态、草稿或缓存放宽。
- 不得复制 credential、secret、授权/治理证明、raw/hidden payload、外部业务正文、audit/evidence/report/package 或内部规则到任何持久、缓存、错误、日志、诊断或导出旁路。
- 不得用固定控制项数量、指标数量、客户端阈值、颜色或局部状态生成审批、合规、审计、能力或 readiness 结论。
- 不得把 Workspace projection/cursor/rebuild、Capability registration、Observability audit/metric 生成、Archive/Sandbox 执行或 owner 后台任务迁入 Console。
- 不得让一个 owner 的失败、过期或部分结果覆盖其他 owner 状态，也不得用其他 owner 成功掩盖该局部问题。
- 不得让视觉页面可用掩盖键盘、焦点、读屏或非颜色路径无法完成同一受控管理目标。
- 不得把未停审的其他 L5/L6 项目、旧 Provider Contract、旧技术框架或历史指标当成本仓职责依据。

### 6.5 Step 4 承接输入

| Step 4 需要回答 | 本步提供的边界 |
|---|---|
| Console 在全局系统中的正式位置 | 只作为客户端管理体验和 owner-safe 消费边界，不作为任何业务/治理 truth owner。 |
| 哪些对象构成正式外部上下文 | 用户/运行环境、L0-core/L0-sdk、正式语境/资格提供方、L1~L4 owners；具体关系待 Step 4 收敛。 |
| 输入面上限 | 正式 actor/scope/visibility/资格、owner-safe query/result/ref、状态/失效提示。 |
| 输出面上限 | 用户交互呈现、经正式边界提交的受控意图、条件化安全诊断或正式链接；UI state 不成为业务输出。 |
| 失效姿态 | 语境不可验证时 fail-closed；单 owner 失败局部降级；未闭口能力 read-only/partial/blocked。 |

## 7. 复杂度判断

本步覆盖横向交互职责、八类管理主题以及多组易混边界，但职责只需按“做 / 不做 / 易混淆职责”三类表达。单文件足以审查，不拆附录；具体 owner 关系、运行承载、数据类型和通信方式分别后移 Step 4、6、8、9，避免职责表膨胀成系统上下文或详细设计。

## 8. 正式 §4 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“结构化中间产物”“设计取舍”和“待确认事项”小节，了解职责如何从需求边界和架构约束收敛。

`L5-console` 的职责是把多个正式 owner 的管理能力组织成可信、可导航、可恢复且可访问的客户端体验。Console 拥有会话壳、导航、筛选/布局、表单草稿、请求呈现、错误/恢复和有限偏好等交互事实；它只消费并忠实呈现正式语境、资格、owner-safe 快照、结果与引用，不拥有或推导其业务、治理、证据、观测、归档、能力或运行 truth。

正式 §4 应回填本文件 §6.1 的职责边界表，并保留 §6.4 的边界红线。§6.3 易混淆职责表应作为职责表后说明，明确 session/认证、可见性/授权、view/truth、receipt/result、诊断/audit、入口/主流程和局部状态/readiness 不能混层。正式章节不得新增 owner、API、容器、数据字段、组件或技术机制。

## 9. 待确认事项

本步不新增需求层待确认项。已有 `CON-Q-034~047` 继续有效，但不阻塞职责归属闭合：exact surface、scope、visibility、safe-field、reconciliation 和正向 activation 只会限制某项职责可达到的具体交互深度，不会把外部 truth、裁决或执行职责转移给 Console。

| 待确认范围 | 当前职责上限 |
|---|---|
| exact owner query/command/result/ref 与 activation | Console 只承担能力级消费和保守呈现；无正式 surface 时 read-only/blocked。 |
| scope、visibility、资格与 reason | Console 只呈现外部正式结果并可进一步收紧，不拥有其定义。 |
| safe-field、多轴状态和 forbidden-body envelope | Console 只接受可证明安全的最小摘要/引用，不因字段未定扩大职责。 |
| reconciliation 与幂等 | Console 只承担结果呈现和正式回查入口，不承担 owner 幂等决定。 |
| 本地状态生命周期、性能、兼容和诊断 | 属后续架构/配置/测试细化，不改变本步职责归属。 |
| 未停审 L5/L6 产品链接 | 仅未来协作候选，不进入 Console 当前职责主链。 |

## 10. 自检、三层门禁与进入 Step 4 条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确做什么、不做什么和易混淆职责 | pass | §6.1~§6.3 已按规范三类收稳。 |
| 是否给出可否决的边界红线 | pass | §6.4 覆盖授权、访问、truth、结果、forbidden body、局部失败和 a11y。 |
| 职责说明是否只回答归属与边界 | pass | 未写 API、调用方式、数据字段、容器或实现机制。 |
| 是否把功能项直接当职责 | pass | 页面功能只作为消费主题背景，职责主语是客户端边界。 |
| 是否提前写系统上下文或限界上下文 | pass | 未画关系图、未划子域；只给 Step 4 输入上限。 |
| 是否继承旧治理中心、Provider Contract、固定数字或技术组件 | pass | 均已在 §4 降级为历史污染。 |
| 是否保留 pending 而不转移 owner 职责 | pass | `CON-Q-034~047` 只限制具体深度，不改变 truth owner。 |
| 正式 `01` 是否被提前写入 | pass | 本步只创建 calibration，正式文件未修改。 |

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 做/不做/易混职责和边界红线已闭合，未混入上下文、数据、接口或实现方案。 | 更新 flow 与项目台账，激活 Step 4。 |
| 文档级 | `pass_to_step_4` | 正式 §4 回填基础已形成，正式 `01` 仍须等待 Step 16 装配。 | 创建并完成 `01_arch_step_04_system_context.md`。 |
| 项目级 | `pass_with_open_contracts` | 上游 exact contracts 和 activation 仍限制正向深度，但不阻塞系统上下文的架构级关系讨论。 | 进入 Step 4；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
