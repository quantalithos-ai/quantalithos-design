# L4-archive implementation execution ledger

> 这是随正式 `07-实施计划.md` 移交而预创建并完成静态审计的设计期实施台账，不是实现日志、测试报告或验收材料。
> 当前只记录 `planned / blocked / waiting` 规划姿态与 `pending / blocked` Gate；不创建目标仓，不固定虚构 baseline，不记录真实 commit、run、Bundle、digest、artifact、report、EV、verdict、risk acceptance、signoff 或 readiness。
> 创建日期：2026-09-14；规范来源：`standards/document/代码实施台账与门禁规范.md`。

## Current Implementation State

| field | value |
|---|---|
| project | `L4-archive` |
| design_repo | `/home/aris/Projects/quantalithos-design` |
| implementation_repo | `/home/aris/Projects/quantalithos-archive`（planned path；当前未创建、未核验） |
| current_design_baseline | `pending_immutable_baseline`（不是 commit hash） |
| current_phase | `PH-01`（等待实施移交） |
| current_boundary | `commit-01-a-foundation`（唯一 current identity；不是 active implementation） |
| boundary_status | `blocked` |
| gate_status | `blocked` |
| gate_reason | 目标实现仓、immutable design baseline 与 implementation authorization 均不存在；`AR-ARCH-001`、`AR-03-LOCAL-006` 继续开放 |
| next_allowed_action | `wait_design` |
| current_recovery_point | `commit-01-a-foundation / target-repository-baseline-Core-preflight` |
| implementation_status | `blocked / not_entered` |
| completed_boundaries | `0/16` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_allowed | `false` |
| last_updated_by | design calibration agent |
| last_updated_at | `2026-09-14 +0800` |

## 1. Authority and recovery order

任何未来 implementation continuation 必须按以下顺序恢复：

1. 本项目级 ledger；
2. `implementation-boundaries/commit-01-a-foundation.md` 或项目级台账指定的唯一 current boundary；
3. 正式 `07-实施计划.md`；
4. 当前 boundary 的 `Required Reads`；
5. 目标实现仓实际存在且获授权后，读取其 worktree、Git identity、toolchain、dependency graph 和用户改动清单；
6. 若存在，再读取实现仓 `.codex/implementation_ledger.md`；该 scratch 文件不能替代本台账。

正式 `00～07` 优先于 calibration。字段、DTO、状态、ref、port、UoW、配置、source/material、effect、测试、证据或 phase boundary 任一不能 1:1 回指时，保持 `blocked / wait_design`，回写 owning design source；实现端不得以 default、private map、fake、字符串解析、provider 选择或 outbox 补口。

## 2. Phase status

| phase | boundaries | planning_status | first blocking condition |
|---|---|---|---|
| PH-01 | `commit-01-a-foundation`、`commit-01-b-runtime-shell` | blocked | target repo、baseline、Core/config/evidence schema |
| PH-02 | `commit-02-a-admission-contracts`、`commit-02-b-local-consistency` | waiting | PH-01；operation codec、durable UoW/CAS |
| PH-03 | `commit-03-a-query-surfaces`、`commit-03-b-cursor-visibility` | waiting | PH-02；visibility/cursor/redaction closure |
| PH-04 | `commit-04-a-source-capture`、`commit-04-b-bundle-closure` | waiting | PH-02/03；owner source/material/durable range |
| PH-05 | `commit-05-a-assessment-contracts`、`commit-05-b-assessment-execution` | waiting | PH-04；integrity/schema/key/capability |
| PH-06 | `commit-06-a-placement-retrieval`、`commit-06-b-lifecycle-governance` | waiting | PH-05；storage finality、governance decision/hold |
| PH-07 | `commit-07-a-restore-plan`、`commit-07-b-restore-handoff` | waiting | PH-05/06；Artifact material、receiver/finality |
| PH-08 | `commit-08-a-local-evidence`、`commit-08-b-formal-handoff` | waiting | PH-01～07；machine schema、fixed run、named review |

## 3. Boundary Ledger

