# L2-runtime 02 概要 Step 10: 异常与边界场景轮廓

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 10 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 8 关键处理流、Step 9 状态定义与迁移、Step 3 fail-closed / history / unknown 约束 |
| 目标 | 只点名会改变主流程、组成部分协作或状态理解的异常与边界轮廓，明确当前安全姿态和下沉详细设计的内容 |
| 禁止 | 完整错误码、retry 参数、补偿脚本、恢复实现、运维手册、将风险清单替代异常轮廓 |

## 1. 异常与边界场景轮廓表

| 异常 / 边界场景 | 影响哪些部分 / 流程 | 当前轮廓口径 | 说明 |
|---|---|---|---|
| trigger actor / scope / source 缺失或冲突 | Entry & Control -> Run admission | 不进入 active；返回 rejected / waiting / blocked | 入口不能从 display text、自有 allowlist 或产品状态推断正式主体 |
| 幂等键重复但原请求结果未知 | Entry、Run、History | 返回既有可证明结果或保持 unknown；不得创建第二 run | admission identity 与 local commit unknown 必须分开处理 |
| goal / definition ref stale 或不可用 | Run & Goal-Plan、Context | progress 进入 waiting / blocked；不能写 completed | Runtime 只消费 Method / Goal ref，不复制正文 |
| working context 超出预算或候选冲突 | Context & Memory -> Model | 形成 partial / rejected composition 与 omission / gap | 当前只需明确组合不能静默截断或引入未授权来源 |
| durable memory owner unavailable / pending | Context & Memory、Model | working-only、degraded 或 unavailable；不声明 durable read / write | 上游 `L2R-UP-005` 持续 pending |
| source snapshot partial、stale 或 completeness unknown | External Truth Views、所有 guard | 不形成无条件 positive decision；保留 SourceAvailability | digest / ref 不能当正文或完整证据 |
| model adapter route / result 未知 | Model Decision、Run progression | ModelTurn -> unknown / blocked；不直接形成 ActionDecision | provider route / secret / cost 不归 Runtime |
| model result late / duplicate / out-of-order | Model Decision、History、Run | 追加 linked-new-fact 或 ignored，不逆写 turn / decision | identity、correlation、causation、ordering 是前置 |
| action precondition missing / stale / conflict / unknown | Action & Delegation | ActionPreconditionDecision -> waiting / denied / unknown；不得 dispatch | Tools / Capability / Governance / Sandbox 只通过 typed seam |
| external action acknowledged 但 execution / receipt unknown | Action、Checkpoint / Recovery | SideEffectMarker -> unknown；recovery -> manual_review / block | ACK 不等于 completed；禁止盲 retry |
| external action feedback late / duplicate | Action、Run、History | 新 ActionFeedbackRecord 或 ignored；不能覆盖新 progress / outcome | 保护 immutable history |
| parent / child scope 或 budget 越界 | Delegation、Run | Delegation rejected / blocked；child 不创建或不推进 | 不共享 mutable context，不接管 member lifecycle |
| child result 未闭合或 incorporation unknown | Delegation、Run / Recovery | parent waiting / blocked；不把 child completion 当 parent success | 需新 verified result 才形成 progress |
| checkpoint stable candidate 依赖未提交 | Checkpoint、Recovery | RuntimeCheckpoint preparing / blocked；不得挂到 stable_checkpoint_id | repository call 不证明提交 |
| checkpoint commit / atomicity unknown | Checkpoint、Run、Recovery | checkpoint unknown；Run unknown 或 manual_review；不普通 retry | `L2R-CP-001` 持续 blocker |
| no valid stable checkpoint during recovery | Recovery、Run | RecoveryDecision wait / block / manual_review；不能宣称 resume | restart 也必须是新决定，不是补偿执行 |
| local outcome 形成但 outbound handoff 未提交 | Outcome、Handoff、Views | outcome 保持 local truth；HandoffAttempt candidate / gap open | local commit first，传播独立 |
| handoff submitted / acknowledged unknown | Handoff、Query、Reconciliation Job | HandoffAttempt unknown；HandoffGap open / unknown_gap | 不能把 delivery 或 ack 映射业务完成 |
| projection stale / rebuilding / gap | Safe Runtime Views、Query | 返回 stale / rebuilding / degraded / unknown；不伪造 current | projection 只读且可重建 |
| Observability / Bus consumer 不可用 | Outbound、Safe Views、Observability seam | local commit 保留；event pending / delivery gap / view stale | 不将 observed readiness 反写 RuntimeOutcome |
| forbidden body / secret / raw provider response 误进入输入 | Context、Model、Checkpoint、Event、View | 在边界拒绝或裁剪；不得写入 Runtime truth | 只保留 ref / digest / redacted marker / safe category |
| 上游 contract 处于 pending 但配置要求正向运行 | 全部相关 flow / state | 忽略正向配置企图，保持 candidate / blocked / fail-closed | 配置不能改变 owner、红线或 readiness |
| 语言、持久化、协议承载未选择 | 全部概要结构 | 维持语言中立对象 / 接口；不推断实现事实 | `L2R-LANG-001` 不应被旧 Python / Rust 材料覆盖 |

