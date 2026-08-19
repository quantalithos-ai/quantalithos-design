# commit-03-c — planned boundary skeleton

> phase: PH-03
> status: planned / wait_until_current
> fact boundary: planned inventory only; no implementation, run, artifact, report, evidence, commit, verdict, signoff or readiness exists.

## Header

| field | value |
|---|---|
| boundary | commit-03-c |
| phase | PH-03 |
| stable IMPL | IMPL-03-07~09 |
| stable BATCH | BATCH-03-07~09 |
| stable Gate | GATE-09 |
| baseline | not_bound |
| next_allowed_action | wait_until_current |
| committed_hash | none |
| run_id | none |

## Truth Banner

This is a planned handoff contract, not implementation authorization. Design-period conclusion is pass-designed at most; actual Gate status is pending. The implementation repository is absent.

## Boundary Intent

**closed planner and T1/T2/T3** is one reviewable functional increment. It must not invent fields, states, Ports, configuration defaults, evidence or owner truth.

## Activation Context

- project ledger must name this as the sole current boundary;
- predecessor Commit/Handoff must be real before activation;
- formal 00~07 baseline, target worktree, repo-local identity and toolchain must be bound;
- positive owner seams remain blocked unless their contract, product/profile and qualification are closed.

## Required Reads

- formal 03 owning fields/DTO/Port/flow/state/UoW;
- formal 04 config when applicable; formal 05 exact CUT/suite; formal 06 AC/VF/NFR/EG;
- Step 5 phase row; Step 6 exact boundary row; Step 7 exact Gate row; Step 10~12;
- standards/document/代码实施台账与门禁规范.md;
- standards/document/设计真相源闭环与可落码性标准.md;
- standards/document/子项目目录与代码文件组织规范.md;
- standards/coding/rust.md.

## Allowed Scope

- Batch A: closed next-operation planner and loop application service;
- exact formal/calibration rows named above;
- deterministic local/fail-closed fake or adapter seam only where formal sources allow;
- owning tests and checks for GATE-09.

## Forbidden Scope

- capability recursion/external calls;
- successor-phase objects, hidden recursive dispatch, private schema/default/fallback;
- provider secret/route/quota/cost, hidden reasoning, raw body, external delivery/readiness;
- user or other-agent changes.

## Batch Plan

| batch | stable identity | planned work |
|---|---|---|
| A | IMPL-03-07 / BATCH-03-07 | typed carriers, factories and domain invariant |
| B | IMPL-03-08 / BATCH-03-08 | application service, Port, UoW, local adapter/fake parity |
| C | IMPL-03-09 / BATCH-03-09 | entry/consumer/job plus negative/replay/Unknown/zero-write tests |

## Required Checks

SRC, DEN, DEP, FORBID, FAKE, TRUTH, REDACT, PAIR and NOSTATIC. Before PH-13 tooling exists, raw/report/evidence is exact not_applicable only where formal sources permit; planned paths are not evidence.

## Design Closure Gate

Exact fields/variants, constructors, callable/Port read-write set, errors, state/UoW/idempotency/replay, query zero-write, bounded jobs, Unknown fence, dependency type, phase boundary and Rustdoc/naming must be closed in formal sources. L2R-LANG-002 remains a hard blocker until formal 03 is corrected. Design-period result is pass-designed only; baseline remains not_bound.

## Experience Review

| review item | design-period posture |
|---|---|
| metadata/ref/idempotency/trace | pass-designed or explicit blocker |
| validation/source/freshness/body-free carrier | pass-designed or explicit blocker |
| state/factory/history mutation | pass-designed or explicit blocker |
| UoW/CAS/outbox/inbox/lease/cursor | pass-designed or reasoned not_applicable |
| projection/rebuild/artifact materialization | pass-designed or reasoned not_applicable |
| phase/owner/dependency/Rustdoc | pass-designed; blocker: L2R-LANG-002; loop boundary must remain single owner |

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

Future commit requires all nine sub-gates, one-boundary staged scope, English `type(scope): subject`, repo-local identity, real commands and complete Commit Record. Design phase: not_run.

## Commit Record

| field | value |
|---|---|
| boundary | commit-03-c |
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
| L2R-LANG-002; loop boundary must remain single owner | open/pending | affected activation or positive scope remains blocked | fake, path existence, ACK, ping, planned text |
| target repo / immutable baseline | inherited | implementation cannot activate | alternate repo, dirty HEAD as baseline |
| language/owner seams | open/pending | affected Rust/positive scope wait_design | private schema/default/fallback |

## Recovery Notes

Stop at this boundary on design drift, scope overlap, Unknown, selector/evidence failure, forbidden-material leak, dependency failure or incomplete handoff. Preserve user changes and failed facts; fix-forward current boundary or reopen the earliest affected formal source and regenerate consumers. Successor activation requires explicit project-ledger transition.
