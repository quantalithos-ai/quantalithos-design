# L2-runtime 06 验收标准 Step 10：可观测性、审计与证据

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填位置：正式 `06-验收标准.md` §10
> 状态：`completed_continuous_authorized`
> 输入：formal 03 §14、formal 05 §§9/10/13 与 177-row registry、Step 5~9 的 P0 裁决合同
> 事实边界：本 Step 定义 future observation/audit/evidence eligibility；当前没有真实 run、artifact、report、EV instance、acceptance package、review 或 verdict

## 1. Observation、audit 与 evidence 的所有权分层

| Material | Runtime owns | External/test owner | Acceptance meaning |
|---|---|---|---|
| `RuntimeObservation` | body-free local candidate、phase、disposition、correlation、typed refs、safe reason、redaction marker | L4-observability owns backend、delivery、Observed、retention/audit projection | candidate 本身不是 EV/evidence |
| local history/audit fact | 与 domain UoW 同提交的必要历史、state transition、causation/source/version refs | external audit backend may consume immutable snapshot | local fact 可被测试验证，不等于外部 audit truth |
| test artifact/report | Runtime implementation/test tooling 不属于 business truth | owning suite/check/report generator writes fixed-run material | 只有通过资格检查才可成为 evidence candidate |
| EV detail/index | Runtime 只提供 canonical planned identity | evidence generator 从同 run raw/report/checks 机械派生 | `derived` 仍非 accepted/verdict |
| acceptance report | no Runtime write authority | script draft + authorized human/Agent review | future 06 裁决输入；不得反写 raw status |

```text
Runtime observation candidate
  != Observed
  != audit backend fact
  != test artifact
  != EV instance
  != acceptance verdict
```

## 2. 可观测与审计门禁

### 2.1 Required local carrier

Future evidence must prove each applicable Flow emits or persists only the formal body-free carrier fields:

```text
observation_id(candidate only), operation, phase, disposition,
correlation, actor_ref?, scope_ref?, object_refs, source_refs,
version_refs, safe_reason?, config_snapshot_ref, occurred_at, redaction
```

Allowed phases are `Entry/Validation/Reservation/Read/Decision/LocalCommit/ExternalAttempt/Incorporation/Projection/Publish/Completion`. Allowed disposition must remain finite and phase-valid; no free-text status may promote `candidate/pending/unknown` to completion.

| Surface | Required audit/observation proof | Failure condition | Canonical source |
|---|---|---|---|
| Command/loop | operation/correlation/config snapshot；T1/T2/T3；object/version/fence；typed result | full input/current dump、implicit retry、missing local commit/unknown phase | C01~17、LOOP、OBS001 |
| state transition | SM ID、subject、from/to、expected/new version、guard、history/source refs | illegal edge unrecorded、body/reason leak、variant drift | SM01~31、OBS001 |
| external attempt | slot/Port/method、request digest、attempt identity、finite posture | endpoint/secret/route/quota/cost/raw owner result、Ready claim | SLOT/CAP/C、OBS002 |
| inbound event | source/event/digest/order、inbox disposition、linked fact、commit、ACK count | raw payload、ACK-before-commit、ACK=acceptance | E01~06、ENTRY002、UOW005 |
| outbound/publish | source fact、outbox event ID/schema/digest、stored bytes、receipt posture | payload rebuild、receipt=delivery/Observed | O01~06、J07、UOW006 |
| job/page | operation/partition/lease epoch/config/from-to cursor/count/disposition/report ref | scheduler lifecycle、stale epoch write、report=evidence | J01~07、SM18、UOW007 |
| checkpoint/handoff | checkpoint/fence/receipt/outcome/material/attempt/gap refs | context/body、Prepared=Committed、ACK=Delivered/Accepted | CAP10~12、SM11~14、BOUND007 |
| error/recovery | closed error category、safe reason、phase、recovery action/fence | stack/body/secret、bare retry、Unknown=success | ERR001~007、UOW/REPLAY |

### 2.2 Redaction and cardinality

Metrics may use operation、phase、safe disposition、profile、slot class、event kind、job operation and bounded state variants. Actor/run/object IDs、prompt/body、provider/user value、endpoint、secret、query text and full cursor are forbidden metric labels. Trace attributes may carry stable IDs only under redaction policy; logs use the safe carrier.

Redaction must happen before serialization. A redaction failure blocks external emission and evidence eligibility; it cannot be repaired by editing generated Markdown. `TC-OBS-002`,`TC-SEC-001/002`,`TC-CFG09-001` and `check_redaction.sh` are mandatory sources.

## 3. Evidence maturity and identity

```text
M0 planned TC/EV identity
  -> M1 fixed-run machine artifact
  -> M2 run-scoped report preserving raw status
  -> M3 derived EV detail + complete evidence index
  -> M4 acceptance drafts from one M3 run
  -> M5 reviewed input for future authorized verdict
```

