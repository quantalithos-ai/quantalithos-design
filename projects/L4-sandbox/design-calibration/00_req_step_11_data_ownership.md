# L4-sandbox 00 需求 Step 11: 数据需求与数据归属

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 10,允许进入 Step 11;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 11 章“数据需求与数据归属”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 11 数据需求与数据归属 |
| 输出文件 | `design-calibration/00_req_step_11_data_ownership.md` |
| 前置确认 | pass:用户在 Step 10 停审后回复“同意”,允许进入 Step 11 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 11;`需求文档书写规范.md` §4.11 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `02-概要设计.md`;旧 `03-详细设计.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中 execution / session / output / control / audit / replay / cleanup / artifact candidate / observability 线索 |
| 已读取参考粒度 | yes:`projects/L1-artifact/design-calibration/00_req_step_11_data_ownership.md`;`projects/L1-governance/design-calibration/00_req_step_11_data_ownership.md` |
| 历史材料口径 | 旧 `SandboxExecution`、`SandboxPolicyView`、`SandboxAuditEvent`、旧 execution/session/output/control 对象名、旧 retention/归档表达和旧 evidence 链只作差异审计输入,不原样继承 |
| 禁写范围 | 不写表结构、字段清单、索引、缓存、事务、outbox / projection / rebuild、repo / service / port、DDL、API path、DTO、event payload、保留期、归档实现、测试结果、验收签署或实现 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_12 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~10、SOP、书写规范、历史数据材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 按能力节点组织的数据归属方向、四类数据类型和 Step 12 准入判断 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 10 到 Step 11 的转译诊断、旧实体污染诊断、边界串线诊断和跨能力重复诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 四类数据归属骨架、按能力节点收束、capture truth 与 downstream truth 分层、policy / cleanup 数据处理取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 按 C-SBX-1~5 组织的数据归属表、数据类型结论、功能 / 规则映射、边界外数据排除表和能力级停审结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 11 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 11 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 12。 |

---

## 2. 必读摘要

| 文档 | Step 11 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 11 | Step 11 要把 Step 2 的仓边界、Step 9 的功能需求和 Step 10 的规则约束转成按能力节点组织的数据归属结论、数据项分类结论、数据类型结论、归属说明结论、生命周期口径结论和能力级数据停审结论。 | 每个数据项必须先判断属于 `真相 / 快照 / 引用 / 禁止保存正文` 哪一类,再写归属说明和生命周期口径。 |
| `需求文档书写规范.md` §4.11 | 正式数据归属表固定为“数据项 / 数据类型 / 归属说明 / 生命周期口径”;不写字段、DDL、缓存、事务、repo、service、port、保留期或归档实现。 | 本文件可以保留诊断和取舍,但正式回填草稿只能回填已确认的需求层数据归属结论。 |
| `设计文档编写通则.md` | Step 11 是 Step 12 接口边界、Step 13 NFR、Step 14 验收和后续实现真相源的重要锚点。 | 当前必须把 sandbox 自己拥有什么 execution isolation truth、只保留什么快照、只保存什么引用和禁止保存什么正文讲清楚。 |
| `设计文档讨论中间产物规范.md` | Step 11 必须独立落盘并维护计划、问题回答、诊断、取舍、结构化中间产物和自检;不得提前创建 Step 12~17 文件。 | 当前只创建 Step 11 文件。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从台账和已完成 Step 文件恢复;后续 schema、event、state、boundary skeleton 和 implementation ledger 需要唯一真相源。 | Step 11 只定义需求层数据边界,不生成对象字段、状态机、topic 或持久化结构。 |
| `00_req_step_02_position_boundary.md` | `L4-sandbox` 是平台运行隔离基础仓,负责受控执行环境的身份、限制、捕获、观测、失败和清理边界。 | 数据归属必须围绕 execution isolation truth 收敛,不能把 tools/runtime/member/artifact/observability/governance truth 拉进来。 |
| `00_req_step_04_goals_non_goals.md` | 目标覆盖 execution environment identity、resource limits、filesystem/network/process boundary、launch policy、capture、observability hooks、failure、cleanup 和 security redlines;非目标排除相邻仓 truth 和后端选型。 | Step 11 必须为这些主轴找到对应数据归属,同时明确外部正文不入仓。 |
| `00_req_step_06_consumers_dependencies.md` | `L0-core` 是唯一编译期依赖;isolation backend 是运行期前置;identity/work/policy 来源是场景输入;artifact/observability/runtime/runner 是消费或协作方。 | 数据归属可以表达这些方向的快照和引用,但不能让它们变成 sandbox 正文真相。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点。 | Step 11 必须按 C-SBX-1~5 逐节点组织数据归属。 |
| `00_req_step_09_functional_requirements.md` | 已形成 FR-SBX-001~018 和 FR-SBX-E01~E06,并把统一入口、隔离边界、fail-closed、输出交接和失败回收收束为功能主题。 | 每条正式数据项都必须能回指至少一个 `FR-SBX` 编号。 |
| `00_req_step_10_business_rules_boundaries.md` | 已形成 BR-SBX-001~033,重点保护正式语境、coherent boundary、policy fail-closed、材料分层交接和 cleanup / reaper guard。 | Step 11 必须说明这些规则依赖哪些 sandbox truth、哪些外部快照 / 引用、哪些正文禁止进入本仓。 |
| 旧 `00-需求文档.md` §9 | 旧数据章节写 `SandboxExecution`、`SandboxPolicyView`、`SandboxAuditEvent` 和 retention/归档,混入 execution/session/output/audit 线索。 | 这些线索只能转译为需求层数据项,不得继承旧对象名、保留期或存储结构。 |
| 旧 `02-概要设计.md` / `03-详细设计.md` / `05-测试方案.md` / `06-验收标准.md` | 旧材料把 session / execution / output / usage / audit / control 视为 sandbox truth,并明确 output 不等于 artifact truth、cleanup 不得先删证据。 | 可以吸收为数据归属候选,但不得把对象字段、代码结构、测试 case、验收门禁和 evidence alias 写成正式数据结论。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 当前正在讨论哪个核心能力节点? | Step 11 按 C-SBX-1 受控执行语境识别与约束、C-SBX-2 隔离环境边界建立与限制施加、C-SBX-3 给定策略内执行与 fail-closed、C-SBX-4 输出与观测材料安全捕获和分层交接、C-SBX-5 失败租约清理与安全红线保守收束的顺序逐个收束数据归属。 |
| 哪些数据由本仓拥有真相? | sandbox 只拥有 execution isolation truth:正式受控执行请求语境、执行环境身份与责任链绑定事实、隔离环境建立事实、有效边界限制事实、限制落实校验 / 拒绝事实、策略执行裁定事实、保守拒绝事实、边界扩张处置事实、执行结果捕获事实、输出与候选材料事实、usage / audit / observability material 事实、结果 / 候选 / 观测交接事实、capture-failure 事实、稳定失败分类事实、deny / kill / timeout / replay / cleanup / reaper 控制事实、lease / orphan / recovery 收束事实、cleanup guard 事实和 redline containment / investigation 事实。 |
| 哪些数据只是快照? | 调用方上下文摘要、backend carrier capability 摘要、policy applicability / authorization 摘要、以及为 cleanup / reaper 判断所需的下游安全交接 / 调查开放状态摘要都只可作为快照进入 sandbox。 |
| 哪些数据只是引用? | identity/work/runner/tool/runtime request refs、backend carrier / workspace source refs、policy / approval / capability refs、artifact / runtime / runner / observability handoff refs,以及 failure / investigation 相关外部对象 refs 都只是引用数据。 |
| 哪些内容绝不能保存正文? | actor/member/project/work/runner/runtime execution 正文、tool semantic execution 正文、宿主文件系统正文、host / cluster lifecycle 正文、member host binding 正文、allowlist / policy DSL / approval workflow 正文、Artifact 正式正文、baseline / evidence 正文、observability store 正文、conversation / UI 展示正文、runtime recover 正文、artifact retention 正文、operator console / replay UI 正文都不得进入 sandbox 真相范围。 |
| 这些数据在需求层面的生命周期口径是什么? | 真相数据在 sandbox 内由正式执行、限制、capture、control 和清理变化建立、变化和终止;快照数据随上游正式真相变化而更新,不形成独立真相生命周期;引用数据随引用关系建立、变化或失效而变化,本仓不负责正文生命周期;禁止保存正文不进入 sandbox 生命周期。 |
| 当前数据项分别支撑该能力节点下的哪些功能需求或规则? | C-SBX-1 数据支撑 FR-SBX-001~003 与 BR-SBX-001~005;C-SBX-2 数据支撑 FR-SBX-004~006 与 BR-SBX-006~010;C-SBX-3 数据支撑 FR-SBX-007~010 与 BR-SBX-011~017;C-SBX-4 数据支撑 FR-SBX-011~014 与 BR-SBX-018~024;C-SBX-5 数据支撑 FR-SBX-015~018 与 BR-SBX-025~033。 |
| 是否存在功能需要的数据没有归属结论? | 不存在。Step 9 的每条核心功能都能在 Step 11 找到对应的 sandbox truth、外部快照 / 引用或禁止保存正文结论。 |
| 是否存在数据项没有功能、规则或边界来源? | 不存在。所有正式数据项都能回指 Step 2 边界、Step 4 目标 / 非目标、Step 9 功能需求或 Step 10 规则约束。 |
| 当前数据归属是否足以进入 Step 12 接口与依赖讨论? | 足以。Step 11 已明确 sandbox 自己写什么 truth、下游只交接什么 refs / materials、哪些正文绝不能入仓,可进入 Step 12 的能力级接口边界讨论。 |

---

## 4. 当前材料诊断

### 4.1 从 Step 10 到 Step 11 的转译诊断

| 核心能力节点 | 容易误写成什么 | 当前转译方式 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | `ExecutionRequest` 字段表、`Session` / `Handle` 对象模型、request validation 细节 | 写成正式受控执行请求语境、身份绑定事实、归责记录、调用方上下文摘要和外部 refs 的数据归属结论。 |
| C-SBX-2 隔离环境边界建立与限制施加 | namespace / cgroup / mount / quota 结构表,或 Docker / gVisor / Firecracker 后端配置 | 写成隔离环境建立事实、有效边界限制事实、限制落实校验 / 拒绝事实、backend capability 摘要和 backend / workspace refs。 |
| C-SBX-3 给定策略内执行与 fail-closed | allowlist schema、审批流字段、policy DSL、provider ACL 或 firewall 规则表 | 写成策略执行裁定事实、保守拒绝事实、边界扩张处置事实、policy applicability 摘要和 policy / authorization refs。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | stdout / stderr 字段清单、artifact insert、trace payload、upload API | 写成执行结果捕获事实、输出与候选材料事实、usage / audit / observability material 事实、交接事实和 capture-failure 事实。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | error code 枚举、reaper job schema、cleanup command、retry / replay API、调查工单结构 | 写成稳定失败分类事实、控制事实、lease / orphan 收束事实、cleanup guard 事实、redline containment / investigation 事实和外部 investigation refs。 |

### 4.2 旧数据污染诊断

| 旧数据 / 旧表达 | 有效线索 | 当前问题 | Step 11 处理 |
|---|---|---|---|
| `SandboxExecution` | sandbox 需要正式执行隔离真相锚点。 | 旧表达直接落成对象名和状态机,且与 runtime execution truth 的边界不稳。 | 转译为“正式受控执行请求语境”“隔离环境建立事实”“执行结果捕获事实”等需求层数据项。 |
| `SandboxPolicyView` | sandbox 需要消费 policy 语境并形成稳定裁定。 | 旧表达把 view、cache 和 policy truth 混在一起。 | 转译为“policy applicability / authorization 摘要”快照和“策略执行裁定事实”真相。 |
| `SandboxAuditEvent` | 非 happy path 和 output / capture 需要留痕。 | 旧表达把 event、audit store 和 evidence chain 混在一起。 | 转译为“usage / audit / observability material 事实”和“控制事实”,不继承事件名。 |
| `stdout / stderr refs` | 输出材料是 sandbox 需要统一收口的核心数据。 | 旧表达把 refs、Artifact truth 和 retention 混在一起。 | 转译为“执行结果捕获事实”“输出与候选材料事实”和“artifact / observability handoff refs”。 |
| `execution metadata / retention / archive` | 提示正式执行元信息与材料保留主题存在。 | 旧表达直接滑入 retention、冷存、归档实现。 | 不写 retention / archive 方案;只写需求层生命周期口径。 |
| `Kill / Replay / Cleanup evidence` | 非 happy path 需要正式控制事实和 cleanup guard。 | 旧表达混入 operator UI、测试 case 和证据路径。 | 转译为“控制事实”“cleanup guard 事实”“redline investigation 事实”,不继承 UI 或 evidence alias。 |

### 4.3 边界串线诊断

| 易串线对象 | 若误写进数据归属会怎样 | 当前防线 |
|---|---|---|
| `L2-tools` | 会把 ToolDefinition、ToolPolicy、ToolInvocationResult 或 tool semantic output 正文写成 sandbox truth。 | Step 11 只保留 tool / policy refs 或摘要,不保存 tool semantic 正文。 |
| `L2-runtime` | 会把 ExecutionInstance、agent loop、checkpoint / recover 和业务主线状态写成 sandbox truth。 | Step 11 只保留 runtime request refs、handoff refs 和 failure / investigation refs,不拥有 runtime execution 正文。 |
| `L2-member-service` | 会把 SandboxBinding、worker/session、host health 和宿主装配状态写成 sandbox truth。 | Step 11 明确 host binding 正文和 host lifecycle 正文禁止入仓。 |
| `L1-identity` / `L1-work` | 会把 actor/member/project/work/plan 正文写成 execution identity 数据。 | Step 11 只允许上下文摘要和 refs 进入。 |
| `L1-artifact` | 会把候选输出直接提升为 Artifact 正文、baseline truth 或 formal evidence truth。 | Step 11 明确输出与候选材料是 sandbox truth,Artifact 正文 / evidence 正文禁止入仓。 |
| `L4-observability` | 会把 audit store、trace store、metric store 和记账查询写成 sandbox 数据。 | Step 11 只拥有 usage / audit / observability material 和 handoff facts,不拥有 observability store 正文。 |
| governance / capability / tools policy 来源 | 会把 allowlist truth、approval flow 正文或 policy DSL 写成 sandbox 数据。 | Step 11 只拥有 policy execution decision truth,policy definition / approval 正文只可引用或禁止保存正文。 |
| backend carrier / cluster / workspace | 会把 host lifecycle、cluster inventory、workspace 正文和后端产品状态写成 sandbox truth。 | Step 11 只保留 backend capability 摘要和 source refs,宿主 / 集群 / workspace 正文不入仓。 |

### 4.4 跨能力重复诊断

最容易重复的地方有四类:

1. identity / work / runner / policy 上下文既出现在 C-SBX-1,又会影响 C-SBX-2~5。
2. backend capability 既影响 C-SBX-2 边界建立,也影响 C-SBX-3 fail-closed。
3. output / candidate / audit materials 既属于 C-SBX-4 capture 主线,又是 C-SBX-5 cleanup guard 的前提。
4. failure / control facts 容易与 result capture 或 observability handoff 混成一条数据主线。

当前处理口径:

- C-SBX-1 拥有正式执行语境 truth;后续节点只消费其 refs / 摘要,不重复拥有上游语境 truth。
- backend capability 摘要在 C-SBX-2 收口为快照;C-SBX-3 只消费该快照形成保守拒绝事实,不重复拥有 backend truth。
- output / candidate / observability materials 的正文事实在 C-SBX-4 收口;C-SBX-5 只拥有 cleanup guard 和调查事实,不重复拥有材料正文。
- control facts、lease facts 和 redline facts 在 C-SBX-5 单独收口;C-SBX-4 的交接事实不替代控制事实。

---

## 5. 设计取舍

### 5.1 先用四类正式数据归属,不回退到旧实体 / 生命周期表

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 沿用 `SandboxExecution / PolicyView / AuditEvent` 旧实体表 | 接近旧材料。 | 会把 Step 11 退化成对象模型和状态图,并遗漏快照 / 引用 / 禁止正文。 | 不采用。 |
| 方案 B: 按 `真相数据 / 快照数据 / 引用数据 / 禁止保存正文` 重写 | 能直接回答 Step 11 的应答问题,也利于 Step 12~14 继续收束。 | 表格数量会比旧数据章节多。 | 采用。 |

### 5.2 按能力节点而不是按旧对象名或存储主题组织数据归属

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 按 execution / session / output / audit / control 旧对象分组 | 靠近旧 `02/03/05/06` 材料。 | 容易把 runtime、artifact、observability 的边界掺进来。 | 不采用。 |
| 方案 B: 按 C-SBX-1~5 逐节点收束数据归属 | 与 Step 7 / Step 9 / Step 10 保持同一主轴,利于后续接口和验收继续沿节点展开。 | 需要单独做跨能力数据审计。 | 采用。 |

### 5.3 sandbox 自己拥有 capture materials truth,但不拥有 downstream truth

旧材料一直强调 `SandboxOutput ≠ Artifact truth`。当前取舍是:

- sandbox 拥有执行结果捕获事实、输出与候选材料事实、usage / audit / observability material 事实和交接事实。
- artifact 正式正文、baseline truth、formal evidence truth、observability store truth 和 runner 产品展示 truth 不归 sandbox。
- 这样既能闭合 Step 4 的 capture 目标,又不会打穿 Step 2 的相邻仓边界。

### 5.4 policy 相关数据只收口“执行裁定事实”,不收口“policy definition truth”

旧材料多次提到 allowlist / capability-hub。当前取舍是:

- sandbox 自己拥有高风险动作的策略执行裁定事实、保守拒绝事实和边界扩张处置事实。
- allowlist 正文、policy DSL、approval workflow 正文和 capability definition 正文不归 sandbox。
- 若需要稳定消费,只允许以 policy applicability / authorization 摘要和 policy / approval / capability refs 进入。

### 5.5 cleanup / reaper 拥有 control truth,不拥有 retention truth

旧 `05/06` 强调 cleanup 不可先删证据。当前取舍是:

- sandbox 拥有 deny / timeout / kill / replay / cleanup / reaper 控制事实、lease / orphan 收束事实、cleanup guard 事实和 redline investigation 事实。
- artifact retention、audit store retention、operator workflow、runtime business recover 和外部工单正文不归 sandbox。
- 这样 Step 11 可为 Step 10 的 cleanup guard 规则提供数据支撑,同时避免提前写 retention 策略。

### 5.6 快照只服务稳定消费,不能反向成为写源

Step 11 中的快照数据只用于:

- intake 阶段稳定读取调用方上下文摘要;
- establish / fail-closed 阶段稳定读取 backend capability 摘要和 policy applicability 摘要;
- cleanup / reaper 阶段稳定读取下游安全交接 / 调查开放状态摘要。

这些快照都不形成独立业务真相,也不得反向定义上游仓或外部系统的正式状态。

### 5.7 外围增强当前不额外创建独立数据项体系

Step 9 的外围增强 `FR-SBX-E01~E06` 当前不单独生成新的核心数据域,原因是:

- 多后端优化、多集群调度、inspect / operator UI、趋势分析都还属于外围增强能力。
- 若现在提前为它们立独立 truth,容易把架构、控制台、调度和报表设计固化到需求层。

因此 Step 11 只在“边界外数据排除结论”中说明这些方向暂不进入核心数据归属。

---

## 6. 结构化中间产物

### 6.1 C-SBX-1 受控执行语境识别与约束的数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 正式受控执行请求语境 | 真相数据 | 正式受控执行请求语境由本仓拥有正式真相。 | 从正式受理到显式终止,形成完整 sandbox 请求生命周期。 |
| 执行环境身份与责任链绑定事实 | 真相数据 | 执行环境身份与责任链绑定事实由本仓拥有正式真相。 | 从正式绑定到显式解除或收束,形成完整 sandbox 归责生命周期。 |
| 受理 / 拒绝归责记录 | 真相数据 | 受理或拒绝的归责记录由本仓拥有正式真相。 | 随受理、拒绝、补充说明或显式收束而变化。 |
| 调用方上下文摘要 | 快照数据 | actor / member / work / runner 等正式真相不属于本仓,但本仓可为稳定 intake 保留摘要。 | 随上游正式真相变化而更新,不形成独立真相生命周期。 |
| identity / work / runner / tool / runtime request refs | 引用数据 | 本仓只保存对 identity、work、runner、tool 和 runtime 请求来源的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| actor / member / project / work / runner / runtime / tool semantic 正文 | 禁止保存正文 | identity、work、runner 和 runtime / tool semantic 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 6.2 C-SBX-2 隔离环境边界建立与限制施加的数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 隔离环境建立事实 | 真相数据 | 隔离环境建立事实由本仓拥有正式真相。 | 从正式创建到显式终止或回收,形成完整隔离环境生命周期。 |
| 有效边界限制事实 | 真相数据 | 资源、文件系统、网络、进程和工作区边界的有效限制事实由本仓拥有正式真相。 | 随限制正式建立、调整、拒绝或终止而变化。 |
| 限制落实校验与建立拒绝事实 | 真相数据 | 限制落实校验结果和建立拒绝事实由本仓拥有正式真相。 | 随建立尝试、能力校验和拒绝收束而变化。 |
| backend carrier capability 摘要 | 快照数据 | backend carrier 的正式能力真相不属于本仓,但本仓可为稳定判断保留能力摘要。 | 随外部运行承载能力变化而更新,不形成独立真相生命周期。 |
| backend carrier / workspace source refs | 引用数据 | 本仓只保存对 backend carrier 和 workspace source 的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| 宿主文件系统正文、host / cluster lifecycle 正文、member host binding 正文 | 禁止保存正文 | 宿主文件系统、集群 / 宿主生命周期和成员宿主绑定正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 6.3 C-SBX-3 给定策略内执行与 fail-closed 的数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 策略执行裁定事实 | 真相数据 | 给定策略下的执行裁定事实由本仓拥有正式真相。 | 随策略受理、执行裁定、显式变更或收束而变化。 |
| 策略缺失 / 冲突 / 不支持保守拒绝事实 | 真相数据 | 策略不完备时的保守拒绝事实由本仓拥有正式真相。 | 随拒绝条件识别、拒绝形成和显式收束而变化。 |
| 高风险边界扩张处置事实 | 真相数据 | 高风险动作的边界扩张处置事实由本仓拥有正式真相。 | 随授权校验、扩张处置和收束结果而变化。 |
| policy applicability / authorization 摘要 | 快照数据 | policy definition 和 authorization 正式真相不属于本仓,但本仓可为稳定执行保留摘要。 | 随上游正式真相变化而更新,不形成独立真相生命周期。 |
| policy / approval / capability refs | 引用数据 | 本仓只保存对 policy、approval 和 capability 来源的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| allowlist 正文、policy DSL 正文、approval workflow 正文、tool semantic result 正文 | 禁止保存正文 | allowlist / policy definition / approval workflow 和 tool semantic result 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 6.4 C-SBX-4 输出与观测材料安全捕获和分层交接的数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 执行结果捕获事实 | 真相数据 | 执行结果捕获事实由本仓拥有正式真相。 | 随执行完成、结果捕获、补充捕获失败或显式收束而变化。 |
| 输出与候选材料事实 | 真相数据 | 输出与候选材料事实由本仓拥有正式真相。 | 从正式捕获到显式交接或终止,形成完整 capture 生命周期。 |
| usage / audit / observability material 事实 | 真相数据 | usage、audit 和 observability material 事实由本仓拥有正式真相。 | 随材料正式产生、补充或显式交接而变化。 |
| 结果 / 候选 / 观测交接事实 | 真相数据 | 结果、候选材料和观测材料的交接事实由本仓拥有正式真相。 | 随交接正式建立、更新或显式失败而变化。 |
| capture-failure 事实 | 真相数据 | capture-failure 事实由本仓拥有正式真相。 | 随失败识别、补偿、重试或收束而变化。 |
| artifact / runtime / runner / observability handoff refs | 引用数据 | 本仓只保存对下游 handoff 对象的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| Artifact 正式正文、baseline / evidence 正文、observability store 正文、conversation / UI 展示正文 | 禁止保存正文 | formal artifact、baseline / evidence、observability store 和 conversation / UI 展示正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 6.5 C-SBX-5 失败租约清理与安全红线保守收束的数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 稳定失败分类事实 | 真相数据 | 非 happy path 的稳定失败分类事实由本仓拥有正式真相。 | 随失败识别、归并、更新或显式收束而变化。 |
| deny / kill / timeout / replay / cleanup / reaper 控制事实 | 真相数据 | deny、kill、timeout、replay、cleanup 和 reaper 控制事实由本仓拥有正式真相。 | 随控制动作正式发生、补充说明或显式收束而变化。 |
| lease / orphan / recovery 收束事实 | 真相数据 | 租约到期、孤儿环境和隔离层 recovery 收束事实由本仓拥有正式真相。 | 随租约变化、孤儿检测、回收或收束而变化。 |
| cleanup 前置校验与材料保留 guard 事实 | 真相数据 | cleanup 前置校验和材料保留 guard 事实由本仓拥有正式真相。 | 随 cleanup 申请、前置判断、阻断或放行而变化。 |
| redline containment / investigation 事实 | 真相数据 | 安全红线收束和调查事实由本仓拥有正式真相。 | 随红线识别、保守收束、调查推进或显式关闭而变化。 |
| 下游安全交接 / 调查开放状态摘要 | 快照数据 | 下游安全交接和调查开放状态的正式真相不属于本仓,但本仓可为 cleanup / reaper 判断保留摘要。 | 随上游或下游正式真相变化而更新,不形成独立真相生命周期。 |
| runtime / artifact / observability / investigation refs | 引用数据 | 本仓只保存对 runtime、artifact、observability 和 investigation 外部对象的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| runtime recover 正文、artifact retention 正文、operator console / replay UI 正文、raw audit store 正文 | 禁止保存正文 | runtime recover、artifact retention、operator control UI 和 raw audit store 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 6.6 数据类型结论

| 数据类型 | 数据项 |
|---|---|
| 真相数据 | 正式受控执行请求语境;执行环境身份与责任链绑定事实;受理 / 拒绝归责记录;隔离环境建立事实;有效边界限制事实;限制落实校验与建立拒绝事实;策略执行裁定事实;策略缺失 / 冲突 / 不支持保守拒绝事实;高风险边界扩张处置事实;执行结果捕获事实;输出与候选材料事实;usage / audit / observability material 事实;结果 / 候选 / 观测交接事实;capture-failure 事实;稳定失败分类事实;deny / kill / timeout / replay / cleanup / reaper 控制事实;lease / orphan / recovery 收束事实;cleanup 前置校验与材料保留 guard 事实;redline containment / investigation 事实 |
| 快照数据 | 调用方上下文摘要;backend carrier capability 摘要;policy applicability / authorization 摘要;下游安全交接 / 调查开放状态摘要 |
| 引用数据 | identity / work / runner / tool / runtime request refs;backend carrier / workspace source refs;policy / approval / capability refs;artifact / runtime / runner / observability handoff refs;runtime / artifact / observability / investigation refs |
| 禁止保存正文 | actor / member / project / work / runner / runtime / tool semantic 正文;宿主文件系统正文、host / cluster lifecycle 正文、member host binding 正文;allowlist 正文、policy DSL 正文、approval workflow 正文、tool semantic result 正文;Artifact 正式正文、baseline / evidence 正文、observability store 正文、conversation / UI 展示正文;runtime recover 正文、artifact retention 正文、operator console / replay UI 正文、raw audit store 正文 |

### 6.7 数据项与功能需求映射结论

| 功能需求 | 对应数据项 |
|---|---|
| FR-SBX-001 受控执行请求语境接入 | 正式受控执行请求语境;受理 / 拒绝归责记录;调用方上下文摘要;identity / work / runner / tool / runtime request refs |
| FR-SBX-002 执行环境身份与责任链绑定 | 执行环境身份与责任链绑定事实;调用方上下文摘要;identity / work / runner / tool / runtime request refs |
| FR-SBX-003 跨调用方统一受控执行入口 | 正式受控执行请求语境;受理 / 拒绝归责记录;identity / work / runner / tool / runtime request refs |
| FR-SBX-004 正式隔离环境建立 | 隔离环境建立事实;限制落实校验与建立拒绝事实;backend carrier / workspace source refs |
| FR-SBX-005 统一边界限制施加 | 有效边界限制事实;backend carrier capability 摘要;backend carrier / workspace source refs |
| FR-SBX-006 限制可落实性校验与拒绝 | 限制落实校验与建立拒绝事实;backend carrier capability 摘要 |
| FR-SBX-007 启动前策略语境承接 | 策略执行裁定事实;policy applicability / authorization 摘要;policy / approval / capability refs |
| FR-SBX-008 策略内执行与高风险动作阻断 | 策略执行裁定事实;高风险边界扩张处置事实;policy / approval / capability refs |
| FR-SBX-009 策略缺失冲突或不支持时保守拒绝 | 策略缺失 / 冲突 / 不支持保守拒绝事实;policy applicability / authorization 摘要 |
| FR-SBX-010 跨调用方统一策略执行口径 | 策略执行裁定事实;策略缺失 / 冲突 / 不支持保守拒绝事实;policy / approval / capability refs |
| FR-SBX-011 执行输出统一捕获 | 执行结果捕获事实;输出与候选材料事实;capture-failure 事实 |
| FR-SBX-012 候选材料安全收口 | 输出与候选材料事实;结果 / 候选 / 观测交接事实;artifact / runtime / runner / observability handoff refs |
| FR-SBX-013 观测与审计材料分层交接 | usage / audit / observability material 事实;结果 / 候选 / 观测交接事实;artifact / runtime / runner / observability handoff refs |
| FR-SBX-014 跨调用方统一结果回收链 | 执行结果捕获事实;结果 / 候选 / 观测交接事实;artifact / runtime / runner / observability handoff refs |
| FR-SBX-015 失败分类与原因归并 | 稳定失败分类事实;deny / kill / timeout / replay / cleanup / reaper 控制事实 |
| FR-SBX-016 安全红线保守收束 | redline containment / investigation 事实;稳定失败分类事实;runtime / artifact / observability / investigation refs |
| FR-SBX-017 非 happy path 材料留痕 | deny / kill / timeout / replay / cleanup / reaper 控制事实;capture-failure 事实;cleanup 前置校验与材料保留 guard 事实;redline containment / investigation 事实 |
| FR-SBX-018 租约到期与孤儿环境保守回收 | lease / orphan / recovery 收束事实;cleanup 前置校验与材料保留 guard 事实;下游安全交接 / 调查开放状态摘要;runtime / artifact / observability / investigation refs |

### 6.8 数据项与规则映射结论

| 规则范围 | 数据归属支撑 |
|---|---|
| BR-SBX-001~005 | 通过正式受控执行请求语境、身份绑定事实、归责记录、调用方上下文摘要和 request refs 支撑正式语境先成立、来源可追溯和不能补造上游 truth。 |
| BR-SBX-006~010 | 通过隔离环境建立事实、有效边界限制事实、限制落实校验 / 拒绝事实、backend capability 摘要和 backend refs 支撑真实执行必须在正式隔离环境内发生、限制不可 silent degrade、后端不重写真相。 |
| BR-SBX-011~017 | 通过策略执行裁定事实、保守拒绝事实、高风险边界扩张处置事实、policy applicability 摘要和 policy / approval / capability refs 支撑 policy 前置、fail-closed 和例外授权边界。 |
| BR-SBX-018~024 | 通过执行结果捕获事实、输出与候选材料事实、usage / audit / observability material 事实、交接事实、capture-failure 事实和 handoff refs 支撑材料分层、显式交接和下游真相边界。 |
| BR-SBX-025~033 | 通过稳定失败分类事实、控制事实、lease / orphan 收束事实、cleanup guard 事实、redline investigation 事实、下游安全交接 / 调查摘要和 investigation refs 支撑稳定失败分类、cleanup guard、reaper 边界和 redline 保守收束。 |

### 6.9 边界外数据排除结论

| 排除对象 | 不进入本仓数据归属的原因 | 正确归属 |
|---|---|---|
| ToolDefinition、ToolPolicy、ToolInvocationResult、provider semantic output 正文 | 属于 tools semantic execution 真相,不是 sandbox execution isolation truth。 | `L2-tools` |
| ExecutionInstance、agent loop、checkpoint / recover、业务结果回流正文 | 属于 runtime 主线 truth,不是 sandbox 隔离层 truth。 | `L2-runtime` |
| MemberExecutionHost、SandboxBinding、host health、worker / session lifecycle 正文 | 属于 member host orchestration truth。 | `L2-member-service` |
| actor / member / project / work / implementation plan 正文 | 属于 identity / work 真相源。 | `L1-identity`;`L1-work` |
| Artifact 正式正文、baseline 正文、formal evidence 正文 | 属于制品真相边界。 | `L1-artifact` |
| audit store / trace store / metric store / dashboard 正文 | 属于 observability 真相边界。 | `L4-observability` |
| allowlist 正文、policy DSL 正文、approval workflow 正文 | 属于 policy / governance / capability 真相边界。 | governance / capability / tools policy 来源 |
| host / cluster inventory、Docker / gVisor / Firecracker / k8s 产品状态正文 | 属于外部运行承载或架构 / 配置边界。 | 外部系统 / `01` / `04` / `07` |
| replay UI、inspect console、trend dashboard、operator workflow 正文 | 属于外围增强产品体验或运维面,不是当前核心数据归属。 | 外围增强 / 后续设计 |

### 6.10 能力级数据停审结论

| 能力节点 | 当前数据归属集 | 停审结论 |
|---|---|---|
| C-SBX-1 | 正式受控执行请求语境;身份与责任链绑定事实;归责记录;调用方上下文摘要;request refs;上游正文禁止入仓 | 已覆盖正式 intake、身份锚点、责任链和上游正文禁区,未把 identity/work/runtime/tool 正文写成 sandbox truth,可进入 Step 12。 |
| C-SBX-2 | 隔离环境建立事实;有效边界限制事实;限制落实校验 / 拒绝事实;backend capability 摘要;backend / workspace refs;宿主正文禁区 | 已覆盖正式隔离承载、边界限制、限制落实拒绝和后端摘要,未把后端产品、host lifecycle 或 workspace 正文写成 sandbox truth,可进入 Step 12。 |
| C-SBX-3 | 策略执行裁定事实;保守拒绝事实;边界扩张处置事实;policy 摘要;policy refs;policy / tool semantic 正文禁区 | 已覆盖 policy 前置、fail-closed 和例外处置,未把 allowlist truth、approval 正文或 tool semantic result 正文写成 sandbox truth,可进入 Step 12。 |
| C-SBX-4 | 执行结果捕获事实;输出与候选材料事实;usage / audit / observability material 事实;交接事实;capture-failure 事实;handoff refs;下游正文禁区 | 已覆盖 capture、candidate、observability material 和显式 handoff,未把 Artifact / observability / conversation 正文写成 sandbox truth,可进入 Step 12。 |
| C-SBX-5 | 失败分类事实;控制事实;lease / orphan 收束事实;cleanup guard 事实;redline investigation 事实;下游状态摘要;investigation refs;外部恢复 / retention / UI 正文禁区 | 已覆盖非 happy path、cleanup guard、reaper 和红线调查,未把 runtime recover、artifact retention 或 operator UI 写成 sandbox truth,可进入 Step 12。 |

### 6.11 后续 Step 保护线

| 后续 Step | Step 11 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 12 接口与依赖 | 只能围绕正式执行语境、边界建立、策略裁定、capture / handoff、失败 / cleanup 数据边界定义能力级接口。 | 不写 API path、DTO 字段、event payload、trait、repo 或 adapter。 |
| Step 13 非功能需求 | NFR 只能建立在“哪些数据是本仓 truth、哪些正文禁止入仓”之上。 | 不把 retention、TTL、归档周期、报表刷新等实现口径提前写成数据归属。 |
| Step 14 验收标准 | 验收必须能检查上游正文不入仓、output 不越权成 artifact truth、cleanup 不先删证据、policy 缺失时 fail-closed。 | 不复用旧 evidence alias 或旧 Given-When-Then 原句。 |
| Step 15~16 | 风险和追溯必须检查是否还有孤儿数据项、重复真相或边界外正文误入。 | 不把后续待确认项伪装成当前已定数据结论。 |

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 11 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 11. 数据需求与数据归属

> 校准来源：
> - `design-calibration/00_req_step_11_data_ownership.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节,了解本章如何把 Step 9 功能需求和 Step 10 规则约束收束为当前数据归属边界。

