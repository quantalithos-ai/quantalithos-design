# L4-sandbox 00 需求 Step 12: 接口与依赖

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 11,允许进入 Step 12;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 12 章“接口与依赖”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 接口与依赖 |
| 输出文件 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 前置确认 | pass:用户在 Step 11 停审后回复“同意”,允许进入 Step 12 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 12;`需求文档书写规范.md` §4.12 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/00-需求文档.md`;`projects/L4-sandbox/02-概要设计.md` 中旧接口、旧依赖、旧后端、旧事件和旧 Runner 复用线索 |
| 已读取参考粒度 | yes:`projects/L1-governance/design-calibration/00_req_step_12_interfaces_dependencies.md`;`projects/L1-artifact/design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 历史材料口径 | 旧 `SandboxService`、旧后端清单、旧 `SandboxInvoked / Exited` 一类事件名、旧 Runner 共用接口表述和旧 observability / artifact 交接表述只作差异审计输入,不原样继承 |
| 禁写范围 | 不写 API path、HTTP / RPC 方法、DTO / JSON / proto、事件 schema、字段名、handler / service / repository / port / adapter、outbox、retry、fallback、relay、transaction、配置 key、后端产品选型、NFR、测试、验收或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_13 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~11、SOP、书写规范、历史接口材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 按能力节点组织的接口与依赖方向、同步 / 异步边界和 Step 13 准入判断 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 11 到 Step 12 的转译诊断、旧接口污染诊断、边界串线诊断和跨能力重复诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 能力节点主轴、接口命名粒度、policy 来源抽象、事件输入裁剪和外围增强接口处理取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 按 C-SBX-1~5 组织的接口与依赖结论、对外能力接口表、外部依赖边界表、类型结论、映射结论和能力级停审结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 12 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 12 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 13。 |

---

## 2. 必读摘要

