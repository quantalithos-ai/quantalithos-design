# L4-sandbox 00 需求 Step 9: 功能需求

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 8,允许进入 Step 9;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 9 章“功能需求”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 9 功能需求 |
| 输出文件 | `design-calibration/00_req_step_09_functional_requirements.md` |
| 前置确认 | pass:用户在 Step 8 停审后回复“同意”,允许进入 Step 9 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 9;`需求文档书写规范.md` §4.9 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `02-概要设计.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中旧功能、后端、事件、审计、Runner 复用和 fail-closed 线索 |
| 已读取参考粒度 | yes:`projects/L1-artifact/design-calibration/00_req_step_09_functional_requirements.md`;`projects/L1-governance/design-calibration/00_req_step_09_functional_requirements.md` |
| 历史材料口径 | 旧 `F-001~F-010`、旧 `SandboxService`、旧后端清单、旧事件名、旧 benchmark 和旧验收句式只作差异审计输入,不原样继承 |
| 禁写范围 | 不写业务规则、数据归属、接口签名、DTO、event payload、API path、port、repository、handler、事务流程、配置 key、后端选型、NFR、测试、验收或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_10 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~8、SOP、书写规范、历史功能材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 按能力节点组织的功能需求方向、核心 / 外围增强区分和 Step 10 准入判断 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 8 到 Step 9 的转译诊断、旧功能污染诊断、边界串线诊断和跨能力重复诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 按能力节点归并、能力主题命名、优先级表达、输出分层和失败分层取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 功能需求表、能力语义补充表、功能依赖顺序表、故事承接映射、边界外功能排除表和能力级停审结论 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录、是否继承旧功能、是否保留外围增强、是否触发 blocker 判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 9 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 9 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 10。 |

---

## 2. 必读摘要

| 文档 | Step 9 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 9 | Step 9 要把 Step 8 用户故事归并为系统必须提供的业务能力,输出按能力节点组织的功能需求结论、能力类型结论、闭环映射结论、故事映射结论和能力级功能停审结论。 | 不得先生成全仓功能清单再贴标签;不得按对象、CRUD、API、Command 或内部函数拆功能。 |
| `需求文档书写规范.md` §4.9 | 正式功能需求表固定为“功能需求 / 能力类型 / 说明 / 支撑的核心能力闭环 / 对应的用户故事”;功能需求必须写成能力主题。 | 不写接口名、对象操作、命令名、后端产品名或实现收益;边界外能力不进入正式功能需求表。 |
| `设计文档编写通则.md` | Step 9 是 Step 10~14 的结构锚点之一,正式正文只承载收口结论。 | 本文件保留诊断和取舍;正式 `00` 仍等待 Step 17 装配。 |
| `设计文档讨论中间产物规范.md` | Step 9 必须独立落盘并维护计划、诊断、取舍、结构化产物和自检;不得提前创建 Step 10~17 文件。 | 当前只创建 Step 9 文件。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从台账和已完成 Step 文件恢复;正式 baseline 只能来自文件。 | Step 9 只给出能力级功能,不生成 schema、state、event、evidence 或 implementation boundary。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点、外围增强能力和边界外能力。 | Step 9 必须按 C-SBX-1~5 逐节点归并功能需求。 |
| `00_req_step_08_user_stories.md` | 已形成 US-SBX-001~016 和 US-SBX-E01~E06,并明确功能必须回指核心能力节点和故事。 | 不把故事原句直接改成功能名;Runner、一部分安全审查和审计故事跨节点时要避免重复功能。 |
| `00_req_step_02_position_boundary.md` | `L4-sandbox` 是平台运行隔离基础仓,不混入 tools/runtime/member truth,也不拥有 artifact、observability 或 policy decision truth。 | 功能需求必须持续保护相邻仓边界。 |
| `00_req_step_04_goals_non_goals.md` | 目标覆盖 execution environment identity、resource limits、filesystem/network/process boundary、launch policy、capture、observability hooks、failure、cleanup 和 security redlines。 | 功能需求必须让这些主轴在后续规则、数据、接口、NFR 和验收中可继续展开。 |
| `00_req_step_06_consumers_dependencies.md` | `L0-core` 是唯一编译期依赖;isolation backend 是运行期前置;tools/runtime/member-service/runner/artifact/observability 是消费或协作方。 | Step 9 可以表达对消费方有意义的能力,但不能把依赖方或后端产品写成功能本体。 |
| 旧 `00-需求文档.md` §6 | 旧功能表写 `SandboxService trait`、Docker/gVisor/local_process backend、资源限制、默认无出网、白名单、审计事件、Runner 复用和 escape hooks。 | 这些线索只能转译为能力主题或外围增强;接口、后端、规则、事件和测试口径不得直接继承。 |
| 旧 `README.md` / `02-概要设计.md` | 旧材料提供统一执行、隔离后端、network policy、output capture、审计、kill/replay/cleanup 和 multi-backend 线索。 | 这些线索只能服务当前归并,不能把具体后端、事件名、控制台或重放产品化能力写成核心功能。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 当前正在讨论哪个核心能力节点? | Step 9 按 C-SBX-1 受控执行语境识别与约束、C-SBX-2 隔离环境边界建立与限制施加、C-SBX-3 给定策略内执行与 fail-closed、C-SBX-4 输出与观测材料安全捕获和分层交接、C-SBX-5 失败租约清理与安全红线保守收束的顺序逐个归并功能需求。 |
| 根据这些用户故事,系统必须提供哪些业务能力? | 必须提供 18 条核心闭环能力主题:受控执行请求语境接入、执行环境身份与责任链绑定、跨调用方统一受控执行入口、正式隔离环境建立、统一边界限制施加、限制可落实性校验与拒绝、启动前策略语境承接、策略内执行与高风险动作阻断、策略缺失冲突或不支持时保守拒绝、跨调用方统一策略执行口径、执行输出统一捕获、候选材料安全收口、观测与审计材料分层交接、跨调用方统一结果回收链、失败分类与原因归并、安全红线保守收束、非 happy path 材料留痕、租约到期与孤儿环境保守回收;另保留 6 条外围增强能力。 |
| 每个能力的输入、输出、触发条件、失败情况是什么? | 已按核心能力节点形成能力级功能语义补充表,见 6.2。当前只写能力级输入 / 输出 / 触发 / 失败,不写字段、DTO、状态机或事件 schema。 |
| 哪些能力共同构成闭环核心?哪些只是外围增强? | FR-SBX-001~018 是核心闭环能力;FR-SBX-E01~E06 是外围增强能力。核心能力必须先成立,外围增强只能在不破坏主闭环的前提下保留。 |
| 当前功能需求是否都能回指该能力节点下的用户故事? | 能。所有核心功能都已映射到 C-SBX-1~5 和对应 `US-SBX` 编号;外围增强功能映射到 `US-SBX-E01~E06`。 |
| 当前能力节点是否存在故事已确认但没有功能承接? | 不存在。C-SBX-1~5 每个节点下的已确认故事都至少由 2~4 条功能需求承接。 |
| 当前能力节点的功能需求是否足以进入规则讨论? | 足以。Step 9 已把“统一入口、边界施加、fail-closed、输出交接、失败清理红线”归并为能力级功能,后续可以在 Step 10 继续收束业务规则与边界约束。 |

---

## 4. 当前材料诊断

### 4.1 从 Step 8 到 Step 9 的转译诊断

| 核心能力节点 | 容易误写成什么 | 当前转译方式 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | `SandboxService`、`ExecuteSandboxed`、`Session`、`ExecutionHandle` 一类接口或对象名 | 写成受控执行请求接入、身份与责任链绑定、跨调用方统一入口三个能力主题。 |
| C-SBX-2 隔离环境边界建立与限制施加 | Docker / gVisor / Firecracker 后端支持清单,或 cgroup / namespace / mount 技术动作 | 写成正式隔离环境建立、统一边界限制施加、限制可落实性校验与拒绝三个能力主题。 |
| C-SBX-3 给定策略内执行与 fail-closed | 默认无出网、白名单、ToolPolicy allowlist、firewall rule | 写成启动前策略语境承接、策略内执行与高风险动作阻断、保守拒绝和跨调用方统一策略口径四个能力主题。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | `stdout/stderr/exit_code`、事件名、上传动作、artifact 写入动作 | 写成输出统一捕获、候选材料安全收口、观测与审计材料分层交接、统一结果回收链四个能力主题。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | `limit_exceeded` 错误码、cleanup API、escape_detected event、operator replay console | 写成失败分类、安全红线收束、非 happy path 留痕和 lease/orphan 保守回收四个能力主题。 |

### 4.2 旧功能污染诊断

| 旧功能 / 旧表达 | 有效线索 | 当前问题 | Step 9 处理 |
|---|---|---|---|
| `F-001 SandboxService trait` | 需要统一受控执行入口和统一结果语义。 | 接口名和 trait 直接锁死实现边界。 | 转译为 FR-SBX-001、FR-SBX-002、FR-SBX-003 和 FR-SBX-007。 |
| `F-002 Docker backend` | 需要隔离承载。 | 后端产品不是正式功能需求。 | 不进核心功能表;只保留为 FR-SBX-E01 / 01 / 04 / 07 的后续线索。 |
| `F-003 gVisor backend` | 需要更强隔离等级。 | 仍是后端产品与风险分层选择,不是核心功能。 | 不进核心功能表;作为 FR-SBX-E01 / FR-SBX-E05 线索。 |
| `F-004 local_process backend` | 提示存在测试或低隔离降级场景。 | 测试后端属于架构 / 配置 / 测试范围。 | 不进入 Step 9;后置 01 / 04 / 05。 |
| `F-005 资源限制` | 统一 limits 和失败分类是核心线索。 | 旧表达把 limits 当单点功能,未与边界和 failure 语义分开。 | 转译为 FR-SBX-005 和 FR-SBX-015。 |
| `F-006 默认无出网` | deny-by-default 是核心线索。 | 单条规则不能直接写成功能。 | 转译为 FR-SBX-008 / FR-SBX-009,规则后置 Step 10。 |
| `F-007 白名单出网` | 策略控制高风险外联是核心线索。 | 旧表达仍是规则 / 策略动作。 | 转译为 FR-SBX-007 / FR-SBX-008 / FR-SBX-009。 |
| `F-008 审计事件` | 输出、资源和非 happy path 材料需要可交接和可留痕。 | 事件名和事件覆盖率不属于功能层。 | 转译为 FR-SBX-013 和 FR-SBX-017。 |
| `F-009 Runner 复用` | 跨调用方统一入口、统一策略和统一回收链是核心线索。 | “复用同接口”过早固化 API。 | 转译为 FR-SBX-003、FR-SBX-010 和 FR-SBX-014。 |
| `F-010 escape detection hooks` | 安全红线事件必须保守收束并显式留痕。 | hooks、告警路径和事件名属于接口 / 观测 / 验收范围。 | 转译为 FR-SBX-016 和 FR-SBX-017。 |

### 4.3 边界串线诊断

| 易串线对象 | 若误写进功能会怎样 | 当前防线 |
|---|---|---|
| `L2-tools` | 会把 tool semantic execution、ToolPolicy 和 ToolResult truth 写成 sandbox 功能。 | Step 9 只写隔离执行承载和边界反馈能力。 |
| `L2-runtime` | 会把 ExecutionInstance、agent loop、recover/checkpoint 写成 sandbox 功能。 | Step 9 不写执行主线、恢复主线或结果回流 truth。 |
| `L2-member-service` | 会把 SandboxBinding、worker/session、host health 写成 sandbox 功能。 | Step 9 只写隔离环境能力,不写宿主生命周期装配。 |
| `L1-artifact` | 会把候选输出直接写成 Artifact 正式入库、版本或 baseline 功能。 | Step 9 只写候选材料安全收口和交接,不写正式 Artifact truth。 |
| `L4-observability` | 会把 trace / metric / audit store、查询和告警写成 sandbox 功能。 | Step 9 只写观测与审计材料交接,不写观测存储。 |
| governance / capability / tools policy 来源 | 会把 allowlist truth、审批和 policy DSL 写成 sandbox 功能。 | Step 9 只写承接给定策略并按策略执行 / 拒绝。 |
| container / k8s / isolation backend | 会把 Docker/gVisor/Firecracker/k8s 选型写成正式功能。 | Step 9 只写抽象隔离能力,后端选型后置。 |
| Console / Runner / Chat / Bridge 产品入口 | 会把上层产品交互、控制台和 UI 流程写成 sandbox 功能。 | Step 9 只写统一回收链和消费语境,不写产品流程。 |
| 镜像构建与供应链资产 | 会把运行镜像生命周期写成 sandbox 功能。 | Step 9 不写镜像构建或资产发布。 |

### 4.4 跨能力重复诊断

最容易发生重复的地方有三类:

1. Runner 相关功能容易同时落到 C-SBX-1、C-SBX-3、C-SBX-4。
2. 安全相关功能容易把 C-SBX-2 的边界校验和 C-SBX-3 的 fail-closed 混成一条。
3. 审计 / 留痕相关功能容易把 C-SBX-4 的材料交接和 C-SBX-5 的非 happy path 留痕混成一条。

当前处理口径:

- Runner 在 C-SBX-1 讲统一入口,在 C-SBX-3 讲统一策略口径,在 C-SBX-4 讲统一回收链,三者语义不同。
- 安全在 C-SBX-2 讲“限制必须能被落实”,在 C-SBX-3 讲“策略不完备时必须拒绝”,在 C-SBX-5 讲“红线事件必须保守收束”,三者不重复。
- 审计在 C-SBX-4 讲输出 / usage / audit material 分层交接,在 C-SBX-5 讲 deny / kill / cleanup / reaper 的非 happy path 留痕,边界清楚。

---

## 5. 设计取舍

### 5.1 按能力节点归并而不是沿用旧功能清单

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 沿用旧 `F-001~F-010` | 直观,接近历史材料。 | 后端、接口、规则、事件和测试口径混在一起,无法直接承接 Step 10~14。 | 不采用。 |
| 方案 B: 按 C-SBX-1~5 逐节点归并功能需求 | 与 Step 7 / Step 8 锚点一致,利于后续规则、数据、接口、NFR、验收按节点继续收束。 | 需要额外处理跨节点重复风险。 | 采用。 |

### 5.2 功能保持能力主题,不写 CRUD / API / Command

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 继续使用 `SandboxService`、`ExecuteSandboxed`、`limit_exceeded`、`SandboxExited` 等旧表达 | 会把 Step 9 退化成接口、错误码和事件清单。 | 不采用。 |
| 方案 B | 写成“受控执行请求语境接入”“统一边界限制施加”“非 happy path 材料留痕”等能力主题 | 能稳定承接 Step 10~14。 | 采用。 |

### 5.3 不使用 P0 / P1,改用核心闭环能力 + 功能依赖顺序

旧 `00` 使用 `P0/P1` 标签,但 `需求文档书写规范.md` 4.9 已固定能力类型列为“核心闭环能力 / 外围增强能力”。当前取舍是:

- 正式功能表不再使用 `P0/P1`。
- 重要性通过“核心闭环能力 / 外围增强能力”表达。
- 先后关系通过 6.3 的功能依赖与讨论顺序表表达。

这样既满足 Step 9 的固定结构,也避免把项目排期标签误写进需求真相。

### 5.4 输出、候选材料、观测交接是否拆成四条功能

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 只保留一条“输出回收与审计留痕”功能 | 最短,接近旧 `02`。 | 会把输出、候选材料、观测材料和跨调用方回收链混成大桶。 | 不采用。 |
| 方案 B | 拆成“输出统一捕获 / 候选材料安全收口 / 观测与审计材料分层交接 / 统一结果回收链”四条功能 | 能为 Step 10~12 明确区分结果、候选材料、观测材料和回收语境。 | 采用。 |

### 5.5 失败、红线、留痕和回收是否拆成四条功能

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 只保留一条“失败与清理”功能 | 简洁。 | 会把错误分类、安全红线、审计材料和 reaper 回收混成一条,后续规则难展开。 | 不采用。 |
| 方案 B | 拆成“失败分类 / 红线收束 / 非 happy path 留痕 / lease-orphan 回收”四条功能 | 能保持后续规则、数据和验收的边界清晰。 | 采用。 |

### 5.6 多后端、inspect、调度和趋势分析保留为外围增强

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 把多后端、replay/inspect、多集群调度和趋势分析混入核心功能表 | 核心闭环被产品化和运营增强能力稀释。 | 不采用。 |
| 方案 B | 保留为外围增强功能,单独成表 | 既保留历史有价值方向,又不压过核心闭环。 | 采用。 |

### 5.7 policy 来源保持抽象,不把 capability-hub 固化成唯一真相源

旧材料多次指向 capability-hub 白名单。当前取舍是:

- Step 9 只写“启动前策略语境承接”和“策略内执行”。
- 不把 governance、capability、tools 中任何一个仓固化为唯一 policy 来源。
- 真相源选择和协作边界留给 Step 6、Step 10 和 Step 12 继续裁剪。

---

## 6. 结构化中间产物

### 6.1 功能需求结论

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| FR-SBX-001 | 受控执行请求语境接入 | 核心闭环能力 | 系统必须支持在真实执行开始前接收正式执行语境和最小边界前提,使受控执行请求有稳定的受理入口。 | C-SBX-1 受控执行语境识别与约束 | US-SBX-001;US-SBX-003 |
| FR-SBX-002 | 执行环境身份与责任链绑定 | 核心闭环能力 | 系统必须支持把 actor/member/work/runner 来源语境绑定到执行环境身份,使隔离执行可以稳定归责和对账。 | C-SBX-1 受控执行语境识别与约束 | US-SBX-001;US-SBX-002 |
| FR-SBX-003 | 跨调用方统一受控执行入口 | 核心闭环能力 | 系统必须支持不同调用方进入同一套 sandbox 语义边界,而不是为 Runner 或其他调用方维护第二套执行入口。 | C-SBX-1 受控执行语境识别与约束 | US-SBX-003 |
| FR-SBX-004 | 正式隔离环境建立 | 核心闭环能力 | 系统必须支持把真实执行放入正式管理的隔离环境,而不是退化为宿主侧直接执行。 | C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004 |
| FR-SBX-005 | 统一边界限制施加 | 核心闭环能力 | 系统必须支持对资源、文件系统、网络和进程边界施加一致限制,并保持跨调用方的一致语义。 | C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004;US-SBX-005 |
| FR-SBX-006 | 限制可落实性校验与拒绝 | 核心闭环能力 | 系统必须支持在隔离边界无法被实际落实时显式拒绝执行,而不是静默退化或部分忽略限制。 | C-SBX-2 隔离环境边界建立与限制施加;C-SBX-3 给定策略内执行与 fail-closed | US-SBX-006 |
| FR-SBX-007 | 启动前策略语境承接 | 核心闭环能力 | 系统必须支持在高风险执行开始前承接正式 launch / isolation policy 语境,使执行不脱离治理边界。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-007;US-SBX-008 |
| FR-SBX-008 | 策略内执行与高风险动作阻断 | 核心闭环能力 | 系统必须支持只在给定策略范围内继续执行受控动作,并阻断越出边界的高风险动作继续发生。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-007;US-SBX-008 |
| FR-SBX-009 | 策略缺失冲突或不支持时保守拒绝 | 核心闭环能力 | 系统必须支持把策略缺失、策略冲突或后端不支持策略视为明确拒绝条件,而不是 best-effort 继续执行。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-008 |
| FR-SBX-010 | 跨调用方统一策略执行口径 | 核心闭环能力 | 系统必须支持让 Runner、工具和自动化执行场景遵守同一套策略执行语义和失败语义。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-009 |
| FR-SBX-011 | 执行输出统一捕获 | 核心闭环能力 | 系统必须支持把受控执行产生的标准输出、结果语境和完成状态通过统一回收主线收口。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010;US-SBX-012 |
| FR-SBX-012 | 候选材料安全收口 | 核心闭环能力 | 系统必须支持把隔离执行内部产生的候选文件和材料安全收口并交接,但不直接宣布正式 Artifact truth。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010 |
| FR-SBX-013 | 观测与审计材料分层交接 | 核心闭环能力 | 系统必须支持把 resource usage、audit、trace 和其他观测材料连同来源语境一起分层交接,而不拥有观测存储真相。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-011 |
| FR-SBX-014 | 跨调用方统一结果回收链 | 核心闭环能力 | 系统必须支持让 Runner 场景与其他调用方通过同一套 capture / handoff 语义消费隔离执行结果。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010;US-SBX-012 |
| FR-SBX-015 | 失败分类与原因归并 | 核心闭环能力 | 系统必须支持把 timeout、资源超限、backend failure、capture failure、orphan environment 等非 happy path 收束为稳定失败分类。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013 |
| FR-SBX-016 | 安全红线保守收束 | 核心闭环能力 | 系统必须支持把 escape-like、越权访问和其他安全红线事件收束为显式保守结果,而不是静默扩散。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-014 |
| FR-SBX-017 | 非 happy path 材料留痕 | 核心闭环能力 | 系统必须支持对 deny、kill、replay、cleanup 和其他异常控制动作形成可追溯材料。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013;US-SBX-015 |
| FR-SBX-018 | 租约到期与孤儿环境保守回收 | 核心闭环能力 | 系统必须支持在租约过期或孤儿环境场景下进行保守回收,同时不重写相邻仓业务真相。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013;US-SBX-016 |
| FR-SBX-E01 | 风险分层隔离承载选择 | 外围增强能力 | 系统可进一步支持按风险等级选择更强或更经济的隔离承载方案。 | 外围增强能力 | US-SBX-E01 |
| FR-SBX-E02 | 高级 replay / inspect / operator 控制 | 外围增强能力 | 系统可进一步支持复杂故障和异常会话的 replay、inspect 和 operator 控制面。 | 外围增强能力 | US-SBX-E02 |
| FR-SBX-E03 | 输出预览与结果分析辅助 | 外围增强能力 | 系统可进一步支持对执行输出和结果材料进行更丰富的预览与分析辅助。 | 外围增强能力 | US-SBX-E03 |
| FR-SBX-E04 | 多宿主 / 多集群隔离调度 | 外围增强能力 | 系统可进一步支持按宿主或集群维度调度受控执行能力。 | 外围增强能力 | US-SBX-E04 |
| FR-SBX-E05 | 后端能力比较与策略模拟 | 外围增强能力 | 系统可进一步支持比较不同后端的隔离能力和策略承载差异。 | 外围增强能力 | US-SBX-E05 |
| FR-SBX-E06 | 容量性能成本趋势分析 | 外围增强能力 | 系统可进一步支持隔离成本、启动时延、输出体积和失败分布的长期趋势分析。 | 外围增强能力 | US-SBX-E06 |

### 6.2 按能力节点组织的功能语义补充

| 核心能力节点 | 承接功能 | 能力级输入 | 能力级输出 | 触发条件 | 失败情况 |
|---|---|---|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | FR-SBX-001;FR-SBX-002;FR-SBX-003 | 调用方来源语境、actor/member/work/runner 引用、待执行动作语境、最小边界前提 | 正式 sandbox 请求语境、执行环境身份锚点、统一入口语义 | 平台需要发起真实代码、工具、构建、测试或 Runner 应用执行 | 来源不可追溯、执行语境缺失、调用方绕过统一入口 |
| C-SBX-2 隔离环境边界建立与限制施加 | FR-SBX-004;FR-SBX-005;FR-SBX-006 | 已受理执行语境、隔离边界要求、后端能力语境 | 已建立隔离环境或显式拒绝结果、一致的 limits / fs / network / process 边界 | 正式受控执行准备进入运行承载 | 无法建立隔离环境、限制无法落实、出现宿主直跑或 silent degrade 倾向 |
| C-SBX-3 给定策略内执行与 fail-closed | FR-SBX-007;FR-SBX-008;FR-SBX-009;FR-SBX-010 | launch / isolation policy 语境、请求动作语境、后端策略承载能力 | 策略内执行结果或保守拒绝结果、统一策略执行语义 | 高风险执行即将开始或执行过程中出现策略约束检查 | 策略缺失、冲突、不支持或调用方场景出现第二套策略口径 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | FR-SBX-011;FR-SBX-012;FR-SBX-013;FR-SBX-014 | 运行中的隔离环境、标准输出、候选文件材料、usage / audit / trace 等观测材料 | 统一执行结果、候选材料 refs、观测与审计交接材料、统一回收语境 | 执行产生输出、完成或需要向下游交接材料 | capture 失败、来源语境丢失、Runner 与其他调用方结果回收链分叉 |
| C-SBX-5 失败租约清理与安全红线保守收束 | FR-SBX-015;FR-SBX-016;FR-SBX-017;FR-SBX-018 | timeout / limit / deny / kill / backend failure 信号、redline 指示、lease 状态、orphan 检测信号 | 稳定失败分类、红线收束结果、非 happy path 材料、cleanup / reaper 结果 | 非 happy path 发生,或后台维护需要处理租约 / 孤儿环境 | 失败语义漂移、证据先删后查、红线事件静默扩散、回收动作重写相邻仓 truth |

### 6.3 功能依赖与讨论顺序结论

| 功能组 | 功能编号 | 前置关系 | 对后续的支撑 | 排序结论 |
|---|---|---|---|---|
| 受控执行语境 | FR-SBX-001~003 | 无 | 为隔离环境建立、策略执行、结果交接和失败留痕提供统一入口与责任链语境 | 核心闭环起点 |
| 隔离边界建立 | FR-SBX-004~006 | 依赖 FR-SBX-001~003 | 为策略内执行和统一失败分类提供正式承载边界 | 核心闭环前置 |
| 策略内执行 | FR-SBX-007~010 | 依赖 FR-SBX-001~006 | 为 deny-by-default、跨调用方一致性和安全红线保护提供执行语义 | 核心闭环前置 |
| 输出与观测交接 | FR-SBX-011~014 | 依赖 FR-SBX-001~010 | 为 artifact / observability / runtime / runner 等下游消费提供统一结果主线 | 核心闭环后段 |
| 失败与回收收束 | FR-SBX-015~018 | 依赖 FR-SBX-001~010,并与 FR-SBX-011~014 协同保留材料 | 为规则、数据、验收中的非 happy path 收口提供主轴 | 核心闭环后段 |
| 外围增强 | FR-SBX-E01~E06 | 依赖一项或多项核心闭环能力已成立 | 提升承载选择、调度、运维和分析能力 | 不作为核心闭环成立前置 |

### 6.4 故事承接与闭环映射结论

| 核心能力节点 | 已确认故事 | 承接功能 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | US-SBX-001;US-SBX-002;US-SBX-003 | FR-SBX-001;FR-SBX-002;FR-SBX-003 |
| C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004;US-SBX-005;US-SBX-006 | FR-SBX-004;FR-SBX-005;FR-SBX-006 |
| C-SBX-3 给定策略内执行与 fail-closed | US-SBX-006;US-SBX-007;US-SBX-008;US-SBX-009 | FR-SBX-007;FR-SBX-008;FR-SBX-009;FR-SBX-010 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010;US-SBX-011;US-SBX-012 | FR-SBX-011;FR-SBX-012;FR-SBX-013;FR-SBX-014 |
| C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013;US-SBX-014;US-SBX-015;US-SBX-016 | FR-SBX-015;FR-SBX-016;FR-SBX-017;FR-SBX-018 |
| 外围增强 | US-SBX-E01;US-SBX-E02;US-SBX-E03;US-SBX-E04;US-SBX-E05;US-SBX-E06 | FR-SBX-E01;FR-SBX-E02;FR-SBX-E03;FR-SBX-E04;FR-SBX-E05;FR-SBX-E06 |

### 6.5 能力级功能停审结论

| 能力节点 | 当前功能集 | 停审结论 |
|---|---|---|
| C-SBX-1 | FR-SBX-001~003 | 已覆盖正式受理入口、执行环境身份语境和跨调用方统一入口,未把接口名或对象名写成正式功能,可进入 Step 10。 |
| C-SBX-2 | FR-SBX-004~006 | 已覆盖正式隔离承载、一致边界施加和“不能 silent degrade”的边界校验,未把 Docker/gVisor 等后端产品写成核心功能,可进入 Step 10。 |
| C-SBX-3 | FR-SBX-007~010 | 已覆盖承接给定策略、策略内执行、保守拒绝和跨调用方统一策略口径,未把 ToolPolicy、allowlist 或 policy DSL 写成功能,可进入 Step 10。 |
| C-SBX-4 | FR-SBX-011~014 | 已覆盖结果捕获、候选材料收口、观测 / 审计材料交接和统一回收链,未把 Artifact truth 或 observability store 写成功能,可进入 Step 10。 |
| C-SBX-5 | FR-SBX-015~018 | 已覆盖失败分类、安全红线、非 happy path 留痕和 reaper 回收,未把 runtime recover、业务裁决或 Artifact 正式入库写成功能,可进入 Step 10。 |

### 6.6 边界外功能排除结论

| 排除能力 | 不进入本仓功能的原因 | 正确归属 |
|---|---|---|
| ToolDefinition / ToolPolicy / ToolResult 语义执行 | 属于 tool semantic execution 与工具真相源,不属于 sandbox 隔离基础 | `L2-tools` |
| ExecutionInstance / agent loop / checkpoint / recover | 属于 runtime 执行主线和恢复主线,不属于 sandbox 功能 | `L2-runtime` |
| SandboxBinding / host lifecycle / worker-session health | 属于成员宿主装配和生命周期真相 | `L2-member-service` |
| Artifact 正式入库、版本、baseline 和 evidence truth | sandbox 只承接候选材料和来源语境,不决定正式制品真相 | `L1-artifact` |
| trace / metric / audit store 查询和告警 | sandbox 只提供 hook 和材料,不拥有观测存储真相 | `L4-observability` |
| allowlist truth、审批流和 policy DSL | sandbox 执行给定策略,不拥有策略决策真相 | governance / capability / tools policy 来源 |
| Docker / gVisor / Firecracker / k8s 选型与部署拓扑 | 属于架构、配置和实施阶段,不是正式功能需求 | `01` / `04` / `07` |
| Console / Runner / Chat / Bridge 交互流程与 UI 状态 | 属于产品入口和消费层语义,不属于隔离基础功能 | `L5-console` / `L5-runner` / `L5-chat` / `L6-bridges` |
| 镜像构建与供应链资产生命周期 | 属于成员镜像或部署供应链边界,不属于 sandbox 功能 | `L2-member-images` 或实施边界 |

### 6.7 跨能力功能审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否存在孤儿功能 | no | 所有核心与外围增强功能均能回指核心能力节点或“外围增强能力”。 |
| 是否存在无故事来源的功能 | no | 每条功能都在 6.1 中标明对应 `US-SBX` 编号。 |
| 是否存在把故事原句直接改成功能项 | no | 功能已被归并为能力主题,不是角色目标原句复述。 |
| 是否存在把功能写成 CRUD / API / Command | no | 已剔除 `SandboxService`、`ExecuteSandboxed`、后端名、错误码和事件名。 |
| 是否存在边界外能力误入正式功能表 | no | 已形成边界外功能排除表。 |
| 是否存在跨能力重复功能 | acceptable_and_explained | Runner 统一入口 / 策略 / 回收链,以及审计交接 / 非 happy path 留痕跨节点协同,但语义不重复。 |

### 6.8 后续 Step 保护线

| 后续 Step | Step 9 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 10 业务规则与边界约束 | 规则必须优先保护 FR-SBX-006、FR-SBX-008、FR-SBX-009、FR-SBX-013、FR-SBX-016、FR-SBX-017、FR-SBX-018 等能力。 | 不把 deny-by-default、no silent degrade、cleanup 不先删证据直接写回功能表。 |
| Step 11 数据归属 | 数据项必须解释执行环境语境、边界请求、候选材料 refs、观测材料和失败留痕分别属于什么 truth。 | 不把 Artifact、ExecutionInstance、ToolPolicy 或 observability store 拉进 sandbox 数据真相。 |
| Step 12 接口与依赖 | 接口边界必须服务 FR-SBX-001~018,但不能反向用 API 名、DTO 或事件 payload 改写功能。 | 不写 trait、handler、port、payload、path 或 repository。 |
| Step 13~14 | NFR 和验收要从功能业务价值出发,重新校准旧 benchmark、留痕率、拒绝率和后端时延目标。 | 不继承旧 README / 旧 `00` 的性能数字或验收句式。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | 功能表、语义补充、依赖顺序和排除表足以承载 Step 9 结论。 |
| 是否原样继承旧功能 | no | 旧 `F-001~F-010` 已全部转译或裁剪。 |
| 是否保留外围增强功能 | yes | 保留 6 条外围增强能力,但单独成表,不压过核心闭环。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 9 的上游冲突。 |
| 是否允许进入 Step 10 | pass_wait_review | 技术上 Step 9 已完成;按用户规则等待审查确认后再进入 Step 10。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 9 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 9. 功能需求

> 校准来源：
> - `design-calibration/00_req_step_09_functional_requirements.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何从 Step 8 用户故事归并为当前功能需求表。

