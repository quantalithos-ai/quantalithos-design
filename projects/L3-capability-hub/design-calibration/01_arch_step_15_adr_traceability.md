# L3-capability-hub 01 架构 Step 15: ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 回填章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 创建日期: 2026-07-08
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 只把 Step 1~14 已确认的 capability-hub 架构决定与需求来源、约束来源、风险来源显式连接起来,并索引需要长期保留的关键架构决策;不新增架构结论,不伪造正式 ADR 编号或 ADR 文件,不补 API / DTO / state / storage / config / evidence / implementation 细节。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 ADR 与需求追溯 |
| 输出文件 | `design-calibration/01_arch_step_15_adr_traceability.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 15;`架构设计书写规范.md` §4.16 / §4.17 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_13_evolution_path.md`;`01_arch_step_14_risks_open_questions.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_16_traceability_matrix.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §15 / §16 相关条目作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 15;`L3-method-library` Step 15;`L0-sdk` Step 15 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 14 进入 Step 15 |
| next_allowed_action | Step 15 已完成,等待用户确认后进入 Step 16。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入 ADR 索引思考。 |
| ADR 索引:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入 ADR 索引写入。 |
| ADR 索引:再写入 | done | ADR 索引表 | pass | 进入需求追溯思考。 |
| 需求追溯:先思考 | done | 追溯主轴 / 诊断 / 取舍 | pass | 进入需求追溯写入。 |
| 需求追溯:再写入 | done | 需求追溯矩阵 | pass | 进入漏项检查。 |
| 漏项检查 | done | 追溯缺口表 | pass | 进入架构决定停审。 |
| 架构决定停审 | done | 决策停审记录 | pass | 进入跨 ADR / 追溯审计。 |
| 跨 ADR / 追溯审计 | done | 跨表审计 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留方向 / 必须废弃旧口径 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 01 §16 / §17 候选文本 | pass | 进入 blocker 判定与自检。 |
| Blocker 判定与自检 | done | blocker 表 / 自检表 / 下一步门禁 | pass | 等待用户确认 Step 16。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` Step 15 | 本步必须输出 ADR 索引、需求追溯、漏项检查、架构决定停审记录和跨 ADR / 需求追溯审计表。 | 本 Step 只索引和映射已收稳结论,不得新增架构判断。 |
| `standards/document/架构设计书写规范.md` §4.16 | 需求追溯矩阵必须写需求来源、需求结论 / 约束、架构承接结果、承接位置和说明。 | 追溯要回答“为什么这样设计”,不能写成章节目录对照。 |
| `standards/document/架构设计书写规范.md` §4.17 | ADR 索引只记录长期关键架构决策,不写 ADR 正文、文件目录、历史年表或技术清单。 | 普通实现选择、未闭口事项和旧机制不得误入 ADR。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须保留思考、诊断、取舍、结构化产物、回填草稿和停审门禁。 | 正式 `01` 暂不写入,只形成 Step 15 校准来源。 |
| `设计文档编写通则.md` | 追溯和 ADR 都必须服务当前 capability access truth 主线,不能借索引回流边界外职责。 | runtime execution、tools execution、governance approval truth、method body、SDK client、marketplace transaction、cost / billing、KMS / Vault 等仍是排除项。 |
| `设计真相源闭环与可落码性标准.md` | 尚未闭口的 schema、state、port、config、evidence 和 implementation boundary 必须作为缺口暴露,不能由实现端自行补。 | 漏项检查表必须显式挂出这些后续闭口点。 |
| `全局项目依赖关系与裁剪规则.md` | 架构追溯和 ADR 都必须继续满足 `L0-core` 唯一编译期依赖候选和 sibling 运行期 / 事件 / ref / summary 协作裁剪。 | 非 `L0-core` 编译期依赖不能被索引或追溯洗白。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `00_req_step_16_traceability_matrix.md` | 需求层当前主轴是 capability identity、registry、descriptor、governance / method seam、formal exposure / change awareness,且待确认项不得被矩阵关闭。 | 架构追溯必须使用当前 `C-CH-*`、`FR-CH-*`、`BR-CH-*`、`AC/VF` 和当前风险口径。 |
| `01_arch_step_01_requirement_baseline.md` | 新版 `00-需求文档.md` 是唯一直接需求基线;旧 README、旧 `01` 和旧 `02/03/05/06` 只是 historical material。 | 需求追溯和 ADR 都不能直接继承旧主语。 |
| `01_arch_step_02_goals_constraints.md` | 已钉住独立 capability access truth、identity / registry / descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view 和外围隔离。 | ADR 候选必须来自这些长期结构目标和红线。 |
| `01_arch_step_03_responsibility_boundary.md` | execution、provider runtime、secret 平台、cost、governance truth、method body、SDK client、marketplace、observability store 等都被明确排除。 | 追溯矩阵必须体现“做什么 / 不做什么”,ADR 也必须长期保留这些红线。 |
| `01_arch_step_07_dependency_direction.md` | `L0-core` 是唯一编译期依赖候选;其余协作只能经运行期 / 事件 / ref / safe summary / relation / controlled view。 | 依赖裁剪是长期关键决策,属于 ADR 候选和追溯主线。 |
| `01_arch_step_08_data_ownership_consistency.md` | 本仓拥有 capability access truth;consumer view / search / export / audit-friendly summary 是派生;外部对象只以 ref / safe summary 承接。 | 追溯矩阵必须显式承接 truth / snapshot / ref / forbidden body 分层。 |
| `01_arch_step_09_interactions_communication.md` | 核心 truth 同步裁定,已成立事实传播异步,派生维护 / 对账 / 导出 / handoff 后台承接。 | 同步 / 异步 / 后台三分是 ADR 候选,也是需求承接结果。 |
| `01_arch_step_10_technology_choices.md` | 当前只固定机制级架构手段,不锁定 DB、cache、broker、protocol、outbox、KMS / Vault、provider adapter、event topic 或 payload schema。 | 技术产品、对象字段和量化指标不能误入 ADR。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 当前主线是“独立 capability access truth 与分层承接方案”;已放弃 runtime gateway、Provider Contract、QueryCapabilities、governance truth、method body、SDK client 和正文复制入仓路径。 | 这些取舍都必须长期可追溯。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 正式承接边界、forbidden body、只读派生、核心失败不伪成功、外围失败不回滚、配置不得越界均已成为长期约束。 | 这些横切红线要通过追溯和 ADR 显式保留。 |
| `01_arch_step_13_evolution_path.md` | 当前可接受债务主要是 seam / relation / descriptor / secret summary / SDK exposure 细节、实现承载和量化指标后移。 | 这些只能进入漏项检查,不能升格为已闭口 ADR。 |
| `01_arch_step_14_risks_open_questions.md` | 当前正式风险集中在历史主线回流、派生反写真相、forbidden body 入仓、依赖回流和实现自补真相源;待确认集中在 seam / relation / descriptor / secret / SDK / 量化 / implementation boundary。 | Step 15 只能把这些挂起项暴露为追溯缺口,不得关闭。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §15 / §16 | historical material | 只审计旧 ADR、旧追溯、`QueryCapabilities`、Provider Contract、Cost、KMS / Vault、provider runtime、marketplace metadata、observability audit store 和旧指标口径。 |
| `L1-governance` Step 15 | reference material | 参考“主矩阵 + 漏项检查 + ADR 停审 + 跨表审计”的组织方式。 |
| `L3-method-library` Step 15 | reference material | 参考“只对长期关键决策建 ADR 索引,未闭口项留在缺口表”的口径。 |
| `L0-sdk` Step 15 | reference material | 参考“正式 ADR 未建立时使用 `未建立` 占位,不伪造编号”的处理方式。 |

