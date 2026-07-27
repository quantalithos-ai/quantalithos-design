# L3-capability-hub 01 架构 Step 14: 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 回填章节: `01-架构设计.md` §15 风险与待确认事项
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 显式收纳 Step 1~13 尚未关闭、且会影响 capability access truth 主线后续概要设计 / 详细设计 / 配置设计 / 测试验收 / 实施计划判断的正式风险和待确认事项;不写任务 backlog、最终解决方案、实施动作、接口字段、状态机细节、技术产品横评或普通优化愿望。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 14 风险与待确认事项 |
| 输出文件 | `design-calibration/01_arch_step_14_risks_open_questions.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 14;`架构设计书写规范.md` §4.15 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_13_evolution_path.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §13 / §14 相关条目作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 14;`L3-method-library` Step 14;`L0-sdk` Step 14 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 13 进入 Step 14 |
| next_allowed_action | Step 14 已完成,等待用户确认后进入 Step 15。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入风险归并思考。 |
| 风险归并:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入风险归并写入。 |
| 风险归并:再写入 | done | 风险表 | pass | 进入待确认事项思考。 |
| 待确认事项:先思考 | done | 缺失确认和当前挂起口径 | pass | 进入待确认事项写入。 |
| 待确认事项:再写入 | done | 待确认事项表 | pass | 进入当前处理口径说明。 |
| 当前处理口径说明 | done | 风险 / 待确认区分短文 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留方向 / 必须废弃旧口径 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §15 候选文本 | pass | 进入 blocker 判定与自检。 |
| Blocker 判定与自检 | done | blocker 表 / 自检表 / 下一步门禁 | pass | 等待用户确认 Step 15。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` Step 14 | 本步必须拆开正式风险与待确认事项,并说明影响范围、当前处理口径、阻塞性或缺失确认。 | 本 Step 只收纳未关闭问题,不解决问题。 |
| `standards/document/架构设计书写规范.md` §4.15 | 风险表写“当前处理口径”和“是否阻塞”;待确认事项表写“缺失确认”和“当前挂起口径”。 | 不能用空泛“后续再看”或“待定”代替判断。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须保留思考、诊断、取舍、结构化产物、回填草稿和停审状态。 | 正式 `01` 暂不写入,只形成 Step 14 校准来源。 |
| `设计文档编写通则.md` | 风险与待确认事项必须服务当前已收稳的主线,不能把边界外职责、任务待办或实现难点抬升成架构风险。 | runtime execution、tools execution、provider runtime、governance approval truth、method body、SDK client、marketplace listing / transaction、cost / billing、KMS / Vault 等仍是排除项。 |
| `设计真相源闭环与可落码性标准.md` | 尚未闭口的 schema、state、port、config、evidence 和 implementation boundary 不得由实现端自行补。 | 本 Step 必须把这些缺口明确挂起到后续文档。 |
| `全局项目依赖关系与裁剪规则.md` | 跨仓依赖回流是正式架构风险,不得在后续设计或实现中绕开。 | 非 `L0-core` sibling 编译期依赖需要直接视为阻塞风险。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 旧 README、旧 `01` 和旧 `02/03/05/06` 都只是 historical material;旧 Provider Contract、Cost、KMS、QueryCapabilities、marketplace、LLM routing 不得继承。 | 风险表必须优先压住历史路径回流。 |
| `01_arch_step_02_goals_constraints.md` | capability-hub 的主线是独立 capability access truth、identity / registry / descriptor、governance seam、body-free method relation 和 formal exposure / controlled consumer view。 | 偏离这条主线的问题才配进入正式风险。 |
| `01_arch_step_03_responsibility_boundary.md` | execution、provider runtime、secret 平台、cost、governance truth、method body、SDK client、marketplace、observability store 等都被明确排除。 | 已排除职责若在后续文档回流,应视为正式风险,不是待确认事项。 |
| `01_arch_step_07_dependency_direction.md` | `L0-core` 是唯一编译期依赖候选;其余协作必须经运行期 / 事件 / ref / summary / relation / controlled view 承接。 | 依赖回流和源码耦合是阻塞性风险。 |
| `01_arch_step_08_data_ownership_consistency.md` | 本仓拥有 capability access truth;consumer view / search / export / audit-friendly summary 是派生;外部对象只以 ref / safe summary 承接。 | truth owner 失效、forbidden body 入仓和派生反写是核心风险。 |
| `01_arch_step_09_interactions_communication.md` | 核心 truth 同步裁定,事实传播异步,派生维护 / 对账 / 导出 / handoff 后台承接。 | 全同步压外围或全异步丢正式裁定,都应进入风险表。 |
| `01_arch_step_10_technology_choices.md` | 当前只固定机制级架构手段,不锁定 DB、cache、broker、protocol、outbox、KMS / Vault、provider adapter、event topic 或 payload schema。 | 具体技术实现未定属于待确认事项,不是架构失败。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 当前不采用 runtime gateway、Provider Contract、governance truth、method body、SDK client、QueryCapabilities、全同步、全异步和正文复制入仓路径。 | 这些路径回流应写成风险而不是“未来可选”。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 正式承接边界、forbidden body、只读派生、核心失败不伪成功、外围失败不回滚和配置不得越界都已收稳。 | 若后续细化打穿这些红线,应视为阻塞风险。 |
| `01_arch_step_13_evolution_path.md` | 当前可接受债务主要是 seam / relation / descriptor / secret summary / SDK exposure 细节、实现承载和量化指标后移。 | 这些事项默认不是风险,只有当它们开始影响主线判断或被错误补齐时才升级。 |
| `00_req_step_15_risks_open_questions.md` | 需求层已识别边界回流、旧指标伪量化、外围增强误阻塞核心和 schema / evidence 细化缺口。 | 架构层需要把这些需求风险映射成结构性风险和待确认事项。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §13 / §14 | historical material | 只吸收 runtime 绕过 hub、MCP / A2A 协议演进、provider 计费模型变动等风险线索;不继承 key rotate、cost accounting、A2A 身份模型截止、LLM routing 归属、cost token 记录、上线策略、回滚策略、`QueryCapabilities P95` 或 `policy refresh lag`。 |
| `L1-governance` Step 14 | reference material | 参考“风险不是功能未做完,而是会打穿已收稳 truth owner / 边界 / 数据 / 交互主线的问题”的表达方式。 |
| `L3-method-library` Step 14 | reference material | 参考“风险表 / 待确认事项表 / 当前处理口径短文 / 旧材料审计”的组织密度。 |
| `L0-sdk` Step 14 | reference material | 参考“可接受债务不自动升级为风险,缺失确认不提前写成已定结论”的口径。 |