## 2. 异常影响图

#### Unknown side effect 影响图

```text
External action / checkpoint commit
  │ result unknown
  ▼
SideEffectMarker / RuntimeCheckpoint = unknown
  │
  ├─► Action / Run cannot enter ordinary retry or success
  ├─► RecoveryDecision = wait / block / manual_review
  ├─► RuntimeOutcome = unknown or pending handoff eligibility
  └─► SafeRuntimeView exposes unknown / gap
```

关键说明：
- unknown 是本地正式状态，不是瞬时 transport error 的别名。
- 该图只说明协作和状态影响，不表达 retry 参数、补偿脚本或人工操作步骤。
- 具体 commit 查询、幂等证明和恢复策略留给详细设计。

#### Local outcome / handoff gap 影响图

```text
RuntimeOutcome committed
  │
  ├─► SafeRuntimeView / RuntimeOutcomeCommitted
  └─► HandoffAttempt candidate
          │ outbound / acknowledgement uncertain
          ▼
       HandoffGap open / unknown_gap
          ├─► Query exposes gap
          └─► ReconcileHandoffGaps Job waits for verified fact
```

关键说明：
- local outcome 不依赖 delivery / observed / acceptance 才成立。
- gap 不回滚 local truth，也不等于 external failure verdict。
- 详细设计继续展开 event / outbox、ack dedupe 和 reconciliation contract。

## 3. 异常轮廓说明

这些异常必须在概要层点名，因为它们会改变“是否进入主线”“是否能够继续”“是否可以安全恢复”和“本地结果是否可交接”的结构理解。若把 unknown、stale、pending、late feedback 或 forbidden body 留到详细设计才发现，Step 8 的处理流会被误读为默认正向闭环，Step 9 的状态也会错误压平为 active / success。当前只确认它们的断点、影响对象和 fail-closed 姿态，错误码、重试、补偿和恢复实现留给后续详细设计。

## 4. 异常与主要组成部分停审

| 组成部分 | 关键异常是否覆盖 | 对象 / 接口 / 状态影响是否明确 | 是否越入详细机制 | 结论 |
|---|---|---|---|---|
| Runtime Entry & Control | yes | admission、control、query stale / unavailable 已明确 | no | pass |
| Run & Goal-Plan | yes | missing ref、duplicate admission、progress blocked / unknown 已明确 | no | pass |
| Context & Memory Mediation | yes | budget、conflict、memory pending、snapshot partial 已明确 | no | pass_with_pending_memory |
| Model Decision | yes | adapter unknown、late result、raw body boundary 已明确 | no | pass_with_pending_adapter |
| Action & Delegation | yes | precondition、side effect、feedback ordering、scope / budget 已明确 | no | pass_with_pending_upstream |
| Checkpoint / Recovery / Handoff | yes | stable、commit unknown、gap、manual review 已明确 | no | pass_with_pending_contract |
| External Truth Views | yes | stale / unavailable / authority / completeness 已明确 | no | pass_with_pending_upstream |
| Safe Runtime Views | yes | stale / rebuilding / degraded / unknown 已明确 | no | pass |

## 5. 回填草稿

第 10 章应装配异常与边界场景轮廓表，并在正文中保留两张必要异常影响图与一段轮廓说明。正式正文只表达异常如何影响组成部分协作、处理流和状态，不写错误码、retry 参数、补偿脚本或运维动作。

## 6. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 异常影响 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | action mapping / receipt / feedback / cleanup 正向合同未闭合 | action / side effect / recovery unknown 分支 | fail-closed / manual_review candidate |
| `L2R-UP-005` | durable memory source / snapshot / freshness 未闭合 | context composition / memory availability | unavailable / degraded |
| `L2R-UP-006` | model adapter route / result 合同未闭合 | turn unknown / blocked | adapter candidate |
| `L2R-UP-007~008` | Bus / Observability runtime seam 和 readiness 未闭合 | event delivery / observed / projection gap | local truth first / no readiness claim |
| `L2R-CP-001` | checkpoint persistence / commit-unknown 未闭合 | stable / recovery | blocked / explicit unknown |

## 7. Step 10 自检与门禁

| 检查项 | 结果 |
|---|---|
| 已点名影响主流程理解的输入、核心处理、传播和只读供给异常 | pass |
| 每个场景均说明影响组成部分 / flow 与当前轮廓口径 | pass |
| unknown / pending / stale / degraded / gap / forbidden body 均保持安全姿态 | pass |
| 必要异常影响图符合统一 ASCII 图格式 | pass |
| 未下沉错误码、retry 参数、补偿脚本、恢复实现或运维手册 | pass |
| 设计风险 / 待确认未替代异常轮廓 | pass |

**Step 10 结论：** `done`。允许进入 Step 11 配置影响轮廓；必须先更新文档 flow、项目执行台账并创建 Step 11 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 12。
