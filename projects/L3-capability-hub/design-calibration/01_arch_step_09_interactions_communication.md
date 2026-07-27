# L3-capability-hub 01 架构 Step 9: 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 回填章节: `01-架构设计.md` §10 关键交互与通信方式
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、架构 Step 4 / 6 / 7 / 8 和需求 Step 12 重新推导关键交互与通信方式;旧 `01-架构设计.md` §6 / §8 / §11 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 9 关键交互与通信方式 |
| 输出文件 | `design-calibration/01_arch_step_09_interactions_communication.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 9;`架构设计书写规范.md` §4.10 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §6 / §8 / §11 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 9;`L3-method-library` Step 9;`L0-sdk` Step 9 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 8 进入 Step 9 |
| next_allowed_action | Step 9 已完成,等待用户确认后进入 Step 10。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入关键交互场景思考。 |
| 关键交互场景:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入关键交互场景写入。 |
| 关键交互场景:再写入 | done | 关键交互场景表 | pass | 进入通信方式判断思考。 |
| 通信方式判断:先思考 | done | 同步 / 异步 / 后台承接口径 | pass | 进入通信方式判断写入。 |
| 通信方式判断:再写入 | done | 通信方式判断表 / 简化图 / 边界说明 | pass | 进入架构单元交互规则思考。 |
| 架构单元交互规则:先思考 | done | 按 Step 5 单元逐个判断同步、异步、后台和失败口径 | pass | 进入架构单元交互规则写入。 |
| 架构单元交互规则:再写入 | done | 架构单元通信方式表 / 停审记录 | pass | 进入跨交互边界审计。 |
| 跨交互边界审计 | done | 同步异步冲突 / 直接穿透 / 协议下沉 / 失败口径审计 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §10 候选文本 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 10。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 9 必须输出关键交互结论、通信方式结论、失败降级结论、边界约束结论、按架构单元组织的交互方式表、停审和跨交互边界审计。 | 本 Step 不能只给同步 / 异步标签,必须说明场景、边界、目的、失败口径和逐单元停审。 |
| `standards/document/架构设计书写规范.md` §4.10 | 固定输出关键交互场景表和通信方式判断表;通信方式只使用 `同步请求 / 响应类交互`、`异步事件 / 回调类交互`、`后台任务 / 延后承接类交互`。 | 不写 API 路径、接口名、事件名、topic、DTO、callback、时序、协议或中间件选型。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,并保留恢复门禁、诊断、取舍和结构化产物。 | 本文件保留过程判断和停审记录,正式 `01` 暂不回填。 |
| `设计文档编写通则.md` | 架构章节必须与系统上下文、运行承载、依赖方向和数据所有权闭环。 | 本 Step 不能重画上下文、运行图或数据表,只能在其基础上判断通信方式。 |
| `设计真相源闭环与可落码性标准.md` | 通信方式不得绕过正式边界,不得让实现端私造外部事实、schema、port、状态或失败恢复面。 | 失败口径只写架构原则,不能写成假成功、协议补丁、重试实现或 outbox 机制。 |
| `全局项目依赖关系与裁剪规则.md` | 编译期、运行期和事件协作关系必须分开表达。 | `L0-bus` 是事件协作边界,不是本仓业务 truth 或源码依赖;运行期消费不得反写 access truth。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_04_system_context.md` | 正式上下文对象包括 `L0-core / L0-bus`、外部 MCP / A2A / API 来源、`L1-governance`、`L3-method-library`、`L2-runtime / L2-tools`、`L0-sdk`;console / marketplace / observability 只入外围表。 | 关键交互必须发生在这些正式边界上,不能把 KMS、Cost、Provider runtime 或 marketplace transaction 升级为主链。 |
| `01_arch_step_06_container_deployment.md` | 运行承载包括同步入口、异步协作、后台维护与派生、access truth 承载、受控消费 / 追溯派生承载、外部边界和 `L0-bus` 运行对接边界。 | 同步 / 异步 / 后台交互需要匹配这些运行承载角色,但不能写成具体服务、worker、event 或 protocol。 |
| `01_arch_step_07_dependency_direction.md` | 外部来源、governance、method、runtime / tools、SDK、bus、console、marketplace、observability、secret、finance 均必须经正式边界 / ref / safe summary / relation / controlled view 进入。 | 关键交互不得直接穿透核心语义,不得让下游或外部事实反向定义本仓 access truth。 |
| `01_arch_step_08_data_ownership_consistency.md` | 核心 truth 内部强一致;truth 到派生 view / search / export / consumer summary 最终一致;truth 到外部 ref 要求引用有效性一致;forbidden body 只能拒绝、挂起或转化为 ref / allowed safe summary。 | 同步交互用于正式 truth 裁定和读取;异步用于事实传播 / 外部结果送达;后台用于派生、对账、导出、刷新和恢复。 |
| `00_req_step_12_interfaces_dependencies.md` | 需求层能力面包括变更、查询、事件输出、事件输入和后台任务;依赖边界包括 `L0-core`、`L0-bus`、外部能力来源、governance、method-library、runtime / tools、SDK 和外围消费。 | 本 Step 可承接能力面,但不得继承接口名、事件名、schema 或具体实现调用链。 |
| `00_req_step_13_non_functional_requirements.md` | 核心闭环不能被外围增强拖垮;派生视图可滞后但需可解释;关键变化需可追溯。 | 失败口径必须区分核心失败、待传播、stale、rebuilding、unresolved、外围不可用和禁止正文。 |
| `00_req_step_15_risks_open_questions.md` | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK exposure、API / DTO / state / boundary 等仍未闭口。 | 本 Step 不能通过通信方式提前定形字段、schema、state、transport、event 或 implementation boundary。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §6 / §8 / §11 | historical material | 只审计旧 `capability-hub-api`、`provider service`、`access decision service`、`cost worker`、governance subscription、Policy refresh、QueryCapabilities、KMS / Vault、cost retry 等口径。 |
| `L1-governance` Step 9 | reference material | 参考“核心 truth 同步收口、已成立事实异步传播、派生 / 报告 / 对账后台承接”的粒度。 |
| `L3-method-library` Step 9 | reference material | 参考 full-restart 下按交互场景、通信方式、架构单元和跨边界审计组织的方式。 |
| `L0-sdk` Step 9 | reference material | 参考同步服务访问、异步事件客户端视图和后台验证 / 契约对齐分层的写法。 |

