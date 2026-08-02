# L4-sandbox 00 需求 Step 8: 用户故事

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 7,允许进入 Step 8;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 8 章“用户故事”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 8 用户故事 |
| 输出文件 | `design-calibration/00_req_step_08_user_stories.md` |
| 前置确认 | pass:用户在 Step 7 停审后回复“继续 step8”,允许进入 Step 8 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 8;`需求文档书写规范.md` §4.8 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md` 中旧用户故事、旧功能清单、旧验收句式;旧 `02-概要设计.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中故事污染线索 |
| 已读取参考粒度 | yes:`projects/L1-artifact/design-calibration/00_req_step_08_user_stories.md`;`projects/L1-governance/design-calibration/00_req_step_08_user_stories.md` |
| 历史材料口径 | 旧 `US-001~004`、旧 `F-001~010`、旧后端与验收句式只作差异审计输入,不原样继承 |
| 禁写范围 | 不写功能需求、业务规则、数据归属、接口签名、DTO、event payload、API path、port、repository、handler、事务流程、配置 key、后端选型、NFR、验收或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_9 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 5/6/7、SOP、书写规范、历史故事材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 核心闭环故事、外围增强故事、边界外故事和按能力节点组织的故事结论 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 7 到故事的转译诊断、旧故事污染诊断、角色 / 边界串线诊断、跨能力重复诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 按能力节点组织、故事数量、目标级句式、外围增强保留和边界外裁剪取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 核心闭环故事表、外围增强故事表、边界外故事排除表、故事与闭环映射表、能力级故事停审结论、跨能力故事审计 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录、是否纳入旧故事、是否触发 blocker、是否允许进入 Step 9 判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 8 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 8 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 9。 |

---

## 2. 必读摘要

| 文档 | Step 8 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 8 | Step 8 要围绕核心能力闭环展开角色目标叙事,输出按能力节点组织的用户故事结论、核心闭环故事、外围增强故事、故事与闭环映射和能力级故事停审结论。 | 不先生成全仓故事清单,不得把闭环步骤、角色表、接口名或功能名直接写成故事。 |
| `需求文档书写规范.md` §4.8 | 正式故事表固定为“用户故事 / 目标类型 / 业务价值 / 与核心能力闭环的关系”;故事使用目标级句式,不写接口名、功能名或实现动作。 | 每条故事必须有编号、业务价值和闭环映射;边界外能力不进入正式故事表。 |
| `设计文档编写通则.md` | Step 8 是后续 Step 9~14 的结构锚点之一,正式正文只承载收口结论。 | 本文件保留诊断和取舍;正式 `00` 仍等待 Step 17 装配。 |
| `设计文档讨论中间产物规范.md` | Step 8 必须独立落盘并维护计划、诊断、取舍、结构化产物和自检;不得提前创建 Step 9~17 文件。 | 当前只创建 Step 8 文件。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从台账和 Step 文件恢复;正式 baseline 只能来自文件,不能来自对话记忆。 | Step 8 只给出故事语义,不生成 schema、state、event、evidence 或 implementation boundary。 |
| `00_req_step_05_users_roles.md` | 故事主体只能来自已确认角色:受控执行请求方、AI member、Runner 操作者、安全审查者、运维 / SRE、审计者、后台 reaper。 | 不把 `L2-tools`、`L2-runtime`、`L2-member-service` 等仓际依赖写成角色。 |
| `00_req_step_06_consumers_dependencies.md` | tools/runtime/member-service/runner/artifact/observability 是消费或协作方;identity/work/policy 来源是输入语境;`L0-core` 和 isolation backend 是强前置。 | 故事可以表达消费目标,但不能把这些仓的 truth 反写成 sandbox 内部故事。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点、外围增强能力和边界外能力。 | Step 8 必须按 C-SBX-1~5 逐节点组织故事;不能映射的只可归为外围增强或边界外候选。 |
| 旧 `00-需求文档.md` §5 用户故事卡片 | 旧 `US-001~004` 混有 `SandboxService`、后端名、验收条件、接口动作和 P0/P1 优先级。 | 只保留 runtime 请求隔离、默认拒绝出网、Runner 复用、资源超限与审计等主题线索,不继承旧句式。 |
| 旧 `README.md` | 提供 Runtime Tool 调用 / Runner App、默认无出网、资源限制、审计事件、共享接口等历史主题。 | 这些线索只能映射成故事目标,不能把 Docker/gVisor、SandboxInvoked 等写入故事。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 当前正在讨论哪个核心能力节点? | Step 8 按 C-SBX-1 受控执行语境识别与约束、C-SBX-2 隔离环境边界建立与限制施加、C-SBX-3 给定策略内执行与 fail-closed、C-SBX-4 输出与观测材料安全捕获和分层交接、C-SBX-5 失败租约清理与安全红线保守收束的顺序逐个收敛故事。 |
| 哪些角色目标在支撑本仓的核心能力闭环? | 受控执行请求方支撑正式请求语境、统一隔离入口和结果回收;AI member / 自动化执行者支撑在正式边界内执行和受策略约束;Runner 操作者支撑跨调用方统一边界和统一回收链;安全审查者支撑 deny-by-default、fail closed 和安全红线可信;运维 / SRE 支撑边界一致性、失败分类和宿主保护;审计者支撑输出、失败、cleanup 的责任链与对账;后台 reaper 支撑租约和 orphan 环境的保守回收。 |
| 哪些角色目标只是外围增强,而不决定闭环是否成立? | 多后端风险分层选择、复杂 replay / inspect 控制台、多集群调度、丰富输出预览、性能 / 成本 dashboard、策略模拟和后端能力比较都属于外围增强,重要但不决定闭环是否成立。 |
| 哪些看起来像故事,但其实不应进入本仓? | ToolDefinition / ToolPolicy truth、ExecutionInstance / agent loop / recover、SandboxBinding / host lifecycle、Artifact 正式入库 / baseline truth、observability 存储、policy decision truth、backend 选型与部署拓扑、镜像构建、UI/console/chat/bridge 产品流程都不应进入本仓正式故事表。 |
| 每条故事分别支撑闭环中的哪个能力节点? | 每条核心故事都映射到 C-SBX-1~5 中至少一个节点;Runner 一致性故事同时支撑 C-SBX-1 / C-SBX-3 / C-SBX-4;审计和清理故事分别支撑 C-SBX-4 / C-SBX-5。外围增强故事只映射到“外围增强能力”。 |
| 当前能力节点下是否存在没有角色目标支撑的故事? | 不存在。每个核心节点都至少由 2~4 条角色目标故事支撑,并且所有故事主体都能回指 Step 5 角色。 |
| 当前能力节点的故事是否足以进入功能需求讨论? | 足以。C-SBX-1~5 每个节点都已有明确角色目标、业务价值和闭环映射,可以继续进入 Step 9 做能力归并,同时不会直接滑入接口、规则或数据归属。 |

