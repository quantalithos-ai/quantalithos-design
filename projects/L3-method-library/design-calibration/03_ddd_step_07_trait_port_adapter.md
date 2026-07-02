# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 回填章节: `projects/L3-method-library/03-详细设计.md` §7 Trait / Port / Adapter 契约
> 创建日期: 2026-06-22
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: Step 7 completed;等待 Step 8 `R8.1 开工与必读文档:先思考`
> 当前门禁: `R7.26` completed;已同步 flow / 项目台账到 Step 8 wait_user_confirm

---

## 0. 文件重置记录

本文件已在 Step 6 `R6.28 自检与停审:再写入` 中重置为 full-restart 门禁壳。

旧 `03_ddd_step_07_trait_port_adapter.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、snapshot、outbox、PostgreSQL、旧 repository 清单和旧 §27 口径展开。该 completed 状态和旧 port 结论全部失效。

当前文件不继承旧 Step 7 的 trait、repository、adapter、函数签名、调用关系、P0/P1 分层或实现位置。旧内容只能作为后续 `R7` 历史污染审计输入,不得作为当前 Step 7 的正向真相源。

## R7.1 开工与必读文档:先思考

### 1. 当前模块目标

`R7.1` 只能思考 Step 7 开工边界、必读文档、Step 6 承接输入、trait / port / adapter 分组框架和旧 Step 7 污染隔离方式。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考必读文档、输入边界、分组框架、旧污染隔离和 `R7.2` 写入边界。 |
| 当前禁止 | 写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. Step 7 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承的内容 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、旧材料隔离规则。 | 跳过当前门禁直接写 port。 |
| `03_ddd_calibration_flow.md` | Step 6 completed、Step 7 wait_user_confirm_to_R7.1、后续 Step 阻塞关系。 | 将 Step 8+ 内容提前写入 Step 7。 |
| `03_ddd_step_01_input_boundary.md` | 输入权威顺序和历史材料隔离。 | 从旧 `03-详细设计.md` 直接恢复 port 结论。 |
| `03_ddd_step_02_scope.md` | 本轮详细设计范围和非范围。 | 恢复旧 P0/P1 分层作为当前范围。 |
| `03_ddd_step_03_runtime_constraints.md` | language/runtime、跨仓依赖、安全边界和缺口回设计规则。 | 根据实现习惯自行补 adapter schema。 |
| `03_ddd_step_04_module_layout.md` | 七实现单元与文件布局 owner。 | 新增未闭口 crate / module。 |
| `03_ddd_step_05_module_contracts.md` | 模块主轴、依赖方向、八组件 owner 路由。 | 让 entry / infra 越过 application port 边界。 |
| `03_ddd_step_06_object_contracts.md` | 对象 owner、field source、state owner 预筛、Step 7 readiness / pause condition。 | 写 Step 6 未闭口的对象字段或状态事实。 |

### 3. Step 7 开工红线

| 红线 | 说明 |
|---|---|
| 不继承旧 completed | 旧 Step 7 的 `[x] 已确认`、旧 §27 清单和旧 repository 名称全部视为 historical_material。 |
| 不从旧对象推 port | 旧 `MethodContent`、snapshot、fingerprint、outbox、delivery、PostgreSQL / sqlx 不能作为当前 port 主线。 |
| 不自行补口 | 如果 Step 6 没有给出对象 owner、field source、marker / decision / diagnostic 来源,Step 7 必须暂停回设计闭口。 |
| 不越过 Step 边界 | Step 7 只定义 trait / port / adapter 契约;不写 protocol、flow、state matrix、persistence、config、test。 |
| 不修改正式文档 | 正式 `03-详细设计.md` 仍等待后续装配门禁。 |

### 4. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否已完成 Step 6 | 是。 |
| 是否已重置旧 Step 7 completed 污染入口 | 是。 |
| 是否已经开始写 Step 7 port 正文 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |

### 5. 必读文档思考结果

| 文档 | Step 7 使用方式 | 当前判断 |
|---|---|---|
| `project_execution_ledger.md` | 恢复当前模块和单模块推进规则。 | 当前只允许 `R7.1`,完成后等待 `R7.2`。 |
| `03_ddd_calibration_flow.md` | 确认 Step 6 completed、Step 7 in_progress 和后续 Step 阻塞关系。 | Step 8~16 均仍 blocked_by 前序 Step。 |
| `03_ddd_step_01_input_boundary.md` ~ `03_ddd_step_04_module_layout.md` | 承接输入权威、范围、runtime 约束和七实现单元布局。 | Step 7 不能新增 crate / module 或恢复旧 P0/P1 口径。 |
| `03_ddd_step_05_module_contracts.md` | 承接 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七模块主轴。 | port owner 必须服从该依赖方向。 |
| `03_ddd_step_06_object_contracts.md` | 承接对象 owner、field source、state owner 预筛和 Step 7 pause condition。 | Step 7 不得补 Step 6 未闭字段,缺来源时停审。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 承接 Definition vs Use、body-free、数据归属、接口骨架和配置影响轮廓。 | port 不得承接下游运行 truth、raw body、topic、HTTP route、DDL 或配置 key。 |
| `02_hld_step_07_api_interface_skeleton.md` / `02_hld_step_08_processing_flows.md` / `02_hld_step_09_state_machine.md` | 提供后续 DTO、flow、state matrix 对读取面 / 写入面的需求线索。 | 只能作为接口族和读取面需求线索,不能提前写 DTO / flow / state。 |
| `详细设计讨论流程_SOP.md` Step 7 | 约束输出形态和逐模块停审。 | 必须先写模块内 port capability / 接缝清单,再写 trait 契约。 |
| `详细设计书写规范.md` | 约束 trait / port / adapter 表和 Rust trait 片段格式。 | R7 后续写入必须给参数、返回和错误类型。 |
| `设计真相源闭环与可落码性标准.md` | 约束读取面、version、UnitOfWork、stored result、adapter outcome、fake / durable 等价。 | 缺正式 schema / port / mapper / state / config / evidence 来源时不得自行补。 |
| `L1-governance` Step 7 | 框架参考。 | 采用分层方法和审计深度,不复制 governance 领域语义。 |

### 6. Step 7 框架思考

Step 7 应采用 L1-governance 的框架强度,但替换为 L3-method-library 的对象和边界。

| 框架点 | 本仓采用方式 |
|---|---|
| 模块级 port owner | `application` 是 repository / resolver / publisher / handoff / UnitOfWork / Clock / IdGenerator / result store port 的主要定义层。 |
| adapter owner | `infra` 实现 application port,不得拥有业务决策。 |
| domain 边界 | `domain` 只定义 object / policy / invariant,不定义 repository 或 external adapter trait。 |
| contracts 边界 | `contracts` 只定义 typed ref、public shell、DTO / event / job 协议类型,不得反向依赖 application port。 |
| entry 边界 | `api`、`worker`、`jobs` 只解析 entry shell 并调用 application service / facade,不得直接访问 repository / resolver / publisher。 |
| 读取面闭口 | repository / resolver 不能只给 save;必须覆盖 Step 8 DTO、Step 9 flow、Step 10 state 和 Step 11 persistence 所需读取面。 |
| 写入面闭口 | optimistic version、UnitOfWork、append-only、idempotency、stored result 和 sidecar truth 必须有正式来源和配对读取面。 |
| fake / durable 等价 | 每个 adapter contract 必须能让 fake 和 durable 共享同一输入、输出、错误和 version 语义。 |

### 7. 候选模块顺序

`R7.2` 应先固化 Step 7 的开工记录和完整模块计划。当前建议的后续顺序如下,但具体写入仍需逐模块确认:

| 顺序 | 模块 | 目标 |
|---|---|---|
| R7.2 | 开工与必读文档:再写入 | 写入读取记录、输入基线、Step 内计划和旧材料规则。 |
| R7.3 / R7.4 | L1-governance 框架对齐 | 固化可借鉴的 port 分层、读取面、version、adapter outcome 和停审模板。 |
| R7.5 / R7.6 | Step 6 承接与接缝发现轴 | 从对象 owner、field source、state owner 和 Step 8~11 后续需求抽取 port capability 池。 |
| R7.7 / R7.8 | application 基础 port / helper | 讨论并写入 UnitOfWork、Clock、IdGenerator、page / version helper、stored result 基础面。 |
| R7.9 / R7.10 | domain truth repository port | 讨论并写入 definition、catalog、formalization、version、consumption 等 truth repository 接缝。 |
| R7.11 / R7.12 | support / trace / relation / material repository port | 讨论并写入 external summary、trace、impact、audit、lineage、relation、package、method set 等接缝。 |
| R7.13 / R7.14 | policy / resolver / mapper / builder port | 讨论并写入 formalization basis、visibility/read decision、degraded decision、marker / diagnostic 来源接缝。 |
| R7.15 / R7.16 | inbound / outbound / publisher / handoff port | 讨论并写入 inbound source、event candidate publisher、handoff、external adapter body-free 接缝。 |
| R7.17 / R7.18 | jobs / maintenance / runtime adapter port | 讨论并写入 refresh、reconciliation、cursor/checkpoint、adapter availability 和 runtime assembly 接缝。 |
| R7.19 / R7.20 | infra implementation / entry restriction | 写入 infra adapter map、api / worker / jobs 禁止直连 repository / adapter 规则。 |
| R7.21 / R7.22 | 跨模块接缝审计 | 审计重复 port、反向依赖、缺读取面、缺 version 来源和后续 Step 承接。 |
| R7.23 / R7.24 | 回填草稿 | 写入正式 §7 候选草稿,仍不改正式 `03-详细设计.md`。 |
| R7.25 / R7.26 | 自检与停审 | 关闭 Step 7 并同步到 Step 8 等待确认。 |

### 8. `R7.2` 写入边界

| `R7.2` 允许写入 | `R7.2` 禁止写入 |
|---|---|
| 必读文档表和读取状态。 | 具体 trait / port 方法签名。 |
| Step 7 输入基线和旧材料处理规则。 | repository / resolver / publisher / handoff contract 正文。 |
| Step 内模块计划和每次确认只推进一个模块的规则。 | adapter implementation method、fake / durable 具体行为。 |
| L1-governance 框架参考边界。 | protocol DTO、function flow、state matrix、persistence schema、config key、test case schema。 |
| `R7.3` 进入门禁。 | 正式 `03-详细设计.md`。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 `R7.1` 必读与框架思考 | 是。 |
| 是否形成 Step 7 候选模块顺序 | 是。 |
| 是否形成 `R7.2` 写入边界 | 是。 |
| 是否继承旧 Step 7 completed 状态 | 否。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.2 开工与必读文档:再写入`;只允许写入 Step 7 必读文档表、读取状态、输入基线、旧材料处理规则、Step 内模块计划、L1-governance 框架参考边界和 `R7.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得继承旧 Step 7 completed 状态;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key 或 test case schema;不得进入 `R7.3`、Step 8 或后续 Step。

---

## R7.2 开工与必读文档:再写入

### 1. 开工记录

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.2 开工与必读文档:再写入`。 |
| 本模块目标 | 固化 Step 7 必读文档、读取状态、输入基线、旧材料处理规则、Step 内模块计划和 `R7.3` 进入门禁。 |
| 当前状态 | completed |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. 必读文档与读取状态

| 文档 | 读取状态 | Step 7 使用方式 |
|---|---|---|
| `project_execution_ledger.md` | 已读 | 确认当前恢复点、单模块推进、旧材料隔离和 `R7.2` 写入边界。 |
| `03_ddd_calibration_flow.md` | 已读 | 确认 Step 6 completed、Step 7 in_progress 和 Step 8+ 阻塞关系。 |
| `03_ddd_step_01_input_boundary.md` | 承接已完成结论 | 输入权威顺序和历史材料隔离规则。 |
| `03_ddd_step_02_scope.md` | 承接已完成结论 | 本轮详细设计范围、非范围和旧 P0/P1 禁入。 |
| `03_ddd_step_03_runtime_constraints.md` | 承接已完成结论 | runtime、跨仓依赖、安全边界、缺口回设计规则。 |
| `03_ddd_step_04_module_layout.md` | 承接已完成结论 | 七实现单元、文件布局 owner 和依赖方向。 |
| `03_ddd_step_05_module_contracts.md` | 已读 / 直接前序 | 七模块主轴、模块职责、依赖边界、八组件 owner 路由。 |
| `03_ddd_step_06_object_contracts.md` | 已读 / 直接前序 | 对象 owner、field source、state owner 预筛、Step 7 readiness / pause condition。 |
| `00-需求文档.md` | 正式上游 | Definition vs Use、body-free、功能边界、数据归属和接口 / 依赖红线。 |
| `01-架构设计.md` | 正式上游 | 数据所有权、依赖方向、通信方式、正式承接层和外部输入隔离。 |
| `02-概要设计.md` | 直接输入 | 代码主体框架、接口骨架、处理流、状态、配置影响和详细设计承接清单。 |
| `02_hld_step_07_api_interface_skeleton.md` | 解释性输入 | Command / Query / Consumer / Event / Job 接口族和只读 / no-repair 边界。 |
| `02_hld_step_08_processing_flows.md` | 解释性输入 | 后续 Step 9 flow 对读取面、写入面和副作用接缝的需求线索。 |
| `02_hld_step_09_state_machine.md` | 解释性输入 | 后续 Step 10 状态 owner、状态触发来源和 forbidden transition 线索。 |
| `02_hld_step_12_detailed_design_handoff.md` | 解释性输入 | 详细设计继续展开方向、回退规则和排除项。 |
| `02_hld_step_13_risks_open_questions.md` | 解释性输入 | 防止把已承接的 port / repository / config / test 细节重复挂起。 |
| `详细设计讨论流程_SOP.md` | 规范 | Step 7 输出、问题清单、逐模块停审和进入 Step 8 条件。 |
| `详细设计书写规范.md` | 规范 | Trait / Port / Adapter 表、Rust trait 片段、参数 / 返回 / 错误类型要求。 |
| `设计文档讨论中间产物规范.md` | 规范 | 单模块推进、先思考后写入、批次写入和中间产物结构。 |
| `设计真相源闭环与可落码性标准.md` | 规范 | schema / port / state / mapper / config / evidence 缺口停审规则。 |
| `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | framework_reference | 只参考框架强度、分组方法、闭口审计和停审表达。 |

### 3. 输入基线

| 输入轴 | 当前基线 |
|---|---|
| 模块主轴 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七实现单元。 |
| port 定义主轴 | `application` 是 repository、resolver、publisher、handoff、UnitOfWork、Clock、IdGenerator、stored result / idempotency 等 port 的主要定义层。 |
| adapter 实现主轴 | `infra` 实现 application port;runtime builder / adapter binding 后续由 Step 14 承接配置。 |
| domain 边界 | `domain` 不定义 repository / external adapter trait,只定义对象、policy、guard、invariant。 |
| contracts 边界 | `contracts` 不定义 application port,只定义 typed ref、public shell 和后续协议类型。 |
| entry 边界 | `api`、`worker`、`jobs` 不直接访问 repository / resolver / publisher / handoff adapter。 |
| Step 6 承接 | 每个 port 必须回指对象 owner、field source、state owner、marker / decision / diagnostic 来源或后续 flow / state 需求。 |
| 后续 Step 边界 | Step 7 不写 DTO、flow、state matrix、persistence、config、test;但必须为它们提供读取面 / 写入面接缝。 |

### 4. 旧材料处理规则

| 旧材料 | 当前处理 |
|---|---|
| 旧 Step 7 `[x] 已确认` | 失效,不得作为本轮 Step 7 completed 依据。 |
| 旧 `MethodContentRepository` / snapshot / outbox / PostgreSQL port | 只作为污染样本,不得作为当前 port 主线。 |
| 旧 §27 repository 清单 | 不直接继承;如有可用思想,必须经当前对象 owner 和 Step 6 字段来源重新闭口。 |
| 旧 P0/P1 分层 | 不作为本轮 port 范围划分。 |
| 旧 HTTP / topic / SQL / worker / retry 细节 | 后移 Step 8 / 11 / 12 / 13 / 14;不得进入 Step 7 开工阶段。 |

### 5. Step 内模块计划

| 模块 | 状态 | 产出边界 | 下一动作 |
|---|---|---|---|
| R7.1 开工与必读文档:先思考 | completed | 必读输入、分组框架、候选模块顺序、`R7.2` 写入边界。 | 已完成。 |
| R7.2 开工与必读文档:再写入 | completed | 开工记录、读取状态、输入基线、旧材料规则、Step 内计划、`R7.3` 门禁。 | 等待进入 `R7.3`。 |
| R7.3 / R7.4 L1-governance 框架对齐 | completed | 已固化 port 分层、读取面、version、UnitOfWork、stored result、adapter outcome、停审模板。 | 已完成。 |
| R7.5 / R7.6 Step 6 承接与接缝发现轴 | completed | capability -> seam 候选池,对象能力与 port 需求映射。 | `R7.6` completed;等待用户确认进入 `R7.7`。 |
| R7.7 / R7.8 application 基础 port / helper | completed | UnitOfWork、Clock、IdGenerator、page / version helper、stored result 基础面。 | `R7.8` completed;已形成 `R7.9` 进入门禁。 |
| R7.9 / R7.10 domain truth repository port | completed | definition、catalog、formalization、version truth repository 接缝,并确认 basis summary / consumption material 的切口。 | `R7.10` completed;等待用户确认进入 `R7.11`。 |
| R7.11 / R7.12 support / trace / relation / material repository port | completed | external summary、trace、impact、audit、lineage、relation、package、method set、consumption material 接缝。 | `R7.12` completed;等待用户确认进入 `R7.13`。 |
| R7.13 / R7.14 policy / resolver / mapper / builder port | completed | basis、read decision、degraded decision、marker、diagnostic、builder 来源接缝。 | `R7.14` completed;等待用户确认进入 `R7.15`。 |
| R7.15 / R7.16 inbound / outbound / publisher / handoff port | completed | inbound source、event candidate publisher、handoff、external body-free adapter 接缝。 | `R7.16` completed;等待用户确认进入 `R7.17`。 |
| R7.17 / R7.18 jobs / maintenance / runtime adapter port | completed | 已固化 maintenance task、progress、run history、refresh target planner、checkpoint、recovery issue、runtime assembly、adapter availability family 承接记录。 | 已完成。 |
| R7.19 / R7.20 infra implementation / entry restriction | completed | infra adapter map、runtime builder slot map、api / worker / jobs 禁止直连规则、fake / durable parity 和后续 Step 承接摘要已写入。 | 已完成。 |
| R7.21 / R7.22 跨模块接缝审计 | completed | Step 6 承接闭环、模块内停审记录、跨模块接缝闭环、Step 8~17 承接断点和 `R7.23` 门禁已写入。 | 已完成。 |
| R7.23 / R7.24 回填草稿 | completed | 新 §7 Trait / Port / Adapter 契约候选草稿、family 表、历史污染过滤摘要和 Step 8~17 承接摘要已写入中间产物。 | pass |
| R7.25 / R7.26 自检与停审 | completed | Step 7 停审记录已写入,flow / 项目台账已同步到 Step 8 等待状态。 | pass |

### 6. L1-governance 框架参考边界

| 可参考 | 不可复制 |
|---|---|
| `application` 定义 port、`infra` 实现 adapter、entry 只调用 application 的分层方式。 | governance 的 context / gate / decision / approval / policy 对象语义。 |
| 先基础 helper,再 truth repository,再 append-only / projection / reference / outbox / result,再 external seam 的展开方式。 | governance 的 repository 名称、ref 名称、GRC / policy / control 领域字段。 |
| 每组 port 必须说明调用方、实现方、读取面、写入面、version / UoW / stored result / fake parity 的审计方式。 | governance 的具体函数签名或状态流转。 |
| 末尾做跨模块接缝闭环审计和 Step 6 open item closure 的做法。 | governance 的已完成结论直接迁移为本仓结论。 |

### 7. `R7.3` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 L1-governance Step 7 的框架深度、分组顺序、读取面闭口、version / UnitOfWork、stored result、adapter outcome、entry restriction 和停审模板。 |
| 当前禁止 | 不写 L3-method-library 具体 port 方法、repository contract、adapter method、protocol DTO、flow、state matrix、persistence schema、config key 或 test case schema。 |
| 参考限制 | 只参考框架,不得复制 governance 领域语义。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 7 必读文档表 | 是。 |
| 是否写入读取状态与输入基线 | 是。 |
| 是否写入旧材料处理规则 | 是。 |
| 是否写入 Step 内模块计划 | 是。 |
| 是否写入 L1-governance 框架参考边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.3` 思考或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.3 L1-governance 框架对齐:先思考`;只允许思考 L1-governance Step 7 的框架深度、分组顺序、读取面闭口、version / UnitOfWork、stored result、adapter outcome、entry restriction 和停审模板;不得复制 governance 领域语义;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key 或 test case schema;不得进入 `R7.4`、Step 8 或后续 Step。

---

## R7.3 L1-governance 框架对齐:先思考

### 1. 思考边界

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.3 L1-governance 框架对齐:先思考`。 |
| 本模块目标 | 抽取 L1-governance Step 7 的框架深度、分组顺序、读取面闭口、version / UnitOfWork、stored result、adapter outcome、entry restriction 和停审模板。 |
| 当前状态 | completed |
| 禁止范围 | 不复制 governance 领域语义;不写 L3-method-library 具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. L1-governance Step 7 框架观察

| 观察项 | L1-governance 做法 | 本仓可借鉴的框架 |
|---|---|---|
| Step 目标 | 明确 Step 7 不是 DTO / persistence,而是关闭跨层接缝问题。 | 本仓 Step 7 也必须只闭合 trait / port / adapter 接缝,不得下沉 Step 8 / 11 内容。 |
| 输入表 | 从 Step 5 模块主轴、Step 6 对象契约、接口骨架、处理流、状态、架构依赖和真相源标准取输入。 | 本仓应保留同等输入层级,尤其把 Step 6 对象能力与 Step 8~11 后续需求同时作为 port 来源。 |
| 分批计划 | 先框架与归属,再基础 helper,再 truth repository,再 append-only / maintenance,再 external seam,最后 infra / entry restriction 和审计。 | 本仓 R7 模块顺序应沿用“先框架、再基础、再 truth、再 support、再 external / runtime、最后审计”的节奏。 |
| SOP 问题回答 | 开头先回答 port owner、实现方、capability 需要接缝、读取面 / 写入面是否闭口。 | 本仓后续每组 port 前都应先回答“为什么需要这个接缝”和“承接 Step 6 哪个能力”。 |
| 模块归属总览 | 明确 `application` 定义并调用 port,`infra` 实现,`domain` 不接触 repository,entry 不直接调用 repository。 | 本仓必须先固化同类模块归属矩阵,防止 entry / infra 直接接触业务 truth。 |
| helper surface | 将 transaction ref、version、cursor、page、versioned wrapper 等作为 application-local helper。 | 本仓也需要先定义 helper 类别和归属,但具体名称与字段后续再按本仓对象写入。 |
| 读取面闭口 | 强调 `get_with_version`、list、affected view、stored result get 等读取面。 | 本仓不能只定义 save / append;所有后续 DTO / flow / state / persistence 需要的读取面都要显式存在。 |
| 写入面闭口 | expected version、UnitOfWork、append-only、payload snapshot、stored replay 均有来源。 | 本仓每个写 port 都要同时说明 version / UoW / append-only / stored result / sidecar 的来源。 |
| external seam | Resolver / publisher / handoff / export 只返回 body-free outcome、snapshot、package / receipt ref。 | 本仓外部摘要、publisher、handoff、runtime adapter 也必须保持 body-free 和 outcome enum / safe summary。 |
| infra map | 用 application port -> infra file -> adapter state -> 实现要求表连接 Step 7 和 Step 11 / 14。 | 本仓应在后段写 infra implementation map,但不在前段提前写 durable schema 或 config key。 |
| entry restriction | `api`、`worker`、`jobs` 只调用 application facade。 | 本仓必须把 entry direct repository / adapter call 作为硬禁令。 |
| open item closure | 把 Step 6 open item 映射到 Step 7 关闭结论和后续 Step。 | 本仓应在跨模块审计前检查 Step 6 pause condition 哪些已被 Step 7 闭合,哪些必须后移。 |
| stop-review | 每个模块和跨模块都有停审表,最后才允许进入 Step 8。 | 本仓后续每个 R7 写入模块必须保留停审记录,不能一次性宣布 Step 7 completed。 |

### 3. 本仓可采用的结构模板

| 模板 | 用途 | `R7.4` 应固化内容 |
|---|---|---|
| Step 7 目标与非目标模板 | 防止 port 讨论滑向 DTO / persistence / config / test。 | 写明 Step 7 只关闭接缝,不写后续 Step 正文。 |
| 输入矩阵模板 | 明确每个 port 来源于对象、接口、flow、state 或架构边界。 | 写入 Step 5 / Step 6 / 02 接口和 flow / 状态线索如何参与。 |
| 模块归属矩阵模板 | 固定定义方、实现方、调用方和禁止调用。 | 写入 contracts/domain/application/infra/api/worker/jobs 的 port 角色。 |
| port capability 清单模板 | 每个模块先列 capability / 对象能力 / 需要接缝 / 调用方 / 实现方 / 后续承接。 | 作为 R7.5 之后所有具体模块的统一表头。 |
| helper surface 模板 | 处理 version、page、cursor、transaction、id / clock、stored result 等横向基础类型。 | 明确先讨论 helper 类别,再进入 repository。 |
| repository / resolver 模板 | 对每个 port 写作用、输入、输出、错误、读取面、写入面、version / UoW。 | 后续写具体 port 时必须填满这些列。 |
| adapter outcome 模板 | 避免 service 从错误字符串或 fake 私有状态推断业务 outcome。 | external / publisher / handoff / runtime 类 port 必须有正式 outcome 或 safe summary。 |
| infra implementation map 模板 | 连接 application port 与 infra adapter state。 | 后续只列实现归属与要求,不写 schema / config。 |
| entry restriction 模板 | 禁止 api / worker / jobs 越过 application。 | 明确 entry 可调用 facade,禁止 repository / domain transition / adapter direct call。 |
| closure audit 模板 | 检查重复 port、反向依赖、读取面缺失、version 来源缺失、Step 8~11 承接。 | 作为 R7.21 / R7.22 的审计骨架。 |

### 4. 不可复制的治理语义

| 不可复制项 | 处理方式 |
|---|---|
| governance context / gate / decision / approval / policy / control / nonconformity 对象语义 | 不进入本仓。只借鉴 truth repository 分组方式。 |
| Governance-specific ref、version、subject mapper、GRC export、AIIA / SoA 等名词 | 不进入本仓。后续必须用本仓 Step 6 对象和 typed ref 重新命名。 |
| governance 的具体 trait 方法签名 | 不复制。后续只按本仓对象能力和字段来源定义。 |
| governance 的状态流转和 job / export 领域结论 | 不复制。只保留“需要读取面 / outcome / stored result”的框架判断。 |
| governance Step 7 completed 结论 | 不可作为本仓 Step 7 completed 依据。本仓必须逐模块完成 R7.4~R7.26。 |

### 5. 对本仓后续 R7 的约束判断

| 判断 | 说明 |
|---|---|
| 先写全仓 port 总表不可取 | SOP 要求按模块逐个定义;全局表只能作为后期索引或审计产物。 |
| 可以先建立 port family 顺序 | 先 helper、truth repository、support/material repository、resolver/mapper、external seam、runtime/entry restriction、审计。 |
| 每个 port 必须可回指 Step 6 | 若找不到对象 owner、field source、state owner 或 marker / decision 来源,该 port 不可写入。 |
| 每个读取面必须面向后续 Step | Step 8 DTO、Step 9 flow、Step 10 state、Step 11 persistence 所需读取面都要提前闭口。 |
| 每个写入面必须有并发与事务线索 | expected version、UnitOfWork、append-only、stored result、checkpoint / cursor 不能留给实现端猜。 |
| external / adapter 不得变成业务 owner | Adapter 只能返回 body-free outcome / summary / ref / diagnostic,不能决定 domain truth。 |

### 6. `R7.4` 写入边界

| `R7.4` 允许写入 | `R7.4` 禁止写入 |
|---|---|
| L1-governance 框架对齐记录。 | L3-method-library 具体 trait / port 方法签名。 |
| 可借鉴模板和不可复制语义表。 | 具体 repository / resolver / publisher / handoff contract 正文。 |
| 本仓后续 R7 模块应采用的表格模板。 | adapter implementation method、durable schema、fake 行为细节。 |
| `R7.5` Step 6 承接与接缝发现轴进入门禁。 | protocol DTO、function flow、state matrix、persistence schema、config key、test case schema。 |
| 仍不修改正式 `03-详细设计.md` 的记录。 | 正式 `03-详细设计.md`。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 L1-governance Step 7 框架观察 | 是。 |
| 是否形成本仓可采用模板 | 是。 |
| 是否列出不可复制 governance 语义 | 是。 |
| 是否形成 `R7.4` 写入边界 | 是。 |
| 是否写 L3 具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.4` 写入或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.4 L1-governance 框架对齐:再写入`;只允许写入 L1-governance 框架对齐记录、可借鉴模板、不可复制语义、本仓后续 R7 表格模板和 `R7.5` 进入门禁;不得复制 governance 领域语义;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key 或 test case schema;不得进入 `R7.5`、Step 8 或后续 Step。

---

## R7.4 L1-governance 框架对齐:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.4 L1-governance 框架对齐:再写入`。 |
| 本模块目标 | 固化 L1-governance Step 7 框架对齐记录、可借鉴模板、不可复制语义、本仓后续 R7 表格模板和 `R7.5` 进入门禁。 |
| 当前状态 | completed |
| 禁止范围 | 不复制 governance 领域语义;不写 L3-method-library 具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. 框架对齐记录

| 对齐项 | 当前采用 |
|---|---|
| Step 7 目标 | 只关闭跨层、跨模块、跨外部系统的 trait / port / adapter 接缝;不定义 DTO、flow、state matrix、persistence、config 或 test。 |
| 输入来源 | 同时承接 Step 5 模块主轴、Step 6 对象契约、02 接口骨架 / 处理流 / 状态线索、架构依赖方向和真相源闭环标准。 |
| 定义 / 实现分层 | `application` 定义并调用 port;`infra` 实现 adapter;`domain` 不访问 repository / adapter;`api`、`worker`、`jobs` 只调用 application facade。 |
| 分组顺序 | 先基础 helper,再 truth repository,再 support / material repository,再 resolver / mapper / builder,再 external seam / runtime,最后 infra / entry restriction 与审计。 |
| 读取面原则 | 每个 repository / resolver 读取面必须覆盖后续 DTO、flow、state matrix、persistence 所需信息,不能只写 save / append。 |
| 写入面原则 | mutable truth / marker / material 写入必须给出 expected version / UnitOfWork / append-only / stored result / sidecar truth 来源。 |
| adapter outcome 原则 | external / publisher / handoff / runtime adapter 必须返回正式 outcome、safe summary、body-free ref 或 diagnostic,不得让 service 解析错误字符串。 |
| fake / durable parity | fake 和 durable adapter 必须共享同一输入、输出、错误、version 和 ordering 语义。 |
| entry restriction | entry 只解析 transport / job / worker shell 并调用 application service / facade,不得直接调用 repository、domain transition 或 adapter。 |
| stop-review | 每个 port group 完成后必须停审,最终再做跨模块接缝闭环审计。 |

### 3. 可借鉴模板

#### 3.1 模块归属矩阵模板

| 模块 | 是否定义 port | 是否实现 port | 是否可直接访问 port | 结论 |
|---|---|---|---|---|
| `contracts` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |
| `domain` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |
| `application` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |
| `infra` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |
| `api` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |
| `worker` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |
| `jobs` | 待后续填充 | 待后续填充 | 待后续填充 | 只能填充模块角色,不得写具体 port 方法。 |

#### 3.2 Port capability / 接缝清单模板

| capability / 对象能力 | Step 6 来源 | 需要的接缝 | 调用方 | 实现方 | 后续承接 | 暂停条件 |
|---|---|---|---|---|---|---|
| `<capability>` | `<object / field / state owner>` | `<repository / resolver / mapper / publisher / handoff / helper>` | `<application service / job service / query service>` | `<infra adapter / application-local helper>` | `<Step 8 / 9 / 10 / 11 / 12 / 13 / 14 / 16>` | `<missing source / version / outcome / schema>` |

#### 3.3 Trait / Port 契约表模板

| 名称 | 类型 | 定义位置 | 作用 | 关键函数类别 | 输入来源 | 输出 / 错误 | 读取 / 写入闭口 |
|---|---|---|---|---|---|---|---|
| `<PortName>` | `<repository / resolver / mapper / publisher / handoff / helper>` | `<application module>` | `<body-free responsibility>` | `<read / write / append / publish / resolve / map>` | `<Step 6 field source>` | `<typed result / safe outcome / error>` | `<version / UoW / page / stored result>` |

#### 3.4 读取面闭口模板

| 读取面 | 后续需要者 | 必须返回 | 禁止替代 |
|---|---|---|---|
| `<read capability>` | `<Step 8 DTO / Step 9 flow / Step 10 state / Step 11 persistence>` | `<typed object / versioned object / page / safe summary / marker>` | `<string parse / private map / scan / current truth rebuild>` |

#### 3.5 写入面闭口模板

| 写入面 | 写入对象 | version / transaction 来源 | 关联读取面 | 禁止事项 |
|---|---|---|---|---|
| `<write capability>` | `<truth / marker / material / stored result>` | `<expected_version / UnitOfWork / append-only / id generator>` | `<get_with_version / list_versioned / stored get>` | `<no implicit create / no hidden db default / no service-side synthesis>` |

#### 3.6 Adapter outcome 模板

| adapter seam | 输入 | 允许输出 | 错误边界 | 禁止事项 |
|---|---|---|---|---|
| `<resolver / publisher / handoff / runtime>` | `<typed ref / safe request / config binding ref>` | `<body-free outcome / safe summary / receipt ref / diagnostic>` | `<ApplicationError only for call failure>` | `<raw body / secret / provider payload / error-string classification>` |

#### 3.7 Infra implementation map 模板

| application port family | infra 实现归属 | adapter state / binding | 实现要求 | 后续承接 |
|---|---|---|---|---|
| `<port family>` | `<infra module>` | `<adapter state object>` | `<fake / durable parity, body-free, version semantics>` | `<Step 11 / 12 / 14 / 16>` |

#### 3.8 Entry restriction 模板

| entry 模块 | 可调用 | 禁止调用 | 原因 |
|---|---|---|---|
| `api` | `<application facade>` | `<repository / domain transition / infra adapter>` | entry 不拥有业务 truth 或接缝决策。 |
| `worker` | `<application facade>` | `<repository / domain transition / infra adapter>` | worker 不绕过 application 编排。 |
| `jobs` | `<application job facade>` | `<repository / domain transition / infra adapter>` | job 不直接修复 truth 或绕过接缝。 |

#### 3.9 停审模板

| 审查项 | 结论 | 缺口 / 修正 | 后续承接 |
|---|---|---|---|
| 是否回指 Step 6 对象能力 | `<pass / gap>` | `<gap id>` | `<Step>` |
| 读取面是否闭合 | `<pass / gap>` | `<gap id>` | `<Step>` |
| 写入面 version / transaction 是否闭合 | `<pass / gap>` | `<gap id>` | `<Step>` |
| 调用方 / 实现方是否清楚 | `<pass / gap>` | `<gap id>` | `<Step>` |
| 是否越过模块边界 | `<pass / gap>` | `<gap id>` | `<Step>` |

### 4. 不可复制语义

| governance 语义 | 本仓处理 |
|---|---|
| context / gate / decision / approval / policy / control / nonconformity | 不复制对象语义;只借鉴 truth repository 分组方式。 |
| Governance-specific ref / version / subject mapper / GRC export / AIIA / SoA | 不复制名词或函数;后续用本仓对象和 typed ref 重新定义。 |
| Governance trait 函数签名 | 不复制签名;后续按本仓对象能力、field source 和暂停条件定义。 |
| Governance 状态流转和 job / export 结论 | 不复制领域结论;只保留读取面、outcome、stored result 和停审方法。 |
| Governance Step 7 completed 判断 | 不作为本仓完成依据;本仓仍需完成 R7.5~R7.26。 |

### 5. 本仓后续 R7 表格模板使用规则

| 规则 | 说明 |
|---|---|
| 先 capability 后 trait | 每组 port 必须先列 capability / 接缝清单,再写 trait / port 契约。 |
| 先来源后签名 | 具体签名前必须明确 Step 6 对象、字段、状态、marker、decision 或后续 Step 需求来源。 |
| 读写成对 | 有 write / save / append / publish 的地方必须检查读取面、version、UoW、stored result 或 outcome 是否配对。 |
| fake / durable 同口径 | 不能为 fake runtime 单独发明 lookup、private map、error-string classification 或 ordering。 |
| 后续 Step 不提前 | DTO、flow、state matrix、persistence、config、test 只能作为承接列,不得在 Step 7 正文提前定义。 |

### 6. `R7.5` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 Step 6 对象能力、字段来源、状态 owner、marker / decision / diagnostic、Step 8~11 后续需求如何形成 port capability 候选池。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、flow、state matrix、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.4` 固化的 capability / 接缝清单模板和停审模板。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 L1-governance 框架对齐记录 | 是。 |
| 是否写入可借鉴模板 | 是。 |
| 是否写入不可复制语义 | 是。 |
| 是否写入本仓后续 R7 表格模板使用规则 | 是。 |
| 是否写入 `R7.5` 进入门禁 | 是。 |
| 是否写 L3 具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.5` 思考或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.5 Step 6 承接与接缝发现轴:先思考`;只允许思考 Step 6 对象能力、字段来源、状态 owner、marker / decision / diagnostic、Step 8~11 后续需求如何形成 port capability 候选池;必须使用 `R7.4` 固化的 capability / 接缝清单模板和停审模板;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key 或 test case schema;不得进入 `R7.6`、Step 8 或后续 Step。

---

## R7.5 Step 6 承接与接缝发现轴:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.5 Step 6 承接与接缝发现轴:先思考`。 |
| 本模块目标 | 从 Step 6 对象 owner、字段来源、状态 owner、marker / decision / diagnostic 和后续 Step 8~11 需求中抽取 port capability 候选池。 |
| 当前状态 | completed |
| 当前产物 | 接缝发现轴、候选 capability 分组、暂停条件和 `R7.6` 写入边界。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. Step 6 承接输入

