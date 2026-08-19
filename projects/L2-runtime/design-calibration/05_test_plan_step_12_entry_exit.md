# L2-runtime 05 测试方案 Step 12：进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填位置：正式 `05-测试方案.md` §12
> 输入：Step 7 data、Step 8 environments、Step 9 gates、Step 10 NFR/VF、Step 11 defects/retest
> 状态：`completed_continuous_authorized`
> 当前事实：测试方案设计准则已定义；实际实现、环境、run、result、artifact、report、exit、qualification 均未发生

## 1. 四级 gate 与当前 disposition

```text
G0 design-to-implementation handoff
        |
        v
G1 local deterministic execution/exit (177 TC)
        |
        +------> G2 per-seam integration candidate
                         |
                         v
                 G3 per-slot positive qualification
```

| Gate | Decides | Does not decide | Current disposition |
|---|---|---|---|
| `G0` | 05 是否给未来实现/测试 agent 提供完整对象、case、data、environment、suite、oracle、evidence contract | code/test exists or passes | design criteria complete at Step 12; formal 05 still waits Step 15 |
| `G1` | one fixed local/CI run 是否完整证明 Runtime deterministic semantics and fail-closed boundary | real owner adapter/Sandbox/model/memory/Bus/Obs readiness | `not_entered`, blocked by `L2R-IMPL-001` and unverified toolchain |
| `G2` | an individually declared adapter/profile seam 是否完成 controlled parity/candidate validation | positive owner qualification or production readiness | affected seams `blocked_dependency/not_runnable` |
| `G3` | one canonical external slot 是否有真实 owner/adapter/environment independent evidence | whole product acceptance, signoff, deployment readiness | 13/13 `blocked_dependency/not_runnable` |

G1 can exit with G2/G3 explicitly blocked because local slot cases prove only finite fail-closed semantics. Such an exit is `local_contract_complete_candidate`, never overall readiness. G3 is assessed per slot; no “some slots passed, therefore Runtime ready” aggregate exists in 05.

## 2. G0：测试设计交付准则

| ID | Checkable criterion | Current design review |
|---|---|---|
| `ENT-D01` | formal `00~04` are current sources; old README/05/06/07 and old dependency order remain historical only | designed |
| `ENT-D02` | denominators fixed: 20 core FR、4 peripheral、44 BR、19 NFR、36 AC、8 VF、37 CUT | designed |
| `ENT-D03` | canonical cases/evidence fixed: 172 raw + 5 aggregate = 177 TC/177 planned EV | designed |
| `ENT-D04` | 12 CAP、17 C、12 Q、6 E、6 O、7 J、31 states、13 slots、15 config slices retain independent identity | designed |
| `ENT-D05` | every raw case has one owning suite; aggregate only references same-run raw | designed |
| `ENT-D06` | datasets/builders/isolation/cleanup and 4 environment names are defined | designed |
| `ENT-D07` | scripts/artifact/report schemas are planned, not falsely marked created | designed |
| `ENT-D08` | all 11 blockers plus `L2R-LANG-001` are transmitted without fake readiness | designed |
| `ENT-D09` | Step 13/14/15 still must close evidence/regression/formal assembly before formal 05 handoff | pending serial work at this Step |

This table is a design audit, not a runtime checklist result or acceptance verdict.

## 3. G1 local formal-run entry criteria

All items must be true in a future run context. “Blocked” or “not applicable” cannot satisfy a required local entry item.

### 3.1 Baseline and implementation

- [ ] `ENT-L01` Formal `00~05` source fingerprints and canonical manifest version are frozen for the run; no historical alias resolves.
- [ ] `ENT-L02` `L2R-IMPL-001` is closed by a locatable target implementation; implementation revision/ref is recorded, not inferred from a directory.
- [ ] `ENT-L03` Rust edition 2024 and planned `rust-version=1.93` compatibility are actually verified, or a formal baseline change has been re-reviewed; async/runtime/store/broker/scheduler selections satisfy design Ports.
- [ ] `ENT-L04` Api/Worker/Jobs/TestFake entry builders, 13 slot bindings, local Ports, UoW/repos/inbox/outbox/history/lease/cursor and immutable config snapshot facade are constructible.
- [ ] `ENT-L05` only Core is a compile candidate; dependency graph proves runtime/event/ref/adapter/fake relations are not sibling package dependencies.

### 3.2 Manifest, data and environment

