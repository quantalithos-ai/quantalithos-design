# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力、§3 约束条件
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 已收稳的需求边界、能力闭环、数据归属和依赖前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。本步不写容器、部署、依赖方向图、技术选型、协议、状态机、数据库、对象 schema 或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 作为架构目标与约束的直接输入。 |
| `projects/L1-artifact/00-需求文档.md` §2 / §4 / §6 / §7 / §10 / §11 / §13 / §14 / §15 | 已重建 | 提取仓定位、目标 / 非目标、依赖、核心闭环、规则、数据归属、NFR、验收和风险。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 验证目标与功能 / 规则 / 数据 / 验收的对应关系。 |
| 旧 `projects/L1-artifact/01-架构设计.md` | 旧 Draft | 仅作为旧目标、旧技术假设、旧枚举、旧性能和旧存储口径诊断来源。 |
| `standards/document/架构设计书写规范.md` §4.2 / §4.3 | 已读取 | 控制目标、约束、取舍和非目标的写法。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 1、正式 00、架构 SOP Step 2 和书写规范 4.2 / 4.3 | done | 本文件 §2 |
| 回答 Step 2 的目标、约束、取舍、非目标问题 | done | 本文件 §4 |
| 诊断旧 `01-架构设计.md` 中不可继承的目标 / 约束 | done | 本文件 §5 |
| 选择从新版需求基线重推目标与约束 | done | 本文件 §7 |
| 输出业务背景、驱动力、架构目标、不可变约束、取舍和非目标 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 2 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓在架构层面要确保什么成立?

`L1-artifact` 架构必须确保“可审计制品事实”作为独立真相成立,并让 work、process、governance、conversation、workspace、archive、observability、SDK、console、sync、method-library、runtime 和 capability-hub 围绕同一 Artifact truth 协作,而不是各自复制正文、重建血缘、私自冻结基线或补造可消费回指。

架构层必须守住以下结构性结果:

1. 平台产出能进入正式 Artifact fact 语境,但不把附件、日志、视图、归档材料或运行材料当作 truth 来源。
2. Artifact version 能形成稳定、可长期引用、可替代、可比较且不可无声覆盖的版本事实。
3. Artifact lineage 能围绕正式 fact / version 表达来源、影响、替代、依赖和追溯语义,但不由 runtime trace、tool result 或事件流补造。
4. Artifact baseline 能表达受控版本集合事实,但不由项目状态、治理裁决、发布说明或归档包替代。
5. 下游消费能稳定回指 Artifact fact、version、lineage 和 baseline,但不迁移 Artifact truth ownership。
6. 跨仓协作必须通过共享契约、引用、摘要、事件协作、运行期 resolver / adapter 或消费回指表达,不得把相邻仓写成 truth 上游。
7. 外围读侧、投影、报表、搜索、预览、归档友好输出和观测友好输出只能派生或消费,不得反写核心 Artifact truth。

### 4.2 哪些约束是不可变的?

不可变约束来自需求规则、数据归属、依赖裁剪和验收否决项:

| 约束来源 | 不可变约束 |
|---|---|
| fact 边界 | 未进入正式事实入口的材料不得被当作 Artifact truth。 |
| version 边界 | 新内容、候选修订、自动化再生成或下游状态不得无声覆盖既有 Artifact version truth。 |
| lineage 边界 | runtime trace、tool result、model context、observability record、event stream 或私有追溯链不得补造 Artifact lineage truth。 |
| baseline 边界 | 发布说明、治理裁决、项目状态、归档包或临时清单不得替代 Artifact baseline truth。 |
| consumption 边界 | SDK、console、sync、workspace、report、archive 或 observability 不得拥有、复制、迁移、反推或反写 Artifact truth。 |
| work / process / governance 边界 | 工作、过程和治理语境可以协作或消费 Artifact truth,但各自 truth 不归 Artifact。 |
| method / runtime / capability 边界 | 方法定义、运行输出、工具结果和能力注册只能作为线索或外部语境,不得自动形成 Artifact truth。 |
| external body 边界 | 外部正文、运行材料正文、视图正文、事件正文、归档包正文和观测正文不得进入本仓 truth 生命周期。 |
| 依赖边界 | `L0-core` 是唯一编译期上游;`L0-bus` 只承载变化协作信号。 |
| 派生路径边界 | 查询、投影、搜索、报表、对账、归档准备和维护任务不得隐式创建、修改、冻结或关闭 Artifact truth。 |

### 4.3 哪些约束是当前阶段可以接受的取舍?

