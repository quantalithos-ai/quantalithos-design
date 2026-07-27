# 00 需求文档校准流程 · L3-capability-hub

> 文档类型: `00-需求文档.md`
> 执行模式: full-restart
> 当前策略: 从 Step 1 重新开始,每完成一个 Step 停审一次
> Step 粒度参考: `projects/L1-governance/design-calibration/00_req_step_01_upstream_relation.md`
> 当前状态: `00_completed_design_task_wait_implementation_handoff`
> 当前恢复点: Step 17、T070、T071、T072 已完成；当前项目入口等待授权的实现仓和 immutable baseline handoff

---

## 1. 开工门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 已读通用规范 | pass | 已读取 `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`。 |
| 已读需求 SOP / 书写规范 | pass | 已读取 `需求文档讨论流程_SOP.md` 与 `需求文档书写规范.md`。 |
| 已读专项材料 | pass | 已读取目标 README、旧 `00/01/02/03/05/06`。 |
| 已读上游参考 | pass | 已读取 `L3-method-library`、`L1-governance`、`L0-sdk` 的 00 需求文档,并参考 `L1-governance` Step 1 / Step 2 / Step 3 粒度。 |
| 不直接实现代码 | pass | 当前只修改 `design-calibration` 和后续正式设计文档。 |
| 不提交 commit | pass | 当前无需提交。 |
| 每 Step 停审 | pass | Step 17 完成后已停审,当前不自动进入 `01-架构设计.md`。 |

---

## 2. 总流程计划与状态台账

| Step | 主题 | 中间产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` | `completed_stop_review` | `step_01_closed` |
| 2 | 本仓定位与边界 | `00_req_step_02_position_boundary.md` | `completed_stop_review` | `step_02_closed` |
| 3 | 背景与问题定义 | `00_req_step_03_problem_context.md` | `completed_stop_review` | `wait_user_review_to_step_04` |
| 4 | 目标与非目标 | `00_req_step_04_goals_non_goals.md` | `completed_stop_review` | `wait_user_review_to_step_05` |
| 5 | 用户与角色 | `00_req_step_05_users_roles.md` | `completed_stop_review` | `wait_user_review_to_step_06` |
| 6 | 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` | `completed_stop_review` | `wait_user_review_to_step_07` |
| 7 | 核心能力闭环 | `00_req_step_07_core_capability_loop.md` | `completed_stop_review` | `wait_user_review_to_step_08` |
| 8 | 用户故事 | `00_req_step_08_user_stories.md` | `completed_stop_review` | `wait_user_review_to_step_09` |
| 9 | 功能需求 | `00_req_step_09_functional_requirements.md` | `completed_stop_review` | `wait_user_review_to_step_10` |
| 10 | 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` | `completed_stop_review` | `wait_user_review_to_step_11` |
| 11 | 数据需求与数据归属 | `00_req_step_11_data_ownership.md` | `completed_stop_review` | `wait_user_review_to_step_12` |
| 12 | 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` | `completed_stop_review` | `wait_user_review_to_step_13` |
| 13 | 非功能需求 | `00_req_step_13_non_functional_requirements.md` | `completed_stop_review` | `wait_user_review_to_step_14` |
| 14 | 验收标准 | `00_req_step_14_acceptance_criteria.md` | `completed_stop_review` | `wait_user_review_to_step_15` |
| 15 | 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` | `completed_stop_review` | `wait_user_review_to_step_16` |
| 16 | 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` | `completed_stop_review` | `wait_user_review_to_step_17` |
| 17 | 整理正式文档 | `00_req_step_17_formal_document_assembly.md` | `completed_stop_review` | `wait_user_review_to_01_architecture` |

---

## 3. 当前 Step 1~17 结论索引