| 文档 | Step 12 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 12 | Step 12 要把 Step 6 的依赖裁剪、Step 9 的功能需求和 Step 11 的数据归属转成能力级接口面与外部依赖边界。 | 接口与依赖必须能回指核心能力节点和 `FR-SBX`;不能回指的边界只能进入待确认或后置。 |
| `需求文档书写规范.md` §4.12 | 正式接口类型只允许 `查询接口 / 变更接口 / 事件输出 / 事件输入 / 后台任务接口`;正式依赖类型只允许 `定义来源依赖 / 治理结论依赖 / 下游消费依赖 / 外部能力依赖`。 | 不写 API、Command、DTO、事件 payload、字段名或实现 port。 |
| `全局项目依赖关系与裁剪规则.md` | `L4-sandbox` 编译期只依赖 `L0-core`;运行期依赖隔离承载和执行语境输入;事件协作通过 `L0-bus` 展开。 | Step 12 必须保留全局依赖类型,不能把运行期或事件协作误写成 package dependency。 |
| `00_req_step_06_consumers_dependencies.md` | 已固定 `L0-core`、`L1-identity`、`L1-work`、容器 / k8s / isolation backend、policy 来源、`L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact`、`L0-bus`、`L4-observability` 的关系边界。 | Step 12 不能重抄 Step 6 的仓依赖表,只能说明这些关系在需求层体现为哪些能力级输入面或输出面。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点。 | Step 12 必须继续按 C-SBX-1~5 收束,不能改按调用方、后端或旧 API 分组。 |
| `00_req_step_09_functional_requirements.md` | 已形成 `FR-SBX-001~018` 和 `FR-SBX-E01~E06`;核心功能覆盖统一入口、边界施加、policy fail-closed、capture / handoff、failure / cleanup。 | 每个接口面都必须对应至少一个 `FR-SBX`;外围增强边界不能反向定义核心接口。 |
| `00_req_step_10_business_rules_boundaries.md` | 已形成 `BR-SBX-001~033`;重点保护正式语境、coherent boundary、policy fail-closed、材料分层交接和 cleanup / reaper guard。 | Step 12 不能出现第二套策略入口、第二套结果回收语义,也不能允许 cleanup 绕过材料保留 guard。 |
| `00_req_step_11_data_ownership.md` | sandbox 只拥有 execution isolation truth;外部真相只允许以快照、引用或禁止保存正文进入。 | 接口只能暴露 sandbox 的正式执行、capture、failure 和 control 边界,不能转移 identity / work / artifact / observability / runtime truth。 |
| 旧 `00-需求文档.md` §10 | 旧材料把 `SandboxService`、Docker / gVisor、audit event、artifact / observability / runner 接缝混成接口与依赖。 | 这些线索只能转译为能力级接口主题或依赖边界,不能继承为协议或产品清单。 |
| 旧 `02-概要设计.md` | 旧材料提供“统一执行壳、输出回收、失败控制、operators 接缝”的主题线索。 | 只保留主题,不继承对象名、流程图、组件名或控制台能力。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 当前正在讨论哪个核心能力节点? | Step 12 继续按 C-SBX-1 受控执行语境识别与约束、C-SBX-2 隔离环境边界建立与限制施加、C-SBX-3 给定策略内执行与 fail-closed、C-SBX-4 输出与观测材料安全捕获和分层交接、C-SBX-5 失败租约清理与安全红线保守收束的顺序逐个收束接口与依赖。 |
| 本仓对外提供哪些能力级接口? | 对外提供受控执行语境受理与责任链绑定、执行环境身份与归责读取、隔离环境建立与边界限制施加、限制不可落实时拒绝与保守收束、策略语境承接与策略内执行、结果 / 候选材料 / 观测材料交接、失败分类与调查读取、控制动作与清理收束、租约巡检与孤儿环境回收、执行状态与红线收束输出等能力接口面。 |
| 本仓消费哪些能力级输入? | 消费 `L0-core` 共享契约、`L1-identity` actor / member anchors、`L1-work` project / work context refs、容器 / k8s / isolation backend 的承载能力、governance / capability / tools policy 来源给出的正式 policy / authorization 语境,并消费调用方带入的正式执行上下文。 |
| 哪些是同步能力边界,哪些是异步能力边界? | 同步边界包括受控执行语境受理、隔离环境建立、边界施加、policy 承接与策略内执行、结果 / 材料交接、失败分类读取和控制动作处置;异步边界包括执行状态 / 观测材料输出、失败 / 控制 / 红线收束输出以及租约巡检 / orphan reaper 后台任务。 |
| 哪些依赖是输入型,哪些结果是输出型? | 输入型依赖包括 `L0-core`、`L1-identity`、`L1-work`、容器 / k8s / isolation backend 和 policy / authorization 来源;输出型依赖包括 `L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner` 对 sandbox 能力和结果的消费,以及 `L1-artifact`、`L0-bus`、`L4-observability` 对材料和事件的消费。 |
| 哪些能力边界属于当前阶段核心闭环,哪些只是外围增强? | 受控执行入口、隔离边界、policy fail-closed、capture / handoff、failure / cleanup / redline 是核心闭环;高级 inspect / replay 辅助、承载比较、多宿主调度、容量趋势分析属于外围增强。 |
| 哪些能力边界来自 Step 6 的编译期 / 运行期 / 事件协作依赖判断? | 编译期只有 `L0-core` 的共享契约输入;运行期包括 identity / work refs、隔离承载、policy 来源和对 tools / runtime / member-service / runner / artifact 的能力交付;事件协作包括通过 `L0-bus` 向 `L4-observability` 等下游提供状态、audit、failure 和 cleanup 相关材料。 |
| 当前接口或依赖边界分别服务该能力节点下的哪些功能需求? | C-SBX-1 对应 `FR-SBX-001~003`; C-SBX-2 对应 `FR-SBX-004~006`; C-SBX-3 对应 `FR-SBX-007~010`; C-SBX-4 对应 `FR-SBX-011~014`; C-SBX-5 对应 `FR-SBX-015~018`;外围增强边界回指 `FR-SBX-E01~E06`。 |
| 是否存在没有功能来源的接口边界? | 不存在。所有正式接口面都能回指 Step 9 功能需求,外围增强接口也只从 `FR-SBX-E*` 抽象而来。 |
| 是否存在功能需求需要外部协作但 Step 6 / Step 12 没有依赖承接? | 不存在。执行语境、隔离承载、policy 来源、下游消费、artifact handoff 和 observability hooks 都已在 Step 6 与 Step 12 双重承接。 |

