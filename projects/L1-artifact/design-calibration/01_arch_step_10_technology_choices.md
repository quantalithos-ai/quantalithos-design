# Step 10. 关键技术选型

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 回填章节: `01-架构设计.md` §11 关键技术选型
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-artifact` 当前架构主线中哪些技术机制、架构手段或治理方式已经上升为架构层决定,分别解决什么结构问题、为什么当前采用、带来什么代价或约束。

本步不写技术栈清单、产品名、框架名、协议选型、数据库选型、队列产品、缓存产品、搜索产品、对象存储产品、content backend、hash 算法、接口路径、事件名、DTO、schema、表结构、索引、P95 指标、部署参数、worker 名称或代码对象。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载、派生承载和外部正文边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供核心保护、外部接缝、依赖倒置、跨仓裁剪和禁止反向依赖。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供正式真相、快照 / 投影、引用、不拥有正文和一致性口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台延后承接判断和失败降级口径。 |
| `projects/L1-artifact/00-需求文档.md` §12 / §13 / §15 | 已重建 | 提供接口依赖边界、NFR、风险和后续待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 10 | 已读取 | 控制本步必须输出机制、理由、代价和不采用口径。 |
| `standards/document/架构设计书写规范.md` §4.11 | 已读取 | 控制关键技术机制表的粒度、正反例和禁写范围。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §9 | 旧 Draft | 作为旧 metadata-first、content_ref、recursive CTE、hash scan 和后端方案混写问题诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_10_technology_choices.md` | 已参考 | 只参考“机制级选型 + 不采用口径”的组织方式,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 2 / 6 / 7 / 8 / 9、SOP Step 10 和书写规范 4.11 | done | 本文件 §2 |
| 读取需求 NFR / 风险、旧架构选型段和 L1-governance Step 10 框架 | done | 本文件 §2 / §5 |
| 回答当前采用机制、解决问题、为什么不用其他方案、代价和暂不引入口径 | done | 本文件 §4 |
| 输出关键技术机制表、当前不采用口径表和技术边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 10 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 当前采用哪些关键架构机制?

当前正式采用的关键机制是:

1. 通过正式承接边界隔离外部输入与 Artifact 核心语义。
2. 通过运行期接缝、引用、快照、safe summary 和事件协作承接非 `L0-core` sibling 仓。
3. 采用 Artifact truth / external reference / snapshot / derived separation。
4. Artifact 核心真相内部强一致,外部快照、下游消费、派生、报告、对账、归档和观测交接最终一致。
5. 同步核心 Artifact truth 判断、异步外部结果送达和事实传播、后台派生 / 对账 / 交接三类路径分离。
6. Artifact 正文 / 内容事实语境与外部正文生命周期分离。
7. Version / lineage / baseline 锚定正式 Artifact fact / version,不由 current latest、trace、event stream 或 archive package 反推。
8. 采用只读派生视图 / search / preview / report / reconciliation 承接下游消费和维护解释。
9. 异步输入、自动化产出、重复纳管、事件重放和消费状态采用幂等与顺序保护。
10. 关键 Artifact truth 变化、消费、报告、对账、观测和归档准备采用 traceability / audit backref / handoff 记录机制。
11. 具体语言、数据库、消息产品、内容后端、搜索、hash、完整性扫描、outbox、worker 和性能数字暂不作为架构硬选型。

这些都是机制级架构选择,不是产品或实现清单。

### 4.2 每个机制解决什么问题?

这些机制分别解决外部来源打穿 Artifact 核心、相邻仓 truth 漂移、外部正文入仓、派生结果反写真相、下游消费阻塞主链、runtime trace / tool result / event stream 补造 lineage、current latest 覆盖历史版本、archive package 替代 baseline、重复输入产生重复 truth、关键变化不可追溯和旧技术假设污染新版架构等结构性问题。

### 4.3 为什么不用其他方案?

不采用“外部入口直接写 Artifact 核心”,因为会让 work、process、governance、method、runtime、capability、conversation、workspace、archive、observability、console 或 sync 反向定义制品事实。

