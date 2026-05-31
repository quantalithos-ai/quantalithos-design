# Step 7. 依赖方向与层间约束

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-sdk/01-架构设计.md` §8 依赖方向与层间约束

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.8 依赖方向与层间约束
  - `standards/document/架构设计讨论流程_SOP.md` Step 7
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-sdk/00-需求文档.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_04_system_context.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_05_bounded_context.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_06_container_deployment.md`
- 已确认结论：
  - `L0-sdk` 是三语言官方客户端接入层，不是独立线上 gateway。
  - `L0-core` 和 `L0-bus` 是 SDK 的直接稳定上游 truth。
  - L1/L2/L3/L4 formal APIs 是运行期封装目标，不是 SDK 源码 truth。
  - L5/L6、runtime、automation 和第三方集成是 SDK 下游消费方。
  - 本 Step 只讨论架构依赖角色、跨仓依赖类型和层间红线，不写源码目录、函数调用、协议细节或发布命令。

### 3. SOP 问题回答

1. 本仓内部层次如何划分？

   回答：按依赖责任划分为上游契约来源边界、官方客户端语义核心、能力访问与横切默认承接角色、语言与 package 表达角色、验证 / 文档 / candidate 承载角色，以及正式服务 / fake 接缝角色。这里的层次不是 Rust / Python / TypeScript 目录，也不是 codegen 流程。

2. 允许哪些依赖方向？

   回答：语言与 package 表达角色可以依赖能力访问、横切默认和官方客户端语义；能力访问与横切默认承接角色可以依赖官方客户端语义和上游契约来源边界；官方客户端语义允许依赖 `L0-core` / `L0-bus` 的稳定契约来源；验证 / 文档 / candidate 承载只能依赖已形成的 SDK 表达和受控验证接缝。

3. 禁止哪些反向依赖？

   回答：禁止 `L0-sdk` 核心语义反向定义 `L0-core` / `L0-bus` truth；禁止语言 idiomatic 表达反向改变平台语义；禁止验证报告、示例、文档、公共注册表或工具链反向决定 SDK 语义；禁止 SDK 直接源码依赖 L1/L2/L3/L4 服务仓；禁止下游产品、runtime 或第三方集成反向拥有 SDK truth。

4. 外部系统通过哪些正式边界接入？

   回答：`L0-core` / `L0-bus` 通过上游契约来源边界接入；L1/L2/L3/L4 formal APIs 和 fake / fixture endpoint 通过正式服务 / fake 接缝进入能力访问角色；下游消费者通过语言与 package 表达角色消费 SDK；验证 runner 通过验证 / 文档 / candidate 承载角色消费 SDK candidate。

5. 本仓在全局依赖基线中涉及哪些跨仓依赖边？

   回答：涉及 `L0-core` 和 `L0-bus` 编译期依赖；L1/L2/L3/L4 formal APIs 运行期依赖；按能力封装的 bus 事件协作依赖；L5/L6、`L2-runtime`、automation 和第三方集成对 SDK 的下游消费依赖。

6. 哪些依赖边进入本仓架构主链，哪些被裁剪出去？

   回答：`L0-core`、`L0-bus`、L1/L2/L3/L4 formal APIs、fake / fixture endpoint、下游消费者和验证 runner 进入主链。公共注册表、完整 MCP、REST / GraphQL gateway、REPL / playground、本地缓存和全量领域 client 覆盖被裁剪出当前 P0 主链。

7. 进入主链的跨仓依赖分别是编译期依赖、运行期依赖，还是事件协作依赖？

   回答：`L0-core` 是编译期依赖；`L0-bus` 同时是编译期依赖和事件协作语义来源；L1/L2/L3/L4 formal APIs 和 fake / fixture endpoint 是运行期依赖；L5/L6、runtime、automation 和第三方是下游运行期 / package 消费方；事件发布与订阅能力通过 `L0-bus` 语义进入事件协作边界。

8. 哪些依赖必须倒置，不能直接侵入核心语义层？

   回答：正式服务 API、fake endpoint、验证 runner、文档示例、公共注册表、语言工具链、下游产品反馈和第三方集成都必须倒置到外部接缝、语言表达或验证承载角色上，不能直接改变官方客户端语义核心或上游契约来源边界。