---

## 4. 当前材料诊断

### 4.1 从 Step 11 到 Step 12 的转译诊断

| 核心能力节点 | 容易误写成什么 | 当前转译方式 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | `SandboxService.execute`、request DTO、session handle 或 caller-specific API | 写成受控执行语境受理与责任链绑定、执行环境身份与归责读取两类能力接口面。 |
| C-SBX-2 隔离环境边界建立与限制施加 | Docker / gVisor / Firecracker 后端列表、mount / cgroup / namespace 操作 | 写成隔离环境建立与边界限制施加、限制不可落实时拒绝与保守收束两类能力接口面。 |
| C-SBX-3 给定策略内执行与 fail-closed | allowlist schema、approval flow、policy engine RPC 或 firewall rule | 写成策略语境承接与策略内执行、高风险边界例外处置与保守拒绝两类能力接口面。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | stdout / stderr 字段、artifact upload API、event payload、trace schema | 写成结果读取 / 引用、结果 / 候选 / 观测材料交接、执行状态与观测材料输出三类能力接口面。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | error code、kill API、reaper job、replay console、operator page | 写成失败分类与调查读取、控制动作与清理收束处置、租约巡检与 orphan 回收、失败 / 控制 / 红线收束输出四类能力接口面。 |

### 4.2 旧接口污染诊断

| 旧表达 | 有效线索 | 当前问题 | Step 12 处理 |
|---|---|---|---|
| `SandboxService trait` | 需要统一入口和统一结果语义。 | trait / service 名已经滑入实现边界。 | 转译为受控执行语境受理与责任链绑定、策略内执行和结果交接能力接口。 |
| Docker / gVisor / local_process backend | 需要正式隔离承载和风险分层。 | 后端产品和测试后端不是需求接口。 | 不进入对外能力接口表,只保留为隔离承载依赖或外围增强线索。 |
| `SandboxInvoked / SandboxExited / EscapeDetected` | 需要执行状态、失败与红线可被下游持续消费。 | 事件名和 payload 不属于需求层。 | 转译为“执行状态与观测材料输出”“失败、控制与红线收束输出”两类事件输出面。 |
| Runner 复用同一接口 | 需要跨调用方统一语义。 | “同一接口”过早冻结 API。 | 转译为跨调用方统一受控执行入口、统一 policy 语义和统一结果回收链。 |
| observability / artifact consume outputs | 需要 outputs、candidate materials、audit material 分层交接。 | 旧材料把结果、候选材料和观测材料混成同一路径。 | Step 12 拆成读取 / 引用、交接、事件输出三类接口,并保留 `L1-artifact` 与 `L4-observability` 的独立依赖边界。 |

### 4.3 边界串线诊断

| 易串线对象 | 若误写进接口会怎样 | 当前防线 |
|---|---|---|
| `L2-tools` | 会把 tool semantic execution、ToolPolicy 和 ToolInvocationResult 写成 sandbox 接口真相。 | Step 12 只表达 tools 消费隔离执行能力和结果材料,不表达工具语义真相。 |
| `L2-runtime` | 会把 ExecutionInstance、agent loop、recover / checkpoint 写成 sandbox 接口。 | Step 12 只表达 runtime 消费隔离执行能力与反馈材料。 |
| `L2-member-service` | 会把 SandboxBinding、host lifecycle、worker/session orchestration 混入 sandbox。 | Step 12 只表达 bind / execute / release 所需的隔离能力面。 |
| `L1-artifact` | 会把候选文件或输出直接提升为 Artifact formal truth。 | Step 12 只表达候选材料与输出交接面,formal artifact truth 仍归 artifact。 |
| `L4-observability` | 会把观测存储、查询和告警实现写成 sandbox 接口。 | Step 12 只表达 observability hooks、audit / trace / metrics material 输出面。 |
| governance / capability / tools policy 来源 | 会把 allowlist、approval 或 policy DSL 真相写成 sandbox 接口对象。 | Step 12 只表达 policy / authorization 语境输入和执行裁定接口面。 |