| Stage | Eligibility requirement | Forbidden promotion |
|---|---|---|
| M0 | exact 177 canonical registry rows | table/ID -> evidence |
| M1 | real implementation revision/context、172 raw + 5 aggregate case artifacts、journals/logs/checks | process exit/static JSON -> pass |
| M2 | suite/gate reports derived read-only from raw DTOs | handwritten summary replaces raw |
| M3 | same-run raw case + owning suite report + required checks + clean digest/redaction/pairing | cross-run/missing pair/static mapping -> derived |
| M4 | `reports/acceptance/*` draft cites one fixed M3 run and all non-green status | draft -> verdict/risk acceptance/signoff |
| M5 | authorized review notes preserve machine status and declare scope/open issues | review -> owner truth/readiness |

Evidence instance identity is fixed as:

```text
(run_id, evidence_id, case_id, owning_suite,
 case_artifact_digest, suite_report_digest)
```

No moving alias, second `EV-CAND-*` namespace or evidence reuse across runs is allowed. Retry/retest creates a new run and new instances, links `prior_run_id`, and preserves the first failed/infra run.

## 4. Fixed path and writer/reader contract

| Material | Fixed path | Writer | Acceptance validation |
|---|---|---|---|
| run context/manifests | `artifacts/test/<run_id>/meta/*.json` | real gate orchestrator/manifest builder | actual implementation revision/workspace/source/config/selector/blockers visible |
| checks | `artifacts/test/<run_id>/checks/<check_id>.json` | named check | exact identity/status/findings/digest; no hand edit |
| raw suite/case/journal/log | `artifacts/test/<run_id>/suites/<suite>/...` | owning runner/aggregator | exact manifest variants, journals, clean logs, failure retained |
| gate summary/index | `artifacts/test/<run_id>/gate-summary.json`;`evidence-index.json` | orchestrator/evidence generator | exact 172/5/177 and same-run pairing |
| run reports | `reports/runs/<run_id>/...` | report scripts | read-only raw derivation; all statuses visible |
| EV detail | `reports/runs/<run_id>/evidence/<evidence_id>.md` | evidence report generator | exact TC/suite/raw/report/digest/AC/VF refs |
| acceptance drafts | `reports/acceptance/*.md` | draft generator + review additions | cannot mutate machine index/status or create verdict |
| review notes | `reports/review/*.md` | authorized human/Agent | notes only; dispute visible |

Invalid paths include formal `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>/...`、absolute/escape/symlink paths and scripts under `reports/`. `reports/README.md` may name a candidate run but is not an accepted-run alias.

## 5. Evidence eligibility gate

```text
evidence_eligible(EV) :=
  EV row exactly resolves in canonical registry
  AND fixed run CaseManifest contains the exact TC/EV/suite mapping
  AND case artifact contains every declared variant and assertion
  AND owning suite report includes that exact case and derived status
  AND artifact/report digests and paths verify in the same run
  AND all checks required by gate/case pass
  AND redaction and cleanup are clean
  AND evidence index has no duplicate/orphan/static item
```

| Source condition | Required derivation status | Acceptance impact |
|---|---|---|
| case + suite + checks passed, pair/digest/redaction clean | `derived` | may support mapped AC/VF review; not verdict |
| assertion/suite/check failed | `ineligible_failed` | mapped P0 AC cannot pass; defect candidate |
| real positive prerequisite absent | `ineligible_blocked` | G2/G3 remains blocked; cannot support positive qualification |
| runner/fixture/cleanup/report infra error | `ineligible_infra_error` | gate/evidence not qualified |
| filter/skip/schema/path/digest/orphan/static/cross-run/redaction invalid | `ineligible_invalid` | baseline invalid; no acceptance decision from it |

G1 requires all 177 rows eligible. The local denominator is fixed at `172 raw + 5 same-run aggregate`; G2/G3 are independent manifests/runs and cannot be merged into G1. `TC-SLOT01~13-001` local EVs never qualify real owners.

## 6. Nine mandatory checks

| Check | Required proof | Failure effect |
|---|---|---|
| `check_source_manifest.sh` | current formal sources resolve；historical aliases rejected | invalid baseline / VF008 direction |
| `check_test_denominators.sh` | 172/5/177、12 CAP、48 protocol/jobs、31 states、13 slots、15 config exact | invalid baseline; no denominator shrink |
| `check_dependency_boundaries.sh` | only Core compile candidate；runtime/event/ref/adapter/fake exact | VETO/VF007 |
| `check_forbidden_material.sh` | forbidden body/secret/route/quota/cost/hidden reasoning absent | VETO/VF003 |
| `check_fake_profile_leak.sh` | fake only CI/TestFake；non-test zero fake binding | VETO/VF006 |
| `check_status_truth.sh` | planned/blocked/not-run/fake/ACK/receipt not promoted | VETO/VF005/006 |
| `check_redaction.sh` | raw JSON/log/Markdown/acceptance drafts clean | VETO/VF003；evidence invalid |
| `check_artifact_report_pairing.sh` | every EV has same-run raw + owning suite report | evidence incomplete/invalid |
| `check_no_static_evidence.sh` | index derives from verified pair, never registry/table alone | VETO/VF006/008 |

