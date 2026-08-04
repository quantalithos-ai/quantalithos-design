# Step 15 风险与待确认事项

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 风险与待确认事项 |
| 输出文件 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, Step 01~14 的关键结论、风险线索、裁剪口径和一票否决项 |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 15 与需求书写规范 4.15 |
| 已读取上游粒度参考 | yes, `L1-governance`、`L1-artifact` 与 `L0-bus` 的 Step 15 中间产物 |
| 已读取历史材料 | yes, 旧 README、旧正式 `00~07`、旧验收材料和旧 implementation ledger / boundaries 仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 15 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 15 目标、输入、风险边界和禁写范围诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引、执行约束 | pass | 进入风险识别先思考。 |
| 风险识别:先思考 | done | 风险候选、裁剪项、风险分层和影响范围写法诊断 | pass | 进入风险识别再写入。 |
| 风险识别:再写入 | done | 风险清单和当前可接受 / 后续阻塞判定 | pass | 进入待确认事项先思考。 |
| 待确认事项:先思考 | done | 待确认候选、已收口项和挂起口径诊断 | pass | 进入待确认事项再写入。 |
| 待确认事项:再写入 | done | 待确认事项表和当前不阻塞 / 后续阻塞表 | pass | 进入结构化中间产物。 |
| 当前文档问题诊断 | done | 旧材料污染、旧 Step 15 残留路线、风险 / 待确认粒度和后续文档分层风险诊断 | pass | 进入改动前后对比。 |
| 改动前后对比 | done | 补强前后结构、停审方向、风险口径和待确认事项挂起口径对比 | pass | 进入设计取舍。 |
| 设计取舍 | done | 风险保留、待确认挂起、已收口边界不重开和 Step 16 停审取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 风险结论、待确认事项结论和正式回填最小单元 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 15 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_16_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 15 开工 | pass | 已确认当前只允许推进 `00` 的 Step 15 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 15 的目标、输入、风险边界、禁写范围和对标对象。 |
| 必读文档摘要写入 | pass | 已写入 Step 10~14、SOP、书写规范和上游参考对本步的约束。 |
| 风险识别思考 | pass | 已完成风险候选、风险分层、裁剪项和影响范围写法诊断。 |
| 风险表写入 | pass | 已形成 10 条风险并区分当前可接受与后续阻塞。 |
| 待确认事项思考 | pass | 已完成待确认候选、已收口项和挂起口径诊断。 |
| 待确认事项表写入 | pass | 已形成 9 条正式待确认事项表。 |
| 当前文档问题诊断 | pass | 已诊断旧材料、旧 Step 15 停审路线、实现材料和需求层分层残留风险。 |
| 改动前后对比 | pass | 已明确补强前后在结构、粒度、停审方向和后续门禁上的差异。 |
| 设计取舍 | pass | 已明确保留哪些风险、哪些事项继续挂起、哪些已收口边界不得重开。 |
| 结构化中间产物 | pass | 已整理风险结论、待确认结论和正式回填单元。 |
| 回填草稿 | pass | 已形成正式第 15 章候选草稿。 |
| 自检与停审 | pass | Step 15 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 16 需求追溯矩阵（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`，也不得自动进入 Step 16。下一步只允许在用户确认后进入 `Step 16 需求追溯矩阵（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 15 的目标不是继续补需求，也不是趁机替后续文档做架构、配置、测试或实施选择。它只显式收纳当前需求链中仍需持续约束的风险和待确认事项，防止后续设计者或实现 agent 因为“这里还没写细”就自行脑补 schema、状态、产品栈、证据结论或外部 truth。

对 `L4-observability` 来说，本步最容易滑坡的地方有三类。第一类是把已经在 Step 02、07、10、11、14 收口的边界重新写成“待确认”，导致本来稳定的边界又被打开。第二类是把 API、DTO、字段、存储、配置和测试步骤未定写成“当前阻塞”，把需求层错误抬升为设计层。第三类是把一票否决项弱化成普通风险，或者反过来把外围增强缺失和旧候选指标误升级为阻塞。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 15 | 固定本步目标、输入、输出、应问问题和进入 Step 16 的门禁。 | 风险 / 待确认拆分、停审门禁。 |
| `standards/document/需求文档书写规范.md` 4.15 | 固定风险表、待确认事项表及第三列写法。 | 风险清单、待确认事项表、自检表。 |
| `00_req_step_07_core_capability_loop.md` | 提供 `C-OBS-1~5` 核心闭环和外围增强边界。 | 风险是否影响核心闭环成立。 |
| `00_req_step_09_functional_requirements.md` | 提供 `FR-OBS-001~013` 与 `FR-OBS-E01~E06` 的当前能力范围。 | 风险是否误扩大能力范围。 |
| `00_req_step_10_rules_boundary_constraints.md` | 提供 `BR-OBS-001~026` 的硬规则和禁止行为。 | forbidden body、只读、no-write、historical material 风险。 |
| `00_req_step_11_data_requirements_ownership.md` | 提供真相 / 快照 / 引用 / 禁止保存正文四类边界。 | 正文入仓、body-free 退化、外部 truth 串线风险。 |
| `00_req_step_12_interfaces_dependencies.md` | 提供能力级接口和依赖裁剪边界。 | API / schema 未定不应误判为需求阻塞。 |
| `00_req_step_13_non_functional_requirements.md` | 提供质量判断口径和无来源硬指标裁剪口径。 | 旧 P95 / SLA / 产品绑定伪量化风险。 |
| `00_req_step_14_acceptance_criteria.md` | 提供 `AC-OBS-*` 与 `VF-OBS-*`。 | 后续一旦发生即阻塞的失败情形来源。 |
| `projects/L1-governance/design-calibration/00_req_step_15_risks_open_questions.md` | 参考 Step 15 的结构和思考粒度。 | 先思考、再写入、再停审的组织方式。 |

