# L4-sandbox 00 需求 Step 7: 核心能力闭环

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 6,允许进入 Step 7;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 7 章“核心能力闭环”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 7 核心能力闭环 |
| 输出文件 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| 前置确认 | pass:用户在 Step 6 停审后回复“同意 / 继续 / 是继续”,允许进入 Step 7 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 7;`需求文档书写规范.md` §4.7 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `02-概要设计.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中执行、隔离、输出、失败、清理、验收线索 |
| 已读取参考粒度 | yes:`projects/L1-artifact/design-calibration/00_req_step_07_core_capability_loop.md`;`projects/L1-governance/design-calibration/00_req_step_07_core_capability_loop.md` |
| 历史材料口径 | 旧五段主线、旧功能编号、旧对象名、旧验收项只作差异审计输入,不反推当前核心能力节点 |
| 禁写范围 | 不写用户故事、功能编号、业务规则、数据归属、接口签名、DTO、event payload、API path、port、repository、handler、事务流程、配置 key、后端选型、NFR 指标、测试用例、验收门禁或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_8 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~6、SOP、书写规范、通用规范和旧材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 仓存在必要性、必须共同具备能力、缺失后果、外围增强、边界外能力、旧功能支撑和节点讨论顺序 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 2/4/6 输入诊断、旧 README / 旧 00 / 旧 02 / 旧 05/06 污染诊断、相邻仓串线诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 核心节点数量、节点命名、输出观测是否拆分、失败清理红线是否合并、旧五段主线处理、后续小循环顺序取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 仓存在必要性结论、闭环定义、ASCII 图、能力节点表、节点讨论顺序、停审清单、能力层级表、功能回填映射 | pass | 进入复杂度判断。 |
| 复杂度判断 | done | 是否拆附录、是否纳入旧五段主线、是否触发 blocker、是否可进入 Step 8 判断 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 7 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 7 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 8。 |

---

## 2. 必读摘要

| 文档 | Step 7 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 7 | 本步从仓存在必要性收敛核心能力骨架,输出必要性结论、闭环结论、节点执行 / 讨论顺序、停审清单、外围增强、边界外能力和功能回填映射。 | 不从功能清单、接口、事件链、阶段优先级或实现步骤出发。 |
| `需求文档书写规范.md` §4.7 | 正式第 7 章必须包含闭环定义短文、核心能力闭环 ASCII 图和能力层级划分表;图中节点建议 3~5 个,箭头只表示能力成立逻辑依赖。 | 本 Step 固定 5 个能力节点,并明确图不表达运行时调用、接口时序、事件传播或开发实施顺序。 |
| `设计文档编写通则.md` | Step 7 后续应成为 Step 8~14 的小循环主轴,正式正文只承载收口结论。 | 本文件保留诊断和取舍;正式 `00` 仍等待 Step 17 装配。 |
| `设计文档讨论中间产物规范.md` | 每个 Step 必须独立维护计划、问题回答、诊断、取舍、结构化产物、回填草稿和自检;不得提前创建未来 Step 文件。 | 当前只创建 Step 7 文件,不创建 Step 8~17。 |
| `设计真相源闭环与可落码性标准.md` | 继续任务必须从台账和 Step 文件恢复;后续 schema / state / event / artifact / evidence / phase 必须有唯一真相源。 | Step 7 只定义能力节点,不生成 schema、state、event、evidence 或 implementation boundary。 |
| `全局项目依赖关系与裁剪规则.md` | `L4-sandbox` 编译期依赖 `L0-core`,运行期依赖 isolation backend,按需发布 sandbox 事件,不拥有业务真相。 | 能力闭环要保留 L0-core / isolation backend 强前置和事件协作语境,但不把相邻仓 truth 写成核心节点。 |
| `00_req_step_02_position_boundary.md` | `L4-sandbox` 是平台运行隔离基础仓,负责可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境。 | 核心能力必须覆盖执行环境身份、限制、捕获、观测、失败分类和清理,并排除 tools/runtime/member truth。 |
| `00_req_step_03_problem_context.md` | 三个问题是旧材料混层、执行隔离边界在调用方处分裂、输出/观测/失败/清理语义不可对账。 | 能力闭环必须回应“统一受控执行边界”和“输出/观测/失败/清理分层”。 |
| `00_req_step_04_goals_non_goals.md` | 目标要求覆盖 execution environment identity、resource limits、filesystem/network/process boundary、launch policy enforcement、artifact/output capture、observability hooks、failure classification、lease/cleanup/reaper 和 security redlines。 | 核心节点必须承接这些主题,同时继续排除相邻仓 truth、后端选型和验收指标。 |
| `00_req_step_05_users_roles.md` | 角色包括受控执行请求方、AI member / 自动化执行者、Runner 操作者、安全审查者、运维/SRE、审计者和 reaper。 | Step 7 不把角色表变成能力节点;后续 Step 8 用角色围绕能力节点写故事。 |
| `00_req_step_06_consumers_dependencies.md` | `L0-core` 与 isolation backend 是强前置;`L0-bus` / observability 是可观测 / 审计闭环前置;identity/work/policy 是场景前置;tools/runtime/member-service/runner/artifact/observability 是消费或协作方。 | 核心能力要能解释这些依赖如何支撑闭环,但不能把消费方或外部后端产品画进闭环图。 |
| 旧 `README.md` / 旧 `00-需求文档.md` | 旧材料写 Docker/gVisor、SandboxService、默认无出网、资源限制、审计事件、Runner 复用、F-001~F-009、性能和验收。 | 只保留运行隔离、资源、网络、审计、Runner/Member 复用等主题线索;旧功能编号和指标不继承。 |
| 旧 `02-概要设计.md` | 旧五段主线为执行请求/会话、隔离环境/资源、命令/外部能力、输出/审计、失败/运维控制。 | 五段线索可映射到当前能力节点,但“命令/外部能力桥接”不得扩张为 tool semantic execution 或 provider contract。 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | 旧测试验收强调未授权访问阻断、输出回收、kill/timeout/replay/cleanup 留痕、cleanup 不先删证据。 | 只作为后续规则、NFR、验收候选;当前不写真实测试结果、evidence alias 或验收通过。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 如果没有这个仓,系统会缺什么不可替代的能力或结构? | 平台会缺少一处统一回答“这次真实执行发生在哪个受控环境、由哪个身份 / 工作语境触发、哪些资源 / 文件系统 / 网络 / 进程边界生效、给定策略如何被保守执行、输出和观测材料如何安全带回、失败和清理如何留痕收束”的运行隔离基础。没有它,tools、runtime、member-service、runner 和人工脚本会各自处理隔离,导致策略漂移、绕过风险、宿主污染、输出和审计不可对账。 |
| 这个仓成立必须共同具备哪些能力? | 必须共同具备 5 个能力:受控执行语境能够被识别与约束;隔离环境边界能够被建立并施加限制;给定策略下的执行能够在隔离边界内发生并 fail closed;输出、候选材料和观测材料能够被安全捕获并分层交接;失败、租约、清理和安全红线能够被分类留痕并保守收束。 |
| 哪些能力缺一个,这个仓就不算真正成立? | 缺执行语境,就无法回答执行身份、责任链和工作上下文;缺隔离边界,就只是普通命令执行或后端调用;缺策略内执行,就无法阻断高风险或越权动作;缺捕获交接,就无法把 stdout/stderr/output files/usage/audit material 安全带回且不混成 artifact 或 observability truth;缺失败清理红线,就无法处理 timeout/kill/orphan/cleanup/reaper,甚至可能先删证据或静默放行。 |
| 哪些能力只是外围增强,而不是闭环核心? | 多后端高级优化、Firecracker/gVisor 等强隔离变体、多集群 / 多宿主调度、复杂重放 UI、人工运维控制台、丰富输出预览、容量性能优化、观测 dashboard、长时会话大文件治理和高级策略 DSL 都是外围增强或后续阶段能力,不进入核心闭环图。 |
| 哪些能力根本不属于这个仓? | ToolDefinition/ToolPolicy/ToolInvocationResult truth、runtime ExecutionInstance / agent loop / recover truth、member host lifecycle / SandboxBinding 装配 truth、identity/work/artifact/observability/governance/runner truth、容器平台产品本体、镜像构建、UI/console/chat/bridge 产品流程、DB/object store/OTel/GRC 产品能力都不属于 sandbox 核心能力。 |
| 当前已有或预期功能中,哪些是在支撑这些核心能力? | 旧执行请求 / 会话线索支撑“受控执行语境”;旧资源、文件系统、网络、进程、挂载和配额线索支撑“隔离环境边界”;旧默认无出网、policy、deny、backend 不支持即拒绝线索支撑“策略内执行并 fail closed”;旧 stdout/stderr、输出文件、usage、audit 线索支撑“捕获与分层交接”;旧 timeout、kill、retry、replay、cleanup、orphan、reaper、安全红线线索支撑“失败清理红线”。 |
| 核心能力闭环应拆成哪些能力节点? | 拆成 C-SBX-1 受控执行语境识别与约束、C-SBX-2 隔离环境边界建立与限制施加、C-SBX-3 给定策略内执行与 fail-closed、C-SBX-4 输出与观测材料安全捕获和分层交接、C-SBX-5 失败租约清理与安全红线保守收束。 |
| 这些能力节点应按什么顺序逐个讨论? | 后续 Step 8~14 应按 C-SBX-1 -> C-SBX-2 -> C-SBX-3 -> C-SBX-4 -> C-SBX-5 的顺序进行能力节点小循环。该顺序是需求讨论和逻辑依赖顺序,不是运行时调用、接口时序、事件传播或开发实施顺序。 |
| 每个能力节点完成停审时,必须证明哪些内容已经收敛? | 每个节点停审必须证明:支撑角色目标已映射;外部可见功能已收敛;保护该节点的业务规则已列出;本节点涉及的数据归属 / 引用数据 / 禁止保存正文已明确;接口与依赖只到能力边界不写 DTO;NFR 可判断;验收项能覆盖;没有混入相邻仓 truth、后端选型或实现细节。 |

---

## 4. 当前材料诊断

### 4.1 Step 2 / 4 / 6 输入诊断

| 来源 | 可形成核心能力的线索 | 容易误写成什么 | 当前处理 |
|---|---|---|---|
| Step 2 定位 | 可标识、可限制、可捕获、可观测、可失败分类、可清理的隔离执行环境 | 一串功能列表或后端能力清单 | 收束为 5 个能力节点,每个节点写“能力成立描述”。 |
| Step 4 目标 | execution environment identity、resource limits、FS/network/process、launch policy、capture、observability、failure、lease/cleanup/reaper、security redlines | 把目标逐词拆成 9~10 个节点 | 合并为 5 个共同成立的核心节点,避免过细。 |
| Step 6 依赖 | `L0-core`、isolation backend、`L0-bus`、identity/work/policy、tools/runtime/member-service/runner/artifact/observability | 把依赖方、消费方或事件主干画进闭环图 | 闭环图不出现仓名或外部系统名;依赖关系留在 Step 6 / Step 12。 |
| Step 5 角色 | 请求方、AI member、Runner 操作者、安全审查者、运维、审计、reaper | 把角色顺序当能力闭环 | 角色只作为 Step 8 用户故事输入,不成为能力节点。 |

### 4.2 旧 README / 旧 00 污染诊断

| 旧表达 | 有效线索 | 问题 | Step 7 处理 |
|---|---|---|---|
| Docker + gVisor + Firecracker | sandbox 需要隔离承载和强弱隔离差异 | 后端产品不是核心能力节点 | 统一裁剪为 C-SBX-2 的隔离环境边界成立;具体后端后置 01/04/07。 |
| `SandboxService` / `ExecuteSandboxed` | 需要正式受控执行入口 | 接口名属于 Step 12 / 03 | 不进入闭环图;后续映射到 C-SBX-1 / C-SBX-3 的功能。 |
| 默认无出网 / 白名单 allow | 需要 deny-by-default 和策略执行 | 单条安全规则不是闭环节点 | 映射到 C-SBX-3 / C-SBX-5;规则后置 Step 10。 |
| F-001~F-009 功能清单 | 覆盖执行、后端、网络、资源、审计、Runner 复用等线索 | 功能清单不能直接当闭环 | 仅做功能回填映射,不继承编号。 |
| Docker / gVisor 启动时延、输出回收率、留痕率 | NFR / 验收候选 | 不是 Step 7 能力节点 | 后置 Step 13/14/05/06。 |

### 4.3 旧 02 五段主线诊断

旧 `02-概要设计.md` 的五段主线有价值,但需要重新抽象:

| 旧五段 | 当前可吸收能力线索 | 必须裁剪的旧内容 | 映射节点 |
|---|---|---|---|
| 执行请求与会话建立 | 确定受控执行意图、身份、上下文和责任链 | `SandboxExecution` / `Session` 对象名、会话状态、接口细节 | C-SBX-1 |
| 隔离环境与资源约束 | 建立环境并施加资源、文件系统、网络、进程边界 | 具体 policy 对象、mount schema、quota 字段、后端选择 | C-SBX-2 |
| 命令执行与外部能力接缝 | 在隔离边界内执行给定动作,并按策略拒绝越权 | tool/provider/capability 语义、命令桥接实现、外部能力协议 | C-SBX-3 |
| 输出回收与审计留痕 | 安全捕获输出、候选材料、usage 和观测材料 | artifact truth、observability store、conversation 正文、evidence 真实签署 | C-SBX-4 |
| 失败恢复与运维控制 | timeout/kill/retry/replay/cleanup/orphan/reaper 的保守收束 | runtime recover truth、业务重放决策、运维 UI 和测试验收项 | C-SBX-5 |

### 4.4 旧 05 / 06 测试验收线索诊断

旧测试方案和验收标准反复强调未授权网络 / 路径访问必须阻断、输出不得直接成为 artifact truth、kill / timeout / replay / cleanup 必须留痕、cleanup 不得先删证据。这些都是后续 Step 10 / 13 / 14 / 05 / 06 的强线索,但当前不能把旧测试用例、验收门禁、证据索引或 pass 结论写成 Step 7 核心能力。Step 7 只保留它们作为 C-SBX-3、C-SBX-4、C-SBX-5 必须存在的理由。

### 4.5 相邻仓串线诊断

| 串线风险 | 表现 | 当前防线 |
|---|---|---|
| 与 `L2-tools` 串线 | 把 tool semantic execution、ToolPolicy、ToolInvocationResult 写成 sandbox 能力 | C-SBX-3 只写“给定策略内执行”,策略 truth 和工具结果 truth 外部拥有。 |
| 与 `L2-runtime` 串线 | 把 ExecutionInstance、agent loop、recover/checkpoint 写成 sandbox 能力 | C-SBX-5 只写隔离层失败和清理,不推进 runtime 主线。 |
| 与 `L2-member-service` 串线 | 把 SandboxBinding、host health、member lifecycle 写成 sandbox 能力 | C-SBX-1 / 2 只识别执行环境语境和隔离边界,装配 truth 外部拥有。 |
| 与 `L1-artifact` 串线 | 把输出捕获写成正式 Artifact 入库或 evidence truth | C-SBX-4 只捕获候选材料和来源语境,不决定 artifact truth。 |
| 与 `L4-observability` 串线 | 把审计 / metric / trace 存储写成 sandbox 能力 | C-SBX-4 只提供 hook / material,不成为 store。 |
| 与 governance / capability 串线 | 把 policy decision、allowlist truth、capability registry 写成 sandbox 能力 | C-SBX-3 执行已给定 policy 并 fail closed,不产生策略决策。 |
| 与后端产品串线 | 把 Docker/gVisor/Firecracker/k8s 写成能力节点 | C-SBX-2 只写抽象隔离边界成立,后端选型后置。 |

---

## 5. 设计取舍

### 5.1 核心节点数量取舍

| 方案 | 内容 | 优点 | 问题 | 决策 |
|---|---|---|---|---|
| 方案 A | 按 Step 4 主轴拆成 9 个节点:identity、limits、FS、network、process、policy、capture、observability、cleanup | 覆盖完整 | 超过 5 个,会把规则和功能碎片化成闭环 | 不采用。 |
| 方案 B | 沿用旧 02 五段主线 | 接近历史材料,覆盖执行到清理 | 旧“命令 / 外部能力接缝”容易混入 tools/provider semantics | 部分采用并重命名。 |
| 方案 C | 收束为 5 个能力成立节点:语境、边界、策略内执行、捕获交接、失败清理红线 | 对齐 Step 7 粒度,能驱动 Step 8~14 小循环 | 后续必须在 Step 9~14 展开细节 | 采用。 |
| 方案 D | 只写“建立隔离环境、执行、回收”3 个节点 | 简洁 | 漏掉身份语境、策略 fail closed、失败清理红线 | 不采用。 |

### 5.2 节点命名取舍

核心节点必须写成“能力成立描述”,不能写成 API 或组件名。因此不采用 `CreateSandboxSession`、`ApplyIsolationPolicy`、`ExecuteCommand`、`CaptureOutput`、`CleanupSession` 这类实现动作,也不采用 `SandboxService`、`IsolationBackend`、`AuditPublisher` 等组件名。当前采用 “能够被识别与约束 / 能够被建立并施加限制 / 能够在给定策略下受控发生 / 能够被安全捕获并分层交接 / 能够被分类留痕并保守收束” 的能力描述。

### 5.3 输出和观测是否拆成两个节点

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 输出捕获与观测 hook 分成两个核心节点 | 节点数变 6,且容易让 observability store truth 混入 sandbox | 不采用。 |
| 方案 B | 合并为“输出、候选材料和观测材料安全捕获并分层交接” | 强调 capture 和 handoff 的统一边界,同时排除 artifact / observability truth | 采用。 |

### 5.4 失败、清理和安全红线是否合并

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 失败分类、租约清理、reaper、安全红线分开 | 细节完整但过多,且很多是规则 / NFR / 验收事项 | 不采用。 |
| 方案 B | 合并为“失败、租约、清理和安全红线保守收束” | 保留非 happy path 的核心性,后续 Step 10/13/14 再展开 | 采用。 |

### 5.5 旧五段主线处理取舍

旧五段主线不能原样继承,因为它来自旧概要设计并夹带对象、流程、测试和接口想象。但它作为 historical_material 的主题分布比较完整。当前取舍是:

- 保留“执行语境 / 隔离边界 / 执行落地 / 输出审计 / 失败清理”的主题覆盖。
- 重命名为能力成立描述,避免继承旧对象和实现动作。
- 把“命令 / 外部能力接缝”收窄为“给定策略内执行并 fail closed”,防止 tools semantic execution、provider bridge 或 capability registry 混入 sandbox。
- 把“输出审计”收窄为“材料捕获和分层交接”,防止 artifact truth 和 observability store 混入 sandbox。

### 5.6 后续能力小循环顺序取舍

Step 8~14 需要围绕能力节点逐个收敛故事、功能、规则、数据、接口、NFR 和验收。当前顺序采用 C-SBX-1 -> C-SBX-2 -> C-SBX-3 -> C-SBX-4 -> C-SBX-5,原因是:

1. 没有执行语境,无法判断隔离边界绑定到哪个 actor / work / policy / trace 责任链。
2. 没有隔离边界,执行就没有资源、文件系统、网络、进程边界承载。
3. 没有策略内执行,隔离环境仍可能被绕过或静默放行。
4. 没有捕获和交接,执行结果无法安全回到 artifact、observability、runtime 或 runner 语境。
5. 没有失败清理红线,非 happy path 会破坏证据、审计和安全保守性。

该顺序仅是逻辑依赖和需求讨论顺序,不是 API 调用、事件传播、事务流程或开发实施顺序。

---

## 6. 结构化中间产物

### 6.1 仓存在必要性结论

`L4-sandbox` 的不可替代能力不是“能跑命令”或“有一个容器后端”,而是为平台内所有真实代码、工具、构建、测试和 Runner 应用执行提供统一的运行隔离基础。它必须让一次受控执行在需求层同时具备可识别的执行语境、可施加的隔离边界、给定策略下的保守执行、可分层交接的输出和观测材料、以及可分类留痕的失败清理红线。没有这条能力闭环,隔离逻辑会散落到 tools、runtime、member-service、runner、artifact、observability 或人工脚本中,平台无法稳定解释风险、责任、输出、失败和清理边界。

### 6.2 核心能力闭环定义

`L4-sandbox` 的核心能力闭环是:受控执行意图必须先被收束为可识别、可引用、可约束的执行环境语境;在该语境下,隔离环境边界必须能够建立并施加资源、文件系统、网络和进程限制;给定的 launch / isolation policy 必须只能在该隔离边界内受控发生,并在缺失、越权或不可落实时 fail closed;执行产生的输出、候选材料和观测材料必须被安全捕获并分层交接;最后,失败、租约、清理、reaper 和安全红线必须被分类留痕并以保守方式收束。只要其中任何一环缺失,sandbox 就会退化成普通执行器、后端封装、审计日志、artifact 候选生成器或运维脚本集合。

### 6.3 核心能力闭环图

```text
受控执行语境能够被识别与约束
  -> 隔离环境边界能够被建立并施加限制
  -> 给定策略下的执行能够在隔离边界内受控发生并 fail closed
  -> 输出、候选材料和观测材料能够被安全捕获并分层交接
  -> 失败、租约、清理和安全红线能够被分类留痕并保守收束
