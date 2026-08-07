# L2-tools 07 实施计划 Step 6：阶段任务、编写顺序与提交边界

## Step 状态

`accepted`

## 本步输入与规则

本步承接 Step 5 的 11 个 phase / 26 个 boundary，以及正式 `03` 的 exact callable、`05` 的 TC/suite/check、`06` 的 AC/VF/evidence 方向。以下是设计者移交前的 planned contract，不是已经执行的代码批次或提交记录。

### 统一编写顺序

```text
public carrier / typed ref
  -> domain factory / state guard
  -> application service / Store / Port call order
  -> infra fake + controlled adapter parity
  -> entry mapper / API-worker-job facade
  -> targeted tests and run-scoped tooling
```

单批目标规模为 100~300 行；预计超过 300 行必须拆分，超过 500 行禁止单批实现。状态、事务、幂等、redaction、unknown fence、projection rebuild 和 evidence builder 必须独立批次验证。

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 任务如何命名？ | 使用 `IMPL-<phase>-<seq>`，描述实施动作和可验证输出；不使用“完善代码”。 | SOP Step 6。 |
| 哪些必须同一提交？ | 共同构成一个可验证 vertical slice 的 contracts/domain/service/fake/targeted tests；无关模块不能合并。 | 提交边界规则。 |
| 如何处理大批次？ | 按 contract、state、service、adapter/entry、tests/tooling 拆成 2~4 批；高风险逻辑单独批次。 | 书写规范 §4.7。 |
| 经验复核由谁完成？ | 设计者在移交前逐 boundary 完成；实现 agent 只二次校验，不自行补 schema。 | 可落码标准 §9.1~§9.2。 |
| 当前是否可提交？ | 不可；目标实现仓不存在，且本轮未授权提交。所有 Commit/Handoff 字段保持 pending。 | 用户规则、Step 1。 |

## Boundary 总索引

