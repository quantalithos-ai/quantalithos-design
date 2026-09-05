# Implementation Boundary Skeleton · commit-07-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-07-a` |
| phase | `PH-07 Consumers + Jobs + replay continuation` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-06-b` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | finite source identity、entry context、body gate与 receipt surface需重核 |

## Required Reads

- 项目 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.11、§7、§10～§12。
- 正式 `03-详细设计.md` Consumer contract、worker source、entry protocol；`05/06` Consumer entry / redaction cuts。
- 03 Step 7、8、9、11、13、16，07 Step 6、7；owner source materials仅按正式可引用内容消费。

## Allowed Scope

- 仅 10 external Consumer finite carrier、source/schema/body pre-gate、rejection / blocked result与 logical worker mapping。
- 仅 `BATCH-07-01`。

## Forbidden Scope

- generic listener、broker/client、ACK、DLQ、accepted receipt reconstruction、raw body、positive external integration、source default。
- Event / publisher / outbox / route / topic / retry / DLQ和 direct Store workaround。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-07-01` | external Consumer contracts and pre-gates |

## Required Checks

Future only：`GATE-02/04/07`、contract-domain-fast、api-worker-entry、redaction-boundary与 finite-source check。

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
- `L2M-DDD-003`：typed receipt / save-get / replay source未闭合。
- `L2M-UP-001~007`：external source / schema / authority exact contract待 closure。
- `L2M-UP-005`：禁止 candidate event facility。

## Activation Rule

predecessor handoff、fixed baseline、每个 source identity和 receipt disposition均须闭合。任何 default source、generic listener或 positive integration诉求均应 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(consumer): add external consumer pre-gates` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
