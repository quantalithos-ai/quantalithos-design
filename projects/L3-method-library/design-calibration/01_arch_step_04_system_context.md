# L3-method-library 01 架构 Step 4: 系统边界与上下文

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 基于 2026-06-15 新版 `00-需求文档.md`、本轮 Step 1~3 重新推导系统上下文;旧 Step 4 只作后置差异审计。
> 正式产物: `projects/L3-method-library/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 系统边界与上下文 |
| 输出文件 | `design-calibration/01_arch_step_04_system_context.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 4;`架构设计书写规范.md` 4.5 |
| 已读取项目台账 | yes:`project_execution_ledger.md`;`01_architecture_calibration_flow.md` |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`00_req_step_02_position_boundary.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_15_risks_open_questions.md` |
| 当前模式 | full-restart |
| 本 Step 模块骨架 | done |
| 进入条件 | pass |
| next_allowed_action | Step 4 已完成,允许文档级 flow 进入 Step 5。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入上游上下文思考。 |
| 上游上下文:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入上游上下文写入。 |
| 上游上下文:再写入 | done | 上游上下文表项 | pass | 进入核心下游上下文思考。 |
| 核心下游上下文:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入核心下游上下文写入。 |
| 核心下游上下文:再写入 | done | 核心下游上下文表项 | pass | 进入条件 / 外围上下文思考。 |
| 条件 / 外围上下文:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入条件 / 外围上下文写入。 |
| 条件 / 外围上下文:再写入 | done | 条件 / 外围上下文表项 | pass | 进入输入输出面与图思考。 |
| 输入输出面与图:先思考 | done | 图对象裁剪 / 降级口径 | pass | 进入输入输出面与图写入。 |
| 输入输出面与图:再写入 | done | 系统上下文图 / 上下游表 / 边界说明 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 允许进入 Step 5。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 4 输出系统上下文图、上下游与输入/输出面表、边界说明。 | 本 Step 只表达正式上下文关系,不展开内部职责、数据所有权、容器部署或接口协议。 |
| `standards/document/架构设计书写规范.md` | 4.5 要求图中只出现本仓、内部仓、外部系统、外部能力、入口系统;关系只写输入、输出、依赖。 | 图中不画人类角色、文档来源对象、内部模块、协议对象或实现组件。 |
| `standards/document/设计文档讨论中间产物规范.md` | 当前 Step 必须先思考后写入,并记录恢复门禁。 | 本文件保留模块级状态,正式 01 暂不回填。 |
| `standards/document/设计文档编写通则.md` | 上下文关系需要承接前序边界,避免制造多真相源。 | 图和表必须能回指职责边界和依赖裁剪。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 不得用架构图暗示未授权 schema、port、状态、mapper 或跨仓 ownership。 | 本 Step 不写接口名、事件名、DTO、repository、outbox 或持久化语义。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | Step 1 已确认本仓核心基线为方法资产定义真相、稳定正式版本、受控消费、追溯一致性。 | 系统上下文必须服务于这些核心基线。 |
| `01_arch_step_02_goals_constraints.md` | Step 2 已明确核心闭环与外围增强隔离,条件型协作不得写成核心前置。 | 主图只放关键上下文对象,候选和外围关系放入表中说明。 |
| `01_arch_step_03_responsibility_boundary.md` | Step 3 已明确本仓做 / 不做 / 易混淆职责和边界红线。 | 上下文对象不得把流程执行、成员状态、治理执行、交易、UI 或正文生命周期带入本仓。 |
| `00_req_step_02_position_boundary.md` | 本仓是方法资产定义、版本发布与分发语义真相仓。 | 图中央必须是方法资产定义源,不是通用内容库或交易分发系统。 |
| `00_req_step_06_consumers_dependencies.md` | 主链输入为 `L0-core`、`L0-bus`;主链输出为 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`。 | 主图对象应优先从这些主链关系中裁剪。 |
| `00_req_step_12_interfaces_dependencies.md` | 接口与依赖只停留在能力级边界;候选关系包括 governance、artifact、marketplace、console/SDK。 | 本 Step 可记录能力面,不能写 API、event schema 或 port。 |
| `00_req_step_15_risks_open_questions.md` | governance 强依赖、artifact 核心消费、marketplace、console/SDK、MethodPlugin/Configuration 等仍有挂起口径。 | 这些关系不能被主图升级为核心前置。 |

### 2.3 后置差异审计输入

| 文档 | 本 Step 用途 | 状态 |
|---|---|---|
| 旧 `01_arch_step_04_system_context.md` | 审计旧主图、上下游表和失效口径中哪些可从新版 00 和 Step 1~3 重新推导。 | read before rewrite |
| `projects/L3-method-library/01-架构设计.md` | 审计旧正式 01 中是否把后续章节、技术组件或候选关系提前写成系统上下文。 | read |
| `domain/method-library/README.md` | 审计旧 RPC、事件、PG、对象存储、marketplace 链路是否反推系统上下文。 | read |

---

## 3. 整体模块骨架

Step 4 只回答本仓在全局系统中的正式上下文位置,不展开内部职责划分、限界上下文、容器部署、数据所有权矩阵、接口 schema 或实现层依赖。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 上游上下文 | 本仓从哪些正式对象获得输入或基础依赖。 | 不写 package、crate、SDK 调用、协议对象或存储组件。 | 上游上下文表项。 |
| 核心下游上下文 | 哪些仓按边界消费本仓方法资产语义。 | 不写具体查询、同步、事件、缓存或快照机制。 | 核心下游上下文表项。 |
| 条件 / 外围上下文 | 哪些相关对象只能作为条件型、候选或外围关系记录。 | 不把候选关系升级成核心前置。 | 条件 / 外围上下文表项。 |
| 输入输出面与图 | 主图应出现哪些对象,能力面和失效口径如何表达。 | 不写接口名、事件名、DTO、port、handler 或运行时顺序。 | 系统上下文图、上下游表、边界说明。 |
| 旧材料差异审计 | 旧系统上下文哪些可保留,哪些必须废弃或挂起。 | 不继承旧 completed 状态或旧技术口径。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 5。 | 不提前通过限界上下文门禁。 | 自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 4 completed | pass | 系统上下文图、上下游与输入/输出面表、边界说明、旧材料差异审计和自检均完成。 | 更新 flow 与项目台账,进入 Step 5 限界上下文与子域划分。 |

---

## 5. 模块思考记录

### 5.1 上游上下文:先思考

问题回答:

- 本仓的关键上游是 `L0-core` 和 `L0-bus`。
- `L0-core` 提供共享契约、基础引用和跨仓一致性基线,这是方法资产身份和正式引用能够跨仓稳定表达的前提。
- `L0-bus` 是变化被平台感知的协作边界;它对本仓不是定义真相来源,也不是业务实现模块。

诊断:

- 旧 README 中的 PostgreSQL、对象存储、RPC、proto、事件 outbox 等都不是 Step 4 的系统上下文对象。
- 如果把数据库或对象存储画成上下文,会把技术选型反推到架构边界。
- 如果把 `L0-bus` 写成本仓内部模块或源码依赖,会混淆事件协作边界和业务实现边界。

取舍:

- 主图保留 `L0-core` 作为关键输入 / 依赖对象。
- 主图保留 `L0-bus` 作为事件协作上下文对象,但关系只写输出 / 依赖,不写事件名或发布机制。
- 不把外部标准、文档来源、人工角色或测试脚本画入图中。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只使用正式上下文对象 | pass | 只识别内部仓级对象。 |
| 是否避免实现组件 | pass | 未把数据库、对象存储、RPC 或 outbox 作为上下文。 |
| 是否可进入“上游上下文:再写入” | pass | 可转成表项。 |

### 5.2 上游上下文:再写入

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、基础引用、跨仓一致性基线 | 本仓需要稳定表达可被下游长期引用的方法资产身份。 |
| `L0-bus` | 输出 | 来源 | 方法资产变化可感知协作面 | 本仓通过事件协作边界让变化成为平台级信号,但不写事件 schema。 |

### 5.3 核心下游上下文:先思考

问题回答:

- 当前核心下游是 `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`。
- 它们的共同点是按边界消费方法资产定义语义,但不能成为方法资产定义真相源。
- 这些对象进入主图,是因为 Step 6 和 Step 12 均把它们识别为当前核心闭环消费方。

诊断:

- `L1-process` 只能消费过程模板、任务和方法定义语义,不能把 ProcessInstance 状态反写成本仓定义。
- `L1-identity` 只能消费角色等定义语义,不能保存角色定义正文或成员实际角色状态到本仓。
- `L2-runtime` 和 `L2-member-images` 的消费关系也不能被误写为源码级拥有或硬编码定义。

取舍:

- 主图放入四个核心下游对象。
- 表中说明它们的输入/输出面,但不写查询、快照、缓存、事件、SDK 或同步方式。
- 不把下游失效写成定义失败;本仓定义真相不因消费方不可用而迁移。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖主链下游 | pass | process、identity、runtime、member-images 均覆盖。 |
| 是否保护 Definition vs Use | pass | 明确下游只消费,不拥有定义真相。 |
| 是否避免接口和同步机制 | pass | 未写 API、event、snapshot 或缓存。 |
| 是否可进入“核心下游上下文:再写入” | pass | 可转成表项。 |

### 5.4 核心下游上下文:再写入

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L1-process` | 输出 | 消费 | 过程模板、任务和方法定义语义 | process 执行流程,但 Template 和方法定义来源归本仓。 |
| `L1-identity` | 输出 | 消费 | 角色等身份相关方法语义 | identity 可消费角色语义,但成员身份和实际角色状态不归本仓。 |
| `L2-runtime` | 输出 | 消费 | 运行时所需方法、角色、模板语义 | runtime 使用方法语义形成执行上下文,但不拥有定义真相。 |
| `L2-member-images` | 输出 | 消费 | Role 到 image variant 的定义来源 | member-images 不应 hardcode 角色镜像映射。 |

