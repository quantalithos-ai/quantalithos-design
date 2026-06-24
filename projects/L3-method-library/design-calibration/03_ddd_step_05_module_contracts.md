# Step 5. 定义模块实现契约主轴

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
> 回填章节: `projects/L3-method-library/03-详细设计.md` §5 模块实现契约
> 创建日期: 2026-06-22
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: `R5.18 自检与停审:再写入`
> 当前门禁: Step 5 completed;等待用户确认进入 Step 6 `R6.1 开工与必读文档:先思考`

---

## R5.1 开工与必读文档:先思考

### 1. 本模块要回答的问题

Step 5 不是续写旧 `03_ddd_step_05_module_contracts.md`。旧文件虽然标记为 `[x] 已确认`,但它仍围绕旧 6 crate、P0、`MethodContent`、snapshot、outbox relay、PostgreSQL 和 `domain::content` / `application::sync_services` 等旧主线展开,与当前 Step 4 的七个实现单元、workspace 多 crate、旧材料禁入和 full-restart 口径冲突。

本模块只回答以下问题:

| 问题 | 本轮判断 |
|---|---|
| Step 5 的工作对象是什么? | 基于 Step 4 的实现单元和文件布局,定义详细设计全文的模块实现契约主轴、模块职责、对外暴露、依赖边界和归属规则。 |
| Step 5 是否可以继承旧文件结论? | 不可以。旧 13 模块、旧 P0、`MethodContent`、snapshot、outbox、PostgreSQL 只作为 historical material 和污染样本。 |
| Step 5 是否等同于 Step 4 的七个 crate? | 不直接等同。七个实现单元是主输入;Step 5 需要判断模块主轴是否按七个实现单元、实现单元内部文件组、或 capability 小循环展开。 |
| Step 5 是否定义对象字段、trait 方法、DTO schema 或 flow? | 当前不开。Step 5 只定义模块主轴和归属门禁;对象字段在 Step 6,trait / port 在 Step 7,protocol 在 Step 8,flow 在 Step 9。 |
| Step 5 完成后应支持什么? | 后续 Step 6~16 能逐模块展开对象、port、protocol、flow、state、persistence、error、config、observability 和 test,而不是退回全仓总表。 |

### 2. 必读文档

#### 2.1 流程与规范

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点和 Step 5 当前门禁。 | 只作为恢复门禁。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 确认 Step 4 completed、Step 5 `R5.1` 当前动作和旧 Step 5 historical 定位。 | 作为文档级 flow 真相源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | 承接输入权威顺序和历史材料隔离规则。 | 不重新讨论上游边界。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | 承接本轮 03 范围、非范围和展开深度。 | 不恢复旧 P0 / P1。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md` | 承接语言、runtime、跨仓依赖、安全边界和缺口回设计规则。 | 作为模块依赖和禁止方向约束。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` | 承接 workspace 多 crate、七个实现单元、文件布局树、依赖方向预告和 Step 5 进入条件。 | Step 5 的直接前序输入。 |
| `standards/document/详细设计讨论流程_SOP.md` | 确认 Step 5 目标、输入、输出、应问问题和进入 Step 6 条件。 | 采用流程规则。 |
| `standards/document/详细设计书写规范.md` | 确认 §5 必须按模块展开,每个模块后续要承载对象、trait、函数、错误和测试切口。 | 作为正式 §5 草稿格式约束。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认单模块推进、先思考后写入和结构化中间产物要求。 | 作为本文件写入门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认模块主轴不能掩盖对象来源、port、DTO、state、mapper、config、evidence schema 缺口。 | 作为可落码红线。 |

#### 2.2 本仓正式输入

| 文档 | 读取目的 | Step 5 关注点 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 复核仓定位、能力边界、数据归属、接口与依赖、验收红线。 | 模块主轴不得突破 definition truth / Definition vs Use / body-free 边界。 |
| `projects/L3-method-library/01-架构设计.md` | 复核职责边界、依赖方向、系统上下文和数据所有权。 | 模块依赖方向不得反向破坏架构层约束。 |
| `projects/L3-method-library/02-概要设计.md` | 复核代码主体框架、八个主要组成部分、接口骨架、处理流、状态和承接清单。 | Step 5 的业务主语和 capability 来源。 |

#### 2.3 概要设计承接中间产物

| 中间产物 | 读取目的 | Step 5 关注点 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 理解代码主体框架和实现分层。 | 判断模块主轴如何承接代码主体。 |
| `02_hld_step_05_components_boundary.md` | 理解八个主要组成部分的职责边界。 | 防止业务组成部分被误拆成 crate 或单一模块。 |
| `02_hld_step_06_key_objects.md` | 读取关键对象轮廓。 | 只用于归属候选,不在 Step 5 定义字段。 |
| `02_hld_step_07_api_interface_skeleton.md` | 读取接口骨架。 | 判断 command / query / consumer / event / job 归属边界。 |
| `02_hld_step_08_processing_flows.md` | 读取处理流轮廓。 | 只用于模块 owner 提示,不写函数级 flow。 |
| `02_hld_step_09_state_flow.md` | 读取状态轮廓。 | 只用于 state owner 提示,不写状态矩阵。 |
| `02_hld_step_12_detailed_design_handoff.md` | 读取详细设计承接清单。 | 确认 Step 5 到 Step 6~17 的分工。 |
| `02_hld_step_13_risks_open_questions.md` | 读取风险和待确认事项。 | 判断模块主轴是否存在阻塞项。 |

#### 2.4 框架参考与历史材料

| 材料 | 当前定位 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | framework_reference | 只参考 Step 5 的结构、表格种类、依赖图和门禁表达;不得复制 governance 领域语义。 |
| 旧 `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | historical_material | 旧 completed 状态失效;只作差异审计和污染样本。 |
| 旧正式 `projects/L3-method-library/03-详细设计.md` §5 | historical_material | 只作后置差异审计,不得作为当前模块主轴来源。 |

### 3. 当前输入边界初判

| 输入类别 | 当前判断 | Step 5 影响 |
|---|---|---|
| Step 4 布局 | 已固定 workspace 多 crate和七个实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | Step 5 必须以这七个实现单元为第一承接骨架。 |
| Step 4 文件职责 | 已固定文件布局树和职责表。 | Step 5 不重写文件树,只定义模块主轴和归属规则。 |
| Step 4 依赖方向 | 已预告 `contracts -> core-contracts`, `domain -> contracts`, `application -> contracts/domain`, `infra -> application/domain/contracts`, entry -> `contracts/application/infra`。 | Step 5 需要把预告升级为正式 crate dependency matrix。 |
| 八个主要组成部分 | 正式 02 §5 是业务职责主线。 | Step 5 要映射到模块主轴,不得机械拆成八个 crate。 |
| 关键对象 / 接口 / flow / state | 正式 02 只给轮廓。 | Step 5 只做归属和 owner 提示,不得写字段、签名、schema、flow 或 state matrix。 |
| 旧 Step 5 | 旧 13 模块和 P0 / `MethodContent` 主线失效。 | 后续必须做差异审计并关闭污染。 |

### 4. Step 5 需要形成的输出池

| 输出 | 内容要求 | 不在本模块完成 |
|---|---|---|
| 模块主轴候选池 | 七个实现单元、实现单元内文件组、八组件 capability 小循环等候选。 | `R5.1` 只列计划,不裁决最终主轴。 |
| 模块总览表 | 模块、所属实现单元、职责、对外暴露、依赖对象。 | 后续裁决后写入。 |
| 模块依赖图 | 展示 compile / module 依赖方向和禁止反向依赖。 | 不在 `R5.1` 生成最终图。 |
| crate dependency matrix | 把 Step 4 预告收口为正式允许 / 禁止依赖矩阵。 | 后续模块写入。 |
| 业务组成部分到模块映射 | 八个主要组成部分如何跨 contracts / domain / application / infra / entry 承接。 | 后续模块写入。 |
| 代码主体归属规则 | 对象、trait、handler、repository、adapter、job runner 的归属门禁。 | 不定义具体字段或方法。 |
| 单模块小节模板 | 为后续 Step 6~16 保留对象、trait、函数、错误和测试切口展开位置。 | 不在当前写对象契约。 |
| 历史 Step 5 差异审计 | 旧 13 模块、`MethodContent`、snapshot、outbox、PostgreSQL 等处理。 | 后置到差异审计模块。 |

### 5. Step 5 模块顺序草案

| 顺序 | 模块 | 产物 | 门禁 |
|---:|---|---|---|
| R5.1 | 开工与必读文档:先思考 | 本节 | completed;只列问题、必读文档、输入边界、输出池和模块顺序。 |
| R5.2 | 开工与必读文档:再写入 | 开工记录、读取状态、Step 内计划、输入基线、旧材料规则 | completed;不写最终模块主轴。 |
| R5.3 | L1-governance 框架对齐:先思考 | 可借鉴框架和不得借鉴内容 | completed;只抽结构,不复制 governance 语义。 |
| R5.4 | L1-governance 框架对齐:再写入 | Step 5 框架对齐记录和输出模板 | completed;固定本仓 Step 5 输出结构。 |
| R5.5 | Step 4 承接与模块候选池:先思考 | 模块主轴候选、七实现单元承接、文件组候选 | completed;不裁决最终模块表。 |
| R5.6 | Step 4 承接与模块候选池:再写入 | 模块候选池和排除项 | completed;形成裁决输入。 |
| R5.7 | 业务组成部分到模块映射:先思考 | 八组件到 contracts / domain / application / infra / entry 映射草案 | completed;不写最终职责表。 |
| R5.8 | 业务组成部分到模块映射:再写入 | 业务组成部分到模块映射表 | completed;形成 §5 主体结论之一。 |
| R5.9 | 依赖矩阵与暴露边界:先思考 | crate dependency matrix、allowed / forbidden dependency、对外暴露草案 | completed;不写最终主轴。 |
| R5.10 | 依赖矩阵与暴露边界:再写入 | 依赖矩阵、暴露边界和禁止方向 | completed;形成 §5 主体结论之一。 |
| R5.11 | 模块主轴裁决:先思考 | 最终模块主轴和单模块小节模板草案 | completed;形成 R5.12 写入输入。 |
| R5.12 | 模块主轴裁决:再写入 | 模块总览表、模块依赖图、单模块小节模板 | completed;形成 §5 主体结论之一。 |
| R5.13 | 历史 Step 5 差异审计:先思考 | 旧 Step 5 污染扫描计划 | completed;只审计,不反推当前结论。 |
| R5.14 | 历史 Step 5 差异审计:再写入 | 旧内容禁入 / 后移 / 重定义表 | completed;关闭旧 Step 5 completed 污染。 |
| R5.15 | 回填草稿:先思考 | 正式 §5 回填策略 | completed;已形成回填策略,不修改正式 03。 |
| R5.16 | 回填草稿:再写入 | §5 回填草稿 | completed;仅写中间产物,未修改正式 03。 |
| R5.17 | 自检与停审:先思考 | Step 5 自检清单 | completed;已形成停审判断和 R5.18 写入边界。 |
| R5.18 | 自检与停审:再写入 | Step 5 停审记录 | completed;已关闭 Step 5,同步 flow / 台账到 Step 6 等待状态。 |

### 6. 下一写入边界

下一步只允许进入:

```text
R5.2 开工与必读文档:再写入
```

`R5.2` 应写入:

- Step 5 开工记录。
- 必读文档读取状态表。
- Step 内计划确认表。
- 当前输入基线。
- 旧 Step 5 历史材料处理规则。
- 下一模块 `R5.3 L1-governance 框架对齐:先思考` 的门禁。

`R5.2` 不得写入:

- 最终模块主轴。
- 模块总览表最终项。
- 模块依赖图最终项。
- crate dependency matrix 最终项。
- 对象字段、trait 方法、DTO schema、flow 步骤或状态矩阵。
- 正式 `03-详细设计.md` 正文。
- Step 6 对象实现契约。

### 7. 自检

| 检查项 | 结果 |
|---|---|
| 是否只进入 Step 5 第一个模块 | 是。 |
| 是否把旧 Step 5 降级为 historical material | 是。 |
| 是否未继承旧 13 模块 / P0 / `MethodContent` / snapshot / outbox / PostgreSQL | 是。 |
| 是否列出 Step 5 必读文档 | 是。 |
| 是否给出 Step 5 模块顺序 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 `R5.2` 或 Step 6 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.2 开工与必读文档:再写入`;只允许写入 Step 5 开工记录、读取状态、Step 内计划、输入基线和旧材料规则,不得直接修改正式 `03-详细设计.md`,不得写最终模块主轴,不得进入 `R5.3` 或 Step 6。

---

## R5.2 开工与必读文档:再写入

### 1. 开工记录

| 项目 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.2 开工与必读文档:再写入`。 |
| 本模块目标 | 将 `R5.1` 的思考结果固化为 Step 5 开工记录、读取状态、Step 内计划、当前输入基线和旧材料处理规则。 |
| 当前写入边界 | 只写 Step 5 开工类台账和门禁,不裁决最终模块主轴。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不写模块总览表最终项;不写 crate dependency matrix 最终项;不定义对象字段、trait 方法、DTO schema、flow 或 state matrix。 |
| 三层同步要求 | 本文件、`03_ddd_calibration_flow.md`、`project_execution_ledger.md` 必须同时推进到等待 `R5.3`。 |

### 2. 必读文档读取状态

| 文档 | 当前状态 | Step 5 使用方式 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | current_gate_read | 确认项目级恢复点允许进入 `R5.2`。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | current_gate_read | 确认详细设计 flow 当前 Step 为 Step 5,当前模块为 `R5.2`。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | current_gate_read | 确认 `R5.1` 已完成,本次只推进 `R5.2`。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` | direct_predecessor_baseline | Step 4 的七个实现单元、workspace 多 crate、文件布局树和依赖方向预告是 Step 5 直接输入。 |
| `projects/L3-method-library/00-需求文档.md` | canonical_input_registered | 作为仓定位、边界、业务规则和验收红线来源;在模块主轴裁决前按需重读。 |
| `projects/L3-method-library/01-架构设计.md` | canonical_input_registered | 作为职责边界、系统上下文、依赖方向和数据所有权来源;在依赖矩阵模块按需重读。 |
| `projects/L3-method-library/02-概要设计.md` | canonical_input_registered | 作为代码主体框架、八个主要组成部分、接口骨架、处理流和状态轮廓的直接输入。 |
| `projects/L3-method-library/design-calibration/02_hld_step_04_code_subject_framework.md` | supporting_input_registered | 后续用于判断代码主体框架如何落到七个实现单元。 |
| `projects/L3-method-library/design-calibration/02_hld_step_05_components_boundary.md` | supporting_input_registered | 后续用于八个业务组成部分到模块主轴的映射。 |
| `projects/L3-method-library/design-calibration/02_hld_step_06_key_objects.md` | supporting_input_registered | 后续只用于对象 owner 提示,不在 Step 5 写字段。 |
| `projects/L3-method-library/design-calibration/02_hld_step_07_api_interface_skeleton.md` | supporting_input_registered | 后续只用于 command / query / event / job 归属提示。 |
| `projects/L3-method-library/design-calibration/02_hld_step_08_processing_flows.md` | supporting_input_registered | 后续只用于 flow owner 提示,不写函数级步骤。 |
| `projects/L3-method-library/design-calibration/02_hld_step_09_state_flow.md` | supporting_input_registered | 后续只用于 state owner 提示,不写状态矩阵。 |
| `projects/L3-method-library/design-calibration/02_hld_step_12_detailed_design_handoff.md` | supporting_input_registered | 后续用于确认 Step 5 到 Step 6~17 的承接关系。 |
| `projects/L3-method-library/design-calibration/02_hld_step_13_risks_open_questions.md` | supporting_input_registered | 后续用于判断模块主轴是否暴露阻塞项。 |
| `standards/document/详细设计讨论流程_SOP.md` | normative_input_registered | 约束 Step 5 的目标、输入、输出和进入 Step 6 条件。 |
| `standards/document/详细设计书写规范.md` | normative_input_registered | 约束正式 §5 的写法和后续对象 / port / flow 展开位置。 |
| `standards/document/设计文档讨论中间产物规范.md` | normative_input_registered | 约束单模块推进、先思考后写入和中间产物结构。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | normative_input_registered | 约束不得自行补对象来源、port、DTO、state、mapper、config 或 evidence schema。 |
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | framework_reference_pending_for_R5.3 | 下一模块 `R5.3` 必须读取,只抽框架和门禁表达,不得复制 governance 领域语义。 |
| 旧 `projects/L3-method-library/03-详细设计.md` §5 | historical_material | 仅在差异审计模块使用,不得作为当前模块主轴来源。 |
| 旧 Step 5 内容 | historical_material | 旧 completed 状态失效,只作为污染样本。 |

### 3. Step 内计划确认表

| 顺序 | 模块 | 状态 | 完成 / 进入条件 |
|---:|---|---|---|
| R5.1 | 开工与必读文档:先思考 | completed | 已列出问题、必读文档、输入边界、输出池和模块顺序。 |
| R5.2 | 开工与必读文档:再写入 | completed | 已写入开工记录、读取状态、Step 内计划、输入基线和旧材料规则。 |
| R5.3 | L1-governance 框架对齐:先思考 | next | 用户确认后读取 L1-governance Step 5,抽取可借鉴框架和不得借鉴内容。 |
| R5.4 | L1-governance 框架对齐:再写入 | pending | 等 `R5.3` 完成后写入框架对齐记录和输出模板。 |
| R5.5 | Step 4 承接与模块候选池:先思考 | pending | 等框架对齐完成后,基于 Step 4 形成候选池。 |
| R5.6 | Step 4 承接与模块候选池:再写入 | completed | 已写入 Step 4 承接基线、模块主轴候选池、候选使用方式和排除项。 |
| R5.7 | 业务组成部分到模块映射:先思考 | completed | 已基于正式 02 的八个主要组成部分形成映射草案。 |
| R5.8 | 业务组成部分到模块映射:再写入 | completed | 已写入业务组成部分到模块映射表。 |
| R5.9 | 依赖矩阵与暴露边界:先思考 | completed | 已形成 compile / module dependency 与暴露边界草案。 |
| R5.10 | 依赖矩阵与暴露边界:再写入 | completed | 已写入依赖矩阵、暴露边界和禁止方向。 |
| R5.11 | 模块主轴裁决:先思考 | completed | 已判断最终模块主轴草案和单模块小节模板草案。 |
| R5.12 | 模块主轴裁决:再写入 | completed | 已写入模块总览、模块依赖图、小节模板和归属预告。 |
| R5.13 | 历史 Step 5 差异审计:先思考 | completed | 已形成污染类别、审计对象、判断规则和 R5.14 写入模板。 |
| R5.14 | 历史 Step 5 差异审计:再写入 | completed | 已写入旧内容禁入 / 后移 / 重定义表并关闭旧 completed 污染。 |
| R5.15 | 回填草稿:先思考 | next | 判断正式 §5 回填策略,不修改正式 03。 |
| R5.16 | 回填草稿:再写入 | pending | 仅在中间产物内写正式 §5 草稿。 |
| R5.17 | 自检与停审:先思考 | pending | 判断 Step 5 是否可进入 Step 6。 |
| R5.18 | 自检与停审:再写入 | pending | 关闭 Step 5,同步 flow / 台账到 Step 6 等待状态。 |

