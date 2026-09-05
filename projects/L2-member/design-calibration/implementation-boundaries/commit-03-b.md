# Implementation Boundary Skeleton · commit-03-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-03-b` |
| phase | `PH-03 CP02 scope + inbound screening` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-03-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | successor helper、typed receipt与 worker mapping闭合前必须 `wait_design` |

## Required Reads

- 项目级 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.7、§7、§10～§12。
- 正式 `03-详细设计.md` CP02 flow / persistence / Consumer / Query source；`05/06` CP02 service、entry、replay和 redaction cuts。
- 03 Step 7、8、10、11、13，07 Step 6、7、8；`scope_supersede_gap`和 `L2M-DDD-003` 的 owning source。

## Allowed Scope

- 仅 local CP02 named service、logical Store / UoW / replay、safe worker pre-gate、Query 003～004 no-write surface与 deterministic fake。
- 仅 `BATCH-03-02`、`BATCH-03-03`，并保持 blocked-aware result。

## Forbidden Scope

- `Active -> Superseded` workaround、allowlist、policy body、Bus wire / ACK、raw body、generic listener、receipt reconstruction。
- direct Store mutation、source repair、Event / publisher / outbox / route / topic / retry / DLQ。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-03-02` | scope / screening application flow and fake UoW |
| `BATCH-03-03` | inbound Consumer pre-gate and Query no-write entry |

## Required Checks

Future only：`GATE-03/04/05/07`、service-flow-fast、api-worker-entry、infra-fake-parity、replay-recovery、redaction-boundary与 Query no-write check。

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
- `scope_supersede_gap`：legal `Active -> Superseded` helper未定义。
- `L2M-DDD-003`：typed Consumer receipt / save-get / replay source未闭合。
- `L2M-UP-007`：screening source contract未闭合；`L2M-UP-005`：event candidate不得物化。

## Activation Rule

project ledger只有在 `commit-03-a` handoff、new baseline及 successor / receipt / source mapping均闭合后才能激活。任何一项缺失都保持 `wait_design`，不得降级为 local workaround。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(inbound): add local screening service and pre-gate surface` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