| boundary | phase | design_baseline | status | last_gate | next_allowed_action | notes |
|---|---|---|---|---|---|---|
| `commit-01-a-foundation` | PH-01 | `pending_immutable_baseline` | blocked | activation_gate | wait_design | 唯一 current identity；目标仓/baseline/Core/授权缺失 |
| `commit-01-b-runtime-shell` | PH-01 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | 等待 01-a Handoff；config/schema/evidence binding 仍阻塞 |
| `commit-02-a-admission-contracts` | PH-02 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | local contract slice；不等 formal authority 已闭合 |
| `commit-02-b-local-consistency` | PH-02 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | 等待 02-a；codec/durable UoW blockers 保留 |
| `commit-03-a-query-surfaces` | PH-03 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | local no-write slice；visibility/redaction pending |
| `commit-03-b-cursor-visibility` | PH-03 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | cursor codec/key/visibility blocked |
| `commit-04-a-source-capture` | PH-04 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | 8 source formal seam required + blocked |
| `commit-04-b-bundle-closure` | PH-04 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | owner material与 durable exact-set blocked |
| `commit-05-a-assessment-contracts` | PH-05 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | controlled contract slice；不能产生 Verified/Supported |
| `commit-05-b-assessment-execution` | PH-05 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | integrity/schema/UoW blockers 保留 |
| `commit-06-a-placement-retrieval` | PH-06 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | storage finality/probe blocked |
| `commit-06-b-lifecycle-governance` | PH-06 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | current decision/hold/storage blocked |
| `commit-07-a-restore-plan` | PH-07 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | Artifact material/receiver mapping blocked |
| `commit-07-b-restore-handoff` | PH-07 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | material/receiver/outcome/observability blocked |
| `commit-08-a-local-evidence` | PH-08 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | capability-only；machine schema/repo blocked |
| `commit-08-b-formal-handoff` | PH-08 | `pending_immutable_baseline` | planned | activation_gate | wait_until_current | 所有 required seam、真实 fixed run 与 named review 缺失 |

未来 boundary 的文件预存在不构成授权；只能由本项目级 ledger 在 predecessor Handoff Gate、immutable baseline、用户授权及该 boundary 前置同时满足后推进。任何 future boundary 都不得自行把 `wait_until_current` 改为 `implement`。

## 4. Common Gate contract

| gate | current project posture | activation requirement | failure action |
|---|---|---|---|
| activation_gate | blocked | 用户 implementation 授权、目标仓、immutable baseline、唯一 current boundary | wait_design |
| design_gate | blocked | required reads 与字段/DTO/state/ref/UoW/effect/evidence/phase 闭环；所有适用 blocker 有 owner closure | wait_design |
| scope_gate | pending | allowed/forbidden scope 与真实 touched files 一致 | fix_gate_failure |
| worktree_gate | pending | 初始状态和用户无关改动已登记，无 destructive 覆盖 | fix_gate_failure |
| build_gate | pending | fmt/check/metadata/dependency 检查有真实命令结果 | fix_gate_failure |
| test_gate | pending | boundary primary TC 与必要负向/并发/重放检查有真实 raw | fix_gate_failure |
| evidence_gate | pending | fixed-run raw/report/digest/link/redaction 证据满足正式 05/06 | fix_gate_failure |
| commit_gate | blocked | staged scope、message、whitespace、required checks、ledger 与用户 commit 授权齐全 | fix_gate_failure |
| handoff_gate | pending | actual hash/message/checks/blockers/next boundary/用户改动保护齐全 | handoff |

任何 `pass` 都必须绑定真实证据；本文件当前没有 `pass`。`blocked` 不能直接跳到 `implement` 或 `commit`。

## 5. Open Blockers

