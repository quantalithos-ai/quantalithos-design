# L5-sync 架构 Step 9 · 关键交互与通信方式

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 9 |
| 输入 | Step 4 系统上下文、Step 6 运行单元、Step 8 数据与一致性 |
| 回填章节 | 正式 01 §10 |
| 下一步 | Step 10：关键技术选型 |

## 2. Step 内计划

- [x] 逐架构单元定义同步调用、异步事件、后台任务、补偿/探测和失败降级。
- [x] 只讨论通信方式与边界理由，不下沉 API、DTO、事件 schema 或时序协议。
- [x] 核对通信方式与数据所有权、一致性和依赖方向相容。
- [x] 输出关键交互表、通信判断、简化交互图和停审审计。
- [x] 保留 owner contract 未闭合项，不用 ACK/HTTP 200/日志关闭 blocker。

## 3. 本步输入

| 输入 | 承接 |
|---|---|
| Step 4 | owner 输入/输出面与失效降级 |
| Step 6 | entry、orchestration、recovery/probe、local state 与 SDK/Git 边界 |
| Step 8 | local strong consistency、external eventual、handoff/decision 分层 |
| 正式 00 §7、§10、§12~§14 | 核心闭环、业务规则、接口能力、NFR 与验收 |

## 4. SOP 问题回答

### 4.1 哪些交互适合同步能力边界？

显式选择与访问资格检查、source/version read、status observation、source comparator/manifest read、Git/fs observation、local metadata/checkpoint read/write、handoff prepare/call/probe/read-decision 都需要同步能力边界，因为调用方必须获得明确结果或安全阻断。同步不代表已改变外部 truth。

### 4.2 哪些交互适合异步事件？

当前主路径不直接依赖任意内部事件。若未来 SDK 正式提供受控 event/notification，它只适合提示 source/posture/review 状态变化或触发 stale 标记，不能直接应用 working copy、推进 cursor 或决定 accepted。事件协作需有正式 owner contract 后才进入主链。

### 4.3 哪些适合后台任务/补偿？

长时 materialization、checkpoint continuation、unknown outcome probe、局部重试、诊断刷新和 telemetry export 可以由后台/可续工作单元承接；它们必须读受控 state、产生显式 local transition，并受同样的权限、dirty、source drift 和 idempotency 门禁约束。

### 4.4 关键依赖失效时如何降级？

权限/姿态/source/comparator 不可读：blocked；Git/fs dirty或apply outcome unknown：paused/manual; handoff call unknown：probe/pending; Review decision 未返回：仍为 pending/unknown；Archive/Observability 失效：只降级 posture/diagnostic；任何失败均不能以 transport/log/cache 改写业务成功。

## 5. 当前文档问题诊断

| 历史交互 | 问题 | 当前处理 |
|---|---|---|
| `Sync → Server` 泛化为单一 SDK 调用 | 丢失 owner、查询/变更和失败语义 | 按 selection/source/handoff/decision 分场景 |
| `Sync → Git` facade 可执行任意命令 | 可能隐式 push/merge/rebase/stash | 仅 observation/lock/path protection/atomic apply |
| `push-review` 视为一次同步调用成功 | ACK 升格为 accepted | prepare→call→probe/finalize + decision read 分层 |
| “后台任务”默认 retry | 可能盲重放外部副作用 | 只对安全、可证明等价或 probe 的阶段恢复 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 所有操作同步串行且无 checkpoint | 不采用 | 无法承载长时 materialization、断点恢复和 unknown probe。 |
| B. 同步 owner calls + 本地后台恢复/探测 + 明确事件保留 | 采用 | 匹配 local strong transition 与 external eventual 语义。 |
| C. 事件驱动自动应用所有来源变化 | 不采用 | 会绕过用户选择、dirty 保护和 Review Gate。 |

## 7. 结构化中间产物

### 7.1 关键交互场景表

