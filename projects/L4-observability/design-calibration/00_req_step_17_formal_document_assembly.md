# Step 17 正式整理为 00-需求文档

## 0. Step 开工确认

| 项 | 内容 |
|---|---|
| 目标文档 | `projects/L4-observability/00-需求文档.md` |
| 当前 Step | Step 17 正式整理为 `00-需求文档` |
| 当前模式 | full-restart / formal-document-assembly |
| 用户确认 | yes, 用户确认在 Step 16 通过后进入 Step 17 |
| 前置状态 | Step 01~16 均已完成并通过补强门禁 |
| 写入范围 | 创建本 Step 中间产物;重建正式 `00-需求文档.md`;更新 `00_requirements_calibration_flow.md` 与 `project_execution_ledger.md` |
| 禁止事项 | 不新增未经 Step 01~16 确认的新需求;不实现代码;不伪造 commit、run_id、evidence alias、验收签署或真实测试结果;不自动进入 `01-架构设计.md` |

## 1. Step 内计划

| 子步骤 | 状态 | 输出 | 门禁 |
|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | 标准、flow、ledger、Step 01~16 装配前置诊断 | pass |
| 开工确认 / 必读文档:再写入 | done | 必读输入索引与执行约束 | pass |
| 正式装配输入抽取:先思考 | done | 可进入正式正文的内容类型与不可写入类型 | pass |
| 正式装配输入抽取:再写入 | done | Step 01~16 装配输入清单 | pass |
| 正式文档结构与来源映射:先思考 | done | 正式章节、来源和正文粒度判断 | pass |
| 正式文档结构与来源映射:再写入 | done | 章节来源映射表与写入计划 | pass |
| 当前文档问题诊断 | done | 旧正式文档与历史材料处理结论 | pass |
| 改动前后对比 | done | 正式 00 重建前后变化说明 | pass |
| 设计取舍 | done | 装配粒度、追溯和挂起项处理取舍 | pass |
| 结构化中间产物 | done | 正式装配结论 | pass |
| 正式文档装配草稿 / 写入计划 | done | `00-需求文档.md` 写入计划 | pass |
| 自检与门禁 | done | 装配后停审门禁 | pass |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 01~16 前置 | pass | `00_requirements_calibration_flow.md` 显示 Step 01~16 均已补强通过。 |
| 用户确认进入 Step 17 | pass | 用户已确认继续,允许进入正式装配。 |
| Step 17 中间产物 | pass | 本文件记录正式装配输入、来源映射、取舍和门禁。 |
| 正式文档写入 | pass | 本 Step 将重建正式 `00-需求文档.md`。 |
| 文档切换 | blocked | 正式 00 完成后必须停审,不得自动进入 `01-架构设计.md`。 |

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 17 不是继续讨论需求,而是把 Step 01~16 已确认的结论装配成正式 `00-需求文档.md`。如果正式装配时发现缺口,必须回到对应 Step,不能在 Step 17 补新需求。

本轮装配的关键风险有三类:

1. 旧正式 `00-需求文档.md` 和 README 含有历史产品栈、旧指标、旧证据与旧 implementation boundary,不能直接继承。
2. Step 09 以后编号密集,正式文档若只写摘要会降低可落码性。
3. Step 15 的待确认事项必须保持挂起,不能在 Step 17 被润色成确定 schema、算法、产品选型、真实 evidence 或验收签署。

### 3.2 必读文档候选

| 输入类型 | 文件 | 用途 |
|---|---|---|
| 通用规范 | `standards/document/设计文档编写通则.md` | 正式文档只承载收口结论,过程材料留在 calibration。 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 校准来源、三层台账、写入门禁和正式装配纪律。 |
| 真相源闭环标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 防止正式文档与 calibration、台账冲突。 |
| 依赖规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 保持 `L0-core` 唯一编译期依赖和 `L0-bus` 事件协作边界。 |
| 需求 SOP | `standards/document/需求文档讨论流程_SOP.md` | Step 17 只重组润色,不新增新结论。 |
| 需求书写规范 | `standards/document/需求文档书写规范.md` | 正式 16 章结构和每章校准来源写法。 |
| 项目台账 | `projects/L4-observability/design-calibration/project_execution_ledger.md` | 项目级恢复点和文档切换门禁。 |
| 文档 flow | `projects/L4-observability/design-calibration/00_requirements_calibration_flow.md` | Step 01~16 状态和 Step 17 装配门禁。 |
| Step 输入 | `projects/L4-observability/design-calibration/00_req_step_01~16_*.md` | 正式装配唯一内容来源。 |
| 历史材料 | `projects/L4-observability/README.md`;旧正式 `00~07`;旧 implementation 资产 | 只作为 historical material 和污染诊断输入。 |