---

## 3. 整体模块骨架

Step 14 只处理未关闭问题,不处理任务和方案。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 风险表 | 哪些已识别问题会影响 capability access truth 主线判断,当前如何约束,是否阻塞。 | 不写最终解决方案、负责人、排期、实施步骤或产品决策。 | 风险表。 |
| 待确认事项表 | 哪些问题尚缺确认,当前如何保守挂起。 | 不把缺确认项直接升级为已知风险或定论。 | 待确认事项表。 |
| 当前处理口径 | 为什么某些问题现在是风险,某些问题只能挂起。 | 不重新打开已关闭边界,不回填新主线结论。 | 当前处理口径说明短文。 |

---

## 4. 模块思考记录

### 4.1 风险归并:先思考

问题回答:

- capability-hub 当前最真实的未关闭风险,不是“还有哪些对象没设计完”,而是后续 `02~07` 或实现阶段可能重新打穿 truth owner、正式承接边界、同步 / 异步 / 后台分层和 dependency cut 的问题。
- 这些风险大体分成四类:历史主线回流风险、核心 truth 失效风险、交互分层被改写风险、后续文档自行补真相源风险。
- seam / relation / descriptor / secret summary / SDK exposure 等后移细节本身不是风险;只有当后续文档把它们补成越界 truth、越界依赖、越界同步前置或越界消费写源时,才升级为风险。
- 与之对应,真正的待确认事项是那些还缺 schema、范围裁决、只读接缝裁决、量化目标裁决或 implementation boundary 裁决的问题。

