# Step 10. 异常与边界场景轮廓

## 1. Step 状态

- 状态：[x] 已重写
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-bus/02-概要设计.md` §10 异常与边界场景轮廓

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 8 关键处理流 | 已独立展开 publish、outbox relay、delivery progression、feedback、backend signal、timeout、retry、DLQ、replay preparation、projection、backend capability |
| Step 9 状态机 | 已收稳 `PublicationAcceptanceStatus`、`DeliveryStatus`、`FeedbackStatus`、`RetryPlanStatus`、`DeadLetterStatus`、`ReplayPreparationStatus`、`ProjectionStatus` |
| 上游边界 | bus 不保存 payload body，不保存后端私有响应正文，不生成 governance decision，不让 read projection 反写 truth |
| 本步规范约束 | 只点名影响对象、接口、处理流、状态机或跨仓边界的异常；不写完整错误码、重试参数、补偿脚本、SQL、HTTP 状态码或运维操作步骤 |

已确认结论：

```text
Step 10 不是错误码设计。
它只固定概要层必须先知道的异常路径和边界红线。
```

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名？

回答：

必须点名的异常路径包括：core 契约缺失或不兼容、payload body 误入 bus、outbox fact 未提交或重复、后端不可用、后端 raw status / 私有响应泄漏、timeout、late feedback、重复 feedback、retry 耗尽、DLQ 缺少 history / audit chain、replay trusted chain 不完整、failure material 被误用为 governance decision、projection stale / missing / rebuilding、read-only output 反写 truth、backend capability 变化或 secret 泄漏。

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系？

回答：

以下场景会改变协作关系：publish 被拒绝时不会进入 delivery；backend failure / timeout 会从 delivery 主线进入 feedback / recovery；duplicate feedback 只走幂等短路，不改写 delivery；retry exhausted 进入 DLQ 判断；replay 缺少 trusted chain 时只能 rejected；projection stale 只能影响 Query consistency marker，不修写真相；backend capability check 只影响能力视图和审计，不改变 delivery 状态。

### 3.3 哪些失败不能留到详细设计才发现？

回答：

不能留到详细设计才发现的失败包括：禁止正文保存、无审计状态变化、backend raw status 直接写入 `DeliveryStatus`、replay 绕过 DLQ / history / audit chain、projection 反写 truth、failure material 生成 governance decision、raw secret 进入配置或状态、bus 幂等与业务幂等混淆。这些都是架构边界问题，不是普通错误处理细节。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够？

回答：

需要说明场景、应落在哪个主要组成部分 / application service / 对象 / 边界处理，以及当前概要口径。必要时说明会影响哪个状态机或处理流。无需给出错误码编号、HTTP 状态码、retry interval、补偿脚本、数据库锁或 adapter exception mapping。

### 3.5 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节，不应在本步展开？

回答：

详细设计继续展开 `BusError` / `AdapterError` / `ProjectionError` 枚举、错误码映射、事务回滚、幂等冲突返回格式、retry backoff、DLQ retention、projection rebuild 算法、adapter exception mapping、HTTP / RPC response、CloudEvent 字段和 audit 字段全集。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 Step 10 §7.1 | 异常表仍按早期 publish / delivery / recovery 粗分 | 不能承接 Step 8 拆分后的 backend signal、timeout、projection rebuild、backend capability |
| 旧 Step 10 | late feedback、out-of-order feedback、completed 后反馈等边界没有点名 | 反馈幂等与状态机边界不稳定 |
| 旧 Step 10 | projection stale 和 rebuild 只写了 stale | Query consistency 和 rebuild 边界不完整 |
| 旧 Step 10 | backend capability 变化只作为后端语义漂移描述 | 未明确它不改 bus truth 状态 |
| 旧 Step 10 | 异常表列了影响对象 / 状态，但主表格式与书写规范不完全一致 | 正式 §10 回填时需要调整为规范表头 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖依据 | 按旧主线异常列举 | 按 Step 8 处理流和 Step 9 状态机反查 | 防止异常遗漏 |
| 主表格式 | 场景 / 部分 / 口径 / 影响对象 | 场景 / 应落在哪个部分处理 / 当前概要口径 | 对齐书写规范 |
| 反馈异常 | 重复反馈为主 | 增加 late feedback、unknown delivery、completed 后反馈 | 守住幂等和状态迁移 |
| Projection 异常 | stale 为主 | 增加 missing、rebuilding、read-only 反写 | 守住只读输出边界 |
| Backend capability | 只写语义漂移 | 明确 capability check 只影响能力视图和 audit | 防止新增 bus truth 状态 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：异常全部留给详细设计 | 概要设计短 | 边界红线会被实现细节化，容易越界 | 不采用 |
| 方案 B：在概要设计列完整错误码和恢复矩阵 | 对实现最直接 | 下沉到详细设计，且会提前固定协议 | 不采用 |
| 方案 C：只列会影响对象、接口、处理流、状态机或跨仓边界的异常，并说明概要口径 | 粒度合适，可支撑详细设计继续展开 | 详细设计仍需补完整错误处理 | 采用 |

---

## 7. 结构化中间产物

### 7.1 异常覆盖维度

| 维度 | 必须覆盖的异常类型 | 对应 Step 8 / Step 9 主语 |
|---|---|---|
| 发布接入 | 契约缺失、payload body、重复发布、能力引用不匹配 | `AcceptPublication`、`PublicationAcceptanceStatus` |
| outbox relay | 未提交 fact、重复 fact、checkpoint 不一致 | `ConsumeCommittedOutboxFact` |
| delivery 推进 | 后端不可用、raw status 泄漏、dispatch 未知结果 | `RunDeliveryProgression`、`DeliveryStatus` |
| feedback / timeout | duplicate、late feedback、unknown delivery、timeout | `RecordDeliveryFeedback`、`ConsumeTimeoutSignal`、`FeedbackStatus` |
| retry / DLQ / replay | retry exhausted、DLQ 缺链、replay chain 不完整 | `RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` |
| read output | projection missing、stale、rebuilding、反写 truth | `RunReadOutputProjection`、`RebuildReadProjection`、`ProjectionStatus` |
| backend capability | capability 变化、secret 泄漏、后端语义漂移 | `CheckBackendCapability` |

### 7.2 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| core 契约引用缺失或不兼容 | 发布材料接入与传递语义形成 / `PublicationAcceptanceService` | 拒绝发布材料，形成 `PublicationAcceptanceStatus.rejected` 和 audit，不进入 delivery |
| 发布材料携带 payload body | 发布材料接入与传递语义形成 / `PayloadBoundaryGuard` | 拒绝接入，不保存正文，只允许 payload reference |
| backend capability reference 缺失或不匹配 | 发布材料接入与传递语义形成 / `BackendCapabilityPolicy` | 拒绝派生 `TransportSemantic`，不写后端裸参数 |
| 重复 publish command | 发布材料接入与结果反馈幂等边界 / `IdempotencyAnchor` | 幂等短路，返回已存在接入结果或 duplicate marker |
| outbox fact 未提交 | outbox relay / `OutboxRelayConsumer` | 不生成 `PublicationAcceptance`，等待后续已提交 fact |
| outbox fact 重复消费 | outbox relay / `IdempotencyAnchor` | 幂等短路，不重复写 acceptance、audit 或 outbound event |
| outbox checkpoint 与已处理事实不一致 | outbox relay / relay checkpoint 边界 | 不修写真相，详细设计定义 checkpoint 恢复和审计 |
| 后端不可用 | delivery 推进 / `DeliveryProgressionService` | delivery 进入 failed 或 retry 候选，不静默丢弃 |
| 后端返回 raw status 或私有错误正文 | 后端适配边界 / `TransportBackendPort` | 只能保存归一化结果或引用，不能保存私有响应正文 |
| 后端 delivery signal 指向未知 delivery | backend signal consumer / `DeliveryRepository` | 拒绝改写状态，详细设计定义 dead signal audit 或 ignore 策略 |
| delivery timeout | timeout consumer / `FeedbackResult` | 形成 `FeedbackStatus.timeout`，推动 `DeliveryStatus.failed` 和 retry 候选 |
| timeout 后收到 late ack | feedback 记录 / `FeedbackRecordingService` | 必须基于当前 `DeliveryStatus` 判断，不能直接把 failed / DLQ 改回 completed |
| 重复 feedback | 反馈与幂等留痕 / `IdempotencyAnchor` | 形成 duplicate 或返回既有结果，不改变已成立 delivery 状态 |
| feedback 指向 completed delivery | 反馈与幂等留痕 / `DeliveryLifecycle` | 不允许重新打开 completed，详细设计定义返回冲突或 duplicate |
| retry plan 已 exhausted 仍触发 retry worker | 失败恢复 / `RecoveryEligibilityPolicy` | 拒绝新 attempt，进入 DLQ 判断 |
| retry 被取消后仍触发 retry worker | 失败恢复 / `RetryPlan` | 拒绝 dispatch，不改变 delivery 状态 |
| DLQ 缺少 history 或 audit chain | 失败恢复 / `DeadLetterEntry` | 拒绝进入 trusted DLQ 或标记不可 replay |
| replay request 缺少 dead-letter / history / audit chain | 失败恢复 / `ReplayPreparation` | `ReplayPreparationStatus.draft -> rejected`，不触发 replay executor |
| failure material 被当成 governance decision | 失败材料边界 / `FailureMaterial` | 拒绝该语义，failure material 只表达 bus 失败事实 |
| projection missing | 只读输出 / `ReadProjectionRepository` | Query 返回 not ready / consistency marker，不修写真相 |
| projection stale | 只读输出 / `ProjectionStatus` | 返回 stale marker 或触发 rebuild 建议，不反写 truth |
| projection rebuilding | 只读输出 / `RebuildReadProjection` | 允许读取旧视图或返回 rebuilding marker，不修改 truth |
| read-only output 尝试反写 bus truth | 只读输出 / `ReadOnlyOutputPolicy` | 拒绝 projection write intent，不触碰 truth repository |
| outbound event publisher 失败 | outbound event / `OutboxPublisherPort` | 保留已提交 bus truth，详细设计定义 publisher retry 和 outbox 状态 |
| backend capability 变化 | 后端适配边界 / `CheckBackendCapability` | 只影响能力视图、audit 和 event，不改变已提交 delivery truth |
| raw secret / credential 进入配置或状态 | 后端适配边界 / configuration / secret reference | 拒绝保存 raw secret，只允许 secret reference |

### 7.3 异常影响图

```text
Normal publish / delivery path
  |
  +-- invalid contract / payload body
  |     |
  |     v
  |   rejected acceptance + audit
  |
  +-- backend failure / timeout / subscriber fail
  |     |
  |     v
  |   failed delivery + feedback + recovery candidate
  |
  +-- retry exhausted / DLQ chain missing
  |     |
  |     v
  |   dead-letter rejected or dead-letter open with audit
  |
  +-- replay request without trusted chain
  |     |
  |     v
  |   replay preparation rejected + audit
  |
  +-- projection missing / stale / rebuilding
        |
        v
      query consistency marker, no truth write
