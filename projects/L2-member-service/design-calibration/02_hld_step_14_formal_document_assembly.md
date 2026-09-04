# 02 概要校准 Step 14：正式文档组装

> 状态：completed / pass
> 日期：2026-08-25
> 前序门禁：Step 1~13 completed / pass
> 本步目的：只从已停审中间产物重组正式 `02-概要设计.md`，统一术语、编号和交叉引用，并完成 historical material 污染与非伪造审计

## 1. 开工确认

| 项目 | 记录 |
|---|---|
| 执行模式 | single-agent；本项目内部严格串行；未启动、调用或委派其他 agent |
| 正式写入授权 | 用户已于 2026-08-23 明确允许完成 02；Step 1~13 全部通过，Step 14 可写正式 02 |
| 已复核规范 | `概要设计讨论流程_SOP.md` Step 14；`概要设计书写规范.md` 1~14 章、逐章校准来源、图表和正式模板规则 |
| 已复核项目输入 | 正式 00 / 01、`02_hld_calibration_flow.md`、project ledger、Step 1~13、旧正式 02 historical material |
| 本步允许动作 | 重组、润色、统一术语 / 编号、补交叉引用、形成参考表和执行审计 |
| 本步禁止动作 | 新增未讨论结论；读取或创建 03 calibration；写代码、协议 schema、DDL、产品配置、测试 / 实施结果或 readiness 证据 |

## 2. SOP 问题回答

| 问题 | 组装结论 |
|---|---|
| 已确认结论分别回填到哪里 | Step 1~13 分别回填正式 §1~§13；Step 14 提供 §14 参考及全篇组装审计。 |
| 哪些结论需拆分吸收 | 依赖 seam、pending ceiling、local / external outcome 分层同时落在 §3、§7~§10、§13；七个组成部分同时约束 §4~§9、§12，不能机械复制 Step。 |
| 哪些术语 / 编号需统一 | 统一 `CMP-MS-01~07`、`CAP-MS-01~28`、`IB-MS-001~017`、`EX-MS-001~028`、`HR-MS-001~013`、`Q-MS-001~011`、`MSVC-UP-001~009`；统一 `Host Session`、`Host Truth`、`Runtime Session` 与 `execution handoff`。 |
| 哪些必须继续挂起 | `MSVC-UP-001~008` 及其 `Q-MS-001~010` 继续 pending / blocked / waiting / placeholder；并行 sibling WIP 不得润色为双侧合同。 |
| 哪些留给详细设计 | 完整字段、完整函数签名、DTO / schema、repository / UoW、事务、错误码、route / receipt、代码目录、产品和配置数值。 |
| 参考材料如何筛选 | 只列实际用于边界、粒度、依赖分类或章节装配的正式标准、正式上游和稳定样本；draft / historical material 只在本文件记录污染审计，不作为正式 truth。 |

## 3. 14 章回填映射

| 正式章节 | 直接校准来源 | 组装时保留的收口结论 |
|---|---|---|
| §1 与上游关系 | Step 1 | direct baseline、stable upstream、sibling effect、positive ceiling |
| §2 目标与范围 | Step 2 | 结构目标、概要深度、非范围、E01~E04 扩展上限 |
| §3 约束 | Step 3 | 双锚、single writer、qualification、generation、local-first、入口权限、seam 分类 |
| §4 代码主体 | Step 4 | 两张必画图、七个业务组成部分与六类实现分层正交 |
| §5 组成部分 | Step 5 | 七个 CMP、28 capability、候选池、交互、非职责和接缝 |
| §6 关键对象 | Step 6 | 29 个对象独立轮廓、字段 / 状态 / 行为骨架、对象反查 |
| §7 接口 | Step 7 | `IB-MS-001~017`、五类正式接口、port / store seam 与权限 |
| §8 处理流 | Step 8 | 通用四路径、七部分关键流、local-first、unknown / late / gap |
| §9 状态 | Step 9 | 无全局 `HostStatus`、正交状态轴、迁移 / 传播、状态 writer 唯一 |
| §10 异常 | Step 10 | `EX-MS-001~028`、fail-closed、unknown effect、late generation、residual / gap |
| §11 配置影响 | Step 11 | 运行装配影响类别、间接影响、禁止配置化红线、03 / 04 承接 |
| §12 详细设计承接 | Step 12 | 七 CMP、29 对象、17 接口、七条流、状态 / 异常 / 配置与回退规则 |
| §13 风险 / Q | Step 13 | 13 风险与 11 Q 分表；owner、关闭条件和 positive ceiling 不隐去 |
| §14 参考 | Step 14 | 实际使用材料及用途；不列未使用资料 |