---

## 3. 整体模块骨架

Step 15 的核心是“映射与索引”,不是重开主线。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| ADR 索引 | 哪些已收稳的 capability-hub 架构决策值得长期单独保留。 | 不写 ADR 正文,不建立文件目录,不继承旧编号。 | ADR 索引表。 |
| 需求追溯矩阵 | 哪些需求结论 / 约束被哪些架构结果承接,落在哪些正式章节。 | 不新增需求,不把章节标题机械对照。 | 需求追溯矩阵。 |
| 漏项检查 | 哪些承接仍未闭口、哪些来源仍未建立正式载体。 | 不写补齐方案或任务计划。 | 漏项检查表。 |
| 架构决定停审 | 每个 ADR 候选是否来自已停审结论、是否长期、是否未越级。 | 不评价排期、负责人或实现难度。 | 架构决定停审记录。 |
| 跨表审计 | 是否存在孤儿架构决定、孤儿核心需求、普通实现误入 ADR 或来源链断裂。 | 不回退已收稳前序 Step。 | 跨 ADR / 需求追溯审计表。 |

---

## 4. 模块思考记录

### 4.1 ADR 索引:先思考

问题回答:

- 当前值得进入 ADR 索引的,必须是会长期影响 capability-hub 是否仍然是独立 capability access truth 仓的决策。
- 这些决策集中在八类:独立 truth 中心、正式承接边界、truth / snapshot / ref / forbidden body 分层、formal exposure / consumer view 分层、同步 / 异步 / 后台三分、跨仓依赖裁剪、引用 / safe summary / body-free relation 优先、核心闭环与外围增强隔离。
- DB、cache、broker、protocol、event topic、payload schema、provider adapter、P95 / SLO、搜索或导出工具都不是当前 ADR 候选,因为它们还没有被收敛为长期架构根决策。
- 当前没有已评审通过的 capability-hub 专项 ADR 文件,因此 ADR 编号字段只能诚实写成 `未建立`,不能伪造 `ADR-xxxx` 或 draft 状态。

诊断:

- 旧 `01` 中的 `ADR-0009~0011`、旧 `QueryCapabilities`、Provider Contract、Cost Accounting、KMS / Vault、policy refresh、runtime query、P95 指标等都属于旧主线或旧实现机制,不能直接继承。
- 如果把“待定的 seam schema / descriptor taxonomy / SDK handoff”也写成 ADR,会把 Step 14 明确挂起的事项伪装成已收稳决策。
- 如果不单独索引长期红线,Step 16 正式文档很容易只剩章节正文,而丢失为什么 capability-hub 不是 runtime gateway 或 Provider Contract center 的关键原因。

