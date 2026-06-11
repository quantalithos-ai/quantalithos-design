# Step 12. 错误模型、异常分支与恢复口径

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 错误模型、异常分支与恢复口径 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~11 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md` |
| 停审方式 | 按错误层级、对外映射、异常分支、恢复口径、审计/事件规则分批写入;全部完成后做跨 Step 8~11 闭环审计 |

## 2. 本步目标

本 Step 把 Step 6 的 domain validation / transition failure、Step 7 的 repository / resolver / publisher / handoff / UnitOfWork / idempotency error、Step 8 的 protocol rejection / query surface / consumer receipt / job result、Step 9 的异常分支、Step 10 的非法转换和 Step 11 的一致性失败收束成可实现的错误模型。

实现侧必须能从本 Step 判断:

- 错误属于 domain、application、port、API、worker 还是 job。
- 错误是否可重试、不可重试或必须人工介入。
- 同步 command/query 如何映射到 protocol response。
- inbound event 如何映射为 `Accepted` / `Duplicate` / `Delayed` / `Rejected` / `UnsupportedVersion` 等 worker surface。
- operations job 如何映射为 `Completed` / `PartiallyCompleted` / `Failed` / `DuplicateReplayed` / `Rejected`。
- 失败时是否写 trace、audit、outbox、projection state、reference state、handoff marker、stored result 或 job report。

本步不定义具体 HTTP status code 数字、RPC code 数字、transport retry 参数、dead-letter queue 名称、日志格式、告警系统、错误文本本地化或实施 commit boundary。这些由 API adapter、worker runtime、Step 13、Step 14 和 Step 15 继续细化。

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 domain factory / transition validation、state enum、reason/ref 字段和 body-free boundary |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 `ApplicationError`、repository / resolver / publisher / handoff / UoW / idempotency port 失败边界 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 protocol rejection、query response surface、consumer receipt、worker disposition、job request/response/report |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / publisher / job / handoff flow 的错误分支和 rollback 点 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供非法状态迁移、terminal state、retry/dead-letter/failed/unavailable/not-visible disposition |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 optimistic conflict、UoW failure、payload snapshot missing、projection/reference/handoff recovery 场景 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已检查 | 检查错误映射、version、stored result、outbox snapshot、sidecar truth 和 query no-write 闭环 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 12.1 | 文件骨架、SOP 问题回答、错误层级、错误类型表 | [x] 已写入 |
| 12.2 | 内部错误到 Command / Query / Event / Job / Worker 映射表 | [x] 已写入 |
| 12.3 | 异常分支处理表、恢复口径表、审计 / outbox / marker 写入规则 | [x] 已写入 |
| 12.4 | 前序契约回填、跨 Step 8~11 闭环审计、进入 Step 13 条件 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个模块有哪些错误类型? | `domain` 返回 `DomainError` / policy rejection;`application` 统一映射为 `ApplicationError`;repository / resolver / publisher / handoff / UnitOfWork / idempotency 属于 application port failure;`api` 输出 protocol rejection 或 query surface;`worker` 输出 item disposition / receipt;`jobs` 输出 job run disposition、job error 或 stored `GovernanceJobReport`。 |
| 哪些错误映射到 HTTP / RPC / Event 失败? | Command request validation、authorization、not found、domain rejected、version conflict、idempotency conflict、dependency unavailable 映射到 protocol rejection。Query visibility denied 不映射为普通 error,而是 not-visible query surface。Inbound event envelope invalid / unsupported version / forbidden body 映射为 worker rejected/unsupported receipt。Job input invalid 映射为 rejected run,job item failure 进入 `GovernanceJobReport`。 |
| 哪些错误可重试,哪些不可重试,哪些需要人工介入? | Repository / resolver / publisher / handoff temporary unavailable、version conflict、worker delayed、job dependency unavailable 可重试。Invalid request、forbidden body、unsupported version、domain rejected、idempotency conflict、not visible 不可原样重试。Completed idempotency missing stored result、commit status unknown、payload snapshot missing、projection dependency index corrupted、permanent publish/handoff failure、reconciliation drift 需要人工或运维介入。 |
| 事务失败、并发冲突、重复请求、外部依赖失败如何处理? | 事务内失败 rollback,不得写 accepted truth / outbox / trace / stale success side effect。Version conflict rollback 并返回 conflict/retryable surface。Duplicate same digest 读取 stored result / receipt / report;different digest 返回 conflict。外部依赖 temporary failure 在 command 中返回 temporarily unavailable,在 consumer/job 中写 delayed/failed item或 retryable marker;不得补造 external truth。 |
| 哪些异常需要写审计、日志或事件? | 只有 accepted truth change、accepted consumer marker trace、outbox publication state、projection/reference state、handoff/export marker、reconciliation report、stored result/job report 按对应 flow 写入。Rejected command、invalid request、not visible query、unsupported event version 不写 success trace/outbox。运行日志和 redacted issue ref 由 Step 15 细化。 |

## 6. 错误设计原则

| 原则 | 正式口径 |
|---|---|
| 分层映射 | domain/port/internal error 不直接穿透到 public protocol;必须由 application/handler 映射 |
| Query no-write | query 的 missing/stale/not-visible/degraded/unavailable 只能返回 surface,不得写修复副作用 |
| Accepted 才写 success trace/outbox | rejected / invalid / duplicate / not-visible path 不创建新的 accepted trace/outbox |
| Duplicate replay | same key + same digest 只读取 stored result/receipt/report,不得重新执行 mutation/job/publish |
| External body boundary | 发现 forbidden body 时必须 reject/quarantine,不得降级保存 body |
| Recovery 不反写真相 | projection/reference/outbox/handoff/reconciliation failure 不回滚或修改 core Governance truth |
| Missing sidecar 是一致性错误 | completed idempotency result missing、payload snapshot missing、marker trace missing 等不得由 current truth 临时重建 |
| Retry 与人工介入分开 | retryable dependency failure 可自动重试;schema/design/storage consistency defect 必须人工或运维介入 |

## 7. 错误层级

```text
domain factory / domain transition / policy guard
  -> DomainError