### 4.4 跨能力重复诊断

最容易重复的地方有三类:

1. 受控执行入口、策略入口和控制入口都容易被写成一条“执行接口”。
2. 输出读取、候选材料交接和观测材料输出容易被写成一条“结果回收接口”。
3. deny / timeout / kill / cleanup / reaper 与失败分类容易被写成一条“错误处理接口”。

当前处理口径:

- C-SBX-1 负责“是否受理执行”和“如何归责”,不承接 policy 或 control。
- C-SBX-4 负责“结果与材料如何被读取和交接”,C-SBX-5 负责“失败与控制如何被分类、处置和留痕”。
- 失败 / 红线事件输出不与执行完成 / 观测输出合并,避免下游消费语义混乱。

---

## 5. 设计取舍

### 5.1 按能力节点而不是按调用方、旧 API 或后端组织接口

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 按 tools / runtime / runner / artifact / observability 分组 | 接近相邻仓视角。 | 容易退化成 Step 6 仓依赖表复制。 | 不采用。 |
| 方案 B: 按 C-SBX-1~5 逐节点组织接口与依赖 | 与 Step 7 / 9 / 10 / 11 主轴一致,便于后续 NFR 和验收继续挂载。 | 需要额外做跨能力重复审计。 | 采用。 |

### 5.2 接口名称保持能力主题,不写 trait / service / event 名

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 继续使用 `SandboxService`、`ExecuteSandboxed`、`SandboxExited` 等旧名称 | 会把 Step 12 退化成协议草案。 | 不采用。 |
| 方案 B | 写成“受控执行语境受理与责任链绑定”“执行状态与观测材料输出”等能力主题 | 能稳定承接 01~03 的架构和详细设计。 | 采用。 |

### 5.3 policy 来源保持抽象,不把 governance 或 capability-hub 固化成唯一入口

旧材料反复出现 capability-hub allowlist 和治理审批。当前取舍是:

- Step 12 正式写法只保留“governance / capability / tools policy 来源”。
- 在需求层只要求 sandbox 消费正式 policy / authorization 语境并执行 fail-closed。
- policy definition truth、approval workflow truth 和 capability truth 的唯一来源后续由 01 / 03 继续细化。

### 5.4 结果读取、材料交接、观测输出与失败输出拆开表达

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 一条“大结果接口”同时覆盖结果读取、候选材料、观测和失败事件 | 简短。 | 会让 artifact、observability、runtime、runner 的下游消费语义混成一桶。 | 不采用。 |
| 方案 B | 拆成“结果读取 / 引用”“结果 / 材料交接”“执行状态与观测输出”“失败 / 控制 / 红线输出” | 保持 Step 10 规则和 Step 11 数据分层。 | 采用。 |

### 5.5 事件输入当前不升格为核心正式接口

Step 11 的 cleanup guard 允许依赖下游 handoff / investigation 状态摘要,但当前取舍是:

- 这些内容在 Step 12 仍通过外部依赖边界和快照口径表达。
- 不额外生成独立“事件输入”核心接口行,避免提前冻结 reaper / investigation 协调协议。
- 如后续确有稳定事件型回调或协调主线,留待 01 / 03 细化。

### 5.6 外围增强当前不新增核心依赖主线

`FR-SBX-E01~E06` 对应的多承载比较、高级 replay / inspect、多宿主调度和趋势分析仍保留,但当前只在接口表中保留最小外围能力面:

- 不新增编译期依赖。
- 不把控制台、报表、调度器或分析系统提升为新的核心外部依赖。
- 这些外围能力必须继承核心接口与依赖边界,不能重写主闭环。

