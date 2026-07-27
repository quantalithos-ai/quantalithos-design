# L3-capability-hub 01 架构 Step 12: 横切关注点

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 回填章节: `01-架构设计.md` §13 横切关注点
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、架构 Step 2 / 3 / 5 / 8 / 9 / 10 / 11 和需求 Step 10 / 11 / 13 / 15,只收敛长期作用于 capability access truth 主线的横切架构约束;不写安全手册、监控告警配置、日志字段、压测脚本、恢复剧本、配置 key、产品选型或实现机制。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 横切关注点 |
| 输出文件 | `design-calibration/01_arch_step_12_cross_cutting_concerns.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 12;`架构设计书写规范.md` §4.13 |
| 已读取前序输入 | yes:`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §11 及相关冲突条目作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 12;`L3-method-library` Step 12;`L0-sdk` Step 12 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 11 进入 Step 12 |
| next_allowed_action | Step 12 已完成,等待用户确认后进入 Step 13。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入横切类别思考。 |
| 横切类别:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入横切类别写入。 |
| 横切类别:再写入 | done | 横切关注点约束表 | pass | 进入架构单元适用性思考。 |
| 架构单元适用性:先思考 | done | 按 Step 5 单元逐项判断横切适用性 | pass | 进入架构单元适用性写入。 |
| 架构单元适用性:再写入 | done | 架构单元横切适用表 / 停审记录 | pass | 进入跨横切约束审计。 |
| 跨横切约束审计 | done | 冲突 / 越界 / 下沉风险审计表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留方向 / 必须废弃旧口径 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 13 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 待确认事项 / 下一步门禁 | pass | 等待用户确认 Step 13。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 12 必须检查安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制是否适用于本仓,并按架构单元停审。 | 本 Step 不能复述通用 NFR,必须回到本仓的 truth、ref、summary、通信和外围隔离边界。 |
| `standards/document/架构设计书写规范.md` §4.13 | 横切关注点表每行都必须写作用范围、约束要求、保护目标和说明;只有持续作用于多个边界、多类交互或多种数据关系的要求才可进入本章。 | 本 Step 必须写成“有约束力的横切要求”,不能只写“安全 / 性能 / 观测”标签。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,保留 Step 内计划、结构化产物、停审记录和恢复门禁。 | 本文件需要完整留下推导链,正式 `01` 暂不回填。 |
| `设计文档编写通则.md` | 横切约束必须服务已收稳的边界、职责、数据和交互主线,不能另起一套系统级常识。 | 本 Step 不能把 runtime、KMS、cost、marketplace 或 observability 平台要求移入 capability-hub 主线。 |
| `设计真相源闭环与可落码性标准.md` | 观测材料、派生视图、外部摘要和执行材料都不能成为第二真相源。 | 安全、可观测和韧性约束都必须继续保护 truth ownership。 |
| `全局项目依赖关系与裁剪规则.md` | `L0-core` 之外的跨仓关系只能按运行期、事件、ref、summary、relation 或 consumer boundary 承接。 | 配置和性能优化都不得把运行期 / 事件协作偷偷改写成源码依赖或共享 truth。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 架构目标是独立 capability access truth、identity / registry、adapter descriptor、governance seam、body-free method relation、formal exposure / consumer view 分层、变化追溯和外围隔离。 | 横切约束必须共同保护这条主线,不能借横切项重开 runtime、provider、governance truth 或 method body 路径。 |
| `01_arch_step_03_responsibility_boundary.md` | 本仓承担 access truth、风险解释、追溯、formal exposure 和派生维护边界;明确不做 execution、secret 平台、cost、approval truth、method body、SDK client、marketplace、observability store。 | 安全、配置和韧性要求必须继续把这些非职责排除在外。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 架构单元已收敛为五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用。 | 横切适用性必须逐架构单元判断,不能机械把所有约束平均分配。 |
| `01_arch_step_08_data_ownership_consistency.md` | 本仓拥有 capability access truth;consumer view / search / export / safe summary 是派生;外部对象以 ref / summary 承接;forbidden body 不得入仓。 | 安全、审计、观测和韧性都必须继续保护 truth / snapshot / ref / forbidden body 分层。 |
| `01_arch_step_09_interactions_communication.md` | 核心 truth 裁定 / 读取同步;已成立事实传播和外部结果送达异步;派生维护、对账、导出和交接后台承接。 | 性能、韧性和可观测性必须围绕这三类路径给出约束,不能回到全同步或全异步。 |
| `01_arch_step_10_technology_choices.md` | 已采用正式承接边界、依赖倒置、truth / snapshot / ref / forbidden body 分层、核心强一致 + 派生最终一致、同步 / 异步 / 后台分离、exposure / consumer view 分层、descriptor / provider runtime / secret / cost 分离、governance seam / method body-free relation 等机制。 | Step 12 需要保护这些机制不被配置、监控、优化或恢复口径绕开。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 当前主线是“独立 capability access truth 与分层承接方案”;已放弃 runtime gateway、Provider Contract、governance truth、method body、SDK client、QueryCapabilities 主导、全同步、全异步和正文复制入仓路径。 | 横切约束必须保护当前取舍,而不是重新把旧路径包装成“安全 / 韧性 / 性能需要”。 |
| `00_req_step_13_non_functional_requirements.md` | 核心闭环不能被外围增强拖垮;truth 完整性优先;禁止正文;关键变化可追溯;派生视图可滞后但不得反写。 | 本 Step 以结构性架构约束承接这些判断口径,不继承旧接口 / 旧指标。 |
| `00_req_step_15_risks_open_questions.md` | 主要风险是旧 Provider Contract、QueryCapabilities、cost、governance truth、method body、marketplace / observability / SDK / runtime 反写真相等路径回流。 | 横切约束要优先压住这些高风险回流点。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §11 和相关条目 | historical material | 只审计旧 `QueryCapabilities P95`、`Policy < 30s`、KMS / Vault、Cost Accounting、audit / observability、cache / outbox、marketplace metadata、SLA 等口径。 |
| `L1-governance` Step 12 | reference material | 参考“横切要求必须回到 truth owner、边界和交互,不能写成运维手册”的组织方式。 |
| `L3-method-library` Step 12 | reference material | 参考按横切类别、架构单元、跨横切审计和旧材料差异审计分层收口的粒度。 |
| `L0-sdk` Step 12 | reference material | 参考“禁止正文 / 真相越权、显式失败、配置不得越界”的表达方式。 |