---

## 4. 当前材料诊断

### 4.1 从 Step 7 到 Step 8 的转译诊断

| 核心能力节点 | 容易误写成什么 | 当前转译方式 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | “调用 `SandboxService` 发请求”或“创建 Session” | 写成请求方、AI member、Runner 操作者对正式执行语境和统一入口的目标。 |
| C-SBX-2 隔离环境边界建立与限制施加 | “支持 Docker / gVisor / Firecracker”或“ApplyIsolationPolicy” | 写成请求方、SRE、安全审查者对统一隔离承载和边界可信性的目标。 |
| C-SBX-3 给定策略内执行与 fail-closed | “默认无出网”“白名单放行”“ToolPolicy allowlist” | 写成自动化执行者、安全审查者和 Runner 操作者对正式策略边界和保守拒绝的目标。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | “返回 stdout/stderr/exit_code”“发审计事件” | 写成请求方、审计者和 Runner 操作者对稳定结果语境、来源保留和统一回收链的目标。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | “limit_exceeded 错误码”“cleanup API”“escape_detected event” | 写成运维、安全审查者、审计者和 reaper 对失败分类、红线收束和保守回收的目标。 |

### 4.2 旧故事污染诊断

| 旧故事 / 旧表达 | 有效线索 | 当前问题 | Step 8 处理 |
|---|---|---|---|
| `US-001` runtime 用统一 `SandboxService` 在受限环境里执行代码 | runtime / tools 请求统一隔离入口 | 接口名、实现动作和 runtime 角色都越界 | 改写为受控执行请求方需要正式执行语境和统一受控执行入口。 |
| `US-002` Security 默认阻断一切出网 | deny-by-default 和越权阻断是核心线索 | 单条规则 + 验收句式,不是目标级故事 | 改写为安全审查者希望策略缺失或越权动作被保守拒绝。 |
| `US-003` Runner 复用与 Member Runtime 相同接口 | 跨调用方统一边界是有效目标 | “同接口”过早固化 API | 改写为 Runner 操作者希望沿用与其他调用方一致的执行语境、策略边界和回收链。 |
| `US-004` 资源超限时拿到明确退出原因与审计事件 | 失败分类和审计可对账是有效线索 | 错误码和事件属于功能 / 接口 / 验收候选 | 改写为运维 / 审计角色需要稳定失败分类和非 happy path 留痕。 |
| README 中 Docker + gVisor 两后端 | 不同风险级别可能需要不同承载 | 后端产品不是故事目标 | 保留为外围增强候选,不进核心故事表。 |
| README 中 `SandboxInvoked / Exited / EscapeDetected` | 执行与红线材料需要可追溯 | 事件名不是故事 | 后移 Step 12 / 14,仅保留为 C-SBX-4 / 5 线索。 |

