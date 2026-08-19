# L2-runtime 04 配置设计 Step 9：加载、校验与启动生效

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`source_load / staged_validation / startup_publication / operation_capture`
> 回填位置：正式 `04-配置设计.md` 第 9 章

## 1. Step 开工确认与输入

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 9；Step 1~8 已通过，Step 10 尚未开工 |
| schema 输入 | Step 7 exact 12 roots、153 exposed leaves、39 static-derived values、13 slots、7 jobs |
| source 输入 | 一个 logical source selector 选择一份 strict JSON；可选 entry-profile assertion 只做 equality check |
| sensitive 输入 | zero secret leaf；typed sensitive ref 可入 snapshot，但 locator/raw document/full ref 不得输出 |
| 03 输入 | `RuntimeConfigSnapshot`、`ConfigValidationSummary`、`ConfigError`、`RuntimeConfigSnapshotPort`、`RuntimeBuilder::build` |
| P0 lifecycle | startup-time immutable snapshot；不支持 in-process reload/hot update |
| 禁止 | defaults merge、leaf env override、partial publication、last-known-good in-process swap、readiness 推断 |

## 2. SOP 问题回答

| 问题 | 本步结论 |
|---|---|
| 何时加载 | process composition 启动阶段，任何 API/Worker/Job/TestFake facade 暴露之前，只执行一次 |
| 如何 parse/type validate | duplicate-aware UTF-8 strict JSON parser；closed-object schema；exact type/enum/ref/wrapper conversion；不做 coercion/alias/case folding |
| 哪些 cross-field | 12 域内部关系、environment x entry、authority subset、policy-slot、slot tuple、job tuple、profile-job、blocker/fake/secret gates |
| 如何生效 | 成功装配一个 `RuntimeConfigSnapshot`，再由 builder 绑定 local/external dependencies；只有兼容 facade 成功构造后才开放入口 |
| 是否 reload/hot | P0 均不支持；新文档只能经独立启动验证并替换进程，旧进程 snapshot 不变 |
| 校验失败 | startup fail-fast；不发布 snapshot、不构造 facade、不调用 external Port、不从旧值/默认值/部分对象回退 |
| operation 如何取值 | entry adapter 从已发布 snapshot 解析一次；mutation/job 将 ref 写入既有 metadata/context，整次 operation/page 固定 |
| replay/resume 如何取值 | 已持久化 identity/ref 优先，`snapshot_by_ref` 精确解析；缺失返回 `SnapshotNotFound` 并 fail closed，不偷换 current |

## 3. 配置加载流程图：L2-runtime 单文档启动加载

```text
[logical source selector + optional entry assertion]
                       |
                       v
              [V0 source cardinality]
                       |
                       v
             [V1 bounded UTF-8 load]
                       |
                       v
       [V2 duplicate-aware strict JSON parse]
                       |
                       v
        [V3 closed shape / forbidden-key scan]
                       |
                       v
        [V4 exact scalar / array / enum types]
                       |
                       v
      [V5 typed ref / schema / wrapper conversion]
                       |
                       v
            [V6 per-field constraints]
                       |
                       v
          [V7 per-domain cross-field rules]
                       |
                       v
     [V8 profile / environment / authority matrix]
                       |
                       v
        [V9 exact 13-slot tuple validation]
                       |
                       v
         [V10 exact 7-job tuple validation]
                       |
                       v
 [V11 cross-domain dependency + blocker + fake gates]
                       |
                       v
 [V12 static derivation + canonical fingerprint + assembly]
                       |
                       v
        [validated RuntimeConfigSnapshot candidate]
                       |
                       v
       [RuntimeBuilder dependency compatibility]
                       |
             +---------+----------+
             |                    |
       Invalid/Blocked       compatible Bound
             |                    |
        no facade              publish once
                                  |
                                  v
                    [EntryAuthority-specific facade]
```

关键说明：

- 每个阶段输入只来自前一阶段的 immutable candidate；任何错误终止整条链，不能发布半成品。
- `BuildDisposition::Bound` 只表示配置与注入依赖可装配，不表示 adapter operational、integration qualified 或 production ready。
- `Blocked` 可以形成明确的负向装配分析，但是否开放只返回 Blocked 的 facade 由 entry 必需能力 gate 决定；不得把它升格为 Bound/Ready。
- 图中 publish 是进程启动期的一次性本地可见性边界，不是 config center、Bus、Observability 或外部 owner 发布。
- external adapter 构造与兼容检查不得触发网络调用；constructor/ping/design file 不能制造 availability 或 readiness。