本章定义 `L4-sandbox` 在需求层面对数据的归属边界。`L4-sandbox` 只拥有 execution isolation truth:正式受控执行请求语境、执行环境身份与责任链绑定事实、隔离环境建立事实、有效边界限制事实、策略执行裁定事实、执行结果捕获事实、输出与候选材料事实、usage / audit / observability material 事实、交接事实、capture-failure 事实、稳定失败分类事实、控制事实、lease / orphan 收束事实、cleanup guard 事实和 redline containment / investigation 事实。identity / work / runner / runtime / tool / policy definition / artifact / observability / operator 等外部正文只可作为快照、引用或禁止保存正文进入本仓,不得反向变成 sandbox truth。

### 11.1 数据归属总表

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 正式受控执行请求语境 | 真相数据 | 正式受控执行请求语境由本仓拥有正式真相。 | 从正式受理到显式终止,形成完整 sandbox 请求生命周期。 |
| 执行环境身份与责任链绑定事实 | 真相数据 | 执行环境身份与责任链绑定事实由本仓拥有正式真相。 | 从正式绑定到显式解除或收束,形成完整 sandbox 归责生命周期。 |
| 受理 / 拒绝归责记录 | 真相数据 | 受理或拒绝的归责记录由本仓拥有正式真相。 | 随受理、拒绝、补充说明或显式收束而变化。 |
| 调用方上下文摘要 | 快照数据 | actor / member / work / runner 等正式真相不属于本仓,但本仓可为稳定 intake 保留摘要。 | 随上游正式真相变化而更新,不形成独立真相生命周期。 |
| identity / work / runner / tool / runtime request refs | 引用数据 | 本仓只保存对 identity、work、runner、tool 和 runtime 请求来源的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| actor / member / project / work / runner / runtime / tool semantic 正文 | 禁止保存正文 | identity、work、runner 和 runtime / tool semantic 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| 隔离环境建立事实 | 真相数据 | 隔离环境建立事实由本仓拥有正式真相。 | 从正式创建到显式终止或回收,形成完整隔离环境生命周期。 |
| 有效边界限制事实 | 真相数据 | 资源、文件系统、网络、进程和工作区边界的有效限制事实由本仓拥有正式真相。 | 随限制正式建立、调整、拒绝或终止而变化。 |
| 限制落实校验与建立拒绝事实 | 真相数据 | 限制落实校验结果和建立拒绝事实由本仓拥有正式真相。 | 随建立尝试、能力校验和拒绝收束而变化。 |
| backend carrier capability 摘要 | 快照数据 | backend carrier 的正式能力真相不属于本仓,但本仓可为稳定判断保留能力摘要。 | 随外部运行承载能力变化而更新,不形成独立真相生命周期。 |
| backend carrier / workspace source refs | 引用数据 | 本仓只保存对 backend carrier 和 workspace source 的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| 宿主文件系统正文、host / cluster lifecycle 正文、member host binding 正文 | 禁止保存正文 | 宿主文件系统、集群 / 宿主生命周期和成员宿主绑定正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| 策略执行裁定事实 | 真相数据 | 给定策略下的执行裁定事实由本仓拥有正式真相。 | 随策略受理、执行裁定、显式变更或收束而变化。 |
| 策略缺失 / 冲突 / 不支持保守拒绝事实 | 真相数据 | 策略不完备时的保守拒绝事实由本仓拥有正式真相。 | 随拒绝条件识别、拒绝形成和显式收束而变化。 |
| 高风险边界扩张处置事实 | 真相数据 | 高风险动作的边界扩张处置事实由本仓拥有正式真相。 | 随授权校验、扩张处置和收束结果而变化。 |
| policy applicability / authorization 摘要 | 快照数据 | policy definition 和 authorization 正式真相不属于本仓,但本仓可为稳定执行保留摘要。 | 随上游正式真相变化而更新,不形成独立真相生命周期。 |
| policy / approval / capability refs | 引用数据 | 本仓只保存对 policy、approval 和 capability 来源的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| allowlist 正文、policy DSL 正文、approval workflow 正文、tool semantic result 正文 | 禁止保存正文 | allowlist / policy definition / approval workflow 和 tool semantic result 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| 执行结果捕获事实 | 真相数据 | 执行结果捕获事实由本仓拥有正式真相。 | 随执行完成、结果捕获、补充捕获失败或显式收束而变化。 |
| 输出与候选材料事实 | 真相数据 | 输出与候选材料事实由本仓拥有正式真相。 | 从正式捕获到显式交接或终止,形成完整 capture 生命周期。 |
| usage / audit / observability material 事实 | 真相数据 | usage、audit 和 observability material 事实由本仓拥有正式真相。 | 随材料正式产生、补充或显式交接而变化。 |
| 结果 / 候选 / 观测交接事实 | 真相数据 | 结果、候选材料和观测材料的交接事实由本仓拥有正式真相。 | 随交接正式建立、更新或显式失败而变化。 |
| capture-failure 事实 | 真相数据 | capture-failure 事实由本仓拥有正式真相。 | 随失败识别、补偿、重试或收束而变化。 |
| artifact / runtime / runner / observability handoff refs | 引用数据 | 本仓只保存对下游 handoff 对象的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| Artifact 正式正文、baseline / evidence 正文、observability store 正文、conversation / UI 展示正文 | 禁止保存正文 | formal artifact、baseline / evidence、observability store 和 conversation / UI 展示正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| 稳定失败分类事实 | 真相数据 | 非 happy path 的稳定失败分类事实由本仓拥有正式真相。 | 随失败识别、归并、更新或显式收束而变化。 |
| deny / kill / timeout / replay / cleanup / reaper 控制事实 | 真相数据 | deny、kill、timeout、replay、cleanup 和 reaper 控制事实由本仓拥有正式真相。 | 随控制动作正式发生、补充说明或收束而变化。 |
| lease / orphan / recovery 收束事实 | 真相数据 | 租约到期、孤儿环境和隔离层 recovery 收束事实由本仓拥有正式真相。 | 随租约变化、孤儿检测、回收或收束而变化。 |
| cleanup 前置校验与材料保留 guard 事实 | 真相数据 | cleanup 前置校验和材料保留 guard 事实由本仓拥有正式真相。 | 随 cleanup 申请、前置判断、阻断或放行而变化。 |
| redline containment / investigation 事实 | 真相数据 | 安全红线收束和调查事实由本仓拥有正式真相。 | 随红线识别、保守收束、调查推进或显式关闭而变化。 |
| 下游安全交接 / 调查开放状态摘要 | 快照数据 | 下游安全交接和调查开放状态的正式真相不属于本仓,但本仓可为 cleanup / reaper 判断保留摘要。 | 随上游或下游正式真相变化而更新,不形成独立真相生命周期。 |
| runtime / artifact / observability / investigation refs | 引用数据 | 本仓只保存对 runtime、artifact、observability 和 investigation 外部对象的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| runtime recover 正文、artifact retention 正文、operator console / replay UI 正文、raw audit store 正文 | 禁止保存正文 | runtime recover、artifact retention、operator control UI 和 raw audit store 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
```

---

## 8. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按能力节点组织数据归属 | pass | 已按 C-SBX-1~5 逐节点收束。 |
| 是否每条数据项都有数据类型、归属说明和生命周期口径 | pass | 所有正式数据项均满足固定结构。 |
| 是否先区分真相 / 快照 / 引用 / 禁止保存正文 | pass | 已使用 Step 11 固定四类数据类型。 |
| 是否没有把表结构、字段清单、索引、缓存、事务或 repo / service / port 写进本章 | pass | 当前只保留需求层数据归属结论。 |
| 是否没有把 Artifact / runtime / tools / member / observability / policy definition 正文写成 sandbox truth | pass | 已形成明确的禁止保存正文结论。 |
| 是否没有出现孤儿数据项 | pass | 每条数据项都能回指 Step 2 边界、Step 4 目标 / 非目标、Step 9 功能或 Step 10 规则。 |
| 是否说明了 output / candidate / observability materials 与 downstream truth 的分层 | pass | 已明确 sandbox 自己拥有 capture truth,但不拥有 Artifact / observability / runner / runtime downstream truth。 |
| 是否说明了 cleanup / reaper 为什么不能先删证据 | pass | 已通过 cleanup guard 事实、下游安全交接 / 调查开放状态摘要和 investigation refs 收束。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未创建未来 Step 文件 | pass | 当前未创建 Step 12~17 文件。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现、测试或验收证据。 |
| 是否允许进入 Step 12 | pass_wait_review | 技术上 Step 11 已完成;按用户要求等待审查确认后再进入 Step 12。 |

next_allowed_action: `wait_user_confirm_step_12`