### 4.3 角色 / 边界串线诊断

| 易串线对象 | 若误写进故事会怎样 | 当前防线 |
|---|---|---|
| `L2-tools` / `L2-runtime` / `L2-member-service` | 会把仓际依赖或 execution truth 伪装成用户故事角色 | 统一用“受控执行请求方 / 系统调用方”承接系统侧请求目标。 |
| `L1-artifact` | 会把候选输出直接写成正式 Artifact truth | C-SBX-4 故事只表达来源保留和安全交接,不写正式入库或 baseline truth。 |
| `L4-observability` | 会把审计 / trace / metrics 存储写成 sandbox 故事 | 审计者只查看材料,不拥有 store truth。 |
| governance / capability / tools policy 来源 | 会把策略裁决写成 sandbox 故事 | C-SBX-3 只表达执行给定策略和 fail closed。 |
| backend 产品本体 | 会把 Docker/gVisor/Firecracker 选型写成故事 | 多后端只保留为外围增强,不进核心故事表。 |

### 4.4 跨能力重复诊断

两个位置最容易出现重复:

1. Runner 相关故事容易同时落到 C-SBX-1、C-SBX-3、C-SBX-4。
2. 审计相关故事容易同时落到 C-SBX-4、C-SBX-5。

当前处理口径:

- Runner 在 C-SBX-1 讲统一执行语境,在 C-SBX-3 讲统一策略边界,在 C-SBX-4 讲统一回收链,三者不重复。
- 审计者在 C-SBX-4 讲输出 / 观测材料来源语境,在 C-SBX-5 讲 kill / deny / cleanup / reaper 等非 happy path 留痕,两者边界清楚。

---

## 5. 设计取舍

### 5.1 按能力节点而不是按角色铺故事

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 先按角色生成全仓故事 | 角色覆盖看起来完整 | 会把同一角色目标拆散到多个能力节点,后续 Step 9 难以归并 | 不采用。 |
| 方案 B: 按 C-SBX-1~5 逐节点收故事 | 与 Step 7 锚点一致,便于后续能力级停审 | 需要在跨能力审计中处理重复风险 | 采用。 |

### 5.2 故事保持目标级句式

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 继续使用 `SandboxService`、`ExecuteSandboxed`、`limit_exceeded`、`SandboxExited` 等旧表达 | 会把接口、错误码、事件名和验收混进 Step 8 | 不采用。 |
| 方案 B | 写成“希望正式执行语境成立 / 希望高风险动作被保守拒绝 / 希望结果语境可稳定消费”等目标级故事 | 能稳定承接 Step 9~14 | 采用。 |

### 5.3 外围增强保留但不压过核心

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 只保留核心故事 | 文档最干净,但会丢失旧材料中仍有价值的增强方向 | 不采用。 |
| 方案 B | 保留少量外围增强故事,单独成表 | 核心闭环和增强方向都保留,边界更清楚 | 采用。 |
| 方案 C | 把多后端调优、控制台、dashboard、输出预览全部混入核心表 | 会稀释闭环核心 | 不采用。 |

### 5.4 边界外故事裁剪

Step 8 不能因为“像故事”就把边界外能力纳入正式故事表。当前明确裁剪:

- tool semantic execution / ToolPolicy truth
- runtime agent loop / ExecutionInstance / recover truth
- member host lifecycle / SandboxBinding truth
- artifact 正式 truth / baseline / evidence truth
- observability 存储 truth
- governance / capability policy decision truth
- backend 选型、镜像构建和产品 UI 流程

这些只能留在边界外故事排除表,为 Step 9~12 提供保护线。

---

## 6. 结构化中间产物

### 6.1 核心闭环故事结论