| Boundary | Phase | 一句话目标 | 预计批次 | Commit 时机 | 计划 title |
|---|---|---|---:|---|---|
| `commit-01-a` | PH-01 | 建立七 member workspace 与命名/依赖骨架 | 3 | skeleton/static gates 通过后 | `chore(workspace): establish the tools workspace skeleton` |
| `commit-01-b` | PH-01 | 建立 strict config、scripts、artifact/report root 合同 | 3 | config/script dry-run 通过后 | `chore(tooling): add strict config and run-scoped roots` |
| `commit-02-a` | PH-02 | 建立 public typed contracts、metadata、errors、codec | 3 | contract/Rustdoc tests 通过后 | `feat(contracts): add the public tool contract foundation` |
| `commit-02-b` | PH-02 | 建立六状态族、domain objects、policy/invariant foundation | 3 | pure state/invariant gates 通过后 | `feat(domain): add tool state and invariant foundations` |
| `commit-02-c` | PH-02 | 建立 application Ports、Stores、UoW、idempotency/fake parity | 4 | TX/replay/fake gates 通过后 | `feat(application): add ports transactions and replay foundations` |
| `commit-03-a` | PH-03 | 建立 Tool identity/definition accepted create/read slice | 4 | CF-01/QF-01 local slice 通过后 | `feat(contract): add tool identity and definition flows` |
| `commit-03-b` | PH-03 | 建立 revision impact/adoption/retirement history slice | 4 | CF-02~04/QF-02 state gates 通过后 | `feat(evolution): add tool revision lifecycle flows` |
| `commit-04-a` | PH-04 | 建立 binding relation/snapshot/assessment contracts and guards | 3 | BIND domain gates 通过后 | `feat(binding): add capability binding contracts` |
| `commit-04-b` | PH-04 | 完成 binding service、Hub controlled seam 与 query | 4 | BIND service/fake/no-write gates 通过后 | `feat(binding): complete controlled binding consumption` |
| `commit-05-a` | PH-05 | 建立 canonical invocation/admission contracts and state | 3 | INV/STATE gates 通过后 | `feat(invocation): add canonical invocation admission` |
| `commit-05-b` | PH-05 | 完成 execution requirement/auth consumption fail-closed service | 4 | PRE negative/blocked gates 通过后 | `feat(precondition): add fail-closed execution preconditions` |
| `commit-05-c` | PH-05 | 完成 Prepared Sandbox handoff and one-call unknown fence | 4 | phase/unknown/TX gates 通过后 | `feat(handoff): add prepared sandbox handoff fencing` |
| `commit-06-a` | PH-06 | 建立 source assessment、outcome、atomic audit pair | 4 | OUTCOME/TX pair gates 通过后 | `feat(outcome): add normalized outcome audit pairs` |
| `commit-06-b` | PH-06 | 建立 safe eligibility、body-free material 与 four-gate mapper | 3 | HANDOFF/redaction gates 通过后 | `feat(handoff): add safe material eligibility` |
| `commit-06-c` | PH-06 | 建立 external submission attempt local state and status views | 4 | attempt/replay/no-delivery gates 通过后 | `feat(outbound): add local submission attempt state` |
| `commit-07-a` | PH-07 | 建立 Query/read page/visibility/no-write foundation | 3 | query contract/purity seed 通过后 | `feat(query): add read-only query foundations` |
| `commit-07-b` | PH-07 | 完成 contract/binding/invocation/precondition/outcome queries | 4 | QF-01~06/no-write gates 通过后 | `feat(query): add core tool read surfaces` |
| `commit-07-c` | PH-07 | 完成 integrity/report/search/diff/diagnostic/guidance projections | 4 | QF-07~11/watermark gates 通过后 | `feat(projection): add derived tool read material` |
| `commit-08-a` | PH-08 | 完成 inbound envelope claim/receipt/consumer lifecycle | 4 | IF-01~05/receipt gates 通过后 | `feat(consumer): add inbound tool consumer receipts` |
| `commit-08-b` | PH-08 | 完成 outbound event mapper、continuation、feedback status refs | 4 | OF-01~04/one-call gates 通过后 | `feat(event): add safe outbound continuation flows` |
| `commit-09-a` | PH-09 | 建立 bounded Job input/journal/plan/target/report protocol | 4 | JF public surface gates 通过后 | `feat(jobs): add bounded job protocol foundation` |
| `commit-09-b` | PH-09 | 完成 four jobs、projection refresh、status refresh、replay | 4 | JOB/no-repair/replay gates 通过后 | `feat(jobs): complete bounded maintenance reports` |
| `commit-10-a` | PH-10 | 实现 54-item strict config loader/validator/builder | 4 | CFG-T/A/F/X/profile gates 通过后 | `feat(config): add strict tools configuration activation` |
| `commit-10-b` | PH-10 | 完成 runtime composition、entry wiring、controlled adapter parity | 4 | composition/dependency/Rustdoc gates 通过后 | `feat(runtime): compose controlled tool adapters` |
| `commit-11-a` | PH-11 | 建立 test runner、raw/report/evidence/check builders | 4 | schema/pairing/redaction checks 通过后 | `feat(testing): add run-scoped test evidence tooling` |
| `commit-11-b` | PH-11 | 建立 release-local smoke、VETO、acceptance handoff drafts | 3 | release contract checks 通过后 | `feat(release): add acceptance handoff scaffolding` |

**总计：26 个 boundary。** `commit-01-a` 是初始唯一 current/read-docs boundary；其余在实现移交时均预创建为 `planned / wait_until_current`。

## 阶段任务、批次与边界卡

### PH-01 Workspace / Tooling Baseline

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-01-01 | 1 | 建 root Cargo manifest 与七 member manifest | workspace skeleton | naming/layout static pass |
| IMPL-01-02 | 2 | 建 config/script/artifact/report schema shell | path/config shell | dry-run and path checks |
| IMPL-01-03 | 3 | 建 dependency/Rustdoc/manifest checks | check scripts/tests | no forbidden sibling dependency |

