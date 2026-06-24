# Step 6. 逐模块定义对象实现契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 回填章节: `projects/L3-method-library/03-详细设计.md` §6 对象实现契约 / §5 模块实现契约中的对象归属
> 创建日期: 2026-06-22
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: `R6.28 自检与停审:再写入`
> 当前门禁: Step 6 completed;等待用户确认进入 Step 7 `R7.1 开工与必读文档:先思考`

---

## R6.1 开工与必读文档:先思考

### 1. 本模块要回答的问题

Step 6 不是续写旧 `03_ddd_step_06_object_contracts.md`。旧文件虽然标记为 `[x] 已确认`,但它仍围绕旧 13 个 P0 模块、旧 6 crate、`MethodContent`、snapshot、fingerprint、outbox、PostgreSQL 和 P1 plugin/configuration 主线展开,与当前 Step 5 已闭口的七实现单元、八组件横向映射、旧材料禁入和 full-restart 口径冲突。

本模块只回答以下问题:

| 问题 | 本轮判断 |
|---|---|
| Step 6 的工作对象是什么? | 基于 Step 5 的七模块主轴和当前 `02-概要设计.md` 的关键对象轮廓,逐模块定义可落码对象契约。 |
| Step 6 是否可以继承旧文件结论? | 不可以。旧 Step 6 的 completed 状态、旧对象家族、旧对象卡片、旧命名和旧机制均失效。 |
| Step 6 是否一次性生成全仓对象总表? | 不可以。必须先搭对象家族整体框架,再按模块 / capability 小循环逐组“先思考 -> 再写入”。 |
| Step 6 是否写 trait / port / DTO / flow / persistence? | 当前不开。Step 6 写对象身份、字段、值域、工厂、行为、不变量、禁止事项、owner 和后续承接;trait / port 在 Step 7,DTO 在 Step 8,flow 在 Step 9,persistence 在 Step 11。 |
| Step 6 完成后应支持什么? | Step 7~16 能回指对象能力、字段来源、状态 owner、错误 owner、配置 owner 和测试切口,不需要实现端自行猜对象或字段。 |

### 2. 必读文档

#### 2.1 流程与规范

| 文档 | 读取目的 | 使用边界 |
|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 确认项目级恢复点、Step 6 当前门禁和旧 Step 6 historical 定位。 | 只作为恢复门禁。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 确认 Step 5 completed、Step 6 `R6.1` 当前动作和后续 Step 阻塞关系。 | 作为文档级 flow 真相源。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | 承接输入权威顺序和历史材料隔离规则。 | 不重新讨论上游边界。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md` | 承接本轮 03 范围、非范围和展开深度。 | 不恢复旧 P0 / P1 分层。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md` | 承接语言、runtime、跨仓依赖、安全边界和缺口回设计规则。 | 作为对象字段来源和外部边界红线。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` | 承接七个实现单元、文件布局树和 crate 方向。 | 只承接布局 owner,不重写文件树。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` | 承接模块主轴、依赖边界、八组件映射和后续 owner 路由。 | Step 6 的直接前序输入。 |
| `standards/document/详细设计讨论流程_SOP.md` | 确认 Step 6 的目标、输入、输出、应问问题、逐模块小循环和进入 Step 7 条件。 | 采用流程规则。 |
| `standards/document/详细设计书写规范.md` | 确认对象卡片、字段、函数、状态、不变量、后续索引的书写要求。 | 作为正式 §6 草稿格式约束。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认单模块推进、先思考后写入和结构化中间产物要求。 | 作为本文件写入门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认对象契约必须回指模块 capability,字段、factory、状态和不变量必须有来源。 | 作为可落码红线。 |

#### 2.2 本仓正式输入

| 文档 | 读取目的 | Step 6 关注点 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 复核仓定位、能力边界、数据归属、业务规则和验收红线。 | 对象不得突破 Definition vs Use、body-free 和外部正文禁入边界。 |
| `projects/L3-method-library/01-架构设计.md` | 复核职责边界、数据所有权、一致性策略和通信方式。 | 判断对象 truth owner、read material、external summary 和 peripheral owner。 |
| `projects/L3-method-library/02-概要设计.md` | 复核八个主要组成部分、关键对象轮廓、接口骨架、处理流轮廓、状态和承接清单。 | Step 6 的对象候选和 capability 来源。 |

#### 2.3 概要设计对象承接中间产物

| 中间产物 | 读取目的 | Step 6 关注点 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 理解八个主要组成部分、对象发现线索和 Step 6~9 承接门禁。 | 每个对象必须回指组成部分和 capability。 |
| `02_hld_step_06_key_objects.md` | 读取关键对象主控表和对象分布。 | 作为对象候选池,不机械扩写旧字段。 |
| `02_hld_step_06_key_objects_core_truth.md` | 读取 definition / catalog / formalization / consumption 等 core truth 对象轮廓。 | 形成 domain truth 对象候选。 |
| `02_hld_step_06_key_objects_policies_guards.md` | 读取 policy / guard / validation / boundary 对象轮廓。 | 形成 domain policy / guard 对象候选。 |
| `02_hld_step_06_key_objects_views_materials.md` | 读取 view / material / projection / report 对象轮廓。 | 区分 contracts view shell、domain projection state 和 read material。 |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | 读取 typed ref、history、lineage、trace、audit 对象轮廓。 | 形成 refs、trace、audit、history 对象候选。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | 读取 maintenance、job、peripheral package / method set 对象轮廓。 | 形成 application / jobs / peripheral 对象候选。 |
| `02_hld_step_12_detailed_design_handoff.md` | 读取详细设计承接清单。 | 确认 Step 6 到 Step 7~17 的承接责任。 |
| `02_hld_step_13_risks_open_questions.md` | 读取风险和待确认事项。 | 判断对象主轴是否有未闭口风险。 |

#### 2.4 框架参考与历史材料

| 材料 | 当前定位 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | framework_reference | 只参考 Step 6 的分批深度、对象卡片结构、字段来源审计、状态闭环、后续 Step 承接表和门禁表达;不得复制 governance 领域语义。 |
| 旧 `projects/L3-method-library/design-calibration/03_ddd_step_06_object_contracts.md` | historical_material | 旧 completed 状态失效;只作差异审计和污染样本。 |
| 旧正式 `projects/L3-method-library/03-详细设计.md` §6 / §25~§27 | historical_material | 只作后置差异审计,不得作为当前对象字段或函数来源。 |

### 3. 当前输入边界初判

| 输入类别 | 当前判断 | Step 6 影响 |
|---|---|---|
| Step 5 模块主轴 | 已固定七个实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | Step 6 必须逐模块展开对象契约。 |
| Step 5 八组件横向映射 | 已固定八个业务组成部分到 owner / supporting / entry 的映射。 | 对象必须回指业务组成部分和 capability,不能只来自对象名。 |
| Step 5 依赖边界 | 已固定 compile dependency 和 forbidden dependency。 | 对象不得制造反向依赖;contracts 不引用 domain;domain 不引用 infra / DTO / repository。 |
| 正式 `02` 关键对象轮廓 | 已给出对象家族、对象分布、排除旧名和后续承接入口。 | Step 6 需要从对象轮廓升级到字段、函数、状态、不变量和来源。 |
| 旧 Step 6 | 旧对象家族和旧对象卡片失效。 | 只能后置差异审计,不得作为当前正向来源。 |

### 4. Step 6 需要形成的输出池

| 输出 | 内容要求 | 不在本模块完成 |
|---|---|---|
| 对象家族整体框架 | 按七模块和八组件 capability 形成对象家族候选、对象类别和分批策略。 | `R6.1` 只思考,不裁决最终对象清单。 |
| 对象卡片模板 | 固定对象身份、字段、值域、状态、工厂、成员函数、不变量、禁止事项、字段来源和后续承接。 | `R6.1` 不填具体对象字段。 |
| capability -> object 映射 | 每个模块功能由哪些对象承接,对象为何存在。 | 后续模块写入。 |
| 字段 / factory 来源闭环 | 每个字段和工厂入参来自 request、metadata、repository、resolver、policy、system id/time 或派生规则。 | 后续对象卡片写入。 |
| 状态 owner 预筛 | 哪些对象拥有状态,哪些只是 ref / marker / DTO wrapper。 | 状态矩阵后移 Step 10。 |
| 跨模块 shared ref 审计 | contracts shared type、domain truth、application helper、view/report、entry object 是否重复或串层。 | 后置到对象组完成后的审计模块。 |
| 历史 Step 6 差异审计 | 旧对象名、旧字段、旧 P0/P1、旧 snapshot / outbox / PostgreSQL 主线处理。 | 后置到差异审计模块。 |
| §6 回填草稿 | 将已确认对象契约转成正式 §6 中间草稿。 | 后续回填模块处理,不直接改正式 03。 |

### 5. Step 6 模块顺序草案

| 顺序 | 模块 | 产物 | 门禁 |
|---:|---|---|---|
| R6.1 | 开工与必读文档:先思考 | 本节 | completed;只列问题、必读文档、输入边界、输出池和模块顺序。 |
| R6.2 | 开工与必读文档:再写入 | 开工记录、读取状态、Step 内计划、输入基线、旧材料规则 | completed;不写对象字段。 |
| R6.3 | L1-governance 框架对齐:先思考 | 可借鉴框架和不得借鉴内容 | completed;只抽结构,不复制 governance 语义。 |
| R6.4 | L1-governance 框架对齐:再写入 | Step 6 框架对齐记录、对象卡片模板和分批深度规则 | completed;固定本仓 Step 6 输出结构。 |
| R6.5 | Step 5 承接与对象发现轴:先思考 | 七模块主轴、八组件 capability 和对象候选池草案 | completed;不裁决最终对象清单。 |
| R6.6 | Step 5 承接与对象发现轴:再写入 | capability -> object 候选池、排除项、对象类别定义 | completed;形成模块分批输入。 |
| R6.7 | `contracts` shared refs / markers / public shell:先思考 | public surface 二级类型和 view/report shell 候选 | completed;不写 schema。 |
| R6.8 | `contracts` shared refs / markers / public shell:再写入 | shared ref / marker / shell 对象卡片 | completed;不写 Step 8 DTO body。 |
| R6.9 | `domain` core truth 对象:先思考 | definition、catalog、formalization、version、consumption truth 对象草案 | completed;不写 flow。 |
| R6.10 | `domain` core truth 对象:再写入 | core truth 对象卡片 | completed;不写 repository / DTO。 |
| R6.11 | `domain` trace / relation / external / peripheral 对象:先思考 | trace、lineage、relation、external summary、package / set 对象草案 | completed;不恢复旧 snapshot / outbox 主线。 |
| R6.12 | `domain` trace / relation / external / peripheral 对象:再写入 | support truth / relation / peripheral 对象卡片 | completed;不写 external body。 |
| R6.13 | `domain` policy / guard / state owner 预筛:先思考 | policy、guard、state-bearing object 候选 | completed;不写 Step 10 矩阵。 |
| R6.14 | `domain` policy / guard / state owner 预筛:再写入 | policy / guard 对象卡片和状态 owner 预筛 | completed;不写状态迁移矩阵。 |
| R6.15 | `application` helper / orchestration support object:先思考 | operation context、idempotency、stored result、visibility/degraded、job assembly helper 候选 | completed;不写 port trait。 |
| R6.16 | `application` helper / orchestration support object:再写入 | application helper 对象卡片 | completed;不写 repository / port 方法。 |
| R6.17 | `infra` adapter state 与 runtime support object:先思考 | runtime config ref、adapter availability、store/publisher/resolver/handoff state 候选 | completed;不写 raw config / secret。 |
| R6.18 | `infra` adapter state 与 runtime support object:再写入 | infra support 对象卡片 | completed;不写 persistence schema。 |
| R6.19 | `api` / `worker` / `jobs` entry object:先思考 | handler、consumer、publisher loop、job entry/result object 候选 | 不写 transport DTO / flow。 |
| R6.20 | `api` / `worker` / `jobs` entry object:再写入 | entry / runner 对象卡片 | 不写 HTTP / topic / cron 绑定。 |
| R6.21 | 字段来源与状态主语闭环审计:先思考 | 高复用字段、对象组字段、状态 owner、shared ref 审计草案 | 不补新对象。 |
| R6.22 | 字段来源与状态主语闭环审计:再写入 | 字段来源表、对象组字段来源表、状态主语预筛表 | 形成 Step 7~16 承接门禁。 |
| R6.23 | 历史 Step 6 差异审计:先思考 | 旧 Step 6 污染扫描计划 | 只审计,不反推当前结论。 |
| R6.24 | 历史 Step 6 差异审计:再写入 | 旧对象 / 字段 / 状态 / 机制禁入、后移、重定义表 | 关闭旧 completed 污染。 |
| R6.25 | 回填草稿:先思考 | 正式 §6 回填策略 | 不修改正式 03。 |
| R6.26 | 回填草稿:再写入 | §6 回填草稿 | 仅写中间产物。 |
| R6.27 | 自检与停审:先思考 | Step 6 自检清单 | 判断是否可进入 Step 7。 |
| R6.28 | 自检与停审:再写入 | Step 6 停审记录 | 关闭 Step 6,同步 flow / 台账到 Step 7 等待状态。 |

### 6. R6.2 写入边界记录

`R6.1` 完成时,下一步只允许进入:

```text
R6.2 开工与必读文档:再写入
```

`R6.2` 已按该边界写入:

- Step 6 开工记录。
- 必读文档读取状态表。
- Step 内计划确认表。
- 当前输入基线。
- 旧 Step 6 历史材料处理规则。
- 下一模块 `R6.3 L1-governance 框架对齐:先思考` 的门禁。

`R6.2` 未写入:

- 正式 `03-详细设计.md`。
- 具体对象字段、函数、状态、工厂或不变量。
- trait / port / adapter 契约。
- DTO schema、event schema、job schema。
- 函数级 flow、状态矩阵、persistence schema 或 test case schema。
- `R6.3` 或 Step 7。

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 6 completed 状态失效 | 是。 |
| 是否列出 Step 6 必读文档 | 是。 |
| 是否形成对象家族整体框架和输出池 | 是。 |
| 是否形成 Step 6 模块顺序草案 | 是。 |
| 是否写入对象字段、trait 方法、DTO schema、flow、state matrix、persistence schema 或 case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.2` 写入或 Step 7 | 当时为否;`R6.2` 后续已在用户确认后单独写入。 |

R6.1 historical_next_allowed_action: 用户确认后进入 Step 6 `R6.2 开工与必读文档:再写入`;只允许写入 Step 6 开工记录、读取状态、Step 内计划、输入基线和旧材料规则;不得直接修改正式 `03-详细设计.md`;不得写具体对象字段、函数、状态、工厂或不变量;不得写 trait / port / DTO schema / flow / state matrix / persistence schema / test case schema;不得进入 `R6.3`、Step 7 或后续 Step。该动作已由 `R6.2` 完成,当前 next_allowed_action 以后文 `R6.2` 当前门禁为准。

---

## R6.2 开工与必读文档:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.2 开工与必读文档:再写入`。 |
| 本模块目标 | 将 `R6.1` 的开工思考固化为 Step 6 开工记录、读取状态、Step 内计划、输入基线和旧材料规则。 |
| 当前状态 | completed |
| 写入范围 | 仅写入本 Step 6 中间产物,并同步 flow / 项目台账到 `R6.3` 等待状态。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 旧材料状态 | 旧 Step 6 和旧正式 §6 仍为 historical_material,不得继承 completed 状态或旧对象结论。 |
| 本模块不做 | 不写具体对象字段、函数、状态、工厂、不变量、trait / port、DTO schema、flow、state matrix、persistence schema 或 test case schema。 |

### 2. 必读文档读取状态表

| 文档 / 材料 | 当前状态 | Step 6 使用方式 |
|---|---|---|
| `project_execution_ledger.md` | 已复核 | 确认当前恢复点从 `R6.2` 推进到 `R6.3` 等待用户确认。 |
| `03_ddd_calibration_flow.md` | 已复核 | 确认 Step 5 completed、Step 6 in_progress、Step 7 仍 blocked_by_step6。 |
| `03_ddd_step_01_input_boundary.md` | 已作为前序输入 | 只承接权威输入顺序和旧材料隔离规则。 |
| `03_ddd_step_02_scope.md` | 已作为前序输入 | 只承接本轮 03 范围、非范围和展开深度。 |
| `03_ddd_step_03_runtime_constraints.md` | 已作为前序输入 | 只承接 runtime、依赖、安全和缺口回设计红线。 |
| `03_ddd_step_04_module_layout.md` | 已作为前序输入 | 只承接七实现单元和文件布局 owner。 |
| `03_ddd_step_05_module_contracts.md` | 已复核为直接输入 | Step 6 的模块主轴、依赖边界、八组件横向映射和 owner 路由来源。 |
| `00-需求文档.md` | Step 6 正向输入 | 约束仓定位、Definition vs Use、body-free、外部正文禁入和验收红线。 |
| `01-架构设计.md` | Step 6 正向输入 | 约束数据所有权、依赖方向、一致性和外部协作边界。 |
| `02-概要设计.md` | Step 6 直接输入 | 提供八组件、关键对象轮廓、接口骨架、处理流轮廓、状态轮廓和承接清单。 |
| `02_hld_step_05_components_boundary.md` | Step 6 解释性输入 | 用于对象候选回指业务组成部分和 capability。 |
| `02_hld_step_06_key_objects*.md` | Step 6 解释性输入 | 用于对象候选池;不得机械继承字段。 |
| `02_hld_step_12_detailed_design_handoff.md` | Step 6 解释性输入 | 用于确认 Step 6 到 Step 7~17 的承接责任。 |
| `02_hld_step_13_risks_open_questions.md` | Step 6 解释性输入 | 用于识别对象主轴未闭口风险。 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 6 流程规范 | 约束逐模块小循环和进入 Step 7 条件。 |
| `standards/document/详细设计书写规范.md` | Step 6 写法规范 | 约束对象卡片、字段来源、不变量和后续索引写法。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 6 台账规范 | 约束单模块推进、先思考后写入和三层同步。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | Step 6 可落码红线 | 约束字段、factory、state owner、mapper、config、evidence schema 不得自行补口。 |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | `R6.3` 必读 | 只用于学习框架深度、对象卡片结构、分批粒度和门禁表达。 |
| 旧 `03_ddd_step_06_object_contracts.md` 内容 | historical_material | 只在 `R6.23` / `R6.24` 做差异审计;不得作为当前对象正向来源。 |
| 旧正式 `03-详细设计.md` §6 / §25~§27 | historical_material | 只用于后置污染扫描;不得作为字段、函数或对象命名来源。 |

### 3. Step 6 输入基线

| 输入基线 | 当前结论 | 对 Step 6 的约束 |
|---|---|---|
| 当前上游真相源 | 本轮已完成的 `00`、`01`、`02`。 | 对象只能从当前需求、架构、概要和本轮 Step 1~5 承接,不能从旧 03 反推。 |
| 当前模块主轴 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现单元。 | Step 6 必须按模块 / capability 小循环展开。 |
| 当前业务横轴 | `02` 的八个主要组成部分。 | 每个对象必须能回指业务组成部分或明确说明其 shared/support 角色。 |
| 当前依赖边界 | Step 5 固定 compile dependency 和 forbidden dependency。 | 对象归属不得制造 contracts/domain/application/infra/entry 的反向依赖。 |
| 当前详细设计深度 | Step 6 只负责对象实现契约。 | port、protocol、flow、state matrix、persistence、error、config、observability、test 分别后移 Step 7~16。 |
| 当前历史材料口径 | 旧 `03` 和旧 `03_ddd_*` 全部是 historical_material。 | 只能审计和过滤,不能直接继承 completed 状态、对象族或旧命名。 |

### 4. Step 内计划确认表

| 顺序 | 模块 | 状态 | 下一步关系 |
|---:|---|---|---|
| R6.1 | 开工与必读文档:先思考 | completed | 已形成必读文档、输入边界、输出池和模块顺序。 |
| R6.2 | 开工与必读文档:再写入 | completed | 已固化开工记录、读取状态、输入基线和旧材料规则。 |
| R6.3 | L1-governance 框架对齐:先思考 | completed | 已完成框架借鉴、禁用项和 method-library 适配方向思考。 |
| R6.4 | L1-governance 框架对齐:再写入 | completed | 已固化框架对齐记录、对象卡片模板、分批深度规则、审计模板和禁入表。 |
| R6.5 | Step 5 承接与对象发现轴:先思考 | completed | 已思考七模块主轴、八组件 capability、当前 `02` 关键对象轮廓、候选池来源、非对象项和旧 Step 6 污染候选。 |
| R6.6 | Step 5 承接与对象发现轴:再写入 | completed | 已写入 capability -> object 候选池、候选对象类别定义、排除 / 后移项和后续对象组顺序。 |
| R6.7 | `contracts` shared refs / markers / public shell:先思考 | completed | 已思考 typed boundary refs、safe markers、public shell、禁止进入 contracts 的 domain truth 和 `R6.8` 写入边界。 |
| R6.8 | `contracts` shared refs / markers / public shell:再写入 | completed | 已写入 typed boundary ref、safe marker、public shell 对象族卡片和 contracts 禁止事项。 |
| R6.9 | `domain` core truth 对象:先思考 | completed | 已思考 definition、catalog、formalization、version、consumption truth / support summary 对象草案和字段来源风险。 |
| R6.10 | `domain` core truth 对象:再写入 | completed | 已写入 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalizationBasisSummary`、`FormalizationState`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial` 对象卡片。 |
| R6.11 | `domain` trace / relation / external / peripheral 对象:先思考 | completed | 已思考 trace / impact / audit / lineage、relation / distribution、external summary、package / method set 对象草案和旧 snapshot / outbox 禁入边界。 |
| R6.12 | `domain` trace / relation / external / peripheral 对象:再写入 | completed | 已写入 `ExternalSourceSummary`、`MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` 对象卡片。 |
| R6.13 | `domain` policy / guard / state owner 预筛:先思考 | completed | 已思考 policy / guard / boundary 候选、写入分组、字段来源风险和状态主语预筛。 |
| R6.14 | `domain` policy / guard / state owner 预筛:再写入 | completed | 已写入七个 policy / guard / boundary 对象卡片和状态主语预筛。 |
| R6.15 | `application` helper / orchestration support object:先思考 | completed | 已思考 operation context、idempotency、stored result、query read decision、degraded / unavailable 和 job assembly helper 候选。 |
| R6.16 | `application` helper / orchestration support object:再写入 | completed | 已写入八个 application helper / support object 卡片。 |
| R6.17 | `infra` adapter state 与 runtime support object:先思考 | completed | 已思考 runtime config binding、runtime assembly、adapter availability、store / resolver / source / publisher / handoff binding 和 safe diagnostic 候选。 |
| R6.18 | `infra` adapter state 与 runtime support object:再写入 | completed | 已写入九个 infra adapter state / runtime support object 卡片。 |
| R6.19 | `api` / `worker` / `jobs` entry object:先思考 | completed | 已完成 entry / runner local object 候选裁决和 `R6.20` 写入边界。 |
| R6.20 | `api` / `worker` / `jobs` entry object:再写入 | completed | 已写入 12 个 api / worker / jobs entry / runner 对象卡片。 |
| R6.21 | 字段来源与状态主语闭环审计:先思考 | completed | 已形成高复用字段族、对象组字段来源、状态 owner、shared ref、entry/result kind 和 Step 7~16 暂停条件审计草案。 |
| R6.22 | 字段来源与状态主语闭环审计:再写入 | completed | 已写入字段来源表、对象组字段来源表、状态主语预筛表和 Step 7~16 暂停条件表。 |
| R6.23 | 历史 Step 6 差异审计:先思考 | completed | 已形成旧 Step 6 / 旧正式 03 污染扫描计划、污染类别、审计对象、判断规则和 `R6.24` 写入模板。 |
| R6.24 | 历史 Step 6 差异审计:再写入 | completed | 已写入旧 Step 6 状态污染关闭记录、旧对象 / 字段 / 状态 / 机制禁入、后移、重定义表、旧正式 §6 / 全文扩散污染表和当前 `R6.22` 保护表。 |
| R6.25 | 回填草稿:先思考 | completed | 已形成正式 §6 回填策略、章节结构、摘要深度、旧污染过滤方式和 `R6.26` 写入边界。 |
| R6.26 | 回填草稿:再写入 | completed | 已在本中间产物中写入正式 §6 回填草稿、R6.27 自检输入门禁和本模块状态;未修改正式 `03-详细设计.md`。 |
| R6.27 | 自检与停审:先思考 | completed | 已形成 Step 6 自检判断、停审写入边界和 Step 7 readiness 判断。 |
| R6.28 | 自检与停审:再写入 | completed | 已写入 Step 6 停审记录,并同步 flow / 台账到 Step 7 等待状态。 |

### 5. 旧 Step 6 历史材料处理规则

| 规则 | 口径 |
|---|---|
| 不继承 completed | 旧 Step 6 的 `[x] 已确认` 和旧对象卡片状态在本轮 full-restart 中失效。 |
| 不恢复旧主线 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox、delivery、PostgreSQL、P0/P1 不得作为当前对象主线。 |
| 不从旧字段反推 | 旧字段、旧函数、旧状态和旧命名不能直接进入当前对象卡片。 |
| 可做后置审计 | 旧材料只在 `R6.23` / `R6.24` 用于污染扫描、差异审计、禁入 / 后移 / 重定义记录。 |
| 可重新引入事实 | 若旧材料中的事实仍有价值,必须由当前 `00/01/02` 或本轮 Step 1~6 重新证明来源、owner 和使用边界。 |
| 缺口必须暂停 | 若对象字段来源、state owner、factory 入参或 cross-step 承接不闭口,必须暂停回设计讨论,不得由实现端自行补口。 |

### 6. R6.3 输入门禁

`R6.3` 只允许进入:

```text
L1-governance 框架对齐:先思考
```

`R6.3` 必须读取并思考:

| 输入 | 思考目的 |
|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 学习 Step 6 的分批深度、对象卡片结构、字段来源审计、状态闭环和门禁表达。 |
| 本文件 `R6.1` / `R6.2` | 确认 method-library 当前 Step 6 的输入基线和旧材料规则。 |
| Step 5 中间产物 | 确认七模块主轴和八组件横向映射如何承接到对象卡片。 |
| 详细设计 SOP / 书写规范 / 中间产物规范 / 可落码性标准 | 确认框架对齐不能越过 Step 6 边界。 |

`R6.3` 不得写入:

- 对象字段、函数、状态、工厂或不变量。
- `contracts` / `domain` / `application` / `infra` / `api` / `worker` / `jobs` 的具体对象卡片。
- trait / port / adapter 契约。
- DTO schema、event schema、job schema。
- 函数级 flow、状态矩阵、persistence schema 或 test case schema。
- 正式 `03-详细设计.md`。
- `R6.4`、Step 7 或后续 Step。

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 6 开工记录 | 是。 |
| 是否写入必读文档读取状态表 | 是。 |
| 是否写入 Step 6 输入基线 | 是。 |
| 是否写入 Step 内计划确认表 | 是。 |
| 是否写入旧 Step 6 历史材料规则 | 是。 |
| 是否写入具体对象字段、函数、状态、工厂或不变量 | 否。 |
| 是否写入 trait / port / DTO schema / flow / state matrix / persistence schema 或 case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.3` 思考或 `R6.4` 写入 | 当时为否;`R6.3` 后续已在用户确认后单独完成。 |

R6.2 historical_next_allowed_action: 用户确认后进入 Step 6 `R6.3 L1-governance 框架对齐:先思考`;只允许读取并思考 L1-governance Step 6 框架的分批深度、对象卡片结构、字段来源审计、状态闭环、后续 Step 承接表和门禁表达;不得复制 governance 领域语义;不得写 method-library 具体对象字段、函数、状态、工厂或不变量;不得修改正式 `03-详细设计.md`;不得写 trait / port / DTO schema / flow / state matrix / persistence schema / test case schema;不得进入 `R6.4`、Step 7 或后续 Step。该动作已由 `R6.3` 完成,当前 next_allowed_action 以后文 `R6.3` 当前门禁为准。

---

## R6.3 L1-governance 框架对齐:先思考

### 1. 思考记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.3 L1-governance 框架对齐:先思考`。 |
| 本模块目标 | 阅读 L1-governance Step 6,提炼可迁移的 Step 6 框架深度、对象卡片模板、批次节奏、字段闭环和状态闭环方式。 |
| 当前状态 | completed |
| 当前边界 | 只做框架对齐思考,不写 method-library 具体对象字段、函数、状态、工厂或不变量。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不复制 governance 领域语义;不写 trait / port / DTO schema / flow / state matrix / persistence schema 或 test case schema;不进入 `R6.4`。 |

### 2. L1-governance 可借鉴框架

| 框架点 | governance 做法 | method-library 可借鉴方式 |
|---|---|---|
| 内容详尽、批次受控 | 明确“约 300 行”只限制单次写入规模,不限制章节最终长度。 | Step 6 后续对象组必须写到可落码,若超过批次就拆分继续,不得压缩对象字段、来源、约束和正反例。 |
| 先总览再对象卡片 | 先给对象归属总览,再按 `contracts`、`domain`、`application`、`infra`、entry 分批展开。 | method-library 应先在 `R6.6` 固化 capability -> object 候选池,再进入 `R6.7` 起的对象组小循环。 |
| 对象模板固定 | 每个对象包含 Rust code block、字段表、函数表、工厂表、不变量 / 禁止事项。 | `R6.4` 应固定本仓 Step 6 对象卡片模板,后续对象组不得只写名称清单。 |
| 状态 enum 模板固定 | enum 需要 Rustdoc、作用、允许来源、允许去向。 | method-library 只有当当前 `02` 或后续 Step 10 能支撑有限状态时才写 enum;否则使用 typed marker / newtype 并标明不可自造变体。 |
| 字段来源闭环 | 高复用字段来源审计和对象组字段来源审计分开。 | method-library 也需要高复用字段族表和对象组字段来源表,并标注后续 Step 7/8/11/13/14 闭合点。 |
| 状态闭环 | Step 6 做状态 owner 和迁移来源预闭环,但不替代 Step 10。 | method-library 应在 `R6.21` / `R6.22` 做状态主语预筛,避免 Step 10 才发现状态主体不明。 |
| 后续承接表 | 明确 Step 7~16 必须承接哪些对象字段和闭口点。 | method-library 的 `R6.26` / `R6.28` 必须给 Step 7~16 承接清单,尤其 port、DTO、flow、persistence、config、test。 |
| 待确认事项分类 | 把 Step 6 内关闭项、后续 Step 必须闭合项、不应在 Step 6 抢写项分开。 | method-library 需要同样区分 blocker、后移项和禁止提前展开项。 |

### 3. 不得借鉴的治理领域语义

| 不得复制项 | 原因 | method-library 处理 |
|---|---|---|
| Governance context / gate / decision / approval / control / nonconformity 等对象名 | 属于 L1-governance 领域语义。 | 只能学习对象组织方式,不能带入 method-library。 |
| GRC、AIIA、SoA、handoff/export 等治理场景 | 与 method-library 当前 `00/01/02` 输入不一致。 | 若 method-library 存在外部引用或报告,必须从本仓概要对象重新命名和闭口。 |
| governance 的状态 enum 变体 | 状态含义依赖治理流程。 | method-library 状态必须来自本仓 `02` 状态轮廓或后续 Step 10,不得套用。 |
| governance 的 port / DTO / flow blocker 编号 | 后续 Step 形态可参考,编号和内容不可复制。 | method-library 后续 open item 必须使用本仓对象、capability 和 owner。 |
| governance 的对象数量和批次密度 | governance 领域更大,不能机械等量迁移。 | method-library 按自身七模块、八组件和对象候选池决定分组深度。 |

### 4. 对 method-library Step 6 的适配判断

| 适配项 | 当前判断 | R6.4 需要固化 |
|---|---|---|
| 对象归属总览 | 需要。否则后续会退回全仓总表或对象散列表。 | 给出七模块对象类别、来源、后续对象组顺序和非对象项。 |
| 对象卡片模板 | 需要。且应比当前 R6.1 更正式。 | 固定 code block、字段表、函数表、工厂表、不变量 / 禁止事项、字段来源、后续承接。 |
| shared type 优先 | 需要。`contracts` 的 typed refs / markers / public shell 应先于 domain truth。 | 固定 `contracts` 先行原则,但不提前写 DTO body。 |
| field-source audit | 需要。实现侧 blocker 常来自字段来源不闭合。 | 固定高复用字段族和对象组字段来源审计在 `R6.21` / `R6.22` 完成。 |
| state-subject audit | 需要。状态不能到 Step 10 才发现 owner 不明。 | 固定状态 owner 预筛,但不写完整状态矩阵。 |
| 后续 Step handoff | 需要。Step 6 结束时必须让 Step 7~16 知道要承接什么。 | 固定 Step 7~16 承接清单和缺口暂停规则。 |
| 正式文档装配 | 后移。 | `R6.25` / `R6.26` 只写 §6 回填草稿,正式 `03` 仍等装配门禁。 |

### 5. R6.4 写入边界

`R6.4` 可以写入:

- L1-governance 框架对齐记录。
- method-library Step 6 的对象卡片模板。
- 分批深度规则和“单批不等于总长度上限”规则。
- 对象归属总览的写入格式。
- 字段来源审计、状态主语审计和后续 Step 承接表的模板。
- 不得复制 governance 语义的禁入表。

`R6.4` 不得写入:

- method-library 具体对象字段、函数、状态、工厂或不变量。
- `contracts` / `domain` / `application` / `infra` / `api` / `worker` / `jobs` 的对象卡片正文。
- trait / port / adapter 契约。
- DTO schema、event schema、job schema。
- 函数级 flow、状态矩阵、persistence schema 或 test case schema。
- 正式 `03-详细设计.md`。
- `R6.5`、Step 7 或后续 Step。

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取 L1-governance Step 6 框架 | 是。 |
| 是否提炼可借鉴框架 | 是。 |
| 是否列出不得借鉴的治理领域语义 | 是。 |
| 是否形成 method-library 适配判断 | 是。 |
| 是否写入 method-library 具体对象字段、函数、状态、工厂或不变量 | 否。 |
| 是否写入 trait / port / DTO schema / flow / state matrix / persistence schema 或 case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.4` 写入或 Step 7 | 当时为否;`R6.4` 后续已在用户确认后单独完成。 |

R6.3 historical_next_allowed_action: 用户确认后进入 Step 6 `R6.4 L1-governance 框架对齐:再写入`;只允许固化 Step 6 框架对齐记录、对象卡片模板、分批深度规则、对象归属总览格式、字段来源审计模板、状态主语审计模板、后续 Step 承接表模板和 governance 语义禁入表;不得写 method-library 具体对象字段、函数、状态、工厂或不变量;不得修改正式 `03-详细设计.md`;不得写 trait / port / DTO schema / flow / state matrix / persistence schema / test case schema;不得进入 `R6.5`、Step 7 或后续 Step。该动作已由 `R6.4` 完成,当前 next_allowed_action 以后文 `R6.4` 当前门禁为准。

---

## R6.4 L1-governance 框架对齐:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.4 L1-governance 框架对齐:再写入`。 |
| 本模块目标 | 将 `R6.3` 的框架思考固化为 method-library Step 6 的写入模板、分批深度规则、审计模板和禁入表。 |
| 当前状态 | completed |
| 写入范围 | 仅写入 Step 6 框架规则和后续模块模板,不写具体对象卡片。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 下一模块 | `R6.5 Step 5 承接与对象发现轴:先思考`。 |

### 2. 框架对齐记录

| 对齐项 | 固化规则 | 后续使用位置 |
|---|---|---|
| 先总览再对象 | Step 6 必须先形成对象归属总览和 capability -> object 候选池,再写对象卡片。 | `R6.5` / `R6.6` |
| 先 shared 后 truth | public surface 可引用的 shared ref / marker / shell 先在 `contracts` 组收束。 | `R6.7` / `R6.8` |
| 对象卡片不可压缩成清单 | 每个正式对象卡片必须包含身份、责任、字段、函数、工厂、不变量、禁止事项、字段来源和后续承接。 | `R6.8` 起所有写入模块 |
| 单批不等于总长度上限 | 100~300 行只约束单次写入批次,不限制对象组最终长度。 | 后续所有写入模块 |
| 字段来源必须显式 | 必填字段必须说明来源;不能从名称、route、字符串、旧材料或实现便利反推。 | 对象卡片和 `R6.21` / `R6.22` |
| 状态主语必须提前预筛 | Step 6 先判断哪些对象有状态、哪些只是 ref / marker / shell;完整矩阵后移 Step 10。 | `R6.13` / `R6.14` / `R6.21` / `R6.22` |
| 后续 Step 必须承接 | Step 6 不闭合 port、DTO、flow、persistence、config、test,但必须标出承接点和暂停条件。 | `R6.26` / `R6.28` |

### 3. 对象卡片模板

后续对象写入模块必须使用以下模板。模板中的 `<...>` 是占位符,不是本仓对象名。

````md
##### `<TypeName>`

```rust
/// <English object boundary and invariant summary.>
pub struct TypeName {
    /// <English field meaning and boundary.>
    pub field_name: FieldType,
}
```

| 项 | 内容 |
|---|---|
| implementation unit | `<contracts / domain / application / infra / api / worker / jobs>` |
| type owner | `<crate / module / file group>` |
| capability owner | `<来自 Step 5 / Step 6 候选池的 capability>` |
| business component | `<当前 02 的业务组成部分或 shared/support 说明>` |
| object category | `<shared ref / marker / truth / policy / helper / adapter state / entry object>` |
| primary responsibility | `<对象为什么存在>` |
| non-responsibility | `<对象明确不做什么>` |

| 字段 | 类型 | 作用 | 约束 / 来源 | 后续承接 |
|---|---|---|---|---|

| 函数签名 | 作用 | 参数来源 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|

| 工厂函数签名 | 作用 | 必填入参来源 | 返回 | 使用场景 |
|---|---|---|---|---|

| 不变量 / 禁止事项 | 说明 |
|---|---|
````

### 4. 状态 enum 模板

状态对象只有在当前 `02` 或后续 Step 10 能支撑有限状态变体时才能写 enum。否则必须使用 typed marker / newtype,并记录“不得自造变体”。

````md
```rust
/// <English state boundary summary.>
pub enum StateName {
    /// <English variant business meaning.>
    Variant,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 | Step 10 承接 |
|---|---|---|---|---|---|

| 状态红线 | 说明 |
|---|---|
````

### 5. 对象归属总览格式

`R6.6` 必须先形成对象归属总览,再允许进入 `contracts` 具体对象组。

| implementation unit | 对象类别 | 候选来源 | 后续写入模块 | 不得在此阶段写入 |
|---|---|---|---|---|
| `contracts` | shared ref / marker / public shell | 当前 `02` 关键对象轮廓、public surface、跨模块引用 | `R6.7` / `R6.8` | DTO body、transport schema、domain-only truth |
| `domain` | truth / relation / trace / policy / guard | 当前 `02` core truth、关系、约束、状态轮廓 | `R6.9`~`R6.14` | repository、adapter、API DTO、持久化 schema |
| `application` | helper / orchestration support object | operation context、idempotency、visibility、degraded、job assembly | `R6.15` / `R6.16` | port trait、UoW 事务顺序、protocol result schema |
| `infra` | adapter state / runtime support object | runtime assembly、adapter availability、store / resolver / publisher support | `R6.17` / `R6.18` | raw config、secret、URL、topic、DB schema |
| `api` / `worker` / `jobs` | entry / runner local object | command/query handler、consumer、publisher loop、job runner | `R6.19` / `R6.20` | HTTP path、topic binding、cron、full flow |

### 6. 字段来源审计模板

字段来源审计在 `R6.21` / `R6.22` 统一写入。对象卡片先写字段来源,审计模块再横向检查是否一致。

| 字段族 | 出现对象组 | 正式归属 | 允许来源 | 后续闭合 Step | 实现侧暂停条件 |
|---|---|---|---|---|---|
| `*_id` / `*_ref` | 待对象组填充 | `contracts` 或 module-local typed ref | request / repository load / system id generator / formally derived ref | Step 7 / Step 8 / Step 11 | 只能从裸字符串、路径、title 或旧对象名推导时暂停。 |
| `*_state` / `*_kind` | 待对象组填充 | enum / typed marker / newtype | 当前 `02` 状态轮廓、policy output、resolver summary、transition method | Step 10 / Step 12 | 变体或 kind 没有正式来源时暂停。 |
| `*_digest` / `*_version` | 待对象组填充 | typed digest / version ref | canonical digest calculator、source version summary、storage version | Step 11 / Step 13 / Step 14 | hash 算法、版本迁移或 optimistic version 来源不明时暂停。 |
| `*_cursor` / `*_marker` | 待对象组填充 | typed cursor / visibility / freshness / degraded marker | committed truth cursor、projection state、resolver output、policy output | Step 9 / Step 11 / Step 12 | 用 timestamp、page cursor、trace id 或 private index 替代时暂停。 |
| config / adapter refs | 待对象组填充 | typed config / adapter availability ref | validated config loader、adapter factory、health check marker | Step 14 / Step 15 | raw config、secret、URL、topic 或产品参数进入对象时暂停。 |

### 7. 状态主语审计模板

| 状态主语 | 状态承载对象 | 初始来源 | 迁移 owner | Step 10 承接 | 禁止事项 |
|---|---|---|---|---|---|
| domain truth state | 待对象组填充 | factory / accepted command / formal import | domain transition + application flow | 必须写状态矩阵 | query、job、adapter 不得直接修 truth。 |
| projection / read material state | 待对象组填充 | projection builder / committed truth cursor | maintenance job / projection flow | 必须写 stale / fresh / degraded 矩阵 | projection 不得反写真相。 |
| external reference state | 待对象组填充 | resolver / consumer / refresh job summary | refresh flow / consumer flow | 必须写 resolved / stale / unavailable 类矩阵 | 不得保存外部正文。 |
| application technical state | 待对象组填充 | operation context / idempotency reserve / stored result | application service | 必须写 duplicate / conflict / replay 规则 | query 不得进入 write idempotency。 |
| infra / entry local state | 待对象组填充 | config validation / runtime builder / handler validation | infra builder / entry precheck | 必须写 error / unavailable 映射 | 不得改变 domain invariant。 |

### 8. 后续 Step 承接表模板

| 后续 Step | 必须承接的 Step 6 内容 | 承接失败时的暂停条件 |
|---|---|---|
| Step 7 Trait / Port / Adapter | id generator、repository get/list/save、resolver、publisher、handoff、stored result、projection lookup | 对象字段存在但无读取面 / 写入面 / mapper / resolver summary。 |
| Step 8 Protocol | public DTO 可引用的 shared refs、markers、view/report shell、metadata、result shell | public DTO 引用 domain-only object 或缺正式 schema。 |
| Step 9 Function Flow | factory / transition 调用顺序、trace / history / stale / outbox 构造时机 | 对象字段在流程时机上拿不到。 |
| Step 10 State Matrix | Step 6 enum / state owner / terminal semantics | 状态迁移只能从函数名或实现便利推断。 |
| Step 11 Persistence | identity、version、cursor、append-only、projection/read material、stored result | optimistic version、payload lookup 或 durable key 无来源。 |
| Step 12 Error / Recovery | validation issue ref、degraded / unavailable / not-visible marker、retry / dead-letter kind | error 只能抛普通异常或缺 public safe marker。 |
| Step 13 Concurrency / Idempotency | operation key、digest、stored result ref、duplicate replay、job report replay | duplicate 只能重跑 mutation / scan。 |
| Step 14 Config / External Binding | config ref、adapter availability、resolver binding、source version / schema binding | raw config、secret 或产品参数进入对象。 |
| Step 15 Observability / Audit | trace subject、audit source、redacted issue refs、handoff/report marker | trace/audit subject 无正式 mapper。 |
| Step 16 Test Cut | object factory、field source、state transition、no-body、degraded、duplicate replay | 测试无法暴露字段来源或状态 owner 缺口。 |

### 9. governance 语义禁入表

| 禁入类别 | 禁入内容 | 允许替代方式 |
|---|---|---|
| 领域对象 | governance context、gate、decision、approval、control、nonconformity、AIIA、SoA 等对象名。 | 仅复用对象卡片和审计结构,对象名由 method-library 当前 `02` 重新发现。 |
| 状态变体 | Governance 专属 state enum 和变体语义。 | 只使用 method-library 当前 `02` 或后续 Step 10 闭合的状态。 |
| 场景术语 | GRC、治理审批、控制审查、纠正措施等领域场景。 | 若有类似“外部引用 / 报告 / 维护”能力,必须按 method-library 业务语义重命名。 |
| blocker 编号 | `GVN-S6-*` 等 governance 编号。 | method-library 后续 open item 另用本仓编号和本仓对象主语。 |
| 对象规模 | governance 的对象数量和分批密度。 | method-library 按七模块、八组件和候选池确定实际粒度。 |

### 10. R6.5 输入门禁

`R6.5` 只允许进入:

```text
Step 5 承接与对象发现轴:先思考
```

`R6.5` 必须思考:

- Step 5 七个实现单元如何成为对象发现主轴。
- Step 5 八组件横向映射如何转成 capability -> object 候选。
- 当前 `02` 关键对象轮廓如何进入候选池。
- 哪些项只是 port / DTO / flow / persistence / config / test,不能误放进对象卡片。
- 旧 Step 6 中哪些对象名属于污染候选,只能后置审计。

`R6.5` 不得写入:

- 最终对象清单。
- 具体对象字段、函数、状态、工厂或不变量。
- trait / port / adapter 契约。
- DTO schema、event schema、job schema。
- 函数级 flow、状态矩阵、persistence schema 或 test case schema。
- 正式 `03-详细设计.md`。
- `R6.6`、Step 7 或后续 Step。

### 11. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否固化 L1-governance 框架对齐记录 | 是。 |
| 是否固化对象卡片模板 | 是。 |
| 是否固化分批深度规则 | 是。 |
| 是否固化对象归属总览格式 | 是。 |
| 是否固化字段来源审计模板 | 是。 |
| 是否固化状态主语审计模板 | 是。 |
| 是否固化后续 Step 承接表模板 | 是。 |
| 是否固化 governance 语义禁入表 | 是。 |
| 是否写入 method-library 具体对象字段、函数、状态、工厂或不变量 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.5` 思考或 Step 7 | 否。 |

R6.4 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.5 Step 5 承接与对象发现轴:先思考`;只允许思考七模块主轴、八组件 capability、当前 `02` 关键对象轮廓、候选池来源、非对象项和旧 Step 6 污染候选;不得写最终对象清单;不得写具体对象字段、函数、状态、工厂或不变量;不得修改正式 `03-详细设计.md`;不得写 trait / port / DTO schema / flow / state matrix / persistence schema / test case schema;不得进入 `R6.6`、Step 7 或后续 Step。该动作已由 `R6.5` 完成,当前 next_allowed_action 以后文 `R6.5` 当前门禁为准。

---

## R6.5 Step 5 承接与对象发现轴:先思考

### 1. 思考记录

`R6.5` 的目标不是产出最终对象清单,而是把 Step 5 已确认的模块主轴和业务组成部分转成后续 `R6.6` 可写入的发现轴。这里先确认“从哪里发现对象、用什么规则过滤、哪些旧内容不能进入”,避免 `R6.6` 直接变成全仓对象罗列。

本轮对象发现必须同时满足三条来源约束:

| 来源约束 | 含义 | 对 R6.6 的影响 |
|---|---|---|
| 七模块主轴 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 是对象落点和依赖边界。 | 候选池必须先按模块 owner 分层,不能只按业务名聚合。 |
| 八组件 capability | Step 5 已把八个业务组成部分映射到 primary / supporting / entry 模块。 | 每个候选对象必须能说明它服务哪个 capability。 |
| 当前 `02` 关键对象轮廓 | `02-概要设计.md` 和 `02_hld_step_06_key_objects*` 只提供轮廓,不是字段级契约。 | `R6.6` 可以形成候选池,但具体字段、函数、状态、工厂要留给后续对象组。 |

因此,`R6.5` 的核心判断是:先建立对象发现轴,再让 `R6.6` 写入候选池和排除项;不得在本模块提前闭合对象字段或对象总数。

### 2. 七模块对象发现轴

| 模块 | 对象发现问题 | 候选类型边界 | 后续展开位置 |
|---|---|---|---|
| `contracts` | 哪些类型必须跨 crate 共享,且不能带 domain 行为? | typed ref、marker、public shell、view/report shell、metadata shell。 | `R6.7` / `R6.8` |
| `domain` | 哪些对象承载方法定义、目录、正式化、版本、消费、关系、追溯和外围包 truth? | aggregate、entity、value object、domain policy、domain event fact、state enum。 | `R6.9`~`R6.14` |
| `application` | 哪些对象只服务编排、幂等、stored result、degraded/visibility、job assembly? | operation context、command result helper、read decision helper、job support object。 | `R6.15` / `R6.16` |
| `infra` | 哪些对象表达 adapter runtime 状态和外部依赖可用性,但不泄漏 raw config? | adapter state、availability marker、source binding ref、store/runtime support object。 | `R6.17` / `R6.18` |
| `api` | 哪些对象只作为命令 / 查询入口封装,不拥有业务 truth? | handler input context、route-safe command shell、response assembly support。 | `R6.19` / `R6.20` |
| `worker` | 哪些对象承接事件消费、外部摘要输入、handoff 或异步分发入口? | consumer context、message receipt shell、event handling support object。 | `R6.19` / `R6.20` |
| `jobs` | 哪些对象承接后台维护、收敛、重建、检查和报告入口? | job request、job result、job report shell、maintenance cursor / checkpoint。 | `R6.19` / `R6.20` |

该轴只定义“在哪里找对象”。若候选对象跨多个模块,必须在 `R6.6` 标明 primary owner 和 supporting owner,后续对象卡片只能在 primary owner 下闭合字段和行为。

### 3. 八组件 capability 发现轴

| 业务组成部分 | Step 5 owner 口径 | 对象发现方向 | 当前 R6.5 判断 |
|---|---|---|---|
| 方法资产定义与目录 | primary `domain`; supporting `contracts/application/infra`; entry `api` | definition、catalog、classification、lookup-safe ref。 | 应进入 domain core truth 候选,contracts 只保留 ref / shell。 |
| 正式化与版本 | primary `domain`; supporting `contracts/application/infra`; entry `api` | formalization record、version lineage、schema / rule marker。 | 应进入 domain core truth 与 state owner 预筛。 |
| 受控消费 | primary `domain`; supporting `contracts/application/infra`; entry `api/worker` | consumption policy、grant/decision、safe use summary。 | 应区分 domain policy 与 application decision helper。 |
| 追溯与一致性保护 | primary `domain`; supporting `contracts/application/infra`; entry `api/worker/jobs` | trace、history、audit、consistency issue、repair marker。 | 应进入 trace / audit / state owner 候选,不得恢复旧 snapshot 主线。 |
| 关系与分发语义 | primary `domain`; supporting `contracts/application/infra`; entry `api/worker/jobs` | relation edge、distribution scope、dependency relation、handoff semantic marker。 | 应进入 relation truth 和 handoff shell 候选。 |
| 外部摘要与引用 | primary `domain`; supporting `contracts/application/infra`; entry `api/worker` | external summary ref、source binding、reference state、sidecar-safe marker。 | 应进入 external summary / reference 候选,正文仍禁入。 |
| 后台维护与收敛 | primary `application`; supporting `contracts/domain/infra`; entry `api/worker/jobs` | maintenance job, convergence plan, rebuild report, reconciliation finding。 | 应以 application/job support object 为主,domain 只提供可维护 truth。 |
| 外围包与方法集组织 | primary `domain`; supporting `contracts/application/infra`; entry `api/worker/jobs` | peripheral package、method set、membership、release-safe summary。 | 应进入 domain peripheral truth 候选,entry 模块只保留入口 shell。 |

该轴回答“为什么需要对象”。后续每个候选对象至少要回指一个 capability;无法回指 capability 的名称,先进入排除项或历史污染候选。

### 4. 当前 `02` 关键对象轮廓如何进入候选池

`02-概要设计.md` 的关键对象轮廓只能作为候选来源,不能直接升级为最终对象契约。进入 `R6.6` 时应按以下方式转换:

| `02` 轮廓来源 | 进入候选池的方式 | 暂不做的事 |
|---|---|---|
| 关键对象主控表 | 拆成 module owner、capability、对象类别、是否 state-bearing。 | 不补字段表。 |
| core truth 对象轮廓 | 标为 `domain` primary 候选,并记录关联 capability。 | 不写 constructor / transition。 |
| policy / guard 对象轮廓 | 区分 domain policy、application helper、infra adapter marker。 | 不写 policy evaluation flow。 |
| view / material / report 轮廓 | 区分 contracts shell、domain projection state、application report support。 | 不写 DTO schema 或 persistence schema。 |
| refs / trace / audit 轮廓 | 提取 typed ref、trace subject、audit subject、history fact 候选。 | 不写 mapper / audit flow。 |
| operations / peripheral 轮廓 | 提取 job support、maintenance report、package / method-set truth 候选。 | 不写 job execution flow。 |

如果 `02_hld_*` 与正式 `02-概要设计.md` 的表述不一致,`R6.6` 只能采用正式 `02` 口径;中间产物只能作为解释来源。

### 5. 非对象项过滤规则

| 非对象项 | 为什么不能进入 Step 6 对象卡片 | 应后移到 |
|---|---|---|
| repository / resolver / publisher / handoff trait | 这是外部能力边界,不是对象本体。 | Step 7 |
| command / query / event / job DTO body | 这是协议 schema。 | Step 8 |
| 函数级流程、调用顺序、分支处理 | 这是 operation flow。 | Step 9 |
| 完整状态迁移矩阵 | Step 6 只预筛 state owner。 | Step 10 |
| 数据表、索引、事务、锁和 durable key | 这是 persistence / transaction 契约。 | Step 11 |
| 错误恢复分支和 public rejection schema | 这是 error / recovery 和 protocol 交界。 | Step 12 / Step 8 |
| 幂等 replay、duplicate response、run-scoped evidence | 这是并发幂等或测试证据机制。 | Step 13 / Step 16 |
| raw config、secret、deployment value | 对象只能引用 typed config ref 或 binding marker。 | Step 14 |

过滤规则不是删除这些能力,而是防止 Step 6 过早把 port、DTO、flow、persistence 伪装成 domain object。

### 6. 旧 Step 6 污染候选

旧 Step 6 只能在 `R6.23` / `R6.24` 做差异审计。当前先记录污染方向,不展开旧对象清单:

| 污染方向 | 当前处理 |
|---|---|
| 旧 `MethodContent` 正文承载模型 | body-free 边界下不得正向进入候选池。 |
| publish / delivery / outbox 主线 | 不得作为当前分发语义对象来源;如当前 `02` 需要 handoff / distribution,必须重新命名和重新归属。 |
| snapshot / fingerprint 主线 | 不得作为版本、摘要、追溯对象的默认命名来源。 |
| PostgreSQL / 表结构先行对象 | 不得从 persistence 反推对象。 |
| P0 / P1 分层 | 不得覆盖当前七模块和八组件主轴。 |

如果后续发现旧名称与当前 `02` 中的新候选相似,必须按当前 00/01/02 重新证明其存在,不能说“旧文件已有所以保留”。

### 7. R6.6 写入边界

`R6.6` 可以写入:

- capability -> object 候选池。
- 候选对象类别定义。
- 模块 primary owner / supporting owner。
- 排除项和后移项。
- `R6.7` 起对象组展开顺序。

`R6.6` 不得写入:

- 最终对象清单。
- 具体对象字段、函数、状态、工厂或不变量。
- trait / port / adapter 契约。
- DTO schema、event schema、job schema。
- 函数级 flow、状态矩阵、persistence schema 或 test case schema。
- 正式 `03-详细设计.md`。
- `R6.7`、Step 7 或后续 Step。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否思考七模块对象发现轴 | 是。 |
| 是否思考八组件 capability 发现轴 | 是。 |
| 是否说明当前 `02` 关键对象轮廓进入候选池的方式 | 是。 |
| 是否列出非对象项过滤规则 | 是。 |
| 是否记录旧 Step 6 污染候选方向 | 是。 |
| 是否写入最终对象清单 | 否。 |
| 是否写入具体对象字段、函数、状态、工厂或不变量 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.6` 写入或 Step 7 | 否。 |

R6.5 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.6 Step 5 承接与对象发现轴:再写入`;只允许写入 capability -> object 候选池、候选对象类别定义、模块 primary / supporting owner、排除项、后移项和 `R6.7` 起对象组展开顺序;不得写最终对象清单;不得写具体对象字段、函数、状态、工厂或不变量;不得修改正式 `03-详细设计.md`;不得写 trait / port / DTO schema / flow / state matrix / persistence schema / test case schema;不得进入 `R6.7`、Step 7 或后续 Step。该动作已由 `R6.6` 完成,当前 next_allowed_action 以后文 `R6.6` 当前门禁为准。

---

## R6.6 Step 5 承接与对象发现轴:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.6 Step 5 承接与对象发现轴:再写入`。 |
| 本模块目标 | 将 `R6.5` 的发现轴固化为候选池、对象类别定义、排除 / 后移项和后续对象组顺序。 |
| 当前状态 | completed |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 候选性质 | 本节全部对象名称均为 candidate / not final;最终对象卡片必须由 `R6.7` 起逐组闭口。 |

### 2. 候选对象类别定义

| 候选类别 | primary owner | 当前含义 | 后续闭口 |
|---|---|---|---|
| shared ref / marker / public shell | `contracts` | 跨 crate 可引用的 typed ref、safe marker、view / event / job shell。 | `R6.7` / `R6.8` |
| truth / state / support summary | `domain` | 承载定义、目录、正式版本、正式化状态、关系、外部摘要、影响摘要等领域主语。 | `R6.9` / `R6.10` |
| policy / guard / boundary | `domain` | 承载正式化资格、Definition vs Use、消费边界、一致性保护、关系完整性、外部正文边界、包组合规则。 | `R6.13` / `R6.14` |
| view / read material / projection material | `contracts` 或 `domain` | contracts 承载 public shell;domain 承载派生材料语义和非 truth 边界。 | `R6.7` / `R6.8`;`R6.11` / `R6.12` |
| typed boundary ref | `contracts` | 表达稳定引用边界,禁止 free-form string、URL、route param 或 marketplace id 直接替代。 | `R6.7` / `R6.8` |
| trace / audit / history / lineage | `domain` | 记录 body-free 追溯、变化线索、审计线索和 lineage,不保存 raw log 或正文。 | `R6.11` / `R6.12` |
| application support object | `application` | operation context、idempotency、stored result、degraded / unavailable、job assembly 等编排支持对象。 | `R6.15` / `R6.16` |
| infra runtime support object | `infra` | adapter availability、runtime binding、source binding、fake / durable store 支持对象。 | `R6.17` / `R6.18` |
| entry / runner support object | `api` / `worker` / `jobs` | handler、consumer、publisher loop、job runner 的入口装配对象。 | `R6.19` / `R6.20` |

### 3. capability -> object 候选池

| capability | primary owner | candidate object families, not final | supporting / entry owner |
|---|---|---|---|
| 方法资产定义与目录 | `domain` | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`CatalogScopeRef` | `contracts` shell;`application` command/query support;`infra` store;`api` entry;`worker` event candidate only |
| 正式化与版本 | `domain` | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`GovernanceBasisRef`;`FormalizationEligibilityRule` | `contracts` shell;`application` lifecycle orchestration;`infra` store / resolver;`api` entry;`worker` event candidate only |
| 受控消费 | `domain` | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsumptionContextRef` | `contracts` shell;`application` consumption coordination;`infra` material store / handoff adapter;`api` entry;`worker` handoff / event candidate |
| 追溯与一致性保护 | `domain` | `MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactSummary`;`ConsumptionImpactView`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`ConsumptionImpactSourceRef`;`MethodAssetEvidenceLineage` | `contracts` shell;`application` trace/audit coordination;`infra` material store;`api` entry;`worker`;`jobs` refresh |
| 关系与分发语义 | `domain` | `MethodAssetRelation`;`MethodAssetRelationView`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionReadMaterial`;`DistributionContextRef`;`RelationIntegrityRule` | `contracts` shell;`application` relation/distribution coordination;`infra` store / publisher adapter;`api`;`worker`;`jobs` |
| 外部摘要与引用 | `domain` | `ExternalSourceSummary`;`ExternalSourceSummaryView`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalBasisAcceptanceHistory` | `contracts` shell;`application` intake / reference coordination;`infra` external resolver;`api`;`worker` inbound / event |
| 后台维护与收敛 | `application` | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;`MaintenanceRunRef`;`RefreshScopeRef`;`MaintenanceRunHistory`;`MaterialConvergencePolicy` | `contracts` job shell;`domain` safe truth refs / policies;`infra` runtime / store;`api` progress query;`worker`;`jobs` runner |
| 外围包与方法集组织 | `domain` | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef`;`MethodPackageView`;`MethodSetAssemblyView`;`PackageAssemblyHistory` | `contracts` shell;`application` package/set coordination;`infra` store / peripheral adapter;`api`;`worker`;`jobs` refresh |

### 4. 模块对象归属候选总览

| 模块 | 本轮候选归属 | 不在本模块闭口 |
|---|---|---|
| `contracts` | typed ref、boundary ref、safe marker、public view shell、command/query/event/job shell 的候选。 | DTO body、event payload、job payload、protocol field schema。 |
| `domain` | truth、support summary、policy、guard、boundary、trace、history、lineage、peripheral organization 的候选。 | repository、adapter、runtime config、transport handler、job scheduler。 |
| `application` | orchestration support、operation context、stored result、degraded / unavailable support、maintenance coordination 的候选。 | trait method signature、function flow、transaction detail。 |
| `infra` | adapter availability、runtime binding、source binding、fake/durable support 的候选。 | DB schema、product config、secret、具体 adapter API。 |
| `api` | command/query handler support object 候选。 | HTTP route、auth/gateway owner、transport-specific DTO。 |
| `worker` | inbound consumer / publisher runner support object 候选。 | outbox relay、topic schema、queue retry implementation。 |
| `jobs` | operations job runner / report support object 候选。 | scheduler、lock、retry、evidence report schema。 |

### 5. 排除项与后移项

| 项 | 当前处理 | 后续位置 |
|---|---|---|
| `MethodAssetConsumptionReadMaterial` | 并入 `MethodAssetConsumptionMaterial`,不得恢复为独立 truth。 | 后续只在消费材料对象卡片的禁止事项中保留。 |
| `MethodSetAssemblyRule` | 并入 `PackageCompositionRule` / `MethodSetAssembly` 候选。 | peripheral 对象组再确认。 |
| API / DTO / request / result | 不作为对象卡片正向来源。 | Step 8 |
| repository / port / adapter | 不作为对象本体。 | Step 7 / Step 11 / Step 14 |
| worker / job / event / topic / database table | 不在 Step 6 作为领域对象。 | Step 8~Step 11 / Step 13 / Step 16 |
| `MethodContent`;`MethodContentLifecycle`;`DefinitionSnapshot`;`fingerprint`;`OutboxEvent` | 旧主线禁入。 | `R6.23` / `R6.24` 差异审计。 |
| marketplace listing / install / fulfillment | 本仓不拥有交易履约 truth。 | 仅允许 `MarketplaceContextRef` 等边界引用候选。 |

### 6. 后续对象组展开顺序

| 顺序 | 对象组 | 进入条件 | 输出边界 |
|---:|---|---|---|
| 1 | `contracts` shared refs / markers / public shell | `R6.6` completed | 只思考和写入 shared ref / marker / shell 对象卡片,不写 DTO body。 |
| 2 | `domain` core truth 对象 | `contracts` 候选边界稳定 | 写 definition、catalog、formalization、version、consumption truth 候选卡片。 |
| 3 | `domain` trace / relation / external / peripheral 对象 | core truth 候选稳定 | 写 trace、audit、relation、external summary、package / set 候选卡片。 |
| 4 | `domain` policy / guard / state owner 预筛 | domain object groups 稳定 | 写 policy / guard 卡片和状态主语预筛,不写状态矩阵。 |
| 5 | `application` helper / orchestration support object | domain owner 稳定 | 写 application support 对象卡片,不写 port trait。 |
| 6 | `infra` adapter state 与 runtime support object | application support 边界稳定 | 写 infra support 对象卡片,不写 persistence schema。 |
| 7 | `api` / `worker` / `jobs` entry object | contracts/application/infra 候选稳定 | 写 entry / runner support 对象卡片,不写 transport / topic / scheduler 绑定。 |
| 8 | 字段来源、状态主语、历史差异、回填和自检 | 对象组完成 | 审计字段来源和污染候选,再进入 §6 回填草稿。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 capability -> object 候选池 | 是,candidate / not final。 |
| 是否写入候选对象类别定义 | 是。 |
| 是否写入模块 primary / supporting owner | 是。 |
| 是否写入排除项和后移项 | 是。 |
| 是否写入 `R6.7` 起对象组展开顺序 | 是。 |
| 是否写入最终对象清单 | 否。 |
| 是否写入具体对象字段、函数、状态、工厂或不变量 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.7` 思考或 Step 7 | 否。 |

R6.6 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.7 contracts shared refs / markers / public shell:先思考`;只允许思考 contracts shared refs、typed boundary refs、safe markers、public view / event / job shell 候选和禁止进入 contracts 的 domain truth;不得写具体 schema 字段、DTO body、event payload、job payload、trait / port、flow、state matrix、persistence schema 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.8`、Step 7 或后续 Step。该动作已由 `R6.7` 完成,当前 next_allowed_action 以后文 `R6.7` 当前门禁为准。

---

## R6.7 contracts shared refs / markers / public shell:先思考

### 1. 思考记录

`contracts` 组的目标不是提前写协议 DTO,而是先把 Step 8 以后会反复引用的 shared ref、safe marker 和 public shell 边界收稳。它必须满足三个条件:

| 条件 | 判断 |
|---|---|
| 可跨 crate 引用 | `domain`、`application`、`infra`、`api`、`worker`、`jobs` 都可以依赖 `contracts`,因此跨模块稳定引用应优先落在这里。 |
| 不拥有 truth | `contracts` 不承载方法定义、正式版本、关系、外部摘要、包 / 方法集等业务真相。 |
| 不写协议 body | Step 6 只写 shared object 契约;具体 command / query / event / job DTO body 留给 Step 8。 |

因此,`R6.7` 只回答“哪些类型应当先作为 contracts 候选被写入对象卡片”,不回答字段全集、序列化 schema、payload 和 handler flow。

### 2. typed boundary ref 候选分组

| 分组 | 候选 ref | 进入 contracts 的理由 |
|---|---|---|
| definition / catalog refs | `MethodAssetDefinitionRef`;`CatalogScopeRef` | 定义、目录、读取、查询和后续追溯都需要稳定 typed boundary。 |
| formalization refs | `GovernanceBasisRef` | 正式化依据只能以 safe typed ref / summary 进入,不得携带治理正文。 |
| consumption refs | `ConsumptionContextRef` | Definition vs Use 边界、消费材料和 availability 读取都需要稳定消费语境引用。 |
| trace / impact refs | `TraceSubjectRef`;`ConsumptionImpactSourceRef` | 追溯、impact、audit 和 lineage 需要 body-free subject / source 边界。 |
| relation / distribution refs | `RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef` | 关系和分发语义跨 command/query/event/job 使用,但不表达 marketplace 交易。 |
| external refs | `ExternalSourceRef`;`ArtifactArchiveRef` | 外部来源和 artifact/archive 只能以 ref 进入,不得保存外部正文。 |
| maintenance refs | `MaintenanceRunRef`;`RefreshScopeRef` | 后台维护和收敛需要 run/scope 引用,但不写 scheduler / lock / retry。 |
| peripheral refs | `MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef` | 包、方法集和生态上下文可被读取或分发引用,但不承载交易履约 truth。 |

这些 ref 在 `R6.8` 可以进入对象卡片,但卡片只能写 identity、来源边界、禁止事项和后续承接;不得写 serialization payload 或数据库 key。

### 3. safe marker 候选方向

| marker 方向 | 来源 | 当前判断 |
|---|---|---|
| body-free / no-body marker | 外部摘要、artifact archive、audit / lineage、trace material 的正文禁入边界。 | 适合作为 contracts safe marker 候选,用于 public surface 表达“只含摘要 / 引用”。 |
| freshness / staleness marker | catalog view、consumption material、trace material、maintenance progress 等派生材料。 | 可以进入 contracts marker 候选,但状态迁移留 Step 10。 |
| availability / unavailable marker | consumption availability、external basis acceptance、maintenance unavailable 等读取面。 | 可以作为 public shell 的 safe marker 候选,不得替代 domain state owner。 |
| boundary / redaction marker | Definition vs Use、ExternalBodyBoundary、Distribution boundary、Marketplace context boundary。 | 可以表达 public boundary result,但具体 policy / guard 留在 domain。 |
| lineage / audit marker | evidence lineage、audit trail、history record 的安全公开线索。 | 可作为 body-free public trace shell 的 marker 候选,不得保存 raw log。 |

`R6.8` 若写 marker,必须把 marker 写成“安全公开语义”而不是 domain policy 或状态机。

### 4. public shell 候选方向

| shell 方向 | 候选对象族 | contracts 中只能承载什么 |
|---|---|---|
| view shell | `MethodAssetCatalogView`;`MethodAssetAvailabilityView`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetRelationView`;`ExternalSourceSummaryView`;`MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView` | public readable shell、ref、safe marker、summary boundary;不得拥有派生逻辑或刷新语义。 |
| material shell | `MethodAssetConsumptionMaterial`;`MethodAssetTraceMaterial`;`DistributionReadMaterial` | 下游可读取的 body-free material shell;不得成为第二 truth。 |
| summary shell | `FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` | 摘要可公开形态和正文禁入边界;domain 仍拥有 summary 语义。 |
| event / job shell | event candidate、job input/result/progress/report shell | 只保留 public shell 候选;payload schema 后移 Step 8,job flow 后移 Step 9。 |
| command / query result shell | request / response / result wrapper 候选 | 仅保留 shell 类别;字段和值域后移 Step 8。 |

public shell 是跨层引用壳,不是对象真相。若 shell 需要 domain 字段或 application 编排字段才能成立,必须在 `R6.8` 标注后移,不能私补。

### 5. 禁止进入 contracts 的内容

| 禁止内容 | 原因 | 正确位置 |
|---|---|---|
| `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly` 的 truth body | contracts 不拥有业务 truth。 | `domain` 对象组 |
| policy / guard 算法 | contracts 只能提供 marker 或 shell,不能执行领域判断。 | `domain` policy / guard |
| application operation context、stored result、idempotency decision | 这些是编排支持对象。 | `application` 对象组 |
| repository key、adapter availability implementation、runtime binding | 这些是实现和外部依赖状态。 | `infra` 对象组 |
| HTTP route、topic、scheduler、retry、lock | entry / runner / runtime 细节。 | `api` / `worker` / `jobs` 后续 Step |
| DTO body、event payload、job payload | 协议 schema 不在 Step 6 本模块闭口。 | Step 8 |

### 6. R6.8 写入边界

`R6.8` 可以写入:

- typed boundary ref 对象卡片。
- safe marker 对象卡片。
- public view / material / summary shell 对象卡片。
- event / job / command / query shell 的对象级边界。
- contracts 禁止事项和后续 Step 承接。

`R6.8` 不得写入:

- 具体 DTO body、event payload、job payload。
- domain truth 字段全集、policy 算法或状态迁移。
- trait / port / adapter 方法。
- function flow、persistence schema、config key、test case schema。
- 正式 `03-详细设计.md`。
- `R6.9`、Step 7 或后续 Step。

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否思考 typed boundary ref 候选分组 | 是。 |
| 是否思考 safe marker 候选方向 | 是。 |
| 是否思考 public shell 候选方向 | 是。 |
| 是否列出禁止进入 contracts 的内容 | 是。 |
| 是否写入具体 schema 字段、DTO body、event payload 或 job payload | 否。 |
| 是否写入 domain truth 字段、policy 算法或状态迁移 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.8` 写入或 Step 7 | 否。 |

R6.7 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.8 contracts shared refs / markers / public shell:再写入`;只允许写入 typed boundary ref、safe marker、public view / material / summary shell、event / job / command / query shell 的对象卡片和 contracts 禁止事项;不得写具体 DTO body、event payload、job payload、domain truth 字段全集、policy 算法、状态迁移、trait / port、flow、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.9`、Step 7 或后续 Step。该动作已由 `R6.8` 完成,当前 next_allowed_action 以后文 `R6.8` 当前门禁为准。

---

## R6.8 contracts shared refs / markers / public shell:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.8 contracts shared refs / markers / public shell:再写入`。 |
| 本模块目标 | 固化 contracts 侧 typed boundary ref、safe marker、public shell 的对象级契约边界。 |
| 当前状态 | completed |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 写入深度 | 对象族卡片,不是 Step 8 DTO schema;不固定序列化字段名、payload 或 transport body。 |

### 2. contracts 对象族总览

| 对象族 | contracts 责任 | 主要候选 | 不承载 |
|---|---|---|---|
| typed boundary ref | 给跨模块引用提供 opaque typed identity。 | definition、catalog、basis、consumption、trace、relation、external、maintenance、peripheral refs。 | URL、route param、DB key、free-form string。 |
| safe marker | 给 public surface 提供安全状态 / 边界 / 正文禁入标记。 | no-body、freshness、availability、boundary、lineage marker。 | domain policy、状态迁移、adapter health implementation。 |
| public shell | 给 Step 8 protocol 提供 body-free wrapper 边界。 | view/material/summary shell、event/job/command/query shell。 | DTO body、payload schema、handler flow、truth body。 |

### 3. 对象族卡片: `MethodLibraryTypedBoundaryRef`

```rust
pub struct MethodLibraryTypedBoundaryRef;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `contracts` |
| 对象类型 | shared typed boundary ref family |
| 结构责任 | 承载跨 crate 稳定引用身份,让 domain / application / infra / entry 可以在不共享 truth body 的前提下传递对象锚点。 |
| 来源回指 | 正式 `02-概要设计.md` §6 Reference / Typed boundary;Step 5 `contracts` public refs owner。 |
| 进入 Step 8 方式 | 作为 command/query/event/job DTO 可引用的 typed ref 类型,但 DTO 字段与 payload 后移 Step 8。 |

| 成员能力 | 作用 |
|---|---|
| `kind()` | 返回 ref 所属的 typed kind,供协议和日志安全表达。 |
| `as_public_ref()` | 转成 public surface 可使用的 opaque ref。 |
| `assert_kind(expected_kind)` | 校验调用方没有把不同业务 ref 混用。 |

| 工厂边界 | 作用 |
|---|---|
| `from_verified_source(...)` | 只允许从已验证来源生成 typed ref。 |
| `from_domain_identity(...)` | 允许 domain truth 创建后暴露 public ref,但不暴露 truth 字段。 |
| `from_external_summary(...)` | 允许外部摘要产生 external / artifact ref,但不保存正文。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| opaque | 实现侧不得解析字符串结构来推导业务含义。 |
| typed | 不同 ref kind 不得互换。 |
| body-free | ref 不携带外部正文、方法正文、证据正文或 payload。 |
| not persistence schema | 不固定 DB primary key、索引或 durable storage 格式。 |

### 4. typed boundary ref 候选表

| ref | capability | 来源边界 | R6.8 处理 |
|---|---|---|---|
| `MethodAssetDefinitionRef` | 方法资产定义与目录 | definition truth 创建后暴露的稳定 ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `CatalogScopeRef` | 方法资产定义与目录 | catalog read scope / applicability scope。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `GovernanceBasisRef` | 正式化与版本 | governance / basis 的 body-free typed ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `ConsumptionContextRef` | 受控消费 | 下游消费语境的 typed boundary。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `TraceSubjectRef` | 追溯与一致性保护 | trace / audit subject 的 safe ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `ConsumptionImpactSourceRef` | 追溯与一致性保护 | impact 来源的 body-free ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `RelatedMethodAssetRef` | 关系与分发语义 | 关系另一端的方法资产 ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `MethodAssetDistributionRef` | 关系与分发语义 | 分发语义边界 ref,非 marketplace 交易。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `DistributionContextRef` | 关系与分发语义 | 分发上下文 ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `ExternalSourceRef` | 外部摘要与引用 | 外部来源 ref,不含外部正文。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `ArtifactArchiveRef` | 外部摘要与引用 | artifact / archive 的 safe ref,不含包体。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `MaintenanceRunRef` | 后台维护与收敛 | maintenance run identity。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `RefreshScopeRef` | 后台维护与收敛 | refresh scope identity。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `MethodPackageRef` | 外围包与方法集组织 | peripheral package ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `MethodSetAssemblyRef` | 外围包与方法集组织 | method set assembly ref。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |
| `MarketplaceContextRef` | 外围包与方法集组织 | marketplace context boundary ref,非交易履约。 | 进入 `MethodLibraryTypedBoundaryRef` 家族。 |

### 5. 对象族卡片: `MethodLibrarySafeMarker`

```rust
pub struct MethodLibrarySafeMarker;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `contracts` |
| 对象类型 | public safe marker family |
| 结构责任 | 表达 public surface 上可安全公开的 no-body、freshness、availability、boundary、lineage 等语义。 |
| 来源回指 | 正式 `02-概要设计.md` 的 body-free、read material 非 truth、external body boundary 和 trace/audit 边界。 |
| 进入 Step 8 方式 | 作为 DTO shell 的安全标记候选;具体字段和值域后移 Step 8 / Step 10。 |

| marker family | 语义 | 禁止替代 |
|---|---|---|
| `NoBodyMarker` | 表示只含摘要 / 引用,不含正文。 | 外部正文、artifact body、raw log。 |
| `FreshnessMarker` | 表示 view/material 的 fresh / stale / unavailable 线索。 | 状态迁移矩阵、projection implementation。 |
| `AvailabilityMarker` | 表示消费或读取可用性线索。 | domain state owner。 |
| `BoundaryMarker` | 表示 Definition vs Use、external body、distribution 或 marketplace boundary。 | policy / guard 算法。 |
| `LineageMarker` | 表示 audit / history / lineage 的安全公开线索。 | raw audit log、evidence body。 |

| 成员能力 | 作用 |
|---|---|
| `marker_kind()` | 返回 marker family。 |
| `is_public_safe()` | 声明 marker 可进入 public surface。 |
| `assert_no_body()` | 校验 marker 未携带正文或 payload。 |

| 工厂边界 | 作用 |
|---|---|
| `no_body(source_ref)` | 由外部摘要、artifact ref、trace/audit source ref 生成正文禁入 marker。 |
| `freshness(source_ref, freshness_kind)` | 由派生材料来源生成 freshness marker。 |
| `boundary(boundary_ref, boundary_kind)` | 由 domain guard / boundary result 复制安全 marker,不执行 guard。 |

### 6. 对象族卡片: `MethodLibraryPublicShell`

```rust
pub struct MethodLibraryPublicShell;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `contracts` |
| 对象类型 | public view / material / summary / protocol shell family |
| 结构责任 | 为 Step 8 的 command / query / event / job protocol 提供可引用 shell 边界,但不定义具体 payload。 |
| 来源回指 | 正式 `02-概要设计.md` §6 Projection / View / Read material、Support summary、Operations / Peripheral;Step 5 `contracts` public surface owner。 |
| 与 domain 关系 | shell 只表达 public 可见壳;domain 仍拥有 truth、summary、material 语义和不变量。 |

| shell family | 候选 | R6.8 责任 |
|---|---|---|
| view shell | catalog、availability、trace、impact、relation、external summary、maintenance progress、package、method set view shell。 | 固定 public readable shell 边界。 |
| material shell | consumption、trace、distribution read material shell。 | 固定下游可读取的 body-free material shell 边界。 |
| summary shell | formalization basis、external source、consumption impact summary shell。 | 固定摘要公开边界和 no-body 约束。 |
| event shell | event candidate shell。 | 只固定 shell 是 candidate,不写 payload。 |
| job shell | job input / result / progress / report shell。 | 只固定 operations public shell,不写 job flow。 |
| command / query shell | request / response / result shell。 | 只固定 wrapper 边界,不写 DTO field schema。 |

| 成员能力 | 作用 |
|---|---|
| `shell_kind()` | 返回 shell family。 |
| `public_refs()` | 返回 shell 可公开携带的 typed refs。 |
| `safe_markers()` | 返回 shell 可公开携带的 safe markers。 |
| `assert_body_free()` | 校验 shell 不包含外部正文、artifact body、raw log 或 report body。 |

| 工厂边界 | 作用 |
|---|---|
| `from_domain_view_ref(...)` | 由 domain / application 提供的 view ref 生成 public shell。 |
| `from_summary_ref(...)` | 由 support summary ref 生成 public summary shell。 |
| `from_job_boundary(...)` | 由 application/job 边界生成 job shell,不执行 job。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| shell_not_truth | shell 不拥有或复制 truth body。 |
| shell_not_flow | shell 不包含 handler、consumer 或 job flow。 |
| shell_not_payload_schema | shell 不固定 Step 8 DTO / event / job payload 字段。 |
| shell_body_free | shell 不保存外部正文、artifact/archive 包体、raw audit log、report body。 |

### 7. contracts 禁止事项

| 禁止事项 | 原因 | 正确承接 |
|---|---|---|
| 在 `contracts` 写 domain truth 字段全集 | contracts 不拥有业务真相。 | `R6.9`~`R6.14` domain 对象组。 |
| 在 `contracts` 写 policy / guard 算法 | contracts 只能表达 public marker 或 shell。 | domain policy / guard 对象组。 |
| 在 `contracts` 写 command / query DTO body | Step 6 只写对象契约。 | Step 8 protocol。 |
| 在 `contracts` 写 event / job payload | payload schema 后移。 | Step 8 protocol;Step 9 job flow。 |
| 在 `contracts` 写 repository key / DB index | 这是 persistence 语义。 | Step 11。 |
| 用 string / URL / route param 替代 typed ref | 破坏可落码边界和跨仓引用安全。 | `MethodLibraryTypedBoundaryRef` 家族。 |
| 用 marker 替代 domain state owner | marker 只是 public safe surface。 | Step 10 state matrix。 |

### 8. 后续 Step 承接

| 后续 Step | 必须承接的 contracts 内容 | 暂停条件 |
|---|---|---|
| Step 7 | port / adapter 参数优先使用 typed refs 和 public shell ref。 | port 需要 domain truth body 或 raw string 才能表达。 |
| Step 8 | DTO / event / job schema 只能引用本节 shared ref / marker / shell,不得私造 public type。 | public schema 引用未闭口类型。 |
| Step 9 | flow 只能复制 safe marker / shell,不得在 flow 中合成 marker。 | flow 需要现场拼 marker 或 shell。 |
| Step 10 | 状态 owner 不能被 marker 替代;marker 只回指 state owner。 | 状态迁移只能从 public marker 推断。 |
| Step 11 | persistence key 不得反向改变 typed ref 语义。 | durable key 与 typed ref 关系不清。 |
| Step 12 | error / degraded / unavailable public response 必须使用 safe marker。 | error 只能返回 raw message。 |
| Step 16 | contract fixture 覆盖 typed ref、marker、shell body-free 规则。 | 测试无法证明 no-body / typed ref 边界。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 typed boundary ref 对象族卡片 | 是。 |
| 是否写入 safe marker 对象族卡片 | 是。 |
| 是否写入 public shell 对象族卡片 | 是。 |
| 是否写入 contracts 禁止事项 | 是。 |
| 是否写入具体 DTO body、event payload 或 job payload | 否。 |
| 是否写入 domain truth 字段全集、policy 算法或状态迁移 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.9` 思考或 Step 7 | 否。 |

R6.8 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.9 domain core truth 对象:先思考`;只允许思考 definition、catalog、formalization、version、consumption truth / support summary 对象草案和字段来源问题;不得写 flow、repository、adapter、DTO schema、event payload、job payload、state matrix、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.10`、Step 7 或后续 Step。该动作已由 `R6.9` 完成,当前 next_allowed_action 以后文 `R6.9` 当前门禁为准。

---

## R6.9 domain core truth 对象:先思考

### 1. 思考记录

`domain` core truth 组的目标是先闭合方法资产成立、目录语义、正式化、正式版本和受控消费材料的对象主语。它不能把所有 domain 对象一次性写完,也不能把关系、追溯、外部摘要、外围包和维护任务混入第一批。

本模块只思考以下对象草案:

| 对象草案 | 当前归类 | 进入本批原因 |
|---|---|---|
| `MethodAssetDefinition` | core truth | 方法资产定义 truth 和共同 subject anchor。 |
| `MethodAssetCatalogEntry` | core truth | 目录语义和适用语境 truth,与 catalog view 分离。 |
| `FormalizationState` | state owner / state vocabulary | 正式化状态主语,完整迁移后移 Step 10。 |
| `FormalMethodAssetVersion` | core truth / version state | 正式版本边界和版本语义。 |
| `FormalizationBasisSummary` | support summary | 正式化依据摘要,不保存治理执行或外部正文。 |
| `MethodAssetConsumptionMaterial` | read material / controlled material | 受控消费材料主语,防止下游复制定义或自建私有 truth。 |

本批不写 `MethodAssetRelation`、`ExternalSourceSummary`、`ConsumptionImpactSummary`、trace/audit/history、policy/guard、package/set、maintenance task。它们后续分别进入 `R6.11`~`R6.14`。

### 2. 对象依赖顺序

| 顺序 | 对象 | 依赖前提 | 后续供给 |
|---:|---|---|---|
| 1 | `MethodAssetDefinition` | 无前置 domain truth;只需要 typed ref 和输入边界。 | catalog、formalization、version、consumption、trace、relation 的共同锚点。 |
| 2 | `MethodAssetCatalogEntry` | `MethodAssetDefinitionRef`;`CatalogScopeRef`。 | catalog view、formalization context、query read surface。 |
| 3 | `FormalizationBasisSummary` | definition anchor;external / governance basis typed ref。 | formalization state 判断和 formal version 建立。 |
| 4 | `FormalizationState` | definition / catalog anchor;basis summary refs。 | formal version 成立的状态来源。 |
| 5 | `FormalMethodAssetVersion` | definition / catalog anchor;formalization state。 | consumption material、trace、relation、package/set 版本语境。 |
| 6 | `MethodAssetConsumptionMaterial` | formal version;definition ref;consumption context;downstream boundary。 | availability view、distribution read material、trace material、downstream handoff。 |

该顺序只用于对象契约讨论,不是 Step 9 function flow。若后续 flow 需要不同调用顺序,必须回指这些对象来源,不能反向修改对象 owner。

### 3. 字段来源风险预判

| 对象 | 高风险字段来源 | 需要在 R6.10 写清的边界 |
|---|---|---|
| `MethodAssetDefinition` | definition identity、definition summary、source summary refs。 | summary 只能来自当前 00/01/02 允许的 body-free 输入;不得保存 `MethodContent` 或外部正文。 |
| `MethodAssetCatalogEntry` | catalog scope、classification、applicability context。 | catalog entry 是 truth;catalog view 是派生读取,不得混写。 |
| `FormalizationBasisSummary` | external summary ref、governance basis ref、basis kind。 | 只能承接 safe ref / summary,不得复制治理执行、标准全文或 artifact 正文。 |
| `FormalizationState` | state kind、state reason、basis refs、current formal version ref。 | Step 6 只定义 owner 和词表候选;状态迁移后移 Step 10。 |
| `FormalMethodAssetVersion` | version boundary summary、basis refs、supersedes ref。 | 不使用 publish、fingerprint、snapshot 或 hash drift 作为版本语义。 |
| `MethodAssetConsumptionMaterial` | formal version ref、definition ref、consumption context、boundary ref、consumption summary。 | 不保存下游运行 truth;不恢复独立 `MethodAssetConsumptionReadMaterial`。 |

### 4. R6.10 写入分组

`R6.10` 可以写入两个小批次,但仍属于同一模块:

| 小批次 | 对象 | 写入重点 |
|---|---|---|
| core identity batch | `MethodAssetDefinition`;`MethodAssetCatalogEntry` | 定义和目录 truth、subject anchor、字段来源、禁止事项。 |
| formalization / consumption batch | `FormalizationBasisSummary`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial` | 正式化依据、状态 owner、正式版本、受控消费材料边界。 |

若写入超过单批 300 行,必须继续拆 patch,但不得为了压缩而省略对象卡片必需项。

### 5. 明确后移项

| 后移项 | 原因 | 目标模块 / Step |
|---|---|---|
| `MethodAssetRelation` | support truth,属于关系与分发语义。 | `R6.11` / `R6.12` |
| `ExternalSourceSummary`;`ConsumptionImpactSummary` | external / impact summary 与 trace/external 组关系更强。 | `R6.11` / `R6.12` |
| `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary` | policy / guard / boundary 对象。 | `R6.13` / `R6.14` |
| `MethodAssetAvailabilityView` | read view / availability shell,不是 core truth。 | domain support object / Step 10 state owner 审计 |
| repository / port / adapter | 外部能力边界。 | Step 7 / Step 11 / Step 14 |
| command / query / event / job schema | protocol body。 | Step 8 |
| 状态迁移矩阵 | Formalization / availability 等完整状态转换。 | Step 10 |

### 6. R6.10 写入边界

`R6.10` 可以写入:

- 六个 domain core truth / support summary 对象卡片。
- 每个对象的身份、责任、字段骨架、字段来源、成员能力、工厂边界、不变量 / 禁止事项。
- 与 contracts shared refs / markers / shell 的回指。
- 后续 Step 7~16 承接提示。

`R6.10` 不得写入:

- function flow。
- repository / adapter / persistence schema。
- DTO schema、event payload、job payload。
- 完整状态迁移矩阵。
- config key、test case schema。
- 正式 `03-详细设计.md`。
- `R6.11`、Step 7 或后续 Step。

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否思考 definition / catalog 对象草案 | 是。 |
| 是否思考 formalization / version 对象草案 | 是。 |
| 是否思考 consumption material 对象草案 | 是。 |
| 是否识别字段来源风险 | 是。 |
| 是否写入对象卡片正文 | 否。 |
| 是否写入 flow、repository、DTO、state matrix 或 persistence schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.10` 写入或 Step 7 | 否。 |

R6.9 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.10 domain core truth 对象:再写入`;只允许写入 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalizationBasisSummary`、`FormalizationState`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial` 对象卡片;不得写 function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.11`、Step 7 或后续 Step。该动作已由 `R6.10` 完成,当前 next_allowed_action 以后文 `R6.10` 当前门禁为准。

---

## R6.10 domain core truth 对象:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.10 domain core truth 对象:再写入`。 |
| 本模块目标 | 固化 definition、catalog、formalization、version、consumption core truth / support summary 对象卡片。 |
| 当前状态 | completed |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 写入边界 | 只写 Step 6 对象契约;不写 function flow、repository、DTO、event/job payload、persistence 或状态迁移矩阵。 |

### 2. 对象卡片: `MethodAssetDefinition`

```rust
pub struct MethodAssetDefinition;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 方法资产定义与目录 |
| 对象类型 | core truth / aggregate |
| 结构责任 | 承载方法资产定义 truth、稳定身份和定义边界,为目录、正式化、消费、追溯和关系提供共同 subject anchor。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_core_truth.md` A1;Step 5 `domain` truth owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `definition_ref` | `MethodAssetDefinitionRef` | contracts typed ref;由 domain 创建后暴露为 opaque ref。 |
| `definition_kind` | `MethodAssetDefinitionKind` | 当前 00/01/02 的方法资产分类输入;不得恢复旧 P0 七类主轴。 |
| `identity_key` | `MethodAssetIdentityKey` | 定义创建请求和 identity 规则裁决后的稳定身份。 |
| `definition_summary` | `MethodAssetDefinitionSummary` | body-free 定义摘要;不得保存方法正文、外部正文或 artifact body。 |
| `source_summary_refs` | `ExternalSourceSummaryRefSet` | 已承接的外部安全摘要引用;不拥有外部 truth。 |
| `catalog_entry_refs` | `MethodAssetCatalogEntryRefSet` | 已关联目录条目的 typed refs;目录语义仍由 catalog entry 拥有。 |

| 成员能力 | 作用 |
|---|---|
| `assert_same_identity(identity_key)` | 校验输入没有创建重复定义。 |
| `link_catalog_entry(catalog_entry_ref)` | 关联目录条目,不复制目录 view。 |
| `accept_source_summary(source_summary_ref)` | 记录可追溯外部摘要引用。 |
| `assert_body_free()` | 校验定义摘要不含外部正文或 artifact body。 |

| 工厂边界 | 作用 |
|---|---|
| `create(definition_ref, identity_key, definition_summary)` | 创建方法资产定义 truth。 |
| `from_existing_definition(definition_ref, identity_key)` | 恢复已存在定义锚点,不重建 truth。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| definition_is_truth | definition 是定义 truth owner,view/material 不能反写它。 |
| no_method_content | 不恢复旧 `MethodContent` 总对象或正文生命周期。 |
| no_external_body | 不保存标准全文、治理执行正文、artifact body。 |
| no_formalization_decision | 不裁定正式版本或下游可消费性。 |

### 3. 对象卡片: `MethodAssetCatalogEntry`

```rust
pub struct MethodAssetCatalogEntry;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 方法资产定义与目录 |
| 对象类型 | core truth / catalog entity |
| 结构责任 | 承载方法资产的目录语义、适用范围和可发现分类,与 `MethodAssetCatalogView` 派生读取分离。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_core_truth.md` A2;Step 5 八组件横向映射。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `catalog_entry_ref` | `MethodAssetCatalogEntryRef` | domain 创建的目录条目稳定引用。 |
| `definition_ref` | `MethodAssetDefinitionRef` | 已存在 definition anchor。 |
| `catalog_scope_ref` | `CatalogScopeRef` | contracts typed boundary ref;来自目录范围 / 适用语境输入。 |
| `catalog_classification` | `MethodAssetCatalogClassification` | 当前 02 允许的目录识别和分类口径。 |
| `applicability_summary` | `MethodAssetApplicabilitySummary` | body-free 适用语境摘要。 |
| `catalog_status` | `MethodAssetCatalogEntryStatus` | 目录条目概要状态;完整迁移后移 Step 10。 |

| 成员能力 | 作用 |
|---|---|
| `assert_for_definition(definition_ref)` | 校验目录条目仍绑定原定义。 |
| `covers_scope(catalog_scope_ref)` | 判断目录条目是否覆盖指定目录范围。 |
| `update_classification(classification)` | 更新分类语义,不生成 catalog view。 |
| `mark_deprecated(reason_ref)` | 标记目录条目弃用线索,不删除 definition truth。 |

| 工厂边界 | 作用 |
|---|---|
| `create_for_definition(definition_ref, catalog_scope_ref)` | 为定义创建目录条目。 |
| `from_catalog_reclassification(catalog_entry_ref, classification)` | 基于显式重分类形成新目录线索。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| catalog_entry_is_truth | catalog entry 是目录 truth;catalog view 只是派生读取。 |
| no_search_index | 不写搜索索引、缓存结构或 query material 实现。 |
| no_formalization | 不裁定 formal version。 |
| no_marketplace_listing | 不表达 marketplace listing、交易、安装或履约。 |

### 4. 对象卡片: `FormalizationBasisSummary`

```rust
pub struct FormalizationBasisSummary;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 正式化与版本 |
| 对象类型 | support summary |
| 结构责任 | 承载可用于正式化判断的依据摘要,只保存 safe ref / summary,不执行治理流程。 |
| 来源回指 | `02-概要设计.md` §6;`02_hld_step_06_key_objects_core_truth.md` A6;contracts `GovernanceBasisRef` / external refs。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `basis_summary_ref` | `FormalizationBasisSummaryRef` | domain 创建的依据摘要稳定引用。 |
| `definition_ref` | `MethodAssetDefinitionRef` | 依据适用的定义锚点。 |
| `catalog_entry_ref` | `Option<MethodAssetCatalogEntryRef>` | 依据适用的目录语境,可为空。 |
| `basis_kind` | `FormalizationBasisKind` | 当前 00/01/02 允许的依据类型。 |
| `external_summary_ref` | `Option<ExternalSourceSummaryRef>` | 外部摘要引用;不保存外部正文。 |
| `governance_basis_ref` | `Option<GovernanceBasisRef>` | 治理依据 typed ref;不保存治理执行正文。 |
| `basis_safe_summary` | `FormalizationBasisSafeSummary` | 可公开 / 可追溯的安全摘要。 |

| 成员能力 | 作用 |
|---|---|
| `assert_applicable_to_definition(definition_ref)` | 判断依据是否适用于指定定义。 |
| `assert_body_free()` | 校验不包含治理正文、标准全文或 artifact body。 |
| `supersede_with(next_basis_summary_ref)` | 显式替代旧依据摘要。 |

| 工厂边界 | 作用 |
|---|---|
| `from_external_summary(definition_ref, external_summary_ref, basis_kind)` | 从外部安全摘要形成正式化依据。 |
| `from_governance_basis(definition_ref, governance_basis_ref)` | 从治理依据引用形成正式化依据摘要。 |
| `from_basis_reassessment(previous_ref, reassessment_summary)` | 从显式复核形成后续依据摘要。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| summary_not_truth_copy | 不复制外部 truth 或治理执行 truth。 |
| no_direct_formal_version | 不直接建立正式版本,必须经 `FormalizationState` / `FormalMethodAssetVersion`。 |
| no_policy_algorithm | 不执行 eligibility rule。 |
| no_evidence_body | 不保存证据正文。 |

### 5. 对象卡片: `FormalizationState`

```rust
pub struct FormalizationState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 正式化与版本 |
| 对象类型 | state owner / state vocabulary |
| 结构责任 | 承载方法资产定义进入正式使用语境前后的状态主语,为正式版本建立提供状态来源。 |
| 来源回指 | `02-概要设计.md` §6;`02_hld_step_06_key_objects_core_truth.md` A4;Step 5 `domain` state owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `formalization_state_ref` | `FormalizationStateRef` | domain 创建的状态 owner 引用。 |
| `definition_ref` | `MethodAssetDefinitionRef` | 状态所属定义锚点。 |
| `catalog_entry_ref` | `MethodAssetCatalogEntryRef` | 状态判断所处目录 / 适用语境。 |
| `state_kind` | `FormalizationStateKind` | 概要状态词表;完整迁移留 Step 10。 |
| `state_reason_summary` | `FormalizationStateReasonSummary` | 进入当前状态的安全原因摘要。 |
| `basis_summary_refs` | `FormalizationBasisSummaryRefSet` | 可用于正式化判断的依据摘要引用。 |
| `current_formal_version_ref` | `Option<FormalMethodAssetVersionRef>` | 已正式化时的当前版本引用。 |

| 成员能力 | 作用 |
|---|---|
| `is_formalized()` | 判断当前状态是否已绑定正式版本。 |
| `mark_eligible(basis_summary_refs)` | 基于依据摘要进入可正式化状态线索。 |
| `mark_formalized(formal_version_ref)` | 绑定正式版本并进入已正式化状态。 |
| `block(reason_summary)` | 记录阻断原因摘要。 |

| 工厂边界 | 作用 |
|---|---|
| `pending_for_definition(definition_ref, catalog_entry_ref)` | 为已建立定义和目录语境创建待正式化状态。 |
| `from_basis_summary(definition_ref, basis_summary_refs)` | 基于依据摘要形成可判断状态线索。 |
| `from_explicit_formalization(definition_ref, formal_version_ref)` | 从显式正式化结果形成已正式化状态。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| state_owner_only | Step 6 只固定状态 owner 和词表候选,不写完整迁移矩阵。 |
| no_governance_workflow | 不保存治理审批 / 执行过程。 |
| no_publish_lifecycle | 不恢复 draft/review/publish 生命周期。 |
| no_query_trigger | 读取不能触发正式化状态变化。 |

### 6. 对象卡片: `FormalMethodAssetVersion`

```rust
pub struct FormalMethodAssetVersion;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 正式化与版本 |
| 对象类型 | core truth / formal version |
| 结构责任 | 承载方法资产正式版本边界、版本语义和显式替代关系,为消费材料和追溯提供稳定版本锚点。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_core_truth.md` A3。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `formal_version_ref` | `FormalMethodAssetVersionRef` | domain 创建的正式版本稳定 ref。 |
| `definition_ref` | `MethodAssetDefinitionRef` | 版本所属定义锚点。 |
| `catalog_entry_ref` | `MethodAssetCatalogEntryRef` | 版本成立时的目录 / 适用语境线索。 |
| `formalization_state_ref` | `FormalizationStateRef` | 使版本成立的状态 owner。 |
| `version_boundary_summary` | `FormalVersionBoundarySummary` | 版本边界安全摘要。 |
| `basis_summary_refs` | `FormalizationBasisSummaryRefSet` | 支撑版本成立的依据摘要引用。 |
| `supersedes_version_ref` | `Option<FormalMethodAssetVersionRef>` | 被显式替代的上一正式版本。 |

| 成员能力 | 作用 |
|---|---|
| `assert_definition_matches(definition_ref)` | 校验版本仍绑定同一方法资产定义。 |
| `assert_formalized_by(formalization_state_ref)` | 校验版本有正式化状态来源。 |
| `supersede_with(next_version_ref)` | 显式替代当前版本。 |
| `is_current_for(state_ref)` | 判断是否是指定状态下的当前正式版本。 |

| 工厂边界 | 作用 |
|---|---|
| `from_formalization_state(definition_ref, formalization_state_ref, boundary_summary)` | 从已闭合正式化状态建立正式版本。 |
| `from_explicit_version_change(previous_version_ref, change_summary)` | 基于显式版本语义变化形成后续版本。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| formal_version_not_publish | 不以 publish 替代正式化。 |
| no_fingerprint_semantics | 不用 fingerprint/hash drift 作为版本语义。 |
| no_snapshot_body | 不保存 snapshot / export body。 |
| explicit_supersession | 版本替代必须显式表达,不得隐式覆盖。 |

### 7. 对象卡片: `MethodAssetConsumptionMaterial`

```rust
pub struct MethodAssetConsumptionMaterial;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 受控消费 |
| 对象类型 | controlled read material |
| 结构责任 | 承载正式版本在指定消费语境下的只读材料边界,保护 Definition vs Use。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_views_materials.md` C2;Step 5 受控消费 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `consumption_material_ref` | `MethodAssetConsumptionMaterialRef` | domain 创建的消费材料稳定引用。 |
| `formal_version_ref` | `FormalMethodAssetVersionRef` | 可消费的正式版本锚点。 |
| `definition_ref` | `MethodAssetDefinitionRef` | 来源定义锚点。 |
| `consumption_context_ref` | `ConsumptionContextRef` | contracts typed boundary ref;消费语境。 |
| `boundary_ref` | `DownstreamConsumptionBoundaryRef` | 受控消费边界引用。 |
| `consumption_summary` | `MethodAssetConsumptionSummary` | 面向下游的只读正式语义摘要。 |
| `source_cursor_ref` | `MethodAssetConsumptionMaterialCursorRef` | 派生来源位置和刷新依据。 |

| 成员能力 | 作用 |
|---|---|
| `assert_from_formal_version(formal_version_ref)` | 校验材料锚定正式版本。 |
| `assert_context(consumption_context_ref)` | 校验材料适用消费语境。 |
| `assert_boundary(boundary_ref)` | 校验材料未越过 Definition vs Use 边界。 |
| `mark_stale(reason_ref)` | 标记消费材料待刷新,不修改正式版本。 |

| 工厂边界 | 作用 |
|---|---|
| `from_formal_version(formal_version_ref, boundary_ref, consumption_context_ref)` | 从正式版本和消费边界派生消费材料。 |
| `blocked_by_boundary(formal_version_ref, boundary_ref)` | 表达正式版本存在但当前语境不可消费。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_downstream_truth | 不保存下游运行事实、执行结果或私有模型。 |
| no_definition_copy | 不复制完整 definition truth 或外部正文。 |
| read_material_not_truth | material 是受控读取材料,不是第二 truth。 |
| no_parallel_read_material | `MethodAssetConsumptionReadMaterial` 并入本对象,不得恢复独立 truth。 |

### 8. 后续 Step 承接

| 后续 Step | 必须承接的 core truth 内容 | 暂停条件 |
|---|---|---|
| Step 7 | repository / resolver / material store ports 必须回指这些对象或 typed ref。 | port 需要未定义对象或 raw string。 |
| Step 8 | formalization / consumption DTO 只能引用对象、ref、summary 或 shell。 | DTO 私造字段来源或复制 truth body。 |
| Step 9 | flow 调用必须按对象工厂 / 成员能力表达。 | flow 现场构造未定义字段。 |
| Step 10 | `FormalizationState` 和 consumption availability 状态迁移必须回指对象 owner。 | 状态迁移脱离 owner。 |
| Step 11 | persistence schema 不得反向改变对象身份和版本语义。 | DB key 替代 typed ref。 |
| Step 12 | 错误 / degraded branch 不能泄露正文。 | raw reason / external body 出现在 public error。 |
| Step 16 | 测试必须覆盖 body-free、no old lifecycle、no downstream truth。 | 无法测试核心不变量。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入六个 core truth / support summary 对象卡片 | 是。 |
| 是否写入字段骨架和字段来源 | 是。 |
| 是否写入成员能力、工厂边界、不变量 / 禁止事项 | 是。 |
| 是否写入 function flow、repository、adapter 或 persistence schema | 否。 |
| 是否写入 DTO schema、event payload 或 job payload | 否。 |
| 是否写入完整状态迁移矩阵 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.11` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.11 domain trace / relation / external / peripheral 对象:先思考`;只允许思考 trace、lineage、relation、external summary、package / method set 对象草案和旧 snapshot / outbox 禁入问题;不得写对象卡片正文、function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.12`、Step 7 或后续 Step。

---

## R6.11 domain trace / relation / external / peripheral 对象:先思考

### 1. 思考记录

本模块承接 `R6.10` 之后的 domain support 对象组。它不是继续扩写 core truth,也不是把 maintenance / job / worker 一并写入。当前只筛选 trace、impact、audit、lineage、relation、external summary、package 和 method set 的对象草案,为 `R6.12` 写对象卡片定边界。

本模块必须同时守住三条红线:

| 红线 | 含义 |
|---|---|
| 不恢复旧 snapshot / outbox 主线 | 旧 snapshot、fingerprint、publish、outbox relay 不作为本仓当前对象主轴。 |
| external body 禁入 | external summary、artifact ref、governance basis、evidence lineage 都只能保存 safe ref / summary / marker。 |
| peripheral 不反写 core | package / method set 只做外围组织,不得决定 definition、formalization、formal version 或 consumption material 是否成立。 |

### 2. 本组对象草案

| 对象草案 | 当前归类 | 进入 R6.12 的原因 |
|---|---|---|
| `MethodAssetTraceMaterial` | trace material / support material | 承接方法资产定义、正式版本、消费材料、关系和外部摘要的 body-free 追溯材料。 |
| `ConsumptionImpactSummary` | support summary | 表达受控消费对下游的安全影响摘要,不保存下游运行 truth。 |
| `MethodAssetAuditTrail` | audit trail / append-only support | 组织本仓对象变化和安全操作线索,不保存 raw log。 |
| `MethodAssetEvidenceLineage` | lineage / evidence boundary | 连接 external summary、basis summary、formalization 和 trace,不保存证据正文。 |
| `MethodAssetRelation` | support truth | 表达方法资产之间的定义性关系、替代、组合或分发相关关系。 |
| `ExternalSourceSummary` | external support summary | 承接外部来源、artifact / archive 引用和治理依据摘要的 body-free 入口。 |
| `MethodPackage` | peripheral aggregate | 表达外围方法包组织,不作为核心闭环前置。 |
| `MethodSetAssembly` | peripheral aggregate | 表达方法集组装和组合语义,不扩大消费授权。 |

### 3. 依赖顺序草案

| 顺序 | 对象 | 依赖前提 | 后续供给 |
|---:|---|---|---|
| 1 | `ExternalSourceSummary` | external typed ref、artifact archive ref、safe summary 输入。 | formalization basis、evidence lineage、external view、inbound intake。 |
| 2 | `MethodAssetTraceMaterial` | definition / catalog / formal version / consumption material refs。 | trace query、trace refresh、audit trail、impact summary。 |
| 3 | `ConsumptionImpactSummary` | consumption material、trace subject、impact source ref。 | impact view、consistency protection、downstream handoff summary。 |
| 4 | `MethodAssetAuditTrail` | accepted object refs、trace subject、safe actor / reason refs。 | audit query、observability/audit handoff、history visibility。 |
| 5 | `MethodAssetEvidenceLineage` | external summary、basis summary、trace material、audit trail refs。 | formalization explainability、lineage query、body-free evidence chain。 |
| 6 | `MethodAssetRelation` | definition / formal version refs、related method asset ref、distribution context ref。 | relation view、distribution read material、integrity guard。 |
| 7 | `MethodPackage` | package ref、definition/formal version refs、composition input。 | package view、peripheral discovery、method set assembly。 |
| 8 | `MethodSetAssembly` | method set ref、package refs、formal version refs、composition rule result。 | assembly view、peripheral discovery、controlled consumption hint。 |

该顺序只用于 Step 6 对象讨论,不是 Step 9 处理流。若后续 flow 需要不同操作顺序,必须回指这些对象的字段来源,不能反向改写对象 owner。

### 4. 字段来源风险预判

| 对象 | 高风险字段来源 | R6.12 必须写清的边界 |
|---|---|---|
| `ExternalSourceSummary` | external source ref、artifact archive ref、summary digest、acceptance marker。 | 只接收 safe summary/ref;不得保存标准全文、ADR 正文、artifact 包体、provider payload 或治理执行正文。 |
| `MethodAssetTraceMaterial` | trace subject、source object refs、source cursor、trace summary。 | trace 是解释材料,不修来源 truth;不得保存 raw log、event payload、report body。 |
| `ConsumptionImpactSummary` | impact source、downstream summary、consumption boundary。 | unknown / pending 必须显式保留;不得默认推断 no impact 或读取下游运行状态。 |
| `MethodAssetAuditTrail` | audit subject、actor context、safe reason、trace refs。 | 只保存 body-free audit line;不得保存 request body、stack trace、日志正文或敏感字段。 |
| `MethodAssetEvidenceLineage` | evidence source refs、basis summary refs、lineage relation。 | 只表达 lineage,不保存证据正文或 archive body。 |
| `MethodAssetRelation` | relation endpoint refs、relation kind、distribution context、integrity summary。 | relation 不是 runtime dependency graph、推荐图或 marketplace transaction。 |
| `MethodPackage` | package composition、member refs、marketplace context ref。 | package 是 peripheral;不得成为 definition / formal version / consumption 前置。 |
| `MethodSetAssembly` | assembly member set、composition summary、package refs。 | assembly 不扩大消费授权,不保存 package body、listing、安装或履约状态。 |

### 5. 明确后移项

| 后移项 | 原因 | 目标模块 / Step |
|---|---|---|
| `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` | operation / maintenance task,不是本组 domain support truth。 | `R6.17`~`R6.20` 或 operation / jobs 对象组。 |
| `MethodAssetCatalogView`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetRelationView`;`ExternalSourceSummaryView`;`MethodPackageView`;`MethodSetAssemblyView` | view / read surface 已有概要轮廓,Step 6 当前先闭合 domain object owner。 | 字段来源审计或后续 view/material 对象组承接。 |
| `RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule` | policy / guard / boundary rule。 | `R6.13` / `R6.14`。 |
| `RelationChangeHistory`;`ExternalBasisAcceptanceHistory`;`PackageAssemblyHistory` | history record 可由 audit / lineage 先承接主语,细分历史记录需防止对象爆炸。 | 字段来源审计后判断是否单列。 |
| outbound event / outbox / publisher payload | 当前不恢复 outbox 主线;event candidate shell 后续由 Step 8 处理。 | Step 8 / Step 9 / worker 对象组。 |
| persistence / repository / adapter | 存储与外部读取面。 | Step 7 / Step 11 / Step 14。 |

### 6. R6.12 写入分组

`R6.12` 可以按三个小批次写入,但仍属于同一模块:

| 小批次 | 对象 | 写入重点 |
|---|---|---|
| external / trace batch | `ExternalSourceSummary`;`MethodAssetTraceMaterial`;`ConsumptionImpactSummary` | 外部摘要、追溯材料、影响摘要的 body-free 边界。 |
| audit / lineage / relation batch | `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`MethodAssetRelation` | audit / lineage / relation 主语、字段来源和禁止事项。 |
| peripheral batch | `MethodPackage`;`MethodSetAssembly` | 外围组织、composition 语义和 peripheral 不反写 core。 |

若写入超过单批 300 行,必须拆 patch,但不得为了压缩省略对象卡片必需项。

### 7. R6.12 写入边界

`R6.12` 可以写入:

- 上述八个对象卡片。
- 每个对象的身份、责任、字段骨架、字段来源、成员能力、工厂边界、不变量 / 禁止事项。
- 与 contracts typed refs / public shell、R6.10 core truth 和后续 Step 7~16 的承接提示。

`R6.12` 不得写入:

- function flow。
- repository / adapter / persistence schema。
- DTO schema、event payload、job payload。
- 完整状态迁移矩阵。
- config key、test case schema。
- 正式 `03-详细设计.md`。
- `R6.13`、Step 7 或后续 Step。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否思考 trace / impact / audit / lineage 对象草案 | 是。 |
| 是否思考 relation / distribution 对象草案 | 是。 |
| 是否思考 external summary 对象草案 | 是。 |
| 是否思考 package / method set peripheral 对象草案 | 是。 |
| 是否识别旧 snapshot / outbox 禁入边界 | 是。 |
| 是否写入对象卡片正文 | 否。 |
| 是否写入 flow、repository、DTO、state matrix 或 persistence schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.12` 写入或 Step 7 | 否。 |

R6.11 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.12 domain trace / relation / external / peripheral 对象:再写入`;只允许写入 `ExternalSourceSummary`、`MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` 对象卡片;不得写 function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.13`、Step 7 或后续 Step。

next_allowed_action: 等待用户确认后进入 Step 6 `R6.12 domain trace / relation / external / peripheral 对象:再写入`;只允许写入 `ExternalSourceSummary`、`MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` 对象卡片;不得写 function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.13`、Step 7 或后续 Step。

---

## R6.12 domain trace / relation / external / peripheral 对象:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.12 domain trace / relation / external / peripheral 对象:再写入`。 |
| 本模块目标 | 固化 external summary、trace material、impact summary、audit、lineage、relation、package 和 method set 对象卡片。 |
| 当前状态 | completed |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 写入边界 | 只写 Step 6 对象契约;不写 function flow、repository、DTO、event/job payload、persistence 或完整状态迁移矩阵。 |

### 2. 对象卡片: `ExternalSourceSummary`

```rust
pub struct ExternalSourceSummary;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 外部摘要与引用 |
| 对象类型 | support summary / external basis boundary |
| 结构责任 | 承接外部来源、artifact / archive 引用、治理依据和外围生态上下文的 body-free 安全摘要,为正式化、追溯、关系和外围组织提供可引用依据。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_core_truth.md` A7;Step 5 外部摘要与引用 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `external_summary_ref` | `ExternalSourceSummaryRef` | domain 创建的外部摘要稳定引用。 |
| `external_source_ref` | `ExternalSourceRef` | contracts external typed ref;来自外部来源解析或 inbound safe envelope。 |
| `artifact_archive_ref` | `Option<ArtifactArchiveRef>` | 可选 artifact / archive 引用;只指向外部边界,不保存包体。 |
| `source_kind` | `ExternalSourceKind` | 当前 00/01/02 允许的外部来源类型。 |
| `safe_summary` | `ExternalSafeSummary` | 可进入本仓的 body-free 摘要。 |
| `summary_digest_ref` | `ExternalSummaryDigestRef` | 对 safe summary 的一致性线索;不固定 hash 细节。 |
| `acceptance_marker_ref` | `ExternalSummaryAcceptanceMarkerRef` | summary 被本仓接受、拒绝、挂起或替代的安全 marker。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free()` | 校验不包含标准全文、ADR 正文、artifact 包体、provider payload 或治理执行正文。 |
| `assert_source(external_source_ref)` | 校验摘要仍指向同一外部来源 ref。 |
| `mark_accepted(marker_ref)` | 记录摘要被接受为可引用安全来源。 |
| `supersede_with(next_external_summary_ref)` | 显式替代旧外部摘要。 |

| 工厂边界 | 作用 |
|---|---|
| `from_safe_summary(external_source_ref, safe_summary, summary_digest_ref)` | 从已验证的安全摘要建立外部摘要对象。 |
| `from_artifact_ref(external_source_ref, artifact_archive_ref, safe_summary)` | 从 artifact / archive 引用和安全摘要建立对象。 |
| `rejected_by_body_boundary(external_source_ref, reason_ref)` | 表达外部材料到达但因正文边界被拒绝。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| body_free_only | 只保存 safe summary、typed ref、digest 线索和 marker。 |
| no_external_truth_copy | 不复制外部系统、标准、ADR、artifact、archive 或 marketplace truth。 |
| no_provider_payload | 不保存 provider API response、raw document、包体或执行正文。 |
| no_direct_formalization | 外部摘要本身不建立正式版本,只能被 basis / formalization 对象引用。 |

### 3. 对象卡片: `MethodAssetTraceMaterial`

```rust
pub struct MethodAssetTraceMaterial;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 追溯与一致性保护 |
| 对象类型 | trace material / support material |
| 结构责任 | 承载方法资产定义、目录、正式版本、消费材料、关系和外部摘要之间的 body-free 追溯材料,支撑 trace query、刷新和审计解释。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_views_materials.md` C4/C5;Step 5 追溯与一致性保护 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `trace_material_ref` | `MethodAssetTraceMaterialRef` | domain 创建的追溯材料稳定引用。 |
| `trace_subject_ref` | `TraceSubjectRef` | contracts typed ref;由当前对象 subject mapper 或已成立对象 ref 转换。 |
| `source_object_refs` | `MethodAssetTraceSourceRefSet` | definition、catalog、formal version、consumption、relation 或 external summary refs。 |
| `trace_summary` | `MethodAssetTraceSummary` | body-free 追溯摘要。 |
| `source_cursor_ref` | `MethodAssetTraceCursorRef` | 已提交来源位置 / 派生依据。 |
| `freshness_marker_ref` | `MethodAssetTraceFreshnessMarkerRef` | 追溯材料相对来源 truth 的 freshness marker。 |
| `external_summary_refs` | `ExternalSourceSummaryRefSet` | 可选外部摘要线索,不保存外部正文。 |

| 成员能力 | 作用 |
|---|---|
| `assert_subject(trace_subject_ref)` | 校验追溯材料仍属于同一追溯主体。 |
| `includes_source_ref(source_ref)` | 判断追溯材料是否包含指定来源对象。 |
| `mark_stale(reason_ref)` | 标记追溯材料过期,不修改来源 truth。 |
| `safe_trace_summary()` | 返回可公开 / 可审计的安全追溯摘要。 |

| 工厂边界 | 作用 |
|---|---|
| `from_source_objects(trace_subject_ref, source_object_refs, source_cursor_ref)` | 从已成立对象 refs 和来源 cursor 派生追溯材料。 |
| `partial(trace_subject_ref, available_source_refs, reason_ref)` | 表达只有部分安全来源可追溯。 |
| `unavailable(trace_subject_ref, reason_ref)` | 表达追溯材料暂不可用。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| trace_material_not_truth | trace material 是解释材料,不是 definition、version、relation 或 external truth。 |
| no_raw_log | 不保存日志、span、event payload、metric、request body 或 stack trace。 |
| no_report_body | 不保存 report body、证据正文、artifact body 或 archive 包体。 |
| no_truth_repair | trace 刷新或读取不得修复来源 truth。 |

### 4. 对象卡片: `ConsumptionImpactSummary`

```rust
pub struct ConsumptionImpactSummary;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 追溯与一致性保护 |
| 对象类型 | support summary / impact summary |
| 结构责任 | 表达方法资产定义、正式版本、消费边界或关系变化对受控消费方的安全影响摘要,保留 known / unknown / pending 语义。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_core_truth.md` A8;Step 5 追溯与一致性保护 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `impact_summary_ref` | `ConsumptionImpactSummaryRef` | domain 创建的影响摘要稳定引用。 |
| `impact_source_ref` | `ConsumptionImpactSourceRef` | contracts typed ref;来自消费材料、关系、版本或边界变化。 |
| `consumption_material_ref` | `Option<MethodAssetConsumptionMaterialRef>` | 可选受控消费材料锚点。 |
| `consumption_context_ref` | `Option<ConsumptionContextRef>` | 可选消费语境。 |
| `impact_kind` | `ConsumptionImpactKind` | known、unknown、pending、no_known_effect 等概要语义。 |
| `impact_safe_summary` | `ConsumptionImpactSafeSummary` | body-free 下游影响摘要。 |
| `trace_material_ref` | `Option<MethodAssetTraceMaterialRef>` | 可选追溯材料回指。 |

| 成员能力 | 作用 |
|---|---|
| `is_unknown()` | 判断影响是否仍未知。 |
| `assert_source(impact_source_ref)` | 校验摘要来源未漂移。 |
| `mark_pending(reason_ref)` | 记录影响需要后续承接。 |
| `supersede_with(next_impact_summary_ref)` | 用后续影响摘要替代当前摘要。 |

| 工厂边界 | 作用 |
|---|---|
| `from_consumption_material(consumption_material_ref, impact_source_ref)` | 从消费材料和变化来源建立影响摘要。 |
| `unknown(impact_source_ref, reason_ref)` | 显式表达未知影响,不得压成 no effect。 |
| `pending_downstream_summary(impact_source_ref, reason_ref)` | 表达等待下游 safe summary 承接。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| unknown_is_explicit | unknown / pending 必须显式保留。 |
| no_downstream_truth | 不保存 process、runtime、identity、member-images 或 marketplace 下游运行事实。 |
| no_sync_success_proxy | 不用同步成功、投递成功或 read receipt 证明业务影响。 |
| no_private_scan | 不扫描或推断下游私有状态。 |

### 5. 对象卡片: `MethodAssetAuditTrail`

```rust
pub struct MethodAssetAuditTrail;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 追溯与一致性保护 |
| 对象类型 | audit trail / append-only support |
| 结构责任 | 组织方法资产定义、目录、正式化、消费、关系、外部摘要和外围组织变化的安全审计线索。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_refs_trace_audit.md` D17;Step 5 追溯与一致性保护 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `audit_trail_ref` | `MethodAssetAuditTrailRef` | domain 创建的审计轨迹稳定引用。 |
| `audit_subject_ref` | `MethodAssetAuditSubjectRef` | 当前被审计对象的 typed subject ref。 |
| `trace_material_refs` | `MethodAssetTraceMaterialRefSet` | 与审计轨迹关联的追溯材料 refs。 |
| `actor_context_ref` | `ActorContextRef` | command / inbound / job metadata 中的安全 actor context。 |
| `safe_reason_ref` | `MethodAssetSafeReasonRef` | 安全原因引用,不保存原始错误或请求正文。 |
| `audit_entry_refs` | `MethodAssetAuditEntryRefSet` | append-only 审计条目引用集合。 |
| `source_cursor_ref` | `MethodAssetAuditCursorRef` | 审计条目对应的提交位置或来源 cursor。 |

| 成员能力 | 作用 |
|---|---|
| `assert_subject(audit_subject_ref)` | 校验审计轨迹仍绑定同一 subject。 |
| `append_entry(entry_ref, source_cursor_ref)` | 追加审计条目引用,不改写既有条目。 |
| `link_trace_material(trace_material_ref)` | 关联追溯材料。 |
| `assert_body_free()` | 校验审计轨迹不携带 raw log、request body 或敏感字段。 |

| 工厂边界 | 作用 |
|---|---|
| `for_subject(audit_subject_ref, actor_context_ref)` | 为业务 subject 建立审计轨迹。 |
| `from_trace_material(audit_subject_ref, trace_material_ref, safe_reason_ref)` | 从追溯材料建立审计轨迹线索。 |
| `partial(audit_subject_ref, reason_ref)` | 表达只有部分审计线索可安全返回。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append_only | 审计轨迹只能追加安全条目引用,不得覆盖历史。 |
| no_raw_log | 不保存日志正文、trace span、metric、stack trace 或 request/response body。 |
| no_secret | 不保存 secret、token、PII 明文或 provider payload。 |
| no_state_owner | audit trail 不拥有业务当前状态。 |

### 6. 对象卡片: `MethodAssetEvidenceLineage`

```rust
pub struct MethodAssetEvidenceLineage;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 追溯与一致性保护 |
| 对象类型 | lineage / evidence boundary |
| 结构责任 | 连接外部摘要、正式化依据、追溯材料、审计轨迹和对象变化,形成可解释的 body-free evidence lineage。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_refs_trace_audit.md` D21;Step 5 追溯与一致性保护 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `evidence_lineage_ref` | `MethodAssetEvidenceLineageRef` | domain 创建的 lineage 稳定引用。 |
| `lineage_subject_ref` | `TraceSubjectRef` | lineage 适用的 trace subject。 |
| `external_summary_refs` | `ExternalSourceSummaryRefSet` | 外部摘要 refs。 |
| `basis_summary_refs` | `FormalizationBasisSummaryRefSet` | 正式化依据摘要 refs。 |
| `trace_material_refs` | `MethodAssetTraceMaterialRefSet` | 追溯材料 refs。 |
| `audit_trail_ref` | `Option<MethodAssetAuditTrailRef>` | 可选审计轨迹回指。 |
| `lineage_summary` | `MethodAssetEvidenceLineageSummary` | body-free lineage 摘要。 |

| 成员能力 | 作用 |
|---|---|
| `assert_subject(lineage_subject_ref)` | 校验 lineage 仍属于同一追溯主体。 |
| `link_external_summary(external_summary_ref)` | 关联外部摘要 ref。 |
| `link_basis_summary(basis_summary_ref)` | 关联正式化依据摘要 ref。 |
| `mark_partial(reason_ref)` | 记录 lineage 只能部分安全返回。 |

| 工厂边界 | 作用 |
|---|---|
| `from_external_and_basis(lineage_subject_ref, external_summary_refs, basis_summary_refs)` | 从外部摘要和依据摘要建立 lineage。 |
| `from_trace_material(lineage_subject_ref, trace_material_refs)` | 从追溯材料集合建立 lineage。 |
| `body_rejected(lineage_subject_ref, reason_ref)` | 表达证据正文被拒绝但 lineage 保留安全线索。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| lineage_not_evidence_body | lineage 只表达关系,不保存证据正文。 |
| no_archive_body | 不保存 archive 包、artifact body、报告正文或附件内容。 |
| no_external_execution | 不保存治理执行、外部审批或 provider 执行正文。 |
| no_formalization_shortcut | lineage 不直接推进 formalization state 或 formal version。 |

### 7. 对象卡片: `MethodAssetRelation`

```rust
pub struct MethodAssetRelation;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 关系与分发语义 |
| 对象类型 | support truth / relation truth |
| 结构责任 | 承载方法资产之间的定义性关系、替代、组合、依赖说明和分发语义线索,为消费、追溯和外围组织提供关系输入。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_core_truth.md` A5;Step 5 关系与分发语义 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `relation_ref` | `MethodAssetRelationRef` | domain 创建的方法资产关系稳定引用。 |
| `source_definition_ref` | `MethodAssetDefinitionRef` | 关系源端定义 ref。 |
| `target_definition_ref` | `MethodAssetDefinitionRef` | 关系目标端定义 ref。 |
| `formal_version_context_ref` | `Option<FormalMethodAssetVersionRef>` | 可选正式版本语境。 |
| `relation_kind` | `MethodAssetRelationKind` | 关系语义类别;完整状态 / 规则后移。 |
| `distribution_context_ref` | `Option<DistributionContextRef>` | 可选分发语境 ref。 |
| `relation_basis_summary_refs` | `ExternalSourceSummaryRefSet` | 支撑关系成立的安全摘要 refs。 |
| `relation_status` | `MethodAssetRelationStatus` | 关系概要状态;完整迁移后移 Step 10。 |

| 成员能力 | 作用 |
|---|---|
| `assert_endpoint(source_ref, target_ref)` | 校验关系端点未漂移。 |
| `applies_to_version(formal_version_ref)` | 判断关系是否适用于指定正式版本语境。 |
| `mark_constrained(reason_ref)` | 标记关系受约束,不删除端点 truth。 |
| `supersede_with(next_relation_ref)` | 用后续关系 truth 替代当前关系。 |

| 工厂边界 | 作用 |
|---|---|
| `from_definition_endpoints(source_definition_ref, target_definition_ref, relation_kind)` | 从两个定义锚点建立关系。 |
| `from_formal_version_context(source_definition_ref, target_definition_ref, formal_version_ref)` | 在正式版本语境下建立关系线索。 |
| `from_explicit_relation_change(previous_relation_ref, change_summary)` | 从显式关系变化形成后续关系。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| relation_not_runtime_graph | 不表达 runtime dependency graph、调用链、推荐图或同步链路。 |
| no_marketplace_transaction | 不保存 listing、订单、安装、购买、结算或履约状态。 |
| no_distribution_payload | 不保存分发包体、topic payload 或 delivery record。 |
| relation_not_core_definition | relation 不创建或修改 definition / formal version truth。 |

### 8. 对象卡片: `MethodPackage`

```rust
pub struct MethodPackage;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 外围包与方法集组织 |
| 对象类型 | peripheral aggregate |
| 结构责任 | 表达方法资产包的外围组织、成员引用和生态发现语义,为 package view、method set assembly 和外围 discovery 提供稳定主语。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_operations_peripheral.md` E4;Step 5 外围包与方法集组织 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `package_ref` | `MethodPackageRef` | domain 创建的 package 稳定引用。 |
| `package_summary` | `MethodPackageSummary` | body-free 包组织摘要。 |
| `member_definition_refs` | `MethodAssetDefinitionRefSet` | 包内定义成员 refs。 |
| `member_formal_version_refs` | `FormalMethodAssetVersionRefSet` | 可选正式版本成员 refs。 |
| `composition_summary_ref` | `PackageCompositionSummaryRef` | package 组合结果安全摘要。 |
| `marketplace_context_ref` | `Option<MarketplaceContextRef>` | 可选外围生态上下文 ref;不保存 marketplace truth。 |
| `package_status` | `MethodPackageStatus` | package 概要状态;完整迁移后移 Step 10。 |

| 成员能力 | 作用 |
|---|---|
| `includes_definition(definition_ref)` | 判断 package 是否包含指定定义。 |
| `includes_formal_version(formal_version_ref)` | 判断 package 是否包含指定正式版本。 |
| `assert_peripheral()` | 校验 package 不作为核心闭环前置。 |
| `mark_unavailable(reason_ref)` | 标记 package 暂不可用,不影响 core truth。 |

| 工厂边界 | 作用 |
|---|---|
| `from_members(package_ref, member_definition_refs, member_formal_version_refs)` | 从已成立成员 refs 建立 package。 |
| `from_composition_result(package_ref, composition_summary_ref)` | 从组合裁决结果建立 package 语义线索。 |
| `unavailable(package_ref, reason_ref)` | 表达外围 package 暂不可用。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| peripheral_only | package 是外围组织,不得成为 definition、formalization、consumption 或 trace 前置。 |
| no_package_body | 不保存包体、安装文件、artifact 内容或外部 marketplace 描述正文。 |
| no_marketplace_truth | 不保存 listing、价格、交易、安装、结算或履约状态。 |
| no_core_repair | package 调整不得修复或创建 core truth。 |

### 9. 对象卡片: `MethodSetAssembly`

```rust
pub struct MethodSetAssembly;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 外围包与方法集组织 |
| 对象类型 | peripheral aggregate / assembly |
| 结构责任 | 表达方法集组装、package 成员组合和外围 discovery 语义,为 method set view 和受控消费提示提供外围组织主语。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_operations_peripheral.md` E5;Step 5 外围包与方法集组织 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `method_set_assembly_ref` | `MethodSetAssemblyRef` | domain 创建的方法集组装稳定引用。 |
| `assembly_summary` | `MethodSetAssemblySummary` | body-free 方法集组装摘要。 |
| `package_refs` | `MethodPackageRefSet` | 参与组装的 package refs。 |
| `member_definition_refs` | `MethodAssetDefinitionRefSet` | 可选直接成员定义 refs。 |
| `member_formal_version_refs` | `FormalMethodAssetVersionRefSet` | 可选直接成员正式版本 refs。 |
| `composition_summary_ref` | `PackageCompositionSummaryRef` | 组合裁决安全摘要。 |
| `assembly_status` | `MethodSetAssemblyStatus` | assembly 概要状态;完整迁移后移 Step 10。 |

| 成员能力 | 作用 |
|---|---|
| `includes_package(package_ref)` | 判断 assembly 是否包含指定 package。 |
| `assert_composition(summary_ref)` | 校验组装结果来自正式 composition summary。 |
| `mark_partially_available(reason_ref)` | 标记只有部分成员可安全读取。 |
| `assert_no_scope_expansion(consumption_context_ref)` | 校验 assembly 不扩大受控消费授权。 |

| 工厂边界 | 作用 |
|---|---|
| `from_packages(method_set_assembly_ref, package_refs, composition_summary_ref)` | 从 package refs 和 composition summary 建立方法集组装。 |
| `from_direct_members(method_set_assembly_ref, member_definition_refs, member_formal_version_refs)` | 从直接成员 refs 建立组装线索。 |
| `unavailable(method_set_assembly_ref, reason_ref)` | 表达方法集组装暂不可用。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| assembly_is_peripheral | assembly 是外围组织,不得阻塞核心闭环。 |
| no_authorization_expansion | assembly 不扩大 consumption boundary 或访问授权。 |
| no_install_fulfillment | 不保存安装、部署、交付、交易或履约状态。 |
| no_package_body_copy | 不复制 package body、artifact body、external listing 或 UI 配置。 |

### 10. 后续 Step 承接

| 后续 Step | 必须承接的 support / peripheral 内容 | 暂停条件 |
|---|---|---|
| Step 7 | trace、audit、lineage、relation、external summary、package / set repository 或 resolver ports 必须回指这些对象或 typed ref。 | port 需要 raw log、external body、package body 或 marketplace truth。 |
| Step 8 | protocol DTO 只能使用对象 ref、safe summary、marker 和 public shell。 | DTO 复制证据正文、provider payload、listing 或下游运行状态。 |
| Step 9 | command/query/worker/job flow 必须按对象工厂和成员能力串联。 | flow 现场拼 trace subject、audit subject、relation endpoint 或 package member。 |
| Step 10 | relation、external summary acceptance、trace freshness、package / assembly 状态必须回指对象 owner。 | 状态矩阵没有明确主语。 |
| Step 11 | append-only audit / lineage / relation / peripheral persistence 不能反向改变 typed ref 语义。 | DB key、topic id、path 或 package name 替代 typed ref。 |
| Step 12 | unavailable / partial / degraded branch 必须保留 safe marker 和 no-body 口径。 | raw error、external response 或下游状态进入 public error。 |
| Step 16 | 测试必须覆盖 no external body、no raw log、no marketplace truth、peripheral no core impact。 | 无法证明正文禁入和外围隔离。 |

### 11. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入八个 trace / relation / external / peripheral 对象卡片 | 是。 |
| 是否写入字段骨架和字段来源 | 是。 |
| 是否写入成员能力、工厂边界、不变量 / 禁止事项 | 是。 |
| 是否写入 function flow、repository、adapter 或 persistence schema | 否。 |
| 是否写入 DTO schema、event payload 或 job payload | 否。 |
| 是否写入完整状态迁移矩阵 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.13` 思考或 Step 7 | 否。 |

R6.12 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.13 domain policy / guard / state owner 预筛:先思考`;只允许思考 `FormalizationEligibilityRule`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`ExternalBodyBoundaryRule`、`PackageCompositionRule` 以及状态主语预筛;不得写对象卡片正文、function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.14`、Step 7 或后续 Step。该动作已由 `R6.13` 完成,当前 next_allowed_action 以后文 `R6.14` 当前门禁为准。

---

## R6.13 domain policy / guard / state owner 预筛:先思考

### 1. 思考记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.13 domain policy / guard / state owner 预筛:先思考`。 |
| 本模块目标 | 从当前 `02` 的 policy / guard / boundary 对象轮廓中筛出 `R6.14` 写入对象,并提前标出可能成为 Step 10 状态主语的对象。 |
| 当前状态 | completed |
| 写入范围 | 只写入本 Step 6 中间产物中的思考、候选、风险和下一写入边界。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不写对象卡片正文,不写完整状态迁移矩阵,不写 trait / port / DTO / flow / persistence / config / test。 |

### 2. 输入基线

| 输入 | 本模块读取方式 | 结论 |
|---|---|---|
| `02-概要设计.md` §5.4 / §5.5 / §6 | 作为 policy / guard / boundary 对象和状态主语来源。 | 七个 policy / guard / boundary 对象均进入本批讨论。 |
| `02_hld_step_06_key_objects_policies_guards.md` | 作为对象责任、禁止事项和概要字段骨架来源。 | 只承接判断边界,不机械继承为最终卡片。 |
| `03_ddd_step_05_module_contracts.md` | 作为模块 owner、capability 和 forbidden dependency 来源。 | 七个对象均归 `domain`,不得下沉到 `contracts` 或上探到 `application`。 |
| `R6.10` / `R6.12` 已写对象卡片 | 作为状态主语预筛的已知对象池。 | 状态 owner 只做预筛,完整状态矩阵后移 Step 10。 |

### 3. 候选分组

| 分组 | 候选对象 | 判断 |
|---|---|---|
| 正式化资格 policy | `FormalizationEligibilityRule` | 必须独立写入,防止读取、引用或下游使用隐式触发正式化。 |
| Definition vs Use guard | `DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary` | 必须同组思考,前者防反写,后者定义可消费边界。 |
| 一致性保护 policy | `ConsistencyProtectionPolicy` | 必须独立写入,承接正式版本变化、影响摘要和既有正式消费保护。 |
| 关系 / 外部正文 guard | `RelationIntegrityRule`;`ExternalBodyBoundaryRule` | 必须写入,分别保护关系端点完整性和外部正文禁入。 |
| 外围 composition invariant | `PackageCompositionRule` | 必须写入并标注 peripheral,不得让 package / method set 成为核心闭环前置。 |
| 状态主语预筛 | `FormalizationState` 等已写对象和本批 guard / policy | 只筛状态 owner 候选,不得写 Step 10 矩阵。 |

### 4. 候选对象裁决

| 对象 | `R6.14` 裁决 | 所属 capability | 为什么不能并入已有对象 | 本批禁止方向 |
|---|---|---|---|---|
| `FormalizationEligibilityRule` | 写入 | 正式化与版本 | 资格判断横跨 definition、catalog、basis summary 和 formal version,不能埋入 `FormalMethodAssetVersion`。 | governance 执行、审批流、配置矩阵、版本号算法。 |
| `DefinitionUseBoundaryGuard` | 写入 | 受控消费 | guard 保护 definition truth 和 formal version 不被使用侧反写,不能并入 consumption material。 | 下游运行状态、权限矩阵、请求正文。 |
| `DownstreamConsumptionBoundary` | 写入 | 受控消费 | boundary 是下游使用边界主语,会被 protocol、flow、state 和 test 反复引用。 | 同步成功记录、安装状态、消费方私有模型。 |
| `ConsistencyProtectionPolicy` | 写入 | 追溯与一致性保护 | 保护逻辑横跨 version change、impact summary、trace material 和 existing consumption context。 | 恢复算法、告警规则、operations report schema。 |
| `RelationIntegrityRule` | 写入 | 关系与分发语义 | relation endpoint、formalization requirement 和 distribution boundary 需要独立判断主语。 | 推荐图、运行依赖图、marketplace 履约。 |
| `ExternalBodyBoundaryRule` | 写入 | 外部摘要与引用 | 外部正文禁入横跨 basis、trace、audit、package 和 evidence lineage,不能散落到各对象。 | 外部正文摘录、archive 包体、provider payload。 |
| `PackageCompositionRule` | 写入 | 外围包与方法集组织 | package / method set composition 是 peripheral invariant,不能由 package 字段暗含。 | marketplace listing、安装包正文、核心授权扩大。 |

### 5. 字段来源风险预分析

| 对象 | 高风险字段来源 | `R6.14` 必须写清 |
|---|---|---|
| `FormalizationEligibilityRule` | definition readiness、catalog context、basis requirement、governance basis summary。 | 来源只能是已成立 definition / catalog / basis summary / safe governance ref,不能读取治理执行状态。 |
| `DefinitionUseBoundaryGuard` | protected definition / formal version、consumption context、violation reason。 | guard 只复制 typed ref 和 safe reason,不能保存下游请求体或身份仓运行状态。 |
| `DownstreamConsumptionBoundary` | formal version requirement、allowed use kind、forbidden write kind、material scope。 | boundary 不等于鉴权矩阵;消费许可来源必须回指 formal version 和 consumption material。 |
| `ConsistencyProtectionPolicy` | protected version、impact summary、trace material、protected consumption context。 | impact unknown 必须保持待承接口径,不能自行推断下游影响已完成。 |
| `RelationIntegrityRule` | relation endpoints、formalization requirement、distribution boundary。 | relation integrity 只能检查本仓 relation / typed ref,不能解析 marketplace 或 runtime dependency。 |
| `ExternalBodyBoundaryRule` | external ref、artifact archive ref、body candidate ref、boundary reason。 | 只能写 body-free ref / marker / reason,不得保存正文、摘录、hash 正文或 payload。 |
| `PackageCompositionRule` | package / assembly refs、member refs、distribution refs、marketplace context ref。 | 必须标注 peripheral,不得让 package state 反向决定核心对象成立。 |

### 6. 状态主语预筛

| 状态主语候选 | 初判 | Step 10 承接要求 |
|---|---|---|
| `FormalizationState` | primary state owner | 正式化状态矩阵必须以它为主语,不得恢复旧 publish lifecycle。 |
| `FormalMethodAssetVersion` | stable truth,非主要生命周期 owner | 若需要 availability / superseded 口径,必须和 `FormalizationState`、版本不变量分清。 |
| `MethodAssetConsumptionMaterial` | material readiness / availability 候选 | 可表达消费材料是否可用,但不得承接下游运行状态。 |
| `DefinitionUseBoundaryGuard` / `DownstreamConsumptionBoundary` | guard / boundary judgement state 候选 | 只允许状态化 judgement 或 result marker,不得变成权限系统状态。 |
| `ConsistencyProtectionPolicy` / `ConsumptionImpactSummary` | consistency protection / impact acknowledgement 候选 | unknown / protected / constrained 分支后移 Step 10,不得写恢复流程。 |
| `MethodAssetRelation` / `RelationIntegrityRule` | relation status / integrity judgement 候选 | relation 状态必须绑定 source / target definition refs,不得表达 runtime graph。 |
| `ExternalSourceSummary` / `ExternalBodyBoundaryRule` | external acceptance / body rejected 候选 | 只表达 summary accepted / body rejected / unavailable,不得保存正文。 |
| `MethodPackage` / `MethodSetAssembly` / `PackageCompositionRule` | peripheral availability / composition judgement 候选 | 状态不可阻塞 core truth,不可扩大 consumption authorization。 |
| audit / lineage / trace material 对象 | support freshness / partiality 候选 | 仅承接 safe marker、freshness、partiality;完整迁移后移 Step 10。 |

### 7. 明确后移和排除

| 项目 | 处理 |
|---|---|
| 完整状态迁移矩阵 | 后移 Step 10。`R6.14` 只写状态主语预筛和对象状态字段边界。 |
| policy engine / rule matrix | 不进入 Step 6。对象只表达 judgement boundary 和不变量。 |
| trait / port / repository / adapter | 后移 Step 7。 |
| DTO / command / query / event / job payload | 后移 Step 8。 |
| function flow / transaction order | 后移 Step 9 / Step 11。 |
| persistence schema / config key / test case schema | 分别后移 Step 11 / Step 14 / Step 16。 |
| 旧 `MethodContentLifecycle`、snapshot、fingerprint、outbox status | 禁入当前对象组,只在后续历史差异审计中记录。 |

### 8. `R6.14` 写入分组和边界

`R6.14` 可以按三个小批次写入,但仍属于同一模块:

| 小批次 | 写入内容 | 边界 |
|---|---|---|
| policy / consumption guard | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary` | 写对象卡片、字段骨架、成员能力、工厂边界、不变量和禁止事项。 |
| consistency / relation / external guard | `ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule` | 写 judgement boundary 和 no-body / no-runtime-truth 禁止事项。 |
| peripheral composition / state owner prefilter | `PackageCompositionRule`;状态主语预筛表 | 标注 peripheral,只写 Step 10 前置输入,不写迁移矩阵。 |

`R6.14` 不得写入:

- Step 10 状态迁移矩阵。
- Step 7 trait / port / adapter。
- Step 8 DTO / event / job payload。
- Step 9 function flow。
- Step 11 persistence schema。
- Step 14 config key。
- Step 16 test case schema。
- 正式 `03-详细设计.md`。
- `R6.15` 或后续模块。

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只做先思考 | 是。 |
| 是否裁决 `R6.14` 写入对象 | 是:七个 policy / guard / boundary 对象。 |
| 是否写对象卡片正文 | 否。 |
| 是否写状态主语预筛 | 是:只做候选预筛,不写矩阵。 |
| 是否写完整状态迁移、flow、port、DTO、persistence、config 或 test schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.14` 写入或 Step 7 | 否。 |

R6.13 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.14 domain policy / guard / state owner 预筛:再写入`;只允许写入 `FormalizationEligibilityRule`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`ExternalBodyBoundaryRule`、`PackageCompositionRule` 对象卡片和状态主语预筛;不得写 function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.15`、Step 7 或后续 Step。该动作已由 `R6.14` 完成,当前 next_allowed_action 以后文 `R6.14` 当前门禁为准。

---

## R6.14 domain policy / guard / state owner 预筛:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.14 domain policy / guard / state owner 预筛:再写入`。 |
| 本模块目标 | 写入七个 policy / guard / boundary 对象卡片,并固化 Step 10 前的状态主语预筛。 |
| 当前状态 | completed |
| 写入范围 | 仅写入 Step 6 中间产物。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不写 Step 7 port、Step 8 DTO、Step 9 flow、Step 10 完整状态矩阵、Step 11 persistence、Step 14 config 或 Step 16 test。 |

### 2. 对象卡片: `FormalizationEligibilityRule`

```rust
pub struct FormalizationEligibilityRule;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 正式化与版本 |
| 对象类型 | domain policy / invariant |
| 结构责任 | 判断方法资产定义是否具备进入正式使用语境的最小资格,并阻断读取、引用、同步或下游使用隐式触发正式化。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B4;Step 5 正式化与版本 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `rule_ref` | `FormalizationEligibilityRuleRef` | domain 创建的资格规则稳定引用。 |
| `definition_requirement` | `MethodAssetDefinitionRequirement` | 当前 definition / catalog 成立条件的安全表达。 |
| `basis_requirement` | `FormalizationBasisRequirement` | 正式化依据摘要 / typed ref 的要求。 |
| `governance_basis_requirement` | `OptionalGovernanceBasisRequirement` | governance summary/ref 的条件型要求,不承接治理执行。 |
| `forbidden_trigger_kind_set` | `ForbiddenFormalizationTriggerKindSet` | 禁止隐式触发正式化的来源类别。 |
| `rejection_reason_ref` | `Option<FormalizationEligibilityRejectionRef>` | 资格不足时的安全原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_definition_ready(definition_ref)` | 校验定义锚点具备正式化前置。 |
| `assert_catalog_context(catalog_entry_ref)` | 校验目录语境满足正式化要求。 |
| `assert_basis_sufficient(basis_summary_ref)` | 校验依据摘要足以支撑资格判断。 |
| `reject_implicit_trigger(trigger_ref)` | 拒绝由读取、引用、同步或运行使用触发正式化。 |

| 工厂边界 | 作用 |
|---|---|
| `default_core_rule(rule_ref)` | 建立核心闭环默认资格规则。 |
| `from_basis_requirement(rule_ref, basis_requirement)` | 基于依据要求建立规则变体。 |
| `rejected(rule_ref, rejection_reason_ref)` | 表达资格不足的安全拒绝口径。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_governance_execution | 不保存 Gate、审批流、policy enforce 或治理执行状态。 |
| no_config_matrix | 不保存 profile、开关、阈值或组织配置矩阵。 |
| no_version_number_algorithm | 不决定版本号算法、hash、fingerprint 或发布策略。 |
| no_downstream_runtime_input | 下游运行、成员状态、UI 状态不得成为资格来源。 |

### 3. 对象卡片: `DefinitionUseBoundaryGuard`

```rust
pub struct DefinitionUseBoundaryGuard;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 受控消费 |
| 对象类型 | domain guard / boundary |
| 结构责任 | 防止定义 truth、正式版本和下游使用语境混淆,阻断下游私有定义、消费材料反写和越界使用。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B1;Step 5 受控消费 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `guard_ref` | `DefinitionUseBoundaryGuardRef` | domain 创建的 guard 稳定引用。 |
| `protected_definition_ref` | `MethodAssetDefinitionRef` | 被保护的方法资产定义锚点。 |
| `protected_formal_version_ref` | `FormalMethodAssetVersionRef` | 被保护的正式版本边界。 |
| `consumption_context_ref` | `ConsumptionContextRef` | guard 适用的下游消费语境 typed ref。 |
| `boundary_ref` | `DownstreamConsumptionBoundaryRef` | 关联的消费边界对象。 |
| `guard_reason_ref` | `DefinitionUseGuardReasonRef` | guard 判断的安全原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_material_uses_formal_version(consumption_material_ref)` | 校验消费材料只能引用正式版本。 |
| `assert_context_within_boundary(consumption_context_ref)` | 校验消费语境在已声明边界内。 |
| `reject_downstream_definition_write(write_attempt_ref)` | 拒绝下游对定义 truth 或正式版本反写。 |
| `mark_violation(violation_ref)` | 记录 body-free 越界线索。 |

| 工厂边界 | 作用 |
|---|---|
| `protect_formal_consumption(definition_ref, formal_version_ref, boundary_ref)` | 为正式版本消费建立 guard。 |
| `violated(violation_ref, boundary_ref)` | 从已识别越界线索建立 guard violation 口径。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_downstream_truth | 不保存 process、identity、runtime、member-images、UI 或 marketplace 的运行状态。 |
| no_permission_matrix | 不写 role、token、scope 或策略引擎矩阵。 |
| no_formalization_shortcut | guard 不能把非正式定义提升为正式版本。 |
| no_raw_request_body | 违规请求和证据正文只能用 body-free ref / marker 承接。 |

### 4. 对象卡片: `DownstreamConsumptionBoundary`

```rust
pub struct DownstreamConsumptionBoundary;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 受控消费 |
| 对象类型 | boundary object |
| 结构责任 | 固定下游如何按正式版本、消费材料和消费语境使用方法资产,并声明不可反写和不可拥有的边界。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B2;Step 5 受控消费 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `boundary_ref` | `DownstreamConsumptionBoundaryRef` | domain 创建的消费边界稳定引用。 |
| `consumption_context_ref` | `ConsumptionContextRef` | 边界适用的消费语境 typed ref。 |
| `formal_version_requirement` | `FormalVersionRequirement` | 要求消费锚定正式版本的规则。 |
| `allowed_use_kind_set` | `MethodAssetAllowedUseKindSet` | 允许读取、引用、组装或分发的使用类别。 |
| `forbidden_write_kind_set` | `DownstreamForbiddenWriteKindSet` | 禁止下游反写定义、版本、材料或追溯的类别。 |
| `material_scope_ref` | `MethodAssetConsumptionMaterialScopeRef` | 边界允许的消费材料范围。 |
| `boundary_reason_ref` | `ConsumptionBoundaryReasonRef` | 边界成立或受限的安全原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_context_allowed(consumption_context_ref)` | 判断消费语境是否在边界内。 |
| `assert_formal_version_required(formal_version_ref)` | 校验使用锚点必须是正式版本。 |
| `assert_use_kind_allowed(use_kind)` | 判断使用类别是否被允许。 |
| `reject_forbidden_write(write_attempt_ref)` | 拒绝下游反写或 ownership 越界。 |

| 工厂边界 | 作用 |
|---|---|
| `for_consumption_context(consumption_context_ref, formal_version_requirement)` | 为指定消费语境建立边界。 |
| `scope_limited(consumption_context_ref, reason_ref)` | 建立范围受限的消费边界。 |
| `unavailable(consumption_context_ref, reason_ref)` | 表达边界暂不可用但不创建下游 truth。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_downstream_ownership | 下游执行、安装、运行、绑定、展示和交易事实不属于本对象。 |
| boundary_not_material | boundary 只声明允许和禁止,不承载消费材料正文。 |
| no_transport_contract | request / response / DTO / repository 留给 Step 7 / Step 8。 |
| no_marketplace_fulfillment | listing、订单、安装、付费和交付状态属于 `L6-marketplace`。 |

### 5. 对象卡片: `ConsistencyProtectionPolicy`

```rust
pub struct ConsistencyProtectionPolicy;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 追溯与一致性保护 |
| 对象类型 | domain policy / guard |
| 结构责任 | 保护正式版本语义变化和消费影响变化必须显式识别,避免静默破坏既有正式消费和长期引用。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B5;Step 5 追溯与一致性保护 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `policy_ref` | `ConsistencyProtectionPolicyRef` | domain 创建的一致性保护策略引用。 |
| `protected_version_ref` | `FormalMethodAssetVersionRef` | 被保护的正式版本引用。 |
| `impact_summary_ref` | `Option<ConsumptionImpactSummaryRef>` | 消费影响摘要引用。 |
| `trace_material_ref` | `Option<MethodAssetTraceMaterialRef>` | 变化追溯材料引用。 |
| `protected_context_refs` | `ConsumptionContextRefSet` | 可能受影响的正式消费语境集合。 |
| `unknown_impact_reason_ref` | `Option<ConsumptionImpactUnknownReasonRef>` | 影响未知时的待承接原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_version_change_explicit(reason_ref)` | 校验正式版本语义变化是显式变化。 |
| `require_impact_summary(impact_source_ref)` | 要求影响变化形成摘要或明确未知口径。 |
| `assert_existing_consumption_protected(consumption_context_ref)` | 校验既有正式消费没有被静默破坏。 |
| `mark_unknown_impact(reason_ref)` | 将不可判定影响保持为待承接 / 待确认。 |

| 工厂边界 | 作用 |
|---|---|
| `protect_formal_version(formal_version_ref)` | 为正式版本建立一致性保护策略。 |
| `from_impact_summary(impact_summary_ref)` | 基于消费影响摘要建立保护判断上下文。 |
| `unknown_impact(formal_version_ref, reason_ref)` | 表达影响未知但不能默认安全。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_downstream_runtime_state | 下游内部状态、执行进度、安装结果或 UI 状态不得进入 policy。 |
| no_sync_wait_all_downstreams | 不要求同步等待所有下游完成。 |
| no_recovery_algorithm | 恢复任务、重试、报告和告警留给后续 Step。 |
| policy_not_trace_body | policy 只判断保护边界,变化解释由 trace / audit 对象承接。 |

### 6. 对象卡片: `RelationIntegrityRule`

```rust
pub struct RelationIntegrityRule;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 关系与分发语义 |
| 对象类型 | domain policy / invariant |
| 结构责任 | 判断方法资产关系端点、正式化状态、分发语义和外部边界是否满足完整性要求。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B6;Step 5 关系与分发语义 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `rule_ref` | `RelationIntegrityRuleRef` | domain 创建的关系完整性规则引用。 |
| `relation_ref` | `MethodAssetRelationRef` | 被判断的方法资产关系引用。 |
| `source_definition_ref` | `MethodAssetDefinitionRef` | 关系源端定义锚点。 |
| `target_definition_ref` | `MethodAssetDefinitionRef` | 关系目标端定义锚点。 |
| `formalization_requirement` | `RelationFormalizationRequirement` | 对关系端点正式化状态的要求。 |
| `distribution_boundary_ref` | `Option<MethodAssetDistributionRef>` | 分发语义边界引用。 |
| `violation_reason_ref` | `Option<RelationIntegrityViolationRef>` | 完整性违规原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_endpoint_exists(definition_ref)` | 校验关系端点指向已成立的方法资产定义。 |
| `assert_endpoint_formalization(definition_ref)` | 校验端点满足关系所需正式化边界。 |
| `assert_distribution_boundary(distribution_ref)` | 校验分发语义没有越过 marketplace 或 artifact 正文边界。 |
| `reject_runtime_dependency(relation_candidate_ref)` | 拒绝把运行依赖图、推荐图或安装关系写成定义性关系。 |

| 工厂边界 | 作用 |
|---|---|
| `for_relation(relation_ref)` | 为指定方法资产关系建立完整性规则上下文。 |
| `violated(relation_ref, violation_ref)` | 从违规线索建立完整性失败口径。 |
| `for_definition_pair(source_ref, target_ref, requirement)` | 为定义端点对建立关系判断上下文。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_recommendation_algorithm | 推荐、相似度、排序和搜索权重不是定义性关系 truth。 |
| no_runtime_dependency_graph | runtime/process/identity 的运行依赖不得写成本仓关系。 |
| no_marketplace_fulfillment | listing、购买、安装、交付和结算不属于关系完整性。 |
| no_external_body | 关系依据只能以 summary/ref/lineage 承接,不得保存正文。 |

### 7. 对象卡片: `ExternalBodyBoundaryRule`

```rust
pub struct ExternalBodyBoundaryRule;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 外部摘要与引用 |
| 对象类型 | domain guard / boundary |
| 结构责任 | 统一禁止外部正文、artifact/archive 正文、证据正文和 marketplace 正文进入本仓 truth、summary、trace 或外围组织对象。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B3;Step 5 外部摘要与引用 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `rule_ref` | `ExternalBodyBoundaryRuleRef` | domain 创建的外部正文边界规则引用。 |
| `external_source_ref` | `Option<ExternalSourceRef>` | 被检查的外部来源引用。 |
| `artifact_archive_ref` | `Option<ArtifactArchiveRef>` | 被检查的 artifact / archive 引用。 |
| `forbidden_body_kind_set` | `ForbiddenExternalBodyKindSet` | 明确禁止进入本仓的正文类别。 |
| `allowed_summary_kind_set` | `ExternalSummaryKindSet` | 允许保留的摘要、marker、lineage 或 typed ref 类别。 |
| `boundary_reason_ref` | `ExternalBodyBoundaryReasonRef` | 正文被拒绝或摘要被接受的原因引用。 |
| `lineage_marker_ref` | `Option<MethodAssetEvidenceLineageRef>` | 需要追溯时的 body-free lineage 线索。 |

| 成员能力 | 作用 |
|---|---|
| `assert_summary_body_free(summary_ref)` | 校验外部来源摘要不携带正文。 |
| `assert_basis_body_free(basis_summary_ref)` | 校验正式化依据摘要不携带治理、标准或 artifact 正文。 |
| `reject_external_body(body_candidate_ref)` | 拒绝外部正文、archive 包体、证据文件正文或 payload 入仓。 |
| `allow_lineage_ref(lineage_ref)` | 允许 body-free lineage 作为追溯线索。 |

| 工厂边界 | 作用 |
|---|---|
| `default_no_body_rule(rule_ref)` | 建立本仓默认外部正文禁止规则。 |
| `from_rejected_body(body_candidate_ref, reason_ref)` | 从正文越界候选建立拒绝口径。 |
| `summary_allowed(external_source_ref, reason_ref)` | 表达只允许 summary/ref/marker 入仓。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_external_body | 标准全文、ADR 正文、artifact 正文、archive 包和证据文件正文不得进入本仓。 |
| no_external_api_payload | resolver 响应、文件下载结果、对象存储内容和二进制包不属于本对象。 |
| no_external_truth_ownership | 外部系统仍拥有外部正文和生命周期。 |
| no_marketplace_listing_body | listing 正文、交易、安装和履约材料不得通过本规则进入方法库 truth。 |

### 8. 对象卡片: `PackageCompositionRule`

```rust
pub struct PackageCompositionRule;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `domain` |
| 所属 capability | 外围包与方法集组织 |
| 对象类型 | domain policy / invariant |
| 结构责任 | 约束 package / method set 只能围绕已成立或允许引用的方法资产组织,防止外围组织反写核心 truth 或扩大消费授权。 |
| 来源回指 | `02-概要设计.md` §5.4 / §6;`02_hld_step_06_key_objects_policies_guards.md` B7;Step 5 外围包与方法集组织 owner。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `rule_ref` | `PackageCompositionRuleRef` | domain 创建的包组成规则引用。 |
| `package_ref` | `Option<MethodPackageRef>` | 被判断的方法资产包引用。 |
| `assembly_ref` | `Option<MethodSetAssemblyRef>` | 被判断的方法集组装引用。 |
| `member_definition_refs` | `MethodAssetDefinitionRefSet` | package / method set 成员定义引用集合。 |
| `allowed_distribution_refs` | `MethodAssetDistributionRefSet` | 允许进入外围组织的分发语义引用集合。 |
| `marketplace_context_ref` | `Option<MarketplaceContextRef>` | 生态发现语境引用,不承接交易履约。 |
| `peripheral_reason_ref` | `PackageCompositionReasonRef` | 组成规则成立或拒绝的安全原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_members_defined(member_definition_refs)` | 校验成员均来自已成立的方法资产定义。 |
| `assert_distribution_allowed(distribution_ref)` | 校验分发语义允许进入外围组织。 |
| `reject_core_truth_writeback(package_ref)` | 拒绝 package / method set 反写定义、版本或消费边界。 |
| `assert_not_core_prerequisite(package_ref)` | 校验外围组织不可成为核心闭环成立前置。 |

| 工厂边界 | 作用 |
|---|---|
| `for_package(package_ref)` | 为方法资产包建立 composition rule 上下文。 |
| `for_method_set(assembly_ref)` | 为方法集组装建立 composition rule 上下文。 |
| `rejected_peripheral(member_refs, reason_ref)` | 表达外围组成被拒绝但不影响核心 truth。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| peripheral_only | package / method set 不可成为核心闭环成立前置。 |
| no_package_body | package 文件、archive、artifact 内容和导出包体不属于本对象。 |
| no_marketplace_transaction | listing、价格、订单、购买、安装和履约属于 `L6-marketplace`。 |
| no_authorization_expansion | 外围组织不能绕过 `DownstreamConsumptionBoundary` 或正式版本要求。 |

### 9. 状态主语预筛

| 状态主语候选 | 当前对象 / 对象组 | Step 10 承接 | 禁止事项 |
|---|---|---|---|
| 正式化状态 | `FormalizationState` | 作为 primary state owner 展开正式化状态矩阵。 | 不恢复 draft / review / publish lifecycle。 |
| 消费材料可用性 | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary` | 预筛 material ready / unavailable / boundary constrained。 | 不承接下游运行成功、安装或 UI 状态。 |
| Definition vs Use judgement | `DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary` | 可形成 guard passed / rejected / violation marker 的状态输入。 | 不写权限矩阵或鉴权状态。 |
| 一致性保护 judgement | `ConsistencyProtectionPolicy`;`ConsumptionImpactSummary` | 可形成 protected / unknown impact / constrained 等状态输入。 | 不写恢复算法、告警状态或下游同步等待。 |
| 关系完整性 | `MethodAssetRelation`;`RelationIntegrityRule` | 可形成 relation active / constrained / violated / superseded 的状态输入。 | 不表达运行依赖图、推荐图或 marketplace 履约。 |
| 外部摘要接受边界 | `ExternalSourceSummary`;`ExternalBodyBoundaryRule` | 可形成 summary accepted / body rejected / unavailable 的状态输入。 | 不保存外部正文或 provider payload。 |
| 外围 composition | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule` | 可形成 peripheral available / partial / rejected 的状态输入。 | 不阻塞 core truth,不扩大消费授权。 |
| trace / audit / lineage support | `MethodAssetTraceMaterial`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | 可形成 freshness、partiality、lineage availability 的状态输入。 | 不保存 raw log、report body 或外部证据正文。 |

说明:本表只是 Step 10 的状态主语输入,不是状态迁移矩阵。状态枚举、事件触发、迁移条件、terminal 状态和异常恢复口径仍由 Step 10 / Step 12 闭口。

### 10. 后续 Step 承接

| 后续 Step | 必须承接的内容 | 暂停条件 |
|---|---|---|
| Step 7 | policy / guard 需要 repository、resolver 或 service port 时,必须回指这些对象和 typed ref 来源。 | port 需要下游运行 truth、外部正文、marketplace 履约或权限矩阵。 |
| Step 8 | protocol shell 只能暴露 safe result、marker、ref 和 summary。 | DTO 复制 policy engine、外部正文、请求正文或配置矩阵。 |
| Step 9 | flow 必须调用对象成员能力或工厂边界,不能现场拼 policy judgement。 | flow 从字符串、route、payload 或私有 map 生成 guard/result。 |
| Step 10 | 状态矩阵必须以本模块预筛表为主语来源。 | 状态没有 owner,或用 public marker 替代 state owner。 |
| Step 11 | persistence 只能保存 typed ref、safe summary、状态和 policy result。 | DB key、path、topic、hash 或 external id 替代 typed ref。 |
| Step 14 | 规则可配置时必须明确 config owner 和不可配置边界。 | 把 eligibility、body-free、Definition vs Use 基础红线配置成可绕过。 |
| Step 16 | 测试必须覆盖 no downstream truth、no external body、no implicit formalization、peripheral no core impact。 | 无测试证明 policy/guard 不越界。 |

### 11. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入七个 policy / guard / boundary 对象卡片 | 是。 |
| 是否写入字段骨架和字段来源 | 是。 |
| 是否写入成员能力、工厂边界、不变量 / 禁止事项 | 是。 |
| 是否写入状态主语预筛 | 是:只作为 Step 10 输入。 |
| 是否写完整状态迁移矩阵 | 否。 |
| 是否写 function flow、repository、adapter 或 persistence schema | 否。 |
| 是否写 DTO schema、event payload 或 job payload | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.15` 思考或 Step 7 | 否。 |

R6.14 historical_next_allowed_action: 等待用户确认后进入 Step 6 `R6.15 application helper / orchestration support object:先思考`;只允许思考 operation context、idempotency、stored result、visibility / degraded、job assembly helper 候选和 `R6.16` 写入边界;不得写 application helper 对象卡片正文、function flow、repository、adapter、DTO schema、event payload、job payload、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.16`、Step 7 或后续 Step。该动作已由 `R6.15` 完成,当前 next_allowed_action 以后文 `R6.15` 当前门禁为准。

---

## R6.15 application helper / orchestration support object:先思考

### 1. 思考记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.15 application helper / orchestration support object:先思考`。 |
| 本模块目标 | 筛选只服务 application 编排的 helper / support object,为 `R6.16` 写对象卡片定边界。 |
| 当前状态 | completed |
| 写入范围 | 只写入本 Step 6 中间产物中的思考、候选、风险和下一写入边界。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不写 helper 对象卡片正文,不写 port trait、repository、adapter、DTO、flow、persistence、config 或 test。 |

### 2. 输入基线

| 输入 | 本模块读取方式 | 结论 |
|---|---|---|
| `02-概要设计.md` §7 / §10 / §11 | 读取 Command、Query、Inbound、Outbound、Operations Job 的输入输出骨架和异常降级口径。 | application 需要承接 operation context、idempotency、safe degraded/unavailable、job assembly 的内部 helper。 |
| `03_ddd_step_05_module_contracts.md` | 读取 `application` 模块职责和依赖边界。 | application 只依赖 `contracts` / `domain`,承载 orchestration、UoW、idempotency、query no-write、consumer/job coordination。 |
| 已完成 `R6.8` / `R6.10` / `R6.12` / `R6.14` | 读取 contracts shell、domain truth/support/policy 对象。 | application helper 只能组织这些对象,不能成为第二 truth。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | 读取 maintenance task / recovery / progress 边界。 | application 可以有 job assembly / coordination helper,但 task truth、runner、scheduler、queue 后移。 |

### 3. 候选分组

| 分组 | 候选对象 | 判断 |
|---|---|---|
| operation context | `MethodAssetOperationContext` | 进入 `R6.16`;承载 actor/metadata/correlation/safe execution context,不等于 DTO。 |
| idempotency / replay | `MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult` | 进入 `R6.16`;支撑 command/consumer/job duplicate 判断和 stored result replay。 |
| query read decision | `MethodAssetReadDecision`;`MethodAssetDegradedDecision` | 进入 `R6.16`;支撑 query no-write、safe absence、degraded/unavailable branch。 |
| inbound / outbound coordination | `MethodAssetInboundIntakeDecision`;`MethodAssetEventCandidateAssembly` | 进入 `R6.16`;支撑 body-free intake 和 body-free event candidate assembly。 |
| job orchestration | `MethodAssetJobAssemblyContext` | 进入 `R6.16`;支撑 maintenance task refs、scope、batch/page 和 safe result assembly。 |
| 明确不进入本组 | port trait、UoW trait、repository、adapter state、handler、runner、DTO、event payload、task truth。 | 分别后移 Step 7 / Step 8 / R6.17~R6.20。 |

### 4. 候选对象裁决

| 对象 | `R6.16` 裁决 | 责任边界 | 不得混入 |
|---|---|---|---|
| `MethodAssetOperationContext` | 写入 | 承载 application 内部统一操作语境,连接 actor、metadata、trace/correlation、source kind 和 safe clock/id refs。 | transport request、auth 实现、config loader、raw headers。 |
| `MethodAssetIdempotencyGuard` | 写入 | 表达 operation key、dedup scope、duplicate / conflict / replay 判断输入。 | durable store schema、lock、retry、bus dedup 实现。 |
| `MethodAssetStoredOperationResult` | 写入 | 表达 accepted/rejected/ignored 结果的可重放安全摘要。 | full DTO body、external payload、raw error、DB row schema。 |
| `MethodAssetReadDecision` | 写入 | 表达 query no-write、read source availability、visibility/boundary result 的 application 判断壳。 | repository trait、query DTO、domain policy 算法。 |
| `MethodAssetDegradedDecision` | 写入 | 表达 degraded/unavailable/partial/not-visible 的 safe branch 汇总。 | raw exception、provider response、stack trace、下游运行状态。 |
| `MethodAssetInboundIntakeDecision` | 写入 | 表达 inbound body-free envelope 的 accepted / ignored / rejected 编排结果。 | consumer runner、transport binding、topic、raw webhook body。 |
| `MethodAssetEventCandidateAssembly` | 写入 | 表达 outbound event candidate 由对象 ref / marker / summary 组装的安全边界。 | outbox relay、topic payload、delivery state、subscriber guarantee。 |
| `MethodAssetJobAssemblyContext` | 写入 | 表达 operations job 对 maintenance run / task refs / scopes / safe result 的组装上下文。 | job runner、scheduler、queue、retry、worker state。 |

### 5. 字段来源风险预分析

| 对象 | 高风险字段来源 | `R6.16` 必须写清 |
|---|---|---|
| `MethodAssetOperationContext` | actor、metadata、source kind、clock/id、correlation。 | 来源只能来自 entry-injected metadata、system id/time、typed refs;不得读取 transport raw header。 |
| `MethodAssetIdempotencyGuard` | idempotency key、operation digest、dedup scope、stored result ref。 | key/digest 只能来自 formal metadata 和 canonical safe material;不得拼接 request body。 |
| `MethodAssetStoredOperationResult` | accepted/rejected result summary、effect/ref、safe reason。 | 只能存可重放 safe summary,不保存 DTO body、external payload 或 raw error。 |
| `MethodAssetReadDecision` | read subject、visibility/boundary result、material availability。 | query no-write 必须显式,不能为补材料而写 truth。 |
| `MethodAssetDegradedDecision` | degraded kind、unavailable reason、partial marker、safe diagnostic。 | 必须复制正式 marker/summary,不能合成 raw degraded string。 |
| `MethodAssetInboundIntakeDecision` | source envelope summary、source event id、dedup key、body-free marker。 | inbound 只能承接 body-free fact,不能保存 raw event payload。 |
| `MethodAssetEventCandidateAssembly` | event family、subject refs、safe summary refs、candidate reason。 | 只能形成 candidate,不能表达 delivery success、topic 或 outbox state。 |
| `MethodAssetJobAssemblyContext` | maintenance run ref、refresh scope、task refs、batch/page cursor、safe report refs。 | job 不修 core truth,不复制 external body,不保存 scheduler/queue state。 |

### 6. 排除和后移

| 项目 | 处理 |
|---|---|
| port trait / UoW trait / repository trait | 后移 Step 7。`R6.16` 只写 helper object,不写方法签名。 |
| command/query/consumer/job DTO schema | 后移 Step 8。helper 不替代 public protocol。 |
| function flow / transaction order | 后移 Step 9 / Step 11。 |
| idempotency durable store、lock、retry、duplicate replay flow | 后移 Step 11 / Step 13。 |
| degraded / unavailable public error schema | 后移 Step 12。 |
| entry handler、consumer runner、job runner | 后移 `R6.19` / `R6.20` 和 Step 8 / Step 9。 |
| infra adapter availability、runtime config、source binding | 后移 `R6.17` / `R6.18`。 |
| maintenance task truth | 不在本组写成 application helper;只能被 job assembly context 引用。 |

### 7. `R6.16` 写入分组和边界

`R6.16` 可以按三个小批次写入,但仍属于同一模块:

| 小批次 | 写入内容 | 边界 |
|---|---|---|
| operation / replay helpers | `MethodAssetOperationContext`;`MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult` | 写 application helper 对象卡片、字段来源、成员能力和禁止事项。 |
| read / degraded helpers | `MethodAssetReadDecision`;`MethodAssetDegradedDecision` | 写 query no-write、safe absence、degraded/unavailable 的 helper 边界。 |
| consumer / event / job helpers | `MethodAssetInboundIntakeDecision`;`MethodAssetEventCandidateAssembly`;`MethodAssetJobAssemblyContext` | 写 body-free intake、event candidate assembly 和 job assembly context。 |

`R6.16` 不得写入:

- Step 7 port trait、repository、adapter 或 UoW 方法签名。
- Step 8 DTO / event / job payload schema。
- Step 9 function flow。
- Step 10 状态迁移矩阵。
- Step 11 persistence schema。
- Step 12 public error schema。
- Step 13 idempotency replay flow。
- Step 14 config key。
- Step 16 test case schema。
- 正式 `03-详细设计.md`。
- `R6.17` 或后续模块。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只做先思考 | 是。 |
| 是否裁决 `R6.16` 写入对象 | 是:八个 application helper / support object。 |
| 是否写 helper 对象卡片正文 | 否。 |
| 是否写 port trait、DTO、flow、persistence、config 或 test schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.16` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.16 application helper / orchestration support object:再写入`;只允许写入 `MethodAssetOperationContext`、`MethodAssetIdempotencyGuard`、`MethodAssetStoredOperationResult`、`MethodAssetReadDecision`、`MethodAssetDegradedDecision`、`MethodAssetInboundIntakeDecision`、`MethodAssetEventCandidateAssembly`、`MethodAssetJobAssemblyContext` 对象卡片;不得写 port trait、repository、adapter、DTO schema、event payload、job payload、function flow、完整状态迁移矩阵、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.17`、Step 7 或后续 Step。

---

## R6.16 application helper / orchestration support object:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.16 application helper / orchestration support object:再写入`。 |
| 本模块目标 | 将 `R6.15` 已裁决的 application helper 候选写成对象卡片,为 Step 7~13 的 port、protocol、flow、persistence 和 idempotency replay 提供对象回指。 |
| 当前状态 | completed |
| 写入范围 | 只写入 application helper / orchestration support object 的对象身份、字段骨架、字段来源、成员能力、工厂边界和不变量 / 禁止事项。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不写 port trait、repository、adapter、DTO schema、event payload、job payload、function flow、完整状态迁移矩阵、persistence schema、config key 或 test case schema。 |

### 2. 本组对象边界

| 对象组 | 写入对象 | 作用 | 禁止事项 |
|---|---|---|---|
| operation / replay helpers | `MethodAssetOperationContext`;`MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult` | 支撑 command / consumer / job 的 operation context、dedup 判断和 safe replay result。 | 不定义 durable store、lock、retry、port 方法或 public DTO。 |
| read / degraded helpers | `MethodAssetReadDecision`;`MethodAssetDegradedDecision` | 支撑 Query no-write、safe absence、not visible、degraded / unavailable 的 application 判断壳。 | 不创建 view/material,不刷新 truth,不合成 public marker。 |
| consumer / event / job helpers | `MethodAssetInboundIntakeDecision`;`MethodAssetEventCandidateAssembly`;`MethodAssetJobAssemblyContext` | 支撑 body-free inbound intake、outbound event candidate 组装和 operations job result assembly。 | 不定义 topic、outbox、delivery、scheduler、queue、worker state 或 raw payload。 |

### 3. 对象卡片: `MethodAssetOperationContext`

```rust
pub struct MethodAssetOperationContext;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | command / query / inbound / job orchestration shared context |
| 对象类型 | application helper / operation context |
| 结构责任 | 在 application service 内统一承载 actor、metadata、source kind、correlation、safe clock/id 和 boundary marker,避免 handler、consumer 或 job runner 直接把 transport raw context 传入 domain。 |
| 来源回指 | `02-概要设计.md` §7.2 / §8.2.1 / §11;`03_ddd_step_05_module_contracts.md` application owner;`R6.15` operation context 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `operation_context_ref` | `MethodAssetOperationContextRef` | application 创建的本次操作语境引用。 |
| `actor_context_ref` | `ActorContextRef` | entry-injected actor context;不得从 raw auth header 直接拼接。 |
| `command_metadata_ref` | `Option<CommandMetadataRef>` | command / consumer / job 注入的安全 metadata 引用。 |
| `operation_source_kind` | `MethodAssetOperationSourceKind` | 同步 command、query、inbound consumer 或 operations job 的来源类别。 |
| `correlation_ref` | `MethodAssetCorrelationRef` | entry / runner 注入的 correlation typed ref。 |
| `request_boundary_ref` | `MethodAssetRequestBoundaryRef` | 当前入口或 runner 的 body-free boundary 引用。 |
| `safe_clock_ref` | `MethodAssetSafeClockRef` | system clock adapter 注入的安全时间引用;具体 adapter 后移 Step 7 / R6.17。 |
| `safe_id_scope_ref` | `MethodAssetSafeIdScopeRef` | system id generator 或 request-scoped id scope 注入的 typed ref。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free_context()` | 校验 operation context 不携带 raw payload、raw header、provider body 或 archive body。 |
| `assert_source_allowed(operation_source_kind)` | 校验当前 service 允许从该 entry / runner 来源进入。 |
| `derive_trace_subject_ref(subject_ref)` | 只从 typed subject ref 派生 trace subject 引用,不得解析字符串。 |
| `as_safe_metadata_summary()` | 输出 body-free metadata summary,供 audit / lineage / stored result 使用。 |

| 工厂边界 | 作用 |
|---|---|
| `for_command(actor_context_ref, command_metadata_ref)` | 为同步 Command 写路径建立操作语境。 |
| `for_query(actor_context_ref, command_metadata_ref)` | 为 Query 只读路径建立操作语境。 |
| `for_inbound(source_summary_ref, command_metadata_ref)` | 为 inbound body-free intake 建立操作语境。 |
| `for_job(maintenance_run_ref, command_metadata_ref)` | 为 operations job 建立操作语境。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_raw_transport_context | 不保存 raw header、cookie、token、HTTP request、broker envelope 或 cron expression。 |
| no_auth_implementation | 不实现鉴权、认证、权限矩阵或 gateway policy。 |
| no_config_loader | 不读取配置文件、secret、env 或 runtime profile。 |
| no_domain_decision | 不替代 domain policy / guard 判断,只承接已注入 context。 |

### 4. 对象卡片: `MethodAssetIdempotencyGuard`

```rust
pub struct MethodAssetIdempotencyGuard;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | command / inbound / job idempotency coordination |
| 对象类型 | application helper / idempotency guard |
| 结构责任 | 表达幂等 key、operation digest、dedup scope、stored result ref 和 duplicate / conflict / fresh 判断输入,为 Step 13 replay 规则提供对象主语。 |
| 来源回指 | `02-概要设计.md` §7.2 / §8.2.1 / §10 / §11;`03_ddd_step_05_module_contracts.md` application idempotency owner;`R6.15` idempotency 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `guard_ref` | `MethodAssetIdempotencyGuardRef` | application 创建的幂等判断上下文引用。 |
| `operation_context_ref` | `MethodAssetOperationContextRef` | 当前 operation context。 |
| `idempotency_key_ref` | `MethodAssetIdempotencyKeyRef` | CommandMetadata、inbound source event id + dedup key 或 job task key 的 typed ref。 |
| `operation_digest_ref` | `MethodAssetOperationDigestRef` | canonical safe material 生成的操作摘要引用;不包含 raw body。 |
| `dedup_scope_ref` | `MethodAssetDedupScopeRef` | operation family、subject ref、source kind 和 boundary scope 的 typed ref。 |
| `expected_subject_ref` | `Option<MethodAssetOperationSubjectRef>` | 预期业务主语 typed ref,用于区分 duplicate 与 conflict。 |
| `stored_result_ref` | `Option<MethodAssetStoredOperationResultRef>` | 已存在的 safe stored result 引用。 |
| `decision_kind` | `MethodAssetIdempotencyDecisionKind` | fresh / duplicate_replay / conflict / rejected 的 application 判断类别。 |

| 成员能力 | 作用 |
|---|---|
| `assert_digest_matches(operation_digest_ref)` | 校验同一 key 下的 canonical safe digest 一致。 |
| `decide_fresh()` | 表达可继续执行本次 operation。 |
| `decide_duplicate_replay(stored_result_ref)` | 表达应回放已有 safe stored result。 |
| `decide_conflict(conflict_reason_ref)` | 表达同 key 不同 subject / digest / scope 的冲突拒绝。 |

| 工厂边界 | 作用 |
|---|---|
| `from_command_context(operation_context_ref, idempotency_key_ref)` | 为 Command 建立幂等 guard。 |
| `from_inbound_context(operation_context_ref, source_event_ref, dedup_key_ref)` | 为 inbound intake 建立幂等 guard。 |
| `from_job_context(operation_context_ref, task_ref, cursor_ref)` | 为 Operations Job 建立幂等 guard。 |
| `with_stored_result(guard_ref, stored_result_ref)` | 将已存在 safe result 纳入 duplicate 判断。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_raw_body_digest | digest 输入只能是 canonical safe material,不得包含 raw request body、provider payload 或 archive content。 |
| no_store_schema | 不定义幂等表、lock、transaction、TTL、retry 或 durable adapter。 |
| no_public_response_body | 不保存 public DTO body 或 raw error body。 |
| no_cross_component_write | 幂等 guard 不授权写非当前 component truth。 |

### 5. 对象卡片: `MethodAssetStoredOperationResult`

```rust
pub struct MethodAssetStoredOperationResult;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | safe operation replay result |
| 对象类型 | application support object / replay summary |
| 结构责任 | 保存可重放的 accepted / rejected / ignored 安全结果摘要,支撑 duplicate replay 和后续 audit / event candidate / maintenance hint 承接。 |
| 来源回指 | `02-概要设计.md` §8.2.1 / §10 / §11;`03_ddd_step_05_module_contracts.md` idempotency 与 application error owner;`R6.15` stored result 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `stored_result_ref` | `MethodAssetStoredOperationResultRef` | application 创建或 idempotency store 返回的 safe result 引用。 |
| `operation_context_ref` | `MethodAssetOperationContextRef` | 产生结果的 operation context。 |
| `operation_digest_ref` | `MethodAssetOperationDigestRef` | 与幂等判断一致的 canonical safe digest。 |
| `result_kind` | `MethodAssetStoredOperationResultKind` | accepted / rejected / ignored / conflict 的结果类别。 |
| `accepted_summary_ref` | `Option<MethodAssetAcceptedOperationSummaryRef>` | accepted branch 的 body-free 结果摘要。 |
| `rejected_reason_ref` | `Option<MethodAssetSafeRejectReasonRef>` | rejected branch 的安全拒绝原因引用。 |
| `ignored_reason_ref` | `Option<MethodAssetSafeIgnoreReasonRef>` | ignored / duplicate ignored branch 的安全原因引用。 |
| `effect_summary_refs` | `MethodAssetEffectSummaryRefSet` | history、lineage、event candidate、maintenance hint 等 body-free effect summary refs。 |
| `replay_marker_ref` | `MethodAssetReplayMarkerRef` | 标记该结果可被 duplicate replay 复制。 |

| 成员能力 | 作用 |
|---|---|
| `assert_replay_safe()` | 校验 stored result 不包含 raw DTO、raw error、external body 或 implementation payload。 |
| `as_duplicate_replay_result()` | 输出 duplicate branch 可复制的 safe result 壳。 |
| `append_effect_summary(effect_summary_ref)` | 只追加 body-free effect summary ref。 |
| `reject_raw_result_body(result_body_ref)` | 拒绝把 public DTO body 或 provider payload 放入 stored result。 |

| 工厂边界 | 作用 |
|---|---|
| `accepted(operation_context_ref, accepted_summary_ref)` | 从 accepted summary 建立可重放结果。 |
| `rejected(operation_context_ref, rejected_reason_ref)` | 从 safe reject reason 建立可重放拒绝结果。 |
| `ignored(operation_context_ref, ignored_reason_ref)` | 从 safe ignore reason 建立 ignored 结果。 |
| `conflict(operation_context_ref, conflict_reason_ref)` | 从幂等冲突建立拒绝结果。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| replay_body_free | 回放材料只能是 safe summary / marker / typed ref。 |
| no_dto_snapshot | 不保存 CommandResult / QueryResult / event payload / job output 的完整 public DTO body。 |
| no_raw_error | 不保存 stack trace、raw exception、provider error body 或 adapter response。 |
| no_delivery_state | 不表达 event delivery success、outbox row、retry 或 dead letter。 |

### 6. 对象卡片: `MethodAssetReadDecision`

```rust
pub struct MethodAssetReadDecision;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | query no-write / read decision |
| 对象类型 | application helper / read decision |
| 结构责任 | 表达 Query 读取面在 found / absent / not visible / stale / unavailable 之间的 application 判断壳,确保 Query 不写 truth、不刷新 material、不现场修复边界。 |
| 来源回指 | `02-概要设计.md` §7.3 / §8.2.2 / §10.3;`03_ddd_step_05_module_contracts.md` Query only-read owner;`R6.15` read decision 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `read_decision_ref` | `MethodAssetReadDecisionRef` | application query service 创建的读取判断引用。 |
| `operation_context_ref` | `MethodAssetOperationContextRef` | Query operation context。 |
| `query_family_kind` | `MethodAssetQueryFamilyKind` | definition、formalization、consumption、trace、relation、external、maintenance、peripheral 的读取族。 |
| `read_subject_ref` | `MethodAssetReadSubjectRef` | selector 中的 typed business subject 或 loaded view/material subject。 |
| `selector_ref` | `MethodAssetQuerySelectorRef` | body-free typed selector ref;完整 protocol 后移 Step 8。 |
| `read_source_ref` | `Option<MethodAssetReadSourceRef>` | truth、view、material、diagnostic、history、lineage 或 progress 的读取来源引用。 |
| `visibility_marker_ref` | `Option<MethodAssetVisibilityMarkerRef>` | domain boundary / policy 输出的可读性 marker。 |
| `material_freshness_ref` | `Option<MethodAssetMaterialFreshnessRef>` | loaded material / view 提供的 freshness marker。 |
| `disposition_kind` | `MethodAssetReadDispositionKind` | found / safe_absent / not_visible / stale_visible / degraded / unavailable。 |
| `safe_absence_reason_ref` | `Option<MethodAssetSafeAbsenceReasonRef>` | absent / not found 分支的安全原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_query_no_write()` | 校验该 read decision 不触发 truth 写入、view 刷新、job 启动或 repair。 |
| `decide_found(read_source_ref)` | 表达已读取到 safe source。 |
| `decide_safe_absent(reason_ref)` | 表达可公开的安全缺失。 |
| `decide_not_visible(visibility_marker_ref)` | 表达不可见或 context-limited 分支。 |
| `to_degraded(degraded_decision_ref)` | 将 stale / unavailable / partial 分支交给 degraded decision。 |

| 工厂边界 | 作用 |
|---|---|
| `for_query(operation_context_ref, query_family_kind, selector_ref)` | 为 Query 建立读取判断上下文。 |
| `from_loaded_source(read_source_ref, visibility_marker_ref)` | 从已加载 safe source 建立 found 判断。 |
| `safe_absent(selector_ref, reason_ref)` | 从 typed selector 和 safe reason 建立安全缺失判断。 |
| `blocked_by_boundary(selector_ref, marker_ref)` | 从正式 boundary marker 建立 not visible 判断。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| query_no_write | Query 不创建、刷新、修复或删除 truth / view / material。 |
| no_private_lookup | 不从字符串、route、raw id 或私有 map 反推 subject / visibility。 |
| no_marker_synthesis | 不合成 visibility / freshness / degraded marker,只能复制正式来源。 |
| no_external_body | 查询分支不得读取或返回外部正文、archive body 或 provider payload。 |

### 7. 对象卡片: `MethodAssetDegradedDecision`

```rust
pub struct MethodAssetDegradedDecision;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | degraded / unavailable / partial safe branch |
| 对象类型 | application helper / degraded decision |
| 结构责任 | 汇总 stale、unavailable、partial、not visible、context-limited 或 degraded 分支的 safe marker、safe diagnostic 和 follow-up hint,避免 application 现场拼接错误和降级结果。 |
| 来源回指 | `02-概要设计.md` §10.3 / §11;`03_ddd_step_05_module_contracts.md` application error owner;`R6.15` degraded decision 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `degraded_decision_ref` | `MethodAssetDegradedDecisionRef` | application 创建的降级判断引用。 |
| `read_decision_ref` | `Option<MethodAssetReadDecisionRef>` | 来源 read decision;非 Query branch 可为空。 |
| `degraded_kind` | `MethodAssetDegradedKind` | stale / unavailable / partial / context_limited / not_visible / invalid_safe_material。 |
| `degraded_marker_ref` | `MethodAssetDegradedMarkerRef` | 正式 policy、resolver、material 或 adapter summary 输出的 marker。 |
| `unavailable_reason_ref` | `Option<MethodAssetUnavailableReasonRef>` | unavailable 分支的 safe reason。 |
| `partiality_marker_ref` | `Option<MethodAssetPartialityMarkerRef>` | partial material / page / trace / audit / job result 的安全 marker。 |
| `safe_diagnostic_ref` | `MethodAssetSafeDiagnosticRef` | 可公开的安全诊断引用。 |
| `follow_up_hint_ref` | `Option<MethodAssetFollowUpHintRef>` | refresh / retry / formal intervention / maintenance request 的提示引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_safe_diagnostic()` | 校验 diagnostic 不含 raw exception、provider payload、stack trace 或 secret。 |
| `mark_unavailable(reason_ref)` | 表达资源不可用但不反写 truth。 |
| `mark_partial(partiality_marker_ref)` | 表达只读材料部分可用。 |
| `mark_stale(freshness_ref)` | 表达 stale-visible 或 stale-degraded 的读取面结果。 |
| `with_follow_up_hint(hint_ref)` | 附加后续维护提示,不直接启动 job。 |

| 工厂边界 | 作用 |
|---|---|
| `from_visibility_marker(marker_ref)` | 从正式 visibility / boundary marker 建立不可见或受限判断。 |
| `from_material_marker(marker_ref)` | 从 view/material/projection marker 建立 degraded 判断。 |
| `from_adapter_unavailable(reason_ref, marker_ref)` | 从 adapter availability summary 建立 unavailable 判断。 |
| `partial(read_decision_ref, partiality_marker_ref)` | 从读取判断和 partial marker 建立 partial 结果。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| marker_must_be_formal | degraded marker 必须来自正式对象、resolver、policy 或 adapter summary。 |
| no_raw_exception | 不保存 raw exception、stack trace、provider error body 或 debug dump。 |
| no_silent_success | degraded / unavailable 不得伪装为 accepted success。 |
| no_automatic_repair | 降级判断不启动 repair、refresh、job、retry 或 write transaction。 |

### 8. 对象卡片: `MethodAssetInboundIntakeDecision`

```rust
pub struct MethodAssetInboundIntakeDecision;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | inbound body-free intake |
| 对象类型 | application helper / inbound intake decision |
| 结构责任 | 将 inbound consumer 的 source envelope summary、schema/version、source event id、dedup key 和 body-free marker 裁成 accepted / ignored / rejected / handoff hint 的安全 intake 结果。 |
| 来源回指 | `02-概要设计.md` §7.4 / §8.2.3 / §10.4;`03_ddd_step_05_module_contracts.md` 外部摘要与引用 inbound owner;`R6.15` inbound intake 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `intake_decision_ref` | `MethodAssetInboundIntakeDecisionRef` | application consumer service 创建的 intake 判断引用。 |
| `operation_context_ref` | `MethodAssetOperationContextRef` | inbound operation context。 |
| `inbound_source_ref` | `ExternalSourceRef` | 已登记或允许的外部来源 typed ref。 |
| `source_event_ref` | `ExternalSourceEventRef` | source event id 的 typed ref;不保存 raw envelope。 |
| `schema_version_ref` | `MethodAssetInboundSchemaVersionRef` | inbound safe schema/version 引用。 |
| `dedup_key_ref` | `MethodAssetIdempotencyKeyRef` | inbound dedup key typed ref。 |
| `body_free_marker_ref` | `ExternalBodyFreeMarkerRef` | 校验 inbound material 不含正文的 marker。 |
| `intake_disposition_kind` | `MethodAssetInboundIntakeDispositionKind` | accepted / ignored / rejected / handoff_required。 |
| `safe_reason_ref` | `Option<MethodAssetSafeReasonRef>` | ignored / rejected / handoff 的安全原因引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free_envelope()` | 校验 envelope summary 只含 summary/ref/digest/marker/safe reason。 |
| `assert_schema_version(schema_version_ref)` | 校验 inbound safe schema/version 可识别。 |
| `accept_summary(summary_ref)` | 接受 body-free external summary。 |
| `ignore_duplicate(stored_result_ref)` | 表达 duplicate inbound 已安全处理。 |
| `reject_raw_payload(reason_ref)` | 拒绝 raw payload / provider body / binary archive。 |

| 工厂边界 | 作用 |
|---|---|
| `from_source_event(operation_context_ref, source_event_ref)` | 为 inbound source event 建立 intake 判断。 |
| `accepted(operation_context_ref, summary_ref)` | 从 body-free summary 建立 accepted intake。 |
| `ignored(operation_context_ref, reason_ref)` | 从 safe reason 建立 ignored intake。 |
| `rejected(operation_context_ref, reason_ref)` | 从 safe reason 建立 rejected intake。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| inbound_body_free | inbound 只能承接 summary、ref、digest、marker 和 safe reason。 |
| no_raw_provider_payload | 不保存 raw webhook、broker message、provider response、file body 或 archive body。 |
| no_core_truth_creation | intake 不直接创建 formal version、relation、package、method set 或 job run truth。 |
| no_transport_binding | 不定义 topic、subscription、HTTP route、consumer loop 或 ack/retry。 |

### 9. 对象卡片: `MethodAssetEventCandidateAssembly`

```rust
pub struct MethodAssetEventCandidateAssembly;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | outbound event candidate assembly |
| 对象类型 | application helper / event candidate assembly |
| 结构责任 | 从 accepted fact、material state change、maintenance progress 或 peripheral organization change 中组装 body-free event candidate 输入,但不表达 topic、payload、delivery 或 outbox 状态。 |
| 来源回指 | `02-概要设计.md` §7.5 / §8.2.3 / §11;`03_ddd_step_05_module_contracts.md` outbound event candidate boundary;`R6.15` event candidate 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `assembly_ref` | `MethodAssetEventCandidateAssemblyRef` | application 创建的 event candidate assembly 引用。 |
| `operation_context_ref` | `Option<MethodAssetOperationContextRef>` | accepted command、inbound 或 job 来源的 operation context。 |
| `event_family_kind` | `MethodAssetEventFamilyKind` | definition、formalization、consumption、trace、relation、external、maintenance、peripheral 事件族。 |
| `subject_ref_set` | `MethodAssetEventSubjectRefSet` | 事件候选涉及的 typed subject refs。 |
| `fact_summary_ref_set` | `MethodAssetFactSummaryRefSet` | 已成立事实或派生材料变化的 body-free summary refs。 |
| `lineage_ref_set` | `MethodAssetEvidenceLineageRefSet` | 可选 lineage refs,不得包含 evidence body。 |
| `candidate_reason_ref` | `MethodAssetEventCandidateReasonRef` | 形成候选的安全原因引用。 |
| `publication_boundary_marker_ref` | `MethodAssetPublicationBoundaryMarkerRef` | 表达候选可交给 publisher 边界,不表示已投递。 |

| 成员能力 | 作用 |
|---|---|
| `assert_candidate_body_free()` | 校验候选只含 typed ref、safe marker、summary 和 lineage ref。 |
| `add_fact_summary(summary_ref)` | 增加已成立事实或派生材料变化 summary。 |
| `add_subject_ref(subject_ref)` | 增加候选事件 subject ref。 |
| `reject_delivery_state(delivery_state_ref)` | 拒绝把 delivery / outbox / retry 状态混入候选。 |

| 工厂边界 | 作用 |
|---|---|
| `from_accepted_operation(operation_context_ref, summary_ref)` | 从 accepted operation summary 建立候选 assembly。 |
| `from_material_change(material_ref, freshness_ref)` | 从派生材料变化建立候选 assembly。 |
| `from_maintenance_progress(progress_ref)` | 从维护进度建立候选 assembly。 |
| `from_peripheral_change(package_or_set_ref)` | 从外围组织变化建立候选 assembly。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| candidate_not_delivery | event candidate 不等于 outbox、topic payload、delivery receipt 或 subscriber guarantee。 |
| no_payload_schema | 不定义 event payload schema,只定义 assembly helper。 |
| no_marketplace_fulfillment | 不表达 listing、order、purchase、install 或 fulfillment。 |
| no_raw_body | 不携带 method body、external body、artifact body、report body 或 archive body。 |

### 10. 对象卡片: `MethodAssetJobAssemblyContext`

```rust
pub struct MethodAssetJobAssemblyContext;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `application` |
| 所属 capability | operations job assembly / maintenance coordination |
| 对象类型 | application helper / job assembly context |
| 结构责任 | 在 operations job service 内统一承载 maintenance run、task refs、scope、cursor/page、safe result assembly、progress hint 和 degraded decision,确保 job 只刷新派生材料和维护进度。 |
| 来源回指 | `02-概要设计.md` §7.6 / §8.2.3 / §10.5 / §11;`02_hld_step_06_key_objects_operations_peripheral.md`;`R6.15` job assembly 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `job_context_ref` | `MethodAssetJobAssemblyContextRef` | application jobs service 创建的 job assembly context 引用。 |
| `operation_context_ref` | `MethodAssetOperationContextRef` | job runner 注入的 operation context。 |
| `maintenance_run_ref` | `MethodAssetMaintenanceRunRef` | 已登记的 maintenance run typed ref。 |
| `maintenance_task_ref_set` | `MethodAssetMaintenanceTaskRefSet` | refresh / recovery / reconciliation task refs。 |
| `job_scope_ref` | `MethodAssetJobScopeRef` | typed refresh / recovery scope ref。 |
| `batch_cursor_ref` | `Option<MethodAssetBatchCursorRef>` | page / batch cursor typed ref;不定义 storage cursor schema。 |
| `safe_result_assembly_ref` | `MethodAssetJobSafeResultAssemblyRef` | job safe output 组装引用。 |
| `progress_hint_ref` | `Option<MethodAssetMaintenanceProgressHintRef>` | 维护进度提示引用。 |
| `degraded_decision_ref` | `Option<MethodAssetDegradedDecisionRef>` | job degraded / unavailable 分支引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_job_no_core_truth_write()` | 校验 job 不修 definition、formal version、relation、external summary、package 或 method set truth。 |
| `assert_scope_allowed(job_scope_ref)` | 校验 task scope 不扩大消费边界或外部正文边界。 |
| `append_safe_result(result_summary_ref)` | 追加 body-free job result summary。 |
| `append_progress_hint(progress_hint_ref)` | 追加进度提示,不定义 runner state。 |
| `attach_degraded_decision(degraded_decision_ref)` | 承接 job unavailable / partial / stale 分支。 |

| 工厂边界 | 作用 |
|---|---|
| `for_refresh_job(operation_context_ref, maintenance_run_ref)` | 为 read/material refresh job 建立 assembly context。 |
| `for_trace_audit_job(operation_context_ref, maintenance_run_ref)` | 为 trace / audit / impact refresh job 建立 assembly context。 |
| `for_recovery_job(operation_context_ref, maintenance_run_ref)` | 为 consistency recovery convergence job 建立 assembly context。 |
| `for_peripheral_job(operation_context_ref, maintenance_run_ref)` | 为 peripheral read material refresh 建立 assembly context。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| job_no_core_truth_repair | job 不修核心 truth、不重做正式化、不扩大消费边界。 |
| no_scheduler_state | 不定义 cron、queue、worker lease、retry、dead letter 或 runner lifecycle。 |
| no_storage_cursor_schema | cursor / page 只以 typed ref 承接,存储 schema 后移 Step 11。 |
| no_external_body_copy | job 不复制 external body、artifact/archive body、report body 或 evidence body。 |

### 11. 后续 Step 承接

| 后续 Step | 承接内容 | 暂停条件 |
|---|---|---|
| Step 7 | 为 operation context factory、idempotency lookup、stored result save/get、read resolver、inbound intake、event candidate publisher seam、job task resolver 定义 port / trait。 | port 需要 raw transport、external body、delivery state、scheduler state 或未定义 marker 来源。 |
| Step 8 | 将 command/query/inbound/event/job 的 public protocol 回指到这些 helper 的 safe summary / marker / ref。 | DTO 试图复制 helper 内部字段或把 helper 当 public schema。 |
| Step 9 | function flow 必须调用 helper 工厂和成员能力,不能在流程中现场拼 context、dedup、degraded 或 event candidate。 | flow 需要从字符串、raw payload、private map 或 adapter response 生成正式 marker。 |
| Step 10 | 状态矩阵可引用 stored result kind、read disposition、inbound disposition、degraded kind 和 job assembly result 作为状态输入。 | 把 helper disposition 当成持久 truth state 或 terminal domain state。 |
| Step 11 | persistence 只可保存 typed ref、safe summary、result kind、digest ref 和 marker ref。 | 需要保存 DTO body、payload、raw error、topic、queue、outbox 或 cursor schema 且无正式定义。 |
| Step 12 | error / recovery 需要复用 safe reject reason、safe diagnostic、degraded decision 和 follow-up hint。 | application 自行发明 public error code 或 raw diagnostic。 |
| Step 13 | idempotency / replay 必须以 `MethodAssetIdempotencyGuard` 和 `MethodAssetStoredOperationResult` 为主语。 | duplicate replay 需要重跑 flow 或重读 truth 来重建 response。 |

### 12. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入八个 application helper / support object 卡片 | 是。 |
| 是否写入字段骨架和字段来源 | 是。 |
| 是否写入成员能力、工厂边界、不变量 / 禁止事项 | 是。 |
| 是否限制为 application helper,不替代 domain truth 或 public DTO | 是。 |
| 是否写 port trait、repository、adapter 或 UoW 方法签名 | 否。 |
| 是否写 DTO schema、event payload、job payload、function flow 或 persistence schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.17` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.17 infra adapter state 与 runtime support object:先思考`;只允许思考 runtime config ref、adapter availability、store / publisher / resolver / handoff state、source binding、safe diagnostic 和 `R6.18` 写入边界;不得写 infra support 对象卡片正文、adapter trait、repository、persistence schema、config key、raw secret、raw external payload、function flow、DTO schema 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.18`、Step 7 或后续 Step。

---

## R6.17 infra adapter state 与 runtime support object:先思考

### 1. 思考记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.17 infra adapter state 与 runtime support object:先思考`。 |
| 本模块目标 | 筛选只服务 infra runtime assembly、adapter availability、store / resolver / publisher / handoff binding 和 safe diagnostic 的 support object,为 `R6.18` 写对象卡片定边界。 |
| 当前状态 | completed |
| 写入范围 | 只写入本 Step 6 中间产物中的思考、候选、风险和下一写入边界。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不写 infra 对象卡片正文,不写 port trait、repository 方法、adapter 方法、persistence schema、config key、raw secret、raw payload、function flow、DTO 或 test。 |

### 2. 输入基线

| 输入 | 本模块读取方式 | 结论 |
|---|---|---|
| `02-概要设计.md` §11 | 读取配置影响轮廓、禁止配置化边界和 03 / 04 分工。 | infra 需要承接 typed config ref、runtime builder / validator、adapter availability、source binding、publisher / handoff failure mapping 和 safe diagnostic,但具体 key、默认值、env、secret、URL、topic、cron 后移 `04-配置设计` / Step 14。 |
| `03_ddd_step_04_module_layout.md` | 读取 `crates/infra` 文件职责。 | infra 承载 `config.rs`、`runtime_builder.rs`、repositories/material/reference stores、external adapters、publishers、handoff adapters、clock / id 和 errors;但 Step 6 不写产品绑定和 DB schema。 |
| `03_ddd_step_05_module_contracts.md` | 读取 infra owner 和依赖方向。 | infra 只实现 application ports 和 runtime assembly,不得反向决定 domain / application 业务 owner;外部仓只能通过 adapter / event / handoff / fake 表达,不是 Cargo dependency。 |
| 已完成 `R6.16` | 读取 operation context、idempotency、read/degraded、inbound/event/job helper 的后续承接。 | infra support 需要给这些 helper 提供 safe availability、binding 和 diagnostic 来源,不能把 helper 扩写成 adapter 或 store。 |
| L1-governance Step 6 框架参考 | 读取 infra runtime config / builder / adapter availability 与 store / publisher / resolver / handoff state 的分组方式。 | 可借鉴“runtime/config/availability”和“store/resolver/publisher/handoff state”两段粒度,不得复制 governance 领域语义、outbox 机制或产品绑定。 |

### 3. 候选分组

| 分组 | 候选对象 | 判断 |
|---|---|---|
| runtime / config | `MethodAssetRuntimeConfigBinding`;`MethodAssetRuntimeAssemblyState` | 进入 `R6.18`;用于表达 typed config ref、validated profile、runtime builder state 和 redacted validation issue。 |
| adapter availability | `MethodAssetAdapterAvailabilityState` | 进入 `R6.18`;统一表达 enabled、disabled by config、degraded、unavailable 等 adapter 可用性 marker。 |
| store binding | `MethodAssetStoreBindingState` | 进入 `R6.18`;覆盖 repository、read material store、reference store、idempotency / stored result store 的 body-free binding state。 |
| resolver / source binding | `MethodAssetExternalResolverBindingState`;`MethodAssetInboundSourceBindingState` | 进入 `R6.18`;分别承接 external resolver / source adapter 与 inbound source / schema / dedup channel 的安全绑定状态。 |
| publisher / handoff binding | `MethodAssetPublisherBindingState`;`MethodAssetHandoffBindingState` | 进入 `R6.18`;表达 event candidate publisher 与 observability/archive/handoff target 的 binding / availability,不表示 delivery success 或外部写入正文。 |
| safe diagnostic | `MethodAssetInfraSafeDiagnostic` | 进入 `R6.18`;承接 redacted config validation、adapter unavailable、binding blocked 和 failure mapping 的安全诊断。 |
| 明确不进入本组 | adapter trait、repository trait、store schema、URL/topic/secret/config key、HTTP client、DB pool、queue、scheduler、runner state。 | 分别后移 Step 7 / Step 11 / Step 14 / R6.19~R6.20 或实施计划。 |

### 4. 候选对象裁决

| 对象 | `R6.18` 裁决 | 责任边界 | 不得混入 |
|---|---|---|---|
| `MethodAssetRuntimeConfigBinding` | 写入 | 表达 runtime 使用的 typed config ref、profile ref、redaction marker 和 validation status。 | raw config、env、secret value、URL、topic、cron、retry 数字。 |
| `MethodAssetRuntimeAssemblyState` | 写入 | 表达 runtime builder 对 service / port / adapter slot 的装配进度、ready / failed / degraded 判断。 | adapter instance body、DI 容器实现、启动脚本、进程生命周期。 |
| `MethodAssetAdapterAvailabilityState` | 写入 | 表达 adapter slot 的 available / degraded / unavailable / disabled by config 状态和 safe reason。 | domain 状态迁移、truth 回滚、下游运行 truth、raw health response。 |
| `MethodAssetStoreBindingState` | 写入 | 表达 repository、material store、reference store、idempotency store 的 binding / availability / body-free diagnostic。 | DB 表、SQL、migration、cache key、文件路径、产品选择。 |
| `MethodAssetExternalResolverBindingState` | 写入 | 表达 process / identity / runtime / member-images / artifact / external systems resolver 的 safe binding。 | 外部正文、provider payload、URL 解析、相邻仓源码依赖。 |
| `MethodAssetInboundSourceBindingState` | 写入 | 表达 inbound source profile、schema/version、dedup channel 和 body-free intake availability。 | broker topic、webhook body、ack/retry、consumer loop、transport payload。 |
| `MethodAssetPublisherBindingState` | 写入 | 表达 event candidate publisher 的 binding、blocked / unavailable mapping 和 publication boundary marker。 | outbox relay、delivery guarantee、subscriber receipt、topic payload、dead letter。 |
| `MethodAssetHandoffBindingState` | 写入 | 表达 observability / archive / collaboration handoff target 的 binding 和 safe failure marker。 | external package body、archive body、report body、delivered truth、外部系统状态 owner。 |
| `MethodAssetInfraSafeDiagnostic` | 写入 | 表达 redacted validation issue、adapter failure、binding blocked、unavailable safe reason 和 follow-up hint。 | stack trace、raw exception、secret、provider error body、debug dump。 |

### 5. 字段来源风险预分析

| 对象 | 高风险字段来源 | `R6.18` 必须写清 |
|---|---|---|
| `MethodAssetRuntimeConfigBinding` | config ref、profile、redaction、validation status。 | 只能来自 validated config loader summary / runtime builder,不得保存原始配置或 secret。 |
| `MethodAssetRuntimeAssemblyState` | builder step、adapter slot、service assembly、failure reason。 | 只能表达 assembly state 和 redacted issue,不得保存 adapter instance。 |
| `MethodAssetAdapterAvailabilityState` | health / availability / degraded marker。 | marker 来源必须是 adapter health summary 或 config validation summary,不得由 domain / application 拼字符串。 |
| `MethodAssetStoreBindingState` | store kind、binding slot、availability、cursor / root。 | 只写 typed binding ref 和 safe marker,不得写 DB schema、path、cache key 或 product name。 |
| `MethodAssetExternalResolverBindingState` | external system kind、source binding、timeout/unavailable。 | 只承接 resolver binding ref 和 safe unavailable reason,不得读 provider payload。 |
| `MethodAssetInboundSourceBindingState` | source profile、schema version、dedup channel、transport binding。 | 只写 typed source / schema / channel ref,不得写 topic、subscription、webhook raw body。 |
| `MethodAssetPublisherBindingState` | publisher binding、event family、handoff target、blocked mapping。 | 只能表达 candidate publication boundary,不得表达 delivery success 或 outbox state。 |
| `MethodAssetHandoffBindingState` | target ref、package / receipt marker、failure reason。 | 只写 body-free target / marker / safe reason,不得保存 handoff package body。 |
| `MethodAssetInfraSafeDiagnostic` | raw error、validation issue、adapter response。 | 必须 redacted、safe、body-free,并回指正式 binding / availability 对象。 |

### 6. 排除和后移

| 项目 | 处理 |
|---|---|
| port trait / repository / adapter 方法签名 | 后移 Step 7。`R6.18` 只写 support object,不写方法签名。 |
| persistence schema、table、migration、cache key、store path | 后移 Step 11。Step 6 只允许 typed binding ref 和 availability marker。 |
| config key、默认值、env、secret、URL、topic、cron、retry / batch 数字 | 后移 Step 14 和 `04-配置设计.md`。 |
| public DTO、event payload、job payload、transport envelope | 后移 Step 8。infra support object 不替代 protocol。 |
| function flow、runtime builder 调用顺序、transaction 顺序 | 后移 Step 9 / Step 11。 |
| worker / job runner lifecycle、consumer loop、publisher loop | 后移 `R6.19` / `R6.20` 和 Step 9。 |
| product binding | 不在 Step 6 固化 PostgreSQL、HTTP client、queue、scheduler、object store 或 broker。 |
| raw external body / provider payload / handoff package body | 全部禁入;只能以 summary/ref/marker/safe diagnostic 承接。 |

### 7. `R6.18` 写入分组和边界

`R6.18` 可以按三个小批次写入,但仍属于同一模块:

| 小批次 | 写入内容 | 边界 |
|---|---|---|
| runtime / availability support | `MethodAssetRuntimeConfigBinding`;`MethodAssetRuntimeAssemblyState`;`MethodAssetAdapterAvailabilityState` | 写 typed config binding、runtime assembly state 和 adapter availability 对象卡片。 |
| store / resolver / source binding | `MethodAssetStoreBindingState`;`MethodAssetExternalResolverBindingState`;`MethodAssetInboundSourceBindingState` | 写 store slot、external resolver 和 inbound source binding 的 support object。 |
| publisher / handoff / diagnostic | `MethodAssetPublisherBindingState`;`MethodAssetHandoffBindingState`;`MethodAssetInfraSafeDiagnostic` | 写 event candidate publisher、handoff target 和 safe diagnostic support object。 |

`R6.18` 不得写入:

- Step 7 port trait、repository、adapter 或 UoW 方法签名。
- Step 8 DTO / event / job payload schema。
- Step 9 function flow。
- Step 11 persistence schema、DB table、cache key、store path 或 migration。
- Step 14 config key、默认值、env、secret、URL、topic、cron、retry / batch 数字。
- raw external payload、raw config、secret value、stack trace、provider error body。
- 正式 `03-详细设计.md`。
- `R6.19` 或后续模块。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只做先思考 | 是。 |
| 是否裁决 `R6.18` 写入对象 | 是:九个 infra adapter state / runtime support object。 |
| 是否写 infra support 对象卡片正文 | 否。 |
| 是否写 port trait、repository、adapter、persistence、config key、DTO、flow 或 test schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.18` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.18 infra adapter state 与 runtime support object:再写入`;只允许写入 `MethodAssetRuntimeConfigBinding`、`MethodAssetRuntimeAssemblyState`、`MethodAssetAdapterAvailabilityState`、`MethodAssetStoreBindingState`、`MethodAssetExternalResolverBindingState`、`MethodAssetInboundSourceBindingState`、`MethodAssetPublisherBindingState`、`MethodAssetHandoffBindingState`、`MethodAssetInfraSafeDiagnostic` 对象卡片;不得写 port trait、repository、adapter 方法、persistence schema、config key、raw secret、raw external payload、function flow、DTO schema、event payload、job payload 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.19`、Step 7 或后续 Step。

---

## R6.18 infra adapter state 与 runtime support object:再写入

### 1. 写入记录

| 项 | 记录 |
|---|---|
| 触发 | 用户确认进入 `R6.18 infra adapter state 与 runtime support object:再写入`。 |
| 本模块目标 | 将 `R6.17` 已裁决的 infra runtime / adapter support 候选写成对象卡片,为 Step 7 / Step 11 / Step 12 / Step 14 / Step 15 承接 port、persistence、error、config 和 observability 提供对象回指。 |
| 当前状态 | completed |
| 写入范围 | 只写入 infra support object 的对象身份、字段骨架、字段来源、成员能力、工厂边界和不变量 / 禁止事项。 |
| 正式文档状态 | 未修改正式 `projects/L3-method-library/03-详细设计.md`。 |
| 本模块不做 | 不写 port trait、repository、adapter 方法、persistence schema、config key、raw secret、raw payload、function flow、DTO、event payload、job payload 或 test case schema。 |

### 2. 本组对象边界

| 对象组 | 写入对象 | 作用 | 禁止事项 |
|---|---|---|---|
| runtime / availability support | `MethodAssetRuntimeConfigBinding`;`MethodAssetRuntimeAssemblyState`;`MethodAssetAdapterAvailabilityState` | 承接 typed config ref、runtime builder 状态、adapter slot availability 和 redacted validation issue。 | 不写 raw config、secret、URL、topic、cron、adapter instance 或进程生命周期。 |
| store / resolver / source binding | `MethodAssetStoreBindingState`;`MethodAssetExternalResolverBindingState`;`MethodAssetInboundSourceBindingState` | 承接 store slot、external resolver、inbound source/schema/dedup channel 的 body-free binding 状态。 | 不写 DB schema、cache key、provider payload、broker topic、webhook body 或相邻仓源码依赖。 |
| publisher / handoff / diagnostic | `MethodAssetPublisherBindingState`;`MethodAssetHandoffBindingState`;`MethodAssetInfraSafeDiagnostic` | 承接 event candidate publisher、observability/archive handoff target 和 redacted failure diagnostic。 | 不写 outbox relay、delivery guarantee、handoff body、raw exception 或 debug dump。 |

### 3. 对象卡片: `MethodAssetRuntimeConfigBinding`

```rust
pub struct MethodAssetRuntimeConfigBinding;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | runtime config binding / validation support |
| 对象类型 | infra runtime support object |
| 结构责任 | 表达 runtime 使用的 typed config ref、profile ref、redaction marker 和 validation status,使 infra 可以向 application 提供安全配置绑定状态而不泄漏配置正文。 |
| 来源回指 | `02-概要设计.md` §11;`03_ddd_step_04_module_layout.md` infra `config.rs`;`03_ddd_step_05_module_contracts.md` infra owner;`R6.17` runtime / config 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `config_binding_ref` | `MethodAssetRuntimeConfigBindingRef` | infra runtime builder 创建的配置绑定引用。 |
| `config_source_ref` | `MethodAssetConfigSourceRef` | config loader summary 提供的 typed source ref;不保存 path、env 或 raw file。 |
| `runtime_profile_ref` | `MethodAssetRuntimeProfileRef` | validated profile summary 的 typed ref。 |
| `config_version_ref` | `Option<MethodAssetConfigVersionRef>` | validated config summary 的版本引用。 |
| `redaction_marker_ref` | `MethodAssetConfigRedactionMarkerRef` | config validator 输出的 redaction marker。 |
| `validation_status_kind` | `MethodAssetConfigValidationStatusKind` | valid / degraded / invalid / unavailable 的安全状态。 |
| `validation_issue_refs` | `MethodAssetConfigValidationIssueRefSet` | redacted validation issue refs。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | 配置绑定异常时的安全诊断引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_redacted()` | 校验对象只保存 config ref、profile ref、marker 和 redacted issue。 |
| `assert_domain_invariant_not_configurable()` | 校验配置绑定不改变 Definition vs Use、truth owner、状态机或 body-free 红线。 |
| `mark_valid(config_version_ref)` | 表达当前绑定通过校验。 |
| `mark_invalid(issue_refs, diagnostic_ref)` | 表达配置不可用或无效,并只暴露 redacted issue。 |

| 工厂边界 | 作用 |
|---|---|
| `from_validated_summary(config_source_ref, runtime_profile_ref)` | 从 validated config summary 建立 binding。 |
| `invalid(config_source_ref, issue_refs, diagnostic_ref)` | 从 redacted validation issue 建立 invalid binding。 |
| `unavailable(config_source_ref, diagnostic_ref)` | 从 config source unavailable 建立安全不可用 binding。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_raw_config | 不保存配置文件正文、env value、secret、URL、topic、cron、retry 或 batch 数字。 |
| no_policy_override | 配置不得改写 domain invariant、truth owner、状态语义或边界红线。 |
| no_secret_value | secret 只能以 secret ref / redaction marker 承接,不得保存 secret value。 |
| no_product_binding | 不在 Step 6 固化具体数据库、消息系统、对象存储或 HTTP 产品。 |

### 4. 对象卡片: `MethodAssetRuntimeAssemblyState`

```rust
pub struct MethodAssetRuntimeAssemblyState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | runtime builder / service assembly support |
| 对象类型 | infra runtime support object / assembly state |
| 结构责任 | 表达 runtime builder 对 service、port、adapter slot 和 entry profile 的装配状态,让 entry 能判断 ready / degraded / failed,但不暴露 adapter instance 或启动机制。 |
| 来源回指 | `02-概要设计.md` §11;`03_ddd_step_04_module_layout.md` infra `runtime_builder.rs`;`03_ddd_step_05_module_contracts.md` runtime builder owner;`R6.17` runtime assembly 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `assembly_state_ref` | `MethodAssetRuntimeAssemblyStateRef` | runtime builder 创建的 assembly state 引用。 |
| `config_binding_ref` | `MethodAssetRuntimeConfigBindingRef` | 已验证的 runtime config binding。 |
| `assembly_phase_kind` | `MethodAssetRuntimeAssemblyPhaseKind` | not_started / validating_config / assembling / ready / degraded / failed。 |
| `service_slot_refs` | `MethodAssetServiceSlotRefSet` | application service / facade slot 的 typed refs。 |
| `adapter_slot_refs` | `MethodAssetAdapterSlotRefSet` | repository、store、resolver、publisher、handoff、clock / id adapter slot refs。 |
| `availability_state_refs` | `MethodAssetAdapterAvailabilityStateRefSet` | adapter availability state refs。 |
| `assembly_issue_refs` | `MethodAssetRuntimeAssemblyIssueRefSet` | redacted assembly issue refs。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | failed / degraded 时的安全诊断引用。 |

| 成员能力 | 作用 |
|---|---|
| `assert_no_adapter_instance_body()` | 校验不保存 adapter instance、connection pool、client、thread、process 或 closure body。 |
| `mark_ready()` | 表达 runtime assembly 可供 entry 使用。 |
| `mark_degraded(issue_refs, diagnostic_ref)` | 表达 runtime 可降级启动或部分能力不可用。 |
| `mark_failed(issue_refs, diagnostic_ref)` | 表达 runtime 组装失败且只能返回 safe diagnostic。 |

| 工厂边界 | 作用 |
|---|---|
| `not_started(config_binding_ref)` | 建立初始 assembly state。 |
| `assembling(config_binding_ref, adapter_slot_refs)` | 表达 runtime 正在组装 adapter slots。 |
| `ready(config_binding_ref, availability_state_refs)` | 从可用 adapter availability 建立 ready state。 |
| `failed(config_binding_ref, issue_refs, diagnostic_ref)` | 从 redacted issue 建立 failed state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| runtime_state_not_domain_state | runtime assembly state 不得替代 domain truth state 或 application result。 |
| no_process_lifecycle | 不表达 OS process、thread、task、service supervisor 或 deployment state。 |
| no_instance_body | 不保存 adapter instance、client、connection pool、secret 或 raw config。 |
| no_flow_order | 不定义 function flow、transaction order 或 runtime builder 调用顺序。 |

### 5. 对象卡片: `MethodAssetAdapterAvailabilityState`

```rust
pub struct MethodAssetAdapterAvailabilityState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | adapter availability / degraded mapping |
| 对象类型 | infra support object / availability state |
| 结构责任 | 统一表达 repository、store、resolver、publisher、handoff、clock / id 等 adapter slot 的 available / degraded / unavailable / disabled by config 状态和 safe reason。 |
| 来源回指 | `02-概要设计.md` §10 / §11;`03_ddd_step_04_module_layout.md` infra adapter files;`R6.16` degraded decision 后续承接;`R6.17` adapter availability 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | infra builder 或 adapter health summary 创建的 availability state 引用。 |
| `adapter_slot_ref` | `MethodAssetAdapterSlotRef` | runtime assembly 中登记的 adapter slot typed ref。 |
| `adapter_family_kind` | `MethodAssetAdapterFamilyKind` | store / resolver / inbound / publisher / handoff / clock_id / diagnostic。 |
| `availability_kind` | `MethodAssetAdapterAvailabilityKind` | available / degraded / unavailable / disabled_by_config / unsupported。 |
| `availability_marker_ref` | `MethodAssetAdapterAvailabilityMarkerRef` | adapter health summary 或 config validation summary 输出的 marker。 |
| `safe_reason_ref` | `Option<MethodAssetAdapterUnavailableReasonRef>` | unavailable / degraded 的安全原因引用。 |
| `checked_at_ref` | `MethodAssetAdapterCheckedAtRef` | clock adapter 注入的安全检查时间引用。 |
| `diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | 对应 redacted diagnostic。 |

| 成员能力 | 作用 |
|---|---|
| `assert_marker_formal()` | 校验 availability marker 来自 adapter health summary 或 config validation summary。 |
| `is_usable_for_read()` | 判断该 adapter 是否可支撑只读路径。 |
| `is_usable_for_write()` | 判断该 adapter 是否可支撑写路径或 result store。 |
| `to_degraded_decision_input()` | 将 unavailable / degraded 安全映射为 application degraded decision 输入。 |

| 工厂边界 | 作用 |
|---|---|
| `available(adapter_slot_ref, marker_ref)` | 从 health summary 建立 available state。 |
| `degraded(adapter_slot_ref, marker_ref, reason_ref)` | 从 safe degraded marker 建立 degraded state。 |
| `unavailable(adapter_slot_ref, marker_ref, reason_ref)` | 从 safe unavailable marker 建立 unavailable state。 |
| `disabled_by_config(adapter_slot_ref, config_binding_ref)` | 从 validated config binding 建立 disabled state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| availability_not_truth | adapter 可用性不能改变已成立 domain truth 或回滚 command result。 |
| no_raw_health_response | 不保存 raw health body、provider response、stack trace 或 network dump。 |
| no_string_marker | 不由 domain / application 拼接 availability marker。 |
| no_product_state | 不保存数据库连接状态、broker offset、HTTP client 状态或外部系统内部状态。 |

### 6. 对象卡片: `MethodAssetStoreBindingState`

```rust
pub struct MethodAssetStoreBindingState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | repository / material / reference / idempotency store binding |
| 对象类型 | infra support object / store binding state |
| 结构责任 | 表达 truth repository、read material store、reference store、idempotency / stored result store 等 store slot 的 binding、availability 和 body-free diagnostic。 |
| 来源回指 | `02-概要设计.md` §11;`03_ddd_step_04_module_layout.md` infra `repositories.rs` / `material_stores.rs` / `reference_stores.rs`;`R6.17` store binding 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `store_binding_ref` | `MethodAssetStoreBindingStateRef` | runtime builder 创建的 store binding 引用。 |
| `store_slot_ref` | `MethodAssetStoreSlotRef` | repository / material / reference / idempotency store slot typed ref。 |
| `store_family_kind` | `MethodAssetStoreFamilyKind` | truth_repository / read_material / reference / idempotency / stored_result / report_material。 |
| `binding_status_kind` | `MethodAssetStoreBindingStatusKind` | bound / degraded / unavailable / disabled_by_config / unsupported。 |
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | 对应 adapter availability state。 |
| `store_scope_ref` | `MethodAssetStoreScopeRef` | store 支撑的业务或材料 scope typed ref。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | store 绑定异常时的安全诊断引用。 |
| `binding_marker_ref` | `MethodAssetStoreBindingMarkerRef` | store binding summary 输出的 marker。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free_binding()` | 校验 binding state 不保存 DB row、table、SQL、file path、cache key 或 product config。 |
| `supports_store_family(store_family_kind)` | 判断当前 binding 是否覆盖指定 store family。 |
| `assert_available_for_scope(store_scope_ref)` | 校验 store 在指定 typed scope 下可用。 |
| `to_unavailable_diagnostic()` | 将 store unavailable 转为 safe diagnostic 输入。 |

| 工厂边界 | 作用 |
|---|---|
| `bound(store_slot_ref, availability_state_ref)` | 从 runtime builder 和 availability state 建立 bound state。 |
| `degraded(store_slot_ref, availability_state_ref, diagnostic_ref)` | 建立 degraded store binding。 |
| `unavailable(store_slot_ref, availability_state_ref, diagnostic_ref)` | 建立 unavailable store binding。 |
| `disabled_by_config(store_slot_ref, config_binding_ref)` | 从 config binding 建立 disabled state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_persistence_schema | 不定义 DB table、index、migration、cache key、file path 或 object store layout。 |
| no_store_product | 不固化 PostgreSQL、Redis、S3、filesystem、broker 或任何具体产品。 |
| no_truth_semantics | store binding 不决定 domain truth owner、state transition 或 transaction order。 |
| fake_durable_parity_required_later | fake / durable 等价语义后移 Step 11 / 实施计划,本对象只提供 binding marker。 |

### 7. 对象卡片: `MethodAssetExternalResolverBindingState`

```rust
pub struct MethodAssetExternalResolverBindingState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | external resolver / source adapter binding |
| 对象类型 | infra support object / resolver binding state |
| 结构责任 | 表达 process、identity、runtime、member-images、artifact、archive 或 external systems resolver 的 safe binding、availability 和 unavailable mapping,不保存外部正文或相邻仓内部状态。 |
| 来源回指 | `02-概要设计.md` §7.3 / §10.4 / §11;`03_ddd_step_04_module_layout.md` infra `external_adapters.rs`;`03_ddd_step_05_module_contracts.md` non-Cargo external relation;`R6.17` resolver binding 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `resolver_binding_ref` | `MethodAssetExternalResolverBindingStateRef` | runtime builder 创建的 resolver binding 引用。 |
| `external_system_kind` | `MethodAssetExternalSystemKind` | process / identity / runtime / member_images / artifact / archive / external_system。 |
| `resolver_slot_ref` | `MethodAssetResolverSlotRef` | external resolver adapter slot typed ref。 |
| `source_binding_ref` | `ExternalSourceBindingRef` | external source binding summary 提供的 typed ref。 |
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | resolver adapter availability state。 |
| `body_free_capability_marker_ref` | `ExternalBodyFreeCapabilityMarkerRef` | 表示 resolver 只能返回 summary/ref/marker 的能力 marker。 |
| `unavailable_reason_ref` | `Option<MethodAssetAdapterUnavailableReasonRef>` | resolver unavailable 的 safe reason。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | resolver binding / unavailable 的安全诊断。 |

| 成员能力 | 作用 |
|---|---|
| `assert_non_cargo_boundary()` | 校验外部系统只通过 adapter / event / handoff 协作,不是 Cargo dependency。 |
| `assert_body_free_resolver()` | 校验 resolver binding 只能返回 body-free summary、typed ref、digest hint 或 marker。 |
| `can_resolve_source(external_system_kind)` | 判断是否可安全解析指定外部系统来源。 |
| `to_unavailable_marker()` | 将 resolver unavailable 映射为 safe unavailable marker。 |

| 工厂边界 | 作用 |
|---|---|
| `bound(resolver_slot_ref, source_binding_ref, availability_state_ref)` | 建立可用 resolver binding。 |
| `degraded(resolver_slot_ref, availability_state_ref, diagnostic_ref)` | 建立 degraded resolver binding。 |
| `unavailable(resolver_slot_ref, availability_state_ref, reason_ref)` | 建立 unavailable resolver binding。 |
| `unsupported(external_system_kind, diagnostic_ref)` | 表达当前 profile 不支持该 resolver。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_external_body | 不保存标准正文、artifact body、archive body、provider payload、runtime log 或 actor profile。 |
| no_source_code_dependency | 不引入 process / identity / runtime / member-images / observability 源码依赖。 |
| no_url_parsing_truth | 不从 URL、path、route、external id 字符串反推正式 typed ref。 |
| no_downstream_truth_owner | resolver binding 不拥有下游运行 truth 或外部生命周期。 |

### 8. 对象卡片: `MethodAssetInboundSourceBindingState`

```rust
pub struct MethodAssetInboundSourceBindingState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | inbound source / schema / dedup channel binding |
| 对象类型 | infra support object / inbound binding state |
| 结构责任 | 表达 inbound source profile、schema/version、dedup channel、source availability 和 body-free intake boundary,为 worker consumer 入口和 application intake decision 提供安全 binding 来源。 |
| 来源回指 | `02-概要设计.md` §7.4 / §8.2.3 / §10.4 / §11;`03_ddd_step_04_module_layout.md` worker consumers 与 infra bindings;`R6.17` inbound source binding 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `inbound_binding_ref` | `MethodAssetInboundSourceBindingStateRef` | runtime builder 创建的 inbound source binding 引用。 |
| `inbound_source_ref` | `ExternalSourceRef` | allowed source summary 提供的 external source typed ref。 |
| `source_profile_ref` | `MethodAssetInboundSourceProfileRef` | validated source profile typed ref。 |
| `schema_version_ref_set` | `MethodAssetInboundSchemaVersionRefSet` | 允许的 inbound safe schema/version refs。 |
| `dedup_channel_ref` | `MethodAssetDedupChannelRef` | inbound idempotency / dedup channel typed ref。 |
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | inbound source adapter availability state。 |
| `body_free_marker_ref` | `ExternalBodyFreeMarkerRef` | inbound body-free boundary marker。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | source binding 或 schema 不可用的安全诊断。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free_intake_only()` | 校验 source binding 只允许 summary/ref/digest/marker/safe reason。 |
| `supports_schema(schema_version_ref)` | 判断当前 source profile 是否支持指定 safe schema/version。 |
| `supports_dedup_channel(dedup_channel_ref)` | 判断 dedup channel 是否可用。 |
| `to_intake_unavailable_reason()` | 将 source unavailable 映射为 inbound intake safe reason。 |

| 工厂边界 | 作用 |
|---|---|
| `bound(inbound_source_ref, source_profile_ref, availability_state_ref)` | 建立可用 inbound binding。 |
| `schema_unsupported(inbound_source_ref, schema_version_ref, diagnostic_ref)` | 建立 unsupported schema binding。 |
| `unavailable(inbound_source_ref, availability_state_ref, diagnostic_ref)` | 建立 source unavailable binding。 |
| `disabled_by_config(inbound_source_ref, config_binding_ref)` | 从 config binding 建立 disabled source binding。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_transport_payload | 不保存 broker message、webhook body、raw envelope、topic、subscription 或 ack state。 |
| no_consumer_loop | 不定义 consumer loop、backoff、retry、dead letter 或 runner lifecycle。 |
| no_core_truth_creation | inbound binding 不直接创建 formal version、relation、package、method set 或 job run truth。 |
| schema_ref_only | schema 只以 typed schema/version ref 承接,不保存 schema body 或 payload example。 |

### 9. 对象卡片: `MethodAssetPublisherBindingState`

```rust
pub struct MethodAssetPublisherBindingState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | outbound event candidate publisher binding |
| 对象类型 | infra support object / publisher binding state |
| 结构责任 | 表达 event candidate publisher 的 binding、availability、blocked / unavailable mapping 和 publication boundary marker,只说明候选可交给发布接缝,不表达 outbox relay 或投递成功。 |
| 来源回指 | `02-概要设计.md` §7.5 / §8.2.3 / §10.5 / §11;`03_ddd_step_04_module_layout.md` infra `publishers.rs`;`R6.16` event candidate assembly;`R6.17` publisher binding 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `publisher_binding_ref` | `MethodAssetPublisherBindingStateRef` | runtime builder 创建的 publisher binding 引用。 |
| `publisher_slot_ref` | `MethodAssetPublisherSlotRef` | publisher adapter slot typed ref。 |
| `event_family_kind_set` | `MethodAssetEventFamilyKindSet` | 该 publisher 可承接的 event candidate family set。 |
| `publication_boundary_marker_ref` | `MethodAssetPublicationBoundaryMarkerRef` | publisher binding summary 输出的 publication boundary marker。 |
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | publisher adapter availability state。 |
| `blocked_reason_ref` | `Option<MethodAssetPublicationBlockedReasonRef>` | publisher blocked 的 safe reason。 |
| `handoff_target_ref_set` | `MethodAssetHandoffTargetRefSet` | 可选 handoff target refs,不保存 target body。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | publisher unavailable / blocked 的安全诊断。 |

| 成员能力 | 作用 |
|---|---|
| `assert_candidate_only()` | 校验 publisher binding 只承接 event candidate,不声明 delivery success。 |
| `supports_event_family(event_family_kind)` | 判断当前 binding 是否支持指定 event candidate family。 |
| `mark_blocked(reason_ref, diagnostic_ref)` | 表达 publisher 被配置、边界或外部条件阻塞。 |
| `to_degraded_publication_marker()` | 将 publisher unavailable 映射为 safe publication marker。 |

| 工厂边界 | 作用 |
|---|---|
| `bound(publisher_slot_ref, availability_state_ref)` | 建立可用 publisher binding。 |
| `blocked(publisher_slot_ref, blocked_reason_ref, diagnostic_ref)` | 建立 blocked publisher binding。 |
| `unavailable(publisher_slot_ref, availability_state_ref, diagnostic_ref)` | 建立 unavailable publisher binding。 |
| `disabled_by_config(publisher_slot_ref, config_binding_ref)` | 从 config binding 建立 disabled publisher binding。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| candidate_not_delivery | publisher binding 不表达 delivery receipt、subscriber ack、retry outcome 或 delivery guarantee。 |
| no_outbox_relay | 不恢复旧 outbox relay、claim、lease、dead letter 或 payload snapshot 机制。 |
| no_topic_payload | 不保存 topic、routing key、event payload body 或 subscriber-specific body。 |
| no_truth_rollback | publisher unavailable / blocked 不回滚已成立 truth 或 event candidate 来源事实。 |

### 10. 对象卡片: `MethodAssetHandoffBindingState`

```rust
pub struct MethodAssetHandoffBindingState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | observability / archive / collaboration handoff binding |
| 对象类型 | infra support object / handoff binding state |
| 结构责任 | 表达 observability、archive、external collaboration 或 downstream handoff target 的 typed binding、availability、safe failure marker 和 body-free target boundary。 |
| 来源回指 | `02-概要设计.md` §10.5 / §11;`03_ddd_step_04_module_layout.md` infra `handoff_adapters.rs`;`03_ddd_step_05_module_contracts.md` observability / archive handoff relation;`R6.17` handoff binding 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `handoff_binding_ref` | `MethodAssetHandoffBindingStateRef` | runtime builder 创建的 handoff binding 引用。 |
| `handoff_target_ref` | `MethodAssetHandoffTargetRef` | config validation summary 或 job input 提供的 target typed ref。 |
| `handoff_family_kind` | `MethodAssetHandoffFamilyKind` | observability / archive / collaboration / downstream_hint / report_artifact。 |
| `handoff_boundary_marker_ref` | `MethodAssetHandoffBoundaryMarkerRef` | handoff adapter summary 输出的 boundary marker。 |
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | handoff adapter availability state。 |
| `receipt_marker_ref` | `Option<MethodAssetHandoffReceiptMarkerRef>` | handoff adapter 返回的 body-free receipt marker。 |
| `failure_reason_ref` | `Option<MethodAssetHandoffFailureReasonRef>` | failed / blocked 的 safe reason。 |
| `safe_diagnostic_ref` | `Option<MethodAssetInfraSafeDiagnosticRef>` | handoff failure / blocked 的安全诊断。 |

| 成员能力 | 作用 |
|---|---|
| `assert_target_body_free()` | 校验 target binding 不携带外部系统正文、archive body、report body 或 package body。 |
| `supports_handoff_family(handoff_family_kind)` | 判断该 binding 是否支持指定 handoff family。 |
| `mark_prepared()` | 表达 handoff target 可准备接收 body-free summary/ref。 |
| `mark_failed(reason_ref, diagnostic_ref)` | 表达 handoff 失败但不回滚本仓 truth。 |

| 工厂边界 | 作用 |
|---|---|
| `bound(handoff_target_ref, availability_state_ref)` | 建立可用 handoff binding。 |
| `prepared(handoff_target_ref, boundary_marker_ref)` | 从 body-free target marker 建立 prepared binding。 |
| `failed(handoff_target_ref, failure_reason_ref, diagnostic_ref)` | 从 safe failure 建立 failed binding。 |
| `disabled_by_config(handoff_target_ref, config_binding_ref)` | 从 config binding 建立 disabled handoff binding。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| handoff_not_truth_owner | handoff target 不拥有本仓 truth,外部写入失败不改变本仓事实成立。 |
| no_handoff_body | 不保存 archive body、report body、handoff package body、external system response body。 |
| no_delivered_truth | `receipt_marker_ref` 只表示 body-free receipt,不得成为 external delivered truth。 |
| no_observability_payload | 不保存 telemetry payload、metric labels、trace body 或 log body。 |

### 11. 对象卡片: `MethodAssetInfraSafeDiagnostic`

```rust
pub struct MethodAssetInfraSafeDiagnostic;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `infra` |
| 所属 capability | redacted infra diagnostic / failure mapping |
| 对象类型 | infra support object / safe diagnostic |
| 结构责任 | 汇总 config validation、adapter unavailable、binding blocked、resolver failure、publisher failure 和 handoff failure 的 redacted safe diagnostic,作为 application degraded decision 和 error recovery 的安全输入。 |
| 来源回指 | `02-概要设计.md` §10 / §11;`03_ddd_step_04_module_layout.md` infra `errors.rs`;`R6.16` degraded decision;`R6.17` safe diagnostic 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `safe_diagnostic_ref` | `MethodAssetInfraSafeDiagnosticRef` | infra adapter / builder / validator 创建的安全诊断引用。 |
| `diagnostic_family_kind` | `MethodAssetInfraDiagnosticFamilyKind` | config_validation / store_binding / resolver / inbound / publisher / handoff / clock_id。 |
| `diagnostic_severity_kind` | `MethodAssetInfraDiagnosticSeverityKind` | info / warning / degraded / unavailable / blocked / fatal。 |
| `redacted_issue_refs` | `MethodAssetRedactedIssueRefSet` | redacted validation 或 adapter issue refs。 |
| `safe_reason_ref` | `MethodAssetSafeReasonRef` | 可公开的 safe reason 引用。 |
| `source_binding_ref` | `Option<MethodAssetInfraBindingRef>` | 触发诊断的 binding typed ref。 |
| `availability_marker_ref` | `Option<MethodAssetAdapterAvailabilityMarkerRef>` | 相关 adapter availability marker。 |
| `follow_up_hint_ref` | `Option<MethodAssetFollowUpHintRef>` | 后续 refresh / reconfigure / formal intervention hint。 |

| 成员能力 | 作用 |
|---|---|
| `assert_redacted()` | 校验 diagnostic 不含 raw config、secret、payload、stack trace 或 provider response。 |
| `as_degraded_decision_input()` | 输出可被 application degraded decision 复制的 safe diagnostic。 |
| `as_error_mapping_input()` | 输出 Step 12 error / recovery 可承接的 safe reason。 |
| `with_follow_up_hint(hint_ref)` | 附加后续动作提示,不直接触发 repair、retry 或 job。 |

| 工厂边界 | 作用 |
|---|---|
| `from_config_issue(binding_ref, issue_refs)` | 从 redacted config validation issue 建立 diagnostic。 |
| `from_adapter_unavailable(availability_state_ref, reason_ref)` | 从 adapter unavailable 建立 diagnostic。 |
| `from_binding_blocked(binding_ref, reason_ref)` | 从 binding blocked 建立 diagnostic。 |
| `from_handoff_failure(handoff_binding_ref, failure_reason_ref)` | 从 handoff safe failure 建立 diagnostic。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| diagnostic_body_free | 诊断只能包含 safe reason、redacted issue、marker 和 typed binding ref。 |
| no_stack_trace | 不保存 stack trace、debug dump、raw exception、provider error body 或 raw adapter response。 |
| no_secret_leak | 不保存 secret value、token、credential、raw config 或 endpoint body。 |
| no_automatic_action | diagnostic 不执行 retry、repair、refresh、handoff 或 mutation。 |

### 12. 后续 Step 承接

| 后续 Step | 承接内容 | 暂停条件 |
|---|---|---|
| Step 7 | 为 config validation、runtime assembly、store binding、resolver binding、inbound binding、publisher binding、handoff binding、clock / id 和 diagnostics 定义 port / trait。 | port 需要 raw config、secret、payload、topic、URL、DB schema 或产品对象才能落码。 |
| Step 8 | public protocol 只能暴露 safe availability、binding marker、redacted issue 和 safe diagnostic refs。 | DTO 复制 raw config、adapter state body、provider payload 或 event payload。 |
| Step 9 | flow 只能复制这些 binding / availability / diagnostic 结果,不能现场拼 marker 或从 adapter response 猜状态。 | flow 需要读取外部正文、下游 truth 或 raw health response。 |
| Step 10 | 状态矩阵可引用 runtime assembly phase、adapter availability、binding status 和 diagnostic severity 作为 infra / runtime 状态输入。 | 把 infra runtime state 当成 domain terminal state。 |
| Step 11 | persistence 只能保存 typed ref、availability kind、binding marker、redacted issue ref、safe diagnostic ref。 | 需要 table、index、path、cache key、payload snapshot 或 product binding 且无正式 schema。 |
| Step 12 | error / recovery 需要复用 `MethodAssetInfraSafeDiagnostic`、unavailable reason、blocked reason 和 follow-up hint。 | error mapping 需要 raw exception、secret 或 provider body。 |
| Step 14 | 配置设计必须从 `MethodAssetRuntimeConfigBinding` 和 binding refs 继续展开 key、默认值、env、secret ref、profile 和 validation。 | 配置项试图改写 domain invariant、truth owner、状态机或 body-free 禁区。 |
| Step 15 | observability / audit 只能承接 body-free diagnostic、handoff marker、binding ref 和 redacted issue refs。 | telemetry 或 audit 保存 raw payload、raw log、external body 或 secret。 |

### 13. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入九个 infra adapter state / runtime support object 卡片 | 是。 |
| 是否写入字段骨架和字段来源 | 是。 |
| 是否写入成员能力、工厂边界、不变量 / 禁止事项 | 是。 |
| 是否限制为 infra support object,不替代 domain truth、application helper 或 public DTO | 是。 |
| 是否写 port trait、repository、adapter 方法或 UoW 方法签名 | 否。 |
| 是否写 persistence schema、DB table、config key、raw secret、payload、function flow、DTO、event payload、job payload 或 test schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.19` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.19 api / worker / jobs entry object:先思考`;只允许思考 api command/query handler entry、worker inbound/event publisher entry、jobs operation runner entry、entry local context/result object 和 `R6.20` 写入边界;不得写 entry 对象卡片正文、transport DTO、HTTP route、topic、cron、runner lifecycle、function flow、port trait、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.20`、Step 7 或后续 Step。

---

## R6.19 api / worker / jobs entry object:先思考

### 1. 思考记录

`R6.19` 只裁决 entry / runner local object 的候选和 `R6.20` 写入边界,不写对象卡片正文。这里的 entry / runner 对象不是 protocol DTO、transport route、topic、scheduler 或 function flow,而是 api / worker / jobs 三个 binary-capable crate 内部用于装配、预校验、上下文传递、结果组装和安全错误映射的本地对象。

本组对象必须服从 Step 5 的依赖边界:

| 边界 | 对 R6.19 的影响 |
|---|---|
| `api/worker/jobs -> contracts/application/infra` | entry / runner 可以装配 contracts surface、调用 application service、持有 infra runtime binding,但不得直接依赖 domain 或改写 truth。 |
| `api`、`worker`、`jobs` 并列且不得互依 | 三类入口必须各自拥有本地 context / result object;不得抽出跨 entry crate 的 shared runtime owner。 |
| `worker` 不恢复 outbox relay | event publisher entry 只承接 event candidate / publisher binding,不表达 topic、claim、lease、delivery、retry 或 dead letter。 |
| `jobs` 不修 core truth | job runner entry 只调用 application job orchestration 刷新派生材料、检查收敛和生成 progress / report boundary。 |
| 本仓不实现 gateway / auth owner | api entry 只接收已转译的 actor / request metadata,不定义 auth extractor、HTTP header 或 gateway trust 规则。 |

因此,`R6.20` 的写入对象应定位为“entry 本地 shell / assembly support object”,而不是业务对象、public DTO 或 port trait。

### 2. API entry 对象候选

API entry 负责同步 Command / Query handler assembly、入口 metadata 注入和 application result 的安全映射。它不拥有 domain truth,不直接调用 repository,也不固定 HTTP / RPC 框架。

| 候选对象 | 初步裁决 | 责任边界 | 不进入内容 |
|---|---|---|---|
| `MethodAssetApiEntryContext` | 进入 `R6.20` | 承接 actor context、request metadata、trace/idempotency refs、runtime assembly ref 和 handler-local safe context。 | auth header、HTTP request、route param、raw token、gateway trust decision。 |
| `MethodAssetApiCommandHandlerEntry` | 进入 `R6.20` | 表达 command handler 的本地装配入口,把 command shell 交给 application command service。 | command DTO 字段全集、handler function flow、repository 调用、domain mutation。 |
| `MethodAssetApiQueryHandlerEntry` | 进入 `R6.20` | 表达 query handler 的本地装配入口,把 query shell 交给 application query service。 | query DTO 字段全集、projection refresh、maintenance job 触发、read repair。 |
| `MethodAssetApiResponseAssemblyState` | 进入 `R6.20` | 表达 application outcome 到 protocol response / rejection shell 的安全组装状态。 | HTTP status code、RPC status、transport headers、error code 全表。 |

API 组不单独写 `Route` 或 `TransportRequest` 对象。`routes.rs` 在 Step 4 中只是 route / RPC placeholder,具体协议 schema 和处理流后移 Step 8 / Step 9。

### 3. Worker entry / runner 对象候选

Worker entry 负责 inbound consumer runner、event candidate publisher runner 和 background loop assembly placeholder。它只处理 body-free envelope / candidate / marker / safe diagnostic,不保存外部正文,不恢复 outbox relay。

| 候选对象 | 初步裁决 | 责任边界 | 不进入内容 |
|---|---|---|---|
| `MethodAssetWorkerEntryContext` | 进入 `R6.20` | 承接 worker runtime assembly ref、source binding ref、publisher binding ref、dedup channel ref、safe diagnostic policy ref。 | broker connection、topic、subscription、raw payload、retry policy body。 |
| `MethodAssetInboundConsumerEntry` | 进入 `R6.20` | 表达 inbound consumer 本地入口,把 body-free source envelope / intake shell 转交 application consumer orchestration。 | event payload schema、external document body、consumer loop、ack/nack、dead letter。 |
| `MethodAssetEventPublisherEntry` | 进入 `R6.20` | 表达 event candidate publisher 本地入口,只把已形成的 candidate / handoff marker 交给 publisher adapter。 | outbox event、delivery truth、claim/lease、topic routing、subscriber ack。 |
| `MethodAssetWorkerEntryResultState` | 进入 `R6.20` | 表达 worker 本地 accepted / ignored / rejected / blocked / degraded result state,供 safe diagnostic 和 handoff 使用。 | message ack、broker offset、transport receipt、delivery guarantee。 |

Worker 组中的 event publisher 是 candidate publication boundary,不是可靠投递机制。可靠投递、transport binding、retry 和 idempotency 需要 Step 8 / Step 13 / Step 14 继续闭口。

### 4. Jobs entry / runner 对象候选

Jobs entry 负责 operations job runner assembly,服务 read material refresh、trace / audit / impact refresh、reference refresh、consistency recovery、maintenance progress 和 peripheral refresh。它不得创建或修复 definition、formal version、relation、external summary、package 或 method set truth。

| 候选对象 | 初步裁决 | 责任边界 | 不进入内容 |
|---|---|---|---|
| `MethodAssetJobRunnerContext` | 进入 `R6.20` | 承接 job profile ref、maintenance run ref、refresh scope ref、runtime assembly ref、cursor/checkpoint refs 和 safe diagnostic policy ref。 | cron 表达式、scheduler product、queue lease、worker thread lifecycle。 |
| `MethodAssetOperationJobEntry` | 进入 `R6.20` | 表达 operations job 本地入口,把 job input shell 交给 application job orchestration。 | job DTO 字段全集、function flow、core truth repair、repository 细节。 |
| `MethodAssetJobProgressAssemblyState` | 进入 `R6.20` | 表达 job progress / partial failure / stale / degraded / report boundary 的本地组装状态。 | report body、artifact body、metrics body、external system response。 |
| `MethodAssetJobEntryResultState` | 进入 `R6.20` | 表达 completed / partial / blocked / failed / degraded 的 safe result state,供 report / handoff / observability 后续承接。 | scheduler status、process exit code 语义、retry loop、dead letter。 |

Jobs 组不把 job runner 写成独立业务 owner。`application` 仍是 job orchestration owner,`domain` 提供 task/progress/convergence policy,`infra` 提供 store / resolver / runtime adapter。

### 5. 统一候选池裁决

`R6.20` 可写入以下 12 个对象卡片:

| 分组 | 对象 | 所属模块 | 类型定位 |
|---|---|---|---|
| API entry | `MethodAssetApiEntryContext` | `api` | entry local context object |
| API entry | `MethodAssetApiCommandHandlerEntry` | `api` | command handler entry object |
| API entry | `MethodAssetApiQueryHandlerEntry` | `api` | query handler entry object |
| API entry | `MethodAssetApiResponseAssemblyState` | `api` | response assembly state |
| Worker entry | `MethodAssetWorkerEntryContext` | `worker` | runner local context object |
| Worker entry | `MethodAssetInboundConsumerEntry` | `worker` | inbound consumer entry object |
| Worker entry | `MethodAssetEventPublisherEntry` | `worker` | event candidate publisher entry object |
| Worker entry | `MethodAssetWorkerEntryResultState` | `worker` | worker entry result state |
| Jobs entry | `MethodAssetJobRunnerContext` | `jobs` | job runner local context object |
| Jobs entry | `MethodAssetOperationJobEntry` | `jobs` | operations job entry object |
| Jobs entry | `MethodAssetJobProgressAssemblyState` | `jobs` | job progress assembly state |
| Jobs entry | `MethodAssetJobEntryResultState` | `jobs` | job entry result state |

这 12 个对象只表达 entry / runner 层的本地装配与安全结果状态。若 `R6.20` 写入时发现某对象需要协议字段、port 方法、topic、cron、transport route 或具体 flow 才能成立,必须暂停并把该对象降级为 Step 8 / Step 9 / Step 14 候选,不得在 Step 6 私补 schema。

### 6. 明确后移项

| 后移项 | 后移位置 | R6.19 裁决 |
|---|---|---|
| command / query request / response DTO 字段全集 | Step 8 | `R6.20` 只引用 contracts shell / refs,不写 DTO body。 |
| inbound event envelope schema / outbound event candidate payload | Step 8 | worker entry 只写 body-free shell 承接,不写 payload schema。 |
| handler / consumer / publisher / job function flow | Step 9 | `R6.20` 只写 entry object 的责任、字段来源和不变量。 |
| consumer loop、publisher loop、scheduler、cron、queue、retry、dead letter | Step 13 / Step 14 / 实施计划 | 当前只写 runner local object,不写运行机制。 |
| application port trait / publisher trait / source adapter trait | Step 7 | entry object 不定义方法签名。 |
| persistence / report artifact / run evidence schema | Step 11 / Step 16 | job result state 不写 artifact body 或 evidence schema。 |
| config key、transport binding、adapter product | Step 14 | context 只承接 typed config / binding refs,不写 key 或产品参数。 |

### 7. `R6.20` 写入边界

`R6.20` 写入时可以为每个对象写:

- 所属模块、capability、对象类型和结构责任。
- 来源回指到 Step 4 / Step 5 / `02-概要设计.md` 的 entry / runner / interface skeleton 结论。
- 字段骨架,但字段必须来自 typed ref、metadata shell、runtime assembly state、application result、safe diagnostic 或 formally loaded candidate。
- 成员能力、工厂边界和不变量 / 禁止事项。
- 后续 Step 承接提示。

`R6.20` 不得写入:

- transport DTO 字段全集、HTTP route、RPC method、topic、subscription、cron、queue、scheduler、broker ack、delivery receipt。
- handler / consumer / publisher / job 的完整流程。
- port trait、repository trait、adapter method、persistence schema、config key、test case schema。
- domain truth mutation、core truth repair、projection refresh 细节或 external body / report body。
- 正式 `03-详细设计.md`、`R6.21`、Step 7 或后续 Step。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 api / worker / jobs entry object 候选裁决 | 是。 |
| 是否明确 `R6.20` 写入 12 个对象卡片 | 是。 |
| 是否写入 entry 对象卡片正文 | 否。 |
| 是否写 transport DTO、HTTP route、topic、cron、runner lifecycle 或 function flow | 否。 |
| 是否写 port trait、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.20` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.20 api / worker / jobs entry object:再写入`;只允许写入 `MethodAssetApiEntryContext`、`MethodAssetApiCommandHandlerEntry`、`MethodAssetApiQueryHandlerEntry`、`MethodAssetApiResponseAssemblyState`、`MethodAssetWorkerEntryContext`、`MethodAssetInboundConsumerEntry`、`MethodAssetEventPublisherEntry`、`MethodAssetWorkerEntryResultState`、`MethodAssetJobRunnerContext`、`MethodAssetOperationJobEntry`、`MethodAssetJobProgressAssemblyState`、`MethodAssetJobEntryResultState` 对象卡片;不得写 transport DTO、HTTP route、topic、cron、runner lifecycle、function flow、port trait、persistence schema、config key 或 test case schema;不得修改正式 `03-详细设计.md`;不得进入 `R6.21`、Step 7 或后续 Step。

---

## R6.20 api / worker / jobs entry object:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R6.20 api / worker / jobs entry object:再写入`。 |
| 本模块目标 | 写入 api / worker / jobs 三个 entry / runner crate 的本地对象卡片,为 Step 8 / Step 9 承接 handler、consumer、publisher 和 job runner 协议与流程做准备。 |
| 当前状态 | completed |
| 禁止范围 | transport DTO、HTTP route、topic、cron、runner lifecycle、function flow、port trait、persistence schema、config key、test case schema、正式 `03-详细设计.md`。 |

### 2. API 对象卡片: `MethodAssetApiEntryContext`

```rust
pub struct MethodAssetApiEntryContext;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `api` |
| 所属 capability | command / query synchronous entry context |
| 对象类型 | entry local context object |
| 结构责任 | 承接同步入口已经完成转译的 actor、request metadata、trace、idempotency、runtime assembly 和 handler-local safe context,供 command / query handler 组装 application 调用。 |
| 来源回指 | `02-概要设计.md` §7 / §8 / §11;`03_ddd_step_04_module_layout.md` api `command_handlers.rs` / `query_handlers.rs`;`03_ddd_step_05_module_contracts.md` entry / runner 边界;`R6.19` API entry 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `api_entry_context_ref` | `MethodAssetApiEntryContextRef` | api entry factory 为一次同步入口处理创建的 typed ref。 |
| `actor_context_ref` | `MethodAssetActorContextRef` | contracts metadata shell 中已转译的 actor context ref。 |
| `request_metadata_ref` | `MethodAssetRequestMetadataRef` | contracts command / query metadata shell。 |
| `trace_context_ref` | `MethodAssetTraceContextRef` | 上游入口或 runtime context 注入的 trace typed ref。 |
| `idempotency_context_ref` | `Option<MethodAssetIdempotencyContextRef>` | command metadata 或 application idempotency precheck 输入;query 可为空。 |
| `runtime_assembly_state_ref` | `MethodAssetRuntimeAssemblyStateRef` | infra runtime builder 输出的 assembly state ref。 |
| `entry_safe_context_ref` | `MethodAssetEntrySafeContextRef` | api handler precheck 输出的 safe local context ref。 |
| `safe_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | entry precheck / runtime assembly 的 redacted diagnostics。 |

| 成员能力 | 作用 |
|---|---|
| `assert_transport_neutral()` | 校验 context 不包含 HTTP request、route、header、RPC method 或 raw token。 |
| `for_command_handler()` | 标记当前 context 可服务 command handler assembly。 |
| `for_query_handler()` | 标记当前 context 可服务 query handler assembly。 |
| `to_application_context_input()` | 输出 application 可复制的 actor、metadata、trace、idempotency 和 runtime refs。 |

| 工厂边界 | 作用 |
|---|---|
| `from_command_metadata(actor_context_ref, metadata_ref, runtime_assembly_state_ref)` | 从 command metadata 和 runtime assembly 创建 command entry context。 |
| `from_query_metadata(actor_context_ref, metadata_ref, runtime_assembly_state_ref)` | 从 query metadata 和 runtime assembly 创建 query entry context。 |
| `blocked_by_runtime(runtime_assembly_state_ref, diagnostic_refs)` | runtime assembly 不可用时创建 blocked context。 |
| `with_safe_context(entry_safe_context_ref)` | 附加 handler-local safe context,不读取 transport body。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_transport_body | 不保存 HTTP body、RPC payload、route param、header、raw token 或 gateway decision。 |
| no_domain_truth | 不保存 definition、catalog、formal version、relation、package 等 domain truth body。 |
| no_direct_repository | context 不携带 repository、store、transaction 或 adapter method。 |
| context_ref_only | 所有入口信息必须以 typed ref / metadata shell / safe diagnostic ref 承接。 |

### 3. API 对象卡片: `MethodAssetApiCommandHandlerEntry`

```rust
pub struct MethodAssetApiCommandHandlerEntry;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `api` |
| 所属 capability | command handler entry assembly |
| 对象类型 | command handler entry object |
| 结构责任 | 表达同步 Command handler 的本地装配入口,将 contracts command shell、entry context 和 runtime binding 安全交给 application command orchestration。 |
| 来源回指 | `02-概要设计.md` §7 Command API / §8 Command write path;`03_ddd_step_04_module_layout.md` api `command_handlers.rs`;`03_ddd_step_05_module_contracts.md` command / query entry boundary;`R6.19` API entry 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `command_handler_entry_ref` | `MethodAssetApiCommandHandlerEntryRef` | api command handler factory 创建的 handler entry ref。 |
| `api_entry_context_ref` | `MethodAssetApiEntryContextRef` | 当前同步入口 context。 |
| `command_family_kind` | `MethodAssetCommandFamilyKind` | contracts command shell 的 command family marker。 |
| `command_shell_ref` | `MethodAssetCommandShellRef` | Step 8 contracts command request shell 的 typed ref;本对象不展开 DTO body。 |
| `application_dispatch_ref` | `MethodAssetApplicationDispatchRef` | application command orchestration dispatch target 的 typed ref。 |
| `runtime_assembly_state_ref` | `MethodAssetRuntimeAssemblyStateRef` | entry context 复制的 runtime assembly state ref。 |
| `precheck_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | entry validation / runtime binding precheck 的 redacted diagnostics。 |
| `blocked_reason_ref` | `Option<MethodAssetEntryBlockedReasonRef>` | handler 被 metadata、runtime 或 boundary precheck 阻塞时的 safe reason。 |

| 成员能力 | 作用 |
|---|---|
| `assert_command_only()` | 校验该 entry 只承接 command shell,不承接 query/job/consumer shell。 |
| `assert_no_direct_mutation()` | 校验 handler entry 不直接写 repository 或 domain truth。 |
| `as_application_dispatch_input()` | 输出 application command orchestration 可复制的 command shell 和 context refs。 |
| `mark_blocked(reason_ref, diagnostic_refs)` | 表达 entry precheck blocked,不执行 command mutation。 |

| 工厂边界 | 作用 |
|---|---|
| `ready(api_entry_context_ref, command_shell_ref, application_dispatch_ref)` | 创建可派发给 application 的 command handler entry。 |
| `blocked(api_entry_context_ref, command_shell_ref, reason_ref, diagnostic_refs)` | 创建 blocked command handler entry。 |
| `unsupported_command_family(api_entry_context_ref, command_family_kind, reason_ref)` | command family 未受本 entry 支持时创建 safe blocked entry。 |
| `runtime_unavailable(api_entry_context_ref, diagnostic_refs)` | runtime assembly 不可用时创建 blocked entry。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_dto_body | 不保存 command DTO 字段全集、raw request body 或 transport-specific representation。 |
| no_repository_call | 不定义 repository、UoW、adapter 或 transaction 方法。 |
| no_flow_sequence | 不写 command 处理顺序、domain factory 调用顺序或 rollback 规则。 |
| application_only_dispatch | command handler entry 只能转交 application orchestration,不得直接依赖 domain。 |

### 4. API 对象卡片: `MethodAssetApiQueryHandlerEntry`

```rust
pub struct MethodAssetApiQueryHandlerEntry;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `api` |
| 所属 capability | query handler entry assembly |
| 对象类型 | query handler entry object |
| 结构责任 | 表达同步 Query handler 的本地装配入口,将 contracts query shell、entry context 和 runtime binding 安全交给 application query orchestration。 |
| 来源回指 | `02-概要设计.md` §7 Query API / §8 Query read path;`03_ddd_step_04_module_layout.md` api `query_handlers.rs`;`03_ddd_step_05_module_contracts.md` query no-write boundary;`R6.19` API entry 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `query_handler_entry_ref` | `MethodAssetApiQueryHandlerEntryRef` | api query handler factory 创建的 handler entry ref。 |
| `api_entry_context_ref` | `MethodAssetApiEntryContextRef` | 当前同步入口 context。 |
| `query_family_kind` | `MethodAssetQueryFamilyKind` | contracts query shell 的 query family marker。 |
| `query_shell_ref` | `MethodAssetQueryShellRef` | Step 8 contracts query request shell 的 typed ref;本对象不展开 DTO body。 |
| `application_read_dispatch_ref` | `MethodAssetApplicationReadDispatchRef` | application query orchestration dispatch target 的 typed ref。 |
| `read_surface_hint_ref` | `Option<MethodAssetReadSurfaceHintRef>` | contracts metadata 或 handler precheck 给出的 safe read surface hint。 |
| `runtime_assembly_state_ref` | `MethodAssetRuntimeAssemblyStateRef` | entry context 复制的 runtime assembly state ref。 |
| `precheck_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | query entry validation / runtime binding precheck 的 redacted diagnostics。 |

| 成员能力 | 作用 |
|---|---|
| `assert_query_only()` | 校验该 entry 只承接 query shell。 |
| `assert_no_write_intent()` | 校验 query entry 不携带 command、job request、maintenance mutation 或 repair intent。 |
| `as_application_read_input()` | 输出 application query orchestration 可复制的 query shell 和 context refs。 |
| `with_read_surface_hint(hint_ref)` | 附加 safe read surface hint,不触发 refresh。 |

| 工厂边界 | 作用 |
|---|---|
| `ready(api_entry_context_ref, query_shell_ref, application_read_dispatch_ref)` | 创建可派发给 application query service 的 query handler entry。 |
| `blocked(api_entry_context_ref, query_shell_ref, reason_ref, diagnostic_refs)` | 创建 blocked query handler entry。 |
| `unsupported_query_family(api_entry_context_ref, query_family_kind, reason_ref)` | query family 未受本 entry 支持时创建 safe blocked entry。 |
| `runtime_unavailable(api_entry_context_ref, diagnostic_refs)` | runtime assembly 不可用时创建 blocked query entry。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| query_no_write | Query handler entry 不创建、刷新、修复或删除任何 truth / material。 |
| no_projection_refresh | 不启动 projection refresh、maintenance job 或 read repair。 |
| no_dto_body | 不保存 query DTO body、filter body、sort body 或 raw request payload。 |
| no_transport_mapping | 不定义 HTTP status、route、RPC method 或 response transport mapping。 |

### 5. API 对象卡片: `MethodAssetApiResponseAssemblyState`

```rust
pub struct MethodAssetApiResponseAssemblyState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `api` |
| 所属 capability | response / rejection assembly |
| 对象类型 | response assembly state |
| 结构责任 | 表达 application outcome 到 contracts response / rejection shell 的安全组装状态,只承接 safe result refs、diagnostic refs 和 redaction / degraded markers。 |
| 来源回指 | `02-概要设计.md` §7 Command / Query output;`02-概要设计.md` §10 error boundary;`03_ddd_step_04_module_layout.md` api `errors.rs`;`R6.16` stored / degraded decision;`R6.19` API response assembly 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `response_assembly_state_ref` | `MethodAssetApiResponseAssemblyStateRef` | api response assembler 创建的 assembly state ref。 |
| `api_entry_context_ref` | `MethodAssetApiEntryContextRef` | 当前同步入口 context。 |
| `operation_result_ref` | `Option<MethodAssetStoredOperationResultRef>` | application accepted / replayed command result 或 query read result 的 safe ref。 |
| `protocol_response_shell_ref` | `Option<MethodAssetProtocolResponseShellRef>` | Step 8 contracts response shell typed ref。 |
| `protocol_rejection_shell_ref` | `Option<MethodAssetProtocolRejectionShellRef>` | Step 8 contracts rejection shell typed ref。 |
| `safe_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | application / infra / entry 输出的 redacted diagnostics。 |
| `degraded_decision_ref` | `Option<MethodAssetDegradedDecisionRef>` | application degraded decision 输出。 |
| `assembly_status_kind` | `MethodAssetApiAssemblyStatusKind` | ready / rejected / degraded / blocked / unavailable。 |

| 成员能力 | 作用 |
|---|---|
| `assert_single_surface()` | 校验 response shell 与 rejection shell 不同时作为成功输出。 |
| `assert_safe_output()` | 校验组装结果不含 raw payload、stack trace、secret 或 external body。 |
| `as_protocol_success()` | 输出可由 Step 8 承接的 success response shell ref。 |
| `as_protocol_rejection()` | 输出可由 Step 8 承接的 rejection shell ref。 |

| 工厂边界 | 作用 |
|---|---|
| `from_accepted_result(api_entry_context_ref, operation_result_ref, response_shell_ref)` | 从 application accepted result 建立 response assembly state。 |
| `from_query_result(api_entry_context_ref, operation_result_ref, response_shell_ref)` | 从 application query result 建立 response assembly state。 |
| `from_rejection(api_entry_context_ref, rejection_shell_ref, diagnostic_refs)` | 从 safe rejection 建立 assembly state。 |
| `degraded(api_entry_context_ref, degraded_decision_ref, diagnostic_refs)` | 从 degraded decision 建立 degraded assembly state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_http_status | 不定义 HTTP status、header、route、RPC status 或 transport error code。 |
| no_raw_error | 不保存 stack trace、raw exception、provider body、SQL error 或 payload excerpt。 |
| shell_only | 只引用 protocol shell ref,不展开 command / query response DTO body。 |
| no_truth_change | response assembly 不改变 application result、domain truth 或 read material。 |

### 6. Worker 对象卡片: `MethodAssetWorkerEntryContext`

```rust
pub struct MethodAssetWorkerEntryContext;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `worker` |
| 所属 capability | inbound consumer / event candidate publisher runner context |
| 对象类型 | runner local context object |
| 结构责任 | 承接 worker runtime assembly、inbound source binding、publisher binding、dedup channel、safe diagnostic policy 和 background assembly marker,为 consumer / publisher entry 提供本地上下文。 |
| 来源回指 | `02-概要设计.md` §7 Inbound Event Consumer / Outbound Event;`02-概要设计.md` §11 transport binding;`03_ddd_step_04_module_layout.md` worker `consumers.rs` / `event_publishers.rs`;`R6.18` infra binding state;`R6.19` worker entry 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `worker_entry_context_ref` | `MethodAssetWorkerEntryContextRef` | worker entry factory 为一次 runner invocation 创建的 typed ref。 |
| `runtime_assembly_state_ref` | `MethodAssetRuntimeAssemblyStateRef` | infra runtime builder 输出。 |
| `inbound_source_binding_ref` | `Option<MethodAssetInboundSourceBindingStateRef>` | inbound source adapter binding state。 |
| `publisher_binding_ref` | `Option<MethodAssetPublisherBindingStateRef>` | event candidate publisher binding state。 |
| `dedup_channel_ref` | `Option<MethodAssetDedupChannelRef>` | contracts / application idempotency channel typed ref。 |
| `safe_diagnostic_policy_ref` | `MethodAssetSafeDiagnosticPolicyRef` | runtime / infra 提供的 redacted diagnostic policy ref。 |
| `background_assembly_marker_ref` | `Option<MethodAssetBackgroundAssemblyMarkerRef>` | worker background assembly placeholder marker。 |
| `availability_state_ref` | `MethodAssetAdapterAvailabilityStateRef` | 当前 worker 所需 adapter 的 availability state。 |

| 成员能力 | 作用 |
|---|---|
| `assert_worker_only()` | 校验 context 不被 api 或 jobs entry 复用。 |
| `supports_inbound_consumer()` | 判断 context 是否具备 inbound source binding。 |
| `supports_event_publisher()` | 判断 context 是否具备 publisher binding。 |
| `as_safe_runner_context()` | 输出 consumer / publisher entry 可复制的 body-free runner context。 |

| 工厂边界 | 作用 |
|---|---|
| `for_inbound(runtime_assembly_state_ref, inbound_source_binding_ref, dedup_channel_ref)` | 创建 inbound consumer context。 |
| `for_publisher(runtime_assembly_state_ref, publisher_binding_ref)` | 创建 event candidate publisher context。 |
| `combined(runtime_assembly_state_ref, inbound_source_binding_ref, publisher_binding_ref)` | 创建同时具备 inbound / publisher binding 的 worker context。 |
| `blocked(runtime_assembly_state_ref, availability_state_ref, diagnostic_ref)` | adapter unavailable / blocked 时创建 safe blocked context。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_transport_payload | 不保存 broker message、webhook payload、topic、subscription、offset、ack state 或 raw envelope。 |
| no_loop_lifecycle | 不表达 loop、backoff、retry、thread、lease、dead letter 或 scheduler lifecycle。 |
| no_outbox_relay | 不恢复 outbox event、claim、lease、relay、delivery receipt 或 subscriber ack。 |
| no_cross_entry_dependency | 不依赖 api / jobs entry context。 |

### 7. Worker 对象卡片: `MethodAssetInboundConsumerEntry`

```rust
pub struct MethodAssetInboundConsumerEntry;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `worker` |
| 所属 capability | body-free inbound consumer entry |
| 对象类型 | inbound consumer entry object |
| 结构责任 | 表达外部摘要与引用 inbound consumer 的本地入口,将 body-free source envelope / intake shell 安全交给 application consumer orchestration。 |
| 来源回指 | `02-概要设计.md` §7 Inbound Consumer / §8 Inbound Consumer flow;`03_ddd_step_04_module_layout.md` worker `consumers.rs`;`R6.16` inbound intake decision;`R6.18` inbound source binding;`R6.19` inbound consumer 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `inbound_consumer_entry_ref` | `MethodAssetInboundConsumerEntryRef` | worker inbound entry factory 创建的 typed ref。 |
| `worker_entry_context_ref` | `MethodAssetWorkerEntryContextRef` | 当前 worker local context。 |
| `inbound_source_binding_ref` | `MethodAssetInboundSourceBindingStateRef` | infra inbound source binding state。 |
| `source_event_metadata_ref` | `MethodAssetSourceEventMetadataRef` | contracts inbound event metadata shell。 |
| `body_free_intake_shell_ref` | `MethodAssetInboundIntakeShellRef` | Step 8 inbound body-free shell typed ref。 |
| `schema_version_ref` | `MethodAssetInboundSchemaVersionRef` | inbound source binding 或 source metadata 提供的 schema version ref。 |
| `dedup_key_ref` | `MethodAssetDedupKeyRef` | source event metadata / idempotency channel 提供的 dedup key ref。 |
| `intake_decision_ref` | `Option<MethodAssetInboundIntakeDecisionRef>` | application inbound intake decision 输出或 precheck blocked 输入。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free()` | 校验 inbound shell 不含外部正文、artifact body、provider payload 或 document body。 |
| `assert_supported_schema()` | 校验 schema / version 已由 source binding 支持。 |
| `as_application_intake_input()` | 输出 application consumer orchestration 可复制的 body-free intake refs。 |
| `mark_ignored_or_rejected(decision_ref)` | 表达 ignored / rejected intake decision,不创建业务 truth。 |

| 工厂边界 | 作用 |
|---|---|
| `ready(worker_entry_context_ref, body_free_intake_shell_ref, dedup_key_ref)` | 创建可交给 application 的 inbound consumer entry。 |
| `unsupported_schema(worker_entry_context_ref, schema_version_ref, diagnostic_ref)` | unsupported schema 时创建 rejected / blocked entry。 |
| `duplicate(worker_entry_context_ref, dedup_key_ref, intake_decision_ref)` | duplicate inbound event 时创建 ignored / replay-safe entry。 |
| `blocked_by_source(worker_entry_context_ref, inbound_source_binding_ref, diagnostic_ref)` | source unavailable / disabled 时创建 blocked entry。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_external_body | 不保存 raw document、webhook payload、artifact body、archive content、provider response 或 evidence body。 |
| no_truth_creation | inbound entry 本身不创建 formal version、relation、package、method set 或 maintenance truth。 |
| no_ack_semantics | 不表达 ack/nack、offset commit、consumer group、retry 或 dead letter。 |
| body_free_shell_only | 所有 inbound input 只能经 contracts body-free shell 和 typed metadata refs 承接。 |

### 8. Worker 对象卡片: `MethodAssetEventPublisherEntry`

```rust
pub struct MethodAssetEventPublisherEntry;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `worker` |
| 所属 capability | outbound event candidate publisher entry |
| 对象类型 | event candidate publisher entry object |
| 结构责任 | 表达 outbound event candidate publisher 的本地入口,将已成立的 event candidate / handoff marker 安全交给 publisher adapter binding。 |
| 来源回指 | `02-概要设计.md` §7 Outbound Event / §8 event candidate boundary;`03_ddd_step_04_module_layout.md` worker `event_publishers.rs`;`R6.16` event candidate assembly;`R6.18` publisher binding;`R6.19` event publisher 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `event_publisher_entry_ref` | `MethodAssetEventPublisherEntryRef` | worker publisher entry factory 创建的 typed ref。 |
| `worker_entry_context_ref` | `MethodAssetWorkerEntryContextRef` | 当前 worker local context。 |
| `publisher_binding_ref` | `MethodAssetPublisherBindingStateRef` | infra publisher binding state。 |
| `event_candidate_ref` | `MethodAssetEventCandidateRef` | application event candidate assembly 输出。 |
| `event_family_kind` | `MethodAssetEventFamilyKind` | candidate shell 的 event family marker。 |
| `publication_boundary_marker_ref` | `MethodAssetPublicationBoundaryMarkerRef` | publisher binding 输出的 boundary marker。 |
| `handoff_target_ref_set` | `MethodAssetHandoffTargetRefSet` | publisher binding / handoff binding 提供的 body-free target refs。 |
| `publication_decision_ref` | `Option<MethodAssetPublicationDecisionRef>` | publisher adapter precheck 或 application publication boundary 输出。 |

| 成员能力 | 作用 |
|---|---|
| `assert_candidate_only()` | 校验 entry 只处理 event candidate,不处理 delivery truth。 |
| `assert_supported_event_family()` | 校验 publisher binding 支持 candidate 的 event family。 |
| `as_publisher_adapter_input()` | 输出 publisher adapter 可复制的 candidate ref 和 boundary marker。 |
| `mark_blocked(decision_ref)` | 表达 publisher blocked / unavailable,不撤销 candidate 来源事实。 |

| 工厂边界 | 作用 |
|---|---|
| `ready(worker_entry_context_ref, publisher_binding_ref, event_candidate_ref)` | 创建可交给 publisher adapter 的 event publisher entry。 |
| `unsupported_event_family(worker_entry_context_ref, event_candidate_ref, diagnostic_ref)` | event family 不受支持时创建 blocked entry。 |
| `publisher_unavailable(worker_entry_context_ref, publisher_binding_ref, diagnostic_ref)` | publisher binding unavailable 时创建 blocked entry。 |
| `handoff_blocked(worker_entry_context_ref, event_candidate_ref, decision_ref)` | handoff target blocked 时创建 safe blocked entry。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| candidate_not_delivery | 不保存 delivery receipt、subscriber ack、transport status、topic routing 或 retry outcome。 |
| no_outbox_claim | 不恢复 outbox table、claim、lease、relay、dead letter 或 replay cursor。 |
| no_payload_body | 不展开 event payload body、external body、report body 或 subscriber-specific body。 |
| truth_not_rolled_back | publisher unavailable / blocked 不回滚已成立 truth 或 event candidate 来源。 |

### 9. Worker 对象卡片: `MethodAssetWorkerEntryResultState`

```rust
pub struct MethodAssetWorkerEntryResultState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `worker` |
| 所属 capability | worker entry safe result state |
| 对象类型 | runner local result state |
| 结构责任 | 表达 inbound consumer / event publisher 本地入口的 accepted、ignored、rejected、blocked、degraded 或 unavailable 结果状态,供 safe diagnostic、handoff 和 observability 后续承接。 |
| 来源回指 | `02-概要设计.md` §10 error / unavailable branch;`03_ddd_step_04_module_layout.md` worker `errors.rs`;`R6.16` inbound intake / degraded decision;`R6.18` infra safe diagnostic;`R6.19` worker result 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `worker_entry_result_state_ref` | `MethodAssetWorkerEntryResultStateRef` | worker entry result assembler 创建的 typed ref。 |
| `worker_entry_context_ref` | `MethodAssetWorkerEntryContextRef` | 当前 worker local context。 |
| `entry_kind` | `MethodAssetWorkerEntryKind` | inbound_consumer / event_publisher / background_assembly marker。 |
| `worker_result_kind` | `MethodAssetWorkerResultKind` | accepted / ignored / rejected / blocked / degraded / unavailable。 |
| `intake_decision_ref` | `Option<MethodAssetInboundIntakeDecisionRef>` | inbound consumer application decision 输出。 |
| `publication_decision_ref` | `Option<MethodAssetPublicationDecisionRef>` | event publisher boundary decision 输出。 |
| `safe_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | entry、adapter 或 application 输出的 redacted diagnostics。 |
| `handoff_hint_ref` | `Option<MethodAssetHandoffHintRef>` | 后续 handoff / observability 可复制的 safe hint。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free_result()` | 校验 result state 不含 external payload、event payload、transport receipt 或 raw error。 |
| `is_terminal_for_entry()` | 判断本地 entry 是否已经形成安全终态。 |
| `as_safe_diagnostic_input()` | 输出 Step 12 / Step 15 可复制的 diagnostics 和 safe reason。 |
| `with_handoff_hint(hint_ref)` | 附加 handoff hint,不执行外部写入。 |

| 工厂边界 | 作用 |
|---|---|
| `accepted(worker_entry_context_ref, decision_ref)` | 从 accepted intake / publication decision 建立 result state。 |
| `ignored(worker_entry_context_ref, decision_ref)` | 从 duplicate / no-op decision 建立 ignored result state。 |
| `rejected(worker_entry_context_ref, decision_ref, diagnostic_refs)` | 从 safe rejection 建立 result state。 |
| `blocked(worker_entry_context_ref, diagnostic_refs)` | 从 source / publisher unavailable 或 binding blocked 建立 result state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_broker_result | 不保存 ack、offset、consumer group、delivery receipt、subscriber response 或 broker error body。 |
| no_retry_state | 不表达 retry count、backoff、dead letter、lease 或 loop lifecycle。 |
| no_truth_mutation | result state 不改变 domain truth、event candidate 来源事实或 read material。 |
| safe_result_only | 结果只能以 typed decision、safe diagnostic、safe reason 和 hint ref 表达。 |

### 10. Jobs 对象卡片: `MethodAssetJobRunnerContext`

```rust
pub struct MethodAssetJobRunnerContext;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `jobs` |
| 所属 capability | operations job runner context |
| 对象类型 | job runner local context object |
| 结构责任 | 承接 operations job profile、maintenance run、refresh scope、runtime assembly、cursor / checkpoint 和 safe diagnostic policy,为具体 job entry 组装 application job orchestration 输入。 |
| 来源回指 | `02-概要设计.md` §7 Operations Job / §8 后台维护与收敛;`02-概要设计.md` §11 job profile;`03_ddd_step_04_module_layout.md` jobs `read_material_refresh.rs` / `trace_material_refresh.rs` / `reference_refresh.rs` / `consistency_recovery.rs`;`R6.16` job assembly context;`R6.19` jobs entry 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `job_runner_context_ref` | `MethodAssetJobRunnerContextRef` | jobs runner factory 为一次 job invocation 创建的 typed ref。 |
| `runtime_assembly_state_ref` | `MethodAssetRuntimeAssemblyStateRef` | infra runtime builder 输出。 |
| `job_profile_ref` | `MethodAssetJobProfileRef` | validated config binding 或 job input shell 提供的 job profile ref。 |
| `maintenance_run_ref` | `MethodAssetMaintenanceRunRef` | contracts job shell 或 application maintenance request 提供的 run ref。 |
| `refresh_scope_ref` | `MethodAssetRefreshScopeRef` | job input shell / maintenance request 提供的 scope ref。 |
| `job_cursor_ref` | `Option<MethodAssetJobCursorRef>` | application job orchestration 或 previous progress state 提供的 cursor ref。 |
| `checkpoint_ref` | `Option<MethodAssetJobCheckpointRef>` | persisted progress / previous run summary 提供的 checkpoint ref。 |
| `safe_diagnostic_policy_ref` | `MethodAssetSafeDiagnosticPolicyRef` | runtime / config binding 提供的 diagnostic policy ref。 |

| 成员能力 | 作用 |
|---|---|
| `assert_jobs_only()` | 校验 context 不被 api / worker entry 复用。 |
| `assert_no_core_repair()` | 校验 context 不携带修复 core truth 的 intent。 |
| `as_application_job_context()` | 输出 application job orchestration 可复制的 run、scope、profile 和 cursor refs。 |
| `with_checkpoint(checkpoint_ref)` | 附加 checkpoint ref,不读取 artifact body。 |

| 工厂边界 | 作用 |
|---|---|
| `for_refresh(runtime_assembly_state_ref, job_profile_ref, maintenance_run_ref, refresh_scope_ref)` | 创建 refresh 类 job runner context。 |
| `for_convergence(runtime_assembly_state_ref, job_profile_ref, maintenance_run_ref, refresh_scope_ref)` | 创建 consistency / convergence 类 job runner context。 |
| `resume_from_checkpoint(runtime_assembly_state_ref, job_profile_ref, checkpoint_ref)` | 从正式 checkpoint ref 创建可恢复 context。 |
| `blocked(runtime_assembly_state_ref, diagnostic_ref)` | runtime / config / store unavailable 时创建 blocked context。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_scheduler_product | 不保存 cron、scheduler product、queue name、lease、thread lifecycle 或 process supervisor 状态。 |
| no_core_truth_repair | 不创建或修复 definition、formal version、relation、external summary、package 或 method set truth。 |
| no_report_body | 不保存 report body、artifact body、metrics body、raw log 或 external response。 |
| context_ref_only | job context 只以 typed run / scope / profile / cursor / diagnostic refs 表达。 |

### 11. Jobs 对象卡片: `MethodAssetOperationJobEntry`

```rust
pub struct MethodAssetOperationJobEntry;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `jobs` |
| 所属 capability | operations job entry assembly |
| 对象类型 | operations job entry object |
| 结构责任 | 表达 read material refresh、trace / audit / impact refresh、reference refresh、consistency recovery、maintenance progress 和 peripheral refresh 的本地 job entry。 |
| 来源回指 | `02-概要设计.md` §7 Operations Job table / §8 后台维护与收敛;`03_ddd_step_04_module_layout.md` jobs files;`03_ddd_step_05_module_contracts.md` jobs runner boundary;`R6.19` operations job entry 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `operation_job_entry_ref` | `MethodAssetOperationJobEntryRef` | jobs entry factory 创建的 typed ref。 |
| `job_runner_context_ref` | `MethodAssetJobRunnerContextRef` | 当前 job runner context。 |
| `job_family_kind` | `MethodAssetJobFamilyKind` | contracts job input shell 的 job family marker。 |
| `job_input_shell_ref` | `MethodAssetJobInputShellRef` | Step 8 contracts job input shell typed ref;本对象不展开 job DTO body。 |
| `application_job_dispatch_ref` | `MethodAssetApplicationJobDispatchRef` | application job orchestration dispatch target 的 typed ref。 |
| `target_material_ref_set` | `MethodAssetJobTargetRefSet` | job input shell / application maintenance request 提供的 target refs。 |
| `safe_execution_boundary_ref` | `MethodAssetJobSafeExecutionBoundaryRef` | application / config precheck 输出的 safe execution boundary ref。 |
| `precheck_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | runtime / store / scope precheck 输出的 redacted diagnostics。 |

| 成员能力 | 作用 |
|---|---|
| `assert_operation_job_only()` | 校验 entry 只承接 operations job,不承接 command/query/consumer。 |
| `assert_scope_bound()` | 校验 job 必须有 maintenance run / refresh scope 或正式 target refs。 |
| `as_application_job_input()` | 输出 application job orchestration 可复制的 input refs。 |
| `mark_precheck_blocked(diagnostic_refs)` | 表达 job precheck blocked,不执行 job body。 |

| 工厂边界 | 作用 |
|---|---|
| `ready(job_runner_context_ref, job_input_shell_ref, application_job_dispatch_ref)` | 创建可交给 application job service 的 job entry。 |
| `unsupported_job_family(job_runner_context_ref, job_family_kind, diagnostic_ref)` | unsupported job family 时创建 blocked entry。 |
| `scope_invalid(job_runner_context_ref, refresh_scope_ref, diagnostic_ref)` | refresh scope invalid 时创建 rejected / blocked entry。 |
| `runtime_unavailable(job_runner_context_ref, diagnostic_refs)` | runtime / store unavailable 时创建 blocked entry。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| job_not_command | job entry 不创建 command result、不改写 core truth、不重做 formalization。 |
| no_job_flow | 不写 batch loop、page loop、retry、checkpoint update 顺序或 recovery algorithm。 |
| no_dto_body | 不保存 job input DTO body、report body、artifact body 或 metrics body。 |
| application_only_dispatch | job entry 只能转交 application job orchestration,不得直接调用 repository。 |

### 12. Jobs 对象卡片: `MethodAssetJobProgressAssemblyState`

```rust
pub struct MethodAssetJobProgressAssemblyState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `jobs` |
| 所属 capability | job progress / report boundary assembly |
| 对象类型 | job progress assembly state |
| 结构责任 | 表达 job progress、partial failure、stale、degraded、checkpoint 和 report boundary 的本地组装状态,只保存 safe refs 和 marker。 |
| 来源回指 | `02-概要设计.md` §6 后台维护与收敛对象轮廓 / §10 maintenance state;`03_ddd_step_04_module_layout.md` jobs `maintenance_progress.rs`;`R6.16` job assembly context;`R6.19` job progress assembly 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `job_progress_assembly_state_ref` | `MethodAssetJobProgressAssemblyStateRef` | jobs progress assembler 创建的 typed ref。 |
| `operation_job_entry_ref` | `MethodAssetOperationJobEntryRef` | 当前 operations job entry。 |
| `maintenance_run_ref` | `MethodAssetMaintenanceRunRef` | job runner context 复制的 run ref。 |
| `progress_view_ref` | `MethodAssetMaintenanceProgressViewRef` | application job orchestration 输出的 progress view ref。 |
| `checkpoint_ref` | `Option<MethodAssetJobCheckpointRef>` | application progress output 或 persisted previous checkpoint ref。 |
| `partial_failure_refs` | `MethodAssetPartialFailureRefSet` | application job result 中的 safe partial failure refs。 |
| `degraded_decision_ref` | `Option<MethodAssetDegradedDecisionRef>` | application degraded decision 输出。 |
| `report_boundary_ref` | `Option<MethodAssetJobReportBoundaryRef>` | report / handoff boundary 的 body-free typed ref。 |

| 成员能力 | 作用 |
|---|---|
| `assert_body_free_progress()` | 校验 progress assembly 不含 report body、raw log、metrics body 或 external response。 |
| `has_partial_failure()` | 判断是否存在 safe partial failure refs。 |
| `as_progress_view()` | 输出 query / observability 可复制的 progress view ref。 |
| `as_report_boundary()` | 输出 report handoff 可复制的 body-free boundary ref。 |

| 工厂边界 | 作用 |
|---|---|
| `from_progress(operation_job_entry_ref, progress_view_ref)` | 从 application progress 输出创建 assembly state。 |
| `partial(operation_job_entry_ref, progress_view_ref, partial_failure_refs)` | 从 partial progress 创建 assembly state。 |
| `degraded(operation_job_entry_ref, degraded_decision_ref, diagnostic_refs)` | 从 degraded decision 创建 progress assembly state。 |
| `with_report_boundary(report_boundary_ref)` | 附加 report boundary ref,不保存 report body。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_report_body | 不保存 markdown、JSON report body、artifact content、metric payload 或 raw log。 |
| no_repair_result | progress assembly 不表达 core truth 修复、formalization 重做或 relation 修复成功。 |
| checkpoint_ref_only | checkpoint 只以 typed ref 承接,不写 durable path、offset、file body 或 queue lease。 |
| safe_partial_only | partial failure 必须是 redacted safe ref,不得保存 exception body。 |

### 13. Jobs 对象卡片: `MethodAssetJobEntryResultState`

```rust
pub struct MethodAssetJobEntryResultState;
```

| 项 | 内容 |
|---|---|
| 所属模块 | `jobs` |
| 所属 capability | job entry safe result state |
| 对象类型 | job runner local result state |
| 结构责任 | 表达 operations job entry 的 completed、partial、blocked、failed、degraded、unavailable 或 replayed safe result state,供 report、handoff、observability 和后续测试切口承接。 |
| 来源回指 | `02-概要设计.md` §10 error / recovery / maintenance state;`03_ddd_step_04_module_layout.md` jobs `errors.rs`;`R6.16` stored operation / job assembly context;`R6.18` infra safe diagnostic;`R6.19` job result 裁决。 |

| 字段骨架 | 类型 | 字段来源 |
|---|---|---|
| `job_entry_result_state_ref` | `MethodAssetJobEntryResultStateRef` | jobs result assembler 创建的 typed ref。 |
| `operation_job_entry_ref` | `MethodAssetOperationJobEntryRef` | 当前 operations job entry。 |
| `job_result_kind` | `MethodAssetJobResultKind` | completed / partial / blocked / failed / degraded / unavailable / replayed。 |
| `stored_operation_result_ref` | `Option<MethodAssetStoredOperationResultRef>` | application stored job result 或 duplicate replay 输出。 |
| `progress_assembly_state_ref` | `Option<MethodAssetJobProgressAssemblyStateRef>` | job progress assembly 输出。 |
| `safe_diagnostic_refs` | `MethodAssetInfraSafeDiagnosticRefSet` | entry / application / infra 输出的 redacted diagnostics。 |
| `handoff_hint_ref` | `Option<MethodAssetHandoffHintRef>` | report / observability / archive handoff 的 safe hint。 |
| `next_action_hint_ref` | `Option<MethodAssetFollowUpHintRef>` | refresh later / formal intervention / reconfigure 的 safe hint。 |

| 成员能力 | 作用 |
|---|---|
| `assert_safe_result()` | 校验 result state 不含 report body、raw log、external response、stack trace 或 scheduler state。 |
| `is_replayable()` | 判断 result state 是否可由 stored operation result replay。 |
| `as_handoff_input()` | 输出 report / observability handoff 可复制的 safe refs。 |
| `requires_follow_up()` | 判断是否存在后续 safe follow-up hint。 |

| 工厂边界 | 作用 |
|---|---|
| `completed(operation_job_entry_ref, stored_operation_result_ref, progress_state_ref)` | 从 completed job output 建立 result state。 |
| `partial(operation_job_entry_ref, progress_state_ref, diagnostic_refs)` | 从 partial job output 建立 result state。 |
| `blocked(operation_job_entry_ref, diagnostic_refs)` | 从 precheck / runtime blocked 建立 result state。 |
| `replayed(operation_job_entry_ref, stored_operation_result_ref)` | 从 duplicate / replayed stored result 建立 result state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no_scheduler_status | 不保存 cron status、process exit code、queue lease、thread lifecycle 或 supervisor state。 |
| no_raw_failure | 不保存 stack trace、raw exception、SQL error、provider response、raw log 或 metric payload。 |
| no_truth_repair_claim | 不声称已修复 core truth,只表达 operations job 本地结果。 |
| safe_handoff_only | handoff 只能使用 body-free refs、safe diagnostic 和 follow-up hint。 |

### 14. 后续 Step 承接

| 后续 Step | 承接内容 | 暂停条件 |
|---|---|---|
| Step 7 | 为 api entry、worker runner、jobs runner 需要的 application dispatch、runtime assembly、publisher、source、handoff、stored result 定义 port / trait。 | entry 对象字段存在但无 application / infra 正式读取面或装配面。 |
| Step 8 | 将 command/query/event/job shell、response / rejection shell、intake shell、job input shell 与本组 entry object 对齐。 | protocol DTO 需要 transport body、topic、HTTP route、report body 或 external body。 |
| Step 9 | 定义 handler、consumer、publisher、job runner 的函数级处理流,并回指本组 context / entry / result object。 | flow 只能从 route、topic、cron、private map 或实现便利推断字段。 |
| Step 10 | 承接 API assembly status、worker result kind、job result kind 和 entry blocked/degraded/unavailable 状态。 | 状态 owner 不清或把 entry local state 当成 domain truth state。 |
| Step 11 | 只为 stored result、progress、checkpoint、report boundary 等正式持久化对象设计 schema。 | 试图持久化 transport request、broker ack、topic、scheduler state 或 raw log。 |
| Step 12 | 将 blocked、rejected、degraded、unavailable、partial failure 映射到 safe error / recovery surface。 | error mapping 需要 raw exception、payload excerpt、provider body 或 report body。 |
| Step 13 | 定义 command idempotency、inbound dedup、publisher replay boundary、job replay / checkpoint 规则。 | duplicate 只能通过重跑 mutation、扫描 queue 或恢复 outbox relay 实现。 |
| Step 14 | 将 runtime assembly、source binding、publisher binding、job profile、diagnostic policy 连接到配置设计。 | config key、URL、topic、secret 或 scheduler 产品进入 Step 6 对象。 |
| Step 15 | 将 safe diagnostic、handoff hint、progress view 和 result state 接入 observability / audit。 | telemetry 或 audit 保存 raw payload、raw log、external body 或 secret。 |
| Step 16 | 为 entry validation、metadata propagation、body-free inbound、candidate-only publisher、job partial failure 和 no-core-repair 建立测试切口。 | 测试需要依赖 HTTP framework、bus topic、scheduler product 或 DB schema 才能表达。 |

### 15. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 12 个 api / worker / jobs entry / runner 对象卡片 | 是。 |
| 是否写入字段骨架、字段来源、成员能力、工厂边界和不变量 / 禁止事项 | 是。 |
| 是否限制为 entry / runner local object,不替代 domain truth、application service、infra adapter 或 public DTO | 是。 |
| 是否写 transport DTO、HTTP route、RPC method、topic、subscription、cron、queue、scheduler、runner lifecycle | 否。 |
| 是否写 handler / consumer / publisher / job function flow | 否。 |
| 是否写 port trait、repository、adapter 方法、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.21` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.21 字段来源与状态主语闭环审计:先思考`;只允许思考高复用字段族、对象组字段来源、状态 owner、shared ref、entry/result kind 和 Step 7~16 暂停条件审计草案;不得补新对象卡片;不得修改正式 `03-详细设计.md`;不得写 trait / port、protocol DTO schema、function flow、状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.22`、Step 7 或后续 Step。

---

## R6.21 字段来源与状态主语闭环审计:先思考

### 1. 思考记录

`R6.21` 的目标不是补对象,而是横向审计 Step 6 已写对象卡片中最容易导致后续实现 blocker 的字段来源、状态主语和 shared ref 口径。前序 `R6.7`~`R6.20` 已按 contracts、domain、application、infra、api / worker / jobs 写入对象卡片,但这些卡片使用了大量复用字段族:

- `*_ref` / `*_refs` / `*_ref_set`
- `*_kind`
- `*_state_ref` / `*_status_kind`
- `*_marker_ref`
- `*_decision_ref`
- `*_diagnostic_refs`
- `*_shell_ref`
- `*_cursor_ref` / `*_checkpoint_ref`
- `*_boundary_ref`
- `*_hint_ref`

这些字段如果不在 Step 6 尾部横向预筛,Step 7~16 很容易出现“对象有字段,但没有 port / protocol / flow / persistence / config / evidence 来源”的落码阻塞。`R6.22` 因此需要写四类表:

| 表 | 目的 | 不做什么 |
|---|---|---|
| 高复用字段族来源表 | 给跨对象重复字段族规定 allowed source、后续闭合 Step 和暂停条件。 | 不枚举所有对象字段值域。 |
| 对象组字段来源表 | 按 contracts/domain/application/infra/entry 分组检查字段来源是否足以进入 Step 7~16。 | 不补新对象卡片。 |
| 状态主语预筛表 | 判断哪些对象拥有状态,哪些只是 marker/ref/shell/result state。 | 不写完整状态矩阵。 |
| Step 7~16 暂停条件表 | 把字段来源缺口转成后续 Step 的设计 blocker 判断规则。 | 不写 trait、DTO、flow、persistence 或 test case。 |

### 2. 高复用字段族审计轴

`R6.22` 应以字段族为第一审计轴,而不是逐对象复述字段清单。字段族审计要回答三个问题:

1. 该字段族的正式来源是什么。
2. 哪个后续 Step 必须闭口。
3. 实现端遇到什么情况必须暂停,不能自行补口。

| 字段族 | 典型出现位置 | R6.21 初判 | R6.22 写入重点 |
|---|---|---|---|
| identity / typed ref | 全部对象的 `*_ref`、`*_refs`、`*_ref_set`。 | 必须来自 contracts ref、factory、repository load、application output 或 infra builder;不得从字符串、路径、route、topic、旧对象名推导。 | 写 allowed source / forbidden source。 |
| family / kind | command/query/event/job family、diagnostic family、result kind、state kind。 | `*_kind` 只能来自 contracts shell marker、domain enum、application decision 或 infra availability output。 | 写 enum owner 与 Step 10/12 承接。 |
| marker | boundary marker、freshness marker、availability marker、publication marker、handoff marker。 | marker 是正式来源的复制结果,不能由 flow 或 adapter 临时拼接。 | 写 marker source 与 Step 7/8/9 暂停条件。 |
| decision | read decision、degraded decision、intake decision、publication decision。 | decision 必须来自 application helper / policy / resolver summary,entry 只能复制。 | 写 decision owner 与禁止 entry 合成。 |
| diagnostic | infra safe diagnostic、redacted issue、safe reason、follow-up hint。 | diagnostic 必须 redacted,由 infra / application 输出;不得保存 raw exception、payload、secret、provider body。 | 写 Step 12/15 承接。 |
| shell | command/query/intake/event/job/protocol response shell。 | shell 属于 contracts / Step 8,Step 6 只能引用 shell ref。 | 写 Step 8 schema 闭口条件。 |
| cursor / checkpoint | projection cursor、job cursor、checkpoint、source cursor。 | 只能来自 committed truth cursor、application progress、persistence state 或正式 previous run。 | 写 Step 11/13 承接。 |
| boundary / scope | consumption boundary、job safe execution boundary、report boundary、refresh scope。 | boundary / scope 必须由 contracts shell、application precheck、policy 或 config binding 输出。 | 写 scope owner 与无法从 route/cron 推断。 |
| hint | refresh hint、handoff hint、follow-up hint、formal intervention hint。 | hint 只提示后续动作,不直接触发 mutation / repair / delivery。 | 写 Step 12/15/17 承接。 |

### 3. 对象组字段来源审计轴

`R6.22` 需要按对象组审计,因为不同组的字段风险不一样。

| 对象组 | 主要字段风险 | R6.21 初判 | R6.22 写入重点 |
|---|---|---|---|
| contracts shared refs / public shell | ref / marker / shell 过早写成 DTO body。 | contracts 对象可提供 public shell ref 和 typed marker,但不能拥有 domain truth。 | 标清 Step 8 才写 protocol schema。 |
| domain core truth | truth identity、state、basis、version、material refs 来源不闭。 | domain 对象必须由 factory / accepted command / formal import / repository load 建立。 | 标清 factory 与 state owner。 |
| domain trace / relation / external / peripheral | lineage、trace、relation、external source、package/set refs 容易混入 external body。 | body-free 边界必须作为所有来源判断前提。 | 标清 external body 禁入和 resolver / summary 来源。 |
| domain policy / guard | rule / guard / boundary 与 command flow 混淆。 | policy / guard 只给 decision / marker / reason,不执行 flow。 | 标清 Step 9 使用方式。 |
| application helper | context、idempotency、stored result、read/degraded/intake/event/job assembly 来源分散。 | application 是 orchestration owner,但不实现 adapter / persistence。 | 标清 Step 7 port 与 Step 13 replay 承接。 |
| infra runtime support | config binding、availability、store/resolver/source/publisher/handoff binding、diagnostic。 | infra 可表达 runtime state,但不能改变 domain invariant。 | 标清 Step 14 config 与 Step 12 diagnostic。 |
| api entry | command/query handler context、dispatch、response assembly。 | api 只能复制 contracts/application/infra refs,不得合成 DTO、route 或 status。 | 标清 Step 8/9 handler 边界。 |
| worker entry | inbound consumer、event publisher、worker result。 | worker 只能处理 body-free shell 和 event candidate,不得恢复 outbox/delivery。 | 标清 event candidate vs delivery。 |
| jobs entry | job context、operation job entry、progress assembly、job result。 | jobs 只承接 operations job,不修 core truth。 | 标清 job progress / checkpoint / report boundary。 |

### 4. 状态主语审计轴

`R6.22` 不写完整状态矩阵,但必须预筛状态主语。预筛要区分“真正拥有状态的对象”和“只是引用状态结果的对象”。

| 状态类别 | 初步 owner | 典型字段 | R6.22 需要判定 |
|---|---|---|---|
| domain truth state | domain truth / state object | `state_kind`、`lifecycle_state_ref`、`formalization_state_ref`。 | 是否必须进入 Step 10 完整矩阵。 |
| policy / guard decision state | domain policy / application decision | `decision_ref`、`boundary_marker_ref`、`reason_ref`。 | 是否只是 decision output,不得当 truth state。 |
| read / projection state | read material / application read decision / infra store binding | `freshness_marker_ref`、`read_surface_hint_ref`、`progress_view_ref`。 | 是否需要 Step 9/10/11 闭口 builder / persistence 来源。 |
| external reference state | external summary / resolver binding / source binding | `schema_version_ref`、`source_binding_ref`、`availability_state_ref`。 | 是否保持 body-free,不得保存 external body。 |
| application technical state | operation context、idempotency、stored result、assembly state | `operation_result_ref`、`stored_operation_result_ref`、`assembly_status_kind`。 | Step 13 必须闭口 duplicate replay / stored result。 |
| infra runtime state | runtime assembly、adapter availability、binding state、diagnostic | `runtime_assembly_state_ref`、`availability_state_ref`、`diagnostic_severity_kind`。 | Step 14/12 闭口 config / unavailable mapping。 |
| entry local state | api/worker/jobs result / assembly state | `worker_result_kind`、`job_result_kind`、`assembly_status_kind`。 | 只能表达 entry local result,不得反写 domain truth。 |

需要特别防止两个误判:

- 把 `*_result_kind` 当成 domain truth lifecycle。
- 把 infra / entry unavailable 状态当成业务对象不可用状态。

### 5. shared ref 与 entry/result kind 审计轴

`R6.20` 引入了大量 entry/result kind。`R6.22` 必须单独审计这些 kind 的归属,否则 Step 8/10/12 会混淆 public protocol、application result 和 local runner state。

| kind / ref 组 | 当前风险 | R6.22 裁决方向 |
|---|---|---|
| `MethodAssetApiAssemblyStatusKind` | 可能被误写成 HTTP status。 | 只表示 API local assembly state;HTTP / RPC 映射后移 Step 8/9。 |
| `MethodAssetWorkerResultKind` | 可能被误写成 broker ack / delivery outcome。 | 只表示 worker entry local safe result;ack/delivery 禁入。 |
| `MethodAssetJobResultKind` | 可能被误写成 scheduler status / process exit code。 | 只表示 operations job safe result;cron/scheduler 禁入。 |
| `MethodAssetCommandFamilyKind` / `MethodAssetQueryFamilyKind` | 可能被 API handler 自行定义。 | 必须来自 contracts protocol shell。 |
| `MethodAssetEventFamilyKind` / `MethodAssetJobFamilyKind` | 可能被 worker/jobs 从 topic / cron 名推导。 | 必须来自 contracts event/job shell 或 application candidate。 |
| `MethodAssetApplicationDispatchRef` / read / job dispatch refs | 可能变成未定义 service locator。 | Step 7 必须给出正式 application dispatch / service boundary。 |
| `MethodAssetProtocolResponseShellRef` / rejection shell ref | 可能被 Step 6 提前写成 DTO body。 | Step 8 必须闭口 response / rejection schema。 |

### 6. Step 7~16 暂停条件审计轴

`R6.22` 的最后一部分应把字段来源风险转成后续 Step 的暂停条件。这里先形成思考结论:

| 后续 Step | R6.21 预判高风险 | R6.22 写入方向 |
|---|---|---|
| Step 7 | 对象字段需要 repository / resolver / publisher / handoff / dispatch / id generator,但没有 port。 | 列出“字段有读取/写入/mapper/resolver缺口即暂停”。 |
| Step 8 | shell ref 需要正式 DTO schema,但 Step 6 只写了 ref。 | 列出“不得由实现端补 DTO body / public marker”。 |
| Step 9 | flow 中某字段在对应时机拿不到。 | 列出“不得从 route/topic/cron/private map 推导”。 |
| Step 10 | 状态 kind owner 不明。 | 列出“状态主语缺口必须回对象/状态矩阵闭口”。 |
| Step 11 | cursor/checkpoint/stored result/progress/ref 需要 durable key。 | 列出“不得用文件路径、queue offset、string concat 当正式 key”。 |
| Step 12 | error / degraded / unavailable 需要 safe diagnostic 或 marker。 | 列出“不得暴露 raw exception / provider body”。 |
| Step 13 | duplicate replay / dedup / checkpoint replay 需要 stored result。 | 列出“不得通过重跑 mutation 或扫描队列恢复”。 |
| Step 14 | runtime binding / profile / config ref 需要正式 config schema。 | 列出“不得把 raw config、secret、URL、topic 写回 Step 6 对象”。 |
| Step 15 | audit / observability 需要 safe subject / diagnostic / handoff refs。 | 列出“不得保存 raw log / payload / metrics body”。 |
| Step 16 | test cut 需要验证字段来源和状态 owner。 | 列出“测试无法构造正式来源时必须暂停回设计”。 |

### 7. `R6.22` 写入边界

`R6.22` 可以写入:

- 高复用字段族来源表。
- 对象组字段来源表。
- 状态主语预筛表。
- shared ref / entry result kind 审计表。
- Step 7~16 暂停条件表。
- Step 6 后续风险提示。

`R6.22` 不得写入:

- 新对象卡片或补充对象字段。
- trait / port / adapter 方法签名。
- protocol DTO / event / job schema。
- handler、consumer、publisher、job function flow。
- 完整状态矩阵、persistence schema、config key、test case schema。
- 正式 `03-详细设计.md`。
- `R6.23`、Step 7 或后续 Step。

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成字段来源与状态主语审计思考 | 是。 |
| 是否形成 `R6.22` 四类写入表的边界 | 是。 |
| 是否补新对象卡片 | 否。 |
| 是否写 trait / port、protocol DTO schema、function flow、状态矩阵、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.22` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.22 字段来源与状态主语闭环审计:再写入`;只允许写入高复用字段族来源表、对象组字段来源表、状态主语预筛表、shared ref / entry result kind 审计表和 Step 7~16 暂停条件表;不得补新对象卡片;不得修改正式 `03-详细设计.md`;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.23`、Step 7 或后续 Step。

---

## R6.22 字段来源与状态主语闭环审计:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R6.22 字段来源与状态主语闭环审计:再写入`。 |
| 本模块目标 | 横向固化 Step 6 对象字段来源、状态主语、shared ref / result kind 和后续 Step 暂停条件。 |
| 当前状态 | completed |
| 禁止范围 | 不补新对象卡片;不写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key、test case schema或正式 `03-详细设计.md`。 |

### 2. 高复用字段族来源表

| 字段族 | 允许来源 | 禁止来源 | 后续闭合 Step | 实现侧暂停条件 |
|---|---|---|---|---|
| identity / typed ref: `*_ref`、`*_refs`、`*_ref_set` | contracts typed ref;domain factory;repository load;application output;infra builder / binding output;formal previous run。 | 裸字符串、路径、route、topic、cron、文件名、旧对象名、private map、hash 拼接。 | Step 7 / Step 8 / Step 11 / Step 13 | 只能从 raw string、route param、topic name、cron name 或旧材料推导时暂停。 |
| family / kind: `*_kind` | contracts shell marker;domain enum;application decision;infra availability / diagnostic family。 | HTTP status、broker ack、scheduler status、process exit code、字符串标签。 | Step 8 / Step 10 / Step 12 | kind owner 不清或被 transport / scheduler 状态替代时暂停。 |
| marker: `*_marker_ref` | policy output;resolver summary;projection / material builder;publisher / handoff binding;adapter availability output。 | flow 临时拼接、adapter raw response、route、topic、timestamp、private index。 | Step 7 / Step 8 / Step 9 / Step 12 | marker 来源没有正式 mapper / summary / builder 时暂停。 |
| decision: `*_decision_ref` | domain policy;application helper;visibility / degraded / intake / publication decision;resolver safe summary。 | entry handler、worker runner、job runner 本地合成;transport status;exception text。 | Step 7 / Step 9 / Step 12 | entry / infra 需要自行合成 decision 时暂停。 |
| diagnostic / safe reason | infra safe diagnostic;application degraded/error mapping;redacted validation issue;safe reason registry。 | raw exception、stack trace、provider body、SQL error、payload excerpt、secret、token。 | Step 12 / Step 15 / Step 16 | error/recovery 只能暴露 raw failure 或 raw external body 时暂停。 |
| shell: command/query/intake/event/job/response shell | contracts protocol shell ref;metadata shell;body-free inbound shell。 | Step 6 对象字段全集、HTTP request body、event payload body、job report body。 | Step 8 / Step 16 | public DTO / payload schema 未正式闭口却要实现时暂停。 |
| cursor / checkpoint | committed truth cursor;projection/material progress;stored result;previous run checkpoint;repository loaded version。 | queue offset、file path、timestamp、cron tick、string concat、private scan。 | Step 11 / Step 13 | durable key / replay source 无正式 schema 时暂停。 |
| boundary / scope | contracts scope shell;domain boundary;application precheck;policy output;validated config binding。 | route scope、topic namespace、cron name、raw config、manual free text。 | Step 8 / Step 9 / Step 14 | scope/boundary 只能从 route/topic/config string 推导时暂停。 |
| hint: refresh / handoff / follow-up | application safe hint;infra diagnostic hint;handoff binding summary;maintenance progress summary。 | 自动 repair trigger、delivery success、scheduler retry、raw log hint。 | Step 12 / Step 15 / Step 17 | hint 被当成 mutation / delivery / repair 指令时暂停。 |

### 3. 对象组字段来源表

| 对象组 | 字段来源闭口要求 | 后续承接 | 暂停条件 |
|---|---|---|---|
| contracts shared refs / public shell | 只能定义 typed ref、safe marker、metadata shell、public view / event / job shell ref。 | Step 8 protocol schema;Step 16 contract fixture。 | contracts 对象需要 domain truth body、DTO body、payload body 或 adapter state body。 |
| domain core truth | identity、state、basis、version、material refs 必须来自 factory、accepted command、formal import 或 repository load。 | Step 7 repository;Step 9 command flow;Step 10 state;Step 11 persistence。 | required 字段在 accepted flow 时机拿不到或只能从旧名称/字符串推断。 |
| domain trace / relation / external / peripheral | trace、lineage、relation、external summary、package/set refs 必须 body-free。 | Step 7 resolver/store;Step 9 trace/relation/peripheral flow;Step 12 body boundary。 | 需要保存 external body、artifact body、raw log、report body 或 marketplace/runtime body。 |
| domain policy / guard | policy / guard 输出 decision、marker、reason,不执行 mutation。 | Step 9 policy use point;Step 10 state precondition;Step 12 rejection mapping。 | policy 被要求直接创建 truth、调用 repository 或执行 recovery。 |
| application helper | operation context、idempotency、stored result、read/degraded/intake/event/job assembly 来自 metadata、domain output、port output或 safe diagnostic。 | Step 7 ports;Step 9 orchestration;Step 13 idempotency/replay。 | application helper 需要直接实现 adapter、持久化 schema或 transport 解析。 |
| infra runtime support | config binding、availability、store/resolver/source/publisher/handoff binding、diagnostic 来自 validated config、adapter factory、binding summary。 | Step 7 adapter trait;Step 12 safe diagnostic;Step 14 config binding。 | raw config、secret、URL、topic、DB schema 或 provider body 进入对象字段。 |
| api entry | actor、metadata、trace、dispatch、runtime、response shell 来自 contracts/application/infra refs。 | Step 8 response/rejection schema;Step 9 handler flow。 | api entry 需要 HTTP route/header/status、gateway auth owner 或直接 domain/repository 调用。 |
| worker entry | source metadata、body-free intake shell、event candidate、publisher binding、worker result 来自 contracts/application/infra refs。 | Step 8 event/intake shell;Step 9 consumer/publisher flow;Step 13 dedup/replay。 | worker 需要 outbox relay、topic routing、ack、offset、retry、dead letter 或 delivery receipt。 |
| jobs entry | job profile、run/scope、job shell、progress/checkpoint/result 来自 contracts/application/infra refs。 | Step 9 job flow;Step 11 progress/checkpoint persistence;Step 13 job replay;Step 16 job tests。 | jobs 需要 cron/scheduler product、queue lease、process status、report body 或 core truth repair。 |

### 4. 状态主语预筛表

| 状态类别 | 状态 owner | Step 6 典型承载 | Step 10 承接 | 禁止误用 |
|---|---|---|---|---|
| domain truth state | domain truth / state object | `FormalizationState`、catalog / version / consumption 等 domain state kind。 | 必须进入完整状态矩阵。 | 不得由 query、job、adapter、entry 直接迁移。 |
| policy / guard decision | domain policy / application decision object | eligibility、use boundary、consumption boundary、degraded/intake/publication decision。 | 作为 transition precondition / rejection branch。 | 不得当作 truth lifecycle。 |
| read / projection state | read material builder / application read decision / material store | freshness、progress view、read surface hint、stale/degraded marker。 | 需要 stale/fresh/degraded 矩阵。 | 不得反写真相或现场修 projection。 |
| external reference state | external summary / resolver binding / source binding | schema version、source binding、resolver binding、availability state。 | 需要 resolved/stale/unavailable/body-violation 类矩阵。 | 不得保存 external body 或 provider payload。 |
| application technical state | operation context / idempotency / stored result / assembly state | stored result、operation result、assembly status、duplicate replay marker。 | Step 13 闭口 duplicate/replay 状态。 | 不得用重跑 mutation 替代 stored result。 |
| infra runtime state | runtime assembly / adapter availability / binding / diagnostic | runtime assembly phase、availability state、binding state、diagnostic severity。 | Step 10 可引用为技术状态输入;Step 12/14 闭口。 | 不得改写 domain invariant 或 truth state。 |
| entry local state | api response assembly / worker result / job result | `MethodAssetApiAssemblyStatusKind`、`MethodAssetWorkerResultKind`、`MethodAssetJobResultKind`。 | 只进入 entry / runner local state branch。 | 不得当作 HTTP status、broker ack、scheduler status 或 domain lifecycle。 |

### 5. shared ref / entry result kind 审计表

| ref / kind | 正式 owner | 允许语义 | 禁止语义 | 后续闭合 Step |
|---|---|---|---|---|
| `MethodAssetApiAssemblyStatusKind` | `api` entry local state | ready / rejected / degraded / blocked / unavailable 等 response assembly 状态。 | HTTP status、RPC code、gateway auth decision。 | Step 8 / Step 9 / Step 12 |
| `MethodAssetWorkerResultKind` | `worker` entry local state | accepted / ignored / rejected / blocked / degraded / unavailable 的 safe runner result。 | broker ack、offset commit、delivery success、retry/dead-letter outcome。 | Step 9 / Step 12 / Step 13 |
| `MethodAssetJobResultKind` | `jobs` entry local state | completed / partial / blocked / failed / degraded / unavailable / replayed 的 operations job result。 | cron status、process exit code、queue lease、scheduler lifecycle。 | Step 9 / Step 12 / Step 13 / Step 16 |
| `MethodAssetCommandFamilyKind` / `MethodAssetQueryFamilyKind` | contracts protocol shell | command / query family marker。 | API handler 自行发明的 route group 或 HTTP method。 | Step 8 / Step 9 |
| `MethodAssetEventFamilyKind` | contracts event shell / application candidate | event candidate family marker。 | topic name、routing key、subscriber group。 | Step 8 / Step 9 / Step 14 |
| `MethodAssetJobFamilyKind` | contracts job shell / application job orchestration | operations job family marker。 | cron job name、scheduler task id、binary name。 | Step 8 / Step 9 / Step 14 |
| application dispatch refs | application service boundary | command/read/job dispatch target typed ref。 | service locator string、module path、private function pointer。 | Step 7 / Step 9 |
| protocol response / rejection shell refs | contracts protocol shell | public response / rejection shell typed ref。 | Step 6 DTO body、HTTP status body、transport envelope。 | Step 8 / Step 16 |
| report / handoff boundary refs | contracts / application / infra handoff summary | body-free report or handoff boundary marker。 | report body、archive body、external write receipt。 | Step 8 / Step 15 / Step 17 |

### 6. Step 7~16 暂停条件表

| 后续 Step | 必须从 Step 6 承接 | 必须暂停的情况 |
|---|---|---|
| Step 7 Trait / Port / Adapter | repository load/save、resolver summary、publisher/handoff/source binding、application dispatch、id generator、stored result、runtime builder。 | 任一对象字段没有正式读取面、写入面、mapper、resolver summary、id source 或 adapter boundary。 |
| Step 8 Protocol | command/query/intake/event/job shell、response/rejection shell、safe marker、metadata、public view/report shell。 | 需要实现端补 DTO body、payload schema、public marker、HTTP route、topic 或 report body。 |
| Step 9 Function Flow | factory / transition / assembly / decision 调用时机和字段可得性。 | flow 中字段只能从 route、topic、cron、private map、string concat、existing view 反推或实现便利拿到。 |
| Step 10 State Matrix | domain truth state、read/projection state、external state、application technical state、infra/entry local state。 | 状态主语不清、状态 owner 与迁移 owner 不一致、entry result 被当作 domain lifecycle。 |
| Step 11 Persistence / Tx | identity、version、cursor、checkpoint、stored result、progress view、report boundary、material refs。 | durable key、unique index、optimistic version、artifact schema 或 transaction owner 无正式定义。 |
| Step 12 Error / Recovery | safe diagnostic、degraded marker、blocked reason、rejection shell、follow-up hint。 | 只能暴露 raw exception、stack trace、provider body、SQL error、payload excerpt 或 secret。 |
| Step 13 Concurrency / Idempotency | operation key、dedup key、stored result、duplicate replay、job checkpoint replay。 | duplicate 需要重跑 mutation、扫描 queue、恢复 outbox relay 或从 raw payload 重建结果。 |
| Step 14 Config / External Binding | runtime config binding、adapter availability、source/publisher/handoff binding、job profile、diagnostic policy。 | raw config、secret、URL、topic、cron、scheduler product 或 DB path 被写入对象/flow。 |
| Step 15 Observability / Audit | safe diagnostic、trace context、handoff hint、progress view、entry/job result state。 | audit/telemetry 需要 raw log、payload、metric body、external body、secret 或 provider response。 |
| Step 16 Test Cut | object factory source、field source, state owner, no-body boundary, duplicate replay, degraded branch。 | 测试无法构造正式来源,只能用 private map、string fixture、HTTP framework、bus topic、scheduler product 或 DB schema。 |

### 7. Step 6 后续风险提示

| 风险 | 说明 | 后续处理 |
|---|---|---|
| shell ref 多、DTO schema 未写 | Step 6 有大量 `*_shell_ref`,但只允许引用,不能展开。 | Step 8 必须逐 shell 闭口 schema 和 public marker。 |
| dispatch ref 需要正式 application owner | API / jobs entry 引入 dispatch refs,目前只是对象字段来源。 | Step 7 / Step 9 必须闭口 service boundary 和 flow entry。 |
| stored result / checkpoint 来源敏感 | application / jobs 对象依赖 stored result 和 checkpoint。 | Step 11 / Step 13 必须闭口 durable schema 与 replay source。 |
| degraded / diagnostic marker 不能现场合成 | 多组对象依赖 diagnostic / degraded marker。 | Step 12 必须给出 safe mapper / diagnostic source。 |
| entry result kind 容易被误作 transport result | API / worker / jobs local result 与 HTTP/broker/scheduler 状态容易混淆。 | Step 8 / 9 / 14 必须保持 transport-neutral。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入高复用字段族来源表 | 是。 |
| 是否写入对象组字段来源表 | 是。 |
| 是否写入状态主语预筛表 | 是。 |
| 是否写入 shared ref / entry result kind 审计表 | 是。 |
| 是否写入 Step 7~16 暂停条件表 | 是。 |
| 是否补新对象卡片或新增对象字段 | 否。 |
| 是否写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.23` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.23 历史 Step 6 差异审计:先思考`;只允许思考旧 Step 6 / 旧正式 03 的污染扫描计划、禁入项、后移项和重定义项;不得把旧对象或旧 completed 状态反推为当前结论;不得补新对象卡片;不得修改正式 `03-详细设计.md`;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.24`、Step 7 或后续 Step。

---

## R6.23 历史 Step 6 差异审计:先思考

### 1. 本模块处理边界

本模块只制定历史 Step 6 差异审计计划,不写最终禁入 / 后移 / 重定义结论。`R6.24` 才能根据本计划写入审计表。

| 项 | 判断 |
|---|---|
| 当前模块 | `R6.23 历史 Step 6 差异审计:先思考` |
| 上一模块输入 | `R6.22` 已固定字段来源、状态主语、shared ref / entry result kind 和 Step 7~16 暂停条件。 |
| 本模块允许 | 形成旧 Step 6 / 旧正式 03 的污染扫描计划、污染类别、审计对象清单、判断规则和 `R6.24` 写入模板。 |
| 本模块禁止 | 写最终审计结论、补新对象卡片、修改正式 `03-详细设计.md`、把旧对象或旧 completed 状态反推为当前对象契约、进入 `R6.24` 或 Step 7。 |
| 下一模块 | `R6.24 历史 Step 6 差异审计:再写入` |

### 2. 已读取的历史信号

| 历史材料 | 当前定位 | 读到的污染信号 |
|---|---|---|
| `HEAD:design-calibration/03_ddd_step_06_object_contracts.md` | old_step6_historical_material | 旧文件标记 `[x] 已确认`,输入承接旧 13 个 P0 模块、旧 6 crate、P0 / P1 范围和旧 §25~§27。 |
| 旧 Step 6 对象家族总表 | old_object_family_sample | 以 `MethodContent`、`MethodContentKind`、`MethodContentPayload`、`MethodContentLifecycle`、`ContentVersion`、`CanonicalFingerprint`、`ContentRef`、`PublishedContentRef`、`DefinitionSnapshot`、`OutboxEvent`、P1 plugin/configuration 为主线。 |
| 旧 Step 6 代表对象卡片 | old_card_sample | 在 Step 6 中直接写旧字段、状态集合、成员函数、工厂函数和 snapshot / outbox 对象摘要。 |
| 旧正式 `03-详细设计.md` §6 | old_formal_index_sample | §6 是全局对象 / Trait / API 索引,把 object、trait / port、API / Event / Job 混在同一索引下。 |
| 旧正式 `03-详细设计.md` 全文 | old_formal_pollution_sample | 旧 `MethodContent` 发布同步闭环扩散到 command、query、snapshot、outbox、state、persistence、config、observability 和 tests。 |
| 当前 `R6.1`~`R6.22` | current_baseline | 当前 Step 6 已按七实现单元、八组件、`MethodAsset*` 对象、body-free 边界、字段来源和状态 owner 重新展开。 |

### 3. 审计目标

`R6.23` 的目标不是判定旧对象可复用,而是为 `R6.24` 准备可执行的污染关闭模板。

| 审计问题 | 当前思考 |
|---|---|
| 旧 Step 6 completed 状态如何处理? | 一律视为 invalid_status。旧 `[x] 已确认` 不能推进当前 Step 7。 |
| 旧 `MethodContent` 总聚合如何处理? | 不作为当前对象主语;若需表达方法资产定义 truth,只能由当前 `MethodAssetDefinition` 等对象卡片重新闭口。 |
| 旧 7 类 P0 payload 如何处理? | 不作为当前 kind / payload 枚举继承;如有分类价值,只能回到当前 definition kind / catalog / formalization 语义重新定义。 |
| 旧 publish lifecycle 如何处理? | 不继承 draft / in_review / published / deprecated / retired / superseded 作为当前 truth lifecycle;当前由 formalization、formal version、consumption material 和 Step 10 状态矩阵重新闭口。 |
| 旧 snapshot / fingerprint 如何处理? | 不作为当前版本、材料、trace 或 freshness 的默认机制;如需 digest / freshness / evidence marker,必须以后续 Step 正式重定义来源。 |
| 旧 outbox / delivery 如何处理? | 不恢复 outbox table、relay、claim、lease、dead-letter 或 delivery receipt;当前只允许 event candidate / handoff boundary 后续重新闭口。 |
| 旧 repository / port / API 索引如何处理? | Step 6 不接收 trait、port、adapter、DTO、handler、flow 或 persistence schema;分别后移 Step 7~11。 |
| 旧 P1 plugin/configuration 如何处理? | 不恢复 P1 阶段划分;package / method set / peripheral 只能按当前 `MethodPackage`、`MethodSetAssembly` 和后续风险清单重定义。 |

### 4. 污染类别草案

| 污染类别 | 典型信号 | `R6.24` 判断方向 |
|---|---|---|
| 状态污染 | `[x] 已确认`、Step 6 completed、可进入 Step 7。 | 标为 invalid_status,不得继承。 |
| 对象主语污染 | `MethodContent`、7 类 P0 payload、`MethodPlugin`、`MethodConfiguration` 作为对象主线。 | 禁入或重定义到当前 `MethodAsset*` 对象族。 |
| 生命周期污染 | draft / in_review / published / deprecated / retired / superseded、publish / supersede 成员函数。 | 禁入为当前 Step 6 状态事实;后续 Step 10 按当前状态 owner 重建。 |
| 材料机制污染 | `CanonicalFingerprint`、`DefinitionSnapshot`、`SnapshotBlobRef`、snapshot payload、fingerprint hasher。 | 禁入旧命名;可能后移为 digest / material / evidence / freshness marker 重定义。 |
| 事件投递污染 | `OutboxEvent`、relay、delivery、claim、lease、dead-letter、L0-bus topic。 | 禁入 outbox/delivery 实现;如需事件候选和 handoff,后移 Step 7/8/9/13/14。 |
| 技术产品污染 | PostgreSQL、object storage、HTTP route、gateway header、sqlx、persistence record。 | 后移 Step 7/8/11/14/15/16;不得进入对象卡片。 |
| 深度越界污染 | 旧 Step 6 直接写 trait、port、API、flow、state matrix、transaction、test case。 | 按 Step 7~16 分流,不得由 `R6.24` 变成当前对象字段。 |
| 范围分层污染 | P0 / P1、P1 disabled、plugin dependency DAG、configuration lifecycle。 | 不恢复旧范围分层;按当前 scope / peripheral / later phase 重新判断。 |

### 5. 审计对象清单草案

| 审计对象 | 需要扫描的内容 | 不得做的事 |
|---|---|---|
| 旧 Step 6 §1~§6 | 旧状态、输入、SOP 回答、问题诊断、改动对比和设计取舍。 | 不把旧“已确认”状态或旧对象组织方式复制到当前。 |
| 旧 Step 6 §7 对象家族与代表卡片 | `MethodContent`、lifecycle、snapshot、outbox、query projection、P1 后置对象。 | 不把旧对象字段、成员函数、工厂函数或状态集合升级为当前结论。 |
| 旧 Step 6 §8~§10 | 回填草稿、待确认事项、进入下一步条件。 | 不让旧“进入 Step 7”条件覆盖当前 `R6.24` 门禁。 |
| 旧正式 `03-详细设计.md` §6 | 全局对象 / Trait / API 索引。 | 不把旧索引作为当前 §6 草稿;Step 6 只写对象契约。 |
| 旧正式 `03-详细设计.md` 全文 | 旧对象在协议、flow、state、persistence、config、observability、test 中的扩散位置。 | 不用全文命中修正当前 `R6.8`~`R6.22` 对象卡片。 |
| 当前 `R6.8`~`R6.22` | 当前对象卡片、字段来源、状态主语和暂停条件。 | 不因旧材料存在而新增对象或改变已完成模块。 |

### 6. 判断规则草案

| 判断结果 | 使用条件 | 后续动作 |
|---|---|---|
| `禁入` | 与当前 00/01/02、Step 3~6 裁决冲突,或恢复旧 `MethodContent`、publish lifecycle、snapshot / fingerprint、outbox relay、PostgreSQL / gateway 产品绑定。 | `R6.24` 写入禁入表,后续 Step 不得引用旧名称或旧机制。 |
| `后移` | 概念可能仍有工程价值,但属于 trait / port、DTO schema、function flow、state matrix、persistence、config、observability 或 test。 | `R6.24` 写明后移到 Step 7~16 的具体入口和当前不得写入的内容。 |
| `重定义` | 能力方向与当前输入相容,但旧命名、owner、字段来源或状态主语已失效。 | `R6.24` 写明必须按当前 `MethodAsset*` 对象、field source 和 state owner 重新闭口。 |
| `仅作历史注记` | 只说明旧方案为何被替换,不进入当前对象契约。 | `R6.24` 记录为 historical_note,不进入后续设计输入。 |

### 7. `R6.24` 写入模板草案

`R6.24` 应把本模块思考固化为审计表,但仍不得修改正式 `03-详细设计.md`。

| `R6.24` 应写入 | `R6.24` 不得写入 |
|---|---|
| 旧 Step 6 状态污染关闭记录。 | 新对象卡片或补充对象字段。 |
| 旧对象主语禁入 / 后移 / 重定义表。 | trait / port / adapter 方法签名。 |
| 旧字段、状态、成员函数、工厂函数污染扫描表。 | protocol DTO、event payload、job payload 或 HTTP route。 |
| 旧 snapshot / fingerprint / outbox / delivery 机制处理表。 | function flow、transaction、persistence schema、config key。 |
| 旧正式 §6 / 全文扩散污染表。 | Step 10 完整状态矩阵、Step 16 test case schema。 |
| 当前 `R6.22` 字段来源和状态主语保护表。 | 修改正式 `03-详细设计.md` 或进入 Step 7。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否读取旧 Step 6 历史文件 | 是。 |
| 是否读取旧正式 §6 / 全文污染信号 | 是。 |
| 是否形成污染类别草案 | 是。 |
| 是否形成审计对象清单 | 是。 |
| 是否形成判断规则和 `R6.24` 写入模板 | 是。 |
| 是否写最终禁入 / 后移 / 重定义表 | 否。 |
| 是否补新对象卡片或对象字段 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.24` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.24 历史 Step 6 差异审计:再写入`;只允许写入旧 Step 6 状态污染关闭记录、旧对象 / 字段 / 状态 / 机制禁入、后移、重定义表、旧正式 §6 / 全文扩散污染表和当前 `R6.22` 保护表;不得补新对象卡片;不得修改正式 `03-详细设计.md`;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.25`、Step 7 或后续 Step。

---

## R6.24 历史 Step 6 差异审计:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R6.24 历史 Step 6 差异审计:再写入`。 |
| 本模块目标 | 关闭旧 Step 6 completed 污染,写入旧对象、字段、状态、机制和旧正式 §6 / 全文扩散污染的禁入 / 后移 / 重定义表。 |
| 当前状态 | completed |
| 禁止范围 | 不补新对象卡片;不写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key、test case schema或正式 `03-详细设计.md`。 |

### 2. 旧 Step 6 状态污染关闭记录

| 历史位置 | 旧状态 / 旧结论 | 当前处理 | 关闭理由 |
|---|---|---|---|
| `HEAD:design-calibration/03_ddd_step_06_object_contracts.md` §1 | `状态:[x] 已确认`,并声明可进入 Step 7。 | invalid_status;不得继承。 | 当前 full-restart 已重建 Step 3~6,旧 Step 6 不再是当前对象契约真相源。 |
| 旧 Step 6 §2 输入 | 承接旧 13 个 P0 模块、旧 6 crate、旧 P0 / P1 范围和旧正式 §25~§27。 | historical_material only。 | 当前 Step 5 主轴是七实现单元和八组件映射,不是旧 13 模块。 |
| 旧 Step 6 §3 SOP 回答 | 以调用上下文、Definition truth、同步、查询投影和 P1 后置对象组织对象家族。 | 不作为当前分组。 | 当前对象组已按 contracts / domain / application / infra / api / worker / jobs 分批闭口。 |
| 旧 Step 6 §8 回填草稿 | 建议正式 §6 使用“全局对象 / Trait / API 索引”。 | 禁入为当前 §6 结构来源。 | 当前 Step 6 只写对象实现契约;trait / API 分别属于 Step 7 / Step 8。 |
| 旧 Step 6 §10 进入下一步条件 | “对象家族划分已确认,可进入 Step 7”。 | invalid_gate。 | 当前必须先完成 `R6.25`~`R6.28` 回填草稿和自检停审。 |

### 3. 旧对象主语处理表

| 旧对象 / 对象族 | 污染类型 | 当前处理 | 后续若需恢复的唯一入口 |
|---|---|---|---|
| `MethodContent` 总聚合 | 对象主语污染 | 禁入当前 Step 6 对象主语。 | 已由 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalizationState`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial` 等当前对象拆分承接。 |
| `MethodContentKind` / 7 类 P0 definition subtype | 范围分层 / payload 污染 | 不继承旧 P0 kind / payload 枚举。 | 如需分类,只能通过当前 definition kind、catalog scope、formalization basis 和 Step 8 protocol shell 重新闭口。 |
| `MethodContentPayload` 及 7 类 payload body | 外部正文 / body 污染 | 禁入 body-bearing payload 模型。 | 当前对象只允许 body-free summary、material ref、safe marker;payload schema 后续也不得突破 body-free 边界。 |
| `MethodContentLifecycle` | 生命周期污染 | 禁入旧 lifecycle 作为当前状态 owner。 | Step 10 基于 `FormalizationState`、version、consumption、projection/material、application/entry local state 重建状态矩阵。 |
| `ContentVersion` / `PublishedContentRef` | 旧命名 / 发布语义污染 | 重定义。 | 当前使用 `FormalMethodAssetVersion`、typed boundary ref 和 consumption material ref,不得继承 published 语义。 |
| `CanonicalFingerprint` | 材料机制污染 | 后移 / 重定义。 | 若需 digest、canonical marker、freshness marker,必须在 Step 7 / 11 / 12 明确 builder、algorithm、schema version 和 migration 来源。 |
| `DefinitionSnapshot` / `SnapshotRef` / `SnapshotBlobRef` | snapshot 主线污染 | 禁入旧 snapshot 作为同步核心。 | 若需 read material、evidence、report、handoff ref,必须按当前 material / view / report shell 重新命名和闭口。 |
| `OutboxEvent` / `DefinitionEventEnvelope` | outbox / delivery 污染 | 禁入旧 outbox record 和 relay 语义。 | 只允许后续 Step 8 / 9 / 14 定义 body-free event candidate / handoff shell,不得恢复 delivery truth。 |
| `MethodPlugin` / `MethodConfiguration` / `EffectiveContentSet` | P1 范围污染 | 不继承 P1 分层。 | package / method set / peripheral 只按 `MethodPackage`、`MethodSetAssembly` 和后续风险清单重定义。 |

### 4. 旧字段、状态、成员函数和工厂污染表

| 旧内容 | 污染点 | 当前处理 |
|---|---|---|
| `payload: MethodContentPayload` | 保存 definition 正文,突破当前 body-free summary / material ref 边界。 | 禁入。 |
| `fingerprint: Option<CanonicalFingerprint>` | 用 fingerprint 作为 published 后必填状态事实。 | 后移到 digest / freshness / evidence marker 重新定义;当前不得补字段。 |
| `version: Option<ContentVersion>` | 旧 draft / published lifecycle 的字段组合。 | 重定义为 formal version / basis / consumption boundary 的当前字段来源。 |
| `references: Vec<ContentRef>` / `PublishedContentRef` | 旧普通引用 / published 引用二分。 | 重定义到 typed boundary ref、relation、distribution、consumption context。 |
| draft / in_review / published / deprecated / retired / superseded | 旧发布生命周期。 | 禁入 Step 6 当前状态;Step 10 重新定义状态 owner 和转换。 |
| `publish(...)` / `submit_for_review(...)` / `deprecate(...)` / `retire(...)` / `mark_superseded_by(...)` | 旧 command 行为提前落在对象卡片。 | 禁入旧函数名;当前 flow 行为后移 Step 9,状态转换后移 Step 10。 |
| `DefinitionSnapshot::from_published(...)` | 旧 snapshot 构造工厂依赖 published truth。 | 禁入;material / report builder 如需存在,后续 Step 7 / 9 / 11 重新闭口。 |
| `OutboxEvent::new_pending(...)` / `mark_published(...)` / `mark_failed(...)` | outbox 状态机与 delivery 语义进入 Step 6。 | 禁入;event candidate / publisher entry 不得恢复 delivery outcome。 |
| `MethodPlugin.publish(...)` / plugin lifecycle | 旧 P1 plugin 生命周期。 | 不进入当前 Step 6;peripheral package / method set 已重定义为当前对象。 |

### 5. 旧机制处理表

| 旧机制 | 当前结论 | 后续承接 |
|---|---|---|
| P0 / P1 范围分层 | 禁入当前 03 主线。 | 后续只使用当前 scope、peripheral、risk 和 later-phase 语言。 |
| 13 个 P0 实现模块 | 禁入为顶层对象归属。 | 当前只承认 Step 5 七实现单元和八组件横轴。 |
| 6 crate `method_library_*` workspace | 禁入。 | Step 4 已固定当前实现单元和命名规则。 |
| publish 同步闭环 | 重定义。 | formalization、formal version、consumption material、event candidate、handoff boundary 分别在当前对象和后续 Step 闭口。 |
| snapshot / fingerprint 主链 | 禁入旧主链,可作为重定义候选。 | digest、freshness、evidence、report boundary 必须按当前字段来源规则重新闭口。 |
| outbox relay / delivery / dead-letter | 禁入。 | event candidate、publisher binding、worker entry local result、handoff hint 后续分步闭口。 |
| PostgreSQL / object storage / SQL schema | 后移。 | Step 11 / 14 才能讨论 persistence / config / adapter binding,不得反推对象字段。 |
| HTTP / RPC route / gateway header | 后移 / 禁入 gateway owner。 | Step 8 / 9 只处理 protocol / entry metadata;本仓不实现 auth / gateway。 |
| Query projection / checkpoint 旧模型 | 后移 / 重定义。 | read material、maintenance progress、checkpoint、stored result 在 Step 7 / 9 / 11 / 13 闭口。 |

### 6. 旧正式 §6 / 全文扩散污染表

| 旧正式位置 / 信号 | 污染类型 | 当前处理 |
|---|---|---|
| 旧正式 §6 “全局对象 / Trait / API 索引” | Step 混层 | 不作为当前 §6 草稿;对象契约、trait、protocol 必须分属 Step 6 / 7 / 8。 |
| 旧正式全文 `MethodContentRepository`、`OutboxRepository`、`DefinitionSnapshotRepository` | port / persistence 提前进入对象索引 | 后移 Step 7 / 11。 |
| 旧正式全文 `CreateMethodContentDraft`、`PublishMethodContent`、`ExportDefinitionSnapshot` | command/query protocol 污染 | 后移 Step 8 / 9;不得在 Step 6 补 DTO。 |
| 旧正式全文 `MethodContent` lifecycle state matrix | 状态矩阵污染 | 后移 Step 10 并按当前状态 owner 重建。 |
| 旧正式全文 `method_contents`、`outbox_events`、`definition_snapshots` 表 | persistence schema 污染 | 后移 Step 11;不得从表结构反推当前对象。 |
| 旧正式全文 `outbox.batch_size`、`snapshot.schema_version`、`fingerprint.canonical_schema_version` | config key 污染 | 后移 Step 14;不得在 Step 6 写 config key。 |
| 旧正式全文 `method_library_outbox_*`、snapshot / publish metrics | observability 污染 | 后移 Step 15;不得保存 raw log / payload / provider body。 |
| 旧正式全文 P0 acceptance / command test cases | test schema 污染 | 后移 Step 16 / 05;不得把旧 case 作为当前对象闭口证明。 |

### 7. 当前 `R6.22` 保护表

| 保护项 | 被保护内容 | 禁止回流的旧替代项 |
|---|---|---|
| 字段来源 | typed ref、marker、decision、diagnostic、cursor、boundary 必须有正式来源。 | 从旧 `content_id`、topic、route、table、snapshot id、fingerprint 字符串推导。 |
| 状态主语 | domain truth、read/projection、external、application technical、infra runtime、entry local state 分开。 | 用旧 `MethodContentLifecycle` 或 `OutboxStatus` 覆盖所有状态。 |
| body-free 边界 | definition summary、material ref、external summary、report boundary 不保存正文。 | 旧 `MethodContentPayload`、snapshot payload、external body。 |
| event / handoff 边界 | event candidate / publication marker / handoff hint 不等于 delivery truth。 | 旧 outbox relay、delivery receipt、subscriber ack、dead-letter。 |
| entry local result | API / worker / jobs result kind 只表达 local assembly / runner result。 | HTTP status、broker ack、scheduler status、process exit code。 |
| 后续 Step 暂停条件 | port、DTO、flow、state、persistence、config、test 缺正式来源时必须暂停。 | 用旧实现便利、旧表结构或旧 service 方法自行补口。 |

### 8. `R6.25` 输入门禁

| 输入 | 状态 | 对 `R6.25` 的约束 |
|---|---|---|
| `R6.8`~`R6.20` 对象卡片 | current_baseline | 可作为正式 §6 回填草稿的唯一对象契约来源。 |
| `R6.22` 字段来源 / 状态主语审计 | current_baseline | 正式 §6 草稿必须保留字段来源、状态 owner 和暂停条件摘要。 |
| `R6.24` 历史污染审计 | completed_filter | 只作为排除清单和重定义提示,不得提供对象字段或函数。 |
| 旧正式 `03-详细设计.md` | historical_material | 只用于确认旧 §6 不能直接复用。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否关闭旧 Step 6 completed 状态污染 | 是。 |
| 是否写入旧对象主语处理表 | 是。 |
| 是否写入旧字段、状态、成员函数和工厂污染表 | 是。 |
| 是否写入旧机制处理表 | 是。 |
| 是否写入旧正式 §6 / 全文扩散污染表 | 是。 |
| 是否写入当前 `R6.22` 保护表 | 是。 |
| 是否补新对象卡片或对象字段 | 否。 |
| 是否写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.25` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.25 回填草稿:先思考`;只允许思考正式 §6 回填策略、回填结构、摘要深度、旧污染过滤方式和 `R6.26` 写入边界;不得修改正式 `03-详细设计.md`;不得新增对象卡片或改写已完成对象字段;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.26`、Step 7 或后续 Step。

---

## R6.25 回填草稿:先思考

### 1. 本模块处理边界

| 项 | 判断 |
|---|---|
| 当前模块 | `R6.25 回填草稿:先思考` |
| 上一模块输入 | `R6.24` 已关闭旧 Step 6 completed 污染,确认旧对象、旧字段、旧状态和旧机制只能作为过滤器。 |
| 本模块允许 | 思考正式 §6 回填策略、回填结构、摘要深度、旧污染过滤方式和 `R6.26` 写入顺序。 |
| 本模块禁止 | 写 §6 草稿正文、修改正式 `03-详细设计.md`、新增对象卡片、改写已确认对象字段、进入 `R6.26` 或 Step 7。 |
| 下一模块 | `R6.26 回填草稿:再写入` |

### 2. 回填目标判断

正式 §6 的目标不是复制本文件全部推演过程,而是把 `R6.8`~`R6.22` 已确认的对象契约整理成实现者可直接阅读的对象章。

| 回填问题 | 当前思考 |
|---|---|
| §6 是否应保留对象卡片深度? | 应保留。Step 6 是对象实现契约,正式 §6 必须能让实现者看到对象身份、owner、关键字段、行为边界、不变量、来源和后续承接。 |
| 是否把全部中间讨论逐字回填? | 不应。R6.26 只回填对象契约结果、字段来源规则、状态 owner 和后续承接门禁,不回填每个“先思考”过程。 |
| 是否在 §6 中写 trait / port / DTO / flow? | 不写。§6 只能列后续承接,不能提前定义 Step 7~16 内容。 |
| 是否使用旧正式 §6 的“全局对象 / Trait / API 索引”结构? | 不使用。旧结构混层,已在 `R6.24` 禁入。 |
| 是否修改正式 `03-详细设计.md`? | 不修改。`R6.26` 只在当前中间产物中写可回填草稿。 |

### 3. §6 回填结构草案

`R6.26` 应写入一个可直接装配到正式 `03-详细设计.md` 的 §6 草稿,但仍放在本中间产物中。

| §6 小节 | 回填内容 | 来源 | 边界 |
|---|---|---|---|
| §6.1 对象契约阅读规则 | 本章写对象,不写 trait / DTO / flow / persistence;旧材料过滤口径。 | `R6.1`~`R6.4`;`R6.24` | 不展开旧污染长表。 |
| §6.2 对象族总览 | 按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 列对象族、owner、用途。 | `R6.6`;`R6.8`~`R6.20` | 不把八组件拆成 crate。 |
| §6.3 `contracts` shared refs / markers / shell | typed boundary ref、safe marker、public view / event / job / command / query shell 家族。 | `R6.8` | 不写 DTO body。 |
| §6.4 `domain` core truth 对象 | `MethodAssetDefinition`、catalog、formalization、version、consumption material 六个对象卡片摘要。 | `R6.10` | 不写 repository 或 command flow。 |
| §6.5 `domain` support / relation / peripheral 对象 | external summary、trace、impact、audit、lineage、relation、package、method set。 | `R6.12` | 不恢复 snapshot / outbox。 |
| §6.6 `domain` policy / guard / state owner | 七个 policy / guard 对象和状态主语预筛摘要。 | `R6.14`;`R6.22` | 不写完整状态矩阵。 |
| §6.7 `application` helper 对象 | operation context、idempotency、stored result、read/degraded/intake/event/job assembly。 | `R6.16` | 不写 port trait。 |
| §6.8 `infra` runtime / adapter state 对象 | runtime config binding、assembly、availability、store/resolver/source/publisher/handoff binding、diagnostic。 | `R6.18` | 不写 raw config / adapter method / persistence schema。 |
| §6.9 `api` / `worker` / `jobs` entry 对象 | API handler entry、worker consumer / publisher entry、jobs runner / result objects。 | `R6.20` | 不写 HTTP route、topic、cron 或 runner flow。 |
| §6.10 字段来源与状态主语闭环 | 字段族来源、对象组来源、状态 owner、entry result kind、Step 7~16 暂停条件摘要。 | `R6.22` | 作为实现门禁,不生成新对象。 |
| §6.11 历史污染过滤摘要 | 旧 Step 6 / 旧正式 §6 禁入、后移、重定义摘要。 | `R6.24` | 只写短摘要,不把旧内容变输入。 |
| §6.12 Step 7 输入门禁 | Step 7 必须承接哪些对象字段、owner、缺口暂停条件。 | `R6.22`;本模块 | 不宣布 Step 6 completed,留给 R6.27 / R6.28 自检。 |

### 4. 回填深度规则

| 内容类型 | 回填深度 | 原因 |
|---|---|---|
| 对象族总览 | 完整列出对象名、owner、责任、来源模块。 | 帮实现者建立全局对象地图。 |
| 具体对象卡片 | 保留对象身份、所属 capability、结构责任、关键字段来源、行为边界、不变量、后续承接。 | Step 6 的核心价值是对象可落码。 |
| 重复字段来源规则 | 抽成 §6.10 总表,对象卡片中只引用关键来源。 | 避免每个对象重复十几行通用规则。 |
| 状态 owner | 写预筛和对象级 owner,不写迁移矩阵。 | 迁移矩阵属于 Step 10。 |
| shell / marker / typed ref | 写家族与使用边界,不写协议 body。 | DTO schema 属于 Step 8。 |
| 历史污染 | 写摘要过滤表,不复制 R6.24 全部长表。 | 正式 §6 应服务当前设计,不是历史说明书。 |
| 后续承接 | 必须写 Step 7~16 暂停条件摘要。 | 防止实现侧自行补 port / DTO / state / schema。 |

### 5. 旧污染过滤规则

| 旧内容 | §6 回填处理 |
|---|---|
| `MethodContent`、7 类 P0 payload、P0 / P1 分层 | 不出现为当前对象主语。 |
| publish / published / draft lifecycle | 不作为当前状态事实;如需说明,只在历史过滤摘要中点名禁入。 |
| snapshot / fingerprint / outbox / delivery | 不作为对象主线;只可在历史过滤摘要和后续重定义提醒中出现。 |
| PostgreSQL、sqlx、HTTP route、gateway、topic、cron | 不进入 §6 对象字段;后移 Step 8 / 11 / 14。 |
| 旧 trait / repository / API index | 不进入 §6 对象小节;后移 Step 7 / 8。 |
| 旧 test case / evidence / report | 不进入 §6;后移 Step 16 / 05 / 06。 |

### 6. `R6.26` 写入顺序草案

`R6.26` 应按“先总览、再对象族、再横向审计、最后承接门禁”的顺序写入。

| 顺序 | 写入块 | 主要内容 |
|---:|---|---|
| 1 | §6 回填草稿边界 | 说明草稿只在本中间产物中,正式 03 不修改。 |
| 2 | §6.1~§6.2 | 阅读规则和对象族总览。 |
| 3 | §6.3 | contracts shared refs / markers / shell。 |
| 4 | §6.4~§6.6 | domain core、support、policy / guard / state owner。 |
| 5 | §6.7~§6.9 | application、infra、api / worker / jobs 对象。 |
| 6 | §6.10~§6.12 | 字段来源、历史过滤摘要、Step 7 输入门禁。 |
| 7 | R6.27 输入门禁 | 标明下一步只允许进入自检与停审思考。 |

单次写入批次仍按 100~300 行控制。若 `R6.26` 内容过长,应按上述块分批 patch,但一次确认仍只完成 `R6.26` 一个模块。

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否形成 §6 回填目标判断 | 是。 |
| 是否形成 §6 回填结构草案 | 是。 |
| 是否形成回填深度规则 | 是。 |
| 是否形成旧污染过滤规则 | 是。 |
| 是否形成 `R6.26` 写入顺序 | 是。 |
| 是否写 §6 草稿正文 | 否。 |
| 是否新增对象卡片或改写已完成对象字段 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.26` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.26 回填草稿:再写入`;只允许在本中间产物中写入正式 §6 回填草稿、R6.27 自检输入门禁和本模块状态;不得修改正式 `03-详细设计.md`;不得新增对象卡片或改写已完成对象字段;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.27`、Step 7 或后续 Step。

---

## R6.26 回填草稿:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R6.26 回填草稿:再写入`。 |
| 本模块目标 | 只在本中间产物中写入可回填到正式 `03-详细设计.md` 的 §6 草稿,并写入 R6.27 自检输入门禁。 |
| 当前状态 | completed |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不新增对象卡片;不改写已完成对象字段;不写 trait / port、protocol DTO schema、function flow、状态矩阵、persistence schema、config key 或 test case schema。 |

### 2. 正式 §6 回填草稿

以下草稿是正式 `03-详细设计.md` §6 的候选内容。当前只保存在本 Step 6 中间产物内,正式文档装配仍等待后续门禁。

#### 6.1 对象契约阅读规则

本章定义 L3-method-library 的对象实现契约,覆盖对象身份、owner、字段来源、行为边界、不变量、禁止事项和后续 Step 承接。它不定义 trait / port、API / event / job DTO、函数级处理流、完整状态矩阵、持久化 schema、配置 key、观测指标或测试 case。

| 规则 | 口径 |
|---|---|
| 对象来源 | 仅来自当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和本轮 Step 3~6 中间产物。 |
| 模块 owner | 对象按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七实现单元归属。 |
| 字段来源 | typed ref、marker、decision、diagnostic、cursor、boundary 必须来自正式 factory、policy、resolver、repository load、adapter summary 或 validated config binding。 |
| body-free | 对象不得保存方法正文、外部正文、artifact/archive body、raw log、provider payload、secret 或 report body。 |
| 旧材料过滤 | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox、delivery、PostgreSQL / sqlx / gateway 只作历史污染样本。 |
| 后续缺口 | 对象字段缺 port、DTO、flow、state、schema、config 或 test 来源时,后续 Step 必须暂停回设计闭口。 |

#### 6.2 对象族总览

| 模块 | 对象族 | 已确认对象 | 主要责任 |
|---|---|---|---|
| `contracts` | shared refs / markers / public shell | `MethodLibraryTypedBoundaryRef`;`MethodLibrarySafeMarker`;`MethodLibraryPublicShell` | 提供 body-free public ref、safe marker 和 protocol shell 边界。 |
| `domain` | core truth | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationBasisSummary`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial` | 定义、目录、正式化、版本和受控消费的业务对象主语。 |
| `domain` | trace / relation / external / peripheral | `ExternalSourceSummary`;`MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly` | 追溯、影响、外部摘要、关系、包和方法集组织。 |
| `domain` | policy / guard | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule` | 输出 decision、marker、reason 和 boundary 判断,不执行 flow。 |
| `application` | orchestration helper | `MethodAssetOperationContext`;`MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult`;`MethodAssetReadDecision`;`MethodAssetDegradedDecision`;`MethodAssetInboundIntakeDecision`;`MethodAssetEventCandidateAssembly`;`MethodAssetJobAssemblyContext` | 支撑 command/query/consumer/job 编排、幂等、读取、降级、事件候选和 job assembly。 |
| `infra` | runtime / adapter state | `MethodAssetRuntimeConfigBinding`;`MethodAssetRuntimeAssemblyState`;`MethodAssetAdapterAvailabilityState`;`MethodAssetStoreBindingState`;`MethodAssetExternalResolverBindingState`;`MethodAssetInboundSourceBindingState`;`MethodAssetPublisherBindingState`;`MethodAssetHandoffBindingState`;`MethodAssetInfraSafeDiagnostic` | 表达 validated config、runtime assembly、adapter binding、availability 和 safe diagnostic。 |
| `api` | synchronous entry | `MethodAssetApiEntryContext`;`MethodAssetApiCommandHandlerEntry`;`MethodAssetApiQueryHandlerEntry`;`MethodAssetApiResponseAssemblyState` | 承接 transport-neutral command/query entry assembly。 |
| `worker` | background entry | `MethodAssetWorkerEntryContext`;`MethodAssetInboundConsumerEntry`;`MethodAssetEventPublisherEntry`;`MethodAssetWorkerEntryResultState` | 承接 inbound body-free intake 和 outbound event candidate publisher entry。 |
| `jobs` | operations runner | `MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;`MethodAssetJobProgressAssemblyState`;`MethodAssetJobEntryResultState` | 承接 maintenance / refresh / reconciliation / handoff report job entry。 |

#### 6.3 `contracts` shared refs / markers / public shell

| 对象族 | 结构责任 | 关键边界 | 后续承接 |
|---|---|---|---|
| `MethodLibraryTypedBoundaryRef` | 承载跨 crate 稳定 typed ref,让各层传递对象锚点而不共享 truth body。 | opaque、typed、body-free;不得解析字符串推导业务含义。 | Step 8 DTO / event / job shell;Step 11 persistence key 不得反推其内部格式。 |
| `MethodLibrarySafeMarker` | 承载 public surface 可安全公开的 no-body、freshness、availability、boundary、lineage 等 marker。 | marker 只能复制正式 policy、resolver、material、adapter summary 输出。 | Step 8 public marker schema;Step 10 状态 owner 回指;Step 12 degraded / unavailable 映射。 |
| `MethodLibraryPublicShell` | 为 command/query/event/job/view/material/report 提供 public shell 边界。 | shell 不拥有 truth、payload、handler flow 或 persistence schema。 | Step 8 定义具体 protocol schema;Step 16 定义 contract fixture。 |

#### 6.4 `domain` core truth 对象

| 对象 | 结构责任 | 关键字段来源 / 不变量 | 后续承接 |
|---|---|---|---|
| `MethodAssetDefinition` | 方法资产定义 truth、稳定身份和共同 subject anchor。 | `definition_ref` 来自 domain 创建后的 typed ref;`definition_summary` 必须 body-free;不得恢复 `MethodContent`。 | Step 7 repository;Step 9 command flow;Step 11 truth persistence。 |
| `MethodAssetCatalogEntry` | 目录语义、适用范围和可发现分类 truth。 | 绑定 `definition_ref` 与 `catalog_scope_ref`;catalog view 不反写真相。 | Step 7 catalog repository;Step 9 catalog command/query;Step 10 catalog status。 |
| `FormalizationBasisSummary` | 正式化依据的安全摘要。 | 只能引用 external summary / governance basis ref;不保存治理或证据正文。 | Step 7 resolver / basis port;Step 12 basis unavailable branch。 |
| `FormalizationState` | 正式化与版本前置状态 owner。 | `state_kind` 是状态主语候选;完整迁移后移 Step 10;不恢复 publish lifecycle。 | Step 9 formalization flow;Step 10 state matrix;Step 12 rejection。 |
| `FormalMethodAssetVersion` | 正式版本边界、版本语义和替代关系。 | 由 `FormalizationState` 和 basis summary 支撑;不以 fingerprint / snapshot 表示版本。 | Step 7 version repository;Step 9 version command;Step 11 version uniqueness。 |
| `MethodAssetConsumptionMaterial` | 正式版本在消费语境下的 body-free 受控材料。 | 绑定 `formal_version_ref`、`consumption_context_ref`、`boundary_ref`;不保存下游运行 truth。 | Step 7 material store;Step 9 consumption flow;Step 10 stale/fresh state。 |

#### 6.5 `domain` support / relation / peripheral 对象

| 对象 | 结构责任 | 关键边界 | 后续承接 |
|---|---|---|---|
| `ExternalSourceSummary` | 外部来源、schema/version、artifact/archive ref 的安全摘要。 | 不保存 external body、provider payload 或 archive body。 | Step 7 external resolver;Step 12 unavailable / body violation。 |
| `MethodAssetTraceMaterial` | 追溯读取材料,连接 definition、version、consumption、relation、event candidate 和 audit refs。 | 只保存 body-free trace refs;不得替代 audit / truth。 | Step 7 trace store;Step 9 trace query;Step 15 trace observability。 |
| `ConsumptionImpactSummary` | 表达 consumption / downstream / relation 影响的安全摘要。 | 不保存 downstream runtime truth 或 private work data。 | Step 7 impact resolver;Step 9 impact query/job;Step 12 degraded impact。 |
| `MethodAssetAuditTrail` | 保存安全 audit subject、action、reason、lineage refs。 | audit 不保存 raw log、payload、secret 或 provider body。 | Step 11 audit persistence;Step 15 audit event mapping。 |
| `MethodAssetEvidenceLineage` | 表达 evidence/source/ref 的 lineage graph。 | lineage 只连接 refs,不携带 evidence body。 | Step 7 lineage store;Step 15 lineage observability。 |
| `MethodAssetRelation` | 表达方法资产之间的 typed relation 与 distribution boundary。 | 不表示 marketplace transaction、delivery 或 runtime dependency。 | Step 7 relation repository;Step 9 relation flow;Step 10 relation integrity state。 |
| `MethodPackage` | 外围方法资产包组织。 | package 只组织 refs 和 safe metadata,不复制 asset body。 | Step 9 package flow;Step 16 peripheral tests。 |
| `MethodSetAssembly` | 方法集组合和 assembly summary。 | 不表达 plugin P1 lifecycle 或 marketplace fulfillment。 | Step 9 method set flow;Step 12 composition errors。 |

#### 6.6 `domain` policy / guard / state owner 预筛

| 对象 | 输出 | 禁止事项 | 后续承接 |
|---|---|---|---|
| `FormalizationEligibilityRule` | 正式化 eligibility decision / reason。 | 不创建 version,不调用 repository。 | Step 9 precheck;Step 10 state precondition。 |
| `DefinitionUseBoundaryGuard` | Definition vs Use boundary marker。 | 不保存 downstream truth。 | Step 9 command/query guard;Step 12 boundary rejection。 |
| `DownstreamConsumptionBoundary` | consumption availability / boundary decision。 | 不执行 handoff、delivery 或 repair。 | Step 9 consumption flow;Step 10 availability state。 |
| `ConsistencyProtectionPolicy` | trace / material / relation consistency decision。 | 不刷新 material 或写 audit。 | Step 9 consistency flow;Step 12 degraded branch。 |
| `RelationIntegrityRule` | relation integrity decision / safe reason。 | 不创建 relation side effects。 | Step 9 relation mutation;Step 10 relation state。 |
| `ExternalBodyBoundaryRule` | no-body / external body violation marker。 | 不读取 provider body。 | Step 12 body violation mapping;Step 16 body-free tests。 |
| `PackageCompositionRule` | package / method set composition decision。 | 不执行 marketplace install / transaction。 | Step 9 package flow;Step 12 composition errors。 |

#### 6.7 `application` helper 对象

| 对象 | 结构责任 | 关键边界 | 后续承接 |
|---|---|---|---|
| `MethodAssetOperationContext` | 统一承载 actor、metadata、source kind、correlation、safe clock/id 和 boundary marker。 | 不保存 raw header、token、HTTP request、broker envelope 或 cron expression。 | Step 7 clock/id/metadata ports;Step 9 service entry flow。 |
| `MethodAssetIdempotencyGuard` | 表达 operation digest、dedup scope、stored result ref 和 duplicate/conflict 判断输入。 | 不定义 durable store、lock、TTL 或 retry。 | Step 7 idempotency port;Step 13 duplicate replay。 |
| `MethodAssetStoredOperationResult` | 保存可重放 accepted/rejected/ignored safe result summary。 | 不保存 DTO body、raw error、event payload 或 delivery state。 | Step 11 stored result persistence;Step 13 replay source。 |
| `MethodAssetReadDecision` | 表达 found / absent / not visible / stale / degraded / unavailable 的 Query 判断壳。 | Query no-write;不合成 marker;不刷新 material。 | Step 9 query flow;Step 12 degraded read mapping。 |
| `MethodAssetDegradedDecision` | 汇总 degraded marker、safe diagnostic 和 follow-up hint。 | 不保存 raw exception,不启动 repair/job。 | Step 12 degraded schema;Step 15 safe diagnostic telemetry。 |
| `MethodAssetInboundIntakeDecision` | 裁决 inbound body-free source event accepted / ignored / rejected / handoff。 | 不保存 raw provider payload 或 broker message body。 | Step 8 inbound shell;Step 9 consumer flow;Step 13 dedup。 |
| `MethodAssetEventCandidateAssembly` | 组装 body-free event candidate 输入。 | 不表达 topic、payload、outbox、delivery 或 subscriber ack。 | Step 8 event shell;Step 9 publisher flow;Step 14 publisher binding。 |
| `MethodAssetJobAssemblyContext` | 承载 operations job scope、cursor、safe result、progress hint 和 degraded decision。 | job 不修 core truth,不定义 scheduler/queue product。 | Step 9 job flow;Step 11 checkpoint;Step 13 replay;Step 16 job tests。 |

#### 6.8 `infra` runtime / adapter state 对象

| 对象 | 结构责任 | 禁止事项 | 后续承接 |
|---|---|---|---|
| `MethodAssetRuntimeConfigBinding` | validated config binding 的 typed ref / profile / policy summary。 | 不暴露 raw config、secret、URL、topic、cron。 | Step 14 config schema。 |
| `MethodAssetRuntimeAssemblyState` | runtime builder 的 assembly phase、dependency availability 和 safe diagnostic summary。 | 不决定 domain invariant。 | Step 12 unavailable;Step 14 runtime binding。 |
| `MethodAssetAdapterAvailabilityState` | adapter availability / degraded / unavailable 状态输入。 | 不替代业务状态。 | Step 7 adapter traits;Step 12 errors. |
| `MethodAssetStoreBindingState` | store/repository binding readiness summary。 | 不定义 table、index、SQL、migration。 | Step 11 persistence. |
| `MethodAssetExternalResolverBindingState` | external resolver binding 和 schema/version support summary。 | 不读取或保存 external body。 | Step 7 resolver;Step 14 external binding. |
| `MethodAssetInboundSourceBindingState` | inbound source binding,source family,schema support 和 diagnostic。 | 不定义 topic/queue/subscription。 | Step 8 inbound shell;Step 14 source binding. |
| `MethodAssetPublisherBindingState` | event candidate publisher binding 和 publication boundary marker。 | 不保存 delivery receipt、ack、dead letter。 | Step 9 publisher flow;Step 14 publisher config. |
| `MethodAssetHandoffBindingState` | handoff target、report boundary、archive boundary 和 diagnostic summary。 | 不保存 report body、external write receipt。 | Step 15 handoff observability;Step 17 implementation handoff. |
| `MethodAssetInfraSafeDiagnostic` | redacted diagnostic family、severity、safe reason 和 follow-up hint。 | 不包含 stack trace、SQL error body、provider payload、secret。 | Step 12 errors;Step 15 telemetry. |

#### 6.9 `api` / `worker` / `jobs` entry 对象

| 对象 | 所属 entry | 结构责任 | 禁止事项 |
|---|---|---|---|
| `MethodAssetApiEntryContext` | `api` | 承载 API entry local context、runtime assembly、actor / metadata refs 和 response policy ref。 | 不实现 auth/gateway,不保存 HTTP request。 |
| `MethodAssetApiCommandHandlerEntry` | `api` | 表达 command handler dispatch target、command shell、operation context 和 precheck refs。 | 不直接调用 domain/repository,不写 route/status。 |
| `MethodAssetApiQueryHandlerEntry` | `api` | 表达 query handler dispatch target、query shell、read decision 和 response shell。 | 不写 query flow,不刷新 material。 |
| `MethodAssetApiResponseAssemblyState` | `api` | 表达 response assembly local state、safe diagnostic 和 rejection shell ref。 | 不等同 HTTP status / RPC code。 |
| `MethodAssetWorkerEntryContext` | `worker` | 承载 worker runner context、source/publisher binding、dedup channel 和 safe diagnostic policy。 | 不恢复 outbox relay 或 broker ack。 |
| `MethodAssetInboundConsumerEntry` | `worker` | 表达 inbound consumer body-free shell、source event metadata、schema version 和 intake decision。 | 不保存 raw envelope或 provider body。 |
| `MethodAssetEventPublisherEntry` | `worker` | 表达 event candidate、publisher binding、publication boundary 和 handoff targets。 | 不表达 delivery success、topic routing、retry。 |
| `MethodAssetWorkerEntryResultState` | `worker` | 表达 worker local accepted / ignored / rejected / blocked / degraded / unavailable 结果。 | 不等同 broker ack / offset commit。 |
| `MethodAssetJobRunnerContext` | `jobs` | 承载 job profile、maintenance run、refresh scope、cursor、checkpoint 和 diagnostic policy。 | 不定义 cron / scheduler product。 |
| `MethodAssetOperationJobEntry` | `jobs` | 表达 job input shell、dispatch ref、target refs 和 safe execution boundary。 | 不修 core truth,不写 queue lease。 |
| `MethodAssetJobProgressAssemblyState` | `jobs` | 表达 progress view、checkpoint、partial failure、degraded decision 和 report boundary。 | 不保存 report body。 |
| `MethodAssetJobEntryResultState` | `jobs` | 表达 completed / partial / blocked / failed / degraded / replayed local job result。 | 不等同 process exit code / scheduler lifecycle。 |

#### 6.10 字段来源与状态主语闭环

| 字段族 | 允许来源 | 暂停条件 |
|---|---|---|
| `*_ref` / typed ref | contracts typed ref、domain factory、repository load、application output、infra binding output。 | 只能从 raw string、route、topic、cron、旧对象名或 private map 推导。 |
| `*_kind` | contracts shell marker、domain enum、application decision、infra availability family。 | kind owner 不清或被 HTTP / broker / scheduler status 替代。 |
| `*_marker_ref` | policy output、resolver summary、material builder、adapter availability summary。 | marker 来源没有正式 mapper / summary / builder。 |
| `*_decision_ref` | domain policy、application helper、resolver safe summary。 | entry / infra 需要自行合成 decision。 |
| diagnostic / safe reason | infra safe diagnostic、application degraded/error mapping、redacted validation issue。 | 只能暴露 raw exception、stack trace、provider body、SQL error、payload excerpt 或 secret。 |
| cursor / checkpoint | committed truth cursor、projection/material progress、stored result、previous run checkpoint。 | durable key / replay source 无正式 schema。 |

| 状态类别 | 状态 owner | Step 10 承接 |
|---|---|---|
| domain truth state | domain truth / state object | formalization、catalog、version、consumption 等完整矩阵。 |
| policy / guard decision | policy / application decision object | transition precondition / rejection branch。 |
| read / projection state | read material / application read decision / material store | fresh / stale / degraded / unavailable 矩阵。 |
| external reference state | external summary / resolver binding | resolved / stale / unavailable / body-violation 矩阵。 |
| application technical state | idempotency / stored result / assembly state | duplicate replay / stored result 状态。 |
| infra / entry local state | runtime assembly / adapter availability / entry result | technical branch,不得当作 domain lifecycle。 |

#### 6.11 历史污染过滤摘要

| 旧内容 | 当前处理 |
|---|---|
| `MethodContent`、7 类 P0 payload、P0 / P1 分层 | 不进入当前对象主语。 |
| publish / draft / in_review / published lifecycle | 不作为当前状态事实。 |
| snapshot / fingerprint / outbox / delivery | 不作为对象主线;如需类似能力,后续 Step 重新定义。 |
| PostgreSQL、sqlx、HTTP route、gateway、topic、cron | 不进入对象字段;后移 Step 8 / 11 / 14。 |
| 旧 trait / repository / API index | 不进入 §6 对象章节;后移 Step 7 / 8。 |
| 旧 test case / evidence / report | 后移 Step 16 / `05-测试方案.md` / `06-验收标准.md`。 |

#### 6.12 Step 7 输入门禁

Step 7 只能在 Step 6 对象契约闭合后定义 Trait / Port / Adapter。进入 Step 7 前必须保留以下门禁:

| Step 7 必须承接 | 必须暂停的情况 |
|---|---|
| repository load/save 的对象 owner、identity ref、version / state owner。 | 对象字段需要读取/保存,但没有正式 owner 或 key 来源。 |
| resolver / mapper / builder 的 summary、marker、decision 来源。 | 需要实现端合成 marker、decision、diagnostic 或 digest。 |
| id generator / clock / config binding / runtime assembly 来源。 | 需要从 raw config、timestamp、route、topic、cron 或 private map 推断。 |
| stored result、dedup、checkpoint、cursor 的 durable 来源。 | duplicate / replay 只能通过重跑 mutation 或扫描队列恢复。 |
| source / publisher / handoff binding 的 body-free adapter boundary。 | adapter 需要 raw external body、delivery receipt 或 report body 才能表达。 |

### 3. R6.27 自检输入门禁

| 自检项 | 进入 R6.27 时必须检查 |
|---|---|
| 对象完整性 | `R6.8`~`R6.20` 对象是否都进入 §6 草稿,且无新增对象主语。 |
| 边界完整性 | §6 草稿是否未写 trait / DTO / flow / state matrix / persistence / config / test。 |
| 字段来源 | §6 草稿是否保留 `R6.22` 字段来源与暂停条件。 |
| 历史过滤 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox、P0/P1 是否未回流为当前主线。 |
| Step 7 readiness | 是否能为 Step 7 提供 port/adapter owner、field source、missing-source pause condition。 |

### 4. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入正式 §6 回填草稿 | 是,仅写入本中间产物。 |
| 是否覆盖对象族总览 | 是。 |
| 是否覆盖 contracts / domain / application / infra / api / worker / jobs 对象 | 是。 |
| 是否覆盖字段来源、状态主语、历史过滤和 Step 7 输入门禁 | 是。 |
| 是否新增对象卡片或改写已完成对象字段 | 否。 |
| 是否写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.27` 思考或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.27 自检与停审:先思考`;只允许思考 Step 6 自检清单、对象完整性、边界完整性、字段来源闭环、历史过滤闭环、Step 7 readiness 和 `R6.28` 写入边界;不得修改正式 `03-详细设计.md`;不得新增对象卡片或改写已完成对象字段;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R6.28`、Step 7 或后续 Step。

---

## R6.27 自检与停审:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R6.27 自检与停审:先思考`。 |
| 本模块目标 | 只思考 Step 6 是否具备停审写入条件,形成 `R6.28` 写入边界。 |
| 当前状态 | completed |
| 禁止范围 | 不新增对象卡片;不改写已完成字段;不修改正式 `03-详细设计.md`;不写 trait / port、protocol DTO、function flow、状态矩阵、persistence schema、config key 或 test case schema;不进入 Step 7。 |

### 2. 自检轴

| 自检轴 | 判断问题 | 通过标准 |
|---|---|---|
| 对象完整性 | `R6.8`~`R6.20` 已确认对象是否都被 §6 草稿承接。 | §6.2 总览覆盖七实现单元,§6.3~§6.9 覆盖对象族责任和后续承接。 |
| 边界完整性 | Step 6 是否越界写了后续 Step 内容。 | 只保留对象责任、字段来源、状态 owner 预筛和后续暂停条件。 |
| 字段来源闭环 | 高复用 ref / marker / decision / diagnostic / cursor 来源是否有闭口或暂停条件。 | `R6.22` 结论进入 §6.10,且缺正式来源时明确后续 Step 必须停审。 |
| 状态主语闭环 | 当前对象中哪些拥有状态,哪些只是 technical / local / decision state 是否被区分。 | domain truth、policy decision、read/material、external、application、infra/entry local state 分组清楚。 |
| 历史过滤闭环 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox、delivery、P0/P1 是否被正向继承。 | 仅作为历史污染样本,没有回流为当前对象主线。 |
| Step 7 readiness | Trait / Port / Adapter 是否已有对象 owner 和暂停条件输入。 | Step 7 可从对象 owner、field source、missing-source pause condition 开始,但不得补 Step 6 未闭字段。 |

### 3. 自检结论

| 项 | 判断 | 说明 |
|---|---|---|
| 对象族覆盖 | pass | §6 草稿覆盖 contracts、domain、application、infra、api、worker、jobs 七实现单元。 |
| 对象主语稳定性 | pass | 当前对象主语来自本轮 `00/01/02` 和 Step 5 / Step 6,未把旧 completed 状态反推为当前事实。 |
| 对象卡片边界 | pass | `R6.26` 是回填草稿摘要,未新增 `R6.8`~`R6.20` 之外的对象卡片。 |
| 后续 Step 边界 | pass | trait / port 后移 Step 7;protocol 后移 Step 8;flow 后移 Step 9;state matrix 后移 Step 10;persistence 后移 Step 11;error / concurrency / config / observability / test 后移对应 Step。 |
| 字段来源暂停条件 | pass | §6.10 已把 ref、kind、marker、decision、diagnostic、cursor / checkpoint 的缺来源场景列为暂停条件。 |
| 状态 owner 预筛 | pass | 当前只做 owner 预筛,不声明完整状态矩阵。 |
| 历史污染关闭 | pass | §6.11 明确旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox、delivery、PostgreSQL / sqlx / route / topic / cron 不进入对象字段。 |
| Step 7 输入 | conditional_pass | 可进入 Step 7 的停审写入准备,但 Step 7 开工必须先读取 §6.12,遇到缺 port / mapper / builder / key 来源必须暂停回设计。 |

### 4. `R6.28` 写入边界

`R6.28` 是 Step 6 的停审记录写入,不是新的对象定义模块。

| `R6.28` 允许写入 | `R6.28` 禁止写入 |
|---|---|
| Step 6 自检最终表。 | 新对象卡片、对象字段补充或对象命名调整。 |
| Step 6 completed / stop-review 结论。 | trait / port / adapter 方法或 repository contract。 |
| Step 7 readiness / pause condition 汇总。 | command / query / event / job protocol DTO。 |
| flow 与项目台账同步到 Step 7 等待确认。 | function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| 正式 `03-详细设计.md` 仍不修改的记录。 | 直接修改正式 `03-详细设计.md`。 |

### 5. 停审判断

| 判断项 | 结果 |
|---|---|
| 是否建议进入 `R6.28` | 是。 |
| 是否建议直接进入 Step 7 | 否,必须先完成 `R6.28` 停审写入并同步三层门禁。 |
| 是否存在必须回到前序 R6 模块补对象的 blocker | 否。 |
| 是否允许正式 `03-详细设计.md` 装配 | 否,正式装配仍后移到 Step 19 或独立装配门禁。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 6 自检思考 | 是。 |
| 是否形成 `R6.28` 写入边界 | 是。 |
| 是否新增对象卡片或改写已完成对象字段 | 否。 |
| 是否写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R6.28` 写入或 Step 7 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.28 自检与停审:再写入`;只允许写入 Step 6 自检最终表、停审记录、Step 7 readiness / pause condition 汇总,并同步 flow / 项目台账到 Step 7 等待确认状态;不得修改正式 `03-详细设计.md`;不得新增对象卡片或改写已完成对象字段;不得写 trait / port、protocol DTO schema、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得直接进入 Step 7 开工。

---

## R6.28 自检与停审:再写入

Step 6 `逐模块定义对象实现契约` 已完成本轮 full-restart 讨论。当前结论只作为后续 Step 7~16 的对象 owner、字段来源、状态主语预筛、历史污染过滤和暂停条件来源,不直接修改正式 `03-详细设计.md`。

### 1. 停审记录

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 6 逐模块定义对象实现契约 |
| 当前模块 | `R6.28 自检与停审:再写入` |
| 当前状态 | completed |
| 下一 Step | Step 7 逐模块定义 Trait / Port / Adapter 契约 |
| 下一允许动作 | `R7.1 开工与必读文档:先思考` |
| 正式文档状态 | 未修改正式 `03-详细设计.md`;§6 草稿仅存在于本中间产物。 |
| 旧 Step 7 文件定位 | 旧 `03_ddd_step_07_trait_port_adapter.md` 已重置为 full-restart 门禁壳;不得继承旧 `[x] 已确认`、旧 `MethodContent`、旧 repository / outbox / snapshot / PostgreSQL 口径。 |

### 2. Step 6 最终自检结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| `R6.1`~`R6.28` 是否完整 | pass | Step 6 已覆盖开工、L1-governance 框架对齐、对象发现、对象族逐组思考 / 写入、字段来源审计、历史污染审计、§6 回填草稿、自检和停审。 |
| 对象族总览是否闭口 | pass | 已覆盖 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七实现单元。 |
| core truth / support / policy / helper / entry 对象是否闭口 | pass | 已按对象家族写入对象责任、关键边界、禁止事项和后续承接。 |
| 字段来源与状态主语是否闭口 | pass | 已形成 ref、kind、marker、decision、diagnostic、cursor / checkpoint 的来源规则和暂停条件。 |
| 后续 Step 边界是否闭口 | pass | trait / port 后移 Step 7;protocol 后移 Step 8;flow 后移 Step 9;state matrix 后移 Step 10;persistence 后移 Step 11;error / concurrency / config / observability / test 后移对应 Step。 |
| 旧 Step 6 / 旧正式 03 污染是否关闭 | pass | 旧 `MethodContent`、P0/P1、publish、snapshot、fingerprint、outbox、delivery、PostgreSQL / sqlx / route / topic / cron 未回流为当前对象主线。 |
| 正式 `03-详细设计.md` 是否受保护 | pass | 本 Step 全部写入停在 `design-calibration` 中间产物。 |

### 3. Step 6 完成范围与非范围

| 类别 | 已完成 | 未完成 / 后移 |
|---|---|---|
| 对象契约 | 对象身份、owner、结构责任、关键字段来源、不变量边界、禁止事项、状态 owner 预筛和后续承接。 | 不再在 Step 6 补 port、DTO、flow、完整 state matrix、persistence、config 或 test。 |
| §6 草稿 | 已在 `R6.26` 写入可装配到正式 `03-详细设计.md` 的 §6 候选草稿。 | 正式 `03-详细设计.md` 后续由对应装配模块或 Step 19 统一回填。 |
| 字段来源 | 已列出允许来源和缺来源暂停条件。 | 具体 port / mapper / builder 方法签名由 Step 7 承接。 |
| 状态主语 | 已区分 domain truth state、policy decision、read/material state、external state、application technical state、infra / entry local state。 | 完整状态矩阵由 Step 10 承接。 |
| 历史过滤 | 已关闭旧对象、旧状态、旧机制和旧基础设施主线污染。 | 后续 Step 若引用旧材料,必须重新通过当前 Step 输入闭口。 |

### 4. Step 7 进入条件

Step 7 可以在用户确认后启动,但必须遵守:

| 进入项 | Step 7 可做 | Step 7 不得做 |
|---|---|---|
| 必读恢复 | 先读项目台账、03 flow、Step 1~6 当前中间产物、正式 `00/01/02` 和规范。 | 根据旧 Step 7 completed 状态直接续写。 |
| port 主轴 | 基于 Step 6 对象 owner 和 Step 5 模块主轴,逐模块定义 trait / port / adapter 契约。 | 恢复旧 `MethodContentRepository`、旧 outbox / snapshot / PostgreSQL port 作为当前结论。 |
| 签名来源 | 只从当前对象字段、owner、field source、policy / resolver / mapper / builder 需要和 adapter boundary 推导 port。 | 从旧 §27、旧 repository 表、旧 implementation 习惯或 raw string 私自补方法。 |
| 暂停条件 | 如果 port 需要对象字段、marker、decision、schema、key、config 或 evidence 来源但 Step 6 未闭口,必须暂停回设计。 | 由实现端自行补 schema / mapper / port / state / config key。 |
| 后续边界 | 只定义 trait / port / adapter 契约和 adapter ownership。 | 写 protocol DTO、function flow、state matrix、persistence schema、config key 或 test case schema。 |

### 5. 三层状态同步要求

| 文件 | 同步要求 |
|---|---|
| `project_execution_ledger.md` | 当前恢复点推进到 Step 7 `R7.1 开工与必读文档:先思考` 等待确认。 |
| `03_ddd_calibration_flow.md` | Step 6 标记 completed;Step 7 标记 wait_user_confirm_to_R7.1。 |
| `03_ddd_step_06_object_contracts.md` | 当前文件标记 completed,并保留本停审记录。 |
| `03_ddd_step_07_trait_port_adapter.md` | 仅重置为 full-restart 门禁壳;不写 Step 7 具体 port 契约。 |

### 6. 当前自检

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 6 停审记录 | pass |
| 是否同步 flow / 台账到 Step 7 等待状态 | pass |
| 是否重置旧 Step 7 completed 污染入口 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 7 正文 | pass |

next_allowed_action: 等待用户确认后进入 `03-详细设计` Step 7 `R7.1 开工与必读文档:先思考`;只允许思考 Step 7 必读文档、Step 6 承接边界、trait / port / adapter 分组框架、旧 Step 7 污染隔离和 `R7.2` 写入边界;不得直接修改正式 `03-详细设计.md`;不得继承旧 Step 7 completed 状态;不得写具体 trait / port 方法签名、adapter method、protocol DTO、function flow、state matrix、persistence schema、config key 或 test case schema;不得进入 `R7.2`、Step 8 或后续 Step。
