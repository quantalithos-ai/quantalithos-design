# commit-02-b implementation ledger

| field | value |
|---|---|
| project | `L4-observability` |
| boundary_id | `commit-02-b` |
| phase | `PH-02` |
| design_baseline | `planned-after-commit-02-a` |
| implementation_repo | `/home/aris/Projects/quantalithos-observability` |
| status | `planned` |
| gate_status | `pending` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `domain state/policy/history closure` |
| activation_rule | `project_execution_ledger.current_boundary == commit-02-b` |
| design_authority | formal `07-实施计划.md` + current upstream `00~06`；calibration 只用于解释和追溯 |

> Planned design-handoff skeleton only. planned skeleton；只有项目级台账推进后才可进入 activation gate。 本文件不包含实现、测试、artifact、report、evidence、review、verdict、risk acceptance、signoff 或 commit 事实。

## Boundary Objective

闭合 27 个正式 state owner 加 1 个 technical coordination state，以及 observation/audit/evidence/handoff/retention/read/maintenance policy/history carrier。

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current boundary | pending | 必须先推进到 commit-02-b。 |
| predecessor handoff | pending | 前一 boundary 必须有真实 Commit/Handoff Gate。 |
| activation permission | pending | 预创建文件不授权实现。 |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L4-observability/03-详细设计.md` | §5~§6、§9~§12、§14~§15：objects/state/persistence/error | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | §5.4、§7 commit-02-b 经验复核 | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | GATE-OBS-02、state/factory/policy mapping | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_12_completion_criteria.md` | state/phase completion criteria | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | state, persistence and technical-vs-business truth boundaries | pending | 实现前读取；冲突时暂停并回写真相源。 |

## Planned Task and Batch Contract

| task | order | action | output | status |
|---|---|---|---|---|
| IMPL-02B-01 | 1 | 实现 receipt/safety/correlation/signal/audit/evidence domain objects 和 factory | observation-side records | planned |
| IMPL-02B-02 | 2 | 实现 handoff/retention/protection/gap/degraded/read/reference objects | guard/read records | planned |
| IMPL-02B-03 | 3 | 实现 maintenance/job/report/outbox/idempotency technical carriers | technical state carriers | planned |
| IMPL-02B-04 | 4 | 实现 legal/illegal/terminal/reserved transition、policy、error/history helpers | state/policy tests | planned |

BATCH-02B-01 observation/safety split; BATCH-02B-02 audit/guard/read split; BATCH-02B-03 technical carriers 100~300 lines; BATCH-02B-04 transition/error high-risk batch

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | `crates/domain/src/**` 与 domain unit tests | planned |
| allowed_rule | current 27+1 state、policy、history、guard/read、technical carrier 的唯一 owner | planned |
| allowed_rule | observation-side persistence fields and body-free invariants | planned |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | concrete infra、source truth adapter、API/worker/jobs route、cross-crate second state owner、未定义 alias | active |
| forbidden_rule | 把 technical coordination state 或 projection state 提升为业务 truth | active |
| forbidden_rule | 实现端自行新增 schema、DTO、state、ref、port、mapper、config fallback 或 evidence identity | active |
| forbidden_rule | 把 planned、blocked、not_run、not_evaluated 或 controlled 写成实现通过 | active |
| forbidden_rule | 提交真实 commit/hash/run_id/artifact/report/evidence/verdict/signoff 的设计期占位事实 | active |
| forbidden_rule | 使用 `latest`、跨 run 拼接、静态 passed、raw body/secret 或 source truth write | active |

## Design Closure Gate

| closure_item | required_conclusion_before_code | status |
|---|---|---|
| field closure | required fields have one formal owner/source and persisted/optional semantics | pending |
| DTO construction | input -> metadata/context -> factory/service/result is lossless | pending |
| state/policy | variant, transition, terminal/reserved and error mapping match formal sources | pending |
| ref identity | kind, mint/rehydrate, lookup key, scope and replacement identity are explicit | pending |
| validation truth | existence/scope/version/visibility/digest/binding checks use exact source | pending |
| metadata/UoW/idempotency | actor/context/digest/key/result and accepted write order are explicit | pending |
| projection/rebuild | committed source, bounded replay and no-write boundary are explicit | pending |
| artifact materialization | applicable raw/report path, run identity and failure semantics are explicit | pending |
| phase boundary | no later-phase object/result/evidence is consumed; deferred surface named | pending |

## Required Checks

