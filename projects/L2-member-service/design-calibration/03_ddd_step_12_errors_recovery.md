# Step 12：错误模型、异常分支与恢复口径

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md`

## 1. Step 状态与执行边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 12 错误模型、异常分支与恢复口径 |
| 状态 | completed / pass_with_upstream_blockers |
| 输入 | 正式 `00/01/02`、Step 1~11、上游 blocker 注册表 |
| 输出 | 本文件；同步更新 `03_ddd_calibration_flow.md` 与 `project_execution_ledger.md` |
| 正式正文 | 仍禁止写入，直到 Step 19 |
| 本步不做 | 不定义 HTTP/RPC 数字码、broker/DLQ 名称、retry 数值、部署告警或实现事实 |

本步只收束 member-service 内部错误类别、对外 disposition、异常分支、恢复责任和不可逆副作用边界。错误文本、传输状态码和部署参数分别由 entry adapter、配置设计与观测/运维文档承接；未闭合的 Runtime、Member、Images、Sandbox、Core/Bus、SDK 合同继续以 `pending / blocked / placeholder / fail-closed` 表示。

## 2. 本步目标

实现者应能从本文件判断：

- 错误属于 domain、application、port、API、worker 还是 job；
- 哪些错误可重试、哪些必须换输入、哪些要求人工介入；
- Command、Query、Consumer、Outbox publisher 和 Operations Job 如何映射到稳定的结果面；
- 事务失败、并发冲突、重复请求、commit unknown、外部依赖不可用时，哪些本地记录可以写，哪些绝不能写；
- “本地已提交”“已提交给目标”“目标已观察”“目标已接受”四层 handoff 不被错误处理隐式合并。

本仓不把异常转换成新的业务主语。任何 recovery 只推进已有 Host、attempt、cleanup、projection、outbox、handoff 或 reconciliation 记录，不凭错误消息创建 intent、orchestration decision、generation、Runtime run 或 Sandbox truth。

## 3. 输入与前序闭环

| 前序输入 | 本步使用方式 | 本步不得改写 |
|---|---|---|
| Step 6 对象契约 | 复用 domain factory、状态轴、reason/ref、generation/revision guard | 不新增状态轴或第 30 个业务对象 |
| Step 7 Port 契约 | 映射 repository、resolver、publisher、handoff、UoW、idempotency 错误 | 不把 adapter exception 直接暴露给 public protocol |
| Step 8 协议契约 | 固定 `HostCommandOutcome`、`HostQueryOutcome`、`HostConsumerReceipt`、job disposition | 不补 Core/Bus envelope、route、receipt exact schema |
| Step 9 函数流 | 固定 rollback 点、local-first、query no-write、job/consumer 写入上限 | 不把失败流改成同步 external success |
| Step 10 状态机 | 固定 `Rejected/Blocked/Unknown/Held/Gap/Stale` 等正交语义 | 不把错误 disposition 当作生命周期状态 |
| Step 11 持久化一致性 | 固定 accepted write-set、stored result、outbox snapshot、cursor隔离 | 不用当前 truth 重建缺失 sidecar |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 每层有哪些错误？ | domain 返回 `DomainError`；application 统一为 `ApplicationError`；Port/infra 返回 typed port error；entry 输出 protocol/query surface；worker 输出 receipt/disposition；jobs 输出 run/item report。 |
| 哪些错误可重试？ | 临时 store/resolver/publisher/handoff unavailable、可确认的 version conflict、`InFlight`、worker delayed 可按既定 key 重试；不得盲重试 unknown effect。 |
| 哪些错误不可重试？ | 输入缺失、越权、非法状态、forbidden body、unsupported version、digest conflict、不可修正 schema 错误。 |
| 哪些需要人工介入？ | commit status unknown、rollback unknown、stored result/payload snapshot 缺失、永久 publish/handoff 失败、projection/index consistency defect、reconciliation drift。 |
| Query 是否写修复记录？ | 否。Query 只读 source/projection/history，返回 not-visible/degraded/unavailable；不 refresh、mark stale、repair 或 publish。 |
| receipt 是否表示外部完成？ | 否。receipt 只表示本地接收 disposition；不等价于 Runtime、Member、Images、Sandbox 或目标端完成。 |

## 5. 错误分层与暴露边界

```text
domain factory / transition / policy guard
        -> DomainError
