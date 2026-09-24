# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节：`05-测试方案.md` §7
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 7 |
| current_module | `test_data:repeatable_fixture_isolation_and_fault_profiles` |
| gate_status | `pass_for_step_08` |
| gate_reason | 18 个 P0 切口的用例前置均映射到可重复数据集；基础、边界、异常、并发、恢复、配置、redaction 和禁止字段数据均有独立构造、隔离和清理规则；fake/controlled/blocked 边界无 unresolved 冲突。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 8 |

本 Step 只定义数据契约：数据集类别、构造规则、隔离键、清理策略和外部替身边界。`DS-RUN-*`、seed、fixture、canary、fault profile 和数据值均为计划标识，不表示实现仓、文件、数据库记录、artifact、report、run_id 或测试结果已经存在。

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 6 的每个 P0 用例前置条件收敛为可重复的数据集，并回答：

1. 哪些基础 refs、对象、状态和协议 envelope 必须存在；
2. 哪些非法、边界、并发、commit-unknown、依赖失败和 redaction 数据必须单独构造；
3. 如何防止跨测试运行、跨 operation、跨 generation 和跨 profile 污染；
4. 哪些数据只可由 fake/controlled adapter 提供，哪些正向路径必须保持 blocked；
5. 如何清理本地语义数据、fault journal 和敏感 canary，且不依赖人工临时造数；
6. 每个 P0 用例能否反查一个稳定数据集和明确的清理动作。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `05_test_plan_step_06_cases.md` | 提供 `TC-RUN-*` 用例、正式断言和数据前置候选。 |
| `03_ddd_step_06_object_contracts.md` | 提供 `ReleaseSelection`、`AcquisitionTask`、`IntegrityPosture`、`MaterialCacheEntry`、`RunIntent`、`ControlIntent`、`ProtectionGuard`、`RecoveryCase`、`OutputPreview`、`FailureDiagnosis`、`HandoffPosture`、entry/worker/job/infra carriers。 |
| `03_ddd_step_08_protocol_contracts.md` | 提供 11 Command、12 Query、4 Consumer、5 Job 的有限 DTO、header、receipt、report 和 safe view。 |
| `03_ddd_step_09_function_flows.md` | 提供每个 flow 的读写顺序、外部 I/O、no-write/no-parse 和 report 触点。 |
| `03_ddd_step_10_state_matrix.md` | 提供合法/非法 state seed 组合和技术状态边界。 |
| `03_ddd_step_11_persistence_consistency.md` | 提供 expected version、UoW、append unique、projection generation 和 stored result 数据需求。 |
| `03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md` | 提供 typed failure、duplicate、digest、claim/checkpoint、unknown/recovery 数据向量。 |
| `03_ddd_step_14_config_dependencies.md`、`04-配置设计.md` §6～§12 | 提供四个 profile、七域 strict JSON、builder/readiness、redaction 和 failure 数据。 |
| `03_ddd_step_15_observability_audit.md` | 提供 safe output、低基数标签、audit/trace 分层和 forbidden-field canary 需求。 |

### 2.3 非目标

- 不创建 fixture 文件、数据生成器、seed 脚本、数据库、缓存、事件总线、真实外部资源或测试仓。
- 不把上游 Release、Governance、Sandbox、Runtime、Observability、Archive 的正文、secret、私有 DTO 或 owner truth 复制进 Runner 数据集。
- 不用人工编辑共享数据、不用 wall-clock/PID/path/random value 作为稳定 identity，不依赖 `latest` 或隐式默认。
- 不把 `test-deterministic` 数据移入 `local-safe`、`integration-pending` 或 `product-pending`；不以 fake positive 关闭 `RUN-UP-*` blocker。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些基础数据必须存在？ | 一个 `test_run_ref` 隔离壳、trusted `ActorContext`/scope/platform refs、exact release/version/generation、Runner-owned object seed、protocol metadata、stored result/report/receipt、projection identity/version 和 config snapshot。所有正文只用 opaque ref 或 bounded redacted marker。 |
| 哪些边界、异常、并发和恢复数据必须单独构造？ | 缺 metadata、隐式 selector、scope/binding/generation/version 冲突、terminal state、digest mismatch、source/adapter unavailable、commit unknown、missing result、claim/checkpoint race、projection generation mismatch、redaction failure、forbidden-field canary 和 private-dependency violation 均使用独立数据集。 |
| 如何隔离测试运行？ | 根键为计划中的 `test_run_ref`；下层按 `operation_namespace`、actor/scope、selection generation、object ref、idempotency key、job run/claim、projection generation、consumer source/schema/dedup 和 fault case 分区。实际字段名/存储实现待 07 与实现仓 authority。 |
| 如何清理？ | semantic fake/in-memory 数据按 run namespace 丢弃；controlled adapter journal、write spy、clock/id/digest registry、redaction canary 和 header-only receipt 单独 reset/drop；未来 durable store 只允许 run-scoped cleanup 或明确 rollback，不能用全库 truncate 猜测。 |
| 哪些外部依赖使用 fake/stub/controlled/real-like？ | `test-deterministic` 使用显式 fake/controlled semantic ports；`local-safe` 只验证 blocked UX 和本地边界；`integration-pending`/`product-pending` 的真实正向 owner、平台、SDK、durable parity 保持 blocked，不能以 real-like fixture 冒充真实证据。 |
| 每个 P0 前置能否稳定构造？ | 能。18 个切口均映射至 §6；无法由正式对象/DTO/state 构造的情况必须回写 03，而不是临时增加字段或状态。 |

