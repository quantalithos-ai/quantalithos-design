# Step 3. 收稳编码规范、语言 / runtime、仓库约束

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 3
> 回填章节: `projects/L3-method-library/03-详细设计.md` §3 实现约束与编码规范承接
> 创建日期: 2026-06-22
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: `R3.18 自检与停审:再写入`
> 当前门禁: Step 3 completed;等待用户确认进入 Step 4 `R4.1 开工与必读文档:先思考`

---

## R3.1 开工与必读文档:先思考

### 1. 本模块要回答的问题

Step 3 不是续写旧 `03_ddd_step_03_runtime_constraints.md`。旧文件虽然标记为 `[x] 已确认`,但它仍以旧 `P0 方法定义发布同步闭环`、`MethodContent`、publish、snapshot、outbox、PostgreSQL 等旧材料为前提,在当前 full-restart 下只能作为 historical material。

本模块只回答以下问题:

| 问题 | 本轮判断 |
|---|---|
| Step 3 的工作对象是什么? | 基于当前 `00/01/02`、已完成 Step 1 和 Step 2,重新收稳编码规范、语言 / runtime、仓库约束、依赖边界和安全边界。 |
| Step 3 是否可以直接继承旧文件结论? | 不可以。旧文件的 completed 状态失效,旧内容只能进入后置差异审计。 |
| Step 3 是否修改正式 `03-详细设计.md`? | 当前不修改。正式正文由后续回填模块或 Step 19 装配控制。 |
| Step 3 是否决定完整 crate / module layout? | 不决定。Step 3 只收稳约束和输入;具体实现单元与文件布局交给 Step 4。 |
| Step 3 完成后应支持什么? | 支持后续 Step 4~17 在同一语言、注释、依赖、仓库、提交和安全边界下展开可落码契约。 |

### 2. 必读文档

#### 2.1 流程与规范

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点、当前 Step 和下一动作。 | 只作为恢复门禁,不产生领域结论。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 确认 03 full-restart 的 Step 状态、模块门禁和历史材料规则。 | 作为文档级 flow 真相源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | 确认当前 03 的输入权威顺序和历史材料隔离口径。 | Step 3 不重新讨论 Step 1 结论。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | 确认本轮实现范围、非范围、历史污染禁入和后续 Step 分派。 | Step 3 不回头修改范围。 |
| `standards/document/详细设计讨论流程_SOP.md` | 确认 Step 3 的目标、输入、输出、检查项和进入 Step 4 条件。 | 采用流程规则。 |
| `standards/document/详细设计书写规范.md` | 确认 §3 输出格式、Rust 契约写法、禁止画图和跨仓依赖绑定要求。 | 作为正式正文装配规则。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认三层台账、先思考后写入、单模块推进和写入批次规则。 | 作为本文件写入门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认 schema / port / DTO / mapper / config / evidence 缺口不得由实现端自行补口。 | 作为可落码红线。 |
| `standards/coding/rust.md` | 确认 Rust 命名、注释、rustdoc、format、clippy 与源码语言要求。 | Step 3 必须收稳是否承接及如何承接。 |

#### 2.2 本仓正式输入

| 文档 | 读取目的 | Step 3 关注点 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 复核仓定位、目标 / 非目标、依赖、规则、数据归属、验收红线。 | Definition vs Use、运行期依赖不得写成 compile dependency、旧外部系统不作前置。 |
| `projects/L3-method-library/01-架构设计.md` | 复核职责边界、系统上下文、依赖方向、数据所有权、一致性和通信方式。 | 编译期 / 运行期 / 事件协作依赖边界和安全边界。 |
| `projects/L3-method-library/02-概要设计.md` | 复核八个组成部分、接口骨架、处理流、状态、异常、配置影响和承接清单。 | Command / Query / Inbound Event / Outbound Event / Operations Job 的 runtime 约束和配置禁区。 |

#### 2.3 概要设计承接中间产物

| 中间产物 | 读取目的 | Step 3 关注点 |
|---|---|---|
| `02_hld_step_12_detailed_design_handoff.md` | 读取 03 承接清单、回退规则和跨文档分工。 | 判断 Step 3 只收稳约束,不提前写对象 / port / flow。 |
| `02_hld_step_13_risks_open_questions.md` | 读取风险与待确认事项。 | 识别实现端私补、配置绕界、外部摘要不可用等红线。 |
| `02_hld_step_14_formal_document_assembly.md` | 确认正式 02 已完成装配和历史材料处置。 | 防止旧 `MethodContent` / publish / snapshot / outbox 回流。 |

#### 2.4 框架参考与历史材料

| 材料 | 当前定位 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md` | framework_reference | 只参考 Step 3 的结构、问题深度、依赖表和门禁表达;不得复制 governance 领域语义。 |
| 旧 `projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md` | historical_material | 旧 completed 状态失效;只作差异审计和污染样本。 |
| `projects/L3-method-library/03-详细设计.md` | historical_material | 当前不修改,只在后续差异审计或回填模块使用。 |

### 3. 当前输入边界初判

| 输入类别 | 当前判断 | Step 3 影响 |
|---|---|---|
| Step 2 范围 | 已完成,当前范围以八组件和 core / support / operation / peripheral / cross-cutting 分层为主。 | Step 3 不能恢复旧 P0 publish 主线。 |
| 语言与契约表达 | 规范要求详细设计写 Rust 契约片段,且必须点名 Rust 编码规范来源。 | 后续必须裁决 Rust 注释语言、Rustdoc 写法、签名完整度和测试命名。 |
| runtime / framework | 当前 02 只给出接口族和运行承接,未锁定 HTTP / RPC / database / queue / scheduler 具体产品。 | Step 3 可写不提前锁定具体 framework,具体布局交给 Step 4。 |
| 跨仓依赖 | 需求层明确 `[compile]` 可进 package dependency,`[runtime]` / `[event]` 不得写成 dependency。 | Step 3 必须区分 local path dependency、runtime adapter、event collaboration。 |
| 配置影响 | 02 §11 明确配置只能影响 assembly / adapter / profile / job,不得改变 truth owner、state、body-free 边界。 | Step 3 必须把配置不得绕界写入实现约束。 |
| 安全边界 | 本仓聚焦方法资产定义 truth,不拥有相邻仓运行 truth 或外部正文。 | Step 3 只收稳可信上下文、审计 metadata 和外部边界,不把认证 / gateway 实现塞入本仓。 |

### 4. Step 3 需要形成的输出池

| 输出 | 内容要求 | 不在本模块完成 |
|---|---|---|
| 编码规范承接表 | Rust 编码规范、详细设计书写规范、可落码性标准、提交 / git 前置阅读如何影响本文。 | `R3.1` 只列计划,不写最终表。 |
| 实现约束表 | 语言、注释、runtime、仓库、依赖、安全、配置红线和缺口暂停规则。 | `R3.1` 只列约束来源池。 |
| 跨仓依赖约束 | 哪些是 compile path dependency,哪些只能 runtime / event / adapter / fake 协作。 | 具体裁决在 `R3.9`~`R3.10`。 |
| 历史 Step 3 差异审计 | 旧 P0 / MethodContent / publish / snapshot / outbox / PostgreSQL 等是否禁入、后移或重定义。 | 具体裁决在 `R3.13`~`R3.14`。 |
| 回填草稿 | 正式 §3 的可装配草稿。 | 具体写入在 `R3.15`~`R3.16`。 |

### 5. Step 3 模块顺序草案

| 顺序 | 模块 | 产物 | 门禁 |
|---:|---|---|---|
| R3.1 | 开工与必读文档:先思考 | 本节 | 只列问题、必读文档、输入边界和模块顺序。 |
| R3.2 | 开工与必读文档:再写入 | 开工记录、读取状态、Step 内计划 | 用户确认后写入,不得改正式 `03-详细设计.md`。 |
| R3.3 | L1-governance 框架对齐:先思考 | 可借鉴框架和不得借鉴内容 | 只抽结构,不复制领域语义。 |
| R3.4 | L1-governance 框架对齐:再写入 | Step 3 框架对齐记录 | 固定本仓 Step 3 输出结构。 |
| R3.5 | 规范与约束来源池:先思考 | 规范来源、上游来源、历史材料来源草案 | 不写最终约束表。 |
| R3.6 | 规范与约束来源池:再写入 | 编码 / 文档 / 可落码 / 提交 / 上游来源池 | 固定后续裁决的输入池。 |
| R3.7 | 语言 / runtime / 仓库约束裁决:先思考 | Rust、runtime、framework、repo discipline 裁决草案 | 不提前写 Step 4 layout。 |
| R3.8 | 语言 / runtime / 仓库约束裁决:再写入 | 语言、注释、runtime、仓库和提交约束 | 形成 §3 主体结论之一。 |
| R3.9 | 跨仓依赖与本地 sibling repo:先思考 | compile / runtime / event / adapter 依赖裁决草案 | 不凭空假设不存在 crate。 |
| R3.10 | 跨仓依赖与本地 sibling repo:再写入 | 跨仓依赖约束表和 path dependency 口径 | 形成 §3 主体结论之一。 |
| R3.11 | 安全 / 鉴权 / 外部边界:先思考 | 安全入口、actor metadata、外部正文禁区草案 | 不定义 gateway 实现。 |
| R3.12 | 安全 / 鉴权 / 外部边界:再写入 | 安全和外部边界约束表 | 形成 §3 主体结论之一。 |
| R3.13 | 历史 Step 3 差异审计:先思考 | 旧 Step 3 污染扫描计划 | 只审计,不反推当前结论。 |
| R3.14 | 历史 Step 3 差异审计:再写入 | 旧内容禁入 / 后移 / 重定义表 | 关闭旧 Step 3 completed 污染。 |
| R3.15 | 回填草稿:先思考 | 正式 §3 回填策略 | 不修改正式 03。 |
| R3.16 | 回填草稿:再写入 | §3 回填草稿 | 仅写中间产物。 |
| R3.17 | 自检与停审:先思考 | Step 3 自检清单 | 判断是否可进入 Step 4。 |
| R3.18 | 自检与停审:再写入 | Step 3 停审记录 | 关闭 Step 3,同步 flow / 台账到 Step 4 等待状态。 |

### 6. 下一写入边界

下一步只允许进入:

```text
R3.2 开工与必读文档:再写入
```

`R3.2` 应写入:

- Step 3 开工记录。
- 必读文档读取状态表。
- Step 内计划确认表。
- 旧 Step 3 历史材料处理规则。
- 当前不修改正式 `03-详细设计.md` 的门禁说明。
- 下一模块 `R3.3 L1-governance 框架对齐:先思考`。

`R3.2` 不得写入:

- 正式 `03-详细设计.md` 正文修改。
- 编码规范承接表最终结论。
- 跨仓依赖最终裁决。
- 安全 / 鉴权 / 外部边界最终表。
- 历史 Step 3 差异审计结论。
- Step 4 实现单元与文件布局。

### 7. 自检

| 检查项 | 结果 |
|---|---|
| 是否只进入 Step 3 第一个模块? | 是。 |
| 是否未修改正式 `03-详细设计.md`? | 是。 |
| 是否明确旧 Step 3 completed 状态失效? | 是。 |
| 是否列出 Step 3 必读文档? | 是。 |
| 是否给出 Step 3 模块顺序? | 是。 |
| 是否明确下一步只允许 `R3.2`? | 是。 |

next_allowed_action: 用户已确认进入 Step 3 `R3.1 开工与必读文档:先思考`;本模块写入后只允许等待用户确认进入 `R3.2 开工与必读文档:再写入`;不得直接修改正式 `03-详细设计.md`;不得进入 Step 4。

---

## R3.2 开工与必读文档:再写入

### 1. 开工记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 3 收稳编码规范、语言 / runtime、仓库约束 |
| 当前模块 | `R3.2 开工与必读文档:再写入` |
| 上一模块 | `R3.1 开工与必读文档:先思考` |
| 用户确认 | 已确认进入 `R3.2` |
| 本模块允许写入 | 开工记录、必读文档读取状态、Step 内计划、旧 Step 3 历史材料处理规则和下一门禁 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、编码规范最终裁决、跨仓依赖最终裁决、安全 / 鉴权最终表、历史差异审计结论、Step 4 文件布局 |
| 下一模块 | `R3.3 L1-governance 框架对齐:先思考` |

本模块确认 Step 3 已按 full-restart 重建开工入口。当前仍处于准备阶段,不继承旧 Step 3 `[x] 已确认` 状态,不修改正式 `03-详细设计.md`,不提前写 §3 的最终结论。

### 2. 必读文档读取状态表

#### 2.1 已完成读取

| 文档 | 状态 | 本模块使用结论 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | read | 项目级恢复点允许进入 `R3.2`,且禁止跳过当前模块。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | read | 文档级 flow 已停在 Step 3 / `R3.2`;正式 03 仍不得修改。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | read | Step 1 已固定输入权威顺序和历史材料隔离口径。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | read | Step 2 已固定本轮范围、非范围、历史污染禁入和后续 Step 分派。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | Step 3 必须回答语言、runtime、框架、依赖、注释、提交、git config 和安全边界约束。 |
| `standards/document/详细设计书写规范.md` | read | §3 必须输出编码规范承接表、实现约束表和必要跨仓 Rust 依赖绑定;本章禁止画图。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 当前采用模块级“先思考 -> 再写入”、三层台账同步和单批写入规模控制。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 后续若缺 schema / port / DTO / mapper / config / evidence schema,必须回设计闭口。 |
| `standards/coding/rust.md` | read | Step 3 必须裁决 Rust 编码规范、标识符、注释、rustdoc 和工具关系如何进入本文约束。 |
| `projects/L3-method-library/00-需求文档.md` | read | 本仓必须保持 Definition vs Use 分离;`[runtime]` / `[event]` 依赖不得写成 package dependency。 |
| `projects/L3-method-library/01-架构设计.md` | read | Step 3 需要承接职责边界、数据所有权、依赖方向、事件协作和安全边界。 |
| `projects/L3-method-library/02-概要设计.md` | read | Step 3 需要承接八组件、接口族、处理流类型、配置影响和禁止配置化边界。 |
| `projects/L3-method-library/design-calibration/02_hld_step_12_detailed_design_handoff.md` | read | 03 负责正式 contract / runtime boundary,04 负责配置说明;Step 3 不提前写对象 / port / flow。 |
| `projects/L3-method-library/design-calibration/02_hld_step_13_risks_open_questions.md` | read | 实现端私补、配置绕界、外部摘要不可用等事项要作为后续红线输入。 |
| `projects/L3-method-library/design-calibration/02_hld_step_14_formal_document_assembly.md` | read | 正式 02 已完成装配;旧 `MethodContent` / publish / snapshot / outbox 不得回流。 |
| `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md` | read | 只参考 Step 3 框架深度、依赖表、问题诊断和进入下一步条件。 |

#### 2.2 后续模块到达时继续读取

| 文档 | 读取时机 | 用途 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md` | `R3.3` / `R3.4` | 抽取可借鉴框架,不得复制 governance 领域语义。 |
| 当前旧版残留线索 | `R3.13` / `R3.14` | 审计旧 Step 3 中的旧 P0、MethodContent、publish、snapshot、outbox、PostgreSQL 等口径。 |
| `projects/L3-method-library/03-详细设计.md` | `R3.13`~`R3.16` | 历史正文差异审计和后续 §3 回填草稿对照,当前不修改。 |
| 本地 sibling repo 实际结构 | `R3.9` / `R3.10` | 若要写 path dependency,必须确认真实路径、package 名和 crate 名。 |
| `projects/README.md` 与目标实现仓 git config | `R3.7` / `R3.8` 和后续实施计划 | 固定提交规范、author / committer 和工作区纪律。 |

### 3. Step 内计划确认表

| 顺序 | 模块 | 状态 | 完成门禁 |
|---:|---|---|---|
| R3.1 | 开工与必读文档:先思考 | completed | 已列出问题、必读文档、输入边界、输出池和模块顺序。 |
| R3.2 | 开工与必读文档:再写入 | completed | 已记录开工、读取状态、Step 内计划、历史材料规则和下一门禁。 |
| R3.3 | L1-governance 框架对齐:先思考 | completed | 已分析可借鉴框架和不得借鉴内容,未写本仓最终结论。 |
| R3.4 | L1-governance 框架对齐:再写入 | completed | 固化本仓 Step 3 框架对齐记录。 |
| R3.5 | 规范与约束来源池:先思考 | completed | 已形成规范来源、上游来源、概要承接来源、本地来源和历史来源草案。 |
| R3.6 | 规范与约束来源池:再写入 | completed | 已写入来源池正式记录、权威级别、优先级、后续模块落点和不得裁决事项。 |
| R3.7 | 语言 / runtime / 仓库约束裁决:先思考 | completed | 已形成 Rust、Rustdoc / 源码语言、runtime / framework、repo discipline、提交和 git config 约束草案。 |
| R3.8 | 语言 / runtime / 仓库约束裁决:再写入 | completed | 已写入语言、注释、runtime、仓库和提交约束记录。 |
| R3.9 | 跨仓依赖与本地 sibling repo:先思考 | completed | 已形成 compile / runtime / event / adapter / fake 依赖裁决草案和本地 sibling repo 核对记录。 |
| R3.10 | 跨仓依赖与本地 sibling repo:再写入 | completed | 已写入跨仓依赖约束表、候选 path dependency 口径和不可用处理。 |
| R3.11 | 安全 / 鉴权 / 外部边界:先思考 | completed | 已形成安全入口、actor metadata、外部正文禁区、下游运行 truth 和日志诊断安全边界草案。 |
| R3.12 | 安全 / 鉴权 / 外部边界:再写入 | completed | 已写入安全和外部边界约束表。 |
| R3.13 | 历史 Step 3 差异审计:先思考 | completed | 已形成旧正式 03 与旧 Step 3 的污染扫描计划。 |
| R3.14 | 历史 Step 3 差异审计:再写入 | completed | 已写入旧内容禁入 / 后移 / 重定义审计表。 |
| R3.15 | 回填草稿:先思考 | completed | 已形成正式 §3 回填结构、来源映射、禁入项和草稿写入模板。 |
| R3.16 | 回填草稿:再写入 | completed | 已写入 §3 中间产物草稿。 |
| R3.17 | 自检与停审:先思考 | completed | 已形成 Step 3 自检清单草案、停审条件草案和 Step 4 进入判定草案。 |
| R3.18 | 自检与停审:再写入 | completed | 已关闭 Step 3,更新 flow / 台账到 Step 4 等待状态。 |

