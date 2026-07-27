# L3-capability-hub 01 架构 Step 13: 演进路线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 回填章节: `01-架构设计.md` §14 演进路线
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、架构 Step 2 / 6 / 7 / 8 / 9 / 10 / 11 / 12 和需求 Step 15,只说明 capability access truth 主线当前做到哪里算成立、哪些结构债务当前可接受、哪些能力后续才进入演进主线,以及什么条件会触发下一阶段;不写项目排期、版本路线、任务拆单、TODO 清单、技术产品选型或边界外能力愿望池。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 演进路线 |
| 输出文件 | `design-calibration/01_arch_step_13_evolution_path.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 13;`架构设计书写规范.md` §4.14 |
| 已读取前序输入 | yes:`01_arch_step_02_goals_constraints.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;`01_arch_step_12_cross_cutting_concerns.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` 相关演进、性能、KMS / Vault、Cost、Policy refresh、marketplace、QueryCapabilities 条目作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 13;`L3-method-library` Step 13;`L0-sdk` Step 13 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 12 进入 Step 13 |
| next_allowed_action | Step 13 已完成,等待用户确认后进入 Step 14。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入当前阶段边界思考。 |
| 当前阶段边界:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入当前阶段边界写入。 |
| 当前阶段边界:再写入 | done | 当前阶段成立条件 / 不可接受债务 | pass | 进入后续演进项思考。 |
| 后续演进项:先思考 | done | 后续阶段判断 / 触发条件草案 | pass | 进入后续演进项写入。 |
| 后续演进项:再写入 | done | 演进路线表 / 触发条件小表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留方向 / 必须废弃旧口径表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §14 候选文本 | pass | 进入 blocker 判定与自检。 |
| Blocker 判定与自检 | done | blocker 表 / 自检表 / 下一步门禁 | pass | 等待用户确认 Step 14。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 13 必须回答当前阶段做到哪里算足够、哪些债务当前可接受、哪些能力后续才进入主线、哪些条件触发下一阶段。 | 本 Step 只能写结构阶段,不能写任务、排期、版本或实现计划。 |
| `standards/document/架构设计书写规范.md` §4.14 | 演进路线主表必须包含阶段、当前目标 / 范围、当前可接受债务、后续演进项、触发条件和说明。 | 本 Step 必须用主表承接,短文和触发表只能作为辅助,不能替代表格。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,保留计划、诊断、取舍、结构化产物、回填草稿和停审门禁。 | 正式 `01` 暂不写入,只形成 Step 13 校准来源。 |
| `设计文档编写通则.md` | 演进路线要服务已收稳的边界、依赖、数据、交互和横切主线,不能借“未来演进”重开边界外职责。 | runtime execution、tools execution、governance approval truth、method body、SDK client、marketplace listing / transaction、cost / billing、KMS / Vault 等不能写成后续主线。 |
| `设计真相源闭环与可落码性标准.md` | 当前未收稳的实现层细节必须后移,不能靠演进路线暗示实现端自行补口径。 | 本 Step 只能写结构债务和触发条件,不能提前写对象、schema、storage、worker 或脚本。 |
| `全局项目依赖关系与裁剪规则.md` | 后续演进也必须继续满足 `L0-core` 唯一编译期依赖候选和跨仓运行期 / 事件 / ref / summary / consumer boundary 裁剪。 | 任何未来阶段都不能回到 sibling 编译期依赖或共享 truth。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已钉住独立 capability access truth、identity / registry / descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view、变化追溯和外围隔离。 | 当前阶段成立条件必须围绕这些结构,而不是围绕旧 Query / Cost / KMS 或 provider 平台。 |
| `01_arch_step_06_container_deployment.md` | 已收敛同步入口承载、异步协作承载、后台维护与派生承载、access truth 承载和受控消费 / 追溯派生承载分层。 | 演进阶段不能把后台派生、对账、交接和生态发现升为核心同步前置。 |
| `01_arch_step_07_dependency_direction.md` | `L0-core` 是唯一编译期依赖候选;governance、method、runtime / tools、SDK、marketplace、observability、secret、finance 等都必须经正式边界 / ref / safe summary / relation / controlled view 承接。 | 后续演进也必须继续保护依赖裁剪和 truth owner。 |
| `01_arch_step_08_data_ownership_consistency.md` | 本仓拥有 capability access truth;consumer view / search / export / audit-friendly summary 是派生;外部对象以 ref / summary 承接;forbidden body 禁止入仓。 | 当前可接受债务和后续演进项都不能破坏 truth / snapshot / ref / forbidden body 分层。 |
| `01_arch_step_09_interactions_communication.md` | 核心 truth 裁定 / 读取同步,已成立事实传播和外部结果送达异步,派生维护 / 对账 / 导出 / handoff 后台承接。 | 后续演进项必须建立在同步 / 异步 / 后台三类路径不被混写的前提下。 |
| `01_arch_step_10_technology_choices.md` | 已采用正式承接边界、依赖倒置、truth / snapshot / ref / forbidden body 分层、核心强一致 + 派生最终一致、formal exposure / consumer view 分层、traceability / impact / handoff 和外围隔离。 | 当前阶段成立应以这些机制组合后的主线成立为准,不以具体产品或实现机制为准。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 当前主线是“独立 capability access truth 与分层承接方案”;已放弃 runtime gateway、Provider Contract、governance truth、method body、SDK client、QueryCapabilities、全同步、全异步和正文复制入仓路径。 | 演进路线不能把这些已放弃路径重新包装成“未来阶段”。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 正式承接边界、forbidden body、只读派生、核心失败不伪成功、外围失败不回滚、核心同步链路不被外围拖重、配置不得越界均已成为长期约束。 | 所有阶段都必须持续满足这些横切红线。 |
| `00_req_step_15_risks_open_questions.md` | governance seam 最小承载、method relation 摘要强度、descriptor 分类、secret safe summary、SDK exposure 交接、外围只读接缝和量化指标仍需后续文档细化。 | 这些事项可进入“当前可接受债务”或“后续演进项”,但不能装作当前已闭口。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` | historical material | 只审计旧 `MCP Registry / A2A Directory / Provider Contract / Cost Accounting`、`QueryCapabilities`、`Policy refresh < 30s`、KMS / Vault、provider failover / retry / route / quota、marketplace metadata、observability audit store、PostgreSQL / cache / outbox 等口径。 |
| `L1-governance` Step 13 | reference material | 参考“当前阶段成立条件 + 可接受债务 + 后续结构演进 + 触发条件”组织方式。 |
| `L3-method-library` Step 13 | reference material | 参考“演进路线只写结构阶段、不写愿望池”的写法和旧材料差异审计粒度。 |
| `L0-sdk` Step 13 | reference material | 参考“后续能力必须由边界压力触发,不能自然膨胀进当前主线”的表达方式。 |

---

## 3. 整体模块骨架

Step 13 只回答 capability-hub 架构主线如何阶段性成立和演进,不回答项目怎么排期或实现怎么拆任务。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 当前阶段边界 | 当前主线做到哪里算架构成立。 | 不写详细设计对象、状态、接口或实现计划。 | 当前阶段成立条件和不可接受债务。 |
| 可接受债务 | 哪些结构债务当前不做仍不打穿边界。 | 不写“以后再说”式空泛挂起。 | 当前可接受债务表。 |
| 后续演进项 | 哪些能力后续才进入主线,进入后要改变什么结构面。 | 不把边界外职责或旧草案愿望池写成后续必做项。 | 演进路线表。 |
| 触发条件 | 哪些事实出现后必须进入下一阶段。 | 不写模糊的“未来可能需要”。 | 触发条件小表。 |
| 旧材料差异审计 | 旧演进方向哪些可重裁为当前结构阶段,哪些必须废弃。 | 不继承旧性能数字、产品设施或技术栈路线。 | 差异审计表。 |
| 回填草稿 | Step 16 装配正式 §14 时可直接摘录哪些结论。 | 不直接改正式 `01-架构设计.md`。 | 正式回填草稿。 |
| 自检与停审 | 本 Step 是否足以进入 Step 14。 | 不提前完成风险章节或实施计划。 | blocker 表、自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 当前阶段边界:先思考

问题回答:

- 当前阶段的最低成立标准,不是把 MCP / A2A / API 全协议细节、provider runtime、SDK 生态、marketplace 发现、observability 交接和量化指标一次做完,而是先让独立 capability access truth 主线成立。
- 这个“主线成立”至少包括:identity / registry / descriptor / governance seam / method relation / formal exposure 真相归属稳定;正式承接边界成立;truth / snapshot / ref / forbidden body 分层成立;formal exposure 与 controlled consumer view 分层成立;核心同步裁定、已成立事实异步传播、派生 / 对账 / handoff 后台承接成立。
- 当前阶段必须守住的结构,是那些一旦松动就会立刻回到旧 `Provider Contract + QueryCapabilities + Cost + KMS + runtime gateway` 混线的地方:truth owner、forbidden body、只读派生、依赖裁剪、同步 / 异步 / 后台分层、外围失败不回滚核心。
- 当前阶段不要求锁定数据库、缓存、消息、HTTP / RPC、搜索、provider adapter、topic、schema、consumer group、SLO 数字或物理部署,因为这些还不定义 capability-hub 的结构身份。

诊断:

- 旧 `01` 把 `Registry / Directory / Provider Contract / Cost Accounting`、`QueryCapabilities`、`Policy refresh < 30s`、KMS / Vault、provider failover / retry / route / quota、marketplace metadata 和 observability audit store 混在“演进”里,本质上是旧主线没有先把 truth owner 切干净。
- 如果当前 Step 13 继续把 provider 平台、runtime query、marketplace 列表、cost center、KMS / Vault 或 audit store 写成“下一阶段自然会加”,实现端就会误以为这些是 capability-hub 的预留核心职责。
- 需求 Step 15 里真正尚未关闭的,是 seam / relation / descriptor / secret summary / SDK exposure 的细化强度,而不是重新定义仓级定位。

取舍:

- 当前阶段成立标准只收敛到 capability access truth 主线成立。
- 当前可接受债务只保留那些“不做也不打穿主线”的结构债务。
- 任何已被 Step 2 / 3 / 7 / 8 / 11 / 12 排除的路径,都不得进入后续主线。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确当前阶段最低成立边界 | pass | 已收敛为独立 capability access truth 与分层承接主线成立。 |
| 是否区分结构成立与实现完善 | pass | 未把存储、消息、协议、SLO 或运维项混入当前阶段成立条件。 |
| 是否避免旧主线回流 | pass | 未把 QueryCapabilities、Provider Contract、KMS、Cost 或 runtime gateway 写为当前阶段必要项。 |
| 是否可进入“当前阶段边界:再写入” | pass | 可形成当前阶段成立条件与可接受债务表。 |

### 4.2 当前阶段边界:再写入

#### 4.2.1 当前阶段成立条件

| 当前阶段必须成立结构 | 判断口径 |
|---|---|
| 独立 capability access truth 成立 | capability identity、registry、adapter descriptor、governance seam、body-free method relation、formal exposure 和 change / impact fact 必须以本仓为正式 truth owner 成立。 |
| 正式承接边界成立 | 所有外部来源输入、治理 / 方法关系输入、下游读取和管理动作都必须经正式承接边界、ref、safe summary、body-free relation 或 controlled consumer view 承接。 |
| truth / snapshot / ref / forbidden body 分层成立 | consumer view、search / browse、export、audit-friendly summary、生态发现只能是派生;外部对象只能以 ref / safe summary 承接;governance truth、method body、secret 正文、provider runtime、SDK client、cost、marketplace、observability 和 production payload 正文不得入仓。 |
| formal exposure / controlled consumer view 分层成立 | 正式暴露只能由核心 truth 同步裁定;下游消费视图只能派生,不得反写 identity、registry、descriptor、seam、relation 或 exposure。 |
| 同步 / 异步 / 后台三类路径分层成立 | 核心 truth 裁定 / 读取同步;已成立事实传播和外部结果送达异步;consumer view、对账、导出、handoff、只读发现后台承接。 |
| 核心强一致 + 派生最终一致成立 | identity、registry、descriptor、seam、relation、exposure 内部关系要求同步成立 / 拒绝 / 挂起;派生和外围交接允许延迟,但必须可解释。 |
| 追溯 / 影响 / handoff 语义成立 | 关键变化、引用状态、consumer impact 和外围交接状态必须能解释来源、范围、原因和当前状态。 |
| 外围增强与核心闭环隔离成立 | marketplace、console、observability、SDK 体验、候选发现、只读生态发现、搜索 / 导出等增强不阻塞 capability access truth 核心闭环成立。 |

#### 4.2.2 当前可接受债务与不可接受债务

| 债务类型 | 当前是否可接受 | 理由 | 后续处理 |
|---|---|---|---|
| 未锁定数据库、缓存、消息、搜索、HTTP / RPC、provider adapter、topic、schema、consumer group 或物理部署 | 可接受 | 这些属于实现承载,不定义 capability-hub 的 truth owner 和分层边界。 | `02~04`、`07` 后续文档收敛。 |
| governance seam 最小字段、变化感知窗口未闭口 | 可接受 | 当前只需确认 governance truth 不归本仓,以及本仓只承接 ref / safe summary / relation。 | `01~03`、`05~06` 后续细化。 |
| capability-method relation 摘要强度未闭口 | 可接受 | 当前已锁定 body-free relation 和 method asset ref,摘要强度只影响后续 schema 和测试。 | `01~03`、`05~06` 后续细化。 |
| adapter descriptor 分类未最终展开 | 可接受 | 当前已锁定 descriptor 是核心 truth 且不得吸收 provider runtime / secret / cost,具体分类后移。 | `01~04`、`05` 后续细化。 |
| secret safe summary 最小内容未闭口 | 可接受 | 当前已锁定 secret 正文和 KMS / Vault truth 不入仓,字段级安全摘要不影响主线成立。 | `01~05` 后续细化。 |
| SDK exposure 交接方式未闭口 | 可接受 | 当前已锁定服务端 formal exposure 归本仓、SDK client / package 不归本仓。 | `01~07` 后续细化。 |
| marketplace / console / observability / finance / KMS 只保留外围接缝 | 可接受 | 这些不是 capability-hub 核心 truth owner,当前只需不越界。 | 若后续需要正式只读接缝,在后续文档按边界细化。 |
| 非功能量化指标未正式定义 | 可接受 | 当前没有基于新版主线能力面的正式测量对象和负载模型。 | `05-测试方案.md`、`06-验收标准.md` 后续收敛。 |
| capability access truth 边界不清 | 不可接受 | 会让 runtime、SDK、marketplace、consumer view 或 observability 材料反向定义核心 truth。 | 必须当前修正。 |
| consumer view / search / export / handoff 反写真相 | 不可接受 | 会破坏 formal exposure / controlled consumer view 分层。 | 必须当前修正。 |
| governance truth、method body、secret 正文、provider runtime、SDK client、cost、marketplace、observability 正文入仓 | 不可接受 | 会打穿 truth owner 和 forbidden body 边界。 | 必须当前修正。 |
| 非 `L0-core` sibling 编译期依赖回流 | 不可接受 | 会破坏依赖裁剪和 sibling 平权真相边界。 | 必须当前修正。 |
| 核心 truth 成功伪装为“外围传播已完成” | 不可接受 | 会把最终一致外围结果伪装成同步正式事实。 | 必须当前修正。 |

### 4.3 后续演进项:先思考

问题回答:

- 后续演进应围绕“当前主线成立后,哪些结构面会因为边界压力增加而需要增强”,而不是围绕“旧文档里出现过哪些能力名词”。
- 真正合理的后续结构演进,主要是 seam / relation / descriptor / exposure / 派生消费 / handoff / 容量治理这些在本仓边界内的增强,而不是 execution、provider 平台、审批 truth、SDK client、marketplace 交易或 cost center。
- 触发条件必须来自真实结构压力:descriptor 多样性、governance seam 解释不足、method relation 适用性不足、consumer view / handoff 压力、SDK exposure 契约压力、容量 / 配置压力、审计 / 可追溯压力。
- 当前主线演进时,最先变化的通常是外围承接和派生层,不是 core truth center 本身,因为 Step 10~12 已经明确核心 truth 需要尽量稳定。

诊断:

- 如果把“完整 marketplace”“统一 provider runtime”“全量 KMS / Vault”“成本归集”“完整执行网关”写成后续阶段,等于把边界外职责包装成路线图。
- 如果只写“未来有需要再增强”,实现端依然无法判断什么时候必须回写架构,也无法区分可接受债务和结构风险。
- 如果一上来就写“下一阶段是数据库拆分 / 搜索引擎 / 缓存 / outbox / rule engine”,会把架构阶段退化为技术栈升级路线。

取舍:

- 后续阶段按结构压力分为 seam / relation / descriptor / consumer / handoff / capacity 几类增强。
- 每类阶段都要求明确“不应改变的边界”。
- 当前不把任何边界外职责列入后续主线。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写边界内的结构演进 | pass | 后续阶段围绕 seam、relation、descriptor、consumer、handoff、capacity 展开。 |
| 是否给出明确触发条件 | pass | 每类增强都由边界压力、消费压力或容量压力触发。 |
| 是否避免技术栈升级路线 | pass | 未把数据库、缓存、消息或产品设施当作演进阶段。 |
| 是否可进入“后续演进项:再写入” | pass | 可形成演进路线表和触发条件小表。 |

### 4.4 后续演进项:再写入

#### 4.4.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 让独立 capability access truth、正式承接边界、truth / snapshot / ref / forbidden body 分层、formal exposure / controlled consumer view 分层、同步 / 异步 / 后台分层、追溯 / impact / handoff 语义和外围隔离成立。 | 不锁定 DB / cache / broker / search / protocol / SLO;seam / relation / descriptor / secret summary / SDK exposure 细节后移。 | 在后续文档中补齐对象、状态、接口、配置、测试、验收和 implementation boundary。 | 当前边界、依赖、数据和交互已足以让 capability access truth 主线成立,但尚未出现必须改造核心结构的压力。 | 当前目标不是“全能力中心一次做完”,而是先让 capability access truth 主线成立。 |
| governance seam 强化阶段 | 强化 governance result ref / safe summary、scope / 状态解释、变化感知和 access review 分离的结构清晰度。 | 当前允许 seam 最小承载未完全闭口。 | 更清楚的 seam schema、变化感知、引用失效口径和 review / governance 分离约束。 | governance seam 的最小信息不足以支持 formal exposure 判断、追溯解释或消费影响判断时。 | 强化的是 seam,不是把 governance approval / Policy / shared_rules truth 迁入本仓。 |
| relation / descriptor 精化阶段 | 强化 capability-method relation 的适用性摘要和 adapter descriptor 的分类表达能力。 | 当前允许 relation 摘要强度和 descriptor 分类未最终展开。 | relation applicability summary、descriptor taxonomy、类型差异下的风险摘要和兼容解释。 | 外部 capability 类别增多,当前 generic descriptor 或 relation 摘要不足以支持解释、治理或消费判断时。 | 精化的是本仓核心 truth 表达力,不是引入 method body 或 provider runtime truth。 |
| consumer view / handoff 强化阶段 | 强化 controlled consumer view、change impact、search / export / discovery / handoff 的只读派生质量与恢复能力。 | 当前允许派生滞后、rebuilding、stale、pending 和外围交接延迟。 | 更强的只读派生状态模型、消费影响摘要、导出 / handoff 恢复和只读生态发现承接。 | 下游消费、外部交接或外围发现开始影响正式 acceptance 或运维解释,当前派生语义不足时。 | 强化的是只读派生和交接,不得反写真相。 |
| SDK exposure boundary 强化阶段 | 强化服务端 formal exposure 与 `L0-sdk` 交接边界、服务端可消费 surface 说明和变化感知。 | 当前允许 SDK exposure 交接方式未最终闭口。 | 更明确的服务端 exposure contract、影响摘要和 SDK 侧消费接缝说明。 | `L0-sdk` 或下游消费压力要求更稳定的 exposure contract,当前边界解释不足时。 | 强化的是服务端 exposure boundary,不是让本仓拥有 SDK client / package truth。 |
| 观测 / 对账 / 容量治理强化阶段 | 强化关键状态、传播、派生、引用刷新、对账和容量 / 配置治理的正式约束。 | 当前允许无正式量化阈值、无具体观测 schema、无容量模型。 | 正式状态量化、恢复约束、配置治理、容量门禁和对账边界硬化。 | 压测、验收、生产负载或持续故障证明当前状态语义和分层承载不足时。 | 强化的是横切治理和承载约束,不是让 observability store、cost ledger 或 runtime fallback 成为 truth。 |

#### 4.4.2 触发条件小表

| 触发条件 | 需要优先回写的结构面 | 当前处理口径 |
|---|---|---|
| governance seam 信息不足以解释 exposure 判断或变化影响 | Step 8 数据归属、Step 9 交互、Step 10 机制、Step 12 横切 | 当前按正式 ref / safe summary 暂存。 |
| capability 类型增多,descriptor 或 relation 摘要不足以解释差异 | Step 5 子域、Step 8 数据、Step 9 交互、Step 11 取舍 | 当前按 generic descriptor 和 body-free relation 处理。 |
| consumer view、search、export、handoff 的滞后或失败开始影响 acceptance | Step 8 数据、Step 9 交互、Step 12 横切、后续 `05~06` | 当前允许只读派生延迟,但不得反写真相。 |
| `L0-sdk` 或关键下游要求更稳定的服务端 exposure contract | Step 4 上下文、Step 8 数据、Step 9 交互、Step 12 横切 | 当前只锁定服务端 formal exposure boundary。 |
| 压测、验收或生产负载证明当前同步 / 异步 / 后台分层承载不足 | Step 6 承载、Step 9 交互、Step 12 横切、后续 `04~07` | 当前只保留结构性性能 / 容量边界。 |
| 配置变更开始影响 truth owner、路径分层或外围进入条件 | Step 10 机制、Step 12 横切、后续 `04` | 当前已明确配置不得越界,具体清单后移。 |

#### 4.4.3 阶段边界说明

`L3-capability-hub` 当前阶段不是“把 registry、provider 平台、runtime query、治理审批、method 定义、SDK 体验、marketplace、observability 和成本中心全做完”才算成立,而是先让 capability access truth 主线独立成立。当前可接受债务之所以可接受,是因为它们暂不改变 truth owner、依赖裁剪、数据分层和同步 / 异步 / 后台分层。后续演进必须由 descriptor 多样性、seam 解释压力、consumer / handoff 压力、SDK exposure 契约压力或容量 / 配置压力触发,不能由旧草案名词或愿望池自动触发。能在派生层、交接层、解释层和容量治理层解决的问题,不应直接改写 core truth center。

---

## 5. 旧材料差异审计

### 5.1 可保留为当前演进方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| 能力中心后续要增强外部接缝解释能力 | 收敛为 governance seam 强化阶段和 relation / descriptor 精化阶段。 |
| 能力中心后续要支持更友好的消费和发现 | 收敛为 consumer view / handoff 强化阶段,并明确只读派生不得反写真相。 |
| 能力中心后续要支持更清晰的下游 SDK 消费 | 收敛为 SDK exposure boundary 强化阶段,但只强化服务端边界。 |
| 能力中心后续要提升追溯、对账和容量治理 | 收敛为观测 / 对账 / 容量治理强化阶段。 |

### 5.2 必须废弃的旧口径

| 旧口径 | 为什么不能在 Step 13 继承 | 后续处理 |
|---|---|---|
| `MCP Registry / A2A Directory / Provider Contract / Cost Accounting` 作为阶段主语 | 这些对象把 provider runtime、secret、cost 和 registry 主线混写,与当前 truth owner 冲突。 | 仅保留为 historical conflict。 |
| `QueryCapabilities` / allow-deny / runtime query 作为下一阶段 | 会把 consumer view 或执行裁决提升为正式 truth。 | 继续排除为主线外冲突路径。 |
| `Policy refresh < 30s` 作为演进目标 | 本仓不拥有 Policy truth 或刷新职责,且当前缺新版测量对象。 | 若后续需要量化,只能重定义 seam 变化感知对象。 |
| KMS / Vault、provider failover / retry / route / quota 作为演进主线 | 这些属于 secret 平台或 provider runtime 边界,不归本仓。 | 继续按边界外处理。 |
| marketplace metadata publish / transaction 作为阶段路线 | 会把 listing / transaction / pricing / fulfillment 提升为 registry 主线。 | marketplace 只允许只读发现或外围消费。 |
| observability audit store / cost ledger / PostgreSQL / cache / outbox 作为演进阶段 | 这些是实现承载或横切平台,不是结构阶段。 | 后续若需要,在 `02~07` 按承载机制讨论。 |

---

## 6. 回填草稿

### 14. 演进路线

> 校准来源:
> - `design-calibration/01_arch_step_13_evolution_path.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/01_arch_step_13_evolution_path.md` 的“4.2 当前阶段边界:再写入”“4.4 后续演进项:再写入”“5. 旧材料差异审计”和“7. Blocker 判定与自检”小节,了解本章演进阶段如何从前序边界、依赖、数据、交互、取舍和横切约束收敛而来。

#### 14.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 让独立 capability access truth、正式承接边界、truth / snapshot / ref / forbidden body 分层、formal exposure / controlled consumer view 分层、同步 / 异步 / 后台分层、追溯 / impact / handoff 语义和外围隔离成立。 | 不锁定具体实现承载和量化指标;seam / relation / descriptor / secret summary / SDK exposure 细节后移。 | 在后续文档中补齐对象、状态、接口、配置、测试、验收和 implementation boundary。 | 当前边界、依赖、数据和交互已足以让 capability access truth 主线成立,但尚未出现必须改造核心结构的压力。 | 当前目标不是“全能力中心一次做完”,而是先让 capability access truth 主线成立。 |
| governance seam 强化阶段 | 强化 governance result ref / safe summary、scope / 状态解释、变化感知和 access review 分离的结构清晰度。 | 当前允许 seam 最小承载未完全闭口。 | 更清楚的 seam schema、变化感知、引用失效口径和 review / governance 分离约束。 | governance seam 的最小信息不足以支持 formal exposure 判断、追溯解释或消费影响判断时。 | 强化的是 seam,不是把 governance truth 迁入本仓。 |
| relation / descriptor 精化阶段 | 强化 capability-method relation 的适用性摘要和 adapter descriptor 的分类表达能力。 | 当前允许 relation 摘要强度和 descriptor 分类未最终展开。 | relation applicability summary、descriptor taxonomy、类型差异下的风险摘要和兼容解释。 | 外部 capability 类别增多,当前 descriptor 或 relation 摘要不足以支持解释、治理或消费判断时。 | 精化的是本仓核心 truth 表达力,不是引入 method body 或 provider runtime truth。 |
| consumer view / handoff 强化阶段 | 强化 controlled consumer view、change impact、search / export / discovery / handoff 的只读派生质量与恢复能力。 | 当前允许派生滞后和外围交接延迟。 | 更强的只读派生状态模型、消费影响摘要、导出 / handoff 恢复和只读生态发现承接。 | 下游消费、外部交接或外围发现开始影响正式 acceptance 或运维解释时。 | 强化的是只读派生和交接,不得反写真相。 |
| SDK exposure boundary 强化阶段 | 强化服务端 formal exposure 与 `L0-sdk` 交接边界、服务端可消费 surface 说明和变化感知。 | 当前允许 SDK exposure 交接方式未最终闭口。 | 更明确的服务端 exposure contract、影响摘要和 SDK 侧消费接缝说明。 | `L0-sdk` 或关键下游要求更稳定的 exposure contract 时。 | 强化的是服务端 exposure boundary,不是让本仓拥有 SDK client truth。 |
| 观测 / 对账 / 容量治理强化阶段 | 强化关键状态、传播、派生、引用刷新、对账和容量 / 配置治理的正式约束。 | 当前允许无正式量化阈值、无具体观测 schema、无容量模型。 | 正式状态量化、恢复约束、配置治理、容量门禁和对账边界硬化。 | 压测、验收、生产负载或持续故障证明当前承载不足时。 | 强化的是横切治理和承载约束,不是让 observability 或 cost 成为 truth。 |

#### 14.2 阶段边界说明

`L3-capability-hub` 当前阶段不是“把 registry、provider 平台、runtime query、治理审批、method 定义、SDK 体验、marketplace、observability 和成本中心全做完”才算成立,而是先让 capability access truth 主线独立成立。当前可接受债务之所以可接受,是因为它们暂不改变 truth owner、依赖裁剪、数据分层和同步 / 异步 / 后台分层。后续演进必须由 descriptor 多样性、seam 解释压力、consumer / handoff 压力、SDK exposure 契约压力或容量 / 配置压力触发,不能由旧草案名词或愿望池自动触发。

---

## 7. Blocker 判定与自检

### 7.1 blocker 判定

| Blocker ID | 状态 | 描述 | 当前处理 |
|---|---|---|---|
| none | not_blocking_step_14 | 当前未发现阻塞进入 Step 14 的上游 blocker。 | Step 14 继续基于正式 `00`、架构 Step 1~13 和需求 Step 15 汇总风险与待确认事项。 |

### 7.2 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否明确当前阶段主线成立的最低结构边界 | pass | 当前阶段已收敛为 capability access truth 主线成立。 |
| 是否明确当前可接受债务及理由 | pass | seam / relation / descriptor / secret summary / SDK exposure / 量化指标等均有当前口径。 |
| 是否明确后续才进入主线的结构演进项 | pass | 已列出 seam、relation / descriptor、consumer / handoff、SDK exposure、观测 / 对账 / 容量治理强化阶段。 |
| 是否明确触发下一阶段的条件 | pass | 已给出 seam 压力、类型多样性、消费 / 交接压力、SDK 契约压力、容量 / 配置压力等触发条件。 |
| 是否避免项目排期、TODO、愿望池 | pass | 未写版本号、排期、任务拆单或边界外能力愿望池。 |
| 是否避免把已排除事项重新包装成后续主线 | pass | runtime execution、tools execution、governance truth、method body、SDK client、marketplace listing / transaction、cost / billing、KMS / Vault、observability store 均未作为后续主线。 |
| 是否可进入 Step 14 | pass | 可进入风险与待确认事项汇总。 |

### 7.3 本 Step 结论

Step 13 已完成。当前 `L3-capability-hub` 的演进路线以“独立 capability access truth 主线先成立”为核心,后续只在 governance seam、relation / descriptor、consumer / handoff、SDK exposure boundary、观测 / 对账 / 容量治理等结构压力明确出现时进入下一阶段,且任何后续阶段都不得重开 runtime execution、provider runtime、governance approval truth、method body、SDK client、marketplace listing / transaction、cost / billing 或 observability store 等边界外职责。