| ID | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-SBX-001 | 作为受控执行请求方 / 系统调用方,我希望在发起真实执行时附带正式执行语境和最小约束前提,以便这次执行能够被稳定归责并落入统一隔离边界。 | 核心闭环 | 让平台内不同调用方的真实执行都从同一责任链和边界入口进入。 | 支撑 C-SBX-1 受控执行语境识别与约束 |
| US-SBX-002 | 作为 AI member / 自动化执行者,我希望我的真实动作在进入执行时保留身份与工作语境,以便自动推进不会脱离项目责任链或伪造执行上下文。 | 核心闭环 | 让自动化执行仍受正式身份和工作语境约束。 | 支撑 C-SBX-1 受控执行语境识别与约束 |
| US-SBX-003 | 作为 Runner 操作者 / 运行触发者,我希望 Runner 触发的运行请求进入与其他调用方一致的正式执行语境,以便平台不会为 Runner 额外维护第二套运行入口和风险口径。 | 核心闭环 | 保证跨调用方入口一致,避免 Runner 另起一套沙箱语义。 | 支撑 C-SBX-1 受控执行语境识别与约束 |
| US-SBX-004 | 作为受控执行请求方 / 系统调用方,我希望真实执行总是落入正式隔离环境,而不是直接在宿主侧散落执行,以便高风险动作有统一承载边界。 | 核心闭环 | 让 sandbox 不是普通执行器,而是统一隔离承载层。 | 支撑 C-SBX-2 隔离环境边界建立与限制施加 |
| US-SBX-005 | 作为运维 / SRE / 平台维护者,我希望不同调用方触发的执行都遵守一致的资源、文件系统、网络和进程边界,以便宿主污染、排障和容量问题不被调用方差异放大。 | 核心闭环 | 让隔离边界在运维视角下稳定、一致、可维护。 | 支撑 C-SBX-2 隔离环境边界建立与限制施加 |
| US-SBX-006 | 作为安全审查者,我希望隔离边界在后端能力不足或限制不可落实时不会静默退化,以便安全底线可以被信任。 | 核心闭环 | 保护“限制必须生效”这一隔离底线。 | 支撑 C-SBX-2 隔离环境边界建立与限制施加;C-SBX-3 给定策略内执行与 fail-closed |
| US-SBX-007 | 作为 AI member / 自动化执行者,我希望只有满足正式 launch / isolation policy 的动作才能继续执行,以便自动化行为不会越权或绕开治理边界。 | 核心闭环 | 让自动化执行受正式策略约束,而不是由执行器临场裁量。 | 支撑 C-SBX-3 给定策略内执行与 fail-closed |
| US-SBX-008 | 作为安全审查者,我希望缺失策略、冲突策略或后端不支持策略的请求被保守拒绝,以便 deny-by-default 真正成立。 | 核心闭环 | 让高风险场景在策略不完备时停在边界外。 | 支撑 C-SBX-3 给定策略内执行与 fail-closed |
| US-SBX-009 | 作为 Runner 操作者 / 运行触发者,我希望 Runner 场景与工具 / 成员场景遵守同一套策略执行口径,以便跨调用方不会出现第二套风险模型。 | 核心闭环 | 保证 Runner、tools、member 共享同一策略边界。 | 支撑 C-SBX-3 给定策略内执行与 fail-closed |
| US-SBX-010 | 作为受控执行请求方 / 系统调用方,我希望获得稳定的执行输出、候选材料和结果语境,以便上层流程可以继续消费而不自建第二条回收链。 | 核心闭环 | 让不同调用方都能依赖同一条输出回收主线。 | 支撑 C-SBX-4 输出与观测材料安全捕获和分层交接 |
| US-SBX-011 | 作为审计者 / 合规查看者,我希望输出、资源使用和审计材料保留来源语境,以便一次执行的结果、责任链和后果可以对账。 | 核心闭环 | 让输出和审计材料可解释、可复核。 | 支撑 C-SBX-4 输出与观测材料安全捕获和分层交接 |
| US-SBX-012 | 作为 Runner 操作者 / 运行触发者,我希望 Runner 触发的执行结果通过与其他调用方一致的捕获和交接路径返回上层,以便运行体验和证据链不分叉。 | 核心闭环 | 保护跨调用方统一回收链。 | 支撑 C-SBX-4 输出与观测材料安全捕获和分层交接 |
| US-SBX-013 | 作为运维 / SRE / 平台维护者,我希望 timeout、资源超限、backend failure、capture failure 和 orphan environment 都有稳定失败分类,以便故障定位和宿主保护有一致依据。 | 核心闭环 | 让非 happy path 可被稳定处理和排障。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |
| US-SBX-014 | 作为安全审查者,我希望疑似 escape、越权访问和其他安全红线事件被保守收束并显式留痕,以便高风险场景不会静默扩散。 | 核心闭环 | 让安全红线成为正式收束点而不是 best-effort 提示。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |
| US-SBX-015 | 作为审计者 / 合规查看者,我希望 kill、deny、replay、cleanup 和 reaper 动作都有可追溯材料,以便事后审计能够解释非 happy path 发生了什么。 | 核心闭环 | 让非 happy path 同样可追溯、可复盘。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |
| US-SBX-016 | 作为 Sandbox 后台维护 actor / reaper,我希望在租约过期或孤儿环境场景下进行保守回收,而不重写业务、运行或制品真相,以便维护动作只收束隔离层边界。 | 核心闭环 | 让后台维护动作有清晰边界,不吞并相邻仓 truth。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |

### 6.2 外围增强故事结论

| ID | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-SBX-E01 | 作为运维 / SRE / 平台维护者,我希望能够按风险等级选择更强或更经济的隔离承载方案,以便在安全和成本之间做更细粒度权衡。 | 外围增强 | 提升运行弹性和成本效率,但不决定核心闭环是否成立。 | 支撑外围增强:多后端优化 / 强隔离变体 |
| US-SBX-E02 | 作为运维 / SRE / 平台维护者,我希望获得更丰富的 replay / inspect / operator 控制台,以便复杂故障和异常会话可以更快诊断。 | 外围增强 | 提升人工运维效率,但核心失败收束不依赖该控制台。 | 支撑外围增强:高级 replay / inspect / operator console |
| US-SBX-E03 | 作为 Runner 操作者 / 运行触发者,我希望获得更丰富的输出预览和结果分析体验,以便快速判断一次运行是否值得继续处理。 | 外围增强 | 提升消费体验,但不决定 sandbox capture / handoff 是否成立。 | 支撑外围增强:输出预览与分析 |
| US-SBX-E04 | 作为运维 / SRE / 平台维护者,我希望按宿主或集群维度调度受控执行,以便隔离容量和热点压力可以被更细致管理。 | 外围增强 | 属于调度与容量优化,不是核心闭环前置。 | 支撑外围增强:多宿主 / 多集群调度 |
| US-SBX-E05 | 作为安全审查者,我希望比较不同后端和风险场景下的有效隔离能力差异,以便上线前更早发现策略与承载不匹配。 | 外围增强 | 提升变更前评估质量,但不替代正式策略执行与 fail-closed。 | 支撑外围增强:后端能力比较 / 策略模拟 |
| US-SBX-E06 | 作为运维 / SRE / 平台维护者,我希望看到隔离成本、启动时延、输出体积和失败分布的长期趋势,以便做容量和性能优化。 | 外围增强 | 属于 NFR / 观测增强,后移 Step 13 / 14。 | 支撑外围增强:容量 / 性能 / 成本 dashboard |

### 6.3 边界外故事排除结论

| 排除项 | 不进入本仓故事的原因 | 正确归属 |
|---|---|---|
| 作为工具维护者,我希望定义 ToolPolicy、危险工具语义和工具结果归一化 | tool semantic execution 和 ToolPolicy truth 不归 sandbox | `L2-tools` |
| 作为 runtime 编排方,我希望维护 ExecutionInstance、checkpoint、recover 和结果回流 | runtime 主线 truth 不归 sandbox | `L2-runtime` |
| 作为成员宿主维护者,我希望维护 SandboxBinding、worker/session、host health 和 callback material | 宿主生命周期 truth 不归 sandbox | `L2-member-service` |
| 作为制品维护者,我希望把输出文件直接确认成正式 Artifact 版本或 Baseline 成员 | Artifact 正式 truth 不归 sandbox | `L1-artifact` |
| 作为观测平台维护者,我希望保存 trace / metric / audit store 并做查询告警 | observability store truth 不归 sandbox | `L4-observability` |
| 作为策略所有者,我希望在 sandbox 内裁定 allowlist truth、审批流程和 policy DSL | sandbox 执行给定策略,不拥有策略决策 truth | governance / capability / tools policy 来源 |
| 作为平台工程师,我希望决定 Docker/gVisor/Firecracker/k8s 的选型和部署拓扑 | 后端产品与拓扑属于架构 / 配置 / 实施阶段 | `01` / `04` / `07` |
| 作为产品用户,我希望在 Console / Chat / Bridge 中直接控制 sandbox 交互流程 | 产品 UI / CLI 语义不归 sandbox | `L5-console` / `L5-chat` / `L6-bridges` |
| 作为镜像维护者,我希望构建运行镜像和供应链资产 | 镜像构建 truth 不归 sandbox | `L2-member-images` 或部署边界 |

