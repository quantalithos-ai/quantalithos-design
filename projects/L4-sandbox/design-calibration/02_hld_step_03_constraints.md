# Step 3. 收稳约束条件

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 3
> 回填章节: `02-概要设计.md` §3 约束条件
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 只提炼会直接影响代码主体、主要组成部分、关键对象、接口骨架、处理流和状态机判断的结构性约束;不复述完整架构,不提前写实现策略、schema、配置项、测试或实施边界。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 3 | 是。用户在 Step 2 审查点后回复“同意”。 |
| 项目级台账是否允许进入 Step 3 | 是。`project_execution_ledger.md` 记录 Step 2 已完成并等待用户确认,用户确认后允许进入 Step 3。 |
| 文档级 flow 是否允许进入 Step 3 | 是。`02_hld_calibration_flow.md` 记录 Step 3 等待 Step 2 用户确认。 |
| 是否已读取 Step 1 / Step 2 中间产物 | 是。Step 1 提供上游边界,Step 2 提供目标、范围和深度口径。 |
| 是否已读取概要 SOP Step 3 | 是。Step 3 只收稳影响概要结构判断的硬约束。 |
| 是否已读取概要书写规范 §4.3 | 是。正式 §3 应输出 `约束 / 作用范围 / 当前要求` 表和一段边界说明短文。 |
| 是否发现阻塞 Step 3 的上游 blocker | 否。旧 README / 旧 `02` 仍为 historical material;`04/07` 缺失仍为下游缺口,不阻塞当前 Step。 |

---

## 2. 本步目标

从 Step 1 已确认的上游承接边界和 Step 2 已确认的概要设计目标 / 非范围 / 深度口径中,提炼会直接影响后续代码主体框架、主要组成部分、关键对象、API / 接口骨架、关键处理流和状态定义的结构性约束。

本步不是把 `00-需求文档.md`、`01-架构设计.md` 的约束章节重新抄一遍,而是把其中会改变概要设计结构判断的内容转译为后续 Step 4~13 必须持续使用的门禁。具体对象名、接口名、处理流名、状态集合和配置影响仍留给后续对应 Step。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游关系映射、本文不再回答、本文必须回答和历史材料隔离口径。 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供设计目标、非范围、当前概要深度和交付给详细设计的结果范围。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、FR / BR / AC / VF、数据归属、接口依赖、NFR、风险和一票否决红线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供 execution isolation truth、核心 / 支撑子域、运行承载、依赖方向、数据所有权、一致性、通信方式、机制级选择和风险挂起项。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 3 | 约束本 Step 只输出影响结构设计判断的约束条件表。 |
| `standards/document/概要设计书写规范.md` | 已读取 §4.3 | 约束正式 §3 表格列、短文粒度和禁止事项。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 约束 Step 文件必须记录问题回答、诊断、取舍、结构化产物、回填草稿和自检。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束后续设计真相源唯一、恢复台账和可落码闭环。 |
| `projects/L1-artifact/design-calibration/02_hld_step_03_constraints.md` | 已读取 | 参考 Step 3 如何从 truth / derived / path 分层转译为结构约束。 |
| `projects/L1-governance/design-calibration/02_hld_step_03_constraints.md` | 已读取 | 参考 Step 3 如何将相邻仓边界和配置不可越界写成后续门禁。 |
| 旧 `projects/L4-sandbox/README.md` | historical_material | 用于识别 Docker/gVisor、SandboxService、旧事件、目录、profile 和旧性能指标回流风险。 |
| 旧 `projects/L4-sandbox/02-概要设计.md` | historical_material | 用于识别旧对象词、旧五段主线、retry / replay 和旧约束回流风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`02` flow、Step 1、Step 2、概要 SOP Step 3 和书写规范 §4.3。 | done | 确认 Step 3 输出必须是结构性约束,不是架构复述。 |
| 2 | 回读正式 `00/01` 中数据归属、依赖裁剪、一票否决、不可变约束、子域、运行承载、通信方式和风险挂起项。 | done | 提取会影响后续代码主体、对象、接口、flow 和状态的约束线索。 |
| 3 | 对照 L1 样例判断约束粒度。 | done | 采用 `约束 / 作用范围 / 当前要求` 表,并增加后续章节门禁表。 |
| 4 | 诊断旧 README / 旧 `02` 的回流风险。 | done | 确认旧后端、旧对象、旧指标、旧事件和旧目录不进入当前约束结论。 |
| 5 | 回答 Step 3 五个 SOP 问题。 | done | 明确约束来源、串线边界、排除项和后续判断作用。 |
| 6 | 输出约束边界说明、约束清单表和后续章节门禁表。 | done | 满足正式 §3 回填输入要求。 |
| 7 | 更新 `02_hld_calibration_flow.md` 和项目台账,并停在用户审查点。 | done | 不创建 Step 4 文件,不修改正式 `02-概要设计.md`。 |

