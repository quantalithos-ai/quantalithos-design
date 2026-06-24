# Step 2. 明确本轮实现范围和非范围

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
> 回填章节: `projects/L3-method-library/03-详细设计.md` §2 本次详细设计目标与范围
> 创建日期: 2026-06-21
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: `R2.16 自检与停审:再写入`
> 当前门禁: Step 2 completed;等待用户确认进入 Step 3 `R3.1 开工与必读文档:先思考`

---

## R2.1 开工与必读文档:先思考

### 1. 本模块要回答的问题

本轮 Step 2 不是续写旧 `03_ddd_step_02_scope.md`。旧 Step 2 仍围绕 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox 和 delivery 主线展开,与当前正式 `02-概要设计.md` 的八个组成部分和 Step 1 禁入清单冲突。

本模块只回答以下问题:

| 问题 | 本轮判断 |
|---|---|
| Step 2 的工作对象是什么? | 基于当前正式 `00/01/02` 和 Step 1 结论,明确本轮 `03-详细设计` 的实现契约范围、非范围、展开深度和后续 Step 分派。 |
| 是否可以继承旧 Step 2 的范围结论? | 不可以。旧 Step 2 只作 historical material 和污染样本。 |
| 是否可以直接写正式 `03-详细设计.md` §2? | 不可以。先在中间产物中完成先思考、再写入、结构化产物、回填草稿和停审。 |
| 是否可以在本模块直接给出最终范围表? | 不可以。本模块是开工思考,最终范围表留给后续 `再写入` 与范围裁决模块。 |
| Step 2 的完成标准是什么? | 明确本轮 03 必须覆盖什么、不覆盖什么、哪些只保留骨架或后续承接,并能支撑 Step 3 继续收稳 runtime / 仓库约束。 |

### 2. 必读文档

#### 2.1 流程与规范

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点、当前 Step 和下一动作。 | 只作为恢复门禁。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 确认 Step 1 已关闭、Step 2 当前门禁和历史材料处理口径。 | 作为文档级 flow 真相源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | 承接 Step 1 的上游输入、旧材料禁入清单、风险和未关闭事项分派。 | 作为 Step 2 第一前序输入。 |
| `standards/document/详细设计讨论流程_SOP.md` | 确认 Step 2 的目标、输入、输出、问题、约束和进入下一步条件。 | 只采用流程规则。 |
| `standards/document/详细设计书写规范.md` | 确认正式 §2 只包含设计目标表和非范围表,并写清非范围归属。 | 作为回填草稿格式约束。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认模块级先思考后写入、历史材料后置审计和单批写入规模。 | 作为本文件写入门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认后续 Step 发现 schema / port / DTO / mapper / state / config / evidence 缺口时必须暂停闭口。 | 作为范围深度红线。 |

#### 2.2 本仓正式输入

| 文档 | 读取目的 | Step 2 关注点 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 复核仓定位、目标 / 非目标、依赖和验收红线。 | 不重写需求目标;只判断哪些需求必须进入详细设计实现契约范围。 |
| `projects/L3-method-library/01-架构设计.md` | 复核职责边界、依赖方向、数据所有权、一致性和通信方式。 | 不重画架构;只判断哪些架构边界需要在 03 中展开为代码契约。 |
| `projects/L3-method-library/02-概要设计.md` | 提供 Step 2 直接范围来源。 | 以 §2、§4~§13 为范围和非范围裁决基线。 |

#### 2.3 概要承接与风险输入

| 中间产物 / 章节 | 读取目的 | Step 2 使用方式 |
|---|---|---|
| `02-概要设计.md` §2 | 获取概要层目标、非范围和设计深度口径。 | 转译为详细设计范围目标,不复制概要层描述。 |
| `02-概要设计.md` §4~§5 | 获取代码主体框架和八个主要组成部分。 | 判断本轮 03 的模块 / component 覆盖深度。 |
| `02-概要设计.md` §6~§9 | 获取关键对象、接口、处理流和状态轮廓。 | 判断 Step 6~10 是否必须完整展开。 |
| `02-概要设计.md` §10~§11 | 获取异常、边界和配置影响轮廓。 | 判断 Step 12 / Step 14 的范围和非范围。 |
| `02-概要设计.md` §12 | 获取详细设计承接清单和回退规则。 | Step 2 的直接范围来源。 |
| `02-概要设计.md` §13 | 获取设计风险和待确认事项。 | 只判断是否影响范围或展开深度。 |
| `02_hld_step_12_detailed_design_handoff.md` | 理解 §12 的来源和排除项。 | 辅助生成范围分派和回退口径。 |
| `02_hld_step_13_risks_open_questions.md` | 理解风险 / 待确认来源。 | 判断哪些事项不阻塞 Step 2、哪些影响后续 Step。 |
| `02_hld_step_14_formal_document_assembly.md` | 确认正式 02 已装配完成。 | 只作为正式 02 可用性的确认入口。 |

#### 2.4 参考框架与历史材料

| 材料 | 当前定位 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | framework_reference | 只参考 Step 2 的输入表、SOP 问题回答、范围表、非范围表和门禁深度,不得复制 governance 领域语义。 |
| 旧 `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | historical_material | 只作为旧 P0 / P1 和旧主线污染样本;本文件已重建,旧 completed 状态失效。 |
| 旧正式 `projects/L3-method-library/03-详细设计.md` §2 | historical_material | 只用于后置差异审计,不得作为范围来源。 |

### 3. 当前输入边界判断

| 输入类别 | 当前判断 | 对 Step 2 的影响 |
|---|---|---|
| 正式 00 / 01 / 02 | 可作为 Step 2 输入。 | Step 2 可以定义本轮 03 的范围与非范围。 |
| Step 1 结论 | 已关闭且可承接。 | 旧主线禁入、风险分派和未关闭事项必须进入 Step 2 门禁。 |
| 旧 Step 2 | 高污染 historical material。 | 不继承旧 P0 / P1、`MethodContent`、publish / snapshot / fingerprint / outbox 范围。 |
| 概要 §12 | 直接范围来源。 | Step 2 应围绕 §4~§11 的详细设计承接和回退规则展开。 |
| 概要 §13 | 风险来源。 | 不阻塞 Step 2,但影响 core / support / operation / peripheral 展开深度。 |

### 4. Step 2 初始范围裁决思路

本轮 Step 2 的范围裁决应从当前 `02-概要设计.md` 的八个组成部分出发,而不是从旧 P0 / P1 主线出发。

| 范围候选 | 初步处理 | 理由 |
|---|---|---|
| 方法资产定义与目录 | 必须进入本轮 03 | 这是本仓 definition truth 和目录身份的 core 主线。 |
| 正式化与版本 | 必须进入本轮 03 | 正式版本语义、依据和版本变更边界是核心可落码契约。 |
| 受控消费 | 必须进入本轮 03 | 下游消费材料、availability view 和 boundary guard 需要详细闭口。 |
| 追溯与一致性保护 | 必须进入本轮 03 | trace material、impact summary、audit 和一致性保护会影响实现和测试。 |
| 关系与分发语义 | 需要分层展开 | 属 support 范围,应定义 contract 和边界,但不得写 marketplace 交易。 |
| 外部摘要与引用 | 需要分层展开 | 属 support 范围,必须保持 body-free 和 summary/ref-only。 |
| 后台维护与收敛 | 需要分层展开 | 属 operation/support 范围,Job 不得修 core truth。 |
| 外围包与方法集组织 | 需要明确深度 | 属 peripheral 范围,不阻塞 core,不得提升为核心前置。 |

### 5. Step 2 模块顺序草案

Step 2 仍按“先搭整体模块,再逐模块先思考后写入”推进。当前只进入 `R2.1`。

| 顺序 | 模块 | 产物 | 门禁 |
|---:|---|---|---|
| R2.1 | 开工与必读文档:先思考 | 本节 | 只列输入、边界、历史材料处理和模块顺序。 |
| R2.2 | 开工与必读文档:再写入 | 开工记录、读取状态表、Step 内计划 | 不写最终范围表。 |
| R2.3 | L1-governance 框架对齐:先思考 | 可借鉴框架与不得借鉴内容 | 只抽象结构,不复制领域语义。 |
| R2.4 | L1-governance 框架对齐:再写入 | Step 2 框架对齐记录 | 固定本仓 Step 2 输出结构。 |
| R2.5 | 范围来源池:先思考 | 从 00 / 01 / 02 / Step 1 收集范围候选 | 不裁决最终范围。 |
| R2.6 | 范围来源池:再写入 | 范围候选池和来源矩阵 | 形成裁决输入。 |
| R2.7 | 范围裁决:先思考 | core / support / operation / peripheral 展开深度草案 | 不写回填草稿。 |
| R2.8 | 范围裁决:再写入 | 设计目标表、覆盖范围表、展开深度表 | 形成 Step 2 主体结论。 |
| R2.9 | 非范围裁决:先思考 | 非范围与归属文档草案 | 不写正式 §2。 |
| R2.10 | 非范围裁决:再写入 | 非范围表、回退规则和禁止越界清单 | 明确归属层次。 |
| R2.11 | 历史 Step 2 差异审计:先思考 | 旧 P0 / P1 污染扫描计划 | 旧材料后置审计。 |
| R2.12 | 历史 Step 2 差异审计:再写入 | 禁入旧范围、可重定义线索 | 不继承旧 completed 状态。 |
| R2.13 | 回填草稿:先思考 | 正式 §2 回填策略 | 不修改正式 03。 |
| R2.14 | 回填草稿:再写入 | §2 中间产物可回填草稿 | 不进入 Step 3。 |
| R2.15 | 自检与停审:先思考 | Step 2 自检清单 | 判断是否可进入 Step 3。 |
| R2.16 | 自检与停审:再写入 | Step 2 停审记录 | 关闭 Step 2,更新 flow / 台账到 Step 3 等待状态。 |

### 6. 下一写入边界

下一步只允许进入:

```text
R2.2 开工与必读文档:再写入
```

`R2.2` 应写入:

- Step 2 开工记录。
- 必读文档读取状态表。
- Step 内计划确认表。
- 当前输入基线和旧材料处理规则。
- 下一模块 `R2.3 L1-governance 框架对齐:先思考` 的门禁。

`R2.2` 不得写入:

- 最终设计目标表。
- 最终非范围表。
- 正式 `03-详细设计.md` §2。
- Step 3 runtime / 仓库约束正文。
- 对象、port、protocol、flow、state、persistence、config、test 或 implementation boundary。

### 7. 自检

| 检查项 | 结果 |
|---|---|
| 是否只进入 Step 2 第一个模块? | 是。 |
| 是否把旧 Step 2 降级为 historical material? | 是。 |
| 是否未继承旧 P0 / P1 / `MethodContent` 范围结论? | 是。 |
| 是否列出 Step 2 必读文档? | 是。 |
| 是否给出 Step 2 模块顺序? | 是。 |
| 是否未修改正式 `03-详细设计.md`? | 是。 |
| 是否未进入 Step 3? | 是。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.2 开工与必读文档:再写入`;只写 Step 2 开工记录、读取状态表、Step 内计划、输入基线和旧材料规则,不得写最终范围表,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.2 开工与必读文档:再写入

### 1. 开工记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.2 开工与必读文档:再写入` |
| 上一模块 | `R2.1 开工与必读文档:先思考` |
| 用户确认 | 已确认进入 `R2.2` |
| 本模块允许写入 | 开工记录、读取状态表、Step 内计划、输入基线、旧材料处理规则和下一门禁 |
| 本模块禁止写入 | 最终设计目标表、最终非范围表、正式 `03-详细设计.md` §2、Step 3 runtime / 仓库约束正文、对象 / port / protocol / flow / state 等后续契约 |
| 下一模块 | `R2.3 L1-governance 框架对齐:先思考` |

本模块确认 Step 2 已正式进入中间产物写入阶段。当前只固定开工、输入和模块顺序,不裁决最终范围,不修改正式 `03-详细设计.md`。

### 2. 必读文档读取状态表

#### 2.1 已完成读取

| 文档 | 状态 | 本模块使用结论 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | read | 项目级恢复点允许进入 Step 2 `R2.2`,且禁止跳过当前模块。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | read | 文档级 flow 已指向 Step 2 `R2.2`,旧 Step 2 不再作为当前结论来源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | read | Step 1 已关闭,其禁入清单、风险分派和 historical material 规则必须被 Step 2 承接。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md#R2.1` | read | `R2.1` 已固定 Step 2 必读文档、输入边界、初始范围裁决思路和模块顺序。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | Step 2 应明确本轮覆盖哪些实现单元、模块、接口、流程和哪些内容不进入本轮。 |
| `standards/document/详细设计书写规范.md` | read | 正式 §2 应形成设计目标表和非范围表,非范围必须写清归属层次或文档。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 当前必须按模块级先思考后写入,单批写入规模不等于最终内容长度上限。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 后续范围若导致 schema / port / DTO / mapper / state / config 缺口,必须回设计闭口。 |
| `projects/L3-method-library/00-需求文档.md` | read | 作为需求边界和非目标来源,不在 Step 2 重写需求。 |
| `projects/L3-method-library/01-架构设计.md` | read | 作为职责、依赖、数据所有权和一致性边界来源,不在 Step 2 重画架构。 |
| `projects/L3-method-library/02-概要设计.md` | read | 作为 Step 2 第一范围来源,尤其是 §2、§4~§13。 |
| `projects/L3-method-library/design-calibration/02_hld_step_12_detailed_design_handoff.md` | read | 作为详细设计承接清单、回退规则和排除项来源。 |
| `projects/L3-method-library/design-calibration/02_hld_step_13_risks_open_questions.md` | read | 作为风险和待确认事项来源,不直接写成范围结论。 |
| `projects/L3-method-library/design-calibration/02_hld_step_14_formal_document_assembly.md` | read | 确认正式 02 已完成装配,可作为本轮 03 输入。 |
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | read | 只参考 Step 2 框架深度和表格组织,不得复制 governance 领域语义。 |

#### 2.2 后续模块到达时读取

| 文档 / 材料 | 读取时机 | 用途 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | `R2.3` / `R2.4` | 抽取可借鉴的框架、输出块、门禁和非范围归属表达。 |
| 旧 `projects/L3-method-library/03-详细设计.md` §2 | `R2.11` / `R2.12` | 历史范围差异审计,只查旧主线残留。 |
| 旧本文件历史内容 | `R2.11` / `R2.12` | 审计旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox 范围污染。 |
| `02-概要设计.md` §4~§13 | `R2.5`~`R2.10` | 逐项收集范围来源、裁决展开深度和非范围归属。 |

### 3. Step 内计划确认表

| 顺序 | 模块 | 状态 | 完成门禁 |
|---:|---|---|---|
| R2.1 | 开工与必读文档:先思考 | completed | 已列出输入、边界、历史材料处理和模块顺序。 |
| R2.2 | 开工与必读文档:再写入 | completed | 已记录开工、读取状态、Step 内计划、输入基线和旧材料规则。 |
| R2.3 | L1-governance 框架对齐:先思考 | completed | 已分析可借鉴框架和不得借鉴内容,未写本仓最终范围结论。 |
| R2.4 | L1-governance 框架对齐:再写入 | completed | 已固定本仓 Step 2 输出结构和框架借鉴边界。 |
| R2.5 | 范围来源池:先思考 | completed | 已设计来源池、候选分类、收集规则和 R2.6 写入边界。 |
| R2.6 | 范围来源池:再写入 | next | 写入范围候选池和来源矩阵。 |
| R2.7 | 范围裁决:先思考 | pending | 形成 core / support / operation / peripheral 展开深度草案。 |
| R2.8 | 范围裁决:再写入 | pending | 写入设计目标表、覆盖范围表和展开深度表。 |
| R2.9 | 非范围裁决:先思考 | pending | 思考非范围归属和禁止越界口径。 |
| R2.10 | 非范围裁决:再写入 | pending | 写入非范围表、回退规则和禁止越界清单。 |
| R2.11 | 历史 Step 2 差异审计:先思考 | pending | 设计旧 P0 / P1 范围污染扫描计划。 |
| R2.12 | 历史 Step 2 差异审计:再写入 | pending | 写入禁入旧范围和可重定义线索。 |
| R2.13 | 回填草稿:先思考 | pending | 设计正式 §2 回填策略。 |
| R2.14 | 回填草稿:再写入 | pending | 写入 §2 中间产物可回填草稿。 |
| R2.15 | 自检与停审:先思考 | pending | 形成 Step 2 自检清单。 |
| R2.16 | 自检与停审:再写入 | pending | 关闭 Step 2,更新 flow / 台账到 Step 3 等待状态。 |

### 4. 输入基线

| 输入组 | 当前口径 | 使用规则 |
|---|---|---|
| 当前正式 `00-需求文档.md` | 已完成本轮重启。 | 只作为需求边界和非目标来源,不得在 Step 2 重写。 |
| 当前正式 `01-架构设计.md` | 已完成本轮重启。 | 只作为职责、依赖、数据所有权和一致性边界来源,不得在 Step 2 重画。 |
| 当前正式 `02-概要设计.md` | 已完成本轮重启。 | 是 Step 2 第一范围来源,后续裁决必须回指 §2、§4~§13。 |
| Step 1 中间产物 | 已关闭。 | 旧材料禁入、风险分派和进入 Step 2 条件必须继续承接。 |
| 旧 `03-详细设计.md` / 旧 `03_ddd_*` | historical material。 | 只作后置差异审计,不得作为当前范围来源。 |

### 5. 旧材料处理规则

