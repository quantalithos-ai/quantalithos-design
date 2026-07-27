# L3-capability-hub 01 架构 Step 10: 关键技术选型

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 回填章节: `01-架构设计.md` §11 关键技术选型
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、架构 Step 2 / 6 / 7 / 8 / 9 和需求 Step 10 / 12 / 13 / 15 重新推导机制级技术选型;旧 `01-架构设计.md` §2 / §3 / §6 / §8 / §9 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 关键技术选型 |
| 输出文件 | `design-calibration/01_arch_step_10_technology_choices.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 10;`架构设计书写规范.md` §4.11 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md`;`00_req_step_16_traceability_matrix.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §2 / §3 / §6 / §8 / §9 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 10;`L3-method-library` Step 10;`L0-sdk` Step 10 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 9 进入 Step 10 |
| next_allowed_action | Step 10 已完成,等待用户确认后进入 Step 11。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入架构机制识别思考。 |
| 架构机制识别:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入架构机制识别写入。 |
| 架构机制识别:再写入 | done | 关键技术机制表 | pass | 进入技术边界判断思考。 |
| 技术边界判断:先思考 | done | 进入 / 不进入本章的判断 | pass | 进入技术边界判断写入。 |
| 技术边界判断:再写入 | done | 技术边界说明 / 简化对照表 | pass | 进入机制代价与约束思考。 |
| 机制代价与约束:先思考 | done | 代价、约束和后续承接风险 | pass | 进入机制代价与约束写入。 |
| 机制代价与约束:再写入 | done | 机制代价停审表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §11 候选文本 | pass | 进入 blocker 判定与自检。 |
| Blocker 判定与自检 | done | blocker 表 / 自检表 / 下一步门禁 | pass | 等待用户确认 Step 11。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 10 必须回答当前采用哪些关键架构机制、每个机制解决什么问题、为什么采用、代价是什么、哪些暂不引入。 | 本 Step 只收稳“机制级技术选型”,不展开完整备选路径比较,不进入 Step 11 的方案取舍。 |
| `standards/document/架构设计书写规范.md` §4.11 | 关键技术选型指已上升为架构层决定的技术机制 / 架构手段,不是技术栈清单、产品名、协议、部署或实现说明。 | 输出主表必须包含技术机制、解决的问题、采用理由、代价 / 约束、说明;每项机制必须解释为什么不是局部实现细节。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,并保留恢复门禁、结构化产物、回填草稿和自检。 | 本文件保留过程判断和停审状态;正式 `01` 暂不回填。 |
| `设计文档编写通则.md` | 架构设计先边界后实现,正式文档只承载收口结论。 | 本 Step 不把产品栈、接口、DTO、状态、表、repository、handler、worker、测试证据或 implementation boundary 写成架构机制。 |
| `设计真相源闭环与可落码性标准.md` | 技术机制不得让实现端私造 schema、port、state、mapper、config key、artifact 或 evidence schema。 | Step 10 只能锁定机制边界和后续承接责任,不能借选型补详细设计缺口。 |
| `全局项目依赖关系与裁剪规则.md` | 只有编译期依赖可以进入 package dependency;运行期和事件协作不得写成源码依赖。 | 本 Step 可确认共享契约 / 运行期 / 事件协作 / ref / summary / controlled view 机制,但不能把 `L0-bus`、governance、runtime、tools、SDK 或 external provider 写成源码依赖。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 架构目标要求独立 access truth、identity / registry、adapter descriptor、governance seam、method relation、formal exposure / consumer view 分层、变化追溯、外围隔离和跨仓协作。 | 技术机制必须服务这些结构性目标,不能只因常见、熟悉或历史已有而进入。 |
| `01_arch_step_06_container_deployment.md` | 运行承载已分为同步入口、异步协作、后台维护与派生、access truth 承载、受控消费 / 追溯派生承载和外部运行边界,并允许 P0 阶段同部署但逻辑可分。 | 逻辑可分承载、truth / 派生承载分层和同步 / 异步 / 后台节奏可作为机制级选型来源。 |
| `01_arch_step_07_dependency_direction.md` | `L0-core` 是唯一编译期依赖候选;其他关系通过运行期、事件协作、ref、safe summary、body-free relation、controlled view 或 consumer boundary 进入。 | 正式承接、依赖倒置、共享契约基线和禁止源码串仓必须上升为机制级约束。 |
| `01_arch_step_08_data_ownership_consistency.md` | 本仓拥有 capability access truth;快照 / 投影、引用关系和 forbidden body 明确分层;核心 truth 强一致,派生最终一致,引用要求有效性一致。 | truth / snapshot / ref / forbidden body 分层、核心强一致 + 派生最终一致、引用 / 摘要优先和 forbidden body 边界都是关键机制来源。 |
| `01_arch_step_09_interactions_communication.md` | 同步用于核心 truth 裁定和读取;异步用于已成立事实传播、外部结果送达和下游影响回报;后台用于派生、对账、导出、候选发现、审计交接和引用刷新。 | 同步 / 异步 / 后台三类路径分离、异步最终一致传播和后台延后承接可进入 Step 10。 |
| `00_req_step_10_business_rules_boundaries.md` | 规则已钉住 identity、registry、descriptor、seam、relation、exposure、显式变化、禁止正文、派生反写和相邻仓边界。 | 技术机制必须保护这些不变量,尤其是 descriptor 不膨胀、consumer view 不反写、governance / method 不串仓。 |
| `00_req_step_12_interfaces_dependencies.md` | 能力级接口包含变更、查询、事件输出、事件输入和后台任务,但禁止提前写 API / DTO / event schema。 | Step 10 可以承接接口能力类型,不得写具体接口、事件目录、topic、payload、callback 或 job 名。 |
| `00_req_step_13_non_functional_requirements.md` | 核心闭环不被外围增强拖垮;truth 完整性优先;禁止正文;边界异常和派生滞后可解释;关键变化可追溯。 | 核心与外围隔离、可解释失败 / stale / unresolved 语义、追溯 / handoff 机制可进入架构机制。 |
| `00_req_step_15_risks_open_questions.md` | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / evidence / boundary 等仍未闭口。 | 本 Step 不得借机制选型关闭字段、状态、schema、protocol、transport、boundary 或证据格式。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §2 / §3 / §6 / §8 / §9 | historical material | 只审计旧 Rust / PostgreSQL / KMS / Vault / provider / QueryCapabilities / Cost Accounting / Policy refresh / P95 / 30s 等口径。 |
| `L1-governance` Step 10 | reference material | 参考“正式承接边界、truth / snapshot / ref 分层、同步 / 异步 / 后台分离、产品延后”的机制级写法。 |
| `L3-method-library` Step 10 | reference material | 参考 full-restart 下从 Step 6~9 推导机制、技术边界和旧材料差异审计的粒度。 |
| `L0-sdk` Step 10 | reference material | 参考“不把工具链 / 协议 / 包管理器当架构选型”的裁剪方式。 |

---

## 3. 整体模块骨架

Step 10 不回答“用什么产品实现”,而回答“哪些架构手段已经必须被保留下来”。本 Step 不重写运行承载、依赖方向、数据所有权或通信方式,只把这些已收敛结论中会影响后续设计的机制提升为技术选型基线。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 架构机制识别 | 哪些机制会影响系统结构、边界保护、一致性、关键交互承接、追溯和演进。 | 不写 Rust、数据库、缓存、消息产品、HTTP / RPC、provider adapter、outbox、KMS 或代码目录。 | 关键技术机制表。 |
| 技术边界判断 | 哪些看似技术相关的内容应留给后续概要 / 详细 / 配置 / 测试 / 实施。 | 不展开产品横评、技术栈清单、部署拓扑、性能参数、接口协议或实现算法。 | 技术边界说明、简化对照表。 |
| 机制代价与约束 | 每项机制引入什么复杂度、约束和后续承接责任。 | 不写只有收益没有代价的选型说明。 | 机制代价停审表。 |
| 旧材料差异审计 | 旧技术方向哪些可保留为机制线索,哪些必须废弃或挂起。 | 不继承旧 Draft 状态、旧技术栈、旧服务名、旧指标或旧详细设计对象。 | 差异审计表。 |
| 回填草稿 | Step 16 装配正式 §11 时可使用的候选文本。 | 不直接改正式 `01-架构设计.md`。 | 正式回填草稿。 |
| 自检与停审 | 本 Step 是否足以进入 Step 11。 | 不提前完成备选方案与取舍。 | 自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 10 completed_stop_review | pass | 关键技术机制表、技术边界说明、简化对照表、机制代价停审、旧材料审计、回填草稿、blocker 判定和自检均完成。 | `wait_user_review_to_step_11` |

---

## 5. 模块思考记录

### 5.1 架构机制识别:先思考

问题回答:

- 能进入本章的机制必须已经影响 `L3-capability-hub` 的结构边界、依赖裁剪、数据一致性、通信主线、追溯方式或演进隔离,而不能只是具体工具或产品选择。
- 当前最关键的机制是:正式承接边界隔离外部输入、依赖倒置与共享契约基线、access truth / snapshot / ref / forbidden body 分层、核心强一致 + 派生最终一致、同步 / 异步 / 后台三类路径分离、formal exposure 与 controlled consumer view 分层、adapter descriptor 与 provider runtime / secret / cost 分离、governance seam 与 method relation body-free 承接、引用 / 摘要优先、追溯 / impact / handoff 可解释、核心闭环与外围增强隔离、逻辑可分运行承载。
- 这些机制不是数据库、消息、协议或代码结构,而是后续概要、详细、配置、测试和实施都必须服从的架构手段。
- 当前不固定 PostgreSQL、cache、search、outbox、message broker、HTTP / RPC、provider adapter、KMS / Vault、cost worker、event envelope、consumer group、job scheduler 或部署环境。

诊断:

- 旧 `01` 把 Rust、PostgreSQL、KMS / Vault、providers、marketplace、QueryCapabilities P95、Policy 30s、CostRecord、未白名单拦截、provider failover / retry 和 cost accounting 混在架构选型与约束中,但它们多数是边界外职责、实现载体、旧指标或历史冲突。
- `outbox / cache / bus / PostgreSQL` 之类词语可能与异步传播、派生材料和 truth 承载方向有关,但当前 Step 10 只能保留机制语义,不能继承旧实现名。
- 如果本 Step 锁定 provider adapter、KMS、cost worker 或 policy cache,会绕过 Step 8 / Step 9 已确认的 forbidden body、运行期边界和 consumer view 分层。
- 如果本 Step 完全不写机制,后续概要 / 详细设计会缺少机制级红线,实现 agent 可能重新把 `QueryCapabilities`、Provider Contract、Cost、KMS 或 runtime gateway 当作缺口补上。

取舍:

- 采用机制级表达,不采用产品 / 技术栈清单。
- 机制必须可回指 Step 2 / 6 / 7 / 8 / 9 或需求规则 / NFR。
- 有历史价值的旧方向只可重裁为机制,例如“变化传播”重裁为异步最终一致传播,“读取消费”重裁为受控消费快照,“敏感边界”重裁为 secret ref / safe summary。
- 不把完整备选方案矩阵写在本 Step;路径级取舍留给 Step 11。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否解决架构层问题 | pass | 机制均影响边界、依赖、数据、一致性、交互、追溯或演进。 |
| 是否避免产品名和局部实现名 | pass | 未把 Rust、PG、cache、MQ、HTTP / RPC、KMS、outbox、provider adapter 等写成正式选型事实。 |
| 是否每项机制都有来源 | pass | 均可回指 Step 2 / 6 / 7 / 8 / 9 或需求规则 / NFR。 |
| 是否保留待确认项 | pass | governance seam 字段、method 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / boundary 未被机制提前闭口。 |
| 是否可进入“架构机制识别:再写入” | pass | 可形成关键技术机制表。 |

### 5.2 架构机制识别:再写入

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 通过正式承接边界隔离外部输入与核心 access truth | 防止外部 MCP / A2A / API 来源、governance、method、runtime / tools、SDK、console、marketplace、observability 或 secret 边界直接打穿 capability identity、registry、descriptor、seam、relation 和 exposure。 | Step 3~4 已确认本仓只拥有 access truth;Step 7 要求外部对象必须经正式边界、ref、safe summary、relation 或 controlled view 进入。 | 增加承接层判断、输入状态、拒绝 / pending / unresolved 口径和后续测试成本。 | 该机制改变外部事实如何进入核心边界,属于架构层结构性决定,不是某个 adapter 或 handler 实现。 |
| 采用依赖倒置与 `L0-core` 共享契约基线 | 防止本仓重新定义跨仓基础引用,或把 `L0-bus`、governance、runtime、tools、SDK、method-library、observability、marketplace、external provider 写成源码依赖。 | 全局依赖规则和 Step 7 均确认 `L0-core` 是唯一编译期依赖候选,其他关系必须通过运行期、事件协作、ref、summary 或消费边界承接。 | 后续设计必须处理 ref / summary 缺失、运行期不可用和事件协作延迟,不能用源码调用绕过。 | 该机制直接保护跨仓依赖裁剪和 truth ownership,不是 package manager 细节。 |
| capability access truth / snapshot / reference / forbidden body 分层 | 防止正式接入事实、受控消费视图、外部引用、安全摘要和明确禁止正文混成一份数据模型。 | Step 8 已确认本仓拥有 capability access truth,consumer view / safe summary / search / export 是派生或摘要,governance / method / secret / runtime / SDK / marketplace / observability 正文禁止入仓。 | 需要为派生滞后、引用不可解析、摘要缺失、正文误入和 forbidden 转化提供显式设计口径。 | 该机制影响后续对象划分、读取边界、一致性和测试,不是存储表设计。 |
| 核心 access truth 强一致 + 派生 / 交接最终一致 | 防止 identity、registry、descriptor、seam、relation 和 formal exposure 半成立,同时避免 search、export、consumer view、audit handoff 或 ecosystem discovery 阻塞核心 truth。 | Step 8 已确认核心 truth 内部强一致,truth 到派生视图 / safe summary / export / impact summary 最终一致,引用关系要求有效性一致。 | 增加 stale、rebuilding、unavailable、pending、failed、unresolved 等状态解释责任;后续不能把派生失败等同核心失败。 | 该机制决定真相成立和派生可用性的关系,属于一致性架构选型,不是事务或 retry 实现。 |
| 同步裁定 / 异步传播 / 后台延后承接三类路径分离 | 防止核心变更被异步化成未裁定事实,也防止派生维护、外部结果送达和下游影响回报被强压进同步入口。 | Step 9 已确认核心 truth 变更 / 读取走同步,已成立事实传播和外部结果送达走异步,派生、对账、导出、候选发现和审计交接走后台。 | 需要维护三类路径的失败语义和恢复责任;后续不得用一个统一接口或 worker 语义掩盖路径差异。 | 该机制影响关键交互主线和运行承载分工,不是 HTTP、RPC、topic 或 job scheduler 选择。 |
| formal exposure truth 与 controlled consumer view 分层 | 防止 `QueryCapabilities` 类旧口径、runtime allow / deny、Policy cache、SDK client、tools config 或 consumer view 反向定义服务端正式能力边界。 | Step 2 / Step 3 / Step 8 / Step 9 均确认 formal exposure 是本仓 truth,controlled consumer view 是由正式 truth 派生的快照。 | 下游可能看到短暂滞后或不可用视图;后续必须解释 stale / unavailable 而不能补造成 truth。 | 该机制保护服务端 exposure 与消费面演进空间,不是查询 API 命名或缓存策略。 |
| adapter descriptor 与 provider runtime / secret / cost 分离 | 防止 descriptor 膨胀为旧 Provider Contract,把 secret、quota、route、failover、retry、cost、provider runtime 或 invocation result 拉入本仓。 | 需求和 Step 3 / Step 8 明确 adapter descriptor 只表达接入方式、能力类型、风险和约束摘要;secret 只允许 ref / safe summary。 | 后续 descriptor 不足、secret ref 不可判定或 provider 信息缺失时必须挂起 / 拒绝,不能后台补造完整 contract。 | 该机制是接入描述边界的架构选型,不是 provider adapter 或 KMS 产品选型。 |
| governance seam 与 method body-free relation 承接 | 防止本仓越权拥有 governance approval / Policy / shared_rules truth,或复制 Method Content / TaskDefinition / AIPolicyDef / ProcessTemplateDef 正文。 | Step 3 / Step 5 / Step 7 / Step 8 / Step 9 已确认本仓只拥有 seam relation、access review separation fact 和 body-free method relation。 | 需要处理 governance ref、policy result ref、method asset ref 的不可解析、过期、类型不匹配和摘要不足。 | 该机制保护相邻 truth owner,不是 governance client、policy engine 或 method-library 源码依赖。 |
| 引用 / safe summary 优先而非复制外部正文 | 防止外部标准、协议、governance、method、secret、runtime、SDK、observability、marketplace 或 provider 正文进入本仓形成第二 truth。 | Step 8 已确认外部对象只可通过引用、allowed safe summary、body-free relation 或 derived summary 进入。 | 增加引用有效性检查、摘要缺失处理、外部不可用说明和禁止正文审计成本。 | 该机制横跨数据所有权、安全、审计和依赖方向,不是序列化格式或摘要字段细节。 |
| 追溯 / consumer impact / external handoff 可解释机制 | 防止 identity、registry、descriptor、seam、relation、exposure、派生维护、下游影响和审计交接变化不可解释。 | 需求 NFR 和 Step 8 / Step 9 要求关键变化可追溯、影响摘要可解释、外部交接不反写真相。 | 后续必须定义 traceability、impact、handoff 的来源、范围、失败、pending 和不可用口径,但不能保存外部正文。 | 该机制影响审计、复盘、下游感知和实施边界,不是 log / metric / audit store 产品选型。 |
| 核心闭环与外围增强隔离 | 防止管理入口、搜索 / 浏览、候选发现、安全摘要深化、SDK 说明、只读生态发现、审计导出、marketplace 和 observability 拖垮 C-CH-1~C-CH-5。 | Step 2 已确认外围增强不阻塞核心闭环;Step 4 / Step 5 / Step 8 / Step 9 均把外围对象放在候选、支撑、派生或本地影子边界。 | 后续演进必须说明外围何时进入、如何只读或派生、如何不反写核心 truth。 | 该机制影响阶段边界和演进路线,不是 UI、搜索引擎、导出格式或 marketplace API 选择。 |
| 逻辑可分运行承载 | 防止同步入口、异步协作、后台维护、access truth 承载和受控消费 / 追溯派生承载被实现成无法分辨失败节奏和职责边界的一团结构。 | Step 6 已确认 P0 可同部署但逻辑边界必须分离;Step 9 的三类路径需要不同承接节奏。 | 后续概要 / 实施可以阶段性同部署,但必须保持职责、状态、失败和扩展边界可分。 | 该机制影响运行承载、故障隔离和后续演进,不是进程、容器、K8s 或部署参数。 |

### 5.3 技术边界判断:先思考

问题回答:

- 当前不固定具体语言、数据库、消息产品、缓存、搜索、HTTP / RPC、GraphQL、provider adapter、outbox、consumer group、KMS / Vault、secret backend、cost worker、event envelope、schema version、job scheduler、部署环境、SLO 数字或容量指标。
- 当前可以说“核心 truth 与派生材料分层”,不能说“projection 表 / cache key / search index”;可以说“异步事实传播”,不能说“outbox + topic + payload”;可以说“secret ref / safe summary”,不能说“KMS / Vault 集成作为本仓核心选型”。
- 对旧材料中看似可用的实现词,必须先降级为架构机制或后续候选,否则会把历史 Provider Contract、QueryCapabilities、CostRecord 和 KMS 主线重新带回正式架构。
- 技术边界的核心判断是:如果某项选择只是为已确定机制挑选载体,它应进入 `02/03/04/07`;如果它会改变边界、依赖、一致性、通信或演进,才进入 Step 10。

诊断:

- 旧文档中的 `Rust / PostgreSQL / KMS/Vault / providers / marketplace / bus / QueryCapabilities / cost events / P95 / 30s` 混合了语言、产品、外部平台、旧接口、指标和边界外职责,不符合 §4.11 对机制级选型的要求。
- `L0-bus` 可作为事件协作边界,但消息产品、topic、event payload、outbox 和 consumer group 不是本 Step 选型。
- `secret ref / safe summary` 是机制,但 KMS / Vault truth、key rotate、credential lifecycle 不是本仓机制。
- `controlled consumer view` 是机制,但 runtime enforcement、allow / deny decision、SDK client 或旧 `QueryCapabilities` 不是本仓机制。

取舍:

- 使用“当前采用的机制 / 当前不采用或不固定的相邻思路 / 边界原因”说明 Step 10 边界。
- 对产品、协议、运行参数、实现机制统一后移,但保留它们必须服从的架构机制。
- 不把该对照表扩展成 Step 11 的完整备选方案比较。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否说明哪些不进入本章 | pass | 数据库、消息、缓存、搜索、协议、KMS、outbox、provider adapter、部署和指标均未固定。 |
| 是否避免产品横评 | pass | 未比较具体产品、框架或中间件。 |
| 是否保留后续承接位置 | pass | 产品载体和具体协议留到概要 / 详细 / 配置 / 测试 / 实施。 |
| 是否可进入“技术边界判断:再写入” | pass | 可形成边界说明和简化对照表。 |

### 5.4 技术边界判断:再写入

#### 5.4.1 技术边界说明

本章记录的是 capability access truth 架构必须长期服从的机制级技术选型,不是产品栈清单或实现方案。凡是会改变外部输入如何进入核心、相邻仓如何通过 ref / summary / relation 协作、核心 truth 如何成立、派生视图如何收敛、下游如何消费、外围如何隔离的机制,才进入 Step 10。数据库、消息、缓存、搜索、HTTP / RPC、outbox、KMS / Vault、provider adapter、event envelope、job scheduler、P95 / 30s 指标和部署环境都可以在后续文档继续选择,但不得反向改变本章机制。若后续实现载体要求保存 forbidden body、形成非 `L0-core` 编译期依赖、让 consumer view 反写 formal exposure 或让 governance / method / runtime truth 入仓,应判定为违反本章架构基线。

#### 5.4.2 简化对照表

| 当前采用的机制 | 当前不采用 / 不固定的相邻思路 | 边界原因 |
|---|---|---|
| 正式承接边界隔离外部输入 | 外部来源、governance、method、runtime、tools、SDK、marketplace 或 observability 直接读写核心 truth | 保护 capability access truth 不被外部正文、运行状态或消费需求污染。 |
| 依赖倒置与 `L0-core` 共享契约基线 | 除 `L0-core` 外的内部仓源码依赖;从 `L0-bus` 或下游仓引入业务类型 | 对齐全局依赖裁剪,防止运行期和事件协作关系升级为 package dependency。 |
| access truth / snapshot / reference / forbidden body 分层 | 一张统一数据模型承载 truth、consumer view、safe summary、ref 和外部正文 | 防止多真相源、正文入仓和派生反写。 |
| 核心强一致 + 派生最终一致 | 所有内容强同步完成后才算成功;或核心 truth 也最终一致半成立 | 同时保护核心 truth 完整性和派生 / 外围可用性隔离。 |
| 同步 / 异步 / 后台三类路径分离 | 所有交互都走同一种 API、事件或 worker 语义 | 保留核心裁定、事实传播和派生维护的不同失败节奏。 |
| formal exposure 与 controlled consumer view 分层 | `QueryCapabilities`、runtime allow / deny、Policy cache 或 SDK client 定义正式暴露 | 防止消费面反向定义服务端 truth。 |
| adapter descriptor 与 provider runtime / secret / cost 分离 | 旧 Provider Contract;provider adapter / KMS / cost worker 作为本仓核心选型 | 防止 descriptor 吸收 execution、credential、billing 和 provider orchestration。 |
| governance seam 与 method body-free relation | governance approval / Policy truth 入仓;method body 同步或源码依赖 | 保护 `L1-governance` 与 `L3-method-library` 的 truth ownership。 |
| 引用 / safe summary 优先 | 复制外部标准、协议、治理、方法、secret、runtime、SDK、marketplace、observability 正文 | 防止外部生命周期和正文归属转移到本仓。 |
| traceability / impact / handoff 可解释 | 用 log、metric、trace store、cost event 或 audit store 替代本仓业务追溯 | 区分业务接入事实追溯与横切观测 / 审计存储。 |
| 核心闭环与外围增强隔离 | console、search、candidate discovery、SDK docs、marketplace、observability 成为核心前置 | 避免外围体验和生态能力拖垮 C-CH-1~C-CH-5。 |
| 逻辑可分运行承载 | 同步入口、异步协作、后台维护、truth 和派生承载不可区分 | 保留后续拆分、故障解释和演进空间。 |

### 5.5 机制代价与约束:先思考

问题回答:

- 每项机制都引入后续设计成本:承接边界需要明确输入状态,数据分层需要处理 stale / unresolved,异步和后台路径需要恢复语义,ref / summary 需要有效性检查,formal exposure 分层需要解释消费视图滞后,descriptor 分离需要处理缺失风险,governance / method relation 需要处理相邻 ref 不可解析,追溯 / handoff 需要避免保存外部正文。
- 代价不是阻止采用机制的理由,而是说明这些机制已经足够重要,必须被后续 `02~07` 承接。
- 不能写“无明显代价”;每条机制至少要指出一个会落到后续概要、详细、测试或实施计划的约束。

诊断:

- 旧文档倾向把“统一入口、审计、安全、成本、低延迟”写成收益,但没有说明边界成本,导致后续实现会通过 KMS、CostRecord、policy cache 或 runtime gateway 私补。
- 如果代价只写“增加复杂度”,Step 11 不能据此比较备选路径,后续实施也无法识别哪些复杂度不可删。
- `core truth 强一致 + 派生最终一致`、`formal exposure / consumer view 分层`、`引用 / safe summary 优先` 的代价必须具体,否则实现端容易把 stale、unresolved、forbidden 简化成成功 / 失败二值。

取舍:

- 按机制逐项停审代价,不展开完整替代方案。
- 后续承接要求指向文档类型而不指定实现文件、类型、port 或 commit boundary。
- 明确未闭口项进入后续文档,不由 Step 10 直接关闭。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否每项机制都有代价 | pass | 主表和停审表均列出后续复杂度或约束。 |
| 是否代价具体 | pass | 代价指向承接状态、派生收敛、引用有效性、正文审计、追溯和外围演进。 |
| 是否未展开完整方案比较 | pass | 未做路径级替代方案矩阵,留给 Step 11。 |
| 是否可进入“机制代价与约束:再写入” | pass | 可形成机制代价停审表。 |

### 5.6 机制代价与约束:再写入

| 技术机制 | 代价是否显式 | 后续承接要求 | 停审结论 |
|---|---|---|---|
| 正式承接边界隔离外部输入 | 是 | `02/03/05/07` 需要定义承接对象、输入状态、拒绝 / pending / unresolved、测试切口和 implementation boundary。 | pass |
| 依赖倒置与 `L0-core` 共享契约基线 | 是 | `03/07` 必须复用共享契约和正式 ref / summary,禁止实现端私造跨仓基础类型或引入非 `L0-core` 源码依赖。 | pass |
| access truth / snapshot / reference / forbidden body 分层 | 是 | `02/03/05/06` 需要闭合对象、读取视图、引用关系、forbidden body 拒绝和验收否决。 | pass |
| 核心强一致 + 派生最终一致 | 是 | `03/05/07` 需要区分核心事务 / 变更、派生 stale / rebuilding / unavailable、引用 unresolved 和恢复计划。 | pass |
| 同步裁定 / 异步传播 / 后台延后承接三类路径分离 | 是 | `02/03/05/07` 需要分别定义同步 flow、异步消费 / 发布边界、后台维护边界和失败恢复切口。 | pass |
| formal exposure truth 与 controlled consumer view 分层 | 是 | `02/03/05/06` 需要定义 exposure truth、consumer view 来源、stale / unavailable 表达和禁止反写验收。 | pass |
| adapter descriptor 与 provider runtime / secret / cost 分离 | 是 | `02/03/04/05` 需要定义 descriptor 边界、secret ref / safe summary、provider runtime carve out 和 cost / billing 非职责测试。 | pass |
| governance seam 与 method body-free relation 承接 | 是 | `02/03/05` 需要定义 seam / relation 对象、ref 解析、summary 缺失、forbidden method body / governance truth 测试。 | pass |
| 引用 / safe summary 优先 | 是 | `03/05/06` 需要覆盖引用有效性、摘要缺失、外部不可用、forbidden body 拒绝和 redaction / safe summary 验收。 | pass |
| traceability / impact / handoff 可解释机制 | 是 | `02/03/05/07` 需要定义 traceability、impact summary、handoff marker / report、失败口径和观测 / audit 正文 carve out。 | pass |
| 核心闭环与外围增强隔离 | 是 | Step 13 / Step 14 / Step 15 以及 `02/07` 需要说明外围进入条件、阶段边界、风险和追溯。 | pass |
| 逻辑可分运行承载 | 是 | `02/07` 需要说明 P0 同部署与逻辑拆分的对应关系,并给实施边界保留同步 / 异步 / 后台分工。 | pass |

---

## 6. 旧材料差异审计

### 6.1 可保留为机制方向的旧材料

| 旧方向 | 审计结论 | 当前承接 |
|---|---|---|
| 统一能力入口 | 可保留为正式承接边界线索。 | 重裁为外部输入经正式承接进入 access truth,不表示 runtime / tools 必经执行网关。 |
| Registry / directory 管理 | 可保留为 capability registry truth 和派生目录维护线索。 | 重裁为 identity + registry + formal visibility / lifecycle,不继承 allowlist、runtime cache 或 marketplace listing。 |
| Policy / governance 联动 | 可保留为 governance seam 线索。 | 重裁为 governance result ref / safe summary / seam relation,不继承 approval execution、Policy cache、shared_rules 或 30s 刷新指标。 |
| 下游 Query / 消费能力 | 可保留为受控消费读取线索。 | 重裁为 formal exposure truth + controlled consumer view 派生,不继承 `QueryCapabilities` runtime allow / deny。 |
| 审计 / 追溯诉求 | 可保留为 traceability / impact / handoff 可解释机制。 | 重裁为本仓业务追溯和允许摘要,不继承 observability store、audit ledger、cost event 或 trace 正文。 |
| 外部 API / provider 接入 | 可保留为 adapter descriptor 和外部来源引用线索。 | 重裁为接入描述、风险 / 约束摘要和 external source ref,不继承 Provider Contract、provider runtime 或 invocation result。 |
| 敏感边界 | 可保留为 secret ref / safe summary 机制线索。 | 重裁为安全敏感边界引用,不继承 KMS / Vault truth、key rotation 或 secret lifecycle。 |

### 6.2 必须废弃或挂起的旧口径

| 旧口径 | 为什么不能在 Step 10 继承 | 后续处理 |
|---|---|---|
| Rust、PostgreSQL、cache、outbox、message broker 作为当前技术栈事实 | 这是产品 / 实现载体,当前缺新版对象、状态、读写面和实施约束;会把机制误写成实现方案。 | 后续 `02/03/04/07` 如需采用必须重新论证并服从本 Step 机制。 |
| KMS / Vault 作为本仓关键选型 | 本仓不拥有 secret 平台 truth、key lifecycle 或 secret 正文。 | 后续只允许 secret ref / safe summary / 配置边界;KMS / Vault 作为边界外系统候选审计。 |
| Provider Contract / provider service / provider failover / retry / routing / quota | 会把 adapter descriptor 变成 provider runtime 和 execution gateway。 | 保留 descriptor 机制,provider runtime 和执行策略留在 runtime / tools / provider adapter 边界。 |
| Cost Accounting / CostRecord / cost worker / cost event | cost / billing / finance ledger 是非职责,不是 capability access truth。 | 作为 historical conflict;若后续观测或财务需要,只能经外部摘要 / ref / event candidate 审计。 |
| QueryCapabilities / access decision service / allow-deny enforcement | 会让 controlled consumer view 反写 formal exposure 或变成 runtime decision truth。 | 重裁为受控消费视图读取和派生维护,不拥有 execution enforcement。 |
| Policy refresh、last-known-good、whitelist 30s 指标 | 会把 governance truth、runtime cache 或 SLA 直接写成本仓架构选型。 | 重裁为 governance result ref / safe summary / 异步送达;具体指标后续测试 / 验收重新定义。 |
| API path、RPC、event name、topic、consumer group、payload schema | 属于接口 / 协议 / 详细设计粒度。 | 后续 `03-详细设计.md` 和测试方案按正式机制闭口。 |
| P95 < 50ms、SLA 99.9%、MCP server 数、cost records/day | 当前缺新版负载模型和验证来源,且旧指标绑定旧 QueryCapabilities / Cost 主线。 | 后续 `05/06` 根据新版 NFR 和验收重新收敛。 |
| marketplace metadata publish / listing 同步 | marketplace listing、transaction、pricing、fulfillment 不是本仓 truth。 | 只保留只读生态发现 summary / ref 候选,进入外围增强或风险演进。 |
| observability audit store / log / trace / metric 正文 | 横切观测系统不拥有 capability access truth,本仓也不保存观测正文。 | 只保留 audit ref / safe summary / handoff 机制,正文归 `L4-observability` 或外部系统。 |

### 6.3 旧材料冲突结论

旧 `01-架构设计.md` 中与 Provider Contract、Cost Accounting、KMS / Vault、QueryCapabilities、Policy refresh、runtime whitelist、provider failover、PostgreSQL / cache / outbox、P95 / 30s 等相关的内容,均不得作为新版关键技术选型直接继承。它们只能在后续文档中作为 historical conflict 或候选实现载体重新论证;若与本 Step 的正式承接、依赖倒置、truth 分层、同步 / 异步 / 后台分离、forbidden body、consumer view 分层或外围隔离冲突,必须以本 Step 机制为准。

---

## 7. 回填草稿

> 注意: 以下只是在 Step 16 装配正式 `01-架构设计.md` 时可使用的 §11 候选文本。当前不得直接写入正式 `01-架构设计.md`。

### 7.1 关键技术选型

`L3-capability-hub` 当前采用的是机制级技术选型,不是具体产品栈或实现方案。本仓的关键机制包括:通过正式承接边界隔离外部输入与核心 access truth;采用依赖倒置与 `L0-core` 共享契约基线;按 capability access truth / snapshot / reference / forbidden body 分层组织数据;核心 access truth 强一致、派生和交接最终一致;同步裁定、异步传播、后台延后承接三类路径分离;formal exposure truth 与 controlled consumer view 分层;adapter descriptor 与 provider runtime / secret / cost 分离;governance seam 与 method body-free relation 承接;引用 / safe summary 优先;traceability / impact / handoff 可解释;核心闭环与外围增强隔离;运行承载逻辑可分。

正式 §11 可摘录本文件 §5.2 关键技术机制表、§5.4 技术边界说明、§5.4.2 简化对照表和 §5.6 机制代价停审表。正式文档中不得把 Rust、PostgreSQL、cache、outbox、message broker、HTTP / RPC、KMS / Vault、provider adapter、CostRecord、QueryCapabilities、event topic、payload schema、consumer group、P95、SLA 或部署环境写成当前架构硬选型。具体技术产品、协议、状态、schema、接口、事件、配置和实施 boundary 必须在后续 `02~07` 文档中继续闭口,且不得反向改变本 Step 机制。

---

## 8. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 Provider Contract / provider service 与当前 adapter descriptor 边界冲突 | historical_conflict_not_blocker | 旧口径会把 provider runtime、secret、quota、route、failover、retry、cost 和 invocation result 混入 descriptor。 | 已重裁为 adapter descriptor 与 provider runtime / secret / cost 分离机制。 |
| 旧 QueryCapabilities / access decision 与 formal exposure / consumer view 分层冲突 | historical_conflict_not_blocker | 旧口径会让 consumer view、runtime allow / deny 或 Policy cache 反写服务端 formal exposure。 | 已重裁为 formal exposure truth 与 controlled consumer view 分层机制。 |
| 旧 KMS / Vault / key rotate 与 secret ref / safe summary 边界冲突 | historical_conflict_not_blocker | 本仓不拥有 secret 平台 truth 或 secret 正文。 | 已重裁为引用 / safe summary 优先和 forbidden body 边界。 |
| 旧 Cost Accounting / CostRecord / cost worker 与本仓非职责冲突 | historical_conflict_not_blocker | cost / billing / finance ledger 不属于 capability access truth。 | 排除为 historical conflict;不进入 Step 10 机制。 |
| governance seam 字段未完全确定 | not_blocking_step_11 | Step 10 只确认 seam 机制和 ref / safe summary 边界,不需要字段闭口。 | 字段和 schema 后移 `02/03`,不得生成 governance truth。 |
| method relation 摘要粒度未完全确定 | not_blocking_step_11 | Step 10 只确认 body-free relation 机制,不需要摘要字段闭口。 | 摘要字段后移,method body 仍 forbidden。 |
| secret safe summary 粒度未完全确定 | not_blocking_step_11 | Step 10 只确认 safe summary 优先和 forbidden body 边界,不需要具体安全字段。 | 后续横切 / 详细设计细化允许摘要。 |
| SDK exposure 交接细节未完全确定 | not_blocking_step_11 | Step 10 已确认服务端 exposure 与 SDK client 分层,具体 SDK surface 后移。 | 后续只可通过 SDK exposure consumer ref / 服务端边界承接。 |

结论: 未发现阻塞 `01-架构设计.md` Step 11 的上游 blocker。

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确当前采用的关键技术机制 | pass | §5.2 覆盖正式承接、依赖倒置、数据分层、一致性、通信路径、exposure 分层、descriptor 分离、seam / relation、ref / summary、traceability、外围隔离和逻辑可分承载。 |
| 每项机制是否解决架构层问题 | pass | 每项均影响边界保护、依赖裁剪、数据所有权、一致性、交互承接、追溯或演进。 |
| 每项机制是否说明采用理由 | pass | 主表逐项回指 Step 2 / 6 / 7 / 8 / 9 或需求规则 / NFR。 |
| 每项机制是否说明代价 / 约束 | pass | 主表和 §5.6 均给出后续承接成本和文档落点。 |
| 是否说明为什么不是局部实现细节 | pass | 主表说明列和 §5.4 技术边界说明已完成。 |
| 是否避免技术栈清单 | pass | 未将 Rust、PostgreSQL、cache、message broker、HTTP / RPC、KMS、outbox、provider adapter 等写成正式选型。 |
| 是否避免产品横向对比 | pass | 未做 Kafka / RabbitMQ、Postgres / MySQL、HTTP / gRPC 等产品比较。 |
| 是否避免实现机制下沉 | pass | 未写 event payload、topic、consumer group、retry、repository、handler、worker、DDL 或部署参数。 |
| 是否保留待确认项 | pass | governance seam 字段、method 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / evidence / implementation boundary 均未闭口。 |
| 已完成旧材料差异审计 | pass | §6 覆盖旧 Provider Contract、QueryCapabilities、Cost、KMS / Vault、Policy refresh、P95 / SLA、marketplace、observability 等冲突。 |
| 正式 `01-架构设计.md` 是否保持未写入 | pass | 当前只创建 Step 10 中间产物;正式 `01` 必须等 Step 16 装配。 |
| 是否可进入 Step 11 | blocked_until_user_confirm | 必须等待用户确认后才能进入 Step 11 `备选方案与取舍`。 |

当前 next_allowed_action:

```text
wait_user_review_to_step_11
```

当前不需要提交 commit。