### 4. 当前输入基线

| 输入 | 已锁定内容 | Step 5 约束 |
|---|---|---|
| Step 4 实现单元 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | Step 5 必须以七个实现单元为第一承接骨架。 |
| Step 4 目标仓 | `/home/aris/Projects/quantalithos-method-library`。 | 模块主轴不得假设其他实现仓。 |
| Step 4 命名 | `crates/<role>`、`method-library-<role>`、`method_library_<role>`。 | 后续依赖矩阵和模块表必须沿用。 |
| Step 4 compile dependency 候选 | 只有 `core-contracts`。 | 其他项目关系默认非 Cargo compile 依赖,除非后续正式 Step 明确闭口。 |
| Step 4 非 Cargo 外部关系 | `L0-bus`、`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`、`L4-observability`、archive、external systems。 | Step 5 只能做关系归属,不能擅自升格为 compile dependency。 |
| 正式 00/01/02 | 当前 03 的上游真相源。 | 后续模块必须从当前正式 00/01/02 和新 Step 中间产物重新展开。 |

### 5. 旧 Step 5 历史材料处理规则

| 旧材料 / 旧结论 | 当前处理 |
|---|---|
| 旧 `03_ddd_step_05_module_contracts.md` 的 `[x] 已确认` | completed 状态失效,不得作为当前 Step 5 完成依据。 |
| 旧 13 模块结构 | 不继承;只能在 `R5.13` / `R5.14` 做差异审计。 |
| 旧 P0 / P1 主线 | 不继承;当前不恢复优先级分层。 |
| `MethodContent` | 不作为当前模块主语;若后续需要类似概念,必须由当前 00/01/02 和 Step 6 对象契约重新命名、重新闭口。 |
| snapshot / fingerprint / publish / outbox / delivery | 不作为 Step 5 正向模块主轴;只能按当前 02 的 capability 和边界重新判断。 |
| PostgreSQL / repository 旧假设 | 不继承;持久化与事务到 Step 11 再闭口。 |
| `domain::content` / `application::sync_services` 旧文件归属 | 不继承;文件归属以 Step 4 新布局和后续 Step 5 模块主轴裁决为准。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只完成 `R5.2` | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未写最终模块主轴 | 是。 |
| 是否未写对象字段、trait 方法、DTO schema、flow 或 state matrix | 是。 |
| 是否把旧 Step 5 降级为 historical material | 是。 |
| 是否同步要求 flow / 台账进入等待 `R5.3` | 是。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.3 L1-governance 框架对齐:先思考`;只允许读取 `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md`,抽取 Step 5 框架、表格类型、依赖图和门禁表达;不得复制 governance 领域语义,不得写最终模块主轴,不得修改正式 `03-详细设计.md`,不得进入 `R5.4` 或 Step 6。

---

## R5.3 L1-governance 框架对齐:先思考

### 1. 本模块读取范围

| 文档 | 当前用途 | 读取结论 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | framework_reference | 可参考其 Step 5 的结构、表格类型、依赖图表达、对象归属预告和进入 Step 6 条件。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | current_step | 只在本文件追加 R5.3 思考记录,不写最终模块主轴。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | flow_gate | 后续需要同步到等待 `R5.4`。 |
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | project_gate | 后续需要同步到等待 `R5.4`。 |

### 2. L1-governance Step 5 可借鉴框架

L1-governance Step 5 的核心价值不在 governance 领域内容,而在它把 Step 4 的 workspace / crate / file layout 转换成 Step 5 的模块主轴、依赖方向和后续 Step 6~16 的归属门禁。这个结构适合 L3-method-library 复用。

| 框架元素 | governance 文件中的作用 | L3-method-library 可借鉴方式 |
|---|---|---|
| Step 状态 | 明确 Step 5 对应 SOP、回填章节和确认状态。 | 保留当前 full-restart 状态和逐模块门禁,但不采用一次性 `[x] 已确认`。 |
| 本步输入 | 列出 Step 4、01、02、02_hld 中间产物和规范输入。 | R5.4 可固定本仓 Step 5 的输入包:Step 4、00/01/02、02_hld handoff、规范和 governance framework_reference。 |
| SOP 问题回答 | 逐条回答模块拆分、模块承接、暴露面、依赖方向、对象归属。 | 作为后续 R5.5~R5.12 的问题清单,但 R5.3/R5.4 不提前给最终答案。 |
| 当前文档问题诊断 | 说明概要组成部分容易误拆成 crate,旧 03 容易污染。 | L3 必须显式诊断旧 6 crate、P0、`MethodContent`、snapshot、outbox 和 PostgreSQL 污染。 |
| 改动前后对比 | 说明 Step 5 把文件布局预告升级为模块职责和依赖矩阵。 | L3 可用同类表格比较 Step 4 之前、Step 5 之后的变化,避免 agent 把 Step 4 当最终 §5。 |
| 设计取舍 | 比较 workspace member、业务组成部分、抽象分层、shared/common 模块。 | L3 需要保留方案比较,但候选必须来自 L3 的七个实现单元、八个组成部分和 capability 小循环。 |
| 模块总览表 | 给出模块、所属实现单元、职责、对外暴露、依赖对象。 | L3 最终需要同类表,但具体职责必须等 R5.11/R5.12 裁决。 |
| 模块依赖图 | 用文本图固定单向依赖和 entry module 位置。 | L3 需要同类图,尤其区分 compile dependency、module dependency 和非 Cargo 外部关系。 |
| 模块职责表 | 逐模块列所属单元、对应概要组成、主要责任、暴露、允许/禁止依赖。 | L3 需要逐模块职责表,作为 Step 6/7/8 对象、trait、DTO 归属门禁。 |
| 文件与代码主体映射表 | 把文件路径、代码主体、类型、责任挂接到模块。 | L3 可借鉴表形,但不得在未裁决前复制 governance 文件路径或主体。 |
| 对象归属预告 | 只预告对象类别属于哪个模块,不写字段 schema。 | L3 必须采用同样边界:Step 5 只给归属,Step 6 才写对象字段。 |
| 业务组成部分到模块映射 | 把业务组成部分横向映射到 contracts/domain/application/infra/entry。 | L3 需要把 02 的八个组成部分映射到七个实现单元。 |
| 模块测试切口预告 | 只给模块级测试职责,正式测试切口留给 Step 16。 | L3 可写测试职责预告,但不能替代 Step 16。 |
| 回填草稿 | 将中间产物转换为正式 §5 草稿。 | L3 的回填草稿只能在 R5.15/R5.16 生成,不得在 R5.3/R5.4 直接改正式 03。 |
| 待确认事项 | 标出 Step 6/7/8/11/14 后续闭口责任。 | L3 需要同类待确认事项,强调对象、port、protocol、persistence、config 后续闭口。 |
| 进入下一步条件 | 明确 Step 5 完成后如何进入 Step 6。 | L3 需要在 R5.17/R5.18 才判定进入 Step 6。 |

### 3. 不得从 L1-governance 继承的内容

| 禁止继承项 | 原因 | L3 处理 |
|---|---|---|
| governance 领域对象 | 与 method-library 领域不同。 | 不复制 `GovernanceContext`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility` 等对象名。 |
| governance 十个业务组成部分 | L3 的 02 是八个主要组成部分。 | R5.7/R5.8 只能映射 L3 的八个组成部分。 |
| governance 文件路径 | 目标仓和主体不同。 | 文件路径必须来自 L3 Step 4 的 `method-library-*` / `method_library_*` 约束。 |
| external GRC 语义 | L3 没有相同外部 GRC 主线。 | 外部关系只按 L3 的 L0/L1/L2/L4/archive/external systems 重新判断。 |
| governance 对象归属示例 | 只是框架例子。 | L3 对象归属必须在后续 Step 6 基于 L3 当前 00/01/02 闭口。 |
| governance 回填正文 | 属于 L1-governance 正式 §5。 | L3 回填草稿必须在 R5.15/R5.16 重新写。 |

### 4. 对 L3-method-library Step 5 的框架启发

| L3 需要建立的框架 | 当前思考 |
|---|---|
| 输入包 | R5.4 应固定 Step 5 的输入包,并标明哪些是 canonical input、supporting input、framework reference、historical material。 |
| 问题清单 | 后续 Step 5 必须逐步回答模块拆分、业务组成映射、对外暴露、依赖方向、对象/trait/handler/repository 归属。 |
| 结构化产物 | 最终至少应有模块总览表、依赖图、crate dependency matrix、职责表、文件主体映射、对象归属预告、业务组成映射、测试切口预告、待确认事项和进入 Step 6 条件。 |
| 候选裁决 | 不直接假设七个实现单元就是最终 §5 小节主轴;需比较七实现单元、实现单元内文件组、八组件 capability 小循环。 |
| 依赖表达 | 需要同时表达 Cargo compile dependency、模块内部使用关系、entry module 调用方向、非 Cargo 外部关系和禁止反向依赖。 |
| 后续承接 | Step 5 产物必须让 Step 6~16 可逐模块推进,避免后续又回到全仓总表。 |
| 旧材料隔离 | 需要保留 historical_material 差异审计,特别是旧 6 crate、P0、`MethodContent`、snapshot、outbox、PostgreSQL。 |

### 5. R5.4 写入边界草案

`R5.4` 应把本模块思考写成正式框架对齐记录,但仍不裁决 L3 的最终模块主轴。

| R5.4 应写入 | R5.4 不得写入 |
|---|---|
| L1-governance framework_reference 读取记录。 | 最终模块主轴。 |
| L3 Step 5 输出结构模板。 | 模块总览表最终内容。 |
| 后续 R5.5~R5.18 的产物形态要求。 | crate dependency matrix 最终内容。 |
| 可借鉴 / 禁止继承清单。 | 对象字段、trait 方法、DTO schema、flow、state matrix。 |
| 与 flow / 台账同步到等待 R5.5 的门禁草案。 | 正式 `03-详细设计.md` 正文。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取 L1-governance Step 5 | 是。 |
| 是否只抽取框架、表格类型、依赖图和门禁表达 | 是。 |
| 是否复制 governance 领域语义 | 否。 |
| 是否写 L3 最终模块主轴 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.4` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.4 L1-governance 框架对齐:再写入`;只允许写入 framework_reference 对齐记录、L3 Step 5 输出结构模板、可借鉴 / 禁止继承清单和后续产物形态要求;不得写最终模块主轴,不得修改正式 `03-详细设计.md`,不得进入 `R5.5` 或 Step 6。

---

## R5.4 L1-governance 框架对齐:再写入

### 1. framework_reference 对齐记录

| 项 | 记录 |
|---|---|
| framework_reference | `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` |
| 读取目的 | 抽取 Step 5 的框架深度、表格类型、依赖图表达、对象归属预告、后续 Step 承接和门禁表达。 |
| 可复用范围 | 只复用结构,不复用 governance 领域对象、业务组成、文件路径、外部 GRC 语义或正式回填正文。 |
| 本仓适配方式 | 以 L3 当前 Step 4、00/01/02、02_hld handoff 和 full-restart 门禁重新生成 Step 5。 |
| 当前模块结果 | 固定 L3 Step 5 的输出结构模板和后续模块产物形态,不裁决最终模块主轴。 |

### 2. L3 Step 5 输出结构模板

L3-method-library Step 5 的最终中间产物应包含以下结构。该模板只规定产物形态,不提前填写最终模块内容。

| 输出块 | 作用 | 预计产出模块 | 当前状态 |
|---|---|---|---|
| Step 状态与输入包 | 说明 Step 5 对应 SOP、回填章节、当前 gate、canonical input、supporting input、framework reference、historical material。 | R5.1~R5.4 | shape_locked |
| SOP 问题回答 | 回答模块拆分、概要组成承接、对外暴露、依赖方向、对象/trait/handler/repository 归属。 | R5.11~R5.12 | pending_decision |
| 当前文档问题诊断 | 诊断 Step 4 只给 layout、旧 Step 5 污染、旧正式 03 残留、后续 Step 未分配归属等问题。 | R5.13~R5.14 | pending_audit |
| 改动前后对比 | 对比 Step 5 前后的模块主轴、业务组成、依赖方向、入口模块和外部关系。 | R5.11~R5.12 | pending_decision |
| 设计取舍 | 比较七实现单元、八业务组成、实现单元内部文件组、capability 小循环和 shared/common 等候选。 | R5.5~R5.12 | pending_decision |
| 模块总览表 | 列出模块、所属实现单元、职责、对外暴露、依赖对象。 | R5.11~R5.12 | pending_decision |
| 模块依赖图 | 用文本图表达 compile / module dependency、entry 调用方向和禁止反向依赖。 | R5.9~R5.12 | pending_decision |
| crate dependency matrix | 把 Step 4 依赖方向预告升级为 allowed / forbidden Cargo dependency。 | R5.9~R5.10 | pending_decision |
| 模块职责表 | 逐模块列所属单元、概要组成、主要责任、对外暴露、允许依赖、禁止依赖。 | R5.11~R5.12 | pending_decision |
| 文件与代码主体映射表 | 把 Step 4 文件路径、代码主体类型和责任映射到模块。 | R5.5~R5.12 | pending_decision |
| 对象归属预告 | 只说明对象类别属于哪个模块,不写字段 schema。 | R5.11~R5.12 | pending_decision |
| trait / port / handler / repository 归属预告 | 只说明归属门禁,不写 trait 方法签名。 | R5.11~R5.12 | pending_decision |
| 业务组成部分到模块映射 | 把正式 02 的八个主要组成部分横向映射到七个实现单元或其他裁决后的模块主轴。 | R5.7~R5.8 | pending_decision |
| 模块测试切口预告 | 只给模块级测试职责,正式测试切口留到 Step 16。 | R5.11~R5.12 | pending_decision |
| 回填草稿 | 把已确认中间产物组装为正式 §5 草稿。 | R5.15~R5.16 | pending |
| 待确认事项与进入 Step 6 条件 | 标出 Step 6/7/8/11/14/16 后续闭口责任和 Step 5 停审条件。 | R5.17~R5.18 | pending |

### 3. 可借鉴 / 禁止继承清单

| 类别 | 可借鉴 | 禁止继承 |
|---|---|---|
| Step 组织 | 状态块、输入块、问题回答、诊断、取舍、结构化产物、回填草稿、待确认和进入下一步条件。 | L1-governance 一次性完成式 `[x] 已确认` 状态;本仓必须保持逐模块确认。 |
| 模块主轴表达 | 可用 workspace member / crate 与业务组成跨模块映射的双层表达。 | 不能直接断定 L3 最终一定等于七 crate,需先经过 R5.5~R5.12 裁决。 |
| 依赖表达 | 可用文本依赖图、allowed dependency、forbidden dependency 和 entry module 禁止互依。 | 不能复制 governance 的 external GRC、repository、outbox 等具体依赖语义。 |
| 表格形态 | 可用模块总览、职责表、文件主体映射、对象归属预告、业务组成映射、测试切口预告。 | 不能复制 governance 对象名、文件名、业务组成名或正式 §5 回填段落。 |
| 后续 Step 承接 | 可明确 Step 6 对象、Step 7 port、Step 8 protocol、Step 11 persistence、Step 14 config、Step 16 test 的承接责任。 | 不能在 Step 5 直接写字段 schema、trait 方法、DTO schema、flow 步骤或状态矩阵。 |

### 4. 后续产物形态要求

| 后续模块 | 产物形态要求 | 禁止事项 |
|---|---|---|
| R5.5 / R5.6 | 基于 Step 4 形成模块主轴候选池,至少包含七实现单元、实现单元内部文件组、八组件 capability 小循环和排除项。 | 不裁决最终模块表;不写正式 §5。 |
| R5.7 / R5.8 | 形成八个主要组成部分到候选模块的横向映射,标明跨 contracts/domain/application/infra/entry 的承接点。 | 不把八个业务组成部分直接机械拆成 crate。 |
| R5.9 / R5.10 | 形成 compile dependency、module dependency、entry invocation、non-Cargo external relation 和 forbidden dependency。 | 不擅自把非 `core-contracts` sibling 仓升格为 Cargo dependency。 |
| R5.11 / R5.12 | 裁决最终模块主轴,写模块总览、职责表、依赖图、对象归属预告、port/handler/repository 归属预告和测试切口预告。 | 不写对象字段、trait 方法、DTO schema、flow 或 state matrix。 |
| R5.13 / R5.14 | 审计旧 Step 5、旧正式 §5 和旧主线污染,给出禁入 / 后移 / 重定义表。 | 不用旧内容反推当前结论。 |
| R5.15 / R5.16 | 基于已确认中间产物写正式 §5 回填草稿。 | 不直接编辑正式 `03-详细设计.md`。 |
| R5.17 / R5.18 | 自检 Step 5 是否满足进入 Step 6 条件,同步 flow / 台账。 | 不在未完成主轴裁决或差异审计时进入 Step 6。 |

### 5. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 framework_reference 对齐记录 | 是。 |
| 是否固定 L3 Step 5 输出结构模板 | 是。 |
| 是否写入可借鉴 / 禁止继承清单 | 是。 |
| 是否写入后续产物形态要求 | 是。 |
| 是否裁决最终模块主轴 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.5` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.5 Step 4 承接与模块候选池:先思考`;只允许读取 Step 4 已确认布局、目标仓、七个实现单元、文件布局树、依赖方向预告和当前 00/01/02 相关输入,形成模块主轴候选池和排除项思考;不得裁决最终模块表,不得修改正式 `03-详细设计.md`,不得进入 `R5.6` 或 Step 6。

---

## R5.5 Step 4 承接与模块候选池:先思考

### 1. 本模块读取范围

