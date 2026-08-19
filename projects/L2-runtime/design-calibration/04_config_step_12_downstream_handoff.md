# L2-runtime 04 配置设计 Step 12：测试、验收、实施与运维承接

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`05_test_inputs / 06_gate_inputs / 07_planned_boundaries / 09_operations_decisions`
> 回填位置：正式 `04-配置设计.md` 第 12 章

## 1. Step 开工确认与 truth boundary

| 下游 | 本 Step 只提供 | 下游拥有 | 当前禁止声明 |
|---|---|---|---|
| `05-测试方案.md` | config test objects、partitions、oracles、negative/fault slices、environment prerequisites | case IDs、fixtures、commands、suite/artifact/report/evidence schemas 与执行计划 | test executed/pass、run ID、artifact/report/evidence exists |
| `06-验收标准.md` | candidate gates、veto inputs、required evidence themes、blocker ceiling | thresholds、evidence qualification、risk acceptance、verdict、signoff | pass/conditional/fail、accepted risk、readiness |
| `07-实施计划.md` | config implementation objects、dependency order、boundary candidates、Design Gate inputs | phase/task/commit boundary、planned skeleton、actual implementation gate progression | repo/commit/build/test exists or completed |
| future `09-部署与运维手册.md` | invariant source/change/failure semantics and decisions still required | paths、permissions、process injection/replacement、secret owner integration、alerts/runbooks/backups | actual deployment、rotation、rollback drill、observed state |

Existing `projects/L2-runtime/05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` and their calibration/ledger files remain `historical_downstream_material` under the current controlled reopen. This Step does not modify them or inherit their test/evidence/implementation claims。

## 2. 下游依赖与真相流图

```text
                         [03 detailed code contracts]
                                      |
                                      v
[04 exact config schema/lifecycle/failure boundaries]
                |             |              |
                v             v              v
        [05 test design] [07 implementation] [future 09 operations]
                |             |              |
                +------ future real execution+
                              |
                              v
                     [raw artifacts/reports]
                              |
                              v
                   [06 evidence qualification]
                              |
                              v
                 [acceptance authority verdict]

External seams:
  L0-core ------------------------ [compile candidate only]
  upstream owner/adapters -------- [runtime/ref/adapter]
  Bus / owner events ------------- [event]
  L4-observability --------------- [event/adapter; observed truth external]
  deterministic TestFake --------- [fake; CI only]
```

关键说明：

- `04` cannot jump directly to an acceptance verdict；design tables are not execution evidence。
- Compile/runtime/event/ref/adapter/fake remain distinct in environment and test matrices；only compile may become a Cargo/package relation after formal qualification。
- `07` may plan implementation from `03/04/05/06`, but implementers cannot invent a missing config field、Port、state、error or evidence rule。
- Operations owns physical process replacement and alerting；it consumes startup-only semantics rather than adding reload/hot behavior。

## 3. 下游承接总表

| Downstream document/material | 承接内容 | 04 提供的确定输入 | 下游必须补充 | 禁止重复定义/伪造 |
|---|---|---|---|---|
| `05-测试方案.md` | strict parser/schema/type/ref/cross-field/profile/slot/job/security/startup/cold-change/runtime failure tests | 12 roots、153 leaves、39 derived、V0~V12、X/S/J gates、CF-A/B、capture/zero-call rules | test level、fixture builders、case IDs、oracle、commands、suite/evidence plan | defaults/aliases/new states；executed/pass |
| `06-验收标准.md` | configuration baseline、veto、fail-closed、redaction、evidence integrity gates | required/forbidden schema、blocker map、negative postures、truth ceilings | measurable conditions、denominator、evidence source、authority、risk/signoff process | Candidate/Bound as Ready；verdict/signature |
| `07-实施计划.md` | private config infrastructure + existing public contracts integration | implementation object order、03 no-new-interface rule、blocker/Design Gate inputs | phases/tasks/allowed files/commit boundaries/checks/planned ledgers | unapproved public API、real repo/hash/status |
| future `09` | source placement、startup selection、cold replacement/rollback、permissions、retention、alert/runbook | two logical selectors、one-document rule、safe audit fields、failure/recovery semantics | actual path/mount/env binding、owner roles、supervisor/topology、backup/restore、alert routing | config center/hot reload without redesign；secret in doc |
| upstream adapter owners | contract/schema/blocker closure and finite status | exact 13 slot gates、typed refs、zero-secret owner boundary | formal owner contract + implementation/integration qualification | Runtime-owned provider route/credential/readiness |
| `L4-observability` | body-free configuration/runtime signal candidates | safe fields/redaction/posture/gap semantics | ingestion/retention/audit/observed/evidence contract | audit candidate == observed/evidence |

