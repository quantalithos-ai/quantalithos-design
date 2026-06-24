# Step 1. 确认概要设计输入边界

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 1
> 回填章节: `projects/L3-method-library/03-详细设计.md` §1 与上游文档的关系声明 / §17 风险与待确认事项
> 创建日期: 2026-06-21
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: `R1.14 自检与停审:再写入`
> 当前门禁: Step 1 completed;等待用户确认进入 Step 2 `R2.1 开工与必读文档:先思考`

---

## R1.1 开工与必读文档:先思考

### 1. 本模块要回答的问题

本轮 `03-详细设计.md` 不是续写旧详细设计,而是基于已完成的 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md` 全量重启。

本模块只回答以下问题:

| 问题 | 本轮判断 |
|---|---|
| Step 1 的工作对象是什么? | 确认当前 `03-详细设计.md` 的上游输入、历史材料隔离口径、Step 1 模块顺序和后续门禁。 |
| Step 1 是否可以直接改正式 `03-详细设计.md`? | 不可以。本模块只做开工思考和边界固定,正式文档后置到对应回填模块或 Step 19。 |
| 旧 `03-详细设计.md` 是否可以作为基线? | 不可以。旧文档含旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线,只作为污染审计输入。 |
| 旧 `03_ddd_*` completed 状态是否有效? | 无效。旧 Step 文件只能作为 historical material,不得直接继承。 |
| Step 1 的完成标准是什么? | 明确必读文档、输入权威顺序、历史材料处理规则、Step 1 模块计划和下一写入边界。 |

### 2. 必读文档

#### 2.1 流程与规范

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点、当前文档和下一动作。 | 只作为恢复门禁,不产生详细设计结论。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 确认 03 full-restart 当前 Step、当前模块和下一动作。 | 作为文档级 flow 真相源。 |
| `standards/document/详细设计讨论流程_SOP.md` | 确认 Step 1~19 的生成流程、Step 6+ 小循环和不得跳步规则。 | 只采用流程规则。 |
| `standards/document/详细设计书写规范.md` | 确认正式 03 章节结构、模块实现契约、对象 / port / protocol / flow / state 写法。 | 作为正式正文装配规则。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认三层台账、先思考后写入、历史材料后置审计和写入批次规则。 | 作为本文件写入与回填门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认缺 schema / port / DTO / mapper / config / evidence schema 时不得自行补口。 | 作为后续可落码性红线。 |
| `standards/coding/rust.md` | 确认 Rust 命名、注释、类型和实现契约表达方式。 | 主要用于 Step 3 以后,本步只列入必读候选。 |

#### 2.2 本仓正式输入

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 复核仓定位、目标 / 非目标、使用方、依赖、核心能力、功能需求、业务规则、数据归属、接口和验收红线。 | 不重新讨论需求。 |
| `projects/L3-method-library/01-架构设计.md` | 复核职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性、交互方式和技术取舍。 | 不重新讨论架构。 |
| `projects/L3-method-library/02-概要设计.md` | 提供 03 直接输入:代码主体、八个组成部分、关键对象、接口骨架、处理流、状态、异常、配置影响、承接清单。 | 作为 Step 1 第一设计基线。 |

#### 2.3 概要设计承接中间产物

| 中间产物 | 读取目的 | Step 1 关注点 |
|---|---|---|
| `02_hld_calibration_flow.md` | 确认 `02-概要设计` full-restart 已完成。 | 不继承旧 02 / 03 状态。 |
| `02_hld_step_12_detailed_design_handoff.md` | 读取详细设计承接清单和回退规则。 | 固定 03 继续展开范围。 |
| `02_hld_step_13_risks_open_questions.md` | 读取概要层风险和待确认事项。 | 判断哪些事项进入 03 风险 / 待确认,哪些不阻塞 Step 2。 |
| `02_hld_step_14_formal_document_assembly.md` | 读取正式 02 装配记录、来源矩阵和旧材料处理结论。 | 确认正式 02 已可作为 03 输入。 |

#### 2.4 参考框架

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_calibration_flow.md` | 学习 03 flow 的状态表、权威输入、执行纪律和历史材料隔离方式。 | 只参考框架,不得复制 governance 领域语义。 |
| `projects/L1-governance/design-calibration/03_ddd_step_01_upstream_boundary.md` | 学习 Step 1 的输入映射、旧文档诊断、回填草稿和进入下一步条件。 | 只参考结构和深度,不得复制 governance 主语。 |

#### 2.5 历史材料

| 材料 | 当前定位 | Step 1 使用方式 |
|---|---|---|
| `projects/L3-method-library/03-详细设计.md` | historical_material | 只用于识别旧 `MethodContent` / publish / snapshot / outbox 等污染主线。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` 旧内容 | historical_material | 已替换为当前 full-restart flow;旧 completed 状态失效。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_*.md` 旧内容 | historical_material | 到对应 Step 时后置差异审计,不得作为第一来源。 |

### 3. 当前输入边界判断

| 输入类别 | 当前判断 | 对 03 的影响 |
|---|---|---|
| 需求边界 | `00-需求文档.md` 已完成 full-restart,可作为上游需求基线。 | 03 不重答需求目标、角色、验收和核心能力闭环。 |
| 架构边界 | `01-架构设计.md` 已完成 full-restart,可作为上游架构基线。 | 03 不重画职责边界、依赖方向、数据所有权和通信方式。 |
| 概要边界 | `02-概要设计.md` 已完成 full-restart,可作为直接输入。 | 03 继续展开八个组成部分、对象、接口、处理流、状态、异常、配置影响和承接清单。 |
| 历史 03 | 与当前 02 主线冲突。 | 只作污染审计,不得正向继承。 |
| 后续 04~07 | 尚未按新版 03 完成同步。 | 不阻塞 Step 1,但后续 Step 14~17 需要承接。 |

### 4. 当前 03 历史材料初判

| 旧内容 | 初判 | 处理口径 |
|---|---|---|
| `MethodContent` 元模型与 7 类 subtype | historical_pollution_candidate | 当前 02 已改为方法资产定义与目录、正式化与版本、受控消费、追溯一致性等八个组成部分。 |
| publish / published / `PublishMethodContent` | historical_pollution_candidate | 当前 02 不以 publish 作为正式化主线。 |
| snapshot / `DefinitionSnapshot` | historical_pollution_candidate | 当前 02 只保留读取材料、summary、view、trace material 等概要主语,不恢复旧 snapshot 机制。 |
| fingerprint / drift | historical_pollution_candidate | 当前 02 不以 fingerprint 作为版本或一致性主线。 |
| outbox / delivery / event dispatch | historical_pollution_candidate | 当前 02 有 Outbound Event 骨架,但不继承旧 outbox / delivery 机制。 |
| P0 / P1 旧分层 | historical_pollution_candidate | 当前 02 采用 core / support / operation / peripheral 边界,外围增强不作为核心前置。 |
| 旧 Step 全部 completed | invalid_status | 当前 full-restart 下不得继承。 |

### 5. Step 1 模块顺序

| 顺序 | 模块 | 产物 | 门禁 |
|---:|---|---|---|
| R1.1 | 开工与必读文档:先思考 | 本节 | 只列输入、边界、历史材料处理和模块顺序。 |
| R1.2 | 开工与必读文档:再写入 | 开工记录、读取状态表、Step 内计划 | 用户确认后写入,不得改正式 `03-详细设计.md`。 |
| R1.3 | L1-governance 框架对齐:先思考 | 可借鉴框架与不得借鉴内容 | 只抽象结构,不复制领域内容。 |
| R1.4 | L1-governance 框架对齐:再写入 | Step 1 框架对齐记录 | 固定本仓 Step 1 输出结构。 |
| R1.5 | 上游关系与输入边界:先思考 | 00 / 01 / 02 到 03 的关系映射草案 | 不重新讨论上游。 |
| R1.6 | 上游关系与输入边界:再写入 | 上游关系映射表和本文不再回答 / 必须回答清单 | 形成 Step 1 主体结论。 |
| R1.7 | 历史 03 差异审计:先思考 | 旧 03 / 旧 03_ddd 污染扫描计划 | 旧材料后置,不反推当前结论。 |
| R1.8 | 历史 03 差异审计:再写入 | 差异审计结论和禁入清单 | 明确保留、废弃、待重审。 |
| R1.9 | 风险与待确认输入:先思考 | Step 1 输入不足风险候选 | 只判断是否阻塞 Step 2。 |
| R1.10 | 风险与待确认输入:再写入 | 输入不足风险和待确认事项 | 不写正式 §17。 |
| R1.11 | 回填草稿:先思考 | 正式 §1 / §17 回填策略 | 不修改正式 03。 |
| R1.12 | 回填草稿:再写入 | §1 / §17 回填草稿 | 仅中间产物草稿。 |
| R1.13 | 自检与停审:先思考 | Step 1 自检清单 | 判断是否可进入 Step 2。 |
| R1.14 | 自检与停审:再写入 | Step 1 停审记录 | 关闭 Step 1,更新 flow / 台账到 Step 2 等待状态。 |

### 6. 下一写入边界

下一步只允许进入:

```text
R1.2 开工与必读文档:再写入
```

`R1.2` 应写入:

- Step 1 开工记录。
- 必读文档读取状态表。
- Step 内计划确认表。
- 当前不修改正式 `03-详细设计.md` 的门禁说明。
- 下一模块 `R1.3 L1-governance 框架对齐:先思考`。

`R1.2` 不得写入:

- 正式 `03-详细设计.md` 正文修改。
- 上游关系最终结论。
- 历史 03 差异审计结论。
- Step 1 停审结论。
- Step 2 范围正文。

### 7. 自检

| 检查项 | 结果 |
|---|---|
| 是否只进入 Step 1 第一个模块? | 是。 |
| 是否未修改正式 `03-详细设计.md`? | 是。 |
| 是否明确旧 `03-详细设计.md` 只是 historical material? | 是。 |
| 是否明确旧 `03_ddd_*` completed 状态失效? | 是。 |
| 是否列出 Step 1 必读文档? | 是。 |
| 是否给出 Step 1 模块顺序? | 是。 |
| 是否明确下一步只允许 `R1.2`? | 是。 |

next_allowed_action: 用户已确认进入 Step 1 `R1.2 开工与必读文档:再写入`;本模块写入后只允许等待用户确认进入 `R1.3 L1-governance 框架对齐:先思考`。

---

## R1.2 开工与必读文档:再写入

### 1. 开工记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 1 确认概要设计输入边界 |
| 当前模块 | `R1.2 开工与必读文档:再写入` |
| 上一模块 | `R1.1 开工与必读文档:先思考` |
| 用户确认 | 已确认进入 `R1.2` |
| 本模块允许写入 | 开工记录、读取状态表、Step 内计划、输入基线、旧材料处理规则和下一门禁 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、上游关系最终结论、历史 03 差异审计结论、Step 1 停审结论、Step 2 范围正文 |
| 下一模块 | `R1.3 L1-governance 框架对齐:先思考` |

本模块确认 `03-详细设计` full-restart 已经正式进入 Step 1 开工阶段。当前仍处于输入边界准备阶段,不修改正式 `03-详细设计.md`,不把旧 `03` 或旧 `03_ddd_*` 的 completed 状态恢复为当前结论。

### 2. 必读文档读取状态表

#### 2.1 已完成读取

| 文档 | 状态 | 本模块使用结论 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | read | 项目级恢复点允许进入 `03-详细设计` Step 1 `R1.2`,且禁止跳过当前模块。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | read | 文档级 flow 已重建为 full-restart 状态,旧 Step completed 状态失效。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md#R1.1` | read | `R1.1` 已固定必读文档、输入边界、历史材料处理和 Step 1 模块顺序。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | 03 必须按 Step 1~19 独立推进;Step 6+ 必须按模块 / 功能 / capability 小循环展开。 |
| `standards/document/详细设计书写规范.md` | read | 正式 03 必须以模块实现契约、对象、port、protocol、flow、state、persistence、error、test cut 为主轴。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 当前采用三层台账、模块级先思考后写入、旧材料后置审计和单批写入规模控制。 |
| `projects/L3-method-library/00-需求文档.md` | read | 作为需求基线,不在 03 中重新定义仓定位、目标、角色、核心能力和验收红线。 |
| `projects/L3-method-library/01-架构设计.md` | read | 作为架构基线,不在 03 中重新定义职责边界、依赖方向、数据所有权和通信方式。 |
| `projects/L3-method-library/02-概要设计.md` | read | 作为 03 的直接输入,承接八个组成部分、关键对象、接口骨架、处理流、状态、异常、配置影响和详细设计承接清单。 |
| `projects/L3-method-library/design-calibration/02_hld_step_12_detailed_design_handoff.md` | read | 作为 03 继续展开范围和回退规则来源。 |
| `projects/L3-method-library/design-calibration/02_hld_step_13_risks_open_questions.md` | read | 作为 03 风险 / 待确认输入候选来源。 |
| `projects/L3-method-library/design-calibration/02_hld_step_14_formal_document_assembly.md` | read | 作为正式 02 已完成装配和旧材料处置的确认入口。 |
| `projects/L1-governance/design-calibration/03_ddd_calibration_flow.md` | read | 只参考 03 flow 的状态表、权威输入、执行纪律和历史材料隔离方式。 |
| `projects/L1-governance/design-calibration/03_ddd_step_01_upstream_boundary.md` | read | 只参考 Step 1 的输入映射、旧文档诊断、回填草稿和进入下一步条件。 |

#### 2.2 后续模块到达时读取

