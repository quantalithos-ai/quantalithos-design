# L4-observability 01-架构设计 Step 12 · 横切关注点

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 回填章节: `01-架构设计.md` §13 横切关注点
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 13

---

## 1. 本步目标

明确 `L4-observability` 中哪些安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制要求已经上升为长期横切主线约束,并说明它们分别作用于哪些架构单元、交互边界和数据关系。

本步不写安全手册、监控 / 告警 / 日志实施方案、指标名、日志字段、trace 字段、metric label、密钥脚本、性能压测脚本、恢复手册、配置文件格式、数据库、时序库、对象存储、APM、dashboard、GRC 产品、hash 算法、API、event、DTO、schema、部署参数、worker 或代码对象。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | Step 11 已完成,用户已确认进入 Step 12 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~11 pass,Step 12 已获用户确认 | 确认本轮只允许推进 Step 12。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | 已完成 | 承接 observation truth、redaction / correlation、body-free linkage、read-only handoff、retention / no-write 和产品中立目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 承接做 / 不做、易混淆职责和禁止隐式行为。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 承接同步入口、异步观察材料消费、后台维护、观察面真相承载和派生交接承载。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 承接 `L0-core` 唯一编译期依赖、运行期 / 事件协作 / 交接边界和技术承载不得定义语义。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接 truth / projection / reference / forbidden body、一致性策略和失败处理口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步 / 异步 / 后台路径分离、关键交互失败降级和停审审计。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 承接正式承接边界、redaction-first、correlation、audit projection 分离、body-free linkage、retention、no-write guard、幂等顺序和产品中立适配。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 承接独立 observation truth + 正式边界协作主线和弃用路径。 |
| `projects/L4-observability/00-需求文档.md` §13 / §14 / §15 | 正式需求基线已完成 | 提供需求层 NFR、验收否决项、风险与待确认事项。 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | 已完成 | 提供需求层性能、可用性、安全、审计 / 可追溯、幂等 / 一致性和可观测性判断口径。 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | 已完成 | 提供核心验收和一票否决边界。 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 提供旧材料、truth 串线、正文入仓、伪证、留存 / no-write 和产品绑定风险。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 12 | 已读取 | 控制本步问题、门禁、架构单元适用性、停审和跨横切审计。 |
| `standards/document/架构设计书写规范.md` §4.13 | 已读取 | 控制横切关注点约束表、主线映射、边界说明和禁写范围。 |
| `projects/L1-governance/design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已读取 | 参考“主线约束 + 不适用项 + 横切影响说明”的组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已读取 | 参考“按架构单元组织横切约束 + 停审审计”的粒度。 |
| 旧 `design-calibration/01_arch_step_12_cross_cutting.md` | historical material,已被本文件替换 | 仅作为 schema 清单式薄产物和错误门禁诊断来源,不继承旧结论。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧产品栈、旧指标、旧横切要求和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 02 / 03 / 06 / 07 / 08 / 09 / 10 / 11、SOP Step 12 和书写规范 4.13 | done | 本文件 §2 |
| 读取需求 NFR / 验收 / 风险、旧 Step 12、旧 README / 旧正式 01 和 L1 参考 Step 12 | done | 本文件 §2 / §5 |
| 回答安全、可观测、韧性、性能、配置、审计和适用性问题 | done | 本文件 §4 |
| 输出横切关注点结论、约束表、按架构单元组织的横切约束表、不进入本章项和主线映射 | done | 本文件 §8 |
| 完成横切关注点停审和跨横切约束审计 | done | 本文件 §8.5 / §8.6 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 12 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 安全边界如何处理?

安全边界围绕 `L4-observability` 只拥有 observation / audit projection / linkage / handoff / retention / no-write truth 展开。所有观察材料准入、查询、诊断、审计投影、证据关联、报告交接、留存、重放、重建、导出、外围消费和配置变更都必须经过正式边界,不得绕过 redaction-first、safety marker、correlation context、safe ref、body-free evidence linkage 和 no-write guard。

source owner、`L0-bus`、identity、governance、artifact、runtime、sandbox、archive、SDK、console、report、external audit、GRC、dashboard、alert、APM、storage product 或任何外部产品都不能直接写 `Observability 核心语义角色`。raw body、secret、credential、payload body、full sensitive ref、raw log、raw prompt、provider response body、evidence body、artifact body、identity body、governance decision body、runtime body、archive package body、真实 `run_id`、真实 evidence alias、final verdict 和 signoff 均不得因诊断、报告、导出、留存或恢复便利而进入本仓保存路径。

### 4.2 可观测性需要覆盖哪些正式对象和关键链路?

本章的可观测性不是“给 Observability 再配监控平台”,而是要求 Observability 自身的关键状态、关键传播、关键失败和边界违例可被正式看见与定位。架构层必须能看清 observation material 准入、安全处置、correlation / safe ref 解析、audit projection、body-free evidence linkage、safe log / metric / trace、report handoff、retention marker、active reference protection、rebuild / replay、derived projection、external export、no-write violation 和产品中立适配的状态。

必须能区分 accepted、rejected、quarantined、degraded、pending、unresolved、not-visible、missing、stale、rebuilding、failed、retryable、blocked、conflict、handoff-pending、archive eligible、unsafe output 和 no-write violation 等语义。这里不指定日志字段、指标名、trace 属性、告警阈值、dashboard 配置或外部产品。

### 4.3 可用性和韧性需要守住什么底线?

核心 observation truth 内部强一致关系失败时只能明确失败、拒绝、隔离、挂起或保持原状态,不得形成半成立的准入事实、安全处置、关联语境、audit projection、evidence linkage、report handoff、retention marker 或 no-write violation。外部引用、快照、safe summary、运行信号、证据线索或消费边界缺失时,只能表达 unresolved、stale、missing、pending、not-visible、failed、retryable 或 gap,不得补造外部 truth 或正文。

派生查询、rollup、diagnostic、dashboard、alert、GRC export、archive handoff、report material、rebuild / replay 和长期分析失败时,不得回滚、覆盖或补写已经成立的 observation truth。重复、乱序、过期和重放输入必须通过幂等和顺序保护处理,不得产生重复 observation truth、重复 handoff、重复 retention 决策或状态回退。

### 4.4 性能预算是否需要给出口径?

当前不继承旧 README 或旧正式文档中的 P95 / P99 / SLA、scrape interval、冷存天数、事件数量、hash chain 分片、审计覆盖率或产品容量数字作为架构硬指标。本步只给结构性性能 / 容量预算口径。

受控准入、安全可见性、handoff 状态、retention / active reference protection 和 no-write guard 等核心同步判断不得被 dashboard、alert、GRC export、external audit、archive package、report assembly、full downstream fan-out、全量 rollup、完整事件溯源、hash chain 校验、长期分析或外部产品消费拖重。复杂读取、批量导出、长期分析、历史追溯、完整性扫描、报告材料准备和外围产品适配必须通过派生、后台承接、最终一致或后续扩展处理,不得反向塑造核心模型。

### 4.5 配置如何管理,哪些配置不应散落?

配置可以影响运行承载、采集启停、传播节奏、派生重建策略、导出启停、批量大小、降级行为、保留窗口候选、产品适配开关或外围消费策略,但不得改变 observation truth ownership、正式入口、redaction-first、forbidden body、correlation / safe ref、body-free evidence linkage、同步 / 异步 / 后台边界、只读派生、retention protection、no-write guard、依赖裁剪和审计追溯要求。

影响安全处置、可见性、report handoff、retention、archive handoff、no-write guard、外部导出和产品中立适配的配置或变更必须可审查、可追溯、可解释。具体配置 key、文件格式、环境变量、密钥存储、产品参数和部署脚本留到配置设计或实施阶段。

### 4.6 审计与可追溯性如何被正式保证?

`L4-observability` 必须能解释观察材料从哪里来、为何被接受 / 拒绝 / 隔离 / 降级、经过何种安全处置、关联到哪些 safe ref、形成了哪些只读 audit projection、有哪些 evidence linkage 线索和缺口、哪些报告交接材料被准备或阻塞、哪些留存 / 活动引用保护判断成立、哪些重放 / 重建影响发生、哪些 no-write violation 被记录。

追溯材料用于解释观察面事实、审计投影、报告交接、留存保护和越界写入防线如何成立,不是外部 source audit truth、Governance decision、Artifact lineage、runtime execution truth、archive package body 或真实验收 evidence。交接材料可以被 report、archive、external audit、GRC、SDK、console 或 dashboard 消费,但接收方状态不得反向定义本仓 truth。

### 4.7 哪些横切项与本仓无关,不应机械照抄模板?

本章不替 Identity 定义认证凭据生命周期,不替 Governance 定义 Policy / Gate / Control 结论,不替 Artifact 定义 evidence body、version、lineage 或 baseline,不替 runtime / sandbox 定义执行恢复和工具控制,不替 Archive 定义归档包正文和恢复手册,不替 Console 定义 UI 可访问性和 dashboard 布局,不替外部 APM / GRC 产品定义运维方案。

这些事项可能重要,但主体职责不属于 `L4-observability`。本仓只保留与观察材料准入、安全处置、关联、审计投影、body-free evidence linkage、运行观察面、只读诊断 / report handoff、retention、no-write、派生消费、外部交接和产品中立适配有关的横切约束。

### 4.8 每个架构单元适用哪些横切约束?

`Observability 核心语义角色` 必须同时承受安全边界、强一致、审计追溯、no-write 和配置不可越界约束。`Observability 编排 / 承接角色` 必须承受正式入口、redaction / correlation、失败不伪成功、幂等顺序、交互状态可见和维护不反写约束。`外部能力接缝角色` 必须承受外部正文不入仓、相邻 truth 不穿透、产品中立和引用缺口可见约束。`派生消费辅助角色` 必须承受只读派生、最终一致、stale / rebuilding / failed 可见和 report 不伪证约束。`技术承载角色` 必须承受产品 / 存储 / 消息 / dashboard / APM 不定义观察语义、配置不可越界、性能预算和交接不反写真相约束。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_12_cross_cutting.md` 以 log / metric / trace / audit schema 和字段组织横切结论 | Step 12 应表达长期作用于主线的横切约束,不应提前定义对象模型或字段。 | 全部降级为 historical material,本步按主线约束和架构单元适用性重写。 |
| 旧 Step 12 门禁 | `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 12 后应等待 Step 13 确认。 | 改为 `wait_user_confirmation_before_step_13`。 |
| 旧 README / 旧正式 01 | OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、147 events、冷存天数和 hash chain 分片被写成观测、性能、留存和审计主线 | 产品、指标、容量和算法不是横切架构约束本体。 | 仅作为 historical material 或后续候选输入。 |
| 需求 NFR | 已有性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性判断 | 需求层 NFR 还需翻译为长期作用于架构主线的结构约束。 | 本步把 NFR 压到架构单元、交互边界和数据关系上。 |
| Step 10 / Step 11 | 已给出机制级选型和路径级取舍 | 本步不能重写机制理由或方案比较,只说明长期横切约束如何压住主线。 | 主表按横切关注点组织。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在 | 未经新版 `07-实施计划.md` 重建,不能作为实现门禁或配置边界。 | 继续保持 historical material。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 横切表达 | schema、字段和泛 observability 能力 | 安全、审计追溯、可观测性、韧性、性能、配置六类长期架构约束 | 对齐架构规范 4.13。 |
| 安全 | 字段级 redaction 或输出过滤 | redaction-first、forbidden body、safe ref、body-free、no-write 和产品不定义 truth | 安全边界横切准入、查询、派生、交接和维护。 |
| 可观测性 | 监控平台或日志字段倾向 | 本仓自身关键状态、传播、失败和边界违例可辨识 | Observability 自身也必须可审查,但不指定产品配置。 |
| 韧性 | 技术重试或恢复脚本 | 失败显式表达,不伪成功,不补造外部 truth,外围失败不污染核心 | 对齐 Step 08 / 09 一致性和通信口径。 |
| 性能 | 旧 P95 / SLA / 冷存 / hash 数字 | 不伪量化,先固定核心同步链路不被外围拖重 | 当前缺正式负载模型。 |
| 配置 | 未形成架构红线 | 配置不得改变 truth、redaction、handoff、retention、no-write、依赖和产品中立边界 | 防止配置层暗改架构。 |
| 审计追溯 | 容易被外部 ledger 或 report 替代 | 本仓追溯材料解释观察面事实和交接,不成为外部 truth | 防止 audit projection 反写治理 / 制品 / 验收。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按通用非功能模板填安全、性能、可用性、审计 | 覆盖看似完整。 | 容易写空泛口号,与 Observability 主线无关。 | 不采用。 |
| 方案 B: 只保留持续作用于 observation truth 主线的横切约束 | 与 Step 08 / 09 / 10 / 11 主线贴合,可审查。 | 后续仍需概要 / 详细 / 配置 / 测试继续落地。 | 采用。 |
| 方案 C: 把监控字段、告警阈值、密钥、压测、配置 key、恢复脚本和产品参数写入本章 | 看起来可执行。 | 越过架构层,污染配置、测试、运维和实施边界。 | 不采用。 |
| 方案 D: 横切关注点全部后移到实施阶段 | 文档更轻。 | 后续实现缺少长期边界约束,容易串仓、泄露正文、伪证或反写真相。 | 不采用。 |
| 方案 E: 直接继承旧 P95 / SLA / 冷存 / hash chain / 产品栈 | 指标和技术想象清晰。 | 当前缺新版负载模型和验证来源,且会让产品或算法定义 observation truth。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 是否继承旧性能 / 可用性数字 | A. 直接继承;B. 当前只给结构性预算,后续测试 / 验收量化 | B | 避免无来源数字成为架构硬门禁。 |
| 是否写具体监控字段、metric label 和告警阈值 | A. 写入;B. 只定义必须可见的对象、链路和状态 | B | 架构层只约束可辨识性,不替代观测实现。 |
| 是否允许配置改变 Observability 边界 | A. 允许;B. 不允许,配置只能在既有边界内选择运行行为 | B | truth ownership、redaction、handoff、retention、no-write 和依赖裁剪不能由配置暗改。 |
| 是否把完整事件溯源 / hash chain 作为横切硬方案 | A. 是;B. 否,当前只保留 traceability、body-free linkage、integrity hint 和 gap 语义 | B | ES / hash chain 是后续详细 / 配置 / 测试或 ADR 问题。 |
| 是否把外部 APM / dashboard / GRC 横切要求写成当前产品主线 | A. 是;B. 否,只保留产品中立适配和只读消费边界 | B | 外部产品不能成为 truth source 或核心通过前置。 |

---

## 8. 结构化中间产物

### 8.1 横切关注点结论

| 结论类型 | 结论 |
|---|---|
| 横切关注点结论 | 当前进入主线的横切关注点是安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制。 |
| 适用性结论 | 这些约束只作用于 observation truth、外部正文边界、审计投影、证据线索、派生消费、交接、留存、no-write、维护和配置变更,不替相邻仓定义主体横切要求。 |
| 架构约束结论 | 任何入口、事件、后台任务、派生视图、技术后端、外部产品或配置都不得绕过 redaction-first、body-free、只读派生、retention protection、no-write guard 和依赖裁剪。 |
| 后续承接结论 | 概要、详细、配置、测试、验收和实施计划必须继承这些横切边界,但具体 schema、port、event、metric、threshold、config key、product 和测试脚本后续闭口。 |

### 8.2 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式 Observability 入口强制生效 | 受控准入、查询、诊断、report handoff、retention、维护触发、导出 | 所有改变或读取 observation truth 的路径都必须经过正式入口、可见性、redaction、correlation 和 no-write 判断。 | 防止 source owner、consumer、外部产品或维护任务打穿观察核心。 | 这是跨入口、交互和数据关系的边界规则,不是单个接口权限。 |
| 安全边界:forbidden body 永不入仓 | raw body、secret、payload、raw log、raw prompt、provider response、evidence body、artifact body、runtime body、archive body | 本仓只能保存安全摘要、引用、投影、缺口、真实性提示和交接语境,不得保存外部正文或高敏原文。 | 保护 redaction-first、body-free evidence 和相邻 truth owner。 | 适用于同步准入、异步送达、后台维护、report、export、archive 和 replay。 |
| 安全边界:相邻仓 truth 不可穿透 | identity、governance、artifact、runtime、sandbox、archive、source owner、bus、SDK、console、report、GRC | 非 core sibling 仓只能通过 ref、summary、snapshot、signal、gap、event collaboration 或 handoff 协作。 | 保护 `L0-core` 唯一编译期依赖和 sibling truth owner 平权。 | 不因调用便利引入源码依赖、正文复制或第二 truth。 |
| 安全边界:no-write guard 持续生效 | query、diagnostic、report assembly、export、rebuild、replay、retention scan、maintenance | 读侧、派生侧、维护侧和交接侧不得写入或修复 source truth,越界尝试必须拒绝、挂起或记录 violation。 | 保护本仓只观察、不反写业务 / 治理 / 制品 / 执行 truth。 | no-write 是横切防线,不是单个维护命令的局部约束。 |
| 审计与可追溯:关键观察事实变化可复盘 | material intake、safety decision、correlation、audit projection、evidence linkage、handoff、retention、rebuild、violation | 关键变化必须解释来源、actor / subject safe ref、原因、处置、关联、结果、缺口、消费目的和交接状态。 | 保护观察面事实可审计、可追溯、可解释。 | 这是 Observability 追溯语义,不是物理日志平台或外部 ledger。 |
| 审计与可追溯:交接不反写真相 | report、archive、external audit、GRC、SDK、console、dashboard、alert | 交接材料必须回指 observation truth 和 safe ref,接收方状态不得反向定义本仓 truth。 | 保护 report handoff、archive handoff 和外部审计消费边界。 | 交接失败只形成 pending、blocked、failed、retryable 或 not-visible。 |
| 可观测性:核心 truth 状态可见 | 准入、安全处置、关联、audit projection、evidence linkage、safe signal、handoff、retention、no-write | 必须能区分成立、拒绝、隔离、降级、挂起、不可见、未解析、过期、冲突、失败和待交接。 | 保护核心观察闭环是否真实成立的可审查性。 | 不指定日志字段、指标名、trace 属性或告警阈值。 |
| 可观测性:传播、派生和维护状态可见 | material delivery、truth propagation、query view、rollup、diagnostic、dashboard、alert、GRC export、rebuild、replay | 必须能区分待送达、stale、rebuilding、unavailable、handoff-pending、failed、retryable 和 degraded。 | 保护最终一致、后台承接和外围消费的可解释性。 | 下游未消费不得回滚 observation truth。 |
| 韧性 / 恢复能力:核心失败不伪成功 | 准入、redaction、安全可见性、evidence linkage、handoff、retention、no-write | 核心失败只能失败、拒绝、隔离、挂起或保持原状态,不得写成半成立或默认成功。 | 保护正式 observation truth 完整性。 | 该约束优先于调用方即时体验。 |
| 韧性 / 恢复能力:外部不可解析不补造 truth | source ref、actor / subject ref、governance ref、artifact / evidence ref、runtime signal、archive / report ref | 外部来源缺失、过期或不可解析时只表达 unresolved、stale、missing、pending、not-visible、failed 或 gap。 | 防止 Observability 为继续执行而伪造外部事实或正文。 | 适用于同步判断、异步输入和后台刷新。 |
| 韧性 / 恢复能力:外围失败不污染核心 | dashboard、alert、GRC export、external audit、archive handoff、report material、long-term analysis、product adapter | 派生或交接失败不得回滚、覆盖或补写 observation truth。 | 保护核心 truth 在外围降级情况下独立成立。 | 派生失败可返回旧视图、stale、failed、blocked 或 unavailable。 |
| 性能 / 容量约束:核心同步链路不被外围拖重 | 准入、安全查询、诊断读取、handoff 状态、retention 判断、no-write guard | full fan-out、report assembly、dashboard、alert、GRC export、archive package、hash chain、完整 ES、长期分析不得成为核心同步前置。 | 保护核心观察判断在规模增长下仍可成立。 | 当前不写具体数字,先固定结构性预算。 |
| 性能 / 容量约束:复杂消费通过派生和后台扩展 | rollup、dashboard、alert、management report、GRC export、archive handoff、history replay、gap scan、anomaly analysis | 复杂读取、批量交接、历史分析和产品适配必须通过派生、后台承接或后续扩展处理。 | 保护核心模型不被展示、报告和导出结构绑定。 | 具体容量、索引、缓存、产品和压测指标后续收敛。 |
| 配置与变更控制:配置不得越界 | 采集开关、传播节奏、派生重建、导出启停、retention window、降级策略、product adapter | 配置不得改变 truth 归属、redaction、forbidden body、correlation、body-free、同步 / 异步 / 后台边界、no-write 和依赖裁剪。 | 防止配置层暗改架构。 | 具体配置 key 后移配置设计。 |
| 配置与变更控制:高风险变更可追溯 | safety policy、visibility policy、handoff purpose、retention / hold、archive eligibility、external export、adapter activation | 影响观察主线的配置或策略变化必须可审查、可追溯、可解释。 | 保护责任语境、审计复盘和边界稳定。 | 不等同于写配置文件格式或部署脚本。 |

### 8.3 按架构单元组织的横切约束表

| 架构单元 | 安全边界 | 可观测性 | 韧性 / 恢复能力 | 性能 / 容量约束 | 配置与变更控制 | 审计与可追溯 | 停审结果 |
|---|---|---|---|---|---|---|---|
| `Observability 核心语义角色` | 只能处理正式收束后的安全观察事实,不得接收外部正文或派生反写。 | 准入、处置、关联、投影、linkage、handoff、retention、violation 状态必须可辨识。 | 输入不闭合时失败、拒绝、隔离或保持原状态。 | 不被派生、报告、归档、GRC 或产品适配拖重。 | 配置不得改变 truth ownership、redaction、body-free、no-write 或核心一致性。 | 关键 truth 变化必须可复盘。 | pass |
| `Observability 编排 / 承接角色` | 所有外部输入必须通过正式入口、safe ref、summary、snapshot、signal 或 handoff。 | pending、unresolved、rejected、quarantined、not-visible、blocked 必须可见。 | 外部不可解析不得补造 truth,重复 / 乱序不得分叉。 | 同步边界只做必要判断,复杂消费后置。 | 降级和传播配置不得改变同步 / 异步 / 后台边界。 | 必须记录来源、依据、处置、结果和交接状态。 | pass |
| `外部能力接缝角色` | 不允许相邻仓源码、正文、生命周期、外部产品配置穿透核心。 | 外部引用、摘要、产品适配和消费状态的过期 / 缺失可见。 | 缺失时 stale / unresolved / waiting / gap,不复制正文。 | 外部检查、适配和刷新不得阻塞核心 truth。 | adapter 配置不得变成 truth 规则。 | 外部材料只作为引用、摘要或依据回指。 | pass |
| `派生消费辅助角色` | query / diagnostic / rollup / dashboard / alert / GRC export / report 不得反写。 | stale、rebuilding、failed、unavailable、handoff-pending 必须可见。 | 派生失败不回滚核心,旧视图必须有 stale 语义。 | 复杂读取、报表、对账和导出通过派生 / 后台扩展。 | 派生重建配置不得改变核心模型。 | 派生材料必须回指正式 observation truth。 | pass |
| `技术承载角色` | 数据库、时序库、对象存储、queue、search、cache、APM、dashboard、GRC 不定义观察语义。 | 技术失败必须暴露为架构允许状态。 | 承载失败不得补写、覆盖或修复 source truth。 | 产品和容量策略服从核心 / 外围分离。 | 配置不得绕过边界、依赖裁剪和产品中立口径。 | 承载材料不替代 audit projection / handoff trail。 | pass |

### 8.4 不进入本章的横切项

| 横切项 | 不进入本章原因 | 正确归属 |
|---|---|---|
| Identity 认证凭据、GlobalMember 生命周期、role 管理 | 主体职责不属于 Observability。 | `L1-identity` / `L0-core` / 安全设计 |
| Governance Policy、Gate decision、AIIA / SoA / Control 结论安全 | Observability 只拥有审计投影和观察线索,不拥有治理裁决。 | `L1-governance` |
| Artifact fact、version、lineage、baseline、evidence body 完整性 | Observability 只拥有 body-free evidence linkage 和缺口语境。 | `L1-artifact` / evidence owner |
| Runtime / sandbox 执行恢复、工具控制、provider response 保存 | Observability 只拥有安全运行观察面,不拥有 execution truth。 | `L2-runtime` / `L4-sandbox` |
| Archive package body、长期归档恢复手册和 recovery body | Observability 只拥有 retention marker、active reference protection 和 archive handoff 线索。 | `L4-archive` |
| Console UI、dashboard layout、workspace view 和可访问性 | Observability 只提供只读观察面和安全摘要,不拥有展示状态。 | `L5-console` / 产品展示层 |
| 外部 APM、Prometheus、Grafana、TimescaleDB、GRC 产品运维 | 产品运维和配置不是本章架构横切结论。 | 配置设计、实施计划或外部系统文档 |
| 具体监控字段、告警阈值、日志格式、metric name、trace attribute | 属于详细设计、配置设计或测试 / 运维实现。 | `03-详细设计`、`04-配置设计`、`05-测试方案` |
| 真实验收 evidence、真实 `run_id`、signoff 和 final verdict | 真实测试与验收阶段产生,设计文档不得伪造。 | `05-测试方案`、`06-验收标准` 的真实执行结果 |

### 8.5 横切关注点停审记录

| 横切关注点 | 是否适用于本仓主线 | 是否说明作用范围 | 是否说明保护目标 | 是否未下沉实现细节 | 停审结果 |
|---|---|---|---|---|---|
| 安全边界 | pass | pass | pass | pass | pass |
| 审计与可追溯 | pass | pass | pass | pass | pass |
| 可观测性 | pass | pass | pass | pass | pass |
| 韧性 / 恢复能力 | pass | pass | pass | pass | pass |
| 性能 / 容量约束 | pass | pass | pass | pass | pass |
| 配置与变更控制 | pass | pass | pass | pass | pass |

### 8.6 跨横切约束审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在模板化空话 | pass | 每项横切约束均落到 observation truth、外部正文、审计投影、证据线索、派生、交接、留存、no-write、维护或配置边界。 |
| 是否存在适用性缺失 | pass | 已按五类架构单元判断约束适用性,并列出不进入本章的横切项。 |
| 是否存在审计追溯缺口 | pass | material intake、safety decision、correlation、audit projection、evidence linkage、handoff、retention、rebuild 和 no-write violation 均要求追溯。 |
| 是否存在配置边界遗漏 | pass | 配置不得改变 truth 归属、正式入口、redaction、body-free、同步 / 异步 / 后台边界、no-write 和依赖裁剪。 |
| 是否与 Step 08 数据语义冲突 | pass | 核心 truth 强一致、派生最终一致、forbidden body 和外部 truth 不归属口径保持一致。 |
| 是否与 Step 09 通信语义冲突 | pass | 同步核心判断、异步送达 / 传播、后台派生 / 交接 / 留存的分离保持一致。 |
| 是否与 Step 10 技术机制冲突 | pass | 横切约束压住正式承接、redaction、correlation、body-free、retention、no-write、幂等顺序和产品中立机制。 |
| 是否与 Step 11 方案取舍冲突 | pass | 没有恢复纯监控平台、业务真相聚合、外部产品主导、report-first、全同步或全异步为主线。 |
| 是否误写具体实现 | pass | 未写 API、event、DTO、schema、metric、threshold、config key、测试脚本、部署参数或产品选型。 |

### 8.7 主线映射小表

| 横切关注点 | 主要作用章节 / 主线 | 后续承接 |
|---|---|---|
| 安全边界 | 职责边界、系统上下文、依赖方向、数据所有权、关键交互、技术机制 | 概要设计、详细设计、测试方案、验收标准 |
| 审计与可追溯 | 数据所有权、关键交互、traceability / handoff trail、report / archive handoff | 详细设计、测试方案、验收标准、归档交接 |
| 可观测性 | 关键交互、一致性策略、异步传播、后台承接、派生消费 | 测试方案、验收标准、运维报告 |
| 韧性 / 恢复能力 | 数据一致性、通信方式、后台承接、外部交接、留存保护 | 详细设计、测试方案、实施计划 |
| 性能 / 容量约束 | 同步入口、派生承接、报告 / 对账 / 导出 / 归档准备 | 测试方案、验收标准、容量验证 |
| 配置与变更控制 | 技术机制、横切约束、依赖裁剪、产品中立适配 | 配置设计、详细设计、实施计划 |

### 8.8 横切影响说明

`L4-observability` 的横切关注点不是通用质量清单,而是长期压在 observation truth 主线之上的结构约束。安全、可追溯、可观测、韧性、性能和配置都服务于同一条主线:观察面独立成立,外部正文不入仓,审计投影不替代相邻 truth,证据关联保持 body-free,派生消费不反写,报告交接不伪造真实验收材料,留存和 no-write 边界可审计。具体监控、告警、密钥、压测、配置 key、恢复脚本、存储产品、hash 算法、dashboard 和外部 APM / GRC 只有在不改变这些横切约束的前提下,才能在后续设计和实施阶段继续细化。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 13. 横切关注点

> 校准来源:
> - `design-calibration/01_arch_step_12_cross_cutting.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“横切关注点结论”“横切关注点约束表”“按架构单元组织的横切约束表”“不进入本章的横切项”“跨横切约束审计表”和“横切影响说明”小节,了解本章如何从前序架构主线推导长期横切约束。