| 旧材料 | 当前处理 | 说明 |
|---|---|---|
| 旧 P0 / P1 范围语言 | 禁止正向继承 | 当前范围以 core / support / operation / peripheral 和八个组成部分表达。 |
| 旧 `MethodContent` / 7 类 subtype 总对象线 | 禁止正向继承 | 当前 02 已改为方法资产定义与目录等八个组成部分。 |
| publish / published / `PublishMethodContent` | 禁止正向继承 | 当前正式化与版本不以 publish 作为主线。 |
| snapshot / `DefinitionSnapshot` | 禁止正向继承 | 当前只允许 summary / view / material / typed ref 重新闭口。 |
| fingerprint / drift | 禁止正向继承 | 当前不以 fingerprint 作为版本或一致性中心。 |
| outbox / delivery / event relay 旧机制 | 后置重审 | Outbound Event 只作为当前接口骨架候选,后续需按新版对象和 flow 重定义。 |
| 旧 Step 2 completed 状态 | 无效 | 当前 Step 2 已 full-restart,旧内容不再保留为当前结论。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写出开工记录 | pass | 已记录当前 Step、模块、用户确认、允许和禁止写入范围。 |
| 是否写出读取状态表 | pass | 已区分已读输入和后续模块到达时读取材料。 |
| 是否写出 Step 内计划 | pass | 已固定 R2.1~R2.16,未来模块未提前写正文。 |
| 是否明确输入基线 | pass | 正式 00 / 01 / 02 和 Step 1 为当前输入,旧 03 / 旧 Step 2 降级为 historical material。 |
| 是否明确旧材料处理规则 | pass | 旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox 不得正向继承。 |
| 是否写最终范围表 | no | 范围裁决留给后续模块。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.3 L1-governance 框架对齐:先思考`;只抽取 L1-governance Step 2 的框架深度、表格组织、范围 / 非范围表达和门禁,不得复制 governance 领域内容,不得写本仓最终范围表,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.3 L1-governance 框架对齐:先思考

### 1. 本模块目标

本模块只做框架分析,不做 L3-method-library 的最终范围裁决。

L1-governance 的 Step 2 已完成并被证明可以支撑后续 Step 3~19 展开。它的价值不在于 governance 领域内容,而在于它把“本轮详细设计覆盖什么、不覆盖什么、实现者能拿到什么输入、哪些内容后移到下游文档”拆成了可审计的结构。

L3-method-library 可以借鉴这种结构,但必须把所有领域语义替换为当前 `02-概要设计.md` 的八个组成部分和 Step 1 已确认的禁入清单。

### 2. 已读取参考材料

| 材料 | 读取结论 | 对本模块的使用方式 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | 该文件按输入、SOP 问题回答、问题诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿和进入下一步条件组织。 | 只抽取 Step 2 的组织框架、表格粒度和门禁表达。 |
| `projects/L1-governance/design-calibration/03_ddd_calibration_flow.md` | governance 的 flow 明确 Step 1~19 独立中间产物和正式文档后置装配。 | 只借鉴“Step 文件先完成,正式 03 后装配”的流程纪律。 |
| `projects/L3-method-library/02-概要设计.md` | 当前 L3-method-library 的直接输入是八个组成部分,不是旧 P0 / P1 或 MethodContent 主线。 | 作为后续 R2.5~R2.10 范围来源,本模块暂不裁决。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | Step 1 已将旧 `03` 和旧 `03_ddd_*` 降级为 historical material。 | 作为本模块判断“不可复制旧结构”的边界。 |

### 3. L1-governance Step 2 可借鉴的框架

| 框架块 | governance 中的作用 | L3-method-library 可借鉴方式 |
|---|---|---|
| Step 状态 / 输入表 | 先声明当前 Step 已确认、上一步输入、上游正式文档、概要承接和风险来源。 | 在 L3 Step 2 中保留输入基线表,确保范围裁决只来自当前 `00/01/02`、Step 1 和概要承接清单。 |
| SOP 问题回答 | 逐条回答“覆盖哪些模块、对象 / 接口 / 状态、哪些后移、实现者能做什么”。 | R2.7 / R2.8 应用同类问题回答,但答案必须围绕方法资产、正式化、受控消费、追溯、一致性、关系分发、外部摘要、维护收敛和外围包。 |
| 当前文档问题诊断 | 把旧文档、概要承接、风险、配置 / 测试 / 实施未同步问题分开说明。 | L3 应诊断旧 `03` 中 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox / delivery 对当前范围的污染。 |
| 改动前后对比 | 明确范围来源、目标、非范围和实现者输入从旧口径变成新口径。 | L3 应写“旧主线 / 旧对象 / 旧接口”与“当前八组件 / body-free / typed ref / summary view”之间的差异。 |
| 设计取舍 | 用 A/B/C 方案说明为什么选择完整核心闭环,而不是只写最小路径或一次性写完下游文档。 | L3 应比较“只写资产定义核心”、“覆盖八组件必要闭环”、“把配置测试实施一起写进 03”三类方案。 |
| 设计目标表 | 把 Step 2 目标拆成实现边界、对象契约、协议契约、处理流、状态、持久化、错误、配置、观测、测试切口。 | L3 可沿用目标维度,但目标名称要映射到 method-library 的 definition truth、version、consumption、trace、relationship、external summary、maintenance、package organization。 |
| 覆盖范围表 | 把范围映射到后续 Step 4~17,避免 Step 2 自己写后续详细内容。 | L3 应把每类范围分派给 Step 4~17,例如对象到 Step 6,port 到 Step 7,protocol 到 Step 8,flow 到 Step 9。 |
| 非范围表 | 明确哪些留给 00 / 01 / 02 / 04 / 05 / 06 / 07 / 运维 / ADR / 相邻仓。 | L3 必须列出外部方法正文、相邻仓 truth、复杂 marketplace、完整配置手册、完整测试矩阵、实施 commit 计划等非范围归属。 |
| 实现者代码范围表 | 从实现者视角说明正式 03 完成后能落哪些代码层。 | L3 应说明目标实现仓可落 contracts、domain、application、ports、infra fake、query / command / job shell、tests,但不能自行补 schema / mapper / state。 |
| 回填草稿 | 给出正式 §2 可装配草稿,但仍由 Step 19 或明确回填模块控制。 | L3 的 R2.13 / R2.14 再生成回填草稿;R2.3 不写。 |
| 待确认事项 / 进入下一步条件 | 说明哪些不阻塞 Step 3,哪些后续 Step 发现缺口要回退。 | L3 应在 R2.15 / R2.16 形成门禁,确认可进入 Step 3。 |

### 4. 不得复制的 governance 领域内容

L3-method-library 只参考框架,不得复制 governance 领域主语或能力。以下内容不能正向进入 L3 的范围裁决:

| governance 内容 | 禁止原因 | L3 替代表达来源 |
|---|---|---|
| Governance truth / Gate / Decision / Approval / Responsibility | 属 L1-governance 领域 truth,不是方法库主语。 | 当前 `02` 的方法资产定义与目录、正式化与版本。 |
| Policy / SharedRule / Control / Compliance / Nonconformity | 属治理合规闭环,不能作为 L3 的对象范围。 | 当前 `02` 的受控消费、追溯与一致性保护、外部摘要与引用。 |
| external GRC export preparation | 属 governance 外部合规系统接缝。 | L3 只能讨论 method-library 的外部摘要 / 引用 / 分发语义,不得引入 GRC 语义。 |
| Governance dashboard / policy effective view / control coverage view | 属 governance read model。 | L3 应使用 method asset catalog、availability view、trace material、relationship / package organization view 等当前 02 来源。 |
| GovernanceOutboxRecord / handoff / GRC export marker | 属 governance 发布与外部交付主线。 | L3 若涉及 outbound / handoff,必须由当前 02 重新命名和闭口,不得继承旧 outbox / delivery。 |
| 高级治理看板 / Policy DSL / 自动 AIIA / SoA 草拟 | 属 governance 后续增强。 | L3 的后续增强应另按 method package、method set、消费统计、推荐或 marketplace 等当前上游明确事项裁决。 |

### 5. 映射到 L3-method-library Step 2 的框架草案

R2.4 可以把下列结构固化为 L3 Step 2 后续写入模板:

| 顺序 | L3 Step 2 输出块 | 主要回答 |
|---:|---|---|
| 1 | 输入与状态表 | 当前 Step 2 承接哪些正式文档和哪些中间产物;旧材料如何降级。 |
| 2 | SOP 问题回答 | 本轮 03 必须覆盖哪些 method-library 模块、对象 / 接口 / job / 状态,哪些不覆盖。 |
| 3 | 当前文档问题诊断 | 旧 `03` 和旧 Step 2 哪些内容与当前 `02` 冲突。 |
| 4 | 改动前后对比 | 从旧 P0 / P1 与 MethodContent 主线,切换到当前八组件和可落码契约主线。 |
| 5 | 设计取舍 | 选择覆盖八组件的必要可落码闭环,同时避免把下游文档和外围增强塞进 03。 |
| 6 | 设计目标表 | 明确正式 03 要交付给实现者的能力范围和契约深度。 |
| 7 | 覆盖范围表 | 把范围分派到 Step 4~17,避免 Step 2 过早写对象、port、flow 细节。 |
| 8 | 展开深度表 | 区分 core / support / operation / peripheral,说明哪些完整闭口、哪些保留接缝。 |
| 9 | 非范围表 | 指定每个非范围归属到 00 / 01 / 02 / 04 / 05 / 06 / 07 / 运维 / ADR / 相邻仓。 |
| 10 | 实现者代码范围表 | 说明正式 03 完成后实现者应能落哪些 crate / module / test。 |
| 11 | 历史差异审计 | 确认旧范围哪些禁入、哪些可在当前命名下重新定义。 |
| 12 | 回填草稿与停审 | 只生成可装配草稿和进入 Step 3 条件,正式 03 暂不修改。 |

### 6. 对后续模块的约束

| 后续模块 | 本模块给出的约束 |
|---|---|
| R2.4 | 只能把上述框架固化为 L3 Step 2 输出结构,不得直接写最终范围结论。 |
| R2.5 / R2.6 | 范围来源池必须来自当前 `00/01/02`、Step 1 和概要承接清单,不得从 governance 或旧 L3 Step 2 抽对象。 |
| R2.7 / R2.8 | 范围裁决必须以八个组成部分和 core / support / operation / peripheral 展开深度为中心。 |
| R2.9 / R2.10 | 非范围必须写清归属文档或后续阶段,不能只写“不做”。 |
| R2.11 / R2.12 | 历史差异审计必须后置,只用于排除旧污染和识别需重命名重定义的线索。 |
| R2.13 / R2.14 | 回填草稿必须来自已确认范围 / 非范围结论,不得提前装配正式 `03-详细设计.md`。 |
| R2.15 / R2.16 | 停审必须检查是否足以进入 Step 3,并同步 flow / 台账。 |

### 7. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只参考 governance 框架 | pass | 本模块只抽取组织结构、表格深度和门禁表达。 |
| 是否复制 governance 领域对象 | no | Gate / Decision / Policy / Control / Nonconformity 等均列为不得复制。 |
| 是否写出 L3 最终范围表 | no | 最终范围裁决留给 R2.7 / R2.8。 |
| 是否写出正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |
| 是否给出 R2.4 输入 | pass | 已形成 L3 Step 2 输出结构草案和后续模块约束。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.4 L1-governance 框架对齐:再写入`;只允许固化 L3 Step 2 的输出结构和框架借鉴边界,不得写最终范围表,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.4 L1-governance 框架对齐:再写入

### 1. 框架对齐记录

本模块承接 `R2.3` 的分析,正式固定 L3-method-library Step 2 后续输出结构。

当前只固化“怎么组织 Step 2 的范围讨论”,不裁决“最终范围是什么”。最终范围来源池、范围裁决和非范围裁决分别留给 `R2.5`~`R2.10`。

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.4 L1-governance 框架对齐:再写入` |
| 上一模块 | `R2.3 L1-governance 框架对齐:先思考` |
| 用户确认 | 已确认进入 `R2.4` |
| 本模块允许写入 | 框架对齐记录、固定输出结构、后续模块约束、读取状态补充和下一门禁 |
| 本模块禁止写入 | 最终设计目标表、最终覆盖范围表、最终非范围表、正式 `03-详细设计.md`、Step 3 runtime / 仓库约束、对象 / port / protocol / flow / state 等契约 |
| 下一模块 | `R2.5 范围来源池:先思考` |

### 2. 固定输出结构

后续 Step 2 必须按以下结构收束。任何模块不得跳过来源池、直接写最终范围结论。

| 顺序 | 输出块 | 生成模块 | 内容边界 |
|---:|---|---|---|
| 1 | 输入与状态表 | R2.1 / R2.2 | 记录当前正式输入、历史材料降级、Step 内计划和开工门禁。 |
| 2 | 框架对齐记录 | R2.3 / R2.4 | 只参考 L1-governance 的组织方式、表格深度和门禁表达。 |
| 3 | 范围来源池 | R2.5 / R2.6 | 从当前 `00/01/02`、Step 1 和概要承接清单收集候选,不裁决。 |
| 4 | SOP 问题回答 | R2.7 / R2.8 | 回答本轮必须覆盖哪些模块、对象 / 接口 / job / 状态,以及实现者应能完成什么代码范围。 |
| 5 | 当前文档问题诊断 | R2.7 / R2.8 / R2.11 / R2.12 | 诊断旧 `03`、旧 Step 2 与当前八组件主线的冲突。 |
| 6 | 改动前后对比 | R2.7 / R2.8 / R2.11 / R2.12 | 说明旧 P0 / P1、`MethodContent` 主线如何被当前八组件和可落码契约主线替换。 |
| 7 | 设计取舍 | R2.7 / R2.8 | 比较“只写核心定义”“覆盖八组件必要闭环”“把下游文档塞进 03”等方案。 |
| 8 | 设计目标表 | R2.8 | 形成正式 §2 的目标候选,但仍只在中间产物内。 |
| 9 | 覆盖范围表 | R2.8 | 把范围分派到 Step 4~17,避免 Step 2 写后续契约细节。 |
| 10 | 展开深度表 | R2.8 | 区分 core / support / operation / peripheral 的完整闭口、接缝保留和后续承接。 |
| 11 | 非范围表 | R2.10 | 写清每个非范围留给哪一层或哪份文档。 |
| 12 | 禁止越界清单 | R2.10 / R2.12 | 排除旧主线、相邻仓 truth、外部正文、marketplace 交易、下游运行状态等。 |
| 13 | 实现者代码范围表 | R2.8 / R2.10 | 说明正式 03 完成后实现者可以落哪些 crate / module / tests,以及不能自行补什么。 |
| 14 | 回填草稿 | R2.13 / R2.14 | 只从已确认结构化结论生成正式 §2 草稿,不提前修改正式 03。 |
| 15 | 自检与停审 | R2.15 / R2.16 | 检查 Step 2 是否足以进入 Step 3,并同步 flow / 台账。 |

### 3. 框架借鉴边界

| 借鉴项 | 允许方式 | 禁止方式 |
|---|---|---|
| 输入表 | 保留上游正式文档、中间产物和风险承接来源。 | 把 governance 输入或旧 L3 Step 2 当成范围来源。 |
| SOP 问题回答 | 采用“先回答问题,再写结构化表”的顺序。 | 复制 Gate / Decision / Policy / Control 等 governance 领域答案。 |
| 问题诊断 | 诊断旧文档污染、概要承接缺口和下游文档职责边界。 | 把旧污染作为可直接保留的当前结论。 |
| 改动前后对比 | 对比旧 P0 / P1 与当前八组件。 | 只写抽象“更细了”,不说明替换关系。 |
| 设计取舍 | 明确为何选择覆盖八组件必要可落码闭环。 | 把外围增强或下游文档工作升格为本轮 03 核心范围。 |
| 结构化表格 | 目标、范围、非范围、代码范围都使用表格。 | 用散文替代表格,导致后续 Step 无法追溯。 |
| 回填草稿 | 只在后续模块从已确认结论摘录。 | 在框架对齐阶段提前写正式 §2 草稿。 |

### 4. L3-method-library 专属主线

后续范围讨论必须围绕以下 L3 主线展开,不得把 governance 主语或旧 L3 主线回流:

| 主线 | Step 2 使用方式 | 后续主要承接 |
|---|---|---|
| 方法资产定义与目录 | 判断 core truth、目录身份和定义边界是否必须完整覆盖。 | Step 5~11 |
| 正式化与版本 | 判断正式版本、正式化依据、版本变化和显式变化边界是否必须完整覆盖。 | Step 5~13 |
| 受控消费 | 判断 consumption material、availability view、downstream boundary 和 Definition vs Use guard 是否必须完整覆盖。 | Step 5~13 |
| 追溯与一致性保护 | 判断 trace material、impact summary、audit / lineage 和一致性保护是否必须完整覆盖。 | Step 5~15 |
| 关系与分发语义 | 判断 relation / distribution support 是否进入 support contract,并排除 marketplace 交易。 | Step 5~12 |
| 外部摘要与引用 | 判断 external summary / ref / body-free boundary 如何进入 support contract。 | Step 5~14 |
| 后台维护与收敛 | 判断 maintenance / refresh / reconciliation job 如何进入 operation contract,并保持 Job 不修 core truth。 | Step 5~16 |
| 外围包与方法集组织 | 判断 peripheral package / method set 是否只保留外围接缝或局部 contract。 | Step 5~17 |

### 5. 后续模块执行约束

| 后续模块 | 必须做 | 不得做 |
|---|---|---|
| R2.5 | 读取并分析当前 `00/01/02`、Step 1、概要 §12 / §13 的范围候选来源。 | 不裁决最终范围,不写目标表。 |
| R2.6 | 写入范围候选池、来源矩阵、候选与后续 Step 的初步映射。 | 不把旧 P0 / P1 或 governance 主语写成候选。 |
| R2.7 | 思考 core / support / operation / peripheral 的展开深度和方案取舍。 | 不写正式 §2,不进入非范围最终表。 |
| R2.8 | 写入范围裁决结构化中间产物,包括目标、覆盖范围、展开深度和代码范围表。 | 不修改正式 `03-详细设计.md`。 |
| R2.9 | 思考非范围、禁止越界项和归属文档。 | 不只写“不做”,必须准备归属层次。 |
| R2.10 | 写入非范围表、回退规则和禁止越界清单。 | 不把下游文档内容塞回 03。 |
| R2.11 | 设计旧 Step 2 / 旧正式 §2 差异审计方法。 | 不让历史材料成为第一来源。 |
| R2.12 | 写入禁入旧范围、可重定义线索和历史污染处理结论。 | 不继承旧 completed 状态。 |
| R2.13 | 思考正式 §2 回填策略和来源压缩方式。 | 不修改正式 03。 |
| R2.14 | 写入正式 §2 可回填草稿。 | 不进入 Step 3。 |
| R2.15 | 思考自检和进入 Step 3 条件。 | 不提前关闭 Step 2。 |
| R2.16 | 写入停审记录并同步 flow / 台账。 | 未通过自检时不得放行 Step 3。 |

### 6. 读取状态补充

| 文档 | 状态 | 本模块使用结论 |
|---|---|---|
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | read | Step 1 已将旧 `03` 和旧 `03_ddd_*` 降级为 historical material,Step 2 必须承接。 |
| `projects/L3-method-library/00-需求文档.md` | read | 当前需求基线强调定义 truth、正式版本、受控消费、追溯一致性和相邻仓边界。 |
| `projects/L3-method-library/01-架构设计.md` | read | 当前架构基线强调 Definition vs Use、核心 truth / 读取材料分层、摘要 / 引用边界和异步最终一致。 |
| `projects/L3-method-library/02-概要设计.md` | read | 当前直接输入是八个主要组成部分、关键对象、接口骨架、处理流、状态、异常、配置影响和承接清单。 |
| `02_hld_step_12_detailed_design_handoff.md` | read | 详细设计必须继续展开 §5~§11,发现主语变化时回退对应概要 Step。 |
| `02_hld_step_13_risks_open_questions.md` | read | 实现端不得私补对象、接口、状态、配置或证据口径;外围与外部依赖保持保守边界。 |
| `02_hld_step_14_formal_document_assembly.md` | read | 正式 02 已装配完成,可作为 03 输入。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | Step 2 应生成设计目标表、覆盖范围表、非范围表和进入 Step 3 条件。 |
| `standards/document/详细设计书写规范.md` | read | 正式 §2 只承载收口结论,非范围必须写清归属。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 当前继续遵守三层台账、先思考后写入、单批写入规模和正式文档后置规则。 |

### 7. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否固化 Step 2 输出结构 | pass | 已固定输入、框架、来源池、范围裁决、非范围、历史审计、回填和停审结构。 |
| 是否仍未写最终范围表 | pass | 最终范围裁决留给 R2.7 / R2.8。 |
| 是否仍未写最终非范围表 | pass | 非范围裁决留给 R2.9 / R2.10。 |
| 是否避免复制 governance 语义 | pass | 只保留框架借鉴,领域主线改为 L3 八组件。 |
| 是否未修改正式 `03-详细设计.md` | pass | 当前只写中间产物。 |
| 是否未进入 Step 3 | pass | 当前仍停在 Step 2。 |
| 是否给出 R2.5 输入 | pass | 下一步应进入范围来源池先思考。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.5 范围来源池:先思考`;只允许从当前 `00/01/02`、Step 1、概要承接和风险输入中收集范围候选,不得裁决最终范围,不得写正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.5 范围来源池:先思考