| 文档 | 读取时机 | 用途 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_01_upstream_boundary.md` | `R1.3` / `R1.4` | 抽取可借鉴的 Step 1 框架深度和表格组织,不复制领域语义。 |
| `projects/L3-method-library/03-详细设计.md` | `R1.7` / `R1.8` | 历史 03 差异审计,只查旧主线残留和禁入项。 |
| 旧 `projects/L3-method-library/design-calibration/03_ddd_step_*.md` | 对应 Step 到达时 | 后置差异审计,不得作为当前 Step 第一来源。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | Step 6 起持续读取 | 检查 schema、port、DTO、mapper、state、config、evidence schema 是否闭合。 |
| `standards/coding/rust.md` | Step 3 起持续读取 | 约束 Rust 类型、注释、命名和实现契约表达。 |

### 3. Step 内计划确认表

| 顺序 | 模块 | 状态 | 完成门禁 |
|---:|---|---|---|
| R1.1 | 开工与必读文档:先思考 | completed | 已列出输入、边界、历史材料处理和模块顺序。 |
| R1.2 | 开工与必读文档:再写入 | completed | 已记录开工、读取状态、Step 内计划、输入基线和旧材料规则。 |
| R1.3 | L1-governance 框架对齐:先思考 | next | 只分析可借鉴框架和不得借鉴内容,不得写本仓最终结论。 |
| R1.4 | L1-governance 框架对齐:再写入 | pending | 固化本仓 Step 1 框架对齐记录。 |
| R1.5 | 上游关系与输入边界:先思考 | pending | 形成 00 / 01 / 02 到 03 的关系映射草案。 |
| R1.6 | 上游关系与输入边界:再写入 | pending | 写入上游关系映射表和本文不再回答 / 必须回答清单。 |
| R1.7 | 历史 03 差异审计:先思考 | pending | 设计旧 03 / 旧 03_ddd 污染扫描计划。 |
| R1.8 | 历史 03 差异审计:再写入 | pending | 写入差异审计结论和禁入清单。 |
| R1.9 | 风险与待确认输入:先思考 | pending | 筛选 Step 1 输入不足风险候选。 |
| R1.10 | 风险与待确认输入:再写入 | pending | 写入输入不足风险和待确认事项。 |
| R1.11 | 回填草稿:先思考 | pending | 设计正式 §1 / §17 回填策略。 |
| R1.12 | 回填草稿:再写入 | pending | 写入 §1 / §17 中间产物草稿。 |
| R1.13 | 自检与停审:先思考 | pending | 形成 Step 1 自检清单。 |
| R1.14 | 自检与停审:再写入 | pending | 关闭 Step 1,更新 flow / 台账到 Step 2 等待状态。 |

### 4. 输入基线

| 输入组 | 当前口径 | 使用规则 |
|---|---|---|
| 当前正式 `00-需求文档.md` | 已完成本轮重启。 | 只作为需求边界,不得在 03 重答需求目标。 |
| 当前正式 `01-架构设计.md` | 已完成本轮重启。 | 只作为架构边界,不得在 03 重画职责、依赖和数据所有权。 |
| 当前正式 `02-概要设计.md` | 已完成本轮重启。 | 是 03 第一设计输入,后续对象、接口、flow 和 state 必须回指 02 主线。 |
| `02_hld_step_12`~`02_hld_step_14` | 已记录 03 承接、风险和正式装配。 | 用于解释 02 结论来源,不替代正式 02。 |
| 当前旧 `03-详细设计.md` | historical material。 | 只作污染审计,不得作为新版 03 truth source。 |
| 旧 `03_ddd_*` | historical material。 | 到对应 Step 时后置审计,不得直接继承。 |

### 5. 旧材料处理规则

| 旧材料 | 当前处理 | 说明 |
|---|---|---|
| 旧 `MethodContent` / 7 类 subtype | 禁止正向继承 | 当前 02 主线已变为方法资产定义与目录、正式化与版本、受控消费、追溯一致性等组成部分。 |
| publish / published / `PublishMethodContent` | 禁止正向继承 | 当前 02 不以 publish 作为正式化主线。 |
| snapshot / `DefinitionSnapshot` | 禁止正向继承 | 当前 02 只保留读取材料、summary、view、trace material 等概要主语。 |
| fingerprint / drift | 禁止正向继承 | 当前 02 不以 fingerprint 作为版本或一致性基础。 |
| outbox / delivery / event dispatch | 后置重审 | 当前 02 只给出 Outbound Event 骨架,不继承旧 outbox / delivery 机制。 |
| P0 / P1 旧分层 | 禁止正向继承 | 当前以 core / support / operation / peripheral 边界重新组织。 |
| 旧 Step 全部 completed 状态 | 无效 | 当前 full-restart 必须逐模块重新完成。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写出开工记录 | pass | 已记录当前 Step、模块、用户确认、允许和禁止写入范围。 |
| 是否写出读取状态表 | pass | 已区分已读输入和后续模块到达时读取的材料。 |
| 是否写出 Step 内计划 | pass | 已固定 R1.1~R1.14,未来模块未提前写正文。 |
| 是否明确输入基线 | pass | 正式 00 / 01 / 02 为上游输入,旧 03 降级为 historical material。 |
| 是否明确旧材料处理规则 | pass | 旧 MethodContent / publish / snapshot / fingerprint / outbox / P0-P1 不得正向继承。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块未修改正式 03。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.3 L1-governance 框架对齐:先思考`;只抽取 L1-governance Step 1 的框架深度、表格组织、旧材料隔离和门禁表达,不得复制 governance 领域内容,不得写本仓上游关系最终结论,不得修改正式 `03-详细设计.md`,不得进入 Step 2。

---

## R1.3 L1-governance 框架对齐:先思考

### 1. 本模块问题

本模块只回答三类问题:

1. `L1-governance` 详细设计 Step 1 的哪些结构可以作为本仓 Step 1 的框架参考。
2. 哪些 governance 领域内容必须排除,不能进入 `L3-method-library`。
3. 下一批 `R1.4 L1-governance 框架对齐:再写入` 应固化哪些框架对齐记录。

本模块不写本仓上游关系最终结论,不做历史 03 差异审计,不修改正式 `03-详细设计.md`,不进入 Step 2。

### 2. 可借鉴框架

| governance Step 1 结构 | 可借鉴点 | 转译到 method-library 的方式 |
|---|---|---|
| Step 状态 | 文件开头明确状态、SOP、回填章节。 | 保留当前 Step、模块、门禁和回填章节,但状态必须反映 full-restart 的逐模块进度。 |
| 本步输入 | 先列 00 / 01 / 02、概要承接清单、旧 03 诊断样本和前序依赖。 | 本仓同样列正式 00 / 01 / 02、02 承接中间产物、旧 03 historical material 和当前无前序 Step。 |
| SOP 问题回答 | 逐项回答“承接哪些概要结论、概要是否稳定、哪些仍需补清、哪些不能重定义”。 | 本仓后续 R1.5 / R1.6 应按同样问题结构回答,但内容必须来自 method-library 当前 02。 |
| 旧版 03 问题诊断 | 明确旧正式 03 与新版 02 的冲突,把旧文档降级为诊断输入。 | 本仓 R1.7 / R1.8 应对旧 `MethodContent` / publish / snapshot / outbox 等主线做同类审计。 |
| 改动前后对比 | 用表格说明为何不局部修补、不直接重写正式 03、而是走 SOP 中间产物。 | 本仓可复用这种三方案比较,但要改成 method-library 的旧主线和 current 02 输入。 |
| 设计取舍 | 比较局部修补、直接重写正式文档、按 SOP 生成中间产物。 | 本仓也应固定“按 SOP 逐 Step 生成中间产物,最后装配正式 03”为主方案。 |
| 结构化中间产物 | 包含上游关系映射、本文不再回答、本文必须回答、输入不足风险。 | 本仓应保留这四类产物,并以 method-library 的需求、架构、概要主语重写。 |
| 回填草稿 | 先形成正式 §1 / 风险章节可回填文字,但不直接修改正式文档。 | 本仓 R1.11 / R1.12 再生成草稿,当前 R1.3 不提前写。 |
| 待确认事项 | 把不阻塞下一步但影响后续 Step 的事项列出。 | 本仓应在 R1.9 / R1.10 中判断是否阻塞 Step 2 或只影响后续 Step。 |
| 进入下一步条件 | 明确进入 Step 2 的条件。 | 本仓 R1.13 / R1.14 才能写最终停审条件。 |

### 3. 不得借鉴内容

| governance 内容 | 禁止原因 | 本仓替代来源 |
|---|---|---|
| Governance truth / Gate / Decision / Approval / Policy / Nonconformity 等主语 | 领域语义不属于 method-library。 | `02-概要设计.md` 中的方法资产定义与目录、正式化与版本、受控消费、追溯一致性等八个组成部分。 |
| `L0-core` 唯一编译期依赖等 governance 特定依赖结论 | 依赖口径必须由本仓 00 / 01 / 02 给出。 | `00-需求文档.md`、`01-架构设计.md` 的本仓依赖裁剪与架构边界。 |
| governance 的 Command / Query / Consumer / Event / Job 名称 | 协议族和接口名不同。 | 本仓 `02-概要设计.md` §7 API / 接口骨架。 |
| governance 的状态集合、projection、outbox、external GRC 等对象线索 | 会污染 method-library 当前对象和状态主线。 | 本仓 `02-概要设计.md` §6~§10。 |
| governance 的回填草稿正文 | 正文语义完全不同。 | 后续 R1.11 / R1.12 基于本仓当前输入另写。 |

### 4. 本仓 Step 1 框架转译判断

| Step 1 产物块 | 是否采用 | 本仓写入口径 |
|---|---|---|
| Step 状态 | 采用 | 使用当前模块级状态,不再写旧 `[x] 已确认`。 |
| 本步输入 | 采用 | 以正式 00 / 01 / 02、02 Step 12~14、旧 03 historical material、规范为输入。 |
| SOP 问题回答 | 采用 | 在 R1.5 / R1.6 展开,逐项回答本仓 03 直接承接什么。 |
| 当前文档问题诊断 | 采用 | 在 R1.7 / R1.8 审计旧 03 和旧 03_ddd。 |
| 改动前后对比 | 采用 | 对比旧 03 续写、直接重写正式 03、按 SOP 逐步重建三种方式。 |
| 设计取舍 | 采用 | 固定按 SOP 中间产物重建,最后装配正式 03。 |
| 结构化中间产物 | 采用 | 输出上游关系映射、本文不再回答、本文必须回答、输入不足风险。 |
| 回填草稿 | 后置采用 | 当前不写,留给 R1.11 / R1.12。 |
| 待确认事项 | 后置采用 | 当前不裁决,留给 R1.9 / R1.10。 |
| 进入下一步条件 | 后置采用 | 当前不关闭 Step 1,留给 R1.13 / R1.14。 |

### 5. 下一写入边界

下一步只允许进入:

```text
R1.4 L1-governance 框架对齐:再写入
```

`R1.4` 应写入:

- L1-governance 框架对齐记录。
- 可借鉴结构清单。
- 不得借鉴内容清单。
- method-library Step 1 输出框架确认表。
- 下一模块 `R1.5 上游关系与输入边界:先思考` 的门禁。

`R1.4` 不得写入:

- 本仓上游关系最终结论。
- 正式 `03-详细设计.md` 正文。
- 旧 03 差异审计结论。
- Step 1 停审结论。
- Step 2 范围正文。

### 6. 自检

| 检查项 | 结果 |
|---|---|
| 是否只做框架对齐先思考 | 是。 |
| 是否只参考 L1-governance 的结构和深度 | 是。 |
| 是否排除 governance 领域语义 | 是。 |
| 是否未写本仓上游关系最终结论 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 Step 2 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.4 L1-governance 框架对齐:再写入`;只写框架对齐记录、可借鉴结构、不得借鉴内容和本仓 Step 1 输出框架确认表;不得写本仓上游关系最终结论,不得修改正式 `03-详细设计.md`,不得进入 Step 2。

---

## R1.4 L1-governance 框架对齐:再写入

### 1. 框架对齐记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 1 确认概要设计输入边界 |
| 当前模块 | `R1.4 L1-governance 框架对齐:再写入` |
| 上一模块 | `R1.3 L1-governance 框架对齐:先思考` |
| 用户确认 | 已确认进入 `R1.4` |
| 本模块允许写入 | 框架对齐记录、可借鉴结构、不得借鉴内容、Step 1 输出框架确认表 |
| 本模块禁止写入 | 本仓上游关系最终结论、正式 `03-详细设计.md` 正文、旧 03 差异审计结论、Step 1 停审结论、Step 2 范围正文 |
| 下一模块 | `R1.5 上游关系与输入边界:先思考` |

本模块将 `R1.3` 的框架判断固化为可复用的 Step 1 输出框架。后续 `R1.5` / `R1.6` 才开始基于本仓正式 `00/01/02` 形成上游关系与输入边界结论。

### 2. 可借鉴结构清单

| 可借鉴结构 | 采用方式 | 后续落点 |
|---|---|---|
| Step 状态块 | 保留当前 Step、当前模块、当前门禁、回填章节和 full-restart 状态。 | 文件头和每次模块推进时更新。 |
| 本步输入块 | 列出正式 00 / 01 / 02、概要承接中间产物、旧 03 historical material、规范和框架参考。 | R1.5 / R1.6 的上游关系与输入边界。 |
| SOP 问题回答块 | 按详细设计 SOP Step 1 的问题逐项回答。 | R1.5 / R1.6。 |
| 当前文档问题诊断块 | 诊断旧 `03-详细设计.md` 与当前 `02-概要设计.md` 的冲突。 | R1.7 / R1.8。 |
| 改动前后对比块 | 对比旧 03 续写、直接重写正式 03、按 SOP 重启三种方式。 | R1.7 / R1.8 和 R1.13 / R1.14。 |
| 设计取舍块 | 固定选择“按 SOP 中间产物逐步重建,最后装配正式 03”。 | R1.6 以后作为执行纪律。 |
| 结构化中间产物块 | 形成上游关系映射、本文不再回答、本文必须回答、输入不足风险。 | R1.6 / R1.10。 |
| 回填草稿块 | 只在上游关系、风险输入和自检完成后再生成。 | R1.11 / R1.12。 |
| 待确认事项块 | 只记录不阻塞 Step 2 但影响后续 Step 的事项。 | R1.9 / R1.10。 |
| 进入下一步条件块 | 只在 Step 1 停审时写最终条件。 | R1.13 / R1.14。 |

### 3. 不得借鉴内容清单

| 禁止项 | 禁止原因 | 本仓替代来源 |
|---|---|---|
| Governance truth、Gate、Decision、Approval、Policy、Control、Nonconformity 等领域主语 | 这些是 governance 领域对象,会污染 method-library 的方法资产主线。 | `02-概要设计.md` §4~§6 的本仓代码主体和关键对象轮廓。 |
| governance 的接口名、命令名、查询名、事件名、job 名 | 接口族与本仓不同。 | `02-概要设计.md` §7 API / 接口骨架。 |
| governance 的状态集合和状态流转 | 状态 owner 与本仓不同。 | `02-概要设计.md` §9 状态定义与状态流转。 |
| governance 的旧文档诊断具体内容 | 旧污染类型不同。 | 本仓旧 `03-详细设计.md` 和旧 `03_ddd_*` 的 MethodContent / publish / snapshot / outbox 主线。 |
| governance 的回填草稿正文 | 正文属于 governance,不可迁移。 | 本仓 R1.11 / R1.12 独立生成。 |
| governance 的输入不足风险样例 | 风险影响面不同。 | 本仓 `02_hld_step_13_risks_open_questions.md` 与当前 03 差异审计。 |

### 4. 本仓 Step 1 输出框架确认表

| 输出块 | 本轮是否需要 | 生成模块 | 当前状态 |
|---|---|---|---|
| Step 状态与门禁 | 需要 | R1.1~R1.4 持续维护 | active |
| 必读文档与读取状态 | 需要 | R1.1 / R1.2 | completed |
| L1-governance 框架对齐 | 需要 | R1.3 / R1.4 | completed |
| 上游关系映射 | 需要 | R1.5 / R1.6 | pending |
| SOP 问题回答 | 需要 | R1.5 / R1.6 | pending |
| 本文不再回答 / 必须回答 | 需要 | R1.5 / R1.6 | pending |
| 旧 03 差异审计 | 需要 | R1.7 / R1.8 | pending |
| 改动前后对比 | 需要 | R1.7 / R1.8 | pending |
| 设计取舍 | 需要 | R1.7 / R1.8 | pending |
| 输入不足风险和待确认 | 需要 | R1.9 / R1.10 | pending |
| 正式 §1 / §17 回填草稿 | 需要 | R1.11 / R1.12 | pending |
| 自检与停审记录 | 需要 | R1.13 / R1.14 | pending |

### 5. 下一写入边界

下一步只允许进入:

```text
R1.5 上游关系与输入边界:先思考
```

`R1.5` 应思考:

- 正式 `00-需求文档.md` 哪些结论只作为 03 约束,不重新定义。
- 正式 `01-架构设计.md` 哪些结论只作为 03 约束,不重新定义。
- 正式 `02-概要设计.md` 哪些结论是 03 直接输入。
- `02_hld_step_12`~`02_hld_step_14` 如何辅助解释正式 02。
- Step 1 的 SOP 问题回答应如何转译为本仓文本。

`R1.5` 不得写入:

- 正式 `03-详细设计.md` 正文。
- 上游关系最终表。
- 旧 03 差异审计结论。
- Step 1 停审结论。
- Step 2 范围正文。

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写出框架对齐记录 | pass | 已记录当前模块、上一模块、允许 / 禁止写入和下一模块。 |
| 是否写出可借鉴结构清单 | pass | 已把 governance Step 1 的可借鉴结构转译为本仓后续模块落点。 |
| 是否写出不得借鉴内容清单 | pass | 已明确 governance 领域语义、接口、状态、回填正文不得进入本仓。 |
| 是否确认本仓 Step 1 输出框架 | pass | 已列出 Step 状态、输入、SOP 回答、旧 03 审计、风险、草稿和停审等输出块。 |
| 是否写本仓上游关系最终结论 | no | 留给 R1.5 / R1.6。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块未修改正式 03。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.5 上游关系与输入边界:先思考`;只思考正式 00 / 01 / 02 与 03 的承接边界和 SOP 问题回答转译策略,不得写最终上游关系表,不得修改正式 `03-详细设计.md`,不得进入 Step 2。

