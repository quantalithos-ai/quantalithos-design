# L3-method-library 00 需求 Step 15: 风险与待确认事项

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 15 章“风险与待确认事项”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 风险与待确认事项 |
| 输出文件 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md`;`需求文档书写规范.md` §4.15 |
| 已读取前序输入 | yes:`00_req_step_07_core_capability_loop.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_14_acceptance_criteria.md` |
| 已读取项目输入 | yes:旧 `00_req_step_15_risks_open_questions.md`;`projects/L3-method-library/00-需求文档.md`;`domain/method-library/README.md` |
| 当前模式 | full-restart |
| 进入条件 | pass |
| next_allowed_action | Step 15 已完成,允许文档级 flow 进入 Step 16。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | 风险清单 / 待确认事项 / 当前口径骨架 | pass | 进入前序未闭口归并思考。 |
| 前序未闭口归并:先思考 | done | 未闭口问题分组 | pass | 进入前序未闭口归并写入。 |
| 前序未闭口归并:再写入 | done | 待确认事项候选 | pass | 进入风险识别思考。 |
| 风险识别:先思考 | done | 风险候选与影响范围 | pass | 进入风险清单写入。 |
| 风险清单:再写入 | done | 风险清单 | pass | 进入待确认事项写入。 |
| 待确认事项:再写入 | done | 待确认事项表 | pass | 进入当前口径汇总。 |
| 当前口径汇总 | done | 约束 / 暂存 / 挂起口径 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留方向 / 废弃项 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 15 章草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 进入 Step 16 条件 | pass | 允许进入 Step 16。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 15 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 15 | 风险和待确认事项必须拆成两张表,不能为了填满文档脑补确定结论。 | 本 Step 只收纳不确定性,不补写前文遗漏。 |
| `需求文档书写规范.md` §4.15 | 风险第三列写当前如何约束 / 暂存;待确认事项第三列写当前如何挂起。 | 不写最终解决方案、实施方案、TODO 或空泛“未定”。 |
| `00_req_step_07_core_capability_loop.md` | 核心闭环为统一定义识别、稳定版本正式化、下游边界消费、变化追溯和一致性保护。 | 风险必须说明是否影响核心闭环或外围增强。 |
| `00_req_step_09_functional_requirements.md` | 当前核心功能为 FR-ML-001~009,外围增强为 FR-ML-E-001~004。 | 不沿用旧 FR-ML-001~007 口径。 |
| `00_req_step_10_business_rules_boundaries.md` | 当前规则为 BR-ML-001~022 和 BR-ML-E-001。 | 风险和待确认事项必须尊重规则边界,不能重开已收口规则。 |
| `00_req_step_11_data_ownership.md` | 已区分真相数据、快照数据、引用数据和禁止保存正文。 | 资产范围和数据归属不确定性必须显式挂起。 |
| `00_req_step_12_interfaces_dependencies.md` | 接口与依赖只停留在能力边界,不写协议 schema、port 或 adapter。 | 风险不得以接口或事件方案形式解决。 |
| `00_req_step_13_non_functional_requirements.md` | 当前只保留判断口径,不继承旧 P95、指标名和监控实现。 | 性能 / 可观测不确定性只能挂到后续 05/06。 |
| `00_req_step_14_acceptance_criteria.md` | 验收覆盖能力、功能、规则、数据、接口、NFR 和一票否决项。 | 未闭口项不能伪装成已验收结论。 |

---

## 3. 整体模块骨架

| 模块 | 输出 | 不输出 |
|---|---|---|
| 风险清单 | 具体风险、影响范围、当前处理口径。 | 不写概率评分、缓解任务、接口方案或技术方案。 |
| 待确认事项 | 会影响前文结构成立的未闭口问题、影响章节、当前状态。 | 不写普通 TODO、未来优化或已被前文收口的问题。 |
| 当前口径汇总 | 当前按边界排除、外围增强、条件型依赖或后续文档暂存的口径。 | 不承诺最终设计选择。 |
| 旧材料审计 | 哪些旧风险方向可保留,哪些旧实现口径必须废弃。 | 不继承旧对象模型、事件、fingerprint、outbox、P95 或测试脚本。 |

---

## 4. 模块思考记录

### 4.1 前序未闭口归并

问题回答:

- Step 7~14 中真正未闭口的是资产范围、外围增强是否进主线、治理正式化依赖强度、相邻仓消费边界、下游消费影响回报、具体非功能数值和验收执行方式。
- 已明确收口的内容包括核心闭环、FR-ML-001~009、BR-ML-001~022、数据四分法、能力级接口边界、NFR-ML-001~016 和一票否决项。
- Qualification / CapabilityDefinition 是当前最强的资产范围待确认项,因为它一旦纳入核心,会回写功能、数据和验收结构。

诊断:

- 旧 Step 15 保留旧 FR 和 BR 编号,不能作为本轮结论继承。
- 如果在本 Step 直接关闭 Qualification、MethodPlugin、governance 强依赖或 P95 数值,会绕过前文小循环和后续文档职责。

取舍:

- 把未闭口问题归并成少数会影响结构的待确认事项。
- 已经被 Step 10/11/14 一票否决覆盖的边界不重复作为“待确认”,只作为风险控制口径引用。

### 4.2 风险识别

问题回答:

- 当前风险集中在旧材料反向污染、外围增强膨胀、相邻仓正文进入本仓、治理依赖强制化和后续设计提前具体化。
- 风险必须写成“如果失守会破坏什么”,而不是写“后续要补什么”。

诊断:

- 旧材料中很多风险方向有价值,但写法偏实施层,例如 fingerprint、snapshot、event、outbox、缓存、PG、测试脚本。
- 后续 01~07 文档容易为了可落码而恢复这些旧机制,所以 Step 15 需要显式禁止在需求层直接继承。

取舍:

- 风险表只保留需求结构风险和边界风险。
- 技术缓解、测试门禁、事务和接口方案留给后续文档重新讨论。

### 4.3 当前处理口径和挂起口径

问题回答:

- 当前处理口径回答“现在如何约束风险”:按边界排除、按外围增强处理、按条件型依赖处理、按后续文档暂存。
- 当前状态回答“未确认前如何挂起”:暂不纳入主链、暂不作为核心闭环前置、暂不继承旧数值、后续若纳入必须回写相关 Step。

诊断:

- “未定”“后续确认”无法保护前文结论。
- “通过某接口 / 某事件解决”会把 Step 15 写成设计方案。

取舍:

- 每条风险和待确认事项都给出当前边界。
- 不在本 Step 给任何最终解决方案。

---

## 5. 结构化中间产物

### 5.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| Qualification / CapabilityDefinition 若被后续直接恢复为核心资产,会破坏当前 FR、BR、数据归属和验收闭环。 | Step 7、Step 9、Step 10、Step 11、Step 12、Step 14、Step 16 | 当前不作为核心方法资产独立项;只保留为待确认事项。若后续纳入,必须回写相关 Step,不得局部插入正式文档。 |
| MethodPlugin、MethodConfiguration、marketplace 生态分发若反向成为核心前置,会使核心闭环被外围增强拖垮。 | Step 4、Step 6、Step 7、Step 8、Step 9、Step 11、Step 12、Step 14 | 当前按外围增强处理,不阻塞核心闭环验收;交易、履约、安装记录和生态商业流程保持边界外。 |
| AIPolicy override、高级 ViewProfile 匹配和组织级策略变体若过早进入主链,会把定义真相与组织级运行配置、UI 匹配实现混写。 | Step 2、Step 7、Step 9、Step 10、Step 11、Step 12、Step 13 | 当前只把 AIPolicy / ViewProfile 的定义主题纳入核心;复杂变体、override 和高级匹配按外围增强暂存。 |
| governance 正式化依赖若被写成强制运行前置,会让方法资产定义真相依赖治理执行可用性。 | Step 5、Step 6、Step 10、Step 11、Step 12、Step 13、Step 14 | 当前按条件型治理结论依赖和引用 / 摘要边界处理;不把治理执行、Gate 流程或 policy enforce 结果迁入本仓。 |
| WorkProductDefinition 与 artifact 消费边界若未持续收紧,本仓可能保存 artifact 正文、证据文件或成为 artifact 生命周期仓。 | Step 6、Step 7、Step 9、Step 10、Step 11、Step 12、Step 14 | 当前只承认 WorkProductDefinition 作为方法资产定义主题;artifact 正文、证据文件和 archive 正文禁止进入本仓。 |
| 下游消费影响回报若被实现化为强制同步机制,会把需求层的一致性保护变成未授权事件、快照或 repository 方案。 | Step 9、Step 10、Step 11、Step 12、Step 13、Step 14 | 当前仅作为一致性保护所需能力与快照候选保留,不定义具体回报机制、event schema、存储结构或调度策略。 |
| 旧材料中的接口名、事件名、fingerprint、snapshot、outbox、P95、缓存和存储假设若被直接继承,会把需求文档变成详细设计或测试计划。 | Step 9、Step 11、Step 12、Step 13、Step 14、Step 17 | 当前全部作为旧材料差异审计输入,不得进入正式需求正文;后续设计必须重新论证。 |
| `L0-sdk`、`L5-console`、`L6-marketplace` 等体验或生态面若被当作 P0 管理前置,会扩大当前需求范围并削弱定义真相主线。 | Step 5、Step 6、Step 8、Step 9、Step 12、Step 14 | 当前作为外围消费面或候选协作面,不阻塞核心方法资产定义、正式化、消费和追溯闭环。 |
| 具体性能数值、指标名、自动化检查方式和验收执行路径若提前写死,会让需求层绑定旧技术栈和测试策略。 | Step 13、Step 14、后续 05 / 06 | 当前只保留判断口径;自动化、人工评审、架构检查、指标名和数值留给后续测试与验收文档。 |

### 5.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| Qualification / CapabilityDefinition 是否作为独立核心方法资产进入本轮范围。 | Step 7、Step 9、Step 10、Step 11、Step 12、Step 14、Step 16 | 当前保持待确认,不纳入核心功能、核心真相数据和专项验收;若纳入必须回写相关 Step。 |
| MethodPlugin / MethodConfiguration 是否进入当前 P0 主线,还是继续作为外围增强。 | Step 4、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 14 | 当前暂按外围增强处理,不作为核心闭环成立前置。 |
| marketplace 发现、分发、上架和交易相关语境是否进入当前阶段。 | Step 2、Step 3、Step 6、Step 8、Step 9、Step 12、Step 14 | 当前只保留方法资产分发语义和外围生态发现;交易、履约、安装记录保持边界外。 |
| AIPolicy 的组织级 / 项目级 override 是否进入当前定义目标。 | Step 2、Step 4、Step 7、Step 9、Step 10、Step 11、Step 12、Step 13 | 当前只把 AIPolicy 定义主题纳入核心,override 与复杂变体按外围增强挂起。 |
| ViewProfile 是仅作为定义主题进入核心,还是高级匹配策略也进入当前主线。 | Step 2、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 13 | 当前只把 ViewProfile 定义主题纳入核心,高级匹配和体验优化按外围增强挂起。 |
| 方法资产正式化是否必须消费 `L1-governance` 正式结论,或仅在特定高风险资产上需要。 | Step 5、Step 6、Step 10、Step 11、Step 12、Step 13、Step 14 | 当前按条件型治理结论依赖处理,不写成强制主链。 |
| 治理正式化结论在本仓应保存摘要还是仅保存引用。 | Step 10、Step 11、Step 12、Step 14 | 当前同时保留摘要与引用两类需求口径,后续设计需收束,但不得迁入治理执行正文。 |
| `L1-artifact` 是否进入核心下游消费面。 | Step 6、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 14 | 当前作为外围 / 候选消费关系挂起;artifact 正文和生命周期不进入本仓。 |
| `L0-sdk` / `L5-console` 是否作为当前管理体验 P0 前置。 | Step 5、Step 6、Step 8、Step 9、Step 12、Step 14 | 当前作为外围消费面挂起,不阻塞核心闭环。 |
| 29110 Deployment Package 是否只是分发语义目标,还是需要当前阶段 package/export 能力。 | Step 4、Step 7、Step 9、Step 12、Step 14 | 当前只保留分发语义目标,不展开 package/export 实现能力。 |
| 下游消费影响回报摘要是否进入 P0 一致性保护。 | Step 9、Step 10、Step 11、Step 12、Step 14 | 当前作为一致性保护的快照候选挂起,不定义具体回报机制。 |
| 是否需要正式能力级权限矩阵。 | Step 5、Step 9、Step 10、Step 14 | 当前不写权限矩阵,只保留角色语境和边界规则。 |
| 可观测性是否需要正式指标集。 | Step 13、Step 14、后续 05 / 06 | 当前只要求关键状态、变化和异常可观察,不写指标名或监控配置。 |
| 具体 P95 / SLO 数值是否进入正式验收。 | Step 13、Step 14、后续 05 / 06 | 当前只保留判断口径,不继承旧数值。 |
| Step 14 验收是否在后续 `06-验收标准.md` 中拆分成自动化、人工评审和架构检查。 | Step 14、后续 05 / 06 | 当前需求层只写通过条件,不写检查方式。 |

### 5.3 当前处理口径汇总

| 类别 | 当前口径 |
|---|---|
| 核心方法资产定义 | 以 Step 11 已列 SPEM 方法内容、过程模板与生命周期模型、ViewProfile 定义主题、AIPolicy 定义主题、身份目录、正式化版本、追溯和分发语义为准。 |
| 未闭口资产范围 | Qualification / CapabilityDefinition 不作为核心独立项;若纳入需回写前序 Step。 |
| 外围增强 | MethodPlugin、MethodConfiguration、marketplace 生态发现、高级 ViewProfile 匹配、AIPolicy override、标准映射材料继续作为外围增强或候选能力。 |
| 条件型依赖 | governance 正式化结论、artifact 消费、console / SDK 管理体验均不作为核心闭环强制前置。 |
| 禁止继承项 | 旧 API、event、fingerprint、snapshot、outbox、P95、缓存、测试脚本、数据库和对象存储方案不进入正式需求正文。 |

---

## 6. 旧材料差异审计

### 6.1 可保留为风险方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| Qualification / Profile / Binding 边界容易混淆 | 收敛为 Qualification / CapabilityDefinition 待确认和成员能力画像 / 绑定正文禁止入仓风险。 |
| 下游反向改写定义会破坏本仓真相 | 收敛为 Step 10 规则、Step 14 一票否决项和本 Step 风险清单。 |
| AIPolicy 与 governance Policy DSL 可能分叉 | 收敛为 AIPolicy 定义主题与 governance 执行边界的风险和待确认事项。 |
| ViewProfile 匹配规则过早复杂化 | 收敛为 ViewProfile 定义主题与高级匹配外围增强的风险。 |
| MethodPlugin / MethodConfiguration 可能反向污染核心主线 | 收敛为外围增强不得阻塞核心闭环的风险和待确认事项。 |
| ProcessTemplate 与 process runtime 映射存在风险 | 收敛为下游按边界消费和 Definition vs Use 规则,不写实现映射。 |

### 6.2 不能继承的旧口径

| 旧口径 | 为什么不能在 Step 15 继承 | 后续处理 |
|---|---|---|
| 风险概率、影响评分和缓解任务 | 当前规范只要求风险、影响范围和当前处理口径。 | 实施计划或风险管理材料。 |
| outbox、backlog、fingerprint、snapshot schema 作为风险缓解 | 属于设计和实现方案。 | 03 / 05 后续设计与测试。 |
| schema version、event version、历史 snapshot 导出等技术方案 | Step 15 不做设计方案选择。 | 03 / 05 后续设计与测试。 |
| 旧 P0 Qualification 专项链路 | 当前未把 Qualification 作为核心独立资产闭口。 | 保留待确认;若纳入需回写 Step 9~14。 |
| 自动化检查本仓不存在某接口或表 | 属于测试 / 架构检查方式。 | 05 测试方案 / 06 验收标准。 |
| 旧 P95、QPS、缓存命中率 | 当前需求层未授权具体数值和技术栈。 | 后续非功能细化或测试计划。 |

---

## 7. 回填草稿

### 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/00_req_step_15_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_15_risks_open_questions.md` 的“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解风险和待确认事项如何从 Step 7~14 的未闭口项收敛。