### 6.4 故事与核心能力闭环映射结论

| 核心能力节点 | 对应故事 |
|---|---|
| C-SBX-1 受控执行语境识别与约束 | US-SBX-001; US-SBX-002; US-SBX-003 |
| C-SBX-2 隔离环境边界建立与限制施加 | US-SBX-004; US-SBX-005; US-SBX-006 |
| C-SBX-3 给定策略内执行与 fail-closed | US-SBX-006; US-SBX-007; US-SBX-008; US-SBX-009 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | US-SBX-010; US-SBX-011; US-SBX-012 |
| C-SBX-5 失败租约清理与安全红线保守收束 | US-SBX-013; US-SBX-014; US-SBX-015; US-SBX-016 |
| 外围增强 | US-SBX-E01; US-SBX-E02; US-SBX-E03; US-SBX-E04; US-SBX-E05; US-SBX-E06 |

### 6.5 能力级故事停审结论

| 能力节点 | 当前故事集 | 停审结论 |
|---|---|---|
| C-SBX-1 | US-SBX-001~003 | 已覆盖系统请求、AI 自动化和 Runner 入口三类核心语境,无接口名、无宿主对象名、无相邻仓 truth 串线,可进入 Step 9。 |
| C-SBX-2 | US-SBX-004~006 | 已覆盖统一隔离承载、边界一致性和“不能 silent degrade”的安全目标,无后端产品选型或配置细节,可进入 Step 9。 |
| C-SBX-3 | US-SBX-007~009 + US-SBX-006 交叉支撑 | 已覆盖自动化受策略约束、保守拒绝和跨调用方同口径执行,未把 ToolPolicy / policy DSL / API 写成故事,可进入 Step 9。 |
| C-SBX-4 | US-SBX-010~012 | 已覆盖结果回收、来源保留和 Runner 不分叉输出链,未把 artifact truth 或 observability store 写成故事,可进入 Step 9。 |
| C-SBX-5 | US-SBX-013~016 | 已覆盖失败分类、安全红线、审计留痕和保守 reaper,未把 runtime recover、业务重放或 artifact 入库写成故事,可进入 Step 9。 |

### 6.6 跨能力故事审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否存在孤儿故事 | no | 所有核心和外围增强故事均已映射到 C-SBX-1~5 或“外围增强能力”。 |
| 是否存在角色清单伪装成故事 | no | 所有故事都使用目标级句式,不是角色枚举。 |
| 是否存在功能名 / 接口名伪装成故事 | no | 已移除 `SandboxService`、`ExecuteSandboxed`、事件名、错误码和后端名。 |
| 是否存在跨能力重复故事 | acceptable_and_explained | Runner、一部分安全审查和审计故事跨 2 个能力节点映射,但语义分别对应入口、策略、回收或清理,并非重复。 |
| 是否存在边界外故事误入正式故事表 | no | 已单独列出边界外故事排除表。 |

### 6.7 后续 Step 保护线

| 后续 Step | Step 8 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 9 功能需求 | 功能必须按 C-SBX-1~5 归并,并能回指 US-SBX 编号。 | 不把故事原句直接改成功能名。 |
| Step 10 业务规则与边界约束 | 规则必须优先保护故事中提到的 fail-closed、禁止 silent degrade、统一回收链和 cleanup 不先删证据。 | 不把规则句式伪装成故事继续扩写。 |
| Step 11 数据归属 | 数据归属要解释故事中“正式执行语境”“输出来源语境”“失败留痕”涉及哪些 truth、引用和材料。 | 不把 Artifact、ExecutionInstance、ToolPolicy 等外部 truth 拉进 sandbox。 |
| Step 12 接口与依赖 | 接口必须表达故事里的能力边界,但不能反向用 API 名重写故事。 | 不写 DTO、event payload、trait 或 handler。 |
| Step 13~14 | NFR 和验收要从故事业务价值出发,重新校准旧时延、留痕率、拒绝率等数字。 | 不继承旧 README / 旧 00 的 benchmark 或验收句式。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | 故事表、映射表和排除表足以承载 Step 8 结论。 |
| 是否原样继承旧故事 | no | 旧 `US-001~004` 已全部改写为目标级故事。 |
| 是否保留外围增强故事 | yes | 保留 6 条外围增强故事,但单独成表,不压过核心闭环。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 8 的上游冲突。 |
| 是否允许进入 Step 9 | pass_wait_review | 技术上 Step 8 已完成;按用户规则等待审查确认后再进入 Step 9。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 8 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 8. 用户故事