---

## 3. 整体模块骨架

Step 12 讨论的是长期压在 capability access truth 主线之上的架构约束,不是通用质量清单,也不是安全、监控、运维或性能实施手册。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 横切类别 | 哪些横切要求已经上升为长期作用于本仓主线的正式约束。 | 不写抽象口号,不写局部实现要求。 | 横切关注点约束表。 |
| 架构单元适用性 | Step 5 每个架构单元受哪些横切要求重点约束。 | 不把全部横切项机械贴到每个单元。 | 架构单元横切适用表、停审记录。 |
| 跨横切约束审计 | 横切要求是否与数据所有权、通信方式、机制选型和方案取舍一致。 | 不写日志字段、告警阈值、权限矩阵、配置项、压测脚本或恢复流程。 | 跨横切约束审计表。 |
| 旧材料差异审计 | 旧横切方向哪些可重裁为当前约束,哪些必须废弃。 | 不继承旧 Draft 的指标、设施、服务名或实现补偿。 | 差异审计表。 |
| 回填草稿 | Step 16 装配正式第 13 章时可直接摘录哪些结构化结论。 | 不直接改正式 `01-架构设计.md`。 | 正式回填草稿。 |
| 自检与停审 | 本 Step 是否足以进入 Step 13。 | 不提前完成演进路线或后续概要 / 配置 / 测试文档。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 横切类别:先思考

问题回答:

- 本仓真正需要进入架构层的横切关注点,是那些持续作用于多个边界、多类交互和多种数据关系的结构约束:安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制。
- 这些要求共同保护同一条主线:capability access truth 独立成立;外部正文和相邻 truth owner 不入仓;formal exposure 不被 consumer view 反写;核心同步裁定不被外围增强拖垮;延迟、失败、挂起和 stale 必须可解释。
- 横切要求不能把 runtime 执行、provider 平台、governance approval、method body、SDK client、marketplace listing、audit store、cost center 或 KMS / Vault 偷偷拉回本仓。
- 旧性能和可用性数字只有在当前能力面和正式边界被重新定义后,才可能进入后续测试 / 验收量化;本 Step 不授权直接继承旧 `50ms / 30s / 99.9%` 等指标。

