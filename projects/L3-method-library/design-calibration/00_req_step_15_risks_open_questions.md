# L3-method-library 00 需求 Step 15: 风险与待确认事项

> 状态: completed
> 创建日期: 2026-06-14
> 本轮口径: 全量重新讨论,旧 L3-method-library 文档只作差异审计。
> 回填位置: `00-需求文档.md` 第 15 章“风险与待确认事项”

---

## 0. Step 内计划

| 模块 | 状态 | 产物 | 完成门禁 |
|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | 已读取本 Step 必读输入。 |
| 整体模块搭建 | done | 本 Step 模块骨架 | 已先建骨架。 |
| 前序待确认项归并思考 | done | OPEN 项分组 | 未把待确认项直接改写成结论。 |
| 前序待确认项归并写入 | done | 待确认事项表 | 每项都有影响章节和当前状态。 |
| 风险识别思考 | done | 风险候选 | 风险写具体对象和影响范围。 |
| 风险清单写入 | done | 风险表 | 每项都有当前处理口径。 |
| 当前处理口径 / 挂起口径收敛 | done | 处理口径表述 | 不写最终解决方案或实现方案。 |
| 旧材料差异审计 | done | 冲突 / 可保留方向 / 废弃项 | 旧材料未直接继承。 |
| 自检与停审 | done | 自检表 / 进入 Step 16 条件 | 达到本 Step 门禁。 |

---

## 1. 必读文档

### 1.1 公共规范

| 文档 | 读取结论 |
|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | Step 15 必须显式收纳未关闭风险和待确认问题,拆成风险清单与待确认事项表,不得为填满文档而脑补确定结论。 |
| `standards/document/需求文档书写规范.md` | 4.15 要求风险表第三列写“当前如何约束 / 暂存”,待确认事项第三列写“当前如何挂起”;不得写实施方案、TODO 或空泛状态词。 |
| `projects/L3-method-library/design-calibration/00_req_step_07_core_capability_loop.md` | 核心闭环已收敛为统一定义和识别、稳定版本进入正式使用语境、下游按边界消费、变化可追溯并保护消费一致性。 |
| `projects/L3-method-library/design-calibration/00_req_step_09_functional_requirements.md` | 核心功能 FR-ML-001~007 已闭合;FR-ML-E-* 当前作为外围增强。 |
| `projects/L3-method-library/design-calibration/00_req_step_10_business_rules_boundaries.md` | BR-ML-001~021 已保护定义真相、Definition vs Use、正式化、版本变化、相邻仓边界和追溯约束。 |
| `projects/L3-method-library/design-calibration/00_req_step_11_data_ownership.md` | 真相、快照、引用、禁止保存正文已收束;Qualification / CapabilityDefinition 等仍为待确认项。 |
| `projects/L3-method-library/design-calibration/00_req_step_12_interfaces_dependencies.md` | 接口与依赖只保留能力边界;governance、artifact、marketplace、console、SDK 等关系有条件型或外围口径。 |
| `projects/L3-method-library/design-calibration/00_req_step_13_non_functional_requirements.md` | 非功能只保留判断口径,未继承旧 P95 / SLO 数值或监控实现。 |
| `projects/L3-method-library/design-calibration/00_req_step_14_acceptance_criteria.md` | 验收已覆盖能力、功能、规则、数据、接口、NFR 和一票否决项;剩余不确定性进入本 Step。 |

### 1.2 本 Step 后置审计输入

| 旧材料 | 读取结论 |
|---|---|
| `projects/L3-method-library/00-需求文档.md` §12 | 可保留“Qualification 边界混淆”“AIPolicy 与 governance 分叉”“ViewProfile 复杂化”“P1 反向污染”等风险方向;不能继承概率/影响评分、缓解方案、outbox、fingerprint、event schema、接口名或旧 P0 对象结论。 |
| `domain/method-library/README.md` §10~12 | 可保留标准映射、ViewProfile、AIPolicy、MethodPlugin/Configuration、marketplace、artifact、governance 协作风险线索;不能继承 RPC、表结构、缓存、PG、QPS、事件和场景流程。 |
| `projects/L3-method-library/README.md` | 可保留方法资产存储与分发、AIPolicy、marketplace 关系等主题线索;技术目录、种子数据和 schema 问题不进入本 Step。 |

---

## 2. 整体模块骨架

Step 15 只处理风险和待确认事项:

