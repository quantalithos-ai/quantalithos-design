# commit-04-a-source-capture implementation ledger

> 设计仓预创建 boundary skeleton；不是实现、测试、提交或验收记录。当前只允许 `planned / blocked / waiting`，所有 Gate 只允许 `pending / blocked`。

## Boundary Header

| field | value |
|---|---|
| project | `L4-archive` |
| boundary_id | `commit-04-a-source-capture` |
| phase | `PH-04` |
| design_baseline | `pending_immutable_baseline` |
| implementation_repo | `/home/aris/Projects/quantalithos-archive`（not_created_or_verified） |
| status | `planned` |
| next_allowed_action | `wait_until_current` |
| current_recovery_point | `commit-04-a-source-capture` / 按 source-authority matrix 逐 owner 采集并保真失败/provenance；不是 active implementation |
| planned_increment | 按 source-authority matrix 逐 owner 采集并保真失败/provenance |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `formal 00 §7/§11` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `formal 01 §5/§8` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `formal 03 §7.3/§7.5/§8.4` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `formal 05 §6/§8` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `formal 06 §6/§7` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `formal 07 §6/§7` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `各 L1 owner formal docs` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `03 Step 7/9/11` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |
| `05 Step 7` | boundary-specific closure | pending | 正式来源优先；冲突或缺失即 `wait_design` |

## Allowed Scope

| type | path_or_rule | status |
|---|---|---|
| allowed_rule | per-owner binding/selector/version/fence/coverage、capture attempts、controlled owner doubles 与 provenance | pending |
| allowed_rule | 仅消费正式 `03/04/05/06/07` 与已核验 typed contracts；新增 field/DTO/port/state/config/evidence 必须先回写 owning design source | pending |
| allowed_rule | 只形成一项可独立 review、验证和回退的纵切；内部 batches 不获得额外 commit 授权 | pending |

## Forbidden Scope

| type | path_or_rule | status |
|---|---|---|
| forbidden_rule | unified owner schema；workspace canonical fallback；owner DB write；blind recapture；unfenced success；body invention | active |
| forbidden_rule | 不修改兄弟项目；不把 runtime/event/ref/adapter/fake 伪装成 compile dependency；不复制 owner truth | active |
| forbidden_rule | 不在设计仓创建实现仓/源码，不生成真实 run、Bundle、digest、artifact、report、EV、verdict、risk acceptance、signoff 或 readiness | active |
| forbidden_rule | `AR-HLD-Q-001` 未关闭前不得创建 outbox/topic/publisher/delivery surface | active |

## Required Checks

| check | planned command_or_evidence | status | notes |
|---|---|---|---|
| required reads | 项目 ledger、当前 boundary 和上表全部来源 | pending | 当前无执行证据 |
| target/worktree | future `git -C /home/aris/Projects/quantalithos-archive status --short` | blocked | 目标仓不存在/未核验 |
| immutable baseline | future formal 00～07 commit/hash manifest | blocked | 当前未固定 |
| boundary checks | 8 source requiredness；stale/missing/conflicting/unknown；wrong fence/attempt；Auxiliary；material/ref；redaction | pending | 未运行 |
| build | future `cargo fmt --check` 与适用 `cargo check`/metadata | pending | 未运行 |
| test/evidence | 正式 05/06 对应 primary TC、raw/report 与 negative/replay checks | pending | run/artifact/report/EV 为 0 |
| scope/whitespace | future diff、cached scope 与 whitespace check | pending | 未进入实现 |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | 等待项目级台账推进到本 boundary | wait_design |
| design_gate | pending | AR-UP-001/007/008、AR-03-LOCAL-006、owner contracts、predecessor；无 closure evidence | wait_design |
| scope_gate | pending | allowed/forbidden scope 仅为 planned contract | fix_gate_failure |
| worktree_gate | pending | 无目标仓 initial status 或 user-change inventory | fix_gate_failure |
| build_gate | pending | 未运行 build checks | fix_gate_failure |
| test_gate | pending | 未运行 targeted tests | fix_gate_failure |
| evidence_gate | pending | 未生成 fixed-run raw/report/evidence | fix_gate_failure |
| commit_gate | pending | 无用户 commit 授权、staged scope、message 或 checks | fix_gate_failure |
| handoff_gate | pending | 无 hash、run、checks 或 handoff record | handoff |

## Commit Gate

| gate | status | evidence |
|---|---|---|
| staged_scope | pending | 未来只能包含 `commit-04-a-source-capture` allowed scope |
| unrelated_changes | pending | 未来必须证明用户无关改动未暂存 |
| commit_message_format | pending | planned title：`feat(capture): orchestrate authoritative source capture`；不是 actual commit |
| commit_body_group | pending | Per-owner source bindings；Capture orchestration and coverage；真实文件与改动量待 actual diff |
| whitespace | pending | 未执行 staged diff check |
| required_checks | pending | 未运行；计划表不能替代证据 |
| authorization | blocked | 用户尚未授权 implementation commit |

## Handoff Gate

| item | status | evidence |
|---|---|---|
| committed_hash | pending | none；未来只从实际 Git 读取 |
| committed_message | pending | none；未来只从实际 Git 读取 |
| gates_run | pending | none |
| tests_not_run | pending | 当前未运行，因为 implementation 未激活 |
| remaining_blockers | blocked | AR-UP-001/007/008、AR-03-LOCAL-006、owner contracts、predecessor |
| next_boundary | pending | 仅真实 Handoff Gate 通过后由项目 ledger 推进 |
| user_owned_changes_untouched | pending | 目标仓尚无可核验清单 |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | `feat(capture): orchestrate authoritative source capture` |
| commit_status | `pending / not_started` |
| committed_hash | `none` |
| committed_message | `none` |
| run_id | `none` |
| artifact | `none` |
| report | `none` |
| evidence | `none` |
| verdict | `none` |
| risk_acceptance | `none` |
| signoff | `none` |
| readiness | `none` |

## Blockers

| blocker | gate | status | required closure | next_allowed_action |
|---|---|---|---|---|
| AR-UP-001/007/008、AR-03-LOCAL-006、owner contracts、predecessor | design_gate | blocked | owning project/L4 design owner 提供版本化合同、immutable baseline 与必要 vectors；禁止 fake/default/private map workaround | wait_design |

## Stop Review

当前设计期姿态为 `planned`。它是 future boundary，必须保持 `planned / wait_until_current`，直到项目级台账显式推进。 本文件不证明代码、测试、commit、handoff 或 readiness。
