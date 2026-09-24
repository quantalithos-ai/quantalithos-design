# L5-runner 05 测试方案校准流程

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/测试方案书写规范.md`
> 目标正式文档：`projects/L5-runner/05-测试方案.md`
> 启动模式：`full-restart + single-agent-serial`
> 本轮授权：用户已明确要求“完成全部 05”；覆盖 Step 1～15，完成正式 05 后停审，不进入 06。
> 历史材料：README、draft、旧 `05/06` 只作冲突扫描，不提供测试 truth、TC、EV、阈值或执行结论。

## 1. 执行纪律

- 只修改 `projects/L5-runner/` 下的 05 正式文档、测试 calibration 中间产物和项目台账。
- 当前 agent 独立串行完成；不创建、调用、委派或启动任何 sub-agent、worker agent、team 或并行代理。
- 严格遵守 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`；本 flow 只处理 05。
- 05 严格执行 Step 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15。
- 每个 Step 独立生成中间产物并完成输入、问题回答、诊断、对比、取舍、结构化结论、回填草稿、待确认和门禁；完成后同步本 flow 与项目台账。
- P0 测试切口按“小循环”闭合：设计来源 → 场景/断言 → 数据 → suite/gate → EV candidate → 切口停审；所有切口完成后再做跨切口审计。
- 正式 `05-测试方案.md` 只允许在 Step 15 full-restart 装配；装配前旧 05 保持 historical material。
- 不实现代码、不创建测试脚本/fixture/artifact/report/evidence、不运行项目测试、不创建 implementation ledger/boundary skeleton、不生成 baseline/commit/run_id/verdict/signoff/readiness、不提交 commit。
- `TC-*`、`EV-*`、suite、script、artifact/report path 均是计划合同，不表示文件、运行或结果已存在。

## 2. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---:|---|---|---|---|---|
| `05-测试方案.md` | Step 15 | `formal_document_assembly:final_audit_and_stop_review` | `formal_stop_review_required` | 正式 15 章已 full-restart 装配；15/15 来源与延伸阅读、18 CUT、108 唯一 TC、12 suite、18 slot、证据边界、blocker、历史污染和事实诚实审计均通过；未运行测试或生成证据。 | 用户审查正式 05；未经明确确认不得进入 06 | 本 flow、Step 1～15、正式 05、03 §5～§15/Step 16、04 §6/§9/§12 |

## 3. 总流程计划与状态台账

| Step | 主题 | 输出文件 | 前序门禁 | 状态 | gate_status | next_allowed_action |
|---:|---|---|---|---|---|---|
| 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | 04 已停审；用户授权 05 | `completed / pass / self_reviewed` | `pass_for_step_02` | 已完成 |
| 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | Step 1 pass | `completed / pass / self_reviewed` | `pass_for_step_03` | 已完成 |
| 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | Step 2 pass | `completed / pass / self_reviewed` | `pass_for_step_04` | 已完成 |
| 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | Step 3 pass | `completed / pass / self_reviewed` | `pass_for_step_05` | 已完成 |
| 5 | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | Step 4 pass | `completed / pass / self_reviewed` | `pass_for_step_06` | 已完成 |
| 6 | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | Step 5 pass | `completed / pass / self_reviewed` | `pass_for_step_07` | 已完成 |
| 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | Step 6 pass | `completed / pass / self_reviewed` | `pass_for_step_08` | 已完成 |
| 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | Step 7 pass | `completed / pass / self_reviewed` | `pass_for_step_09` | 已完成 |
| 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | Step 8 pass | `completed / pass / self_reviewed` | `pass_for_step_10` | 已完成 |
| 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | Step 9 pass | `completed / pass / self_reviewed` | `pass_for_step_11` | 已完成 |
| 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | Step 10 pass | `completed / pass / self_reviewed` | `pass_for_step_12` | 已完成 |
| 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | Step 11 pass | `completed / pass / self_reviewed` | `pass_for_step_13` | 已完成 |
| 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | Step 12 pass | `completed / pass / self_reviewed` | `pass_for_step_14` | 已完成 |
| 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | Step 13 pass | `completed / pass / self_reviewed` | `pass_for_step_15` | 已完成 |
| 15 | 正式测试方案装配 | `05_test_plan_step_15_formal_document_assembly.md` | Step 14 pass + 本轮授权 | `completed / pass / self_reviewed` | `formal_stop_review_required` | 停审；等待用户 review 与进入 06 的明确确认 |

## 4. 权威输入与使用上限

| 输入 | 用途 | 使用上限 |
|---|---|---|
| 正式 `00-需求文档.md` | `FR-RUN-001~016`、`BR-RUN-001~025`、`AC-RUN-001~011`、NFR、数据/owner 边界 | 不改需求或提前裁决验收 |
| 正式 `01-架构设计.md` | SDK-first、Layer 5、truth ownership、依赖分类、跨平台和技术中立 | 不测试/复用相邻仓私有实现 |
| 正式 `02-概要设计.md` | 六个组成部分、对象/接口/flow/state/异常/page/read-model 轮廓 | 不新增对象、页面或状态 |
| 正式 `03-详细设计.md` + Step 16 | 七模块、对象/port、11 Command、12 Query、4 planned Consumer、0 event、5 Job、21 状态、一致性/恢复/观测与最小切口 | 正式字段/状态/协议唯一来源；不补物理实现 |
| 正式 `04-配置设计.md` + Step 12 | 41 项、四 profile、strict JSON、builder/readiness、failure/change/rollback 测试承接 | 不把 demo 值或 profile 写成 product readiness |
| 专项上游正式文档/必要台账 | 判断 Runner-facing seam 成熟度、依赖类型与真实 integration 准入 | 未闭合只形成 fake/negative/blocked 测试，不猜 DTO/API |
| 旧 `05/06`、README、draft | 历史冲突与验收关注方向 | 不继承旧对象、TC、EV、阈值、技术或结论 |

## 5. 持续 blocker 与测试处理

| ID | 阻塞范围 | 05 中允许的处理 |
|---|---|---|
| `RUN-UP-001~008` | 正向 Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK integration | semantic fake、contract-negative、Blocked/Unknown/Unsupported；不造 owner success |
| `RUN-DDD-001~003` | 真实 test target、runner、语言/路径、durable store/cache | 定义 planned suite/data/script contract；不创建实现文件或声称可执行 |
| `RUN-DOC-002` | 新版 06 缺失；原“新版 05 缺失”部分已在 Step 15 关闭 | 正式 05 已完成；06 仍待用户明确授权后 full-restart 重建 |
| `RUN-DOC-003` | 07/implementation ledger/skeleton 缺失 | 不提前创建，不安排真实 commit/phase |
| `RUN-OPS-001~002` | production telemetry/SLO、真实跨仓 integration/GRC | 不设无来源阈值；production/release evidence 保持 blocked |

## 6. 当前门禁

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