| 场景 | 主参与边界 | 通信方式 | 本地状态变化 | 失败/降级 |
|---|---|---|---|---|
| explicit select/access check | Entry ↔ Selection/SDK owner | 同步调用 | 建立 session context/check attempt | unknown/denied → blocked |
| bind working copy | Application ↔ SDK source + local state + Git/fs | 同步调用 + local atomic write | 创建/更新 binding generation | dirty/metadata ambiguity → stop |
| status | Entry ↔ local state/Git/fs + optional owner read | 只读同步查询 | 不推进 cursor、不修复状态 | stale/unknown 分层显示 |
| clone/pull materialize | Application ↔ source read + comparator + Git/fs | 同步分段 + 可续后台任务 | checkpoint、apply、cursor commit | gap/dirty/conflict → pause/manual |
| conflict/recovery | Application ↔ local state/Git/fs + probe | 本地同步 + 后台 probe | conflict/checkpoint/recovery relation | no auto resolution/replay |
| push-review prepare | Application ↔ local observation + governance capability | 同步准备 | freeze candidate/handoff attempt | dirty/drift/archived → blocked |
| handoff call/probe | Application ↔ Governance via SDK | 同步 call + probe | transport/probe outcome | unknown → pending/manual |
| decision/status read | Entry ↔ Governance/Archive/Observability | 只读同步查询 | 仅更新外部 snapshot association | ACK not accepted |

### 7.2 按架构单元组织的通信判断

| 架构单元 | 同步调用 | 异步事件 | 后台任务 | 补偿/失败边界 |
|---|---|---|---|---|
| Selection & Access | owner eligibility/read | 当前不直接订阅 | 可刷新过期 snapshot，但不授权副作用 | unknown/denied fail-closed |
| Working Copy & Metadata | local state/Git/fs observation and atomic persist | 不依赖事件推进 state | checkpoint flush/repair candidate | integrity/lock failure → blocked |
| Source Materialization | source read/compare/apply capability | 未来只作 stale hint | long apply/resume | gap/dirty/mapping unknown → pause |
| Conflict & Recovery | local conflict/checkpoint/probe read | 不自动解决 | unknown probe/allowed retry | no proof of equivalence → manual |
| Review Handoff & Provenance | prepare/call/read/probe | future status hint only | timeout/probe/diagnostic retry | ACK != decision; no blind replay |

### 7.3 简化交互示意图

```text
User intent
   |
   v
Entry --sync--> selection/access owner checks
   |
   v
Application orchestration
   |                 \
   | sync read/apply   \ local atomic state
   v                   v
source boundary --> Git/fs edge --> checkpoint/cursor
   |
   +--> conflict/recovery --probe/manual--> resume or blocked
   |
   +--> freeze candidate --sync call--> Review handoff
                                      |
                                      +--> transport ACK
                                      +--> probe / decision read
```

图示说明：

1. 图表达交互类别和阶段，不表达具体 API、事件 schema 或线程模型。
2. source apply、checkpoint/cursor 和 handoff decision 是不同结果层。
3. probe/manual 分支用于 unknown outcome，不是隐式重试。

### 7.4 交互方式停审记录

| 交互 | 所有权匹配 | 正式边界 | 未下沉 schema | 失败降级 | 结论 |
|---|---|---|---|---|---|
| owner access/source read | 是 | SDK | 是 | blocked/pending | pass_with_surface_pending |
| local observation/apply | 是 | Git/fs adapter | 是 | dirty/conflict/manual | pass_with_adapter_pending |
| handoff call/probe | 是 | Governance SDK boundary | 是 | unknown/probe | pass_with_handoff_pending |
| archive/diagnostic read | 是 | Archive/Observability boundary | 是 | posture/diagnostic degraded | pass |

### 7.5 跨交互边界审计

| 审计项 | 结果 |
|---|---|
| 同步/异步选择冲突 | 无；主路径同步边界，事件只保留 future hint |
| 直接穿透 owner | 无；均经 SDK/formal seam |
| 协议细节下沉 | 无；未写路径、DTO、event schema |
| 失败降级缺口 | 无；blocked/pause/manual/pending/unknown 已覆盖 |
| ACK/decision 混淆 | 无；transport/probe/decision 分层 |

## 8. 回填草稿

正式 §10 回填 7.1~7.3；不复制本步过程性诊断与停审表。后续概要/详细设计可从场景表继续落用例和状态机，但不得回退改变架构通信语义。

## 9. 待确认事项

- SDK 精确同步 surface、错误和 probe 合同：`SYNC-UP-001/005`。
- source read/comparator/gap 和增量 cursor：`SYNC-UP-002/008`。
- Git/fs adapter 的 atomic apply 与 dirty/path contract：`SYNC-UP-010`。
- Review handoff ACK/probe/decision ref：`SYNC-UP-004/005`。

## 10. 自检与进入下一步条件

- [x] 同步、事件、后台和补偿路径均按架构单元说明。
- [x] 通信方式与数据所有权、一致性和依赖方向一致。
- [x] 未写 API/schema/DTO/事件名或时序实现。
- [x] 每个交互完成停审，跨边界无 unresolved 冲突。

`gate_status = pass_with_upstream_blockers`；可进入 Step 10。