| 模块 | 输出 | 不输出 |
|---|---|---|
| 风险清单 | 已知风险、影响范围、当前处理口径。 | 不写概率评分、缓解任务、实施计划或技术方案。 |
| 待确认事项 | 会影响前文结构的未闭口问题、影响章节、当前状态。 | 不把普通后续工作或未来优化写成待确认。 |
| 当前处理口径 | 当前如何约束、暂存或归类风险。 | 不承诺最终解决方式。 |
| 当前挂起口径 | 在未确认前,前文按什么边界继续成立。 | 不写“未定”“后续再看”这类空话。 |
| 旧材料审计 | 哪些旧风险方向可保留,哪些旧口径必须废弃。 | 不继承旧对象模型或旧实现假设。 |

---

## 3. 模块思考记录

### 3.1 前序待确认项归并

问题回答:

- Step 1~14 的待确认项可以归并为几类:资产范围、外围增强是否进主线、治理正式化依赖、相邻仓消费边界、非功能/验收具体化方式。
- 其中会影响核心闭环成立的是资产范围和治理正式化依赖;会影响阶段范围的是外围增强和候选下游消费边界;会影响后续设计的是非功能数值、验收执行方式和可观测指标。

诊断:

- 若把所有 OPEN 项原样搬入正式文档,会造成重复和噪声。
- 若在 Step 15 直接关闭 Qualification、MethodPlugin、AIPolicy override 等问题,会绕过前文小循环结论。

取舍:

- Step 15 使用聚合后的待确认事项,并保留当前状态。
- 已被 Step 7~14 明确收束的项不再作为同级待确认重复出现,只在风险或状态中引用。

### 3.2 风险识别

问题回答:

- 当前最大的风险不是功能数量不足,而是方法资产定义真相、外围增强、相邻仓运行职责和旧实现口径重新混写。
- 需求层必须阻止后续 01~07 文档把旧稿中的 API、event、fingerprint、snapshot、outbox、P95 等实现结论反向写回需求。

诊断:

- 旧材料里很多风险本身有价值,但写法偏实施层,例如“使用 outbox / backlog”“schema 携带版本”“自动化检查接口路径不存在”。
- 如果不显式收纳这些差异,后续设计 agent 容易以旧稿为真相源恢复已经被本轮排除的对象和实现机制。

取舍:

- 风险表只写需求结构风险和边界风险。
- 技术缓解、测试脚本、事务和接口方案留到后续设计文档。

### 3.3 当前处理口径和挂起口径

问题回答:

- “当前处理口径”只说明当前如何约束风险:按边界排除、按外围增强处理、按条件型依赖处理、按后续设计输入暂存。
- “当前状态”只说明待确认问题在未闭口前如何挂起:暂不纳入主链、暂按外围增强、暂按引用/摘要候选、暂不继承旧数值。

诊断:

- “后续确认”“待设计”都不够,因为它们无法保护前文结论。

取舍:

- 每条待确认事项都明确当前不改变核心闭环或当前不进入主链的边界。
- 只有 Qualification / CapabilityDefinition 被标记为若纳入需回写 Step 9~14,因为它会改变功能、数据和验收结构。

---

## 4. 结构化中间产物

### 4.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| Qualification / CapabilityDefinition 若被后续直接恢复为核心资产,会破坏当前 Step 9~14 已形成的功能、数据和验收闭环。 | Step 7、Step 9、Step 10、Step 11、Step 12、Step 14、Step 16 | 当前不作为核心方法资产独立项;只保留为待确认事项。若后续纳入,必须回写相关 Step,不得在正式文档中局部插入。 |
| MethodPlugin、MethodConfiguration、marketplace 分发若反向成为核心前置,会使核心闭环被外围增强拖垮。 | Step 4、Step 6、Step 7、Step 8、Step 9、Step 11、Step 12、Step 14 | 当前按外围增强处理,不阻塞核心闭环验收;交易、履约和安装记录保持边界外。 |
| AIPolicy override 和高级 ViewProfile 匹配若过早复杂化,会把定义真相与组织级运行配置、UI 匹配实现混写。 | Step 2、Step 7、Step 9、Step 10、Step 11、Step 12、Step 13 | 当前只把 AIPolicy / ViewProfile 的定义主题纳入核心;复杂变体、override 和高级匹配按外围增强处理。 |
| governance 正式化依赖若被写成强制运行前置,会让方法资产定义真相依赖治理执行可用性。 | Step 5、Step 6、Step 10、Step 11、Step 12、Step 13、Step 14 | 当前按条件型治理结论依赖和引用/摘要边界处理;不把治理执行、Gate 流程或 policy enforce 结果迁入本仓。 |
| WorkProductDefinition 与 artifact 消费边界若未持续收紧,本仓可能保存 artifact 正文或成为 artifact 生命周期仓。 | Step 6、Step 7、Step 9、Step 10、Step 11、Step 12、Step 14 | 当前只承认 WorkProductDefinition 作为方法资产定义主题;artifact 正文、证据文件和 archive 正文禁止进入本仓。 |
| 下游消费影响回报若被实现化为强制同步机制,会把需求层的一致性保护变成未授权事件 / 快照 / repository 方案。 | Step 9、Step 10、Step 11、Step 12、Step 13、Step 14 | 当前仅作为一致性保护所需的能力与快照候选保留,不定义具体回报机制、事件 schema 或存储结构。 |
| 旧材料中的接口名、事件名、fingerprint、snapshot、outbox、P95 等若被直接继承,会把需求文档变成详细设计或测试计划。 | Step 9、Step 11、Step 12、Step 13、Step 14、Step 17 | 当前全部作为旧材料差异审计输入,不得进入正式需求正文;后续设计需重新论证。 |
| `L0-sdk`、`L5-console`、`L6-marketplace` 等体验或生态面若被当作 P0 管理前置,会扩大当前需求范围。 | Step 5、Step 6、Step 8、Step 9、Step 12、Step 14 | 当前作为外围消费面或候选协作面,不阻塞核心方法资产定义、正式化、消费和追溯闭环。 |
| 具体性能数值、指标名和验收执行方式若提前写死,会让需求层绑定旧技术栈和测试策略。 | Step 13、Step 14、Step 15、后续 05 / 06 | 当前只保留判断口径;自动化、人工评审、架构检查和具体数值留给后续测试与验收文档。 |

