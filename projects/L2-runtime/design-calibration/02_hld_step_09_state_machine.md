# L2-runtime 02 概要 Step 9: 状态定义与状态流转

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 9 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 6 对象状态集合、Step 7 状态触发接口、Step 8 关键处理流、Step 3 `HLC-L2R-010~020` |
| 目标 | 明确 Runtime 的正式状态集合、状态归属、允许 / 禁止迁移、feedback / recovery / projection 传播语义 |
| 禁止 | 状态机代码、数据库状态列、UI 展示规则、将外部 delivery / observed / approval / execution 状态并入 Runtime 状态 |

## 1. 状态机边界说明

L2-runtime 有多个相互关联但不合并的局部状态集合，不设一个压平所有外部生命周期的总状态机。`ControlledRun` 是主运行状态承载；`ModelTurn`、`ActionDecision`、`RuntimeCheckpoint`、`RuntimeOutcome`、`HandoffAttempt`、`ProjectionState` 各自保留独立状态。Tools execution、capability exposure、governance approval、sandbox isolation、observability observed、artifact acceptance 和 delivery 均由外部 owner 承载，Runtime 仅通过 reference / feedback / availability / gap 影响自身状态。

## 2. 状态定义表

### 2.1 Runtime Entry & Control / admission

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `accepted` | trigger 前置已满足，可创建 controlled run | yes | 不表示执行、审批或外部 ready |
| `rejected` | trigger 明确不允许 | no | 终止本次受理 |
| `waiting` | 等待可验证来源、输入或合同 | no | 可由新事实重新评估 |
| `blocked` | 前置冲突、缺失或 unknown，必须 fail-closed | no | 不能由本地 allowlist 绕过 |

### 2.2 ControlledRun / GoalPlanWorkspace

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `active` | run 可继续评估下一步 | yes | 仍受 scope / guard 约束 |
| `waiting` | 等待输入、外部 feedback 或 continuation | no | 不是失败或完成 |
| `blocked` | 关键前置未闭合 | no | 只能等待新事实或明确处理 |
| `cancelled` | Runtime 已本地取消推进 | no | 不代表外部副作用已撤销 |
| `completed` | Runtime 本地目标工作达到可证明终局 | no | 不等于外部 acceptance / observed |
| `failed` | Runtime 本地处理已知失败 | no | 失败原因须可回链 |
| `unknown` | 关键提交或副作用结果不可判定 | no | 禁止普通 retry / success |

### 2.3 ModelTurn / ModelDisposition

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `pending` | turn 已登记但尚未交给 adapter seam | yes | 只能转 submitted 或 blocked |
| `submitted` | 已提交 adapter candidate，等待结果 | no | 外部结果仍未知 |
| `classified` | 已形成 provider-neutral ModelDecision | yes | 可进入 action / reflect / recover 等分支 |
| `failed` | adapter 结果已知失败 | no | 可形成新 recovery decision |
| `unknown` | adapter 提交 / 结果不可判定 | no | 不得直接形成 action |
| `propose_action` | decision 提议 action | yes_with_guard | 必须经过 ActionPreconditionDecision |
| `ask_input` | 请求补充输入 | no | run 通常进入 waiting |
| `reflect` | 请求本地反思 / 修订工作状态 | yes_with_new_decision | 不保存 hidden reasoning |
| `recover` | 请求 checkpoint / recovery 评估 | yes_with_new_decision | 不直接 resume |
| `stop` | 停止当前推进 | no | 由 run 形成 local outcome |
| `blocked` | 来源或约束不足 | no | fail-closed |

### 2.4 ActionDecision / ActionPreconditionDecision

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `proposed` | 已选择动作但尚未通过执行前置 | yes_with_guard | 不是已执行 |
| `deferred` | 等待输入、资源或外部合同 | no | 可重新评估 |
| `blocked` | 前置 denied / unknown 或越界 | no | 不得 dispatch |
| `cancelled` | 本地取消 action choice | no | 不推断外部撤销 |
| `allowed` | guard 允许交给外部 seam | yes_to_dispatch_candidate | 不代表 execution success |
| `denied` | guard 正式拒绝 | no | 不能由配置绕过 |
| `waiting` | 前置尚未闭合 | no | 等新 source / decision |
| `unknown` | 无法确认前置 | no | 必须 fail-closed |

