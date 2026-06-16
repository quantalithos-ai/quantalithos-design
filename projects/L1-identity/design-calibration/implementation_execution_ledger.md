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
| current_design_baseline | `current-design-with-operations-degradation-mapper` |
| current_boundary | `commit-05-c` |
| gate_status | ready_for_design_gate |
| gate_reason | `commit-05-b` completed in implementation repo at `073e336` and `3e11289`; `commit-05-c` operations read query boundary is ready; operations degraded marker source is closed by Step 7 `IdentityQueryMaterialDegradationMapper` methods for projection/reference/report/outbox/handoff |
| next_allowed_action | read_current_boundary_ledger |
| current_recovery_point | `commit-05-c` opening boundary / PH-05 projection, reference, report, outbox and handoff operations read query family |
| last_updated_by | design agent |
| last_updated_at | 2026-06-16 20:56:27 +0800 |

---

## Boundary Ledger

| boundary | design_baseline | status | last_gate | next_allowed_action | notes |
|---|---|---|---|---|---|
| `commit-04-b` | `d9f9e71` | pass | worktree_gate | implement | Required reads plus Design/Scope/Worktree gates passed; proceed with `commit-04-b` allowed scope only. |
| `commit-04-c` | `2f0bfed` | pending | design_gate | read_docs | Trace handoff command and command side-effect/replay audit boundary; read `implementation-boundaries/commit-04-c.md` before implementation. |
| `commit-05-a` | `c48b462` | implemented | handoff_gate | advance_to_commit_05_b | Implementation repo reports `commit-05-a` completed at `bc6267a`; next boundary is `commit-05-b`. |
| `commit-05-b` | `f91e72c` | implemented | handoff_gate | advance_to_commit_05_c | Implementation repo reports `commit-05-b` completed at `073e336` and `3e11289`; operations reads are excluded from 05-b evidence. |
| `commit-05-c` | `current-design-with-operations-degradation-mapper` | ready | design_gate | read_docs | Projection/reference/report/outbox/handoff operations read query family; read `implementation-boundaries/commit-05-c.md` before implementation. |

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
| BLK-ID-05C-DEGRADED-MAPPER-001 | `commit-05-c` | implementation | resolved | `current-design-with-operations-degradation-mapper` | Step 7 now defines dedicated operations read degradation mapper methods, Step 9 routes projection/reference/report/outbox/handoff degraded branches through them, and Step 12 forbids service-side marker/kind synthesis. |

---

## Recovery Protocol

Any implementation agent resuming `L1-identity` must read files in this order:

1. `projects/L1-identity/design-calibration/implementation_execution_ledger.md`
2. `projects/L1-identity/design-calibration/implementation-boundaries/commit-05-c.md`
3. `projects/L1-identity/07-实施计划.md`
4. The `required_reads` listed by the current boundary ledger.
5. Optional implementation scratch ledger: `/home/aris/Projects/quantalithos-identity/.codex/implementation_ledger.md`

If any required design source is missing or contradicts the current boundary, set `gate_status = blocked`, set `next_allowed_action = wait_design`, and stop implementation.