| 文档 | 当前用途 | 读取结论 |
|---|---|---|
| `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` | direct_predecessor_baseline | Step 4 已固定 workspace 多 crate、七个实现单元、目标仓、命名、文件布局树、文件职责和依赖方向预告。 |
| `projects/L3-method-library/00-需求文档.md` | canonical_input | 本仓是方法资产定义 truth 仓;必须保护 Definition vs Use、正式版本、受控消费、追溯一致性和外部正文禁入。 |
| `projects/L3-method-library/01-架构设计.md` | canonical_input | 架构以核心 truth、正式承接、读取材料、异步协作、后台维护、引用 / 摘要边界分层;运行期 / 事件协作不得写成源码级拥有。 |
| `projects/L3-method-library/02-概要设计.md` | canonical_input | 02 给出八个主要组成部分、实现分层、关键对象轮廓、接口骨架、处理流、状态和配置影响;这些是 Step 5 的业务主语来源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | current_step | 本模块只追加候选池思考,不裁决最终模块主轴。 |

### 2. Step 4 已闭口输入摘要

| 输入类别 | Step 4 结论 | 对 Step 5 的约束 |
|---|---|---|
| 布局形态 | 采用 workspace 多 crate;不采用单 crate、八组件拆 crate、单独 config / observability crate。 | Step 5 不能回退为单 crate 或按八组件机械拆 crate。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-method-library`。 | 模块主轴和文件主体映射必须指向该实现仓。 |
| 命名 | `crates/<role>`、`method-library-<role>`、`method_library_<role>`。 | 模块命名不得出现 `l3_`、`quantalithos` 层级前缀或旧 `method_library_*` 污染。 |
| 实现单元 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | 七个实现单元是候选池第一层,也是后续 dependency matrix 的工程边界输入。 |
| 文件布局 | 已固定 contracts/domain/application/infra/api/worker/jobs 的文件树和测试承载面。 | Step 5 应把文件职责提升为模块职责和代码主体归属,但不改写文件树。 |
| compile dependency | 只有 `core-contracts` 是 compile dependency candidate。 | 依赖矩阵候选必须保持非 `core-contracts` sibling 仓不进入 Cargo dependency。 |
| 外部关系 | `L0-bus`、`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`、`L4-observability` / archive / external systems 均非 Cargo。 | Step 5 只能定义 adapter / port / event / handoff 归属,不能升格为内部 crate 或源码依赖。 |
| 历史禁入 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox relay、PostgreSQL、gateway、P0/P1 禁入当前布局主线。 | Step 5 候选池必须排除这些旧主语。 |

### 3. 当前 00/01/02 对候选池的约束

| 来源 | 关键约束 | 对候选池的影响 |
|---|---|---|
| 00 本仓定位 | 方法资产定义、版本发布与分发语义由本仓拥有 truth。 | 候选主轴必须能表达 definition truth、formal version、distribution / consumption 和 trace。 |
| 00 Definition vs Use | 本仓负责定义,相邻仓只按边界使用、执行、索引或展示。 | 不能把 process runtime、identity member state、runtime execution、member image build state 写成内部模块主轴。 |
| 00 数据归属 | 外部正文、artifact 正文、运行实例、成员状态、治理执行、交易履约、UI 状态禁止入仓。 | 候选中只能有 external summary / ref / body-free boundary,不能有外部正文 owner。 |
| 00 依赖裁剪 | `L0-core` 编译期;`L0-bus` 事件协作;process / identity / runtime / member-images 运行期消费。 | 候选池需区分 compile 模块、runtime adapter、event collaboration 和 handoff。 |
| 01 架构分层 | 核心语义、正式承接、支撑摘要、技术承载、外部接缝分层。 | 候选池不能只按 crate;还要保留 capability / boundary 小循环映射。 |
| 01 一致性策略 | core truth 强一致;读取 / 投影 / 摘要最终一致;后台维护不修 truth。 | 候选池需要能表达 query material、maintenance job 和 core truth 的隔离。 |
| 02 八个主要组成部分 | definition/catalog、formalization/version、consumption、trace/consistency、relation/distribution、external summary/ref、maintenance、package/set。 | 这是业务 capability 候选池来源,但不能机械拆为 crate。 |
| 02 接口骨架 | Command、Query、Inbound Consumer、Outbound Event、Operations Job 均有边界。 | 候选池需识别入口族和实现单元的交叉关系。 |
| 02 配置影响 | entry、adapter、transport、query material、job 和 publisher 受配置影响;domain invariant 不受配置改变。 | 候选池不能提前拆 config crate,但要给 infra / application / entry 保留配置承载点。 |

### 4. 模块主轴候选池初稿

| 候选 | 说明 | 优点 | 风险 / 限制 | 当前定位 |
|---|---|---|---|---|
| A. 七个实现单元作为主轴 | 以 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 作为 Step 5 模块主轴。 | 与 Step 4 workspace、Cargo boundary、文件树和 dependency matrix 直接一致。 | 业务组成部分需要横向映射,否则会丢失 method-library 领域主语。 | strongest_candidate;待 R5.6 写入候选池,R5.11/R5.12 再裁决。 |
| B. 七实现单元 + 文件组二级主轴 | 顶层仍是七实现单元,二级按 Step 4 文件组承接,如 domain 的 definition/formalization/consumption/trace/relation/external/maintenance/package。 | 能保留工程边界,同时给 Step 6~9 足够细的 owner。 | 文档可能变长;需要避免在 Step 5 写字段和方法。 | strong_candidate_as_template。 |
| C. 八个主要组成部分作为 capability 横轴 | 以 02 八组件作为业务横轴,映射到 contracts/domain/application/infra/entry。 | 保留领域语义,适合对象、port、flow、state 后续追踪。 | 若作为 crate 或顶层模块主轴会形成重复 contracts / ports / adapters 和循环依赖。 | mapping_axis_only;不得机械拆 crate。 |
| D. 接口家族作为横轴 | 按 Command、Query、Inbound Consumer、Outbound Event、Operations Job 划分。 | 有助于 Step 7/8/9 协议和 flow 分组。 | 接口族横跨所有实现单元,不能表达 truth owner。 | secondary_mapping_axis。 |
| E. 架构角色分层作为候选 | 核心语义、正式承接、支撑摘要、技术承载、外部接缝。 | 能表达 01 的依赖方向和外部输入隔离。 | 不对应文件树和 Cargo package,实施者仍需二次翻译。 | decision_support_axis。 |
| F. capability 小循环作为候选 | 以 definition -> formalization -> consumption -> trace / consistency -> distribution / external -> maintenance 的小循环表达模块工作包。 | 适合 Step 6 以后逐 capability 小循环展开对象、port、protocol、flow、state。 | 若作为顶层 §5 主轴会弱化 crate dependency matrix。 | execution_loop_axis。 |
| G. 物理文件作为主轴 | 直接以 Step 4 每个文件作为模块。 | 最细,容易对应实现。 | 粒度过细,会让 Step 5 退化成文件职责表重复。 | exclude_as_primary;可用于文件映射表。 |
| H. 外部关系作为主轴 | 以 process、identity、runtime、member-images、bus、observability 等外部关系拆模块。 | 能看清协作对象。 | 会把运行期 / 事件协作误写成内部源码依赖或外部 truth owner。 | exclude_as_primary;只作为 adapter / port / handoff 映射。 |

### 5. 候选池排除项初稿

| 排除项 | 排除原因 | 后续处理 |
|---|---|---|
| 单 crate 内部模块分层 | Step 4 已明确不采用;边界多,容易隐藏依赖方向。 | 不进入 Step 5 主轴候选。 |
| 按八个业务组成部分各拆 crate | Step 4 已明确不采用;会重复 contracts、ports、adapter。 | 八组件只作为 capability / mapping axis。 |
| 单独 config crate / observability crate | Step 4 已明确不采用;配置与观测承接到 infra/application/entry 和后续 Step 14/15。 | 后续只在配置和观测契约中展开。 |
| 旧 `MethodContent` 总聚合 | 与当前 00/01/02 的 definition/catalog/formalization/consumption 等主语冲突。 | 仅在 R5.13/R5.14 做污染审计。 |
| publish / published / publication 主线 | 当前由 formalization / formal version 语义替代。 | 不作为模块名或 flow 主线。 |
| snapshot / fingerprint 主线 | 当前不以 fingerprint / snapshot 作为正式版本依据。 | 如需 digest / marker,后续 Step 6/8/13 正式闭口。 |
| outbox relay / delivery worker | Step 4 已禁止恢复旧 outbox relay 机制;Outbound Event 只表达 candidate / publisher boundary。 | 后续 Step 7/8/9 重新定义 outbound contract 和 publisher port。 |
| PostgreSQL / sqlx / migrations | Step 3/4 不固定 DB 产品;持久化后移 Step 11。 | 不作为模块主轴。 |
| gateway / auth extractor | 本仓不实现 auth / gateway;入口保持 transport-neutral。 | 不作为 api 模块职责主语。 |
| process / identity / runtime / member-images 内部运行状态 | 相邻仓 truth,本仓只消费 / 输出 summary、ref、material 或 boundary。 | 只能进入 adapter / external summary / consumption boundary 映射。 |

### 6. R5.6 写入边界草案

`R5.6` 应把本模块思考固化为正式候选池和排除项,但仍不裁决最终模块表。

| R5.6 应写入 | R5.6 不得写入 |
|---|---|
| Step 4 承接基线摘要。 | 最终模块主轴裁决。 |
| 模块主轴候选池正式表。 | 模块总览表最终项。 |
| 候选之间的使用方式:primary / mapping / support / excluded。 | crate dependency matrix 最终项。 |
| 排除项和原因。 | 对象字段、trait 方法、DTO schema、flow、state matrix。 |
| 下一模块 `R5.7` 业务组成部分映射的输入门禁。 | 正式 `03-详细设计.md` 正文。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 4 已确认布局 | 是。 |
| 是否读取当前 00/01/02 相关输入 | 是。 |
| 是否形成候选池思考 | 是。 |
| 是否裁决最终模块表 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.6` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.6 Step 4 承接与模块候选池:再写入`;只允许写入 Step 4 承接基线、模块主轴候选池、候选使用方式和排除项;不得裁决最终模块表,不得修改正式 `03-详细设计.md`,不得进入 `R5.7` 或 Step 6。

---

## R5.6 Step 4 承接与模块候选池:再写入

### 1. Step 4 承接基线摘要

| 基线项 | 已确认内容 | R5.6 固化口径 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-method-library` | Step 5 的模块主轴、文件主体映射和后续 crate dependency matrix 均面向该仓。 |
| 实现形态 | workspace 多 crate | 不回退单 crate;不把八个业务组成部分机械拆成 crate。 |
| 实现单元 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | 作为候选池第一层和依赖矩阵的工程边界输入。 |
| 命名规则 | `crates/<role>`、`method-library-<role>`、`method_library_<role>` | 后续模块名、crate 名和文件映射不得引入旧前缀或旧主线命名。 |
| compile dependency 候选 | 仅 `core-contracts` | 其他 sibling 项目默认只能通过 event / adapter / handoff / runtime relation 表达。 |
| 非 Cargo 外部关系 | `L0-bus`、`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`、`L4-observability`、archive、external systems | 不得升格为源码内 owner 或 Cargo 依赖。 |
| 历史禁入 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox relay、PostgreSQL、gateway、P0/P1 | 只能在历史差异审计中处理,不得作为当前候选主轴。 |

### 2. 模块主轴候选池正式表

| 候选 | 粒度 | 使用方式 | 固化判断 |
|---|---|---|---|
| A. 七个实现单元 | `contracts` / `domain` / `application` / `infra` / `api` / `worker` / `jobs` | primary_candidate | 当前最强主轴候选。它与 Step 4 workspace、Cargo boundary、文件布局和依赖矩阵直接一致。 |
| B. 七实现单元 + 文件组 | 顶层七实现单元,二级按 Step 4 文件组和领域小组展开 | template_candidate | 适合作为最终 §5 的模块职责表模板,帮助 Step 6~9 逐 owner 展开。 |
| C. 八个主要组成部分 | definition/catalog、formalization/version、consumption、trace/consistency、relation/distribution、external summary/ref、maintenance、package/set | mapping_axis | 作为业务横轴进入 R5.7/R5.8,用于校验七实现单元没有丢失领域主语。 |
| D. 接口家族 | Command、Query、Inbound Consumer、Outbound Event、Operations Job | secondary_mapping_axis | 用于后续 Step 7/8/9 的 port / protocol / flow 归属预告,不作为顶层模块主轴。 |
| E. 架构角色分层 | 核心语义、正式承接、支撑摘要、技术承载、外部接缝 | support_axis | 用于检查依赖方向和外部正文隔离,不直接作为文件或 crate 主轴。 |
| F. capability 小循环 | definition -> formalization -> consumption -> trace / consistency -> distribution / external -> maintenance | execution_axis | 用于后续逐 capability 小循环展开对象、port、protocol、flow、state。 |
| G. 物理文件 | Step 4 每个文件路径 | excluded_as_primary | 不作为顶层模块;只允许在文件与代码主体映射表中承接。 |
| H. 外部关系 | process、identity、runtime、member-images、bus、observability、archive、external systems | excluded_as_primary | 不作为内部模块;只允许在 adapter / port / event / handoff 映射中承接。 |

### 3. 候选使用方式定义

| 使用方式 | 含义 | 后续落点 |
|---|---|---|
| primary_candidate | 可作为最终 Step 5 模块主轴的候选。 | R5.11/R5.12 裁决。 |
| template_candidate | 不单独替代主轴,但可成为主轴内部的小节模板。 | R5.11/R5.12 的模块职责表和文件主体映射。 |
| mapping_axis | 用于把业务能力横向映射到主轴,防止工程边界吞掉业务语义。 | R5.7/R5.8。 |
| secondary_mapping_axis | 用于接口、协议、flow、测试切口的二级归属。 | R5.9~R5.12 以及后续 Step 7~16。 |
| support_axis | 用于校验依赖、外部边界、一致性和禁止方向。 | R5.9/R5.10。 |
| execution_axis | 用于后续 Step 按 capability 小循环推进,避免全仓总表式生成。 | Step 6 以后。 |
| excluded_as_primary | 明确不得作为当前 Step 5 顶层主轴。 | R5.13/R5.14 历史审计或文件映射表。 |

### 4. 排除项和原因

| 排除项 | 排除原因 | 允许的后续承接方式 |
|---|---|---|
| 单 crate 内部模块分层 | Step 4 已裁决 workspace 多 crate;单 crate 会隐藏依赖边界。 | 不承接。 |
| 八个业务组成部分各拆 crate | 会导致 contracts、ports、adapters 重复和循环依赖风险。 | 仅作为 R5.7/R5.8 的业务映射横轴。 |
| 单独 config / observability crate | Step 4 已排除;配置和观测属于 infra / application / entry 与 Step 14/15 承接。 | 后续在配置引用和观测契约中展开。 |
| 旧 `MethodContent` 总聚合 | 与当前 definition/catalog/formalization/consumption 等主语冲突。 | 仅进入历史污染审计。 |
| publish / publication 主线 | 当前应由 formal version / distribution / consumption 重新命名和归属。 | 需要后续对象和 flow 正式闭口后才可出现。 |
| snapshot / fingerprint 主线 | 当前不以旧 snapshot / fingerprint 作为正式版本依据。 | digest / marker 若需要,后续 Step 6/8/13 重新闭口。 |
| outbox relay / delivery worker | Step 4 已禁止恢复旧 outbox relay 机制。 | outbound event / publisher boundary 后续重新定义。 |
| PostgreSQL / sqlx / migrations | 持久化产品和事务契约后移 Step 11。 | Step 11 再讨论。 |
| gateway / auth extractor | 本仓不实现 gateway / auth owner。 | api 只保持 transport-neutral entry boundary。 |
| process / identity / runtime / member-images 内部状态 | 属于相邻仓 truth。 | 只能作为 ref / summary / adapter / handoff 边界出现。 |

### 5. R5.7 输入门禁

`R5.7` 只允许基于正式 `02-概要设计.md` 的八个主要组成部分和 R5.6 候选池,思考业务组成部分如何映射到七个实现单元及其文件组。它不裁决最终模块表,不写 crate dependency matrix,不写对象字段、trait 方法、DTO schema、flow 或 state matrix。

| 输入 | R5.7 使用方式 |
|---|---|
| R5.6 候选池 | 将七实现单元作为候选主轴,将八组件作为 mapping axis。 |
| `02-概要设计.md` 八个主要组成部分 | 逐项判断其 contracts / domain / application / infra / entry 承接点。 |
| Step 4 文件布局树 | 作为文件组和二级模板候选,不改写文件树。 |
| 00/01 边界 | 防止把相邻仓 runtime state、member state、process execution 或外部正文误纳入本仓模块。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 4 承接基线 | 是。 |
| 是否写入模块主轴候选池 | 是。 |
| 是否明确候选使用方式 | 是。 |
| 是否写入排除项和原因 | 是。 |
| 是否裁决最终模块表 | 否。 |
| 是否写 crate dependency matrix 最终内容 | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow 或 state matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.7` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.7 业务组成部分到模块映射:先思考`;只允许读取正式 `02-概要设计.md` 八个主要组成部分、R5.6 候选池、Step 4 文件布局和 00/01 边界,形成业务组成部分到模块映射草案;不得裁决最终模块表,不得修改正式 `03-详细设计.md`,不得进入 `R5.8` 或 Step 6。

---

## R5.7 业务组成部分到模块映射:先思考

### 1. 本模块读取范围