## 4. 正式文档装配结构

| 章节组 | 正文组织方式 | 不进入正文的过程内容 |
|---|---|---|
| §1~§3 | 映射表、目标 / 非范围表、约束表 | 阅读过程、旧稿诊断、Step Gate 记录 |
| §4~§5 | 必画图、组成部分总表、对象发现维度、每部分职责 / 主体 / 线索 / 非职责 / 接缝 | 逐部分停审 checklist、方案比较过程 |
| §6 | 对象候选筛选 + 29 个对象独立小节；每个对象至少有基本信息、字段 / 状态 / 行为按需和禁止事项 | 完整 schema、数据库列、Rust 类型 / trait / 实现 |
| §7 | Command、Query、Consumer、Event、Job 和 Port 分类表 | transport、HTTP / RPC / IPC、topic、完整 DTO / envelope |
| §8 | 四类通用路径 + 覆盖清单 + 关键流图；重复接口按流族合并但不漏 P0 / state-writing / consistency Job | 完整调用链、SQL、错误码、retry 数值 |
| §9 | 状态适用性索引 + 七部分状态表 / 流转图 + 传播图 | 状态机代码、数据库列、UI 规则 |
| §10~§14 | 异常表、配置表、承接表、风险 / Q 表、参考表 | 实现计划、测试结果、证据、readiness |

## 5. 术语与编号统一

| 统一项 | 正式写法 | 禁止写法 / 原因 |
|---|---|---|
| 本仓定位 | 项目型成员执行宿主控制面与 Host Truth Center | “执行主脑”“工具执行器”“容器脚本”会吞并相邻 owner |
| 执行主语 | `ProjectMemberRef`；`GlobalMemberRef` 仅为一致身份锚 | 只用 GlobalMemberRef 或增加第三种主语 |
| 宿主会话 | `HostSession` / `Host Session` | `Runtime Session`、run、checkpoint 不是本仓 truth |
| 宿主动作 | `HostActionAttempt` | `RuntimeAction`、`ToolExecution`、`SandboxExecution` 会迁移 execution truth |
| 装配 | qualification + `HostAssembly` + `HostReadinessDecision` | capability mount / image content / Sandbox policy 不是本仓 truth |
| 状态 | 对象各自状态轴 | 单一 `HostStatus` 会压平 ready / active / healthy / closed / handoff |
| 交接 | material -> outbox -> handoff -> feedback layers | submitted 不等于 delivered / observed / accepted |
| 接口编号 | `IB-MS-001~017` 是需求能力覆盖，不代表 exact wire contract ready | placeholder 名称不得去除 pending 语义 |
| 上游缺口 | `MSVC-UP-001~008` open；`MSVC-UP-009` resolved for current scope | sibling WIP、fake、receipt、日志不得关闭 blocker |

## 6. Historical material 污染审计

