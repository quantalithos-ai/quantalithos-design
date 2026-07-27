# L3-capability-hub 01 架构 Step 1: 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md` 重新推导架构;旧 README、旧 `01-架构设计.md` 和旧 `02/03/05/06` 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 确认需求基线 |
| 输出文件 | `design-calibration/01_arch_step_01_requirement_baseline.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md`;已创建并更新 `design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md`;`架构设计书写规范.md` |
| 已读取前序输入 | yes:`00-需求文档.md`;`00_req_step_10~17` 关键中间产物;`README.md`;旧 `01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` Step 1;`L3-method-library` Step 1;`L0-sdk` Step 1 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass |
| next_allowed_action | Step 1 已完成,等待用户确认后进入 Step 2。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入需求基线筛选思考。 |
| 需求基线筛选:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入需求基线筛选写入。 |
| 需求基线筛选:再写入 | done | 架构需求基线清单 | pass | 进入架构硬约束思考。 |
| 架构硬约束:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入架构硬约束写入。 |
| 架构硬约束:再写入 | done | 架构硬约束表 | pass | 进入未关闭需求风险思考。 |
| 未关闭需求风险:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入未关闭需求风险写入。 |
| 未关闭需求风险:再写入 | done | 未关闭需求风险表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 2。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 1 输出限定为架构需求基线、架构硬约束、未关闭需求风险;不得提前写系统上下文、容器、数据一致性细节或技术选型。 | 本 Step 只筛选会约束后续架构推导的需求结论。 |
| `standards/document/架构设计书写规范.md` | 正式 `01` 的 §1 只写来源承接,§3 承接约束和风险,§16 后续承接追溯矩阵。 | 本 Step 形成后续正式回填草稿,不直接改正式 `01`。 |
| `standards/document/设计文档讨论中间产物规范.md` | 必须使用项目级台账、文档级 flow 和 Step 级产物;Step 内必须先思考再写入。 | 本文件保留问题回答、诊断、取舍、结构化产物和停审门禁。 |
| `standards/document/设计文档编写通则.md` | 设计要先完成边界、数据所有权、依赖方向和可追溯推导,正式文档只承载收口结论。 | 本 Step 不把过程性判断写进正式文档。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 后续进入实现边界的类型、状态、DTO、event、evidence 和 boundary 必须有唯一真相源。 | 本 Step 明确这些内容后移,不得由架构 Step 1 脑补 schema。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L3-capability-hub` 全局矩阵中编译期依赖为 `L0-core`,运行期依赖外部 MCP / A2A / API,事件协作经 `L0-bus`。 | 架构基线必须保留 compile/runtime/event 分类,防止源码级串仓。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | 已按需求 Step 1~17 重建,当前状态为 `00_completed_stop_review`,是本轮 `01` 的 active formal baseline。 | 架构只能从新版需求结论推导,不能沿用旧 `01` 的主线。 |
| `design-calibration/00_requirements_calibration_flow.md` | `00` Step 1~17 全部 `completed_stop_review`,未发现阻塞进入 `01` 的上游 blocker。 | 允许 Step 1 启动。 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | `BR-CH-001~037` 和 `BR-CH-E001` 已收束为不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。 | 架构硬约束必须保护 identity、registry、descriptor、governance seam、method relation、formal exposure 不被污染。 |
| `design-calibration/00_req_step_11_data_ownership.md` | 数据归属分为真相数据、快照数据、引用数据、禁止保存正文。 | 后续数据所有权和一致性策略必须从四类归属出发。 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | 接口只停留在能力级边界:查询、变更、事件输出、事件输入、后台任务。 | Step 1 不能继承旧 API / DTO / QueryCapabilities / event payload。 |
| `design-calibration/00_req_step_13_non_functional_requirements.md` | NFR 聚焦性能不阻塞、可用性、安全、审计 / 追溯、幂等一致性和可观测性;旧 P95 / Policy 30s / SLA 等不是硬指标。 | 架构目标可以承接质量方向,但不能伪造量化验收。 |
| `design-calibration/00_req_step_14_acceptance_criteria.md` | `AC-CH-001~037` 与 `VF-CH-001~013` 已闭合需求层验收和一票否决。 | Step 1 必须把否决项转为架构红线。 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | governance seam、method relation、descriptor 分类、secret safe summary、SDK exposure、marketplace / console / observability / finance / KMS、API / DTO / state / evidence / boundary 均后移。 | Step 1 必须把这些写成未关闭需求风险,不得关闭。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | `FR-CH-001~016` 和 `FR-CH-E01~E07` 均有故事、规则、数据、接口、NFR、验收映射。 | Step 1 可确认需求链路足以进入架构推导。 |
| `design-calibration/00_req_step_17_formal_document_assembly.md` | 正式 `00` 已装配,未新增 API / DTO / event schema / state / storage / evidence / implementation boundary。 | 架构从正式 `00` 启动,后续正式 `01` 只能在 Step 16 装配。 |

### 2.3 历史材料

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| `projects/L3-capability-hub/README.md` | historical material | 保留“能力池、MCP / A2A / API 接入、治理联动”的来源线索;Provider key、Cost、KMS、runtime 必经 hub、未白名单拦截等不继承。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | historical material | 只用于差异审计;旧四子域、Provider Contract、Cost Accounting、QueryCapabilities、KMS/Vault、Policy refresh、SLA 和上线策略均不作为新版基线。 |
| 旧 `projects/L3-capability-hub/02/03/05/06` | historical material | 本 Step 不读取为架构输入;后续按对应文档 SOP 重建时再审计。 |

---

## 3. 整体模块骨架

Step 1 只做需求到架构的前置筛选,不画系统上下文图,不划分限界上下文,不定义容器、通信方案、技术选型、数据一致性方案或 ADR。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 需求基线筛选 | 哪些 `00` 需求结论会约束架构边界、数据所有权、依赖方向、交互方式、一致性策略和横切关注点。 | 不重写需求全文,不扩展功能需求,不新增能力节点。 | 架构需求基线清单。 |
| 架构硬约束 | 哪些需求规则和验收否决项不可被后续架构方案改变。 | 不决定具体容器、存储、事件、协议、状态或技术方案。 | 架构硬约束表。 |
| 未关闭需求风险 | 哪些需求未闭口项会影响架构,当前如何防止误写成确定事实。 | 不关闭待确认事项,不把外围增强升级为核心前置。 | 未关闭需求风险表。 |
| 旧材料差异审计 | 旧 README / 旧 `01` 中哪些方向可作为线索,哪些必须废弃。 | 不继承旧架构结论,不批量修改未来 Step 文件。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 2。 | 不提前通过后续 Step 门禁。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 需求基线筛选:先思考

问题回答:

- 当前架构设计的直接需求基线是新版 `00-需求文档.md`,不是旧 `01` 的“统一能力入口 / Provider Contract / Cost Accounting / Policy-aware query”主线。
- 架构必须承接的核心定位是“外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓”。
- 核心能力闭环已经在需求层收束为 C-CH-1~C-CH-5:稳定身份、受控目录、可解释接入描述、governance / method relation seam、formal exposure / controlled consumer view / change awareness。
- 依赖方向已经收束:`L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;governance、runtime、tools、SDK、method-library 和外部 MCP / A2A / API 都不能被写成源码级业务拥有关系。
- 数据所有权已经形成四类边界:capability access truth 是本仓真相;governance result、secret handling、consumer view、搜索 / 导出等只能是 safe summary / snapshot;method、governance、secret、runtime、SDK、marketplace、observability 等只可 ref 或禁止正文。
- NFR 和验收已提供架构红线:核心闭环不被外围增强阻塞,禁止正文,关键变化可追溯,重复输入不分叉,formal exposure 不被消费方反写,非 `L0-core` 编译依赖是一票否决。
- 当前仍未闭口的是 governance seam 形态、method relation 摘要强度、descriptor 分类、secret safe summary、SDK exposure 交接、observability / marketplace / finance / KMS 边界、API / DTO / state / evidence / implementation boundary。