| 文档 | 当前用途 | 读取结论 |
|---|---|---|
| `projects/L3-method-library/02-概要设计.md` §5 | canonical_input | 正式八个组成部分是业务横轴:方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 |
| `projects/L3-method-library/02-概要设计.md` §7~§8 | canonical_input | Command / Query / Inbound / Outbound / Operations Job 与八组件存在稳定分组;接口族不能替代业务 owner。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` | direct_predecessor_baseline | 七实现单元和文件职责已固定:contracts、domain、application、infra、api、worker、jobs。 |
| `R5.6 候选池` | current_step_input | 七实现单元是 primary candidate;八组件是 mapping_axis;接口家族是 secondary_mapping_axis。 |
| `projects/L3-method-library/00-需求文档.md` / `01-架构设计.md` | boundary_guard | 本仓只拥有 method definition truth、formal version、controlled consumption、trace / relation / external summary / package semantics;相邻仓运行 truth 不进入本仓。 |

### 2. 八个组成部分的映射问题

R5.7 要回答的不是“八个组成部分是否各自成为 crate”。这个问题 Step 4 / R5.6 已排除。R5.7 要回答的是:每个业务组成部分横跨七个实现单元时,哪些内容落在 contracts、domain、application、infra、entry runner,以及哪些内容必须后移到 Step 6~16。

| 组成部分 | 映射时必须保留的业务主语 | 当前思考 |
|---|---|---|
| 方法资产定义与目录 | definition truth、catalog entry、definition boundary、catalog view | 必须横跨 contracts / domain / application / infra / api;不进入 worker/jobs 作为 truth owner。 |
| 正式化与版本 | formalization state、formal version、basis summary、eligibility rule | 必须横跨 contracts / domain / application / infra / api;external basis 通过外部摘要与引用接缝承接。 |
| 受控消费 | consumption material、availability view、downstream boundary、Definition vs Use guard | 必须横跨 contracts / domain / application / infra / api,并可能触发 worker publisher candidate;不得记录下游运行 truth。 |
| 追溯与一致性保护 | trace material、impact summary、audit trail、evidence lineage、consistency protection | 横跨 contracts / domain / application / infra / api / worker / jobs;但 raw log、report body、evidence body 禁入。 |
| 关系与分发语义 | relation truth、distribution context/ref、integrity diagnostic | 横跨 contracts / domain / application / infra / api / worker / jobs;不得进入 marketplace transaction 或 runtime dependency graph。 |
| 外部摘要与引用 | external summary/ref、artifact ref、body boundary、inbound intake | 横跨全部七单元;它是唯一 inbound consumer owner,但 external body 不能进入任何单元。 |
| 后台维护与收敛 | refresh task、recovery task、maintenance progress、freshness view | 以 application / jobs / infra 为执行主线,contracts 提供 job surface,domain 提供 task/progress/invariant;不得修 core truth。 |
| 外围包与方法集组织 | method package、method set assembly、composition rule、peripheral view | 横跨 contracts / domain / application / infra / api / worker / jobs;必须标为 peripheral,不得成为 core 闭环前置。 |

### 3. 七实现单元的映射角色草案

| 实现单元 | 对八组件的统一承接方式 | R5.7 判断 |
|---|---|---|
| `contracts` | 承载八组件的 public DTO、typed ref、summary ref、safe marker、query view、event candidate 和 job surface。 | 每个组成部分都需要 contracts 壳,但 contracts 不拥有 truth。 |
| `domain` | 承载八组件的 domain object、state、policy、guard、invariant 和 domain error。 | 业务 owner 主要在 domain 中表达,但不写字段 schema 到 Step 5。 |
| `application` | 承载八组件的 command/query/consumer/job orchestration、port trait 调用、UoW、idempotency 和 boundary coordination。 | 每个组成部分都需要 application owner 或 service family,但接口签名后移 Step 7。 |
| `infra` | 承载 repository、material store、external adapter、publisher adapter、runtime builder、config binding、fake adapter。 | infra 只实现 port,不反向决定业务 owner。 |
| `api` | 承载 Command / Query 同步入口 assembly 和 handler boundary。 | 只承接有同步 Command / Query 的组成部分,不是业务模块 owner。 |
| `worker` | 承载 Inbound Consumer runner、event candidate publisher runner 和 background loop assembly。 | 主要承接 external inbound、outbound event candidate 和后台 runner 装配,不恢复 outbox relay。 |
| `jobs` | 承载 Operations Job runner、read/trace/material refresh、reference refresh、recovery convergence、maintenance progress。 | 主要承接后台维护与收敛,也服务其他组成部分的 derived material 刷新。 |

### 4. 业务组成部分到实现单元映射草案

下表只是 R5.7 思考草案,用于给 R5.8 写入正式映射表做输入。它不裁决最终模块表,也不写对象字段、trait 方法或 DTO schema。

| 组成部分 | contracts 草案 | domain 草案 | application 草案 | infra 草案 | entry / runner 草案 |
|---|---|---|---|---|---|
| 方法资产定义与目录 | definition / catalog request、result、view、ref 壳 | definition、catalog、boundary rule、catalog state | definition/catalog command 与 query service | repository / catalog material store | api command/query;event candidate 由 worker 后续承接 |
| 正式化与版本 | formalization / version / basis DTO 与 view 壳 | formalization state、formal version、basis summary、eligibility rule | formalization / version lifecycle service | version store、basis resolver adapter | api command/query;event candidate worker |
| 受控消费 | consumption material、availability、boundary、guard DTO / view | consumption material、availability rule、boundary、guard | consumption preparation、boundary coordination、availability query | material store、availability resolver、handoff adapter | api command/query;worker publisher hint |
| 追溯与一致性保护 | trace、impact、audit、lineage、protection surface | trace material、impact summary、audit/lineage rule、protection policy | trace/audit/protection service and query orchestration | trace material store、safe diagnostic adapter | api query/command;jobs refresh;worker event candidate |
| 关系与分发语义 | relation、distribution、integrity DTO / view | relation truth、distribution context、integrity rule | relation lifecycle、distribution read coordination | relation store、distribution material adapter | api command/query;jobs refresh;worker event candidate |
| 外部摘要与引用 | external summary/ref/artifact/body-boundary/intake DTO | external summary、typed ref boundary、body boundary rule | external summary command、inbound intake、external query | external adapter、source resolver、artifact ref adapter | api command/query;worker inbound consumer;worker event candidate |
| 后台维护与收敛 | job input/result/progress/freshness surface | refresh task、recovery task、progress state、convergence policy | maintenance request/control、job orchestration、progress query | job material store、clock/id/runtime builder | jobs runner;worker background assembly;api progress query |
| 外围包与方法集组织 | package/set/composition/peripheral view DTO | package、method set,composition rule,peripheral state | package/set lifecycle,composition evaluation,peripheral query | package store、peripheral view adapter、marketplace context ref adapter | api command/query;jobs peripheral refresh;worker event candidate |

### 5. 映射草案中的风险点

| 风险 | 说明 | 后续处理 |
|---|---|---|
| contracts 壳膨胀 | 八组件全部需要 public surface,容易把 Step 8 DTO 提前写进 Step 5。 | R5.8 只写组件到 contracts 的类别,不写字段。 |
| domain 按文件组过细 | Step 4 domain 文件组接近八组件,但仍不能在 Step 5 写对象字段和状态迁移。 | R5.12 再裁决模块职责表;Step 6 写对象。 |
| application service 重复 | 每个组件都有 command/query/service,容易重复生成同构服务。 | Step 7/9 再决定 trait 和 flow,Step 5 只标 owner。 |
| worker 与 jobs 混淆 | worker 承接 inbound/event runner,jobs 承接 operations job runner。 | R5.8 必须把 inbound/event 与 operations job 分开。 |
| 外部摘要误变 truth | external summary 是 support summary/ref-only,不能变成外部正文或 provider payload storage。 | 后续 Step 6/7/8 必须保留 body-free boundary。 |
| 外围包误成核心前置 | package / method set 是 peripheral,不能阻塞 definition / formalization / consumption。 | 映射表必须保留 peripheral 标记。 |

### 6. R5.8 写入边界草案

`R5.8` 应把本模块草案固化为业务组成部分到模块映射表,但仍不裁决最终模块主轴。

| R5.8 应写入 | R5.8 不得写入 |
|---|---|
| 八组件到七实现单元的正式映射表。 | 最终模块主轴裁决。 |
| 每个组件的 primary owner / supporting units / entry units。 | 模块总览表最终项。 |
| core / support / operation / peripheral 标记。 | crate dependency matrix 最终项。 |
| worker 与 jobs 承接边界。 | 对象字段、trait 方法、DTO schema、flow、state matrix。 |
| R5.9 依赖矩阵输入门禁。 | 正式 `03-详细设计.md` 正文。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取正式 `02-概要设计.md` 八个主要组成部分 | 是。 |
| 是否读取 R5.6 候选池和 Step 4 文件布局 | 是。 |
| 是否形成业务组成部分到模块映射草案 | 是。 |
| 是否裁决最终模块表 | 否。 |
| 是否写 crate dependency matrix 最终内容 | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow 或 state matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.8` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.8 业务组成部分到模块映射:再写入`;只允许写入八组件到七实现单元的映射表、primary owner / supporting units / entry units、core/support/operation/peripheral 标记和 worker/jobs 边界;不得裁决最终模块表,不得修改正式 `03-详细设计.md`,不得进入 `R5.9` 或 Step 6。

---

## R5.8 业务组成部分到模块映射:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.8 业务组成部分到模块映射:再写入`。 |
| 本模块目标 | 将 R5.7 的业务组成部分映射草案固化为八组件到七实现单元的映射表。 |
| 当前写入边界 | 只写业务横轴到工程 role 的映射、owner 标记、entry / runner 边界和 R5.9 输入门禁。 |
| 本模块不做 | 不裁决最终模块主轴;不写 crate dependency matrix 最终内容;不写对象字段、trait 方法、DTO schema、flow 或 state matrix;不修改正式 `03-详细设计.md`。 |

### 2. 八组件到七实现单元映射表

| 业务组成部分 | 层级 | primary owner | supporting units | entry / runner units | 映射口径 |
|---|---|---|---|---|---|
| 方法资产定义与目录 | core | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate only | `domain` 承载 definition / catalog truth 与 boundary rule;`application` 编排 command/query;`infra` 承接 repository/material store;`api` 承接同步入口;`worker` 只承接已成立 fact 的 event candidate,不写 truth。 |
| 正式化与版本 | core | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate only | `domain` 承载 formalization state、formal version、basis summary 和 eligibility rule;external basis 只通过 safe summary/ref 接缝进入;不恢复 publish / fingerprint / snapshot。 |
| 受控消费 | core | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate / handoff hint | `domain` 承载 consumption material、availability rule、boundary 和 guard;`application` 协调材料准备和 boundary;不得记录下游运行 truth。 |
| 追溯与一致性保护 | core/support | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` | `domain` 承载 trace / impact / audit / lineage / protection owner;`jobs` 只刷新派生 trace/audit/impact material;raw log、report body 和 evidence body 禁入。 |
| 关系与分发语义 | support | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` | `domain` 承载 relation truth、distribution context/ref 和 integrity rule;`jobs` 只刷新 relation/distribution read material;不表达 marketplace transaction 或 runtime dependency graph。 |
| 外部摘要与引用 | support | `domain` | `contracts`;`application`;`infra` | `api`;`worker` inbound/event | `domain` 承载 external summary/ref/body boundary 语义;`application` 承接 external command 和 inbound intake;`worker` 是唯一 inbound runner 承接点;任何 external body / payload 不进入仓。 |
| 后台维护与收敛 | operation/support | `application` | `contracts`;`domain`;`infra` | `api`;`worker`;`jobs` | `application` 承载 maintenance request/control、job orchestration 和 progress query;`domain` 提供 task/progress/convergence policy;`jobs` 是 operations job runner;不得修 core truth。 |
| 外围包与方法集组织 | peripheral | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` | `domain` 承载 package、method set 和 composition rule;`jobs` 只刷新 peripheral read material;必须标为 peripheral,不得成为 core 闭环前置。 |

### 3. contracts / domain / application / infra 承接表

| 实现单元 | 对八组件的正式承接 | 禁止事项 |
|---|---|---|
| `contracts` | 为八组件提供 public DTO 壳、typed ref、summary ref、safe marker、query view、event candidate 和 job surface。 | 不拥有 truth;不写字段全集;不把 Step 8 protocol schema 提前写满。 |
| `domain` | 为八组件提供 object、state、policy、guard、invariant 和 domain error owner。 | 不依赖 infra / runtime / repository;不接收 external body;不保存下游运行 truth。 |
| `application` | 为八组件提供 command/query/consumer/job orchestration、port 调用、UoW、idempotency、boundary coordination 和 application error owner。 | 不直接实现 adapter;不绕过 domain policy;不把 Query / Job 变成 truth write path。 |
| `infra` | 为八组件提供 repository、projection/material store、external adapter、publisher adapter、runtime builder、config binding、clock/id/fake adapter。 | 不反向决定业务 owner;不固定具体 database / queue / scheduler / object storage 产品。 |

### 4. entry / runner 边界表

| 入口单元 | 承接内容 | 不承接内容 |
|---|---|---|
| `api` | 八组件中有同步 Command / Query 的入口 assembly、handler boundary 和 transport-neutral route / RPC placeholder。 | 不承接 worker/job 执行;不直接写 repository;不实现 auth / gateway owner。 |
| `worker` | 外部摘要与引用的 inbound consumer runner;八组件 accepted fact / material / peripheral change 的 event candidate publisher runner;background loop assembly placeholder。 | 不恢复 outbox relay、topic、payload schema、retry、dead letter;不修 core truth。 |
| `jobs` | 后台维护与收敛的 operations job runner;为 definition/catalog、formal version、consumption、trace、relation、external、peripheral 等派生 material 执行 refresh / convergence。 | 不创建 definition、formal version、relation、external summary、package 或 method set truth;不复制外部正文。 |

### 5. R5.9 输入门禁

R5.9 的依赖矩阵必须同时承接 Step 4 的工程依赖预告和 R5.8 的业务映射结论。依赖矩阵不得只按业务组件画图,也不得把 entry / runner 的调用方向反推成 domain/application 对 entry 的依赖。

| 输入 | R5.9 使用方式 |
|---|---|
| Step 4 依赖预告 | 以 `contracts -> core-contracts`, `domain -> contracts`, `application -> contracts/domain`, `infra -> application/domain/contracts`, `api/worker/jobs -> contracts/application/infra` 为草案输入。 |
| R5.8 映射表 | 检查每个业务组件是否有正确的 primary owner、supporting units 和 entry / runner units。 |
| R5.6 候选池 | 保持七实现单元是 primary candidate,八组件是 mapping axis。 |
| 00/01/02 边界 | 防止非 Cargo 外部关系、runtime state、event collaboration 或 external body 被写进 compile dependency。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入八组件到七实现单元映射表 | 是。 |
| 是否标出 primary owner / supporting units / entry units | 是。 |
| 是否保留 core / support / operation / peripheral 标记 | 是。 |
| 是否写清 worker 与 jobs 边界 | 是。 |
| 是否裁决最终模块主轴 | 否。 |
| 是否写 crate dependency matrix 最终内容 | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow 或 state matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.9` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.9 依赖矩阵与暴露边界:先思考`;只允许基于 Step 4 依赖预告、R5.8 映射表、R5.6 候选池和 00/01/02 边界形成 compile / module dependency、allowed / forbidden dependency、对外暴露边界草案;不得裁决最终模块主轴,不得修改正式 `03-详细设计.md`,不得进入 `R5.10` 或 Step 6。

---

## R5.9 依赖矩阵与暴露边界:先思考

### 1. 本模块读取范围

| 文档 | 当前用途 | 读取结论 |
|---|---|---|
| `03_ddd_step_04_module_layout.md` §4.6 | direct_predecessor_baseline | 已给出依赖预告:`contracts -> core-contracts`, `domain -> contracts`, `application -> contracts/domain`, `infra -> contracts/domain/application`, `api/worker/jobs -> contracts/application/infra`。 |
| `R5.8 业务组成部分到模块映射` | current_step_input | 八组件已映射到七实现单元;`domain` 多数为业务 owner,`application` 是 orchestration owner,`infra` 是 adapter owner,`api/worker/jobs` 是 entry / runner。 |
| `R5.6 候选池` | current_step_input | 七实现单元是 primary candidate;外部关系不得作为内部模块主轴。 |
| `00/01/02` 边界 | boundary_guard | 非 Cargo 外部关系、runtime state、event collaboration、external body 和 marketplace transaction 不得进入 compile dependency。 |

### 2. 依赖方向草案

Step 4 的方向预告整体合理,但 R5.9 需要把它拆成三类:Cargo compile dependency、module/service 使用方向、non-Cargo 外部协作方向。三类不能混写。

```text
core-contracts
  ^
  |
contracts
  ^
  |
domain
  ^
  |
application
  ^
  |
infra
  ^
  |
api / worker / jobs
```

| 关系 | 类型 | 草案判断 |
|---|---|---|
| `contracts -> core-contracts` | Cargo compile | allowed;contracts 可以引用 core typed refs / shared primitive shells。 |
| `domain -> contracts` | Cargo compile | allowed;domain 可使用 public typed ref / marker shell,但不得反向依赖 application / infra。 |
| `application -> contracts/domain` | Cargo compile | allowed;application 编排 use case、port、UoW、idempotency。 |
| `infra -> contracts/domain/application` | Cargo compile | allowed;infra 实现 application ports 和 adapter,可以依赖 port traits。 |
| `api/worker/jobs -> contracts/application/infra` | Cargo compile | allowed;entry 装配 contracts DTO、application services 和 infra runtime builder。 |
| `contracts/domain/application/infra -> api/worker/jobs` | Cargo compile | forbidden;核心库不得依赖入口。 |
| `contracts/domain/application -> infra` | Cargo compile | forbidden;业务与编排不得依赖 adapter。 |
| sibling project -> direct Cargo dependency | Cargo compile | forbidden except `core-contracts`;其他项目经 port / adapter / event / handoff。 |

### 3. 对外暴露边界草案

| 实现单元 | 暴露级别草案 | 原因 |
|---|---|---|
| `contracts` | public external surface | 对外暴露 Command / Query / Inbound / Outbound / Job DTO 壳、typed ref、safe marker 和 view surface。 |
| `domain` | internal library surface | 给 application 和 tests 使用;不作为跨仓 API。 |
| `application` | internal orchestration surface | 给 api / worker / jobs / tests 使用;不直接给相邻仓作为 SDK。 |
| `infra` | internal runtime assembly / adapter surface | 给 entry runner 装配使用;不作为业务 API。 |
| `api` | binary-capable entry surface | 对外入口只通过 transport-neutral handler / assembly 表达,不固定 HTTP / RPC。 |
| `worker` | binary-capable runner surface | 承接 inbound / event publisher runner,不暴露业务 truth API。 |
| `jobs` | binary-capable job runner surface | 承接 operations job runner,不暴露 core truth write API。 |

### 4. non-Cargo 外部关系草案

| 外部关系 | 当前协作方式 | 禁止升格 |
|---|---|---|
| `L0-bus` | publisher / consumer port、event candidate、transport binding、fake | 不写 Cargo dependency,不恢复 outbox relay。 |
| `L1-process` | controlled consumption material / runtime adapter / degraded branch | 不读取或保存 process runtime truth。 |
| `L1-identity` | actor / role / identity safe summary adapter、audit metadata | 不把 identity member state 写成 internal model。 |
| `L2-runtime` | runtime use adapter、config binding、fake / unavailable branch | 不把 runtime execution state 入仓。 |
| `L2-member-images` | image variant definition consumption boundary、adapter / fake | 不把 image build state 入仓。 |
| `L4-observability` / archive / external systems | handoff adapter、audit/report boundary、external summary/ref | 不保存 raw report、external body、artifact body 或 observability payload。 |

### 5. R5.10 写入边界草案

`R5.10` 应固化依赖矩阵、暴露边界和禁止方向,但仍不裁决最终模块主轴。

| R5.10 应写入 | R5.10 不得写入 |
|---|---|
| Cargo compile dependency matrix。 | 最终模块主轴裁决。 |
| allowed / forbidden dependency 表。 | 对象字段、trait 方法、DTO schema、flow、state matrix。 |
| 对外暴露边界表。 | 正式 `03-详细设计.md` 正文。 |
| non-Cargo 外部关系承接表。 | 具体 transport、database、queue、scheduler、HTTP/RPC 产品。 |
| R5.11 模块主轴裁决输入门禁。 | Step 6 对象契约。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 4 依赖预告 | 是。 |
| 是否读取 R5.8 映射表 | 是。 |
| 是否形成 compile / module dependency 草案 | 是。 |
| 是否形成对外暴露边界草案 | 是。 |
| 是否形成 non-Cargo 外部关系草案 | 是。 |
| 是否裁决最终模块主轴 | 否。 |
| 是否写最终 dependency matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.10` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.10 依赖矩阵与暴露边界:再写入`;只允许写入 Cargo compile dependency matrix、allowed / forbidden dependency、对外暴露边界、non-Cargo 外部关系承接和 R5.11 输入门禁;不得裁决最终模块主轴,不得修改正式 `03-详细设计.md`,不得进入 `R5.11` 或 Step 6。

---

## R5.10 依赖矩阵与暴露边界:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.10 依赖矩阵与暴露边界:再写入`。 |
| 本模块目标 | 将 R5.9 的依赖方向草案固化为 Cargo compile dependency matrix、allowed / forbidden dependency、对外暴露边界和 non-Cargo 外部关系承接。 |
| 当前写入边界 | 只写依赖矩阵和暴露边界,不裁决最终模块主轴。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不写对象字段、trait 方法、DTO schema、flow 或 state matrix;不固定 database / queue / scheduler / HTTP / RPC 产品。 |