### 3.3 初步关注点

- 不把 API、DTO、schema、状态机、存储、配置、测试脚本和实施任务写成风险。
- 不把外围增强缺失写成当前核心风险；风险应是“外围增强误入核心”。
- 不把旧 README、旧 `00`、旧 `06` 和旧 implementation ledger 的候选数字与边界直接恢复为当前基线。
- 不把 `VF-OBS-*` 全部原样抄成风险表；风险要表达“后续如何再次打穿边界”，不是重复编号。
- 不把“未定”“后续再看”写成当前状态；必须说明当前如何挂起。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 15 只收纳风险和待确认事项。 |
| 必读文档候选 | pass | 已固定标准、前序 Step 和上游参考。 |
| 初步关注点 | pass | 已明确本步最易混层的写法。 |
| 正式风险表写入 | blocked | 当前尚未进入风险清单正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 15 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 15 | Step 15 只显式收纳尚未关闭的风险和待确认问题，防止为了填满文档而脑补确定性结论。 | 后续必须先做风险候选诊断，再写风险表；再做待确认候选诊断，再写待确认事项表。 |
| `需求文档书写规范.md` 4.15 | 风险表固定使用 `风险 / 影响范围 / 当前处理口径`；待确认事项表固定使用 `待确认事项 / 影响章节 / 当前状态`。 | 风险第三列只能写当前如何约束 / 暂存；待确认第三列只能写当前如何挂起。 |
| Step 07 核心能力闭环 | 核心闭环固定为 `C-OBS-1~5`；高级 dashboard、alert、外部 APM / GRC 等只属外围增强。 | 风险判断必须围绕核心闭环是否被打穿，而不是外围增强是否已纳入。 |
| Step 09 功能需求 | `FR-OBS-001~013` 是核心闭环；`FR-OBS-E01~E06` 为外围增强。 | 风险不应把外围增强缺失误写为核心缺口。 |
| Step 10 规则边界 | `BR-OBS-002`、`BR-OBS-007~018`、`BR-OBS-020~026` 已固定 forbidden body、只读、真实性、留存和 historical material 边界。 | 风险表应聚焦这些规则在后续文档中被重新打穿的情形。 |
| Step 11 数据归属 | `DO-OBS-001~034` 已固定真相 / 快照 / 引用 / 禁止保存正文四类数据边界。 | 风险表必须覆盖正文入仓、快照冒充 truth、引用接管正文生命周期。 |
| Step 12 接口与依赖 | 需求层只收敛能力级接口与依赖边界，不固定 API、DTO、event payload、port、adapter、repo。 | 具体协议和实现未定不构成当前阻塞，只应作为待确认事项挂起。 |
| Step 13 非功能要求 | 已形成质量判断口径，并裁剪无来源 P95 / SLA / 产品栈硬指标。 | 风险表应防止旧候选数字在后续文档中被误升级为硬验收。 |
| Step 14 验收标准 | `VF-OBS-001~010` 已给出会使需求整体不应通过的窄口径失败情形。 | 风险表可引用否决边界的来源，但不能退化成缺陷分级或实施门禁。 |
| `L1-governance` / `L1-artifact` / `L0-bus` Step 15 | 这些项目的 Step 15 均先分层诊断风险，再形成正式双表。 | 本步需要补足“先思考、再写表、再停审”的中间过程，不只保留结论表。 |

### 4.2 Step 15 输入索引

| 输入类型 | 已确认来源 | Step 15 使用方式 |
|---|---|---|
| 边界风险来源 | Step 02、Step 07、Step 10、Step 14 | 识别观察面冒充外部 truth、只读失效、留存 / no-write 失守等风险。 |
| 数据归属风险来源 | Step 11 与 Step 14 | 识别正文入仓、body-free 退化、引用接管生命周期等风险。 |
| 依赖风险来源 | Step 06、Step 12 与 `VF-OBS-008` | 识别 `L0-core` 以外编译期依赖、`L0-bus` 主干越权和相邻仓 truth 越界。 |
| 非功能风险来源 | Step 13、`AC-OBS-029~031`、`VF-OBS-009~010` | 识别无来源硬指标、外部产品绑定和旧材料数字硬化风险。 |
| 待确认事项来源 | 前序 Step 明确后移到 `01~07` 的字段级、协议级、配置级、测试级问题 | 只保留会影响后续文档闭口、但不推翻当前需求结构的问题。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 风险 / 待确认拆分 | 风险写“后续若误用会破坏需求结论”的事项；待确认写“仍需后续文档细化”的事项。 |
| 第三列写法 | 风险写当前如何约束、暂存或归类；待确认写当前如何挂起，不写“未定”。 |
| 不重开已收口结论 | Step 02、07、10、11、14 已收稳的边界不重新写成待确认。 |
| 不写解决方案 | 不写 schema、字段、算法、产品选型、表结构、测试步骤、CI 或实施安排。 |
| 不扩大核心范围 | dashboard、alert、管理报表、外部 APM / GRC、异常检测等只在“误入核心”时形成风险。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物，正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`风险识别:先思考` 需要基于上述摘要先完成三件事：一是把“后续一旦发生即阻塞”的边界失败从普通不确定性里分离出来；二是把“当前可接受但需要后移”的设计细化挂到待确认事项，而不是误判为需求缺口；三是把 API、字段、存储、测试与实施类 TODO 裁剪出去，避免 Step 15 变成设计或实施清单。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入规范、前序 Step 和上游参考对 Step 15 的影响。 |
| 输入索引 | pass | 已明确风险与待确认事项的来源。 |
| 执行约束 | pass | 已明确双表结构和第三列写法。 |
| 风险识别思考 | pass | 已在 §5 完成候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `风险识别:先思考` |