诊断:

- 旧 README 和旧 `01` 把 MCP registry、A2A directory、Provider Contract、Cost Accounting、QueryCapabilities、KMS/Vault、白名单刷新、未白名单拦截和 cost 事件放在同一架构主线,与新版需求的 boundary 裁剪冲突。
- `adapter descriptor` 容易被旧 `Provider Contract` 吞并,从而把 key、quota、route、cost、failover、provider runtime 一起带入本仓;Step 1 必须把 descriptor 限定为能力接入描述真相。
- `formal exposure / controlled consumer view` 容易被旧 `QueryCapabilities` 误写成 runtime allow/deny decision 或 Policy cache;Step 1 必须把它限定为服务端受控消费表达,不是执行裁决。
- governance seam 容易被写成 approval / Policy effective truth;method relation 容易保存 method body;SDK exposure 容易被误写成 SDK client;这些都必须作为架构硬约束进入后续 Step。
- Step 1 不具备选择 PostgreSQL、KMS/Vault、cache、outbox、provider adapter、协议 schema、状态机或部署形态的权限,这些最多作为后续 Step 的候选或 historical risk。

取舍:

- 将架构需求基线分成八类:来源纪律、仓定位、核心闭环、依赖方向、功能能力、业务 / 数据红线、能力级接口、横切质量 / 验收。
- 外围增强只作为架构扩展性和演进输入,不得成为 Step 2~8 的核心边界前置。
- 待确认项单列风险,不混入已稳定架构基线。
- 旧材料先作为差异审计输入,不得反推基线。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否已读取需求和关键中间产物 | pass | 已读取正式 `00`、项目台账、`00` flow、规则 / 数据 / 接口 / NFR / 验收 / 风险 / 追溯 Step。 |
| 是否只形成思考结论 | pass | 本节未写系统上下文、容器、技术选型或数据模型。 |
| 是否避免旧材料反推 | pass | 旧 README / 旧 `01` 仅用于诊断。 |
| 是否可进入“需求基线筛选:再写入” | pass | 可转为结构化基线清单。 |

### 4.2 需求基线筛选:再写入

#### 4.2.1 架构需求基线清单