诊断:

- 旧 `01` 把 `QueryCapabilities`、`Policy refresh < 30s`、KMS / Vault、Cost Accounting、audit / observability、marketplace metadata、cache / outbox、SLA 和 provider failover 混进横切章节,导致横切关注点变成旧执行 / 运营 / 基础设施方案汇总。
- 如果继承旧口径,会把 formal exposure 重写成 runtime query,把 descriptor 重写成 provider contract,把审计追溯重写成 audit store,把安全边界重写成 KMS 平台,把韧性重写成 cache / replay / last-known-good,都与 Step 3 / 8 / 9 / 11 冲突。
- `00` Step 13 已明确 NFR 只给判断口径,没有授权在架构层锁定监控阈值、日志字段、压测脚本、配置项或恢复流程。

取舍:

- 采用“结构性横切约束表 + 架构单元适用性 + 跨横切审计”的方式表达。
- 不采用“类别名 + 旧数字 + 运维动作”写法。
- 保留旧方向中真正有价值的部分,但必须重裁为当前主线约束,例如“高频读取关注”重裁为“核心同步链路不被外围拖重”,“安全使用第三方能力”重裁为“正式承接边界 + forbidden body 不入仓”。

### 4.2 横切类别:再写入

#### 4.2.1 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式承接边界强制生效 | 外部能力来源、管理入口、下游消费边界、异步输入、后台维护 | 所有改变或读取 identity、registry、descriptor、seam、relation、formal exposure truth 的路径都必须经过正式承接边界;runtime / tools / SDK / console / marketplace / observability 不得直达核心 truth。 | 防止外部输入或消费面直接打穿 capability access truth。 | 这是贯穿边界、依赖、数据和交互的长期约束,不是单个接口鉴权规则。 |
| 安全边界:forbidden body 与相邻 truth 不得入仓 | descriptor、seam / relation、摘要、导出、handoff、追溯材料 | governance approval / Policy / shared_rules、method body、secret 正文、provider runtime / quota / route / failover / retry、SDK client / package、cost / billing、marketplace listing / transaction、observability log / trace / metric / audit store、production payload 不得写成本仓 truth;出现时只能拒绝、挂起或转为 ref / allowed safe summary。 | 保护 truth owner、敏感边界和禁止正文边界。 | 该约束同时服务安全、数据归属和边界可审计性。 |
| 安全边界:派生消费和外围输出只读 | controlled consumer view、search / browse、export、audit-friendly summary、ecosystem discovery、外围管理 | 所有派生、展示、导出、对账和交接材料只能从正式 truth 派生,不得创建、批准、关闭或改写 identity、registry、descriptor、seam、relation 或 exposure。 | 防止 consumer view、搜索摘要或外围材料形成第二 truth。 | 该要求保护 formal exposure 与 consumer view 分层。 |
| 审计与可追溯:核心 access truth 变化可复盘 | capability identity、registry、descriptor、governance seam、method relation、formal exposure、consumer impact | 关键变化必须能解释 actor、scope、object、reason、basis、result 和当前语义。 | 保护责任归属、边界争议审查和变化复盘能力。 | 追溯要求横切真相变化与正式读取,不是普通日志保留。 |
| 审计与可追溯:引用 / 摘要 / 交接材料来源可解释 | external ref、safe summary、导出、handoff、派生维护结果 | 引用和摘要必须能说明来源、范围、状态和是否 stale / unresolved / unavailable;交接材料不得静默改变正式 truth。 | 保护相邻系统协作和外围消费的可解释性。 | 这是对 ref / summary / handoff 的业务追溯要求,不是物理审计平台要求。 |
| 可观测性:核心状态与边界异常可见 | identity、registry、descriptor、seam、relation、exposure、review separation、forbidden body 检测 | 架构必须能区分成立、拒绝、挂起、不可见、unresolved、forbidden、stale、unavailable 等关键状态,并能发现正文误入、消费面反写、相邻 truth 回流等异常。 | 保护 capability access truth 是否真实成立的可见性。 | 该要求不指定指标名、trace 字段或告警阈值。 |
| 可观测性:传播 / 派生 / 引用失效状态可见 | 已成立事实传播、外部结果送达、consumer view、search / export、对账、handoff、引用刷新 | 架构必须能识别待传播、未送达、未消费、pending、failed、retryable、rebuilding、stale 或引用不可解析等状态。 | 保护最终一致和外围交接的可解释性。 | 下游未消费或派生未完成不得等同于核心 truth 未成立。 |
| 韧性 / 恢复能力:核心失败不伪成功 | 同步 truth 变更、identity / registry / descriptor / seam / relation / exposure 裁定 | 核心失败时只能失败、拒绝、挂起或保持原状态,不得写成半成立、默认通过或由后台补造。 | 保护正式接入事实的完整性。 | 该要求优先于“看起来一次完成”的体验。 |
| 韧性 / 恢复能力:外部不可解析不补造 truth | governance ref、method ref、external source ref、secret ref、allowed safe summary、impact feedback | 外部来源缺失、过期、类型不匹配或不可解析时,只能表达 unresolved、pending、stale、failed 或 unknown,不得复制外部正文、缓存状态或下游结果补齐。 | 防止 capability-hub 为继续前进而伪造外部事实。 | 该要求横切同步判断、异步消费和后台刷新。 |
| 韧性 / 恢复能力:外围失败不回滚核心 truth | consumer view、search / browse、export、observability / audit handoff、ecosystem discovery、reconciliation | 派生、交接、外围发现和对账失败不得回滚、覆盖或补写已成立的核心 truth。 | 保护核心闭环在降级情况下独立成立。 | 外围失败只能表现为 stale、failed、pending、rebuilding 或 unavailable。 |
| 性能 / 容量约束:核心同步链路不被外围拖重 | identity / registry / descriptor / seam / relation / exposure 同步裁定与基础读取 | 搜索、导出、审计交接、只读生态发现、候选发现、全量对账、marketplace / observability / SDK 说明不得成为核心同步前置。 | 保护 capability access truth 的基础读取和正式裁定不被外围增强放大。 | 当前不写具体时延数字,先固定结构性预算边界。 |
| 性能 / 容量约束:复杂消费通过派生和后台扩展 | controlled consumer view、search、browse、export、impact summary、reconciliation、handoff | 复杂读取、批量交接和外部友好材料必须通过派生或后台承接扩展,不得绑定核心 truth 模型或同步变更路径。 | 保护核心模型不被报表、目录浏览和交接结构牵引。 | 具体索引、缓存、批量策略后移。 |
| 配置与变更控制:配置不得改变 truth owner 与路径分层 | 运行开关、传播节奏、派生重建、降级策略、候选增强启停 | 配置不得改变 truth 归属、正式承接边界、同步 / 异步 / 后台分层、ref / safe summary / body-free relation 规则、formal exposure / consumer view 分层或外围增强位置。 | 防止配置层暗改架构主线。 | 不是配置项清单,而是配置行为的红线。 |
| 配置与变更控制:高风险变更可追溯且不得把外围提升为核心前置 | descriptor 风险规则、governance seam 承接策略、consumer view 发布节奏、外围增强启用 | 影响核心 truth、正式暴露、边界拒绝口径或外围进入条件的变更必须可审查、可追溯、可解释;不得通过开关把 search / export / discovery / handoff 变成核心成功前置。 | 保护主线稳定和演进可控。 | 具体配置 key、审批流程和脚本留到后续文档。 |

