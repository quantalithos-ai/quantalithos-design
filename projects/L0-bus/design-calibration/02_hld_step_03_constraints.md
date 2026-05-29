## Step 3. 收稳约束条件

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-bus/02-概要设计.md` §3 约束条件

### 2. 本步输入

- 上游文档：
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/01-架构设计.md`
  - `projects/L0-bus/design-calibration/02_hld_step_01_upstream_boundary.md`
  - `projects/L0-bus/design-calibration/02_hld_step_02_scope.md`
- 已确认结论：
  - 本轮概要设计只承接新版需求和架构结论。
  - 本轮概要设计停在可实现结构骨架,不展开完整 Rust、schema、DDL、HTTP path、topic 或部署参数。
  - `L0-bus` 的 P0 结构必须围绕事件传递主干闭环展开。
  - 未收稳的生产 adapter、store 产品、授权承接方、Outbox relay 形态、配置 schema 和性能基准不能被写成确定实现。
- 依赖的前序 Step：
  - Step 1：确认上游输入边界。
  - Step 2：明确本仓设计目标与当前范围。

### 3. SOP 问题回答

1. 哪些约束会直接影响本仓对象、接口、处理流或状态机设计？

   回答：直接影响后续设计的约束包括：只消费 `L0-core` 契约、不保存业务 payload 正文、bus truth / snapshot / reference / forbidden body 数据分类、transport semantic 不暴露后端裸参数、at-least-once + bus idempotency anchor、订阅方负责业务副作用幂等、read-only output 不反写、replay 必须依赖 dead-letter / delivery history / audit chain、adapter 差异不得改变上层语义。

2. 哪些约束来自需求文档，哪些约束来自架构设计或全局设计？

   回答：需求文档提供本仓定位、F-001~F-008、BR-001~BR-012、数据归属和验收否决项；架构设计提供职责边界、系统上下文、限界上下文、数据所有权、一致性策略、关键技术选择和风险处理口径；全局设计提供仓际依赖方向、目录和代码组织约束。

3. 哪些边界如果不先写清，后续最容易串到相邻仓或详细设计？

   回答：最容易串线的是 core / bus 共享契约边界、bus / SDK 体验封装边界、bus / observability 长期观测产品边界、bus / governance decision 边界、bus / 发布方 payload 正文边界、bus / 订阅方业务幂等边界、bus / MQ backend 产品能力边界和概要 / 详细设计深度边界。

4. 哪些约束只是泛化工程原则，不应进入本章？

   回答：普通代码可读性、常规分层、通用日志、通用测试覆盖率、常规部署高可用、数据库索引优化、性能调优、代码格式化等泛化工程原则不应进入本章。它们可能在详细设计、测试方案、实施计划或编码规范中出现,但不是本仓概要设计的结构性约束。