9. 哪些规则若不先写清，后续实现最容易失控？

   回答：最容易失控的是把 L1/L2/L3/L4 服务仓写成源码依赖、把 SDK 事件 client 写成 bus runtime、把 TypeScript / Python / Rust idiomatic 差异写成平台语义差异、把公共注册表和工具链结果写成 truth、把验证报告或示例正文反向决定 API 语义。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §7.1 依赖方向图 | 旧图按 `core proto -> codegen -> wrapper -> examples` 画实现链 | 把生成流程误写成架构依赖方向，无法表达运行期服务依赖和下游消费边界 |
| §7.2 层间约束规则 | 只写 wrapper 不得手写 proto 冲突类型等局部规则 | 有价值但粒度偏实现，缺少正式依赖角色和跨仓依赖分类 |
| §7.3 依赖倒置接口点 | 把 core proto、bus event API、codegen、wrapper 当成倒置点 | 倒置边界应是上游契约、服务接缝、语言表达和验证承载角色，而不是旧工具链对象 |
| §7.4 依赖健康度评估 | 传入 / 传出耦合仍把 registry tooling 作为当前传出依赖 | 与当前本地 package candidate 先行、公共注册表后移的口径冲突 |
| 全文 | 缺少全局依赖裁剪表、依赖类型分类表和禁止依赖表 | 后续实现容易把运行期封装误写成 path dependency 或 package dependency |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图的主语 | codegen、wrapper、examples | 架构依赖角色 | 对齐架构规范 4.8，避免落入实现流程 |
| 上游依赖 | core proto 和 bus API 简写 | `L0-core` / `L0-bus` 作为上游契约来源边界 | 保护 core / bus 单一 truth |
| 服务依赖 | 旧图未表达 L1/L2/L3/L4 formal APIs | 运行期 formal API / fake 接缝进入能力访问角色 | SDK 需要封装服务能力，但不得源码依赖服务仓 |
| 语言差异 | Rust / Python / TypeScript wrapper 分叉 | 语言与 package 表达角色依赖统一语义核心 | 允许 idiomatic 表达，但不允许语义漂移 |
| 验证与文档 | examples / docs 直接在链路末端 | 验证 / 文档 / candidate 承载只能证明和消费 SDK | 防止示例或报告反向定义语义 |
| 公共注册表 | 作为传出依赖风险 | 当前裁剪出 P0 主链 | 当前 P0 是本地 package candidate 和可验证接入 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续按 `core proto -> codegen -> wrapper` 表达依赖方向 | 接近旧草案和实现直觉 | 不能表达运行期依赖、下游消费和语义保护红线 | 不采用 |
| 方案 B：按架构依赖角色表达，并单独裁剪跨仓依赖类型 | 能保护 SDK 语义核心，也能指导后续概要 / 详细设计 | 抽象度高于目录结构，需要后续落到 crate / package | 采用 |
| 方案 C：按 Rust / Python / TypeScript 三语言分别画依赖层 | 语言差异直观 | 会让三语言各自拥有语义中心，削弱官方 client 一致性 | 不采用 |
| 方案 D：把公共注册表、完整 MCP、REST / GraphQL 一起画进主依赖图 | 生态视角完整 | 与当前 P0 裁剪冲突，容易扩大实施范围 | 不采用 |

### 7. 结构化中间产物

#### 7.1 依赖角色划分表