取舍:

- ADR 表只收长期关键结构决定,不收普通实现选择。
- ADR 编号统一使用 `未建立`,并在说明中注明“值得后续建立正式 ADR”。
- 未闭口事项只进入漏项检查表,不建立 ADR 占位。

### 4.2 ADR 索引:再写入

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立 capability access truth 作为 `L3-capability-hub` 架构核心 | 防止 capability identity、registry、descriptor、seam、relation、exposure 散落到 runtime、SDK、marketplace、consumer view 或 observability 中形成多真相源 | 职责边界 / 数据所有权 / 备选方案 / 风险 | 这是本仓存在的根决策,后续 `02~07` 都必须围绕它展开。 |
| 未建立 | 通过正式承接边界隔离外部来源输入与核心 truth | 防止外部 MCP / A2A / API 输入、治理结果、方法关系或下游管理入口直接打穿核心语义边界 | 系统上下文 / 关键交互 / 横切安全 / 风险 | 该决策长期影响所有写入和读取路径的入口形态。 |
| 未建立 | 采用 truth / snapshot / ref / forbidden body 分层 | 防止 capability access truth、消费快照、外部引用、邻接正文和派生摘要混成一类数据 | 数据所有权 / 一致性策略 / 关键技术选型 | 该决策会长期影响对象归属、存储、查询、测试和验收。 |
| 未建立 | 将 formal exposure 与 controlled consumer view 分层 | 防止查询面、SDK 说明、runtime / tools 读取面或搜索导出面反向定义服务端正式暴露结果 | 职责边界 / 数据所有权 / 关键交互 / 风险 | 该决策长期保护 formal exposure 的服务端主语。 |
| 未建立 | 将核心同步裁定、已成立事实异步传播、派生 / handoff 后台承接分层 | 防止全同步拖垮主链,或全异步让 capability access truth 的正式成立口径消失 | 容器 / 部署架构 / 关键交互 / 技术机制 / 韧性 | 该决策长期影响 API、事件、后台任务和恢复口径。 |
| 未建立 | 除 `L0-core` 外,非 core sibling 只通过运行期 / 事件 / ref / safe summary / relation / controlled view 协作 | 防止 `L1` / `L2` / `L3` / `L4` 仓通过源码依赖形成隐式上下级或循环依赖 | 依赖方向 / 技术机制 / 实施约束 | 该决策长期保护全局依赖裁剪和 sibling 平权真相边界。 |
| 未建立 | 对相邻系统优先使用 ref、safe summary 和 body-free relation,禁止复制邻接正文 | 防止 governance truth、method body、secret 正文、provider runtime、cost、marketplace、observability 或 production payload 入仓 | 数据所有权 / 横切安全 / 风险 / 验收否决 | 该决策长期保护 forbidden body 红线。 |
| 未建立 | 将核心闭环与外围增强隔离 | 防止 search / browse、导出、候选发现、console、marketplace、observability、SDK 说明或生态发现拖成 capability access truth 成立前置 | 架构目标 / 演进路线 / 风险 | 该决策长期决定当前阶段范围和外围增强进入方式。 |

### 4.3 需求追溯:先思考

问题回答:

- 架构追溯主轴应从当前正式需求文档的仓定位、C-CH-1~5 核心闭环、FR-CH-001~016、业务规则边界、数据归属、接口依赖、NFR、AC / VF 和 Step 15 风险出发。
- 架构承接结果必须落到 Step 2~14 已收稳的具体结果上,例如职责边界、上下文、子域、依赖方向、数据所有权、关键交互、技术机制、取舍、横切关注点、演进路线和风险控制。
- 需求追溯不能退化成“00 第几章对应 01 第几章”,而要说明为什么 capability identity 需要独立 truth、为什么 descriptor 不能变成 Provider Contract、为什么 formal exposure 不能被 consumer view 反写。
- 待确认项只能出现在漏项检查表中,不能在主矩阵里被写成“已承接完毕”。

诊断:

- 最容易出错的地方有三处:一是把旧 `QueryCapabilities`、Provider Contract、Cost、KMS 口径当作现行需求来源;二是把 Step 14 待确认项脑补为已闭口承接;三是让 ADR 索引和追溯矩阵互相重复。
- C-CH-5 与 FR-CH-006 / 009 / 013 / 014 / 015 / 016 在消费和变化感知上会交叉出现,但 truth owner 仍应清楚:formal exposure 归 capability-hub,consumer view / SDK / runtime 只是消费面。
- requirement traceability 需要保留“边界为什么被这样裁掉”的理由,否则后续 `02~07` 很容易把外围增强或邻接 truth 拉回主线。

取舍:

- 主追溯矩阵以“需求结论 / 约束组”做行,不强制复制需求 Step 16 的每一条 FR 行,但必须覆盖定位、五个核心闭环、规则边界、数据边界、依赖边界、NFR、验收和风险。
- 对 FR / BR / AC / VF 采用分组列举,保证能回到需求编号体系,同时避免重复粘贴需求矩阵。
- 漏项检查表只写未闭口项和正式 ADR 载体缺口,不重复已完成映射。

