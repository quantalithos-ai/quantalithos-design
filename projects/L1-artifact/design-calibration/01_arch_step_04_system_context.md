# Step 4. 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-artifact` 在全局系统中的位置,明确它有哪些正式上下文对象、输入面、输出面以及外部边界。本步只表达系统上下文关系,不展开内部限界上下文、容器部署、数据所有权矩阵、接口协议、事件 payload、实现层依赖或技术选型。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求基线、硬约束和依赖裁剪前提。 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接 Artifact truth 独立性、核心闭环和外围增强取舍。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接做 / 不做、易混淆职责和边界红线。 |
| `projects/L1-artifact/00-需求文档.md` §6 / §7 / §10 / §11 / §12 / §14 / §15 | 已重建 | 校验使用方、依赖、能力闭环、规则、数据归属、接口边界、验收和风险。 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 提供仓际能力关系、全局依赖裁剪和禁止依赖线索。 |
| `standards/document/架构设计书写规范.md` §4.5 | 已读取 | 控制系统上下文图、输入 / 输出面表和边界说明写法。 |
| 旧 `projects/L1-artifact/01-架构设计.md` | 旧 Draft | 只作为旧上下文图和旧外部依赖诊断输入。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、flow、Step 1~3、架构 SOP Step 4 和书写规范 4.5 | done | 本文件 §2 |
| 回答全局位置、正式上游、正式下游、输入面、输出面、上下文边界和降级口径问题 | done | 本文件 §4 |
| 诊断旧 `01-架构设计.md` 中系统上下文污染点 | done | 本文件 §5 |
| 选择关键对象收缩图,不画角色、事件名、接口名或基础设施 | done | 本文件 §7 |
| 输出系统上下文图、上下游与输入 / 输出面表、边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 4 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓在全局系统中的位置是什么?

`L1-artifact` 位于 L1 六域服务层,是平台可审计制品事实的正式上下文中心。它从 `L0-core` 获得共享契约基础,通过 `L0-bus` 对外协作事实变化信号,按场景接收 work、process、governance 和 method-library 等相邻仓提供的引用语境或定义来源,并向 workspace、conversation、archive、observability、SDK、console 和 sync 等消费入口提供稳定 Artifact truth 回指。

这个位置的关键不是“所有系统都调用 artifact”,而是所有涉及 Artifact fact、version、lineage、baseline 和 consumable backref 的协作都必须围绕同一 truth owner 收束。相邻仓可以是输入语境来源、消费方或协作方,但不能成为 Artifact truth owner。

### 4.2 它有哪些正式上游?

| 正式上游 | 关系类型 | 当前口径 |
|---|---|---|
| `L0-core` | 来源 / 依赖 | 提供跨仓 ID、typed ref、trace、error 和基础契约语境;是唯一编译期上游。 |
| `L0-bus` | 入口 / 协作主干 | 承载跨仓变化协作信号;不承载 Artifact body、version set、lineage graph 或 baseline truth。 |
| `L1-work` | 来源 | 提供工作产出、项目 / 工作项引用和 baseline 关联语境;work truth 不归 artifact。 |
| `L1-process` | 来源 | 提供过程产出和 activity 语境;process execution truth 不归 artifact。 |
| `L1-governance` | 来源 / 治理依赖 | 提供治理引用、evidence boundary、AIIA / SoA / gate 语境;治理裁决 truth 不归 artifact。 |
| `L3-method-library` | 来源 | 提供 Artifact kind / WorkProductDefinition / 标准或方法定义来源;具体 Artifact fact / version 归 artifact。 |
| `L2-runtime` / `L3-capability-hub` | 来源 | 提供自动化产出、工具结果或能力执行语境线索;runtime / capability truth 不归 artifact。 |

### 4.3 它有哪些正式下游?

| 正式下游 | 关系类型 | 当前口径 |
|---|---|---|
| `L1-work` | 消费 | 消费 Artifact fact / version / baseline 回指来理解工作产出,但不反写 Artifact truth。 |
| `L1-process` | 消费 | 消费 Artifact version / lineage 回指来解释过程输出,但不重建制品血缘。 |
| `L1-governance` | 消费 | 消费 Artifact evidence、version、baseline 或 lineage 回指来支撑治理判断,但不拥有制品正文或版本事实。 |
| `L1-conversation` | 消费 | 只读消费 Artifact 引用、版本、预览和追溯语境;conversation 正文和展示状态不归 artifact。 |
| `L1-workspace` | 消费 | 消费 Artifact facts 的只读视图和聚合工作台语境;workspace 视图不成为 truth。 |
| `L4-archive` | 消费 | 消费 Artifact version、baseline、发布和封存事实;archive package 不替代 Artifact truth。 |
| `L4-observability` | 消费 | 消费 Artifact lineage、完整性和审计线索;物理日志 / trace store 不反写本仓。 |
| `L0-sdk` / `L5-console` / `L5-sync` | 入口 / 消费 | 通过正式边界访问、管理、查看或同步 Artifact facts;入口系统不拥有 truth。 |

