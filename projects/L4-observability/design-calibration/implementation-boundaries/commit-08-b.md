# commit-08-b implementation ledger

| field | value |
|---|---|
| project | `L4-observability` |
| boundary_id | `commit-08-b` |
| phase | `PH-08` |
| design_baseline | `planned-after-commit-08-a` |
| implementation_repo | `/home/aris/Projects/quantalithos-observability` |
| status | `planned` |
| gate_status | `pending` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `acceptance/review handoff input` |
| activation_rule | `project_execution_ledger.current_boundary == commit-08-b` |
| design_authority | formal `07-实施计划.md` + current upstream `00~06`；calibration 只用于解释和追溯 |

> Planned design-handoff skeleton only. planned skeleton；只有项目级台账推进后才可进入 activation gate。 本文件不包含实现、测试、artifact、report、evidence、review、verdict、risk acceptance、signoff 或 commit 事实。

## Boundary Objective

生成 acceptance handoff、VETO checklist、risk-acceptance draft、open-issues 和 review input，保留 unresolved/blocked 状态，不产生最终裁决。

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current boundary | pending | 必须先推进到 commit-08-b。 |
| predecessor handoff | pending | 前一 boundary 必须有真实 Commit/Handoff Gate。 |
| activation permission | pending | 预创建文件不授权实现。 |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L4-observability/06-验收标准.md` | §4、§10~§14：entry/exit/VF/EVG/three-value decision/signoff | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/05-测试方案.md` | §13~§14：evidence/retest/regression input | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/07-实施计划.md` | §7、§9~§12：gate, risk, control, completion | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` | H13/OQ/release owner affected | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_11_commit_review_delivery.md` | handoff/review/role separation | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_12_completion_criteria.md` | four-layer completion model and unfinished handling | pending | 实现前读取；冲突时暂停并回写真相源。 |

## Planned Task and Batch Contract

| task | order | action | output | status |
|---|---|---|---|---|
| IMPL-08B-01 | 1 | 生成 handoff/veto/open-issues input，回链 baseline/scope/run/evidence | acceptance input shell | planned |
| IMPL-08B-02 | 2 | 生成 conditional risk/review input，缺 owner/signoff 时保持 open | risk/review shell | planned |
| IMPL-08B-03 | 3 | 执行 release/handoff provenance audit，检查 31 AC/24 NFR/10 VF/9 EVG source links | handoff audit | planned |

BATCH-08B-01 handoff/veto/open issue <=250 lines; BATCH-08B-02 risk/review <=200 lines; BATCH-08B-03 release/handoff audit <=250 lines

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | acceptance/review report input generators、handoff validation、VETO/risk/open-issues draft structures | planned |
| allowed_rule | same-run path references and unresolved-state propagation | planned |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | 填写真实 acceptor/reviewer、签署、verdict、EV alias、run id、static pass | active |
| forbidden_rule | 以 risk acceptance 关闭 VF、P0 blocker、source truth write、evidence provenance 或 design blocker | active |
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
| activation gate | 项目台账 current boundary 必须推进到 `commit-08-b` | pending | 设计期未执行；不得推断 pass。 |
| handoff completeness | baseline/scope/run/raw/report/blocked/residual/open issues links are explicit | pending | 设计期未执行；不得推断 pass。 |
| VETO checklist | VF-OBS-001~010 each has evidence input/status; no auto-pass | pending | 设计期未执行；不得推断 pass。 |
| risk acceptance | only allowed residual with owner/acceptor/action/trigger; otherwise open | pending | 设计期未执行；不得推断 pass。 |
| review separation | machine report, reviewer notes and acceptance decision remain separate | pending | 设计期未执行；不得推断 pass。 |
| provenance | same-run and design baseline references are consistent; no static verdict | pending | 设计期未执行；不得推断 pass。 |
| workspace/scope | acceptance/review input-only scope and whitespace review | pending | 设计期未执行；不得推断 pass。 |

## Worktree Gate

| item | required_observation | status |
|---|---|---|
| target repository | path, authorized worktree, branch and baseline recorded before edit | pending |
| initial status | exact target-repository status captured before edit | pending |
| user-owned changes | unrelated files remain untouched and unstaged | pending |
| scope ownership | touched paths map only to `commit-08-b` | pending |
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
| activation_gate | pending | 等待项目级台账推进到 commit-08-b；预创建不授权实现。 | wait_design |
| design_gate | pending | 待 current boundary 激活并完成 required reads。 | wait_design |
| scope_gate | pending | 尚无实现 diff；激活后按 Allowed Scope 核验。 | fix_gate_failure |
| worktree_gate | pending | 目标仓 dirty baseline 尚未记录。 | fix_gate_failure |
| build_gate | pending | 本 boundary 命令尚未运行。 | fix_gate_failure |
| test_gate | pending | 本 boundary 测试尚未运行。 | fix_gate_failure |
| evidence_gate | pending | 本 boundary scope 明确包含 acceptance/review handoff input、VF/open-issues/risk provenance；真实执行和人工审查尚未发生，当前没有可记录的证据。 | fix_gate_failure |
| commit_gate | pending | 无 staged files、commit message 或 commit hash 事实。 | fix_gate_failure |
| handoff_gate | pending | 无真实 implementation handoff；完成后才可推进下一 boundary。 | handoff |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | planned message from Step 11 for commit-08-b |
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
| next_boundary | none; handoff to acceptance authority only after real review | pending |
| user_owned_changes_untouched | target worktree file list recorded | pending |

## Inherited Affected Binding

`R06.6-F2-H13-UPSTREAM` and all unresolved affected remain open/controlled/conditional; handoff must show them, not close them。

GATE-OBS-12；最终三值验收结论和签署只属于 `06` 授权流程。

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

Remain `planned / wait_until_current`. Do not run or record boundary execution until the project ledger advances to `commit-08-b`; then reread this file and the required sources.