application service orchestration
  -> ApplicationError

repository / resolver / publisher / handoff / UoW / idempotency port
  -> mapped into ApplicationError or item-level failure

api handler
  -> GovernanceProtocolRejection or GovernanceQueryResponse<T> surface

worker handler
  -> GovernanceWorkerDisposition + GovernanceInboundEventReceipt

jobs runner
  -> GovernanceJobRunDisposition / GovernanceJobError / GovernanceJobReport
```

| Layer | May see | Must not expose directly |
|---|---|---|
| `domain` | value objects、state、policy inputs | repository error、protocol error、transport status、adapter error |
| `application` | domain error、repository/port/UoW/idempotency error、protocol DTO | raw storage exception、raw adapter body、HTTP status |
| `api` | application result/rejection/query surface | domain enum internals、repository type names、raw issue body |
| `worker` | application consumer receipt/publish result | raw event body after unsupported version,raw upstream body |
| `jobs` | application job report/run result | repository internals、archive/GRC/observability package body |
| `infra` | adapter/runtime exceptions | Governance truth mutation outside application service |

## 8. 错误类型表

### 8.1 Domain errors

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `DomainError::InvalidStateTransition` | `domain` | 状态迁移不在 Step 10 矩阵内;terminal state 再迁移;forbidden transition | 否 | Command `DomainRejected`;consumer rejected/quarantined;job item failed |
| `DomainError::MissingRequiredValue` | `domain` | factory / transition 需要的 reason、basis、actor、evidence、target、trace_refs 等为空 | 否 | `InvalidRequest` or `DomainRejected` by caller stage |
| `DomainError::PolicyRejected` | `domain::policy` | context/gate/decision/approval/policy/control/compliance/nonconformity/corrective guard 不满足 | 否,除非外部状态后续变化 | Command `DomainRejected`;query degraded only when read surface |
| `DomainError::ExternalBodyRejected` | `domain::policy` | external process/work/artifact/method/runtime/observability/archive/GRC body 进入本仓 truth/snapshot/event/report | 否 | Command `DomainRejected`;consumer `Rejected`;job `Rejected` or failed item |
| `DomainError::ReferenceNotResolved` | `domain::policy` | required reference state is unresolved/stale/unavailable/invalid and current command needs resolved reference | stale/unavailable 可在 refresh 后重试;invalid 不可原样重试 | `DependencyUnavailable` / `ExternalReferenceUnresolved` / command rejected |
| `DomainError::InvariantViolation` | `domain` | object 字段组合不可能成立,例如 finalized decision 无 basis/reason、closed nonconformity 无 passed verification | 否,需设计/数据修复 | internal consistency failure / job failed;must alert |
| `DomainError::ProjectionMutationRejected` | `domain::projection` | query/reconciliation/job 试图把 projection/report 反写 core truth | 否 | job rejected/failed;internal consistency defect |
| `DomainError::HandoffMarkerRejected` | `domain::audit` | `GovernanceHandoffMarker` trace_refs empty、target missing、package/receipt/failure field 与 state 不匹配 | 否,除非 caller 修正 input | job rejected or failed marker not saved |

### 8.2 Application errors

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ApplicationError::InvalidRequest` | `application` | protocol metadata/body/page/scope/idempotency key required field missing or route/body mismatch | 否 | `GovernanceProtocolRejection::InvalidRequest` / job `Rejected` |
| `ApplicationError::NotFound` | `application` | requested Governance-owned truth/report/trace/view does not exist | 通常否;projection/report async missing may later appear | command `NotFound`;query `Missing/Unavailable`;job failed item |
| `ApplicationError::NotVisible` | `application::visibility` | read actor lacks visibility or target must be hidden | 否 | query not-visible surface;command authorization rejection |
| `ApplicationError::DomainRejected` | `application` | mapped from `DomainError` / policy guard | 否 | protocol domain rejected / worker rejected / job failed item |
| `ApplicationError::VersionConflict` | `application` | optimistic version mismatch | 是,after reload/retry | protocol conflict/retryable;worker delayed;job item conflict |
| `ApplicationError::IdempotencyConflict` | `application` | same operation + same key + different digest | 否,caller must use new key or original request | protocol conflict;worker rejected;job rejected |
| `ApplicationError::DuplicateResultMissing` | `application` | idempotency completed but stored result/receipt/report missing or wrong kind | 否,人工介入 | protocol degraded/temporarily unavailable;job dependency failure |
| `ApplicationError::DependencyUnavailable` | `application` | repository/source/resolver/publisher/handoff temporarily unavailable | 是 | temporarily unavailable / worker delayed / job partial-delayed |
| `ApplicationError::ExternalReferenceUnresolved` | `application` | resolver says external ref missing/rejected/invalid or required snapshot absent | depends on state | command dependency error;consumer failed marker;job failed ref |
| `ApplicationError::ConsistencyDefect` | `application` | payload snapshot missing,sidecar truth missing,projection index corrupted,stored result missing,commit unknown | 否,人工介入 | internal consistency/degraded surface;job failed;alert |
| `ApplicationError::UnsupportedSchemaVersion` | `application` | inbound/outbound schema version not supported | 否 until upgraded | worker unsupported/dead-letter;publisher dead-letter |
| `ApplicationError::CommitStatusUnknown` | `application` | UoW commit returned unknown status after possible durable write | 不可盲重试;must idempotency-check | temporarily unavailable with unknown marker;reconciliation required |

