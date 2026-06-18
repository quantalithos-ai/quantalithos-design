# L1-identity implementation execution ledger

> 创建日期: 2026-06-15
> 规范来源: `standards/document/代码实施台账与门禁规范.md`
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 实现仓: `/home/aris/Projects/quantalithos-identity`

---

## Current Implementation State

| field | value |
|---|---|
| project | L1-identity |
| design_repo | `/home/aris/Projects/quantalithos-design` |
| implementation_repo | `/home/aris/Projects/quantalithos-identity` |
| current_design_baseline | `current-design-with-commit-08-b-active-ledger` |
| current_boundary | `commit-08-b` |
| gate_status | ready_for_design_gate |
| gate_reason | implementation agent reported `commit-08-a` complete with entry wiring commit `95ee4c6`, config redline coverage commit `db3b895` and run evidence commit `2f01025`; this handoff closes the entry wiring and runtime config boundary and advances the project ledger to `commit-08-b`; the gate scripts and artifact/report writer boundary is ready for Design Gate; future `commit-08-c` ledger remains not current |
| next_allowed_action | read_current_boundary_ledger |
| current_recovery_point | `commit-08-b` opening boundary / PH-08 gate, report and check scripts plus run-scoped artifact/report writer; excludes release smoke, final evidence index, acceptance handoff and final veto checklist |
| last_updated_by | design agent |
| last_updated_at | 2026-06-19 00:08:22 +0800 |

---

## Boundary Ledger

| boundary | design_baseline | status | last_gate | next_allowed_action | notes |
|---|---|---|---|---|---|
| `commit-04-b` | `d9f9e71` | pass | worktree_gate | implement | Required reads plus Design/Scope/Worktree gates passed; proceed with `commit-04-b` allowed scope only. |
| `commit-04-c` | `2f0bfed` | pending | design_gate | read_docs | Trace handoff command and command side-effect/replay audit boundary; read `implementation-boundaries/commit-04-c.md` before implementation. |
| `commit-05-a` | `c48b462` | implemented | handoff_gate | advance_to_commit_05_b | Implementation repo reports `commit-05-a` completed at `bc6267a`; next boundary is `commit-05-b`. |
| `commit-05-b` | `f91e72c` | implemented | handoff_gate | advance_to_commit_05_c | Implementation repo reports `commit-05-b` completed at `073e336` and `3e11289`; operations reads are excluded from 05-b evidence. |
| `commit-05-c` | `c101004` | implemented | handoff_gate | advance_to_commit_06_a | Implementation repo reports `commit-05-c` code completed at `b287e85` and run-scoped evidence committed at `82cae3b`; `GATE-05` service-flow-fast operations read evidence passed for run `20260616T230743+0800`. |
| `commit-06-a` | `0f4d7a4` | implemented | handoff_gate | advance_to_commit_06_b | Implementation repo reports `commit-06-a` code completed at `b7fa598` and run-scoped evidence committed at `67335fc`; `GATE-06` entry-worker-job and `GATE-03` infra-runtime-fake evidence passed for run `20260617T015231+0800`. |
| `commit-06-b` | `4a18d7a` | implemented | handoff_gate | advance_to_commit_06_c | Implementation repo reports `commit-06-b` supporting commits `12aa1ae`, `df6b21e`, code commit `2ae3bad` and run-scoped evidence commit `dde1dfc`; `GATE-06`, `GATE-03` subset and `GATE-10` evidence passed for run `20260617T032600+0800`. |
| `commit-06-c` | `current-design-with-commit-06-c-ledger` | implemented | handoff_gate | advance_to_commit_07_a | Implementation agent reports `commit-06-c` complete; exact code/evidence commit hash was not supplied in the blocker handoff, so this ledger does not fabricate one. |
| `commit-07-a` | `current-design-with-commit-07-a-ledger` | implemented | handoff_gate | advance_to_commit_07_b | Implementation agent reports `commit-07-a` complete; exact code/evidence commit hash was not supplied in the handoff, so this ledger does not fabricate one. |
| `commit-07-b` | `current-design-with-commit-07-b-reference-refresh-selection-key-closure` | implemented | handoff_gate | advance_to_commit_07_c | Implementation repo reports `commit-07-b` code completed at `9c0a5ca` and run-scoped evidence committed at `0475d1a`; maintenance job family handoff is closed. |
| `commit-07-c` | `current-design-with-commit-07-c-active-ledger` | implemented | handoff_gate | advance_to_commit_08_a | Implementation repo reports `commit-07-c` code completed at `9bd5dc0` and run-scoped evidence committed at `75ca2ee`; propagation job family handoff is closed. |
| `commit-08-a` | `current-design-with-commit-08-a-active-ledger` | implemented | handoff_gate | advance_to_commit_08_b | Implementation repo reports `commit-08-a` entry wiring completed at `95ee4c6`, config redline coverage at `db3b895` and run-scoped evidence at `2f01025`; entry/config handoff is closed. |
| `commit-08-b` | `current-design-with-commit-08-b-active-ledger` | ready | design_gate | read_docs | Gate scripts and artifact/report writer; project ledger now points here; read `implementation-boundaries/commit-08-b.md` before implementation. |
| `commit-08-c` | `current-design-with-precreated-commit-08-c-ledger` | planned | design_gate | wait_until_current | Release evidence and acceptance handoff; boundary ledger is precreated and must become current only after `commit-08-b` handoff. |