| 架构责任层 / 依赖角色 | 角色类型 | 主要责任 | 依赖保护目标 |
|---|---|---|---|
| 上游契约来源边界 | 外部接缝角色 | 承接 `L0-core` 共享契约和 `L0-bus` 事件语义。 | SDK 不重新定义 core / bus truth。 |
| 官方客户端语义核心 | 核心语义角色 | 维护 SDK 共同概念、三语言一致性和官方 client 心智。 | 语言表达、文档、验证和下游反馈不能反向改变平台语义。 |
| 能力访问与横切默认承接角色 | 编排 / 承接角色 | 承接服务访问、事件 client、错误映射、trace、redaction 和凭据材料保护。 | 服务端业务、bus runtime、auth 决策不得进入 SDK truth。 |
| 语言与 package 表达角色 | 外部接缝角色 | 承载 Rust / Python / TypeScript idiomatic API 和本地 package candidate 表达。 | 语言差异只能改变表达，不能改变语义。 |
| 验证 / 文档 / candidate 承载角色 | 技术承载角色 | 承载 smoke、quickstart、docstring、示例、reports 和 candidate 证据入口。 | 验证和文档只能证明 SDK 行为，不能定义 SDK truth。 |
| 正式服务 / fake 接缝角色 | 外部接缝角色 | 承接 L1/L2/L3/L4 formal APIs 和 fake / fixture endpoint。 | 服务仓和 fake 目标只能作为运行期边界，不成为源码依赖或业务 truth。 |

#### 7.2 依赖方向图

```text
+==============================================================+
|                       L0-sdk 依赖边界                        |
|                                                              |
|   +-------------------------------+                          |
|   | 验证 / 文档 / candidate 承载  |                          |
|   | evidence / docs / packages    |                          |
|   +---------------+---------------+                          |
|                   | 允许依赖                                  |
|                   v                                          |
|   +---------------+---------------+                          |
|   | 语言与 package 表达角色       |                          |
|   | Rust / Python / TypeScript    |                          |
|   +---------------+---------------+                          |
|                   | 允许依赖                                  |
|                   v                                          |
|   +---------------+---------------+                          |
|   | 能力访问与横切默认承接角色    |                          |
|   | service / event / defaults    |                          |
|   +---------------+---------------+                          |
|                   | 允许依赖                                  |
|                   v                                          |
|   +---------------+---------------+                          |
|   | 官方客户端语义核心            |                          |
|   | client semantics / consistency|                          |
|   +---------------+---------------+                          |
|                   | 允许依赖                                  |
|                   v                                          |
|   +---------------+---------------+                          |
|   | 上游契约来源边界              |                          |
|   | L0-core / L0-bus truth        |                          |
|   +-------------------------------+                          |
|                                                              |
+==============================================================+
```

图示说明：

- 箭头只表达允许依赖方向和边界接入关系，不表达调用顺序、协议细节、代码 import 或运行拓扑。
- 官方客户端语义核心依赖上游契约来源边界，但不能反向定义 `L0-core` / `L0-bus` truth。
- 语言与 package 表达角色、验证文档承载和下游反馈都不能反向改变 SDK 语义核心。
- 正式服务 / fake 接缝只能通过能力访问承接角色进入，不得绕过该角色侵入核心语义。

#### 7.3 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 上游契约来源边界 | 允许被 SDK 语义核心和能力承接角色引用 | 禁止被 SDK 改写为本仓私有 truth | 该边界保护 core / bus 单一真相。 |
| 官方客户端语义核心 | 允许依赖上游契约来源边界 | 禁止依赖语言工具链、公共注册表、文档示例、验证报告、下游产品或 L1+ 服务源码 | 核心语义必须稳定，不能被外部表达形态牵引。 |
| 能力访问与横切默认承接角色 | 允许依赖官方客户端语义核心、上游契约来源边界和正式服务 / fake 接缝 | 禁止拥有服务端业务规则、bus delivery truth、auth 决策或 UI / runtime 状态 | 该角色只做客户端承接，不做服务端真相。 |
| 语言与 package 表达角色 | 允许依赖能力承接、横切默认和官方客户端语义 | 禁止各语言自行定义不兼容的 Error、Trace、Event、redaction 或业务对象语义 | 语言 API 可以 idiomatic，但平台含义必须一致。 |
| 验证 / 文档 / candidate 承载角色 | 允许依赖语言与 package 表达、fake / fixture endpoint 和验证 runner | 禁止用示例、报告、runner 输出或公共注册表状态反向定义 SDK 语义 | 验证材料只能证明已确认行为。 |
| 正式服务 / fake 接缝角色 | 允许作为运行期目标被能力访问角色封装 | 禁止成为 SDK 源码依赖，禁止把服务端业务 fact 复制进 SDK truth | L1/L2/L3/L4 能力只通过正式边界进入。 |

