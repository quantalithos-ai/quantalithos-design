# L2-member 00 需求文档全量重启校准流程

> 创建日期: 2026-08-20
> 状态: formal_00_complete_stop_review
> 当前模式: full-restart
> 正式文档目标: `projects/L2-member/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 讨论输入: `projects/L2-member/draft/01~03`(用户已确认,仍须逐 Step 独立复核)
> 本轮边界: 完成需求 Step 1~17 和正式 00 装配后停审,等待用户确认。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 正式文档装配 | formal_00_complete_stop_review | pass | 正式 00 已按修复后的 Step 1~16 重建为 16 章,完成来源、ID、表格、边界、历史污染与非伪造静态审计 | 等待用户评审;不得读取、创建或修改 current-restart `01` | `project_execution_ledger.md`;Step 1~17;正式 00 |

## 2. 执行纪律

- 一个 Step 一个文件;当前 Step 通过前不创建未来 Step 文件。
- 每个 Step 包含开工确认、Step 内计划、SOP 回答、诊断、取舍、结构化产物、回填草稿、自检与门禁。
- Step 7 固定能力节点;Step 8~14 按能力节点小循环并停审;Step 16 做跨能力审计。
- 旧 README 与旧正式链只在独立结论形成后做 historical material 差异审计。
- draft 预推演是讨论输入,不是免检结论;各 Step 必须独立回答后再对照 draft 复核差异。
- 正式 00 只在 Step 17 删除并重建;每章列具体 calibration source。
- 需求阶段不写 DTO、API path、repository、handler、事务、代码目录、IPC 载体或技术栈。
- pending / blocker 只能以 fail-closed、blocked、waiting 或 future seam 进入,不能改写为 readiness。

## 3. Step 总流程计划

| Step | 输出文件 | 主题 | 输入 | 状态 | gate_status | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | 全局规则;L2-runtime/L2-tools/L0/L1 正式链;ADR-0004/0005;sibling current material;draft 01;旧材料 | repaired_done | pass | authority / upstream / sibling-pending / historical / blocker 分层,准确反映 sibling 当前 Step,不重定义上游。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | Step 1;draft 01 §1~2 | repaired_done | pass | member facade truth 与 Runtime / member-service / bus / conversation / identity / work / governance owner 分开。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | Step 2 | repaired_done | pass | 问题不混入方案或旧指标,兄弟状态表述真实。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | Step 2~3;draft 02 §3 | repaired_done | pass | 目标可验证,非目标有 owner。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | Step 2、4 | repaired_done | pass | 人类与系统角色分开,不授予 authorization。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | Step 2、5;全局规则 §5/§6;ADR-0004;draft 01 §3~4 | repaired_done | pass | 三类依赖、禁止依赖与裁剪图完整;L1-work / sibling pending 不升格。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | Step 2、4、6;ADR-0004;sibling current boundary;draft 02 §1 | repaired_done | pass | 能力节点、主语、顺序、进入 / 退出条件完整并停审。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | Step 5、7 | repaired_done | pass | 项目型执行主语进入 C1 故事,非项目型场景保持 pending。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | Step 7、8;draft 02 §2 | repaired_done | pass | 执行主语、注册 ownership 与入站正文处理边界明确。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界 | Step 2、7、9 | repaired_done | pass | 规则保护能力且不滑入实现;正文读取 / 保存 / 投递边界不互相矛盾。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与归属 | Step 2、9、10 | repaired_done | pass | truth / snapshot / ref / forbidden-persistence 分层,不误写为禁止受控检查。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | Step 6、9、11 | repaired_done | pass | 能力边界不泄漏协议 / package 假设,member-service ownership 正确。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | Step 7、10~12 | repaired_done | pass | 六类逐项判断;网络边界表述不否定容器内 / 宿主正式 seam。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | Step 7、9~11、13 | repaired_done | pass | 每项可判断,注册 ownership / 正文边界 / execution subject 可验收。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认 | Step 1~14 未收稳项;`L2M-UP-001~008` | repaired_done | pass | pending / blocker 影响和约束真实反映 sibling current status。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | Step 7~15 | repaired_done | pass | 修订后孤儿项、重复和串仓归零。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 正式文档装配 | Step 1~16 | done_stop_review | pass | 16 章、16 个来源块和全链静态终检已通过;停审等待用户。 |

## 4. 当前门禁

```text
document_status = formal_00_complete_stop_review
current_step = 17
gate_status = pass
gate_reason = formal_00_rebuilt_from_repaired_steps_01_to_16_and_static_audit_passed
next_allowed_action = wait_for_user_review
formal_00_write_allowed = closed_after_assembly
next_formal_document = 01-架构设计.md
next_formal_document_allowed = false
future_step_files_allowed = false
commit_required = false
```