## 4. 加载阶段 V0~V12

| Stage | 输入 | 必须执行 | 成功输出 | 失败映射 | 禁止副作用 |
|---|---|---|---|---|---|
| V0 source select | selector set、fixture context、entry assertion | 恰好一个允许 source；TestFake source 仅 `ci_contract`；未知 logical selector 拒绝 | redacted source identity + load handle | `SourceUnavailable` / `UnknownEnvironmentVariable` / fake build error | 不探测默认路径、不枚举/打印 locator |
| V1 source load | selected load handle | 完整读取一个有界 UTF-8 document；空/截断/多文档拒绝 | transient raw bytes + source fingerprint input | `SourceUnavailable` / `MalformedJson` | 不持久化 bytes、不记录 body/path |
| V2 syntax | transient bytes | strict JSON；duplicate object key at every depth；single root object | lossless duplicate-checked JSON tree | `MalformedJson` / `DuplicateKey` | 不 last-write-wins、不注释/尾逗号容忍 |
| V3 shape/security | JSON tree | exactly 12 roots；closed object keys；NC-L2R-001~030、secret/provider/legacy alias scan | schema-shaped raw domain nodes | `UnknownKey` / `MissingRequired` / `ForbiddenKey` / `SecretMaterialDetected` | 不保留 extension map/unknown value |
| V4 primitive types | domain nodes | exact JSON scalar/null/array/object；enum exact snake_case；unique arrays | primitive domain candidates | `TypeMismatch` / `RangeViolation` | 不 string-to-number/bool coercion、不 case fold |
| V5 typed conversion | primitive candidates | parse versions、typed refs、blocker refs、counts、weights、durations、limits；校验 owner/kind/version shape | typed leaf candidates | `SchemaMismatch` / `TypeMismatch` / `RangeViolation` / `SecretMaterialDetected` | 不 resolve owner body/credential/endpoint |
| V6 field constraints | typed leaves | required/nullability、positive/nonnegative、nonempty、unique、supported enum/schema | field-valid domains | `MissingRequired` / `RangeViolation` / `SchemaMismatch` | 不补默认值、不静默 dedupe/clamp |
| V7 domain relations | 12 field-valid domains | 各域自身 relation 与 static invariant compatibility | 12 domain-valid candidates | `CrossFieldConflict` | 不以 Disabled/Blocked 跳过 bound field 校验 |
| V8 profile matrix | profile/scope/jobs/fake context/assertion | environment x entry、authority subset、assertion equality、fake isolation、Api/Worker job posture | profile-valid candidate | `CrossFieldConflict` / `UnknownEnvironmentVariable` / fake build error | assertion 不覆盖 document；environment 不进 snapshot |
| V9 slot tuples | exactly 13 slot nodes | exact key set、5 leaves each、derived identity、activation tuple、contract/schema/blocker consistency | `AdapterSlotConfigSet` candidate | `MissingRequired` / `UnknownKey` / `CrossFieldConflict`; builder later maps slot compatibility | 不加入 Sandbox/provider/observability backend slot |
| V10 job tuples | exactly 7 job nodes | exact key set、6 leaves each、derived operation/retry、activation tuple、positive bounds、J04 attempts=1 | `JobControlSet` candidate | `MissingRequired` / `UnknownKey` / `CrossFieldConflict` | 不读 scheduler/cadence/container 配置 |
| V11 cross-domain | profile + 9 policies + slots + jobs + current blocker input | X-01~10、S-01~10、J-01~10；Candidate cannot suppress blocker；positive seam requirements | dependency-coherent typed candidate | `CrossFieldConflict` / `ForbiddenKey`; builder `SlotMismatch` / `DependencyDirectionViolation` | 不关闭 blocker、不调用 adapter、不宣称 qualification |
| V12 assembly | coherent typed candidate + clock/ID/digest services | inject 39 static-derived values；canonicalize set-like arrays；derive versions/ref/fingerprint；issue count must be zero | immutable `RuntimeConfigSnapshot` candidate | `SchemaMismatch` / `PublicationConflict` | 不输出 raw source/value/ref；不 publish before full assembly |

### 4.1 错误聚合规则

校验器可以在同一安全阶段收集多个 body-free issue 以改善修复效率，但必须遵守：

