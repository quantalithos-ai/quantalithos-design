# L4-archive 03 Step 12：错误模型、异常分支与恢复口径

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
> 回填位置：未来正式 `03-详细设计.md` §11
> 日期：2026-09-12
> 状态：`completed / pass_with_upstream_blockers / continuous_authorization`

## 1. Step 状态、输入与完成上限

| 项目 | 本 Step 结论 |
|---|---|
| 前置与授权 | Step 01～11 已完成；用户明确连续授权完成全部 03，允许本步完成后进入 Step 13 |
| 直接输入 | 正式 `00/01/02`；Step 06 error aliases/domain guards；Step 07 store/port/support errors；Step 08 protocol surfaces；Step 09 flows；Step 10 state matrices；Step 11 transaction/recovery |
| 规范输入 | 详细设计 SOP Step 12、书写规范 §5.11、真相源标准的 error-variant、stored-result、commit-unknown、query disclosure 条款 |
| 粒度参考 | `L1-governance` Step 12 的分层与矩阵；`L1-workspace` Step 12 的安全披露粒度；不继承其治理、projection/outbox 或 workspace 主语 |
| 本步目标 | 固定六模块错误 owner、内部到公共 surface 的唯一映射、异常分支、可重试性、恢复动作与安全观测上限 |
| 不在本步 | HTTP/RPC 数字码、transport/topic/DLQ、重试次数与退避、provider 错误码、告警阈值、运维 runbook、补偿脚本 |
| 事实上限 | 只形成可落码设计；不证明 adapter、存储、receiver、digest、签名、恢复、测试或 readiness |

持续 blocker 为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`。错误模型不得把 blocker 映射为成功或凭错误字符串补正式依据。

## 2. 分批写入与 SOP 问题回答

| 批次 | 内容 | 状态 |
|---|---|---|
| 12.1 | 问题回答、诊断、错误层级与类型 | completed / internal_review_pass |
| 12.2 | Command、Query、Consumer、Job 对外映射 | completed / internal_review_pass |
| 12.3 | 异常分支、恢复口径、观测边界 | completed / internal_review_pass_with_blockers |
| 12.4 | 变体闭环、回填草稿与 Step 13 handoff | completed / continuous_authorization |

| SOP 问题 | 回答 / 取舍 |
|---|---|
| 每个模块有哪些错误？ | contracts=`ContractError`；domain=`DomainError`；application 统一为 `ApplicationError`；infra 保留 Step 07 `ArchiveStoreError/ArchivePortError/ArchiveSupportError` 并映射为 `InfraError`；api=`ApiError`；worker=`WorkerError`。外部 adapter 错误不得穿透 public surface。 |
| 哪些映射到 HTTP/RPC/Event 失败？ | 当前 transport 未绑定，只固定 logical disposition/issue。Command 映射 typed response；Query 的 absent/hidden 统一 `NotAvailable`；Consumer 映射 receipt；Job 映射完整 report。不得虚构 HTTP/RPC 数字码或 DLQ。 |
| 哪些可重试？ | 只有已证明未产生外部 effect、未提交或经 probe 确认安全的暂态操作可用同一语义重试；CAS 要重读后新决策；contract/safety/unsupported 等待新依据；unknown 必须 probe/reconcile；corrupt/result-missing 需人工。 |
| 事务、冲突、重复、外部失败如何处理？ | 本地 Aborted 可安全重启；Unknown 先 `probe_commit`；同 key 同 digest replay 完整原结果，异 digest Conflict 且不改原 reservation；外部 `MayHaveDispatched` 保存 Unknown 并走具名 probe，不盲重发。 |
| 哪些需要审计、日志或事件？ | 本地业务 history/result/finding 按既有 UoW 保存；安全日志/metric/trace 由 Step 15 定义。当前无 outbox/event delivery；任何错误都不得私造 outbound evidence。 |

## 3. 当前问题诊断与设计取舍

| 问题 | 风险 | 本步裁定 |
|---|---|---|
| Step 06 只有六个 Result alias，exact variant 尚未闭合 | 实现者会使用 `String/anyhow` 或随意映射 | 本步给出六模块稳定 error enum surface；既有 Step 07 三个 port enum 为唯一底层输入 |
| Step 10 使用 `InvalidTransition/PreconditionFailed/InputMismatch` 等短名 | 可能被误当独立跨层类型 | 明确它们是 `DomainError` variant；每个进入 application/public mapping |
| business Blocked、dependency Unavailable、effect Unknown 混用 | 自动重试可能造成重复副作用 | 三者严格分离：新依据、暂态且可证安全、probe/reconcile |
| hidden 与 absent 错误可区分 | Query 或 duplicate 可泄露存在性 | current disclosure 门禁后统一 `SafeRead::NotAvailable`，内部 reason 不出站 |
| Consumer transport ACK 与本地 Accepted 混同 | 丢消息或伪造 owner 成功 | 只有本地 commit 可证明后 host 才 ACK；receipt 不声明 Bus/owner 成功 |
| result missing/corrupt 被当普通 not-found | duplicate 重跑会篡改历史 | 一致性缺陷、fail-closed、人工修复；绝不从 current truth 重构 |
| timeout 直接映射 Failed | 对已派发 effect 盲重发 | 必须保留 `DispatchKnowledge`；MayHaveDispatched→CommitUnknown |
| 配置/provider 合同缺失被默认化 | 伪造可用性和 readiness | `ContractBlocked`，等待 Step 14/owning project；不设隐式 fallback |

不另画图：Step 09/10 已固定流程与状态顺序，本步的错误/恢复矩阵能更精确指导 `match` 分支。

## 4. 稳定错误类型与层级

### 4.1 `contracts` 与 `domain`

```rust
pub enum ContractError {
    InvalidIdentifier { reason: SafeReasonRef },
    InvalidValue { reason: SafeReasonRef },
    MissingRequiredField { reason: SafeReasonRef },
    WrongKind { reason: SafeReasonRef },
    UnsupportedVersion { reason: SafeReasonRef },
    Mismatch { reason: SafeReasonRef },
}

