# Implementation Boundary Skeleton · commit-03-a

> 设计期 planned boundary skeleton。它只固定 future scope、activation condition 与 blocker posture；不记录或推导执行期事实。

## Boundary Header

| field | value |
|---|---|
| boundary | `commit-03-a` |
| phase | `PH-03 CP02 scope + inbound screening` |
| project-ledger role | future boundary；不得自行成为 current |
| predecessor | `commit-02-b` |
| status | `planned` |
| design baseline | `not_fixed_until_handoff` |
| next_allowed_action | `wait_until_current` |
| activation posture | source / screening classification / state source须随新 baseline重核 |

## Required Reads

- 项目级 ledger、本文件、正式 `07-实施计划.md` §3、§6.3、§6.4、§6.7、§7、§10～§12。
- 正式 `03-详细设计.md` CP02、state / protocol source、Command 005～006；`05/06` CP02 contract、body-free、redaction cuts。
- 03 Step 6、8、9、10、07 Step 6、7；`L1-governance`只作为 policy safe-result owner ref，不复制 allowlist或 policy body。

## Allowed Scope

- 仅 scope decision、body-free inbound fact、four-state screening decision / policy carrier、legal local factory与 refusal fence。
- 仅 `BATCH-03-01` 的 contract / domain increment。

## Forbidden Scope

- scope replacement execution、Store / service、Bus adapter、raw body、policy body、allowlist、ack、route、topic、retry、DLQ。
- fail-open、unknown-to-allow转换、semantic Event / publisher / outbox。

## Planned Batches

| batch | future purpose |
|---|---|
| `BATCH-03-01` | scope / inbound / screening contracts and domain fences |

## Required Checks

Future only：`GATE-02`、CP02 contract-domain-fast、state fence、redaction-boundary与 diff check。

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

- `L2M-DDD-001`、`L2M-BASELINE-001`：repo / baseline未就绪。
- `L2M-UP-007`：screening rule source未闭合；unknown必须拒绝或 blocked。
- `scope_supersede_gap` 影响后续 replacement lane，本 boundary不得假设 helper存在。
- `L2M-UP-005`：禁止 event materialization。

## Activation Rule

只有 predecessor handoff、fixed baseline和 CP02 source / body-free / state mapping均可回指时，project ledger才可推进。任何 policy source歧义都要求 `wait_design`。

## Future Progression Rule

本 boundary不能自行 activation 或推进后继。只有项目级 ledger在授权 immutable baseline、predecessor progression及所有 activation condition闭合后，才可改变 current identity。在此之前，唯一允许动作是 `wait_until_current`。

## Planned Boundary Identity

| field | value |
|---|---|
| planned title | `feat(screening): add inbound scope and screening fences` |
| design-period posture | `waiting` |
| next allowed action | `wait_until_current` |

## Stop-Review Statement

本 skeleton只记录设计期边界定义；当前保持 `waiting / wait_until_current`，不得由本文件自行推进。