| check | command_or_evidence | status | notes |
|---|---|---|---|
| activation gate | 项目台账 current boundary 必须推进到 `commit-02-b` | pending | 设计期未执行；不得推断 pass。 |
| state matrix | 27+1 state identity、initial/legal/terminal/reserved/condition semantics | pending | 设计期未执行；不得推断 pass。 |
| factory/persistence | required fields、error mapping、persisted coverage | pending | 设计期未执行；不得推断 pass。 |
| domain tests | state/policy/history/factory unit tests | pending | 设计期未执行；不得推断 pass。 |
| body-free/no-truth | domain records preserve no raw body and no business truth ownership | pending | 设计期未执行；不得推断 pass。 |
| workspace check | `cargo check --workspace` | pending | 设计期未执行；不得推断 pass。 |
| scope/whitespace | domain-only diff and whitespace checks | pending | 设计期未执行；不得推断 pass。 |

## Worktree Gate

| item | required_observation | status |
|---|---|---|
| target repository | path, authorized worktree, branch and baseline recorded before edit | pending |
| initial status | exact target-repository status captured before edit | pending |
| user-owned changes | unrelated files remain untouched and unstaged | pending |
| scope ownership | touched paths map only to `commit-02-b` | pending |
| destructive actions | no reset/checkout/cleanup of user files | pending |

## Build Gate

| check | planned_command_or_oracle | status |
|---|---|---|
| format | target-repository format command appropriate to current workspace | pending |
| compile | workspace or affected-package check defined by current 07 | pending |
| static boundary | applicable owner/dependency/redaction/no-write/provenance check | pending |
| whitespace | git diff --check before staging | pending |

## Test Gate

| check | contract | status |
|---|---|---|
| targeted tests | tests mapped from Step 07 and this boundary | pending |
| negative branches | forbidden body, invalid state, unavailable/blocked and failure branches where applicable | pending |
| replay/idempotency/no-write | required when this boundary touches the corresponding seam | pending |
| failure retention | failed/blocked/not-run material remains identifiable | pending |

## Evidence Gate

| item | planned_canonical_contract | current_state |
|---|---|---|
| raw artifact | real run only: `artifacts/test/<run_id>` | not_created |
| run report | same-run raw only: `reports/runs/<run_id>` | not_created |
| evidence index | same-run generated path only; no static alias | not_created |
| acceptance/review input | only where applicable; no verdict/signoff | not_created |

No planned path is evidence until a real invocation creates it with same-run provenance. `latest`, cross-run joins and static passed are forbidden.

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | 等待项目级台账推进到 commit-02-b；预创建不授权实现。 | wait_design |
| design_gate | pending | 待 current boundary 激活并完成 required reads。 | wait_design |
| scope_gate | pending | 尚无实现 diff；激活后按 Allowed Scope 核验。 | fix_gate_failure |
| worktree_gate | pending | 目标仓 dirty baseline 尚未记录。 | fix_gate_failure |
| build_gate | pending | 本 boundary 命令尚未运行。 | fix_gate_failure |
| test_gate | pending | 本 boundary 测试尚未运行。 | fix_gate_failure |
| evidence_gate | not_applicable | 仅在本 boundary scope 需要时从真实 invocation 生成；当前未生成。 | fix_gate_failure |
| commit_gate | pending | 无 staged files、commit message 或 commit hash 事实。 | fix_gate_failure |
| handoff_gate | pending | 无真实 implementation handoff；完成后才可推进下一 boundary。 | handoff |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | planned message from Step 11 for commit-02-b |
| staged_files_checked | pending |
| commit_message_checked | pending |
| committed_hash | none |
| committed_message | none |
| post_commit_status | not_evaluated |

## Handoff Gate

| gate | evidence | status |
|---|---|---|
| committed_hash | real hash recorded only after actual implementation commit | pending |
| gates_run | actual command list and outputs recorded | pending |
| remaining_blockers | exact blocker/affected state recorded | pending |
| next_boundary | next planned boundary after commit-02-b | pending |
| user_owned_changes_untouched | target worktree file list recorded | pending |

## Inherited Affected Binding

承接 `S08-RECOVERY-CLASS-OWNER-01` 的 recovery vocabulary前置约束；缺唯一 owner 时保持 blocked，不新增 retry enum。

GATE-OBS-02；后续 application/infra 不得复制 state owner。

## Pause and Rollback

- Pause immediately on any schema/DTO/state/ref/source/config/evidence/phase mismatch, forbidden material finding, no-write violation, non-core dependency, wrong-run evidence or unclosed required lane.
- Preserve failed/blocked/not-run material; do not overwrite it with a later run or static summary.
- Rollback, if authorized in the implementation repository, must follow Step 10 and must not erase user-owned changes or blocker history.
- A rollback does not close an inherited affected item or create a new positive result.

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| none | n/a | n/a | 当前 boundary 未激活；尚无 boundary-specific execution blocker | 无；等待 current boundary 激活 | wait_until_current |

## Recovery Rule

Remain `planned / wait_until_current`. Do not run or record boundary execution until the project ledger advances to `commit-02-b`; then reread this file and the required sources.
