# L5-sync 00 需求文档校准流程

> 模式：`full-restart / single-agent / serial Step 1→17`
> 正式文档：`projects/L5-sync/00-需求文档.md`
> 当前范围：完成正式 `00` 后立即停审，不进入 `01`。
> 旧 README、旧正式 00/01/02/03/05/06 与旧 draft 只作 `historical_material` / 污染审计输入。

## 状态总览

| Step | 名称 | 输出文件 | 状态 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | `00_req_step_01_upstream_relationship.md` | done | pass | 进入 Step 2 |
| 2 | 本仓定位与边界 | `00_req_step_02_scope_boundary.md` | done | pass | 进入 Step 3 |
| 3 | 背景与问题定义 | `00_req_step_03_problem_context.md` | done | pass | 进入 Step 4 |
| 4 | 目标与非目标 | `00_req_step_04_goals_non_goals.md` | done | pass | 进入 Step 5 |
| 5 | 用户与角色 | `00_req_step_05_users_roles.md` | done | pass | 进入 Step 6 |
| 6 | 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` | done | pass_with_blockers | 进入 Step 7；保留 SYNC-UP-001~010 |
| 7 | 核心能力闭环 | `00_req_step_07_core_capability_loop.md` | done | pass_with_blockers | 进入 Step 8；按 CP-SYNC-01~06 小循环 |
| 8 | 用户故事 | `00_req_step_08_user_stories.md` | done | pass_with_blockers | 进入 Step 9 |
| 9 | 功能需求 | `00_req_step_09_functional_requirements.md` | done | pass_with_blockers | 进入 Step 10 |
| 10 | 业务规则与边界约束 | `00_req_step_10_business_rules.md` | done | pass_with_blockers | 进入 Step 11 |
| 11 | 数据需求与数据归属 | `00_req_step_11_data_ownership.md` | done | pass_with_blockers | 进入 Step 12 |
| 12 | 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` | done | pass_with_blockers | 进入 Step 13 |
| 13 | 非功能需求 | `00_req_step_13_nonfunctional.md` | done | pass_with_blockers | 进入 Step 14；保留 SYNC-UP-001~010 |
| 14 | 验收标准 | `00_req_step_14_acceptance.md` | done | pass_with_blockers | 进入 Step 15；保留 SYNC-UP-001~010 |
| 15 | 风险与待确认 | `00_req_step_15_risks_open_questions.md` | done | pass_with_blockers | 进入 Step 16；SYNC-UP-001~010 保持开放 |
| 16 | 需求追溯矩阵 | `00_req_step_16_traceability.md` | done | pass_with_blockers | 进入 Step 17；功能主轴无孤儿项 |
| 17 | 正式文档装配 | `00_req_step_17_formal_assembly.md` | done | stop_review | 正式 00 已重建；等待用户审查和明确授权进入 01 |

## 总流程纪律

每个 Step 独立执行：`问题回答 → 历史污染诊断 → 取舍 → 结构化产物 → 回填草稿 → 自检 → 更新台账`。未来 Step 文件只在进入该 Step 时创建。Step 8~14 必须围绕 Step 7 的能力节点逐个收敛并停审；不得用一次性总表替代能力级小循环。

## 写入与真实性门禁

- Step 1~16 全部通过前，`formal_00_write_allowed=false`。
- 正式 00 必须先删除旧文件再按 16 章 full-restart 新建。
- 上游未闭合合同只能标为 `pending/blocked`；fake、fixture、ACK、cache、日志不能关闭 blocker。
- 不生成实现、commit、run、test result、artifact、report、evidence、verdict、signoff 或 readiness 事实。
- Step 17 完成后转为 `formal_stop_review`，不读取或推进 01 SOP。

## 当前恢复点

```text
current_document = 00-需求文档.md
current_step = 17
current_module = formal_assembly
gate_status = formal_stop_review
next_allowed_action = wait_for_user_review_and_explicit_01_authorization
formal_00_write_allowed = completed
formal_01_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