| Step 6 输入 | 对 Step 7 的含义 |
|---|---|
| 七实现单元对象族 | Step 7 的 port / adapter 分组必须覆盖 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的对象 owner,但 entry 模块只能通过 application facade 间接接触接缝。 |
| 对象族总览 | truth、support、policy、helper、runtime、entry 对象已经有结构责任;Step 7 只补跨层访问、读取、写入、resolve、map、publish、handoff、checkpoint 等接缝。 |
| 字段来源规则 | `*_ref`、`*_kind`、`*_marker_ref`、`*_decision_ref`、diagnostic、cursor / checkpoint 都必须有正式来源;缺来源时 Step 7 必须停审。 |
| 状态 owner 预筛 | domain truth state、policy decision、read/material state、external state、application technical state、infra / entry local state 必须由不同 port group 承接,不得混成一个万能 repository。 |
| Step 7 输入门禁 | repository load/save 要有 owner、identity ref、version / state owner;resolver / mapper / builder 要有 summary / marker / decision 来源;source / publisher / handoff 必须 body-free。 |
| 历史过滤摘要 | 旧 `MethodContent`、P0/P1、publish lifecycle、snapshot、fingerprint、outbox、delivery、PostgreSQL / sqlx / route / topic / cron 不得反推当前 port。 |

### 3. 接缝发现轴

| 发现轴 | 需要识别的能力 | 不能做的事 |
|---|---|---|
| owner / identity / version | 哪些对象需要按 typed ref 读取、按 owner 保存、按 version 校验、按 page / cursor 列表化。 | 从 raw string、旧 id、route、topic、private map 推导 key。 |
| state / transition support | 哪些状态 owner 需要读当前状态、保存下一状态、记录 stored result 或 checkpoint。 | 在 Step 7 写完整状态矩阵或把 technical state 当 domain state。 |
| marker / decision / diagnostic | 哪些 policy、resolver、mapper、builder、adapter availability 输出 marker、decision、safe diagnostic。 | 由 service、entry 或 infra 自行合成 public marker / decision。 |
| material / read surface | 哪些 read material、trace、impact、lineage、relation、package、method set 需要读面、freshness、degraded / unavailable 来源。 | 在 query flow 中扫描 truth 或用旧 snapshot/fingerprint 代替 material 来源。 |
| external / body-free boundary | 哪些 external summary、inbound source、publisher、handoff 需要 body-free outcome 或 safe summary。 | adapter 暴露 provider body、broker ack、delivery receipt、report body 或 raw error。 |
| runtime / entry restriction | 哪些 runtime binding、entry handler、worker、job runner 只允许调用 application facade 或 application job facade。 | api / worker / jobs 直接调用 repository、domain transition 或 infra adapter。 |

### 4. Capability 候选池草案

| capability / 对象能力 | Step 6 来源 | 需要的接缝类别 | 调用方候选 | 实现方候选 | 后续承接 | 暂停条件 |
|---|---|---|---|---|---|---|
| core truth identity / version 管理 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion` | truth repository read / write / version seam | application command / query service | infra store adapter | Step 9 / 10 / 11 / 13 | identity ref、expected version 或状态 owner 缺来源。 |
| consumption material 管理 | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary` | material repository / builder / freshness seam | application command / query service | infra material adapter 或 application-local builder | Step 8 / 9 / 10 / 11 / 12 | freshness、boundary marker 或 material source 需要 service 合成。 |
| trace / impact / audit / lineage 读写 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | trace / audit / lineage repository seam | application service / observability assembly | infra store adapter | Step 9 / 11 / 15 / 16 | listed ref、subject ref、safe audit reason 或 lineage ref 缺正式来源。 |
| relation / package / method set 维护 | `MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly`;`RelationIntegrityRule`;`PackageCompositionRule` | relation / peripheral repository + policy decision seam | application command / job service | infra store adapter + domain policy | Step 9 / 10 / 11 / 12 | relation integrity marker、composition decision 或 page ordering 缺来源。 |
| formalization basis / eligibility 判断 | `FormalizationBasisSummary`;`FormalizationEligibilityRule` | basis resolver / policy decision / safe reason seam | application command service | application-local policy 或 infra external resolver | Step 9 / 10 / 12 / 14 | external basis summary、eligibility reason 或 degraded diagnostic 缺来源。 |
| boundary / no-body / consistency guard | `DefinitionUseBoundaryGuard`;`ExternalBodyBoundaryRule`;`ConsistencyProtectionPolicy` | guard / mapper / diagnostic seam | application command / query / consumer service | domain policy + application mapper | Step 8 / 9 / 12 / 16 | marker_ref、decision_ref 或 safe diagnostic 只能由实现端拼接。 |
| idempotency / stored result / replay | `MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult` | stored result / dedup / replay seam | application command / consumer / job service | infra durable adapter | Step 11 / 13 / 16 | duplicate replay 需要重跑 mutation 或扫描外部队列。 |
| read decision / degraded decision | `MethodAssetReadDecision`;`MethodAssetDegradedDecision` | read resolver / degraded mapper / material summary seam | application query service | application mapper + infra material adapter | Step 8 / 9 / 10 / 12 / 15 | query surface 需要 marker、decision、diagnostic 但没有可复制 summary。 |
| inbound intake / event candidate | `MethodAssetInboundIntakeDecision`;`MethodAssetEventCandidateAssembly`;`MethodAssetInboundSourceBindingState`;`MethodAssetPublisherBindingState` | inbound source / event publisher / body-free outcome seam | worker application facade | infra inbound / publisher adapter | Step 8 / 9 / 13 / 14 / 16 | 需要 raw provider payload、topic、ack、delivery receipt 或旧 outbox。 |
| external resolver / binding availability | `ExternalSourceSummary`;`MethodAssetExternalResolverBindingState`;`MethodAssetAdapterAvailabilityState` | external resolver / availability / safe diagnostic seam | application service / job service | infra external adapter | Step 9 / 12 / 14 / 15 | resolver outcome 只能通过错误字符串或 provider body 分类。 |
| runtime config / store binding | `MethodAssetRuntimeConfigBinding`;`MethodAssetRuntimeAssemblyState`;`MethodAssetStoreBindingState` | runtime assembly / store binding / config validation seam | application bootstrap / entry assembly | infra runtime adapter | Step 11 / 12 / 14 / 16 | raw config、secret、URL、table/index、SQL 被提前写入 Step 7。 |
| jobs / maintenance / checkpoint | `MethodAssetJobAssemblyContext`;`MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;`MethodAssetJobProgressAssemblyState` | job target / checkpoint / progress / partial degraded seam | application job facade / jobs entry | infra store adapter + runtime adapter | Step 9 / 11 / 13 / 15 / 16 | cursor、checkpoint、progress result 或 degraded decision 缺 durable source。 |
| api / worker / jobs entry restriction | `MethodAssetApi*`;`MethodAssetWorker*`;`MethodAssetJob*EntryResultState` | facade-only entry seam | api / worker / jobs entry | application facade / job facade | Step 8 / 9 / 12 / 14 | entry 需要直接调用 repository、domain transition 或 infra adapter。 |

### 5. `R7.6` 写入边界

`R7.6` 应把本模块思考固化成 Step 7 的 Step 6 承接记录,包括 capability 候选池、状态 owner 到接缝类别的映射、缺口停审条件和后续 R7 分组输入。

| `R7.6` 允许写入 | `R7.6` 禁止写入 |
|---|---|
| Step 6 承接输入摘要。 | 具体 trait / port 方法签名。 |
| 接缝发现轴。 | adapter method 或 repository contract。 |
| capability 候选池表。 | protocol DTO、event schema、job schema。 |
| 状态 owner / marker / decision / diagnostic 到后续 R7 分组的承接表。 | function flow、完整 state matrix、persistence schema、config key、test case schema。 |
| `R7.7` application 基础 port / helper 进入门禁。 | 正式 `03-详细设计.md`。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 6 承接与接缝发现轴 | 是。 |
| 是否使用 `R7.4` capability / 接缝清单模板 | 是。 |
| 是否形成 capability 候选池草案 | 是。 |
| 是否形成 `R7.6` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.6` 写入或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.6 Step 6 承接与接缝发现轴:再写入`;只允许写入 Step 6 承接输入摘要、接缝发现轴、capability 候选池、状态 owner / marker / decision / diagnostic 到后续 R7 分组的承接表和 `R7.7` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.7`、Step 8 或后续 Step。

---

## R7.6 Step 6 承接与接缝发现轴:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.6 Step 6 承接与接缝发现轴:再写入`。 |
| 本模块目标 | 将 R7.5 形成的接缝发现轴、能力候选池和停审条件固化为 Step 7 承接记录，并把 `R7.7` 进入门禁收口。 |
| 当前状态 | completed |
| 当前产物 | Step 6 承接输入摘要、接缝发现轴、capability 候选池、状态 owner / marker / decision / diagnostic 映射和 `R7.7` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. Step 6 承接输入摘要

| Step 6 输入 | 对后续 Step 7 的含义 |
|---|---|
| 七实现单元对象族 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的对象 owner 已闭口。Step 7 只能围绕这些 owner 继续拆 port / adapter,不能重新发明对象。 |
| 对象族总览 | truth、support、policy、helper、runtime、entry 对象已经有结构责任,Step 7 只补跨层接缝。 |
| 字段来源规则 | `*_ref`、`*_kind`、`*_marker_ref`、`*_decision_ref`、diagnostic、cursor / checkpoint 必须有正式来源。 |
| 状态 owner 预筛 | domain truth state、policy decision、read/material state、external state、application technical state、infra / entry local state 必须由不同 port group 承接。 |
| Step 7 输入门禁 | repository load/save 要有 owner、identity ref、version / state owner;resolver / mapper / builder 要有 summary / marker / decision 来源;source / publisher / handoff 必须 body-free。 |
| 历史过滤摘要 | 旧 `MethodContent`、P0/P1、publish lifecycle、snapshot、fingerprint、outbox、delivery、PostgreSQL / sqlx / route / topic / cron 不得反推当前 port。 |

### 3. 接缝发现轴固化

| 发现轴 | 固化结论 | 后续承接 |
|---|---|---|
| owner / identity / version | 先找 typed ref、owner、version 和 page / cursor 责任,再分配 repository seam。 | Step 7 的基础 helper 与 truth repository 分组。 |
| state / transition support | 先区分 domain truth state、policy decision、application technical state、read/material state、external state。 | Step 10 状态矩阵和 Step 11 持久化语义。 |
| marker / decision / diagnostic | 只能来自正式 policy、resolver、mapper、builder 或 adapter summary。 | Step 8 协议壳和 Step 12 错误 / 降级映射。 |
| material / read surface | 读面必须能返回 safe summary、freshness、degraded / unavailable，而不是扫描 truth body。 | Step 8 query DTO、Step 9 query flow、Step 12 degraded 语义。 |
| external / body-free boundary | external summary、inbound source、publisher、handoff 都必须 body-free。 | Step 8 protocol shell、Step 14 配置绑定。 |
| runtime / entry restriction | api / worker / jobs 只能通过 application facade / job facade 触达接缝。 | Step 7 后续 entry restriction 和 Step 15~16 测试切口。 |

### 4. Capability 候选池固化

| capability / 对象能力 | Step 6 来源 | 需要的接缝类别 | 调用方候选 | 实现方候选 | 后续承接 | 暂停条件 |
|---|---|---|---|---|---|---|
| core truth identity / version 管理 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion` | truth repository read / write / version seam | application command / query service | infra store adapter | Step 9 / 10 / 11 / 13 | identity ref、expected version 或状态 owner 缺来源。 |
| consumption material 管理 | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary` | material repository / builder / freshness seam | application command / query service | infra material adapter 或 application-local builder | Step 8 / 9 / 10 / 11 / 12 | freshness、boundary marker 或 material source 需要 service 合成。 |
| trace / impact / audit / lineage 读写 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | trace / audit / lineage repository seam | application service / observability assembly | infra store adapter | Step 9 / 11 / 15 / 16 | listed ref、subject ref、safe audit reason 或 lineage ref 缺正式来源。 |
| relation / package / method set 维护 | `MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly`;`RelationIntegrityRule`;`PackageCompositionRule` | relation / peripheral repository + policy decision seam | application command / job service | infra store adapter + domain policy | Step 9 / 10 / 11 / 12 | relation integrity marker、composition decision 或 page ordering 缺来源。 |
| formalization basis / eligibility 判断 | `FormalizationBasisSummary`;`FormalizationEligibilityRule` | basis resolver / policy decision / safe reason seam | application command service | application-local policy 或 infra external resolver | Step 9 / 10 / 12 / 14 | external basis summary、eligibility reason 或 degraded diagnostic 缺来源。 |
| boundary / no-body / consistency guard | `DefinitionUseBoundaryGuard`;`ExternalBodyBoundaryRule`;`ConsistencyProtectionPolicy` | guard / mapper / diagnostic seam | application command / query / consumer service | domain policy + application mapper | Step 8 / 9 / 12 / 16 | marker_ref、decision_ref 或 safe diagnostic 只能由实现端拼接。 |
| idempotency / stored result / replay | `MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult` | stored result / dedup / replay seam | application command / consumer / job service | infra durable adapter | Step 11 / 13 / 16 | duplicate replay 需要重跑 mutation 或扫描外部队列。 |
| read decision / degraded decision | `MethodAssetReadDecision`;`MethodAssetDegradedDecision` | read resolver / degraded mapper / material summary seam | application query service | application mapper + infra material adapter | Step 8 / 9 / 10 / 12 / 15 | query surface 需要 marker、decision、diagnostic 但没有可复制 summary。 |
| inbound intake / event candidate | `MethodAssetInboundIntakeDecision`;`MethodAssetEventCandidateAssembly`;`MethodAssetInboundSourceBindingState`;`MethodAssetPublisherBindingState` | inbound source / event publisher / body-free outcome seam | worker application facade | infra inbound / publisher adapter | Step 8 / 9 / 13 / 14 / 16 | 需要 raw provider payload、topic、ack、delivery receipt 或旧 outbox。 |
| external resolver / binding availability | `ExternalSourceSummary`;`MethodAssetExternalResolverBindingState`;`MethodAssetAdapterAvailabilityState` | external resolver / availability / safe diagnostic seam | application service / job service | infra external adapter | Step 9 / 12 / 14 / 15 | resolver outcome 只能通过错误字符串或 provider body 分类。 |
| runtime config / store binding | `MethodAssetRuntimeConfigBinding`;`MethodAssetRuntimeAssemblyState`;`MethodAssetStoreBindingState` | runtime assembly / store binding / config validation seam | application bootstrap / entry assembly | infra runtime adapter | Step 11 / 12 / 14 / 16 | raw config、secret、URL、table/index、SQL 被提前写入 Step 7。 |
| jobs / maintenance / checkpoint | `MethodAssetJobAssemblyContext`;`MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;`MethodAssetJobProgressAssemblyState` | job target / checkpoint / progress / partial degraded seam | application job facade / jobs entry | infra store adapter + runtime adapter | Step 9 / 11 / 13 / 15 / 16 | cursor、checkpoint、progress result 或 degraded decision 缺 durable source。 |
| api / worker / jobs entry restriction | `MethodAssetApi*`;`MethodAssetWorker*`;`MethodAssetJob*EntryResultState` | facade-only entry seam | api / worker / jobs entry | application facade / job facade | Step 8 / 9 / 12 / 14 | entry 需要直接调用 repository、domain transition 或 infra adapter。 |

### 5. `R7.7` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 Step 7 基础 helper、version / page / cursor / UoW / stored result / clock / id / runtime binding 候选,并确认哪些能力会在后续 truth repository、support / material repository、resolver / mapper / builder、external seam 和 entry restriction 中继续承接。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.6` 写入的 capability 候选池、状态 owner 映射和停审条件。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写 Step 6 承接输入摘要 | 是。 |
| 是否只写接缝发现轴 | 是。 |
| 是否形成 capability 候选池 | 是。 |
| 是否形成状态 owner 到后续 R7 分组的承接 | 是。 |
| 是否形成 `R7.7` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.7` 写入或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.8 application 基础 port / helper:再写入`;只允许写入 Step 7 基础 helper 候选池、版本 / 分页 / 游标 / UnitOfWork / stored result / clock / id 的承接表和 `R7.9` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.9`、Step 8 或后续 Step。

---

## R7.8 application 基础 port / helper:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.8 application 基础 port / helper:再写入`。 |
| 本模块目标 | 将 R7.7 形成的基础 helper 候选池、版本 / 分页 / 游标 / UoW / stored result / clock / id 的接缝边界固化为 Step 7 承接记录,并把 `R7.9` 进入门禁收口。 |
| 当前状态 | completed |
| 当前产物 | Step 7 基础 helper 候选池、分组顺序、暂停条件和 `R7.9` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. Step 7 基础 helper 承接摘要

| Step 7 输入 | 对后续 Step 7 的含义 |
|---|---|
| `MethodAssetOperationContext` / `MethodAssetIdempotencyGuard` / `MethodAssetStoredOperationResult` | application 基础层需要统一处理 transaction、dedup、stored result、correlation 和 replay 边界。 |
| `MethodAssetReadDecision` / `MethodAssetDegradedDecision` | read 侧 helper 必须能够承载 found / absent / stale / degraded / unavailable 的判断壳,但不能合成业务 marker。 |
| `MethodAssetRuntimeConfigBinding` / `MethodAssetRuntimeAssemblyState` | 运行时绑定只允许作为 validated binding 输入,不进入基础 helper 的业务语义。 |
| `MethodAssetJobAssemblyContext` / `MethodAssetJobRunnerContext` | job / maintenance 的 cursor、checkpoint、progress 需要基础 helper,但具体 job entry 仍后移。 |
| 字段来源规则 | `cursor`、`checkpoint`、`page`、`version`、`versioned ref`、`stored result` 必须有正式来源,不得由 service 临时拼接。 |
| Step 7 输入门禁 | UnitOfWork、Clock、IdGenerator、page / version helper、stored result 都必须 body-free、typed 和可重放,但不能在本模块写出具体函数签名。 |

### 3. 基础 helper 接缝固化

| 发现轴 | 固化结论 | 后续承接 |
|---|---|---|
| transaction / UoW | 写路径需要统一 transaction boundary、expected version 和 commit / rollback 生命周期。 | Step 9 command flow、Step 11 persistence、Step 13 replay。 |
| time / Clock | 对象和结果需要安全时间来源、可测试时间和时间戳归属。 | Step 9 command / query / job flow,Step 15 observability。 |
| identity / IdGenerator | 创建面需要 typed id、ref、checkpoint id 或 stored result id。 | Step 9 command / consumer / job entry,Step 11 persistence,Step 13 duplicate handling。 |
| pagination / page helper | list / read / trace / job 面需要 page、cursor、versioned page 或 page token。 | Step 8 protocol shell,Step 9 query flow,Step 12 degraded semantics。 |
| stored result / replay | accepted / rejected / ignored 结果需要 durable summary、duplicate replay 和 conflict 判断壳。 | Step 11 stored result persistence,Step 13 replay source,Step 16 test cut. |
| checkpoint / progress | maintenance / job / refresh 面需要 checkpoint、progress、resume token。 | Step 9 job flow,Step 11 checkpoint persistence,Step 15 progress telemetry。 |

### 4. 基础 helper 候选池固化

| helper / 对象能力 | Step 7 来源 | 需要的接缝类别 | 调用方候选 | 实现方候选 | 后续承接 | 暂停条件 |
|---|---|---|---|---|---|---|
| transaction boundary / UnitOfWork | `MethodAssetStoredOperationResult`;`MethodAssetJobAssemblyContext` | UoW / commit / rollback seam | application command / job service | infra durable adapter | Step 9 / 11 / 13 / 16 | expected version、commit 来源或 rollback 语义需要 service 合成。 |
| safe time / Clock | `MethodAssetOperationContext`;`MethodAssetJobRunnerContext` | time helper seam | application command / query / job service | application-local helper | Step 9 / 11 / 15 / 16 | 只能直接调用系统时间或把时间埋进业务对象。 |
| typed id / IdGenerator | `MethodAssetOperationContext`;`MethodAssetStoredOperationResult` | id generation seam | application command / consumer / job service | application-local helper 或 infra binding | Step 9 / 11 / 13 / 16 | id 需要从 raw string 或 route 推导。 |
| page / version helper | `MethodAssetReadDecision`;`MethodAssetStoredOperationResult` | page / version wrapper seam | query / read / trace / job service | application-local helper | Step 8 / 9 / 10 / 11 / 12 | page token、version wrapper 或 list ordering 缺正式来源。 |
| stored result helper | `MethodAssetStoredOperationResult`;`MethodAssetIdempotencyGuard` | stored result / dedup seam | command / consumer / job service | infra durable adapter | Step 11 / 13 / 16 | duplicate / conflict 需要扫描队列或重跑 mutation。 |
| checkpoint / progress helper | `MethodAssetJobAssemblyContext`;`MethodAssetJobProgressAssemblyState` | checkpoint / progress / resume seam | job facade / jobs entry | application-local helper + infra adapter | Step 9 / 11 / 13 / 15 / 16 | checkpoint 只能由 progress body 或 private map 恢复。 |

### 5. `R7.9` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 Step 7 truth repository 基础接缝,优先版本 / owner / identity / load-save / page / version / read helper 的 repository 候选池。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.8` 写入的基础 helper 候选池、版本 / 分页 / 游标 / UnitOfWork / stored result / clock / id 承接表。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写 Step 7 基础 helper 候选池 | 是。 |
| 是否使用 `R7.7` 思考结果 | 是。 |
| 是否形成 `R7.9` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.9` 思考或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.9 domain truth repository port:先思考`;只允许思考 truth repository 的 owner、identity ref、version、load/save、page/cursor、read helper 候选,并确认后续 `R7.10` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.10`、Step 8 或后续 Step。

---

## R7.9 domain truth repository port:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.9 domain truth repository port:先思考`。 |
| 本模块目标 | 基于 `R7.6` capability 候选池和 `R7.8` 基础 helper,先裁决 core truth repository family 的范围、owner、identity ref、version、load/save、page/cursor 和 read helper 候选,并收口 `R7.10` 写入边界。 |
| 当前状态 | completed |
| 当前产物 | truth repository family 切分、object scope / non-scope、identity/version/load-save/page/read-helper 候选和 `R7.10` 写入边界。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. 前序输入承接

| 输入 | 对 `R7.9` 的约束 |
|---|---|
| `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion` | 这四类对象是当前 Step 6 已闭口的 core truth / state owner,可进入 truth repository family。 |
| `FormalizationBasisSummary` | 它是 support summary,只提供正式化依据摘要,不应在本模块被误收为 truth repository save owner。 |
| `MethodAssetConsumptionMaterial` | 它是 controlled read material,不是第二 truth;应与 core truth repository 明确切开。 |
| `R7.6` capability 候选池 | 已把 `core truth identity / version 管理` 与 `consumption material 管理` 分成两类 capability,本模块不能重新混并。 |
| `R7.8` 基础 helper | version、page / cursor、UnitOfWork、Clock、IdGenerator、stored result 已有基础承接,truth repository 只能复用这些 helper,不能另造私有 token。 |
| Step 7 暂停规则 | typed ref、expected version、stable lookup、page ordering、current lookup 若没有正式来源,必须停在设计侧,不得靠旧 publish lifecycle、raw string、private map 或 route / topic 反推。 |

### 3. truth repository 范围裁决

| 对象 / 能力 | 是否进入 `R7.9` | 当前判断 | 后续归属 |
|---|---|---|---|
| `MethodAssetDefinition` | 是 | definition 是方法资产定义 truth 和 identity anchor,需要 exact read / stable lookup / optimistic write 接缝。 | `R7.10` truth repository 写入。 |
| `MethodAssetCatalogEntry` | 是 | catalog entry 是目录 truth,承担 scope / classification 语义,需要 scoped lookup 和分页候选。 | `R7.10` truth repository 写入。 |
| `FormalizationState` | 是 | formalization state 是状态 owner,需要 exact read、current-state lookup 和 optimistic save。 | `R7.10` truth repository 写入。 |
| `FormalMethodAssetVersion` | 是 | formal version 是正式版本 truth,需要 exact read、current lookup、history/list helper 和 supersession save pairing。 | `R7.10` truth repository 写入。 |
| `FormalizationBasisSummary` | 否 | basis summary 是 support summary / resolver input,不是 truth mutation owner。 | 后移 `R7.11` / `R7.13` support / resolver 组。 |
| `MethodAssetConsumptionMaterial` | 否 | consumption material 是 controlled read material,不应与 definition / version truth 共用 repository 语义。 | 后移 `R7.11` / `R7.12` material repository 组。 |

### 4. repository family 切分判断

| repository family 候选 | 承接对象 | primary identity anchor | stable lookup 候选 | 切分理由 |
|---|---|---|---|---|
| definition truth family | `MethodAssetDefinition` | `MethodAssetDefinitionRef` | `MethodAssetIdentityKey` | definition 是所有下游 truth 的共同锚点,需要 identity lookup,但不应混入 catalog / version 读取面。 |
| catalog truth family | `MethodAssetCatalogEntry` | `MethodAssetCatalogEntryRef` | `MethodAssetDefinitionRef + CatalogScopeRef` | catalog truth 天然带 scope / classification 语义,分页和 scoped lookup 与 definition family 不同。 |
| formalization state family | `FormalizationState` | `FormalizationStateRef` | `MethodAssetDefinitionRef + MethodAssetCatalogEntryRef` | state owner 需要 current-state read / save pairing,不应被 version history 或 material read 面稀释。 |
| formal version family | `FormalMethodAssetVersion` | `FormalMethodAssetVersionRef` | `FormalizationStateRef` 或 `MethodAssetDefinitionRef` 下的 current/list helper | version truth 既有 exact identity,又有 current / supersession / history 语义,需要独立的 read helper 组。 |

当前结论是不建立“万能 `MethodAssetRepository`”。`definition`、`catalog`、`formalization state`、`formal version` 必须按 identity / scope / state owner / history 责任切开,否则 `expected_version`、page ordering 和 current lookup 会被压成模糊的通用口径。

### 5. identity / version / load-save / page-read helper 候选

| family | exact read 候选 | version 来源候选 | save pairing 候选 | page / cursor 候选 | read helper 候选 | 暂停条件 |
|---|---|---|---|---|---|---|
| definition truth | exact by `definition_ref` | exact read 返回的 version | definition truth optimistic save | 默认不把 definition 当首要列表面;如后续需要范围化列举,应先证明不是 catalog / view 面 | stable lookup by `identity_key` | 若只能从旧名称、route、raw string 或 catalog view 反推 definition identity,暂停。 |
| catalog truth | exact by `catalog_entry_ref` | exact read 或 scoped page item version | catalog truth optimistic save | 按 `definition_ref` 或 `catalog_scope_ref` 的稳定分页 | current / scoped lookup by `(definition_ref, catalog_scope_ref)` | 若 scope lookup 只能靠 query material、搜索索引或 private scan,暂停。 |
| formalization state | exact by `formalization_state_ref` | exact read 或 stable lookup 返回的 version | formalization state optimistic save | 当前不预设大范围状态扫描;若后续需要分页,必须先证明其 owner / ordering 来源 | current lookup by `(definition_ref, catalog_entry_ref)` | 若 current state 只能由 `state_kind`、current version 或 trace 反推,暂停。 |
| formal version | exact by `formal_version_ref` | exact read、list item version 或 current lookup 返回的 version | formal version optimistic save,并显式承接 supersession | 按 `definition_ref` 或 `catalog_entry_ref` 的稳定 list / page | current version lookup by `formalization_state_ref`;history/list helper by `definition_ref` | 若 current version 只能通过 latest timestamp、publish lifecycle、fingerprint 或 private ordering 推断,暂停。 |

这里的 page / cursor 只是 truth repository 的稳定列举 helper 候选,不是 optimistic version、truth cursor 或 committed change marker。`GovernanceRepositoryCursor` 式的混用在本仓同样禁止。

### 6. 跨 family 闭口规则

| 规则 | 当前结论 |
|---|---|
| version 只能来自 versioned read | `expected_version` 只能来自 exact read、stable lookup 或 page item 自带的 version,不能由 timestamp、current ref、cursor 或 digest 代替。 |
| page 不替代 truth identity | page / cursor 只表达列表位置,不能代替 `definition_ref`、`catalog_entry_ref`、`formalization_state_ref` 或 `formal_version_ref`。 |
| current lookup 不替代 exact identity | `current by definition`、`current by state` 是 read helper,不是新的 truth owner。持久化仍要回到正式 identity / version pairing。 |
| truth repository 不承接 basis / material | `FormalizationBasisSummary`、`MethodAssetConsumptionMaterial` 必须留给 support / material 组,防止 repository 既做 truth 又做 read material / resolver cache。 |
| fake / durable 同口径 | fake runtime 与 durable store 必须共享同一 primary identity、stable lookup、page ordering 和 version conflict 语义。 |

### 7. `R7.10` 写入边界

| `R7.10` 允许写入 | `R7.10` 禁止写入 |
|---|---|
| definition / catalog / formalization state / formal version truth repository 候选表。 | 具体 trait / port 方法签名。 |
| object / ref / version / page / cursor / UnitOfWork / committed truth snapshot 的承接关系。 | adapter method、repository implementation、SQL / table / index 细节。 |
| exact read、stable lookup、current lookup、history / list helper 的 family 切分。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| basis summary / consumption material 不进入本组的切口说明。 | 正式 `03-详细设计.md`。 |
| `R7.11 support / trace / relation / material repository port:先思考` 的进入门禁。 | `R7.11` 正文或后续 Step 内容。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考 truth repository family 的范围、owner、identity、version 和 read helper 候选 | 是。 |
| 是否显式把 `FormalizationBasisSummary` 排除出 truth repository | 是。 |
| 是否显式把 `MethodAssetConsumptionMaterial` 排除出 truth repository | 是。 |
| 是否形成 core truth family 切分 | 是。 |
| 是否形成 `R7.10` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.10` 写入或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.10 domain truth repository port:再写入`;只允许写入 definition、catalog、formalization、version truth repository 候选表、object / ref / version / page / cursor / UnitOfWork / committed truth snapshot 承接关系、basis summary / consumption material 切口说明和 `R7.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.11`、Step 8 或后续 Step。

---

## R7.10 domain truth repository port:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.10 domain truth repository port:再写入`。 |
| 本模块目标 | 将 `R7.9` 的 core truth repository family 切分固化为 Step 7 承接记录,明确 definition / catalog / formalization state / formal version 的 repository 候选、read helper 覆盖、version / page / cursor / UoW 关系,并收口 `R7.11` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | core truth repository 候选表、cross-family 承接关系、basis summary / consumption material 切口说明和 `R7.11` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. Core truth repository family 固化

| repository family 候选 | 承接对象 | primary owner | stable identity / exact read | stable lookup / current helper | write 语义 | 后续承接 |
|---|---|---|---|---|---|---|
| `MethodAssetDefinitionRepository` | `MethodAssetDefinition` | `application` 定义 port,`infra` 实现 | `MethodAssetDefinitionRef` exact read | `MethodAssetIdentityKey` stable lookup | versioned truth save,不附带 catalog / version side写 | Step 9 definition command/query;Step 11 definition truth persistence |
| `MethodAssetCatalogEntryRepository` | `MethodAssetCatalogEntry` | `application` 定义 port,`infra` 实现 | `MethodAssetCatalogEntryRef` exact read | `(definition_ref, catalog_scope_ref)` current / scoped lookup | versioned truth save,范围语义只属于 catalog truth | Step 9 catalog command/query;Step 10 catalog status;Step 11 catalog persistence |
| `FormalizationStateRepository` | `FormalizationState` | `application` 定义 port,`infra` 实现 | `FormalizationStateRef` exact read | `(definition_ref, catalog_entry_ref)` current-state lookup | versioned state-owner save,不把 basis summary 当 side-effect truth | Step 9 formalization flow;Step 10 state matrix;Step 12 rejection / blocked path |
| `FormalMethodAssetVersionRepository` | `FormalMethodAssetVersion` | `application` 定义 port,`infra` 实现 | `FormalMethodAssetVersionRef` exact read | `formalization_state_ref` current version lookup;`definition_ref` history/list helper | versioned truth save,显式 supersession pairing | Step 9 version flow;Step 10 current/superseded state;Step 11 version uniqueness |
| `MethodAssetCommittedTruthSnapshotReader` | core truth body-free committed refs / summaries | `application` 定义 read-only port,`infra` 实现 | committed snapshot by exact anchor | list / page helper by definition / catalog / formalization / version scope | 只读,无 truth save | Step 9 projection / reconciliation / export;Step 11 committed snapshot source |

当前固定口径：

- core truth repository family 只覆盖 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalizationState`、`FormalMethodAssetVersion`
- committed truth snapshot reader 只读取 committed core truth 的 body-free ref / summary 集,不是旧 snapshot repo 复活,也不是 query assembler
- `application` 是唯一正式 port owner,`infra` 只实现这些 family

### 3. object / ref / version / page / cursor / UoW / committed truth snapshot 承接关系

| 轴 | definition family | catalog family | formalization state family | formal version family | committed truth snapshot reader |
|---|---|---|---|---|---|
| object owner | `MethodAssetDefinition` | `MethodAssetCatalogEntry` | `FormalizationState` | `FormalMethodAssetVersion` | committed truth body-free ref / summary shell |
| exact identity | `definition_ref` | `catalog_entry_ref` | `formalization_state_ref` | `formal_version_ref` | snapshot request 仍以正式 truth ref / scope 发起 |
| stable lookup | `identity_key` | `(definition_ref, catalog_scope_ref)` | `(definition_ref, catalog_entry_ref)` | `formalization_state_ref -> current version`;`definition_ref -> history/list` | scope / anchor driven committed truth page |
| version 来源 | exact read 返回 version | exact read 或 scoped page item version | exact read 或 current lookup 返回 version | exact read、current lookup 或 history/list item version | 不产生 optimistic version;只回传 committed snapshot coverage cursor / page cursor |
| save pairing | definition truth only | catalog truth only | formalization state only | formal version only,并显式记录 supersession | 无 save |
| page / cursor | 非首要列表面;仅在后续确有需要时按稳定 identity 分页 | scoped list / page by definition 或 catalog scope | 默认无大范围扫描;若后续需要,必须先证明 owner / ordering | history / list page by definition 或 catalog 语境 | committed truth page / cursor 只表达读取批次 |
| UoW 关系 | truth save 使用 shared UoW | truth save 使用 shared UoW | truth save 使用 shared UoW | truth save 使用 shared UoW | 读取面不开启 UoW |
| 禁止事项 | 不从 catalog view 反推 definition | 不从 query material / search index 反推 current catalog | 不从 current version / trace 反推 state owner | 不从 publish lifecycle / fingerprint / latest timestamp 推断 current | 不复制 truth body,不取代 material / query surface |

### 4. read helper 覆盖与后续 Step 闭口

| family | `R7.10` 固化的 read helper 类别 | 对后续 Step 的价值 |
|---|---|---|
| definition | exact by ref;stable lookup by `identity_key` | Step 9 command / query 不再依赖旧名称或 route 反推 definition |
| catalog | exact by ref;current / scoped lookup by `(definition_ref, catalog_scope_ref)`;stable page/list helper | Step 9 catalog query / Step 10 catalog state / Step 11 scoped persistence key |
| formalization state | exact by ref;current-state lookup by `(definition_ref, catalog_entry_ref)` | Step 9 formalization flow 的 expected_version / current-state source |
| formal version | exact by ref;current version lookup by `formalization_state_ref`;history/list helper by `definition_ref` | Step 9 version flow / Step 10 supersession state / Step 11 uniqueness and ordering |
| committed truth snapshot reader | committed body-free page by core truth anchor / scope | Step 9 projection / reconciliation / export 读取 committed truth,不再恢复旧 snapshot 主线 |

`R7.10` 只固化 read helper 类别和覆盖面,不在本模块写出具体方法签名。具体 `get_with_version`、`find_current_*`、`list_*` 之类的方法面留到后续具象 trait 写入时再展开。

### 5. basis summary / consumption material 切口说明

| 对象 | 当前切口 | 原因 | 后续模块 |
|---|---|---|---|
| `FormalizationBasisSummary` | 不进入 truth repository family | 它是 support summary / resolver input,不拥有 truth mutation | `R7.11` support repository 或 `R7.13` resolver / mapper / builder port |
| `MethodAssetConsumptionMaterial` | 不进入 core truth repository family | 它是 controlled read material,不是第二 truth,需要 material freshness / boundary / cursor 语义 | `R7.11` / `R7.12` support / material repository port |

因此本轮明确否定两种错误合并：

- `FormalizationStateRepository` 顺带保存 `FormalizationBasisSummary`
- `FormalMethodAssetVersionRepository` 顺带保存 `MethodAssetConsumptionMaterial`

一旦这样合并,Step 10 的 state owner、Step 11 的 version conflict、Step 12 的 degraded / blocked path 和 Step 14 的 resolver binding 都会被压成不清楚的混合口径。

### 6. `R7.11` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 support / trace / relation / material repository 的范围、owner、identity、version、material freshness、subject / lineage / relation lookup 和与 core truth repository 的切口。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.10` 固化的 core truth repository family、version / page / cursor / UoW 口径和 basis summary / consumption material 切口。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写 core truth repository family 和 committed truth snapshot reader 的承接记录 | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否明确 basis summary / consumption material 不进入本组 | 是。 |
| 是否形成 `R7.11` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.11` 思考或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.11 support / trace / relation / material repository port:先思考`;只允许思考 support / trace / relation / material repository 的范围、owner、identity、version、material freshness、subject / lineage / relation lookup 和与 core truth repository 的切口;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.12`、Step 8 或后续 Step。

---

## R7.10A commit-03-b implementation-facing closure

### 1. Design patch scope

本节是 `commit-03-b` Design Gate blocker closure。它只把 already-defined definition/catalog accepted service vertical slice 补成 Rust-facing port / facade / repository / UoW / stored-result surface。它不新增 public Command DTO 字段,不实现 formalization/version,不读取 external body,不进入 query/material/job/publisher。

| closure item | current-boundary decision |
|---|---|
| command family carrier | `MethodAssetCommandFamilyKind` 在 `commit-03-b` 的 exact Rust-facing carrier 是 `method_library_contracts::MethodLibraryCapabilityKind`;本 boundary 只接受 `DefinitionCatalog`,其他 capability 必须 safe rejected as unsupported command family。 |
| command shell input | API entry passes `method_library_contracts::MethodLibraryCommandShell` plus `MethodAssetApiEntryContextRef`;entry 不展开 public DTO body,不创建 domain object。 |
| application dispatch ref | `MethodAssetApplicationDispatchRef` 是 application-owned opaque dispatch marker;`commit-03-b` 唯一合法值是 `DefinitionCatalogCommandService`;它不得是 route string、type-name string、service locator key、config key 或 fake private enum。 |
| application facade | API 只调用 `MethodAssetDefinitionCatalogCommandFacade.dispatch_definition_catalog_command(input)`;facade 再调用 current-boundary service methods。 |
| facade input | `MethodAssetDefinitionCatalogCommandDispatchInput { command_shell, api_entry_context_ref, application_dispatch_ref }`;字段只能复制 contracts shell / Step 6 entry context / runtime precheck result。 |
| facade output | `MethodAssetDefinitionCatalogCommandDispatchOutput { stored_result_ref, result_kind, replay_marker_ref, accepted_summary_ref, rejected_reason_ref, ignored_reason_ref, effect_summary_refs }`;输出只能复制 `MethodAssetStoredOperationResult` 的 safe surface。 |

### 1A. Facade I/O exact Rust-facing schema

The facade I/O carriers are application-owned structs. They are not public DTOs and must not be filled from route/query/header/raw body directly.

```rust
pub struct MethodAssetDefinitionCatalogCommandDispatchInput {
    pub command_shell: MethodLibraryCommandShell,
    pub command_source: MethodAssetDefinitionCatalogCommandSource,
    pub api_entry_context_ref: MethodAssetApiEntryContextRef,
    pub application_dispatch_ref: MethodAssetApplicationDispatchRef,
}