| 结论类别 | 当前结论 | 来源 |
|---|---|---|
| 上游来源 | 当前只承接需求规范、全局依赖裁剪、目标历史材料、`L3-method-library`、`L1-governance`、`L0-sdk` 的稳定边界口径。 | `00_req_step_01_upstream_relation.md` |
| 承接主题 | 只承接“能力注册 / 外部 MCP / A2A / API 集成中心”的仓级来源主题。 | `00_req_step_01_upstream_relation.md` |
| 非重新定义项 | 不重新定义 method asset 正文、governance approval truth、SDK client、runtime execution、tool execution、marketplace listing、provider secret 平台或 cost/billing。 | `00_req_step_01_upstream_relation.md` |
| Step 2 一句话定义 | `L3-capability-hub` 是负责外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 | `00_req_step_02_position_boundary.md` |
| Step 2 非职责 | 不拥有 runtime / tools execution、method asset body、governance approval truth、SDK client、provider runtime、secret / KMS 平台、cost / billing truth、marketplace listing / transaction 或 LLM routing truth。 | `00_req_step_02_position_boundary.md` |
| Step 3 业务背景 | capability-hub 是六域之外的横切能力之一;随着 runtime、tools、governance、method-library、SDK 和生态入口都会引用外部能力,平台需要统一的正式接入语境。 | `00_req_step_03_problem_context.md` |
| Step 3 核心问题 | 外部能力正式接入语义缺少统一需求收束、相邻语境混写、旧问题层被方案和指标污染。 | `00_req_step_03_problem_context.md` |
| Step 3 问题分类 | 业务问题是缺少统一的外部能力正式接入语言;技术问题是多真相源和不可落码边界风险。 | `00_req_step_03_problem_context.md` |
| Step 4 目标主线 | 本次需求要建立能力接入 truth 边界,并收束 capability identity / registry、adapter descriptor、governance seam、method relation、SDK exposure boundary。 | `00_req_step_04_goals_non_goals.md` |
| Step 4 非目标 | execution、provider runtime、method body、governance truth、SDK client、secret / KMS、cost / billing、marketplace、LLM routing 不进入当前目标范围。 | `00_req_step_04_goals_non_goals.md` |
| Step 4 历史材料处理 | 旧白名单、Provider Contract、QueryCapabilities、Cost、KMS / Vault、metadata 和旧指标只保留为后续审计输入。 | `00_req_step_04_goals_non_goals.md` |
| Step 5 角色主线 | 本仓角色围绕能力接入事实的管理、提议、审查、审计查看、目录浏览、系统消费和后台维护展开。 | `00_req_step_05_users_roles.md` |
| Step 5 非角色项 | runtime、tools、governance、SDK、marketplace 和具体 provider 不写成角色,后移 Step 6 / Step 12。 | `00_req_step_05_users_roles.md` |
| Step 5 权限取舍 | 当前不写正式权限矩阵,只保留能力级差异方向。 | `00_req_step_05_users_roles.md` |
| Step 6 依赖主线 | 主链依赖收敛为 `L0-core` 编译期基线、`L0-bus` 事件协作主干、外部 MCP / A2A / API 接入对象、`L1-governance` 结果接缝、`L2-runtime` / `L2-tools` 消费边界与 `L0-sdk` exposure 边界。 | `00_req_step_06_consumers_dependencies.md` |
| Step 6 裁剪结论 | `L3-method-library` 当前只保留 body-free relation 边界;`L6-marketplace`、`L5-console`、`L4-observability`、KMS/Vault、finance / billing、LLM routing 与 provider runtime 不进入当前需求依赖主链。 | `00_req_step_06_consumers_dependencies.md` |
| Step 6 path dependency 结论 | 只有 `L0-core` 可作为后续唯一内部 path dependency 候选;其余关系均保留为运行期、事件协作或关系边界。 | `00_req_step_06_consumers_dependencies.md` |
| Step 7 核心闭环 | 核心能力闭环收敛为稳定外部能力身份、受控注册目录、可解释接入描述、治理 / 方法关系接缝、受控消费表达与变化感知五个节点。 | `00_req_step_07_core_capability_loop.md` |
| Step 7 外围与边界外 | 管理 UI、搜索 / 健康展示、自动发现、派生索引、只读生态发现、observability 友好输出和 SDK developer experience 属于外围增强;secret 平台、cost / billing、marketplace 交易、LLM routing 与 provider runtime 均为边界外能力。 | `00_req_step_07_core_capability_loop.md` |
| Step 7 功能回填锚点 | MCP / A2A / Provider / Policy / Query / SDK / method relation 等历史线索均已映射到 5 个能力节点或被裁剪为外围 / 边界外。 | `00_req_step_07_core_capability_loop.md` |
| Step 8 用户故事 | 核心故事围绕稳定身份、受控目录、可解释 descriptor、governance / method seam 和受控消费表达展开;外围增强只保留管理体验、搜索 / 浏览、自动发现、安全摘要、SDK developer experience、只读生态发现和审计友好输出。 | `00_req_step_08_user_stories.md` |
| Step 8 边界裁剪 | runtime / tools execution、allow / deny 执行、Provider API key / quota / route / cost、governance approval、method body、SDK client、marketplace 交易和 LLM routing 均不进入正式故事表。 | `00_req_step_08_user_stories.md` |
| Step 9 功能主轴 | 功能需求已按 C-CH-1~C-CH-5 收束为外部能力接入语境、稳定身份、身份风险解释、注册目录、可见性 / 生命周期、维护一致性、adapter descriptor、风险 / 约束摘要、描述消费支撑、治理结果接缝、职责区分、body-free method relation、追溯、受控消费、正式可见性和变化感知 16 项核心能力。 | `00_req_step_09_functional_requirements.md` |
| Step 9 外围与边界外 | 外围增强只保留管理入口、目录搜索、候选自动发现、安全摘要深化、SDK / 客户端消费说明增强、只读生态发现和审计友好导出;cost、secret / KMS、marketplace、LLM routing、runtime execution、governance approval、method body 和 SDK client 继续排除。 | `00_req_step_09_functional_requirements.md` |
| Step 10 规则主轴 | 业务规则已按不变量、禁止行为、显式变化、边界约束、治理约束和审计约束收束为 `BR-CH-001~BR-CH-037` 与 `BR-CH-E001`,覆盖 capability identity、registry、descriptor、governance seam、method relation、formal exposure 以及 execution / secret / governance truth / method body / SDK client / marketplace / observability 边界。 | `00_req_step_10_business_rules_boundaries.md` |
| Step 10 规则取舍 | allow / deny 执行、Policy 30s 刷新、Provider key 加密、调用成本 / 物理审计事件、marketplace 交易等旧规则均已降级为 historical conflict 或后续 Step 输入;本步只保留 capability access truth 的需求层硬约束。 | `00_req_step_10_business_rules_boundaries.md` |
| Step 11 数据主轴 | 数据归属已按 `真相数据`、`快照数据`、`引用数据`、`禁止保存正文` 四类收束;本仓真相数据限定为外部能力接入事实,包括 capability identity、registry entry、visibility / lifecycle semantics、adapter descriptor、descriptor risk / constraint summary、governance seam relation、body-free method relation、formal exposure boundary、formal visibility / applicability fact、access traceability 和 change / consumer impact fact。 | `00_req_step_11_data_ownership.md` |
| Step 11 数据取舍 | `CapabilityDecision` 降级为正式接入事实派生快照;`CostRecord`、Policy / shared_rules truth、KMS / Vault、provider key 正文、runtime / tools execution、method body、SDK client、marketplace listing / transaction、observability store 和 LLM routing 均作为 historical conflict、引用 / 快照边界或禁止保存正文处理,不进入本仓 truth。 | `00_req_step_11_data_ownership.md` |
| Step 12 接口主轴 | 接口与依赖已按能力级边界收束为 identity、registry、adapter descriptor、governance seam、body-free method relation、formal exposure、受控消费视图和 capability access fact 变化输出;接口类型只使用查询接口、变更接口、事件输出、事件输入、后台任务接口。 | `00_req_step_12_interfaces_dependencies.md` |
| Step 12 依赖取舍 | `L0-core` 保持唯一编译期依赖;`L0-bus` 是事件协作;外部 MCP / A2A / API 是运行期外部能力来源;`L1-governance` 是治理结论依赖;`L3-method-library` 只作为 body-free relation 定义来源边界;`L2-runtime`、`L2-tools`、`L0-sdk` 是下游消费边界;KMS/Vault、marketplace、observability、cost 等只保留为条件 / 外围边界。 | `00_req_step_12_interfaces_dependencies.md` |
| Step 13 非功能主轴 | 非功能需求已按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类收束为 `NFR-CH-001~020`,覆盖基础读取与变更不成为主链瓶颈、核心闭环与外围增强分层、禁止正文、安全摘要 / ref 边界、关键变化可追溯、单一正式语义、派生一致性、边界异常和依赖 / 消费状态可观察。 | `00_req_step_13_non_functional_requirements.md` |
| Step 13 旧指标取舍 | 旧 `QueryCapabilities P95 < 50ms`、`Policy refresh < 30s`、SLA `>= 99.9%`、明文 key grep `0`、成本记账覆盖 `100%`、未白名单调用拦截率 `100%` 均不作为当前已确认硬指标;只保留为候选量化线索或 historical conflict。 | `00_req_step_13_non_functional_requirements.md` |
| Step 13 验收承接方向 | Step 14 应承接核心读取 / 受控消费不被外围增强阻塞、外围 / 外部输入 / 事件协作 / 下游消费失效时 truth 不被伪造或反写、禁止正文、safe summary / ref、关键变化和跨仓引用可追溯、重复输入不分叉、边界异常和依赖延迟可识别。 | `00_req_step_13_non_functional_requirements.md` |
| Step 14 验收主轴 | 验收标准已按核心能力闭环、功能能力、规则 / 边界、数据归属、非功能验收五类收束为 `AC-CH-001~037`,并将核心闭环断裂、truth 替代、正文回流、边界打穿、消费面反写真相、关键变化不可追溯、幂等一致性失效、依赖裁剪失效和旧口径回流收束为 `VF-CH-001~013` 一票否决项。 | `00_req_step_14_acceptance_criteria.md` |
| Step 14 旧验收取舍 | 旧 Given-When-Then、`QueryCapabilities`、Policy 30s、未白名单拦截 100%、明文 key grep、CostRecord 覆盖、SLA、KMS / Vault 等均不作为新版需求验收主线;只保留为 historical conflict 或后续测试 / 风险阶段候选线索。 | `00_req_step_14_acceptance_criteria.md` |
| Step 14 停审结论 | 未发现阻塞进入 Step 15 的上游 blocker;正式 `00-需求文档.md` 仍不得写入,必须等 Step 17。 | `00_req_step_14_acceptance_criteria.md` |
| Step 15 风险主轴 | 风险已收束为旧 Provider Contract / KMS、旧 QueryCapabilities / 白名单刷新、CostRecord / finance、消费面反写真相、governance truth 回流、method body 回流、marketplace / observability 误升 truth、协议 / DTO / 状态机提前锁死、旧硬指标伪量化、外围增强误阻塞核心和后续 Agent 自行补设计等结构风险。 | `00_req_step_15_risks_open_questions.md` |
| Step 15 待确认主轴 | 待确认事项仅保留后续设计 / 测试 / 实施仍需细化的口径,包括 governance seam 承载、method relation 摘要强度、descriptor 分类、secret safe summary、SDK exposure 交接、marketplace / console / observability / finance / KMS 边界、非功能量化与 API / DTO / state / evidence / implementation boundary。 | `00_req_step_15_risks_open_questions.md` |
| Step 15 停审结论 | 当前待确认项不阻塞 Step 16;若后续出现 forbidden body 入仓、消费面反写真相、非 `L0-core` 编译期依赖、未正式能力正式暴露或旧口径回流,必须回退修正。 | `00_req_step_15_risks_open_questions.md` |
| Step 16 追溯主轴 | 需求追溯矩阵已以 `FR-CH-001~016` 和 `FR-CH-E01~E07` 为主轴,连接 C-CH 闭环、US-CH 故事、BR-CH 规则、Step 11 数据归属和 AC / VF 验收。 | `00_req_step_16_traceability_matrix.md` |
| Step 16 审计结论 | 未发现孤儿故事、孤儿功能、孤儿规则、孤儿数据、孤儿接口、孤儿验收、依赖类型冲突或新增未确认项;接口 / 依赖已单独审计,未写 API / DTO / event schema。 | `00_req_step_16_traceability_matrix.md` |
| Step 16 风险影响 | Step 15 中 governance seam、method relation、descriptor 分类、secret summary、SDK 交接、observability / marketplace / finance / KMS、API / DTO / state / evidence / boundary 等问题仍按后续文档挂起,未在矩阵中脑补关闭。 | `00_req_step_16_traceability_matrix.md` |
| Step 16 停审结论 | 当前无阻塞 Step 17 的上游 blocker;正式 `00-需求文档.md` 仍不得写入,必须等用户确认进入 Step 17。 | `00_req_step_16_traceability_matrix.md` |
| Step 17 装配门禁 | Step 17 已读取需求 SOP、需求书写规范、通用中间产物规范、Step 1~16 中间产物、旧正式 `00` 和上游参考;项目级台账和文档级 flow 均允许装配。 | `00_req_step_17_formal_document_assembly.md` |
| Step 17 正式文档装配 | 正式 `00-需求文档.md` 已按 16 章结构重建;每章均列出具体校准来源和延伸阅读;正文只承载 Step 1~16 已确认结论,未新增 API / DTO / event schema / state / storage / evidence / implementation boundary。 | `00_req_step_17_formal_document_assembly.md`;`../00-需求文档.md` |
| Step 17 旧文档处理 | 旧 `00-需求文档.md` 的 Provider Contract、Cost Accounting、QueryCapabilities、KMS/Vault、Policy 30s、marketplace、runtime/tools 必经 hub 执行、Given-When-Then、旧验收签署等均继续作为 historical material / risk,未继承为新版结论。 | `00_req_step_17_formal_document_assembly.md`;`../00-需求文档.md` |
| Step 17 停审结论 | 未发现阻塞进入 `01-架构设计.md` 的上游 blocker;但不得自动跨文档,必须等待用户确认后再读取架构设计 SOP / 书写规范并新建 `01_architecture_calibration_flow.md`。 | `00_req_step_17_formal_document_assembly.md` |
| 历史材料处理 | README、旧 `00~06` 与 restart 前 Step 8~9 版本均降级为 historical material 或 pre-restart historical material;Step 4~17 已重写为当前 active baseline。 | `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md`;`00_req_step_15_risks_open_questions.md`;`00_req_step_16_traceability_matrix.md`;`00_req_step_17_formal_document_assembly.md`;`project_execution_ledger.md` |
| 上游 blocker | 未发现阻塞 Step 1 ~ Step 17 或进入 `01-架构设计.md` 的上游 blocker。 | `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md`;`00_req_step_15_risks_open_questions.md`;`00_req_step_16_traceability_matrix.md`;`00_req_step_17_formal_document_assembly.md` |