All nine are required for a future full G1/release-design evidence package. A check result is itself not a semantic EV and cannot replace the owning case.

## 7. Report completeness checklist

| Check item | Fixed path | Pass condition | Failure impact |
|---|---|---|---|
| context/source/case/selector/blocker manifests | `artifacts/test/<run_id>/meta/*.json` | real implementation/source/config facts；exact selectors；12 blockers retained | invalid/not_evaluable |
| suite raw and report count | artifacts suites + `reports/runs/<run_id>/suites/*.md` | exact `35/32/32/16/25/15/17/5`；one raw owner | invalid/incomplete |
| gate result | `reports/runs/<run_id>/gate-results.md` | every suite/check actual status and counts shown | G1 exit blocked |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 177 rows, zero duplicate/orphan/static/cross-run | invalid/incomplete |
| EV detail | `reports/runs/<run_id>/evidence/<evidence_id>.md` | every mapped P0 row resolves raw/report/digests/AC/VF | affected AC not_evaluable |
| redaction | `reports/runs/<run_id>/redaction-check.md` | artifact/log/report/draft scan clean | VETO/evidence invalid |
| blockers | `reports/runs/<run_id>/blockers.md` | all 12 actual postures/source refs; no inferred closure | qualification/readiness claim blocked |
| summary | `reports/runs/<run_id>/summary.md` | fixed run, manifest, implementation fact, G1/G2/G3 separation, non-green retained | package incomplete |

## 8. Acceptance handoff checklist

| Draft | Required content | Prohibited content | Missing impact |
|---|---|---|---|
| `reports/acceptance/handoff.md` | one fixed run、design/implementation refs、G1 source、G2/G3 blockers、index/report links、scope/open issues | automatic acceptance/readiness/signature | handoff incomplete |
| `reports/acceptance/veto-checklist.md` | VF001~008 each `not_triggered/triggered/not_evaluable` with concrete refs | static all-pass、missing row | verdict not decidable |
| `reports/acceptance/risk-acceptance.md` | residual candidates、impact、required role、action/deadline/expiry fields | invented accepter/decision/date | conditional pass forbidden |
| `reports/acceptance/open-issues.md` | all failed/blocked/infra/invalid、S/A defects、missing reports and owner seams | green-only filter or hidden blocker | package invalid/incomplete |

Drafts may be generated, but future acceptance requires authorized human/Agent review. Review can annotate `pending/reviewed/disputed`; it cannot alter case/suite/check/EV status.

## 9. Evidence/report stop-review and cross-audit

| Audit | Design conclusion | Actual state |
|---|---|---|
| observation vs evidence | candidate/Observed/audit/EV/verdict identities separated | no actual observation or evidence |
| identity | 177 TC -> 177 EV exact; no second namespace | planned_not_generated |
| suite owner | 172 raw uniquely owned + 5 same-run aggregates | no artifacts |
| checks | 9/9 named, fixed responsibility and failure effect | scripts not created |
| paths | exact artifact/report/acceptance roots; no latest/project nesting | paths planned only |
| eligibility | raw+suite+checks+digest+redaction+pairing required | no derived items |
| failure preservation | failed/blocked/infra/invalid retained in index/reports | no run |
| redaction | before serialization; raw/log/report/draft scan | no scan result |
| handoff | four fixed drafts, review required, no verdict/signoff | no drafts/review |
| external observation | L4-observability backend/Observed remains owner seam | `UP-002/006/007` open |
| retention | referenced runs retained; no numeric duration authority | policy pending |

## 10. 回填草稿与 Step stop-review

Formal §10 应承载 observation/audit boundary、M0~M5 maturity、fixed paths、eligibility formula、9 checks、report completeness、acceptance handoff and cross-evidence audit。它必须明确：当前 177 EV 全部仍 `planned_not_generated`；没有 run/report/evidence；缺 evidence 使未来裁决 `not_evaluable`，不是当前“不通过”。

```text
step_status = completed_continuous_authorized
planned_evidence_identity = 177
mandatory_checks = 9/9
actual_run_artifact_report_evidence = none
acceptance_handoff_review = none
observability_positive_qualification = blocked_by_UP_002_006_007
current_process_state = not_entered
next_step = Step 11
formal_06_write_allowed = false_until_step_15
```