### 4.2 待确认事项

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

### 4.3 当前处理口径汇总

| 类别 | 当前口径 |
|---|---|
| 核心方法资产定义 | 以 Step 11 已列 SPEM 方法内容、过程模板与生命周期模型、ViewProfile 定义主题、AIPolicy 定义主题、身份目录、正式化版本、追溯和分发语义为准。 |
| 未闭口资产范围 | Qualification / CapabilityDefinition 不作为核心独立项;若纳入需回写前序 Step。 |
| 外围增强 | MethodPlugin、MethodConfiguration、marketplace 生态发现、高级 ViewProfile 匹配、AIPolicy override 继续作为外围增强或候选能力。 |
| 条件型依赖 | governance 正式化结论、artifact 消费、console / SDK 管理体验均不作为核心闭环强制前置。 |
| 禁止继承项 | 旧 API、event、fingerprint、snapshot、outbox、P95、测试脚本、数据库和缓存方案不进入正式需求正文。 |

---

## 5. 旧材料差异审计

### 5.1 可保留为风险方向的旧材料

| 旧方向 | 本轮吸收方式 |
|---|---|
| Qualification / Profile / Binding 边界容易混淆 | 收敛为 Qualification / CapabilityDefinition 待确认和成员能力画像 / 绑定正文禁止入仓风险。 |
| 下游反向改写定义会破坏本仓真相 | 收敛为 Step 10 规则、Step 14 一票否决项和本 Step 风险清单。 |
| AIPolicy 与 governance Policy DSL 可能分叉 | 收敛为 AIPolicy 定义主题与 governance 执行边界的风险和待确认事项。 |
| ViewProfile 匹配规则过早复杂化 | 收敛为 ViewProfile 定义主题与高级匹配外围增强的风险。 |
| MethodPlugin / MethodConfiguration 可能反向污染核心主线 | 收敛为外围增强不得阻塞核心闭环的风险和待确认事项。 |
| ProcessTemplate 与 process runtime 映射存在风险 | 收敛为下游按边界消费和 Definition vs Use 规则,不写实现映射。 |

### 5.2 不能继承的旧口径

| 旧口径 | 为什么不能在 Step 15 继承 | 后续处理 |
|---|---|---|
| 风险概率、影响评分和缓解任务 | 当前规范只要求风险、影响范围和当前处理口径。 | 实施计划或风险管理材料。 |
| outbox / backlog / fingerprint / snapshot schema 作为风险缓解 | 属于设计和实现方案。 | 03/05 后续设计与测试。 |
| schema version、event version、历史 snapshot 导出等技术方案 | Step 15 不做设计方案选择。 | 03/05 后续设计与测试。 |
| 旧 P0 Qualification 专项链路 | 当前未把 Qualification 作为核心独立资产闭口。 | 保留待确认;若纳入需回写 Step 9~14。 |
| 自动化检查本仓不存在某接口或表 | 属于测试 / 架构检查方式。 | 05 测试方案 / 06 验收标准。 |
| 旧 P95 / QPS / 缓存命中率 | 当前需求层未授权具体数值和技术栈。 | 后续非功能细化或测试计划。 |

---