---

## 4. restart 前保留文件说明

| 文件 | 当前定位 | 使用口径 |
|---|---|---|
| `00_req_step_04_goals_non_goals.md` | `active_restart_baseline` | 已按当前 restart 策略原位重写,现作为有效 Step 4 基线。 |
| `00_req_step_05_users_roles.md` | `active_restart_baseline` | 已按当前 restart 策略原位重写,现作为有效 Step 5 基线。 |
| `00_req_step_06_consumers_dependencies.md` | `active_restart_baseline` | 已按当前 restart 策略重写并停审,现作为有效 Step 6 基线。 |
| `00_req_step_07_core_capability_loop.md` | `active_restart_baseline` | 已按当前 restart 策略重写并停审,现作为有效 Step 7 基线。 |
| `00_req_step_08_user_stories.md` | `active_restart_baseline` | 已按当前 restart 策略原位重写并停审,现作为有效 Step 8 基线。 |
| `00_req_step_09_functional_requirements.md` | `active_restart_baseline` | 已按当前 restart 策略原位重写并停审,现作为有效 Step 9 基线;其 restart 前版本仅保留为已覆盖的历史尝试。 |
| `00_req_step_10_business_rules_boundaries.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 10 基线。 |
| `00_req_step_11_data_ownership.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 11 基线。 |
| `00_req_step_12_interfaces_dependencies.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 12 基线。 |
| `00_req_step_13_non_functional_requirements.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 13 基线。 |
| `00_req_step_14_acceptance_criteria.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 14 基线。 |
| `00_req_step_15_risks_open_questions.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 15 基线。 |
| `00_req_step_16_traceability_matrix.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 16 基线。 |
| `00_req_step_17_formal_document_assembly.md` | `active_restart_baseline` | 已按当前 restart 策略新建并停审,现作为有效 Step 17 装配基线。 |
| 正式 `00-需求文档.md` | `active_formal_baseline` | 已按 Step 1~17 装配完成,取代旧正式 `00`。 |
| restart 前 `00_requirements_calibration_flow.md` 状态 | `overwritten_by_restart` | 旧 Step 9 停审状态已作废。 |
| restart 前 `project_execution_ledger.md` 状态 | `overwritten_by_restart` | 旧恢复点已被 Step 1 / Step 2 / Step 3 restart 新台账取代。 |

---

## 5. 停审结论

| 项 | 结论 |
|---|---|
| 是否允许进入 Step 17 | 已完成。 |
| 是否允许写正式 `00-需求文档.md` | 已完成,正式 `00-需求文档.md` 已重建。 |
| 是否允许进入 `01-架构设计.md` | 否,必须等待用户确认后再读取 `01` 对应 SOP / 书写规范并创建 `01_architecture_calibration_flow.md`。 |
| 是否发现 Step 17 blocker | 否,当前正式装配未发现孤儿项、串线项、新增未确认项或阻塞进入 `01` 的上游 blocker。 |
| 当前是否需要提交 | 否。 |
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `00-需求文档.md` |
| document_status | `requirements design completed` |
| current_step | `Step 17 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