## 5. 风险识别:先思考

### 5.1 风险识别目标

本模块只识别“后续若误用会破坏当前需求结构”的风险，不直接写正式风险表。对 `L4-observability` 来说，真正需要保留的不是“还没选 TimescaleDB”“还没定 retention 天数”这种实现空白，而是会让观察面退化为业务 truth 副本、会让只读交接伪造成真实证据、会让留存 / rebuild 反写 source truth、会让外部产品和旧材料重新绑回需求基线的那些串线点。

### 5.2 风险候选分层

| 风险层级 | 判断标准 | 当前处理方式 |
|---|---|---|
| 后续发生即阻塞 | 一旦发生就会破坏仓定位、核心闭环、truth ownership、真实性或依赖裁剪边界。 | 保留为正式风险清单，并回指 Step 10~14 的约束来源。 |
| 当前可接受但需显式暂存 | 不推翻当前需求结论，但后续 `01~07` 必须继续细化。 | 不进入风险主体，优先转入待确认事项。 |
| 当前应裁剪 | 普通 TODO、实现任务、测试任务、外围增强缺失、旧候选数字未硬化。 | 不作为风险；必要时仅作为后续文档职责记录。 |

### 5.3 保留风险方向诊断

| 候选方向 | 来源 | 保留理由 | 下一步写入口径 |
|---|---|---|---|
| historical material 被后续文档直接恢复为当前基线 | Step 01；`BR-OBS-026`；`VF-OBS-010` | 这是本轮重建链最容易被旧 README、旧 `00`、旧 `06` 和旧 implementation asset 反向污染的位置。 | 写成“旧材料越权替代当前基线”风险。 |
| 观察材料、审计投影、log / metric / trace、diagnostic summary 或 report handoff 被解释为外部 truth | Step 02；`BR-OBS-007`；`BR-OBS-011`；`BR-OBS-014`；`BR-OBS-017`；`VF-OBS-004` | 一旦发生，本仓会从观察面仓退化为多份 truth 副本。 | 写成“观察面冒充外部 truth”风险。 |
| forbidden body、secret、provider response body、runtime body 等在后续 schema / 存储 / 输出中入仓 | `BR-OBS-002`；`BR-OBS-012`；`DO-OBS-007~008`；`DO-OBS-020`；`DO-OBS-032~033`；`VF-OBS-002` | 这是最直接的安全和数据归属红线。 | 写成“正文和高敏材料入仓”风险。 |
| evidence linkage / report handoff 接管 evidence body、artifact body、identity body 或 governance decision body | `BR-OBS-008`；`BR-OBS-017`；`DO-OBS-014`；`AC-OBS-010`；`VF-OBS-003` | body-free 一旦退化，本仓就拥有了不该拥有的正文。 | 写成“body-free 证据退化为正文 ownership”风险。 |
| report handoff 或设计阶段材料静态填写真实 `run_id`、真实 evidence alias、verdict 或 signoff | `BR-OBS-018`；`FR-OBS-011`；`VF-OBS-006` | 会把设计材料伪装成真实测试与验收证据。 | 写成“真实性提示失守，伪造真实证据”风险。 |
| retention / archive / rebuild / replay 被后续设计写成可修复 source truth 或清理活动引用材料 | `BR-OBS-020~023`；`DO-OBS-028~034`；`AC-OBS-023`；`VF-OBS-005`；`VF-OBS-007` | 会同时打穿留存保护和 no-write truth 两条边界。 | 写成“留存与 no-write 边界越权”风险。 |
| `L0-bus` 主干、tap / audit material 或 replay 主干被写成本仓编译期依赖或 truth owner | Step 06；Step 12；`VF-OBS-008` | 会破坏全局依赖裁剪和 bus / observability 分仓边界。 | 写成“bus 边界和依赖裁剪失守”风险。 |
| 外部产品、dashboard、alert、APM、GRC 导出、对象存储被误升级为核心前置或 truth source | Step 07；Step 09；`VF-OBS-009` | 会把需求边界重新绑回产品选型和运行环境。 | 写成“外部产品误入核心 / 成为 truth source”风险。 |
| 旧 P95 / SLA / 冷存期限 / hash chain 分片 / 事件数量被后续测试或验收硬化 | Step 13；`AC-OBS-031`；`VF-OBS-010` | 会让无来源数字反向定义需求结构。 | 写成“旧候选指标伪量化”风险。 |
| 后续 agent 因需求层未固定 API、字段、状态、存储、配置或测试步骤而自行补设计真相 | 书写规范 4.15；Step 12；当前待确认事项 | 这会把需求层留白误读为实现侧授权。 | 写成“文档分层失守”风险。 |

### 5.4 应裁剪候选

