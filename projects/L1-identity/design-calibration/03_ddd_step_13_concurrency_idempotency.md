# Step 13. 并发、幂等与重入保护

> 对应正式文档章节: `03-详细设计.md` 第 12 章 并发、幂等与重入保护
> 当前状态: Step 13 已完成;13.0~13.5 均已写入;等待用户审核后进入 Step 14 configuration / external dependency binding
> 本文件性质: 详细设计 Step 13 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只在当前批次写当前批次内容;不得提前生成后续 Step 文件;不得直接修改正式 `03-详细设计.md`

---

## 1. 13.0 framework / input boundary / batch plan

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 13 concurrency / idempotency |
| 当前批次 | 13.5 cross-step closure / Step 14 handoff |
| 当前结论 | Step 13 已完成。已闭合并发资源、并发场景、key/digest、duplicate/in-flight/reentry priority、Step 6~12 审计和 Step 14~16 handoff |
| 本批是否完成 Step 13 跨步闭环 | 是。未发现需要新增 object、port、DTO、state、stored replay surface 或 error mapping 的 blocker |
| 下一批 | Step 14 configuration / external dependency binding |
| 停审要求 | 用户审核通过 Step 13 后进入 Step 14;若审核发现配置会改变业务 invariant、幂等、query no-write、job no-repair 或 fake parity,必须回 Step 13/14 边界重审 |

### 1.2 Step 13 总体目标

Step 13 的目标是把 L1-identity 的 command 写路径、inbound consumer / callback、operations job、outbox publish、handoff delivery、projection / reference / reconciliation maintenance 中的并发、重复调用、重入和部分失败规则收束成可实现矩阵。

实现侧必须能从本 Step 判断:

- 哪些 mutable truth、append-only record、sidecar、marker、report 和 replay surface 可能被并发写入。
- 哪些 flow 必须先 reserve idempotency,哪些 flow 必须保持 read-only。
- Command、Inbound Event / Callback、Operations Job 的幂等键来自哪里。
- `IdentityRequestDigest` 覆盖哪些稳定输入,明确排除哪些易变 metadata。
- same key / same digest 如何 replay stored command result、typed receipt 或 job report。
- same key / different digest、in-flight reservation、stored result missing/wrong-kind、commit status unknown 如何处理。
- Outbox publish、handoff delivery、projection rebuild、reference refresh、reconciliation report 和 retry propagation 如何避免重复副作用。
- Step 16 后续应如何拆出并发、幂等和重入测试切口。

本 Step 不定义幂等记录保留期、具体 hash crate、HTTP/RPC status code、worker ack/dead-letter、retry/backoff schedule、scheduler 配置、日志字段、告警规则或测试用例 ID。这些由 Step 14、Step 15、Step 16 和实施计划承接。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | 提供 `IdentityOperationContext`, `IdentityRequestDigest`, `IdentityIdempotencyRecord`, `StoredIdentityOperationResult`, `IdentityConsumerReceiptEnvelope`, `IdentityJobRunReport`, mutable truth/state object |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | 提供 `Versioned<T>`, `IdentityVersion`, repository expected-version ports, idempotency repository, stored result repository, job report repository |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | 提供 command metadata/digest, inbound event idempotency key, callback receipt, job metadata/idempotency key and replayable public surfaces |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 提供 reserve / duplicate / accepted / rejected / receipt / job report flow order and no-write query boundary |
| `03_ddd_step_10_state_matrix.md` | 已完成并已审核通过 | 提供 idempotency state, stored result kind, job result kind, terminal/retryable states and entry/application separation |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成并已审核通过 | 提供 same-UoW save result then complete idempotency, transaction visibility, stored replay no-rerun, expected version and fake parity |
| `03_ddd_step_12_error_recovery.md` | 已完成并已承接 | 提供 conflict/replay/commit unknown/entry failure/forbidden body public mapping and recovery classes |
| `standards/document/详细设计讨论流程_SOP.md` Step 13 | 当前标准 | 规定并发场景表、幂等键表、重入保护表和应问问题 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 当前标准 | 检查 idempotency key、digest、result ref、expected version、query no-write、sidecar truth、fake parity 是否闭合 |
| `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | 粒度参考 | 只参考组织方式和表格粒度,不复制 governance 业务场景 |

### 1.4 SOP 问题初答

| SOP 问题 | 13.0 初答 |
|---|---|
| 哪些处理流可能并发修改同一资源 | 13.1 展开。初步范围包括 6 个 Command 写路径、5 个 Inbound Event / Callback flow、6 个 Operations Job、outbox/handoff retry family、projection/reference/report maintenance state 和 stored replay/idempotency records。Query 只读,不参与写并发。 |
| 哪些接口、事件或 job 可能被重复调用 | 13.2 / 13.3 展开。所有 Command 可因 client timeout/retry 重复;所有 inbound event/callback 可因 redelivery/ack loss 重复;所有 operations job 可因 scheduler/operator/worker crash 重跑;outbox/handoff item 可被多个 worker 竞争处理。 |
| 幂等键来自请求、事件、job 参数还是数据库唯一约束 | Command 来自 command metadata / operation context;consumer/callback 来自 inbound envelope dedupe/idempotency key;job 来自 job metadata/idempotency key。Database unique key 只保护 business/storage uniqueness,不能替代 stored replay。 |
| 重复请求应该返回既有结果、跳过、覆盖还是报错 | Same operation/channel/key/digest completed 时 replay stored surface;different digest conflict;in-flight delayed/temporarily unavailable;source duplicate 可 noop only when flow has explicit no-op receipt branch;任何 duplicate 不覆盖、不重跑 mutation/job。 |
| 并发冲突如何测试 | Step 16 承接测试 ID。本 Step 只给 test cut families: optimistic version conflict、unique conflict、same digest replay、different digest conflict、in-flight、stored missing/wrong-kind、commit unknown、dual publisher、projection/reference job race、handoff retry race、query no-write。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 风险 | Step 13 处理 |
|---|---|---|
| Step 12 已固定 stored replay missing/wrong-kind 不重跑 | 若 Step 13 为了恢复 duplicate 重跑 mutation/job,会破坏 replay 真相源 | 13.3/13.4 必须固定 replay source and defect behavior |
| Step 11 固定 result save before idempotency complete | 若 complete 先于 stored result,duplicate 可能指向 missing result | 13.2/13.4 固定 save-before-complete order and conflict handling |
| Step 7 reserve outcome 有 `ReplayAvailable` / `Conflict` / `InFlight` | 若 Step 13 不定义 priority,实现会自行选择 conflict/noop/retry | 13.4 专门写 duplicate / in-flight / conflict matrix |
| Command / consumer / job 的 idempotency key 来源分散在 Step 8 | 若不逐协议列 key/digest,实现可能用 cursor、timestamp、run id 或 source version 替代 | 13.3 写 key and digest matrix |
| Query no-write 已在 Step 9~12 固定 | 若 Step 13 给 query 写 idempotency 或 read trace,会破坏边界 | 所有 repeated query 只执行 authorized read surface |
| Outbox / handoff retry 依赖 retryable marker state | 若 retry job 选 terminal state 或重发 delivered intent,会重复副作用 | 13.4 写 per-record/item reentry guard |
| Fake 容易用 private map 或 direct store bypass 规避并发 | 会导致 durable/fake 语义不等价 | 13.5 审计 fake/durable parity and test cut handoff |

### 1.6 设计原则

| 原则 | 正式口径 |
|---|---|
| operation namespace | Idempotency uniqueness must include operation name and operation channel;raw key string alone is insufficient |
| stable digest | Digest covers stable business inputs that affect result,not volatile metadata |
| volatile exclusion | Digest must not include request id,received/requested time,trace id,job run id,delivery attempt,retry counter,current time or raw external body |
| stored replay | Completed duplicate must replay stored command result,typed receipt or job report,not reconstruct from current truth/store |
| in-flight no second writer | Same operation/channel/key/digest in-flight must not enter domain transition,resolver,publisher,handoff or job body a second time |
| optimistic update | Mutable truth,projection/reference/outbox/handoff/report state updates use loaded `IdentityVersion`;source version/cursor/idempotency key cannot substitute |
| append-only side effects | Trace,audit,career,outbox,stored result,receipt and job report are append/replay material;duplicates do not append second copy |
| query no-write | Query does not reserve idempotency,append trace/audit,mark stale,refresh reference,rebuild projection or repair report |
| job no truth repair | Operations job maintains projection/reference/report/outbox/handoff markers only;it does not repair member/lifecycle/role/career/memory truth |
| body-free replay | Digest/replay material must be body-free;forbidden body cannot be persisted just to support dedupe |

### 1.7 Step 13 分批计划

| 批次 | 主题 | 输出 | 停审重点 | 状态 |
|---|---|---|---|---|
| 13.0 | framework / input boundary / batch plan | Step 13 目标、输入、SOP 初答、诊断、原则、分批计划、红线、Step 12 handoff | 是否不提前写完整矩阵;是否承接 Step 12 §6.4 | 已审核通过 |
| 13.1 | concurrency resource inventory | mutable truth、append-only、sidecar、projection/reference/report、outbox/handoff、stored replay、entry/runtime 的冲突资源表 | 资源是否回指 Step 6/7/11;query 是否排除写并发 | 已审核通过 |
| 13.2 | concurrency scenario matrix | command / consumer / callback / job / outbox-handoff / projection-reference-report 的并发场景、控制方式、失败 surface | version/unique conflict 是否闭合;不新增 error mapping | 已审核通过 |
| 13.3 | idempotency key and digest matrix | command、consumer/callback、job 的 key 来源、namespace、digest stable input、excluded input | key/digest 是否可计算;不使用 timestamp/cursor/source version | 已审核通过 |
| 13.4 | duplicate / in-flight / reentry handling | same digest replay、different digest conflict、in-flight、commit unknown、stored missing、job/outbox/handoff reentry matrix | duplicate no-rerun;stored replay source;retryable marker state | 已审核通过 |
| 13.5 | cross-step closure / Step 14 handoff | Step 7~12 闭环审计、open item closure、Step 14~16 handoff、回填草稿 | 是否足够映射测试切口;是否无 unresolved blocker | 已写入,待审核 |

### 1.8 Step 13 写入红线

| 红线 | 禁止做法 | 正确处理 |
|---|---|---|
| 不私补 key source | 为某 command/event/job 临时用 timestamp、cursor、run ref、source event ref 或 route string 当 idempotency key | 回 Step 8/9/12 闭口正式 key source |
| 不私补 digest material | 把 raw JSON、request body、external body、transport header、trace id、current time 纳入 digest | 只用 stable body-free material marker and refs |
| 不用 unique key 替代 replay | database unique conflict 直接当 duplicate success | unique 只防并发;duplicate replay 必须有 stored result/receipt/report |
| 不重跑 duplicate | stored missing 时重新执行 command、consumer、callback、job、publisher、handoff | replay consistency defect;manual recovery |
| 不让 in-flight 双写 | in-flight same key/digest 继续跑第二个 mutation/job body | return delayed/temporarily unavailable per Step 12 |
| 不让 query 写幂等 | query reserve idempotency or append read trace | query remains read-only surface |
| 不 retry terminal marker | retry outbox `Failed` / `SkippedByPolicy` or handoff `Failed` / `Cancelled` / `Delivered` | retry only `RetryableFailed` through formal job |
| 不绕过 facade/fake parity | fake tests direct-write repository to simulate duplicate/parallel outcomes | use application facade and same port semantics |

### 1.9 Step 12 handoff 承接表

| Step 13 topic | Must carry from Step 12 | 13.x 承接位置 |
|---|---|---|
| concurrency resources | version conflict,unique conflict and terminal state conflict taxonomy | 13.1 / 13.2 |
| command idempotency | same key/same digest replay from stored generic shell + typed command envelope;different digest duplicate conflict;stored shell/envelope missing no-rerun | 13.3 / 13.4 |
| consumer/callback idempotency | typed receipt envelope required for replay;unsupported/quarantined/delayed/noop only replay if saved as application outcome | 13.3 / 13.4 |
| job idempotency | stored `IdentityJobRunReport` required;duplicate replay does not rerun job or rescan item refs | 13.3 / 13.4 |
| in-flight duplicate | no second writer while same operation/channel/key/digest reserved | 13.4 |
| commit unknown | must check idempotency/stored surface before retry | 13.4 |
| query repeated reads | query remains no idempotency/no-write | 13.2 / 13.4 |
| outbox/handoff retry | only retry retryable marker states through formal job | 13.2 / 13.4 |
| forbidden body | body-free digest/stored replay;no raw body in issue/replay material | 13.3 / 13.4 |

### 1.10 13.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 13.0 范围 | 通过 | 本批只搭框架,未写完整并发矩阵、key matrix 或 duplicate priority |
| 是否承接 SOP Step 13 | 通过 | 已覆盖并发场景表、幂等键表、重入保护表的后续批次 |
| 是否承接 Step 12 §6.4 | 通过 | 已逐项映射到 13.1~13.4 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 是否新增上游未定义 schema/port/state/error | 未新增 | 发现缺口时必须回 Step 6~12 |
| 是否提前定义 Step 14/15/16 内容 | 未提前 | retry/backoff、ack/dead-letter、observability、test ID 均只做 handoff |

---

## 2. 13.1 concurrency resource inventory

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 13.1 concurrency resource inventory |
| 当前结论 | 已按 Step 6/7/11 的正式 object、repository、logical store 和 version 规则清点并发资源 |
| 本批边界 | 只定义资源、写入 owner、控制原语、正式来源、禁止替代物和 query 排除项 |
| 本批不写 | 具体 flow 场景矩阵、幂等键 / digest 字段矩阵、duplicate priority、retry/backoff、ack/dead-letter、日志指标、测试 ID |
| 下一批 | 13.2 concurrency scenario matrix |

本批把 Step 11 的 logical store inventory 转换为 Step 13 的 concurrency resource inventory。资源进入本表的条件是:它可能被 command、consumer/callback、operations job、outbox publisher、handoff delivery 或 maintenance flow 并发写入,或者它是 duplicate replay / in-flight protection 的正式支撑面。

`IdentityVersion`、source cursor、source version、page cursor、idempotency key、request digest、job run ref 和 timestamp 必须保持分离。除本节明确列为控制原语的字段外,任何 opaque ref 或 marker 都不能临时充当 optimistic version、dedupe key 或 replay source。

### 2.2 Resource classification

| Resource family | Representative store / object | Primary writer family | Control primitive | Formal source | Forbidden substitutes |
|---|---|---|---|---|---|
| mutable versioned truth | `GlobalMember`, `GlobalLifecycleState`, `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `MemoryReference` | command service, selected consumer/callback service | loaded `IdentityVersion`, business unique key, state matrix | Step 6 object state;Step 7 core repositories;Step 11 mutable truth store | timestamp, source version, cursor, idempotency key, request digest, runtime state |
| append-only truth/history | `CareerRecord` append path, `IdentityTraceRecord`, correction trace | command service, consumer marker service, correction flow | create-only key, source duplicate lookup, loaded version only for explanatory marker | Step 6 career/trace objects;Step 7 career/trace repositories;Step 11 append-only classification | update/delete/reorder, raw source event body, page cursor, generated timestamp |
| versioned aggregate + entry append | `AuditTrail` + entries, `TraceHandoffIntent` + items | accepted application services, handoff job/callback | aggregate loaded `IdentityVersion`, entry/item unique key | Step 6 audit/handoff objects;Step 7 audit/handoff repositories;Step 11 aggregate + entry store | entry count, trace cursor, receipt body, adapter response |
| read model / projection | `MemberSummaryView`, `ProjectionState`, `projection_dependency_index` | accepted stale marker, rebuild job | projection state `IdentityVersion`, stable view lookup, formal dependency index | Step 6 projection/read model;Step 7 projection repository;Step 11 projection store | query-built view ref, source cursor as version, full truth scan in fake |
| external reference bundle / sidecar | `ReferenceResolutionState`, typed sidecar refs, owner/kind/stale index | consumer sidecar update, reference refresh job | bundle `ExternalReferenceRef`, loaded bundle `IdentityVersion`, typed sidecar same-bundle save | Step 6 reference state;Step 7 reference repository;Step 11 reference bundle store | business source ref as bundle key, external source version as expected_version, safe summary ref as state version |
| report-only maintenance | `ReconciliationReport`, finding/issue refs, maintenance target index | reconciliation job | report ref uniqueness, optional loaded `IdentityVersion`, immutable/superseded report state | Step 6 reconciliation policy/report;Step 7 report/maintenance repositories;Step 11 report store | report as repair action, raw diagnostic body, scope/time-derived report ref |
| propagation marker | `IdentityOutboxRecord`, payload marker, `TraceHandoffIntent` | accepted application service, publisher job, handoff job/callback | pending append, state loaded `IdentityVersion`, retryable marker state, attempt/issue/receipt marker | Step 6 outbox/handoff states;Step 7 outbox/handoff ports;Step 11 propagation stores | publish success as accepted truth, `Published` as downstream consumed, adapter 2xx as delivered |
| replay / idempotency support | `IdentityIdempotencyRecord`, `StoredIdentityOperationResult`, `IdentityConsumerReceiptEnvelope`, `IdentityJobRunReport` | command/consumer/callback/job application service | operation/channel/key uniqueness, request digest compare, stored replay ref, immutable stored surface | Step 6 application helper objects;Step 7 idempotency/result/job report repositories;Step 11 replay stores | database unique conflict as replay, current truth reconstruction, missing stored result rerun |
| runtime / entry technical marker | runtime config shell, assembly state, adapter availability, entry dispatch marker | runtime builder, entry guard, adapter catalog | runtime-local marker, entry validation/dispatch state | Step 6 runtime/entry objects;Step 11 runtime logical stores | application accepted/rejected result, business idempotency record, stored replay surface |
| query read-only surface | visibility decision/read mapping, query projections/history/report reads | query service | authorized read resolver, no UoW write, page cursor only | Step 7 read visibility/history/query repositories;Step 9/12 query no-write | idempotency reserve, trace/audit append, hidden rebuild/refresh/repair |

