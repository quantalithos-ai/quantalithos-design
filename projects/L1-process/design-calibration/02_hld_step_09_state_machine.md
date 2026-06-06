# Step 9. 状态机与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

把 `L1-process` 中影响过程执行事实成立、等待恢复、节奏解释、派生读取和下游传播的状态集合收稳,使后续详细设计可以继续展开正式状态矩阵。

本步只写概要级状态名称、状态含义、核心迁移方向、触发接口和传播影响;不写状态机代码、数据库状态列、完整错误码、重试参数或 UI 展示规则。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` + 五个对象附录 | 已完成 | 提供状态主题、对象归属和状态候选 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供会触发状态变化的 command / consumer / job |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供状态迁移所在处理流和维护边界 |
| `00_req_step_10_business_rules_boundaries.md` | 已完成 | 提供过程 truth、外部正文排除和恢复连续性规则 |

---

## 3. 状态定义表

### 3.1 核心 truth / execution 状态

| 状态主题 | 对象 | 状态集合 | 核心含义 |
|---|---|---|---|
| Runtime shape lifecycle / validity | `RuntimeProcessShape` | `DraftIndexed` / `Active` / `Stale` / `Invalid` / `Retired` | method-library 定义来源是否已形成可采用 runtime shape,以及来源是否过期或不可用 |
| Profile lifecycle / adoption | `ProcessProfile` | `Proposed` / `Active` / `Suspended` / `Retired` | 项目是否已采用某个过程语境,以及该语境是否可继续启动实例 |
| Instance lifecycle | `ProcessInstance` | `NotStarted` / `Running` / `Waiting` / `Recovering` / `Completed` / `Cancelled` / `Failed` | 一次过程运行是否已启动、可推进、等待、恢复或进入终态 |
| Activity lifecycle / feedback | `Activity` | `Planned` / `Ready` / `InProgress` / `WaitingFeedback` / `Completed` / `Skipped` / `Failed` | 过程节点是否可执行、执行中、等待外部反馈或完成 / 失败 |
| Token flow position | `Token` | `Active` / `Waiting` / `Consumed` / `Terminated` | 过程流控 token 是否可继续推进、等待、已消费或被终止 |
| Gateway routing | `Gateway` | `PendingDecision` / `RouteSelected` / `Joined` / `Invalid` | 分支 / 合流节点是否已选择路线、已合流或不可用 |

### 3.2 等待、恢复和节奏状态

| 状态主题 | 对象 | 状态集合 | 核心含义 |
|---|---|---|---|
| Waiting gate / pause context | `WaitingGate`、`PauseContext` | `Waiting` / `DecisionResolved` / `Resumed` / `Cancelled` / `Expired` | 等待点是否仍阻塞实例、是否已有正式恢复依据、是否恢复或终止 |
| Checkpoint validity | `ProcessCheckpoint` | `Available` / `Superseded` / `Invalid` / `Expired` | checkpoint 是否仍可服务同一实例链路恢复 |
| Recovery continuity | `RecoveryAttempt` | `Pending` / `Applied` / `Failed` / `Abandoned` | 一次恢复尝试是否待应用、已应用、失败或放弃 |
| Stage rhythm | `ProcessStageState` | `Pending` / `Active` / `Paused` / `Completed` / `Skipped` | 过程阶段是否进入、暂停、完成或跳过 |
| Timebox binding | `ProcessTimeboxBinding` | `Active` / `Stale` / `Released` / `Invalid` | 过程 timebox 与外部 work timebox / iteration 的绑定是否仍有效 |

### 3.3 辅助状态

| 状态主题 | 对象 | 状态集合 | 核心含义 |
|---|---|---|---|
| Derived freshness / rebuild | `DerivedProcessViewState` | `Fresh` / `Stale` / `Rebuilding` / `Failed` / `Disabled` | process read model / timeline / summary 是否新鲜、过期、重建、失败或禁用 |
| Reference resolution | `ReferenceResolutionState` | `Resolved` / `Unresolved` / `Stale` / `Invalid` / `Unavailable` | 外部引用或快照是否可解析、过期、不可用或来源不可达 |
| Outbox publication | `ProcessOutboxRecord` | `Pending` / `Published` / `Failed` / `RetryPending` | 已成立 Process truth 是否待发布、已发布、失败或等待重试 |
| Trace handoff | `TraceHandoffRef` | `Prepared` / `Delivered` / `Failed` / `Cancelled` | 追溯交接是否准备、交付、失败或取消 |

---

## 4. 状态流转图

#### 状态流转图

```text
+====================== RuntimeProcessShape =======================+
| SyncRuntimeProcessShape --> DraftIndexed                          |
| DraftIndexed --activate with valid snapshot--> Active             |
| Active --method definition changed--> Stale                       |
| DraftIndexed / Active / Stale --invalid source--> Invalid         |
| Active / Stale / Invalid --retire--> Retired                      |
| Retired is terminal for normal adoption paths                     |
+==================================================================+
```

关键说明:

- 图表达 runtime shape 从外部 method definition 摘要形成可采用 shape 的生命周期。
- `Stale` 表示来源版本过期,不表示 Process 可以自动切换 profile 或改写运行中实例。
- `Invalid` / `Retired` 不能作为新 profile adoption 来源,详细校验留给 `ShapeDefinitionPolicy`。

#### 状态流转图

```text
+========================= ProcessProfile =========================+
| AdoptProcessProfile --> Proposed                                  |
| Proposed --activate--> Active                                     |
| Active --UpdateProcessProfileTailoring / suspend--> Suspended     |
| Suspended --reactivate with valid shape--> Active                 |
| Active / Suspended --retire--> Retired                            |
| Retired is terminal for normal instance start paths               |
+==================================================================+
```

关键说明:

- 图表达项目采用过程语境的生命周期,不表达 Project truth 或 MethodProfile truth。
- profile 变化必须形成 `ProfileChangeRecord`、audit 和 outbox 意图。
- 运行中实例受 profile 变化影响时只能标记需显式处理,不得后台重写实例路径。

#### 状态流转图

```text
+======================== ProcessInstance =========================+
| create --> NotStarted --StartProcessInstance--> Running           |
| Running --OpenWaitingGate--> Waiting                              |
| Waiting --ResumeWaitingGate--> Running                            |
| Running / Waiting --StartRecoveryAttempt--> Recovering            |
| Recovering --CompleteRecoveryAttempt(success)--> Running          |
| Running --complete--> Completed                                   |
| NotStarted / Running / Waiting / Recovering --cancel--> Cancelled |
| Running / Waiting / Recovering --failure--> Failed                |
+==================================================================+
```

关键说明:

- 图表达一次 Process truth 的主生命周期;recovery 必须沿同一实例继续。
- `Waiting` 必须由 `WaitingGate` 和 `PauseContext` 支撑,不能只靠外部 event 直接迁移。
- `Completed`、`Cancelled`、`Failed` 是普通写路径终态,恢复或重开若存在必须在详细设计中单独定义。

#### 状态流转图

```text
+=================== Activity / Token / Gateway ===================+
| Activity: Planned --> Ready --> InProgress --> WaitingFeedback     |
| WaitingFeedback --RecordActivityFeedback--> Completed             |
| Ready / InProgress --skip--> Skipped                              |
| Ready / InProgress / WaitingFeedback --fail--> Failed             |
|                                                                  |
| Token: Active --OpenWaitingGate--> Waiting                        |
| Waiting --ResumeWaitingGate--> Active                             |
| Active --route consumed--> Consumed                               |
| Active / Waiting --terminate--> Terminated                        |
|                                                                  |
| Gateway: PendingDecision --select_route--> RouteSelected          |
| RouteSelected --join_tokens--> Joined                             |
| PendingDecision / RouteSelected --invalid source--> Invalid       |
+==================================================================+
```

关键说明:

- 图表达 Process 内部节点、流控位置和路由状态的协同迁移。
- runtime feedback event 只能先形成 pending / reference marker;正式完成仍需 `RecordActivityFeedback` 或 progression policy 接受。
- gateway 路线选择依据必须来自正式上下文或 policy,不得自造 governance decision。

#### 状态流转图

```text
+==================== Waiting / Checkpoint / Recovery =============+
| WaitingGate: open --> Waiting --attach_decision--> DecisionResolved |
| DecisionResolved --ResumeWaitingGate--> Resumed                   |
| Waiting / DecisionResolved --cancel--> Cancelled                  |
| Waiting / DecisionResolved --expire--> Expired                    |
|                                                                  |
| Checkpoint: capture --> Available                                |
| Available --new checkpoint--> Superseded                          |
| Available --invalidate--> Invalid                                 |
| Available --expire--> Expired                                     |
|                                                                  |
| RecoveryAttempt: start --> Pending --apply--> Applied             |
| Pending --fail--> Failed                                          |
| Pending / Failed --abandon--> Abandoned                           |
+==================================================================+
```

关键说明:

- waiting gate 恢复必须引用正式外部依据,外部 governance consumer 只可标记依据可用。
- checkpoint 表达实例级恢复锚点,不是 runtime micro checkpoint。
- recovery attempt 记录一次尝试结果,不能覆盖 checkpoint truth 或创建第二个 ProcessInstance。

#### 状态流转图

```text
+===================== Timing / Derived / Reference ===============+
| Stage: Pending --> Active --> Completed                           |
| Active --pause--> Paused --resume--> Active                       |
| Pending / Active / Paused --skip--> Skipped                       |
|                                                                  |
| TimeboxBinding: bind --> Active --external changed--> Stale       |
| Active / Stale --release--> Released                              |
| Active / Stale --invalid source--> Invalid                        |
|                                                                  |
| Derived: Fresh --truth change--> Stale --rebuild--> Rebuilding    |
| Rebuilding --ok--> Fresh                                          |
| Rebuilding --fail--> Failed --retry--> Rebuilding                 |
| Fresh / Stale / Failed --disable--> Disabled                      |
|                                                                  |
| Reference: Unresolved --resolve--> Resolved                       |
| Resolved --external changed--> Stale                              |
| Unresolved / Stale --resolve--> Resolved                          |
| any --invalid ref--> Invalid                                      |
| any --source unavailable--> Unavailable                           |
+==================================================================+
```

关键说明:

- timing 状态只解释过程节奏,不拥有 Work iteration 或 commitment truth。
- derived / reference 状态影响读取、policy 输入和 stale marker,不能反向改变核心 Process truth。
- `Disabled`、`Invalid`、`Unavailable` 必须对查询或运维可见,不能被正常读路径静默吞掉。

#### 状态流转图

```text
+====================== Outbox / TraceHandoff =====================+
| Outbox: from truth change --> Pending                             |
| Pending --publish ok--> Published                                 |
| Pending --publish retryable failure--> RetryPending               |
| RetryPending --retry--> Pending                                   |
| Pending / RetryPending --permanent failure--> Failed              |
|                                                                  |
| TraceHandoff: prepare --> Prepared                                |
| Prepared --deliver ok--> Delivered                                |
| Prepared --deliver failed--> Failed                               |
| Prepared --cancel--> Cancelled                                    |
+==================================================================+
```

关键说明:

- outbox 只传播已成立 truth,发布失败不回滚主真相。
- trace handoff 只保存交接引用和状态,不保存 observability / archive 正文。
- 发布和交接的重试、错误分类和 adapter 细节留给详细设计、配置设计和测试方案。

---

## 5. 允许迁移清单

| 主题 | 允许迁移 | 触发接口 / 动作 | 传播影响 |
|---|---|---|---|
| Runtime shape | `DraftIndexed -> Active -> Stale / Invalid -> Retired` | `SyncRuntimeProcessShape`、method definition consumer、retire action | trace + outbox + affected profile / derived stale marker |
| Profile | `Proposed -> Active -> Suspended -> Active / Retired` | `AdoptProcessProfile`、`UpdateProcessProfileTailoring` | `ProfileChangeRecord` + audit + outbox + process view stale |
| Instance | `NotStarted -> Running -> Waiting -> Running -> Completed` | `StartProcessInstance`、`OpenWaitingGate`、`ResumeWaitingGate`、progression command | trace + outbox + timeline / summary stale |
| Instance | non-terminal `-> Recovering -> Running / Failed` | recovery command | `RecoveryHistoryRecord` + trace + outbox |
| Instance | non-terminal `-> Cancelled / Failed` | explicit cancel / failure action | trace + outbox + derived stale |
| Activity | `Planned -> Ready -> InProgress -> WaitingFeedback -> Completed` | instance start / progression / feedback command | `ActivityProgressionRecord` + outbox |
| Activity | `Ready / InProgress -> Skipped / Failed` | progression command with reason | progression record + derived stale |
| Token | `Active -> Waiting -> Active -> Consumed` | gate open / resume / route completion | instance timeline stale |
| Token | `Active / Waiting -> Terminated` | explicit termination reason | trace + derived stale |
| Gateway | `PendingDecision -> RouteSelected -> Joined` | `AdvanceProcessActivity` route decision | progression record + outbox |
| Waiting gate | `Waiting -> DecisionResolved -> Resumed` | governance marker + `ResumeWaitingGate` | waiting change record + outbox |
| Waiting gate | `Waiting / DecisionResolved -> Cancelled / Expired` | explicit cancel / expiry policy | waiting change record + trace |
| Checkpoint | `Available -> Superseded / Invalid / Expired` | checkpoint command / recovery policy | recovery history + trace |
| Recovery | `Pending -> Applied / Failed / Abandoned` | recovery command / maintenance job | recovery history + optional outbox |
| Stage | `Pending -> Active -> Paused -> Active -> Completed` | `BindProcessTimebox`、`UpdateProcessStageState` | timing event + derived stale |
| Stage | `Pending / Active / Paused -> Skipped` | explicit rhythm command | timing event |
| Timebox binding | `Active -> Stale -> Active / Released / Invalid` | work context consumer / rhythm command | reference marker + timing event |
| Derived | `Fresh -> Stale -> Rebuilding -> Fresh / Failed` | truth change / rebuild job | query freshness marker |
| Reference | `Unresolved / Stale -> Resolved`、`Resolved -> Stale` | inbound consumer / refresh job | policy input availability + derived stale |
| Outbox | `Pending -> Published / RetryPending / Failed`、`RetryPending -> Pending` | `PublishProcessOutbox` | downstream event visibility |
| Trace handoff | `Prepared -> Delivered / Failed / Cancelled` | handoff jobs | observability / archive handoff marker |

---

## 6. 禁止迁移清单

| 禁止迁移 | 原因 |
|---|---|
| Query、projection rebuild、reconciliation job 触发核心 Process truth 状态迁移 | 读路径和维护任务不得反写真相 |
| Inbound event consumer 直接启动 `ProcessInstance` 或推进 `Activity` 到 `Completed` | 外部事件只能写 snapshot / pending feedback / stale marker,正式推进必须经过 Process policy |
| method definition changed event 自动切换 `ProcessProfile` 或改写运行中实例 | runtime shape 过期只标记 stale;profile / instance 变化必须显式 command |
| governance decision changed event 直接 `ResumeWaitingGate` | 只能标记等待依据可用;恢复必须有显式 command 和 actor context |
| Work timebox / iteration event 直接迁移 `ProcessStageState` 或 Work truth | timing 绑定只解释节奏,Work iteration truth 归 L1-work |
| `Completed`、`Cancelled`、`Failed` 普通写路径回到 `Running` | 终态恢复或重开属于高风险路径,必须后续明确单独口径 |
| `Retired` runtime shape / profile 被普通 command 重新激活 | 退役对象不可作为普通采用来源 |
| `Published -> Pending` 无 supersede 或 retry 语义 | 已发布事实不能伪装成未发布 |
| derived / reference state 修复后静默改写 core truth | 派生和引用状态只能影响读取与 policy 输入 |
| trace handoff 失败回滚 Process truth | 交接属于消费和追溯边界,不决定业务事实成立 |

---

## 7. 状态传播关系

#### 状态传播关系图

```text
+======================= Process state propagation =================+
| Core truth state change                                            |
|        |                                                           |
|        +--> ProcessTraceRecord / ProcessAuditTrail                 |
|        +--> ProcessOutboxRecord(Pending)                           |
|        +--> DerivedProcessViewState(Stale)                         |
|        +--> query views show new truth after rebuild / read-through |
|        +--> downstream events after PublishProcessOutbox            |
|                                                                    |
| External reference / snapshot state change                         |
|        |                                                           |
|        +--> ReferenceResolutionState                               |
|        +--> affected policy input / stale marker                    |
|        +--> DerivedProcessViewState(Stale) when views depend on it  |
|                                                                    |
| Maintenance / handoff state change                                 |
|        |                                                           |
|        +--> operation report / handoff marker                       |
|        +--> query freshness or delivery visibility                  |
+==================================================================+
```

关键说明:

- 核心 truth 状态变化必须形成 trace / audit、outbox 意图和派生视图 stale 信号。
- 外部引用状态变化可以影响后续 policy 决策和读取解释,不能直接推进核心状态机。
- outbox、projection、handoff 的状态变化影响下游感知、查询新鲜度和运维可见性,不回滚或修复业务 truth。
- 本图不定义事件 payload、topic、repository schema、retry 参数或 adapter 错误分类。

---

## 8. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Template / Profile / Instance 叙事里混写“采用、执行、调整” | 难以判断哪些状态属于 shape、profile 或 instance | 拆成 runtime shape、profile 和 instance 三套状态 |
| runtime feedback 与 Activity 完成关系不清 | 容易让外部 runtime event 直接改写 Process truth | 明确 feedback event 只能形成 marker,正式绑定和完成走 command / policy |
| planning / review / timebox 与 Work iteration 混写 | 容易让 Process 拥有 Work commitment truth | 将节奏状态限制在 `ProcessStageState` 和 `ProcessTimeboxBinding` |
| 等待恢复和 governance decision 关系不清 | 容易后台静默恢复等待点 | 明确 governance consumer 只标记依据可用,恢复必须显式 command |
| projection / reconciliation / outbox 与 truth 状态混写 | 容易让维护 job 反写真相 | 明确辅助状态只影响读取、传播和运维可见性 |

---

## 9. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §9 “状态定义与状态流转”引用本文件 §3 的状态定义表。
- §9 摘录 §4 的状态流转图,可按正式文档篇幅压缩为核心 truth、等待恢复、辅助状态三组图。
- §9 保留 §5 / §6 的允许和禁止迁移清单。
- §9 保留 §7 的状态传播关系,作为详细设计 outbox、projection、reference refresh 和 handoff 设计入口。

---

## 10. 进入下一步条件

- 已明确 `L1-process` 存在核心 truth 状态机和辅助状态机。
- 已覆盖 Step 6 反查清单中的 runtime shape、profile、instance、activity、token、gateway、waiting、checkpoint、recovery、timing、derived、reference、outbox 和 handoff 状态主题。
- 已明确核心允许迁移、禁止迁移和状态传播关系。
- 未写状态机代码、数据库列、完整错误码或 adapter 细节。
- 可以进入 Step 10 “异常与边界场景轮廓”。