| 基线 ID | 类别 | 架构必须承接的需求结论 | 来源 | 对 `01` 的影响 | 本 Step 明确不推导 |
|---|---|---|---|---|---|
| ARB-CH-001 | 来源纪律 | 新版 `00-需求文档.md` 是本轮 `01` 的第一权威输入;旧 README / 旧 `01` 只作历史诊断。 | `00-需求文档.md` §1;`00_req_step_17_formal_document_assembly.md` | 后续所有架构结论必须回指新版需求基线和 `01` Step 中间产物。 | 不从旧 Provider Contract、CostRecord、KMS、QueryCapabilities 或 SLA 反推架构。 |
| ARB-CH-002 | 仓定位 | `L3-capability-hub` 是外部 MCP / A2A / API capability identity、capability registry 与 adapter descriptor 的能力接入真相仓。 | `00-需求文档.md` §2;`00_req_step_02_position_boundary.md` | Step 2~5 必须围绕 capability access truth 的结构边界展开。 | 不把本仓写成 runtime execution、tools execution、provider runtime、secret、cost、marketplace 或 SDK client 仓。 |
| ARB-CH-003 | 核心闭环 | C-CH-1~C-CH-5 必须成立:稳定身份、受控注册目录、可解释 descriptor、governance / method seam、formal exposure / change awareness。 | `00-需求文档.md` §7;`00_req_step_07_core_capability_loop.md` | 架构目标、职责、上下文、交互和追溯必须围绕五个节点组织。 | 不按旧 MCP / A2A / Provider / Cost / Access 四子域直接切架构。 |
| ARB-CH-004 | 功能能力 | 核心功能为 `FR-CH-001~016`;外围增强为 `FR-CH-E01~E07`。 | `00-需求文档.md` §9;`00_req_step_09_functional_requirements.md`;`00_req_step_16_traceability_matrix.md` | 后续架构单元至少支撑 16 个核心功能,外围增强不得阻塞核心闭环。 | 不把管理 UI、搜索、候选发现、SDK 说明、生态发现或审计导出升格为核心前置。 |
| ARB-CH-005 | 依赖方向 | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;外部 MCP / A2A / API 是运行期外部能力来源。 | `00-需求文档.md` §6 / §12;`全局项目依赖关系与裁剪规则.md` | Step 7 必须输出 compile/runtime/event 裁剪表、分类表和禁止依赖表。 | 不把 `L0-bus`、governance、runtime、tools、SDK、method-library、marketplace、observability 或外部 provider 写成源码级业务依赖。 |
| ARB-CH-006 | 相邻仓协作 | `L1-governance` 只提供 governance result ref / allowed safe summary;`L3-method-library` 只提供 body-free method asset relation 边界;`L2-runtime` / `L2-tools` / `L0-sdk` 是下游消费边界。 | `00-需求文档.md` §6 / §10 / §12 | Step 3~9 必须把 approval truth、method body、execution truth、SDK client 与本仓 access truth 分开。 | 不执行 approval,不保存 Policy truth,不复制 method body,不实现 runtime loop / tools invocation / SDK package。 |
| ARB-CH-007 | 数据归属 | 本仓真相限定为 capability access truth;数据必须区分真相、快照、引用和禁止保存正文。 | `00-需求文档.md` §11;`00_req_step_11_data_ownership.md` | Step 8 必须按四类数据归属讨论所有权、一致性和失败口径。 | 不写字段、表、索引、repository、cache 或存储实现。 |
| ARB-CH-008 | 禁止正文 | provider secret、KMS/Vault truth、runtime / tools execution、provider runtime、cost / billing、governance approval / Policy、method body、SDK client、marketplace、observability、production request / response、LLM routing 正文禁止入仓。 | `00-需求文档.md` §11 / §14;`VF-CH-004~011` | Step 4、Step 8、Step 12 必须显式保护 forbidden body redline。 | 不以“摘要、缓存、审计、对账、性能优化”为理由保存正文。 |
| ARB-CH-009 | 能力级接口 | 对外能力接口只在需求层表达为变更、查询、事件输出、事件输入、后台任务接口。 | `00-需求文档.md` §12;`00_req_step_12_interfaces_dependencies.md` | Step 9 必须先讨论能力级交互和通信方式。 | 不继承旧 API path、QueryCapabilities、provider lookup、event schema、DTO、handler 或 outbox。 |
| ARB-CH-010 | 变化和追溯 | identity、registry、descriptor、governance seam、method relation、formal exposure 和 consumer impact 关键变化必须显式发生并可追溯。 | `00-需求文档.md` §10 / §11 / §13 / §14 | Step 8、Step 9、Step 12、Step 15 必须保留显式变化和追溯口径。 | 不在 Step 1 定义状态机、trace schema、audit event 或 evidence alias。 |
| ARB-CH-011 | 横切质量 | 核心接入事实不被外围增强拖垮;禁止正文;safe summary / ref 不成为第二 truth;派生视图可滞后但必须可解释;边界异常和依赖延迟可识别。 | `00-需求文档.md` §13;`00_req_step_13_non_functional_requirements.md` | Step 2 和 Step 12 必须将质量目标转译为架构目标和横切关注点。 | 不继承旧 `P95 < 50ms`、Policy 30s、SLA、明文 key grep、cost 覆盖率为硬指标。 |
| ARB-CH-012 | 验收否决 | 核心闭环断裂、identity / registry / descriptor / seam / relation / exposure 被替代、forbidden body 入仓、非 core 编译依赖、旧口径回流均是一票否决。 | `00-需求文档.md` §14;`00_req_step_14_acceptance_criteria.md` | 后续每个架构 Step 必须检查是否触发否决项。 | 不把 VETO 降级为普通风险或测试后补项。 |
| ARB-CH-013 | 未闭口风险 | governance seam、method relation、descriptor 分类、secret safe summary、SDK exposure、marketplace / console / observability / finance / KMS、API / DTO / state / evidence / boundary 均未闭口。 | `00-需求文档.md` §15;`00_req_step_15_risks_open_questions.md` | 后续架构可以保留风险、候选或扩展点,但不得直接写成确定结构。 | 不用架构 Step 1 自行关闭需求待确认项。 |