### 2.3 Mutable versioned truth resources

| Resource / store | Conflict owner / writer family | Control primitive | Formal source | Forbidden substitutes / notes |
|---|---|---|---|---|
| `GlobalMember` / `identity_global_members` | establish member, terminal lifecycle / anchor-hold application service | PK `member_ref`;create with `None`;update with loaded `IdentityVersion`;anchor reuse guard | Step 6 `GlobalMember` / `IdentityAnchorState`;Step 7 `GlobalMemberRepository.get_member_with_version/save_member`;Step 11 `identity_global_members` | account/runtime/ProjectMember cannot create identity truth;terminal hold does not release or reuse member ref |
| `GlobalLifecycleState` / `identity_global_lifecycles` | establish initial lifecycle, explicit lifecycle transition | one current row by explicit `member_ref`;save uses `save_lifecycle(member_ref, ...)`;loaded lifecycle `IdentityVersion` must come from `get_lifecycle_with_version(member_ref)` for the same key;Step 10 lifecycle state matrix | Step 6 lifecycle state;Step 7 `GlobalLifecycleRepository.get_lifecycle_with_version/save_lifecycle`;Step 11 lifecycle store | runtime disabled, account status, timestamp, governance basis ref presence, lifecycle state contents, reason or actor cannot directly advance lifecycle or infer row key |
| `RoleCapabilitySummary` / `role_capability_summaries` | maintain role/capability command, source changed consumer, reference refresh | summary `IdentityVersion`;current-by-member index when policy requires current summary | Step 6 role summary;Step 7 `RoleCapabilityRepository.get_summary_with_version/find_current_summary_by_member/save_summary`;Step 11 summary store | role/capability definition body, method body, evidence body, safe summary ref or source version cannot become truth/version |
| `RoleCapabilitySourceSnapshot` / `role_capability_source_snapshots` | role/capability source consumer or refresh path | snapshot `IdentityVersion`;unique typed `source_ref` for current snapshot | Step 6 source snapshot;Step 7 `find_source_snapshot_by_source/get_source_snapshot_with_version/save_source_snapshot`;Step 11 source snapshot store | source version is external provenance only;repository must not parse source ref string or call resolver implicitly |
| `MemoryReference` / `memory_references` | maintain memory reference command, memory source consumer, archive handoff callback | relation `IdentityVersion`;unique active `(member_ref,memory_ref)`, `(member_ref,archive_ref)` or handoff index when relation kind applies | Step 6 memory reference;Step 7 `MemoryReferenceRepository.get_memory_reference_with_version/find_reference_by_memory/find_reference_by_archive/find_reference_by_handoff/save_memory_reference`;Step 11 memory relation store | memory body, embedding, archive package, receipt body or callback raw body cannot drive state directly;delivered receipt is marker-only |

Mutable truth conflicts are optimistic concurrency conflicts unless the formal business uniqueness index rejects a competing create. The uniqueness index protects active identity semantics, but it is not a replay surface. A duplicate command/event/job still needs idempotency/stored replay handling in 13.3 / 13.4.

### 2.4 Append-only and aggregate resources

| Resource / store | Conflict owner / writer family | Control primitive | Formal source | Forbidden substitutes / notes |
|---|---|---|---|---|
| `CareerRecord` append path / `career_records` | append career command, correction command, work participation consumer | create-only `career_record_ref`;source duplicate marker lookup;loaded row version only for explanatory state update | Step 6 `CareerRecord`;Step 7 `CareerRecordRepository.append_career_record/find_duplicate_source_record/save_career_record_state`;Step 11 career store | duplicate source is not silent success unless flow has formal receipt/result branch;old record cannot be overwritten or deleted |
| `career_correction_index` | career correction flow | unique `(original_record_ref, correction_record_ref)` owned by append | Step 7 career correction lookup;Step 11 correction index | correction index cannot replace supersession trace or old record loaded-version marker |
| `IdentityTraceRecord` / `identity_trace_records` | accepted command, consumer/job/reference marker, correction trace | create-only `trace_record_ref`;formal subject mapper;formal truth/reference marker cursor | Step 6 trace record;Step 7 `IdentityTraceRecordRepository.append_trace_record/list_*`;Step 11 trace store | timestamp, version, digest, page cursor or idempotency key cannot be source cursor;subject cannot be string-concatenated |
| trace supersession marker | correction flow | loaded trace row `IdentityVersion`;append new correction trace plus mark old trace superseded | Step 7 `get_trace_record/mark_trace_superseded_by_correction`;Step 11 supersession semantics | supersession is explanatory marker only;does not erase old trace material |
| `AuditTrail` / `identity_audit_trails` | accepted application service, audit assembly | aggregate `IdentityVersion`;unique `audit_subject_ref`;entry append under loaded trail version | Step 6 audit trail;Step 7 `IdentityAuditTrailRepository.find_audit_trail_by_subject/save_audit_trail/append_audit_entry`;Step 11 audit store | audit cursor, trace cursor or entry ordinal cannot replace aggregate version;raw log/debug/request body forbidden |
| `identity_audit_entries` | accepted audit append | unique `(audit_trail_ref, ordinal_or_cursor)` owned by trail append | Step 7 `append_audit_entry`;Step 11 audit entry store | entry unique key does not authorize concurrent aggregate update without loaded trail version |
| `TraceHandoffIntent` item set / `trace_handoff_items` | prepare handoff service/job | non-empty trace item set;unique `(handoff_intent_ref, trace_record_ref)`;optional audit item unique by trail | Step 6 handoff intent;Step 7 `TraceHandoffIntentRepository.save_handoff_intent`;Step 11 handoff items | archive package, receipt body or target path cannot be stored as item material |

Append-only resources use append keys and formal duplicate source indexes to avoid accidental double append. They do not allow an implementation to “fix” a duplicate by rewriting old material. Where old material needs explanatory state, the loaded row or aggregate version remains the only expected-version source.

### 2.5 Projection / reference / report resources