### 4.4 需求追溯:再写入

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` §2 仓定位 / Step 1 基线 | `L3-capability-hub` 是外部 MCP / A2A / API capability identity、registry 与 adapter descriptor 的能力接入真相仓,不是 runtime gateway、Provider Contract center、SDK client 仓、marketplace、cost 或 KMS 平台 | 以独立 capability access truth 作为核心,并在职责边界、系统上下文和限界上下文层固定 identity / registry / descriptor / seam / relation / exposure 主轴 | `§3 架构目标与约束`;`§4 职责边界`;`§5 系统边界与上下文`;`§6 限界上下文与子域划分` | 仓定位被转译为正式 truth owner 与仓级边界,这是后续所有对象和交互的前提。 |
| C-CH-1;FR-CH-001~003 | 外部能力必须能以稳定 identity 进入接入语境,并附带风险解释与接入审查事实 | 通过正式承接边界承接外部来源输入,在 identity truth、风险解释和接入审查事实层保持单一能力身份 | `§4 职责边界`;`§5 系统边界与上下文`;`§9 数据所有权与一致性策略`;`§10 关键交互与通信方式` | 架构承接了“identity 不能被 URL / provider / runtime config / marketplace listing 替代”的要求。 |
| C-CH-2;FR-CH-004~006;FR-CH-015~016 | 外部能力必须进入受控 registry,形成可见性、生命周期、一致性维护和变化感知语义 | 通过 registry truth、formal visibility / applicability fact、change / consumer impact fact 和后台维护 / 对账路径承接 | `§6 限界上下文与子域划分`;`§7 容器 / 部署架构`;`§9 数据所有权与一致性策略`;`§10 关键交互与通信方式`;`§14 演进路线` | registry 被明确为正式目录真相,而 search / browse / 导出 / 变化传播只是只读派生或异步协作。 |
| C-CH-3;FR-CH-007~009 | 已注册能力必须拥有可解释 adapter descriptor、风险约束摘要和受控消费说明,但不能吸收 provider runtime 或 secret 正文 | 通过 descriptor truth、descriptor risk / constraint summary、secret ref / safe summary 和 formal exposure / consumer view 分层承接 | `§4 职责边界`;`§9 数据所有权与一致性策略`;`§10 关键交互与通信方式`;`§11 关键技术选型`;`§12 备选方案与取舍` | 架构把旧 Provider Contract 路径裁掉,改为 descriptor + summary + ref 分层。 |
| C-CH-4;FR-CH-010~013 | capability access fact 必须承接 governance result 并保持 method relation 边界,同时保留可追溯性 | 通过 governance seam relation、access review responsibility separation、body-free method relation、traceability / impact fact 和引用 / 摘要边界承接 | `§4 职责边界`;`§6 限界上下文与子域划分`;`§8 依赖方向与层间约束`;`§9 数据所有权与一致性策略`;`§10 关键交互与通信方式`;`§13 横切关注点` | 架构明确承接的是 seam 和 relation,不是 governance approval truth 或 method body truth。 |
| C-CH-5;FR-CH-014~016 | 正式 capability access fact 必须能按边界暴露给 runtime / tools / SDK / 外围消费者,并持续感知变化 | 通过 formal exposure truth、controlled consumer view、change / consumer impact fact、异步传播和外围只读协作承接 | `§5 系统边界与上下文`;`§7 容器 / 部署架构`;`§9 数据所有权与一致性策略`;`§10 关键交互与通信方式`;`§13 横切关注点` | 架构把“正式暴露”和“消费面表达”分层,避免查询、SDK 或 runtime 成为写源。 |
| `00_req_step_10_business_rules_boundaries.md`;BR-CH-001~037 | 本仓必须保护 truth owner、formal exposure、dependency cut、forbidden body、显式变化和边界外职责排除 | 通过职责红线、禁止依赖表、数据禁止正文、一致性策略、不采用路径和风险表承接 | `§4 职责边界`;`§8 依赖方向与层间约束`;`§9 数据所有权与一致性策略`;`§12 备选方案与取舍`;`§15 风险与待确认事项` | 业务规则被转译为架构红线,而不是停留在需求层描述。 |
| `00_req_step_11_data_ownership.md` | capability-hub 只拥有 capability access truth;governance / method / secret / runtime / SDK / marketplace / observability 等对象只能作为 ref / safe summary / 派生 view | 通过 truth / snapshot / ref / forbidden body 分层、核心强一致 + 派生最终一致和只读派生边界承接 | `§9 数据所有权与一致性策略`;`§11 关键技术选型`;`§13 横切关注点` | 这是后续对象、存储、查询、导出和测试都必须继承的数据真相源边界。 |
| `00_req_step_12_interfaces_dependencies.md` | `L0-core` 是唯一编译期依赖候选;governance、method、runtime / tools、SDK、external MCP / A2A / API 必须通过运行期、事件或引用协作 | 通过依赖方向图、依赖倒置表、容器承载分层和同步 / 异步 / 后台三类交互承接 | `§7 容器 / 部署架构`;`§8 依赖方向与层间约束`;`§10 关键交互与通信方式`;`§11 关键技术选型` | 需求中的接口与依赖被转译为仓级协作边界,而不是实现耦合。 |
| `00_req_step_13_non_functional_requirements.md`;NFR-CH-001~020 | 安全、审计、可追溯、幂等、一致性、韧性、性能和配置必须有结构性口径 | 通过正式承接边界、显式失败状态、traceability / impact、只读派生、配置不可越界和核心链路轻量化承接 | `§11 关键技术选型`;`§13 横切关注点`;`§14 演进路线` | 架构保留质量底线,但不预支指标数值、配置 key、监控字段或压测脚本。 |
| `00_req_step_14_acceptance_criteria.md`;`AC-CH-001~037`;`VF-CH-001~013` | 一票否决项包括 truth 污染、边界打穿、非 core 编译依赖、核心失败伪成功、formal exposure 被消费面反写 | 通过 Step 11 取舍、Step 12 横切约束、Step 14 风险表和当前 Step 15 ADR / 追溯长期保留这些红线 | `§12 备选方案与取舍`;`§13 横切关注点`;`§15 风险与待确认事项`;`§17 ADR 索引` | 架构把验收否决项收束成长期可追溯的架构决策和风险红线。 |
| `00_req_step_15_risks_open_questions.md`;Step 14 | seam / relation / descriptor / secret summary / SDK handoff / 外围只读接缝 / 量化目标 / implementation boundary 仍需后续闭口 | 通过待确认事项表和漏项检查表明确挂起,并要求后续 `02~07` 按边界继续闭口 | `§15 风险与待确认事项`;`§16 需求追溯矩阵` | Step 15 只能暴露这些缺口,不能在追溯阶段假装已经解决。 |

### 4.5 追溯范围说明

本章采用“关键需求结论 / 约束到架构承接结果”的粒度,不逐条重写需求 Step 16 的全部 FR 主矩阵。原因是需求侧已经回答了“功能如何回指故事、规则、数据和验收”,而架构侧当前需要回答的是“为什么 capability-hub 必须用独立 truth、正式承接边界、依赖裁剪和 exposure / consumer view 分层来承接这些需求”。因此主矩阵只记录已经成立的来源到承接关系,漏项检查表只记录尚未闭口的追溯缺口和 ADR 载体缺口。

---

## 5. 结构化中间产物

### 5.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` §2 仓定位 / Step 1 基线 | `L3-capability-hub` 是 capability access truth 仓,不是 runtime gateway、Provider Contract center、SDK client 仓、marketplace、cost 或 KMS 平台 | 以独立 capability access truth 作为核心,并固定 identity / registry / descriptor / seam / relation / exposure 主轴 | `§3`;`§4`;`§5`;`§6` | 这是所有架构边界和后续对象设计的总前提。 |
| C-CH-1;FR-CH-001~003 | 稳定 identity、接入语境和接入风险解释必须成立 | 正式承接外部来源,建立 identity truth、风险解释和审查事实 | `§4`;`§5`;`§9`;`§10` | identity 不得被 URL、provider 名、runtime config 或 listing 取代。 |
| C-CH-2;FR-CH-004~006;FR-CH-015~016 | registry、正式可见性、生命周期、一致性维护和变化感知必须成立 | registry truth + formal visibility + change / impact fact + 后台维护 / 对账路径 | `§6`;`§7`;`§9`;`§10`;`§14` | registry 真相和变化感知被收口到 capability-hub,派生搜索和导出只读。 |
| C-CH-3;FR-CH-007~009 | descriptor、风险约束摘要和受控消费说明必须成立,但 provider runtime / secret 正文不得入仓 | descriptor truth + risk / constraint summary + secret ref / safe summary + exposure / consumer view 分层 | `§4`;`§9`;`§10`;`§11`;`§12` | 这是旧 Provider Contract 路径被替换的核心承接。 |
| C-CH-4;FR-CH-010~013 | governance result 承接、access review 分离、method relation 边界和 traceability 必须成立 | governance seam relation + review separation + body-free relation + traceability / impact fact | `§4`;`§6`;`§8`;`§9`;`§10`;`§13` | capability-hub 承接的是 seam / relation,不是 governance truth 或 method body。 |
| C-CH-5;FR-CH-014~016 | 正式暴露、受控消费视图和变化传播必须成立 | formal exposure truth + controlled consumer view + async propagation + 外围只读协作 | `§5`;`§7`;`§9`;`§10`;`§13` | formal exposure 是服务端主语,consumer view 只是消费表达。 |
| `00_req_step_10_business_rules_boundaries.md`;BR-CH-001~037 | truth owner、dependency cut、forbidden body、显式变化和边界外职责排除必须成立 | 职责红线、禁止依赖、数据禁止正文、不采用路径和风险约束 | `§4`;`§8`;`§9`;`§12`;`§15` | 需求规则被转译为长期架构红线。 |
| `00_req_step_11_data_ownership.md` | capability-hub 只拥有 capability access truth,相邻 truth 只能是 ref / safe summary / 派生 view | truth / snapshot / ref / forbidden body 分层 + 强一致 / 最终一致分工 | `§9`;`§11`;`§13` | 后续对象、存储、查询和测试都必须继承这条边界。 |
| `00_req_step_12_interfaces_dependencies.md` | `L0-core` 唯一编译期依赖候选,其余通过运行期 / 事件 / 引用协作 | 依赖方向图、依赖倒置、容器承载分层和同步 / 异步 / 后台三分承接 | `§7`;`§8`;`§10`;`§11` | 接口与依赖被转译为仓级协作边界,不是代码耦合。 |
| `00_req_step_13_non_functional_requirements.md`;NFR-CH-001~020 | 安全、审计、可追溯、幂等、一致性、韧性、性能和配置需要结构性约束 | 正式承接边界、显式失败状态、traceability / impact、只读派生和配置不可越界 | `§11`;`§13`;`§14` | 当前保留结构约束,不预支量化指标或实现设施。 |
| `00_req_step_14_acceptance_criteria.md`;`AC/VF` | truth 污染、边界打穿、非 core 编译依赖、formal exposure 被消费面反写等不能通过验收 | 通过取舍、横切、风险和 ADR 长期保留一票否决红线 | `§12`;`§13`;`§15`;`§17` | 验收否决项需要在架构层长期可追溯。 |
| `00_req_step_15_risks_open_questions.md`;Step 14 | seam / relation / descriptor / secret / SDK / 外围只读接缝 / 量化 / implementation boundary 仍未闭口 | 作为追溯缺口保留,并要求后续文档按边界继续闭口 | `§15`;`§16` | 架构层不脑补这些未确认细节。 |