```

图示说明:

- 本图只表达核心能力成立的逻辑依赖关系。
- 本图不表达运行时调用顺序、接口时序、事件传播顺序、事务流程、开发实施步骤或后端选择。
- 图中节点只写能力成立描述,不写接口名、事件名、对象字段、数据库动作、配置 key 或实现组件名。
- 外围增强能力和边界外能力不进入本图。

### 6.4 核心能力节点表

| 节点 ID | 能力节点 | 能力成立描述 | 缺失后果 |
|---|---|---|---|
| C-SBX-1 | 受控执行语境识别与约束 | 需要受控执行的代码、工具、构建、测试或 Runner 应用能够被绑定到执行环境身份、actor/member anchor、project/work/context refs、policy/context refs、trace / responsibility 语境和最低拒绝条件。 | 执行无法被归责、追溯或约束,调用方会用各自上下文拼接执行语境,identity/work/runtime/member truth 容易混入 sandbox。 |
| C-SBX-2 | 隔离环境边界建立与限制施加 | 隔离环境能够在抽象 isolation backend 上建立,并施加资源、文件系统、网络、进程、工作区、挂载和生命周期边界;后端不支持或限制不可落实时不能 silent ignore。 | sandbox 退化成普通命令执行或后端调用,资源和 FS/network/process 约束不一致,宿主污染与策略绕过风险无法收束。 |
| C-SBX-3 | 给定策略内执行与 fail-closed | 执行动作只能在已建立边界和给定 launch/isolation policy 下发生;策略缺失、不可解析、越权、后端能力不足或安全红线冲突时必须拒绝、降级或标记缺失,不得自行裁决 policy truth。 | tools/runtime/member/runner 可能绕过隔离或由 sandbox 私自裁决策略,危险动作被静默放行,governance/capability/tools policy truth 被反向吞并。 |
| C-SBX-4 | 输出与观测材料安全捕获和分层交接 | stdout/stderr、输出文件、候选材料、资源使用摘要、diagnostic、audit / trace / metric material 等能够被安全捕获、保留来源语境并分层交接给 artifact、observability、runtime、runner 等消费方。 | 输出可能丢失、被误当正式 artifact truth、被 observability store 反写、或在 cleanup 前被删除;相邻仓无法稳定消费隔离层材料。 |
| C-SBX-5 | 失败租约清理与安全红线保守收束 | timeout、kill、cancel、backend failure、policy deny、capture failure、orphan environment、lease expiry、cleanup、reaper 和 sandbox escape / redline 事件能够被分类、留痕并以保守方式收束。 | 非 happy path 会破坏证据、静默吞错、错误地触发 runtime recover 或业务重放,cleanup 可能先删仍需审计 / replay 的材料。 |

### 6.5 核心能力节点讨论顺序

| 顺序 | 节点 | 后续 Step 8~14 小循环停审要求 |
|---:|---|---|
| 1 | C-SBX-1 受控执行语境识别与约束 | 角色故事、功能、规则、数据、接口、NFR 和验收必须证明执行语境不由 sandbox 补造上游 truth,且缺上下文时有拒绝 / 降级口径。 |
| 2 | C-SBX-2 隔离环境边界建立与限制施加 | 必须证明资源、FS、network、process 和生命周期边界是 sandbox 核心职责,但具体后端产品、配置 key 和部署拓扑后置。 |
| 3 | C-SBX-3 给定策略内执行与 fail-closed | 必须证明 sandbox 只执行给定策略并 fail closed,不拥有 tools/governance/capability policy decision truth。 |
| 4 | C-SBX-4 输出与观测材料安全捕获和分层交接 | 必须证明输出 / 观测材料与 artifact truth、observability store、runtime result truth 分层,并定义缺失 / 部分捕获的需求口径。 |
| 5 | C-SBX-5 失败租约清理与安全红线保守收束 | 必须证明失败分类、lease、cleanup、reaper 和 redline 不破坏证据,且不推进 runtime recover、business decision 或 artifact 入库。 |

该顺序只用于后续需求小循环讨论和逻辑依赖审查,不表示运行时调用顺序、接口时序、事件传播顺序、测试执行顺序或实施阶段顺序。

### 6.6 能力节点停审清单

每个能力节点进入下一节点前,必须完成以下停审项:

| 停审项 | 通过标准 |
|---|---|
| 角色目标映射 | 已说明哪些 Step 5 角色目标支撑该能力,哪些角色只消费该能力材料。 |
| 用户故事映射 | Step 8 中该节点的用户故事能回指 C-SBX 节点或明确标为外围增强 / 边界外。 |
| 功能需求映射 | Step 9 中该节点功能只写外部可见行为,不写 handler、port、DTO、后端或对象字段。 |
| 规则边界映射 | Step 10 中该节点至少覆盖本节点的 fail closed、禁止补造 truth、禁止 silent ignore 或禁止清理证据等规则。 |
| 数据归属映射 | Step 11 中该节点区分 sandbox truth、引用数据、快照 / 材料和禁止保存正文。 |
| 接口依赖映射 | Step 12 中该节点只定义能力边界和依赖语义,不提前写协议字段、event payload 或 API path。 |
| 非功能映射 | Step 13 中该节点 NFR 可判断,且不继承旧 benchmark 或验收数字为当前结论。 |
| 验收映射 | Step 14 中该节点有核心能力闭环验收或一票否决项承接。 |
| 边界串线检查 | 未把 tools/runtime/member/identity/work/artifact/observability/governance/runner truth 或后端产品选型写成本节点内部 truth。 |

### 6.7 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | C-SBX-1 受控执行语境识别与约束;C-SBX-2 隔离环境边界建立与限制施加;C-SBX-3 给定策略内执行与 fail-closed;C-SBX-4 输出与观测材料安全捕获和分层交接;C-SBX-5 失败租约清理与安全红线保守收束 |
| 外围增强能力 | Docker/gVisor/Firecracker 等多后端优化和强隔离变体;多集群 / 多宿主调度;高级 replay / inspect / operator console;长时会话和大体积输出治理优化;丰富输出预览与分析;观测 dashboard 和告警策略;高级 policy DSL / policy simulation;容量、性能、冷启动和资源成本优化 |
| 边界外能力 | ToolDefinition / ToolPolicy / ToolInvocationResult / ToolAuditEntry truth;ExecutionInstance / agent loop / checkpoint / recover / result backflow truth;MemberExecutionHost / SandboxBinding / host lifecycle truth;GlobalMember / actor lifecycle truth;Project / WorkItem / ImplementationPlan truth;Artifact 正文 / baseline / evidence truth;observability store / trace query / metric retention truth;governance / capability policy decision truth;RunnerRun / output preview / UI/CLI product flow;container/k8s/isolation backend 产品本体;镜像构建;DB/object store/OTel/GRC 产品能力 |

### 6.8 旧功能 / 线索回填映射

| 旧功能 / 线索 | 映射节点 | 当前处理 |
|---|---|---|
| `SandboxService`、`ExecuteSandboxed`、执行请求 / 会话建立 | C-SBX-1 / C-SBX-3 | 作为受控执行语境和策略内执行的功能候选;接口名后置 Step 12 / 03。 |
| Docker / gVisor / Firecracker / containerd / runc | C-SBX-2 或外围增强 | 只保留抽象隔离承载;具体后端选型、fallback 和配置后置。 |
| CPU / memory / disk / timeout / process count / mount / path / network | C-SBX-2 / C-SBX-3 | 作为边界限制和策略执行候选;具体规则和阈值后置 Step 10 / 13 / 14。 |
| 默认无出网、网络白名单、未授权路径访问阻断 | C-SBX-3 / C-SBX-5 | 作为 fail-closed 和安全红线候选;不在 Step 7 写验收数字。 |
| stdout / stderr / output files / usage snapshot / audit event | C-SBX-4 | 作为捕获和分层交接候选;不得直接写成 artifact truth 或 observability store。 |
| SandboxInvoked / SandboxExited / SandboxEscapeDetected | C-SBX-4 / C-SBX-5 | 只保留事件材料主题;事件名、payload、topic 后置 Step 12 / 01 / 03。 |
| timeout / kill / retry / replay / cleanup / orphan session / reaper | C-SBX-5 | 作为失败和清理能力候选;不得写成 runtime recover 或业务重放 truth。 |
| Runner 与 Member 共用接口 | C-SBX-1~C-SBX-5 横向约束 | 保留“统一受控执行边界”目标;不继承共享 trait 或 API 形态。 |
| 启动时延、输出回收率、留痕率、未授权访问成功率 | 外围增强 / NFR / 验收候选 | 后置 Step 13 / 14 / 05 / 06;当前不作为已确认指标。 |

### 6.9 后续 Step 保护线

| 后续 Step | Step 7 提供的保护 | 不允许进入的内容 |
|---|---|---|
| Step 8 用户故事 | 每条故事必须回指 C-SBX-1~5 或标为外围增强 / 边界外。 | 不按角色随意铺故事,不把旧故事直接继承。 |
| Step 9 功能需求 | 功能按能力节点组织,核心节点优先,外围增强不得压过闭环核心。 | 不写 API path、DTO、handler、backend adapter 或旧功能编号。 |
| Step 10 业务规则与边界约束 | 规则优先保护 C-SBX-1~5 的成立,特别是 fail closed、禁止补造 truth、禁止 silent ignore、cleanup 不先删证据。 | 不写实现策略引擎、配置 key 或测试 case。 |
| Step 11 数据需求与数据归属 | 数据归属必须围绕 5 个节点区分 sandbox truth、引用数据、材料和禁止保存正文。 | 不把 ToolPolicy、ExecutionInstance、SandboxBinding、Artifact、telemetry store 写成 sandbox truth。 |
| Step 12 接口与依赖 | 接口按能力边界描述与相邻仓协作,不滑入协议字段。 | 不写 trait、RPC、event payload、topic、DTO schema。 |
| Step 13 非功能需求 | NFR 从核心节点和安全红线推导,重新审查旧性能 / 安全数字。 | 不继承旧 README benchmark 或验收结果。 |
| Step 14 验收标准 | 验收覆盖每个 C-SBX 节点和一票否决项。 | 不伪造 evidence alias、run_id、测试结果或验收签署。 |
| Step 15~16 | 风险和追溯检查孤儿能力、旧材料污染和相邻仓串线。 | 不把待确认项伪装成已定结论。 |

---

## 7. 复杂度判断

| 判断项 | 结论 | 说明 |
|---|---|---|
| 是否需要拆分附录 | no | Step 7 表格和 ASCII 图足以承载核心能力闭环;旧功能映射表不需要独立附录。 |
| 是否纳入旧五段主线 | yes_as_historical_mapping | 旧五段主线主题完整,但只映射到当前能力节点,不继承对象、流程、接口或验收。 |
| 是否需要能力 ASCII 图 | yes | 书写规范 §4.7 要求核心能力闭环图,且后续 Step 8~14 需要结构锚点。 |
| 是否纳入具体后端产品 | no | 具体 Docker/gVisor/Firecracker/containerd/runc/k8s 是架构、配置、实施或 NFR / 验收候选。 |
| 是否触发正式文档写入 | no | Step 17 前不回填正式 `00-需求文档.md`。 |
| 是否触发上游 blocker | no | 当前未发现阻塞 Step 7 的上游冲突;旧材料冲突已作为 historical_material 处理。 |
| 是否允许进入 Step 8 | pass_wait_review | 技术上 Step 7 已完成;按用户规则等待审查确认后再进入 Step 8。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到第 7 章。正式回填前仍必须确认项目级、文档级和 Step 级门禁通过。

````md
## 7. 核心能力闭环

> 校准来源：
> - `design-calibration/00_req_step_07_core_capability_loop.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前材料诊断”和“设计取舍”小节，了解本章如何从仓存在必要性、上游 Step 边界和旧材料审计中收敛为当前核心能力闭环。