### 1. 本模块目标

本模块只设计范围来源池的收集方法,不写最终范围表。

`R2.5` 的重点是回答:后续 `R2.6` 应从哪些正式输入和中间产物抽取范围候选,每个候选应如何标注来源、范围类型、后续 Step 落点和禁止越界规则。

本模块不裁决任何候选是否最终进入本轮 `03-详细设计.md`。最终裁决留给 `R2.7` / `R2.8`;非范围裁决留给 `R2.9` / `R2.10`。

### 2. 范围来源层级

| 来源层级 | 具体材料 | 可提供的候选类型 | 使用边界 |
|---|---|---|---|
| 需求基线 | `00-需求文档.md` §2、§4、§7、§9~§15 | 仓定位、目标 / 非目标、核心能力闭环、功能需求、业务规则、数据归属、接口能力、验收红线、风险和待确认。 | 只抽取“必须被详细设计实现契约承接”的需求压力,不重写需求。 |
| 架构基线 | `01-架构设计.md` §4~§15 | 职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、交互方式、技术机制、横切约束、演进和风险。 | 只抽取“需要在 03 中落成代码边界”的架构约束,不重画架构。 |
| 概要直接输入 | `02-概要设计.md` §2、§4~§13 | 代码主体框架、八个组成部分、对象轮廓、接口骨架、处理流、状态、异常、配置影响、详细设计承接和风险。 | 作为 R2.6 第一范围候选来源。 |
| Step 1 结论 | `03_ddd_step_01_input_boundary.md` | 旧材料禁入、输入权威顺序、风险 / 待确认承接、历史污染边界。 | 用于筛除旧主线和标注历史污染,不产生独立业务范围。 |
| 概要承接清单 | `02_hld_step_12_detailed_design_handoff.md` | §4~§11 到详细设计的继续展开清单、回退规则、排除项。 | 用于确定后续 Step 分派和回退边界。 |
| 概要风险输入 | `02_hld_step_13_risks_open_questions.md` | 设计风险、待确认事项、未闭口项、实现不得私补口径。 | 只作为候选风险标签或保守边界,不直接升级为范围结论。 |
| 正式装配记录 | `02_hld_step_14_formal_document_assembly.md` | 正式 02 已完成装配、章节来源、旧材料处置。 | 用于确认正式 02 可作为当前输入,不新增范围。 |

### 3. 候选分类方案

`R2.6` 写入范围候选池时,每个候选必须先归入以下分类之一。分类只用于收集和排序,不是最终裁决。

| 候选分类 | 判定标准 | 典型来源 | 后续裁决位置 |
|---|---|---|---|
| core truth candidate | 直接影响方法资产定义、正式版本、受控消费和追溯一致性是否成立。 | 00 核心能力闭环;01 数据所有权;02 §5~§9。 | R2.7 / R2.8 |
| support contract candidate | 支撑 core 成立,但不拥有核心 truth,通常是关系、分发、外部摘要、引用、读取材料或安全边界。 | 01 摘要 / 引用边界;02 §5~§11。 | R2.7 / R2.8 |
| operation contract candidate | 维护、刷新、收敛、恢复和后台 Job 类范围,必须保持不修 core truth。 | 01 后台延后承接;02 §7~§11。 | R2.7 / R2.8 |
| peripheral candidate | 外围包、方法集组织、生态发现、复杂策略变体等不阻塞 core 的增强范围。 | 00 风险 / 待确认;01 演进路线;02 §5、§7~§13。 | R2.7 / R2.10 |
| exclusion candidate | 明确不属于 03 或只可作为相邻仓 / 下游文档范围。 | 00 非目标;01 不做什么;02 非范围 / 排除项。 | R2.9 / R2.10 |
| risk / open-question marker | 影响范围裁决,但当前只能标记为风险或待确认。 | 00 §15;01 §15;02 §13。 | R2.7~R2.10 / R2.15 |
| historical pollution marker | 来自旧 03 / 旧 Step 的主线,必须后置审计。 | Step 1;旧 `03`;旧 `03_ddd_*`。 | R2.11 / R2.12 |

### 4. 候选字段草案

`R2.6` 的范围候选池应使用以下字段。字段用于保证候选可追溯,不表示已经进入最终范围。

| 字段 | 含义 | 填写规则 |
|---|---|---|
| candidate_id | 候选编号 | 使用 `ML-D03-S2-CAND-###`。 |
| candidate_name | 候选名称 | 用当前 02 的主语命名,不得使用旧 `MethodContent` / publish / snapshot / outbox 主线命名。 |
| source_ref | 来源 | 写正式文档章节或中间产物路径,至少一处。 |
| source_type | 来源类型 | `requirement` / `architecture` / `hld` / `step1` / `handoff` / `risk` / `historical_marker`。 |
| candidate_class | 候选分类 | 使用本模块第 3 节分类。 |
| likely_component | 关联组成部分 | 优先映射到八个主要组成部分;无法映射时标记 `needs_review`。 |
| expected_step | 后续落点 | Step 4~17 中的一个或多个。 |
| inclusion_signal | 进入范围的理由信号 | 说明它为什么可能需要详细设计承接。 |
| exclusion_signal | 排除或降级信号 | 说明它为什么可能不是本轮核心范围。 |
| decision_status | 当前状态 | R2.6 阶段统一写 `candidate_only`。 |

### 5. 来源提取规则

| 规则 | 说明 |
|---|---|
| 以正式 02 为第一范围来源 | 八个组成部分、关键对象、接口、处理流、状态、异常、配置影响和承接清单优先进入候选池。 |
| 00 / 01 只提供压力和边界 | 需求 / 架构中的目标、规则、数据和依赖必须转译到当前 02 主语,不能绕过 02 直接产生对象或接口。 |
| Step 1 只提供输入边界和污染过滤 | Step 1 不能新增范围,只能确认旧材料禁入、历史材料降级和输入顺序。 |
| 风险和待确认只能标记 | 风险 / 待确认不直接等于范围;若影响后续 Step,在候选中标记 `risk / open-question marker`。 |
| 非范围必须同样收集 | 明确排除项也要进入来源池,否则后续非范围表会缺归属依据。 |
| 旧材料不前置 | 旧 `03` 和旧 Step 2 只能在 R2.11 / R2.12 做后置审计,不得在 R2.6 候选池中作为正向范围来源。 |
| 不提前写契约细节 | R2.6 可标记“需要 Step 6 对象契约”或“需要 Step 7 port 契约”,但不得写字段、函数签名、DTO schema 或状态矩阵。 |

### 6. 来源到候选的初步映射思路

以下只是 R2.6 的提取路线,不是最终范围结论。

| 来源 | R2.6 应提取的候选方向 | 暂不提取的内容 |
|---|---|---|
| `00-需求文档.md` 目标 / 核心能力闭环 | 定义与目录、正式版本、受控消费、变化追溯、一致性保护。 | 用户故事全文、验收执行方式、具体指标和排期。 |
| `00-需求文档.md` 业务规则 / 数据归属 | Definition vs Use、truth owner、正文禁止、相邻仓边界、摘要 / 引用边界。 | 相邻仓正文模型、权限系统实现、UI 渲染执行。 |
| `00-需求文档.md` 接口 / 依赖 | 对外能力接口、下游消费、事件协作、证据线索可感知。 | API 路径、event schema、SDK 封装、证据 JSON。 |
| `01-架构设计.md` 职责 / 上下文 / 子域 | 职责边界、外部接缝、核心 / 支撑 / 外围上下文。 | 重新定义需求目标或新增子域。 |
| `01-架构设计.md` 数据 / 一致性 / 交互 | truth / projection / summary / ref 分层、同步 / 异步 / 后台边界。 | 数据库表、缓存、消息系统、部署拓扑。 |
| `02-概要设计.md` §4~§5 | 代码主体框架、八个组成部分、后续 Step 承接主线。 | 具体 crate 名、module 文件名、函数签名。 |
| `02-概要设计.md` §6~§9 | 对象、接口、处理流、状态来源。 | 完整字段、完整 DTO、完整状态矩阵。 |
| `02-概要设计.md` §10~§11 | 异常边界、禁止配置化、配置影响。 | 错误码全集、配置 key、JSON 示例。 |
| `02-概要设计.md` §12~§13 | 详细设计承接、回退规则、风险和待确认。 | 把待确认事项直接写成已定范围。 |

### 7. R2.6 写入边界

下一模块 `R2.6` 应写入:

- 范围候选池总表。
- 来源到候选的映射表。
- 候选到八个组成部分的初步映射。
- 候选到 Step 4~17 的初步落点。
- exclusion / risk / historical marker 的候选记录。
- `candidate_only` 状态说明。

下一模块 `R2.6` 不得写入:

- 最终设计目标表。
- 最终覆盖范围表。
- 最终非范围表。
- 正式 `03-详细设计.md`。
- 对象字段、port 签名、DTO schema、处理流步骤、状态迁移、持久化结构、配置 key、测试用例或实施 commit。

### 8. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做来源池先思考 | pass | 本模块只设计来源层级、分类、字段和 R2.6 写入边界。 |
| 是否裁决最终范围 | no | 最终裁决留给 R2.7 / R2.8。 |
| 是否写最终非范围 | no | 非范围裁决留给 R2.9 / R2.10。 |
| 是否把旧材料作为正向来源 | no | 旧材料只保留为 R2.11 / R2.12 后置审计对象。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |
| 是否给出 R2.6 输入 | pass | 已固定 R2.6 候选池字段、提取路线和禁止事项。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.6 范围来源池:再写入`;只允许写入范围候选池、来源矩阵和 candidate_only 状态,不得裁决最终范围,不得写正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.6 范围来源池:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.6 范围来源池:再写入` |
| 上一模块 | `R2.5 范围来源池:先思考` |
| 用户确认 | 已确认进入 `R2.6` |
| 本模块允许写入 | 范围候选池、来源映射、八组件映射、Step 4~17 初步落点、exclusion / risk / historical marker 和 `candidate_only` 状态 |
| 本模块禁止写入 | 最终设计目标表、最终覆盖范围表、最终非范围表、正式 `03-详细设计.md`、对象字段、port 签名、DTO schema、处理流步骤、状态迁移、持久化结构、配置 key、测试用例或实施 commit |
| 下一模块 | `R2.7 范围裁决:先思考` |

本模块只把候选池落成可审计输入。所有候选仍是 `candidate_only`,不表示已经进入本轮最终范围。

### 2. 范围候选池

| candidate_id | candidate_name | source_ref | source_type | candidate_class | likely_component | expected_step | inclusion_signal | exclusion_signal | decision_status |
|---|---|---|---|---|---|---|---|---|---|
| ML-D03-S2-CAND-001 | 方法资产定义 truth 与目录身份 | `02-概要设计.md` §5~§6;`00-需求文档.md` §7 / §9 | hld | core truth candidate | 方法资产定义与目录 | Step 4~11 | 定义 truth、typed ref、catalog entry 是本仓成立锚点。 | 不恢复旧 `MethodContent` 总对象或正文 payload。 | candidate_only |
| ML-D03-S2-CAND-002 | 正式化、正式版本与显式版本变化 | `02-概要设计.md` §5~§9;`01-架构设计.md` §3 / §11 | hld | core truth candidate | 正式化与版本 | Step 5~13 | 正式版本稳定、正式化依据和显式变化直接支撑下游正式引用。 | 不以 publish、snapshot、fingerprint 替代正式化。 | candidate_only |
| ML-D03-S2-CAND-003 | 受控消费材料、availability 与下游边界 | `02-概要设计.md` §5~§10;`00-需求文档.md` §7 / §14 | hld | core truth candidate | 受控消费 | Step 5~13 | Definition vs Use、consumption material、availability view 是核心消费闭环。 | 不写鉴权实现、token scope 或下游运行 truth。 | candidate_only |
| ML-D03-S2-CAND-004 | 追溯材料、影响摘要、审计线索与一致性保护 | `02-概要设计.md` §5~§10;`00-需求文档.md` §14 | hld | core truth candidate | 追溯与一致性保护 | Step 5~15 | 变化追溯、impact summary、audit / lineage 和 protection decision 是验收红线。 | 不保存 raw log、event payload、证据正文或 report body。 | candidate_only |
| ML-D03-S2-CAND-005 | 方法资产关系与分发语义 | `02-概要设计.md` §5~§9;`01-架构设计.md` §4 / §9 | hld | support contract candidate | 关系与分发语义 | Step 5~12 | relation / distribution 支撑受控消费和外围发现。 | 不进入 marketplace listing、交易、安装、履约或推荐算法。 | candidate_only |
| ML-D03-S2-CAND-006 | 外部摘要、typed ref 与 body-free 引用边界 | `02-概要设计.md` §5~§10;`01-架构设计.md` §9 / §11 | hld | support contract candidate | 外部摘要与引用 | Step 5~14 | 外部治理、标准、ADR、artifact 等只能以 summary/ref/marker 承接。 | 不保存标准全文、artifact body、provider payload 或认证信息。 | candidate_only |
| ML-D03-S2-CAND-007 | 维护请求、刷新任务、恢复收敛与 progress view | `02-概要设计.md` §5 / §7~§11 | hld | operation contract candidate | 后台维护与收敛 | Step 5~16 | read material、trace material 和 consistency recovery 需要 operation contract。 | Job 不修 core truth,不固定 worker / scheduler / retry / queue。 | candidate_only |
| ML-D03-S2-CAND-008 | 外围 package、method set 与生态发现组织 | `02-概要设计.md` §5~§13;`00-需求文档.md` §15 | hld | peripheral candidate | 外围包与方法集组织 | Step 5~17 | package / method set 是外围组织语义和后续增强入口。 | 不阻塞 core 闭环,不表达 marketplace 履约 truth。 | candidate_only |
| ML-D03-S2-CAND-009 | 共享契约、typed ref 与跨仓基础引用 | `00-需求文档.md` §6;`01-架构设计.md` §8 / §17 | architecture | support contract candidate | cross-cutting | Step 3~8 | `L0-core` 基础引用和共享契约是可落码边界前提。 | 不在本仓私造跨仓基础 ref 语义。 | candidate_only |
| ML-D03-S2-CAND-010 | 事件协作与 outbound fact 边界 | `00-需求文档.md` §6;`02-概要设计.md` §7 | hld | support contract candidate | cross-cutting | Step 7~15 | `L0-bus` 协作需要 fact event / marker / trace context 边界。 | 不直接恢复 outbox、topic、relay、retry、delivery 机制。 | candidate_only |
| ML-D03-S2-CAND-011 | 代码主体分层、crate / module / service / adapter 边界 | `02-概要设计.md` §4 / §12 | handoff | support contract candidate | all components | Step 4~5 | 详细设计必须把概要框架转为实现单元布局和契约主轴。 | 不暗改概要层业务主语或新增组成部分。 | candidate_only |
| ML-D03-S2-CAND-012 | Command / Query / Inbound / Outbound / Job 协议族 | `02-概要设计.md` §7 / §12 | hld | support contract candidate | all components | Step 7~9 | 接口骨架需要正式 request / response / rejection / intake / report 合同。 | 不写 HTTP/RPC 路径、SDK 封装或 topic 细节。 | candidate_only |
| ML-D03-S2-CAND-013 | 状态、freshness、degraded / unavailable 与非法迁移 | `02-概要设计.md` §9~§10 / §12 | hld | support contract candidate | all components | Step 10~13 | 状态 owner、状态传播和降级语义影响实现与测试。 | 不把 read material 状态反写成第二 truth。 | candidate_only |
| ML-D03-S2-CAND-014 | 错误模型、safe failure 与边界拒绝面 | `02-概要设计.md` §10 / §12 | hld | support contract candidate | all components | Step 12~13 | 外部不可用、material 缺失、越界输入必须有可编码拒绝面。 | 不用实现便利性绕过 schema / mapper / state 闭口。 | candidate_only |
| ML-D03-S2-CAND-015 | typed config、runtime contract 与 config validation gate | `02-概要设计.md` §11~§12 | hld | operation contract candidate | all components | Step 14 | 配置影响入口、adapter、profile、job 和 validator 装配。 | 具体 key、env、部署挂载和示例留给 `04-配置设计.md`。 | candidate_only |
| ML-D03-S2-CAND-016 | 可观测性、审计埋点与安全诊断摘要 | `01-架构设计.md` §13;`02-概要设计.md` §10~§12 | architecture | support contract candidate | all components | Step 15~16 | 关键状态、传播、材料、引用缺失和边界异常需要可观察。 | 指标名、dashboard、SLO 和 evidence schema 不在 Step 2 裁决。 | candidate_only |
| ML-D03-S2-CAND-017 | 相邻仓运行 truth、成员状态、治理执行、UI 状态 | `00-需求文档.md` §4 / §6;`01-架构设计.md` §4 | requirement | exclusion candidate | none | R2.9~R2.10 | 明确排除可防止 Definition vs Use 串层。 | 属对应相邻仓,不得进入本仓 truth。 | candidate_only |
| ML-D03-S2-CAND-018 | 外部正文、artifact/archive body、证据正文 | `00-需求文档.md` §4 / §14;`02-概要设计.md` §10 | requirement | exclusion candidate | 外部摘要与引用 | R2.9~R2.10 | 正文禁止边界必须进入非范围表。 | 只能保留 summary/ref/marker。 | candidate_only |
| ML-D03-S2-CAND-019 | marketplace 交易、订单、安装、履约与商业分发 | `00-需求文档.md` §4 / §15;`01-架构设计.md` §12 | requirement | exclusion candidate | 关系与分发语义;外围包与方法集组织 | R2.9~R2.10 | 分发语义和交易履约容易混淆,必须拆开。 | 属 `L6-marketplace`,本仓只保留边界引用或外围发现语义。 | candidate_only |
| ML-D03-S2-CAND-020 | SDK / console / auth / UI 执行细节 | `00-需求文档.md` §6 / §15;`01-架构设计.md` §8 | requirement | exclusion candidate | none | R2.9~R2.10 | 管理体验和鉴权实现不应成为定义 truth 前置。 | 留给 `L0-sdk`、`L5-console` 或安全 / 平台层。 | candidate_only |
| ML-D03-S2-CAND-021 | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 主线 | Step 1 禁入清单;`02-概要设计.md` §5 / §7 / §12 | historical_marker | historical pollution marker | none | R2.11~R2.12 | 必须后置审计,防止旧 completed 状态回流。 | 不作为正向范围来源。 | candidate_only |
| ML-D03-S2-CAND-022 | Qualification / CapabilityDefinition 是否进入核心资产范围 | `00-需求文档.md` §15;`01-架构设计.md` §15~§16 | risk | risk / open-question marker | needs_review | R2.7~R2.10 | 若进入核心,会影响对象、接口、数据和验收全链。 | 当前未闭口,不得由 03 局部补入。 | candidate_only |
| ML-D03-S2-CAND-023 | 治理正式化结论是条件型还是强制前置 | `00-需求文档.md` §15;`01-架构设计.md` §15 | risk | risk / open-question marker | 正式化与版本;外部摘要与引用 | R2.7~R2.10 | 影响 formalization basis 和 external summary 接缝。 | 不迁入治理执行或 Gate 流程。 | candidate_only |
| ML-D03-S2-CAND-024 | `L1-artifact` 是否进入核心下游消费面 | `00-需求文档.md` §15;`01-架构设计.md` §16 | risk | risk / open-question marker | 外部摘要与引用;受控消费 | R2.7~R2.10 | artifact ref 可能影响 WorkProductDefinition 和消费材料。 | artifact 正文与生命周期仍禁止入仓。 | candidate_only |
| ML-D03-S2-CAND-025 | 下游消费影响摘要的正式来源与承接责任 | `02-概要设计.md` §13;`01-架构设计.md` §15 | risk | risk / open-question marker | 追溯与一致性保护 | R2.7~R2.10 | 影响 impact summary、trace 和 consistency protection。 | 不扫描、复制或推断下游运行状态。 | candidate_only |
| ML-D03-S2-CAND-026 | 外部依据 / artifact / governance ref 可用性口径 | `02-概要设计.md` §13 | risk | risk / open-question marker | 外部摘要与引用 | R2.7~R2.10 | 影响不可用、stale、rejected 和 safe failure。 | 不因外部不可用回滚已成立 truth。 | candidate_only |
| ML-D03-S2-CAND-027 | 外围 package / method set 与 marketplace context 演进范围 | `02-概要设计.md` §13 | risk | risk / open-question marker | 外围包与方法集组织 | R2.7~R2.10 | 影响 peripheral contract 是否进入本轮深度。 | 不作为 core 前置,不接管交易履约。 | candidate_only |
| ML-D03-S2-CAND-028 | 旧存储、cache、object storage、P95、topic 等实现机制 | `00-需求文档.md` §15;Step 1 禁入清单 | historical_marker | historical pollution marker | none | R2.11~R2.12 | 需要后置审计,防止旧实现假设污染 03。 | 不继承为架构或详细设计事实。 | candidate_only |