#### 4.2.2 基线完整性判断

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖架构边界 | pass | ARB-CH-002、006、008 覆盖定位和相邻仓红线。 |
| 是否覆盖依赖方向 | pass | ARB-CH-005、006 覆盖 compile/runtime/event 与上下游消费。 |
| 是否覆盖能力主线 | pass | ARB-CH-003、004 覆盖核心闭环和功能需求。 |
| 是否覆盖数据与一致性 | pass | ARB-CH-007、008、010 覆盖数据归属、禁止正文和显式变化。 |
| 是否覆盖交互与横切质量 | pass | ARB-CH-009、011 覆盖能力级接口和 NFR。 |
| 是否覆盖验收 / VETO | pass | ARB-CH-012 覆盖需求验收否决项。 |
| 是否保留未闭口项 | pass | ARB-CH-013 明确待确认项不得变成确定架构事实。 |

### 4.3 架构硬约束:先思考

问题回答:

- 架构硬约束不是复制全部 `BR-CH-*`,而是筛出后续架构方案无论如何不能破坏的红线。
- `capability identity`、`registry`、`adapter descriptor`、`governance seam`、`body-free method relation`、`formal exposure` 是本仓核心 truth 轴;任何方案如果让消费方、派生视图、runtime cache、marketplace listing 或 Policy truth 替代这些 truth,就不合法。
- 数据边界比技术实现更优先:即使后续选择某种存储、cache、projection 或 event,也不能保存 forbidden body,也不能把 snapshot / ref 升级成 truth。
- 依赖裁剪是硬约束:除 `L0-core` 外,任何内部仓进入编译期业务依赖都触发 VETO,即使运行期协作很强。
- 外围增强隔离是硬约束:管理 UI、搜索、候选发现、SDK 说明、生态发现、审计导出不能阻塞核心闭环,也不能反写核心 truth。
- 旧硬指标和基础设施方案不能成为架构硬约束;否则会把需求层已裁掉的 Cost / KMS / QueryCapabilities / provider runtime 重新写回架构。

诊断:

- 旧 `01` 的最大问题是把安全、成本、provider、policy refresh、runtime query、KMS 和上线策略当作架构核心,使 truth owner 模糊。
- `governance seam` 与 `formal exposure` 的分界必须提前写硬:formal exposure 可以依赖 governance result ref / safe summary,但不能自己生成 approval / Policy truth。
- `adapter descriptor` 的硬边界要同时保护 descriptor 可解释性和禁止 provider runtime / secret / cost 入仓。
- `controlled consumer view / CapabilityDecision-style summary` 只能是派生快照,这应进入硬约束,否则 Step 9 可能把它写成 access decision truth。

取舍:

- 将硬约束收束为十类:来源纪律、access truth、descriptor、governance、method、消费、数据、依赖、外围、旧口径。
- 不把所有规则编号搬入正式架构 §3,但保留来源编号方便 Step 16 追溯。
- 不写技术方案、对象 schema、状态枚举、event 名、repository 或 evidence 格式。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否区分硬约束和普通需求 | pass | 只筛选会决定架构合法性的需求红线。 |
| 是否覆盖规则 / 数据 / NFR / 验收 | pass | 已覆盖 Step 10/11/13/14 的关键红线。 |
| 是否避免实现机制 | pass | 未写协议、状态、表、接口或技术方案。 |
| 是否可进入“架构硬约束:再写入” | pass | 可转成结构化约束表。 |

### 4.4 架构硬约束:再写入