pub struct MethodAssetDefinitionCatalogCommandDispatchOutput {
    pub stored_result_ref: MethodAssetStoredOperationResultRef,
    pub result_kind: MethodAssetStoredOperationResultKind,
    pub replay_marker_ref: MethodAssetReplayMarkerRef,
    pub accepted_summary_ref: Option<MethodAssetAcceptedOperationSummaryRef>,
    pub rejected_reason_ref: Option<MethodAssetSafeRejectReasonRef>,
    pub ignored_reason_ref: Option<MethodAssetSafeIgnoreReasonRef>,
    pub effect_summary_refs: MethodAssetEffectSummaryRefSet,
}
```

`command_source` is the Step 6 `3B.1B` application-owned body-free source carrier. It is not public DTO body. `MethodAssetDefinitionCatalogCommandDispatchOutput` is assembled only by copying the stored result safe surface. The facade must not rebuild response surface from current truth, raw repository rows, transport status or public DTO body.

### 1B. Command shell selector and input dispatch closure

The facade must select exactly one definition/catalog service input before mutation. Selection is application-owned and uses only the already-closed `MethodLibraryCommandShell` public shell plus Step 6 `3B.1A` intent labels; it must not inspect route names, transport paths, raw request body, DTO type names, marker text, config keys, fake runtime maps or service locator strings.

```rust
pub enum MethodAssetDefinitionCatalogCommandSelector {
    EstablishDefinition,
    AdjustDefinition,
    RetireDefinition,
    RegisterCatalogEntry,
    ReclassifyCatalogEntry,
    RetireCatalogEntry,
}

pub enum MethodAssetDefinitionCatalogServiceInput {
    EstablishDefinition(EstablishMethodAssetDefinitionInput),
    AdjustDefinition(AdjustMethodAssetDefinitionInput),
    RetireDefinition(RetireMethodAssetDefinitionInput),
    RegisterCatalogEntry(RegisterMethodAssetCatalogEntryInput),
    ReclassifyCatalogEntry(ReclassifyMethodAssetCatalogEntryInput),
    RetireCatalogEntry(RetireMethodAssetCatalogEntryInput),
}
```

Selector source and mapping:

| shell condition | selector | service input | service method |
|---|---|---|---|
| `capability_kind == DefinitionCatalog` and `boundary_ref.kind == MethodAssetDefinitionEstablishIntent` | `EstablishDefinition` | `EstablishMethodAssetDefinitionInput` | `establish_definition` |
| `capability_kind == DefinitionCatalog` and `boundary_ref.kind == MethodAssetDefinitionAdjustIntent` | `AdjustDefinition` | `AdjustMethodAssetDefinitionInput` | `adjust_definition` |
| `capability_kind == DefinitionCatalog` and `boundary_ref.kind == MethodAssetDefinitionRetireIntent` | `RetireDefinition` | `RetireMethodAssetDefinitionInput` | `retire_definition` |
| `capability_kind == DefinitionCatalog` and `boundary_ref.kind == MethodAssetCatalogEntryRegisterIntent` | `RegisterCatalogEntry` | `RegisterMethodAssetCatalogEntryInput` | `register_catalog_entry` |
| `capability_kind == DefinitionCatalog` and `boundary_ref.kind == MethodAssetCatalogEntryReclassifyIntent` | `ReclassifyCatalogEntry` | `ReclassifyMethodAssetCatalogEntryInput` | `reclassify_catalog_entry` |
| `capability_kind == DefinitionCatalog` and `boundary_ref.kind == MethodAssetCatalogEntryRetireIntent` | `RetireCatalogEntry` | `RetireMethodAssetCatalogEntryInput` | `retire_catalog_entry` |

Dispatch rules:

- Non-`DefinitionCatalog` command family maps to safe unsupported-family rejection and stored rejected result.
- Unknown, missing, future or wrong `boundary_ref.kind` maps to safe unsupported-intent rejection and stored rejected result.
- The selected intent label is part of the canonical body-free digest input together with shell typed refs, safe markers and metadata idempotency key; duplicate replay must not reinterpret a stored result under a different selector.
- After selector choice, input assembly validates only the refs / markers required by that selected carrier. Missing or wrong-kind inputs produce safe rejection for the same selector; facade must not attempt another selector as fallback.
- API entry may create `MethodAssetApiEntryContextRef` and pass the shell to the facade, but it must not construct `MethodAssetDefinitionCatalogServiceInput` directly.

### 1C. Command source to service input assembly closure

After selector choice, the facade must match the selected shell intent with the `MethodAssetDefinitionCatalogCommandSource` variant from Step 6 `3B.1B`. This is the only current-boundary source for structured accepted-path fields. The facade must not assemble those fields from `typed_refs` order/count, marker text, route names, DTO type names, config keys, fake maps, provider payload or raw body.

| selector | required source variant | service input field assembly |
|---|---|---|
| `EstablishDefinition` | `MethodAssetDefinitionCatalogCommandSource::EstablishDefinition(source)` | `definition_kind = source.definition_kind`;`identity_key = source.identity_key`;`definition_summary = source.definition_summary`;`source_summary_refs = source.source_summary_refs`;`preaccepted_catalog_entry_refs = source.preaccepted_catalog_entry_refs`。 |
| `AdjustDefinition` | `MethodAssetDefinitionCatalogCommandSource::AdjustDefinition(source)` | `definition_ref = source.definition_ref`;load `definition_ref` via `get_definition_with_version(...)`;`expected_version = loaded.version`;`replacement_definition_summary = source.replacement_definition_summary`;`replacement_source_summary_refs = source.replacement_source_summary_refs`。 |
| `RetireDefinition` | `MethodAssetDefinitionCatalogCommandSource::RetireDefinition(source)` | `definition_ref = source.definition_ref`;load `definition_ref` via `get_definition_with_version(...)`;`expected_version = loaded.version`;`retirement_marker_ref = source.retirement_marker_ref`。 |
| `RegisterCatalogEntry` | `MethodAssetDefinitionCatalogCommandSource::RegisterCatalogEntry(source)` | `definition_ref = source.definition_ref`;`catalog_scope_ref = source.catalog_scope_ref`;`catalog_classification = source.catalog_classification`;`applicability_summary = source.applicability_summary`。 |
| `ReclassifyCatalogEntry` | `MethodAssetDefinitionCatalogCommandSource::ReclassifyCatalogEntry(source)` | `catalog_entry_ref = source.catalog_entry_ref`;load `catalog_entry_ref` via `get_catalog_entry_with_version(...)`;`expected_version = loaded.version`;`new_catalog_classification = source.new_catalog_classification`;`new_applicability_summary = source.new_applicability_summary`。 |
| `RetireCatalogEntry` | `MethodAssetDefinitionCatalogCommandSource::RetireCatalogEntry(source)` | `catalog_entry_ref = source.catalog_entry_ref`;load `catalog_entry_ref` via `get_catalog_entry_with_version(...)`;`expected_version = loaded.version`;`retirement_marker_ref = source.retirement_marker_ref`。 |

Catalog object helper rules:

- `EstablishDefinition` must call `MethodAssetDefinitionCatalogSupportRefFactory.new_definition_ref(identity_key, operation_context_ref, operation_digest_ref, dedup_scope_ref)` after duplicate replay lookup misses and before `MethodAssetDefinition::create(...)`. The returned `definition_ref` is the only accepted new definition truth ref for this boundary.
- `RegisterCatalogEntry` must call `MethodAssetDefinitionCatalogSupportRefFactory.new_catalog_entry_ref(definition_ref, catalog_scope_ref, catalog_classification, applicability_summary, operation_context_ref, operation_digest_ref, dedup_scope_ref)` after loading the linked definition and confirming no existing `(definition_ref,catalog_scope_ref)` catalog entry. It must then call `MethodAssetCatalogEntry::create_for_definition(catalog_entry_ref, definition_ref, catalog_scope_ref, catalog_classification, applicability_summary)`.
- `MethodAssetDefinitionCatalogSupportRefFactory` is the only current-boundary callable source for newly minted `MethodAssetDefinitionRef` / `MethodAssetCatalogEntryRef`;service code must not call a generic IdGenerator directly, parse typed-ref text, use repository row ids, route/request ids, timestamps, counters, config keys or fake private maps.
- `create_for_definition(...)` must reject mismatched `catalog_scope_ref`, `catalog_classification.catalog_scope_ref` and `applicability_summary.applicability_scope_ref`;repository/fake must not repair or default these fields.
- `ReclassifyCatalogEntry` must call `loaded.value.reclassify(new_catalog_classification, new_applicability_summary)` after `catalog_status == Visible` is confirmed. It must update both classification and applicability in the saved truth and keep `catalog_status = Visible`.
- Reclassification must reject mismatched `new_catalog_classification.catalog_scope_ref` and `new_applicability_summary.applicability_scope_ref`;it must not keep stale applicability from the loaded entry.

Common replay envelope assembly:

| service input field | exact source |
|---|---|
| `operation_context_ref` | copied from Step 6 `3B.1.1` `MethodAssetDefinitionCatalogReplayEnvelope.operation_context_ref`;the facade must not call IdGenerator or parse shell fields directly. |
| `idempotency_key_ref` | copied from Step 6 `3B.1.1` `MethodAssetDefinitionCatalogReplayEnvelope.idempotency_key_ref`;missing metadata idempotency key is returned as `MissingIdempotencyKey` before mutation. |
| `operation_digest_ref` | copied from Step 6 `3B.1.1` `MethodAssetDefinitionCatalogReplayEnvelope.operation_digest_ref`;the canonical builder is owned by `MethodAssetDefinitionCatalogSupportRefFactory` and must exclude raw body, route, provider payload and fake state. |
| `dedup_scope_ref` | copied from Step 6 `3B.1.1` `MethodAssetDefinitionCatalogReplayEnvelope.dedup_scope_ref`;primary subject and catalog scope rules are defined by the factory closure. |

Replay envelope callable surface:

```rust
pub trait MethodAssetDefinitionCatalogSupportRefFactory {
    fn definition_catalog_dispatch_ref(&self) -> MethodAssetApplicationDispatchRef;
    fn new_api_entry_context_ref(&mut self) -> MethodAssetApiEntryContextRef;
    fn build_definition_catalog_replay_envelope(
        &mut self,
        input: MethodAssetDefinitionCatalogReplayEnvelopeFactoryInput,
    ) -> Result<MethodAssetDefinitionCatalogReplayEnvelope, MethodAssetReplayEnvelopeBuildError>;
    fn new_stored_operation_result_ref(&mut self) -> MethodAssetStoredOperationResultRef;
    fn new_accepted_operation_summary_ref(&mut self) -> MethodAssetAcceptedOperationSummaryRef;
    fn new_safe_reject_reason_ref(&mut self) -> MethodAssetSafeRejectReasonRef;
    fn new_safe_ignore_reason_ref(&mut self) -> MethodAssetSafeIgnoreReasonRef;
    fn new_effect_summary_ref(&mut self) -> MethodAssetEffectSummaryRef;
    fn new_replay_marker_ref(&mut self) -> MethodAssetReplayMarkerRef;
    fn new_definition_ref(
        &mut self,
        identity_key: MethodAssetIdentityKey,
        operation_context_ref: MethodAssetOperationContextRef,
        operation_digest_ref: MethodAssetOperationDigestRef,
        dedup_scope_ref: MethodAssetDedupScopeRef,
    ) -> MethodAssetDefinitionRef;
    fn new_catalog_entry_ref(
        &mut self,
        definition_ref: MethodAssetDefinitionRef,
        catalog_scope_ref: CatalogScopeRef,
        catalog_classification: MethodAssetCatalogClassification,
        applicability_summary: MethodAssetApplicabilitySummary,
        operation_context_ref: MethodAssetOperationContextRef,
        operation_digest_ref: MethodAssetOperationDigestRef,
        dedup_scope_ref: MethodAssetDedupScopeRef,
    ) -> MethodAssetCatalogEntryRef;
}
```

The facade must call `build_definition_catalog_replay_envelope(...)` after selector/source match and before constructing any of the six service inputs. `MethodAssetReplayEnvelopeBuildError` maps to a stored safe rejected result using the already-closed stored result repository. Implementation must not create `MethodAssetOperationContextRef`, `MethodAssetOperationDigestRef`, `MethodAssetDedupScopeRef`, stored-result refs, accepted/rejected/effect refs or replay markers through local constructors, string concatenation, route/config values, timestamp/counter formatting or repository ids.

Assembly failure rules:

- Shell selector and `command_source` variant mismatch returns safe rejected stored result before UoW mutation.
- Missing `command_source`, missing source field, wrong typed ref kind inside any nested carrier or forbidden body marker returns safe rejected stored result before mutation.
- Replay envelope factory failure returns safe rejected stored result before UoW mutation.
- Missing repository target for update/retire/reclassify returns safe rejected stored result;expected version must not be synthesized.
- Version conflict from save maps through `MethodAssetRepositoryError::VersionConflict`;the facade must not reload and retry by itself.
- The duplicate digest includes the selected source variant. A duplicate idempotency key with the same selector but different source fields is a digest conflict, not an accepted replay.

### 2. Current-boundary command service callable surface

`commit-03-b` 只闭合 Step 9 中 definition/catalog 6 条 accepted command flow。下列 service input 是 application-internal Rust-facing carrier,不是 public protocol DTO。API handler 不得从 route/query/header/raw body 填充它;structured accepted fields 只能从 Step 6 `3B.1B` `MethodAssetDefinitionCatalogCommandSource` 复制,replay envelope fields 只能从 Step 6 `3B.1` application mappers / metadata / canonical digest builders 复制。

| service method | input carrier | required closed inputs | accepted output | rejected output |
|---|---|---|---|---|
| `establish_definition(input, uow)` | `EstablishMethodAssetDefinitionInput` | `MethodAssetDefinitionKind`;`MethodAssetIdentityKey`;`MethodAssetDefinitionSummary`;`ExternalSourceSummaryRefSet`;idempotency key/digest/scope;optional preaccepted catalog refs | `MethodAssetDefinitionRef`;accepted summary ref;effect summary refs | safe reject reason ref + stored rejected result |
| `adjust_definition(input, uow)` | `AdjustMethodAssetDefinitionInput` | `MethodAssetDefinitionRef`;expected version from loaded definition;replacement body-free summary/source refs;idempotency key/digest/scope | `MethodAssetDefinitionRef`;accepted summary ref;effect summary refs | missing/stale/body-boundary rejection stored result |
| `retire_definition(input, uow)` | `RetireMethodAssetDefinitionInput` | `MethodAssetDefinitionRef`;expected version from loaded definition;safe retirement marker;idempotency key/digest/scope | `MethodAssetDefinitionRef`;accepted summary ref;effect summary refs | missing/stale/already-retired rejection or replay stored result |
| `register_catalog_entry(input, uow)` | `RegisterMethodAssetCatalogEntryInput` | `MethodAssetDefinitionRef`;`CatalogScopeRef`;`MethodAssetCatalogClassification`;`MethodAssetApplicabilitySummary`;idempotency key/digest/scope | `MethodAssetCatalogEntryRef`;accepted summary ref;effect summary refs | missing definition / duplicate scoped entry rejection stored result |
| `reclassify_catalog_entry(input, uow)` | `ReclassifyMethodAssetCatalogEntryInput` | `MethodAssetCatalogEntryRef`;expected version from loaded entry;new classification/applicability;idempotency key/digest/scope | `MethodAssetCatalogEntryRef`;accepted summary ref;effect summary refs | missing/stale/invalid-scope rejection stored result |
| `retire_catalog_entry(input, uow)` | `RetireMethodAssetCatalogEntryInput` | `MethodAssetCatalogEntryRef`;expected version from loaded entry;safe retirement marker;idempotency key/digest/scope | `MethodAssetCatalogEntryRef`;accepted summary ref;effect summary refs | missing/stale/non-visible/already-retired rejection or replay stored result |

All six methods must use the same duplicate/replay rule: lookup stored result by `(idempotency_key_ref, dedup_scope_ref)`, compare `operation_digest_ref`, replay stored safe result on match, return stored safe conflict result on mismatch, and never rerun mutation to recreate a public response.

### 2A. Service input exact Rust-facing schema

All six service inputs contain the same replay envelope fields and differ only by domain command payload. All methods return `Result<MethodAssetStoredOperationResult, MethodAssetRepositoryError>` and the facade converts that stored result into `MethodAssetDefinitionCatalogCommandDispatchOutput`.

```rust
pub struct EstablishMethodAssetDefinitionInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub definition_kind: MethodAssetDefinitionKind,
    pub identity_key: MethodAssetIdentityKey,
    pub definition_summary: MethodAssetDefinitionSummary,
    pub source_summary_refs: ExternalSourceSummaryRefSet,
    pub preaccepted_catalog_entry_refs: MethodAssetCatalogEntryRefSet,
}

pub struct AdjustMethodAssetDefinitionInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub definition_ref: MethodAssetDefinitionRef,
    pub expected_version: MethodAssetExpectedVersion,
    pub replacement_definition_summary: MethodAssetDefinitionSummary,
    pub replacement_source_summary_refs: ExternalSourceSummaryRefSet,
}

pub struct RetireMethodAssetDefinitionInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub definition_ref: MethodAssetDefinitionRef,
    pub expected_version: MethodAssetExpectedVersion,
    pub retirement_marker_ref: MethodLibrarySafeMarker,
}

pub struct RegisterMethodAssetCatalogEntryInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub definition_ref: MethodAssetDefinitionRef,
    pub catalog_scope_ref: CatalogScopeRef,
    pub catalog_classification: MethodAssetCatalogClassification,
    pub applicability_summary: MethodAssetApplicabilitySummary,
}

pub struct ReclassifyMethodAssetCatalogEntryInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub catalog_entry_ref: MethodAssetCatalogEntryRef,
    pub expected_version: MethodAssetExpectedVersion,
    pub new_catalog_classification: MethodAssetCatalogClassification,
    pub new_applicability_summary: MethodAssetApplicabilitySummary,
}

pub struct RetireMethodAssetCatalogEntryInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub catalog_entry_ref: MethodAssetCatalogEntryRef,
    pub expected_version: MethodAssetExpectedVersion,
    pub retirement_marker_ref: MethodLibrarySafeMarker,
}
```

Source restrictions:

- `operation_context_ref`, `idempotency_key_ref`, `operation_digest_ref` and `dedup_scope_ref` use Step 6 `3B` application-owned carriers only.
- New `definition_ref` for establish and new `catalog_entry_ref` for register are minted only through `MethodAssetDefinitionCatalogSupportRefFactory.new_definition_ref(...)` / `new_catalog_entry_ref(...)` at the accepted flow points;repository save, domain factory, API handler and fake runtime must not create or replace truth refs.
- `expected_version` is copied from the matching `Versioned<T>` repository load;create commands do not invent expected version.
- `preaccepted_catalog_entry_refs` is an empty-allowed deterministic ref-set;absence must be represented by empty set, not `None` plus private fake rule.
- `retirement_marker_ref` is a `MethodLibrarySafeMarker`;it must not be raw reason text, HTTP status, UI label or config value.
- `source_summary_refs` validates named `ExternalSourceSummaryRef` wrappers only;durable external summary dereference remains deferred.
- `retire_catalog_entry` must load the catalog entry, require `catalog_status == MethodAssetCatalogEntryStatus::Visible`, call `MethodAssetCatalogEntry.mark_retired(retirement_marker_ref)`, and save with the loaded expected version. `Pending`, `Hidden`, `Deprecated` and `Retired` are safe rejection or duplicate replay states for this current boundary;the service must not coerce them to current `Registered`.
- `register_catalog_entry` must construct catalog truth only through `MethodAssetCatalogEntry::create_for_definition(catalog_entry_ref, definition_ref, catalog_scope_ref, catalog_classification, applicability_summary)`.
- `reclassify_catalog_entry` must update classification and applicability together through `MethodAssetCatalogEntry.reclassify(new_catalog_classification, new_applicability_summary)`;stale applicability or scope defaults are forbidden.

### 3. Rust-facing version / UoW carriers

| carrier | owner | required shape | source rule |
|---|---|---|---|
| `MethodAssetRepositoryVersion` | application | opaque version token;clone/eq/debug only;not a cursor | returned only by repository exact read / stable lookup / successful save。 |
| `MethodAssetExpectedVersion` | application | wrapper copied from `MethodAssetRepositoryVersion` | update save must use loaded version;create save must use `None` expected version。 |
| `Versioned<T>` | application | `{ value: T, version: MethodAssetRepositoryVersion }` | returned by exact read / stable lookup;implementation must not synthesize version from timestamp/ref/digest。 |
| `VersionedRef<TRef>` | application | `{ value_ref: TRef, version: MethodAssetRepositoryVersion }` | returned by successful save so tests can assert version advancement。 |
| `UnitOfWork` | application port;infra implements | `begin_command_uow()`, repository writes, stored-result writes, then explicit `commit()` or `rollback()` | entry cannot create UoW;repository cannot auto-commit outside supplied UoW。 |

### 4. Current-boundary repository signatures

These method names are the formal callable surface for `commit-03-b`. Fake and durable implementations must share the same behavior.

```rust
trait MethodAssetDefinitionRepository {
    fn get_definition_with_version(
        &self,
        definition_ref: MethodAssetDefinitionRef,
    ) -> Result<Option<Versioned<MethodAssetDefinition>>, MethodAssetRepositoryError>;

    fn find_definition_by_identity_key(
        &self,
        identity_key: MethodAssetIdentityKey,
    ) -> Result<Option<Versioned<MethodAssetDefinition>>, MethodAssetRepositoryError>;

    fn save_definition(
        &self,
        definition: MethodAssetDefinition,
        expected_version: Option<MethodAssetExpectedVersion>,
        uow: &mut dyn UnitOfWork,
    ) -> Result<VersionedRef<MethodAssetDefinitionRef>, MethodAssetRepositoryError>;
}

trait MethodAssetCatalogEntryRepository {
    fn get_catalog_entry_with_version(
        &self,
        catalog_entry_ref: MethodAssetCatalogEntryRef,
    ) -> Result<Option<Versioned<MethodAssetCatalogEntry>>, MethodAssetRepositoryError>;

    fn find_catalog_entry_by_definition_scope(
        &self,
        definition_ref: MethodAssetDefinitionRef,
        catalog_scope_ref: CatalogScopeRef,
    ) -> Result<Option<Versioned<MethodAssetCatalogEntry>>, MethodAssetRepositoryError>;

    fn save_catalog_entry(
        &self,
        catalog_entry: MethodAssetCatalogEntry,
        expected_version: Option<MethodAssetExpectedVersion>,
        uow: &mut dyn UnitOfWork,
    ) -> Result<VersionedRef<MethodAssetCatalogEntryRef>, MethodAssetRepositoryError>;
}
```

Repository missing returns `Ok(None)`. Version conflict returns `MethodAssetRepositoryError::VersionConflict` and is mapped by application to replay-safe rejection. Repository implementations must not implicitly create truth on exact read, must not link definition/catalog side effects outside the service UoW, and must not use query material/search index as lookup source.

`MethodAssetDefinitionRepository` must persist and return `MethodAssetDefinition.definition_lifecycle` as part of the `MethodAssetDefinition` value. `get_definition_with_version(...)` and `find_definition_by_identity_key(...)` must expose the stored `Active` / `Retired` lifecycle through `Versioned<MethodAssetDefinition>`. `save_definition(...)` is the only current-boundary write surface for `Active -> Retired`; fake and durable adapters must not keep lifecycle in a side map, derive it from `MethodAssetStoredOperationResult`, catalog status, formal version state, effect refs, typed-ref strings, timestamps or error text.

`MethodAssetRepositoryError` exact current-boundary enum surface is closed by Step 6 `3B.3` and used here without extension:

```rust
pub enum MethodAssetRepositoryError {
    VersionConflict {
        expected_version: Option<MethodAssetExpectedVersion>,
        actual_version: MethodAssetRepositoryVersion,
        conflict_marker_ref: MethodLibrarySafeMarker,
    },
    DuplicateKeyConflict {
        conflict_marker_ref: MethodLibrarySafeMarker,
    },
    TransactionNotActive {
        failure_marker_ref: MethodLibrarySafeMarker,
    },
    StorageUnavailable {
        unavailable_marker_ref: MethodLibrarySafeMarker,
    },
    StoredResultIntegrityViolation {
        stored_result_ref: Option<MethodAssetStoredOperationResultRef>,
        violation_marker_ref: MethodLibrarySafeMarker,
    },
}
```

Implementation must not add local error variants for SQL error, IO error, serialization error, poison error, route error, panic, fake-only condition or raw duplicate payload. Such conditions must map to one of the above safe variants with a `MethodLibrarySafeMarker`, or stop as a design blocker if no mapping exists.

### 5. Current-boundary stored-result / idempotency surface

```rust
trait MethodAssetStoredOperationResultRepository {
    fn find_command_result_by_idempotency(
        &self,
        idempotency_key_ref: MethodAssetIdempotencyKeyRef,
        dedup_scope_ref: MethodAssetDedupScopeRef,
    ) -> Result<Option<MethodAssetStoredOperationResult>, MethodAssetRepositoryError>;

    fn get_stored_operation_result(
        &self,
        stored_result_ref: MethodAssetStoredOperationResultRef,
    ) -> Result<Option<MethodAssetStoredOperationResult>, MethodAssetRepositoryError>;

    fn save_command_result_for_idempotency(
        &self,
        idempotency_key_ref: MethodAssetIdempotencyKeyRef,
        dedup_scope_ref: MethodAssetDedupScopeRef,
        operation_digest_ref: MethodAssetOperationDigestRef,
        stored_result: MethodAssetStoredOperationResult,
        uow: &mut dyn UnitOfWork,
    ) -> Result<MethodAssetStoredOperationResultRef, MethodAssetRepositoryError>;
}
```

`MethodAssetStoredOperationResult` for `commit-03-b` must persist only `stored_result_ref`, `operation_context_ref`, `operation_digest_ref`, `result_kind`, optional accepted/rejected/ignored refs, `effect_summary_refs`, and `replay_marker_ref`. It must not persist public DTO body, raw command shell body, raw error, DB row snapshot, provider payload, event payload, report body or transport status.

### 6. Fake parity and stop rules

| topic | required fake behavior | stop condition |
|---|---|---|
| definition lifecycle parity | In-memory fake must store `definition_lifecycle` inside the same `MethodAssetDefinition` value it returns through versioned reads; rollback hides lifecycle changes, duplicate replay does not rerun `mark_retired`, and post-retire adjust/retire attempts observe the loaded `Retired` lifecycle. | Fake requires a private lifecycle side map, string parsing, stored-result-only status, catalog status reuse or default-to-Active reload rule. |
| version | create starts with repository version 1 or equivalent opaque token;update requires matching loaded version and advances token。 | fake accepts stale expected version or updates without expected version。 |
| UoW | writes staged in supplied UoW become visible only after commit;rollback leaves no truth/stored-result/effect。 | fake writes directly to map before commit or leaves stored accepted result after rollback。 |
| uniqueness | definition identity key and `(definition_ref,catalog_scope_ref)` are unique lookup keys。 | fake creates duplicate definition/catalog rows for same stable key。 |
| duplicate replay | same key/scope/digest returns previously stored safe result without domain mutation。 | fake reruns domain creation or rebuilds response from current truth。 |
| conflict | same key/scope with different digest returns safe conflict stored result/rejection。 | fake treats digest mismatch as accepted duplicate。 |
| external summary refs | `commit-03-b` validates `ExternalSourceSummaryRef` named wrappers only;durable external summary dereference remains `commit-07-a`。 | implementation tries to load provider body, URL/path or external adapter to establish definition。 |

This section resolves `BLK-ML-03B-DESIGN-001` and `BLK-ML-03B-DESIGN-002`. Implementation must still rerun the current boundary Design Gate from `read_docs`.

---

## R7.10B `commit-04-b` implementation-facing closure

### 1. Design patch scope

本节闭合 `commit-04-b` 当前 formalization/version accepted service vertical slice。它只把 already-defined PH-04 command service、duplicate replay、version conflict 和 commit unknown 补成 Rust-facing facade / service input / repository / resolver / UoW surface。它不新增 public command DTO body,不进入 query/material/publisher/job,也不恢复 publish/fingerprint/snapshot/outbox 主线。

| closure item | current-boundary decision |
|---|---|
| command family carrier | `MethodAssetCommandFamilyKind` 在 `commit-04-b` 的 exact Rust-facing carrier 是 `method_library_contracts::MethodLibraryCapabilityKind`;本 boundary 只接受 `FormalizationVersion`,其他 family safe rejected。 |
| command shell input | API entry passes `method_library_contracts::MethodLibraryCommandShell` plus `MethodAssetFormalizationVersionCommandSource`, `MethodAssetApiEntryContextRef` and `MethodAssetApplicationDispatchRef`;entry 不展开 public DTO body,不创建 domain object。 |
| application dispatch ref | `MethodAssetApplicationDispatchRef` 是 application-owned opaque dispatch marker;`commit-04-b` 唯一合法值是 `FormalizationVersionCommandService`;不得使用 route string、type-name string、config key 或 fake private locator。 |
| application facade | API 只调用 `MethodAssetFormalizationVersionCommandFacade.dispatch_formalization_version_command(input)`,不得直连 repository、domain、UoW 或 infra adapter。 |
| command service methods | `evaluate_formalization_eligibility`;`initiate_formalization`;`establish_formal_version`;`record_formal_version_semantic_change`;`supersede_formal_version`;`retire_formal_version`。 |
| truth/support repositories | definition/catalog repositories 复用 `commit-03-b` exact callable surface;本 boundary 新增 formalization state、formal version、basis summary exact read/save/current lookup surface。 |
| resolver / builder seams | formalization basis resolver、policy diagnostic builder、retirement precheck helper 只返回 body-free summary / marker / safe reason。 |
| replay / commit unknown | duplicate replay 只复制 stored safe result;commit unknown 只允许 formal stored surface + versioned repo read-back,不得 blind retry。 |

### 1A. Facade I/O exact Rust-facing schema

```rust
pub struct MethodAssetFormalizationVersionCommandDispatchInput {
    pub command_shell: MethodLibraryCommandShell,
    pub command_source: MethodAssetFormalizationVersionCommandSource,
    pub api_entry_context_ref: MethodAssetApiEntryContextRef,
    pub application_dispatch_ref: MethodAssetApplicationDispatchRef,
}

pub struct MethodAssetFormalizationVersionCommandDispatchOutput {
    pub stored_result_ref: MethodAssetStoredOperationResultRef,
    pub result_kind: MethodAssetStoredOperationResultKind,
    pub replay_marker_ref: MethodAssetReplayMarkerRef,
    pub accepted_summary_ref: Option<MethodAssetAcceptedOperationSummaryRef>,
    pub rejected_reason_ref: Option<MethodAssetSafeRejectReasonRef>,
    pub ignored_reason_ref: Option<MethodAssetSafeIgnoreReasonRef>,
    pub effect_summary_refs: MethodAssetEffectSummaryRefSet,
}
```

`MethodAssetFormalizationVersionCommandDispatchOutput` is assembled only by copying the stored-result safe surface. The facade must not rebuild accepted/rejected output from current truth,raw repository rows,transport status,governance body,trace/audit material or provider payload.

### 1B. Command shell selector and dispatch closure

```rust
pub enum MethodAssetFormalizationVersionCommandSelector {
    EvaluateFormalizationEligibility,
    InitiateFormalization,
    EstablishFormalVersion,
    RecordFormalVersionSemanticChange,
    SupersedeFormalVersion,
    RetireFormalVersion,
}

pub enum MethodAssetFormalizationVersionServiceInput {
    EvaluateFormalizationEligibility(EvaluateMethodAssetFormalizationEligibilityInput),
    InitiateFormalization(InitiateMethodAssetFormalizationInput),
    EstablishFormalVersion(EstablishFormalMethodAssetVersionInput),
    RecordFormalVersionSemanticChange(RecordFormalVersionSemanticChangeInput),
    SupersedeFormalVersion(SupersedeFormalMethodAssetVersionInput),
    RetireFormalVersion(RetireFormalMethodAssetVersionInput),
}
```

| shell condition | selector | service input | service method |
|---|---|---|---|
| `capability_kind == FormalizationVersion` and `boundary_ref.kind == MethodAssetFormalizationEligibilityEvaluateIntent` | `EvaluateFormalizationEligibility` | `EvaluateMethodAssetFormalizationEligibilityInput` | `evaluate_formalization_eligibility` |
| `capability_kind == FormalizationVersion` and `boundary_ref.kind == MethodAssetFormalizationInitiateIntent` | `InitiateFormalization` | `InitiateMethodAssetFormalizationInput` | `initiate_formalization` |
| `capability_kind == FormalizationVersion` and `boundary_ref.kind == FormalMethodAssetVersionEstablishIntent` | `EstablishFormalVersion` | `EstablishFormalMethodAssetVersionInput` | `establish_formal_version` |
| `capability_kind == FormalizationVersion` and `boundary_ref.kind == FormalMethodAssetVersionSemanticChangeRecordIntent` | `RecordFormalVersionSemanticChange` | `RecordFormalVersionSemanticChangeInput` | `record_formal_version_semantic_change` |
| `capability_kind == FormalizationVersion` and `boundary_ref.kind == FormalMethodAssetVersionSupersedeIntent` | `SupersedeFormalVersion` | `SupersedeFormalMethodAssetVersionInput` | `supersede_formal_version` |
| `capability_kind == FormalizationVersion` and `boundary_ref.kind == FormalMethodAssetVersionRetireIntent` | `RetireFormalVersion` | `RetireFormalMethodAssetVersionInput` | `retire_formal_version` |

Non-`FormalizationVersion` family,unknown intent,mismatch between selector and source variant,missing required typed refs / markers,or wrong dispatch target all return safe rejected stored result before UoW mutation.

### 1C. Command source to service input assembly closure

After selector choice,the facade must match the shell intent with the `MethodAssetFormalizationVersionCommandSource` variant from Step 6 `4B.5`. This is the only current-boundary source for structured accepted-path fields.

| selector | required source variant | service input field assembly |
|---|---|---|
| `EvaluateFormalizationEligibility` | `MethodAssetFormalizationVersionCommandSource::EvaluateFormalizationEligibility(source)` | `definition_ref = source.definition_ref`;`catalog_entry_ref = source.catalog_entry_ref`;`basis_summary_refs = source.basis_summary_refs`;`eligibility_rule_ref = source.eligibility_rule_ref`;load current state via `find_formalization_state_by_definition_catalog(...)`;copy `current_formalization_state_ref` and `expected_state_version` when present。 |
| `InitiateFormalization` | `MethodAssetFormalizationVersionCommandSource::InitiateFormalization(source)` | `definition_ref = source.definition_ref`;`catalog_entry_ref = source.catalog_entry_ref`;`trigger_marker_ref = source.trigger_marker_ref`;`basis_summary_refs = source.basis_summary_refs`;load current state via `find_formalization_state_by_definition_catalog(...)`;copy `current_formalization_state_ref` and `expected_state_version` when present。 |
| `EstablishFormalVersion` | `MethodAssetFormalizationVersionCommandSource::EstablishFormalVersion(source)` | `formalization_state_ref = source.formalization_state_ref`;load state via `get_formalization_state_with_version(...)`;`expected_state_version = loaded.version`;`definition_ref = source.definition_ref`;`catalog_entry_ref = source.catalog_entry_ref`;`version_boundary_summary = source.version_boundary_summary`。 |
| `RecordFormalVersionSemanticChange` | `MethodAssetFormalizationVersionCommandSource::RecordFormalVersionSemanticChange(source)` | `formal_version_ref = source.formal_version_ref`;load version via `get_formal_method_asset_version_with_version(...)`;`expected_version = loaded.version`;`semantic_change_marker_ref = source.semantic_change_marker_ref`;`basis_summary_refs = source.basis_summary_refs`;`governance_basis_ref = source.governance_basis_ref`。 |
| `SupersedeFormalVersion` | `MethodAssetFormalizationVersionCommandSource::SupersedeFormalVersion(source)` | `previous_formal_version_ref = source.previous_formal_version_ref`;load previous version;`previous_expected_version = loaded.version`;`next_formal_version_ref = source.next_formal_version_ref`;load next version;`next_expected_version = loaded.version`;`supersession_marker_ref = source.supersession_marker_ref`。 |
| `RetireFormalVersion` | `MethodAssetFormalizationVersionCommandSource::RetireFormalVersion(source)` | `formal_version_ref = source.formal_version_ref`;load version via `get_formal_method_asset_version_with_version(...)`;`expected_version = loaded.version`;`retirement_marker_ref = source.retirement_marker_ref`。 |

Common replay envelope assembly:

- All six inputs copy `operation_context_ref`, `idempotency_key_ref`, `operation_digest_ref` and `dedup_scope_ref` only from `MethodAssetFormalizationVersionSupportRefFactory.build_formalization_version_replay_envelope(...)`.
- `EvaluateFormalizationEligibility` and `InitiateFormalization` must call `new_formalization_state_ref(...)` only after duplicate replay lookup misses and only when current-state lookup is absent.
- `EstablishFormalVersion` must call `new_formal_method_asset_version_ref(...)` only after duplicate replay lookup misses,after the loaded state proves `Eligible`,and after `find_current_formal_method_asset_version(...)` returns `None`.
- `RecordFormalVersionSemanticChange`, `SupersedeFormalVersion` and `RetireFormalVersion` must not mint new truth refs in this boundary.

### 2A. Service input exact Rust-facing schema

All six service inputs contain the same replay envelope fields and differ only by body-free command payload. All methods return `Result<MethodAssetStoredOperationResult, MethodAssetRepositoryError>` and the facade converts that stored result into `MethodAssetFormalizationVersionCommandDispatchOutput`.

```rust
pub struct EvaluateMethodAssetFormalizationEligibilityInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub definition_ref: MethodAssetDefinitionRef,
    pub catalog_entry_ref: MethodAssetCatalogEntryRef,
    pub current_formalization_state_ref: Option<FormalizationStateRef>,
    pub expected_state_version: Option<MethodAssetExpectedVersion>,
    pub basis_summary_refs: FormalizationBasisSummaryRefSet,
    pub eligibility_rule_ref: FormalizationEligibilityRuleRef,
}

pub struct InitiateMethodAssetFormalizationInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub definition_ref: MethodAssetDefinitionRef,
    pub catalog_entry_ref: MethodAssetCatalogEntryRef,
    pub current_formalization_state_ref: Option<FormalizationStateRef>,
    pub expected_state_version: Option<MethodAssetExpectedVersion>,
    pub trigger_marker_ref: MethodLibrarySafeMarker,
    pub basis_summary_refs: FormalizationBasisSummaryRefSet,
}

pub struct EstablishFormalMethodAssetVersionInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub formalization_state_ref: FormalizationStateRef,
    pub expected_state_version: MethodAssetExpectedVersion,
    pub definition_ref: MethodAssetDefinitionRef,
    pub catalog_entry_ref: MethodAssetCatalogEntryRef,
    pub version_boundary_summary: FormalVersionBoundarySummary,
}

pub struct RecordFormalVersionSemanticChangeInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub formal_version_ref: FormalMethodAssetVersionRef,
    pub expected_version: MethodAssetExpectedVersion,
    pub semantic_change_marker_ref: MethodLibrarySafeMarker,
    pub basis_summary_refs: FormalizationBasisSummaryRefSet,
    pub governance_basis_ref: Option<GovernanceBasisRef>,
}

pub struct SupersedeFormalMethodAssetVersionInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub previous_formal_version_ref: FormalMethodAssetVersionRef,
    pub previous_expected_version: MethodAssetExpectedVersion,
    pub next_formal_version_ref: FormalMethodAssetVersionRef,
    pub next_expected_version: MethodAssetExpectedVersion,
    pub supersession_marker_ref: MethodLibrarySafeMarker,
}

pub struct RetireFormalMethodAssetVersionInput {
    pub operation_context_ref: MethodAssetOperationContextRef,
    pub idempotency_key_ref: MethodAssetIdempotencyKeyRef,
    pub operation_digest_ref: MethodAssetOperationDigestRef,
    pub dedup_scope_ref: MethodAssetDedupScopeRef,
    pub formal_version_ref: FormalMethodAssetVersionRef,
    pub expected_version: MethodAssetExpectedVersion,
    pub retirement_marker_ref: MethodLibrarySafeMarker,
}
```

### 3. Current-boundary repository / resolver / UoW signatures

`MethodAssetDefinitionRepository`, `MethodAssetCatalogEntryRepository` and `MethodAssetStoredOperationResultRepository` reuse the exact `commit-03-b` callable surface. `commit-04-b` adds only the current-flow methods below.

```rust
pub enum MethodAssetCommitObservation {
    Committed,
    CommitUnknown { unknown_marker_ref: MethodLibrarySafeMarker },
}

trait FormalizationStateRepository {
    fn get_formalization_state_with_version(
        &self,
        formalization_state_ref: FormalizationStateRef,
    ) -> Result<Option<Versioned<FormalizationState>>, MethodAssetRepositoryError>;

    fn find_formalization_state_by_definition_catalog(
        &self,
        definition_ref: MethodAssetDefinitionRef,
        catalog_entry_ref: MethodAssetCatalogEntryRef,
    ) -> Result<Option<Versioned<FormalizationState>>, MethodAssetRepositoryError>;

    fn save_formalization_state(
        &self,
        formalization_state: FormalizationState,
        expected_version: Option<MethodAssetExpectedVersion>,
        uow: &mut dyn UnitOfWork,
    ) -> Result<VersionedRef<FormalizationStateRef>, MethodAssetRepositoryError>;
}

trait FormalMethodAssetVersionRepository {
    fn get_formal_method_asset_version_with_version(
        &self,
        formal_version_ref: FormalMethodAssetVersionRef,
    ) -> Result<Option<Versioned<FormalMethodAssetVersion>>, MethodAssetRepositoryError>;

    fn find_current_formal_method_asset_version(
        &self,
        formalization_state_ref: FormalizationStateRef,
    ) -> Result<Option<Versioned<FormalMethodAssetVersion>>, MethodAssetRepositoryError>;

    fn save_formal_method_asset_version(
        &self,
        formal_version: FormalMethodAssetVersion,
        expected_version: Option<MethodAssetExpectedVersion>,
        uow: &mut dyn UnitOfWork,
    ) -> Result<VersionedRef<FormalMethodAssetVersionRef>, MethodAssetRepositoryError>;
}

trait FormalizationBasisSummaryRepository {
    fn get_formalization_basis_summary_with_version(
        &self,
        basis_summary_ref: FormalizationBasisSummaryRef,
    ) -> Result<Option<Versioned<FormalizationBasisSummary>>, MethodAssetRepositoryError>;
}

pub struct FormalizationBasisResolutionInput {
    pub definition_ref: MethodAssetDefinitionRef,
    pub catalog_entry_ref: Option<MethodAssetCatalogEntryRef>,
    pub basis_summary_refs: FormalizationBasisSummaryRefSet,
    pub governance_basis_ref: Option<GovernanceBasisRef>,
}

pub struct FormalizationBasisResolution {
    pub accepted_basis_summary_refs: FormalizationBasisSummaryRefSet,
    pub pending_marker_ref: Option<MethodLibrarySafeMarker>,
    pub rejection_reason_ref: Option<FormalizationEligibilityRejectionRef>,
}

trait FormalizationBasisResolverPort {
    fn resolve_formalization_basis(
        &self,
        input: FormalizationBasisResolutionInput,
    ) -> Result<FormalizationBasisResolution, MethodAssetRepositoryError>;
}

pub struct FormalizationEligibilityDiagnostic {
    pub target_state_kind: FormalizationStateKind,
    pub reason_summary: FormalizationStateReasonSummary,
}

pub struct FormalVersionChangeDiagnostic {
    pub accepted_change_marker_ref: MethodLibrarySafeMarker,
    pub blocking_reason_ref: Option<MethodAssetSafeRejectReasonRef>,
}

trait MethodAssetPolicyDiagnosticBuilderPort {
    fn build_formalization_eligibility_diagnostic(
        &self,
        definition: &MethodAssetDefinition,
        catalog_entry: &MethodAssetCatalogEntry,
        basis_resolution: &FormalizationBasisResolution,
        eligibility_rule_ref: FormalizationEligibilityRuleRef,
    ) -> Result<FormalizationEligibilityDiagnostic, MethodAssetRepositoryError>;

    fn build_formal_version_change_diagnostic(
        &self,
        formal_version: &FormalMethodAssetVersion,
        basis_summary_refs: &FormalizationBasisSummaryRefSet,
        governance_basis_ref: Option<GovernanceBasisRef>,
        semantic_change_marker_ref: MethodLibrarySafeMarker,
    ) -> Result<FormalVersionChangeDiagnostic, MethodAssetRepositoryError>;
}

trait MethodAssetConsumptionMaterialRepository {
    fn find_consumption_material_refs_by_formal_version(
        &self,
        formal_version_ref: FormalMethodAssetVersionRef,
    ) -> Result<Vec<VersionedRef<MethodAssetConsumptionMaterialRef>>, MethodAssetRepositoryError>;
}

trait ConsumptionImpactSummaryRepository {
    fn find_pending_impact_summary_refs_by_formal_version(
        &self,
        formal_version_ref: FormalMethodAssetVersionRef,
    ) -> Result<Vec<VersionedRef<ConsumptionImpactSummaryRef>>, MethodAssetRepositoryError>;
}
```

Current-boundary callable rules:

- `find_formalization_state_by_definition_catalog(...)` is the only current-boundary page-free lookup for evaluate/initiate;service code must not scan history,query material or fake maps.
- `find_current_formal_method_asset_version(...)` is only used to prove absence before establish;service code must not infer current version from latest timestamp,publish flag,fingerprint or history page.
- `find_consumption_material_refs_by_formal_version(...)` and `find_pending_impact_summary_refs_by_formal_version(...)` are retirement precheck helpers only;they do not authorize read-material refresh,impact repair or downstream runtime inspection.
- `UnitOfWork.commit()` for this boundary must return `MethodAssetCommitObservation`;`CommitUnknown` must stop post-commit side effects and enter formal read-back flow instead of blind retry.

### 4. Fake parity and stop rules

| topic | required fake behavior | stop condition |
|---|---|---|
| formalization state parity | fake stores `state_kind`,`state_reason_summary`,`basis_summary_refs`,`current_formal_version_ref` inside the same `FormalizationState` value returned by versioned reads;rollback hides pending changes。 | fake reconstructs state from stored result,effect refs,string status or private side map。 |
| formal version parity | fake stores `version_state`,`version_boundary_summary`,`basis_summary_refs`,`supersedes_version_ref` inside the same `FormalMethodAssetVersion` value returned by versioned reads。 | fake derives current/superseded/retired from latest timestamp,publish flag,snapshot/fingerprint or private map。 |
| duplicate replay | same key/scope/digest returns previously stored safe result without rerunning evaluate/initiate/establish/change/supersede/retire mutation。 | fake reruns mutation or rebuilds response from current truth。 |
| commit unknown | fake may model `CommitUnknown`,but recovery still must read back stored result and versioned truth through the same callable surface before any accepted claim。 | fake treats timeout as rollback or accepted success without formal read-back proof。 |
| missing basis/version/state | exact read returns `Ok(None)` and current branch maps that to safe rejected stored result。 | fake auto-creates missing state/version,defaults basis,or falls through to another command branch。 |

This section resolves `BLK-ML-04B-DESIGN-001` and the callable-surface half of `BLK-ML-04B-DESIGN-003`. Implementation must rerun the current boundary Design Gate from `read_docs`.

---

## R7.11 support / trace / relation / material repository port:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.11 support / trace / relation / material repository port:先思考`。 |
| 本模块目标 | 基于 `R7.10` 已固定的 core truth repository family 和 Step 6 support / material / relation / peripheral 对象,裁决 support summary、read material、trace / impact / audit / lineage、relation truth 和 peripheral aggregate 的 repository family 切分,并收口 `R7.12` 写入边界。 |
| 当前状态 | completed |
| 当前产物 | support / material / relation repository 范围裁决、family 切分、identity / version / freshness / subject lookup 候选和 `R7.12` 写入边界。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. 前序输入承接

| 输入 | 对 `R7.11` 的约束 |
|---|---|
| `R7.10` core truth repository family | 已明确 `definition`、`catalog`、`formalization state`、`formal version` 是 core truth repository;`FormalizationBasisSummary` 与 `MethodAssetConsumptionMaterial` 已被显式切出。 |
| Step 6 support / material / relation / peripheral 对象卡片 | `FormalizationBasisSummary`、`ExternalSourceSummary`、`MethodAssetConsumptionMaterial`、`MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` 都已有 owner、字段来源和禁止事项。 |
| `02_hld_step_07_api_interface_skeleton.md` | `GetFormalizationBasisSummary`、`ResolveConsumptionMaterialForVersion`、`GetTraceBySubject`、`ListPendingConsumptionImpacts`、`GetExternalSummaryBySourceRef`、`ListMethodPackages`、`ListMethodSetAssemblies` 等 Query 已要求稳定 lookup / page helper。 |
| `02_hld_step_08_processing_flows.md` | basis summary inbound、trace / impact / audit / lineage 组织、external summary accepted、package / method set 生命周期都要求本地 exact read / save,但不得在 Query 中现场创建材料或补写 summary。 |
| `03_ddd_step_05_module_contracts.md` | 正式化与版本走 `version store + basis resolver adapter`;受控消费走 `material store + availability resolver`;追溯走 `trace material store + safe diagnostic adapter`;关系走 `relation store + distribution material adapter`;外围走 `package store + peripheral view adapter + marketplace context ref adapter`。 |
| Step 7 暂停规则 | `TraceSubjectRef`、`MethodAssetAuditSubjectRef`、`ConsumptionImpactSourceRef`、`MarketplaceContextRef`、freshness marker、source cursor 和 stable lookup 若没有正式来源,必须停在设计侧,不得靠字符串、payload、path、topic、private map 或搜索结果反推。 |

### 3. support / material / relation 范围裁决

| 对象 / 能力 | 是否进入 `R7.11` | 当前判断 | 后续归属 |
|---|---|---|---|
| `FormalizationBasisSummary` | 是 | 本地 basis summary 有稳定 `basis_summary_ref`,且 command / consumer / query 都会按 ref 或 basis source 读取,需要 support summary repository。 | `R7.12` repository 候选写入;`R7.13` 再收口 basis resolver。 |
| `ExternalSourceSummary` | 是 | external summary 是本地 body-free support summary 主语,需要 exact read、source lookup 和 acceptance page helper。 | `R7.12` repository 候选写入。 |
| `MethodAssetConsumptionMaterial` | 是 | 它是 controlled read material,不是 core truth,但有本地 stable ref、freshness / cursor 和 formal version -> context resolution 需求。 | `R7.12` material repository 候选写入。 |
| `MethodAssetTraceMaterial` | 是 | trace material 是本地 read material / support material,需要按 `trace_subject_ref` 读取和按 freshness / cursor 标识。 | `R7.12` material repository 候选写入。 |
| `ConsumptionImpactSummary` | 是 | impact summary 是本地 support summary,需要 exact read、pending / unknown page helper 和 explicit unknown 语义。 | `R7.12` repository 候选写入。 |
| `MethodAssetAuditTrail` | 是 | audit trail 是本地 append-only support aggregate,需要 exact read、subject lookup 和 versioned trail save;raw audit entry stream 后移。 | `R7.12` repository 候选写入。 |
| `MethodAssetEvidenceLineage` | 是 | lineage 是本地 body-free lineage 主语,需要 exact read、subject lookup 和 supersede / partial save 语义。 | `R7.12` repository 候选写入。 |
| `MethodAssetRelation` | 是 | relation 是 support truth,需要 endpoint / version / distribution context lookup,但不得回流 core truth repository。 | `R7.12` relation repository 候选写入。 |
| `MethodPackage` | 是 | package 是 peripheral aggregate,有本地 ref、成员 refs 和 context / page helper 需求。 | `R7.12` peripheral repository 候选写入。 |
| `MethodSetAssembly` | 是 | assembly 是 peripheral aggregate,需要 exact read 和 package / member scope list helper。 | `R7.12` peripheral repository 候选写入。 |
| `DistributionReadMaterial` | 否 | Step 6 当前只闭口到 contracts / read material shell,未形成本地 domain owner。 | 后移 `R7.13` / `R7.15` distribution material adapter / builder。 |
| `MethodPackageView` / `MethodSetAssemblyView` / `GetPeripheralDiscoveryContext` | 否 | 它们属于 view / discovery read surface,不是当前 repository family 主语。 | 后移 `R7.13` resolver / builder 或 `R7.17` maintenance / runtime 组。 |

### 4. repository family 切分判断

| repository family 候选 | 承接对象 | primary identity anchor | stable lookup / page 候选 | 切分理由 |
|---|---|---|---|---|
| `FormalizationBasisSummaryRepository` | `FormalizationBasisSummary` | `FormalizationBasisSummaryRef` | `(definition_ref, external_summary_ref)` 或 `(definition_ref, governance_basis_ref)` 的 basis-source lookup | basis summary 是 support summary,要与 core truth repository 和后续 basis resolver 分开。 |
| `ExternalSourceSummaryRepository` | `ExternalSourceSummary` | `ExternalSourceSummaryRef` | `external_source_ref` lookup;acceptance / definition-scoped page helper | external summary 是本地 support summary,不等于 external resolver 或 artifact archive adapter。 |
| `MethodAssetConsumptionMaterialRepository` | `MethodAssetConsumptionMaterial` | `MethodAssetConsumptionMaterialRef` | `(formal_version_ref, consumption_context_ref)` resolution;按 context / version 的 page helper | consumption material 是 read material,需要 freshness / cursor,但不能混入 formal version truth save。 |
| `MethodAssetTraceMaterialRepository` | `MethodAssetTraceMaterial` | `MethodAssetTraceMaterialRef` | `trace_subject_ref` lookup / page;source-object / freshness helper | trace material 是解释材料,既不等于 audit trail,也不等于 query 临时拼装。 |
| `ConsumptionImpactSummaryRepository` | `ConsumptionImpactSummary` | `ConsumptionImpactSummaryRef` | `impact_source_ref` lookup;pending / unknown page by version 或 context | impact summary 必须保留 unknown / pending,不能被 trace material 或 policy 侧吞并。 |
| `MethodAssetAuditTrailRepository` | `MethodAssetAuditTrail` | `MethodAssetAuditTrailRef` | `audit_subject_ref` lookup;optional subject page | audit trail 是 versioned support aggregate;raw entry append 面后移,不得与 trace material 合并。 |
| `MethodAssetEvidenceLineageRepository` | `MethodAssetEvidenceLineage` | `MethodAssetEvidenceLineageRef` | `trace_subject_ref` lookup;external / basis linked page helper | lineage 只管理 body-free lineage 主语,不等于 evidence archive 或 report store。 |
| `MethodAssetRelationRepository` | `MethodAssetRelation` | `MethodAssetRelationRef` | endpoint pair、formal version context、distribution context list helper | relation 是 support truth,但与 core truth identity 和 distribution material adapter 必须切开。 |
| `MethodPackageRepository` | `MethodPackage` | `MethodPackageRef` | marketplace / distribution context page;member definition / version page helper | package 是 peripheral aggregate,不能与 relation truth 或 discovery view adapter 混并。 |
| `MethodSetAssemblyRepository` | `MethodSetAssembly` | `MethodSetAssemblyRef` | package/member scope page helper | assembly 是 peripheral aggregate,不能把 adoption / discovery context resolver 并进 repository 本体。 |

当前结论同样是否定“万能 support repository”或“万能 material store”。summary、material、append-only support、relation truth 和 peripheral aggregate 必须按 identity、owner、freshness / subject lookup 和非范围约束切开。

### 5. identity / version / freshness / subject lookup 候选

| family | exact read 候选 | version 来源候选 | save / append pairing 候选 | page / freshness / subject helper 候选 | 暂停条件 |
|---|---|---|---|---|---|
| basis summary | exact by `basis_summary_ref` | exact read、basis-source lookup item version | versioned support summary save | definition + basis source lookup;history / supersede helper by definition | 若 basis identity 只能从外部正文、governance 执行正文或 event payload 文本推断,暂停。 |
| external summary | exact by `external_summary_ref` | exact read、source lookup item version | versioned support summary save | `external_source_ref` lookup;acceptance state page by definition / filter | 若 lookup 只能靠 URL、artifact path、provider payload 或 raw digest 反推,暂停。 |
| consumption material | exact by `consumption_material_ref` | exact read、resolution lookup item version | versioned material save | `(formal_version_ref, consumption_context_ref)` resolution;`source_cursor_ref` / freshness helper;page by context / version | 若 Query 缺 material 时需要现场创建、刷新或扫描下游 truth,暂停。 |
| trace material | exact by `trace_material_ref` | exact read、subject page item version | versioned material save | `trace_subject_ref` lookup / page;`source_cursor_ref` 与 `freshness_marker_ref` helper | 若 `trace_subject_ref` 只能从字符串、旧对象名、artifact path 或 private map 反推,暂停。 |
| impact summary | exact by `impact_summary_ref` | exact read、source lookup / page item version | versioned support summary save | `impact_source_ref` lookup;pending / unknown page by formal version 或 consumption context | 若 unknown / pending 被要求在 repository 层折叠成 no-effect,暂停。 |
| audit trail | exact by `audit_trail_ref` | exact read、subject lookup item version | versioned trail save;append-only entry 语义后移单独承接 | `audit_subject_ref` lookup;subject page helper | 若 trail 只能通过 raw log、request body、telemetry 或 private audit stream 生成 identity,暂停。 |
| evidence lineage | exact by `evidence_lineage_ref` | exact read、subject lookup / page item version | versioned lineage save | `trace_subject_ref` lookup;external / basis linked page helper | 若 lineage 需要 evidence body、archive body 或 report body 才能定位,暂停。 |
| relation truth | exact by `relation_ref` | exact read、endpoint list item version | versioned relation save / supersede pairing | endpoint pair、formal version、distribution context list helper | 若 relation lookup 需要 runtime graph、recommendation score 或 marketplace listing 反推,暂停。 |
| package | exact by `package_ref` | exact read、context / member list item version | versioned peripheral aggregate save | context / member page helper | 若列表顺序或 identity 需要 ranking、交易态、安装态或 UI state 支撑,暂停。 |
| assembly | exact by `method_set_assembly_ref` | exact read、package / member list item version | versioned peripheral aggregate save | package / member scope page helper | 若 adoption / discovery 需要组织运行 truth 或安装 / 履约状态补口,暂停。 |

这里的 `freshness_marker_ref`、`source_cursor_ref` 和 subject lookup 只说明 material / support family 的正式读取接缝,不能替代 optimistic version、truth cursor 或 future projection state。

### 6. 跨 family 闭口规则

| 规则 | 当前结论 |
|---|---|
| summary 不替代 resolver | `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 是本地 summary owner;外部 basis / availability / marketplace context resolver 仍后移。 |
| material 不替代 view / query assembler | `MethodAssetConsumptionMaterial`、`MethodAssetTraceMaterial` 只能被正式读取 / 刷新,不能在 Query 中现场拼装或补写。 |
| subject / context lookup 不替代 exact identity | `trace_subject_ref`、`audit_subject_ref`、`distribution_context_ref`、`marketplace_context_ref` 只是读取 helper,持久化仍必须回到正式 ref / version pairing。 |
| append-only 线索不等于 raw stream | `MethodAssetAuditTrail` 当前只承接 body-free trail aggregate;raw audit entry、history record、observability payload 和 report body 仍后移。 |
| peripheral 不阻塞 core | package / assembly repository 只能服务外围组织与 discovery,不得成为 definition、formalization、consumption、trace 或 relation 成立前置。 |
| body-free 贯穿所有 support family | basis / external / impact / audit / lineage / trace / package / assembly 全部只能承接 safe summary、typed ref、marker、cursor 或 page item。 |
| fake / durable 同口径 | fake runtime 与 durable store 必须共享 exact identity、stable lookup、version conflict、page ordering 和 freshness / subject helper 语义。 |

### 7. `R7.12` 写入边界

| `R7.12` 允许写入 | `R7.12` 禁止写入 |
|---|---|
| support / material / relation / peripheral repository family 候选表。 | 具体 trait / port 方法签名。 |
| exact read、stable lookup、page helper、freshness / subject helper、version / save pairing 承接表。 | adapter method、repository implementation、SQL / table / index 细节。 |
| `DistributionReadMaterial`、peripheral discovery、basis resolver / availability resolver / marketplace context adapter 的切口说明。 | resolver / mapper / builder contract 正文。 |
| `R7.13` 进入门禁。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否显式把 support summary、material、audit / lineage、relation truth 和 peripheral aggregate 切开 | 是。 |
| 是否保留 `application` 为唯一正式 port owner | 是。 |
| 是否把 `DistributionReadMaterial` / discovery resolver 留在后续模块 | 是。 |
| 是否形成 identity / version / freshness / subject lookup 候选 | 是。 |
| 是否形成 `R7.12` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.12` 写入或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.12 support / trace / relation / material repository port:再写入`;只允许写入 basis summary、external summary、consumption material、trace material、impact summary、audit trail、evidence lineage、relation、package、assembly repository family 候选表、identity / version / freshness / subject lookup 承接表、distribution/discovery/resolver 切口说明和 `R7.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.13`、Step 8 或后续 Step。

---

## R7.12 support / trace / relation / material repository port:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.12 support / trace / relation / material repository port:再写入`。 |
| 本模块目标 | 将 `R7.11` 形成的 support / material / relation / peripheral family 切分固化为 Step 7 承接记录,明确 basis / external summary、consumption / trace material、impact / audit / lineage、relation、package / assembly 的 repository 候选、lookup / freshness / subject helper 和后移切口,并收口 `R7.13` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | support / material / relation repository 候选表、identity / version / freshness / subject helper 承接关系、distribution/discovery/resolver 切口说明和 `R7.13` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. support / material / relation repository family 固化

| repository family 候选 | 承接对象 | primary owner | stable identity / exact read | stable lookup / page helper | write 语义 | 后续承接 |
|---|---|---|---|---|---|---|
| `FormalizationBasisSummaryRepository` | `FormalizationBasisSummary` | `application` 定义 port,`infra` 实现 | `FormalizationBasisSummaryRef` exact read | basis-source lookup by `(definition_ref, external_summary_ref)` 或 `(definition_ref, governance_basis_ref)` | versioned support summary save,不顺带做 basis resolver | Step 9 formalization / inbound basis flow;Step 11 basis persistence |
| `ExternalSourceSummaryRepository` | `ExternalSourceSummary` | `application` 定义 port,`infra` 实现 | `ExternalSourceSummaryRef` exact read | `external_source_ref` lookup;acceptance / definition-scoped page helper | versioned support summary save,不顺带做 external resolver / archive lookup | Step 9 external summary flow;Step 11 summary persistence |
| `MethodAssetConsumptionMaterialRepository` | `MethodAssetConsumptionMaterial` | `application` 定义 port,`infra` 实现 | `MethodAssetConsumptionMaterialRef` exact read | `(formal_version_ref, consumption_context_ref)` resolution;page by context / version | versioned material save,显式承接 freshness / cursor,不改 formal version truth | Step 9 consumption query / refresh;Step 10 material freshness;Step 11 material persistence |
| `MethodAssetTraceMaterialRepository` | `MethodAssetTraceMaterial` | `application` 定义 port,`infra` 实现 | `MethodAssetTraceMaterialRef` exact read | `trace_subject_ref` lookup / page;source-object / freshness helper | versioned material save,不顺带追加 audit trail | Step 9 trace query / refresh;Step 10 trace freshness;Step 11 material persistence |
| `ConsumptionImpactSummaryRepository` | `ConsumptionImpactSummary` | `application` 定义 port,`infra` 实现 | `ConsumptionImpactSummaryRef` exact read | `impact_source_ref` lookup;pending / unknown page by version 或 context | versioned support summary save,保留 explicit unknown / pending | Step 9 impact flow;Step 10 impact state;Step 11 summary persistence |
| `MethodAssetAuditTrailRepository` | `MethodAssetAuditTrail` | `application` 定义 port,`infra` 实现 | `MethodAssetAuditTrailRef` exact read | `audit_subject_ref` lookup;subject page helper | versioned trail save,append-only entry stream 后移单列 | Step 9 audit flow;Step 11 audit persistence;Step 15 audit observability |
| `MethodAssetEvidenceLineageRepository` | `MethodAssetEvidenceLineage` | `application` 定义 port,`infra` 实现 | `MethodAssetEvidenceLineageRef` exact read | `trace_subject_ref` lookup;external / basis linked page helper | versioned lineage save,不替代 evidence archive / report | Step 9 lineage flow;Step 11 lineage persistence;Step 15 lineage observability |
| `MethodAssetRelationRepository` | `MethodAssetRelation` | `application` 定义 port,`infra` 实现 | `MethodAssetRelationRef` exact read | endpoint pair、formal version context、distribution context list helper | versioned relation truth save / supersede pairing,不顺带做 distribution material build | Step 9 relation flow;Step 10 relation state;Step 11 relation persistence |
| `MethodPackageRepository` | `MethodPackage` | `application` 定义 port,`infra` 实现 | `MethodPackageRef` exact read | context / member page helper | versioned peripheral aggregate save,不替代 package view adapter | Step 9 package flow;Step 10 peripheral state;Step 11 package persistence |
| `MethodSetAssemblyRepository` | `MethodSetAssembly` | `application` 定义 port,`infra` 实现 | `MethodSetAssemblyRef` exact read | package / member scope page helper | versioned peripheral aggregate save,不替代 discovery resolver | Step 9 assembly flow;Step 10 peripheral state;Step 11 assembly persistence |

当前固定口径：

- `application` 仍是唯一正式 port owner,`infra` 只实现这些 family
- basis / external / impact 是 support summary family,不能退回 core truth repository
- consumption / trace 是 read material family,不能在 Query 缺失时现场创建
- audit / lineage 是 body-free support aggregate,但不等于 raw stream / report store
- relation 是 support truth,package / assembly 是 peripheral aggregate,都不得回流 core truth family

### 3. identity / version / freshness / subject helper 承接关系

| family | exact identity | version 来源 | stable lookup / page | freshness / subject / cursor helper | save pairing | 禁止事项 |
|---|---|---|---|---|---|---|
| basis summary | `basis_summary_ref` | exact read 或 basis-source lookup item version | definition + basis source lookup;history / supersede helper | 不使用 raw event body / governance execution body 当 helper | support summary only | 不从治理正文、外部正文、payload 文本反推 identity。 |
| external summary | `external_summary_ref` | exact read 或 source lookup item version | `external_source_ref` lookup;acceptance page by definition / filter | summary digest / acceptance marker 只是 support 线索 | support summary only | 不从 URL、artifact path、provider payload 反推 source identity。 |
| consumption material | `consumption_material_ref` | exact read 或 resolution lookup item version | `(formal_version_ref, consumption_context_ref)` resolution;page by context / version | `source_cursor_ref`、material freshness marker | material only | Query 不创建、不刷新、不扫描下游 truth。 |
| trace material | `trace_material_ref` | exact read 或 subject page item version | `trace_subject_ref` lookup / page | `source_cursor_ref`、trace freshness marker | material only | 不从字符串、旧对象名、artifact path、private map 反推 subject。 |
| impact summary | `impact_summary_ref` | exact read 或 source lookup / page item version | `impact_source_ref` lookup;pending / unknown page | unknown / pending 只能显式保留 | support summary only | 不把 unknown / pending 折叠成 no-effect。 |
| audit trail | `audit_trail_ref` | exact read 或 subject lookup item version | `audit_subject_ref` lookup;subject page | actor / reason / trace refs 只作 body-free line | versioned trail only | 不靠 raw log、telemetry、request body 生成 identity。 |
| evidence lineage | `evidence_lineage_ref` | exact read 或 subject lookup / page item version | `trace_subject_ref` lookup;linked page helper | external / basis / trace refs 只作 body-free linkage | versioned lineage only | 不用 evidence body、archive body、report body 定位 lineage。 |
| relation truth | `relation_ref` | exact read 或 endpoint list item version | endpoint pair、formal version、distribution context list helper | context 只是 lookup helper,不是新 truth owner | relation truth only | 不从 runtime graph、recommendation、listing 反推 relation。 |
| package | `package_ref` | exact read 或 context / member list item version | context / member page helper | marketplace context 只是读取线索 | peripheral aggregate only | 不用 ranking、交易态、安装态、UI state 支撑 identity。 |
| assembly | `method_set_assembly_ref` | exact read 或 package / member list item version | package / member scope page helper | adoption / discovery 线索后移 resolver | peripheral aggregate only | 不用组织运行 truth、安装 / 履约状态补口。 |

### 4. cross-family 切口说明

| 切口 | 当前结论 | 后续模块 |
|---|---|---|
| basis resolver | `FormalizationBasisSummaryRepository` 只保存 / 读取本地 basis summary,不负责把 governance / external basis 解析成可用输入。 | `R7.13` resolver / mapper / builder port |
| availability resolver | `MethodAssetConsumptionMaterialRepository` 只承接 formal version -> context 下已存在 material 的 resolution / freshness,不负责 availability policy。 | `R7.13` resolver / mapper / builder port |
| safe diagnostic adapter | trace / impact / audit / lineage repository 不生成 degraded / diagnostic marker,只回传正式对象与稳定读取面。 | `R7.13` resolver / mapper / builder port |
| distribution material | `MethodAssetRelationRepository` 不构建 `DistributionReadMaterial`,只提供 relation / context 读取锚点。 | `R7.13` / `R7.15` distribution material adapter / builder |
| peripheral discovery | `MethodPackageRepository` / `MethodSetAssemblyRepository` 不拥有 `GetPeripheralDiscoveryContext` 或 view body。 | `R7.13` resolver / builder 或 `R7.17` maintenance / runtime |
| raw audit entry / history stream | `MethodAssetAuditTrailRepository` 只承接 trail aggregate,不承接 raw entry append stream、history record 或 report body。 | `R7.15` / `R7.17` / Step 11 / Step 15 |

因此本轮明确否定几种错误合并：

- `FormalizationBasisSummaryRepository` 顺带做 basis resolver
- `MethodAssetConsumptionMaterialRepository` 顺带做 availability policy / Query fallback creation
- `MethodAssetTraceMaterialRepository` 顺带做 audit append 或 safe diagnostic 生成
- `MethodAssetRelationRepository` 顺带生成 `DistributionReadMaterial`
- `MethodPackageRepository` / `MethodSetAssemblyRepository` 顺带做 discovery context / marketplace adapter

### 5. `R7.13` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 policy / resolver / mapper / builder port,重点是 basis、read decision、degraded decision、marker、diagnostic、builder 来源接缝。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.12` 固化的 support / material / relation repository family、lookup / freshness / subject helper 和 resolver / discovery / distribution 切口。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写 support / material / relation / peripheral repository 承接记录 | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否明确 distribution / discovery / resolver 仍后移 | 是。 |
| 是否形成 exact identity / version / freshness / subject helper 承接表 | 是。 |
| 是否形成 `R7.13` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.13` 或 Step 8 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.13 policy / resolver / mapper / builder port:先思考`;只允许思考 basis、read decision、degraded decision、marker、diagnostic、builder 来源接缝,并承接 `R7.12` 已固定的 repository family 和切口;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.14`、Step 8 或后续 Step。

---

## R7.13 policy / resolver / mapper / builder port:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.13 policy / resolver / mapper / builder port:先思考`。 |
| 本模块目标 | 在 `R7.12` 已固定的 support / material / relation repository family 基础上,裁决哪些能力必须以 resolver / mapper / builder / policy diagnostic seam 继续闭口,从而为 `MethodAssetReadDecision`、`MethodAssetDegradedDecision`、formalization / integrity / composition diagnostic、distribution read material 和 peripheral discovery context 提供正式来源。 |
| 当前状态 | completed |
| 当前允许 | 只思考 seam family、owner、字段来源、marker 来源、diagnostic 来源、builder 来源、切口和 `R7.14` 写入边界。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. `R7.12` 承接输入与本轮必须闭口的问题

| 承接输入 | 当前问题 | `R7.13` 必须裁决的 seam |
|---|---|---|
| `FormalizationBasisSummaryRepository` 只保存 / 读取本地 basis summary | formalization / eligibility / basis pending query 仍需要“如何把本地 basis summary、external summary、governance basis ref 组装成可判断输入”的正式来源。 | basis resolver seam |
| `MethodAssetConsumptionMaterialRepository` 只承接现有 material exact read / resolution | availability query、context resolution 和 boundary constrained / unavailable 不能由 repository 自行决定,也不能现场造 material。 | availability resolver seam |
| `MethodAssetReadDecision` / `MethodAssetDegradedDecision` 已在 Step 6 闭口为 helper 对象 | read subject、visibility marker、freshness marker、degraded marker、safe diagnostic 和 follow-up hint 仍缺正式输入 owner。 | query read resolver + degraded / diagnostic mapper seam |
| Step 5 / Step 2 已声明多类 policy diagnostic query | eligibility、guard、integrity、composition、external boundary diagnostic 需要由 domain policy + repository / summary 输入装配,不能让 Query service 直接拼 public surface。 | policy diagnostic builder seam |
| `MethodAssetRelationRepository` 明确不生成 `DistributionReadMaterial` | relation truth、distribution ref、context 与 availability hint 之间仍需 builder。 | distribution material builder seam |
| `MethodPackageRepository` / `MethodSetAssemblyRepository` 明确不拥有 discovery context / view body | package / assembly / marketplace context / external summary 仍需 body-free discovery context 组装。 | peripheral discovery builder seam |
| Step 5 已预告 `marketplace context ref adapter` | peripheral discovery 允许读取 typed context ref,但不得直接暴露 listing / order / install / fulfillment 语义。 | marketplace context ref resolver seam |

### 3. seam family 准入裁决