| Boundary | 批次顺序（目标/输入/输出/规模/门禁） | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-01-a` | A1 manifest/layout -> A2 seven member source/Rustdoc skeleton -> A3 dependency/name static checks；每批 100~300 行；`FOUNDATION-001,008~011,013~015` seed | root Cargo, `crates/{contracts,domain,application,infra,api,worker,jobs}` manifests/skeletons, static checks | business DTO/domain behavior, config values, sibling Cargo deps, reports/evidence |
| `commit-01-b` | B1 config candidate shell -> B2 `scripts/gates|reports|checks` CLI/path shell -> B3 artifact/report schema/no-static checks；`CFG-001/007`, path checks | config schema shell, script argument parser, run roots, empty-safe report builders | real run/result, acceptance, business logic, `latest`, project-subdir artifact root |

### PH-02 Contract / Domain / Application Foundation

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-02-01 | 1 | typed refs/metadata/version/error/carrier constructors | contracts | codec/Rustdoc negative pass |
| IMPL-02-02 | 2 | state families/factories/guards/pure policies | domain foundation | legal/illegal transition pass |
| IMPL-02-03 | 3 | Store/Port traits、UoW、CAS、idempotency/fakes | application foundation | replay/TX/fake parity pass |

| Boundary | 批次顺序（目标/输入/输出/规模/门禁） | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-02-a` | A1 typed refs/metadata -> A2 ProtocolError/shared carriers -> A3 codec/Rustdoc fixtures；`FOUNDATION-001~018` subset | `tools-contracts` public declarations and contract tests | domain state, Store implementation, external adapter, local alias types |
| `commit-02-b` | B1 six state enums -> B2 41 object factory/transition predicates -> B3 pure negative/invariant tests；`STATE-001~012`, `ERR-001~012` pure subset | `tools-domain` objects, state, policy, pure mapper/tests | UoW/Store, external calls, Query mutation, job/report/evidence |
| `commit-02-c` | C1 Store/Port traits -> C2 UoW/CAS -> C3 idempotency/stored result -> C4 deterministic fakes/parity tests；`TX-001~010`,`CONC-001~023` foundation | `tools-application` ports/UoW/idempotency; `tools-infra` fake support | concrete capability services, runtime composition, hidden retry, generic cache fallback |

### PH-03 Tool Identity / Definition / Evolution

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-03-01 | 1 | identity/definition request/result and domain factory | CF-01 local contract | exact identity/replay |
| IMPL-03-02 | 2 | current/history/impact and evolution guards | CF-02~04 | state/CAS/closure |
| IMPL-03-03 | 3 | services/Stores/API query read surface | QF-01~02 | no-write/read parity |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-03-a` | A1 identity/definition carriers -> A2 `ToolContract`/`FormalToolDefinition` factories -> A3 CF-01 service/store -> A4 QF-01 read/tests；`CONTRACT-001~002`,`QUERY-001`,`STATE-001` | contract/evolution owner files for identity/current definition and corresponding service/read tests | adoption/retirement, Binding, provider inventory, Runtime planning |
| `commit-03-b` | B1 candidate/impact -> B2 adoption/CAS/history -> B3 retirement closure -> B4 QF-02/history/replay tests；`CONTRACT-003~008`,`STATE-002/009~012`,`TX-001~002` | evolution facts, compatibility impact, current/history transitions, projection stale marker | Binding/Invocation/Query refresh, registry or marketplace, external delivery |

### PH-04 Capability Binding / Controlled Source

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-04-01 | 1 | binding refs/modes/snapshot/assessment carriers | relation contract | bound/unbound exactness |
| IMPL-04-02 | 2 | declare/replace/invalidate guards and service | binding mutation | CAS/history/gap |
| IMPL-04-03 | 3 | controlled Hub adapter/fake and QF-03 | consumption seam | blocked/no-refresh |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-04-a` | A1 relation/anchor/ref carriers -> A2 `CapabilityBinding` state/factory -> A3 pure BIND tests；`BIND-001~004`,`STATE-003` | binding domain/contracts, typed Hub refs, body-free snapshot/assessment | Hub registry/exposure truth, authorization, provider body, service/UoW |
| `commit-04-b` | B1 Hub controlled Port/failure mapper -> B2 CF-05~07 service/store/CAS -> B3 QF-03 read -> B4 fake parity/replay/no-write tests；`BIND-005~008`,`QUERY-003`,`TX-002` | binding application/infra/API seam, blocked adapter, relation persistence/tests | local registry, name/default inference, Hub mutation, positive readiness claim |