---

## 3. 整体模块骨架

Step 9 先判断关键交互场景,再判断通信方式。它不重写系统上下文、运行承载、依赖方向、数据所有权、接口协议、事件目录或技术选型。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 关键交互场景 | 哪些交互值得进入架构层通信方式判断,发生在哪个正式边界上,目的是什么。 | 不写 API 路径、接口名、事件名、callback 名、topic 名、DTO、schema 或内部处理步骤。 | 关键交互场景表。 |
| 通信方式判断 | 每个场景适合同步、异步还是后台延后承接,不宜采用什么方式,失败时架构层如何处理。 | 不写协议、中间件、产品、重试策略、补偿流程、outbox、transaction 或时序图。 | 通信方式判断表、简化图、边界说明。 |
| 架构单元交互规则 | Step 5 每个架构单元如何使用同步、异步、后台和失败挂起口径。 | 不重划子域,不定义对象、状态、port、repository、handler 或测试用例。 | 架构单元通信方式表 / 停审记录。 |
| 跨交互边界审计 | 是否存在同步 / 异步选择冲突、直接穿透、协议细节下沉或失败降级缺口。 | 不用后续概要 / 详细设计替本 Step 补口。 | 跨交互边界审计表。 |
| 旧材料差异审计 | 旧通信方向哪些可保留,哪些必须废弃或挂起。 | 不继承旧 Draft 状态、旧协议、旧 event、旧服务名或旧补偿机制。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 10。 | 不提前通过技术选型或概要设计门禁。 | 自检表和下一步许可。 |

---

## 4. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 9 completed_stop_review | pass | 关键交互场景表、通信方式判断表、按架构单元交互规则、交互方式停审、跨边界审计、旧材料审计、回填草稿和自检均完成。 | `wait_user_review_to_step_10` |

---

## 5. 模块思考记录

### 5.1 关键交互场景:先思考

问题回答:

- 本仓关键交互围绕 capability access truth 的形成、读取、传播和派生维护展开,而不是围绕旧 `QueryCapabilities`、Provider Contract、cost event、KMS 或 provider runtime 展开。
- 需要同步收口的场景是 identity、registry、descriptor、governance seam、method relation、formal exposure 等正式 truth 的建立 / 调整 / 读取,因为调用方必须获得明确结果、拒绝、挂起或不可用口径。
- 适合异步的场景是已经成立的 capability access fact 变化传播、governance result / method asset / external source 等外部结果送达、下游消费影响回报,因为这些属于跨边界事实传播或结果输入,不应形成直接穿透。
- 适合后台的场景是 registry maintenance / reconciliation、controlled consumer view、search / browse、export、audit-friendly summary、candidate discovery 和 read-only ecosystem discovery 等派生 / 对账 / 交接材料维护,它们服务最终一致和可解释恢复。

诊断:

- 旧 §6 的 `capability-hub-api`、`registry service`、`provider service`、`access decision service`、`cost worker` 是运行 / 实现名,不能作为 Step 9 交互场景主语。
- 旧 governance subscription / Policy refresh 容易把 `L1-governance` truth 和 runtime cache 写成通信主线。
- 旧 `QueryCapabilities` 容易把受控消费快照写成 formal exposure truth 或 runtime allow / deny decision。
- 旧 cost retry、key rotate、last-known-good、provider failover / retry / routing 是实现补偿或边界外职责,不能成为 Step 9 失败处理口径。

取舍:

- 使用“场景级名称 + 正式边界 + 目的 + 边界说明”表达交互,不使用旧接口名、事件名、job 名或服务名。
- 核心 access truth 变更 / 读取走同步请求 / 响应类交互。
- 已成立事实传播和外部结果送达走异步事件 / 回调类交互。
- 派生材料、对账、导出、候选发现、生态发现和审计交接走后台任务 / 延后承接类交互。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否从系统上下文和数据所有权推导 | pass | 场景来自 Step 4 / 6 / 7 / 8 和需求 Step 12 能力面。 |
| 是否避免 API / event / job 名 | pass | 场景均为架构交互场景,不是协议对象或实现对象。 |
| 是否避免候选关系升级 | pass | console、marketplace、observability、secret、candidate discovery 均保持外围或条件口径。 |
| 是否可进入“关键交互场景:再写入” | pass | 可形成关键交互场景表。 |