不采用“直接依赖相邻仓源码”,因为会破坏 `L0-core` 唯一编译期依赖和 L1 平权真相域边界。

不采用“复制外部正文 / runtime material / method definition / observability record / archive package”,因为会让 Artifact 接管不属于自己的正文和生命周期。

不采用“search / preview / report / projection / sync copy 反写 Artifact truth”,因为派生和消费系统会成为第二 truth。

不采用“所有 Artifact 变化同步完成”或“所有 Artifact 变化异步化”,因为 fact、version、lineage、baseline 和 consumption backref 需要同步成立 / 拒绝口径,事实传播、派生、报告、归档、观测和同步交接又不应阻塞核心 truth。

### 4.4 每个选型带来什么代价或新风险?

这些机制共同带来的代价是:边界层更多、状态表达更严格、引用和快照状态需要显式维护、异步传播和交接需要可追踪、search / preview / report / reconciliation 需要 stale / rebuilding / failed 语义、外部正文和内容事实语境需要持续区分、后续详细设计必须持续防止实现层绕过正文边界、依赖边界和派生反写边界。

它们降低了 Artifact truth 被污染的风险,但提高了对象状态、承接规则、追溯材料、对账解释和运维可见性的设计成本。

### 4.5 哪些选型是当前阶段必要的,哪些暂不引入?

| 类别 | 当前口径 |
|---|---|
| 当前阶段必要 | 正式承接边界、依赖倒置、truth / reference / snapshot / derived separation、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、外部正文引用与 Artifact 内容事实语境分离、version / lineage / baseline 正式锚定、只读派生消费、幂等 / 顺序保护、traceability / audit backref / handoff |
| 当前阶段暂不硬化 | 具体语言栈、数据库产品、消息产品、对象存储、Git / S3 / URL / inline 后端、搜索 / 向量产品、hash 算法、完整性扫描频率、outbox / relay / worker 机制、完整事件溯源方案、具体 API / event / job 协议、旧 P95 / SLA / 容量数字 |

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `metadata-first + content_ref` | 同时混入对象建模、内容存储策略和技术后端路线,未先说明 Artifact truth 与外部正文边界。 | 改为 Artifact truth / external reference / content fact context separation;产品和字段后置。 |
| `PostgreSQL recursive CTE` | 直接选择查询实现和数据库能力,属于详细设计 / 技术实现粒度。 | 改为 lineage 锚定正式 fact / version 和只读派生 / 对账机制;查询实现后置。 |
| `每日扫描 + approve 时 hash 校验` | 提前锁定完整性机制、扫描频率和审核时机。 | 改为完整性候选检查、外部正文引用和追溯解释机制;hash / scan 后置。 |
| `全量 DB / Git-only / graph DB / realtime watcher` | 已进入备选方案横评和产品实现选择。 | 留给 Step 11 或后续概要 / 详细设计,本步只锁架构机制。 |
| 旧 P95、容量、hash 耗时和 tampered 覆盖率 | 当前缺新版负载模型和验证依据。 | 作为候选 SLO 和后续测试输入,不写成本步架构硬选型。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 选型主语 | metadata、content_ref、PostgreSQL CTE、hash scan、后端 adapter | 架构层技术机制 / 架构手段 | Step 10 只锁影响边界、一致性和交互主链的机制。 |
| 外部正文 | content backend 与 Artifact 选型混写 | Artifact 内容事实语境与外部正文生命周期分离 | 防止外部正文和后端成为 truth owner。 |
| Lineage | 查询技术优先 | 血缘 truth 锚定正式 fact / version,查询与派生后置 | 防止实现查询图替代正式血缘。 |
| Baseline / version | pin、hash、current latest 倾向混入 | 受控版本集合和历史版本强一致,实现机制后置 | 防止历史事实被无声覆盖。 |
| 派生消费 | 搜索、预览、report 和对账未形成机制级边界 | 只读派生 + 最终一致 + 不反写 | 防止第二 truth。 |
| 技术产品 | 旧产品和性能数字直接进入架构 | 产品、协议、指标延后 | 保护新版架构真相源。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接继承旧 metadata-first、content_ref、PostgreSQL、hash scan 和后端 adapter | 看起来实施路径明确。 | 过早锁定对象 / 存储 / 查询 / 完整性实现,且可能让技术后端反向定义 Artifact truth。 | 不采用。 |
| 方案 B: 按架构机制说明解决的问题、采用理由和代价 | 能承接职责、依赖、数据和通信结论。 | 后续概要 / 详细设计还需落到具体实现。 | 采用。 |
| 方案 C: 当前强制完整事件溯源、图数据库、对象存储和实时完整性监听 | 审计和查询能力想象完整。 | 当前缺必要性证明,会显著抬高 P0 复杂度并提前决定持久化模型。 | 不采用。 |
| 方案 D: 不写关键技术机制,全部留到详细设计 | 避免过早承诺。 | 后续设计缺少机制级红线,容易反复串仓。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 是否当前锁定具体数据库、内容后端、搜索或消息产品 | A. 直接锁定;B. 不锁产品,只锁承载角色和机制 | B | 当前缺产品级输入和实施约束,且产品不能反向定义制品真相。 |
| 是否当前选择具体 hash / content-addressing / tamper 检测机制 | A. 锁定;B. 不锁,只确认完整性候选和外部正文边界 | B | 完整性机制必须服务 truth 边界,不能先于内容事实语境闭口。 |
| 是否把完整事件溯源作为当前必选 | A. 必选;B. 暂不必选,只确认追溯、事件协作和 handoff 机制 | B | Artifact 需要可追溯,但完整 ES 持久化模型需要后续取舍。 |
| 是否继承旧 P95 / SLA / 容量数字作为架构硬约束 | A. 继承;B. 不继承,后续由测试 / 验收验证 | B | 当前缺正式负载模型和测量来源。 |

