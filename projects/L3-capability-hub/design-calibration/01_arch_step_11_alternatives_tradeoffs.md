# L3-capability-hub 01 架构 Step 11: 备选方案与取舍

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 回填章节: `01-架构设计.md` §12 备选方案与取舍
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、架构 Step 2 / 3 / 7 / 8 / 9 / 10 和需求 Step 10 / 11 / 12 / 13 / 15 重新比较路径级备选方案;旧 `01-架构设计.md` §1~§9 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 11 备选方案与取舍 |
| 输出文件 | `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 11;`架构设计书写规范.md` §4.12 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md`;`00_req_step_16_traceability_matrix.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §1~§9 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 11;`L3-method-library` Step 11;`L0-sdk` Step 11 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 10 进入 Step 11 |
| next_allowed_action | Step 11 已完成,等待用户确认后进入 Step 12。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入当前主线识别思考。 |
| 当前主线识别:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入当前主线识别写入。 |
| 当前主线识别:再写入 | done | 当前主线方案短文 / 主线图 | pass | 进入相邻替代路径筛选思考。 |
| 相邻替代路径筛选:先思考 | done | 有效替代路径与排除项 | pass | 进入相邻替代路径写入。 |
| 相邻替代路径筛选:再写入 | done | 方案路径比较表 | pass | 进入取舍收束思考。 |
| 取舍收束:先思考 | done | 得到 / 失去 / 当前结论 | pass | 进入取舍收束写入。 |
| 取舍收束:再写入 | done | 轻量取舍对照表 / 方案边界说明 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §12 候选文本 | pass | 进入 blocker 判定与自检。 |
| Blocker 判定与自检 | done | blocker 表 / 自检表 / 下一步门禁 | pass | 等待用户确认 Step 12。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 11 必须把当前方案与主要备选方案放到同一判断框架下比较,说明为什么选择当前方案以及为什么放弃其他方案。 | 本 Step 必须比较路径级结构替代,不能只重复 Step 10 单项机制理由。 |
| `standards/document/架构设计书写规范.md` §4.12 | 备选方案是与当前主线构成结构性替代关系的方案路径,不是产品名、框架名、局部实现方式或未来愿望池。 | 方案表必须包含解决的问题、主要收益、主要代价 / 约束、当前结论和说明。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,保留模块计划、恢复门禁、结构化产物、回填草稿和自检。 | 本文件保留过程判断;正式 `01` 暂不回填。 |
| `standards/document/设计文档编写通则.md` | 架构设计先边界后实现,正式章节只承载收口结论。 | 本 Step 不写 API、DTO、状态、对象字段、存储、协议、测试或实施 boundary。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 取舍结论不能制造多 truth source,也不能让实现端私补 schema、port、state、mapper、config key 或 evidence。 | 不把边界外事项包装为合法备选;不通过“保留观察”绕过红线。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 是唯一编译期依赖候选;运行期 / 事件 / ref / summary / consumer boundary 必须分清。 | 替代路径比较必须围绕依赖裁剪、数据归属、一致性和跨仓边界展开。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 架构目标是独立 capability access truth、identity / registry、adapter descriptor、governance seam、method relation、formal exposure / consumer view 分层、变化追溯、外围隔离和跨仓协作。 | 当前主线必须保护这些结构目标;破坏这些目标的路径不得采用。 |
| `01_arch_step_03_responsibility_boundary.md` | 本仓承担 access truth、identity、registry、descriptor、risk / review、governance seam、body-free method relation、formal exposure、traceability / impact 和派生维护 / safe summary 边界;明确不做 execution、secret、cost、approval truth、method body、SDK client、marketplace、observability store 等。 | 已被职责边界排除的事项不再作为合法备选方案,只能作为历史冲突或边界外说明。 |
| `01_arch_step_07_dependency_direction.md` | `L0-core` 是唯一编译期依赖候选;外部来源、governance、method、runtime / tools、SDK、bus、console、marketplace、observability、secret、finance 都必须经正式边界、ref、safe summary、relation 或 controlled view 进入。 | 替代路径需要重点比较直接穿透、共享 truth、源码依赖和消费面反写风险。 |
| `01_arch_step_08_data_ownership_consistency.md` | 本仓拥有 capability access truth;快照 / 投影、引用关系和 forbidden body 分层;核心 truth 强一致,派生 / 交接最终一致。 | 方案比较必须写清 truth、snapshot、reference、forbidden body 和一致性代价。 |
| `01_arch_step_09_interactions_communication.md` | 核心 truth 裁定 / 读取同步,已成立事实传播和外部结果送达异步,派生维护和对账后台承接。 | 全同步、全异步、后台补 truth 等路径需要进入比较。 |
| `01_arch_step_10_technology_choices.md` | 已采用正式承接边界、依赖倒置、truth / snapshot / ref / forbidden body 分层、核心强一致 + 派生最终一致、同步 / 异步 / 后台三类路径、exposure / consumer view 分层、descriptor / provider runtime / secret / cost 分离、governance seam / method body-free relation、ref / safe summary 优先、traceability / impact / handoff、外围隔离和逻辑可分承载。 | Step 11 不逐项重证机制,而把这些机制组合成主线路径并与相邻路径比较。 |
| 正式 `00-需求文档.md` | 本仓是外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓;不是 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret/KMS 或 cost/billing 仓。 | 当前主线命名和备选路径必须从正式需求边界出发,旧 README / 旧 `01` 不作为基线。 |
| `00_req_step_10_business_rules_boundaries.md` | 业务规则已钉住 identity、registry、descriptor、seam、relation、exposure、显式变化、禁止正文和相邻仓边界。 | 违反规则的不作为可采用路径,但可作为历史冲突说明。 |
| `00_req_step_11_data_ownership.md` | 数据分为 truth / snapshot / ref / forbidden body;controlled consumer view / `CapabilityDecision` 类结果只能是快照。 | consumer view 主导、QueryCapabilities 主导和外部正文复制路径必须被明确放弃。 |
| `00_req_step_13_non_functional_requirements.md` | 核心闭环不被外围增强拖垮;truth 完整性优先;禁止正文;关键变化可追溯;派生视图可滞后但不得反写。 | marketplace / console / observability / export first 路径不能成为核心主线。 |
| `00_req_step_15_risks_open_questions.md` | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / evidence / boundary 等仍未闭口。 | 未闭口事项不能被包装成当前已经采用的完整实现路径。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` | historical material | 只审计旧 MCP Registry / A2A Directory / Provider Contract / Cost Accounting / QueryCapabilities / KMS / Vault / Policy refresh / PostgreSQL / bus(outbox) / marketplace metadata 等口径。 |
| `L1-governance` Step 11 | reference material | 参考独立 truth 主线与外部 GRC、Policy engine、report、全同步、全异步等路径比较粒度。 |
| `L3-method-library` Step 11 | reference material | 参考 full-restart 下当前主线识别、相邻替代路径筛选、边界说明和旧材料审计结构。 |
| `L0-sdk` Step 11 | reference material | 参考 SDK exposure / client boundary、公共发布先行、全量覆盖先行等路径裁剪方式。 |

