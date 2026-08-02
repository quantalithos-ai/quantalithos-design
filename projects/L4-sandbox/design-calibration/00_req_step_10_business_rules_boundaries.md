# L4-sandbox 00 需求 Step 10: 业务规则与边界约束

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 9,允许进入 Step 10;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 10 章“业务规则与边界约束”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 业务规则与边界约束 |
| 输出文件 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| 前置确认 | pass:用户在 Step 9 停审后回复“同意”,允许进入 Step 10 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 10;`需求文档书写规范.md` §4.10 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `02-概要设计.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中旧规则、deny、cleanup、replay、audit、Runner 复用和后端线索 |
| 已读取参考粒度 | yes:`projects/L1-artifact/design-calibration/00_req_step_10_business_rules_boundaries.md`;`projects/L1-governance/design-calibration/00_req_step_10_business_rules_boundaries.md` |
| 历史材料口径 | 旧 `BR-001~005`、旧 deny-by-default、旧 replay / cleanup 语义、旧 benchmark、旧验收句式只作差异审计输入,不原样继承 |
| 禁写范围 | 不写数据归属、接口签名、DTO、event payload、API path、port、repository、handler、事务流程、配置 key、后端选型、NFR、测试、验收或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_11 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~9、SOP、书写规范、历史规则材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 按能力节点组织的规则方向、核心规则类型、边界约束与 Step 11 准入判断 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 9 到 Step 10 的转译诊断、旧规则污染诊断、边界串线诊断和跨能力重复诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 规则类型骨架、按能力节点收束、需求层粒度和外围增强规则处理取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 规则表、规则类型结论、规则内容结论、约束对象结论、规则与功能映射、边界外规则排除表和能力级停审结论 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录、是否继承旧规则、是否保留外围增强独立规则、是否触发 blocker 判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 10 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 10 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 11。 |

---

## 2. 必读摘要

| 文档 | Step 10 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 10 | Step 10 要把能力结构和仓边界用需求层硬规则钉住,输出按能力节点组织的规则结论、规则类型、规则内容、约束对象和规则与功能映射。 | 规则必须优先挂到能力节点和功能需求;无法挂载的规则只能进入风险 / 待确认事项。 |
| `需求文档书写规范.md` §4.10 | 正式规则表固定为“规则编号 / 规则类型 / 规则内容 / 约束对象”;核心类型是 `不变量 / 禁止行为 / 显式变化 / 边界约束`,按需补 `治理约束 / 审计约束`。 | 不写状态机编码、数据库约束、接口签名、事件 schema、handler / service / repository 校验逻辑或具体异常码。 |
| `设计文档编写通则.md` | Step 10 是后续数据归属、接口、NFR 和验收的重要约束锚点。 | 本文件保留诊断和取舍;正式 `00` 仍等待 Step 17 装配。 |
| `设计文档讨论中间产物规范.md` | Step 10 必须独立落盘并维护计划、诊断、取舍、结构化产物和自检;不得提前创建 Step 11~17 文件。 | 当前只创建 Step 10 文件。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从台账和已完成 Step 文件恢复;正式 baseline 只能来自文件。 | Step 10 只给出需求层硬规则,不生成 schema、state、event、evidence 或 implementation boundary。 |
| `00_req_step_02_position_boundary.md` | `L4-sandbox` 是平台运行隔离基础仓,负责受控执行环境的身份、限制、捕获、观测、失败和清理边界。 | 规则必须持续保护 tools/runtime/member/artifact/observability/governance 和后端产品边界不被打穿。 |
| `00_req_step_04_goals_non_goals.md` | 目标覆盖 execution environment identity、resource limits、filesystem/network/process boundary、launch policy、capture、observability hooks、failure、cleanup 和 security redlines;非目标排除相邻仓 truth 和后端选型。 | Step 10 必须把这些主轴钉成硬规则,并继续保护非目标边界。 |
| `00_req_step_06_consumers_dependencies.md` | `L0-core` 是唯一编译期依赖;isolation backend 是运行期前置;tools/runtime/member-service/runner/artifact/observability 是消费或协作方。 | 规则可以约束这些关系的需求层边界,但不能把依赖、SDK、后端和事件细节写成正式规则。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点和“输出 / 失败 / cleanup / redlines”主线。 | Step 10 必须按 C-SBX-1~5 逐节点组织规则。 |
| `00_req_step_09_functional_requirements.md` | 已形成 FR-SBX-001~018 和 FR-SBX-E01~E06,并明确 Step 10 应优先保护 fail-closed、统一回收链、cleanup、reaper 和安全红线。 | 每条规则必须能回指至少一个 `FR-SBX` 编号或 Step 2 / 4 / 6 正式边界。 |
| 旧 `00-需求文档.md` §6.2 | 旧规则表写未授权出网拒绝、backend 不支持限制时拒绝启动、timeout kill + audit、Runner 统一接口和 local backend 仅测试启用。 | 这些线索只能转译为需求层硬规则;接口、后端和测试环境限制不得直接继承。 |
| 旧 `README.md` / `02-概要设计.md` / `05-测试方案.md` / `06-验收标准.md` | 旧材料反复强调 deny-by-default、silent degrade 禁止、kill / timeout / replay / cleanup 一致控制链、cleanup 不先删证据、control history 留痕和 replay 不重做业务裁决。 | 这些线索可进入规则候选,但不能把测试用例、验收句式、对象名、事件名或控制台产品化能力写成正式规则。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 当前正在讨论哪个核心能力节点? | Step 10 按 C-SBX-1 受控执行语境识别与约束、C-SBX-2 隔离环境边界建立与限制施加、C-SBX-3 给定策略内执行与 fail-closed、C-SBX-4 输出与观测材料安全捕获和分层交接、C-SBX-5 失败租约清理与安全红线保守收束的顺序逐个收束规则。 |
| 哪些不变量必须始终成立? | 受控执行必须先形成正式执行语境;真实执行只能发生在正式隔离环境内;限制必须作为一组 coherent 边界同时成立;高风险执行必须附带正式 launch / isolation policy 语境;输出、候选材料和观测材料必须保留来源语境且彼此分层;非 happy path 必须归并为稳定失败分类并保留 redline / control 语境。 |
| 哪些行为必须禁止? | 禁止把宿主直跑或调用方本地执行冒充为 sandbox 执行;禁止无法落实的限制静默退化;禁止缺失 / 冲突 / 不支持的策略走 permissive fallback;禁止把候选输出当正式 Artifact truth;禁止 cleanup / reaper 先删证据再留痕;禁止 replay / retry / cleanup 重写 runtime、artifact、governance 或业务真相。 |
| 哪些状态变化必须显式发生,不能隐式发生? | 受控执行语境受理、隔离环境建立 / 拒绝、策略接受 / 拒绝、结果交接、deny / timeout / kill / replay / cleanup / lease expiry / orphan recovery 都必须显式发生,不能由调用方类型、缓存、UI、日志或下游消费动作隐式推断。 |
| 哪些边界不能被打穿? | tools semantic execution、runtime execution truth、member host lifecycle、identity / work truth、artifact truth、observability store、policy decision truth、后端产品选型和上层产品交互流程都不能被写成 sandbox 规则对象或真相。 |
| 哪些操作必须附带治理、审计或引用条件? | 放宽默认隔离边界的高风险动作必须附带正式 policy / authorization 前提;输出 / usage / audit / capture-failure 交接必须附带来源语境;deny、kill、timeout、replay、cleanup、reaper 和 redline containment 必须附带可追溯控制材料。 |
| 当前规则分别保护该能力节点下的哪些功能需求? | C-SBX-1 规则保护 FR-SBX-001~003;C-SBX-2 规则保护 FR-SBX-004~006;C-SBX-3 规则保护 FR-SBX-007~010;C-SBX-4 规则保护 FR-SBX-011~014;C-SBX-5 规则保护 FR-SBX-015~018。 |
| 是否存在无法回指功能需求或边界目标的规则? | 不存在。所有正式规则都能回指 Step 9 功能需求,或回指 Step 2 / Step 4 / Step 6 已确认的仓边界、非目标和依赖裁剪结论。 |
| 当前能力节点的规则是否足以阻止串仓、越界或隐式变化? | 足以。Step 10 已把统一入口、限制不退化、policy fail-closed、材料分层交接、cleanup / reaper 不重写真相和 redline 保守收束钉成硬规则,可进入 Step 11 数据归属讨论。 |

---

## 4. 当前材料诊断

### 4.1 从 Step 9 到 Step 10 的转译诊断

| 核心能力节点 | 容易误写成什么 | 当前转译方式 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | `request.validate`、`SessionState`、`ExecutionHandle`、调用参数校验 | 写成正式执行语境必须先成立、来源可追溯、统一入口不可绕过和 sandbox 只消费 identity/work refs 的硬规则。 |
| C-SBX-2 隔离环境边界建立与限制施加 | backend capability check、mount / cgroup / namespace 实现或测试后端开关 | 写成真实执行只能在正式隔离环境发生、限制必须作为 coherent boundary 生效、不能 silent degrade、后端不能重写 sandbox truth 的硬规则。 |
| C-SBX-3 给定策略内执行与 fail-closed | firewall rule、allowlist schema、provider ACL、policy engine 细节 | 写成高风险执行必须附带 policy 语境、缺失 / 冲突 / 不支持即拒绝、放宽边界必须有正式授权、跨调用方不得出现第二套策略语义的硬规则。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | stdout/stderr schema、上传接口、artifact insert、trace payload | 写成输出 / 候选材料 / 观测材料必须分层保留来源语境、结果交接必须显式发生、sandbox 不拥有 downstream truth 的硬规则。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | error code、retry API、reaper job、cleanup command、control history schema | 写成稳定失败分类、redline 保守收束、cleanup 不先删证据、replay / retry 不重写业务真相、lease / orphan 回收必须显式留痕的硬规则。 |

### 4.2 旧规则污染诊断

| 旧规则 / 旧表达 | 有效线索 | 当前问题 | Step 10 处理 |
|---|---|---|---|
| `BR-001 未授权出网 -> 拒绝` | deny-by-default 是核心线索。 | 单条网络规则过窄,还缺少策略缺失 / 冲突 / 不支持和 caller 一致性语义。 | 转译为 BR-SBX-011~017 的 policy / fail-closed 规则群。 |
| `BR-002 backend 不支持某资源限制 -> 拒绝启动,而不是 silent ignore` | “不支持即拒绝,不可静默退化”是核心线索。 | 旧表达与 backend 产品和启动动作强绑定。 | 转译为 BR-SBX-008、BR-SBX-009、BR-SBX-010。 |
| `BR-003 超时 -> 强制 kill + 审计事件` | 超时属于非 happy path 的显式控制动作,且必须留痕。 | 旧表达把 kill、事件和错误结果混成单一场景。 | 转译为 BR-SBX-025、BR-SBX-030、BR-SBX-032。 |
| `BR-004 Runner 请求执行 -> 必须走同一 SandboxService` | 跨调用方统一入口 / 策略 / 回收链是核心线索。 | “同一接口”过早固化 API。 | 转译为 BR-SBX-003、BR-SBX-016、BR-SBX-023。 |
| `BR-005 local_process backend 只能测试环境启用` | 提示测试后端或低隔离场景需额外约束。 | 这是配置 / 测试边界,不是当前需求层核心业务规则。 | 不进入正式规则表;后置 01 / 04 / 05。 |
| 旧 `Replay / retry execution != repeat business decision` | execution-layer control 不能重做业务裁决是强边界线索。 | 旧材料把 replay、测试和 operator 控制面混在一起。 | 转译为 BR-SBX-027。 |
| 旧 `cleanup 不可先删证据` | cleanup guard 是核心线索。 | 旧材料常以测试用例或验收句式出现。 | 转译为 BR-SBX-028 和 BR-SBX-032。 |

### 4.3 边界串线诊断

| 易串线对象 | 若误写进规则会怎样 | 当前防线 |
|---|---|---|
| `L2-tools` | 会把 ToolPolicy、provider 语义和 ToolResult truth 写成 sandbox 规则。 | Step 10 只约束 sandbox 边界如何执行给定策略,不决定工具真相。 |
| `L2-runtime` | 会把 ExecutionInstance、agent loop、checkpoint / recover 写成 sandbox 规则。 | Step 10 只约束隔离执行和 control chain,不写 runtime 主线。 |
| `L2-member-service` | 会把 SandboxBinding、worker/session、host health 写成 sandbox 规则。 | Step 10 只约束隔离环境和回收语义,不写宿主生命周期。 |
| `L1-artifact` | 会把 output candidate 直接写成 Artifact 正式版本、baseline 或 evidence truth。 | Step 10 明确候选材料不等于 formal Artifact truth。 |
| `L4-observability` | 会把 audit / trace / metric store、查询和告警写成 sandbox 规则。 | Step 10 只要求可交接和可追溯,不要求存储实现。 |
| governance / capability / tools policy 来源 | 会把 allowlist truth、approval flow 或 policy DSL 写成 sandbox 规则对象。 | Step 10 只要求“放宽默认边界必须附带正式 policy / authorization 前提”。 |
| Docker / gVisor / Firecracker / k8s | 会把 backend 选型或 carrier feature 当成正式规则对象。 | Step 10 只约束“限制必须能被落实,否则拒绝”,不裁定后端产品。 |
| Console / Runner / Chat / Bridge | 会把 UI、control panel 或产品工作流写成 sandbox 规则。 | Step 10 只约束跨调用方语义一致,不写上层产品流程。 |

### 4.4 跨能力重复诊断

最容易重复或冲突的地方有三类:

1. “拒绝”相关规则容易同时出现在 C-SBX-2、C-SBX-3、C-SBX-5。
2. “留痕”相关规则容易同时出现在 C-SBX-1、C-SBX-4、C-SBX-5。
3. “统一语义”相关规则容易同时出现在 Runner 入口、策略口径和结果回收链。

当前处理口径:

- C-SBX-2 的拒绝是“限制不能落实时拒绝建立边界”;C-SBX-3 的拒绝是“策略不完备时拒绝执行”;C-SBX-5 的拒绝是“控制结果和 redline 收束必须显式留痕”。三者不重复。
- C-SBX-1 的留痕是请求受理 / 拒绝的责任链材料;C-SBX-4 的留痕是结果、usage 和 capture-failure 材料;C-SBX-5 的留痕是 deny / kill / replay / cleanup / reaper 控制材料。三者不重复。
- Runner 相关规则分别保护统一入口、统一策略语义和统一结果回收链,而不是同一条“Runner 复用”大规则。

---

## 5. 设计取舍

### 5.1 先用核心四类规则类型,按需补治理 / 审计约束

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 只用旧 `BR-001~005` 风格写条件 / 结果 | 短,接近旧材料。 | 规则类型不清,无法审查哪些在保护边界、哪些在保护显式变化或审计。 | 不采用。 |
| 方案 B: 以 `不变量 / 禁止行为 / 显式变化 / 边界约束` 为骨架,对高风险动作补 `治理约束 / 审计约束` | 能直接回答 Step 10 的应答问题,也利于 Step 11~14 继续收束。 | 规则数会比旧表多。 | 采用。 |

### 5.2 按能力节点而不是按旧 BR、对象或接口组织规则

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 按旧 `BR-001~005` 和测试关注点组织 | 靠近历史材料。 | 会被网络、timeout、cleanup 等个案牵着走,失去 C-SBX-1~5 的共同主轴。 | 不采用。 |
| 方案 B: 按 C-SBX-1~5 逐节点收束规则 | 与 Step 7 / Step 9 锚点一致,后续数据、接口、验收都可继续按节点展开。 | 需要单独做跨能力规则审计。 | 采用。 |

### 5.3 规则保持需求层粒度,不写实现校验

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 写成“validate_request must...”“policy.validate_xxx”“repository append-only” | 会把 Step 10 退化为实现校验逻辑。 | 不采用。 |
| 方案 B | 写成“必须先形成正式语境”“不得 silent degrade”“cleanup 不得先删证据”这类需求层硬约束 | 能稳定承接 Step 11~14,实现细节后置。 | 采用。 |

### 5.4 deny-by-default 不能只写成“默认无出网”

旧材料把 deny-by-default 聚焦为网络访问。当前取舍是:

- 把默认拒绝提升为 “策略缺失、冲突或不支持时不得 permissive fallback”。
- 网络、文件系统、进程、外部连接和其他高风险边界都通过 C-SBX-2 / 3 规则保护。
- 这样后续 Step 11 / 12 / 13 / 14 不会只围绕网络单点展开。

### 5.5 replay / cleanup 仍然保留在核心规则,但不产品化

旧 `02/05/06` 中 replay / inspect / operator 能力很强。当前取舍是:

- replay / retry / cleanup / reaper 的需求层规则保留在核心闭环中,因为它们直接关系到 redline 收束和证据安全。
- 但 inspect / operator console / advanced replay UI 不进入核心规则表,只作为外围增强或后续设计主题。

### 5.6 外围增强功能当前不额外生成新的正式硬规则

Step 9 的外围增强功能 `FR-SBX-E01~E06` 当前不单独新增正式 `BR-SBX-E*` 规则,原因是:

- 它们主要受核心规则和边界约束保护。
- 其中多后端、inspect、趋势分析、多集群调度都尚未在需求层固定产品边界。
- 若现在单独立规则,容易提前固化后端、控制台、调度或指标设计。

因此 Step 10 只在“外围增强规则保留结论”中说明它们继承的核心规则保护。

---

## 6. 结构化中间产物

### 6.1 规则编号结论

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-SBX-001 | 不变量 | 受控执行必须先形成可追溯的正式执行语境和责任链,不得在执行完成后补造来源语境。 | 受控执行请求语境 |
| BR-SBX-002 | 显式变化 | 一次执行进入正式 sandbox 语境必须显式发生,不得由调用方路径、缓存命中或日志回写隐式成立。 | 受控执行请求语境 |
| BR-SBX-003 | 禁止行为 | 宿主直跑、调用方本地执行或旁路执行不得被宣称为 sandbox 受控执行。 | 受控执行入口 |
| BR-SBX-004 | 边界约束 | sandbox 只能消费 identity / work / runner 引用语境,不得重建或拥有 actor、member、project、work 或 runner 产品真相。 | identity / work / runner 边界 |
| BR-SBX-005 | 审计约束 | 受控执行语境的受理、拒绝和来源归责必须保留可追溯材料。 | 受控执行请求语境 |
| BR-SBX-006 | 不变量 | 真实执行只能发生在正式建立的隔离环境内,不得在宿主侧裸跑后再补记为已隔离。 | 隔离执行环境 |
| BR-SBX-007 | 不变量 | 资源、文件系统、网络和进程限制必须作为同一组 coherent boundary 成立,不得各自使用不同语义。 | 隔离边界限制 |
| BR-SBX-008 | 禁止行为 | 任一必需限制无法落实、无法验证或后端不支持时,不得 silent degrade 或部分忽略后继续执行。 | 隔离边界限制 |
| BR-SBX-009 | 显式变化 | 隔离环境建立、建立失败、拒绝建立和后续收束目标必须显式发生,不得通过默认值推断。 | 隔离环境生命周期 |
| BR-SBX-010 | 边界约束 | 容器 / k8s / isolation backend 只是运行承载,不得反向定义 sandbox 的正式边界真相或需求边界。 | 后端承载边界 |
| BR-SBX-011 | 不变量 | 高风险受控执行必须附带正式 launch / isolation policy 语境后方可继续。 | policy 执行语境 |
| BR-SBX-012 | 禁止行为 | policy 缺失、冲突、不支持或不可解析时,不得 permissive fallback 为继续执行。 | policy fail-closed 边界 |
| BR-SBX-013 | 禁止行为 | 超出正式边界的高风险动作、越权边界扩张或未授权外联访问一旦被识别,不得继续执行。 | 高风险边界动作 |
| BR-SBX-014 | 显式变化 | policy 接受、拒绝、升级处理和边界扩张处理必须显式发生,不得因调用方类型不同而隐式改变。 | policy 执行结果 |
| BR-SBX-015 | 边界约束 | sandbox 执行已给定 policy,但不得生成 allowlist truth、approval truth、policy definition truth 或 policy DSL truth。 | policy 来源边界 |
| BR-SBX-016 | 不变量 | Runner、工具和自动化执行场景下的等价 policy 结果必须保持同一套决策语义和失败语义。 | 跨调用方 policy 语义 |
| BR-SBX-017 | 治理约束 | 放宽默认隔离边界或允许高风险动作继续执行时,必须附带正式 authorization / policy 前提。 | 高风险边界例外 |
| BR-SBX-018 | 不变量 | 执行输出、候选材料和观测材料必须保留来源语境,并保持彼此分层。 | 输出 / 候选材料 / 观测材料 |
| BR-SBX-019 | 禁止行为 | sandbox 内捕获的输出或候选材料不得被静默提升为正式 Artifact truth、baseline truth 或正式 evidence truth。 | 候选材料边界 |
| BR-SBX-020 | 禁止行为 | 观测交接不得代替结果捕获;capture 缺失不得通过下游日志或观测存储被掩盖为“已成功回收”。 | 观测与捕获边界 |
| BR-SBX-021 | 显式变化 | 执行结果交接、候选材料交接和观测材料交接都必须显式发生后,下游方才能继续消费或 cleanup。 | 结果交接链 |
| BR-SBX-022 | 边界约束 | sandbox 可向 artifact / runtime / runner / observability 交接材料,但不得拥有这些下游真相。 | 下游消费边界 |
| BR-SBX-023 | 不变量 | Runner 与其他调用方不得形成第二套结果回收语义、候选材料语义或观测交接语义。 | 跨调用方结果回收链 |
| BR-SBX-024 | 审计约束 | 输出、usage、audit 和 capture-failure 材料必须形成可追溯、可回链到来源语境的记录。 | 输出与审计材料 |
| BR-SBX-025 | 不变量 | timeout、资源超限、backend failure、capture failure、deny、orphan environment 等非 happy path 必须归并为稳定失败分类。 | 失败分类 |
| BR-SBX-026 | 不变量 | escape-like、越权访问和其他安全红线事件必须产生保守收束结果,而不是 advisory-only 提示。 | 安全红线收束 |
| BR-SBX-027 | 禁止行为 | replay、retry、cleanup 或 reaper 动作不得重写 runtime truth、artifact truth、governance truth 或业务真相。 | 非 happy path 控制链 |
| BR-SBX-028 | 禁止行为 | cleanup 或 reaper 在审计、回放或调查所需材料仍未安全交接前,不得先删除 capture / audit / investigation 材料。 | cleanup / reaper guard |
| BR-SBX-029 | 禁止行为 | 租约到期或孤儿环境不得继续在托管恢复路径之外运行。 | lease / orphan recovery |
| BR-SBX-030 | 显式变化 | deny、timeout、kill、replay、cleanup、lease expiry 和 orphan recovery 都必须作为显式控制变化发生。 | control 变化主线 |
| BR-SBX-031 | 边界约束 | lease / cleanup / reaper 只允许收束隔离层状态,不得变成产品状态、工作流状态、policy truth 或业务裁决 truth。 | cleanup / reaper 边界 |
| BR-SBX-032 | 审计约束 | deny、kill、timeout、replay、cleanup、reaper 和 redline containment 必须留下可追溯控制材料。 | control 审计材料 |
| BR-SBX-033 | 审计约束 | 红线与失败调查材料必须保留来源语境和收束语境,不得只保留最终结果标签。 | 调查与 redline 材料 |

### 6.2 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | BR-SBX-001;BR-SBX-006;BR-SBX-007;BR-SBX-011;BR-SBX-016;BR-SBX-018;BR-SBX-023;BR-SBX-025;BR-SBX-026 |
| 禁止行为 | BR-SBX-003;BR-SBX-008;BR-SBX-012;BR-SBX-013;BR-SBX-019;BR-SBX-020;BR-SBX-027;BR-SBX-028;BR-SBX-029 |
| 显式变化 | BR-SBX-002;BR-SBX-009;BR-SBX-014;BR-SBX-021;BR-SBX-030 |
| 边界约束 | BR-SBX-004;BR-SBX-010;BR-SBX-015;BR-SBX-022;BR-SBX-031 |
| 治理约束 | BR-SBX-017 |
| 审计约束 | BR-SBX-005;BR-SBX-024;BR-SBX-032;BR-SBX-033 |

### 6.3 规则内容结论

| 核心能力节点 | 规则主线 | 对应规则 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | 先有正式受控执行语境,再允许隔离执行发生;来源语境和责任链不能后补或伪造。 | BR-SBX-001~005 |
| C-SBX-2 隔离环境边界建立与限制施加 | 真实执行只能发生在正式隔离环境内;限制必须成组落实;一旦不能落实就拒绝,不能 silent degrade。 | BR-SBX-006~010 |
| C-SBX-3 给定策略内执行与 fail-closed | 高风险执行必须附带正式 policy 语境;策略不完备就拒绝;例外必须有正式授权;跨调用方 policy 结果语义一致。 | BR-SBX-011~017 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 输出、候选材料、观测材料必须分层且保留来源语境;交接必须显式发生;不得把结果或候选材料静默升级为下游真相。 | BR-SBX-018~024 |
| C-SBX-5 失败租约清理与安全红线保守收束 | 非 happy path 必须稳定分类、显式收束、完整留痕;cleanup / reaper 不得重写相邻仓真相或先删证据。 | BR-SBX-025~033 |

### 6.4 约束对象结论

| 约束对象 | 约束重点 | 对应规则 |
|---|---|---|
| 受控执行请求语境 | 正式来源、责任链、统一入口和受理 / 拒绝留痕 | BR-SBX-001~005 |
| 隔离环境与边界限制 | 正式承载、coherent boundary、不可 silent degrade、后端不重写真相 | BR-SBX-006~010 |
| policy 执行语境 | policy 前置、fail-closed、例外授权、跨调用方语义一致 | BR-SBX-011~017 |
| 输出 / 候选材料 / 观测材料 | 来源语境保留、分层交接、不得静默升级为下游真相 | BR-SBX-018~024 |
| 失败 / control / cleanup / reaper | 稳定失败分类、保守 redline 收束、control chain 显式发生、证据不先删 | BR-SBX-025~033 |

### 6.5 规则与功能需求映射结论

| 功能需求 | 对应规则 |
|---|---|
| FR-SBX-001 受控执行请求语境接入 | BR-SBX-001;BR-SBX-002;BR-SBX-003;BR-SBX-005 |
| FR-SBX-002 执行环境身份与责任链绑定 | BR-SBX-001;BR-SBX-004;BR-SBX-005 |
| FR-SBX-003 跨调用方统一受控执行入口 | BR-SBX-003;BR-SBX-004 |
| FR-SBX-004 正式隔离环境建立 | BR-SBX-006;BR-SBX-009 |
| FR-SBX-005 统一边界限制施加 | BR-SBX-007;BR-SBX-008;BR-SBX-010 |
| FR-SBX-006 限制可落实性校验与拒绝 | BR-SBX-008;BR-SBX-009;BR-SBX-010 |
| FR-SBX-007 启动前策略语境承接 | BR-SBX-011;BR-SBX-014;BR-SBX-015;BR-SBX-017 |
| FR-SBX-008 策略内执行与高风险动作阻断 | BR-SBX-011;BR-SBX-012;BR-SBX-013;BR-SBX-017 |
| FR-SBX-009 策略缺失冲突或不支持时保守拒绝 | BR-SBX-012;BR-SBX-014;BR-SBX-017 |
| FR-SBX-010 跨调用方统一策略执行口径 | BR-SBX-014;BR-SBX-015;BR-SBX-016 |
| FR-SBX-011 执行输出统一捕获 | BR-SBX-018;BR-SBX-021;BR-SBX-024 |
| FR-SBX-012 候选材料安全收口 | BR-SBX-018;BR-SBX-019;BR-SBX-021;BR-SBX-022 |
| FR-SBX-013 观测与审计材料分层交接 | BR-SBX-018;BR-SBX-020;BR-SBX-022;BR-SBX-024 |
| FR-SBX-014 跨调用方统一结果回收链 | BR-SBX-021;BR-SBX-023;BR-SBX-024 |
| FR-SBX-015 失败分类与原因归并 | BR-SBX-025;BR-SBX-030;BR-SBX-032 |
| FR-SBX-016 安全红线保守收束 | BR-SBX-026;BR-SBX-030;BR-SBX-033 |
| FR-SBX-017 非 happy path 材料留痕 | BR-SBX-027;BR-SBX-028;BR-SBX-030;BR-SBX-032;BR-SBX-033 |
| FR-SBX-018 租约到期与孤儿环境保守回收 | BR-SBX-028;BR-SBX-029;BR-SBX-030;BR-SBX-031;BR-SBX-032 |

### 6.6 能力级规则停审结论

| 能力节点 | 当前规则集 | 停审结论 |
|---|---|---|
| C-SBX-1 | BR-SBX-001~005 | 已覆盖正式语境、统一入口、责任链和语境留痕,未把接口、对象字段或调用参数校验写成规则,可进入 Step 11。 |
| C-SBX-2 | BR-SBX-006~010 | 已覆盖正式隔离承载、coherent boundary、不可 silent degrade 和后端不重写真相,未把后端产品或配置项写成规则,可进入 Step 11。 |
| C-SBX-3 | BR-SBX-011~017 | 已覆盖 policy 前置、fail-closed、例外授权和跨调用方统一语义,未把 allowlist schema、policy DSL 或审批流接口写成规则,可进入 Step 11。 |
| C-SBX-4 | BR-SBX-018~024 | 已覆盖输出 / 候选材料 / 观测材料分层、显式交接和下游真相边界,未把 Artifact truth、observability store 或 payload schema 写成规则,可进入 Step 11。 |
| C-SBX-5 | BR-SBX-025~033 | 已覆盖稳定失败分类、redline 保守收束、cleanup / reaper guard 和 control audit 材料,未把 error code、job 配置或 operator UI 写成规则,可进入 Step 11。 |

### 6.7 边界外规则排除结论

| 排除能力或表达 | 不进入本仓规则的原因 | 正确归属 |
|---|---|---|
| ToolPolicy、provider 语义、tool result normalization | 属于 tool semantic execution 和工具真相源,不属于 sandbox 规则对象 | `L2-tools` |
| ExecutionInstance、agent loop、checkpoint、recover | 属于 runtime 主线和恢复主线 | `L2-runtime` |
| SandboxBinding、host lifecycle、worker / session health | 属于 member host 装配和生命周期真相 | `L2-member-service` |
| Artifact 正式版本、baseline、evidence 正文规则 | 属于制品真相边界,不属于 sandbox 规则表 | `L1-artifact` |
| trace / metric / audit store 查询、保留期、告警 | 属于 observability 存储与运营边界 | `L4-observability` |
| allowlist schema、policy DSL、审批流字段 | 属于 policy 真相源和 governance / capability 边界 | governance / capability / tools policy 来源 |
| Docker / gVisor / Firecracker / k8s 选型、local_process 测试后端启用条件 | 属于架构、配置、实施或测试边界 | `01` / `04` / `05` / `07` |
| inspect / operator console / replay UI / trend dashboard | 属于外围增强产品体验,不是当前核心规则对象 | 外围增强 / 后续设计 |
| benchmark、Given-When-Then、验收阈值、日志截图、evidence alias | 属于 NFR、测试、验收或真实证据 | `13` / `14` / `05` / `06` |

### 6.8 外围增强规则保留结论

| 外围增强功能 | 当前处理口径 | 继承的核心规则保护 |
|---|---|---|
| FR-SBX-E01 风险分层隔离承载选择 | 当前不新增独立正式规则,因为后端产品与承载分层尚未在需求层定型。 | BR-SBX-007;BR-SBX-008;BR-SBX-010;BR-SBX-016;BR-SBX-017 |
| FR-SBX-E02 高级 replay / inspect / operator 控制 | 当前不新增独立正式规则,因为 operator control 面仍属于外围增强体验。 | BR-SBX-027;BR-SBX-028;BR-SBX-030;BR-SBX-032;BR-SBX-033 |
| FR-SBX-E03 输出预览与结果分析辅助 | 当前不新增独立正式规则,因为预览 / 分析不应成为新的真相写源。 | BR-SBX-018;BR-SBX-021;BR-SBX-022;BR-SBX-024 |
| FR-SBX-E04 多宿主 / 多集群隔离调度 | 当前不新增独立正式规则,因为调度拓扑未在需求层定型。 | BR-SBX-007;BR-SBX-008;BR-SBX-010;BR-SBX-016;BR-SBX-023 |
| FR-SBX-E05 后端能力比较与策略模拟 | 当前不新增独立正式规则,因为比较 / 模拟不应替代正式 policy 结果。 | BR-SBX-010;BR-SBX-012;BR-SBX-015;BR-SBX-017 |
| FR-SBX-E06 容量性能成本趋势分析 | 当前不新增独立正式规则,因为趋势分析更多进入 NFR / 观测增强。 | BR-SBX-018;BR-SBX-022;BR-SBX-024;BR-SBX-032 |

### 6.9 跨能力规则审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否存在孤儿规则 | no | 所有正式规则都能回指 `FR-SBX` 编号或 Step 2 / 4 / 6 正式边界。 |
| 是否存在规则类型混乱 | no | 所有正式规则都归入正式定稿类型。 |
| 是否存在把实现校验逻辑写成规则 | no | 已剔除 handler、repository、错误码、schema 和接口校验逻辑。 |
| 是否存在把数据归属或接口细节写成规则 | no | 数据真相、DTO、event payload、path 和 repository 仍后置。 |
| 是否存在边界外能力误入正式规则表 | no | 已单独形成边界外规则排除表。 |
| 是否存在跨能力重复规则 | acceptable_and_explained | “拒绝”“留痕”“统一语义”在不同能力节点下有不同保护对象,已在 4.4 中解释。 |
| 是否存在规则冲突 | no | 当前规则共同服务于统一入口、fail-closed、结果分层交接和 cleanup / redline 保守收束,未发现内在冲突。 |

### 6.10 后续 Step 保护线

| 后续 Step | Step 10 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 11 数据归属 | 数据项必须解释正式执行语境、边界请求、候选材料 refs、观测材料和 control audit 材料分别属于什么 truth。 | 不把 Artifact、ExecutionInstance、ToolPolicy、observability store 拉进 sandbox 真相。 |
| Step 12 接口与依赖 | 接口边界必须服务 BR-SBX-001~033 保护的能力与边界,但不能反向用 API 名、DTO、event payload 改写规则。 | 不写 handler、path、payload、trait、port 或 repository。 |
| Step 13 非功能需求 | NFR 应重新校准旧 benchmark、留痕率、拒绝率、时延和成功率,并以 Step 10 规则为前提。 | 不把旧 README / 旧 `00` 的性能数字直接当当前结论。 |
| Step 14 验收标准 | 验收必须覆盖 fail-closed、不可 silent degrade、cleanup 不先删证据、跨调用方一致语义和 redline 保守收束。 | 不复用旧 Given-When-Then 原句或旧 evidence alias。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | 规则表、类型结论、映射表和排除表足以承载 Step 10 结论。 |
| 是否原样继承旧规则 | no | 旧 `BR-001~005`、旧 replay / cleanup 线索均已转译或裁剪。 |
| 是否为外围增强新增正式规则 | no | 当前外围增强仍继承核心规则保护,不单独立新规则编号。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 10 的上游冲突。 |
| 是否允许进入 Step 11 | pass_wait_review | 技术上 Step 10 已完成;按用户规则等待审查确认后再进入 Step 11。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 10 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 10. 业务规则与边界约束

> 校准来源：
> - `design-calibration/00_req_step_10_business_rules_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节,了解本章如何从 Step 9 功能需求和仓边界收束为当前规则表。

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-SBX-001 | 不变量 | 受控执行必须先形成可追溯的正式执行语境和责任链,不得在执行完成后补造来源语境。 | 受控执行请求语境 |
| BR-SBX-002 | 显式变化 | 一次执行进入正式 sandbox 语境必须显式发生,不得由调用方路径、缓存命中或日志回写隐式成立。 | 受控执行请求语境 |
| BR-SBX-003 | 禁止行为 | 宿主直跑、调用方本地执行或旁路执行不得被宣称为 sandbox 受控执行。 | 受控执行入口 |
| BR-SBX-004 | 边界约束 | sandbox 只能消费 identity / work / runner 引用语境,不得重建或拥有 actor、member、project、work 或 runner 产品真相。 | identity / work / runner 边界 |
| BR-SBX-005 | 审计约束 | 受控执行语境的受理、拒绝和来源归责必须保留可追溯材料。 | 受控执行请求语境 |
| BR-SBX-006 | 不变量 | 真实执行只能发生在正式建立的隔离环境内,不得在宿主侧裸跑后再补记为已隔离。 | 隔离执行环境 |
| BR-SBX-007 | 不变量 | 资源、文件系统、网络和进程限制必须作为同一组 coherent boundary 成立,不得各自使用不同语义。 | 隔离边界限制 |
| BR-SBX-008 | 禁止行为 | 任一必需限制无法落实、无法验证或后端不支持时,不得 silent degrade 或部分忽略后继续执行。 | 隔离边界限制 |
| BR-SBX-009 | 显式变化 | 隔离环境建立、建立失败、拒绝建立和后续收束目标必须显式发生,不得通过默认值推断。 | 隔离环境生命周期 |
| BR-SBX-010 | 边界约束 | 容器 / k8s / isolation backend 只是运行承载,不得反向定义 sandbox 的正式边界真相或需求边界。 | 后端承载边界 |
| BR-SBX-011 | 不变量 | 高风险受控执行必须附带正式 launch / isolation policy 语境后方可继续。 | policy 执行语境 |
| BR-SBX-012 | 禁止行为 | policy 缺失、冲突、不支持或不可解析时,不得 permissive fallback 为继续执行。 | policy fail-closed 边界 |
| BR-SBX-013 | 禁止行为 | 超出正式边界的高风险动作、越权边界扩张或未授权外联访问一旦被识别,不得继续执行。 | 高风险边界动作 |
| BR-SBX-014 | 显式变化 | policy 接受、拒绝、升级处理和边界扩张处理必须显式发生,不得因调用方类型不同而隐式改变。 | policy 执行结果 |
| BR-SBX-015 | 边界约束 | sandbox 执行已给定 policy,但不得生成 allowlist truth、approval truth、policy definition truth 或 policy DSL truth。 | policy 来源边界 |
| BR-SBX-016 | 不变量 | Runner、工具和自动化执行场景下的等价 policy 结果必须保持同一套决策语义和失败语义。 | 跨调用方 policy 语义 |
| BR-SBX-017 | 治理约束 | 放宽默认隔离边界或允许高风险动作继续执行时,必须附带正式 authorization / policy 前提。 | 高风险边界例外 |
| BR-SBX-018 | 不变量 | 执行输出、候选材料和观测材料必须保留来源语境,并保持彼此分层。 | 输出 / 候选材料 / 观测材料 |
| BR-SBX-019 | 禁止行为 | sandbox 内捕获的输出或候选材料不得被静默提升为正式 Artifact truth、baseline truth 或正式 evidence truth。 | 候选材料边界 |
| BR-SBX-020 | 禁止行为 | 观测交接不得代替结果捕获;capture 缺失不得通过下游日志或观测存储被掩盖为“已成功回收”。 | 观测与捕获边界 |
| BR-SBX-021 | 显式变化 | 执行结果交接、候选材料交接和观测材料交接都必须显式发生后,下游方才能继续消费或 cleanup。 | 结果交接链 |
| BR-SBX-022 | 边界约束 | sandbox 可向 artifact / runtime / runner / observability 交接材料,但不得拥有这些下游真相。 | 下游消费边界 |
| BR-SBX-023 | 不变量 | Runner 与其他调用方不得形成第二套结果回收语义、候选材料语义或观测交接语义。 | 跨调用方结果回收链 |
| BR-SBX-024 | 审计约束 | 输出、usage、audit 和 capture-failure 材料必须形成可追溯、可回链到来源语境的记录。 | 输出与审计材料 |
| BR-SBX-025 | 不变量 | timeout、资源超限、backend failure、capture failure、deny、orphan environment 等非 happy path 必须归并为稳定失败分类。 | 失败分类 |
| BR-SBX-026 | 不变量 | escape-like、越权访问和其他安全红线事件必须产生保守收束结果,而不是 advisory-only 提示。 | 安全红线收束 |
| BR-SBX-027 | 禁止行为 | replay、retry、cleanup 或 reaper 动作不得重写 runtime truth、artifact truth、governance truth 或业务真相。 | 非 happy path 控制链 |
| BR-SBX-028 | 禁止行为 | cleanup 或 reaper 在审计、回放或调查所需材料仍未安全交接前,不得先删除 capture / audit / investigation 材料。 | cleanup / reaper guard |
| BR-SBX-029 | 禁止行为 | 租约到期或孤儿环境不得继续在托管恢复路径之外运行。 | lease / orphan recovery |
| BR-SBX-030 | 显式变化 | deny、timeout、kill、replay、cleanup、lease expiry 和 orphan recovery 都必须作为显式控制变化发生。 | control 变化主线 |
| BR-SBX-031 | 边界约束 | lease / cleanup / reaper 只允许收束隔离层状态,不得变成产品状态、工作流状态、policy truth 或业务裁决 truth。 | cleanup / reaper 边界 |
| BR-SBX-032 | 审计约束 | deny、kill、timeout、replay、cleanup、reaper 和 redline containment 必须留下可追溯控制材料。 | control 审计材料 |
| BR-SBX-033 | 审计约束 | 红线与失败调查材料必须保留来源语境和收束语境,不得只保留最终结果标签。 | 调查与 redline 材料 |
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按能力节点组织规则 | pass | 已按 C-SBX-1~5 逐节点收束。 |
| 是否每条规则都有编号、类型、内容和约束对象 | pass | 所有正式规则均满足固定表结构。 |
| 是否优先区分不变量、禁止行为、显式变化与边界约束 | pass | 已以四类核心规则为骨架,并按需补治理 / 审计约束。 |
| 是否没有把实现校验逻辑写成规则 | pass | 未写 handler、repository、字段校验、异常码或 schema。 |
| 是否没有把数据归属、接口、NFR 或验收写成规则 | pass | 数据、接口、指标和验收仍后置。 |
| 是否没有把边界外能力混入正式规则表 | pass | 已形成边界外规则排除表。 |
| 是否没有出现孤儿规则 | pass | 每条规则都能回指 FR-SBX 或 Step 2 / 4 / 6 正式边界。 |
| 是否为 Step 11 提供结构锚点 | pass | 已把真相边界、候选材料、观测材料和 control audit 材料的硬约束钉住。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未创建未来 Step 文件 | pass | 当前未创建 Step 11~17 文件。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现、测试或验收证据。 |
| 是否允许进入 Step 11 | pass_wait_review | 技术上 Step 10 已完成;按用户要求等待审查确认后再进入 Step 11。 |

next_allowed_action: `wait_user_confirm_step_11`
