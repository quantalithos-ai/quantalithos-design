# Step 15. 整理正式测试方案文档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15
> 回填章节：完整 `05-测试方案.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 正式测试方案装配 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 1~14 中间产物、测试方案 SOP / 书写规范、通则和项目台账 |
| 正式文件 | `projects/L2-member-service/05-测试方案.md` |
| 停审结论 | 正式 `05` 已装配并完成只读终审，等待用户审查；不得进入 `06` |

## 2. 装配前门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 项目级台账允许进入 05 | pass | 用户“继续”视为 04 停审后的文档切换确认 |
| Step 1~14 中间产物齐全 | pass | 每个文件含状态、输入、问题回答、诊断、取舍、结构化产物和回填草稿 |
| 15 章主链 | pass | §1~§15 顺序与测试方案书写规范一致；§11~§15 已补齐 |
| 正式章节来源 | pass | 每章均列具体 `design-calibration/05_test_plan_step_*.md` |
| 旧材料隔离 | pass | 旧 05/06/README 仅 historical_material，不导入旧字段/状态/路径 |
| 分母稳定 | pass | 7 模块、29 对象、10/6/5/1/7 协议分母 |
| 跨项目 blocker | pass_with_upstream_blockers | MSVC-UP-001~008 只作 blocked/waiting/placeholder |
| 执行边界 | pass | 不执行测试，不生成 artifact/report/evidence/verdict/signoff/readiness，不提交 commit |

## 3. 正式章节映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `05_test_plan_step_01_input_boundary.md` |
| §2 本次测试目标与范围 | `05_test_plan_step_02_scope.md` |
| §3 测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` |
| §4 测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` |
| §5 需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` |
| §6 测试场景与用例设计 | `05_test_plan_step_06_cases.md` |
| §7 测试数据设计 | `05_test_plan_step_07_test_data.md` |
| §8 测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` |
| §9 自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` |
| §10 专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` |
| §11 缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` |
| §12 进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` |
| §13 测试报告与证据归档 | `05_test_plan_step_13_evidence.md` |
| §14 回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` |
| §15 参考 | `05_test_plan_step_15_formal_document_assembly.md` + all prior Steps |

## 4. 装配规则

- 正式正文只承载收口后的测试方案结论，不粘贴 SOP 问题原文、诊断、取舍或停审记录。
- 正式用例按族和代表性矩阵表达，完整逐切口审计留在 Step 6；不得新增未讨论的字段、状态、错误、phase 或证据路径。
- `EV-MS-*` 只定义未来证据族与绑定规则；当前不存在实际证据实例。
- `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 只作为 planned 归档结构。
- P0 / P1 / P2、fake / controlled / disabled、blocked / waiting / unavailable 和 residual 口径必须与 Step 2、8、10、14 一致。

## 5. 最终自审清单

| 检查项 | 通过标准 | 结果 |
|---|---|---|
| 章节完整性 | 15 个固定章节均存在且顺序正确 | pass |
| 校准来源 | 每章有具体 Step 文件和延伸阅读 | pass |
| 上游承接 | 00/01/02/03/04 和 `03_ddd_step_16_test_cut.md` 可追溯 | pass |
| 测试对象 | 七模块、29 对象、10/6/5/1/7 入口覆盖 | pass |
| 字段/状态闭环 | 用例使用正式名称；无旧口语状态和 phase 越界 | pass |
| Query/Job 边界 | no-write / no-truth-repair 有负向用例 | pass |
| 数据/环境 | fixture、隔离、profile、依赖类型可判定 | pass |
| 自动化门禁 | suite、script、artifact/report、阻断级别可定位 | pass |
| 非功能 | 安全/一致性/恢复/观测有方法；无来源数值未升级 | pass |
| 证据真实性 | raw/report pairing、sha256 digest、redaction、no-static-evidence；当前只定义 planned schema | pass |
| 风险透明 | MSVC-UP 与 P1/P2 residual 显式保留 | pass_with_upstream_blockers |
| 执行诚实 | 无测试结果、真实 run、artifact、verdict、signoff、readiness | pass |

## 6. 终审审计

| 审计项 | 结论 | 修正 / 后续 |
|---|---|---|
| 旧 05/06 污染 | 已隔离 | 仅在 §1 / §14 说明 historical_material |
| 兄弟项目 truth | 未迁移 | exact contract 继续 pending / blocked |
| source / config | 与 `04` 一致 | strict JSON、profile、fixture、redaction 口径一致 |
| protocol denominator | 与 `03` 一致 | 10 Command、6 Query、5 Consumer、1 helper、7 Job |
| state / error names | 与 `03` 一致 | 不引入新 enum 或万能状态 |
| artifact/report path | 符合 SOP | 不带 project 子目录，不使用 latest |
| evidence | 仅 planned | 未来由真实 suite artifact/report 推导 |
| 03 回写 | 当前无 P0 回写 | 若发现 schema/phase 漂移则暂停并回写 |
| 05 正式文档自审 | 7 模块、29 对象、10/6/5/1/7 分母；§11~§15、EV-MS、artifact/report 和 residual 均可追溯 | 通过 |
| 证据状态表达 | 执行状态与 `blocker_status` 分离；不将 blocked/waiting/pending 推导为 passed/ready/signoff | 通过 |

## 7. 正式文档停审

```text
step_15_status = completed / pass_with_upstream_blockers
formal_05_write_allowed = completed
formal_05_stop_review = completed; waiting_for_user_review
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
next_allowed_action = wait_for_user_review_before_entering_06
```

正式 `05` 仅作为后续 `06` 的测试证据输入和 `07` 的测试门禁输入；在用户明确审查确认前，不进入 `06-验收标准.md`，不创建 `06` calibration flow，不实现代码，不运行测试，不提交 commit。