---

## 3. 整体模块骨架

Step 11 比较的是路径级架构方案,不是具体产品、接口、对象、状态、协议、部署或实现算法。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 当前主线识别 | 当前架构主线方案是什么,它由哪些前序结论组成。 | 不逐项重写 Step 10 的机制采用理由。 | 当前主线方案短文和主线图。 |
| 相邻替代路径筛选 | 哪些方案路径与当前主线构成有效替代关系。 | 不把边界外职责、未来愿望或局部技术变体写成备选方案。 | 有效替代路径判断、方案路径比较表。 |
| 取舍收束 | 当前采用什么、不采用什么,得到什么、牺牲什么。 | 不写产品横评、技术栈比较、接口时序或实现算法。 | 轻量取舍对照表、方案边界说明。 |
| 旧材料差异审计 | 旧取舍方向哪些可保留,哪些必须废弃或挂起。 | 不继承旧 Draft 状态、旧服务名、旧指标、旧实现细节或旧主线。 | 差异审计表。 |
| 回填草稿 | Step 16 装配正式 §12 时可使用的候选文本。 | 不直接改正式 `01-架构设计.md`。 | 正式回填草稿。 |
| 自检与停审 | 本 Step 是否足以进入 Step 12。 | 不提前完成横切关注点。 | blocker 表、自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 11 completed_stop_review | pass | 当前主线方案、方案路径比较表、轻量取舍对照表、方案边界说明、旧材料审计、回填草稿、blocker 判定和自检均完成。 | `wait_user_review_to_step_12` |

---

## 5. 模块思考记录

### 5.1 当前主线识别:先思考

问题回答:

- 当前主线不能命名为“Registry + Provider Contract + QueryCapabilities”,因为这会继承旧 runtime gateway、provider runtime、secret、cost 和 policy cache 口径。
- 当前主线也不能命名为“统一能力执行入口”,因为本仓明确不执行 MCP / A2A / API 调用,不承担 tools execution 或 runtime execution。
- 前序 Step 已经收敛的结构路径是:独立 capability access truth;正式承接边界隔离外部输入;identity / registry / descriptor / seam / relation / exposure 作为核心 truth;ref / safe summary / body-free relation 作为相邻协作方式;formal exposure 与 controlled consumer view 分层;核心同步裁定、已成立事实异步传播、派生 / 对账 / 导出后台承接;核心闭环与外围增强隔离。
- 这条主线不是产品栈或实现方案,不会固定 Rust、PostgreSQL、cache、outbox、message broker、HTTP / RPC、KMS / Vault、provider adapter、event topic、payload schema、consumer group 或 P95 / SLA。

诊断:

- 如果 Step 11 只写“当前方案最好”,读者无法理解为什么旧 Provider Contract、QueryCapabilities、Cost、KMS、marketplace metadata 和 runtime whitelist 不采用。
- 如果 Step 11 把已经排除的边界外事项全部写成备选方案,会在形式上重新打开职责边界。
- 如果 Step 11 使用局部机制作为方案行,如 `outbox`、`cache`、`PostgreSQL`、`HTTP/RPC`,会重复 Step 10 或下沉到后续概要 / 详细设计。
- 当前需要比较的是“谁主导 capability access truth 和消费边界”的路径级选择。

取舍:

- 主线命名为“独立 capability access truth 与分层承接方案”。
- 主线表达为结构路径,而不是旧对象清单或实现机制。
- 比较表中主线与相邻路径同表比较,不把主线放在表外单边赞美。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确当前主线 | pass | 主线命名为独立 capability access truth 与分层承接方案。 |
| 是否来自前序结论 | pass | 主线由 Step 2 / 3 / 7 / 8 / 9 / 10 和正式 `00` 共同推导。 |
| 是否避免旧实现名 | pass | 未用 Provider Contract、QueryCapabilities、Cost、KMS、PostgreSQL 或 outbox 命名主线。 |
| 是否可进入“当前主线识别:再写入” | pass | 可形成主线短文和结构图。 |

### 5.2 当前主线识别:再写入

当前采用“独立 capability access truth 与分层承接方案”:

```text
独立 capability access truth
  -> 正式承接边界隔离外部输入
  -> identity / registry / descriptor / seam / relation / exposure truth
  -> ref / safe summary / body-free relation 承接相邻系统
  -> formal exposure truth 与 controlled consumer view 分层
  -> 核心 access truth 同步裁定
  -> 已成立 capability access fact 异步传播
  -> 派生 / 对账 / 导出 / handoff 后台承接
  -> 核心闭环与外围增强隔离
```

该主线的核心判断是:capability-hub 的首要职责是守住外部能力接入事实的独立真相,而不是成为外部能力执行网关、provider 平台、治理审批仓、方法资产正文仓、SDK client 仓、marketplace 目录或观测 / 成本中心。外部来源、governance、method-library、runtime、tools、SDK、marketplace、observability、secret 和 finance 都可以与本仓协作,但只能通过正式边界、ref、safe summary、body-free relation、事件协作或受控消费视图进入,不能反向定义本仓 truth。

---

### 5.3 相邻替代路径筛选:先思考

问题回答:

- 有效替代路径必须会改变主线结构判断,例如谁拥有 access truth、谁定义正式暴露、谁主导 descriptor、核心变更用同步还是异步、外部正文是否入仓、派生消费是否反写。
- 可以进入比较的相邻路径包括:runtime / tools execution gateway 主导、Provider Contract / provider platform 主导、governance approval / Policy truth 主导、method-library definition 合并、SDK client / gateway-first、marketplace listing / ecosystem directory 主导、QueryCapabilities / consumer view 主导、全同步闭环、全异步事件化、复制外部正文 / secret / provider data 入仓。
- 其中 runtime execution、governance approval truth、method body、SDK client、marketplace transaction、secret / KMS、cost / billing 等本身已被前文排除,所以它们不是“仍可采用的合法备选”,而是历史上容易回流的结构冲突路径。本 Step 比较它们的路径收益与代价,目的是说明为什么不得作为当前主线。
- 产品 / 实现变体不进入主比较:PostgreSQL vs 其他存储、cache vs no cache、HTTP vs RPC、outbox vs direct publish、KMS / Vault 产品、message broker、provider adapter、topic、payload schema、consumer group、P95 / 30s 指标都属于后续文档或历史冲突。