### 4.4 它从外部接收哪些输入面?

| 输入面 | 来源对象 | 本步边界 |
|---|---|---|
| 产出事实候选输入面 | `L1-work`;`L1-process`;`L2-runtime`;`L3-capability-hub` | 只接收候选产出或来源语境,不直接继承相邻仓正文、执行状态或工具结果 truth。 |
| 治理 / 审查 / 责任语境输入面 | `L1-governance`;`L1-work`;`L0-sdk` / `L5-console` | 只接收治理引用、责任语境或入口操作语境,不接管治理裁决或 UI 状态。 |
| 定义来源输入面 | `L3-method-library` | 接收 Artifact kind / work product definition / 方法定义来源语境,不复制方法正文为 Artifact truth。 |
| 变化协作输入面 | `L0-bus` | 接收跨仓变化协作信号,不得把事件内容当作 Artifact truth。 |
| 访问入口输入面 | `L0-sdk`;`L5-console`;`L5-sync` | 入口只能通过正式能力边界提交或读取,不得绕过本仓边界。 |

### 4.5 它向外部提供哪些输出面?

| 输出面 | 消费对象 | 本步边界 |
|---|---|---|
| Artifact truth 回指输出面 | `L1-work`;`L1-process`;`L1-governance`;`L1-conversation`;`L1-workspace` | 提供 fact、version、lineage、baseline 或 consumable backref 的稳定引用语境,不输出相邻仓可反写 truth 的副本。 |
| baseline / version 消费输出面 | `L1-work`;`L1-governance`;`L4-archive`;`L5-console` | 提供受控版本集合和历史版本消费语境,不让发布说明、治理裁决或归档包替代 baseline truth。 |
| 审计 / 观测回指输出面 | `L4-observability`;`L1-governance`;`L5-console` | 提供可追溯 Artifact 回指和边界异常语境,不提供物理 audit log store。 |
| 归档友好输出面 | `L4-archive`;`L5-sync` | 提供可封存的 Artifact truth 引用和 baseline / version 语境,不迁移归档包 ownership。 |
| 访问 / 同步输出面 | `L0-sdk`;`L5-console`;`L5-sync` | 提供正式消费入口,不将 SDK / console / sync 私有状态写成 Artifact truth。 |
| 变化协作输出面 | `L0-bus` | 发布事实变化协作信号,不把 bus 当作 truth 存储。 |

### 4.6 哪些外部系统或相邻仓构成正式上下文边界?

正式上下文边界按是否会持续影响 Artifact truth 的输入、消费、入口或协作来判断:

| 边界对象 | 是否进入 Step 4 主图 | 判断 |
|---|---|---|
| `L0-core` | 进入 | 唯一编译期共享契约来源,必须在主图表达。 |
| `L0-bus` | 进入 | 跨仓变化协作主干,必须表达为协作边界而非 truth store。 |
| `L1-work` / `L1-process` / `L1-governance` | 进入 | 既提供重要语境,也消费 Artifact truth;必须作为相邻 L1 语境边界。 |
| `L3-method-library` | 进入 | Artifact kind / definition source 的上游语义来源;必须表达定义来源边界。 |
| `L1-conversation` / `L1-workspace` / `L4-archive` / `L4-observability` | 进入但收缩 | 作为消费 / 展示 / 封存 / 观测类上下文,主图收缩成下游消费边界,表中逐项说明。 |
| `L0-sdk` / `L5-console` / `L5-sync` | 进入但收缩 | 作为入口 / 访问 / 同步边界,主图收缩成入口系统边界,表中逐项说明。 |
| `L2-runtime` / `L3-capability-hub` | 表中保留,主图不单列 | 当前只是自动化产出和能力执行语境来源,不宜让主图过载;后续交互或详细设计再展开。 |
| 数据库 / Git / S3 / 搜索 / 向量库 / 外部审计平台 | 不进入 | 当前是技术 / 配置 / 外部基础设施候选,不是系统上下文 truth 对象。 |