#### 4.2.2 主线映射小表

| 横切关注点 | 主要作用章节 / 主线 | 后续承接 |
|---|---|---|
| 正式承接边界、forbidden body、不反写 | 职责边界、依赖方向、数据所有权、关键交互、当前主线方案 | `02-概要设计.md`;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 追溯与引用 / 摘要可解释 | 数据所有权、关键交互、追溯与变化感知、方案取舍 | `03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md`;`07-实施计划.md` |
| 可观测性与状态可见 | 同步裁定、异步传播、后台承接、派生维护 | `03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 核心失败不伪成功、外围失败不回滚 | 一致性策略、通信方式、技术机制、主线方案 | `03-详细设计.md`;`05-测试方案.md`;`07-实施计划.md` |
| 核心同步链路不被外围拖重 | formal exposure / consumer view 分层、后台派生、外围增强隔离 | `02-概要设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 配置不得越界 | 技术机制、依赖裁剪、外围增强位置、后续配置设计 | `04-配置设计.md`;`05-测试方案.md`;`07-实施计划.md` |

### 4.3 架构单元适用性:先思考

问题回答:

- 五个核心子域最强调安全边界、审计追溯和配置红线,因为它们直接拥有 capability access truth。
- 支撑子域重点承受可观测性、韧性和“派生不得反写”的压力,否则外围失败很容易污染核心。
- 五类本地索引 / 投影 / 引用重点承受 forbidden body、防复制、引用有效性和状态可见性约束,否则最容易变成第二 truth。
- 若每个单元都写“全部适用且同样重要”,就失去停审价值;必须说明不同单元最怕什么。

