# commit-01-a implementation ledger

| field | value |
|---|---|
| project | `L4-observability` |
| boundary_id | `commit-01-a` |
| phase | `PH-01` |
| design_baseline | `formal-07-assembled-not-committed` |
| implementation_repo | `/home/aris/Projects/quantalithos-observability` |
| status | `blocked` |
| gate_status | `blocked` |
| next_allowed_action | `wait_design` |
| current_recovery_point | `target repository and immutable design baseline prerequisite` |
| activation_rule | `project_execution_ledger.current_boundary == commit-01-a` |
| design_authority | formal `07-实施计划.md` + current upstream `00~06`；calibration 只用于解释和追溯 |

> Planned design-handoff skeleton only. 当前为唯一恢复入口，但目标仓和不可变 baseline 缺失；不得编辑实现仓。 本文件不包含实现、测试、artifact、report、evidence、review、verdict、risk acceptance、signoff 或 commit 事实。

## Boundary Objective

建立目标实现仓、workspace、七个 role crate 的 manifest/source skeleton，并验证唯一 core-contracts 编译期依赖候选。

## Activation Guard

| rule | status | consequence |
|---|---|---|
| project ledger current boundary | blocked | 唯一 current 恢复入口；现实 blocker 未解除。 |
| predecessor handoff | not_applicable | 首 boundary 无 predecessor commit。 |
| activation permission | blocked | 不得编辑实现仓。 |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L4-observability/07-实施计划.md` | §1、§3、§5、§6、§7、§11、§12 | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/03-详细设计.md` | §3~§4：workspace、crate、file owner、implementation handoff | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` | target repo、目录、依赖和 Git preflight | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` | §5.1 PH-01 | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` | §5.1、BATCH-01A-01~03 | pending | 实现前读取；冲突时暂停并回写真相源。 |
| `standards/document/代码实施台账与门禁规范.md` | §3~§8、§12 | pending | 实现前读取；冲突时暂停并回写真相源。 |

## Planned Task and Batch Contract

| task | order | action | output | status |
|---|---|---|---|---|
| IMPL-01A-01 | 1 | 确认或创建目标仓并记录 dirty baseline、git identity 和用户改动清单 | target/worktree reality record | planned |
| IMPL-01A-02 | 2 | 建立 workspace、七个 member、package/crate/binary 命名和最小源文件 | Cargo manifests and crate skeleton | planned |
| IMPL-01A-03 | 3 | 核验 core-contracts package/crate/path，扫描 sibling compile edges | dependency/static baseline | planned |

BATCH-01A-01 reality record <=100 lines; BATCH-01A-02 workspace skeleton 100~250 lines; BATCH-01A-03 dependency/static checks <=150 lines

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | 目标仓根 `Cargo.toml` 与仅由 manifest 生成的 `Cargo.lock` | planned |
| allowed_rule | `crates/{contracts,domain,application,infra,api,worker,jobs}/` skeleton、最小 `lib/main` 文件和命名检查 | planned |
| allowed_rule | only `core-contracts` path candidate 的 manifest/metadata 声明 | planned |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | 业务 DTO、domain state、service、repository、config values、scripts、reports | active |
| forbidden_rule | 任何 source truth adapter、非 core sibling Cargo path dependency 或相邻仓 type shadow copy | active |
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
| target-repository reality | 记录目标路径存在/不存在、授权 worktree、dirty baseline | blocked | 等待目标仓/不可变 baseline。 |
| immutable design baseline | 由授权 handoff 固定真实 baseline；不以 dirty HEAD 替代 | blocked | 等待目标仓/不可变 baseline。 |
| git identity | 目标仓内核验 formal 07 要求的 identity | pending | 设计期未执行；不得推断 pass。 |
| format | `cargo fmt --all --check`（目标仓） | pending | 设计期未执行；不得推断 pass。 |
| workspace metadata | `cargo metadata --no-deps` 与七 member/name 校验 | pending | 设计期未执行；不得推断 pass。 |
| compile | `cargo check --workspace` | pending | 设计期未执行；不得推断 pass。 |
| dependency boundary | 仅允许 `core-contracts` compile edge | pending | 设计期未执行；不得推断 pass。 |
| whitespace/scope | `git diff --check`、staged scope review | pending | 设计期未执行；不得推断 pass。 |

## Worktree Gate

| item | required_observation | status |
|---|---|---|
| target repository | path, authorized worktree, branch and baseline recorded before edit | pending |
| initial status | exact target-repository status captured before edit | pending |
| user-owned changes | unrelated files remain untouched and unstaged | pending |
| scope ownership | touched paths map only to `commit-01-a` | pending |
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
| activation_gate | blocked | 目标仓不存在且不可变设计 baseline 未固定；当前只作恢复入口。 | wait_design |
| design_gate | blocked | required reads/immutable baseline 未完成。 | wait_design |
| scope_gate | pending | 尚无实现 diff；激活后按 Allowed Scope 核验。 | fix_gate_failure |
| worktree_gate | blocked | 目标仓不存在，无法记录 dirty baseline。 | wait_design |
| build_gate | pending | 本 boundary 命令尚未运行。 | fix_gate_failure |
| test_gate | pending | 本 boundary 测试尚未运行。 | fix_gate_failure |
| evidence_gate | not_applicable | 本 boundary 不产生 run-scoped evidence；设计期不创建 evidence。 | fix_gate_failure |
| commit_gate | pending | 无 staged files、commit message 或 commit hash 事实。 | fix_gate_failure |
| handoff_gate | pending | 无真实 implementation handoff；完成后才可推进下一 boundary。 | handoff |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | `chore(workspace): establish observability workspace skeleton` |
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
| next_boundary | next planned boundary after commit-01-a | pending |
| user_owned_changes_untouched | target worktree file list recorded | pending |

## Inherited Affected Binding

主要承接 `S08-M1-SECONDARY-TYPE-OWNER-01` 的 owner/static 扫描前置；不关闭任何 inherited affected。

GATE-OBS-01；目标仓或 baseline 缺失时必须 wait_design。

## Pause and Rollback

- Pause immediately on any schema/DTO/state/ref/source/config/evidence/phase mismatch, forbidden material finding, no-write violation, non-core dependency, wrong-run evidence or unclosed required lane.
- Preserve failed/blocked/not-run material; do not overwrite it with a later run or static summary.
- Rollback, if authorized in the implementation repository, must follow Step 10 and must not erase user-owned changes or blocker history.
- A rollback does not close an inherited affected item or create a new positive result.

## Blockers

| blocker_id | gate | status | blocking_reason | requested_design_closure | next_allowed_action |
|---|---|---|---|---|---|
| BLK-OBS-07-TARGET-REPO-001 | activation/design | open | 目标实现仓不存在 | 确认或创建目标仓并记录真实 worktree baseline | wait_design |
| BLK-OBS-07-IMMUTABLE-BASELINE-001 | design_gate | open | 正式 00~07 尚未形成授权不可变实现 baseline | 由授权 handoff 流程固定真实 baseline；不伪造 hash | wait_design |

## Recovery Rule

Current recovery action is `wait_design`. After the target repository and immutable baseline are genuinely established, reread this ledger, run activation/design/worktree preflight, and update the project ledger with real evidence before any implementation edit.