### 4. 旧 Step 3 历史材料处理规则

| 旧材料 | 当前处理 |
|---|---|
| 旧 Step 3 `[x] 已确认` 状态 | invalid_status,不得作为当前 Step 3 完成依据。 |
| 旧 `P0 方法定义发布同步闭环` | historical_pollution_candidate,不得恢复为当前 Step 3 输入主线。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery | 只进入 `R3.13`~`R3.14` 差异审计,不得在 `R3.2` 正向采用。 |
| 旧 PostgreSQL / L0-bus / gateway / object storage / cache 口径 | 不直接继承;后续必须按当前 `00/01/02` 和本轮 Step 重新裁决。 |

### 5. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写入 `R3.2` 允许内容 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写编码规范最终表 | pass |
| 是否未写跨仓依赖最终裁决 | pass |
| 是否未进入 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.3 L1-governance 框架对齐:先思考`;只允许分析 L1-governance Step 3 的可借鉴框架和不得借鉴内容,不得直接修改正式 `03-详细设计.md`,不得写本仓 Step 3 最终约束结论,不得进入 `R3.4` 或 Step 4。

---

## R3.3 L1-governance 框架对齐:先思考

### 1. 本模块要回答的问题

本模块只分析 L1-governance Step 3 的框架价值,不复制其领域结论。L1-governance 的 `L0-core` 依赖、governance 安全边界、external GRC、actor / evidence 语义都不能直接转成 `L3-method-library` 的结论。

| 问题 | 本轮判断 |
|---|---|
| governance Step 3 哪些结构值得复用? | 输入池、SOP 问题回答、当前文档问题诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项、进入下一步条件。 |
| governance Step 3 哪些内容不能复用? | governance 的领域依赖、唯一编译期依赖裁决、external GRC、policy / control / audit 语义、目标仓路径和提交口径。 |
| 本仓 Step 3 是否也需要 sibling repo 检查? | 需要,但只能在 `R3.9`~`R3.10` 按本仓当前 `00/01/02` 和真实 repo / crate 结构裁决。 |
| 本仓 Step 3 是否也需要冲突诊断? | 需要。尤其要诊断 `详细设计书写规范.md` 与 `standards/coding/rust.md` 在 rustdoc 语言上的潜在差异,以及旧 Step 3 的历史污染。 |
| 本模块是否写本仓最终约束表? | 不写。这里只形成框架借鉴清单和后续写入策略。 |

### 2. 可借鉴框架

| governance Step 3 结构 | 可借鉴点 | 对本仓后续模块的用法 |
|---|---|---|
| Step 状态与输入清单 | 将上一步中间产物、规范输入、上游边界、本地 sibling repo、git config 分开列出。 | `R3.5`~`R3.6` 可按“规范 / 上游 / 本地 / 历史”四类整理来源池。 |
| SOP 问题回答 | 逐项回答语言、runtime、依赖、rustdoc、提交、git config、安全边界、compile dependency、runtime/event dependency。 | `R3.7`~`R3.12` 可按问题族逐步裁决,避免只写一个总表。 |
| 当前文档问题诊断 | 先指出旧文档 / 概要 / 规范之间的具体问题,再说明本步处理。 | `R3.13`~`R3.14` 可用于旧 Step 3 差异审计;`R3.5` 可用于来源池缺口诊断。 |
| 改动前后对比 | 用“改动前 / 改动后 / 原因”说明约束为什么变化。 | `R3.15` 回填草稿前需要说明新版 §3 如何替代旧 §3。 |
| 设计取舍 | 不只给结论,还列出未采用方案和原因。 | `R3.7`~`R3.12` 对 Rust 注释语言、framework 是否锁定、path dependency 是否写入都应使用取舍表。 |
| 结构化中间产物 | 将编码规范承接表、实现约束表、本地多仓依赖表拆成独立小节。 | 本仓 Step 3 最终也应拆成这些表,但表项必须来自 method-library 当前输入。 |
| 回填草稿 | 给出正式 §3 的可装配正文,但不直接修改正式文档。 | `R3.15`~`R3.16` 使用同一做法。 |
| 待确认事项与进入下一步条件 | 明确哪些不阻塞 Step 4,哪些必须留给实施计划或后续 Step。 | `R3.17`~`R3.18` 用于关闭 Step 3。 |

### 3. 不得借鉴内容

| governance 内容 | 不得借鉴原因 | 本仓处理 |
|---|---|---|
| `quantalithos-governance` 目标仓路径 | 领域仓不同。 | 本仓若写目标仓路径,必须在 `R3.9`~`R3.10` 核对 `quantalithos-method-library` 真实结构。 |
| `L0-core` 是唯一编译期依赖的结论 | 这是 governance 的裁决,不是 method-library 的裁决。 | 本仓需从需求图、架构依赖和真实 crate 结构重新判断。 |
| `core-contracts` path dependency | 可能适用但不能直接复制。 | 必须确认本仓是否需要 core shared contracts,以及 package / lib / path 是否存在。 |
| external GRC / policy / control / evidence 语义 | 属于 governance 领域。 | 本仓应转为方法资产定义、正式化、受控消费、trace、relation、external summary、job、package / method set 语义。 |
| “源码英文 doc comment” 的最终裁决 | governance 对规范冲突作了项目裁决,本仓还未讨论。 | 本仓需在 `R3.7`~`R3.8` 独立裁决 Rustdoc 语言与正式文档写法。 |
| governance 的运行期依赖清单 | 包含本仓自身作为依赖对象,不能反向套用。 | 本仓需要按 `00/01/02` 的 process、identity、runtime、member-images、artifact 等依赖重新列。 |

### 4. 本仓 Step 3 框架草案

基于 governance 框架,本仓 Step 3 后续应按以下层次展开:

| 层次 | 后续模块 | 应输出什么 |
|---|---|---|
| 来源池 | `R3.5`~`R3.6` | 规范来源、上游来源、概要承接来源、本地 repo / git 来源、历史污染来源。 |
| 约束裁决 | `R3.7`~`R3.8` | 语言、Rustdoc、runtime / framework 是否锁定、仓库纪律、提交和 git config。 |
| 跨仓依赖裁决 | `R3.9`~`R3.10` | compile / runtime / event / adapter / fake 分类,本地 path dependency 只在真实存在时写入。 |
| 安全与外部边界 | `R3.11`~`R3.12` | 本仓不拥有下游运行 truth、外部正文、gateway / auth 实现;只承接可信 metadata / ref / summary。 |
| 历史差异审计 | `R3.13`~`R3.14` | 旧 P0 / MethodContent / publish / snapshot / outbox / PostgreSQL 等旧结论的禁入、后移或重定义。 |
| 回填与停审 | `R3.15`~`R3.18` | 正式 §3 草稿、自检、待确认事项和进入 Step 4 条件。 |

### 5. R3.4 写入策略

`R3.4` 应把本模块思考落成“框架对齐记录”,包括:

- governance Step 3 可借鉴框架表。
- governance Step 3 不得借鉴内容表。
- 本仓 Step 3 后续输出结构。
- 对 `R3.5` 的输入要求。

`R3.4` 不得写:

- 编码规范承接表最终项。
- 实现约束表最终项。
- path dependency 最终裁决。
- 安全 / 鉴权 / 外部边界最终表。
- 正式 `03-详细设计.md` 正文。

### 6. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只分析 governance 框架 | pass |
| 是否避免复制 governance 领域语义 | pass |
| 是否未写本仓最终约束结论 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.4` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.4 L1-governance 框架对齐:再写入`;只允许写入框架对齐记录和 `R3.5` 输入要求,不得直接修改正式 `03-详细设计.md`,不得写本仓 Step 3 最终约束结论,不得进入 `R3.5` 或 Step 4。

---

## R3.4 L1-governance 框架对齐:再写入

### 1. 框架对齐记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 3 收稳编码规范、语言 / runtime、仓库约束 |
| 当前模块 | `R3.4 L1-governance 框架对齐:再写入` |
| 上一模块 | `R3.3 L1-governance 框架对齐:先思考` |
| 用户确认 | 已确认进入 `R3.4` |
| 本模块允许写入 | 框架对齐记录、可借鉴结构、不得借鉴内容、本仓 Step 3 后续输出结构、`R3.5` 输入要求 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、编码规范最终裁决、跨仓依赖最终裁决、安全 / 鉴权最终表、Step 4 文件布局 |
| 下一模块 | `R3.5 规范与约束来源池:先思考` |

本模块把 `R3.3` 的思考结果固化为 Step 3 框架对齐记录。L1-governance 只作为框架参照,不作为 `L3-method-library` 的领域真相源。

### 2. 可借鉴结构记录

| 可借鉴结构 | 本仓采用方式 | 后续落点 |
|---|---|---|
| 输入池分层 | 将 Step 3 输入拆成规范输入、上游输入、概要承接输入、本地 repo / git 输入、历史材料输入。 | `R3.5`~`R3.6` |
| SOP 问题逐项回答 | 不用一个总表吞掉所有约束,而按语言 / runtime、Rustdoc、提交、git、依赖、安全边界分组裁决。 | `R3.7`~`R3.12` |
| 当前文档问题诊断 | 先诊断旧 Step 3、当前 02、规范之间的冲突和缺口,再给处理口径。 | `R3.5`、`R3.13`~`R3.14` |
| 改动前后对比 | 用“改动前 / 改动后 / 原因”解释新版 §3 为什么替换旧 §3。 | `R3.15`~`R3.16` |
| 设计取舍表 | 对 framework 是否锁定、Rustdoc 语言、path dependency 是否写入等问题列出未采用方案。 | `R3.7`~`R3.12` |
| 结构化中间产物 | 最终至少形成编码规范承接表、实现约束表、跨仓依赖约束表、安全 / 外部边界表。 | `R3.8`、`R3.10`、`R3.12` |
| 回填草稿和停审条件 | 先在中间产物生成 §3 草稿,再由明确回填动作或 Step 19 装配。 | `R3.15`~`R3.18` |

### 3. 不得借鉴内容记录

| 不得借鉴内容 | 本仓处理要求 |
|---|---|
| governance 的目标实现仓路径 | 本仓必须独立核对 `quantalithos-method-library` 或实际目标实现仓路径。 |
| governance 的 `L0-core` 唯一编译期依赖裁决 | 本仓必须按当前需求、架构、概要和真实 crate 结构重新裁决。 |
| governance 的 `core-contracts` path dependency 写法 | 只能作为检查候选,不得在确认前写入本仓最终表。 |
| external GRC、policy、control、AIIA / SoA、governance audit 语义 | 不进入本仓 Step 3 领域结论。 |
| governance 的运行期依赖清单 | 本仓需要按 process、identity、runtime、member-images、artifact、bus、sdk 等当前关系重列。 |
| governance 对 Rustdoc 语言的项目裁决 | 本仓需结合 `详细设计书写规范.md` 与 `standards/coding/rust.md` 独立判断。 |

### 4. 本仓 Step 3 后续输出结构

| 输出结构 | 责任模块 | 完成标准 |
|---|---|---|
| 来源池与问题诊断 | `R3.5`~`R3.6` | 列清规范、上游、概要承接、本地 repo / git、历史材料来源,并说明每类如何进入后续裁决。 |
| 语言 / runtime / 仓库约束 | `R3.7`~`R3.8` | 明确 Rust 契约表达、Rustdoc、framework 锁定边界、提交和 git config 前置阅读。 |
| 跨仓依赖与 sibling repo | `R3.9`~`R3.10` | 区分 compile / runtime / event / adapter / fake,只在确认真实路径和 crate 后写 path dependency。 |
| 安全 / 鉴权 / 外部边界 | `R3.11`~`R3.12` | 明确本仓不实现 gateway / auth,不保存下游运行 truth 和外部正文,只承接可信 metadata / ref / summary。 |
| 历史 Step 3 差异审计 | `R3.13`~`R3.14` | 旧 P0、MethodContent、publish、snapshot、outbox、PostgreSQL 等逐项裁决为禁入、后移或重定义。 |
| 回填草稿与停审 | `R3.15`~`R3.18` | 形成正式 §3 草稿、自检、待确认事项和进入 Step 4 条件。 |

### 5. R3.5 输入要求

`R3.5` 只允许做“规范与约束来源池:先思考”,应先整理以下输入:

| 来源类型 | 必须纳入 | 输出要求 |
|---|---|---|
| 规范来源 | 详细设计 SOP、详细设计书写规范、中间产物规范、可落码性标准、Rust 编码规范、项目提交规范。 | 判断每份规范对 Step 3 的约束字段。 |
| 上游来源 | 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。 | 判断 Definition vs Use、依赖类型、安全边界、配置禁区和接口族约束。 |
| 概要承接来源 | `02_hld_step_12`、`02_hld_step_13`、`02_hld_step_14`。 | 判断 03 / 04 分工、风险输入、历史材料处理口径。 |
| 本地来源 | sibling repo 真实路径、目标实现仓候选路径、git config、项目 README 提交规范。 | 只作为后续核对对象,不得在 R3.5 直接裁决。 |
| 历史来源 | 旧 Step 3、旧正式 03、旧 MethodContent / publish / snapshot / outbox 主线。 | 只作为污染审计候选,不得正向继承。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写框架对齐记录 | pass |
| 是否未复制 governance 领域结论 | pass |
| 是否未写本仓最终约束表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.5` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.5 规范与约束来源池:先思考`;只允许整理规范、上游、概要承接、本地和历史来源池草案,不得直接修改正式 `03-详细设计.md`,不得写本仓 Step 3 最终约束结论,不得进入 `R3.6` 或 Step 4。

---

## R3.5 规范与约束来源池:先思考

### 1. 本模块要回答的问题

本模块只建立 Step 3 的来源池草案,不做最终裁决。最终编码规范承接表、实现约束表、跨仓依赖约束表和安全 / 外部边界表分别留给 `R3.8`、`R3.10`、`R3.12` 和回填模块。

| 问题 | 本轮判断 |
|---|---|
| Step 3 的约束来源应该分几类? | 分为规范来源、上游来源、概要承接来源、本地来源和历史来源五类。 |
| 哪些来源可直接产出约束? | 规范来源和正式 `00/01/02` 可以产出候选约束,但仍需后续模块裁决后才能成为最终表项。 |
| 哪些来源只能作为核对对象? | 本地 sibling repo、目标实现仓路径、git config 和历史材料只能作为核对对象,不能在本模块直接裁决。 |
| 是否现在写 path dependency? | 不写。即使当前 `/home/aris/Projects` 下有相关仓,也必须等 `R3.9`~`R3.10` 按 compile 关系和真实 crate 结构裁决。 |
| 是否现在解决 Rustdoc 语言冲突? | 不解决。`详细设计书写规范.md` 要求中文 Rustdoc,`standards/coding/rust.md` 对源码注释语言有约束,需 `R3.7`~`R3.8` 专门裁决。 |

### 2. 规范来源池草案

| 来源 | 已识别约束线索 | 后续用途 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 3 | Step 3 必须确认语言、编码、注释、仓库、提交、runtime、依赖和安全边界;必须点名 Rust 编码规范、提交规范、git config、compile dependency 与 runtime/event dependency 区分。 | `R3.7`~`R3.12` 的问题族裁决。 |
| `standards/document/详细设计书写规范.md` §5.3 | §3 必须输出编码规范承接表和实现约束表;如有跨仓 Rust 编译期依赖,需写本地 path dependency;本章禁止画图。 | `R3.6` 固定来源池,`R3.8` / `R3.10` 写结构化表。 |
| `standards/document/详细设计书写规范.md` Rust 契约规则 | 详细设计中的 Rust 片段是实现契约;对象、字段、enum variant、trait、公开函数需要 Rustdoc 注释。 | `R3.7`~`R3.8` 裁决 Rustdoc、签名和片段表达。 |
| `standards/document/设计文档讨论中间产物规范.md` | 必须按三层台账、单模块推进、先思考后写入和中间产物回填门禁执行。 | 约束 Step 3 的执行流程,不直接进入正式 §3。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 配置不得改变业务不变量;运行期依赖不得进 Cargo;缺 schema / port / DTO / mapper / config / evidence 不得由实现端补口。 | `R3.8` 写实现约束红线,后续 Step 6+ 持续使用。 |
| `standards/coding/rust.md` | Rust 编码规范不是 rustfmt / clippy 的替代;标识符、注释、rustdoc、格式和安全规则影响实现。 | `R3.7`~`R3.8` 决定如何承接。 |
| `projects/README.md` §8.2 | 提交规范和协作纪律需要进入实施前置阅读。 | `R3.7`~`R3.8` 处理提交规范和 git config。 |

### 3. 上游来源池草案

| 来源 | 已识别约束线索 | 后续用途 |
|---|---|---|
| `00-需求文档.md` §6.4 / §6.6 | `L0-core` 为编译期依赖;`L0-bus` 为事件协作依赖;`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 为运行期依赖;`[runtime]` 和 `[event]` 不得写成 package dependency。 | `R3.9`~`R3.10` 的跨仓依赖裁决第一来源。 |
| `00-需求文档.md` §6.5 / §12 | 禁止运行期消费关系变成源码级拥有关系;process、identity、runtime、member-images、governance、artifact 等正文和运行 truth 不归本仓。 | `R3.11`~`R3.12` 的外部边界和安全边界来源。 |
| `00-需求文档.md` 业务规则 / 非功能 / 验收 | Definition vs Use 必须成立;本仓不得越权保存认证鉴权、artifact/archive、治理执行、成员状态、流程运行正文。 | `R3.8` 实现约束和 `R3.12` 安全边界。 |
| `01-架构设计.md` | 职责边界、依赖方向、数据所有权、一致性和交互方式是 03 的上游约束。 | `R3.6` 需要列出具体章节;`R3.7` 后用于 runtime / repository / adapter 约束。 |
| `02-概要设计.md` §2~§3 | 03 负责完整契约,但不得恢复旧 fingerprint、snapshot、outbox、PostgreSQL、cache、object storage;Definition vs Use 持续分离。 | `R3.7`~`R3.14` 的禁入和回退依据。 |
| `02-概要设计.md` §7~§8 | Command / Query / Inbound Event / Outbound Event / Operations Job 接口族已固定;Outbound Event 不等于 outbox;Job 不修 core truth。 | 后续 runtime、event、job 约束的来源。 |
| `02-概要设计.md` §11 | 配置只能影响 assembly、adapter、profile、job、transport、projection material 等承载面;不得改变 truth owner、状态机、body-free 边界。 | `R3.8` 和后续 Step 14 的配置红线来源。 |