### 5.2 关键交互场景:再写入

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 外部能力接入语境与 identity 建立 / 调整 | 管理入口 / 外部能力来源边界 ↔ Capability Hub 同步入口 ↔ access truth 承载 | 判断外部能力接入语境和 capability identity 是否可正式建立、调整、更正或退役。 | identity 是 access truth 主体锚点,不能由外部来源、URL、provider 名或派生视图后台补成。 |
| registry 纳入 / 退出与可见性变化 | 管理入口 / 下游消费边界 ↔ Capability Hub 同步入口 ↔ access truth 承载 | 判断能力是否可进入或退出注册目录,以及可见性 / 生命周期语义是否可正式改变。 | registry 变化会影响 formal exposure 和消费边界,必须即时返回明确状态。 |
| adapter descriptor 建立 / 替换与风险解释 | 外部能力来源边界 / 管理入口 ↔ Capability Hub 同步入口 ↔ access truth 承载 | 判断接入描述、能力类型、风险和约束摘要是否可成为正式接入描述。 | descriptor 不等同于 Provider Contract,不得把 secret、provider runtime、quota、route、cost 或 failover 带入同步交互。 |
| governance seam 与 access review 职责分离收口 | `L1-governance` 关系输入边界 / 管理入口 ↔ Capability Hub 同步入口 ↔ access truth 承载 | 判断 governance result ref、seam relation 和 access review responsibility separation fact 是否可正式成立。 | 本仓同步收口的是 seam / review 边界,不是 approval、Policy 或 shared_rules truth。 |
| capability-method body-free relation 管理 | `L3-method-library` 关系输入边界 / 管理入口 ↔ Capability Hub 同步入口 ↔ access truth 承载 | 判断 capability 与 method asset 的 body-free relation 是否可建立、调整或移除。 | 本仓只承接 method asset ref 与 relation truth,不得同步读取或复制 method body。 |
| formal exposure boundary 与正式可见性变更 | 下游消费 / SDK exposure 边界 ↔ Capability Hub 同步入口 ↔ access truth 承载 | 判断服务端 formal exposure boundary、formal visibility 和 applicability 是否可正式改变。 | formal exposure 是本仓 truth;runtime decision、SDK client、consumer view 不能反向定义它。 |
| 正式接入事实读取与追溯读取 | 下游消费 / 管理入口 / SDK / 审计入口 ↔ Capability Hub 同步入口 ↔ access truth / 派生承载 | 读取 identity、registry、descriptor、seam、relation、formal exposure、traceability 和允许摘要。 | 读取需要即时返回可读、不可见、stale、unavailable 或 unresolved 口径,但不得暴露外部正文。 |
| 受控消费视图读取 | `L2-runtime` / `L2-tools` / `L0-sdk` 消费边界 ↔ Capability Hub 同步入口 ↔ 受控消费 / 追溯派生承载 | 让下游读取由正式 access truth 派生的 controlled consumer view。 | consumer view 可滞后或不可用,但不能反写 formal exposure 或变成 allow / deny enforcement。 |
| capability access fact 变化传播 | access truth 承载 ↔ Capability Hub 异步协作承载 ↔ `L0-bus` / 下游消费边界 | 让 identity、registry、descriptor、seam、relation、exposure 和影响事实变化被下游持续感知。 | 这是已成立事实传播,不要求下游全部同步确认后本仓 truth 才成立。 |
| 外部治理 / 方法 / 来源结果送达 | `L1-governance` / `L3-method-library` / 外部能力来源边界 ↔ Capability Hub 异步协作承载 | 承接 governance result 变化线索、method asset 关系线索或外部能力来源变化线索。 | 外部结果送达只提供 ref、safe summary 或候选线索,不得直接穿透核心 truth。 |
| 下游消费影响回报 | `L2-runtime` / `L2-tools` / `L0-sdk` 消费边界 ↔ Capability Hub 异步协作承载 | 承接正式消费影响摘要、消费边界反馈或变化感知反馈。 | 本仓只承接 impact summary,不扫描或拥有 runtime execution、tool result 或 SDK client truth。 |
| registry maintenance / reconciliation | access truth 承载 ↔ 后台维护与派生承载 ↔ 受控消费 / 追溯派生承载 | 维护目录派生结果、对账状态和一致性保护材料。 | 维护只能解释和保护正式接入事实,不得创建、批准、关闭或覆盖核心 truth。 |
| consumer view / search / browse / export 派生维护 | access truth 承载 ↔ 后台维护与派生承载 ↔ 受控消费 / 追溯派生承载 | 维护受控消费视图、搜索 / 浏览摘要、导出摘要和追溯读取材料。 | 派生材料服务读取和交接,可 stale / rebuilding / unavailable,不得成为第二 truth。 |
| 外围候选发现与只读生态发现承接 | 外部能力来源 / marketplace / console 边界 ↔ 后台维护与派生承载 | 承接候选发现、只读生态发现和外围管理摘要。 | 候选或生态发现不是正式接入 truth,不阻塞核心闭环。 |
| observability / audit / external document 交接 | access truth / 派生承载 ↔ observability / audit / external document 边界 | 交接审计友好摘要、外部引用状态和导出材料。 | 交接可延迟,接收方不反写 access truth,本仓不拥有观测或外部文档正文。 |
| secret ref / safe summary 边界承接 | 安全与敏感边界引用 ↔ 同步入口 / 异步协作 / 后台维护边界 | 在 descriptor 风险解释需要时承接 secret ref 或 allowed safe summary。 | secret 正文、KMS / Vault truth 和 key lifecycle 不进入本仓;缺失时挂起或标记不可判定。 |

