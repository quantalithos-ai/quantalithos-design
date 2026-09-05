# Implementation Boundary Skeleton · commit-01-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-01-a` |
| phase | `PH-01 Foundation / composition` |
| project-ledger role | 唯一 current identity；不是 active implementation |
| status | `blocked` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_design` |
| activation posture | target repo / immutable baseline / Core compatibility闭合前不得开工 |

## Required Reads

- 项目级 `implementation_execution_ledger.md` 与本文件；正式 `07-实施计划.md` §3、§6.3、§6.4、§6.5、§7、§8、§11、§12。
- 正式 `03-详细设计.md` §3～§5、§13；`07_implementation_plan_step_03_prerequisites_reading.md`、Step 6、Step 7、Step 8、Step 11。
- `代码实施台账与门禁规范.md`、`子项目目录与代码文件组织规范.md`、`standards/coding/rust.md`；实际存在后才读取获授权目标仓的 user-change inventory。

## Allowed Scope

- 仅未来 seven-library-crate workspace、package / crate naming、inward dependency shape 与 Core-only compile candidate guard。
- 仅 `BATCH-01-01`、`BATCH-01-02` 所定义的 composition 增量及其 future targeted checks。

## Forbidden Scope

- config、业务 carrier / domain truth、entry、真实测试结果、artifact / report / evidence。
- 任意非 Core Cargo dependency，或 Event、publisher、outbox、route、topic、retry、DLQ。
- 在 design repo 写实现、创建目标仓、shadow Core contract 或把 planned path写成已存在。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-01-01` | workspace、seven library crate 与 dependency direction |
| `BATCH-01-02` | Core-only compile candidate、naming / path checks |

## Required Checks

Future only：Design / Scope / Worktree Gate，`GATE-01`，`cargo fmt --check`，`cargo check`，dependency-boundary 与 `git diff --check`。检查名称不是已运行记录。

## Planning Gate Posture

| planning checkpoint | posture | activation condition |
|---|---|---|
| design closure | `blocked` | target repository、immutable baseline与Core compatibility须先闭合 |
| project-ledger position | `blocked` | 唯一 current identity仍受 blocker约束，不能据此开工 |
| scope and worktree boundary | `blocked` | 获授权目标工作树、最小范围与用户改动保护须在 activation 时复核 |
| named verification checks | `blocked` | 本文件 Required Checks 仅在本 boundary 成为 current 后才可适用 |
| boundary progression | `blocked` | 只有项目级 ledger 能推进 current identity |

## Future Verification Boundary

本文件列出的检查只定义 future verification contract；详细准则由正式 `05-测试方案.md`、`06-验收标准.md` 与 `07-实施计划.md` 统一约束。本 skeleton 不产生任何结果性记录。

## Blockers

- `L2M-DDD-001`：`/home/aris/Projects/quantalithos-member` absent。
- `L2M-BASELINE-001`：当前 design worktree dirty，immutable implementation baseline未固定。
- Core package / export / path / MSRV compatibility未核验；唯一 planned compile candidate仍须复核。
- `L2M-UP-005`：任何 member semantic candidate均保持 non-materialized。

## Activation Rule

只有项目级 ledger 在目标仓获授权存在、immutable manifest固定、Core compatibility复核完成并重做 Design / Scope / Worktree Gate后，才可把本 boundary留作唯一 current并改变后续动作。该文件不能自行解除 `blocked` 或推进 `commit-01-b`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_design`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(workspace): establish member crate composition` |
| design-period posture | `blocked` |
| next allowed action | `wait_design` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `blocked / wait_design`，不得由本文件自行推进。