---

## 6. 结构化中间产物

### 6.1 按能力节点组织的接口与依赖结论

| 核心能力节点 | 对外接口面 | 主要输入面 | 主要输出 / 协作面 | 关键依赖边界 |
|---|---|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | 变更接口:受控执行语境受理与责任链绑定;查询接口:执行环境身份与归责语境读取 | 调用方正式执行语境、`L0-core` 共享契约、`L1-identity` 身份锚点、`L1-work` 项目 / 工作引用 | 向 tools / runtime / member-service / runner 返回统一受理结果和归责语境 | `L0-core` 编译期定义来源;`L1-identity`、`L1-work` 运行期输入;tools / runtime / member-service / runner 作为下游消费方 |
| C-SBX-2 隔离环境边界建立与限制施加 | 变更接口:隔离环境建立与边界限制施加;变更接口:限制可落实性拒绝与保守收束 | 已受理执行语境、隔离边界要求、承载能力摘要 | 向调用方返回正式建立结果或显式拒绝结果 | 容器 / k8s / isolation backend 是运行期外部能力依赖;调用方持续消费建立 / 拒绝结果 |
| C-SBX-3 给定策略内执行与 fail-closed | 变更接口:策略语境承接与策略内执行;变更接口:高风险边界例外处置与保守拒绝 | policy / authorization 摘要与 refs、高风险动作语境、承载可落实性结果 | 向调用方返回策略内执行结果、例外处置结果或保守拒绝结果 | governance / capability / tools policy 来源是治理结论依赖;tools / runtime / runner 等消费同一套策略执行语义 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 查询接口:执行结果与候选材料读取 / 引用;变更接口:结果、候选材料与观测材料交接;事件输出:执行状态与观测材料输出 | 执行输出、候选材料、usage / audit / observability material | 向 `L1-artifact` 交接候选材料 refs;向调用方返回统一结果语义;通过 `L0-bus` / `L4-observability` 输出状态与观测材料 | `L1-artifact` 是运行期下游消费依赖;`L0-bus`、`L4-observability` 是事件协作消费边界 |
| C-SBX-5 失败租约清理与安全红线保守收束 | 查询接口:失败分类与调查语境读取;变更接口:控制动作与清理收束处置;后台任务接口:租约巡检与孤儿环境回收;事件输出:失败、控制与红线收束输出 | timeout / limit / deny / kill / capture-failure / orphan 等信号、lease 状态、cleanup guard 语境 | 向调用方提供稳定失败分类与显式控制结果;向 observability 和其他下游输出 control / cleanup / redline 材料 | `L0-bus`、`L4-observability` 提供事件协作消费面;artifact / runtime / runner 继续消费 cleanup 前已安全交接的材料与结果语境 |

