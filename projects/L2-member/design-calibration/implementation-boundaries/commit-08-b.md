# Implementation Boundary Skeleton · commit-08-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-08-b` |
| phase | `PH-08 Release gates + reports + acceptance handoff` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-08-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | authorized fixed run、evidence provenance与 human review须重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.12、§7、§9～§12。
- 正式 `05-测试方案.md` §13～§14、`06-验收标准.md` §12～§14；07 Step 7、9、10、11、12。
- `commit-08-a` handoff与实施台账；每次恢复必须先确认 fixed baseline / run authority。

## Allowed Scope

- 仅 local-smoke path、release redlines、raw/report audit、evidence mapping、VETO / risk / open-issues / handoff draft generation。
- 仅 `BATCH-08-03`、`BATCH-08-04`。

## Forbidden Scope

- manual or automatic verdict、signoff、readiness、production adapter、新业务功能、static EV或未授权 run。
- 删除失败 raw、修改原始 evidence、把 draft当 acceptance result。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-08-03` | local-smoke fixed scenario |
| `BATCH-08-04` | VETO / risk / handoff draft generation |

## Required Checks

Future only：`GATE-07/09/10`、local-smoke、release-redline、report-generation-audit、redaction-boundary、dependency-boundary与 diff check。

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

- `L2M-DDD-001`、`L2M-BASELINE-001`：repo / baseline缺失。
- 无 fixed run、reviewer、risk acceptor和真实 evidence pair。
- `L2M-UP-001~008`、`L2M-DDD-002~007`及 scope gap影响 P0 / selected lanes；`L2M-UP-005`禁止 candidate materialization。

## Activation Rule

只有 predecessor handoff、fixed baseline、授权 run、真实 report pair和 review responsibility均闭合后才可推进。任何缺失保持 `wait_design`；draft不得提升为 verdict。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(handoff): add local smoke and acceptance draft path` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