`L4-sandbox` 的核心能力闭环是:受控执行意图必须先被收束为可识别、可引用、可约束的执行环境语境;在该语境下,隔离环境边界必须能够建立并施加资源、文件系统、网络和进程限制;给定的 launch / isolation policy 必须只能在该隔离边界内受控发生,并在缺失、越权或不可落实时 fail closed;执行产生的输出、候选材料和观测材料必须被安全捕获并分层交接;最后,失败、租约、清理、reaper 和安全红线必须被分类留痕并以保守方式收束。只要其中任何一环缺失,sandbox 就会退化成普通执行器、后端封装、审计日志、artifact 候选生成器或运维脚本集合。

```text
受控执行语境能够被识别与约束
  -> 隔离环境边界能够被建立并施加限制
  -> 给定策略下的执行能够在隔离边界内受控发生并 fail closed
  -> 输出、候选材料和观测材料能够被安全捕获并分层交接
  -> 失败、租约、清理和安全红线能够被分类留痕并保守收束
```

本图只表达能力成立的逻辑依赖关系,不表达运行时调用顺序、接口时序、事件传播顺序、开发实施步骤或后端选择。图中节点只写能力成立描述,不写接口名、事件名、对象字段、数据库动作、配置 key 或实现组件名。

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 受控执行语境识别与约束;隔离环境边界建立与限制施加;给定策略内执行与 fail-closed;输出与观测材料安全捕获和分层交接;失败租约清理与安全红线保守收束 |
| 外围增强能力 | Docker/gVisor/Firecracker 等多后端优化和强隔离变体;多集群 / 多宿主调度;高级 replay / inspect / operator console;长时会话和大体积输出治理优化;丰富输出预览与分析;观测 dashboard 和告警策略;高级 policy DSL / policy simulation;容量、性能、冷启动和资源成本优化 |
| 边界外能力 | ToolDefinition / ToolPolicy / ToolInvocationResult / ToolAuditEntry truth;ExecutionInstance / agent loop / checkpoint / recover / result backflow truth;MemberExecutionHost / SandboxBinding / host lifecycle truth;GlobalMember / actor lifecycle truth;Project / WorkItem / ImplementationPlan truth;Artifact 正文 / baseline / evidence truth;observability store / trace query / metric retention truth;governance / capability policy decision truth;RunnerRun / output preview / UI/CLI product flow;container/k8s/isolation backend 产品本体;镜像构建;DB/object store/OTel/GRC 产品能力 |