## 4. 数据构造与隔离总规则

### 4.1 稳定身份与时间规则

| 数据维度 | 构造规则 | 禁止规则 |
|---|---|---|
| 测试运行根 | 由测试 harness 在启动时生成或注入 opaque `test_run_ref`；正式证据阶段再映射到固定 `<run_id>` | 不把 `latest`、当前目录名或 wall-clock 文本当正式引用 |
| 领域对象 ID/ref | 使用显式 deterministic ID provider 或 fixture registry；同一 seed 可重建同一 nominal mapping | 不使用 PID、端口、路径、随机 UUID 或隐式自增作为语义输入 |
| 时间/freshness | 使用 `clockConnectivityBindingRef` 对应的 deterministic clock profile，按用例注入相对时间序列 | 不用机器当前时间推导 generation、digest、lease 或 source version |
| canonical digest | 使用 03/13 约定的 stable-field 输入；具体算法保持 pending | 不把 trace、request id、timestamp、retry、raw body、PID/port 纳入 digest |
| opaque source/ref | 只保存类型、scope、version/freshness/visibility 和 redacted marker | 不保存 owner body、secret、credential、完整 URL/path、stdout/stderr |

### 4.2 共享数据生命周期

```text
[test_run_ref]
      |
      +--> [baseline refs/object seeds]
      +--> [per-CUT mutation/fault namespace]
      +--> [call journal / write spy / stored safe surface]
      +--> [assertion snapshot candidate]
      |
      +--> [teardown: reset adapters -> drop run namespace -> erase canary]
```

关键说明：该图表达测试数据的逻辑生命周期，不表达数据库、文件系统、容器或 CI 拓扑；外部 positive seam 仍需正式 authority，不能由数据集本身制造 readiness。

## 5. 数据集总表

