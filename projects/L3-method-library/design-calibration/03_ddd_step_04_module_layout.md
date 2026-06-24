# Step 4. 收稳实现单元与文件布局

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
> 回填章节: `projects/L3-method-library/03-详细设计.md` §4 实现单元与文件布局
> 创建日期: 2026-06-22
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: `R4.18 自检与停审:再写入`
> 当前门禁: Step 4 completed;等待用户确认进入 Step 5 `R5.1 开工与必读文档:先思考`

---

## R4.1 开工与必读文档:先思考

### 1. 本模块要回答的问题

Step 4 不是续写旧 `03_ddd_step_04_module_layout.md`。旧文件虽然标记为 `[x] 已确认`,但它围绕旧 P0 / `MethodContent` / publish / snapshot / fingerprint / outbox / PostgreSQL / L0-bus / gateway 目录树展开,与当前 `00/01/02`、Step 2 范围和 Step 3 约束冲突。

本模块只回答以下问题:

| 问题 | 本轮判断 |
|---|---|
| Step 4 的工作对象是什么? | 把当前 `02-概要设计.md` 的代码主体框架和 Step 3 约束落到目标实现仓、workspace、crate / package、module 和文件路径。 |
| Step 4 是否可以继承旧文件布局? | 不可以。旧 `method_library_domain`、`MethodContent`、snapshot、outbox relay 等布局只作 historical material 和污染样本。 |
| Step 4 是否修改正式 `03-详细设计.md`? | 当前不修改。正式 §4 只在回填草稿确认后或 Step 19 装配。 |
| Step 4 是否定义对象字段、trait 方法、DTO schema 或持久化表? | 不定义。Step 4 只定义实现单元、目录 / package / crate / binary 映射、文件布局树、文件职责和命名检查。 |
| Step 4 完成后应支持什么? | 实现者能创建目标仓目录和文件,并知道每个文件属于哪个模块;Step 5 可以据此定义模块实现契约主轴。 |

### 2. 必读文档

#### 2.1 流程与规范

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点、当前 Step 和下一动作。 | 只作为恢复门禁。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 确认 Step 3 已关闭、Step 4 当前门禁和旧材料处理口径。 | 作为文档级 flow 真相源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | 承接输入权威顺序和历史材料隔离规则。 | 不重新讨论上游边界。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | 承接本轮 03 范围、非范围和展开深度。 | 不扩大本轮范围。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md` | 承接语言、runtime、跨仓依赖、安全、旧 Step 3 差异审计和缺口暂停规则。 | 作为 Step 4 第一前序输入。 |
| `standards/document/详细设计讨论流程_SOP.md` | 确认 Step 4 的目标、输入、输出、问题和进入 Step 5 条件。 | 采用流程规则。 |
| `standards/document/详细设计书写规范.md` | 确认 §4 必须输出布局形态决策表、实现单元总表、目录 / package / crate / binary 映射表、文件布局树和文件职责表。 | 作为正式 §4 草稿格式约束。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 确认实现仓、workspace member、Cargo package、Rust crate、binary 和文件命名规则。 | 作为命名与目录规则真相源。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认三层台账、单模块推进、先思考后写入和单批写入规模。 | 作为本文件写入门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认布局若暴露 schema / port / DTO / mapper / config / evidence 缺口时必须暂停闭口。 | 作为可落码红线。 |

#### 2.2 本仓正式输入

| 文档 | 读取目的 | Step 4 关注点 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 复核仓定位、依赖类型、数据归属、非目标和验收红线。 | 不把运行期依赖或外部正文写成本仓文件。 |
| `projects/L3-method-library/01-架构设计.md` | 复核职责边界、依赖方向、系统上下文、数据所有权和通信方式。 | 文件布局必须体现依赖方向和数据 owner。 |
| `projects/L3-method-library/02-概要设计.md` | 复核代码主体框架、实现分层、八个主要组成部分和详细设计承接清单。 | Step 4 的直接业务和分层来源。 |

#### 2.3 概要设计承接中间产物

| 中间产物 | 读取目的 | Step 4 关注点 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 理解代码主体框架和实现分层视图来源。 | 判断业务组成部分如何安放到实现分层,但不复制为目录树。 |
| `02_hld_step_05_components_boundary.md` | 理解八个主要组成部分的职责边界和后续展开线索。 | 防止把业务组成部分误拆成 crate。 |
| `02_hld_step_12_detailed_design_handoff.md` | 读取 03 承接清单和回退规则。 | 确认 Step 4 继续展开 crate / module / service / port / adapter,但不改写业务主语。 |
| `02_hld_step_13_risks_open_questions.md` | 读取风险和待确认事项。 | 判断布局待确认是否阻塞 Step 5。 |
| `02_hld_step_14_formal_document_assembly.md` | 确认正式 02 已装配完成。 | 防止旧概要或旧 03 回流。 |

#### 2.4 框架参考与历史材料

| 材料 | 当前定位 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md` | framework_reference | 只参考 Step 4 的结构、深度、表格种类、命名检查和进入下一步条件。 |
| 旧 `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` | historical_material | 旧 completed 状态失效;只作差异审计和污染样本。 |
| 旧 `projects/L3-method-library/03-详细设计.md` §4 或旧目录树 | historical_material | 只作后置差异审计,不得作为当前布局来源。 |

### 3. 当前输入边界初判

| 输入类别 | 当前判断 | Step 4 影响 |
|---|---|---|
| Step 2 范围 | 已确认本轮 03 按 core / support / operation / peripheral / cross-cutting 分层展开,不恢复旧 P0 / P1 主线。 | 文件布局不能以旧 P0 / P1 或旧七类 definition 建 crate。 |
| Step 3 约束 | 已确认不提前锁定具体 HTTP / RPC / database / queue / scheduler / worker / cache / object storage 产品。 | Step 4 可以有 `api`、`worker`、`infra` 等 role,但不得把具体产品写成固定文件树。 |
| 代码主体框架 | 正式 02 §4 给出代码主体和实现分层,但明确不是目录树、crate 或部署拓扑。 | Step 4 需要把实现分层转成 workspace / crate / module layout。 |
| 八个主要组成部分 | 正式 02 §5 是业务职责主线,不是 Rust crate 边界。 | Step 4 应以实现 role 建单元,业务组成部分留给 Step 5 映射。 |
| 跨仓依赖 | 仅 `L0-core` / `core-contracts` 是 compile dependency candidate;`L0-bus` 是 event collaboration;process / identity / runtime / member-images 是 runtime consumption。 | Step 4 必须写清 Cargo path dependency 只允许进入 compile 依赖位置,运行期 / event 关系不得写 Cargo dependency。 |
| 安全边界 | 本仓不实现 auth / gateway,不保存外部正文和下游运行 truth。 | Step 4 不创建 auth / gateway / credential / external body storage 主体模块。 |

### 4. Step 4 需要形成的输出池

| 输出 | 内容要求 | 不在本模块完成 |
|---|---|---|
| 布局形态决策表 | 单 crate 模块分层 vs workspace 多 crate 的采用 / 不采用理由。 | `R4.1` 只列计划,不裁决最终布局。 |
| 实现单元总表 | 实现单元、类型、职责、对应概要章节。 | 具体表项在后续裁决模块写入。 |
| 目录 / package / crate / binary 映射表 | member 目录、Cargo package、Rust crate / binary、职责、是否对外暴露。 | 需要核对目标仓和命名规则后写入。 |
| 文件布局树 | 可被实现者直接创建的目录和文件树,且每个文件标注职责。 | 不在 `R4.1` 一次性生成。 |
| 文件职责表 | 文件路径、所属模块、定义内容、主要责任。 | 留给布局裁决后的写入模块。 |
| 命名检查表 | project slug、member 目录、Cargo package、crate、binary、禁止 L0 / L1 泄漏。 | 后续裁决后检查。 |
| 编译期依赖落点 | `core-contracts` path dependency 应落在哪个 `Cargo.toml`,运行期 / event 依赖如何排除。 | 不能凭空假设未核对的目标仓布局。 |
| 历史 Step 4 差异审计 | 旧 `MethodContent`、旧 `method_library_*`、snapshot、outbox、PostgreSQL、gateway 等目录处理。 | 后置到 `R4.13`~`R4.14`。 |

### 5. Step 4 模块顺序草案

| 顺序 | 模块 | 产物 | 门禁 |
|---:|---|---|---|
| R4.1 | 开工与必读文档:先思考 | 本节 | 只列问题、必读文档、输入边界、输出池和模块顺序。 |
| R4.2 | 开工与必读文档:再写入 | 开工记录、读取状态、Step 内计划、输入基线、旧材料规则 | 不写最终布局。 |
| R4.3 | L1-governance 框架对齐:先思考 | 可借鉴框架和不得借鉴内容 | 只抽结构,不复制 governance 语义。 |
| R4.4 | L1-governance 框架对齐:再写入 | Step 4 框架对齐记录 | 固定本仓 Step 4 输出结构。 |
| R4.5 | 目标实现仓与命名规范核对:先思考 | 目标仓路径、project slug、Cargo / crate 命名核对草案 | 不写最终表。 |
| R4.6 | 目标实现仓与命名规范核对:再写入 | 目标仓、slug、member / package / crate / binary 命名规则记录 | 固定布局裁决输入。 |
| R4.7 | 布局形态裁决:先思考 | 单 crate vs workspace 多 crate 草案 | 不写目录树。 |
| R4.8 | 布局形态裁决:再写入 | 布局形态决策表和采用理由 | 形成 §4 主体结论之一。 |
| R4.9 | 实现单元与依赖落点:先思考 | 实现单元、Cargo dependency 落点和运行期 / event 排除草案 | 不写完整文件树。 |
| R4.10 | 实现单元与依赖落点:再写入 | 实现单元总表、目录 / package / crate / binary 映射表、依赖落点表 | 形成 §4 主体结论之一。 |
| R4.11 | 文件布局树与职责:先思考 | 文件布局树草案、文件职责分批策略 | 不写最终树。 |
| R4.12 | 文件布局树与职责:再写入 | 文件布局树、文件职责表、命名检查表 | 形成 §4 主体结论之一。 |
| R4.13 | 历史 Step 4 差异审计:先思考 | 旧文件布局污染扫描计划 | 只审计,不反推当前结论。 |
| R4.14 | 历史 Step 4 差异审计:再写入 | 旧内容禁入 / 后移 / 重定义表 | 关闭旧 Step 4 completed 污染。 |
| R4.15 | 回填草稿:先思考 | 正式 §4 回填策略 | 不修改正式 03。 |
| R4.16 | 回填草稿:再写入 | §4 回填草稿 | 仅写中间产物。 |
| R4.17 | 自检与停审:先思考 | Step 4 自检清单 | 判断是否可进入 Step 5。 |
| R4.18 | 自检与停审:再写入 | Step 4 停审记录 | 关闭 Step 4,同步 flow / 台账到 Step 5 等待状态。 |

### 6. 下一写入边界

下一步只允许进入:

```text
R4.2 开工与必读文档:再写入
```

`R4.2` 应写入:

- Step 4 开工记录。
- 必读文档读取状态表。
- Step 内计划确认表。
- 当前输入基线。
- 旧 Step 4 历史材料处理规则。
- 下一模块 `R4.3 L1-governance 框架对齐:先思考` 的门禁。

`R4.2` 不得写入:

- 最终布局形态裁决。
- 实现单元总表最终项。
- 目录 / package / crate / binary 映射表最终项。
- 文件布局树最终项。
- 文件职责表最终项。
- 正式 `03-详细设计.md` 正文。
- Step 5 模块实现契约主轴。

### 7. 自检

| 检查项 | 结果 |
|---|---|
| 是否只进入 Step 4 第一个模块? | 是。 |
| 是否把旧 Step 4 降级为 historical material? | 是。 |
| 是否未继承旧 P0 / `MethodContent` / snapshot / outbox 文件布局? | 是。 |
| 是否列出 Step 4 必读文档? | 是。 |
| 是否给出 Step 4 模块顺序? | 是。 |
| 是否未修改正式 `03-详细设计.md`? | 是。 |
| 是否未进入 `R4.2` 或 Step 5? | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.2 开工与必读文档:再写入`;只允许写入 Step 4 开工记录、读取状态、Step 内计划、输入基线和旧材料规则,不得直接修改正式 `03-详细设计.md`,不得写最终文件布局,不得进入 `R4.3` 或 Step 5。

---

## R4.2 开工与必读文档:再写入

### 1. 开工记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.2 开工与必读文档:再写入` |
| 上一模块 | `R4.1 开工与必读文档:先思考` |
| 用户确认 | 已确认进入 `R4.2` |
| 本模块允许写入 | 开工记录、读取状态表、Step 内计划、输入基线、旧材料处理规则和下一门禁 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、最终布局形态裁决、实现单元总表最终项、目录 / package / crate / binary 映射表最终项、文件布局树最终项、Step 5 模块主轴 |
| 下一模块 | `R4.3 L1-governance 框架对齐:先思考` |

本模块确认 Step 4 已正式进入 full-restart 中间产物写入阶段。当前仍处于开工阶段,不继承旧 Step 4 `[x] 已确认` 状态,不恢复旧 P0 / `MethodContent` / snapshot / outbox 目录树,不修改正式 `03-详细设计.md`。

### 2. 必读文档读取状态表

#### 2.1 已完成读取

| 文档 | 状态 | 本模块使用结论 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | read | 项目级恢复点允许进入 Step 4 `R4.2`,且禁止跳过当前模块。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | read | 文档级 flow 已停在 Step 4 / `R4.2`;Step 3 completed,Step 4 in_progress。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | read | 输入权威顺序和旧材料隔离规则仍适用。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | read | 本轮 03 范围按当前八组件与 core / support / operation / peripheral / cross-cutting 分层展开。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md` | read | Step 4 必须继承语言、runtime、跨仓依赖、安全边界和缺口回设计规则。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md#R4.1` | read | `R4.1` 已固定 Step 4 必读文档、输入边界、输出池和模块顺序。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | Step 4 必须把概要代码主体骨架落到实际仓库、crate、模块和文件路径。 |
| `standards/document/详细设计书写规范.md` | read | §4 必须输出布局形态决策表、实现单元总表、目录 / package / crate / binary 映射表、文件布局树和文件职责表。 |
| `standards/document/子项目目录与代码文件组织规范.md` | read | workspace member 应使用 `crates/<role>`,Cargo package 使用 `<project>-<role>`,Rust crate 使用 `<project>_<role>`,不得泄漏 L0 / L1 层级。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 当前必须按模块级先思考后写入,单次写入批次不等于最终文件长度上限。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 发现 schema / port / DTO / mapper / config / evidence schema 缺口时必须暂停并回设计闭口。 |
| `projects/L3-method-library/00-需求文档.md` | read | 本仓不得保存外部正文或下游运行 truth,运行期依赖不得写成源码依赖。 |
| `projects/L3-method-library/01-架构设计.md` | read | 文件布局需要体现职责边界、依赖方向、数据所有权和相邻仓协作方式。 |
| `projects/L3-method-library/02-概要设计.md` | read | 正式 §4 代码主体框架和 §5 八个主要组成部分是 Step 4 的直接输入,但 §4 不是目录树。 |
| `02_hld_step_04_code_subject_framework.md` | read | 提供代码主体框架和实现分层视图来源,不得直接复制为文件布局。 |
| `02_hld_step_05_components_boundary.md` | read | 八个主要组成部分是业务职责主线,不得误拆成业务 crate。 |
| `02_hld_step_12_detailed_design_handoff.md` | read | Step 4 继续展开 crate / module / service / port / adapter 的正式分层边界。 |
| `02_hld_step_13_risks_open_questions.md` | read | 布局待确认若影响落码,必须进入后续风险或待确认事项。 |
| `02_hld_step_14_formal_document_assembly.md` | read | 正式 02 已完成装配,旧材料不得回流。 |

#### 2.2 后续模块到达时继续读取