| 候选 | 裁剪理由 | 后续归属 |
|---|---|---|
| API / Command / Query / Event 名称未定 | 属于 `02/03` 的协议和对象设计，不是需求风险。 | 待确认事项或后续详细设计。 |
| redaction 具体规则引擎、扫描策略或配置项未定 | 需求层只要求禁止正文与安全处置，不选实现方案。 | `04/05/06`。 |
| retention 天数、archive eligibility 公式、hash / digest 算法未定 | 需求层只收紧边界和判断口径，不固定算法和时长。 | `03/04/05/06/07`。 |
| TimescaleDB / Grafana / Prometheus / OTel / 对象存储尚未选型 | 这是架构 / 配置候选，不是当前需求缺口。 | `01/04/07`。 |
| implementation ledger / planned boundary skeleton 尚未重建 | 这是 `07-实施计划.md` 的后置职责，不是需求风险本体。 | `07`。 |
| 告警、高级 dashboard、异常检测、外部 GRC 导出未纳入核心 | 缺失本身不是风险，误升级为核心才是风险。 | 外围增强或后续文档。 |

### 5.5 风险影响范围写法

| 风险类型 | 影响范围写法 |
|---|---|
| 仓定位 / truth ownership 串线 | Step 02、Step 07、Step 10、Step 11、Step 14 |
| forbidden body / body-free 边界失守 | Step 10、Step 11、Step 12、Step 13、Step 14 |
| 报告交接 / 真实性提示失守 | Step 08、Step 09、Step 10、Step 11、Step 14、后续 `05/06/07` |
| 留存 / rebuild / no-write 越权 | Step 07、Step 09、Step 10、Step 11、Step 14 |
| 依赖裁剪和外部产品误入核心 | Step 04、Step 06、Step 07、Step 12、Step 13、Step 14 |
| 文档分层失守 | Step 12、Step 15、后续 `01~07` |

### 5.6 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 风险候选诊断 | pass | 已识别 10 个需要正式保留的风险方向。 |
| 裁剪项诊断 | pass | 已剔除 API、字段、选型、测试和实施类 TODO。 |
| 风险清单写入 | pass | 已在 §6.2 写入正式风险表。 |
| 待确认事项写入 | blocked | 当前尚未进入待确认事项正式写入。 |
| 当前下一步 | `风险识别:再写入` |

## 6. 风险识别:再写入

### 6.1 写入原则

风险表只记录会打穿当前需求结构的风险，不记录“还没设计完”的自然空白。每条风险必须满足三个条件：有明确风险对象；有可回指的影响范围；有当前已经采用的约束 / 暂存口径。风险表不写修复计划、不写测试步骤、不写技术方案。

### 6.2 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| 旧 README、旧正式文档、旧 `06-验收标准.md` 或旧 implementation boundary 被后续文档直接恢复为当前需求基线 | Step 01 来源关系、Step 04 目标 / 非目标、Step 10 规则、Step 13 非功能、Step 14 验收、后续 `01~07` | 当前按 historical material 处理，只允许作为诊断线索；任何旧指标、旧对象名、旧 boundary 或旧 evidence 口径进入正式结论前必须重新通过对应 Step。 |
| 观察材料、审计投影、metric / log / trace、diagnostic summary 或 report handoff 被解释为 source business truth、Governance truth、Artifact truth、Identity truth、runtime execution truth 或 archive truth | Step 02 边界、Step 07 核心闭环、Step 10 规则、Step 11 数据归属、Step 14 验收 | 当前按“观察面只读、不拥有外部 truth”约束；若后续文档出现相反写法，直接回退到 Step 02 / 10 / 11 修正。 |
| raw body、secret、credential、payload body、full sensitive ref、raw log、raw prompt、provider response body 或 runtime body 在后续 schema / 协议 / 存储 / 输出设计中进入本仓 | Step 10 规则、Step 11 数据归属、Step 12 接口、Step 13 安全 NFR、Step 14 验收 | 当前按禁止保存正文和安全处置口径处理；后续任何 schema、DTO、事件、存储或报告格式都必须继续证明正文不入仓。 |
| evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文被后续 evidence linkage / report handoff 设计接管 | Step 04 目标 / 非目标、Step 07 核心闭环、Step 09 功能、Step 10 规则、Step 11 数据归属、Step 14 验收 | 当前按 body-free 证据关联处理，只允许引用、摘要、缺口和可见性语境；正文归相应 truth owner。 |
| report handoff、evidence index input 或设计阶段材料被后续文档静态填写真正 `run_id`、真实 evidence alias、passed evidence、final verdict 或 signoff | Step 08 故事、Step 09 功能、Step 10 规则、Step 11 数据、Step 14 验收、后续 `05/06/07` | 当前按真实性提示和不伪造证据处理；真实证据、验收结论和签署只能来自真实测试执行与验收阶段。 |
| retention、archive 准备、后台清理、replay 或 rebuild 被后续设计写成可删除活动引用材料、修复 source truth 或覆盖外部 truth 的能力 | Step 07 核心闭环、Step 09 功能、Step 10 规则、Step 11 数据、Step 14 验收 | 当前按活动引用保护、留存冲突显式和 no-write truth 处理；重放 / 重建只作用于观察面和派生投影。 |
| `L0-bus` 事件协作、tap / audit material 或 replay 主干在后续设计中被写成本仓编译期依赖、bus truth 所有权或事件总线主干规则 | Step 06 依赖、Step 10 全局边界、Step 12 接口依赖、Step 14 验收 | 当前按 `L0-core` 唯一编译期依赖、`L0-bus` 事件协作依赖处理；bus ack / retry / dead-letter / replay 主干不属于本仓。 |
| 外部观测产品、dashboard、alert、APM、GRC 导出、TimescaleDB、Grafana、Prometheus、OTel Collector 或对象存储被误升级为核心闭环、当前硬前置或 truth source | Step 04 目标 / 非目标、Step 07 核心能力、Step 09 外围增强、Step 12 依赖、Step 13 非功能、Step 14 验收 | 当前按外围增强或运行期配置候选处理，不得作为核心通过前置或正式 truth source。 |
| 旧 P95 / P99 / SLA、冷存期限、hash chain 分片、事件数量或审计覆盖率被后续测试 / 验收误升级为当前硬指标 | Step 03 问题量化、Step 04 目标、Step 13 非功能、Step 14 验收、后续 `05/06` | 当前按候选目标暂存，后续架构、测试和容量评估阶段验证后再决定是否升级。 |
| 后续 agent 因需求层未固定 API、DTO、状态机、字段、数据库、配置或测试步骤而自行补设计真相 | Step 12 接口依赖、Step 15 待确认、后续 `01~07` | 当前按文档分层约束处理：需求层只写能力、边界和验收口径；协议、状态、存储、配置、测试和实施必须在后续正式文档闭口。 |