### 2. Cargo compile dependency matrix

| 当前 crate | 允许直接依赖 | 禁止直接依赖 | 说明 |
|---|---|---|---|
| `contracts` | `core-contracts` | `domain`;`application`;`infra`;`api`;`worker`;`jobs`;除 `core-contracts` 外的 sibling 项目 | 只承载 public surface、typed ref、safe marker、view / event / job 壳。 |
| `domain` | `contracts` | `application`;`infra`;`api`;`worker`;`jobs`;非 `core-contracts` sibling 项目 | 承载 object、state、policy、guard、invariant 和 domain error。 |
| `application` | `contracts`;`domain` | `infra`;`api`;`worker`;`jobs`;非 `core-contracts` sibling 项目 | 承载 use case orchestration、port trait、UoW、idempotency 和 boundary coordination。 |
| `infra` | `contracts`;`domain`;`application` | `api`;`worker`;`jobs`;非 `core-contracts` sibling 项目 | 实现 application ports、adapter、runtime builder、config binding 和 fake。 |
| `api` | `contracts`;`application`;`infra` | `domain` direct;`worker`;`jobs`;非 `core-contracts` sibling 项目 | 同步 Command / Query entry assembly;不得绕过 application 直接调 domain。 |
| `worker` | `contracts`;`application`;`infra` | `domain` direct;`api`;`jobs`;非 `core-contracts` sibling 项目 | inbound / event publisher runner assembly;不恢复 outbox relay。 |
| `jobs` | `contracts`;`application`;`infra` | `domain` direct;`api`;`worker`;非 `core-contracts` sibling 项目 | operations job runner assembly;不修 core truth。 |

### 3. Allowed / forbidden dependency rules

| 规则 | 状态 | 说明 |
|---|---|---|
| `core-contracts` 只作为 compile dependency candidate | allowed | 通过 workspace dependency 按需引入;实施前重新核对相对路径。 |
| `contracts -> core-contracts` | allowed | public refs / primitive shells 可复用 core contracts。 |
| `domain -> contracts` | allowed | domain 可使用 typed refs、summary refs、safe marker 壳。 |
| `application -> contracts/domain` | allowed | application 编排 domain rule 与 public contract。 |
| `infra -> contracts/domain/application` | allowed | infra 实现 application port,可使用 domain type 和 contracts shell。 |
| `api/worker/jobs -> contracts/application/infra` | allowed | entry / runner 装配 application service 与 infra runtime builder。 |
| `contracts/domain/application -> infra` | forbidden | 防止业务 / 编排层反向依赖 adapter。 |
| `contracts/domain/application/infra -> api/worker/jobs` | forbidden | 防止 library crate 依赖入口或 runner。 |
| `api/worker/jobs -> domain` direct | forbidden | entry 必须通过 application service 或 infra builder,不得绕过 use case 边界。 |
| `api <-> worker <-> jobs` 互依 | forbidden | 三者是并列 entry / runner,共享能力只能下沉到 application / infra / contracts。 |
| 非 `core-contracts` sibling repo Cargo dependency | forbidden | `L0-bus`、`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images`、`L4-observability` 等必须经 port / adapter / event / handoff。 |
| `common` / `utils` shared crate | forbidden_as_current_axis | 当前不新增 shared/common crate;重复逻辑先归入明确 owner。 |

### 4. 对外暴露边界表

| 实现单元 | 对外暴露级别 | 可暴露内容 | 不可暴露内容 |
|---|---|---|---|
| `contracts` | public external surface | Command / Query / Inbound / Outbound / Job DTO 壳、typed refs、safe markers、public view surface、protocol rejection 壳。 | domain invariant、repository、adapter、runtime builder、transport binding、database schema。 |
| `domain` | internal library surface | domain object、policy、guard、state、domain error,供 application 和 tests 使用。 | 跨仓 API、transport DTO、repository / adapter、external payload。 |
| `application` | internal orchestration surface | application service、port trait、UoW、idempotency、query / consumer / job orchestration。 | 具体 infra implementation、transport handler、database / queue product detail。 |
| `infra` | internal adapter / runtime assembly surface | repository / material store adapter、external adapter、publisher adapter、runtime builder、config binding、fake。 | 业务 truth owner、public contract API、entry route / runner semantics。 |
| `api` | binary-capable entry surface | Command / Query handler boundary、transport-neutral route / RPC placeholder、entry context injection。 | domain direct write、worker / job execution、auth / gateway owner。 |
| `worker` | binary-capable runner surface | inbound consumer runner、event candidate publisher runner、background loop assembly placeholder。 | outbox relay mechanism、topic schema、retry / dead letter contract、core truth repair。 |
| `jobs` | binary-capable job runner surface | operations job runner、refresh / convergence execution entry、maintenance progress output boundary。 | definition / formal version / relation / external summary / package truth creation or repair。 |

### 5. non-Cargo 外部关系承接表

| 外部关系 | 关系类型 | 承接位置 | Cargo 处理 | 后续闭口位置 |
|---|---|---|---|---|
| `L0-bus` | event collaboration | `application` publisher / consumer port;`infra` transport adapter;`worker` runner;`contracts` event candidate shell | 不写 Cargo dependency | Step 7 port;Step 8 event contract;Step 14 transport binding;Step 16 fake/test。 |
| `L1-process` | runtime consumption | `application` controlled consumption boundary;`infra` runtime adapter / fake;`contracts` safe material surface | 不写 Cargo dependency | Step 7 adapter port;Step 8 query / command surface;Step 12 degraded branch。 |
| `L1-identity` | actor / role / identity safe context | `contracts` actor metadata shell;`application` actor context coordination;`infra` identity adapter / fake | 不写 Cargo dependency | Step 7 identity / actor port;Step 15 audit metadata。 |
| `L2-runtime` | runtime use relation | `application` runtime use port;`infra` runtime adapter;`contracts` typed summary shell | 不写 Cargo dependency | Step 7 runtime port;Step 14 config binding。 |
| `L2-member-images` | image variant definition consumption | `application` consumption boundary;`infra` adapter / fake;`contracts` ref / summary shell | 不写 Cargo dependency | Step 7 adapter;Step 8 consumption surface;Step 12 unavailable branch。 |
| `L4-observability` / archive / external systems | handoff / external collaboration | `application` handoff port;`infra` adapter;`contracts` safe summary/ref;`worker/jobs` runner result boundary | 不写 Cargo dependency | Step 7 handoff/external ports;Step 15 observability;Step 17 handoff。 |

### 6. R5.11 输入门禁

R5.11 可以开始思考最终模块主轴,但只能使用已完成的 R5.6 候选池、R5.8 业务映射和 R5.10 依赖矩阵。R5.11 仍只能“先思考”,不得写最终模块总览表和正式 §5 草稿。

| 输入 | R5.11 使用方式 |
|---|---|
| R5.6 候选池 | 判断七实现单元、七实现单元 + 文件组、八组件横轴和 capability 小循环如何组合成最终主轴。 |
| R5.8 映射表 | 验证最终主轴不能丢失八组件业务 owner。 |
| R5.10 依赖矩阵 | 验证最终主轴不能制造反向依赖或外部 Cargo dependency。 |
| R5.3 / R5.4 framework reference | 借鉴 L1-governance 的模块总览、职责表、对象归属预告和测试切口形态。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Cargo compile dependency matrix | 是。 |
| 是否写入 allowed / forbidden dependency | 是。 |
| 是否写入对外暴露边界 | 是。 |
| 是否写入 non-Cargo 外部关系承接 | 是。 |
| 是否写入 R5.11 输入门禁 | 是。 |
| 是否裁决最终模块主轴 | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow 或 state matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.11` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.11 模块主轴裁决:先思考`;只允许基于 R5.6 候选池、R5.8 映射表、R5.10 依赖矩阵和 L1-governance framework_reference 形成最终模块主轴与单模块小节模板草案;不得写最终模块总览表,不得修改正式 `03-详细设计.md`,不得进入 `R5.12` 或 Step 6。

---

## R5.11 模块主轴裁决:先思考

### 1. 本模块读取范围

| 文档 / 章节 | 当前用途 | 读取结论 |
|---|---|---|
| R5.6 模块主轴候选池 | current_step_input | 七个实现单元是 strongest primary candidate;七实现单元 + 文件组是 template candidate;八组件是 mapping axis;接口家族和 capability 小循环是后续展开轴。 |
| R5.8 业务组成部分到模块映射 | current_step_input | 八组件多数以 `domain` 为业务 owner,`application` 承接后台维护与编排,`contracts` 承接 public shell,`infra` 承接 adapter,`api/worker/jobs` 是 entry / runner。 |
| R5.10 依赖矩阵与暴露边界 | current_step_input | compile dependency 已固定为 `contracts -> core-contracts`, `domain -> contracts`, `application -> contracts/domain`, `infra -> contracts/domain/application`, `api/worker/jobs -> contracts/application/infra`。 |
| R5.3 / R5.4 framework reference | framework_reference | L1-governance 的可借鉴点是先给模块主轴、依赖方向、归属规则和后续 Step 承接模板,不是复制其领域模块。 |
| Step 4 实现单元与文件布局 | direct_predecessor_baseline | 七个 implementation unit、文件组和命名规则已经闭口,Step 5 不再改 workspace 形态。 |

### 2. 裁决输入摘要

R5.11 的问题不是重新发明模块,而是把已经完成的三类输入合并成后续 Step 6~16 可以持续使用的主轴:

| 输入 | 已闭口结论 | 对裁决的约束 |
|---|---|---|
| 工程主轴 | 七个实现单元与 compile dependency 已稳定。 | 顶层主轴必须能直接映射到 workspace crate,否则 Step 6 以后会失去可落码 owner。 |
| 业务横轴 | 八个业务组成部分已经映射到七个实现单元。 | 顶层主轴不能只写 crate 名,必须在模块内保留业务组成部分映射。 |
| 文件组模板 | Step 4 已给出各 crate 内的文件职责。 | 模块小节需要承接文件组,但不能把每个文件变成顶层模块。 |
| 接口家族 | Command / Query / Inbound / Outbound / Operations Job 已作为概要接口族出现。 | 接口家族后移到 Step 7~9 细化,当前只作为模块职责预告。 |
| 依赖边界 | R5.10 已固定 allowed / forbidden dependency。 | 最终模块主轴不得制造反向依赖、entry 互依或非 `core-contracts` sibling Cargo dependency。 |

### 3. 模块主轴裁决思考

当前最稳妥的裁决是:以七个实现单元作为 §5 顶层模块主轴,以七实现单元内部文件组作为每个模块的小节结构,以八个业务组成部分作为横向映射和 owner 校验轴。

| 候选 | 裁决思考 | R5.11 初步结论 |
|---|---|---|
| 七个实现单元 | 与 Step 4、Cargo dependency、文件布局和 R5.10 依赖矩阵完全对齐。 | 作为顶层模块主轴。 |
| 七实现单元 + 文件组 | 能在不扩大顶层数量的情况下承接对象、port、protocol、flow、state 的 owner。 | 作为单模块内部模板。 |
| 八个业务组成部分 | 领域语义强,但若作为顶层模块会重复 contracts / ports / adapters,并容易造成循环依赖。 | 作为业务映射横轴,不作为顶层模块。 |
| 接口家族 | 适合 Step 7/8/9 的 port / protocol / flow 归属,但不能表达 domain truth owner。 | 作为二级映射轴。 |
| capability 小循环 | 适合 Step 6 以后按 definition / formalization / consumption / trace / relation / external / maintenance / package 小循环推进。 | 作为执行展开轴。 |
| 物理文件 | 文件数量和职责会随实现演进微调,直接作为顶层模块会让 §5 变成文件清单。 | 只进入模块内文件主体映射。 |
| 外部关系 | process / identity / runtime / bus 等属于跨仓协作,不是内部 owner。 | 只进入 adapter / port / event / handoff 边界。 |

### 4. 拟定主轴组合草案

R5.12 写入时应采用三层组合,避免“只有 crate 表”或“只有业务表”两种偏差。

| 层级 | 使用位置 | 草案口径 |
|---|---|---|
| 一级主轴 | §5 模块实现契约顶层 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 |
| 二级结构 | 每个一级模块内部 | 承接 Step 4 文件组和模块职责分区,说明 owned surface、internal surface、forbidden surface。 |
| 横向校验 | 每个模块职责表内 | 标明八个业务组成部分在该模块中的承接方式,防止业务主语丢失。 |
| 后续展开 | Step 6~16 | 按一级模块 + capability 小循环逐步展开对象、port、protocol、flow、state、persistence、error、config、observability、test。 |

此处只形成草案,不在 R5.11 写最终模块总览表,也不写正式 §5 草稿。

### 5. 单模块小节模板草案

R5.12 可以将每个模块按相同模板写入,但模板本身仍不能提前填具体对象字段、trait 方法或 DTO schema。

| 小节项 | 应回答的问题 | 不得提前写入 |
|---|---|---|
| 模块身份 | 对应哪个 implementation unit / crate / 文件组。 | 不新增 Step 4 未确认的 crate。 |
| 职责边界 | 本模块拥有什么 truth / shell / orchestration / adapter / entry 职责。 | 不写对象字段和状态迁移细节。 |
| 对外暴露 | public external surface、internal library surface 或 binary-capable entry surface。 | 不写完整 protocol DTO schema。 |
| 依赖边界 | 允许依赖和禁止依赖。 | 不增加非 `core-contracts` sibling Cargo dependency。 |
| 业务横轴映射 | 八个业务组成部分在本模块中的承接方式。 | 不把八组件机械拆成 crate。 |
| 接口家族预告 | command / query / inbound / outbound / job 中哪些由本模块承接。 | 不写 trait method signature 或 function flow。 |
| 后续 Step 承接 | Step 6~16 中哪些内容以本模块为 owner 展开。 | 不进入 Step 6 对象契约或 Step 7 port 契约。 |
| 风险与禁止项 | 本模块最容易越界的内容。 | 不把外部正文、runtime truth、member state 或 process execution 写成本仓 truth。 |

### 6. R5.12 写入边界草案

`R5.12` 应把本模块思考固化为 Step 5 的主体结论,但仍不修改正式 `03-详细设计.md`。

| R5.12 应写入 | R5.12 不得写入 |
|---|---|
| 七个实现单元作为最终顶层模块主轴的裁决。 | 正式 `03-详细设计.md` 正文。 |
| 模块总览表。 | Step 6 对象字段、值域、状态字段。 |
| 模块依赖图和禁止方向。 | Step 7 trait / port / adapter 方法签名。 |
| 单模块小节模板。 | Step 8 protocol DTO schema。 |
| 八组件横向校验入口。 | Step 9 flow、Step 10 state matrix、Step 11 persistence schema。 |
| R5.13 历史差异审计输入门禁。 | 任何旧 `MethodContent` / snapshot / outbox / PostgreSQL 结论继承。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取 R5.6 候选池 | 是。 |
| 是否读取 R5.8 映射表 | 是。 |
| 是否读取 R5.10 依赖矩阵 | 是。 |
| 是否形成模块主轴裁决草案 | 是。 |
| 是否形成单模块小节模板草案 | 是。 |
| 是否写最终模块总览表 | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow 或 state matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.12` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.12 模块主轴裁决:再写入`;只允许写入七个实现单元作为最终模块主轴的裁决、模块总览表、模块依赖图、单模块小节模板和 R5.13 输入门禁;不得修改正式 `03-详细设计.md`,不得写对象字段、trait 方法、DTO schema、flow、state matrix 或 persistence schema,不得进入 `R5.13` 或 Step 6。

---

## R5.12 模块主轴裁决:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.12 模块主轴裁决:再写入`。 |
| 本模块目标 | 将 R5.11 的裁决草案固化为 Step 5 主体中间产物。 |
| 当前写入边界 | 只写最终模块主轴、模块总览、依赖图、模块职责表、归属预告、测试切口预告和 R5.13 输入门禁。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不写对象字段、trait 方法签名、DTO schema、函数级 flow、状态矩阵或持久化 schema。 |

### 2. 最终模块主轴裁决