诊断:

- 如果把所有“还没闭口”的事项都写成风险,会让 Step 14 退化成详细设计缺项清单,反而削弱对边界回流的约束力。
- 如果把历史回流路径写成“未来可按需考虑”,会让 Step 11 / Step 13 已排除的主线重新被误认为合法演进。
- 如果不把 implementation boundary 自补风险写出来,后续 agent 很容易把 API、DTO、state、storage、config 和 evidence 当作可以自由脑补的局部问题。

取舍:

- 风险表只收“已识别且会影响主线判断”的问题。
- 待确认事项表只收“仍缺确认、但结论变化会影响前文成立”的问题。
- 对历史路径回流和实现自补风险采用 `有条件阻塞` 或 `阻塞`;对仍能在当前保守边界下继续推进的问题采用 `不阻塞`。

### 4.2 风险归并:再写入

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| 旧 `Registry / Directory / Provider Contract / QueryCapabilities / Cost Accounting / KMS-Vault` 主线回流 | 架构目标;职责边界;数据所有权;关键交互;技术机制;演进路线;测试验收 | 当前只保留为 historical material / conflict 线索,不得成为任何后续正式文档的默认起点。 | 有条件阻塞 | 一旦在 `02~07` 或实现中恢复这些主语,就会直接推翻本轮 Step 1~13 主线。 |
| runtime / tools / SDK / search / export / discovery / observability / maintenance 反写真相 | formal exposure;consumer view;派生快照;外围管理;测试验收 | 当前所有消费、派生、导出、交接和管理动作都只能读取或解释正式 truth,不得成为写源。 | 阻塞 | 这是 capability access truth 是否仍然独立成立的核心红线。 |
| governance truth、method body、secret 正文、provider runtime、cost / billing、marketplace、observability、production payload 正文入仓 | 数据所有权;descriptor;seam / relation;横切安全边界;验收否决 | 当前只允许 ref / safe summary / body-free relation / handoff marker,禁止正文进入本仓。 | 阻塞 | 命中 forbidden body 与相邻 truth owner 一票否决。 |
| 非 `L0-core` sibling 编译期依赖回流 | 依赖方向;技术机制;实施边界;代码组织 | 当前只允许通过运行期 / 事件 / ref / summary / relation / controlled view 协作。 | 阻塞 | 一旦回流源码依赖,后续所有分层和裁剪都会失真。 |
| 把核心 truth 成功伪装成“外围传播 / 派生 / handoff 已完成” | 同步 / 异步 / 后台分层;韧性;可观测性;验收证据 | 当前只承认核心 truth 的同步成立 / 拒绝 / 挂起;外围状态必须单独表达 pending / stale / rebuilding / failed。 | 阻塞 | 这是防止伪闭环和伪成功的关键风险。 |
| 全同步压外围或全异步丢正式裁定的交互回流 | 容器承载;关键交互;技术机制;横切性能 / 韧性 | 当前只允许核心同步、事实传播异步、派生 / handoff 后台承接三类路径共存。 | 有条件阻塞 | 若后续文档把任何一种极端路径写成统一主线,会破坏 Step 9 / 10 / 12 已收稳机制。 |
| seam / relation / descriptor / secret summary / SDK exposure 未闭口时被后续文档自行补成局部 truth | 概要设计;详细设计;配置设计;测试方案;实施计划 | 当前统一按 ref / safe summary / body-free relation / 服务端 exposure boundary 保守挂起,禁止局部补 owner、补正文、补执行语义。 | 有条件阻塞 | 这些细节后移不等于自由发挥。 |
| 旧 `QueryCapabilities P95`、`policy refresh lag`、provider error rate、cost coverage 等旧数字回流为新硬门禁 | 横切性能;测试方案;验收标准;容量治理 | 当前只保留结构性性能 / 容量边界,量化阈值必须基于新版能力面重新定义。 | 不阻塞 | 只要不被直接继承,当前可以继续推进。 |
| 外围增强未完成被误判为核心闭环未通过 | 演进路线;测试验收;实施优先级;外围管理与发现 | 当前 marketplace / console / observability / 候选发现 / 搜索导出 / SDK 说明均按外围增强处理,不阻塞核心 truth 闭环。 | 不阻塞 | 这是约束后续验收和实施不要倒置优先级的正式风险。 |

