## Step 1. 确认上游输入边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-bus/02-概要设计.md` §1 与上游文档的关系声明

### 2. 本步输入

- 上游文档：
  - `projects/L0-bus/00-需求文档.md` v0.2.0
  - `projects/L0-bus/01-架构设计.md` v0.2.0
  - `projects/L0-core/00~07`
  - `standards/document/概要设计书写规范.md`
  - `standards/document/概要设计讨论流程_SOP.md`
  - `standards/document/设计文档讨论中间产物规范.md`
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `standards/document/子项目目录与代码文件组织规范.md`
- 已确认结论：
  - `L0-bus` 是基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。
  - `L0-bus` 不重新定义 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 或事件目录正文。
  - 当前 P0 聚焦核心闭环：publication acceptance、transport semantic、delivery、feedback、retry / DLQ / replay preparation、audit、read-only output。
  - 当前默认可验证路径采用 `in-memory transport default path` + `durable bus store`。
  - 完整 Redis / Kafka 生产 adapter、Filter DSL、多租户、DLQ UI、effectively-once 都不进入当前 P0。
- 依赖的前序 Step：
  - 无。本步是 `02-概要设计.md` 校准的第一个 Step。

### 3. SOP 问题回答

1. 当前概要设计要承接哪些需求结论？

   回答：承接 `00-需求文档.md` 中关于本仓定位、目标与非目标、核心能力闭环、用户故事、F-001~F-008 功能需求、BR-001~BR-012 业务规则、数据归属、接口依赖、非功能需求、验收标准和风险待确认事项的稳定结论。概要设计只把这些需求继续下沉为代码主体、对象、接口、处理流和状态机骨架，不重新定义需求。

2. 当前概要设计要承接哪些架构结论？

   回答：承接 `01-架构设计.md` 中关于职责边界、系统上下文、限界上下文、容器 / 部署架构、依赖方向、数据所有权、一致性策略、关键交互、技术选择、备选方案、横切关注点、演进路线和风险的稳定结论。概要设计会把这些架构结论转译为可实现结构，但不重新讨论架构取舍。

3. 这些结论里，哪些已经足够稳定，可以直接作为概要设计输入？

   回答：已经稳定的输入包括：只消费 `L0-core` 契约、不保存业务 payload 正文、bus truth / snapshot / reference / forbidden body 四类数据边界、ports and adapters、unified transport semantic、at-least-once、bus idempotency anchor、durable bus store、in-memory default path、read-only output 不反写、replay 必须依赖 dead-letter / delivery history / audit chain。

4. 哪些结论虽然相关，但仍未收稳，因此当前不能直接往下展开？

   回答：生产 MQ adapter 优先级、durable bus store 产品、授权承接方、Outbox relay 部署形态、配置 schema、性能基准、DLQ UI 归属时间点、effectively-once 专项仍未收稳。概要设计可以为这些点保留边界和承接位置，但不能把它们写成已确定实现。