当前可接受取舍只覆盖 Artifact 潜在能力范围内的架构收缩,不把边界外事项伪装为取舍:

| 取舍对象 | 当前处理 |
|---|---|
| Artifact 搜索 / 浏览 / 列表发现 | 当前作为外围发现能力处理,不作为 Artifact fact、version、lineage 或 baseline 成立前置。 |
| Artifact / lineage / baseline 预览 | 当前作为消费增强处理,只读取或摘要正式 truth,不承载正文 truth。 |
| Projection / read model / report | 当前作为派生读侧处理,允许滞后和降级,不得反写真相。 |
| 通知 / 事件感知 | 当前作为变化感知增强处理,事件存在本身不形成 Artifact truth。 |
| 归档消费友好输出 | 当前作为 archive 下游消费增强处理,归档包不得替代 Artifact baseline 或 version truth。 |
| 观测 / 审计消费友好输出 | 当前作为 observability 消费增强处理,观测记录不得反写 lineage 或 tamper truth。 |
| SDK / console / sync 友好输出 | 当前作为访问与同步体验增强处理,不迁移 ownership。 |
| content storage、hash、tamper、完整性校验 | 当前作为后续架构技术选型、配置和测试输入,不在 Step 2 锁定机制或指标。 |
| 旧 `16 kind`、`7 relation`、P95、容量和后端方案 | 当前作为历史线索和候选输入,不作为新版架构硬目标。 |

### 4.4 哪些目标可以明确判断,甚至量化?

当前可以明确判断的目标是结构目标,不是实现指标:

| 目标类型 | 当前判断 |
|---|---|
| Truth 独立性 | 必须成立。Artifact truth 不能被 work state、process output、governance decision、workspace view、archive package、observability record 或 runtime material 覆盖或替代。 |
| 核心闭环 | 必须成立。制品事实承载、制品版本化、制品血缘关联、制品基线冻结、制品事实可消费表达是当前架构主线。 |
| 边界保护 | 必须成立。外部正文入仓、消费副本反写、血缘补造、基线替代和非 core 编译依赖均为否决。 |
| 可追溯性 | 必须成立。fact、version、lineage、baseline 和 consumption backref 均要能解释依据和边界。 |
| 幂等 / 一致性 | 必须成立。重复输入、自动化重放、事件重复和重复消费不得制造多义 Artifact truth。 |
| 旧性能 / 容量数字 | 当前不能量化为硬目标。旧 P95、hash 耗时、总量、关系量和 tampered 覆盖率只作为后续测试和容量评估候选。 |

### 4.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题?