---

## R1.5 上游关系与输入边界:先思考

### 1. 本模块问题

本模块只回答五类问题:

1. 正式 `00-需求文档.md` 中哪些结论只作为 03 的需求约束,不得在 03 重新定义。
2. 正式 `01-架构设计.md` 中哪些结论只作为 03 的架构约束,不得在 03 重新定义。
3. 正式 `02-概要设计.md` 中哪些结论是 03 的直接输入,必须继续展开。
4. `02_hld_step_12`~`02_hld_step_14` 在 Step 1 中如何辅助解释正式 02,但不替代正式 02。
5. Step 1 的 SOP 问题回答应如何转译为本仓文本。

本模块不写最终上游关系表,不写正式 §1 回填草稿,不做旧 03 差异审计,不修改正式 `03-详细设计.md`,不进入 Step 2。

### 2. 需求文档承接边界思考

正式 `00-需求文档.md` 对 03 的作用是提供需求约束和业务红线,不是让 03 重新讨论需求范围。

| 需求来源 | 03 中的处理方式 | 不得重定义 |
|---|---|---|
| 本仓定位与边界 | 作为 03 的仓级职责约束。 | 不重定义 method-library 是否是方法资产定义、版本发布与分发语义真相仓。 |
| 目标与非目标 | 作为 03 的范围约束。 | 不把流程执行、成员状态、治理裁决、外部能力注册、marketplace 交易、UI 渲染、artifact 正文写成本仓实现职责。 |
| 使用方与依赖 | 作为接口、port、adapter 和事件协作的上游约束。 | 不在 03 中新增未被需求接受的消费方或依赖方向。 |
| 核心能力闭环 | 作为模块契约和处理流必须支撑的能力来源。 | 不改写需求层的核心能力顺序和业务闭环。 |
| 功能需求 / 业务规则 / 数据归属 | 作为对象不变量、协议校验、错误分支和测试切口的来源。 | 不把需求规则改写成实现便利规则。 |
| 接口与依赖 / 验收标准 | 作为后续 protocol、port、test cut、implementation handoff 的约束。 | 不提前写测试方案或实施计划。 |

### 3. 架构设计承接边界思考

正式 `01-架构设计.md` 对 03 的作用是提供架构约束和依赖方向,不是让 03 重画系统边界。

| 架构来源 | 03 中的处理方式 | 不得重定义 |
|---|---|---|
| 职责边界 | 约束模块 owner、domain boundary、application service 和 forbidden scope。 | 不把 process / identity / governance / capability-hub / marketplace / UI / artifact 职责迁入本仓。 |
| 系统边界与上下文 | 约束外部输入、输出、summary/ref-only 和 body-free 边界。 | 不把外部正文、下游运行 truth 或 UI 状态作为本仓 truth。 |
| 限界上下文与统一语言 | 约束模块命名、对象归属和 shared vocabulary。 | 不恢复旧 `MethodContent` 总对象作为跨上下文万能主语。 |
| 容器 / 部署架构 | 约束运行承载和 adapter / job / entry 的展开边界。 | 不在 Step 1 讨论部署参数或 worker 细节。 |
| 依赖方向与层间约束 | 约束 crate / package / module 依赖和 port / adapter 方向。 | 不让下游仓、外部系统或 UI 反向成为 core truth 依赖。 |
| 数据所有权与一致性策略 | 约束 truth、read material、summary、view、lineage、freshness 的 ownership。 | 不让 read material、query view 或 maintenance job 改写 core truth。 |
| 关键交互与通信方式 | 约束 Command、Query、Consumer、Outbound Event、Operations Job 的协作方式。 | 不把 query / consumer / job / handoff failure 改成核心写路径。 |

### 4. 概要设计直接输入思考

正式 `02-概要设计.md` 是 03 的直接输入。03 必须继续展开它,但不能暗改它。

| 概要来源 | 03 必须继续展开 | 回退条件 |
|---|---|---|
| §4 代码主体框架总览 | crate / module / service / port / adapter 的正式分层边界。 | 若需要改代码主体框架或业务主语,回退 02 Step 4。 |
| §5 八个主要组成部分 | 每个组成部分的正式 owner、module、domain boundary、application service、support / operation / peripheral 落点。 | 若需要增删合并组成部分,回退 02 Step 5。 |
| §6 关键对象轮廓 | truth、summary、view、typed ref、history、lineage、maintenance / peripheral 对象的字段、状态、工厂和不变量。 | 若需要新增关键对象家族或重定义 owner,回退 02 Step 6。 |
| §7 API / 接口骨架 | Command / Query / Inbound Consumer / Outbound Event / Operations Job 的 request / response / rejection / report 合同。 | 若需要新增接口族或恢复旧 publish / snapshot / outbox 机制,回退 02 Step 7。 |
| §8 关键处理流 | application flow、service 编排、transaction boundary、side effect 顺序、refresh / recovery。 | 若需要改主处理流,回退 02 Step 8。 |
| §9 状态定义与状态流转 | 状态 owner、状态矩阵、guard、非法迁移、freshness / degradation 和并发保护边界。 | 若需要改状态主线,回退 02 Step 9。 |
| §10 异常与边界场景 | 错误分类、异常映射、恢复路径、拒绝面和 safe failure。 | 若需要改异常红线,回退 02 Step 10。 |
| §11 配置影响轮廓 | typed config / runtime contract 与禁止配置化边界。 | 若配置要绕过 truth owner 或状态机,回退 02 Step 11。 |
| §12 详细设计承接清单 | 作为 03 承接范围和回退规则入口。 | 03 发现概要输入不足时必须回退对应 02 Step。 |
| §13 风险与待确认事项 | 作为 03 风险 / 待确认候选。 | 不得把未闭口事项写成正式实现契约。 |

### 5. 概要中间产物使用思考

`02_hld_step_12`~`02_hld_step_14` 只作为解释性输入:

| 中间产物 | 在 Step 1 的用途 | 使用限制 |
|---|---|---|
| `02_hld_step_12_detailed_design_handoff.md` | 解释正式 §12 的承接项、回退规则和排除项。 | 若与正式 `02-概要设计.md` 冲突,以正式 02 为准。 |
| `02_hld_step_13_risks_open_questions.md` | 解释正式 §13 的风险来源、待确认事项和旧材料处置。 | 只作为风险候选来源,不直接变成 03 结论。 |
| `02_hld_step_14_formal_document_assembly.md` | 解释正式 02 装配、来源矩阵和旧材料清理结果。 | 只用于确认 02 可作为输入,不替代正式 02 正文。 |

### 6. SOP 问题回答转译策略

| SOP Step 1 问题 | 本仓转译方向 | 写入时机 |
|---|---|---|
| 当前详细设计直接承接概要设计中的哪些结论? | 回答 02 §4~§13 中需要继续展开的代码主体、八个组成部分、对象、接口、处理流、状态、异常、配置和承接清单。 | R1.6 |
| 概要设计中的代码主体框架是否已经足够稳定? | 回答当前 02 已固定代码主体框架和八个组成部分,可进入详细设计;如发现需改主语,必须回退 02。 | R1.6 |
| 关键对象、接口骨架、处理流和状态机是否足够继续展开? | 回答足够作为 03 输入,但字段、签名、schema、port、flow 细节仍要后续 Step 逐项补齐。 | R1.6 |
| 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清? | 列出文件布局、模块契约、对象字段、trait / port、DTO schema、函数级 flow、状态矩阵、持久化、错误、并发、配置、观测、测试切口。 | R1.6 |
| 哪些需求或架构结论影响详细设计,但不能在详细设计中重新定义? | 列出 method-library truth 归属、Definition vs Use、相邻仓非职责、外部 body-free、read material 不反写、配置禁区等。 | R1.6 |

### 7. 下一写入边界

下一步只允许进入:

```text
R1.6 上游关系与输入边界:再写入
```

`R1.6` 应写入:

- 上游关系映射表。
- 03 不再回答清单。
- 03 必须回答清单。
- SOP Step 1 问题回答。
- 输入边界阶段的小结和下一模块 `R1.7 历史 03 差异审计:先思考`。

`R1.6` 不得写入:

- 正式 `03-详细设计.md` 正文。
- 旧 03 差异审计结论。
- Step 1 停审结论。
- Step 2 范围正文。

### 8. 自检