### 3. 来源到候选映射

| 来源 | 候选 |
|---|---|
| `00-需求文档.md` §4 / §7 / §9 / §14 | CAND-001、CAND-002、CAND-003、CAND-004、CAND-017、CAND-018 |
| `00-需求文档.md` §6 / §12 / §15 | CAND-009、CAND-010、CAND-019、CAND-020、CAND-022、CAND-024、CAND-028 |
| `01-架构设计.md` §3~§6 / §8~§13 | CAND-005、CAND-006、CAND-009、CAND-010、CAND-013、CAND-016、CAND-017 |
| `01-架构设计.md` §14~§17 | CAND-022、CAND-023、CAND-024、CAND-025、CAND-027 |
| `02-概要设计.md` §4~§6 | CAND-001、CAND-002、CAND-003、CAND-004、CAND-005、CAND-006、CAND-007、CAND-008、CAND-011 |
| `02-概要设计.md` §7~§11 | CAND-012、CAND-013、CAND-014、CAND-015、CAND-016 |
| `02-概要设计.md` §12~§13 | CAND-011~CAND-016、CAND-021~CAND-027 |
| Step 1 输入边界与禁入清单 | CAND-021、CAND-028 |

### 4. 候选到八个组成部分的初步映射

| 组成部分 | 候选 |
|---|---|
| 方法资产定义与目录 | CAND-001、CAND-009、CAND-011、CAND-012、CAND-013、CAND-014、CAND-016 |
| 正式化与版本 | CAND-002、CAND-006、CAND-012、CAND-013、CAND-014、CAND-016、CAND-023、CAND-026 |
| 受控消费 | CAND-003、CAND-005、CAND-012、CAND-013、CAND-014、CAND-016、CAND-024 |
| 追溯与一致性保护 | CAND-004、CAND-010、CAND-012、CAND-013、CAND-014、CAND-016、CAND-025 |
| 关系与分发语义 | CAND-005、CAND-006、CAND-010、CAND-012、CAND-013、CAND-014、CAND-019 |
| 外部摘要与引用 | CAND-006、CAND-012、CAND-013、CAND-014、CAND-015、CAND-018、CAND-023、CAND-024、CAND-026 |
| 后台维护与收敛 | CAND-007、CAND-013、CAND-014、CAND-015、CAND-016、CAND-025 |
| 外围包与方法集组织 | CAND-008、CAND-012、CAND-013、CAND-014、CAND-015、CAND-019、CAND-027 |

### 5. 候选到 Step 4~17 的初步落点

| Step | 初步落点候选 | 当前说明 |
|---|---|---|
| Step 4 实现单元与文件布局 | CAND-001~CAND-008、CAND-011 | 只决定 module / crate / service / adapter 布局,不写字段。 |
| Step 5 模块实现契约主轴 | CAND-001~CAND-016 | 固定 core / support / operation / peripheral contract 主轴。 |
| Step 6 对象实现契约 | CAND-001~CAND-008、CAND-013、CAND-014、CAND-022~CAND-027 | 只在后续 Step 6 展开 struct / enum / value object。 |
| Step 7 Trait / Port / Adapter | CAND-003、CAND-006、CAND-007、CAND-009、CAND-010、CAND-012、CAND-015 | 定义 port 与 adapter 接缝,不私补相邻仓 contract。 |
| Step 8 协议契约 | CAND-010、CAND-012、CAND-014 | Command / Query / Consumer / Event / Job public surface。 |
| Step 9 函数级处理流 | CAND-001~CAND-008、CAND-012、CAND-014 | 展开 application service 编排和 side effect 顺序。 |
| Step 10 状态机与转换矩阵 | CAND-002、CAND-003、CAND-004、CAND-007、CAND-008、CAND-013 | 状态 owner、合法迁移、degraded / unavailable。 |
| Step 11 持久化、事务与一致性 | CAND-001~CAND-008、CAND-013 | truth、material、summary、history、progress 的一致性边界。 |
| Step 12 错误模型与恢复 | CAND-014、CAND-018、CAND-023~CAND-026 | safe failure、拒绝面、回退与不可用口径。 |
| Step 13 并发、幂等与重入保护 | CAND-002、CAND-003、CAND-004、CAND-007、CAND-010、CAND-013 | 正式变化、消费材料、事件协作和 maintenance 重入保护。 |
| Step 14 配置引用与依赖绑定 | CAND-006、CAND-009、CAND-015、CAND-023、CAND-026 | typed config / runtime contract,具体 key 后移 04。 |
| Step 15 可观测性与审计 | CAND-004、CAND-006、CAND-007、CAND-016、CAND-025、CAND-026 | 关键状态、异常、引用缺失和 audit line。 |
| Step 16 测试切口 | CAND-001~CAND-016、CAND-022~CAND-027 | 后续只提最小验证清单,不写完整测试方案。 |
| Step 17 实施承接 | CAND-011、CAND-012、CAND-015、CAND-017~CAND-028 | 转交 07 的实施拆分、禁止补口和风险承接。 |

### 6. exclusion / risk / historical marker 汇总

| marker_type | candidate_id | 当前处理 |
|---|---|---|
| exclusion | CAND-017、CAND-018、CAND-019、CAND-020 | 留给 R2.9 / R2.10 裁决为正式非范围和归属层次。 |
| risk / open-question | CAND-022、CAND-023、CAND-024、CAND-025、CAND-026、CAND-027 | 留给 R2.7~R2.10 判断是否影响范围深度;未闭口前不得当作已定对象、port 或流程。 |
| historical pollution | CAND-021、CAND-028 | 留给 R2.11 / R2.12 做旧 Step 2 和旧正式 §2 差异审计。 |

### 7. candidate_only 状态说明

以上候选只用于后续范围裁决输入。当前模块不宣布任何候选进入最终范围,也不宣布任何候选正式排除。

最终范围裁决只能在 `R2.7 / R2.8` 完成;最终非范围裁决只能在 `R2.9 / R2.10` 完成;历史污染结论只能在 `R2.11 / R2.12` 完成。