诊断:

- `正式暴露与受控消费语义` 最容易被 runtime / tools / SDK / QueryCapabilities 路径反写,因此比其他核心单元更强调派生只读和性能边界。
- `治理与方法关系语义` 最容易吸收 governance truth 或 method body,因此更强调 forbidden body、引用有效性和职责分离。
- `派生维护与消费快照语义` 和 `外围管理与发现语义` 最容易在“为了好用”时越界成核心写源,因此更强调只读、可观测和配置边界。
- 本地影子层若约束不严,很容易通过 safe summary、audit handoff、consumer ref 或 discovery summary 形成外部正文回流。

取舍:

- 逐架构单元写重点横切关注点和单元级约束,不机械复制主表。
- 停审结论只回答“当前单元的横切重点是否成立”,不提前写对象字段、接口或状态机。

### 4.4 架构单元适用性:再写入

| 架构单元 | 重点横切关注点 | 约束要求 | 停审结论 |
|---|---|---|---|
| 能力身份语义 | 安全边界、审计与可追溯、韧性 / 恢复能力 | identity 只能由正式承接建立和变更;重复输入不得制造分叉 identity;关键身份变化必须可复盘。 | 通过 |
| 注册目录语义 | 安全边界、韧性 / 恢复能力、性能 / 容量约束 | registry truth 不得由搜索 / 浏览 / listing / consumer view 反写;目录维护失败不得创造或回滚 registry truth。 | 通过 |
| 接入描述语义 | 安全边界、审计与可追溯、配置与变更控制 | descriptor 不得吸收 secret、provider runtime、cost 或 invocation truth;高风险描述变化必须可追溯、不可被开关绕过。 | 通过 |
| 治理与方法关系语义 | 安全边界、审计与可追溯、韧性 / 恢复能力 | 只允许 governance ref / allowed summary 和 method asset ref / body-free relation;外部 ref 不可解析时只能 unresolved / pending。 | 通过 |
| 正式暴露与受控消费语义 | 安全边界、性能 / 容量约束、可观测性、配置与变更控制 | formal exposure 只能由核心 truth 同步裁定;consumer view 只能派生;消费面滞后 / 不可用必须可见且不可反写真相。 | 通过 |
| 接入审查与风险解释语义 | 安全边界、审计与可追溯、配置与变更控制 | access review fact 必须与 governance approval 分离;风险解释只能使用允许摘要或 ref,不得越权形成治理 truth。 | 通过 |
| 追溯与变化感知语义 | 审计与可追溯、可观测性、韧性 / 恢复能力 | 关键变化、consumer impact 和交接状态必须可解释;追溯缺失不能只保留最终状态。 | 通过 |
| 派生维护与消费快照语义 | 可观测性、韧性 / 恢复能力、性能 / 容量约束 | consumer view、search、browse、export 和对账必须显式表达 stale / rebuilding / unavailable,且不能拖重核心同步链路。 | 通过 |
| 外围管理与发现语义 | 安全边界、性能 / 容量约束、配置与变更控制 | 候选发现、只读生态发现和外围说明只能作为增强,不得借配置或读取路径变成核心前置。 | 通过 |
| 外部能力来源引用 | 安全边界、可观测性、韧性 / 恢复能力 | 只保存来源 ref 或允许摘要;来源缺失或变化异常必须可见,不得复制外部协议 / 认证 / 运行正文。 | 通过 |
| 治理与方法外部引用 | 安全边界、审计与可追溯、韧性 / 恢复能力 | 只保存 governance result / policy result ref、safe summary 和 method asset ref;失效时只能 unresolved / stale / pending。 | 通过 |
| 安全与敏感边界引用 | 安全边界、可观测性、配置与变更控制 | 只允许 secret ref 和 secret handling safe summary;任何 secret 正文误入必须可发现、可拒绝,不得靠配置放行。 | 通过 |
| 下游消费与 SDK 引用 | 安全边界、可观测性、性能 / 容量约束 | runtime / tools / SDK consumer ref 只用于解释消费边界和影响;消费状态不得反写 formal exposure 或把客户端要求拉回核心同步路径。 | 通过 |
| 观测 / 生态 / 外部文档引用 | 安全边界、审计与可追溯、韧性 / 恢复能力 | 只允许 observability / audit ref、marketplace object ref、external document ref 和允许摘要;外部交接失败不回滚 truth。 | 通过 |

