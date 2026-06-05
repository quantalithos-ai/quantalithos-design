# Step 9. 状态机与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

把 `L1-work` 中影响主线成立的状态集合、状态含义、核心迁移和传播关系收稳,使后续详细设计可以继续展开正式状态矩阵。

本步不写状态机代码、数据库状态列、完整错误码或 UI 展示规则。状态名称仍是概要层候选,但不得改变 Step 3~Step 8 的 truth 边界。

---

## 2. 状态定义表

| 状态主题 | 对象 | 状态集合 | 核心含义 |
|---|---|---|---|
| Project lifecycle | `Project` | `Active` / `ReadOnly` / `Closed` / `Archived` | 项目是否正式成立、可维护、只读、关闭或归档 |
| ProjectMember responsibility | `ProjectMember` | `Proposed` / `Active` / `Paused` / `Released` | 成员项目内承担是否待确认、可承担、暂停或释放 |
| Backlog availability | `Backlog` | `Open` / `LockedForMaintenance` / `Archived` | 正式工作全集是否可接收和维护 |
| Work lifecycle | `WorkItem` / `ChildWorkItem` | `Formalized` / `Committed` / `InProgress` / `Completed` / `Cancelled` / `Superseded` | 正式工作从成立到完成、取消或替代的状态 |
| Promote decision | `PromoteResult` | `PendingReview` / `Accepted` / `Rejected` / `Superseded` | 外部来源是否被接受为正式工作 |
| Dependency lifecycle | `WorkDependency` | `Proposed` / `Active` / `Satisfied` / `Waived` / `Cancelled` | 依赖关系是否待确认、生效、满足、豁免或取消 |
| Blocker lifecycle | `WorkBlocker` | `Open` / `Mitigating` / `Resolved` / `Closed` | 阻塞是否打开、处理中、解除或关闭 |
| Iteration lifecycle | `Iteration` | `Planning` / `Committed` / `InProgress` / `Closed` / `Cancelled` | 承诺窗口是否规划、已承诺、推进、关闭或取消 |
| Iteration commitment | `IterationCommitment` | `Candidate` / `Committed` / `Changed` / `Closed` | 承诺集合是否候选、生效、调整或关闭 |
| Derived freshness | `DerivedWorkViewState` | `Fresh` / `Stale` / `Rebuilding` / `Failed` | 派生视图是否新鲜、过期、重建或失败 |
| Reference resolution | `ReferenceResolutionState` | `Unresolved` / `Resolved` / `Stale` / `Failed` | 外部引用是否可解析、已解析、过期或失败 |
| Outbox publication | `WorkOutboxRecord` | `Pending` / `Published` / `Failed` | 已成立事实是否待传播、已传播或传播失败 |

---

## 3. 状态流转图

#### Project lifecycle 状态流转

```text
+====================== ProjectLifecycleState ======================+
| CreateProject --> Active                                          |
| Active --UpdateProjectLifecycle--> ReadOnly                       |
| Active / ReadOnly --close--> Closed                               |
| Closed --archive--> Archived                                      |
| Archived is terminal for normal write paths                       |
+==================================================================+
```

关键说明:项目进入正式语境必须显式发生;`Archived` 后普通 command 不得继续改写项目工作 truth。

#### Work lifecycle 状态流转

```text
+========================= WorkItemState ===========================+
| CreateWorkItem / ReviewWorkPromotion(accept) --> Formalized       |
| Formalized --CommitIterationScope--> Committed                    |
| Formalized / Committed --work starts--> InProgress                |
| InProgress --completion evidence--> Completed                     |
| Formalized / Committed --cancel--> Cancelled                      |
| any non-terminal --replace--> Superseded                          |
+==================================================================+
```

关键说明:WorkItem / ChildWorkItem 都使用该生命周期;Completed 必须有 `ExternalEvidenceRef`,Superseded 不删除历史。

#### Promote decision 状态流转

```text
+======================= PromoteResultState ========================+
| PendingReview --ReviewWorkPromotion(accept)--> Accepted --creates--> WorkItem/Child |
| PendingReview --ReviewWorkPromotion(reject)--> Rejected            |
| PendingReview / Accepted / Rejected --new decision--> Superseded   |
+==================================================================+
```

关键说明:promote 接受后才可形成正式工作;拒绝也必须保留来源、理由和审计记录。

#### Dependency / blocker 状态流转

```text
+================ DependencyState / BlockerState ===================+
| Proposed --activate--> Active --evidence--> Satisfied             |
| Active --waive--> Waived                                          |
| Proposed / Active --cancel--> Cancelled                           |
| Open --mitigate--> Mitigating --evidence--> Resolved --close--> Closed |
+==================================================================+
```

关键说明:依赖和阻塞必须指向正式工作;解除、豁免和关闭都要有可解释依据或 reason。

#### Iteration 状态流转

```text
+================ IterationState / CommitmentState =================+
| Planning --CommitIterationScope--> Committed --start--> InProgress |
| InProgress --close--> Closed                                      |
| Planning / Committed --cancel--> Cancelled                        |
| Candidate --commit--> Committed --UpdateIterationCommitment--> Changed --close--> Closed |
+==================================================================+
```

关键说明:Iteration 只能从正式工作全集形成承诺子集;process timing 不得直接迁移 Iteration 状态。

#### Derived / reference / outbox 状态流转