### 5.5 条件 / 外围上下文:先思考

问题回答:

- `L1-governance`、`L1-artifact`、`L6-marketplace`、`L5-console` / `L0-sdk` 与本仓有关,但当前不能进入主图成为核心前置。
- governance 只能作为条件型正式化结论或依据引用来源,不能把治理执行和 Gate 流程迁入本仓。
- artifact 只能作为 WorkProductDefinition 等定义语义的候选消费方,不能把 artifact 正文和生命周期迁入本仓。
- marketplace 和 console/SDK 只能作为外围消费或入口候选,不能改变核心方法资产定义真相。

诊断:

- 若把这些对象全部放入主图,上下文图会超过关键对象数量约束,并且会把候选或外围关系升级成核心依赖。
- marketplace 尤其容易把分发语义扩大成上架、购买、安装和履约链路。
- console/SDK 容易把入口体验写成核心架构前置。

取舍:

- 条件 / 外围对象不放入主图,但进入上下游表中记录当前口径。
- 表中明确“条件型”“候选”“外围”含义,避免后续误读为主链对象。
- 不关闭 Step 15 待确认事项。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否区分主图对象和表格对象 | pass | 条件 / 外围对象只入表,不入主图。 |
| 是否避免候选关系升级 | pass | governance、artifact、marketplace、console/SDK 均保留当前挂起口径。 |
| 是否可进入“条件 / 外围上下文:再写入” | pass | 可转成表项。 |