### 6.3 当前可接受与后续阻塞判定

| 分类 | 条目 | 当前判断 |
|---|---|---|
| 当前可接受 | API / schema / 状态 / 存储 / 配置 / 测试证据 / 具体产品 / 性能数字未定 | 属于后续正式文档职责，不阻塞当前需求结构继续保持稳定。 |
| 当前可接受 | implementation ledger 和 planned boundary skeleton 尚未重建 | 这是 `07-实施计划.md` 的职责，不构成当前需求结构失败。 |
| 后续若发生则阻塞 | raw body / secret / forbidden body 入仓；证据正文入仓；观察面或报告交接冒充外部 truth | 命中 Step 10~14 的硬边界和一票否决来源，必须回退修正。 |
| 后续若发生则阻塞 | query / diagnostic / rebuild / report assembly 反写 source truth；活动引用材料被误清理；非 `L0-core` sibling 编译期依赖；外部产品成为 truth source；旧材料被直接恢复为新基线 | 命中 no-write truth、留存保护、依赖裁剪和 historical material 边界，必须回退修正。 |

### 6.4 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 风险清单 | pass | 已形成正式风险表。 |
| 当前可接受 / 后续阻塞判定 | pass | 已区分当前可接受与后续一旦发生即阻塞的事项。 |
| 待确认事项写入 | pass | 已在 §8.2 写入正式待确认事项表。 |
| 当前下一步 | `待确认事项:先思考` |

## 7. 待确认事项:先思考

### 7.1 待确认识别目标

待确认事项不是“所有还没决定的东西”。它只保留那些不会推翻 Step 01~14 结论、但后续 `01~07` 若不继续闭口就会迫使实现侧自行脑补的细化问题。对 `L4-observability` 来说，合格的待确认事项应集中在 schema、协议、配置、测试、验收和实施移交层，而不是重新讨论本仓是否拥有业务 truth、是否允许 forbidden body 入仓这种已经收口的问题。

### 7.2 待确认候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 后续设计待细化 | 会影响后续对象、协议、配置、测试或实施文档，但不推翻当前需求边界。 | 保留为待确认事项。 |
| 已收口不再挂起 | Step 02、07、10、11、14 已明确给出边界或否决口径。 | 不再进入待确认事项。 |
| 当前应裁剪 | 只是普通 TODO、实现安排、测试执行细节或产品选型偏好。 | 不进入待确认事项表。 |

### 7.3 保留待确认方向诊断

| 待确认方向 | 来源 | 保留理由 | 当前挂起口径 |
|---|---|---|---|
| log / metric / trace / audit event 的具体 schema、字段和安全标签 | Step 09~12 | 需求层已确定能力、规则和数据边界，但未固定对象级协议。 | 挂到 `02/03`。 |
| redaction、safety marker、quarantine / rejected / accepted 的具体策略 | Step 10、Step 13、Step 14 | 当前只要求禁止正文和显式安全处置，不选策略引擎或配置模型。 | 挂到 `04/05/06`。 |
| correlation id、trace context、source ref、actor / subject ref、evidence ref 的承载格式 | Step 06、Step 10~12 | 当前已收口“必须可关联”，但未决定具体承载协议。 | 挂到 `02/03`。 |
| body-free 证据关联是否需要 hash linkage、digest、canonicalization 或 gap 算法 | Step 07、Step 10、Step 11 | 当前只要求可追溯、可引用、缺口显式，不选具体算法。 | 挂到 `03/05/06`。 |
| report handoff、evidence index input、redaction report 和真实性提示的正式交接格式 | Step 09~11、Step 14 | 当前已收口“只读交接且不伪造真实证据”，但未固定载体与字段。 | 挂到 `03/05/06/07`。 |
| retention 期限、legal hold、archive eligibility、活动引用保护与归档交接细则 | Step 04、Step 10、Step 11、Step 14 | 当前已收口边界，但未固定时长、状态或协作协议。 | 挂到 `04/06/07`。 |
| 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC、alert sink 是否进入正式基线 | Step 06、Step 09、Step 12、Step 13 | 当前只允许作为外围增强或配置候选，后续需判断是否正式采用。 | 挂到 `01/04/07`。 |
| 观测材料准入、查询、交接、重放 / 重建窗口和留存冲突是否量化 | Step 13、Step 14 | 当前已有判断口径，但尚未形成有来源的量化目标。 | 挂到 `05/06`。 |
| `implementation_execution_ledger.md` 和 planned boundary skeleton 如何按新设计重建 | 项目台账；Step 14；实施计划约束 | 这是实现移交门禁，必须在 `07` 完成时闭口，不能继续沿用旧材料。 | 挂到 `07`。 |