### 6.2 对外能力接口结论

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | 受控执行语境受理与责任链绑定 | 对外体现为正式接收受控执行语境、绑定责任链并决定是否进入 sandbox 主线的能力入口。 | 核心闭环能力 |
| 查询接口 | 执行环境身份与归责语境读取 | 对外体现为稳定读取和引用执行环境身份、责任链和归责语境的能力入口。 | 核心闭环能力 |
| 变更接口 | 隔离环境建立与边界限制施加 | 对外体现为正式建立隔离环境并施加资源、文件系统、网络和进程边界的能力入口。 | 核心闭环能力 |
| 变更接口 | 限制可落实性拒绝与保守收束 | 对外体现为在限制无法落实或无法验证时显式拒绝执行并保守收束的能力入口。 | 核心闭环能力 |
| 变更接口 | 策略语境承接与策略内执行 | 对外体现为承接正式 launch / isolation policy 语境并在其约束内继续执行的能力入口。 | 核心闭环能力 |
| 变更接口 | 高风险边界例外处置与保守拒绝 | 对外体现为处理高风险边界例外、扩张请求和 policy 不完备场景的能力入口。 | 核心闭环能力 |
| 查询接口 | 执行结果与候选材料读取 / 引用 | 对外体现为稳定读取执行结果并引用候选材料的能力入口。 | 核心闭环能力 |
| 变更接口 | 结果、候选材料与观测材料交接 | 对外体现为把结果、候选材料和 observability / audit material 显式交接给下游的能力入口。 | 核心闭环能力 |
| 事件输出 | 执行状态与观测材料输出 | 对外体现为执行开始、完成、capture-failure、usage / audit / trace 等状态和材料可被持续消费的输出能力。 | 核心闭环能力 |
| 查询接口 | 失败分类与调查语境读取 | 对外体现为稳定读取失败分类、拒绝原因、cleanup guard 和 redline 调查语境的能力入口。 | 核心闭环能力 |
| 变更接口 | 控制动作与清理收束处置 | 对外体现为 deny、kill、timeout、replay、cleanup 等控制动作显式发生的能力入口。 | 核心闭环能力 |
| 后台任务接口 | 租约巡检与孤儿环境回收 | 对外体现为后台执行 lease expiry、orphan reaper 和保守回收的任务型能力入口。 | 核心闭环能力 |
| 事件输出 | 失败、控制与红线收束输出 | 对外体现为失败分类、控制动作、cleanup 结果和红线收束材料可被持续消费的输出能力。 | 核心闭环能力 |
| 查询接口 | 高级执行调查与重放辅助 | 对外体现为复杂故障、operator 调查和 replay / inspect 辅助的更深读取能力。 | 外围增强能力 |
| 查询接口 | 承载比较与容量趋势分析 | 对外体现为比较承载能力、启动时延、失败分布和成本趋势的外围读取能力。 | 外围增强能力 |

### 6.3 外部依赖边界结论

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | sandbox 依赖共享 ID、typed refs、actor / context、trace、error 和 metadata 契约来承接受控执行边界。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-identity` | 运行期依赖 | sandbox 依赖 actor / member anchors 形成执行环境身份与责任链,但不拥有 identity 正文真相。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-work` | 运行期依赖 | sandbox 依赖 project / work / context refs 形成执行上下文和归责语境,但不拥有 work 正文真相。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | 容器 / k8s / isolation backend | 运行期依赖 | sandbox 依赖实际承载能力建立隔离环境并落实资源、文件系统、网络和进程边界。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | governance / capability / tools policy 来源 | 运行期依赖 | sandbox 依赖正式 policy / authorization 语境进行 launch / isolation 裁定和 fail-closed,但不拥有 policy definition truth。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-tools` | 运行期依赖 | tools 持续消费 sandbox 提供的危险 / restricted / governed tool 隔离执行能力与结果语境。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-runtime` | 运行期依赖 | runtime 持续消费 sandbox 提供的统一受控执行能力、失败分类和 capture / control 材料。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-member-service` | 运行期依赖 | member-service 持续消费 sandbox 的 bind / execute / release 能力,但宿主装配 truth 仍归 member-service。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L5-runner` | 运行期依赖 | runner 持续消费与其他调用方一致的隔离执行能力、policy 语义和结果回收语义。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L1-artifact` | 运行期依赖 | artifact 持续消费 sandbox 交接的输出与候选材料 refs,并在下游决定 formal artifact truth。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | sandbox 通过 bus 向平台持续输出执行状态、failure、control、cleanup 和 redline 相关事件协作材料。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L4-observability` | 事件协作依赖 | observability 持续消费 sandbox 的 audit / trace / metrics / failure / cleanup 材料,但观测存储真相不归 sandbox。 | 核心闭环能力 |

### 6.4 接口类型结论

| 接口类型 | 本仓使用情况 |
|---|---|
| 查询接口 | 用于读取执行环境身份与归责语境、执行结果与候选材料、失败分类与调查语境,以及外围增强的调查 / 趋势读取能力。 |
| 变更接口 | 用于受理正式执行、建立隔离边界、承接 policy、执行显式交接以及触发 deny / kill / cleanup 等正式控制变化。 |
| 事件输出 | 用于向下游持续输出执行状态、observability material、failure / control / redline 收束材料。 |
| 事件输入 | 当前核心闭环不单独固化正式事件输入接口;需要的外部异步线索暂以运行期输入、快照或后续设计裁定承接。 |
| 后台任务接口 | 用于 lease expiry、orphan reaper 和保守回收等后台维护动作。 |