### 5.6 条件 / 外围上下文:再写入

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L1-governance` | 输入 | 治理依赖 | 条件型正式化结论或治理依据引用 | 当前只作为条件型协作,不把治理执行写成本仓前置。 |
| `L1-artifact` | 输出 | 消费 | WorkProductDefinition 等定义语义候选 | 当前作为候选消费关系,artifact 正文和生命周期不归本仓。 |
| `L6-marketplace` | 输出 | 消费 | 方法资产包或分发语义来源 | 当前只保留外围生态发现和分发语义,交易履约不入仓。 |
| `L5-console` / `L0-sdk` | 输出 | 入口 | 方法资产管理与读取入口候选 | 当前作为体验 / 封装入口候选,不成为核心闭环前置。 |

### 5.7 输入输出面与图:先思考

问题回答:

- 主图应展示一个中心仓、两个关键输入 / 依赖对象和四个核心输出消费对象。
- 图中关系只能写 input / output / dependency,不能写查询、发布、订阅、同步、异步或事件名。
- 本仓的失效 / 降级口径是:外围或条件型对象不可用时不得改写已成立的方法资产定义真相;核心输出消费可处于不可感知或待恢复,但不能把定义真相迁移给下游。

诊断:

- 旧图把 bus 单独画成第二段可以保留方向,但需要确保没有事件实现含义。
- 主图如果画 governance、artifact、marketplace、console/SDK,会把 Step 15 未闭口项视觉上升级为主链。
- 图后必须补标准说明,并用短文解释为什么这些对象进入或不进入主图。

取舍:

- 主图只保留 7 个关键对象:中心仓、`L0-core`、`L0-bus`、`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`。
- 上下游表补足条件 / 外围对象。
- 边界说明控制为一段,不展开内部结构或协议细节。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 图对象数量是否受控 | pass | 1 个中心仓 + 6 个关键上下文对象。 |
| 图关系是否只表达边界方向 | pass | 只写 input / output / dependency。 |
| 是否包含降级口径 | pass | 边界说明中保留外围失效不改写 truth 的口径。 |
| 是否可进入“输入输出面与图:再写入” | pass | 可形成结构化中间产物。 |

### 5.8 输入输出面与图:再写入

#### 5.8.1 系统上下文图

```text
----------------------+
| L0-core             |
| shared contracts    |
+----------+-----------+
           |
           | input / dependency
           v