## 4. `05-测试方案.md` 输入切片

| Slice | Objects / partitions from 04 | Required oracle | Recommended level | External posture |
|---|---|---|---|---|
| CFG-T01 source | zero/one/multiple selector、unknown env、normal vs CI fixture | only exactly one allowed source proceeds; locator/body absent | unit/service | local deterministic source fake |
| CFG-T02 strict syntax/shape | UTF-8、duplicate all depths、12 roots、closed child objects、null/unknown/case/alias | exact existing `ConfigError`; no partial typed output | parser/property | no external seam |
| CFG-T03 153-leaf types | enum/ref/schema/count/weight/duration/null/unique arrays | each valid/invalid partition reaches correct typed target/error | unit/property | typed-ref parser fake, no owner body |
| CFG-T04 39 derived values | scope/context/guard/recovery/handoff/slot/job identities/retry | cannot be externally set; exact assembly mapping | unit | no external seam |
| CFG-T05 domain relations | CFG-01~12 per-domain cross rules | whole candidate reject; stable issue order; zero facade | unit/service | local deterministic |
| CFG-T06 profile/environment | 4x4 entry matrix、authority subset、Api/Worker jobs Disabled、TestFake isolation | exact accept/reject; no fake leak/readiness literal | service/builder | finite fake only CI/TestFake |
| CFG-T07 13 slots | exact 13 x 5、Disabled/Blocked/Candidate tuple、owner/schema/blocker/dependency gates | zero call under Disabled/Blocked; finite build disposition; no Ready | builder/adapter contract | fake/pending/reject/unknown, never operational proof |
| CFG-T08 7 jobs | exact 7 x 6、static operation/retry、profile/slot/lease/page/attempt gates | no claim when disabled/blocked; stop/preserve cursor on fault | job/service | lease/store/status fakes |
| CFG-T09 sensitive/no-output | forbidden keys/value shapes、typed refs、locator、parser errors/log/audit/report | zero raw secret/path/body/full sensitive ref across outputs | security/static/dynamic | no real secret backend needed |
| CFG-T10 startup publication | V0~V12 failure injection、builder Invalid/Blocked/Bound、snapshot/facade atomic visibility | no partial publication/external call; Bound != readiness | service/composition | local dependency fakes |
| CFG-T11 operation capture | Command/Query/Event/Continuation/Job/replay/by-ref cases | one snapshot per operation/page; historical missing fails closed | service/flow | snapshot store fake |
| CFG-T12 cold change/rollback | risk/diff/review refs、invalid candidate、replacement failure/Unknown、prior incompatible | old process only by owner-known fact; prior fully revalidated; truth not reversed | integration-candidate design | deployment controller fake; no actual deployment claim |
| CFG-T13 candidate failures | CF-A01~A18 | fail-fast/no facade/no side effect/body-free signal | unit/service/fault | deterministic |
| CFG-T14 runtime failures | CF-B01~B18 | path-specific fail-closed/degraded/Unknown + exact recovery action | service/integration candidate | finite owner/adapter status fakes |
| CFG-T15 blocker preservation | `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` | fake/design/ping/ref cannot close blocker or count positive | negative contract | positive lane blocked until owner closure |

05 must keep compile/runtime/event/ref/adapter/fake test collaboration distinct. A fake may prove local negative/deterministic semantics but cannot qualify Sandbox isolation、Tools execution、model provider、checkpoint durability、Bus delivery、Observed status or production readiness。

## 5. `05` environment/config prerequisites

| Validation class | Allowed entry | Config source | Dependency collaboration | Test scope ceiling |
|---|---|---|---|---|
| `local_contract` | Api/Worker/Jobs negative/candidate composition | one selected strict JSON | local fakes only where contract permits; external slots Disabled/Blocked/Candidate without qualification | schema/domain/builder/negative flow; no positive owner claim |
| `ci_contract` | TestFake only | isolated fixture-selected strict JSON | exact finite fake registry | deterministic contract/state/failure only |
| `integration_candidate` | Api/Worker/Jobs | reviewed strict JSON | adapter/real-like only where formal contract exists; otherwise Blocked | candidate integration; unavailable does not count pass |
| `production_candidate` | Api/Worker/Jobs | reviewed strict JSON | no fake; waits implementation/deployment qualification | design/validation input only until real evidence |