| 数据集 | 用途 | 构造方式 | 根隔离键 | 清理方式 | 关联切口 |
|---|---|---|---|---|---|
| `DS-RUN-BASE-001` | 全部用例的 run namespace、profile、safe clock/id/digest context | deterministic harness seed + `test_run_ref` | `test_run_ref` | 丢弃 run namespace，reset harness | 全部 |
| `DS-RUN-ACTOR-001` | trusted actor/scope/platform/session/context metadata | typed `ActorContext`/`RunnerContextRef` builder；只含 refs | `test_run_ref/actor_ref/scope_ref` | drop namespace | 01、10、13、14、16 |
| `DS-RUN-SELECT-001` | exact selection happy/Current/blocked/stale/invalidation vectors | `ReleaseSelection` + `SelectionGeneration` builder；固定 release/version/scope/basis | `test_run_ref/selection_id/generation` | drop selection/material refs | 01、02、03、05、09 |
| `DS-RUN-SELECT-NEG-001` | implicit selector、scope/generation/authority mismatch | 从 valid DTO 做单一 mutation；每个 case 独立 | `test_run_ref/case_id` | discard negative seed | 01、10、13 |
| `DS-RUN-MATERIAL-001` | acquisition、integrity、cache 轴组合 | `AcquisitionTask`、`IntegrityPosture`、`MaterialCacheEntry` builders | `test_run_ref/task_ref/cache_entry_ref` | drop local material metadata/quarantine marker | 02、03、06、09、15 |
| `DS-RUN-MATERIAL-NEG-001` | transfer/integrity/authority drift、digest/signature/platform mismatch | valid material seed + one fault/mutation | `test_run_ref/task_ref/fault_case_id` | reset verifier/source journal，drop metadata | 02、07、12 |
| `DS-RUN-RUN-001` | qualified binding、resource request、RunIntent lifecycle | exact selection + qualified material semantic binding + bounded resources | `test_run_ref/run_intent_id/operation_key` | drop intent/result/recovery refs | 03、04、05、11 |
| `DS-RUN-CONTROL-001` | Start/Stop/Cancel/Cleanup intent and owner basis | `ControlIntent` + `OwnerStateBasis`/`OwnerCleanupBasis` safe refs | `test_run_ref/control_intent_ref/basis_ref` | drop local intent/receipt; reset controlled adapter | 04、06、07 |
| `DS-RUN-RESOURCE-001` | bounded resource observation and protection guard | `ResourceObservation` + five protection input axes | `test_run_ref/resource_observation_id/guard_ref` | drop observation/guard markers | 03、05、06、15 |
| `DS-RUN-RECOVERY-001` | Frozen/Querying/ManualReview/Reconciled/Conflict/Closed cases | `RecoveryCase` builder with expected basis and subject refs | `test_run_ref/recovery_case_id/basis_ref` | drop case/readback journal | 03、04、05、07、11、12 |
| `DS-RUN-PRESENTATION-001` | bounded preview/diagnosis/handoff safe content | `OutputPreview`/`FailureDiagnosis`/`HandoffPosture` with redacted marker corpus | `test_run_ref/preview_ref/diagnosis_ref/handoff_id` | erase presentation namespace and canary | 08、09、14、17 |
| `DS-RUN-PROTOCOL-001` | valid finite Command/Query/Consumer/Job envelopes | canonical DTO builders from 03 §8; metadata supplied separately | `test_run_ref/protocol_family/schema_case` | no persistent cleanup; reset builders | 10、13、14、15 |
| `DS-RUN-PROTOCOL-NEG-001` | missing/duplicate/unknown fields, mismatched variant/name/schema | copy valid envelope and mutate exactly one boundary | `test_run_ref/protocol_case_id` | discard envelope; no body retention | 10、13、14 |
| `DS-RUN-IDEMP-001` | Absent/Reserved/Completed/Conflict records and stored result | `RunnerIdempotencyRecord` + exact digest + typed stored surface | `test_run_ref/operation_namespace/idempotency_key` | drop result/idempotency namespace | 03、04、07、09、11、12、15 |
| `DS-RUN-UOW-001` | expected version, append unique, commit-unknown and rollback faults | controlled repository/UoW fault profile with stage markers | `test_run_ref/operation_ref/fault_case_id` | reset UoW journal, drop local writes | 03、07、09、11、12 |
| `DS-RUN-PROJECTION-001` | existing section identity, generation/version and stale/degraded views | `RunnerReadSection` committed seed + generation vectors | `test_run_ref/projection_ref/composition_generation` | drop projection namespace | 05、09、12、15 |
| `DS-RUN-CONSUMER-HEADER-001` | four header-first Consumer families | trusted header-only envelope with source/schema/event/order/dedup fields | `test_run_ref/consumer_name/event_ref/dedup_key` | drop receipt namespace; reset worker loop | 10、14、18 |
| `DS-RUN-CONSUMER-NEG-001` | missing/conflicting header, unsupported version, strict duplicate | independent header mutation; payload remains opaque/absent | `test_run_ref/consumer_case_id` | erase header/receipt seed | 14、18 |
| `DS-RUN-JOB-001` | five Job entry/claim/checkpoint/report variants | `RunnerOperationsJobEntry`/claim/checkpoint/report typed builders | `test_run_ref/job_kind/job_run_ref/claim_ref` | release/drop local job namespace; reset worker | 07、15 |
| `DS-RUN-JOB-FAULT-001` | claim race, stale checkpoint, mixed outcome, report commit unknown | job seed + isolated fault stage | `test_run_ref/job_run_ref/fault_case_id` | reset claim/checkpoint/report journal | 07、11、12、15 |
| `DS-RUN-CONFIG-001` | four strict profile documents and validated snapshot | document builder with seven top-level domains and opaque refs | `test_run_ref/profile/config_case_id` | discard config snapshot; reset fixture registry | 02、08、10、16 |
| `DS-RUN-CONFIG-NEG-001` | schema/profile/ref/slot/cross-field/limit/redaction failures | one invalid mutation per case; no fallback document | `test_run_ref/profile/case_id` | discard invalid snapshot; no builder state reuse | 08、16、18 |
| `DS-RUN-OBS-001` | safe logs/metrics/trace/audit/receipt/report corpus | structured safe carriers from representative semantic outcomes | `test_run_ref/record_kind/operation_ref` | drop output corpus; reset sinks | 08、17、18 |
| `DS-RUN-OBS-NEG-001` | forbidden-field and high-cardinality canaries | synthetic sentinel values in isolated output fixture only | `test_run_ref/leak_case_id` | erase canary immediately after scan; never persist shared | 08、17 |
| `DS-RUN-BOUNDARY-001` | private dependency/event residue and cross-axis shortcut probes | call graph/config/import fixture or controlled call log | `test_run_ref/audit_case_id` | discard graph/log; reset spies | 10、13、15、16、17、18 |

