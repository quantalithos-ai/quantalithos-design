# L2-runtime 05 测试方案全量校准流程

> 重开日期：2026-08-17
> 当前模式：`full-restart + single-agent-serial`
> 正式目标：`projects/L2-runtime/05-测试方案.md`
> 适用 SOP：`standards/document/测试方案讨论流程_SOP.md`
> 适用规范：`standards/document/测试方案书写规范.md`

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|
| Step 15 | `formal_document_assembly` | `closed_stop_review` | 正式 05 已完成 15 章装配；177 TC/EV、8 suite、9 checks、12 blocker re-entry、14 open risks 终审通过 | 立即停审；等待用户明确授权 full-restart 06；当前不修改 06 |

## 2. 执行纪律

- 严格按 Step 1 -> Step 15 独立推进；不得跳步、合并 Step 或提前装配正式 05。
- 每个 Step 开始前先更新本 flow、项目执行台账并创建或重建对应 Step 产物。
- 旧正式 `05-测试方案.md`、旧 `05_test_plan_*`、现有 `06/07` 及相关台账只能作 historical/downstream 污染审计输入，不继承旧 TC/EV、suite、路径、状态或完成事实。
- 正式 `05-测试方案.md` 只允许在 Step 15 删除后重建；Step 1~14 仅形成中间产物与回填草稿。
- 测试方案只定义 planned test object/cut/case/data/environment/gate/report/evidence contract；不运行测试、不创建实现仓、不生成或伪造 run_id、artifact、report、evidence、coverage、verdict、signoff 或 readiness。
- 所有测试对象必须回指当前正式 `00~04`；不得在 05 新增字段、状态、Port、error、配置语义或外部 owner truth。
- compile/runtime/event/ref/adapter/fake 必须分列；fake 只证明有限 deterministic local semantics，不能关闭 external blocker 或证明 positive integration。
- 不提交 commit。

## 3. Step 总流程

| Step | 中间产物 | 主题 | 状态 |
|---:|---|---|---|
| 1 | `05_test_plan_step_01_input_boundary.md` | 测试输入边界 | `completed_continuous_authorized` |
| 2 | `05_test_plan_step_02_scope.md` | 测试目标、范围与非范围 | `completed_continuous_authorized` |
| 3 | `05_test_plan_step_03_test_objects_cuts.md` | 测试对象与切口 | `completed_continuous_authorized` |
| 4 | `05_test_plan_step_04_strategy_layers.md` | 测试策略与分层 | `completed_continuous_authorized` |
| 5 | `05_test_plan_step_05_traceability_coverage.md` | 需求追溯与覆盖 | `completed_continuous_authorized` |
| 6 | `05_test_plan_step_06_cases.md` + annexes | 测试场景与用例 | `completed_continuous_authorized` |
| 7 | `05_test_plan_step_07_test_data.md` | 测试数据 | `completed_continuous_authorized` |
| 8 | `05_test_plan_step_08_environment_config.md` | 测试环境与配置 | `completed_continuous_authorized` |
| 9 | `05_test_plan_step_09_automation_gates.md` | 自动化与门禁 | `completed_continuous_authorized` |
| 10 | `05_test_plan_step_10_nonfunctional.md` | 专项与非功能测试 | `completed_continuous_authorized` |
| 11 | `05_test_plan_step_11_defects_retest.md` | 缺陷与复验 | `completed_continuous_authorized` |
| 12 | `05_test_plan_step_12_entry_exit.md` | 进入与退出准则 | `completed_continuous_authorized` |
| 13 | `05_test_plan_step_13_evidence.md` + registry annex | 报告与证据归档 | `completed_continuous_authorized` |
| 14 | `05_test_plan_step_14_regression_risks.md` | 回归与残余风险 | `completed_continuous_authorized` |
| 15 | `05_test_plan_step_15_formal_document_assembly.md` | 正式文档装配 | `closed_stop_review` |

## 4. 持续 blocker

`L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` 从正式 00~04 原样传递。它们不阻塞 local deterministic、negative、blocked-aware 测试方案设计，但阻塞真实 positive integration、实际测试运行、artifact/report/evidence 和 readiness。`L2R-LANG-001` 单列为 implementation preflight，不并入上述 11 项；Rust 2024/1.93 仍是 planned baseline，toolchain 和具体运行产品未验证。

## 5. 当前门禁

```text
current_document = 05-测试方案.md
current_step = Step 15
current_module = formal_document_assembly
gate_status = closed_stop_review
gate_reason = formal_05_rebuilt_and_final_audit_passed
next_allowed_action = stop_review_wait_explicit_user_authorization_for_06
formal_05_write_allowed = false_after_close_except_authorized_reopen
future_step_files_allowed = none
next_step = none_until_user_explicitly_authorizes_06
next_step_allowed = false
next_formal_document = 06-验收标准.md
next_formal_document_allowed = false_until_explicit_user_confirmation
commit_required = false
```