### 4. 概要承接来源池草案

| 来源 | 已识别约束线索 | 后续用途 |
|---|---|---|
| `02_hld_step_12_detailed_design_handoff.md` | 03 继续展开 crate / module / service / port / adapter、对象、接口、flow、state、error、runtime contract;04 继续配置说明;发现主语变化必须回退概要对应 Step。 | 确认 Step 3 只收稳约束,不提前展开对象 / port / flow。 |
| `02_hld_step_12_detailed_design_handoff.md` 排除项 | 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery 主线不得进入承接清单。 | `R3.13`~`R3.14` 历史审计来源。 |
| `02_hld_step_13_risks_open_questions.md` | 实现端私补对象、接口、状态或配置口径会阻塞实现;配置绕过 invariant / truth owner / state machine 是风险。 | `R3.8` 的实现红线与后续可落码门禁来源。 |
| `02_hld_step_14_formal_document_assembly.md` | 正式 02 已完成装配;历史 `03_ddd_*` 不能反推概要;旧材料只能作为污染检查对象。 | Step 3 full-restart 合法性和历史来源处理依据。 |

### 5. 本地来源池草案

| 来源 | 当前观察 | 使用边界 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core` | 当前本地存在。 | 仅说明本地候选存在;是否写 path dependency 由 `R3.9`~`R3.10` 决定。 |
| `/home/aris/Projects/quantalithos-bus` | 当前本地存在。 | 需求层为 event 依赖,不得因为本地存在写 Cargo dependency。 |
| `/home/aris/Projects/quantalithos-method-library` | 当前本地存在。 | 可作为目标实现仓候选,但必须后续核对真实 Cargo workspace / crate 结构。 |
| `/home/aris/Projects/quantalithos-identity`、`quantalithos-process`、`quantalithos-work`、`quantalithos-conversation`、`quantalithos-governance`、`quantalithos-sdk` | 当前本地存在。 | 只作为运行期 / event / 下游协作候选核对,不得直接成为 compile dependency。 |
| git config / `projects/README.md` | 当前仍需在目标实现仓另行核对。 | 本模块不读取目标仓 git config;后续写实施前置阅读要求。 |

### 6. 历史来源池草案

| 历史来源 | 当前定位 | 使用边界 |
|---|---|---|
| 旧 Step 3 文件 | historical_material | 只在 `R3.13`~`R3.14` 审计旧 P0、MethodContent、publish、snapshot、outbox、PostgreSQL 等是否污染。 |
| 旧正式 `03-详细设计.md` | historical_material | 只作为差异审计和旧正文替换对照,不作为当前 Step 3 结论来源。 |
| 旧 MethodContent / publish / snapshot / fingerprint / outbox / delivery 主线 | historical_pollution_candidate | 默认禁入;若后续确需相似机制,必须按当前对象、接口、flow 重新闭口。 |

### 7. R3.6 写入策略

`R3.6` 应把本模块草案落成正式来源池记录,并补充:

- 每类来源的权威级别。
- 每类来源进入后续模块的具体位置。
- 来源冲突时的优先级。
- 不允许在来源池阶段直接裁决的事项清单。

`R3.6` 不得写:

- 编码规范承接表最终项。
- 实现约束表最终项。
- path dependency 最终裁决。
- 安全 / 鉴权 / 外部边界最终表。
- 正式 `03-详细设计.md` 正文。

### 8. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只整理来源池草案 | pass |
| 是否未裁决 Rustdoc 语言 | pass |
| 是否未写 path dependency | pass |
| 是否未写本仓最终约束表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.6` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.6 规范与约束来源池:再写入`;只允许写入来源池正式记录、来源优先级和后续模块落点,不得直接修改正式 `03-详细设计.md`,不得写本仓 Step 3 最终约束结论,不得进入 `R3.7` 或 Step 4。

---

## R3.6 规范与约束来源池:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 3 收稳编码规范、语言 / runtime、仓库约束 |
| 当前模块 | `R3.6 规范与约束来源池:再写入` |
| 上一模块 | `R3.5 规范与约束来源池:先思考` |
| 用户确认 | 已确认进入 `R3.6` |
| 本模块允许写入 | 来源池正式记录、权威级别、优先级、后续模块落点和不得在来源池阶段裁决的事项 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、Rustdoc 语言最终裁决、path dependency 最终裁决、安全 / 鉴权最终表、Step 4 文件布局 |
| 下一模块 | `R3.7 语言 / runtime / 仓库约束裁决:先思考` |

本模块把 `R3.5` 的来源池草案固定为后续裁决输入。来源池只回答“哪些材料有资格参与后续判断、如何排序、进入哪个模块”,不直接产出本仓 Step 3 的最终实现约束。

### 2. 正式来源池

| 来源类型 | 来源 | 权威级别 | 进入后续模块 | 使用边界 |
|---|---|---|---|---|
| 规范来源 | `standards/document/详细设计讨论流程_SOP.md` Step 3 | normative_process | `R3.7`~`R3.12`,`R3.17`~`R3.18` | 定义 Step 3 必问问题和停审门禁,不定义 method-library 领域结论。 |
| 规范来源 | `standards/document/详细设计书写规范.md` §5.3 与 Rust 契约规则 | normative_format | `R3.8`,`R3.10`,`R3.15`~`R3.16` | 定义正式 §3 输出形态、Rust 契约表达和禁止画图规则。 |
| 规范来源 | `standards/document/设计文档讨论中间产物规范.md` | normative_execution | 全 Step 3 | 约束台账、单模块推进、先思考后写入和回填门禁,不进入正式 §3 领域正文。 |
| 规范来源 | `standards/document/设计真相源闭环与可落码性标准.md` | normative_redline | `R3.8` 及 Step 6+ | 定义缺 schema / port / DTO / mapper / config / evidence 时必须回设计闭口。 |
| 规范来源 | `standards/coding/rust.md` | normative_coding | `R3.7`~`R3.8` | 提供 Rust 编码、注释、rustdoc、工具关系和安全编码约束。 |
| 规范来源 | `projects/README.md` §8.2 | normative_project_discipline | `R3.7`~`R3.8`,后续实施计划 | 提供提交规范和协作纪律,目标实现仓 git config 仍需后续核对。 |
| 上游正式来源 | `projects/L3-method-library/00-需求文档.md` | formal_upstream | `R3.8`,`R3.10`,`R3.12` | 定义仓定位、依赖分类、Definition vs Use、非目标和验收红线。 |
| 上游正式来源 | `projects/L3-method-library/01-架构设计.md` | formal_upstream | `R3.8`,`R3.10`,`R3.12` | 定义职责边界、依赖方向、数据所有权、一致性和通信方式。 |
| 上游正式来源 | `projects/L3-method-library/02-概要设计.md` | direct_design_input | `R3.7`~`R3.14` | 作为 03 直接输入,提供八组件、接口族、处理流、状态、异常、配置影响和承接清单。 |
| 概要承接来源 | `02_hld_step_12_detailed_design_handoff.md` | explanatory_handoff | `R3.8`,`R3.13`~`R3.14` | 解释 03 / 04 分工和旧主线排除项;若与正式 02 冲突,以正式 02 为准。 |
| 概要承接来源 | `02_hld_step_13_risks_open_questions.md` | explanatory_risk | `R3.8`,`R3.12`,`R3.17`~`R3.18` | 提供风险输入,尤其是实现端私补、配置绕界和外部摘要不可用。 |
| 概要承接来源 | `02_hld_step_14_formal_document_assembly.md` | explanatory_assembly | `R3.13`~`R3.16` | 确认正式 02 已装配,旧 `03_ddd_*` 不能反推概要结论。 |
| 本地核对来源 | `/home/aris/Projects/quantalithos-core` 等 sibling repo | local_verification | `R3.9`~`R3.10` | 只验证本地候选路径和 crate 可用性,不因存在而产生 compile dependency。 |
| 本地核对来源 | `/home/aris/Projects/quantalithos-method-library` 目标实现仓候选 | local_verification | `R3.7`~`R3.10`,后续实施计划 | 后续核对 workspace、package、crate、git config 和提交配置。 |
| 历史来源 | 旧 `03-详细设计.md` 与旧 `03_ddd_step_*.md` | historical_material | `R3.13`~`R3.16` | 只作污染审计和改写对照,不得作为当前结论来源。 |

### 3. 来源优先级规则

| 场景 | 优先级规则 |
|---|---|
| 正式 `00/01/02` 与旧 `03` 或旧 `03_ddd_*` 冲突 | 以正式 `00/01/02` 为准;旧材料只能进入历史差异审计。 |
| 正式 `02-概要设计.md` 与 `02_hld_*` 中间产物冲突 | 以正式 `02-概要设计.md` 为准;中间产物只解释来源和风险。 |
| 规范文档与项目正式文档关注点不同 | 规范文档定义流程、格式和红线;项目正式文档定义领域边界、依赖和业务约束。 |
| 本地 sibling repo 存在但正式依赖类型未裁决 | 本地存在只证明可核对,不得自动变成 Cargo path dependency。 |
| 实现端发现缺 schema / port / DTO / mapper / config / evidence | 不得用实现仓私补;必须回到对应设计 Step 闭口。 |
| 旧对象或旧主线看似可复用 | 只有在当前 `00/01/02` 或本轮新 Step 重新命名、重新归属、重新闭口后才可进入。 |

### 4. 后续模块落点

| 后续模块 | 使用的来源池 | 预期产物 |
|---|---|---|
| `R3.7`~`R3.8` | SOP、书写规范、Rust 规范、README、正式 `00/01/02`、目标实现仓核对项 | 语言、Rustdoc、runtime / framework、repo discipline、提交和 git config 约束。 |
| `R3.9`~`R3.10` | 正式 `00/01/02` 依赖分类、本地 sibling repo、可落码性标准 | compile / runtime / event / adapter / fake 分类和 path dependency 口径。 |
| `R3.11`~`R3.12` | 正式 `00/01/02` 非目标、安全边界、概要风险来源 | 安全 / 鉴权 / 外部正文 / 下游运行 truth 边界表。 |
| `R3.13`~`R3.14` | 旧 Step 3、旧正式 03、概要排除项 | 历史内容禁入、后移或重定义表。 |
| `R3.15`~`R3.16` | 已确认的 `R3.8`、`R3.10`、`R3.12`、`R3.14` 结果 | 正式 §3 回填草稿,仍不直接修改正式 `03-详细设计.md`。 |
| `R3.17`~`R3.18` | 全部 Step 3 中间产物和规范红线 | Step 3 自检、停审记录和进入 Step 4 条件。 |

### 5. 来源池阶段不裁决事项

| 事项 | 推迟到 |
|---|---|
| Rustdoc / 源码注释最终语言 | `R3.7`~`R3.8` |
| 是否锁定 HTTP / RPC / database / queue / scheduler 等具体 framework | `R3.7`~`R3.8` |
| 是否写入 `L0-core` 或其他 crate 的 Cargo path dependency | `R3.9`~`R3.10` |
| 目标实现仓 package / crate / module 名称 | `R3.9`~`R3.10` 与 Step 4 |
| 安全 / 鉴权 / gateway 的实现归属 | `R3.11`~`R3.12` |
| 正式 `03-详细设计.md` §3 文本 | `R3.15`~`R3.16` 或 Step 19 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写来源池正式记录 | pass |
| 是否写清权威级别和优先级 | pass |
| 是否写清后续模块落点 | pass |
| 是否保留 Rustdoc、framework、path dependency、安全边界到后续模块 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.7` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.7 语言 / runtime / 仓库约束裁决:先思考`;只允许思考 Rust、runtime、framework、repo discipline、提交和 git config 约束草案,不得直接修改正式 `03-详细设计.md`,不得写跨仓依赖最终裁决,不得进入 `R3.8` 或 Step 4。

---

## R3.7 语言 / runtime / 仓库约束裁决:先思考

### 1. 本模块要回答的问题

本模块只形成裁决草案,不写最终约束表。`R3.8` 才把草案写成 Step 3 的语言、注释、runtime、仓库和提交约束记录。

| 问题 | 草案判断 |
|---|---|
| 本仓实现语言是否应收敛为 Rust? | 是。`projects/README.md` 将 L3 method-library 语言建议列为 Rust,详细设计规范也要求 Rust 契约片段。 |
| 设计文档 Rustdoc 与实现仓源码语言是否冲突? | 需要分层。设计文档中的 Rust 契约片段按书写规范使用中文 Rustdoc;实现仓真实源码按 `standards/coding/rust.md` 和 README 使用英文标识符、英文普通注释、英文 rustdoc 和英文测试名。 |
| 是否现在锁定 HTTP / RPC / database / queue / scheduler 等 framework? | 不锁定。当前 02 只固定 Command / Query / Inbound Event / Outbound Event / Operations Job 接口族和边界,未固定具体 framework。 |
| 是否现在写跨仓 Cargo path dependency? | 不写。本模块只处理语言 / runtime / 仓库纪律;path dependency 留给 `R3.9`~`R3.10`。 |
| 实施者开始前是否必须核对提交规范和 git config? | 是。README §8.2 是提交规范来源;目标实现仓当前 git config 可读到 `quantalithos-labs <quantalithos.ai@gmail.com>`,后续实施前仍需重新核对。 |

### 2. 已读取线索

| 来源 | 线索 | 对本模块的影响 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 3 | 必须确认语言、编码、注释、仓库、提交、runtime、依赖和安全边界;必须点名 Rust 编码规范、rustdoc、提交规范和 git config。 | `R3.8` 必须写入这些项目,不能只写“遵守 Rust 规范”。 |
| `详细设计书写规范.md` §5.3 | §3 必须输出编码规范承接表、实现约束表和本地多仓依赖约束表;只有编译期依赖才能 path dependency。 | 本模块只覆盖前两类中的语言 / runtime / 仓库部分;多仓依赖留后。 |
| `详细设计书写规范.md` §4.3 | 设计文档对象、字段、enum、variant、trait、公开函数要 Rustdoc 风格中文注释。 | 这是设计文档契约表达规则,不等于实现仓源码语言。 |
| `standards/coding/rust.md` 源码语言约束 | 实现仓 Rust 源码默认英文;标识符、普通注释、rustdoc、错误说明注释和测试名必须英文。 | `R3.8` 需明确“设计中文契约注释 -> 实现英文源码注释”的分层。 |
| `projects/README.md` §8.2 | 设计仓 commit 格式为 type 英文、subject 中文;实现仓代码 commit message 使用英文;实现 agent 记忆只能来自实施计划种子表。 | 设计阶段提交和未来实现仓提交要分开写。 |
| `00/01/02` 正式输入 | 本仓保持 Definition vs Use,下游运行 truth、外部正文、gateway / auth / worker / scheduler / queue 机制不得提前固定。 | Runtime 约束应写边界和 port / adapter 分层,不写具体产品栈。 |

### 3. 语言与注释分层草案

| 层面 | 草案口径 | 原因 |
|---|---|---|
| 详细设计文档 | Rust 代码块必须使用 `rust`;契约片段可用中文 Rustdoc 表达业务语义。 | 书写规范要求中文 Rustdoc,便于设计讨论和审查。 |
| 实现仓源码 | 标识符、模块名、类型名、函数名、变量名、测试名、普通注释、rustdoc 和错误说明注释使用英文。 | Rust 编码规范和 README 明确实现仓源码默认英文。 |
| 契约到源码转换 | 实现者不得直接复制设计文档中文注释到源码;应将业务语义翻译为英文 rustdoc,并保持字段、variant、错误语义一致。 | 避免设计规范和源码规范互相覆盖。 |
| enum variant | 设计文档中每个 variant 必须有 Rustdoc 注释和变体表;实现仓每个公开 variant 也必须有英文 `///` 注释。 | SOP 明确 enum variant 不得省略注释。 |
| 测试命名 | 设计文档可用中文说明测试意图;实现仓测试函数名使用英文 snake_case。 | 保持源码语言一致性和工具生态兼容。 |