+------------------------------+
| L3-method-library            |
| method asset definition src  |
+-----+----------+--------+----+
      |          |        |
      | output   | output | output
      v          v        v
 +---------+ +----------+ +------------------+
 | L1-     | | L1-      | | L2-runtime      |
 | process | | identity | | method context  |
 +---------+ +----------+ +------------------+
      |
      | output
      v
 +------------------+
 | L2-member-images |
 | role image src   |
 +------------------+

+----------------------+
| L0-bus              |
| event collaboration |
+----------+-----------+
           ^
           | output / dependency
           |
+----------+-----------+
| L3-method-library   |
+----------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向,不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L0-core` 是本仓表达方法资产身份、引用和跨仓一致性所需的共享契约来源。
- `L0-bus` 是方法资产变化被平台感知的事件协作边界,不是业务仓源码依赖。
- `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 是当前核心闭环的主链消费对象。
- governance、artifact、marketplace、console/SDK 等相关关系不放入主图,避免把候选或外围关系升级成核心前置。

#### 5.8.2 上下游与输入/输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、基础引用、跨仓一致性基线 | 本仓需要稳定表达可被下游长期引用的方法资产身份。 |
| `L0-bus` | 输出 | 来源 | 方法资产变化可感知协作面 | 本仓通过事件协作边界让变化成为平台级信号,但不写事件 schema。 |
| `L1-process` | 输出 | 消费 | 过程模板、任务和方法定义语义 | process 执行流程,但 Template 和方法定义来源归本仓。 |
| `L1-identity` | 输出 | 消费 | 角色等身份相关方法语义 | identity 可消费角色语义,但成员身份和实际角色状态不归本仓。 |
| `L2-runtime` | 输出 | 消费 | 运行时所需方法、角色、模板语义 | runtime 使用方法语义形成执行上下文,但不拥有定义真相。 |
| `L2-member-images` | 输出 | 消费 | Role 到 image variant 的定义来源 | member-images 不应 hardcode 角色镜像映射。 |
| `L1-governance` | 输入 | 治理依赖 | 条件型正式化结论或治理依据引用 | 当前只作为条件型协作,不把治理执行写成本仓前置。 |
| `L1-artifact` | 输出 | 消费 | WorkProductDefinition 等定义语义候选 | 当前作为候选消费关系,artifact 正文和生命周期不归本仓。 |
| `L6-marketplace` | 输出 | 消费 | 方法资产包或分发语义来源 | 当前只保留外围生态发现和分发语义,交易履约不入仓。 |
| `L5-console` / `L0-sdk` | 输出 | 入口 | 方法资产管理与读取入口候选 | 当前作为体验 / 封装入口候选,不成为核心闭环前置。 |

#### 5.8.3 边界说明

当前系统上下文以方法资产定义真相和核心下游受控消费为中心,因此主图只纳入 `L0-core`、`L0-bus`、`L1-process`、`L1-identity`、`L2-runtime` 和 `L2-member-images`。`L1-governance`、`L1-artifact`、`L6-marketplace`、`L5-console` / `L0-sdk` 与本仓相关,但当前只按条件型、候选或外围关系记录,不得升级为核心前置。数据库、对象存储、缓存、RPC 和事件名不是系统上下文对象,不能在本章替代仓级边界。依赖失效时的架构口径是:外围或条件型对象不可用不得改写已成立的方法资产定义真相,核心输出消费可降级为不可感知或待恢复,但不能把定义真相迁移给下游。