### 2.5 ActionFeedbackRecord / SideEffectMarker

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `pending` | 外部反馈尚未到达或尚未接纳 | no | run 可 waiting |
| `accepted` | 外部边界已接纳 action | no | 不等于 completed |
| `rejected` | 外部边界已拒绝 | no | 可形成新 progress / recovery |
| `completed` | 外部 owner 报告已知完成 | yes_with_incorporation | Runtime 只接纳 reference / classification |
| `failed` | 外部 owner 报告已知失败 | no | 可形成 recovery |
| `unknown` | receipt / side effect 不可判定 | no | 建立 unknown fence |
| `none` | 尚未见副作用 | yes_with_guard | 只表示当前已知事实 |
| `requested` | 已请求外部 action | no | 等 feedback |
| `compensated` | 外部 owner 报告补偿姿态 | no | Runtime 不拥有补偿实现 |

### 2.6 RuntimeCheckpoint / RecoveryDecision

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `preparing` | checkpoint 候选正在形成 | no | 不能作为 stable point |
| `committed` | 本地 stable checkpoint 已提交 | yes_for_recovery | 需满足版本 / fence 条件 |
| `invalid` | checkpoint 依赖或版本不再满足 | no | 只能形成新 decision |
| `unknown` | checkpoint 提交结果不可判定 | no | 禁止宣称 stable |
| `resume` | 可从 stable point 继续 | yes_with_guard | 形成新 progress decision |
| `restart` | 重新建立本地工作路径 | yes_with_new_decision | 不代表重复外部副作用 |
| `wait` | 等待来源或人工处理 | no | 不是失败 |
| `block` | recovery 前置不成立 | no | fail-closed |
| `manual_review` | unknown side effect / commit 需要人工判定 | no | 不由自动 retry 替代 |

### 2.7 RuntimeOutcome / HandoffAttempt / HandoffGap

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `succeeded` | Runtime 本地处理达到可证明终局 | no | 不等于 external observed / acceptance |
| `partial` | Runtime 本地仅完成部分工作 | no | handoff eligibility 另判 |
| `blocked` | 本地终局被前置阻塞 | no | 需新事实 / recovery |
| `failed` | 本地已知失败 | no | 不压平 unknown |
| `cancelled` | 本地取消 | no | 外部副作用独立 |
| `unknown` | 关键结果不可判定 | no | 不得 handoff as success |
| `candidate` | 已生成 handoff material，尚未提交 | yes_to_submission | 不表示发送 |
| `submitted` | 已交给 outbound seam | no | 等 acknowledgement |
| `acknowledged` | 外部接缝确认接收 | no | 不代表业务完成 |
| `rejected` | 外部接缝明确拒绝 | no | gap 可保留 |
| `open` | handoff gap 未闭合 | no | query / job 可见 |
| `closed` | 有新 observed / acknowledgement ref 闭合 | no | 不改写 local outcome |
| `unknown_gap` | gap 状态不可判定 | no | 保持 fail-closed |

### 2.8 Safe Runtime Views / ProjectionState / SourceAvailability

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---:|---|
| `current` | 投影追到最新可重建 local truth | yes_for_query | 只读 |
| `stale` | 投影落后但落后可识别 | yes_with_degraded_view | 不宣称最新 |
| `rebuilding` | 正在从 history 重建 | no_for_positive_claim | 可返回 rebuilding |
| `degraded` | 来源部分不可用或投影不完整 | no_for_positive_claim | 缺口显式暴露 |
| `available` | source 在声明 freshness 内可用 | yes_with_constraints | 不表示 owner readiness 全部成立 |
| `unavailable` | source 明确不可用 | no | 形成 unavailable / blocked |
| `pending` | source 合同或检查尚未闭合 | no | 不能形成正向决定 |
| `unknown` | freshness / authority / completeness 不可判定 | no | fail-closed |

## 3. 主状态流转图

