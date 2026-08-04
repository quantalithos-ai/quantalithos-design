# commit-04-a implementation ledger

| field | value |
|---|---|
| project | `L4-observability` |
| boundary_id | `commit-04-a` |
| phase | `PH-04` |
| design_baseline | `planned-after-commit-03-b` |
| implementation_repo | `/home/aris/Projects/quantalithos-observability` |
| status | `planned` |
| gate_status | `pending` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `audit/evidence append and committed snapshot` |
| activation_rule | `project_execution_ledger.current_boundary == commit-04-a` |
| design_authority | formal `07-实施计划.md` + current upstream `00~06`；calibration 只用于解释和追溯 |

> Planned design-handoff skeleton only. planned skeleton；只有项目级台账推进后才可进入 activation gate。 本文件不包含实现、测试、artifact、report、evidence、review、verdict、risk acceptance、signoff 或 commit 事实。

## Boundary Objective

闭合 audit/evidence/gap domain、append-only record、committed storage、hash/cursor/visibility source 和 E04/E05/E08/E09 immutable snapshot。

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current boundary | pending | 必须先推进到 commit-04-a。 |
| predecessor handoff | pending | 前一 boundary 必须有真实 Commit/Handoff Gate。 |
| activation permission | pending | 预创建文件不授权实现。 |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L4-observability/03-详细设计.md` | §5、§7、§9~§11、§14：audit/evidence/gap/persistence | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/05-测试方案.md` | §6、§10、§13：audit/evidence/UoW/provenance cuts | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | §5.7、§7 commit-04-a 经验复核 | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` | R06-F-AFFECT-UOW-01、03-RPR-S09-PER-FLOW | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | accepted side-effect, snapshot and persistence closure | pending | 实现前读取；冲突时暂停并回写真相源。 |

## Planned Task and Batch Contract

| task | order | action | output | status |
|---|---|---|---|---|
| IMPL-04A-01 | 1 | 闭合 audit/evidence/gap input、source resolver、visibility/purpose/digest relation | typed source map | planned |
| IMPL-04A-02 | 2 | 实现 append-only records、repository/UoW staging 和 observation-owned storage | storage ports/fakes | planned |
| IMPL-04A-03 | 3 | 实现 C05/C06/C13/C14 service flow 与 E04/E05/E08/E09 snapshot | audit/evidence slice | planned |
| IMPL-04A-04 | 4 | 实现 cursor/version/conflict/recovery/body-free tests | consistency test slice | planned |

BATCH-04A-01 source/visibility/gap <=250 lines; BATCH-04A-02 append/repository/UoW high-risk; BATCH-04A-03 service/event split; BATCH-04A-04 hash/cursor/recovery <=250 lines

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | audit/evidence/gap domain、application service/ports、observation-owned infra stores/fakes | planned |
| allowed_rule | C05/C06/C13/C14、E04/E05/E08/E09 exact snapshot and append flow | planned |
| allowed_rule | body-free linkage、digest/cursor/version/visibility/gap fields with committed source | planned |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | evidence body、external audit truth、final verdict、query repair、retention cleanup、source truth write | active |
| forbidden_rule | 从 time/row id/current truth 猜 cursor/digest 或让 Query 触发 append/rebuild | active |
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
| activation gate | 项目台账 current boundary 必须推进到 `commit-04-a` | pending | 设计期未执行；不得推断 pass。 |
| append order | accepted record/projection/event snapshot share the defined UoW boundary | pending | 设计期未执行；不得推断 pass。 |
| source/visibility | owner, digest, purpose, visibility and gap have exact truth sources | pending | 设计期未执行；不得推断 pass。 |
| body-free | no evidence body/raw/provider material in storage or event | pending | 设计期未执行；不得推断 pass。 |
| cursor/version | cursor, source version and conflict semantics are explicit; no time/row-id guess | pending | 设计期未执行；不得推断 pass。 |
| recovery/no-write | rollback and source-truth write prohibition tested | pending | 设计期未执行；不得推断 pass。 |
| workspace/scope | audit/storage-only scope and build/whitespace checks | pending | 设计期未执行；不得推断 pass。 |

## Worktree Gate

| item | required_observation | status |
|---|---|---|
| target repository | path, authorized worktree, branch and baseline recorded before edit | pending |
| initial status | exact target-repository status captured before edit | pending |
| user-owned changes | unrelated files remain untouched and unstaged | pending |
| scope ownership | touched paths map only to `commit-04-a` | pending |
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
| activation_gate | pending | 等待项目级台账推进到 commit-04-a；预创建不授权实现。 | wait_design |
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
| planned_commit_message | planned message from Step 11 for commit-04-a |
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
| next_boundary | next planned boundary after commit-04-a | pending |
| user_owned_changes_untouched | target worktree file list recorded | pending |

## Inherited Affected Binding

`R06-F-AFFECT-UOW-01` 及 `03-RPR-S09-PER-FLOW` 继续开放；不得把局部 append proof扩展为全局 UoW closure。

GATE-OBS-04、GATE-OBS-08、GATE-OBS-09；evidence body/source write 为 hard blocker。

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

Remain `planned / wait_until_current`. Do not run or record boundary execution until the project ledger advances to `commit-04-a`; then reread this file and the required sources.
