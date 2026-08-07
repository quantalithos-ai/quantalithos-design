# L2-tools 03 详细设计 Step 13: 并发、幂等与重入保护

> 创建日期: 2026-08-05
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 回填章节: 正式 03 §12 并发、幂等与重入保护
> 对标粒度: `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 12 `completed / pass`；错误 code、retry/manual/unknown owner 和 37 flow exception matrix 已闭合。 |
| 直接输入 | Step 6 stable carriers/idempotency objects、Step 7 Store/UoW seams、Step 8 protocol metadata、Step 9 flows、Step 10 state matrix、Step 11 persistence、Step 12 recovery。 |
| 本步模块顺序 | namespace/key -> canonical digest -> mutable concurrency -> duplicate/replay -> side-effect re-entry -> jobs/projection/reference/status -> test/closure。 |
| 物理实现 | 不选择 hash crate、数据库锁、broker、scheduler、lease backend 或 retry interval；只定义可计算 logical contract。 |
| 外部 blocker | `L2T-UP-001~009` 继续开放；positive provider/route/receipt/observation/SDK/readiness 不得由 retry 或 idempotency 推断。 |
| 正式回填 | 本步只写中间产物；正式 §12 仅在 Step 19 整体装配。 |
| 提交 | 不需要，也未获授权。 |

## 1. 本步目标与边界

本步把并发写入、重复 Command、重复 Consumer、Event continuation 重入、Job 重跑、projection
rebuild、reference/status refresh 和 commit/call unknown 收束为实现者可直接编码的保护规则。
目标不是承诺 exactly-once 的外部交付，而是保证 L2 本地 truth 不分叉、外部 side effect 有明确
call fence、重复输入只能 replay/显式 conflict，且 late material 不穿越修改历史 invocation/outcome。

本步不定义：幂等记录保留时长、锁产品、hash 算法具体实现、HTTP/RPC 状态数字、DLQ 名称、
worker backoff、scheduler lease、日志字段和告警阈值；这些由 Step 14~16 和实现 adapter 绑定。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些流会并发修改同一资源？ | Contract/Binding lifecycle、Invocation admission、Handoff/Attempt、ConsistencyGap、projection/ref/status maintenance 和 idempotency claim 都可能并发；Query 永远只读。 |
| 哪些接口会重复调用？ | 13 Command、5 Consumer、4 outbound continuation、4 Job 都按 at-least-once/客户端重试模型处理；Query 不建幂等记录。 |
| 幂等键来自哪里？ | Command 来自 `CommandMetadata.idempotency_key`；Consumer 来自 envelope 的 `(consumer, source_authority, source_event_id, dedup_key)`；OF continuation 来自 `(material,event,target,continuation_key)`；Job 来自 `JobMetadata.job_key`。 |
| 数据库唯一键是否替代幂等？ | 否。semantic unique key 防止 business duplicate；`IdempotencyStore` 保存 typed result/receipt/report，负责 exact replay。 |
| 重复输入如何处理？ | 同 scope/key/digest 已提交 -> 读取 immutable stored surface；同 key 异 digest -> `IdempotencyConflict`；in-flight -> retry-same-input/unavailable；prepared/unknown side effect 不自动重调。 |
| 并发冲突如何测试？ | 覆盖 expected-version、unique conflict、claim race、result missing、commit unknown、event redelivery、dual publisher、projection watermark race、reference/status race 和 handoff fence。 |

## 3. 当前材料问题诊断

| 材料 | 缺口/冲突 | 当前处理 |
|---|---|---|
| Step 6 `IdempotencyRecord` | key/digest 生命周期已定义，但没有完整入口矩阵。 | 本步按 Command/Consumer/OF/Job 分组列出。 |
| Step 8 metadata | metadata 字段已闭合，digest 排除项需集中声明。 | 固定 canonical frame；不把 request/trace/time/transport 纳入 digest。 |
| Step 9 flow | 各 flow 有 duplicate/reentry 片段，跨 family 的 late material/unknown 顺序分散。 | 统一 duplicate matrix、reentry matrix 和 phase fence。 |
| Step 11 persistence | CAS、semantic key、UoW 已闭合，具体竞争场景未成表。 | 按资源、winner、loser、错误和恢复 owner 展开。 |
| Step 12 recovery | retry/manual 分类已闭合，不能被实现侧扩大为盲重试。 | 本步只细化何时可同 key 重入，保持 unknown/manual 红线。 |
| 旧 README/正式 03 | 旧 retry/cache/queue/executor 假设与当前边界冲突。 | `historical_material`，不继承 cache/lock/queue truth。 |

## 4. 设计取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| 幂等身份 | `scope + key + canonical digest` | 同一 raw key 可在不同 operation/actor/source scope 独立使用。 |
| 结果来源 | immutable stored value/error/receipt/report | 当前 mutable truth 变化不能改变历史响应。 |
| mutable 并发 | adapter-issued `Loaded<T>.expected_version` | 禁止 last-write-wins、硬编码版本或使用时间戳/Cursor CAS。 |
| append 并发 | semantic unique key + canonical equality | equal duplicate 可复用；divergent duplicate 显式冲突。 |
| side effect | Prepared marker + one post-commit Port call + phase-2 disposition | 本地可证明一次 fence，不能承诺下游 exactly-once。 |
| Job 并发 | claim first + bounded slice + per-item version | 避免两个 worker 扫描/写同一页并互相覆盖。 |
| late material | 新 assessment/ref/gap/fact | 后到材料不能改写旧 invocation/outcome/admission。 |

## 5. Canonical namespace, key and digest contract

### 5.1 Namespace rule

`IdempotencyScope` is the complete namespace tuple:

```text
(entry_kind, operation_name, actor_or_source_authority, optional_consumer_context)
```

The `IdempotencyKey` is compared only inside this scope. `CommandMetadata.idempotency_key`,
`ConsumerMetadata.idempotency_key`, continuation `ContinuationKey` and `JobMetadata.job_key` are
validated bounded newtypes; application does not concatenate strings to create a new identity.

| Entry | Scope | Key source | Scope exclusions |
|---|---|---|---|
| Command | `(Command, ToolCommandName, actor_ref/authority)` | `CommandMetadata.idempotency_key` | transport route, client library, SDK identity |
| Consumer | `(Consumer, ToolInboundConsumerName, source_authority_ref)` | envelope-derived dedup key | broker delivery attempt, received time |
| Outbound continuation | `(Continuation, event_name, target_class, source_authority)` | `ContinuationKey` plus material identity | physical route/topic, retry counter |
| Job | `(Job, ToolJobName, system_actor.authority_ref)` | `JobMetadata.job_key` | scheduler run ID, wall-clock request time |
| Query | none | none | Query never writes/replays an idempotency record |

### 5.2 Canonical digest frame

`CanonicalRequestDigest` is computed from a typed, deterministic frame. The exact hash function is an
implementation detail; the field set is not.

| Frame input | Included? | Rule |
|---|---:|---|
| operation/consumer/job/event semantic name | yes | closed enum variant, not arbitrary string |
| protocol schema version | yes | distinguishes incompatible public schema |
| typed request body fields | yes | sorted sets and maps use canonical order |
| actor effective authority/scope | yes | only the authority relevant to decision scope |
| source authority/event/version/correlation | yes for Consumer/OF | source identity cannot be dropped |
| tool/binding/invocation/material/attempt refs | yes when request semantics include them | exact typed refs, no display names |
| page filter/scope/limit/cursor selector | yes for Job/continuation where it changes target set | cursor is input identity, not row version |
| requested source watermark | yes for Job/projection maintenance | preserves bounded read frame |
| expected semantic revision guard | yes when it changes acceptance | e.g. expected current definition revision |
| idempotency key | no | key selects record; digest detects key reuse |
| request ID / trace ID / correlation metadata | no, except source correlation where protocol semantics require it | transport identity must not cause a duplicate |
| submitted/received/requested/current time | no | timestamps are metadata, not business input |
| retry count / delivery attempt / scheduler run ID | no | replay must remain same semantic request |
| random generated IDs created inside flow | no | generated identity belongs to result, not request digest |
| raw prompt/provider/capture/secret/body | never | forbidden-body boundary |

Canonicalization rules: absent and explicit empty are distinct unless the owning protocol explicitly
defines `FormallyEmpty`; typed enum variants are not string aliases; vectors are sorted only when the
schema defines them as sets; numeric newtypes use canonical decimal/binary representation; unknown
fields are rejected rather than ignored. A digest mismatch is a conflict, not a new version.

### 5.3 Semantic uniqueness versus idempotency

| Subject | Semantic unique key | Idempotency role |
|---|---|---|
| contract | `tool_id`; definition `(tool_id,revision)` | repeated Establish/Adopt command replay |
| compatibility impact | `(tool,base,target,basis_digest)` | repeated assessment replay |
| binding | current relation by tool; change fact correlation/kind | repeated Declare/Replace/Invalidate replay |
| invocation | `invocation_id` and caller digest | same Submit command returns same admission |
| admission | `(invocation_id, admission_kind)` | no second canonical admission |
| outcome/audit | terminal `invocation_id` pair | equal pair replay; divergent terminal conflict |
| safe material | `(eligibility,target,content_digest)` | CF-12 duplicate does not create material twice |
| external attempt | `(material,event,target)` | OF duplicate does not call Port twice |
| status ref | `(attempt,authority,source_revision,status_digest)` | equal feedback append; conflict is gap |
| gap | canonical open-gap key | repeated detection reuses/open-gap CAS |
| projection | `(subject,scope,schema,watermark selector)` | Job replay/report, not business idempotency |

## 6. Concurrent resource matrix

| Scenario | Conflict resource | Winner control | Loser result | Recovery/test cut |
|---|---|---|---|---|
| two Establish commands for same semantic tool | contract identity/definition key | idempotency claim + unique key | duplicate replay or uniqueness conflict | reload/new key only if semantic input changes |
| Adopt vs Retire same contract | contract + current definition versions | expected version on loaded bundle | `VersionConflict` / invalid state | explicit re-read; never last-write-wins |
| two candidate definitions same revision | definition semantic key | append equality/conflict | `ExistingEqual` or integrity conflict | no overwrite of immutable revision |
| Declare/Replace Binding race | current binding relation | relation expected version + unique current index | version/unique conflict | re-read current relation; no partial successor |
| Consumer clue vs Binding Command | binding relation vs snapshot/assessment | Consumer cannot mutate relation; assessment append key | independent assessment/gap | no relation invalidation inference |
| two SubmitToolInvocation calls | invocation/admission key | idempotency reserve + invocation semantic key | exact replay/in-flight/conflict | no second admission |
| precondition evaluation vs source feedback | invocation-bound assessment | immutable append semantic key | new assessment/gap | old assessment remains unchanged |
| two handoff preparations | handoff generation/attempt key | prepared marker + expected version | existing Prepared/terminal view | manual if call ambiguity |
| phase-2 attempt saves race | attempt version | `Loaded<Attempt>.expected_version` | version conflict; no second Port call | recovery owner resolves marker |
| AcceptExecutionSource duplicate/late | terminal outcome pair | pair semantic key | equal replay or terminal conflict | late source becomes assessment/gap |
| two safe-material preparations | eligibility/material key | append semantic key + idempotency | equal material/replay | no body reconstruction |
| two OF workers same material/event | external attempt key | `find_attempt_for_event` + phase-1 claim | existing Prepared/terminal; zero second call | unknown/manual only |
| Bus and Observation feedback race | separate status-ref keys | independent append keys | preserve both refs; conflict gap | attempt remains unchanged |
| gap resolution vs new gap detection | gap expected version/open key | CAS + canonical key | version conflict/new assessment | re-read owner and basis |
| projection stale mark vs rebuild | projection source watermark/version | watermark monotonicity + expected version | stale write result/failed item | older build cannot overwrite newer source |
| two projection Jobs same target | projection row + job key | job claim + projection CAS | duplicate report/version conflict | retry bounded failed item |
| two reference/status refresh Jobs | ref/attempt status row | item expected version | partial item conflict | next Job reads current version |
| two Job runners same key | idempotency record | claim reservation | in-flight or exact report replay | no target enumeration on duplicate |
| commit unknown after local atomic write | claim/result/subject visibility | same-authority `resolve_commit` | unresolved/manual | same key audit only |

## 7. Idempotency key matrix

“Window” below is logical, not a duration: the record remains authoritative while its referenced
truth/result must be replayable. Retention duration is a later configuration/operations decision and
must never expire before the corresponding replay obligation can be satisfied.

### 7.1 Commands `CF-01`~`CF-13`

All Command records use `(Command, command_name, actor authority, metadata.idempotency_key)` as the
scoped key. The table lists the additional stable digest fields that distinguish the semantic input.

| Command | Digest-specific fields | Window | Duplicate handling |
|---|---|---|---|
| `EstablishToolContract` | identity intent, initial revision, definition intent/source, binding mode | contract replay horizon | replay `ToolContractView`; never allocate new tool ID |
| `AssessToolDefinitionChange` | tool, candidate revision/body/source, protected consumer scope | definition/impact horizon | replay exact impact; no second candidate/assessment |
| `AdoptToolDefinitionRevision` | tool, expected current revision, candidate revision, impact ref, closure ref, reason | contract history horizon | replay adopted view; no second pointer switch |
| `RetireToolContract` | tool, action, closure/reason | contract history horizon | replay pending/retired view; no repeated fact |
| `DeclareCapabilityBinding` | tool, mode/Hub candidate, reason | binding history horizon | replay Binding view; no second current relation |
| `ReplaceCapabilityBinding` | existing binding, successor identity intent, target, reason | binding history horizon | replay successor view; no partial/new successor |
| `InvalidateCapabilityBinding` | binding, reason | binding history horizon | replay terminal view; no second change fact |
| `SubmitToolInvocation` | invocation identity intent, tool/revision guard, safe intent/context/arguments | invocation/outcome horizon | replay exact admission/no-execution value/error; no new invocation |
| `EvaluateExecutionPreconditions` | invocation, selector, requested carrier, constraint inputs | invocation/outcome horizon | replay assessment/no-execution surface; no second Port call |
| `PrepareExecutionHandoff` | invocation, requirement/readiness/authorization refs, selected carrier/handoff inputs | attempt recovery horizon | replay terminal view; Prepared/unknown returns existing/manual, no Port call |
| `AcceptExecutionSource` | invocation, source event/authority/version/ref/class, safe semantic input | invocation/outcome horizon | replay outcome/audit or stored conservative error; no second mapping/pair |
| `PrepareSafeExternalHandoff` | exact source selector, target, sensitivity/redaction profile | material/attempt horizon | replay eligibility/material/attempt view; OF owns any existing attempt |
| `RecordConsistencyGapResolution` | gap, evidence/ref locator, owner/revision/basis | gap history horizon | replay pending/resolved view; new evidence needs new key |

### 7.2 Consumers `IF-01`~`IF-05`

Consumer normalized key:

```text
(consumer_name, source_authority_ref, source_event_id, deduplication_key)
```

The digest includes schema version, correlation/source revision and the exact typed safe payload. It
excludes `received_at`, broker delivery attempt, transport headers and worker identity.

| Consumer | Additional digest frame | Duplicate behavior |
|---|---|---|
| `ConsumeHubCapabilityChangeClue` | capability ref/change class/source revision/safe locator | replay receipt; no Hub Port or reverse page |
| `ConsumeAuthorizationResultChangeClue` | result/subject/revision/change class | replay receipt; no authorization Port |
| `ConsumeSandboxExecutionSource` | invocation/handoff/source class/ref/revision/safe semantic input | replay receipt; no `CF-11` re-entry or source Port |
| `ConsumeBusDeliveryStatusFeedback` | attempt, delivery locator/ref/status/revision | replay receipt; no status append/Port |
| `ConsumeObservationStatusFeedback` | attempt, observation locator/material/status/source/route revisions | replay receipt; no observation append/Port |

Same normalized key with a different digest is quarantined/conflict and performs zero target writes.
Unsupported schema is rejected before payload parsing and does not reserve a successful receipt.

### 7.3 Outbound continuations `OF-01`~`OF-04`

| Continuation | Scoped key | Digest | Duplicate behavior |
|---|---|---|---|
| `ToolContractChanged` | material ID + target + `ContinuationKey` | event name/schema/ID, material class, exact evolution refs, target | return existing attempt view; zero collaboration calls |
| `CapabilityBindingChanged` | material ID + target + key | event branch (formal change XOR gap), exact source refs, target | return existing attempt; no relation mutation |
| `ToolOutcomeAuditMaterialAvailable` | material ID + target + key | exact outcome/audit pair refs, event identity, target | return existing attempt; no pair reload to rebuild payload |
| `ToolConsistencyGapChanged` | material ID + target + key | gap ref/state/source refs, event identity, target | return existing attempt; no gap resolution inference |

`ToolEventId` is deterministic over event name, schema version, source material ID and canonical source
truth refs. A new schema version creates a distinct event/attempt identity; changing physical route,
retry counter or worker does not. `ExternalSubmissionAttempt` key `(material,event,target)` is the
second fence. Existing `Prepared` or `SubmissionOutcomeUnknown` is not eligible for automatic call.

### 7.4 Jobs `JF-01`~`JF-04`

Job scoped key is `(Job, job_name, system_actor.authority_ref, JobMetadata.job_key)`. Digest includes
the job request, bounded scope/page selector and requested source watermark; it excludes requested time,
scheduler run/lease identity and retry counter.

| Job | Digest-specific fields | Duplicate report |
|---|---|---|
| `CheckCapabilityBindingConsistency` | non-empty canonical tool ID set, source watermark, page/cursor/limit | replay original counts/output/gap refs; no Hub Port/reverse scan |
| `CheckReferenceIntegrity` | exact inspection scope/refs, watermark, page/cursor/limit | replay report; no source reads/report rebuild |
| `RebuildToolDerivedViews` | projection kind set, exact target scope, watermark, page/cursor/limit | replay report; no projection target enumeration/write |
| `RefreshExternalStatusRefs` | attempt scope, feedback class/mode, watermark, page/cursor/limit | replay report; no Bus/Observation Port call |

When a bounded report contains a `next_cursor`, continuing the next page is a new Job input and must
use a new job key with the prior cursor/watermark explicitly included. Reusing the old key returns the
old report; it does not advance the cursor.

## 8. Duplicate and claim-state matrix

| Existing record/state | Incoming digest | Service behavior | Public result |
|---|---|---|---|
| none | valid | reserve atomically; only winner enters flow | normal accepted/rejected/blocked result |
| `Claimed`, same digest | same | do not steal/continue except named same-lease phase | retry-same-input/in-flight or existing Prepared view |
| `Claimed`, different digest | different | no mutation | `IdempotencyConflict` |
| `Committed`, same digest, correct stored kind | same | load exact stored surface and verify candidate/receipt/refs | duplicate replay / `NoOpDuplicate` / duplicate receipt |
| `Committed`, different digest | different | no mutation | `IdempotencyConflict` |
| `Committed`, result missing/wrong kind | same | no recompute or cast | `DuplicateResultMissing`/manual integrity |
| `Aborted`, same digest | same | only an explicit expiry/recovery policy may create new claim | unavailable/manual by default |
| commit candidate visible but receipt unconfirmed | any | do not describe as committed | resolve commit/manual |
| query repeated | n/a | execute current authorized read | current query surface; no record |

### 8.1 Claim continuation rules

`IdempotencyRecord::continue_claim(lease_ref, phase, time)` is legal only when scope, key, digest,
operation, actor/source and named phase marker match the original record. It never renews or steals an
ambiguous claim. The only current multi-phase uses are:

| Flow | Phase marker | Legal continuation | Illegal continuation |
|---|---|---|---|
| Consumer `IF-*` | durable Consumer claim | phase-2 effect/receipt with same source frame | new envelope/digest or second observational call after completed receipt |
| `CF-10` | committed handoff + `ExecutionHandoffAttempt::Prepared` | phase-2 disposition after exactly one Port response | repeat submit from Prepared/unknown on generic re-entry |
| `OF-*` | committed material + `ExternalSubmissionAttempt::Prepared` | phase-2 local submission disposition | repeat collaboration submit from existing marker |
| Job `JF-*` | durable Job claim and exact bounded target plan | per-target UoW and final report under same lease | expand scope/change watermark or reuse lease for another Job request |
| `IF-03` | Consumer claim + deterministic derived `CF-11` key | replay/commit exact CF-11 then Consumer receipt | derive a different Command key or bypass CF-11 |

## 9. Re-entry protection matrix

| Scenario | Re-entry source | Protection | Recovery |
|---|---|---|---|
| client timeout after accepted Command commit | client retry | same Command scope/key/digest and stored result | exact replay; no new fact/Port call |
| timeout after committed semantic rejection | client retry | stored error snapshot + result ref | replay exact error; no source re-resolution |
| concurrent retry while first Command in UoW | parallel caller | atomic reserve/in-flight classification | retry same key later |
| same Command key with changed body | caller bug | digest conflict | use original request or explicit new key |
| local commit outcome unknown | connection/storage ambiguity | same transaction ref resolution + same key audit | no business rerun until rolled back proven |
| Consumer redelivery | bus/source at-least-once | envelope-derived key/digest + stored receipt | replay receipt; no Port/page/re-entry |
| Consumer same event ID altered payload | upstream defect | digest conflict/quarantine | upstream correction/new formal event |
| Worker crash after Consumer claim before effect | process crash | durable claim; no second winner | named recovery continues only if no side effect ambiguity |
| crash after `CF-11` before IF-03 receipt | process crash | CF-11 derived key replays result; Consumer claim remains | complete receipt without rerunning source map |
| crash after Prepared commit before Port call | process crash | marker does not prove call absence unless explicit call-not-started state exists | manual/named recovery; generic worker does not call |
| crash after Port call before phase-2 save | ambiguity | Prepared/claim + external correlation | `SideEffectOutcomeUnknown`, manual; no second call |
| duplicate OF continuation | worker redelivery | attempt semantic key + continuation claim | return existing local view |
| Job duplicate same key | scheduler/operator | stored JobReport | `NoOpDuplicate`; no target reads |
| Job crash after some target commits | process crash | per-target semantic keys/version + incomplete claim | new key may process explicit remaining cursor; old key remains unresolved/report-aware |
| projection rebuild races stale marker | Command + Job | source watermark monotonicity | newer source/stale wins; older build returns stale |
| late source material after terminal outcome | external delay | terminal outcome key + append-only assessment/gap | preserve terminal outcome; report conflict/gap |
| late Hub/auth/status clue | external delay | immutable consumption snapshot/ref key | append new assessment/ref; never rewrite old anchor |

## 10. Commit and side-effect unknown re-entry

### 10.1 `CommitOutcomeUnknown`

```text
original operation + same scope/key/digest
  -> begin audit-only UoW if required
  -> IdempotencyStore::get/reserve under the same scope
     -> committed result: rollback audit UoW, replay exact surface
     -> in-flight: return unavailable/retry-same-input; no mutation
     -> digest conflict: return conflict; no mutation
     -> no record: call same-authority resolve_commit(transaction_ref) if ref is available
        -> committed: load and verify stored result/refs; replay only if symmetry passes
        -> rolled back: explicit owner may re-enter same key and flow
        -> unknown: remain manual/incomplete; no new key, no Port call
