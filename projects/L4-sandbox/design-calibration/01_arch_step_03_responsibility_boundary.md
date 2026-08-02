# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 3 | pass。用户已确认 Step 2 `明确架构目标与约束`,可进入 Step 3。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_01_requirement_baseline.md` 和 `01_arch_step_02_goals_constraints.md`。 |
| 是否已读取架构 SOP Step 3 与书写规范 §4.4 | pass。已读取职责边界的目标、输入、输出、表结构、红线和禁止混写要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md` 的定位、非目标、依赖、核心能力、功能、规则、数据、接口、NFR、验收和风险章节。 |
| 是否已读取上游边界线索 | pass。已检索 `L2-tools`、`L2-runtime`、`L2-member-service`、`L1-identity`、`L1-work` 与 sandbox / execution / policy / artifact / observability 相关边界。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_03_responsibility_boundary.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

明确 `L4-sandbox` 在全局职责分工中的承担范围,收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。本步只回答职责归属,不画系统上下文图,不提前划分限界上下文,不展开容器 / 部署、数据所有权矩阵、接口协议、状态机、数据库、配置 key、事件 schema、技术选型或实施边界。

---

## 3. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成并经用户确认 | 承接 execution isolation truth、核心闭环、硬约束、旧材料污染诊断。 |
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 承接架构目标、不可变约束、当前阶段取舍和架构非目标。 |
| `projects/L4-sandbox/00-需求文档.md` §2 / §4 / §6 / §7 / §9 / §10 / §11 / §12 / §14 / §15 | 当前正式需求基线 | 校验职责边界、非职责、依赖裁剪、规则红线、数据归属、接口能力和验收否决项。 |
| `projects/L2-tools/00~06` | 上游参考 | 校验 ToolDefinition、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry 和工具语义执行不归 sandbox。 |
| `projects/L2-runtime/00~06` | 上游参考 | 校验 ExecutionInstance、CurrentStep、agent loop、recover、runtime feedback 和结果回流 truth 不归 sandbox。 |
| `projects/L2-member-service/00~06` | 上游参考 | 校验 MemberExecutionHost、SandboxBinding 装配结果、host lifecycle 和 callback material 不归 sandbox。 |
| `projects/L1-identity/00~07` / `projects/L1-work/00~07` | 上游参考 | 校验 actor / member / project / work 正文 truth 不归 sandbox,只能作为 ref / summary 语境进入。 |
| `projects/L4-sandbox/README.md` | historical material | 诊断旧职责、后端、事件、目录、安全基线和性能目标是否污染职责边界。 |
| `projects/L4-sandbox/01-架构设计.md` | historical material | 诊断旧 `SandboxService`、Docker/gVisor、PolicyGate、Audit 等职责是否可继承。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 3 | 已读取 | 控制本步问题、输出和进入下一步门禁。 |
| `standards/document/架构设计书写规范.md` §4.4 | 已读取 | 控制职责边界表、做 / 不做清单和边界红线写法。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 1 / Step 2、正式 00、SOP Step 3 和书写规范 §4.4 | done | 本文件 §1、§3 |
| 回答做什么、不做什么、易混淆职责、隐式行为和串线边界问题 | done | 本文件 §5 |
| 诊断旧 README / 旧 `01` 中职责串线点 | done | 本文件 §6 |
| 选择按职责归属拆分,不提前写上下文图、子域、接口或技术方案 | done | 本文件 §8 |
| 输出职责边界表、做 / 不做清单和边界红线清单 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 3 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 这个仓具体做什么?

`L4-sandbox` 正式承担的职责是维护受控执行隔离事实,让真实执行在进入、运行、捕获、失败、控制、租约、清理和安全红线收束时都有同一套 sandbox 语义。职责不按“Docker 适配器 / RPC / audit emitter / network gate”这类实现模块划分,而按 execution isolation truth 的仓级事实边界划分。

| 职责 | 判断 |
|---|---|
| 承载受控执行请求的正式受理与拒绝归责 | 做。真实执行不能由调用方路径、缓存命中或日志回写隐式成为 sandbox 执行。 |
| 承载 execution environment identity 与责任链绑定事实 | 做。sandbox 需要让一次隔离执行可归责、可追溯、可拒绝,但不重建 identity / work / runner truth。 |
| 承载跨调用方统一 sandbox 语义 | 做。tools、runtime、member-service、runner 等调用方必须共享同一套受理、policy、capture、failure、cleanup 语义。 |
| 承载正式隔离环境建立、拒绝建立和生命周期收束事实 | 做。真实执行只能发生在正式建立且受控的隔离环境内。 |
| 承载 resource / filesystem / network / process coherent boundary | 做。资源、文件系统、网络和进程限制必须作为同一组边界成立,不能分散为调用方各自解释。 |
| 承载限制可落实性校验与保守拒绝事实 | 做。后端不支持、限制不可验证或必需限制不可落实时,本仓必须保守拒绝或显式失败。 |
| 承载给定 launch / isolation policy 的执行裁定与 fail-closed 事实 | 做。sandbox 执行给定 policy,记录接受、拒绝、冲突、不支持和越权处置结果。 |
| 承载输出、候选材料、usage / audit / observability material 的 capture / handoff 事实 | 做。sandbox 负责安全捕获与分层交接材料,但不宣布下游正式 truth。 |
| 承载稳定失败分类与控制动作事实 | 做。timeout、deny、kill、cancel、backend failure、capture failure 等非 happy path 必须稳定分类并可追溯。 |
| 承载 lease / orphan / reaper / cleanup guard 事实 | 做。租约过期、孤儿环境和清理动作必须有受控收束语义,不能托管外继续运行。 |
| 承载 redline containment 与安全调查交接材料 | 做。escape-like、越权访问和安全红线必须保守收束并显式留痕。 |
| 消费 backend capability 摘要以验证边界 | 做。backend capability 摘要用于判断限制能否落实,但 backend 产品 truth 不归 sandbox。 |

### 5.2 这个仓具体不做什么?

`L4-sandbox` 不承担相邻仓的业务真相、运行主线、工具语义、宿主生命周期、下游制品真相、观测存储或 policy 定义职责。

| 非职责 | 归属 |
|---|---|
| ToolDefinition、ToolContract、ToolPolicy、ToolInvocationRequest、ToolInvocationResult、ToolAuditEntry、工具语义执行和结果归一化 | `L2-tools` |
| ExecutionInstance、CurrentStep、agent loop、checkpoint / recover、runtime feedback、promote / result backflow truth | `L2-runtime` |
| MemberExecutionHost、SandboxBinding 装配结果、session、worker、host health、callback material 和宿主生命周期 | `L2-member-service` |
| GlobalMember、actor lifecycle、role / capability identity truth、identity 正文 | `L1-identity` 或相关身份来源 |
| Project、ProjectMember、WorkItem、Iteration、ImplementationPlan / PlanItem 正文和工作事实 | `L1-work` |
| Artifact 正文、版本、baseline、formal evidence truth 和制品入库决策 | `L1-artifact` |
| telemetry / audit / metric 存储、trace 查询、retention、alert stream 和观测总账 | `L4-observability` |
| policy definition、approval、capability、allowlist、policy DSL 和治理裁决 | governance / capability / tools 等策略真相源 |
| RunnerRun、run state、control entry、output preview、CLI / UI 产品流程 | `L5-runner` 或上层产品入口 |
| container / k8s / Docker / gVisor / Firecracker 产品生命周期、部署拓扑、后端配置 key 和调度产品本体 | 运行承载 / 配置 / 部署边界 |
| 容器镜像构建、成员镜像资产和供应链构建 truth | `L2-member-images`、member-service 或供应链边界 |

### 5.3 哪些能力看起来相关但必须属于其他仓?

| 易混淆能力 | 必须归属 / 边界 |
|---|---|
| execution environment identity vs identity truth | sandbox 只绑定执行环境身份与责任链事实;actor / member / role 生命周期属于 identity。 |
| sandbox execution isolation truth vs runtime ExecutionInstance truth | sandbox 只拥有隔离层执行事实;ExecutionInstance、step progression 和 recover 属于 runtime。 |
| sandbox bind material vs SandboxBinding 装配结果 | sandbox 可提供隔离层绑定 / 拒绝材料;host 绑定装配事实属于 member-service。 |
| given launch / isolation policy execution vs ToolPolicy / governance policy definition | sandbox 执行给定 policy 并 fail closed;policy 定义、审批、allowlist 和 capability truth 归外部来源。 |
| raw stdout / candidate material vs ToolInvocationResult / Artifact truth | sandbox 捕获材料;工具结构化结果归 tools,正式 artifact / evidence / baseline 归 artifact。 |
| usage / audit / observability material vs observability ledger | sandbox 形成可交接材料;物理日志、指标、trace store 和查询归 observability。 |
| failure / control fact vs runtime recovery / business failure | sandbox 分类隔离层失败和控制动作;恢复主线、业务失败和重试编排归 runtime 或调用方。 |
| cleanup guard / reaper vs artifact retention / investigation case lifecycle | sandbox 保证清理不破坏隔离层材料;长期保留、正式调查和制品保留由下游 truth owner 承接。 |
| backend capability summary vs backend product truth | sandbox 可消费承载能力摘要;后端产品选择、安装、配置和集群生命周期不归 sandbox。 |
| 统一 sandbox 语义 vs 同一 RPC / SDK 外形 | 本步只固定同一职责语义;协议外形后续 Step 9 / 03 再决定。 |
| inspect / replay / operator control vs truth mutation path | inspect / replay 可作为外围增强;不得成为修改 execution isolation truth 的隐藏入口。 |

### 5.4 哪些行为绝不能隐式发生?

| 禁止隐式行为 | 原因 |
|---|---|
| 宿主直跑、调用方本地执行、旁路执行或匿名执行被记录成正式 sandbox 执行 | 会打穿正式受理和隔离入口边界。 |
| 执行完成后补造 execution environment identity、责任链或 policy 语境 | 会让归责、拒绝和审计链失真。 |
| resource / filesystem / network / process 任一必需限制 silent degrade 后继续执行 | 会让隔离边界事实失效。 |
| policy 缺失、冲突、不支持、不可解析或越权时 permissive fallback | 会让 fail-closed 失效并吞并 policy truth。 |
| sandbox 生成 allowlist、approval、policy definition、capability 或 policy DSL truth | 会让策略执行层反向成为策略来源。 |
| 输出或候选材料直接成为 Artifact、baseline、formal evidence 或 ToolInvocationResult truth | 会让 capture material 替代下游正式 truth。 |
| observability 日志、trace 或 metric 代替 capture / handoff 成功事实 | 会让观测材料掩盖结果捕获缺失。 |
| cleanup / reaper 在关键材料安全交接前先删除 capture / audit / investigation material | 会主动破坏审计、回放、调查和安全交接链。 |
| 租约到期、孤儿环境或 redline 事件在托管恢复路径之外继续运行 | 会让隔离环境脱离受控收束。 |
| redline 只作为 advisory-only 提示而不触发保守收束 | 会让安全红线无法阻断扩散。 |
| tools、runtime、member-service、runner、backend 或下游消费方形成第二套执行 / policy / capture / cleanup 语义 | 会造成平台多真相,无法对账。 |
| identity / work / tool semantic / runtime recover / artifact / observability / policy DSL / operator UI 正文进入 sandbox truth | 会污染 execution isolation truth ownership。 |
| query、preview、inspect、trend、dashboard 或 maintenance 路径反写 execution isolation truth | 会让读侧或运维增强成为隐藏写源。 |

### 5.5 哪些边界如果不写清,后续设计最容易串线?

最容易串线的边界是:

1. 正式受理 / execution environment identity 与调用方上下文拼接。
2. sandbox isolation truth 与 runtime ExecutionInstance / recovery truth。
3. sandbox bind material 与 member-service SandboxBinding / host lifecycle truth。
4. 给定 policy 执行裁定与 policy definition / approval / allowlist / capability truth。
5. resource / filesystem / network / process coherent boundary 与后端局部能力。
6. capture / handoff fact 与 Artifact truth、ToolInvocationResult、observability store。
7. failure / control / cleanup / reaper fact 与 runtime retry / recover、artifact retention、investigation lifecycle。
8. backend carrier capability 摘要与 backend 产品、部署、配置和调度 truth。
9. 跨调用方统一 sandbox 语义与强制同一协议、同一 SDK 或同一接口外形。
10. inspect / replay / operator control 与正式 truth mutation 路径。

---

## 6. 当前材料问题诊断

### 6.1 旧 README 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 仓使命 | 写“至少 Docker + gVisor 两种隔离后端”。 | 把后端数量写成仓职责,早于当前上下文、部署和技术选型。 | 本步只固定正式隔离环境和承载能力校验职责,不继承后端组合。 |
| 核心职责 | 写隔离执行、资源限制、默认无出网、白名单授权、审计事件。 | 主题方向相关,但白名单来源、事件名和审计存储边界未按新版 truth owner 裁剪。 | 保留职责语义,不继承旧名称、旧来源或旧事件。 |
| 关键依赖 | 写 SDK、capability-hub、Docker/gVisor/Firecracker/runc。 | 与 `L0-core` 唯一编译期依赖、policy truth 外部拥有和 backend 产品边界冲突。 | 依赖方向留到 Step 7,本步只记职责归属。 |
| 目录结构 | 预设 `backends/`、`api/`、`limits/`、`audit/`、`rpc/`。 | 这是实现组织,不是职责边界。 | 不继承。 |
| 维护纪律 / 性能目标 / 安全基线 | 写 SB 条目、启动时延、seccomp、AppArmor、cap drop。 | 混入验收、配置、技术方案和候选指标。 | 本步只提炼对应红线:不可直跑、不可 silent degrade、不可 permissive fallback。 |

### 6.2 旧 `01-架构设计.md` 诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 文档元信息 / §1 | 项目定位为统一 SandboxService + Docker/gVisor/future Firecracker backend,成功标准写性能和共用接口。 | 把协议形态、后端组合和旧指标写成职责。 | 不继承;本步只固定统一 sandbox 语义。 |
| §2 约束条件 | 固定至少双后端、固定审计事件、Runner 与 Member 共用接口。 | 旧 SB 条目未经当前职责、依赖和数据边界重审。 | 只保留“不出现第二套 sandbox 语义”的职责红线。 |
| §3 架构风格 | 直接选择 SandboxService + backend adapters + Policy-aware network gate。 | 越过职责边界、系统上下文、限界上下文和技术选型。 | 后续 Step 10 / 11 再判断技术组织。 |
| §4.2 职责边界 | 只写隔离执行、资源限制、默认无出网、审计事件和少量不做项。 | 粒度过粗,遗漏受理、identity、policy、capture / handoff、failure、cleanup、redline 和 truth owner 边界。 | 本步按核心闭环和 truth owner 重建职责。 |
| §5~§8 | 把 API、Backends、Limits、Audit、PolicyViewProvider、AuditPublisher 等写成上下文和数据。 | 容易把实现模块、policy 来源和 observability 边界写成 sandbox 职责。 | 不继承;后续 Step 4~8 逐步重建。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责主语 | “SandboxService + backend adapters + policy gate + audit emitter”。 | “受控执行隔离事实 + 受理 / identity / boundary / policy execution / capture / failure / cleanup / redline”。 | 对齐新版 `00` 的 execution isolation truth。 |
| 不做事项 | 旧文档只排除工具业务逻辑、白名单决策、镜像构建和 UI。 | 明确排除 tools、runtime、member-service、identity、work、artifact、observability、policy 来源、runner、backend 产品、镜像供应链。 | 防止相邻仓 truth 混入。 |
| 易混淆职责 | 旧文档分散在上下文、容器和数据章节。 | 单独列出 identity、ExecutionInstance、SandboxBinding、policy、artifact、observability、cleanup、backend、协议外形等混淆点。 | 为 Step 4~8 防串线。 |
| 边界红线 | 旧文档偏默认无出网、事件和性能。 | 集中到直跑、silent degrade、policy fallback、下游 truth 静默升级、cleanup 先删证据、孤儿托管外运行和第二语义。 | 对齐 `BR-SBX-*`、`AC-SBX-*`、`VF-SBX-*`。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 README / 旧 `01` 的职责清单 | 快,文字少。 | 会残留旧后端、旧事件、旧接口和旧性能指标,且遗漏新版 failure / cleanup / redline。 | 不采用。 |
| 方案 B: 按 execution isolation truth 和核心闭环拆分职责 | 可追溯,能防止串仓,后续可转成上下文、数据和交互边界。 | 文档更长。 | 采用。 |
| 方案 C: 在职责边界中同时画系统上下文和调用关系 | 读者直观。 | 越过 Step 4,混淆职责归属和外部关系。 | 不采用。 |
| 方案 D: 把 artifact / observability / runtime 全部列为非职责并不再提材料交接 | 范围最小。 | 会丢失 capture / handoff、观测材料和失败交接职责。 | 不采用,改写成“做材料捕获与交接,不拥有下游 truth”。 |
| 方案 E: 把 Docker/gVisor、seccomp/AppArmor、allowlist gate 写成职责 | 看似可落地。 | 这是技术 / 配置 / 后端方案,会反向定义职责边界。 | 不采用,后续 Step 10 / 12 / 04 再裁剪。 |

### 8.1 待确认问题的方案选择

#### 统一语义是否等于同一协议接口?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Step 3 固定统一 SandboxService / RPC / SDK。 | 会提前锁定接口外形和实现组织。 |
| 方案 B | Step 3 只固定统一 sandbox 语义,协议外形后续交互和详细设计决定。 | 防止跨调用方第二语义,同时不越过后续 Step。 |

推荐方案 B。

#### policy 相关职责如何表达?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | sandbox 拥有 allowlist / policy truth 并负责策略生成。 | 会打穿 governance / capability / tools 策略来源边界。 |
| 方案 B | sandbox 执行给定 launch / isolation policy,记录执行裁定并 fail closed。 | 保留安全职责,不吞并 policy truth。 |

推荐方案 B。

#### 输出与观测材料是否属于 sandbox 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完全排除,由 artifact / observability 自行收口。 | 调用方可能形成第二套结果回收链,cleanup guard 无法成立。 |
| 方案 B | sandbox 负责 capture / handoff fact 和材料边界,下游正式 truth 仍由各自仓拥有。 | 能承接核心闭环,同时保护 truth owner。 |

推荐方案 B。

---

## 9. 结构化中间产物

### 9.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 受控执行请求正式受理与拒绝归责 | 做 | 这是正式 sandbox 执行入口成立的前提。 |
| execution environment identity 与责任链绑定 | 做 | 若缺失该职责,执行无法被稳定归责、追溯或拒绝。 |
| 跨调用方统一 sandbox 语义承载 | 做 | 否则 tools、runtime、member-service、runner 会各自形成第二套隔离语义。 |
| 正式隔离环境建立、拒绝建立和生命周期收束 | 做 | 真实执行必须在正式隔离边界内发生。 |
| resource / filesystem / network / process coherent boundary 承载 | 做 | 隔离限制必须作为同一组边界成立。 |
| 限制可落实性校验与保守拒绝 | 做 | 后端不支持或无法验证时不得继续执行。 |
| 给定 launch / isolation policy 执行裁定 | 做 | sandbox 负责执行给定策略并记录结果,不是策略来源。 |
| policy 缺失、冲突、不支持和越权动作 fail-closed | 做 | 高风险动作不得在策略不完备时继续。 |
| 输出、候选材料和结果语境 capture / handoff | 做 | sandbox 负责捕获和交接材料,不宣布下游正式 truth。 |
| usage / audit / observability material 分层交接 | 做 | 本仓形成可消费材料,不拥有观测存储。 |
| timeout / deny / kill / cancel / backend failure / capture failure 分类 | 做 | 非 happy path 必须有稳定隔离层失败语义。 |
| control 动作和非 happy path 材料留痕 | 做 | 控制动作必须可追溯,不能只靠调用方日志。 |
| lease / orphan / reaper / cleanup guard | 做 | 隔离环境不能托管外运行或先删关键材料。 |
| redline containment 与安全调查交接材料 | 做 | 安全红线必须保守收束并可审计。 |
| backend capability 摘要消费与边界可落实性判断 | 做 | 承载能力摘要服务边界判断,不成为 backend truth。 |
| 工具语义执行和工具结果归一化 | 不做 | 这些 truth 属于 `L2-tools`。 |
| runtime execution truth、agent loop、recover 和结果回流 | 不做 | 这些 truth 属于 `L2-runtime`。 |
| member host lifecycle 与 SandboxBinding 装配结果 | 不做 | 这些 truth 属于 `L2-member-service`。 |
| identity / work / runner 产品 truth | 不做 | sandbox 只消费引用或摘要,不拥有外部正文。 |
| Artifact 正文、baseline、formal evidence 和制品入库决策 | 不做 | sandbox 只捕获候选材料和 handoff fact。 |
| observability store、trace query、retention 和 alert stream | 不做 | sandbox 只提供可交接观测材料。 |
| policy definition、approval、allowlist、capability 和 policy DSL | 不做 | sandbox 执行给定策略,不得成为策略定义来源。 |
| RunnerRun、产品 UI、output preview 和控制台体验 | 不做 | 这些属于 runner 或上层产品入口。 |
| backend 产品生命周期、部署拓扑和配置 key | 不做 | 后端是运行承载,不是 sandbox truth owner。 |
| 镜像构建、成员镜像资产和供应链构建 | 不做 | 这些属于 member-images、member-service 或供应链边界。 |
| execution environment identity 与 identity truth 边界 | 易混淆职责 | 执行环境身份不是成员身份生命周期。 |
| sandbox execution isolation truth 与 runtime ExecutionInstance 边界 | 易混淆职责 | 隔离层执行事实不能替代 runtime 正式执行主线。 |
| sandbox bind material 与 member-service SandboxBinding 边界 | 易混淆职责 | 隔离层绑定反馈不是宿主装配 truth。 |
| given policy execution 与 policy definition / approval 边界 | 易混淆职责 | 执行裁定不能反向生成策略来源。 |
| candidate material 与 Artifact / ToolInvocationResult 边界 | 易混淆职责 | 捕获材料不是正式制品或工具结果 truth。 |
| observability material 与 observability ledger 边界 | 易混淆职责 | 观测材料不是物理观测存储。 |
| failure / cleanup fact 与 runtime recover / investigation lifecycle 边界 | 易混淆职责 | 隔离层收束不等于运行恢复或正式调查闭环。 |
| backend capability summary 与 backend product truth 边界 | 易混淆职责 | 能力摘要只服务判断,不接管承载产品生命周期。 |
| 统一 sandbox 语义与同一协议外形边界 | 易混淆职责 | 语义统一不等于 Step 3 固定 RPC / SDK。 |
| inspect / replay / operator control 与 truth mutation 边界 | 易混淆职责 | 外围增强不得成为隐藏写源。 |

### 9.2 做 / 不做清单

| 类型 | 清单 |
|---|---|
| 做 | 正式受理与拒绝归责;execution environment identity 与责任链;跨调用方统一 sandbox 语义;正式隔离环境生命周期;resource / filesystem / network / process coherent boundary;限制可落实性校验;给定 policy 执行与 fail-closed;capture / handoff;usage / audit / observability material;失败分类;control 留痕;lease / orphan / reaper / cleanup guard;redline containment;backend capability 摘要消费 |
| 不做 | tools semantic execution;runtime ExecutionInstance / agent loop / recover;member host lifecycle / SandboxBinding truth;identity / work / runner product truth;artifact formal truth;observability store;policy definition / approval / allowlist / capability / DSL;runner UI / run state / preview;backend product lifecycle / deployment / config;image build / supply chain |
| 易混淆职责 | execution identity vs identity truth;sandbox isolation truth vs runtime execution truth;sandbox bind material vs host binding truth;policy execution vs policy definition;candidate material vs artifact / tool result truth;observability material vs observability ledger;cleanup fact vs recovery / investigation lifecycle;backend summary vs backend product;semantic unity vs protocol shape;inspect / replay vs mutation path |

### 9.3 边界红线清单

| 红线 | 说明 |
|---|---|
| 不得把宿主直跑、调用方本地执行、旁路执行或匿名执行写成正式 sandbox 执行 | 否则受理入口和隔离边界失效。 |
| 不得在执行完成后补造 execution environment identity、责任链或 policy 语境 | 否则归责和审计链失真。 |
| 不得让 resource / filesystem / network / process 任一必需限制 silent degrade 后继续执行 | 否则 coherent boundary 失效。 |
| 不得在 policy 缺失、冲突、不支持、不可解析或越权时 permissive fallback | 否则 fail-closed 失效。 |
| 不得由 sandbox 生成 allowlist、approval、policy definition、capability 或 policy DSL truth | 否则策略来源边界被打穿。 |
| 不得把输出、候选材料或 observability material 静默提升为 Artifact、baseline、evidence、ToolInvocationResult 或 observability store truth | 否则 capture / handoff 分层失效。 |
| 不得让观测日志、trace 或 metric 代替 capture / handoff 成功事实 | 否则 capture failure 会被掩盖。 |
| 不得在关键材料安全交接前由 cleanup / reaper 先删除 capture / audit / investigation material | 否则证据链被主动破坏。 |
| 不得让租约到期、孤儿环境或 redline 事件在托管恢复路径之外继续运行 | 否则 cleanup / redline containment 失效。 |
| 不得让 redline 只停留在 advisory-only 提示 | 否则安全红线无法阻断扩散。 |
| 不得让调用方、backend 或下游消费方形成第二套执行 / policy / capture / cleanup 语义 | 否则平台出现冲突真相。 |
| 不得让外部正文或外部 truth 正文进入 sandbox truth 生命周期 | 否则 execution isolation truth ownership 被污染。 |
| 不得让 query、preview、inspect、trend、dashboard 或 maintenance 路径反写 execution isolation truth | 否则读侧或运维增强成为隐藏写源。 |

### 9.4 对后续 Step 的承接要求

| 后续 Step | 本步交接边界 |
|---|---|
| Step 4 系统边界与上下文 | 只能把本步职责转成外部关系、输入面和输出面,不得改变 truth owner。 |
| Step 5 限界上下文与子域划分 | 子域必须围绕本步“做”的职责组织,不能从旧目录或 backend 产品反推。 |
| Step 7 依赖方向 | 所有相邻仓关系必须按本步“不做 / 易混淆职责”裁剪编译期、运行期和事件协作。 |
| Step 8 数据所有权 | truth / snapshot / ref / forbidden body 必须承接本步职责归属,不能扩大为外部正文保存。 |
| Step 9 关键交互 | 交互必须保护 capture / handoff、failure / cleanup 和 fail-closed 语义,不得写出第二套正式语义。 |

---

## 10. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §9 的结构化结论。

```md
## 4. 职责边界

