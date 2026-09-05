# Implementation Boundary Skeleton · commit-06-b

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-06-b` |
| phase | `PH-06 CP06 mirror + CP07 read model` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-06-a` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | committed source、projection version、visibility与 no-write mapping需重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.10、§7、§10～§12。
- 正式 `03-详细设计.md` CP07、Queries 014～016、projection / view / state / version source；`05/06` projection / Query no-write cuts。
- 03 Step 6、8、9、10、11、16，07 Step 6、7、11；`L2-tools`只作为 safe capability ref，不接管 registry。

## Allowed Scope

- 仅 committed-only projection state / views、summary / outlet / diagnostic carrier、Queries 014～016、read-model service/fake与 logical API query mapping。
- 仅 `BATCH-06-03`、`BATCH-06-04`。

## Forbidden Scope

- source repair、generic resolver、pseudo-version、registry / grant / invocation、UI / SDK implementation、Query write、read-side mutation。
- Event / publisher / outbox / route / topic / retry / DLQ及 readiness claim。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-06-03` | CP07 contracts / projection state / views |
| `BATCH-06-04` | CP07 projection service / visibility / API query mapping |

## Required Checks

Future only：`GATE-01/02/03/04/06/07`、contract-domain-fast、projection-readmodel、service-flow-fast、api-worker-entry、Query no-write、dependency-boundary与 diff check。

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
- `L2M-DDD-007`：projection / source-version / rebuild closure未完成。
- CP06 predecessor和 `L2M-UP-005` redline均必须先复核。

## Activation Rule

项目 ledger只在 predecessor handoff、新 baseline及 CP07 committed source/version/visibility/no-write source完整后推进。任何 pseudo-version、source repair或 inferred outlet readiness均转 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(projection): add committed member summary projection` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