### 4.7 依赖失效时,本仓的降级口径是什么?

| 失效对象 | 降级口径 |
|---|---|
| `L0-core` | 这是基础契约前提,不可降级为私有 ID / error / trace 体系;若契约缺口存在,后续设计必须停审。 |
| `L0-bus` | 本仓 truth 写入不应由 bus 成功决定;变化协作可挂起 / 延后,但不得伪装为已传播。 |
| `L1-work` / `L1-process` / `L1-governance` | 缺少相邻语境时,只可挂起、降级为缺语境或保留安全引用缺口,不得补造 work / process / governance truth。 |
| `L3-method-library` | 缺少定义来源时,不得自造 Artifact kind / definition source;必须挂起或进入待确认。 |
| `L2-runtime` / `L3-capability-hub` | 自动化来源不可用时,不得用工具结果、模型上下文或 runtime trace 直接写 Artifact truth。 |
| 下游消费边界 | 下游不可用不影响已成立的 Artifact truth;消费输出可延后、重建或降级,不得反向修改 truth。 |
| 入口系统 | 入口不可用只影响访问 / 管理 / 同步体验,不改变本仓内部 truth ownership。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §4.1 | 图中直接出现 `Developers / AI Members / Reviewers`。 | 角色属于需求角色层,不属于系统上下文对象。 | 新图不画角色,入口由 `L0-sdk / L5-console / L5-sync` 表达。 |
| 旧 §4.1 | 中心写 `Artifact metadata / relations / lineage / baseline / dataset governance`。 | 这是内部职责 / 子域 / 对象线索,不是系统上下文图内容。 | 新图中心只写 `L1-artifact` 及仓定位。 |
| 旧 §4.1 | 下游只画 process / work / governance / archive / observability,且混入 done rule、AIIA / SoA、tampered 等具体语义。 | 关系语义下沉到功能 / 事件 / 审计细节,且遗漏 method-library、bus、入口系统和消费视图边界。 | 新表按输入 / 输出面解释,不写事件名、接口名或具体规则。 |
| 旧 §4.2 | 把职责边界写在系统上下文下。 | Step 3 已独立收敛职责边界,Step 4 不应重复职责章节。 | 新 Step 4 只表达上下文关系。 |
| 旧 §4.3 | 写 PostgreSQL、Git / S3 / URL backend SLA。 | 这是技术 / 配置 / 外部基础设施候选,不是当前系统上下文对象。 | 本步明确不把数据库、对象存储、搜索、向量库或审计平台画入上下文。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图对象 | 角色 + 中心内部对象 + 部分下游仓。 | 仓、协作主干、定义来源、相邻 L1、下游消费边界和入口系统边界。 | 对齐架构规范 4.5。 |
| 关系表达 | 混入 done rule、AIIA / SoA、tampered、metadata 等功能词。 | 只保留输入 / 输出 / 依赖三类系统上下文关系。 | 防止提前写接口、事件或功能流。 |
| 外部基础设施 | PostgreSQL、Git / S3 / URL 作为外部可用性约束。 | 技术基础设施不进入当前系统上下文主图。 | 技术选型和配置后移。 |
| 上下文完整性 | 缺 method-library、bus、入口系统、conversation / workspace / sync 消费边界。 | 增加定义来源、变化协作、入口 / 同步和下游消费边界。 | 承接新版需求和依赖裁剪。 |
| 降级口径 | 旧文档以 SLA 和不可用处理为主。 | 按 truth ownership 和外部语境缺失处理。 | 防止依赖失效时补造 Artifact truth。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 单图画出所有上下游仓、运行层、入口和技术设施 | 看似完整。 | 对象超过规范建议,且会把系统上下文图变成依赖 / 运行 / 技术混合图。 | 不采用。 |
| 方案 B: 主图收缩为关键上下文对象,表中展开完整上下游 | 图清晰,表可审查。 | 需要读表理解细项。 | 采用。 |
| 方案 C: 沿用旧 C4 图并局部修词 | 快。 | 角色、内部对象和旧技术依赖残留。 | 不采用。 |
| 方案 D: 只画 L0-core、L0-bus 和入口系统 | 依赖最小。 | 丢失 work / process / governance / method-library 对 Artifact truth 的关键语境。 | 不采用。 |

### 7.1 待确认问题的方案选择