### 5.3 通信方式判断:先思考

问题回答:

- 同步请求 / 响应类交互适用于正式 access truth 的建立、调整和读取,包括 identity、registry、descriptor、governance seam、method relation、formal exposure、traceability 和 controlled consumer view 读取。同步成功只能表示本仓边界内的正式判断成立,不能表示下游消费、派生维护或外部交接已完成。
- 异步事件 / 回调类交互适用于 capability access fact 变化传播、外部治理 / 方法 / 来源结果送达和下游消费影响回报。异步失败只能产生待传播、待承接、unresolved 或 failed 语义,不能回滚已成立 truth。
- 后台任务 / 延后承接类交互适用于 registry maintenance、reconciliation、consumer view、search / browse、export、candidate discovery、ecosystem discovery、observability / audit handoff 和引用刷新。后台失败只能使派生材料 stale、rebuilding、unavailable 或 pending,不得覆盖核心 access truth。

诊断:

- 如果把所有核心变更都异步化,会让调用方误以为尚未裁定的 identity、registry、descriptor 或 exposure 已正式成立。
- 如果把所有派生维护都压入同步边界,会让搜索、导出、审计、观测、marketplace 或下游消费可用性阻塞核心 truth。
- 如果外部治理 / 方法 / secret 通过同步穿透读取正文,会破坏 Step 8 的引用有效性和 forbidden body 边界。
- 如果 `CapabilityDecision-style summary` 的同步读取失败被写成 formal exposure 不成立,会让 consumer view 反向控制 truth。

取舍:

- 核心 truth 裁定和读取同步化,并明确失败 / 挂起 / 不可用口径。
- 跨仓变化传播和外部结果送达异步化,并明确不反写、不回滚。
- 派生、对账、导出、搜索、审计交接、候选发现和引用刷新后台化,并明确 stale / rebuilding / unavailable。
- 不写协议、中间件、队列、订阅、回调、topic、payload、retry、outbox 或 transaction。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用正式通信方式类型 | pass | 只使用同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接。 |
| 是否给出不宜方式 | pass | 每个场景说明不宜采用的通信类别和边界原因。 |
| 是否给出失败口径 | pass | 每个场景均有失败、挂起、待承接、stale、unavailable 或 forbidden 口径。 |
| 是否可进入“通信方式判断:再写入” | pass | 可形成通信方式判断表。 |

