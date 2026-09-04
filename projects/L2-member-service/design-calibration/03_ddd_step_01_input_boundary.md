# 03-详细设计 Step 1：确认概要设计输入边界

> 项目：`L2-member-service`
> 对应 SOP：`详细设计讨论流程_SOP.md` Step 1
> 状态：completed
> Gate：pass_with_upstream_blockers
> 日期：2026-08-25
> 模式：full-restart

## 1. 本步输入

| 输入 | 本步用途 | 当前判断 |
|---|---|---|
| `00-需求文档.md` | 核对功能、主语、非范围和验收红线 | 已停审，可作为需求边界 |
| `01-架构设计.md` | 核对 Host Truth、依赖方向、数据 owner、通信与一致性 | 已停审，可作为架构边界 |
| `02-概要设计.md` | 提供代码主体、七个 CMP、29 对象、17 接口、流和状态骨架 | 已完成 Step 14 停审，可继续展开 |
| `02_hld_step_12_detailed_design_handoff.md` | 提供详细设计正向 ceiling、回退规则和 blocker | 已通过 `pass_with_upstream_blockers` |
| `02_hld_step_13_risks_open_questions.md` | 提供风险、Q 项和跨项目 pending | 继续挂起，不转成 ready |
| `02_hld_step_14_formal_document_assembly.md` | 提供 02 追溯与非伪造审计 | 只作为装配证据，不改变 02 语义 |
| Rust / 目录 / 真相源标准 | 约束后续实现契约写法 | Step 3~17 继续细化 |

## 2. SOP 问题回答

### 2.1 详细设计直接承接什么

本轮直接承接以下已收稳结论：

1. 项目型执行主语只有 `ProjectMemberRef`，`GlobalMemberRef` 作为身份锚；其他主语 fail closed。
2. 本仓是成员执行宿主控制面和 Host Truth Center，维护本地宿主意图、决定、资格、装配、实例、注册、会话、健康、收束和事实交接。
3. control plane、Host Truth、Runtime Session、execution handoff 四层语义不合并；本仓不拥有 Runtime run / turn / outcome。
4. 七个业务组成部分为 `CMP-MS-01~07`，并映射到 Inbound / Operations、Application、Domain、Ports、Persistence / Projection、Adapters / Wiring 实现层。
5. 关键对象分母固定为 29 个；关键接口分母固定为 `IB-MS-001~017`；关键处理流为七条流族。
6. generation immutable、single-active、stable effect / publication / handoff key、late / unknown fence、local-first 和 outcome layering 是实现契约的硬约束。
7. Query no-write；Consumer 只写允许的 snapshot / matching feedback；Job 只推进已提交 work；projection / material / history / outbox 不反写 source truth。
8. `MSVC-UP-001~008` 仍是 exact contract blocker；并行 sibling 的 WIP、fake、局部 receipt 或观察信号不能关闭 blocker。

### 2.2 概要设计是否足够稳定

结论为“结构足够继续展开，但正向跨仓合同不够关闭”。02 已明确代码主体、业务组成部分、对象、接口、处理流、正交状态、异常与配置影响，满足进入详细设计的结构门槛。其不足集中在 Runtime / Member / Images / Sandbox / credential / Core / Bus / SDK 的字段级或协议级合同，因此后续只能展开本仓中立契约、placeholder、blocked / waiting / unknown 和 adapter / fake seam。

### 2.3 哪些内容仍需在 03 补清

03 必须继续闭合：

- 模块到 crate / module / file 的实现映射；
- 29 个对象的字段类型、构造函数、transition guard、revision 和不变量；
- repository、UnitOfWork、resolver、carrier、session、handoff、publisher、projection 等 port 的函数级边界；
- `IB-MS-001~017` 的 DTO / result / receipt / error 映射及 Query view / page / cursor；
- 七条流族的读集、写集、事务顺序、external port boundary、异常和 outbox / history 影响；
- 各正交状态轴的状态集合、合法 / 非法转换、CAS、late / unknown / gap 处理；
- 错误分类、并发、幂等、重入、配置注入、观测切口和测试承接；
- 何处必须停止并回退概要设计，何处只能记录 pending / blocker。

## 3. 上游关系映射

