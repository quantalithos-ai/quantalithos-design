# L2-member 07 实施计划校准工作台

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md`
>
> 正式目标：`projects/L2-member/07-实施计划.md`
>
> 书写规范：`standards/document/实施计划书写规范.md`
>
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md`
>
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_calibration_flow.md`。仅参考工作台、phase / boundary 和停审粒度；不继承 Governance 的领域、代码、测试、证据或实施结论。
>
> 创建日期：2026-09-04
>
> 执行模式：`full-restart + single-agent-serial`
>
> 事实边界：本工作台只把已完成的设计转译为未来实施路径；不表示实现仓、代码、构建、测试 run、artifact、report、evidence、verdict、signoff、readiness 或 commit 已存在。

## 1. 文档级恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13：整理正式实施计划文档已完成，停审 | `formal-document-assembly-and-planned-ledgers` | `completed / pass_with_upstream_and_design_blockers / stop_review` | 正式 07 已按 Step 1～12 装配；项目级 ledger 和 18 个 skeleton 已完成静态一致性审计并收紧为纯 planning posture。目标仓、dirty baseline、UP / DDD 与执行期事实仍保持显式 blocker。 | `wait_for_user_confirmation_before_implementation_authorization`；不得创建实现代码、运行测试或提交 commit。 |

## 2. 本轮目标与边界

本轮依次完成实施计划的 13 个讨论 Step，将 `L2-member` 当前工作区中的需求、架构、概要、详细设计、配置、测试和验收结论收敛为按可验证功能增量组织的 future phase、task、commit boundary、gate 和 handoff 规则。

```text
实施输入边界
  -> 实施目标 / 范围
  -> 前置条件 / 阅读
  -> 实施对象 / 交付物
  -> phase / 依赖
  -> task / batch / commit boundary
  -> 测试 / 验收门禁
  -> 配置 / 环境 / 外部依赖
  -> spike / 风险 / 待确认
  -> 回退 / 暂停 / 变更控制
  -> 提交 / 评审 / 交付纪律
  -> 完成判定
  -> 正式 07、planned ledger 与 planned skeleton 装配
```

本工作台不重新定义需求、架构、对象字段、DTO、Port、协议、状态、Store、物理产品、配置项、测试用例或验收结论。若后续 phase / boundary 无法回指既有真相源，必须回流 owning 设计 Step，而不是在 07 或实现端补洞。

## 3. Step 状态

| Step | 主题 | 中间产物 | 状态 | 正式回填位置 |
|---:|---|---|---|---|
| 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | `[x] completed / stop_review` | §1 |
| 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | `[x] completed / stop_review / continuation_authorized` | §2 |
| 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | `[x] completed / pass_with_explicit_blockers` | §3 |
| 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_objects_deliverables.md` | `[x] completed / pass_with_explicit_blockers` | §4 |
| 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | `[x] completed / pass_with_explicit_blockers` | §5 |
| 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | `[x] completed / pass_with_explicit_blockers` | §6 |
| 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | `[x] completed / pass_with_explicit_blockers` | §7 |
| 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | `[x] completed / pass_with_explicit_blockers` | §8 |
| 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | `[x] completed / pass_with_explicit_blockers` | §9 |
| 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | `[x] completed / pass_with_explicit_blockers` | §10 |
| 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | `[x] completed / pass_with_explicit_blockers` | §11 |
| 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | `[x] completed / pass_with_explicit_blockers` | §12 |
| 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | `[x] completed / pass_with_upstream_and_design_blockers / stop_review` | §1～§13、implementation ledgers |

## 4. 权威输入与历史隔离