1. issue 只含 stable code、safe field path、expected category、actual type category、stage 与 safe reason；不得含 raw value、document excerpt、locator 或完整 sensitive ref。
2. 一旦命中 secret material，后续输出进入最小模式；不得继续把相邻值串入诊断。
3. `ConfigValidationSummary.issue_count` 只有零才允许构造 published snapshot；失败 candidate 不伪造成 `RuntimeConfigSnapshot`。
4. 多 issue 的顺序按 stage、canonical root、canonical field path 稳定排序，不能依赖 hash map iteration。
5. parser/library 原始错误必须映射到现有 `ConfigError`，不把库消息直接返回到 public/log/audit surface。

## 5. 十二配置域 parse/type/cross-field/assembly 矩阵

| CFG / root | Parse/type 与 field gate | Cross-field gate | Static-derived | Assembly target | Exposure / failure posture |
|---|---|---|---|---|---|
| CFG-01 `profile` | `v1`；entry/environment exact enum | `ci_contract` iff `test_fake`；assertion equality；ready/live literals forbidden | none | schema version + `RuntimeProfile.kind`; environment loader-only | matrix conflict fail-fast；environment 不持久化 |
| CFG-02 `scope` | version；unique nonempty six-authority subset | profile upper-set；required internal authority；API/Worker 至少一个对应 authority；Jobs exact two | `StrictSubset`; `ContainedOrReadOnly` | `RuntimeScopeProfile` + policy version | entry exposure only within subset；扩张 fail-fast |
| CFG-03 `context` | positive segments/weight/freshness；nullable positive per-source；omission enum | per-source <= total；unknown degraded never positive；operation only narrows | `MandatoryThenStableSource` ordering | `ContextCompositionProfile` + version | composition uses captured value；overflow/no silent truncation |
| CFG-04 `working_memory` | positive max/trigger；stale enum | trigger < max；durable lifecycle keys absent | none | `WorkingMemoryProfile` + version | invalid startup reject；working-only ownership |
| CFG-05 `model_decision` | nonempty purpose; unique typed class refs; quality/latency/data arrays; nullable semantic ref; context enum | Candidate model requires all four dimensions + semantic schema and slot schema compatibility；no provider route/secret/quota/cost | none | `ModelDecisionProfile` + version | missing positive seam remains Blocked; no model call during build |
| CFG-06 `action_guard` | version；unique allowed effects；positive freshness | required guard coverage；external effect cannot bypass governance/capability/tools/isolation/source; unknown stays fenced | five exact guards；required isolation；`BlockAndFence` | `ActionGuardProfile` + version | unsafe relation fail-fast；runtime Unknown cannot be configured away |
| CFG-07 `delegation` | bool + five nonnegative limits + version | disabled iff all zero；enabled iff all positive；child <= parent/context；child slot not Disabled | none | `DelegationProfile` + version | Blocked child yields blocked path；Candidate not lifecycle readiness |
| CFG-08 `checkpoint_recovery` | version；unique nonempty modes | resume/restart cannot become positive with checkpoint Blocked/CP blocker/open fence；reconcile/manual no resubmit | committed checkpoint + closed fence；manual/reconcile unknown posture | `CheckpointRecoveryProfile` + version | mode may remain configured while positive qualification blocked |
| CFG-09 `handoff_projection` | positive page/freshness；typed redaction ref | actual page <= policy/job limit；redaction compatible；submission/publisher/projection dependencies explicit | local outcome + body-free eligibility；unknown view degraded | `HandoffProjectionProfile` + version | no delivered/observed promotion；invalid ref fail-fast/block |
| CFG-10 `idempotency` | four positive retentions；digest schema | committed >= reservation；future external windows remain qualification blocker；cleanup never erases uniqueness proof | uniqueness survives cleanup | `IdempotencyProfile` + version | unsupported digest/unsafe relation startup reject |
| CFG-11 `adapter_slots` | exact 13 x 5; enums/ref/null/schema | activation tuples + S-01~10 + known blocker consistency | `AdapterSlot` from key | `AdapterSlotConfigSet` | builder validates realized Port; Candidate may still Blocked/Unavailable |
| CFG-12 `jobs` | exact 7 x 6; positive count/ttl/page/attempt | activation tuples + J-01~10; entry/profile and required slot gates; resume attempts=1 | `JobOperation` + exact `JobRetryPolicy` from key | `JobControlSet` | Disabled/Blocked never runs; Candidate only enables builder exposure |