| 裁决项 | 结论 | 理由 |
|---|---|---|
| 顶层模块主轴 | 采用七个实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | 与 Step 4 workspace / crate / 文件布局和 R5.10 compile dependency 完全一致,可给后续 Step 明确 owner。 |
| 模块内部结构 | 采用 Step 4 文件组和职责分区作为每个模块内部模板。 | 既保留工程边界,又能承接对象、port、protocol、flow、state 的归属。 |
| 业务横向校验 | 采用 02 的八个业务组成部分作为 mapping axis。 | 防止七个 crate 名吞掉 method-library 的领域主语。 |
| 后续执行轴 | Step 6 以后按模块 + capability 小循环推进。 | 避免再次退回全仓总表式生成。 |
| 不采用项 | 不以八组件、接口家族、物理文件或外部关系作为顶层主轴。 | 八组件会重复 contracts / ports / adapters;接口家族不能表达 truth owner;物理文件过细;外部关系不是内部模块。 |

### 3. 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 直接依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `method-library-contracts` | 定义 public surface、typed ref、summary ref、safe marker、command/query/event/job/view 壳。 | public external surface。 | `core-contracts`。 |
| `domain` | `crates/domain` / `method-library-domain` | 定义 method definition truth、catalog、formalization、consumption、trace、relation、external summary、package 等领域对象、policy、state、guard 和 domain error。 | internal library surface。 | `contracts`。 |
| `application` | `crates/application` / `method-library-application` | 编排 command/query/consumer/job use case、port、UoW、idempotency、boundary coordination、degraded / unavailable branch。 | internal orchestration surface。 | `contracts`;`domain`。 |
| `infra` | `crates/infra` / `method-library-infra` | 实现 repository、material store、external adapter、publisher adapter、runtime builder、config binding、clock/id/fake。 | internal adapter / runtime assembly surface。 | `contracts`;`domain`;`application`。 |
| `api` | `crates/api` / `method-library-api` | 承接同步 Command / Query handler assembly 和 transport-neutral entry boundary。 | binary-capable entry surface。 | `contracts`;`application`;`infra`。 |
| `worker` | `crates/worker` / `method-library-worker` | 承接 inbound consumer runner、event candidate publisher runner 和 background loop assembly。 | binary-capable runner surface。 | `contracts`;`application`;`infra`。 |
| `jobs` | `crates/jobs` / `method-library-jobs` | 承接 operations job runner、refresh、reconciliation、convergence、handoff / report boundary。 | binary-capable job runner surface。 | `contracts`;`application`;`infra`。 |

### 4. 模块依赖图

```text
+------------------+
|  core-contracts  |
+---------+--------+
          ^
          |
+---------+-----+
|   contracts   |
+---------+-----+
          ^
          |
+---------+-----+
|     domain    |
+---------+-----+
          ^
          |
+---------+-----+
|  application  |<-----------------------------+
+---------+-----+                              |
          ^                                    |
          | implements ports                   |
+---------+-----+                              |
|      infra    |------------------------------+
+---+-----+---+-+
    ^     ^   ^
    |     |   |
+---+-+ +-+---+ +----+
| api | |worker| |jobs|
+-----+ +------+ +----+
```

关键说明:

- 图表达 crate / module dependency,不表达函数级处理流。
- `application` 定义 port,`infra` 实现 port,`application` 不依赖 `infra`。
- `api`、`worker`、`jobs` 是并列 entry / runner,不得互相依赖。
- 除 `core-contracts` 外,其他 sibling repo 不进入 Cargo dependency,只能经 port / adapter / event / handoff 表达。

### 5. 模块职责表

| 模块 | 主要责任 | 允许依赖 | 禁止事项 |
|---|---|---|---|
| `contracts` | public DTO 壳、typed ref、safe marker、view / event / job surface。 | `core-contracts`。 | 不拥有 truth;不依赖 domain / application / infra / entry;不提前写满 Step 8 schema。 |
| `domain` | truth object、state、policy、guard、invariant、domain error。 | `contracts`。 | 不读 config / repository / adapter;不保存 external body、runtime truth、process execution 或 identity member state。 |
| `application` | use case orchestration、port trait owner、UoW、idempotency、query no-write、consumer/job coordination。 | `contracts`;`domain`。 | 不实现 adapter;不直接依赖 DB / bus / HTTP / scheduler;不绕过 domain policy。 |
| `infra` | port implementation、fake / durable store、external resolver、publisher、handoff adapter、runtime builder。 | `contracts`;`domain`;`application`。 | 不反向决定业务 owner;不固定具体产品;不被 contracts/domain/application 反向依赖。 |
| `api` | 同步 command/query entry assembly、handler boundary、error mapping。 | `contracts`;`application`;`infra`。 | 不直接调用 domain;不运行 worker/job;不实现 auth / gateway owner。 |
| `worker` | inbound event intake、event candidate publishing、background runner assembly。 | `contracts`;`application`;`infra`。 | 不恢复 outbox relay;不修 core truth;不与 api/jobs 互依。 |
| `jobs` | operations job execution、派生 material refresh、reference refresh、reconciliation、handoff report。 | `contracts`;`application`;`infra`。 | 不创建或修复 core truth;不复制 external body;不与 api/worker 互依。 |

### 6. 业务组成部分到模块横向校验

| 业务组成部分 | primary owner | supporting modules | entry / runner |
|---|---|---|---|
| 方法资产定义与目录 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate only |
| 正式化与版本 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate only |
| 受控消费 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` handoff / event candidate |
| 追溯与一致性保护 | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` |
| 关系与分发语义 | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` |
| 外部摘要与引用 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` inbound / event |
| 后台维护与收敛 | `application` | `contracts`;`domain`;`infra` | `api`;`worker`;`jobs` |
| 外围包与方法集组织 | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` |

### 7. 归属预告

正式对象契约留给 Step 6,trait / port / adapter 契约留给 Step 7,protocol 契约留给 Step 8。本节只固定 owner。

| 类别 | 归属模块 | 示例口径 |
|---|---|---|
| public refs / markers / request / result / view / event / job shell | `contracts` | method definition ref、formal version ref、consumption view、external summary ref、job result shell。 |
| truth object / value object / state / policy / domain error | `domain` | definition、catalog、formalization、consumption material、trace、relation、external summary、package / set。 |
| service / port trait / UnitOfWork / idempotency / application error | `application` | command service、query service、inbound intake service、maintenance job orchestration、adapter port。 |
| repository / adapter / fake / runtime builder / config binding | `infra` | truth repository、material store、external resolver、publisher adapter、handoff adapter、fake runtime。 |
| command / query handler | `api` | transport-neutral handler boundary and assembly。 |
| inbound consumer / publisher runner | `worker` | external summary intake runner、event candidate publishing runner。 |
| operations job runner | `jobs` | refresh、reconciliation、convergence、handoff report runner。 |

### 8. 单模块小节模板

后续正式 §5 草稿和 Step 6~16 的模块展开应沿用以下模板:

| 小节项 | 写入内容 | 后续闭口位置 |
|---|---|---|
| 模块身份 | implementation unit、Cargo package、Rust crate、主要文件组。 | Step 4 / Step 5。 |
| 职责边界 | owner responsibility、supporting responsibility、forbidden responsibility。 | Step 5。 |
| 对外暴露 | public external / internal library / orchestration / adapter / entry surface。 | Step 5 / Step 8。 |
| 依赖边界 | allowed dependency、forbidden dependency、non-Cargo collaboration。 | Step 5 / Step 7 / Step 14。 |
| 业务横轴映射 | 八组件在本模块中的承接方式。 | Step 5 / Step 6~9。 |
| 对象归属 | 对象类别 owner,不写字段。 | Step 6。 |
| port / adapter 归属 | trait / adapter owner,不写方法签名。 | Step 7。 |
| protocol / handler 归属 | DTO / handler / runner owner,不写 schema。 | Step 8 / Step 9。 |
| 测试切口预告 | 模块级测试责任,不写 case schema。 | Step 16。 |

### 9. 模块测试切口预告

| 模块 | 测试切口预告 |
|---|---|
| `contracts` | DTO shell roundtrip、typed ref / marker fixture、body-free fixture、event/job shell fixture。 |
| `domain` | policy accept/reject、不变量、状态成立规则、forbidden transition、body-free guard。 |
| `application` | command/query/consumer/job orchestration、idempotency、UoW rollback、query no-write、degraded branch。 |
| `infra` | fake repository behavior、adapter unavailable mapping、runtime builder wiring、config binding validation。 |
| `api` | handler validation、metadata propagation、application/protocol error mapping。 |
| `worker` | inbound envelope validation、dedup、unsupported source/version、publisher runner boundary。 |
| `jobs` | job input validation、batch/page behavior、partial failure、stale/degraded output、handoff report boundary。 |

### 10. R5.13 输入门禁

`R5.13` 只允许做历史 Step 5 差异审计的“先思考”,不得用旧文件反推当前主轴。

| R5.13 可使用输入 | 使用方式 |
|---|---|
| 旧 `03_ddd_step_05_module_contracts.md` 历史残留 | 扫描旧 13 模块、旧 P0、`MethodContent`、snapshot、fingerprint、outbox、PostgreSQL 等污染。 |
| 旧正式 `03-详细设计.md` §5 | 扫描旧章节结构和旧主线残留。 |
| 当前 R5.12 主轴结论 | 作为差异审计的对照基线。 |
| 当前 `00/01/02` | 判断旧内容是否可重新命名、后移或必须禁入。 |

### 11. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入最终模块主轴裁决 | 是。 |
| 是否写入模块总览表 | 是。 |
| 是否写入模块依赖图 | 是。 |
| 是否写入模块职责表 | 是。 |
| 是否写入归属预告和测试切口预告 | 是。 |
| 是否写对象字段、trait 方法、DTO schema、flow、state matrix 或 persistence schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.13` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.13 历史 Step 5 差异审计:先思考`;只允许扫描旧 Step 5 和旧正式 §5 的污染类别、审计对象、判断规则和 R5.14 写入模板;不得用旧内容反推当前模块主轴,不得修改正式 `03-详细设计.md`,不得进入 `R5.14` 或 Step 6。

---

## R5.13 历史 Step 5 差异审计:先思考

### 1. 本模块读取范围

| 材料 | 当前用途 | 读取结论 |
|---|---|---|
| 旧 `03_ddd_step_05_module_contracts.md` 历史版本 | historical_material | 旧文件以 `[x] 已确认`、旧 6 crate、P0/P1、13 个可实现模块和 `MethodContent` 主线组织 Step 5,与当前七实现单元主轴冲突。 |
| 旧正式 `projects/L3-method-library/03-详细设计.md` §5 | historical_material | 旧 §5 已把对象字段、函数、状态、snapshot、outbox、PostgreSQL 等混入模块章节,超出当前 Step 5 只定主轴和归属的边界。 |
| 当前 R5.12 主轴结论 | current_baseline | 当前只承认七实现单元顶层主轴、文件组模板、八组件横轴和后续 Step 分工。 |
| 当前 `00/01/02` | canonical_input | 判断旧内容若要保留,必须经当前需求、架构、概要或后续 Step 重新命名、重新闭口。 |

### 2. 审计目标

R5.13 的目标不是确认旧内容能否复用,而是为 R5.14 准备审计模板,防止旧 Step 5 的 completed 状态、旧模块名、旧对象名和旧实现假设回流到当前 Step 5。

| 审计问题 | 当前思考 |
|---|---|
| 旧 Step 5 的 completed 状态如何处理? | 一律视为 invalid_status,只能作为污染样本。 |
| 旧 13 模块结构如何处理? | 不继承;只能按禁入、后移或重定义三类审计。 |
| 旧对象字段和函数签名如何处理? | 不在 Step 5 接收;如当前 00/01/02 仍需要相似能力,后移到 Step 6~9 重新闭口。 |
| 旧技术产品假设如何处理? | PostgreSQL、HTTP、gateway、outbox relay 等不得作为 Step 5 主轴;产品绑定后移到 Step 11/14 或对应协议/adapter Step。 |
| 旧 P0/P1 如何处理? | 当前 full-restart 不恢复旧 P0/P1 分层;若存在 peripheral / later phase,由当前范围和后续风险清单重新表达。 |

### 3. 污染类别草案

| 污染类别 | 典型信号 | R5.14 判断方向 |
|---|---|---|
| 状态污染 | `[x] 已确认`、Step 5 completed、可直接回填正式 §5。 | 标为 invalid_status,不得继承。 |
| 主轴污染 | 旧 13 模块、旧 6 crate、`domain::content`、`application::sync_services`、`infra::persistence` 等作为顶层主轴。 | 与 R5.12 七实现单元主轴冲突,默认禁入或重定义为模块内归属提示。 |
| 领域主语污染 | `MethodContent`、7 类 P0 definition subtype、publish lifecycle 作为当前主语。 | 不直接继承;若能力仍需,Step 6 按当前 00/01/02 重新命名和闭口。 |
| 技术产品污染 | PostgreSQL、HTTP/RPC、gateway extractor、object storage、L0-bus client、outbox table。 | 后移到 Step 7/8/11/14/15/16,不得进入 Step 5 主轴。 |
| 机制主线污染 | snapshot、fingerprint、outbox relay、delivery、replay/resync。 | 不作为当前 Step 5 正向主线;若需 digest/event/material,后续 Step 重新定义。 |
| 范围污染 | P0/P1、P1 plugin/configuration、marketplace metadata。 | 不恢复旧范围分层;按当前 scope / peripheral / risk 重新判断。 |
| 深度污染 | 在旧 §5 中直接写对象字段、函数签名、状态迁移、事务和测试断言。 | 从 Step 5 移出,分别后移 Step 6~16。 |

### 4. 审计对象清单草案

| 审计对象 | 需要扫描的内容 | 不得做的事 |
|---|---|---|
| 旧 `03_ddd_step_05_module_contracts.md` §1~§7 | 旧输入、SOP 回答、设计取舍、模块总览、依赖图、职责表、归属映射、P1 边界。 | 不把旧模块表复制到当前 R5.12。 |
| 旧 `03_ddd_step_05_module_contracts.md` §8~§10 | 旧回填草稿、待确认事项、进入下一步条件。 | 不让旧“可进入 Step 6”状态覆盖当前门禁。 |
| 旧正式 `03-详细设计.md` §5 | 旧模块总览、旧模块小节、对象字段、函数、状态、端口和测试片段。 | 不把旧 §5 当作当前正式草稿。 |
| 当前 R5.12 主轴结论 | 七实现单元、模块依赖图、归属预告、测试切口预告。 | 不因旧材料存在而改动当前主轴。 |

### 5. 判断规则草案

| 判断结果 | 使用条件 | 后续动作 |
|---|---|---|
| `禁入` | 与当前 00/01/02、Step 3/4/5 裁决冲突,或引入旧 P0/P1、旧 `MethodContent`、旧 outbox relay、固定 PostgreSQL / gateway。 | R5.14 写入禁入表,后续 Step 不得引用。 |
| `后移` | 概念可能仍有工程价值,但属于对象字段、trait 方法、DTO schema、flow、state、persistence、config、test。 | R5.14 写明后移到 Step 6~16 的具体位置。 |
| `重定义` | 能力方向与当前 00/01/02 大体相容,但旧命名、边界或 owner 已失效。 | R5.14 写明必须按当前主轴重新命名、重新归属、重新闭口。 |
| `仅作历史注记` | 只说明为什么旧方案被替换,不进入当前设计。 | R5.14 记录为 historical_note。 |

### 6. R5.14 写入模板草案

`R5.14` 应把本模块思考固化为审计表,但仍不得修改正式 `03-详细设计.md`。

| R5.14 应写入 | R5.14 不得写入 |
|---|---|
| 旧 Step 5 状态污染关闭记录。 | 当前正式 §5 回填草稿。 |
| 旧模块主轴禁入 / 后移 / 重定义表。 | Step 6 对象字段或 Step 7 trait 方法。 |
| 旧正式 §5 污染扫描表。 | 任何旧对象字段、函数签名、状态矩阵、持久化 schema。 |
| 当前 R5.12 主轴保护表。 | 用旧内容修正当前主轴。 |
| R5.15 回填草稿输入门禁。 | 进入 Step 6。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取旧 Step 5 历史版本 | 是。 |
| 是否读取旧正式 §5 污染信号 | 是。 |
| 是否形成污染类别草案 | 是。 |
| 是否形成审计对象清单 | 是。 |
| 是否形成判断规则和 R5.14 写入模板 | 是。 |
| 是否用旧内容反推当前模块主轴 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R5.14` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.14 历史 Step 5 差异审计:再写入`;只允许写入旧 Step 5 状态污染关闭记录、旧模块主轴禁入 / 后移 / 重定义表、旧正式 §5 污染扫描表、当前 R5.12 主轴保护表和 R5.15 输入门禁;不得修改正式 `03-详细设计.md`,不得写对象字段、trait 方法、DTO schema、flow、state matrix 或 persistence schema,不得进入 `R5.15` 或 Step 6。

---

## R5.14 历史 Step 5 差异审计:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.14 历史 Step 5 差异审计:再写入`。 |
| 本模块目标 | 关闭旧 Step 5 completed 污染,写入旧内容禁入 / 后移 / 重定义表。 |
| 当前写入边界 | 只写审计闭口记录、旧模块主轴处理、旧正式 §5 污染扫描、当前 R5.12 主轴保护和 R5.15 输入门禁。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不写对象字段、trait 方法、DTO schema、flow、state matrix 或 persistence schema。 |

### 2. 旧 Step 5 状态污染关闭记录

| 旧材料 | 旧状态 / 旧结论 | 当前处理 |
|---|---|---|
| 旧 `03_ddd_step_05_module_contracts.md` | 标记 `[x] 已确认`,并声称可进入 Step 6。 | invalid_status;当前 Step 5 以 R5.1~R5.18 重新执行,旧完成状态不得继承。 |
| 旧正式 `03-详细设计.md` §5 | 已含完整旧模块实现契约。 | historical_material;只作污染扫描,不得作为本轮正式 §5 草稿。 |
| 旧 Step 5 回填草稿 | 可直接回填正式 03。 | invalid_draft;必须由 R5.15/R5.16 基于当前 R5.12 重新生成。 |
| 旧 Step 5 进入下一步条件 | 声称模块主轴稳定并可进入 Step 6。 | invalid_gate;当前必须完成 R5.15~R5.18 后才可判断进入 Step 6。 |

### 3. 旧模块主轴处理表

