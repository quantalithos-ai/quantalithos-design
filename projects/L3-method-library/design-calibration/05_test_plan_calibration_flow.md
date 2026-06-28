# L3-method-library 05 测试方案校准流程

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md`
> 书写规范: `standards/document/测试方案书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-method-library/05-测试方案.md`
> 创建日期: 2026-06-27
> 当前模式: full-restart
> 当前状态: Step 15 `R15.2 formal document assembly:再写入` completed;正式 `05-测试方案.md` full-restart 已完成,等待用户确认是否启动 `06-验收标准.md`

---

## 1. 本轮目标

按测试方案 SOP 将当前 full-restart 后的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md` 中已经收稳的测试输入,转译成可执行、可追溯、可留证、可供 `06-验收标准.md` 裁决的 `05-测试方案.md`。

正式 `05-测试方案.md` 必须在 Step 15 由 Step 1~14 中间产物装配生成。本轮不得从旧 `05-测试方案.md`、旧 `06-验收标准.md`、旧 `07-实施计划.md` 或实现侧假设直接生成测试用例、证据 schema、CI 门禁或实施边界。

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 正式上游 | 仓定位、FR-ML / BR-ML、核心能力闭环、数据归属、接口依赖、非功能和验收方向。 |
| `projects/L3-method-library/01-架构设计.md` | 正式上游 | 职责边界、依赖方向、Definition vs Use、数据所有权、一致性和横切红线。 |
| `projects/L3-method-library/02-概要设计.md` | 正式上游 | 八个组成部分、代码主体框架、关键对象轮廓、接口骨架、处理流、状态、异常和配置影响。 |
| `projects/L3-method-library/03-详细设计.md` | 直接输入 | 七实现单元、对象 / port / protocol / flow / state / transaction / error / idempotency / config / observability / test cut。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_16_test_cut.md` | 直接输入 | module / protocol / state / consistency / error / config / observability 最小测试切口。 |
| `projects/L3-method-library/04-配置设计.md` | 直接输入 | profile、config source、validation、secret/redaction、adapter availability、failure/degradation 和 downstream handoff。 |
| `projects/L3-method-library/05-测试方案.md` | current formal output | 已由 Step 15 R15.2 完成 full-restart 装配,可作为新版 `06-验收标准.md` 输入。 |
| `projects/L3-method-library/06-验收标准.md` | old direction input | 只作验收方向提醒;正式 acceptance gate / veto / evidence 裁决后续重启。 |
| `projects/L3-method-library/07-实施计划.md` | old direction input | 不作为测试执行顺序、CI gate、commit boundary 或 evidence schema 来源。 |
| `projects/L1-governance/design-calibration/05_test_plan_*` | framework_reference | 只参考测试方案框架深度和门禁表达,不得复制 governance 领域事实。 |

## 3. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 当前 Step 文件 |
|---|---|---|---|---|---|
| Step 15 整理正式测试方案文档 | `R15.2 formal document assembly:再写入` | completed_wait_user_confirm_to_06 | Step 15 已完成正式 `05-测试方案.md` full-restart 装配、校准来源 / 延伸阅读回填、旧正式 05 污染隔离、自审记录和恢复点推进。 | 等待用户确认是否启动 `06-验收标准.md` full-restart Step 1;在确认前不得直接修改 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论或 implementation code。 | `design-calibration/05_test_plan_step_15_formal_document_assembly.md` |

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 | 当前门禁 |
|---|---|---|---|---|
| Step 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | [x] completed | R1.6_completed_wait_user_confirm_to_R2.1 |
| Step 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | [x] completed | R2.12_completed_wait_user_confirm_to_R3.1 |
| Step 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | [x] completed | R3.12_completed_wait_user_confirm_to_R4.1 |
| Step 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | [x] completed | R4.2_completed_wait_user_confirm_to_R5.1 |
| Step 5 | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | [x] completed | R5.2_completed_wait_user_confirm_to_R6.1 |
| Step 6 | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | [x] completed | R6.14_completed_wait_user_confirm_to_R7.1 |
| Step 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | [x] completed | R7.14_completed_wait_user_confirm_to_R8.1 |
| Step 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | [x] completed | R8.10_completed_wait_user_confirm_to_R9.1 |
| Step 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | [x] completed | R9.12_completed_wait_user_confirm_to_R10.1 |
| Step 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | [x] completed | R10.12_completed_wait_user_confirm_to_R11.1 |
| Step 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | [x] completed | R11.2_completed_wait_user_confirm_to_R12.1 |
| Step 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | [x] completed | R12.2_completed_wait_user_confirm_to_R13.1 |
| Step 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | [x] completed | R13.2_completed_wait_user_confirm_to_R14.1 |
| Step 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | [x] completed | R14.2_completed_wait_user_confirm_to_R15.1 |
| Step 15 | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | [x] completed | R15.2_completed_wait_user_confirm_to_06 |

## 5. 执行纪律

- 每次继续、同意、上下文恢复或 agent 切换时,必须先读取 `project_execution_ledger.md`,再读取本 flow 和当前 Step 文件。
- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 内必须先搭整体模块,再逐模块执行“先思考 -> 再写入”。
- 用户每次确认只推进一个当前模块,不得把多个模块自动合并。
- 正式 `05-测试方案.md` 必须在 Step 15 由已确认的 Step 1~14 中间产物装配,不得在 Step 1 直接重写正式文档。
- 旧 `05-测试方案.md`、旧 `06-验收标准.md`、旧 `07-实施计划.md` 只作为 historical / old direction input,不得覆盖当前 `00`~`04`。
- 测试方案不得自行补对象 schema、port、mapper、state、config key、marker source、evidence schema、artifact schema 或 phase boundary。
- 单次写入以 100~300 行为宜;这是写入批次规模,不是文件最终长度上限。

## 6. 历史材料处理

| 材料 | 当前定位 | 使用方式 |
|---|---|---|
| 旧 `05-测试方案.md` 正文 | replaced historical material | 旧 P0 MethodContent、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway 等口径已在 R15.2 替换,不得回流为当前测试真相源。 |
| 旧 `06-验收标准.md` | old direction input | 可提示验收关注方向,不得定义当前 evidence、veto、release gate 或 acceptance threshold。 |
| 旧 `07-实施计划.md` | old direction input | 不作为 phase、commit、CI、required_checks、implementation ledger 或 boundary 来源。 |
| L1-governance 05 文件 | framework_reference | 只参考流程、表格和门禁深度,不得复制 governance 领域对象、case、证据或门禁。 |

## 7. 当前 next_allowed_action

Step 15 `R15.2 formal document assembly:再写入` completed;
正式 `05-测试方案.md` full-restart 已完成;
等待用户确认是否启动 `06-验收标准.md` full-restart Step 1;
不得直接修改 `06-验收标准.md`;
不得写验收标准、实施计划、CI YAML、脚本实现、真实执行结论或 implementation code。
