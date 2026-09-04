# L2-member-service 07 实施计划校准流程

> 版本：full-restart；执行方式：single-agent-serial。
> 本文件只记录实施计划设计期的 planned / blocked / waiting 状态，不记录实现、测试运行、commit、run、artifact、report、evidence、verdict、signoff 或 readiness。
> 正式 `00~07` 是实现基线；本目录的中间产物只提供决策追溯。正式文档与校准材料冲突时，以正式文档为准；仍不清楚时必须回写设计真相源并暂停。

> 终审修订：2026-09-03；依据实施计划书写规范补齐正式 §2/§3/§6/§7 的结构化字段，并保持 `completed / stop_review`，不开放实现动作。

## 1. 当前恢复点

| 项 | 当前状态 |
|---|---|
| 当前文档 | `07-实施计划.md` |
| 当前 Step | Step 13 `formal_document_assembly` |
| 当前模块 | formal assembly / implementation handoff |
| gate_status | `completed / pass_with_upstream_blockers; stop_review` |
| next_allowed_action | `stop_review` |
| implementation_repo | `/home/aris/Projects/quantalithos-member-service`（absent；仅记录为实施前置 blocker） |
| implementation_status | `not_started` |
| actual commit / run / evidence | `none / none / none` |

用户“继续完成全部 07”允许本轮连续完成 Step 1~13、正式文档、implementation ledger 与 planned boundary skeleton；完成 Step 13 后立即停审，不进入实现或测试执行。

## 2. Step 状态

| Step | 中间产物 | 状态 | 下一动作 |
|---:|---|---|---|
| 1 | `07_implementation_plan_step_01_input_boundary.md` | completed / pass_with_upstream_blockers | Step 2 已完成 |
| 2 | `07_implementation_plan_step_02_scope.md` | completed / pass_with_upstream_blockers | Step 3 已完成 |
| 3 | `07_implementation_plan_step_03_prerequisites_reading.md` | completed / pass_with_upstream_blockers | Step 4 已完成 |
| 4 | `07_implementation_plan_step_04_objects_deliverables.md` | completed / pass_with_upstream_blockers | Step 5 已完成 |
| 5 | `07_implementation_plan_step_05_phases_dependencies.md` | completed / pass_with_upstream_blockers | Step 6 已完成 |
| 6 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | completed / pass_with_upstream_blockers | Step 7 已完成 |
| 7 | `07_implementation_plan_step_07_test_acceptance_gates.md` | completed / pass_with_upstream_blockers | Step 8 已完成 |
| 8 | `07_implementation_plan_step_08_config_environment_dependencies.md` | completed / pass_with_upstream_blockers | Step 9 已完成 |
| 9 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | completed / pass_with_upstream_blockers | Step 10 已完成 |
| 10 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | completed / pass_with_upstream_blockers | Step 11 已完成 |
| 11 | `07_implementation_plan_step_11_commit_review_delivery.md` | completed / pass_with_upstream_blockers | Step 12 已完成 |
| 12 | `07_implementation_plan_step_12_completion_criteria.md` | completed / pass_with_upstream_blockers | Step 13 已完成 |
| 13 | `07_implementation_plan_step_13_formal_document_assembly.md` | completed / stop_review | 停审 |

### 终审补正后的装配状态

| 项 | 结论 |
|---|---|
| 正式文档版本 | v1.0.2 |
| 规范结构补正 | §2 范围矩阵、§3 记忆种子/读取目的/环境检查、§6 PH-01~PH-08 独立任务批次提交小节、§7 报告审查矩阵 |
| 引用修正 | `commit-08-c` boundary 的 `03` Required Reads 章节已修正 |
| implementation facts | 仍为 not_started / none；没有新增实现、测试或证据事实 |
| next_allowed_action | stop_review |

### 2.1 Step 输入、输出、门禁与下一动作矩阵

| Step | 输入摘要 | 输出摘要 | 门禁 | 下一动作 |
|---:|---|---|---|---|
| 1 | 正式 00~06、规范、目标仓检查 | 输入基线、缺口分类 | 输入完整或 blocker 已显式登记 | Step 2 scope |
| 2 | Step 1、00/03/06 分母 | P0/P1/P2 范围、非范围 | 范围可追溯且无隐式扩张 | Step 3 prerequisites |
| 3 | 规范、目录、依赖、阶段输入 | 阅读清单、矩阵、记忆种子、台账入口 | 工程身份与读取顺序明确 | Step 4 objects |
| 4 | 03 对象/模块/协议、05/06 交付面 | 实施对象、交付物、非交付物 | 每项有 owner 与 future 判定 | Step 5 phases |
| 5 | Step 4、模块/状态/测试依赖 | 8 Phase DAG、增量说明、停审记录 | 无 successor 泄漏、每 phase 有 gate | Step 6 tasks |
| 6 | Step 5、03/05/06、提交规范 | 24 boundary、72 task/batch、24 Gate | 一句话增量、独立 review/回退、经验复核 | Step 7 gates |
| 7 | Step 5/6、05/06 | suite、phase/boundary Gate、证据规则 | 每 boundary 有测试、AC/VF、失败姿态 | Step 8 config |
| 8 | 01/03/04/05、依赖矩阵 | profile、外部依赖、fake/disabled 边界 | compile/runtime/event/ref/adapter/fake 分类清楚 | Step 9 risks |
| 9 | Step 1/5/8、风险输入 | Spike、风险、OQ、截止点 | blocker 有 owner 与回写目标 | Step 10 change control |
| 10 | Step 6/7/8/9 | pause、rollback、change、recovery 规则 | 失败证据保留、恢复需新 baseline/run | Step 11 commit |
| 11 | Step 6/7、commit/代码规范 | message、review、Commit/Handoff Gate | design/implementation 语言与 scope 分离 | Step 12 completion |
| 12 | Step 2/4/7/9、06 放行规则 | 完成 predicate、未完成处理、证据清单 | 不宣称实现/验收完成 | Step 13 assembly |
| 13 | Step 1~12、规范、项目台账 | 正式 07、implementation ledger、24 skeleton | 13 章、identity、污染和事实边界审计 | stop_review |