### 8. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入范围候选池 | pass | 已写入 CAND-001~CAND-028。 |
| 是否保持 `candidate_only` | pass | 所有候选统一为 `candidate_only`。 |
| 是否写入来源矩阵 | pass | 已写入来源到候选映射。 |
| 是否写入八组件映射 | pass | 已把候选初步映射到八个组成部分。 |
| 是否写入 Step 4~17 初步落点 | pass | 已写入后续 Step 初步分派,未展开契约细节。 |
| 是否写最终范围表 | no | 最终范围裁决留给 R2.7 / R2.8。 |
| 是否写最终非范围表 | no | 非范围裁决留给 R2.9 / R2.10。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.7 范围裁决:先思考`;只允许思考 core / support / operation / peripheral 展开深度、SOP 问题回答和方案取舍,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.7 范围裁决:先思考

### 1. 本模块目标

本模块只形成范围裁决的思考口径,为 `R2.8 范围裁决:再写入` 准备结构化表格。

当前不写最终设计目标表,不写最终覆盖范围表,不写正式 `03-详细设计.md` §2。所有结论仍以“准备写入 R2.8 的裁决草案”表达。

### 2. 裁决输入

| 输入 | 当前用途 | 裁决边界 |
|---|---|---|
| R2.6 候选池 CAND-001~CAND-028 | 作为范围裁决候选全集。 | 只能从候选池裁决,不得新增对象主线。 |
| `02-概要设计.md` §5 八个组成部分 | 作为 core / support / operation / peripheral 分层基线。 | 不改写组成部分名称、层级或职责。 |
| `02-概要设计.md` §12 详细设计承接清单 | 作为 Step 4~17 展开方向。 | 若需要改主语或新增家族,必须回退概要。 |
| `02-概要设计.md` §13 风险与待确认事项 | 作为降级、挂起和禁止私补依据。 | 风险项不能在本模块直接写成已闭口范围。 |
| Step 2 SOP | 作为必须回答的问题集合。 | 本模块只准备回答草案,最终写入 R2.8。 |

### 3. 范围裁决原则草案

| 原则 | 说明 | 对 R2.8 的影响 |
|---|---|---|
| core 主链完整闭口 | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护共同构成本仓核心闭环。 | R2.8 应把 CAND-001~CAND-004 裁为完整详细设计覆盖。 |
| support 形成正式 contract | 关系与分发、外部摘要与引用、共享 ref、事件协作等支撑 core,但不拥有核心 truth。 | R2.8 应覆盖正式对象、port、protocol、flow 和错误边界,但排除交易 / 正文 / 下游运行 truth。 |
| operation 只维护派生材料与收敛 | 后台维护、刷新、恢复和 progress 需要可编码 contract,但不得修 core truth。 | R2.8 应覆盖 Job / task / progress / freshness / recovery contract,不固定 worker / queue / retry 机制。 |
| peripheral bounded inclusion | 外围包与方法集组织可作为不阻塞 core 的外围 contract 进入。 | R2.8 应明确只覆盖 package / method set / peripheral view 的边界,不承接 marketplace 履约。 |
| cross-cutting 必须覆盖但不反客为主 | typed ref、协议族、状态、错误、配置、可观测性是八组件的横切契约。 | R2.8 应把 CAND-009~CAND-016 写成后续 Step 覆盖维度,不是独立业务主语。 |
| exclusion 与 risk 分离 | 明确非范围和风险,但不在范围裁决阶段直接写最终非范围表。 | R2.8 只记录范围边界;R2.9 / R2.10 再写正式非范围归属。 |
| historical marker 后置 | 旧主线污染必须后置审计。 | R2.8 不采用 CAND-021 / CAND-028 作正向范围;R2.11 / R2.12 再处理。 |

### 4. core / support / operation / peripheral 展开深度草案

| 层级 | 候选 | 建议展开深度 | 理由 | R2.8 写入边界 |
|---|---|---|---|---|
| core | CAND-001、CAND-002、CAND-003、CAND-004 | 完整覆盖到 Step 4~16。 | 这些候选共同决定方法资产定义、正式版本、受控消费和追溯一致性是否成立。 | 写成本轮详细设计核心目标,并分派到对象、port、protocol、flow、state、persistence、error、test cut。 |
| support | CAND-005、CAND-006、CAND-009、CAND-010、CAND-012、CAND-013、CAND-014、CAND-016 | 正式 contract 覆盖,但不升格为 core truth。 | 关系、分发、外部摘要、事件、状态、错误和审计支撑 core,若不闭口会阻塞实现。 | 写成支撑契约目标和后续 Step 覆盖范围。 |
| operation | CAND-007、CAND-015 | Job / runtime contract 覆盖,实现机制后移。 | 维护与配置影响必须可编码,但 worker、scheduler、retry 和具体 key 不属于 03 主体。 | 写成 operation contract 和 typed runtime boundary,具体配置说明转交 04。 |
| peripheral | CAND-008、CAND-027 | 有界覆盖。 | package / method set 是当前 02 的组成部分,但不阻塞 core;marketplace context 仍需保守。 | 写成外围 contract 范围,并注明不作为 core 前置。 |
| exclusion | CAND-017、CAND-018、CAND-019、CAND-020 | 不进入本轮范围主体。 | 相邻仓 truth、外部正文、交易履约、UI / SDK / auth 执行不属于本仓详细设计。 | R2.8 不写入目标表;R2.10 写非范围归属。 |
| risk / open-question | CAND-022、CAND-023、CAND-024、CAND-025、CAND-026 | 保守承接或标记影响范围。 | 这些事项影响后续对象 / port / flow / safe failure,但当前未全部闭口。 | R2.8 只写“影响范围和保守处理”,不写成已定对象家族。 |
| historical pollution | CAND-021、CAND-028 | 不进入当前裁决主体。 | 旧 MethodContent / publish / snapshot / fingerprint / outbox / storage 假设已被 Step 1 降级。 | R2.11 / R2.12 后置审计。 |

### 5. SOP 问题回答草案

| SOP 问题 | R2.7 思考答案 | R2.8 写入方式 |
|---|---|---|
| 本轮详细设计必须覆盖哪些模块? | 覆盖八个组成部分,但按 core / support / operation / peripheral 不同深度展开。 | 写成覆盖范围表和展开深度表。 |
| 本轮必须定义哪些对象、接口、事件、job 和状态机? | core 四主线对象 / 接口 / flow / state 必须完整;support / operation 定义正式接缝;peripheral 定义有界 contract。 | 写成“目标 -> 交付给实现者结果”表,不写字段和签名。 |
| 哪些能力属于 P1 / 后续阶段? | marketplace 交易履约、UI / SDK / auth 执行、外部正文生命周期、强治理前置、未确认 Qualification / CapabilityDefinition、复杂组织级变体。 | 本模块只准备;R2.10 写正式非范围。 |
| 哪些内容属于测试方案、实施计划、配置设计或运维手册? | 完整测试矩阵 / evidence schema 属 05 / 06;commit 拆分属 07;配置 key / env / profile 示例属 04;部署运维和 worker 调度属运维 / 实施。 | R2.8 只标出边界,R2.10 再写归属。 |
| 实现者拿到本文后,应能完成哪些代码范围? | 应能实现 domain / contracts / application / ports / adapter boundary / job shell / safe errors / tests cut,但不能自行补 schema、mapper、state、config 或 evidence 口径。 | 写成实现者代码范围表。 |

### 6. 方案取舍草案

| 方案 | 处理方式 | 优点 | 问题 | 当前倾向 |
|---|---|---|---|---|
| 只写 core 四主线 | 不采用为完整范围 | 范围小,最容易收口。 | 会遗漏关系、外部摘要、维护、外围组织和横切 contract,后续实现仍会被迫补口。 | 不足以支撑 02 承接清单。 |
| 覆盖八组件必要可落码闭环 | 采用 | 与当前 02 一致,能让实现者按 core / support / operation / peripheral 分层落码。 | 文档体量较大,需要后续 Step 按模块小循环写。 | 推荐 R2.8 采用。 |
| 把 04/05/06/07 内容一并塞进 03 | 不采用 | 表面上减少跨文档查找。 | 会把配置说明、测试矩阵、验收证据和 commit 计划混入详细设计,破坏职责。 | 应排除。 |
| 恢复旧 P0/P1 与 MethodContent 主线 | 不采用 | 可复用旧材料表面结构。 | 与当前 full-restart、八组件和禁入清单冲突。 | 只能后置审计。 |

### 7. R2.8 写入结构草案

下一模块 `R2.8` 应写入以下结构化产物:

1. 范围裁决记录。
2. SOP 问题回答正式表。
3. 设计目标表草案。
4. 覆盖范围表。
5. 展开深度表。
6. 实现者代码范围表。
7. 风险 / 待确认的保守承接说明。
8. 本模块停审记录和下一门禁。

`R2.8` 不得写入:

1. 最终非范围表。
2. 正式 `03-详细设计.md` §2。
3. 对象字段、port 签名、DTO schema、状态迁移、持久化结构、配置 key、测试用例或实施 commit。
4. 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 正向范围。

### 8. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做范围裁决先思考 | pass | 本模块只形成裁决原则、展开深度和 R2.8 写入结构。 |
| 是否写最终设计目标表 | no | 设计目标表留给 R2.8。 |
| 是否写最终非范围表 | no | 非范围表留给 R2.9 / R2.10。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |
| 是否给出 R2.8 输入 | pass | 已明确 R2.8 应写入的表格和禁止事项。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.8 范围裁决:再写入`;只允许写入 SOP 问题回答、设计目标表草案、覆盖范围表、展开深度表和实现者代码范围表,不得写最终非范围表,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.8 范围裁决:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.8 范围裁决:再写入` |
| 上一模块 | `R2.7 范围裁决:先思考` |
| 用户确认 | 已确认进入 `R2.8` |
| 本模块允许写入 | SOP 问题回答、设计目标表草案、覆盖范围表、展开深度表、实现者代码范围表、风险 / 待确认保守承接说明 |
| 本模块禁止写入 | 最终非范围表、正式 `03-详细设计.md` §2、对象字段、port 签名、DTO schema、状态迁移、持久化结构、配置 key、测试用例、实施 commit |
| 下一模块 | `R2.9 非范围裁决:先思考` |

本模块形成 Step 2 的范围裁决主体结论,但仍只写在中间产物内。正式 `03-详细设计.md` §2 的回填草稿留给 `R2.13` / `R2.14`,最终非范围归属留给 `R2.9` / `R2.10`。

### 2. SOP 问题回答

| SOP 问题 | 本轮回答 | 后续承接 |
|---|---|---|
| 本轮详细设计必须覆盖哪些模块? | 必须覆盖当前 `02-概要设计.md` 的八个组成部分:方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 | Step 4~17 按 core / support / operation / peripheral 分层展开。 |
| 本轮必须定义哪些对象、接口、事件、job 和状态机? | core 四主线必须定义正式对象、typed ref、summary / view、Command / Query、处理流、状态、持久化与错误面;support / operation 必须定义正式 contract;peripheral 定义有界 contract。 | Step 6~13 负责对象、port、protocol、flow、state、persistence、error、concurrency。 |
| 哪些能力属于 P1 / 后续阶段,不应在本轮展开? | marketplace 交易履约、UI / SDK / auth 执行、外部正文生命周期、强治理前置、未确认 Qualification / CapabilityDefinition、复杂组织级策略变体、具体 worker / queue / retry / deployment。 | R2.9 / R2.10 写正式非范围和归属。 |
| 哪些内容属于测试方案、实施计划、配置设计或运维手册? | 完整测试矩阵、evidence schema 和验收证据归 `05` / `06`;commit 拆分和实施台账归 `07`;配置 key、env、profile、secret 示例归 `04`;部署、worker 调度和运维参数归运维 / 实施。 | Step 16 只给最小测试切口,Step 17 只给实施承接清单。 |
| 实现者拿到本文后,应能完成哪些代码范围? | 应能实现 contracts、domain、application service、ports、adapter boundary、query / command / consumer / event / job shell、safe error、state guard、persistence contract 和最小测试切口;不得自行补 schema、mapper、state、config 或 evidence 口径。 | R2.8 写实现者代码范围表;后续 Step 逐步闭口。 |

### 3. 设计目标表草案

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 建立方法资产定义与目录的核心契约 | 把方法资产定义 truth、稳定 typed ref、目录条目、目录读取材料和定义边界补成可实现 contract。 | 实现者可创建 definition / catalog domain 对象、application service、repository / read port、query surface 和一致性检查。 |
| 建立正式化与版本核心契约 | 把正式化状态、正式版本、资格判断、依据摘要、版本语义变化和替代 / 退役边界补成可实现 contract。 | 实现者可实现 formalization / version command、query、state guard、history / lineage 和幂等保护。 |
| 建立受控消费核心契约 | 把 consumption material、availability view、downstream boundary、Definition vs Use guard 和消费上下文补成可实现 contract。 | 实现者可实现 consumption material 准备、可用性读取、边界拒绝、下游只读消费面和越界记录。 |
| 建立追溯与一致性保护核心契约 | 把 trace material、impact summary、audit trail、evidence lineage、protection decision 和一致性保护边界补成可实现 contract。 | 实现者可实现 trace / impact / audit / lineage 对象、处理流、状态、safe failure 和最小验证切口。 |
| 建立关系与分发语义支撑契约 | 把 method relation、distribution context/ref、integrity rule 和 distribution material 补成 support contract。 | 实现者可实现 relation / distribution command、query、integrity diagnostic、read material 和事件候选,不实现 marketplace 交易。 |
| 建立外部摘要与引用支撑契约 | 把 external summary、external source ref、artifact archive ref、governance basis ref、body-free boundary 和引用有效性补成 support contract。 | 实现者可实现 external intake / command / query、body-free validation、safe ref 保存和不可用 / stale 错误面。 |
| 建立后台维护与收敛 operation 契约 | 把 read material refresh、trace refresh、consistency recovery、maintenance run、progress view 和 freshness 语义补成 operation contract。 | 实现者可实现 job shell、task object、progress view、refresh result 和 recovery safe summary,不固定 worker / queue / retry。 |
| 建立外围包与方法集组织有界契约 | 把 method package、method set assembly、composition rule、peripheral view 和 marketplace context ref 限定在不阻塞 core 的外围范围内。 | 实现者可实现 package / method set 对象、composition diagnostic、peripheral query 和刷新边界,不实现 listing / install / fulfillment。 |
| 建立横切协议、状态、错误、配置和观测契约 | 把 Command / Query / Inbound / Outbound / Job 协议族、状态族、safe failure、typed config boundary 和审计 / 观测位置补成可落码约束。 | 实现者可按 Step 8~16 获取 request / response / rejection / event / job report、状态矩阵、错误类型、config validator 和测试切口。 |

### 4. 覆盖范围表

| 覆盖范围 | 候选来源 | 主要组成部分 | 后续 Step 落点 | 当前裁决 |
|---|---|---|---|---|
| core truth 与目录身份 | CAND-001 | 方法资产定义与目录 | Step 4~13、Step 16 | 纳入完整覆盖。 |
| formalization / version | CAND-002 | 正式化与版本 | Step 5~13、Step 16 | 纳入完整覆盖。 |
| controlled consumption | CAND-003 | 受控消费 | Step 5~13、Step 16 | 纳入完整覆盖。 |
| trace / impact / audit / consistency protection | CAND-004 | 追溯与一致性保护 | Step 5~16 | 纳入完整覆盖。 |
| relation / distribution support | CAND-005 | 关系与分发语义 | Step 5~13、Step 16 | 纳入 support contract。 |
| external summary / ref / body-free boundary | CAND-006 | 外部摘要与引用 | Step 5~14、Step 16 | 纳入 support contract。 |
| maintenance / refresh / recovery / progress | CAND-007、CAND-015 | 后台维护与收敛 | Step 5~16 | 纳入 operation contract。 |
| package / method set / peripheral view | CAND-008、CAND-027 | 外围包与方法集组织 | Step 5~17 | 纳入有界 peripheral contract。 |
| shared ref / event / protocol / state / error / observability | CAND-009~CAND-016 | all components | Step 3、Step 7~16 | 纳入横切契约,但不作为独立业务主语。 |
| risk / open-question conservative carrying | CAND-022~CAND-026 | 相关组成部分 | Step 6~16、Step 18 | 只标记影响范围和保守处理,不局部补口。 |

### 5. 展开深度表

| 层级 | 组成部分 / 范围 | 展开深度 | 明确不在本层做 |
|---|---|---|---|
| core | 方法资产定义与目录 | 对象、typed ref、catalog truth、read material、command/query、flow、state、persistence、error、test cut 全链闭口。 | 不裁决正式版本;不接收外部正文;不保存下游运行 truth。 |
| core | 正式化与版本 | 正式化 state、formal version、basis summary、eligibility、version transition、history / lineage、幂等和并发保护全链闭口。 | 不执行治理流程;不恢复 publish、snapshot、fingerprint。 |
| core | 受控消费 | consumption material、availability、boundary、guard、context、definition/use violation 和下游只读边界全链闭口。 | 不实现鉴权系统;不保存下游运行状态;不让消费侧裁定正式版本。 |
| core | 追溯与一致性保护 | trace、impact、audit、evidence lineage、protection decision、safe failure 和 observability 全链闭口。 | 不保存 raw log、event payload、report body 或证据正文。 |
| support | 关系与分发语义 | relation / distribution 对象、完整性诊断、读取材料、事件候选和错误面正式闭口。 | 不实现 marketplace 交易、安装、履约、推荐或运行依赖图。 |
| support | 外部摘要与引用 | external summary/ref、artifact archive ref、governance basis ref、body-free boundary、引用有效性和 unavailable/stale/rejected 语义正式闭口。 | 不保存标准全文、artifact/archive body、provider payload 或认证信息。 |
| operation | 后台维护与收敛 | request、task、run、progress、refresh result、recovery summary、freshness / degradation 和 job report 正式闭口。 | 不修 core truth;不固定 worker、scheduler、queue、retry、lock 和部署参数。 |
| peripheral | 外围包与方法集组织 | package、method set、composition、peripheral view、discovery context ref 和外围刷新边界有界闭口。 | 不作为 core 前置;不承接 marketplace listing / install / fulfillment truth。 |
| cross-cutting | 协议、状态、错误、配置、观测、测试切口 | 横向覆盖八组件,确保实现者不需要猜 DTO、状态、错误、config boundary 或最小测试入口。 | 不写完整测试矩阵、evidence schema、配置 key、部署运维或 commit 计划。 |

### 6. 实现者代码范围表

| 代码范围 | 实现者应能完成 | 设计必须提供 | 实现者不得自行补 |
|---|---|---|---|
| contracts / shared types | typed ref、request / response / rejection、summary / view、event / intake / job report shell。 | Step 6 / 8 的字段、值域、公开类型和版本边界。 | 不得自造 public DTO、marker、schema version 或 degraded / visibility shell。 |
| domain | core / support / operation / peripheral 对象、状态、不变量、工厂和 transition guard。 | Step 6 / 10 / 13 的对象契约、状态矩阵、非法迁移和幂等规则。 | 不得从字符串、route param、外部正文或测试便利性反推业务 ref。 |
| application service | Command / Query / Consumer / Job 编排、side effect 顺序、拒绝面和恢复分支。 | Step 7~9 / 12 的 port、flow、error 和 side effect boundary。 | 不得改写 owner、绕过 port、用 query 修 truth 或用 job 修 core truth。 |
| ports / adapters | repository、read material、external summary、event publisher、job runtime 和 config boundary。 | Step 7 / 11 / 14 的 port contract、transaction、一致性和 runtime binding。 | 不得私补 storage schema、mapper、config key、retry / queue 机制。 |
| persistence / consistency | truth、summary、view、history、lineage、progress 的保存与读取一致性。 | Step 11 / 13 的事务、expected version、idempotency 和 replay contract。 | 不得把 read material 当第二 truth,不得静默覆盖正式版本语义。 |
| observability / audit | 关键状态、边界拒绝、外部不可用、材料刷新、consistency recovery 的审计与观测位置。 | Step 15 的日志 / metric / audit event contract。 | 不得让 observability 材料替代 truth 或 evidence schema。 |
| tests cut | 每个核心 contract 的最小验证入口和边界红线检查。 | Step 16 的最小测试切口和覆盖目标。 | 不得在 03 中生成完整测试方案、验收证据或 run artifact schema。 |

### 7. 风险 / 待确认保守承接说明

| 候选 | 影响 | R2.8 当前承接 |
|---|---|---|
| CAND-022 Qualification / CapabilityDefinition | 若纳入核心,会影响对象、接口、数据和验收全链。 | 不纳入当前核心范围;若后续确认,必须回写 00/01/02 和 03 对应 Step。 |
| CAND-023 governance formalization basis | 影响 formalization basis、external summary 和 safe failure。 | 只按条件型 summary/ref/basis 承接,不迁入治理执行或 Gate 流程。 |
| CAND-024 artifact core consumption | 影响 WorkProductDefinition、artifact ref 和 consumption material。 | 只承接 artifact/archive ref 与正文禁止边界;artifact 正文和生命周期仍在外部。 |
| CAND-025 downstream impact summary | 影响 impact summary、trace、consistency protection 和 maintenance。 | 只承接 body-free summary / typed ref / safe marker,不扫描、复制或推断下游运行状态。 |
| CAND-026 external basis availability | 影响 unavailable、stale、rejected、safe failure 和 config boundary。 | 只定义保守可用性 / 不可用性语义,不得因外部不可用回滚已成立 truth。 |
| CAND-027 peripheral / marketplace context | 影响 package / method set 是否深入展开。 | 只纳入 peripheral contract,不承接 marketplace listing / install / fulfillment。 |

### 8. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入 SOP 问题回答 | pass | 已逐项回答 Step 2 的 5 个问题。 |
| 是否写入设计目标表草案 | pass | 已写入实现契约目标和交付给实现者的结果。 |
| 是否写入覆盖范围表 | pass | 已按候选、组成部分和后续 Step 分派范围。 |
| 是否写入展开深度表 | pass | 已区分 core / support / operation / peripheral / cross-cutting。 |
| 是否写入实现者代码范围表 | pass | 已说明实现者可落代码范围和不得自行补口内容。 |
| 是否写最终非范围表 | no | 非范围裁决留给 R2.9 / R2.10。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.9 非范围裁决:先思考`;只允许思考非范围、禁止越界项和归属文档,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.9 非范围裁决:先思考

### 1. 本模块目标

本模块只准备非范围裁决口径,不写最终非范围表。

`R2.9` 的任务是把 R2.6 的 exclusion candidate、R2.8 已标记的后移项、当前 `00/01/02` 的非目标 / 不做什么 / 回退规则整理为 `R2.10` 可写入的非范围表、回退规则和禁止越界清单。

本模块不修改正式 `03-详细设计.md`,不进入 Step 3,不新增本轮范围。

### 2. 非范围来源池

| 来源 | 非范围信号 | R2.10 使用方式 |
|---|---|---|
| `00-需求文档.md` §4.2 非目标 | 流程执行、成员状态、治理执行、外部能力注册、marketplace 交易、UI 渲染、artifact 正文、鉴权实现均排除。 | 写入正式非范围表,并标明归属相邻仓或平台层。 |
| `00-需求文档.md` §6.3~§6.5 依赖裁剪 | SDK / console / marketplace / governance / artifact 等不进入当前主链,禁止源码级依赖和反向定义依赖。 | 写入禁止越界清单和相邻仓归属。 |
| `01-架构设计.md` §4.2~§4.4 | 本仓不做流程执行、成员状态、治理裁决、外部工具接入、交易履约、UI 执行、正文生命周期、鉴权实现。 | 作为非范围归属和边界红线来源。 |
| `02-概要设计.md` §12.3 | 需要改主语、对象 owner、接口族、主处理流、配置职责时必须回退概要,不得在 03 暗改。 | 写入回退规则和禁止用 03 补口。 |
| `02-概要设计.md` §13 | 下游依赖、影响摘要、外部依据可用性、外围 / marketplace context 均需保守承接。 | 写入待确认 / 风险非范围处理口径。 |
| R2.6 CAND-017~CAND-020 | 明确的 exclusion candidate。 | 写成非范围主表候选。 |
| R2.6 CAND-021 / CAND-028 | historical pollution marker。 | 写入历史污染禁止越界清单,但最终差异审计留给 R2.11 / R2.12。 |
| R2.8 代码范围表 | 明确 04 / 05 / 06 / 07 / 运维 / 实施承接内容。 | 写入下游文档归属候选。 |

### 3. 非范围分类草案

| 分类 | 判定标准 | 典型条目 | R2.10 写入方向 |
|---|---|---|---|
| 相邻仓 truth 非范围 | 属 process、identity、governance、capability-hub、artifact、marketplace、UI / console 等仓的 truth 或运行状态。 | 流程实例、成员生命周期、治理执行、外部能力注册、artifact 正文、marketplace 订单。 | 写入非范围表,归属到对应相邻仓。 |
| 下游文档非范围 | 属配置、测试、验收、实施计划、运维手册或部署说明。 | 配置 key、测试矩阵、evidence schema、commit 拆分、worker 调度。 | 写入非范围表,归属到 04 / 05 / 06 / 07 / 运维。 |
| 未闭口风险非范围 | 当前只可保守承接,不能升格为已定对象、port 或流程。 | Qualification / CapabilityDefinition、强治理前置、artifact 核心消费、下游影响回报机制。 | 写入“未确认前不进入本轮范围”的口径。 |
| historical pollution 非范围 | 来自旧 03 或旧 Step,与当前 00/01/02 主线冲突。 | MethodContent、publish、snapshot、fingerprint、outbox、delivery、旧 storage / cache / topic。 | 写入禁止越界清单,后置到 R2.11 / R2.12 审计。 |
| 实现机制非范围 | 属具体技术实现、部署、运维或框架选择,当前 03 Step 2 不裁决。 | worker、scheduler、queue、retry、lock、DDL、topic、SDK 封装、HTTP 路径。 | 写入非范围归属或后续 Step 约束。 |

### 4. R2.10 非范围主表候选

