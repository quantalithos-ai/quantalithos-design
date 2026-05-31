## Step 1. 确认上游输入边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-sdk/02-概要设计.md` §1 与上游文档的关系声明

### 2. 本步输入

- 上游文档：
  - `projects/L0-sdk/00-需求文档.md` v0.2.0
  - `projects/L0-sdk/01-架构设计.md` v0.2.0
  - `projects/L0-core/00~07`
  - `projects/L0-bus/00~07`
  - `standards/document/概要设计书写规范.md`
  - `standards/document/概要设计讨论流程_SOP.md`
  - `standards/document/设计文档讨论中间产物规范.md`
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `standards/document/子项目目录与代码文件组织规范.md`
- 已确认结论：
  - `L0-sdk` 是 Rust / Python / TypeScript 三语言官方客户端接入层。
  - `L0-sdk` 不是 binding-only 仓、server gateway、auth provider、UI 组件库、runtime 框架或本地状态 / 缓存 owner。
  - `L0-core` 与 `L0-bus` 是直接稳定上游 truth。
  - L1/L2/L3/L4 formal APIs 是运行期封装目标,不是 SDK 源码依赖。
  - 当前 P0 聚焦本地 package candidate、最小可验证接入、三语言语义一致、event client view、error / trace / redaction / credential protection 默认一致和兼容治理。
  - 公共注册表、完整 MCP、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态和全量 L1~L4 client 覆盖不进入当前 P0。
- 依赖的前序 Step：
  - 无。本步是 `02-概要设计.md` 校准的第一个 Step。

### 3. SOP 问题回答

1. 当前概要设计要承接哪些需求结论？

   回答：承接 `00-需求文档.md` 中关于本仓定位、目标与非目标、用户与角色、使用方与依赖、核心能力闭环、US-001~US-009 用户故事、F-001~F-010 功能需求、业务规则与边界约束、数据需求与数据归属、接口与依赖、非功能需求、验收标准和风险待确认事项的稳定结论。概要设计只把这些需求继续下沉为代码主体、主要组成部分、对象、接口、处理流、状态机和配置影响轮廓，不重新定义需求。

2. 当前概要设计要承接哪些架构结论？

   回答：承接 `01-架构设计.md` 中关于职责边界、系统上下文、限界上下文、容器 / 部署架构、依赖方向、数据所有权、一致性策略、关键交互、技术机制、备选方案、横切关注点、演进路线、风险和 ADR 候选的稳定结论。概要设计会把这些架构结论转译为可实现结构，但不重新讨论架构取舍。

3. 这些结论里，哪些已经足够稳定，可以直接作为概要设计输入？

   回答：已经稳定的输入包括：官方客户端接入层定位、上游契约派生视图与官方语义封装分层、三语言语义基线与 idiomatic 表达分离、formal API / fake boundary adapter、`L0-bus` 语义事件客户端视图、本地 package candidate 与验证证据链、跨语言横切默认策略、版本兼容 / deprecated 治理与上游版本引用、SDK truth / snapshot / reference / forbidden body 四类数据边界。

4. 哪些结论虽然相关，但仍未收稳，因此当前不能直接往下展开？

   回答：P0 最小可验证接入采用哪个 stable formal API 或 fake / fixture target、具体协议 / transport / 生成器 / 语言包管理、初始化耗时 / 包体积 / 微基准阈值、candidate reports / artifacts 的具体格式、公共发布渠道和正式发布阶段、全量 L1/L2/L3/L4 client 覆盖顺序、完整 MCP / REST / GraphQL / REPL / 本地缓存是否重新进入主线仍未收稳。概要设计可以保留这些点的承接位置和边界，但不能写成确定实现。