| 输入层 | 当前材料 | 本轮用途 | 使用上限 |
|---|---|---|---|
| 项目正式输入 | `projects/L2-member/00-需求文档.md` 至 `06-验收标准.md` | 固定范围、owner、CP01～CP07、七模块、协议、状态、配置、测试和验收入口 | 当前工作区内容是 planning input，不是 immutable implementation baseline。 |
| 直接实施承接 | `03_ddd_step_17_implementation_handoff.md`、`03_ddd_step_19_formal_document_assembly.md` | 提供字段、Port、protocol、flow、state、Store、测试切口和设计缺口的回指入口 | 只作索引与 boundary 预复核输入，不复制 schema。 |
| 过程与落码标准 | 通则、中间产物、真相源闭环、全局依赖、07 SOP / 书写规范、实施台账规范 | 固定讨论顺序、依赖分类、事实等级、boundary gate 和 planned skeleton 规则 | 不产生项目业务或外部合同。 |
| 上游 / foundation | `L2-runtime`、`L2-tools`、`L0-core`、`L0-bus`、`L0-sdk`、`L1-*` 当前可引用材料 | 保持 Runtime / Tools / shared primitive / truth owner 边界 | 仅 `L0-core` 是 planned compile candidate；其余关系维持 runtime / event / ref / adapter / fake 分类。 |
| 并行 sibling | `L2-member-service`、`L2-member-images` 当前正式或明确可引用材料 | 保持 host 和 image supply owner 方向 | 不修改 sibling；exact seam 继续 pending。 |
| historical material | 旧 README、旧正式 `00/01/02/03/05/06` 与旧材料中的 CloudEvents、AG-UI、UDS、launch token 等 | 污染和差异审计 | 不可直接继承到实施计划、协议或 boundary。 |

## 5. 当前事实、blocker 与实施姿态

