# Step 10：状态机与转换矩阵

> 状态：completed / pass_with_upstream_blockers
> 目标文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02
> 参考：`02_hld_step_09_state_transitions.md`、`详细设计讨论流程_SOP.md` Step 10

## 1. 状态主语筛选

本步只为拥有明确 owner、writer、触发函数和持久化语义的对象定义状态轴。以下内容不是状态：repository version、page cursor、broker offset、adapter availability、query disposition、receipt、timestamp、external backend status。不存在统一可替代所有语义的 `HostStatus`。

| 状态族 | owning object/file | writer | 触发入口 |
|---|---|---|---|
| intent acceptance | `HostIntent` / `control.rs` | Accept intent command | `AcceptHostIntentCommand` |
| decision lifecycle | `HostOrchestrationDecision` / `control.rs` | decision command | `DecideHostOrchestrationCommand` |
| qualification | `HostQualificationContext` / `qualification.rs` | qualification service | resolver result + policy |
| assembly / readiness | `HostAssembly`、`HostReadinessDecision` / `assembly.rs` | assembly service | coordinate command |
| host lifecycle | `MemberExecutionHost` / `host.rs` | generation service | establish / closure candidate |
| action attempt | `HostActionAttempt` / `action_attempt.rs` | prepare/dispatch/feedback | internal command, dispatch job, consumer |
| external association | `HostExternalAssociation` / `association.rs` | outcome consumer | matching feedback |
| registration / endpoint / session | `registration.rs`、`session.rs` | registration/session service | registration/session command |
| signal / assessment / failure | `health_signal.rs`、`health.rs` | consumer/health job | signal consumer, evaluation job |
| recovery | `recovery.rs` | recovery command | `DecideHostRecoveryCommand` |
| closure / cleanup | `closure.rs` | close command/job/feedback | close, cleanup job, feedback |
| residual / reconciliation | `reconciliation.rs` | reconciliation job/service | residual job |
| material / handoff | `material.rs` | application materialization / feedback | accepted change, handoff consumer |
| outbox / projection / history | `outbox.rs`、`projection.rs`、`history.rs` | UoW/job/append path | accepted change, publication/projection jobs |

## 2. 正交状态轴与合法迁移

### 2.1 Control、qualification、assembly

| 状态轴 | 正式值 | 合法迁移 | 触发条件 | 禁止推导 |
|---|---|---|---|---|
| `HostIntentAcceptanceStatus` | `Received` / `Accepted` / `Rejected` / `Conflicted` / `Superseded` | Received->Accepted/Rejected/Conflicted；Accepted->Superseded | command + policy + expected version | Accepted 不等于 decision/ready |
| `HostDecisionStatus` | `Proposed` / `Committed` / `Voided` / `Superseded` | Proposed->Committed/Voided；Committed->Superseded/Voided | explicit decision command | Committed 不等于 host/action success |
| `QualificationStatus` | `Pending` / `Resolving` / `Resolved` / `Partial` / `Blocked` / `Unknown` | Pending->Resolving；Resolving->Resolved/Partial/Blocked/Unknown | all required source results | Resolved 不等于 Ready |
| `HostAssemblyStatus` | `Building` / `Complete` / `Blocked` / `Superseded` | Building->Complete/Blocked；Complete->Superseded | required item set and generation | Complete 不等于 ready/active |
| `HostReadinessStatus` | `Unevaluated` / `Ready` / `NotReady` / `Blocked` / `Unknown` / `Superseded` | Unevaluated->Ready/NotReady/Blocked/Unknown；any current->Superseded | policy evaluation + same-generation facts | Ready 不等于 container/session/healthy |

`Ready` 仅当 required source/item positive、fresh、同一 project/member + host/generation 且 policy 允许；任一 unknown/stale/conflict/pending 保持非正向。

### 2.2 Host、attempt、association