---

## 5. SOP 问题回答

### 5.1 哪些约束会直接影响本仓对象、接口、处理流或状态机设计?

会直接影响后续概要设计判断的约束包括:

- `L4-sandbox` 只能围绕独立 execution isolation truth 展开,后续对象和状态必须承接受控执行语境、execution environment identity、coherent boundary、policy execution decision、capture / handoff、failure / control、cleanup guard、lease / orphan / reaper 和 redline containment,不能把 tools、runtime、member-service、artifact、observability 或 policy source 的 truth 吸进来。
- 正式受控执行入口必须先于真实执行成立,后续接口和处理流不能把宿主直跑、调用方本地执行、旁路执行、匿名执行或 test-only 承载写成正式受控执行。
- resource / filesystem / network / process / workspace / mount 边界必须作为一组 coherent boundary 成立,后续对象和 flow 不能把某类限制缺失、不可验证或后端不支持的情况写成 established success。
- sandbox 只执行给定 launch / isolation policy 与 authorization / capability 摘要,形成本仓 policy execution decision;后续对象、接口和状态不得生成 allowlist truth、approval truth、policy definition truth、capability truth 或 policy DSL truth。
- capture fact、candidate material、observability material 和 handoff fact 必须分层,后续对象和接口不能让 candidate material 静默升级为 formal artifact、baseline、evidence、ToolInvocationResult、runtime result 或 observability store truth。
- failure classification、control fact、lease / orphan、cleanup guard、reaper 和 redline containment 是核心闭环的一部分,后续 flow 和状态不能把 timeout、deny、kill、capture failure、cleanup、orphan 或 redline 当作调用方私有补偿。
- 数据必须保持 truth / snapshot / reference / derived / forbidden body 分层,外部正文不能因为排障、预览、审计、性能或 replay 便利进入 sandbox truth。
- 同步 / 异步 / 后台三类路径必须分离:同步只承接受理、裁定、读取和控制意图;异步承接已成立事实传播和 handoff;后台承接长时执行、capture 准备、cleanup / reaper、redline 和派生维护。
- `L0-core` 是唯一编译期依赖;后续代码主体和接口骨架不能把 sibling 仓、SDK、backend 产品、policy 来源或观测 / artifact 存储写成源码依赖。
- query、inspect、preview、replay、operator control、backend comparison、trend、dashboard 和外围增强只能只读派生或受控调查辅助,不得成为核心 truth mutation path。
- 后端产品、DB、object store、OTel、secrets、GRC、seccomp / AppArmor / cap-drop、SLO 和旧性能数字仍未产品级闭口,后续概要约束不能把它们写成结构事实或验收结果。
- 当前 `02` 只能停在可实现结构骨架,可点名主语、对象、接口、flow 和状态轮廓,但不能提前写完整 Rust struct、DTO / event schema、DDL、repository、配置 key、测试用例或实施 boundary。

### 5.2 哪些约束来自需求文档,哪些约束来自架构设计或全局设计?

