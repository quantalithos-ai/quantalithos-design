# Step 4. 系统边界与上下文

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-sdk/01-架构设计.md` §5 系统边界与上下文

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.5 系统边界与上下文
  - `standards/document/架构设计讨论流程_SOP.md` Step 4
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-sdk/00-需求文档.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_01_requirements_baseline.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_02_arch_goals_constraints.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_03_responsibility_boundary.md`
- 已确认结论：
  - `L0-sdk` 是三语言官方客户端接入层。
  - `L0-core` 和 `L0-bus` 是直接稳定上游 truth。
  - L1/L2/L3/L4 正式 API 是运行期封装目标,不是源码 truth。
  - fake / fixture endpoint 是当前 P0 最小可验证接入的重要依赖。
  - L5/L6 产品、`L2-runtime`、自动化脚本和第三方集成是主要下游消费对象。
  - 本 Step 不展开内部职责、子域、容器、数据所有权、接口协议或语言包结构。

### 3. SOP 问题回答

1. 这个仓在全局系统中的位置是什么？

   回答：`L0-sdk` 位于 L0 共享契约层的开发者接入面,向上消费 `L0-core` 和 `L0-bus` 的稳定 truth,向下为产品、runtime、自动化和第三方集成提供 Rust / Python / TypeScript 官方客户端接入口径。

2. 它有哪些正式上游？

   回答：正式上游是 `L0-core`、`L0-bus`、L1/L2/L3/L4 正式 API 和 fake / fixture endpoint。`L0-core` 提供共享契约、错误、trace 和 metadata truth;`L0-bus` 提供事件语义 truth;L1/L2/L3/L4 提供运行期服务能力边界;fake / fixture endpoint 提供当前最小验证目标。

3. 它有哪些正式下游？

   回答：正式下游包括 L5/L6 产品仓、`L2-runtime`、自动化脚本、内部服务 / 集成代码、第三方 / 企业集成代码,以及 package validation / smoke / docs runner 等验证消费方。

4. 它从外部接收哪些输入面？

   回答：它接收共享契约输入、事件语义输入、正式服务能力输入、fake / fixture 验证输入和验证执行反馈输入。这些输入面都不能被 SDK 转写为自身 truth。

5. 它向外部提供哪些输出面？

   回答：它输出三语言官方 client、语言映射口径、事件客户端视图、错误 / trace / redaction 默认行为、package candidate、quickstart / docstring / examples、版本兼容和验证证据入口。

6. 哪些外部系统或相邻仓构成正式上下文边界？

   回答：正式上下文边界包括 `L0-core`、`L0-bus`、L1/L2/L3/L4 formal APIs、fake / fixture endpoint、L5/L6 product consumers、runtime / automation consumers、package validation / smoke runners。公共注册表、完整 MCP provider、REST / GraphQL gateway、REPL / playground 和本地缓存当前不进入主图。

7. 依赖失效时，本仓的降级口径是什么？

   回答：`L0-core` 不稳定时 SDK 不得生成正式契约消费结论;`L0-bus` 不稳定时事件 client 只能挂起或保持 stub / fake 边界;正式服务 API 不稳定时对应领域 client 不进入 P0 证明链;fake / fixture endpoint 缺失时最小接入不可验收;下游消费方不可用时不应反向改变 SDK truth;验证 runner 不可用时 candidate 不得标记为已验证。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §4.1 系统上下文图 | 旧图把 External developers / L1-L6 repos、SDK、core、bus 粗略连在一起 | 不能区分输入、输出、依赖,也不能表达 fake endpoint 和验证 runner 的 P0 价值 |