| 来源文档 / owner | 已收稳结论 | 03 继续展开 | 不能在 03 重新定义 |
|---|---|---|---|
| `00-需求文档.md` | 仓职责、C-MS-1~5、双锚、验收红线 | 将需求能力映射到对象、协议、flow、测试切口 | 用户故事、业务目标、领域 owner |
| `01-架构设计.md` | Host Truth Center、A1~A5 / S1~S3 / P1~P3、向内依赖、local-first | 模块 / 文件、port、UoW、adapter 和运行角色 | 限界上下文、数据 owner、架构取舍 |
| `02-概要设计.md` | `CMP-MS-01~07`、29 对象、`IB-MS-001~017`、7 流族、正交状态和异常 | 完整 Rust-facing 实现契约 | 新增 / 合并业务主语、对象、接口、状态 |
| `L1-identity` | GlobalMember 身份与安全引用 | `GlobalMemberRef` 输入校验和 safe summary | 成员主体 truth、授权决定 |
| `L1-work` | ProjectMember / Project 边界 | `ProjectMemberRef` 输入校验和 scope guard | 项目成员 truth、Work 状态 |
| `L2-member` | launch / register / heartbeat / status owner 方向 | placeholder adapter、signal mapping、matching outcome | Member 主体、IPC、request / report 正文 |
| `L2-member-images` | pinned supply / verification owner 方向 | qualification ref、fail-closed resolver | 镜像内容、构建、digest、provenance |
| `L2-runtime` | run / turn / loop / execution handoff owner 方向 | Host Session association、handoff placeholder | LLM loop、goal / plan、memory、checkpoint、run / outcome |
| `L2-tools` | tool execution / capability owner 方向 | typed capability / external ref seam | ToolInvocation、Capability registry、MCP / A2A / API truth |
| `L4-sandbox` | isolation backend / policy / enforcement owner 方向 | host-level binding / release port | Sandbox backend、policy、capture、cleanup truth |
| `L0-core` / `L0-bus` / `L0-sdk` | shared type、carrier、SDK compile 类别 | compile / event / adapter binding 和 fake seam | 本仓单方 shadow Core schema、Bus delivery 或 SDK ready 结论 |

## 4. 本文不再回答

- 成员身份、项目成员关系、治理批准、镜像内容与供应链、Sandbox backend、Runtime loop、Tools execution、Observability backend 和 L1 领域真相。
- 具体容器产品、编排平台、RPC / HTTP 产品、数据库、事件 topic、部署参数、性能数字和 secret 名称。
- 详细配置 key / 默认值（留给 04）、测试全集与执行结果（留给 05/06）、任务排期 / commit / implementation ledger（留给 07）。
- 兄弟项目未停审的字段、协议、凭据、反馈或 event schema；这些只登记为 blocker / placeholder。

## 5. 本文必须回答

| 主题 | 03 的回答目标 |
|---|---|
| 实现布局 | 让实现者知道 workspace / crate / module / file 的责任边界；没有实现仓时只写 planned layout |
| 对象契约 | 每个对象的类型化字段、构造 / transition 函数、来源、owner 和不变量 |
| 接缝契约 | repository / UoW / resolver / carrier / session / publisher / handoff / projection / clock / id port |
| Public surface | Command、Query、Consumer、Event、Job 的 DTO、result、receipt、error、view、page、cursor |
| 处理流 | 输入、读集、guard、事务、写集、外部 port、outcome、history / material / outbox 影响 |
| 状态与一致性 | 正交状态轴、CAS、generation fence、幂等、late / unknown / gap / residual |
| 交接 | 05/06 测试切口和 07 phase / commit boundary 所需的字段、状态、协议与 evidence placeholder |

## 6. 输入不足风险清单

| 风险 ID | 缺口 | 影响 | 当前上限与处理 |
|---|---|---|---|
| `R3-UP-001` | Runtime entry / Host Session / handoff exact contract 未闭口 | `IB-MS-008/010/016/017`、registration、session、handoff | 只写 host-side placeholder、typed ref、blocked / unknown；不伪造 Runtime API |
| `R3-UP-002` | Member launch / register / signal payload 未闭口 | registration、health、generation matching | 只写 input fingerprint、safe signal envelope 和 adapter-neutral result |
| `R3-UP-003` | Images pinned supply exact manifest 未闭口 | qualification、assembly、readiness | 缺项 fail closed；不以缓存 / fake / sibling WIP 推导 ready |
| `R3-UP-004` | Sandbox binding / cleanup contract 未闭口 | assembly、carrier、closure | 只维护 host association / attempt / residual；外部完成保持 unknown |
| `R3-UP-005` | credential、Core、Bus、SDK exact contract 未闭口 | security、public protocol、compile / integration | opaque ref、类别引用、fake seam；不声明真实集成或 compile evidence |
| `R3-UP-006` | 当前 workload / capacity / health window authority 未闭口 | Job、config、性能验证 | 只写结构性 guard 和测量字段；不写数字或 readiness |