| 旧内容 | 审计结果 | 处理口径 |
|---|---|---|
| 旧 13 个可实现模块 | 禁入为顶层主轴 | 当前顶层主轴只采用七个实现单元;旧 13 模块不得作为 §5 顶层模块表。 |
| 旧 6 crate Rust workspace | 禁入 | 当前 Step 4 已固定七个实现单元,包括 `jobs`;旧 6 crate 不得回流。 |
| `domain::content` / `domain::definitions` / `domain::policies` | 重定义 | 可作为 domain 内部文件组 / 归属提示的历史参照,但必须按当前 definition / catalog / formalization / consumption 等语义重新闭口。 |
| `application::command_services` / `sync_services` / `query_services` / `operations_services` | 重定义 | 不作为顶层模块;只能在 `application` 内作为 service family 候选,Step 7/9 再定 trait / flow。 |
| `application::ports` | 后移 | port owner 确认为 `application`,但 trait 方法和接口族归属后移 Step 7。 |
| `infra::persistence` / `infra::outbound_adapters` | 后移 | adapter owner 确认为 `infra`,但持久化产品、repository schema、adapter 细节后移 Step 7/11/14。 |
| `api` / `worker` | 重定义 | 当前保留为七实现单元中的 entry / runner,但旧 gateway / outbox relay 语义禁入。 |

### 4. 旧领域主语与机制处理表

| 旧主语 / 机制 | 审计结果 | 处理口径 |
|---|---|---|
| `MethodContent` | 重定义 | 不作为当前 Step 5 模块主语;若仍需表示方法资产定义 truth,由 Step 6 按当前 00/01/02 重新命名、字段闭口。 |
| 7 类 P0 definition subtype | 重定义 | 不作为旧 P0 subtype 继承;按当前八组件和 Step 6 对象契约重新判断对象族。 |
| publish / publication lifecycle | 重定义 | 当前以 formalization / formal version / distribution / consumption 等语义重新展开;旧 publish 主线不得直接继承。 |
| snapshot / fingerprint | 后移 | 不作为 Step 5 主轴;若需要 digest / material / marker,在 Step 6/8/13 重新闭口。 |
| outbox relay / delivery worker | 禁入旧机制 | 不恢复旧 outbox relay;outbound event / publisher boundary 后移 Step 7/8/9。 |
| replay / resync / rebuild / recalculate | 后移 | 作为 operations job / maintenance 候选,在 `jobs`、Step 9/13/16 中重新闭口。 |
| P0 / P1 | 禁入旧分层 | 当前 full-restart 不恢复旧优先级层;peripheral / later phase 由当前 scope 和风险清单重新表达。 |

### 5. 旧技术产品与实现假设处理表

| 旧假设 | 审计结果 | 后续位置 |
|---|---|---|
| PostgreSQL / sqlx / migrations | 后移 | Step 11 持久化、事务与一致性契约。 |
| HTTP / RPC route / gateway extractor | 后移 / 重定义 | Step 8 protocol、Step 9 handler flow、Step 14 config;本仓不实现 auth / gateway owner。 |
| object storage / blob payload | 后移 | Step 7 adapter port、Step 14 config、Step 12 unavailable branch。 |
| L0-bus concrete publisher / topic / retry / dead letter | 后移 | Step 7 port、Step 8 event contract、Step 13 idempotency / retry、Step 14 transport binding。 |
| repository / UnitOfWork method signatures | 后移 | Step 7 trait / port,Step 11 transaction consistency。 |
| status enum / lifecycle matrix | 后移 | Step 10 state machine。 |
| test cases and assertions | 后移 | Step 16 test cut。 |

### 6. 旧正式 §5 污染扫描表

| 旧正式 §5 信号 | 污染类型 | 当前处理 |
|---|---|---|
| 在 §5 直接写 `MethodContent` 字段、函数和生命周期 | 深度污染 / 领域主语污染 | 不进入当前 Step 5;后移 Step 6/10。 |
| 在 §5 直接写 command service 方法签名 | 深度污染 | 后移 Step 7/9。 |
| 在 §5 直接写 snapshot / outbox / fingerprint 契约 | 机制主线污染 | 后移 Step 6/8/11/13 按当前语义重定义。 |
| 在 §5 固定 PostgreSQL 和 outbox table 行为 | 技术产品污染 | 后移 Step 11/14。 |
| 在 §5 写测试切口具体 case | 深度污染 | 当前只保留模块级测试责任预告;正式 case 后移 Step 16。 |

### 7. 当前 R5.12 主轴保护表

| 当前结论 | 保护规则 |
|---|---|
| 顶层模块主轴是七个实现单元 | 不因旧 13 模块存在而改回旧主轴。 |
| 八组件是横向校验轴 | 不把旧 7 类 P0 definition subtype 当成当前业务横轴。 |
| Step 5 只定模块主轴和归属门禁 | 不接收旧 §5 的字段、函数、DTO、flow、state、persistence 和 test case。 |
| `contracts -> core-contracts` 是唯一 sibling Cargo dependency 候选 | 不恢复旧 L0-bus、governance、blob、PostgreSQL client 作为 Step 5 compile dependency。 |
| 正式 §5 草稿后移 R5.15/R5.16 | 不使用旧回填草稿。 |

### 8. R5.15 输入门禁

`R5.15` 只允许思考正式 §5 回填策略,不得直接修改正式 `03-详细设计.md`。

| 输入 | R5.15 使用方式 |
|---|---|
| R5.12 主轴主体结论 | 作为正式 §5 草稿的唯一正向内容来源。 |
| R5.14 差异审计结果 | 作为旧内容过滤器,防止污染回流。 |
| R5.3/R5.4 framework_reference | 只复用结构,不复制 governance 内容。 |
| 当前 00/01/02 | 校验正式 §5 草稿不越界。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否关闭旧 Step 5 completed 状态污染 | 是。 |
| 是否写入旧模块主轴禁入 / 后移 / 重定义表 | 是。 |
| 是否写入旧正式 §5 污染扫描表 | 是。 |
| 是否写入当前 R5.12 主轴保护表 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow、state matrix 或 persistence schema | 否。 |
| 是否进入 `R5.15` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.15 回填草稿:先思考`;只允许思考正式 §5 回填策略、回填结构、压缩规则、禁入过滤和 R5.16 写入边界;不得修改正式 `03-详细设计.md`,不得写 Step 6 对象字段、Step 7 trait 方法、Step 8 DTO schema、Step 9 flow、Step 10 state matrix 或 Step 11 persistence schema,不得进入 `R5.16` 或 Step 6。

---

## R5.15 回填草稿:先思考

### 1. 思考记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.15 回填草稿:先思考`。 |
| 本模块目标 | 在不写正式 §5 正文的前提下,确定 R5.16 如何把 Step 5 已确认结论压缩成可回填草稿。 |
| 当前边界 | 只思考正式 §5 的回填策略、结构、压缩规则、禁入过滤和 R5.16 写入边界。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不生成完整 §5 草稿;不进入 Step 6;不写对象字段、trait 方法、DTO schema、flow、state matrix 或 persistence schema。 |

### 2. 回填输入确认

| 输入 | 当前状态 | R5.16 使用方式 |
|---|---|---|
| R5.12 主轴主体结论 | completed | 作为正式 §5 草稿的唯一正向内容来源。 |
| R5.14 差异审计结果 | completed | 作为旧内容过滤器,阻止旧 Step 5 污染回流。 |
| R5.3/R5.4 framework_reference | completed | 只复用章节组织、表格密度和门禁表达,不复用 L1-governance 领域语义。 |
| Step 4 布局结论 | completed | 提供七个实现单元、文件组和依赖方向基础。 |
| 当前 `00/01/02` | completed | 校验 §5 不越过 method-library 的业务边界和概要主语。 |

### 3. 回填策略判断

正式 §5 草稿应当“紧凑但不浅”。它不能把 R5.12 的全部分析逐字搬入正式结构,也不能只留下七个 crate 名称。R5.16 应把 R5.12 的主轴结论压缩为后续 Step 6~16 能直接路由 owner 的章节骨架。

| 策略项 | 判断 |
|---|---|
| 正向来源 | 只使用 R5.12 的七实现单元、依赖图、职责表、业务横轴映射、归属预告和测试切口预告。 |
| 过滤来源 | 用 R5.14 过滤旧 13 模块、旧 6 crate、旧 P0/P1、`MethodContent`、snapshot、outbox、PostgreSQL 等旧主线。 |
| 章节深度 | 每个模块必须有职责、暴露面、依赖边界、业务承接和后续 owner 提示,不能只写一句描述。 |
| 压缩方式 | 重复的依赖说明和禁止事项集中到总表;模块小节只保留差异化责任。 |
| 后续路由 | §5 必须能支持 Step 6 对象归属、Step 7 port owner、Step 8 protocol owner、Step 9 flow owner 和 Step 16 test owner。 |
| 写入位置 | R5.16 只写入本中间产物的“§5 回填草稿”,不直接写正式 `03-详细设计.md`。 |

### 4. R5.16 草稿结构建议

| 顺序 | 草稿小节 | 应包含内容 | 不得包含内容 |
|---:|---|---|---|
| 1 | 模块主轴裁决 | 七个实现单元作为顶层模块主轴,八组件作为横向校验轴,Step 6 以后按模块 + capability 小循环推进。 | 旧 13 模块、旧 P0/P1 或旧 `MethodContent` 主轴。 |
| 2 | 模块总览表 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的职责、暴露面和直接依赖。 | 字段、方法签名、DTO schema 或具体 handler flow。 |
| 3 | 依赖图与边界 | compile dependency、allowed dependency、forbidden dependency、non-Cargo collaboration。 | 具体数据库、bus topic、HTTP route 或产品绑定。 |
| 4 | 模块职责表 | 每个模块的 owner responsibility、supporting responsibility、forbidden responsibility。 | 持久化 schema、事务细节、retry policy。 |
| 5 | 八组件横向映射 | 当前 `02` 八个业务组成部分到七实现单元的 owner / supporting / entry 映射。 | 把八组件机械改成八个 crate。 |
| 6 | 后续归属预告 | 对象、port、protocol、handler、adapter、runner、test owner 的后续闭口位置。 | Step 6~16 的正式细节。 |
| 7 | 单模块展开模板 | 后续每个模块的小节写法和闭口位置。 | 新增未确认的对象族或接口族。 |
| 8 | 模块测试切口预告 | 模块级测试责任方向。 | 具体 test case id、assertion schema 或 evidence schema。 |
| 9 | Step 6 进入条件 | 明确 Step 5 只完成主轴,进入 Step 6 前仍需 R5.17/R5.18 自检停审。 | 直接声称 Step 5 已可完成或跳入 Step 6。 |

### 5. 压缩规则

| 规则 | 说明 |
|---|---|
| 保留七模块完整性 | R5.16 必须覆盖七个实现单元,不得因为压缩而遗漏 `jobs`、`worker` 或 entry boundary。 |
| 保留业务横轴 | R5.16 必须保留八组件横向映射,防止正式 §5 退化为纯工程 crate 表。 |
| 总表承载共性 | 依赖方向、禁止反向依赖、旧 sibling repo 禁入等共性规则放在总表,不在每个模块重复扩写。 |
| 模块小节承载差异 | 每个模块小节只写本模块独有 owner、暴露面、禁止事项和后续闭口提示。 |
| 不写 Step 6 细节 | 如果草稿中出现字段名、trait 方法名、DTO 字段、状态枚举或表结构,应删除或改成“后续 Step 闭口”。 |
| 不复述历史污染 | 旧内容只在差异审计中保留,正式 §5 草稿不重复解释旧方案。 |

### 6. 禁入过滤规则

| 禁入项 | R5.16 处理 |
|---|---|
| 旧 13 模块顶层主轴 | 不进入 §5 草稿;最多在历史审计中保留。 |
| 旧 6 crate 模型 | 不进入 §5 草稿;当前七实现单元是唯一顶层模块主轴。 |
| `MethodContent` 作为模块主语 | 禁止;对象命名后移 Step 6 重新闭口。 |
| P0 / P1 旧分层 | 禁止;当前不使用旧优先级层。 |
| snapshot / fingerprint / outbox relay / delivery worker | 不作为 Step 5 正向内容;如后续需要,由 Step 6~14 重新定义。 |
| PostgreSQL / sqlx / gateway / concrete bus 产品绑定 | 不进入 Step 5 正文;后移 Step 11 / Step 14。 |

### 7. R5.16 写入边界

`R5.16` 可以写入:

- 本中间产物内的 `§5 回填草稿`。
- 模块主轴裁决、总览表、依赖图、职责表、八组件映射、归属预告、单模块模板和测试切口预告。
- R5.17 自检输入门禁。

`R5.16` 不得写入:

- 正式 `projects/L3-method-library/03-详细设计.md`。
- Step 6 对象字段和值对象结构。
- Step 7 trait / port 方法签名。
- Step 8 DTO schema、protocol 字段或 handler schema。
- Step 9 函数级处理流。
- Step 10 状态矩阵。
- Step 11 persistence schema / transaction contract。
- Step 16 test case id / assertion schema。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否形成 R5.16 回填策略 | 是。 |
| 是否明确草稿结构 | 是。 |
| 是否明确压缩规则和禁入过滤 | 是。 |
| 是否明确 R5.16 写入边界 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否生成完整 §5 草稿 | 否。 |
| 是否进入 `R5.16` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.16 回填草稿:再写入`;只允许在 `03_ddd_step_05_module_contracts.md` 写入正式 §5 回填草稿、R5.17 自检输入门禁和本模块状态;不得修改正式 `03-详细设计.md`,不得写 Step 6 对象字段、Step 7 trait 方法、Step 8 DTO schema、Step 9 flow、Step 10 state matrix、Step 11 persistence schema 或 Step 16 case schema,不得进入 `R5.17` 或 Step 6。

---

## R5.16 回填草稿:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.16 回填草稿:再写入`。 |
| 本模块目标 | 将 R5.12 主轴结论按 R5.15 策略压缩成正式 §5 回填草稿。 |
| 当前写入边界 | 只在本中间产物内写 §5 草稿、R5.17 自检输入门禁和状态记录。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不写对象字段、trait 方法、DTO schema、函数级 flow、状态矩阵、持久化 schema 或 test case schema。 |

### 2. §5 回填草稿

以下内容是正式 `03-详细设计.md` §5 的中间草稿。正式文档仍需在对应装配模块或 Step 19 中统一回填。

#### 5.1 模块主轴裁决

本仓详细设计采用七个实现单元作为顶层模块实现契约主轴:

```text
contracts -> domain -> application -> infra -> api / worker / jobs
```

其中:

- `contracts` 是 public surface 和 typed contract owner。
- `domain` 是 method-library truth、policy、state 和 domain error owner。
- `application` 是 use case orchestration、port trait、UoW、idempotency 和 degraded branch owner。
- `infra` 是 repository / adapter / runtime builder / config binding 的实现 owner。
- `api`、`worker`、`jobs` 是并列 entry / runner,只负责装配和边界转译,不得互相依赖。

当前 `02-概要设计.md` 的八个业务组成部分不作为顶层 crate 主轴,而作为横向校验轴。后续 Step 6~16 必须按“模块 + capability 小循环”展开对象、port、protocol、flow、state、persistence、error、config、observability 和 test。

#### 5.2 模块总览

| 模块 | 实现单元 | 核心职责 | 对外暴露 | 直接依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `method-library-contracts` | 定义 body-free public surface、typed ref、safe marker、command / query / event / job / view 壳。 | public external surface。 | `core-contracts`。 |
| `domain` | `crates/domain` / `method-library-domain` | 定义 definition truth、catalog、formalization、consumption、trace、relation、external summary、package / set 的领域对象、policy、state、guard 和 error。 | internal library surface。 | `contracts`。 |
| `application` | `crates/application` / `method-library-application` | 编排 command、query、consumer、job use case,定义 port、UoW、idempotency、boundary coordination 和 degraded / unavailable 分支。 | internal orchestration surface。 | `contracts`;`domain`。 |
| `infra` | `crates/infra` / `method-library-infra` | 实现 repository、material store、external adapter、publisher adapter、runtime builder、config binding、clock / id / fake。 | internal adapter / runtime assembly surface。 | `contracts`;`domain`;`application`。 |
| `api` | `crates/api` / `method-library-api` | 承接同步 command / query handler assembly 和 transport-neutral entry boundary。 | binary-capable entry surface。 | `contracts`;`application`;`infra`。 |
| `worker` | `crates/worker` / `method-library-worker` | 承接 inbound consumer runner、event candidate publisher runner 和 background loop assembly。 | binary-capable runner surface。 | `contracts`;`application`;`infra`。 |
| `jobs` | `crates/jobs` / `method-library-jobs` | 承接 operations job runner、refresh、reconciliation、convergence、handoff / report boundary。 | binary-capable job runner surface。 | `contracts`;`application`;`infra`。 |

#### 5.3 依赖图与边界

```text
+------------------+
|  core-contracts  |
+---------+--------+
          ^
          |
+---------+-----+
|   contracts   |
+---------+-----+
          ^
          |
+---------+-----+
|     domain    |
+---------+-----+
          ^
          |
+---------+-----+
|  application  |<-----------------------------+
+---------+-----+                              |
          ^                                    |
          | implements ports                   |
+---------+-----+                              |
|      infra    |------------------------------+
+---+-----+---+-+
    ^     ^   ^
    |     |   |
+---+-+ +-+---+ +----+
| api | |worker| |jobs|
+-----+ +------+ +----+
```

依赖规则:

| 规则 | 口径 |
|---|---|
| 唯一 sibling Cargo dependency | `contracts -> core-contracts`。 |
| domain 依赖 | `domain -> contracts`。 |
| application 依赖 | `application -> contracts/domain`。 |
| infra 依赖 | `infra -> contracts/domain/application`,用于实现 application ports。 |
| entry / runner 依赖 | `api/worker/jobs -> contracts/application/infra`。 |
| 禁止反向依赖 | `contracts` 不依赖 domain/application/infra/entry;`domain` 和 `application` 不依赖 infra;entry 不直接依赖 domain。 |
| 禁止 entry 互依 | `api`、`worker`、`jobs` 不互相依赖。 |
| 外部协作 | 除 `core-contracts` 外,其他 sibling repo 只通过 port、adapter、event、handoff、typed ref 或 body-free summary 表达,不作为 Step 5 compile dependency。 |

#### 5.4 逐模块实现契约