### 5.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 接缝粒度未闭口 | governance seam 的最小承载形态和变化感知粒度 | 数据所有权;关键交互;追溯 / impact;测试验收 | 保守挂起 | 当前只锁定 governance result ref / safe summary / review separation,不迁入 governance truth。 |
| 摘要强度未闭口 | capability-method relation 的适用性摘要强度 | relation schema;风险解释;消费判断;测试矩阵 | 保守挂起 | 当前只锁定 body-free relation + method asset ref / allowed summary,不得回退为 method body。 |
| 分类体系未闭口 | adapter descriptor 的 taxonomy 和协议类别切分 | descriptor schema;对象拆分;交互矩阵;配置设计;测试矩阵 | 保守挂起 | 当前只锁定外部 MCP / A2A / API 接入 + provider runtime 排除。 |
| 安全摘要未闭口 | secret ref / safe summary 的最小内容 | 安全边界;descriptor 风险解释;配置设计;测试验收 | 保守挂起 | 当前只允许 ref 与 safe summary,禁止 secret 正文和 KMS / Vault truth 入仓。 |
| handoff contract 未闭口 | 服务端 formal exposure 与 `L0-sdk` 的 handoff contract | 系统上下文;关键交互;测试验收;实施计划 | 保守挂起 | 当前只锁定 formal exposure 归 capability-hub,SDK client / package 归 `L0-sdk`。 |
| 只读接缝范围待确认 | marketplace / console / observability / finance / KMS 是否需要正式只读接缝 | 系统上下文;外围管理与发现;对账 / handoff;配置设计 | 保守挂起 | 当前统一按外围只读候选处理,listing / transaction / finance ledger / KMS truth 继续排除。 |
| 量化承接待确认 | formal exposure / consumer view / propagation / handoff 是否需要量化目标 | 横切性能;测试方案;验收标准;容量治理 | 保守挂起 | 当前只保留结构性判断,不回退为旧 `P95` 或 `30s` 数字。 |
| 实现边界未闭口 | API / Command / Query / Event、DTO、状态机、存储、配置、evidence 和 implementation boundary 的正式定义 | `02~07` 全链路可落码性 | 后续文档承接 | 当前只按能力级边界挂起,明确不得在实现中自行补口径。 |
| ADR 载体未建立 | capability-hub 专项正式 ADR 文件 | 长期架构决策评审与沉淀 | 尚未建立 | 当前只形成决策索引,不伪装为已评审 ADR。 |

