# Step 9. 状态机与状态流转

## 1. Step 状态

- 状态：[x] 已重写
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-bus/02-概要设计.md` §9 状态定义与状态流转

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 6 关键对象 | `PublicationAcceptance`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`TransportViewProjection`、`FailureSummaryProjection` |
| Step 7 API / 接口骨架 | `AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay`、event consumer、operations job、query |
| Step 8 处理流 | 已拆分 retry、DLQ、replay preparation、backend signal、timeout、projection rebuild、backend capability check 等处理流 |
| 本步规范约束 | 只写状态名称、含义、触发动作、允许迁移、禁止迁移和传播关系；不写状态机代码、错误码全集、数据库状态列和 UI 展示规则 |

已确认结论：

```text
L0-bus 存在正式状态机。
正式状态机只属于 bus truth / recovery truth / read projection。
BackendCapability check 影响能力视图和审计,但不新增 bus truth 状态机。
```

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态？

回答：

正式状态集合包括：

- `PublicationAcceptanceStatus`
- `DeliveryStatus`
- `FeedbackStatus`
- `RetryPlanStatus`
- `DeadLetterStatus`
- `ReplayPreparationStatus`
- `ProjectionStatus`

`DeliveryAttempt`、`IdempotencyAnchor`、`DeliveryHistoryEntry`、`BusAuditEntry`、`FailureMaterial`、`BackendCapabilityRef`、`BackendCapabilityPolicy` 不拥有独立正式状态机。它们分别承担 attempt 记录、幂等锚点、历史、审计、失败材料和能力边界职责。

### 3.2 每个状态的含义是什么，是否可以进入正常主线？

回答：

`PublicationAcceptanceStatus.accepted`、`DeliveryStatus.scheduled / dispatching / delivered / completed`、`FeedbackStatus.ack`、`ProjectionStatus.active` 属于正常主线或正常只读输出。`PublicationAcceptanceStatus.rejected`、`DeliveryStatus.failed / dead_lettered`、`FeedbackStatus.fail / timeout / duplicate`、`RetryPlanStatus.exhausted`、`ReplayPreparationStatus.rejected`、`ProjectionStatus.stale` 属于终止、恢复或只读一致性路径。

### 3.3 哪些接口、事件或动作会触发状态迁移？

回答：

触发状态迁移的主动作包括：`AcceptPublication`、`ConsumeCommittedOutboxFact`、`RunDeliveryProgression`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal`、`RecordDeliveryFeedback`、`RequestRetry`、`RunRetryCycle`、`MoveDeliveryToDeadLetter`、`PrepareReplay`、`RunReadOutputProjection`、`RebuildReadProjection`。`CheckBackendCapability` 不触发 bus truth 状态迁移，只触发能力视图、审计或 outbound event。

### 3.4 哪些迁移明确允许，哪些迁移明确禁止？

回答：

允许迁移必须从本章允许迁移清单中选择。禁止迁移包括 rejected 后进入 delivery、completed 后重新 dispatch、dead_lettered 绕过 replay preparation 直接 dispatch、projection 反写 truth、duplicate feedback 改写 delivery、backend raw status 直接写 `DeliveryStatus`。

### 3.5 状态变化如何影响 outbox、projection、下游感知或只读供给？

回答：