| Resource / store | Conflict owner / writer family | Control primitive | Formal source | Forbidden substitutes / notes |
|---|---|---|---|---|
| `MemberSummaryView` / `member_summary_views` | projection builder / rebuild job | stable `find_member_summary_view_ref`;save view with projection/view expected version when updating | Step 6 `MemberSummaryView`;Step 7 `IdentityProjectionRepository.find_member_summary_view_ref/get_member_summary_view/save_member_summary_view`;Step 11 view store | query must not build `MemberSummaryViewRef`;missing view does not trigger hidden rebuild |
| `ProjectionState` / `identity_projection_states` | accepted write stale marker, rebuild job | loaded projection `IdentityVersion`;state matrix;formal source cursor stored in state | Step 6 `ProjectionState`;Step 7 `get_projection_state_with_version/save_projection_state/mark_projection_stale`;Step 11 projection state store | projection cursor, truth cursor, page cursor, timestamp or idempotency key cannot replace optimistic version |
| `projection_dependency_index` | accepted side effect expansion, projection catalog maintenance | unique `(dependency_kind, dependency_ref, projection_ref)`;read-only expansion during accepted flow | Step 7 `expand_affected_projection_refs`;Step 11 dependency index | fake must not infer affected projection from subject string prefix or scan private body |
| `ReferenceResolutionState` / `external_reference_states` | consumer sidecar update, external reference refresh job | bundle key `ExternalReferenceRef`;loaded bundle `IdentityVersion`;owner/kind/stale indexes | Step 6 reference state;Step 7 `IdentityReferenceStateRepository.get_reference_state_with_version/save_reference_state`;Step 11 reference state store | external source version, business source ref, safe summary ref and resolver timestamp cannot be expected_version |
| `external_reference_sidecars` | consumer/refresh safe summary save | `save_typed_sidecar_refs(reference_ref, sidecars, loaded_bundle_version)`;unique `(reference_ref, sidecar_kind, sidecar_ref)` | Step 7 `get_typed_sidecar_refs/save_typed_sidecar_refs`;Step 11 sidecar store | no cross-bundle version sharing;typed source ref cannot be silently converted to bundle key |
| `external_reference_owner_index` | refresh/reconciliation target selection | owner/kind/stale index owned by reference state save;selection output is `ExternalReferenceRef` bundle key | Step 7 `list_reference_states_by_owner/list_reference_states_by_kind/list_stale_reference_states`;Step 11 owner/kind/stale bundle index | maintenance must not parse external ref strings to infer owner/kind and must not reverse lookup bundle key from `ReferenceResolutionStateRef` |
| `IdentityMaintenanceRepository` target expansion / inspection and projection rebuild input catalog | rebuild / refresh / reconciliation job | formal maintenance scope expansion plus typed target inspection context;member summary rebuild plan returns complete body-free view inputs | Step 7 `expand_maintenance_targets/list_projection_targets_for_rebuild/list_reference_targets_for_refresh/list_report_targets/load_maintenance_target_inspection_context`;Step 7 `IdentityProjectionRepository.get_member_summary_rebuild_plan`;Step 11 maintenance target / projection builder catalog | target expansion cannot return core truth write targets;job does not repair member/lifecycle/role/career/memory truth;service/fake cannot decode opaque target marker or infer MemberSummaryView fields from projection/scope/view strings |
| `ReconciliationReport` / `identity_reconciliation_reports` | reconciliation job | report ref uniqueness;create `None` or loaded report `IdentityVersion`;report state matrix | Step 6 report-only policy;Step 7 `IdentityReconciliationReportRepository.get_report_with_version/save_report`;Step 11 report store | report/finding is not remediation;raw diagnostic, secret, provider response and repair plan are forbidden |

Projection, reference and report resources are maintenance-owned. Command accepted paths can mark projection stale or append trace/audit/outbox in the same accepted UoW, but they must not rebuild projection bodies, refresh external references or repair reconciliation findings inline.

### 2.6 Outbox / handoff propagation resources

| Resource / store | Conflict owner / writer family | Control primitive | Formal source | Forbidden substitutes / notes |
|---|---|---|---|---|
| `IdentityOutboxRecord` / `identity_outbox_records` | accepted application services create pending;publisher job updates publish state | create pending with `None`;loaded outbox `IdentityVersion` for `update_outbox_state`;optional unique `(trace_record_ref,event_kind_ref)` | Step 6 outbox record/state;Step 7 `IdentityOutboxRepository.get_outbox_record_with_version/save_outbox_record/update_outbox_state`;Step 11 outbox store | publish failure never rolls back accepted truth;broker topic/raw response cannot be stored as state source |
| pending / retryable outbox selection | publish job | `OutboxState::PendingPublish` and retryable state list;topic by `TopicKeyRef`;page cursor only | Step 7 `list_pending_outbox_records/list_retryable_outbox_records`;Step 11 state/topic indexes | backoff schedule and worker ack are not Step 13 resources;raw broker topic string cannot select items |
| `IdentityOutboxPayloadMarker` / `identity_outbox_payload_markers` | accepted application services | immutable body-free payload marker;PK `payload_marker_ref` | Step 6 payload marker;Step 7/11 outbox payload marker rules | missing marker is consistency defect;publisher must not reconstruct payload from current truth |
| outbox subject / trace indexes | report/query/explainability, publish diagnostics | formal `IdentityOutboxSubjectRef`;trace ref index | Step 7 `list_outbox_records_by_subject/find_outbox_records_by_trace`;Step 11 indexes | subject string parsing and trace body scan forbidden |
| `TraceHandoffIntent` / `trace_handoff_intents` | prepare handoff job/service, handoff delivery job, handoff callback | create pending with `None`;state update with loaded intent `IdentityVersion`;retryable state guard | Step 6 handoff intent/state;Step 7 `TraceHandoffIntentRepository.get_handoff_intent_with_version/save_handoff_intent/list_retryable_handoff_intents`;Step 11 handoff store | `Delivered` must have formal `HandoffReceiptRef`;adapter HTTP success or job log is not delivered |
| handoff attempt / receipt / issue markers | delivery job/callback | formal attempt marker, receipt marker, issue marker;stored as body-free refs | Step 6 handoff policy;Step 7 handoff adapter/result port;Step 11 handoff store | receipt body, archive package, target path, observability raw log and adapter response body forbidden |
| handoff target/scope indexes | operations query, retry job | typed `HandoffTargetRef` / `HandoffScopeRef`;page cursor only | Step 7 handoff repository/target resolver;Step 11 handoff indexes | target path/bucket/tenant string cannot be parsed as formal target |

Propagation resources protect side effects after identity acceptance. Their concurrency rule is item-level state update by loaded version, plus retry only through formal retryable states. `Published` is not downstream consumed, and `Delivered` is not adapter-called;both require their own formal marker semantics.

### 2.7 Idempotency / stored replay resources

| Resource / store | Conflict owner / writer family | Control primitive | Formal source | Forbidden substitutes / notes |
|---|---|---|---|---|
| `IdentityIdempotencyRecord` / `identity_idempotency_records` | command, consumer, callback, operations job services | unique operation name + channel + idempotency key;atomic `reserve`;digest compare;loaded record version for complete/conflict | Step 6 idempotency object;Step 7 `IdentityIdempotencyRepository.get_by_key/reserve/complete_*`;Step 11 idempotency store | raw key alone insufficient;database uniqueness alone is not replay;repository must not hardcode channel |
| reserved / in-flight record | same operation retry while first call active | `IdempotencyReserveOutcome::InFlight`;second writer does not enter mutation/job body | Step 7 reserve outcome;Step 12 in-flight recovery;Step 11 transaction visibility | no second resolver/publisher/handoff/job body execution while same key/digest is in-flight |
| same key different digest record | key reuse conflict | digest comparison;`mark_conflict` preserves original digest and state | Step 6 `IdentityRequestDigest`;Step 7 `mark_conflict`;Step 12 idempotency conflict | incoming raw body must not be persisted to explain conflict;old digest must not be overwritten |
| `StoredIdentityOperationResult` / `stored_identity_operation_results` | command/consumer/callback/job completion | immutable stored result by `stored_result_ref`;stored kind must match replay family | Step 6 stored result;Step 7 `IdentityStoredResultRepository.get_stored_result/save_*_result`;Step 11 stored result store | missing/wrong-kind does not rerun mutation;current truth/projection cannot reconstruct replay |
| `IdentityCommandEffectSummary` / `identity_command_effect_summaries` | accepted command completion | append immutable effect summary with truth/trace/audit/outbox/stale/stored refs | Step 6 command effect summary;Step 7 `IdentityCommandEffectSummaryRepository.save_effect_summary`;Step 11 effect store | effect summary does not decide commit order and must not save command body |
| `IdentityConsumerReceiptEnvelope` / `identity_consumer_receipt_envelopes` | inbound consumer and handoff callback completion | typed receipt envelope saved in same UoW before idempotency complete;kind-specific get/save | Step 6 receipt surface;Step 7 `get_consumer_receipt/save_consumer_receipt/get_handoff_callback_receipt/save_handoff_callback_receipt`;Step 11 receipt store | generic stored shell alone is not complete replay;event body/callback receipt body forbidden |
| `IdentityJobRunReport` / `identity_job_run_reports` | operations job completion and duplicate replay | unique `job_run_ref`;stored job report result;immutable completion with partial/failed issue refs | Step 6 job report;Step 7 `IdentityJobReportRepository.find_job_report_by_run/save_job_report`;Step 11 job report store | duplicate job cannot rescan current refs;raw job log/stack trace forbidden |

Idempotency controls operation reentry, not business correctness by itself. Business unique conflict and optimistic version conflict remain separate surfaces. Completed duplicate replay must read stored command result, typed receipt envelope or job report;any missing replay material is a consistency defect handled by Step 12, not a reason to rerun.

### 2.8 Runtime / entry resources

| Resource / store | Conflict owner / writer family | Control primitive | Formal source | Forbidden substitutes / notes |
|---|---|---|---|---|
| runtime config shell | runtime builder / deployment wiring | runtime-local marker;safe config evidence ref;optional runtime-local version | Step 6 runtime config shell;Step 11 runtime logical store | raw env, secret, full config body or deployment file body cannot enter identity replay material |
| runtime assembly state | runtime builder / adapter catalog | assembly state marker;profile/config evidence refs | Step 6 runtime assembly;Step 11 runtime assembly store | assembled does not mean adapter healthy or application accepted |
| adapter availability | adapter registry / controlled disabled adapter | availability marker and safe issue ref | Step 6 adapter availability;Step 7 adapter availability port;Step 11 adapter availability store | adapter unavailable is not lifecycle truth;must not directly reject stored command unless flow maps it |
| entry validation marker | API/worker/jobs entry guard | entry-local validation/dispatch marker;no application UoW before dispatch | Step 6 API/worker/job entry objects;Step 12 entry pre-dispatch failure | entry invalid/unsupported does not create idempotency, stored result, trace, audit or outbox |
| entry dispatch marker | API/worker/jobs entry after handoff to application service | dispatch success/failure marker only | Step 6 entry dispatch result;Step 12 entry/application separation | dispatch success is not application accepted;dispatch failure is not stored replay surface unless application context exists |

Runtime and entry resources are diagnostic and availability resources. They may gate whether an application service is called, but they are not identity truth, not stored command results and not duplicate replay material.

### 2.9 Query read-only exclusion table