5. 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里？

   回答：概要设计不得展开 `L0-core` 已拥有的共享契约定义，不得展开 `L0-bus` 已拥有的 delivery、retry、dead-letter、replay、tap truth，不得展开服务端业务事实、身份认证 / 权限裁决 / 治理审批、UI 状态、runtime loop、本地缓存策略、公共注册表运营、完整协议 schema、完整字段模型、完整函数签名、函数实现、DDL、详细调用链、测试脚本或发布命令。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` 文档头部 | 仍引用旧版概要规范、通则和旧版关联 ADR 占位,作者 / 日期 / 状态停留在 2026-05-17 | 无法追溯到新版需求、架构和概要 SOP |
| 旧 §1 | 用“开发者接入面”解释本仓,但仍以 binding / wrapper / client / subscription / redaction 的旧心智展开 | 可迁移部分事实,但未对齐新版“官方客户端接入层 + 上游派生视图 + 官方语义封装”主线 |
| 旧 §2~§5 | 大量重复背景、目标、系统上下文和全局位置 | 概要设计重复需求和架构内容,没有下沉到代码主体骨架 |
| 旧约束 | 写入三语言必须发布、公共包体积、CI 时长、W3C Trace 等旧指标 | 部分指标未在新版需求 / 架构中收稳,不能作为当前概要设计确定输入 |
| 全文 | 缺少 `design-calibration` 校准来源 | 后续读者无法定位每章结论来自哪个 Step |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 上游基线 | 旧 `01-架构设计.md`、旧 SDK 草案和旧 02 草案混用 | `00-需求文档.md` v0.2.0 + `01-架构设计.md` v0.2.0 | 当前需求和架构已重建,旧草案只能作诊断材料 |
| 本仓身份 | developer-facing 接入面,但容易落回 binding / wrapper / public registry 主线 | Rust / Python / TypeScript 三语言官方客户端接入层 | 与新版需求和架构定位一致 |
| 概要设计职责 | 解释背景、目标和全局位置 | 定义代码主体框架、主要组成部分、对象、接口、处理流、状态机和配置影响轮廓 | 符合新版概要设计定位 |
| 未收稳内容 | 容易被旧文档写成包体积、CI、公共发布或工具链定论 | 明确列为暂不进入概要设计确定范围 | 防止概要设计脑补具体工具链、发布渠道或阈值 |
| 追溯方式 | 无具体中间产物来源 | 每章引用具体 `design-calibration/02_hld_step_*.md` | 支撑后续审查和实现读取 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧 `02-概要设计.md` 作为主体基线 | 已有较长内容,包含 binding、wrapper、client、subscription 等事实线索 | 旧主线重复需求 / 架构,并混入公共发布、包体积、工具链等未收稳内容 | 不采用 |
| 方案 B：直接承接新版 `00` / `01`,旧 `02` 只作诊断材料 | 边界干净,能对齐当前需求和架构 | 需要在 Step 14 重建正式文档 | 采用 |
| 方案 C：重新打开需求和架构取舍 | 可以重新讨论所有 SDK 能力边界 | 会破坏已稳定的需求 / 架构校准结果 | 不采用 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L0-sdk/00-需求文档.md` | 本仓定位、目标 / 非目标、用户与角色、核心能力闭环、US-001~US-009、F-001~F-010、数据归属、接口依赖、验收和风险 | 把需求闭环下沉为代码主体、主要组成部分、对象、接口、处理流、状态机和配置影响轮廓 |
| `projects/L0-sdk/01-架构设计.md` | 职责边界、系统上下文、限界上下文、容器、依赖方向、数据所有权、关键交互、技术机制、演进路线和风险 | 把架构机制和运行承载转译为概要设计层的主要组成部分和实现分层 |
| `projects/L0-core/00~07` | 共享契约、错误、trace、metadata、CloudEvents、envelope、配置和测试证据口径 | 明确 `L0-sdk` 只消费 core truth,不重新定义共享契约对象 |
| `projects/L0-bus/00~07` | publish / subscribe / ack / retry / dead-letter / replay / tap / reports 等事件传递语义 | 明确 `L0-sdk` 只提供 bus 语义事件客户端视图,不拥有 bus runtime truth |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局仓际依赖方向和本仓依赖裁剪口径 | 在概要设计中保留 `L0-core` / `L0-bus` 编译期依赖、formal API 运行期依赖和下游 package 消费边界 |
| `standards/document/子项目目录与代码文件组织规范.md` | Rust 子项目组织、单 crate / workspace 判断和 package 命名规则 | 只作为后续详细设计 / 实施计划输入,本步不展开目录结构 |
| `standards/document/概要设计书写规范.md` | 正式 `02-概要设计.md` 的章节主链和输出格式 | 指导本轮 14 章正式概要设计的最终形态 |
| `standards/document/概要设计讨论流程_SOP.md` | 14 步概要设计讨论流程 | 指导本轮逐 Step 生成中间产物 |
| `projects/L0-sdk/02-概要设计.md` v0.1.0 | 旧 SDK 概要草案 | 仅作为问题诊断材料,不作为新版概要设计基线 |

#### 7.2 本文不再回答

- 不重新回答 `L0-sdk` 为什么单独成仓。
- 不重新回答 `L0-sdk` 与 `L0-core`、`L0-bus`、L1/L2/L3/L4 formal APIs、L5/L6、runtime / automation、security / identity / gateway / governance 的架构边界。
- 不重新定义 core proto / DTO、ErrorCode、TraceContext、Metadata、CloudEvents schema、envelope 或 bus delivery / retry / DLQ / replay / tap 语义。
- 不重新讨论官方语义封装主线、三语言语义基线、formal API / fake boundary adapter、event client view、本地 package candidate、横切默认和版本兼容治理等架构机制。
- 不重新写用户故事、功能需求、业务规则、验收标准、风险或 ADR 候选索引。
- 不在概要设计中定案公共注册表发布、完整 MCP、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态或全量服务覆盖。

#### 7.3 本文必须回答

- `L0-sdk` 的架构机制如何映射为代码主体框架。
- `L0-sdk` 应拆成哪些概要设计层主要组成部分。
- 每个主要组成部分包含哪些代码主体 / 模块,以及各自承担什么、不承担什么。
- 哪些关键对象必须在概要设计层点名,避免详细设计重新发明主语。
- Command / Query / Event / Operations Job / package validation 等接口骨架如何分类。
- 上游契约消费、service access、event client、candidate validation、cross-language consistency、compatibility / deprecated 等关键处理流如何组织。
- package candidate、verification、snapshot freshness、compatibility、deprecated、unsupported / stale / pending 等状态如何定义和流转。
- 哪些配置影响需要被概要设计识别,哪些配置细节必须交给详细设计。

### 8. 回填草稿

正式 `02-概要设计.md` §1 “与上游文档的关系声明”直接摘录并润色本文件：

- §7.1 “上游关系映射表”
- §7.2 “本文不再回答”
- §7.3 “本文必须回答”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

- 无阻塞进入 Step 2 的待确认事项。
- P0 最小验证目标、具体协议 / transport / 生成器 / 语言包管理、性能阈值、reports / artifacts 格式、公共发布阶段、全量服务覆盖顺序、完整 MCP / REST / GraphQL / REPL / 本地缓存继续保留为后续 Step 的边界输入,不在 Step 1 定案。

### 10. 进入下一步条件

- 已明确本轮概要设计承接哪些需求和架构结论。
- 已明确旧 `02-概要设计.md` 只作为诊断材料,不作为新版基线。
- 已明确本文不再回答什么、必须回答什么。
- 已足以进入 Step 2 “明确本仓设计目标与当前范围”。