| blocker_id | affected boundaries | owning source | status | required closure / forbidden workaround | next_action |
|---|---|---|---|---|---|
| `AR-UP-001` | 04-a/04-b | 各 L1 truth owner | open | versioned snapshot/export/fence/coverage；不得用 workspace 补 canonical | wait_design |
| `AR-UP-002` | 06-b/07-a | L1-work | open | project trigger/lifecycle/restore decision；不得推断 archived/restored | wait_design |
| `AR-UP-003` | 06-b | L1-governance 或明确 owner | open | retention/hold/delete/risk authority；不得设默认期限或允许值 | wait_design |
| `AR-UP-004` | 05-a/05-b | integrity/security/schema owner | open | algorithm/key/canonical/schema/capability vectors；不得用 fake digest/Verified | wait_design |
| `AR-UP-005` | 06-a/06-b | storage/operations owner | open | ACK/Committed/CommitUnknown/probe/retrieval/cleanup contract；不得盲重派 | wait_design |
| `AR-UP-006` | 04-b/07-a/07-b | L1-artifact | open | approved body/ref/lineage/material contract；ref 集合不冒正文 | wait_design |
| `AR-UP-007` | 04-a/07-b/08-b | L4-observability | open | audit/evidence export/redaction/provenance handoff；日志不冒审计链 | wait_design |
| `AR-UP-008` | 04-a/04-b | L1-workspace | open | restricted read/export/coverage/Auxiliary contract；不得 canonical fallback | wait_design |
| `AR-UP-009` | 07-a/07-b | 各 truth/receiver owner | open | receiver/schema/outcome/probe/compensation/finality；不得直写 owner DB | wait_design |
| `AR-ARCH-001` | 01-a/all dependency gates | 全局依赖标准 owner + L0-sdk | open | actual graph 与方向对齐；不得引入 SDK server compile edge | wait_design |
| `AR-HLD-Q-001` | all boundaries | L4 architecture + Bus/consumer owners | open | outbound 若需要须正式 ADR/payload/UoW/topic/consumer；否则 surface 必须为零 | wait_design |
| `AR-HLD-Q-002` | 01-b/08-b | workload/product/ops/acceptance owner | open | approved workload/method/threshold；不得填写默认性能、RTO/RPO | wait_design |
| `AR-03-LOCAL-001` | 02-a/02-b | L4 protocol/config/security owner | open | operation codec/input digest vectors；不得随机/string/JSON 临时编码 | wait_design |
| `AR-03-LOCAL-002` | 03-a/03-b | L4 query/store/security owner | open | cursor mapping/codec/key/visibility/restart vectors；不得暴露私有 offset | wait_design |
| `AR-03-LOCAL-003` | 02-b/04-b/05-b/06-a | L4 infra owner | open | durable UoW/CAS/read-set/probe/fence binding；in-memory 不证明 durability | wait_design |
| `AR-03-LOCAL-004` | 01-b/05-b/08-a | L4 config/environment owner | open | 55-key machine schema/values/refs/cross-field；不得 sample/default 绕过 | wait_design |
| `AR-03-LOCAL-005` | 01-b/03-a/08-a/08-b | L4 observability/ops owner | open | safe sink/redaction/non-interference/material binding；日志不作 evidence | wait_design |
| `AR-03-LOCAL-006` | 01-a/all | L4 project/implementation owner + 用户 | open | implementation authorization、目标仓、immutable baseline、真实 run | wait_design |

## 6. Truthfulness and evidence ceiling

| item | current value | interpretation |
|---|---|---|
| design baseline | pending | 未固定 immutable hash；当前工作树不能冒充 baseline |
| implementation repository | not_created_or_verified | planned path 不表示 Git/worktree/package 存在 |
| implementation code | 0 | 未写源码、配置、脚本或测试 |
| completed boundary | 0/16 | skeleton 与计划层 mapped 不算完成 |
| build/test execution | 0 | 未运行实现仓命令，不能产生 pass |
| Bundle/manifest/digest/signature | 0 | 设计对象和字段名不是实例 |
| run/artifact/report/EV/review | 0 | 未生成、未审查 |
| verdict/risk acceptance/signoff/readiness | 0 | 未进入正式验收，Archive 无权预填 |
| implementation commits | 0 | planned title 不是实际 commit |

## 7. Activation and stop-review rule

当前唯一允许动作是 `wait_design`：等待用户明确 implementation authorization、目标实现仓可核验、正式 `00～07` 被固定为 immutable baseline，并逐 boundary 关闭适用 blocker。此前不得创建目标仓、改代码、跑测试、生成证据或提交。

本台账作为设计期 planned skeleton 已完成；它不宣称 implementation、acceptance、release 或 readiness 完成。正式 `07` 的状态是 `formal / stop_review`，下一步只能等待用户审查或新的明确实现授权。
