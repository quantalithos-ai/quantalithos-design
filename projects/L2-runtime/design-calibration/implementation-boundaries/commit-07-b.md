# commit-07-b — planned boundary skeleton

> phase: PH-07 Governed Action
> status: planned / wait_until_current
> fact boundary: planned inventory only; no implementation, run, artifact, report, evidence, commit, verdict, signoff or readiness exists.

## Header

| field | value |
|---|---|
| boundary | commit-07-b |
| phase | PH-07 |
| stable IMPL | IMPL-07-04~06 |
| stable BATCH | BATCH-07-04~06 |
| stable Gate | GATE-20 |
| baseline | not_bound |
| next_allowed_action | wait_until_current |
| committed_hash | none |
| run_id | none |

## Truth Banner

This is a planned handoff contract, not implementation authorization. Design-period conclusion is pass-designed at most; actual Gate status is pending. The implementation repository is absent.

## Boundary Intent

**five-owner guard evaluation** is one reviewable functional increment. It must not invent fields, states, Ports, configuration defaults, evidence or owner truth.

## Activation Context

- project ledger must explicitly advance to this sole current boundary;
- direct predecessor Commit/Handoff must be real before activation;
- formal 00~07 baseline, target worktree, repo-local identity and toolchain must be bound;
- external positive seams remain blocked until owner contract, product/profile and qualification close.

## Required Reads

- formal 03 owning fields/DTO/Port/flow/state/UoW; formal 04 config when applicable;
- formal 05 exact CUT/suite and formal 06 AC/VF/NFR/EG;
- Step 5 phase row; Step 6 exact boundary row; Step 7 exact Gate row; Step 10~12;
- standards/document/代码实施台账与门禁规范.md;
- standards/document/设计真相源闭环与可落码性标准.md;
- standards/document/子项目目录与代码文件组织规范.md;
- standards/coding/rust.md.

## Allowed Scope

- Batch A: owner source/freshness/decision conjunction;
- exact formal/calibration rows named above;
- deterministic local/fail-closed adapter seam only where formal sources allow;
- owning tests/checks mapped to GATE-20.

## Forbidden Scope

- owner mutation/direct call/default allow;
- successor-phase objects, hidden recursion, private schema/default/fallback;
- provider secret/route/quota/cost, hidden reasoning, raw body, delivery/readiness;
- user or other-agent changes.

## Batch Plan

| batch | stable identity | planned work |
|---|---|---|
| A | IMPL-07-04 / BATCH-07-04 | typed carriers, factories and domain invariant |
| B | IMPL-07-05 / BATCH-07-05 | application service, Port, UoW and local seam |
| C | IMPL-07-06 / BATCH-07-06 | entry/consumer/job and negative/replay/Unknown tests |

## Required Checks

SRC, DEN, DEP, FORBID, FAKE, TRUTH, REDACT, PAIR and NOSTATIC. Before PH-13 tooling, raw/report/evidence is exact not_applicable only where formal sources permit; planned paths are not evidence.

## Design Closure Gate

Exact fields/variants, constructors, callable/Port read-write set, errors, state/UoW/idempotency/replay, query zero-write, bounded jobs, Unknown fence, dependency type, phase boundary and Rustdoc/naming must be closed in formal sources. L2R-LANG-002 remains applicable to Rust boundaries until resolved. Design-period result is pass-designed only; baseline remains not_bound.

## Experience Review

| review item | design-period posture |
|---|---|
| metadata/ref/idempotency/trace | pass-designed or explicit blocker |
| validation/source/freshness/body-free carrier | pass-designed or explicit blocker |
| state/factory/history mutation | pass-designed or explicit blocker |
| UoW/CAS/outbox/inbox/lease/cursor | pass-designed or reasoned not_applicable |
| projection/rebuild/artifact materialization | pass-designed or reasoned not_applicable |
| phase/owner/dependency/Rustdoc | pass-designed; blocker: L2R-UP-001~003/007; fail-closed |

## Gate Matrix

| sub-gate | future condition | design status | next action |
|---|---|---|---|
| Activation | sole current, predecessor handoff, baseline | pending | wait_until_current |
| Design | Required Reads and formal closure | pending | wait_until_current |
| Scope | allowed paths, one boundary, user isolation | pending | wait_until_current |
| Worktree | real branch/HEAD/status/ownership | pending | wait_until_current |
| Build | applicable nonempty tool output | pending | wait_until_current |
| Test | nonempty selectors and negative/replay coverage | pending | wait_until_current |
| Evidence | same-run pairing or exact N/A | pending | wait_until_current |
| Commit | message/staged diff/identity/record | pending | wait_until_current |
| Handoff | post-status/blocker/next boundary/ledger | pending | wait_until_current |

No sub-gate is actual pass. Failures preserve raw/journal and follow Step 10.

## Commit Gate

Future commit requires all nine sub-gates, one-boundary staged scope, English type(scope): subject, repo-local identity, real commands and complete Commit Record. Design phase: not_run.

## Commit Record

| field | value |
|---|---|
| boundary | commit-07-b |
| commit_hash | none |
| commit_message | planned only; not executed |
| author_identity | not_bound |
| committed_at | none |
| staged_paths | none |
| diff_stat | none |
| gate_result | not_run |

## Handoff Gate

Future handoff must record actual hash/message/post-status, baseline, user/agent changes, raw/report/evidence refs or exact N/A, blockers, next boundary and project-ledger update. Current handoff is not entered.

## Blockers

| blocker | status | effect | forbidden closure |
|---|---|---|---|
| L2R-UP-001~003/007; fail-closed | open/pending | affected activation or positive scope remains blocked | fake, path existence, ACK, ping, planned text |
| predecessor/baseline | inherited | this future boundary cannot activate | bypass predecessor or use dirty HEAD |
| language/owner seams | open/pending | affected Rust/positive scope wait_design | private schema/default/fallback |

## Recovery Notes

Stop at this boundary on design drift, scope overlap, Unknown, selector/evidence failure, forbidden-material leak, dependency failure or incomplete handoff. Preserve user changes and failed facts; fix-forward only after current activation or reopen the earliest affected formal source. Successor activation requires explicit project-ledger transition.