#### 是否把 `L2-runtime` / `L3-capability-hub` 画进主图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 主图单列 runtime / capability。 | 会让自动化执行边界在系统上下文中过重,并可能被误读为 Artifact truth 上游。 |
| 方案 B | 表中保留自动化来源输入面,主图不单列。 | 保留来源语境,避免图过载和 truth 串线。 |

推荐方案 B。

#### 是否把数据库 / 对象存储 / 搜索画进系统上下文图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 图中保留 PostgreSQL、Git、S3、search。 | 会提前进入技术选型和配置,并把基础设施误写成上下文 truth 对象。 |
| 方案 B | 技术设施不进入 Step 4;后续容器、技术选型和配置再讨论。 | 保持系统上下文只表达正式外部对象。 |

推荐方案 B。

#### 是否把 `L1-conversation` / `L1-workspace` / `L4-archive` / `L4-observability` 分别画在主图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 主图逐个画出。 | 主图对象过多,且下游消费语义重复。 |
| 方案 B | 主图收缩为“下游消费边界”,表中逐项解释。 | 图清晰,不丢关系。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 系统上下文图

```text
+----------------------+      +----------------------+      +----------------------+
|       L0-core        |      |        L0-bus        |      |   L3-method-library  |
|   shared contracts   |      |  change coordination |      | definition source    |
+----------+-----------+      +----------+-----------+      +----------+-----------+
           |                             |                             |
           | 依赖                        | 输入 / 输出                 | 输入
           v                             v                             v

                    +--------------------------------------+
                    |             L1-artifact              |
                    |  auditable Artifact truth boundary   |
                    +------------------+-------------------+
                                       ^
                                       |
                         输入 / 输出   |
                                       |
                    +------------------+-------------------+
                    | L1-work / L1-process / L1-governance |
                    | adjacent L1 scenario contexts        |
                    +------------------+-------------------+
                                       |
                                       | 输出
                                       v
+----------------------+      +----------------------+      +----------------------+
| downstream consumers |      | access entry systems |      | automation sources   |
| conversation/workspace|     | sdk/console/sync     |      | runtime/capability   |
+----------------------+      +----------------------+      +----------------------+
```

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入 / 输出方向,不表达接口、事件、实现组件或运行时顺序。
- `L1-artifact` 是 Artifact fact、version、lineage、baseline 和 consumable backref 的 truth boundary;相邻对象只能提供语境、消费回指或承接协作。
- `downstream consumers` 收缩了 `L1-conversation`、`L1-workspace`、`L4-archive` 和 `L4-observability`;`access entry systems` 收缩了 `L0-sdk`、`L5-console` 和 `L5-sync`。
- `automation sources` 保留自动化产出来源语境,但不表示 runtime、capability 或工具结果可以直接拥有 Artifact truth。

### 8.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 / 依赖 | 共享 ID、typed ref、trace、error 和基础契约语境 | 唯一编译期上游;不得用本仓私有契约替代。 |
| `L0-bus` | 输入 / 输出 | 入口 / 消费 | 跨仓变化协作信号 | bus 只承载协作信号,不承载 Artifact body、version set、lineage graph 或 baseline truth。 |
| `L1-work` | 输入 / 输出 | 来源 / 消费 | 工作产出语境、项目 / 工作项引用、Artifact 回指和 baseline 消费语境 | work truth 不归 artifact;Artifact truth 也不反写 work state。 |
| `L1-process` | 输入 / 输出 | 来源 / 消费 | 过程产出语境、activity 输出语境、Artifact version / lineage 回指 | process execution truth 不归 artifact;trace 或 activity 状态不能补造 lineage。 |
| `L1-governance` | 输入 / 输出 | 来源 / 治理依赖 / 消费 | 治理引用、evidence boundary、AIIA / SoA / gate 语境、Artifact evidence 回指 | governance decision truth 不归 artifact;制品正文和版本也不归 governance。 |
| `L3-method-library` | 输入 | 来源 | Artifact kind、WorkProductDefinition、标准 / 方法定义来源语境 | 定义来源不等于具体 Artifact fact;本仓不得复制方法正文为 truth。 |
| `L2-runtime` / `L3-capability-hub` | 输入 | 来源 | 自动化产出来源、工具结果和能力执行语境线索 | 自动化来源必须经正式 Artifact fact 收束;runtime / capability truth 不归 artifact。 |
| `L1-conversation` | 输出 | 消费 | Artifact 引用、版本、预览和追溯语境 | conversation 正文和展示状态不归 artifact;只读消费不得反写 truth。 |
| `L1-workspace` | 输出 | 消费 | Artifact facts 的只读视图和聚合工作台语境 | workspace 视图、筛选和 UI 状态不成为 Artifact truth。 |
| `L4-archive` | 输出 | 消费 | Artifact version、baseline、发布和封存事实回指 | archive package 不替代 Artifact baseline 或 version truth。 |
| `L4-observability` | 输出 | 消费 | Artifact lineage、完整性和审计线索回指 | observability 物理日志、trace store 和 alert stream 不反写本仓事实。 |
| `L0-sdk` | 输入 / 输出 | 入口 / 消费 | 访问、管理和同步入口能力 | SDK 是正式入口边界,不拥有 Artifact truth。 |
| `L5-console` | 输入 / 输出 | 入口 / 消费 | 管理 / 查看入口和人工操作语境 | console UI 状态不得成为 Artifact fact、version、lineage 或 baseline。 |
| `L5-sync` | 输出 | 消费 | 同步友好 Artifact truth 回指 | sync 私有副本不迁移 ownership,不可反推或反写 Artifact truth。 |