### 5.4 通信方式判断:再写入

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 外部能力接入语境与 identity 建立 / 调整 | 同步请求 / 响应类交互 | 不宜作为纯异步事件完成,也不宜由后台任务补造 identity。 | 明确失败、拒绝、pending 或 unresolved;不形成部分 identity truth。 | identity 是 access truth 主体锚点,必须即时裁定。 |
| registry 纳入 / 退出与可见性变化 | 同步请求 / 响应类交互 | 不宜以后置维护或搜索索引更新替代 registry 裁定。 | 未满足前置时保持未注册、不可正式可见或挂起。 | registry 影响正式目录和下游消费边界。 |
| adapter descriptor 建立 / 替换与风险解释 | 同步请求 / 响应类交互 | 不宜用 provider runtime、secret lookup 或后台补齐替代正式 descriptor 裁定。 | descriptor 不足、secret ref 不可判定或风险解释不足时失败 / 挂起。 | descriptor 是本仓 truth,但 secret 和 provider runtime 不归本仓。 |
| governance seam 与 access review 职责分离收口 | 同步请求 / 响应类交互 | 不宜同步穿透 governance approval,也不宜用 safe summary 替代 formal ref。 | governance ref 不可解析或职责分离不可说明时 unresolved / 挂起。 | 本仓同步收口 seam relation 和 review separation,不拥有 governance truth。 |
| capability-method body-free relation 管理 | 同步请求 / 响应类交互 | 不宜复制 method body 或通过源码依赖完成 relation。 | method ref 不可解析或不匹配时 relation unresolved / 拒绝。 | relation 是本仓 truth,method body 是 forbidden body。 |
| formal exposure boundary 与正式可见性变更 | 同步请求 / 响应类交互 | 不宜由 consumer view、runtime cache 或 SDK client 反向形成。 | 前置 identity / registry / descriptor / seam 不满足时失败 / 挂起。 | formal exposure 是服务端正式消费边界。 |
| 正式接入事实读取与追溯读取 | 同步请求 / 响应类交互 | 不宜通过异步事件回答单次读取,也不宜暴露外部正文。 | 返回可读、不可见、stale、unavailable、unresolved 或明确失败。 | 读取需要即时结果,但可解释派生滞后。 |
| 受控消费视图读取 | 同步请求 / 响应类交互 | 不宜把读取结果当作 formal exposure truth,也不宜写成 runtime execution。 | consumer view stale / rebuilding / unavailable 时明确返回对应口径。 | consumer view 是派生快照,不是 access truth。 |
| capability access fact 变化传播 | 异步事件 / 回调类交互 | 不宜作为核心变更同步裁定的一部分,也不宜要求所有下游确认后才成立。 | 保持待传播、待承接、failed 或 retryable 语义;核心 truth 不回滚。 | 已成立事实传播服务下游感知。 |
| 外部治理 / 方法 / 来源结果送达 | 异步事件 / 回调类交互 | 不宜由本仓同步查询外部正文或直接读取相邻仓内部状态。 | 未送达、类型不匹配或不可判定时 pending / unresolved / rejected。 | 外部结果送达只形成 ref、summary 或候选线索。 |
| 下游消费影响回报 | 异步事件 / 回调类交互 | 不宜同步扫描下游 runtime、tools 或 SDK 内部状态。 | 缺失时保持 unknown、pending 或待确认;不得默认为无影响。 | 本仓只拥有 impact fact / summary,不拥有执行 truth。 |
| registry maintenance / reconciliation | 后台任务 / 延后承接类交互 | 不宜作为 registry 同步变更成功的前置,也不宜反写 registry truth。 | 维护结果可 pending、failed、stale 或异常待处理。 | 维护保护目录一致性,不创建业务结论。 |
| consumer view / search / browse / export 派生维护 | 后台任务 / 延后承接类交互 | 不宜要求同步变更完成全部派生材料,也不宜让派生结果反写 truth。 | 保持旧视图、stale、rebuilding、unavailable 或导出待准备。 | 派生材料最终一致且可重建。 |
| 外围候选发现与只读生态发现承接 | 后台任务 / 延后承接类交互 | 不宜把候选发现或 marketplace 线索写成正式接入 truth。 | 外围不可用、候选待审、unknown 或 unavailable,不影响核心闭环。 | 外围发现服务管理和生态,不是 access truth 前置。 |
| observability / audit / external document 交接 | 异步事件 / 回调类交互 + 后台任务 / 延后承接类交互 | 不宜作为 access truth 成立前置,也不宜让接收方反写真相。 | pending、failed、retryable、unavailable 或引用不可解析。 | 交接和导出可延迟,本仓不拥有观测 / 外部文档正文。 |
| secret ref / safe summary 边界承接 | 同步请求 / 响应类交互用于正式判断;异步事件 / 回调类交互或后台任务 / 延后承接类交互用于摘要送达和刷新 | 不宜同步保存 secret 正文,也不宜由 KMS / Vault truth 反向定义 descriptor。 | secret ref 不可解析时挂起相关 descriptor / exposure;secret 正文出现时拒绝或转化为 forbidden。 | 安全边界只允许 ref / safe summary,不拥有 secret 平台。 |

#### 5.4.1 简化交互示意图

```text
+------------------------------------------------------------+
|                 L3-capability-hub boundary                 |
+------------------------------------------------------------+
          |
          | 同步请求 / 响应
          v
+-------------------------+      +--------------------------+
| 同步入口与 access truth |<---->| 下游 / 管理 / SDK 入口   |
| identity / registry     |      | read / change boundary   |
| descriptor / exposure   |      +--------------------------+
+-----------+-------------+
            |
            | 异步事件 / 回调
            v
+-----------+-------------+      +--------------------------+
| 异步协作边界            |<---->| governance / method /    |
| fact propagation        |      | external / consumer refs |
+-----------+-------------+      +--------------------------+
            |
            | 后台任务 / 延后承接
            v
+-----------+-------------+
| 后台维护与派生边界      |
| view / search / export  |
| reconciliation / audit  |
+-------------------------+
```

图示说明:

- 同步请求 / 响应用于 access truth 的正式裁定和读取,不表达具体协议。
- 异步事件 / 回调用于已成立事实传播、外部结果送达和下游影响回报,不表达事件目录。
- 后台任务 / 延后承接用于派生、对账、导出、候选发现、生态发现和审计交接,不反写真相。
- 图不表达接口路径、事件名、topic、DTO、处理顺序、技术产品或运行部署拓扑。

#### 5.4.2 边界说明

`L3-capability-hub` 的通信方式服务于 capability access truth 边界:核心接入事实建立、调整和读取需要同步明确裁定;已成立事实传播、外部治理 / 方法 / 来源结果送达和下游影响回报需要异步承接;搜索、浏览、导出、对账、候选发现、生态发现和审计交接需要后台延后收敛。同步成功只说明本仓正式边界内的判断成立,不代表下游执行、SDK 封装、观测交接、生态发现或派生材料已经完成。异步和后台失败只能表现为待传播、pending、unresolved、stale、rebuilding、unavailable、failed 或 forbidden,不能回滚或补造 access truth。

### 5.5 架构单元交互规则:先思考

问题回答:

- 核心子域主要通过同步交互形成正式 truth 或读取正式 truth;其变化通过异步交互对下游和相邻仓传播;派生材料通过后台维护收敛。
- 支撑子域的接入审查、追溯、维护和外围发现需要分别匹配数据所有权:review / traceability truth 同步裁定,影响回报和变化输入异步承接,派生 / 搜索 / 导出 / 对账后台收敛。
- 本地索引 / 投影 / 引用单元不能成为同步穿透外部正文的通道;外部结果送达适合异步,引用刷新和 safe summary 维护适合后台。
- 每个单元失败时必须返回明确失败、pending、unresolved、unknown、stale、rebuilding、unavailable 或 forbidden,不能伪装成功。