关键状态变化必须先写入 bus truth，并生成 `DeliveryHistoryEntry` 或 `BusAuditEntry`。已提交状态变化可以触发 outbound event 和 read projection 更新。projection 和 outbound event 是状态传播结果，不是状态真相来源，也不能反向驱动 truth 状态迁移。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 Step 9 | 未承接 Step 8 新拆分的 `RunRetryCycle`、`RebuildReadProjection`、`CheckBackendCapability` | 状态影响边界不完整 |
| 旧 Step 9 | 未明确 backend capability 不属于 bus truth 状态机 | 详细设计可能新增非必要状态枚举 |
| 旧 Step 9 | 状态定义表未按最新规范表达“是否可进入正常主线” | 正常 / 恢复 / 终止 / 只读边界不够清楚 |
| 旧 Step 9 | retry、DLQ、replay preparation 的触发关系偏粗 | 无法承接 Step 8 拆分后的恢复处理流 |
| 旧 Step 9 | Query、projection、outbound event 的传播边界仍可更清楚 | 只读输出可能被误解为状态真相来源 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态归属 | 直接列状态集合 | 先区分正式状态机与非状态机对象 | 防止给 backend capability / audit 等对象发明状态 |
| 状态定义 | 按状态集合、状态、含义、主线路径 | 按正式状态、含义、是否可进入正常主线、说明 | 对齐书写规范 |
| 恢复状态 | retry / DLQ / replay 描述较粗 | 分别说明 retry plan、dead letter、replay preparation | 承接 Step 8 独立处理流 |
| 后端能力 | 未独立说明 | 明确 `CheckBackendCapability` 不改 truth 状态 | 守住后端适配边界 |
| 状态传播 | 有传播图 | 补充 outbox / projection / query 不能反写 truth | 强化只读输出边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只保留 `DeliveryStatus` 一个主状态机 | 简洁 | 接入、反馈、retry、DLQ、replay、projection 状态会漂移 | 不采用 |
| 方案 B：把 backend capability、audit、history、attempt 都定义成状态机 | 看似完整 | 会把记录、引用和审计对象误写成 lifecycle 对象 | 不采用 |
| 方案 C：只为影响主线成立的 truth / recovery / projection 对象定义状态机，其他对象明确无独立状态机 | 边界清楚，可支撑详细设计和测试 | 需要维护多个状态集合 | 采用 |

---

## 7. 结构化中间产物

### 7.1 状态所有权总表

| 对象 | 是否拥有正式状态机 | 状态集合 | 说明 |
|---|---|---|---|
| `PublicationAcceptance` | 是 | `PublicationAcceptanceStatus` | 表达发布材料接入结果 |
| `DeliveryRecord` | 是 | `DeliveryStatus` | 表达 delivery 主生命周期 |
| `FeedbackResult` | 是 | `FeedbackStatus` | 表达一次 bus 级反馈结果 |
| `RetryPlan` | 是 | `RetryPlanStatus` | 表达 retry 计划是否仍有效 |
| `DeadLetterEntry` | 是 | `DeadLetterStatus` | 表达 DLQ 条目处置状态 |
| `ReplayPreparation` | 是 | `ReplayPreparationStatus` | 表达 replay 前置材料状态 |
| `TransportViewProjection` | 是 | `ProjectionStatus` | 表达只读传递视图新鲜度 |
| `FailureSummaryProjection` | 是 | `ProjectionStatus` | 表达只读失败摘要新鲜度 |
| `DeliveryAttempt` | 否 | - | attempt 是单次尝试记录，不作为独立 lifecycle |
| `IdempotencyAnchor` | 否 | - | 幂等由 key 和绑定记录判断 |
| `DeliveryHistoryEntry` | 否 | - | history append-only，不覆盖当前状态 |
| `BusAuditEntry` | 否 | - | audit append-only，不表达业务生命周期 |
| `FailureMaterial` | 否 | - | 失败材料状态由 delivery / DLQ / replay 表达 |
| `BackendCapabilityRef` / `BackendCapabilityPolicy` | 否 | - | 只表达能力引用和映射规则，不改 bus truth 状态 |