### PH-05 Invocation / Admission / Precondition / Sandbox Handoff

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-05-01 | 1 | invocation context/anchor/admission carriers and domain guards | CF-08 | caller parity/no execution |
| IMPL-05-02 | 2 | requirement/auth consumption mapper | CF-09 | fail-closed typed outcomes |
| IMPL-05-03 | 3 | handoff/Prepared/attempt and Sandbox seam | CF-10 | one-call/unknown |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-05-a` | A1 invocation metadata/context -> A2 anchor/canonicalizer -> A3 admission state/no-execution pair tests；`INV-001~008`,`STATE-004` | invocation domain/contracts, CF-08, QF-04 inputs and pure tests | auth/policy decision, Sandbox run, Runtime loop |
| `commit-05-b` | B1 `ExecutionRequirement` -> B2 Auth consumption Port/assessment -> B3 CF-09 service/error mapping -> B4 negative/blocked tests；`PRE-001~004`,`ERR-007~008` | requirement/auth consumption assessment, blocked adapter, precondition service | L2 authorization owner, default allow, policy evaluation, raw provider body |
| `commit-05-c` | C1 handoff/readiness refs -> C2 Prepared marker/phase-1 UoW -> C3 one Port call/phase-2 CAS -> C4 unknown/replay/concurrency tests；`PRE-005~010`,`TX-003~004`,`CONC-010~014` | Sandbox handoff seam, `ExecutionHandoffAttempt`, local status/fakes | host/direct fallback, run/receipt/capture/cleanup, blind retry |

### PH-06 Outcome / Audit / Safe Handoff

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-06-01 | 1 | source assessment/result/error normalization | CF-11 | source symmetry/XOR |
| IMPL-06-02 | 2 | atomic outcome/audit pair Store/service | terminal local truth | pair atomicity |
| IMPL-06-03 | 3 | eligibility/material/attempt local state | CF-12/OF inputs | four gates/body-free |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-06-a` | A1 source refs/assessment -> A2 outcome six classes -> A3 atomic pair Store/UoW -> A4 result/error/replay tests；`OUTCOME-001~010`,`TX-005~008` | outcome/audit domain/application/infra and IF-03 re-entry target | raw capture/body, delivery/Observed, external status truth |
| `commit-06-b` | B1 four eligibility checks -> B2 safe material immutable carrier -> B3 pure mapper/redaction tests；`HANDOFF-001~004`,`OBS-001~006` | safe handoff eligibility/material and redaction source | target provider execution, event transport, route/readiness |
| `commit-06-c` | C1 ExternalSubmissionAttempt states -> C2 local Store/claim -> C3 status/gap mapper -> C4 replay/unknown/no-delivery tests；`HANDOFF-005~008`,`CONT-001~004`,`CONC-010~012` | local submission attempt and independent Bus/Obs refs | Delivered/Observed inference, queue/DLQ/retry lifecycle |

### PH-07 Query / Integrity / Derived Projection

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-07-01 | 1 | page/cursor/visibility/read Port and zero-write spy | Query foundation | no UoW/Port |
| IMPL-07-02 | 2 | QF-01~06 core read bundles/mappers | core queries | surface/parity |
| IMPL-07-03 | 3 | QF-07~11 projections/reports/guidance | derived views | watermark/degraded |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-07-a` | A1 page/cursor/visibility carriers -> A2 named read Ports -> A3 zero-write fixtures; `QUERY-001~002`,`FOUNDATION-006` | query contracts/read shell and spies | mutation, refresh, new marker kind, external resolver |
| `commit-07-b` | B1 QF-01~03 -> B2 QF-04~06 -> B3 API mappers -> B4 no-write/visibility/fake parity; `QUERY-001~006` | core query services and read views | UoW/reserve/capture/repair/fallback |
| `commit-07-c` | C1 report/search/diff -> C2 diagnostic/guidance -> C3 projection Store/watermark -> C4 stale/rebuild/unavailable tests; `QUERY-007~011`,`CONC-016~017`,`JOB-003` read inputs | derived projection/query surfaces | Query-triggered rebuild, truth repair, event publish |

### PH-08 Inbound / Outbound Collaboration

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-08-01 | 1 | inbound envelope/source/version/claim/receipt | IF-01~05 | header/dedup |
| IMPL-08-02 | 2 | IF-03 formal CF-11 re-entry and other assessments | consumer seam | owner separation |
| IMPL-08-03 | 3 | OF-01~04 material/event/continuation/status | outbound seam | one call/unknown |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-08-a` | A1 envelope/header validators -> A2 claim/receipt typed Store -> A3 IF-01/02/04/05 assessment paths -> A4 IF replay/blocked tests；`CONSUMER-001/002/004/005` | worker consumers, receipt/rejection/quarantine/gap, source Port calls | broker ack/DLQ, direct core mutation, body logging |
| `commit-08-b` | B1 IF-03 input mapper -> B2 deterministic CF-11 re-entry -> B3 OF event mapper/attempt continuation -> B4 feedback/status/replay tests；`CONSUMER-003`,`CONT-001~004`,`TX-009~010` | worker collaboration, event contracts, safe submission continuation | delivery/retry/Observed truth, second call after unknown |