```

The application never treats an adapter-returned `CommitCandidate` as committed. If a previous UoW
may have written an external side-effect marker, the unknown path is not eligible for an automatic
business re-entry even after local idempotency appears absent; a named recovery owner must establish
whether the marker/call crossed its fence.

### 10.2 Side-effect call ambiguity

| Point | Persisted marker | Allowed automatic action | Required public surface |
|---|---|---|---|
| before Prepared commit | no attempt | none | deterministic precondition/error |
| Prepared commit confirmed, Port not called by proven local guard | Prepared | only the named recovery flow may decide; generic retry forbidden | Awaiting/manual |
| Port returned valid local response | attempt terminal local state | phase-2 CAS save and replay completion | local attempt view; no delivery claim |
| Port returned `SideEffectOutcomeUnknown` | unknown attempt/gap | no second call | unavailable/integrity + manual owner |
| phase-2 CAS conflict | attempt may be advanced by another worker | reload attempt; if terminal, replay; if unknown, manual | conflict/unknown |

## 11. Projection, reference, status and handoff concurrency

### 11.1 Projection stale/rebuild race

| Operation | Read token | Write guard | Losing operation |
|---|---|---|---|
| truth-changing Command marks affected page stale | source `LocalTruthWatermark` + dependency cursor | subject/schema/source watermark + projection compare token in same command UoW | rollback if required stale mark fails; next page becomes gap |
| projection Job rebuilds target | source watermark and exact target ref | projection write token + source watermark monotonicity | `ProjectionWriteResult::Stale`; no source mutation |
| two rebuild Jobs same target | each target row version | first valid CAS wins | second reports item conflict/stale; no duplicate truth |
| query reads during rebuild | persisted projection state | none | returns `Rebuilding`/`Stale`; no hidden rebuild |

An older source watermark cannot overwrite a newer projection row, even if the older Job has a later
wall-clock completion time. A `next_cursor` is a new bounded Job input, not permission to extend the
current transaction.

### 11.2 Reference and external status race

`ReferenceValidityAssessment`, `BusDeliveryStatusRef` and `ObservationMaterialRef` are append-only.
Their current/derived lookup may race, but no lookup may mutate the owning Contract, Binding,
Invocation, Outcome or Attempt. If two refs share a semantic key:

- canonical-equal content returns `ExistingEqual` and preserves the first authority timestamp;
- divergent content returns a typed integrity conflict and opens a bounded gap when an attributable
  subject exists;
- arrival order, transport delivery attempt and wall-clock latest are not tie-breakers;
- a missing/stale/blocked status is `Unknown`/`Unavailable`, never `Delivered`/`Observed`.

### 11.3 Handoff/export marker race

`ExecutionHandoffAttempt` and `ExternalSubmissionAttempt` use expected-version CAS for the local
disposition. Handoff/export jobs use a formal marker identity plus Job claim. A terminal local marker
cannot move back to `Prepared`; a delivered/failed external marker cannot be overwritten by a stale
worker. Retrying an operator action with a new Job key must reload the marker and require an explicit
legal transition; it cannot use a new key to bypass a conflict or duplicate a side effect.

## 12. Partial Job and late-material rules

| Situation | Commit policy | Report/re-entry |
|---|---|---|
| bounded page all items succeed | commit each named local slice; final report completes claim | report may carry next cursor; next page uses new key |
| some items succeed, some have retryable failures | preserve successful refs; commit failed item markers/gaps where defined | `Partial` report with typed failed refs/cursor; retry failed/remaining scope explicitly |
| fatal job dependency before target work | claim may remain incomplete or failed report if attributable | `Failed`/`Blocked`; no target enumeration on duplicate |
| report save/claim completion fails | target commits remain according to named per-item UoW | old claim unresolved; reconciliation/manual owner, no fake completion |
| late material for an existing terminal outcome | append assessment/gap/conflict | terminal outcome/audit unchanged; query exposes new assessment/gap |
| late material for an existing Prepared/unknown attempt | preserve marker | manual recovery; no automatic second Port call |
| late definition/binding change | append new fact/assessment and stale projection | historical invocation anchor remains unchanged |

## 13. Concurrency and idempotency test cuts

| Test ID | Predicate | Minimum fixture / cut |
|---|---|---|
| `L2T-CONC-001` | two same-key same-digest Commands yield one winner and one exact replay | concurrent fake `IdempotencyStore::reserve` |
| `L2T-CONC-002` | same key different digest never enters domain | digest classifier + call counter |
| `L2T-CONC-003` | same raw key under different operation scopes does not cross-replay | two Command variants, same key |
| `L2T-CONC-004` | stale `Loaded<T>.expected_version` cannot overwrite | two mutable Store loads/saves |
| `L2T-CONC-005` | semantic unique append equal vs divergent is deterministic | definition/impact/fact pair |
| `L2T-CONC-006` | Consumer redelivery replays receipt without Port/page | same envelope twice, call counter |
| `L2T-CONC-007` | Consumer altered payload with same dedup key is conflict/quarantine | same key, changed digest |
| `L2T-CONC-008` | unsupported schema is rejected before payload parse/write | parser spy and malformed body |
| `L2T-CONC-009` | IF-03 re-entry calls CF-11 at most once and replays committed result | Consumer claim + derived command key |
| `L2T-CONC-010` | OF duplicate never calls collaboration twice | `(material,event,target)` attempt key |
| `L2T-CONC-011` | Prepared/unknown does not auto-resubmit | seeded attempt marker + continuation retry |
| `L2T-CONC-012` | phase-2 attempt CAS conflict does not overwrite terminal state | two loaded attempt versions |
| `L2T-CONC-013` | Job duplicate replays report without target reads/writes | same Job key/digest and repository spies |
| `L2T-CONC-014` | Job next cursor requires new key and exact watermark | first report with cursor, second request |
| `L2T-CONC-015` | partial Job preserves successful item refs and reports failed refs | bounded mixed outcome fixture |
| `L2T-CONC-016` | dual projection rebuild older watermark cannot overwrite newer | projection fake with source watermark race |
| `L2T-CONC-017` | query during rebuild is no-write and returns structural surface | Query spies on UoW/Store writes |
| `L2T-CONC-018` | reference/status equal duplicate preserves first content; divergent opens gap | append semantic key fixture |
| `L2T-CONC-019` | handoff marker terminal transition cannot be replayed by stale worker | marker version/CAS fixture |
| `L2T-CONC-020` | commit unknown retry audits same key before any mutation | UoW fake returns Unknown then replay |
| `L2T-CONC-021` | missing stored result never reconstructs from current truth | delete sidecar, mutate subject, replay |
| `L2T-CONC-022` | late material creates new assessment/gap, not historical rewrite | terminal outcome plus late source |
| `L2T-CONC-023` | body/secret/prompt is excluded from every digest and error surface | canonical encoder/redaction fixture |

## 14. 前序契约回填与 cross-step closure

| Formal section | Required backfill | Source |
|---|---|---|
| §5 application foundation | `IdempotencyStore` namespace, claim, digest and result completion order | §§5~8 |
| §7 protocol contracts | Command/Consumer/Job key sources and digest exclusion rules | §§5, 7 |
| §8 flow contracts | duplicate/in-flight/claim continuation and side-effect re-entry rules | §§8~10 |
| §9 state/side-effect | Prepared/unknown/terminal transitions cannot be bypassed by a new key | §§9~11 |
| §10 persistence | semantic unique keys, CAS, watermark monotonicity and sidecar replay | §§5.3, 11 |
| §11 error/recovery | `IdempotencyConflict`, `DuplicateResultMissing`, `CommitOutcomeUnknown`, `SideEffectOutcomeUnknown` retry classes | §§8, 10 |
| §12 concurrency/idempotency | this Step's full key/digest/concurrency/re-entry contract | §§5~13 |
| §15 test cuts | `L2T-CONC-*` deterministic cuts | §13 |

| Audit item | Result | Evidence |
|---|---|---|
| all 13 Commands have computable scoped key/digest | pass | §7.1 |
| all 5 Consumers derive key from source envelope identity | pass | §7.2 |
| all 4 continuations have material/event/target fence | pass | §7.3, §10 |
| all 4 Jobs have bounded scope/watermark key | pass | §7.4, §12 |
| Query remains no-write/no-idempotency | pass | §§5.1, 8, 13 |
| expected-version source is adapter `Loaded<T>` | pass | §6, §11 |
| stored result/receipt/report is replay authority | pass | §§7.1~7.4, §8 |
| unknown commit/call never blindly retries | pass | §10 |
| late material cannot mutate history | pass | §§9, 12 |
| external positive contracts remain blocked | pass | §§0, 3, 10 |

## 15. 回填草稿

> 正式 `03` §12 只吸收以下收口结论；问题回答、诊断和方案比较留在本中间产物。

```text
L2-tools 的并发保护分为三层：IdempotencyScope + canonical request digest 保护入口重复，
adapter-issued Loaded<T>.expected_version 保护 mutable subject，semantic unique key 保护
append-only facts/ref/attempt。Command、Consumer、Continuation、Job 各自使用可计算的 scoped
key；Query 不建立幂等记录。

