# Step 12. 错误模型、异常分支与恢复口径

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
> 回填章节: `03-详细设计.md` §11 错误模型、异常分支与恢复口径
> 生成日期: 2026-07-04
> 状态: 已完成

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 错误模型、异常分支与恢复口径 |
| 当前状态 | 已完成 |
| 输入基线 | 需求、架构、概要、Step 1~11 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_12_error_recovery.md` |
| 停审方式 | 按错误层级、协议映射、异常分支、恢复口径、审计 / relay / marker 写入规则分批写入;全部完成后做跨 Step 8~11 闭环审计 |

---

## 2. 本步目标

本 Step 把 Step 6 的 `ArtifactDomainError` / `ArtifactApplicationError` / stored result surface、Step 7 的 repository / resolver / relay / handoff / UnitOfWork / idempotency port 失败边界、Step 8 的 command rejection / query surface / inbound receipt / job response、Step 9 的异常分支、Step 10 的非法转换和 Step 11 的 consistency failure 收束成可实现的错误模型。

实现侧遇到错误时必须能明确回答:

- 错误属于 domain、application、port、API、worker 还是 job boundary。
- 错误是否可重试、不可重试、可等待外部状态后再试,还是必须人工 / 运维介入。
- Command 是返回 `ArtifactCommandOutcome::Rejected`、duplicate replay,还是 `ApplicationError`。
- Query 是返回 not-visible / degraded / empty / missing surface,还是 `ApplicationError`。
- Inbound event 如何映射为 `Accepted` / `Duplicate` / `Delayed` / `Rejected` / `UnsupportedSchema` / `Quarantined`。
- Operations job 如何映射为 `Completed` / `PartiallyCompleted` / `Failed` / `DuplicateReplayed` / `Rejected`。
- Relay publication 和 handoff delivery failure 如何持久化 marker / report,且不回滚已提交 truth。

本步不定义具体 HTTP status code 数字、RPC code 数字、transport retry 参数、dead-letter queue 名称、日志格式、告警系统、错误文本本地化、配置 binding 或实施 commit boundary。这些由 API adapter、worker runtime、Step 13、Step 14 和 Step 15 继续细化。

---

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 已完成 | 固定 L1-artifact 不持有外部正文、runtime 日志、archive body 或 sibling truth |
| `01-架构设计.md` | 已完成 | 固定异步传播、最终一致、relay、projection、handoff、reference snapshot 和 no-repair query 边界 |
| `02-概要设计.md` | 已完成 | 提供错误边界、状态流、处理流和配置影响概要 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 `ArtifactDomainErrorCode`、`ArtifactApplicationErrorCode`、stored result / receipt / report envelope、domain state failure 来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 `ApplicationError`、repository / resolver / relay / handoff / UoW / idempotency port 失败边界 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 `ArtifactProtocolRejectionCode`、query surface、inbound receipt disposition、job run disposition |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / relay / job / handoff 的异常分支和 rollback 点 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供非法 transition、terminal state、failed/unavailable/stale/retryable 状态语义 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 optimistic conflict、UoW failure、missing result、missing payload snapshot、projection/reference/handoff recovery 场景 |
| `projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md` | 已读取 | 作为错误模型粒度、mapping 表、recovery 表和 audit 表的参考框架 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已生效 | 检查错误映射、version、stored result、relay snapshot、query no-write、job report 和 duplicate replay 闭环 |

---

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 12.1 | 文件骨架、SOP 问题回答、错误设计原则、错误层级、错误类型表 | [x] 已写入 |
| 12.2 | Command / Query / Inbound / Relay / Job / Handoff / Runtime 映射表 | [x] 已写入 |
| 12.3 | 异常分支处理表、恢复口径表、审计 / relay / marker / stored result 写入规则 | [x] 已写入 |
| 12.4 | consistency defect catalog、anti-pattern、前序契约回填、跨 Step 审计、Step 13 handoff | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个模块有哪些错误类型? | `domain` 返回 `ArtifactDomainError`;`application` 使用 `ArtifactApplicationError` / `ApplicationError`;repository / resolver / relay / handoff / UnitOfWork / idempotency 属于 application port failure;`api` 输出 `ArtifactProtocolRejection` 或 query surface;`worker` 输出 inbound receipt disposition 或 relay batch item outcome;`jobs` 输出 `ArtifactJobRunDisposition`、`ArtifactJobProtocolOutcome` 和 stored job report。 |
| 哪些错误映射到 command rejection? | Request envelope/body/schema/operation mismatch、duplicate digest conflict、domain policy rejection、invalid state、missing required ref、visibility denied 和 body-forbidden 映射为 `ArtifactCommandOutcome::Rejected` / `ArtifactProtocolRejection`。Repository unavailable、UoW failure、serialization defect、missing stored result、missing relay payload 等 infrastructure / consistency failure 保持 `ApplicationError`。 |
| Query denied / missing / stale 如何表达? | Visibility denied 返回 `ArtifactQueryVisibility::NotVisible`;projection stale / reference unavailable / missing source 返回 `ArtifactQuerySurface.degraded_reasons`;empty page 是正常 page surface。Query 不写 trace、audit、projection、reference、stored result 或 idempotency。 |
| Inbound unsupported / invalid / duplicate 如何处理? | Unsupported schema 返回 `UnsupportedSchema` receipt,不解析 payload、不保存 snapshot、不 mark stale。Same dedup key + same digest 返回 stored receipt `Duplicate`;same key + different digest 返回 `Quarantined` 或 `Rejected`,不写 reference/mirror/truth。 |
| Job error 如何表达? | Job metadata / scope / page / disabled job 在 runner boundary 返回 `ArtifactJobRunDisposition::Rejected`;duplicate same digest replay stored report;job body item failure 进入 `ArtifactJobProtocolOutcome::PartiallyCompleted` 或 `Failed` report;missing stored report 是 consistency defect,不得 rerun job body。 |
| 哪些错误可重试? | Repository unavailable、resolver unavailable、relay publisher retryable、handoff retryable、version conflict after reload、in-progress idempotency、temporary reference delayed、job dependency unavailable 可重试。 |
| 哪些错误不可原样重试? | Invalid envelope/body、unsupported schema、body forbidden、domain invalid transition、policy rejected、duplicate key different digest、not visible、forbidden boundary violation 不可原样重试。 |
| 哪些错误需要人工 / 运维介入? | Completed idempotency missing stored result、missing relay payload snapshot、wrong stored result kind、projection lookup/index corruption、commit status unknown、serialization defect、forbidden body already persisted、repeated relay/handoff terminal failure、runtime config invalid。 |
| 哪些异常需要写审计、事件或 marker? | 只有 accepted truth change、accepted consumer reference marker、relay publication marker、projection/reference state、handoff record/material、reconciliation report、stored result/job report 按 Step 9~11 写入。Rejected command、invalid request、not-visible query、unsupported event 不写 success trace/relay。 |

---

## 6. 错误设计原则

| 原则 | 说明 |
|---|---|
| Domain error 只表达业务不变量 | `ArtifactDomainError` 只能来自 domain factory / transition / policy guard,不得表达 repository、adapter、UoW、serialization 或 network failure。 |
| Application error 只表达 orchestration / port / consistency failure | `ApplicationError` 是 service 和 port 签名统一错误面,不得直接暴露为 public protocol code;entry 层必须按 Step 8/12 映射。 |
| Protocol rejection 是可预期输入拒绝 | Command request 不合法、业务拒绝或 duplicate conflict 返回 `ArtifactCommandOutcome::Rejected`,不是 panic 或 hidden mutation。 |
| Query degraded 不是 exception | not-visible、stale、missing projection、reference unavailable 是 query surface,不是 command rejection,也不能触发修复写。 |
| Duplicate replay 不重跑 | same key + same digest 只读取 stored result / receipt / report,不得重新执行 mutation、resolver、relay、handoff 或 job scan。 |
| Business resolver outcome 与 call failure 分离 | `ArtifactReferenceRefreshResolution<T>` 的 unresolved/failed 是可持久化 business outcome;resolver `ApplicationError` 只是 call failure。 |
| Relay / handoff failure 不回滚 truth | relay publication 和 handoff delivery 已在 accepted truth 事务之后;failure 只更新 marker/report。 |
| Missing durable side effect 是 consistency defect | completed idempotency missing stored result、relay item missing payload snapshot、prepared report missing material 等不得从 current truth 临时重建。 |
| Retry 与 manual repair 分开 | transient unavailable 可 retry;schema/design/storage defect 必须人工或运维介入。 |
| Redaction 优先 | error message、issue refs、receipt/report 不得保存 external body、artifact content body、runtime log、archive body、stack trace 或 adapter raw payload。 |

---

## 7. 错误层级

```text
domain object / policy
  -> ArtifactDomainError
  -> application maps to ArtifactApplicationErrorCode::DomainRejected or stored rejection