#### 15.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| Qualification / CapabilityDefinition 若被后续直接恢复为核心资产,会破坏当前 FR、BR、数据归属和验收闭环。 | 核心能力、功能、规则、数据、接口、验收、追溯矩阵。 | 当前不作为核心方法资产独立项;只保留为待确认事项。若后续纳入,必须回写相关 Step。 |
| MethodPlugin、MethodConfiguration、marketplace 生态分发若反向成为核心前置,会使核心闭环被外围增强拖垮。 | 目标、依赖、核心能力、功能、数据、接口和验收。 | 当前按外围增强处理,不阻塞核心闭环验收;交易、履约和安装记录保持边界外。 |
| AIPolicy override、高级 ViewProfile 匹配和组织级策略变体若过早进入主链,会把定义真相与组织级运行配置、UI 匹配实现混写。 | 边界、核心能力、功能、规则、数据、接口和非功能。 | 当前只把 AIPolicy / ViewProfile 的定义主题纳入核心;复杂变体、override 和高级匹配按外围增强处理。 |
| governance 正式化依赖若被写成强制运行前置,会让方法资产定义真相依赖治理执行可用性。 | 角色、依赖、规则、数据、接口、非功能和验收。 | 当前按条件型治理结论依赖和引用 / 摘要边界处理;不把治理执行、Gate 流程或 policy enforce 结果迁入本仓。 |
| WorkProductDefinition 与 artifact 消费边界若未持续收紧,本仓可能保存 artifact 正文、证据文件或成为 artifact 生命周期仓。 | 依赖、核心能力、功能、规则、数据、接口和验收。 | 当前只承认 WorkProductDefinition 作为方法资产定义主题;artifact 正文、证据文件和 archive 正文禁止进入本仓。 |
| 下游消费影响回报若被实现化为强制同步机制,会把需求层的一致性保护变成未授权事件、快照或 repository 方案。 | 功能、规则、数据、接口、非功能和验收。 | 当前仅作为一致性保护所需能力与快照候选保留,不定义具体回报机制、event schema 或存储结构。 |
| 旧材料中的接口名、事件名、fingerprint、snapshot、outbox、P95、缓存和存储假设若被直接继承,会把需求文档变成详细设计或测试计划。 | 功能、数据、接口、非功能、验收和正式文档装配。 | 当前全部作为旧材料差异审计输入,不得进入正式需求正文;后续设计必须重新论证。 |