| 文档 / 材料 | 读取时机 | 用途 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md` | `R4.3` / `R4.4` | 抽取可借鉴框架、表格深度、命名检查和进入下一步条件。 |
| `/home/aris/Projects/quantalithos-method-library` 目标实现仓 | `R4.5` / `R4.6` | 核对实际 workspace、package、crate、binary 和现有文件,只作为本地验证。 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | `R4.5` / `R4.10` | 核对 `core-contracts` path dependency 的真实 crate 路径和落点。 |
| 旧 Step 4 文件历史内容 | `R4.13` / `R4.14` | 审计旧 P0、`MethodContent`、snapshot、outbox、PostgreSQL、gateway 等布局污染。 |
| 旧正式 `03-详细设计.md` §4 / 目录树 | `R4.13` / `R4.14` | 历史正文差异审计,不得作为当前布局来源。 |

### 3. Step 内计划确认表

| 顺序 | 模块 | 状态 | 完成门禁 |
|---:|---|---|---|
| R4.1 | 开工与必读文档:先思考 | completed | 已列出问题、必读文档、输入边界、输出池和模块顺序。 |
| R4.2 | 开工与必读文档:再写入 | completed | 已记录开工、读取状态、Step 内计划、输入基线和旧材料规则。 |
| R4.3 | L1-governance 框架对齐:先思考 | completed | 已分析可借鉴框架和不得借鉴内容,未写本仓最终文件布局。 |
| R4.4 | L1-governance 框架对齐:再写入 | completed | 已固化本仓 Step 4 框架对齐记录和后续输出模板。 |
| R4.5 | 目标实现仓与命名规范核对:先思考 | completed | 已形成目标仓路径、project slug、Cargo / crate / binary 命名核对草案。 |
| R4.6 | 目标实现仓与命名规范核对:再写入 | completed | 已写入目标仓、slug、member / package / crate / binary 命名规则记录。 |
| R4.7 | 布局形态裁决:先思考 | completed | 已形成单 crate、workspace 多 crate、业务组成部分拆 crate、单独 config / observability crate 等候选布局草案。 |
| R4.8 | 布局形态裁决:再写入 | completed | 已写入布局形态决策表和采用 / 不采用理由。 |
| R4.9 | 实现单元与依赖落点:先思考 | completed | 已形成实现单元、Cargo dependency 落点和运行期 / event 排除草案。 |
| R4.10 | 实现单元与依赖落点:再写入 | completed | 已写入实现单元总表、目录 / package / crate / binary 映射表、依赖落点表和非 Cargo 依赖排除表。 |
| R4.11 | 文件布局树与职责:先思考 | completed | 已形成文件布局树草案、文件职责分批策略、命名检查策略和 `R4.12` 写入顺序。 |
| R4.12 | 文件布局树与职责:再写入 | completed | 已写入文件布局树、文件职责表、命名检查表、禁入检查表和 Step 5 进入条件。 |
| R4.13 | 历史 Step 4 差异审计:先思考 | completed | 已形成旧文件布局污染扫描计划、扫描对象清单、污染类别、判断规则和 `R4.14` 写入模板。 |
| R4.14 | 历史 Step 4 差异审计:再写入 | completed | 已写入旧内容禁入 / 后移 / 重定义审计表和当前布局保护表。 |
| R4.15 | 回填草稿:先思考 | completed | 已形成正式 §4 回填策略、回填结构、压缩策略、不回填项和 `R4.16` 写入顺序。 |
| R4.16 | 回填草稿:再写入 | completed | 已写入 §4 中间产物草稿。 |
| R4.17 | 自检与停审:先思考 | completed | 已形成 Step 4 自检清单和 `R4.18` 停审写入策略。 |
| R4.18 | 自检与停审:再写入 | completed | 已关闭 Step 4,同步 flow / 台账到 Step 5 等待状态。 |

### 4. 输入基线与旧材料规则

| 输入 / 材料 | 当前处理 |
|---|---|
| 正式 `00/01/02` | Step 4 的正向输入。 |
| Step 1 / Step 2 / Step 3 中间产物 | Step 4 的前置约束。 |
| 旧 Step 4 `[x] 已确认` 状态 | invalid_status,不得作为当前 Step 4 完成依据。 |
| 旧 `method_library_domain` / `method_library_contracts` 等目录 | historical_material,需要在后置差异审计中判定是否禁入、重命名或重定义。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线 | historical_pollution_candidate,不得正向进入当前布局。 |
| 旧 PostgreSQL / L0-bus / gateway 文件树 | historical_pollution_candidate,不得在 Step 4 固定具体产品或 auth / gateway 实现。 |

### 5. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写入 `R4.2` 允许内容 | pass |
| 是否未写最终布局形态裁决 | pass |
| 是否未写最终目录 / package / crate / binary 映射表 | pass |
| 是否未写最终文件布局树 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.3` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.3 L1-governance 框架对齐:先思考`;只允许分析 L1-governance Step 4 的可借鉴框架和不得借鉴内容,不得直接修改正式 `03-详细设计.md`,不得写本仓最终文件布局,不得进入 `R4.4` 或 Step 5。

---

## R4.3 L1-governance 框架对齐:先思考

### 1. 本模块要回答的问题

本模块只分析 `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md` 的 Step 4 组织框架,不复制 governance 的领域语义、crate 数量、文件名或运行入口。

| 问题 | 判断 |
|---|---|
| L1-governance Step 4 哪些结构可复用? | 可复用“问题回答、当前文档问题诊断、改动前后对比、设计取舍、结构化中间产物、待确认事项、进入下一步条件”的组织顺序。 |
| 哪些内容不能复制? | 不能复制 `governance` slug、七 crate 固定结论、GRC / outbox / archive / trace handoff / governance truth object 等领域专有内容。 |
| 对 L3-method-library Step 4 的价值是什么? | 提供足够细的表格深度和进入 Step 5 的门禁表达,避免 Step 4 只停留在抽象模块名。 |
| 当前是否直接写本仓最终布局? | 不写。最终布局形态、实现单元、依赖落点和文件树留给 `R4.7`~`R4.12`。 |
| 当前是否修改正式 `03-详细设计.md`? | 不修改。正式回填只在 `R4.15`~`R4.16` 或 Step 19 装配。 |

### 2. 可借鉴框架

#### 2.1 问题回答框架

L1-governance Step 4 在正式结论前先回答 SOP 问题,这点适合 L3-method-library 复用。后续 `R4.4` 应固定一组本仓 Step 4 必答问题:

| 问题类别 | L3-method-library 后续需要回答的内容 | 后续模块 |
|---|---|---|
| 实现单元 | 本轮是否采用单 crate、workspace 多 crate,以及每个实现单元的职责。 | `R4.7`~`R4.10` |
| 概要映射 | 当前 `02` 的 core / support / operation / peripheral / cross-cutting 与八个组成部分如何落到实现单元。 | `R4.9`~`R4.10` |
| 路径组织 | 目标实现仓、workspace member、Cargo package、Rust crate、binary 和文件路径如何命名。 | `R4.5`~`R4.12` |
| 文件职责 | 每个文件只负责承载什么对象、service、port、adapter 或 test support,不提前写字段和方法。 | `R4.11`~`R4.12` |
| 命名红线 | `L3`、`method_library`、`quantalithos_l3`、旧 P0 / P1 和旧 `MethodContent` 是否泄漏进代码命名。 | `R4.5`~`R4.14` |
| 依赖落点 | `core-contracts` 如何作为唯一 compile dependency candidate;运行期 / event 依赖如何排除 Cargo dependency。 | `R4.9`~`R4.10` |

#### 2.2 诊断和取舍框架

L1-governance 不是直接列文件树,而是先给出“当前文档问题诊断”和“设计取舍”。这个框架应保留,因为 L3-method-library 旧 Step 4 有明显历史污染。

| 可复用结构 | 在 L3-method-library 的用途 |
|---|---|
| 当前文档问题诊断 | 说明旧 Step 4 为什么不能继承,包括旧 P0、`MethodContent`、snapshot、outbox、PostgreSQL、gateway 等污染。 |
| 改动前后对比 | 对比旧布局心智与本轮当前 `00/01/02` 推导出的布局心智,避免 agent 误以为只是补几张表。 |
| 设计取舍表 | 在单 crate、workspace 多 crate、按业务组成部分拆 crate、单独 config / observability crate 等候选之间做裁决。 |
| 待确认事项 | 记录目标实现仓存在性、真实 Cargo workspace、path dependency 路径等实施前门禁,但不阻塞当前 Step 4 讨论。 |

#### 2.3 结构化中间产物框架

L1-governance 的结构化中间产物深度适合复用,但 L3-method-library 需要用本仓主语重新生成。

| 中间产物类型 | 是否复用结构 | L3-method-library 后续写入要求 |
|---|---|---|
| 布局形态决策表 | 是 | 必须解释采用 / 不采用的理由,不能只给一个结论。 |
| 实现单元总表 | 是 | 实现单元按工程边界和依赖方向组织,不是简单把八个业务组成部分各拆一个 crate。 |
| 目录 / Package / Crate / Binary 映射表 | 是 | 必须核对 project slug、Cargo package、Rust crate、binary 名和是否对外暴露。 |
| 文件布局树 | 是 | 必须能被实现者直接创建,但不得提前写对象字段、trait 方法或 DTO schema。 |
| 文件职责表 | 是 | 文件路径、所属模块、定义内容、主要责任需要逐项对应,防止 `utils.rs` / `helper.rs` 式模糊文件。 |
| 命名检查表 | 是 | 必须检查架构层级泄漏、旧主线泄漏、外部仓泄漏和模糊命名。 |
| 依赖方向预告 | 是 | Step 4 只预告 compile dependency placement;正式 crate dependency matrix 留给 Step 5。 |
| 编译期依赖落点表 | 是 | 只允许把 `core-contracts` 作为 compile dependency candidate 写入落点;其他相邻仓必须留在 port / adapter / event / runtime 表达。 |

### 3. 不得借鉴内容

| L1-governance 内容 | 不得借鉴原因 | L3-method-library 处理 |
|---|---|---|
| `governance` project slug 与 `governance-*` package | 属于 governance 实现仓命名。 | 需要在 `R4.5`~`R4.6` 核对本仓 slug 和命名。 |
| 七个 crate 固定结论 | governance 有自身 public contracts、多入口、operations jobs 和 handoff 场景。 | L3 是否也需要相同 crate 数量必须重新裁决。 |
| Governance truth object 文件名 | 领域对象完全不同。 | 只能参考“按领域主语命名文件”的原则。 |
| external GRC、archive handoff、outbox relay 等文件 | 属于 governance 特定协作面。 | L3 不得恢复旧 outbox / delivery 主线;如有 event collaboration,后续按当前 `02` 重新定义。 |
| PostgreSQL / durable store 暗示 | Step 3 已禁止提前锁定具体 database 产品。 | Step 4 只允许写 repository / store role,不写具体产品绑定。 |
| API / worker / jobs 入口数量 | governance 的入口切口不能自动套用。 | L3 入口必须从当前 `02` 的 API / 接口骨架和处理流推导。 |

### 4. 对后续 R4.4 的写入策略

`R4.4` 应把本模块的思考转换为“框架对齐记录”,但仍不产生最终 L3-method-library 布局。建议写入以下内容:

| 写入块 | 内容边界 |
|---|---|
| 框架采用记录 | 明确采用 governance 的 Step 4 组织方式:问题回答、诊断、取舍、结构化产物、门禁。 |
| 框架裁剪记录 | 明确不复制 governance 的领域对象、crate 数量、文件名和协作面。 |
| L3 Step 4 输出模板 | 固定后续必须产出的表格清单和最小字段。 |
| 后续模块承接 | 指向 `R4.5` 命名核对、`R4.7` 布局裁决、`R4.9` 实现单元与依赖落点、`R4.11` 文件树与职责。 |
| 当前门禁 | 仍禁止修改正式 `03-详细设计.md`,禁止写最终布局,禁止进入 Step 5。 |

### 5. 自检

| 检查项 | 结果 |
|---|---|
| 是否只分析 L1-governance 框架? | 是。 |
| 是否未复制 governance 领域语义? | 是。 |
| 是否未写 L3-method-library 最终文件布局? | 是。 |
| 是否未裁决单 crate / workspace 多 crate? | 是。 |
| 是否未修改正式 `03-详细设计.md`? | 是。 |
| 是否未进入 `R4.4` 正文或 Step 5? | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.4 L1-governance 框架对齐:再写入`;只允许写入 Step 4 框架对齐记录和后续输出模板,不得直接修改正式 `03-详细设计.md`,不得写本仓最终文件布局,不得进入 `R4.5` 或 Step 5。

---

## R4.4 L1-governance 框架对齐:再写入

### 1. 框架采用记录

本模块确认 L3-method-library Step 4 采用 L1-governance Step 4 的组织框架,但只采用框架深度和门禁表达,不继承 governance 的领域结论。

| 采用项 | 采用方式 | 后续落点 |
|---|---|---|
| SOP 问题回答 | 先回答 crate / package / binary / library、概要映射、路径组织、文件职责、命名和依赖落点问题。 | `R4.5`~`R4.12` |
| 当前文档问题诊断 | 在最终 Step 4 中明确旧布局污染与当前输入缺口。 | `R4.13`~`R4.14` |
| 改动前后对比 | 对比旧 P0 / `MethodContent` 布局与当前 full-restart 布局心智。 | `R4.13`~`R4.16` |
| 设计取舍表 | 对单 crate、workspace 多 crate、按业务组成部分拆 crate、单独 config / observability crate 做显式裁决。 | `R4.7`~`R4.8` |
| 结构化中间产物 | 使用布局形态、实现单元、目录映射、文件树、文件职责、命名检查、依赖落点等表格。 | `R4.8`~`R4.12` |
| 待确认事项 | 把不阻塞 Step 5 但影响实施前置检查的事项列入风险或后续门禁。 | `R4.15`~`R4.18` |
| 进入下一步条件 | 明确 Step 5 只能在布局、实现单元、依赖方向和命名检查闭口后进入。 | `R4.17`~`R4.18` |

### 2. 框架裁剪记录

| 裁剪项 | 处理口径 | 原因 |
|---|---|---|
| governance 七 crate 固定结论 | 不复制。 | L3-method-library 的入口、job、worker 和 public contract 边界需要从当前 `00/01/02` 推导。 |
| governance 文件名和领域对象 | 不复制。 | `GovernanceContext`、`Gate`、`Decision`、GRC、archive handoff 等不是本仓领域主语。 |
| governance outbox / handoff 布局 | 不复制。 | 本仓旧材料已有 outbox / delivery 污染,必须等当前接口和事件协作重新闭口后才能决定。 |
| governance 目标实现仓路径 | 不复制。 | 本仓需要在 `R4.5` 核对 `/home/aris/Projects/quantalithos-method-library` 和实际 workspace。 |
| governance `core-contracts` 落点结论 | 只参考格式,不直接复制落点。 | L3 只确认 `core-contracts` 是 compile dependency candidate,具体 member 引用需本仓裁决。 |
| governance API / worker / jobs 入口 | 不复制。 | 本仓入口数量必须由当前 `02` 的接口骨架、处理流和 Step 3 runtime 约束决定。 |

### 3. L3-method-library Step 4 输出模板

后续模块必须按以下模板补齐 Step 4,不得用单张总表替代。

| 输出块 | 最小字段 | 生成模块 | 禁止事项 |
|---|---|---|---|
| SOP 问题回答 | 问题、回答、依据、后续承接 | `R4.5`~`R4.12` 汇总 | 不得提前定义对象字段或 trait 方法。 |
| 当前文档问题诊断 | 位置、当前问题、本步处理 | `R4.13`~`R4.14` | 不得把旧内容反推为当前结论。 |
| 改动前后对比 | 项、改动前、改动后、原因 | `R4.13`~`R4.16` | 不得用“历史已确认”作为原因。 |
| 设计取舍表 | 方案、优点、缺点、结论 | `R4.7`~`R4.8` | 不得只写采用方案而不写拒绝理由。 |
| 布局形态决策表 | 候选布局、是否采用、判断依据、影响 | `R4.8` | 不得直接照搬 governance 多 crate 数量。 |
| 实现单元总表 | 实现单元、类型、职责、对应概要章节 | `R4.10` | 不得把八个业务组成部分机械拆成 crate。 |
| 目录 / Package / Crate / Binary 映射表 | 目录、类型、Cargo package、Rust crate / binary、职责、是否对外暴露 | `R4.10` | 不得出现 `L3` / `l3_` / `quantalithos_l3` 命名泄漏。 |
| 文件布局树 | 路径、文件、简短职责注释 | `R4.12` | 不得固定具体 database / queue / object storage 产品。 |
| 文件职责表 | 文件路径、所属模块、定义内容、主要责任 | `R4.12` | 不得出现 `utils.rs`、`helper.rs`、`common.rs` 等模糊职责文件。 |
| 命名检查表 | 检查项、通过条件、结果 | `R4.12` | 不得遗漏旧 P0 / `MethodContent` 泄漏检查。 |
| 依赖方向预告 | 上游 crate、下游 crate、方向、Step 5 承接 | `R4.10` | 不得把 runtime / event collaboration 写成 Cargo dependency。 |
| 编译期依赖落点表 | 依赖仓库、依赖类型、Cargo.toml 位置、path 写法、说明 | `R4.10` | 不得把 L0-bus、identity、process、runtime、member-images 写入 Cargo dependency。 |
| 待确认事项 | 事项、是否阻塞 Step 5、后续文档、处理口径 | `R4.17`~`R4.18` | 不得隐藏会影响落码的 schema / port / DTO / mapper / config 缺口。 |
| 进入下一步条件 | 条件、证据位置、结果 | `R4.18` | 不得在未闭口布局和依赖方向时进入 Step 5。 |

### 4. 后续模块承接

| 后续模块 | 承接内容 | 进入前必须确认 |
|---|---|---|
| `R4.5 目标实现仓与命名规范核对:先思考` | 核对目标实现仓、project slug、workspace member、Cargo package、Rust crate、binary 命名问题。 | 只能形成核对草案,不得写最终布局表。 |
| `R4.6 目标实现仓与命名规范核对:再写入` | 写入目标仓和命名规则记录。 | 必须继续禁止正式 `03-详细设计.md` 写入。 |
| `R4.7 布局形态裁决:先思考` | 思考单 crate、workspace 多 crate、业务组件拆 crate、单独 config / observability crate。 | 必须从当前 `00/01/02` 和 Step 3 推导。 |
| `R4.8 布局形态裁决:再写入` | 写入布局形态决策表。 | 不得复制 governance 七 crate 结论。 |
| `R4.9 实现单元与依赖落点:先思考` | 思考实现单元、Cargo dependency 落点、runtime / event 排除。 | 必须保持 `core-contracts` 为唯一 compile dependency candidate。 |
| `R4.10 实现单元与依赖落点:再写入` | 写入实现单元总表、目录映射表和依赖落点表。 | 不得把外部运行 truth 或 event collaboration 固化为源码依赖。 |
| `R4.11 文件布局树与职责:先思考` | 思考文件树和职责分批策略。 | 不得提前定义对象字段、trait 方法或 DTO schema。 |
| `R4.12 文件布局树与职责:再写入` | 写入文件布局树、文件职责表和命名检查表。 | 文件职责必须可落码且不模糊。 |

### 5. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否已固化 governance Step 4 的可借鉴框架 | pass |
| 是否已明确不得复制 governance 领域结论 | pass |
| 是否已固定 L3 Step 4 后续输出模板 | pass |
| 是否未写本仓最终布局形态裁决 | pass |
| 是否未写最终实现单元 / 文件布局树 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.5` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.5 目标实现仓与命名规范核对:先思考`;只允许形成目标实现仓、project slug、Cargo / crate / binary 命名核对草案,不得直接修改正式 `03-详细设计.md`,不得写最终文件布局,不得进入 `R4.6` 或 Step 5。

---

## R4.5 目标实现仓与命名规范核对:先思考

### 1. 本模块要回答的问题

本模块只形成目标实现仓、project slug、Cargo package、Rust crate、binary 和现有实现仓状态的核对草案。当前不裁决最终 workspace member 清单,不写最终目录 / package / crate / binary 映射表,不修改实现仓代码。

| 问题 | 初步判断 |
|---|---|
| 目标实现仓是否存在? | `/home/aris/Projects/quantalithos-method-library` 存在,可作为后续实施仓核对对象。 |
| project slug 应如何取? | 按规范从实现仓名 `quantalithos-method-library` 取 `method-library`。 |
| Cargo package 默认形态是什么? | 多 crate 时默认 `<project>-<role>`,因此候选形态应为 `method-library-<role>`。 |
| Rust library crate 默认形态是什么? | 默认 `<project>_<role>`,因此候选形态应为 `method_library_<role>`。 |
| workspace member 目录默认形态是什么? | 多 crate 时应为 `crates/<role>`,不得写 `crates/method_library_<role>`。 |
| 现有实现仓是否可作为当前布局真相源? | 不可。现有实现仓仍含旧 member 命名、旧 `content` / fingerprint / snapshot / outbox / PostgreSQL 等历史主线,只能作为差异审计输入。 |
| `core-contracts` 路径是否存在? | `/home/aris/Projects/quantalithos-core/crates/contracts` 存在,package 为 `core-contracts`,lib crate 为 `core_contracts`。 |

### 2. 读取与核对输入

| 输入 | 读取结果 | 本模块用途 |
|---|---|---|
| `standards/document/子项目目录与代码文件组织规范.md` | 已确认实现仓目录、project slug、workspace member、Cargo package、Rust crate 和 binary 命名规则。 | 作为命名核对真相源。 |
| `standards/document/详细设计书写规范.md` §5.4 | 已确认 §4 必须输出目录 / package / crate / binary 映射表,并禁止架构层级进入代码命名。 | 作为后续 `R4.6` 写入格式约束。 |
| `/home/aris/Projects/quantalithos-method-library/Cargo.toml` | 当前 workspace members 使用 `crates/method_library_*`,package 使用 `method_library_*`,并含 `sqlx` / PostgreSQL 相关 workspace dependency。 | 作为现有实现仓差异审计输入,不作为当前结论。 |
| `/home/aris/Projects/quantalithos-method-library/crates/*/Cargo.toml` | 当前 member 包括 `method_library_contracts`、`method_library_domain`、`method_library_application`、`method_library_infra`、`method_library_api`、`method_library_worker`。 | 识别与目录组织规范的命名差异。 |
| `/home/aris/Projects/quantalithos-method-library` 文件清单 | 当前仍有 `snapshots.rs`、`content/fingerprint.rs`、`content/aggregate.rs`、`migrations/*.sql`、`outbox_relay.rs` 等旧主线文件。 | 进入 `R4.13` / `R4.14` 的历史污染审计候选。 |
| `/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml` | `core-contracts` package 和 `core_contracts` lib crate 存在。 | 后续 `R4.9` / `R4.10` 依赖落点草案输入。 |

### 3. 命名规范核对草案