### 7.2 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `PublicationAcceptanceStatus.pending` | 接入校验尚未完成 | 受限 | 只能继续进入 accepted 或 rejected |
| `PublicationAcceptanceStatus.accepted` | 发布材料已被 bus 接受 | 是 | 可以派生 delivery schedule 材料 |
| `PublicationAcceptanceStatus.rejected` | 发布材料被拒绝 | 否 | 终止接入，不允许进入 delivery |
| `DeliveryStatus.scheduled` | delivery 已计划，等待投递 | 是 | 可由 accepted publication 或 retry 进入 |
| `DeliveryStatus.dispatching` | delivery 正在交给后端推进 | 是 | 等待 backend signal 或 timeout |
| `DeliveryStatus.delivered` | 后端已送达或等待订阅方反馈 | 是 | 可由 ack 完成，也可由 fail 进入恢复 |
| `DeliveryStatus.failed` | 投递、反馈或 timeout 失败 | 受限 | 只能进入 retry 或 DLQ 判断 |
| `DeliveryStatus.dead_lettered` | delivery 已进入死信 | 否 | 不能直接重新 dispatch |
| `DeliveryStatus.completed` | delivery 已完成 | 是 | 主线终止，不允许重新投递 |
| `FeedbackStatus.ack` | 订阅方或后端确认成功 | 是 | 可推动 delivery completed |
| `FeedbackStatus.fail` | 订阅方或后端反馈失败 | 受限 | 可推动 delivery failed 和 failure material |
| `FeedbackStatus.timeout` | delivery 超时 | 受限 | 可推动 delivery failed 和 retry 候选 |
| `FeedbackStatus.duplicate` | 重复 delivery 或 feedback 被识别 | 否 | 不得改变已成立 delivery 状态 |
| `RetryPlanStatus.scheduled` | retry 计划等待执行 | 受限 | 可由 retry worker 推动新 attempt |
| `RetryPlanStatus.exhausted` | retry 次数耗尽 | 否 | 应进入 DLQ 判断 |
| `RetryPlanStatus.cancelled` | retry 计划被取消 | 否 | 不再触发新 attempt |
| `DeadLetterStatus.open` | 死信待处理 | 受限 | 可进入 reviewing 或等待 replay preparation |
| `DeadLetterStatus.reviewing` | 死信正在审查 | 受限 | 不代表 replay 可执行 |
| `DeadLetterStatus.closed` | 死信关闭 | 否 | 终止处置 |
| `ReplayPreparationStatus.draft` | replay 前置材料草稿 | 受限 | 必须校验 DLQ / history / audit chain |
| `ReplayPreparationStatus.ready` | replay 前置条件满足 | 受限 | 表示材料可交给后续 replay executor |
| `ReplayPreparationStatus.rejected` | replay preparation 被拒绝 | 否 | 不允许执行 replay |
| `ReplayPreparationStatus.superseded` | replay preparation 被替代 | 否 | 后续以新材料为准 |
| `ProjectionStatus.building` | projection 正在构建 | 不适用 | 只读输出状态，不是 truth |
| `ProjectionStatus.active` | projection 可被查询 | 不适用 | 可作为 Query 正常输出 |
| `ProjectionStatus.stale` | projection 落后于 bus truth | 不适用 | Query 必须返回一致性标记或等待重建 |
| `ProjectionStatus.rebuilding` | projection 正在重建 | 不适用 | 只能改 projection，不能改 truth |

### 7.3 主状态流转图

```text
PublicationAcceptance.pending
  | AcceptPublication / ConsumeCommittedOutboxFact accepted
  v
PublicationAcceptance.accepted
  | DeliveryRecord::schedule
  v
DeliveryStatus.scheduled
  | RunDeliveryProgression
  v
DeliveryStatus.dispatching
  | ConsumeBackendDeliverySignal delivered
  v
DeliveryStatus.delivered
  | RecordDeliveryFeedback ack
  v
DeliveryStatus.completed

PublicationAcceptance.pending
  | AcceptPublication rejected
  v
PublicationAcceptance.rejected

DeliveryStatus.dispatching
  | backend fail / timeout
  v
DeliveryStatus.failed

DeliveryStatus.delivered
  | RecordDeliveryFeedback fail
  v
DeliveryStatus.failed
```