| 来源 | 约束来源内容 | 本步提炼结果 |
|---|---|---|
| `00-需求文档.md` §2 / §4 / §7 | 仓定位、非目标、C-SBX-1~5 核心闭环。 | 概要结构必须围绕受控执行语境、隔离边界、policy、capture / handoff、failure / cleanup / redline 展开。 |
| `00-需求文档.md` §10 | BR-SBX-001~033,覆盖受理、边界、policy、capture、failure、cleanup 和 redline。 | 后续对象、接口、flow 和状态必须显式表达拒绝、fail-closed、handoff、cleanup guard 和 redline,不得隐式成功。 |
| `00-需求文档.md` §11 | execution isolation truth、snapshot、refs、forbidden body。 | 后续关键对象必须持续区分 truth、snapshot、reference、derived material 和 forbidden body。 |
| `00-需求文档.md` §12 | 能力接口面和依赖裁剪。 | 后续 API / 接口骨架必须按变更、查询、事件输出、后台任务和外部 port 区分,且不引入非 core 编译期依赖。 |
| `00-需求文档.md` §13 / §14 | NFR、AC-SBX-001~041、VF-SBX-001~010。 | 宿主直跑、边界 silent degrade、policy continue、material 升格、cleanup 先删证据、orphan / redline 脱管和第二套语义必须作为概要结构红线。 |
| `01-架构设计.md` §3 / §4 / §5 | 不可变约束、职责边界、系统上下文。 | 概要不重新定义 sandbox truth center 和相邻仓边界,只把它们映射为结构骨架。 |
| `01-架构设计.md` §6 / §7 | 核心 / 支撑子域、运行承载角色。 | Step 4~5 必须从这些语义结构和运行角色映射代码主体、主要组成部分和接缝。 |
| `01-架构设计.md` §8 / §9 | 依赖方向、数据所有权、一致性策略。 | 后续对象和接口必须保持依赖倒置、truth / material / refs 分层、核心强一致与外围最终一致。 |
| `01-架构设计.md` §10 / §13 | 关键交互、通信方式、横切关注点。 | 后续 flow 和状态必须区分同步 / 异步 / 后台,并保留安全、审计、可观测、韧性和配置不可越界。 |
| `01-架构设计.md` §15 / §17 | 风险、待确认、ADR 候选。 | 未闭口项只能作为待确认或后续承接,不得在概要中伪装成已评审 ADR、产品选型或测试结果。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 编译期依赖与 sibling 裁剪纪律。 | 后续代码主体和接口只能通过 runtime、event、refs、snapshot、safe summary、handoff 或 infrastructure boundary 连接外部仓。 |

### 5.3 哪些边界如果不先写清,后续最容易串到相邻仓或详细设计?

最容易串线的边界包括:

- execution environment identity 与 `L1-identity` / `L1-work` 正文 truth 的边界。若不写清,后续对象会把 actor、member、project、work 或 runner 正文保存进 sandbox。
- sandbox execution isolation truth 与 `L2-runtime` ExecutionInstance / recover truth 的边界。若不写清,后续 flow 会把 sandbox failure / cleanup 当作 runtime 结果回流或 checkpoint 恢复。
- sandbox bind / execute 材料与 `L2-member-service` SandboxBinding / MemberExecutionHost truth 的边界。若不写清,后续对象会接管 member host lifecycle。
- given policy execution 与 policy definition / approval / allowlist / capability truth 的边界。若不写清,后续接口会把 policy 来源和 policy 执行裁定混为一体。
- candidate material / observability material 与 Artifact / evidence / baseline / observability store truth 的边界。若不写清,后续 capture 对象、handoff flow 和状态机会让材料静默升格。
- backend capability summary 与 Docker / gVisor / Firecracker / k8s / host / cluster 正文和产品生命周期的边界。若不写清,后续代码主体会被后端产品反向拆分。
- cleanup / reaper / redline containment 与 runtime recover、artifact retention、investigation lifecycle 和 operator UI 的边界。若不写清,后续非 happy path 会被调用方或运维私有兜底。
- inspect / preview / replay / operator control / trend 与核心 truth 写路径的边界。若不写清,外围增强会变成隐藏写源。
- 概要结构骨架与详细设计实现契约的边界。若不写清,Step 4~9 会提前膨胀为完整 struct、DTO、schema、repository、配置和测试。