---

## 6. 旧材料差异审计

### 6.1 可保留方向

| 旧材料方向 | 审计结论 | 当前承接 |
|---|---|---|
| process 消费模板 / 方法定义 | 可保留 | 作为 `L1-process` 核心输出上下文保留。 |
| identity 消费角色等定义语义 | 可保留 | 作为 `L1-identity` 核心输出上下文保留。 |
| runtime 消费方法、角色、模板语义 | 可保留 | 作为 `L2-runtime` 核心输出上下文保留。 |
| member-images 消费 Role 到 image variant 来源 | 可保留 | 作为 `L2-member-images` 核心输出上下文保留。 |
| method-library 通过 bus 发出变化信号 | 可保留 | 作为 `L0-bus` 事件协作边界保留,不继承事件名或 outbox 机制。 |
| governance、artifact、marketplace、console/SDK 与本仓相关 | 可保留为非主图关系 | 作为条件型、候选或外围上下文记录,不进入主图核心前置。 |

### 6.2 必须废弃或挂起的旧口径

| 旧口径 | 处理方式 | 原因 |
|---|---|---|
| 旧 `01_arch_step_04_system_context.md` 的 completed 状态 | 废弃 | 本轮 `01` 已全量重启,旧完成状态不能继承。 |
| PostgreSQL、对象存储、Redis、缓存或文件存储作为系统上下文对象 | 废弃 | 这些是实现基础设施或技术选型,不是仓级上下文对象。 |
| RPC、API、event 名称作为输入 / 输出面 | 废弃 | Step 4 只能写能力面,不能写协议对象或事件 schema。 |
| P0 下游同步成功率和 E2E 链路 | 废弃 | 这是测试 / 验收或运行指标,不是系统上下文。 |
| governance / artifact / UI / marketplace 全量入主图 | 挂起 | 新版需求将这些关系收缩为条件型、候选或外围关系。 |
| capability-hub 作为直接上下文 | 挂起 | 当前职责边界明确 method-library 与 capability-hub 是相邻 L3 仓,本 Step 不建立直接上下文依赖。 |
| 旧正式 `01-架构设计.md` 中 Step 5 之后的子域、容器、依赖和交互结论 | 废弃 | 当前只完成 Step 4,后续章节必须按新 flow 重写。 |

---

## 7. 自检与停审

### 7.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否列出本 Step 必读文档 | pass | 已列公共规范、本仓输入和后置差异审计输入。 |
| 是否先搭整体模块再逐模块推进 | pass | 已按上游、核心下游、条件 / 外围、输入输出面与图、旧材料审计、自检推进。 |
| 是否完成“先思考、再写入” | pass | 四个核心模块均包含思考记录和结构化写入。 |
| 是否形成系统上下文图 | pass | 已按文本图输出中心仓、关键输入 / 依赖和核心输出消费对象。 |
| 是否形成上下游与输入/输出面表 | pass | 已覆盖主图对象及条件 / 外围对象。 |
| 是否形成边界说明 | pass | 已说明主图对象、表格对象、技术组件排除和失效口径。 |
| 是否避免正式 01 正文写入 | pass | 未修改 `01-架构设计.md` 正式正文。 |
| 是否避免提前进入后续 Step | pass | 未划分限界上下文、子域、容器、数据矩阵、接口协议、技术选型或 ADR。 |
| 是否避免旧材料反推 | pass | 旧 Step 4、旧正式 01 和旧 domain README 只作差异审计。 |
| 是否可进入 Step 5 | pass | 系统上下文已足以支撑限界上下文与子域划分。 |

### 7.2 下一步门禁

| 下一步 | gate_status | 进入条件 |
|---|---|---|
| Step 5 限界上下文与子域划分 | pass | 只能使用本 Step 的系统上下文图、上下游表和边界说明作为输入,不得从旧 Step 5 或旧正式 01 直接继承子域划分。 |
| 正式 `01-架构设计.md` 装配 | blocked | 必须等 Step 16 完成后统一装配。 |

---

## 8. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 4 completed | pass | 系统上下文图、上下游与输入/输出面表、边界说明、旧材料差异审计和自检均完成。 | 更新 `01_architecture_calibration_flow.md` 与 `project_execution_ledger.md`,进入 Step 5。 |