Example numbers in Step 7 demos are parser/cross-field fixtures, not performance/capacity thresholds. `05` must obtain any numeric performance oracle from a formal authority or mark it pending/not evaluable；it may not promote examples into targets。

## 6. `06-验收标准.md` gate candidates

| Gate candidate | Acceptance condition input from 04 | Required future evidence theme | Veto/fail ceiling |
|---|---|---|---|
| CFG-G01 schema completeness | exactly 12 roots/153 leaves/39 derived/13x5 slots/7x6 jobs | parser/schema manifest + exhaustive test results | missing/extra/alias/coercion -> veto |
| CFG-G02 deterministic validation | V0~V12、stable issue order、all-or-nothing candidate | unit/property/fault raw + report pairing | partial publication/non-determinism -> veto |
| CFG-G03 owner/invariant protection | no tools/sandbox/capability/governance/method/provider/observability ownership creep | dependency/redline scan + negative contract tests | local shadow/bypass -> veto |
| CFG-G04 profile/fake isolation | exact 4x4 matrix；fake only CI/TestFake | builder/entry composition evidence | fake in non-test/counted qualification -> veto |
| CFG-G05 sensitive boundary | zero secret leaf；no raw source/value/full ref output | static/dynamic redaction checks and failure artifacts | any secret/body/path leak -> veto |
| CFG-G06 startup atomicity | one immutable snapshot + compatible facade; no external constructor call | failure injection/visibility/order evidence | partial facade/snapshot/mid-op change -> veto |
| CFG-G07 fail-closed seams | 13 slots and current blockers prevent positive calls | per-slot negative and independently qualified positive evidence | Candidate/Bound/design/ping as Ready -> veto |
| CFG-G08 jobs safety | exact controls、lease/cursor/fence、static retry | per-job failure/replay evidence | stale lease/cursor skip/blind effect retry -> veto |
| CFG-G09 snapshot/replay | exact captured ref; no current substitution | flow/restart/by-ref evidence | policy drift on replay -> veto |
| CFG-G10 cold change/rollback | full validation/current compatibility/truth immutability | deployment/restart/rollback evidence only when executed | online bypass or fact reversal -> veto |
| CFG-G11 Unknown/degraded correctness | explicit safe subset/fence/status-only recovery | fault injection + state/output evidence | Unknown promoted or degraded authority -> veto |
| CFG-G12 evidence truth | config signals body-free and separate from observed/evidence/verdict | same-run artifact/report/index qualification later | static doc/fake/blocked counted pass -> veto |

06 alone decides pass/fail thresholds、evidence eligibility、blocker disposition、risk acceptance、final verdict and signature. Until implementation and matching evidence exist, every candidate gate remains `not_evaluated`/`blocked_dependency` as appropriate；this Step supplies no verdict。

## 7. `07-实施计划.md` planned implementation inputs

Recommended dependency order, constrained by formal `03` public contracts：

```text
private schema vocabulary + raw candidate types
  -> duplicate-aware strict JSON parser / closed shape
  -> typed leaf converters + security scanner
  -> per-domain validators + static derivation
  -> profile/authority matrix
  -> 13-slot validator + 7-job validator
  -> cross-domain blocker/fake/dependency validator
  -> canonical fingerprint + RuntimeConfigSnapshot assembler
  -> RuntimeConfigSnapshotPort current/by-ref implementation boundary
  -> RuntimeBuilder dependency compatibility + BlockedAdapter construction
  -> EntryAuthority facade publication + operation capture integration
  -> body-free change/failure diagnostic candidates
  -> configuration tests/gates/evidence materialization boundaries
```

### 7.1 Boundary candidate matrix

| Candidate boundary | Inputs | Completion predicate for future 07 | Current posture |
|---|---|---|---|
| CONFIG-01 schema/source/parser | Step 5/7/8/9 V0~V4 | exact closed parse; safe errors; no public contract drift | planned; implementation absent |
| CONFIG-02 typed conversion/domain validators | V5~V8 + CFG-01~10 | all leaves/relations/static values mapped | planned |
| CONFIG-03 slot/job/cross validator | V9~V11 + S/J/X gates | exact set/tuple/blocker/fake/dependency semantics | planned; positive seams blocked |
| CONFIG-04 assembly/snapshot store | V12 + existing snapshot/Port | deterministic fingerprint; immutable current/by-ref; issue_count zero | planned; storage/identity details require implementation design |
| CONFIG-05 builder/facade/capture | existing builder/metadata/flow contracts | atomic entry exposure; one snapshot per operation/page; zero constructor I/O | planned; entry/owner positive gates blocked |
| CONFIG-06 change/failure diagnostics | Step 10/11 | body-free safe candidates; no Runtime approval/deploy truth aggregate | planned; audit/observability owner pending |
| CONFIG-07 config test/evidence gates | Step 12 `CFG-T/G` inputs | cases/fixtures/commands/raw/report/evidence planned per 05/06 | planned; no artifact/evidence exists |

