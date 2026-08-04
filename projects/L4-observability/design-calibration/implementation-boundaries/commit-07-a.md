# commit-07-a implementation ledger

| field | value |
|---|---|
| project | `L4-observability` |
| boundary_id | `commit-07-a` |
| phase | `PH-07` |
| design_baseline | `planned-after-commit-06-b` |
| implementation_repo | `/home/aris/Projects/quantalithos-observability` |
| status | `planned` |
| gate_status | `pending` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `runtime/config/entry activation` |
| activation_rule | `project_execution_ledger.current_boundary == commit-07-a` |
| design_authority | formal `07-实施计划.md` + current upstream `00~06`；calibration 只用于解释和追溯 |

> Planned design-handoff skeleton only. planned skeleton；只有项目级台账推进后才可进入 activation gate。 本文件不包含实现、测试、artifact、report、evidence、review、verdict、risk acceptance、signoff 或 commit 事实。

## Boundary Objective

完成 13-stage complete-or-error runtime assembly、3 profile legality、fake/durable/controlled/disabled availability 和 API/worker/jobs least-authority assignment。

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current boundary | pending | 必须先推进到 commit-07-a。 |
| predecessor handoff | pending | 前一 boundary 必须有真实 Commit/Handoff Gate。 |
| activation permission | pending | 预创建文件不授权实现。 |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L4-observability/03-详细设计.md` | §4、§5.3~§5.7、§13~§14：runtime/adapter/entry | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/04-配置设计.md` | §6~§11：profiles/source/activation/failure | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` | 13-stage、profile/lane/dependency readiness | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | §5.13、§7 commit-07-a 经验复核 | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | only-core compile dependency and runtime seam rule | pending | 实现前读取；冲突时暂停并回写真相源。 |

## Planned Task and Batch Contract

| task | order | action | output | status |
|---|---|---|---|---|
| IMPL-07A-01 | 1 | 实现 typed config/runtime 13-stage assembly，任何 unknown/partial/fallback fail closed | runtime builder | planned |
| IMPL-07A-02 | 2 | 实现 capability/availability descriptors 与 fake/durable/controlled/disabled parity | adapter seams | planned |
| IMPL-07A-03 | 3 | 实现 API/worker/jobs one-slice least-authority assignment、registrars 和 activation rollback | entry runtime | planned |
| IMPL-07A-04 | 4 | 实现 profile/mode/dependency/activation negative tests | runtime test slice | planned |

BATCH-07A-01 config/runtime stages split; BATCH-07A-02 descriptors/adapters <=300 lines; BATCH-07A-03 entry assignment high-risk; BATCH-07A-04 static/profile <=200 lines

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | infra runtime_builder/config/adapters、API/worker/jobs runtime assignment and registrar wiring | planned |
| allowed_rule | 3 profile、6 lane legality、availability and complete-or-error activation | planned |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | generic runtime aggregate、downcast/Clone locator、cross-profile handle reuse、new protocol/state、non-core Cargo path、implicit fallback | active |
| forbidden_rule | partial activation、health-as-operation-success | active |
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
| activation gate | 项目台账 current boundary 必须推进到 `commit-07-a` | pending | 设计期未执行；不得推断 pass。 |
| config redline | strict parse, source/priority, profile/mode legality, no silent fallback | pending | 设计期未执行；不得推断 pass。 |
| 13-stage assembly | complete-or-error and zero-partial activation | pending | 设计期未执行；不得推断 pass。 |
| least authority | API/worker/jobs receive only matching capability slice | pending | 设计期未执行；不得推断 pass。 |
| availability parity | fake/durable/controlled/disabled behavior and operation outcome separated | pending | 设计期未执行；不得推断 pass。 |
| dependency boundary | only core compile edge and no reverse dependency | pending | 设计期未执行；不得推断 pass。 |
| entry smoke | construction/activation failure and revoke/join paths | pending | 设计期未执行；不得推断 pass。 |

## Worktree Gate

| item | required_observation | status |
|---|---|---|
| target repository | path, authorized worktree, branch and baseline recorded before edit | pending |
| initial status | exact target-repository status captured before edit | pending |
| user-owned changes | unrelated files remain untouched and unstaged | pending |
| scope ownership | touched paths map only to `commit-07-a` | pending |
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
| activation_gate | pending | 等待项目级台账推进到 commit-07-a；预创建不授权实现。 | wait_design |
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
| planned_commit_message | planned message from Step 11 for commit-07-a |
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
| next_boundary | next planned boundary after commit-07-a | pending |
| user_owned_changes_untouched | target worktree file list recorded | pending |

## Inherited Affected Binding

`S08-E-I05-PRODUCER-EVENT-BINDING-01` 与 external phase controlled surface 继续受限；不把 unavailable adapter 写成 positive。

GATE-OBS-07、GATE-OBS-05；partial activation/fallback 是 hard blocker。

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

Remain `planned / wait_until_current`. Do not run or record boundary execution until the project ledger advances to `commit-07-a`; then reread this file and the required sources.