| 类别 | 当前事实 | 对 07 讨论 | 对实现 / qualification |
|---|---|---|---|
| 设计输入 | `00~06` 均存在；`04` 已补齐；`03` 提供七模块、34 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语的正式入口。 | 可继续拆实施路径。 | 每个 boundary 仍需复核其实际涉及的字段、factory、Port、state 与 test / acceptance gate。 |
| design baseline | Git `HEAD` 为 `3b4e1a1`，但 `projects/L2-member/` 有未提交和未跟踪的当前设计材料。 | 可作为当前讨论基线。 | 阻塞正式实现移交；不可把 dirty workspace 或 HEAD 单独写成 immutable baseline。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-member` 当前不存在。 | 不阻塞规划。 | `L2M-DDD-001` 阻塞任何代码、构建、测试和实现台账执行。 |
| local design gaps | `L2M-DDD-002~007` 与 `scope_supersede_gap` 仍开放。 | 可将受影响 lane 规划为 blocked / wait_design，而非补写设计。 | 阻塞相应 durable、Consumer receipt、CP04～CP07 helper / version、scope successor 的正向实现。 |
| external owner seams | `L2M-UP-001~008` 和 `L2M-UP-005` 下 24 个 semantic candidate 未闭合。 | 可规划 member-local / negative / blocked-aware lane。 | 阻塞 host、image、Runtime、Core / Bus、credential、screening 和非项目型正向 qualification；24 candidate 不得物化为 Event。 |
| 执行期事实 | 无实现 commit、固定 run、artifact / report pair、real evidence、verdict、signoff 或 readiness。 | 可定义未来 gate，不填结果。 | 阻塞任何通过、交付完成或 readiness 声明。 |
| workload / SLO authority | 尚未有产品工作负载、环境或阈值 authority。 | 可记录 spike / pending。 | 阻塞性能、容量和硬 SLO 结论。 |

## 6. 固定执行纪律

- 每个 Step 必须独立保存 SOP 问题回答、当前文档问题诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项和进入下一步条件。
- 正式 `07-实施计划.md` 只能在 Step 13 由 Step 1～12 的已完成中间产物装配；Step 1～12 不创建或局部改写正式 07。
- 实施 phase 必须是可验证功能增量，不能按对象、函数、文件或个人待办拆分；commit boundary 必须在 Step 6 单独设计、审计和停审。
- 所有未来 boundary 的可落码经验复核由设计者在 Step 6 / Step 12 完成；发现字段、DTO、state、Port、Store、evidence 或 phase boundary 缺口时，回写设计真相源，不能交给实现 agent 自行判断。
- `implementation_execution_ledger.md` 与 `implementation-boundaries/<boundary_id>.md` 只能在 Step 13、正式 07 的 Boundary Gate Matrix 已收稳后同时创建；当前不得预创建、不得把 planned 误写为 pass。
- 只修改 `projects/L2-member/` 下设计和校准材料；不创建实现仓、不写代码、不运行测试、不生成真实证据、不修改 sibling、不提交 commit。

## 7. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 1 中间产物 | 已完成 | 输入基线、历史隔离、闭环预判、blocker 分类和实施讨论许可已固定。 |
| Step 2 中间产物 | 已完成 | P0 member-local / fail-closed / blocked-aware scope、P1/P2 和 24 candidate 防误入口径已固定；本 Step 已停审。 |
| Step 3 | 已完成 | 已固定实现前阅读、baseline/target-repo/gate、ledger 和永久记忆规则；显式保留目标仓、外部合同和 DDD 缺口。 |
| Step 4 | 已完成 | 已抽取可追溯实施对象、交付物、非交付物及跨仓 delivery shape；所有 blocked delivery 保持显式。 |
| Step 5 | 已完成 | PH-01～PH-08 形成能力纵切 DAG；每 phase 的输入、输出、不包含、planned gate 与 AC/VF 关联已收稳。 |
| Step 6 | 已完成 | 18 个 boundary 的任务、batch、提交时机、不包含项、设计者复核和跨 boundary 审计已收稳；当前仍为 planned / blocked。 |
| Step 7 | 已完成 | phase / boundary 测试、验收、artifact/report、失败处理和审查责任已收稳；未生成任何执行期结果。 |
| Step 8 | 已完成 | 已固定唯一 Core compile candidate、所有其他协作依赖分类、P0 profile / fake 边界、phase / boundary 准备和不可用处理；不创建配置、目标仓或运行产物。 |
| Step 9 | 已完成 | 已固定 six planned Spike、风险 / blocker、待确认、回写触发和最迟点；不执行 Spike、不关闭 blocker。 |
| Step 10 | 已完成 | 已固定暂停、回退、变更、恢复和 gate failure 规则；当前无 implementation rollback 或恢复事实。 |
| Step 11 | 已完成 | 已固定 18 个 boundary 的 title / scope / body group、Commit / Handoff Gate、review、evidence handoff 与用户改动保护；设计期只保留 `planned / blocked / waiting` 姿态。 |
| Step 12 | 已完成 | 已固定 implementation-complete / conditional / not-complete / acceptance-pending口径、PH / boundary closure audit、evidence和residual处置；当前真实完成仍 blocked。 |
| Step 13 | 已完成 / 停审 | 已完成章节来源映射、正式 07 装配、项目级 ledger、18 个 boundary skeleton 与静态审计；保留所有上游 / 设计 blocker。 |
| 正式 `07-实施计划.md` | 已创建 / 停审 | 13 章正式实施合同已装配；当前实施状态仍 `not_started / implementation_incomplete`。 |
| implementation ledger / boundary skeleton | 已创建 / 停审 | 项目级 ledger 只有 `commit-01-a` current identity 且为 `blocked / wait_design`；其余 17 个为 `planned / waiting / wait_until_current`；18 个 skeleton 只保留 planning posture、activation condition与边界定义，无执行期字段。 |
| 实现活动 | 未开始 | `implementation_repo_write_allowed = false`。 |
| 下一步 | 停审，等待新的实现授权 | 不进入代码实现、测试执行、外部联调或 commit；若恢复，先读 project ledger、current boundary与正式 07。 |

## 8. 当前 machine-readable 恢复点

```text
current_document = 07-实施计划.md
current_step = Step_13_formal_document_assembly_completed_stop_review
current_module = formal-document-assembly-and-planned-ledgers
gate_status = completed / pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = wait_for_user_confirmation_before_implementation_authorization
formal_07_write_allowed = closed_after_assembly
implementation_repo_write_allowed = false
implementation_ledger_write_allowed = completed_design_period_skeleton_only
boundary_skeleton_write_allowed = completed_design_period_skeleton_only
test_execution_allowed = false
commit_required = false
```