### 3.3 初步关注点

| 关注点 | 判断 |
|---|---|
| 是否允许重用旧正式 00 | 不允许直接沿用。旧正式 00 作为 historical material,本次必须按 Step 01~16 重建。 |
| 是否允许新增 schema、DTO、状态、接口或算法 | 不允许。它们仍是 Step 15 待确认或后续 `01~07` 事项。 |
| 是否允许压缩 Step 09~16 编号表 | 不宜压缩到摘要。功能、规则、数据、接口、NFR、验收和追溯需要保留可落码粒度。 |
| 是否允许进入 01 | 不允许。正式 00 完成后停审。 |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文件 | 摘要 |
|---|---|
| `需求文档讨论流程_SOP.md` Step 17 | 只做重组与润色;不新增未经讨论的新结论;跨能力追溯未关闭的问题不得写成确定结论。 |
| `需求文档书写规范.md` | 正式文档采用 1~16 章结构;每章必须有具体 `校准来源` 和 `延伸阅读`;正式章节不写旧材料诊断、方案取舍、差异审计、自检和停审记录。 |
| `00_requirements_calibration_flow.md` | Step 01~16 已通过;Step 17 允许在用户确认后开始;正式 00 完成后仍需停审。 |
| `project_execution_ledger.md` | 当前恢复点在 Step 16 补强完成;旧 README、旧正式文档和旧 implementation 资产均为 historical material。 |

### 4.2 Step 17 输入索引

| 正式章节 | 输入 Step | 装配方式 |
|---|---|---|
| 1 与上游文档的关系声明 | Step 01 | 使用来源表、承接主题、不重新定义清单和 historical material 处理结论。 |
| 2 本仓定位与边界 | Step 02 | 使用边界声明表、易混淆边界和单独成仓原因。 |
| 3 背景与问题定义 | Step 03 | 使用业务背景、四条问题主线和业务 / 技术问题分类。 |
| 4 目标与非目标 | Step 04 | 使用目标表、非目标表和范围收束结论。 |
| 5 用户与角色 | Step 05 | 使用角色说明表、分类和能力级权限差异。 |
| 6 使用方与依赖 | Step 06 | 使用依赖裁剪表、依赖类型表、禁止依赖表和裁剪图。 |
| 7 核心能力闭环 | Step 07 | 使用闭环定义、闭环图、能力层级和能力节点顺序。 |
| 8 用户故事 | Step 08 | 使用核心故事、外围增强故事、故事映射和停审结论。 |
| 9 功能需求 | Step 09 | 使用 `FR-OBS-001~013` 与 `FR-OBS-E01~E06` 功能表和映射。 |
| 10 业务规则与边界约束 | Step 10 | 使用 `BR-OBS-001~026` 完整规则表、类型和功能映射。 |
| 11 数据需求与数据归属 | Step 11 | 使用 `DO-OBS-001~034` 数据归属表、数据类型、映射和禁止正文结论。 |
| 12 接口与依赖 | Step 12 | 使用 `IB-OBS-001~013`、`DB-OBS-001~014`、类型和映射表。 |
| 13 非功能需求 | Step 13 | 使用 `NFR-OBS-001~024`、非功能主表、判断口径和映射。 |
| 14 验收标准 | Step 14 | 使用 `AC-OBS-001~031`、`VF-OBS-001~010` 和验收映射。 |
| 15 风险与待确认事项 | Step 15 | 使用 10 条风险、9 条待确认事项、当前不阻塞 / 后续阻塞表。 |
| 16 需求追溯矩阵 | Step 16 | 使用主追溯矩阵、跨能力审计、漏项检查和追溯结论。 |

### 4.3 执行约束