pub enum DomainError {
    InvalidTransition { reason: SafeReasonRef },
    PreconditionFailed { reason: SafeReasonRef },
    InputMismatch { reason: SafeReasonRef },
    ResultMismatch { reason: SafeReasonRef },
    VersionConflict { reason: SafeReasonRef },
    ClosureIncomplete { reason: SafeReasonRef },
    ContractBlocked { reason: SafeReasonRef },
    ProbeUnavailable { reason: SafeReasonRef },
    CompensationNotAuthorized { reason: SafeReasonRef },
    ClaimUnavailable { reason: SafeReasonRef },
    StaleClaim { reason: SafeReasonRef },
    ResultMissing { reason: SafeReasonRef },
    CorruptState { reason: SafeReasonRef },
}
```

| 类型 / variant group | 触发位置 | 重试分类 | 恢复与公共上限 |
|---|---|---|---|
| `ContractError::Invalid* / MissingRequiredField / WrongKind` | contracts checked constructor / mapper | non-retryable same input | Command Rejected、Consumer Rejected/Quarantined、Job Failed/Blocked；不写成功 truth |
| `ContractError::UnsupportedVersion` | inbound/DTO/value version gate | wait-for-compatible-version | `UnsupportedVersion` issue/receipt/item；不得解析未知 payload |
| `ContractError::Mismatch` | DTO/value relation guard | non-retryable same input | `Conflicting`/Rejected；若来自已存数据则提升 `ApplicationError::ConsistencyDefect` |
| `DomainError::InvalidTransition` | domain mutation | re-read/new explicit intent | Conflict/Blocked；不得 precheck 顺手修状态 |
| `PreconditionFailed/ClosureIncomplete/ContractBlocked` | transition/factory guard | wait-for-new-formal-basis | Blocked/Partial；不从 config/fake 补条件 |
| `InputMismatch/ResultMismatch` | fixed input/outcome/replay correlation | non-retryable same input | Conflicting/Rejected；保留原历史 |
| `VersionConflict/StaleClaim/ClaimUnavailable` | CAS/fence/lease | re-read/reacquire before retry | Conflict/Delayed；旧 worker 禁止提交或派发 |
| `ProbeUnavailable` | formal reconcile seam | retry only probe when allowed | CommitUnknown 保持，不转 Failed |
| `CompensationNotAuthorized` | lifecycle/restore compensation guard | wait-for-authority/manual | Blocked；不执行 reverse action |
| `ResultMissing/CorruptState` | rehydrate/replay/invariant check | manual | fail-closed；不重做 operation |

### 4.2 `application`

```rust
pub enum ApplicationError {
    InvalidInput { reason: SafeReasonRef },
    NotAvailable,
    ContractBlocked { reason: SafeReasonRef },
    Conflict { reason: SafeReasonRef },
    DuplicateDigestConflict { reason: SafeReasonRef },
    UnsupportedVersion { reason: SafeReasonRef },
    DependencyUnavailable { reason: SafeReasonRef },
    CommitUnknown { transaction_ref: Option<ArchiveTransactionRef>, reason: SafeReasonRef },
    ResultMissing { reason: SafeReasonRef },
    ConsistencyDefect { reason: SafeReasonRef },
    StaleClaim { reason: SafeReasonRef },
    Quarantined { reason: SafeReasonRef },
}
```

`ApplicationError` 不能通过无上下文的 blanket `From<DomainError>` 决定 public surface。service mapper 必须带 `operation_name`、channel、visibility/authority outcome、dispatch knowledge 和是否来自 request 还是 persisted truth；相同 `Mismatch` 在入参是 InvalidInput，在持久对象可能是 ConsistencyDefect。

### 4.3 `infra`、`api` 与 `worker`

```rust
pub enum InfraError {
    Store(ArchiveStoreError),
    Port(ArchivePortError),
    Support(ArchiveSupportError),
    ConfigurationBlocked { reason: SafeReasonRef },
}

