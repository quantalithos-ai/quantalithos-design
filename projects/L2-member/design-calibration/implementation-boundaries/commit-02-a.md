# Implementation Boundary Skeleton · commit-02-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-02-a` |
| phase | `PH-02 CP01 presence + host local surface` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-01-b` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | subject / state / factory source与 predecessor均须重核 |

## Required Reads

- 项目级 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.6、§7、§10～§12。
- 正式 `03-详细设计.md` CP01、§5～§10；`05/06` CP01 contract / state cuts；03 Step 6、10及07 Step 6、7。
- `L1-identity`、`L2-member-service`当前可引用 owner material，仅用于 ref / pending boundary，不得替代 exact contract。

## Allowed Scope

- 仅 CP01 `MemberSubjectAnchor`、startup admission、presence、host material / attempt carrier、factory、legal local state transition与 negative cut。
- 仅 `BATCH-02-01`，不进入 Store、UoW、host IPC或 entry。

## Forbidden Scope

- credential issuance、host acceptance、registry、session、health、container lifecycle、IPC、Store / UoW、API / worker entry。
- third-subject fallback、owner mismatch放行、direct Store mutation和所有 Event / outbox facility。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-02-01` | CP01 contracts / domain factories / legal presence transitions |

## Required Checks

Future only：`GATE-02`、CP01 contract-domain-fast、state / subject fence、negative / redaction cut与 diff check。

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

- `L2M-DDD-001`、`L2M-BASELINE-001`：repo与 immutable baseline未就绪。
- `L2M-UP-006`、`L2M-UP-008`：credential form与 execution subject contract未闭合；保持 safe fence。
- `L2M-UP-005`：不物化 semantic candidate。

## Activation Rule

只有 predecessor handoff、target repo、fixed baseline以及 CP01 field / factory / state / subject source闭合后，项目 ledger才可将此 boundary设为 current。任何 owner contract缺口均转 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(presence): add member admission and presence contracts` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