| seam family | 是否进入 `R7.14` | primary owner | 主要输入来源 | 本轮裁决 |
|---|---|---|---|---|
| `FormalizationBasisResolverPort` | 是 | `application` 定义,`infra` 实现 | `FormalizationBasisSummaryRepository`;`ExternalSourceSummaryRepository`;governance / external typed basis refs;`FormalizationEligibilityRule` 需要的 safe summary | basis resolver 必须独立于 basis summary repository。它只返回 body-free basis resolution / pending / rejected 输入,不保存 summary,不读取治理执行正文。 |
| `MethodAssetPolicyDiagnosticBuilderPort` | 是 | `application` 定义,`infra` 可实现外部补充读取,但 domain policy 仍在 `domain` | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule`;以及 basis / material / relation / package support summaries | eligibility、boundary、integrity、external body 和 composition diagnostic 必须由独立 builder 装配;Query service 只能消费 builder 输出,不能自己拼 diagnostic。 |
| `MethodAssetConsumptionAvailabilityResolverPort` | 是 | `application` 定义,`infra` 实现 | `MethodAssetConsumptionMaterialRepository`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;formal version / context refs | availability resolver 负责“已有 material 如何被解释为 ready / stale / unavailable / boundary constrained”,但不创建 material,不扫描下游运行 truth。 |
| `MethodAssetQueryReadResolverPort` | 是 | `application` 定义,`infra` 实现本地 lookup / view helper | typed selector ref、loaded view / material subject、repository lookup、policy / boundary marker | read resolver 必须独立提供 read subject / read source / visibility / scope / freshness 的正式 resolution summary,Query service 不得从 raw id、路由或字符串反推。 |
| `MethodAssetDegradedDecisionMapperPort` | 是 | `application` 定义,`infra` 为 safe diagnostic / adapter availability 提供输入 | policy marker、material freshness、availability resolution、`MethodAssetInfraSafeDiagnostic`、partial / unavailable safe summary | degraded mapper 负责把正式 marker / safe diagnostic / unavailable reason 映射成 `MethodAssetDegradedDecision` 输入;它不做自动 repair,不直接暴露 raw error。 |
| `DistributionReadMaterialBuilderPort` | 是 | `application` 定义,`infra` 实现 view / material adapter | `MethodAssetRelationRepository`;distribution refs;consumption boundary / context refs;safe availability marker | distribution material 需要独立 builder。relation repository 只给锚点,真正的 body-free material 组装后移到 builder seam。 |
| `PeripheralDiscoveryContextBuilderPort` | 是 | `application` 定义,`infra` 实现 peripheral view / summary adapter | `MethodPackageRepository`;`MethodSetAssemblyRepository`;package / assembly view support material;distribution context refs;external summary refs | discovery context 必须由独立 builder 组装,返回 body-free discovery summary / package refs / assembly refs;不得进入 listing、价格、安装或履约正文。 |
| `MarketplaceContextRefResolverPort` | 是,但只作为 peripheral discovery 子 seam | `application` 定义,`infra` 实现 | `MarketplaceContextRef`;distribution context refs;external summary / source refs | 允许把 typed marketplace context ref 解析成 body-free context summary 或 unresolved / unavailable 结果,但它不是 package repository,也不是 marketplace transaction adapter。 |

当前结论:

- `policy / resolver / mapper / builder` 在本仓不是一组杂项 port,而是 Step 6 helper 和 `R7.12` repository family 之间的正式中继层。
- `application` 仍是唯一 port owner;`domain` 继续只提供 policy / guard / invariant;`infra` 只实现 resolver / mapper / builder 所需的本地 lookup 或 external body-free adapter。
- `Query`、maintenance、peripheral 和 formalization 读取面都必须经过这些 seam,不得让 repository、entry 或 protocol DTO 越位承担装配责任。

### 4. 字段来源 / marker 来源 / diagnostic 来源 / builder 来源规则

| 来源轴 | 允许的正式来源 | 禁止捷径 | 后续承接 |
|---|---|---|---|
| basis resolution | 本地 `FormalizationBasisSummary`;`ExternalSourceSummary`;governance / external typed basis ref;safe pending / rejection reason | 不得读取治理执行正文、标准全文、artifact body、provider payload 或旧 snapshot/fingerprint 文本。 | `R7.14` basis resolver family 表;Step 9 formalization / basis pending flow |
| policy diagnostic | domain policy / guard 对象 + repository exact read / stable lookup + safe reason / marker | 不得把 Query service、DTO assembler、错误字符串、配置矩阵或审批过程当 diagnostic 来源。 | `R7.14` policy diagnostic builder family;Step 8 diagnostic surface |
| read subject / visibility / scope / freshness | typed selector ref、loaded view/material subject、stable lookup summary、policy / boundary marker、freshness marker | 不得从 route param、raw id、字符串前缀、private map、UI state 或 external payload 反推。 | `R7.14` read resolver family;Step 8 query surface;Step 9 query flow |
| degraded marker / unavailable reason / safe diagnostic | policy marker、availability resolution summary、material freshness / partial marker、`MethodAssetInfraSafeDiagnostic`、safe follow-up hint | 不得从 `ApplicationError` 文本、stack trace、provider body、SQL error、debug dump 或 fake 约定分类。 | `R7.14` degraded mapper family;Step 12 error / degraded 口径 |
| availability resolution | existing consumption material、formal version、consumption context、boundary / guard judgement、adapter availability summary | 不得在 Query 现场创建 material、猜测 downstream state、使用安装态 / 运行态 / UI state 补口。 | `R7.14` availability resolver family;Step 9 consumption query / refresh |
| distribution material build | relation truth、distribution ref、context refs、availability marker、body-free relation / package / assembly summary | 不得读取 runtime graph、推荐结果、marketplace listing、artifact body、download URL 或 package body。 | `R7.14` distribution builder family;Step 8 distribution surface |
| peripheral discovery build | package / assembly aggregate、distribution context、marketplace context summary、external summary refs、safe unavailability marker | 不得把 listing、价格、订单、安装、履约、组织运行配置或 UI 数据写入 discovery context。 | `R7.14` peripheral discovery family;Step 8 peripheral query surface |

### 5. owner 与切口裁决

| 切口 | 当前结论 | 明确禁止 |
|---|---|---|
| basis summary repo vs basis resolver | repository 只保留 local summary truth / support summary;resolver 才负责把多个 basis 输入闭成 formalization / eligibility 可消费 summary。 | repository 顺带做 governance / external basis 解析,或 resolver 直接保存 basis summary。 |
| domain policy vs policy diagnostic builder | `FormalizationEligibilityRule`、`DefinitionUseBoundaryGuard`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`ExternalBodyBoundaryRule`、`PackageCompositionRule` 只给出 judgement 边界;builder 才装配 query/read 可消费 diagnostic summary。 | domain policy 直接依赖 repository / adapter,或 Query service 直接拼 diagnostic DTO。 |
| material repo vs availability resolver | material repository 只读取 / 保存已存在 material 与 freshness;availability resolver 才解释 ready / stale / unavailable / boundary constrained。 | repository 现场创建 fallback material,或 availability resolver 越权修改 formal version / boundary truth。 |
| read resolver vs query service | read resolver 提供 read subject / visibility / source / freshness resolution;query service 只消费正式 summary 并形成 helper decision。 | query service 解析字符串、id、UI metadata 或 private map 造 read subject / marker。 |
| degraded mapper vs error handling | degraded mapper 只复制正式 marker / safe diagnostic / hint,把它们接到 `MethodAssetDegradedDecision`。 | 通过 raw error / stack trace / provider body 推导 public degraded kind,或直接触发 repair / retry / job。 |
| relation repo vs distribution builder | relation repository 只给 relation truth / endpoint / context lookup;distribution material 由独立 builder 组装。 | 用 relation repository 顺带生成 distribution material、publisher candidate 或 marketplace context。 |
| package / assembly repo vs discovery builder | repository 只给 aggregate truth / lookup;builder 负责 discovery context body-free 组装。 | package repository 顺带做 discovery context、listing、价格、安装或 transaction adapter。 |
| marketplace context resolver vs marketplace adapter | context resolver 只解析 typed context ref 和 safe summary,供 discovery builder 使用。 | 进入 listing、购买、安装、履约、支付或组织 runtime 交易语义。 |

### 6. `R7.14` 写入边界

| `R7.14` 允许写入 | `R7.14` 禁止写入 |
|---|---|
| basis resolver、policy diagnostic builder、availability resolver、read resolver、degraded mapper、distribution builder、peripheral discovery / marketplace context resolver 的正式 family 候选表。 | 具体 trait / port 方法签名、adapter method、repository contract 正文。 |
| 字段来源 / marker 来源 / diagnostic 来源 / builder 来源承接表。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| owner / cut-line / forbidden shortcut 表。 | external body、marketplace listing / order / install 细节、runtime binding 细节。 |
| `R7.15` 进入门禁。 | 正式 `03-详细设计.md`。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否承接 `R7.12` 的 repository family 和切口 | 是。 |
| 是否明确 basis / availability / read / degraded / distribution / discovery / marketplace context 的 seam family | 是。 |
| 是否写清字段 / marker / diagnostic / builder 来源规则 | 是。 |
| 是否保持 `application` 为唯一 port owner | 是。 |
| 是否把 domain policy 与 repository / Query / DTO 切开 | 是。 |
| 是否形成 `R7.14` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.14`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.14 policy / resolver / mapper / builder port:再写入`;只允许写入 basis resolver、policy diagnostic builder、availability resolver、read resolver、degraded mapper、distribution builder、peripheral discovery / marketplace context resolver family 候选表、来源承接表、owner / cut-line 规则和 `R7.15` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.15`、Step 8 或后续 Step。

---

## R7.14 policy / resolver / mapper / builder port:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.14 policy / resolver / mapper / builder port:再写入`。 |
| 本模块目标 | 将 `R7.13` 已裁决的 basis / policy diagnostic / availability / read / degraded / distribution / discovery seam 固化为 Step 7 承接记录,明确 family 候选、输入主语、输出壳、owner、cut-line 和后续承接,并收口 `R7.15` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | resolver / mapper / builder family 候选表、来源承接表、cross-family ordering / cut-line 规则和 `R7.15` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. policy / resolver / mapper / builder family 固化

| family 候选 | 承接对象 / helper | primary owner | 正式输入主语 | 正式输出壳 | 非职责 | 后续承接 |
|---|---|---|---|---|---|---|
| `FormalizationBasisResolverPort` | `FormalizationBasisSummary`;formalization / eligibility input | `application` 定义 port,`infra` 实现 | 本地 basis summary、external summary、governance / external typed basis refs、safe basis pending / rejected reason | body-free basis resolution summary;basis pending / insufficient / rejected marker | 不保存 basis summary;不读取治理执行正文;不计算版本号 | Step 8 basis / eligibility query shell;Step 9 formalization precheck / basis pending flow;Step 11 basis sidecar persistence |
| `MethodAssetPolicyDiagnosticBuilderPort` | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule` | `application` 定义 port,`infra` 只补正式读取输入 | domain policy / guard、support summary、relation / package aggregate、本地 safe reason / marker | body-free diagnostic summary;safe violation / pending / unknown reason refs;safe remediation / follow-up hint | 不直接执行业务 flow;不返回规则矩阵;不读取 raw external body | Step 8 diagnostic query shell;Step 9 query / command diagnostic branch;Step 12 error / recovery |
| `MethodAssetConsumptionAvailabilityResolverPort` | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | `application` 定义 port,`infra` 实现 | formal version、consumption context、existing material、boundary judgement、availability fallback summary | body-free availability resolution;ready / stale / unavailable / boundary constrained marker | 不创建 material;不扫描 downstream runtime truth;不修改 boundary / formal version truth | Step 8 consumption availability query shell;Step 9 consumption read / refresh flow;Step 10 material availability state |
| `MethodAssetQueryReadResolverPort` | `MethodAssetReadDecision` 输入 | `application` 定义 port,`infra` 实现 | typed selector ref、loaded view / material / summary subject、stable lookup / scope relation、visibility / boundary marker、freshness marker | body-free read resolution summary,至少承接 read_subject、read_source、visibility / boundary、scope / context、freshness | 不拼 public DTO;不执行 query flow;不直接发 degraded result | Step 8 query protocol shell;Step 9 query flow;Step 10 read disposition / degraded 状态输入 |
| `MethodAssetDegradedDecisionMapperPort` | `MethodAssetDegradedDecision` 输入 | `application` 定义 port,`infra` 为 safe diagnostic / availability 提供输入 | visibility / boundary marker、availability resolution、material freshness / partial marker、`MethodAssetInfraSafeDiagnostic`、safe follow-up hint | body-free degraded mapping summary;degraded kind、marker ref、safe diagnostic ref、follow-up hint ref | 不从 raw error 文本分类;不触发 repair / retry / job;不保存 diagnostic truth | Step 8 degraded / unavailable shell;Step 9 degraded branch;Step 12 error / recovery;Step 15 observability |
| `DistributionReadMaterialBuilderPort` | `DistributionReadMaterial` | `application` 定义 port,`infra` 实现 view / material adapter | relation truth、distribution ref、consumption context / boundary、availability marker、relation / package / assembly body-free summaries | body-free distribution read material;context-safe relation distribution summary | 不修改 relation truth;不进入 publisher / handoff;不读取 artifact body / marketplace listing | Step 8 distribution query shell;Step 9 relation / distribution read flow;Step 11 distribution material persistence |
| `PeripheralDiscoveryContextBuilderPort` | peripheral discovery context | `application` 定义 port,`infra` 实现 | package / assembly aggregate、distribution context、external summary refs、marketplace context summary、safe unavailability marker | body-free peripheral discovery context summary;package / assembly refs;safe discovery unavailability | 不返回 listing、价格、订单、安装、履约正文;不改变 package / assembly truth | Step 8 peripheral query shell;Step 9 discovery read flow;Step 17 maintenance / runtime follow-up |
| `MarketplaceContextRefResolverPort` | `MarketplaceContextRef` 读取支撑 | `application` 定义 port,`infra` 实现 | `MarketplaceContextRef`;distribution context refs;external summary / source refs | body-free marketplace context summary 或 unresolved / unavailable safe summary | 不成为 marketplace transaction / install adapter;不持有 listing truth | Step 8 peripheral discovery shell;Step 9 discovery flow;Step 14 config / external dependency binding |

当前固定口径:

- `application` 仍是唯一正式 port owner;`infra` 只实现 resolver / mapper / builder family。
- `domain` policy / guard 只定义 judgement boundary,不直接定义 repository / adapter seam。
- resolver / mapper / builder 的职责是把 Step 6 helper 和 `R7.12` repository family 之间的正式来源闭口,不是替代 repository 或 protocol。

### 3. family 输入 / 输出 / 来源承接关系

| family | identity / selector 输入 | marker / diagnostic 来源 | builder / resolution 输出重点 | save / read pairing | 禁止事项 |
|---|---|---|---|---|---|
| basis resolver | `definition_ref`;`catalog_entry_ref`;`basis_summary_ref`;governance / external basis typed ref | basis pending、basis rejected、basis insufficient safe reason | eligibility / formalization 可消费的 basis resolution summary | 只读取 basis / external summary family;若需保存,回到对应 repository family | 不从标准正文、artifact 正文、审批记录或旧 snapshot 文本反推 basis。 |
| policy diagnostic builder | policy / guard / rule ref;相关 truth / summary refs | violation / pending / unknown / constrained marker;safe reason;follow-up hint | diagnostic summary,供 Query / command precheck / degraded 分支复制 | exact read 或 stable lookup 后装配 diagnostic,不创建新 truth | 不把 diagnostic 变成 DTO body 生成器、错误码工厂或配置矩阵导出器。 |
| availability resolver | `formal_version_ref`;`consumption_context_ref`;existing `consumption_material_ref` | availability marker、boundary constrained marker、stale marker、unavailable safe reason | ready / stale / unavailable / constrained resolution summary | exact read 或 resolution lookup 命中时返回 stable resolution;缺失只返回 safe absence / unavailable | 不造 material;不读取下游安装态 / 运行态 / UI state。 |
| query read resolver | typed selector ref、loaded view/material subject、trace / audit / relation / package / assembly refs | visibility marker、boundary marker、freshness marker、safe absence reason | read subject / read source / scope / visibility / freshness resolution summary | 依赖 repository exact read / lookup 和正式 marker,为 `MethodAssetReadDecision` 提供输入 | 不从 raw id、route、private map、字符串前缀反推 subject / scope。 |
| degraded mapper | `read_decision_ref`;availability resolution;freshness / partial marker;`MethodAssetInfraSafeDiagnostic` | degraded marker、safe diagnostic、follow-up hint、unavailable reason | `MethodAssetDegradedDecision` 所需 mapping summary | 只复制正式 marker / diagnostic / hint 到 degraded helper 输入 | 不从 `ApplicationError` 文本、stack trace、SQL error、provider body 推断 degraded kind。 |
| distribution builder | `relation_ref`;`distribution_ref`;context refs;relation / package / assembly support summary | availability marker、boundary marker、freshness hint | body-free `DistributionReadMaterial` summary | relation truth / context lookup -> distribution material read surface | 不进入 graph 算法、推荐、marketplace listing 或 package body。 |
| peripheral discovery builder | `package_ref`;`method_set_assembly_ref`;distribution context;marketplace context summary | discovery unavailable / stale / safe absence marker | body-free discovery context summary、package / assembly refs、safe subset | package / assembly aggregate + marketplace context summary -> discovery read surface | 不返回 listing、价格、订单、安装、履约、UI 数据。 |
| marketplace context resolver | `marketplace_context_ref`;distribution context refs | unresolved / unavailable / safe subset marker | body-free marketplace context summary | 只作为 discovery builder 输入,不单独承担 query body | 不成为交易、安装、购买、结算、履约 adapter。 |

### 4. cross-family ordering 与调用切口

| 顺序 | 当前规则 | 原因 |
|---|---|---|
| basis 先于 eligibility diagnostic | formalization / eligibility diagnostic 必须先拿到 basis resolution summary,再交给 policy diagnostic builder。 | 防止 Query / command precheck 在 basis 未闭口时现场拼 pending / rejected 理由。 |
| availability 先于 read degraded | consumption / distribution / peripheral 读取遇到 material 时,先由 availability resolver 解释 ready / stale / unavailable,再交给 read resolver / degraded mapper。 | 防止 repository 直接决定 degraded kind。 |
| read resolver 先于 degraded mapper | query family 必须先获得 read subject / source / visibility / freshness resolution,再决定是 found、safe absence、not visible 还是 degraded。 | 防止 Query service 直接从缺失对象或错误文本拼 degraded surface。 |
| policy diagnostic builder 不替代 degraded mapper | diagnostic 只解释 boundary / integrity / composition / eligibility judgement;degraded mapper 只解释 unavailable / stale / partial / diagnostic 映射。 | 避免把 policy diagnostic 误用为统一错误出口。 |
| distribution builder 晚于 relation lookup | distribution material 建立在已闭口 relation truth / context lookup 之上。 | 防止 distribution material 反向成为 relation truth owner。 |
| discovery builder 晚于 marketplace context resolver | marketplace context 只能先解析为 body-free summary,再参与 discovery builder。 | 防止 peripheral discovery 直接耦合 marketplace adapter / transaction 语义。 |

### 5. cut-line 与错误合并否定

| 错误合并 | 当前否定结论 | 正确归属 |
|---|---|---|
| `FormalizationBasisSummaryRepository` 顺带做 basis resolution + eligibility diagnostic | repository 只保留 local basis summary 读取 / 保存。 | basis resolver + policy diagnostic builder |
| `MethodAssetConsumptionMaterialRepository` 顺带做 availability fallback 或 Query degraded mapping | repository 只给 material exact read / lookup。 | availability resolver + read resolver + degraded mapper |
| Query service 直接从 selector / id / route / missing object 拼 read subject / visibility / degraded | Query service 只能消费正式 resolution / mapping summary。 | query read resolver + degraded mapper |
| domain policy 直接输出 public diagnostic surface | domain policy 只给 judgement boundary。 | policy diagnostic builder |
| `MethodAssetRelationRepository` 顺带生成 `DistributionReadMaterial` 或 publisher candidate | relation repository 只承接 truth / lookup。 | distribution builder;publisher 后移 `R7.15` |
| `MethodPackageRepository` / `MethodSetAssemblyRepository` 顺带做 discovery context / marketplace adapter | repository 只承接 aggregate truth / lookup。 | discovery builder + marketplace context resolver |
| `MethodAssetInfraSafeDiagnostic` 直接变成 public DTO 或 raw error passthrough | safe diagnostic 只能作为 degraded mapper / error recovery 的 redacted 输入。 | degraded mapper + Step 12 error / recovery |

### 6. Step 8~15 承接摘要

| 后续 Step | 承接内容 | 暂停条件 |
|---|---|---|
| Step 8 | Query / diagnostic / degraded / distribution / peripheral discovery protocol 只能复制这些 family 输出的 body-free summary / marker / reason。 | DTO 试图绕过 family 直接复制 repository truth、raw diagnostic 或 raw payload。 |
| Step 9 | formalization、consumption、query、relation、peripheral flow 必须按 basis -> availability -> read -> degraded / diagnostic -> builder 的顺序调用。 | flow 现场生成 marker / diagnostic / discovery context / distribution material。 |
| Step 10 | read disposition、availability、degraded、integrity / composition diagnostic 可作为状态输入,但不直接成为 truth state owner。 | 把 resolver / builder 输出误当持久 truth state。 |
| Step 11 | persistence 只为对应 summary / material / aggregate truth family 定义保存面;resolver / mapper / builder 自身不额外成为新 truth store。 | 为 resolver / mapper / builder 新增私有持久 schema 却无上游对象 owner。 |
| Step 12 | error / recovery 复用 degraded mapper、policy diagnostic builder、availability resolver 的 safe summary / hint / reason。 | 需要 raw exception、provider body、SQL detail 才能闭口。 |
| Step 14 / 15 | runtime binding、safe diagnostic policy、external dependency binding、telemetry 只作为这些 family 的注入或观测来源。 | 把 config / observability 反向提升为业务 judgement owner。 |

### 7. `R7.15` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 inbound source、event candidate publisher、handoff、external body-free adapter 接缝,并承接 `R7.14` 已固定的 resolver / mapper / builder family。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.14` 已固化的 basis / availability / read / degraded / distribution / discovery family 作为前置输入,不得越过它们直接写 inbound / publisher / handoff。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 8 组 resolver / mapper / builder family 候选表 | 是。 |
| 是否写入输入 / 输出 / marker / diagnostic 来源承接关系 | 是。 |
| 是否写清 cross-family ordering 与 cut-line | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否形成 Step 8~15 承接摘要 | 是。 |
| 是否形成 `R7.15` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.15`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.15 inbound / outbound / publisher / handoff port:先思考`;只允许思考 inbound source、event candidate publisher、handoff、external body-free adapter 接缝,并承接 `R7.14` 已固定的 resolver / mapper / builder family;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.16`、Step 8 或后续 Step。

---

## R7.15 inbound / outbound / publisher / handoff port:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.15 inbound / outbound / publisher / handoff port:先思考`。 |
| 本模块目标 | 在 `R7.14` 已固定的 resolver / mapper / builder family 基础上,裁决 inbound source、external body-free source adapter、event candidate publisher、collaboration handoff 和 target registry seam,为 `MethodAssetInboundIntakeDecision`、`MethodAssetEventCandidateAssembly`、`MethodAssetPublisherBindingState`、`MethodAssetHandoffBindingState` 和 worker / jobs entry 承接正式 port 来源。 |
| 当前状态 | completed |
| 当前允许 | 只思考 seam family、owner、body-free 输入、safe outcome、blocked / unavailable 来源、切口和 `R7.16` 写入边界。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. `R7.14` 承接输入与本轮必须闭口的问题

| 承接输入 | 当前问题 | `R7.15` 必须裁决的 seam |
|---|---|---|
| `MethodAssetInboundIntakeDecision` 已在 Step 6 闭口为 body-free helper | worker 是唯一 inbound owner,但目前还缺“什么是正式 inbound source 输入”和“如何把 envelope / source ref / schema / dedup / body-free marker 交给 application”的 port family。 | inbound source seam |
| `MethodAssetEventCandidateAssembly` 已在 Step 6 闭口为 candidate helper | event candidate 不是 delivery / outbox / topic / retry,但仍需要正式 publisher seam 承接 candidate publication boundary。 | event candidate publisher seam |
| `MethodAssetPublisherBindingState` / `MethodAssetHandoffBindingState` 已在 Step 6 闭口 | blocked / unavailable / target enabled / safe failure 需要正式 port 读取面与 outcome 壳,不能让 worker / jobs / fake runtime 现场猜。 | publisher / handoff registry seam |
| `ExternalSourceSummary` / `ExternalSourceRef` / `ArtifactArchiveRef` / body boundary violation 全部要求 body-free | external source / artifact / boundary 协作仍缺正式 adapter seam;不能从 provider payload、URL、path 或 raw body 反推。 | external body-free adapter seam |
| 02 已明确 publisher / handoff failure 不回滚 truth | 需要正式 publication / handoff outcome 口径,使 accepted truth 与 collaboration failure 解耦。 | publisher / handoff outcome seam |
| 02 已明确 inbound 结果只能形成 intake summary 或 command handoff hint | inbound source seam 必须把 handoff hint 视为 body-free 协作线索,不能直接创建 formal version、relation、package 或 job truth。 | inbound -> handoff hint seam |

### 3. seam family 准入裁决

| seam family | 是否进入 `R7.16` | primary owner | 主要输入来源 | 本轮裁决 |
|---|---|---|---|---|
| `MethodAssetInboundSourcePort` | 是 | `application` 定义,`infra` 实现,`worker` 调用 | source envelope summary、source event id、source system ref、schema / version、dedup key、trace context、body-free marker、typed external refs | inbound source port 只承接 body-free envelope / metadata / marker,输出 intake 可消费的 safe source summary 或 blocked / unsupported / malformed safe outcome,不得接触 raw payload。 |
| `ExternalBodyFreeSourceAdapterPort` | 是 | `application` 定义,`infra` 实现 | `ExternalSourceRef`;`ArtifactArchiveRef`;safe summary ref / digest;body boundary candidate ref;external basis related typed refs | external adapter 只返回 body-free summary / ref resolution / unavailable / invalid / unresolved safe outcome,不得返回 document body、archive 包体、provider payload 或认证信息。 |
| `MethodAssetEventCandidatePublisherPort` | 是 | `application` 定义,`infra` 实现,`worker` / `jobs` 触发 | `MethodAssetEventCandidateAssembly`;accepted summary refs;publication boundary marker;publisher binding summary | publisher seam 只发布 candidate publication surface 或 stored candidate shell,返回 published / blocked / unavailable / failed safe outcome,不得现查 current truth 重建 payload。 |
| `MethodAssetCollaborationHandoffPort` | 是 | `application` 定义,`infra` 实现,`worker` / `jobs` 触发 | handoff target ref、trace / lineage / report / package-safe refs、handoff marker、safe diagnostic / follow-up hint | handoff seam 只准备 / 交付 body-free package / receipt / failure refs,不持有 package body,不反写本仓 truth。 |
| `MethodAssetCollaborationTargetRegistryPort` | 是 | `application` 定义,`infra` 实现 | publisher / handoff binding state、adapter availability、enabled target refs、safe target markers | registry seam 提供 enabled target、binding availability 和 blocked / unavailable safe summary,供 publisher / handoff flow 判断可用边界。 |

当前结论:

- inbound / publisher / handoff 不再被视为“entry 或 transport 细节”,而是 Step 7 必须正式闭口的 application port family。
- `worker` 和 `jobs` 只调用这些 port,不拥有 body-free source resolution、publication outcome 分类或 handoff failure mapping 真相源。
- external collaboration 一律 body-free;任何 raw body、archive content、provider payload、report body 都不得进入这些 seam 的输入或输出。

### 4. 来源规则与 safe outcome 规则

| 来源轴 | 允许的正式来源 | safe outcome 要求 | 禁止捷径 | 后续承接 |
|---|---|---|---|---|
| inbound source 输入 | source envelope summary、source system ref、source event id、schema / version、dedup key、trace context、body-free marker、typed external refs | accepted / ignored / rejected / handoff_required 只能以 safe summary / reason / hint 表达 | 不得把 webhook body、broker message、file body、archive body、URL path、route param 当作正式输入。 | `R7.16` inbound source family 表;Step 8 inbound shell;Step 9 consumer flow |
| external adapter resolution | typed `ExternalSourceRef`、`ArtifactArchiveRef`、safe summary ref / digest、body boundary candidate ref | resolved / unavailable / invalid / unresolved / pending 接口必须是 body-free typed outcome | 不得从 provider payload、认证信息、HTML/JSON body、storage path 或 fake private map 分类。 | `R7.16` external adapter family 表;Step 9 external flow;Step 11 external state persistence |
| publisher 输入 | event candidate assembly、accepted summary refs、publication boundary marker、publisher binding state、safe diagnostic | published / blocked / unavailable / failed outcome 必须由 port / adapter 直接给出 safe summary | 不得从 topic 名、HTTP status、异常字符串、transport code 或 current truth lookup 推断。 | `R7.16` publisher family 表;Step 8 event shell;Step 12 publication failure mapping |
| handoff 输入 | handoff target ref、body-free trace / lineage / report / package-safe refs、handoff marker、safe diagnostic / hint | prepared / delivered / blocked / unavailable / failed outcome 只能返回 package / receipt / failure ref 或 safe marker | 不得返回 handoff package body、archive body、report body、external write receipt body。 | `R7.16` handoff family 表;Step 9 handoff / report flow;Step 15 observability |
| target registry | publisher / handoff binding state、enabled target refs、adapter availability marker | enabled / disabled / blocked / unavailable 必须是 body-free availability / marker summary | 不得直接读取 config key、topic、URL、credential 或 runtime builder内部状态作为业务事实。 | `R7.16` target registry family 表;Step 14 config binding;Step 15 target observability |

### 5. owner 与切口裁决

| 切口 | 当前结论 | 明确禁止 |
|---|---|---|
| worker entry vs inbound source port | worker 只承接 runner / envelope 入口和 local context;真正的 inbound source resolution 由 `MethodAssetInboundSourcePort` 输出给 application intake decision。 | worker 直接拥有 source schema 解释、body-free 分类或 truth 创建。 |
| inbound source port vs external adapter | inbound source port 处理 envelope / source metadata / body-free marker;external adapter 处理 typed external ref / artifact ref 的 body-free resolution。 | 用 inbound source port 顺带读取 provider body 或用 external adapter 顺带解释 transport envelope。 |
| event candidate assembly vs publisher | `MethodAssetEventCandidateAssembly` 只组装 candidate 输入;publisher port 才处理 publication boundary 和 safe outcome。 | event assembly 直接等同 payload、topic、outbox record 或 delivery receipt。 |
| publisher vs handoff | publisher 负责 candidate publication surface;handoff 负责 archive / observability / downstream collaboration package / receipt。 | publisher 顺带做 handoff package,或 handoff 反向生成 event candidate。 |
| target registry vs config/runtime builder | registry 只暴露 enabled target / availability / blocked safe summary;具体 config key、secret、URL、topic、transport binding 仍后移 Step 14。 | registry 成为 config store、runtime builder 或 secret owner。 |
| collaboration failure vs truth mutation | publication / handoff failed 只影响 safe outcome、diagnostic、hint、marker,不得回滚 accepted truth。 | worker / jobs / fake runtime 因 transport failure 撤销已成立 truth。 |

### 6. `R7.16` 写入边界

| `R7.16` 允许写入 | `R7.16` 禁止写入 |
|---|---|
| inbound source、external body-free adapter、event candidate publisher、collaboration handoff、target registry 的正式 family 候选表。 | 具体 trait / port 方法签名、adapter method、repository contract 正文。 |
| body-free 输入面、safe outcome 面、blocked / unavailable 来源和 owner / cut-line 表。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| worker / jobs / application / infra 之间的协作边界和 `R7.17` 进入门禁。 | topic、payload schema、outbox、relay、receipt body、retry / dead letter 细节。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否承接 `R7.14` 的 resolver / mapper / builder family | 是。 |
| 是否明确 inbound / external adapter / publisher / handoff / registry 五组 seam family | 是。 |
| 是否写清 body-free 输入规则与 safe outcome 规则 | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否把 worker / jobs / infra / config 的边界切开 | 是。 |
| 是否形成 `R7.16` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.16`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.16 inbound / outbound / publisher / handoff port:再写入`;只允许写入 inbound source、external body-free adapter、event candidate publisher、collaboration handoff、target registry family 候选表、body-free 输入面、safe outcome 面、owner / cut-line 规则和 `R7.17` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.17`、Step 8 或后续 Step。

---

## R7.16 inbound / outbound / publisher / handoff port:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.16 inbound / outbound / publisher / handoff port:再写入`。 |
| 本模块目标 | 将 `R7.15` 已裁决的 inbound / external adapter / publisher / handoff / registry seam 固化为 Step 7 承接记录,明确 family 候选、body-free 输入面、safe outcome 面、owner、worker / jobs / infra / application 切口和后续承接,并收口 `R7.17` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | inbound / outbound / handoff family 候选表、输入 / 输出 / outcome 承接关系、cross-family ordering / cut-line 规则和 `R7.17` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. inbound / outbound / handoff family 固化

| family 候选 | 承接对象 / helper | primary owner | body-free 输入主语 | safe outcome 面 | entry / runtime 协作边界 | 非职责 | 后续承接 |
|---|---|---|---|---|---|---|---|
| `MethodAssetInboundSourcePort` | `MethodAssetInboundIntakeDecision` 输入 | `application` 定义 port,`infra` 实现,`worker` 调用 | source envelope summary、source system ref、source event id、schema / version、dedup key、trace context、body-free marker、typed external refs | accepted / ignored / rejected / handoff_required safe source summary;unsupported / malformed / blocked safe reason | `worker` 只把 local envelope / context 传入;application 决定 intake decision;fake / durable 必须共用同一 safe source surface | 不读取 raw payload;不创建 formal version、relation、package 或 job truth | Step 8 inbound protocol shell;Step 9 consumer flow;Step 13 inbound dedup / replay |
| `ExternalBodyFreeSourceAdapterPort` | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;body boundary candidate 支撑 | `application` 定义 port,`infra` 实现 | typed external source / artifact refs、safe summary ref / digest、body boundary candidate ref、external basis typed refs | resolved / unavailable / invalid / unresolved / pending safe resolution summary | `application` / `jobs` 消费 typed resolution;adapter availability / config binding 后移 Step 14 | 不返回 document body、archive body、provider payload、credential、URL/path truth | Step 8 external shell;Step 9 external summary / body boundary / refresh flow;Step 11 external state persistence |
| `MethodAssetEventCandidatePublisherPort` | `MethodAssetEventCandidateAssembly`;publication boundary | `application` 定义 port,`infra` 实现,`worker` / `jobs` 调用 | event candidate assembly、accepted summary refs、publication boundary marker、publisher binding state、safe diagnostic | published / blocked / unavailable / failed publication outcome,只含 body-free publication ref / failure reason / safe marker | `worker` / `jobs` 只驱动 candidate publication;application 不回查 current truth;fake / durable 必须共用 outcome 分类 | 不定义 topic、payload schema、outbox、relay、retry、dead letter、subscriber ack | Step 8 event shell;Step 9 publication flow;Step 12 publication failure mapping;Step 14 transport binding |
| `MethodAssetCollaborationHandoffPort` | archive / observability / downstream collaboration handoff | `application` 定义 port,`infra` 实现,`worker` / `jobs` 调用 | handoff target ref、trace / lineage / report-safe refs、handoff marker、safe diagnostic / follow-up hint、candidate package-safe refs | prepared / delivered / blocked / unavailable / failed outcome,只含 package ref、receipt ref、failure reason / marker | `jobs` / `worker` 可触发 handoff,但不得拥有 package body;application 只消费 body-free receipt / failure | 不返回 report body、archive package body、external write receipt body;不反写本仓 truth | Step 9 handoff / report flow;Step 12 blocked / unavailable mapping;Step 15 observability / audit;Step 17 implementation handoff |
| `MethodAssetCollaborationTargetRegistryPort` | publisher / handoff target availability | `application` 定义 port,`infra` 实现 | publisher / handoff binding state、enabled target refs、adapter availability marker、safe target marker | enabled / disabled / blocked / unavailable target summary | `application` 查询 target 可用性;`worker` / `jobs` 不直接读 config/runtime builder内部状态 | 不成为 config store、secret store、transport product owner | Step 9 target selection flow;Step 14 config binding;Step 15 target observability |

当前固定口径:

- `application` 仍是唯一正式 port owner;`infra` 只实现 inbound / publisher / handoff family。
- `worker` / `jobs` 是调用者和 runner 入口,不是 body-free source resolution、publication outcome 或 handoff failure mapping 的真相源。
- external / collaboration 结果一律 body-free;safe outcome 只能含 summary、ref、marker、reason、hint。

### 3. 输入 / 输出 / outcome 承接关系

| family | identity / envelope 输入 | body-free 输出重点 | safe outcome 分类 | save / read pairing | 禁止事项 |
|---|---|---|---|---|---|
| inbound source | source envelope summary、source event id、source system ref、schema / version、dedup key、typed external refs | intake source summary;handoff hint seed;safe reason / blocked marker | accepted / ignored / rejected / handoff_required / malformed / unsupported | 与 `MethodAssetInboundIntakeDecision`、`MethodAssetStoredOperationResult`、worker entry result state 配对 | 不把 raw webhook、broker message、archive body、URL path 当正式输入。 |
| external adapter | `ExternalSourceRef`;`ArtifactArchiveRef`;safe summary digest;body boundary candidate ref | source / artifact / basis resolution summary | resolved / unavailable / invalid / unresolved / pending | 与 external summary / ref repository family、body boundary diagnostic、maintenance refresh 配对 | 不返回 provider payload、认证信息、HTML/JSON body、storage path。 |
| event candidate publisher | event candidate assembly、publication boundary marker、publisher binding state | publication ref 或 safe publication failure summary | published / blocked / unavailable / failed | 与 `MethodAssetPublisherBindingState`、worker publisher entry、stored result effect summary 配对 | 不回查 current truth 重建 payload;不把 candidate 变 delivery receipt。 |
| collaboration handoff | target ref、trace / lineage / report-safe refs、handoff marker、safe diagnostic / hint | package ref、receipt ref、failure ref / marker | prepared / delivered / blocked / unavailable / failed | 与 `MethodAssetHandoffBindingState`、job / worker result state、handoff marker / report boundary 配对 | 不返回 package body、report body、archive body、external write receipt body。 |
| target registry | target ref、binding state、availability marker、enabled target set | enabled target summary、blocked / unavailable target marker | enabled / disabled / blocked / unavailable | 与 publisher / handoff binding state、runtime assembly / config binding 读取面配对 | 不解析 config key、URL、topic、credential 或 runtime builder 私有状态。 |

### 4. cross-family ordering 与调用切口

| 顺序 | 当前规则 | 原因 |
|---|---|---|
| inbound source 先于 intake decision | worker / consumer flow 必须先把 body-free envelope 交给 inbound source port,再由 application 形成 intake decision。 | 防止 worker 直接解释 schema / body-free 分类并越权生成业务结果。 |
| external adapter 先于 external accepted / rejected branch | typed external ref / artifact ref 若需验证或解析,必须先走 external body-free adapter,再由 application 判断 accepted / pending / invalid。 | 防止 flow 从 URL/path/payload 字符串现场推断 resolution。 |
| event assembly 先于 publisher | candidate 必须先由 `MethodAssetEventCandidateAssembly` 闭口,再交给 publisher port。 | 防止 publisher 自行补 subject、summary、payload 事实。 |
| target registry 先于 publisher / handoff attempt | target 是否 enabled / blocked / unavailable 必须先由 registry 给出 safe summary。 | 防止 worker / jobs / fake runtime 直接读 config 状态猜 target 可用性。 |
| handoff 晚于 target registry 与 candidate / trace summary | handoff 只消费已成立的 body-free refs / markers / hints。 | 防止 handoff 反向承担 query / report load 或 truth 读取职责。 |
| publication / handoff failed 不回滚 truth | safe outcome 只进入 result、diagnostic、follow-up hint。 | 防止 transport / collaboration failure 扭曲业务 truth owner。 |

### 5. cut-line 与错误合并否定