application use-case / UoW orchestration
        -> ApplicationError
repository / resolver / publisher / handoff / adapter
        -> typed PortError -> ApplicationError
api handler       -> HostCommandOutcome / HostQueryOutcome
worker consumer   -> HostConsumerReceipt / worker disposition
operations job    -> HostJobRunDisposition / item report
```

| 层 | 可以看到 | 不得直接暴露 |
|---|---|---|
| `domain` | typed ref、value object、state、policy input、safe reason | repository/transport/HTTP、secret、raw external body |
| `application` | domain error、Port error、UoW/idempotency result | 数据库 exception、adapter body、transport 数字码 |
| `api` | safe result、rejection、visibility/freshness marker | domain 私有字段、raw endpoint、credential、外部正文 |
| `worker` | envelope validation、receipt、delayed/rejected disposition | 不支持版本的 payload body、broker internals |
| `jobs` | selector、item failure、run report | scheduler 身份作为 actor、外部系统正文、隐式授权 |
| `infra` | concrete exception、availability、serialization issue | 直接改变 Host Truth 或绕过 application |

## 6. Domain error catalog

| 错误 | 触发条件 | 重试/处置 | 允许写入 |
|---|---|---|---|
| `DomainError::InvalidStateTransition` | 不在 Step 10 合法矩阵、terminal 再迁移 | 不重试原请求；修正状态后新命令 | 不写 accepted truth/history/outbox |
| `DomainError::MissingRequiredValue` | actor、双锚、scope、basis、reason、target、generation、stable key 缺失 | 修正输入 | 无业务写入 |
| `DomainError::PolicyRejected` | control/qualification/readiness/recovery/closure guard 不满足 | 等待正式前提或修正输入 | 不写正向事实 |
| `DomainError::ExternalBodyRejected` | raw Member/Runtime/Images/Sandbox/Work/Identity body进入边界 | 不重试原 body；只传 ref/summary/digest | 可写 redacted rejection receipt（若流程允许） |
| `DomainError::ReferenceNotResolved` | required safe ref stale/unavailable/invalid/unresolved | stale/unavailable 可由 refresh job 后重试；invalid 不盲重试 | 仅 owner 允许的 reference marker |
| `DomainError::GenerationMismatch` | feedback/action/health/session 不匹配 host generation | late/held；由 reconciliation 处理 | matching gap/history，不能覆盖 current |
| `DomainError::UnknownEffectProtected` | attempt/cleanup/outbox effect 状态为 unknown | 保留原 key，等待显式 reconciliation | unknown/held marker；不得换 key |
| `DomainError::InvariantViolation` | 字段组合、revision、causality 或 same-key fence不成立 | 人工修复设计/数据 | 不写部分对象 |
| `DomainError::ProjectionMutationRejected` | query/job/repair 试图反写 source truth | 拒绝并记录 consistency issue | 仅 job failure/issue marker |
| `DomainError::HandoffMarkerRejected` | target/key/layer/causality 不完整或层级倒置 | 修正 marker 输入 | 不调用外部 handoff |

Domain error 不携带 HTTP code、数据库错误、外部 payload 或 secret。`Unknown`、`Gap`、`Blocked` 是业务可观察 disposition，但不是“成功”的别名。

## 7. Application、Port 与 entry error catalog

### 7.1 Application errors

| 错误 | 触发条件 | 默认处置 |
|---|---|---|
| `ApplicationError::InvalidRequest` | metadata/body/page/scope/idempotency 必填缺失或互斥字段同时出现 | protocol rejected，不执行 mutation |
| `ApplicationError::NotFound` | Host-owned target/ref/report/view 不存在 | command not found；query missing surface |
| `ApplicationError::NotVisible` | actor 无权查看 subject 或 safe slice | query not-visible，body 为空/脱敏 |
| `ApplicationError::DomainRejected` | domain factory/transition/policy拒绝 | protocol/worker/job semantic rejection |
| `ApplicationError::VersionConflict` | expected `HostRevision` 不匹配 | rollback；重新读取后由调用方决定是否重试 |
| `ApplicationError::IdempotencyConflict` | 同 operation/key 不同 digest | 不重试；使用原请求或新 key |
| `ApplicationError::DuplicateResultMissing` | completed reservation 指向的 result/receipt/report 不存在或类型错 | consistency degraded；禁止重建/重跑 |
| `ApplicationError::DependencyUnavailable` | local store、resolver、publisher、handoff 暂时不可用 | command unavailable；worker delayed；job retryable |
| `ApplicationError::ExternalReferenceUnresolved` | required source 未解析或快照不可用 | blocked/degraded；由 refresh/reconciliation 处理 |
| `ApplicationError::UnsupportedSchemaVersion` | event/job/public schema 不受支持 | worker unsupported/dead-letter；不解析 body |
| `ApplicationError::ConsistencyDefect` | payload snapshot、sidecar、cursor、index 或 stored result缺失 | 人工/运维介入；不生成替代事实 |
| `ApplicationError::CommitStatusUnknown` | commit 结果不确定，可能已持久化 | unknown surface；先按原 key 查询，不补偿写入 |

### 7.2 Port / infrastructure errors

| Port error | 映射 | 处理规则 |
|---|---|---|
| `RepositoryError::NotFound` | `NotFound` | 按调用面映射，不把 empty 当 healthy |
| `RepositoryError::VersionConflict` | `VersionConflict` | 不自动 merge，不丢弃最新值 |
| `RepositoryError::StoreUnavailable` | `DependencyUnavailable` | 可重试，遵守同一 operation key |
| `RepositoryError::SerializationFailed` | `ConsistencyDefect` | 不从字符串推断状态；人工修复 |
| `UnitOfWorkError::BeginFailed` | `DependencyUnavailable` | 无 mutation，可稍后重试 |
| `UnitOfWorkError::CommitFailed` | `CommitStatusUnknown`（若状态不明）或 unavailable | 不盲重放、不中途补偿 |
| `UnitOfWorkError::RollbackFailed` | `ConsistencyDefect` | 进入运维/ reconciliation，禁止声明未写入 |
| `IdempotencyError::AlreadyInProgress` | delayed/unavailable | 等待同 key 完成，不创建第二次执行 |
| `IdempotencyError::ResultMissing` | `DuplicateResultMissing` | 不用 current truth 合成 replay result |
| `ResolverError::Unavailable` | delayed/dependency unavailable | 不写 resolved snapshot |
| `ResolverError::InvalidResponse` / `ForbiddenBody` | rejected/failed item | 不保存 raw body |
| `PublisherError::Retryable` | outbox failed retryable | 只更新 publication marker |
| `PublisherError::Permanent` / `PayloadInvalid` | dead-letter/terminal failed | 人工修复 schema/config；不再自动重试 |
| `HandoffError::Retryable` | handoff failed retryable | 保存 target-specific failure marker |
| `HandoffError::Permanent` | failed/manual | 保留 package/marker ref，禁止伪造 accepted |

### 7.3 Public / worker / job surfaces

| Surface | 允许携带 | 不得携带 |
|---|---|---|
| `HostCommandOutcome::Accepted` | safe result/ref、source revision、correlation | external completion claim |
| `HostCommandOutcome::Rejected` | stable category、safe reason ref | raw error/body |
| `HostCommandOutcome::Duplicate` | stored result ref或回放结果 | 新 mutation |
| `HostCommandOutcome::Conflict` | conflict ref、expected/current revision marker | 自动 merge结果 |
| `HostCommandOutcome::Blocked` | blocker id、retryability、safe gap | ready/active/healthy positive |
| `HostQueryOutcome::Visible` | safe view/page、freshness | secret/raw endpoint |
| `HostQueryOutcome::NotVisible` | visibility marker | domain object existence推断 |
| `HostQueryOutcome::Degraded/Unavailable` | freshness/availability/consistency marker | synthetic replacement truth |
| `HostConsumerReceipt::Accepted` | local receipt ref | sibling/backend completion |
| `HostConsumerReceipt::Duplicate` | stored receipt ref | 再次写 snapshot/attempt |
| `HostConsumerReceipt::Delayed` | retryable reason ref、backoff hint（数值由配置） | 新 effect key |
| `HostConsumerReceipt::Rejected/UnsupportedVersion` | redacted issue ref/version marker | payload body |
| `HostJobRunDisposition` | run id、item refs、report/stored-result ref、partial/failed reason | scheduler authorization或外部完成 |

## 8. Command 异常映射

| 条件 | 对外结果 | 事务/副作用 | 恢复 |
|---|---|---|---|
| metadata/subject invalid | `InvalidRequest` | 不 reserve、不 begin mutation | 修正输入 |
| actor/scope unauthorized | `NotAuthorized`或`DomainRejected` | 无 accepted trace/outbox | 使用正式授权上下文 |
| target missing | `NotFound` | rollback；无 success marker | 重新解析 ref |
| required source unresolved | `Blocked`/`DependencyUnavailable` | 不写 ready/active；仅允许本流定义的 marker | refresh 后重试 |
| domain transition/policy rejected | `DomainRejected` | rollback；不追加 accepted history/outbox | 修正状态/前提 |
| expected revision conflict | `Conflict` | rollback；不覆盖新版本 | 重新读取并重新评估 |
| same key + same digest | stored `Duplicate` replay | 当前 UoW rollback；不新写 | 直接返回存储结果 |
| same key + different digest | `IdempotencyConflict` | 不做 domain mutation | 原 key或新 key |
| idempotency result missing | `Unavailable` + consistency marker | 不重建、不重跑 | 人工修复 result store |
| UoW begin/store unavailable | `DependencyUnavailable` | 无部分 accepted truth | 同 key 重试 |
| commit unknown | `Unavailable` + unknown marker | 不发送补偿命令 | 先按 key 查询 reservation/result |
| history/material/outbox/stored-result 写失败 | `DependencyUnavailable`或 consistency defect | accepted write-set整体 rollback | 修复依赖后重试 |

Command 只有在 required local truth、history/material/outbox/stored result 和 idempotency completion 均满足 UoW 要求后，才能返回 `Accepted`。错误文本不能决定是否 retry/dead-letter。

## 9. Query、Consumer、Publisher 与 Job 异常映射

### 9.1 Query

| 条件 | 返回 | 禁止写入 |
|---|---|---|
| request/page invalid | `HostQueryOutcome::Rejected/InvalidRequest` | 全部写操作 |
| visibility denied | `NotVisible` | 不写审计修复、projection、trace |
| source/view missing | `Unavailable`或 missing marker | 不合成对象 |
| projection stale/rebuilding | `Degraded` + freshness marker | 不在 query 中 rebuild/mark fresh |
| projection unavailable/index defect | `Unavailable`/consistency marker | 不反写 source |
| repository read unavailable | `Unavailable` | 不开启写 UoW |

Query 不得调用 `begin`、`reserve`、`mark_stale`、`save_*`、`append_history`、`append_outbox`、resolver refresh 或 repair。

### 9.2 Inbound Consumer

| 条件 | receipt/disposition | 允许写入 |
|---|---|---|
| 缺 event id/version/source/dedup key | `Rejected` | 仅在有足够 metadata 时存 redacted rejected receipt |
| unsupported version | `UnsupportedVersion` | 不解析 payload、不写 snapshot/stale |
| body parse/forbidden body失败 | `Rejected` | 不保存 raw body；可保存 issue ref |
| same key + same digest | `Duplicate` | 读取 stored receipt，不重复 mutation |
| same key + different digest | `Rejected`/conflict | 不写 domain snapshot |
| resolver/store临时失败 | `Delayed` | rollback；保留原 key |
| generation/sequence late | `Delayed`或`Rejected` | 只能写 matching late/gap marker |
| accepted source/feedback mapping | `Accepted` | 仅写允许的 snapshot/attempt/health/cleanup/handoff + receipt |

Consumer 不得创建 intent、decision、generation、recovery、closure 或新的 effect key；不因 receipt accepted 推导 ready/healthy/closed。

### 9.3 Outbox publisher

| 条件 | 本地状态 | 恢复 |
|---|---|---|
| pending scan失败 | job/worker delayed/failed | 稍后扫描，不改 payload |
| payload snapshot缺失 | failed/dead-letter（依策略） | 人工修复；不得 current truth 回查组包 |
| retryable publish | `Failed` + retryable reason | 同 publication key 重试 |
| permanent/schema failure | `DeadLettered`/terminal failed | 修复 config/schema 后新 run，不能自动重发旧未知调用 |
| publish 成功但 marker 保存失败 | unknown/delayed | 先 reload marker，再决定是否重试 |
| 已终结项再次出现在 pending | consistency defect | 停止覆盖，进入 reconciliation |

publisher 只消费 `HostOutboxRecord` 内 immutable payload snapshot。`submitted` 只能由本地 submission result 形成，不能推导 `delivered/observed/accepted`。

### 9.4 Operations Job

| Job | validation reject | item failure | job-level failure |
|---|---|---|---|
| `DispatchPendingHostActionsJob` | selector/metadata invalid | attempt missing、version conflict、carrier unavailable | pending scan/result store unavailable |
| `EvaluateDueHostHealthJob` | scope/page invalid | signal stale、basis missing、assessment conflict | health store unavailable |
| `ProgressPendingHostCleanupJob` | selector invalid | cleanup unknown/failed、generation mismatch | cleanup store unavailable |
| `ReconcileHostResidualsJob` | empty/invalid scope | residual finding、case conflict | scanner/report store unavailable |
| `PublishHostFactOutboxJob` | envelope/selector invalid | payload/publisher failure | outbox scan/result store unavailable |
| `RebuildSafeHostProjectionJob` | view selector invalid | source missing、view assembly/version failure | projection store unavailable |
| `ReconcileHostHandoffGapsJob` | target/key selector invalid | unknown/delayed/per-target mismatch | handoff store/result store unavailable |

Job 的 `Completed/PartiallyCompleted/Failed/DuplicateReplayed/Rejected` 只描述本地 run 和 item；Job 不产生新的授权、decision、generation 或外部完成事实。

## 10. 异常分支与恢复责任矩阵

| 失败位置 | 检测 | 处理 | 责任 owner |
|---|---|---|---|
| entry validation | API/worker/job entry | 返回 rejected；不进 mutation | `api`/`worker`/`jobs` |
| idempotency reserve | application | duplicate replay、in-flight delayed、digest conflict | `application/idempotency.rs` |
| domain guard | domain | 返回 rejected/blocked；UoW rollback | `domain` + application |
| local save/version | repository | rollback；返回 conflict/unavailable | application Port + infra adapter |
| commit unknown | UoW | 标记 unknown surface；按原 key 查询 | application + operations |
| sidecar/history/material/outbox | maintenance repository | accepted write-set整体失败或 consistency defect | application/UoW |
| external resolver | resolver adapter | safe unresolved/failed marker或delayed；不保存 body | corresponding consumer/job |
| carrier/runtime/sandbox | placeholder adapter | blocked/unknown；不声明 positive | `infra` seam + application |
| publisher/handoff | publication/handoff Port | 更新 marker，保留 payload/key；不回滚 Host Truth | worker/jobs |
| projection rebuild | projection job | view stale/degraded/unavailable；source不变 | projection job |
| reconciliation drift | reconciliation job | append finding/case/report；不自动修复 sibling/backend | reconciliation job |

### 10.1 恢复分类

| 分类 | 例子 | 允许动作 |
|---|---|---|
| retryable | store/resolver/publisher/handoff temporary unavailable、in-flight、可重新读取的 version conflict | 同一 operation/effect/publication/handoff key 重试 |
| wait/blocked | 上游 exact contract、source freshness、credential/image/sandbox qualification 未闭合 | 保持 `Blocked/Waiting/Unknown`，等待正式输入 |
| reject | invalid input、forbidden body、unsupported version、unauthorized、digest conflict | 返回稳定拒绝；不产生 accepted side effect |
| hold/reconcile | unknown effect、late generation、marker conflict、delivery gap | 保留原 key，建立/更新 gap 或 reconciliation surface |
| manual | commit unknown、rollback unknown、missing snapshot/result、serialization defect、permanent target failure | 停止自动重试，运维/设计修复后新 run |

## 11. 审计、history、outbox 与 marker 写入规则

1. 只有 accepted local truth transition 才能在相应 UoW 中追加 `HostHistoryEntry`、`HostFactMaterial`、`HostOutboxRecord` 或 projection stale marker。
2. rejected、not-visible、unsupported-version、duplicate replay 不创建新的 accepted trace/outbox；如流程需要 receipt，只保存 redacted disposition。
3. consumer 只有在它拥有的 snapshot/attempt/health/cleanup/handoff 更新成功时才完成 receipt；receipt 保存失败不得 complete idempotency。
4. publisher/handoff 失败只更新自己的 marker/report，不回滚已经提交的 Host Truth，不重建 payload。
5. unknown/late/conflict 必须保留原 `ExternalEffectKey`、`PublicationKey` 或 `HandoffKey`；不得换 key 掩盖可能已发生的不可逆副作用。
6. projection/history/material/reconciliation 不得反写 CMP-MS-01~06 source truth；Query 永不写修复。
7. `HostChangeCursor` 与 `CommittedChangeCursor` exact type 仍 pending；错误恢复不能用 page cursor、history id、broker offset、timestamp 或 CAS/version 替代。

## 12. 禁止模式与反例

| 禁止模式 | 违反原因 |
|---|---|
| catch-all 后返回 accepted | 隐藏失败，破坏 truth/result/outbox 原子性 |
| timeout 即成功/失败 | timeout 不能证明 external effect 状态 |
| 以 adapter error text 选择 retry/dead-letter | 文本不是稳定协议 |
| publisher 回查 current truth 组 payload | 破坏 immutable snapshot 与重放确定性 |
| duplicate 请求重新执行 domain | 破坏幂等与审计链 |
| unknown effect 换新 key | 可能产生双重不可逆动作 |
| Query 内 refresh/repair | 违反 query no-write |
| Job trigger 直接创建 decision/recovery | scheduler 不是 actor/授权 owner |
| raw body/secret 写 issue、receipt、log | 越过安全边界 |

## 13. 前序回填与跨 Step 审计

| 审计项 | 结果 |
|---|---|
| Domain error 与 Step 10 状态迁移一致 | pass |
| Application error 覆盖 Step 7 Port/UoW/idempotency failure | pass_with_upstream_blockers |
| Command/Query/Consumer/Job surface 与 Step 8 一致 | pass_with_upstream_blockers |
| rollback、stored result、payload snapshot 与 Step 11 一致 | pass |
| Query no-write、Consumer safe ceiling、Job no-authorization | pass |
| unknown/late/generation/effect key 保护 | pass_with_upstream_blockers |
| `MSVC-UP-001~008` | pending / blocked / fail-closed |
| 正式 `03-详细设计.md` | forbidden until Step 19 |

## 14. 回填草稿

正式 `03` 第 11 章只装配：错误分层、稳定结果面、retryable/reject/blocked/hold/manual 分类、Command/Query/Consumer/Publisher/Job 异常表、unknown-effect 和 no-write 红线。具体错误类型、触发条件、恢复责任和回填审计以本文件为唯一详细设计讨论入口；不写传输数字码、DLQ 名称、部署阈值或测试结果。

## 15. Step 13 handoff 与停审条件

```text
step_12_status = completed
step_12_gate = pass_with_upstream_blockers
next_allowed_step = Step 13 concurrency_idempotency
formal_03_write_allowed = false_until_step_19
```

完成条件：错误层级、映射面、事务副作用、恢复 owner、unknown/late/gap、query no-write 和 blocker 上限均已写明。下一步进入并发、幂等与重入保护，不改变本步的错误类别或上游 pending 状态。