### 4.5 横切关注点停审记录

| 横切类别 | 停审结论 | 说明 |
|---|---|---|
| 安全边界 | pass | 已明确正式承接、forbidden body、只读派生和相邻 truth owner 边界。 |
| 审计与可追溯 | pass | 已覆盖核心 truth 变化、引用 / 摘要状态和交接材料来源解释。 |
| 可观测性 | pass | 已覆盖核心状态、边界异常、传播 / 派生 / 引用失效状态可见。 |
| 韧性 / 恢复能力 | pass | 已覆盖核心失败不伪成功、外部不可解析不补造、外围失败不回滚。 |
| 性能 / 容量约束 | pass | 已明确核心同步链路与复杂派生 / 外围增强分层。 |
| 配置与变更控制 | pass | 已明确配置不能改变 truth owner、路径分层或外围进入条件。 |

---

## 5. 跨横切约束审计

### 5.1 审计思考

问题回答:

- 横切约束必须同时与 Step 8 的数据归属、Step 9 的通信方式、Step 10 的机制选型和 Step 11 的方案取舍一致,否则会出现“横切项单独正确,合起来打架”的情况。
- 最容易发生的冲突有四类:用可观测性重写 truth、用韧性重写一致性、用性能重写边界、用配置重写职责。
- 旧材料中的 cache / outbox / replay / last-known-good / KMS / cost / QueryCapabilities 指向的是一些真实风险,但当前只能保留结构性风险判断,不能保留旧实现动作。

取舍:

- 通过专门审计表逐项确认“不下沉到实现,也不反向改写上游 Step 结论”。
- 对所有“看起来有帮助”的旧优化路径保持克制,除非它仍能以当前边界语言表达。

### 5.2 审计表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否把可观测材料写成第二 truth | 未发现 | 可观测性只要求关键状态和异常可见,未把 log / trace / metric / audit store 升级为 truth owner。 |
| 是否把韧性写成 cache / replay / last-known-good 方案 | 未发现 | 韧性只保留 failure 语义和恢复边界,未继承旧补偿实现。 |
| 是否把性能写成旧 QueryCapabilities / Policy 指标 | 未发现 | 只保留结构性性能预算,未继承 `P95 < 50ms` 或 `30s`。 |
| 是否把配置写成可绕开 boundary 的 feature flag | 未发现 | 已明确配置不得改变 truth owner、formal boundary 或同步 / 异步 / 后台分层。 |
| 是否与 Step 8 truth / snapshot / ref / forbidden body 分层冲突 | 未发现 | 安全、审计和可观测都继续保护四类分层。 |
| 是否与 Step 9 同步 / 异步 / 后台路径分层冲突 | 未发现 | 性能和韧性承接三类路径,未强制全同步或全异步。 |
| 是否与 Step 11 当前主线方案冲突 | 未发现 | 横切约束强化了 access truth 主线,未重新打开 runtime gateway、Provider Contract、governance truth、QueryCapabilities 主导等路径。 |
| 是否下沉到监控、压测、权限矩阵、runbook 或配置项 | 未发现 | 所有表项均停留在架构约束层。 |

---

## 6. 旧材料差异审计