### 7.4 已收口不再进入待确认的事项

| 项 | 不再挂起原因 |
|---|---|
| 本仓是否拥有业务 truth / 治理 truth / artifact truth / identity truth / runtime truth / archive truth | Step 02 已明确“不拥有外部 truth”。 |
| 是否允许 raw body、secret、provider response body、runtime body 入仓 | Step 10、Step 11、Step 14 已明确禁止并列入一票否决来源。 |
| body-free 证据关联是否可以退化为正文保存 | Step 10、Step 11、Step 14 已明确禁止。 |
| report handoff 是否可以生成 final verdict、真实证据或 signoff | Step 07、Step 09、Step 10、Step 14 已明确禁止。 |
| 是否允许 query / diagnostic / rebuild / report assembly 反写 source truth | Step 10、Step 14 已明确 no-write truth。 |
| 是否允许外部产品和 historical material 直接成为当前需求硬前置 | Step 01、Step 10、Step 13、Step 14 已明确裁剪。 |

### 7.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 待确认候选诊断 | pass | 已识别 9 个需要正式挂起的待确认方向。 |
| 已收口项诊断 | pass | 已排除不应重新挂起的硬边界。 |
| 待确认事项写入 | pass | 已在 §8.2 写入正式表格。 |
| 当前下一步 | `待确认事项:再写入` |

## 8. 待确认事项:再写入

### 8.1 写入原则

待确认事项表只保留“会影响后续文档如何闭口”的问题。第三列必须说明当前如何挂起，而不是简单写“未定”“后续确认”。表内不写技术方案、不写最终算法、不写运行环境操作，也不重新讨论已收口的边界。

### 8.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| log / metric / trace / audit event 的具体 schema、字段、状态枚举和安全标签如何定义 | Step 09、Step 10、Step 11、Step 12、后续 `02/03` | 当前暂按能力级观察面、规则和数据归属处理，不在需求层固定字段或 DTO。 |
| redaction、safety marker、quarantine / rejected / accepted 判定的具体策略和配置项如何定义 | Step 10、Step 11、Step 13、Step 14、后续 `04/05/06` | 当前暂按禁止正文和安全处置口径挂起，具体策略后移配置、测试和验收文档。 |
| correlation id、trace context、source ref、actor / subject ref 和 evidence ref 的承载格式如何统一 | Step 06、Step 10、Step 11、Step 12、后续 `02/03` | 当前暂按 `L0-core` 共享契约和 typed ref 语境处理，不在需求层固定协议形态。 |
| 审计投影与 body-free 证据关联是否需要 hash linkage、digest、canonicalization 或 chain gap 的具体算法 | Step 07、Step 10、Step 11、Step 13、后续 `03/05/06` | 当前暂按可追溯、缺口显式和 body-free 关联处理，不在需求层选择算法。 |
| report handoff、evidence index input、redaction report 和真实性提示的正式交接格式如何定义 | Step 09、Step 10、Step 11、Step 14、后续 `03/05/06/07` | 当前暂按只读交接、缺口说明和不伪造真实证据处理，格式后移。 |
| 留存期限、legal hold、archive eligibility、活动引用保护和归档交接的详细规则如何定义 | Step 04、Step 10、Step 11、Step 13、Step 14、后续 `04/06/07` | 当前暂按留存标记、活动引用保护和冲突显式处理，不在需求层定死天数或归档策略。 |
| 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC、alert sink 或 anomaly analysis 是否进入正式架构 / 配置基线 | Step 06、Step 09、Step 12、Step 13、后续 `01/04/07` | 当前暂按外围增强和运行期配置候选处理，不纳入当前核心需求前置。 |
| 观测材料准入、查询、报告交接、事件协作滞后、重放 / 重建窗口和留存冲突处理是否需要量化目标 | Step 13、Step 14、后续 `05/06` | 当前只保留判断口径和候选量化方向，不强行定为需求层硬指标。 |
| `implementation_execution_ledger.md` 和全部 planned boundary skeleton 应如何在重新完成 `07-实施计划.md` 时重建 | 项目台账、Step 14 验收、后续 `07` | 当前旧 implementation ledger / boundaries 仍为 historical material；只允许在正式完成 `07` 时按新设计重建。 |

### 8.3 当前不阻塞项与后续阻塞项

| 类型 | 条目 |
|---|---|
| 当前不阻塞当前重建链路 | API / Command / Query / Event 名称未定；schema / 字段 / 状态枚举未定；redaction 具体策略未定；hash / digest / canonicalization 算法未定；留存天数未定；外部产品选型未定；候选性能目标未定；implementation boundary skeleton 未重建 |
| 后续一旦发生即阻塞 | raw body / secret / forbidden body 入仓；证据正文入仓；观察面或报告交接冒充外部 truth；query / diagnostic / rebuild / report assembly 反写 source truth；设计阶段伪造真实证据或签署；活动引用材料被误清理；非 `L0-core` sibling 编译期依赖；外部产品成为 truth source；旧材料被直接恢复为新基线 |