| 非范围候选 | 留给哪一层 / 哪份文档 | 理由 |
|---|---|---|
| 流程执行、ProcessInstance、runtime orchestration | `L1-process` / `L2-runtime` | 本仓只定义方法资产,不拥有运行实例或编排状态。 |
| 成员身份、成员生命周期、成员实际角色状态 | `L1-identity` / 成员相关仓 | 本仓可定义角色语义,不拥有成员状态 truth。 |
| 治理裁决、Gate 执行、policy enforce | `L1-governance` / runtime | 本仓只承接治理结论摘要或依据引用。 |
| 外部工具、MCP / A2A / provider 注册和访问裁决 | `L3-capability-hub` / 治理协作边界 | 方法资产和外部能力注册职责分离。 |
| marketplace 定价、订单、购买、结算、安装、履约 | `L6-marketplace` | 本仓只保留分发语义或外围 context ref。 |
| UI 页面渲染、会话、组件状态、交互执行 | `L5-console` / 体验层 | 本仓只定义可消费语义,不实现展示状态。 |
| artifact、archive、证据文件或外部文档正文生命周期 | `L1-artifact` / archive / 外部系统 | 本仓只保存 summary/ref/marker,不保存正文。 |
| 认证登录、权限系统、操作主体鉴权实现 | 身份 / 安全 / 治理平台层 | 03 只定义业务边界和 ActorContext 等接缝。 |
| 完整配置 key、env、profile、secret、部署挂载和示例 | `04-配置设计.md` / 运维 | 03 只定义 typed config / runtime contract 和 validator 边界。 |
| 完整测试矩阵、验收标准、evidence schema、run artifact schema | `05-测试方案.md` / `06-验收标准.md` | 03 只定义最小测试切口,不生成证据 schema。 |
| commit 拆分、实施台账、boundary ledger、提交策略 | `07-实施计划.md` | 03 只输出实施承接清单,不写实施计划。 |
| worker、scheduler、queue、retry、lock、部署参数、运维脚本 | `07-实施计划.md` / 运维手册 | 03 定义 Job contract,不固定运行机制。 |
| 未确认 Qualification / CapabilityDefinition 独立核心范围 | 回写 00 / 01 / 02 后再进入 03 | 当前未闭口,不得由详细设计局部补入。 |
| 强治理前置和强 artifact 核心消费 | 回写 00 / 01 / 02 / 03 对应 Step | 当前按条件型 summary/ref/basis 和正文禁止边界处理。 |
| 旧 MethodContent / publish / snapshot / fingerprint / outbox / delivery | historical material;R2.11 / R2.12 审计 | 与当前八组件和 full-restart 主线冲突。 |

### 5. 禁止越界口径草案

| 越界行为 | 禁止原因 | R2.10 写法 |
|---|---|---|
| 在 03 中暗改 02 的八组件、职责或层级 | 详细设计不能改概要主语。 | 必须回退 `02-概要设计.md` §4 / §5。 |
| 在对象 / port / flow 中补入未确认资产家族 | 会绕过 00/01/02 的范围裁决。 | 未确认项只标记为 risk / open-question。 |
| 用配置绕过 truth owner、状态机或 body-free 红线 | 配置不能改变业务不变量。 | 回退 02 §11 / 04 配置设计。 |
| 用 job / maintenance 修 core truth | Job 只刷新派生材料和收敛状态。 | Step 9 / 12 / 13 必须保留拒绝或 formal intervention。 |
| 用 query、consumer、publisher 改写 owner 或副作用边界 | 会翻转接口职责。 | Query no-write、Consumer 不生成 core truth、Publisher failure 不回滚 truth。 |
| 从旧 03 / 旧 Step 继承 MethodContent / publish / outbox 等对象 | full-restart 下旧 completed 状态失效。 | 只能作为 R2.11 / R2.12 污染审计输入。 |
| 实现端遇缺口自行补 schema / mapper / state / config / evidence | 违反可落码性标准。 | 必须回设计闭口,不得提交私补实现。 |

### 6. R2.10 写入结构草案

下一模块 `R2.10` 应写入:

1. 非范围裁决记录。
2. 正式非范围表候选,字段为 `非范围` / `留给哪一层 / 哪份文档` / `当前处理口径`。
3. 回退规则表。
4. 禁止越界清单。
5. 非范围与 R2.8 覆盖范围的一致性检查。
6. 本模块停审记录和下一门禁。

`R2.10` 不得写入:

1. 正式 `03-详细设计.md` §2。
2. 对象字段、port 签名、DTO schema、状态迁移、持久化结构、配置 key、测试用例或实施 commit。
3. 历史 Step 2 差异审计正文;该内容留给 R2.11 / R2.12。

### 7. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做非范围先思考 | pass | 本模块只准备来源池、分类、主表候选和禁止越界口径。 |
| 是否写最终非范围表 | no | 最终非范围表留给 R2.10。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |
| 是否给出 R2.10 输入 | pass | 已明确 R2.10 应写入结构和禁止事项。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.10 非范围裁决:再写入`;只允许写入非范围表、回退规则和禁止越界清单,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.10 非范围裁决:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.10 非范围裁决:再写入` |
| 上一模块 | `R2.9 非范围裁决:先思考` |
| 用户确认 | 已确认进入 `R2.10` |
| 本模块允许写入 | 非范围表、回退规则、禁止越界清单、一致性检查和下一门禁 |
| 本模块禁止写入 | 正式 `03-详细设计.md` §2、对象字段、port 签名、DTO schema、状态迁移、持久化结构、配置 key、测试用例、实施 commit、历史差异审计正文 |
| 下一模块 | `R2.11 历史 Step 2 差异审计:先思考` |

### 2. 非范围表

| 非范围 | 留给哪一层 / 哪份文档 | 当前处理口径 |
|---|---|---|
| 流程执行、ProcessInstance、runtime orchestration | `L1-process` / `L2-runtime` | 本仓只定义方法资产和受控消费边界,不拥有运行实例、活动状态或 runtime 编排。 |
| 成员身份、成员生命周期、成员实际角色状态 | `L1-identity` / 成员相关仓 | 本仓可定义角色等方法语义,不保存成员具备何种角色或资格的状态 truth。 |
| 治理裁决、Gate 执行、policy enforce | `L1-governance` / runtime | 本仓只可承接治理结论摘要、basis ref 或 safe marker,不得迁入治理执行过程。 |
| 外部工具、MCP / A2A / provider 注册和访问裁决 | `L3-capability-hub` / 治理协作边界 | 方法资产定义与外部能力注册职责分离,本仓不管理 provider 接入。 |
| marketplace 定价、订单、购买、结算、安装、履约 | `L6-marketplace` | 本仓只保留分发语义、peripheral context ref 或方法资产来源边界,不承接交易 truth。 |
| UI 页面渲染、会话、组件状态、交互执行 | `L5-console` / 体验层 | 本仓只定义可被消费的视图策略或读取语义,不实现 UI runtime。 |
| artifact、archive、证据文件或外部文档正文生命周期 | `L1-artifact` / archive / 外部系统 | 本仓只保存 summary/ref/marker/digest hint,不保存正文、文件、archive 包体或证据正文。 |
| 认证登录、权限系统、操作主体鉴权实现 | 身份 / 安全 / 治理平台层 | 03 可定义 ActorContext / subject boundary,但不实现认证、授权和权限矩阵。 |
| 完整配置 key、env、profile、secret、部署挂载和示例 | `04-配置设计.md` / 运维 | 03 只定义 typed config / runtime contract、config validator 和禁止配置化边界。 |
| 完整测试矩阵、验收标准、evidence schema、run artifact schema | `05-测试方案.md` / `06-验收标准.md` | 03 只定义最小测试切口和验证入口,不生成完整证据 schema。 |
| commit 拆分、实施台账、boundary ledger、提交策略 | `07-实施计划.md` | 03 只输出实施承接清单,不写实施 phase / commit 计划。 |
| worker、scheduler、queue、retry、lock、部署参数、运维脚本 | `07-实施计划.md` / 运维手册 | 03 定义 Job / task / progress contract,不固定具体运行机制。 |
| 未确认 Qualification / CapabilityDefinition 独立核心范围 | 回写 `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` 后再进入 03 | 当前不纳入核心范围,不得由详细设计局部补对象、接口或流程。 |
| 强治理前置和强 artifact 核心消费 | 回写 00 / 01 / 02 / 03 对应 Step | 当前按条件型 summary/ref/basis 和正文禁止边界处理,不写成默认前置。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery | historical material;R2.11 / R2.12 审计 | 不作为当前正向范围来源;若有可重定义事实,必须经当前 00/01/02 或新 Step 重新收敛。 |

### 3. 回退规则

| 发现的问题 | 回退位置 | 当前处理口径 |
|---|---|---|
| 需要改写代码主体框架、分层主语或业务主线 | `02-概要设计.md` §4 / Step 4 | 不允许在 `03-详细设计.md` 中暗改主语。 |
| 需要新增、删除或合并主要组成部分 | `02-概要设计.md` §5 / Step 5 | 八组件边界必须先在概要层闭口。 |
| 需要新增关键对象家族或重定义对象 owner | `02-概要设计.md` §6 / Step 6 | 不允许在详细设计阶段私补对象来源。 |
| 需要新增接口族、改写接口 owner 或恢复旧 publish / snapshot / outbox 机制 | `02-概要设计.md` §7 / Step 7 | 接口分类必须先回到概要层重审。 |
| 需要改写主处理流、状态主线或异常红线 | `02-概要设计.md` §8~§10 / Step 8~10 | 不允许用详细设计补口替代概要设计闭口。 |
| 需要让配置绕过边界、越权改写 truth 或恢复旧 plugin / marketplace 前置语义 | `02-概要设计.md` §11 / `04-配置设计.md` | 禁止配置化边界必须保持稳定。 |
| 需要把测试证据、实施 boundary、部署运维机制写入 03 | `05` / `06` / `07` / 运维文档 | 03 只保留最小测试切口和实施承接,不承接完整下游文档职责。 |
| 实现端发现 schema / port / state / mapper / config / evidence 缺口 | 回设计真相源对应 Step | 不允许实现端自行补口或提交私有规则。 |

### 4. 禁止越界清单

| 禁止越界项 | 禁止原因 | 执行口径 |
|---|---|---|
| 把方法资产定义 truth 迁移到 process、identity、runtime、member-images、governance、marketplace、UI 或 artifact | 会破坏 Definition vs Use 和本仓 truth owner。 | 只允许相邻仓通过正式边界引用、消费或摘要承接。 |
| 把流程执行状态、成员状态、治理执行、交易履约、UI 渲染或 artifact 正文作为方法资产成立条件 | 会让外部运行 truth 反向决定本仓定义。 | 只能作为外部背景、summary/ref 或非范围。 |
| 用读取、引用、同步或 runtime 使用隐式触发正式化 | 正式化必须是显式状态和版本语义。 | Step 9 / Step 10 必须保留正式化 guard。 |
| 用 configuration 改变 truth owner、状态机、body-free 禁区或 core / peripheral 边界 | 配置不能改写业务不变量。 | 配置只能影响装配、adapter、profile、transport、job 和降级语义。 |
| 用 Query、Consumer、Publisher 或 Job 改写 owner 或副作用边界 | 会翻转接口职责和事务边界。 | Query no-write;Consumer 不生成 core truth;Publisher failure 不回滚 truth;Job 不修 core truth。 |
| 从旧 03 / 旧 Step 继承 `MethodContent`、publish、snapshot、fingerprint、outbox、delivery、旧 storage/cache/topic | full-restart 下旧 completed 状态失效。 | 只能作为 R2.11 / R2.12 污染审计输入。 |
| 在 Step 2 写对象字段、port 签名、DTO schema、状态迁移、DDL、配置 key、测试 case 或 commit plan | Step 2 只裁决范围和非范围。 | 这些内容分别留给 Step 6~17 或后续正式文档。 |
| 实现端遇缺口自行补 schema / mapper / state / config / evidence | 违反设计真相源闭环与可落码性标准。 | 必须暂停并回设计闭口。 |

### 5. 非范围与 R2.8 覆盖范围一致性检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否排除了 R2.8 已纳入 core 的四主线 | pass | 非范围表不排除 definition、formalization、consumption、trace / consistency。 |
| 是否排除了 support contract 但保留其合法边界 | pass | 关系 / 分发和外部摘要仍在范围内;交易履约和外部正文被排除。 |
| 是否排除了 operation contract | pass | maintenance / refresh / recovery contract 仍在范围内;worker / queue / retry / deployment 被排除。 |
| 是否排除了 peripheral contract | pass | package / method set 有界 contract 仍在范围内;marketplace listing / install / fulfillment 被排除。 |
| 是否把 04 / 05 / 06 / 07 职责写清楚 | pass | 配置、测试、验收、实施和运维内容均有归属。 |
| 是否把历史污染留给后置审计 | pass | 旧主线只进入禁止越界清单,具体差异审计留给 R2.11 / R2.12。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入非范围表 | pass | 已写清非范围及归属层次 / 文档。 |
| 是否写入回退规则 | pass | 已明确需要回退概要、配置、测试、验收、实施或设计真相源的位置。 |
| 是否写入禁止越界清单 | pass | 已覆盖相邻仓 truth、旧材料、接口职责、配置绕界和实现私补。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |
| 是否进入历史差异审计正文 | no | 历史审计留给 R2.11 / R2.12。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.11 历史 Step 2 差异审计:先思考`;只允许设计旧 Step 2 / 旧正式 §2 差异审计方法,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.11 历史 Step 2 差异审计:先思考

### 1. 本模块目标

本模块只设计历史 Step 2 差异审计的方法,不直接写审计结论。历史材料已经在 Step 1、R2.6、R2.10 被降级为 `historical_material` 或 `historical_pollution_candidate`,因此 R2.11 的目标不是从旧文档找可继承范围,而是为 R2.12 准备一套可执行的审计口径。

| 问题 | 本模块判断 |
|---|---|
| 为什么现在审计历史 Step 2? | 防止旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、delivery 等主线在正式 §2 回填时回流。 |
| 审计是否改变 R2.8 / R2.10 已写范围? | 不改变。R2.8 / R2.10 已按当前 00 / 01 / 02 裁决,历史审计只能验证和补充禁入线索。 |
| 是否允许从旧 §2 继承对象或接口? | 不允许。任何旧事实若要保留,必须先映射到当前八组件并在后续 Step 重新定义。 |
| 本模块是否写正式 `03-详细设计.md`? | 不写。正式 §2 的回填策略留给 R2.13 / R2.14。 |

### 2. 需要审计的历史材料

| 历史材料 | 当前用途 | R2.12 审计重点 |
|---|---|---|
| 旧正式 `projects/L3-method-library/03-详细设计.md` §2 | historical material | 找出 P0 / P1、7 类 `MethodContent`、publish、snapshot、fingerprint、outbox 等旧范围语言。 |
| 旧正式 `03-详细设计.md` §1 / §3 / §4 的范围关联语句 | historical material | 查找旧 §2 之外对 P0 主线、存储、bus、snapshot、object storage 的隐含范围扩张。 |
| 当前 Step 1 禁入清单 | 当前真相源 | 作为历史污染判定基线,防止 R2.12 重复争论旧主线。 |
| R2.6 CAND-021 / CAND-028 | historical marker | 核对旧主线是否已全部进入禁入或重定义路径。 |
| R2.8 覆盖范围表 | 当前范围结论 | 用于判断旧事实是否能被当前八组件吸收,或必须排除。 |
| R2.10 非范围表和禁止越界清单 | 当前非范围结论 | 用于判断旧事实归属到非范围、回退规则或后续 Step。 |

旧本文件的更早版本若可从 git 历史或外部备份恢复,只作为补充样本;若无法恢复,不得因此阻塞 R2.12。R2.12 至少必须审计旧正式 `03-详细设计.md` §2 和当前中间产物已标记的历史污染候选。

### 3. 污染扫描方法

R2.12 应按关键词、结构和语义三层扫描旧材料。

| 扫描层 | 扫描项 | 判定口径 |
|---|---|---|
| 关键词扫描 | `P0`、`P1`、`MethodContent`、`Qualification`、`RoleDefinition`、`TaskDefinition`、`WorkProductDefinition`、`ProcessTemplateDef`、`ViewProfile`、`AIPolicyDef` | 出现不等于自动禁入,但不得按旧主语继承。 |
| 发布同步扫描 | `publish`、`published`、`snapshot`、`fingerprint`、`outbox`、`delivery`、`relay`、`replay` | 若表达为核心主链,默认视为旧污染;若当前八组件需要相似能力,必须重新命名和重新闭口。 |
| 存储实现扫描 | PostgreSQL、object storage、cache、topic、worker、lease、checkpoint | 旧实现机制不得进入 Step 2 范围结论;后续若需要,回到对应 Step 或 04 / 07。 |
| 下游边界扫描 | process、work、identity、governance、marketplace、UI、artifact | 检查是否把相邻仓 truth 误写成本仓实现范围。 |
| 结构扫描 | 旧 §2 设计目标、P0 完整展开范围、非范围、P1 后置边界 | 对比当前 R2.8 / R2.10,标记被替换、被排除和需重定义项。 |

### 4. 新旧对比轴

R2.12 的差异表应至少覆盖以下对比轴。

| 对比轴 | 旧口径 | 当前口径 | R2.12 输出 |
|---|---|---|---|
| 范围主语 | P0 方法定义发布同步闭环 | 八组件下的 definition / formalization / consumption / trace-consistency 主线 | 标记旧主语被替换。 |
| 核心对象 | 7 类 `MethodContent` 和 payload | 方法资产定义、目录、版本、消费材料、追溯材料等需后续 Step 重新闭口的对象家族 | 标记不得继承旧对象。 |
| 正式化动作 | publish / published 生命周期 | 正式化与版本语义,具体状态和流转留给 Step 10 | 标记旧 publish 语言禁入或待重命名。 |
| 一致性载体 | snapshot / fingerprint / outbox | trace material、impact summary、audit marker、controlled consumption material 等当前 02 语义 | 标记旧载体不得直接继承。 |
| 外部交互 | bus relay、snapshot export、delivery | 关系 / 分发语义和外部摘要 / 引用的有界 contract | 标记交易、delivery、外部正文非范围。 |
| 实施深度 | 旧 §2 直接承诺完整 P0 可编码契约 | Step 2 只裁决范围;对象、port、DTO、flow、state 等由 Step 6~17 分步闭口 | 标记旧 §2 过度前置内容。 |

### 5. R2.12 应写入什么

R2.12 是“再写入”模块,应把本模块方法落成审计结论,但仍不得修改正式 `03-详细设计.md`。

| 输出块 | 内容要求 | 禁止事项 |
|---|---|---|
| 历史差异审计记录 | 写明已审计旧正式 §2 及关联章节。 | 不把旧文档改回权威输入。 |
| 旧范围禁入表 | 列出旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、delivery 等禁入项。 | 不重新争论当前 R2.8 / R2.10 范围结论。 |
| 可重定义线索表 | 仅列可能被当前八组件重新吸收的语义线索及后续 Step 归属。 | 不直接写对象字段、port 签名或 DTO schema。 |
| 旧到新替换摘要 | 说明旧主线如何被当前八组件和 core / support / operation / peripheral 深度替代。 | 不修改正式 §2。 |
| 下一门禁 | 推进到 R2.13 回填草稿:先思考。 | 不进入 Step 3。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只设计历史审计方法 | pass | 当前未写历史审计结论。 |
| 是否列出历史材料 | pass | 已列旧正式 §2、关联章节、Step 1、R2.6、R2.8、R2.10。 |
| 是否设计污染扫描方法 | pass | 已按关键词、结构和语义三层设计。 |
| 是否定义新旧对比轴 | pass | 已覆盖范围主语、核心对象、正式化动作、一致性载体、外部交互和实施深度。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.12 历史 Step 2 差异审计:再写入`;只允许写入旧范围禁入表、可重定义线索表、旧到新替换摘要和下一门禁,不得修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.12 历史 Step 2 差异审计:再写入