### 5.3 ADR 索引表

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立 capability access truth 作为 `L3-capability-hub` 架构核心 | 防止 identity、registry、descriptor、seam、relation、exposure 在相邻系统中分叉 | 职责边界 / 数据所有权 / 备选方案 / 风险 | capability-hub 的根决策。 |
| 未建立 | 通过正式承接边界隔离外部来源输入与核心 truth | 防止外部输入、治理结果、方法关系或管理入口直接打穿核心边界 | 系统上下文 / 关键交互 / 横切安全 | 长期影响所有写入 / 读取入口。 |
| 未建立 | 采用 truth / snapshot / ref / forbidden body 分层 | 防止正式 truth、消费快照、外部引用和邻接正文混淆 | 数据所有权 / 一致性策略 / 技术机制 | 长期影响对象、存储、查询和测试。 |
| 未建立 | 将 formal exposure 与 controlled consumer view 分层 | 防止下游消费面、SDK 说明或查询面反向定义服务端暴露结果 | 职责边界 / 数据所有权 / 关键交互 | 长期保护服务端 exposure 主语。 |
| 未建立 | 将核心同步裁定、事实异步传播、派生 / handoff 后台承接分层 | 防止全同步拖重主链或全异步丢失正式成立口径 | 容器 / 部署架构 / 关键交互 / 技术机制 | 长期影响 API、事件、后台任务和恢复。 |
| 未建立 | 除 `L0-core` 外,非 core sibling 只通过运行期 / 事件 / ref / safe summary / relation / controlled view 协作 | 防止 sibling 源码依赖和共享 truth 回流 | 依赖方向 / 技术机制 / 实施约束 | 长期保护全局依赖裁剪。 |
| 未建立 | 对相邻系统优先使用 ref、safe summary 和 body-free relation,禁止复制邻接正文 | 防止 governance truth、method body、secret、provider runtime、cost、marketplace、observability 正文入仓 | 数据所有权 / 横切安全 / 验收否决 | 长期保护 forbidden body 红线。 |
| 未建立 | 将核心闭环与外围增强隔离 | 防止 search / export / discovery / console / marketplace / observability / SDK 说明变成主线前置 | 架构目标 / 演进路线 / 风险 | 长期决定当前阶段范围和后续增强进入方式。 |