### 8.3 边界说明

这些对象进入系统上下文,是因为它们会持续影响 `L1-artifact` 的正式输入语境、输出消费、入口访问或跨仓协作。主图故意收缩下游消费边界和入口系统边界,避免把系统上下文图扩张成全仓依赖矩阵或运行拓扑。数据库、对象存储、Git、S3、搜索、向量库和外部审计平台虽然相关,但当前只属于后续容器、技术选型或配置讨论,不属于本章正式上下文对象。`L2-runtime` 和 `L3-capability-hub` 只作为自动化来源语境进入表格,不允许被误读成 Artifact truth owner。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 5. 系统边界与上下文

> 校准来源:
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前文档问题诊断”小节,了解本章如何从职责边界和需求依赖裁剪收敛出正式系统上下文。

### 5.1 系统上下文图

摘录 `design-calibration/01_arch_step_04_system_context.md` §8.1。

### 5.2 上下游与输入 / 输出面表

摘录 `design-calibration/01_arch_step_04_system_context.md` §8.2。

### 5.3 边界说明

摘录 `design-calibration/01_arch_step_04_system_context.md` §8.3。
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。下列事项进入后续 Step,不得在 Step 4 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-ART-ARCH-004-001 | `L1-artifact` 内部限界上下文与子域如何划分 | 后续 Step 5 收敛;当前只固定系统上下文边界。 |
| Q-ART-ARCH-004-002 | 入口系统、下游消费方和自动化来源的具体交互方式 | 后续 Step 9 和详细设计收敛;当前不写同步 / 异步 / 协议。 |
| Q-ART-ARCH-004-003 | 数据库、对象存储、content backend、hash、search 和 external audit 是否进入技术主线 | 后续 Step 6、Step 10、配置和测试阶段收敛;当前不画入系统上下文。 |
| Q-ART-ARCH-004-004 | `L3-method-library` definition source 与 Artifact kind / fact 的精确映射 | 后续 Step 5、Step 8 和详细设计收敛;当前只固定定义来源上下文关系。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓在全局系统中的位置 | pass | `L1-artifact` 已定位为 L1 可审计 Artifact truth boundary。 |
| 是否画出正式对象的系统上下文图 | pass | §8.1 只画仓、协作主干、定义来源、入口 / 消费 / 自动化来源边界。 |
| 图中是否避免角色、文档来源对象、接口名、事件名和实现组件 | pass | 图中无角色、文档、API、event、DTO、repository、database。 |
| 是否通过表格解释上下游和输入 / 输出面 | pass | §8.2 已列出对象、关系方向、关系类型、输入 / 输出面和说明。 |
| 是否说明边界和不进入主图的相关对象 | pass | §8.3 已解释下游收缩、入口收缩、基础设施后置和自动化来源边界。 |
| 是否提前写内部结构、容器部署、数据所有权、协议或技术选型 | pass | 本步只输出系统上下文;相关事项进入后续 Step。 |
| 是否允许进入 Step 5 | pass | 当前系统边界与上下文足以支撑限界上下文与子域划分讨论。 |

当前 Step 4 `系统边界与上下文` 已完成。下一步必须等待用户确认后进入 Step 5 `限界上下文与子域划分`,并只创建 / 改写 `design-calibration/01_arch_step_05_bounded_context_subdomains.md`。