> 校准来源：
> - `design-calibration/00_req_step_08_user_stories.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何从 Step 5 角色和 Step 7 核心能力闭环收束为当前故事表。

### 8.1 核心闭环故事

| 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|
| 作为受控执行请求方 / 系统调用方,我希望在发起真实执行时附带正式执行语境和最小约束前提,以便这次执行能够被稳定归责并落入统一隔离边界。 | 核心闭环 | 让平台内不同调用方的真实执行都从同一责任链和边界入口进入。 | 支撑 C-SBX-1 受控执行语境识别与约束 |
| 作为 AI member / 自动化执行者,我希望我的真实动作在进入执行时保留身份与工作语境,以便自动推进不会脱离项目责任链或伪造执行上下文。 | 核心闭环 | 让自动化执行仍受正式身份和工作语境约束。 | 支撑 C-SBX-1 受控执行语境识别与约束 |
| 作为 Runner 操作者 / 运行触发者,我希望 Runner 触发的运行请求进入与其他调用方一致的正式执行语境,以便平台不会为 Runner 额外维护第二套运行入口和风险口径。 | 核心闭环 | 保证跨调用方入口一致,避免 Runner 另起一套沙箱语义。 | 支撑 C-SBX-1 受控执行语境识别与约束 |
| 作为受控执行请求方 / 系统调用方,我希望真实执行总是落入正式隔离环境,而不是直接在宿主侧散落执行,以便高风险动作有统一承载边界。 | 核心闭环 | 让 sandbox 不是普通执行器,而是统一隔离承载层。 | 支撑 C-SBX-2 隔离环境边界建立与限制施加 |
| 作为运维 / SRE / 平台维护者,我希望不同调用方触发的执行都遵守一致的资源、文件系统、网络和进程边界,以便宿主污染、排障和容量问题不被调用方差异放大。 | 核心闭环 | 让隔离边界在运维视角下稳定、一致、可维护。 | 支撑 C-SBX-2 隔离环境边界建立与限制施加 |
| 作为安全审查者,我希望隔离边界在后端能力不足或限制不可落实时不会静默退化,以便安全底线可以被信任。 | 核心闭环 | 保护“限制必须生效”这一隔离底线。 | 支撑 C-SBX-2 隔离环境边界建立与限制施加;C-SBX-3 给定策略内执行与 fail-closed |
| 作为 AI member / 自动化执行者,我希望只有满足正式 launch / isolation policy 的动作才能继续执行,以便自动化行为不会越权或绕开治理边界。 | 核心闭环 | 让自动化执行受正式策略约束,而不是由执行器临场裁量。 | 支撑 C-SBX-3 给定策略内执行与 fail-closed |
| 作为安全审查者,我希望缺失策略、冲突策略或后端不支持策略的请求被保守拒绝,以便 deny-by-default 真正成立。 | 核心闭环 | 让高风险场景在策略不完备时停在边界外。 | 支撑 C-SBX-3 给定策略内执行与 fail-closed |
| 作为 Runner 操作者 / 运行触发者,我希望 Runner 场景与工具 / 成员场景遵守同一套策略执行口径,以便跨调用方不会出现第二套风险模型。 | 核心闭环 | 保证 Runner、tools、member 共享同一策略边界。 | 支撑 C-SBX-3 给定策略内执行与 fail-closed |
| 作为受控执行请求方 / 系统调用方,我希望获得稳定的执行输出、候选材料和结果语境,以便上层流程可以继续消费而不自建第二条回收链。 | 核心闭环 | 让不同调用方都能依赖同一条输出回收主线。 | 支撑 C-SBX-4 输出与观测材料安全捕获和分层交接 |
| 作为审计者 / 合规查看者,我希望输出、资源使用和审计材料保留来源语境,以便一次执行的结果、责任链和后果可以对账。 | 核心闭环 | 让输出和审计材料可解释、可复核。 | 支撑 C-SBX-4 输出与观测材料安全捕获和分层交接 |
| 作为 Runner 操作者 / 运行触发者,我希望 Runner 触发的执行结果通过与其他调用方一致的捕获和交接路径返回上层,以便运行体验和证据链不分叉。 | 核心闭环 | 保护跨调用方统一回收链。 | 支撑 C-SBX-4 输出与观测材料安全捕获和分层交接 |
| 作为运维 / SRE / 平台维护者,我希望 timeout、资源超限、backend failure、capture failure 和 orphan environment 都有稳定失败分类,以便故障定位和宿主保护有一致依据。 | 核心闭环 | 让非 happy path 可被稳定处理和排障。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |
| 作为安全审查者,我希望疑似 escape、越权访问和其他安全红线事件被保守收束并显式留痕,以便高风险场景不会静默扩散。 | 核心闭环 | 让安全红线成为正式收束点而不是 best-effort 提示。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |
| 作为审计者 / 合规查看者,我希望 kill、deny、replay、cleanup 和 reaper 动作都有可追溯材料,以便事后审计能够解释非 happy path 发生了什么。 | 核心闭环 | 让非 happy path 同样可追溯、可复盘。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |
| 作为 Sandbox 后台维护 actor / reaper,我希望在租约过期或孤儿环境场景下进行保守回收,而不重写业务、运行或制品真相,以便维护动作只收束隔离层边界。 | 核心闭环 | 让后台维护动作有清晰边界,不吞并相邻仓 truth。 | 支撑 C-SBX-5 失败租约清理与安全红线保守收束 |

### 8.2 外围增强故事

| 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|
| 作为运维 / SRE / 平台维护者,我希望能够按风险等级选择更强或更经济的隔离承载方案,以便在安全和成本之间做更细粒度权衡。 | 外围增强 | 提升运行弹性和成本效率。 | 支撑外围增强:多后端优化 / 强隔离变体 |
| 作为运维 / SRE / 平台维护者,我希望获得更丰富的 replay / inspect / operator 控制台,以便复杂故障和异常会话可以更快诊断。 | 外围增强 | 提升人工运维效率。 | 支撑外围增强:高级 replay / inspect / operator console |
| 作为 Runner 操作者 / 运行触发者,我希望获得更丰富的输出预览和结果分析体验,以便快速判断一次运行是否值得继续处理。 | 外围增强 | 提升消费体验。 | 支撑外围增强:输出预览与分析 |
| 作为运维 / SRE / 平台维护者,我希望按宿主或集群维度调度受控执行,以便隔离容量和热点压力可以被更细致管理。 | 外围增强 | 提升容量调度能力。 | 支撑外围增强:多宿主 / 多集群调度 |
| 作为安全审查者,我希望比较不同后端和风险场景下的有效隔离能力差异,以便上线前更早发现策略与承载不匹配。 | 外围增强 | 提升变更前评估质量。 | 支撑外围增强:后端能力比较 / 策略模拟 |
| 作为运维 / SRE / 平台维护者,我希望看到隔离成本、启动时延、输出体积和失败分布的长期趋势,以便做容量和性能优化。 | 外围增强 | 提升容量和性能优化能力。 | 支撑外围增强:容量 / 性能 / 成本 dashboard |
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按能力节点组织故事 | pass | 已按 C-SBX-1~5 逐节点组织。 |
| 是否每条故事都有编号 | pass | 核心故事使用 `US-SBX-001~016`,外围增强故事使用 `US-SBX-E01~E06`。 |
| 是否每条故事都有业务价值和闭环映射 | pass | 所有正式故事均满足固定表结构。 |
| 是否区分核心闭环故事与外围增强故事 | pass | 已分为两张表。 |
| 是否排除边界外故事 | pass | 已形成边界外故事排除表。 |
| 是否没有把角色清单当故事 | pass | 故事均为目标级句式,不是角色枚举。 |
| 是否没有把功能名 / 接口名 / 事件名写成故事 | pass | 已剔除 `SandboxService`、`ExecuteSandboxed`、旧事件名和错误码。 |
| 是否没有把业务规则、数据归属、NFR 或验收写成故事 | pass | deny-by-default、silent degrade、cleanup 不先删证据等只保留为后续规则 / 验收线索。 |
| 是否没有把相邻仓 truth 写进故事表 | pass | `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-artifact`、`L4-observability` 等都未作为正式故事主体或目标。 |
| 是否为 Step 9 提供结构锚点 | pass | 故事已能回指 C-SBX-1~5,可供 Step 9 归并为功能需求。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未创建未来 Step 文件 | pass | 当前未创建 Step 9~17 文件。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现、测试或验收证据。 |
| 是否允许进入 Step 9 | pass_wait_review | 技术上 Step 8 已完成;按用户要求等待审查确认后再进入 Step 9。 |

next_allowed_action: `wait_user_confirm_step_9`
