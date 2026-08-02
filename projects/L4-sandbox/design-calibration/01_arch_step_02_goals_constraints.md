# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力、§3 约束条件
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 2 | pass。用户已确认 `01` Step 1 `确认需求基线`,可进入 Step 2。 |
| 是否已读取当前 flow 与 Step 1 | pass。已读取 `01_architecture_calibration_flow.md` 和 `01_arch_step_01_requirement_baseline.md`。 |
| 是否已读取架构 SOP Step 2 与书写规范 §4.2 / §4.3 | pass。已读取目标、约束、取舍和非目标的输出要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的定位、能力、功能、规则、数据、接口、NFR、验收和风险章节。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_02_goals_constraints.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

把 Step 1 已收稳的需求基线、核心能力闭环、数据归属、依赖裁剪和风险红线转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。本步不写容器、部署、依赖方向图、技术选型、协议、状态机、数据库、对象 schema、配置 key、测试用例或实施方案。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成并经用户确认 | 作为架构目标与约束的直接输入。 |
| `projects/L4-sandbox/00-需求文档.md` §2 / §4 / §6 / §7 / §9 / §10 / §11 / §12 / §13 / §14 / §15 | 已重建并作为 01 基线 | 提取仓定位、目标 / 非目标、依赖、核心闭环、功能、规则、数据归属、接口、NFR、验收和风险。 |
| `00_req_step_16_traceability_matrix.md` | 已完成 | 验证目标与功能 / 规则 / 数据 / 验收 / VF 的对应关系。 |
| `projects/L4-sandbox/README.md` | historical material | 诊断旧后端、事件、目录、安全基线和性能目标是否污染 Step 2。 |
| `projects/L4-sandbox/01-架构设计.md` | historical material | 诊断旧目标、旧约束、旧技术假设和旧成功标准是否可继承。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 2 | 已读取 | 控制本步问题和进入下一步门禁。 |
| `standards/document/架构设计书写规范.md` §4.2 / §4.3 | 已读取 | 控制业务背景、驱动力、架构目标、不可变约束、取舍和非目标的写法。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 1、正式 00、SOP Step 2 和书写规范 §4.2 / §4.3 | done | 本文件 §1、§3 |
| 回答 Step 2 的目标、约束、取舍、非目标问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中不可继承的目标与约束 | done | 本文件 §6 |
| 选择从新版需求基线重推目标与约束 | done | 本文件 §8 |
| 输出业务背景、驱动力、架构目标、不可变约束、取舍和非目标 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 2 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 这个仓在架构层面要确保什么成立?

`L4-sandbox` 架构必须确保“受控执行隔离事实”作为独立基础设施真相成立,并让 tools、runtime、member-service、runner、artifact、observability、identity、work 和 policy 来源围绕同一套 execution isolation truth 协作。架构层要解决的不是“选一个容器后端跑命令”,而是让一次真实执行从进入 sandbox 语境到退出、失败、清理和追溯都有统一结构。

架构层必须守住以下结构性结果:

1. 真实执行必须先进入正式受控执行语境,并绑定 execution environment identity、责任链和最小拒绝前提。
2. 隔离环境必须作为正式边界成立,资源、文件系统、网络和进程限制必须同构表达且不可 silent degrade。
3. 执行必须在给定 launch / isolation policy 语境下发生,policy 缺失、冲突、不支持或越权时必须 fail closed。
4. 输出、候选材料、usage / audit / observability material 必须被安全捕获,并与 artifact、runtime、runner、observability 等下游真相保持分层。
5. timeout、deny、backend failure、capture failure、kill、cleanup、lease expiry、orphan、reaper 和 redline 必须有稳定失败 / 控制 / 收束语义。
6. 跨调用方必须保持同一套受理、策略、capture / handoff、failure / cleanup 语义,不得让 tools、runtime、member-service 或 runner 各自形成第二套 sandbox。
7. 后端承载、多宿主调度、inspect / replay、输出预览、趋势分析和候选性能指标只能围绕核心闭环演进,不得反向定义 sandbox 真相边界。