### 4.3 待确认事项:先思考

问题回答:

- 当前真正尚缺确认的,是那些会影响后续 `02~07` 1:1 落码,但现在还不能定论的边界细化问题。
- 这些问题集中在五类:seam 承载、relation / descriptor 细化、只读外围接缝、量化与观测目标、implementation boundary。
- 旧 `01` 里的 A2A 身份模型、LLM routing 归属、cost token 级记录,要么已被当前边界排除,要么属于外部协议 / runtime / finance 侧问题,不应再保留为本仓待确认事项。
- 与之相反,governance seam 最小承载、method relation 摘要强度、descriptor taxonomy、secret safe summary、SDK exposure handoff 这些问题如果不挂起,后续 agent 就会替设计者做未经确认的裁决。

诊断:

- “后续再看”不是合格挂起口径,因为它没有说明缺什么确认,也没有说明当前如何保守处理。
- 如果把外围只读接缝和量化指标都当成风险,会混淆“已识别失败模式”和“尚缺裁决的设计输入”。
- 如果把 API / DTO / state / storage / config / evidence / implementation boundary 直接写成已定结论,会绕过 `02~07` 的正式职责。

取舍:

- 每个待确认事项都写明缺失确认和当前挂起口径。
- 凡是结论变化会影响多个 Step 的项,明确要求后续回写前文或至少回写 `02~07` 对应文档。

### 4.4 待确认事项:再写入

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| governance seam 的最小承载形态和变化感知粒度 | 数据所有权;关键交互;追溯 / impact;测试验收 | 缺最小字段集合、状态粒度和变化感知是否量化的确认 | 当前只保留 governance result ref / safe summary / review separation,不迁入 approval / Policy / shared_rules truth。 | 该项若变化,会影响后续 schema、交互和测试口径,但不改变 truth owner。 |
| capability-method relation 的适用性摘要强度 | relation schema;风险解释;消费判断;测试矩阵 | 缺 relation 是否需要 capability type / method applicability summary 的确认 | 当前按 body-free relation + method asset ref / allowed summary 挂起,不保存 method body。 | 该项若过弱会影响解释力,过强会越界到 method truth。 |
| adapter descriptor 的 taxonomy 和协议类别切分 | descriptor schema;概要对象;交互矩阵;配置设计;测试矩阵 | 缺普通外部 API、LLM provider API、MCP、A2A 与 provider runtime 边界的最终分类确认 | 当前只保留“外部 MCP / A2A / API 接入 + provider runtime 排除”主线,不预支 adapter 类型。 | 该项影响后续对象拆分和测试覆盖,但当前不改变 descriptor 是核心 truth 的结论。 |
| secret ref / safe summary 的最小内容 | 安全边界;descriptor 风险解释;配置设计;测试验收 | 缺允许摘要字段和敏感信息裁剪粒度确认 | 当前只允许 secret ref 和 secret handling safe summary,继续禁止 secret 正文和 KMS / Vault truth 入仓。 | 该项未闭口时不能由实现端随意定义 secret snapshot。 |
| 服务端 formal exposure 与 `L0-sdk` 的 handoff contract | 系统上下文;数据所有权;关键交互;测试验收;实施计划 | 缺服务端 exposure contract、影响摘要和 SDK 侧消费接缝说明的确认 | 当前只锁定 formal exposure 归 capability-hub,SDK client / package 归 `L0-sdk`。 | 该项若不闭口,后续很容易被误写成 SDK 先定义服务端 surface。 |
| marketplace / console / observability / finance / KMS 是否需要正式只读接缝 | 系统上下文;外围管理与发现;对账 / handoff;配置设计 | 缺外围系统中哪些需要正式只读 exposure / ref / summary 接缝的确认 | 当前统一按外围只读候选处理,listing / transaction / finance ledger / KMS truth 继续排除。 | 该项决定后续是否需要正式接口或事件边界,不决定核心 truth。 |
| formal exposure / consumer view / propagation / handoff 是否需要量化目标 | 横切性能;测试方案;验收标准;容量治理 | 缺正式负载模型、测量对象和 acceptance 量化目标确认 | 当前只保留“核心同步链路不被外围拖重、派生可滞后但需可解释”的结构性判断。 | 该项不应回退为旧 `P95` 或 `30s` 口径。 |
| API / Command / Query / Event、DTO、状态机、存储、配置、evidence 和 implementation boundary 的正式定义 | `02~07` 全链路可落码性 | 缺后续文档逐层闭口和校准来源确认 | 当前按能力级边界挂起,明确不得在实现中自行补口径。 | 这是最直接的可落码待确认项,但不应在 Step 14 越级定论。 |