### 9.1 核心闭环功能需求

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-SBX-001 受控执行请求语境接入 | 核心闭环能力 | 系统必须支持在真实执行开始前接收正式执行语境和最小边界前提,使受控执行请求有稳定的受理入口。 | C-SBX-1 受控执行语境识别与约束 | US-SBX-001;US-SBX-003 |
| FR-SBX-002 执行环境身份与责任链绑定 | 核心闭环能力 | 系统必须支持把 actor/member/work/runner 来源语境绑定到执行环境身份,使隔离执行可以稳定归责和对账。 | C-SBX-1 受控执行语境识别与约束 | US-SBX-001;US-SBX-002 |
| FR-SBX-003 跨调用方统一受控执行入口 | 核心闭环能力 | 系统必须支持不同调用方进入同一套 sandbox 语义边界,而不是为 Runner 或其他调用方维护第二套执行入口。 | C-SBX-1 受控执行语境识别与约束 | US-SBX-003 |
| FR-SBX-004 正式隔离环境建立 | 核心闭环能力 | 系统必须支持把真实执行放入正式管理的隔离环境,而不是退化为宿主侧直接执行。 | C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004 |
| FR-SBX-005 统一边界限制施加 | 核心闭环能力 | 系统必须支持对资源、文件系统、网络和进程边界施加一致限制,并保持跨调用方的一致语义。 | C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004;US-SBX-005 |
| FR-SBX-006 限制可落实性校验与拒绝 | 核心闭环能力 | 系统必须支持在隔离边界无法被实际落实时显式拒绝执行,而不是静默退化或部分忽略限制。 | C-SBX-2 隔离环境边界建立与限制施加;C-SBX-3 给定策略内执行与 fail-closed | US-SBX-006 |
| FR-SBX-007 启动前策略语境承接 | 核心闭环能力 | 系统必须支持在高风险执行开始前承接正式 launch / isolation policy 语境,使执行不脱离治理边界。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-007;US-SBX-008 |
| FR-SBX-008 策略内执行与高风险动作阻断 | 核心闭环能力 | 系统必须支持只在给定策略范围内继续执行受控动作,并阻断越出边界的高风险动作继续发生。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-007;US-SBX-008 |
| FR-SBX-009 策略缺失冲突或不支持时保守拒绝 | 核心闭环能力 | 系统必须支持把策略缺失、策略冲突或后端不支持策略视为明确拒绝条件,而不是 best-effort 继续执行。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-008 |
| FR-SBX-010 跨调用方统一策略执行口径 | 核心闭环能力 | 系统必须支持让 Runner、工具和自动化执行场景遵守同一套策略执行语义和失败语义。 | C-SBX-3 给定策略内执行与 fail-closed | US-SBX-009 |
| FR-SBX-011 执行输出统一捕获 | 核心闭环能力 | 系统必须支持把受控执行产生的标准输出、结果语境和完成状态通过统一回收主线收口。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010;US-SBX-012 |
| FR-SBX-012 候选材料安全收口 | 核心闭环能力 | 系统必须支持把隔离执行内部产生的候选文件和材料安全收口并交接,但不直接宣布正式 Artifact truth。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010 |
| FR-SBX-013 观测与审计材料分层交接 | 核心闭环能力 | 系统必须支持把 resource usage、audit、trace 和其他观测材料连同来源语境一起分层交接,而不拥有观测存储真相。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-011 |
| FR-SBX-014 跨调用方统一结果回收链 | 核心闭环能力 | 系统必须支持让 Runner 场景与其他调用方通过同一套 capture / handoff 语义消费隔离执行结果。 | C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010;US-SBX-012 |
| FR-SBX-015 失败分类与原因归并 | 核心闭环能力 | 系统必须支持把 timeout、资源超限、backend failure、capture failure、orphan environment 等非 happy path 收束为稳定失败分类。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013 |
| FR-SBX-016 安全红线保守收束 | 核心闭环能力 | 系统必须支持把 escape-like、越权访问和其他安全红线事件收束为显式保守结果,而不是静默扩散。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-014 |
| FR-SBX-017 非 happy path 材料留痕 | 核心闭环能力 | 系统必须支持对 deny、kill、replay、cleanup 和其他异常控制动作形成可追溯材料。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013;US-SBX-015 |
| FR-SBX-018 租约到期与孤儿环境保守回收 | 核心闭环能力 | 系统必须支持在租约过期或孤儿环境场景下进行保守回收,同时不重写相邻仓业务真相。 | C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013;US-SBX-016 |

