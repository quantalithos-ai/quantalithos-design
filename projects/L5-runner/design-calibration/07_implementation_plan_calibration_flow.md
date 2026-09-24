# L5-runner 07 实施计划校准流程

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/实施计划书写规范.md`
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md`
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md`
> 目标正式文档：`projects/L5-runner/07-实施计划.md`

## 1. 工作方式与事实边界

- 本流程采用 `full-restart + single-agent-serial`，严格按 `Step 1 → Step 2 → … → Step 13` 推进。
- 当前 agent 独立完成本仓工作；不创建、调用、委派或启动 sub-agent、worker、team 或并行代理。
- 本轮只修改 `projects/L5-runner/` 下的 07 正式文档、07 calibration 中间产物和项目级设计台账。
- 正式 `07-实施计划.md` 只在 Step 13 full-restart 装配；Step 1～12 不修改或预创建正式 07。
- 未来 Step 文件只能在该 Step 开始时创建；本轮不批量预生成 Step 2～13 文件。
- 不实现代码，不创建目标实现仓，不运行项目测试，不生成真实 baseline、implementation commit、run_id、artifact、report、evidence、verdict、signoff 或 readiness，不提交 commit。
- `07` 负责把已收稳的设计转译为 phase / commit boundary / gate / handoff 计划；不能替代 00～06 补需求、对象、DTO、状态、外部 owner truth 或技术选型。
- 目标实现仓不存在、技术栈和物理布局未获 authority、上游正向 seam 未闭合时，只能形成计划性 `blocked / waiting / deferred` 结论，不得伪造可执行事实。

## 2. 权威顺序与输入上限

正式文档优先于 calibration；正式文档不清楚时读取对应 calibration；两者仍冲突时暂停并回写拥有该真相源的文档。README、draft 和旧正式文档只用于历史污染/冲突扫描。

| 输入层 | 本仓输入 | 使用上限 |
|---|---|---|
| 需求 | `00-需求文档.md` 及其 00 Step | 只承接范围、FR/BR/NFR、AC、owner 与禁止行为，不新增需求 |
| 架构 | `01-架构设计.md` 及其 01 Step | 只承接边界、依赖类型、truth ownership、技术中立和红线，不替外部仓选技术 |
| 概要 | `02-概要设计.md` 及其 02 Step | 只承接组成部分、对象/协议/flow/state 轮廓，不替代 03 字段真相 |
| 详细 | `03-详细设计.md`、03 Step 5～19 | 作为模块、对象、port、protocol、flow、state、UoW、错误、幂等、配置、观测和 test-cut 的直接来源；物理布局仍受 blocker 限制 |
| 配置 | `04-配置设计.md`、04 Step 1～15 | 承接 41 项、四 profile、strict source、builder/readiness、failure/rollback；不把 profile 当环境或 readiness |
| 测试 | `05-测试方案.md`、05 Step 1～15 | 承接 18 CUT、108 planned TC、12 suite、18 slot、T0～T4、证据路径和缺陷/回归规则；planned 不等 executed/pass |
| 验收 | `06-验收标准.md`、06 Step 1～15 | 承接 AC、AR、TX、NFA、VETO、fixed-run 和裁决语义；不生成实际 verdict/signoff/readiness |
| 专项上游 | `L0-sdk`、`L1-artifact`、`L1-work`、`L1-governance`、`L1-workspace`、`L2-runtime`、`L4-sandbox`、`L4-observability`、`L4-archive` 当前正式文档与必要项目台账 | 只核对 Runner-facing seam、依赖类型和 blocker；未闭合处不得猜 DTO/API/transport |
| 标准 | 实施计划 SOP、书写规范、中间产物规范、可落码标准、全局依赖规则、代码实施台账规范 | 作为本流程和门禁 authority，不被项目计划重定义 |

## 3. Step 总计划

| Step | 主题 | 中间产物文件（按到达时创建） | 正式回填章节 | 状态 |
|---:|---|---|---|---|
| 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | §1 | `[x]` 当前完成 |
| 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | §2 | `[x]` 当前完成 |
| 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | §3 | `[x]` 已完成 |
| 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_deliverables.md` | §4 | `[x]` 已完成并自审通过 |
| 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | §5 | `[x]` 已完成并自审通过，进入 Step 6 |
| 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | §6 | `[x]` 已完成并自审通过，进入 Step 7 |
| 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | §7 | `[x]` 已完成并自审通过，进入 Step 8 |
| 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | §8 | `[x]` 已完成并自审通过，进入 Step 9 |
| 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | §9 | `[x]` 已完成并自审通过，进入 Step 10 |
| 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_change_control.md` | §10 | `[x]` 已完成并自审通过，进入 Step 11 |
| 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | §11 | `[x]` 已完成并自审通过，进入 Step 12 |
| 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | §12 | `[x]` 已完成并自审通过，进入 Step 13 |
| 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | §1～§13 | `[x]` completed / formal_stop_review_required |

每个 Step 文件必须独立包含：Step 状态、本步输入、SOP 问题回答、当前文档诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项、进入下一步条件，以及 `gate_status`、`gate_reason`、`next_allowed_action`。

## 4. 实施台账与正式装配时序

| 产物 | 当前状态 | 创建时机 | 当前禁止事项 |
|---|---|---|---|
| `project_execution_ledger.md` | 已存在，随 Step 1 更新 | 07 开始前已创建 | 不记录实现 commit/run/evidence 事实 |
| `implementation_execution_ledger.md` | 已创建，计划级、blocked | Step 13 正式装配完成时 | 不得填写真实实现事实 |
| `implementation-boundaries/<boundary_id>.md` | 18 个已创建，全部 planned/blocked/waiting | Step 13 根据最终 Boundary Gate Matrix 预创建全部 planned skeleton | 不得标 pass、填写真实 commit/run/evidence |
| `07-实施计划.md` | 已装配，formal stop review required | Step 13 full-restart | 后续只允许用户确认后的移交讨论，不自动实现 |

Step 13 只有在项目级、文档级和 Step 级三层门禁同时满足时，才允许创建 implementation ledger 和全部 planned boundary skeleton；未来 boundary 必须保持 `planned / blocked / waiting`，当前唯一激活规则和 `Commit Gate / Handoff Gate` 必须来自已审查的正式 07。

## 5. 当前持续 blocker

| ID | 影响 | 在 07 中的安全处理 |
|---|---|---|
| `RUN-UP-001~008` | Artifact、Governance、Sandbox、Runtime、Observability、Archive、平台和 L0-sdk 的 Runner-facing positive seam 未闭合 | 规划阶段保留 semantic adapter / negative / blocked lane；不得写 exact DTO、endpoint、transport 或 positive success |
| `RUN-DDD-001` | `/home/aris/Projects/quantalithos-runner` 不存在 | 不创建、不伪造 manifest/source/baseline；Step 3/8/9 记录实现前置 blocker |
| `RUN-DDD-002` | 语言、runtime、GUI/CLI shell、process/packaging 未获 authority | 不写 package/crate/binary/file extension 或技术实现路径 |
| `RUN-DDD-003` | local state store/cache、locking、migration、atomicity/corruption 技术未定 | 只规划 required guarantees 和决策门禁，不锁 backend/path/schema |
| `RUN-OPS-001~002` | SLO/capacity/retention 与真实 integration/GRC 环境未闭合 | 不设无来源 hard threshold；将 T2～T4/production/release lane 标为 blocked/not_run |
| `RUN-DOC-003` | 正式 07、implementation ledger、planned boundary skeleton 的文件缺口已在 Step 13 关闭；实现事实仍未建立 | 保留 `resolved_for_file_creation; implementation still blocked`，等待用户确认移交与前置 authority |

## 6. 当前恢复点

```text
current_document = 07-实施计划.md
current_step = 13
current_module = formal_assembly_traceability_boundary_skeletons
gate_status = completed / pass / formal_stop_review_required
gate_reason = 正式 07 已按 13 章主链 full-restart 装配；章节来源、六 phase、18 boundary、12 GATE、18 CUT、108 planned TC、12 suite、18 slot、41 config、四 profile、AC/AR/TX/NFA/VETO 和事实边界已交叉审计。implementation ledger 与 18 个 planned boundary skeleton 已创建并保持 planned/blocked/waiting；真实实现、测试和验收仍未开始。
next_allowed_action = wait_user_confirmation_for_implementation_handoff
formal_07_write_allowed = completed_for_step_13_only
implementation_ledger_allowed = completed_for_step_13_only
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 7. 恢复顺序

继续本项目时必须按以下顺序读取，不得依靠对话记忆跳步：

1. `design-calibration/project_execution_ledger.md`
2. `design-calibration/07_implementation_plan_calibration_flow.md`
3. 当前已创建的 `07_implementation_plan_step_*.md`
4. 对应正式 `00`～`06` 和本 Step 引用的校准来源
5. 若进入 Step 13，再读取实施台账规范并执行三层写入前检查

当前 Step 文件：`design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`；Step 13 已完成，下一步等待用户确认是否进入实现移交讨论。
