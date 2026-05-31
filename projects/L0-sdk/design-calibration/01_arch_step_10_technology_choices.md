# Step 10. 关键技术选型

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-sdk/01-架构设计.md` §11 关键技术选型

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.11 关键技术选型
  - `standards/document/架构设计讨论流程_SOP.md` Step 10
  - `projects/L0-sdk/00-需求文档.md` §9 功能需求 / §10 业务规则与边界约束 / §11 数据需求与数据归属 / §12 接口与依赖 / §13 非功能需求
  - `projects/L0-sdk/design-calibration/01_arch_step_02_arch_goals_constraints.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_07_dependency_direction.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_08_data_ownership_consistency.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_09_interactions_communication.md`
- 已确认结论：
  - `L0-sdk` 是 Rust / Python / TypeScript 三语言官方客户端接入层，不是 binding-only 仓或服务端 gateway。
  - `L0-core` / `L0-bus` 是 SDK 的直接稳定上游 truth，SDK 只能消费、派生和封装，不得重定义。
  - L1/L2/L3/L4 formal APIs 和 fake / fixture endpoint 是运行期能力边界，不是 SDK 源码依赖。
  - SDK truth 包括官方客户端语义、语言映射、candidate、横切默认、兼容演进和验证结论。
  - 服务能力访问采用同步请求 / 响应口径，事件能力采用 `L0-bus` 语义下的异步事件 / 回调口径，candidate 验证和反馈治理采用后台 / 延后承接口径。
  - 本 Step 只讨论已经上升为架构层决定的技术机制，不写具体协议、生成器、package manager、目录树、命令、类、函数或测试用例。

### 3. SOP 问题回答

1. 当前采用哪些关键架构机制？

   回答：当前采用七类关键架构机制：上游契约派生视图与官方语义封装分层、三语言语义基线与 idiomatic 表达分离、正式服务边界 adapter、`L0-bus` 语义事件客户端视图、本地 package candidate 与验证证据链、跨语言横切默认策略、版本兼容 / deprecated 治理与上游版本引用。

2. 每个机制解决什么问题？

   回答：这些机制分别解决 SDK 退化成 binding-only、三语言语义漂移、运行期封装变成源码耦合、事件 client 越界成为 bus runtime、公共发布掩盖不可验证、错误 / trace / redaction 跨语言不一致、上游变更和 breaking change 不可追溯等问题。

3. 为什么不用其他方案？

   回答：不采用纯手写 client、不采用只生成 raw binding、不采用 SDK server gateway、不采用公共注册表作为 P0 真相、不采用 SDK 自定义事件 runtime、不采用按语言各自决定 error / trace / redaction 语义，也不把具体工具名直接当成架构选型。

4. 每个选型带来什么代价或新风险？

   回答：这些机制会带来语义基线维护、派生快照 stale 标记、语言表达审查、adapter 边界定义、验证 runner 和 fake 目标维护、跨语言横切一致性测试、版本和 deprecated 追溯材料维护等成本。它们能守住 SDK 边界，但不是无成本抽象。

5. 哪些选型是当前阶段必要的，哪些暂不引入？

   回答：当前阶段必要的是官方客户端语义分层、三语言一致、formal API / fake 边界、bus event client 视图、candidate 验证、横切默认和兼容治理。暂不引入公共注册表正式发布、完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态、全量 L1/L2/L3/L4 client 覆盖和具体工具链产品锁定。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §3 架构风格与选型 | 旧文档直接写 `generated binding + language-specific thin wrapper` | 方向可迁移，但把方案写得过窄，容易把 SDK 降成 binding + wrapper 工程 |
| §6.2 容器职责与技术栈 | 旧文档列 `buf`、shell、cargo、poetry / uv、pnpm、tsup | 这是工具链清单，不是架构层技术机制 |
| §6.3 通信方式与选择理由 | 旧文档提前写 gRPC / Connect / HTTP 候选 | 技术协议选择早于通信边界判断，容易和 Step 9 冲突 |
| §8 数据所有权 | 旧文档把 generated binding、versions、examples 当作数据主线 | 派生产物和示例可能反向变成 SDK truth |
| §9 关键技术选型 | 旧文档把 codegen、TypeScript 包装、Python 包管理、redaction 混为同一层 | 工具选择、语言生态选择和架构机制没有分层 |
| 全文 | 公共注册表、CI 和 release automation 像当前主线 | 与当前本地 package candidate 先行、公共发布后移的口径冲突 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 选型主语 | codegen 工具、语言插件、包管理、registry | 架构层技术机制 | 符合规范 4.11，不把工具名当架构判断 |
| SDK 结构 | generated binding + thin wrapper | 上游派生视图 + 官方语义封装 + 语言表达分离 | 防止 SDK 退化为 binding-only |
| 语言一致性 | 三语言 wrapper 各自实现 | 三语言共享语义基线，表达可 idiomatic | 保护官方 client 共同心智 |
| 服务访问 | wrapper 直接调 service | formal API / fake boundary adapter | 避免源码依赖服务仓或成为 gateway |
| 事件能力 | bus API 封装 | `L0-bus` 语义事件客户端视图 | 防止 SDK 自定义 bus runtime |
| 发布验证 | registry / CI 发布 | 本地 package candidate + 验证证据链 | 当前 P0 先证明可安装、可运行、可追溯 |
| 横切能力 | redaction 单项策略 | error / trace / redaction / credential protection 统一横切默认 | 三语言安全和可观测性必须一致 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按工具链列技术选型 | 工程实现联想直接 | 不能说明边界保护、数据归属和交互方式，容易提前锁死工具 | 不采用 |
| 方案 B：按架构机制收敛关键技术选型 | 能解释 SDK 为什么不是 binding-only、gateway 或 bus runtime | 需要后续概要 / 详细设计继续落到具体目录、接口和工具 | 采用 |
| 方案 C：完全不做技术选型，全部后移 | 避免提前承诺 | 后续概要设计缺少关键结构基线，三语言一致和 candidate 验证无法承接 | 不采用 |
| 方案 D：直接锁定公共注册表、完整 MCP、REST / GraphQL 和全量 client | 生态图完整 | 范围过大，会阻塞当前官方 client 基础闭环 | 不采用 |

### 7. 结构化中间产物

#### 7.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 上游契约派生视图与官方语义封装分层 | SDK 若只暴露 raw binding，会缺少官方 client 体验；若手写替代契约，又会制造 core / SDK 双真相 | 派生视图承接 `L0-core` / `L0-bus` truth，官方语义封装承接 SDK 自身 client truth | 需要维护派生视图与封装语义之间的边界，快照落后时必须标记 stale / pending | 该机制决定 SDK 是官方接入层而不是 binding-only 仓，属于架构层决定。 |
| 三语言语义基线与 idiomatic 表达分离 | Rust / Python / TypeScript 若各自按生态习惯演进，会形成三套平台语义 | 共享语义基线保护共同概念，语言表达层允许符合语言习惯的 API 形态 | 增加跨语言审查、命名映射、示例同步和 smoke 验证成本 | 该机制影响 SDK 的核心边界、数据 truth 和下游消费体验，不是目录组织细节。 |
| 正式服务边界 adapter 机制 | SDK 需要访问 L1/L2/L3/L4 能力，但不能源码依赖服务仓或拥有服务端业务 truth | formal API / fake boundary adapter 让 SDK 只封装运行期正式边界，并支持最小验证目标 | 需要维护 unsupported / unavailable / stale 等失败口径，且不能把 fake 结果误当生产 truth | 该机制保护客户端接入层边界，承接 Step 7 和 Step 9 的依赖与交互结论。 |
| `L0-bus` 语义事件客户端视图 | SDK 需要提供事件 client 体验，但不能重新定义 delivery、retry、dead-letter、replay 或 tap truth | 事件客户端视图只消费 `L0-bus` 语义，向调用方提供发布、订阅和失败感知的官方客户端口径 | 需要持续跟随 bus 语义变化，并明确未送达、挂起、fake / stub 或失败状态 | 该机制让 SDK 可用事件能力，同时避免越界成为 bus runtime。 |
| 本地 package candidate 与验证证据链 | 只谈公共发布或生成产物，无法证明 SDK 当前可安装、可运行、可学习和可追溯 | 本地 candidate、smoke、docs runner 和 fake / fixture target 能先证明 P0 官方 client 闭环成立 | 需要维护 runner、fixture、reports / artifacts 引用和 not verified 状态 | 该机制决定当前阶段如何判断 SDK 可用，不等同于公共注册表发布。 |
| 跨语言横切默认策略机制 | error mapping、trace propagation、redaction 和凭据材料保护若按语言分散实现，会造成安全和观测漂移 | 将横切默认作为 SDK truth，要求三语言默认行为一致并可验证 | 增加默认策略维护、敏感值测试、错误文本审查和调用方覆写边界说明成本 | 该机制直接影响安全、可观测性和验收门禁，不是某个日志库或中间件选择。 |
| 版本兼容 / deprecated 治理与上游版本引用机制 | 上游 core / bus / formal API 变化和 SDK breaking change 若不可追溯，会让下游升级不可控 | SDK candidate 必须引用上游版本，并形成兼容判断、deprecated 过渡和迁移口径 | 增加版本矩阵、迁移说明、旧能力保留和破坏性变更审查成本 | 该机制保护下游可预期升级，也防止下游反馈直接改写 SDK truth。 |

#### 7.2 简化对照表

| 当前采用 | 当前不采用 | 边界原因 |
|---|---|---|
| 上游契约派生视图 + 官方语义封装 | 纯 raw binding 暴露 | SDK 需要提供官方 client 体验，而不是只搬运类型。 |
| 三语言共享语义基线 + idiomatic 表达 | 三语言各自定义平台语义 | 允许表达差异，不允许语义漂移。 |
| formal API / fake boundary adapter | 源码依赖 L1/L2/L3/L4 服务仓 | 服务仓是运行期边界，不是 SDK 编译期 truth。 |
| `L0-bus` 语义事件客户端视图 | SDK 自定义事件总线 runtime | bus delivery、retry、DLQ、replay 和 tap truth 归 `L0-bus`。 |
| 本地 package candidate + 验证证据链 | 公共注册表作为当前 P0 前置 | 当前先证明可安装、可运行、可追溯，再进入公共发布阶段。 |
| SDK 横切默认策略 | 每种语言各自决定 error / trace / redaction | 安全和可观测性必须跨语言一致。 |
| 兼容治理与版本引用 | 静默 breaking change 或单语言 deprecated | 下游升级需要可预期、可追溯。 |

#### 7.3 技术边界说明短文

本章中的关键技术选型不是具体协议、生成器、包管理器、测试命令或公共发布平台，而是会影响 SDK 边界、三语言一致性、数据归属、交互承接和验收门禁的架构机制。具体工具和实现形态需要在概要设计、详细设计、测试方案和实施计划中继续落地。当前必须先收稳的是 SDK 如何消费上游 truth、如何形成官方 client 语义、如何通过 formal API / fake 边界验证、如何保持横切默认一致，以及如何让兼容演进可追溯。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §11 “关键技术选型”直接摘录并整理本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 关键技术选型是否按架构机制而非工具名表达 | A. 按架构机制表达;B. 按生成器、语言包、CI、registry 表达;C. 完全后移 | A | A 能说明为什么这些机制影响边界、真相、一致性和交互方式 | 已确认采用 A |
| SDK 主体是否采用“派生视图 + 官方语义封装 + 语言表达分离” | A. 采用;B. 只做 raw binding;C. 全手写 client | A | A 同时保护上游 truth 和官方 client 体验，避免 binding-only 与双真相 | 已确认采用 A |
| 当前 P0 是否以本地 package candidate 与验证证据链为主 | A. 是;B. 公共注册表先行;C. 不做 candidate 验证 | A | 当前需求已确认公共发布后移，必须先证明本地可安装、可运行、可追溯 | 已确认采用 A |
| 事件能力是否以 `L0-bus` 语义事件客户端视图表达 | A. 是;B. SDK 自定义 bus runtime;C. 各语言自行封装 | A | `L0-bus` 是事件语义 truth，SDK 只能提供客户端视图 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 11 的待确认事项。
- 具体协议、生成器、语言包管理、目录组织、runner 命令、报告格式、公共发布平台和全量 client 覆盖阶段后移到后续文档。

### 10. 进入下一步条件

- 已明确当前正式采用的关键技术机制。
- 已说明每项机制解决的架构问题、采用理由和代价 / 约束。
- 已确认不把技术栈清单、产品横向对比、具体协议或实现命令写成架构选型。
- 可以进入 Step 11 备选方案与取舍。