| 状态轴 | 正式值 | 合法迁移 | 触发条件 | 禁止推导 |
|---|---|---|---|---|
| `HostLifecycleStatus` | `Established` / `Current` / `Closing` / `Closed` / `Superseded` | Established->Current/Closing；Current->Closing/Superseded；Closing->Closed | generation fence + closure | Current 不等于 process running |
| `HostActionAttemptStatus` | `Prepared` / `Dispatched` / `Succeeded` / `Failed` / `Unknown` / `Held` / `Superseded` | Prepared->Dispatched/ Held；Dispatched->Succeeded/Failed/Unknown；Unknown->Held | dispatch/feedback matching | Succeeded 不等于 ready/healthy |
| `HostExternalAssociationStatus` | `Pending` / `Associated` / `Stale` / `Invalid` / `Unknown` / `Released` | Pending->Associated/Unknown/Invalid；Associated->Stale/Released | formal external outcome | Associated 不等于 Runtime session active |
| generation currentness | `Candidate` / `Current` / `Historical` / `Superseded` | Candidate->Current/Historical；Current->Historical/Superseded | same-UoW current pointer guard | generation number不表示 backend version |

Unknown attempt 必须保留原 `ExternalEffectKey`；任何重试先读取 matching record 并由显式 reconciliation 决定。

### 2.3 Registration、endpoint、session

| 状态轴 | 正式值 | 合法迁移 | 触发条件 | 禁止推导 |
|---|---|---|---|---|
| registration | `Proposed` / `Accepted` / `Blocked` / `Rejected` / `Replaced` / `Invalidated` | Proposed->Accepted/Blocked/Rejected；Accepted->Replaced/Invalidated | member safe input + policy | Accepted 不等于 ready |
| endpoint | `Pending` / `Active` / `Stale` / `Invalidated` | Pending->Active/Invalidated；Active->Stale/Invalidated | safe endpoint + generation | Active 不等于 reachable |
| Host Session | `Pending` / `Associated` / `Active` / `Stale` / `Closed` / `Blocked` | Pending->Associated/Blocked；Associated->Active/Stale；Active->Closed/Stale | endpoint + formal Runtime association | Active 不等于 Runtime run |

Runtime association exact contract 未闭合时，`Associated/Active` 正向迁移不可落地；只可保留 `Blocked/Unknown/Waiting`。

### 2.4 Health、failure、recovery

| 状态轴 | 正式值 | 合法迁移 | 触发条件 | 禁止推导 |
|---|---|---|---|---|
| signal intake | `Captured` / `Accepted` / `Duplicate` / `Late` / `Stale` / `Rejected` | Captured->Accepted/Rejected/Duplicate/Late/Stale | envelope validation/order | Accepted 不等于 healthy |
| assessment | `Pending` / `Evaluated` / `Stale` / `Superseded` | Pending->Evaluated/Stale；Evaluated->Superseded | health job | Evaluated 不等于 recovery |
| failure classification | `Unclassified` / `Classified` / `Uncertain` / `Superseded` | Unclassified->Classified/Uncertain；current->Superseded | assessment basis | Classified 不等于 action |
| recovery decision | `Proposed` / `Committed` / `Voided` / `Superseded` / `Blocked` | Proposed->Committed/Blocked/Voided；Committed->Superseded/Voided | formal control + current basis | Committed 不等于 recovered |

### 2.5 Closure、reconciliation、material、publication

