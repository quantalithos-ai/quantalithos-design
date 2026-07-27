# 01 架构设计校准流程 · L3-capability-hub

> 文档类型: `01-架构设计.md`
> 执行模式: full-restart
> 当前策略: 基于已重建的 `00-需求文档.md` 从架构 Step 1 重新开始,每完成一个 Step 停审一次
> Step 粒度参考: `projects/L1-governance/design-calibration/01_arch_step_01_requirement_baseline.md` 和 `projects/L3-method-library/design-calibration/01_arch_step_01_requirement_baseline.md`
> 当前状态: `01_completed_design_task_wait_implementation_handoff`
> 当前恢复点: Step 16、T070、T071、T072 已完成；当前项目入口等待授权的实现仓和 immutable baseline handoff

---

## 1. 开工门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 已读项目级台账 | pass | 已读取 `design-calibration/project_execution_ledger.md`,确认 `00-需求文档.md` 已完成且用户已同意进入 `01-架构设计.md`。 |
| 已读 `00` 文档级 flow | pass | 已读取 `design-calibration/00_requirements_calibration_flow.md`,确认 Step 1~17 已完成并形成 active formal baseline。 |
| 已读通用规范 | pass | 已读取 `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`。 |
| 已读架构 SOP / 书写规范 | pass | 已读取 `架构设计讨论流程_SOP.md` 与 `架构设计书写规范.md`。 |
| 已读当前正式需求文档 | pass | 已读取 `projects/L3-capability-hub/00-需求文档.md`,以其作为 `01` 的直接需求基线。 |
| 已读历史架构材料 | pass | 已读取旧 `projects/L3-capability-hub/01-架构设计.md`;旧文档只作为 historical material / 差异审计输入。 |
| 已读专项 README | pass | 已读取 `projects/L3-capability-hub/README.md`;README 中的 MCP / A2A / Provider / Policy / Cost / KMS 口径只作历史线索。 |
| 已读参考项目粒度 | pass | 已读取 `L1-governance`、`L3-method-library`、`L0-sdk` 的架构 Step 1 / Step 2 中间产物与 `L1-governance` / `L3-method-library` 架构 flow。 |
| 不直接实现代码 | pass | 当前只修改设计仓文档和 `design-calibration` 中间产物。 |
| 不提交 commit | pass | 当前无需提交。 |
| 未来 Step 不提前落盘 | pass | 本 flow 可列出 Step 1~16 总计划;未到达的 Step 不创建、不清空、不替换中间产物。 |

---

## 2. 输入边界