| 约束 ID | 约束类别 | 架构硬约束 | 来源 | 后续必须遵守 | 禁止误写 |
|---|---|---|---|---|---|
| AHC-CH-001 | 来源纪律 | 架构设计只能从新版 `00` 和本轮 `01` Step 结论推导;旧材料必须后置审计。 | ARB-CH-001;`00_req_step_17` | 每个正式章节都必须有具体 calibration source。 | 不允许旧 README / 旧 `01` 的对象、指标或技术方案直接进入正式架构。 |
| AHC-CH-002 | access truth | capability identity、registry、adapter descriptor、governance seam relation、body-free method relation、formal exposure 和 change / consumer impact fact 是本仓核心 access truth 轴。 | ARB-CH-002~004;`BR-CH-001~009` | Step 3~8 必须围绕这些 truth 划边界。 | 不允许 URL、provider 名、runtime config、SDK client、marketplace listing、派生视图或 query result 替代核心 truth。 |
| AHC-CH-003 | descriptor 边界 | adapter descriptor 只能表达外部接入方式、能力类型、风险和约束摘要,不得扩张为 provider runtime、secret 容器、quota / route / cost / failover contract。 | `BR-CH-004~005`;`BR-CH-013`;`VF-CH-004` | Step 5、Step 8、Step 9、Step 10 必须保护 descriptor 与 provider runtime / secret / cost 分离。 | 不允许沿用旧 `Provider Contract` 作为核心上下文名称或数据对象。 |
| AHC-CH-004 | governance seam | 本仓只承接 governance result ref 或允许 safe summary,不得生成 approval、Policy effective fact、shared_rules truth 或治理缓存。 | `BR-CH-006`;`BR-CH-014`;`BR-CH-028`;`BR-CH-034`;`VF-CH-005` | Step 3、Step 4、Step 8、Step 9 必须分离接入审查、本仓接入事实和 governance truth。 | 不允许把白名单刷新、Policy cache、approval execution 写成本仓职责。 |
| AHC-CH-005 | method relation | capability-method relation 必须是 body-free relation,不得保存 method body、definition source truth、正文版本或方法资产发布 truth。 | `BR-CH-007`;`BR-CH-015`;`BR-CH-029`;`VF-CH-006` | Step 4、Step 8、Step 9 必须通过 ref / relation 协作 `L3-method-library`。 | 不允许复制 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 正文。 |
| AHC-CH-006 | formal exposure / consumption | formal exposure 是服务端正式能力暴露边界;controlled consumer view / `CapabilityDecision` 类结果只能是派生快照。 | `BR-CH-008`;`BR-CH-012`;`BR-CH-016`;`BR-CH-025`;`BR-CH-030`;`VF-CH-007` | Step 5、Step 8、Step 9 必须区分 exposure truth、consumer view、runtime / tools / SDK 消费。 | 不允许旧 `QueryCapabilities` 作为执行裁决、allow/deny enforcement 或 runtime cache truth 回流。 |
| AHC-CH-007 | 数据边界 | 架构必须区分 truth / snapshot / projection / ref / forbidden body;forbidden body 不得因查询、导出、审计、对账、性能或便利性入仓。 | ARB-CH-007~008;`AC-CH-029~032`;`VF-CH-011` | Step 8 必须完整展开数据所有权和一致性策略。 | 不允许保存 secret、execution、provider runtime、cost、governance Policy、method body、SDK client、marketplace、observability 或 production payload 正文。 |
| AHC-CH-008 | 依赖裁剪 | 唯一内部编译期依赖候选是 `L0-core`;`L0-bus` 是事件协作;其他内部仓和外部系统只能通过运行期、事件、ref、summary、adapter 或消费边界协作。 | ARB-CH-005~006;`VF-CH-012`;全局依赖规则 | Step 7 必须分类所有依赖并列出禁止依赖。 | 不允许把 `L0-bus`、governance、runtime、tools、SDK、method-library、marketplace、observability 或外部 provider 写成源码级业务依赖。 |
| AHC-CH-009 | 显式变化与追溯 | identity、registry、descriptor、seam、relation、formal exposure、维护 / 导出 / 变化协作输出必须显式说明来源、范围和结果。 | `BR-CH-020~026`;`BR-CH-036~037`;`VF-CH-009~010` | Step 8、Step 9、Step 12、Step 15 必须承接显式变化、幂等和追溯。 | 不允许查询、浏览、导出、索引、事件输入或维护任务隐式创建、合并、拆分、更正或关闭 truth。 |
| AHC-CH-010 | 外围隔离 | 管理入口、搜索 / 浏览、候选发现、安全摘要深化、SDK 说明、只读生态发现、审计导出不阻塞核心闭环,且不得改变核心 truth。 | `FR-CH-E01~E07`;`BR-CH-E001`;`AC-CH-022`;`AC-CH-028` | Step 2、Step 5、Step 13 必须把外围增强与核心主线分层。 | 不允许把 console、marketplace、observability、SDK developer experience 写成核心前置。 |
| AHC-CH-011 | 旧口径隔离 | 旧 CostRecord、KMS/Vault、Provider Contract、QueryCapabilities、Policy 30s、未白名单拦截、SLA、LLM routing 等不得作为新版主线或硬指标。 | `00_req_step_15`;`VF-CH-013` | Step 10、Step 12、Step 14 必须把这些作为 historical conflict / candidate,重新裁剪。 | 不允许把旧指标直接写成架构目标、NFR、测试目标或验收标准。 |

#### 4.4.1 约束覆盖判断

| 约束范围 | 覆盖约束 | 结论 |
|---|---|---|
| 职责和上下文 | AHC-CH-001,002,003,004,005,006,010,011 | 可支撑 Step 2~5。 |
| 依赖方向 | AHC-CH-004,005,006,008 | 可支撑 Step 7。 |
| 数据所有权与一致性 | AHC-CH-002,003,004,005,006,007,009 | 可支撑 Step 8。 |
| 交互和通信 | AHC-CH-004,005,006,008,009 | 可支撑 Step 9。 |
| 技术取舍和横切关注点 | AHC-CH-003,007,009,010,011 | 可支撑 Step 10~12。 |
| 演进、风险和追溯 | AHC-CH-001,009,010,011 | 可支撑 Step 13~15。 |

### 4.5 未关闭需求风险:先思考

问题回答:

- 当前未关闭项不是阻塞 Step 2 的需求缺口,而是后续架构、概要、详细、测试、验收和实施计划必须逐步闭口的设计风险。
- governance seam 的最小承载形态会影响 Step 8 数据所有权、Step 9 交互和后续详细设计协议;但当前只需保留“formal governance result ref / allowed safe summary,不得迁入 approval truth”。
- method relation 摘要强度会影响 Step 5 子域和 Step 8 数据所有权;当前只允许 body-free relation 与 method asset ref。
- adapter descriptor 分类会影响 Step 5 / Step 8 / Step 9 / Step 10,但不能在 Step 1 按 MCP / A2A / API / LLM provider API 写死对象或协议。
- SDK exposure 交接会影响 `L0-sdk`,但当前只能确认服务端 formal exposure 归本仓、SDK client 和 language package 归 `L0-sdk`。
- observability、marketplace、console、finance、KMS 等外围 / 外部边界未细化,只能作为外围增强、ref / safe summary 或 forbidden body 风险处理。
- API / DTO / event / state / storage / config / test evidence / implementation boundary 的缺口不由 Step 1 关闭,但必须在后续正式文档闭口,否则实现阶段会阻塞。

诊断:

