# L2-runtime 00 需求文档全量重启校准流程

> 创建日期: 2026-08-07
> 状态: completed_user_confirmed
> 当前模式: full-restart
> 正式文档目标: `projects/L2-runtime/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮边界: 完成需求 Step 1~17 和正式 00 装配后停审。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 正式文档装配 | `formal_00_user_confirmed` | `pass` | 正式 00 已完成装配和后置审计,用户已以“继续”确认进入架构链。 | 作为正式 `01-架构设计.md` 的需求基线;不得回写旧 00 口径。 | `00_req_step_17_formal_document_assembly.md`;`../00-需求文档.md`;`01_architecture_calibration_flow.md` |

## 2. 执行纪律

- 一个 Step 一个文件;当前 Step 通过前不创建未来 Step 文件。
- 每个 Step 包含开工确认、Step 内计划、SOP 回答、诊断、取舍、结构化产物、回填草稿、自检与门禁。
- Step 7 固定能力节点;Step 8~14 按能力节点小循环并停审;Step 16 做跨能力审计。
- 旧 README 与旧正式链只在独立结论形成后做 historical material 审计。
- 正式 00 只在 Step 17 删除并重建;每章列具体 calibration source。
- 需求阶段不写 DTO、API path、repository、handler、事务、代码目录或 provider/backend 实现。
- pending / blocker 只能以 fail-closed、blocked、waiting 或 future seam 进入,不能改写为 readiness。

## 3. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | 已完成。 | authority / upstream / historical / blocker 分层,不重定义上游。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | 已完成。 | Runtime truth 与相邻 owner 分开。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | 已完成。 | 问题不混入方案或旧指标。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | 已完成。 | 目标可验证,非目标有 owner。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | 已完成。 | 人类与系统角色分开。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass | 已完成。 | 三类依赖与禁止依赖完整。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done_stop_review | pass | 已完成。 | 能力节点、顺序、进入 / 退出条件完整。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done_stop_review | pass | 已完成。 | 按能力节点收敛,无孤儿故事。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done_stop_review | pass | 已完成。 | 外部可见能力回指故事与节点。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界 | done_stop_review | pass | 已完成。 | 规则保护能力且不滑入实现。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与归属 | done_stop_review | pass | 已完成。 | truth / snapshot / ref / forbidden body 分层。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done_stop_review | pass | 已完成。 | 能力边界不泄漏协议 / package 假设。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done_stop_review | pass | 已完成。 | 六类逐项判断,无伪 SLA。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done_stop_review | pass | 已完成。 | 每项可判断且无伪结果。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认 | done_stop_review | pass | 已完成。 | pending / blocker 影响和约束明确。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done_stop_review | pass | 已完成,进入 Step 17。 | 孤儿项、重复和串仓归零。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 正式文档装配 | completed_user_confirmed | pass | 已进入正式 01 架构校准。 | 16 章、来源块和全链审计通过;用户已确认文档切换。 |

## 4. 当前门禁

```text
document_status = completed_user_confirmed
current_step = 17
gate_status = pass
gate_reason = formal_00_complete_and_user_confirmed
next_allowed_action = use_as_01_architecture_requirement_baseline
formal_00_write_allowed = false
future_step_files_allowed = false_for_00_document
```