### PH-09 Bounded Jobs / Reference and Status Refresh

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-09-01 | 1 | JobMetadata/scope/cursor/journal/report carriers | job protocol | bounded construction |
| IMPL-09-02 | 2 | JF-01~04 runners/target plan/UoW | maintenance slice | target isolation |
| IMPL-09-03 | 3 | projection/status report/replay tests | JobReport | no-repair/terminal |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-09-a` | A1 public Job DTO/Rustdoc -> A2 journal/checkpoint/idempotency -> A3 frozen plan/target schema -> A4 codec/replay tests；`JOB-001~004` protocol subset | jobs contracts/application journal/report shell | generic execute, unbounded scan, core mutation |
| `commit-09-b` | B1 JF-01/02 -> B2 JF-03 -> B3 JF-04 -> B4 terminal/report/no-repair/concurrency tests；`JOB-001~004`,`CONC-013~017` | bounded runners, projection/status refs, reports | repair Contract/Binding/Outcome, scheduler/lease, release verdict |

### PH-10 Runtime Composition / Config Activation

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-10-01 | 1 | raw config candidate/strict parser | config input | CFG-T |
| IMPL-10-02 | 2 | validation/source/profile/cross-field/redline | validated config | CFG-A/F/X |
| IMPL-10-03 | 3 | builder/adapter capability mapping | runtime config | no partial graph |
| IMPL-10-04 | 4 | seven entry composition and controlled adapter parity | runnable graph | composition/dependency |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-10-a` | A1 ten roots/54 item typed candidate -> A2 strict loader/validator -> A3 profile/source/conflict -> A4 CFG-T/A/F/X/redline tests；`CFG-001~007`,`CFG-T/A/F/X` | `tools-infra` config.rs/validator/builder input and config tests | remote config/hot reload/LKG, secret values, runtime truth mutation |
| `commit-10-b` | B1 runtime builder dependency checks -> B2 Store/UoW/Port slots -> B3 api/worker/jobs composition -> B4 fake/blocked adapter parity and static checks；`CFG-assembly`, `FOUNDATION-016~018` | runtime composition, entry wiring, controlled/disabled adapter registration | provider readiness, sibling Cargo deps except Core candidate, fallback execution |

### PH-11 Full Test / Evidence / Acceptance Handoff

| 任务 | 编写顺序 | 动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| IMPL-11-01 | 1 | case/dataset manifest and runner | 234 TC execution input | identity/denominator |
| IMPL-11-02 | 2 | suite/gate/check/report generators | same-run reports | pairing/redaction |
| IMPL-11-03 | 3 | evidence index/seal/release smoke | candidate slots | no-static/eligibility |
| IMPL-11-04 | 4 | acceptance/VETO/handoff drafts | review input | review_required only |

| Boundary | 批次顺序与门禁 | Allowed scope | Forbidden scope |
|---|---|---|---|
| `commit-11-a` | A1 machine artifact schemas -> A2 suite/case/journal writers -> A3 11 mandatory checks -> A4 report/evidence index/redaction tests；`OBS-001~009`, all check identities | scripts, test fixtures, raw/report/evidence builders and schemas | static pass, cross-run merge, final verdict/signoff, business UoW |
| `commit-11-b` | B1 release-local smoke aggregation -> B2 VETO/open-issues/handoff draft generators -> B3 projection/path/schema checks；`VETO-001~013`, `AC-L2T-001~039` mapping | release scripts and review-required acceptance drafts | risk auto-acceptance, final verdict, real signoff, production readiness |

## 开工前设计闭环复核（所有 boundary 共用）