### 4. Runtime / framework 草案

| 主题 | 草案口径 | 不采用方案 |
|---|---|---|
| Runtime 类型 | 详细设计按 application service、domain service、repository / port、adapter、consumer、event publisher、operations job 分层表达。 | 不在 Step 3 把某个 web / RPC / queue / scheduler 框架写死。 |
| 同步 / 异步 | Command / Query / Consumer / Job 是否 async 由 Step 7~9 的 port 与 flow 根据外部 IO、事务和调度边界决定。 | 不在 Step 3 全局规定所有接口 async 或全部同步。 |
| 持久化 | 当前不锁定 PostgreSQL、cache、object storage 或具体 migration 工具。 | 不恢复旧 Step 3 的 PostgreSQL / snapshot / outbox 前置。 |
| 事件 | Outbound Event 是已成立事实或材料变化的协议边界,不等同于 outbox、relay、topic 或投递保证。 | 不在 Step 3 写 topic、payload schema、retry 或 subscriber 机制。 |
| Operations Job | Job 只刷新派生材料、追溯材料、恢复收敛和外围读取材料,不修 core truth。 | 不把 worker / scheduler / queue 机制作为业务边界。 |

### 5. 仓库纪律与提交草案

| 主题 | 草案口径 | 后续落点 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-method-library` 作为当前本地候选实现仓;具体 package / crate / workspace 结构不在本模块裁决。 | `R3.9`~`R3.10`,Step 4,实施计划 |
| git config | 当前读取到目标实现仓 `user.name = quantalithos-labs`,`user.email = quantalithos.ai@gmail.com`;实施前仍需按门禁再次核对。 | `R3.8`,后续 `07-实施计划.md` |
| 设计仓提交 | 本 design 文档仓使用 README §8.2: type 英文、subject 中文,非微小提交写 body。 | 当前文档提交阶段 |
| 实现仓提交 | 代码 commit message 使用英文;若目标仓有更严格规范,取更严格者。 | 后续实施计划和代码实施台账 |
| 实现 agent 记忆 | 不得从对话或详细设计正文自由总结永久记忆;只能从实施计划种子表生成。 | `07-实施计划.md` |

### 6. R3.8 写入策略

`R3.8` 应把本模块草案落成以下记录:

- 编码规范承接记录: Rust 规范、设计文档 Rustdoc、实现仓英文源码、enum variant 注释、测试命名。
- 实现约束记录: runtime / framework 不提前锁定、port / adapter 分层、config 不改 truth、缺 schema / port / DTO / mapper / config / evidence 必须回设计。
- 仓库纪律记录: 目标实现仓候选、git config 核对、设计仓提交规范、实现仓提交规范。

`R3.8` 不得写:

- 跨仓依赖最终裁决或本地 path dependency 表。
- 安全 / 鉴权 / 外部边界最终表。
- 正式 `03-详细设计.md` 正文。
- Step 4 文件布局。

### 7. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只形成语言 / runtime / 仓库约束草案 | pass |
| 是否未写最终编码规范承接表 | pass |
| 是否未写 path dependency 最终裁决 | pass |
| 是否未锁定具体 framework | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.8` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.8 语言 / runtime / 仓库约束裁决:再写入`;只允许写入语言、注释、runtime、仓库和提交约束记录,不得直接修改正式 `03-详细设计.md`,不得写跨仓依赖最终裁决,不得进入 `R3.9` 或 Step 4。

---

## R3.8 语言 / runtime / 仓库约束裁决:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 3 收稳编码规范、语言 / runtime、仓库约束 |
| 当前模块 | `R3.8 语言 / runtime / 仓库约束裁决:再写入` |
| 上一模块 | `R3.7 语言 / runtime / 仓库约束裁决:先思考` |
| 用户确认 | 已确认进入 `R3.8` |
| 本模块允许写入 | 语言、注释、runtime、仓库和提交约束记录 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、跨仓依赖最终裁决、本地 path dependency 表、安全 / 鉴权最终表、Step 4 文件布局 |
| 下一模块 | `R3.9 跨仓依赖与本地 sibling repo:先思考` |

本模块将 `R3.7` 草案固化为 Step 3 中间产物记录。这里形成的是 §3 主体结论之一,但仍停留在 design-calibration 文件中;正式 `03-详细设计.md` 只能由后续回填模块或 Step 19 装配。

### 2. 编码规范承接记录

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | 实现仓 Rust 源码默认英文;标识符、模块名、类型名、函数名、变量名、测试名、普通注释、rustdoc 和错误说明注释必须使用英文。 | 后续所有 Rust 类型、trait、DTO、error、测试和源码注释约束均以英文实现为准。 |
| `standards/document/详细设计书写规范.md` §4.3 | 详细设计中的对象、字段、enum、enum variant、trait 和公开函数必须使用 Rustdoc 风格中文注释。 | 设计文档 Rust 契约片段使用中文解释业务语义,但不得被实现者原样复制到源码。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 3 | 必须点名 Rust 编码规范来源、rustdoc 风格注释要求、enum variant 不得省略注释、提交规范和 git config 阅读要求。 | 本 Step 明确注释分层、提交前置阅读和后续实施门禁。 |
| `projects/README.md` §8.2 | 设计仓 commit 信息 type 英文、subject 中文;实现仓代码 commit message 使用英文;实现 agent 记忆只允许来自 `07-实施计划.md` 种子表。 | 设计提交与实现提交分开约束,实施计划必须继续承接提交和记忆来源规则。 |

### 3. 语言与注释约束记录

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 实现语言 | 本仓详细设计默认面向 Rust 实现;后续对象、trait、DTO、error、flow 伪代码均应能直接转译为 Rust。 | 全部 domain / application / contract / infra / tests |
| 设计文档 Rustdoc | 中间产物和正式 03 的 Rust 契约片段可使用中文 Rustdoc 说明业务语义。 | Step 6~Step 8 的对象、variant、trait、DTO、公开函数 |
| 实现仓源码语言 | 真实源码必须使用英文标识符、英文普通注释、英文 rustdoc、英文错误说明注释和英文测试名。 | 目标实现仓所有 Rust crate |
| 契约到源码转换 | 实现者必须把设计中文 Rustdoc 翻译为英文源码 rustdoc,并保持字段、variant、错误语义和边界条件一致。 | 实施计划、代码实施台账、代码 review |
| enum variant 注释 | 设计文档每个 enum variant 必须有 Rustdoc 注释和变体表;实现仓公开 enum variant 必须有英文 `///` 注释。 | 状态类 enum、错误 enum、协议 enum、kind / marker enum |
| 测试命名 | 设计文档可中文描述测试意图;实现仓测试函数名使用英文 snake_case。 | unit / integration / contract tests |

### 4. Runtime / framework 约束记录

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 不提前锁定具体 framework | Step 3 不固定 HTTP、RPC、database、queue、scheduler、cache、object storage 或 migration 工具。 | Step 4~Step 14 |
| 分层表达 runtime | 后续以 domain service、application service、repository / port、adapter、consumer、event publisher、operations job 分层表达 runtime 责任。 | Step 4、Step 7、Step 8、Step 9 |
| async 不作全局假设 | Command、Query、Consumer、Job 是否 async 由 port、外部 IO、事务和调度边界在 Step 7~Step 9 裁决。 | Step 7、Step 9、Step 11、Step 13 |
| 事件不等于 outbox | Outbound Event 只表达已成立事实、材料状态或外围组织变化的协议边界;不等同于 outbox、relay、topic 或投递保证。 | Step 8、Step 9、Step 11、Step 14 |
| Operations Job 不修 core truth | Job 只刷新派生读取材料、追溯材料、恢复收敛和外围读取材料,不得重做正式化或修复 core truth。 | Step 8、Step 9、Step 10、Step 12 |
| 配置不得改 truth | 配置只能影响 assembly、adapter、profile、job、transport、projection material 等承载面,不得改变 truth owner、状态机或 body-free 边界。 | Step 14,后续 `04-配置设计.md` |
| 缺口必须回设计 | 若后续缺 schema / port / DTO / mapper / config / evidence schema,实现端不得私补,必须回对应设计 Step 闭口。 | Step 6~Step 17,实施计划 |

### 5. 仓库纪律与提交约束记录

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| 目标实现仓候选 | 当前本地候选实现仓为 `/home/aris/Projects/quantalithos-method-library`;具体 workspace、package、crate 和 module 名称后续核对。 | `R3.9`~`R3.10`,Step 4,实施计划 |
| git config 前置核对 | 当前读取到目标实现仓 `user.name = quantalithos-labs`,`user.email = quantalithos.ai@gmail.com`;实施前必须按门禁再次核对。 | `07-实施计划.md`,代码实施台账 |
| 设计仓提交规范 | 本 design 仓 commit 使用 README §8.2: type 英文、subject 中文,非微小提交必须写 body。 | 当前设计文档提交 |
| 实现仓提交规范 | 代码 commit message 使用英文;若目标实现仓有更严格规范,取更严格者。 | 后续实现仓提交 |
| 实现 agent 记忆来源 | 实现 agent 永久记忆只能从 `07-实施计划.md` 种子表生成,不得从对话或详细设计正文自由总结。 | `07-实施计划.md`,实施台账 |

### 6. 留给 R3.9 的事项

| 事项 | 原因 |
|---|---|
| `L0-core` 是否写成本地 path dependency | 必须先核对正式依赖类型、真实 sibling repo、Cargo package 和 crate 名。 |
| `L0-bus` 如何作为 event 协作依赖表达 | 事件协作不得直接变成 Cargo dependency,需要在 `R3.9`~`R3.10` 分类。 |
| process / identity / runtime / member-images 等运行期关系如何表达 | 运行期依赖需进入 adapter、event、projection、external service 或 fake 策略,不是本模块范围。 |
| 本地多仓依赖约束表 | 这是 `R3.10` 的写入对象,本模块不提前生成。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入语言、注释、runtime、仓库和提交约束记录 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写跨仓 path dependency 最终表 | pass |
| 是否未锁定具体 framework | pass |
| 是否未进入 `R3.9` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.9 跨仓依赖与本地 sibling repo:先思考`;只允许思考 compile / runtime / event / adapter / fake 依赖裁决草案和本地 sibling repo 核对计划,不得直接修改正式 `03-详细设计.md`,不得写 path dependency 最终表,不得进入 `R3.10` 或 Step 4。

---

## R3.9 跨仓依赖与本地 sibling repo:先思考

### 1. 本模块要回答的问题

本模块只形成跨仓依赖裁决草案和本地核对记录,不写最终本地多仓依赖约束表。`R3.10` 才能把本模块草案落成表格和不可用处理口径。

| 问题 | 草案判断 |
|---|---|
| 哪些关系可以成为 Cargo path dependency 候选? | 只有正式 `00/01/02` 已裁剪为编译期依赖的关系可以进入候选;当前只有 `L0-core`。 |
| `L0-bus` 是否可写成 Cargo path dependency? | 不可以。正式需求和架构均将其定义为事件协作依赖,应进入 event / publisher / transport / fake 协作口径。 |
| process / identity / runtime / member-images 是否可写成源码依赖? | 不可以。它们是运行期消费方或运行期关系,不得因为本地仓存在而写成 package dependency。 |
| 本地 repo 存在是否等于依赖成立? | 不等于。本地存在只支持路径和 crate 可用性核对,不能覆盖正式依赖类型。 |
| 当前是否写最终 Cargo 引用? | 不写。`R3.10` 才写候选 path dependency 口径和不可用处理。 |

### 2. 正式依赖类型复核

| 关联项目 | 正式依赖类型 | 当前 Step 3 草案口径 | 依据 |
|---|---|---|---|
| `L0-core` | 编译期依赖 | 可以进入本地 path dependency 候选。 | `00-需求文档.md` §6.3~§6.6;`01-架构设计.md` §8;ADR-ML-ARCH-009。 |
| `L0-bus` | 事件协作依赖 | 不得写 Cargo dependency;后续通过 event boundary / publisher / transport / fake 表达。 | `00-需求文档.md` §6.3~§6.6;`01-架构设计.md` §7~§8。 |
| `L1-process` | 运行期依赖 / 被依赖方消费本仓 | 不得写源码依赖;通过正式查询、消费材料、SDK / API 或 fake 协作。 | Definition vs Use;需求禁止 process 拥有定义 truth。 |
| `L1-identity` | 运行期依赖 / 被依赖方消费本仓 | 不得写源码依赖;只可通过角色定义引用、快照、正式查询或 fake。 | identity 不拥有方法资产定义正文。 |
| `L2-runtime` | 运行期依赖 / 被依赖方消费本仓 | 不得写源码依赖;运行时消费语义通过 runtime adapter / API / SDK / fake。 | runtime 不拥有定义 truth。 |
| `L2-member-images` | 运行期依赖 / 被依赖方消费本仓 | 不得写源码依赖;Role -> image variant 定义来源通过正式边界供给。 | member-images 不 hardcode 角色映射。 |
| `L0-sdk` / `L5-console` / `L6-marketplace` / `L4-observability` / `L1-governance` / `L1-artifact` | 非当前主链或候选关系 | 不进入 Step 3 本地 path dependency。 | 当前需求裁剪为否或候选。 |

### 3. 本地 sibling repo 核对记录

| 本地对象 | 当前核对事实 | 草案处理 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core` | 路径存在;含 Cargo workspace;`crates/contracts/Cargo.toml` package = `core-contracts`,lib = `core_contracts`。 | 作为 `L0-core` 编译期依赖候选;`R3.10` 再写本地 path 口径。 |
| `/home/aris/Projects/quantalithos-method-library` | 目标实现仓路径存在;含 Cargo workspace;已有 `method_library_domain`、`method_library_contracts`、`method_library_application`、`method_library_infra`、`method_library_api`、`method_library_worker`。 | 只作为目标仓核对输入;现有 workspace 不反向覆盖正式 03。 |
| `/home/aris/Projects/quantalithos-bus` | 路径存在。 | 事件协作依赖,不得因为存在而写 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-process` | 路径存在。 | 运行期关系,不得写 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-identity` | 路径存在。 | 运行期关系,不得写 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-sdk` | 路径存在。 | 当前非主链运行期封装关系,不得写 Cargo path dependency。 |
| `/home/aris/Projects/quantalithos-runtime` | 未按该路径找到。 | 不用缺失路径补设计结论;后续如需运行期对接,由 adapter / external binding / fake 处理。 |
| `/home/aris/Projects/quantalithos-member-images` | 未按该路径找到。 | 不用缺失路径补设计结论;后续如需运行期对接,由 adapter / external binding / fake 处理。 |

### 4. 依赖协作方式草案

| 依赖类型 | 草案协作方式 | 不可用时草案处理 |
|---|---|---|
| 编译期依赖 | 已确认的 compile 关系可以写本地 path dependency;当前候选是 `core-contracts`。 | 若本地仓或 crate 缺失,设计 / 实施计划必须暂停该依赖闭口,不得在本仓重定义 core 类型。 |
| 事件协作依赖 | 通过 event contract、publisher port、transport binding、event fake 或后续配置绑定表达。 | 本地 bus 不可用时不改 Cargo;测试用 fake / fixture 只能模拟正式 event boundary。 |
| 运行期依赖 | 通过 API / SDK / adapter / projection / read material / fake / external service boundary 表达。 | 依赖服务不可用时走 degraded / unavailable / job failed / fake fixture 等正式分支,不得链接对方业务 crate。 |
| 候选 / 外围关系 | 只作为后续能力、接口或配置 Step 的审计对象。 | 不阻塞当前 Step 3;不得提前写入实现仓依赖。 |

### 5. R3.10 写入策略

`R3.10` 应写入:

- 本地多仓依赖约束表。
- `L0-core` / `core-contracts` 的候选 path dependency 口径和中期 private git tag / rev 口径。
- `L0-bus`、process、identity、runtime、member-images 的非 Cargo 协作方式。
- 依赖不可用时的暂停、fake、adapter 或后续设计闭口处理。

`R3.10` 不得写:

- 安全 / 鉴权 / 外部正文最终边界。
- 正式 `03-详细设计.md` 正文。
- Step 4 文件布局。
- 未经正式依赖类型确认的 Cargo path dependency。

### 6. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只形成依赖裁决草案 | pass |
| 是否核对本地 sibling repo 事实 | pass |
| 是否未写最终 path dependency 表 | pass |
| 是否未把运行期 / event 依赖写成 Cargo dependency | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.10` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.10 跨仓依赖与本地 sibling repo:再写入`;只允许写入跨仓依赖约束表、候选 path dependency 口径和不可用处理,不得直接修改正式 `03-详细设计.md`,不得写安全 / 鉴权最终表,不得进入 `R3.11` 或 Step 4。

---

## R3.10 跨仓依赖与本地 sibling repo:再写入

### 1. 写入记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 3 收稳编码规范、语言 / runtime、仓库约束 |
| 当前模块 | `R3.10 跨仓依赖与本地 sibling repo:再写入` |
| 上一模块 | `R3.9 跨仓依赖与本地 sibling repo:先思考` |
| 用户确认 | 已确认进入 `R3.10` |
| 本模块允许写入 | 跨仓依赖约束表、候选 path dependency 口径、非 Cargo 协作方式和不可用处理 |
| 本模块禁止写入 | 正式 `03-详细设计.md` 正文、安全 / 鉴权最终表、Step 4 文件布局、未经正式依赖类型确认的 Cargo dependency |
| 下一模块 | `R3.11 安全 / 鉴权 / 外部边界:先思考` |

本模块将 `R3.9` 草案固化为 Step 3 的跨仓依赖约束记录。它只说明依赖类型与实现承接口径,不定义具体 port、DTO、event schema、adapter constructor 或配置 key;这些内容分别留给后续详细设计 Step 和配置设计。

### 2. 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | 本地 path dependency 候选;Cargo package `core-contracts`,lib crate `core_contracts` | private git dependency 固定 tag / rev,由实施计划或发布阶段裁决 | contracts / domain / application 中需要共享 typed ref、基础引用和跨仓一致性基线的单元 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不写 Cargo dependency;通过 event boundary、publisher port、transport binding、event fake 表达 | 后续若形成共享 event contract,必须先回 Step 8 / Step 14 闭口 | outbound event / inbound consumer / publisher adapter / tests |
| `quantalithos-process` | 运行期消费关系 | `/home/aris/Projects/quantalithos-process` | 不写 Cargo dependency;通过正式查询、消费材料、API / SDK / adapter / fake 表达 | 后续由接口、配置或实施计划固定运行期对接 | controlled consumption / read material / downstream boundary |
| `quantalithos-identity` | 运行期消费关系 | `/home/aris/Projects/quantalithos-identity` | 不写 Cargo dependency;通过角色定义引用、safe summary、API / SDK / adapter / fake 表达 | 后续由接口、配置或实施计划固定运行期对接 | role definition / identity semantic consumption |
| `quantalithos-runtime` | 运行期消费关系 | 当前未按 `/home/aris/Projects/quantalithos-runtime` 找到 | 不写 Cargo dependency;缺本地路径不改变正式依赖类型 | 后续若存在目标仓或服务,由配置 / 实施计划绑定 | runtime method / role / template semantic consumption |
| `quantalithos-member-images` | 运行期消费关系 | 当前未按 `/home/aris/Projects/quantalithos-member-images` 找到 | 不写 Cargo dependency;缺本地路径不改变正式依赖类型 | 后续若存在目标仓或服务,由配置 / 实施计划绑定 | Role -> image variant definition consumption |

### 3. Cargo 引用口径

`L0-core` 是当前唯一允许进入 Cargo dependency 候选的正式编译期依赖。候选写法只作为后续实现仓核对口径,不得在本设计仓直接改实现仓:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

使用该候选写法前必须再次确认目标实现仓与 `quantalithos-core` 的相对路径。如果目标实现仓仍为 `/home/aris/Projects/quantalithos-method-library`,上述相对路径成立;若实施目录变化,必须重新计算 path。

不得将以下关系写成 Cargo dependency:

- `L0-bus` 事件协作依赖。
- `L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 运行期消费关系。
- `L0-sdk`、`L5-console`、`L6-marketplace`、`L4-observability`、`L1-governance`、`L1-artifact` 等当前非主链或候选关系。