#### 15.2 待确认事项

| 待确认事项 | 影响章节 | 当前状态 |
|---|---|---|
| Qualification / CapabilityDefinition 是否作为独立核心方法资产进入本轮范围。 | 7、9、10、11、12、14、16 | 当前保持待确认,不纳入核心功能、核心真相数据和专项验收;若纳入必须回写相关 Step。 |
| MethodPlugin / MethodConfiguration 是否进入当前 P0 主线,还是继续作为外围增强。 | 4、7、8、9、10、11、12、14 | 当前暂按外围增强处理,不作为核心闭环成立前置。 |
| marketplace 发现、分发、上架和交易相关语境是否进入当前阶段。 | 2、3、6、8、9、12、14 | 当前只保留方法资产分发语义和外围生态发现;交易、履约、安装记录保持边界外。 |
| AIPolicy 的组织级 / 项目级 override 是否进入当前定义目标。 | 2、4、7、9、10、11、12、13 | 当前只把 AIPolicy 定义主题纳入核心,override 与复杂变体按外围增强挂起。 |
| ViewProfile 是仅作为定义主题进入核心,还是高级匹配策略也进入当前主线。 | 2、7、8、9、10、11、12、13 | 当前只把 ViewProfile 定义主题纳入核心,高级匹配和体验优化按外围增强挂起。 |
| 方法资产正式化是否必须消费 `L1-governance` 正式结论,或仅在特定高风险资产上需要。 | 5、6、10、11、12、13、14 | 当前按条件型治理结论依赖处理,不写成强制主链。 |
| 治理正式化结论在本仓应保存摘要还是仅保存引用。 | 10、11、12、14 | 当前同时保留摘要与引用两类需求口径,后续设计需收束,但不得迁入治理执行正文。 |
| `L1-artifact` 是否进入核心下游消费面。 | 6、7、8、9、10、11、12、14 | 当前作为外围 / 候选消费关系挂起;artifact 正文和生命周期不进入本仓。 |
| `L0-sdk` / `L5-console` 是否作为当前管理体验 P0 前置。 | 5、6、8、9、12、14 | 当前作为外围消费面挂起,不阻塞核心闭环。 |
| 29110 Deployment Package 是否只是分发语义目标,还是需要当前阶段 package/export 能力。 | 4、7、9、12、14 | 当前只保留分发语义目标,不展开 package/export 实现能力。 |
| 下游消费影响回报摘要是否进入 P0 一致性保护。 | 9、10、11、12、14 | 当前作为一致性保护的快照候选挂起,不定义具体回报机制。 |
| 是否需要正式能力级权限矩阵。 | 5、9、10、14 | 当前不写权限矩阵,只保留角色语境和边界规则。 |
| 可观测性指标、具体 P95 / SLO 数值和验收执行方式是否在后续正式文档中细化。 | 13、14、后续 05 / 06 | 当前只保留判断口径,不继承旧数值、指标名或检查方式。 |

