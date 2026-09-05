# Implementation Boundary Skeleton · commit-08-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-08-a` |
| phase | `PH-08 Release gates + reports + acceptance handoff` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-07-d` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | fixed input、report pairing与 generator source须重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.12、§7、§8～§12。
- 正式 `05-测试方案.md` §9、§13、`06-验收标准.md` §10～§11；07 Step 7、8、9、10、11、12。
- `代码实施台账与门禁规范.md` 的 artifact / report / evidence provenance规则；不得读取不存在的 run作为输入。

## Allowed Scope

- 仅 P0 release gate orchestration、dependency/config/redaction/report-pair checks、raw-to-readable-report与 evidence-index generator capability。
- 仅 `BATCH-08-01`、`BATCH-08-02`。

## Forbidden Scope

- static evidence、VETO pass、final smoke result、signoff、readiness、production adapter、Event facility。
- 手写 artifact/report、删除失败 raw、伪造 run_id或 verdict。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-08-01` | gate orchestration / static boundary checks |
| `BATCH-08-02` | artifact-to-report and evidence index shell |

## Required Checks

Future only：`GATE-01/07/08/09`、release-gate dry-run、dependency-boundary、config-redline、redaction-boundary、report-generation-audit与 diff check。

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
- 无真实 run、artifact、report、reviewer与 risk authority。
- `L2M-UP-005`：24 candidate必须 zero-configuration / non-materialized。

## Activation Rule

只有 predecessor handoff、fixed baseline、真实 input schema与 report generator source闭合后才可推进；任何 static evidence或手写 pass均保持 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(release): add release gate and report generation shell` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
