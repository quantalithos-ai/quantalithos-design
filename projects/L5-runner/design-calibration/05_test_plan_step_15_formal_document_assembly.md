# Step 15. 正式测试方案装配

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15  
> 目标：full-restart 重建 `projects/L5-runner/05-测试方案.md`  
> 当前状态：`completed / pass / self_reviewed`
> 终态门禁：`formal_stop_review_required`

## 1. 写入前门禁

| 门禁 | 检查结果 |
|---|---|
| 项目级 | `project_execution_ledger.md` 当前为 Step 14 / `pass_for_step_15`，用户已授权完成全部 05。 |
| 文档级 | `05_test_plan_calibration_flow.md` Step 1～14 均 completed/pass，Step 15 可开始。 |
| Step 级 | Step 1～14 均有结构化产物、回填草稿、风险/blocker 和进入下一步条件；Step 6 残留状态已最小修正。 |
| full-restart | 旧正式 05 仅作 historical material；本 Step 删除后从 calibration 重新装配。 |
| 写入范围 | 只写 `projects/L5-runner/05-测试方案.md`、本 Step、flow 和项目台账。 |
| 禁止项 | 不创建代码、测试、script、fixture、artifact、report、evidence、implementation ledger/skeleton；不运行测试、不提交。 |

## 2. 装配输入与章节映射

| 正式章节 | 唯一主要 calibration 输入 |
|---:|---|
| 1 | `05_test_plan_step_01_input_boundary.md` |
| 2 | `05_test_plan_step_02_scope.md` |
| 3 | `05_test_plan_step_03_test_objects_cuts.md` |
| 4 | `05_test_plan_step_04_strategy_layers.md` |
| 5 | `05_test_plan_step_05_traceability_coverage.md` |
| 6 | `05_test_plan_step_06_cases.md` |
| 7 | `05_test_plan_step_07_test_data.md` |
| 8 | `05_test_plan_step_08_environment_config.md` |
| 9 | `05_test_plan_step_09_automation_gates.md` |
| 10 | `05_test_plan_step_10_nonfunctional.md` |
| 11 | `05_test_plan_step_11_defects_retest.md` |
| 12 | `05_test_plan_step_12_entry_exit.md` |
| 13 | `05_test_plan_step_13_evidence.md` |
| 14 | `05_test_plan_step_14_regression_risks.md` |
| 15 | 本 Step + standards/upstream references |

## 3. 装配批次

| 批次 | 章节 | 状态 |
|---|---|---|
| A | 元信息、§1～§3 | completed |
| B | §4～§6 | completed |
| C | §7～§9 | completed |
| D | §10～§12 | completed |
| E | §13～§15、装配状态 | completed |
| F | 字段/状态/命名/证据/blocker/旧材料污染最终审计 | completed / pass |

## 4. 正式文档必须保留的事实边界

- 18 个 P0 测试切口、108 个计划 TC、12 个 planned suite、18 个 planned evidence slot 均是测试设计合同。
- 当前目标实现仓、test runner、CI、script、fixture、artifact、report、evidence 和真实 run 均不存在或未执行。
- `RUN-UP-001~008`、`RUN-DDD-001~003`、`RUN-DOC-002~003`、`RUN-OPS-001~002` 持续开放；Step 15 只关闭“新版正式 05 缺失”这一部分。
- semantic fake/controlled negative 不能升级为真实 integration/product/release evidence。
- 正式 05 完成后必须停审；不得进入 06，除非用户明确确认。

## 5. 完成门禁

- [x] 正式文档严格使用 15 章主链，每章标注具体 calibration 来源。
- [x] 所有 P0 范围、切口、TC、数据、环境、suite、专项、缺陷、准则、证据和回归完整。
- [x] 用例与断言只使用新版 03/04 正式对象、协议、状态、错误和边界。
- [x] 旧 `RunnerRun/RunQueueEntry/Trigger*`、Tauri/Docker/gVisor/Firecracker、旧数字和旧证据路径未污染正文。
- [x] 证据使用 planned slot 与 runtime generation 边界；无静态 EV、`latest` 或伪结果。
- [x] `git diff --check -- projects/L5-runner` 通过，并完成正式章节/链接/编号/状态审计。
- [x] flow/ledger 同步为 `formal_stop_review_required`，下一动作仅允许用户 review/确认是否进入 06。

## 6. 最终审计记录

| 审计项 | 结果 | 结论 |
|---|---:|---|
| 正式章节 | 15 | §1～§15 连续且无额外编号章节。 |
| calibration 来源 / 延伸阅读入口 | 15 / 15 | 每章均有唯一主要 Step 输入和继续阅读入口。 |
| P0 CUT | 18 | 覆盖 context、material、request、control、owner projection、resource、recovery、preview、Query、contract、idempotency、UoW、entry、Consumer、Job、config、observability 与 boundary。 |
| planned TC | 108 | 18 个 family；逐项 TC ID 唯一，重复 ID 为 0。 |
| planned suite | 12 | `S-RUN-CONTRACT` 至 `S-RUN-E2E` 均为计划合同，唯一 ID 为 12。 |
| planned evidence slot | 18 | `ESLOT-RUN-001~018` 唯一；多 AC 引用均展开为独立正式 ID。 |
| Markdown 结构 | pass | code fence 成对；`git diff --check -- projects/L5-runner` 无输出。 |
| 旧对象/操作污染 | pass | 正式 05 中 `RunnerRun`、`RunQueueEntry`、`TriggerRetry/Replay/Kill` 均为 0 命中。 |
| 旧证据/阈值污染 | pass | `EV-CAND-*`、`<200ms`、`<1s`、`99.9%`、`100%` 均为 0 命中。 |
| 历史技术选择 | pass | Docker、Tauri、gVisor、Firecracker 仅用于“不继承/不锁定”声明，不形成正向技术合同。 |
| 隐式选择与伪证据 | pass | `latest` 仅用于拒绝、扫描或证据禁令；不存在允许路径。 |
| 成熟度与结果 | pass | 只声明 `T0-DESIGN design_ready`；T1～T4 均为 `blocked/not_run`，无测试结果或 readiness 升级。 |
| 事实诚实 | pass | 未创建或声称存在实现仓、baseline、commit、run_id、fixture、artifact、report、evidence、verdict 或 signoff。 |

## 7. 终态与停审

```text
current_document = 05-测试方案.md
current_step = 15
current_module = formal_document_assembly:final_audit_and_stop_review
gate_status = formal_stop_review_required
formal_status = completed_with_upstream_blockers
next_allowed_action = user_review_and_explicit_confirmation_before_06
formal_05_write_allowed = completed
formal_06_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

Step 15 完成。正式 `05-测试方案.md` 已通过装配与最终审计；`RUN-DOC-002` 只关闭“新版正式 05 缺失”部分，正式 06 仍缺失。`RUN-UP-001~008`、`RUN-DDD-001~003`、`RUN-DOC-002~003`、`RUN-OPS-001~002` 保持开放并继续限制真实正向集成、产品/发布测试与验收结论。

现在必须停审。未经用户明确确认，不得进入 `06-验收标准.md`，不得创建 implementation ledger 或 boundary skeleton，不得实现代码、运行项目测试或提交 commit。