诊断:

- `治理与方法关系语义` 最容易把 governance approval 和 method body 同步读入本仓,必须只同步裁定 seam / relation,外部结果异步送达。
- `正式暴露与受控消费语义` 最容易让 consumer view / QueryCapabilities 旧口径反写 formal exposure,必须区分同步正式裁定与派生读取。
- `派生维护与消费快照语义` 最容易由后台维护创建业务结论,必须写清后台只维护派生材料。
- `安全与敏感边界引用` 最容易把 secret ref 变成 KMS / Vault 调用或 secret 正文存储,必须用 forbidden 口径保护。

取舍:

- 架构单元表沿用 Step 5 的五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用。
- 每个单元同时写同步、异步、后台和失败口径。
- 不在单元表中写接口名、事件名、topic、DTO、状态机、handler、repository 或 job 名。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 Step 5 所有架构单元 | pass | 五个核心、四个支撑、五类本地影子均覆盖。 |
| 是否匹配数据所有权 | pass | truth 裁定同步;外部结果 / 变化异步;派生和引用刷新后台。 |
| 是否避免直接穿透 | pass | 未要求同步读取 governance approval、method body、runtime execution、secret 正文或 marketplace / observability 正文。 |
| 是否可进入“架构单元交互规则:再写入” | pass | 可形成架构单元通信方式表和停审记录。 |

### 5.6 架构单元交互规则:再写入

#### 5.6.1 架构单元通信方式表

| 架构单元 | 同步请求 / 响应类交互 | 异步事件 / 回调类交互 | 后台任务 / 延后承接类交互 | 失败处理口径 | 停审结论 |
|---|---|---|---|---|---|
| 能力身份语义 | 接入语境和 capability identity 建立、调整、更正、退役、读取。 | 外部来源变化线索送达;identity 变化对下游传播。 | 候选来源摘要、identity 读取摘要和外部来源引用刷新。 | 身份依据不足时失败 / pending / unresolved,不得用 URL 或 provider 名补造 identity。 | pass |
| 注册目录语义 | registry 纳入、退出、可见性和 lifecycle 语义变更 / 读取。 | registry 变化对下游和维护边界传播。 | 目录维护、搜索 / 浏览摘要、reconciliation。 | 前置 identity 不成立时拒绝;派生滞后时 stale / rebuilding / unavailable。 | pass |
| 接入描述语义 | adapter descriptor 建立、替换、退役、风险 / 约束摘要读取。 | 外部能力来源变化线索或 descriptor 变化传播。 | descriptor 读取摘要、secret safe summary 刷新和导出材料维护。 | descriptor 不足或 secret ref 不可判定时挂起;secret 正文 forbidden。 | pass |
| 治理与方法关系语义 | governance seam、access review separation、method body-free relation 建立 / 替换 / 失效 / 读取。 | governance result / method asset 变化线索送达;relation 变化传播。 | 引用有效性检查、allowed summary 刷新、关系追溯材料维护。 | governance ref 或 method ref 不可解析时 unresolved;不得复制 approval、Policy 或 method body。 | pass |
| 正式暴露与受控消费语义 | formal exposure、visibility、applicability 变更 / 读取;controlled consumer view 读取。 | exposure 变化向 runtime / tools / SDK 传播;下游影响回报。 | consumer view、消费摘要和适用性读取材料维护。 | 前置 truth 不满足时挂起;consumer view stale 不反写 exposure。 | pass |
| 接入审查与风险解释语义 | access review fact、risk explanation、职责分离解释的正式裁定 / 读取。 | 外部风险线索、governance 结果摘要或 secret 边界摘要送达。 | 风险摘要、安全摘要和审查材料维护。 | 依据不足时 pending / rejected;不得替代 governance approval 或保存 secret。 | pass |
| 追溯与变化感知语义 | traceability record 和 change / consumer impact fact 读取 / 裁定。 | capability access fact 变化传播;下游影响摘要送达。 | 追溯读取材料、审计友好摘要和影响摘要维护。 | 影响未知时 unknown / pending;观测正文不可用不改变本仓追溯 truth。 | pass |
| 派生维护与消费快照语义 | 派生材料读取状态判断。 | access truth 变化到派生维护边界的送达。 | controlled consumer view、search、browse、export、reconciliation、stale / rebuild 状态维护。 | 派生失败返回 stale / rebuilding / unavailable,不得创建或覆盖业务 truth。 | pass |
| 外围管理与发现语义 | 外围管理说明、候选状态和只读发现摘要读取。 | 外部候选发现、生态发现或 SDK exposure 反馈送达。 | candidate discovery、read-only ecosystem discovery、SDK 说明和导出摘要维护。 | 外围不可用不阻塞核心闭环;候选不能自动正式化。 | pass |
| 外部能力来源引用 | 来源引用读取和候选来源正式接入前置判断。 | 外部 MCP / A2A / API 来源变化线索送达。 | 来源引用有效性、候选摘要和外部文档引用刷新。 | 来源不可解析时 pending / unresolved;外部正文 forbidden。 | pass |
| 治理与方法外部引用 | governance ref、policy result ref、method asset ref 读取和关系裁定前置判断。 | governance / method 结果或引用状态送达。 | 引用有效性检查、safe summary 刷新、relation 摘要维护。 | ref 不可解析时 unresolved;approval / Policy / method body forbidden。 | pass |
| 安全与敏感边界引用 | secret ref 可解析性和安全摘要适用性判断。 | secret 边界摘要或安全线索送达。 | secret safe summary 刷新、敏感边界说明维护。 | secret 正文出现时拒绝;secret ref 缺失时挂起相关 descriptor / exposure。 | pass |
| 下游消费与 SDK 引用 | consumer ref、SDK exposure ref 和消费摘要读取。 | runtime / tools / SDK 消费影响回报送达。 | downstream impact summary、SDK 说明摘要和消费视图维护。 | 下游状态未知保持 unknown / pending;不扫描 execution 或 SDK client truth。 | pass |
| 观测 / 生态 / 外部文档引用 | audit ref、marketplace object ref、external document ref 读取判断。 | observability / audit / ecosystem / external document 线索送达。 | audit safe summary、ecosystem summary、external document summary 和导出材料维护。 | 接收方不可用时 pending / failed / unavailable;正文 forbidden 且不反写真相。 | pass |