5. 每条约束是否能指导后续章节的设计判断？

   回答：本步保留的每条约束都必须能影响 Step 4~Step 11 的判断。例如 `L0-core` 契约约束会影响对象和接口是否重定义 Event；payload 禁止正文会影响字段骨架和只读输出；read-only output 不反写会影响接口和处理流；replay 审计链会影响状态机和异常场景；未收稳项不能定案会影响配置影响和风险章节。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` §3 | 只有目标和非目标,缺少结构性约束章 | 后续对象、接口、流程和状态机缺少统一约束来源 |
| 旧 §4 | 用系统上下文图解释仓际关系 | 架构边界被重复,但没有转译成概要设计结构约束 |
| 旧全文 | envelope / routing / topic 等旧主语未受 `L0-core` 契约边界约束 | 容易让 `L0-bus` 重新定义共享契约 |
| 旧全文 | 未把 forbidden body、read-only output、replay audit chain 写成后续设计硬约束 | 字段、接口和处理流可能越界保存正文或绕过恢复审计 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 约束来源 | 分散在目标、上下文和术语解释中 | 独立提炼为结构性约束表 | 后续章节需要统一判断基准 |
| core / bus 边界 | 旧文档把 envelope 等契约放在 bus 主语中 | 明确 bus 只消费 core 共享契约,不重新定义 | 防止职责重叠 |
| 数据边界 | 旧文档强调 envelope / trace / audit | 明确 bus truth、snapshot、reference、forbidden body | 指导对象字段和存储边界 |
| 恢复边界 | 旧文档提到 retry / DLQ / replay | 明确 replay 不得绕过 dead-letter、delivery history 和 audit chain | 指导状态机和异常处理 |
| 深度边界 | 旧文档未区分概要和详细 | 明确不写完整 Rust、DDL、schema、HTTP path、topic | 防止 02 膨胀成 03 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把需求和架构约束全文复述到概要设计 | 看似完整 | 重复上游,且难以判断哪些约束真正影响结构设计 | 不采用 |
| 方案 B：只保留会影响对象、接口、流程、状态机和配置影响的结构性约束 | 边界清晰,能直接指导后续 Step | 需要后续章节继续引用和落实 | 采用 |
| 方案 C：不设独立约束章,在每章局部说明 | 文档更短 | 各章容易出现不同约束口径,后续难以审查 | 不采用 |

### 7. 结构化中间产物

#### 7.1 约束条件表

| 约束 | 说明 |
|---|---|
| `L0-bus` 只消费 `L0-core` 共享契约 | 后续对象、接口和处理流不得重新定义 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 或事件目录正文。 |
| 传递语义独立于具体 MQ 后端 | `transport semantic` 必须作为平台语义存在,后端 adapter 只能映射能力,不能把裸后端参数泄漏到上层对象或接口。 |
| 当前 P0 以核心闭环为结构主线 | 代码主体、主要组成部分和关键处理流必须优先覆盖 publication acceptance、delivery、feedback、recovery、audit 和 read-only output。 |
| 默认投递语义为 at-least-once | 状态机和接口骨架必须允许重复 delivery / feedback,并依赖 bus idempotency anchor 识别重复。 |
| bus 级幂等不等于业务副作用幂等 | `L0-bus` 只负责 delivery / feedback 层幂等,订阅方业务处理幂等属于订阅方仓。 |
| bus truth 只保存总线传递事实 | publication acceptance、delivery record、ack / fail / timeout、idempotency anchor、retry / DLQ / replay material、bus audit / history 是 bus 真相。 |
| snapshot / projection 只读派生 | transport view、tap / audit output、failure summary、运行状态视图只能从 bus truth 派生,不能反写 truth。 |
| reference 不等于外部正文真相 | core contract、payload、outbox fact、backend capability 只能以引用形式进入 bus,正文归外部所有者。 |
| forbidden body 不得进入 bus | business payload body、raw secret、governance decision body、observability long-term log body 不得进入对象字段、投影、tap 输出或审计正文。 |
| replay 必须受 dead-letter、delivery history 和 audit chain 约束 | 状态机、处理流和 operations job 必须拒绝无完整恢复材料链的 replay。 |
| failure material 不等于 governance decision | 失败材料只能表达 bus 失败事实,不能在对象或接口中生成治理决策正文。 |
| read-only output 不得反写 | SDK、observability、governance、operator 消费的视图和材料不得成为写入口或状态修改入口。 |
| store 不可用时不得生成不可追溯状态 | 处理流必须保证关键状态变化与 history / audit 留痕一起成立,不能只存在瞬时内存状态。 |
| 后端 adapter 能力变化不得静默改变上层语义 | adapter capability 变化必须被显式建模或留痕,不能让同一上层 delivery 语义随产品后端漂移。 |
| 未收稳项不得写成确定实现 | 生产 MQ adapter、durable store 产品、授权承接方、Outbox relay 部署形态、配置 schema、性能基准、DLQ UI、effectively-once 专项只能作为边界或风险输入。 |
| 概要设计不得下沉到完整实现 | 本文不写完整 Rust struct / enum / trait、DTO schema、DDL、索引、HTTP path、topic 命名全集、部署参数和测试脚本。 |

#### 7.2 约束到后续章节的影响表

| 约束主题 | 影响后续章节 |
|---|---|
| `L0-core` 契约边界 | §4 代码主体框架、§6 关键对象、§7 API / 接口骨架 |
| transport semantic 与 adapter 边界 | §4 代码主体框架、§5 主要组成部分、§8 关键处理流、§9 状态机 |
| bus truth / snapshot / reference / forbidden body | §5 主要组成部分、§6 关键对象、§8 关键处理流、§10 异常与边界 |
| at-least-once 与 idempotency anchor | §6 关键对象、§7 API / 接口骨架、§8 关键处理流、§9 状态机 |
| replay audit chain | §7 Operations Job、§8 失败恢复流、§9 状态机、§10 异常与边界 |
| read-only output 不反写 | §5 只读输出部分、§7 Query / Event、§8 只读派生流、§11 配置影响 |
| 未收稳项不得定案 | §11 配置影响、§12 详细设计承接清单、§13 风险与待确认 |
| 概要设计深度边界 | §4~§12 全部章节 |

### 8. 回填草稿

正式 `02-概要设计.md` §3 “约束条件”直接摘录并润色本文件：

- §7.1 “约束条件表”
- §7.2 “约束到后续章节的影响表”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和章节衔接。

### 9. 待确认事项

- 无阻塞进入 Step 4 的待确认事项。
- 后续 Step 4 代码主体框架映射必须显式体现 `L0-core` 契约输入、bus truth、adapter boundary、store boundary 和 read-only output 不反写约束。

### 10. 进入下一步条件

- 已明确会直接影响对象、接口、处理流、状态机和配置影响轮廓的结构性约束。
- 已排除泛化工程原则和详细设计实现策略。
- 已明确每类约束会影响后续哪些章节。
- 已足以进入 Step 4 “代码主体框架映射”。