#### ControlledRun 主状态流转图

```text
RuntimeAdmissionDecision.accepted
  │
  ▼
active
  ├─ ApplyRuntimeControl(cancel) ─────────────► cancelled
  ├─ missing input / pending feedback ─────────► waiting
  ├─ missing / conflict / unknown guard ───────► blocked
  ├─ terminal local decision + outcome ─────────► completed / failed
  └─ commit or side-effect unknown ────────────► unknown

waiting / blocked
  ├─ new verified source + EvaluateRunProgress ─► active
  ├─ explicit cancel ──────────────────────────► cancelled
  └─ unresolved unknown / contract pending ─────► waiting / blocked

active + RequestRecoveryDecision.resume
  └─ stable checkpoint + closed side-effect fence ► active
```

关键说明：
- 只有 accepted admission 才能进入 active；completed / failed / cancelled / unknown 都是 local Runtime posture，不映射外部生命周期。
- waiting 与 blocked 不可互换：waiting 表示可等待新输入，blocked 表示前置不成立或 unknown。
- unknown 不允许直接迁移到普通 retry、success 或 active，必须由新的 recovery / manual decision 处理。

#### ModelTurn 状态流转图

```text
pending
  │ StartModelTurn
  ▼
submitted
  ├─ verified semantic result ─► classified
  ├─ known adapter failure ────► failed
  └─ commit / result unknown ──► unknown

classified
  ├─ ModelDisposition.propose_action ─► ActionDecision.proposed
  ├─ ask_input ───────────────────────► ControlledRun.waiting
  ├─ reflect / recover ───────────────► new local decision
  └─ stop ────────────────────────────► RuntimeOutcome candidate
```

#### Action / SideEffect 状态流转图

```text
ActionDecision.proposed
  │ EvaluateActionPreconditions
  ├─ allowed ───────► dispatch candidate / SideEffectMarker.requested
  ├─ denied ────────► blocked
  ├─ waiting ───────► deferred / waiting
  └─ unknown ───────► unknown fence

SideEffectMarker.requested
  ├─ verified completed feedback ─► completed
  ├─ verified failed feedback ────► failed
  └─ uncertain receipt / timeout ─► unknown
```

#### Checkpoint / Recovery / Handoff 状态流转图

```text
RuntimeCheckpoint.preparing
  ├─ local commit proven ─────────► committed
  ├─ dependency invalid ──────────► invalid
  └─ commit result unknown ───────► unknown

RecoveryDecision
  ├─ resume + stable + fence closed ─► new progress decision / active
  ├─ restart ────────────────────────► new decision / active candidate
  ├─ wait / block ───────────────────► waiting / blocked
  └─ manual_review ──────────────────► manual_review boundary

HandoffAttempt.candidate
  ├─ submitted ───────► acknowledged / rejected / unknown
  └─ local eligibility lost ► rejected / gap open
```

#### Projection / Source 状态流转图

```text
ProjectionState.rebuilding
  ├─ history caught up ─► current
  ├─ source gap ────────► degraded
  └─ cursor unknown ────► unknown

SourceAvailability.pending / stale / unknown
  ├─ verified fresh source ─► available
  └─ failed check ─────────► unavailable / stale
```

## 4. 允许迁移清单