| 相关事项 | 当前架构判断 |
|---|---|
| Project、WorkItem、Iteration、backlog、工作状态 | 由 `L1-work` 拥有,Artifact 只承载制品事实和可消费回指。 |
| ProcessTemplate、ProcessInstance、Activity、checkpoint、过程执行状态 | 由 `L1-process` 拥有,Artifact 只承载过程输出进入制品事实后的 Artifact truth。 |
| Gate decision、Policy、AIIA / SoA 治理结论、Nonconformity | 由 `L1-governance` 拥有,Artifact 只承载相关制品正文、版本或证据引用语境。 |
| conversation space、turn、review discussion、artifact preview 展示状态 | 由 `L1-conversation` 或产品入口拥有,Artifact 不保存对话或展示状态 truth。 |
| workspace 聚合视图、筛选状态、UI 布局、console 展示状态 | 由 `L1-workspace` / `L5-console` 拥有,Artifact 只提供稳定 truth 消费边界。 |
| audit log store、trace storage、metrics、alert stream | 由 `L4-observability` 拥有,Artifact 只提供可消费审计回指和边界异常语境。 |
| archive package、长期保留策略、恢复编排、跨域快照包 | 由 `L4-archive` 拥有,Artifact baseline / version truth 不迁移到 archive。 |
| MethodContent、WorkProductDefinition、Artifact kind 定义来源、ProcessTemplateDef | 由 `L3-method-library` 等定义仓拥有,Artifact 只引用定义来源或接收经正式边界收束后的材料。 |
| runtime 执行、工具调用、模型上下文、policy cache | 由运行与能力层拥有,Artifact 只在显式事实收束后承载结果。 |
| 数据库、对象存储、Git、S3、inline、URL、搜索引擎、向量库、外部审计平台 | 属于技术选型、配置或外部系统边界,不是 Step 2 的架构目标。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §1 | 把 Artifact 写 P95、GetLineage P95、hash 校验、5000w、1.5 亿和 tampered 100% 写成成功标准。 | 新版需求已明确无来源硬指标不固化。 | Step 2 只保留结构性目标,旧数字后移到测试 / 容量候选。 |
| 旧 §1 / §2 | 把 16 kind、7 relation kind、approved 不可改、baseline pin version+hash、quality_tags 等写成硬约束。 | 当前需求未把旧枚举、hash 规则或状态口径定为正式结论。 | 后续对象契约、状态机和规则重新闭口。 |
| 旧 §3 | 直接选择 metadata-first、external content store、relation graph、baseline pin。 | 技术选型越过 Step 8~Step 10。 | 后移到数据所有权、一致性和技术选型讨论。 |
| 旧 §4 | 把 process、work、governance、archive、observability 和具体输出混写为上下文。 | 消费方和协作方容易被误写成 truth owner。 | Step 2 先明确 ownership 和不可变边界,后续 Step 4 重画上下文。 |
| 旧 §5 | 直接给 Metadata、Lineage、Freeze、Dataset、Content 等上下文。 | 子域划分尚未由新版目标、职责和上下文重新推导。 | 后续 Step 5 独立收敛。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构目标表达 | 偏对象、功能、技术和旧量化。 | 改为 Artifact truth、核心闭环、ownership 边界、消费边界和可追溯性的结构性结果。 | 对齐架构规范 4.2。 |
| 不可变约束 | 旧约束混入枚举、hash、存储和 SLA。 | 覆盖 fact、version、lineage、baseline、consumption、external body、dependency 和派生路径边界。 | 对齐新版需求和 Step 1。 |
| 当前取舍 | 外围增强和核心闭环混杂。 | 明确搜索、预览、projection、通知、归档、观测、SDK / console / sync 等作为外围增强。 | 防止范围膨胀和伪前置。 |
| 架构非目标 | 分散在目标、依赖和技术段落中。 | 形成独立非目标表,按边界归因。 | 便于后续职责边界和系统上下文审查。 |
| 指标处理 | 旧 P95 / 容量 / hash / tampered 直接硬化。 | 降为候选测试或容量输入。 | 避免无来源指标污染正式架构。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧架构目标、旧枚举、旧 hash / baseline pin 和旧指标 | 复用快。 | 与新版需求和 SOP 分层不一致,旧口径污染高。 | 不采用。 |
| 方案 B: 从新版需求基线重新推导架构目标与约束 | 可追溯,边界完整。 | 需要后续 Step 重建正式架构文档。 | 采用。 |
| 方案 C: Step 2 直接确定存储后端、hash 策略、relation graph 和 baseline 成员形态 | 推进看似更快。 | 越过数据所有权、技术选型、配置和详细设计。 | 不采用。 |
| 方案 D: 把搜索、预览、projection、报表、归档和观测全部列为非目标 | 范围最小。 | 会丢失 Artifact 作为被消费 truth 的演进线索。 | 不采用,改列为当前阶段可接受取舍。 |

### 7.1 待确认问题的方案选择

#### content storage / hash / tamper 是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构目标固定内容外置、hash 校验和 tamper 检测机制。 | 会把旧技术和测试想象提前硬化。 |
| 方案 B | 当前只要求 Artifact truth 与外部正文 / 完整性语境边界清楚。 | 保留实现空间,对齐 Step 2 分层。 |

推荐方案 B。

#### 搜索 / projection / read model 是否进入核心目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构必须以搜索和 projection 为主结构。 | 会让派生读侧成为 truth 前置。 |
| 方案 B | 当前架构守住核心 Artifact truth,读侧作为可滞后、可降级派生边界。 | 与需求外围增强口径一致。 |

推荐方案 B。

#### 旧性能和容量数字是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接作为硬架构目标。 | 与需求 §13 / §15 冲突,缺少正式负载模型和验证来源。 |
| 方案 B | 作为候选 SLO、容量和测试输入。 | 保留旧线索,不伪量化。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 业务背景结论

Quantalithos 的需求、设计、代码、测试、发布、审计和复盘都会产生需要长期引用的制品事实。`L1-artifact` 值得单独做架构设计,是因为 Artifact fact、version、lineage、baseline 和 consumption backref 如果散落在工作状态、过程输出、治理结论、对话视图、归档包、观测记录或运行材料中,平台会形成多份互相冲突的制品真相。