5. 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里？

   回答：概要设计不得展开 `L0-core` 已拥有的共享契约定义，不得展开 SDK convenience API，不得保存或解释业务 payload 正文，不得展开 observability 长期存储、governance decision、MQ 产品集群部署、DDL、完整 Rust trait / struct、完整函数实现、HTTP path、topic 命名全集或部署参数。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` 文档头部 | 仍引用旧版概要规范和通则，作者 / 日期 / 状态停留在 2026-05-17 | 无法追溯到新版需求、架构和概要 SOP |
| 旧 §1 | 把 `L0-bus` 描述成“共享传递主干契约仓”，重点落在 EventEnvelope / CommandEnvelope / CallbackEnvelope | 与当前 `L0-core` 负责共享契约、`L0-bus` 负责事件传递主干的边界冲突 |
| 旧 §2~§4 | 大量重复背景、目标、系统上下文和全局位置 | 概要设计重复需求和架构内容，没有下沉到代码主体骨架 |
| 旧术语 | envelope、routing、topic、command、callback 被放在核心主语位置 | 容易重新引入旧 schema / envelope 真相仓倾向 |
| 全文 | 缺少 `design-calibration` 校准来源 | 后续读者无法定位每章结论来自哪个 Step |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 上游基线 | 旧 `01-架构设计.md` 和旧 bus 草案 | `00-需求文档.md` v0.2.0 + `01-架构设计.md` v0.2.0 | 当前需求和架构已重建，旧草案只能作诊断材料 |
| 本仓身份 | 共享 envelope / command / callback 契约仓 | 基于 `L0-core` 契约的事件传递、delivery、恢复和留痕主干仓 | 避免和 `L0-core` 共享契约职责重叠 |
| 概要设计职责 | 解释系统背景和全局位置 | 定义代码主体框架、主要组成部分、对象、接口、流程和状态骨架 | 符合新版概要设计定位 |
| 未收稳内容 | 容易被旧文档写成当前能力 | 明确列为暂不进入概要设计确定范围 | 防止概要设计脑补生产 adapter、DLQ UI 或 effectively-once |
| 追溯方式 | 无具体中间产物来源 | 每章引用具体 `design-calibration/02_hld_step_*.md` | 支撑后续审查和实现读取 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧 `02-概要设计.md` 作为主体基线 | 内容已有一定长度 | 旧主语偏 envelope / schema，且重复需求和架构 | 不采用 |
| 方案 B：直接承接新版 `00` / `01`，旧 `02` 只作诊断材料 | 边界干净，能对齐当前需求和架构 | 需要在 Step 14 重建正式文档 | 采用 |
| 方案 C：重新打开需求和架构取舍 | 可以再次讨论所有边界 | 会破坏已稳定的需求 / 架构校准结果 | 不采用 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L0-bus/00-需求文档.md` | 本仓定位、目标 / 非目标、核心能力闭环、F-001~F-008、BR-001~BR-012、数据归属、接口依赖、验收和风险 | 把需求闭环下沉为代码主体、对象、接口、处理流、状态机和配置影响轮廓 |
| `projects/L0-bus/01-架构设计.md` | 职责边界、系统上下文、限界上下文、容器、依赖方向、数据所有权、关键交互、技术选择和演进路线 | 把架构模块和容器边界转译为概要设计层的主要组成部分和实现分层 |
| `projects/L0-core/00~07` | 共享契约、事件包络、错误、trace、metadata、ActorRef、outbox boundary 和实现依赖口径 | 明确 `L0-bus` 只消费 core 契约，不重新定义共享契约对象 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局仓际依赖方向和本仓依赖裁剪口径 | 在概要设计中保留 `L0-core` 编译期依赖、MQ / store 运行期依赖和跨仓事件协作边界 |
| `standards/document/子项目目录与代码文件组织规范.md` | Rust 子项目组织、单 crate / workspace 判断和 package 命名规则 | 只作为后续详细设计 / 实施计划输入，本步不展开目录结构 |
| `standards/document/概要设计书写规范.md` | 正式 `02-概要设计.md` 的章节主链和输出格式 | 指导本轮 14 章正式概要设计的最终形态 |
| `standards/document/概要设计讨论流程_SOP.md` | 14 步概要设计讨论流程 | 指导本轮逐 Step 生成中间产物 |
| `projects/L0-bus/02-概要设计.md` v0.1.0 | 旧 bus 概要草案 | 仅作为问题诊断材料，不作为新版概要设计基线 |

#### 7.2 本文不再回答

- 不重新回答 `L0-bus` 为什么单独成仓。
- 不重新回答 `L0-bus` 与 `L0-core`、`L0-sdk`、observability、governance、MQ backend 的架构边界。
- 不重新定义 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 或事件目录正文。
- 不重新讨论 ports and adapters、at-least-once、durable bus store、in-memory default path、read-only output 等架构取舍。
- 不重新写功能需求、用户故事、验收标准或 ADR 索引。

#### 7.3 本文必须回答

- `L0-bus` 的架构模块如何映射为代码主体框架。
- `L0-bus` 应拆成哪些概要设计层主要组成部分。
- 每个主要组成部分包含哪些代码主体 / 模块，以及各自承担什么、不承担什么。
- 哪些关键对象必须在概要设计层点名，避免详细设计重新发明主语。
- Command / Query / Event / Operations Job 等接口骨架如何分类。
- publication acceptance、delivery、feedback、retry / DLQ / replay preparation、read-only output 等关键处理流如何组织。
- delivery、feedback、recovery、projection 等状态如何定义和流转。
- 哪些配置影响需要被概要设计识别，哪些配置细节必须交给详细设计。

### 8. 回填草稿

正式 `02-概要设计.md` §1 “与上游文档的关系声明”直接摘录并润色本文件：

- §7.1 “上游关系映射表”
- §7.2 “本文不再回答”
- §7.3 “本文必须回答”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

- 无阻塞进入 Step 2 的待确认事项。
- 生产 MQ adapter、durable store 产品、授权承接方、Outbox relay 部署形态、配置 schema、性能基准、DLQ UI 和 effectively-once 专项继续保留为后续 Step 的边界输入,不在 Step 1 定案。

### 10. 进入下一步条件

- 已明确本轮概要设计承接哪些需求和架构结论。
- 已明确旧 `02-概要设计.md` 只作为诊断材料,不作为新版基线。
- 已明确本文不再回答什么、必须回答什么。
- 已足以进入 Step 2 “明确本仓设计目标与当前范围”。
