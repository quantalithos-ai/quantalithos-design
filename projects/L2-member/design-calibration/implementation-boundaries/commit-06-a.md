# Implementation Boundary Skeleton · commit-06-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-06-a` |
| phase | `PH-06 CP06 mirror + CP07 read model` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-05-b` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | resolver source / scope / version与 predecessor必须重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.10、§7、§8、§10～§12。
- 正式 `03-详细设计.md` CP06、Commands 009～010、Queries 012～013、resolution / persistence / version source；`04` binding；`05/06` mirror / replay / redaction cuts。
- 03 Step 6、7、9、11、13，07 Step 6、7、8；每个 owner的正式 safe ref，而非 generic external implementation。

## Allowed Scope

- 仅 owner-specific snapshot / resolution / gap carrier、Commands 009～010 safe lane、Queries 012～013、owner-specific Port abstraction、local service/fake/replay。
- 仅 `BATCH-06-01`、`BATCH-06-02`。

## Forbidden Scope

- generic resolver、foreign body、authorization、health / registry truth、direct refresh bypass、source repair或 physical owner adapter。
- Event / publisher / outbox / route / topic / retry / DLQ及 pseudo-version。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-06-01` | CP06 contracts / domain resolution-gap fence |
| `BATCH-06-02` | CP06 service / resolver seam / fake / Queries 012～013 |

## Required Checks

Future only：`GATE-02/03/05/07`、contract-domain-fast、service-flow-fast、infra-fake-parity、replay-recovery、redaction-boundary与 diff check。

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
- `L2M-DDD-006`：CP06 resolver source / helper未闭合。
- `L2M-UP-001/003/007`：owner resolver / source contracts未闭合。
- `L2M-UP-005`：candidate不得物化。

## Activation Rule

只有 predecessor handoff、fixed baseline、owner-specific resolver purpose/scope、version与 local stored result均闭合后，project ledger才可推进。不可用 source只可给 safe gap / blocked，不可 generic fallback。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(mirror): add owner-scoped context resolution boundary` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