Actual `07` must integrate these candidates into its existing capability/phase ordering rather than invent parallel public modules. It must create/update implementation ledger and boundary skeletons only under the implementation plan SOP; planned skeleton does not authorize code or satisfy any Gate。

### 7.2 Implementation Design Gate inputs

- formal `03` and completed `04/05/06/07` baseline must be bound to an immutable design commit before code；current dirty workspace is not that baseline。
- any needed public loader/validator trait、new error variant、snapshot field、Query/Event/Continuation field or online reload state is a design blocker and returns to `03/04`。
- only L0-core may become a reviewed compile dependency candidate；all other seams remain runtime/event/ref/adapter/fake as classified。
- target repo/worktree/toolchain/dependency versions are implementation-time facts；none exists merely because a path is planned。
- current blockers remain active; fake/private schema/default cannot close them。

## 8. Future `09-部署与运维手册.md` decisions

| Operations must decide | Must preserve from 04 | Must not infer from 04 |
|---|---|---|
| physical config path/source transport | maps to one logical `runtime_config_source`; one document; no merge | a default path or discovery rule |
| entry assertion injection | equality-only `runtime_entry_profile_assertion` | leaf env override |
| file ownership/permissions/size/read atomicity | raw bytes transient; source/body not logged | chosen OS/container/storage mechanism |
| process start/replace/stop topology | validate/build before entry exposure; old/new truth distinct | blue-green/rolling/systemd/container readiness |
| cold rollback procedure | prior document fully revalidated/current compatible | online pointer/LKG/hot patch |
| source/version retention | `snapshot_by_ref` must fail closed if absent | duration/backend/backup already chosen |
| adapter credential integration | credential/route remains owning adapter/security | secret field/backend/KMS/Vault chosen by Runtime |
| owner contract/blocker update procedure | Candidate cannot suppress blocker; owner truth required | ping/design file as qualification |
| safe startup/change/failure logs | only allow-listed body-free fields | logging/metric/trace backend or retention |
| alerts/dashboard/runbook/on-call | consume safe failure/posture candidates | delivered alert/observed/evidence existence |
| backup/restore/drill | protect reviewed documents and required by-ref history | actual RTO/RPO/drill result |

No deployment command、mount、path、endpoint、credential、secret backend、alert threshold、retention duration、runbook action or successful drill belongs in `04`。

## 9. Upstream blocker handoff

| Blocker | `05` | `06` | `07` | future `09` / owner action |
|---|---|---|---|---|
| `L2R-UP-001` Tools/Sandbox action/receipt/feedback/cleanup contract | negative zero-call/status fake; positive lane unavailable | positive invocation qualification not evaluable | invocation adapter/call positive boundary blocked | wait formal L2-tools/L4-sandbox contract; no Runtime direct Sandbox |
| `L2R-UP-002` safe-material producer/route/ack/observed seam | candidate/attempt/gap and no-observed negative tests | delivery/observed qualification not evaluable | handoff/observation positive boundary blocked | wait producer/route/ack and Observability owner closure |
| `L2R-UP-003` shared Tools schema/SDK seam | local typed candidate compatibility and no-shadow-schema tests | shared contract/client qualification not evaluable | Core/SDK positive binding blocked | wait formal Core-compatible schema and downstream SDK contract |
| `L2R-UP-004` model adapter | provider-neutral selection/material negative tests | positive model integration not evaluable | model Port adapter remains blocked | model owner supplies contract/qualification/credential externally |
| `L2R-UP-005` durable memory | working/ref-only and mandatory/optional failure tests | no durable lifecycle acceptance | durable adapter positive work blocked | durable owner supplies lifecycle/ref contract |
| `L2R-UP-006` Core/Bus/Observability runtime schemas/routes | event/projection/handoff negative and exact-payload tests | shared schema/route delivery not evaluable | local candidates only; no shadow shared schema | Core/Bus/Observability owners close formal contracts |
| `L2R-UP-007` Sandbox/Observability implementation qualification absent | deterministic negative fake; no real-isolation/observed claim | real isolation/observation integration not evaluable | real adapter qualification blocked | implementation/acceptance owners provide real qualification evidence later |
| `L2R-UP-008` Method Library dirty baseline | ref/version behavior; no immutable commit claim | reproducibility gate blocked | Design Gate cannot bind immutable upstream baseline | owner supplies reviewed immutable baseline |
| `L2R-CP-001` checkpoint physical seam | Prepared/Unknown/no-resume tests | stable checkpoint positive gate not evaluable | checkpoint positive adapter blocked | owner closes atomic commit/receipt/status contract |
| `L2R-ENTRY-001` actor/scope/member entry | typed negative entry/builder tests | production entry binding not evaluable | facade mapping/lifecycle activation blocked | member/entry owner supplies typed contract; Runtime owns no container lifecycle |
| `L2R-IMPL-001` implementation absent | tests remain planned/not_run | all evidence-based gates not evaluated | target repo/baseline/build/test/commit blocked | later explicit implementation authorization and repo facts |