### 8.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 制品事实需要独立承载 | Artifact fact 不能由附件、日志、workspace 视图、archive package 或外部正文替代。 |
| 版本事实需要稳定可引用 | Artifact version 不能被 current latest、自动化再生成或下游状态无声覆盖。 |
| 血缘事实需要正式锚点 | Lineage 必须围绕正式 fact / version,不能由 trace、tool result、event stream 或私有链路补造。 |
| 基线事实需要受控集合语义 | Baseline 必须表达正式 Artifact version 集合,不能由治理裁决、发布说明、项目状态或归档包替代。 |
| 消费需要不迁移 ownership | 下游可以展示、封存、观测、访问或同步 Artifact truth,但不能复制、反写或反推 truth。 |
| 跨仓协作必须裁剪依赖 | 除 `L0-core` 外不得把相邻仓或外部系统变成编译期 truth 上游。 |

### 8.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的可审计制品事实真相 | 否则 Artifact 会退化为附件、日志、视图、归档包、运行材料或外部存储引用。 |
| 支撑 Artifact fact 作为正式事实入口成立 | 否则版本、血缘、基线、审查和消费都会失去统一锚点。 |
| 支撑 Artifact version 形成稳定且不可无声覆盖的版本事实 | 否则历史引用、替代关系、审查语境和基线成员都会漂移。 |
| 支撑 Artifact lineage 形成正式来源、影响、替代和依赖语境 | 否则 runtime trace、事件流或私有追溯链会补造多份血缘 truth。 |
| 支撑 Artifact baseline 形成受控版本集合事实 | 否则发布说明、治理裁决、项目状态或归档包会替代正式冻结集合。 |
| 支撑下游稳定消费且不迁移 Artifact truth ownership | 否则 SDK、console、workspace、archive、observability 或 sync 会形成第二份制品真相。 |
| 稳定区分 Artifact truth、快照摘要、外部引用和禁止保存正文 | 否则外部正文、运行材料、视图材料、事件材料和消费副本会污染本仓 truth。 |
| 允许相邻仓通过引用、摘要、事件协作、运行期边界和消费回指协作 | 否则 Artifact 要么吸收相邻仓 truth,要么无法被相邻仓稳定消费。 |
| 守住写路径、读路径、维护路径和归档准备路径的真相边界 | 否则查询、projection、report、reconciliation 或维护任务会成为隐藏业务写源。 |

### 8.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不将附件、日志、workspace 视图、archive package、observability record 或运行材料视为 Artifact fact truth | 否则正式事实入口会被派生材料替代。 |
| 不允许新内容、候选修订、自动化再生成或下游状态无声覆盖 Artifact version truth | 否则历史版本、审查责任和下游引用无法追溯。 |
| 不允许 runtime trace、tool result、model context、event stream、observability record 或私有链路补造 Artifact lineage truth | 否则血缘会脱离正式 fact / version 锚点。 |
| 不允许发布说明、治理裁决、项目状态、归档包或临时清单替代 Artifact baseline truth | 否则受控版本集合会漂移。 |
| 不允许 consumer、SDK、console、sync、workspace、report、archive 或 observability 拥有、复制、迁移、反推或反写 Artifact truth | 否则下游消费会变成第二 truth source。 |
| 不拥有 work、process、governance、conversation、workspace、archive、observability、method-library、runtime 或 capability-hub 的 truth | 否则 Artifact 会打穿相邻仓职责边界。 |
| 不拥有外部正文、运行材料正文、视图正文、事件正文、归档包正文、观测正文或消费方私有材料正文 | 否则 Artifact 会膨胀为外部正文总仓。 |
| 不允许 `L0-bus` 承载 Artifact body、version set、lineage graph、baseline members 或下游副本作为 truth | 否则事件协作会替代 truth 存储。 |
| 不允许除 `L0-core` 外形成编译期依赖 | 否则 L1 平权真相域会形成循环和强耦合。 |
| 不允许 query、projection、report、search、preview、reconciliation、archive preparation 或 maintenance 写业务 Artifact truth | 否则派生和维护能力会成为隐式写源。 |

### 8.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 搜索 / 浏览 / 列表发现 | 当前作为外围发现能力处理,不纳入核心 truth 成立前置。 |
| Artifact / lineage / baseline 预览 | 当前作为消费增强处理,只围绕正式 truth 摘要或展示。 |
| Projection / read model / report | 当前作为派生读侧处理,允许滞后、重建和降级,不得反写 truth。 |
| 通知 / 事件感知 | 当前作为变化协作增强处理,事件只传递变化线索。 |
| 归档消费友好输出 | 当前作为 archive 下游消费边界处理,归档材料不替代 Artifact truth。 |
| 观测 / 审计消费友好输出 | 当前作为 observability 消费边界处理,观测记录不形成本仓 truth。 |
| SDK / console / sync 友好输出 | 当前作为访问与同步体验处理,不迁移 ownership。 |
| content storage、hash、tamper 和完整性校验机制 | 当前作为后续技术选型、配置和测试输入,不在 Step 2 固化。 |
| 旧性能、容量和枚举数字 | 当前作为候选 SLO / 容量 / 详细设计输入,不写成已验证硬指标。 |