### 1. 审计记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.12 历史 Step 2 差异审计:再写入` |
| 上一模块 | `R2.11 历史 Step 2 差异审计:先思考` |
| 用户确认 | 已确认进入 `R2.12` |
| 已审计历史材料 | 旧正式 `03-详细设计.md` §2,并抽查 §1、§3、§4 中与 §2 范围相关的旧主线语言。 |
| 本模块允许写入 | 旧范围禁入表、可重定义线索表、旧到新替换摘要、一致性检查和下一门禁 |
| 本模块禁止写入 | 正式 `03-详细设计.md` §2、对象字段、port 签名、DTO schema、状态迁移、持久化结构、配置 key、测试用例、实施 commit、Step 3 内容 |
| 下一模块 | `R2.13 回填草稿:先思考` |

本模块结论:旧正式 §2 的范围主语、核心对象、正式化动作和一致性载体均与当前 `00/01/02` 和 R2.8 / R2.10 冲突。旧 §2 只能作为污染审计材料,不得作为本轮详细设计范围来源。

### 2. 旧范围禁入表

| 旧范围项 | 旧文档口径 | 当前处理 | 禁入原因 |
|---|---|---|---|
| P0 方法定义发布同步闭环 | 旧 §2 将详细设计目标定义为 P0 发布同步闭环。 | 禁止作为当前范围主语。 | 当前 02 已改为八组件:定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、外部摘要、后台维护、外围组织。 |
| 7 类 P0 `MethodContent` | 旧 §2 要完整展开 7 类 `MethodContent`、payload、validation、生命周期和协议。 | 禁止继承为核心对象。 | 当前 02 明确禁止恢复旧 `MethodContent` 总对象,对象家族需按八组件在 Step 6 重新闭口。 |
| `MethodContent` 生命周期 | 旧 §2 使用 draft / in_review / published / deprecated / retired / superseded。 | 禁止继承状态机。 | 当前正式化与版本需重新定义 `FormalizationState`、`FormalMethodAssetVersion` 等状态,不能用旧 publish lifecycle 代替。 |
| publish / published / `PublishMethodContent` | 旧 §2 把发布治理、gate ref、publish command 作为核心写路径。 | 禁止作为当前正式化动作。 | 当前正式化不以 publish 为主语;治理依据只可作为 summary/ref/basis,不迁入治理执行。 |
| fingerprint | 旧 §2 把 fingerprint 作为版本和一致性基础。 | 禁止作为当前版本或一致性中心。 | 当前版本语义、trace material、impact summary、protection decision 需重新定义,不得以 fingerprint 替代。 |
| snapshot / `DefinitionSnapshot` | 旧 §2 把 snapshot schema、payload、export 作为下游同步基础。 | 禁止作为当前受控消费材料。 | 当前受控消费只可使用 consumption material / availability view / body-free summary,不恢复 snapshot 包体。 |
| outbox / delivery / relay | 旧 §2 把 outbox、delivery、bus relay 作为发布同步闭环基础。 | 禁止继承旧机制。 | 当前 Outbound Event 只可按 Step 8 重新定义 event candidate;Step 2 不承诺 outbox 机制。 |
| object storage / blob / topic / cache 等旧实现机制 | 旧 §2 及关联章节把 snapshot payload、bus topic、cache、worker 等写入范围语义。 | 禁止作为 Step 2 范围结论。 | 具体 adapter、配置、部署、worker / retry / queue 应归 Step 7 / 14 / 07 或运维,不得在范围阶段前置。 |
| P1 Plugin / MethodConfiguration 旧边界 | 旧 §2 以 P1 后置边界表达 plugin / configuration。 | 禁止按旧 P1 结构继承。 | 当前外围包、方法集组织和 marketplace context 是 peripheral contract,不等于旧 P1 plugin 主线。 |
| 下游 Use truth / WorkItem 模板消费旧判断 | 旧 §2 保留 TaskDefinition 到 work 直接消费待确认。 | 禁止进入当前正向范围。 | 当前 Definition vs Use 分离已重建;下游运行 truth、work direct consumption 必须回对应仓或上游文档。 |

### 3. 可重定义线索表

旧材料中仍可能包含可被当前八组件吸收的语义线索,但只能在后续 Step 使用当前命名、当前 owner、当前对象来源重新闭口。

| 旧线索 | 可重定义方向 | 后续 Step 归属 | 限制 |
|---|---|---|---|
| 旧 definition 类资产 | 方法资产定义与目录的 definition truth、catalog entry、typed ref。 | Step 4~6、Step 11 | 不保留 `MethodContent` 总对象和 7 类 payload 主线。 |
| 旧 publish gate / approved gate 语义 | 正式化 basis summary、governance basis ref 或 safe marker。 | Step 6~10、Step 12 | 不执行治理流程,不把 gate enforce 写入本仓。 |
| 旧 version / supersede / retire 线索 | Formal version、semantic change、replacement / retirement history。 | Step 6、Step 9~13 | 不使用 published lifecycle 作为状态机。 |
| 旧 snapshot 下游消费意图 | Controlled consumption material、availability view、distribution read material。 | Step 6~9、Step 11~13 | 不保存 snapshot payload、blob、正文或外部包体。 |
| 旧 trace / query / resolve view 意图 | Trace material、impact summary、read surface、body-free query view。 | Step 6~9、Step 12、Step 15 | Query 不写库,不修复材料,不返回 raw log / payload。 |
| 旧 outbox 事件传播意图 | Outbound Event candidate 和 event public contract。 | Step 8、Step 9、Step 11~13 | 不默认使用 outbox 机制;不得把 bus relay 写成 Step 2 范围承诺。 |
| 旧 operations job 意图 | Maintenance request、refresh task、recovery task、progress view。 | Step 6、Step 8~13、Step 15~16 | Job 只刷新派生材料和 progress,不修 core truth。 |
| 旧 P1 plugin / configuration 外围意图 | Method package、method set assembly、peripheral discovery context。 | Step 5~9、Step 14、Step 17 | 不实现 marketplace listing / install / fulfillment,不阻塞 core。 |

### 4. 旧到新替换摘要

| 旧主线 | 当前替换主线 | 当前范围深度 |
|---|---|---|
| P0 方法定义发布同步闭环 | 八组件分层详细设计主线 | core / support / operation / peripheral 分层闭口。 |
| `MethodContent` 统一聚合 | 方法资产定义与目录 + 正式化与版本 + 受控消费 + 追溯一致性等对象家族 | Step 6 逐模块定义对象,不得提前合并成总对象。 |
| publish lifecycle | 正式化状态、正式版本和版本语义变化 | Step 10 定义状态矩阵,Step 13 定义幂等与重入。 |
| snapshot / fingerprint | consumption material、trace material、impact summary、basis summary、freshness / degradation marker | Step 6~13 按来源和 owner 分别闭口。 |
| outbox / delivery | Outbound Event protocol candidate + adapter / consistency contract | Step 8 / Step 11 后置定义,不在 Step 2 承诺机制。 |
| P1 plugin / configuration | 外围包与方法集组织的有界 peripheral contract | 不作为 core 前置,不承接 marketplace 交易。 |
| worker / relay / replay 实现机制 | 后台维护与收敛的 operation contract | 03 定义 job shell 和 progress,07 / 运维处理调度和部署。 |

### 5. 与 R2.8 / R2.10 的一致性检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否改变 R2.8 已裁决范围 | no | R2.12 只验证旧范围不能回流,不改写八组件覆盖范围。 |
| 是否改变 R2.10 非范围 | no | 旧主线已归入历史污染非范围和禁止越界清单。 |
| 是否保留必要语义线索 | pass | 旧 definition、版本、消费、事件、job 等只作为可重定义线索,不作为可继承对象。 |
| 是否避免正式文档改动 | pass | 正式 `03-详细设计.md` 未在本模块修改。 |
| 是否仍停留在 Step 2 | pass | 下一步是 R2.13 回填草稿:先思考,不是 Step 3。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入历史差异审计记录 | pass | 已记录审计材料、允许 / 禁止写入范围和下一模块。 |
| 是否写入旧范围禁入表 | pass | 已覆盖旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、delivery 和旧实现机制。 |
| 是否写入可重定义线索表 | pass | 已把可吸收语义分派到后续 Step,并保留限制。 |
| 是否写入旧到新替换摘要 | pass | 已说明旧主线如何被当前八组件和分层深度替代。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.13 回填草稿:先思考`;只允许设计正式 `03-详细设计.md` §2 的回填策略,不得直接修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.13 回填草稿:先思考

### 1. 本模块目标

本模块只设计正式 `03-详细设计.md` §2 的回填策略,不直接修改正式文件。R2.14 才写入可回填草稿,且仍先停留在中间产物内;正式文件修改需要后续明确回填动作或 Step 19 装配。

| 问题 | 本模块判断 |
|---|---|
| §2 应从哪里来? | 只能从 R2.8 范围裁决、R2.10 非范围裁决、R2.12 历史差异审计和当前正式 `00/01/02` 压缩而来。 |
| §2 是否保留旧 P0 / MethodContent 语言? | 不保留。旧语言只可作为禁入说明或历史污染审计结果。 |
| §2 是否展开对象、port、DTO、状态、持久化? | 不展开。§2 只写目标、覆盖范围、展开深度、非范围和回退规则。 |
| R2.13 是否改正式 `03-详细设计.md`? | 不改。当前只设计草稿结构和来源映射。 |

### 2. 正式 §2 建议结构

正式 §2 应比中间产物更短,但必须能让实现者和后续 Step 清楚知道本轮 03 的范围边界。

| 正式小节 | 来源 | 内容策略 |
|---|---|---|
| `2.1 设计目标` | R2.8 设计目标表 | 压缩为 8~9 条目标,覆盖八组件和横切契约,避免旧 P0 语言。 |
| `2.2 覆盖范围与展开深度` | R2.8 覆盖范围表 / 展开深度表 | 合并为一张表,按 core / support / operation / peripheral / cross-cutting 表达。 |
| `2.3 非范围` | R2.10 非范围表 | 写清非范围及归属文档,保留相邻仓 truth、04/05/06/07、运维和历史污染。 |
| `2.4 历史范围替换口径` | R2.12 旧范围禁入表 / 替换摘要 | 简短说明旧 P0 / MethodContent / publish / snapshot / fingerprint / outbox 不再作为范围来源。 |
| `2.5 回退与后续承接` | R2.10 回退规则 / R2.8 后续 Step 落点 | 写清发现概要主语、对象、接口、状态、配置、测试、实施缺口时回退位置。 |

### 3. 来源压缩规则

| 来源 | 进入正式 §2 的方式 | 压缩规则 |
|---|---|---|
| R2.8 设计目标表 | 进入 `2.1` | 保留目标和交付结果,删除中间讨论口吻。 |
| R2.8 覆盖范围表 | 进入 `2.2` | 保留覆盖范围、层级、后续 Step 落点,合并重复表述。 |
| R2.8 实现者代码范围表 | 进入 `2.2` 或 `2.5` | 只保留“实现者不得自行补口”的范围红线。 |
| R2.10 非范围表 | 进入 `2.3` | 保留非范围、归属层 / 文档、当前处理口径;删除过程性检查。 |
| R2.10 回退规则 | 进入 `2.5` | 压缩为回退规则表,避免展开到对象字段或配置 key。 |
| R2.12 旧范围禁入表 | 进入 `2.4` | 只列旧主线禁入和替换关系,不重复完整审计记录。 |
| 当前正式 `02-概要设计.md` §4~§13 | 作为全段一致性基线 | 若中间产物与正式 02 冲突,以正式 02 为准并暂停修中间产物。 |

### 4. §2 写作红线

| 红线 | 说明 |
|---|---|
| 不使用 P0 / P1 作为本轮范围主轴 | 当前使用 core / support / operation / peripheral / cross-cutting。 |
| 不恢复 `MethodContent` 总对象 | 对象家族留给 Step 6 按八组件重新定义。 |
| 不恢复 publish / snapshot / fingerprint / outbox 主线 | 类似语义必须以正式化、版本、消费材料、追溯材料、event candidate 等当前主语重写。 |
| 不写对象字段、trait 签名、DTO schema、状态迁移、DDL、配置 key、测试 case、commit plan | 这些内容分别属于 Step 6~17 或后续 04~07。 |
| 不让非范围吞掉已纳入覆盖范围的 support / operation / peripheral contract | 交易履约、正文、部署机制排除;有界 contract 仍保留。 |
| 不让实现端自行补口 | schema / port / mapper / state / config / evidence 缺口必须回设计闭口。 |

### 5. R2.14 应写入什么

R2.14 应写入正式 §2 的中间产物草稿,不是直接改正式文件。

| 草稿块 | 内容要求 | 禁止事项 |
|---|---|---|
| `2.1 设计目标` 草稿 | 用当前八组件和横切契约重写目标表。 | 不出现旧 P0 发布同步主语。 |
| `2.2 覆盖范围与展开深度` 草稿 | 写 core / support / operation / peripheral / cross-cutting 表。 | 不写对象字段或接口签名。 |
| `2.3 非范围` 草稿 | 写非范围归属和处理口径。 | 不排除已纳入 support / operation / peripheral 的有界 contract。 |
| `2.4 历史范围替换口径` 草稿 | 写旧主线禁入和当前替换关系。 | 不把旧文档恢复为权威输入。 |
| `2.5 回退与后续承接` 草稿 | 写回退规则和后续 Step 分派。 | 不进入 Step 3。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只设计回填策略 | pass | 当前未写正式 §2 草稿。 |
| 是否明确正式 §2 结构 | pass | 已设计 2.1~2.5。 |
| 是否明确来源压缩规则 | pass | 已把 R2.8 / R2.10 / R2.12 映射到正式小节。 |
| 是否列出写作红线 | pass | 已覆盖旧主线、对象 / port / DTO / 状态等越界内容。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.14 回填草稿:再写入`;只允许写入正式 `03-详细设计.md` §2 的中间产物草稿,不得直接修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.14 回填草稿:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.14 回填草稿:再写入` |
| 上一模块 | `R2.13 回填草稿:先思考` |
| 用户确认 | 已确认进入 `R2.14` |
| 本模块允许写入 | 正式 `03-详细设计.md` §2 的中间产物草稿、来源说明、自检和下一门禁 |
| 本模块禁止写入 | 直接修改正式 `03-详细设计.md`、进入 Step 3、对象字段、port 签名、DTO schema、状态迁移、持久化结构、配置 key、测试用例、实施 commit |
| 下一模块 | `R2.15 自检与停审:先思考` |

以下草稿只作为正式 §2 的可回填中间产物。是否写入正式 `03-详细设计.md` 由后续明确回填动作或 Step 19 装配控制。

### 2. §2 可回填草稿

```markdown
## 2. 本次详细设计目标与范围

### 2.1 设计目标

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 建立方法资产定义与目录核心契约 | 将方法资产定义 truth、稳定 typed ref、目录条目、目录读取材料和定义边界补成可实现契约。 | 实现者可实现 definition / catalog 相关对象、service、repository / read port、query surface 和一致性检查。 |
| 建立正式化与版本核心契约 | 将正式化状态、正式版本、资格判断、依据摘要、版本语义变化和替代 / 退役边界补成可实现契约。 | 实现者可实现 formalization / version command、query、state guard、history / lineage、并发和幂等保护。 |
| 建立受控消费核心契约 | 将 consumption material、availability view、downstream boundary、Definition vs Use guard 和消费上下文补成可实现契约。 | 实现者可实现消费材料准备、可用性读取、边界拒绝、下游只读消费面和越界记录。 |
| 建立追溯与一致性保护核心契约 | 将 trace material、impact summary、audit trail、evidence lineage、protection decision 和一致性保护边界补成可实现契约。 | 实现者可实现 trace / impact / audit / lineage 对象、处理流、状态、safe failure 和最小验证切口。 |
| 建立关系与分发语义支撑契约 | 将 method relation、distribution context/ref、integrity rule 和 distribution material 补成支撑契约。 | 实现者可实现 relation / distribution command、query、integrity diagnostic、read material 和 event candidate,不实现 marketplace 交易。 |
| 建立外部摘要与引用支撑契约 | 将 external summary、external source ref、artifact archive ref、governance basis ref、body-free boundary 和引用有效性补成支撑契约。 | 实现者可实现 external intake / command / query、body-free validation、safe ref 保存和 unavailable / stale / rejected 错误面。 |
| 建立后台维护与收敛操作契约 | 将 read material refresh、trace refresh、consistency recovery、maintenance run、progress view 和 freshness 语义补成操作契约。 | 实现者可实现 job shell、task object、progress view、refresh result 和 recovery safe summary,不固定 worker / queue / retry。 |
| 建立外围包与方法集组织有界契约 | 将 method package、method set assembly、composition rule、peripheral view 和 marketplace context ref 限定在不阻塞 core 的外围范围内。 | 实现者可实现 package / method set 对象、composition diagnostic、peripheral query 和刷新边界,不实现 listing / install / fulfillment。 |
| 建立横切协议、状态、错误、配置和观测契约 | 将 Command / Query / Inbound / Outbound / Job 协议族、状态族、safe failure、typed config boundary、审计和观测位置补成可落码约束。 | 实现者可按后续 Step 获取 request / response / rejection / event / job report、状态矩阵、错误类型、config validator 和测试切口。 |

### 2.2 覆盖范围与展开深度