| 检查项 | 结果 |
|---|---|
| 是否只做上游关系先思考 | 是。 |
| 是否区分 00 / 01 约束与 02 直接输入 | 是。 |
| 是否未写最终上游关系表 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入旧 03 差异审计 | 是。 |
| 是否未进入 Step 2 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.6 上游关系与输入边界:再写入`;只写上游关系映射、本文不再回答 / 必须回答清单和 SOP Step 1 问题回答;不得修改正式 `03-详细设计.md`,不得进入历史 03 差异审计结论,不得进入 Step 2。

---

## R1.6 上游关系与输入边界:再写入

### 1. 上游关系映射表

| 来源文档 | 承接内容 | 03 继续展开什么 | 03 不做什么 |
|---|---|---|---|
| `00-需求文档.md` | 仓定位、目标 / 非目标、使用方、依赖、核心能力、功能需求、业务规则、数据归属、接口与验收红线。 | 把需求约束落到对象不变量、协议校验、错误分支、测试切口和实施承接。 | 不重新讨论需求目标、角色、验收标准、功能范围或相邻仓职责。 |
| `01-架构设计.md` | 职责边界、系统上下文、限界上下文、运行承载、依赖方向、数据所有权、一致性、交互方式和技术取舍。 | 把架构约束落到 crate / module、service、port / adapter、transaction、read material、event / handoff 和配置绑定。 | 不重画系统边界、依赖方向、数据所有权或通信方式。 |
| `02-概要设计.md` | 代码主体框架、八个主要组成部分、关键对象轮廓、接口骨架、处理流、状态、异常、配置影响、详细设计承接清单、风险与待确认事项。 | 展开文件布局、模块契约、对象字段、trait / port、protocol schema、函数级 flow、状态矩阵、持久化、错误、并发、配置、观测和测试切口。 | 不暗改概要主语、不增删组成部分、不重定义对象 owner、不恢复旧 publish / snapshot / outbox 主线。 |
| `02_hld_step_12_detailed_design_handoff.md` | 正式 §12 的承接来源、继续展开方向、回退规则和排除项。 | 辅助判断 03 每个 Step 的承接范围和回退位置。 | 不替代正式 `02-概要设计.md`。 |
| `02_hld_step_13_risks_open_questions.md` | 正式 §13 的风险来源、待确认事项和旧材料处理口径。 | 辅助筛选 03 输入不足风险和后续待确认事项。 | 不把风险候选直接写成实现契约。 |
| `02_hld_step_14_formal_document_assembly.md` | 正式 02 装配、来源追溯和旧材料清理记录。 | 证明 02 full-restart 已完成,可作为 03 输入。 | 不替代正式 02 正文。 |
| 旧 `03-详细设计.md` / 旧 `03_ddd_*` | 历史材料和污染审计对象。 | 后续 R1.7 / R1.8 只用于识别旧主线残留和禁入内容。 | 不作为新版 03 的 truth source,不继承旧 completed 状态。 |

### 2. 本文不再回答

`03-详细设计.md` 不再回答以下问题:

- `L3-method-library` 是否是方法资产定义、版本发布与分发语义的真相仓。
- 为什么本仓不拥有流程执行、成员身份、治理裁决、外部能力注册、marketplace 交易、UI 渲染、artifact 正文、认证登录或权限系统。
- 为什么 Definition vs Use 必须分离。
- 为什么正式方法资产版本必须稳定,非正式资产不得成为正式消费依据。
- 为什么核心 truth 与读取材料必须分层,read material / query view / maintenance job 不得反写 core truth。
- 为什么外部结论只能作为 summary / ref / marker 承接,不能把外部正文或 artifact body 纳入本仓。
- 为什么同步裁定、异步协作、后台收敛必须分层。
- 为什么外围 package / method set / marketplace context 不得阻塞 core 主链。
- 为什么旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P0-P1 主线不能直接继承。
- 为什么缺 schema、port、state、mapper、config key、test evidence schema 或 run artifact schema 时不能由实现端自行补口。

### 3. 本文必须回答

`03-详细设计.md` 必须继续回答以下问题:

- Rust workspace / crate / package / module / file layout 如何承接八个组成部分。
- 每个模块的职责、owner、允许依赖、禁止依赖和实现边界是什么。
- 每个 truth、summary、view、typed ref、history、lineage、maintenance / peripheral 对象的字段、状态、工厂、函数和不变量是什么。
- 每个 trait / port / adapter / repository / mapper / policy 的签名、输入输出、错误面和归属是什么。
- Command / Query / Inbound Consumer / Outbound Event / Operations Job 的 request、response、result、rejection、receipt、report 和 public marker schema 如何定义。
- 每个接口或 job 的函数级处理流、transaction boundary、side effect 顺序、禁止副作用和恢复收敛边界是什么。
- 状态 owner、状态矩阵、guard、非法迁移、freshness / degradation、并发和幂等如何定义。
- 持久化、事务、一致性、projection / read material、trace / audit、handoff 和 reference refresh 如何闭环。
- 错误分类、异常映射、safe failure、degraded / unavailable surface 和恢复路径如何定义。
- 配置引用、外部依赖绑定、观测审计、测试切口和实施承接清单如何从 03 传递给后续 04~07。

### 4. SOP Step 1 问题回答

#### 4.1 当前详细设计直接承接概要设计中的哪些结论?

直接承接正式 `02-概要设计.md` 的以下结论:

| 概要结论 | 03 展开方向 |
|---|---|
| §4 代码主体框架总览 | 展开 crate / module / service / port / adapter 的正式分层边界。 |
| §5 八个主要组成部分 | 展开方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织的模块契约。 |
| §6 关键对象轮廓 | 展开 truth、summary、view、typed ref、history、lineage、maintenance / peripheral 对象的字段、状态、工厂和不变量。 |
| §7 API / 接口骨架 | 展开 Command / Query / Inbound Consumer / Outbound Event / Operations Job 的正式 contract。 |
| §8 关键处理流 | 展开 application flow、service 编排、transaction boundary、side effect 和恢复收敛。 |
| §9 状态定义与状态流转 | 展开状态 owner、状态矩阵、guard、非法迁移、freshness / degradation 和并发保护。 |
| §10 异常与边界场景 | 展开错误分类、异常映射、恢复路径、拒绝面和 safe failure。 |
| §11 配置影响轮廓 | 展开 typed config / runtime contract 和禁止配置化边界。 |
| §12 详细设计承接清单 | 作为 03 承接范围和回退规则。 |
| §13 设计风险与待确认事项 | 作为 03 风险 / 待确认候选,不得直接写成实现结论。 |

#### 4.2 概要设计中的代码主体框架是否已经足够稳定?

足够进入详细设计。当前 `02-概要设计.md` 已经固定:

- 代码主体框架总览。
- 八个主要组成部分。
- core / support / operation / peripheral 分层。
- 主要对象候选、接口族、处理流族、状态族、异常族和配置影响轮廓。
- 详细设计承接清单与回退规则。

但这个稳定性只允许 03 继续展开实现契约,不允许 03 暗改概要主语。若后续需要改代码主体框架、组成部分、对象 owner、接口族、主处理流、状态主线或配置职责,必须回退到对应概要 Step。

#### 4.3 关键对象、接口骨架、处理流和状态机是否足够继续展开?

足够作为 03 输入。当前概要已经提供:

- 关键对象轮廓和对象发现线索。
- Command / Query / Inbound Consumer / Outbound Event / Operations Job 骨架。
- 方法资产定义、正式化、受控消费、追溯一致性、关系分发、外部摘要、维护收敛、外围组织的处理流族。
- 方法资产定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、外部引用、维护收敛、外围组织的状态族。

仍需在 03 中补齐的是完整字段、类型、函数签名、trait / port、protocol schema、函数级调用链、事务边界、错误面、持久化、并发、幂等、配置、观测和测试切口。

#### 4.4 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

以下内容必须在 03 后续 Step 中补清:

| 轮廓内容 | 详细设计补清位置 |
|---|---|
| Rust workspace、crate、module、file layout | Step 3 / Step 4 |
| 模块职责、owner、依赖和 forbidden scope | Step 5 |
| 对象字段、状态、工厂、函数和不变量 | Step 6 |
| trait / port / adapter / repository / mapper / policy 签名 | Step 7 |
| protocol DTO、public marker、request / response / rejection / receipt / report schema | Step 8 |
| 函数级处理流、transaction boundary、side effect 顺序 | Step 9 |
| 状态矩阵、guard、非法迁移、freshness / degradation | Step 10 |
| persistence、projection、read material、transaction consistency | Step 11 |
| 错误模型、异常分支、恢复口径 | Step 12 |
| 并发、幂等、重入保护 | Step 13 |
| 配置引用与外部依赖绑定 | Step 14 |
| 观测、审计埋点、测试切口、实施承接 | Step 15~17 |

#### 4.5 哪些需求或架构结论影响详细设计,但不能在详细设计中重新定义?

以下结论只能承接,不得在 03 中重新定义:

| 结论 | 约束效果 |
|---|---|
| 本仓是方法资产定义、版本发布与分发语义真相仓。 | 约束模块和对象 owner。 |
| Definition vs Use 必须分离。 | 约束下游消费、read material、query view 和运行状态边界。 |
| 流程执行、成员状态、治理裁决、外部能力注册、marketplace 交易、UI 渲染、artifact 正文不归本仓。 | 约束 forbidden scope。 |
| 正式版本语义必须稳定,非正式资产不得作为正式消费依据。 | 约束正式化、版本、消费和状态矩阵。 |
| 核心 truth 与读取材料必须分层。 | 约束 persistence、projection、read material 和 maintenance job。 |
| 外部材料只能 summary / ref / marker 承接。 | 约束 external source、artifact ref、governance basis 和 body-free 边界。 |
| Query / Consumer / Job / Publisher 边界不得翻转。 | 约束 protocol、flow、error recovery 和 side effect。 |
| 配置不得绕过 domain invariant、truth owner 或状态机。 | 约束 Step 14 和后续 04 配置设计。 |

### 5. 输入边界小结

| 判断 | 结论 |
|---|---|
| 00 / 01 是否可作为上游输入 | 可以,但只作为约束,不在 03 重新定义。 |
| 02 是否可作为直接输入 | 可以,正式 `02-概要设计.md` 已完成 full-restart。 |
| 02 中间产物是否可作为真相源 | 不是第一真相源,只作为解释性输入;若冲突,以正式 02 为准。 |
| 旧 03 是否可作为基线 | 不可以,只作为 historical material。 |
| 是否可以进入旧 03 差异审计 | 可以,下一模块先思考差异审计计划。 |
| 是否可以进入 Step 2 | 不可以,Step 1 尚未完成差异审计、风险输入、回填草稿和停审。 |

### 6. 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写出上游关系映射 | pass | 已区分 00 / 01 / 02、02 中间产物和旧 03 的权威级别。 |
| 是否写出本文不再回答清单 | pass | 已列出需求、架构、概要层已收稳且不得重定义的问题。 |
| 是否写出本文必须回答清单 | pass | 已列出 03 后续 Step 必须补齐的实现契约。 |
| 是否回答 SOP Step 1 问题 | pass | 已逐项回答五个 Step 1 问题。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块未修改正式 03。 |
| 是否进入历史 03 差异审计结论 | no | 只允许下一模块先思考审计计划。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 用户已确认进入 Step 1 `R1.7 历史 03 差异审计:先思考`;本模块写入后只允许等待用户确认进入 `R1.8 历史 03 差异审计:再写入`。

---

## R1.7 历史 03 差异审计:先思考

### 1. 本模块定位

本模块只设计旧 `03-详细设计.md` 和旧 `03_ddd_*` 的污染扫描计划,不写差异审计结论。

本模块的目标是让下一模块 `R1.8` 可以按统一口径完成差异审计,避免 agent 在后续 Step 中因为旧文件内容完整、行数多、看起来已完成,而把旧对象、旧接口、旧流程或旧状态误带回新版详细设计。

### 2. 审计对象

| 审计对象 | 当前定位 | 本模块处理 |
|---|---|---|
| `projects/L3-method-library/03-详细设计.md` | historical_material | 设计扫描计划,识别旧正式正文中可能污染新版 03 的主线、章节和类型名称。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_*.md` | historical_material | 设计逐 Step 扫描计划,识别旧中间产物中可能被误继承的 completed 状态、对象、port、protocol、flow、state、persistence、error、config、test 和 handoff 结论。 |
| 当前 `00-需求文档.md` | current_formal_input | 作为污染判定的上游需求边界,不是本模块审计对象。 |
| 当前 `01-架构设计.md` | current_formal_input | 作为污染判定的架构边界,不是本模块审计对象。 |
| 当前 `02-概要设计.md` | current_formal_input | 作为污染判定的直接设计基线,不是本模块审计对象。 |

### 3. 扫描关键词与污染候选

下一模块应至少扫描以下候选词和语义族。命中本身不等于污染结论,必须在 `R1.8` 中再按当前 `00/01/02` 对照判定。

| 候选族 | 关键词 / 名称 | 需要判断的问题 |
|---|---|---|
| 旧内容主语 | `MethodContent` | 是否仍以旧元模型替代当前 02 的方法资产定义、目录、正式化、消费、追溯、分发、摘要、维护和外围组织八个组成部分。 |
| 发布主线 | `publish`, `published`, `PublishMethodContent` | 是否把旧 publish 命令当成当前正式化与版本边界,或把发布事件当成唯一主处理流。 |
| 快照主线 | `snapshot`, `DefinitionSnapshot` | 是否把旧 snapshot 机制当成 truth、read model 或 export 的默认实现前提。 |
| 指纹主线 | `fingerprint`, `drift` | 是否把 fingerprint / drift 当成版本、状态或一致性的唯一中心主语。 |
| 事件投递 | `outbox`, `OutboxEvent`, `delivery` | 是否继承旧 outbox / delivery 机制,而不是按当前 02 的 Outbound Event 骨架重新展开。 |
| 旧阶段语言 | `P0`, `P1` | 是否沿用旧 P0 / P1 范围,遮蔽当前 core / support / operation / peripheral 边界。 |
| 外围能力 | `plugin`, `configuration` | 是否把旧 plugin / configuration 当成当前 03 主链必实现能力。 |
| 旧状态机 | `lifecycle` | 是否沿用旧 lifecycle 状态和迁移,而不是按当前 02 的状态族重新定义。 |

### 4. 扫描维度

`R1.8` 不应只按关键词列表做简单删除,而应按以下维度逐项判定:

| 维度 | 扫描问题 | 产出类别 |
|---|---|---|
| 领域主语 | 旧内容是否仍以旧 `MethodContent` / publish / snapshot 为设计中心? | `discard` / `rename_and_rederive` / `keep_as_history_note` |
| 模块边界 | 旧模块是否与当前 02 八个组成部分和 core / support / operation / peripheral 边界冲突? | `discard` / `needs_re-scope` |
| 对象契约 | 旧对象字段、工厂、不变量是否有当前 02 输入支撑? | `discard` / `needs_current_step_redefinition` |
| port / adapter | 旧 repository、port、external client 是否符合当前依赖方向和 body-free 边界? | `discard` / `needs_step7_redefinition` |
| protocol | 旧 command / query / event / job 是否仍属于当前接口骨架? | `discard` / `needs_step8_redefinition` |
| function flow | 旧流程是否绕过当前分层、状态守卫、事务和 read material 边界? | `discard` / `needs_step9_redefinition` |
| state | 旧 lifecycle / outbox / job / P1 状态是否仍有当前 02 支撑? | `discard` / `needs_step10_redefinition` |
| persistence | 旧表、索引、事务和 outbox 机制是否可由当前对象 / port / flow 推导? | `discard` / `needs_step11_redefinition` |
| error / recovery | 旧错误和恢复策略是否扩大职责或自行补口? | `discard` / `needs_step12_redefinition` |
| config / test / handoff | 旧配置、测试和实施边界是否与当前 00/01/02 或新版 SOP 冲突? | `discard` / `needs_later_step_redefinition` |

### 5. 判定规则

| 判定 | 使用条件 | 后续处理 |
|---|---|---|
| `discard` | 旧内容与当前 `00/01/02` 明确冲突,或属于旧 completed 状态、旧阶段范围、旧对象中心。 | 不进入新版 03;如后续再出现,必须回到当前 Step 重新证明来源。 |
| `rename_and_rederive` | 旧内容表达了仍可能存在的事实,但名称、owner、边界或 schema 已不符合当前 02。 | 不直接复制;后续 Step 只能用当前主语重新命名、重新归属、重新闭口。 |
| `needs_current_step_redefinition` | 旧内容主题仍属于当前 03 后续某 Step,但缺新版输入或可落码闭环。 | 放入对应 Step 的待重定义清单。 |
| `keep_as_history_note` | 旧内容只用于解释为什么本轮不继承旧方案。 | 只能进入中间产物审计说明,不得成为正式设计契约。 |

### 6. R1.8 输出格式计划

下一模块 `R1.8` 应按以下结构写入差异审计结论:

| 输出块 | 内容 |
|---|---|
| 扫描范围记录 | 列出已扫描的旧正式 03 和旧 `03_ddd_step_*.md` 范围。 |
| 污染候选命中表 | 只列类别、旧位置、风险类型和是否需要后续 Step 重定义。 |
| 禁入清单 | 明确不得正向进入新版 03 的旧主线、旧对象、旧接口和旧状态。 |
| 待重定义清单 | 把仍可能保留的事实分派到 Step 2~18,要求按当前 00/01/02 重新展开。 |
| 改动前后对比 | 对比旧 03 续写、直接重写正式 03、按 SOP 重启三种方式的风险。 |
| 设计取舍 | 固定本轮选择:旧 03 只作 historical material,新版 03 按当前中间产物逐步重建。 |

### 7. 本模块不得做的事

| 禁止事项 | 原因 |
|---|---|
| 不写最终差异审计结论 | 本模块是先思考,结论留给 `R1.8`。 |
| 不修改正式 `03-详细设计.md` | Step 1 尚未进入回填草稿和正式装配。 |
| 不重写旧 `03_ddd_step_*.md` | 旧文件是历史审计对象,不应被本轮中途改写。 |
| 不把关键词命中直接判为污染 | 必须对照当前 `00/01/02` 和当前 Step 语境。 |
| 不进入 Step 2 | Step 1 仍未完成差异审计、风险输入、回填草稿和停审。 |