| 约束 | 写法 |
|---|---|
| 正式文档结论来源 | 只来自 Step 01~16 和用户已确认输入。 |
| 校准来源 | 每章开头列出对应 `design-calibration/00_req_step_XX_*.md`。 |
| 历史材料 | 只在文档说明、上游关系和风险章节中以 historical material 口径出现。 |
| 挂起事项 | 保留 Step 15 状态,不得转成确定 schema、协议、算法、产品或指标。 |
| 禁伪造 | 不写真实 `run_id`、真实 evidence alias、passed evidence、final verdict、signoff 或测试结果。 |
| 文档切换 | 完成正式 00 后停审。 |

## 5. 正式装配输入抽取:先思考

### 5.1 可进入正式正文的内容

| 内容类型 | 进入方式 |
|---|---|
| 收口结论 | 进入对应正式章节正文。 |
| 编号表 | 保留在正式正文,尤其是 `FR`、`BR`、`DO`、`IB`、`DB`、`NFR`、`AC`、`VF` 和追溯矩阵。 |
| 能力级停审结论 | 可用短表说明当前能力是否闭合,但不写过程自检。 |
| 风险与待确认 | 正式第 15 章保留,并区分当前不阻塞与后续阻塞。 |
| historical material | 只作为历史材料处理说明和风险来源,不得作为基线结论。 |

### 5.2 不进入正式正文的内容

| 内容类型 | 处理 |
|---|---|
| SOP 问题回答 | 保留在对应 Step 文件。 |
| 当前文档问题诊断 | 保留在 calibration,正式正文只引用来源。 |
| 改动前后对比 | 保留在 calibration。 |
| 设计取舍过程 | 保留在 calibration;正式正文只写结果。 |
| 自检、门禁、停审表 | 保留在 calibration、flow 和 ledger。 |
| API 路径、DTO、字段、表结构、handler、repository、adapter | 当前没有来源,不得进入正式 00。 |
| 真实执行证据或验收结果 | 当前没有真实执行,不得进入正式 00。 |

### 5.3 缺口判断

| 检查项 | 判断 |
|---|---|
| Step 01~16 是否齐全 | 齐全。 |
| 是否存在未完成能力级停审 | 未发现。Step 07~16 均记录通过。 |
| 是否存在追溯未闭合项 | 未发现。Step 16 已声明无孤儿功能、规则、数据、接口、NFR、验收或新增未确认项。 |
| 是否需要回退前序 Step | 当前不需要。 |

## 6. 正式装配输入抽取:再写入

### 6.1 按章节装配输入清单

| 正式章节 | 必须进入正文的最小单元 | 不进入正文的过程材料 |
|---|---|---|
| 1 | 来源表、承接主题、不重新定义清单、historical material 降级说明 | Step 01 的 SOP 问答、差异审计和自检 |
| 2 | 边界声明表、易混淆边界、单独成仓原因 | Step 02 的待确认和门禁 |
| 3 | 背景、问题表、业务 / 技术问题分类 | 量化处理过程和旧材料诊断 |
| 4 | 目标表、非目标表、范围收束 | 目标候选分层和裁剪理由 |
| 5 | 角色说明表、能力级权限差异 | 角色候选诊断 |
| 6 | 依赖裁剪表、依赖类型、禁止依赖和裁剪图 | 依赖候选诊断和强阻塞讨论过程 |
| 7 | 闭环定义、闭环图、能力层级、节点顺序 | 功能回填映射诊断 |
| 8 | 核心故事表、外围增强故事、故事映射 | 故事候选分层和跨能力审计 |
| 9 | 功能需求表、能力类型、闭环映射、故事映射 | 功能候选和排除分析 |
| 10 | 完整规则表、规则类型、功能映射 | 规则候选和边界外规则排除过程 |
| 11 | 数据归属表、数据类型、归属说明、生命周期、功能 / 规则映射 | 数据候选和边界外数据裁剪过程 |
| 12 | 能力接口、外部依赖、接口类型、依赖类型、全局映射、功能映射 | 接口候选和协议裁剪过程 |
| 13 | 非功能类别、NFR 表、判断口径、映射 | NFR 候选和量化取舍过程 |
| 14 | 验收类别、AC 表、VF 表、验收映射 | 验收候选和测试方案裁剪过程 |
| 15 | 风险表、待确认表、当前不阻塞 / 后续阻塞表 | 风险候选分层和设计取舍过程 |
| 16 | 主追溯矩阵、跨能力审计、漏项检查、追溯结论 | 追溯输入抽取和主轴取舍过程 |