application service
  -> ApplicationError for orchestration / port / consistency failure
  -> ArtifactCommandRejectionEnvelope / ArtifactInboundReceiptEnvelope / ArtifactJobReportEnvelope when flow requires durable replay surface

port / adapter
  -> mapped into ApplicationError or item-level failure
  -> never exposed directly to public protocol

api command entry
  -> ArtifactCommandOutcome::Accepted
  -> ArtifactCommandOutcome::Rejected
  -> Result::Err(ApplicationError) only for infrastructure / consistency failure

query entry
  -> ArtifactQueryResponse / ArtifactPageResponse with surface
  -> Result::Err(ApplicationError) only for infrastructure / consistency failure

worker / jobs
  -> ArtifactInboundReceiptDisposition / ArtifactJobRunDisposition / ArtifactJobProtocolOutcome
  -> stored receipt/report for duplicate replay
```

Layering red lines:

- `ArtifactDomainErrorCode` must not be expanded by implementation to encode adapter failure.
- `ArtifactProtocolRejectionCode` must not be used inside domain object state.
- `ArtifactInboundReceiptDisposition` and `ArtifactJobRunDisposition` are protocol labels,not truth lifecycle states.
- `ArtifactApplicationError.message` is diagnostic only;service must not parse it for control flow.

---

## 8. 错误类型表

### 8.1 Domain errors

| 错误类型 | 所属模块 | 触发条件 | Retry classification | 对外映射 |
|---|---|---|---|---|
| `ArtifactDomainErrorCode::InvalidStateTransition` | `domain` | 状态迁移不在 Step 10 矩阵内;terminal state 再迁移;reserved transition 被当前 flow 调用 | non-retryable same input | command `PolicyRejected` / stored rejection `InvalidState`;job failed item |
| `ArtifactDomainErrorCode::MissingRequiredReference` | `domain` | factory / transition 需要 artifact fact/version/baseline/review/submission/trace/ref/basis 但缺失 | retry only after caller supplies formal ref or reference becomes available | command `MissingRequiredField` or `PolicyRejected`;job failed item |
| `ArtifactDomainErrorCode::BoundaryViolation` | `domain` | external body、runtime log、archive body、sibling truth body、query-side write 或 candidate-only bypass 进入本仓 | non-retryable until caller removes forbidden body | `BodyForbidden` / `PolicyRejected`;consumer `Rejected` / `Quarantined`;job `Rejected` |
| `ArtifactDomainErrorCode::PolicyRejected` | `domain::policy` | artifact policy guard 拒绝 intake、fact establish、version publish、lineage、baseline、review、automation、consumption | non-retryable unless governing state changes | command `PolicyRejected`;consumer rejected/accepted-failed marker by flow |
| `ArtifactDomainErrorCode::DuplicateTruthAnchor` | `domain` / repository uniqueness guard | fact anchor、content context、lineage endpoints、baseline scope、consumable selector 重复且非 idempotent replay | non-retryable same truth anchor | command `PolicyRejected` or conflict branch;not optimistic version conflict |

Domain error mapping rules:

- `ArtifactDomainError.subject_ref` can be copied into application issue context only when it points to an existing `ArtifactTruthAnchorRef`.
- Domain error `message` is redacted diagnostic text and is not a public validation issue body.
- Domain `DuplicateTruthAnchor` is not idempotency duplicate. Idempotency duplicate is handled by `ArtifactIdempotencyReservation::Duplicate`.

### 8.2 Application errors

| 错误类型 | 所属模块 | 触发条件 | Retry classification | 对外映射 |
|---|---|---|---|---|
| `ArtifactApplicationErrorCode::DomainRejected` | `application` | mapped from `ArtifactDomainError` when service uses error path instead of stored rejection branch | non-retryable by same input | command rejection / job failed item / worker rejected by caller stage |
| `ArtifactApplicationErrorCode::PersistenceFailed` | `application` / port | repository unavailable, version conflict, serialization failure, UoW begin/commit/rollback failure, result store failure | depends on underlying class | protocol dependency unavailable/conflict or consistency defect |
| `ArtifactApplicationErrorCode::ReferenceUnavailable` | `application` / resolver | required reference unresolved, resolver unavailable, mirror snapshot missing, external source unavailable | retry after refresh/source recovery when transient | command dependency unavailable;consumer delayed/failed;job failed ref |
| `ArtifactApplicationErrorCode::IdempotencyConflict` | `application` | same operation + key + different digest;completed result missing;reservation already in progress | conflict non-retryable;in-progress retryable;missing result manual | command duplicate conflict / worker quarantined / job rejected or consistency defect |
| `ArtifactApplicationErrorCode::RelayFailed` | `application` / relay / handoff | relay publish failure, payload build failure, handoff delivery failure, target disabled | retryable/permanent/manual depending outcome | relay batch item failed/retryable;job partial/failed |
| `ArtifactApplicationErrorCode::InvariantViolation` | `application` | schema / state / ownership invariant broken, forbidden persisted body, missing payload snapshot, wrong stored result kind, projection lookup corruption | manual repair | internal consistency defect;degraded query / failed job / alert |

Application error red lines:

- Step 7 keeps the minimal enum. Step 12 may classify sub-scenarios in tables, but implementation must not invent new enum variants without reopening Step 6/7.
- `PersistenceFailed` must be mapped with context. A version conflict, unavailable store and serialization defect are not interchangeable at protocol/recovery level.
- `RelayFailed` covers relay and handoff application failure, but handoff delivery outcome still uses `ArtifactHandoffDeliveryOutcome` when adapter returns a formal outcome.

### 8.3 Port / infrastructure failure classes

| Failure class | Source | Trigger | Retry classification | Required mapping |
|---|---|---|---|---|
| `RepositoryNotFound` | repository read | requested truth/view/report/state/result absent | depends on caller | command not found/rejection;query missing/degraded;job failed item |
| `RepositoryVersionConflict` | repository save / relay marker update | expected version mismatch | retryable after reload | command conflict;relay item skipped;job failed/retryable item |
| `RepositoryUniqueConflict` | repository create | formal unique key violated | usually non-retryable unless idempotency duplicate | duplicate truth rejection or conflict branch |
| `StoreUnavailable` | repository/UoW/result store | durable store temporarily unavailable | retryable | dependency unavailable / delayed |
| `SerializationDefect` | repository/result/payload store | stored payload/result/view cannot serialize or deserialize | manual | consistency defect |
| `UnitOfWorkBeginFailed` | UoW manager | cannot begin transaction | retryable | dependency unavailable |
| `UnitOfWorkCommitUnknown` | UoW manager | commit returns unknown durable status | manual/idempotency-check only | commit unknown recovery;no blind compensating writes |
| `UnitOfWorkRollbackFailed` | UoW manager | rollback failed or uncertain | manual | consistency defect |
| `IdempotencyAlreadyInProgress` | idempotency repo | same key reserved but not completed | retry later | delayed / dependency unavailable |
| `IdempotencyDigestConflict` | idempotency repo | same key different digest | non-retryable same key | duplicate conflict |
| `IdempotencyResultMissing` | idempotency/result repo | completed idempotency points to missing/wrong result kind | manual | duplicate result missing consistency defect |
| `ResolverUnavailable` | resolver port | upstream / adapter temporarily unavailable | retryable | delayed / dependency unavailable / failed item |
| `ResolverInvalidResponse` | resolver port | upstream violates body-free contract/schema | non-retryable until adapter/source fixed | rejected / quarantined / consistency defect |
| `ResolverForbiddenBody` | resolver port | resolver returns raw body forbidden by boundary | non-retryable | boundary violation / consistency defect |
| `RelayPublisherRetryable` | relay publisher | transport temporary failure | retryable | relay retryable marker |
| `RelayPublisherPermanent` | relay publisher | target/schema/auth permanent failure | manual/config repair | relay terminal failed/dead-letter policy by Step 13 |
| `RelayPayloadInvalid` | payload builder/publisher | stored payload cannot match Step 8 schema | manual/design repair | relay failed + alert |
| `HandoffTargetDisabled` | handoff adapter/config | target not enabled or unavailable by config | retry after config change | job rejected or failed handoff record |
| `HandoffRetryable` | handoff adapter | temporary delivery failure | retryable | retryable handoff record/report |
| `HandoffPermanent` | handoff adapter | target rejects package permanently | manual/config repair | failed handoff record/report |
| `RuntimeInvalidConfig` | infra runtime | required adapter/config missing or invalid | manual/config repair | runtime failed, job rejected, worker delayed |

Port failure rules:

- Port-specific error structs/enums are adapter-local unless Step 7 formally defines them. Application service maps them to `ApplicationError` or item-level result without leaking adapter private data.
- Resolver `ApplicationError` cannot be used to select `mark_unresolved(...)` / `mark_failed(...)`;only `ArtifactReferenceRefreshResolution<T>` can drive reference state transitions.
- Relay publisher / handoff adapter formal outcomes are preferred over parsing thrown error text.

### 8.4 Protocol / worker / job surfaces

| Public surface | Owner | Produced by | Retry classification | Persistence |
|---|---|---|---|---|
| `ArtifactProtocolRejectionCode::InvalidEnvelope` | `contracts` / API | missing metadata, actor, trace, idempotency key, digest, malformed envelope | non-retryable until fixed | stored rejection only when idempotency was reserved |
| `MissingRequiredField` | `contracts` / API | body missing formal ref / marker / intent | non-retryable until fixed | stored rejection when after reserve |
| `OperationMismatch` | `contracts` / API | route-neutral operation name and body DTO mismatch | non-retryable | no service mutation |
| `DuplicateConflict` | `contracts` / API | same idempotency key different digest | non-retryable same key | stored rejection/conflict marker |
| `PolicyRejected` | `contracts` / API | domain/policy rejected | non-retryable unless state changes | stored rejection when after reserve |
| `BodyForbidden` | `contracts` / API | forbidden content/body/log/archive payload submitted | non-retryable | stored rejection/quarantine if enough metadata |
| `UnsupportedSchema` | `contracts` / API/worker | schema version unsupported | non-retryable until upgrade | unsupported receipt for inbound |
| `ArtifactQuerySurface::NotVisible` | `contracts` / query | actor cannot see body | non-retryable for same actor/state | no write |
| query `Degraded` reasons | `contracts` / query | missing/stale projection, unresolved/unavailable reference, redaction | retry later/job refresh depending reason | no write |
| `ArtifactInboundReceiptDisposition::Accepted` | worker | event accepted and local state/report saved | no retry needed | stored receipt |
| `Duplicate` | worker | same dedup key and digest | no retry | replay stored receipt |
| `Delayed` | worker | upstream ref/source temporarily unresolved | retryable | stored receipt |
| `Rejected` | worker | valid schema but policy/body/selector rejected | non-retryable | stored receipt when possible |
| `UnsupportedSchema` | worker | version unsupported before body parse | non-retryable until upgrade | stored receipt if envelope permits |
| `Quarantined` | worker | dedup conflict or unsafe relation/body | manual review | stored receipt |
| `ArtifactJobRunDisposition::Completed` | jobs | fresh job completed | no retry | stored job report |
| `PartiallyCompleted` | jobs | fresh job committed some item changes and reported failed refs | retry selected failed refs | stored job report |
| `Failed` | jobs | fresh job failed before useful completion | retry/manual depending cause | stored job report when service started |
| `DuplicateReplayed` | jobs | duplicate same key/digest report replay | no retry | stored report loaded |
| `Rejected` | jobs | job metadata/scope/page disabled/invalid | non-retryable until fixed | no body mutation;stored rejected result only if Step 13 says |

---

## 9. 内部错误映射表

### 9.1 Command 映射

| 内部错误 / 场景 | Command protocol mapping | Transaction rule | Caller action |
|---|---|---|---|
| envelope missing actor / trace / idempotency key / digest | `ArtifactProtocolRejectionCode::InvalidEnvelope` | reject before UoW when detected at entry | resend valid envelope |
| route operation name does not match body DTO | `OperationMismatch` | reject before service call | call correct route/body pair |
| body missing required artifact ref / reason / marker / submission ref / freeze context | `MissingRequiredField` | if before reserve, no write;if after reserve, save rejection result then complete idempotency | provide formal field |
| forbidden artifact content body / external source body / runtime log / archive body supplied | `BodyForbidden` | rollback;no truth/reference/mirror save | submit body-free refs/summaries/digests only |
| unsupported command schema version | `UnsupportedSchema` | reject before body mapping | upgrade client/schema |
| domain invalid state transition | `PolicyRejected` with stored rejection code `InvalidState` | rollback or save rejection if after reserve;no success trace/relay/stale | reload state and issue valid command |
| domain missing required reference | `MissingRequiredField` or `PolicyRejected` by stage | no accepted truth | provide required ref or wait for reference resolution |
| domain policy rejected | `PolicyRejected` | no accepted truth/history/relay | satisfy policy or wait for governing state |
| duplicate truth anchor not caused by idempotency replay | `PolicyRejected` or conflict branch | rollback;no merge | use existing truth or create distinct formal anchor |
| visibility denied on write command | `PolicyRejected` or command authorization rejection | no truth/stored accepted result | use authorized actor/scope |
| required external ref unresolved/stale/unavailable | dependency unavailable rejection or `PolicyRejected` by flow | no accepted truth;reference marker only when flow explicitly says | refresh/fix upstream ref |
| optimistic version conflict on truth/support save | conflict/dependency surface mapped from `PersistenceFailed` | rollback;no success trace/relay/stale | reload versioned row and retry if still valid |
| repository unavailable before commit | dependency unavailable `ApplicationError` | rollback if UoW open | retry same idempotency key |
| UoW begin failed | dependency unavailable `ApplicationError` | no mutation | retry later |
| UoW commit status unknown | `ApplicationError` with commit-unknown handling | do not run compensating writes | lookup idempotency/result before retry |
| stored result save failed before idempotency complete | dependency unavailable `ApplicationError` | rollback;no completed idempotency | retry same key |
| idempotency complete failed | dependency unavailable / commit unknown by UoW status | rollback if possible;otherwise inspect idempotency | retry same key after lookup |
| same idempotency key + same digest | duplicate replay | rollback active UoW;read stored accepted/rejected result | treat as successful replay |
| same idempotency key + different digest | `DuplicateConflict` | no domain mutation;save conflict marker/rejection if Step 13 says | use original request or new key |
| completed idempotency result missing/wrong kind | consistency defect `ApplicationError` | no mutation;do not reconstruct | operator repair result store |

Command mapping red lines:

- Rejected command does not emit accepted relay item, change record or stale marker.
- Duplicate same digest replays either prior accepted response or prior rejected response;it does not recompute from current truth.
- API entry must not convert every `ApplicationError` into `ArtifactProtocolRejection`;infrastructure / consistency failures remain error path.

### 9.2 Query 映射

| Internal condition | Query surface / error | Writes allowed | Caller action |
|---|---|---|---|
| requested truth ref missing | not found / missing source surface by query type | none | check ref |
| requested projection view missing | `ArtifactQueryDegradedReason::MissingSource` | none | run maintenance job separately |
| projection / report stale | `ArtifactQueryFreshness::StaleReadable` + `StaleSource` when applicable | none | accept stale read or schedule rebuild |
| projection rebuilding | `ArtifactQueryFreshness::Rebuilding` | none | retry later |
| projection state failed/unavailable | degraded / unavailable surface | none | operations inspect failed state |
| external reference unresolved | `ExternalReferenceUnresolved` | none | wait for refresh / run refresh job |
| external reference failed/unavailable | `ExternalReferenceUnavailable` | none | operations inspect resolver/source |
| actor not visible | `ArtifactQueryVisibility::NotVisible`, body `None` or redacted | none | use authorized actor/scope |
| visibility cannot be decided | `ArtifactQueryVisibility::VisibilityUnknown` + degraded reason if applicable | none | retry after reference/projection recovery |
| empty repository page | empty page response | none | page is complete for current cursor |
| repository unavailable | `ApplicationError::PersistenceFailed` | none | retry later |
| stored view serialization defect | `ApplicationError::InvariantViolation` | none | manual repair |

Query mapping red lines:

- Query must not call resolver, save refresh state, append trace/backref, rebuild projection, mark stale, save stored result or reserve idempotency.
- Not-visible is not a not-found substitute. It must preserve the formal visibility surface from Step 8.
- Empty page is not an error and must not trigger pre-list visibility repair or synthetic rows.

### 9.3 Inbound consumer / worker mapping

| Internal condition | Inbound disposition | Allowed writes | Forbidden behavior |
|---|---|---|---|
| missing event id / dedup key / source ref / schema version | `Rejected` if enough envelope to store receipt, otherwise worker-level reject | stored rejected receipt only when formal metadata exists | parse body or mark stale |
| unsupported schema version | `UnsupportedSchema` | stored unsupported receipt if dedup context exists | parse payload fields |
| payload parse fails after accepted schema | `Rejected` or `Quarantined` by severity | stored redacted receipt | save reference/mirror/truth |
| forbidden body present | `Rejected` or `Quarantined` | stored receipt with issue refs | persist body or mirror snapshot |
| same event key + same digest | `Duplicate` | no new writes;replay stored receipt | rerun resolver |
| same event key + different digest | `Quarantined` or `Rejected` | optional conflict marker per Step 13;stored receipt | process payload under same key |
| resolver business outcome resolved | `Accepted` | save resolution state, optional mirror snapshot, refresh record, stale marker, receipt | create core truth |
| resolver business outcome unresolved/waiting | `Delayed` or `Accepted` by flow | save unresolved/waiting state and refresh record when Step 9 permits | treat as application exception |
| resolver business outcome failed/invalid | `Rejected`, `Quarantined` or `Accepted` with failed state by flow | save failed state/refresh record only when formal | store raw upstream body |
| resolver call unavailable | `Delayed` or worker retryable failure | stored delayed receipt when service reached idempotency branch | mark resolved/unresolved from error text |
| repository version conflict while saving reference state | `Delayed` / item retryable failure | rollback current UoW | overwrite state |
| result store unavailable | worker dependency failure | rollback | ack as accepted |

Consumer red lines:

- Consumer never creates `ArtifactFact`, `ArtifactVersion`, `ArtifactBaseline`, `ArtifactLineageLink` or `ConsumableArtifactReference`.
- Consumer may mark derived state stale only when affected view/state refs are formal.
- Unsupported schema does not authorize body parse for issue extraction.

### 9.4 Relay publication mapping

| Internal condition | Relay batch mapping | Persistence | Recovery |
|---|---|---|---|
| pending page empty | completed batch with no item changes | no write | next scheduled scan |
| pending item already changed by another worker | skipped/conflict item | no overwrite | reload next scan |
| payload snapshot missing | failed or retryable marker by Step 13 policy | marker update with pending item version | manual repair;no rebuild from truth |
| publisher returns `ArtifactRelayOutcome::Published` | published item | `mark_published(... expected_version ...)` | no retry |
| publisher returns `Retryable` | retryable item | `mark_retryable(... expected_version ...)` | retry by future scan |
| publisher returns `Failed` | failed item | `mark_failed(... expected_version ...)` | manual/config repair if terminal |
| publisher returns `ApplicationError` | item failure / dependency failure | no invented retry class unless Step 13 says | retry using formal policy |
| mark_published conflict after publish success | unknown item marker state | do not republish blindly | reload item;operator review if needed |
| published/failed terminal item appears in pending scan | consistency defect | no update except formal recovery | repair repository scan/index |

Relay red lines:

- Relay publisher cannot read current truth, projection, mirror snapshot or sibling repo to rebuild payload.
- Relay failure never invalidates source command truth.
- Retryable vs terminal must come from `ArtifactRelayOutcome` or Step 13 policy,not from transport error text.

### 9.5 Operations job mapping

| Job flow | Rejected before body | Item-level failure | Run-level failure | Recovery |
|---|---|---|---|---|
| `RebuildArtifactDerivedViews` | empty/unsupported view kind set,invalid snapshot scope,page invalid,job disabled | source truth missing,view assembly failure,projection save conflict,derived state save failure | truth snapshot repo unavailable,result store unavailable | rerun failed refs after source/view/index repair |
| `RefreshExternalReferenceStates` | invalid refresh scope,page invalid,job disabled | resolver unavailable,tracked state missing,mirror save conflict,affected stale marker failure | reference repo unavailable,result store unavailable | retry transient;manual for invalid ref/index |
| `RunArtifactReconciliation` | invalid reconciliation scope,page invalid,job disabled | snapshot load partial,report save conflict,finding assembly failure | snapshot repo unavailable,result store unavailable | rerun after dependency repair;no truth repair |
| `PrepareArtifactArchiveHandoff` | invalid target/scope,page invalid,target disabled when prechecked | missing baseline/report/trace ref,material save failure,delivery retryable/permanent | handoff repo unavailable,result store unavailable | rerun after target/material dependency repair |
| `PrepareArtifactObservabilityHandoff` | invalid target/truth anchors,page invalid,target disabled | missing trace/review ref,material save failure,delivery failure | handoff repo unavailable,result store unavailable | rerun/retry delivery by formal job |
| `PrepareArtifactSyncHandoff` | invalid target/consumer scope,page invalid,target disabled | missing consumable/read surface/trace ref,material save failure,delivery failure | handoff repo unavailable,result store unavailable | rerun after read surface / target recovery |

Job disposition mapping:

| Disposition | Condition | Stored report rule |
|---|---|---|
| `Completed` | all selected items completed and stored report saved | report required |
| `PartiallyCompleted` | at least one item committed and at least one item failed/skipped with failed refs | report required |
| `Failed` | no useful item completed or fatal service failure after job accepted | report required when idempotency was reserved and result store reachable |
| `DuplicateReplayed` | same job key/digest and stored report exists | report loaded;job body not run |
| `Rejected` | validation/config/scope failure before job body | report optional;no job mutation |

Job red lines:

- Duplicate missing stored report maps to consistency defect;runner must not rerun job body to recreate report.
- Job cannot repair core artifact truth, relay payload snapshot or stored result defect unless a future formal recovery job is defined.
- Partial completion must report body-free changed/failed refs only.

### 9.6 Handoff / delivery mapping

| Internal condition | Handoff mapping | Persistence | Recovery |
|---|---|---|---|
| target disabled before accepted job | job `Rejected` | no material unless job flow already accepted target check | enable config and rerun |
| required trace refs empty | job rejected/failed item | no prepared material | fix trace source;do not synthesize trace |
| required baseline/report/read surface missing | failed item / degraded report | job report failed refs | rebuild source view/report separately |
| material save failed | job failure | rollback current UoW | retry after store recovery |
| delivery outcome `Delivered` | delivered handoff record/report | append record + material/report | no retry |
| delivery outcome `Retryable` | retryable handoff report/record | append retryable/failed record per Step 10 state | formal retry job |
| delivery outcome `Failed` | terminal failed handoff report/record | append failed record/report | manual/config repair |
| delivery port `ApplicationError` | job item failure | no parsing of adapter private error | retry by Step 13 policy |

Handoff red lines:

- Delivery adapter consumes prepared material only.
- Failed delivery does not mutate fact/version/baseline/consumption truth.
- Handoff record/report cannot contain archive/sync/observability body.

### 9.7 Runtime / adapter availability mapping

| Runtime condition | Surface | Persistence | Recovery |
|---|---|---|---|
| required repository adapter missing | `ApplicationError::PersistenceFailed` / runtime startup failure | none if startup;failed job if runtime detects during job | fix deployment/config |
| resolver adapter missing | `ReferenceUnavailable` / worker delayed / job failed | stored delayed/failed receipt/report when flow reached result path | configure resolver |
| relay publisher missing | relay batch failure | marker only if pending item loaded and policy allows | configure publisher |
| handoff target missing | job rejected/failed | no external call | configure target |
| invalid config shape | runtime failed / job rejected | no business mutation | fix config |
| adapter degraded but usable | degraded runtime marker / dependency unavailable for affected operation | normal operation-specific marker/report | monitor/retry |

Runtime red lines:

- Runtime config errors must not be represented as domain truth states.
- Entry/worker/job code must not invent fallback in-memory adapters for missing durable dependencies.
- Adapter availability details remain Step 14 configuration binding;Step 12 only fixes error/recovery mapping.

---

## 10. 异常分支处理表

| Branch | Detection point | Required handling | Forbidden side effect |
|---|---|---|---|
| Command invalid envelope before reserve | API entry normalization | return `ArtifactCommandOutcome::Rejected` with `InvalidEnvelope` when protocol surface can be built | begin UoW, reserve idempotency, domain mutation |
| Command operation mismatch | API route/body mapper | return `OperationMismatch` | call service with guessed operation |
| Command save-before rejected after idempotency reserve | application guard / resolver / domain policy before accepted truth save | save `StoredArtifactOperationResult::CommandRejection`,complete idempotency,commit,return rejected outcome | truth/change/trace/relay/stale writes |
| Command idempotency duplicate same digest | idempotency reserve | rollback active UoW,read typed stored result/rejection,return replay | rerun domain transition or mapper |
| Command idempotency digest conflict | idempotency reserve | return `DuplicateConflict`;mark conflict only through formal idempotency path | execute different digest under same key |
| Domain transition failure after load | domain method | rollback or stored rejection if after reserve | save partially mutated object |
| Truth/support save version conflict | repository save | rollback;return conflict/dependency surface | overwrite without expected version |
| Relay append failure in accepted command | relay repository append | fail command transaction before commit | commit truth without relay snapshot when flow requires relay |
| Stored result save failure | result repository | rollback before idempotency complete | complete idempotency first |
| UoW commit unknown | UoW manager | stop;lookup idempotency/result on retry;raise consistency issue | rerun mutation immediately or compensate blindly |
| Query visibility denied | read policy/query service | return not-visible surface | write audit/projection/reference repair |
| Query missing projection | projection lookup | return degraded/missing surface | rebuild inside query |
| Consumer unsupported schema | worker envelope validator | return/store unsupported receipt without body parse | parse payload or save marker |
| Consumer resolver call failure | resolver port returns `ApplicationError` | delayed/dependency failure;no reference state transition from error text | mark resolved/unresolved from adapter message |
| Consumer resolver unresolved outcome | resolver returns `Unresolved` / waiting outcome | save formal state/refresh record when flow permits;return delayed/accepted receipt | throw infrastructure error |
| Relay payload snapshot missing | relay service | mark failed/retryable per Step 13 policy with pending version | rebuild payload from current truth |
| Relay marker update conflict | relay repository save | skip/reload item;batch records conflict | republish blindly |
| Job duplicate same digest | idempotency reserve | rollback active UoW,load stored job report,return duplicate replay | run job body |
| Job item failure after some commits | job item loop | save report with failed refs and partial outcome | hide failed refs or mutate truth to repair |
| Handoff delivery failure | delivery port outcome | save failed/retryable handoff record/report | mutate artifact truth or delete material |

Exception branch rules:

- Any branch that returns a stored replay surface must have saved that surface before completing idempotency.
- Any branch that writes a failed/retryable marker must use a formal marker state/ref from Step 6~11.
- A branch that cannot produce a formal persisted signal must fail fast through `ApplicationError`,not invent a new marker.

---

## 11. 恢复口径表

| 场景 | 分类 | 恢复方式 | 禁止事项 |
|---|---|---|---|
| optimistic version conflict | retryable with reload | reload `Versioned<T>`,re-evaluate policy,then retry same operation if still valid | overwrite without expected_version |
| repository/store temporary unavailable | retryable | retry same idempotency key after dependency recovery | generate new key to mask partial status |
| UoW begin failed | retryable | retry later;no mutation occurred | report accepted/rejected stored result |
| UoW commit status unknown | manual/idempotency-check | first inspect idempotency/result/affected truth by formal refs;then choose replay/retry/reconcile | blindly rerun command/job |
| same key same digest duplicate | replay | load typed stored result/receipt/report | rerun mutation/resolver/job |
| same key different digest | non-retryable same key | resend original request or use new key for different request | continue under same key |
| completed idempotency missing result | manual consistency repair | repair result store or mark consistency issue through operations | recompute result from current truth |
| domain invalid transition | non-retryable same state | reload state and submit valid command/flow | force state update |
| policy rejected | non-retryable unless governing state changes | satisfy policy or wait for accepted upstream state | bypass policy in application |
| reference unresolved/waiting | delayed/retryable | run refresh job or wait for upstream event | create artifact truth from unresolved ref |
| resolver unavailable | retryable | retry consumer/job after source recovers | write adapter error as domain state |
| forbidden body submitted | non-retryable | remove body and submit ref/summary/digest | redact and store body anyway |
| projection missing/stale | eventually consistent | run rebuild job;query returns degraded/stale until fixed | rebuild in query |
| projection source truth missing | manual/design/data repair | inspect source/ref integrity and rerun job after repair | create synthetic truth |
| relay payload snapshot missing | manual consistency repair | repair payload store or formal recovery job if Step 13 defines one | rebuild from current truth |
| relay publisher retryable | retryable | future scan retries item | mark terminal from error text |
| relay publisher permanent | manual/config repair | fix target/schema/auth;operator recovery | delete relay item |
| handoff target disabled | retry after config | enable target and rerun formal handoff job | call disabled adapter |
| handoff delivery retryable | retryable | formal retry job or future item retry | mutate truth to show delivered |
| handoff delivery permanent | manual/config repair | fix target/config or record terminal failure | delete prepared material/report |
| runtime invalid config | manual/config repair | fix deployment/config and restart/retry affected job | fallback to unconfigured adapter |

Recovery classification:

| Classification | Meaning | Examples |
|---|---|---|
| `retryable` | same formal operation may succeed after reload/backoff/dependency recovery | version conflict, store unavailable, resolver unavailable |
| `delayed` | upstream state is not ready;worker/job may retry later | unresolved reference, in-progress idempotency |
| `non-retryable same input` | same request will fail until caller changes input or governing state changes | invalid envelope, body forbidden, policy rejected |
| `manual consistency repair` | durable invariant is broken;automated retry may duplicate or hide damage | missing stored result, missing payload snapshot, commit unknown |
| `manual/config repair` | runtime binding or external target configuration must change | target disabled, invalid config, permanent publisher failure |

---

## 12. 审计 / relay / marker / stored result 写入规则

| Error / branch | Change / audit / trace | Relay item | Projection marker | Reference marker | Handoff marker/material | Stored result / report |
|---|---|---|---|---|---|---|
| accepted truth command | required change/audit/trace per Step 9 | append committed change + payload snapshot | mark affected states stale when formal | none unless flow says | none unless command is handoff-related future flow | command result saved before idempotency complete |
| rejected command before reserve | none | none | none | none | none | optional public rejection only,no stored replay unless idempotency exists |
| rejected command after reserve | no success trace/change | none | none | none | none | command rejection saved and idempotency completed |
| duplicate command | none | none | none | none | none | replay stored result/rejection |
| query not visible / degraded / missing | none | none | none | none | none | none |
| accepted inbound consumer | optional marker trace only when Step 9 says | none unless derived-state committed change formal | stale marker when affected refs formal | save resolution state/mirror/refresh record | none | inbound receipt saved |
| unsupported inbound schema | none | none | none | none | none | unsupported receipt if formal dedup context exists |
| inbound duplicate | none | none | none | none | none | replay stored receipt |
| relay publish success | none | update publication state only | none | none | none | batch result only,no stored command/job result |
| relay publish retryable/failed | none | update relay marker with pending version | none | none | none | batch result only |
| rebuild projection success | none unless derived change relay formal | optional derived state relay | save view/state | none | none | job report saved |
| rebuild projection failure | none | none unless formal failure event exists | failed/unavailable state when job owns it | none | none | failed/partial job report |
| reference refresh success/failure | refresh record | optional derived state relay when stale marker formal | stale marker when affected refs formal | save reference state/mirror/refresh record | none | job report/receipt saved |
| reconciliation gap/failure | none | optional derived/report state relay when formal | report state | none | none | reconciliation report + job report |
| handoff prepared/delivered/failed | handoff trace only when flow appends formal trace | optional traceability relay when formal | none | none | handoff record/material/outcome | job report saved |
| consistency defect | no business trace unless formal operations issue exists | no new business relay | no synthetic marker | no synthetic marker | no synthetic marker | fail fast or failed job report with redacted issue refs |

Write rule red lines:

- Rejected / invalid / not-visible branches do not write success audit/trace/relay.
- Failure records must be body-free and redacted.
- Missing durable side effect must not be hidden by writing a new success marker after the fact.
- Step 15 may add observability logs/metrics, but those are not domain audit records.

---

## 13. Delayed / rejected / quarantined / failed semantics

| Surface | Meaning | Writes | Retry |
|---|---|---|---|
| `Rejected` command | request is invalid, forbidden or business-rejected before accepted truth mutation | stored rejection only when idempotency branch requires replay | no same input retry |
| `NotVisible` query | actor cannot see body | no write | retry only with different actor/scope/state |
| `Degraded` query | body is visible but source/projection/reference is incomplete/stale/unavailable | no write | run maintenance/refresh separately |
| inbound `Delayed` | upstream ref/source not ready or temporary dependency unavailable | delayed receipt;optional pending/reference state only when flow permits | retry later |
| inbound `Rejected` | valid schema but policy/selector/body relation rejected | rejected receipt if possible | no same payload retry |
| inbound `UnsupportedSchema` | schema cannot be processed | unsupported receipt if envelope permits | retry after version support upgrade |
| inbound `Quarantined` | unsafe/dedup-conflicting payload relation | quarantined receipt | manual review |
| relay retryable | publication attempt failed transiently | retryable marker | future scan |
| relay failed/terminal | item cannot be published without config/manual repair | failed/dead-letter style marker by Step 13 | manual/config repair |
| job `PartiallyCompleted` | some item changes committed and some failed | stored report with changed/failed refs | retry selected failed refs |
| job `Failed` | no useful completion or fatal accepted job failure | stored report when possible | retry/manual depending cause |

Semantic separation:

- `Rejected` is an input/business classification,not a transport dead-letter by itself.
- Relay terminal failure is technical publication state,not artifact truth state.
- `Quarantined` is safer than `Rejected` when dedup conflict or unsafe payload relation needs operator inspection.
- `Delayed` is not success;it promises no core truth mutation.

---

## 14. Consistency defect catalog

| Defect | Detected at | Required mapping | Forbidden repair |
|---|---|---|---|
| completed idempotency points to missing stored result | duplicate replay | `InvariantViolation` / duplicate result missing issue;manual repair | recompute current truth response |
| stored result kind mismatches operation family | typed result getter | `InvariantViolation`;manual repair | coerce result variant |
| relay item points to missing payload snapshot | relay publisher | failed/retryable marker and consistency issue | rebuild payload from truth |
| payload snapshot deserialization fails | relay publisher | relay failed + consistency issue | publish current reconstructed payload |
| projection lookup/index missing for formal source | query/job lookup | degraded query or failed job item | create view ref from string |
| derived view cursor newer than source cursor | query/job consistency check | `InvariantViolation`;manual repair | silently downgrade cursor |
| reference state resolved but snapshot ref missing | reference query/job | degraded/unavailable and consistency issue | fabricate mirror snapshot |
| handoff report points to missing material | handoff delivery/duplicate report | failed job / consistency issue | rebuild material from truth without job |
| append-only record mutated in place | repository contract test/runtime check | consistency issue | accept mutated audit/history |
| forbidden external body persisted | repository/serialization audit | boundary violation / consistency issue | keep body and mark redacted only |
| UoW commit unknown with no idempotency/result visibility | commit recovery | commit unknown issue;manual reconciliation | blind retry mutation |

Consistency defect rules:

- Consistency defects are not normal business rejection.
- A consistency defect may surface to API/query/job as degraded/dependency unavailable with redacted issue refs, but internal handling must preserve manual repair classification.
- Tests in Step 16 must include negative cases for missing stored result, missing relay payload and query no-write repair attempts.

---

## 15. Error anti-patterns

| Anti-pattern | Risk | Required approach |
|---|---|---|
| map all errors to `ApplicationError::DomainRejected` | hides retry/manual recovery class | preserve domain/application/port/protocol layer |
| use domain error for repository failure | business object depends on infra | map repository failure in application |
| parse `ApplicationError.message` for resolver state | adapter text becomes state machine | use `ArtifactReferenceRefreshResolution<T>` |
| treat query degraded as command rejection | read path becomes write/control path | return `ArtifactQuerySurface` |
| rebuild projection in query | hidden mutation and inconsistent tests | return stale/degraded;run job separately |
| recreate stored result on duplicate | duplicate response may drift | load stored result by ref |
| rerun job body when duplicate report missing | duplicates side effects | consistency defect/manual repair |
| republish relay after mark conflict | can duplicate outbound event | reload pending item state first |
| rebuild relay payload from current truth | emitted event no longer matches accepted transition | publish stored payload snapshot only |
| convert handoff failure into truth state | external target controls artifact truth | write handoff record/report only |
| store raw external body in error/receipt/report | ownership and privacy breach | store redacted issue refs/body-free refs |
| silently swallow `InvariantViolation` in fake | implementation hides design defect | fail fast and test the defect |
| create new protocol rejection code in API adapter | contracts drift | reopen Step 8/12 before adding code |
| use runtime config error as domain state | deployment issue pollutes truth | fail startup/job/runtime boundary |

---

## 16. 前序契约回填

| Formal section target | 回填内容 | Source |
|---|---|---|
| `03-详细设计.md` §5 domain object | `ArtifactDomainError` 只表达 invalid transition、missing ref、boundary violation、policy rejected、duplicate truth anchor | §8.1 |
| `03-详细设计.md` §5 application service | `ApplicationError` 按 orchestration / port / consistency failure 使用;command expected rejection 走 stored rejection surface | §8.2、§9.1 |
| `03-详细设计.md` §7 protocol | command rejection、query degraded/not-visible、inbound receipt、job disposition 映射规则 | §8.4、§9 |
| `03-详细设计.md` §8 flow | 每类异常分支的 rollback / stored result / marker / relay rules | §10、§12 |
| `03-详细设计.md` §10 persistence | duplicate result missing、payload snapshot missing、commit unknown、projection lookup corruption 的 consistency defect mapping | §11、§14 |
| `03-详细设计.md` §11 error recovery | error type table、mapping table、exception branch table、recovery classification、anti-pattern | §8~§15 |

---

## 17. Cross-step closure audit

| Audit item | 结论 | 说明 |
|---|---|---|
| Step 6 domain/application error carrier 是否闭口 | pass | §8.1 / §8.2 使用 Step 6 已定义 code family,未新增 enum variant |
| Step 7 port failure 是否有映射 | pass | §8.3 / §9 覆盖 repository、UoW、idempotency、resolver、relay、handoff、runtime failure |
| Step 8 protocol surfaces 是否有错误映射 | pass | §8.4 / §9 覆盖 command rejection、query surface、inbound receipt、job disposition |
| Step 9 exception branch 是否有 transaction rule | pass | §10 / §12 固定 rejected、duplicate、consumer、relay、job、handoff 分支 |
| Step 10 invalid transition 是否映射到具体错误 | pass | `InvalidStateTransition` -> command rejection / job failed item |
| Step 11 consistency failure 是否有 recovery | pass | §11 / §14 覆盖 missing result、missing payload、commit unknown、projection lookup defect |
| Duplicate replay 是否禁止重跑 mutation/job | pass | §9.1 / §9.3 / §9.5 / §11 |
| Query no-write 是否保持 | pass | §9.2 / §12 |
| External body boundary 是否保持 | pass | §8.1 / §9.3 / §15 |
| Relay/handoff failure 是否不回滚 truth | pass | §9.4 / §9.6 / §12 |

---

## 18. Step 13 handoff

| Step 13 topic | Handoff detail |
|---|---|
| idempotency key/digest | same digest duplicate replay、different digest conflict、in-progress reservation、missing result consistency defect |
| retry policy | retryable / delayed / manual categories from §11 |
| relay worker concurrency | marker version conflict、publish success but marker update conflict、missing payload handling |
| job partial commit | `PartiallyCompleted` report semantics and failed ref retry |
| dead-letter policy | relay terminal failure and inbound quarantined semantics need retry/dead-letter thresholds |
| commit unknown | idempotency/result lookup and reconciliation requirement |
| operator recovery | consistency defects in §14 need explicit manual runbook/test cuts |

---

## 19. Stop-review checklist

| Checklist item | 结论 | Evidence |
|---|---|---|
| 错误层级已覆盖 domain/application/port/api/query/worker/jobs | pass | §7 |
| 错误类型表已覆盖 domain、application、port、protocol/job/worker | pass | §8 |
| Command / Query / Inbound / Relay / Job / Handoff 映射已覆盖 | pass | §9 |
| 异常分支处理表已覆盖 rollback/stored result/marker side effects | pass | §10 |
| 恢复口径已区分 retryable / delayed / non-retryable / manual | pass | §11 |
| 审计 / relay / marker / stored result 写入规则已闭口 | pass | §12 |
| delayed / rejected / quarantined / failed semantics 已区分 | pass | §13 |
| consistency defect catalog 已覆盖 Step 11 handoff | pass | §14 |
| anti-pattern 已列出实现红线 | pass | §15 |
| Step 13 handoff 已明确 | pass | §18 |

---

## 20. 回填草稿

以下内容供 Step 19 装配正式 `03-详细设计.md` 时使用,不得在 Step 19 前直接改正式文档。

```markdown
## 11. 错误模型、异常分支与恢复口径