### 8.4 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 待确认事项表 | pass | 已形成正式待确认事项表。 |
| 当前不阻塞 / 后续阻塞表 | pass | 已明确哪些暂不阻塞、哪些一旦发生即必须回退。 |
| 当前文档问题诊断 | pass | 已在 §9 诊断旧材料、旧路线和分层残留风险。 |
| 当前下一步 | `当前文档问题诊断` |

## 9. 当前文档问题诊断

### 9.1 历史材料与旧路线诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 README 与旧正式 `00~07` | 含 TimescaleDB、Grafana、Prometheus、OTel Collector、P95 / P99、冷存期限、hash chain 分片、目录结构和旧 evidence 口径 | 这些材料可提示旧意图,但不能压过本轮 Step 01~14 的边界与粒度 | 继续降级为 historical material,只作为风险线索和对比输入。 |
| 旧 `06-验收标准.md` 与旧 implementation ledger / boundaries | 含 TC / EV、证据路径、run_id 语义、implementation boundary 和验收管理动作 | 容易让 Step 15 误写真实测试证据、真实签署或实现交接结果 | 只保留“不伪造真实 evidence / signoff”和“07 必须重建 planned boundary skeleton”的约束。 |
| 旧 Step 15 中间产物 | 已有风险和待确认主体,但停审方向残留到 Step 04 / Step 09 | 与当前补强路线冲突,会导致 Step 15 完成后错误回退到已补强 Step | 本次改为 Step 16 停审,并同步 flow 与项目台账。 |
| 当前正式 `00-需求文档.md` | 工作树中存在旧正式文档改动 | 按用户规则,正式 `00` 只能在 Step 17 装配,当前不能沿用其内容 | 继续视为 historical material,不在本 Step 写入或修正正式正文。 |

### 9.2 粒度问题诊断

| 诊断项 | 发现 | 当前处理 |
|---|---|---|
| 风险粒度 | 风险主体已覆盖 historical material 回灌、truth 串线、forbidden body 入仓、body-free 退化、真实性提示失守、留存 / no-write 越权、依赖裁剪、外部产品误入核心、旧指标伪量化和文档分层失守 | 保留 10 条风险,不压缩成摘要。 |
| 待确认粒度 | 待确认事项集中在 schema、redaction、correlation、evidence linkage、report handoff、retention、外部产品、量化窗口和 `07` implementation 移交 | 保留 9 条待确认事项,每条说明当前如何挂起。 |
| 已收口边界 | 本仓不拥有外部 truth、禁止 forbidden body 入仓、report handoff 不生成 final verdict、`L0-bus` 不作为编译期依赖等已在前序 Step 收口 | 不再写成待确认事项,只作为风险约束和自检项。 |
| 实现层空白 | API、DTO、状态机、存储、配置、测试步骤和产品选型尚未固定 | 不作为当前阻塞,后移 `01~07` 对应文档。 |

### 9.3 上游 blocker 诊断

| 上游 | 当前判断 | 说明 |
|---|---|---|
| `L0-bus` | no_blocker | 当前只依赖事件协作边界和不得接管 bus truth / 主干规则的约束。 |
| `L1-governance` | no_blocker | 当前只依赖 Governance truth 不归本仓、report handoff 不生成治理结论的边界。 |
| `L1-artifact` | no_blocker | 当前只依赖 artifact / evidence body ownership 和 body-free linkage 边界。 |
| `L1-identity` | no_blocker | 当前只依赖 actor / subject safe ref 与身份正文不入仓边界。 |

### 9.4 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 历史材料诊断 | pass | 已明确旧正式文档、README、旧验收和旧 implementation 材料不能恢复为当前 truth。 |
| 粒度诊断 | pass | 已确认风险和待确认事项达到可供后续设计审查的粒度。 |
| 上游 blocker 诊断 | pass | 未发现阻塞 Step 15 补强完成的上游 blocker。 |
| 改动前后对比 | pass | 已在 §10 写入。 |
| 当前下一步 | `改动前后对比` |

## 10. 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 停审方向 | 文件内部残留 `Step 04` / `Step 09` 等旧路线 | 统一为等待用户确认后进入 `Step 16 需求追溯矩阵（补强）` | 当前 Step 01~15 已逐步补强,下一步只能是 Step 16。 |
| 结构证明 | 已有双表和回填草稿,但缺少当前文档问题诊断、改动对比和设计取舍 | 补入 §9~§11,说明为何保留 / 裁剪风险和待确认事项 | 对齐 `L1-governance`、`L1-artifact` 的过程粒度。 |
| 风险表 | 10 条主体可用,但需要明确不是实现 TODO | 保留 10 条,并在前后文强调只记录会打穿需求结构的风险 | 防止 Step 15 退化为实现任务清单。 |
| 待确认事项表 | 9 条主体可用,但需要强调“挂起”而非“未定” | 保留 9 条,每条以当前暂按何种需求口径处理来挂起 | 对齐 4.15 第三列写法。 |
| 已收口边界 | 部分边界容易被误读为仍待确认 | 单列已收口事项,并在诊断中说明不得重开 | 避免把 hard boundary 重新打开。 |
| implementation 移交 | 旧 implementation ledger / boundary 容易被误沿用 | 明确旧材料为 historical material,只允许 `07` 按新设计重建 | 满足用户关于 `07` 同步创建 implementation ledger 和 planned boundary skeleton 的后续门禁。 |

