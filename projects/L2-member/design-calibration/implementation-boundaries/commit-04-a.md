# Implementation Boundary Skeleton · commit-04-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-04-a` |
| phase | `PH-04 CP03 Runtime mediation local boundary` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-03-b` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | Runtime ref / carrier / state mapping与 predecessor必须重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.8、§7、§10～§12。
- 正式 `03-详细设计.md` CP03 / protocol / state source、Command 007～008；`05/06` CP03 contract / state / redaction cuts。
- 03 Step 6、8、9、10，07 Step 6、7；`L2-runtime`当前正式 boundary仅作为 ref，不推断 trigger mapping。

## Allowed Scope

- 仅 delivery decision、submission attempt、result link、material reception carrier、factory、legal local state与 negative transition。
- 仅 `BATCH-04-01` 的 contracts/domain cut。

## Forbidden Scope

- Runtime Port implementation、trigger client、Runtime loop/context/plan/outcome、raw Runtime body、external admission或 success claim。
- Event / publisher / outbox / route / topic / retry / DLQ及 direct Store workaround。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-04-01` | CP03 carrier / factory / state fence |

## Required Checks

Future only：`GATE-02`、CP03 contract-domain-fast、state / subject fence、redaction-boundary与 diff check。

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
- `L2M-UP-003/004`：Runtime EntryAuthority / handoff exact mapping未闭合。
- `L2M-UP-005`：24 candidate不物化。

## Activation Rule

project ledger仅在 predecessor handoff、target repo与 fixed baseline存在，且 CP03 carrier / state source可回指时才可推进。Runtime mapping缺口要求 `wait_design`，不是 private client许可。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(runtime): add runtime mediation decision contracts` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