诊断:

- 旧文档的“统一 Registry + Contract + Policy-aware query”看似是一个架构方案,但它把 registry、provider contract、policy cache、runtime query、secret 和 cost 混在一起,实际是多条已冲突路径的组合。
- “QueryCapabilities”旧方向有真实消费诉求,但若作为主线会让 consumer view 反写 formal exposure。
- “marketplace metadata publish”旧方向有生态发现价值,但若作为主线会让 listing / discovery 反写 registry truth。
- “全同步”容易被误认为更一致,但会让下游、governance、method、observability、export 和 marketplace 可用性阻塞核心 truth。
- “全异步”容易被误认为更解耦,但会让 identity、registry、descriptor、seam、relation 和 exposure 缺少即时成立 / 拒绝口径。

取舍:

- 主表纳入结构性替代路径,并对已被排除的方向明确写为“不采用”或“不作为有效候选继续打开”。
- 保留后续演进空间的方向使用“不采用为当前主线”或“保留外围演进”,例如 marketplace 只读发现、SDK exposure 扩展、observability handoff 和 provider adapter 实现。
- 不通过 Step 11 关闭字段、状态、schema、protocol、API 或 implementation boundary。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否筛选路径级替代 | pass | 方案均会改变 truth owner、边界、依赖、一致性、交互或演进主线。 |
| 是否排除局部实现变体 | pass | 未把数据库、缓存、消息、协议、outbox 或 KMS 产品作为主比较。 |
| 是否避免重新打开边界外职责 | pass | 已被排除的方向只作为冲突路径说明,不作为可采用候选。 |
| 是否可进入“相邻替代路径筛选:再写入” | pass | 可形成方案路径比较表。 |