### 8.3 Port / infrastructure errors

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `RepositoryError::NotFound` | application port | required row/view/report/snapshot missing | caller dependent | `NotFound` / query missing / job failed item |
| `RepositoryError::VersionConflict` | application port | expected_version mismatch | 是 after reload | `VersionConflict` |
| `RepositoryError::UniqueConflict` | application port | create violates formal unique key | usually no;duplicate path may replay | `DomainRejected` or idempotency duplicate depending source |
| `RepositoryError::StoreUnavailable` | application port | store temporarily unavailable | 是 | `DependencyUnavailable` / delayed |
| `RepositoryError::SerializationFailed` | application port | stored result/payload/report cannot serialize/deserialize | 否,人工介入 | `ConsistencyDefect` |
| `UnitOfWorkError::BeginFailed` | application port | cannot begin transaction | 是 | `DependencyUnavailable` |
| `UnitOfWorkError::CommitFailed` | application port | commit failed and durable status may be unknown | idempotency-check only | `CommitStatusUnknown` |
| `UnitOfWorkError::RollbackFailed` | application port | rollback failed or uncertain | 否,人工介入 | `ConsistencyDefect` |
| `IdempotencyError::AlreadyInProgress` | application port | same operation/key currently reserved but not completed | 是 later | delayed/temporarily unavailable |
| `IdempotencyError::Conflict` | application port | same key different digest | 否 | `IdempotencyConflict` |
| `IdempotencyError::ResultMissing` | application port | completed record points to missing result | 否 | `DuplicateResultMissing` |
| `ResolverError::NotFound` | external resolver | external reference does not exist | usually no | unresolved / failed ref |
| `ResolverError::Unavailable` | external resolver | external source temporary unavailable | 是 | delayed / dependency unavailable |
| `ResolverError::InvalidResponse` | external resolver | upstream payload violates body-free contract/schema | 否 until adapter/source fixed | rejected / failed item |
| `ResolverError::ForbiddenBody` | external resolver | resolver returns raw body forbidden by boundary | 否 | rejected / consistency defect |
| `PublisherError::Retryable` | publisher port | transport/topic temporary failure | 是 | outbox `Failed` retryable;job partial |
| `PublisherError::Permanent` | publisher port | topic/schema/authorization permanent failure | no until config fixed | outbox `DeadLettered`;job partial/manual |
| `PublisherError::PayloadInvalid` | publisher port | stored payload cannot be published by schema map | no until design/config fixed | outbox failed/dead-letter;alert |
| `HandoffError::TargetDisabled` | handoff/export port | configured target disabled/unavailable | retry after config | job rejected or failed marker |
| `HandoffError::Retryable` | handoff/export port | adapter temporary failure | 是 | failed marker with retryable reason;job partial |
| `HandoffError::Permanent` | handoff/export port | package/export cannot be accepted | no until target/config fixed | failed marker;manual |
| `RuntimeBuildError::InvalidConfig` | infra runtime | config refs invalid or required adapter missing | no until config fixed | runtime failed/rejected job/worker delayed |

### 8.4 Protocol / worker / job surface

| Surface | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `GovernanceProtocolRejection::InvalidRequest` | `contracts` / `api` | request/envelope/page/metadata invalid | 否 | HTTP/RPC invalid request equivalent |
| `GovernanceProtocolRejection::NotFound` | `contracts` / `api` | command target missing | 否 | not found equivalent |
| `GovernanceProtocolRejection::NotAuthorized` | `contracts` / `api` | command actor lacks authority | 否 | forbidden equivalent |
| `GovernanceProtocolRejection::DomainRejected` | `contracts` / `api` | domain/policy rejected | 否 unless state later changes | conflict/semantic rejection equivalent |
| `GovernanceProtocolRejection::VersionConflict` | `contracts` / `api` | optimistic conflict | 是 after reload | conflict/retryable |
| `GovernanceProtocolRejection::IdempotencyConflict` | `contracts` / `api` | same key different digest | 否 | conflict |
| `GovernanceProtocolRejection::DependencyUnavailable` | `contracts` / `api` | temporary dependency unavailable | 是 | temporarily unavailable |
| `GovernanceQuerySurface::NotVisible` | `contracts` / query | visibility denied | 否 | body empty/redacted with marker |
| `GovernanceQuerySurface::Degraded` | `contracts` / query | stale/unavailable reference/projection/report | retry later or run job | body optional,marker required |
| `GovernanceWorkerDisposition::Accepted` | worker | consumer/publisher item accepted | no retry | ack |
| `GovernanceWorkerDisposition::Duplicate` | worker | duplicate replay from stored receipt/result | no retry | ack duplicate |
| `GovernanceWorkerDisposition::Delayed` | worker | temporary dependency/source/backoff | retry | retry/delay |
| `GovernanceWorkerDisposition::Rejected` | worker | invalid envelope/body/digest conflict | no | dead-letter/quarantine |
| `GovernanceWorkerDisposition::UnsupportedVersion` | worker | event schema unsupported | no until upgraded | dead-letter unsupported |
| `GovernanceJobRunDisposition::Completed` | jobs | all requested work succeeded | no retry | success |
| `GovernanceJobRunDisposition::PartiallyCompleted` | jobs | at least one item failed and at least one succeeded or report has item failures | retry failed subset if supported | partial result |
| `GovernanceJobRunDisposition::Failed` | jobs | accepted job failed all or fatal dependency failure | retry/manual by failure class | failed result/report |
| `GovernanceJobRunDisposition::DuplicateReplayed` | jobs | duplicate job returned stored report | no retry | replayed success/partial/failed report |
| `GovernanceJobRunDisposition::Rejected` | jobs | metadata/input invalid before mutation | no | rejected |