---

## Open Blockers

| blocker_id | boundary | source | status | design_fix_baseline | next_action |
|---|---|---|---|---|---|
| BLK-ID-04B-LEDGER-001 | `commit-04-b` | implementation | resolved | `d9f9e71` | Implementation ledgers exist and pre-implementation gates are now advanced; continue `commit-04-b` from `implement`. |
| BLK-ID-04C-LEDGER-001 | `commit-04-c` | implementation | resolved | `2f0bfed` | Boundary ledger now exists; implementation agent must continue from `read_docs` and advance gates before code changes. |
| BLK-ID-05A-LEDGER-001 | `commit-05-a` | implementation | resolved | `ce18064` | Boundary ledger now exists; implementation agent must continue from `read_docs` and advance gates before code changes. |
| BLK-ID-05A-READ-SUBJECT-001 | `commit-05-a` | implementation | resolved | `pending-current-design-with-read-subject-access-summary` | Step 6/7/8/9 now define `IdentityVisibilityAccessSummary.read_subject_ref` as the only service-visible source for `IdentityVisibilityDecision.read_subject_ref`; implementation agent should restart design gate. |
| BLK-ID-05B-LEDGER-001 | `commit-05-b` | implementation | resolved | `c48b462` | Project ledger advanced and `implementation-boundaries/commit-05-b.md` added; implementation agent must continue from `read_docs` and advance gates before code changes. |
| BLK-ID-05B-DEGRADED-MARKER-001 | `commit-05-b` | implementation | resolved | `pending-current-design-with-query-material-degradation-summary` | Query-internal loaded material missing/mismatch/unsafe/partial item degraded branches now use Step 6 `IdentityQueryMaterialDegradationSummary` produced by Step 7 `IdentityQueryMaterialDegradationMapper`; implementation agent must restart design gate and copy markers rather than synthesize them. |
| BLK-ID-05B-MISSING-FRESHNESS-001 | `commit-05-b` | implementation | resolved | `pending-current-design-with-member-summary-missing-freshness-mapper` | `ReadMemberSummaryFlow` loaded stale/degraded view without `projection_freshness_ref` must call `IdentityQueryMaterialDegradationMapper.member_summary_view_missing_freshness(...)` and return `Degraded`; implementation agent must not read projection state or synthesize stale/degraded markers. |
| BLK-ID-05C-LEDGER-001 | `commit-05-c` | implementation | resolved | `current-design-with-commit-05-c-ledger` | Boundary ledger now exists and project ledger is advanced to `commit-05-c`; implementation agent must continue from `read_current_boundary_ledger` and advance gates before code changes. |
| BLK-ID-05C-DEGRADED-MAPPER-001 | `commit-05-c` | implementation | resolved | `current-design-with-operations-degradation-mapper-experience-recorded` | Step 7 now defines dedicated operations read degradation mapper methods, Step 9 routes projection/reference/report/outbox/handoff degraded branches through them, Step 12 forbids service-side marker/kind synthesis, and the reusable lesson is recorded in standards plus `MEM-ID-010`. |
| BLK-ID-05C-OUTBOX-BYTRACE-EMPTY-001 | `commit-05-c` | implementation | resolved | `current-design-with-outbox-trace-page-access` | Step 7 now defines `resolve_outbox_trace_page_read(...)`; Step 8/9/10/12/16 require `ListPendingIdentityOutbox(ByTrace)` empty pages to copy that page access summary, not synthesize `visibility_result_ref`; reusable lesson is recorded in standards plus `MEM-ID-011`. |
| BLK-ID-06A-LEDGER-001 | `commit-06-a` | implementation | resolved | `current-design-with-commit-06-a-ledger` | Project ledger now advances to `commit-06-a`; `implementation-boundaries/commit-06-a.md` defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. Implementation agent must continue from `read_current_boundary_ledger`. |
| BLK-ID-06B-LEDGER-001 | `commit-06-b` | implementation | resolved | `current-design-with-commit-06-b-ledger` | Project ledger now advances to `commit-06-b`; `implementation-boundaries/commit-06-b.md` defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. Implementation agent must continue from `read_current_boundary_ledger`. |
| BLK-ID-06C-LEDGER-001 | `commit-06-c` | implementation | resolved | `current-design-with-commit-06-c-ledger` | Project ledger now advances to `commit-06-c`; `implementation-boundaries/commit-06-c.md` defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. Implementation agent must continue from `read_current_boundary_ledger`. |
| BLK-ID-07A-LEDGER-001 | `commit-07-a` | implementation | resolved | `current-design-with-commit-07-a-ledger` | Project ledger now advances to `commit-07-a`; `implementation-boundaries/commit-07-a.md` defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. Implementation agent must continue from `read_current_boundary_ledger`. |
| BLK-ID-07B-LEDGER-001 | `commit-07-b` | implementation | resolved | `current-design-with-commit-07-b-ledger` | Project ledger now advances to `commit-07-b`; `implementation-boundaries/commit-07-b.md` defines required reads, allowed scope, required checks, Commit Gate and Handoff Gate. Implementation agent must continue from `read_current_boundary_ledger`. |
| BLK-ID-07B-MAINTENANCE-JOB-PORTS-001 | `commit-07-b` | implementation | resolved | `current-design-with-commit-07-b-maintenance-job-port-closure` | Step 6/7/9/11/12/13 now define `MemberSummaryProjectionRebuildPlan`, `ExternalReferenceResolutionOutcome`, `IdentityMaintenanceInspectionContext`, matching ports and issue mapper methods; implementation agent must restart Design Gate and copy these outputs rather than derive from opaque refs/state/summary/fake maps. |
| BLK-ID-07B-MEMBER-SUMMARY-VIEW-INPUT-001 | `commit-07-b` | implementation | resolved | `current-design-with-commit-07-b-member-summary-view-input-closure` | Step 6/7/9/11/12/13 now define `MemberSummaryProjectionRebuildViewInput`; `get_member_summary_rebuild_plan(...)` returns complete non-empty view inputs, and implementation must construct `MemberSummaryView` only from those inputs rather than deriving fields from projection/scope/view/config/error/fake maps. |
| BLK-ID-07B-REFERENCE-REFRESH-SELECTION-KEY-001 | `commit-07-b` | implementation | resolved | `current-design-with-commit-07-b-reference-refresh-selection-key-closure` | Step 7/8/9/11/12/13 now require reference refresh owner/kind/stale/scope selection ports to return `ExternalReferenceRef` bundle keys directly; implementation agent must load each selected bundle through `get_reference_state_with_version(...)` and must not reverse lookup bundle keys from `ReferenceResolutionStateRef`, strings, sibling stores or fake private maps. |
| BLK-ID-07C-LEDGER-001 | `commit-07-c` | implementation | resolved | `current-design-with-commit-07-c-active-ledger` | `implementation-boundaries/commit-07-c.md` now exists and the project ledger advances to `commit-07-c`; implementation agent must continue from `read_current_boundary_ledger` and advance gates before code changes. |
| BLK-ID-08A-LEDGER-001 | `commit-08-a` | implementation | resolved | `current-design-with-commit-08-a-active-ledger` | `implementation-boundaries/commit-08-a.md` now exists and the project ledger advances to `commit-08-a`; implementation agent must continue from `read_current_boundary_ledger` and advance gates before code changes. |
| BLK-ID-08B-LEDGER-001 | `commit-08-b` | implementation | resolved | `current-design-with-commit-08-b-active-ledger` | `implementation-boundaries/commit-08-b.md` now exists and the project ledger advances to `commit-08-b`; implementation agent must continue from `read_current_boundary_ledger` and advance gates before code changes. |
| BLK-ID-08C-LEDGER-001 | `commit-08-c` | implementation | resolved | `current-design-with-precreated-commit-08-c-ledger` | `implementation-boundaries/commit-08-c.md` now exists as a planned future boundary. It must not be implemented until the project ledger advances from `commit-08-b` after handoff. |