### 6.5 依赖类型结论

| 依赖类型 | 本仓使用情况 |
|---|---|
| 定义来源依赖 | `L0-core` 共享契约是 sandbox 唯一正式编译期定义来源。 |
| 治理结论依赖 | governance / capability / tools policy 来源向 sandbox 提供正式 policy / authorization 结论。 |
| 下游消费依赖 | `L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact`、`L0-bus`、`L4-observability` 持续消费 sandbox 能力、结果和材料。 |
| 外部能力依赖 | `L1-identity`、`L1-work`、容器 / k8s / isolation backend 向 sandbox 提供执行身份、工作语境和承载能力。 |

### 6.6 能力边界与全局依赖类型映射结论

| 能力边界 | 关联方 | 全局依赖类型 | 约束 |
|---|---|---|---|
| 共享契约输入边界 | `L0-core` | 编译期依赖 | 唯一允许进入 package dependency 的上游。 |
| 执行身份与工作语境输入边界 | `L1-identity`;`L1-work` | 运行期依赖 | 只消费 refs / anchors / context,不拥有 identity 或 work 正文真相。 |
| 隔离承载边界 | 容器 / k8s / isolation backend | 运行期依赖 | 只提供承载与限制落实能力,不得反向定义 sandbox 正式边界。 |
| policy / authorization 输入边界 | governance / capability / tools policy 来源 | 运行期依赖 | 只提供正式 policy / authorization 语境,不得把 policy definition truth 转移给 sandbox。 |
| 统一受控执行消费边界 | `L2-tools`;`L2-runtime`;`L2-member-service`;`L5-runner` | 运行期依赖 | 不得把 tools semantic、runtime execution、member lifecycle 或 runner 产品真相回写到 sandbox。 |
| 输出与候选材料交接边界 | `L1-artifact` | 运行期依赖 | 只交接输出和候选材料 refs,formal artifact truth 仍归 artifact。 |
| 事件协作主干边界 | `L0-bus` | 事件协作依赖 | 只承接状态与材料事件协作,不提升为编译期依赖。 |
| 观测材料消费边界 | `L4-observability` | 事件协作依赖 | 只消费 observability hooks 与材料,不把观测存储真相回写给 sandbox。 |

### 6.7 接口 / 依赖与功能需求映射结论

| 核心能力节点 | 主要接口 / 依赖边界 | 对应功能需求 | 关键规则约束 |
|---|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | 受控执行语境受理与责任链绑定;执行环境身份与归责语境读取;`L0-core` / `L1-identity` / `L1-work` 输入边界 | `FR-SBX-001`;`FR-SBX-002`;`FR-SBX-003` | `BR-SBX-001~005` |
| C-SBX-2 隔离环境边界建立与限制施加 | 隔离环境建立与边界限制施加;限制可落实性拒绝与保守收束;容器 / k8s / isolation backend 输入边界 | `FR-SBX-004`;`FR-SBX-005`;`FR-SBX-006` | `BR-SBX-006~010` |
| C-SBX-3 给定策略内执行与 fail-closed | 策略语境承接与策略内执行;高风险边界例外处置与保守拒绝;policy / authorization 输入边界 | `FR-SBX-007`;`FR-SBX-008`;`FR-SBX-009`;`FR-SBX-010` | `BR-SBX-011~017` |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 结果读取 / 引用;结果 / 候选 / 观测材料交接;执行状态与观测材料输出;`L1-artifact` / `L0-bus` / `L4-observability` 输出边界 | `FR-SBX-011`;`FR-SBX-012`;`FR-SBX-013`;`FR-SBX-014` | `BR-SBX-018~024` |
| C-SBX-5 失败租约清理与安全红线保守收束 | 失败分类与调查读取;控制动作与清理收束处置;租约巡检与孤儿环境回收;失败 / 控制 / 红线收束输出 | `FR-SBX-015`;`FR-SBX-016`;`FR-SBX-017`;`FR-SBX-018` | `BR-SBX-025~033` |
| 外围增强 | 高级执行调查与重放辅助;承载比较与容量趋势分析 | `FR-SBX-E01`;`FR-SBX-E02`;`FR-SBX-E03`;`FR-SBX-E04`;`FR-SBX-E05`;`FR-SBX-E06` | 继承核心边界,不新增越界真相 |