后续用户故事、功能需求、业务规则、数据归属、接口依赖、非功能需求和验收标准必须围绕上述五个核心能力节点逐个收束。不能映射到这些节点的内容,必须标为外围增强、边界外能力或待确认项。
````

---

## 9. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否说明仓存在必要性 | pass | 已说明 sandbox 不可替代能力是统一运行隔离基础,不是“能跑命令”或容器后端。 |
| 是否定义 1 条核心能力闭环 | pass | 已定义由 C-SBX-1~5 组成的单条闭环。 |
| 是否控制节点数量在 3~5 个 | pass | 当前为 5 个节点。 |
| 是否提供 ASCII 图 | pass | 已提供核心能力闭环图,并说明箭头语义。 |
| 是否区分核心、外围增强和边界外能力 | pass | 已形成能力层级划分表。 |
| 是否定义节点讨论顺序 | pass | 已定义 C-SBX-1 -> C-SBX-5 的后续需求小循环顺序。 |
| 是否提供能力节点停审清单 | pass | 已列角色、故事、功能、规则、数据、接口、NFR、验收和串线检查。 |
| 是否完成旧功能回填映射 | pass | 已把旧 README、旧 00、旧 02、旧 05/06 线索映射到核心、外围或后置候选。 |
| 是否避免把功能清单当闭环 | pass | 旧 F 编号、接口名、测试项和验收项未进入闭环图。 |
| 是否避免把接口 / 事件 / 调用链当闭环 | pass | 未写 API path、DTO、event payload、topic、trait 或调用时序。 |
| 是否避免把后端产品当闭环 | pass | Docker/gVisor/Firecracker 等仅作为外围增强或后续架构配置候选。 |
| 是否避免相邻仓 truth 串线 | pass | 明确排除 tools/runtime/member/identity/work/artifact/observability/governance/runner truth。 |
| 是否未写正式 `00-需求文档.md` | pass | 当前只写中间产物。 |
| 是否未创建未来 Step 文件 | pass | 当前未创建 Step 8~17 文件。 |
| 是否未伪造 evidence / run_id / commit / 验收签署 | pass | 当前没有创建任何实现、测试或验收证据。 |
| 是否允许进入 Step 8 | pass_wait_review | 技术上 Step 7 已完成;按用户要求等待审查确认后再进入 Step 8。 |

next_allowed_action: `wait_user_confirm_step_8`