## 6. 13-slot tuple validator

### 6.1 Canonical iteration and object shape

Validator 必须按以下固定顺序处理并生成 digest/issue：

```text
governance -> definition_resolver -> source_resolver -> durable_memory
-> capability_exposure -> invocation_caller -> model_context_materializer
-> model_decision -> child_runtime -> checkpoint_commit
-> handoff_submission -> event_publisher -> projection_store
```

每项必须恰好出现一次，且 child object 必须恰好有 `requirement`、`activation`、`contract_ref`、`expected_schema`、`blocker_ref`。校验算法按下列顺序执行：shape -> five leaf types -> typed refs -> activation tuple -> slot-specific owner/schema -> policy/profile/job relation -> realized dependency compatibility。

| Activation | Required tuple | Builder input expectation | Valid result boundary |
|---|---|---|---|
| `disabled` | Optional + all three refs null | no positive adapter required；non-test fake forbidden | capability absent；zero call |
| `blocked` | Required/Optional；non-null blocker；contract/schema both null or a mutually compatible pair | Required denies entry exposure；Optional may use explicit `BlockedAdapter` only where existing entry contract permits finite negative return；不得 resolve credential | affected path remains Blocked；blocker preserved；no positive call |
| `candidate` | blocker null；contract + expected schema non-null | exact canonical Port realization；contract/schema/dependency direction compatible | `Bound` or negative build disposition；never Ready |

`contract_ref` 与 `expected_schema` 在 Blocked posture 下必须 either both null or both non-null，避免半绑定；即使二者存在，`blocker_ref` 仍优先保持负向事实，不能因 ref 完整而自动 Candidate。

### 6.2 Slot-specific positive gates

| Slot | Candidate additionally requires | On absence/conflict |
|---|---|---|
| governance | effective decision/policy view contract; scope/freshness compatible | `SlotMismatch` / Blocked |
| definition_resolver | body-free Method/Role/Process ref/version contract | preserve `L2R-UP-008`; no method body copy |
| source_resolver | source/snapshot/availability schema | pending/blocked; no body fallback |
| durable_memory | ref-only retrieval contract and external lifecycle owner | working-memory-only or Blocked |
| capability_exposure | identity/formal exposure/descriptor contract | action guard Blocked; no registry mutation |
| invocation_caller | formal L2-tools contract; no direct Sandbox dependency | `DependencyDirectionViolation` / Blocked |
| model_context_materializer | body-free materialization + compatible redaction | model turn Blocked/Degraded |
| model_decision | provider-neutral semantic contract + CFG-05 complete selection | model turn Blocked/Unavailable |
| child_runtime | child request/result seam; CFG-07 enabled bounds | delegation Blocked; no member lifecycle |
| checkpoint_commit | commit/receipt/status-reconcile contract; CP blocker closed for positive resume | Prepared/Unknown/Blocked; no resume proof |
| handoff_submission | body-free producer/route/ack/status contract | local candidate/gap only |
| event_publisher | exact stored event schema/publish receipt contract | outbox pending/unknown |
| projection_store | committed-history cursor/store contract | stale/degraded/unknown view |

## 7. 7-job tuple validator

### 7.1 Canonical iteration and static mapping

| Key | Derived operation | Derived retry policy |
|---|---|---|
| `rebuild_safe_runtime_views` | `RebuildSafeRuntimeViews` | `LocalBeforeEffect` |
| `refresh_source_snapshots` | `RefreshSourceSnapshots` | `LocalBeforeEffect` |
| `compact_working_memory` | `CompactWorkingMemory` | `LocalBeforeEffect` |
| `resume_eligible_runs` | `ResumeEligibleRuns` | `NoAutomaticRetry` |
| `reconcile_unknown_effects` | `ReconcileUnknownEffects` | `StatusReconcileOnly` |
| `reconcile_handoff_gaps` | `ReconcileHandoffGaps` | `StatusReconcileOnly` |
| `publish_runtime_outbox` | `PublishRuntimeOutbox` | `SamePayloadPublish` |

每项恰好有 `activation`、`blocker_ref`、`partition_count`、`lease_ttl_seconds`、`page_limit`、`max_page_attempts`。operation/retry/cadence/scheduler/container key 出现即拒绝。

### 7.2 Activation、profile 与依赖校验

