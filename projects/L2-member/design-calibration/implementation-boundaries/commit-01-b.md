# Implementation Boundary Skeleton · commit-01-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-01-b` |
| phase | `PH-01 Foundation / composition` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-01-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | 等待 predecessor handoff、new baseline与重新 Design Gate |

## Required Reads

- 项目级 implementation ledger、本文件、正式 `07-实施计划.md` §3、§6.3～§6.5、§7、§8、§11、§12。
- 正式 `04-配置设计.md` §5～§11、`05-测试方案.md` §9、§13、`06-验收标准.md` §10；07 Step 6、7、8、11。
- 当前时点的 config / artifact-report truth source；若 schema、profile或路径不唯一，先 `wait_design`。

## Allowed Scope

- 仅 future strict profiles、validated composition slots、unavailable mapping、gate/check/report-root generator capability。
- 仅 `BATCH-01-03`、`BATCH-01-04`，且 generator只能消费真实 future input。

## Forbidden Scope

- business flow、real adapter、artifact / report / evidence实例、EV、release conclusion、verdict、signoff或 readiness。
- configuration fallback、secret materialization、非 Core compile dependency以及 24 candidate event facility。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-01-03` | strict profile / builder-slot skeleton |
| `BATCH-01-04` | gate / check / report script capability与 output root |

## Required Checks

Future only：Design / Scope / Worktree Gate，`GATE-08`、`GATE-09`、config-redline、profile parse、generator dry-run、report-path static check、`cargo check`及 diff check。

## Planning Gate Posture

| planning checkpoint | posture | activation condition |
|---|---|---|
| design closure | `waiting` | 等待项目级 ledger、predecessor与 owning design source共同闭合 |
| project-ledger position | `waiting` | 项目级 ledger尚未推进到本 boundary |
| scope and worktree boundary | `waiting` | 获授权目标工作树、最小范围与用户改动保护须在 activation 时复核 |
| named verification checks | `waiting` | 本文件 Required Checks 仅在本 boundary 成为 current 后才可适用 |
| boundary progression | `waiting` | 只有项目级 ledger 能推进 current identity |

## Future Verification Boundary

本文件列出的检查只定义 future verification contract；详细准则由正式 `05-测试方案.md`、`06-验收标准.md` 与 `07-实施计划.md` 统一约束。本 skeleton 不产生任何结果性记录。

## Blockers

- `L2M-DDD-001` 与 `L2M-BASELINE-001`：repo / immutable baseline均未满足。
- 配置 key、profile、slot与 artifact-report materialization若发生漂移，必须回写 `04/05/06`，不得在实现端猜测。
- `L2M-UP-005`：24 candidate保持 zero-configuration / non-materialized。

## Activation Rule

项目级 ledger只有在 `commit-01-a` 的真实 handoff完成、new baseline固定且此 boundary重新通过 Design / Scope / Worktree Gate后才可推进。此文件不得自行转 current。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(config): add strict member composition profiles` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