| 核对项 | 规范要求 | 本仓候选 / 观察 | 初步判断 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-<project>` | `/home/aris/Projects/quantalithos-method-library` | 符合目录规则。 |
| project slug | 仓名中的项目部分 | `method-library` | 符合规则,但后续表格需统一使用 hyphen / underscore 转换。 |
| workspace member 目录 | `crates/<role>` | 现有为 `crates/method_library_contracts` 等 | 现有实现仓不符合当前规范,后续设计应优先使用短职责名。 |
| Cargo package | `<project>-<role>` | 现有为 `method_library_contracts` 等 underscore package | 现有实现仓不符合当前规范,后续候选应为 `method-library-<role>`。 |
| Rust library crate | `<project>_<role>` | 候选为 `method_library_<role>` | 与规范方向一致,但需由 `R4.6` 固定为命名规则,不是最终 member 清单。 |
| binary name | `<project>` 或具体 action name | 现有 `outbox_relay`,API package 下有 `main.rs` | 需后续按当前 `02` 重新决定入口和动作名。 |
| 架构层级泄漏 | 不出现 `L0` / `L1` / `L2` / `L3` / `l*_` | 当前观察未见层级前缀,但旧业务主线泄漏明显。 | 后续命名检查须同时检查层级泄漏和旧主线泄漏。 |
| 项目前缀重复 | member 目录不得重复项目名前缀 | 现有 `crates/method_library_*` 重复项目前缀 | 后续当前设计不应继承。 |

### 4. 现有实现仓差异初判

现有实现仓只能帮助识别“不能直接继承什么”,不能作为本轮 Step 4 的布局真相源。

| 现有内容 | 差异类型 | 初步处理 |
|---|---|---|
| `crates/method_library_contracts` 等 member 目录 | 命名规范差异 | 后续设计应使用 `crates/<role>` 短职责目录候选。 |
| package `method_library_contracts` 等 | Cargo package 命名差异 | 后续设计应使用 `method-library-<role>` 候选。 |
| `features.p1-plugin` / `features.p1-configuration` | 旧 P1 主线残留 | 不正向继承,留给历史差异审计。 |
| `contracts/src/snapshots.rs` | 旧 snapshot 主线残留 | 不正向继承,除非当前 `00/01/02` 重新定义。 |
| `domain/src/content/*` | 旧 `MethodContent` / content 聚合残留 | 不正向继承,留给 `R4.13` / `R4.14`。 |
| `domain/src/content/fingerprint.rs` | 旧 fingerprint 主线残留 | 不正向继承。 |
| `infra/migrations/*.sql` 和 `sqlx` dependency | 具体 PostgreSQL 产品绑定 | Step 3 已禁止提前锁定具体 database,后续不得作为 Step 4 当前结论。 |
| `worker/src/outbox_relay.rs` | 旧 outbox / delivery 主线残留 | 不正向继承,后续事件协作必须按当前 `02` 重审。 |
| `reports/method-library/*` | 历史 evidence/report 形态 | 不作为当前 03 布局结论;测试 evidence 由后续测试方案和实施计划闭口。 |

### 5. 后续 R4.6 写入策略

`R4.6` 应把本模块草案固化成目标仓与命名规范记录,但仍不写最终文件布局树和最终实现单元总表。

| 写入块 | 内容边界 |
|---|---|
| 目标实现仓记录 | 固定目标实现仓路径存在性和 project slug。 |
| 命名规则记录 | 写入 member 目录、Cargo package、Rust crate、binary 的转换规则。 |
| 当前实现仓观察记录 | 记录现有实现仓与当前规范的差异,并声明其 historical_material 定位。 |
| `core-contracts` 路径记录 | 记录路径存在和 package / crate 名,但不裁决具体 member 依赖。 |
| 下一门禁 | 指向 `R4.7 布局形态裁决:先思考`;仍不得修改正式 `03-详细设计.md`。 |

### 6. 自检

| 检查项 | 结果 |
|---|---|
| 是否只形成命名核对草案 | 是。 |
| 是否未写最终目录 / package / crate / binary 映射表 | 是。 |
| 是否未裁决最终 workspace member 清单 | 是。 |
| 是否未修改实现仓代码 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 `R4.6` 正文或 Step 5 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.6 目标实现仓与命名规范核对:再写入`;只允许写入目标仓、project slug、member / package / crate / binary 命名规则记录和现有实现仓差异定位,不得直接修改正式 `03-详细设计.md`,不得写最终文件布局,不得进入 `R4.7` 或 Step 5。

---

## R4.6 目标实现仓与命名规范核对:再写入

### 1. 目标实现仓记录

| 项目 | 记录 | 处理口径 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-method-library` | 路径存在;可作为后续实施仓核对对象。 |
| 设计项目目录 | `projects/L3-method-library` | `L3` 只用于设计导航,不得进入代码命名。 |
| project slug | `method-library` | 从实现仓名 `quantalithos-method-library` 提取;Cargo package 使用 hyphen,crate 使用 underscore。 |
| 当前实现仓状态 | historical_material | 现有实现仓含旧命名和旧主线,不得作为本轮 Step 4 正向布局来源。 |
| 正式文档写入 | not_allowed_now | 当前仍只写中间产物,不修改正式 `03-详细设计.md`。 |

### 2. 命名规则记录

本节固定后续 Step 4 裁决时必须遵守的命名转换规则。它不是最终 member 清单。

| 层级 | 规则 | L3-method-library 候选形态 | 说明 |
|---|---|---|---|
| 实现仓目录 | `quantalithos-<project>` | `quantalithos-method-library` | 已存在。 |
| project slug | 仓名中的项目部分 | `method-library` | 作为 Cargo package 前缀。 |
| workspace member 目录 | `crates/<role>` | `crates/contracts`、`crates/domain` 等 role 形态 | 最终 role 清单留给 `R4.7`~`R4.10`。 |
| Cargo package | `<project>-<role>` | `method-library-contracts`、`method-library-domain` 等 | 后续若采用多 crate,package 使用 hyphen。 |
| Rust library crate | `<project>_<role>` | `method_library_contracts`、`method_library_domain` 等 | crate 使用 underscore。 |
| binary package | `<project>-<role>` | `method-library-api`、`method-library-worker` 或其他 role | 是否存在由布局形态和接口入口裁决。 |
| binary name | `<project>` 或具体 action name | `method-library` 或具体 job action | 必须表达用户入口或动作,不得复用旧 outbox 名称作为默认结论。 |
| 架构层级 | 不进入代码命名 | 禁止 `L3`、`l3_`、`quantalithos_l3` | 同时检查 `L0` / `L1` / `L2`。 |
| 旧主线 | 不作为命名来源 | 禁止把 P0 / P1 / `MethodContent` / snapshot / fingerprint / outbox 作为默认 member 名 | 只有经当前 Step 重审后才可重新命名进入。 |

### 3. 现有实现仓差异定位

现有实现仓的文件只作为历史差异审计输入。后续 Step 4 不得把现有目录名、package 名或旧文件名直接视为已确认结论。

| 观察项 | 当前实现仓状态 | 与本轮规则的关系 | 后续处理 |
|---|---|---|---|
| workspace member 目录 | `crates/method_library_contracts`、`crates/method_library_domain`、`crates/method_library_application`、`crates/method_library_infra`、`crates/method_library_api`、`crates/method_library_worker` | member 目录重复项目前缀,不符合 `crates/<role>` 短职责名规则。 | 后续若采用多 crate,以 `crates/<role>` 重新裁决。 |
| Cargo package | `method_library_contracts` 等 underscore package | 不符合 `<project>-<role>` package 命名规则。 | 后续设计使用 `method-library-<role>` 形态。 |
| Rust crate | 现有 package 暗示 `method_library_*` crate 形态 | crate underscore 方向可参考,但不能继承 member 目录和 package 写法。 | `R4.10` 再落到具体 member。 |
| `features.p1-*` | `p1-plugin`、`p1-configuration` | 旧 P1 主线残留。 | `R4.13` / `R4.14` 审计禁入或重定义。 |
| `contracts/src/snapshots.rs` | snapshot 文件存在 | 旧 snapshot 主线残留。 | 不正向继承。 |
| `domain/src/content/*` | content aggregate / fingerprint / lifecycle 等文件存在 | 旧 `MethodContent` 与 fingerprint 主线残留。 | 不正向继承。 |
| `infra/migrations/*.sql` | PostgreSQL migrations 存在 | Step 3 已禁止提前锁定具体 database 产品。 | 不进入 Step 4 当前布局结论。 |
| `worker/src/outbox_relay.rs` | outbox relay 文件存在 | 旧 outbox / delivery 主线残留。 | 不正向继承;事件协作后续按当前 `02` 重审。 |
| `reports/method-library/*` | 历史 reports 存在 | 属于旧 evidence/report 形态。 | 不作为当前 03 布局结论。 |

### 4. `core-contracts` 路径记录

| 项 | 记录 | 后续使用 |
|---|---|---|
| 依赖仓 | `/home/aris/Projects/quantalithos-core` | 仅 `core-contracts` 是当前 compile dependency candidate。 |
| dependency path | `../quantalithos-core/crates/contracts` | 后续 `R4.9` / `R4.10` 决定写入哪个 `Cargo.toml`。 |
| Cargo package | `core-contracts` | 可作为 workspace dependency 名。 |
| Rust crate | `core_contracts` | 可作为 Rust import crate 名。 |
| 当前限制 | 不裁决具体引用 member | Step 4 当前只记录路径存在和命名,不写 dependency matrix。 |

### 5. 下一门禁

| 检查项 | 结果 |
|---|---|
| 是否已写入目标实现仓和 project slug | pass |
| 是否已写入 member / package / crate / binary 命名规则 | pass |
| 是否已把现有实现仓定位为 historical_material | pass |
| 是否已记录 `core-contracts` 路径但未裁决依赖落点 | pass |
| 是否未写最终 workspace member 清单 | pass |
| 是否未写最终文件布局树 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.7` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.7 布局形态裁决:先思考`;只允许思考单 crate、workspace 多 crate、业务组成部分拆 crate、单独 config / observability crate 等候选布局,不得直接修改正式 `03-详细设计.md`,不得写最终目录 / package / crate / binary 映射表,不得进入 `R4.8` 或 Step 5。

---

## R4.7 布局形态裁决:先思考

### 1. 本模块要回答的问题

本模块只形成布局形态裁决草案,为 `R4.8` 写入正式布局形态决策表做准备。当前不写最终 workspace member 清单,不写目录 / package / crate / binary 映射表,不写文件布局树。

| 问题 | 草案判断 |
|---|---|
| 是否可以采用单 crate 模块分层? | 不宜作为主方案。当前接口规模、public contract、domain / application / infra 依赖边界和多入口族会让单 crate 依赖方向只能靠 review 维护。 |
| 是否可以采用 workspace 多 crate? | 草案倾向采用。它能用 Cargo 边界表达 contracts、domain、application、infra、入口 / operations 等依赖方向。 |
| 是否可以按 8 个业务组成部分各拆一个 crate? | 不采用。八个组成部分是业务主线,每条都会横跨 contracts / domain / application / adapter / tests,按业务拆 crate 容易制造循环依赖。 |
| 是否单独创建 config / observability crate? | 当前不宜作为独立 crate。Step 3 已明确配置、观测、审计是 cross-cutting 承载面,当前没有独立复用边界。 |
| 是否继承现有实现仓 `method_library_*` workspace? | 不继承。现有实现仓仍是 historical material,目录和 package 命名也不符合当前规范。 |
| 是否复制 L1-governance 七 crate 结论? | 不复制。只能参考 workspace 多 crate 的工程边界思路,具体 role 和 member 由 L3 当前 `00/01/02` 推导。 |

### 2. 裁决输入

| 输入 | 对布局形态的影响 |
|---|---|
| 正式 `02-概要设计.md` §4 实现分层 | 明确存在 Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection / Material、Collaboration / External Adapters 分层。 |
| 正式 `02-概要设计.md` §5 八个组成部分 | 组成部分说明业务“做什么”,不是 crate 边界;Step 5 后续按组成部分展开模块契约。 |
| 正式 `02-概要设计.md` §8 接口规模 | 当前覆盖 58 个 Command、57 个 Query、4 个 Inbound Consumer、34 个 Outbound Event candidate 和 8 个 Operations Job。 |
| Step 3 runtime 约束 | runtime 必须分层表达;事件不等于 outbox;Job 不修 core truth;不得提前锁定 HTTP / queue / database / scheduler 产品。 |
| Step 3 跨仓依赖约束 | 只有 `core-contracts` 是 compile dependency candidate;运行期 / event 协作不得写 Cargo dependency。 |
| `R4.6` 命名规则 | 若采用多 crate,member 目录必须为 `crates/<role>`,package 必须为 `method-library-<role>`,crate 必须为 `method_library_<role>`。 |
| 现有实现仓观察 | 现有 workspace 可作为历史污染样本,不能作为当前布局结论。 |

### 3. 候选方案分析

| 候选方案 | 优点 | 风险 / 缺点 | 草案判断 |
|---|---|---|---|
| A. 单 crate 模块分层 | 初始目录少;重命名现有仓成本低;短期编译配置简单。 | public contracts、domain、application、infra、entry、job 边界只能靠 module 纪律;`core-contracts` 引用范围难以强制;58/57/4/34/8 的接口规模会让单 crate 快速膨胀。 | 不作为主方案。 |
| B. workspace 多 crate 按工程 role 分层 | Cargo 可强制依赖方向;contracts 可单独对外;domain 可保持不依赖 infra;application port 与 infra adapter 边界清楚;多入口和 job 可隔离。 | 初始 workspace 结构更重;需要在 Step 5 给出 crate dependency matrix;实施时可能需要迁移旧 member。 | 草案倾向采用。 |
| C. 按 8 个业务组成部分拆 crate | 业务名直观;每个组成部分看似独立。 | 组成部分横跨协议、对象、service、port、adapter 和 read material;正式化、消费、追溯、关系、外部摘要之间有密集接缝,容易循环依赖。 | 不采用。 |
| D. 继承现有 `method_library_*` workspace | 本地已有文件和 Cargo workspace。 | 目录重复项目前缀;package 使用 underscore;含旧 P1、snapshot、fingerprint、outbox、PostgreSQL 主线;会污染本轮 full-restart。 | 不采用。 |
| E. 单独 config crate / observability crate | cross-cutting 看起来可复用。 | 当前没有独立发布或跨仓复用需求;配置不得改 truth,观测 / 审计字段也需由 Step 15 和 04 配置设计闭口;过早抽象会制造空 crate。 | 当前不采用。 |
| F. 按入口拆 api / worker / jobs 为第一层主结构 | Command / Query / Consumer / Job 入口清晰。 | 入口不是业务 owner;如果以入口为主结构,domain 和 application 可能被入口反向牵引。 | 入口可作为 role,但不能替代 domain / application / infra 分层。 |

### 4. 草案倾向

草案倾向采用 workspace 多 crate,但 `R4.7` 不固定最终 member 清单。后续 `R4.8` 只应写入布局形态采用 / 不采用理由;具体实现单元和目录映射留给 `R4.9` / `R4.10`。

| 裁决点 | 草案倾向 | 理由 |
|---|---|---|
| 总体布局 | workspace 多 crate | 接口族多、public contract 边界明确、domain / application / infra 需要依赖方向约束。 |
| crate 边界原则 | 按工程 role,不是按业务组成部分 | 八个业务组成部分会跨 role 分布,不能作为 Cargo 边界。 |
| contracts 边界 | 需要可独立表达 | Command / Query / Event / Job public surface 后续 Step 8 需要稳定承载。 |
| domain 边界 | 需要与 infra 隔离 | 核心 truth、规则、状态和不变量不得依赖 adapter / persistence / runtime。 |
| application 边界 | 需要承载 use case / port | Command / Query / Consumer / Job 编排和 port trait 不应依赖具体 infra。 |
| infra / entry / job 边界 | 需要后续再裁决粒度 | Step 3 禁止提前锁定具体框架,因此当前只裁决多 crate 形态,不写具体 adapter 或 binary 文件树。 |

### 5. 对后续模块的约束

| 后续模块 | 约束 |
|---|---|
| `R4.8` | 写布局形态决策表时可以采用 workspace 多 crate,但不得直接给出最终 member 清单和文件树。 |
| `R4.9` | 思考实现单元时必须从工程 role 与依赖方向出发,再映射 8 个业务组成部分。 |
| `R4.10` | 写实现单元总表和目录映射表时必须遵守 `R4.6` 命名规则。 |
| Step 5 | 需要把 workspace 依赖方向收口为正式 crate dependency matrix。 |
| Step 6~9 | 对象、port、protocol、flow 必须按 role 和业务组成部分双向回指,不得让文件布局替代业务 owner。 |

### 6. 自检

| 检查项 | 结果 |
|---|---|
| 是否只形成布局形态裁决草案 | 是。 |
| 是否未写最终布局形态决策表 | 是。 |
| 是否未写最终 workspace member 清单 | 是。 |
| 是否未写目录 / package / crate / binary 映射表 | 是。 |
| 是否未写文件布局树 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 `R4.8` 正文或 Step 5 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.8 布局形态裁决:再写入`;只允许写入布局形态决策表和采用 / 不采用理由,不得直接修改正式 `03-详细设计.md`,不得写最终实现单元总表、目录 / package / crate / binary 映射表或文件布局树,不得进入 `R4.9` 或 Step 5。

---

## R4.8 布局形态裁决:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.8 布局形态裁决:再写入` |
| 上一模块 | `R4.7 布局形态裁决:先思考` |
| 用户确认 | 已确认进入 `R4.8` |
| 本模块允许写入 | 布局形态决策表、采用 / 不采用理由、后续承接门禁 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、最终实现单元总表、目录 / package / crate / binary 映射表、文件布局树、Step 5 crate dependency matrix |
| 下一模块 | `R4.9 实现单元与依赖落点:先思考` |

### 2. 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 当前有 58 个 Command、57 个 Query、4 个 Inbound Consumer、34 个 Outbound Event candidate 和 8 个 Operations Job;public contract、domain、application、infra、entry、job 边界需要被依赖方向约束。 | 不采用;避免 contracts / domain / application / infra 混在同一 crate 中只能靠 review 约束。 |
| workspace 多 crate 架构 | 是 | 适合用 Cargo 边界表达 public contracts、domain truth、application orchestration、infra adapter、entry / operations 的依赖方向;也符合 `core-contracts` 作为 compile dependency candidate 的受控落点需求。 | 采用为本轮 Step 4 布局形态;具体实现单元和 member 清单留给 `R4.9` / `R4.10`。 |
| 按 8 个业务组成部分拆 crate | 否 | 八个组成部分是业务主线,每条都会横跨 protocol、domain、application、port、adapter、read material 和 tests;按业务拆 crate 会制造循环依赖和重复边界。 | 不采用;业务组成部分后续作为 Step 5 模块契约主轴和 Step 6~9 owner 来源,不是 Cargo 边界。 |
| 继承现有 `method_library_*` workspace | 否 | 现有实现仓仍含旧 P1、snapshot、fingerprint、outbox、PostgreSQL 主线,且 member 目录 / package 命名不符合当前规范。 | 不采用;现有实现仓只作为 historical material 和差异审计输入。 |
| 单独 config crate / observability crate | 否 | 配置、观测、审计属于 cross-cutting 承载面,当前没有独立发布或跨仓复用需求;配置不得改变 truth owner 或状态语义。 | 当前不单独建 crate;后续由 infra / application / domain / Step 15 / `04-配置设计.md` 承接。 |
| 入口优先拆分架构 | 否 | API / worker / jobs 是入口和执行形态,不是业务 owner;入口优先会反向牵引 domain 和 application 边界。 | 不作为总体布局;入口可作为后续 role 候选,但必须依赖 application,不得替代 domain / application / infra 分层。 |

### 3. 采用 workspace 多 crate 的理由

| 理由 | 说明 | 后续约束 |
|---|---|---|
| public contract 需要独立边界 | Command / Query / Inbound / Outbound / Job 协议后续 Step 8 需要稳定 surface。 | `R4.9` / `R4.10` 必须考虑 contracts role,但具体 member 名和职责仍需写入后确认。 |
| domain 需要保持纯净 | 核心 truth、规则、状态和不变量不得依赖 adapter、persistence、runtime 或具体 framework。 | Step 5 必须写正式 crate dependency matrix,防止 domain 反向依赖 infra。 |
| application 需要承载编排和 port | 58/57/4/34/8 接口规模需要 application service、port、UoW、idempotency、query/job orchestration 等边界。 | `R4.9` 需要判断 application role 与 operation / entry role 的边界。 |
| infra 需要隔离 adapter | Step 3 禁止提前锁定 database / queue / scheduler / HTTP 产品,但需要给 adapter、runtime builder、fake 留出承载位置。 | `R4.10` 只能定义 role 和依赖落点,不得锁定具体产品。 |
| 多入口和 job 需要隔离 | Command / Query、Inbound Consumer、Outbound publisher candidate、Operations Job 的执行方式不同。 | 入口和 job 是否拆成独立 member 留给 `R4.9` / `R4.10`;本模块不直接固定。 |
| compile dependency 需要受控落点 | `core-contracts` 是唯一 compile dependency candidate,不应无边界扩散到所有代码。 | `R4.9` / `R4.10` 必须写依赖落点草案和非 Cargo 依赖排除。 |

### 4. 不采用方案的关闭理由

| 方案 | 关闭理由 | 防回流规则 |
|---|---|---|
| 单 crate 模块分层 | 不能用 Cargo 强制依赖方向,容易把 public DTO、domain rule、adapter 和 runtime 纠缠。 | 后续不得以“现有实现仓迁移成本低”为理由恢复单 crate。 |
| 业务组成部分拆 crate | 业务组成部分是 owner / capability 主线,不是编译边界。 | 后续不得生成 `crates/formalization`、`crates/consumption`、`crates/trace` 这类以业务组成部分命名的 crate,除非回 Step 4 重审。 |
| 旧 `method_library_*` workspace | 命名不符合 `crates/<role>` / `<project>-<role>` 规则,且旧主线污染未关闭。 | 后续不得直接继承旧 Cargo workspace members。 |
| 单独 config / observability crate | 当前没有独立复用边界,且配置 / 观测需要由对象、flow、error、config 和 audit Step 闭口。 | 后续如需独立 crate,必须回 Step 4 和 Step 14 / Step 15 重审。 |
| 入口优先架构 | 入口不是 owner,会诱导 API / worker / job 直接拥有业务边界。 | 后续 entry role 只能调用 application service,不得直接改写 truth。 |

### 5. 后续承接

| 后续位置 | 承接内容 |
|---|---|
| `R4.9 实现单元与依赖落点:先思考` | 在 workspace 多 crate 形态下思考具体实现单元、role 候选、`core-contracts` 落点和运行期 / event 排除。 |
| `R4.10 实现单元与依赖落点:再写入` | 写入实现单元总表、目录 / package / crate / binary 映射表和依赖落点表。 |
| `R4.11` / `R4.12` | 在已确认实现单元基础上写文件布局树、文件职责表和命名检查表。 |
| Step 5 | 把本 Step 的 workspace 多 crate 形态收口为正式 crate dependency matrix 和模块契约主轴。 |
| Step 6~9 | 对象、port、protocol、flow 必须同时回指业务组成部分和工程 role,不得用 crate 名替代业务 owner。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否已写入布局形态决策表 | pass |
| 是否明确采用 workspace 多 crate | pass |
| 是否明确拒绝单 crate、业务组成部分拆 crate、旧 workspace、单独 config / observability crate和入口优先架构 | pass |
| 是否未写最终实现单元总表 | pass |
| 是否未写最终目录 / package / crate / binary 映射表 | pass |
| 是否未写文件布局树 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.9` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.9 实现单元与依赖落点:先思考`;只允许思考 workspace 多 crate 下的实现单元、Cargo dependency 落点和运行期 / event 排除草案,不得直接修改正式 `03-详细设计.md`,不得写最终文件布局树,不得进入 `R4.10` 或 Step 5。

---

## R4.9 实现单元与依赖落点:先思考

### 1. 本模块要回答的问题

本模块只形成 workspace 多 crate 下的实现单元候选、依赖落点和运行期 / event 排除草案。最终实现单元总表、目录 / package / crate / binary 映射表和依赖落点表留给 `R4.10` 写入。

| 问题 | 草案判断 |
|---|---|
| 实现单元应按什么原则划分? | 按工程 role 和依赖方向划分,再映射八个业务组成部分;不按业务组成部分直接拆 crate。 |
| 哪些 role 是高可信候选? | `contracts`、`domain`、`application`、`infra` 是高可信候选,分别承载 public surface、truth/model、orchestration/ports、adapter/runtime。 |
| 入口和后台执行是否直接固定? | `api`、`worker`、`jobs` 是候选 role,但需要 `R4.10` 结合接口族和运行方式写入;当前不生成最终 member 清单。 |
| `core-contracts` 应如何落点? | 可作为 workspace dependency 候选,但具体 member 引用范围应由 role 职责决定,不得无边界扩散。 |
| 运行期 / event 依赖如何处理? | `L0-bus`、process、identity、runtime、member-images 等不得写 Cargo dependency,只能通过 port / adapter / event / fake / config 绑定表达。 |
| 是否写文件布局树? | 不写。文件布局树留给 `R4.11` / `R4.12`。 |

### 2. 裁决输入

| 输入 | 对本模块的影响 |
|---|---|
| `R4.8` 布局形态裁决 | 已采用 workspace 多 crate,但未固定 member 清单。 |
| `R4.6` 命名规则 | 若 role 被 `R4.10` 采纳,member 目录用 `crates/<role>`,package 用 `method-library-<role>`,crate 用 `method_library_<role>`。 |
| 正式 `02-概要设计.md` §4 | 实现分层包含 Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection / Material、Collaboration / External Adapters。 |
| 正式 `02-概要设计.md` §5 | 八个业务组成部分是 owner / capability 来源,不是 Cargo 边界。 |
| 正式 `02-概要设计.md` §8 | 58 Command、57 Query、4 Inbound、34 Outbound candidate 和 8 Job 需要稳定 public contract 与编排边界。 |
| Step 3 跨仓依赖约束 | 只有 `core-contracts` 是 compile dependency candidate;运行期 / event 关系必须排除 Cargo dependency。 |
| Step 3 runtime / 安全约束 | 不提前锁定 HTTP / queue / scheduler / database;不创建 auth / gateway / external body storage 主体模块。 |

### 3. 实现单元候选池

以下是 `R4.10` 写入最终实现单元总表前的候选池。候选不等于最终 member 清单。

| 候选 role | 候选类型 | 候选职责 | 进入 `R4.10` 的判断点 |
|---|---|---|---|
| `contracts` | library crate | Command / Query / Inbound / Outbound / Job public DTO、typed ref、summary ref、safe marker、protocol error。 | 需要独立 public surface,应高优先进入。 |
| `domain` | library crate | 方法资产定义 truth、正式化与版本、受控消费、追溯 / 一致性、关系 / 分发、外部摘要、维护状态、外围组织的 domain object / policy / invariant。 | 需要隔离 infra 和 runtime,应高优先进入。 |
| `application` | library crate | application service、command / query / consumer / job orchestration、port trait、UoW、idempotency、visibility / boundary guard 协调。 | 需要承载 58/57/4/34/8 接口族编排,应高优先进入。 |
| `infra` | library crate | repository / projection / material store adapter、external adapter、publisher adapter、runtime builder、config binding、fake adapter。 | 需要隔离具体实现和 framework,应高优先进入。 |
| `api` | entry crate / binary-capable crate | Command / Query 同步入口、handler assembly、transport-independent route / RPC placeholder。 | 只有在 Step 8 / Step 14 保持同步入口需要独立 assembly 时进入;不得包含业务 truth。 |
| `worker` | entry crate / binary-capable crate | Inbound consumer runner、event candidate publisher runner、background loop assembly。 | 只有在 consumer / publisher 运行入口需要独立承载时进入;不得恢复 outbox relay 语义。 |
| `jobs` | entry crate / binary-capable crate | Operations Job runner、read material refresh、trace refresh、recovery convergence、maintenance progress 执行入口。 | 8 个 Operations Job 是正式接口族,倾向需要独立承载;不得修 core truth。 |
| `tests` / `test-support` | tests directory or dev support module | contract / domain / service / integration tests、fixtures、fakes。 | 是否作为 crate 不在当前裁决;默认优先 tests 目录或 member 内 test support,避免过早抽 crate。 |

### 4. 八个业务组成部分到 role 的映射草案

| 业务组成部分 | role 映射草案 | 注意事项 |
|---|---|---|
| 方法资产定义与目录 | contracts / domain / application / infra / api / tests | definition truth 在 domain;write / read 编排在 application;入口不拥有 truth。 |
| 正式化与版本 | contracts / domain / application / infra / api / tests | formalization 与 version 不以 publish / fingerprint / snapshot 表达。 |
| 受控消费 | contracts / domain / application / infra / api / tests | consumption material 与 availability view 不复制定义正文或下游运行状态。 |
| 追溯与一致性保护 | contracts / domain / application / infra / api / jobs / tests | trace / audit / impact body-free;recovery / refresh 不修 core truth。 |
| 关系与分发语义 | contracts / domain / application / infra / api / tests | relation 不是 runtime dependency 或 marketplace transaction。 |
| 外部摘要与引用 | contracts / domain / application / infra / api / worker / jobs / tests | Inbound owner 在该组成部分;只允许 summary/ref/digest/marker/safe reason。 |
| 后台维护与收敛 | contracts / domain / application / infra / jobs / worker / tests | Job 只刷新派生材料和 progress;worker / scheduler 产品不在 Step 4 固定。 |
| 外围包与方法集组织 | contracts / domain / application / infra / api / tests | peripheral 不阻塞 core,不持 marketplace listing / install / fulfillment truth。 |

### 5. Cargo dependency 落点草案

本模块只形成依赖落点草案。正式依赖表由 `R4.10` 写入,crate dependency matrix 留给 Step 5。

| 依赖 / 方向 | 草案落点 | 草案理由 | 禁止事项 |
|---|---|---|---|
| `core-contracts` | workspace root `[workspace.dependencies]` 候选;member 按需要引用。 | 避免每个 member 写重复 path;便于实施前统一切换 private git dependency。 | 不得默认所有 member 引用;不得在本仓重定义 core shared types。 |
| `contracts -> core-contracts` | 候选允许。 | public DTO 可能需要共享 typed ref、trace context 或基础 metadata。 | 不得依赖 domain / application / infra。 |
| `domain -> contracts / core-contracts` | 候选允许,需 Step 5 收口。 | domain 可能使用本仓 typed ref 和 shared core refs。 | 不得依赖 application / infra / entry。 |
| `application -> contracts / domain / core-contracts` | 候选允许。 | application 编排 contract DTO、domain object 和 port trait。 | 不得依赖 concrete infra adapter。 |
| `infra -> contracts / domain / application / core-contracts` | 候选允许。 | infra 实现 application port,组装 repository / adapter / runtime。 | 不得把具体 database / queue / scheduler 产品写成 Step 4 结论。 |
| `api` / `worker` / `jobs -> contracts / application / infra` | 候选允许。 | entry crate 负责 assembly,调用 application service 和 infra runtime builder。 | 不得直接改写 domain truth 或绕过 application。 |

### 6. 非 Cargo 依赖排除草案

| 外部关系 | 依赖类型 | Step 4 排除口径 | 后续承接 |
|---|---|---|---|
| `L0-bus` | event collaboration | 不写 Cargo dependency;不恢复 outbox / relay / topic 机制。 | Step 7 port、Step 8 event contract、Step 14 transport binding。 |
| `L1-process` | runtime consumption | 不写 Cargo dependency;通过 controlled consumption material、API / SDK / adapter / fake 表达。 | Step 7 adapter port、Step 8 query / consumption contract、Step 14 config。 |
| `L1-identity` | runtime consumption | 不写 Cargo dependency;通过 role / actor / identity safe summary 或 adapter 表达。 | Step 7 / Step 8 / Step 15。 |
| `L2-runtime` | runtime consumption | 不写 Cargo dependency;runtime use 通过 adapter / SDK / fake / unavailable 分支表达。 | Step 7 / Step 8 / Step 14。 |
| `L2-member-images` | runtime consumption | 不写 Cargo dependency;Role -> image variant definition 通过正式 consumption boundary 表达。 | Step 7 / Step 8 / Step 14。 |
| `L4-observability` / archive / external systems | handoff / external collaboration | 不写 Cargo dependency;只保留 handoff / adapter / report / audit 边界。 | Step 15、Step 17、后续测试 / 实施计划。 |

### 7. R4.10 写入策略

`R4.10` 应写入:

- 实现单元总表。
- 目录 / package / crate / binary 映射表。
- 编译期依赖落点表。
- 运行期 / event 依赖排除表。
- 依赖方向预告,并明确正式 crate dependency matrix 留给 Step 5。

`R4.10` 不得写入:

- 文件布局树。
- 文件职责表。
- 对象字段、trait 方法、DTO schema、flow 步骤或状态矩阵。
- 正式 `03-详细设计.md` 正文。
- 具体 database / queue / scheduler / HTTP framework 绑定。

### 8. 自检

| 检查项 | 结果 |
|---|---|
| 是否只形成实现单元候选和依赖落点草案 | 是。 |
| 是否未写最终实现单元总表 | 是。 |
| 是否未写最终目录 / package / crate / binary 映射表 | 是。 |
| 是否未写文件布局树 | 是。 |
| 是否未把运行期 / event 依赖写成 Cargo dependency | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 `R4.10` 正文或 Step 5 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.10 实现单元与依赖落点:再写入`;只允许写入实现单元总表、目录 / package / crate / binary 映射表、编译期依赖落点表和非 Cargo 依赖排除表,不得直接修改正式 `03-详细设计.md`,不得写文件布局树,不得进入 `R4.11` 或 Step 5。

---

## R4.10 实现单元与依赖落点:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.10 实现单元与依赖落点:再写入` |
| 上一模块 | `R4.9 实现单元与依赖落点:先思考` |
| 用户确认 | 已确认进入 `R4.10` |
| 本模块允许写入 | 实现单元总表、目录 / package / crate / binary 映射表、编译期依赖落点表、非 Cargo 依赖排除表、依赖方向预告 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、文件布局树、文件职责表、对象字段、trait 方法、DTO schema、flow 步骤、状态矩阵、具体 database / queue / scheduler / HTTP framework 绑定 |
| 下一模块 | `R4.11 文件布局树与职责:先思考` |

### 2. 实现单元总表

本表按工程 role 和依赖方向定义实现单元。它不是按 8 个业务组成部分拆 crate,也不是复制 L1-governance 的领域结论。

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 承载 Command / Query / Inbound / Outbound / Job public DTO、typed ref、summary ref、safe marker、protocol error 和公共 view surface。 | §7 API / 接口骨架;§8 处理流;§12 详细设计承接 |
| `domain` | library crate | 承载方法资产定义 truth、正式化与版本、受控消费、追溯与一致性保护、关系与分发、外部摘要、维护状态、外围组织的 domain object、policy、guard、invariant 和 domain error。 | §5 主要组成部分;§6 关键对象;§9 状态 |
| `application` | library crate | 承载 application service、Command / Query / Consumer / Job orchestration、port trait、UoW、idempotency、boundary / visibility coordination 和 application error。 | §4 实现分层;§7 API / 接口骨架;§8 处理流 |
| `infra` | library crate | 承载 repository / projection / material store adapter、external adapter、publisher adapter、runtime builder、config binding、clock / id / fake adapter 和 infra error。 | §4 实现分层;§11 配置影响;§12 承接清单 |
| `api` | entry crate / binary-capable crate | 承载 Command / Query 同步入口 assembly、handler boundary 和 transport-neutral route / RPC placeholder。 | §7 Command / Query;§8 Command / Query flow |
| `worker` | entry crate / binary-capable crate | 承载 Inbound Consumer runner、event candidate publisher runner 和 background loop assembly;不表达 outbox relay 机制。 | §7 Inbound Consumer / Outbound Event;§8 Inbound / Event boundary |
| `jobs` | entry crate / binary-capable crate | 承载 Operations Job runner、read material refresh、trace refresh、recovery convergence、maintenance progress 执行入口。 | §7 Operations Job;§8 Job flow;§10 maintenance / recovery |

### 3. 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `method-library-contracts` | `method_library_contracts` | 公共 contracts、typed refs、safe summary / marker、public view / error surface | 是 |
| `crates/domain` | library crate | `method-library-domain` | `method_library_domain` | domain truth、state、policy、guard、invariant、domain error | 否 |
| `crates/application` | library crate | `method-library-application` | `method_library_application` | application services、port traits、UoW、idempotency、query / consumer / job orchestration | 否 |
| `crates/infra` | library crate | `method-library-infra` | `method_library_infra` | repository / adapter / publisher / external binding / config / runtime builder / fakes | 否 |
| `crates/api` | library crate 或 binary-capable package | `method-library-api` | `method_library_api` / `method-library-api` | Command / Query inbound assembly and handlers | 否 |
| `crates/worker` | library crate 或 binary-capable package | `method-library-worker` | `method_library_worker` / `method-library-worker` | Inbound consumer and event candidate publisher runner assembly | 否 |
| `crates/jobs` | library crate 或 binary-capable package | `method-library-jobs` | `method_library_jobs` / job action binaries | Operations Job runner assembly | 否 |

### 4. 编译期依赖落点表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖候选 | workspace root `Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | member crate 通过 `core-contracts.workspace = true` 按需引用;实施前必须重新核对相对路径。 |
| 本仓内部 crate | workspace member dependency | 各 member `Cargo.toml` | `<package>.workspace` 或 path / workspace 口径由实施计划收口 | Step 4 只固定 role 与方向;正式 crate dependency matrix 留给 Step 5。 |

### 5. 依赖方向预告

正式 crate dependency matrix 留给 Step 5。本 Step 只固定方向预告和禁止方向。

```text
contracts
  -> core-contracts

domain
  -> contracts
  -> core-contracts

application
  -> contracts
  -> domain
  -> core-contracts

infra
  -> contracts
  -> domain
  -> application
  -> core-contracts

api / worker / jobs
  -> contracts
  -> application
  -> infra
  -> core-contracts
```

禁止方向:

- `contracts` 不依赖 `domain`、`application`、`infra`、`api`、`worker` 或 `jobs`。
- `domain` 不依赖 `application`、`infra`、`api`、`worker` 或 `jobs`。
- `application` 不依赖具体 `infra` adapter。
- `api`、`worker`、`jobs` 不直接改写 truth,只能调用 application service / runtime assembly。
- 非 `core-contracts` 的 sibling repo 不得出现在 Cargo dependency。

### 6. 非 Cargo 依赖排除表

| 外部关系 | 全局依赖类型 | Step 4 Cargo 处理 | 后续承接 |
|---|---|---|---|
| `L0-bus` | event collaboration | 不写 Cargo dependency。 | Step 7 publisher / consumer port;Step 8 event contract;Step 14 transport binding;tests fake。 |
| `L1-process` | runtime consumption | 不写 Cargo dependency。 | controlled consumption material、runtime adapter、API / SDK / fake、unavailable / degraded 分支。 |
| `L1-identity` | runtime consumption / actor context | 不写 Cargo dependency。 | actor / role / identity safe summary、adapter port、audit metadata、Step 15 observability。 |
| `L2-runtime` | runtime consumption | 不写 Cargo dependency。 | runtime use adapter、config binding、fake / unavailable 分支。 |
| `L2-member-images` | runtime consumption | 不写 Cargo dependency。 | Role -> image variant definition consumption boundary、adapter / fake。 |
| `L4-observability` / archive / external systems | handoff / external collaboration | 不写 Cargo dependency。 | handoff adapter、audit / report boundary、Step 15 / Step 17。 |

### 7. 八个业务组成部分到实现单元的承接表

| 业务组成部分 | 主要实现单元 | 说明 |
|---|---|---|
| 方法资产定义与目录 | `contracts`、`domain`、`application`、`infra`、`api` | definition truth 在 domain;Command / Query surface 在 contracts;入口只调用 application。 |
| 正式化与版本 | `contracts`、`domain`、`application`、`infra`、`api` | formalization / version truth 和规则在 domain;不恢复 publish / fingerprint / snapshot。 |
| 受控消费 | `contracts`、`domain`、`application`、`infra`、`api` | consumption material 与 availability view 不复制定义正文或下游运行 truth。 |
| 追溯与一致性保护 | `contracts`、`domain`、`application`、`infra`、`api`、`jobs` | trace / audit / impact body-free;Job 只刷新派生材料和 progress。 |
| 关系与分发语义 | `contracts`、`domain`、`application`、`infra`、`api` | relation / distribution ref 不表达 runtime dependency、call graph 或 marketplace transaction。 |
| 外部摘要与引用 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | Inbound owner 在该组成部分;只允许 summary/ref/digest/marker/safe reason。 |
| 后台维护与收敛 | `contracts`、`domain`、`application`、`infra`、`worker`、`jobs` | Job 和 runner 不修 core truth,不固定 scheduler / queue 产品。 |
| 外围包与方法集组织 | `contracts`、`domain`、`application`、`infra`、`api` | peripheral 不阻塞 core,不持 marketplace listing / install / fulfillment truth。 |

### 8. 后续承接

| 后续位置 | 承接内容 |
|---|---|
| `R4.11 文件布局树与职责:先思考` | 基于本模块七个实现单元思考文件布局树和文件职责分批策略。 |
| `R4.12 文件布局树与职责:再写入` | 写入文件布局树、文件职责表和命名检查表。 |
| Step 5 | 将本模块的依赖方向预告收口为正式 crate dependency matrix 和模块实现契约主轴。 |
| Step 6~9 | 对象、port、protocol、flow 必须回指业务组成部分和实现单元,不得让 crate 名替代 owner。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否已写实现单元总表 | pass |
| 是否已写目录 / package / crate / binary 映射表 | pass |
| 是否已写编译期依赖落点表 | pass |
| 是否已写非 Cargo 依赖排除表 | pass |
| 是否只把 `core-contracts` 作为 compile dependency candidate | pass |
| 是否未写文件布局树 | pass |
| 是否未写文件职责表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.11` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.11 文件布局树与职责:先思考`;只允许思考文件布局树草案、文件职责分批策略和命名检查策略,不得直接修改正式 `03-详细设计.md`,不得写最终文件布局树,不得进入 `R4.12` 或 Step 5。

---

## R4.11 文件布局树与职责:先思考

### 1. 本模块处理边界

| 项目 | 判断 |
|---|---|
| 当前模块 | `R4.11 文件布局树与职责:先思考` |
| 上一模块输入 | `R4.10` 已固定七个实现单元、member 目录、Cargo package、Rust crate / binary 命名和依赖方向预告。 |
| 本模块允许 | 思考文件布局树草案、文件职责分批策略、命名检查策略和 `R4.12` 写入顺序。 |
| 本模块禁止 | 写最终文件布局树、写最终文件职责表、修改正式 `03-详细设计.md`、定义对象字段、trait 方法、DTO schema、flow 步骤、状态矩阵、database / queue / scheduler / HTTP framework 绑定。 |
| 下一模块 | `R4.12 文件布局树与职责:再写入` |

`R4.11` 的目标不是一次生成完整目录树,而是先把 `R4.12` 应该如何写清楚:哪些文件类别必须存在,每类文件承担什么边界,哪些文件名禁止,以及写入时如何避免把 Step 6 以后才该定义的对象字段、port 方法或协议 schema 提前落入 Step 4。

### 2. L1-governance 框架借鉴点

| 借鉴项 | 可借鉴内容 | 本仓调整 |
|---|---|---|
| 文件布局树 | 使用 workspace root、`crates/<role>/src/*.rs`、`tests/<category>/*.rs` 的可创建树形结构。 | 用 `quantalithos-method-library`、`method-library-*`、`method_library_*` 和本仓八个组成部分替换 governance 领域语义。 |
| 文件职责注释 | 每个文件只用一句注释说明承载面,不写字段、方法或状态转移。 | 保持 body-free / summary-ref-only / no runtime truth 边界。 |
| 文件职责表 | 以 `文件路径 / 所属模块 / 定义内容 / 主要责任` 收口。 | 增加旧 `MethodContent`、publish、snapshot、fingerprint、outbox relay 禁入检查。 |
| 命名检查表 | 检查实现仓目录、project slug、member、package、crate、binary、架构层级泄漏和模糊文件名。 | 额外检查 `L3` 泄漏、旧 P0 / P1 主线泄漏、外部仓名泄漏和 sibling repo Cargo dependency 泄漏。 |
| 进入下一步条件 | Step 5 只能在文件树、职责表、命名检查和依赖落点闭口后进入。 | 保持 Step 5 只收 crate dependency matrix 与模块实现契约主轴,不回写文件布局。 |

不得借鉴 governance 的具体业务文件名,例如 `governance_context.rs`、`gate.rs`、`decision.rs`、`approval_responsibility.rs`、`external_grc_adapters.rs`。本仓应使用 method asset、formalization、consumption、trace、relation、external summary、maintenance、package / set 相关命名。

### 3. 文件布局草案分层

`R4.12` 应按以下层次写最终文件树:

| 层次 | 需要写入的内容 | 注意事项 |
|---|---|---|
| workspace root | `Cargo.toml`、`crates/`、`tests/`。 | root 只表达 workspace 和 shared dependencies,不写部署拓扑。 |
| `contracts` | refs、metadata、commands、queries、events、jobs、views、errors、fixtures。 | public surface 只承载 DTO / typed ref / safe marker / summary ref,不写 domain truth。 |
| `domain` | 按八个业务组成部分拆 domain 文件,再加 policies / errors。 | 不恢复 `MethodContent` 总对象,不以 publish / snapshot / fingerprint 命名。 |
| `application` | services、按组成部分划分的 service 文件、ports、unit_of_work、idempotency、errors。 | service 文件只能表明 use case owner,不提前写函数签名。 |
| `infra` | config、runtime_builder、repositories、material / projection store、external adapters、publishers、clock_id、errors。 | 不固定具体 database / queue / HTTP / scheduler 产品。 |
| `api` | command_handlers、query_handlers、routes / RPC placeholder、errors。 | entry boundary 只装配和映射,不直接改 truth。 |
| `worker` | consumers、event candidate publisher、maintenance worker placeholder、errors。 | 不写 outbox relay 旧机制,不把 L0-bus 写成 Cargo dependency。 |
| `jobs` | read material refresh、trace refresh、reference refresh、consistency recovery、maintenance progress、errors。 | Job 不修 core truth,不重做正式化。 |
| `tests` | contract、domain、service、integration、support。 | 只作为 Step 16 测试切口预留,不写具体 test case 名称。 |

### 4. 文件名候选池

以下只是候选池,用于指导 `R4.12` 写入。最终文件树需要在 `R4.12` 再固定。

| 实现单元 | 候选文件类别 | 候选命名方向 |
|---|---|---|
| `contracts` | public refs / metadata / protocol / view / error | `refs.rs`、`metadata.rs`、`commands.rs`、`queries.rs`、`events.rs`、`jobs.rs`、`views.rs`、`errors.rs`、`fixtures.rs` |
| `domain` | 八个组成部分 truth / policy / state-visible object | `method_asset_definition.rs`、`formal_method_version.rs`、`consumption_material.rs`、`trace_audit.rs`、`relation_distribution.rs`、`external_summary.rs`、`maintenance.rs`、`package_set.rs`、`policies.rs`、`errors.rs` |
| `application` | use case service / boundary port / transaction support | `definition_service.rs`、`formalization_service.rs`、`consumption_service.rs`、`trace_service.rs`、`relation_service.rs`、`external_summary_service.rs`、`maintenance_service.rs`、`package_set_service.rs`、`query_service.rs`、`consumer_service.rs`、`job_service.rs`、`ports.rs`、`unit_of_work.rs`、`idempotency.rs`、`errors.rs` |
| `infra` | adapter / store / resolver / runtime | `config.rs`、`runtime_builder.rs`、`repositories.rs`、`material_stores.rs`、`reference_stores.rs`、`external_adapters.rs`、`publishers.rs`、`handoff_adapters.rs`、`clock_id.rs`、`errors.rs` |
| `api` | handler / route boundary | `command_handlers.rs`、`query_handlers.rs`、`routes.rs`、`errors.rs` |
| `worker` | consumer / publisher runner | `consumers.rs`、`event_publishers.rs`、`maintenance_worker.rs`、`errors.rs` |
| `jobs` | operation job runner | `read_material_refresh.rs`、`trace_material_refresh.rs`、`reference_refresh.rs`、`consistency_recovery.rs`、`maintenance_progress.rs`、`errors.rs` |
| `tests` | broad test category support | `contract/*_contract_tests.rs`、`domain/*_tests.rs`、`service/*_flow_tests.rs`、`integration/*_tests.rs`、`support/fixtures.rs`、`support/fakes.rs` |

### 5. 禁止文件名与禁止布局

| 禁止项 | 原因 | `R4.12` 处理 |
|---|---|---|
| `method_content.rs` / `content.rs` 总对象文件 | 旧 `MethodContent` 主线污染,会把 definition、version、consumption、trace 混成一个对象。 | 不写入文件树。 |
| `publish.rs` / `publication.rs` 作为核心正式化文件 | 旧 publish 主线会替代当前 formalization / version 语义。 | 用 formalization / version 命名。 |
| `snapshot.rs` / `fingerprint.rs` 作为正式版本核心 | 旧 snapshot / fingerprint 不是当前正式版本依据。 | 若后续需要 digest / summary,由 Step 6~8 正式闭口后命名。 |
| `outbox.rs` / `outbox_relay.rs` 作为 worker 核心 | 当前 Step 3 / Step 4 不固定 queue / relay 产品和旧 outbox 机制。 | 只允许 event candidate publisher / publisher adapter placeholder。 |
| `utils.rs` / `helper.rs` / `common.rs` / `misc.rs` | 职责模糊,会隐藏 schema、mapper 或 policy 补口。 | 拆成职责明确的 refs、metadata、policies、errors、fixtures 等文件。 |
| `l3_*` / `L3*` / `quantalithos_l3_*` | 架构层级泄漏到实现命名。 | 命名检查必须失败。 |
| sibling repo 目录写入本仓树 | 会把运行期 / event collaboration 伪装成源码依赖。 | 只在 adapter / port / config 后续 Step 表达。 |

### 6. `R4.12` 写入顺序草案

`R4.12` 应分四段写入,单次 patch 控制在合适规模,但最终文件长度不受 300 行限制:

| 顺序 | 写入内容 | 完成判断 |
|---:|---|---|
| 1 | 文件布局树:workspace root、七个 crate 和 tests 顶层。 | 树中每个文件都有一句职责注释。 |
| 2 | 文件职责表:contracts / domain / application。 | 每个文件有路径、所属模块、定义内容、主要责任。 |
| 3 | 文件职责表:infra / api / worker / jobs / tests。 | entry、adapter、job、test support 的边界清晰。 |
| 4 | 命名检查表、禁入检查和 Step 5 进入条件。 | 检查层级泄漏、旧主线泄漏、模糊文件名和外部仓泄漏。 |

### 7. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否只进入 `R4.11` 思考模块 | 是。 |
| 是否基于 `R4.10` 七个实现单元 | 是。 |
| 是否参考 L1-governance 的框架而非领域语义 | 是。 |
| 是否未写最终文件布局树 | 是。 |
| 是否未写最终文件职责表 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 `R4.12` 或 Step 5 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.12 文件布局树与职责:再写入`;只允许写入文件布局树、文件职责表、命名检查表和 Step 5 进入条件,不得直接修改正式 `03-详细设计.md`,不得定义对象字段、trait 方法、DTO schema、flow 步骤或状态矩阵,不得进入 `R4.13` 或 Step 5。

---

## R4.12 文件布局树与职责:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.12 文件布局树与职责:再写入` |
| 上一模块 | `R4.11 文件布局树与职责:先思考` |
| 用户确认 | 已确认进入 `R4.12` |
| 本模块允许写入 | 文件布局树、文件职责表、命名检查表、禁入检查、Step 5 进入条件 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、对象字段、trait 方法、DTO schema、flow 步骤、状态矩阵、数据库 / 队列 / 调度 / HTTP framework 绑定 |
| 下一模块 | `R4.13 历史 Step 4 差异审计:先思考` |

### 2. 文件布局树

```text
quantalithos-method-library/
  Cargo.toml                         # workspace root and shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                       # public contracts exports
        refs.rs                      # typed refs, ids, safe reason refs and shared markers
        metadata.rs                  # command, query, event and job metadata wrappers
        commands.rs                  # Command request / result DTO shells
        queries.rs                   # Query request / response DTO shells
        events.rs                    # inbound summary and outbound event candidate DTO shells
        jobs.rs                      # operations job input / receipt DTO shells
        views.rs                     # read surface, material view and availability view DTO shells
        errors.rs                    # protocol error DTO and public error code shell
        fixtures.rs                  # contract fixtures used by tests
    domain/
      Cargo.toml
      src/
        lib.rs                       # domain exports
        method_asset_definition.rs   # method asset definition and catalog truth owner
        formal_method_version.rs     # formalization state and formal version truth owner
        consumption_material.rs      # controlled consumption material and availability owner
        trace_audit.rs               # trace, impact, audit and evidence lineage owner
        relation_distribution.rs     # relation and distribution semantic owner
        external_summary.rs          # external summary, ref and body boundary owner
        maintenance.rs               # maintenance task, progress and convergence state owner
        package_set.rs               # method package and method set peripheral owner
        policies.rs                  # domain policies, guards and invariants
        errors.rs                    # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                       # application exports
        services.rs                  # service assembly facade
        definition_service.rs        # method definition and catalog command/query use cases
        formalization_service.rs     # formalization and formal version use cases
        consumption_service.rs       # controlled consumption and boundary use cases
        trace_service.rs             # trace, impact, audit and lineage use cases
        relation_service.rs          # relation and distribution use cases
        external_summary_service.rs  # inbound external summary and reference use cases
        maintenance_service.rs       # maintenance request and progress use cases
        package_set_service.rs       # package and method set use cases
        query_service.rs             # read surface orchestration
        consumer_service.rs          # inbound consumer orchestration
        job_service.rs               # operations job orchestration
        ports.rs                     # repository, material, resolver, publisher, handoff, clock and id traits
        unit_of_work.rs              # UnitOfWork trait and transaction handle
        idempotency.rs               # idempotency digest, duplicate / conflict and replay shells
        errors.rs                    # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                       # infra exports
        config.rs                    # runtime config structs and validation shell
        runtime_builder.rs           # repository, adapter and service assembly
        repositories.rs              # fake / durable truth repository adapters
        material_stores.rs           # read material and projection store adapters
        reference_stores.rs          # external ref, artifact ref and availability stores
        external_adapters.rs         # process / identity / runtime / member-images / artifact summary adapters
        publishers.rs                # event candidate publisher adapters
        handoff_adapters.rs          # observability / archive handoff adapters
        clock_id.rs                  # clock and id generator adapters
        errors.rs                    # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                       # api exports
        command_handlers.rs          # Command handler boundary
        query_handlers.rs            # Query handler boundary
        routes.rs                    # route / RPC assembly placeholder
        errors.rs                    # API error mapping
    worker/
      Cargo.toml
      src/
        lib.rs                       # worker exports
        consumers.rs                 # inbound external summary consumers
        event_publishers.rs          # event candidate publisher runner
        maintenance_worker.rs        # maintenance worker assembly placeholder
        errors.rs                    # WorkerError
    jobs/
      Cargo.toml
      src/
        lib.rs                       # jobs exports
        read_material_refresh.rs     # refresh method read materials once
        trace_material_refresh.rs    # refresh trace / impact / audit materials once
        reference_refresh.rs         # refresh external summary / ref availability once
        consistency_recovery.rs      # run convergence check without repairing core truth
        maintenance_progress.rs      # record and expose maintenance progress summary
        errors.rs                    # JobError
  tests/
    contract/
      command_contract_tests.rs      # command DTO shell contract tests
      query_contract_tests.rs        # query DTO and view shell contract tests
      event_contract_tests.rs        # inbound / outbound event shell contract tests
      job_contract_tests.rs          # job input / receipt shell contract tests
    domain/
      policy_tests.rs                # domain policy and guard tests
      state_boundary_tests.rs        # state boundary tests from Step 10
    service/
      command_flow_tests.rs          # application command flow tests
      query_flow_tests.rs            # read orchestration tests
      consumer_flow_tests.rs         # inbound consumer flow tests
      job_flow_tests.rs              # operations job flow tests
    integration/
      core_method_flow_tests.rs      # command + fake infra integration tests
      material_refresh_tests.rs      # read material refresh integration tests
      handoff_tests.rs               # observability / archive handoff integration tests
    support/
      fixtures.rs                    # shared test fixtures
      fakes.rs                       # shared fake adapters
```

### 3. 文件职责表:workspace / contracts / domain / application

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、edition、shared dependencies | 固定 workspace、member 列表和 `core-contracts` path dependency 落点。 |
| `crates/contracts/src/lib.rs` | contracts | public exports | 统一导出 contracts public surface。 |
| `crates/contracts/src/refs.rs` | contracts | typed refs、safe reason refs、shared markers | 提供跨 DTO / view / job 复用的公共引用壳。 |
| `crates/contracts/src/metadata.rs` | contracts | command / query / event / job metadata wrappers | 承载 actor、request、trace、idempotency 等 metadata 壳。 |
| `crates/contracts/src/commands.rs` | contracts | Command request / result DTO shells | 定义同步写入口协议壳,不写 domain truth。 |
| `crates/contracts/src/queries.rs` | contracts | Query request / response DTO shells | 定义只读入口协议壳和 safe absence / unavailable 表达。 |
| `crates/contracts/src/events.rs` | contracts | inbound summary / outbound candidate DTO shells | 定义事件协作协议壳,不表达 L0-bus transport。 |
| `crates/contracts/src/jobs.rs` | contracts | operations job input / receipt DTO shells | 定义 Job public surface,不固定 scheduler / queue。 |
| `crates/contracts/src/views.rs` | contracts | read surface / material view DTO shells | 定义读取材料和可用性视图壳,不得成为第二 truth。 |
| `crates/contracts/src/errors.rs` | contracts | protocol error DTO shell | 定义 public rejection / error code 壳。 |
| `crates/contracts/src/fixtures.rs` | contracts | contract test fixtures | 支撑 Step 16 contract tests,不进入 production truth。 |
| `crates/domain/src/lib.rs` | domain | domain exports | 统一导出 domain object / policy / error。 |
| `crates/domain/src/method_asset_definition.rs` | domain | method asset definition and catalog truth owner | 承载方法资产定义 truth、目录识别和定义边界。 |
| `crates/domain/src/formal_method_version.rs` | domain | formalization state and formal version truth owner | 承载正式化状态、正式版本和版本语义变化。 |
| `crates/domain/src/consumption_material.rs` | domain | controlled consumption material and availability owner | 承载 Definition vs Use 边界、消费材料和可用性判断。 |
| `crates/domain/src/trace_audit.rs` | domain | trace / impact / audit / lineage owner | 承载 body-free 追溯、影响摘要、审计线索和 evidence lineage。 |
| `crates/domain/src/relation_distribution.rs` | domain | relation / distribution semantic owner | 承载方法资产关系、关系完整性和分发语义。 |
| `crates/domain/src/external_summary.rs` | domain | external summary / ref / body boundary owner | 承载外部摘要、typed ref、artifact ref 和正文禁止边界。 |
| `crates/domain/src/maintenance.rs` | domain | maintenance task / progress / convergence owner | 承载维护请求、收敛进度和 freshness 语义,不修 core truth。 |
| `crates/domain/src/package_set.rs` | domain | method package / method set peripheral owner | 承载外围包、方法集和组合规则,不阻塞 core 主链。 |
| `crates/domain/src/policies.rs` | domain | domain policies / guards / invariants | 承载不变量、边界 guard 和 policy 判断。 |
| `crates/domain/src/errors.rs` | domain | DomainError | 表达 domain 层错误,不映射 transport。 |
| `crates/application/src/lib.rs` | application | application exports | 统一导出 service、port、UoW 和 error。 |
| `crates/application/src/services.rs` | application | service assembly facade | 聚合 application service 装配入口。 |
| `crates/application/src/*_service.rs` | application | component use case services | 编排 command、query、consumer、job flow 的 transaction、domain 和 ports。 |
| `crates/application/src/ports.rs` | application | repository / material / resolver / publisher / handoff / clock / id traits | 定义 application 到 infra 的正式边界。 |
| `crates/application/src/unit_of_work.rs` | application | UnitOfWork trait and handle | 定义事务边界壳。 |
| `crates/application/src/idempotency.rs` | application | idempotency digest / duplicate / replay shells | 定义幂等和重放承载面,具体 schema 后续闭口。 |
| `crates/application/src/errors.rs` | application | ApplicationError | 表达 application 层错误和拒绝来源。 |

### 4. 文件职责表:infra / entry / tests

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/infra/src/lib.rs` | infra | infra exports | 统一导出 adapter、runtime builder、config 和 error。 |
| `crates/infra/src/config.rs` | infra | runtime config structs and validation shell | 承载配置绑定壳,正式 key / profile 留给 Step 14 / 04。 |
| `crates/infra/src/runtime_builder.rs` | infra | repository / adapter / service assembly | 组合 fake / durable adapter 和 application service。 |
| `crates/infra/src/repositories.rs` | infra | truth repository adapters | 承接 domain truth store,不固定 database 产品。 |
| `crates/infra/src/material_stores.rs` | infra | read material / projection store adapters | 承接读取材料和 projection store,不得反写 core truth。 |
| `crates/infra/src/reference_stores.rs` | infra | external ref / artifact ref / availability stores | 承接外部引用可用性材料,不保存外部正文。 |
| `crates/infra/src/external_adapters.rs` | infra | runtime consumption adapters | 承接 process、identity、runtime、member-images、artifact 等 summary/ref 读取。 |
| `crates/infra/src/publishers.rs` | infra | event candidate publisher adapters | 承接 outbound candidate 发布边界,不固化 L0-bus transport。 |
| `crates/infra/src/handoff_adapters.rs` | infra | observability / archive handoff adapters | 承接 handoff,失败不得回滚 core truth。 |
| `crates/infra/src/clock_id.rs` | infra | clock and id generator adapters | 提供时间和 ID 生成边界。 |
| `crates/infra/src/errors.rs` | infra | InfraError | 表达 adapter / binding / runtime assembly 错误。 |
| `crates/api/src/*_handlers.rs` | api | command / query handlers | 转换 contracts DTO 与 application service 调用。 |
| `crates/api/src/routes.rs` | api | route / RPC assembly placeholder | 表达入口装配位置,不固定 HTTP / RPC framework。 |
| `crates/api/src/errors.rs` | api | API error mapping | 映射 protocol / application error 到入口错误壳。 |
| `crates/worker/src/consumers.rs` | worker | inbound external summary consumers | 承接外部摘要与引用 inbound owner。 |
| `crates/worker/src/event_publishers.rs` | worker | event candidate publisher runner | 触发 publisher adapter,不表达旧 outbox relay。 |
| `crates/worker/src/maintenance_worker.rs` | worker | maintenance worker assembly placeholder | 装配后台循环边界,不固定 scheduler / queue。 |
| `crates/worker/src/errors.rs` | worker | WorkerError | 表达 worker runner 错误。 |
| `crates/jobs/src/read_material_refresh.rs` | jobs | read material refresh runner | 刷新读取材料,不修 core truth。 |
| `crates/jobs/src/trace_material_refresh.rs` | jobs | trace / impact / audit material refresh runner | 刷新追溯材料和影响摘要。 |
| `crates/jobs/src/reference_refresh.rs` | jobs | external reference refresh runner | 刷新外部摘要 / ref 可用性。 |
| `crates/jobs/src/consistency_recovery.rs` | jobs | convergence check runner | 执行一致性收敛检查,不自动修复 core truth。 |
| `crates/jobs/src/maintenance_progress.rs` | jobs | maintenance progress runner | 记录维护进度和 safe summary。 |
| `crates/jobs/src/errors.rs` | jobs | JobError | 表达 job runner 错误。 |
| `tests/contract/*_contract_tests.rs` | tests | contract tests | 承接 Step 16 contract test cut。 |
| `tests/domain/*_tests.rs` | tests | domain tests | 承接 Step 10 state / policy test cut。 |
| `tests/service/*_flow_tests.rs` | tests | application service flow tests | 承接 Step 9 function flow test cut。 |
| `tests/integration/*_tests.rs` | tests | fake infra integration tests | 验证 entry + application + fake infra 集成。 |
| `tests/support/fixtures.rs` | tests | shared fixtures | 提供测试夹具。 |
| `tests/support/fakes.rs` | tests | shared fake adapters | 提供测试 fake adapter。 |

### 5. 命名检查表

| 检查项 | 通过条件 | 当前结果 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-method-library` | pass |
| project slug | `method-library` | pass |
| workspace member 目录 | `crates/<role>`,role 不含 `method_library_` / `l3_` / `quantalithos` 前缀 | pass |
| Cargo package | `method-library-<role>` | pass |
| Rust library crate | `method_library_<role>` | pass |
| binary 名 | `method-library-api`、`method-library-worker` 或具体 job action name | pass |
| 架构层级泄漏 | 实现命名中不出现 `L0` / `L1` / `L2` / `L3` / `l0_` / `l1_` / `l2_` / `l3_` | pass |
| 旧主线泄漏 | 不出现 `MethodContent`、`publish`、`snapshot`、`fingerprint`、`outbox_relay` 作为当前正向文件主线 | pass |
| 模糊文件名 | 不出现 `utils.rs`、`helper.rs`、`common.rs`、`misc.rs` | pass |
| 外部仓泄漏 | 不把 process / identity / runtime / member-images / bus / observability repo 文件写入本仓文件树 | pass |
| Cargo 外部依赖 | 只有 `core-contracts` 是 compile dependency candidate | pass |

### 6. 禁入检查表

| 禁入内容 | 当前处理 | 后续如需恢复的条件 |
|---|---|---|
| 旧 `MethodContent` 总聚合 | 不进入当前文件布局。 | 必须由当前 Step 6 对象契约重新命名、重新拆分、重新闭口。 |
| 旧 publish / publication 主线 | 不进入当前文件布局。 | 必须由 formalization / formal version 语义重新闭口。 |
| 旧 snapshot / fingerprint 主线 | 不进入当前文件布局。 | 只能在后续 digest / summary / material 契约正式需要时重新定义。 |
| 旧 outbox relay / delivery worker | 不进入当前文件布局。 | 只能由 Step 7/8 publisher / event candidate / handoff 契约重新闭口。 |
| PostgreSQL / queue / scheduler / HTTP 产品文件 | 不进入当前文件布局。 | 由 Step 14 / 04 配置设计和实施计划选择具体 adapter。 |
| 下游运行 truth / 外部正文 store | 不进入当前文件布局。 | 当前范围禁止,不能通过后续 Step 补成 truth owner。 |

### 7. Step 5 进入条件

| 条件 | 结果 |
|---|---|
| 已固定 workspace 多 crate 布局 | pass |
| 已固定七个实现单元与 member / package / crate / binary 命名 | pass |
| 已固定文件布局树 | pass |
| 已固定文件职责表 | pass |
| 已完成命名检查和禁入检查 | pass |
| 已确认正式 `03-详细设计.md` 尚不回填 | pass |
| Step 5 只允许收口 crate dependency matrix 和模块实现契约主轴 | pass |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否已写文件布局树 | pass |
| 是否已写文件职责表 | pass |
| 是否已写命名检查表 | pass |
| 是否已写禁入检查表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未定义对象字段、trait 方法、DTO schema、flow 步骤或状态矩阵 | pass |
| 是否未进入 `R4.13` 或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.13 历史 Step 4 差异审计:先思考`;只允许形成旧文件布局污染扫描计划,不得直接修改正式 `03-详细设计.md`,不得反推当前文件布局结论,不得进入 `R4.14` 或 Step 5。

---

## R4.13 历史 Step 4 差异审计:先思考

### 1. 本模块处理边界

| 项目 | 判断 |
|---|---|
| 当前模块 | `R4.13 历史 Step 4 差异审计:先思考` |
| 上一模块输入 | `R4.12` 已固定当前文件布局树、文件职责表、命名检查表、禁入检查表和 Step 5 进入条件。 |
| 本模块允许 | 形成旧文件布局污染扫描计划、扫描对象清单、污染类别、判断规则和 `R4.14` 写入模板。 |
| 本模块禁止 | 写最终禁入 / 后移 / 重定义表、修改正式 `03-详细设计.md`、把旧实现仓反推为当前布局、进入 Step 5。 |
| 下一模块 | `R4.14 历史 Step 4 差异审计:再写入` |

本模块只回答“下一步要如何审计旧 Step 4 / 旧正式 03 / 现有实现仓”。它不直接判定每个旧文件的最终归属,也不把旧文件存在事实变成当前设计事实。

### 2. 扫描对象清单

| 扫描对象 | 当前定位 | 扫描目的 |
|---|---|---|
| 旧正式 `projects/L3-method-library/03-详细设计.md` | historical_material | 识别旧 §4 及全篇中仍可能污染文件布局的 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway 线索。 |
| 当前 Step 4 已写 `R4.1`~`R4.12` | current_calibration | 作为当前布局基线,用于判断旧内容是否冲突。 |
| 现有实现仓 `/home/aris/Projects/quantalithos-method-library` | historical_implementation_material | 扫描真实文件树、Cargo workspace、package 命名、旧模块名、旧测试和报告。 |
| 现有实现仓 `Cargo.toml` / member `Cargo.toml` | historical_implementation_material | 识别旧 `method_library_*` member、underscore package、`sqlx` / PostgreSQL 等具体产品绑定。 |
| 现有实现仓 `crates/**/src/**` | historical_implementation_material | 识别旧 content aggregate、snapshot、fingerprint、outbox relay、gateway extractors 等文件。 |
| 现有实现仓 `reports/**` / `tests/**` | historical_evidence_material | 识别旧 P0 acceptance / EV evidence / test naming 是否会污染后续测试切口。 |

### 3. 污染类别草案

| 类别 | 识别信号 | 风险 |
|---|---|---|
| 旧 workspace 命名 | `crates/method_library_*`、`method_library_*` package | 与 `R4.6` / `R4.10` 固定的 `crates/<role>`、`method-library-<role>` 不一致。 |
| 旧 P0 / P1 范围 | `P0`、`P1`、feature flag、plugin / configuration | 会把旧阶段范围误带入本轮 full-restart。 |
| 旧 `MethodContent` 总对象 | `MethodContent`、`content/aggregate.rs`、`domain::content` | 会把 definition、formalization、consumption、trace 等当前八组件混成总聚合。 |
| 旧 publish 生命周期 | `publish`、`published`、`publication` | 会用 publish 替代当前 formalization / formal version 语义。 |
| 旧 snapshot / fingerprint | `snapshots.rs`、`fingerprint.rs`、canonical fingerprint | 会把旧同步物料和校验算法误当作正式版本依据。 |
| 旧 outbox / delivery | `outbox`、`outbox_relay`、delivery、bus topic | 会把事件协作和 relay 产品机制提前固化到 Step 4。 |
| 具体产品绑定 | `sqlx`、`postgres`、`migrations/*.sql`、HTTP gateway | 违反 Step 3 不提前锁定 database / queue / scheduler / HTTP framework 的约束。 |
| 外部正文 / 下游 truth | blob、object storage、gateway auth、downstream sync truth | 可能突破本仓不保存外部正文和下游运行 truth 的边界。 |
| 旧 evidence / reports | EV-xxx、P0 acceptance、veto checklist | 会把旧测试方案和验收口径误带入后续 Step 16 / 05。 |

### 4. 判断规则

| 判断问题 | 处理规则 |
|---|---|
| 旧内容是否与当前 `00/01/02` 和 `R4.8`~`R4.12` 一致? | 一致也不能直接继承,必须以当前 Step 产物重新表达。 |
| 旧内容是否只是命名旧、职责可保留? | 标记为 `rename_or_redefine_candidate`,留给 `R4.14` 判定后移或重定义。 |
| 旧内容是否引入具体产品绑定? | 默认标记为 `postpone_to_config_or_implementation`,不得进入 Step 4 当前布局。 |
| 旧内容是否改变 truth owner 或数据所有权? | 标记为 `forbidden_by_current_scope`,不得通过文件布局恢复。 |
| 旧内容是否属于对象字段、trait 方法、DTO schema、flow 或 state? | 后移到对应 Step 6~10;Step 4 只记录布局污染。 |
| 旧内容是否属于测试 evidence / acceptance? | 后移到 Step 16 / `05-测试方案.md` / `06-验收标准.md`,不得用于当前布局闭口。 |

### 5. `R4.14` 写入模板

`R4.14` 应写入正式审计表,但仍不得修改正式 `03-详细设计.md`。

| 表格 | 字段 | 用途 |
|---|---|---|
| 历史布局污染清单 | 旧位置 / 旧内容 / 污染类别 / 与当前基线冲突 / 处理结论 | 逐项关闭旧 Step 4 completed 污染。 |
| 禁入表 | 禁入内容 / 禁入原因 / 后续若需恢复的唯一入口 | 明确不能进入当前 Step 4 的内容。 |
| 后移表 | 旧内容 / 后移到哪个 Step / 后移原因 / 当前不得写入什么 | 防止把 schema、port、flow、state 提前写进布局。 |
| 重定义候选表 | 旧内容 / 可保留事实 / 必须重新命名或重新闭口的内容 | 只保留可能有价值的事实,不继承旧表达。 |
| 当前布局保护表 | 当前 `R4.12` 文件 / 被保护的边界 / 拒绝的旧替代项 | 防止后续 Step 回流旧文件名。 |

### 6. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否只形成扫描计划 | 是。 |
| 是否未写最终审计结论 | 是。 |
| 是否未把旧实现仓反推为当前布局 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未进入 `R4.14` 或 Step 5 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.14 历史 Step 4 差异审计:再写入`;只允许写入历史布局污染清单、禁入表、后移表、重定义候选表和当前布局保护表,不得直接修改正式 `03-详细设计.md`,不得恢复旧 Step 4 completed 状态,不得进入 `R4.15` 或 Step 5。

---

## R4.14 历史 Step 4 差异审计:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.14 历史 Step 4 差异审计:再写入` |
| 上一模块 | `R4.13 历史 Step 4 差异审计:先思考` |
| 用户确认 | 已确认进入 `R4.14` |
| 本模块允许写入 | 历史布局污染清单、禁入表、后移表、重定义候选表和当前布局保护表 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、当前文件布局反向改写、旧 Step 4 completed 状态恢复、Step 5 内容 |
| 下一模块 | `R4.15 回填草稿:先思考` |

### 2. 历史布局污染清单

| 旧位置 | 旧内容 | 污染类别 | 与当前基线冲突 | 处理结论 |
|---|---|---|---|---|
| 旧正式 `03-详细设计.md` 全篇 | P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、gateway、PostgreSQL 等主线 | 旧正向主线 | 与当前 `00/01/02` 八组件和 `R4.12` 文件布局不一致。 | historical_material;不得作为当前 Step 4 真相源。 |
| `/home/aris/Projects/quantalithos-method-library/Cargo.toml` | `crates/method_library_*` member、underscore package、`sqlx` / postgres workspace dependency | 旧 workspace 命名 / 具体产品绑定 | 与 `crates/<role>`、`method-library-<role>`、不提前锁定 database 冲突。 | 禁止继承;仅作实现仓差异审计输入。 |
| `/home/aris/Projects/quantalithos-method-library/README.md` | L3 P0 implementation、snapshot、PostgreSQL、bus、gateway、outbox relay 描述 | 旧 P0 / 产品绑定 | 与 full-restart 当前范围和 Step 3 runtime 约束冲突。 | 禁止作为当前布局说明来源。 |
| `crates/method_library_contracts/src/snapshots.rs` | snapshot DTO / export surface | 旧 snapshot 主线 | 当前 `contracts/views.rs` 只预留 read material view 壳,不恢复 snapshot 作为正式版本核心。 | 后移到 Step 6~8 如需 digest / material schema 时重定义。 |
| `crates/method_library_domain/src/content/*` | `MethodContent` aggregate、lifecycle、version、kind、reference、fingerprint | 旧 `MethodContent` 总对象 / publish 生命周期 | 与当前八组件 domain 文件拆分冲突。 | 禁入当前布局;对象如有价值须 Step 6 重新命名拆分。 |
| `crates/method_library_domain/src/policies/mod.rs` | publish precondition、canonical fingerprint、published reference policy | 旧 publish / fingerprint policy | 以 publish / fingerprint 替代 formalization / formal version / controlled consumption。 | 后移到 Step 6 policy 重定义,不得继承命名。 |
| `crates/method_library_application/src/services.rs` | `MethodContentCommandService`、create / update / submit / publish / deprecate / retire / supersede flows | 旧 command flow | 与当前 Step 5~9 按八组件重建 service / flow 冲突。 | 后移到 Step 5~9 重定义。 |
| `crates/method_library_application/src/sync_services.rs` | outbox relay service、topic、claim、publish、dead letter | 旧 outbox relay / delivery | 与 `R4.12` event candidate publisher 和 Step 3 不固化 L0-bus transport 冲突。 | 禁入当前布局;事件协作后续 Step 7/8/14 重审。 |
| `crates/method_library_application/src/query_services.rs` | old query / snapshot / projection read service | 旧 query surface / snapshot read | 当前 query surface 必须由 Step 8 协议和 Step 9 flow 重新闭口。 | 后移到 Step 8~9。 |
| `crates/method_library_application/src/operations_services.rs` | seed、rebuild、recalculate fingerprint、replay / recovery job | 旧 operations job | 与当前 Job 不修 core truth、不恢复 fingerprint 主线冲突。 | 后移到 Step 8~10/14/16 重定义。 |
| `crates/method_library_infra/src/persistence/postgres.rs` 和 `migrations/*.sql` | PostgreSQL repository / DDL | 具体产品绑定 | Step 3 已禁止提前锁定 database 产品。 | Step 4 禁入;持久化语义后移 Step 11,产品选择后移 Step 14 / 04 / 实施计划。 |
| `crates/method_library_api/src/extractors.rs` | gateway trusted headers / actor extraction | gateway / auth 边界 | 本仓不实现 auth / gateway,只承接 actor safe context。 | Step 4 禁入;后续如需入口 metadata,由 Step 8 / Step 14 重定义。 |
| `crates/method_library_worker/src/outbox_relay.rs` 和 `src/bin/outbox_relay.rs` | outbox relay worker / binary | 旧 outbox relay / binary | 与 `worker/event_publishers.rs` runner placeholder 和不固化 relay 机制冲突。 | 禁止继承 binary 名和 worker 主线。 |
| `crates/method_library_worker/src/operations_job.rs` | fingerprint recalculation / seed operations | 旧 fingerprint / P0 job | 与当前 maintenance / material refresh / convergence job 语义不一致。 | 后移到 jobs 重定义;不得继承 fingerprint job 名。 |
| `reports/method-library/**` | EV evidence、P0 acceptance、veto checklist、PostgreSQL benchmark | 旧 evidence / acceptance | 后续测试证据应由 Step 16、`05`、`06`、`07` 重新闭口。 | Step 4 不使用;后移测试方案审计。 |

### 3. 禁入表

| 禁入内容 | 禁入原因 | 后续若需恢复的唯一入口 |
|---|---|---|
| `MethodContent` / `domain::content` 总对象 | 会把 definition、formalization、consumption、trace、relation、external、maintenance、peripheral 混为一个聚合。 | Step 6 按八组件重新定义对象。 |
| publish / published / publication 作为核心文件主线 | 会用发布动作替代 formalization / formal version 语义。 | Step 6~9 以 formalization / formal version 重新闭口。 |
| snapshot / fingerprint 作为正式版本核心 | 旧同步物料与校验算法不能替代正式版本、summary、digest 或 material contract。 | Step 6~8 若需要 digest / material,重新定义 schema 和来源。 |
| outbox relay / delivery worker | 会把 event collaboration、bus topic、claim / lease / dead letter 机制提前固化。 | Step 7 port、Step 8 event contract、Step 14 transport binding、实施计划。 |
| `method_library_*` workspace member / Cargo package | 不符合 `crates/<role>`、`method-library-<role>`、`method_library_<role>` 命名规则。 | 不恢复;实施仓如迁移需按 `R4.12` 新布局。 |
| PostgreSQL / sqlx / migrations 作为 Step 4 文件布局结论 | Step 3 禁止提前锁定 database 产品。 | Step 11 定义持久化契约;Step 14 / 04 / 实施计划绑定产品。 |
| gateway trusted header / auth extractor 作为本仓主体模块 | 本仓不实现 auth / gateway。 | Step 8 metadata / rejection,Step 14 config,入口 adapter 后续闭口。 |
| P0 / P1 作为当前详细设计范围标签 | 本轮 full-restart 已按当前 `00/01/02` 和八组件重建。 | 不恢复;范围只从当前 Step 2 / 02 承接。 |
| 旧 EV / acceptance / veto checklist 作为当前验收依据 | 旧证据对应旧主线和旧测试切口。 | Step 16、`05-测试方案.md`、`06-验收标准.md` 重新定义。 |

### 4. 后移表

| 旧内容 | 后移到哪个 Step | 后移原因 | 当前不得写入什么 |
|---|---|---|---|
| command / query / event / job DTO 字段 | Step 8 | Step 4 只定文件承载面,不定协议 schema。 | 不写 request / result / rejection 字段。 |
| domain aggregate 字段和 lifecycle 状态 | Step 6 / Step 10 | 对象契约和状态矩阵需要按八组件重新推导。 | 不写 `MethodContentLifecycle` 或旧状态。 |
| repository trait、publisher trait、resolver trait | Step 7 | port 方法和 adapter 边界需要从对象和协议反推。 | 不写具体 trait 方法签名。 |
| publish / supersede / retire 等旧 flow | Step 9 | flow 要按 current Command / Query / Consumer / Job 重新定义。 | 不写旧 flow 步骤。 |
| outbox claim / lease / dead letter | Step 7 / Step 8 / Step 13 / Step 14 | 需要先确认 event candidate、idempotency、transport binding。 | 不写 worker relay 机制。 |
| PostgreSQL DDL / sqlx migration | Step 11 / Step 14 / 04 | 持久化契约与产品绑定分开。 | 不写 `migrations/*.sql` 或 postgres 文件。 |
| gateway header / API framework | Step 8 / Step 14 / 04 | 入口 protocol 与部署配置需后续闭口。 | 不写 gateway extractor 文件为主体模块。 |
| historical reports / evidence | Step 16 / 05 / 06 / 07 | 测试与验收证据必须与新契约对应。 | 不引用旧 EV 编号作为当前通过依据。 |

### 5. 重定义候选表

| 旧内容 | 可保留事实 | 必须重新命名或重新闭口的内容 |
|---|---|---|
| content definition / catalog 概念 | 本仓拥有方法资产定义 truth 和目录识别。 | 重新拆为 `method_asset_definition.rs` 和 catalog / boundary 对象,不得使用 `MethodContent` 总对象。 |
| version / lifecycle 概念 | 正式版本和状态变化需要表达。 | 用 formalization / formal version / state matrix 重定义,不得沿用 publish lifecycle。 |
| reference validation | 方法资产关系和外部引用需要安全边界。 | 按 relation / distribution / external summary 重新定义对象、port、flow。 |
| read projection / query view | 读取材料和可用性视图需要存在。 | 使用 `views.rs`、`material_stores.rs`、query service 重新闭口,不得继承 snapshot query。 |
| audit / trace | 追溯和审计线索需要存在。 | 归入 `trace_audit.rs`、trace service 和 observability handoff,不保存 raw log / report body。 |
| event publication | 本仓可能需要 outbound event candidate。 | 只保留 publisher / event candidate 占位,topic、bus、relay 后续闭口。 |
| operations maintenance | 维护和收敛需要存在。 | 归入 `maintenance.rs`、`job_service.rs`、`jobs/*`,不得恢复 seed / fingerprint recalculation 主线。 |
| idempotency / replay | 写路径和 job 需要幂等保护。 | Step 13 正式定义 digest、stored result、replay 语义。 |

### 6. 当前布局保护表

| 当前 `R4.12` 文件 / 区域 | 被保护的边界 | 拒绝的旧替代项 |
|---|---|---|
| `crates/contracts/src/views.rs` | read surface / material view DTO 壳 | `snapshots.rs` 作为正式读取核心。 |
| `crates/domain/src/method_asset_definition.rs` | definition / catalog truth owner | `content/aggregate.rs` / `MethodContent` 总聚合。 |
| `crates/domain/src/formal_method_version.rs` | formalization / formal version owner | publish lifecycle / published metadata。 |
| `crates/domain/src/consumption_material.rs` | Definition vs Use / controlled consumption | downstream sync truth / snapshot export truth。 |
| `crates/domain/src/trace_audit.rs` | trace / impact / audit / lineage | raw log、report body、old audit tied to publish only。 |
| `crates/domain/src/relation_distribution.rs` | relation / distribution semantics | runtime dependency graph / marketplace transaction。 |
| `crates/domain/src/external_summary.rs` | external summary / ref / body boundary | external body / artifact payload store。 |
| `crates/application/src/*_service.rs` | use case owner by eight components | monolithic `MethodContentCommandService`。 |
| `crates/application/src/ports.rs` | formal port boundary | ad hoc postgres / bus / gateway implementation leakage。 |
| `crates/infra/src/repositories.rs` | product-neutral repository adapter | `persistence/postgres.rs` as Step 4 truth。 |
| `crates/worker/src/event_publishers.rs` | event candidate runner placeholder | `outbox_relay.rs` binary / relay mechanism。 |
| `crates/jobs/src/*` | maintenance / refresh / convergence jobs | seed P0 assets / recalculate fingerprint job as current core。 |
| `tests/**` | future Step 16 test cut placeholders | old EV / P0 acceptance reports as current gate。 |

### 7. 审计结论

| 结论 | 说明 |
|---|---|
| 旧 Step 4 completed 状态 | 关闭。不得继承。 |
| 旧正式 `03-详细设计.md` §4 / 全篇布局口径 | 降级为 historical_material,仅用于污染审计。 |
| 现有实现仓文件树 | 降级为 historical_implementation_material,不得作为当前布局来源。 |
| 当前 Step 4 布局基线 | 以 `R4.8`~`R4.12` 为准。 |
| 是否阻塞进入回填草稿思考 | 不阻塞。可以进入 `R4.15 回填草稿:先思考`。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否已写历史布局污染清单 | pass |
| 是否已写禁入表 | pass |
| 是否已写后移表 | pass |
| 是否已写重定义候选表 | pass |
| 是否已写当前布局保护表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.15` 或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.15 回填草稿:先思考`;只允许思考正式 `03-详细设计.md` §4 回填策略、回填结构和不回填项,不得直接修改正式 `03-详细设计.md`,不得进入 `R4.16` 或 Step 5。

---

## R4.15 回填草稿:先思考

### 1. 本模块处理边界

| 项目 | 判断 |
|---|---|
| 当前模块 | `R4.15 回填草稿:先思考` |
| 上一模块输入 | `R4.14` 已关闭旧 Step 4 completed 污染,确认当前布局基线以 `R4.8`~`R4.12` 为准。 |
| 本模块允许 | 思考正式 `03-详细设计.md` §4 回填策略、回填结构、取舍规则、不回填项和 `R4.16` 草稿写入顺序。 |
| 本模块禁止 | 直接修改正式 `03-详细设计.md`、写完整正式 §4 草稿、进入 `R4.16`、进入 Step 5。 |
| 下一模块 | `R4.16 回填草稿:再写入` |

### 2. 正式 §4 当前问题

当前正式 `03-详细设计.md` §4 仍是旧材料,标题为“实现单元与文件布局”,但正文围绕旧 P0 workspace / crate 文件树、`method_library_*` 命名、`MethodContent`、snapshot、outbox、gateway、PostgreSQL 等主线展开。它不应被直接修补,而应由本轮 Step 4 中间产物重新装配成新的 §4 草稿。

| 问题 | 回填处理 |
|---|---|
| §4 仍使用旧 P0 / P1 语言 | 改为 full-restart 当前八组件和 workspace 多 crate 口径。 |
| §4 仍使用旧 member / package 命名 | 改为 `crates/<role>`、`method-library-<role>`、`method_library_<role>`。 |
| §4 文件树包含旧 `MethodContent` / snapshot / outbox / PostgreSQL / gateway | 移除为正向结论;如需说明,只放入历史材料处理或边界说明。 |
| §4 缺当前依赖落点和非 Cargo 依赖排除 | 回填 `core-contracts` compile dependency candidate 和非 Cargo 依赖排除表。 |
| §4 缺文件职责表 / 命名检查表 | 回填 `R4.12` 的文件职责、命名检查和 Step 5 进入条件摘要。 |

### 3. 回填结构草案

`R4.16` 应写入中间产物草稿,不是直接覆盖正式 `03-详细设计.md`。草稿结构建议如下:

| 正式 §4 小节 | 来源模块 | 回填内容 |
|---|---|---|
| `4.1 布局形态决策` | `R4.8` | 单 crate、workspace 多 crate、业务组成部分拆 crate等取舍。 |
| `4.2 实现单元总表` | `R4.10` | 七个实现单元:contracts、domain、application、infra、api、worker、jobs。 |
| `4.3 目录 / Package / Crate / Binary 映射表` | `R4.10` | member 目录、Cargo package、Rust crate / binary、职责和对外暴露。 |
| `4.4 文件布局树` | `R4.12` | `quantalithos-method-library/` workspace、七 crate、tests 文件树。 |
| `4.5 文件职责表` | `R4.12` | workspace / contracts / domain / application / infra / api / worker / jobs / tests 职责表。 |
| `4.6 编译期依赖与非 Cargo 依赖排除` | `R4.10` | `core-contracts` 落点和 L0-bus / process / identity / runtime / member-images / observability 排除。 |
| `4.7 命名检查与禁入项` | `R4.12` / `R4.14` | 命名检查、旧主线禁入、旧实现仓 historical_material 处理。 |
| `4.8 Step 5 进入条件` | `R4.12` / `R4.14` | 可进入 Step 5,但若 Step 6~8 发现布局不足须回到 Step 4 修正。 |

### 4. 回填压缩策略

中间产物已经较长,正式 §4 不应逐字复制所有审计表。`R4.16` 草稿应采用“主体完整、审计摘要”的方式:

| 内容类型 | 回填粒度 |
|---|---|
| 布局形态 / 实现单元 / 目录映射 | 完整回填。 |
| 文件布局树 | 完整回填,因为实现者需要可创建路径。 |
| 文件职责表 | 可完整回填,但如篇幅过长,允许按模块分两张表。 |
| 依赖落点 / 非 Cargo 排除 | 完整回填。 |
| 命名检查 | 摘要回填。 |
| 历史污染审计 | 摘要回填,列禁入主线和 historical_material 定位,不复制全部长表。 |
| Step 5 进入条件 | 摘要回填。 |

### 5. 不回填项

| 不回填内容 | 原因 | 后续位置 |
|---|---|---|
| 对象字段 / enum 值 / value object schema | Step 4 只定义文件承载面。 | Step 6 |
| trait 方法签名 / repository 方法 / adapter 方法 | Step 4 不定义 port。 | Step 7 |
| Command / Query / Event / Job DTO 字段 | Step 4 不定义 protocol schema。 | Step 8 |
| 函数级处理流和 side effect 顺序 | Step 4 不定义 flow。 | Step 9 |
| 状态机和状态迁移矩阵 | Step 4 不定义 state matrix。 | Step 10 |
| DDL、PostgreSQL、queue、scheduler、HTTP framework | Step 3 禁止提前锁定具体产品。 | Step 11 / Step 14 / 04 / 实施计划 |
| 测试 case、EV evidence、acceptance gate | Step 4 不定义测试方案或验收。 | Step 16 / 05 / 06 / 07 |

### 6. `R4.16` 写入顺序草案

| 顺序 | 写入内容 | 规模控制 |
|---:|---|---|
| 1 | §4 草稿开头、布局形态决策、实现单元总表、目录映射表。 | 第一批写入。 |
| 2 | 文件布局树。 | 第二批写入,保持树完整。 |
| 3 | 文件职责表。 | 第三批写入,按模块分表。 |
| 4 | 依赖落点、非 Cargo 排除、命名检查、禁入摘要、Step 5 进入条件。 | 第四批写入。 |

`R4.16` 仍只写当前中间产物文件中的草稿区,不得直接修改正式 `03-详细设计.md`。

### 7. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否只思考回填策略 | 是。 |
| 是否未修改正式 `03-详细设计.md` | 是。 |
| 是否未写完整 §4 草稿 | 是。 |
| 是否明确不回填项 | 是。 |
| 是否未进入 `R4.16` 或 Step 5 | 是。 |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.16 回填草稿:再写入`;只允许在当前中间产物中写入正式 `03-详细设计.md` §4 回填草稿,不得直接修改正式 `03-详细设计.md`,不得进入 `R4.17` 或 Step 5。

---

## R4.16 回填草稿:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.16 回填草稿:再写入` |
| 上一模块 | `R4.15 回填草稿:先思考` |
| 用户确认 | 已确认进入 `R4.16` |
| 本模块允许写入 | 正式 `03-详细设计.md` §4 的中间产物草稿 |
| 本模块禁止写入 | 直接修改正式 `03-详细设计.md`、进入 Step 5、定义对象字段 / trait 方法 / DTO schema / flow / state matrix |
| 下一模块 | `R4.17 自检与停审:先思考` |

本模块只在当前 Step 4 中间产物内生成正式 §4 回填草稿。正式 `projects/L3-method-library/03-详细设计.md` 仍保持不变,后续必须经过用户确认和正式装配门禁后才能写入。

### 2. 正式 §4 回填草稿

以下草稿用于后续装配到正式 `03-详细设计.md` §4。

## 4. 实现单元与文件布局

本节把当前 `02-概要设计.md` 的代码主体框架和八个主要组成部分落到目标实现仓、workspace member、Cargo package、Rust crate / binary 和文件路径。当前结论以本轮 full-restart 的 `00/01/02`、Step 3 运行约束和本 Step 4 中间产物为准;旧 `MethodContent`、publish、snapshot、fingerprint、outbox relay、PostgreSQL、gateway、P0 / P1 等旧主线只作为 historical material,不得作为当前正向布局来源。

### 4.1 布局形态决策

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 内部模块分层 | 不采用 | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的 public contract、domain truth、application orchestration、infra adapter 和 entry assembly 边界较多,单 crate 容易隐藏依赖方向。 | 不作为当前实现仓主布局。 |
| workspace 多 crate | 采用 | 能把 public contracts、domain truth、application port / service、infra adapter、api / worker / jobs entry 分开,并与 Step 3 的 compile dependency 和运行期依赖排除规则一致。 | 目标实现仓采用 `crates/<role>` workspace member。 |
| 按八个业务组成部分各拆 crate | 不采用 | 八个组成部分是业务职责主线,不是工程依赖边界;机械拆 crate 会造成重复 contracts、ports 和 adapter。 | 八组件映射到七个工程 role,在后续 Step 5~9 展开。 |
| 单独 config / observability crate | 不采用 | Step 3 禁止提前锁定部署和观测产品;config 与 handoff 先放在 infra / application 边界。 | 具体配置 key、observability handoff 后移 Step 14 / Step 15 / `04`。 |

### 4.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 承载 Command / Query / Inbound / Outbound / Job public DTO、typed ref、summary ref、safe marker、protocol error 和公共 view surface。 | §7 API / 接口骨架;§8 处理流;§12 详细设计承接 |
| `domain` | library crate | 承载方法资产定义 truth、正式化与版本、受控消费、追溯与一致性保护、关系与分发、外部摘要、维护状态、外围组织的 domain object、policy、guard、invariant 和 domain error。 | §5 主要组成部分;§6 关键对象;§9 状态 |
| `application` | library crate | 承载 application service、Command / Query / Consumer / Job orchestration、port trait、UoW、idempotency、boundary / visibility coordination 和 application error。 | §4 实现分层;§7 API / 接口骨架;§8 处理流 |
| `infra` | library crate | 承载 repository / projection / material store adapter、external adapter、publisher adapter、runtime builder、config binding、clock / id / fake adapter 和 infra error。 | §4 实现分层;§11 配置影响;§12 承接清单 |
| `api` | entry crate / binary-capable crate | 承载 Command / Query 同步入口 assembly、handler boundary 和 transport-neutral route / RPC placeholder。 | §7 Command / Query;§8 Command / Query flow |
| `worker` | entry crate / binary-capable crate | 承载 Inbound Consumer runner、event candidate publisher runner 和 background loop assembly;不表达 outbox relay 机制。 | §7 Inbound Consumer / Outbound Event;§8 Inbound / Event boundary |
| `jobs` | entry crate / binary-capable crate | 承载 Operations Job runner、read material refresh、trace refresh、recovery convergence、maintenance progress 执行入口。 | §7 Operations Job;§8 Job flow;§10 maintenance / recovery |

### 4.3 目录 / Package / Crate / Binary 映射表

目标实现仓为 `/home/aris/Projects/quantalithos-method-library`,project slug 为 `method-library`。workspace member 目录使用 `crates/<role>`,Cargo package 使用 `method-library-<role>`,Rust library crate 使用 `method_library_<role>`。

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `method-library-contracts` | `method_library_contracts` | 公共 contracts、typed refs、safe summary / marker、public view / error surface | 是 |
| `crates/domain` | library crate | `method-library-domain` | `method_library_domain` | domain truth、state、policy、guard、invariant、domain error | 否 |
| `crates/application` | library crate | `method-library-application` | `method_library_application` | application services、port traits、UoW、idempotency、query / consumer / job orchestration | 否 |
| `crates/infra` | library crate | `method-library-infra` | `method_library_infra` | repository / adapter / publisher / external binding / config / runtime builder / fakes | 否 |
| `crates/api` | library crate 或 binary-capable package | `method-library-api` | `method_library_api` / `method-library-api` | Command / Query inbound assembly and handlers | 否 |
| `crates/worker` | library crate 或 binary-capable package | `method-library-worker` | `method_library_worker` / `method-library-worker` | Inbound consumer and event candidate publisher runner assembly | 否 |
| `crates/jobs` | library crate 或 binary-capable package | `method-library-jobs` | `method_library_jobs` / job action binaries | Operations Job runner assembly | 否 |

### 4.4 文件布局树

```text
quantalithos-method-library/
  Cargo.toml                         # workspace root and shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                       # public contracts exports
        refs.rs                      # typed refs, ids, safe reason refs and shared markers
        metadata.rs                  # command, query, event and job metadata wrappers
        commands.rs                  # Command request / result DTO shells
        queries.rs                   # Query request / response DTO shells
        events.rs                    # inbound summary and outbound event candidate DTO shells
        jobs.rs                      # operations job input / receipt DTO shells
        views.rs                     # read surface, material view and availability view DTO shells
        errors.rs                    # protocol error DTO and public error code shell
        fixtures.rs                  # contract fixtures used by tests
    domain/
      Cargo.toml
      src/
        lib.rs                       # domain exports
        method_asset_definition.rs   # method asset definition and catalog truth owner
        formal_method_version.rs     # formalization state and formal version truth owner
        consumption_material.rs      # controlled consumption material and availability owner
        trace_audit.rs               # trace, impact, audit and evidence lineage owner
        relation_distribution.rs     # relation and distribution semantic owner
        external_summary.rs          # external summary, ref and body boundary owner
        maintenance.rs               # maintenance task, progress and convergence state owner
        package_set.rs               # method package and method set peripheral owner
        policies.rs                  # domain policies, guards and invariants
        errors.rs                    # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                       # application exports
        services.rs                  # service assembly facade
        definition_service.rs        # method definition and catalog command/query use cases
        formalization_service.rs     # formalization and formal version use cases
        consumption_service.rs       # controlled consumption and boundary use cases
        trace_service.rs             # trace, impact, audit and lineage use cases
        relation_service.rs          # relation and distribution use cases
        external_summary_service.rs  # inbound external summary and reference use cases
        maintenance_service.rs       # maintenance request and progress use cases
        package_set_service.rs       # package and method set use cases
        query_service.rs             # read surface orchestration
        consumer_service.rs          # inbound consumer orchestration
        job_service.rs               # operations job orchestration
        ports.rs                     # repository, material, resolver, publisher, handoff, clock and id traits
        unit_of_work.rs              # UnitOfWork trait and transaction handle
        idempotency.rs               # idempotency digest, duplicate / conflict and replay shells
        errors.rs                    # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                       # infra exports
        config.rs                    # runtime config structs and validation shell
        runtime_builder.rs           # repository, adapter and service assembly
        repositories.rs              # fake / durable truth repository adapters
        material_stores.rs           # read material and projection store adapters
        reference_stores.rs          # external ref, artifact ref and availability stores
        external_adapters.rs         # process / identity / runtime / member-images / artifact summary adapters
        publishers.rs                # event candidate publisher adapters
        handoff_adapters.rs          # observability / archive handoff adapters
        clock_id.rs                  # clock and id generator adapters
        errors.rs                    # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                       # api exports
        command_handlers.rs          # Command handler boundary
        query_handlers.rs            # Query handler boundary
        routes.rs                    # route / RPC assembly placeholder
        errors.rs                    # API error mapping
    worker/
      Cargo.toml
      src/
        lib.rs                       # worker exports
        consumers.rs                 # inbound external summary consumers
        event_publishers.rs          # event candidate publisher runner
        maintenance_worker.rs        # maintenance worker assembly placeholder
        errors.rs                    # WorkerError
    jobs/
      Cargo.toml
      src/
        lib.rs                       # jobs exports
        read_material_refresh.rs     # refresh method read materials once
        trace_material_refresh.rs    # refresh trace / impact / audit materials once
        reference_refresh.rs         # refresh external summary / ref availability once
        consistency_recovery.rs      # run convergence check without repairing core truth
        maintenance_progress.rs      # record and expose maintenance progress summary
        errors.rs                    # JobError
  tests/
    contract/
      command_contract_tests.rs      # command DTO shell contract tests
      query_contract_tests.rs        # query DTO and view shell contract tests
      event_contract_tests.rs        # inbound / outbound event shell contract tests
      job_contract_tests.rs          # job input / receipt shell contract tests
    domain/
      policy_tests.rs                # domain policy and guard tests
      state_boundary_tests.rs        # state boundary tests from Step 10
    service/
      command_flow_tests.rs          # application command flow tests
      query_flow_tests.rs            # read orchestration tests
      consumer_flow_tests.rs         # inbound consumer flow tests
      job_flow_tests.rs              # operations job flow tests
    integration/
      core_method_flow_tests.rs      # command + fake infra integration tests
      material_refresh_tests.rs      # read material refresh integration tests
      handoff_tests.rs               # observability / archive handoff integration tests
    support/
      fixtures.rs                    # shared test fixtures
      fakes.rs                       # shared fake adapters
```

### 4.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、edition、shared dependencies | 固定 workspace、member 列表和 `core-contracts` path dependency 落点。 |
| `crates/contracts/src/lib.rs` | contracts | public exports | 统一导出 contracts public surface。 |
| `crates/contracts/src/refs.rs` | contracts | typed refs、safe reason refs、shared markers | 提供跨 DTO / view / job 复用的公共引用壳。 |
| `crates/contracts/src/metadata.rs` | contracts | command / query / event / job metadata wrappers | 承载 actor、request、trace、idempotency 等 metadata 壳。 |
| `crates/contracts/src/commands.rs` | contracts | Command request / result DTO shells | 定义同步写入口协议壳,不写 domain truth。 |
| `crates/contracts/src/queries.rs` | contracts | Query request / response DTO shells | 定义只读入口协议壳和 safe absence / unavailable 表达。 |
| `crates/contracts/src/events.rs` | contracts | inbound summary / outbound candidate DTO shells | 定义事件协作协议壳,不表达 L0-bus transport。 |
| `crates/contracts/src/jobs.rs` | contracts | operations job input / receipt DTO shells | 定义 Job public surface,不固定 scheduler / queue。 |
| `crates/contracts/src/views.rs` | contracts | read surface / material view DTO shells | 定义读取材料和可用性视图壳,不得成为第二 truth。 |
| `crates/contracts/src/errors.rs` | contracts | protocol error DTO shell | 定义 public rejection / error code 壳。 |
| `crates/contracts/src/fixtures.rs` | contracts | contract test fixtures | 支撑 Step 16 contract tests,不进入 production truth。 |
| `crates/domain/src/*.rs` | domain | 八组件 domain object / policy / error | 按 method asset definition、formal version、consumption、trace、relation、external summary、maintenance、package set 拆分 truth owner。 |
| `crates/application/src/*_service.rs` | application | component use case services | 编排 command、query、consumer、job flow 的 transaction、domain 和 ports。 |
| `crates/application/src/ports.rs` | application | repository / material / resolver / publisher / handoff / clock / id traits | 定义 application 到 infra 的正式边界。 |
| `crates/application/src/unit_of_work.rs` | application | UnitOfWork trait and handle | 定义事务边界壳。 |
| `crates/application/src/idempotency.rs` | application | idempotency digest / duplicate / replay shells | 定义幂等和重放承载面,具体 schema 后续闭口。 |
| `crates/infra/src/*.rs` | infra | config、runtime builder、repository、material store、external adapter、publisher、handoff、clock / id、error | 承接 application port 的具体 adapter 和运行装配,不固定具体产品。 |
| `crates/api/src/*_handlers.rs` | api | command / query handlers | 转换 contracts DTO 与 application service 调用。 |
| `crates/api/src/routes.rs` | api | route / RPC assembly placeholder | 表达入口装配位置,不固定 HTTP / RPC framework。 |
| `crates/worker/src/*.rs` | worker | inbound consumer、event candidate publisher、maintenance worker、error | 装配后台 runner,不恢复旧 outbox relay。 |
| `crates/jobs/src/*.rs` | jobs | read material refresh、trace refresh、reference refresh、consistency recovery、maintenance progress、error | 执行 operations job,不修 core truth。 |
| `tests/**` | tests | contract / domain / service / integration tests and support | 承接 Step 16 测试切口,当前只保留文件承载面。 |

### 4.6 编译期依赖与非 Cargo 依赖排除

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖候选 | workspace root `Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | member crate 通过 `core-contracts.workspace = true` 按需引用;实施前必须重新核对相对路径。 |
| 本仓内部 crate | workspace member dependency | 各 member `Cargo.toml` | `<package>.workspace` 或 path / workspace 口径由实施计划收口 | Step 4 只固定 role 与方向;正式 crate dependency matrix 留给 Step 5。 |

依赖方向预告如下,正式 crate dependency matrix 留给 Step 5:

```text
contracts -> core-contracts
domain -> contracts -> core-contracts
application -> contracts -> domain -> core-contracts
infra -> contracts -> domain -> application -> core-contracts
api / worker / jobs -> contracts -> application -> infra -> core-contracts
```

| 外部关系 | 全局依赖类型 | Step 4 Cargo 处理 | 后续承接 |
|---|---|---|---|
| `L0-bus` | event collaboration | 不写 Cargo dependency。 | Step 7 publisher / consumer port;Step 8 event contract;Step 14 transport binding;tests fake。 |
| `L1-process` | runtime consumption | 不写 Cargo dependency。 | controlled consumption material、runtime adapter、API / SDK / fake、unavailable / degraded 分支。 |
| `L1-identity` | runtime consumption / actor context | 不写 Cargo dependency。 | actor / role / identity safe summary、adapter port、audit metadata、Step 15 observability。 |
| `L2-runtime` | runtime consumption | 不写 Cargo dependency。 | runtime use adapter、config binding、fake / unavailable 分支。 |
| `L2-member-images` | runtime consumption | 不写 Cargo dependency。 | Role -> image variant definition consumption boundary、adapter / fake。 |
| `L4-observability` / archive / external systems | handoff / external collaboration | 不写 Cargo dependency。 | handoff adapter、audit / report boundary、Step 15 / Step 17。 |

### 4.7 命名检查与禁入项

命名检查必须满足:

| 检查项 | 通过条件 |
|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-method-library` |
| project slug | `method-library` |
| workspace member 目录 | `crates/<role>`,role 不含 `method_library_` / `l3_` / `quantalithos` 前缀 |
| Cargo package | `method-library-<role>` |
| Rust library crate | `method_library_<role>` |
| 架构层级泄漏 | 实现命名中不出现 `L0` / `L1` / `L2` / `L3` / `l0_` / `l1_` / `l2_` / `l3_` |
| 旧主线泄漏 | 不出现 `MethodContent`、`publish`、`snapshot`、`fingerprint`、`outbox_relay` 作为当前正向文件主线 |
| 模糊文件名 | 不出现 `utils.rs`、`helper.rs`、`common.rs`、`misc.rs` |
| 外部仓泄漏 | 不把 process / identity / runtime / member-images / bus / observability repo 文件写入本仓文件树 |

以下旧内容不得进入当前 Step 4 正向布局:旧 `MethodContent` 总聚合、publish / published / publication 主线、snapshot / fingerprint 版本核心、outbox relay / delivery worker、`method_library_*` workspace member / Cargo package、PostgreSQL / sqlx / migrations、gateway trusted header / auth extractor、P0 / P1 范围标签、旧 EV / acceptance / veto checklist。

### 4.8 Step 5 进入条件

Step 4 满足以下条件后,才能进入 Step 5:

| 条件 | 要求 |
|---|---|
| workspace 布局 | 已固定 workspace 多 crate 布局。 |
| 实现单元 | 已固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现单元。 |
| 命名映射 | 已固定 member 目录、Cargo package、Rust crate / binary 命名规则。 |
| 文件布局 | 已固定文件布局树和文件职责表。 |
| 依赖边界 | 已确认只有 `core-contracts` 是 compile dependency candidate,其他相邻仓不得写成 Cargo dependency。 |
| 历史污染 | 已关闭旧 Step 4 completed 状态,旧实现仓与旧正式 03 只作为 historical material。 |

进入 Step 5 后,只能基于本节收口 crate dependency matrix 和模块实现契约主轴;不得回退为旧 P0 / `MethodContent` / snapshot / outbox / PostgreSQL 主线。若 Step 6~8 发现当前文件布局无法承载正式对象、port、protocol 或 mapper,必须回到 Step 4 / Step 5 重新闭口,不得由实现侧自行补口。

### 3. R4.16 自检

| 检查项 | 结果 |
|---|---|
| 是否已写正式 §4 中间产物草稿 | pass |
| 是否覆盖布局形态、实现单元、目录映射、文件树、文件职责、依赖排除、命名检查和 Step 5 条件 | pass |
| 是否只写当前 Step 4 中间产物 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未定义对象字段、trait 方法、DTO schema、flow 步骤或状态矩阵 | pass |
| 是否未进入 `R4.17` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.17 自检与停审:先思考`;只允许形成 Step 4 自检清单,不得直接修改正式 `03-详细设计.md`,不得进入 `R4.18` 或 Step 5。

---

## R4.17 自检与停审:先思考

### 1. 本模块处理边界

| 项目 | 判断 |
|---|---|
| 当前模块 | `R4.17 自检与停审:先思考` |
| 上一模块输入 | `R4.16` 已在当前中间产物中形成正式 §4 回填草稿,正式 `03-详细设计.md` 仍未修改。 |
| 本模块允许 | 形成 Step 4 自检清单、停审判断项、遗留风险检查项和 `R4.18` 写入策略。 |
| 本模块禁止 | 关闭 Step 4、同步 flow / 台账到 Step 5、直接修改正式 `03-详细设计.md`、进入 Step 5。 |
| 下一模块 | `R4.18 自检与停审:再写入` |

本模块只做停审前思考。是否真正关闭 Step 4,以及是否把 flow / 项目台账推进到 Step 5 等待状态,必须留到用户确认后的 `R4.18`。

### 2. Step 4 完成性自检清单

| 检查项 | 证据位置 | 当前判断 | `R4.18` 处理 |
|---|---|---|---|
| 是否已按 full-restart 重启 Step 4 | `R4.1` / `R4.2` | pass | 写入停审记录。 |
| 是否已参考 L1-governance 框架而非复制领域语义 | `R4.3` / `R4.4` | pass | 写入框架对齐摘要。 |
| 是否已核对目标实现仓和命名规范 | `R4.5` / `R4.6` | pass | 写入命名基线摘要。 |
| 是否已裁决布局形态 | `R4.7` / `R4.8` | pass | 写入 workspace 多 crate 结论。 |
| 是否已固定实现单元和依赖落点 | `R4.9` / `R4.10` | pass | 写入七个实现单元和 `core-contracts` 落点摘要。 |
| 是否已固定文件布局树和文件职责 | `R4.11` / `R4.12` | pass | 写入文件布局闭口摘要。 |
| 是否已关闭旧 Step 4 completed 污染 | `R4.13` / `R4.14` | pass | 写入 historical_material 处理摘要。 |
| 是否已形成正式 §4 回填草稿 | `R4.15` / `R4.16` | pass | 写入草稿可装配结论。 |
| 是否仍未修改正式 `03-详细设计.md` | git status / `R4.16` 自检 | pass | `R4.18` 继续保持不修改正式文档。 |

### 3. 可落码性与越界检查

| 检查项 | 通过标准 | 当前判断 |
|---|---|---|
| 实现单元可创建 | 七个 member 目录、package、crate / binary 命名清楚。 | pass |
| 文件职责可落码 | 每个文件有明确 owner 和职责,没有 `utils.rs` / `helper.rs` / `common.rs` / `misc.rs`。 | pass |
| compile dependency 边界清楚 | 只有 `core-contracts` 是 compile dependency candidate。 | pass |
| runtime / event 依赖未写成 Cargo dependency | `L0-bus`、process、identity、runtime、member-images、observability 等均排除 Cargo dependency。 | pass |
| 未定义 Step 6+ 内容 | 未写对象字段、trait 方法、DTO schema、flow 步骤、状态矩阵。 | pass |
| 未锁定具体产品 | 未固定 PostgreSQL、queue、scheduler、HTTP / RPC framework、object storage。 | pass |
| 未恢复旧主线 | 未把 `MethodContent`、publish、snapshot、fingerprint、outbox relay 作为当前正向布局。 | pass |

### 4. Step 5 入口自检

Step 5 只能在以下条件满足后进入:

| 条件 | 当前判断 | Step 5 承接方式 |
|---|---|---|
| workspace 多 crate 布局已确定 | pass | Step 5 收口正式 crate dependency matrix。 |
| 七个实现单元已确定 | pass | Step 5 定义每个模块实现契约主轴。 |
| 业务组成部分到 role 的映射已确定 | pass | Step 5 继续把八组件映射成模块 contract owner。 |
| 文件承载面已确定 | pass | Step 5 不再重写文件树,只声明模块契约主轴。 |
| 依赖方向预告已确定 | pass | Step 5 把预告升级为正式 dependency matrix。 |
| 历史污染已关闭 | pass | Step 5 不得恢复旧 P0 / `MethodContent` / snapshot / outbox / PostgreSQL。 |

### 5. `R4.18` 写入策略

`R4.18` 应写入 Step 4 停审记录,并同步三层状态到 Step 5 等待用户确认。建议写入:

| 写入块 | 内容边界 |
|---|---|
| 停审记录 | Step 4 completed,当前正式文档仍未修改,§4 草稿已在中间产物中形成。 |
| 完成性清单 | 引用 `R4.1`~`R4.16` 的 pass 结果,不重复全文。 |
| Step 5 交接清单 | 七个实现单元、依赖方向、文件布局、禁入旧主线、Step 5 只能收口模块契约主轴。 |
| flow 同步 | `03_ddd_calibration_flow.md` 当前 Step 切到 Step 5 pending / wait_user_confirm。 |
| 项目台账同步 | `project_execution_ledger.md` 当前恢复点切到 Step 5 `R5.1` 等待确认。 |

`R4.18` 不得:

- 直接修改正式 `03-详细设计.md`。
- 进入 Step 5 正文。
- 写 Step 5 的模块实现契约主轴。
- 新增对象字段、trait 方法、DTO schema、flow、state、persistence 或 config。

### 6. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否只形成 Step 4 自检清单 | pass |
| 是否未关闭 Step 4 | pass |
| 是否未同步 flow / 台账到 Step 5 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R4.18` 正文或 Step 5 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.18 自检与停审:再写入`;只允许写入 Step 4 停审记录并把 flow / 项目台账同步到 Step 5 等待确认状态,不得直接修改正式 `03-详细设计.md`,不得进入 Step 5 正文。

---

## R4.18 自检与停审:再写入

Step 4 `收稳实现单元与文件布局` 已完成本轮 full-restart 讨论。当前结论只作为后续 Step 5~17 的布局输入和正式 §4 回填草稿来源,不直接修改正式 `03-详细设计.md`。

### 1. 停审记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4 收稳实现单元与文件布局 |
| 当前模块 | `R4.18 自检与停审:再写入` |
| 当前状态 | completed |
| 下一 Step | Step 5 定义模块实现契约主轴 |
| 下一允许动作 | `R5.1 开工与必读文档:先思考` |
| 正式文档状态 | 未修改正式 `03-详细设计.md`;§4 草稿仅存在于本中间产物。 |
| 旧 Step 5 文件定位 | `03_ddd_step_05_module_contracts.md` 现有内容仍是 historical_material,不得继承其 completed 状态或旧 P0 / MethodContent / outbox 口径。 |

### 2. Step 4 最终自检结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| `R4.1`~`R4.18` 是否完整 | pass | Step 4 已覆盖开工、框架对齐、命名核对、布局裁决、实现单元、文件树、历史审计、回填草稿、自检和停审。 |
| 布局形态是否已闭口 | pass | 当前采用 workspace 多 crate,不采用单 crate、按八组件拆 crate、单独 config / observability crate。 |
| 实现单元是否已闭口 | pass | 固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现单元。 |
| 目录 / package / crate / binary 命名是否已闭口 | pass | 固定 `crates/<role>`、`method-library-<role>`、`method_library_<role>`。 |
| 文件布局树与职责是否已闭口 | pass | `R4.12` 已形成可创建文件树和职责表,`R4.16` 已形成正式 §4 草稿。 |
| compile dependency 是否已收稳 | pass | 仅 `core-contracts` 是 compile dependency candidate;正式 crate dependency matrix 留给 Step 5。 |
| runtime / event 依赖是否被排除为 Cargo dependency | pass | `L0-bus`、process、identity、runtime、member-images、observability 等均不得在 Step 4 写成 Cargo dependency。 |
| 旧 Step 4 污染是否关闭 | pass | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox relay、PostgreSQL、gateway、P0 / P1 均不得作为当前布局来源。 |
| 是否保护正式 `03-详细设计.md` | pass | 本 Step 全部写入停在 `design-calibration` 中间产物。 |

### 3. Step 5 进入条件

Step 5 可以在用户确认后启动,但必须遵守:

| 进入项 | Step 5 可做 | Step 5 不得做 |
|---|---|---|
| 必读恢复 | 先读项目台账、03 flow、Step 1~4 当前中间产物、正式 `00/01/02` 和规范。 | 根据旧 Step 5 completed 状态直接续写。 |
| 模块主轴 | 基于七个实现单元、文件布局、八组件映射和依赖方向,定义模块实现契约主轴。 | 改写 Step 4 文件布局树或新增 crate。 |
| 依赖矩阵 | 把 Step 4 依赖方向预告升级为正式 crate dependency matrix。 | 把 runtime / event collaboration 写成 Cargo dependency。 |
| 旧材料处理 | 旧 Step 5 只能作 historical_material 和污染审计输入。 | 恢复旧 13 模块、P0、`MethodContentCommandService`、outbox、snapshot、PostgreSQL 等旧主线。 |
| 后续分工 | 为 Step 6~16 保留对象、port、protocol、flow、state、persistence、error、config、observability、test 的独立闭口空间。 | 在 Step 5 一次性写对象字段、trait 方法、DTO schema、flow 步骤或状态矩阵。 |

### 4. 三层状态同步要求

| 文件 | 同步要求 |
|---|---|
| `project_execution_ledger.md` | 当前恢复点推进到 Step 5 `R5.1 开工与必读文档:先思考` 等待确认。 |
| `03_ddd_calibration_flow.md` | Step 4 标记 completed;Step 5 标记 wait_user_confirm_to_R5.1。 |
| `03_ddd_step_04_module_layout.md` | 当前文件标记 completed,并保留本停审记录。 |

### 5. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 4 停审记录 | pass |
| 是否同步 flow / 台账到 Step 5 等待状态 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 5 正文 | pass |
| 是否明确旧 Step 5 文件仍为 historical_material | pass |

next_allowed_action: 等待用户确认后进入 `03-详细设计` Step 5 `R5.1 开工与必读文档:先思考`;只允许思考 Step 5 必读文档、输入边界、整体模块框架和模块顺序;不得直接修改正式 `03-详细设计.md`;不得继承旧 Step 5 completed 状态;不得进入 `R5.2` 或 Step 6。