### 8.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Work 项目 / 工作项 / 迭代架构 | Project、WorkItem、Iteration、dependency、blocker 和工作状态 truth 属于 `L1-work`。 |
| 不设计 Process 执行架构 | ProcessTemplate、ProcessInstance、Activity、checkpoint 和 recovery truth 属于 `L1-process`。 |
| 不设计 Governance 裁决与控制架构 | Gate decision、Policy、AIIA / SoA 治理结论和 Nonconformity 属于 `L1-governance`。 |
| 不设计 Conversation 显化和 review UI 架构 | conversation space、turn、review discussion 和 artifact preview 展示状态属于 `L1-conversation` / 产品入口。 |
| 不设计 Workspace / Console 聚合 UI 架构 | workspace 聚合视图、筛选状态、UI 布局和 console 展示状态属于产品入口。 |
| 不设计 Observability 物理审计存储架构 | audit log store、trace storage、metrics 和 alert stream 属于 `L4-observability`。 |
| 不设计 Archive package 与恢复编排架构 | 归档包、长期保留策略、恢复编排和跨域快照包属于 `L4-archive`。 |
| 不设计 Method Library 定义架构 | MethodContent、WorkProductDefinition、Artifact kind 定义来源和标准正文属于 `L3-method-library` 等定义域。 |
| 不设计 Runtime / Capability 执行架构 | runtime 执行、工具调用、模型上下文、policy cache 和 capability registration 属于运行与能力层。 |
| 不在架构目标层定义 API / DTO / 状态机 / 数据库表 / 存储后端 | 这些属于概要、详细、配置、测试或实施阶段。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论。

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“设计取舍”小节,了解本章如何把需求闭环转译为架构目标。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §8.1 业务背景结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §8.2 驱动力结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §8.3 架构目标表。
```

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构硬约束结论”“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”小节,了解本章约束如何从需求边界和架构目标收敛而来。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §8.4 不可变约束表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §8.5 当前阶段可接受取舍表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §8.6 架构非目标表。
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。已知待确认项沿用 Step 1 的风险清单,后续分别在职责边界、系统上下文、数据所有权、技术选型、演进路线和风险章节承接。

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| Q-ART-ARCH-002-001 | 旧性能、容量、hash 和 tamper 数字是否升级为正式测试目标 | 当前作为候选 SLO / 容量 / 测试输入,后续测试方案和容量验证阶段决定。 |
| Q-ART-ARCH-002-002 | Artifact kind、identity key、classification 和 definition source 如何承载 | 当前不在 Step 2 定稿,后续概要 / 详细设计闭口。 |
| Q-ART-ARCH-002-003 | content storage、hash、integrity 和 tamper 检测机制是否进入主链 | 当前只保留 truth / 外部正文 / 完整性边界,后续技术选型和配置决定。 |
| Q-ART-ARCH-002-004 | projection、search、preview、sync 和 report 的正式 read surface | 当前作为外围增强和消费边界处理,后续交互、技术选型和详细设计收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确架构必须确保什么成立 | pass | §8.3 已输出结构性架构目标。 |
| 是否明确不可变约束 | pass | §8.4 覆盖 fact、version、lineage、baseline、consumption、external body、dependency 和派生路径边界。 |
| 是否明确当前阶段可接受取舍 | pass | §8.5 将外围增强和旧指标降为取舍 / 候选输入。 |
| 是否明确架构非目标 | pass | §8.6 按相邻仓和后续文档职责排除。 |
| 是否提前进入系统上下文图、容器、部署、技术选型、DTO、状态机或数据库 | pass | 本步只输出目标与约束。 |
| 是否允许进入 Step 3 | pass | 当前目标、约束、取舍和非目标足以支撑职责边界讨论。 |

当前 Step 2 `明确架构目标与约束` 已完成。下一步必须等待用户确认后进入 Step 3 `职责边界`,并只创建 / 改写 `design-calibration/01_arch_step_03_responsibility_boundary.md`。
