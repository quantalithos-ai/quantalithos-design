# Implementation Boundary Skeleton · commit-05-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-05-a` |
| phase | `PH-05 CP04 outbound + CP05 trace / observation` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-04-b` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | CP04 helper / owner seam / candidate redline须重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.9、§7、§8、§10～§12。
- 正式 `03-详细设计.md` CP04、Queries 007～008、CP03 committed facts；`05/06` outbound / replay / redaction cuts。
- 03 Step 6、7、9、10、11、13，07 Step 6、7、8；`L1-conversation` / Runtime / Bus仅按 safe ref / owner seam使用。

## Allowed Scope

- 仅 CP04 outbound decision、safe material、publication local attempt-gap、handoff Port abstraction、Queries 007～008、logical fake / replay。
- 仅 `BATCH-05-01`、`BATCH-05-02`。

## Forbidden Scope

- Event、publisher、outbox、route、topic、retry、DLQ、delivery / downstream accepted claim。
- external adapter、transport、conversation truth、observed truth、direct Store workaround或 source repair。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-05-01` | CP04 outbound carrier / decision / material / attempt-gap fences |
| `BATCH-05-02` | CP04 service / local handoff seam / read posture |

## Required Checks

Future only：`GATE-02/03/05/07`、contract-domain-fast、service-flow-fast、infra-fake-parity、replay-recovery、redaction-boundary、dependency-boundary与 diff check。

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
- `L2M-DDD-004`：CP04 helper closure待定。
- `L2M-UP-004/005`：owner outbound seam及 shared schema / route未闭合；24 candidate non-materialized。
- `L2M-DDD-002`：durability claim仍 blocked。

## Activation Rule

predecessor handoff、target repo、fixed baseline、CP04 helper及 external seam disposition均必须重核。若 candidate redline不能证明未违反，或 helper未闭合，project ledger须保持 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(outbound): add outbound material attempt-gap boundary` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