---

## 8. 结构化中间产物

### 8.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 通过正式承接边界隔离外部输入与 Artifact 核心语义 | 防止相邻仓、运行层、横切系统、产品入口或外部内容来源直接打穿制品事实。 | Artifact 同时面对 work、process、governance、method、runtime、capability、conversation、workspace、archive、observability、SDK、console 和 sync;若不隔离会迅速串仓。 | 增加承接层判断、输入状态、拒绝 / pending 口径和测试成本。 | 该机制决定外部能力如何进入核心边界,属于架构层结构性决定。 |
| 通过运行期接缝、引用、快照、safe summary 和事件协作承接非 core sibling 仓 | 防止相邻仓源码和外部 truth 进入 Artifact 编译期依赖。 | `L0-core` 是唯一编译期依赖,其它仓只能以 ref、snapshot、summary、event 或 handoff 协作。 | 增加解析、快照刷新、不可解析状态和适配成本。 | 该机制直接保护跨仓依赖裁剪。 |
| Artifact truth / external reference / snapshot / derived separation | 防止正式制品事实、外部正文、外部生命周期、消费视图和维护材料混为一体。 | Step 8 已确认 Artifact 只拥有 fact、content fact context、version、lineage、baseline 和 consumption backref 等 truth。 | 需要为旧快照、未解析引用、过期视图和派生延迟提供显式状态。 | 该机制同时影响数据归属、一致性和后续对象建模。 |
| 核心强一致 + 外围最终一致 | 防止 fact、version、lineage、baseline 和 consumption backref 出现半成立状态,同时避免下游消费阻塞主链。 | 核心 truth 必须同步成立或拒绝;事实传播、派生、报告、对账、归档和观测交接可延迟。 | 需要解释 pending、failed、retryable、stale、rebuilding 和 unavailable 状态。 | 该机制定义制品事实和消费状态如何成立。 |
| 同步 / 异步 / 后台三类路径分离 | 防止外部结果和派生维护阻塞主路径,也防止后台任务隐式推进业务事实。 | Step 9 已确认三类通信方式分别服务即时判断、事实传播 / 结果送达和派生维护。 | 增加状态可见性、延迟解释和运行承载分工。 | 该机制决定关键交互如何承接,属于架构层通信结构。 |
| Artifact 正文 / 内容事实语境与外部正文生命周期分离 | 防止 Git、S3、URL、DB、对象存储或运行材料成为 Artifact truth owner。 | Artifact 需要说明正式内容事实语境,但外部正文和后端生命周期不归本仓。 | 需要持续区分内容事实、外部正文引用、来源摘要和完整性线索。 | 该机制保护正文 ownership 边界,避免 content backend 反向定义业务语义。 |
| Version / lineage / baseline 正式锚定机制 | 防止 current latest、runtime trace、tool result、event stream、release note 或 archive package 替代正式版本、血缘或基线。 | Step 8 已确认 version、lineage 和 baseline 必须围绕正式 fact / version 成立。 | 需要处理候选、替代、历史、未解析关系和成员不可冻结等状态。 | 该机制保护历史事实、来源解释和受控版本集合。 |
| 只读派生视图 / search / preview / report / reconciliation 承接消费和维护解释 | 防止 workspace、console、sync、report、search 或 preview 直接依赖核心结构或反写真相。 | 下游需要稳定消费、发现、预览、报表和对账,但核心模型不能被展示和聚合需求绑定。 | 增加派生滞后、重建、对账异常和延迟解释成本。 | 该机制影响运行承载、数据所有权和通信方式。 |
| 幂等与顺序保护 | 防止重复纳管、自动化重放、重复事件、乱序反馈或重复消费产生重复 Artifact truth 或状态回退。 | Artifact 需要承接多入口同步请求、自动化产出、事件协作和外部结果送达,这些输入天然可能重复、乱序或延迟。 | 需要稳定业务身份、顺序依据、重复识别依据和冲突口径。 | 该机制保护制品事实唯一性和下游一致消费。 |
| traceability / audit backref / handoff 记录机制 | 防止关键 Artifact 变化、消费、报告、对账、观测和归档准备不可解释。 | 制品事实必须回答来源、版本、血缘、基线、消费对象、交接状态和审计回指。 | 增加追溯材料维护成本,且不能把外部正文顺带存入 Artifact。 | 该机制支撑审计、复盘、观测解释和归档恢复。 |
| 产品 / 语言 / 框架 / 指标硬选型延后 | 防止旧 Draft 技术假设未经论证进入正式架构。 | 当前架构已能确定承载角色和机制,但尚缺产品级输入、负载模型和实施约束。 | 后续仍需在概要 / 详细 / 配置 / 测试 / 实施阶段补齐产品选择和指标验证。 | 该机制本质是架构治理手段,用于保护真相源闭环。 |