### 9.2 外围增强功能需求

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| FR-SBX-E01 风险分层隔离承载选择 | 外围增强能力 | 系统可进一步支持按风险等级选择更强或更经济的隔离承载方案。 | 外围增强能力 | US-SBX-E01 |
| FR-SBX-E02 高级 replay / inspect / operator 控制 | 外围增强能力 | 系统可进一步支持复杂故障和异常会话的 replay、inspect 和 operator 控制面。 | 外围增强能力 | US-SBX-E02 |
| FR-SBX-E03 输出预览与结果分析辅助 | 外围增强能力 | 系统可进一步支持对执行输出和结果材料进行更丰富的预览与分析辅助。 | 外围增强能力 | US-SBX-E03 |
| FR-SBX-E04 多宿主 / 多集群隔离调度 | 外围增强能力 | 系统可进一步支持按宿主或集群维度调度受控执行能力。 | 外围增强能力 | US-SBX-E04 |
| FR-SBX-E05 后端能力比较与策略模拟 | 外围增强能力 | 系统可进一步支持比较不同后端的隔离能力和策略承载差异。 | 外围增强能力 | US-SBX-E05 |
| FR-SBX-E06 容量性能成本趋势分析 | 外围增强能力 | 系统可进一步支持隔离成本、启动时延、输出体积和失败分布的长期趋势分析。 | 外围增强能力 | US-SBX-E06 |
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按能力节点归并功能 | pass | 已按 C-SBX-1~5 逐节点组织功能需求。 |
| 是否每条功能都有编号 | pass | 核心功能使用 `FR-SBX-001~018`,外围增强功能使用 `FR-SBX-E01~E06`。 |
| 是否每条功能都有能力类型、说明和双重映射 | pass | 所有正式功能均满足固定表结构。 |
| 是否区分核心闭环功能与外围增强功能 | pass | 已分为核心闭环与外围增强两类。 |
| 是否没有把故事原句直接改成功能 | pass | 功能已归并为能力主题,不是故事原句复述。 |
| 是否没有把功能写成 CRUD / API / Command | pass | 已剔除 `SandboxService`、后端名、错误码、事件名和命令名。 |
| 是否没有把业务规则、数据归属、接口、NFR 或验收写成功能 | pass | deny-by-default、cleanup 不先删证据、具体输出字段、指标和测试条件都后置。 |
| 是否没有把边界外能力混入正式功能表 | pass | 已形成边界外功能排除表。 |
| 是否为 Step 10 提供结构锚点 | pass | 功能已可回指核心能力节点和故事,可继续承接业务规则与边界约束。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未创建未来 Step 文件 | pass | 当前未创建 Step 10~17 文件。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现、测试或验收证据。 |
| 是否允许进入 Step 10 | pass_wait_review | 技术上 Step 9 已完成;按用户要求等待审查确认后再进入 Step 10。 |

next_allowed_action: `wait_user_confirm_step_10`