| 错误合并 | 当前否定结论 | 正确归属 |
|---|---|---|
| worker entry 直接解释 inbound schema、body-free 合法性并创建 intake 结果 | worker 只承接入口与 local context。 | inbound source port + inbound intake decision |
| external adapter 顺带承接 transport envelope / dedup / worker runner 行为 | external adapter 只处理 typed external refs 和 body-free resolution。 | inbound source port / worker entry |
| publisher 从 candidate ref 现查 current truth 拼 payload 或 topic | publisher 只消费 candidate publication surface 或 stored candidate shell。 | event candidate assembly + publisher port |
| handoff port 顺带读取 report body / archive body / external receipt body | handoff 只返回 body-free package / receipt / failure refs。 | collaboration handoff port |
| target registry 直接等于 config store 或 runtime builder | registry 只暴露 enabled / blocked / unavailable safe summary。 | target registry port + Step 14 config binding |
| publication / handoff failure 回滚 accepted truth | collaboration failure 只生成 safe outcome / diagnostic / hint。 | publisher / handoff outcome + Step 12 mapping |

### 6. Step 8~17 承接摘要

| 后续 Step | 承接内容 | 暂停条件 |
|---|---|---|
| Step 8 | inbound shell、event shell、handoff hint shell 只能复制这些 family 的 body-free 输入 / 输出 / safe outcome。 | DTO 试图复制 raw payload、topic、package body、receipt body、provider payload。 |
| Step 9 | consumer、publication、handoff 流必须按 envelope -> inbound source -> intake decision -> candidate assembly -> registry -> publisher / handoff 的顺序调用。 | flow 现场生成 schema 分类、publication outcome、handoff failure mapping。 |
| Step 11 | persistence 只为 summary / ref / marker / result boundary 定义保存面;这些 family 本身不另开 truth store。 | 为 publisher / handoff / inbound source 新增私有 truth schema 却无对象 owner。 |
| Step 12 | blocked / unavailable / failed outcome 复用 safe reason、safe marker、`MethodAssetInfraSafeDiagnostic`、follow-up hint。 | 需要 raw exception、provider body、transport body 才能闭口。 |
| Step 14 | transport binding、source profile、handoff target、publisher target 只作为这些 family 的注入来源。 | 配置反向成为 publication / handoff 业务事实 owner。 |
| Step 15 | observability / audit 只记录 safe outcome、target marker、handoff hint、publisher result state。 | telemetry / audit 要保存 raw payload、package body、provider response。 |
| Step 17 | implementation handoff 可引用这些 family 的 fake / durable parity、binding slot 和 failure mapping。 | implementation handoff 需要未闭口的 transport / payload / retry 细节。 |

### 7. `R7.17` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 refresh、reconciliation、cursor / checkpoint、adapter availability、runtime assembly 接缝,并承接 `R7.16` 已固定的 inbound / publisher / handoff family。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.16` 已固化的 publication / handoff / target registry seam 作为 jobs / maintenance / runtime 的协作前置。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 5 组 inbound / external / publisher / handoff / registry family 候选表 | 是。 |
| 是否写入 body-free 输入面和 safe outcome 面 | 是。 |
| 是否写清 cross-family ordering 与 cut-line | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否形成 Step 8~17 承接摘要 | 是。 |
| 是否形成 `R7.17` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.17`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.17 jobs / maintenance / runtime adapter port:先思考`;只允许思考 refresh、reconciliation、cursor / checkpoint、adapter availability、runtime assembly 接缝,并承接 `R7.16` 已固定的 inbound / publisher / handoff family;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.18`、Step 8 或后续 Step。

---

## R7.17 jobs / maintenance / runtime adapter port:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.17 jobs / maintenance / runtime adapter port:先思考`。 |
| 本模块目标 | 在 `R7.16` 已固定的 inbound / publisher / handoff family 基础上,裁决 maintenance task / progress / history、refresh target expansion、job cursor / checkpoint、recovery issue / report boundary、runtime assembly / adapter availability seam,为 `jobs` runner、maintenance Query 和 Step 9 job flow 提供正式 port 来源。 |
| 当前状态 | completed |
| 当前允许 | 只思考 seam family、cursor / checkpoint 来源、runtime / availability 来源、report boundary / issue 来源、owner / cut-line 和 `R7.18` 写入边界。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. `R7.16` 承接输入与本轮必须闭口的问题

| 承接输入 | 当前问题 | `R7.17` 必须裁决的 seam |
|---|---|---|
| `MethodAssetJobRunnerContext` / `MethodAssetOperationJobEntry` 已在 Step 6 固化 `maintenance_run_ref`、`refresh_scope_ref`、`job_cursor_ref`、`checkpoint_ref`、`safe_execution_boundary_ref` | jobs runner 已有本地 context 壳,但还缺“run / scope / task / target batch 从哪里正式读取”的 application port family。 | maintenance task / refresh target seam |
| `MethodAssetJobProgressAssemblyState` / `MethodAssetJobEntryResultState` 已固化 `progress_view_ref`、`partial_failure_refs`、`report_boundary_ref`、`handoff_hint_ref` | progress、issue、report boundary 和 handoff hint 已有 body-free 壳,但还缺正式保存面和读取面。 | progress / issue / report boundary seam |
| `02-概要设计.md` 明确 maintenance job 只刷新 derived material 和 progress,不修 core truth | 需要把 task truth、progress view、run history 和 recovery issue 明确切开,避免 jobs runner 或 Query 把 progress 当作 task truth。 | maintenance task / progress / history seam |
| `R7.12` 已固定 truth / material / relation / package repository family | refresh job 仍缺“如何从 `RefreshScopeRef` / task ref 展开 committed target refs 与 body-free snapshot”的正式 bridge。 | refresh target planner seam |
| `MethodAssetRuntimeAssemblyState`、`MethodAssetAdapterAvailabilityState`、binding state 已在 Step 6 固化 | worker / jobs / application 仍缺“如何正式读取 runtime assembly / adapter availability / safe diagnostic policy”的 port,不能从 config key、secret 或 runner 进程状态反推。 | runtime assembly / availability seam |
| `R7.16` 已固定 publisher / handoff / target registry family | jobs 可能产出 event candidate、report boundary、handoff hint,但不能让 maintenance flow 自己拥有 publication / handoff outcome 真相。 | job result -> publisher / handoff cut-line |

### 3. seam family 准入裁决

| seam family | 是否进入 `R7.18` | primary owner | 主要输入来源 | 本轮裁决 |
|---|---|---|---|---|
| `MethodAssetMaintenanceTaskRepository` | 是 | `application` 定义,`infra` 实现 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;maintenance task ref;run / scope / task kind summary | maintenance task repository 只承接 maintenance task truth / summary、stable lookup 和 state change 保存,不承接 worker queue、retry、lease 或 process lifecycle。 |
| `MethodAssetMaintenanceProgressViewRepository` | 是 | `application` 定义,`infra` 实现 | `MaintenanceProgressView`;run / scope progress query;pending issue refs;task summary refs | progress view repository 只承接 Query / report 可见 progress surface,不得反推 task 已成功、已 supersede 或已闭口。 |
| `MethodAssetMaintenanceRunHistoryRepository` | 是 | `application` 定义,`infra` 实现 | `MaintenanceRunHistory`;run ref;scope ref;job result summary;report / handoff boundary refs | run history repository 只记录 body-free run chronology、follow-up hint 和 report linkage,不保存 raw log、metrics body、scheduler state。 |
| `MethodAssetRefreshTargetPlannerPort` | 是 | `application` 定义,`infra` 实现 | `RefreshScopeRef`;maintenance task ref;committed truth / summary / relation / package repositories;previous checkpoint | refresh target planner 是 maintenance job 从 run / scope / task 到 typed target batch、committed snapshot summary、source cursor 的唯一正式 bridge;它不保存 material,也不现场修 truth。 |
| `MethodAssetJobCheckpointStorePort` | 是 | `application` 定义,`infra` 实现 | `MethodAssetJobCursorRef`;`MethodAssetJobCheckpointRef`;run / task / job family refs;previous progress summary | checkpoint store 只承接 opaque cursor、resume checkpoint、partial continuation 和 report boundary continuation;它不是 optimistic version、freshness marker、retry counter 或 queue lease。 |
| `MethodAssetRecoveryIssueRepository` | 是 | `application` 定义,`infra` 实现 | body-free recovery / pending acknowledgement / intervention required issue refs;scope ref;run ref;safe diagnostic refs | recovery issue repository 承接 consistency recovery 与 maintenance progress 需要的 safe issue surface,不声称问题已修复,也不保存 raw evidence / provider body。 |
| `MethodAssetRuntimeAssemblyRegistryPort` | 是 | `application` 定义,`infra` 实现 | `MethodAssetRuntimeAssemblyState`;store / resolver / source / publisher / handoff binding refs;safe diagnostic policy ref | runtime assembly registry 负责把 validated runtime assembly、binding slot 和 safe diagnostic policy 暴露给 application / worker / jobs,但不拥有 config key、secret、builder internals。 |
| `MethodAssetAdapterAvailabilityPort` | 是 | `application` 定义,`infra` 实现 | `MethodAssetAdapterAvailabilityState`;store / resolver / inbound / publisher / handoff binding state;target registry summary | adapter availability port 只返回正式 availability / degraded / unavailable safe summary,供 entry、job precheck 和 maintenance flow 复制,不得由 service 用 raw IO error 现分类。 |

当前结论:

- jobs / maintenance 不是单纯的 `jobs` crate 本地问题,而是 Step 7 必须正式闭口的一组 application port family。
- `application` 仍是唯一 port owner;`jobs` 只调用,`infra` 只实现,`api` / `worker` 只消费 progress / task summary 或触发 job runner。
- maintenance 需要同时保留 task truth、progress view、run history、recovery issue 和 checkpoint 的独立边界,不能把它们压成一个“job state”。

### 4. cursor / checkpoint / runtime / availability 来源规则

| 来源轴 | 允许的正式来源 | 禁止捷径 | 后续承接 |
|---|---|---|---|
| maintenance task truth | maintenance task repository 中已存在的 task ref、run ref、scope ref、task kind summary、safe state marker | 不得从 progress view、event candidate、publisher outcome、scheduler state 或 runner local memory 反推 task truth。 | `R7.18` maintenance task / progress / history family 表;Step 9 maintenance request / job flow;Step 10 task / recovery state |
| progress view | task truth、recovery issue refs、checkpoint summary、job result summary 经 application 编排后保存到 progress view repository | 不得把 progress stalled / unavailable 当成 task 已完成、已 supersede 或已修复。 | `R7.18` progress family 表;Step 8 maintenance progress Query shell;Step 9 progress read flow |
| run history / report boundary | run history repository、job result summary、body-free report boundary ref、handoff hint ref | 不得保存 markdown / JSON report body、artifact body、metrics body、worker log 或 external receipt body。 | `R7.18` run history / issue family;Step 12 partial / blocked mapping;Step 15 observability / audit |
| refresh target expansion | `RefreshScopeRef`、maintenance task ref、committed truth / summary / relation / package repositories、existing stale / freshness marker、previous checkpoint | 不得做全表猜测、解析 ref 字符串、读 private map、靠 config profile 或 fake rule 决定 refresh target。 | `R7.18` refresh target planner family;Step 9 read refresh / trace refresh / recovery flow |
| job cursor / checkpoint | repository page cursor、previous persisted checkpoint、previous progress summary、job family / run / task typed refs | 不得把 optimistic version、truth cursor、timestamp、retry count、queue offset、lease token、thread id 或 process exit code 当 job cursor / checkpoint。 | `R7.18` checkpoint family;Step 11 persistence;Step 13 re-entry / replay |
| runtime assembly | `MethodAssetRuntimeAssemblyState`、validated binding refs、safe diagnostic policy ref | 不得从 config key、env、secret、DI container 内部状态、thread local 或 runner bootstrap 代码反推正式 runtime assembly。 | `R7.18` runtime assembly family;Step 14 config / runtime binding |
| adapter availability | `MethodAssetAdapterAvailabilityState`、store / resolver / source / publisher / handoff binding state、target registry safe summary | 不得从 raw exception、HTTP status、SQL error、provider body、timeout 字符串或 fake ad hoc enum 直接映射成正式 availability truth。 | `R7.18` availability family;Step 12 unavailable / degraded;Step 14 adapter binding |

### 5. owner 与切口裁决

| 切口 | 当前结论 | 明确禁止 |
|---|---|---|
| maintenance task truth vs progress view | task repository 承接 task truth / state change;progress repository 只承接可见 progress / summary。 | 用 progress view 代替 task truth,或让 task repository 顺带输出 Query DTO。 |
| progress / issue vs run history | issue repository 表达 blocked / pending / intervention issue;run history repository表达 run-level chronology / follow-up / report linkage。 | 把 run history 当 unresolved issue store,或把 issue ref 当 report body 存储。 |
| refresh target planner vs truth / material repository | planner 只展开 target batch、snapshot summary、source cursor;具体对象仍由 `R7.10` / `R7.12` repository family load / save。 | planner 顺带保存 refreshed material、修 truth,或 repository 顺带做 batch planning / scheduler。 |
| checkpoint store vs cursor / version / scheduler state | checkpoint store 只承接 resume anchor;cursor 只表达分页 / batch continuation。 | 把 version、truth cursor、retry counter、lease、offset、cron state 混成同一 token。 |
| runtime assembly registry vs target registry | runtime assembly registry 负责整体 runtime slot / binding / diagnostic policy;target registry 只负责 collaboration target enabled / blocked / unavailable。 | 用 target registry 替代 runtime assembly precheck,或用 runtime registry 越权决定 publication / handoff 目标。 |
| runtime / availability vs config/runtime builder | Step 7 只暴露 validated assembly / availability 读取面;具体 config key、secret、builder wiring 继续后移 Step 14。 | 在 Step 7 引入 config schema、secret shape、URL、topic、cron、store root 或 transport product 细节。 |
| maintenance result vs publisher / handoff | maintenance flow 只产出 event candidate、report boundary、handoff hint;真正 publication / handoff 仍走 `R7.16` family。 | jobs runner 直接拥有 publication outcome 真相,或 handoff failure 回滚已成立的 refreshed material / progress truth。 |

### 6. `R7.18` 写入边界

| `R7.18` 允许写入 | `R7.18` 禁止写入 |
|---|---|
| maintenance task、progress、run history、refresh target planner、checkpoint、recovery issue、runtime assembly、adapter availability 的正式 family 候选表。 | 具体 trait / port 方法签名、adapter method、repository contract 正文。 |
| cursor / checkpoint / runtime / availability 来源承接表。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| jobs / maintenance / runtime 的 owner / cut-line 规则和 `R7.19` 进入门禁。 | scheduler、queue、retry、lease、transport、metrics body、report body 或 raw log 细节。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否承接 `R7.16` 的 inbound / publisher / handoff family | 是。 |
| 是否明确 maintenance task / progress / history / refresh target / checkpoint / runtime / availability seam family | 是。 |
| 是否写清 cursor / checkpoint / runtime / availability 来源规则 | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否把 maintenance task truth、progress view、run history、issue 分层切开 | 是。 |
| 是否形成 `R7.18` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.18`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.18 jobs / maintenance / runtime adapter port:再写入`;只允许写入 maintenance task、progress、run history、refresh target planner、checkpoint、recovery issue、runtime assembly、adapter availability family 候选表、cursor / checkpoint / runtime / availability 来源承接表、owner / cut-line 规则和 `R7.19` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.19`、Step 8 或后续 Step。

---

## R7.18 jobs / maintenance / runtime adapter port:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.18 jobs / maintenance / runtime adapter port:再写入`。 |
| 本模块目标 | 将 `R7.17` 已裁决的 maintenance / progress / history / refresh target / checkpoint / runtime / availability seam 固化为 Step 7 承接记录,明确 family 候选、来源承接表、owner / cut-line 和后续 `R7.19` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | maintenance / runtime family 候选表、cursor / checkpoint / runtime / availability 承接关系、cross-family ordering / cut-line 规则和 `R7.19` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、state matrix、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. jobs / maintenance / runtime family 固化

| family 候选 | 承接对象 / helper | primary owner | 正式输入主语 | 正式输出壳 | 非职责 | 后续承接 |
|---|---|---|---|---|---|---|
| `MethodAssetMaintenanceTaskRepository` | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` | `application` 定义 port,`infra` 实现 | maintenance task ref、run ref、scope ref、task kind、safe state marker、supersede / suspend / intervention typed reason | versioned maintenance task truth、stable task summary、run / scope / kind page | 不保存 worker queue、retry、lease、thread lifecycle 或 scheduler state | Step 8 job / progress shell;Step 9 request / control / job flow;Step 10 task / recovery state;Step 11 task persistence |
| `MethodAssetMaintenanceProgressViewRepository` | `MaintenanceProgressView` | `application` 定义 port,`infra` 实现 | maintenance task truth、checkpoint summary、pending issue refs、job result summary、scope / run visibility | body-free progress view、scope progress、pending issue summary、task progress snapshot | 不替代 task truth;不决定 task 已成功、已 supersede 或已闭口 | Step 8 progress Query shell;Step 9 progress read flow;Step 10 progress stale / unavailable;Step 11 progress persistence |
| `MethodAssetMaintenanceRunHistoryRepository` | `MaintenanceRunHistory`;report / handoff linkage | `application` 定义 port,`infra` 实现 | run ref、scope ref、job result summary、follow-up hint、report boundary ref、handoff hint ref | body-free run chronology、milestone summary、report / handoff linkage summary | 不保存 markdown / JSON report body、artifact body、metrics body、worker log 或 scheduler internals | Step 8 run history shell;Step 9 run completion / partial flow;Step 12 recovery / follow-up;Step 15 observability |
| `MethodAssetRefreshTargetPlannerPort` | maintenance refresh / recovery target planning | `application` 定义 port,`infra` 实现 | `RefreshScopeRef`;maintenance task ref;committed truth / summary / relation / package repositories;stale / freshness marker;previous checkpoint | body-free target batch summary、committed snapshot summary、source cursor hint、resume-ready target slice | 不保存 refreshed material;不现场修 truth;不拥有 scheduler / queue planning | Step 9 read refresh / trace refresh / recovery flow;Step 11 target index persistence if needed;Step 16 batch/page tests |
| `MethodAssetJobCheckpointStorePort` | `MethodAssetJobCursorRef`;`MethodAssetJobCheckpointRef` | `application` 定义 port,`infra` 实现 | job family ref、run / task refs、opaque page cursor、previous progress summary、report boundary continuation hint | resume checkpoint summary、cursor continuation summary、partial continuation anchor | 不等于 optimistic version、truth cursor、retry counter、queue offset、lease token 或 process exit state | Step 9 partial / resume flow;Step 11 checkpoint persistence;Step 13 re-entry / replay |
| `MethodAssetRecoveryIssueRepository` | consistency recovery / pending acknowledgement / intervention required issue surface | `application` 定义 port,`infra` 实现 | run ref、scope ref、task ref、safe diagnostic refs、follow-up hint refs、body-free issue marker | body-free recovery issue summary、pending / blocked / intervention issue page、safe issue linkage | 不声称 issue 已修复;不保存 raw evidence、provider payload、report body 或 external response | Step 8 issue / task summary shell;Step 9 recovery flow;Step 10 issue disposition;Step 12 intervention / blocked mapping |
| `MethodAssetRuntimeAssemblyRegistryPort` | `MethodAssetRuntimeAssemblyState`;binding summary;diagnostic policy | `application` 定义 port,`infra` 实现 | validated runtime assembly state、store / resolver / source / publisher / handoff binding refs、safe diagnostic policy ref | body-free assembly summary、binding slot summary、runner-visible diagnostic policy summary | 不拥有 config key、secret、builder internals、container wiring 或 bootstrap process state | Step 9 entry / job precheck;Step 12 runtime blocked mapping;Step 14 runtime binding / validator |
| `MethodAssetAdapterAvailabilityPort` | `MethodAssetAdapterAvailabilityState`;binding availability read | `application` 定义 port,`infra` 实现 | store / resolver / source / publisher / handoff binding state、target registry summary、safe adapter issue refs | body-free availability / degraded / unavailable summary、required-slot precheck summary | 不由 service 从 raw IO error、timeout 文本、HTTP status、SQL error 或 fake ad hoc enum 现场分类 | Step 9 precheck / degraded flow;Step 12 unavailable mapping;Step 14 adapter binding;Step 15 slot observability |

当前固定口径:

- `application` 仍是唯一正式 port owner;`infra` 只实现 maintenance / runtime family,`jobs` / `worker` / `api` 只消费这些 family 的正式输出。
- maintenance task truth、progress view、run history、recovery issue、checkpoint 是 5 类独立 surface,不得压成单一 “job state”。
- runtime assembly / availability 只暴露 validated、body-free、safe summary,不得让 Step 7 提前进入 config / secret / transport / scheduler 细节。

### 3. cursor / checkpoint / runtime / availability 承接关系

| family | identity / selector 输入 | 正式来源与承接重点 | save / read pairing | 调用方 / 消费方 | 禁止事项 |
|---|---|---|---|---|---|
| maintenance task repository | task ref、run ref、scope ref、task kind | task truth 只能来自已登记 maintenance request / control truth 与正式 task state 变更 | task exact read / stable page 与 task state save 配对;progress 只能复制其结果 | application maintenance request / control flow;jobs refresh / recovery flow;api task summary query | 不从 progress view、event candidate、handoff hint 或 local memory 反推 task truth。 |
| progress view repository | progress view ref、run ref、scope ref、task ref | progress 只能复制 task truth、checkpoint、issue refs、job result summary 的可见结果 | progress read 与 progress snapshot save 配对,但不反向驱动 task truth | api maintenance progress query;jobs result / report assembly | 不把 progress stalled / unavailable 解释成 task closed / successful / superseded。 |
| run history repository | run ref、scope ref、history page selector | run chronology 只能来自 job result summary、follow-up hint、report boundary / handoff linkage | append-like chronology read 与 milestone save / update 配对,不承接 report body | jobs result closure;api run history query;observability handoff | 不保存 report markdown、artifact body、metrics body、worker log 或 scheduler timeline。 |
| refresh target planner | task ref、scope ref、checkpoint ref、resume slice selector | target batch 只能来自 committed truth / summary / relation / package repositories 与正式 stale / freshness inputs | planner 输出只喂给后续 repository load / refresh,不形成新 truth save | application refresh / recovery orchestration;jobs runner | 不做全表猜测、字符串解析、private map 查找或 fake-only target rule。 |
| checkpoint store | checkpoint ref、job cursor ref、run / task / family selector | checkpoint / cursor 只能来自 repository page continuation、previous persisted checkpoint、previous progress summary | checkpoint save / get 与 progress / run history continuation 配对 | jobs runner resume;application partial / replay flow | 不把 version、truth cursor、retry count、queue offset、lease token、thread id 当 checkpoint。 |
| recovery issue repository | issue ref、run ref、scope ref、task ref | issue 只能来自 consistency recovery / intervention judgement、safe diagnostic、follow-up hint | issue exact read / page 与 issue state save 配对,供 progress / run history / query 复制 | application recovery flow;api issue / task summary;jobs result assembly | 不保存 raw evidence、external payload、stack trace、provider body 或 repair algorithm。 |
| runtime assembly registry | runtime assembly ref、job profile / entry context selector | assembly 只能来自 validated runtime assembly state、binding refs、safe diagnostic policy | assembly read 与 builder / validator output 配对,但 builder 细节后移 Step 14 | api / worker / jobs entry precheck;application orchestration | 不从 env、config key、secret、container internals 或 bootstrap code 反推正式 assembly。 |
| adapter availability port | availability state ref、binding ref、required slot selector | availability 只能来自正式 availability state、binding state、target registry safe summary、adapter issue refs | availability read 与 runtime binding / health summary 配对,供 precheck / degraded copy | api / worker / jobs precheck;application degraded mapper | 不从 raw exception、HTTP / SQL code、timeout string 或 fake shortcut 直接映射正式 availability。 |

### 4. cross-family ordering 与调用切口

| 顺序 | 当前规则 | 原因 |
|---|---|---|
| runtime assembly registry 先于 availability precheck | entry / job runner 必须先取得 validated assembly summary,再按 required slots 读取 availability。 | 防止 runner 直接靠 bootstrap 代码或 config 状态猜可用性。 |
| availability precheck 先于 task dispatch | refresh / recovery job 进入任务编排前,必须先确认 required store / resolver / publisher / handoff slots 的 safe availability。 | 防止 job 在 adapter 不可用时半路生成私有 blocked 规则。 |
| task truth 先于 checkpoint / target planning | jobs flow 先读取 maintenance task truth,再决定是否恢复 checkpoint 或扩展 refresh targets。 | 防止 checkpoint 或 target batch 脱离正式 task truth 独立运行。 |
| checkpoint 先于 target planner 的 resume slice | 有 persisted checkpoint 时,planner 只能在正式 resume anchor 上继续批次展开。 | 防止 service 根据 page size / local cache 私自猜恢复位置。 |
| planner 晚于 task / checkpoint,早于 repository load/save | target batch、snapshot summary、source cursor 必须先闭口,后续 repository family 才能刷新 material / summary。 | 防止 truth / material repository 顺带承担 batch planning。 |
| issue / progress / run history 晚于 job result summary | blocked / partial / intervention issue、progress snapshot、run chronology 都只能复制正式 job result / safe diagnostic 输出。 | 防止 jobs runner 现场拼 public issue / progress / history surface。 |
| publisher / handoff 晚于 progress / result assembly | maintenance 产生 event candidate、report boundary、handoff hint 后,publication / handoff 仍必须回到 `R7.16` family。 | 防止 maintenance flow 自己拥有 publication / handoff outcome 真相。 |

### 5. cut-line 与错误合并否定

| 错误合并 | 当前否定结论 | 正确归属 |
|---|---|---|
| maintenance task repository 顺带承接 progress view、run history、issue list | task repository 只承接 task truth / summary 与 state save。 | task repository + progress repository + run history repository + issue repository |
| progress view 反向成为 task truth owner | progress 只复制可见结果,不拥有 task state 真相。 | maintenance progress repository |
| refresh target planner 顺带保存 refreshed material 或修 core truth | planner 只展开 target batch / snapshot / cursor。 | refresh target planner + `R7.10` / `R7.12` repository family |
| checkpoint store 混入 version / truth cursor / retry / queue lease | checkpoint 只表达 resume anchor 与 opaque continuation。 | checkpoint store |
| runtime assembly registry 直接等于 config / runtime builder | registry 只暴露 validated assembly summary 与 binding slot summary。 | runtime assembly registry + Step 14 config/runtime binding |
| adapter availability 由 service 直接根据 raw error 分类 | availability 必须复制正式 availability state / safe issue summary。 | adapter availability port |
| jobs runner 直接拥有 publisher / handoff outcome 真相 | jobs 只产出 candidate / hint / report boundary,真正协作结果回到 `R7.16` family。 | event candidate publisher / collaboration handoff / target registry |

### 6. Step 8~17 承接摘要

| 后续 Step | 承接内容 | 暂停条件 |
|---|---|---|
| Step 8 | job input shell、maintenance progress Query、task / issue summary shell、run history shell 只能复制这些 family 的 body-free输出。 | DTO 试图携带 scheduler、queue、report body、artifact body、metrics body 或 raw diagnostic。 |
| Step 9 | maintenance request / control、read refresh、trace refresh、recovery flow 必须按 runtime assembly -> availability -> task -> checkpoint -> target planning -> repository refresh -> issue / progress / history 的顺序调用。 | flow 现场生成 checkpoint、target batch、availability 分类、progress truth 或 history truth。 |
| Step 10 | task / recovery disposition 由 task / issue truth owner 承接;progress stale / unavailable 只是可见读取状态。 | 把 progress / history 误当 task truth state owner。 |
| Step 11 | 只为 task / progress / history / checkpoint / issue 等正式对象设计 persistence;planner / availability / assembly registry 自身不生成私有 truth store。 | 为 planner / registry / availability 补私有 schema 却无 Step 6 对象 owner。 |
| Step 12 | blocked / unavailable / partial / intervention required 复用 issue、progress、availability、run history 中的 safe summary / hint / marker。 | 需要 raw exception、provider body、worker log 才能闭口。 |
| Step 13 | re-entry / replay 只能依赖 checkpoint、stored result、task truth 和 run history,不得重猜 target batch 或重修 truth。 | duplicate / replay 需要从 timestamp、thread id、queue lease 或 local memory 恢复。 |
| Step 14 | runtime builder、binding validator、profile / store root / batch size 等配置只作为这些 family 的注入来源。 | config 反向成为 task truth、issue truth 或 availability truth owner。 |
| Step 15 | observability / audit 只记录 safe progress、issue、history、availability、handoff hint。 | telemetry / audit 保存 raw payload、report body、worker log 或 provider response。 |
| Step 16 / 17 | 测试与实施承接需覆盖 fake / durable parity、checkpoint resume、task-progress-history layering、runtime precheck 和 no truth repair。 | handoff 需要未闭口的 scheduler / queue / transport / metrics body 细节。 |

### 7. `R7.19` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 infra implementation / entry restriction,重点是 fake / durable adapter map、runtime builder slot map、api / worker / jobs 不得直连 repository / adapter 的规则。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | `R7.18` 已固化的 maintenance / runtime family 与 `R7.16` 的 inbound / publisher / handoff family 作为 infra / entry restriction 的输入基线。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 8 组 maintenance / runtime family 候选表 | 是。 |
| 是否写入 cursor / checkpoint / runtime / availability 承接关系 | 是。 |
| 是否写清 cross-family ordering 与 cut-line | 是。 |
| 是否保留 `application` 为唯一 port owner | 是。 |
| 是否把 task truth、progress、history、issue、checkpoint 分层切开 | 是。 |
| 是否形成 `R7.19` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.19`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.19 infra implementation / entry restriction:先思考`;只允许思考 fake / durable adapter map、runtime builder slot map、api / worker / jobs 禁止直连 repository / adapter 的规则,并承接 `R7.18` 已固定的 maintenance / runtime family 和 `R7.16` 已固定的 inbound / publisher / handoff family;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.20`、Step 8 或后续 Step。

---

## R7.19 infra implementation / entry restriction:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.19 infra implementation / entry restriction:先思考`。 |
| 本模块目标 | 在 `R7.18` 已固定的 maintenance / runtime family 和 `R7.16` 已固定的 inbound / publisher / handoff family 基础上,裁决 infra adapter implementation map、runtime builder slot map、fake / durable parity、api / worker / jobs entry restriction 和 `R7.20` 写入边界。 |
| 当前状态 | completed |
| 当前允许 | 只思考 infra 实现分组、runtime slot owner、entry 可调用面、entry 禁止直连面、fake / durable 等价和 `R7.20` 写入边界。 |
| 当前禁止 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. `R7.18` 承接输入与本轮必须闭口的问题

| 承接输入 | 当前问题 | `R7.19` 必须裁决的边界 |
|---|---|---|
| `application` 已是 repository / resolver / publisher / handoff / maintenance / runtime family 的唯一 port owner | 需要明确 `infra` 只实现这些 port,不能新增业务 trait owner 或让 adapter 反向决定业务 judgement。 | infra implementation map |
| Step 4 已给出 `infra` 文件角色: `runtime_builder.rs`、`repositories.rs`、`material_stores.rs`、`reference_stores.rs`、`external_adapters.rs`、`publishers.rs`、`handoff_adapters.rs`、`clock_id.rs`、`errors.rs` | 需要把 R7 family 映射到这些实现角色,但不能提前写 schema、具体产品、adapter method 或实现代码。 | adapter file responsibility map |
| Step 6 已固化 runtime / binding / availability support objects | runtime builder 需要表达 service / port / adapter slot 装配,但不得暴露 config key、secret、connection pool 或具体 DI container。 | runtime builder slot map |
| Step 6 已固化 api / worker / jobs entry objects | entry 只能转译 protocol shell / runner context 并调用 application facade;需要明确禁止 entry 直连 repository、domain transition、publisher / handoff adapter。 | entry restriction map |
| R7.7~R7.18 已形成大量 port family | fake / durable adapter 必须实现同一 application port surface,不能出现测试专用 private map 或 durable-only 行为。 | fake / durable parity rule |
| Step 4 / Step 5 已禁止 entry 互依和 application/domain 依赖 infra | 需要把禁止依赖落成 Step 7 的 port / adapter 约束,供后续 Step 11/14/17 承接。 | dependency and injection cut-line |

### 3. infra implementation family 准入裁决

| implementation family | 是否进入 `R7.20` | primary owner | 承接的 R7 family | 本轮裁决 |
|---|---|---|---|---|
| `InfraTruthRepositoryAdapters` | 是 | `infra` 实现 application port | `R7.10` definition / catalog / formalization / version truth repository family | 进入 adapter map,但只表达 fake / durable 共用 application repository surface;不写表结构、SQL、migration、index 或 product。 |
| `InfraSupportMaterialStoreAdapters` | 是 | `infra` 实现 application port | `R7.12` support summary、trace、impact、audit、lineage、relation、package、assembly、material repository family | 进入 adapter map,承接 body-free summary / material / view store;不反写 core truth,不现场生成 diagnostic。 |
| `InfraResolverBuilderAdapters` | 是 | `infra` 实现 application port | `R7.14` basis resolver、availability resolver、query read resolver、degraded mapper、distribution / discovery builder | 进入 adapter map,只为 application 提供 body-free resolution / builder summary;不得读取 raw external body 或替代 Query service。 |
| `InfraInboundPublisherHandoffAdapters` | 是 | `infra` 实现 application port | `R7.16` inbound source、external body-free adapter、event candidate publisher、collaboration handoff、target registry | 进入 adapter map,只返回 safe outcome / refs / markers;不定义 topic、transport、ack、delivery、package body 或 retry。 |
| `InfraMaintenanceRuntimeAdapters` | 是 | `infra` 实现 application port | `R7.18` maintenance task、progress、history、checkpoint、issue、runtime assembly、availability | 进入 adapter map,承接 task / progress / checkpoint / runtime support;不表达 scheduler、queue、lease、worker lifecycle 或 report body。 |
| `InfraClockIdAndResultAdapters` | 是 | `infra` 实现 application port | `R7.8` Clock / IdGenerator / UnitOfWork / stored result / idempotency support | 进入 adapter map,为 application 提供时间、ID、事务、stored result 和 replay 支撑;不得让 entry / domain 拼接 id 或 cursor。 |
| `InfraFakeRuntimeHarness` | 是,但只作为 implementation parity 约束 | `infra` test / fake support 实现 application port | 所有 application port family | fake 必须按同一 port surface、version、cursor、safe marker 和 unavailable 分类实现,不得引入测试专用业务捷径。 |
| `InfraRuntimeBuilder` | 是 | `infra` 装配 application services 与 adapter slots | 所有 service slot / adapter slot / availability state / config binding support objects | runtime builder 只负责装配和返回 validated assembly / slot summary;不得成为业务 judgement owner 或 config truth owner。 |

当前结论:

- `infra` 的 Step 7 角色是“application port 的实现方 + runtime assembly owner”,不是 repository / resolver / publisher trait 的定义方。
- `infra` 可以区分 fake / durable、store / resolver / publisher / handoff / runtime builder,但这些区别不能改变 application port contract。
- 具体 DB、queue、HTTP、object store、scheduler、cache、transport、schema、migration 和 config key 全部后移 Step 11 / Step 14 / 实施计划。

### 4. runtime builder slot map 思考

| slot group | 承接对象 / family | runtime builder 可做 | runtime builder 禁止做 |
|---|---|---|---|
| service slots | application command / query / consumer / job service facade | 装配 service facade 与 application port bundle,生成 typed service slot refs。 | 不执行业务 flow,不调用 domain transition,不保存 service instance body。 |
| repository / store slots | truth repository、support / material store、maintenance task / progress / checkpoint store | 绑定 fake / durable adapter slot,生成 store binding state 与 availability state refs。 | 不定义 DB schema、table、index、SQL、cache key、object path 或 product。 |
| resolver / builder slots | basis / availability / read resolver、degraded mapper、distribution / discovery builder、external adapter | 绑定 body-free resolver / builder adapter slot,生成 resolver binding / availability refs。 | 不读取 external body、provider payload、artifact package、marketplace listing 或 sibling源码。 |
| inbound / publisher / handoff slots | inbound source、event candidate publisher、handoff、target registry | 绑定 source / publisher / handoff adapter slot,生成 binding state 与 safe unavailable summary。 | 不定义 topic、subscription、ack、delivery receipt、dead letter、package body 或 retry policy。 |
| maintenance / job slots | maintenance task/progress/history/checkpoint/issue store、target planner | 绑定 job orchestration 所需 adapter slots 与 safe diagnostic policy。 | 不定义 cron、scheduler、queue、lease、worker thread 或 process supervisor state。 |
| clock / id / diagnostic slots | Clock、IdGenerator、safe diagnostic policy、redaction marker support | 注入 time/id/diagnostic provider slot,为 application 生成 opaque refs 和 redacted diagnostics。 | 不由 domain / entry / adapter 拼接 id、marker、cursor 或 diagnostic text。 |
| entry assembly slots | api / worker / jobs entry context 所需 runtime assembly summary | 向 entry 暴露 validated runtime assembly state ref 与 required-slot availability summary。 | 不让 entry 访问 repository instance、adapter concrete type、transaction handle 或 config internals。 |

### 5. entry restriction 思考

| entry module | 可调用面 | 必须经由 | 禁止直连 |
|---|---|---|---|
| `api` | application command / query service facade;runtime assembly summary;protocol response / rejection assembler | contracts command / query shell、entry context、application dispatch refs | domain transition、repository、UnitOfWork、resolver、publisher、handoff adapter、material store、config loader、durable/fake concrete adapter。 |
| `worker` | application inbound consumer / event candidate publication facade;runtime assembly summary;inbound / publisher binding summary | contracts inbound shell / event candidate refs、worker context、application consumer / publisher orchestration | repository、domain transition、outbox relay、broker ack / offset store、publisher concrete adapter、handoff concrete adapter、retry / dead-letter implementation。 |
| `jobs` | application job service facade;runtime assembly summary;maintenance / checkpoint / target planning facade output | contracts job shell、job runner context、application job orchestration | repository direct read/write、domain transition、publisher / handoff concrete adapter、scheduler / queue product、report body store、truth repair helper。 |

当前 entry 约束:

- entry 负责 local context、protocol shell / runner shell 转译、runtime precheck 和 error shell assembly。
- entry 不拥有业务 truth、repository version、UnitOfWork、domain transition、idempotency result store、publisher / handoff outcome truth。
- entry 可依赖 `infra` 只是为了 runtime assembly / wiring,不得拿到 concrete adapter 后越过 application facade。

### 6. fake / durable parity 与停审风险