```text
+============ Derived / Reference / Outbox auxiliary states ========+
| Fresh --truth change--> Stale --rebuild--> Rebuilding --ok--> Fresh |
| Rebuilding --fail--> Failed --retry--> Rebuilding                  |
| Unresolved --resolve--> Resolved --stale--> Stale --fail--> Failed |
| Pending --publish ok--> Published                                 |
| Pending --publish fail--> Failed --retry--> Pending               |
+==================================================================+
```

关键说明:辅助状态只影响消费、解释和传播,不得反向改变 Project、WorkItem、Iteration 或 dependency truth。

---

## 4. 允许迁移清单

| 主题 | 允许迁移 | 触发接口 / 动作 | 传播影响 |
|---|---|---|---|
| Project | `Create -> Active` | `CreateProject` | audit + outbox + projection stale |
| Project | `Active -> ReadOnly -> Closed -> Archived` | `UpdateProjectLifecycle` / archive job | audit + outbox + downstream event |
| ProjectMember | `Proposed -> Active -> Paused -> Released` | `AssignProjectMember` / responsibility command | member snapshot read + outbox |
| Backlog | `Open -> LockedForMaintenance -> Open` / `Open -> Archived` | `UpdateBacklogAvailability` / project archive | projection stale |
| WorkItem | `Create -> Formalized -> Committed -> InProgress -> Completed` | `CreateWorkItem` / `ReviewWorkPromotion` / `CommitIterationScope` / `UpdateWorkItemLifecycle` | audit + outbox + projection stale |
| WorkItem | non-terminal `-> Cancelled / Superseded` | `UpdateWorkItemLifecycle` | audit + outbox |
| PromoteResult | `PendingReview -> Accepted / Rejected -> Superseded` | `RequestWorkPromotion` / `ReviewWorkPromotion` | decision record + optional work creation |
| Dependency | `Proposed -> Active -> Satisfied / Waived / Cancelled` | `LinkWorkDependency` / `UpdateWorkDependencyState` + evidence / reason | dependency change + outbox |
| Blocker | `Open -> Mitigating -> Resolved -> Closed` | blocker command + evidence / reason | dependency change + outbox |
| Iteration | `Planning -> Committed -> InProgress -> Closed / Cancelled` | `OpenIteration` / `CommitIterationScope` / `UpdateIterationLifecycle` | iteration change + outbox |
| IterationCommitment | `Candidate -> Committed -> Changed -> Closed` | `CommitIterationScope` / `UpdateIterationCommitment` / `UpdateIterationLifecycle` | iteration change + outbox |
| Derived | `Fresh -> Stale -> Rebuilding -> Fresh / Failed` | truth event / rebuild job | query stale marker |
| Reference | `Unresolved -> Resolved -> Stale / Failed` | inbound event / refresh job | snapshot availability |
| Outbox | `Pending -> Published / Failed -> Pending` | `PublishWorkOutbox` retry | downstream visibility |

---

## 5. 禁止迁移清单

| 禁止迁移 | 原因 |
|---|---|
| Query / projection rebuild / reconciliation 触发任何核心 truth 状态迁移 | 违反读路径和维护任务不反写真相 |
| conversation / runtime / artifact event 直接把 WorkItem 置为 `Formalized` 或 child WorkItem 置为正式状态 | 必须经过 explicit formalize / promote |
| process planning event 直接把 Iteration 置为 `Committed` | Iteration 承诺属于 Work truth |
| `Completed -> InProgress` 无显式 reopen / supersede 语义 | 完成状态必须保持可追溯,普通路径不可回退 |
| `Archived -> Active` 普通恢复 | 高风险恢复必须后续由治理和详细设计单独定义 |
| `Published -> Pending` 无 supersede / retry 语义 | 已发布事实不能伪装成未发布 |
| `Resolved / Closed` blocker 无 reason 重新打开 | 阻塞重开必须形成新变化记录 |

---

## 6. 状态传播关系

```text
+========================== state propagation ======================+
| Core truth state change                                            |
|        |                                                           |
|        +--> WorkAuditTrail / WorkTraceRecord                       |
|        +--> WorkOutboxRecord(Pending)                              |
|        +--> DerivedWorkViewState(Stale)                            |
|        +--> downstream event after PublishWorkOutbox                |
|                                                                    |
| Snapshot / reference state change                                  |
|        +--> affected policy decisions / derived stale marker        |
|                                                                    |
| Projection / outbox state change                                   |
|        +--> query freshness / delivery visibility only              |
+==================================================================+
```

关键说明:

- 核心 truth 状态变化必须产生审计 / 追溯和 outbox 意图。
- 派生视图和引用状态变化可以影响读取解释,不能改变已成立 truth。
- outbox 发布失败只影响下游感知,不回滚业务事实。
- 状态传播关系不定义事件 schema、topic 或 retry 策略。

---

## 7. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §9 “状态定义与状态流转”引用本文件 §2 的状态定义表。
- §9 摘录 §3 的状态流转图和 §4 / §5 的允许 / 禁止迁移清单。
- §9 保留 §6 的状态传播关系,作为后续详细设计 outbox、projection 和查询一致性设计入口。

---

## 8. 进入下一步条件

- 已明确本仓存在正式核心状态机和辅助状态机。
- 已明确状态集合、状态含义、核心迁移、禁止迁移和传播关系。
- 已说明状态变化如何影响 outbox、projection、下游感知和只读供给。
- 未写状态机代码、数据库列或完整错误码。
- 可以进入 Step 10 “异常与边界场景轮廓”。