### 8.2 当前不采用口径表

| 不采用口径 | 不采用原因 | 正确落点 |
|---|---|---|
| 具体数据库产品作为当前关键选型 | 产品选择属于实现承载,当前只需锁定真相承载、派生承载和一致性机制。 | 概要设计、详细设计或实施计划 |
| Git / S3 / URL / inline / object store 作为当前硬选型 | 这是外部正文来源或内容后端选择,不能定义 Artifact truth。 | 配置设计、详细设计或实施计划 |
| `metadata-first + content_ref` 作为当前对象 / 存储方案 | 该口径混合了对象模型、字段设计和内容存储策略。 | 概要设计 / 详细设计 |
| recursive CTE / graph engine 作为当前 lineage 选型 | 这是查询实现方案,不是血缘 truth 归属和锚定机制。 | Step 11 备选方案或详细设计 |
| hash 算法、扫描频率、tamper event 作为当前硬选型 | 当前只需要完整性候选和外部正文边界,不锁实现机制。 | 配置设计、测试方案或详细设计 |
| 具体消息中间件、topic、outbox worker 或 consumer group 作为当前选型 | 这是事件协作实现细节,不是本章机制级结论。 | 详细设计、测试方案或实施计划 |
| search / vector / report / dashboard 产品作为当前选型 | 派生消费和报告是机制,具体产品后续再选。 | 概要设计、详细设计或配置设计 |
| archive package 或 observability store 作为 Artifact truth | 会让横切系统成为第二 truth。 | 追溯交接、归档消费和观测解释边界 |
| 完整事件溯源作为当前必选 | Artifact 需要追溯和事件协作,但不等于必须当前采用完整 ES 持久化模型。 | Step 11 备选方案与取舍 |
| 旧 P95 / SLA / 容量数字作为本步硬选型 | 当前缺新版需求基线下的正式负载模型和验证依据。 | 测试方案、验收标准或容量验证 |
| 除 `L0-core` 之外的编译期仓依赖 | 会破坏 L1 平权真相域和全局依赖裁剪规则。 | 运行期边界、事件协作、SDK 或 adapter |