| Gate | Rule | Failure posture |
|---|---|---|
| activation tuple | Disabled/Candidate => blocker null；Blocked => blocker non-null | `CrossFieldConflict` |
| dormant bounds | Disabled/Blocked 仍需所有四个 bound positive | startup reject；不留 latent invalid config |
| entry profile | Api/Worker 全部 Disabled；Candidate 只允许 Jobs/TestFake | `CrossFieldConflict` |
| TestFake | 只在 CI 且 finite fake registry exact | fake build error；no readiness |
| resume | `max_page_attempts == 1`; Candidate requires checkpoint seam and no CP blocker | Blocked/reject Candidate |
| reconcile | Candidate only with status/read seam；不得形成 submit/retry seam | `DependencyDirectionViolation` / Blocked |
| publish | exact event publisher + outbox/local lease；same stored ID/digest | Blocked/Unknown；never rebuild payload |
| page | requested page <= job control；projection additionally <= projection policy | operation/page reject，不修改 snapshot |
| lease | matching live lease/epoch before page read/write | stop page；cursor/fence preserved |
| blocker | known upstream blocker cannot be hidden by Candidate | reject Candidate or explicit Blocked |

## 8. Assembly、fingerprint 与 snapshot identity

V12 必须从同一 typed candidate 一次性构造：

1. `RuntimeProfile` 九个 policy value 与 `RuntimePolicyVersionSet` 九个 lineage version。
2. `AdapterSlotConfigSet` 的 13 个 exact fields 和由 key 派生的 `AdapterSlot`。
3. `JobControlSet` 的 7 个 exact fields 和由 key 派生的 operation/retry policy。
4. `ConfigValidationSummary`：`schema_version=v1`、body-free `source_fingerprint`、validator clock 的 `validated_at`、`issue_count=0`。
5. `RuntimeConfigSnapshot`：新 `snapshot_ref`、schema/profile/versions/slots/jobs/validation 和 `loaded_at`。

Canonical fingerprint preimage 只含 schema version、canonical 12-root typed content、39 static-derived values 与 redacted source identity fingerprint。它不含 raw locator、JSON whitespace/key order、environment assertion transport、load/validation timestamps、generated snapshot ref、credential、full sensitive ref display form。Set-like array canonicalized; semantically ordered arrays use their declared order; duplicate already rejected。

`snapshot_ref` 是该 immutable assembled instance 的 identity，不是 evidence alias、artifact ID、readiness token 或外部 owner version。相同内容在不同独立启动中是否复用 identity 属于实现/identity contract 待定；fingerprint 必须稳定，但本文不伪造具体 ID 算法。

## 9. Builder 与启动 publication 边界

```text
validated snapshot candidate
  -> validate required local Ports/stores/error mappers/config reader
  -> match 13 configured slots to 13 RuntimeDependencySlots
  -> required Blocked: return Blocked and deny entry exposure
  -> optional Blocked: create negative-only BlockedAdapter only if entry contract permits
  -> reject fake outside TestFake
  -> construct services without I/O
  -> construct one EntryAuthority-specific facade
  -> publish snapshot + facade as the startup composition result
```

| Builder result | Snapshot/facade action | 入口状态 | 事实边界 |
|---|---|---|---|
| `Invalid` | discard candidate；publish nothing | process composition fails | safe `BuildError` only |
| `Blocked` because a required slot is Blocked | do not expose the entry facade；startup/component blocked | no positive operation | blocker refs only；no readiness |
| `Bound` because every affected Blocked slot is Optional and the facade contract explicitly supports its finite negative response | publish one immutable snapshot and compatible facade only after exact profile gate validates negative behavior | affected calls deterministically return Blocked/Disabled；other allowed paths may proceed | configuration compatibility only；still not operational qualification |
| `Bound` without an exposed Blocked path | one immutable snapshot and compatible facade become locally visible | allowed entry accepts operations | configuration compatibility only |

Publication is all-or-nothing from the entry layer perspective：没有可获取 snapshot 的 handler 不得先开放；没有与 snapshot 匹配的 facade 不得读取 current pointer。P0 进程内不存在第二次 publication，因此没有 pointer CAS、reload race、old/new mixed module 或 in-process rollback state machine。

## 10. Operation snapshot capture matrix