### 5.4 相邻替代路径筛选:再写入

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 capability access truth 与分层承接方案 | 在多外部来源、多相邻仓消费、多治理 / 方法 / SDK / 生态协作中保持能力接入事实稳定、可追溯、可消费。 | 同时保护 identity、registry、descriptor、seam、relation、formal exposure、依赖裁剪、forbidden body、消费派生和外围隔离。 | 增加正式承接、ref / safe summary、consumer view、stale / unresolved、handoff、后台维护和边界测试成本。 | 采用 | 这是当前主线,最符合 Step 2~10 已收敛约束。 |
| Runtime / tools execution gateway 主导路径 | 让外部 MCP / A2A / API 能力统一经过执行网关调用和控制。 | 执行入口集中,调用、拦截、运行反馈和可用性体验更直接。 | 会把 execution truth、provider invocation、runtime cache、tools result 和 allow / deny enforcement 拉入本仓。 | 不采用 | 本仓只拥有 access truth;执行归 `L2-runtime` / `L2-tools` 或 provider adapter 边界。 |
| Provider Contract / provider platform 主导路径 | 用 provider contract 统一接入方式、secret、quota、route、failover、retry、cost 和 provider 状态。 | provider 管理集中,外部 API / provider 信息看似完整。 | descriptor 会膨胀为 provider runtime 平台,secret / cost / route / failover / invocation truth 全部串仓。 | 不采用 | 当前只采用 adapter descriptor,并与 provider runtime / secret / cost 分离。 |
| Governance approval / Policy truth 主导路径 | 让能力是否可用完全由 governance approval、Policy effective fact 或 shared rules 直接定义。 | 合规口径集中,对正式可用性有强控制感。 | `L1-governance` truth 会迁入本仓,本地 registry / whitelist 也可能反向定义 Policy truth。 | 不采用 | 本仓只拥有 governance seam relation、result ref 和允许摘要,不拥有 approval / Policy truth。 |
| Method-library definition 合并路径 | 把 capability 与方法资产定义、版本、TaskDefinition、AIPolicyDef 或 ProcessTemplateDef 正文合并管理。 | 能力与方法正文读取方便,适用关系查询更直接。 | 本仓会复制 method body 和 definition source truth,破坏 `L3-method-library` 的定义所有权。 | 不采用 | 本仓只拥有 capability-method body-free relation 和 method asset ref。 |
| SDK client / gateway-first 路径 | 由 SDK client、SDK gateway 或语言封装首先定义可消费 capability surface。 | 开发者体验直接,客户端消费路径更早成型。 | SDK client、package、binding、local candidate 或端侧缓存会反向定义服务端 formal exposure。 | 不采用 | 本仓只拥有服务端 formal exposure;`L0-sdk` 通过运行期边界消费。 |
| Marketplace listing / ecosystem directory 主导路径 | 以生态可发现性、listing、metadata 或目录浏览作为能力注册主组织。 | 生态展示和发现体验更直接,外部能力推广路径更明显。 | listing、transaction、pricing、fulfillment 或只读发现会反写 registry 和 formal visibility。 | 不采用为当前主线 | marketplace / ecosystem 只能只读消费或外围发现,不得拥有 capability registry truth。 |
| QueryCapabilities / consumer view 主导路径 | 用下游可查询能力集合或 CapabilityDecision-style view 统一 runtime、tools、SDK 消费。 | 下游读取简单,消费侧心智直接,短期接入成本低。 | consumer view、runtime allow / deny、Policy cache 或 query result 会替代 formal exposure truth。 | 不采用 | controlled consumer view 只能从正式 truth 派生,不可反写 identity、registry、descriptor 或 exposure。 |
| 全同步端到端闭环路径 | 每次核心变更都同步等待 governance、method、runtime、tools、SDK、search、export、observability 和 marketplace 承接完成。 | 即时完整感强,调用方容易理解“一次完成”。 | 下游和外围可用性会阻塞本仓核心 truth,形成高耦合和伪一致。 | 不采用 | 当前只对核心 access truth 裁定同步;传播、派生、handoff 后置。 |
| 全异步事件化 access truth 路径 | identity、registry、descriptor、seam、relation 和 exposure 都通过异步事件最终形成。 | 入口压力小,运行单元解耦,跨仓传播扩展性强。 | 核心 access truth 缺少即时成立 / 拒绝 / 挂起口径,调用方无法判断正式边界。 | 不采用 | 核心 truth 必须同步裁定;异步只用于已成立事实传播和外部结果送达。 |
| 复制外部正文 / secret / provider data 入仓路径 | 通过本地复制外部标准、协议、method、governance、secret、provider、observability 或 marketplace 正文降低跨边界读取成本。 | 本地读取完整,短期排障和展示方便。 | 形成多份外部 truth,权限、生命周期、敏感材料和 forbidden body 边界失控。 | 不采用 | 当前采用 ref / safe summary / body-free relation;正文出现时拒绝、挂起或转化为允许摘要。 |
| Observability / audit / cost center 主导路径 | 以审计、指标、trace、cost event 或 audit store 统一组织能力接入事实。 | 观测、审计和成本追踪体验直接。 | 物理观测、成本账、trace 或 audit store 会成为第二 capability access truth。 | 不采用为当前主线 | 本仓拥有业务追溯和 handoff 语义,不拥有 observability store 或 finance ledger。 |

### 5.5 取舍收束:先思考

问题回答:

- 当前方案牺牲了短期直接性:不能把 runtime gateway、provider platform、SDK client、marketplace listing 或 QueryCapabilities 当作最短路径。
- 当前方案牺牲了本地完整性:不能复制 method body、governance approval、secret、provider runtime、observability 或 cost 正文入仓。
- 当前方案牺牲了即时全链完成感:核心 truth 成立不等待所有派生、下游、生态和观测交接同步完成。
- 换来的是 access truth 独立、相邻 truth owner 清楚、依赖方向可裁剪、forbidden body 可审计、formal exposure 不被消费面反写、核心闭环不被外围拖垮、后续概要 / 详细 / 测试 / 实施可以按边界落码。

诊断:

- 如果只写“当前方案更安全”,会过于空泛,不能支撑后续 Step 15 ADR 或 Step 16 正式装配。
- 如果把所有不采用路径写成“以后可能做”,会弱化职责红线,让实现端误以为可以在 P0 私补 provider runtime、KMS、CostRecord 或 QueryCapabilities。
- 如果把所有不采用路径写成“永不相关”,会封死合理的外围演进,例如 marketplace 只读发现、observability handoff、SDK exposure 扩展、provider adapter 边界实现。

取舍:

- 使用“当前得到 / 当前失去或承担”表收束方案主轴。
- 使用方案边界说明短文区分结构性替代路径、边界外冲突、后续实现载体和外围演进方向。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写出得到和失去 | pass | 轻量取舍表覆盖边界收益和承担成本。 |
| 是否区分不采用与不作为当前主线 | pass | marketplace、observability、SDK、provider adapter 等保留合规外围或后续承接位置。 |
| 是否避免愿望池 | pass | 未把未来增强列成脑暴清单。 |
| 是否可进入“取舍收束:再写入” | pass | 可形成轻量取舍表和边界说明。 |

### 5.6 取舍收束:再写入

#### 5.6.1 轻量取舍对照表

| 当前方案得到什么 | 当前方案失去 / 承担什么 |
|---|---|
| 独立 capability access truth | 需要维护正式承接边界、状态解释和边界测试成本。 |
| identity / registry / descriptor / seam / relation / exposure 连续主线 | 不能用旧 MCP Registry / A2A Directory / Provider Contract / QueryCapabilities 四分法快速复用旧文档。 |
| 相邻 truth owner 清楚 | 不能本地复制 governance approval、method body、secret、provider runtime、SDK client 或 marketplace listing 正文。 |
| formal exposure 不被 consumer view 反写 | 需要维护 controlled consumer view、stale、rebuilding、unavailable 和禁止反写口径。 |
| 核心 truth 同步裁定 | 不能把所有核心变更压力都转移给异步事件或后台任务。 |
| 已成立事实异步传播 | 下游感知、observability handoff、SDK exposure 和生态发现需要接受延迟与恢复责任。 |
| 派生 / 对账 / 导出后台承接 | 搜索、浏览、导出和 audit-friendly summary 不能作为核心成功前置。 |
| ref / safe summary / body-free relation | 需要处理引用不可解析、摘要缺失、外部不可用和 forbidden body 拒绝。 |
| 核心闭环与外围增强隔离 | marketplace、console、observability、高级 provider 管理和完整 SDK 体验不能一次性成为核心主线。 |
| 后续设计可按边界落码 | `02~07` 必须继续闭合对象、状态、接口、配置、测试、验收和 implementation boundary,不能由实现端私补。 |

#### 5.6.2 方案边界说明

本章只比较会改变 `L3-capability-hub` 主线结构的相邻方案路径,不比较数据库、缓存、消息中间件、HTTP / RPC、KMS / Vault 产品、event topic、payload schema、consumer group、provider adapter 或部署形态。runtime execution、tools execution、governance approval truth、method body、SDK client、marketplace transaction、secret / KMS、cost / billing、observability store 等已被前文排除的方向,不再作为可采用候选重新打开,只作为历史冲突路径说明其为什么不能成为当前主线。marketplace 只读发现、observability handoff、SDK exposure 扩展、provider adapter 实现、public directory 和高级导出仍可能在后续文档中作为外围增强或实现承载出现,但它们必须服从独立 access truth、ref / safe summary、formal exposure / consumer view 分层和 forbidden body 边界。当前方案的核心取舍是牺牲短期集中性、即时全链完成感和本地正文完整性,换取 capability access truth、跨仓依赖裁剪、相邻 truth ownership、一致性层次和可落码边界。

---

## 6. 旧材料差异审计

### 6.1 可保留为取舍方向的旧材料

| 旧方向 | 审计结论 | 当前承接 |
|---|---|---|
| 统一能力入口 | 可保留为正式承接边界线索。 | 重裁为“外部输入经正式承接进入 access truth”,不表示 runtime / tools 必经执行网关。 |
| MCP / A2A / API 统一 registry / directory 线索 | 可保留为 capability identity 与 registry 的来源线索。 | 重裁为协议无关的 access truth 主线,不按 MCPServer / A2ANode 孤岛切分核心 truth。 |
| Policy-aware exposure | 可保留为 governance seam 与 controlled consumer view 线索。 | 重裁为 governance result ref / safe summary / seam relation 和派生消费视图,不继承 Policy refresh 或 runtime whitelist。 |
| Provider 接入描述 | 可保留为 adapter descriptor 线索。 | 重裁为接入方式、能力类型、风险 / 约束摘要,不继承 Provider Contract、secret、quota、route、cost、failover 或 retry。 |
| Query / 消费能力集合 | 可保留为受控消费视图读取线索。 | 重裁为 formal exposure truth 派生的 controlled consumer view,不继承 QueryCapabilities 作为 truth。 |
| 审计 / 成本 / 追溯诉求 | 可保留 traceability / impact / handoff 诉求。 | 重裁为业务追溯和允许摘要 / ref,不继承 audit store、CostRecord、cost worker 或 finance ledger。 |
| marketplace metadata / discovery | 可保留外围只读发现线索。 | 重裁为 read-only ecosystem discovery summary / ref 候选,不继承 listing truth 或 transaction。 |

