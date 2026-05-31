# Step 3. 职责边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-sdk/01-架构设计.md` §4 职责边界

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.4 职责边界
  - `standards/document/架构设计讨论流程_SOP.md` Step 3
  - `projects/L0-sdk/00-需求文档.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_01_requirements_baseline.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_02_arch_goals_constraints.md`
- 已确认结论：
  - `L0-sdk` 是三语言官方客户端接入层。
  - `L0-core` / `L0-bus` 是直接稳定上游 truth。
  - SDK 不重新定义 core / bus truth,不成为服务端 gateway / facade。
  - SDK 当前 P0 聚焦本地 package candidate、最小可验证接入、三语言一致、横切默认和兼容演进。
  - Step 3 只处理职责归属,不展开系统上下文、限界上下文、数据所有权或接口协议。

### 3. SOP 问题回答

1. 这个仓具体做什么？

   回答：`L0-sdk` 负责把 `L0-core` 的共享契约、`L0-bus` 的事件语义和已稳定服务边界转译为 Rust / Python / TypeScript 三语言官方客户端接入能力,并维护三语言一致性、错误映射、trace 传播、redaction、版本兼容、文档示例和本地 package candidate 验证边界。

2. 这个仓具体不做什么？

   回答：本仓不定义 core 契约 truth,不实现 bus runtime,不拥有 L1/L2/L3/L4 服务端业务事实,不做认证授权或治理审批,不承载 UI 组件 / runtime loop / 本地状态管理,不保存业务正文、事件正文、生产请求响应正文、观测正文或凭据正文,当前也不把公共注册表正式发布、完整 MCP、REST / GraphQL、REPL 写成 P0 职责。

3. 哪些能力看起来相关但必须属于其他仓？

   回答：共享契约属于 `L0-core`;事件传递与失败恢复 truth 属于 `L0-bus`;领域业务 API truth 属于 L1/L2/L3/L4 对应服务仓;认证授权属于安全入口、identity、gateway 或 governance;UI 和产品工作流属于 L5/L6;runtime loop、tool invocation、memory 和 checkpoint 属于 L2 运行层。

4. 哪些行为绝不能隐式发生？

   回答：不得隐式复制或改写 core / bus truth,不得把服务端业务编排藏进 SDK client,不得把认证授权决策藏进 SDK 配置,不得把语言 idiomatic 差异变成平台语义差异,不得把公共发布、完整 MCP 或 REST / GraphQL 自然膨胀成 P0,不得在错误、日志、示例或报告中泄露敏感正文。

5. 哪些边界如果不写清，后续设计最容易串线？

   回答：最容易串线的是“binding 生成 vs 官方客户端体验”“事件客户端视图 vs bus runtime”“运行期服务封装 vs server facade”“调用方上下文 vs 认证授权”“本地 package candidate vs 公共注册表发布”“语言 idiomatic 差异 vs 平台语义一致”。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §4.2 职责边界 | 旧文档用做什么 / 不做什么列表表达,没有按 `职责项 / 类型 / 说明` 固定结构收口 | 不利于后续正式文档直接审查职责归属 |