| 约束 | 当前思考结论 | 若缺失必须暂停 |
|---|---|---|
| shared port surface | fake / durable 必须实现同一 application port family,相同输入、输出、错误和 safe marker 分类。 | fake 需要额外 private method、private map 或 string parsing 才能通过测试。 |
| version / cursor parity | fake / durable 必须共享 version conflict、page cursor、job checkpoint、stored result replay 和 UoW rollback 语义。 | durable 依赖 schema 特性而 fake 无等价行为,或 fake 用 timestamp / vector index 代替正式 cursor。 |
| safe diagnostic parity | fake / durable 对 unavailable / degraded / blocked 必须返回同类 redacted diagnostic / marker,不得暴露 raw error。 | 需要 raw SQL、HTTP status、provider body、stack trace 才能区分 public branch。 |
| no direct entry shortcut | api / worker / jobs 的测试也必须经 application facade,不得直接构造 repository state 绕过 flow。 | entry test 只能通过直接写 store 或直接调用 adapter 才能成立。 |
| no product binding | Step 7 不能用 PostgreSQL、Redis、S3、HTTP、bus、scheduler 等产品名闭口 port 语义。 | 某个 contract 需要具体产品概念才能定义。 |
| no formal doc write | 当前只更新 calibration artifact,正式 `03-详细设计.md` 后移回填模块。 | 需要修改正式文档才能表达 R7.19 结论。 |

### 7. `R7.20` 写入边界

| `R7.20` 允许写入 | `R7.20` 禁止写入 |
|---|---|
| infra implementation family map、runtime builder slot map、entry restriction map、fake / durable parity 规则。 | 具体 trait / port 方法签名、adapter method、repository contract 正文。 |
| application port owner / infra implementation owner / entry facade caller 的切口表。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| Step 8~17 承接摘要和 `R7.21` 跨模块接缝审计进入门禁。 | DB / queue / HTTP / scheduler / object storage / cache / transport / topic / migration / retry 细节。 |
| 正式 `03-详细设计.md` 仍不修改。 | implementation code、测试代码或实施计划。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否承接 `R7.18` maintenance / runtime family | 是。 |
| 是否承接 `R7.16` inbound / publisher / handoff family | 是。 |
| 是否明确 infra implementation family 候选 | 是。 |
| 是否明确 runtime builder slot map 思考 | 是。 |
| 是否明确 api / worker / jobs entry restriction 思考 | 是。 |
| 是否形成 fake / durable parity 思考 | 是。 |
| 是否形成 `R7.20` 写入边界 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.20`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.20 infra implementation / entry restriction:再写入`;只允许写入 infra implementation family map、runtime builder slot map、entry restriction map、fake / durable parity 规则、Step 8~17 承接摘要和 `R7.21` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.21`、Step 8 或后续 Step。

---

## R7.20 infra implementation / entry restriction:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.20 infra implementation / entry restriction:再写入`。 |
| 本模块目标 | 将 `R7.19` 已裁决的 infra implementation family、runtime builder slot、entry restriction、fake / durable parity 和 Step 8~17 承接口径固化为 Step 7 承接记录。 |
| 当前状态 | completed |
| 当前产物 | infra implementation family map、runtime builder slot map、entry restriction map、fake / durable parity 规则、Step 8~17 handoff 摘要和 `R7.21` 进入门禁。 |
| 禁止范围 | 不写具体 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. infra implementation family map

| implementation family | infra 落点 | 实现 owner | 承接 port family | 固化规则 |
|---|---|---|---|---|
| `InfraTruthRepositoryAdapters` | `infra/repositories.rs` | `infra` | definition、catalog、formalization、version truth repository family | 只实现 application repository port;fake / durable 共用 identity、version、page ordering、conflict 和 unavailable 分类;不在 Step 7 写表结构、SQL、migration 或 index。 |
| `InfraSupportMaterialStoreAdapters` | `infra/material_stores.rs`;`infra/reference_stores.rs` | `infra` | basis summary、external summary、trace、impact、audit、lineage、relation、package、assembly、consumption material family | 只保存 / 读取 body-free support material 和 relation truth;不得反写 core truth,不得在 adapter 内生成 policy judgement 或 diagnostic。 |
| `InfraResolverBuilderAdapters` | `infra/external_adapters.rs`;resolver / builder binding support | `infra` | basis resolver、availability resolver、read resolver、degraded mapper、distribution / discovery builder | 只返回 application 可复制的 body-free resolution / builder summary;不得泄露 raw external body、provider payload、sibling source body 或 marketplace listing body。 |
| `InfraInboundPublisherHandoffAdapters` | `infra/publishers.rs`;`infra/handoff_adapters.rs` | `infra` | inbound source、event candidate publisher、collaboration handoff、target registry | 只承载 source / publication / handoff safe outcome、refs、markers 和 availability;不定义 topic、transport、ack、delivery receipt、retry 或 payload schema。 |
| `InfraMaintenanceRuntimeAdapters` | maintenance runtime adapter support | `infra` | maintenance task、progress、history、refresh target planner、checkpoint、recovery issue、runtime assembly、adapter availability | 只实现 task / progress / checkpoint / issue / runtime availability 支撑;不表达 scheduler、queue、lease、worker lifecycle、report body 或 metrics body。 |
| `InfraClockIdAndResultAdapters` | `infra/clock_id.rs`;result / transaction support | `infra` | Clock、IdGenerator、UnitOfWork、stored result、idempotency support | 为 application 提供 opaque time/id/ref、transaction boundary、stored result 和 replay 支撑;entry / domain / adapter 不得自行拼接 id、cursor、marker 或 result ref。 |
| `InfraFakeRuntimeHarness` | fake runtime / test harness support | `infra` test support | 所有 application port family | fake 只作为同口径实现;不得添加测试专用 private method、private lookup、字符串解析、ordering shortcut 或 durable 不具备的行为。 |
| `InfraRuntimeBuilder` | `infra/runtime_builder.rs` | `infra` | service slot、adapter slot、availability state、config binding support | 只装配 validated runtime assembly 与 slot summary;不成为业务 judgement owner、config truth owner、secret owner 或 repository trait owner。 |

### 3. runtime builder slot map

| slot group | runtime builder 输出 | 允许绑定 | 禁止承担 |
|---|---|---|---|
| service slots | validated application service / facade slot refs | command / query / consumer / job service facade 与 application port bundle | 业务 flow、domain transition、truth mutation 或 service body persistence。 |
| repository / store slots | repository / material store binding state refs and availability summary | truth repository、support material store、relation store、maintenance task / progress / checkpoint store adapter slots | DB schema、table、index、SQL、cache key、object path、migration 或 product selection。 |
| resolver / builder slots | resolver / builder binding refs and safe availability summary | basis / availability / read resolver、degraded mapper、distribution builder、discovery builder、external body-free adapter | raw provider body、source code body、artifact package body、marketplace listing body 或 query service 替代逻辑。 |
| inbound / publisher / handoff slots | source / publisher / handoff binding state and target availability refs | inbound source、event candidate publisher、collaboration handoff、target registry adapter slots | topic、subscription、ack、delivery receipt、dead letter、retry policy 或 transport product。 |
| maintenance / job slots | job runtime binding state、checkpoint support and recovery issue availability refs | maintenance target planner、checkpoint store、run history、progress view、adapter availability | cron、scheduler、queue、lease、thread/process supervisor、report body store 或 truth repair helper。 |
| clock / id / diagnostic slots | time/id/diagnostic provider slot refs | Clock、IdGenerator、safe diagnostic policy、redaction / degraded marker support | entry/domain/adapter 自行生成 public marker、cursor、safe message 或 raw diagnostic。 |
| entry assembly slots | entry-visible runtime assembly summary and required-slot availability summary | api / worker / jobs local context 所需 validated assembly state ref | concrete adapter instance、transaction handle、config internals、secret、connection object 或 repository direct handle。 |

### 4. entry restriction map

| entry module | 可调用面 | 必须经由 | 禁止直连 |
|---|---|---|---|
| `api` | application command / query service facade;runtime precheck;protocol response / rejection assembler | contracts command / query shell、api entry context、application dispatch refs、validated runtime assembly summary | domain transition、repository、UnitOfWork、resolver、publisher、handoff adapter、material store、config loader、durable/fake concrete adapter。 |
| `worker` | application inbound consumer / event candidate publication facade;runtime precheck;safe consumer / publication result assembler | contracts inbound shell、event candidate refs、worker context、application consumer / publisher orchestration | repository、domain transition、broker ack / offset store、publisher concrete adapter、handoff concrete adapter、retry/dead-letter implementation、outbox relay shortcut。 |
| `jobs` | application job service facade;runtime precheck;maintenance target / checkpoint / progress orchestration result | contracts job shell、job runner context、application job orchestration、validated job runtime summary | repository direct read/write、domain transition、publisher / handoff concrete adapter、scheduler / queue product、report body store、truth repair helper。 |

Entry 固定口径:

- entry 只负责 local context、protocol shell / runner shell 转译、runtime precheck 和 error shell assembly。
- entry 可以依赖 `infra` 提供 validated runtime assembly summary,但不得获取 concrete adapter 后绕过 application facade。
- entry 测试也必须从 application facade 或 job facade 进入;不得通过直接写 store、直接调 repository 或直接调 adapter 证明行为。

### 5. fake / durable parity 规则

| parity 轴 | 固化规则 | 后续承接 |
|---|---|---|
| port surface | fake / durable 实现同一 application port family,输入、输出、错误、safe marker 分类一致。 | Step 11 persistence 和 Step 16 tests 不能要求 fake-only / durable-only method。 |
| identity / version | fake / durable 共享 exact identity、stable lookup、expected version、conflict、stored result replay 和 UoW rollback 语义。 | Step 10 state、Step 11 persistence、Step 13 idempotency 必须引用同一语义。 |
| page / cursor | fake / durable 共享 page ordering、cursor opacity、checkpoint resume 和 no-string-parse 规则。 | Step 9 flow、Step 11 persistence、Step 13 retry/resume 必须闭口 cursor 来源。 |
| safe diagnostic | fake / durable 对 blocked / unavailable / degraded 返回同类 redacted diagnostic / marker,不得泄露 raw SQL、HTTP、provider body 或 stack trace。 | Step 12 error recovery、Step 15 observability 和 Step 16 tests 必须验证 safe surface。 |
| body-free boundary | fake / durable 都不得用 raw body、payload、source body、package body 或 provider body 作为 public decision source。 | Step 8 protocol、Step 9 flow、Step 14 external binding 必须继续保持 body-free。 |
| runtime availability | fake / durable 都通过 runtime assembly / adapter availability summary 暴露 required slot 状态。 | Step 14 config binding 和 Step 17 implementation handoff 需要给出同口径检查项。 |

### 6. Step 8~17 承接摘要

| 后续 Step | 承接内容 | 禁止反向新增 |
|---|---|---|
| Step 8 protocol contracts | protocol / event / job shell 只能暴露 application facade 所需 public shell;entry 不暴露 repository / adapter handle。 | 不因 API/worker/job shell 新增 repository 或 adapter trait。 |
| Step 9 function flows | flow 必须经 application port family 访问 truth、material、resolver、publisher、handoff 和 runtime availability。 | 不在 flow 中让 entry、domain 或 infra adapter 直接承担业务 judgement。 |
| Step 10 state machine | state owner 与 transition 必须引用 Step 6 对象和 Step 7 port family 的正式读写面。 | 不把 adapter binding、scheduler、transport 或 product failure 误写成 domain state。 |
| Step 11 persistence / transaction | durable store 必须与 fake 共享 version、cursor、UoW、stored result 和 rollback 语义。 | 不用具体 DB / table / SQL 反推 Step 7 port contract。 |
| Step 12 errors / recovery | blocked / unavailable / degraded / conflict / replay failure 必须来自正式 port outcome 或 mapper summary。 | 不从 raw error、exception text、HTTP status 或 SQL code 拼 public reason。 |
| Step 13 concurrency / idempotency | idempotency、stored result、checkpoint、resume、duplicate replay 必须回指 R7.8 / R7.18 / R7.20 parity。 | 不允许 fake-only replay、entry-local dedup 或 adapter-private checkpoint。 |
| Step 14 config dependencies | config 只能绑定 runtime slot、target registry、adapter availability 和 validated assembly。 | 不把 config key、secret、URL、topic 或 product shape 写回 Step 7 作为 port 真相。 |
| Step 15 observability / audit | observability 只能记录 safe refs、markers、binding state、run state 和 redacted diagnostic。 | 不记录 raw body、payload、provider response、secret 或 implementation stack trace。 |
| Step 16 test cut | 测试必须覆盖 facade-only entry、fake / durable parity、runtime precheck、no direct repository shortcut。 | 不用测试专用 private map、private method 或 direct store mutation 证明正式 flow。 |
| Step 17 implementation handoff | 实施计划必须把 infra adapter map、runtime builder slot、entry restriction、parity gate 转成 boundary gate。 | 不把未定义的 DB/queue/product/schema 作为可直接编码范围。 |

### 7. `R7.21` 进入门禁

| 项 | 内容 |
|---|---|
| 当前允许 | 只思考跨模块接缝审计,重点检查重复 port、反向依赖、缺读取面、缺 version / cursor 来源、缺 mapper / marker 来源、fake / durable 不等价、entry direct-call 风险和 Step 8~17 承接断点。 |
| 必须使用 | `R7.8`~`R7.20` 已固定的基础 helper、truth repository、support / material repository、resolver / mapper / builder、inbound / publisher / handoff、maintenance / runtime 和 infra / entry restriction family。 |
| 当前禁止 | 不写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 infra implementation family map | 是。 |
| 是否写入 runtime builder slot map | 是。 |
| 是否写入 api / worker / jobs entry restriction map | 是。 |
| 是否写入 fake / durable parity 规则 | 是。 |
| 是否写入 Step 8~17 承接摘要 | 是。 |
| 是否形成 `R7.21` 进入门禁 | 是。 |
| 是否写具体 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.21`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.21 跨模块接缝审计:先思考`;只允许思考重复 port、反向依赖、缺读取面、缺 version / cursor 来源、缺 mapper / marker 来源、fake / durable 不等价、entry direct-call 风险和 Step 8~17 承接断点;必须承接 `R7.8`~`R7.20` 已固定的 port / adapter family;不得直接修改正式 `03-详细设计.md`;不得写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.22`、Step 8 或后续 Step。

---

## R7.21 跨模块接缝审计:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.21 跨模块接缝审计:先思考`。 |
| 本模块目标 | 基于 `R7.8`~`R7.20` 已固定的 port / adapter family,先形成跨模块接缝审计轴、初步风险判断、`R7.22` 写入边界和停审条件。 |
| 当前状态 | completed |
| 当前允许 | 只思考重复 port、反向依赖、缺读取面、缺 version / cursor 来源、缺 mapper / marker 来源、fake / durable 不等价、entry direct-call 风险和 Step 8~17 承接断点。 |
| 当前禁止 | 不写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. L1-governance 框架参考裁剪

| L1-governance 审计框架 | L3-method-library 采用方式 | 不复制内容 |
|---|---|---|
| Step 6 open item closure | 本仓改为检查 Step 6 对象 / helper / state owner 是否都被 R7 family 承接,并标出后续 Step 承接点。 | governance 的 open item 编号和领域对象。 |
| 模块内停审记录 | 按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七实现单元检查 owner 越界。 | governance 的 context / decision / approval / policy 语义。 |
| 跨模块接缝闭环表 | 采用 duplicate port、反向依赖、读取面、version、body-free、entry restriction、fake / durable parity 等审计轴。 | governance 的 repository 名称、outbox payload 细节和 projection 具体语义。 |
| 后续 Step 承接 | 检查 Step 8~17 是否已有可继续展开的正式来源,并明确禁止反向新增。 | governance 的 DTO / flow / state 表述。 |

### 3. 审计输入池

| 输入 family | 已固定内容 | 本轮审计关注 |
|---|---|---|
| `R7.8` application 基础 helper | UnitOfWork、Clock、IdGenerator、page / version helper、stored result、checkpoint / progress helper。 | 是否所有写入面都有 version / UoW 来源,是否 cursor / checkpoint 被误当 version。 |
| `R7.10` core truth repository | definition、catalog、formalization state、formal version、committed truth snapshot reader。 | 是否 truth / snapshot / material 分层清楚,是否 current lookup 替代 exact identity。 |
| `R7.12` support / material / relation repository | basis / external summary、consumption / trace material、impact、audit、lineage、relation、package、assembly。 | 是否 support / material / peripheral family 与 core truth、resolver、discovery builder 重叠。 |
| `R7.14` resolver / mapper / builder | basis resolver、policy diagnostic builder、availability resolver、query read resolver、degraded mapper、distribution / discovery builder、marketplace context resolver。 | 是否 marker / diagnostic / degraded / read subject 均有正式来源,是否 Query service 越权装配。 |
| `R7.16` inbound / publisher / handoff | inbound source、external body-free adapter、event candidate publisher、collaboration handoff、target registry。 | 是否 worker / jobs 越权解释 source、publication、handoff 或 config target。 |
| `R7.18` jobs / maintenance / runtime | task、progress、run history、target planner、checkpoint、recovery issue、runtime assembly registry、adapter availability。 | 是否 task truth、progress view、checkpoint、issue、runtime availability 分层清楚。 |
| `R7.20` infra / entry restriction | infra implementation family map、runtime builder slots、api / worker / jobs facade-only restriction、fake / durable parity。 | 是否 infra 只实现 application port,entry 是否仍可能拿到 repository / adapter concrete handle。 |

### 4. 审计轴思考

| 审计轴 | 需要检查的问题 | 初步判断 |
|---|---|---|
| duplicate port | 同一对象 / capability 是否被多个 repository / resolver / builder family 同时声明为 owner。 | 需在 `R7.22` 逐 family 对照;当前看见的重复风险主要在 snapshot reader vs target planner、external adapter vs external summary repository、runtime builder vs assembly registry。 |
| 反向依赖 | `domain` 是否定义 repository / adapter trait;`application` 是否依赖 infra;entry 是否直连 repository / adapter。 | 当前 R7.8~R7.20 均写明 `application` 是 port owner、`infra` 实现、entry facade-only,初步无越界结论。 |
| 读取面缺失 | 后续 Step 8~11 的 command / query / consumer / job 是否都有 exact read、stable lookup、page 或 snapshot reader。 | family 层已覆盖主要读取面;`R7.22` 需重点确认 query degraded、distribution builder、maintenance target planner 不依赖未声明读取源。 |
| version / cursor 来源 | mutable truth / material / marker / maintenance 是否都有 versioned read;cursor / checkpoint 是否被误用为 optimistic version。 | R7.8 / R7.10 / R7.12 / R7.18 已反复禁止混用,`R7.22` 需写成审计表。 |
| mapper / marker 来源 | read subject、visibility、freshness、degraded、safe diagnostic 是否都由 resolver / mapper / availability 输出。 | R7.14 已固定来源层;需审计 R7.16 / R7.18 的 unavailable / blocked outcome 是否都回到 safe outcome / availability / issue summary。 |
| fake / durable parity | fake 是否需要 private map、string parsing、durable-only schema 特性或测试专用入口。 | R7.20 已固定 parity 规则;`R7.22` 需把 version、cursor、safe diagnostic、runtime availability 分项写入。 |
| entry direct-call | api / worker / jobs 是否仍可能绕过 application facade。 | R7.20 已给禁止直连清单;`R7.22` 需按 entry module 写停审记录。 |
| body-free 边界 | external、inbound、publication、handoff、observability 是否可能泄露 raw body / payload / package body。 | R7.14 / R7.16 / R7.18 / R7.20 均已禁止;`R7.22` 需统一列入通过条件和暂停条件。 |
| 后续 Step 承接 | Step 8~17 是否能按本 Step family 继续,无需反向新增 port / schema / config key。 | 需要 `R7.22` 写清每个后续 Step 的可承接点与禁止反向新增点。 |

### 5. 初步风险清单

| 风险 | 当前判断 | `R7.22` 处理方式 |
|---|---|---|
| committed truth snapshot reader 与 refresh target planner 职责相邻 | 不是当前 blocker,但需要写清 reader 提供 committed truth body-free snapshot,planner 只展开 target batch / resume slice。 | 在 duplicate / owner cut-line 表中列入 watch item。 |
| external source summary repository 与 external body-free adapter 职责相邻 | 不是当前 blocker,但需要明确 repository 保存本地 summary,adapter 解析 typed external ref 的 body-free resolution。 | 在 resolver / repository 切口审计中列入。 |
| runtime builder 与 runtime assembly registry 职责相邻 | 不是当前 blocker,但需要明确 builder / config binding 后移 Step 14,registry 只暴露 validated assembly summary。 | 在 infra / runtime 审计中列入。 |
| stored result helper 尚未展开为具体 result variants | 不属于 R7.21 blocker,因为当前门禁禁止写协议 DTO / result schema;但 Step 8 / 13 必须承接。 | 在 Step 8 / 13 承接断点表中标注。 |
| Step 7 目前仍以 family / seam 级别为主 | 不属于 R7.21 blocker;具体 trait / port 草稿应在 `R7.23` / `R7.24` 回填草稿模块统一装配。 | `R7.22` 不写方法签名,只检查 family 闭口。 |

### 6. `R7.22` 写入边界

| `R7.22` 允许写入 | `R7.22` 禁止写入 |
|---|---|
| Step 6 承接闭环审计表。 | 新增 trait / port 方法签名、adapter method 或 repository contract 正文。 |
| 模块内停审记录: contracts / domain / application / infra / api / worker / jobs。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |
| 跨模块接缝闭环审计表: duplicate port、反向依赖、读取面、version / cursor、mapper / marker、fake / durable、entry restriction、body-free。 | 具体 DB / queue / HTTP / scheduler / object store / cache / transport / topic / migration / retry 细节。 |
| Step 8~17 承接断点表和 `R7.23` 回填草稿进入门禁。 | 正式 `03-详细设计.md` 或 implementation code。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否承接 `R7.8`~`R7.20` 已固定 family | 是。 |
| 是否参考 L1-governance 审计框架但未复制语义 | 是。 |
| 是否形成审计轴 | 是。 |
| 是否形成初步风险清单 | 是。 |
| 是否形成 `R7.22` 写入边界 | 是。 |
| 是否写新的 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.22`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.22 跨模块接缝审计:再写入`;只允许写入 Step 6 承接闭环审计表、模块内停审记录、跨模块接缝闭环审计表、Step 8~17 承接断点表和 `R7.23` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.23`、Step 8 或后续 Step。

---

## R7.22 跨模块接缝审计:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.22 跨模块接缝审计:再写入`。 |
| 本模块目标 | 将 `R7.21` 已形成的审计轴固化为 Step 7 承接闭环记录,确认 Step 7 family 层无新增 blocker,并形成 `R7.23` 回填草稿进入门禁。 |
| 当前状态 | completed |
| 当前产物 | Step 6 承接闭环审计表、模块内停审记录、跨模块接缝闭环审计表、Step 8~17 承接断点表和 `R7.23` 进入门禁。 |
| 禁止范围 | 不写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 6 承接闭环审计表

| Step 6 对象族 | Step 7 承接 family | 审计结论 | 后续 Step |
|---|---|---|---|
| contracts shared refs / markers / public shell | 基础 helper、read resolver、degraded mapper、entry restriction | 通过;Step 7 只引用 typed ref / safe marker / public shell,未把 DTO body 或 domain truth 放入 contracts。 | Step 8 protocol schema;Step 16 contract fixture |
| domain core truth | definition / catalog / formalization / formal version repository family;committed truth snapshot reader | 通过;truth、current lookup、history / snapshot reader 已切开,未恢复旧 publish / snapshot 主线。 | Step 9 command/query flow;Step 10 state;Step 11 persistence |
| domain support / trace / relation / peripheral | support / material / relation / package / assembly repository family | 通过;support summary、read material、relation truth、peripheral aggregate 已分层,未与 core truth 合并。 | Step 9 trace/relation/peripheral flow;Step 11 store;Step 15 audit |
| domain policy / guard / boundary | basis resolver、policy diagnostic builder、availability resolver、read resolver、degraded mapper、distribution / discovery builder | 通过;policy / guard 仍在 domain,port 只承接 resolution / diagnostic / builder 来源。 | Step 9 policy use point;Step 10 precondition;Step 12 rejection/degraded mapping |
| application helper / orchestration support | UnitOfWork、Clock、IdGenerator、page/version helper、stored result、checkpoint/progress helper | 通过;operation context、idempotency、stored result、read/degraded/job helper 均有 Step 7 承接层。 | Step 9 orchestration;Step 13 replay;Step 16 tests |
| infra adapter state / runtime support | infra implementation map、runtime builder slot、adapter availability、runtime assembly registry | 通过;infra 只实现 application port,不反向拥有业务 judgement、config truth 或 schema truth。 | Step 11 durable adapter;Step 14 binding;Step 17 implementation handoff |
| api / worker / jobs entry objects | entry restriction map、runtime precheck、application facade caller boundary | 通过;entry 只承接 local context / shell 转译 / precheck,禁止直连 repository、domain transition 和 concrete adapter。 | Step 8 entry shell;Step 9 entry flow;Step 16 no shortcut tests |

### 3. 模块内停审记录

| 实现单元 | 审查项 | 结论 | 需后续承接 |
|---|---|---|---|
| `contracts` | 是否被 Step 7 port 反向依赖 domain-only type 或 adapter state | pass | Step 8 再定义 command / query / event / job shell,不得反向新增 port。 |
| `domain` | 是否定义 repository / adapter trait 或读取 infra/config | pass | Step 10 只回指 domain truth / policy state owner,不得引入 repository owner。 |
| `application` | 是否是 repository / resolver / publisher / handoff / runtime family 的唯一 port owner | pass | `R7.23` 草稿需保持 application owner 清晰。 |
| `infra` | 是否只实现 application port 且不决定业务 judgement | pass | Step 11 / 14 才展开 durable schema / binding,不得回写 Step 7。 |
| `api` | 是否只能调用 application command / query facade | pass | Step 8 / 9 继续保持 handler shell -> facade。 |
| `worker` | 是否只能调用 application consumer / publisher orchestration | pass | Step 12 / 13 再定义 unsupported / retry / replay,不得私有分类。 |
| `jobs` | 是否只能调用 application job facade,且不能直接修 truth | pass | Step 9 / 13 / 17 承接 checkpoint、target planner、stored result。 |

### 4. 跨模块接缝闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| duplicate port | pass_with_watch | committed truth snapshot reader vs refresh target planner、external summary repository vs external adapter、runtime builder vs runtime assembly registry 已列为 watch,当前职责切口足够清楚。 |
| 反向依赖 | pass | `application` 定义 port,`infra` 实现,entry 只调用 facade;未出现 domain -> application / infra 或 application -> infra 反向依赖。 |
| 读取面缺失 | pass_with_watch | family 层覆盖 exact read、stable lookup、page、current helper、snapshot reader、target planner;具体方法面留给 `R7.23` / `R7.24` 草稿。 |
| version / cursor 来源 | pass | version 只来自 versioned read / lookup / list item;page cursor、truth cursor、checkpoint、resume anchor 均不得替代 optimistic version。 |
| mapper / marker 来源 | pass | marker / decision / degraded / diagnostic 来源回到 policy output、resolver summary、builder output、adapter availability或 safe outcome。 |
| fake / durable parity | pass | fake / durable 必须共享 port surface、identity、version、cursor、safe diagnostic、runtime availability 和 no-string-parse 规则。 |
| entry direct-call | pass | api / worker / jobs 禁止直连 repository、UnitOfWork、domain transition、publisher / handoff concrete adapter、scheduler / queue product。 |
| body-free boundary | pass | external、inbound、publication、handoff、audit、observability、peripheral 均禁止 raw body / payload / provider body / package body / report body。 |
| product binding leakage | pass | DB、queue、HTTP、scheduler、object store、cache、transport、topic、migration、retry 均未进入 Step 7 contract 语义。 |
| Step 8~17 承接 | pass | 后续 Step 可按当前 family 展开;若后续需要新增 schema / mapper / config / evidence 来源,必须回到对应 Step 闭口。 |

### 5. Step 8~17 承接断点表

| 后续 Step | 可承接内容 | 暂停条件 |
|---|---|---|
| Step 8 protocol contracts | public shell 只能复制 Step 7 family 的 typed refs、safe marker、decision summary、event/job shell boundary。 | DTO 需要 raw body、repository handle、adapter concrete type 或未闭口 result variant。 |
| Step 9 function flows | flow 按 application port family 调用 truth、material、resolver、publisher、handoff、maintenance、runtime availability。 | flow 现场生成 version、marker、diagnostic、target batch、publication outcome 或 handoff failure mapping。 |
| Step 10 state machine | 状态主语回指 Step 6 对象和 Step 7 read/write family。 | progress / history / adapter availability 被误写成 core truth lifecycle。 |
| Step 11 persistence / transaction | durable schema 只实现 Step 7 family 所需 identity、version、page、UoW、stored result、checkpoint。 | DB schema 反向新增 port 语义、product key 或 private lookup。 |
| Step 12 errors / recovery | blocked / unavailable / degraded / conflict / failed outcome 复制 safe outcome、mapper、availability、issue summary。 | 需要 raw exception、HTTP status、SQL code、provider body 或 stack trace 才能分类。 |
| Step 13 concurrency / idempotency | duplicate replay、stored result、checkpoint resume、UoW rollback 回指基础 helper和 maintenance runtime family。 | replay 需要重跑 mutation、entry-local dedup、fake-only map 或 adapter-private checkpoint。 |
| Step 14 config dependencies | config 只绑定 runtime slot、adapter availability、target registry、source/publisher/handoff binding。 | config key、secret、URL、topic、cron 或 product shape 成为业务 fact。 |
| Step 15 observability / audit | 只记录 safe refs、markers、binding state、run state、redacted diagnostic、handoff hint。 | observability 保存 raw payload、provider response、package/report body 或 secret。 |
| Step 16 test cut | 覆盖 facade-only entry、fake / durable parity、version / cursor、body-free、degraded / unavailable、stored result。 | 测试需要 private method、direct store mutation、string parsing 或 concrete adapter shortcut。 |
| Step 17 implementation handoff | 把 family map、entry restriction、runtime slot、parity gate、pause condition 转成 implementation boundary。 | 实施计划把未定义 schema / config / retry / transport 细节列为可直接编码范围。 |

### 6. `R7.23` 进入门禁

| 项 | 内容 |
|---|---|
| 当前允许 | 只思考 Step 7 回填草稿的章节框架、family 分组顺序、保留/压缩规则、不可回填内容和 `R7.24` 写入边界。 |
| 必须使用 | `R7.8`~`R7.22` 已固定的基础 helper、truth repository、support / material repository、resolver / mapper / builder、inbound / publisher / handoff、maintenance / runtime、infra / entry restriction 和审计结论。 |
| 当前禁止 | 不修改正式 `03-详细设计.md`;不写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 6 承接闭环审计表 | 是。 |
| 是否写入模块内停审记录 | 是。 |
| 是否写入跨模块接缝闭环审计表 | 是。 |
| 是否写入 Step 8~17 承接断点表 | 是。 |
| 是否形成 `R7.23` 进入门禁 | 是。 |
| 是否写新的 trait / port 方法签名 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R7.23`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.23 回填草稿:先思考`;只允许思考 Step 7 回填草稿的章节框架、family 分组顺序、保留/压缩规则、不可回填内容和 `R7.24` 写入边界;必须承接 `R7.8`~`R7.22` 已固定的 family 和审计结论;不得直接修改正式 `03-详细设计.md`;不得写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.24`、Step 8 或后续 Step。

---

## R7.23 回填草稿:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.23 回填草稿:先思考`。 |
| 本模块目标 | 思考新 §7 `Trait / Port / Adapter 契约` 的中间草稿框架、family 分组顺序、保留 / 压缩规则、不可回填内容和 `R7.24` 写入边界。 |
| 当前状态 | completed |
| 当前允许 | 只思考回填草稿结构,不写正式文档,不新增 port 正文。 |
| 当前禁止 | 不修改正式 `03-详细设计.md`;不写新的 trait / port 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |

### 2. 正式文档现状与处理

| 项 | 当前判断 | 处理方式 |
|---|---|---|
| 正式 `03-详细设计.md` 当前 §7 | 仍是旧 `API / Command / Query / Event / Job 协议契约` 章节。 | 视为 historical_material;本模块不改正式文档。 |
| 当前 Step 7 目标章节 | 新的 §7 应是 `Trait / Port / Adapter 契约`。 | `R7.24` 只在中间产物写候选草稿,供后续正式装配模块使用。 |
| 旧 §6 `全局对象 / Trait / API 索引` | 仍含旧索引和旧模块命名。 | 不从旧索引恢复 trait / port 结论。 |
| 正式章节编号冲突 | 旧正式文档编号与 full-restart flow 不一致。 | 等 Step 19 或正式装配模块统一重排;当前只写新 §7 候选草稿。 |

### 3. 新 §7 候选章节框架

| 候选小节 | 内容边界 | 来源 |
|---|---|---|
| §7.1 Port owner 与依赖边界 | application 是 port owner;infra 是 adapter implementation owner;entry 只调用 facade;domain / contracts 不定义 repository。 | R7.1~R7.4;R7.20;R7.22 |
| §7.2 基础 helper / operation support port family | UnitOfWork、Clock、IdGenerator、page/version helper、stored result、checkpoint/progress helper 的 family 级契约。 | R7.8 |
| §7.3 Core truth repository family | definition、catalog、formalization state、formal version、committed truth snapshot reader。 | R7.10 |
| §7.4 Support / material / relation / peripheral repository family | basis / external summary、consumption / trace material、impact、audit、lineage、relation、package、assembly。 | R7.12 |
| §7.5 Resolver / mapper / builder family | basis resolver、diagnostic builder、availability resolver、query read resolver、degraded mapper、distribution / discovery builder。 | R7.14 |
| §7.6 Inbound / publisher / handoff family | inbound source、external body-free adapter、event candidate publisher、collaboration handoff、target registry。 | R7.16 |
| §7.7 Jobs / maintenance / runtime family | maintenance task/progress/history、target planner、checkpoint、recovery issue、runtime assembly、adapter availability。 | R7.18 |
| §7.8 Infra implementation 与 entry restriction | infra adapter map、runtime builder slots、api / worker / jobs 禁止直连、fake / durable parity。 | R7.20 |
| §7.9 接缝闭环与后续 Step 承接 | Step 6 承接闭环、模块内停审、跨 family 审计、Step 8~17 承接断点。 | R7.22 |

### 4. family 分组顺序思考

| 顺序 | 分组 | 原因 |
|---|---|---|
| 1 | owner / dependency boundary | 先确立谁定义 port、谁实现 adapter、谁只能调用 facade,避免后续 family 读者误判职责。 |
| 2 | 基础 helper | version、cursor、UoW、id、time、stored result 是所有 repository / job / replay 的共同前置。 |
| 3 | core truth repository | 先讲本仓 truth owner,再讲 support / material,防止 material 反向成为 truth。 |
| 4 | support / material / relation / peripheral repository | 承接非 core truth 的读取 / 保存面,为 resolver / builder 提供正式输入。 |
| 5 | resolver / mapper / builder | 在 repository 之后,说明 marker、diagnostic、read decision、distribution / discovery 的来源。 |
| 6 | inbound / publisher / handoff | 在 resolver / builder 之后,说明外部输入和协作输出的 body-free safe outcome。 |
| 7 | jobs / maintenance / runtime | 在基础和外部接缝之后,说明后台任务、checkpoint、runtime availability 和 recovery issue。 |
| 8 | infra / entry restriction | 最后固定实现落点、runtime slot 和 facade-only 禁令。 |
| 9 | audit / handoff | 收口 Step 8~17 承接和暂停条件。 |

### 5. 保留 / 压缩规则

| 内容类型 | 回填草稿处理 |
|---|---|
| family 名称、owner、调用方、实现方、输入 / 输出语义、禁止事项 | 保留,这是 Step 7 可落码价值。 |
| 每个先思考模块的推理过程 | 压缩,只保留最终裁决和关键禁止事项。 |
| 重复的 “不得写 DTO / flow / schema / config / test” | 合并成章节总红线和 family 表中的重点禁令。 |
| R7.21 / R7.22 审计表 | 保留摘要,不逐字复制所有过程。 |
| L1-governance 参考说明 | 只保留“framework_reference,不复制语义”的一句说明。 |
| historical old Step 7 污染说明 | 保留短段,防止后续装配误用旧 §27 / old repository list。 |

### 6. 不可回填内容

| 不可回填项 | 原因 |
|---|---|
| 新的具体 trait 方法签名 / Rust trait code block | 当前 Step 7 family 级契约尚未进入方法签名草稿门禁;且用户要求逐模块讨论。 |
| adapter method、SQL / table / index、DB / queue / HTTP / scheduler / topic / retry 细节 | 属于 Step 11 / Step 14 / 实施计划,不能反向污染 Step 7。 |
| Command / Query / Event / Job DTO body | 属于 Step 8。 |
| function flow、transaction order、state transition matrix | 属于 Step 9 / Step 10 / Step 11。 |
| config key、secret、profile、URL、topic、cron | 属于 Step 14。 |
| test case schema、evidence schema、implementation boundary | 属于 Step 16 / Step 17 / 后续实施计划。 |
| 正式 `03-详细设计.md` 直接修改 | 当前只写中间产物,正式装配后移。 |

### 7. `R7.24` 写入边界

| `R7.24` 允许写入 | `R7.24` 禁止写入 |
|---|---|
| 新 §7 `Trait / Port / Adapter 契约` 候选草稿,写在本中间产物中。 | 修改正式 `03-详细设计.md`。 |
| §7.1~§7.9 小节框架、family 表、owner / caller / implementer / input-output / forbidden /后续承接摘要。 | 新增具体 trait 方法签名、adapter method、repository contract 正文或 Rust trait code block。 |
| 历史污染过滤摘要和 Step 8~17 承接摘要。 | protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| `R7.25 自检与停审:先思考` 进入门禁。 | 进入 Step 8 或后续 Step。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否识别正式文档当前 §7 仍为 historical_material | 是。 |
| 是否形成新 §7 候选章节框架 | 是。 |
| 是否形成 family 分组顺序 | 是。 |
| 是否形成保留 / 压缩规则 | 是。 |
| 是否形成不可回填内容清单 | 是。 |
| 是否形成 `R7.24` 写入边界 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否写新的 trait / port 方法签名 | 否。 |
| 是否进入 `R7.24`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.24 回填草稿:再写入`;只允许在本中间产物中写入新 §7 `Trait / Port / Adapter 契约` 候选草稿、family 表、owner / caller / implementer / input-output / forbidden / 后续承接摘要、历史污染过滤摘要、Step 8~17 承接摘要和 `R7.25` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写新的具体 trait 方法签名、adapter method、repository contract 正文、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.25`、Step 8 或后续 Step。

---

