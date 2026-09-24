# commit-ph-06-a implementation ledger

> 计划级 boundary skeleton。该文件由正式 07 Step 13 预创建，不表示当前 boundary 已激活或任何实现事实已发生。

## Boundary Header

| field | value |
|---|---|
| project | `L5-runner` |
| phase | `PH-06` |
| boundary_id | `commit-ph-06-a` |
| design_baseline | `not_created / pending authority` |
| implementation_repo | `/home/aris/Projects/quantalithos-runner`（planned path only; not created） |
| status | `planned` |
| gate_status | `blocked` |
| next_allowed_action | `wait_until_current` |
| current_boundary | `none / not_activated` |
| commit/run/artifact/report/evidence | `not_created` |
| verdict/signoff/readiness | `none / not_asserted` |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| `projects/L5-runner/07-实施计划.md` | §3、§5、§6、§7、§10～§12 | `required / not_confirmed` | 正式计划优先；当前不得实现 |
| `projects/L5-runner/03-详细设计.md` | 03 §13～§16；04 §9～§13；05 §8～§14；06 §3～§14 | `required / not_confirmed` | 字段、状态、port、flow 和副作用真相源 |
| `projects/L5-runner/04-配置设计.md` | 相关配置、profile、builder、failure/rollback | `required / not_confirmed` | 配置不能改变 truth 或 phase boundary |
| `projects/L5-runner/05-测试方案.md` | 相关 CUT、suite、TC、artifact/report/evidence | `required / not_confirmed` | planned 不等于 executed/pass |
| `projects/L5-runner/06-验收标准.md` | 相关 AC/AR/TX/NFA/VETO、entry/exit | `required / not_confirmed` | 不生成验收 verdict |
| 07 calibration | 对应 Step 6/7/8/10/11/12 产物 | `required / not_confirmed` | 解释性来源；冲突回写正式文档 |

## Allowed Scope

| type | planned scope | status |
|---|---|---|
| boundary increment | selected public seam、baseline/preflight 和 controlled slot | `planned` |
| design checks | 只记录字段/DTO/state/ref/port/config/evidence/phase 闭环检查 | `planned` |
| test/evidence capability | 只建立本 boundary 的 planned checks 和 same-run contract | `planned` |

## Forbidden Scope

| forbidden action | reason | status |
|---|---|---|
| 自行选择语言、runtime、GUI/CLI、process、packaging、物理路径或 store backend | `RUN-DDD-001~003` 未闭合 | `blocked` |
| 复用/编译 Sandbox 私有实现、直连内部 DB/bus/topic 或绕过 SDK/API | truth ownership 与架构红线 | `blocked` |
| 允许 `latest`、修改 Release、补判 approval、把 ACK/PID/端口/log 当运行成功 | 违反显式选择和 owner truth 边界 | `blocked` |
| Query 写入、Consumer 读 payload/ACK/cursor、Job 修 owner truth/replay、产生 outbound event | 违反独立红线 | `blocked` |
| 创建真实 baseline、commit hash、run、artifact、report、evidence、verdict、signoff 或 readiness | 当前未授权且无实例 | `blocked` |

## Required Checks

| check | required outcome | current state |
|---|---|---|
| GATE-04/08/09/11、authority/target-tier/fixed-run | 有真实 authority、scope、source 和可审查材料 | `not_run / blocked` |
| design closure | 字段、DTO、state、ref、port、UoW、config、projection、artifact source 可 1:1 构造 | `not_run / blocked` |
| dependency/redaction/event-zero | public seam、禁止依赖、redaction 和 event=0 可被机器/人工复核 | `not_run / blocked` |
| test/evidence pairing | raw→report→check→evidence 同一 run；缺失保持 incomplete | `not_created / blocked` |
| phase and boundary review | 不越界、不依赖后续 phase；失败回写 owning source | `not_run / blocked` |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| design_gate | `blocked` | `not_created` | `wait_design` |
| scope_gate | `blocked` | `not_created` | `wait_design` |
| worktree_gate | `blocked` | `not_created` | `wait_design` |
| build_gate | `blocked` | `not_created` | `wait_design` |
| test_gate | `blocked` | `not_created` | `wait_design` |
| evidence_gate | `blocked` | `not_created` | `wait_design` |
| commit_gate | `blocked` | `not_created` | `wait_design` |
| handoff_gate | `blocked` | `not_created` | `wait_design` |

## Commit Record

| field | value |
|---|---|
| planned_commit_message | `pending authority / not_created` |
| staged_files_checked | `not_run` |
| commit_message_checked | `not_run` |
| committed_hash | `not_created` |
| committed_message | `not_created` |
| post_commit_status | `not_created` |

## Blockers

| blocker_id | gate | status | reason | next_allowed_action |
|---|---|---|---|---|
| RUN-UP-001~008 | design/dependency | `blocked` | required authority, seam or guarantee absent | `wait_design` |
| RUN-OPS-001 | dependency/config | `blocked` | required authority, seam or guarantee absent | `wait_design` |
| RUN-OPS-002 | dependency/config | `blocked` | required authority, seam or guarantee absent | `wait_design` |
| RUN-DOC-003 | handoff | `resolved_for_file_creation; implementation still blocked` | formal 07 and skeletons exist, but user confirmation and implementation authority are absent | `wait_design` |

## Recovery Conditions

Resume is forbidden until: user confirmation is explicit; the implementation repository and technology authority are verified; an immutable design baseline exists; required reads are rechecked; this boundary is the unique current boundary; applicable Design/Scope/Worktree/Build/Test/Evidence gates have real evidence; same-run lineage and cleanup are intact; and no P0/VETO or design-closure blocker remains.

Any discovered schema, state, port, config, evidence or owner-seam gap must be written back to its owning truth source and reflected in a new design baseline before this skeleton can move from `planned` to an executable state.