- 如果风险表只写“后续确认”,后续 Step 会倾向于把旧 `01` 里的 KMS、Cost、QueryCapabilities、PostgreSQL、cache、outbox、SLA 直接拿来填空。
- governance seam 和 formal exposure 是最容易误闭口的地方:一个会把 governance truth 拿进来,一个会把 runtime access decision 拿进来。
- descriptor 分类若过早写死,会把外部 protocol adapter、provider runtime 和配置设计混入架构 Step 1。
- 实施边界 skeleton 是 `07` 的责任,当前只能标注为后续必闭口风险,不能伪造 boundary。

取舍:

- 风险表按“seam / relation / descriptor / safety summary / exposure / external boundary / schema-boundary / historical pollution”分类。
- 每条风险都写当前处理口径、影响 Step 和禁止行为。
- 不在本 Step 关闭风险,也不生成接口、状态、event、表、测试或 boundary。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理未关闭需求风险 | pass | 未重新打开已闭口核心基线和硬约束。 |
| 是否给出当前架构处理口径 | pass | 每类风险都有挂起、候选、外围、ref / summary 或 forbidden body 口径。 |
| 是否避免自行闭口 | pass | 未把任何待确认项写成确定架构事实。 |
| 是否可进入“未关闭需求风险:再写入” | pass | 可写入结构化风险表。 |

### 4.6 未关闭需求风险:再写入

| 风险 ID | 风险主题 | 影响的后续架构 Step | 当前架构处理口径 | 禁止行为 |
|---|---|---|---|---|
| ARR-CH-001 | governance seam 的最小承载形态未闭口。 | Step 2,3,5,8,9,14,15 | 当前只按 governance result ref / policy result ref / allowed safe summary 的关系边界处理。 | 不允许在 `01` Step 1~9 中生成 approval、Policy effective fact、shared_rules truth 或治理缓存。 |
| ARR-CH-002 | governance seam 变化感知是否需要量化滞后窗口未闭口。 | Step 9,12,14,15 | 当前只要求延迟可解释且不得伪造 truth;具体阈值后移测试 / 验收。 | 不继承旧 Policy 30s。 |
| ARR-CH-003 | capability-method relation 摘要强度未闭口。 | Step 3,5,8,9,14,15 | 当前只保留 body-free relation、method asset ref 和允许摘要候选。 | 不允许保存 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef 或 method version body。 |
| ARR-CH-004 | adapter descriptor 分类和协议边界未闭口。 | Step 5,8,9,10,12,14 | 当前按外部 MCP / A2A / API 接入语义和 provider runtime 边界背景处理。 | 不允许在 Step 1 生成 MCP/A2A/API DTO、provider adapter 类型、认证协议或 runtime failover 策略。 |
| ARR-CH-005 | secret reference / safe summary 最小内容未闭口。 | Step 8,10,12,14 | 当前只钉住 secret 正文和 KMS / Vault truth 不入仓;字段级 summary 后移。 | 不允许把 KMS/Vault、key lifecycle、envelope encryption 或 API key storage 写成本仓核心容器。 |
| ARR-CH-006 | SDK exposure 与 `L0-sdk` client / package / developer experience 的交接未闭口。 | Step 3,4,5,7,9,13,15 | 当前确认服务端 formal exposure 归本仓,SDK client 和 package 归 `L0-sdk`。 | 不允许本仓实现 Rust / Python / TypeScript client 或让 SDK client 反写 formal exposure truth。 |
| ARR-CH-007 | marketplace / console / observability / finance / KMS 外围边界仍需后续细化。 | Step 4,5,7,8,9,12,13,14 | 当前作为外围增强、只读消费、safe summary / ref 或 forbidden body 处理。 | 不允许 listing、transaction、UI state、audit store、cost ledger、secret platform truth 进入核心 truth。 |
| ARR-CH-008 | formal exposure / controlled consumer view 是否需要具体读取延迟目标未闭口。 | Step 2,9,12,14 | 当前只要求核心读取不成为不可解释瓶颈,且不被外围增强阻塞。 | 不继承旧 QueryCapabilities P95 < 50ms 或旧 provider lookup 性能目标。 |
| ARR-CH-009 | API / Command / Query / Event、DTO、状态机、存储、配置、测试证据和 implementation boundary 均未定义。 | Step 9,10,12,14,15;后续 `02~07` | 当前按能力级接口和需求层验收暂存,必须在后续正式文档闭口。 | 不允许后续实现 agent 自行补本地 schema、state、event、evidence alias 或 boundary。 |
| ARR-CH-010 | 旧 Provider Contract / Cost / KMS / QueryCapabilities / allow-deny / SLA 口径回流风险。 | Step 2~15 | 当前记录为 historical conflict 和架构红线,后续逐 Step 反向审计。 | 不允许把旧口径作为新版架构目标、子域、容器、数据所有权、交互或验收主线。 |

#### 4.6.1 风险阻塞判断

| 类型 | 条目 |
|---|---|
| 当前不阻塞 Step 2 | ARR-CH-001~010 均不阻塞 Step 2,因为 Step 2 只需明确架构目标、约束、取舍和非目标,可把这些作为约束或非目标处理。 |
| 后续到达对应 Step 前必须处理 | ARR-CH-001/003/004/006 会影响 Step 5/8/9;ARR-CH-005/007/008 会影响 Step 10/12/14;ARR-CH-009 会影响 `02~07` 可落码闭环。 |
| 一旦发生即阻塞 | forbidden body 入仓;consumer view / runtime / SDK / query / export / maintenance 反写真相;非 `L0-core` 内部编译依赖;草稿 / 候选 / 未描述 / 未治理能力被正式暴露;旧 QueryCapabilities / Policy 30s / KMS / Cost / SLA 口径回流为主线。 |