| Entry/flow | Snapshot selection | Stable storage/carrying | Mid-operation rule | Missing/mismatch |
|---|---|---|---|---|
| new Command | Runtime entry adapter resolves the single published current snapshot and writes/validates `CommandMetadata.config_snapshot_ref` before reservation/UoW | `OperationContext`、reservation/stored result/history/observation where defined | same ref through all local/external phases and internal immediate step | reject before mutation；caller cannot select arbitrary ref |
| Query | handler resolves current snapshot once as local execution context; `QueryMetadata` remains unchanged | response/observation may expose permitted ref per existing carrier; no mutation persistence required | all reads/mappers in that query use one typed value | `SnapshotNotFound`/Unavailable; no unvalidated fallback |
| Inbound Event | consumer resolves current snapshot once after envelope validation and before inbox/UoW; event envelope remains owner-defined | local operation metadata/receipt-side records where existing schema permits | incorporation and ACK decision use same snapshot | no ACK before durable negative/unknown disposition |
| LocalContinuation/InternalLoop | recover config ref from source operation/step/reservation context when recorded; otherwise resolve only at a new operation boundary under existing contract | `OperationContext`/stored operation identity; continuation DTO is not silently extended | a source step replay never changes policy | missing historical ref -> fail closed/manual recovery; no current substitution |
| new Job page | entry adapter resolves published snapshot, verifies configured job Candidate and binds `JobMetadata.config_snapshot_ref` before lease/page read | `JobRunContext` + `JobPageReport` + job state/report references | one claimed page uses one ref; no recapture per item | reject/Blocked before lease or stop page without cursor advance |
| replay/reconcile/by-ref read | exact recorded ref via `snapshot_by_ref` | historical immutable snapshot | never resolve current as substitute | `SnapshotNotFound`; preserve Unknown/Blocked/fence |

Although P0 has only one process snapshot, these rules are still mandatory: persisted work can outlive a process and be resumed after a replacement process starts with a different reviewed document。

## 11. Failure atomicity and zero-call guarantees

| Failure point | Must remain absent/unchanged | Allowed output |
|---|---|---|
| V0~V2 source/syntax | no typed domain, snapshot, builder or Port call | safe config code/stage/correlation |
| V3 secret/forbidden/shape | no partial domain survives as publishable value | safe field path/category only |
| V4~V8 type/domain/profile | no slot/job binding and no facade | stable issue list without raw values |
| V9~V11 slot/job/dependency | no external adapter call、job claim、entry exposure | blocker/slot/job safe identity |
| V12 assembly/fingerprint | no snapshot publication | `PublicationConflict`/schema-safe reason |
| builder local dependency | no facade and no external call | `MissingLocalDependency` |
| builder slot/fake/direction | no incompatible binding/facade | `SlotMismatch`/fake/direction error |
| operation capture | no reservation/UoW/lease/external call before valid snapshot | `SnapshotNotFound` or safe unavailable posture |

The loader does not write Runtime domain repositories, emit Runtime events, submit handoff/tool/model calls, claim job leases or send Observability evidence. A startup diagnostic/audit candidate is body-free local output only; actual delivery/observation is outside this Step and cannot gate validation success。

## 12. Per-domain loading stop review

| 域 | Required/type | Cross-field | Assembly target | Activation/failure | 03 impact | Result |
|---|---|---|---|---|---|---|
| profile | closed | environment/entry/assertion | profile kind + loader context | fail-fast | none | pass |
| scope | closed | authority subset | scope profile/version | entry constrained | none | pass |
| context | closed | bounds/unknown/omission | context profile/version | no truncation fallback | none | pass |
| working_memory | closed | trigger/ownership | memory profile/version | working-only | none | pass |
| model_decision | closed | four dimensions/schema/slots | model profile/version | external positive blocked as needed | none | pass |
| action_guard | closed | fixed guards/effects/freshness | guard profile/version | block/fence | none | pass |
| delegation | closed | enabled bounds/child slot | delegation profile/version | disabled/blocked explicit | none | pass |
| checkpoint_recovery | closed | stable source/fence/slot | recovery profile/version | manual/reconcile/blocked | none | pass |
| handoff_projection | closed | page/ref/slots | handoff profile/version | gap/degraded/blocked | none | pass |
| idempotency | closed | retention/digest/proof | idempotency profile/version | startup fail | none | pass |
| adapter_slots | 13 x 5 | tuple/policy/profile/blocker | exact slot set | builder finite disposition | none | pass |
| jobs | 7 x 6 | tuple/profile/slot/lease/page | exact job set | Disabled/Blocked/Candidate | none | pass |