### 6.1 可保留为当前横切约束方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| 平台需要安全使用第三方能力,不能让外部能力直接打穿主线 | 收敛为“正式承接边界强制生效”和“forbidden body / 相邻 truth 不得入仓”。 |
| 高频读取和下游消费不能拖垮主链 | 收敛为“核心同步链路不被外围拖重”和“formal exposure / consumer view 分层”。 |
| governance 变化与外部接缝需要可追溯 | 收敛为“核心 truth 变化可复盘”和“引用 / 摘要 / 交接材料来源可解释”。 |
| 安全和审计材料需要可观测 | 收敛为“核心状态与边界异常可见”“传播 / 派生 / 引用失效状态可见”。 |
| 接入失败和外围失败需要有恢复口径 | 收敛为“核心失败不伪成功”“外部不可解析不补造 truth”“外围失败不回滚核心 truth”。 |

### 6.2 必须废弃的旧口径

| 旧口径 | 为什么不能在 Step 12 继承 | 后续处理 |
|---|---|---|
| `QueryCapabilities P95 < 50ms` | 绑定旧 runtime 查询和 allow / deny 语义,已不对应当前 formal exposure / consumer view 边界。 | 仅保留为 historical conflict;后续若需量化,基于正式能力面重定义。 |
| `Policy refresh < 30s` | 本仓不拥有 Policy truth 或白名单刷新职责。 | 改为 governance seam 延迟可解释;量化若需要后移测试 / 验收。 |
| `KMS/Vault` 作为横切安全核心 | 本仓不是 secrets 平台;KMS / Vault truth 不归 capability-hub。 | 只保留 secret ref / safe summary 和禁止正文边界。 |
| `Cost Accounting` / `CostRecord` / 成本覆盖率 | cost / billing / finance ledger 不归本仓。 | 作为 historical conflict 排除。 |
| provider failover / retry / routing / quota | 属于 provider runtime / execution platform,不是 descriptor 或横切主线。 | 保持边界外,不得回流。 |
| audit store / observability 平台作为追溯事实本体 | 观测存储不等同 capability access traceability truth。 | 只保留业务追溯与 handoff 语义。 |
| `cache TTL`、`outbox`、`replay`、`last-known-good`、`worker` | 属于实现或运维恢复策略,不属于架构横切约束。 | 后续概要 / 详细 / 实施若需要,必须服从当前横切红线。 |
| marketplace metadata publish 作为主线 | 只读发现和外围生态不能反写 registry / exposure truth。 | 仅保留外围增强和只读引用口径。 |
| SLA `99.9%` 等旧可用性数字 | 缺少与当前六类能力面对应的正式基线。 | 后续若需量化,在测试 / 验收阶段基于当前边界重定。 |

---

## 7. 回填草稿

### 13. 横切关注点

> 校准来源:
> - `design-calibration/01_arch_step_12_cross_cutting_concerns.md`
>
> 延伸阅读:
> - 建议继续阅读本文件中的“架构单元适用性”“跨横切约束审计”和“旧材料差异审计”小节,了解这些横切约束如何从数据、交互、技术机制和方案取舍收敛。

#### 13.1 横切关注点约束

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式承接边界强制生效 | 外部能力来源、管理入口、下游消费边界、异步输入、后台维护 | 所有改变或读取 identity、registry、descriptor、seam、relation、formal exposure truth 的路径都必须经过正式承接边界。 | 防止外部输入或消费面直接打穿 capability access truth。 | 长期作用于边界、依赖、数据和交互。 |
| 安全边界:forbidden body 与相邻 truth 不得入仓 | descriptor、seam / relation、摘要、导出、handoff、追溯材料 | governance truth、method body、secret 正文、provider runtime、SDK client、cost、marketplace、observability、production payload 等不得写成本仓 truth。 | 保护 truth owner、敏感边界和禁止正文边界。 | 出现时只能拒绝、挂起或转为 ref / allowed safe summary。 |
| 安全边界:派生消费和外围输出只读 | controlled consumer view、search / browse、export、audit-friendly summary、ecosystem discovery、外围管理 | 派生、展示、导出、对账和交接材料只能从正式 truth 派生,不得改写核心 truth。 | 防止第二 truth 形成。 | 保护 formal exposure 与 consumer view 分层。 |
| 审计与可追溯:核心 truth 变化可复盘 | identity、registry、descriptor、seam、relation、formal exposure、consumer impact | 关键变化必须能解释 actor、scope、object、reason、basis 和 result。 | 保护责任归属和变化复盘能力。 | 不是普通日志保留要求。 |
| 可观测性:关键状态和异常可见 | 核心 truth、边界异常、传播 / 派生 / 引用状态 | 必须能区分成立、拒绝、挂起、unresolved、forbidden、stale、failed、unavailable 等状态。 | 保护 capability access truth 成立与否的可见性。 | 不指定具体监控平台或阈值。 |
| 韧性 / 恢复能力:核心失败不伪成功 | 核心同步裁定、外部 ref 解析、派生 / 交接失败 | 核心失败只能失败、拒绝、挂起或保持原状态;外部不可解析不补造 truth;外围失败不回滚核心 truth。 | 保护正式接入事实完整性和降级边界。 | 适用于同步、异步和后台三类路径。 |
| 性能 / 容量约束:核心同步链路不被外围拖重 | 基础读取、正式变更、formal exposure 裁定 | 搜索、导出、审计交接、只读生态发现和其他外围增强不得成为核心同步前置。 | 保护 capability access truth 主链。 | 当前只给结构性预算,不写旧时延指标。 |
| 配置与变更控制:配置不得越界 | 运行开关、传播节奏、派生重建、降级策略、外围增强启停 | 配置不得改变 truth owner、formal boundary、同步 / 异步 / 后台分层、ref / safe summary / body-free relation 规则或外围进入条件。 | 保护已收稳架构主线。 | 不是配置项清单。 |