## 3. 固定实施分母

| 分母 | 数量 | 来源 / 约束 |
|---|---:|---|
| workspace 模块 | 7 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` |
| 业务对象 | 29 | 正式 `03` §6.1；不把 DTO、support value、availability marker 另计 |
| Command | 10 | 正式 `03` §7.2 |
| Query | 6 | 正式 `03` §7.3；严格 no-write |
| Inbound Consumer | 5 | 正式 `03` §7.4 |
| outbound material helper | 1 | `HostFactMaterialEventCandidate`；仅 immutable、body-free candidate |
| Operations Job | 7 | 正式 `03` §7.5；Job 不创建授权 / truth |
| 验收项 | 39 AC + 9 VF | 正式 `06`；当前只规划，不执行 |
| 固定证据实例 | 14 `EV-MS-*-001` | 正式 `05` §13.2 / 正式 `06` §10.2；未来由真实 run 产生 |
| Phase / boundary / Gate | 8 / 24 / 24 | 本轮实施计划固定身份 |
| task / batch | 72 / 72 | 每 boundary 三个 task 与三个 batch |

## 4. 八阶段与边界身份

| Phase | 功能增量 | Boundary |
|---|---|---|
| PH-01 Foundation | workspace、config、Port、fake、脚本与证据壳 | `commit-01-a`、`commit-01-b`、`commit-01-c` |
| PH-02 Control / Qualification | intent、decision、qualification、assembly、readiness、UoW | `commit-02-a`、`commit-02-b`、`commit-02-c` |
| PH-03 Host / Registration / Session | host、generation、action attempt、registration、endpoint、session | `commit-03-a`、`commit-03-b`、`commit-03-c` |
| PH-04 Health / Recovery | signal、assessment、failure、recovery 与 adapter 编排 | `commit-04-a`、`commit-04-b`、`commit-04-c` |
| PH-05 Closure / Reconciliation | closure、cleanup、residual、reconciliation、bounded maintenance | `commit-05-a`、`commit-05-b`、`commit-05-c` |
| PH-06 Material / Projection / Query | material、history、outbox、handoff、projection、query | `commit-06-a`、`commit-06-b`、`commit-06-c` |
| PH-07 Consumer / Publisher / Jobs | consumer、publisher、feedback、7 jobs、entry wiring | `commit-07-a`、`commit-07-b`、`commit-07-c` |
| PH-08 Evidence / Release Handoff | fixture、gate、report、evidence、release smoke、handoff | `commit-08-a`、`commit-08-b`、`commit-08-c` |

## 5. 全局 blocker 与事实边界

| ID | 状态 | 影响 | 未闭合前姿态 |
|---|---|---|---|
| `MSVC-UP-001~008` | pending / blocked / waiting | Runtime、Member、Images、Sandbox、Core/Bus、SDK exact contract | placeholder、typed ref、disabled、unknown、fail-closed；不得伪造 ready |
| `MSVC-STORE-001` | waiting | durable store、broker、DLQ、diagnostic product | Port + fake；不声明真实 rollback / delivery |
| `MSVC-OBS-001` | waiting | observability backend、SLO、sampling、retention | body-free marker；不写 backend truth |
| `MSVC-MAPPER-001` | pending | sibling mapper 与双锚 / scope / feedback mapping | safe summary / blocked mapper |
| `MSVC-IMPL-001` | blocked | 目标实现仓不存在 | `commit-01-a` `blocked / wait_design`；不创建源码 |

所有阶段都必须保持 control plane、Host Truth、runtime session、execution handoff 分层；`submitted / delivered / observed / accepted` 不互推；Query no-write；Job no-truth-repair。实现仓不存在不解除设计计划的编制权限，但阻断实现移交。

## 6. 文件索引与装配结果

| 产物 | 状态 |
|---|---|
| 13 个 Step 文件 | 全部存在，均含 SOP 回答、诊断、对比、取舍、结构化产物、回填草稿、待确认事项和下一步条件 |
| 正式 `07-实施计划.md` | 已装配 13 章，章节均标注具体 calibration 来源 |
| `implementation_execution_ledger.md` | 已创建；`not_started`、`current_boundary=commit-01-a`、`blocked` |
| `implementation-boundaries/commit-01-a..08-c.md` | 24 个 planned skeleton；仅 `commit-01-a` 当前且 blocked，其余 `planned / wait_until_current` |
| 实现 / 测试 / 证据 | 未开始、未执行、未生成 |

## 7. 最终停审结论

- Step 1~13 已按串行顺序完成。
- 07 只定义未来实施路径，不宣称目标仓、源码、编译、测试、artifact、report、evidence、verdict、signoff 或 readiness。
- 所有未闭合跨项目合同继续记录为 pending / blocked / waiting；不把并行兄弟项目尚未停审内容当成正式真相。
- 完成 07 后停审；下一步只能在用户另行授权且实现前置 blocker 关闭后进入 implementation handoff。