| Query resource | Reads allowed | Writes explicitly excluded | Formal source |
|---|---|---|---|
| member summary query | visibility resolver, stable view lookup, `get_member_summary_view` | no idempotency reserve;no hidden view create/rebuild;no stale/fresh state update | Step 7 projection/read visibility repositories;Step 9/12 query no-write |
| lifecycle / role / career / memory query | core truth repository read/list with page cursor | no truth repair;no source resolver call for refresh;no audit/trace append | Step 7 core repositories;Step 11 read/list semantics |
| trace/history/audit query | trace/history/audit list by formal subject/scope/cursor | no supersession, no audit trail create, no missing trace backfill | Step 7 trace/audit/history repositories |
| report / reconciliation query | read visibility precheck, report get/list | no reconciliation job execution;no finding repair;no report state update | Step 7 report/read visibility repositories |
| projection/reference operations query | projection/reference read visibility and state read/list | no projection rebuild;no reference refresh;no sidecar save | Step 7 projection/reference/read visibility repositories |
| outbox/handoff operations query | outbox/handoff read visibility and state/list read | no publish, no handoff delivery, no retry marker update | Step 7 outbox/handoff/read visibility repositories |
| visibility decision read | `get_visibility_decision` when ref is already formal | no external auth call hidden inside query;no default-visible fallback | Step 7 read visibility repository;Step 12 not-visible/degraded mapping |

Query repetition is not idempotency. Repeated query calls return the current authorized read surface and may observe different committed state over time. They must not create replay records, trace records, audit entries, projection refreshes, reference refreshes, outbox updates or handoff attempts.

### 2.10 13.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 13.1 范围 | 通过 | 本批只写并发资源清单,未写具体场景矩阵、key/digest 表、retry/backoff 或测试 ID |
| 是否回指正式来源 | 通过 | 每类资源均回指 Step 6 object/state、Step 7 repository/port 或 Step 11 logical store |
| mutable truth version 来源是否闭合 | 通过 | 所有 mutable update 均要求 loaded `IdentityVersion`,并列明禁止 source version/cursor/key 替代 |
| append-only 语义是否闭合 | 通过 | career/trace/audit entry/handoff item 均保持 append-only 或 aggregate-version append |
| reference sidecar version 是否闭合 | 通过 | typed sidecar 必须绑定同一 `ExternalReferenceRef` bundle 和 loaded bundle version |
| replay/idempotency surface 是否闭合 | 通过 | record、stored result、receipt envelope、job report 分别列出 owner 和 replay 约束 |
| query 是否排除写并发 | 通过 | 2.9 明确 query no-write/no-idempotency/no-hidden-maintenance |
| 是否新增上游未定义 schema/port/state/error | 未新增 | 本批只引用 Step 6/7/11 已定义面 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档仍留 Step 19 装配 |
| 下一批 | 13.2 | 用户审核通过 13.1 后进入 concurrency scenario matrix |

---

## 3. 13.2 concurrency scenario matrix

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 13.2 concurrency scenario matrix |
| 当前结论 | 已按 Step 9 flow family 和 13.1 资源清单建立并发场景矩阵 |
| 本批边界 | 只定义场景、冲突资源、控制方式、失败 surface、禁止行为和后续承接 |
| 本批不写 | 每个 operation 的具体 idempotency key、digest stable input、duplicate priority、retry/backoff schedule、transport ack/dead-letter、测试 ID |
| 下一批 | 13.3 idempotency key and digest matrix |

本批矩阵的资源列必须引用 13.1 已列资源族。若某场景无法落到 loaded `IdentityVersion`、business unique key、append-only key、idempotency reserve、stored replay、retryable marker 或 query no-write,则不能继续在本 Step 私补控制方式,必须回 Step 6~12 闭口。

### 3.2 Shared application concurrency gates

| Scenario | Flow family | Conflict resource from 13.1 | Control primitive | Failure / surface | Forbidden behavior |
|---|---|---|---|---|---|
| same application operation retried while first run is in-flight | command, consumer/callback, job | `IdentityIdempotencyRecord` | atomic reserve on operation/channel/key plus digest compare | in-flight / delayed / temporarily unavailable per Step 12 | enter domain transition, resolver, publisher, handoff delivery or job body a second time |
| same key and same digest after completed stored outcome | command, consumer/callback, job | `IdentityIdempotencyRecord`, stored result / receipt / job report | `ReplayAvailable` + stored replay load | replay accepted/rejected command, typed receipt or job report | recompute from current truth, relist job targets, append trace/outbox again |
| same key and different digest | command, consumer/callback, job | `IdentityIdempotencyRecord` | digest mismatch;optional conflict mark with loaded idempotency version | duplicate conflict / rejected surface | overwrite original digest, treat as noop, save incoming raw body |
| completed idempotency points to missing or wrong stored surface | command, consumer/callback, job | stored replay stores | replay consistency detection | manual recovery / replay consistency defect | rerun mutation/job or reconstruct from current store |
| commit status unknown after local commit attempt | command, consumer/callback, job | idempotency + stored replay stores | check stored result/receipt/report before any retry | temporary unknown/manual recovery if not found | blind retry with new key or compensating mutation |
| pre-dispatch entry failure | API, worker, jobs entry | runtime / entry technical marker only | entry validation/dispatch guard;no UoW | entry failure surface | create idempotency, stored result, receipt, job report, trace, outbox or truth |
| repository optimistic conflict during save | all application write families | mutable/versioned resource being updated | expected loaded `IdentityVersion` | conflict, delayed, or job failed item according to flow | last-write-wins, retry inside same stale object, use cursor/source version |
| business unique conflict during create | command/consumer create paths | business active/duplicate unique index | formal unique key + state/policy guard | conflict / domain rejected / stored noop only if flow owns noop branch | reinterpret unique conflict as stored replay without idempotency result |

### 3.3 Command concurrency scenarios

| Scenario | Flow | Conflict resource from 13.1 | Control primitive | Failure / surface | Forbidden behavior |
|---|---|---|---|---|---|
| concurrent establish for same `member_ref` or anchor source | `EstablishGlobalMemberFlow` | `GlobalMember`, `GlobalLifecycleState`, idempotency/stored result | idempotency reserve first;member PK/anchor reuse guard;create member/lifecycle with `None` | duplicate replay, anchor policy rejection, unique conflict | derive member from account/runtime state or release terminal hold |
| establish races lifecycle update for same member | `EstablishGlobalMemberFlow` / `UpdateGlobalLifecycleStateFlow` | `GlobalMember`, `GlobalLifecycleState` | establish creates both initial rows in one UoW;update requires existing loaded lifecycle version | not found or version/unique conflict | partial member without lifecycle;update lifecycle from runtime disabled marker |
| concurrent lifecycle transitions on same member | `UpdateGlobalLifecycleStateFlow` | `GlobalLifecycleState`, optional member anchor hold | loaded lifecycle `IdentityVersion`;Step 10 lifecycle transition matrix;optional member version for terminal anchor hold | conflict / invalid transition / policy denied | terminal reopen, high-risk transition by basis ref presence only |
| lifecycle accepted side effects race projection stale mark | `UpdateGlobalLifecycleStateFlow` | projection state, trace/audit/outbox/effect | accepted UoW assigns truth cursor, appends trace/audit/outbox, marks affected projections stale by loaded projection version | whole accepted UoW rollback on pre-commit conflict;projection conflict becomes accepted-flow failure per Step 12 | publish outbox immediately;use cursor as projection version |
| concurrent role/capability summary updates for same member | `MaintainRoleCapabilitySummaryFlow` | `RoleCapabilitySummary`, current summary index, source snapshot | current-by-member lookup;loaded summary/snapshot `IdentityVersion`;source policy | conflict / pending / dependency unavailable / policy denied | save role/capability definition body;make current summary by list scan |
| role source snapshot update races reference refresh | `MaintainRoleCapabilitySummaryFlow` / `RefreshExternalReferenceStateFlow` | source snapshot, reference bundle/sidecar | loaded snapshot version;loaded reference bundle version for sidecar | version conflict or delayed/retryable item | use external source version as `IdentityVersion`;cross-bundle sidecar save |
| concurrent career append with same source marker | `AppendCareerRecordFlow` / work consumer | `CareerRecord`, source duplicate index | idempotency reserve;formal duplicate source lookup;append-only create key | duplicate replay, stored noop only if formal branch, or conflict | silently ignore duplicate append without stored receipt/result |
| correction append races another correction or old-record supersession | `AppendCareerRecordFlow` correction branch | `CareerRecord`, correction index, trace supersession | new correction append;unique correction index;loaded old record/trace version for explanatory marker | version/unique conflict | overwrite original record or delete old trace |
| concurrent memory reference update for same memory/archive/handoff | `MaintainMemoryReferenceFlow` / memory consumer / archive callback | `MemoryReference`, active relation indexes | active `(member_ref,memory_ref/archive_ref/handoff_ref)` lookup;loaded relation `IdentityVersion` | conflict / delayed / policy denied | save memory body/archive package/receipt body or force delivered without receipt marker |
| memory source pending/unavailable races command link | `MaintainMemoryReferenceFlow` | `MemoryReference`, reference bundle | loaded relation version;source summary state from resolver/reference state | pending/rejected/dependency unavailable surface | treat opaque memory/archive ref presence as trusted source |
| prepare trace handoff races trace/audit material changes | `PrepareTraceHandoffFlow` | `TraceHandoffIntent`, trace/audit read material | visibility/read precheck;non-empty trace refs;handoff create `None`;item unique keys | rejected/not visible/degraded/conflict | deliver handoff during prepare;save archive package or target path |
| prepare handoff duplicate request | `PrepareTraceHandoffFlow` | idempotency/stored command result, handoff intent | command idempotency;stored result replay;handoff intent unique when formal request identifies same target/scope/material | duplicate replay or conflict | create second intent on same completed key/digest |

Command accepted side effects remain in the command UoW only until outbox publication or handoff delivery boundary. No command waits for publish/delivery success, and no propagation failure rolls back accepted member/lifecycle/role/career/memory truth.

### 3.4 Consumer / callback concurrency scenarios

| Scenario | Flow | Conflict resource from 13.1 | Control primitive | Failure / surface | Forbidden behavior |
|---|---|---|---|---|---|
| inbound envelope redelivered with same dedupe key/digest | all consumer/callback flows | `IdentityIdempotencyRecord`, typed receipt envelope | reserve by operation/channel/key;typed stored receipt replay | `DuplicateReplayed` receipt | parse payload and reapply mutation |
| inbound same dedupe key but different digest | all consumer/callback flows | `IdentityIdempotencyRecord` | digest mismatch | duplicate conflict / rejected receipt surface | overwrite stored receipt or classify as source noop |
| role capability source event races command summary update | `HandleRoleCapabilitySourceChangedFlow` / `MaintainRoleCapabilitySummaryFlow` | source snapshot, summary, reference sidecar | loaded snapshot/summary version;reference bundle version | delayed retry, version conflict, stored receipt | apply event by scanning current summaries or using source version as optimistic version |
| work participation event races career command append | `HandleWorkParticipationAcceptedFlow` / `AppendCareerRecordFlow` | `CareerRecord`, duplicate source index | append-only create;source duplicate lookup;stored noop receipt only if branch owns it | accepted append, noop receipt, conflict | update existing career record body or silent drop redelivery |
| memory source state event races memory command/callback | `HandleMemoryReferenceSourceStateChangedFlow` / `MaintainMemoryReferenceFlow` | `MemoryReference`, reference bundle/sidecar | loaded relation `IdentityVersion`;same-bundle sidecar save | delayed retry, unavailable/pending receipt, conflict | write external memory/archive owner truth |
| archive handoff callback redelivered | `HandleArchiveHandoffResultFlow` | idempotency record, typed callback receipt, `MemoryReference` | callback idempotency;target lookup by handoff;loaded memory relation version | duplicate callback receipt or delayed/conflict | mark relation delivered from raw adapter response without formal receipt marker |
| trace handoff callback races delivery job | `HandleTraceHandoffResultFlow` / `DeliverTraceHandoffFlow` | `TraceHandoffIntent`, handoff receipt/issue markers | callback idempotency;loaded intent `IdentityVersion`;Step 10 handoff state matrix | duplicate receipt, version conflict, terminal state conflict | delivered without `HandoffAttemptRef` and `HandoffReceiptRef` |
| consumer accepted side effects race projection rebuild | all accepted consumer/callback mutation flows | projection state, outbox, trace/audit, stored receipt | accepted UoW marks affected projection stale with loaded projection version;receipt saved before idempotency complete | rollback or delayed on conflict;stored receipt for completed branch | query-side repair or projection body rebuild inside consumer |
| consumer/callback rejected/delayed/noop branch repeats | all consumer/callback flows | typed receipt envelope, stored result shell | store replayable receipt before idempotency complete when application facade reached | replay same receipt | rely on worker ack/dead-letter as application result |