### 5.4 架构决定停审记录

| 架构决策 | 是否属于长期关键决策 | 来源链 | 长期影响 | 是否新增未确认结论 | 停审结论 |
|---|---|---|---|---|---|
| 独立 capability access truth 核心 | 是 | Step 1 / Step 2 / Step 3 / Step 8 / Step 11 / Step 14 | 仓定位;对象归属;后续全部文档 | 否 | 通过 |
| 正式承接边界隔离外部输入 | 是 | Step 3 / Step 4 / Step 9 / Step 10 / Step 12 / Step 14 | 所有写入 / 读取入口和安全边界 | 否 | 通过 |
| truth / snapshot / ref / forbidden body 分层 | 是 | Step 3 / Step 8 / Step 10 / Step 12 / Step 14 | 数据归属;存储;查询;测试 | 否 | 通过 |
| formal exposure / consumer view 分层 | 是 | Step 2 / Step 3 / Step 8 / Step 9 / Step 11 / Step 12 | 服务端暴露和下游消费边界 | 否 | 通过 |
| 同步 / 异步 / 后台三分 | 是 | Step 6 / Step 8 / Step 9 / Step 10 / Step 12 / Step 13 | API、事件、后台维护、恢复 | 否 | 通过 |
| 非 `L0-core` sibling 只做运行期 / 事件 / ref 协作 | 是 | Step 1 / Step 4 / Step 7 / Step 10 / Step 11 / Step 14 | 依赖裁剪;代码组织;实施边界 | 否 | 通过 |
| ref / safe summary / body-free relation 优先 | 是 | Step 3 / Step 7 / Step 8 / Step 10 / Step 12 / Step 14 | 相邻 truth owner 保护;forbidden body 约束 | 否 | 通过 |
| 核心闭环与外围增强隔离 | 是 | Step 2 / Step 4 / Step 11 / Step 12 / Step 13 / Step 14 | 范围控制;验收边界;演进路径 | 否 | 通过 |

### 5.5 跨 ADR / 需求追溯审计表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿架构决定 | 未发现 | ADR 表中的每个决策都能回指 Step 1~14 已停审结论。 |
| 是否存在孤儿核心需求 | 未发现 | 仓定位、C-CH-1~5、业务规则、数据归属、接口依赖、NFR、验收和风险均有架构承接或显式缺口。 |
| 是否存在普通实现选择误入 ADR | 未发现 | DB、cache、broker、protocol、topic、payload schema、provider adapter、P95 / SLO 和搜索工具均未进入 ADR。 |
| 是否存在来源链缺失 | 未发现 | 主矩阵和停审记录均能回指正式 `00`、需求 Step 16 和架构 Step 1~14。 |
| 是否存在 Step 14 挂起项被写成已闭口 | 未发现 | seam / relation / descriptor / secret / SDK / 量化 / implementation boundary 全部保留在漏项检查表。 |
| 是否存在旧材料直接继承为现行结论 | 未发现 | 旧 `QueryCapabilities`、Provider Contract、Cost、KMS / Vault、旧 ADR 编号和旧指标均未进入现行索引。 |
| 是否存在外围增强被误升为当前核心前置 | 未发现 | console、marketplace、observability、候选发现、搜索导出和 SDK 说明都只保留为外围增强或只读接缝候选。 |
| 是否存在新增未确认结论 | 未发现 | 本 Step 只做映射和索引,未新增架构主线判断。 |

---

## 6. 旧材料差异审计

### 6.1 可保留为当前方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| capability-hub 是外部能力接入中心 | 重裁为 capability identity / registry / descriptor 的 capability access truth 主线。 |
| 与治理联动 | 重裁为 governance seam relation 和 access review responsibility separation,不继承 governance truth。 |
| 与方法资产联动 | 重裁为 capability-method body-free relation,不继承 method body 或 TaskDefinition 正文。 |
| 下游 runtime / tools / SDK / 生态消费者存在 | 重裁为 formal exposure / controlled consumer view / 外围只读接缝候选,不继承消费者 truth。 |