#### 5.6.2 交互方式停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| 通信方式是否匹配数据所有权 | pass | 核心 truth 裁定和读取同步;外部结果和变化传播异步;派生和引用刷新后台收敛。 |
| 是否经过正式边界 | pass | 外部来源、governance、method、runtime / tools、SDK、secret、observability、marketplace 均通过正式边界、ref、safe summary 或 consumer view 承接。 |
| 是否未下沉协议 schema | pass | 未写 API path、event name、topic、DTO、callback、payload、transport、repository、handler 或 job name。 |
| 失败口径是否清楚 | pass | 同步失败不形成部分 truth;异步失败待传播 / 待承接;后台失败 stale / rebuilding / unavailable;forbidden body 拒绝或挂起。 |
| 是否逐架构单元停审 | pass | Step 5 的 14 个架构单元均已完成通信方式停审。 |

---

## 6. 跨交互边界审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在同步 / 异步选择冲突 | pass | 核心裁定和读取同步,事实传播和外部结果送达异步,派生维护后台;未混用成伪同步成功。 |
| 是否存在直接穿透边界 | pass | 未让 runtime / tools、SDK、governance、method-library、secret、marketplace、observability 或 external provider 直接写核心 access truth。 |
| 是否存在协议细节下沉 | pass | 未写路径、接口名、事件名、topic、DTO、schema、protocol、transport、outbox、consumer group 或 retry 实现。 |
| 是否存在失败降级缺口 | pass | 每个场景都有失败、pending、unresolved、unknown、stale、rebuilding、unavailable、failed 或 forbidden 口径。 |
| 是否让派生材料阻塞核心 truth | pass | consumer view、search、browse、export、audit summary、ecosystem summary 均不阻塞核心 truth 成立。 |
| 是否让外部结果缺失被默认为成功 | pass | governance / method / secret / downstream / observability / marketplace 缺失均保持 pending、unresolved、unknown 或 unavailable。 |
| 是否与 Step 8 一致性冲突 | pass | 同步场景对应强一致或读取判断;异步和后台场景对应最终一致、引用有效性或边界约束一致。 |
| 是否与 Step 7 依赖方向冲突 | pass | 运行期 / 事件协作 / ref / summary 未升级为编译期依赖或源码 ownership。 |
| 是否与 Step 6 运行承载冲突 | pass | 同步入口、异步协作、后台维护、access truth 承载和派生承载均保持逻辑分离。 |
| 是否存在待确认项被误闭口 | pass | governance seam 字段、method relation 摘要、descriptor 分类、secret safe summary、SDK 交接、API / DTO / state / implementation boundary 均未定形。 |

---

## 7. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| `capability-hub-api` | 本仓需要正式同步入口。 | 旧 API / RPC / handler / service 名称和具体协议。 | 重裁为同步请求 / 响应类交互和同步入口边界。 |
| `registry service` | registry 需要纳入、退出、可见性和维护交互。 | 按 MCP / A2A 协议拆服务或由搜索 / cache 反写 registry。 | 重裁为 registry 同步裁定 + 后台 maintenance / reconciliation。 |
| `provider service` / `Provider Contract` | 外部 API 能力需要接入描述。 | provider runtime、secret、quota、route、cost、failover、retry、invocation result。 | 重裁为 descriptor 同步裁定 + 外部来源 / secret ref 边界。 |
| `access decision service` / `QueryCapabilities` | 下游需要读取受控消费表达。 | runtime allow / deny、Policy cache、consumer view 反写 formal exposure。 | 重裁为 formal exposure 同步裁定 + controlled consumer view 同步读取 / 后台派生。 |
| governance subscription / Policy refresh | governance 结果需要送达并影响 seam / exposure。 | 事件名、Policy truth、shared_rules、last-known-good、30s SLA、白名单刷新。 | 重裁为治理结果异步送达 + seam 同步收口 + 下游传播待承接。 |
| `cost worker` / CostRecord / cost retry | 成本审计是历史线索。 | cost / billing / finance ledger、cost event、provider raw billing、retry 补偿。 | 排除为 historical conflict;不进入新版 Step 9 交互。 |
| KMS / Vault / key rotate | descriptor 需要敏感边界说明。 | KMS / Vault truth、key rotation、secret 正文保存、secret 平台调用主线。 | 重裁为 secret ref / safe summary 边界承接;正文 forbidden。 |
| provider failover / retry / routing / quota | 外部能力来源会变化。 | provider execution gateway、runtime orchestration、route / quota 决策。 | 排除为 runtime / provider boundary;本仓只做来源 / descriptor / ref。 |
| PostgreSQL / cache / outbox / bus 产品名 | 后续可能需要技术承载。 | 作为 Step 9 通信方式或失败机制前提。 | 后移 Step 10 或后续设计,当前只写通信方式类别。 |
| marketplace metadata / observability audit-cost events | 生态和审计会消费摘要。 | listing、transaction、pricing、audit store、trace、metric、cost ledger 正文。 | 重裁为只读生态发现、audit safe summary、ref 和后台交接。 |