## 9. 内部错误映射表

### 9.1 Command 映射

| 内部错误 / 场景 | Command protocol mapping | Transaction rule | Caller action |
|---|---|---|---|
| request envelope missing metadata / actor / idempotency key | `GovernanceProtocolRejection::InvalidRequest` | no UoW or rollback before reserve | fix request |
| request DTO missing required ref/reason/basis/target/page | `InvalidRequest` | no domain transition | fix request |
| actor not authorized for command scope | `NotAuthorized` | rollback/no UoW | use authorized actor/scope |
| target Governance truth missing | `NotFound` | rollback;no trace/outbox | reload refs |
| target external ref missing/unresolved and command requires it | `DependencyUnavailable` or `DomainRejected` by reference state | rollback;may save no marker unless command flow explicitly does | refresh/fix external ref |
| `DomainError::InvalidStateTransition` | `DomainRejected` | rollback;no success trace/outbox | reload state and issue valid command |
| policy guard rejects reason/evidence/decision/coverage/verification | `DomainRejected` | rollback | supply valid reason/evidence or wait for required state |
| forbidden external body detected | `DomainRejected` or `InvalidRequest` depending detection stage | rollback;no body persisted | send ref/summary/digest only |
| optimistic version conflict | `VersionConflict` | rollback | reload latest version and retry same operation if still valid |
| same idempotency key + same digest duplicate | normal command response replayed from stored result | current UoW rolled back;no new writes | accept replay |
| same idempotency key + different digest | `IdempotencyConflict` | no domain mutation;optional conflict marker by Step 13 | use original request or new key |
| idempotency completed but stored result missing | `DependencyUnavailable` with consistency issue marker or dedicated duplicate result missing surface | no mutation;do not reconstruct | operations repair result store |
| repository temporary unavailable before commit | `DependencyUnavailable` | rollback | retry same idempotency key |
| UoW begin failed | `DependencyUnavailable` | no mutation | retry later |
| UoW commit status unknown | `DependencyUnavailable` with unknown completion marker | do not run compensating writes | retry same key after idempotency/result lookup |
| stored result save failed | `DependencyUnavailable` | rollback before idempotency complete | retry same key |
| idempotency complete failed | `DependencyUnavailable` | rollback if possible | retry same key and inspect result |

### 9.2 Query 映射

| Internal condition | Query response mapping | Writes allowed | Caller action |
|---|---|---|---|
| request invalid: missing ref/page or mutually exclusive refs both set | `GovernanceProtocolRejection::InvalidRequest` | none | fix request |
| visibility denied | `GovernanceQueryResponse.surface.visibility.is_visible = false`, body empty/redacted | none | treat as hidden;do not infer existence |
| truth target missing | `body = None` with missing/degraded marker or `NotFound` by query contract | none | reload refs |
| projection missing but source truth may exist | degraded/unavailable marker;body empty or stale fallback by query contract | none | run/retry projection rebuild outside query |
| projection state `Stale` | body may be returned with freshness marker | none | display stale;optional operations rebuild |
| projection state `Rebuilding` | degraded/rebuilding marker | none | retry later |
| projection state `Failed` / `Unavailable` | degraded/unavailable marker | none | operations inspect failed view |
| reference state unresolved/stale/unavailable | degraded marker with body-free reference marker | none | refresh references |
| report missing | missing/degraded marker | none | run report job if appropriate |
| repository read unavailable | protocol dependency unavailable or query degraded unavailable by surface | none | retry read |
| sidecar truth missing for committed truth | degraded/consistency marker;not synthetic sidecar | none | operations repair/reconcile |

Query mapping rule: no query branch may call `begin()`, `mark_stale`, `replace_*_view`, `save_reference_state`, `append_trace`, `save_audit_trail`, `append_outbox`, `save_result` or `complete idempotency`.

### 9.3 Inbound consumer / worker mapping

| Internal condition | Worker disposition / receipt | Writes allowed | Runtime action |
|---|---|---|---|
| source envelope missing event id / version / dedup key / source ref | `Rejected` | no snapshot/stale;stored rejected receipt only if enough metadata exists | dead-letter/quarantine |
| unsupported event version | `UnsupportedVersion` | no payload parse,no snapshot,no stale marker | dead-letter unsupported |
| payload parse fails after version accepted | `Rejected` | no snapshot/stale;stored rejected receipt if dedup reserved | dead-letter/quarantine |
| forbidden body present | `Rejected` | no snapshot;may store redacted issue receipt | dead-letter/quarantine |
| same event key + same digest duplicate | `Duplicate` | no new writes | ack duplicate |
| same event key + different digest | `Rejected` | optional idempotency conflict marker by Step 13;no snapshot | dead-letter/quarantine |
| resolver/source temporary unavailable | `Delayed` | delayed receipt / no resolved snapshot;only marker if flow explicitly allows | retry |
| external ref not found/rejected | `Rejected` or `Accepted` with failed reference marker depending flow | reference state failed/unresolved only when Step 9 permits | ack or quarantine by flow |
| accepted snapshot/reference update success | `Accepted` | reference/snapshot/stale/optional marker trace/stored receipt/idempotency complete | ack |
| affected view lookup fails | `Delayed` or accepted item failure by Step 13 | rollback snapshot update unless flow has per-item transaction | retry |
| repository/UoW temporary failure | `Delayed` | rollback | retry |
| stored receipt save fails | `Delayed` | rollback;do not complete idempotency | retry |
| idempotency complete fails | `Delayed` | rollback if possible | retry same event |