| 模块 | owner responsibility | supporting responsibility | forbidden responsibility | 后续闭口 |
|---|---|---|---|---|
| `contracts` | public refs、markers、request / response shell、view shell、event / job shell。 | 为 api/worker/jobs 提供 transport-neutral body-free surface。 | 不拥有 truth;不依赖 domain/application/infra/entry;不在 Step 5 写满 DTO schema。 | Step 8 闭口 protocol schema;Step 16 闭口 contract fixture。 |
| `domain` | truth object、value object、state、policy、guard、domain error。 | 为 application 提供可组合的领域规则和状态判断。 | 不读 config、repository、adapter;不保存 external body、runtime truth、process execution 或 identity member state。 | Step 6 闭口对象;Step 10 闭口状态;Step 12 闭口 domain error。 |
| `application` | command/query/consumer/job orchestration、port trait owner、UoW、idempotency、degraded / unavailable branch。 | 连接 domain policy 与 infra adapter,并定义一致性和重入口径。 | 不实现 adapter;不直接依赖 DB、bus、HTTP、scheduler;不绕过 domain policy。 | Step 7 闭口 ports;Step 9 闭口 flow;Step 13 闭口幂等。 |
| `infra` | port implementation、fake / durable store、external resolver、publisher、handoff adapter、runtime builder。 | 为 application 提供可替换 adapter 和运行时装配。 | 不反向决定业务 owner;不固定具体产品;不被 contracts/domain/application 反向依赖。 | Step 7 / Step 11 / Step 14 闭口 adapter、persistence、config。 |
| `api` | 同步 command/query entry assembly、handler boundary、error mapping。 | 将 transport-neutral request 转译给 application。 | 不直接调用 domain;不运行 worker/job;不实现 auth / gateway owner。 | Step 8 / Step 9 闭口 handler protocol 和处理流。 |
| `worker` | inbound event intake、event candidate publishing、background runner assembly。 | 承接外部摘要摄入和事件候选发布边界。 | 不恢复旧 outbox relay;不修 core truth;不与 api/jobs 互依。 | Step 8 / Step 9 / Step 13 闭口 event、dedup、retry。 |
| `jobs` | operations job execution、派生 material refresh、reference refresh、reconciliation、handoff report。 | 承接后台维护、收敛和 report boundary。 | 不创建或修复 core truth;不复制 external body;不与 api/worker 互依。 | Step 9 / Step 12 / Step 16 闭口 job flow、partial failure 和 test cut。 |

#### 5.5 八个业务组成部分横向映射

| 业务组成部分 | primary owner | supporting modules | entry / runner |
|---|---|---|---|
| 方法资产定义与目录 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate only |
| 正式化与版本 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` event candidate only |
| 受控消费 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` handoff / event candidate |
| 追溯与一致性保护 | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` |
| 关系与分发语义 | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` |
| 外部摘要与引用 | `domain` | `contracts`;`application`;`infra` | `api`;`worker` inbound / event |
| 后台维护与收敛 | `application` | `contracts`;`domain`;`infra` | `api`;`worker`;`jobs` |
| 外围包与方法集组织 | `domain` | `contracts`;`application`;`infra` | `api`;`worker`;`jobs` |

横向映射只用于 owner 校验,不得把八个业务组成部分机械拆成八个 crate。若后续 Step 6~16 发现某个业务组成部分缺对象、port、protocol、state、config 或 test owner,必须回到当前映射补齐归属,不得由实现侧自行补口。

#### 5.6 后续 Step owner 路由

| 后续内容 | primary owner | 闭口 Step |
|---|---|---|
| public refs / markers / request / result / view / event / job shell | `contracts` | Step 8;Step 16 |
| truth object / value object / state / policy / guard / domain error | `domain` | Step 6;Step 10;Step 12 |
| service / port trait / UnitOfWork / idempotency / application error | `application` | Step 7;Step 9;Step 12;Step 13 |
| repository / adapter / fake / runtime builder / config binding | `infra` | Step 7;Step 11;Step 14 |
| command / query handler | `api` | Step 8;Step 9 |
| inbound consumer / publisher runner | `worker` | Step 8;Step 9;Step 13 |
| operations job runner | `jobs` | Step 8;Step 9;Step 12;Step 16 |

#### 5.7 单模块展开模板

后续 Step 6~16 每个模块小节必须沿用同一展开模板:

| 小节项 | 写入内容 | 边界 |
|---|---|---|
| 模块身份 | implementation unit、Cargo package、Rust crate、主要文件组。 | 不重写 Step 4 文件树。 |
| 职责边界 | owner、supporting、forbidden responsibility。 | 不写对象字段。 |
| 对外暴露 | public external / internal library / orchestration / adapter / entry surface。 | 具体 DTO schema 后移 Step 8。 |
| 依赖边界 | allowed dependency、forbidden dependency、non-Cargo collaboration。 | 产品绑定后移 Step 14。 |
| 业务横轴映射 | 八组件在本模块中的承接方式。 | 不把业务组成部分改成 crate。 |
| 对象归属 | 对象类别 owner。 | 字段和值域后移 Step 6。 |
| port / adapter 归属 | trait / adapter owner。 | 方法签名后移 Step 7。 |
| protocol / handler 归属 | DTO / handler / runner owner。 | schema 和 flow 后移 Step 8 / Step 9。 |
| 测试切口预告 | 模块级测试责任。 | case id 和 assertion schema 后移 Step 16。 |

#### 5.8 模块测试切口预告

| 模块 | 测试切口预告 |
|---|---|
| `contracts` | DTO shell roundtrip、typed ref / marker fixture、body-free fixture、event / job shell fixture。 |
| `domain` | policy accept/reject、不变量、状态成立规则、forbidden transition、body-free guard。 |
| `application` | command/query/consumer/job orchestration、idempotency、UoW rollback、query no-write、degraded branch。 |
| `infra` | fake repository behavior、adapter unavailable mapping、runtime builder wiring、config binding validation。 |
| `api` | handler validation、metadata propagation、application/protocol error mapping。 |
| `worker` | inbound envelope validation、dedup、unsupported source/version、publisher runner boundary。 |
| `jobs` | job input validation、batch/page behavior、partial failure、stale/degraded output、handoff report boundary。 |

#### 5.9 进入 Step 6 前置条件

Step 5 完成只代表模块实现契约主轴稳定,不代表对象契约已经闭口。进入 Step 6 前必须先完成 R5.17 / R5.18 自检停审,并确认:

- 七个顶层模块均有明确 owner、supporting、forbidden responsibility。
- compile dependency 和 forbidden dependency 已闭口。
- 八个业务组成部分均能路由到模块 owner。
- 旧 Step 5 主线不会进入正式 §5。
- 后续 Step 6~16 的对象、port、protocol、flow、state、persistence、error、config、observability、test owner 均有入口。

### 3. R5.17 输入门禁

`R5.17` 只允许做 Step 5 自检与停审的“先思考”,不得继续扩写 §5 草稿,不得进入 Step 6。

| R5.17 可检查内容 | 检查目的 |
|---|---|
| R5.12 主轴结论与 R5.16 草稿一致性 | 确认草稿没有漏掉七模块、八组件和依赖边界。 |
| R5.14 禁入过滤是否生效 | 确认旧 13 模块、旧 P0/P1、`MethodContent`、snapshot、outbox、PostgreSQL 未作为正向主线回流。 |
| Step 6~16 owner 路由 | 确认对象、port、protocol、flow、state、persistence、error、config、observability、test 有明确归属入口。 |
| 正式文档修改范围 | 确认正式 `03-详细设计.md` 仍未在本模块修改。 |
| 停审条件 | 判断 R5.18 是否可以关闭 Step 5 并同步 flow / 台账到 Step 6 等待状态。 |

### 4. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 §5 回填草稿 | 是,仅写入本中间产物。 |
| 是否覆盖七个实现单元 | 是。 |
| 是否覆盖依赖边界和 forbidden dependency | 是。 |
| 是否覆盖八组件横向映射 | 是。 |
| 是否覆盖后续 Step owner 路由 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否写对象字段、trait 方法、DTO schema、flow、state matrix、persistence schema 或 case schema | 否。 |
| 是否进入 `R5.17` 思考或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.17 自检与停审:先思考`;只允许检查 R5.16 草稿与 R5.12 主轴结论、R5.14 禁入过滤、Step 6~16 owner 路由和正式文档未修改状态;不得继续扩写 §5 草稿,不得修改正式 `03-详细设计.md`,不得写 Step 6 对象字段、Step 7 trait 方法、Step 8 DTO schema、Step 9 flow、Step 10 state matrix、Step 11 persistence schema 或 Step 16 case schema,不得进入 `R5.18` 或 Step 6。

---

## R5.17 自检与停审:先思考

### 1. 思考记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R5.17 自检与停审:先思考`。 |
| 本模块目标 | 检查 R5.16 §5 草稿是否足以进入 R5.18 停审写入,并判断 Step 5 是否具备进入 Step 6 的条件。 |
| 当前边界 | 只做自检和停审判断,不继续扩写 §5 草稿。 |
| 本模块不做 | 不修改正式 `03-详细设计.md`;不新增模块主轴;不写对象字段、trait 方法、DTO schema、flow、state matrix、persistence schema 或 case schema;不进入 Step 6。 |

### 2. 自检范围

| 自检项 | 检查口径 |
|---|---|
| R5.12 与 R5.16 一致性 | R5.16 草稿必须只压缩 R5.12 主轴结论,不得新增未讨论的模块或依赖。 |
| 七模块完整性 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 均必须保留职责、暴露面和依赖边界。 |
| 八组件横向映射 | 当前 `02-概要设计.md` 的八个业务组成部分必须都能路由到 owner / supporting / entry。 |
| 依赖边界 | compile dependency、forbidden dependency、entry 互依禁令和 sibling repo 规则必须明确。 |
| 旧污染过滤 | 旧 13 模块、旧 6 crate、P0/P1、`MethodContent`、snapshot、outbox、PostgreSQL 不得作为正向主线回流。 |
| Step 6~16 owner 路由 | 对象、port、protocol、flow、state、persistence、error、config、observability、test 必须有入口。 |
| 正式文档状态 | 本 Step 仍不得修改正式 `03-详细设计.md`。 |

### 3. 自检判断表

| 检查项 | 当前判断 | 处理 |
|---|---|---|
| R5.16 是否覆盖七个实现单元 | 是。 | R5.18 可记录 pass。 |
| R5.16 是否保留八组件横向映射 | 是。 | R5.18 可记录 pass。 |
| R5.16 是否明确 compile dependency 和 forbidden dependency | 是。 | R5.18 可记录 pass。 |
| R5.16 是否有逐模块 owner / supporting / forbidden responsibility | 是。 | R5.18 可记录 pass。 |
| R5.16 是否给出 Step 6~16 owner 路由 | 是。 | R5.18 可记录 pass。 |
| R5.16 是否把旧 Step 5 内容重新作为正向主线 | 否。 | R5.18 可记录 pass。 |
| R5.16 是否误写对象字段 / trait 方法 / DTO schema / flow / state / persistence / case schema | 否。 | R5.18 可记录 pass。 |
| 正式 `03-详细设计.md` 是否被本模块修改 | 否。 | R5.18 继续保持不修改正式文档。 |

### 4. 仍需 R5.18 停审记录明确的事项

R5.17 的判断是“可进入 R5.18 停审写入”,不是直接进入 Step 6。R5.18 需要把下列事项固化为停审记录:

| 事项 | R5.18 写入要求 |
|---|---|
| Step 5 完成范围 | 明确 Step 5 只完成模块实现契约主轴、依赖边界和 owner 路由。 |
| Step 5 非完成范围 | 明确对象字段、port 方法、protocol schema、flow、state、persistence、error、config、observability、test 均后移。 |
| §5 草稿状态 | 明确 §5 回填草稿只存在于中间产物,正式 `03-详细设计.md` 后续统一装配。 |
| Step 6 进入条件 | 明确 Step 6 可开始逐模块定义对象实现契约,但不得继承旧 Step 6 completed 状态。 |
| 三层台账同步 | 将 Step 文件、flow、项目台账同步到 Step 5 completed / Step 6 wait_user_confirm。 |

### 5. R5.18 写入边界

`R5.18` 可以写入:

- Step 5 停审记录。
- Step 5 completed 判断。
- Step 6 输入门禁。
- flow / 项目台账的当前恢复点推进到 Step 6 等待确认。

`R5.18` 不得写入:

- 正式 `03-详细设计.md`。
- Step 6 对象字段和值对象结构。
- Step 7 trait / port 方法签名。
- Step 8 DTO schema。
- Step 9 函数级 flow。
- Step 10 state matrix。
- Step 11 persistence schema。
- Step 16 test case schema。

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 R5.16 草稿自检 | 是。 |
| 是否确认 R5.16 草稿可进入停审写入 | 是。 |
| 是否确认旧污染未回流 | 是。 |
| 是否确认 Step 6~16 owner 路由存在 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否继续扩写 §5 草稿 | 否。 |
| 是否进入 `R5.18` 写入或 Step 6 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.18 自检与停审:再写入`;只允许写入 Step 5 停审记录、completed 判断、Step 6 输入门禁,并同步 flow / 项目台账到 Step 6 等待确认;不得修改正式 `03-详细设计.md`,不得写 Step 6 对象字段、Step 7 trait 方法、Step 8 DTO schema、Step 9 flow、Step 10 state matrix、Step 11 persistence schema 或 Step 16 case schema,不得直接进入 Step 6 的首个写入模块。

---

## R5.18 自检与停审:再写入

Step 5 `定义模块实现契约主轴` 已完成本轮 full-restart 讨论。当前结论只作为后续 Step 6~16 的模块 owner、依赖边界和正式 §5 回填草稿来源,不直接修改正式 `03-详细设计.md`。

### 1. 停审记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 5 定义模块实现契约主轴 |
| 当前模块 | `R5.18 自检与停审:再写入` |
| 当前状态 | completed |
| 下一 Step | Step 6 逐模块定义对象实现契约 |
| 下一允许动作 | `R6.1 开工与必读文档:先思考` |
| 正式文档状态 | 未修改正式 `03-详细设计.md`;§5 草稿仅存在于本中间产物。 |
| 旧 Step 6 文件定位 | `03_ddd_step_06_object_contracts.md` 现有内容仍是 historical_material,不得继承其 completed 状态或旧 P0 / `MethodContent` / snapshot / outbox 口径。 |

### 2. Step 5 最终自检结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| `R5.1`~`R5.18` 是否完整 | pass | Step 5 已覆盖开工、框架对齐、候选池、业务映射、依赖矩阵、主轴裁决、历史审计、回填草稿、自检和停审。 |
| 顶层模块主轴是否闭口 | pass | 固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现单元。 |
| crate dependency matrix 是否闭口 | pass | `contracts -> core-contracts`;`domain -> contracts`;`application -> contracts/domain`;`infra -> contracts/domain/application`;`api/worker/jobs -> contracts/application/infra`。 |
| forbidden dependency 是否闭口 | pass | 禁止 library crate 依赖 entry、application/domain 依赖 infra、entry 直接依赖 domain、entry 互依、非 `core-contracts` sibling Cargo dependency。 |
| 八组件横向映射是否闭口 | pass | 当前 `02-概要设计.md` 的八个业务组成部分均已映射到 primary owner、supporting modules 和 entry / runner。 |
| 后续 Step owner 路由是否存在 | pass | 对象、port、protocol、flow、state、persistence、error、config、observability、test 均有模块入口。 |
| 旧 Step 5 污染是否关闭 | pass | 旧 13 模块、旧 6 crate、P0/P1、`MethodContent`、snapshot、outbox、PostgreSQL 不作为当前正向主线。 |
| 是否保护正式 `03-详细设计.md` | pass | 本 Step 全部写入停在 `design-calibration` 中间产物。 |

### 3. Step 5 完成范围与非范围

| 类别 | 已完成 | 未完成 / 后移 |
|---|---|---|
| 模块主轴 | 七个实现单元、模块职责、暴露面、依赖边界、业务横轴映射、owner 路由。 | 不再新增 crate 或模块主轴。 |
| 依赖边界 | compile dependency、forbidden dependency、entry 互依禁令、sibling repo 规则。 | 产品级 DB / bus / HTTP / scheduler 绑定后移 Step 11 / Step 14。 |
| §5 草稿 | 已在 R5.16 写入可装配的正式 §5 中间草稿。 | 正式 `03-详细设计.md` 后续由对应装配模块或 Step 19 统一回填。 |
| 对象契约 | 仅给对象类别 owner。 | 对象字段、值域、工厂、不变量、状态后移 Step 6 / Step 10。 |
| port / protocol / flow | 仅给 owner 入口。 | trait 方法、DTO schema、handler flow、job flow 后移 Step 7~9。 |
| test | 仅给模块级测试切口预告。 | case id、assertion schema、evidence schema 后移 Step 16。 |

### 4. Step 6 进入条件

Step 6 可以在用户确认后启动,但必须遵守:

| 进入项 | Step 6 可做 | Step 6 不得做 |
|---|---|---|
| 必读恢复 | 先读项目台账、03 flow、Step 1~5 当前中间产物、正式 `00/01/02` 和规范。 | 根据旧 Step 6 completed 状态直接续写。 |
| 对象主轴 | 基于 Step 5 七模块主轴和八组件横向映射,逐模块定义对象实现契约。 | 恢复旧 P0 `MethodContent` 对象族或旧对象卡片作为当前正向结论。 |
| 对象深度 | 定义对象身份、字段、值域、工厂、行为、不变量、禁止事项、owner 和后续 port / protocol 承接。 | 写 trait / port 方法签名、DTO schema、函数级 flow、persistence schema 或 test case schema。 |
| 历史材料处理 | 旧 Step 6 只能作 historical_material 和污染审计输入。 | 继承旧 Step 6 的 `[x] 已确认`、旧 13 模块、snapshot / outbox / PostgreSQL 主线。 |
| 后续分工 | 为 Step 7~16 保留 port、protocol、flow、state、persistence、error、config、observability、test 的独立闭口空间。 | 在 Step 6 一次性生成后续所有接口、流程和状态矩阵。 |

### 5. 三层状态同步要求

| 文件 | 同步要求 |
|---|---|
| `project_execution_ledger.md` | 当前恢复点推进到 Step 6 `R6.1 开工与必读文档:先思考` 等待确认。 |
| `03_ddd_calibration_flow.md` | Step 5 标记 completed;Step 6 标记 wait_user_confirm_to_R6.1。 |
| `03_ddd_step_05_module_contracts.md` | 当前文件标记 completed,并保留本停审记录。 |

### 6. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 5 停审记录 | pass |
| 是否同步 flow / 台账到 Step 6 等待状态 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 6 正文 | pass |
| 是否明确旧 Step 6 文件仍为 historical_material | pass |

next_allowed_action: 等待用户确认后进入 `03-详细设计` Step 6 `R6.1 开工与必读文档:先思考`;只允许思考 Step 6 必读文档、输入边界、对象家族整体框架和模块顺序;不得直接修改正式 `03-详细设计.md`;不得继承旧 Step 6 completed 状态;不得进入 `R6.2`、Step 7 或后续 Step。