| 输入 | 当前定位 | 本轮使用方式 |
|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | `active_formal_baseline` | `01-架构设计.md` 的直接需求基线。 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_17_formal_document_assembly.md` | `active_restart_baseline` | 追溯需求来源、定位、依赖、核心闭环、规则、数据、接口、NFR、验收、风险和正式装配口径。 |
| `projects/L3-capability-hub/README.md` | `historical_material` | 仅保留 MCP / A2A / API 接入中心、能力池、治理联动等线索;不继承旧 Cost / KMS / runtime 必经 hub 等主线。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | `historical_material` | 只在当前 Step 形成独立结论后做差异审计;不作为新版架构真相源。 |
| `projects/L3-method-library/01-架构设计.md` 与 Step 1 | `reference_material` | 参考 L3 同层仓在 full-restart 中的 Step 粒度和旧材料处理方式。 |
| `projects/L1-governance/01-架构设计.md` 与 Step 1 | `reference_material` | 参考硬约束、未关闭风险和正式回填草稿粒度。 |
| `projects/L0-sdk/01-架构设计.md` 与 Step 1 | `reference_material` | 参考 SDK exposure / client boundary 的裁剪口径。 |

---

## 3. 总流程计划与状态台账

| Step | 主题 | 中间产物 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|
| 1 | 确认需求基线 | `01_arch_step_01_requirement_baseline.md` | `completed_stop_review` | `step_02_completed` | 架构需求基线、架构硬约束、未关闭需求风险和旧材料差异审计均已完成。 |
| 2 | 明确架构目标与约束 | `01_arch_step_02_goals_constraints.md` | `completed_stop_review` | `step_03_completed` | 架构目标、不可变约束、当前阶段取舍、架构非目标、旧材料差异审计和正式回填草稿均已完成。 |
| 3 | 职责边界 | `01_arch_step_03_responsibility_boundary.md` | `completed_stop_review` | `step_04_completed` | 做 / 不做 / 易混淆职责、边界红线、旧材料差异审计和正式回填草稿均已完成。 |
| 4 | 系统边界与上下文 | `01_arch_step_04_system_context.md` | `completed_stop_review` | `step_05_completed` | 系统上下文图、上下游与输入 / 输出面表、边界说明、依赖失效降级口径和旧材料差异审计均已完成。 |
| 5 | 限界上下文与子域划分 | `01_arch_step_05_bounded_context_subdomains.md` | `completed_stop_review` | `step_06_completed` | 子域 / 上下文划分表、上下文关系图、本地索引 / 投影 / 引用边界、统一语言、单上下文停审、跨上下文审计和旧材料差异审计均已完成。 |
| 6 | 容器 / 部署架构 | `01_arch_step_06_container_deployment.md` | `completed_stop_review` | `step_07_completed` | 容器 / 部署架构图、运行单元说明、部署说明、通信方式结论、运行承载停审和旧材料差异审计均已完成;正式 `01` 不得写入,必须等 Step 16。 |
| 7 | 依赖方向与层间约束 | `01_arch_step_07_dependency_direction.md` | `completed_stop_review` | `step_08_completed` | 依赖方向图、层间约束表、本仓依赖裁剪表、依赖类型分类表、禁止依赖表、依赖裁剪图、依赖倒置、架构单元依赖规则、跨依赖审计和旧材料差异审计均已完成;正式 `01` 不得写入,必须等 Step 16。 |
| 8 | 数据所有权与一致性策略 | `01_arch_step_08_data_ownership_consistency.md` | `completed_stop_review` | `step_09_completed` | 数据归属表、数据分类结论、一致性策略表、补偿 / 约束口径、按架构单元组织的数据所有权表、数据所有权停审、跨数据边界审计、旧材料差异审计和回填草稿均已完成;正式 `01` 不得写入,必须等 Step 16。 |
| 9 | 关键交互与通信方式 | `01_arch_step_09_interactions_communication.md` | `completed_stop_review` | `step_10_completed` | 关键交互场景表、通信方式表、失败 / 降级口径、边界约束、按架构单元组织的交互规则、交互停审、跨交互边界审计、旧材料差异审计和回填草稿均已完成;正式 `01` 不得写入,必须等 Step 16。 |
| 10 | 关键技术选型 | `01_arch_step_10_technology_choices.md` | `completed_stop_review` | `step_11_completed` | 关键技术机制表、技术边界说明、简化对照表、机制代价停审表、旧材料差异审计、回填草稿和自检均已完成;正式 `01` 不得写入,必须等 Step 16。 |
| 11 | 备选方案与取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | `completed_stop_review` | `step_12_completed` | 当前主线方案、方案路径比较表、轻量取舍对照表、方案边界说明、旧材料差异审计、回填草稿和自检均已完成;正式 `01` 不得写入,必须等 Step 16。 |
| 12 | 横切关注点 | `01_arch_step_12_cross_cutting_concerns.md` | `completed_stop_review` | `step_13_completed` | 安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制已按本仓边界和架构单元完成停审。 |
| 13 | 演进路线 | `01_arch_step_13_evolution_path.md` | `completed_stop_review` | `step_14_completed` | 当前阶段已收敛为 capability access truth 主线成立;可接受债务、后续结构演进和触发条件已完成停审。 |
| 14 | 风险与待确认事项 | `01_arch_step_14_risks_open_questions.md` | `completed_stop_review` | `step_15_completed` | 风险表、待确认事项表、当前处理口径、旧材料差异审计和自检已完成停审。 |
| 15 | ADR 与需求追溯 | `01_arch_step_15_adr_traceability.md` | `completed_stop_review` | `step_16_completed` | ADR 索引、需求追溯矩阵、漏项检查、架构决定停审记录和跨表审计已完成;当前明确未建立正式 ADR 文件,不得伪造编号。 |
| 16 | 整理正式文档 | `01_arch_step_16_formal_document_assembly.md` | `completed` | `wait_user_review_to_02_step_01` | 正式每章已有具体校准来源,正文未新增 Step 1~15 未确认结论;`01-架构设计.md` 已重建完成。 |

---

## 4. Step 1~15 当前结论索引

| 结论类别 | 当前结论 | 来源 |
|---|---|---|
| 架构直接基线 | 新版 `00-需求文档.md` 是 `01` 的第一权威输入;旧 README、旧 `01` 和旧 `02/03/05/06` 不作为新版架构基线。 | `01_arch_step_01_requirement_baseline.md` |
| 仓级定位 | `L3-capability-hub` 是外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 | `00-需求文档.md`;`01_arch_step_01_requirement_baseline.md` |
| 核心闭环 | 架构必须承接 C-CH-1~C-CH-5:稳定外部能力身份、受控注册目录、可解释 adapter descriptor、governance / method seam、formal exposure / controlled consumer view / change awareness。 | `00-需求文档.md`;`01_arch_step_01_requirement_baseline.md` |
| 依赖裁剪 | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;governance、runtime、tools、SDK、method-library 和外部 MCP / A2A / API 均需按运行期 / 事件 / ref / relation 边界处理。 | `00-需求文档.md`;`全局项目依赖关系与裁剪规则.md`;`01_arch_step_01_requirement_baseline.md` |
| 数据边界 | 本仓拥有 capability access truth;相邻仓数据只能是 safe summary / ref / derived view;provider secret、runtime execution、governance truth、method body、SDK client、marketplace、cost / billing 和 observability 正文禁止入仓。 | `00-需求文档.md`;`01_arch_step_01_requirement_baseline.md` |
| 历史冲突 | 旧 Provider Contract、Cost Accounting、KMS/Vault、QueryCapabilities、Policy 30s、未白名单拦截、SLA、LLM routing、marketplace listing 等只作为 historical conflict / risk,不得直接继承。 | `README.md`;旧 `01-架构设计.md`;`01_arch_step_01_requirement_baseline.md` |
| 未关闭风险 | governance seam 承载、method relation 摘要强度、descriptor 分类、secret safe summary、SDK exposure 交接、observability / marketplace / finance / KMS 边界、API / DTO / state / evidence / implementation boundary 均后续细化,不阻塞 Step 2。 | `00-需求文档.md`;`01_arch_step_01_requirement_baseline.md` |
| 架构目标 | 架构必须承载独立 capability access truth,支撑稳定 identity / registry、adapter descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view 分层、变化追溯、外围隔离和跨仓边界协作。 | `01_arch_step_02_goals_constraints.md` |
| 不可变约束 | identity 不得被 URL / provider / config / SDK / marketplace / 派生视图替代;registry 不得退化为 allowlist / cache / availability bit;descriptor 不得承载 secret / provider runtime / quota / route / cost / failover / retry;governance / method / exposure / forbidden body / 编译期依赖 / historical conflict 均有红线。 | `01_arch_step_02_goals_constraints.md` |
| 当前阶段取舍 | protocol / descriptor 分类、secret safe summary、governance seam 形态、method relation 摘要、SDK exposure 交接、外围边界、formal exposure 延迟、技术机制以及 API / DTO / state / evidence / boundary 均后移到对应架构 Step 或后续文档。 | `01_arch_step_02_goals_constraints.md` |
| 架构非目标 | 不设计 runtime / tools execution、provider runtime、secret/KMS、cost/billing、governance approval、method body、SDK client、marketplace transaction、observability store、LLM routing、外部标准本体或 UI / console 状态。 | `01_arch_step_02_goals_constraints.md` |
| 职责边界 | 本仓正式承担 capability access truth、identity、registry、adapter descriptor、descriptor risk / access review、governance seam relation、body-free method relation、formal exposure、traceability / change impact 和派生维护 / safe summary 边界;明确不承担 execution、provider runtime、secret、cost、governance truth、method body、SDK client、marketplace、observability、LLM routing、外部协议正文、UI 状态或实现 boundary。 | `01_arch_step_03_responsibility_boundary.md` |
| 易混淆职责 | 已区分 external source vs identity、registry vs allowlist / listing、descriptor vs Provider Contract、access review vs governance approval、seam vs Policy truth、relation vs method body、formal exposure vs execution、consumer view vs exposure truth、SDK exposure vs SDK client、derived output vs core truth、observability summary vs audit store。 | `01_arch_step_03_responsibility_boundary.md` |
| 职责红线 | 后续不得让 consumer view / QueryCapabilities / runtime cache / SDK wrapper / search / export / maintenance 反写真相,不得保存 forbidden body,不得让旧 Provider Contract / Cost / KMS / SLA / PostgreSQL / cache / outbox 作为新版职责基线,也不得由实现端自行补 boundary。 | `01_arch_step_03_responsibility_boundary.md` |
| 系统上下文 | 本仓位于外部 MCP / A2A / API 能力来源、`L0-core` / `L0-bus` 基础、`L1-governance` / `L3-method-library` 接缝与 `L2-runtime` / `L2-tools` / `L0-sdk` 消费边界之间;主图只保留关键正式对象,外围 `L5-console` / `L6-marketplace` / `L4-observability` 只入表。 | `01_arch_step_04_system_context.md` |
| 输入 / 输出面 | 输入面包括共享契约、事件协作、外部能力来源、governance result ref / safe summary、method asset ref;输出面包括 formal exposure、controlled consumer view、descriptor 摘要、变化感知、SDK exposure 边界和外围只读 / 审计摘要候选。 | `01_arch_step_04_system_context.md` |
| 失效口径 | 依赖失效时按 truth-preserving 方式处理:挂起、标记 unresolved、延迟消费或保留已成立 truth;不得用缓存、provider runtime、access review fact、SDK client、UI、listing 或 observability 正文补造本仓或相邻仓 truth。 | `01_arch_step_04_system_context.md` |
| 核心子域 | 核心子域为能力身份语义、注册目录语义、接入描述语义、治理与方法关系语义、正式暴露与受控消费语义;不按 MCP / A2A / API 协议类别或旧对象清单切分。 | `01_arch_step_05_bounded_context_subdomains.md` |
| 支撑子域 | 支撑子域为接入审查与风险解释、追溯与变化感知、派生维护与消费快照、外围管理与发现;均围绕核心 truth,不得独立生成第二份 access truth。 | `01_arch_step_05_bounded_context_subdomains.md` |
| 本地影子层 | 外部来源、治理与方法、安全敏感、下游 / SDK、观测 / 生态 / 外部文档均作为本地索引 / 投影 / 引用,不得拥有外部正文或反写核心子域。 | `01_arch_step_05_bounded_context_subdomains.md` |
| 运行承载结构 | 运行承载由下游消费 / 管理入口边界、外部能力来源边界、相邻关系输入边界、同步入口承载、异步协作承载、后台维护与派生承载、access truth 承载、受控消费 / 追溯派生承载和 `L0-bus` 运行对接边界组成。 | `01_arch_step_06_container_deployment.md` |
| truth / 派生承载分离 | `Capability Hub access truth 承载` 是唯一正式 access truth 承载;受控消费、追溯、搜索、导出、审计摘要和 consumer view 只能从 truth 派生,不得反写 formal exposure 或核心 truth。 | `01_arch_step_06_container_deployment.md` |
| 部署关系口径 | P0 可同部署同步入口、异步协作和后台维护派生,但逻辑边界必须分离;存储、消息、缓存、搜索、KMS/Vault、provider adapter 和 outbox 等技术机制后移。 | `01_arch_step_06_container_deployment.md` |
| 旧运行承载冲突 | 旧 `provider service`、`access decision service`、`cost worker`、`KMS/Vault`、`PostgreSQL`、provider failover / retry / routing / quota / SLA / Policy 30s 均不得作为新版 Step 6 运行承载主线。 | `01_arch_step_06_container_deployment.md` |
| 依赖责任层 | 内部依赖角色收敛为外部接缝、Capability access 正式承接、Capability access 核心语义、派生消费辅助和技术承载;箭头只表示允许依赖或边界接入,不表示调用顺序、协议、事件传播或代码调用链。 | `01_arch_step_07_dependency_direction.md` |
| 跨仓依赖裁剪 | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;外部 MCP / A2A / API 是运行期接入对象来源;`L1-governance` 是运行期 / 事件协作 seam;`L2-runtime`、`L2-tools`、`L0-sdk` 是运行期消费边界;`L3-method-library` 仅为 body-free relation,无直接依赖。 | `01_arch_step_07_dependency_direction.md` |
| 禁止依赖红线 | 禁止 runtime / tools 源码耦合、governance approval / Policy truth 合并、method body 依赖、SDK client 依赖、外部 provider execution gateway、KMS / Vault truth、cost / billing、marketplace listing / transaction、observability store 和派生视图反写真相。 | `01_arch_step_07_dependency_direction.md` |
| 依赖倒置 | 外部来源、governance、method、runtime / tools、SDK、bus、console、marketplace、observability、secret、finance 和技术承载均必须经正式边界 / ref / safe summary / relation / controlled view 进入,不能直接打穿核心语义。 | `01_arch_step_07_dependency_direction.md` |
| 架构单元依赖规则 | 五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用均已逐个定义允许依赖、禁止依赖、外部接入 / 倒置边界并停审。 | `01_arch_step_07_dependency_direction.md` |
| 旧依赖口径冲突 | 旧 `api -> application -> domain -> infra`、`SecretStore`、`ProviderRegistry`、`CapabilityQuery`、`CostSink`、KMS / Vault、PostgreSQL、cache、outbox 和 provider adapters 均不得作为新版 Step 7 基线。 | `01_arch_step_07_dependency_direction.md` |
| 正式数据真相 | 本仓正式数据真相是外部 capability access truth,包括 capability identity、registry entry、visibility / lifecycle、adapter descriptor、descriptor risk / constraint、governance seam、access review responsibility separation、body-free method relation、traceability、formal exposure、formal visibility / applicability 和 change / consumer impact fact。 | `01_arch_step_08_data_ownership_consistency.md` |
| 快照 / 投影边界 | governance result safe summary、secret handling safe summary、directory search / browse summary、export summary、controlled consumer view / CapabilityDecision-style summary、downstream impact summary、candidate discovery、read-only ecosystem discovery、observability / audit safe summary 均为快照 / 投影,不得反写 access truth。 | `01_arch_step_08_data_ownership_consistency.md` |
| 引用关系边界 | external capability source、governance result / policy result、method asset、secret、runtime / tools consumer、SDK exposure consumer、observability / audit、external standard / protocol / document、marketplace ecosystem object 均只保存引用关系,不保存外部正文。 | `01_arch_step_08_data_ownership_consistency.md` |
| 明确不拥有正文 | provider secret、KMS / Vault truth、runtime / tools execution、provider runtime / quota / route / failover / retry、cost / billing、governance approval / Policy / shared_rules、method body、SDK client、marketplace transaction、observability store、production payload 和 LLM routing 正文明确不归本仓。 | `01_arch_step_08_data_ownership_consistency.md` |
| 一致性策略 | 正式 truth 内部关系强一致;truth 到派生 view / search / export / consumer summary 最终一致;truth 到外部 ref 要求引用有效性一致;forbidden body 采用边界约束一致,只能拒绝、挂起或转化为 ref / allowed safe summary。 | `01_arch_step_08_data_ownership_consistency.md` |
| 架构单元数据规则 | 五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用均已逐个定义 truth、snapshot / projection、reference、forbidden body / forbidden write 和一致性口径并停审。 | `01_arch_step_08_data_ownership_consistency.md` |
| 旧数据口径冲突 | 旧 `MCPServer registry`、`A2ANode directory`、`ProviderContract`、`CapabilityDecision cache`、`CostRecord`、Policy replay、cost retry、key rotate、KMS / Vault 和 cache / outbox 均不得作为新版 Step 8 基线。 | `01_arch_step_08_data_ownership_consistency.md` |
| 关键交互场景 | Step 9 已覆盖外部能力接入语境与 identity 建立 / 调整、registry 纳入 / 退出与可见性变化、adapter descriptor 建立 / 替换、governance seam 与 access review 分离、capability-method body-free relation、formal exposure、正式事实读取、受控消费视图读取、access fact 变化传播、外部结果送达、下游影响回报、registry maintenance / reconciliation、consumer view / search / browse / export 派生维护、外围发现、observability / audit / external document 交接和 secret ref / safe summary 承接。 | `01_arch_step_09_interactions_communication.md` |
| 同步边界 | 能改变或读取核心 access truth 的 interaction 采用同步请求 / 响应类交互;同步只表达架构类别和边界理由,不提前落 API path、DTO、schema、transport、repository、handler 或 worker。 | `01_arch_step_09_interactions_communication.md` |
| 异步边界 | 已成立事实传播、外部治理 / 方法 / 来源结果送达、下游消费影响回报采用异步事件 / 回调类交互;异步内容只能携带 ref、safe summary、变化上下文或影响摘要,不得携带 governance approval truth、method body、production payload、secret 或 provider runtime 正文。 | `01_arch_step_09_interactions_communication.md` |
| 后台延后承接 | registry maintenance / reconciliation、consumer view / search / browse / export 派生维护、外围只读发现、observability / audit / external document 交接和 secret safe summary 承接采用后台任务 / 延后承接类交互;这些结果均为派生或交接材料,不得反写 formal exposure 或核心 truth。 | `01_arch_step_09_interactions_communication.md` |
| 失败处理口径 | 外部来源、治理、方法、读取和派生失败时采用挂起、unresolved、延迟送达、保留已成立 truth、标记 stale / partial 或等待权威 ref 方式处理;不得以缓存、runtime guess、provider retry、SDK wrapper、listing 或观测数据补造 truth。 | `01_arch_step_09_interactions_communication.md` |
| 架构单元交互规则 | 五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用均已定义允许同步、允许异步、允许后台延后、禁止交互和失败口径,并确认 consumer view / search / export / audit handoff 只能从 truth 派生。 | `01_arch_step_09_interactions_communication.md` |
| 旧交互口径冲突 | 旧 `QueryCapabilities`、`ProviderContract`、KMS / Vault、cost worker / events、provider failover / retry / routing / quota、Policy 30s、未白名单拦截、API / DTO / outbox / consumer group 细节均不得作为新版 Step 9 基线。 | `01_arch_step_09_interactions_communication.md` |
| 机制级技术选型 | 当前采用正式承接边界隔离外部输入、依赖倒置与 `L0-core` 共享契约基线、access truth / snapshot / reference / forbidden body 分层、核心强一致 + 派生最终一致、同步 / 异步 / 后台三类路径分离、formal exposure 与 controlled consumer view 分层、adapter descriptor 与 provider runtime / secret / cost 分离、governance seam 与 method body-free relation、引用 / safe summary 优先、traceability / impact / handoff 可解释、核心闭环与外围增强隔离、逻辑可分运行承载。 | `01_arch_step_10_technology_choices.md` |
| 技术边界口径 | Step 10 只固定机制级架构手段,不固定 Rust、PostgreSQL、cache、message broker、HTTP / RPC、outbox、KMS / Vault、provider adapter、event topic、payload schema、consumer group、P95、SLA 或部署环境;这些只能在后续 `02~07` 中按机制重新闭口。 | `01_arch_step_10_technology_choices.md` |
| 机制代价与后续承接 | 每项机制均已记录后续设计成本:承接状态、ref / summary 缺失、stale / rebuilding / unavailable、forbidden body 拒绝、consumer view 滞后、descriptor 挂起、seam / relation ref 不可解析、trace / impact / handoff 来源和外围进入条件。 | `01_arch_step_10_technology_choices.md` |
| 旧技术口径冲突 | 旧 Provider Contract、QueryCapabilities、KMS / Vault、Cost Accounting、Policy refresh、runtime whitelist、provider failover、PostgreSQL / cache / outbox、P95 / 30s、marketplace metadata publish 和 observability audit store 均不得作为新版 Step 10 关键技术选型直接继承。 | `01_arch_step_10_technology_choices.md` |
| 当前主线方案 | 当前采用“独立 capability access truth 与分层承接方案”:正式承接边界隔离外部输入,identity / registry / descriptor / seam / relation / exposure 作为核心 truth,ref / safe summary / body-free relation 承接相邻系统,formal exposure 与 controlled consumer view 分层,核心同步裁定、已成立事实异步传播、派生 / 对账 / 导出 / handoff 后台承接,核心闭环与外围增强隔离。 | `01_arch_step_11_alternatives_tradeoffs.md` |
| 备选路径结论 | 不采用 runtime / tools execution gateway 主导、Provider Contract / provider platform 主导、governance approval / Policy truth 主导、method-library definition 合并、SDK client / gateway-first、marketplace listing / ecosystem directory 主导、QueryCapabilities / consumer view 主导、全同步端到端闭环、全异步事件化 access truth、复制外部正文 / secret / provider data 入仓、observability / audit / cost center 主导等路径作为当前主线。 | `01_arch_step_11_alternatives_tradeoffs.md` |
| 取舍收束 | 当前方案牺牲短期集中性、即时全链完成感和本地正文完整性,换取 capability access truth 独立、相邻 truth owner 清楚、依赖方向可裁剪、forbidden body 可审计、formal exposure 不被消费面反写、核心闭环不被外围拖垮以及后续设计可按边界落码。 | `01_arch_step_11_alternatives_tradeoffs.md` |
| 方案边界说明 | 数据库、缓存、消息中间件、HTTP / RPC、KMS / Vault 产品、event topic、payload schema、consumer group、provider adapter、部署形态等不是 Step 11 主比较对象;marketplace 只读发现、observability handoff、SDK exposure 扩展和 provider adapter 实现可作为后续外围增强或实现承载,但必须服从 access truth、ref / safe summary、exposure / consumer view 分层和 forbidden body 边界。 | `01_arch_step_11_alternatives_tradeoffs.md` |
| 旧方案口径冲突 | 旧 `Registry / Directory / Provider Contract / Cost Accounting` 四子域、`QueryCapabilities`、KMS / Vault、CostRecord / cost worker、provider failover / retry / routing / quota、Policy 30s、PostgreSQL / cache / outbox、marketplace metadata、observability audit store 和 P95 / SLA 均不得作为新版 Step 11 方案基线继承。 | `01_arch_step_11_alternatives_tradeoffs.md` |
| 横切安全边界 | 所有核心 truth 的变更和读取都必须经正式承接边界;governance truth、method body、secret 正文、provider runtime、SDK client、cost、marketplace、observability 和 production payload 不得入仓;派生材料只读不得反写真相。 | `01_arch_step_12_cross_cutting_concerns.md` |
| 横切追溯与观测 | 核心 access truth 变化、引用 / 摘要状态、传播 / 派生 / handoff 状态和边界异常必须可解释、可见,但 observability 材料不得成为第二 truth。 | `01_arch_step_12_cross_cutting_concerns.md` |
| 横切韧性边界 | 核心失败不伪成功,外部不可解析不补造 truth,外围失败不回滚核心 truth;stale / pending / unresolved / unavailable 必须显式表达。 | `01_arch_step_12_cross_cutting_concerns.md` |
| 横切性能边界 | 核心同步链路不得被 search / export / handoff / discovery / 对账等外围增强拖重;复杂消费通过派生和后台路径扩展。 | `01_arch_step_12_cross_cutting_concerns.md` |
| 横切配置边界 | 配置不得改变 truth owner、formal boundary、同步 / 异步 / 后台分层、ref / safe summary / body-free relation 规则或外围进入条件。 | `01_arch_step_12_cross_cutting_concerns.md` |
| 当前阶段成立边界 | 当前阶段只要求独立 capability access truth、正式承接边界、truth / snapshot / ref / forbidden body 分层、formal exposure / controlled consumer view 分层、同步 / 异步 / 后台分层、追溯 / impact / handoff 语义和外围隔离成立。 | `01_arch_step_13_evolution_path.md` |
| 当前可接受债务 | seam / relation / descriptor / secret safe summary / SDK exposure 交接细节、实现承载和非功能量化指标可后移,前提是不得打穿 truth owner、依赖裁剪和数据分层。 | `01_arch_step_13_evolution_path.md` |
| 后续结构演进 | 后续只在 governance seam、relation / descriptor、consumer view / handoff、SDK exposure boundary、观测 / 对账 / 容量治理等结构压力明确出现时增强。 | `01_arch_step_13_evolution_path.md` |
| 演进红线 | 后续阶段不得重开 runtime execution、tools execution、provider runtime、governance approval truth、method body、SDK client、marketplace listing / transaction、cost / billing、KMS / Vault 或 observability store 等边界外职责。 | `01_arch_step_13_evolution_path.md` |
| 当前正式风险 | 当前正式风险集中在历史主线回流、派生或消费面反写真相、forbidden body 入仓、跨仓编译期依赖回流、伪闭环 / 伪成功和后续文档 / 实现自行补真相源。 | `01_arch_step_14_risks_open_questions.md` |
| 当前待确认事项 | 当前待确认事项集中在 governance seam 最小承载、relation 摘要强度、descriptor taxonomy、secret safe summary、SDK exposure handoff、外围只读接缝、量化目标和 implementation boundary。 | `01_arch_step_14_risks_open_questions.md` |
| 风险处理口径 | 风险只写保守约束和阻塞性,待确认事项只写缺失确认和当前挂起口径;未闭口内容不得进入核心写源或由实现端自行补结论。 | `01_arch_step_14_risks_open_questions.md` |
| 需求追溯闭环 | capability-hub 的仓定位、C-CH-1~5、truth owner / forbidden body 规则、依赖裁剪、NFR 结构约束、AC / VF 否决项都已映射到职责边界、上下文、子域、依赖、数据、交互、技术机制、横切、演进和风险章节。 | `01_arch_step_15_adr_traceability.md` |
| 长期架构决策索引 | 当前需要长期保留的关键决策已收敛为:独立 capability access truth 核心、正式承接边界、truth / snapshot / ref / forbidden body 分层、formal exposure / consumer view 分层、同步 / 异步 / 后台三分、非 `L0-core` sibling 运行期协作、ref / safe summary / body-free relation 优先、核心闭环与外围增强隔离。 | `01_arch_step_15_adr_traceability.md` |
| 追溯缺口边界 | governance seam、relation / descriptor 细化、secret safe summary、SDK handoff、外围只读接缝、量化目标和 implementation boundary 已显式保留为追溯缺口,不得在 Step 15 关闭。 | `01_arch_step_15_adr_traceability.md` |

---

## 5. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| none | Step 16 completed | not_blocking_02_step_01 | 当前未发现阻塞进入 `02-概要设计.md` Step 1 的上游 blocker。 | 正式 `01` 已完成;只有在用户确认后才能开始 `02` full-restart。 |

---

## 6. 当前 next_allowed_action

```text
wait_user_review_to_02_step_01
```

当前不需要提交 commit。
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `01-架构设计.md` |
| document_status | `architecture design completed` |
| current_step | `Step 16 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