### 6.2 正式装配污染防线

| 污染来源 | 防线 |
|---|---|
| 旧 README 产品栈 | 正式正文只写 historical material;产品栈留给后续 `01/04/05/07`。 |
| 旧正式文档旧指标 | 不写成当前硬需求;只在风险和 NFR 中说明不得直接升级。 |
| 旧 `06` 真实证据口径 | 不写 TC / EV、真实 run_id、真实 evidence alias 或验收签署。 |
| 旧 implementation 资产 | 不写入当前 `00`;正式完成 `07` 时再重建 implementation ledger 和 planned boundary skeleton。 |
| Step 15 待确认事项 | 保持挂起,不在 Step 17 定稿。 |

## 7. 正式文档结构与来源映射:先思考

### 7.1 结构判断

正式 `00-需求文档.md` 必须按需求书写规范的 16 章结构组织。可以增加 `0. 文档说明`,用于声明本次 full-restart、历史材料处理和文档边界;正式编号章节仍从 1 到 16。

### 7.2 粒度判断

Step 05 以后必须达到可落码粒度,因此正式文档不应只写“采用某 Step 表格”。正式正文需要保留以下主表:

- 角色说明表与权限差异。
- 依赖裁剪表、禁止依赖表和依赖裁剪图。
- 核心能力闭环与能力节点顺序。
- `US-OBS-*` 故事表。
- `FR-OBS-*` 功能需求表。
- `BR-OBS-*` 规则表。
- `DO-OBS-*` 数据归属表。
- `IB-OBS-*` 与 `DB-OBS-*` 接口 / 依赖表。
- `NFR-OBS-*`、`AC-OBS-*`、`VF-OBS-*` 表。
- 需求追溯矩阵。

### 7.3 来源映射判断

每章只列对应 Step 文件作为校准来源;不把上游正式文档逐章列入校准来源块,上游文档通过第 1 章来源表承接。

## 8. 正式文档结构与来源映射:再写入

| 正式章节 | 校准来源 |
|---|---|
| 1 与上游文档的关系声明 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 2 本仓定位与边界 | `design-calibration/00_req_step_02_position_boundary.md` |
| 3 背景与问题定义 | `design-calibration/00_req_step_03_problem_context.md` |
| 4 目标与非目标 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 5 用户与角色 | `design-calibration/00_req_step_05_users_roles.md` |
| 6 使用方与依赖 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 7 核心能力闭环 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| 8 用户故事 | `design-calibration/00_req_step_08_user_stories.md` |
| 9 功能需求 | `design-calibration/00_req_step_09_functional_requirements.md` |
| 10 业务规则与边界约束 | `design-calibration/00_req_step_10_rules_boundary_constraints.md` |
| 11 数据需求与数据归属 | `design-calibration/00_req_step_11_data_requirements_ownership.md` |
| 12 接口与依赖 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 13 非功能需求 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 14 验收标准 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 15 风险与待确认事项 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 16 需求追溯矩阵 | `design-calibration/00_req_step_16_traceability_matrix.md` |

## 9. 当前文档问题诊断

