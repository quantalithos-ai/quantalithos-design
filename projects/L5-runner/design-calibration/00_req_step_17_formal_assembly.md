# 00 需求 Step 17 · 正式文档装配

> 状态：`completed / formal_stop_review`
> 前置：`00_req_step_01_upstream_relationship.md`～`00_req_step_16_traceability.md`
> 输出：正式 `projects/L5-runner/00-需求文档.md`

## 1. 装配规则

正式文档按需求书写规范的 16 个章节从已通过门禁的 Step 结论汇总。每个章节正文前标注对应校准来源和延伸阅读；推理、历史差异、风险处理和门禁证据留在 `design-calibration`。本次按 full-restart 删除旧正式 `00` 后重建，不继承旧技术选型、数字或对象语义。

## 2. 章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `00_req_step_01_upstream_relationship.md` |
| §2 本仓定位与边界 | `00_req_step_02_scope_boundary.md` |
| §3 背景与问题定义 | `00_req_step_03_problem_context.md` |
| §4 目标与非目标 | `00_req_step_04_goals_non_goals.md` |
| §5 用户与角色 | `00_req_step_05_users_roles.md` |
| §6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` |
| §7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` |
| §8 用户故事 | `00_req_step_08_user_stories.md` |
| §9 功能需求 | `00_req_step_09_functional_requirements.md` |
| §10 业务规则与边界约束 | `00_req_step_10_business_rules.md` |
| §11 数据需求与数据归属 | `00_req_step_11_data_ownership.md` |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `00_req_step_13_nonfunctional.md` |
| §14 验收标准 | `00_req_step_14_acceptance.md` |
| §15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `00_req_step_16_traceability.md` |

## 3. 装配检查

- [x] 旧正式 `00` 已从 full-restart 目标中移除并以新结构重建。
- [x] 16 个规范章节均有校准来源和延伸阅读入口。
- [x] 五个能力节点、15 个用户故事、16 个功能需求、25 条规则和 11 条验收标准可互相追溯。
- [x] 八项上游 blocker 保持 `pending/blocked`。
- [x] 未创建实现 ledger、boundary skeleton、代码、测试或任何伪造运行事实。
- [x] 装配后执行 Markdown、来源路径、历史污染、范围和 `git diff --check` 静态审计。

## 4. 停审门禁

正式 `00` 完成后，项目状态切换为 `formal_stop_review`。下一步只允许等待用户审阅并明确授权正式 `01`；不得读取或推进 `01` SOP，不创建 `01~07` calibration flow，不实现代码，不执行测试，不提交 commit。