### 4.5 当前处理口径说明

本章把已经明确会打穿 capability access truth 主线的问题写成风险,把仍缺 schema、范围、只读接缝、量化目标或 implementation boundary 裁决的问题写成待确认事项。风险的当前处理口径只说明如何保守约束或暂存,不写最终解决方案;待确认事项只说明缺什么确认以及当前如何挂起,不预支后续 `02~07` 的详细结论。当前统一口径是:未闭口内容不进入核心写源,外围增强不升级为前置,历史主线不回流,实现端不得自补真相源。只要继续按这个保守口径推进,Step 15 可继续进行。

---

## 5. 旧材料差异审计

### 5.1 可保留为当前风险或待确认方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| `runtime 绕过 hub` | 重裁为 runtime / tools / SDK / consumer view / export / discovery 反写真相风险。 |
| MCP / A2A 协议快速演进 | 重裁为 descriptor taxonomy 与协议类别切分待确认事项。 |
| provider API 计费模型多变 | 仅保留为 finance / billing 继续排除但可能需要外围只读接缝的线索。 |
| tenant / org 隔离复杂度上升 | 仅保留为后续配置 / visibility / governance seam 可能受压的线索,不单独升级为当前主线。 |

### 5.2 必须废弃的旧口径

| 旧口径 | 为什么不能在 Step 14 继承 | 后续处理 |
|---|---|---|
| `key rotate 失败` 作为 capability-hub 核心架构风险 | 当前 secret / KMS / Vault truth 不归本仓。 | 仅作为外部 secret 平台风险背景。 |
| `cost accounting 延迟` 作为 capability-hub 核心架构风险 | cost / billing / finance ledger 不归本仓。 | 继续按边界外处理。 |
| `A2A 身份模型` 截止 / 负责人 | 这是外部协议或实现协作问题,且当前规范禁止负责人和截止时间。 | 若后续需要,在协议 / 配置 / 实施阶段重提。 |
| `LLM routing 归属` 作为待确认主线项 | LLM routing 已被当前边界明确排除。 | 不再进入本仓待确认事项。 |
| `cost token 级记录` 作为待确认主线项 | finance / billing 不属于 capability-hub。 | 不再进入本仓待确认事项。 |
| 上线策略、回滚策略、`QueryCapabilities P95`、`policy refresh lag`、provider error rate | 这些属于旧实现 / 运维 / 测试验收方案,不是 Step 14 架构风险表达。 | 仅保留为 historical material。 |

---

## 6. 回填草稿

### 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/01_arch_step_14_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/01_arch_step_14_risks_open_questions.md` 的“4.2 风险归并:再写入”“4.4 待确认事项:再写入”“5. 旧材料差异审计”和“7. Blocker 判定与自检”小节,了解本章如何从 Step 1~13 的主线、红线、债务和历史冲突收束未关闭问题。

