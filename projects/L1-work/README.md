# L1-work

L1-work is the Work truth-center design package for Project, ProjectMember, Backlog, WorkItem, child WorkItem, dependency / blocker, Iteration, promote result, trace / audit / outbox, and operations evidence.

This directory is a design package, not the implementation repository. The target implementation repository is:

```text
/home/aris/Projects/quantalithos-work
```

## Current Design Baseline

Read the formal documents in order:

| Document | Purpose |
|---|---|
| `00-需求文档.md` | Requirements, business rules, AC / VF, and non-goals |
| `01-架构设计.md` | Responsibility boundary, dependency direction, data ownership, and architecture redlines |
| `02-概要设计.md` | Main components, key objects, interface skeletons, flows, states, and configuration impact |
| `03-详细设计.md` | Implementation truth source for fields, DTOs, state matrix, flows, transactions, errors, idempotency, config bindings, and test cuts |
| `04-配置设计.md` | `WorkRuntimeConfig`, profiles, config sources, validation, sensitive refs, failure modes, and downstream handoff |
| `05-测试方案.md` | `TC-WORK-*`, `EV-WORK-*`, suites, fixtures, gates, reports, and regression rules |
| `06-验收标准.md` | Acceptance baseline, AC / VF gates, veto items, evidence requirements, risk acceptance, and sign-off |
| `07-实施计划.md` | Target repo, phase order, commit boundaries, startup memory seeds, gates, rollback, review, and delivery discipline |

The `design-calibration/` directory contains SOP intermediate artifacts. It does not replace the formal documents. If a formal section is concise and implementation details are needed, read the corresponding calibration file listed in that section. If the formal document and calibration artifact conflict, pause and fix the design baseline instead of choosing one in implementation.

## Implementation Constraints

- The implementation language is Rust 2024.
- The implementation workspace must use `contracts`, `domain`, `application`, `infra`, `api`, `worker`, and `jobs`.
- The only allowed compile-time sibling dependency is:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

- Other sibling repositories must be accessed only through ports, adapters, events, snapshots, handoff, query, or fake seams.
- `application`, `domain`, and `contracts` must not read runtime configuration directly.
- Query paths must be no-write paths.
- Projection, report, and operations jobs must not repair Work truth unless the formal design explicitly says so.

## Implementation Startup

Before coding, the implementation agent must read `07-实施计划.md` §3 and create project memory only from the fixed `MEM-WORK-*` seed table. The memory content must not be freely summarized from conversations, historical commits, DTO tables, state matrices, or business rule prose.

Every phase or commit boundary must run the closure check required by `07-实施计划.md` §6 and §7. Missing field schema, DTO conflict, state conflict, config default ambiguity, phase boundary conflict, or evidence path conflict must pause implementation and return to this design package for a baseline fix.

## Evidence Paths

Formal test, report, and acceptance evidence paths are fixed:

```text
artifacts/test/<run_id>
reports/runs/<run_id>
reports/acceptance
```

Do not use `latest`, `artifacts/test/<project>/<run_id>`, or `reports/<project>` in formal evidence.