| 复核项 | 必须确认 | 失败处理 |
|---|---|---|
| field/support carrier | 当前 boundary 每个字段、reason、summary、ref-set、kind/status 有正式 owner、类型和来源 | `blocked / wait_design`，回 03 Step 6/8。 |
| DTO construction | request/event/job/result/receipt/report 能由 metadata/envelope/typed source 构造 | 回 03 Step 8，不许 local alias/default。 |
| callable/Port | domain member、Store/Port method、mapper、entry callable exact | 回 03 Step 7/9。 |
| state/transition | current/reserved/illegal/terminal/unknown 显式 | 回 03 Step 10。 |
| persistence/idempotency | semantic key、digest、expected version、UoW、stored replay、commit unknown | 回 03 Step 11~13。 |
| query/job material | Query source/read surface 或 Job plan/output 完整；no-write/no-repair | 回 03 Step 9/11/16。 |
| config/evidence | config source/activation/failure 或 artifact schema/pairing/redaction 完整 | 回 04/05/06。 |
| phase boundary | 不调用后续 phase 对象/结果；reserved 明确不调用 | 调整 boundary，禁止实现端自补。 |

## Commit boundary 经验复核摘要

| Boundary group | 适用经验项 | 不适用项与理由 | 结论 |
|---|---|---|---|
| `01-*` | path/dependency, config binding, artifact materialization, Rustdoc | business state/idempotency/event/job 不在骨架 | `pass-designed` |
| `02-*` | typed-ref owner, DTO, state/factory, Port/UoW/idempotency/fake parity | concrete query/event/job/evidence 不在 foundation | `pass-designed` |
| `03-*` | current/history, stored result, Query no-write, CAS | external provider/delivery/job repair 不适用 | `pass-designed` |
| `04-*` | relation source, typed ref, CAS, blocked adapter, redaction | registry/provider truth 不适用且禁止 | `pass-designed` |
| `05-*` | selected input source map, state, Prepared/unknown, phase fence | raw provider body/host/run/receipt 不适用 | `pass-designed` |
| `06-*` | outcome/audit pair, safe material, body-free, side-effect marker | delivery/Observed/queue truth 不适用 | `pass-designed` |
| `07-*` | query response, visibility, watermark, no-write, projection source | mutation/refresh from Query 不适用 | `pass-designed` |
| `08-*` | entry context, receipt save/get, envelope, replay, one-call | broker ack/DLQ/owner truth 不适用 | `pass-designed` |
| `09-*` | bounded job plan/output, report, projection rebuild, no-repair | recursive Command/full scan/release verdict 不适用 | `pass-designed` |
| `10-*` | config item/source/profile/activation, composition, dependency | hot reload/secret resolver/provider readiness 不适用 | `pass-designed` |
| `11-*` | machine artifact schema, same-run pairing, redaction, no-static, handoff | business state and human verdict/signoff 不适用 | `pass-designed` |

## Boundary 停审与跨 boundary 审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| boundary count | `pass-designed` | 26 个 ID 覆盖 PH-01~PH-11，无空 phase。 |
| one-sentence scope | `pass-designed` | 每个 boundary 可用一句话描述。 |
| batch size | `pass-designed` | 大于 300 行或高风险逻辑均有拆批要求。 |
| phase order | `pass-designed` | foundation/vertical/read/entry/job/config/release 顺序稳定。 |
| test/evidence ownership | `pass-designed` | 每个 boundary 有 family/check seed，真实证据留执行期。 |
| future boundary authorization | `pass-designed` | 仅一个 current；其余 planned/wait_until_current。 |
| unresolved design blocker | `0` | 未发现需回写 00~06 的新 blocker。 |

## 回填草稿

正式 07 §6 应引用本文件的 Boundary 总索引、每 phase 任务/批次/allowed scope 表、共用设计闭环复核、经验复核和跨 boundary 审计。正式文档不复制 03 的完整字段 schema。

## 待确认事项与进入下一步条件

| 事项 | 状态 | 处理 |
|---|---|---|
| 具体 target repo file path | pending implementation preflight | PH-01 开工前确认；设计期只用 planned layout。 |
| 具体 durable backend | pending | 通过 Port/config capability 选择；未确认不阻塞 fake/local。 |
| real TC command invocation | pending Step 7 | 由测试方案和实现仓脚本确定，不填结果。 |

- [x] 26 个 boundary 均有目标、批次、scope、门禁和提交时机。
- [x] 经验复核和不适用理由已给出。
- [x] 跨 boundary 依赖、粒度、证据和 phase 越界审计通过设计门禁。