---

## Recovery Protocol

Any implementation agent resuming `L1-identity` must read files in this order:

1. `projects/L1-identity/design-calibration/implementation_execution_ledger.md`
2. `projects/L1-identity/design-calibration/implementation-boundaries/commit-08-b.md`
3. `projects/L1-identity/07-实施计划.md`
4. The `required_reads` listed by the current boundary ledger.
5. Optional implementation scratch ledger: `/home/aris/Projects/quantalithos-identity/.codex/implementation_ledger.md`

If any required design source is missing or contradicts the current boundary, set `gate_status = blocked`, set `next_allowed_action = wait_design`, and stop implementation.

---

## Retrospective Boundary Note

| range | status | decision |
|---|---|---|
| `commit-01-a`~`commit-04-a` | historical before implementation ledger adoption | Do not fabricate per-boundary execution ledgers or implementation hashes retroactively. If a future audit requires these files, create explicit retrospective ledgers marked `historical`, not current execution gates. |
| `commit-07-c` | implemented handoff closed | Implementation handoff recorded code commit `9bd5dc0` and evidence commit `75ca2ee`; this boundary is no longer current. |
| `commit-08-a` | implemented handoff closed | Implementation handoff recorded entry wiring commit `95ee4c6`, config redline coverage commit `db3b895` and evidence commit `2f01025`; this boundary is no longer current. |
| `commit-08-b` | active current boundary | This boundary became actionable after the `commit-08-a` implementation handoff; implementation must start by reading `implementation-boundaries/commit-08-b.md`. |
| `commit-08-c` | planned future boundary | Boundary ledger file is precreated to remove the same missing-file blocker class. It becomes actionable only when `current_boundary` is advanced by the project ledger after the `commit-08-b` implementation handoff. |