这些风险不会被实现者自行补齐；如果后续必须改变对象、接口、状态、owner 或正向 ceiling，必须回退概要设计对应 Step。

## 7. 历史污染审计

| 历史内容 | 污染判断 | 当前处理 |
|---|---|---|
| `MemberRuntimeSession`、`WorkerSlot`、全局 `HostLifecycleState` | 把 Runtime Session / worker product state 合并进 Host Truth | 不继承；用 `HostSession`、`MemberExecutionHost` 与正交状态轴重建 |
| `CapabilityMount`、`ToolScopeBinding`、`ActorContextBinding` | 吞并 Tools / Identity / capability truth | 不建业务对象；只保留 qualification / safe ref / material 语义 |
| `RuntimeActionIntake`、`HostDispatchAction`、`ExecutionHandle` | 把 Runtime / Tools execution truth 迁入本仓 | 不继承；本仓只记录 `HostActionAttempt` 的本地 effect attempt |
| `SandboxExecutionHandle` 与 backend 状态 | 吞并 L4-sandbox isolation truth | 不继承；只保留 host-level binding / release port |
| 直接 `ExecuteRuntimeAction`、同步 tool invoke | 越过 Runtime / Tools owner | 不进入当前接口或 flow；Runtime entry 保持 pending |
| 固定产品、RPC、数据库、topic、数字 | 无当前 authority 的历史实现猜测 | 只保留 product-neutral mechanism / adapter seam |
| callback / report / metrics 正文 | 违反 body-free 与 external outcome layering | 改为 typed ref、safe summary、material、handoff、projection |

## 8. 改动前后对比

| 项目 | 历史 03 | 当前 03 输入边界 |
|---|---|---|
| 主语 | worker / action / capability / sandbox execution 混杂 | 项目型 `ProjectMemberRef` 宿主控制面 |
| 对象 | 未经当前 02 收口的旧对象全集 | 固定 29 个对象，缺口显式 blocker |
| 协议 | 直接执行、callback、固定 RPC / topic | `IB-MS-001~017` 的中立 DTO / result / receipt seam |
| 状态 | 全局 HostLifecycle / 执行状态 | 正交状态轴、generation、late / unknown / gap |
| 完成语义 | local callback / report 容易冒充完成 | local / submitted / delivered / observed / accepted 分层 |
| 依赖 | 可能写成 sibling / backend 源码依赖 | compile / runtime / event / ref / adapter / fake 分类 |

## 9. 正式回填草稿

正式 `03-详细设计.md` §1 应声明：本文承接 `00/01/02` 的已停审边界，只展开实现契约；`MSVC-UP-001~008` 继续 pending，placeholder / fake / local receipt 不得升级为 ready。正式 §17 应引用本 Step 的“不再回答 / 必须回答 / 输入不足风险”并将未闭口项交给 03 Step 18 与 07 实施交接。

## 10. Gate 自检与下一步

| 检查项 | 结果 | 证据 / 说明 |
|---|---|---|
| 上游关系映射完整 | pass | 本文件 §3，覆盖正式 00、01、02 与专项 owner |
| 详细设计边界明确 | pass | 本文件 §4~§5 |
| 输入缺口显式 | pass_with_upstream_blockers | 本文件 §6，映射 `MSVC-UP-001~008` |
| 历史材料未继承 | pass | 本文件 §7~§8；正式 03 尚未写入 |
| 未新增业务主语 / 对象 / 接口 | pass | 仅承接 02 分母和 placeholder 上限 |
| 非伪造约束 | pass | 未写实现、测试结果、artifact、report、evidence、signoff 或 readiness |
| 下一步条件 | pass | 可进入 Step 2，先收稳本轮实现范围与非范围 |

```text
step_01_status = completed
step_01_gate = pass_with_upstream_blockers
next_allowed_step = Step 2 scope
formal_03_write_allowed = false_until_step_19
```