Unsupported version invariant: when `GovernanceEventSchemaVersion` is unsupported, the worker must not parse payload body, must not save reference state, must not mark projections stale, and must not append marker trace.

### 9.4 Outbox publisher mapping

| Internal condition | Outbox state / worker result | Writes allowed | Recovery |
|---|---|---|---|
| pending list read fails | worker/job delayed or failed report | none | retry later |
| pending item version conflict on marker update | item skipped/failed with conflict | no overwrite | reload next scan |
| payload snapshot missing | `OutboxPublicationState::Failed` or `DeadLettered` by Step 13 policy | publication marker only | manual repair;do not rebuild payload |
| payload schema unsupported by publisher | `DeadLettered` | publication marker only | upgrade schema/topic map or operator recovery |
| publisher temporary failure | `Failed` retryable marker | publication marker only | retry by policy |
| publisher permanent failure | `DeadLettered` or terminal `Failed` by Step 13 policy | publication marker only | manual/config repair |
| publish success but mark_published fails | item delayed/unknown;do not republish blindly | none or conflict marker if loaded version still valid | reload outbox state before retry |
| published/dead-lettered item appears in pending scan | consistency defect | no update without formal recovery | fix repository scan |

Publisher rule: publisher may only use `GovernanceOutboxPayloadSnapshot`. It must not read current `GovernanceContext`, `GovernanceDecision`, policy, control, nonconformity, trace or projection truth to rebuild payload.

### 9.5 Operations job mapping

| Job | Validation reject | Item-level failure | Job-level failure | Recovery |
|---|---|---|---|---|
| `PublishGovernanceOutbox` | missing page/idempotency,invalid page limit,job disabled | missing payload,publish retryable/permanent failure,version conflict | pending scan unavailable,result store failure | retry failed/pending items;manual for dead-letter/missing snapshot |
| `RebuildGovernanceProjections` | empty projection set,invalid view ref/scope,page invalid,job disabled | projection target missing,source truth missing,view assembly failure,version conflict | truth snapshot repo unavailable,result store failure | rerun after source/index/builder repair |
| `RefreshExternalContextSnapshots` | invalid refresh scope,page invalid,job disabled | resolver failure,tracked state missing,affected view lookup failure,version conflict | reference repo unavailable,result store failure | retry transient;manual for invalid ref/index |
| `RunGovernanceReconciliation` | invalid scope,empty impossible input,page invalid,job disabled | report finding for missing/stale/outbox lag | report assembly/store failure | inspect report;run separate repair flow |
| `PrepareGovernanceTraceHandoff` | trace refs empty,target missing,job disabled | trace missing,target disabled,prepare/deliver failure | marker store/result store failure | retry with valid target/trace;manual for permanent target |
| `PrepareGovernanceArchiveHandoff` | both trace/report refs empty,target missing,job disabled | trace/report missing,target disabled,archive prepare failure | marker/result store failure | retry after refs/target fixed |
| `PrepareExternalGrcExport` | invalid/empty snapshot,target missing,job disabled | target disabled,export prepare/deliver failure,marker trace append failure | marker/result store failure | retry after target/export config;manual for permanent failure |

| Job run result | Required condition | Stored result rule |
|---|---|---|
| `Completed` | all required items succeeded and report state completed | save `GovernanceJobReport`,complete idempotency |
| `PartiallyCompleted` | at least one item failed and at least one item succeeded,or report explicitly records partial | save partial report with failed refs |
| `Failed` | no item succeeded after accepted run,or fatal dependency after accepted start | save failed report when enough context exists |
| `DuplicateReplayed` | same job idempotency key/digest and stored job report exists | return stored report;do not execute job body |
| `Rejected` | validation failed before accepted job start | no mutation unless Step 13 explicitly persists rejected result |

### 9.6 Handoff / export mapping

| Internal condition | Marker / report mapping | Writes allowed | Recovery |
|---|---|---|---|
| target disabled before accepted start | rejected job or failed marker if trace refs valid and job accepted | failed marker only when formal run accepted | enable target and retry |
| trace refs empty | rejected job;marker creation forbidden | no marker | caller supplies refs;external GRC export creates marker trace first |
| trace ref missing | rejected job before adapter call,or failed item after accepted start | failed report/marker only;no fake trace | fix trace refs |
| archive report ref missing | rejected job or failed item | failed report/marker only | fix report refs |
| external GRC export snapshot invalid | rejected job before marker | no external body saved | rebuild valid snapshot |
| adapter prepare failure retryable | failed marker with retryable failure ref;partial/failed report | marker + stored report | retry job/new marker per Step 13 |
| adapter prepare failure permanent | failed marker with permanent failure ref | marker + stored report | manual/config repair |
| adapter deliver failure after package prepared | marker preserves package ref and marks failed | marker + stored report | retry delivery if formal retry defined |
| marker save version conflict | item failed/delayed;do not call adapter again until reload | no overwrite | reload marker/version |
| external GRC export failure | marker trace persists,failed marker persists,job report failed/partial | trace + marker + stored report | retry by new run/marker |

### 9.7 Runtime / adapter availability mapping

| Internal condition | Runtime state / public effect | Writes allowed | Recovery |
|---|---|---|---|
| required store unavailable at startup | `GovernanceRuntimeBuildState::Failed` | runtime-local issue marker only | fix config/dependency |
| optional adapter disabled | `GovernanceAdapterAvailabilityState::DisabledByConfig` | runtime-local marker | dependent job rejected/delayed |
| adapter degraded but usable | `Degraded` | runtime-local marker | query/job may return degraded marker |
| adapter unavailable during worker loop | worker `Delayed` or `Failed` entry | runtime-local marker;no truth mutation | retry/backoff |
| invalid config/raw secret issue | runtime build rejected/failed with redacted issue ref | no raw secret persisted | fix config |