#### 15.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| 旧 `Registry / Directory / Provider Contract / QueryCapabilities / Cost Accounting / KMS-Vault` 主线回流 | 架构目标;职责边界;数据所有权;关键交互;技术机制;演进路线;测试验收 | 当前只保留为 historical material / conflict 线索,不得成为任何后续正式文档的默认起点。 | 有条件阻塞 | 一旦在 `02~07` 或实现中恢复这些主语,就会直接推翻本轮 Step 1~13 主线。 |
| runtime / tools / SDK / search / export / discovery / observability / maintenance 反写真相 | formal exposure;consumer view;派生快照;外围管理;测试验收 | 当前所有消费、派生、导出、交接和管理动作都只能读取或解释正式 truth,不得成为写源。 | 阻塞 | 这是 capability access truth 是否仍然独立成立的核心红线。 |
| governance truth、method body、secret 正文、provider runtime、cost / billing、marketplace、observability、production payload 正文入仓 | 数据所有权;descriptor;seam / relation;横切安全边界;验收否决 | 当前只允许 ref / safe summary / body-free relation / handoff marker,禁止正文进入本仓。 | 阻塞 | 命中 forbidden body 与相邻 truth owner 一票否决。 |
| 非 `L0-core` sibling 编译期依赖回流 | 依赖方向;技术机制;实施边界;代码组织 | 当前只允许通过运行期 / 事件 / ref / summary / relation / controlled view 协作。 | 阻塞 | 一旦回流源码依赖,后续所有分层和裁剪都会失真。 |
| 把核心 truth 成功伪装成“外围传播 / 派生 / handoff 已完成” | 同步 / 异步 / 后台分层;韧性;可观测性;验收证据 | 当前只承认核心 truth 的同步成立 / 拒绝 / 挂起;外围状态必须单独表达 pending / stale / rebuilding / failed。 | 阻塞 | 这是防止伪闭环和伪成功的关键风险。 |
| seam / relation / descriptor / secret summary / SDK exposure 未闭口时被后续文档自行补成局部 truth | 概要设计;详细设计;配置设计;测试方案;实施计划 | 当前统一按 ref / safe summary / body-free relation / 服务端 exposure boundary 保守挂起,禁止局部补 owner、补正文、补执行语义。 | 有条件阻塞 | 这些细节后移不等于自由发挥。 |
| 旧量化指标回流为新硬门禁 | 横切性能;测试方案;验收标准;容量治理 | 当前只保留结构性性能 / 容量边界,量化阈值必须基于新版能力面重新定义。 | 不阻塞 | 只要不被直接继承,当前可以继续推进。 |