### 4. 不可用处理

| 场景 | 处理口径 |
|---|---|
| `quantalithos-core` 或 `core-contracts` 不存在 | 暂停编译期依赖闭口;不得在本仓私造 core shared ref、trace context 或基础引用类型。 |
| `core-contracts` package / lib 名称变化 | 回到 Step 3 / Step 4 / Step 7 重新核对依赖表和代码布局,不得让实现端猜 crate 名。 |
| `quantalithos-bus` 不可用 | 不改 Cargo;事件边界测试只能使用正式 event fake / fixture,不得把 bus 业务实现链接进来。 |
| process / identity / runtime / member-images 运行期目标不可用 | 使用正式 adapter unavailable / degraded / fake fixture / job failed 等后续设计分支;不得改成源码依赖。 |
| 目标实现仓 workspace 结构与当前核对不同 | 以实施前 gate 重新核对为准,并回写实施计划;不得用当前本地观察反推正式 03。 |

### 5. 后续承接

| 后续位置 | 承接内容 |
|---|---|
| Step 4 | 根据本约束决定 crate / module layout 中哪些单元可引用 `core_contracts`,哪些只能使用本仓内部 type 或 adapter port。 |
| Step 7 | 为运行期依赖和事件协作定义正式 port / adapter / publisher / consumer 接缝。 |
| Step 8 | 定义 Command / Query / Event / Job 协议时,区分 public DTO、shared ref 和 event boundary。 |
| Step 14 | 配置绑定 external adapter、transport、profile、fake 和 unavailable / degraded 映射。 |
| `07-实施计划.md` | 实施前重新核对 sibling repo、Cargo package / crate 名、git config 和本地 path 是否成立。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写跨仓依赖约束记录 | pass |
| 是否只把 `L0-core` / `core-contracts` 写为编译期依赖候选 | pass |
| 是否未把运行期 / event 依赖写成 Cargo dependency | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.11` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.11 安全 / 鉴权 / 外部边界:先思考`;只允许思考安全入口、actor metadata、外部正文禁区和下游运行 truth 边界草案,不得直接修改正式 `03-详细设计.md`,不得写安全 / 鉴权最终表,不得进入 `R3.12` 或 Step 4。

---

## R3.11 安全 / 鉴权 / 外部边界:先思考

### 1. 本模块要回答的问题

本模块只形成安全、鉴权和外部边界草案,不写最终表。`R3.12` 才能将草案落成 Step 3 的安全 / 外部边界约束记录。

| 问题 | 草案判断 |
|---|---|
| 本仓是否实现认证登录、权限系统或 gateway? | 不实现。认证登录、鉴权实现正文和 gateway 运行机制不属于本仓 truth 范围。 |
| 本仓如何承接 actor? | 只承接 `ActorContext`、metadata、source envelope、system / integration actor 等正式字段;后续协议必须明确 actor authority kind、scope 要求和 trusted source 例外。 |
| 外部治理、标准、artifact、ADR、下游回报如何进入? | 只能以 body-free ref / summary / marker / safe reason / trace context 进入,不得复制正文或外部 API payload。 |
| 下游运行 truth 是否可回写本仓? | 不可以。process、identity、runtime、member-images、marketplace、console、artifact 等运行状态不得成为本仓定义 truth。 |
| 日志、diagnostic、metric 是否可保存敏感正文? | 不可以。raw request、raw event payload、adapter response body、stack trace、credential、secret、external document body 等不得进入日志 / diagnostic。 |

### 2. 已读取线索

| 来源 | 线索 | 对本模块的影响 |
|---|---|---|
| `00-需求文档.md` 数据归属表 | 明确认证登录与鉴权实现正文、artifact / archive 正文、治理执行正文、成员状态、流程运行正文等禁止保存。 | `R3.12` 必须写成外部正文禁区和下游运行 truth 禁区。 |
| `00-需求文档.md` NFR-ML-007~008 | 本仓不得越权拥有相邻仓运行真相;下游不得绕过本仓定义真相边界创建或修改方法资产定义。 | 安全边界要保护 Definition vs Use。 |
| `01-架构设计.md` 横切关注点 | 外部能力和下游消费必须通过正式边界进入或使用,不得直接触达、替代或改写核心方法资产定义。 | `R3.12` 需写正式边界与禁止直连。 |
| `02-概要设计.md` 接口分类 | Command / Query / Consumer / Event / Job 均有 body-free、summary/ref-only 和不改 core truth 边界。 | 后续 Step 8~9 必须按接口族继承安全边界。 |
| `设计真相源闭环与可落码性标准.md` Actor authority | actor / consumer / source actor / trusted source 例外必须明确字段来源、authority kind、scope membership 和 gate。 | 后续协议不能只写裸 `actor_ref`。 |
| `设计真相源闭环与可落码性标准.md` 可观测性安全 | trace / audit / metric / log / diagnostic 只能记录 body-free refs 和 redacted issue;禁止 raw body、secret、credential、stack trace 等。 | `R3.12` 需写日志和诊断边界。 |

### 3. 安全入口草案

| 入口类型 | 草案口径 | 不在本仓实现 |
|---|---|---|
| Command API | 输入携带 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、typed ref、summary ref、safe reason ref;只改写本仓拥有的 truth 或正式边界。 | 登录、token 颁发、权限矩阵、gateway route enforce。 |
| Query API | 输入携带 `ActorContext`、`QueryMetadata`、scope / subject / context typed ref、page / filter summary;只读,不刷新材料、不修复 truth。 | UI session、下游授权策略执行、raw payload 返回。 |
| Inbound Event Consumer | 只承接外部系统或相邻仓已成立的 body-free fact;输入包含 source envelope、source event id、source system ref、schema / version、dedup key、trace context、typed external ref / summary / marker。 | raw document、artifact body、治理执行正文、下游运行状态或 marketplace transaction。 |
| Outbound Event | 只输出本仓已成立事实、材料状态、维护状态或外围组织变化的 typed ref / summary ref / safe reason / marker / trace context。 | topic、payload body、outbox relay、retry、subscriber 保证。 |
| Operations Job | 只刷新派生材料、追溯材料、恢复收敛和外围读取材料。 | core truth repair、正式化重做、外部正文复制、worker / scheduler 实现。 |

### 4. Actor / metadata 草案

| 主题 | 草案口径 | 后续必须闭合位置 |
|---|---|---|
| actor 来源 | 来自 command metadata、query metadata、event envelope、consumer context、job context 或系统生成字段。 | Step 8 协议契约;Step 9 flow |
| authority kind | 必须区分业务参与者、系统执行者、外部集成入口、来源边界代理和 trusted source actor。 | Step 8;Step 10 状态 gate |
| scope 要求 | 是否要求 actor 属于 participant / membership / visibility scope,不得由实现端猜。 | Step 8;Step 9;Step 12 |
| trusted source 例外 | 如允许,必须列出 source kind、actor kind、入口协议和不可绕过的 digest / source isolation / body-free / idempotency / state gate。 | Step 8~Step 13 |
| metadata 唯一性 | metadata / idempotency / trace / request digest 不得双真相。 | Step 8;Step 13 |

### 5. 外部正文与下游 truth 禁区草案

| 禁区 | 草案口径 |
|---|---|
| 外部正文 | 外部标准、ADR、方法论来源、文档、示例、模板文件、外部 API payload 只能以 ref / summary / marker 承接。 |
| artifact / archive 正文 | artifact body、证据文件、archive package body 不进入本仓生命周期。 |
| 治理执行正文 | Gate 裁决执行过程、policy enforce 结果、治理运行状态不归本仓;本仓只可消费正式治理结论摘要或引用。 |
| 下游运行 truth | process instance、runtime execution context、member lifecycle、实际具备角色状态、member image build state、marketplace transaction、UI session 均不得回写为本仓 truth。 |
| 认证鉴权正文 | 登录、token、权限系统、gateway route enforce、credential 与 secret 不归本仓对象生命周期。 |
| 可观测正文 | raw log、event payload、adapter response、stack trace、secret、credential、raw endpoint、external document body 不得进 diagnostic / log。 |

### 6. R3.12 写入策略

`R3.12` 应写入:

- 安全 / 鉴权 / 外部边界约束表。
- Actor / metadata 约束表。
- 外部正文禁区和下游运行 truth 禁区表。
- 日志、diagnostic、metric、trace / audit 的安全承接口径。
- 后续 Step 8~15 的承接位置。

`R3.12` 不得写:

- 正式 `03-详细设计.md` 正文。
- 具体 gateway / auth 实现。
- 具体 DTO / port / event schema。
- 历史 Step 3 差异审计结论。
- Step 4 文件布局。

### 7. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只形成安全 / 外部边界草案 | pass |
| 是否未写最终边界表 | pass |
| 是否未定义 gateway / auth 实现 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.12` 或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.12 安全 / 鉴权 / 外部边界:再写入`;只允许写入安全 / 鉴权 / 外部边界约束表,不得直接修改正式 `03-详细设计.md`,不得进入历史 Step 3 差异审计,不得进入 `R3.13` 或 Step 4。

---

## R3.12 安全 / 鉴权 / 外部边界:再写入

### 1. 本模块写入范围

本模块将 `R3.11` 的草案落成 Step 3 的安全 / 鉴权 / 外部边界中间结论。该结论只约束后续详细设计如何定义 protocol、flow、state、persistence、error、config 和 observability,不在本模块创建具体 DTO、port、event schema、gateway 规则或 auth 实现。

| 项目 | 本模块结论 | 后续落点 |
|---|---|---|
| 认证 / 鉴权实现 | 本仓不实现登录、token、权限系统、gateway route enforce 或外部 policy engine。 | Step 8 只定义可信 actor / metadata 承接口径;具体 auth 由边界外系统负责。 |
| 安全入口 | 所有入口必须携带正式 typed actor / metadata / source context,不得只传裸字符串或 raw payload。 | Step 8 protocol;Step 9 flow;Step 12 error |
| 外部材料 | 外部治理、标准、artifact、ADR、文档、示例、模板和 API 响应正文不得进入本仓 truth。 | Step 6 object;Step 7 port;Step 11 persistence |
| 下游运行 truth | process、identity、runtime、member-images、marketplace、console、artifact 等运行状态不得回写为 method-library 定义 truth。 | Step 6 object;Step 9 flow;Step 10 state |
| 可观测安全 | log、diagnostic、metric、trace、audit 只能记录 body-free refs、markers、safe reason、redacted issue 和 trace context。 | Step 15 observability / audit |

### 2. 安全 / 鉴权边界约束表

| 约束 ID | 约束 | 允许 | 禁止 | 后续必须闭合 |
|---|---|---|---|---|
| ML-D03-S3-SEC-001 | 本仓只消费可信上下文,不拥有认证系统。 | `ActorContext`、`CommandMetadata`、`QueryMetadata`、`SourceEnvelope`、`JobContext` 等正式字段。 | 登录流程、credential store、token issue / refresh、gateway route enforce、权限矩阵正文。 | Step 8 必须定义每类入口的 actor / metadata 字段。 |
| ML-D03-S3-SEC-002 | actor authority 不得隐式推断。 | 通过正式 authority kind、source kind、scope membership、trusted source gate 表达。 | 从 raw member id、route path、query param、topic name、adapter name 或字符串拼 actor。 | Step 8 / Step 9 / Step 12 必须关闭 actor 来源和拒绝分支。 |
| ML-D03-S3-SEC-003 | 本仓安全判断服务于 Definition vs Use 边界。 | 校验方法资产定义 owner、scope、status、version、source isolation 和 safe material boundary。 | 代替下游运行权限、成员实际任职状态、流程运行授权或 marketplace 交易授权。 | Step 9 flow 不得把 Use-side authorization 写成本仓 truth。 |
| ML-D03-S3-SEC-004 | trusted source 例外必须显式列出。 | 明确 source kind、schema version、digest / dedup、body-free 输入、state gate 和 audit marker。 | 泛化写成“来自可信系统即可绕过 actor / scope / digest”。 | Step 8 / Step 13 必须给出幂等与重放约束。 |
| ML-D03-S3-SEC-005 | 安全失败必须形成正式 public / internal error。 | 使用 typed rejection、safe reason ref、redacted diagnostic ref、retry / non-retry 标记。 | 泄露 raw payload、credential、external body、stack trace 或外部响应正文。 | Step 12 必须定义错误模型和恢复口径。 |

### 3. Actor / metadata 约束表

| 字段族 | 最低要求 | 不可接受写法 | 承接 Step |
|---|---|---|---|
| actor ref | 必须是后续定义的 typed ref / context 字段,并带 authority kind。 | `String actor`,裸 UUID,从 route / query / topic 临时解析。 | Step 6 object;Step 8 protocol |
| command metadata | 必须包含 request / causation / idempotency / actor / trace 的正式承接字段或 refs。 | command body 混入 auth token、raw credential、UI session 或 gateway header 原文。 | Step 8;Step 13 |
| query metadata | 必须表达 actor、visibility / read scope、request context、safe pagination / filter。 | 通过 query param 直接决定权限或返回外部正文。 | Step 8;Step 9;Step 12 |
| event source metadata | 必须表达 source system ref、source event id、schema version、dedup key、trace context 和 body-free material refs。 | 直接保存 raw event payload、external document body 或 adapter response body。 | Step 8;Step 13;Step 15 |
| job metadata | 必须表达 system actor、job run ref、target ref、safe reason、retry context 和 trace context。 | worker / scheduler 私有上下文反向成为领域 truth。 | Step 8;Step 9;Step 15 |
| audit metadata | 必须以 actor / source / safe reason / marker / trace context 组合记录。 | 保存 token、credential、stack trace、raw endpoint、raw request / response。 | Step 15 |

### 4. 外部正文禁区表

| 外部材料 | 允许进入本仓的形态 | 禁止进入本仓的形态 | 设计影响 |
|---|---|---|---|
| 外部标准 / 方法论来源 | `StandardSourceRef`、`SourceSummaryRef`、digest marker、version marker、safe citation ref。 | 标准全文、章节正文、大段摘录、外部文件 body。 | Step 6 对象只能持 ref / summary / marker。 |
| ADR / governance material | governance decision ref、gate result summary、policy version marker、safe reason ref。 | gate 执行日志全文、policy enforce 过程正文、人工讨论正文。 | Step 7 port 只能读取正式摘要。 |
| artifact / archive / evidence | artifact ref、archive ref、evidence summary ref、digest、retention marker。 | artifact body、archive package、evidence file content。 | Step 11 persistence 禁止正文列。 |
| 下游回报材料 | downstream report ref、safe handoff summary、consumption marker、issue ref。 | runtime report body、UI feedback body、marketplace transaction detail。 | Step 9 flow 只消费 summary / marker。 |
| 外部 API 响应 | adapter summary、safe status marker、redacted error ref、schema version。 | raw response body、headers with credentials、raw endpoint with secrets。 | Step 12 / Step 15 必须 redacted。 |