---

## 5. 旧材料差异审计

| 旧材料 / 旧口径 | 可保留线索 | 必须废弃或降级的内容 | 新版处理 |
|---|---|---|---|
| README “能力池 / MCP Server 注册表 / A2A Node Directory” | 外部 MCP / A2A 能力接入对象来源。 | “Runtime 调外部 Tool 必经 hub”、未白名单调用直接拒绝。 | 重裁为 capability identity、registry、adapter descriptor 和 formal exposure 边界;execution 留给 runtime/tools。 |
| README “Provider Contract” | 外部 API / provider API surface 可作为 descriptor 来源线索。 | API key、quota、cost、provider runtime、LLM routing、密钥生命周期。 | 重裁为 adapter descriptor + risk / constraint summary;secret ref 只作边界候选。 |
| README “Policy 消费” | governance seam 是核心关系边界。 | Policy 下发更新白名单、Policy refresh 直接控制 allowlist。 | 重裁为 governance result ref / allowed safe summary;Policy truth 归 `L1-governance`。 |
| README “Cost Accounting / cost 事件” | 可作为 observability / finance historical risk。 | CostRecord、成本覆盖率、billing / finance ledger truth。 | 边界外 / forbidden body,不进入核心架构。 |
| 旧 `01` 四子域 `Registry / Provider Contract / Cost / Access` | Registry 与 access consumption 可作词汇线索。 | Cost 子域、Provider Contract 子域、Access Decision 作为 QueryCapabilities / allow-deny truth。 | 新架构 Step 5 不按旧四子域切分,必须从 C-CH-1~C-CH-5 推导。 |
| 旧 `01` KMS/Vault 容器和 SecretStore | 可提示 secret 正文禁止入仓。 | KMS/Vault 成为核心运行依赖或容器。 | 后续最多作为外部 secret ref / safe summary 边界,不成为本仓主架构。 |
| 旧 `01` QueryCapabilities P95、Policy 30s、SLA、denied calls | 可作为候选量化线索。 | 直接作为已验证硬指标或验收门槛。 | 后续测试 / 验收若需要必须基于新版能力面重新定义。 |
| 旧 `01` PostgreSQL、cache、cost worker、outbox、deployment、rollback | 可作为后续技术选型历史线索。 | 在 Step 1 直接定为架构基线。 | 后续 Step 6 / 10 / 12 重新论证,不得从旧文档继承。 |

---

## 6. 结构化中间产物

### 6.1 需求基线结论

| 结论编号 | 需求基线结论 | 架构承接方式 |
|---|---|---|
| RB-CH-001 | 本仓是 capability access truth owner,核心对象族围绕 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure 和 change awareness。 | Step 2~5 以 access truth 轴推导目标、职责、上下文和限界上下文。 |
| RB-CH-002 | 本仓不拥有 execution、secret/KMS、provider runtime、cost/billing、governance truth、method body、SDK client、marketplace、observability、LLM routing。 | Step 3、Step 4、Step 8、Step 12 持续排除这些边界。 |
| RB-CH-003 | C-CH-1~C-CH-5 是架构主线,`FR-CH-001~016` 是核心功能承接,`FR-CH-E01~E07` 是外围增强。 | 后续架构单元和追溯矩阵必须回指该主线。 |
| RB-CH-004 | `L0-core` 是唯一编译期依赖候选,其余协作均为运行期、事件、ref、summary 或消费边界。 | Step 7 依赖裁剪必须以此为硬基线。 |
| RB-CH-005 | 数据必须按 truth / snapshot / projection / ref / forbidden body 分层。 | Step 8 数据所有权和一致性策略必须完整展开。 |
| RB-CH-006 | 关键变化必须显式发生并可追溯,派生视图和消费视图不得反写真相。 | Step 8、Step 9、Step 12、Step 15 需要承接变化、幂等和追溯口径。 |
| RB-CH-007 | NFR 和验收否决项已明确旧硬指标不继承,核心质量优先保护边界正确性、可追溯和不反写。 | Step 2、Step 10、Step 12、Step 14 不得伪造量化指标。 |
| RB-CH-008 | Step 15 风险不阻塞 Step 2,但会约束后续 schema、state、API、evidence 和 implementation boundary 闭口。 | 后续文档必须逐步闭口,实现前不得自行补设计。 |

### 6.2 架构硬约束结论

| 约束编号 | 硬约束 | 影响章节 |
|---|---|---|
| HC-CH-001 | 不得直接继承旧 README / 旧 `01` 中的 Provider Contract、Cost、KMS、QueryCapabilities、Policy refresh、SLA 或 LLM routing 主线。 | §1;§3;§12;§15 |
| HC-CH-002 | capability access truth 不得被 runtime config、tool config、SDK client、marketplace listing、query view、export、event 或 maintenance output 替代。 | §4;§5;§9;§10 |
| HC-CH-003 | adapter descriptor 不得拥有 secret 正文、provider runtime、quota、route、cost、failover、retry 或 provider invocation truth。 | §6;§9;§10;§13 |
| HC-CH-004 | governance seam 不得生成或保存 governance approval、Policy effective fact、shared_rules truth 或治理缓存。 | §4;§6;§9;§10 |
| HC-CH-005 | capability-method relation 必须保持 body-free,不得迁入 method body 或 definition truth。 | §4;§6;§9;§10 |
| HC-CH-006 | formal exposure 是服务端 truth,controlled consumer view 只能是派生快照,不得成为 runtime allow/deny decision truth。 | §6;§9;§10 |
| HC-CH-007 | `L0-core` 是唯一编译期依赖候选,其他关系必须按运行期、事件协作、ref、summary 或消费边界表达。 | §8 |
| HC-CH-008 | 所有 forbidden body 均不得进入本仓存储、缓存、导出、审计摘要或测试证据正文。 | §9;§13 |
| HC-CH-009 | 外围增强不能阻塞核心闭环,也不得改变核心 truth。 | §3;§6;§14 |
| HC-CH-010 | API、DTO、event schema、state、storage、config、evidence 和 implementation boundary 必须由后续正式文档闭口,不得由实现端补本地口径。 | §15;§16;后续 `02~07` |

