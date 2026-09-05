# Implementation Boundary Skeleton · commit-04-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-04-b` |
| phase | `PH-04 CP03 Runtime mediation local boundary` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-04-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | 等待 CP03 contract handoff、Runtime seam与 replay source重新闭合 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.8、§7、§10～§12。
- 正式 `03-详细设计.md` CP03 §6～§13、Command 007～008、Query 005～006、RuntimeMaterialConsumer；`04` binding；`05/06` CP03 service / replay / entry cuts。
- 03 Step 7、8、11、13，07 Step 6、7、8、11；`L2-runtime` exact owner contract必须单独读取。

## Allowed Scope

- 仅 Runtime boundary Port abstraction、local service / UoW / replay、blocked seam、deterministic fake、Commands 007～008、Queries 005～006及 RuntimeMaterialConsumer logical entry。
- 仅 `BATCH-04-02`、`BATCH-04-03` 的 local / negative increment。

## Forbidden Scope

- Runtime loop、context、plan、outcome、trigger client、external admission、raw body、positive Runtime success。
- generic resolver、direct Store update、semantic candidate materialization和所有 Event facility。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-04-02` | CP03 service / resolver-port / UoW / fake |
| `BATCH-04-03` | CP03 API / worker logical entry |

## Required Checks

Future only：`GATE-03/04/05/07`、service-flow-fast、infra-fake-parity、api-worker-entry、replay-recovery、redaction-boundary与 diff check。

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
- `L2M-UP-003/004`：Runtime trigger / handoff exact contract待 owner closure。
- `L2M-DDD-002/003`：physical durability与 receipt / replay source未闭合。
- `L2M-UP-005`：禁止 semantic candidate materialization。

## Activation Rule

只有 predecessor真实 handoff、新 baseline、exact local Port/UoW/replay source和 Runtime boundary status均复核后，project ledger才可推进。external mapping缺失即 `wait_design`，不允许 trigger client substitute。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(runtime): add local runtime mediation orchestration` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