## 6. 回填草稿

### 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/00_req_step_15_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/00_req_step_15_risks_open_questions.md` 的“结构化中间产物”“旧材料差异审计”和“自检与停审”小节,了解风险和待确认事项如何从 Step 1~14 的未闭口项收敛。

#### 15.1 风险清单

| 风险 | 影响范围 | 当前处理口径 |
|---|---|---|
| Qualification / CapabilityDefinition 若被后续直接恢复为核心资产,会破坏当前功能、数据和验收闭环。 | 核心能力、功能、规则、数据、接口、验收、追溯矩阵。 | 当前不作为核心方法资产独立项;只保留为待确认事项。若后续纳入,必须回写相关 Step。 |
| MethodPlugin、MethodConfiguration、marketplace 分发若反向成为核心前置,会使核心闭环被外围增强拖垮。 | 目标、依赖、核心能力、功能、数据、接口和验收。 | 当前按外围增强处理,不阻塞核心闭环验收;交易、履约和安装记录保持边界外。 |
| AIPolicy override 和高级 ViewProfile 匹配若过早复杂化,会把定义真相与组织级运行配置、UI 匹配实现混写。 | 边界、核心能力、功能、规则、数据、接口和非功能。 | 当前只把 AIPolicy / ViewProfile 的定义主题纳入核心;复杂变体、override 和高级匹配按外围增强处理。 |
| governance 正式化依赖若被写成强制运行前置,会让方法资产定义真相依赖治理执行可用性。 | 角色、依赖、规则、数据、接口、非功能和验收。 | 当前按条件型治理结论依赖和引用/摘要边界处理;不把治理执行、Gate 流程或 policy enforce 结果迁入本仓。 |
| WorkProductDefinition 与 artifact 消费边界若未持续收紧,本仓可能保存 artifact 正文或成为 artifact 生命周期仓。 | 依赖、核心能力、功能、规则、数据、接口和验收。 | 当前只承认 WorkProductDefinition 作为方法资产定义主题;artifact 正文、证据文件和 archive 正文禁止进入本仓。 |
| 下游消费影响回报若被实现化为强制同步机制,会把需求层的一致性保护变成未授权事件 / 快照 / repository 方案。 | 功能、规则、数据、接口、非功能和验收。 | 当前仅作为一致性保护所需的能力与快照候选保留,不定义具体回报机制、事件 schema 或存储结构。 |
| 旧材料中的接口名、事件名、fingerprint、snapshot、outbox、P95 等若被直接继承,会把需求文档变成详细设计或测试计划。 | 功能、数据、接口、非功能、验收和正式文档装配。 | 当前全部作为旧材料差异审计输入,不得进入正式需求正文;后续设计需重新论证。 |

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
| 可观测性指标、具体 P95 / SLO 数值和验收执行方式是否在后续正式文档中细化。 | 13、14、后续 05 / 06 | 当前只保留判断口径,不继承旧数值、指标名或检查方式。 |

---

## 7. 自检与停审

### 7.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否拆分风险与待确认事项 | 通过 | 已分别形成风险清单和待确认事项表。 |
| 每条风险是否有影响范围和当前处理口径 | 通过 | 风险表第三列均写当前如何约束或暂存。 |
| 每条待确认事项是否有影响章节和当前状态 | 通过 | 待确认事项表第三列均写当前如何挂起。 |
| 是否把 TODO 或未来优化写成风险 | 未发现 | 本 Step 只收纳影响前文结构成立的风险与待确认事项。 |
| 是否写入实施方案或技术方案 | 未发现 | 未写 repository、port、handler、事件 schema、outbox、DDL、测试脚本或监控配置。 |
| 是否脑补关闭未确认问题 | 未发现 | Qualification、外围增强、治理依赖、artifact、SDK/console、性能数值等均保持挂起口径。 |
| 是否可进入 Step 16 | 通过 | 风险与待确认事项已收敛,可进入需求追溯矩阵。 |

### 7.2 进入下一步条件

Step 15 已满足进入 Step 16 的条件:

- 已明确拆分风险与待确认事项。
- 风险表说明了当前如何约束或暂存风险。
- 待确认事项表说明了当前如何挂起未闭口问题。
- 未把普通 TODO、未来优化项或实施方案写进本章。
- 未为了填满文档而脑补确定性结论。

下一步 Step 16 将只处理:

- 功能需求与用户故事、业务规则、数据归属、接口依赖和验收项的追溯矩阵。
- 孤儿故事、孤儿功能、孤儿规则、孤儿数据、孤儿接口和孤儿验收的漏项检查。
- 风险与待确认事项对正式需求追溯的影响标注。