### 6.2 必须废弃的旧口径

| 旧口径 | 为什么不能进入本轮 Step 15 | 后续处理 |
|---|---|---|
| 旧 `ADR-0009~0011` 与 drafts | 当前没有 capability-hub 专项正式 ADR 文件,旧编号绑定旧主线和旧机制。 | 仅保留为 historical material,不复用编号或状态。 |
| `QueryCapabilities` 作为正式主语 | 会把 formal exposure、consumer view、runtime 查询和 allow / deny 混写。 | 保持为已废弃旧路径。 |
| Provider Contract / Cost Accounting / KMS-Vault 四子域 | 会把 descriptor、secret、provider runtime、finance 和执行平台混成 capability-hub 职责。 | 保持为已废弃旧主线。 |
| provider failover / retry / route / quota / whitelist / policy refresh | 属于 runtime / governance / provider platform / 实现承载细节,不是 capability-hub 当前架构主线。 | 如后续需要,只能在边界外系统单独设计。 |
| marketplace metadata / transaction / observability audit store | 属于外围生态或观测系统 truth,不归本仓。 | 仅可能以只读接缝候选重新进入。 |
| 旧 `P95`、`30s`、provider error rate、cost coverage 等数字 | 旧量化数字没有基于新版 capability access truth 能力面建立。 | 后续 `05~06` 按新版能力面重新决定是否需要量化目标。 |

---

## 7. 回填草稿

### 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读本文件的“5.1 需求追溯矩阵”“5.2 漏项检查表”和“5.5 跨 ADR / 需求追溯审计表”小节,了解 capability-hub 架构如何承接正式 `00` 的仓定位、核心闭环、边界规则、数据归属、依赖裁剪、NFR、验收和风险。

当前架构追溯以正式 `00-需求文档.md` 和需求 Step 16 为基线。主矩阵只记录已经成立的需求结论 / 约束到架构承接结果的映射,不重写需求侧完整 FR 主矩阵。当前 capability-hub 的仓定位、C-CH-1~5 核心闭环、truth owner / forbidden body 规则、依赖裁剪、NFR 结构约束和 AC / VF 否决项均已有明确架构承接;governance seam、relation / descriptor 细化、secret safe summary、SDK handoff、外围只读接缝、量化目标和 implementation boundary 仍保留为漏项检查表中的后续闭口点。

正式装配时:

- `§16.1` 摘录本文件 `5.1 需求追溯矩阵`。
- `§16.2` 摘录本文件 `5.2 漏项检查表`。
- `§16.3` 摘录本文件 `5.5 跨 ADR / 需求追溯审计表` 的审计结论短文。

### 17. ADR 索引

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读本文件的“4.1 ADR 索引:先思考”“5.3 ADR 索引表”和“5.4 架构决定停审记录”小节,了解为什么 capability-hub 当前只索引长期关键决策,而不伪造正式 ADR 编号或补写 ADR 正文。

当前本仓尚未建立 capability-hub 专项正式 ADR 文件。因此正式 `§17` 应诚实表达“当前已识别的长期关键架构决策”,并用 `未建立` 标记 ADR 编号字段,避免把未创建 / 未评审的 ADR 文件伪装成正式产物。正式索引至少应覆盖:独立 capability access truth 核心、正式承接边界、truth / snapshot / ref / forbidden body 分层、formal exposure / consumer view 分层、同步 / 异步 / 后台三分、跨仓依赖裁剪、ref / safe summary / body-free relation 优先和核心闭环 / 外围增强隔离。

正式装配时:

- `§17.1` 摘录本文件 `5.3 ADR 索引表`。
- `§17.2` 摘录本文件 `5.4 架构决定停审记录` 的短结论。

---

## 8. Blocker 判定与自检

### 8.1 blocker 判定

| Blocker ID | 状态 | 描述 | 当前处理 |
|---|---|---|---|
| none | not_blocking_step_16 | 当前未发现阻塞进入 Step 16 的上游 blocker。 | Step 16 只允许在用户确认后基于正式 `00`、架构 Step 1~15 和本文件装配正式 `01`。 |

### 8.2 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否同时输出需求追溯矩阵、漏项检查、ADR 索引、停审记录和跨表审计 | pass | 结构化中间产物已完整落盘。 |
| 是否避免在矩阵或 ADR 中新增前文未确认结论 | pass | Step 14 挂起项全部保留为缺口。 |
| 是否避免把普通实现选择写成 ADR | pass | DB、cache、broker、protocol、schema、P95 / SLO 未进入 ADR。 |
| 是否避免把旧正式文档或旧 ADR 直接继承为现行结论 | pass | 旧 `QueryCapabilities`、Provider Contract、旧 ADR 编号和旧指标均未回流。 |
| 是否明确 capability-hub 当前没有正式 ADR 文件 | pass | ADR 编号统一写 `未建立`,未伪造文件或编号。 |
| 是否可以进入 Step 16 | pass | 可以在用户确认后进入正式文档装配。 |