### 11.1 错误层级
- Domain 使用 `ArtifactDomainError` 表达 invalid transition、missing required reference、boundary violation、policy rejected 和 duplicate truth anchor。
- Application 使用 `ArtifactApplicationError` 表达 persistence、reference、idempotency、relay/handoff 和 invariant failure。
- API command 的可预期拒绝返回 `ArtifactCommandOutcome::Rejected` / `ArtifactProtocolRejection`。
- Query not-visible / stale / degraded 是 query surface,不是 hidden write 或 command rejection。
- Worker inbound event 使用 receipt disposition;operations job 使用 job run disposition and stored report。

### 11.2 Mapping and recovery
- Same idempotency key + same digest duplicate 只 replay stored result/receipt/report。
- Same idempotency key + different digest maps to duplicate conflict / quarantined / rejected.
- Resolver business outcome drives reference state;resolver call failure does not.
- Relay publisher only updates relay item marker and never rebuilds payload from current truth.
- Handoff failure updates handoff record/report and never mutates artifact truth.

### 11.3 Consistency defects
- Missing stored result, missing relay payload snapshot, projection lookup corruption, prepared material missing, commit unknown and forbidden persisted body are consistency defects.
- Consistency defects require manual/operator repair or a future formal recovery job;implementation must not silently repair them from current truth.
```

---

## 21. Step 完成记录

| 项目 | 结论 |
|---|---|
| 是否修改正式 `03-详细设计.md` | 否 |
| 是否新增未闭口 enum / port / DTO | 否 |
| 是否沿用 L1-governance 粒度 | 是,按 L1-artifact 自身对象和协议重写 |
| 是否发现新的标准经验 | 暂无;当前标准已覆盖错误模型、duplicate result、query no-write、payload snapshot 和 consistency defect 的同类经验 |
| 下一步 | Step 13 `03_ddd_step_13_concurrency_idempotency.md`:并发、幂等与重入保护 |

---

## 22. 进入下一步条件

Step 12 已完成。进入 Step 13 前需要用户确认:

```text
Step 13 定义并发、幂等与重入保护
```