Consumer/callback flows may write identity-owned truth/reference/marker only through formal application services. Worker transport acknowledgement, redelivery count, bus offset and raw payload are not concurrency resources in this Step.

### 3.5 Query no-write repeated-read scenarios

| Scenario | Flow group | Conflict resource from 13.1 | Control primitive | Failure / surface | Forbidden behavior |
|---|---|---|---|---|---|
| repeated query while command is committing | 14 query flows | query read-only surface | no idempotency;authorized read after committed visibility | current visible/missing/stale result | wait on idempotency record or create stored query result |
| view lookup missing or projection stale | member summary / projection query | `MemberSummaryView`, `ProjectionState` | stable lookup/read only;surface missing/degraded/stale-visible | `Missing`, `Degraded`, `StaleVisible`, `Rebuilding` | synthesize view ref, rebuild projection, mark fresh |
| reference state stale/unavailable during query | reference operations query, role/memory read prep | `ReferenceResolutionState` | read visibility + reference state read/list only | degraded/stale-visible/missing | call external resolver or save sidecar |
| report/outbox/handoff state read while job updates item | operations query | report/outbox/handoff marker state | loaded committed state read;page cursor only | visible current state, degraded/missing if inconsistent | publish/deliver/retry/generate report from query |
| not visible target exists | all query groups | read visibility decision | visibility resolver result has priority over object detail | `NotVisible` without leaking found/missing detail | return not-found/empty after probing object first |
| invalid query route/page/input before facade | API entry | entry marker only | entry validation;no application query result | entry failure | save stored result or audit success |

Query repetition is intentionally outside idempotency. It may observe newer committed state on each call, but it must never participate in write concurrency control.

### 3.6 Operations job / propagation / maintenance scenarios

| Scenario | Flow | Conflict resource from 13.1 | Control primitive | Failure / surface | Forbidden behavior |
|---|---|---|---|---|---|
| same job request rerun with same key/digest | all operations jobs | idempotency record, stored job result, job report | reserve;stored `IdentityJobRunReport` replay | duplicate job response | rerun job body or relist target store |
| same job key reused for different input | all operations jobs | idempotency record | digest mismatch | duplicate conflict / rejected job | merge reports from two different scopes |
| rebuild job races accepted stale marker | `RebuildIdentityProjectionFlow` | `ProjectionState`, member summary view | loaded projection version;formal source cursor;state matrix | item conflict / partial or retryable report | query rebuild, truth repair, source cursor as version |
| two rebuild jobs target same projection | `RebuildIdentityProjectionFlow` | projection state/view | job idempotency plus loaded projection version | duplicate replay or version conflict item | last writer wins or rebuild from private fake scan |
| refresh job races consumer sidecar update | `RefreshExternalReferenceStateFlow` | `ReferenceResolutionState`, typed sidecar | loaded bundle version;same-bundle sidecar save | version conflict item / partial report | use business source ref as bundle key |
| refresh job sees resolver unavailable/unrecognized | `RefreshExternalReferenceStateFlow` | reference state/report issue | resolver typed outcome;save reference state/report issue if flow owns state update | retryable failed/partial/failed item | delete local truth or save raw provider body |
| reconciliation job runs while truth changes | `RunIdentityReconciliationFlow` | report-only material, maintenance target catalog | report-only policy;target expansion snapshot;report ref/save | partial/stale finding/report | repair member/lifecycle/role/career/memory truth |
| publish job races another publisher on same outbox | `PublishIdentityOutboxFlow` | `IdentityOutboxRecord` | loaded outbox `IdentityVersion`;state update after publisher outcome | item conflict/skipped or partial report | publish by current truth reconstruction |
| publisher returns retryable/permanent/skipped/unsupported | `PublishIdentityOutboxFlow` | outbox state, issue marker, job report | formal `OutboxPublishOutcome`;state-specific issue marker | retryable failed, failed, skipped item/report | treat retryable as terminal without issue or mark published from adapter log |
| publish payload marker missing | `PublishIdentityOutboxFlow` | outbox payload marker | no reconstruction;consistency failure marker/report when flow can report | item failed/manual recovery | rebuild payload from `GlobalMember` / lifecycle / role / career / memory current truth |
| delivery job races callback on same handoff intent | `DeliverTraceHandoffFlow` / callbacks | `TraceHandoffIntent` | loaded handoff intent version;attempt/receipt/issue marker | delivered/retryable/failed conflict or callback duplicate receipt | delivered from HTTP 2xx or request sent only |
| retry propagation selects terminal item | `RetryIdentityPropagationFailuresFlow` | outbox/handoff state | list only retryable state;terminal guard | skip/report issue according to flow | retry `Published`, `Delivered`, `Failed`, `Cancelled` or `SkippedByPolicy` |
| job report save fails after item updates staged | all operations jobs | job report + stored job result + idempotency | same UoW rollback;save report before complete idempotency | dependency/consistency failure | commit item state without replayable job report |
| job runner attempts direct store/adapter access | jobs entry | entry/runtime technical marker | facade-only dispatch guard | entry dispatch failure / design violation | runner direct rebuild/publish/refresh/deliver |

Operations jobs own maintenance/propagation markers only. They can produce item refs, issue refs and job reports, but they cannot change core identity truth and cannot use current stores to reconstruct duplicate replay.

### 3.7 Failure surface summary by control primitive

| Control primitive | Applies to resources | Primary failure / surface | Retryability class from Step 12 | Notes for 13.3 / 13.4 |
|---|---|---|---|---|
| idempotency reserve | command, consumer/callback, job | replay, conflict, in-flight | ReplayOnly / NonRetryableInput / RetryAfterReload | key/digest details move to 13.3;priority moves to 13.4 |
| loaded `IdentityVersion` | mutable truth, projection/reference/outbox/handoff/report state, audit/handoff aggregate | optimistic conflict | RetryAfterReload or job item partial | source version/cursor never substitute |
| business unique key | member anchor, current summary, duplicate source, active relation, outbox trace/event | conflict or formal noop branch | NonRetryablePolicy / ReplayOnly only if stored branch exists | unique conflict alone is not duplicate replay |
| append-only key | career, trace, outbox payload marker, stored result/effect/receipt/job report | create conflict / consistency defect | ManualRecovery unless flow has formal duplicate branch | append resources are not overwritten |
| retryable marker state | outbox/handoff retry | retryable failed item/report | RetryAfterDependencyRecovery | schedule/backoff remains Step 14 |
| terminal marker state | lifecycle terminal, outbox failed/skipped/published, handoff delivered/failed/cancelled | invalid transition or skipped terminal | NonRetryablePolicy / TerminalMarker | terminal reopen requires new formal operation |
| query no-write | all query/read resources | query surface only | ReadSurfaceOnly | no reserve/no UoW/no repair |

### 3.8 13.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 13.2 范围 | 通过 | 本批只写场景矩阵和 failure surface,未写具体 key/digest 字段、duplicate priority、retry/backoff 或测试 ID |
| 是否覆盖 Step 9 flow family | 通过 | command、query、consumer/callback、outbound publish、6 个 operations job 均有场景行 |
| 是否引用 13.1 资源 | 通过 | 每行均落在 mutable truth、append-only、projection/reference/report、outbox/handoff、idempotency/stored replay、runtime/entry 或 query no-write |
| 是否保持 query no-write | 通过 | 3.5 明确 query 重复读取不 reserve、不写 UoW、不 repair |
| 是否保持 duplicate no-rerun | 通过 | 3.2 / 3.4 / 3.6 均要求 stored replay,missing/wrong-kind 不重跑 |
| 是否保持 job no truth repair | 通过 | 3.6 明确 job 只维护 marker/report,不修改 core truth |
| 是否新增上游未定义 schema/port/state/error | 未新增 | 本批只使用 Step 6~12 已定义 object、repository、state、surface |
| 下一批 | 13.3 | 用户审核通过后进入 idempotency key and digest matrix |

---

## 4. 13.3 idempotency key and digest matrix

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 13.3 idempotency key and digest matrix |
| 当前结论 | 已按 Step 8 public metadata/envelope/job request 与 Step 6/7 operation context、stored replay surface 建立 key/digest matrix |
| 本批边界 | 只定义 key 来源、operation namespace、required digest material family、排除项、stored replay surface |
| 本批不写 | duplicate priority、in-flight 等待/过期、stored missing recovery priority、commit unknown retry order、retry/backoff、transport ack/dead-letter、测试 ID |
| 下一批 | 13.4 duplicate / in-flight / reentry handling |

本批使用 Step 8 `IdentityCommandMetadata.idempotency_key`、`IdentityInboundEventEnvelope.idempotency_key`、`IdentityJobRequest.idempotency_key` 和 `IdentityRequestDigestMarker`。Application service 只能消费 entry 已 canonicalize 的 `IdentityOperationContext.request_digest`;不得重新读取 raw request/event/job body 来计算 digest。

### 4.2 Uniform namespace and digest rules

| Rule | Formal source | Required behavior | Forbidden substitute |
|---|---|---|---|
| operation namespace | Step 6 `IdentityOperationContext.operation_name`;Step 8 command/consumer/job names | idempotency uniqueness includes operation name | raw key string alone |
| channel namespace | Step 6 `IdentityOperationContext.channel`;Step 7 `reserve(context,...)` | command, consumer, handoff callback and operations job do not cross-replay | repository guessing channel from operation name |
| public key source | Step 8 metadata/envelope/job request | command/event/job keys are mandatory for mutating/replayable paths | cursor, timestamp, source version, job cursor, source event ref |
| digest source | Step 8 `IdentityRequestDigestMarker`;Step 6 `IdentityRequestDigest` | digest comes from canonical body-free material marker, schema version and algorithm marker | raw JSON string, transport body hash, request id |
| digest comparison | Step 7 idempotency reserve + Step 12 conflict taxonomy | same key + same digest can replay if completed;different digest is conflict | compare raw body, ignore digest mismatch |
| stored replay source | Step 7 stored result/receipt/job report repositories | completed command duplicate uses generic shell + typed command envelope;consumer/callback duplicate uses typed receipt;job duplicate uses job report | current truth/projection reconstruction |
| query exclusion | Step 9/12 query no-write | query has no idempotency key, no stored result and no digest replay matrix | query idempotency record or stored query result |

### 4.3 Digest material baseline

| Material family | Include in digest when applicable | Exclude from digest |
|---|---|---|
| operation identity | operation name, channel, protocol schema version, canonical material marker ref | idempotency key, operation context ref, stored result ref |
| actor / authority seed | actor ref, system actor ref, effective command authority marker when it changes semantics | trace context, request marker ref, runtime session token |
| command target refs | member ref, lifecycle target, role/capability source refs, career source marker refs, memory/archive/handoff refs, handoff target/scope refs | generated trace/outbox/effect refs, current clock time |
| command intent fields | target state, change intent, reason refs, material marker refs, safe summary refs, explicit expected version if DTO uses it as semantic guard | raw request body, role/method/evidence body, memory body, archive package |
| inbound event identity | consumer name, binding ref, source event ref, schema version, typed source/version refs, envelope canonical payload marker | broker offset, delivery attempt, received_at, raw message headers |
| inbound payload refs | member ref, source marker refs, reference bundle refs, safe summary refs, callback handoff refs, receipt/issue marker refs | source JSON/body, callback raw receipt body, adapter response body |
| job identity | job name, job scope marker, typed input refs, explicit target refs, optional job cursor when input semantics require it | job run ref, scheduler attempt, worker host, current time |
| job material refs | maintenance scope, projection/reference/report/outbox/handoff target refs, retry family selector, policy/config marker refs that change output | page cursor used only for repository pagination, raw job log |

Digest material must be body-free and deterministic. `None` vs omitted, enum variant names, set ordering and page/input normalization must be handled by entry canonicalization before application service receives `IdentityOperationContext`.