| 旧正文主语 / 写法 | 污染类型 | Step 14 处理 |
|---|---|---|
| “成员执行宿主与运行会话 / 能力挂载 / 动作执行 / 恢复 / 反馈”旧五层 | 业务阶段、外部 owner 与实现层混合 | 删除；以七个 CMP + 实现分层双轴重建 |
| `RuntimeAction` / `ExecuteRuntimeAction` / dispatch intent | 吞并 Runtime execution handoff truth | 删除；只保留 host control intent / decision 与 host-side attempt |
| `CapabilityMount`、tool scope、actor context binding | 吞并 Identity / Tools / policy truth | 删除对象和主线；只允许资格 ref / safe summary |
| `WorkerSlot`、worker、container / pod 作为正式对象 | 产品 / 实现状态替代逻辑 Host Truth | 删除；只保留 `MemberExecutionHost` 与 adapter-neutral association |
| Tool invocation / ToolExecution handle | 吞并 L2-tools / Runtime 的逐动作执行 truth | 删除 |
| Sandbox execution / policy / capture | 吞并 L4-sandbox backend / policy truth | 删除；只保留 host-level binding / release placeholder seam |
| callback / report / logs / metrics body | 外部正文与 observability truth 入仓 | 改为 body-free material、safe summary、typed ref 和 handoff layer |
| 固定 REST / gRPC / topic / Docker / Kubernetes / DB / 性能数字 | 无当前 authority 的协议、产品或验收承诺 | 删除；只保留依赖类别与配置影响类型 |
| 旧对象、状态、repository、测试 / 指标结论 | historical material 被误当当前设计 | 不继承；仅 Step 1~13 当前结论可进入正式正文 |

污染审计结论：旧 `02-概要设计.md` 不保留任何段落作为新正文来源；Step 14 采用全量替换，不做增量修订。

## 7. 总量与追溯审计

| 审计项 | 冻结总量 | 正式装配要求 | 当前状态 |
|---|---:|---|---|
| 主要组成部分 | 7 | `CMP-MS-01~07` 名称、职责、非职责、接缝一致 | ready_for_assembly |
| Capability | 28 | `CAP-MS-01~28` 在 §5 有归属，后续对象 / 接口 / flow 可反查 | ready_for_assembly |
| 关键对象 | 29 | 不新增第 30 个业务对象；每个对象在 §6 独立出现 | ready_for_assembly |
| 正式能力接口 | 17 | `IB-MS-001~017` 在 §7 / §8 / §12 可反查；exact contract pending 保真 | ready_for_assembly |
| 异常 / 边界场景 | 28 | `EX-MS-001~028` 均有 owner 与概要口径 | ready_for_assembly |
| 设计风险 | 13 | `HR-MS-001~013` 与 Q 分表 | ready_for_assembly |
| 待确认事项 | 11 | `Q-MS-001~011` 有影响和挂起口径；不以 TODO 表达 | ready_for_assembly |
| 上游项 | 9 | 001~008 open；009 只对当前范围 resolved | ready_for_assembly |

## 8. 跨章一致性门禁

| 门禁 | 必须满足 |
|---|---|
| §5 -> §6 | 29 个“必须独立展开”候选全部在 §6 出现；ref / DTO / port 不升级为业务对象。 |
| §6 -> §7 / §8 / §9 | 所有正式对象至少被接口、流程、状态或 immutable / policy 说明承接，无孤儿对象。 |
| §7 -> §8 | P0 Command、状态写入 Consumer、关键 Job、复杂 Query 都有独立流或明确流族覆盖。 |
| §8 -> §9 | 每个状态写入点有明确 Command / Consumer / Job owner；Query 无写入。 |
| §9 -> §10 | blocked / waiting / stale / unknown / gap / residual 的异常路径有明确落点。 |
| §11 -> §12 | 只把配置实现契约方向交给 03 / 04，不预支 key、默认值或产品。 |
| §13 -> 全文 | 所有 unresolved exact contract 继续显示为 pending / blocked / waiting / placeholder。 |

## 9. 非伪造审计

正式 02 只能声明“概要结构已收稳并可交给详细设计继续展开”。它不能声明下列任何事实：

- 实现仓、源码目录、commit、branch 或 dependency target 已存在。
- Runtime / Member / Images / Sandbox / Bus / SDK 的双侧 exact contract 已闭口。
- adapter / fake / placeholder 已通过真实集成。
- run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness 已形成。
- publish submitted 已 delivered，日志已 written 即 observed，consumer receipt 即 accepted。

当前非伪造结论：正式 02 只声明概要结构已收稳并可交给详细设计继续展开；没有实现、集成、测试、证据或 readiness 结论。

## 10. 参考材料表草稿