| §4.2 职责边界 | 职责边界和系统上下文混在 §4 内 | 后续读者容易把职责、上下文和实现关系混成一层 |
| §4.3 外部系统可用性约束 | crates.io / PyPI / npm 和 GitHub Actions 被写成主要外部依赖 | 与当前 P0 先做本地 package candidate 的口径冲突 |
| §4.4 关键依赖风险 | 只写三语言漂移、TS 生态选择、示例过时 | 缺少 core / bus / formal API / fake endpoint / runner 失效时的边界口径 |
| §6 容器架构 | registry、CI、package build 提前成为主线 | 会把系统上下文误读成发布流水线架构 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图中对象 | External developers、L1-L6 repos、core、bus 粗图 | `L0-core`、`L0-bus`、formal APIs、fake endpoint、下游消费者、验证 runner | 只保留正式上下文对象 |
| 上游表达 | core proto 和 bus API 简单输入 | core truth、bus truth、formal API、fake endpoint 分层 | 对齐需求依赖裁剪 |
| 下游表达 | 所有 repo / external developers 混在一起 | product consumers、runtime / automation consumers、package validation runners 分开 | 区分消费面与验证面 |
| 公共注册表 | 像当前外部依赖 | 不进入 Step 4 主图,作为后续发布阶段对象 | 当前 P0 不依赖公共发布 |
| 依赖失效 | 旧文档只写 registry / CI 降级 | 明确 core、bus、formal API、fake endpoint、runner 失效口径 | 支撑后续测试与验收 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧图,只替换文字 | 改动小 | 仍无法表达正式上下文边界和依赖类型 | 不采用 |
| 方案 B：画 7 个关键上下文对象,聚合 L1/L2/L3/L4 和下游消费方 | 图清晰,符合对象数量约束 | 不逐仓展开全部消费者 | 采用 |
| 方案 C：逐个画出所有 L1~L6 仓和第三方对象 | 覆盖完整 | 图过载,不符合系统上下文粒度 | 不采用 |
| 方案 D：把公共注册表和完整 MCP provider 画进主图 | 生态视角完整 | 与当前 P0 裁剪冲突,会误导后续实现 | 不采用 |

### 7. 结构化中间产物

#### 7.1 系统上下文图