| 层级 | 覆盖范围 | 展开深度 | 后续 Step 落点 |
|---|---|---|---|
| core | 方法资产定义与目录 | 对象、typed ref、catalog truth、read material、command / query、flow、state、persistence、error、test cut 全链闭口。 | Step 4~13、Step 16 |
| core | 正式化与版本 | formalization state、formal version、basis summary、eligibility、version transition、history / lineage、幂等和并发保护全链闭口。 | Step 5~13、Step 16 |
| core | 受控消费 | consumption material、availability、boundary、guard、context、Definition / Use violation 和下游只读边界全链闭口。 | Step 5~13、Step 16 |
| core | 追溯与一致性保护 | trace、impact、audit、evidence lineage、protection decision、safe failure 和 observability 全链闭口。 | Step 5~16 |
| support | 关系与分发语义 | relation / distribution 对象、完整性诊断、读取材料、事件候选和错误面正式闭口。 | Step 5~13、Step 16 |
| support | 外部摘要与引用 | external summary/ref、artifact archive ref、governance basis ref、body-free boundary、引用有效性和 unavailable / stale / rejected 语义正式闭口。 | Step 5~14、Step 16 |
| operation | 后台维护与收敛 | request、task、run、progress、refresh result、recovery summary、freshness / degradation 和 job report 正式闭口。 | Step 5~16 |
| peripheral | 外围包与方法集组织 | package、method set、composition、peripheral view、discovery context ref 和外围刷新边界有界闭口。 | Step 5~17 |
| cross-cutting | 协议、状态、错误、配置、观测、测试切口 | 横向覆盖八组件,确保实现者不需要猜 DTO、状态、错误、config boundary 或最小测试入口。 | Step 3、Step 7~16 |

实现端拿到本文后,应能实现 contracts、domain、application service、ports、adapter boundary、Command / Query / Consumer / Event / Job shell、safe error、state guard、persistence contract 和最小测试切口。若发现 schema、port、DTO、mapper、state、config 或 evidence 口径缺失,必须暂停回设计闭口,不得自行补口。

### 2.3 非范围

| 非范围 | 留给哪一层 / 哪份文档 | 当前处理口径 |
|---|---|---|
| 流程执行、ProcessInstance、runtime orchestration | `L1-process` / `L2-runtime` | 本仓只定义方法资产和受控消费边界,不拥有运行实例、活动状态或 runtime 编排。 |
| 成员身份、成员生命周期、成员实际角色状态 | `L1-identity` / 成员相关仓 | 本仓可定义角色等方法语义,不保存成员具备何种角色或资格的状态 truth。 |
| 治理裁决、Gate 执行、policy enforce | `L1-governance` / runtime | 本仓只承接治理结论摘要、basis ref 或 safe marker,不得迁入治理执行过程。 |
| 外部工具、MCP / A2A / provider 注册和访问裁决 | `L3-capability-hub` / 治理协作边界 | 方法资产定义与外部能力注册职责分离,本仓不管理 provider 接入。 |
| marketplace 定价、订单、购买、结算、安装、履约 | `L6-marketplace` | 本仓只保留分发语义、peripheral context ref 或方法资产来源边界,不承接交易 truth。 |
| UI 页面渲染、会话、组件状态、交互执行 | `L5-console` / 体验层 | 本仓只定义可被消费的视图策略或读取语义,不实现 UI runtime。 |
| artifact、archive、证据文件或外部文档正文生命周期 | `L1-artifact` / archive / 外部系统 | 本仓只保存 summary/ref/marker/digest hint,不保存正文、文件、archive 包体或证据正文。 |
| 认证登录、权限系统、操作主体鉴权实现 | 身份 / 安全 / 治理平台层 | 03 可定义 ActorContext / subject boundary,但不实现认证、授权和权限矩阵。 |
| 完整配置 key、env、profile、secret、部署挂载和示例 | `04-配置设计.md` / 运维 | 03 只定义 typed config / runtime contract、config validator 和禁止配置化边界。 |
| 完整测试矩阵、验收标准、evidence schema、run artifact schema | `05-测试方案.md` / `06-验收标准.md` | 03 只定义最小测试切口和验证入口,不生成完整证据 schema。 |
| commit 拆分、实施台账、boundary ledger、提交策略 | `07-实施计划.md` | 03 只输出实施承接清单,不写实施 phase / commit 计划。 |
| worker、scheduler、queue、retry、lock、部署参数、运维脚本 | `07-实施计划.md` / 运维手册 | 03 定义 Job / task / progress contract,不固定具体运行机制。 |
| 未确认 Qualification / CapabilityDefinition 独立核心范围 | 回写 `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` 后再进入 03 | 当前不纳入核心范围,不得由详细设计局部补对象、接口或流程。 |
| 强治理前置和强 artifact 核心消费 | 回写 00 / 01 / 02 / 03 对应 Step | 当前按条件型 summary/ref/basis 和正文禁止边界处理,不写成默认前置。 |

### 2.4 历史范围替换口径

当前 `03-详细设计.md` 为 full-restart。旧 `03-详细设计.md` 和旧 `03_ddd_*` 中的 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、delivery、旧 storage/cache/topic 等主线不得作为本轮范围来源。

| 旧主线 | 当前替换口径 |
|---|---|
| P0 方法定义发布同步闭环 | 八组件分层详细设计主线。 |
| `MethodContent` 统一聚合 | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护等对象家族在后续 Step 重新闭口。 |
| publish lifecycle | 正式化状态、正式版本和版本语义变化。 |
| snapshot / fingerprint | consumption material、trace material、impact summary、basis summary、freshness / degradation marker。 |
| outbox / delivery | Outbound Event protocol candidate、adapter boundary 和一致性 contract,不在 Step 2 承诺具体机制。 |
| P1 plugin / configuration | 外围包与方法集组织的有界 peripheral contract。 |
| worker / relay / replay 实现机制 | 后台维护与收敛的 operation contract;调度、部署、重试归 `07-实施计划.md` 或运维文档。 |

### 2.5 回退与后续承接

| 发现的问题 | 回退位置 | 当前处理口径 |
|---|---|---|
| 需要改写代码主体框架、分层主语或业务主线 | `02-概要设计.md` §4 / Step 4 | 不允许在 `03-详细设计.md` 中暗改主语。 |
| 需要新增、删除或合并主要组成部分 | `02-概要设计.md` §5 / Step 5 | 八组件边界必须先在概要层闭口。 |
| 需要新增关键对象家族或重定义对象 owner | `02-概要设计.md` §6 / Step 6 | 不允许在详细设计阶段私补对象来源。 |
| 需要新增接口族、改写接口 owner 或恢复旧 publish / snapshot / outbox 机制 | `02-概要设计.md` §7 / Step 7 | 接口分类必须先回到概要层重审。 |
| 需要改写主处理流、状态主线或异常红线 | `02-概要设计.md` §8~§10 / Step 8~10 | 不允许用详细设计补口替代概要设计闭口。 |
| 需要让配置绕过边界、越权改写 truth 或恢复旧 plugin / marketplace 前置语义 | `02-概要设计.md` §11 / `04-配置设计.md` | 禁止配置化边界必须保持稳定。 |
| 需要把测试证据、实施 boundary、部署运维机制写入 03 | `05` / `06` / `07` / 运维文档 | 03 只保留最小测试切口和实施承接,不承接完整下游文档职责。 |
| 实现端发现 schema / port / state / mapper / config / evidence 缺口 | 回设计真相源对应 Step | 不允许实现端自行补口或提交私有规则。 |
```

### 3. 草稿来源说明

| 草稿小节 | 来源 | 说明 |
|---|---|---|
| `2.1 设计目标` | R2.8 设计目标表 | 压缩目标和交付结果,删除中间讨论语言。 |
| `2.2 覆盖范围与展开深度` | R2.8 覆盖范围表、展开深度表、实现者代码范围表 | 合并范围、层级、后续 Step 落点和实现端补口红线。 |
| `2.3 非范围` | R2.10 非范围表 | 保留非范围、归属层 / 文档和当前处理口径。 |
| `2.4 历史范围替换口径` | R2.12 旧范围禁入表、旧到新替换摘要 | 只写旧主线禁入和替换关系。 |
| `2.5 回退与后续承接` | R2.10 回退规则 | 压缩为回退位置和处理口径。 |

### 4. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入 §2 中间产物草稿 | pass | 已写入 2.1~2.5 可回填草稿。 |
| 是否避免旧 P0 / MethodContent 主线回流 | pass | 草稿只在历史替换口径中提到旧主线禁入。 |
| 是否未写对象字段、port、DTO、状态、DDL、配置 key、测试 case 或 commit plan | pass | 草稿只裁决范围、非范围、历史替换和回退。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.15 自检与停审:先思考`;只允许思考 Step 2 自检清单和关闭条件,不得直接修改正式 `03-详细设计.md`,不得进入 Step 3。

---

## R2.15 自检与停审:先思考

### 1. 本模块目标

本模块只思考 Step 2 的自检清单和关闭条件,不直接关闭 Step 2,不更新到 Step 3 等待状态。Step 2 是否完成,必须在 R2.16 写入停审记录后再由 flow / 台账同步。

| 问题 | 本模块判断 |
|---|---|
| Step 2 是否已经具备关闭候选? | 是。R2.8 已裁决范围,R2.10 已裁决非范围,R2.12 已完成历史污染审计,R2.14 已写 §2 可回填草稿。 |
| 是否现在就关闭 Step 2? | 不关闭。当前是先思考,R2.16 才写正式停审记录。 |
| 是否可以进入 Step 3? | 当前不能。必须等 R2.16 完成并同步 flow / 台账。 |
| 是否需要修改正式 `03-详细设计.md` 才能关闭 Step 2? | 不需要。正式回填可由后续明确回填动作或 Step 19 装配控制。 |

### 2. Step 2 自检维度

| 自检维度 | 检查内容 | 当前预判 |
|---|---|---|
| 输入边界 | 是否基于当前正式 `00/01/02` 和 Step 1,未继承旧 03。 | 预判 pass。 |
| 范围裁决 | 是否回答本轮必须覆盖哪些模块、对象 / 接口 / 事件 / job / 状态机范围。 | 预判 pass。 |
| 非范围裁决 | 是否写清非范围、归属层 / 文档和禁止越界项。 | 预判 pass。 |
| 历史材料审计 | 是否明确旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、delivery 禁入。 | 预判 pass。 |
| 回填草稿 | 是否生成正式 §2 可回填草稿,且未直接修改正式文件。 | 预判 pass。 |
| 后续 Step 分派 | 是否明确对象、port、protocol、flow、state、persistence、error、config、observability、test、handoff 的后续落点。 | 预判 pass。 |
| 可落码红线 | 是否明确实现端不得自行补 schema / port / DTO / mapper / state / config / evidence。 | 预判 pass。 |
| Step 3 进入条件 | 是否具备进入 runtime / 编码规范 / 仓库约束讨论的范围边界。 | 预判 pass,需 R2.16 正式确认。 |

### 3. R2.16 应写入的停审结构

| 输出块 | 内容要求 | 禁止事项 |
|---|---|---|
| Step 2 完成记录 | 写明 R2.1~R2.16 完成状态和当前 §2 草稿位置。 | 不新增范围结论。 |
| 自检结果表 | 将 R2.15 自检维度落成 pass / no / follow-up。 | 不把未讨论内容伪装为已闭口。 |
| 后续 Step 进入条件 | 确认 Step 3 只讨论编码规范、runtime、仓库约束,不得回头改范围。 | 不进入 Step 3 正文。 |
| 未关闭事项分派 | 只列后续 Step 需要承接的风险和回退规则。 | 不在 Step 2 补对象 / port / DTO。 |
| flow / 台账同步 | 将 Step 2 标记 completed,下一动作推进到 Step 3 `R3.1` 等待用户确认。 | 不自动执行 R3.1。 |

### 4. 进入 Step 3 的候选条件

R2.16 若确认以下条件均满足,即可把 flow / 台账推进到 Step 3 等待状态。

| 条件 | 判断口径 |
|---|---|
| 当前范围主语已稳定 | 八组件和 core / support / operation / peripheral / cross-cutting 分层稳定。 |
| 非范围不冲突 | 非范围没有排除 R2.8 已纳入的有界 support / operation / peripheral contract。 |
| 历史污染已隔离 | 旧 P0 / MethodContent / publish / snapshot / fingerprint / outbox 只作为禁入和可重定义线索。 |
| 回填草稿足以装配正式 §2 | 草稿覆盖目标、范围、非范围、历史替换和回退承接。 |
| 后续 Step 有明确职责 | Step 3 进入 runtime / 编码规范 / 仓库约束;Step 4~17 才展开具体实现契约。 |

### 5. R2.16 不得做什么

| 禁止事项 | 理由 |
|---|---|
| 不得新增范围或非范围结论 | R2.8 / R2.10 / R2.12 / R2.14 已形成 Step 2 主体。 |
| 不得直接修改正式 `03-详细设计.md` | 当前流程仍在中间产物停审。 |
| 不得进入 Step 3 正文 | R2.16 只关闭 Step 2 并更新下一动作。 |
| 不得写对象字段、port 签名、DTO schema、状态迁移、DDL、配置 key、测试 case 或 commit plan | 后续 Step 和后续文档各有职责。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只思考自检和关闭条件 | pass | 当前未关闭 Step 2。 |
| 是否列出 Step 2 自检维度 | pass | 已列输入、范围、非范围、历史审计、回填草稿、分派和可落码红线。 |
| 是否设计 R2.16 停审结构 | pass | 已说明 R2.16 应写入完成记录、自检结果、进入条件、未关闭事项和台账同步。 |
| 是否修改正式 `03-详细设计.md` | no | 当前只写中间产物。 |
| 是否进入 Step 3 | no | 当前仍停在 Step 2。 |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.16 自检与停审:再写入`;只允许写入 Step 2 完成记录、自检结果、进入 Step 3 条件、未关闭事项分派和 flow / 台账同步,不得直接修改正式 `03-详细设计.md`,不得进入 Step 3 正文。

---

## R2.16 自检与停审:再写入

### 1. Step 2 完成记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确本轮实现范围和非范围 |
| 当前模块 | `R2.16 自检与停审:再写入` |
| 上一模块 | `R2.15 自检与停审:先思考` |
| 用户确认 | 已确认进入 `R2.16` |
| 已完成模块 | `R2.1`~`R2.16` |
| §2 中间产物草稿 | 本文件 `R2.14 回填草稿:再写入` |
| 正式 `03-详细设计.md` | 未修改;正式回填由后续明确回填动作或 Step 19 装配控制。 |
| 下一动作 | 等待用户确认进入 Step 3 `R3.1 开工与必读文档:先思考` |

Step 2 已完成本轮范围与非范围裁决。当前可以进入 Step 3 的开工讨论,但不得把旧 `03_ddd_step_03_runtime_constraints.md` 的 completed 状态视为当前结论。下一步 `R3.1` 必须先重置 Step 3 输入边界和必读文档,再按 full-restart 流程重建 Step 3。

### 2. 自检结果表

| 自检维度 | 结果 | 说明 |
|---|---|---|
| 输入边界 | pass | Step 2 基于当前正式 `00/01/02` 和 Step 1,未继承旧 03 结论。 |
| 范围裁决 | pass | R2.8 已回答本轮必须覆盖的八组件、对象 / 接口 / 事件 / job / 状态机范围和实现者代码范围。 |
| 非范围裁决 | pass | R2.10 已写清非范围、归属层 / 文档、回退规则和禁止越界项。 |
| 历史材料审计 | pass | R2.12 已明确旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、delivery 禁入。 |
| 回填草稿 | pass | R2.14 已生成正式 §2 可回填草稿,且未直接修改正式 `03-详细设计.md`。 |
| 后续 Step 分派 | pass | Step 4~17 的对象、port、protocol、flow、state、persistence、error、config、observability、test、handoff 责任已在范围表中分派。 |
| 可落码红线 | pass | 已明确实现端不得自行补 schema / port / DTO / mapper / state / config / evidence。 |
| Step 3 进入条件 | pass | Step 3 可以开始讨论编码规范、语言 / runtime、仓库约束,但不得回头改写 Step 2 范围。 |

### 3. 未关闭事项分派

| 事项 | 分派位置 | 处理口径 |
|---|---|---|
| 正式 `03-详细设计.md` §2 尚未替换旧正文 | 后续明确回填动作或 Step 19 | 当前已有中间产物草稿,不在 R2.16 直接改正式文件。 |
| 旧 `03_ddd_step_03_runtime_constraints.md` 仍含旧 P0 / MethodContent 口径 | Step 3 `R3.1` | 下一步必须视为 historical material,不得继承旧 completed 状态。 |
| runtime / framework / workspace / repository 约束尚未按新 02 重审 | Step 3 | 只能在 Step 3 讨论,不得在 Step 2 补写。 |
| module layout / object / port / protocol / flow / state 等实现契约未展开 | Step 4~13 | 后续按模块 / capability 小循环逐步闭口。 |
| config / observability / test / implementation handoff 未展开 | Step 14~17 | 后续 Step 分别处理,不得在 Step 2 预先补口。 |
| 风险和待确认事项最终归档 | Step 18 | 当前只保留影响范围和回退规则。 |

### 4. 进入 Step 3 条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 当前范围主语已稳定 | pass | 八组件和 core / support / operation / peripheral / cross-cutting 分层稳定。 |
| 非范围不冲突 | pass | 非范围没有排除 R2.8 已纳入的有界 support / operation / peripheral contract。 |
| 历史污染已隔离 | pass | 旧 P0 / MethodContent / publish / snapshot / fingerprint / outbox 只作为禁入和可重定义线索。 |
| 回填草稿足以装配正式 §2 | pass | 草稿覆盖目标、范围、非范围、历史替换和回退承接。 |
| 后续 Step 有明确职责 | pass | Step 3 进入 runtime / 编码规范 / 仓库约束;Step 4~17 才展开具体实现契约。 |

### 5. 停审结论

Step 2 `明确本轮实现范围和非范围` completed。

下一步只允许在用户确认后进入 Step 3 `R3.1 开工与必读文档:先思考`。`R3.1` 必须先处理现有 Step 3 文件的历史污染和旧 completed 状态,不得直接续写旧 Step 3 正文,不得修改正式 `03-详细设计.md`。

next_allowed_action: 等待用户确认后进入 Step 3 `R3.1 开工与必读文档:先思考`;只允许重建 Step 3 开工、必读文档、输入边界、历史 Step 3 处理规则和 Step 内模块顺序,不得直接修改正式 `03-详细设计.md`,不得进入 Step 4。