### 6.2 必须废弃或挂起的旧口径

| 旧口径 | 为什么不能在 Step 11 继承 | 后续处理 |
|---|---|---|
| `Registry / Directory / Provider Contract / Cost Accounting` 四子域集中主线 | 混合 registry truth、provider runtime、secret、cost 和执行 / 财务边界。 | 废弃为历史结构;新版主线为 access truth 与分层承接。 |
| `QueryCapabilities` 作为核心消费入口或性能指标主线 | 会让 consumer view、runtime allow / deny 或 Policy cache 替代 formal exposure truth。 | 只保留受控消费视图读取;具体 API 后移 `03`。 |
| KMS / Vault 作为架构主方案 | 本仓不拥有 secret 平台 truth、key lifecycle 或 secret 正文。 | 只允许 secret ref / safe summary;配置与安全边界后续细化。 |
| Cost Accounting / CostRecord / cost worker | cost / billing / finance ledger 是非职责,不是 capability access truth。 | 作为 historical conflict;若后续观测或财务需要,只能经外部摘要 / ref / event candidate 审计。 |
| Provider failover / retry / routing / quota | 属于 provider runtime / execution orchestration,会把 descriptor 膨胀为执行平台。 | 留给 runtime / tools / provider adapter 边界。 |
| Policy refresh < 30s / last-known-good whitelist | 绑定旧治理 cache 与 runtime decision,绕过 governance truth 和 formal exposure 分层。 | 后续测试 / 验收若需要时按新版 seam / consumer view 重新定义。 |
| PostgreSQL / cache / bus(outbox) 作为方案取舍 | 属于实现载体或可靠性机制,不是路径级架构替代。 | 后续 `02/03/04/07` 按当前机制重新论证。 |
| marketplace metadata publish 作为 registry 同步主线 | marketplace listing / transaction 不属于本仓 truth。 | 只保留外围只读发现 / summary / ref 演进位置。 |
| observability audit store / log / trace / metric 正文 | 观测和审计物理存储不拥有 capability access truth,本仓也不保存观测正文。 | 只保留 handoff、safe summary 和业务追溯事实。 |
| P95 < 50ms、SLA 99.9%、MCP server 数、cost records/day | 绑定旧 QueryCapabilities / Cost 主线,缺少新版负载模型和验证来源。 | 后续 `05/06` 根据新版 NFR 和验收重新收敛。 |

### 6.3 旧材料冲突结论

旧 `01-架构设计.md` 中与 MCP Registry、A2A Directory、Provider Contract、Cost Accounting、QueryCapabilities、KMS / Vault、Policy refresh、runtime whitelist、provider failover、PostgreSQL / cache / outbox、marketplace metadata、observability audit store、P95 / 30s 等相关的内容,均不得作为新版备选方案与取舍直接继承。它们只能作为历史冲突或后续实现载体候选重新审计;若与独立 access truth、正式承接边界、依赖倒置、truth / snapshot / reference / forbidden body 分层、同步 / 异步 / 后台分离、formal exposure / consumer view 分层、descriptor 分离、ref / safe summary 优先或外围隔离冲突,必须以本 Step 结论为准。

---

## 7. 回填草稿

> 注意: 以下只是在 Step 16 装配正式 `01-架构设计.md` 时可使用的 §12 候选文本。当前不得直接写入正式 `01-架构设计.md`。

### 7.1 备选方案与取舍

`L3-capability-hub` 当前采用“独立 capability access truth 与分层承接方案”。该方案以外部 MCP / A2A / API 能力接入事实为独立 truth,通过正式承接边界隔离外部输入,以 capability identity、registry、adapter descriptor、governance seam、capability-method body-free relation 和 formal exposure 构成核心真相,以 ref、safe summary、body-free relation、controlled consumer view、异步事实传播和后台派生维护承接相邻系统。

