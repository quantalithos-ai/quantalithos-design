# L4-sandbox 00 需求 Step 4: 目标与非目标

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 3,允许进入 Step 4;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 4 章“目标与非目标”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 目标与非目标 |
| 输出文件 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 前置确认 | pass:用户在 Step 3 停审后连续回复“同意 / 继续”,允许进入 Step 4 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 4;`需求文档书写规范.md` §4.4 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `02-概要设计.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 的目标、非目标、NFR、测试和验收线索 |
| 历史材料口径 | 旧材料只作目标线索和污染审计输入,不继承旧目标编号、接口名、后端承诺、性能数字、测试结果或验收结论 |
| 禁写范围 | 不写用户角色、依赖裁剪、核心能力闭环步骤、用户故事、功能清单、业务规则表、数据归属、接口清单、NFR 指标、验收条件、schema、port、event payload、配置 key、实现后端或代码目录 |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_5 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~3、SOP、书写规范和旧材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 本次需求结束后应成立的状态 / 边界 / 能力范围,验证方式,非目标和相邻归属 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 2/3 目标来源、旧目标混层、旧非目标缺口和相邻仓串线诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 目标主轴、非目标分组、验证口径和旧材料处理取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 目标结论表、非目标结论表、范围收束结论和后续 Step 保护线 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录 / 是否生成依赖类中间产物判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 4 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 4 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 5。 |

---

## 2. 必读摘要

| 文档 | Step 4 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 4 | 本步收口范围,输出目标结论、非目标结论和范围收束结论。 | 每个目标必须可验证,每个非目标必须具体;不得把功能、方案或口号写成本步结果。 |
| `需求文档书写规范.md` §4.4 | 正式第 4 章推荐目标表和非目标表;目标是本次需求完成后应成立的状态、边界或能力范围。 | 目标表固定为“目标 / 说明 / 验证方式”;非目标表固定为“非目标 / 不做原因”。 |
| `设计文档讨论中间产物规范.md` | Step 文件必须包含问题回答、诊断、取舍、结构化产物、回填草稿和自检;未来 Step 不得提前落盘。 | 本文件只创建 Step 4,不创建 Step 5~17 文件,不写正式 `00` 正文。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从项目台账、flow 和当前 Step 恢复;后续 schema、state、event、artifact、evidence、phase 要唯一真相源。 | Step 4 不生成 schema / port / evidence / phase boundary,只设定后续需求边界。 |
| `全局项目依赖关系与裁剪规则.md` | `L4-sandbox` 编译期依赖 `L0-core`,运行期依赖 isolation backend,按需发布 sandbox 事件,不拥有业务真相。 | 目标可强调“运行隔离需求边界成立”;依赖裁剪和事件协作后置 Step 6 / Step 12。 |
| `00_req_step_01_upstream_relation.md` | L4-sandbox 承接运行隔离基础主题,旧材料只作 historical_material。 | 目标必须来自运行隔离基础需求,不得继承旧后端、事件名、性能目标或测试结论。 |
| `00_req_step_02_position_boundary.md` | L4-sandbox 是平台运行隔离基础仓;负责可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 | 目标要围绕这些边界建立,非目标要继续排除 tools/runtime/member/identity/work/artifact/observability/governance 和后端产品。 |
| `00_req_step_03_problem_context.md` | 已收束 P-SBX-001~003:问题层未按当前标准收束、隔离边界在调用方处分裂、输出/观测/失败/清理语义混层。 | 目标必须回应这三类问题,不能新增未在问题层出现的方向。 |
| 旧 `README.md` | 旧材料包含代码执行隔离、资源限制、默认无出网、审计事件、Runner/Member 共享、Docker/gVisor/Firecracker 和性能目标。 | 可保留隔离、资源、无出网、审计、共享接口的主题线索;后端、目录、技术栈和性能数字后置。 |
| 旧 `00-需求文档.md` §3 | 旧目标 G-1~G-6 写 SandboxService、Docker/gVisor、无出网、资源限制、审计事件;旧非目标写工具调用、白名单决策、镜像构建和 UI。 | 旧目标多数混入功能、接口、NFR 和验收;旧非目标方向可保留但需补齐 runtime/member/identity/work/artifact/observability/governance 后端边界。 |
| 旧 `02/05/06` | 旧文档强调 execution/session、isolation、command、output/evidence、control/recovery、kill/replay/cleanup、未授权访问阻断。 | 只作为后续 Step 7~14 候选主题;本 Step 不继承对象名、测试 case、验收项或 evidence 口径。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本次需求结束后,应成立哪些状态、边界或能力? | 应成立五类范围级结论:运行隔离基础的新版需求边界成立;跨调用方的受控执行边界保持统一;执行环境身份、资源、文件系统、网络、进程、启动策略、捕获、观测、失败、租约清理和安全红线形成后续需求主轴;输出/候选材料/观测 hook/失败与清理语义能与 artifact、observability、runtime 等相邻仓分层;旧材料中的后端、接口、对象、性能和验收线索被后置重新审计。 |
| 这些目标如何被验证? | Step 4 的验证不是立即跑测试,而是在后续 Step 5~16 中持续检查:角色、依赖、能力、故事、功能、规则、数据、接口、NFR、验收和追溯均能回指上述目标;不出现 tools/runtime/member/identity/work/artifact/observability/governance truth 反向进入 sandbox;不把 Docker/gVisor、SandboxService、P95、事件名或验收项直接作为当前目标。 |
| 哪些事项虽然相关,但明确不纳入当前范围? | 不纳入工具语义执行、runtime agent loop 和 ExecutionInstance、member host lifecycle 和 SandboxBinding 装配 truth、identity/work/artifact/observability/governance truth、runner 产品语义、容器/k8s/isolation backend 产品选型、镜像构建、UI/console 展示、正式测试证据、验收签署和实施 commit boundary。 |
| 哪些事情必须交给相邻仓或后续阶段处理? | ToolDefinition/ToolPolicy/ToolInvocationResult 交给 `L2-tools`;ExecutionInstance/agent loop/recover/checkpoint/结果回流交给 `L2-runtime`;MemberExecutionHost/SandboxBinding 装配和 host lifecycle 交给 `L2-member-service`;actor/member truth 交给 `L1-identity`;Project/WorkItem/ImplementationPlan truth 交给 `L1-work`;artifact 正式真相交给 `L1-artifact`;telemetry/audit 存储交给 `L4-observability`;策略决策交给 governance/capability/tools 相关真相源;后端选型、配置、测试、验收和实施边界交给后续 `01~07`。 |

---

## 4. 当前材料诊断

### 4.1 目标来源诊断

Step 4 的目标只能从 Step 2 的定位和 Step 3 的问题反推。当前可用的目标来源不是旧 `G-1~G-6`,而是:

| 来源 | 可形成的目标方向 | 不应形成的目标表达 |
|---|---|---|
| Step 2 一句话定义 | 运行隔离基础仓的需求边界成立。 | “实现 SandboxService trait”或“提供 execute API”。 |
| Step 2 非职责和边界对象 | 相邻仓 truth 与 sandbox truth 不串线。 | “支持 tools/runtime/member 的所有执行语义”。 |
| Step 3 P-SBX-001 | 新版需求层重建完成,旧后端/接口/指标不直接继承。 | “沿用旧 README 性能目标和后端清单”。 |
| Step 3 P-SBX-002 | 多调用方受控执行边界统一。 | “runtime、tools、member-service 各自实现隔离”。 |
| Step 3 P-SBX-003 | 输出、观测、失败和清理语义分层且可对账。 | “sandbox 直接决定 artifact truth 或 observability store”。 |

### 4.2 旧目标混层诊断

| 旧目标 / 旧线索 | 当前诊断 | Step 4 处理 |
|---|---|---|
| G-1 `提供统一 SandboxService 接口` | 属于接口 / 详细设计候选,且接口名直接固化实现形态。 | 仅保留“跨调用方受控执行边界统一”目标;接口形态后置 Step 12 / 03。 |
| G-2 `默认无出网` | 是安全边界和规则候选,但目标层不能写成单条规则或验收条件。 | 保留为“文件系统 / 网络 / 进程边界和安全红线可被后续收束”的目标组成。 |
| G-3/G-4 `Docker/gVisor 启动时延` | 后端绑定且属于 NFR / benchmark。 | 后置 Step 13 / Step 14 / 05 / 06。 |
| G-5 `资源限制生效` | 方向有效,但旧表达是功能 + 验收指标。 | 保留“resource limits 可进入统一需求主轴”;具体资源项、阈值、失败行为后置。 |
| G-6 `审计事件全覆盖` | 事件名和覆盖率属于接口 / 事件 / NFR / 验收候选。 | 保留“observability hooks / 审计材料可对账”;事件名和覆盖率后置。 |
| SB1~SB5 | 是旧维护纪律线索,混合后端、无出网、事件、资源限制和共用接口。 | 作为后续 Step 7~14 审计输入,不作为 Step 4 目标直接继承。 |

### 4.3 旧非目标缺口诊断

旧非目标能排除“工具调用逻辑”“能力白名单决策”“容器镜像构建”“终端 UI 提示”,但按当前 Step 2 边界仍不完整:

| 缺口 | 若不补齐的风险 | 当前处理 |
|---|---|---|
| `L2-runtime` execution truth | 可能把 ExecutionInstance、agent loop、recover/checkpoint 写入 sandbox 目标。 | 非目标明确排除 runtime agent loop / execution truth。 |
| `L2-member-service` host lifecycle | 可能把 SandboxBinding、host health、worker/session 生命周期写成 sandbox 目标。 | 非目标明确排除 member host lifecycle / SandboxBinding 装配 truth。 |
| `L1-identity` / `L1-work` truth | 可能让 sandbox 保存 actor、Project、WorkItem、ImplementationPlan 正文。 | 非目标明确只消费身份 / 工作引用,不拥有正文。 |
| `L1-artifact` / `L4-observability` truth | 可能让 sandbox 把输出直接变 artifact 或成为 telemetry store。 | 非目标明确排除 artifact truth 和 observability store。 |
| backend product | 可能把 Docker/gVisor/Firecracker/k8s 选型变成本轮目标。 | 非目标明确排除容器平台产品本体和后端选型。 |

### 4.4 相邻仓串线诊断

| 相邻对象 | 目标层串线表现 | 当前边界 |
|---|---|---|
| `L2-tools` | 把 ToolPolicy、ToolInvocationResult、工具失败分流写成 sandbox 目标。 | sandbox 目标只覆盖隔离执行环境承载和边界反馈材料。 |
| `L2-runtime` | 把 ExecutionInstance、agent loop、checkpoint/recover 写成 sandbox 目标。 | sandbox 不拥有运行主线 truth。 |
| `L2-member-service` | 把 SandboxBinding 装配结果、host health、session/worker 写成 sandbox 目标。 | sandbox 不拥有成员宿主生命周期。 |
| `L1-artifact` | 把输出捕获目标写成 Artifact 正式入库目标。 | sandbox 只形成输出 / 候选 / 捕获材料,不决定 artifact truth。 |
| `L4-observability` | 把审计目标写成日志 / metric / trace 存储目标。 | sandbox 只提供 observability hook 或材料,不成为观测存储。 |
| governance / capability | 把安全目标写成策略决策或白名单授权目标。 | sandbox 执行已给定 launch/isolation policy,不产生策略 truth。 |

---

## 5. 设计取舍

### 5.1 目标主轴取舍

| 方案 | 目标主轴 | 优点 | 问题 | 决策 |
|---|---|---|---|---|
| 方案 A | 沿用旧 G-1~G-6 | 看起来可验证,覆盖旧 README。 | 混入接口、后端、NFR、验收和测试方式。 | 不采用。 |
| 方案 B | 只写“建立安全沙箱”一个目标 | 简洁。 | 过泛,无法约束 identity、limits、FS/network/process、policy、capture、observability、failure、cleanup 和 redlines。 | 不单独采用。 |
| 方案 C | 按 Step 3 三个问题拆目标 | 能直接回应问题,但还需要覆盖 Step 2 的具体边界主轴。 | 如果只按问题拆,后续 Step 7 仍可能缺主题锚点。 | 部分采用。 |
| 方案 D | 按“需求边界、统一受控执行、隔离主轴、结果/观测/失败/清理分层、旧材料后置审计”拆目标 | 同时回应 Step 2 和 Step 3,保持目标层粒度,不提前变成功能表。 | 后续 Step 7~14 必须继续展开。 | 采用。 |

### 5.2 非目标分组取舍

非目标需要同时覆盖相邻仓 truth、后端/产品边界和后续阶段边界。若只写“工具逻辑不做”“UI 不做”,仍会留下 runtime、member-service、artifact、observability 和 governance 串线口。

| 分组 | 纳入原因 | 不写成什么 |
|---|---|---|
| 相邻仓 truth | 直接保护 Step 2 非职责。 | 不写依赖裁剪图或接口协作。 |
| 后端 / 平台产品 | 防止 Docker/gVisor/Firecracker/k8s 直接成为目标。 | 不写技术选型方案。 |
| 输出 / 观测 / evidence | 防止 capture、audit、artifact、observability、验收证据混层。 | 不写 evidence alias、run_id 或验收签署。 |
| 后续阶段事项 | 防止 Step 4 提前落功能、规则、数据、接口、NFR、验收和实施边界。 | 不永久排除这些事项,只说明当前 Step 不定稿。 |

### 5.3 验证方式取舍

Step 4 的“验证方式”不是测试用例或验收门禁,而是后续需求章节的追溯检查。当前采用“后续章节不越界 / 能回指目标 / 不继承旧方案”的验证方式。

| 候选验证方式 | 是否采用 | 原因 |
|---|---|---|
| 集成测试、benchmark、安全测试 | 不采用 | 属于 Step 14 / 05 / 06,且旧测试结果不得伪造。 |
| 后续章节追溯检查 | 采用 | 符合 Step 4 的范围收束定位。 |
| 直接列接口、事件、schema | 不采用 | 属于 Step 12 / 03。 |
| 旧 README 指标通过 | 不采用 | 旧指标未重新校准,且 Step 3 已后置。 |

### 5.4 旧材料处理取舍

旧材料中的隔离、资源、无出网、审计、Runner/Member 复用、output capture、failure control、cleanup 等主题保留为后续 Step 候选;旧后端承诺、接口名、事件名、对象名、性能阈值、测试 case、验收门禁和证据词不作为 Step 4 结论。

---

## 6. 结构化中间产物

### 6.1 目标结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立运行隔离基础的新版需求边界 | 明确 `L4-sandbox` 本轮需求收束对象是受控执行环境的运行隔离基础,不是旧后端清单、接口清单、对象表、性能指标或验收项的直接继承。 | 后续章节不把 Docker/gVisor/Firecracker、`SandboxService`、旧事件名、旧对象名、旧 P95 或旧验收项直接作为当前结论。 |
| 收束跨调用方的受控执行边界 | 明确 tools、runtime、member-service、runner、构建测试和人工脚本触发真实执行时,都应回到同一套 sandbox 需求边界,避免调用方各自实现隔离语义。 | Step 5~12 中调用方、依赖、能力、功能和接口都能回指统一受控执行边界,且不要求相邻仓各自持有隔离 truth。 |
| 固定隔离执行环境的需求主轴 | 明确后续需求必须覆盖 execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、artifact/output capture、observability hooks、failure classification、lease/cleanup/reaper 和 security redlines。 | Step 7~14 能围绕这些主轴展开核心能力、功能、规则、数据、接口、NFR 和验收;不存在只写“能跑命令”而遗漏隔离、捕获、失败、清理或红线的章节。 |
| 收束输出、观测、失败和清理的分层边界 | 明确 sandbox 只形成执行输出、候选材料、观测 hook、失败分类和清理语义,不直接成为 artifact truth、observability store、runtime execution truth 或业务决策 truth。 | 后续数据、接口、规则和验收章节不出现 sandbox 直接确认 artifact、保存 telemetry store、推进 runtime recover 或重做业务裁决的结论。 |
| 建立旧材料线索的后置审计边界 | 明确旧 README、旧 `00/02/05/06` 中的后端、接口、事件、对象、性能、测试和验收内容只能作为后续审计输入。 | 后续 Step 对 Docker/gVisor/Firecracker、no-egress、resource limits、audit events、kill/replay/cleanup、output capture、P95 和验收门禁逐项重新校准,不得跳过本轮讨论直接写入正式需求。 |

### 6.2 非目标结论

| 非目标 | 不做原因 |
|---|---|
| 工具语义执行、ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry | 属于 `L2-tools`;sandbox 只承载隔离执行环境和边界反馈材料。 |
| runtime agent loop、ExecutionInstance、step progression、checkpoint / recover、结果回流 truth | 属于 `L2-runtime`;sandbox 不拥有运行主线、恢复主线或业务结果回流。 |
| MemberExecutionHost、session、worker、health、SandboxBinding 装配结果、host lifecycle、callback material | 属于 `L2-member-service`;sandbox 不管理成员宿主生命周期或宿主绑定 truth。 |
| GlobalMember、actor、role / capability identity lifecycle 和身份正文 | 属于 `L1-identity` 或相关能力定义来源;sandbox 只消费身份锚点或安全引用。 |
| Project、ProjectMember、WorkItem、Iteration、ImplementationPlan / PlanItem 正文和工作事实 | 属于 `L1-work`;sandbox 只消费执行上下文引用。 |
| Artifact 正文、版本、baseline、正式 evidence truth 和制品入库决策 | 属于 `L1-artifact`;sandbox 捕获输出或候选材料,不决定正式 artifact truth。 |
| trace / metric / audit log store、查询、retention、alert storage | 属于 `L4-observability`;sandbox 只提供 observability hook 或可消费材料。 |
| governance / capability / tools 的策略决策、授权审批、allowlist truth 和 policy DSL | 属于 governance / capability / tools 等策略真相源;sandbox 只执行已给定 launch/isolation policy 并 fail closed。 |
| Runner 产品语义、CLI / UI / 一键运行工作流和用户界面状态 | 属于 `L5-runner`、`L5-console` 或上层产品入口;sandbox 只提供运行隔离基础。 |
| 容器、k8s、Docker、gVisor、Firecracker、containerd、runc 等后端产品选型和部署拓扑 | 属于运行期依赖、架构、配置和实施阶段;Step 4 不把具体后端写成目标。 |
| 容器镜像构建、成员镜像资产和运行镜像生命周期 | 属于 `L2-member-images`、member-service 或部署/供应链边界;sandbox 不拥有镜像构建 truth。 |
| 当前性能、容量、可用性、安全指标、测试用例、验收门禁和真实证据路径定稿 | 后置 Step 13 / Step 14 / 05 / 06;当前不伪造 benchmark、evidence alias、run_id 或验收签署。 |
| 具体接口名、API path、event kind、DTO schema、Rust struct、repository、handler、配置 key、commit boundary | 后置 Step 12、01、03、04、07 等设计阶段;需求 Step 4 不定义实现组织。 |

### 6.3 范围收束结论

本次需求的范围是把 `L4-sandbox` 收束为平台运行隔离基础的需求真相入口。后续章节必须继续围绕受控执行环境身份、资源限制、文件系统 / 网络 / 进程边界、启动策略执行、输出 / 候选材料捕获、观测 hook、失败分类、租约 / cleanup / reaper 和安全红线展开,同时持续排除 tools semantic execution、runtime agent loop、member host lifecycle、identity/work/artifact/observability/governance truth、runner 产品语义和具体隔离后端产品选型。

Step 4 不裁定具体功能、规则、数据、接口、NFR、验收或实施计划。它只提供后续 Step 的边界锚点:如果后续某条故事、功能、规则、数据、接口或验收不能回指上述目标,或者把非目标内容写入 sandbox,就应在对应 Step 被判定为越界或待确认。

### 6.4 后续 Step 保护线

| 后续 Step | Step 4 提供的保护 | 不允许提前进入的内容 |
|---|---|---|
| Step 5 用户与角色 | 角色应围绕调用方、安全 / 运维审查者和系统消费者展开,且不把实现组件当角色。 | 不写角色权限实现矩阵或 API 权限模型。 |
| Step 6 使用方与依赖 | 依赖裁剪必须基于非目标表区分运行期、事件协作和禁止依赖。 | 不把 runtime/tools/member/artifact/observability/governance truth 并入 sandbox。 |
| Step 7 核心能力闭环 | 能力节点必须覆盖执行环境身份、隔离限制、策略执行、捕获观测、失败分类和清理红线。 | 不只写“执行命令”或“提供后端”。 |
| Step 8~12 | 故事、功能、规则、数据、接口都必须回指 Step 4 目标并避开非目标。 | 不写后端产品、schema、API path、event payload 或 repository。 |
| Step 13~14 | NFR 和验收可以重新评估旧指标和红线,但必须给出当前来源和判断口径。 | 不继承旧 benchmark、覆盖率或验收通过结论。 |
| Step 15~16 | 风险和追溯要检查旧材料后置项、相邻仓串线和孤儿目标。 | 不把待确认项伪装成已定结论。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | Step 4 只输出目标、非目标和范围收束,不需要单独依赖或接口附录。 |
| 是否生成依赖类中间产物 | no | 非目标表提到相邻仓归属,但正式依赖裁剪属于 Step 6 / Step 12。 |
| 是否使用旧目标指标 | no | 旧 G-1~G-6 和旧 README 性能 / 安全数字均后置重新审计。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 4 的上游冲突;旧材料冲突已作为 historical_material 处理。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 4 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

```md
## 4. 目标与非目标

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何从 Step 2 边界、Step 3 问题和旧材料审计中收束为当前目标边界。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立运行隔离基础的新版需求边界 | 明确 `L4-sandbox` 本轮需求收束对象是受控执行环境的运行隔离基础,不是旧后端清单、接口清单、对象表、性能指标或验收项的直接继承。 | 后续章节不把 Docker/gVisor/Firecracker、`SandboxService`、旧事件名、旧对象名、旧 P95 或旧验收项直接作为当前结论。 |
| 收束跨调用方的受控执行边界 | 明确 tools、runtime、member-service、runner、构建测试和人工脚本触发真实执行时,都应回到同一套 sandbox 需求边界,避免调用方各自实现隔离语义。 | Step 5~12 中调用方、依赖、能力、功能和接口都能回指统一受控执行边界,且不要求相邻仓各自持有隔离 truth。 |
| 固定隔离执行环境的需求主轴 | 明确后续需求必须覆盖 execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、artifact/output capture、observability hooks、failure classification、lease/cleanup/reaper 和 security redlines。 | Step 7~14 能围绕这些主轴展开核心能力、功能、规则、数据、接口、NFR 和验收;不存在只写“能跑命令”而遗漏隔离、捕获、失败、清理或红线的章节。 |
| 收束输出、观测、失败和清理的分层边界 | 明确 sandbox 只形成执行输出、候选材料、观测 hook、失败分类和清理语义,不直接成为 artifact truth、observability store、runtime execution truth 或业务决策 truth。 | 后续数据、接口、规则和验收章节不出现 sandbox 直接确认 artifact、保存 telemetry store、推进 runtime recover 或重做业务裁决的结论。 |
| 建立旧材料线索的后置审计边界 | 明确旧 README、旧 `00/02/05/06` 中的后端、接口、事件、对象、性能、测试和验收内容只能作为后续审计输入。 | 后续 Step 对 Docker/gVisor/Firecracker、no-egress、resource limits、audit events、kill/replay/cleanup、output capture、P95 和验收门禁逐项重新校准,不得跳过本轮讨论直接写入正式需求。 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| 工具语义执行、ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry | 属于 `L2-tools`;sandbox 只承载隔离执行环境和边界反馈材料。 |
| runtime agent loop、ExecutionInstance、step progression、checkpoint / recover、结果回流 truth | 属于 `L2-runtime`;sandbox 不拥有运行主线、恢复主线或业务结果回流。 |
| MemberExecutionHost、session、worker、health、SandboxBinding 装配结果、host lifecycle、callback material | 属于 `L2-member-service`;sandbox 不管理成员宿主生命周期或宿主绑定 truth。 |
| GlobalMember、actor、role / capability identity lifecycle 和身份正文 | 属于 `L1-identity` 或相关能力定义来源;sandbox 只消费身份锚点或安全引用。 |
| Project、ProjectMember、WorkItem、Iteration、ImplementationPlan / PlanItem 正文和工作事实 | 属于 `L1-work`;sandbox 只消费执行上下文引用。 |
| Artifact 正文、版本、baseline、正式 evidence truth 和制品入库决策 | 属于 `L1-artifact`;sandbox 捕获输出或候选材料,不决定正式 artifact truth。 |
| trace / metric / audit log store、查询、retention、alert storage | 属于 `L4-observability`;sandbox 只提供 observability hook 或可消费材料。 |
| governance / capability / tools 的策略决策、授权审批、allowlist truth 和 policy DSL | 属于 governance / capability / tools 等策略真相源;sandbox 只执行已给定 launch/isolation policy 并 fail closed。 |
| Runner 产品语义、CLI / UI / 一键运行工作流和用户界面状态 | 属于 `L5-runner`、`L5-console` 或上层产品入口;sandbox 只提供运行隔离基础。 |
| 容器、k8s、Docker、gVisor、Firecracker、containerd、runc 等后端产品选型和部署拓扑 | 属于运行期依赖、架构、配置和实施阶段;Step 4 不把具体后端写成目标。 |
| 容器镜像构建、成员镜像资产和运行镜像生命周期 | 属于 `L2-member-images`、member-service 或部署/供应链边界;sandbox 不拥有镜像构建 truth。 |
| 当前性能、容量、可用性、安全指标、测试用例、验收门禁和真实证据路径定稿 | 后置 Step 13 / Step 14 / 05 / 06;当前不伪造 benchmark、evidence alias、run_id 或验收签署。 |
| 具体接口名、API path、event kind、DTO schema、Rust struct、repository、handler、配置 key、commit boundary | 后置 Step 12、01、03、04、07 等设计阶段;需求 Step 4 不定义实现组织。 |
```

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否每个目标都可验证 | pass | 每个目标均给出后续章节追溯式验证方式。 |
| 是否每个非目标都具体且有边界作用 | pass | 非目标表逐项标明相邻仓或后续阶段归属。 |
| 是否没有把功能需求写成目标 | pass | 未写功能编号、用户故事、接口名或操作清单。 |
| 是否没有把实现方案写成目标 | pass | 未把 Docker/gVisor/Firecracker/k8s、目录结构或技术栈写成目标。 |
| 是否没有把 NFR / 验收 / 测试写成目标 | pass | 旧性能数字、安全覆盖率、测试 case 和验收项均后置。 |
| 是否回应 Step 3 的三个问题 | pass | 目标分别回应问题层重建、跨调用方隔离统一、输出/观测/失败/清理分层。 |
| 是否保护 Step 2 相邻仓边界 | pass | 非目标覆盖 tools、runtime、member-service、identity、work、artifact、observability、governance、runner 和 backend。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写 `design-calibration/00_req_step_04_goals_non_goals.md`。 |
| 是否未预生成未来 Step 文件 | pass | 未创建 Step 5~17 文件。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前只写设计中间产物,无实现证据。 |
| 是否允许进入 Step 5 | pass_wait_review | 技术上 Step 4 已完成;按用户要求等待审查确认后再进入 Step 5。 |

next_allowed_action: `wait_user_confirm_step_5`