| 参考材料 | 用途 |
|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | 约束 Step 1~14 串行讨论和正式装配门禁。 |
| `standards/document/概要设计书写规范.md` | 约束 14 章结构、逐章来源、对象 / 接口 / 图表深度。 |
| `standards/document/设计文档编写通则.md` | 约束正式设计文档的基本表达与边界。 |
| `standards/document/设计文档讨论中间产物规范.md` | 约束 project ledger、flow、Step 文件和三层门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 约束 truth、owner、状态、事务和实施承接的非伪造闭环。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 约束 compile / runtime / event / ref / adapter / fake seam。 |
| `projects/L2-member-service/00-需求文档.md` | 提供 C-MS-1~5、项目型双锚、功能边界和 IB-MS-001~017。 |
| `projects/L2-member-service/01-架构设计.md` | 提供 Host Truth Center、A / S / P、依赖、数据、一致性和运行边界。 |
| `projects/L2-runtime/00~07`、`projects/L2-tools/00~07` | 校验 Runtime 与 Tools owner，排除 LLM loop、goal / plan、tool execution。 |
| `projects/L1-identity/`、`projects/L1-work/`、`projects/L4-sandbox/` 当前正式文档 | 校验成员身份、项目成员和 Sandbox owner / ref 边界。 |
| `projects/L0-core/`、`projects/L0-bus/`、`projects/L0-sdk/` 当前正式文档 | 校验共享类型、事件和 SDK 依赖类别及 pending 上限。 |
| `projects/L2-member/`、`projects/L2-member-images/` 已生效正式边界 | 仅承接已停审的 owner / supply 方向；并行 WIP 不作为 exact contract。 |
| `projects/L1-governance/02-概要设计.md`、`projects/L1-artifact/02-概要设计.md` | 只作为正式概要设计粒度与装配样式参考。 |

## 11. Step 14 Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 14 章正式结构 | pass | §1~§14 均存在，顺序与概要设计规范一致。 |
| 逐章校准来源 | pass | §1~§14 均引用具体 `02_hld_step_*` 中间产物并给出延伸阅读入口。 |
| 主要组成部分 | pass | `CMP-MS-01~07` 共 7 个，职责、代码主体、对象线索和非职责一致。 |
| 关键对象总量 | pass | 29 个对象均独立出现在 §6；未新增第 30 个业务对象。 |
| 接口总量与分类 | pass | `IB-MS-001~017` 共 17 个，Command / Query / Consumer / Event / Job / Port 分类完整。 |
| 处理流覆盖 | pass | P0 Command、状态写入 Consumer、关键 Job、复杂 Query 均有独立图或覆盖说明。 |
| 状态与传播 | pass | 无全局 `HostStatus`；状态 writer、允许 / 禁止迁移和 source -> derived 传播边界清楚。 |
| 异常总量 | pass | `EX-MS-001~028` 共 28 个，均有 owner 落点和 fail-closed / unknown 口径。 |
| 配置边界 | pass | 只写影响类别；禁止配置化 owner、状态、no-fallback、安全和审计红线。 |
| 风险 / 待确认分离 | pass | `HR-MS-001~013` 共 13 条风险，`Q-MS-001~011` 共 11 条待确认，未混写任务。 |
| 历史污染 | pass | 旧五层、worker、RuntimeAction、CapabilityMount、Tool / Sandbox execution、产品 / 协议 / 数字未作为正式结论继承。 |
| blocker 保真 | pass_with_blockers | `MSVC-UP-001~008` 和 sibling exact contract 仍 pending / blocked / waiting；`MSVC-UP-009` 仅当前范围 resolved。 |
| 非伪造 | pass | 未声明实现仓、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff、integration success 或 readiness。 |
| 写入范围 | pass | 仅修改 `projects/L2-member-service/`；未修改兄弟项目、未实现代码、未提交 commit。 |

总量审计命令结果：章节 14、对象 29、接口 17、异常 28、风险 13、待确认 11、校准来源 14，均与冻结结论一致。

```text
step_14_status = completed
step_14_gate = pass
formal_02_write_allowed = false_after_stop_review
formal_03_write_allowed = false
next_allowed_action = stop_review_and_wait_for_explicit_user_confirmation
```