Blockers do not prevent completing the configuration design because every one has a closed negative representation. They do prevent positive integration、evidence qualification、acceptance and readiness claims。

## 10. No-redefinition contract

Downstream documents may reference but must not redefine：

- exact 12 roots、153 leaves、39 static-derived values、13 slot names/tuple、7 job names/tuple/static retry；
- no external default values、one selected strict JSON、two logical selectors、no leaf env merge；
- four environment classes x four entry profiles and TestFake isolation；
- zero Runtime secret leaf、typed sensitive ref/output redaction；
- V0~V12、startup-only immutable publication、no in-process reload/hot/LKG；
- Candidate/Bound not Ready、operation exact snapshot capture、Unknown fences；
- whole-document cold change/rollback and no reversal of committed truth；
- current blocker IDs and compile/runtime/event/ref/adapter/fake classification。

If testing、acceptance、implementation or operations discovers that any item must change, it records a design blocker and reopens the owning `03/04` Step before treating the change as executable。

## 11. Downstream handoff stop review

| Handoff | Inputs complete | Owner boundary clear | No fabricated status | Result |
|---|---|---|---|---|
| 05 tests | 15 slices + env matrix + oracles | case/fixture/command/evidence owner deferred | not_run/no artifacts | pass |
| 06 acceptance | 12 gate candidates + veto ceilings | thresholds/evidence/verdict/signoff deferred | not_evaluated | pass |
| 07 implementation | ordered objects + 7 boundary candidates + Design Gate | implementation plan/ledger owns actual progression | planned/blocked | pass |
| future 09 operations | 11 decision areas + invariant inputs | physical deployment/secret/alert owner deferred | no deployment/drill | pass |
| upstream owners | blocker-specific required closure | no Runtime owner creep | positive unavailable | pass |
| Observability | body-free signal candidate only | backend/observed/evidence external | no observed claim | pass |

## 12. 当前问题诊断、改动前后与 03 影响

| Dimension | Historical Step 12 | Rebuilt Step 12 |
|---|---|---|
| test inputs | old reload N/N+1 slices and 18 mixed failures | startup/cold change + CF-A/B + exact current schema |
| implementation order | source merger/env override/reload state | one-document parser, exact validators, existing snapshot/builder contracts |
| acceptance | broad gate themes | 12 candidate gates with evidence/veto ceiling and no verdict |
| operations | reload trigger/LKG semantics | cold process replacement; no physical deployment choice |
| blockers | generic positive caveat | each canonical blocker mapped across 05/06/07/09 |

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| downstream test/gate/planned/operations handoff | 否 | documentation ownership and traceability | 不适用 | 无回写 |
| implementation object order reuses existing public contracts | 否 | private implementation decomposition only | 03 §4/§6/§13 | 无回写 |
| public contract change discovered downstream | future yes | design blocker, not current conclusion | reopen owning 03 Step | 无当前回写 |

## 13. 回填草稿与下一门禁

正式 §12 写入：truth boundary -> dependency graph -> handoff table -> 05 slices/environment -> 06 candidate gates -> 07 planned inputs -> future 09 decisions -> blocker handoff -> no-redefinition contract。不得生成/修改下游文档、planned skeleton、actual command、run/artifact/report/evidence、verdict、signoff、commit 或 readiness。

```text
step_12 = done
gate_status = pass
gate_reason = downstream_truth_test_gate_planned_operations_and_blocker_handoff_closed
next_allowed_action = delete_and_rebuild_step_13_migration_deprecation
formal_04_write_allowed = false
step_13_write_allowed = true_after_flow_and_ledger_advance
commit_required = false
```
