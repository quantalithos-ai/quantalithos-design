# Implementation Boundary Skeleton · commit-05-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-05-b` |
| phase | `PH-05 CP04 outbound + CP05 trace / observation` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-05-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | trace / observation helper、redaction和 committed-source需重新闭合 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.9、§7、§10～§12。
- 正式 `03-详细设计.md` CP05、Queries 009～011、trace / telemetry / state source；`04` redaction binding；`05/06` trace / redaction cuts。
- 03 Step 6、7、9、10、11、15，07 Step 6、7、8；observability材料只作 owner boundary ref。

## Allowed Scope

- 仅 append-only interaction trace、gap、observation material / attempt posture、redacted read、logical service/fake和 Queries 009～011。
- 仅 `BATCH-05-03`、`BATCH-05-04`。

## Forbidden Scope

- observability backend、complete log、observed / evidence truth、raw body / secret、delivery / external feedback success。
- Event / publisher / outbox / route / topic / retry / DLQ、source repair和 direct Store mutation。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-05-03` | CP05 trace / gap / observation contracts and append-only policy |
| `BATCH-05-04` | CP05 service / fake / Queries 009～011 and feedback local boundary |

## Required Checks

Future only：`GATE-02/03/05/07`、contract-domain-fast、service-flow-fast、append-only cut、infra-fake-parity、redaction-boundary与 diff check。

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
- `L2M-DDD-005`：CP05 helper / observation construction未闭合。
- observability backend与 owner seam外置；`L2M-UP-005` 禁止 candidate materialization。

## Activation Rule

project ledger只在 predecessor handoff、新 baseline、trace helper、redaction and append source闭合后推进。任何 backend / observation truth被引入均应停止并回写设计。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(trace): add redacted interaction trace posture` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