| 当前状态 | 触发接口 / 事实 | 允许迁移 | 约束 |
|---|---|---|---|
| admission `accepted` | `AcceptRuntimeTrigger` | `ControlledRun` -> `active` | only accepted；幂等重复不得创建第二 run |
| run `active` | `EvaluateRunProgress` | `waiting` / `blocked` / `completed` / `failed` / `unknown` | 必须有 source / causation / version |
| run `waiting` / `blocked` | verified source / control | `active` 或 `cancelled` | 新事实形成新 decision，不覆盖旧 history |
| turn `pending` | `StartModelTurn` | `submitted` 或 `blocked` | context 必须冻结 |
| turn `submitted` | `ConsumeModelAdapterResult` | `classified` / `failed` / `unknown` | 只接纳可验证 semantic result |
| action `proposed` | `EvaluateActionPreconditions` | `allowed` / `denied` / `waiting` / `unknown` | unknown fail-closed |
| side effect `requested` | external feedback consumer | `completed` / `failed` / `unknown` | feedback identity / ordering 必须匹配 |
| checkpoint `preparing` | `CommitRuntimeCheckpoint` | `committed` / `unknown` / `invalid` | commit-unknown explicit |
| recovery request | `RequestRecoveryDecision` | `resume` / `restart` / `wait` / `block` / `manual_review` | stable point / side-effect fence |
| outcome candidate | `FinalizeRuntimeOutcome` | `succeeded` / `partial` / `blocked` / `failed` / `cancelled` / `unknown` | local truth first |
| handoff `candidate` | outbound seam / ack consumer | `submitted` / `rejected` / `unknown` | candidate 不等于 delivery |
| gap `open` / `unknown_gap` | `ConsumeHandoffAcknowledgement` / reconciliation job | `closed` 或保持 open / unknown | 必须有 observed / acknowledgement source |
| projection `rebuilding` | rebuild job | `current` / `stale` / `degraded` / `unknown` | 只从 committed history 重建 |
| source `pending` / `stale` | refresh / external event | `available` / `unavailable` / `stale` / `unknown` | freshness / authority 可解释 |

## 5. 禁止迁移清单

| 禁止迁移 | 原因 |
|---|---|
| `accepted` -> `completed` | admission 不是执行或完成 |
| `waiting` / `blocked` -> `completed` 无新 verified fact | 缺前置不能伪造终局 |
| `unknown` -> `active` / `success` / 普通 retry | 未知副作用 / 提交结果可能重复 |
| `ActionDecision.proposed` -> `completed` | action choice 不拥有 execution truth |
| `ActionPreconditionDecision.unknown` -> `allowed` | fail-closed 红线 |
| `ModelTurn.submitted` -> `ActionDecision.allowed` 无 classified decision | provider response 未形成 Runtime semantic decision |
| `checkpoint.preparing` -> `stable` 无 committed proof | repository call 不等于持久化 |
| `HandoffAttempt.acknowledged` -> `RuntimeOutcome.succeeded` | delivery / acknowledgement 不改写 local outcome |
| `HandoffGap.open` -> `closed` 无 observed / acknowledgement source | gap 不能自闭合 |
| `ProjectionState.stale / degraded / unknown` -> `current` 无 rebuild evidence | 视图不得伪造新鲜度 |
| external observed / approval / artifact verdict -> local run status 直接覆盖 | owner separation 失效 |
| late / duplicate / out-of-order feedback -> 旧 decision / outcome 原地覆盖 | history immutable |

## 6. 状态传播关系

```text
Committed local state / history
  │
  ├─► SafeRuntimeView / ProjectionState (current | stale | degraded | unknown)
  ├─► Outbound safe events (delivery independent)
  ├─► Recovery / Handoff jobs (new decision only)
  └─► Query surface (gap / pending / unknown visible)

External feedback / acknowledgement / availability
  │
  └─► typed inbound consumer -> new local record / decision
       (never direct overwrite of prior truth)
```

状态传播说明：
- RuntimeOutcome 提交后可生成 `RuntimeOutcomeCommitted`，但不等待 Observability observed、Artifact verdict 或 downstream acceptance。
- projection 与 outbound event 都是 committed local fact 的派生物，失败只造成 stale / gap / pending。
- external state 只通过 ActionFeedbackRecord、SourceAvailability、HandoffGap 等对象影响后续本地决定。

## 7. 按主要组成部分状态归属停审