### 6.3 未关闭需求风险结论

| 风险 | 当前状态 | 是否阻塞 Step 2 |
|---|---|---|
| governance seam 最小承载形态和变化感知量化 | 后续架构 / 详细 / 测试职责 | 否 |
| method relation 摘要强度 | 后续架构 / 概要 / 详细职责 | 否 |
| adapter descriptor 类型分类和协议边界 | 后续架构 / 配置 / 详细职责 | 否 |
| secret safe summary 字段级边界 | 后续数据所有权、横切安全、配置、测试职责 | 否 |
| SDK exposure 与 `L0-sdk` client / package 交接 | 后续系统上下文、依赖、交互、实施计划职责 | 否 |
| marketplace、console、observability、finance、KMS 边界 | 后续架构风险和外围增强处理 | 否 |
| formal exposure / controlled consumer view 的读取延迟目标 | 后续 NFR / 测试 / 验收职责 | 否 |
| API / DTO / event / state / storage / config / evidence / implementation boundary | 后续 `02~07` 必闭口;实现前不得自行补 | 否,但后续对应阶段会阻塞实现 |
| 旧口径回流风险 | 持续作为 historical conflict 审计 | 否,但一旦回流为主线即阻塞 |

---

## 7. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §6 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/01_arch_step_01_requirement_baseline.md` 的“SOP 问题回答”“结构化中间产物”和“旧材料差异审计”小节,了解本文如何从新版需求基线排除旧架构残留口径。

本文首先承接 `projects/L3-capability-hub/00-需求文档.md` 已收稳的需求基线。本文不重新定义需求、业务规则、数据归属、接口依赖、非功能要求或验收标准,只把这些需求结论转译为架构目标、职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、交互通信、技术取舍和演进约束。

旧 `README.md` 和旧 `01-架构设计.md` 中的 Provider Contract、Cost Accounting、KMS/Vault、QueryCapabilities、Policy 30s、未白名单拦截、SLA、LLM routing、PostgreSQL / cache / outbox / cost worker 等内容只作为 historical material / risk,不作为新版架构真相源直接继承。
```

```md
## 3. 约束条件

本章应摘录:

- `design-calibration/01_arch_step_01_requirement_baseline.md` §6.1 需求基线结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §6.2 架构硬约束结论。
- `design-calibration/01_arch_step_01_requirement_baseline.md` §6.3 未关闭需求风险结论。

后续 Step 2 会把上述结论进一步转译为架构目标、不可变约束、当前阶段可接受取舍和架构非目标。
```

```md
## 16. 需求追溯矩阵

本章应承接 `00-需求文档.md` §16 和 `design-calibration/00_req_step_16_traceability_matrix.md` 的需求追溯结论,并在架构层补充每个核心需求如何进入职责边界、系统上下文、依赖方向、数据所有权、一致性策略、关键交互、横切关注点和 ADR 候选。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | Step 2 是否需要把 `Provider Contract / Cost / KMS / QueryCapabilities / SLA` 逐项写入架构非目标或取舍表。 | 建议写入约束 / 非目标 / historical conflict,防止回流。 |
| Q-002 | Step 2 是否需要把外围增强统一写成“当前不阻塞核心闭环”的架构取舍。 | 建议写入当前阶段可接受取舍。 |
| Q-003 | Step 7 是否需要单独列出 `L3-method-library` 为“无直接依赖 / relation boundary”而非 runtime dependency。 | 需要,以保护 body-free relation。 |
| Q-004 | Step 8 是否需要把 `CapabilityDecision-style summary` 明确列为 snapshot / controlled consumer view。 | 需要,以防旧 QueryCapabilities 回流。 |
| Q-005 | Step 10 是否需要重新论证 PostgreSQL、cache、outbox、KMS/Vault、external protocol adapter。 | 需要,旧技术口径不得直接继承。 |

---

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 已明确哪些需求可直接作为架构前提 | pass | 已形成 ARB-CH-001~013。 |
| 已明确架构硬约束 | pass | 已形成 AHC-CH-001~011 和 HC-CH-001~010。 |
| 已明确未关闭需求风险 | pass | 已形成 ARR-CH-001~010,均不阻塞 Step 2。 |
| 已完成旧材料差异审计 | pass | 旧 README 和旧 `01` 的可保留线索 / 废弃口径已记录。 |
| 未提前生成未来 Step 文件 | pass | 当前只创建 flow 和 Step 1 文件。 |
| 未修改正式 `01-架构设计.md` | pass | 正式 `01` 仍待 Step 16 装配。 |

结论:Step 1 已完成,可以在用户确认后进入 Step 2 `明确架构目标与约束`。

当前不需要提交 commit。