正式 §12 可摘录本文件 §5.2 当前主线、§5.4 方案路径比较表、§5.6.1 轻量取舍对照表和 §5.6.2 方案边界说明。正式文档中应明确不采用 runtime / tools execution gateway 主导、Provider Contract / provider platform 主导、governance approval / Policy truth 主导、method-library definition 合并、SDK client / gateway-first、marketplace listing / ecosystem directory 主导、QueryCapabilities / consumer view 主导、全同步端到端闭环、全异步事件化 access truth、复制外部正文 / secret / provider data 入仓、observability / audit / cost center 主导等路径作为当前主线。产品 / 实现载体如 PostgreSQL、cache、message broker、HTTP / RPC、outbox、KMS / Vault、event topic、payload schema、consumer group、provider adapter、P95 / SLA 或部署环境不得写成本章备选方案。

---

## 8. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 Provider Contract / provider platform 与当前 descriptor 边界冲突 | historical_conflict_not_blocker | 旧口径会把 provider runtime、secret、quota、route、failover、retry、cost 和 invocation result 拉入本仓。 | 已在方案比较中明确不采用,并保留 descriptor 分离。 |
| 旧 QueryCapabilities / consumer view 主导与 formal exposure 分层冲突 | historical_conflict_not_blocker | 旧口径会让 consumer view 或 runtime allow / deny 反写服务端正式暴露。 | 已在方案比较中明确不采用,只保留 controlled consumer view 派生。 |
| 旧 Cost Accounting / KMS / Vault / marketplace / observability 主线回流 | historical_conflict_not_blocker | 这些属于边界外 truth 或外围增强,不是 access truth owner。 | 已记录为历史冲突或外围演进,不进入当前主线。 |
| governance seam 字段未完全确定 | not_blocking_step_12 | Step 11 比较路径级方案,不需要字段闭口。 | 后续 `02/03/05` 继续细化 seam object、ref、summary 和测试。 |
| method relation 摘要粒度未完全确定 | not_blocking_step_12 | Step 11 只确认 body-free relation 路径,不定义摘要字段。 | 后续 `02/03/05` 继续闭口,method body 仍 forbidden。 |
| SDK exposure 交接细节未完全确定 | not_blocking_step_12 | Step 11 已确认 SDK client 不主导本仓;服务端 exposure 与 consumer view 分层成立。 | 后续在 `02/03/07` 按服务端边界和 SDK exposure consumer ref 承接。 |
| API / DTO / state / evidence / implementation boundary 未闭口 | not_blocking_step_12 | 本 Step 不应提前定义详细设计和实施边界。 | 后续正式文档逐步闭口,不得由实现端私补。 |

结论: 未发现阻塞 `01-架构设计.md` Step 12 的上游 blocker。

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确当前主线方案 | pass | 主线为独立 capability access truth 与分层承接方案。 |
| 已明确主要相邻替代路径 | pass | §5.4 覆盖 runtime / tools gateway、Provider Contract、governance truth、method 合并、SDK / marketplace / QueryCapabilities、全同步、全异步、外部正文复制、observability / cost 等路径。 |
| 每条路径是否说明解决的问题 | pass | 主表逐项说明该路径试图解决的架构问题。 |
| 每条路径是否说明收益与代价 | pass | 主表逐项列出主要收益和主要代价 / 约束。 |
| 是否给出采用 / 不采用结论 | pass | 主线采用;冲突路径不采用;外围方向标注不采用为当前主线。 |
| 是否避免产品横评和局部实现对比 | pass | 未把数据库、缓存、消息、协议、outbox、KMS 产品或部署形态写入主比较。 |
| 是否避免愿望池 | pass | 未把未来增强、public directory、provider adapter 实现或 SDK 扩展写成脑暴清单。 |
| 是否避免边界外事项重新打开 | pass | 已排除职责只作为历史冲突路径说明,不作为可采用候选。 |
| 是否完成旧材料差异审计 | pass | §6 覆盖旧 Provider Contract、QueryCapabilities、Cost、KMS / Vault、Policy refresh、P95 / SLA、marketplace、observability 等冲突。 |
| 是否保留待确认项 | pass | governance seam 字段、method 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / evidence / implementation boundary 均未闭口。 |
| 正式 `01-架构设计.md` 是否保持未写入 | pass | 当前只创建 Step 11 中间产物;正式 `01` 必须等 Step 16 装配。 |
| 是否可进入 Step 12 | blocked_until_user_confirm | 必须等待用户确认后才能进入 Step 12 `横切关注点`。 |

当前 next_allowed_action:

```text
wait_user_review_to_step_12
```

当前不需要提交 commit。