| 组成部分 | 状态归属 | 触发接口 / 流是否存在 | 允许 / 禁止迁移 | 结论 |
|---|---|---|---|---|
| Runtime Entry & Control | AdmissionDisposition、control posture | `AcceptRuntimeTrigger`、`ApplyRuntimeControl` | accepted 才建 active；unknown 不放行 | pass |
| Run & Goal-Plan | `RunStatus`、`GoalPlanProgress` | `EvaluateRunProgress`、control / recovery flows | active / waiting / blocked / terminal 分离 | pass |
| Context & Memory Mediation | WorkingContext、WorkingMemory、SourceAvailability | `ComposeWorkingContext`、memory event / refresh | unavailable / stale / unknown 不正向推进 | pass_with_pending_memory |
| Model Decision | ModelTurnStatus、ModelDisposition | `StartModelTurn`、adapter result event | classified 后才可 action；unknown 不盲用 | pass_with_pending_adapter |
| Action & Delegation | ActionDisposition、PreconditionDisposition、EffectState、DelegationStatus | proposal / guard / feedback / delegation flows | choice / guard / effect 分层 | pass_with_pending_upstream |
| Checkpoint / Recovery / Handoff | CheckpointStatus、RecoveryDisposition、OutcomeDisposition、HandoffAttemptStatus、GapDisposition | checkpoint / recovery / outcome / handoff flows | stable / unknown / gap 独立 | pass_with_pending_contract |
| External Truth Views | SnapshotCompleteness、AvailabilityStatus | resolve / capture / external change flows | partial / unavailable / pending / stale 不冒充 available | pass_with_pending_upstream |
| Safe Runtime Views | ProjectionStatus、SafeRuntimeView status | rebuild / query flows | rebuilding / stale / degraded / unknown 可见 | pass |

## 8. 跨状态一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 状态单一归属 | pass | 每个状态集合回指一个对象 / 组成部分；近义状态不共享 owner。 |
| 触发覆盖 | pass | 允许迁移均能回指 Step 7 接口和 Step 8 处理流。 |
| unknown / pending / blocked | pass | 三者未被压平为 success、active 或普通 retry。 |
| local / external state separation | pass | delivery、observed、approval、execution、artifact acceptance 不进入 RunStatus。 |
| feedback / late ordering | pass | 新事实追加，旧 decision / outcome 不逆写。 |
| propagation | pass | committed local truth 才传播至 projection / outbound；失败形成 gap / degraded。 |
| parent / child | pass | DelegationStatus 与 parent RunStatus 独立，child completion 需 incorporation。 |
| unresolved state conflict | none | 未发现同名状态的 owner 冲突；pending contract 已显式标注。 |

## 9. 回填草稿

第 9 章应装配状态边界说明、状态定义表、主状态流转图、允许 / 禁止迁移清单和传播关系。正式正文只保留已收口的状态语义与迁移，不写状态机实现、数据库列或 UI 映射。

## 10. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 影响状态 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | tools / capability / governance / sandbox feedback 与 cleanup seam 未闭合 | Action / Effect / Recovery 状态 | pending / fail-closed |
| `L2R-UP-005` | durable memory availability / freshness owner 未闭合 | WorkingMemory / SourceAvailability | pending / degraded |
| `L2R-UP-006` | model adapter result / route owner 未闭合 | ModelTurn / ModelDisposition | blocked / unknown |
| `L2R-UP-007~008` | Bus / Observability runtime-specific state propagation / readiness 未闭合 | Handoff / Projection / outbound propagation | event candidate / no readiness claim |
| `L2R-CP-001` | checkpoint commit / stable proof 物理合同未闭合 | Checkpoint / Recovery | unknown / blocked |

## 11. Step 9 自检与门禁

| 检查项 | 结果 |
|---|---|
| 已明确本仓为多局部状态集合，无压平外部生命周期的总状态机 | pass |
| 状态定义表覆盖八个主要组成部分与关键对象 | pass |
| 主状态流转图、允许迁移和禁止迁移清单已输出 | pass |
| 所有状态触发可回指 Step 7 接口 / Step 8 处理流 | pass |
| 状态传播关系与 projection / outbound / query 边界已输出 | pass |
| unknown / pending / blocked / stale / degraded 未被伪造成 ready / success | pass |
| 未写状态机代码、DB 状态列或 UI 规则 | pass |
| 跨状态 owner、触发覆盖、反馈顺序和传播一致性无 unresolved 冲突 | pass |

**Step 9 结论：** `done`。允许进入 Step 10 异常与边界场景轮廓；必须先更新文档 flow、项目执行台账并创建 Step 10 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 11。