```text
                 +--------------------+       +--------------------+
                 |      L0-core       |       |      L0-bus        |
                 | shared truth       |       | event truth        |
                 +---------+----------+       +---------+----------+
                           |                            |
                           | 输入                       | 输入
                           v                            v
       +------------------+      +--------------------+      +------------------+
       | L1/L2/L3/L4 APIs |----->|       L0-sdk       |<-----| fake / fixture  |
       | runtime targets  |依赖  | official SDK       |依赖  | verification    |
       +------------------+      +---------+----------+      +------------------+
                                             |
                                             | 输出
                         +-------------------+-------------------+
                         |                   |                   |
                         v                   v                   v
              +----------+---------+  +------+-----------+  +----+----------------+
              | L5/L6 products    |  | runtime /        |  | package validation |
              | product consumers |  | automation       |  | smoke/docs runners |
              +-------------------+  +------------------+  +---------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

图示说明：

- `L0-core` 和 `L0-bus` 是 SDK 的直接 truth 来源,不是可替换的普通外部服务。
- L1/L2/L3/L4 formal APIs 是运行期封装目标,不得写成 SDK 源码 truth。
- fake / fixture endpoint 是当前 P0 最小可验证接入依赖,不是业务 truth。
- L5/L6、runtime / automation 和验证 runner 是主要消费面,不会反向拥有 SDK truth。

#### 7.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、错误、trace、metadata、基础 envelope | SDK 必须消费 core truth,不得重新定义。 |
| `L0-bus` | 输入 | 来源 | 事件语义、transport view、发布 / 订阅边界 | SDK 只封装事件 client 体验,不拥有 delivery truth。 |
| L1/L2/L3/L4 formal APIs | 输入 | 依赖 | 正式服务能力边界 | SDK 运行期封装服务能力,不得源码依赖服务仓或拥有业务 truth。 |
| fake / fixture endpoint | 输入 | 依赖 | 最小验证目标 | 用于证明 package candidate、quickstart 和 smoke 可运行。 |
| L5/L6 product consumers | 输出 | 消费 | TypeScript / product-side client 接入口径 | 产品侧消费 SDK,不应维护私有协议封装。 |
| runtime / automation consumers | 输出 | 消费 | Python / automation client 接入口径 | runtime 和脚本消费 SDK,不应重复封装协议、错误和 trace。 |
| internal service / integration consumers | 输出 | 消费 | Rust / integration client 接入口径 | 内部服务和集成复用 SDK 的类型、错误、trace 和事件视图。 |
| third-party / enterprise integrations | 输出 | 消费 | 官方 client、文档示例和兼容承诺 | 外部集成通过 SDK 接入,不直接依赖裸协议。 |
| package validation / smoke / docs runners | 输入 / 输出 | 依赖 | candidate 验证反馈、示例运行证据 | runner 不拥有 SDK truth,但未通过验证时 candidate 不得标记为已验证。 |

#### 7.3 依赖失效降级口径

| 依赖对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | 契约、错误、trace 或 metadata truth 不稳定 | 暂停正式 SDK 契约消费结论,不得自行补造 schema。 |
| `L0-bus` | 事件语义或 transport view 不稳定 | 事件 client 挂起或保持 fake / stub 边界,不得自定义 delivery 语义。 |
| L1/L2/L3/L4 formal APIs | 目标服务边界未稳定 | 对应 client 不进入当前 P0 证明链,只保留运行期封装预留。 |
| fake / fixture endpoint | 无可运行验证目标 | 最小可验证接入不得通过验收。 |
| 下游消费方 | 某类消费者暂不可用 | 不反向改变 SDK truth,仅影响对应消费面验证范围。 |
| validation / smoke / docs runners | 验证无法执行 | candidate 不得标记为已验证,示例和文档不得视为可运行。 |

#### 7.4 边界说明结论

`L0-sdk` 的系统上下文围绕“上游 truth 输入、运行期能力封装、下游 official client 消费、验证反馈”四类关系展开。`L0-core` / `L0-bus` 是正式 truth 来源,L1/L2/L3/L4 formal APIs 和 fake / fixture endpoint 是运行期和验证依赖,下游消费者和验证 runner 是输出与反馈对象。公共注册表、完整 MCP provider、REST / GraphQL gateway、REPL / playground 和本地缓存当前不进入主图,因为它们属于发布阶段或外围增强。本文只定义系统边界和输入 / 输出面,不定义接口名、事件名、DTO、语言包目录或内部组件。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §5 “系统边界与上下文”直接摘录并整理本文件 §7.1、§7.2、§7.4。
- §13 或后续风险章节可摘录本文件 §7.3 的依赖失效降级口径。
- 不在本 Step 重复粘贴完整正式章节,避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 系统上下文图是否逐个展开 L1/L2/L3/L4 仓 | A. 逐仓展开;B. 聚合为 formal APIs;C. 只画 L1 | B | Step 4 只表达关系类型,逐仓展开会让图过载并提前进入服务覆盖范围 | 已确认采用 B |
| 公共注册表是否进入当前系统上下文主图 | A. 进入主图;B. 后续发布阶段再进入;C. 完全删除 | B | 当前 P0 是本地 package candidate,公共发布不应误导为当前依赖 | 已确认采用 B |
| fake / fixture endpoint 是否进入主图 | A. 进入;B. 仅放测试方案;C. 删除 | A | 需求已确认最小可验证接入依赖稳定服务边界或 fake / fixture,这是当前架构关键上下文对象 | 已确认采用 A |
| validation / smoke / docs runners 是否进入主图 | A. 进入;B. 仅放实施计划;C. 删除 | A | candidate、示例和跨语言一致性验证是当前 P0 的重要反馈面 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 5 的待确认事项。
- 具体服务 API 覆盖范围、fake endpoint 形态、runner 实现、公共发布阶段、完整 MCP、REST / GraphQL、REPL 和本地缓存进入后续 Step 或后续文档。

### 10. 进入下一步条件

- 已明确 `L0-sdk` 在全局系统中的位置。
- 已画出正式上下文对象图,且图中未出现角色、文档来源对象、接口名或事件名。
- 已明确上游、下游、输入面、输出面和依赖失效口径。
- 可以进入 Step 5 限界上下文与子域划分。