---

## 8. 回填草稿

> 注意: 以下只是在 Step 16 装配正式 `01-架构设计.md` 时可使用的 §10 候选文本。当前不得直接写入正式 `01-架构设计.md`。

### 8.1 关键交互与通信方式

`L3-capability-hub` 的关键交互按 capability access truth 边界分为三类。identity、registry、adapter descriptor、governance seam、body-free method relation、formal exposure、traceability 和 controlled consumer view 读取 / 变更使用同步请求 / 响应类交互,因为调用方需要即时获得正式结果、失败、挂起、不可见、stale 或 unavailable 口径。capability access fact 变化传播、外部治理 / 方法 / 来源结果送达和下游消费影响回报使用异步事件 / 回调类交互,因为这些是已成立事实传播或外部结果送达,不能直接穿透核心 truth。registry maintenance、reconciliation、consumer view、search / browse、export、candidate discovery、read-only ecosystem discovery、observability / audit handoff 和引用刷新使用后台任务 / 延后承接类交互,因为这些交互服务最终一致和派生收敛。

正式 §10 可摘录本文件 §5.2 关键交互场景表、§5.4 通信方式判断表、§5.4.1 简化图和 §5.6 架构单元通信方式表。正式文档中不得写 API 路径、事件名、topic、DTO、schema、transport、outbox、consumer group、repository、handler、worker 或 retry 实现。

---

## 9. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 `QueryCapabilities` / access decision 口径与当前 formal exposure 边界冲突 | historical_conflict_not_blocker | 旧口径可作为下游消费线索,但不能作为 runtime allow / deny 或 exposure truth。 | 已重裁为 controlled consumer view 读取和后台派生。 |
| governance seam 字段未完全确定 | not_blocking_step_10 | Step 9 只需确定 seam 交互方式为同步收口 + 外部结果异步送达;字段后移。 | Step 10 和后续设计继续保持 ref / safe summary 边界。 |
| method relation 摘要粒度未完全确定 | not_blocking_step_10 | Step 9 已确认 relation 管理同步、method 结果送达异步、引用有效性后台维护;摘要字段后移。 | 不复制 method body。 |
| secret safe summary 粒度未完全确定 | not_blocking_step_10 | Step 9 已确认 secret ref / safe summary 的同步判断、异步送达和后台刷新口径;secret 正文 forbidden。 | 后续安全 / 横切 / 详细设计细化允许摘要。 |
| SDK exposure 交接细节未完全确定 | not_blocking_step_10 | Step 9 已确认服务端 formal exposure 与 SDK consumer ref / 读取边界分层。 | 具体 SDK surface 后移,不得写 SDK client truth。 |

结论: 未发现阻塞 `01-架构设计.md` Step 10 的上游 blocker。

---

## 10. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确关键交互场景 | pass | §5.2 覆盖同步、异步、后台和外围交互场景。 |
| 已明确通信方式类别 | pass | 使用 `同步请求 / 响应类交互`、`异步事件 / 回调类交互`、`后台任务 / 延后承接类交互`。 |
| 已明确不宜采用方式 | pass | §5.4 每个场景均说明不宜采用的通信方式和边界原因。 |
| 已明确失败处理口径 | pass | 每个场景均有 failure / pending / unresolved / stale / rebuilding / unavailable / forbidden 等架构语义。 |
| 已按架构单元逐个定义交互方式 | pass | §5.6 覆盖 Step 5 的五个核心、四个支撑和五类本地影子单元。 |
| 已完成交互方式停审 | pass | §5.6.2 完成数据所有权匹配、正式边界、协议未下沉、失败口径和逐单元停审。 |
| 已完成跨交互边界审计 | pass | §6 未发现 unresolved 的同步 / 异步选择冲突、直接穿透、协议下沉或失败降级缺口。 |
| 已完成旧材料差异审计 | pass | §7 覆盖旧 API、registry service、provider service、access decision、Policy refresh、Cost、KMS、provider runtime、outbox 等冲突。 |
| 未写协议 / DTO / event schema | pass | 未写 API path、event name、topic、DTO、callback、payload、transport、outbox、consumer group、repository、handler 或 job name。 |
| 正式 `01-架构设计.md` 是否保持未写入 | pass | 当前只创建 Step 9 中间产物;正式 `01` 必须等 Step 16 装配。 |
| 是否可进入 Step 10 | blocked_until_user_confirm | 必须等待用户确认后才能进入 Step 10 `关键技术选型`。 |

当前 next_allowed_action:

```text
wait_user_review_to_step_10
```

当前不需要提交 commit。