### 13.1 横切关注点结论

摘录 `design-calibration/01_arch_step_12_cross_cutting.md` §8.1。

### 13.2 横切关注点约束表

摘录 `design-calibration/01_arch_step_12_cross_cutting.md` §8.2。

### 13.3 按架构单元组织的横切约束表

摘录 `design-calibration/01_arch_step_12_cross_cutting.md` §8.3。

### 13.4 不进入本章的横切项

摘录 `design-calibration/01_arch_step_12_cross_cutting.md` §8.4。

### 13.5 主线映射

摘录 `design-calibration/01_arch_step_12_cross_cutting.md` §8.7。

### 13.6 横切影响说明

摘录 `design-calibration/01_arch_step_12_cross_cutting.md` §8.8。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 13 的待确认事项。下列事项进入后续 Step 或后续文档,不得在 Step 12 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-012-001` | 具体监控字段、日志格式、metric name、trace attribute、告警阈值和 dashboard 组织方式 | 后续详细设计、配置设计、测试方案或运维设计收敛。 |
| `Q-OBS-ARCH-012-002` | 具体数据库、时序库、搜索、缓存、对象存储、queue / broker、APM、GRC、alert sink 产品组合 | 后续配置设计、测试方案、实施计划或 ADR 收敛。 |
| `Q-OBS-ARCH-012-003` | redaction、visibility、retention、archive eligibility、external export 和 product adapter 的配置项与变更流程 | 后续配置设计和实施计划收敛。 |
| `Q-OBS-ARCH-012-004` | hash、digest、canonicalization、integrity hint、hash linkage、gap scan 和完整事件溯源是否升级为 ADR | 后续详细设计、配置设计、测试方案或 ADR 收敛。 |
| `Q-OBS-ARCH-012-005` | P95 / P99 / SLA、容量、retention window、rollup latency、handoff latency 和重建窗口 | 后续测试方案、验收标准和容量验证基于真实负载模型收敛。 |
| `Q-OBS-ARCH-012-006` | 真实 evidence、真实 `run_id`、final verdict、signoff 和验收报告格式 | 真实测试方案、验收执行和验收标准阶段收敛;设计文档不得伪造。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确长期横切关注点 | pass | 已明确安全、审计追溯、可观测、韧性、性能和配置六类主线约束。 |
| 是否说明每项作用范围和保护目标 | pass | §8.2 每项均说明作用范围、约束要求、保护目标和说明。 |
| 是否按架构单元判断适用性 | pass | §8.3 已覆盖核心语义、编排承接、外部接缝、派生辅助和技术承载。 |
| 是否完成横切停审和跨横切审计 | pass | §8.5 和 §8.6 已完成停审和冲突审计。 |
| 是否避免模板化空话 | pass | 每项约束均落到本仓 truth、数据、交互、派生、交接、配置或边界。 |
| 是否避免实现细节 | pass | 未写 API、event、DTO、schema、metric、threshold、config key、测试脚本、部署参数或产品选型。 |
| 是否避免旧材料污染 | pass | 旧产品栈、旧指标、旧 hash chain、旧事件数量和旧 implementation boundary 均作为 historical material 或后续候选处理。 |
| 是否避免 Observability 反写 source truth | pass | no-write guard、只读派生、外部 truth 不归属和 report 不伪证持续生效。 |
| 是否遵守逐 Step 停审 | pass | Step 12 完成后等待用户确认,不进入 Step 13。 |

| 门禁项 | 状态 |
|---|---|
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_13 |
| formal_document_write | not_allowed_until_step_16 |