| §4.2 做什么 | “生成三语言 binding、统一高层 client、默认 auth / trace / error / redaction、quickstart / examples / migration guides”混在一起 | 合理线索可迁移,但 auth、生成机制、文档、发布治理需要重新分层 |
| §4.2 不做什么 | 只排除 proto、事件总线、业务逻辑、UI 组件库 | 未覆盖 server facade、auth / governance、runtime、本地缓存、禁止正文和公共发布阶段边界 |
| §5 限界上下文 | Codegen、Rust SDK、Python SDK、TS SDK、Docs 被提前写成上下文 | 可能把语言包目录或实现组织误当职责边界 |
| 全文 | 公共发包、完整 MCP、REST / GraphQL、REPL 旧线索仍可能回流 | 若不显式标为当前非 P0 或边界外,后续设计容易膨胀 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责表达 | 做什么 / 不做什么散列表 | `职责项 / 类型 / 说明` 表格 | 对齐架构规范,便于审查职责归属 |
| 正式职责 | 生成 binding、高层 client、auth / trace / error / redaction、文档示例平铺 | 官方 client、上游 truth 消费、三语言一致、横切默认、candidate / 示例 / 兼容治理 | 用能力归属表达职责,不提前锁死实现 |
| 不做范围 | 排除 core、bus、业务逻辑、UI | 增补 server facade、auth / governance、runtime、本地状态、禁止正文、公共发布 P0 | 对齐新版需求和 Step 2 约束 |
| 易混淆职责 | 未单列 | 单列 binding、event view、service wrapper、auth context、package candidate、idiomatic API 等边界 | 防止后续概要 / 详细设计串线 |
| 边界红线 | 隐含在文字中 | 明确列为红线清单 | 便于后续 Step 直接引用 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧“binding + wrapper + docs + release”职责清单 | 迁移快,贴近旧草案 | 容易把实现目录、发布阶段和候选增强混入职责 | 不采用 |
| 方案 B：按“做 / 不做 / 易混淆职责”收敛职责归属 | 符合规范,能保护边界 | 不直接给语言包目录或接口形态 | 采用 |
| 方案 C：把所有开发者接入相关能力都归入 SDK | 调用方体验完整 | 会侵入 core、bus、gateway、UI、runtime 和服务端业务仓 | 不采用 |

### 7. 结构化中间产物

#### 7.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 三语言官方客户端接入层承载 | 做 | 这是本仓的核心职责,负责让 Rust / Python / TypeScript 使用同一官方接入口径。 |
| `L0-core` 契约消费与语言映射 | 做 | SDK 只消费共享契约并形成语言视图,不成为第二契约真相。 |
| `L0-bus` 事件语义客户端视图 | 做 | SDK 提供事件客户端体验,但传递 truth 仍归 `L0-bus`。 |
| 正式服务边界的运行期客户端封装 | 做 | SDK 封装调用入口,但不拥有服务端业务事实。 |
| 三语言核心概念一致性维护 | 做 | 若不由本仓维护,不同语言会形成私有 client 心智。 |
| 错误映射、trace 传播和 redaction 默认边界 | 做 | 横切行为必须在三语言中保持一致且不泄露敏感正文。 |
| 本地 package candidate 与安装验证边界 | 做 | 当前 P0 先证明 SDK 可安装、可调用、可验证。 |
| quickstart、docstring 与示例口径维护 | 做 | SDK 必须让开发者按官方示例完成最小接入。 |
| 版本兼容、deprecated 与迁移口径维护 | 做 | SDK 升级必须具备可追溯的兼容与迁移边界。 |
| 跨语言 smoke 和一致性验证证据维护 | 做 | 本仓需要证明三语言核心概念和横切行为没有漂移。 |
| core proto / DTO / ErrorCode / TraceContext / CloudEvents schema 定义 | 不做 | 这些共享契约 truth 属于 `L0-core`。 |
| bus publish / subscribe / ack / retry / dead-letter / replay / tap runtime | 不做 | 这些事件传递和恢复 truth 属于 `L0-bus`。 |
| L1/L2/L3/L4 服务端业务事实和领域规则 | 不做 | SDK 只做客户端封装,不拥有服务端业务 truth。 |
| 服务端统一 gateway / facade | 不做 | 若由 SDK 承载,会打穿客户端与服务端业务编排边界。 |
| 登录认证、OAuth provider、权限裁决和治理审批 | 不做 | 这些职责属于安全入口、identity、gateway 或 governance。 |
| UI 组件、页面状态和产品工作流 | 不做 | 这些职责属于 L5/L6 产品仓。 |
| AI runtime loop、tool invocation、memory 和 checkpoint | 不做 | 这些职责属于 L2 运行层仓。 |
| 业务正文、事件正文、生产请求响应正文、观测正文和凭据正文保存 | 不做 | 这些正文不属于 SDK 数据真相,也不得进入错误、日志、示例或报告正文。 |
| 公共注册表平台运营 | 不做 | SDK 可在后续阶段准备发布材料,但不运营 crates.io、PyPI 或 npm 平台。 |
| binding 生成与官方 client 边界 | 易混淆职责 | binding 是承接方式之一,不能把 SDK 退化为 binding-only 仓。 |
| 事件客户端视图与 bus runtime 边界 | 易混淆职责 | SDK 只提供 client view,delivery、retry、DLQ 和 replay truth 不归 SDK。 |
| 运行期服务封装与 server facade 边界 | 易混淆职责 | SDK 封装正式 API,不能聚合业务规则或跨服务事务。 |
| 调用方上下文与认证授权边界 | 易混淆职责 | SDK 可承接调用上下文和凭据材料保护,不能做身份认证或权限裁决。 |
| 本地 package candidate 与公共注册表发布边界 | 易混淆职责 | 当前 P0 是本地可验证,公共发布属于后续演进和发布治理。 |
| 语言 idiomatic 表达与平台语义一致边界 | 易混淆职责 | 语言接口可以不同,但不能改变共同平台含义。 |