### 8. 下一写入边界

下一步只允许进入:

```text
R1.8 历史 03 差异审计:再写入
```

`R1.8` 应执行并写入:

- 旧正式 `03-详细设计.md` 的差异审计结论。
- 旧 `03_ddd_step_*.md` 的差异审计结论。
- 禁入清单。
- 待重定义清单。
- 改动前后对比和设计取舍。
- 下一模块 `R1.9 风险与待确认输入:先思考` 的门禁。

`R1.8` 不得写入:

- 正式 `03-详细设计.md` 正文修改。
- Step 2 范围正文。
- Step 6+ 对象、port、protocol、flow、state 的详细契约。
- 未经当前 `00/01/02` 支撑的旧结论复用。

### 9. 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只设计污染扫描计划 | pass | 本模块未写最终差异审计结论。 |
| 是否列出审计对象 | pass | 已覆盖旧正式 03 和旧 `03_ddd_step_*.md`。 |
| 是否列出污染候选 | pass | 已覆盖 `MethodContent`、publish、snapshot、fingerprint、outbox、P0 / P1、plugin / configuration、lifecycle 等候选族。 |
| 是否给出判定维度 | pass | 已按领域主语、模块、对象、port、protocol、flow、state、persistence、error、config / test / handoff 分维度。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块未修改正式 03。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 用户已确认进入 Step 1 `R1.8 历史 03 差异审计:再写入`;本模块写入后只允许等待用户确认进入 `R1.9 风险与待确认输入:先思考`。

---

## R1.8 历史 03 差异审计:再写入

### 1. 扫描范围记录

本模块按 `R1.7` 的计划审计旧正式 `03-详细设计.md` 和旧 `03_ddd_step_02`~`03_ddd_step_19`。当前 `03_ddd_step_01_input_boundary.md` 已被本轮 full-restart 重写,不再作为旧 Step 1 结论审计对象。

| 扫描对象 | 命中规模 | 审计结论 |
|---|---:|---|
| 旧正式 `03-详细设计.md` | 1381 | 高污染。旧正文整体围绕 P0 方法定义发布同步闭环、`MethodContent`、publish、snapshot、fingerprint、outbox 和 P1 后置展开,不得作为新版 03 基线。 |
| 旧 `03_ddd_step_02_scope.md` | 108 | 高污染。旧范围仍以 P0 / P1 和发布同步闭环为中心。 |
| 旧 `03_ddd_step_03_runtime_constraints.md` | 28 | 中污染。主要是旧 P0 / P1 和 runtime 约束残留。 |
| 旧 `03_ddd_step_04_module_layout.md` | 137 | 高污染。旧 crate / 文件树以 `MethodContent`、snapshot、outbox relay、P1 扩展为主。 |
| 旧 `03_ddd_step_05_module_contracts.md` | 88 | 高污染。旧模块主轴不是当前 02 八个组成部分。 |
| 旧 `03_ddd_step_06_object_contracts.md` | 179 | 高污染。旧对象契约以 `MethodContent`、`DefinitionSnapshot`、`OutboxEvent`、P1 对象为中心。 |
| 旧 `03_ddd_step_07_trait_port_adapter.md` | 116 | 高污染。旧 port / repository / adapter 以 `MethodContentRepository`、snapshot repository、outbox repository 为中心。 |
| 旧 `03_ddd_step_08_protocol_contracts.md` | 273 | 高污染。旧协议以 draft / review / publish / deprecate / retire / supersede 命令为中心。 |
| 旧 `03_ddd_step_09_function_flows.md` | 437 | 高污染。旧函数流以发布同步、outbox relay、snapshot export、fingerprint job 为中心。 |
| 旧 `03_ddd_step_10_state_machine.md` | 176 | 高污染。旧状态机以 `MethodContentLifecycle`、outbox、idempotency、job 为中心。 |
| 旧 `03_ddd_step_11_persistence_tx_consistency.md` | 171 | 高污染。旧表结构和事务以 `method_contents`、snapshot、outbox、projection checkpoint 为中心。 |
| 旧 Step 12~19 | 749 | 高污染。错误、并发、配置、观测、测试、实施承接和正式装配均沿用旧 P0 / P1 主线。 |

上述命中规模只表示 `R1.7` 关键词族的粗略命中数,不是逐条缺陷数量。

### 2. 污染候选命中表

| 候选族 | 旧位置示例 | 风险类型 | 判定 |
|---|---|---|---|
| 旧内容主语 `MethodContent` | 旧正式 03 §2、§5、§6、§8、§9、§10;旧 Step 4~11 | 旧对象中心替代当前方法资产定义与目录、正式化与版本、受控消费、追溯、关系、外部摘要、维护和外围组织八个组成部分。 | `discard` / `needs_current_step_redefinition` |
| publish / `PublishMethodContent` | 旧正式 03 §7~§9;旧 Step 8~9 | 把 publish 命令当作正式化主线,压过当前 02 的正式化与版本语义。 | `discard` / `rename_and_rederive` |
| `DefinitionSnapshot` / snapshot | 旧正式 03 §7、§10、§11;旧 Step 6~11 | 把 snapshot 当作同步和下游消费基础,容易绕过当前受控消费、read material 和 summary/ref-only 边界。 | `discard` / `needs_later_step_redefinition` |
| fingerprint / drift | 旧正式 03 §5、§8、§13、§14;旧 Step 8、13、14、18 | 把 fingerprint 当成版本和一致性中心,与当前正式化依据、追溯材料和维护诊断边界混淆。 | `discard` / `rename_and_rederive` |
| outbox / `OutboxEvent` / delivery | 旧正式 03 §7~§13;旧 Step 7~13、15~17 | 把可靠投递机制提前写成核心成立路径,与当前 Outbound Event 只作为协议骨架和后续契约展开的顺序冲突。 | `discard` / `needs_step8_to_step13_redefinition` |
| P0 / P1 旧阶段语言 | 旧正式 03 全文;旧 Step 2~19 | 用旧阶段范围遮蔽当前 core / support / operation / peripheral 边界。 | `discard` |
| plugin / configuration 旧 P1 线 | 旧正式 03 §2、§4、§5、§7、§17;旧 Step 4~8、14、17、18 | 把外围增强与核心闭环相邻书写,容易被误读成实施前置。 | `discard` / `rename_and_rederive` |
| lifecycle 旧状态机 | 旧正式 03 §5、§9、§10、§12、§13;旧 Step 6、10、12、13 | 沿用 `MethodContentLifecycle` 和 outbox 状态,不能覆盖当前 02 的多 owner 状态族。 | `discard` / `needs_step10_redefinition` |

### 3. 禁入清单

以下内容不得正向进入新版 `03-详细设计.md`:

| 禁入项 | 禁入原因 |
|---|---|
| 以 `MethodContent` 作为总聚合根和总对象中心 | 当前 02 已改为八个主要组成部分与对象家族,旧总对象会吞并 definition、formalization、consumption、trace、relation、external、maintenance、peripheral 的 owner。 |
| 以 draft / review / publish / deprecated / retired / superseded 作为主 lifecycle | 当前状态必须从正式 02 的状态 owner 重新展开,不能继承旧 `MethodContentLifecycle`。 |
| `PublishMethodContent` 作为正式化主命令 | 当前 02 使用“正式化与版本”主语,不能把 publish 当成业务成立语义。 |
| `DefinitionSnapshot` 作为默认下游消费 truth 或同步 truth | 当前 02 要求核心 truth 与读取材料分层,外部材料 summary/ref-only,不得用 snapshot 简化边界。 |
| `CanonicalFingerprint` / drift 作为版本或一致性唯一中心 | 当前 02 要求正式化依据、追溯材料、影响摘要和维护诊断分层。 |
| `OutboxEvent` / delivery 机制作为核心成立条件 | 当前 02 的 Outbound Event 是接口骨架候选,详细投递、retry、worker、transaction 需在后续 Step 按当前对象和 flow 重定义。 |
| 旧 P0 / P1 范围语言作为当前详细设计范围 | 当前 03 必须改用 core / support / operation / peripheral 和当前正式 00/01/02 的边界。 |
| P1 plugin / configuration 旧实现主线 | 当前外围包与方法集组织是 peripheral 组成部分,不得继承旧 P1 plugin/configuration 设计。 |
| 旧表结构、repository、port、DTO、error code、metric、test case、implementation commit 切片 | 它们均由旧对象和旧流程推导,不能绕过当前 Step 5~17 重建。 |

### 4. 待重定义清单

部分旧内容表达了仍需要解决的问题,但必须换成当前 02 主语重新定义:

| 旧事实线索 | 新版重定义位置 | 重定义要求 |
|---|---|---|
| 方法资产定义 truth | Step 5 / Step 6 | 用“方法资产定义与目录”重新定义模块 owner、对象、typed ref、目录视图和边界规则。 |
| 正式版本成立与依据 | Step 6 / Step 8 / Step 9 / Step 10 | 用“正式化与版本”重新定义正式化对象、依据 summary/ref、command / flow / state,不得复用 publish schema。 |
| 下游可消费材料 | Step 6 / Step 7 / Step 8 / Step 9 / Step 11 | 用“受控消费”重新定义 consumption material、availability view、boundary guard、read material 和 persistence。 |
| 追溯、影响摘要、审计线索 | Step 6 / Step 9 / Step 12 / Step 15 | 用“追溯与一致性保护”重新定义 trace material、impact summary、audit trail、lineage 和 safe diagnostic。 |
| 关系与分发语义 | Step 5~Step 11 | 用 support 组成部分重新定义 relation、distribution context、integrity rule 和 read material。 |
| 外部依据和 artifact / governance ref | Step 6 / Step 7 / Step 8 / Step 12 / Step 14 | 用“外部摘要与引用”重新定义 summary/ref/marker,不得保存外部正文。 |
| 维护、刷新、收敛、恢复 | Step 8~Step 15 | 用 operation/support 组成部分重新定义 job protocol、flow、state、error、config 和 observability,不得修 core truth。 |
| 外围包与方法集组织 | Step 5~Step 14 | 用 peripheral 组成部分重新定义 package、method set、marketplace context ref 和降级语义,不得恢复旧 P1 plugin/configuration 主链。 |

### 5. 改动前后对比

| 方案 | 优点 | 风险 | 本轮结论 |
|---|---|---|---|
| 续写旧 03 | 表面进度最快,旧材料行数和细节多。 | 高概率继承旧 `MethodContent` / publish / snapshot / outbox / P0-P1 主线,与当前 02 冲突。 | 不采用。 |
| 直接重写正式 03 | 可以快速生成新正文。 | 容易跳过先思考后写入、旧材料审计、风险输入和 Step 6+ 小循环,后续实现仍会缺 schema / port / flow 闭口。 | 不采用。 |
| 按 SOP full-restart,旧材料后置审计 | 逐步承接当前 00/01/02,能隔离旧污染,也能保留需重定义的问题线索。 | 需要更多中间产物和用户确认。 | 采用。 |

### 6. 设计取舍

本轮 `03-详细设计` 的正式基线只能来自当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和本轮新生成的 `03_ddd_*` 中间产物。

旧正式 03 与旧 Step 2~19 的内容只保留三类用途:

- 解释为什么不能续写旧方案。
- 帮助识别后续 Step 需要重新定义的问题线索。
- 在对应 Step 的旧材料差异审计中作为反例或待重定义来源。

旧内容不得作为对象字段、trait 签名、protocol schema、函数处理流、状态矩阵、DDL、错误码、配置 key、测试 case 或实施 commit 边界的直接来源。

### 7. 下一写入边界

下一步只允许进入:

```text
R1.9 风险与待确认输入:先思考
```

`R1.9` 应思考:

- `R1.6` 上游输入边界和 `R1.8` 差异审计之后,还有哪些输入不足风险。
- 哪些风险会阻塞 Step 2,哪些只影响后续 Step 5~18。
- 哪些旧材料待重定义项需要进入 Step 1 风险 / 待确认清单。
- 下一模块 `R1.10 风险与待确认输入:再写入` 的写入边界。

`R1.9` 不得写入:

- 正式 `03-详细设计.md` 正文修改。
- Step 2 范围正文。
- 对象、port、protocol、flow、state 详细契约。
- 未经用户确认直接关闭 Step 1。

### 8. 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否写入扫描范围记录 | pass | 已覆盖旧正式 03 和旧 Step 2~19。 |
| 是否写入污染候选命中表 | pass | 已按 R1.7 候选族判定风险类型。 |
| 是否写入禁入清单 | pass | 已明确旧主线、旧对象、旧接口、旧状态和旧实施切片不得正向进入新版 03。 |
| 是否写入待重定义清单 | pass | 已把可保留的问题线索分派到后续 Step。 |
| 是否写入改动前后对比和设计取舍 | pass | 已固定 full-restart 与旧材料后置审计方案。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只改中间产物。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 用户已确认进入 Step 1 `R1.9 风险与待确认输入:先思考`;本模块写入后只允许等待用户确认进入 `R1.10 风险与待确认输入:再写入`。

---

## R1.9 风险与待确认输入:先思考

### 1. 本模块定位

本模块只思考 Step 1 的输入不足风险和待确认事项候选,不写最终风险表,不修改正式 `03-详细设计.md`,不进入 Step 2。

本模块的核心判断是:当前正式 `00/01/02` 已足够支撑 `03-详细设计` 继续进入 Step 2,但 `03` 后续 Step 在对象、port、protocol、flow、state、persistence、error、config、test 和 handoff 处必须按当前 02 重新闭口。不能因为旧 03 材料很完整就把旧结论当成可落码来源。

### 2. 风险来源池

| 来源 | 候选风险 | 初步影响 |
|---|---|---|
| 正式 `02-概要设计.md` §13 | 回退规则被削弱、实现端私补口、Query / Consumer / Job / Publisher 边界翻转、配置绕过 invariant。 | 这些是 03 全程需要保留的设计风险。 |
| `R1.6` 上游输入边界 | 03 只能承接 00 / 01 / 02,不得重定义需求、架构和概要主语。 | 若后续发现要改主语,必须回退对应上游文档。 |
| `R1.8` 旧材料差异审计 | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P0-P1 主线污染后续 Step。 | 影响 Step 2~17 的范围、对象、接口、流程、状态和实施承接。 |
| `02` §12 详细设计承接清单 | Step 5~17 仍需补字段、签名、schema、flow、state、transaction、error、config、observability、test。 | 不阻塞 Step 2,但会阻塞后续可落码性。 |
| 规范与 SOP | 缺 schema / port / DTO / mapper / config / evidence schema 时不得实现端自行补口。 | 需要作为后续 Step 风险和停审门禁。 |