#### 7.4 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L0-sdk` depends on `L0-core` and `L0-bus` | 依赖方 | 编译期 | 是 | SDK 必须消费共享契约、错误、trace、metadata 和 envelope。 |
| `L0-bus` | `L0-sdk` depends on `L0-core` and `L0-bus` | 依赖方 / 协作方 | 编译期 / 事件协作 | 是 | SDK 必须消费事件语义并封装事件 client，但不实现 bus runtime。 |
| L1 domain services | `L0-sdk` runtime via formal APIs | 依赖方 | 运行期 | 是 | SDK 需要封装稳定服务边界，但不得源码依赖服务仓。 |
| L2 / L3 / L4 capability services | `L0-sdk` runtime via formal APIs | 依赖方 | 运行期 | 是，按阶段进入 | runtime、method、capability、sandbox、observability、archive 等能力按稳定度逐步封装。 |
| fake / fixture endpoint | 当前需求补充的受控验证目标 | 依赖方 | 运行期 | 是 | 支撑 quickstart、smoke 和本地 package candidate 最小验证。 |
| L5 product consumers | L5 products runtime via SDK | 被依赖方 | 下游运行期 / package 消费 | 是 | 产品侧通过 SDK 接入平台能力，不反向拥有 SDK truth。 |
| `L2-runtime` / automation consumers | runtime / automation via SDK | 被依赖方 | 下游运行期 / package 消费 | 是 | Python / automation 消费 SDK，避免重复封装协议和错误。 |
| L6 ecosystem / third-party integrations | bridges / marketplace runtime via SDK | 被依赖方 | 下游运行期 / package 消费 | 是，非 P0 全量 | 生态和第三方按 SDK 官方口径接入，不直接依赖裸协议。 |
| 公共注册表 | 后续发布渠道，不是当前依赖前置 | 外围发布渠道 | 发布阶段依赖 | 否 | 当前 P0 以本地 package candidate 验证为主。 |
| 完整 MCP / REST / GraphQL / REPL / local cache | 外围增强能力 | 外围能力 | 运行期 / 产品增强 | 否 | 当前不进入核心闭环，后续重新裁剪。 |

#### 7.5 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 消费共享契约、错误、trace、metadata 和 envelope。 | 详细设计 / 实施计划 |
| 编译期依赖 | `L0-bus` | 消费事件语义、transport view 和事件 client 所需契约。 | 详细设计 / 实施计划 |
| 运行期依赖 | L1/L2/L3/L4 formal APIs | 通过 SDK client 封装正式服务能力。 | 关键交互 / 技术选型 / 详细设计 |
| 运行期依赖 | fake / fixture endpoint | 支撑 quickstart、smoke、docs 和最小接入验证。 | 测试方案 / 实施计划 |
| 事件协作依赖 | `L0-bus` | 提供 publish / subscribe / ack / failure view 的客户端语义封装。 | 关键交互 / 测试方案 |
| 下游运行期 / package 消费 | L5/L6 / runtime / automation / third-party | SDK 作为官方 client 被消费。 | 概要设计 / 详细设计 / 实施计划 |

#### 7.6 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L0-sdk` 源码直接依赖任一 L1/L2/L3/L4 服务仓实现 | 会把运行期服务封装误建模为源码耦合，并污染 SDK truth。 | 通过 formal API、adapter 或 fake / fixture endpoint 接入。 |
| `L0-sdk` 重新定义 `L0-core` 契约、错误、trace、metadata 或 CloudEvents schema | 会形成 core / SDK 双重真相。 | 编译期消费 `L0-core` 稳定契约。 |
| `L0-sdk` 重新定义 `L0-bus` delivery、retry、dead-letter、replay 或 tap 语义 | 会让 SDK 越界成为 bus runtime。 | 编译期消费 `L0-bus` 契约，事件能力通过 bus 语义封装。 |
| 语言 package 表达直接决定官方客户端语义核心 | 会让 Rust / Python / TypeScript 各自形成平台语义。 | 语言表达依赖统一语义核心，差异只限 idiomatic API。 |
| 验证报告、示例、docstring 或 public registry 状态反向定义 SDK truth | 会让证据和发布渠道取代架构语义。 | 验证材料只证明已确认行为，公共发布后移。 |
| 下游产品、runtime、automation 或第三方集成反向拥有 SDK truth | 会让 SDK 变成某个消费方的私有 client。 | 下游通过正式 package / client 接口消费，反馈经正式变更流程进入。 |
| SDK 内保存业务正文、事件 payload 正文、生产请求响应正文、观测正文或凭据正文 | 会打穿数据归属、安全和 redaction 边界。 | 只保存引用、快照、脱敏错误和验证证据入口。 |