### 4.4 Command key / digest matrix

| Operation | Key source | Operation namespace | Stable digest material | Stored replay surface | Explicit exclusions |
|---|---|---|---|---|---|
| `EstablishGlobalMember` | `IdentityCommandMetadata.idempotency_key` | command name + `Command` channel | actor, command name, schema version, optional requested/generated member ref marker, identity source ref, initial anchor/lifecycle material marker | `IdentityCommandAcceptedResultEnvelope` + `StoredIdentityOperationResult(CommandAccepted)`, or `IdentityCommandRejectedResultEnvelope` + rejected shell for replayable command rejection | request marker, trace context, created_at, generated trace/outbox/effect refs |
| `UpdateGlobalLifecycleState` | command metadata key | command name + `Command` channel | actor, member ref, target lifecycle state, lifecycle reason ref, optional risk/basis refs, canonical material marker | stored command accepted/rejected result | current lifecycle version unless DTO makes expected version semantic, resolver timestamp, governance raw decision body |
| `MaintainRoleCapabilitySummary` | command metadata key | command name + `Command` channel | actor, member ref, role/capability source ref, evidence refs, change reason, material marker, source/safe summary refs supplied by request/canonicalizer | stored command accepted/rejected result | role/capability definition body, method body, evidence body, source version as idempotency key |
| `AppendCareerRecord` | command metadata key | command name + `Command` channel | actor, member ref, work/project participation refs, career source marker ref, safe summary ref, append/correction intent, original record ref when correction | stored command accepted/rejected result | Project/WorkItem/ProjectMember body, duplicate source lookup result, generated career record ref |
| `MaintainMemoryReference` | command metadata key | command name + `Command` channel | actor, member ref, memory/archive/handoff refs, source marker, safe summary ref, reason ref, link/refresh/archive-handoff intent | stored command accepted/rejected result | memory body, embedding, archive package, callback receipt body, adapter response |
| `PrepareTraceHandoff` | command metadata key | command name + `Command` channel | actor, handoff target ref, handoff scope ref, requested trace refs, optional audit trail ref, safe material marker, visibility context marker used by command | stored command accepted/rejected result | target path/bucket/secret, trace body, audit raw log, delivery attempt |

Command digest does not include the idempotency key itself. Same command key with different digest is key reuse conflict;the exact public priority belongs to 13.4.

### 4.5 Consumer / callback key / digest matrix

| Operation | Key source | Operation namespace | Stable digest material | Stored replay surface | Explicit exclusions |
|---|---|---|---|---|---|
| `HandleRoleCapabilitySourceChanged` | `IdentityInboundEventEnvelope.idempotency_key` | consumer name + `Consumer` channel | consumer name, binding ref, source event ref, schema version, source ref, source version/safe summary/evidence marker refs, reference bundle ref when present | `IdentityConsumerReceiptEnvelope(result_kind = ConsumerReceipt)` + stored shell | broker offset, delivery attempt, received_at, raw method/evidence body |
| `HandleWorkParticipationAccepted` | envelope idempotency key | consumer name + `Consumer` channel | consumer name, binding ref, source event ref, member ref, project participation ref, work source ref, career source marker ref, safe summary ref, append reason/material marker | typed consumer receipt envelope + stored shell | WorkItem/ProjectMember body, event raw payload hash, worker ack |
| `HandleMemoryReferenceSourceStateChanged` | envelope idempotency key | consumer name + `Consumer` channel | consumer name, binding ref, source event ref, member ref, memory/archive/source refs, source state marker, safe summary ref, reference bundle ref/sidecar marker | typed consumer receipt envelope + stored shell | memory body, embedding, archive package, provider raw response |
| `HandleArchiveHandoffResult` | envelope idempotency key | callback consumer name + `HandoffCallback` channel | consumer/callback name, binding ref, source event ref, archive handoff ref, target memory relation marker, result kind, receipt/issue marker refs | `IdentityConsumerReceiptEnvelope(result_kind = HandoffCallbackReceipt)` + stored shell | archive package metadata, raw receipt body, HTTP status text |
| `HandleTraceHandoffResult` | envelope idempotency key | callback consumer name + `HandoffCallback` channel | callback name, binding ref, source event ref, handoff intent ref, target/scope refs, attempt ref, result kind, receipt/issue marker refs | handoff callback receipt envelope + stored shell | request sent log, adapter raw response, target path |

`IdentityInboundEventEnvelope.source_event_ref` is stable digest material, but it is not the idempotency key. Source duplicate markers such as `CareerSourceMarkerRef` remain business duplicate guards and cannot replace the envelope idempotency key.

### 4.6 Operations job key / digest matrix

| Operation | Key source | Operation namespace | Stable digest material | Stored replay surface | Explicit exclusions |
|---|---|---|---|---|---|
| `RebuildIdentityProjection` | `IdentityJobRequest.idempotency_key` | job name + `OperationsJob` channel | job name, system actor, job scope marker, explicit projection refs or maintenance scope, optional job cursor if input requires it, schema version | `StoredIdentityOperationResult(JobReport)` + `IdentityJobRunReport` | job run ref, scheduler attempt, page cursor from repository scan, current time |
| `RefreshExternalReferenceState` | job request key | job name + `OperationsJob` channel | job name, system actor, job scope marker, explicit reference refs / owner / kind / stale scope, optional cursor, schema version | stored job report | resolver response time, external source version as key, raw provider body |
| `RunIdentityReconciliation` | job request key | job name + `OperationsJob` channel | job name, system actor, maintenance scope, explicit target refs, finding intent/material marker, report policy marker | stored job report | raw diagnostic body, generated finding/report refs, current truth scan result |
| `PublishIdentityOutbox` | job request key | job name + `OperationsJob` channel | job name, system actor, topic selector, explicit outbox refs or pending/retryable scope marker, policy/config marker that changes selection | stored job report | publisher attempt ref, broker response, downstream consumed status |
| `DeliverTraceHandoff` | job request key | job name + `OperationsJob` channel | job name, system actor, target selector, explicit handoff refs or pending/retryable scope marker, delivery policy/config marker | stored job report | attempt ref, receipt ref generated by delivery, target raw path |
| `RetryIdentityPropagationFailures` | job request key | job name + `OperationsJob` channel | job name, system actor, retry family selector, topic/target selector, retryable marker scope, policy/config marker | stored job report | retry attempt count, backoff schedule time, terminal item current state after replay |

Job digest must be stable for the job request, not for the current contents of the selected stores. Duplicate job replay must not relist stale/pending/retryable items to recompute report refs.

### 4.7 Query exclusion matrix

| Query group | Idempotency key | Digest / replay | Required behavior |
|---|---|---|---|
| 14 query flows | none | none | repeated call reads current authorized surface |
| member/lifecycle/role/career/memory reads | none | none | visibility + repository read;no stored query result |
| summary/trace/audit reads | none | none | stable lookup/page cursor only;no trace/audit append |
| projection/reference/report/outbox/handoff operations reads | none | none | no rebuild/refresh/report/publish/deliver/retry |

Query metadata has `visibility_context_ref` and `request_marker_ref`, but these are not idempotency material. They may influence read authorization and observability, not stored replay.

### 4.8 Digest exclusion redlines

| Excluded material | Reason |
|---|---|
| idempotency key | key identifies replay bucket;digest distinguishes same request vs key reuse |
| request marker ref / operation context ref | entry identity changes per call and would break retry replay |
| trace context / random correlation ids | observability-only volatile metadata |
| received_at / requested_at / current clock / scheduler attempt | volatile metadata, not business semantics |
| generated truth/trace/audit/outbox/effect/stored/report refs created after reserve | not known before reserve;would make retry impossible |
| repository page cursor unless job input explicitly makes it semantic | pagination implementation detail, not operation identity |
| source version as optimistic version or idempotency key | external provenance, not replay namespace |
| raw request/event/job body, external body, adapter response, receipt body, secret | body-free replay and forbidden body rule |
| worker ack/dead-letter, broker offset, delivery attempt | transport handling, not application result |

### 4.9 13.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 13.3 范围 | 通过 | 本批只写 key/digest matrix,未写 duplicate priority、in-flight expiry、commit unknown order、retry/backoff 或测试 ID |
| command key 来源是否闭合 | 通过 | 6 个 command 均使用 `IdentityCommandMetadata.idempotency_key` |
| consumer/callback key 来源是否闭合 | 通过 | 5 个 consumer/callback 均使用 envelope `idempotency_key`,callback channel 区分 `HandoffCallback` |
| job key 来源是否闭合 | 通过 | 6 个 operations job 均使用 `IdentityJobRequest.idempotency_key` |
| query 是否排除幂等 | 通过 | 4.7 明确 query no key/no digest/no replay |
| digest 是否 body-free | 通过 | 4.3 / 4.8 固定 stable marker/ref material 和 raw body 排除 |
| stored replay surface 是否闭合 | 通过 | command result、typed receipt envelope、job report 均有正式 replay surface |
| 是否新增上游未定义 schema/port/state/error | 未新增 | 使用 Step 6/7/8/9/11/12 已定义 metadata、context、digest 和 stored replay surface |
| 下一批 | 13.4 | 用户审核通过后进入 duplicate / in-flight / reentry handling |

---

## 5. 13.4 duplicate / in-flight / reentry handling

### 5.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 13.4 duplicate / in-flight / reentry handling |
| 当前结论 | 已定义 reserve outcome priority、command/consumer/job replay、stored missing、commit unknown、query repeated read、outbox/handoff/retry terminal guard 和 fake parity |
| 本批边界 | 只定义 duplicate / in-flight / reentry handling 和 priority;不定义具体 retry/backoff schedule、transport ack/dead-letter、observability fields 或测试 ID |
| 下一批 | 13.5 cross-step closure / Step 14 handoff |

本批把 Step 10 的 idempotency/outbox/handoff/job states、Step 11 的 transaction visibility 和 Step 12 的 recovery classes 组合为处理优先级。任何 duplicate 或 reentry branch 都不得重跑 mutation/job、不得重构 stored replay、不得让 query 写修复。

### 5.2 Reserve outcome priority

| Priority | Condition | Required branch | Stored / write behavior | Forbidden behavior |
|---|---|---|---|---|
| 1 | entry validation fails before application facade | entry failure | no UoW;no idempotency record;no stored result/receipt/report | save rejected result or receipt before operation context exists |
| 2 | reserve returns `ReplayAvailable` and stored kind matches operation family | duplicate replay | load typed command accepted/rejected envelope, typed receipt, or job report;no mutation | parse payload, reload current truth to rebuild result, relist job targets |
| 3 | reserve returns `ReplayAvailable` but stored surface missing/wrong kind | replay consistency defect | return replay consistency/manual recovery surface available to caller | rerun command/consumer/callback/job or overwrite stored result |
| 4 | reserve returns `Conflict` or existing key has different digest | duplicate conflict | no mutation;original record remains authoritative;optional conflict marker only through loaded idempotency version | treat as noop, change old digest, save incoming raw body |
| 5 | reserve returns `InFlight` for same digest | delayed / temporarily unavailable | no mutation;no stored result for second caller | wait by hidden loop, start second writer, call resolver/publisher/job body |
| 6 | reserve returns `Reserved` | first-run application path | proceed with load/guard/mutation/job body;save replay surface before complete | complete idempotency before stored replay surface |
| 7 | reserve unavailable / repository dependency failure | dependency unavailable | rollback if UoW opened;delayed/retryable surface per Step 12 | fall back to business unique key as duplicate control |

The reserve outcome is authoritative before domain transition. Business uniqueness, duplicate source markers and terminal state guards can reject or noop the first run after reserve, but they cannot replace reserve/replay for application duplicate handling.

### 5.3 Command duplicate handling