关键说明：

- `PublicationAcceptance.rejected` 是接入终止状态，不进入 delivery 主线。
- `DeliveryStatus.completed` 是正常终止状态，不允许重新 dispatch。
- backend signal 和 timeout 必须经过本仓处理流归一化后才能推动 delivery 状态。

### 7.4 恢复状态流转图

```text
DeliveryStatus.failed
  | RequestRetry
  v
RetryPlanStatus.scheduled
  | RunRetryCycle
  v
DeliveryStatus.scheduled

RetryPlanStatus.scheduled
  | attempts exhausted
  v
RetryPlanStatus.exhausted
  | MoveDeliveryToDeadLetter
  v
DeliveryStatus.dead_lettered
  | DeadLetterEntry::from_failed_delivery
  v
DeadLetterStatus.open
  | PrepareReplay
  v
ReplayPreparationStatus.draft
  | mark_ready when chain and approval are valid
  v
ReplayPreparationStatus.ready
```

关键说明：

- retry、DLQ、replay preparation 是三段不同恢复状态，不合并成一个 recovery 状态。
- retry 耗尽后必须进入 DLQ 判断，不能静默丢弃。
- `ReplayPreparationStatus.ready` 只代表 replay 前置材料满足条件，不代表 replay 已执行。

### 7.5 只读投影状态流转图

```text
ProjectionStatus.building
  | RunReadOutputProjection success
  v
ProjectionStatus.active
  | source truth advanced
  v
ProjectionStatus.stale
  | RebuildReadProjection started
  v
ProjectionStatus.rebuilding
  | rebuild success
  v
ProjectionStatus.active
```

关键说明：

- projection 状态只影响只读输出新鲜度，不影响 bus truth。
- `ProjectionStatus.stale` 只能触发一致性标记或 rebuild，不能修写 delivery。
- rebuild 可以替换 projection 批次，但不能改写 `DeliveryRecord`、`FeedbackResult`、DLQ 或 replay truth。

### 7.6 触发动作与状态影响表

| 触发动作 | 允许影响的状态 | 不允许影响的状态 / 边界 |
|---|---|---|
| `AcceptPublication` | `PublicationAcceptanceStatus.pending -> accepted / rejected` | 不直接写 backend 状态 |
| `ConsumeCommittedOutboxFact` | `PublicationAcceptanceStatus.pending -> accepted / rejected` | 不读取未提交业务状态 |
| `RunDeliveryProgression` | `DeliveryStatus.scheduled -> dispatching` | 不直接绕过 backend port 写 completed |
| `ConsumeBackendDeliverySignal` | `DeliveryStatus.dispatching -> delivered / failed` | backend raw status 不能直接落库 |
| `ConsumeTimeoutSignal` | `FeedbackStatus.timeout`、`DeliveryStatus.dispatching -> failed` | timeout 不等同业务失败正文 |
| `RecordDeliveryFeedback` | `FeedbackStatus.ack / fail / duplicate`、`DeliveryStatus.delivered -> completed / failed` | duplicate 不得改写 delivery |
| `RequestRetry` | `RetryPlanStatus.scheduled`、`DeliveryStatus.failed -> scheduled` | 不执行实际投递 |
| `RunRetryCycle` | `DeliveryStatus.scheduled -> dispatching` | 不创建新的 retry truth |
| `MoveDeliveryToDeadLetter` | `DeliveryStatus.failed -> dead_lettered`、`DeadLetterStatus.open` | 不触发 replay 执行 |
| `PrepareReplay` | `ReplayPreparationStatus.draft -> ready / rejected` | 不执行治理审批和 replay |
| `RunReadOutputProjection` | `ProjectionStatus.building -> active` 或 `stale -> active` | 不改写 bus truth |
| `RebuildReadProjection` | `ProjectionStatus.stale -> rebuilding -> active` | 不改写 bus truth |
| `CheckBackendCapability` | 能力视图、audit、`BackendCapabilityChangedEvent` | 不新增 bus truth 状态，不改变 delivery 状态 |