- [ ] `ENT-L06` source manifest resolves exact 177 TC/177 EV and expanded variant identities to current design anchors.
- [ ] `ENT-L07` every raw case has a nonempty deterministic fixture manifest, fixed seed/clock/typed ID queues, config ref/digest and finite fault/external scripts as applicable.
- [ ] `ENT-L08` every parallel case has an isolated namespace/output root; cleanup and canary residue checks are enabled.
- [ ] `ENT-L09` `ci_contract/TestFake` and `ci_contract/fault` can be built without real owner dependency; fake registry is finite and cannot bind non-TestFake profiles.
- [ ] `ENT-L10` strict config document passes exact 12/153/39/13x5/7x6/V0~V12 checks; no default, hot reload or partial facade is introduced.

### 3.3 Automation and evidence preflight

- [ ] `ENT-L11` all Step 9 gate/check/report scripts exist and accept fixed `--run-id`, artifact root, config profile and case manifest parameters.
- [ ] `ENT-L12` selector preflight expands to the declared nonzero denominator with no implicit filter/skip/ignore.
- [ ] `ENT-L13` `artifacts/test/<run_id>` and `reports/runs/<run_id>` are new, isolated, writable roots; `<run_id>` is fixed and not `latest`.
- [ ] `ENT-L14` raw schemas、digest rules、status vocabulary、redaction scanner、pairing/no-static-evidence validator pass synthetic passed/failed/blocked/infra/invalid fixtures.
- [ ] `ENT-L15` defect/incident/blocker registries can preserve first failure and link retries to new runs.

If any item fails, G1 is `not_entered` or `infra_error`; the runner may execute diagnostics, but cannot publish a formal local result.

## 4. G1 local formal-run exit criteria

All conditions bind one fixed `<run_id>` unless an S/A retest explicitly points to a later complete run. Best-of-run merging is prohibited.

- [ ] `EXT-L01` all seven raw suites contain exactly 172 owning raw TC results and no extra/unowned raw result.
- [ ] `EXT-L02` every required declared variant is present; empty selector、filter、skip、ignore、missing、cancelled and `not_evaluated` count as incomplete, not pass.
- [ ] `EXT-L03` all 172 raw case oracles passed: typed state/result、write/call journal、phase、replay/collision/unknown、redaction and cleanup assertions.
- [ ] `EXT-L04` five `local_e2e` aggregates were derived from same-run raw results and passed without rerun/cherry-pick.
- [ ] `EXT-L05` all mandatory source、denominator、dependency、forbidden-material、fake-leak、status-truth、redaction、pairing and no-static-evidence checks passed.
- [ ] `EXT-L06` NFR-001~003 characterization attachments are valid for declared fixed workload/profile; no numeric performance verdict is required or invented.
- [ ] `EXT-L07` NFR-004~019 and VF-001~008 canonical oracle sources are present; no VF detection exists.
- [ ] `EXT-L08` there are zero open S or A product/tooling defects affecting the run; every prior S/A closure follows Step 11 targeted + impacted new-run rules.
- [ ] `EXT-L09` cleanup/residue is clean; no `infra_error` or invalid artifact remains for a required suite/check/report.
- [ ] `EXT-L10` every case EV candidate is derived from a valid raw case + suite report pair in the same run; no static/manual/moving alias source.
- [ ] `EXT-L11` run context, manifest, selector, blockers, suite/check records, stdout/stderr, reports and failure/blocked explanations are complete and redacted.
- [ ] `EXT-L12` all 11 upstream/implementation blockers and `L2R-LANG-001` are represented at their actual run-time status without closure inference.
- [ ] `EXT-L13` G1 output is labeled only as local deterministic contract result; it contains no acceptance verdict、signoff、production readiness、real adapter qualification or Observed truth.

`blocked_dependency` is not allowed for a required G1 raw case/check: local cases are deliberately constructible with finite fake/BlockedAdapter. If one cannot run because implementation or harness is absent, G1 has not exited. G2/G3 blockers are disclosed separately.

## 5. G2 integration-candidate entry and exit

G2 is independently evaluated for one named seam/profile. It cannot reuse TestFake as the subject under test.

| ID | Entry criterion | Exit criterion |
|---|---|---|
| `ENT-I01/EXT-I01` | formal owner contract/schema/version and responsibility boundary frozen | recorded subject exactly matches frozen owner contract; no Runtime shadow type/truth |
| `ENT-I02/EXT-I02` | target Runtime and candidate adapter implemented with a non-TestFake compatible profile | candidate request/result/error/status parity cases pass; fake leak check passes |
| `ENT-I03/EXT-I03` | isolated integration environment/data/cleanup and owner endpoint authority exist without embedding secret in Runtime config | raw artifacts/reports/redaction/cleanup valid for independent fixed run |
| `ENT-I04/EXT-I04` | exact cases/variants and candidate limitations declared before run | no empty/filter/skip; failures/blocked/infra preserved; no local-run merge |
| `ENT-I05/EXT-I05` | relevant blocker ledger has a verifiable owner fact change | result states only candidate parity/compatibility; it does not claim owner production qualification |