```

关键说明：

- 异常路径必须落到 rejected acceptance、failed delivery、recovery candidate、DLQ、replay rejected 或 query consistency marker 之一。
- 该图只表达概要层边界，不表达错误码、重试参数、补偿脚本或 HTTP 状态码。
- 关键状态变化必须进入 history / audit；只读异常不能反写真相。

### 7.4 异常与状态机对应关系

| 异常场景 | 状态机影响 | 是否进入恢复 |
|---|---|---|
| core 契约缺失 | `PublicationAcceptanceStatus.pending -> rejected` | 否 |
| payload body 误入 | `PublicationAcceptanceStatus.pending -> rejected` | 否 |
| backend failure | `DeliveryStatus.dispatching -> failed` | 是 |
| backend signal 未知 delivery | 不迁移状态 | 否 |
| timeout | `FeedbackStatus.timeout`、`DeliveryStatus.failed` | 是 |
| late ack | 取决于当前 delivery 状态，不能强制迁移 | 受限 |
| duplicate feedback | `FeedbackStatus.duplicate`，不改 delivery | 否 |
| retry exhausted | `RetryPlanStatus.scheduled -> exhausted` | 是，进入 DLQ 判断 |
| DLQ 缺少 trusted chain | `DeadLetterStatus.open` 不可进入 replay preparation ready | 受限 |
| replay chain 不完整 | `ReplayPreparationStatus.draft -> rejected` | 否 |
| projection missing / stale | `ProjectionStatus.building / stale / rebuilding` | 不影响 truth |
| backend capability 变化 | 不迁移 bus truth 状态 | 否 |

### 7.5 边界红线清单

| 红线 | 原因 | 后续设计承接 |
|---|---|---|
| bus 不保存 payload body | bus 只负责传递事实和引用 | 详细设计定义 payload ref 校验和拒绝错误 |
| bus 不保存后端私有响应正文 | 后端语义必须归一化 | adapter 结果类型和 audit 字段由详细设计定义 |
| failure material 不是 governance decision | bus 不承担治理决策 | governance 仓消费 failure material 后自行决策 |
| projection 不能反写 truth | read output 是派生视图 | projection repository 和 truth repository 分离 |
| replay 不绕过 DLQ / history / audit chain | replay 必须可审计 | 详细设计定义 trusted chain 校验 |
| backend capability check 不改 delivery truth | 能力检查只影响能力视图 | 配置设计和详细设计定义 capability source |
| raw secret 不进入状态或文档产物 | secret 只能通过引用使用 | 配置设计定义 secret reference |

### 7.6 Step 8 处理流异常反查表

| Step 8 处理流 | 必须覆盖的异常 | 反查结论 |
|---|---|---|
| `AcceptPublication` | 契约缺失、payload body、capability 不匹配、重复 publish | 已覆盖 |
| `ConsumeCommittedOutboxFact` | 未提交 fact、重复 fact、checkpoint 不一致 | 已覆盖 |
| `RunDeliveryProgression` | 后端不可用、raw status 泄漏、dispatch unknown | 已覆盖 |
| `RecordDeliveryFeedback` | duplicate、late ack、completed 后 feedback、unknown delivery | 已覆盖 |
| `ConsumeBackendDeliverySignal` | unknown delivery、raw backend status | 已覆盖 |
| `ConsumeTimeoutSignal` | timeout、late feedback 后续处理 | 已覆盖 |
| `RequestRetry` | exhausted / cancelled retry | 已覆盖 |
| `RunRetryCycle` | exhausted / cancelled 后仍触发 worker | 已覆盖 |
| `MoveDeliveryToDeadLetter` | DLQ 缺少 history / audit chain | 已覆盖 |
| `PrepareReplay` | 缺少 trusted chain、无 approval reference | 已覆盖 |
| `RunReadOutputProjection` | projection missing / stale、read-only 反写 | 已覆盖 |
| `RebuildReadProjection` | rebuilding marker、truth 不可改写 | 已覆盖 |
| `CheckBackendCapability` | capability 变化、secret 泄漏 | 已覆盖 |

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §10 “异常与边界场景轮廓”应从本文件摘录并整理以下内容：

- §10.1 “异常覆盖维度”
- §10.2 “异常与边界场景表”
- §10.3 “异常影响图”
- §10.4 “异常与状态机对应关系”
- §10.5 “边界红线清单”
- §10.6 “Step 8 处理流异常反查表”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| late ack 是否允许把 failed 改回 completed | A：允许；B：不允许直接改回，按当前状态和幂等规则处理 | 建议 B | 避免 timeout / retry / DLQ 后被迟到反馈破坏状态机 |
| projection missing 是否自动触发 rebuild | A：Query 自动触发；B：返回 consistency marker，由 job / operator 触发 | 建议 B | Query 保持只读，不把读取变成写入口 |
| backend capability 变化是否自动重新调度 delivery | A：自动调度；B：只发能力变化事件和审计 | 建议 B | capability check 不应直接改变已提交 delivery truth |

以上待确认项不阻塞进入 Step 11。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已按 Step 8 处理流和 Step 9 状态机反查关键异常。
- 已明确异常应落在哪个主要组成部分、application service、对象或边界处理。
- 已明确异常对状态机、处理流或跨仓边界的影响。
- 已画出异常影响图，并限制在概要层。
- 已列出边界红线和处理流异常反查表。
- 已避免写完整错误码、重试参数、补偿脚本、HTTP 状态码、SQL 和具体恢复实现。