## 10. 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| Command validation failed before idempotency reserve | API request validator / metadata parser | return protocol rejection;do not call application mutation body | no trace,no audit,no outbox,no stored command result |
| Command save-before rejected after idempotency reserve | application guard / resolver / domain policy before accepted truth save | save `CommandRejection` stored result,complete idempotency,return `GovernanceCommandOutcome::Rejected` | no truth/history/trace/outbox/stale;stored rejection only |
| Command authorization denied | authorization / visibility policy before mutation | return not authorized/domain rejected | no success trace/outbox;redacted runtime log only |
| Command duplicate same digest | idempotency reserve | rollback current UoW,load stored command result or command rejection by stored kind,return replay | no new trace/audit/outbox/stale |
| Command idempotency conflict | idempotency reserve | mark conflict if Step 13 says;return conflict | no domain mutation;no success trace/outbox |
| Command target not found | repository read | rollback;return not found | no success trace/outbox |
| Command dependency unresolved | resolver/reference state guard | rollback;return dependency unavailable/domain rejected | no success trace/outbox;reference marker only if flow explicitly owns precheck marker |
| Domain transition rejected | domain method / policy guard | rollback;return domain rejected | no success trace/outbox/history |
| Truth save version conflict | repository save | rollback;return version conflict | no success trace/outbox |
| History/trace/audit append failure | audit/trace repository | rollback accepted command | no partial accepted truth;no delayed backfill |
| Outbox payload build failure | payload builder | rollback accepted command | no outbox record;no stored result |
| Outbox append failure | outbox repository | rollback accepted command | no accepted command result |
| Affected view lookup/mark stale failure in command | projection repository | rollback accepted command | no truth commit if stale marker is required by Step 9 |
| Stored result save failure | result repository | rollback accepted command | no idempotency complete |
| Idempotency complete failure | idempotency repository | rollback if possible;return dependency unavailable | no completed record without result |
| UoW commit unknown | UoW manager | return unknown completion/dependency unavailable;next retry must inspect idempotency/result | do not write compensating truth |
| Query request invalid | query handler | return protocol rejection | no write |
| Query visibility denied | `ReadVisibilityPolicy` | return not-visible surface with empty/redacted body | no write |
| Query projection stale/failed/unavailable | projection state read | return stale/degraded/unavailable marker | no write |
| Query sidecar missing | sidecar repository read | return degraded/consistency marker | no synthetic sidecar |
| Consumer unsupported version | worker version gate | return unsupported receipt;do not parse payload | optional dead-letter/receipt only by Step 13;no snapshot/stale |
| Consumer envelope invalid | worker envelope validator | reject/dead-letter | no snapshot/stale;redacted issue only |
| Consumer duplicate | idempotency reserve | rollback,load stored receipt,return duplicate | no new snapshot/stale/trace |
| Consumer forbidden body | payload boundary guard | reject/quarantine | no snapshot/stale;redacted issue receipt only |
| Consumer resolver temporary failure | resolver | delayed receipt or retry | no resolved snapshot;maybe delayed marker if Step 9 permits |
| Consumer accepted snapshot save failure | repository/UoW | rollback;worker delayed/retry | no partial snapshot/stale/receipt |
| Consumer affected view lookup failure | projection repository | rollback accepted consumer or record item failed by Step 13 | no silent skip |
| Publisher pending scan failure | outbox repository | worker/job delayed/failed | no marker update |
| Publisher missing payload snapshot | outbox repository | mark outbox failed/dead-letter by policy | write outbox marker only;no payload rebuild |
| Publisher external publish retryable | publisher port | mark failed retryable;report failed item | no truth rollback |
| Publisher external publish permanent | publisher port | mark dead-letter/terminal failed;report failed item | no truth rollback |
| Projection rebuild target missing | projection repository | report failed item;do not invent target | job report only;maybe state unavailable if target exists |
| Projection rebuild source truth missing | truth repository | mark view unavailable/failed or report item failed | no placeholder truth |
| Reference refresh resolver failure | resolver | mark reference unavailable/failed or report failed item | reference marker only;no external truth |
| Reconciliation drift found | reconciliation scanner | save finding/report | no repair writes |
| Handoff target disabled | adapter registry | rejected job or failed marker when accepted | failed marker only if trace refs valid |
| Handoff prepare/deliver failure | handoff adapter | save failed marker/report | no package body;no trace mutation |
| External GRC export failure | export adapter | marker trace stays;save failed marker/report | no external GRC body |

## 11. 恢复口径表

