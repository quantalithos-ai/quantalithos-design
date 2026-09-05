# Implementation Boundary Skeleton · commit-02-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-02-b` |
| phase | `PH-02 CP01 presence + host local surface` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-02-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | 等待 CP01 contract / state boundary handoff与 UoW / receipt source复核 |

## Required Reads

- 项目级 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.6、§7、§10～§12。
- 正式 `03-详细设计.md` CP01 §6、§8、§10～§12，Command 001～004、Query 001～002、HostFeedback Consumer；`04` CP01 binding；`05/06` CP01 service / entry / replay cuts。
- 03 Step 7、8、11、13，07 Step 6、7、8、11；不清楚 typed receipt / stored result时必须回写设计。

## Allowed Scope

- 仅 CP01 named service、application Port、logical Store / UoW / idempotency / exact replay、deterministic fake、Commands 001～004、Queries 001～002及 HostFeedback logical entry。
- 仅 `BATCH-02-02`、`BATCH-02-03` 的 local / blocked-aware increment。

## Forbidden Scope

- credential issue、host session / health / lifecycle、IPC、host acceptance正向声称、physical durability、generic fake success。
- direct Store workaround、receipt reconstruction、raw secret/body、Event / publisher / outbox / route / retry / DLQ。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-02-02` | CP01 service / Store fake / UoW / replay |
| `BATCH-02-03` | CP01 API / worker logical entry and negative tests |

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

- `L2M-DDD-001`、`L2M-BASELINE-001`：目标仓 / immutable baseline缺失。
- `L2M-UP-001`、`L2M-UP-006`：host IPC / credential exact contract未闭合。
- `L2M-DDD-002/003`：physical Store / UoW与 typed receipt / replay source未闭合；不得 private fake或 direct Store补口。
- `L2M-UP-005`：24 candidate保持 non-materialized。

## Activation Rule

项目 ledger仅可在 predecessor真实 handoff、local UoW / stored carrier source闭合并完成新 baseline复核后推进。owner-positive lane未闭合时，只可保留 local blocked posture或 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(presence): add local presence service and replay flow` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