| Branch | Required behavior | Stored result | Side-effect rule |
|---|---|---|---|
| first-run accepted | save truth, cursor, trace/audit, outbox, projection stale, effect summary, generic stored accepted shell, typed accepted envelope, then complete idempotency | `CommandAccepted` + `IdentityCommandAcceptedResultEnvelope` | all in same UoW before commit |
| first-run replayable rejected | save generic stored rejected shell + typed rejected envelope, then complete rejected idempotency if Step 12/flow classifies rejection replayable | `CommandRejected` + `IdentityCommandRejectedResultEnvelope` | no truth, no accepted trace/outbox/stale/effect |
| duplicate accepted replay | load `IdentityCommandAcceptedResultEnvelope.result` and `.effect` after generic shell kind check | existing `CommandAccepted` | no new truth/trace/audit/outbox/stale/effect |
| duplicate rejected replay | load `IdentityCommandRejectedResultEnvelope.rejection` after generic shell kind check | existing `CommandRejected` | no revalidation/domain guard rerun |
| same key different digest | return duplicate conflict | none for incoming request | original record/result authoritative |
| in-flight same digest | return delayed/temporary surface | none for second request | no second mutation |
| stored accepted/rejected shell or typed envelope missing | replay consistency defect | missing/wrong-kind/variant mismatch/effect missing reported | no current truth reconstruction |
| commit unknown after first run | check idempotency/stored result before caller retries | found stored surface may be replayed;not found remains unknown/manual | no blind retry with new key |

Command duplicate replay must return the previously stored public surface, even if current truth has since changed. That is the reason accepted effect summary, generic stored shell and typed command envelope must be saved before idempotency complete.

### 5.4 Consumer / callback duplicate handling

| Branch | Required behavior | Stored result | Side-effect rule |
|---|---|---|---|
| first-run accepted / marker update | update only owned truth/reference/marker;save typed receipt envelope + stored shell;complete idempotency | `ConsumerReceipt` or `HandoffCallbackReceipt` | trace/outbox/stale only when Step 9 branch owns it |
| first-run delayed/quarantined/noop/unsupported/rejected application outcome | save typed receipt envelope if facade reached and outcome is replayable | matching typed receipt kind | no active truth unless branch explicitly owns pending/marker state |
| duplicate consumer replay | load `IdentityConsumerReceiptEnvelope(result_kind = ConsumerReceipt)` | typed receipt + stored shell | no payload parse or source resolver call |
| duplicate callback replay | load `IdentityConsumerReceiptEnvelope(result_kind = HandoffCallbackReceipt)` | callback typed receipt + stored shell | no handoff/memory state update |
| same key different digest | return conflict/rejected receipt surface | none for incoming event | original receipt authoritative |
| in-flight same digest | delayed retry receipt/surface | none for second event | no payload parse beyond safe envelope marker |
| typed envelope missing/wrong kind | replay consistency defect | missing/wrong-kind reported | no original event/body replay |
| source duplicate after first reserve | return/store noop receipt only if Step 9 branch owns noop | typed noop receipt | business duplicate marker is not idempotency replay |

Worker ack/retry/dead-letter belongs to transport binding. It cannot be used as application duplicate result, cannot complete idempotency, and cannot substitute for `IdentityConsumerReceipt`.

### 5.5 Operations job duplicate handling

| Branch | Required behavior | Stored result | Side-effect rule |
|---|---|---|---|
| first-run succeeded/partial/failed/noop/retryable failed | save `IdentityJobRunReport` with item refs, then stored `JobReport`, then complete idempotency | `JobReport` shell + full job report | job report is replay source |
| duplicate job replay | load stored `JobReport`, then load `IdentityJobRunReport` by stored/run ref | existing job report | do not run job body |
| same key different digest | rejected/conflict job surface | none for incoming job | previous report not reused for different input |
| in-flight same digest | delayed/temporary job surface | none for second job | no target expansion or adapter call |
| stored job shell missing | replay consistency defect | missing shell reported | no relist/recompute |
| job report missing/wrong kind | replay consistency defect | missing/wrong-kind reported | no rescan projection/reference/outbox/handoff |
| job request invalid before facade | entry failure | none | no failed job report |

Job duplicate replay is report replay, not re-execution. It must not re-run projection rebuild, reference refresh, reconciliation, publish, deliver or retry selection to rebuild item refs.

### 5.6 Commit unknown handling

| Caller context | Required first check after unknown | If stored surface found | If stored surface not found | Forbidden behavior |
|---|---|---|---|---|
| command | idempotency key + stored command result/rejection | replay stored command surface | temporary unknown/manual recovery;caller may retry only after explicit recovery rule | report accepted without stored result |
| consumer/callback | idempotency key + typed receipt envelope | replay stored receipt | delayed/unknown/manual recovery | parse event again and reapply mutation |
| job | idempotency key + stored job report | replay stored job response/report | unknown/manual recovery | rerun job body or relist targets |
| entry pre-dispatch | no application idempotency exists | not applicable | entry failure remains entry-local | fabricate application stored result |
| query | no idempotency/stored result | not applicable | repeat normal read later | create query replay record |

Commit unknown recovery starts from the replay store because staged writes may or may not have committed. A retry with the same key may only proceed after reserve/replay confirms no completed/in-flight record according to the repository semantics;the service must not bypass reserve.

### 5.7 Outbox / handoff reentry guard

| Resource | Retryable states | Terminal states | Reentry behavior | Forbidden behavior |
|---|---|---|---|---|
| outbox record | `RetryableFailed` and first-time `PendingPublish` selection | `Published`, `Failed`, `SkippedByPolicy` | publish/retry job loads record with version and updates only current retryable/pending item | retry terminal failed/skipped/published, flip terminal to pending |
| outbox payload marker | immutable marker | missing marker is consistency defect | publish uses saved marker only | rebuild payload from current truth |
| handoff intent | `RetryableFailed` and first-time `PendingHandoff` selection | `Delivered`, `Failed`, `Cancelled` | deliver/retry job loads intent with version;delivered requires attempt+receipt | retry delivered/failed/cancelled intent, mark delivered from HTTP 2xx |
| retry propagation job | one retry family per job run | terminal items are not selected | reuse publish/deliver state transition rules | mix outbox/handoff families in one untyped branch |
| published/delivered query | read stored marker only | query no-write | expose state and issue/receipt markers | publish/deliver from query |

Reentry after terminal propagation state requires a new formal operation, record or intent in a later design. Step 13 does not authorize reopening the same terminal outbox/handoff row.

### 5.8 Projection / reference / reconciliation reentry guard

| Resource | Reentry allowed through | Guard | Forbidden behavior |
|---|---|---|---|
| projection state | rebuild job only | loaded projection `IdentityVersion`;formal source cursor | query rebuild, stale cursor as version |
| accepted stale mark | accepted command/consumer/callback UoW | affected projection refs from formal dependency index | infer projections by subject string |
| reference bundle | consumer or refresh job only | `ExternalReferenceRef` bundle + loaded bundle `IdentityVersion` | business source ref or source version as expected_version |
| typed sidecar | same reference bundle save | same loaded bundle version | cross-bundle sidecar update |
| reconciliation report | reconciliation job only | report-only policy and target expansion | repair truth from findings |
| maintenance scope expansion | maintenance repository | formal target catalog/index | full store scan in fake to compensate missing index |

Maintenance reentry must be idempotent by job report replay. It does not mean rebuilding/reconciling again on duplicate.

### 5.9 Query repeated-read handling

| Query condition | Handling | Forbidden behavior |
|---|---|---|
| repeated visible query | perform normal authorized read | store query result for replay |
| repeated not-visible query | return not-visible again if visibility still denies | leak existence by changing to missing/empty |
| repeated stale-visible query | return stale-visible/current committed view state | mark projection fresh |
| repeated missing/degraded query | return current missing/degraded surface | create view/ref/report or repair index |
| repeated outbox/handoff operations query | read current marker state | publish/deliver/retry item |
| repeated report query | read existing report/page | generate reconciliation report |

Query repeated-read behavior is intentionally not stable replay. It is allowed to observe current committed state;it is not allowed to perform writes to make the result nicer.

### 5.10 Expiry boundary

| Topic | Step 13 rule | Handoff |
|---|---|---|
| idempotency record expiry | `Expired` exists as a state,but this Step does not define retention duration, cleanup schedule or automatic key reuse | Step 14 config / operations policy |
| in-flight timeout | in-flight duplicate returns delayed/temporary surface;hidden waiting and timeout numbers are not defined here | Step 14 runtime/job/worker config |
| retry schedule | retryable marker state is selectable;backoff/max attempts are not defined here | Step 14 retry config |
| dead-letter / ack | transport disposition is not application duplicate result | Step 14 worker binding |

No implementation may silently reuse an expired key unless Step 14/implementation plan defines a formal retention and reuse policy that preserves stored replay and audit requirements.

### 5.11 Fake / durable duplicate parity

| Rule | Durable adapter | Fake adapter |
|---|---|---|
| reserve atomicity | unique operation/channel/key and digest comparison are atomic | same atomic outcome;no test-only bypass |
| replay missing | missing/wrong-kind stored surface returns consistency defect | no mutation rerun to make test pass |
| in-flight | second caller sees in-flight and does not execute body | fake must expose in-flight,not immediately complete |
| query no-write | read-only paths open no UoW | fake query must not create view/ref/report |
| terminal retry guard | terminal outbox/handoff rows excluded from retryable lists | fake retry selectors match durable selectors |
| job replay | duplicate job loads stored report | fake does not relist current targets |
| commit unknown | recovery uses idempotency/stored checks | fake must not assume clean rollback/success without stored surface |

### 5.12 13.4 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 13.4 范围 | 通过 | 本批只写 duplicate / in-flight / reentry handling,未写 retry/backoff schedule、transport ack/dead-letter、observability fields 或测试 ID |
| same key/same digest replay 是否闭合 | 通过 | command、consumer/callback、job 均使用 stored surface replay |
| same key/different digest 是否闭合 | 通过 | 明确 conflict,不得 noop/覆盖旧 digest |
| in-flight 是否防第二写 | 通过 | 所有入口 in-flight 均不进入 mutation/job body |
| stored missing/wrong-kind 是否闭合 | 通过 | 统一 replay consistency defect/manual recovery,不重跑 |
| commit unknown 是否闭合 | 通过 | 必须先查 idempotency/stored surface,不得盲重试 |
| outbox/handoff terminal retry 是否闭合 | 通过 | 只 retry retryable marker state;terminal 需新 formal operation |
| query repeated read 是否保持 no-write | 通过 | 5.9 明确 query 不 reserve、不 repair、不 replay |
| 是否新增上游未定义 schema/port/state/error | 未新增 | 使用 Step 6~12 既有状态、surface、repository 和 recovery class |
| 下一批 | 13.5 | 用户审核通过后进入 cross-step closure / Step 14 handoff |

---

## 6. 13.5 cross-step closure / Step 14 handoff

### 6.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 13.5 cross-step closure / Step 14 handoff |
| 当前结论 | Step 13 已完成,可以进入 Step 14 configuration / external dependency binding |
| 本批边界 | 只做 Step 6~12 闭环审计、open item closure、Step 14~16 handoff 和正式文档回填草稿 |
| 是否新增 object/port/state/error/protocol field | 未新增 |

### 6.2 Cross-step closure audit