#### 15.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| governance seam 的最小承载形态和变化感知粒度 | 数据所有权;关键交互;追溯 / impact;测试验收 | 缺最小字段集合、状态粒度和变化感知是否量化的确认 | 当前只保留 governance result ref / safe summary / review separation,不迁入 governance truth。 | 该项若变化,会影响后续 schema、交互和测试口径,但不改变 truth owner。 |
| capability-method relation 的适用性摘要强度 | relation schema;风险解释;消费判断;测试矩阵 | 缺 relation 是否需要 capability type / method applicability summary 的确认 | 当前按 body-free relation + method asset ref / allowed summary 挂起,不保存 method body。 | 该项若过弱会影响解释力,过强会越界到 method truth。 |
| adapter descriptor 的 taxonomy 和协议类别切分 | descriptor schema;概要对象;交互矩阵;配置设计;测试矩阵 | 缺外部 API、LLM provider API、MCP、A2A 与 provider runtime 边界的最终分类确认 | 当前只保留“外部 MCP / A2A / API 接入 + provider runtime 排除”主线,不预支 adapter 类型。 | 该项影响后续对象拆分和测试覆盖。 |
| secret ref / safe summary 的最小内容 | 安全边界;descriptor 风险解释;配置设计;测试验收 | 缺允许摘要字段和敏感信息裁剪粒度确认 | 当前只允许 secret ref 和 secret handling safe summary,继续禁止 secret 正文和 KMS / Vault truth 入仓。 | 该项未闭口时不能由实现端随意定义 secret snapshot。 |
| 服务端 formal exposure 与 `L0-sdk` 的 handoff contract | 系统上下文;数据所有权;关键交互;测试验收;实施计划 | 缺服务端 exposure contract、影响摘要和 SDK 侧消费接缝说明的确认 | 当前只锁定 formal exposure 归 capability-hub,SDK client / package 归 `L0-sdk`。 | 该项若不闭口,后续很容易被误写成 SDK 先定义服务端 surface。 |
| marketplace / console / observability / finance / KMS 是否需要正式只读接缝 | 系统上下文;外围管理与发现;对账 / handoff;配置设计 | 缺外围系统中哪些需要正式只读 exposure / ref / summary 接缝的确认 | 当前统一按外围只读候选处理,listing / transaction / finance ledger / KMS truth 继续排除。 | 该项决定后续是否需要正式接口或事件边界,不决定核心 truth。 |
| formal exposure / consumer view / propagation / handoff 是否需要量化目标 | 横切性能;测试方案;验收标准;容量治理 | 缺正式负载模型、测量对象和 acceptance 量化目标确认 | 当前只保留结构性判断,不回退为旧 `P95` 或 `30s` 口径。 | 该项不应在 Step 14 越级定数。 |
| API / Command / Query / Event、DTO、状态机、存储、配置、evidence 和 implementation boundary 的正式定义 | `02~07` 全链路可落码性 | 缺后续文档逐层闭口和校准来源确认 | 当前按能力级边界挂起,明确不得在实现中自行补口径。 | 这是最直接的可落码待确认项,但不应在 Step 14 越级定论。 |

#### 15.3 当前处理口径

本章把已经明确会打穿 capability access truth 主线的问题写成风险,把仍缺 schema、范围、只读接缝、量化目标或 implementation boundary 裁决的问题写成待确认事项。风险的当前处理口径只说明如何保守约束或暂存,不写最终解决方案;待确认事项只说明缺什么确认以及当前如何挂起,不预支后续 `02~07` 的详细结论。当前统一口径是:未闭口内容不进入核心写源,外围增强不升级为前置,历史主线不回流,实现端不得自补真相源。

---

## 7. Blocker 判定与自检

### 7.1 blocker 判定

| Blocker ID | 状态 | 描述 | 当前处理 |
|---|---|---|---|
| none | not_blocking_step_15 | 当前未发现阻塞进入 Step 15 的上游 blocker。 | Step 15 继续基于正式 `00`、架构 Step 1~14 和需求追溯输入建立 ADR 候选与追溯矩阵。 |

### 7.2 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确区分正式风险与待确认事项 | pass | 已拆分风险表和待确认事项表。 |
| 每项风险是否写清影响范围、当前处理口径和阻塞性 | pass | 风险表逐项收敛阻塞 / 有条件阻塞 / 不阻塞。 |
| 每项待确认事项是否写清影响范围、缺失确认和当前挂起口径 | pass | 待确认事项表逐项给出缺失确认和保守挂起方式。 |
| 是否避免把 TODO、实现难点或产品愿望写成风险 / 待确认事项 | pass | 未写任务 backlog、负责人、排期、实施动作或愿望池。 |
| 是否避免把已排除边界重新写成可选主线 | pass | LLM routing、cost token 记录、KMS / Vault、marketplace transaction 等均未重新进入本章。 |
| 是否可进入 Step 15 | pass | 可继续 ADR 与需求追溯,且本步未要求提前写正式 `01`。 |

### 7.3 本 Step 结论

Step 14 已完成。当前 capability-hub 架构没有阻塞进入 Step 15 的开放问题;但存在若触发则必须回写的阻塞或有条件阻塞项,尤其是历史主线回流、派生反写真相、forbidden body 入仓、跨仓编译期依赖回流以及后续文档 / 实现自行补真相源。其余 seam / relation / descriptor / secret summary / SDK exposure / 外围只读接缝 / 量化目标 / implementation boundary 等问题,已按待确认事项保守挂起。