## 6. 基础数据集与构造规则

### 6.1 `DS-RUN-BASE-001`、Actor/Context/Selection

| 数据集 | 必须构造的正式数据 | 构造约束 | 不得构造 |
|---|---|---|---|
| `DS-RUN-BASE-001` | explicit `test_run_ref`、profile ref、deterministic clock/id/digest provider refs、operation namespace | provider family 与 `test-deterministic` profile 一致；所有下游 seed 显式携带 run namespace | production config、真实 credential、baseline/commit/run result |
| `DS-RUN-ACTOR-001` | `ActorContext`、`RunnerScopeRef`、`PlatformContextRef`、`RunnerCommandMetadata`/`RunnerQueryMetadata` | actor/scope 由 trusted boundary 注入；body 不重复携带；每个 actor 只在一个 run namespace 可见 | raw identity profile、权限数据库正文、owner token |
| `DS-RUN-SELECT-001` | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection`；Current/Blocked/Stale/Invalidated seed | `ReleaseRef`、`ArtifactVersionRef`、scope、generation、authority posture 一一对应；successor generation 显式 predecessor | `latest/default/newest/tag/branch` selector、由 cache 推断 authority |
| `DS-RUN-SELECT-NEG-001` | 缺字段、scope mismatch、generation mismatch、authority unavailable/revoked/expired case | 每个负向 case 只改变一个稳定输入；保留原 valid seed 供对照 | 组合多个缺陷导致无法定位的“万能坏数据” |

### 6.2 Material、run、control、resource、recovery

| 数据集 | 正向/语义 seed | 独立负向/恢复 seed | 外部替身与清理 |
|---|---|---|---|
| `DS-RUN-MATERIAL-001` | `AcquisitionTask` 的 `Absent/Resolving/Transferring/Paused/Complete`；`IntegrityPosture` 的 `Pending/Verifying/Verified`；`MaterialCacheEntry` 的 `Quarantined/Qualified` | Invalid/Stale/Blocked integrity、authority drift、transfer ambiguous、terminal pause/resume | source/verifier/cache 为 controlled semantic ports；drop metadata，quarantine marker 不保留正文 |
| `DS-RUN-MATERIAL-NEG-001` | digest/signature/platform result mismatch、missing manifest/authority, stale binding | timeout/commit unknown、C02 invalidation race、cancel after ambiguous effect | verifier/source fault journal reset；不得复用 happy seed隐藏 fault |
| `DS-RUN-RUN-001` | exact `RunnerQualifiedMaterialBinding`、safe `ProtectionGuard`、bounded `RunnerRequestedResourceSet`、RunIntent `Draft/Submitting` | unqualified binding、resource conflict、adapter unavailable/timeout、same/different digest | Sandbox remains controlled/blocked; no process/PID/port data |
| `DS-RUN-CONTROL-001` | `ControlIntent` Start/Stop/Cancel、`OwnerStateBasis` and `OwnerCleanupBasis` with refs only | stale basis、ACK-only、timeout/unknown、cleanup discriminator mismatch | Sandbox/Runtime adapter is controlled semantic stub; no private implementation or owner body |
| `DS-RUN-RESOURCE-001` | bounded `ResourceObservation` with `LocalResourcePosture` and `ProtectionGuard` five axes | missing/stale/conflict lease/capture/handoff/retention/orphan; candidate + unknown guard | platform/Sandbox observation fake; no destructive release; reset guard journal |
| `DS-RUN-RECOVERY-001` | RecoveryCase subjects, expected basis, `Frozen/Querying/ManualReview` and controlled terminal shape | owner read unavailable, commit unknown, missing result, gap, closed/not-visible | readback fake only; no automatic replay/resend/reclaim/resume; drop case namespace |

### 6.3 Presentation and protocol data

| 数据集 | 构造规则 | 安全边界 |
|---|---|---|
| `DS-RUN-PRESENTATION-001` | bounded `OutputPreview`/`FailureDiagnosis`/`HandoffPosture` values with source/freshness/visibility and redacted markers | values are synthetic safe summaries; no raw output, secret, path, URL, PID, port, socket, stack trace or evidence body |
| `DS-RUN-PROTOCOL-001` | all finite Command/Query/Consumer/Job variants using canonical builders; metadata and body assembled separately | variant/name/body and metadata match; no open generic dispatch; no transport-specific status as truth |
| `DS-RUN-PROTOCOL-NEG-001` | missing required metadata, wrong operation variant, unsupported schema, over-bound page/body, malformed nominal ref | invalid envelope is discarded before repository/UoW/port calls; payload is never retained in negative seed |

## 7. 并发、幂等、事务与恢复数据

### 7.1 Idempotency and stored-result bundles

| 数据集 | seed 组合 | 必须可触发 | 隔离/清理 |
|---|---|---|---|
| `DS-RUN-IDEMP-001/absent` | no record + stable operation input | first reserve path | operation namespace; drop after case |
| `DS-RUN-IDEMP-001/reserved` | `RunnerIdempotencyState::Reserved` with same key/name/digest, no result | in-flight retry → `InProgress/Unknown`; no takeover | key + fault case; reset reservation fake |
| `DS-RUN-IDEMP-001/completed` | `Completed` plus complete typed stored result/report/receipt | same digest exact replay, zero domain/port/job calls | result ref + key; drop both atomically |
| `DS-RUN-IDEMP-001/conflict` | same key, different stable digest/name/channel | `IdempotencyConflict`; original record immutable | separate conflict case; no overwrite |
| `DS-RUN-IDEMP-001/missing-result` | Completed marker with missing/wrong-kind result | `ConsistencyUnknown` + RecoveryCase; no recompute | corruption case never merged with happy seed; discard after assertion |

Digest comparison vectors must vary one stable business field at a time. A paired control vector changes only trace, request ref, timestamp, retry count or generated ID and must retain the same digest; raw body/PID/port/path vectors are rejected before digesting.

### 7.2 UoW, version and generation fault profiles

| Fault profile | 注入位置 | 数据与断言 | 清理 |
|---|---|---|---|
| `FAULT-RUN-UOW-RESERVE` | idempotency reserve | no local mutation/external call before successful reserve | reset reservation journal |
| `FAULT-RUN-UOW-VERSION` | expected-version save | `VersionConflict`; current object/result preserved; no LWW | reset repository journal |
| `FAULT-RUN-UOW-APPEND` | trace/history/marker append | append unique; accepted write set does not partially expose | drop append journal |
| `FAULT-RUN-UOW-COMMIT-UNKNOWN` | terminal commit response | `Unknown` + RecoveryCase; no resend/reclaim/replay | erase ambiguity marker after case |
| `FAULT-RUN-PROJECTION-GENERATION` | J05 section replace | only existing identity + matching generation/version writes; mismatch no-write | drop projection seed |
| `FAULT-RUN-CLAIM-CHECKPOINT` | Job claim/checkpoint version | claim conflict/checkpoint unknown; no auto reclaim/resume | reset claim/checkpoint journal |

Fault profiles are mutually exclusive unless a specific test explicitly declares a composed vector. A composed vector must preserve the first observable failure and cannot use a later fault to conceal a missing guard.

## 8. Consumer、Job、配置与观测数据

### 8.1 Header-first Consumer data

| 数据集 | 构造 | 预期可达结果 | 禁止数据 |
|---|---|---|---|
| `DS-RUN-CONSUMER-HEADER-001` | E01~E04 trusted header：source family、schema version、event ref、subject/source attribution、order marker、dedup key、trace ref | complete header + no authorized payload → `Blocked/UnsupportedVersion/Rejected`; exact stored receipt → `Duplicate` | 不放 payload body；不生成 payload digest；不设置 owner cursor/ACK success |
| `DS-RUN-CONSUMER-NEG-001` | each missing/conflicting header and unsupported version as separate mutation | header-first zero payload read/parse/hash/store/ACK | 不以默认 source/subject/dedup 补齐；不把 `RunnerConsumerItemDisposition` 伪造 Unknown variant |
| `DS-RUN-CONSUMER-NEG-001/duplicate` | trusted header exactly matches complete stored receipt | strict `Duplicate` replay only | incomplete/conflicting receipt must be Blocked/consistency error, not guessed duplicate |

### 8.2 Job data bundles

| Job | canonical seed | 独立 fault/edge data | 关键清理 |
|---|---|---|---|
| `AcquireAndVerifyMaterialJob` | exact task/binding/authority basis + bounded checkpoint | source unavailable, digest mismatch, checkpoint stale, mixed per-stage result, commit unknown | reset source/verifier/cache/checkpoint journal; drop report |
| `EvaluateCacheEvictionJob` | scope/page + candidate + protection observation | active/stale/unknown guard, capacity observation missing, candidate race | no delete; drop candidate/report |
| `ReconcileRunnerStateJob` | eligible RecoveryCase + expected state/basis | owner read unavailable, basis mismatch, ambiguous readback, manual-review case | no owner mutation; drop reconciliation report/case |
| `RefreshSafeDiagnosisJob` | bounded subject refs + redaction-ready source markers | one unsafe item, redaction unavailable, source partial | erase canary; no raw fallback |
| `RefreshVisibleSourcesJob` | existing section identity + expected composition generation + source kind set | missing identity, generation/version mismatch, one source degraded | no upsert; drop section/report journal |

All Job seeds include `job_kind`, `job_run_ref`, idempotency key, actor, trace, requested time from deterministic clock, basis ref, bounded page/batch and claim/checkpoint version. A Job seed never contains owner lease as a substitute for local claim and never contains a global event/outbox target.

### 8.3 Configuration profile data

| Profile | 允许的数据 | 必须拒绝/阻断的数据 | 关联用例 |
|---|---|---|---|
| `local-safe` | explicit strict document、logical local refs、safe limits、mandatory redaction、disabled/blocked external slots | success fake for owner/Sandbox/Runtime、implicit profile/default、raw endpoint/secret | `TC-RUN-CFG-001/004/006` |
| `test-deterministic` | explicit fixture registry ref、fixed clock/id/digest、semantic fake stores/ports、blocked/unknown outcomes | missing fixture、non-test fake family、raw fixture body in config | `TC-RUN-CFG-001/002/006` |
| `integration-pending` | immutable document、opaque controlled binding refs、per-slot pending markers | fake masquerading as real, unresolved required slot treated Ready | `TC-RUN-CFG-004/006` |
| `product-pending` | approved-document-shaped refs only; no claim of readiness | any unapproved artifact, raw material, fake fallback, unknown numeric authority | `TC-RUN-CFG-006` |

Invalid config vectors are single-failure mutations over a valid seven-domain document: unknown/duplicate key, wrong schema/profile, missing core store, duplicate adapter slot, invalid finite limit, redaction ref failure, test fixture in non-test profile, feature/ref mismatch, and digest drift. No invalid document may fall back to an earlier document or implicit default.

### 8.4 Observability and forbidden-field data

`DS-RUN-OBS-001` contains only structured safe fields: operation kind, typed local refs, disposition, bounded duration class, source/freshness class, issue/recovery ref and diagnostic ref. `DS-RUN-OBS-NEG-001` uses non-sensitive synthetic canaries labelled as secret/body/path/URL/PID/port/stack categories solely inside an isolated scanner input; the canary is never written to shared Runner truth or formal evidence.

Metric vectors vary actor, subject, request, result, trace, URL, topic and free text independently. Every such high-cardinality value must be rejected or omitted; finite command/query/job/disposition labels remain allowed. Accepted local transitions get accepted trace/history; rejected/blocked/duplicate/failed data gets only operational marker/metric/report.

## 9. 按测试切口的数据前置映射

| 切口 | 用例范围 | 主数据集 | 独立负向/故障数据 | 替身 | 清理 |
|---|---|---|---|---|---|
| `context_selection_exact_binding` | `TC-RUN-CTX-001~006` | BASE、ACTOR、SELECT | SELECT-NEG、UOW-VERSION | context/authority controlled read | run namespace + journal |
| `material_acquisition_integrity_axes` | `TC-RUN-MAT-001~007` | SELECT、MATERIAL | MATERIAL-NEG、UOW-COMMIT-UNKNOWN | source/verifier/cache fake | material metadata + fault reset |
| `run_intent_acceptance_boundary` | `TC-RUN-REQ-001~006` | RUN、SELECT、MATERIAL、RESOURCE、IDEMP | CFG-NEG、UOW-COMMIT-UNKNOWN | Sandbox controlled/blocked | intent/result/recovery namespace |
| `control_intent_result_separation` | `TC-RUN-CTL-001~005` | CONTROL、RUN | control basis/timeout/idempotency faults | Sandbox/Runtime semantic stub | intent/receipt journal |
| `owner_projection_truth_attribution` | `TC-RUN-OWN-001~005` | RUN、PROJECTION | owner unavailable/stale/mismatch | Runtime safe-read fake | projection seed + read journal |
| `resource_cleanup_guard` | `TC-RUN-RES-001~006` | RESOURCE、CONTROL、MATERIAL | guard missing/stale/conflict | platform/Sandbox observation fake | guard/candidate/report |
| `unknown_recovery_manual_review` | `TC-RUN-REC-001~006` | RECOVERY、IDEMP、UOW | commit unknown/result missing/readback unavailable | readback fake | recovery/report namespace |
| `bounded_redacted_presentation` | `TC-RUN-PRE-001~006` | PRESENTATION、OBS | OBS-NEG、redaction failure | redaction controlled fake | erase canary/output corpus |
| `query_read_surface_no_write` | `TC-RUN-QRY-001~006` | PROJECTION、SELECT、MATERIAL、RUN、RECOVERY | reconnect/cache-miss/degraded vectors | write spies, no-write repo | drop read seed/reset spies |
| `protocol_secondary_type_closure` | `TC-RUN-CON-001~006` | PROTOCOL | PROTOCOL-NEG | no external dependency | discard envelopes |
| `command_ordering_and_duplicate` | `TC-RUN-IDM-001~006` | IDEMP、RUN、SELECT | reserved/missing-result/conflict digest | result/idempotency fake | drop result + key namespace |
| `versioned_uow_commit_unknown` | `TC-RUN-UOW-001~006` | UOW、PROJECTION、IDEMP | all UOW/PROJECTION faults | repository/UoW fake | reset journals/drop writes |
| `entry_actor_scope_dispatch` | `TC-RUN-ENT-001~005` | ACTOR、PROTOCOL | scope/route/metadata negative | entry dispatch fake | drop entry refs |
| `consumer_header_first_negative` | `TC-RUN-CNS-001~006` | CONSUMER-HEADER | CONSUMER-NEG | worker/receipt fake | drop header/receipt |
| `job_claim_checkpoint_report` | `TC-RUN-JOB-001~008` | JOB、IDEMP | JOB-FAULT, UOW-COMMIT-UNKNOWN | operations repo/job adapter fake | release claim/drop report |
| `config_builder_readiness_layers` | `TC-RUN-CFG-001~006` | CONFIG | CONFIG-NEG | config/builder controlled registry | discard snapshot/reset registry |
| `observability_forbidden_field_boundary` | `TC-RUN-OBS-001~006` | OBS | OBS-NEG、BOUNDARY | safe sink/write scanner | erase corpus/reset sink |
| `cross_axis_non_escalation_and_event_zero` | `TC-RUN-BND-001~006` | all baseline datasets | BOUNDARY call graph/event residue | call-log/static graph fixture | discard graph/reset spies |

## 10. 数据集停审记录

| 数据族 | 可重复构造 | 隔离键完整 | 清理明确 | fake/controlled/blocked 边界 | 结论 |
|---|---|---|---|---|---|
| baseline/actor/context/selection | 是，typed builder + deterministic provider | `test_run_ref` + actor/scope/object/generation | run namespace drop | owner authority 只 semantic/blocked | 通过 |
| material/integrity/cache | 是，轴分离 seed | task/cache/binding/fault | metadata/journal reset | source/verifier positive blocked | 通过 |
| run/control/resource/recovery | 是，basis/ref builder | intent/control/guard/case/basis | local records + readback journal | Sandbox/Runtime/platform controlled/blocked | 通过 |
| presentation/redaction | 是，safe marker corpus | preview/diagnosis/handoff/leak case | immediate canary erase | no raw fallback | 通过 |
| protocol/consumer | 是，finite DTO/header builder | family/schema/event/dedup/case | no payload retention | Consumer positive apply blocked | 通过 |
| idempotency/UoW/projection | 是，fault stage profile | operation/key/version/generation | journal reset + namespace drop | durable parity blocked | 通过 |
| Job | 是，typed entry/claim/checkpoint/report | kind/run/claim/basis/fault | release/drop/reset | owner mutation blocked | 通过 |
| config/profile | 是，strict document mutation | profile/config/case | snapshot discard/registry reset | fake only test-deterministic | 通过 |
| observability/boundary | 是，structured corpus/graph fixture | record/leak/audit case | erase/reset | no formal evidence produced | 通过 |

## 11. 跨数据隔离与清理审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 跨测试运行污染 | 无 unresolved | 所有数据均从 `test_run_ref` 下分区；不共享 mutable singleton。 |
| 跨 operation/generation 污染 | 无 unresolved | idempotency、selection generation、projection generation、claim/checkpoint 各自独立键控。 |
| happy-path 与负向数据混用 | 无 unresolved | 每类负向/故障均有独立 mutation/fault case，不覆盖基线。 |
| raw body/secret/canary 泄露 | 无 unresolved | owner/body 不进入 seed；canary 只存在隔离扫描输入并在 teardown 擦除。 |
| fake 污染非 test profile | 无 unresolved | profile 数据矩阵显式拒绝；`fixtureSetRef` 只可在 `test-deterministic`。 |
| 清理失败遮蔽测试结果 | 需 Step 9/13 继续定义 | 当前只定义 reset/drop contract，不声称清理脚本或执行结果。 |
| durable restart parity | blocked | `RUN-DDD-003` 未闭合；不能把 fake cleanup 当 durability evidence。 |
| 人工临时造数 | 无 | 每个 P0 用例均有 DS 映射；实现阶段缺 builder 必须回退 03/04。 |

## 12. 结构化回填草稿

正式 §7 应收录：数据生命周期图、数据集总表、基础/负向/并发/恢复/配置/观测数据规则、18 个切口映射、隔离键和清理策略。正文只描述可重复数据设计，不写 fixture 文件名、真实数据、执行结果或 durable implementation 事实。

## 13. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓、语言、test runner、store/cache backend（`RUN-DDD-001~003`） | 无法固定 fixture 文件、seed 命令、durable cleanup 或 restart parity | 保留数据集/构造语义，物理实现留 Step 8/9/07。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/L0-sdk seam（`RUN-UP-001~008`） | 正向 owner/Consumer/平台数据不能成为 ready fixture | 只提供 semantic fake、header-only、blocked/unknown 向量。 |
| production telemetry/GRC/真实 integration（`RUN-OPS-001~002`） | 无生产 workload、SLO 或正式 evidence 数据 | Step 10/13 继续标 planned/blocked。 |
| 06 尚未重建 | 数据集不能产生验收 verdict | 只保留候选证据关联，不生成 EV。 |

## 14. Step 7 进入下一步门禁

- [x] 每个 P0 用例均能反查至少一个可重复数据集。
- [x] 基础、边界、异常、并发、恢复、配置、redaction 和禁止字段数据已分离。
- [x] 隔离键涵盖 test run、operation、generation、claim、projection、consumer dedup 和 fault case。
- [x] 每个外部依赖均标注 fake/controlled/blocked 边界。
- [x] 清理策略明确且不依赖人工临时造数。
- [x] 数据停审和跨数据隔离/清理审计无 unresolved 冲突。
- [ ] fixture 文件、seed 脚本、真实 store、artifact、report、evidence、测试执行：未创建/未执行，不作为本 Step 条件。

Step 7 完成，允许进入 Step 8；正式 `05-测试方案.md` 仍不可写。