## R7.24 回填草稿:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.24 回填草稿:再写入`。 |
| 本模块目标 | 在本中间产物中写入新 §7 `Trait / Port / Adapter 契约` 候选草稿,供后续正式装配使用。 |
| 当前状态 | completed |
| 当前产物 | 新 §7 候选草稿、family 表、历史污染过滤摘要、Step 8~17 承接摘要和 `R7.25` 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写具体 trait 方法签名、adapter method、repository contract 正文、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或 implementation code。 |

### 2. 新 §7 候选草稿:Trait / Port / Adapter 契约

> 本节是候选草稿,只写在 calibration artifact 中。正式 `03-详细设计.md` 当前 §7 仍是旧 API 协议章节,不得在本模块直接替换。

#### §7.1 Port owner 与依赖边界

| 实现单元 | Step 7 职责 | 可以依赖 | 明确禁止 |
|---|---|---|---|
| `contracts` | 提供 typed ref、public shell、safe marker、协议壳所需共享类型。 | 无 application / domain / infra 反向依赖。 | 定义 repository、resolver、UnitOfWork、adapter trait 或 domain transition。 |
| `domain` | 定义对象、value object、policy、guard、invariant 和 judgement boundary。 | contracts shared refs / markers。 | 定义 repository / external adapter trait;读取 config / infra / runtime。 |
| `application` | 唯一 port owner;定义 repository、resolver、mapper、publisher、handoff、runtime、UoW、stored result family。 | contracts、domain。 | 依赖 infra concrete adapter;从 raw body / config / route / string 自行补 schema。 |
| `infra` | 实现 application port;提供 fake / durable adapter、runtime assembly、binding support。 | contracts、domain、application port。 | 决定业务 judgement;新增未闭口 truth schema;暴露 raw provider / transport / DB 细节。 |
| `api` | 调用 application command / query facade,完成 entry shell 转译和 runtime precheck。 | contracts、application facade、entry-visible runtime summary。 | 直连 repository、UnitOfWork、domain transition、resolver、publisher、handoff、concrete adapter。 |
| `worker` | 调用 application inbound / publication facade,处理 worker local context。 | contracts、application facade、entry-visible runtime summary。 | 解释 raw payload 业务语义;直连 store、publisher adapter、handoff adapter、retry/dead-letter product。 |
| `jobs` | 调用 application job facade,处理 runner context、checkpoint resume 和 job result shell。 | contracts、application job facade、entry-visible runtime summary。 | 直接修 truth;直连 repository / adapter / scheduler / queue / report body store。 |

全局规则:

- `application` 是所有正式 port family 的唯一 owner。
- `infra` 是 application port 的实现方,不是业务事实或 judgement owner。
- entry crate 只进入 facade,不得通过测试便利或 runtime wiring 绕过 application。
- Step 7 只闭合 seam / family 级契约,不写 Rust trait 方法签名。

#### §7.2 基础 helper / operation support port family

| family | owner | caller | implementer | 输入 / 输出语义 | 禁止事项 | 后续承接 |
|---|---|---|---|---|---|---|
| UnitOfWork / transaction boundary | application | command / consumer / job service | infra | typed transaction boundary、expected version、commit / rollback summary | service 私有 transaction handle;entry 直接开事务 | Step 9 / 11 / 13 / 16 |
| Clock | application | command / query / job service | application-local 或 infra | safe time source、可测试时间戳 | domain / entry / adapter 直接读系统时间生成业务事实 | Step 9 / 15 / 16 |
| IdGenerator | application | command / consumer / job service | application-local 或 infra | typed id / ref / result id / checkpoint id | 从 raw string、route、payload 拼接 ref | Step 9 / 11 / 13 |
| page / version helper | application | query / read / trace / job service | application-local | opaque page cursor、version wrapper、page ordering summary | cursor 替代 optimistic version;字符串解析 cursor | Step 8 / 9 / 11 / 12 |
| stored result / replay helper | application | command / consumer / job service | infra | accepted / rejected / ignored result summary、duplicate replay source | duplicate replay 重跑 mutation;entry-local dedup | Step 11 / 13 / 16 |
| checkpoint / progress helper | application | job service / jobs entry | application + infra | checkpoint、resume anchor、progress continuation summary | 用 retry count、queue offset、timestamp 代替 checkpoint | Step 9 / 11 / 13 / 15 |

#### §7.3 Core truth repository family

| family | owner | caller | implementer | 输入 / 输出语义 | 禁止事项 | 后续承接 |
|---|---|---|---|---|---|---|
| `MethodAssetDefinitionRepository` | application | command / query service | infra | definition exact read、identity lookup、versioned save | 从 catalog view / route / raw name 反推 definition | Step 9 / 10 / 11 |
| `MethodAssetCatalogEntryRepository` | application | command / query service | infra | catalog exact read、scope lookup、scoped page、versioned save | 用 query material / search index 当 catalog truth | Step 9 / 10 / 11 |
| `FormalizationStateRepository` | application | command / query service | infra | formalization state exact read、current-state lookup、versioned save | 从 current version / trace / state_kind 反推 state owner | Step 9 / 10 / 12 |
| `FormalMethodAssetVersionRepository` | application | command / query service | infra | formal version exact read、current version lookup、history/list、supersession pairing | 用 latest timestamp、旧 publish lifecycle、fingerprint 推 current | Step 9 / 10 / 11 |
| `MethodAssetCommittedTruthSnapshotReader` | application | projection / reconciliation / export flow | infra | committed body-free refs / summaries by truth anchor / scope | 复活旧 snapshot repo;复制 truth body;替代 query assembler | Step 9 / 11 / 17 |

core truth repository 不承接 `FormalizationBasisSummary` 或 `MethodAssetConsumptionMaterial`。basis summary 和 consumption material 必须走 support / material family。

#### §7.3A commit-03-b current-boundary callable surface

`commit-03-b` 当前可实现边界只覆盖 definition/catalog accepted service vertical slice。实现侧必须使用下列 exact callable surface,不得把 §7.3 的 family-level 语义扩成自选方法名或私有 fake 规则。

| surface | exact current-boundary item | rule |
|---|---|---|
| command family carrier | `MethodAssetCommandFamilyKind` uses `MethodLibraryCapabilityKind`;only `DefinitionCatalog` is accepted in this boundary。 | API entry must safe-reject all non-definition/catalog command families。 |
| dispatch marker | `MethodAssetApplicationDispatchRef::DefinitionCatalogCommandService` or equivalent opaque application marker。 | Not a route string,config key,type-name string or service locator。 |
| facade | `MethodAssetDefinitionCatalogCommandFacade.dispatch_definition_catalog_command(input)`。 | API calls facade only;no repository/domain/UoW direct access。 |
| service methods | `establish_definition`;`adjust_definition`;`retire_definition`;`register_catalog_entry`;`reclassify_catalog_entry`;`retire_catalog_entry`。 | These are application-internal command inputs built from closed shell refs/markers and Step 6 carriers,not public DTO schemas。 |
| version carriers | `Versioned<T>`;`VersionedRef<TRef>`;`MethodAssetRepositoryVersion`;`MethodAssetExpectedVersion`。 | Version comes only from repository read/save;never from timestamp,cursor,digest or typed ref string。 |
| UoW | `begin_command_uow`;writes via repositories and stored-result repository;explicit `commit` / `rollback`。 | Entry cannot create UoW;repository cannot auto-commit。 |
| definition repository | `get_definition_with_version`;`find_definition_by_identity_key`;`save_definition`。 | Create uses `expected_version=None`;update uses loaded version。 |
| catalog repository | `get_catalog_entry_with_version`;`find_catalog_entry_by_definition_scope`;`save_catalog_entry`。 | Scope uniqueness is `(definition_ref,catalog_scope_ref)`。 |
| stored result repository | `find_command_result_by_idempotency`;`get_stored_operation_result`;`save_command_result_for_idempotency`。 | Duplicate replay copies stored safe result;digest conflict returns safe stored conflict/rejection。 |

Current-boundary fake parity requires staged UoW writes, rollback invisibility, repository version conflict, stable uniqueness and duplicate replay without mutation rerun. `ExternalSourceSummaryRefSet` in this boundary is validated as named typed refs only; durable external summary/source adapter dereference remains `commit-07-a`.

`commit-03-b` does not expose `FormalMethodAssetVersionRepository` callable methods. `retire_definition` must not inspect linked formal versions, active formal-version conflicts, history pages, supersession state or consumption material in this boundary. Those checks belong to PH-04 formalization/version implementation after Step 7 closes the exact formal-version repository surface.

#### §7.4 Support / material / relation / peripheral repository family

| family | owner | caller | implementer | 输入 / 输出语义 | 禁止事项 | 后续承接 |
|---|---|---|---|---|---|---|
| `FormalizationBasisSummaryRepository` | application | formalization / basis query service | infra | basis summary exact read、basis-source lookup、versioned support save | 顺带做 basis resolver 或读取治理正文 | Step 9 / 11 |
| `ExternalSourceSummaryRepository` | application | inbound / external query service | infra | external summary exact read、source lookup、acceptance page | 从 URL、artifact path、provider payload 反推 identity | Step 9 / 11 / 14 |
| `MethodAssetConsumptionMaterialRepository` | application | consumption query / refresh service | infra | consumption material exact read、version/context resolution、freshness / cursor | Query 现场创建 material 或扫描下游 truth | Step 8 / 9 / 11 / 12 |
| `MethodAssetTraceMaterialRepository` | application | trace query / refresh service | infra | trace material exact read、subject lookup、freshness / cursor | 从字符串、旧对象名、artifact path、private map 反推 subject | Step 9 / 11 / 15 |
| `ConsumptionImpactSummaryRepository` | application | impact query / job service | infra | impact summary exact read、pending / unknown page、versioned save | 把 unknown / pending 折叠成 no-effect | Step 9 / 10 / 12 |
| `MethodAssetAuditTrailRepository` | application | command / query / observability assembly | infra | audit trail exact read、subject lookup、versioned trail save | 用 raw log / telemetry / request body 生成 identity | Step 9 / 11 / 15 |
| `MethodAssetEvidenceLineageRepository` | application | lineage query / audit service | infra | lineage exact read、trace subject lookup、linked page | 用 evidence / archive / report body 定位 lineage | Step 9 / 11 / 15 |
| `MethodAssetRelationRepository` | application | relation command / query service | infra | relation exact read、endpoint / context lookup、versioned save | 顺带生成 distribution material 或 publisher candidate | Step 9 / 10 / 11 |
| `MethodPackageRepository` | application | package / peripheral service | infra | package exact read、context / member page、versioned save | 承接 listing、交易态、安装态、UI state | Step 9 / 10 / 11 |
| `MethodSetAssemblyRepository` | application | assembly / peripheral service | infra | assembly exact read、package / member scope page、versioned save | 承接组织运行 truth、履约状态或 discovery adapter | Step 9 / 10 / 11 |

#### §7.5 Resolver / mapper / builder family

| family | owner | caller | implementer | 输入 / 输出语义 | 禁止事项 | 后续承接 |
|---|---|---|---|---|---|---|
| `FormalizationBasisResolverPort` | application | formalization / eligibility service | infra | body-free basis resolution、pending / insufficient / rejected marker | 保存 basis summary;读取标准正文 / artifact body | Step 8 / 9 / 12 |
| `MethodAssetPolicyDiagnosticBuilderPort` | application | command / query precheck service | infra + domain policy inputs | body-free diagnostic summary、safe reason、follow-up hint | Query service 拼 diagnostic DTO;domain policy 依赖 repository | Step 8 / 9 / 12 |
| `MethodAssetConsumptionAvailabilityResolverPort` | application | consumption query / refresh service | infra | ready / stale / unavailable / constrained availability summary | 创建 material;读取下游运行 truth / UI state | Step 8 / 9 / 10 / 12 |
| `MethodAssetQueryReadResolverPort` | application | query service | infra | read subject、read source、scope / visibility / freshness resolution | 从 route、raw id、private map 推 subject / marker | Step 8 / 9 / 10 |
| `MethodAssetDegradedDecisionMapperPort` | application | query / error handling service | infra | degraded mapping summary、safe diagnostic、marker、hint | 从 error text、stack trace、SQL / HTTP detail 分类 | Step 8 / 9 / 12 / 15 |
| `DistributionReadMaterialBuilderPort` | application | relation / distribution query service | infra | body-free distribution material summary | 修改 relation truth;读取 marketplace listing / package body | Step 8 / 9 / 11 |
| `PeripheralDiscoveryContextBuilderPort` | application | peripheral query service | infra | body-free discovery context、package / assembly refs | 返回价格、订单、安装、履约、UI 数据 | Step 8 / 9 / 17 |
| `MarketplaceContextRefResolverPort` | application | discovery builder / peripheral service | infra | marketplace context body-free summary 或 unavailable summary | 成为 transaction / install / fulfillment adapter | Step 8 / 9 / 14 |

#### §7.6 Inbound / publisher / handoff family

| family | owner | caller | implementer | 输入 / 输出语义 | 禁止事项 | 后续承接 |
|---|---|---|---|---|---|---|
| `MethodAssetInboundSourcePort` | application | worker facade | infra | body-free source envelope summary、schema / version、dedup key、safe intake summary | worker 解释 raw payload 或直接创建 truth | Step 8 / 9 / 13 |
| `ExternalBodyFreeSourceAdapterPort` | application | application / jobs service | infra | typed external refs / artifact refs -> safe resolution summary | 返回 provider payload、credential、URL/path truth | Step 8 / 9 / 14 |
| `MethodAssetEventCandidatePublisherPort` | application | worker / jobs / application publisher facade | infra | event candidate -> published / blocked / unavailable / failed safe outcome | 定义 topic、payload schema、outbox、relay、retry | Step 8 / 9 / 12 / 14 |
| `MethodAssetCollaborationHandoffPort` | application | worker / jobs / application handoff facade | infra | handoff refs -> prepared / delivered / blocked / unavailable / failed outcome | 返回 report body、archive body、receipt body | Step 9 / 12 / 15 / 17 |
| `MethodAssetCollaborationTargetRegistryPort` | application | publication / handoff / job service | infra | enabled / disabled / blocked / unavailable target summary | 成为 config store、secret store 或 transport owner | Step 9 / 14 / 15 |

publication / handoff failed 不回滚 accepted truth。协作失败只能进入 safe outcome、diagnostic、hint 或后续 follow-up。

#### §7.7 Jobs / maintenance / runtime family

| family | owner | caller | implementer | 输入 / 输出语义 | 禁止事项 | 后续承接 |
|---|---|---|---|---|---|---|
| `MethodAssetMaintenanceTaskRepository` | application | job / maintenance service | infra | task truth exact read、run/scope/kind page、versioned state save | 保存 queue、lease、scheduler、thread lifecycle | Step 8 / 9 / 10 / 11 |
| `MethodAssetMaintenanceProgressViewRepository` | application | progress query / job result service | infra | body-free progress view、pending issue summary、task progress snapshot | 用 progress 反推 task 成功 / closed / superseded | Step 8 / 9 / 11 |
| `MethodAssetMaintenanceRunHistoryRepository` | application | job closure / run history query | infra | body-free run chronology、report / handoff linkage | 保存 report markdown、metrics body、worker log | Step 8 / 9 / 12 / 15 |
| `MethodAssetRefreshTargetPlannerPort` | application | refresh / recovery job service | infra | refresh scope -> target batch、committed snapshot summary、source cursor hint | 保存 refreshed material;修 truth;做 scheduler planning | Step 9 / 11 / 16 |
| `MethodAssetJobCheckpointStorePort` | application | jobs runner / application resume flow | infra | checkpoint、cursor continuation、partial continuation anchor | 用 version、retry count、queue offset、lease token 当 checkpoint | Step 9 / 11 / 13 |
| `MethodAssetRecoveryIssueRepository` | application | recovery / progress / query service | infra | recovery issue exact read、pending / blocked / intervention page | 保存 raw evidence、provider payload、repair algorithm | Step 8 / 9 / 10 / 12 |
| `MethodAssetRuntimeAssemblyRegistryPort` | application | api / worker / jobs precheck | infra | validated runtime assembly summary、binding slot summary、diagnostic policy | 拥有 config key、secret、builder internals | Step 9 / 12 / 14 |
| `MethodAssetAdapterAvailabilityPort` | application | entry precheck / service precheck / job service | infra | availability / degraded / unavailable summary、required-slot precheck | 从 raw IO error、HTTP / SQL detail 现场分类 | Step 9 / 12 / 14 / 15 |

#### §7.8 Infra implementation 与 entry restriction

| implementation / restriction | owner | 承接范围 | 禁止事项 | 后续承接 |
|---|---|---|---|---|
| truth repository adapters | infra | definition、catalog、formalization、version truth family | 写 SQL / table / index 作为 Step 7 事实 | Step 11 |
| support / material store adapters | infra | basis、external、consumption、trace、impact、audit、lineage、relation、package、assembly family | 在 adapter 内生成 policy judgement 或 public marker | Step 11 / 15 |
| resolver / builder adapters | infra | basis、availability、read、degraded、distribution、discovery family | 泄露 raw provider / source / listing / package body | Step 12 / 14 |
| inbound / publisher / handoff adapters | infra | inbound source、publisher、handoff、target registry family | 定义 transport product、topic、ack、retry、receipt body | Step 8 / 14 / 17 |
| maintenance / runtime adapters | infra | task、progress、history、planner、checkpoint、issue、runtime、availability family | 表达 scheduler、queue、lease、report body、metrics body | Step 11 / 13 / 14 |
| fake runtime harness | infra test support | 所有 application port family 的同口径 fake 实现 | fake-only private method、private map、string parsing shortcut | Step 16 |
| `api` entry restriction | api | command / query facade、runtime precheck、protocol assembler | repository / UoW / domain transition / concrete adapter direct call | Step 8 / 9 / 16 |
| `worker` entry restriction | worker | inbound / publisher facade、runtime precheck、worker context | broker ack store、publisher adapter、handoff adapter、retry product direct call | Step 8 / 9 / 16 |
| `jobs` entry restriction | jobs | job facade、runtime precheck、runner context | repository direct read/write、scheduler/queue product、truth repair helper | Step 8 / 9 / 16 |

fake / durable parity 必须覆盖 shared port surface、identity / version、page / cursor、safe diagnostic、body-free boundary 和 runtime availability。

#### §7.9 接缝闭环与后续 Step 承接

| 审计项 | 候选草稿结论 | 后续处理 |
|---|---|---|
| historical pollution | 旧正式 §7 API 协议章节、旧 §27、旧 repository 清单和旧 `MethodContent` / snapshot / outbox 主线均为 historical_material。 | 正式装配时不得直接继承旧章节。 |
| port owner | application 是唯一 port owner;infra 实现;entry 只调用 facade。 | Step 8 / 9 / 17 必须引用该边界。 |
| reading surface | family 层已覆盖 exact read、stable lookup、page、current helper、snapshot reader、target planner。 | 具体方法名若后续需要,必须在对应 Step / 装配门禁中补。 |
| version / cursor | version 只来自 versioned read / lookup / list item;cursor / checkpoint 不替代 optimistic version。 | Step 11 / 13 继续闭口。 |
| marker / diagnostic | marker、decision、degraded、diagnostic 来自 policy output、resolver summary、builder output、adapter availability 或 safe outcome。 | Step 8 / 12 / 15 只能复制正式来源。 |
| body-free | external、inbound、publication、handoff、audit、observability、peripheral 均不承接 raw body。 | Step 8 / 14 / 15 验证。 |
| product binding | DB、queue、HTTP、scheduler、object store、cache、transport、topic、migration、retry 不进入 Step 7 语义。 | Step 11 / 14 / 17 分别承接。 |

| 后续 Step | 承接摘要 | 暂停条件 |
|---|---|---|
| Step 8 | DTO / command / query / event / job shell 只能复制 Step 7 family 输出的 typed refs、safe marker、summary、result shell。 | 需要 raw body、repository handle、concrete adapter 或未闭口 result variant。 |
| Step 9 | flow 必须经 application port family 调用 truth、material、resolver、publisher、handoff、maintenance、runtime availability。 | flow 现场生成 version、marker、diagnostic、target batch、publication outcome。 |
| Step 10 | 状态主语回指 Step 6 对象和 Step 7 read/write family。 | 把 progress / binding / adapter failure 误写成 core truth lifecycle。 |
| Step 11 | durable schema 只实现 Step 7 family 所需 identity、version、page、UoW、stored result、checkpoint。 | DB schema 反向新增 port 语义、product key 或 private lookup。 |
| Step 12 | blocked / unavailable / degraded / conflict / failed outcome 复制 safe outcome、mapper、availability、issue summary。 | 需要 raw exception、HTTP status、SQL code、provider body 或 stack trace。 |
| Step 13 | duplicate replay、stored result、checkpoint resume、UoW rollback 回指基础 helper 和 maintenance runtime family。 | replay 需要重跑 mutation、entry-local dedup、fake-only map 或 adapter-private checkpoint。 |
| Step 14 | config 只绑定 runtime slot、target registry、adapter availability、validated assembly。 | config key、secret、URL、topic、cron 或 product shape 成为业务 fact。 |
| Step 15 | observability 只记录 safe refs、markers、binding state、run state、redacted diagnostic、handoff hint。 | 保存 raw payload、provider response、package/report body 或 secret。 |
| Step 16 | tests 覆盖 facade-only entry、fake/durable parity、version/cursor、body-free、degraded/unavailable、stored result。 | 测试依赖 private method、direct store mutation、string parsing 或 concrete adapter shortcut。 |
| Step 17 | implementation handoff 引用 family map、entry restriction、runtime slot、parity gate、pause condition。 | 未定义 schema / config / retry / transport 细节被列为可直接编码范围。 |

### 3. `R7.25` 进入门禁

| 项 | 内容 |
|---|---|
| 当前允许 | 只思考 Step 7 自检与停审,核对候选 §7 草稿是否覆盖 `R7.8`~`R7.24` family、是否仍有越界内容、是否可进入 `R7.26` 写入停审记录。 |
| 必须检查 | 正式 `03-详细设计.md` 未修改;候选草稿无具体 trait 方法签名;无 DTO / flow / state / persistence / config / test schema;flow 与项目台账同步到 `R7.25`。 |
| 当前禁止 | 不修改正式 `03-详细设计.md`;不进入 Step 8;不追加新的 port family 正文;不补方法签名或后续 Step schema。 |

### 4. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入新 §7 候选草稿 | 是。 |
| 是否覆盖 §7.1~§7.9 框架 | 是。 |
| 是否写入 family 表与 owner / caller / implementer / input-output / forbidden / handoff 摘要 | 是。 |
| 是否写入历史污染过滤摘要 | 是。 |
| 是否写入 Step 8~17 承接摘要 | 是。 |
| 是否形成 `R7.25` 进入门禁 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否写具体 trait 方法签名 / adapter method / repository contract 正文 | 否。 |
| 是否进入 `R7.25`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.25 自检与停审:先思考`;只允许思考 Step 7 候选 §7 草稿的完整性、自检轴、越界检查、正式文档未修改确认、Step 8 进入条件和 `R7.26` 写入边界;不得直接修改正式 `03-详细设计.md`;不得新增具体 trait 方法签名、adapter method、repository contract 正文、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R7.26`、Step 8 或后续 Step。

---

## R7.25 自检与停审:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.25 自检与停审:先思考`。 |
| 本模块目标 | 思考 Step 7 自检轴、候选 §7 草稿完整性、越界检查、正式文档未修改确认、Step 8 进入条件和 `R7.26` 写入边界。 |
| 当前状态 | completed |
| 当前允许 | 只思考自检和停审写入框架,不写 Step 7 final stop-review 结论,不进入 Step 8。 |
| 当前禁止 | 不修改正式 `03-详细设计.md`;不追加新的 port family 正文;不补具体 trait 方法签名、adapter method、repository contract、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema。 |

### 2. 自检轴思考

| 自检轴 | 检查问题 | 初步判断 | `R7.26` 写入方式 |
|---|---|---|---|
| 输入承接 | Step 7 是否承接 Step 6 对象 owner、field source、state owner、helper / marker / diagnostic 来源。 | 已承接;R7.8~R7.20 均回指 Step 6 对象族和 helper。 | 写入 Step 6 承接 pass 表。 |
| framework 对齐 | 是否参考 L1-governance 的框架深度,但不复制 governance 领域语义。 | 已对齐;只借鉴 owner / cut-line / parity / stop-review 结构。 | 写入 framework_reference pass 结论。 |
| family 覆盖 | 基础 helper、truth repository、support/material、resolver/mapper/builder、inbound/publisher/handoff、jobs/runtime、infra/entry 是否都覆盖。 | 已覆盖;R7.24 候选 §7.2~§7.8 已装配。 | 写入 family coverage 表。 |
| owner 边界 | application 是否为唯一 port owner,infra 是否只实现,entry 是否只调用 facade。 | 已固定;R7.24 §7.1 / §7.8 已写入。 | 写入 dependency boundary pass 表。 |
| 读取面闭口 | exact read、stable lookup、page、current helper、snapshot reader、target planner 是否 family 级覆盖。 | family 级覆盖;具体方法签名后续仍禁止自行补。 | 写入 read surface coverage 和 watch 项。 |
| version / cursor | optimistic version、page cursor、checkpoint、stored result 是否分离。 | 已分离;cursor / checkpoint 不替代 version。 | 写入 version/cursor pass 表。 |
| marker / diagnostic 来源 | read / degraded / availability / diagnostic / safe outcome 是否都有正式来源 family。 | 已覆盖 resolver / mapper / builder / availability / safe outcome family。 | 写入 marker source pass 表。 |
| body-free 边界 | external、inbound、publisher、handoff、audit、observability、peripheral 是否保持 body-free。 | 已保持;R7.24 明确禁止 raw body / provider payload / report body。 | 写入 body-free pass 表。 |
| fake / durable parity | fake 与 durable 是否共享 port surface、identity、version、cursor、safe diagnostic。 | 已形成 parity 规则;后续 Step 11 / 16 需承接。 | 写入 parity pass_with_handoff。 |
| 后续 Step 承接 | Step 8~17 是否有清晰承接和暂停条件。 | 已写 Step 8~17 承接摘要。 | 写入 handoff 表。 |

### 3. 越界检查思考

| 越界类型 | 当前检查口径 | 初步判断 |
|---|---|---|
| 正式文档修改 | `R7.25` 必须确认正式 `03-详细设计.md` 未修改。 | 当前应保持无 diff;`R7.26` 再写入确认。 |
| 具体方法签名 | Step 7 候选草稿不得写 Rust trait code block 或具体函数签名。 | 当前候选草稿保持 family / seam 粒度。 |
| repository contract 正文 | 不写 `get_*` / `save_*` 方法级契约正文。 | 当前只写 family 输入 / 输出语义。 |
| Protocol DTO | 不写 command / query / event / job DTO schema。 | 仍后移 Step 8。 |
| function flow | 不写流程顺序、transaction order 或分支处理流。 | 仍后移 Step 9。 |
| state matrix | 不写完整状态机和转换矩阵。 | 仍后移 Step 10。 |
| persistence | 不写 table、index、SQL、migration、store schema。 | 仍后移 Step 11。 |
| config | 不写 config key、secret、URL、topic、cron。 | 仍后移 Step 14。 |
| test / evidence | 不写 test case schema、fixture、evidence artifact。 | 仍后移 Step 16。 |

### 4. Step 8 进入条件思考

| 条件 | 判断 | 说明 |
|---|---|---|
| Step 7 当前模块全部 completed | 待 `R7.26` 写入后确认。 | `R7.25` 只思考,不能直接宣布 Step 7 completed。 |
| 候选 §7 草稿无越界内容 | 预期可通过。 | `R7.26` 需按越界表逐项确认。 |
| Step 8 所需 public shell 来源可回指 Step 7 family | 预期可通过。 | Step 8 DTO 只能复制 typed refs、safe marker、summary、result shell。 |
| Step 8 不得绕过 application facade / port family | 预期可通过。 | entry restriction 已在 R7.24 §7.8 固化。 |
| flow 与项目台账同步 | 待 `R7.26` 写入后同步。 | `R7.26` 应把 Step 7 标记 completed,Step 8 置为 wait_user_confirm。 |
| 正式 `03-详细设计.md` 仍未修改 | 待 `R7.26` 写入时复核。 | 正式装配仍后移,当前只维护中间产物。 |

### 5. `R7.26` 写入边界

| `R7.26` 允许写入 | `R7.26` 禁止写入 |
|---|---|
| Step 7 自检表、越界检查表、family coverage 表、Step 8 进入条件确认。 | 修改正式 `03-详细设计.md`。 |
| Step 7 stop-review 记录和 completed / wait_user_confirm_to_step8 状态。 | 新增具体 trait 方法签名、adapter method、repository contract 正文。 |
| 同步 `03_ddd_calibration_flow.md` 和 `project_execution_ledger.md` 到 Step 8 wait_user_confirm。 | 写 protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| 明确 Step 8 开工只能先进入 `R8.1`。 | 进入 Step 8 正文或后续 Step。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 7 自检轴思考 | 是。 |
| 是否完成越界检查思考 | 是。 |
| 是否形成 Step 8 进入条件思考 | 是。 |
| 是否形成 `R7.26` 写入边界 | 是。 |
| 是否写 Step 7 final stop-review 结论 | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否新增具体 trait 方法签名 / DTO / flow / state / persistence / config / test schema | 否。 |
| 是否进入 `R7.26`、Step 8 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.26 自检与停审:再写入`;只允许写入 Step 7 自检表、越界检查表、family coverage 表、Step 8 进入条件确认、Step 7 stop-review 记录,并同步 flow / 项目台账到 Step 8 wait_user_confirm;不得直接修改正式 `03-详细设计.md`;不得新增具体 trait 方法签名、adapter method、repository contract 正文、protocol DTO、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 Step 8 正文或后续 Step。

---

## R7.26 自检与停审:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R7.26 自检与停审:再写入`。 |
| 本模块目标 | 写入 Step 7 自检表、越界检查表、family coverage 表、Step 8 进入条件确认、Step 7 stop-review 记录,并同步到 Step 8 等待确认。 |
| 当前状态 | completed |
| 当前产物 | Step 7 final stop-review、Step 8 `R8.1` 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不新增具体 trait 方法签名、adapter method、repository contract 正文、protocol DTO、function flow、完整状态矩阵、persistence schema、config key、test case schema 或 Step 8 正文。 |

### 2. Step 7 自检表

| 自检轴 | 结论 | 证据 / 承接 |
|---|---|---|
| 输入承接 | pass | `R7.5`~`R7.6` 从 Step 6 对象 owner、field source、state owner、marker / decision / diagnostic 来源抽取 capability 候选池。 |
| framework 对齐 | pass | `R7.3`~`R7.4` 已参考 L1-governance Step 7 的框架深度、owner / cut-line / parity / stop-review 结构,未复制 governance 领域语义。 |
| family 覆盖 | pass | `R7.8`~`R7.20` 已覆盖基础 helper、truth repository、support / material、resolver / mapper / builder、inbound / publisher / handoff、jobs / runtime、infra / entry restriction。 |
| owner 边界 | pass | `application` 为唯一 port owner;`infra` 只实现 application ports;`api` / `worker` / `jobs` 只调用 application facade。 |
| 读取面闭口 | pass_with_watch | family 层已覆盖 exact read、stable lookup、page、current helper、committed snapshot reader、refresh target planner;具体方法签名仍后移,不得自行补。 |
| version / cursor | pass | optimistic version、page cursor、job checkpoint、stored result replay 已分离;cursor / checkpoint 不替代 version。 |
| marker / diagnostic 来源 | pass | read / degraded / availability / diagnostic / safe outcome 均回到 resolver、mapper、builder、adapter availability 或 safe outcome family。 |
| body-free 边界 | pass | external、inbound、publisher、handoff、audit、observability、peripheral family 均禁止 raw body、provider payload、report body、package body。 |
| fake / durable parity | pass_with_handoff | fake / durable parity 已形成 port surface、identity/version、page/cursor、safe diagnostic、runtime availability 规则;后续 Step 11 / 16 承接。 |
| Step 8~17 承接 | pass | `R7.22` 与 `R7.24` 已写入 Step 8~17 承接摘要和暂停条件。 |

### 3. family coverage 表

| 候选 §7 小节 | 覆盖内容 | 状态 | 后续 Step |
|---|---|---|---|
| §7.1 Port owner 与依赖边界 | contracts / domain / application / infra / api / worker / jobs 的职责与禁止依赖。 | pass | Step 8 / 9 / 17 |
| §7.2 基础 helper / operation support | UnitOfWork、Clock、IdGenerator、page/version helper、stored result、checkpoint/progress。 | pass | Step 9 / 11 / 13 / 16 |
| §7.3 Core truth repository | definition、catalog、formalization state、formal version、committed truth snapshot reader。 | pass | Step 9 / 10 / 11 |
| §7.4 Support / material / relation / peripheral repository | basis/external summary、consumption/trace material、impact、audit、lineage、relation、package、assembly。 | pass | Step 9 / 10 / 11 / 15 |
| §7.5 Resolver / mapper / builder | basis、policy diagnostic、availability、read、degraded、distribution、discovery、marketplace context。 | pass | Step 8 / 9 / 12 / 14 |
| §7.6 Inbound / publisher / handoff | inbound source、external body-free adapter、event publisher、collaboration handoff、target registry。 | pass | Step 8 / 9 / 12 / 14 / 15 |
| §7.7 Jobs / maintenance / runtime | maintenance task/progress/history、target planner、checkpoint、recovery issue、runtime assembly、adapter availability。 | pass | Step 8 / 9 / 10 / 11 / 13 / 14 |
| §7.8 Infra implementation 与 entry restriction | infra adapter family、runtime builder slots、entry direct-call 禁止、fake/durable parity。 | pass | Step 11 / 14 / 16 / 17 |
| §7.9 接缝闭环与后续 Step 承接 | historical pollution、port owner、read surface、version/cursor、marker/diagnostic、body-free、product binding、Step 8~17 handoff。 | pass | Step 8~17 |

### 4. 越界检查表

| 越界类型 | 检查结果 | 处理结论 |
|---|---|---|
| 正式 `03-详细设计.md` 修改 | pass | 本 Step 只更新 calibration artifact;正式文档仍等后续装配门禁。 |
| 具体 trait 方法签名 / Rust trait code block | pass | 候选草稿保持 family / seam 粒度,未写函数签名。 |
| adapter method / repository contract 正文 | pass | 只写 owner、caller、implementer、输入 / 输出语义、禁止事项和后续承接。 |
| protocol DTO schema | pass | 未写 command / query / event / job DTO;后移 Step 8。 |
| function flow | pass | 未写 flow 分支、transaction order、调用步骤;后移 Step 9。 |
| state matrix | pass | 未写完整状态机或转换矩阵;后移 Step 10。 |
| persistence schema | pass | 未写 table、index、SQL、migration、store schema;后移 Step 11。 |
| config key / external binding | pass | 未写 config key、secret、URL、topic、cron、product shape;后移 Step 14。 |
| test / evidence schema | pass | 未写 test case、fixture、evidence artifact schema;后移 Step 16。 |
| Step 8 正文 | pass | 本模块只给 Step 8 入口门禁,未展开 Step 8 内容。 |

### 5. Step 8 进入条件确认

| 条件 | 结果 | 说明 |
|---|---|---|
| Step 7 R7.1~R7.26 全部 completed | pass | 当前文件已完整记录开工、framework 对齐、family 讨论、候选草稿和停审。 |
| Step 7 候选 §7 草稿无越界内容 | pass | 未写方法签名、DTO、flow、state、persistence、config、test schema。 |
| Step 8 所需 public shell 来源可回指 Step 7 family | pass | Step 8 只能复制 typed refs、safe marker、summary、result shell 和 body-free outcome。 |
| Step 8 不得绕过 application facade / port family | pass | entry restriction 已固定为 api / worker / jobs 只调用 application facade。 |
| Step 8 开工必须先重置旧材料 | pass | 旧 `03_ddd_step_08_protocol_contracts.md` 与旧正式 §7 API 协议章节只可作 historical_material。 |
| Step 8 当前只允许进入 R8.1 | pass | 下一动作只能是 `R8.1 开工与必读文档:先思考`,不得直接写 DTO schema。 |

### 6. Step 7 stop-review 记录

| 项 | 结论 |
|---|---|
| Step 7 状态 | completed |
| 输出产物 | Step 7 中间产物已形成新 §7 `Trait / Port / Adapter 契约` 候选草稿和停审记录。 |
| 正式文档状态 | `projects/L3-method-library/03-详细设计.md` 未在 Step 7 修改。 |
| 进入 Step 8 条件 | pass,但必须等待用户确认后从 `R8.1` 开工。 |
| 保留 watch | 具体方法签名、DTO、flow、state、persistence、config、test schema 均后移;后续若需要新增 schema / port / mapper / state / config / evidence 来源,必须回设计闭口。 |
| 历史污染提醒 | 旧正式 §7 API 协议章节、旧 Step 8 completed 状态、旧 MethodContent / snapshot / outbox / P0-P1 主线均不得作为 Step 8 第一来源。 |

### 7. Step 8 `R8.1` 进入门禁

| 项 | 内容 |
|---|---|
| 当前允许 | 等待用户确认后进入 Step 8 `R8.1 开工与必读文档:先思考`。 |
| Step 8 开工必须读取 | `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、Step 1~7 completed 文件、正式 `00/01/02`、`02_hld_step_07_api_interface_skeleton.md`、`02_hld_step_08_processing_flows.md`、`02_hld_step_12_detailed_design_handoff.md`、相关 standards、L1-governance Step 8 framework reference。 |
| Step 8 当前禁止 | 不继承旧 Step 8 completed 状态;不直接修改正式 `03-详细设计.md`;不直接写 DTO schema;不进入 Step 9 或后续 Step。 |
| Step 8 第一动作 | 只思考 Step 8 开工边界、必读文档、Step 7 承接输入、协议族分组框架和旧 API 协议污染隔离方式。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 7 自检表 | 是。 |
| 是否写入 family coverage 表 | 是。 |
| 是否写入越界检查表 | 是。 |
| 是否写入 Step 8 进入条件确认 | 是。 |
| 是否写入 Step 7 stop-review 记录 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否新增具体 trait 方法签名 / DTO / flow / state / persistence / config / test schema | 否。 |
| 是否进入 Step 8 正文或后续 Step | 否。 |

next_allowed_action: Step 7 completed;等待用户确认后进入 Step 8 `R8.1 开工与必读文档:先思考`;只允许思考 Step 8 开工边界、必读文档、Step 7 承接输入、协议族分组框架和旧 API 协议污染隔离方式;不得直接修改正式 `03-详细设计.md`;不得继承旧 Step 8 completed 状态;不得直接写 command / query / event / job DTO schema、function flow、状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.2`、Step 9 或后续 Step。