### 5. 下游运行 truth 禁区表

| 下游 / 相邻仓 | 不归本仓拥有的 truth | 本仓可承接形态 | 红线 |
|---|---|---|---|
| `L1-process` | process instance、step execution、approval runtime、running participant state。 | process definition ref、method capability ref、safe handoff summary。 | 不得用流程运行结果改写方法定义 truth。 |
| `L1-identity` | member lifecycle、actual role possession、career / memory runtime state、identity visibility truth。 | member / role / capability typed refs、safe identity summary。 | 不得在本仓复制 identity truth。 |
| `L2-runtime` | execution context、scheduler state、job worker runtime、runtime config truth。 | runtime profile ref、job target ref、run summary marker。 | Step 3 不锁定 queue / scheduler / worker 产品栈。 |
| `L2-member-images` | image build state、image artifact body、deployment state。 | image template ref、safe build summary ref、compatibility marker。 | 不得保存 image body 或 build log 正文。 |
| marketplace / console | transaction、subscription、UI session、tenant session、admin console state。 | public catalog summary ref、safe operator reason ref。 | 不得将 UI / marketplace 状态作为方法资产事实。 |
| artifact / archive | archive package、artifact content、retention body。 | artifact ref、archive ref、digest / retention marker。 | 不得将 artifact storage 设计成本仓 persistence。 |

### 6. 接口族承接边界

| 接口族 | 必须携带 | 只能做 | 不得做 |
|---|---|---|---|
| Command | actor context、command metadata、idempotency key、typed refs、safe reason refs。 | 创建 / 修改本仓拥有的 definition truth、support state 或正式边界对象。 | 执行登录鉴权、读取 raw external body、修复下游运行 truth。 |
| Query | actor context、query metadata、read / visibility scope refs、pagination / filter summary。 | 读取本仓 truth 或派生 read model,返回 body-free surface。 | 刷新材料、修复投影、返回 raw payload 或外部正文。 |
| Inbound Event | source envelope、source event id、schema version、dedup key、trace context、body-free refs / summaries。 | 将外部已成立事实转换为本仓允许的 marker / summary / state transition 输入。 | 保存 raw event、artifact body、治理执行正文或下游运行状态。 |
| Outbound Event | internal fact ref、summary ref、safe reason、marker、trace context。 | 发布本仓已成立事实的 body-free notification。 | 定义 relay / retry / subscriber 保证或输出正文 payload。 |
| Operations Job | system actor、job run ref、target ref、safe reason、retry context、trace context。 | 刷新派生材料、恢复外围读取材料、生成安全诊断。 | 重做正式化、越权改 core truth、复制外部正文。 |

### 7. 可观测与审计安全承接

| 通道 | 可记录 | 禁止记录 | 后续要求 |
|---|---|---|---|
| log | event name、typed refs、safe reason code、redacted issue id、duration、result marker。 | raw request、raw event payload、adapter response body、credential、secret、stack trace。 | Step 15 必须给出日志字段白名单。 |
| diagnostic | diagnostic ref、safe issue summary、redacted failure category、source marker、trace context。 | raw external body、headers with token、raw endpoint、stack trace正文。 | Step 12 / Step 15 必须定义 redaction。 |
| metric | counter / histogram name、status marker、component marker、latency bucket。 | high-cardinality raw id、payload fragment、tenant secret、external URL。 | Step 15 必须定义 cardinality 边界。 |
| trace | trace id、span kind、typed ref marker、safe status、causation ref。 | payload body、credential、raw SQL / raw endpoint、external document body。 | Step 15 必须定义 span attribute 白名单。 |
| audit | actor ref、authority kind、operation ref、safe reason ref、source ref、result marker。 | token、password、secret、raw request / response、外部正文。 | Step 15 必须给出审计对象和字段来源。 |

### 8. 后续 Step 承接清单

| Step | 必须继承的安全 / 外部边界 |
|---|---|
| Step 4 | crate / module layout 不得创建 auth / gateway / external body storage 模块;只能预留 boundary / adapter / mapper / diagnostic 位置。 |
| Step 5 | 模块契约主轴必须区分 definition truth、support state、operation material、peripheral relation 和 cross-cutting metadata。 |
| Step 6 | 对象字段不得含 raw external body、credential、secret、下游运行 truth 正文;actor / source / marker 必须 typed。 |
| Step 7 | port 不得返回 raw body;adapter 只能返回 summary / marker / typed ref;auth / gateway port 若出现必须作为外部边界而非本仓实现。 |
| Step 8 | Command / Query / Event / Job 协议必须显式定义 actor、metadata、source envelope、safe reason、dedup / idempotency 和 trace 字段。 |
| Step 9 | flow 不得从字符串反推 actor / source / visibility;不得用下游运行结果改写本仓 truth。 |
| Step 10 | state transition guard 必须显式说明 actor / source / digest / body-free / trust gate。 |
| Step 11 | persistence 不得保存外部正文、credential、secret、raw payload、下游运行 truth。 |
| Step 12 | error / recovery 必须使用 redacted issue、safe reason、retry marker,不得泄露 raw body。 |
| Step 13 | 幂等 / 重放必须以正式 idempotency / dedup / digest 字段为准,不得重读 raw body 重建响应。 |
| Step 14 | 配置只能影响 adapter / assembly / profile / job 参数,不得开启越权 truth owner 或正文保存。 |
| Step 15 | observability / audit 必须落 body-free field whitelist 和 redaction 规则。 |

### 9. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否写入安全 / 鉴权 / 外部边界约束表 | pass |
| 是否写入 actor / metadata 约束表 | pass |
| 是否写入外部正文和下游运行 truth 禁区 | pass |
| 是否写入日志 / diagnostic / metric / trace / audit 安全边界 | pass |
| 是否未定义具体 gateway / auth 实现 | pass |
| 是否未创建 DTO / port / event schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 `R3.13` 正文审计或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.13 历史 Step 3 差异审计:先思考`;只允许思考历史 Step 3 污染扫描计划,不得直接修改正式 `03-详细设计.md`,不得反推当前 Step 3 结论,不得进入 `R3.14` 或 Step 4。

---

## R3.13 历史 Step 3 差异审计:先思考

### 1. 本模块要回答的问题

本模块只制定历史 Step 3 差异审计计划,不写禁入 / 后移 / 重定义结论。`R3.14` 才能根据本计划写入审计表。

| 问题 | 本模块判断 |
|---|---|
| 审计对象是什么? | 旧正式 `03-详细设计.md` 的 §1~§3 以及旧版 `03_ddd_step_03_runtime_constraints.md`。必要时扫描旧正式 03 全文定位 Step 3 约束扩散。 |
| 审计目标是什么? | 找出旧 P0 / P1、`MethodContent`、publish、snapshot、fingerprint、outbox、PostgreSQL、L0-bus、gateway / auth、Rustdoc 中文注释等是否与当前 `R3.8`、`R3.10`、`R3.12` 冲突。 |
| 本模块是否裁决旧内容? | 不裁决。只形成扫描计划、关键词组、证据来源和 `R3.14` 输出模板。 |
| 旧内容能否反推当前结论? | 不能。旧内容只能被当前 `00/01/02` 与 `R3.8`、`R3.10`、`R3.12` 重新吸收、改写、后移或禁入。 |
| 是否修改正式 `03-详细设计.md`? | 不修改。正式回填留给 `R3.15`~`R3.16` 或 Step 19。 |

### 2. 已确认的当前基线

| 当前基线 | 来源 | 对审计的约束 |
|---|---|---|
| 语言 / runtime / 仓库约束 | `R3.8` | 设计文档 Rust 契约片段可用中文 Rustdoc;实现仓源码注释、rustdoc、错误和测试名必须使用英文。Step 3 不锁定 HTTP / RPC / database / queue / scheduler 产品。 |
| 跨仓依赖约束 | `R3.10` | 只有 `L0-core` / `core-contracts` 是 compile dependency candidate;`L0-bus` 是事件协作;`L1-process`、`L1-identity`、`L2-runtime`、`L2-member-images` 是 runtime consumption。 |
| 安全 / 外部边界 | `R3.12` | 本仓不实现 auth / gateway;不保存外部正文、下游运行 truth、raw payload、credential、secret、stack trace。 |
| 当前概要输入 | 正式 `02-概要设计.md` §5~§12 | 当前主线是八个主要组成部分、core truth / support / operation / peripheral / cross-cutting 分层,不是旧 `MethodContent` 发布同步闭环。 |
| 旧材料处理规则 | project ledger / flow | 旧正式 03 与旧 `03_ddd_*` 只作历史材料,旧 completed 状态失效。 |

### 3. 审计对象与读取顺序

| 顺序 | 对象 | 读取目的 | 输出到 `R3.14` 的内容 |
|---:|---|---|---|
| 1 | 当前 `03_ddd_step_03_runtime_constraints.md` 的 `R3.8`、`R3.10`、`R3.12` | 固定当前 Step 3 已确认结论。 | 当前结论列。 |
| 2 | 旧正式 `projects/L3-method-library/03-详细设计.md` §1~§3 | 查旧 Step 3 相关正文、上游关系声明、范围、实现约束和编码规范承接。 | 旧内容命中列。 |
| 3 | 旧正式 `03-详细设计.md` 全文关键词扫描 | 查 Step 3 约束是否扩散到模块布局、配置、持久化、可观测、测试等章节。 | 扩散位置列。 |
| 4 | `git show HEAD:.../03_ddd_step_03_runtime_constraints.md` | 获取旧 Step 3 原始内容,避免被当前重写后的文件覆盖。 | 旧 Step 3 依据列。 |
| 5 | 正式 `02-概要设计.md` 和 `02_hld_step_12/13/14` | 确认旧内容是否已在概要层明确排除、后移或重命名。 | 当前 02 依据列。 |
| 6 | `R3.14` 写入前的三层台账 | 确认仍停在 `R3.14` 等待写入。 | 门禁证明。 |

### 4. 关键词组与污染候选

| 关键词组 | 扫描词 | 可能问题 | `R3.14` 裁决值域 |
|---|---|---|---|
| 旧主线 | `P0`, `P1`, `方法定义发布同步闭环`, `MethodContent`, `MethodPlugin`, `MethodConfiguration` | 旧主线替代当前八组成部分和 formalization / version / consumption / maintenance 主线。 | `ban`, `rename_under_current_model`, `defer`, `historical_note_only` |
| 旧发布机制 | `publish`, `published`, `draft`, `in_review`, `supersede`, `delivery` | 旧生命周期和发布动作替代当前正式化 / 版本 / 受控消费对象。 | `ban`, `redefine_in_step6_plus`, `defer_to_flow`, `historical_note_only` |
| 旧材料机制 | `snapshot`, `fingerprint`, `DefinitionSnapshot`, `CanonicalFingerprint` | 旧 snapshot / fingerprint 机制替代当前 formal version、basis summary、material freshness 等对象。 | `ban`, `redefine_as_marker`, `defer_to_step6_11`, `historical_note_only` |
| 旧 outbox / relay | `outbox`, `OutboxEvent`, `relay`, `dead-letter`, `topic`, `subscriber` | 将 Outbound Event 候选误写成 outbox 表、relay、topic 和投递保证。 | `ban`, `defer_to_step8_14`, `redefine_as_outbound_candidate`, `historical_note_only` |
| 旧基础设施锁定 | `PostgreSQL`, `object storage`, `cache`, `gateway.trusted_header`, `database.url` | Step 3 提前锁定具体存储、网关 header、配置 key 或基础设施。 | `ban_in_step3`, `defer_to_step11_14`, `adapter_boundary_only` |
| 旧事件依赖 | `L0-bus`, `BusPublisherPort`, `event_bus.topic` | 把 event collaboration 写成 Cargo dependency 或提前定义 transport。 | `event_boundary_only`, `defer_to_step8_14`, `ban_as_compile_dependency` |
| 旧认证边界 | `gateway`, `nginx-like`, `trusted header`, `auth`, `token` | 把 auth / gateway 实现塞回本仓。 | `external_boundary_only`, `ban_implementation`, `defer_to_step8_metadata` |
| 注释语言冲突 | `Rustdoc 中文注释`, `实际代码注释使用英文` | 旧 Step 3 要求与当前裁决混杂,容易误导实现仓注释语言。 | `keep_design_only`, `enforce_implementation_english`, `rewrite` |

### 5. R3.14 输出模板

`R3.14` 应写入三张表。

第一张表为旧内容命中表:

| 旧内容 | 命中位置 | 当前基线 | 初步处理 |
|---|---|---|---|
| 待 `R3.14` 填写 | 待 `R3.14` 填写 | 待 `R3.14` 填写 | `ban / defer / redefine / historical_note_only` |

第二张表为差异裁决表:

| 差异项 | 裁决 | 理由 | 后续承接 |
|---|---|---|---|
| 待 `R3.14` 填写 | 待 `R3.14` 填写 | 待 `R3.14` 填写 | Step 4~15 或 `R3.15`~`R3.16` |

第三张表为正式 §3 回填影响表:

| §3 回填项 | 应采用当前结论 | 必须排除的旧口径 |
|---|---|---|
| 编码规范承接 | `R3.8` | 旧 Rustdoc 中文注释作为实现代码要求 |
| runtime / framework | `R3.8` | 旧 PostgreSQL / L0-bus / gateway 作为 Step 3 固定实现 |
| 跨仓依赖 | `R3.10` | 旧 L0-bus / runtime 仓写成 Cargo dependency |
| 安全 / 外部边界 | `R3.12` | 旧 gateway / auth / raw external body / outbox delivery 前置 |

### 6. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只形成历史差异审计计划 | pass |
| 是否未写禁入 / 后移 / 重定义最终表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未修改 `R3.8`、`R3.10`、`R3.12` 已确认结论 | pass |
| 是否未进入 `R3.14` 写入或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.14 历史 Step 3 差异审计:再写入`;只允许写入旧内容禁入 / 后移 / 重定义审计表,不得直接修改正式 `03-详细设计.md`,不得修改已完成 `R3.8`、`R3.10`、`R3.12` 结论,不得进入 `R3.15` 或 Step 4。

---

## R3.14 历史 Step 3 差异审计:再写入

### 1. 本模块写入范围

本模块根据 `R3.13` 的扫描计划,写入旧正式 `03-详细设计.md` 与旧 Step 3 的差异审计结论。该结论只用于关闭旧 completed 污染,并为 `R3.15`~`R3.16` 的正式 §3 回填提供排除清单;本模块不修改正式 `03-详细设计.md`,不改写已确认的 `R3.8`、`R3.10`、`R3.12`。

### 2. 旧内容命中表

| 旧内容 | 命中位置 | 当前基线 | 初步处理 |
|---|---|---|---|
| `P0 方法定义发布同步闭环` 作为详细设计回答主语 | 旧正式 `03-详细设计.md:5`, `03-详细设计.md:69`~`03-详细设计.md:86`;旧 Step 3 `HEAD:...03_ddd_step_03_runtime_constraints.md:15`、`:35` | 当前 `02-概要设计.md` §5~§12 已改为八个主要组成部分和 core / support / operation / peripheral / cross-cutting 分层。 | `ban` |
| `MethodContent`、7 类 P0 definition、`MethodContentLifecycle` 作为对象主轴 | 旧正式 `03-详细设计.md:32`,`:43`,`:80`~`:81`,`:158`,`:291`~`:297`;旧 Step 3 `HEAD:...:15` | 当前 §6 明确 `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` 为旧主线禁入对象。 | `ban` |
| publish / draft / in_review / supersede 旧生命周期 | 旧正式 `03-详细设计.md:80`~`:83`,`:433`~`:435`,`:2635`~`:2642`;旧 Step 3 `HEAD:...:44`、`:129` | 当前 formalization / version / consumption / relation / maintenance 等状态必须由当前对象重新推导。 | `ban` |
| snapshot / fingerprint 作为版本和同步基础 | 旧正式 `03-详细设计.md:33`,`:46`,`:82`~`:83`,`:2458`~`:2459`,`:2622`~`:2624`;旧 Step 3 `HEAD:...:44`,`:122` | 当前 `02-概要设计.md` §7.7、§8.3 和 §12.3 明确不恢复 snapshot / fingerprint 主线。 | `ban` |
| outbox / relay / topic / dead-letter 作为 Step 3 固定机制 | 旧正式 `03-详细设计.md:33`,`:56`~`:58`,`:83`,`:2389`~`:2391`,`:2449`~`:2451`,`:2475`;旧 Step 3 `HEAD:...:21`,`:44`,`:123`,`:129` | 当前 Outbound Event 只定义事实候选边界;topic、payload schema、outbox、relay、retry、subscriber 后续重新闭口。 | `defer` |
| PostgreSQL / object storage / cache 在 Step 3 固定为 runtime 依赖 | 旧正式 `03-详细设计.md:127`,`:161`,`:2474`,`:2476`,`:2468`;旧 Step 3 `HEAD:...:21`~`:22`,`:44`,`:122` | `R3.8` 只允许写不提前锁定具体 database / queue / scheduler 产品;持久化 contract 后移 Step 11,配置后移 Step 14。 | `defer` |
| L0-bus 写成定义事件传播目标或 transport 绑定 | 旧正式 `03-详细设计.md:128`,`:2475`;旧 Step 3 `HEAD:...:21`,`:44`,`:123` | `R3.10` 裁决 `L0-bus` 是 event collaboration,不是 Cargo dependency;transport / publisher binding 后移 Step 8 / Step 14。 | `redefine` |
| gateway / trusted header / nginx-like 作为本仓安全入口实现 | 旧正式 `03-详细设计.md:130`,`:2444`~`:2445`,`:2478`,`:2490`;旧 Step 3 `HEAD:...:27`~`:28`,`:71`,`:85`,`:125` | `R3.12` 裁决本仓不实现 auth / gateway,只承接 actor / metadata / source context。 | `redefine` |
| Rustdoc 中文注释作为实现仓代码要求 | 旧 Step 3 `HEAD:...:27`,`:48`,`:50`~`:52`,`:107`,`:162`,`:206`;旧正式 `03-详细设计.md:117`~`:118`,`:2709`,`:2730` | `R3.8` 裁决设计文档契约片段可用中文 Rustdoc,实现仓源码注释、rustdoc、错误和测试名必须使用英文。 | `redefine` |
| 旧正式 `03-详细设计.md` 作为实施前置阅读对象 | 旧正式 `03-详细设计.md:143` | 当前正式 03 属 historical material;实施前置只能在本轮正式 03 装配完成后成立。 | `defer` |