Until all entry items hold, status is `blocked_dependency/not_runnable`. A fake-based negative test remains G1 evidence only.

## 6. G3 per-slot positive qualification entry and exit

For each slot `01~13`, all entry items must hold independently:

- [ ] `ENT-Q01` formal owner contract/schema and explicit positive responsibility are closed.
- [ ] `ENT-Q02` real adapter implementation and non-TestFake profile are selected and identifiable.
- [ ] `ENT-Q03` owner implementation/environment is available under authorized isolated test conditions.
- [ ] `ENT-Q04` dedicated `TC-QUAL-SLOTnn` manifest, dataset, oracle, suite owner and planned EV are formally added through rebaseline; it is not borrowed from `TC-SLOTnn-001`.
- [ ] `ENT-Q05` relevant `L2R-UP/CP/ENTRY/IMPL/LANG` blockers are closed by owner facts, not design files/ping/fake/Candidate/Bound.
- [ ] `ENT-Q06` raw/report/redaction/status/evidence and independent reviewer roles are defined before execution.

Per-slot exit requires:

- [ ] `EXT-Q01` dedicated positive case and all required negative/replay/unknown variants pass in one fixed qualification run.
- [ ] `EXT-Q02` request/result/receipt/status evidence comes from the real subject and exact contract version; no fake fallback.
- [ ] `EXT-Q03` local Runtime truth remains owner-separated; receipt/ACK is not elevated beyond the formal owner contract.
- [ ] `EXT-Q04` artifacts/reports are redacted, paired and retain failures/retries/blockers.
- [ ] `EXT-Q05` the result is limited to that slot/version/profile/environment; no whole-Runtime/product readiness inference.

Current G3 disposition is 13/13 blocked. The canonical mapping remains: 01 governance, 02 definition_resolver, 03 source_resolver, 04 durable_memory, 05 capability_exposure, 06 invocation_caller, 07 model_context_materializer, 08 model_decision, 09 child_runtime, 10 checkpoint_commit, 11 handoff_submission, 12 event_publisher, 13 projection_store.

## 7. Pause, abort and re-entry rules

| Trigger | Disposition | Required action before re-entry |
|---|---|---|
| formal 00~05 semantics or owner contract changes | `paused_design_drift` | impact analysis; re-open affected Step 3~14; new manifest fingerprint/run |
| denominator/source/TC/EV mismatch | `invalid_execution` | fix canonical registry/check; never shrink selector |
| toolchain/profile/config preflight fails | `not_entered/infra_error` | close preflight issue; new run |
| S/VF detected | `failed_abort` | preserve run; triage/fix/targeted + full 177 new-run retest |
| A detected | `failed` | preserve run; targeted + impacted new-run retest |
| secret/body leak or cross-run residue | `failed_abort/quarantine` | quarantine outputs; security review; scanner/fixture fix; new clean run |
| flaky/nondeterministic P0 | `failed` | retain all attempts; remove nondeterminism; no quarantine-to-pass |
| cleanup/artifact/report failure | `infra_error/invalid_artifact` | repair harness; rerun new fixed run |
| blocker owner fact changes | G2/G3 `re-entry_review` | verify source, contract, manifest/profile impact; do not mutate previous run |
| attempted retry with same run or `latest` | `invalid_execution` | reject run; allocate new fixed identity and link prior run |

## 8. Current gate truth and stop-review

| Audit | Result |
|---|---|
| criteria checkability | stable IDs; no “基本完成” language |
| local vs positive | G1/G2/G3 separated; blocked positive does not become local pass/readiness |
| denominator | exact 172 raw + 5 aggregate; all required local items must truly run |
| defects | S/A zero required for G1 exit; no ad hoc P0 waiver |
| evidence | valid fixed-run raw/report pair required; Step 13 supplies exact schema |
| current execution | not entered; no result/artifact/report exists |
| current positive qualification | 13/13 blocked_dependency/not_runnable |

```text
step_status = completed_continuous_authorized
G0_design_criteria = complete_pending_steps_13_15
G1_local_execution = not_entered
G2_integration_candidate = blocked_dependency_where_applicable
G3_positive_qualification = blocked_dependency_13_of_13
actual_exit_or_readiness = false
next_step = Step 13
formal_05_write_allowed = false_until_step_15
```