#### 依赖裁剪图: L0-sdk

```text
+-------------------------+
| Global baseline        |
+------------+------------+
             |
             | crop only related edges
             v
       +--------------------+
       |       L0-sdk       |
       | official client    |
       +---+----+----+--+---+
           |    |    |  |
           |    |    |  +---- [runtime] ------> fake / fixture target
           |    |    +------- [runtime] ------> L1/L2/L3/L4 formal APIs
           |    +------------ [compile/event] -> L0-bus
           +----------------- [compile] ------> L0-core

       +---------+
       | L0-bus  |
       +----+----+
            |
            | [compile]
            v
       +---------+
       | L0-core |
       +---------+

L5/L6 / runtime / automation / third-party
             |
             | [runtime]
             v
       +-----+-----+
       |  L0-sdk   |
       +-----------+
```

图示说明：

- 本图只展示 `L0-sdk` 相关依赖边，不展示全 27 仓。
- `[compile]` 表示可进入后续 package dependency 讨论；`[runtime]` 和 `[event]` 不得写成服务仓源码依赖。
- `L0-core` 与 `L0-bus` 是 SDK 的直接上游 truth，L1/L2/L3/L4 是运行期 formal API 目标。
- L5/L6、runtime、automation 和第三方是 SDK 消费方，不反向拥有 SDK truth。

#### 7.8 依赖边界说明短文

`L0-sdk` 的依赖方向以保护官方客户端语义和上游 core / bus truth 为中心。编译期只允许消费 `L0-core` 与 `L0-bus` 的稳定契约，运行期服务能力只能通过 formal API 或 fake / fixture 接缝进入。语言表达、验证文档、公共发布渠道和下游消费反馈都只能依赖或证明 SDK 语义，不能反向定义 SDK truth。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §8 “依赖方向与层间约束”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4、§7.5、§7.6、“依赖裁剪图”和 §7.8。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 依赖方向是否继续按 codegen / wrapper 画 | A. 继续沿用;B. 改为架构依赖角色;C. 按三语言 package 分开 | B | 依赖方向应表达边界保护，不应被实现流程或语言目录牵引 | 已确认采用 B |
| L1/L2/L3/L4 是否允许作为 SDK 源码依赖 | A. 允许;B. 不允许，只能 runtime formal API;C. 由具体 client 决定 | B | 需求已确认服务仓只能作为运行期边界，不能成为 SDK truth | 已确认采用 B |
| 公共注册表是否进入当前依赖主链 | A. 进入;B. 不进入，后续发布阶段再评估;C. 删除所有相关内容 | B | 当前 P0 是本地 package candidate 和最小可验证接入 | 已确认采用 B |
| 语言 idiomatic 表达是否可反向改变平台语义 | A. 可以;B. 不可以;C. 仅 TypeScript 可以 | B | 三语言官方 client 必须保持共同语义，语言差异只允许在表达层 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 8 的待确认事项。
- 具体 crate / package 分层、语言包目录、生成器、adapter 命名、package manager 和 path dependency 写法后移到概要设计、详细设计和实施计划。

### 10. 进入下一步条件

- 已明确 `L0-sdk` 的依赖角色划分。
- 已明确允许依赖方向、禁止反向依赖和必要倒置边界。
- 已从全局依赖基线裁剪出本仓依赖子图。
- 已区分编译期依赖、运行期依赖、事件协作依赖和下游消费关系。
- 可以进入 Step 8 数据所有权与一致性策略。
