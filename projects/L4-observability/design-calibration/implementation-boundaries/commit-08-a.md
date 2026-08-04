# commit-08-a implementation ledger

| field | value |
|---|---|
| project | `L4-observability` |
| boundary_id | `commit-08-a` |
| phase | `PH-08` |
| design_baseline | `planned-after-commit-07-b` |
| implementation_repo | `/home/aris/Projects/quantalithos-observability` |
| status | `planned` |
| gate_status | `pending` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `run-scoped suite/artifact/report generation` |
| activation_rule | `project_execution_ledger.current_boundary == commit-08-a` |
| design_authority | formal `07-实施计划.md` + current upstream `00~06`；calibration 只用于解释和追溯 |

> Planned design-handoff skeleton only. planned skeleton；只有项目级台账推进后才可进入 activation gate。 本文件不包含实现、测试、artifact、report、evidence、review、verdict、risk acceptance、signoff 或 commit 事实。

## Boundary Objective

连接 99 TC、82 DS、9 primary suite、6 lane、3 profile 的 exact manifest，生成同一 run 下的 raw artifact 和 report candidate。

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current boundary | pending | 必须先推进到 commit-08-a。 |
| predecessor handoff | pending | 前一 boundary 必须有真实 Commit/Handoff Gate。 |
| activation permission | pending | 预创建文件不授权实现。 |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L4-observability/05-测试方案.md` | §3~§10、§13~§14：99 TC/82 DS/9 suite/lane/artifact/report | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/06-验收标准.md` | §3~§4、§10：run/evidence/VF input | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` | §5~§11、EVG and provenance | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` | profile/lane/harness readiness | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` | SP-OBS-09-010、CI/runner reality risk | pending | 实现前读取；冲突时暂停并回写真相源。 |

## Planned Task and Batch Contract

| task | order | action | output | status |
|---|---|---|---|---|
| IMPL-08A-01 | 1 | 建立 TC/DS/suite/lane/profile manifest join，检查 orphan/duplicate | test manifest | planned |
| IMPL-08A-02 | 2 | 建立 gate runner 和 raw artifact materialization，失败材料保留 | run_ci_gate shell/raw writer | planned |
| IMPL-08A-03 | 3 | 建立同 run report generator 和 candidate evidence-index linkage | generate_reports shell | planned |
| IMPL-08A-04 | 4 | 建立 missing/corrupt/latest/cross-run provenance negative tests | report audit | planned |

BATCH-08A-01 manifest join 100~300 lines; BATCH-08A-02 gate/raw high-risk; BATCH-08A-03 report/candidate high-risk; BATCH-08A-04 audit <=250 lines

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | test manifest/support、`scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、raw/run report schema and tests | planned |
| allowed_rule | same-run candidate linkage and failure-preserving report folds | planned |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | 真实 acceptance verdict、static evidence alias、cross-run aggregation、修改被测 source/artifact 以通过 gate | active |
| forbidden_rule | 把设计表或空模板当 raw result | active |
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
| activation gate | 项目台账 current boundary 必须推进到 `commit-08-a` | pending | 设计期未执行；不得推断 pass。 |
| manifest join | 99 TC/82 DS/9 suite/6 lane/3 profile identity and owner join | pending | 设计期未执行；不得推断 pass。 |
| runner availability | required lane and real runner availability; missing lane remains blocked/not_run | pending | 设计期未执行；不得推断 pass。 |
| raw artifact | real invocation produces `artifacts/test/<run_id>` with failed material preserved | pending | 设计期未执行；不得推断 pass。 |
| same-run report | `reports/runs/<run_id>` derives only from same-run raw | pending | 设计期未执行；不得推断 pass。 |
| provenance audit | missing/corrupt/latest/static-pass/cross-run inputs fail closed | pending | 设计期未执行；不得推断 pass。 |
| workspace/scope | test/gate/report-only scope and whitespace review | pending | 设计期未执行；不得推断 pass。 |

## Worktree Gate

| item | required_observation | status |
|---|---|---|
| target repository | path, authorized worktree, branch and baseline recorded before edit | pending |
| initial status | exact target-repository status captured before edit | pending |
| user-owned changes | unrelated files remain untouched and unstaged | pending |
| scope ownership | touched paths map only to `commit-08-a` | pending |
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
| activation_gate | pending | 等待项目级台账推进到 commit-08-a；预创建不授权实现。 | wait_design |
| design_gate | pending | 待 current boundary 激活并完成 required reads。 | wait_design |
| scope_gate | pending | 尚无实现 diff；激活后按 Allowed Scope 核验。 | fix_gate_failure |
| worktree_gate | pending | 目标仓 dirty baseline 尚未记录。 | fix_gate_failure |
| build_gate | pending | 本 boundary 命令尚未运行。 | fix_gate_failure |
| test_gate | pending | 本 boundary 测试尚未运行。 | fix_gate_failure |
| evidence_gate | pending | 本 boundary scope 明确包含 raw artifact、same-run run report 和 candidate linkage；真实 runner 尚未建立，当前没有可记录的执行证据。 | fix_gate_failure |
| commit_gate | pending | 无 staged files、commit message 或 commit hash 事实。 | fix_gate_failure |
| handoff_gate | pending | 无真实 implementation handoff；完成后才可推进下一 boundary。 | handoff |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | planned message from Step 11 for commit-08-a |
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
| next_boundary | next planned boundary after commit-08-a | pending |
| user_owned_changes_untouched | target worktree file list recorded | pending |

## Inherited Affected Binding

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01` remains blocked/controlled; no positive I05 evidence may enter manifest as completed。

GATE-OBS-10、GATE-OBS-11；ISO/INT/RT cannot substitute one another。

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

Remain `planned / wait_until_current`. Do not run or record boundary execution until the project ledger advances to `commit-08-a`; then reread this file and the required sources.