### 3. Step 2 阻塞判断

当前没有发现必须阻塞进入 Step 2 的输入缺口。

| 判断项 | 初步结论 | 理由 |
|---|---|---|
| 00 / 01 / 02 是否可作为输入 | 不阻塞 | 三份正式文档已完成 full-restart,可作为 03 上游。 |
| 02 是否明确代码主体和组成部分 | 不阻塞 | 正式 02 已明确八个组成部分、分层、对象轮廓、接口骨架、处理流和状态族。 |
| 旧 03 污染是否已隔离 | 不阻塞 | `R1.8` 已形成禁入清单和待重定义清单。 |
| 03 是否能进入范围讨论 | 不阻塞 | Step 2 可基于当前 02 和禁入清单定义本轮详细设计范围 / 非范围。 |
| 是否存在必须回退概要的主语冲突 | 暂未发现 | 当前 R1.6 / R1.8 均指向“按当前 02 继续展开”,未要求改写概要主语。 |

### 4. 后续 Step 风险候选

以下候选不阻塞 Step 2,但必须进入 `R1.10` 的风险 / 待确认输入表或后续 Step 门禁:

| 候选 | 可能影响 Step | 初步处理 |
|---|---|---|
| 旧对象主线回流 | Step 2 / 5 / 6 | Step 2 明确非范围;Step 5 / 6 只能从当前八个组成部分重建模块和对象。 |
| 正式化与 publish 混淆 | Step 6 / 8 / 9 / 10 | 后续必须用“正式化与版本”重新定义对象、协议、flow、状态。 |
| snapshot / fingerprint / outbox 机制提前固化 | Step 7~13 | 只能在当前对象和 flow 闭口后再定义 port、event、persistence、并发和幂等。 |
| 下游消费、外部依据和 artifact ref 来源不清 | Step 6~9 / 12 / 14 | 必须保留 summary/ref/body-free 边界,缺正式来源时暂停闭口。 |
| Query / Consumer / Job / Publisher 边界翻转 | Step 8 / 9 / 12 / 13 | Query no-write、Consumer 不生成 core truth、Job 不修 core truth、Publisher failure 不回滚 truth。 |
| 配置越权 | Step 14 / 04 | 配置只能影响装配、adapter、job、transport、profile 和降级语义。 |
| 旧实施切片污染新实施承接 | Step 17 / 07 | 实施计划必须由新版 03/05/06/07 重新审计,不得继承旧 commit boundary。 |

### 5. 待确认事项候选

以下事项可能需要进入 `R1.10` 待确认输入表,但本模块不做最终裁决:

| 候选事项 | 影响范围 | 当前挂起口径 |
|---|---|---|
| 下游消费影响摘要的正式来源与承接责任 | 追溯与一致性保护、受控消费、接口和处理流。 | 03 只可定义本仓 summary / typed ref / safe marker,不得推断下游运行 truth。 |
| 外部依据、artifact / archive ref、治理依据的可用性口径 | 外部摘要与引用、正式化依据、错误恢复和配置绑定。 | 03 必须坚持 body-free 和 summary/ref-only;不可用时只能安全阻断或挂起。 |
| 外围 package / method set 与 marketplace context 的演进范围 | 外围包与方法集组织、配置影响、后续实施范围。 | peripheral 不阻塞 core;marketplace listing / install / fulfillment truth 不进入本仓。 |
| 当前 03 是否需要为所有八个组成部分同等深度展开 | Step 2 / 5~17 | Step 2 需区分本轮详细设计必须闭口的 core/support/operation/peripheral 深度。 |
| 旧材料中仍可能保留的事实如何进入后续 Step | Step 5~17 | 只能通过当前 00/01/02 或新 Step 重新命名、重新归属、重新闭口。 |

### 6. R1.10 写入策略

`R1.10` 应把本模块候选压缩为 Step 1 输入风险和待确认事项,不应展开后续 Step 的详细契约。

建议 `R1.10` 写入:

| 输出块 | 内容 |
|---|---|
| 输入风险表 | 只列会影响 03 Step 2~19 执行纪律和上游输入稳定性的风险。 |
| 待确认事项表 | 只列当前仍需后续 Step 或上游负责人确认的事项。 |
| 阻塞判断 | 明确是否阻塞 Step 2;若不阻塞,说明为什么。 |
| 后续分派 | 把候选分派到 Step 2、Step 5~17 或 Step 18。 |
| 下一模块门禁 | 放行 `R1.11 回填草稿:先思考`,仍不得修改正式 03。 |

### 7. 本模块不得做的事

| 禁止事项 | 原因 |
|---|---|
| 不写最终风险 / 待确认表 | 这是先思考模块,结论留给 `R1.10`。 |
| 不修改正式 `03-详细设计.md` | 回填草稿尚未生成。 |
| 不进入 Step 2 | Step 1 仍未完成风险写入、回填草稿和停审。 |
| 不定义对象 / port / protocol / flow / state | 后续 Step 才能展开这些契约。 |
| 不把旧材料待重定义项写成已确认契约 | 旧材料只能作为后续重新闭口线索。 |

### 8. 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只思考风险候选 | pass | 未写最终风险表或待确认表。 |
| 是否判断 Step 2 阻塞情况 | pass | 当前初判不阻塞 Step 2。 |
| 是否承接 R1.6 / R1.8 | pass | 已把上游输入边界和旧材料禁入清单转成风险来源。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 用户已确认进入 Step 1 `R1.10 风险与待确认输入:再写入`;本模块写入后只允许等待用户确认进入 `R1.11 回填草稿:先思考`。

---

## R1.10 风险与待确认输入:再写入

### 1. 输入风险表

以下风险不阻塞 Step 2,但必须在后续 Step 和正式 `§17` 草稿中持续保留。

| 风险 | 影响 | 当前处理口径 | 分派 |
|---|---|---|---|
| 详细设计削弱概要回退规则或重分配职责 | 可能在 03 中暗改 `00/01/02` 已收稳的需求、架构、组成部分、对象 owner、接口族、流程类型或配置职责。 | 若后续发现需要改代码主体框架、组成部分、对象 owner、接口族、处理流或配置职责,必须回退对应上游文档,不得在 03 私自修正。 | Step 2 / Step 5 / Step 17 / Step 18 |
| 实现端私补对象、接口、状态或配置口径 | 缺 schema、port、DTO、mapper、state、config key、test evidence schema 时,实现端可能自行发明占位规则。 | 后续 Step 必须把可落码闭口写清;发现缺口时暂停回设计闭口,不得交给实现仓自行决定。 | Step 6~17 / Step 18 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线回流 | 可能污染本轮详细设计范围、对象、protocol、flow、state、persistence 和实施承接。 | 旧主线只作 historical material;所有仍需保留的事实必须按当前 02 八个组成部分重新命名、归属和闭口。 | Step 2 / Step 5~17 |
| Query / Consumer / Job / Publisher 边界被翻转 | Query 可能写 truth,Consumer 可能生成 core truth,Job 可能修 core truth,Publisher failure 可能回滚已成立 truth。 | 保持 Query no-write、Consumer 不生成 core truth、Job 不修 core truth、Publisher / handoff failure 不回滚 truth。 | Step 8 / Step 9 / Step 12 / Step 13 |
| 配置绕过 domain invariant、truth owner 或状态机 | 配置可能把 peripheral、external、marketplace 或下游状态提升为 core 前置。 | 配置只能影响装配、adapter、job、transport、profile 和降级语义;不得改变 Definition vs Use、truth owner、状态机或 body-free 禁区。 | Step 14 / 04-配置设计 |
| 旧实施切片污染新版实施承接 | 旧 commit boundary、test case、evidence 或任务切片可能被误继承。 | 实施计划必须由新版 03 / 05 / 06 / 07 重新审计,不得继承旧 implementation boundary。 | Step 17 / 07-实施计划 |

### 2. 待确认事项表

以下事项不阻塞 Step 2,但会影响后续详细设计深度、闭口方式或实施门禁。

| 待确认事项 | 影响范围 | 当前挂起口径 | 分派 |
|---|---|---|---|
| 下游消费影响摘要的正式来源与承接责任 | 受控消费、追溯与一致性保护、接口、处理流和 read material。 | 本仓只定义 summary / typed ref / safe marker;不得扫描、复制或推断下游运行 truth。 | Step 6 / Step 7 / Step 8 / Step 9 / Step 12 |
| 外部依据、artifact / archive ref、治理依据的可用性口径 | 外部摘要与引用、正式化依据、错误恢复和配置绑定。 | 坚持 body-free 和 summary/ref-only;不可用只能安全阻断、挂起或降级,不得回滚已成立 truth。 | Step 6 / Step 8 / Step 12 / Step 14 |
| 外围 package / method set 与 marketplace context 的演进范围 | 外围包与方法集组织、配置影响和后续实施范围。 | peripheral 不阻塞 core;marketplace listing / install / fulfillment truth 不进入本仓。 | Step 5 / Step 6 / Step 8 / Step 14 / Step 17 |
| 八个组成部分在本轮 03 中的展开深度 | Step 2 范围、Step 5 模块契约和 Step 6~17 详细程度。 | Step 2 需要区分必须完整闭口、可保留骨架、后续文档承接的深度;不得平均铺开后导致重点不足。 | Step 2 / Step 5 / Step 17 |
| 旧材料中可保留事实的进入方式 | Step 5~17 的旧材料差异审计和回填草稿。 | 只能通过当前 00/01/02 或新 Step 重新命名、重新归属、重新闭口后进入;不能复制旧字段、签名、DDL、错误码或测试。 | Step 5~17 |

### 3. Step 2 阻塞判断

当前判断:不阻塞进入 Step 2。

| 判断项 | 结论 | 说明 |
|---|---|---|
| 上游输入是否完整 | pass | `00/01/02` 已完成 full-restart,正式 02 可作为 03 直接输入。 |
| 历史污染是否已隔离 | pass | `R1.8` 已写出禁入清单和待重定义清单。 |
| 风险是否需要回退概要 | no | 当前风险主要是后续 03 执行纪律和闭口门禁,未发现必须改写 02 主语的冲突。 |
| 是否可以进入详细设计范围讨论 | pass | Step 2 可在当前 02 和本 Step 禁入 / 风险口径下定义本轮范围与非范围。 |
| 是否允许直接进入 Step 2 | no | Step 1 仍需完成回填草稿和自检停审。 |

### 4. 后续分派

| 后续位置 | 必须承接的 Step 1 结论 |
|---|---|
| Step 2 范围与非范围 | 明确旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P0-P1 主线禁入;明确八个组成部分的展开深度。 |
| Step 5 模块实现契约 | 从当前 02 八个组成部分建立模块 owner,不得复用旧 13 个 P0 模块。 |
| Step 6 对象契约 | 从当前对象轮廓重建字段、状态、工厂和不变量,不得复制旧 `MethodContent` / `DefinitionSnapshot` / `OutboxEvent`。 |
| Step 7 / 8 / 9 | 按当前 port / protocol / function flow 重新闭口,不得沿用旧 repository、publish command、snapshot export 或 outbox relay。 |
| Step 10~13 | 状态、持久化、错误、并发和幂等必须从新版对象和 flow 推导。 |
| Step 14~17 | 配置、观测、测试和实施承接不得继承旧 config key、metric、test case 或 commit boundary。 |
| Step 18 | 若后续仍有未关闭事项,统一收口到正式详细设计风险与待确认事项。 |

### 5. 下一写入边界

下一步只允许进入:

```text
R1.11 回填草稿:先思考
```

`R1.11` 应思考:

- 正式 `03-详细设计.md` §1 与上游文档关系声明应如何承接 `R1.1`~`R1.10`。
- 正式 `§17` 风险与待确认事项应如何引用本 Step 风险和待确认候选。
- 哪些内容只能留在中间产物,不能进入正式 03。
- `R1.12 回填草稿:再写入` 的写入边界。

`R1.11` 不得写入:

- 正式 `03-详细设计.md` 正文修改。
- Step 2 范围正文。
- Step 1 停审结论。
- 完整正式 §1 / §17 草稿正文。

### 6. 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否写入输入风险表 | pass | 已列出 6 项后续需保留的设计风险。 |
| 是否写入待确认事项表 | pass | 已列出 5 项待确认事项。 |
| 是否判断 Step 2 阻塞 | pass | 当前不阻塞 Step 2,但仍需完成 Step 1 回填草稿和停审。 |
| 是否写入后续分派 | pass | 已分派到 Step 2、Step 5~18。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 用户已确认进入 Step 1 `R1.11 回填草稿:先思考`;本模块写入后只允许等待用户确认进入 `R1.12 回填草稿:再写入`。

---

## R1.11 回填草稿:先思考

### 1. 本模块定位

本模块只思考正式 `03-详细设计.md` §1 与 §17 的回填策略,不写完整回填草稿,不修改正式 `03-详细设计.md`,不进入 Step 2。

当前正式 `03-详细设计.md` 的 §1 与 §17 仍明显保留旧 P0 / `MethodContent` / publish / snapshot / fingerprint / outbox 主线。本模块的策略不是直接改正式正文,而是先确定 `R1.12` 在中间产物中应生成怎样的新版 §1 / §17 草稿,供后续确认和装配。

### 2. §1 回填策略

正式 §1 应压缩承接 `R1.1`~`R1.10` 的 Step 1 结论,只保留可以成为正式详细设计正文的收口内容。

| §1 子块 | 应写内容 | 不应写内容 |
|---|---|---|
| 上游关系映射 | 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、详细设计 SOP / 书写规范 / 中间产物规范对 03 的约束。 | 旧 P0 / P1、7 类 `MethodContent`、publish / snapshot / fingerprint / outbox 主链。 |
| 本文不再回答 | 需求目标、架构取舍、概要主语、八个组成部分、Definition vs Use、相邻仓非职责、外部 body-free 边界。 | 旧 “为什么 P0 MethodContent 是七类 subtype”等已经被当前 02 替换的问题。 |
| 本文必须回答 | Rust / module layout、模块契约、对象字段、trait / port、protocol schema、function flow、state、persistence、error、concurrency、config、observability、test、implementation handoff。 | 已由 00 / 01 / 02 收稳的需求、架构和概要结论。 |
| 历史材料声明 | 旧正式 03 和旧 `03_ddd_*` 只作 historical material;旧 completed 状态失效。 | 把旧文件当作当前设计来源或基线。 |

### 3. §17 回填策略

正式 §17 应只承接 Step 1 当前已识别、会影响后续详细设计和实现的风险 / 待确认事项。它不应成为旧 §17 的局部修补。