| 输入 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` | 工作树中已有较长正式文档,但它早于 Step 17 当前装配链路。 | 可能混入旧 README、旧指标、旧产品栈和未按 Step 01~16 最新补强装配的内容。 | 完整重建,旧正文只作为 historical material。 |
| 旧 `README.md` | 包含 OTel、Prometheus、Grafana、TimescaleDB、对象存储、冷存、P95 等旧方向。 | 若直接进入正式 00,会把产品栈和量化候选提前固化。 | 仅作为 historical material 和风险来源。 |
| 旧 `05/06` 与旧 implementation 资产 | 含测试证据、验收和 implementation boundary 线索。 | 容易伪造真实证据或让旧 boundary 成为实现移交基线。 | 不进入当前正式 00;等 `05~07` 重建后再闭口。 |
| Step 10 回填草稿 | 只列规则分组,未直接列全量规则。 | 如果正式 00 只照搬回填草稿,规则粒度不足。 | 正式正文使用 Step 10 §6.2~§6.13 的完整规则表和映射。 |
| Step 15 待确认事项 | 仍包含 schema、算法、配置、产品、指标和 implementation 移交待确认。 | 如果 Step 17 擅自解决,会越过需求层。 | 正式第 15 章保持挂起。 |

## 10. 改动前后对比

| 项 | 装配前 | 装配后 |
|---|---|---|
| 正式 00 来源 | 旧正式正文和历史材料残留风险较高 | 完全按 Step 01~16 已确认结论重建 |
| 校准来源 | 旧正文可能缺少逐章准确来源 | 16 个正式章节均有对应校准来源与延伸阅读 |
| Step 05+ 粒度 | 旧正文部分章节偏摘要 | 保留角色、功能、规则、数据、接口、NFR、验收和追溯主表 |
| 历史材料 | 旧产品栈、旧指标和旧 implementation 资产容易污染 | 明确降级为 historical material |
| 文档切换 | 旧流程可能继续到后续正式文档 | 正式 00 完成后停审,等待用户确认进入 01 |

## 11. 设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否只用各 Step 回填草稿 | 不采用 | 部分回填草稿为摘要或索引,不足以满足 Step 05 以后可落码粒度。 |
| 是否把所有 Step 过程表复制进正式文档 | 不采用 | 正式文档是设计基线,不是讨论记录;过程材料留在 calibration。 |
| 是否保留完整编号表 | 采用 | `FR/BR/DO/IB/DB/NFR/AC/VF` 是后续架构、详细设计、测试和实施追溯锚点。 |
| 是否在 Step 17 补字段、schema、算法、产品和指标 | 不采用 | 这些仍是 Step 15 挂起事项或后续文档职责。 |
| 是否立即进入 01 | 不采用 | 用户明确要求正式文档完成后停审。 |

## 12. 结构化中间产物

### 12.1 装配结论

| 结论项 | 结论 |
|---|---|
| 正式 00 装配前置 | Step 01~16 均已通过,允许在用户确认后装配正式 00。 |
| 上游 blocker | 未发现阻塞 Step 17 的上游 blocker。 |
| 历史材料处理 | 旧 README、旧正式 `00~07`、旧 implementation ledger 和旧 boundary skeleton 继续作为 historical material。 |
| 正式章节结构 | 采用 `0. 文档说明` + 正式 1~16 章。 |
| 校准来源 | 每章列出对应 Step 文件。 |
| 停审 | 正式 00 完成后必须停审,不得进入 `01-架构设计.md`。 |

### 12.2 装配输出清单

| 输出文件 | 动作 |
|---|---|
| `design-calibration/00_req_step_17_formal_document_assembly.md` | 新建本 Step 中间产物。 |
| `00-需求文档.md` | 重建正式需求文档。 |
| `design-calibration/00_requirements_calibration_flow.md` | 更新 Step 17 为 pass,记录停审门禁。 |
| `design-calibration/project_execution_ledger.md` | 更新恢复点为正式 00 完成,下一步需用户确认进入 01。 |

## 13. 正式文档装配草稿 / 写入计划

正式 `00-需求文档.md` 将按以下顺序写入:

1. 文档说明:说明本次 full-restart、历史材料处理、文档不定义实现细节。
2. 第 1~4 章:来源、边界、问题、目标与非目标。
3. 第 5~8 章:角色、依赖、核心闭环和用户故事。
4. 第 9~12 章:功能、规则、数据、接口和依赖。
5. 第 13~16 章:NFR、验收、风险待确认和追溯。

写入时保持 ASCII 标点和现有仓内中文风格;不写真实执行证据、不写代码实现、不写 commit。

## 14. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否已读取 Step 17 所需标准、flow、ledger 和 Step 01~16 | pass |
| 是否只从已确认中间产物装配正式文档 | pass |
| 是否每章都有校准来源 | pass |
| 是否保留 Step 05 以后可落码粒度 | pass |
| 是否未引入新的 schema、DTO、API、表结构、算法、产品选型或实现任务 | pass |
| 是否未伪造真实 `run_id`、evidence alias、final verdict、signoff、测试结果或实现 commit | pass |
| 是否未把旧 README、旧正式文档或旧 implementation 资产恢复为当前基线 | pass |
| 是否未发现上游 blocker | pass |
| 正式 00 完成后是否必须停审 | pass |

## 15. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | Step 17 已按 Step 01~16 已确认结论完成正式装配输入、来源映射、写入计划和门禁自检;正式 `00-需求文档.md` 已在本 Step 重建 | wait_user_confirmation_before_01 |
