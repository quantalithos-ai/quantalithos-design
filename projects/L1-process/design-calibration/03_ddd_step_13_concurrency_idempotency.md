# L1-process 03 DDD Step 13 并发、幂等与重入保护

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/详细设计书写规范.md` §5.12
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md` §5.2-5.3
> 上游输入: `projects/L1-process/01-架构设计.md` §8;`projects/L1-process/02-概要设计.md` §10
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_09_function_flows.md`
> - `projects/L1-process/design-calibration/03_ddd_step_10_state_matrix.md`
> - `projects/L1-process/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
> - `projects/L1-process/design-calibration/03_ddd_step_12_error_recovery.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 trait / port 契约 | repository `Versioned<T>`、`StorageVersion`、idempotency repository、operation result store | mutable truth 使用 optimistic version;duplicate replay 使用 `OperationResultRepository` |
| Step 8 protocol 契约 | command metadata、event metadata、job metadata、public operation kind | 本步回填 `ProcessCommandKind`、`ProcessInboundEventKind`、`ProcessIdempotencyOperation`、key / digest value object schema |
| Step 9 function flows | command / consumer / job 通用路径和异常分支 | reserve 必须带 operation kind、key、digest,并在 UoW 内完成 result save + idempotency complete |
| Step 10 state matrix | 非法转换和技术状态迁移 | version conflict / duplicate / retry 不得绕过状态矩阵 |
| Step 11 persistence | idempotency store、operation result store、technical store 事务 | `idempotency_records` 唯一键为 `operation_kind + key`;`request_digest` 入索引字段 |
| Step 12 error recovery | conflict、result missing、commit unknown 的错误映射 | duplicate missing 不重算;commit unknown 通过同 key retry 恢复 |

---

## 3. SOP 问题回答

1. 哪些处理流可能并发修改同一资源?

   回答:所有 command 写路径会并发修改 mutable truth,包括 profile、instance、activity、token、gateway、waiting gate、checkpoint、recovery attempt、stage、timebox binding。consumer / job 会并发修改 snapshot / reference / projection / outbox / handoff / recovery maintenance marker。query 不写入,不参与写并发。

2. 哪些接口、事件或 job 可能被重复调用?

   回答:所有 13 个 Command、7 个 Inbound Event consumer 和 7 个 Operations Job 都可能重复。Command 使用 `CommandMetadata.idempotency_key`;Event 使用 `EventMetadata.dedup_key`;Job 使用 `JobMetadata.job_idempotency_key`。Query 无幂等键,只用 `QueryMetadata.request_ref` 做审计关联。

3. 幂等键来自请求、事件、job 参数还是数据库唯一约束?

   回答:Command key 来自 request metadata;Event key 来自 envelope metadata;Job key 来自 job metadata。repository 持久化使用 `ProcessIdempotencyOperation + key` 唯一约束保护,不是单独依赖原始 key。不同 operation 可以复用同一 raw key,不会互相判 duplicate。

4. 重复请求应该返回既有结果、跳过、覆盖还是报错?

   回答:same operation + same key + same digest 且 completed 时返回 stored result / receipt。same operation + same key + different digest 返回 conflict。result store 缺失返回 Step 12 的 result missing 映射,不得重算。in-flight / commit unknown 由同 key retry 重新读取 reservation / result store,不得重放 domain transition。

5. 并发冲突如何测试?

   回答:每个 mutable truth 重点 command 至少覆盖 stale `ExpectedVersion` / loaded `StorageVersion` conflict。幂等至少覆盖 same key same digest duplicate、same key different digest conflict、result missing、operation namespace 隔离和 commit unknown retry。job 至少覆盖 duplicate job 不重算 counters、per-item conflict 不 rollback 已成功 item。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 7 | `reserve_*` 有 key / digest,但没有显式 operation namespace | 已回填 `ProcessCommandKind`、`ProcessInboundEventKind`、`ProcessJobKind` 入 `reserve_*` 签名 |
| Step 8 | `IdempotencyKey`、`EventDedupKey`、`JobIdempotencyKey`、`RequestDigest`、`EventDigest`、`JobDigest` 被引用但 schema 未展开 | 已回填 value object schema 和归属 |
| Step 8 / Step 13 待确认 | digest 计算字段集合未固定 | 本 Step 定义 canonical input / volatile metadata 排除规则 |
| Step 11 | storage 表写了 operation-specific key,但 port 没有 operation 参数 | Step 7/11 已同步 |
| Step 12 | result missing 已定义,但 commit unknown 重入保护需展开 | 本 Step 明确 same key retry 读取 reservation / result store |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| idempotency 唯一键 | A. raw key 全局唯一;B. operation + raw key 唯一 | 采用 B。允许不同 command / event / job 使用同一 caller key,但不得互判 duplicate |
| digest 算法 | A. adapter 自行实现;B. v1 canonical-json SHA-256 profile | 采用 B。只固定字段和稳定编码口径,具体 hashing 用标准库 / crate 实现 |
| duplicate result | A. 从 current truth 重算;B. 读取 stored result / receipt | 采用 B。符合 Step 11 / 12 |
| in-flight duplicate | A. 并发执行第二次;B. 返回 retryable conflict / temporarily unavailable | 采用 B。不得两个 UoW 同时推进同 operation key |
| job partial retry | A. 整个 job 全量 rollback;B. per-item transaction + duplicate job receipt | 采用 B。outbox / handoff / maintenance 可保留已成功 item |

---

## 6. 结构化中间产物

### 6.1 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| SyncRuntimeProcessShape 并发同步同 definition/version | `RuntimeProcessShape`;method snapshot | `find_by_definition_version` unique lookup + `StorageVersion` save | `RepositoryError::Conflict` -> `TemporarilyUnavailable` / duplicate if same key | 同 definition/version 两请求只生成一个 shape / outbox |
| AdoptProcessProfile 并发为同 project 激活 profile | `ProcessProfile` active-by-project unique;profile state | active profile unique constraint + optimistic save | conflict or `DomainRejected` | single active profile per project |
| UpdateProcessProfileTailoring 并发修改同 profile | `ProcessProfile`;`ProfileChangeRecord` | load `Versioned<ProcessProfile>` then save expected version | `RepositoryError::Conflict` | stale expected version rejected |
| StartProcessInstance 重复启动同 intent | `ProcessInstance`;initial activity / token | command idempotency + profile active check;generated instance id only after reserve | duplicate returns stored instance result | same key duplicate no second instance |
| AdvanceProcessActivity 并发推进同 activity / token | `Activity`;`Token`;`Gateway`;`ProcessInstance.current_activity_ref` | `expected_position_ref` + loaded versions for activity/token/gateway/instance | `DomainRejected` or `RepositoryError::Conflict` | competing transitions single-winner |
| RecordActivityFeedback 并发绑定同 activity feedback | `Activity.feedback_ref`;runtime feedback marker | activity expected version + feedback ref match policy | conflict / `ReferenceResolutionFailed` | second different feedback rejected |
| OpenWaitingGate 并发暂停同 activity / instance | `WaitingGate`;`ProcessInstance`;`Token`;`PauseContext` | instance / token expected versions + active open gate lookup | conflict / `InvalidStateTransition` | only one open waiting gate per activity where policy requires |
| ResumeWaitingGate 并发恢复同 gate | `WaitingGate`;`ProcessInstance`;`Token` | gate expected version + state matrix | conflict / `InvalidStateTransition` | duplicate resume returns stored result;different key second resume rejected |
| CreateProcessCheckpoint 并发创建 checkpoint | `ProcessCheckpoint`;possibly previous checkpoint | checkpoint repository version / latest save;supersede uses loaded version | conflict | latest checkpoint supersede single-winner |
| StartRecoveryAttempt 并发启动 recovery | `RecoveryAttempt`;`ProcessInstance` | recovery continuity policy + instance expected version | `RecoveryForkViolation` / conflict | no second active recovery attempt |
| CompleteRecoveryAttempt 并发完成 same attempt | `RecoveryAttempt`;`ProcessInstance` | attempt expected version + state matrix | conflict / `InvalidStateTransition` | applied vs failed single-winner |
| BindProcessTimebox 并发绑定 same external timebox | `ProcessTimeboxBinding` | active binding unique + expected version | conflict / `ReferenceResolutionFailed` | no duplicate active binding |
| UpdateProcessStageState 并发修改 stage | `ProcessStageState` | stage expected version + state matrix | conflict / `InvalidStateTransition` | stale stage update rejected |
| Consumer duplicate same event | snapshot / reference marker / receipt | `reserve_event(ProcessInboundEventKind, dedup_key, event_digest, ...)` | duplicate loads stored `ConsumerReceipt` | duplicate writes no new marker |
| Consumer source update races command read | snapshot / reference / projection stale marker | command checks snapshot state;consumer writes stale marker in UoW | command `ReferenceResolutionFailed` or query degraded | stale snapshot blocks command when policy requires fresh |
| Publish job parallel records | `ProcessOutboxRecord.publication_state` | list page + per-record `StorageVersion` save | conflict -> skipped / partial | parallel publishers do not double publish marker |
| Projection rebuild concurrent with query | projections / `DerivedProcessViewState` | job writes projection state;query read-only, exposes stale / rebuilding / failed | query degraded / unavailable | query no-write digest unchanged |
| Refresh job concurrent with consumer | external snapshot / reference state | snapshot repository upsert with version / unique external ref | conflict -> partial / retry item | no external body;latest state deterministic |
| Handoff job parallel delivery | `TraceHandoffRef` | handoff ref unique + expected version;external delivery idempotent by handoff ref | conflict / partial | no duplicate observability / archive body |
| Recovery maintenance concurrent with command recovery | `RecoveryAttempt`;`ProcessInstance` | per-attempt expected version;command transition wins by version | conflict / partial | maintenance does not overwrite command completion |
| Reconciliation concurrent with truth changes | `ReconciliationReport` only | report records cursor / scope;does not write truth | report partial / stale issue | no repair side effect |

### 6.2 幂等 value object 与 digest 规则

| 类型 | 归属 | 字段 | 规则 |
|---|---|---|---|
| `ProcessCommandKind` | `contracts/src/commands.rs` | 13 个 command variants | command idempotency operation namespace |
| `ProcessInboundEventKind` | `contracts/src/events.rs` | 7 个 inbound event variants | event dedup operation namespace |
| `ProcessJobKind` | `contracts/src/jobs.rs` | 7 个 job variants | job idempotency operation namespace |
| `ProcessIdempotencyOperation` | `contracts/src/refs.rs` | `Command(ProcessCommandKind)` / `InboundEvent(ProcessInboundEventKind)` / `Job(ProcessJobKind)` | idempotency store operation discriminator |
| `IdempotencyKey` | `contracts/src/refs.rs` | `value: String` | command caller supplied;non-empty;not `request_ref` |
| `EventDedupKey` | `contracts/src/refs.rs` | `value: String` | source supplied;non-empty;not transport offset |
| `JobIdempotencyKey` | `contracts/src/refs.rs` | `value: String` | scheduler / operator supplied;non-empty;not `job_run_ref` |
| `RequestDigest` | `contracts/src/refs.rs` | `algorithm_version`;`digest_value` | canonical command input digest |
| `EventDigest` | `contracts/src/refs.rs` | `algorithm_version`;`digest_value` | canonical inbound envelope + payload digest |
| `JobDigest` | `contracts/src/refs.rs` | `algorithm_version`;`digest_value` | canonical job input digest |
| `DigestAlgorithmVersion` | `contracts/src/refs.rs` | `value: u16` | v1 = canonical JSON + SHA-256 profile |
| `DigestValue` | `contracts/src/refs.rs` | `value: String` | lowercase hex digest |

Canonical digest v1 rules:

- Use deterministic field ordering and stable enum variant names.
- Include `ProcessIdempotencyOperation` in every digest.
- Exclude volatile metadata: `request_ref`, `event_envelope_ref`, `job_run_ref`, `trace_context`, `requested_at`, transport retry counter and adapter delivery attempt count.
- Include security / authority fields that affect semantics: `actor_context.actor_ref`, `actor_context.authority_kind`, `actor_context.member_ref`, source actor / source ref for events, and all typed payload fields.
- Include command `metadata.expected_version` exactly when the Step 8 command expected-version matrix allows or requires it;for forbidden commands it must already be rejected before digest calculation.
- Include optional digest / source version fields exactly as present;`None` and missing are equivalent only after DTO validation normalizes them.
- Hash only ref / summary / digest fields allowed by Process boundary;never hash or store forbidden source body.

### 6.3 幂等键表

| 接口 / Job / Event | Operation | 幂等键 | Digest stable input | 幂等窗口 | 重复请求处理 |
|---|---|---|---|---|---|
| `SyncRuntimeProcessShape` | `Command(SyncRuntimeProcessShape)` | `metadata.idempotency_key` | actor context、definition ref/version、sync intent、source digest、expected version | idempotency retention config;Step 14 defines duration | same digest returns `RuntimeProcessShapeCommandResult`;different digest conflict |
| `AdoptProcessProfile` | `Command(AdoptProcessProfile)` | `metadata.idempotency_key` | actor context、project ref、work context ref、shape ref、tailoring intent、expected version | same | stored `ProcessProfileCommandResult` |
| `UpdateProcessProfileTailoring` | `Command(UpdateProcessProfileTailoring)` | `metadata.idempotency_key` | actor context、profile ref、next shape ref、tailoring change ref、change reason、expected version | same | stored `ProcessProfileCommandResult` |
| `StartProcessInstance` | `Command(StartProcessInstance)` | `metadata.idempotency_key` | actor context、profile ref、work context ref、start intent、expected version | same | stored `ProcessInstanceCommandResult`;no second instance |
| `AdvanceProcessActivity` | `Command(AdvanceProcessActivity)` | `metadata.idempotency_key` | actor context、process instance ref、activity ref、canonical `ActivityProgressionIntentRef`、expected position ref、expected version | same | stored `ActivityProgressionCommandResult`;different transition conflict |
| `RecordActivityFeedback` | `Command(RecordActivityFeedback)` | `metadata.idempotency_key` | actor context、activity ref、runtime feedback ref、feedback summary ref、expected version | same | stored `ActivityProgressionCommandResult` |
| `OpenWaitingGate` | `Command(OpenWaitingGate)` | `metadata.idempotency_key` | actor context、process instance ref、activity ref、pause reason、resume requirement ref、expected version | same | stored `WaitingGateCommandResult` |
| `ResumeWaitingGate` | `Command(ResumeWaitingGate)` | `metadata.idempotency_key` | actor context、waiting gate ref、resume reason、decision ref、expected version | same | stored `WaitingGateCommandResult` |
| `CreateProcessCheckpoint` | `Command(CreateProcessCheckpoint)` | `metadata.idempotency_key` | actor context、process instance ref、activity ref、checkpoint reason、evidence ref、expected version | same | stored `ProcessCheckpointCommandResult` |
| `StartRecoveryAttempt` | `Command(StartRecoveryAttempt)` | `metadata.idempotency_key` | actor context、checkpoint ref、recovery reason、expected version | same | stored `RecoveryAttemptCommandResult` |
| `CompleteRecoveryAttempt` | `Command(CompleteRecoveryAttempt)` | `metadata.idempotency_key` | actor context、recovery attempt ref、outcome、failure reason、abandon reason、expected version | same | stored `RecoveryAttemptCommandResult` |
| `BindProcessTimebox` | `Command(BindProcessTimebox)` | `metadata.idempotency_key` | actor context、process subject ref、process timebox ref、external timebox ref、rhythm reason、expected version | same | stored `ProcessTimingCommandResult` |
| `UpdateProcessStageState` | `Command(UpdateProcessStageState)` | `metadata.idempotency_key` | actor context、stage ref、stage target、stage change reason、expected version | same | stored `ProcessTimingCommandResult` |
| `MethodDefinitionChangedEvent` | `InboundEvent(MethodDefinitionChanged)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、definition ref/version/kind、source digest | consumer retention config;Step 14 defines duration | stored `ConsumerReceipt` with duplicate disposition |
| `WorkContextChangedEvent` | `InboundEvent(WorkContextChanged)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、work context/project/iteration/timebox/source version | same | stored `ConsumerReceipt` |
| `IdentityActorCapabilityChangedEvent` | `InboundEvent(IdentityActorCapabilityChanged)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、actor/member/capability refs/source version | same | stored `ConsumerReceipt` |
| `GovernanceDecisionChangedEvent` | `InboundEvent(GovernanceDecisionChanged)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、decision ref/kind、resume requirement、source digest | same | stored `ConsumerReceipt` |
| `ArtifactEvidenceChangedEvent` | `InboundEvent(ArtifactEvidenceChanged)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、evidence ref/kind/checkpoint ref/source digest | same | stored `ConsumerReceipt` |
| `RuntimeActivityFeedbackEvent` | `InboundEvent(RuntimeActivityFeedback)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、activity ref、feedback refs/kind/source digest | same | stored `ConsumerReceipt` |
| `ConversationContextChangedEvent` | `InboundEvent(ConversationContextChanged)` | `metadata.dedup_key` | source event id、source ref、source actor、schema version、conversation/context refs and source version / digest fields | same | stored `ConsumerReceipt` |
| `PublishProcessOutboxJob` | `Job(PublishProcessOutbox)` | `metadata.job_idempotency_key` | actor context、scope、max retry count | job retention config;Step 14 defines duration | stored `JobRunReceipt`;does not republish |
| `RebuildProcessProjectionsJob` | `Job(RebuildProcessProjections)` | `metadata.job_idempotency_key` | actor context、scope、projection kinds、from cursor | same | stored `JobRunReceipt`;does not rebuild again |
| `RefreshExternalContextSnapshotsJob` | `Job(RefreshExternalContextSnapshots)` | `metadata.job_idempotency_key` | actor context、scope、max snapshot age | same | stored `JobRunReceipt` |
| `RunProcessReconciliationJob` | `Job(RunProcessReconciliation)` | `metadata.job_idempotency_key` | actor context、scope ref、cursor ref、report target ref | same | stored `JobRunReceipt`;report not regenerated |
| `PrepareProcessTraceHandoffJob` | `Job(PrepareProcessTraceHandoff)` | `metadata.job_idempotency_key` | actor context、scope、target ref | same | stored `JobRunReceipt`;handoff not redelivered |
| `PrepareProcessArchiveHandoffJob` | `Job(PrepareProcessArchiveHandoff)` | `metadata.job_idempotency_key` | actor context、scope、target ref | same | stored `JobRunReceipt`;archive package not regenerated |
| `MaintainRecoveryAttemptsJob` | `Job(MaintainRecoveryAttempts)` | `metadata.job_idempotency_key` | actor context、scope、retry policy ref、expiry policy ref | same | stored `JobRunReceipt`;counters not recomputed |

### 6.4 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command same key retry after timeout | client retry / API timeout | reserve same operation key before domain transition | completed -> stored result;reserved/in-flight -> `TemporarilyUnavailable`;conflict -> `IdempotencyConflict` |
| Command commit unknown | UoW commit returned unknown / connection drop | retry same operation + key + digest;inspect idempotency completion and operation result | if completed return stored result;if missing result return `IdempotencyResultMissing`;never re-run domain blindly |
| Command result save failure | operation result store error before complete | same UoW rollback | retry sees no completed idempotency;domain may run once after clean reservation |
| Same raw idempotency key across different commands | caller key reuse | `ProcessIdempotencyOperation` scopes uniqueness | not duplicate;each operation independently reserves |
| Same command key different payload | client bug / replay drift | request digest mismatch | `IdempotencyConflict`;no truth write |
| Consumer event redelivery | event bus at-least-once delivery | `reserve_event(event_kind, dedup_key, event_digest, ...)` | duplicate returns stored receipt;delayed can be redelivered |
| Consumer same dedup key different payload | source bug / schema drift | event digest mismatch | conflict/quarantine;no snapshot overwrite |
| Consumer source unavailable then redelivery | resolver temporary failure | delayed receipt + stored result only when completed per policy | redelivery with same digest may return delayed receipt or retry after retention policy in Step 14 |
| Job retry after scheduler timeout | scheduler rerun same job key | `reserve_job(job_kind, key, job_digest, ...)` | completed -> stored receipt;in-flight -> delayed/dependency unavailable |
| Job same key different scope | operator mistake | job digest mismatch | `JobError::IdempotencyConflict`;no item loop |
| Job partial failure rerun intentionally | operator wants new run | must use new `JobIdempotencyKey` | new run scans current state;old duplicate key returns old counters |
| Publish job per-record retry | publisher retryable failure | outbox state `RetryPending` + record version | later job with new key republishes pending record;same job key returns old receipt |
| Handoff delivery retry | retryable handoff failure | handoff ref identity + state + target ref | retry job reloads marker;does not store body or duplicate delivered marker |
| Projection rebuild reentry | previous rebuild failed or stale | `DerivedProcessViewState` state + source cursor | new job key can rebuild;query still no-write |
| Recovery maintenance reentry | partial maintenance job | per-attempt expected version | new job key skips already terminal attempts;does not fork recovery |

### 6.5 Repository / UoW ordering rules

```text
validate request / envelope / job
begin UnitOfWork
compute ProcessIdempotencyOperation + key + digest
reserve_* within the UoW
if duplicate: rollback read transaction if needed, load stored result outside business transition, return
if conflict: rollback, return mapped conflict
execute domain / resolver / repository writes
save StoredProcessOperationResult
complete idempotency with ApplicationResultRef
commit UnitOfWork
```

Rules:

- `save_result(...)` must happen before `IdempotencyRepository::complete(...)` in the same UoW.
- `complete(...)` must not be visible without the corresponding `operation_results` row.
- duplicate replay must not call resolver, domain object methods, publisher, handoff adapter or projection builder.
- mutable repository save must use the loaded `StorageVersion`;public `ExpectedVersion` can be an additional command guard,not a replacement for repository optimistic save.
- append-only trace / history / outbox writes are protected by source truth transaction,not by overwriting prior rows.

### 6.6 In-flight 与保留窗口规则

| 规则 | 口径 |
|---|---|
| Reserved but not completed | Treat as in-flight / unknown;do not execute second operation concurrently |
| Completed with same digest | Return stored result / receipt |
| Completed with different digest | Conflict |
| Completed but result missing | Step 12 result missing mapping;manual repair |
| Conflicted record | Preserve conflict marker;same key requires new caller key or original request |
| Retention duration | Configured in Step 14;Step 13 only requires retention long enough to cover retry / redelivery / job rerun windows |
| Expired idempotency record | Operations cleanup must not remove records referenced by unreconciled operation result / audit evidence |

### 6.7 测试切口表

| 测试切口 | 覆盖点 |
|---|---|
| command duplicate same key / same digest | returns stored result;no new truth / trace / outbox |
| command same key / different digest | `IdempotencyConflict`;no domain call |
| command operation namespace isolation | same raw key on two command kinds does not cross-replay result |
| command stale expected version | repository conflict or domain rejected;no partial writes |
| command commit unknown retry | retry same key returns completed result or result missing,not duplicate truth |
| consumer duplicate event | stored `ConsumerReceipt`;no new snapshot / marker |
| consumer dedup digest mismatch | quarantine / conflict;no overwrite resolved snapshot |
| job duplicate | stored `JobRunReceipt`;counters not recomputed |
| job same key different scope | `JobError::IdempotencyConflict` |
| publish parallel workers | one state transition per outbox record version |
| projection query no-write | query stale / failed surface leaves repository write digest unchanged |
| handoff retry | retryable failed marker can be retried by new job key;delivered marker not duplicated |
| recovery maintenance partial rerun | already terminal attempt skipped by state/version;no fork |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
>
> 延伸阅读:
> - Step 7 `IdempotencyRepository` / `OperationResultRepository`
> - Step 8 metadata、operation kind、key / digest schema
> - Step 11 UoW ordering
> - Step 12 error recovery

`03-详细设计.md` §12 必须写入本 Step 的并发场景表、幂等键表和重入保护表。正式幂等唯一口径为 `ProcessIdempotencyOperation + key + digest`:same operation + same key + same digest 返回 stored result / receipt;same operation + same key + different digest 返回 conflict;different operation 即使 raw key 相同也不得互相 duplicate。digest v1 使用 deterministic canonical input,排除 volatile metadata,包含会影响语义的 actor / authority / source / expected version / typed payload 字段。duplicate path 不得调用 domain、resolver、publisher、handoff 或 projection builder。

---

## 8. 待确认事项

- 无阻塞 Step 14 的待确认事项。
- Step 14 必须给出 idempotency / event dedup / job retention duration、cleanup config、retry backoff、publisher / handoff destination 等配置绑定。
- Step 15 必须定义 conflict、duplicate、result missing、commit unknown 和 partial job 的 observability / audit fields。
- Step 16 必须把 §6.7 的测试切口落到最小验证清单。

---

## 9. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 幂等 key 可从协议字段计算 | 通过 | Command / Event / Job 均有 metadata key |
| digest 字段集合明确 | 通过 | 见 §6.2 / §6.3 |
| operation namespace 明确 | 通过 | `ProcessIdempotencyOperation` |
| duplicate result 读取闭环 | 通过 | `OperationResultRepository` |
| 并发冲突策略明确 | 通过 | optimistic version + unique constraint |
| 重入和 commit unknown 恢复明确 | 通过 | same key retry reads idempotency / result store |