| 状态轴 | 正式值 | 合法迁移 | 触发条件 | 禁止推导 |
|---|---|---|---|---|
| closure | `Proposed` / `LocallyClosed` / `PendingCleanup` / `Blocked` / `Superseded` | Proposed->LocallyClosed/PendingCleanup/Blocked；current->Superseded | close command + local invalidation | LocallyClosed 不等于 external cleanup |
| cleanup attempt | `Prepared` / `Dispatched` / `Succeeded` / `Failed` / `Unknown` / `Held` | Prepared->Dispatched/Held；Dispatched->Succeeded/Failed/Unknown | release feedback | Succeeded 仅 safe local outcome |
| residual finding | `Open` / `Observed` / `Resolved` / `Invalidated` | Open->Observed/Resolved/Invalidated | reconciliation comparison | Resolved 不等于 backend repaired |
| reconciliation case | `Open` / `Investigating` / `Held` / `Resolved` / `Escalated` | Open->Investigating/Held/Escalated；Investigating->Resolved/Held | explicit case disposition | Resolved 不等于 external completion |
| handoff | `Prepared` / `Submitted` / `Delivered` / `Observed` / `Accepted` / `Unknown` / `Gap` | each layer only after owner feedback | publication/feedback | one layer cannot imply next |
| outbox | `Pending` / `Submitted` / `Unknown` / `Gap` / `Superseded` | Pending->Submitted/Unknown/Gap; current->Superseded | publisher result | Submitted != delivered |
| projection | `Unbuilt` / `Fresh` / `Stale` / `Rebuilding` / `Degraded` / `Unavailable` | Unbuilt->Rebuilding; Rebuilding->Fresh/Degraded/Unavailable; Fresh->Stale | source change/rebuild | projection state != source truth |

## 3. 状态转换禁止矩阵

| 禁止转换 | 原因 |
|---|---|
| Query -> any lifecycle transition | Query 是 read-only |
| Consumer arrival -> Ready/Healthy/Recovery/Closure | signal/feedback 只形成 matching local fact |
| Job trigger -> Intent/Decision/Authorization | scheduler 不是 actor 或 approval |
| `Accepted` registration -> `HostSession Active` | endpoint、Runtime association 和 generation 条件独立 |
| attempt `Succeeded` -> assembly `Ready` | external outcome 与 qualification axis 不同 |
| outbox `Submitted` -> handoff `Delivered/Accepted` | 反馈 owner 未确认 |
| projection `Fresh` -> source `Committed` | derived state 不能反写 truth |
| cleanup `Succeeded` -> closure external complete | local safe outcome 不等于 Sandbox/carrier truth |
| old generation feedback -> current state | generation fence 防止覆盖 |

## 4. 状态与函数 / 持久化闭环

| 状态轴 | 唯一迁移函数 | 读取/写入约束 |
|---|---|---|
| intent/decision | `HostIntent::accept`、`HostOrchestrationDecision::commit_if_allowed` | expected revision + UoW |
| qualification/readiness | `HostQualificationContext::record`、`HostReadinessDecision::evaluate` | all required items same generation |
| host/attempt | `HostGenerationFence::guard_new_generation`、`HostActionAttempt::record_*` | current pointer / effect key matching |
| registration/session | `RegistrationSessionPolicy::guard`、`HostSession::associate_or_hold` | exact target + single-active |
| health/recovery | `HealthSignalSnapshot::capture`、`HostRecoveryDecision::commit_if_allowed` | source order + formal control basis |
| closure/reconciliation | `HostClosure::open`、`CleanupAttempt::record_*`、case disposition methods | causality + same-key fence |
| material/outbox/projection | `HostFactMaterial::from_change`、`HostOutboxRecord::from_material_snapshot`、projection rebuild function | committed source anchor + marker cursor |

状态写入必须和相应 history/material/stale marker 在规定 UoW 中一致；rollback 不得留下新状态、cursor 或 stored result。

## 5. 回填草稿、风险与 Gate

正式 03 §9 只装配状态族索引、正交原则、关键迁移和禁止矩阵，详细枚举与函数闭环回指本文件。`HostChangeCursor` / `CommittedChangeCursor` 的 exact type 继续 pending，不阻止状态语义但阻止 positive implementation claim。

| 检查项 | 结果 |
|---|---|
| 状态主语筛选 | pass |
| 状态轴独立、无全局 HostStatus | pass |
| 迁移函数与 writer 对齐 | pass_with_upstream_blockers |
| Query/Consumer/Job 禁止越权 | pass |
| external feedback positive transitions | blocked by MSVC-UP-001~008 |
| 正式 03 写入 | forbidden until Step 19 |

```text
step_10_status = completed
step_10_gate = pass_with_upstream_blockers
next_allowed_step = Step 11 persistence_tx_consistency
formal_03_write_allowed = false_until_step_19
```