| §17 子块 | 应写内容 | 不应写内容 |
|---|---|---|
| 风险表 | `R1.10` 的 6 项风险压缩为正式表:回退规则被削弱、实现端私补口、旧主线回流、接口边界翻转、配置越权、旧实施切片污染。 | 旧 work direct、ResolveViewProfile、retire 重入、fingerprint audit 等旧 P0 细节。 |
| 待确认事项表 | `R1.10` 的 5 项待确认压缩为正式表:下游影响摘要来源、外部依据可用性、外围 package / method set 范围、八个组成部分展开深度、旧材料事实进入方式。 | 直接给出未讨论的 owner、schema、默认行为或实现细节。 |
| 阻塞范围 | 明确当前不阻塞进入 Step 2,但后续 Step 6~17 如缺正式 schema / port / DTO / mapper / state / config / evidence 必须暂停闭口。 | 把风险写成已经解决的实现契约。 |
| 后续分派 | 引导到 Step 2、Step 5~18 承接。 | 开始写 Step 2 范围正文。 |

### 4. 中间产物与正式正文边界

| 内容 | 留在中间产物 | 可进入正式 §1 / §17 |
|---|---|---|
| R1.1~R1.4 的开工、必读文档、框架对齐过程 | 是 | 只压缩为来源和方法说明。 |
| R1.5~R1.6 的上游关系和 SOP 问题回答 | 部分 | 可压缩进入 §1。 |
| R1.7~R1.8 的旧材料扫描计划、命中统计和详细审计过程 | 是 | 只压缩为“旧材料 historical material / 禁入主线”声明。 |
| R1.9~R1.10 的风险候选、筛选过程和分派 | 部分 | 可压缩进入 §17。 |
| Step 2 范围、对象、port、protocol、flow、state 细节 | 否 | 不进入 Step 1 回填草稿。 |

### 5. R1.12 写入策略

`R1.12` 应在本文件中写出正式 §1 / §17 的可回填草稿,但仍不修改正式 `03-详细设计.md`。

建议 `R1.12` 输出:

| 输出块 | 内容 |
|---|---|
| §1 草稿 | 上游关系映射、本文不再回答、本文必须回答、历史材料声明。 |
| §17 草稿 | 风险表、待确认事项表、阻塞范围和后续分派。 |
| 不进入正式正文清单 | 明确过程性内容、旧材料命中统计、Step 2 细节不得进入正式 §1 / §17。 |
| 下一模块门禁 | 放行 `R1.13 自检与停审:先思考`,仍不得修改正式 03。 |

### 6. 本模块不得做的事

| 禁止事项 | 原因 |
|---|---|
| 不写完整 §1 / §17 草稿 | 本模块是先思考,草稿留给 `R1.12`。 |
| 不修改正式 `03-详细设计.md` | 正式装配尚未到达。 |
| 不进入 Step 2 | Step 1 尚未自检和停审。 |
| 不把旧 §1 / §17 局部 patch 成新版 | 旧正文主线整体失效,应由当前中间产物重新生成草稿。 |

### 7. 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只思考回填策略 | pass | 未写完整正式草稿。 |
| 是否覆盖 §1 策略 | pass | 已明确上游关系、本文不再回答 / 必须回答和历史材料声明。 |
| 是否覆盖 §17 策略 | pass | 已明确风险表、待确认表、阻塞范围和分派。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.12 回填草稿:再写入`;只在中间产物中写正式 §1 / §17 可回填草稿,不得修改正式 `03-详细设计.md`,不得进入 Step 2。

---

## R1.12 回填草稿:再写入

### 1. 回填草稿状态

本模块只在当前中间产物中写出正式 `03-详细设计.md` §1 与 §17 的可回填草稿。正式 `03-详细设计.md` 仍保持未修改状态,后续是否装配、如何装配,需等待 Step 1 停审和后续正式装配门禁。

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 1 确认概要设计输入边界 |
| 当前模块 | `R1.12 回填草稿:再写入` |
| 上一模块 | `R1.11 回填草稿:先思考` |
| 本模块产物 | §1 可回填草稿、§17 可回填草稿、不进入正式正文清单、下一模块门禁 |
| 本模块禁止 | 修改正式 `03-详细设计.md`;进入 Step 2;定义对象、port、protocol、flow、state、persistence、config、test 或 implementation boundary |
| 下一模块 | `R1.13 自检与停审:先思考` |

### 2. §1 草稿:与上游文档的关系声明

#### 2.1 上游关系映射

本详细设计基于当前已完成 full-restart 的 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md` 展开。三份上游文档分别提供需求边界、架构边界和详细设计直接输入,本文不再重新讨论已经在上游收稳的目标、职责、依赖方向和概要组成部分。

| 上游输入 | 对本文的约束 | 本文承接方式 |
|---|---|---|
| `00-需求文档.md` | 固定仓定位、目标 / 非目标、使用方、依赖裁剪、核心能力、业务规则、接口与依赖、验收红线。 | 本文只把需求结论转译成可落码的对象、接口、处理流、状态、错误和测试切口,不得重写需求目标。 |
| `01-架构设计.md` | 固定职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性和通信方式。 | 本文只细化模块布局、依赖方向、port / adapter、事务一致性和外部交互契约,不得重画架构边界。 |
| `02-概要设计.md` | 固定代码主体框架、八个主要组成部分、关键对象轮廓、接口骨架、处理流、状态、异常、配置影响和详细设计承接清单。 | 本文从当前概要设计继续展开字段、签名、schema、函数级 flow、状态矩阵、持久化、错误、并发、配置、观测、测试和实施承接。 |
| `02_hld_step_12`~`02_hld_step_14` | 提供详细设计承接、风险 / 待确认事项和正式 02 装配来源。 | 仅作为解释性输入;若与正式 `02-概要设计.md` 冲突,以正式 02 为准。 |
| 详细设计 SOP / 书写规范 / 中间产物规范 | 固定逐 Step、先思考后写入、历史材料后置审计和可落码闭口要求。 | 本文按 Step 1~19 逐步生成中间产物,再由确认过的中间产物装配正式正文。 |

#### 2.2 本文不再回答

本文不再回答以下问题。若后续详细设计发现这些问题需要调整,必须回退对应上游文档,不得在 `03-详细设计.md` 内暗改。

| 不再回答的问题 | 已由何处回答 | 本文处理 |
|---|---|---|
| L3-method-library 的仓定位、目标、非目标、使用方和验收红线 | `00-需求文档.md` | 只承接为实现契约和测试切口。 |
| 本仓与 L0 / L1 / L2 / L3 相邻仓之间的职责边界和依赖方向 | `01-架构设计.md` | 只细化 import、port、adapter 和交互协议。 |
| Definition vs Use 的边界、相邻仓非职责、外部 body-free 禁区 | `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 只把禁区写成对象、port、protocol、flow、config 和错误恢复约束。 |
| 八个主要组成部分是否成立 | `02-概要设计.md` | 只继续展开每个组成部分的模块契约和实现契约。 |
| 方法资产、正式化与版本、受控消费、追溯一致性、关系分发、外部摘要、维护外围等概要主语 | `02-概要设计.md` | 不恢复旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线。 |
| package / method set / marketplace context 是否属于 core 前置 | `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 只按 peripheral 边界展开,不得提升为 core 成立条件。 |

#### 2.3 本文必须回答

本文必须把概要设计中尚未落到代码级的内容补齐到实现端不能自行补口的程度。

| 必须回答的问题 | 详细设计承接位置 |
|---|---|
| Rust / runtime / crate / module / 文件布局约束 | Step 3 / Step 4 |
| 八个组成部分到模块 owner、capability 和实现单元的映射 | Step 2 / Step 5 |
| 对象字段、typed ref、value object、aggregate、state carrier、factory 和 invariant | Step 6 |
| trait / port / adapter、repository、resolver、external client 和 mapper 契约 | Step 7 |
| API / Command / Query / Consumer / Event / Job / Publisher 协议 schema | Step 8 |
| 每个接口和 job 的函数级处理流、守卫、读写边界和降级分支 | Step 9 |
| 状态机、转换矩阵、合法迁移、禁止迁移和状态来源 | Step 10 |
| 持久化、索引、事务、一致性、read material 和 handoff 语义 | Step 11 |
| 错误模型、异常分支、恢复口径和安全对外信息 | Step 12 |
| 并发、幂等、重放、重入保护和重复请求处理 | Step 13 |
| 配置引用、外部依赖绑定、profile 和 feature flag 的边界 | Step 14 |
| 可观测性、审计埋点、metric、log、trace 和安全诊断 | Step 15 |
| 测试切口、最小验证清单、evidence 和 acceptance gate | Step 16 |
| 到实施计划的 commit boundary、任务切片和交付门禁 | Step 17 |

#### 2.4 历史材料声明

当前旧 `03-详细设计.md` 与旧 `design-calibration/03_ddd_step_02`~`03_ddd_step_19` 属于 historical material。它们可以用于识别旧主线、旧对象、旧接口、旧流程、旧状态和旧实施切片的污染风险,但不得作为本轮详细设计真相源。

以下旧主线不得正向进入新版 `03-详细设计.md`:旧 `MethodContent` 总对象、7 类 subtype、publish / published、`PublishMethodContent`、`DefinitionSnapshot`、fingerprint / drift、旧 outbox / delivery、旧 P0 / P1 阶段语言、旧 plugin / configuration 主链、旧 lifecycle 状态机、旧表结构、旧 repository、旧 protocol、旧 test case 和旧 commit boundary。若其中某些问题线索仍需保留,必须通过当前 `00/01/02` 或本轮新 Step 重新命名、重新归属、重新闭口后进入。

### 3. §17 草稿:风险与待确认事项

#### 3.1 设计风险表

以下风险不阻塞进入 Step 2,但必须在后续 Step 和最终正式正文中持续保留。

| 风险 | 影响 | 处理口径 | 分派 |
|---|---|---|---|
| 详细设计削弱概要回退规则或重分配职责 | 03 可能暗改 `00/01/02` 已收稳的需求、架构、组成部分、对象 owner、接口族、流程类型或配置职责。 | 若需要改代码主体框架、组成部分、对象 owner、接口族、处理流或配置职责,必须回退上游文档。 | Step 2 / Step 5 / Step 17 / Step 18 |
| 实现端私补对象、接口、状态或配置口径 | 缺 schema、port、DTO、mapper、state、config key、test evidence schema 时,实现端可能自行发明占位规则。 | 后续 Step 必须写到可落码闭口;发现缺口时暂停回设计闭口。 | Step 6~17 / Step 18 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线回流 | 旧主线可能污染范围、对象、protocol、flow、state、persistence 和实施承接。 | 旧主线只作 historical material;仍需保留的事实必须按当前八个组成部分重新命名、归属和闭口。 | Step 2 / Step 5~17 |
| Query / Consumer / Job / Publisher 边界被翻转 | Query 可能写 truth,Consumer 可能生成 core truth,Job 可能修 core truth,Publisher failure 可能回滚已成立 truth。 | 保持 Query no-write、Consumer 不生成 core truth、Job 不修 core truth、Publisher / handoff failure 不回滚 truth。 | Step 8 / Step 9 / Step 12 / Step 13 |
| 配置绕过 domain invariant、truth owner 或状态机 | 配置可能把 peripheral、external、marketplace 或下游状态提升为 core 前置。 | 配置只能影响装配、adapter、job、transport、profile 和降级语义,不得改变 Definition vs Use、truth owner、状态机或 body-free 禁区。 | Step 14 / `04-配置设计.md` |
| 旧实施切片污染新版实施承接 | 旧 commit boundary、test case、evidence 或任务切片可能被误继承。 | 实施计划必须由新版 03 / 05 / 06 / 07 重新审计,不得继承旧 implementation boundary。 | Step 17 / `07-实施计划.md` |

#### 3.2 待确认事项表

以下事项不阻塞进入 Step 2,但会影响后续详细设计深度、闭口方式或实施门禁。

| 待确认事项 | 影响范围 | 当前挂起口径 | 分派 |
|---|---|---|---|
| 下游消费影响摘要的正式来源与承接责任 | 受控消费、追溯与一致性保护、接口、处理流和 read material。 | 本仓只定义 summary / typed ref / safe marker;不得扫描、复制或推断下游运行 truth。 | Step 6 / Step 7 / Step 8 / Step 9 / Step 12 |
| 外部依据、artifact / archive ref、治理依据的可用性口径 | 外部摘要与引用、正式化依据、错误恢复和配置绑定。 | 坚持 body-free 和 summary/ref-only;不可用只能安全阻断、挂起或降级,不得回滚已成立 truth。 | Step 6 / Step 8 / Step 12 / Step 14 |
| 外围 package / method set 与 marketplace context 的演进范围 | 外围包与方法集组织、配置影响和后续实施范围。 | peripheral 不阻塞 core;marketplace listing / install / fulfillment truth 不进入本仓。 | Step 5 / Step 6 / Step 8 / Step 14 / Step 17 |
| 八个组成部分在本轮 03 中的展开深度 | Step 2 范围、Step 5 模块契约和 Step 6~17 详细程度。 | Step 2 需要区分必须完整闭口、可保留骨架、后续文档承接的深度。 | Step 2 / Step 5 / Step 17 |
| 旧材料中可保留事实的进入方式 | Step 5~17 的旧材料差异审计和回填草稿。 | 只能通过当前 00/01/02 或新 Step 重新命名、重新归属、重新闭口后进入。 | Step 5~17 |

#### 3.3 阻塞范围

当前 Step 1 判断:上述风险和待确认事项不阻塞进入 Step 2。Step 2 可以基于当前正式 `00/01/02`、旧材料禁入清单和本节风险口径继续定义详细设计范围与非范围。

但后续 Step 如发现以下缺口,必须暂停并回设计闭口,不得交由实现端自行决定:

| 缺口类型 | 暂停条件 |
|---|---|
| object / value / typed ref schema | 字段名、必填性、来源、状态 carrier、factory、invariant 未闭合。 |
| trait / port / adapter / mapper | 方法名、输入输出、错误、事务边界、read/write 权限或 mapper 来源未闭合。 |
| protocol / DTO / event / job | public schema、marker、response / rejection、replay surface 或 event payload 未闭合。 |
| function flow / state / persistence | 分支处理、状态迁移、写入来源、索引、事务一致性或 read material 来源未闭合。 |
| config / observability / test evidence | config key、profile、metric、audit、test case、run artifact 或 evidence schema 未闭合。 |

#### 3.4 后续分派