#### 7.2 边界红线清单

- 不得在 SDK 内重新定义 `L0-core` 已拥有的共享契约。
- 不得在 SDK 内重新定义 `L0-bus` 已拥有的事件传递和恢复语义。
- 不得把 SDK client 封装升级为服务端业务编排、跨服务事务或统一 gateway。
- 不得把认证、授权、治理审批或身份生命周期写入 SDK 职责。
- 不得把 UI 状态、产品工作流、runtime loop 或本地离线状态写入当前 P0 职责。
- 不得把 L1/L2/L3/L4 服务仓写成 SDK 源码依赖。
- 不得在错误、日志、示例、诊断或验证报告中保存敏感正文和凭据正文。
- 不得把公共注册表正式发布、完整 MCP、REST / GraphQL、REPL 自然膨胀为当前 P0 职责。
- 不得让 Rust / Python / TypeScript 的语言习惯差异改变平台语义。

#### 7.3 收束说明

```text
`L0-sdk` 的职责是承载官方三语言客户端接入层,稳定消费 `L0-core` 与 `L0-bus` truth,
并为运行期服务边界提供可学习、可验证、可追溯且默认安全的 client 体验。
它不承载 core / bus / server / auth / UI / runtime truth。
```

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §4 “职责边界”直接摘录并整理本文件 §7.1。
- §4.1 “边界红线”直接摘录本文件 §7.2。
- 不在本 Step 重复粘贴完整正式章节,避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| binding 生成是否作为 SDK 唯一职责 | A. SDK 等于 binding 生成;B. binding 是承接方式之一,SDK 正式职责是官方 client 接入层;C. 完全不提 binding | B | 需求已确认 SDK 不是 binding-only 仓,但 binding 仍是合理技术线索 | 已确认采用 B |
| 运行期服务封装是否允许变成 server facade | A. 允许统一 facade;B. 只封装正式 API,不拥有服务端业务 truth;C. 完全不封装服务能力 | B | SDK 需要证明最小接入,但不能拥有业务编排权 | 已确认采用 B |
| 公共注册表正式发布是否写入当前职责 | A. 当前 P0 职责;B. 后续发布阶段职责,当前只保留本地 package candidate;C. 完全删除 | B | 当前 P0 以本地可验证和版本治理为前置,公共发布后移 | 已确认采用 B |
| 完整 MCP / REST / GraphQL / REPL 是否写入职责表 | A. 写入做;B. 写入当前不做或后续增强边界;C. 完全删除 | B | 这些能力与 SDK 相关,但需求已裁剪为 P1/P2 或外围增强 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 4 的待确认事项。
- 具体系统上下文、上下游、输入输出面和依赖失效降级口径进入 Step 4。
- 具体子域、容器、通信方式、接口协议和语言包结构进入后续 Step。

### 10. 进入下一步条件

- 已明确本仓做什么、不做什么和易混淆职责。
- 已形成职责边界表和边界红线清单。
- 已确认本 Step 不重画系统上下文图、不展开子域、数据所有权或接口协议。
- 可以进入 Step 4 系统边界与上下文。