pub enum ApiError {
    EnvelopeRejected { issue_ref: ArchiveProtocolIssueRef },
    ResponseMappingFailed { issue_ref: ArchiveProtocolIssueRef },
    TransportUnavailable { issue_ref: ArchiveProtocolIssueRef },
}

pub enum WorkerError {
    EnvelopeRejected { issue_ref: ArchiveProtocolIssueRef },
    ClaimUnavailable { issue_ref: ArchiveProtocolIssueRef },
    StaleClaim { issue_ref: ArchiveProtocolIssueRef },
    HandlerUnavailable { issue_ref: ArchiveProtocolIssueRef },
    ReportMappingFailed { issue_ref: ArchiveProtocolIssueRef },
}
```

`ApiError` 只表示 handler/transport 无法构造既定 public response，不替代业务 Rejected/Blocked/Conflict。`WorkerError` 是 runner 边界；可表达的业务结果必须进入 `ArchiveConsumerReceipt` 或 `ArchiveOperationReport`，不能只返回进程错误。raw SQL/HTTP/provider/panic/secret/path 永远不进入任何 variant。

### 4.4 Step 07 底层错误到 application 的唯一映射

| 底层错误 | 必要上下文 | Application 映射 | 可重试性 / 禁止 |
|---|---|---|---|
| `ArchiveStoreError::Unavailable` | local read/write phase；commit knowledge | DependencyUnavailable 或 CommitUnknown | 未 begin/已 Aborted 可受控重试；Unknown 必须 probe |
| `ContractBlocked` | missing store capability/isolation/config | ContractBlocked | 等合同/config；不得换 fake |
| `VersionConflict/UniqueConflict/InputConflict` | current key、digest、loaded version | Conflict 或 DuplicateDigestConflict | exact read 后决策；不 upsert |
| `CorruptRecord/InconsistentRead/ResultMissing` | persisted record/result relation | ConsistencyDefect/ResultMissing | manual；不重构/不重跑 |
| `SnapshotExpired/InvalidCursor` | Query page | InvalidInput mapped `StaleInput`/`InvalidInput` issue | 新 query 从第一页开始；不拼 snapshot |
| `ForeignHandle/FenceRejected` | UoW/read/claim handle | StaleClaim 或 ConsistencyDefect | 拒绝当前 worker；不 epoch fallback |
| `ArchivePortError::InvalidInput/BindingMismatch` | exact input/correlation | InvalidInput/Conflict | 不接纳 response，不从 body 猜 |
| `ArchivePortError::Unavailable/DeadlineExceeded/InvalidResponse` | `DispatchKnowledge` | NotDispatched→DependencyUnavailable；MayHaveDispatched→CommitUnknown | 后者仅 probe/reconcile，不自动 dispatch |
| `ArchiveSupportError::InvalidContext/IdConflict/InvalidClaim` | operation context/ID/claim | InvalidInput/Conflict/StaleClaim | 不 mint replacement 伪装同 operation |
| `AuthorityUnavailable/Unavailable/ContractBlocked` | authority/config support | NotAvailable 或 ContractBlocked/DependencyUnavailable | 对外先经过 disclosure；不得默认 allow |

## 5. 对外错误映射

### 5.1 Command 与 Query

| Application 结果 | Command disposition / issue | Query surface | 调用方动作 |
|---|---|---|---|
| InvalidInput | Rejected / InvalidInput 或 MissingRequiredField | Blocked / InvalidInput | 修正请求；同输入不重试 |
| NotAvailable | Blocked / NotVisible（不含原因） | NotAvailable / 无存在性字段 | 重新取得授权或停止；不能枚举目标 |
| ContractBlocked | Blocked / ContractBlocked | Blocked / ContractBlocked（仅可披露时） | 等 owning contract/config 闭合 |
| Conflict | Conflict / VersionConflict 或 Conflicting | Stale/Blocked | 重新读取后发新显式请求；不复用旧 expected input |
| DuplicateDigestConflict | Conflict / DuplicateDigestConflict | 不适用 | 更换合法 key 或修正 caller；原 reservation 不变 |
| UnsupportedVersion | Rejected/Blocked / UnsupportedVersion | Blocked / UnsupportedVersion | 升级兼容合同；不自动迁移 |
| DependencyUnavailable | Blocked / Unavailable | Unknown/Blocked | 仅在可证明无 effect 时按后续政策重试 |
| CommitUnknown | CommitUnknown / CommitUnknown | 不适用 | 用 transaction/result probe；不重新 admission/effect |
| ResultMissing/ConsistencyDefect | Blocked / ResultMissing 或 ContractBlocked | Unknown/NotAvailable | 人工处置；不从当前 truth 重算 |
| StaleClaim/Quarantined | Command 不适用或 Blocked | 不适用 | worker reacquire / operator review |

不绑定 HTTP/RPC 数字码。API adapter 只能将以上逻辑 surface 映射到未来已批准 transport contract；同一内部错误不能因框架默认值变成成功。Query disclosure 优先：目标 absent、hidden、revoked 或无法安全判断一律 `NotAvailable`，不出站内部 reason。

### 5.2 Consumer 与 Job

| 条件 | Consumer receipt | Job report/item | 持久与 ACK 规则 |
|---|---|---|---|
| envelope/shape invalid | Rejected 或 Quarantined | Failed/Blocked item | 无业务 truth；可存完整安全 receipt/result；host 仅按正式 transport policy 处置 |
| schema unsupported | UnsupportedVersion，不解析 payload | UnsupportedVersion item / Blocked report | 不写 owner/body；无本仓 DLQ 声明 |
| same key+digest complete | Duplicate，原 receipt replay | Duplicate，原完整 report replay | 不重跑 handler/job/effect |
| same key different digest | Rejected/Quarantined + Conflicting issue | Blocked/Failed + Conflicting item | 原 reservation/result 不变 |
| dependency unavailable before effect | Delayed 或 Quarantined | Blocked/Partial | 只有本地 result commit 可证后才能 ACK；重试参数留 Step 13/14 |
| version/CAS conflict | Delayed 或 Rejected（按 envelope 语义） | Stale/Conflicting item | 重新读取/新 claim；不覆盖 |
| external may-have-dispatched | CommitUnknown | CommitUnknown item/report | 保存 exact intent/correlation 后 probe；不得 ACK 为 owner success |
| partial item failure | Accepted receipt 含逐项 issue，若该 consumer 定义逐项 | Partial report 含全部 processed item | 已提交 item 保留；只对具名未决 target 开新 operation |
| local commit unknown | CommitUnknown + local marker Unknown | CommitUnknown report 或 runner error | 先 `probe_commit`；未决时 host 不确认处理完成 |
| stale claim before commit | Delayed / 无新 receipt | Blocked/Failed process entry，业务 report仅若已提交 | UoW abort；新 runner 读 result/checkpoint |

## 6. 异常分支处理矩阵

| 场景 | 检测位置 | 本地处理 | 安全观测 / 事件 |
|---|---|---|---|
| authority/scope/visibility 无法证明 | API/application authority seam | Rejected/Blocked/NotAvailable；不构造 Accepted | 可记录脱敏技术观测；无 outbound |
| same key 同 digest | reservation/result read | 完整 replay，出站前重验当前 disclosure | 无新 business history/event |
| same key 异 digest | reserve/replay validation | 返回 Conflict；不修改原 reservation/result | 安全 counter/trace，细节不出站 |
| domain guard/非法 transition | domain method | UoW rollback 或保存已有定义的 Blocked result | 仅 safe issue/result；不写 success history |
| CAS/read-set/range/fence 冲突 | UoW commit | Aborted；重读后由新显式 invocation 决定 | conflict metric/trace；无 success event |
| local commit outcome Unknown | UoW commit | 保存 transaction ref 于返回上下文；`probe_commit` + result/reservation read | commit-unknown observation；不宣称成功/失败 |
| Completed reservation 但完整 result 缺失 | duplicate replay | `ResultMissing`/ConsistencyDefect；阻塞 | 必须可运维观测；无重跑/outbound |
| immutable aggregate sidecar 缺失/冲突 | rehydrate/closure/assessment | Corrupt/Incomplete；不 seal/verify/restore | finding/安全诊断；不补写当前值 |
| source response late/mismatch/unknown | E02/J03/J04 | 保留原 attempt；存 typed finding/outcome | 不升级 coverage Complete |
| external port NotDispatched | adapter mapping | 保留 committed intent；按新具名操作决定 retry | 不伪造 Failed commit |
| external port MayHaveDispatched | adapter mapping | CommitUnknown/ReconcileRequired；只走 J04/J12/J16 或正式 probe | 保存 exact correlation；无盲重发 |
| probe NotFound/Unknown | reconcile job | 保持 Unknown；等待正式 evidence/manual | 保存 probe result/report，不推未发生 |
| receiver mapping drift | J15 resolve vs J13 item | intent/dispatch 前 Blocked；新 plan revision 才能换 mapping | safe finding/report；不写 owner DB |
| legal hold/delete/retention authority 缺失或变化 | lifecycle pre-dispatch/current check | Blocked；已知 effect history不抹除 | 保存 decision ref/basis；无 Archive 自主批准 |
| integrity/signature/schema contract 缺失或失败 | assessment/seal/restore guard | Unknown/Blocked/IntegrityFailed/Unsupported | 保存 formal ref/finding，不造 digest/key/pass |
| cursor invalid/expired/mapping pending | Query page mapper | typed Blocked/Stale；调用方新开 query | Query strict no-write；不修 cache/mapping |
| worker claim expired/superseded | protect_with_claim/commit | abort，不派发、不提交；新 claim read checkpoint/result | 进程内 entry 可 Delayed/Failed；不造 durable marker |
| observability sink unavailable | Step 15 adapter seam | 不改变已提交业务 truth；记录本地丢失 posture（若合同存在） | 不重执行业务，不伪造审计 evidence |

当前 `AR-HLD-Q-001` 未关闭，因此表中“事件”列全部为无 outbound；不能新增 outbox、publisher、delivery state 或 evidence。

## 7. 恢复口径表

| 错误类别 | 恢复类别 | 允许动作 | 禁止动作 |
|---|---|---|---|
| invalid input/wrong kind/unsupported | non-retryable same input | caller 修正或升级后用新显式请求 | 原样循环重试、猜 schema |
| missing authority/contract/safety basis | wait-for-new-basis | owning project/config 给出正式新依据后新 operation/revision | local default allow、风险接受 |
| CAS/version/range/fence conflict | conditional retry | 重读 current version、重取 claim、重新决策 | blind overwrite、复用 stale expected version |
| dependency unavailable + NotDispatched | retryable by policy | 同一 stable intent/key 下按 Step 13 策略重试或新 reconcile operation | 无上限重试、换 key 绕 guard |
| local commit Unknown | probe required | `probe_commit(transaction_ref)`，再 exact result/reservation read | 把 absence 当 Aborted、重做 mutation |
| external CommitUnknown | reconcile required | exact input/key 的正式 probe；仍 unknown 则保留/manual | dispatch retry、从 ACK/timeout 推结论 |
| partial bounded operation | resume explicit subset | 读取完整 report/checkpoint，只处理具名未决 target | 重扫并重做已成功 item |
| result/sidecar/correlation corrupt | manual/repair design required | 隔离、告警、按未来正式 repair plan 处置 | current truth 重构历史、静默删除 |
| receiver rejection/definite failure | formal next intent | 由 owning authority 决定新 handoff/compensation；其他 owner独立 | Archive 自行重写 owner 或补偿 |
| integrity failed/unsupported version | new immutable input/version | 新 Bundle/manifest/assessment/plan revision | 原地把失败改 Verified/Supported |
| visibility revoked | no truth mutation | 返回 NotAvailable；未来授权后重新 query | 暴露旧 replay payload、删除 Archive truth |

恢复不是把状态“改成成功”。每个恢复动作都必须是 Step 08 已定义的独立 entry，或在后续正式设计新增 entry 后回退 Step 06～13；当前没有通用 Repair/Retry command。

## 8. 一致性缺陷目录与反模式

| 缺陷 | 必须响应 | 禁止 |
|---|---|---|
| Completed reservation 缺 result/surface | ResultMissing + operator-visible consistency defect | duplicate 重跑或临时拼 response |
| result operation/kind/digest 与 reservation 不符 | CorruptRecord/ConsistencyDefect | 按 ref 字符串择一 |
| manifest entries/closure/source sidecar 不完整 | ClosureIncomplete/CorruptState | seal 或从 current capture 补齐 |
| fixed effect input 缺失但 action/handoff 存在 | ConsistencyDefect；阻止 dispatch/probe | 从当前 config 重建旧 input |
| handoff owner/receiver/material/outcome 断链 | Conflicting/ConsistencyDefect；隔离 item | 把其他 owner outcome 借用过来 |
| current cursor 不能映射 private snapshot | Blocked/Stale；重新首读 | 暴露 repository cursor 或跨 snapshot 拼页 |
| fake 能成功而 durable 拒绝 | adapter contract violation | 用 fake-specific fallback 保绿 |

反模式还包括：将所有错误变成 `InternalError`；将 `Blocked` 自动排队重试；用 timeout 推断失败；Query 写修复；从 raw provider error 合成 evidence；以日志成功代替审计 truth；以 Archive Bundle 直接写 owner；把项目 restored/archived 状态归 Archive。

## 9. 跨 Step 闭环与回填草稿

| 审查项 | 结论 |
|---|---|
| Step 06 aliases 与 state guard | pass：六模块错误 owner 已固定；Step 10 短名均有 Domain/Application 落点 |
| Step 07 store/port/support errors | pass：全部 variant 有 contextual mapper、重试性和禁止项 |
| Step 08 public issue/disposition | pass：Command/Query/Consumer/Job 均有唯一 surface；不虚构 transport code |
| Step 09 abnormal flows | pass：30 logical entries 的共同异常与 external effect posture 已覆盖 |
| Step 10 18 状态主语 | pass：非法 transition、precondition、mismatch、probe、claim、result error 全闭合 |
| Step 11 transaction/recovery | pass：Aborted/Unknown、result missing、sidecar、cursor、fake parity 有恢复 |
| owner/source authority | pass_with_upstream_blockers：错误不反写 owner、不补 canonical truth |
| outbound | pass_by_absence：无 outbox/event error family；解锁须回退设计 |

正式 §11 回填：保留 §4 的稳定错误层级与变体、§5 的四种入口映射、§6 异常矩阵、§7 恢复口径和 §8 一致性缺陷；所有 public error 先过 current disclosure/redaction。HTTP/RPC、retry budget、provider/config、日志/metric 字段分别留正式 adapter、Step 13～15/04，不写成既成事实。

## 10. 待确认、Step 13 承接与完成门禁

待确认仍为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`，无新增 owning-project blocker。operation namespace/canonical digest、重试/退避/预算、claim lease 等进入 Step 13/14；observability 字段进入 Step 15。

| Step 13 主题 | 本步输入 |
|---|---|
| key/digest | same/same replay、same/different conflict、result missing 不重跑 |
| concurrency | CAS/read-set/range/fence conflict 的重读与禁止 blind overwrite |
| retry/reentry | NotDispatched 与 MayHaveDispatched 分离；仅具名 operation |
| partial resume | stored report/checkpoint + explicit unresolved targets |
| local unknown | transaction probe + exact result/reservation lookup |
| external unknown | J04/J12/J16 probe-only；不换 key 绕过 |

| 完成门禁 | 结果 |
|---|---|
| 四类必备表 | pass |
| error variant→module/trigger/retry/public/recovery | pass |
| 30 entry / 18 state subject closure | pass |
| raw error/secret/provider leakage | prohibited |
| 新 blocker | none |
| formal 03 写入 | not allowed until Step 19 |
| 下一动作 | 按连续授权进入 Step 13 |

本 Step 未实现代码、未执行项目测试、未生成 artifact/evidence/verdict/readiness、未提交 commit。