### 6.8 能力级接口停审结论

| 检查项 | 结论 |
|---|---|
| 每个核心能力节点都有独立接口与依赖边界 | pass |
| 所有正式接口都能回指 `FR-SBX` | pass |
| 所有正式依赖都能回指 Step 6 裁剪结果 | pass |
| 未出现 API path、DTO、事件 schema、port 或 service 命名泄漏 | pass |
| `L0-core` 之外没有新增编译期依赖 | pass |
| 未把 artifact / observability / runtime / tools / member-service / runner truth 转移给 sandbox | pass |

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §12。正式文档可摘录本文件 §6.2~§6.6 的表格,不重复扩写 Step 诊断和设计取舍。

```md
## 12. 接口与依赖

> 校准来源:
> - `design-calibration/00_req_step_12_interfaces_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”和“能力级接口停审结论”小节,了解本章如何从依赖裁剪、功能需求和数据归属收束而来。

本文采用 `design-calibration/00_req_step_12_interfaces_dependencies.md` §6 的能力级接口与依赖结论。`L4-sandbox` 对外提供受控执行语境受理与责任链绑定、隔离环境建立与边界限制施加、policy 语境承接与策略内执行、结果 / 候选材料 / 观测材料交接、失败分类与清理收束、租约巡检与红线收束输出等能力面。除 `L0-core` 外,其他关联方都不得被写成编译期依赖。

其中,`L1-identity`、`L1-work`、容器 / k8s / isolation backend 和 governance / capability / tools policy 来源为主要输入边界;`L2-tools`、`L2-runtime`、`L2-member-service`、`L5-runner`、`L1-artifact`、`L0-bus`、`L4-observability` 为主要下游消费边界。sandbox 只拥有 execution isolation truth,不拥有 identity / work / artifact / observability / runtime / tools 等相邻仓真相。
```

---

## 8. 自检与停审

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否承接了 Step 6 依赖裁剪而未直接复制仓依赖表 | yes | 外部依赖边界表只表达能力边界和全局依赖类型。 |
| 是否承接了 Step 9 功能需求并完成接口 / 依赖映射 | yes | `FR-SBX-001~018` 和 `FR-SBX-E01~E06` 均已找到接口或依赖承接。 |
| 是否承接了 Step 11 数据边界并避免真相转移 | yes | 只暴露 sandbox 的 execution isolation truth 边界。 |
| 是否使用了正式定稿的接口类型与依赖类型枚举 | yes | 接口类型和依赖类型均未自造新类别。 |
| 是否泄漏 API、DTO、事件 schema、port、service 或后端产品选型 | no | 已全部裁剪为能力主题。 |
| 是否发现新的上游 blocker | no | 当前无新增 blocker;现有下游文档缺口仍不阻塞 `00` Step 12。 |
| 是否允许进入 Step 13 | yes_after_user_review | 本 Step 已完成,等待用户确认后进入 Step 13 `非功能需求`。 |

停审结论:

```text
Step 12 `接口与依赖` 已按需求 SOP、书写规范、Step 6 依赖裁剪、Step 9 功能需求、Step 10 规则边界和 Step 11 数据归属完成重建;
当前 gate_status = pass_wait_review;
未修改正式 `projects/L4-sandbox/00-需求文档.md`;
next_allowed_action = 等待用户确认后进入 Step 13 `非功能需求`;
当前不需要提交 commit。
```