### 7.7 允许迁移清单

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `PublicationAcceptance` | `pending -> accepted` | `AcceptPublication` / `ConsumeCommittedOutboxFact` 校验通过 |
| `PublicationAcceptance` | `pending -> rejected` | 接入校验失败 |
| `DeliveryRecord` | `scheduled -> dispatching` | `RunDeliveryProgression` / `RunRetryCycle` |
| `DeliveryRecord` | `dispatching -> delivered` | `ConsumeBackendDeliverySignal` delivered |
| `DeliveryRecord` | `dispatching -> failed` | backend failure / timeout |
| `DeliveryRecord` | `delivered -> completed` | `RecordDeliveryFeedback(ack)` |
| `DeliveryRecord` | `delivered -> failed` | `RecordDeliveryFeedback(fail)` |
| `DeliveryRecord` | `failed -> scheduled` | `RequestRetry` accepted |
| `DeliveryRecord` | `failed -> dead_lettered` | `MoveDeliveryToDeadLetter` |
| `RetryPlan` | `scheduled -> exhausted` | retry 次数耗尽 |
| `RetryPlan` | `scheduled -> cancelled` | retry 被取消 |
| `DeadLetterEntry` | `open -> reviewing` | operator / governance 审查流程 |
| `DeadLetterEntry` | `reviewing -> closed` | 死信处置完成 |
| `ReplayPreparation` | `draft -> ready` | DLQ / history / audit chain 和 approval reference 有效 |
| `ReplayPreparation` | `draft -> rejected` | replay 前置条件不满足 |
| `ReplayPreparation` | `draft -> superseded` | 出现新的 replay preparation |
| `ProjectionStatus` | `building -> active` | projection build success |
| `ProjectionStatus` | `active -> stale` | source truth advanced |
| `ProjectionStatus` | `stale -> rebuilding` | `RebuildReadProjection` started |
| `ProjectionStatus` | `rebuilding -> active` | projection rebuild success |

### 7.8 禁止迁移清单

| 禁止迁移 | 原因 |
|---|---|
| `PublicationAcceptanceStatus.rejected -> DeliveryStatus.scheduled` | 被拒绝材料不能进入 delivery |
| `DeliveryStatus.completed -> dispatching` | completed 是终止状态，重放必须走 replay preparation |
| `DeliveryStatus.dead_lettered -> dispatching` | DLQ 不能绕过受控恢复直接投递 |
| `DeliveryStatus.failed -> completed` | 失败必须先形成 ack 或受控恢复结果，不能直接完成 |
| `FeedbackStatus.duplicate -> DeliveryStatus.failed / completed` | 重复反馈不能改变已成立 delivery 状态 |
| `RetryPlanStatus.exhausted -> DeliveryStatus.dispatching` | 重试耗尽后不能继续投递，必须进入 DLQ 判断 |
| `ReplayPreparationStatus.ready -> DeliveryStatus.dispatching` | replay preparation 不是 replay executor |
| `ProjectionStatus.* -> DeliveryStatus.*` | projection 不能反写 bus truth |
| backend raw status -> `DeliveryStatus.*` | 后端状态必须经 adapter / policy 归一化 |
| `CheckBackendCapability` -> `DeliveryStatus.*` | 后端能力检查不能直接改变已提交 delivery truth |

### 7.9 状态传播关系图

```text
Bus truth state transition
  |
  +-- DeliveryHistoryEntry
  |
  +-- BusAuditEntry
  |
  +-- Outbound Event
  |
  +-- Read Projection
        |
        v
      Query / SDK / Observability / Governance / Operator
```

关键说明：