## 13. 跨加载校验审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| source cardinality/precedence | pass | one document only；no merge/default/leaf env |
| duplicate/unknown/forbidden handling | pass | all depths closed；whole candidate rejected |
| all 153 leaves validated | pass | V3~V7 + Step 7 inventory are exact coverage source |
| all 39 derived values assembled | pass | V12 only；not externally overrideable |
| 12 domain mapping | pass | each has parse/type/cross/target/exposure/failure |
| 13 slot / 7 job tuples | pass | exact shapes, canonical order and static identities |
| startup-only lifecycle | pass | no in-process reload/hot/LKG pointer swap |
| operation consistency | pass | one ref/value per operation/page; replay by exact ref |
| partial activation | pass | snapshot/facade entry visibility is all-or-nothing |
| sensitive output | pass | fingerprint/category/path only; raw source/value/ref excluded |
| blocker/readiness | pass | Candidate/Bound never Ready; blockers cannot be suppressed |
| external side effect | pass | loader/builder constructors perform zero external calls |
| public code contract | pass | uses existing snapshot/Port/builder/errors; no new Rust-facing signature |

## 14. 当前问题诊断、改动前后与取舍

| Dimension | Historical Step 9 | Rebuilt Step 9 |
|---|---|---|
| source | defaults + JSON + leaf env merge | one selected strict JSON; assertion equality only |
| lifecycle | startup plus N->N+1 explicit reload | P0 startup-only immutable publication; replacement requires process restart |
| carrier | obsolete `RuntimePolicyProfileSet`/limits | `RuntimeProfile` + exact `AdapterSlotConfigSet` + `JobControlSet` |
| errors | invented config-layer error families | only existing `ConfigError` and `BuildError` variants |
| validation | broad 7-level description | V0~V12 with inputs, outputs, error mapping and zero-call boundaries |
| domain coverage | stale fields and merged values | exact 12 domains / 153 leaves / 39 derived values |
| operation capture | generic operation start | six entry/continuation/replay cases bound to existing carriers |
| publication | mutable current snapshot pointer | one startup composition result; no in-process second publication |

选择 startup-only 会让配置变更需要进程替换，但它与当前未实现、外部 seam 未闭合的事实匹配，并避免在没有 reload concurrency/rollback code contract 的情况下伪造在线能力。

## 15. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| V0~V12 loader/validator internal stages | 否 | 配置基础设施实现分解，不新增 public trait/DTO | 04 专属 | 无回写 |
| immutable snapshot assembly/publication | 否 | 复用 existing `RuntimeConfigSnapshot`/validation fields | 03 §13.1 | 无回写 |
| validated snapshot access/current/by-ref | 否 | 复用 `RuntimeConfigSnapshotPort` | 03 §6.8.3 | 无回写 |
| builder compatibility and finite dispositions | 否 | 复用 `RuntimeBuilder::build`/`BuildDisposition` | 03 §6.8.5/§13.5 | 无回写 |
| startup-only, no reload/hot | 否 | 收窄 04 lifecycle；没有新增 reload API/state | 不适用 | 无回写 |
| operation/page capture rules | 否 | 解释既有 metadata/context/ref 用法，不加字段 | 03 §6.3/§6.8/§7 | 无回写 |

配置实现可以把 V0~V12 分成 private modules/functions，但 `04` 不规定新的 Rust function signature。若实现阶段需要公开 loader/validator/builder API、引入新 `ConfigError` variant 或给 Query/Event/Continuation carrier 增加 snapshot 字段，必须先重开 `03`，不能从本 Step 推断。

## 16. 回填草稿与下一门禁

正式 §9 必须按以下顺序装配：startup-only statement -> V0~V12 ASCII flow -> stage table -> 12-domain matrix -> slot/job validator -> assembly/fingerprint -> builder/publication -> operation capture -> failure atomicity。不得重新写 defaults/env merge/reload/hot、旧 carrier 或 invented error types。

```text
step_09 = done
gate_status = pass
gate_reason = staged_validation_exact_tuple_startup_publication_and_capture_closed
next_allowed_action = delete_and_rebuild_step_10_change_audit_rollback
formal_04_write_allowed = false
step_10_write_allowed = true_after_flow_and_ledger_advance
commit_required = false
```