### 8.3 技术边界说明

本章采用的是机制级技术选型,不是产品清单或实现方案。`L1-artifact` 当前最需要被显式固定的是制品事实如何避免被外部正文、运行材料、派生视图、归档包、观测记录、sync 私有副本和旧技术后端污染,因此正式承接边界、依赖倒置、数据分层、核心强一致、外围最终一致、同步 / 异步 / 后台分离、外部正文引用分离、正式锚定、只读派生、幂等顺序和追溯交接都进入架构主线。具体数据库、消息产品、对象存储、Git / S3 / URL、搜索、hash、完整性扫描、outbox、协议、P95 和容量数值只有在不反向改变这些机制的前提下,才可以在后续概要 / 详细设计、配置设计、测试方案和实施计划中继续选择。若后续技术实现与本章机制冲突,应以本章机制为架构真相源。

---

## 9. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §11 “关键技术选型”直接摘录并整理本文件 §8.1、§8.2 和 §8.3。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 10. 待确认事项

### 10.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把具体数据库、消息、缓存、搜索、内容后端或报告产品作为当前架构硬选型 | A. 直接锁定;B. 不锁产品,只锁承载角色和机制 | B | 当前缺产品级输入和实施约束,且产品不能反向定义制品真相。 | 已确认采用 B |
| 是否当前锁定具体 hash / integrity / tamper 机制 | A. 锁定;B. 不锁,只确认完整性候选和外部正文边界 | B | 完整性工具不能先于 truth ownership 和内容事实语境闭口。 | 已确认采用 B |
| 是否把完整事件溯源作为当前必选 | A. 必选;B. 暂不必选,只确认追溯、事件协作和 handoff 机制 | B | Artifact 需要可追溯,但完整 ES 持久化模型需要后续取舍。 | 已确认采用 B |
| 是否继承旧 P95 / SLA / 容量数字作为架构硬约束 | A. 继承;B. 不继承,后续由测试 / 验收验证 | B | 当前缺正式负载模型和测量来源。 | 已确认采用 B |
| 是否允许除 `L0-core` 外引入编译期仓依赖 | A. 允许;B. 不允许,一律通过运行期 / 事件协作 / adapter / SDK 边界 | B | 对齐 Step 7 和全局依赖裁剪规则。 | 已确认采用 B |

### 10.2 本 Step 未确认事项

本步不新增阻塞 Step 11 的待确认事项。具体数据库、消息后端、对象存储、Git / S3 / URL / inline 后端、搜索、向量、hash、完整性扫描、tamper 语义、outbox、consumer、协议、P95、容量数值和代码组织留到后续概要 / 详细设计、配置设计、测试方案和实施计划继续收敛。

---

## 11. 进入下一步条件

- 已明确当前进入架构主线的关键技术机制。
- 已说明每项机制解决的问题、采用理由、代价 / 约束和架构层意义。
- 已明确当前不采用的相邻技术口径。
- 已明确旧技术假设和旧性能数字不直接继承为架构硬选型。
- 未写技术栈清单、产品横向对比、接口协议、实现机制、部署环境细节或性能硬指标。
- 可以进入 Step 11 `备选方案与取舍`。