| 场景 | 分类 | 恢复方式 | 禁止事项 |
|---|---|---|---|
| temporary repository unavailable | retryable | retry same operation/idempotency key after dependency recovers | change key to bypass duplicate protection |
| optimistic version conflict | retryable with reload | reload `Versioned<T>`,re-evaluate policy,then retry | overwrite without expected_version |
| resolver unavailable | retryable | command retry or refresh job retry;consumer delayed | fabricate resolved snapshot |
| publisher retryable failure | retryable | outbox remains failed/retryable;publish job retries by Step 13 | rollback source truth |
| handoff retryable failure | retryable | retry job/new marker as Step 13 defines | delete failed marker or package ref |
| adapter/runtime degraded | retryable/degraded | surface degraded marker;retry after health recovers | mutate Governance truth based on adapter health |
| invalid request | non-retryable same input | caller fixes DTO/envelope/page/metadata | fill missing fields from defaults not in design |
| unsupported schema version | non-retryable until upgrade | dead-letter/unsupported;upgrade schema handler | parse payload anyway |
| forbidden external body | non-retryable same payload | strip body;send ref/summary/digest | persist body in snapshot/report/event |
| domain/policy rejected | non-retryable same state | wait for valid state or change command | write rejected transition as success |
| idempotency conflict | non-retryable same key | use original request or a new key | execute different digest under same key |
| target disabled | retry after config | enable target or choose valid target | call disabled adapter |
| payload snapshot missing | manual | repair outbox/snapshot store;dead-letter if unrecoverable | rebuild from current truth |
| stored result missing | manual | repair result store/idempotency record;run reconciliation | reconstruct result from current truth |
| sidecar truth missing | manual | repair/rebuild sidecar through formal flow | infer sidecar from private maps or string parsing |
| projection dependency index corrupted | manual | rebuild projection/index through projection job | invent affected view refs |
| reconciliation drift | manual / separate repair | inspect report and run formal repair command/job | reconciliation job directly patches truth |
| commit status unknown | manual/idempotency audit | retry same key checks stored result before doing work | blind retry with new key |
| repeated outbox dead-letter | manual | fix topic/schema/config;operator recovery | silently drop event |
| repeated reference invalid | manual/source fix | fix external source or replace ref | mutate invalid to resolved without resolver output |

## 12. 审计 / 事件 / marker 写入规则

| Error / branch | Trace | Audit / history | Outbox | Projection marker | Reference marker | Handoff marker | Stored result / report |
|---|---|---|---|---|---|---|---|
| accepted command truth change | yes,success trace | yes when object family requires | yes,stored payload snapshot | yes,affected stale | only if command formally updates reference | no unless command is handoff-related and Step 9 says | command result |
| command validation rejected | no | no | no | no | no | no | normally no;Step 13 may persist rejected result |
| command domain rejected | no success trace | no success history | no | no | no | no | rejection response only |
| command duplicate replay | no new trace | no | no | no | no | no | read stored command result or command rejection |
| query not visible/degraded | no | no | no | no | no | no | query surface only |
| consumer accepted snapshot/reference | optional marker trace if Step 9 requires | no business history | no unless explicitly defined | yes if affected views exist | yes | no | consumer receipt |
| consumer unsupported version | no | no | no | no | no | no | unsupported receipt/dead-letter by Step 13 |
| consumer rejected forbidden body | no | no | no | no | no | no | rejected receipt/redacted issue |
| publisher success/failure | no new business trace | no business history | marker update only | no | no | no | job report if run by job |
| projection rebuild success/failure | no business trace | no | optional derived view changed outbox only if Step 9/14 enabled | save view state | no | no | job report |
| reference refresh success/failure | no business trace unless marker trace configured | no | no | stale affected views on success | save reference state | no | job report |
| reconciliation report | no business trace unless job trace configured by Step 15 | no | no | no | no | no | reconciliation report + job report |
| trace handoff/archive/export | marker trace for external GRC export;trace handoff uses loaded traces | no business history | optional trace available event only if config enables | no | no | save marker | job report |

Accepted command rollback rule: if any required trace/audit/history/outbox/stale/result/idempotency write fails before commit, the whole command must roll back. It is invalid to commit truth and later "补写" missing success side effects unless a later formal repair job is defined.

## 13. Dead-letter / delayed / rejected semantics

| Surface | Meaning | Writes | Retry |
|---|---|---|---|
| `Rejected` | input is invalid or forbidden for current boundary | redacted issue receipt/report only | no same input retry |
| `UnsupportedVersion` | schema version unsupported | unsupported receipt/dead-letter only;payload unparsed | no until handler upgraded |
| `Delayed` | temporary dependency/backoff | delayed marker/receipt optional by Step 13 | yes |
| `DeadLettered` | terminal outbound publication failure | outbox publication marker | manual/operator recovery |
| `Failed` projection/reference/handoff | maintenance operation failed | corresponding failed marker/state | retry/manual based on failure reason |
| `PartiallyCompleted` job | some items succeeded, some failed | stored job report with typed failed refs | retry failed subset if Step 13 permits |

Dead-letter is a transport/technical terminal for a specific event/outbox item,not a Governance business truth state. A dead-lettered outbox item must not imply its source command truth is invalid.

## 14. Consistency defect catalog

The following are not normal business rejections. They indicate design, adapter, migration or storage consistency defects and require operations visibility.

| Defect | Detection | Required response |
|---|---|---|
| completed idempotency record points to missing stored result | duplicate replay | `DuplicateResultMissing` / dependency unavailable;no recompute |
| outbox record points to missing payload snapshot | publisher | failed/dead-letter marker;manual repair |
| committed truth references missing sidecar value | query/command/job read | degraded/consistency marker or command rejection;manual repair |
| projection dependency index lacks target for known public view | rebuild/affected lookup | failed item;manual projection index rebuild |
| handoff marker has empty trace refs | marker factory/save | reject marker;job rejected/failed |
| external GRC export marker lacks marker trace | export flow | reject before marker save |
| stored result kind does not match duplicate operation | stored result repository | duplicate result missing/wrong kind error;manual repair |
| UoW commit unknown and no idempotency result found | retry/audit | consistency alert;reconciliation |
| forbidden raw external body found in persisted snapshot/event/report | boundary validation/audit | consistency defect;redaction/remediation |

## 15. Error anti-patterns