| Closure item | Formal source | Step 13 result | Status |
|---|---|---|---|
| operation context channel/key/digest | Step 6 `IdentityOperationContext`;Step 7 reserve context;Step 8 metadata/envelope/job request | 13.3 固定 command/consumer/callback/job key 来源和 channel namespace | closed |
| request digest body-free material | Step 6 `IdentityRequestDigest`;Step 8 `IdentityRequestDigestMarker`;standard body-free rules | 13.3 固定 stable material family and exclusions | closed |
| mutable truth version source | Step 7 repository versioned read/save;Step 11 logical store | 13.1/13.2 固定 loaded `IdentityVersion`,禁止 cursor/source version/key 替代 | closed |
| append-only and aggregate behavior | Step 6 career/trace/audit/handoff objects;Step 7 append/save repos | 13.1/13.2 固定 append-only and aggregate-version append | closed |
| projection/reference/report maintenance | Step 7 projection/reference/maintenance/report repos;Step 11 transaction rules | 13.1/13.2/13.4 固定 query no-write,job no truth repair,sidecar same-bundle version | closed |
| outbox/handoff propagation | Step 6 outbox/handoff states;Step 7 publisher/handoff outcomes;Step 10 terminal rules | 13.2/13.4 固定 publish/deliver side-effect isolation and terminal retry guard | closed |
| stored replay symmetry | Step 7 stored result/receipt/job report repos;Step 8 replay surfaces;Step 11 stored replay | 13.3/13.4 固定 command result、typed receipt、job report replay,no rerun | closed |
| in-flight and conflict | Step 7 reserve outcome;Step 10 idempotency states;Step 12 error taxonomy | 13.4 固定 replay/conflict/in-flight priority | closed |
| commit unknown | Step 11 transaction visibility;Step 12 recovery | 13.4 固定 first check idempotency/stored surface,no blind retry | closed |
| query repeated reads | Step 9 query no-write;Step 12 query surface | 13.1/13.2/13.4 固定 no idempotency/no repair/no stored query result | closed |
| fake/durable parity | Step 7 fake equivalence;Step 11 parity;standard closure rules | 13.4/13.5 fixed fake must not use private map,rerun mutation or hidden repair | closed |

### 6.3 Remaining open item closure

| Open item | Closure |
|---|---|
| DDD-S13-OPEN-001 concurrency resource coverage | Closed in 13.1. Resources cover mutable truth,append-only,aggregate,projection/reference/report,outbox/handoff,replay/runtime/query exclusion. |
| DDD-S13-OPEN-002 concurrency scenario matrix | Closed in 13.2. Scenarios cover commands,consumer/callback,query,operations jobs,outbox/handoff and maintenance. |
| DDD-S13-OPEN-003 idempotency key / digest | Closed in 13.3. Command,consumer/callback and job key/digest sources are formal;query excluded. |
| DDD-S13-OPEN-004 duplicate / in-flight / commit unknown / reentry priority | Closed in 13.4. Stored replay,conflict,in-flight,stored missing,commit unknown and terminal retry guards are defined. |
| DDD-S13-OPEN-005 enter Step 14 | Closed in 13.5. Step 14 handoff items are listed below. |

### 6.4 Step 14 configuration / dependency binding handoff

| Handoff topic | Step 14 must define | Step 14 must not change |
|---|---|---|
| idempotency retention / expiry | retention duration,cleanup owner,expired-key behavior if allowed,manual recovery visibility | key source,channel namespace,digest comparison,stored replay required |
| in-flight timeout | timeout/degraded surface binding and operator policy | no second writer rule |
| digest algorithm binding | configured algorithm marker,allowed algorithm values,canonicalizer owner,version migration policy | body-free stable material set and raw body exclusion |
| retry schedule | backoff/max attempts/scheduler selection for outbox/handoff/job retryable states | retryable vs terminal state classification |
| worker transport binding | ack/retry/dead-letter mapping after application receipt | worker ack as application accepted/receipt/stored result |
| publisher/handoff adapter config | topic/target binding,timeout,controlled/disabled adapter selection | `Published` != downstream consumed,`Delivered` requires attempt+receipt |
| runtime/adapter availability | disabled/degraded/unavailable config and entry behavior | runtime config cannot create business accepted/rejected result before facade |
| external resolver config | resolver timeout/degraded policy and fake/controlled adapter binding | resolver/raw body cannot be stored;source version not optimistic version |
| job scope scheduling | configured maintenance scopes and job trigger source | job duplicate replay cannot relist current targets |
| local path dependencies | compile-time vs runtime adapter dependency classification | runtime/event/projection collaboration cannot be represented as Cargo dependency |

Configuration may select adapters, timeouts, retry cadence, retention and profiles. It must not weaken identity invariants: idempotency reserve, visibility, body-free digest, query no-write, job no-truth-repair, stored replay and fake/durable parity are non-configurable design rules.

### 6.5 Step 15 observability / audit handoff

| Observability topic | Step 15 should observe | Must not log/metric label |
|---|---|---|
| duplicate replay | operation name,channel,stored result kind,safe outcome marker | raw request/event/job body,idempotency key value,digest value as high-cardinality label |
| idempotency conflict / in-flight | safe issue/disposition,operation family | incoming raw body,actor private data |
| optimistic conflict | resource family,repository family,safe issue marker | full object body or external body |
| commit unknown | operation context ref,safe recovery class | transaction internals,secret,raw payload |
| stored replay defect | stored result ref,expected/actual stored kind as enum,safe issue marker | reconstructed body or stored private content |
| query no-write degraded | query name,disposition,resource family | found/missing detail for not-visible caller |
| outbox/handoff retryable/terminal | marker refs,state kind,issue kind,attempt/receipt marker refs where safe | adapter raw response,target path,bucket,receipt body |
| fake/durable parity | test/fake profile marker and formal outcome enum | private fake map contents |

Step 15 can add logs, metrics and audit hooks only over safe refs,enum kinds and issue markers already defined by Step 6~13. It cannot introduce new replay material or persist raw diagnostic bodies.

### 6.6 Step 16 test cut handoff

| Test cut family | Contract to verify |
|---|---|
| same key / same digest command replay | stored command accepted/rejected result replay,no second trace/outbox/effect |
| same key / different digest | duplicate conflict,no mutation,no digest overwrite |
| consumer redelivery | typed receipt envelope replay,no payload reapply |
| callback redelivery | handoff callback receipt kind replay,not normal consumer replay |
| job duplicate replay | stored job report replay,no relist/rescan/re-execution |
| in-flight reserve | second call sees delayed/temporary and does not execute body |
| stored replay missing/wrong kind | replay consistency defect,no rerun |
| commit unknown | idempotency/stored surface checked before retry |
| version conflict | loaded `IdentityVersion` conflict,no last-write-wins |
| business unique conflict | unique conflict does not substitute stored replay |
| query repeated read | no UoW,no idempotency,no repair writes |
| outbox dual publisher | one versioned state update wins;no truth rollback |
| handoff delivered guard | delivered requires attempt + receipt marker |
| terminal retry guard | failed/skipped/published/delivered/cancelled not retried |
| reference sidecar version | sidecar save uses same bundle version,source version rejected |
| fake/durable parity | fake follows same reserve/version/query/retry rules,without private maps |

Step 16 should assign concrete test IDs later. Step 13 intentionally does not define test IDs or automation scripts.

### 6.7 Implementation redlines carried forward

| Redline | Stop condition |
|---|---|
| no private replay reconstruction | implementation attempts to rebuild command/receipt/job replay from current store |
| no query repair | query code opens write UoW,marks projection/reference state,or saves stored result |
| no key substitution | key/digest/cursor/source version/page cursor/job run ref are mixed |
| no fake shortcut | fake uses private map,default visible,default delivered/published,or mutation rerun |
| no terminal reopen | terminal outbox/handoff/idempotency state is retried or reopened without formal operation |
| no raw body persistence | raw request/event/external/adapter/receipt/log/config body enters digest,stored replay,issue or report |
| no config bypass | config flag skips idempotency,visibility,body-free,query no-write or job no-repair |

### 6.8 13.5 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 Step 13 全部批次 | 通过 | 13.0~13.5 均已写入 |
| 是否关闭 Step 12 handoff | 通过 | §6.2 覆盖 version/unique/stored replay/in-flight/commit unknown/query/outbox/handoff/forbidden body |
| 是否保持 1:1 真相源 | 通过 | 未新增 schema、port、state、error 或 protocol field |
| 是否有 unresolved blocker | 无 | 当前材料足以进入 Step 14 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | Step 14 | configuration / external dependency binding |

---

## 7. 回填草稿

正式 `03-详细设计.md` 第 12 章后续可按下列结构装配:

```md
## 12. 并发、幂等与重入保护

本章定义 L1-identity 的并发资源、幂等键、稳定 digest、重复处理、in-flight protection、commit unknown recovery 和 job/outbox/handoff reentry guard。并发保护必须遵守 query no-write、duplicate no-rerun、stored replay only、body-free digest 和 fake/durable parity。

### 12.1 Concurrency resource inventory

并发资源分为 mutable versioned truth、append-only truth/history、versioned aggregate + entry append、read model / projection、external reference bundle / sidecar、report-only maintenance、propagation marker、replay / idempotency support、runtime / entry technical marker 和 query read-only surface。

Mutable truth 更新必须使用 loaded `IdentityVersion`。Append-only record 不覆盖旧 material。Projection/reference/report 只能由 accepted stale side effect 或 maintenance job 更新。Outbox/handoff 只表达 propagation marker,失败不回滚 accepted truth。Idempotency / stored replay surface 是 duplicate replay 的唯一来源。Query 重复读取不创建 idempotency、不写 trace/audit、不修 projection/reference/report/outbox/handoff。

### 12.2 Concurrency scenario matrix

Command、consumer/callback 和 operations job 必须先 reserve idempotency,再进入 mutation/job body。Optimistic conflict 使用 loaded version 失败处理;business unique conflict 不等于 duplicate replay。Consumer/callback redelivery 通过 typed receipt envelope replay。Operations job duplicate replay 使用 stored job report,不得重跑 body。Query repeated reads are current authorized reads only.

### 12.3 Idempotency key and digest matrix

Command key 来自 `IdentityCommandMetadata.idempotency_key`。Consumer/callback key 来自 `IdentityInboundEventEnvelope.idempotency_key`,并按 `Consumer` 或 `HandoffCallback` channel 命名空间化。Operations job key 来自 `IdentityJobRequest.idempotency_key`。Digest 来自 body-free `IdentityRequestDigestMarker`,包含稳定 operation、actor、target ref、typed material marker、event/job scope 等语义字段,排除 idempotency key、request marker、trace context、current time、generated refs、raw body、transport ack 和 adapter response。

### 12.4 Duplicate, in-flight and reentry handling

Reserve priority: entry failure no-store;replay available loads stored surface;stored missing/wrong-kind is replay consistency defect;different digest is duplicate conflict;in-flight same digest returns delayed/temporary surface;reserved first-run may execute. Completed duplicate replay never re-runs mutation/job. Commit unknown must check idempotency/stored surface before retry. Outbox/handoff retry only selects retryable states;terminal states require a new formal operation. Query repeated reads remain no-write.

### 12.5 Cross-step concurrency/idempotency audit

Step 13 closes Step 6~12 key/digest/replay/version/query/fake-parity boundaries and hands Step 14 the remaining configuration-only decisions: idempotency retention, in-flight timeout, digest algorithm binding, retry schedule, worker transport binding, adapter timeout/availability and job scheduling. Configuration cannot change identity invariants.
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

---

## 8. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S13-OPEN-001 | identity 并发冲突资源是否完整覆盖 truth、append-only、sidecar、projection/reference/report、outbox/handoff、stored replay | 13.1 | 已闭合 |
| DDD-S13-OPEN-002 | command / consumer / callback / job / outbox-handoff / maintenance 的并发场景和控制方式是否可落码 | 13.2 | 已闭合 |
| DDD-S13-OPEN-003 | 每个 command、consumer/callback、job 的 idempotency key 和 digest stable input 是否可计算 | 13.3 | 已闭合 |
| DDD-S13-OPEN-004 | same digest replay、different digest conflict、in-flight、stored missing、commit unknown 和 reentry priority 是否闭合 | 13.4 | 已闭合 |
| DDD-S13-OPEN-005 | Step 13 是否可以进入 Step 14 config / deployment binding | 13.5 | 已闭合 |

---

## 9. 进入下一步条件

进入 Step 14 前必须满足:

- 用户审核通过 Step 13。
- Step 14 只写 configuration references and external dependency binding,不得新增业务 object、port、state、error 或 protocol field。
- Step 14 需要读取架构边界、Step 5 module axis、Step 7 adapter/facade contracts、Step 13 handoff 和配置设计文档。
- Step 14 不得用配置改变 idempotency reserve、digest stable material、query no-write、job no-truth-repair、terminal retry guard 或 fake/durable parity。