同 scope/key/digest 的已提交调用只回放 immutable StoredCommandResult、ConsumerReceipt、
ExternalSubmissionAttemptView 或 JobReport；同 key 异 digest 返回 IdempotencyConflict；in-flight
不启动第二个 writer。Prepared、CallOutcomeUnknown、SubmissionOutcomeUnknown 不自动重调外部
Port。projection/reference/status/handoff 的重入使用 watermark、reverse dependency index、
append-only ref 和 expected-version CAS；late material 形成新 assessment/ref/gap，不穿越改写
旧 invocation、admission、outcome 或 audit。
```

## 16. 待确认事项与进入下一步条件

| Item | Owner | Impact | Before implementation |
|---|---|---|---|
| digest encoding/hash implementation | implementation owner | byte-level adapter code | preserve field inclusion/exclusion and canonical ordering |
| idempotency retention/cleanup | 04/operations owner | replay horizon | never delete required replay sidecar prematurely |
| retry/backoff and dead-letter policy | transport/worker owner | runtime scheduling | cannot relax unknown/manual/no-body rules |
| positive external route/status schemas | `L2T-UP-001~006` | external side effects/status | remain blocked-aware |
| Core tools schema/SDK client seam | `L2T-UP-008~009` | cross-repo/client | no duplicate key authority |

Entry condition for Step 14 is satisfied: every repeatable entry has a computable key/digest,
concurrent mutable writes have a CAS/unique guard, duplicate/reentry outcomes are exact, and side-effect
unknown/late material paths have explicit owners. No new blocker was found.

## 17. Stop review and completion record

| Check | Result |
|---|---|
| namespace/key/digest rules | pass |
| mutable/append/projection/status concurrency matrix | pass |
| Command/Consumer/Continuation/Job idempotency keys | pass |
| duplicate/conflict/in-flight/missing-result matrix | pass |
| commit/call unknown and Prepared fence | pass |
| late material and partial Job rules | pass |
| deterministic test cuts | pass |
| historical material / blocker audit | pass; `L2T-UP-001~009` remain open |
| formal document write | closed until Step 19 |

```text
step_status = completed / pass
current_module = concurrency_idempotency:key_digest_replay_and_reentry
next_allowed_action = create 03_ddd_step_14_config_external_binding.md
formal_document_write_allowed = false
commit_required = false
```