### 5.4 哪些约束只是泛化工程原则,不应进入本章?

以下内容不进入本章约束条件:

- “代码清晰”“模块解耦”“高性能”“高可用”“易测试”等泛化工程口号。
- 具体 Docker/gVisor/Firecracker/k8s 组合、seccomp / AppArmor profile、cap-drop 清单、网络白名单粒度和生产 / 测试 profile。
- 具体数据库、对象存储、缓存、消息、OTel、secrets、GRC、audit store 和部署拓扑。
- 完整 Rust module layout、crate 名、trait 签名、repository 方法、函数调用链和事务模型。
- 具体 API path、RPC / SDK 方法、DTO schema、event payload、topic、outbox、retry、worker 和错误码。
- 具体测试矩阵、测试用例、覆盖率、benchmark、evidence alias、run_id 和验收签署。
- phase、commit boundary、implementation ledger、planned boundary skeleton 和实施 gate。

### 5.5 每条约束是否能指导后续章节的设计判断?

本步保留的约束都必须能回答至少一个后续设计判断:

- Step 4 用它判断代码主体框架是否围绕 execution isolation truth、核心 / 支撑子域、运行承载和依赖角色展开。
- Step 5 用它判断主要组成部分是否越权承接 tools、runtime、member-service、artifact、observability、policy source 或 backend product 职责。
- Step 6 用它判断关键对象属于 truth、snapshot、reference、derived material、handoff fact、control fact、cleanup guard 还是 forbidden body。
- Step 7 用它判断接口属于 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 或 external port,以及是否越过依赖裁剪。
- Step 8 用它判断处理流是否混淆同步裁定、异步 handoff、后台 cleanup / reaper、外部调查和只读派生。
- Step 9 用它判断状态主语是否覆盖 identity、boundary、policy、capture、handoff、failure、control、lease、cleanup、redline 和派生状态,且没有伪成功。
- Step 10 用它判断异常和边界场景是否覆盖引用缺失、backend capability 不足、policy 缺失、capture / handoff failure、cleanup guard 阻断、orphan 和 redline。
- Step 11 用它判断配置只影响承载、参数、profile、节奏或 adapter binding,不得改变 truth owner、boundary、policy、handoff、cleanup、redline 或依赖裁剪。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02-概要设计.md` 的 onboarding 主线 | 用“新人理解”和旧对象词解释 sandbox,但没有形成能指导代码主体、对象、接口、flow 和状态的约束门禁。 | 当前 Step 3 只保留结构性约束,后续 Step 4~9 从新版 `00/01` 重新推导主语。 |
| 旧 `SandboxExecution` / `SandboxSession` / `SandboxCommand` / `SandboxPolicy` / `SandboxOutput` | 这些词可能有主题价值,但会提前把旧对象模型写进概要约束。 | 不直接进入约束表;后续 Step 5~6 从 capability 和对象候选池重新筛选。 |
| 旧五段主线 | “执行请求与会话 / 隔离资源 / command-provider / 输出审计 / 失败运维”未覆盖新版 policy fail-closed、handoff 分层、cleanup guard 和 redline containment。 | 只作为 historical material;不作为结构约束来源。 |
| 旧 README 固化 Docker + gVisor、SandboxService、事件名、目录结构、安全 profile 和性能目标 | 把产品、接口、事件、目录、profile 和指标写成事实,会污染 Step 4 以后的代码主体和接口判断。 | 记录为 historical material;当前只保留“产品与旧指标不作为当前硬事实”的约束。 |
| 旧材料强调 retry / replay | 容易把 retry / replay 写成业务重放或 runtime recover。 | 当前约束明确 control / replay / cleanup 不得重写 runtime、artifact、governance 或业务 truth。 |
| 上游挂起项较多 | backend 组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、profile、SLO 等尚未闭口。 | 作为后续待确认 / 详细设计 / 配置 / 测试 / 实施承接,不得在 Step 3 伪装为结论。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 约束来源 | 旧 `02` 和 README 容易把技术项、旧对象和旧指标写成约束。 | 约束只从新版 `00/01`、全局依赖裁剪和概要层深度口径提炼。 |
| 约束粒度 | 偏“资源必须覆盖”“输出必须回收”等实现或验收式表达。 | 转为会指导组成部分、对象、接口、flow、状态和配置判断的结构约束。 |
| truth 边界 | 旧文档说 sandbox 不等于 runtime/tools,但数据归属层次不够硬。 | 明确 truth / snapshot / reference / derived / forbidden body 分层。 |
| policy 边界 | 旧 README 和旧 `02` 混入 capability-hub、白名单、SandboxPolicy。 | 明确 sandbox 只执行给定 policy,不拥有 policy 来源 truth。 |
| capture / handoff | 旧文档倾向 stdout / stderr / output files / audit 合并表达。 | 明确 capture fact、candidate material、observability material、handoff fact 和下游 truth 分层。 |
| 非 happy path | 旧文档把 kill / retry / replay / cleanup 偏运维控制看待。 | 明确 failure / control / lease / orphan / cleanup / reaper / redline 是核心闭环约束。 |
| 下游深度 | 旧约束会提前落到目录、后端、profile、指标和测试。 | 当前只保留概要结构骨架层约束,具体实现后移。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接复述 `01-架构设计.md` §3 不可变约束 | 与上游一致。 | 会变成架构约束复刻,不能具体指导概要后续章节。 | 不采用。 |
| 方案 B: 沿用旧 `02` §4 技术 / 资源 / 时间 / 合规 / 容量约束 | 迁移成本低,看起来可执行。 | 夹带旧对象、旧性能数字和实现项,且缺少 truth / handoff / cleanup / redline 分层。 | 不采用。 |
| 方案 C: 按“会影响 Step 4~13 结构判断”筛选约束 | 能直接服务代码主体、对象、接口、flow、状态、异常和配置影响。 | 需要二次转译,不能一次写成完整技术限制清单。 | 采用。 |
| 方案 D: 把 backend、schema、profile、测试和实施边界一起写入约束 | 对后续开发看似更直接。 | 抢占 `03~07` 职责,且会伪造未确认产品、证据或实施边界。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 约束边界说明

`L4-sandbox` 的概要设计必须先钉住结构性约束,否则后续对象、接口、flow 和状态会很快被旧后端、调用方语义、下游材料和运维增强牵走。这些约束保护的是概要层到详细设计层之间的结构边界:既不回头重写需求 / 架构,也不提前写 schema、配置、测试和实施计划。

### 9.2 约束条件表

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 只承接已收稳需求与架构结论 | 本次设计目标、代码主体框架、主要组成部分、详细设计承接 | 后续概要章节只转译新版 `00/01` 已确认的定位、闭环、职责、子域、运行承载、数据和交互结论;不重新定义需求目标、架构边界、方案取舍或技术选型。 |
| 独立 execution isolation truth 约束 | 代码主体框架、主要组成部分、关键对象、状态机 | 关键结构必须围绕正式受理、execution environment identity、coherent boundary、policy execution decision、capture / handoff、failure / control、cleanup guard、lease / orphan / reaper 和 redline containment 展开。 |
| 正式受控执行入口不可旁路 | 接口骨架、处理流、异常边界、状态机 | 宿主直跑、调用方本地执行、旁路执行、匿名执行、test-only 承载或低隔离 fallback 不得被写成正式 sandbox success。 |
| 调用方和相邻仓 truth 不入仓 | 主要组成部分、关键对象、接口输入输出、数据流 | tools、runtime、member-service、runner、identity、work、artifact、observability、policy source、investigation 和 UI 正文只能以 refs、safe summary、snapshot、handoff 或 material 进入,不得成为 sandbox truth。 |
| coherent boundary 必须整体成立 | 代码主体框架、隔离边界对象、backend port、处理流、状态机 | resource / filesystem / network / process / workspace / mount 限制必须作为一组边界表达;任一必需限制缺失、不可落实、不可验证或后端不支持时,只能拒绝、等待或保守失败。 |
| backend capability 不得反向定义业务边界 | 主要组成部分、外部 port、配置影响、风险待确认 | Docker / gVisor / Firecracker / k8s / local_process、host、cluster、workspace 和 backend lifecycle 只能作为承载候选或摘要来源;不能决定 sandbox truth、policy、failure、cleanup 或 redline 语义。 |
| given policy execution 与 policy source 分离 | policy 对象候选、Command / port、处理流、异常场景 | sandbox 只承接给定 launch / isolation policy、authorization、approval 或 capability 摘要并形成执行裁定;不得生成 allowlist truth、approval truth、policy definition truth、capability truth 或 policy DSL truth。 |
| policy fail-closed 不可降级 | policy 裁定 flow、状态机、异常边界、配置影响 | policy 缺失、冲突、不支持、不可解析、授权不明或高风险动作越界时不得 permissive fallback;必须表达 rejected、blocked、pending、unresolved 或 failed 等保守结果。 |
| capture / candidate / observability / handoff 分层 | capture 对象、handoff 接口、材料 flow、状态机 | 执行结果捕获、候选材料、usage / audit / observability material 和下游 handoff 必须分层;不得静默提升为 Artifact、baseline、evidence、ToolInvocationResult、runtime result、Runner UI state 或 observability store truth。 |
| handoff 不迁移 ownership | 外部交接 port、事件输出、cleanup guard、状态机 | sandbox 可以保存 handoff fact、handoff refs、pending / failed / retryable 和来源回指;下游 ack / failed 只能影响 handoff、cleanup guard 或 containment,不得让 sandbox 宣布下游正式 truth。 |
| 非 happy path 是核心结构 | 处理流、状态机、异常边界、后台维护 | timeout、deny、kill、cancel、backend failure、capture failure、resource exceeded、lease expiry、orphan、cleanup、reaper 和 redline 必须有一等结构承接,不能交给调用方私有日志或运维脚本兜底。 |
| cleanup guard 与 redline containment 优先 | cleanup / reaper flow、后台任务、状态机、配置影响 | 关键 capture / audit / investigation material 未安全交接、调查未放行或 redline 未收束时,cleanup / reaper 只能阻断或挂起,不得先删除材料或解除 containment。 |
| truth / snapshot / reference / derived / forbidden body 分层 | 关键对象、字段骨架、接口骨架、query surface | 后续对象必须标清属于 sandbox truth、外部摘要 / 快照、引用关系、只读派生还是禁止保存正文;不得为排障、性能、预览、replay 或审计便利保存外部正文。 |
| 核心强一致 + 外围最终一致持续生效 | 处理流、状态机、handoff、投影 / 派生读取 | 受理、identity、boundary、policy、capture、failure、control、cleanup 和 redline 的核心成立必须强一致或明确拒绝 / 挂起;事件传播、handoff、observability、inspect、preview 和 trend 可最终一致但不得反写核心。 |
| 同步 / 异步 / 后台路径分离 | 代码主体框架、API / 接口骨架、处理流 | 同步路径只承接受理、裁定、读取和控制意图;异步路径承接已成立事实传播、handoff ack / failed 和协作回调;后台路径承接长时执行、capture 准备、cleanup / reaper、redline 和派生维护。 |
| 同一执行 / policy / control 语义唯一 | 接口幂等、处理流、状态机、异常边界 | 同一正式执行、同一 policy 语境或同一 control 信号不得因调用方、承载或下游差异形成第二套正式语义;重复、乱序和冲突输入必须显式收束或挂起对账。 |
| 查询与外围增强只读 | Query、inspect / preview / replay、operator control、trend、dashboard | query、inspect、preview、replay、operator control、backend comparison、trend 和 dashboard 只能读取、解释、派生或辅助调查,不得成为 truth mutation path 或核心通过前提。 |
| 编译期依赖只允许 `L0-core` | 代码主体框架、接口骨架、external port、详细设计承接 | 后续概要设计不得把 `L1/L2/L3/L4/L5` sibling、SDK、policy source、backend product、DB、observability store 或 artifact store 写成编译期依赖;只能以运行期、事件、refs、snapshot、safe summary、handoff 或基础设施边界协作。 |
| 产品级后端 / 存储 / profile / SLO 不在本 Step 硬化 | 约束条件、配置影响、风险待确认、参考 | Docker / gVisor / Firecracker / k8s、DB、object store、OTel、secrets、GRC、seccomp / AppArmor / cap-drop、网络粒度、SLO 和旧性能数字仍是后续 ADR / 配置 / 测试 / 实施输入,不得作为当前概要结构事实。 |
| 当前 `02` 停在可实现结构骨架 | 关键对象、接口骨架、处理流、状态机、配置影响 | 可以点名正式主语、对象名、接口分类、flow 名、状态名和关键字段 / 参数骨架;不得提前写完整 Rust struct、DTO / event schema、DDL、repository、配置 key、测试矩阵、evidence、run_id 或 implementation boundary。 |
| 配置不得改变核心边界 | 配置影响轮廓、详细设计承接、后续 `04` | 配置只能影响承载选择、profile 参数、节奏、限流、retention、adapter binding 或外部接缝参数;不得改变 truth owner、coherent boundary、policy fail-closed、handoff ownership、cleanup guard、redline containment、fallback 或依赖裁剪。 |

### 9.3 后续章节门禁表

| 后续章节 / Step | 必须使用的约束 | 门禁判断 |
|---|---|---|
| Step 4 代码主体框架映射 | 独立 execution isolation truth;同步 / 异步 / 后台路径分离;编译期依赖只允许 `L0-core` | 代码主体是否围绕核心语义、编排承接、外部接缝、本地派生和技术承载分层,且不写目录路径或产品后端。 |
| Step 5 主要组成部分、职责与边界 | 调用方和相邻仓 truth 不入仓;coherent boundary;policy source 分离;capture / handoff 分层;非 happy path 核心结构 | 组成部分是否承担了 tools semantic execution、runtime loop、member lifecycle、artifact truth、observability store、policy definition 或 backend product 职责。 |
| Step 6 关键对象轮廓 | truth / snapshot / reference / derived / forbidden body 分层;handoff 不迁移 ownership;cleanup guard 与 redline containment 优先 | 对象是否能回指 Step 5 capability,字段骨架是否暗含外部正文、下游 truth、backend product truth 或隐藏写源。 |
| Step 7 API / 接口骨架 | 正式入口不可旁路;policy fail-closed;同步 / 异步 / 后台路径分离;依赖裁剪 | 接口是否按 Command / Query / Event / Operations / external port 分类,且不提前写 schema、SDK、topic 或非 core 编译期依赖。 |
| Step 8 关键处理流 | 核心强一致 + 外围最终一致;handoff 不迁移 ownership;非 happy path 核心结构;同一语义唯一 | flow 是否混淆受理、执行、capture、handoff、cleanup、redline、下游 ack 和派生维护,是否把失败伪装成功。 |
| Step 9 状态定义与状态流转 | identity / boundary / policy / capture / handoff / failure / control / cleanup / redline 状态必须显式;查询与外围增强只读 | 状态集合是否覆盖 accepted / rejected / pending / unresolved / established / blocked / capture-failed / handoff-pending / contained 等状态族,且没有全局万能状态机。 |
| Step 10 异常与边界场景 | backend capability 不反写;policy fail-closed;cleanup guard;redline containment;外部正文禁区 | 异常是否覆盖引用缺失、能力不足、policy 冲突、capture / handoff failure、control conflict、orphan、cleanup 阻断和安全红线。 |
| Step 11 配置影响轮廓 | 配置不得改变核心边界;产品级选型不硬化 | 配置是否只识别受影响部分和禁止配置化边界,未写配置 key、默认值、profile 矩阵或部署参数。 |
| Step 12 详细设计承接清单 | 当前 `02` 停在可实现结构骨架;产品级挂起项后移 | 是否把对象、接口、flow、状态、配置、测试切口和待确认项交给 `03`,而不是在 `02` 中提前闭合。 |
| Step 13 风险与待确认事项 | 未闭口项不得伪装结论;旧材料隔离 | 是否把 backend 组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、profile、SLO 和 ADR 缺口保留为风险 / 待确认。 |
| Step 14 正式文档装配 | 只承接已确认中间产物;每章有校准来源 | 正式 `02` 是否只从 Step 1~13 收口结论装配,不新增未确认概要设计结论。 |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §3 “约束条件”开头可摘取本文件 §9.1 的约束边界说明,控制在 2~4 句。
- §3 主表可承接本文件 §9.2 的约束条件表,正式文档可按篇幅适度合并同类项,但不得删除会影响 Step 4~13 判断的红线。
- Step 4~13 的中间产物应持续引用本文件 §9.3 的后续章节门禁表做自检。
- 本文件 §5 的问题回答、§6 的问题诊断和 §8 的设计取舍保留在 `design-calibration`,不直接搬入正式正文。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否在 Step 3 复述完整架构约束 | A. 复述 `01` §3;B. 只提炼影响概要结构判断的约束 | B | Step 3 服务后续代码主体、对象、接口、flow、状态和配置判断,不应重复架构全文。 | 已确认采用 B |
| 旧 `SandboxExecution` / `Session` / `Command` / `Policy` / `Output` 是否进入约束表 | A. 进入;B. 只作为后续候选线索 | B | 旧对象词未经新版 Step 5 capability 和 Step 6 对象候选池筛选,不能提前固定。 | 已确认采用 B |
| Docker / gVisor / Firecracker / local_process 是否作为当前概要硬约束 | A. 是;B. 否,只保留为候选和待确认 | B | 产品级后端不能反向定义 coherent boundary,旧 README 不作为新版事实来源。 | 已确认采用 B |
| 是否把配置、测试和实施边界提前写入 Step 3 | A. 是;B. 否,只写禁止越界和后续承接 | B | 配置项、测试证据和 commit boundary 分属 `04/05/06/07`,当前不得伪造。 | 已确认采用 B |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 4 的待确认事项。后端组合、policy 来源矩阵、handoff ack、material retention、failure taxonomy、security profile、SLO 和 ADR 文件仍按 `01-架构设计.md` 的风险 / 待确认口径保留,后续 Step 4~13 不得把这些挂起项写成已确认结论。

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已明确概要设计后续必须遵守的结构性约束 | pass |
| 每条约束能影响代码主体、主要组成部分、关键对象、接口、处理流、状态、异常或配置判断 | pass |
| 未把上游架构全文复述为约束 | pass |
| 未写入完整实现策略、数据库约束、部署约束、协议 schema、测试用例或实施边界 | pass |
| 已记录旧 README / 旧 `02` 的回流风险,未继承旧对象、后端、指标、事件或目录 | pass |
| 未修改正式 `projects/L4-sandbox/02-概要设计.md` | pass |
| 未创建 Step 4 或后续中间产物 | pass |

进入下一步条件:

```text
Step 3 `收稳约束条件` 已完成,gate_status = pass_wait_review。
等待用户审查本文件。
用户确认后,才能进入 Step 4 `代码主体框架映射`。
```