- 状态变化必须先成为 bus truth / history / audit，再传播给下游。
- outbound event 和 projection 是状态传播结果，不是状态真相来源。
- Query、SDK、observability、governance、operator 只能消费只读输出或事件，不得反向驱动 truth 状态迁移。

### 7.10 状态机与 Step 8 反查表

| Step 8 处理流 | 是否有状态影响 | 反查结论 |
|---|---|---|
| `AcceptPublication` | 是 | 影响 `PublicationAcceptanceStatus` |
| `ConsumeCommittedOutboxFact` | 是 | 影响 `PublicationAcceptanceStatus`，但不新增状态集合 |
| `RunDeliveryProgression` | 是 | 影响 `DeliveryStatus` |
| `RecordDeliveryFeedback` | 是 | 影响 `FeedbackStatus` 和 `DeliveryStatus` |
| `ConsumeBackendDeliverySignal` | 是 | 影响 `DeliveryStatus` / `FeedbackStatus`，但后端 raw status 不落库 |
| `ConsumeTimeoutSignal` | 是 | 影响 `FeedbackStatus.timeout` 和 `DeliveryStatus.failed` |
| `RequestRetry` | 是 | 影响 `RetryPlanStatus` 和 `DeliveryStatus` |
| `RunRetryCycle` | 是 | 消费 `RetryPlanStatus.scheduled`，推动 delivery 重试 |
| `MoveDeliveryToDeadLetter` | 是 | 影响 `DeliveryStatus.dead_lettered` 和 `DeadLetterStatus.open` |
| `PrepareReplay` | 是 | 影响 `ReplayPreparationStatus` |
| `RunReadOutputProjection` | 是 | 影响 `ProjectionStatus` |
| `RebuildReadProjection` | 是 | 影响 `ProjectionStatus` |
| `CheckBackendCapability` | 否，仅传播能力视图 | 不新增 bus truth 状态集合 |
| Query API | 否 | 只读，不迁移状态 |
| Outbound Event | 否 | 传播已提交状态，不创建状态 |

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §9 “状态定义与状态流转”应从本文件摘录并整理以下内容：

- §9.1 “状态所有权总表”
- §9.2 “状态定义表”
- §9.3 “主状态流转图”
- §9.4 “恢复状态流转图”
- §9.5 “只读投影状态流转图”
- §9.6 “触发动作与状态影响表”
- §9.7 “允许迁移清单”
- §9.8 “禁止迁移清单”
- §9.9 “状态传播关系图”
- §9.10 “状态机与 Step 8 反查表”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| `RequestRetry` 是否让 `DeliveryStatus.failed -> scheduled` | A：改变 delivery 状态；B：只创建 `RetryPlanStatus.scheduled`，delivery 保持 failed | 建议 A | 这样 `RunRetryCycle` 可以复用 scheduled -> dispatching 主线，状态机更少分叉 |
| `CheckBackendCapability` 是否定义独立状态集合 | A：定义 `BackendCapabilityStatus`；B：只作为能力视图 / audit / event | 建议 B | Step 6 未把 backend capability 定义为 lifecycle truth，新增状态会扩大边界 |
| `PrepareReplay` 是否一步到 `ready` | A：前置条件满足时可 draft -> ready；B：只创建 draft，ready 由后续命令触发 | 建议 A | 当前 Step 7 / Step 8 已把 `PrepareReplay` 定义为 preparation ready 的主入口 |

以上待确认项不阻塞进入 Step 10。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已明确 L0-bus 存在正式状态机。
- 已明确哪些对象拥有状态机，哪些对象不拥有独立状态机。
- 已定义影响主线成立的状态集合、状态含义和是否进入正常主线。
- 已给出主状态流转图、恢复状态流转图、只读投影状态流转图和状态传播关系图。
- 已列出允许迁移、禁止迁移和 Step 8 反查表。
- 已避免写状态机代码、错误码全集、数据库状态列、复杂补偿脚本和 UI 展示规则。