### 3. 差异裁决表

| 差异项 | 裁决 | 理由 | 后续承接 |
|---|---|---|---|
| 旧 P0 / P1 发布同步主线 | `ban` | 与当前 `02-概要设计.md` 八个主要组成部分冲突,会把 Step 5 以后重新拉回旧闭环。 | `R3.15`~`R3.16` 正式 §3 回填必须完全排除。 |
| `MethodContent` 对象族与旧生命周期 | `ban` | 当前对象 owner、状态 owner 和接口 owner 已在 02 中重建;旧对象不能作为当前详细设计来源。 | Step 4~Step 10 必须按当前对象 / 接口 / flow 重新展开。 |
| publish / snapshot / fingerprint | `ban` | 这些是旧版本成立和同步机制,当前正式化、版本、basis、material freshness 等必须重新闭口。 | 若后续需要类似 digest / freshness marker,只能在 Step 6 / Step 11 按当前对象重定义。 |
| outbox / relay / topic / dead-letter | `defer` | 当前概要只允许 Outbound Event candidate,不允许在 Step 3 固定可靠投递实现。 | Step 8 定义 outbound contract;Step 11/13/14 才能讨论持久化、幂等和配置绑定。 |
| PostgreSQL / object storage / cache | `defer` | Step 3 只收稳 runtime 不提前锁定;持久化、外部依赖和配置 key 均未到当前 Step。 | Step 11 / Step 14 重新讨论,且不得绕过 `R3.12` 外部正文禁区。 |
| L0-bus | `redefine` | 可作为 event collaboration 边界,但不能写成 package dependency 或在 Step 3 固定 topic / publisher 实现。 | `R3.10` 已保留 event collaboration;Step 8 / Step 14 承接协议和配置。 |
| gateway / auth / trusted header | `redefine` | 本仓不实现 auth / gateway;旧 header 和 gateway context 只能作为外部边界候选,不能进入本仓实现约束。 | Step 8 定义 actor / metadata / source envelope;Step 12 定义 rejection;Step 15 定义安全观测。 |
| Rustdoc 中文注释 | `redefine` | 当前已经区分设计文档契约表达与实现仓源码语言,旧 Step 3 会误导实现代码写中文注释。 | `R3.15` 回填策略必须明确“设计可中文,实现必须英文”。 |
| 旧正式 03 作为实施阅读对象 | `defer` | 当前旧正式 03 尚未重装配完成,不能要求实现者按旧文档编码。 | Step 19 正式 03 装配后,07 实施计划再列正式阅读项。 |

### 4. 正式 §3 回填影响表

| §3 回填项 | 应采用当前结论 | 必须排除的旧口径 |
|---|---|---|
| 编码规范承接 | 采用 `R3.8`:设计文档 Rust 契约片段可中文说明;实现仓源码标识符、注释、rustdoc、错误和测试名使用英文。 | 旧 Step 3 “公开类型、字段、trait、函数必须使用 Rustdoc 中文注释”作为实现仓代码要求。 |
| runtime / framework | 采用 `R3.8`:Step 3 不锁定 HTTP / RPC / database / queue / scheduler / worker / cache / object storage 产品。 | 旧 Step 3 和旧正式 03 将 PostgreSQL、L0-bus、object storage、cache、gateway 作为本章固定实现。 |
| 跨仓依赖 | 采用 `R3.10`:只有 `L0-core` / `core-contracts` 是 compile dependency candidate;`L0-bus` 是 event collaboration;其他为 runtime consumption。 | 旧 L0-bus、governance、runtime、gateway 等被写成源码级依赖或本仓拥有能力。 |
| 安全 / 外部边界 | 采用 `R3.12`:本仓只承接 actor / metadata / source context,不实现 auth / gateway,不保存外部正文和下游运行 truth。 | 旧 gateway trusted headers、auth 边界、raw bus payload、outbox delivery、snapshot payload 作为本仓实现主线。 |
| 后续 Step 承接 | Step 4 以后按当前 02 和已确认 `R3.8/R3.10/R3.12` 重新展开模块、对象、port、protocol、flow、state、persistence、error、config、observability。 | 旧 crate tree、repository、outbox、snapshot、event、worker、配置 key、测试切口直接继承。 |

### 5. 关闭项与保留项

| 项目 | 状态 | 说明 |
|---|---|---|
| 旧 Step 3 completed 状态 | closed_as_invalid | 不得作为本轮 Step 3 完成依据。 |
| 旧正式 03 §3 | historical_material_only | 只可用于 `R3.15`~`R3.16` 回填时的排除对照。 |
| 旧 P0 / MethodContent 主线 | closed_as_banned | 不得进入正式 §3 或后续 Step 正向主线。 |
| L0-bus 事件协作事实 | keep_redefined | 只以 event collaboration 形态保留,不作为 Cargo dependency 或 Step 3 transport。 |
| gateway / auth 外部边界事实 | keep_redefined | 只以外部边界和 actor / metadata 承接形态保留。 |
| outbox / reliable delivery 问题 | keep_deferred | 不在 Step 3 定义;若后续需要,按 Step 8 / Step 11 / Step 13 / Step 14 重新闭口。 |

### 6. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否写入旧内容命中表 | pass |
| 是否写入差异裁决表 | pass |
| 是否写入正式 §3 回填影响表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未修改 `R3.8`、`R3.10`、`R3.12` 已确认结论 | pass |
| 是否未进入 `R3.15` 正式回填策略或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.15 回填草稿:先思考`;只允许思考正式 §3 回填策略,不得直接修改正式 `03-详细设计.md`,不得写正式 §3 回填草稿,不得进入 `R3.16` 或 Step 4。

---

## R3.15 回填草稿:先思考

### 1. 本模块要回答的问题

本模块只制定正式 `03-详细设计.md` §3 的回填策略,不写正式 §3 草稿,也不修改正式文档。`R3.16` 才能把已确认结论整理成可装配的 §3 中间产物草稿。

| 问题 | 本模块判断 |
|---|---|
| §3 回填依据是什么? | 只使用 `R3.8`、`R3.10`、`R3.12` 和 `R3.14` 已确认结论,以及书写规范 §5.3 的章节要求。 |
| §3 是否继承旧正式 §3? | 不继承。旧正式 §3 只作排除对照。 |
| 本模块是否写回填草稿? | 不写。只写结构、来源映射、禁入项和 `R3.16` 模板。 |
| 本模块是否修改正式 `03-详细设计.md`? | 不修改。正式装配必须等 `R3.16` 草稿确认后,在明确回填动作或 Step 19 执行。 |

### 2. 正式 §3 建议结构

| 小节 | 标题 | 来源 | 写入重点 |
|---|---|---|---|
| §3.1 | 编码规范承接 | `R3.8`;书写规范 §5.3;Rust 编码规范 | 区分设计文档 Rust 契约片段和实现仓源码语言;点名 Rust 规范、书写规范、README 提交规范和目标仓 git config 核对。 |
| §3.2 | 语言、注释与契约表达约束 | `R3.8`;`R3.14` | 设计可用中文 Rustdoc 表达业务语义;实现仓必须英文标识符、英文注释、英文 rustdoc、英文错误说明和英文测试名。 |
| §3.3 | Runtime / framework 约束 | `R3.8`;`R3.14` | 不锁定 HTTP / RPC / database / queue / scheduler / worker / cache / object storage 产品;按分层和 port / adapter 表达 runtime。 |
| §3.4 | 本地多仓依赖约束 | `R3.10`;依赖类中间产物规范 | 写 `L0-core` / `core-contracts` 作为 compile dependency candidate;运行期和事件协作不得写 Cargo dependency。 |
| §3.5 | 安全 / 鉴权 / 外部边界 | `R3.12`;`R3.14` | 本仓不实现 auth / gateway;actor / metadata / source context 必须 formal;外部正文和下游运行 truth 禁入。 |
| §3.6 | 旧 Step 3 差异审计结论 | `R3.14` | 说明旧 P0 / MethodContent / publish / snapshot / fingerprint 禁入,outbox / delivery 后移重新闭口。 |
| §3.7 | 后续 Step 承接与停审规则 | `R3.8`;`R3.10`;`R3.12`;`R3.14` | 把 Step 4~15 必须继承的约束列成承接表,并写缺口必须回设计闭口。 |

### 3. 回填来源映射

| 来源 | 可进入 §3 的内容 | 不可进入 §3 的内容 |
|---|---|---|
| `R3.8` | 编码规范、注释语言分层、runtime 不提前锁定、仓库纪律、提交和 git config 前置核对。 | 任何 Step 4 layout、path dependency 最终表、具体 port / DTO / schema。 |
| `R3.10` | compile / runtime / event / adapter / fake 依赖分类;`core-contracts` 候选 path dependency;不可用处理。 | 将 `L0-bus`、process、identity、runtime、member-images 写成 Cargo dependency。 |
| `R3.12` | auth / gateway 外部边界、actor / metadata、外部正文禁区、下游运行 truth 禁区、observability 安全承接。 | 具体 gateway / auth 实现、具体 DTO / port / event schema、raw payload 处理。 |
| `R3.14` | 旧内容 ban / defer / redefine / historical_material 结论;正式 §3 回填排除项。 | 旧 P0 / MethodContent 主线、旧 snapshot / fingerprint / outbox 作为当前实现约束。 |
| 书写规范 §5.3 | §3 的输出形态:编码规范承接表、实现约束表、本地多仓依赖约束表。 | 图、对象契约、完整文件布局、状态矩阵、测试矩阵。 |

### 4. R3.16 写入模板

`R3.16` 应按以下顺序写中间产物草稿:

1. `## 3. 实现约束与编码规范承接`
2. `### 3.1 编码规范承接`
3. `### 3.2 语言、注释与契约表达约束`
4. `### 3.3 Runtime / framework 约束`
5. `### 3.4 本地多仓依赖约束`
6. `### 3.5 安全 / 鉴权 / 外部边界`
7. `### 3.6 旧 Step 3 差异审计结论`
8. `### 3.7 后续 Step 承接与停审规则`

草稿必须满足:

| 规则 | 要求 |
|---|---|
| 不保留 SOP 问题 | 不写“本仓使用什么语言”等问答句式。 |
| 不保留讨论语气 | 不写“建议 / 我认为 / 待我们讨论”。 |
| 不新增结论 | 所有约束必须能回指 `R3.8`、`R3.10`、`R3.12` 或 `R3.14`。 |
| 不画图 | §3 按书写规范使用表格,不画 ASCII 图。 |
| 不改正式文档 | 草稿只写在本中间产物文件,不直接写 `03-详细设计.md`。 |

### 5. 禁入清单

| 禁入项 | 原因 |
|---|---|
| 旧 `P0 方法定义发布同步闭环` | 已在 `R3.14` 裁决为 `ban`。 |
| `MethodContent`、`MethodContentLifecycle`、旧 7 类 P0 definition | 已在 `R3.14` 裁决为 `ban`。 |
| publish / snapshot / fingerprint 作为版本同步机制 | 已在 `R3.14` 裁决为 `ban`。 |
| outbox / relay / topic / dead-letter 作为 Step 3 固定机制 | 已在 `R3.14` 裁决为 `defer`,不得写入 §3 固定实现。 |
| PostgreSQL / object storage / cache / concrete gateway header 作为 Step 3 固定实现 | 已在 `R3.14` 裁决后移至 Step 11 / Step 14 或外部边界。 |
| Rustdoc 中文注释作为实现仓代码要求 | 已在 `R3.14` 裁决为 `redefine`,实现仓必须英文。 |

### 6. R3.16 自检要求

| 检查项 | 要求 |
|---|---|
| 来源完整 | §3 草稿每个表都能回指 `R3.8`、`R3.10`、`R3.12`、`R3.14` 或书写规范。 |
| 旧口径排除 | 不出现旧 P0 / MethodContent / publish / snapshot / fingerprint 正向主线。 |
| 依赖类型清楚 | compile / runtime / event / adapter / fake 不混淆。 |
| 安全边界清楚 | 不把 auth / gateway / raw body / 下游运行 truth 写成本仓责任。 |
| 正式文档保护 | `git diff --name-only -- projects/L3-method-library/03-详细设计.md` 必须为空。 |

