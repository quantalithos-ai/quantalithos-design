# L1-workspace 00 需求文档全量重启校准流程

> 创建日期：2026-09-07  
> 当前模式：`full-restart`  
> 正式文档目标：`projects/L1-workspace/00-需求文档.md`  
> 项目级台账：`design-calibration/project_execution_ledger.md`  
> 讨论输入：`draft/01_项目作用与交互对象.md`、`draft/02_功能推演.md`、`draft/03_模块划分与分层.md`；草稿不是正式真相源。  
> 当前范围：按用户授权完成 Step 1~17，正式 00 完成后停审。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 正式文档装配 | formal-document-assembly | `pass_with_upstream_blockers / stop_review` | 16 个需求章节均已由对应 Step 产物装配；上游契约 blocker 继续开放。 | 等待用户确认进入 01；不得自动进入。 | `project_execution_ledger.md`; `00_req_step_01~17_*.md` |

## 2. 执行纪律

- 每个需求 Step 独立生成中间产物，包含问题回答、诊断、取舍、结构化产物、回填草稿、自检和门禁。
- 正式 00 只承载收口结论；过程、历史污染审计和待确认项留在 Step 文件。
- 需求阶段不锁 API path、DTO、数据库、repository、handler、事务、代码目录、具体 transport 或实现状态机。
- `compile / runtime / event / ref / adapter / fake` 必须分开；只有 compile 可成为 package/path dependency。
- `pending / blocker` 不得改写成 ready、integrated、tested 或 signoff。

## 3. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | 完成门禁 |
|---:|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | 来源、承接主题、收束说明分清，不提前写边界/能力。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | 明确 workspace 是视图/局部状态 owner，不是 L1 truth owner。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | 只写跨域视图问题，不把方案伪装成问题。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | 目标可判断，非目标有 owner/理由。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | 人类、系统、维护和审计角色分清，不授予授权裁决。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass_with_blockers | 依赖裁剪表、类型分类表、禁止依赖表和图完整。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done | pass_with_blockers | 能力节点、进入/退出条件、外围和边界外能力明确。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done | pass | 故事回指能力节点，无 UI/实现孤儿故事。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done | pass_with_blockers | 只写外部可见能力，按能力节点有输入/输出/失败边界。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界 | done | pass_with_blockers | no-write、owner truth、visibility、cursor 和降级规则闭合。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与数据归属 | done | pass_with_blockers | truth/snapshot/ref/forbidden body 分层。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done | pass_with_blockers | 只写能力级 query/change/event/background/reference 边界。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done | pass_with_blockers | 六类 NFR 均可判断，未伪造数字 baseline。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done | pass_with_blockers | 能力、功能、规则、数据、接口、NFR 和 veto 均覆盖。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认事项 | done | pass_with_blockers | WS-UP-001~008 影响和上限真实记录。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done | pass | 功能为主轴，无孤儿项或跨域串线。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 正式文档装配 | done_stop_review | pass_with_upstream_blockers | 正式 00 16 章来源完整、静态审计通过、立即停审。 |

## 4. 未来文档门禁

```text
formal_00 = complete_stop_review
next_formal_document = 01-架构设计.md
next_formal_document_allowed = false
future_calibration_files_allowed = false
commit_required = false
```