| Anti-pattern | Why invalid | Correct rule |
|---|---|---|
| returning generic error for query visibility denied | leaks no marker / ambiguous caller behavior | return not-visible query surface with marker |
| parsing unsupported event payload to inspect subject | violates version gate | do not parse payload;return unsupported/dead-letter |
| rebuilding duplicate command result from current truth | result may differ from original accepted transaction | read stored result |
| marking projection stale with invented view ref | violates projection identity closure | use `list_views_affected_by_*` |
| retrying job duplicate by rerunning body | duplicates side effects | read stored job report |
| committing truth when outbox append failed | event propagation gap hidden | rollback accepted command |
| saving external body after resolver failure | violates sibling data ownership | save body-free failed/unavailable marker |
| treating reconciliation as repair command | hidden mutation outside command boundary | save report only |
| dead-lettering outbox by deleting record | loses auditability | set publication state `DeadLettered` |
| silently ignoring payload snapshot missing | publisher cannot publish or audit | failed/dead-letter + consistency alert |

## 16. 前序契约回填

| 回填目标 | 必须写入的正式口径 | 来源 |
|---|---|---|
| `03-详细设计.md` §5 domain | domain 只返回 domain/policy error;不暴露 repository/transport/adapter error | §7、§8.1 |
| `03-详细设计.md` §5 application | application 是 domain/port/UoW/idempotency error 到 protocol/worker/job surface 的唯一映射层 | §7、§8.2、§9 |
| `03-详细设计.md` §7 protocol | command rejected、query not-visible/degraded、consumer rejected/unsupported/delayed、job rejected/partial/failed 的 surface 必须字段级闭合 | §8.4、§9 |
| `03-详细设计.md` §8 flow | rejected/duplicate/delayed/unsupported/partial failure path 不得写 success trace/outbox | §10、§12 |
| `03-详细设计.md` §8 transaction | UoW failure、version conflict、duplicate result missing、commit unknown 的处理方式 | §10、§11、§14 |
| `03-详细设计.md` §9 outbox | missing payload snapshot、publisher retryable/permanent failure、dead-letter semantics | §9.4、§11、§13 |
| `03-详细设计.md` §9 projection/reference | stale/failed/unavailable/degraded 不反写 truth;query no-write | §9.2、§9.5、§11 |
| `03-详细设计.md` §9 handoff/export | target disabled、missing trace/report、adapter failure、external GRC marker trace | §9.6、§10 |
| `03-详细设计.md` §11 error recovery | error type table、mapping table、exception branch table、recovery table | §8~§15 |

## 17. Cross-step closure audit

| 审查项 | 结论 | 证据 |
|---|---|---|
| Step 6 domain errors 是否有对外映射 | 通过 | §8.1、§9.1 |
| Step 7 port / UoW / idempotency errors 是否有 retryability | 通过 | §8.3、§11 |
| Step 8 protocol rejection / query / worker / job surface 是否被使用 | 通过 | §8.4、§9 |
| Step 9 异常分支是否集中收口 | 通过 | §10 |
| Step 10 invalid transition placeholder 是否映射到具体错误类别 | 通过 | §8.1、§9.1、§10 |
| Step 11 consistency failure 是否有恢复口径 | 通过 | §11、§14 |
| Query denied 是否避免 generic error | 通过 | §9.2、§12 |
| Unsupported inbound version 是否禁止解析 payload | 通过 | §9.3、§13 |
| Duplicate replay 是否禁止重跑 mutation/job | 通过 | §9.1、§9.3、§9.5、§15 |
| Outbox publish failure 是否不回滚 truth | 通过 | §9.4、§11 |
| Projection/reference failure 是否不反写真相 | 通过 | §9.5、§11 |
| Handoff/export failure 是否只保存 marker/report | 通过 | §9.6、§12 |
| Consistency defects 是否与 business rejection 区分 | 通过 | §14 |

## 18. Step 13 handoff

| Step 13 topic | 本 Step 提供的输入 |
|---|---|
| idempotency key/digest | duplicate/conflict/missing result semantics in §9 / §11 / §14 |
| retry policy | retryable/non-retryable/manual categories in §11 |
| dead-letter policy | unsupported version / payload invalid / outbox dead-letter in §9.3 / §9.4 / §13 |
| partial job commit | job partial/failed mapping in §9.5 and exception handling in §10 |
| concurrency conflict | optimistic version conflict mapping in §8.2 / §8.3 / §11 |
| reentrant handoff/export | marker terminal/failure rules in §9.6 / §12 |
| commit unknown recovery | UoW commit unknown and idempotency lookup rules in §10 / §11 / §14 |

## 19. Stop-review checklist

| Checklist item | Status | Notes |
|---|---|---|
| 错误层级已覆盖 domain/application/port/api/worker/jobs | 通过 | §7 |
| 错误类型表已区分 domain、application、port、protocol/job/worker | 通过 | §8 |
| Command / Query / Consumer / Publisher / Job / Handoff 映射已闭合 | 通过 | §9 |
| 异常分支处理表已写检测位置、处理方式、审计/事件规则 | 通过 | §10 |
| 恢复口径已区分 retryable / non-retryable / manual | 通过 | §11 |
| 审计 / trace / outbox / marker 写入规则已闭合 | 通过 | §12 |
| Dead-letter / delayed / rejected semantics 已区分 | 通过 | §13 |
| Consistency defect catalog 已列出 | 通过 | §14 |
| 反例 / anti-pattern 已列出 | 通过 | §15 |

## 20. Step 完成记录

| 项目 | 结论 |
|---|---|
| Step 12 是否完成 | 是 |
| 是否需要回改 Step 8~11 | 暂无必须即时回改;Step 19 装配正式 `03-详细设计.md` 时按 §16 回填 |
| 是否发现新的标准经验 | 已检查;standards 已覆盖错误模型、duplicate result、job report、scope 错误映射等同类经验,本次不重复更新 |
| 下一步 | Step 13 `03_ddd_step_13_concurrency_idempotency.md`:并发、幂等与重入保护 |