---

## 8. 自检与停审

### 8.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否拆分风险与待确认事项 | 通过 | 已分别形成风险清单和待确认事项表。 |
| 每条风险是否有影响范围和当前处理口径 | 通过 | 风险表第三列均写当前如何约束、暂存或归类。 |
| 每条待确认事项是否有影响章节和当前状态 | 通过 | 待确认事项表第三列均写当前如何挂起。 |
| 是否把 TODO 或未来优化写成风险 | 未发现 | 本 Step 只收纳影响前文结构成立的风险与待确认事项。 |
| 是否写入实施方案或技术方案 | 未发现 | 未写 repository、port、handler、事件 schema、outbox、DDL、测试脚本或监控配置。 |
| 是否脑补关闭未确认问题 | 未发现 | Qualification、外围增强、治理依赖、artifact、SDK/console、性能数值等均保持挂起口径。 |
| 是否可进入 Step 16 | 通过 | 风险与待确认事项已收敛,可进入需求追溯矩阵。 |

### 8.2 进入下一步条件

Step 15 已满足进入 Step 16 的条件:

- 已明确拆分风险与待确认事项。
- 风险表说明了当前如何约束、暂存或归类风险。
- 待确认事项表说明了当前如何挂起未闭口问题。
- 未把普通 TODO、未来优化项或实施方案写进本章。
- 未为了填满文档而脑补确定性结论。

下一步 Step 16 将只处理需求追溯矩阵,不重新打开本 Step 已挂起的问题。