## 11. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把 Step 01~14 的所有未定项全部列入风险 | 看似完整 | 会把 API、字段、配置、测试和产品选型空白误判为需求风险 | 不采用。 |
| 只保留会打穿仓定位、truth ownership、forbidden body、body-free、真实性、留存、依赖裁剪或文档分层的事项为风险 | 风险高信号,可直接支撑后续审查 | 需要明确普通设计空白如何挂起 | 采用。 |
| 把已收口边界重新写成待确认事项 | 可以暴露重要边界 | 会让“不拥有外部 truth”“禁止正文入仓”等硬结论重新变成未定 | 不采用。 |
| 把 schema、redaction、correlation、evidence linkage、report handoff、retention 和外部产品选型提前定死 | 可减少后续不确定性 | 违反需求层职责,会提前进入 `01~07` 设计 / 配置 / 测试 / 实施层 | 不采用。 |
| 将待确认事项按后续文档挂起,当前不阻塞 Step 16 | 保持需求层稳定,同时避免后续 agent 脑补 | 需要在 Step 16 追溯矩阵和后续文档继续承接 | 采用。 |
| 立即写正式 `00-需求文档.md` 第 15 章 | 可见结果更快 | 违反 Step 17 统一装配门禁 | 不采用。 |

### 11.1 取舍结论

Step 15 采用“风险窄口径 + 待确认事项显式挂起”的写法。当前没有发现需要回退 Step 01~14 的 blocker;也没有理由把具体 API、DTO、schema、状态机、存储、配置、测试步骤、外部产品和 implementation boundary 直接写入需求层。下一步只能在用户确认后进入 Step 16,用追溯矩阵检查 Step 07~15 是否闭合。

### 11.2 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 改动前后对比 | pass | 已明确补强前后结构和门禁变化。 |
| 设计取舍 | pass | 已明确风险、待确认事项、已收口边界和正式文档装配的取舍。 |
| 结构化中间产物 | pass | 已在 §12 整理。 |
| 当前下一步 | `结构化中间产物` |

## 12. 结构化中间产物

### 9.1 风险结论

`L4-observability` 当前真正需要持续约束的风险，不是“某个产品还没选”或“某个字段还没定”，而是九类边界失守和一类文档分层失守：historical material 回灌、观察面冒充外部 truth、forbidden body 入仓、body-free 退化、真实性提示失守、留存 / no-write 越权、bus / 依赖裁剪失守、外部产品误入核心、旧候选指标伪量化，以及需求层留白被后续 agent 脑补成设计真相。

### 9.2 待确认事项结论

当前待确认事项集中在后续 `01~07` 的对象、协议、配置、测试与实施移交层，不推翻 Step 01~14 已形成的边界、闭环、规则、数据归属和验收口径。它们需要被继续挂起，而不是在需求层提前拍板。

### 9.3 正式回填最小单元

| 正式第 15 章组件 | 来源 |
|---|---|
| 风险清单 | 本文件 §6.2 |
| 待确认事项 | 本文件 §8.2 |
| 当前不阻塞项与后续阻塞项 | 本文件 §8.3 |
| 引导性短说明 | 本文件 §13 回填草稿 |

## 13. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §15。正式文档不重复写 §3~§12 的思考过程，只摘录结论。

```md
## 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/00_req_step_15_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险清单”“待确认事项”和“当前不阻塞项与后续阻塞项”小节,了解本章如何显式约束仍需挂起的不确定性。

本文采用 `design-calibration/00_req_step_15_risks_open_questions.md` 的风险与待确认事项结论。当前没有要求回退 Step 01~14 的阻塞项;API、对象 schema、状态机、事件 schema、证据关联算法、留存细则、外部产品选型、候选性能目标和 implementation boundary skeleton 均后移对应后续文档。若后续出现 forbidden body 入仓、证据正文入仓、观察面或报告交接冒充外部 truth、query / diagnostic / rebuild / report assembly 反写 source truth、设计阶段伪造真实证据或签署、活动引用材料被误清理、非 `L0-core` sibling 编译期依赖、外部产品成为 truth source 或旧材料被直接恢复为新基线,则必须回退修正。

### 15.1 风险清单

采用 `design-calibration/00_req_step_15_risks_open_questions.md` §6.2。

### 15.2 待确认事项

采用 `design-calibration/00_req_step_15_risks_open_questions.md` §8.2。

### 15.3 当前不阻塞项与后续阻塞项

采用 `design-calibration/00_req_step_15_risks_open_questions.md` §8.3。
```

## 14. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否拆分风险清单与待确认事项表 | pass |
| 是否每条风险都有影响范围和当前处理口径 | pass |
| 是否每条待确认事项都有影响章节和当前状态 | pass |
| 是否区分了当前可接受项、当前不阻塞项和后续一旦发生即阻塞项 | pass |
| 是否只保留会影响边界、依赖、数据、非功能或验收结构的风险 / 待确认事项 | pass |
| 是否未把普通 TODO、未来优化项、实现任务或测试任务写成风险 | pass |
| 是否未在本 Step 补写功能、目标、规则、接口、数据、非功能或验收项 | pass |
| 是否未写 API、DTO、schema、状态机、存储、配置、测试步骤、CI 或实施方案 | pass |
| 是否未伪造真实 `run_id`、evidence alias、final verdict、signoff 或真实验收结论 | pass |
| 是否已补当前文档问题诊断、改动前后对比和设计取舍 | pass |
| 是否已将下一允许动作修正为 Step 16 补强并停审 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入下一补强 step 的上游 blocker | no |

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 15 审查后补强,风险、待确认事项、当前不阻塞项和后续阻塞项均已收束,且未把设计层 / 实施层细节误写入需求层 | wait_user_or_start_step_16_strengthening_after_confirmation |