#### 13.2 横切影响说明

这些横切关注点进入架构层,是因为它们持续作用于 capability access truth 的边界、数据关系、交互节奏和外围隔离。它们共同保证:核心 truth 独立成立,外部正文不入仓,formal exposure 不被 consumer view 反写,外围增强不会拖垮核心链路,失败和滞后始终可解释。监控字段、压测阈值、配置 key、恢复流程、KMS / Vault 产品、cache / outbox 方案和 provider runtime 细节都后移到后续文档,但不得反向改变这里的横切约束。

---

## 8. 自检与停审

### 8.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确哪些横切关注点已经上升为长期主线要求 | pass | 已收敛六类横切关注点及其具体约束。 |
| 是否写清作用范围、约束要求和保护目标 | pass | 主表逐项给出四列信息。 |
| 是否按架构单元判断适用性 | pass | Step 5 的五个核心子域、四个支撑子域和五类本地影子均已停审。 |
| 是否与 Step 8 / 9 / 10 / 11 保持一致 | pass | 未引入与 truth ownership、通信方式、技术机制或当前主线相冲突的新口径。 |
| 是否避免实现细节 | pass | 未写监控字段、阈值、日志清单、权限矩阵、配置项、压测脚本或恢复剧本。 |
| 是否可进入 Step 13 | pass | 横切约束已闭合,可进入演进路线。 |

### 8.2 待确认事项

| 编号 | 待确认项 | 当前处理口径 | 影响 |
|---|---|---|---|
| ARCH-CH-S12-OPEN-001 | 是否需要在后续文档中量化 formal exposure 基础读取、变化传播、派生维护和 handoff 时延目标。 | Step 12 只保留结构性性能预算,量化后移测试方案 / 验收标准。 | `05-测试方案.md`;`06-验收标准.md` |
| ARCH-CH-S12-OPEN-002 | secret handling safe summary、governance safe summary 和 observability / audit safe summary 的最小字段形态。 | 当前只钉住 allowed safe summary 边界,字段级定义后移。 | `03-详细设计.md`;`04-配置设计.md` |
| ARCH-CH-S12-OPEN-003 | consumer view、search / export、reconciliation 和外部 handoff 的状态表达是否需要统一 schema。 | 当前只收敛状态语义和不可反写原则,不定义 schema。 | `03-详细设计.md`;`07-实施计划.md` |

### 8.3 进入下一步条件

- 已明确正式承接边界、forbidden body、不反写、追溯、状态可见、失败恢复、性能分层和配置红线等横切约束。
- 已按 Step 5 架构单元逐项判断横切适用性并停审。
- 已确认旧 `QueryCapabilities`、`Policy 30s`、KMS / Vault、Cost Accounting、audit store、cache / outbox / replay、marketplace metadata 和 SLA 数字不得直接继承。
- 未写安全手册、监控告警配置、日志字段、压测脚本、恢复剧本、配置 key 或产品选型。
- 可以进入 Step 13 `演进路线`。