| 后续位置 | 分派要求 |
|---|---|
| Step 2 | 固定本轮详细设计范围 / 非范围,明确八个组成部分的展开深度,并把旧主线列为非范围。 |
| Step 5 | 建立模块实现契约主轴,不得复用旧 P0 / P1 模块切片。 |
| Step 6~13 | 按当前 02 重新定义对象、port、protocol、flow、state、persistence、error、concurrency 和 idempotency。 |
| Step 14~17 | 重新定义配置、观测、测试和实施承接,不得继承旧 config key、metric、test case 或 commit boundary。 |
| Step 18 | 若后续仍有未关闭风险或待确认事项,统一收口到正式详细设计风险与待确认事项。 |

### 4. 不进入正式正文清单

以下内容只保留在中间产物,不得直接进入正式 §1 / §17:

| 内容 | 原因 |
|---|---|
| R1.1~R1.4 的开工过程、必读文档过程和 L1-governance 框架学习细节 | 正式正文只需说明来源和约束,不记录讨论过程。 |
| R1.7~R1.8 的旧材料命中规模和逐文件污染统计 | 正式正文只需声明旧材料定位、禁入主线和重定义规则。 |
| Step 2 的范围正文或非范围正文 | Step 2 尚未开始,不能在 Step 1 草稿中提前定义。 |
| 对象字段、port 签名、protocol schema、function flow、状态矩阵、DDL、错误码、配置 key、测试 case 和 commit boundary | 这些属于后续 Step,不能由 Step 1 回填草稿提前生成。 |
| 未经当前 `00/01/02` 或本轮新 Step 重新闭口的旧事实 | 旧材料只作 historical material,不能作为当前设计来源。 |

### 5. 本模块停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否写出 §1 可回填草稿 | pass | 已包含上游关系映射、本文不再回答、本文必须回答和历史材料声明。 |
| 是否写出 §17 可回填草稿 | pass | 已包含风险表、待确认事项表、阻塞范围和后续分派。 |
| 是否明确草稿只在中间产物中 | pass | 已声明正式 `03-详细设计.md` 未修改。 |
| 是否避免进入 Step 2 | pass | 未写 Step 2 范围正文。 |
| 是否避免定义后续契约 | pass | 未定义对象、port、protocol、flow、state、persistence、config、test 或 implementation boundary。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.13 自检与停审:先思考`;只思考 Step 1 自检清单和进入 Step 2 的停审条件,不得修改正式 `03-详细设计.md`,不得直接进入 Step 2。

---

## R1.13 自检与停审:先思考

### 1. 本模块定位

本模块只思考 Step 1 的自检清单、停审条件和 `R1.14 自检与停审:再写入` 的写入边界。它不关闭 Step 1,不修改正式 `03-详细设计.md`,不进入 Step 2。

Step 1 的停审判断必须同时满足三类约束:

| 约束来源 | 对 Step 1 停审的要求 |
|---|---|
| 详细设计 SOP | 已确认概要设计输入边界,能说明本文承接什么、不承接什么、哪些概要结论稳定、哪些风险进入后续 Step。 |
| 详细设计书写规范 | 正式正文只承载收口结论;问题回答、旧材料诊断、取舍和停审记录留在中间产物。 |
| 中间产物规范 | Step 内必须完成先思考后写入、结构化产物、回填草稿、自检和下一步门禁;用户每次确认只推进一个模块。 |

### 2. Step 1 已完成内容检查思路

`R1.14` 应按以下维度检查 `R1.1`~`R1.12` 是否足以关闭 Step 1。

| 检查维度 | 应检查内容 | 当前初判 |
|---|---|---|
| 必读文档 | 是否读取并记录项目台账、03 flow、正式 00 / 01 / 02、02 承接中间产物、详细设计 SOP / 书写规范 / 中间产物规范。 | pass |
| L1-governance 框架参考 | 是否只借鉴框架、状态表、门禁表达和历史材料隔离方式,未复制 governance 领域语义。 | pass |
| 上游关系映射 | 是否明确 00 / 01 / 02 分别约束需求、架构和概要输入,以及本文不再回答 / 必须回答的边界。 | pass |
| 历史 03 差异审计 | 是否把旧正式 03 和旧 03 Step 2~19 降级为 historical material,并形成禁入清单和待重定义清单。 | pass |
| 风险与待确认 | 是否区分不阻塞 Step 2 的风险、后续 Step 必须保留的门禁、待确认事项和分派位置。 | pass |
| 回填草稿 | 是否已在中间产物中写出 §1 / §17 可回填草稿,且未修改正式 03。 | pass |
| 当前状态一致性 | Step 文件、03 flow、项目台账是否都指向同一当前模块和 next_allowed_action。 | `R1.14` 写入前需再次检查 |

### 3. 进入 Step 2 的必要条件草案

`R1.14` 只有在以下条件都满足时,才能把 Step 1 关闭为 `completed` 并把 flow / 台账推进到 Step 2 等待状态。

| 条件 | 判断口径 |
|---|---|
| 正式 00 / 01 / 02 可作为输入 | 三份文档已完成本轮 full-restart,且当前 Step 未发现必须回退上游的主语冲突。 |
| 旧材料已隔离 | 旧 `03-详细设计.md` 和旧 `03_ddd_*` 的 completed 状态失效,只作 historical material。 |
| 禁入主线已固定 | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P0-P1 / plugin / lifecycle 等旧主线不得正向进入新版 03。 |
| Step 2 不被风险阻塞 | 当前 6 项风险和 5 项待确认不阻塞范围讨论,但必须进入后续 Step 门禁和分派。 |
| 正式 03 未被提前修改 | Step 1 只写中间产物,正式 `03-详细设计.md` 尚未进入装配。 |
| 未提前定义后续契约 | Step 1 未写对象字段、port 签名、protocol schema、function flow、状态矩阵、DDL、配置 key、测试 case 或 commit boundary。 |
| 三层恢复点一致 | `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、当前 Step 文件都允许下一步进入 Step 2 的首个模块,且禁止跳步。 |

### 4. 不能进入 Step 2 的触发条件草案

如果 `R1.14` 写入前发现以下任何情况,不得关闭 Step 1。

| 触发条件 | 处理口径 |
|---|---|
| 正式 `03-详细设计.md` 已被提前修改 | 暂停并回滚本轮不应产生的正式 03 修改,或请求用户确认如何处理已有修改。 |
| 00 / 01 / 02 与 Step 1 结论冲突 | 暂停,回到对应上游文档或当前 Step 修正输入边界。 |
| 旧主线仍被写成当前基线 | 暂停,补充旧材料禁入和待重定义口径。 |
| Step 1 草稿含 Step 2 范围正文或后续契约 | 暂停,拆回后续 Step。 |
| flow / 台账 / Step 文件恢复点不一致 | 先修复三层状态,不得凭对话记忆继续。 |
| 用户未确认进入 `R1.14` | 保持 wait_user_confirm,不得自动关闭 Step 1。 |

### 5. R1.14 写入策略

`R1.14` 应写入正式的 Step 1 自检与停审记录,并在通过时同步三层台账。

建议 `R1.14` 输出:

| 输出块 | 内容 |
|---|---|
| Step 1 完成项总表 | 汇总 R1.1~R1.13 完成项和状态。 |
| 停审检查表 | 对照进入 Step 2 的必要条件逐项给出 pass / fail。 |
| 未关闭事项分派表 | 把风险和待确认事项分派到 Step 2、Step 5~18。 |
| Step 1 关闭结论 | 若全部 pass,关闭 Step 1;若存在 fail,记录 blocker 并停在当前 Step。 |
| 三层状态更新 | 更新 Step 文件头、03 flow、项目台账到 Step 2 等待用户确认状态。 |

### 6. R1.14 不得做的事

| 禁止事项 | 原因 |
|---|---|
| 不直接写 Step 2 范围正文 | Step 2 需要独立先思考和再写入。 |
| 不修改正式 `03-详细设计.md` | 正式装配仍需后续门禁。 |
| 不把风险写成已解决 | 当前风险不阻塞 Step 2,但仍需后续 Step 承接。 |
| 不一次性推进多个模块 | 用户确认一次只允许进入 `R1.14`。 |

### 7. 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只思考自检与停审 | pass | 未关闭 Step 1。 |
| 是否给出进入 Step 2 条件草案 | pass | 已列出 7 项必要条件。 |
| 是否给出不能进入 Step 2 的触发条件 | pass | 已列出 6 项暂停条件。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |
| 是否进入 Step 2 | no | 当前仍停在 Step 1。 |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.14 自检与停审:再写入`;只写 Step 1 自检与停审记录,并在检查通过时把三层状态推进到 Step 2 等待状态;不得修改正式 `03-详细设计.md`,不得写 Step 2 正文。

---

## R1.14 自检与停审:再写入

### 1. Step 1 完成项总表

本模块写入 Step 1 关闭记录。当前检查通过,可以关闭 Step 1,并把三层状态推进到 Step 2 等待用户确认状态。

| 模块 | 状态 | 停审结论 |
|---|---|---|
| R1.1 开工与必读文档:先思考 | completed | 已列出输入、边界、历史材料处理和模块顺序。 |
| R1.2 开工与必读文档:再写入 | completed | 已写入开工记录、读取状态、Step 内计划和旧材料规则。 |
| R1.3 L1-governance 框架对齐:先思考 | completed | 已明确只参考框架,不复制 governance 领域语义。 |
| R1.4 L1-governance 框架对齐:再写入 | completed | 已固定本仓 Step 1 输出框架。 |
| R1.5 上游关系与输入边界:先思考 | completed | 已形成 00 / 01 / 02 到 03 的关系映射策略。 |
| R1.6 上游关系与输入边界:再写入 | completed | 已写入上游关系映射、本文不再回答 / 必须回答清单。 |
| R1.7 历史 03 差异审计:先思考 | completed | 已形成旧 03 / 旧 03_ddd 污染扫描计划。 |
| R1.8 历史 03 差异审计:再写入 | completed | 已写入禁入清单、待重定义清单、改动前后对比和设计取舍。 |
| R1.9 风险与待确认输入:先思考 | completed | 已筛选输入不足风险候选并判断不阻塞 Step 2。 |
| R1.10 风险与待确认输入:再写入 | completed | 已写入 6 项风险、5 项待确认事项和后续分派。 |
| R1.11 回填草稿:先思考 | completed | 已明确正式 §1 / §17 回填策略。 |
| R1.12 回填草稿:再写入 | completed | 已写入 §1 / §17 中间产物可回填草稿。 |
| R1.13 自检与停审:先思考 | completed | 已形成 Step 1 停审条件和暂停条件草案。 |
| R1.14 自检与停审:再写入 | completed | 本节写入 Step 1 关闭记录。 |

### 2. 停审检查表

| 停审条件 | 结果 | 说明 |
|---|---|---|
| 正式 00 / 01 / 02 可作为输入 | pass | 三份文档已完成本轮 full-restart,当前 Step 未发现必须回退上游的主语冲突。 |
| 旧材料已隔离 | pass | 旧 `03-详细设计.md` 和旧 `03_ddd_*` completed 状态失效,只作 historical material。 |
| 禁入主线已固定 | pass | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P0-P1 / plugin / lifecycle 等旧主线不得正向进入新版 03。 |
| Step 2 不被风险阻塞 | pass | 6 项风险和 5 项待确认不阻塞范围讨论,但必须进入后续 Step 门禁和分派。 |
| 正式 03 未被提前修改 | pass | `git diff --name-only -- projects/L3-method-library/03-详细设计.md` 无输出。 |
| 未提前定义后续契约 | pass | Step 1 未生成对象字段、port 签名、protocol schema、function flow、状态矩阵、DDL、配置 key、测试 case 或 commit boundary。 |
| 三层恢复点一致 | pass | Step 文件、03 flow、项目台账均允许推进到 Step 2 等待用户确认状态。 |

### 3. 未关闭事项分派表

| 未关闭事项 | 当前状态 | 后续分派 |
|---|---|---|
| 八个组成部分的展开深度 | 不阻塞 Step 2 | Step 2 必须明确 core / support / operation / peripheral 的本轮闭口深度。 |
| 旧主线禁入和可保留事实进入方式 | 不阻塞 Step 2 | Step 2 明确非范围;Step 5~17 按当前 00 / 01 / 02 重新命名、归属和闭口。 |
| 下游消费影响摘要来源 | 不阻塞 Step 2 | Step 6~9 / Step 12 重新定义 summary / typed ref / safe marker 来源。 |
| 外部依据、artifact / archive ref、治理依据可用性 | 不阻塞 Step 2 | Step 6 / Step 8 / Step 12 / Step 14 保持 body-free 和 summary/ref-only。 |
| Query / Consumer / Job / Publisher 边界 | 不阻塞 Step 2 | Step 8 / Step 9 / Step 12 / Step 13 明确 no-write、no-core-truth、no-rollback 边界。 |
| 配置不得越权 | 不阻塞 Step 2 | Step 14 和后续 `04-配置设计.md` 继续承接。 |
| 旧实施切片不得继承 | 不阻塞 Step 2 | Step 17 和后续 `07-实施计划.md` 重新审计。 |

### 4. Step 1 关闭结论

Step 1 `确认概要设计输入边界` 关闭结论: pass。

当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 可以作为本轮 `03-详细设计.md` 的输入。旧正式 `03-详细设计.md` 和旧 `03_ddd_*` 只作为 historical material,不得正向继承。当前风险与待确认事项不阻塞进入 Step 2,但必须进入后续 Step 的门禁和分派。

Step 2 启动前仍需用户确认。下一步只允许进入:

```text
Step 2 明确本轮实现范围和非范围
R2.1 开工与必读文档:先思考
```

现有 `design-calibration/03_ddd_step_02_scope.md` 在 `R2.1` 正式重建前仍按历史材料处理,不得直接继承其旧 completed 状态或旧范围结论。

### 5. 本模块自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否写入 Step 1 完成项总表 | pass | 已汇总 R1.1~R1.14。 |
| 是否写入停审检查表 | pass | 7 项进入 Step 2 条件均 pass。 |
| 是否写入未关闭事项分派 | pass | 已分派到 Step 2、Step 5~18、04 / 07。 |
| 是否关闭 Step 1 | pass | Step 1 可标记 completed。 |
| 是否修改正式 `03-详细设计.md` | no | 本模块只写中间产物。 |
| 是否写 Step 2 正文 | no | 仅推进到 Step 2 等待确认状态。 |

next_allowed_action: 等待用户确认后进入 `03-详细设计` Step 2 `R2.1 开工与必读文档:先思考`;不得直接继承旧 `03_ddd_step_02_scope.md`;不得修改正式 `03-详细设计.md`;不得跳过 Step 2 的先思考模块。