### 7. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只形成正式 §3 回填策略 | pass |
| 是否未写正式 §3 草稿 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未新增未确认结论 | pass |
| 是否未进入 `R3.16` 写入或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.16 回填草稿:再写入`;只允许写入正式 §3 的中间产物草稿,不得直接修改正式 `03-详细设计.md`,不得新增未经过 `R3.8/R3.10/R3.12/R3.14` 确认的结论,不得进入 `R3.17` 或 Step 4。

---

## R3.16 回填草稿:再写入

### 1. 本模块写入范围

本模块把 `R3.8`、`R3.10`、`R3.12` 和 `R3.14` 已确认结论整理为正式 `03-详细设计.md` §3 的中间产物草稿。该草稿只写入当前 Step 文件,不直接修改正式 `03-详细设计.md`。

| 项目 | 本模块处理 |
|---|---|
| 草稿用途 | 后续明确回填动作或 Step 19 装配正式 `03-详细设计.md` §3。 |
| 结论来源 | `R3.8` 语言 / runtime / 仓库约束;`R3.10` 跨仓依赖;`R3.12` 安全 / 外部边界;`R3.14` 历史差异审计。 |
| 禁止新增 | 不新增未确认的 framework、database、queue、scheduler、port、DTO、mapper、config key 或 evidence schema。 |
| 正式文档保护 | 本模块不修改 `projects/L3-method-library/03-详细设计.md`。 |

### 2. 正式 §3 中间产物草稿

## 3. 实现约束与编码规范承接

本章固定 `L3-method-library` 详细设计后续章节必须继承的实现约束。后续模块、对象、port、协议、处理流、状态、持久化、错误、配置和观测设计,均不得绕过本章定义的语言、仓库、依赖、安全和历史材料边界。

本章不定义具体 crate / module layout,不定义对象字段、trait 方法、DTO schema、状态矩阵、持久化表结构、配置 key 或测试 evidence schema。这些内容分别由后续详细设计 Step 4~Step 16 闭口。

### 3.1 编码规范承接

| 规范来源 | 本仓承接方式 | 后续约束 |
|---|---|---|
| `standards/coding/rust.md` | 作为实现仓 Rust 源码、测试、注释、rustdoc、format、clippy 和命名约束来源。 | 实施前必须再次读取并执行目标仓适用的 Rust 检查。 |
| `standards/document/详细设计书写规范.md` | 作为本详细设计 Rust 契约片段、章节结构、表格表达和可落码描述约束来源。 | 本文可用 Rust 风格契约片段表达对象、trait 和 DTO,但不得替代实现仓源码。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 作为 schema / port / DTO / mapper / config / evidence 缺口暂停规则来源。 | 实现端遇到正式闭口缺失时必须停止并回设计补口,不得自行发明字段或映射。 |
| 项目 `README` / git config / 提交规范 | 作为实施前工作区、author / committer、commit message 和 staged diff 核对来源。 | 实施计划必须在开工门禁中再次固定,Step 3 不直接改实现仓。 |

### 3.2 语言、注释与契约表达约束

| 场景 | 允许 | 禁止 |
|---|---|---|
| 详细设计文档 Rust 契约片段 | 可使用 Rust 风格代码块、中文字段说明和中文 Rustdoc 解释业务语义。 | 把文档片段视为可直接复制到实现仓的最终源码。 |
| 实现仓 Rust 源码 | 标识符、模块名、函数名、trait 名、字段名、注释、rustdoc、错误文本和测试名使用英文。 | 在实现仓源码中使用中文注释、中文 rustdoc、中文错误文本或中文测试名。 |
| 类型与字段命名 | 使用稳定英文领域名,并由 Step 6~Step 8 给出正式对象、port、DTO 和协议命名。 | 从旧 `MethodContent`、旧 P0 / P1、publish、snapshot、fingerprint 主线继承命名。 |
| 代码示例 | 只作为契约表达和边界说明,不得承担完整实现。 | 在 Step 3 中写完整 repository、service、adapter、database、queue 或 worker 实现。 |

### 3.3 Runtime / framework 约束

| 约束 | 正式口径 | 后续闭口位置 |
|---|---|---|
| HTTP / RPC | Step 3 不锁定具体 HTTP / RPC framework。 | Step 4 module layout、Step 8 protocol、Step 14 config。 |
| database / storage | Step 3 不锁定 PostgreSQL、object storage、cache 或具体表结构。 | Step 11 persistence / transaction;Step 14 external binding。 |
| queue / bus / scheduler / worker | Step 3 不锁定消息队列、scheduler、worker runtime、topic 或 relay 机制。 | Step 8 event / job protocol;Step 13 idempotency;Step 14 config。 |
| runtime adapter | 运行期协作必须通过正式 port、adapter、fake、profile 或 unavailable / degraded 分支表达。 | Step 7 port / adapter;Step 9 flow;Step 12 error。 |
| 配置影响 | 配置只能影响 assembly、adapter、profile、job 参数和外部绑定。 | Step 14 必须禁止配置改变 truth owner、state owner、body-free 边界或 schema。 |

### 3.4 本地多仓依赖约束

| 关联仓库 | 依赖类型 | Step 3 约束 |
|---|---|---|
| `quantalithos-core` / `core-contracts` | compile dependency candidate | 当前唯一可进入 Cargo dependency 候选的编译期依赖。实施前必须复核 package、crate 名和相对路径。 |
| `quantalithos-bus` | event collaboration | 不得写成 Cargo dependency;只可作为 event boundary、publisher port、transport binding、event fake 或配置绑定对象。 |
| `quantalithos-process` | runtime consumption | 不得写源码依赖;通过正式查询、消费材料、API / SDK、adapter 或 fake 协作。 |
| `quantalithos-identity` | runtime consumption | 不得写源码依赖;通过角色 / 成员 typed ref、safe summary、API / SDK、adapter 或 fake 协作。 |
| `quantalithos-runtime` | runtime consumption | 不得写源码依赖;运行时消费语义通过 runtime adapter、API、SDK、profile 或 fake 承接。 |
| `quantalithos-member-images` | runtime consumption | 不得写源码依赖;Role -> image variant 定义来源必须通过正式边界供给。 |

`L0-core` 候选 Cargo 写法仅作为后续实现仓核对口径:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

使用该写法前必须重新确认目标实现仓位置。如果目标实现仓路径变化,必须重新计算相对路径;如果 `core-contracts` package 或 lib 名称变化,必须回设计 / 实施计划闭口。

### 3.5 安全 / 鉴权 / 外部边界

| 主题 | 正式约束 | 禁止 |
|---|---|---|
| 认证 / 鉴权 | 本仓只承接可信 actor、metadata、source context、job context 和 trace context。 | 实现登录、token、credential store、权限系统、gateway route enforce 或外部 policy engine。 |
| actor 来源 | actor 必须来自正式 command metadata、query metadata、event envelope、consumer context、job context 或系统 actor 字段。 | 从 route、query param、topic、raw member id、adapter name 或字符串拼接 actor。 |
| 外部正文 | 外部标准、ADR、artifact、archive、evidence、API response 和下游回报只能以 ref、summary、marker、digest、safe reason 承接。 | 保存外部正文、raw event payload、adapter response body、artifact body、archive package 或 evidence file content。 |
| 下游运行 truth | process、identity、runtime、member-images、marketplace、console、artifact 等运行状态不得回写为本仓定义 truth。 | 用流程运行、成员实际状态、runtime execution、image build、marketplace transaction 或 UI session 改写方法资产定义。 |
| 可观测与审计 | log、diagnostic、metric、trace、audit 只能记录 body-free refs、markers、safe reason、redacted issue 和 trace context。 | 记录 credential、secret、raw endpoint、raw request / response、stack trace、external document body。 |

### 3.6 旧 Step 3 差异审计结论

| 旧口径 | 本轮处理 | 对正式 §3 的影响 |
|---|---|---|
| 旧 `P0 方法定义发布同步闭环` | `ban` | 不得作为当前详细设计主线。 |
| `MethodContent`、旧 7 类 P0 definition、`MethodContentLifecycle` | `ban` | 后续对象必须按当前 `02-概要设计.md` 八个组成部分重新展开。 |
| publish / draft / in_review / supersede | `ban` | 生命周期和状态转换必须由 Step 10 基于当前对象重新定义。 |
| snapshot / fingerprint | `ban` | 若后续需要 digest、freshness 或 basis marker,必须在 Step 6 / Step 11 按当前对象重定义。 |
| outbox / relay / topic / dead-letter | `defer` | 不在 Step 3 固定可靠投递机制;如需要,后移 Step 8 / Step 11 / Step 13 / Step 14 重新闭口。 |
| PostgreSQL / object storage / cache | `defer` | 不在 Step 3 锁定基础设施;后移 Step 11 / Step 14。 |
| `L0-bus` transport | `redefine` | 只保留 event collaboration,不得作为 Cargo dependency 或 Step 3 固定 transport。 |
| gateway / auth / trusted header | `redefine` | 只保留外部边界和 actor / metadata 承接口径,不得成为本仓实现。 |
| Rustdoc 中文注释 | `redefine` | 只允许作为设计文档契约说明方式;实现仓源码必须英文。 |

### 3.7 后续 Step 承接与停审规则

| 后续 Step | 必须承接的 Step 3 约束 |
|---|---|
| Step 4 实现单元与文件布局 | 不创建 auth / gateway / external body storage 主体模块;区分 compile dependency、runtime adapter、event collaboration 和 fake。 |
| Step 5 模块实现契约主轴 | 按 core truth、support state、operation material、peripheral relation、cross-cutting metadata 展开,不得恢复旧 P0 / MethodContent 主线。 |
| Step 6 对象契约 | 字段必须 typed、body-free、source-clear;不得含 raw external body、credential、secret 或下游运行 truth 正文。 |
| Step 7 Trait / Port / Adapter | port / adapter 不得返回 raw body;运行期和事件协作必须以正式 interface 和 fake 承接。 |
| Step 8 Protocol | Command / Query / Event / Job 必须显式定义 actor、metadata、source envelope、idempotency / dedup、safe reason 和 trace 字段。 |
| Step 9 Function Flow | flow 不得从字符串反推 actor、source、visibility、scope、schema、mapper 或 config。 |
| Step 10 State | state transition guard 必须显式说明 actor / source / digest / body-free / trust gate。 |
| Step 11 Persistence | 不保存外部正文、credential、secret、raw payload、下游运行 truth;持久化模型不得由 Step 3 的旧 PostgreSQL 口径反推。 |
| Step 12 Error / Recovery | 错误和恢复必须使用 typed rejection、safe reason、redacted diagnostic 和 retry / non-retry marker。 |
| Step 13 Concurrency / Idempotency | 幂等、dedup 和重放必须以正式字段为准,不得通过 raw body 或私有重读重建响应。 |
| Step 14 Config | 配置不得改变 truth owner、state owner、schema、body-free 边界或依赖类型。 |
| Step 15 Observability / Audit | 必须给出 body-free field whitelist、redaction 规则和审计字段来源。 |

任何后续 Step 发现 schema、port、DTO、mapper、config key、state matrix、persistence schema、test evidence schema 或 public surface 缺口,必须暂停并回设计闭口;不得由实现端自行补口。

### 3. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否写入正式 §3 中间产物草稿 | pass |
| 是否只使用 `R3.8/R3.10/R3.12/R3.14` 已确认结论 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未恢复旧 P0 / MethodContent / publish / snapshot / fingerprint 主线 | pass |
| 是否未把 `L0-bus` 或运行期消费仓写成 Cargo dependency | pass |
| 是否未定义具体 port / DTO / mapper / config key / evidence schema | pass |
| 是否未进入 `R3.17` 正文或 Step 4 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.17 自检与停审:先思考`;只允许思考 Step 3 自检清单、停审条件和进入 Step 4 的判定,不得直接修改正式 `03-详细设计.md`,不得进入 `R3.18` 或 Step 4。

---

## R3.17 自检与停审:先思考

### 1. 本模块要回答的问题

本模块只形成 Step 3 的自检清单、停审条件和进入 Step 4 的判定草案,不关闭 Step 3,不修改正式 `03-详细设计.md`,不进入 Step 4 正文。

| 问题 | 草案判断 |
|---|---|
| Step 3 是否已经完成必要讨论模块? | 是。`R3.1`~`R3.16` 已覆盖开工、框架对齐、来源池、语言 / runtime / 仓库、跨仓依赖、安全边界、历史差异审计和 §3 草稿。 |
| Step 3 是否可以直接关闭? | 还不能。本模块只思考关闭条件,`R3.18` 才能写停审记录并同步三层状态。 |
| 正式 `03-详细设计.md` 是否已回填? | 没有。当前只有中间产物草稿;正式回填必须等明确回填动作或 Step 19。 |
| 是否存在阻塞 Step 4 的缺口? | 暂未发现阻塞 Step 4 的 Step 3 缺口。Step 4 可以基于语言、runtime、依赖和安全边界展开实现单元与文件布局。 |
| Step 4 是否可以继承旧 layout? | 不可以。Step 4 仍需从当前 `00/01/02` 与 Step 3 约束重新展开,旧 `03_ddd_step_04_*` 只能作差异审计材料。 |

### 2. Step 3 自检清单草案

| 检查项 | 判定 | 依据 |
|---|---|---|
| 必读文档是否列明 | pass | `R3.1` / `R3.2` 已列流程规范、正式上游、概要中间产物、框架参考和历史材料。 |
| L1-governance 框架是否只作结构参考 | pass | `R3.3` / `R3.4` 已明确只参考结构、深度、门禁表达,不复制 governance 领域语义。 |
| 规范与来源池是否固定 | pass | `R3.5` / `R3.6` 已固定 normative / upstream / explanatory / local / historical 来源。 |
| 语言与源码约束是否清楚 | pass | `R3.7` / `R3.8` 已区分设计文档中文契约说明与实现仓英文源码要求。 |
| Runtime / framework 是否未提前锁定 | pass | `R3.8` 和 `R3.16` 均禁止在 Step 3 锁定 HTTP / RPC / database / queue / scheduler / worker / cache / object storage 产品。 |
| 跨仓依赖是否分类清楚 | pass | `R3.9` / `R3.10` 已区分 compile dependency candidate、event collaboration、runtime consumption、adapter / fake。 |
| 安全 / 鉴权 / 外部边界是否清楚 | pass | `R3.11` / `R3.12` 已明确本仓不实现 auth / gateway,不保存外部正文和下游运行 truth。 |
| 历史 Step 3 污染是否关闭 | pass | `R3.13` / `R3.14` 已裁决旧 P0 / MethodContent / publish / snapshot / fingerprint 禁入,outbox / infra 后移或重定义。 |
| 正式 §3 草稿是否生成 | pass | `R3.15` / `R3.16` 已形成 §3 回填结构与中间产物草稿。 |
| 正式 `03-详细设计.md` 是否受到保护 | pass | 当前 Step 3 写入均停在 `design-calibration` 中间产物。 |

### 3. 停审条件草案

`R3.18` 可以关闭 Step 3 的条件如下:

| 条件 | 草案判定 | 说明 |
|---|---|---|
| 三层状态一致 | required | project ledger、03 flow、Step 3 文件必须同步到 Step 4 等待状态。 |
| `R3.1`~`R3.17` 均有记录 | pass | 当前已具备完整模块链。 |
| §3 中间草稿存在 | pass | `R3.16` 已追加正式 §3 中间产物草稿。 |
| 正式文档未被直接修改 | required | `git diff --name-only -- projects/L3-method-library/03-详细设计.md` 必须为空。 |
| 无 Step 3 blocker | pass | 当前未发现语言、依赖、安全、历史材料层面阻塞 Step 4 的未闭口项。 |
| Step 4 开工边界明确 | pass | Step 4 只允许讨论实现单元与文件布局,不得越过对象契约、port、protocol、flow、state。 |

### 4. Step 4 进入判定草案

Step 4 可以在 `R3.18` 停审后等待用户确认开工,但必须遵守以下进入边界:

| 进入项 | Step 4 可做 | Step 4 不得做 |
|---|---|---|
| 文件布局 | 收稳 crate / module / package / workspace 边界和职责分布。 | 定义完整对象字段、trait 方法、DTO schema、状态机、持久化表。 |
| 依赖承接 | 标注哪些实现单元可引用 `core_contracts`,哪些只能走 adapter / fake / event boundary。 | 把 `L0-bus`、process、identity、runtime、member-images 写成 Cargo dependency。 |
| 安全承接 | 布局中保留 actor / metadata / source context / redaction / diagnostic 的承接位置。 | 创建 auth / gateway / credential / external body storage 主体模块。 |
| 历史材料 | 旧 Step 4 和旧正式 03 只能作差异审计输入。 | 直接继承旧 crate tree、旧 repository、旧 outbox、旧 snapshot、旧 PostgreSQL 口径。 |
| 后续分工 | 为 Step 5~15 保留对象、port、protocol、flow、state、persistence、error、config、observability 的独立闭口空间。 | 在 Step 4 一次性写全后续契约。 |

### 5. R3.18 写入计划

`R3.18` 应写入:

- Step 3 最终停审记录。
- Step 3 自检结果表。
- Step 4 进入条件。
- 三层状态同步到 Step 4 `R4.1 开工与必读文档:先思考` 等待用户确认。

`R3.18` 不得写入:

- 正式 `03-详细设计.md` 正文。
- Step 4 正文内容。
- 新的 language / runtime / dependency / security 结论。
- 对象、port、DTO、mapper、state、persistence、config 或 test evidence schema。

### 6. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否只形成自检与停审思考 | pass |
| 是否未关闭 Step 3 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 4 正文 | pass |
| 是否给出 `R3.18` 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.18 自检与停审:再写入`;只允许写入 Step 3 停审记录并同步 flow / 台账到 Step 4 等待状态,不得直接修改正式 `03-详细设计.md`,不得进入 Step 4 正文。

---

## R3.18 自检与停审:再写入

### 1. 停审记录

Step 3 `收稳编码规范、语言 / runtime、仓库约束` 已完成本轮 full-restart 讨论。当前结论只作为后续详细设计 Step 4~Step 15 的约束输入和正式 §3 回填草稿来源,不直接修改正式 `03-详细设计.md`。

| 项目 | 停审结论 |
|---|---|
| 当前 Step | Step 3 收稳编码规范、语言 / runtime、仓库约束 |
| 当前模块 | `R3.18 自检与停审:再写入` |
| 关闭状态 | completed |
| 正式 §3 | 已生成中间产物草稿,正式文档尚未回填。 |
| 下一 Step | Step 4 收稳实现单元与文件布局 |
| 下一允许动作 | `R4.1 开工与必读文档:先思考` |

### 2. 自检结果表

| 检查项 | 结果 | 说明 |
|---|---|---|
| `R3.1`~`R3.18` 是否完整 | pass | Step 3 已覆盖开工、框架对齐、来源池、裁决、审计、回填草稿、自检和停审。 |
| 编码规范承接是否明确 | pass | 已区分设计文档契约表达与实现仓英文源码要求。 |
| Runtime / framework 是否未提前锁定 | pass | 未在 Step 3 固定 HTTP / RPC / database / queue / scheduler / worker / cache / object storage 产品。 |
| 跨仓依赖是否分类明确 | pass | 仅 `L0-core` / `core-contracts` 为 compile dependency candidate;`L0-bus` 为 event collaboration;其他为 runtime consumption。 |
| 安全 / 外部边界是否明确 | pass | 本仓不实现 auth / gateway,不保存外部正文、下游运行 truth、raw payload、credential、secret 或 stack trace。 |
| 旧 Step 3 污染是否关闭 | pass | 旧 P0 / MethodContent / publish / snapshot / fingerprint 已 ban;outbox / infra 后移或重定义。 |
| 正式 §3 中间草稿是否存在 | pass | `R3.16` 已写入 `## 3. 实现约束与编码规范承接` 草稿。 |
| 正式 `03-详细设计.md` 是否未修改 | pass | 本 Step 写入均停留在 `design-calibration` 中间产物。 |

### 3. Step 4 进入条件

Step 4 可在用户确认后启动,但必须遵守:

| 条件 | 要求 |
|---|---|
| 必读恢复 | 先读 project ledger、03 flow、Step 1、Step 2、Step 3 当前文件和正式 `00/01/02`。 |
| 历史材料处理 | 旧 `03_ddd_step_04_module_layout.md` 只作 historical material,不得继承旧 completed 状态。 |
| 讨论范围 | 只收稳实现单元、crate / module / package / workspace 边界和职责分布。 |
| 不得越界 | 不定义对象字段、trait 方法、DTO schema、状态机、持久化表、配置 key 或测试 evidence schema。 |
| 约束继承 | 必须继承 Step 3 的语言、runtime、依赖、安全、历史差异审计和缺口回设计规则。 |

### 4. 三层同步结果

| 文档 | 同步结果 |
|---|---|
| `project_execution_ledger.md` | 当前恢复点已推进到 Step 4 `R4.1 开工与必读文档:先思考` 等待确认。 |
| `03_ddd_calibration_flow.md` | Step 3 标记 completed;Step 4 标记 wait_user_confirm_to_R4.1。 |
| `03_ddd_step_03_runtime_constraints.md` | 当前文件标记 completed;本节记录停审结果。 |

### 5. 本模块自检

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 3 停审记录 | pass |
| 是否同步 flow / 台账到 Step 4 等待状态 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 4 正文 | pass |
| 是否明确旧 Step 4 仍为 historical material | pass |

next_allowed_action: 等待用户确认后进入 `03-详细设计` Step 4 `R4.1 开工与必读文档:先思考`;只允许思考 Step 4 必读文档、输入边界、整体模块框架和模块顺序;不得直接修改正式 `03-详细设计.md`;不得进入 `R4.2` 或 Step 5。