### 5.2 哪些约束是不可变的?

不可变约束来自 Step 1 的硬约束、正式需求规则、数据归属、依赖裁剪和验收否决项:

| 约束来源 | 不可变约束 |
|---|---|
| 受理入口边界 | 宿主直跑、调用方本地执行、旁路执行或匿名执行不得被宣称为正式 sandbox 受控执行。 |
| 执行环境身份边界 | sandbox 只能消费 identity / work / runner / tool / runtime refs 或摘要,不得重建 actor、member、project、work、runner、tool 或 runtime truth。 |
| 隔离边界 | resource / filesystem / network / process 任一必需限制无法落实、无法验证或后端不支持时,不得 silent degrade 或继续执行。 |
| 后端承载边界 | container / k8s / isolation backend 是运行承载,不得反向定义需求边界、正式隔离语义或业务真相。 |
| policy 边界 | sandbox 执行给定 policy,不得生成 allowlist truth、approval truth、policy definition truth、capability truth 或 policy DSL truth。 |
| fail-closed 边界 | policy 缺失、冲突、不支持、不可解析或未授权高风险动作不得 permissive fallback。 |
| capture / handoff 边界 | 输出、候选材料、usage / audit / observability material 必须分层,不得静默升级为 formal artifact truth、baseline truth、evidence truth 或 observability store truth。 |
| cleanup / reaper 边界 | cleanup / reaper 不得在审计、回放、调查或安全交接所需材料安全交接前先删除 capture / audit / investigation material。 |
| lease / orphan / redline 边界 | 租约到期、孤儿环境或 redline 事件不得在托管恢复路径之外继续运行或脱离受控收束。 |
| 依赖边界 | `L0-core` 是唯一编译期依赖;其他仓、SDK、backend 产品、policy 来源和观测存储不得写成 package dependency。 |
| 统一语义边界 | 同一正式执行、同一 policy 语境或同一 control 信号不得在不同调用方、承载或下游处出现第二套正式语义。 |

### 5.3 哪些约束是当前阶段可以接受的取舍?

当前可接受取舍只覆盖 sandbox 潜在能力范围内的架构收缩,不把边界外事项伪装为取舍:

| 取舍对象 | 当前处理 |
|---|---|
| 多后端优化和强隔离变体 | 当前作为外围增强处理,核心目标只要求抽象 isolation backend 能承载正式边界并拒绝不可落实限制。 |
| Docker / gVisor / Firecracker / local_process 组合 | 当前作为技术选型候选和历史线索处理,不作为 Step 2 架构硬目标。 |
| 多宿主 / 多集群调度 | 当前作为容量与调度增强处理,不纳入核心受控执行闭环前置。 |
| 高级 replay / inspect / operator control | 当前作为失败调查增强处理,核心链路只要求失败、control、cleanup 和 redline 可追溯。 |
| 输出预览与结果分析 | 当前作为下游消费增强处理,不影响基础 capture / handoff truth 成立。 |
| 容量、启动时延、销毁时延、网络判定开销和服务可用率 | 当前作为候选 SLO / 测试输入处理,不写成已验证硬指标。 |
| policy simulation / 后端能力比较 | 当前作为安全评估增强处理,不替代正式 policy 执行和 fail-closed。 |
| 物理审计存储、对象存储、数据库、OTel / GRC / secrets 接入 | 当前作为技术选型、配置或外部系统候选处理,不在 Step 2 锁定。 |

### 5.4 哪些目标可以明确判断,甚至量化?

当前可以明确判断的目标是结构目标,不是实现指标。需求中已有零容忍红线可以作为正式判断口径,旧性能数字只保留为候选:

| 目标类型 | 当前判断 |
|---|---|
| 受控入口独立性 | 必须成立。真实执行不能绕过 sandbox 正式受理语境和执行环境身份。 |
| 核心闭环 | 必须成立。`C-SBX-1~5` 是当前架构主线。 |
| 隔离边界一致性 | 必须成立。resource / filesystem / network / process boundary 必须作为 coherent boundary 被表达和落实。 |
| fail-closed | 必须成立。policy、后端能力和安全红线缺失或冲突时不能继续执行。 |
| capture / handoff 分层 | 必须成立。sandbox capture truth 不等于 artifact truth 或 observability store truth。 |
| cleanup / redline 保守收束 | 必须成立。cleanup 先删证据、托管外孤儿继续运行、redline advisory-only 均为否决。 |
| 零容忍红线 | 可直接判断。宿主直跑成功率、边界 silent degrade 成功率、未授权外联成功率、cleanup 先删证据成功率、外部正文越权入仓成功率均必须为 `0`。 |
| 旧性能数字 | 当前不能量化为硬目标。Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、网络白名单 `<5ms`、API `99.9%` 只作为后续测试 / 容量评估候选。 |

### 5.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题?

| 相关事项 | 当前架构判断 |
|---|---|
| ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry、工具语义执行 | 属于 `L2-tools`;sandbox 只提供隔离执行环境、边界反馈和失败 / capture 材料。 |
| ExecutionInstance、agent loop、step progression、checkpoint / recover、runtime feedback、结果回流 | 属于 `L2-runtime`;sandbox 不拥有运行主线或恢复主线。 |
| MemberExecutionHost、SandboxBinding 装配结果、session、worker、health、callback material | 属于 `L2-member-service`;sandbox 不管理成员宿主生命周期。 |
| GlobalMember、actor、role / capability identity lifecycle、identity 正文 | 属于 `L1-identity` 或相关能力定义来源;sandbox 只消费身份锚点或引用。 |
| Project、ProjectMember、WorkItem、Iteration、ImplementationPlan / PlanItem 正文 | 属于 `L1-work`;sandbox 只消费工作语境引用。 |
| Artifact 正文、版本、baseline、formal evidence truth、制品入库决策 | 属于 `L1-artifact`;sandbox 只捕获输出或候选材料,不宣布 formal artifact truth。 |
| telemetry / audit / metric 存储、trace 查询、retention、alert stream | 属于 `L4-observability`;sandbox 只形成 observability hook / material。 |
| policy definition、approval、capability、allowlist、policy DSL | 属于 governance / capability / tools 等策略真相源;sandbox 只执行给定 policy。 |
| RunnerRun、run state、control entry、output preview、CLI / UI 产品流程 | 属于 `L5-runner` 或产品入口;sandbox 只提供隔离执行基础。 |
| 容器镜像构建、成员镜像资产、供应链构建 | 属于 `L2-member-images`、member-service 或供应链边界。 |
| API / DTO / event schema / 状态机 / 数据库 / 存储 / 配置 key / commit boundary | 属于概要、详细、配置、测试、验收或实施计划阶段。 |

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 仓使命 | 写“至少 Docker + gVisor 两种隔离后端”。 | 把后端数量写成架构目标,早于当前技术选型和配置裁剪。 | Step 2 只要求正式 isolation backend 边界成立,具体后端后移。 |
| 核心职责 | 写默认无出网、白名单必须 Policy 授权、固定审计事件。 | fail-closed 方向有效,但白名单来源、事件名和策略正文边界未按新版需求分层。 | 继承“给定 policy + fail closed”目标,不继承旧事件名和 allowlist 形态。 |
| 关键依赖 | 写 `quantalithos-sdk`、capability-hub、Docker / gVisor / Firecracker / runc。 | 与 `L0-core` 唯一编译期依赖和 policy 来源外部拥有口径冲突。 | Step 2 固定依赖红线,后续 Step 7 重裁剪。 |
| 目录结构 / 技术栈 | 预设 Rust、`backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 属于实现组织,不能作为架构目标或约束。 | 不继承。 |
| 性能目标 / 安全基线 | 固定启动、销毁、白名单开销和 seccomp / AppArmor / cap drop。 | 指标和安全手段缺当前验证来源,且属于后续技术 / 配置 / 测试层。 | 降为候选目标或技术线索。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 文档元信息 | 项目定位写统一 SandboxService + Docker / gVisor / future Firecracker backend。 | 直接把旧接口抽象和后端方案当架构目标。 | 不继承;Step 2 从 execution isolation truth 重推目标。 |
| §1 业务背景 / 成功标准 | 写 Runner 与 Runtime 共用接口、Docker / gVisor 启动、未授权出网拦截率。 | 混合结构目标、技术方案、性能指标和验收项。 | 拆分为统一语义目标、候选性能目标和后续验收红线。 |
| §2 约束条件 | 写至少 Docker + gVisor、固定事件、资源硬约束、Runner 与 Member 共用接口。 | 旧 SB 条目未经当前依赖、数据和边界重审。 | 只保留隔离边界、fail-closed、统一语义等需求可追溯约束。 |
| §3 架构风格 | 直接选择统一 SandboxService + backend adapters + Policy-aware network gate。 | 越过职责边界、上下文、依赖、数据和技术选型 Step。 | 后续 Step 10 / 11 重新讨论。 |
| §4~§8 上下文 / 子域 / 容器 / 依赖 / 数据 | 直接写 capability-hub、Docker/gVisor、orchestrator、PolicyViewProvider、AuditPublisher、allowlist snapshot。 | 容易让 capability-hub / backend / observability 反向成为 sandbox truth。 | Step 2 先收束不可变边界,后续 Step 4~8 重建。 |
| §11~§14 横切 / 演进 / 上线 / 监控 | 写 seccomp、AppArmor、告警阈值、灰度、回滚。 | 属于横切、配置、测试、验收或实施计划;不应进入 Step 2 目标。 | 后续对应 Step 再裁剪。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构目标表达 | 偏“能跑命令 + 双后端 + 统一接口 + 审计事件”。 | 改为受控执行语境、隔离边界、policy fail-closed、capture / handoff、failure / cleanup / redline 的结构性结果。 | 对齐架构规范 §4.2 和新版 `00`。 |
| 不可变约束 | 旧约束混入后端数量、事件名、性能数字和接口形态。 | 覆盖受理入口、执行环境身份、隔离边界、后端承载、policy、capture、cleanup、lease / orphan、依赖和统一语义。 | 对齐 Step 1 和 `BR / AC / VF`。 |
| 当前取舍 | 多后端、inspect、调度、预览、趋势和性能目标容易被写成核心前置。 | 明确这些能力当前作为外围增强、候选 SLO 或后续技术 / 配置输入。 | 防止外围能力污染核心闭环。 |
| 架构非目标 | 旧文档把 tools / runtime / member / runner / policy / observability 混入上下文。 | 按 truth owner 明确排除边界外架构范围。 | 为 Step 3 职责边界和 Step 4 系统上下文提供前置。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 README / 旧 `01` 的目标、约束和性能指标 | 复用快。 | 旧后端、旧接口、旧事件、旧指标和旧依赖会污染新版架构基线。 | 不采用。 |
| 方案 B: 从新版需求基线重新推导架构目标与约束 | 可追溯,能保留核心闭环和真相源边界。 | 需要后续 Step 逐步重建正式架构。 | 采用。 |
| 方案 C: Step 2 直接确定 SandboxService、backend adapter、policy gate 和 audit publisher | 推进看似更快。 | 越过职责边界、上下文、依赖、数据和技术选型。 | 不采用。 |
| 方案 D: 把 Docker/gVisor、Firecracker、inspect、preview、趋势分析全部列为非目标 | 范围最小。 | 会丢失 sandbox 合理演进空间和外围增强线索。 | 不采用,改列为当前阶段取舍。 |

### 8.1 待确认问题的方案选择

#### Docker / gVisor / Firecracker 是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构目标固定至少 Docker + gVisor,Firecracker 作为未来后端。 | 会把旧 README 和旧 SB 条目提前硬化为技术事实。 |
| 方案 B | 当前只要求正式 isolation backend 能落实边界并在不支持时拒绝。 | 保留后续技术选型空间,对齐需求层抽象 backend 口径。 |

推荐方案 B。

#### Runner / runtime / member-service 是否必须同一协议接口?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Step 2 固定统一 SandboxService / 同一 RPC / SDK 外形。 | 会提前锁定协议和实现组织。 |
| 方案 B | Step 2 固定统一 sandbox 语义,协议外形后续交互和详细设计决定。 | 保留同构语义,避免过早下沉到接口形态。 |

推荐方案 B。

#### 旧性能和可用率数字是否进入架构硬目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接写成硬架构目标。 | 缺少当前负载模型和验证来源,与需求 §13 的候选目标口径冲突。 |
| 方案 B | 作为候选 SLO / 测试 / 容量输入。 | 保留旧线索,不伪量化。 |

推荐方案 B。

---

## 9. 结构化中间产物

### 9.1 业务背景结论

Quantalithos 的 AI 成员、工具调用、构建测试和 Runner 应用都会触发真实代码或进程执行。`L4-sandbox` 值得单独做架构设计,是因为一次真实执行如果不能稳定说明“谁发起、在哪个受控环境、施加了哪些资源 / 文件系统 / 网络 / 进程边界、依据什么 policy、产出了哪些材料、失败和清理如何收束”,平台就会在 tools、runtime、member-service、runner、artifact、observability 和人工脚本之间形成多套执行隔离语义。

### 9.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 受控执行入口需要统一结构 | 否则 tools、runtime、member-service、runner 会各自拼接执行语境并形成第二套责任链。 |
| 隔离边界需要统一表达和落实 | 否则 resource / filesystem / network / process 限制会因调用方或后端差异而 silent degrade。 |
| policy 执行需要和 policy 定义分离 | 否则 sandbox 会反向拥有 allowlist、approval、capability 或 policy DSL truth。 |
| 输出与观测材料需要分层交接 | 否则候选材料、artifact truth、observability store 和 runtime result 会混成一条不可对账链。 |
| 非 happy path 需要成为架构主线 | 否则 timeout、deny、capture failure、cleanup、orphan 和 redline 会在调用方兜底中丢失证据或形成冲突真相。 |
| 跨仓协作必须裁剪依赖 | 除 `L0-core` 外不得把相邻仓、SDK、backend 产品或 policy 来源变成编译期依赖。 |

### 9.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的受控执行隔离事实真相 | 否则 sandbox 会退化为普通命令执行器、后端适配层或调用方库。 |
| 支撑受控执行请求语境和 execution environment identity 成立 | 否则真实执行无法被稳定归责、追溯或拒绝。 |
| 支撑资源、文件系统、网络和进程边界作为 coherent boundary 成立 | 否则隔离限制会被调用方、后端或测试路径分裂。 |
| 支撑给定 launch / isolation policy 内执行并 fail closed | 否则 sandbox 会吞并 policy truth 或在策略不完备时放行高风险动作。 |
| 支撑输出、候选材料和观测材料的安全捕获与分层交接 | 否则 capture truth、artifact truth、observability truth 和 runtime result 会互相污染。 |
| 支撑失败分类、control、lease / orphan、cleanup guard 和 redline containment 成为正式收束链 | 否则非 happy path 会破坏证据、静默吞错或形成托管外执行。 |
| 支撑 tools、runtime、member-service、runner 等调用方共享同一套 sandbox 语义 | 否则同一执行、同一 policy 或同一 control 信号会出现多套正式含义。 |
| 稳定区分 sandbox truth、外部快照、外部引用、候选材料和禁止保存正文 | 否则 identity、work、tool、runtime、artifact、observability 或 policy 正文会污染 execution isolation truth。 |
| 允许后端承载、调度、inspect / replay、预览和趋势能力围绕核心闭环演进 | 否则后续扩展会反向改写当前核心边界。 |

### 9.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不将宿主直跑、调用方本地执行、旁路执行或匿名执行视为正式 sandbox 受控执行 | 否则正式受理入口和责任链会失效。 |
| 不重建或拥有 actor、member、project、work、runner、tool、runtime 或调用方业务真相 | 否则 execution environment identity 会吞并相邻仓 truth。 |
| 不允许 resource / filesystem / network / process 任一必需限制 silent degrade、部分忽略或未验证即继续执行 | 否则隔离边界事实会失效。 |
| 不允许 container / k8s / isolation backend 反向定义 sandbox 正式需求边界或业务真相 | 否则后端产品会替代本仓架构边界。 |
| 不生成或拥有 allowlist truth、approval truth、policy definition truth、capability truth 或 policy DSL truth | 否则 policy 执行层会打穿治理 / 能力 / tools 策略来源边界。 |
| 不允许 policy 缺失、冲突、不支持、不可解析或未授权高风险动作继续执行 | 否则 fail-closed 架构目标失效。 |
| 不将输出、候选材料或 observability material 静默提升为 formal artifact truth、baseline truth、evidence truth 或 observability store truth | 否则 capture / handoff 分层会失效。 |
| 不允许 cleanup / reaper 在关键材料安全交接前先删除 capture / audit / investigation material | 否则审计、回放、调查和安全交接链会被主动破坏。 |
| 不允许租约到期、孤儿环境或 redline 事件在托管恢复路径之外继续运行 | 否则 cleanup / reaper / redline containment 会失效。 |
| 不允许同一执行、同一 policy 语境或同一 control 信号形成第二套正式语义 | 否则平台无法对账。 |
| 不允许除 `L0-core` 外形成编译期依赖 | 否则 L4 基础设施仓会与业务 truth、产品入口或后端产品形成错误耦合。 |
| 不允许 query、preview、inspect、trend、observability dashboard 或 operator UI 反写 execution isolation truth | 否则读侧和运维增强会成为隐藏写源。 |

### 9.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 多后端优化和强隔离变体 | 当前作为外围增强处理,核心架构先固定抽象 backend 与限制可落实性。 |
| Docker / gVisor / Firecracker / local_process 组合 | 当前作为候选技术输入处理,不纳入 Step 2 硬目标。 |
| 多宿主 / 多集群隔离调度 | 当前作为容量与调度增强处理,不阻塞核心受控执行闭环。 |
| 高级 replay / inspect / operator control | 当前作为失败调查增强处理,不替代基础失败分类和 cleanup guard。 |
| 输出预览与结果分析 | 当前作为下游消费增强处理,不影响基础 capture / handoff truth。 |
| 后端能力比较与 policy simulation | 当前作为上线前评估增强处理,不替代正式 policy 执行。 |
| 容量、启动时延、销毁时延、网络判定开销和服务可用率 | 当前作为候选 SLO / 测试输入处理,后续测试方案和验收标准再决定是否升级。 |
| 数据库、对象存储、审计物理存储、OTel / GRC / secrets 接入 | 当前作为技术选型、配置或外部系统候选处理,不在 Step 2 固化。 |

### 9.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计工具语义执行架构 | ToolDefinition、ToolPolicy、ToolInvocationResult、ToolAuditEntry 和工具结果归一化属于 `L2-tools`。 |
| 不设计 runtime agent loop / recover 架构 | ExecutionInstance、CurrentStep、agent loop、checkpoint / recover 和结果回流 truth 属于 `L2-runtime`。 |
| 不设计 member host lifecycle / SandboxBinding 装配架构 | MemberExecutionHost、session、worker、health、SandboxBinding 装配结果和 callback material 属于 `L2-member-service`。 |
| 不设计 identity / work 真相架构 | GlobalMember、actor lifecycle、Project、WorkItem、ImplementationPlan / PlanItem 正文属于 `L1-identity` / `L1-work`。 |
| 不设计 artifact truth / evidence / baseline 架构 | Artifact 正文、版本、baseline、formal evidence truth 和制品入库决策属于 `L1-artifact`。 |
| 不设计 observability store 架构 | telemetry / audit / metric 存储、trace 查询、retention 和 alert stream 属于 `L4-observability`。 |
| 不设计 policy definition / approval / capability 架构 | policy 定义、授权审批、capability truth、allowlist truth 和 policy DSL 属于治理 / 能力 / tools 策略来源。 |
| 不设计 Runner 产品语义、CLI / UI 或运行体验架构 | RunnerRun、run state、control entry、output preview 和产品入口状态属于 `L5-runner` 或上层入口。 |
| 不设计容器镜像构建和供应链架构 | 镜像构建、成员镜像资产和运行镜像生命周期属于 `L2-member-images`、member-service 或供应链边界。 |
| 不在架构目标层定义 API / DTO / event schema / 状态机 / 数据库 / 配置 key / commit boundary | 这些属于概要、详细、配置、测试、验收或实施计划阶段。 |

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论。

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“设计取舍”小节,了解本章如何把需求闭环转译为架构目标。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §9.1 业务背景结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §9.2 驱动力结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §9.3 架构目标表。
```

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构硬约束结论”“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”小节,了解本章约束如何从需求边界和架构目标收敛而来。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §9.4 不可变约束表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §9.5 当前阶段可接受取舍表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §9.6 架构非目标表。
```

---

## 11. 待确认事项

本步不新增阻塞性待确认事项。已知待确认项沿用 Step 1 的风险清单,后续分别在职责边界、系统上下文、依赖方向、数据所有权、技术选型、演进路线和风险章节承接。

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| Q-SBX-ARCH-002-001 | 具体隔离承载组合和允许环境边界 | 当前作为后续容器 / 部署架构、技术选型和配置输入。 |
| Q-SBX-ARCH-002-002 | policy / authorization 来源矩阵和网络放行粒度 | 当前只固定给定 policy + fail closed,后续系统上下文、交互、配置和测试收敛。 |
| Q-SBX-ARCH-002-003 | capture / handoff ack、pending、failed 和 cleanup guard 协议形态 | 当前只固定显式 handoff fact 和 cleanup guard,后续交互 / 详细 / 配置收敛。 |
| Q-SBX-ARCH-002-004 | Runner / runtime / member-service / tools 是否同构协议 | 当前只固定同构 sandbox 语义,协议形态后续决定。 |
| Q-SBX-ARCH-002-005 | 旧性能、可用率和启动 / 销毁 / 白名单开销数字是否升级 | 当前作为候选 SLO / 测试输入,后续 `05` / `06` 决定。 |

---

## 12. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确架构必须确保什么成立 | pass | §9.3 已输出结构性架构目标。 |
| 是否明确不可变约束 | pass | §9.4 覆盖受理入口、身份、隔离、后端、policy、capture、cleanup、lease / orphan、依赖和统一语义。 |
| 是否明确当前阶段可接受取舍 | pass | §9.5 将多后端、inspect、调度、预览、趋势、候选 SLO 和物理存储降为取舍 / 后续输入。 |
| 是否明确架构非目标 | pass | §9.6 按 truth owner 排除 tools、runtime、member-service、identity、work、artifact、observability、policy、runner、镜像和实现细节。 |
| 是否提前写容器、依赖图、数据库、协议、schema、状态机、配置 key 或技术方案 | pass | 本步只写目标、约束、取舍和非目标。 |
| 是否沿用旧 README / 旧 `01` 的后端、事件、接口和性能指标 | pass | 旧材料只作诊断;未直接继承。 |
| 是否允许进入 Step 3 | pass_wait_review | 当前 Step 2 已满足进入 `职责边界` 的条件;需用户确认后进入 Step 3。 |

当前 Step 2 `明确架构目标与约束` 已完成。下一步必须等待用户确认后进入 Step 3 `职责边界`,并只创建 / 改写 `design-calibration/01_arch_step_03_responsibility_boundary.md`。