> 校准来源:
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界红线清单”小节,了解本章如何区分 Sandbox 做什么、不做什么和最易混淆的仓际职责。

正式章节应摘录:

- `design-calibration/01_arch_step_03_responsibility_boundary.md` §9.1 职责边界表。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §9.2 做 / 不做清单。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §9.3 边界红线清单。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §9.4 对后续 Step 的承接要求。
```

---

## 11. 待确认事项

本步不新增阻塞 Step 4 的职责缺口。下列事项继续挂入后续 Step,不得在职责边界中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-SBX-ARCH3-001 | 具体 isolation backend 组合和允许环境边界 | 后续 Step 6 / Step 10 / 04 / 07 收敛;当前只固定职责边界。 |
| Q-SBX-ARCH3-002 | policy / authorization 来源矩阵 | 后续 Step 4 / Step 9 / 03 收敛;当前只固定“给定 policy + fail closed”。 |
| Q-SBX-ARCH3-003 | capture / handoff ack、pending、failed 的协议形态 | 后续 Step 9 / 03 / 04 收敛;当前只固定 handoff fact 和 cleanup guard。 |
| Q-SBX-ARCH3-004 | Runner、runtime、member-service、tools 是否使用同一协议外形 | 后续 Step 9 / 03 收敛;当前只固定统一 sandbox 语义。 |
| Q-SBX-ARCH3-005 | inspect / replay / operator control 是否进入当前实施主线 | 后续 Step 13 / Step 14 / 07 收敛;当前仍为外围增强。 |

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答 Step 3 五个 SOP 问题 | pass | 见 §5.1~§5.5。 |
| 是否形成职责边界表 | pass | 见 §9.1。 |
| 是否形成做 / 不做清单 | pass | 见 §9.2。 |
| 是否形成边界红线清单 | pass | 见 §9.3。 |
| 是否避免系统上下文图 / 子域 / 容器 / 数据矩阵 / 协议 / 实现细节 | pass | 本步未画上下文图,未写容器部署、schema、状态机、配置 key 或代码组织。 |
| 是否将旧 README / 旧 `01` 作为 historical material 而非新版结论 | pass | 见 §6。 |
| 是否发现阻塞 Step 4 的上游 blocker | pass | 未发现阻塞 Step 4 的上游 blocker;`04` / `07` 缺失仍为 downstream blocker。 |
| 是否允许进入 Step 4 | pass_wait_review | 本步完成后等待用户审查;用户确认后才能启动 Step 4 `系统边界与上下文`。 |

本步完成后,`01-架构设计.md` 仍不得改写。下一步若用户确认,应读取本文件、`01_architecture_calibration_flow.md`、正式 `00-需求文档.md`、架构 SOP Step 4、架构书写规范 §4.5,再创建 `01_arch_step_04_system_context.md`。
