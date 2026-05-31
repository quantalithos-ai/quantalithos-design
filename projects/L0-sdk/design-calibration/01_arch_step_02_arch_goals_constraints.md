# Step 2. 明确架构目标与约束

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-sdk/01-架构设计.md` §2 业务背景与驱动力 / §3 约束条件

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.2 业务背景与驱动力
  - `standards/document/架构设计书写规范.md` §4.3 约束条件
  - `standards/document/架构设计讨论流程_SOP.md` Step 2
  - `projects/L0-sdk/00-需求文档.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_01_requirements_baseline.md`
- 已确认 Step 1 结论：
  - 架构基线以新版 `00-需求文档.md` v0.2.0 为准。
  - `L0-sdk` 是 Rust / Python / TypeScript 三语言官方客户端接入层。
  - `L0-core` / `L0-bus` 是直接稳定上游 truth。
  - L1/L2/L3/L4 是运行期正式 API 或 fake / fixture endpoint 封装目标，不是 SDK 源码 truth。
  - 公共注册表、完整 MCP、REST / GraphQL、REPL、本地缓存和全量 client 覆盖不进入当前 P0 架构主线。

### 3. SOP 问题回答

1. 这个仓在架构层面要确保什么成立？

   回答：必须确保 `L0-sdk` 成为 Quantalithos 官方三语言客户端接入层，并能把 `L0-core` 共享契约、`L0-bus` 事件语义和正式服务边界转译为 Rust / Python / TypeScript 可用、可学习、可验证、可追溯、可安全默认使用的 client 结构。同时必须保证 SDK 不重新制造 core / bus / 服务端 / auth / UI / runtime truth。

2. 哪些约束是不可变的？

   回答：不可变约束包括不重新定义 `L0-core` 契约 truth、不重新定义 `L0-bus` 事件语义 truth、不成为服务端 gateway / facade、不执行认证授权或治理审批、不拥有 L1/L2/L3/L4 业务事实、不保存业务正文 / 事件正文 / 生产请求响应正文 / 观测正文 / UI 或 runtime 状态正文 / 凭据正文、不把公共注册表或完整 MCP 等外围增强写成当前 P0。

3. 哪些约束是当前阶段可以接受的取舍？

   回答：当前阶段可以接受先以本地 package candidate 证明三语言 SDK 成立，而不是要求公共注册表正式发布；可以接受先用稳定服务边界或 fake / fixture endpoint 证明最小接入，而不是覆盖所有 L1/L2/L3/L4 client；可以接受 codegen、transport 方案、语言包目录、性能阈值和证据格式后移到后续架构 Step、概要、详细、测试或实施计划。

4. 哪些目标可以明确判断，甚至量化？

   回答：架构层不使用旧文档中的公共 registry SLA、包体积、CI 时长或三语言发布时长作为架构目标。当前可判断的是结构性目标是否成立：是否存在官方 client 边界、是否只消费 core / bus truth、是否区分编译期依赖和运行期封装、是否保持三语言语义一致、是否具备本地可验证路径、是否保护 trace / error / redaction 默认行为、是否排除服务端和 UI / runtime truth。

5. 哪些事情虽然相关，但不是本仓架构当前要解决的问题？

   回答：core proto / DTO / ErrorCode / TraceContext / CloudEvents schema 定义、bus runtime、L1+ 服务端业务事实、认证授权、治理审批、UI 组件、runtime loop、公共注册表运营、完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态、全量领域 client 覆盖、测试脚本和具体发布命令都不是当前架构主线。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §1 业务背景 | 旧文档直接从多技术栈消费和第三方接入讲到三语言 SDK | 方向可迁移,但没有区分官方客户端接入层、binding-only、gateway 和发布流水线 |
| §1.2 驱动力 | 将 SDK 产品线、第三方接入、UI / runtime / bridges 接入体验混写 | 没有把结构性驱动力收束为 core / bus truth 消费、三语言一致和最小验证 |
| §1.3 成功标准 | quickstart、API 名称一致率、10 分钟发版、包体积、CI 时长等指标提前进入架构 | 多数属于测试、验收或实施计划,不应作为架构目标 |
| §2 约束条件 | 三语言都必须发布、trace 自动传播、redaction、包体积和 CI 时长混在一起 | 不可变边界、质量要求和实施指标层次混杂 |
| §3 架构风格与选型 | 提前选择 `generated binding + language-specific thin wrapper` | Step 2 只能收敛目标与约束,技术方案应后移到 Step 10 |
| §5 限界上下文 | 按 Codegen / Rust SDK / Python SDK / TS SDK / Examples 直接切上下文 | 可能把语言包目录或实现组织提前写成架构真相 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 背景主线 | 三语言 SDK、第三方体验和包发布 | 已稳定 core / bus 之后需要官方客户端接入层承接 | 架构背景应说明结构性缺口 |
| 架构目标 | quickstart、名称一致率、发布时长、trace 覆盖、包体积等指标 | 官方 client 边界、三语言一致、上游 truth 消费、最小验证、横切默认、兼容演进 | 架构目标必须写结构性结果 |
| 不可变约束 | 三语言都发布、trace 自动传播、redaction 默认开启等质量要求 | 不重定义 core / bus truth、不做 gateway / auth / UI / runtime、不保存禁止正文 | 不可变约束应保护仓级边界 |
| 当前取舍 | Python / TS 工具、Rust 打包、public split 等实现选项 | 本地 candidate 先于公共发布、最小接入先于全量 client、方案细节后移 | 取舍应表达当前架构收缩 |
| 架构非目标 | 分散在职责边界和功能章节 | 统一排除 core truth、bus runtime、server facade、auth、UI、runtime、完整 MCP、REST / GraphQL、REPL、本地缓存 | 防止后续章节串线 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：保留旧版量化成功标准作为架构目标 | 指标直观 | 多数指标属于测试、验收或实施计划,会污染架构目标 | 不采用 |
| 方案 B：用结构性结果定义架构目标 | 能支撑后续职责、上下文、依赖、数据和交互设计 | 不直接给出执行指标 | 采用 |
| 方案 C：把 codegen + thin wrapper 作为当前架构目标核心 | 与旧草案接近,容易实现 | 提前锁死技术选型,且可能把 SDK 写成 binding-only 仓 | 不采用 |
| 方案 D：把公共注册表、完整 MCP、REST / GraphQL 一起纳入 P0 | 生态叙事完整 | 范围过大,会阻塞第一批官方 client 闭环 | 不采用 |

### 7. 结构化中间产物

#### 7.1 业务背景结论

`L0-core` 和 `L0-bus` 已经分别稳定共享契约与事件语义,但这些底层能力还需要被 Rust / Python / TypeScript 消费者以一致方式使用。没有 `L0-sdk` 的架构边界,端侧产品、AI runtime、自动化脚本和第三方集成会各自复制协议、错误、trace、事件封装、redaction、版本兼容和示例材料,最终形成多套私有客户端接入口径。

因此,`L0-sdk` 的架构设计重点不是“生成三种语言的包”或“发布到公共注册表”,而是明确官方客户端接入层如何承接上游 truth、如何保持跨语言一致、如何提供最小可验证路径、如何守住客户端与服务端 / bus / auth / UI / runtime 的边界。

#### 7.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 多语言消费者需要统一官方接入口径 | 否则 Rust / Python / TypeScript 调用方会形成多套私有 client 和错误处理习惯。 |
| `L0-core` / `L0-bus` truth 需要被消费而不是被复制 | 否则 SDK 会重新制造 proto、DTO、ErrorCode、TraceContext、CloudEvents 或 delivery 语义。 |
| 服务端能力需要客户端封装,但不能变成 SDK truth | 否则 SDK 会膨胀成 server facade 或业务编排层。 |
| 三语言 idiomatic 差异需要架构边界约束 | 否则语言习惯会逐渐演变成平台语义差异。 |
| 本地可验证路径需要先于公共发布成立 | 否则发布渠道会掩盖 SDK 是否真正可安装、可调用、可学习和可验证。 |
| trace、error mapping、redaction 和兼容演进需要跨语言默认一致 | 否则安全、观测和升级风险会在语言之间漂移。 |

#### 7.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载官方三语言客户端接入层边界 | 否则 SDK 会退化为 binding-only 仓、发布脚本仓或某个产品的私有 client。 |
| 支撑 `L0-core` 与 `L0-bus` truth 的稳定消费 | 否则 SDK 会重新定义共享契约或事件语义,形成第二真相源。 |
| 守住客户端封装与服务端业务 truth 的边界 | 否则运行期 API 封装会演变为 server facade 或业务编排层。 |
| 允许 Rust / Python / TypeScript 语义一致且表达 idiomatic | 否则语言差异会破坏官方 client 的共同心智。 |
| 支撑本地 package candidate 与最小可验证接入路径 | 否则 SDK 只能证明类型存在,不能证明开发者可完成接入。 |
| 守住错误、trace、redaction 和凭据材料保护的默认一致边界 | 否则横切安全与可观测性要求会在不同语言中漂移。 |
| 支撑版本兼容、deprecated 和文档示例的可追溯演进 | 否则 SDK 升级、示例失效和 breaking change 会不可控。 |

#### 7.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不重新定义 `L0-core` 已拥有的契约、错误、trace、metadata 和 CloudEvents schema | 否则 core / SDK 会形成多重真相。 |
| 不重新定义 `L0-bus` 已拥有的事件传递、订阅、确认、失败、死信、回放和 tap 语义 | 否则 SDK 会越界成为 bus runtime 或 delivery truth。 |
| 不承载 L1/L2/L3/L4 服务端业务事实和领域规则 | 否则客户端封装会演变为服务端业务编排。 |
| 不执行身份认证、权限裁决、治理审批或身份生命周期 | 否则 SDK 会侵入安全入口、identity、gateway 或 governance 边界。 |
| 不承载 UI 组件、页面状态、产品工作流或 runtime loop | 否则 SDK 会混入产品层或运行时执行层职责。 |
| 不保存业务正文、事件 payload 正文、生产请求响应正文、观测正文、UI / runtime 状态正文或凭据正文 | 否则 SDK 的错误、日志、示例和验证证据会打穿数据所有权边界。 |
| 不把 L1/L2/L3/L4 服务仓写成 SDK 源码依赖 | 否则运行期 API 封装会被误建模为编译期耦合。 |
| 不把公共注册表、完整 MCP、REST / GraphQL、REPL 或本地缓存写成当前 P0 前置 | 否则外围增强会阻塞官方 client 基础闭环。 |

#### 7.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 公共注册表正式发布 | 当前作为发布阶段目标处理,P0 先保证本地 package candidate 可安装、可验证。 |
| 全量 L1/L2/L3/L4 client 覆盖 | 当前不纳入核心闭环,先通过稳定服务边界或 fake / fixture endpoint 证明最小接入。 |
| 完整 MCP Client | 当前作为 P1 候选处理,不进入架构 P0 主线。 |
| REST / GraphQL wrapper、REPL / playground、本地缓存 / 离线状态 | 当前作为 P2 或产品侧增强处理,不进入架构 P0 主线。 |
| codegen、transport、语言包目录和 wrapper 风格 | 当前只保留承接上游 truth 和三语言一致目标,具体方案后移到技术选型、概要和详细设计。 |
| 性能阈值、candidate 报告、reports 和 artifacts 格式 | 当前只保留可测量和可追溯要求,具体阈值与格式后移到测试方案和实施计划。 |

#### 7.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 core 契约、DTO、ErrorCode、TraceContext、CloudEvents schema 或 metadata | 这些共享契约真相属于 `L0-core`。 |
| 不设计 bus 运行时、delivery、retry、dead-letter、replay 或 tap 架构 | 这些事件传递语义属于 `L0-bus`。 |
| 不设计 L1+ 服务端业务 API truth、领域规则或业务事务 | 这些属于对应服务仓。 |
| 不设计服务端统一 gateway / facade 架构 | SDK 是客户端接入层,不拥有服务端业务编排权。 |
| 不设计认证、授权、治理审批或成员生命周期架构 | 这些属于安全入口、identity、gateway 或 governance。 |
| 不设计 UI 组件、页面状态或产品工作流架构 | 这些属于 L5/L6 产品仓。 |
| 不设计 AI runtime loop、tool invocation、memory 或 checkpoint 架构 | 这些属于 L2 runtime / tools 等运行层仓。 |
| 不设计公共注册表运营、完整 MCP、REST / GraphQL、REPL 或本地缓存架构 | 这些是后续发布、生态或产品体验增强,不属于当前架构主线。 |
| 不设计测试脚本、CI 命令或具体发布流程 | 这些属于测试方案或实施计划。 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §2 “业务背景与驱动力”摘录并整理本文件 §7.1、§7.2、§7.3。
- §3 “约束条件”摘录并整理本文件 §7.4、§7.5、§7.6。
- 不在本 Step 重复粘贴完整正式章节,避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 架构目标是否保留旧版 quickstart、包体积、CI、发布时长等量化指标 | A. 保留为架构目标;B. 架构只保留结构性目标,量化指标后移到测试 / 验收 / 实施;C. 两者混写 | B | 架构目标应描述结构必须成立什么,执行指标属于后续文档 | 已确认采用 B |
| `generated binding + thin wrapper` 是否现在作为唯一架构方案 | A. 立即锁定;B. 作为候选技术方案,Step 10 再决策;C. 完全删除 | B | 该方案合理,但 Step 2 不应提前替代技术选型讨论 | 已确认采用 B |
| 公共注册表正式发布是否作为当前 P0 架构目标 | A. 作为 P0;B. 当前只保留本地 package candidate,公共发布进入演进路线;C. 完全删除 | B | 需求已确认当前先保证本地可验证和版本治理,公共发布是后续阶段 | 已确认采用 B |
| 全量领域 client 覆盖是否作为当前 P0 架构目标 | A. 全量覆盖;B. 最小可验证接入先成立,全量覆盖进入演进路线;C. 完全不讨论 | B | 当前目标是证明官方客户端接入层成立,不应被全仓覆盖阻塞 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 3 的待确认事项。
- P0 最小可验证目标、技术方案、证据格式、性能阈值、公共发布阶段、完整 MCP / REST / GraphQL / REPL / 本地缓存和全量 client 覆盖阶段均进入后续 Step 或后续文档继续细化。

### 10. 进入下一步条件

- 已明确 `L0-sdk` 架构必须确保的结构性目标。
- 已明确不可变约束、当前阶段可接受取舍和架构非目标。
- 已确认 Step 2 不写容器、依赖图、数据库、语言包目录、class / trait 或技术选型。
- 可以进入 Step 3 职责边界。
