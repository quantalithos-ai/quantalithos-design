# L5-sync 05-测试方案校准流程

> 对应 SOP：standards/document/测试方案讨论流程_SOP.md
> 书写规范：standards/document/测试方案书写规范.md
> 当前模式：full-restart + single-agent-serial。
> 用户授权：完成全部 05；正式 05 完成后立即停审，不进入 06。
> 本仓内部严格按 Step 1 → 15 串行推进；旧 05/06、README、draft 和其他项目测试文档仅作 historical_material 或框架参考。

## 1. 执行边界

- 只修改 projects/L5-sync/ 下的测试方案、design-calibration 中间产物和项目台账。
- 不实现代码、不创建测试 runner、fixture、scripts/gates、scripts/reports、artifact、report、evidence 实例，不运行测试，不提交 commit。
- 正式 05-测试方案.md 只能在 Step 15 由 Step 1～14 已停审产物装配。
- 测试设计不能重新定义需求、对象、字段、状态、协议、错误、配置或 evidence truth；发现会改变 03/04 契约的缺口必须记录为回写触发器。
- 测试用例和证据 ID 是设计级计划标识，不表示已经存在 case、run、artifact、report、evidence、verdict、signoff 或 readiness。
- 继续保留 SYNC-UP-001~010、SYNC-LOCAL-001~005；不得用 fake、cache、ACK、log、telemetry、static mapping 或测试报告关闭 blocker。

## 2. 权威输入

| 输入 | 用途 | 当前姿态 |
|---|---|---|
| projects/L5-sync/00-需求文档.md | FR/BR/US/AC/NFR、VETO、truth ownership 和主链 | 当前正式基线 |
| projects/L5-sync/01-架构设计.md | boundary、依赖方向、owner、adapter 和安全红线 | 当前正式基线 |
| projects/L5-sync/02-概要设计.md | feature、对象轮廓、protocol、flow、state 和异常 | 当前正式基线 |
| projects/L5-sync/03-详细设计.md | 29 objects、ports、10 Command、13 Query、3 Consumer、3 Job、17 states、flow、UoW、errors、config、observability、test cuts | 唯一直接设计真相源 |
| projects/L5-sync/04-配置设计.md | 42 leaf、profiles、strict source、redaction、activation、failure 和 planned downstream handoff | 当前正式配置真相源 |
| projects/L5-sync/design-calibration/03_ddd_step_16_test_cuts.md | 03 已停审的最小测试切口与证据上限 | 当前校准输入 |
| projects/L5-sync/design-calibration/04_config_step_12_downstream_handoff.md | 05 承接的配置场景、VETO、planned handoff 和 evidence ceiling | 当前校准输入 |
| projects/L5-sync/design-calibration/04_config_step_14_risks_open_questions.md | blocker、future trigger、03 回写判定 | 当前风险输入 |
| projects/L5-sync/06-验收标准.md | 仅 historical/direction；不定义当前 evidence/veto truth | 不覆盖新版 05 |
| projects/L1-governance/05-测试方案.md、projects/L1-workspace/05-测试方案.md | 仅参考章节粒度、矩阵和证据结构 | 不继承业务 truth |
| standards/document/测试方案讨论流程_SOP.md | Step 1～15 顺序、切口停审和证据边界 | 唯一测试流程 |
| standards/document/测试方案书写规范.md | 正式 15 章、ID、路径、artifact/report 和闭环要求 | 唯一测试书写规范 |
| standards/document/设计文档讨论中间产物规范.md | 中间产物字段、三层门禁、恢复与批次纪律 | 通用约束 |
| standards/document/全局项目依赖关系与裁剪规则.md | compile/runtime/event dependency 测试协作分类 | 环境矩阵约束 |
| standards/document/设计真相源闭环与可落码性标准.md | 对象/字段/状态/证据/可落码闭环 | 闭环审计约束 |

## 3. Step 总表

| Step | 主题 | 中间产物 | 回填章节 | 当前状态 |
|---:|---|---|---|---|
| 1 | 确认测试输入边界 | 05_test_plan_step_01_input_boundary.md | §1 | completed / stop_review |
| 2 | 明确测试目标、范围和非范围 | 05_test_plan_step_02_scope.md | §2 | completed / stop_review |
| 3 | 抽取测试对象与测试切口 | 05_test_plan_step_03_test_objects_cuts.md | §3 | completed / stop_review |
| 4 | 制定测试策略与分层 | 05_test_plan_step_04_strategy_layers.md | §4 | completed / stop_review |
| 5 | 建立需求追溯与覆盖矩阵 | 05_test_plan_step_05_traceability_coverage.md | §5 | completed / stop_review |
| 6 | 设计测试场景与用例矩阵 | 05_test_plan_step_06_cases.md | §6 | completed / stop_review |
| 7 | 设计测试数据 | 05_test_plan_step_07_test_data.md | §7 | completed / stop_review |
| 8 | 设计测试环境与配置矩阵 | 05_test_plan_step_08_environment_config.md | §8 | completed / stop_review |
| 9 | 设计自动化与 CI/CD 门禁 | 05_test_plan_step_09_automation_gates.md | §9 | completed / stop_review |
| 10 | 设计专项测试与非功能验证 | 05_test_plan_step_10_nonfunctional.md | §10 | completed / stop_review |
| 11 | 定义缺陷管理与复验规则 | 05_test_plan_step_11_defects_retest.md | §11 | completed / stop_review |
| 12 | 定义进入准则与退出准则 | 05_test_plan_step_12_entry_exit.md | §12 | completed / stop_review |
| 13 | 定义测试报告与证据归档 | 05_test_plan_step_13_evidence.md | §13 | completed / stop_review |
| 14 | 定义回归策略与残余风险 | 05_test_plan_step_14_regression_risks.md | §14 | completed / stop_review |
| 15 | 整理正式测试方案文档 | 05_test_plan_step_15_formal_document_assembly.md | §1～15 | completed / stop_review |

每个 Step 完成后都必须保留：状态、输入、SOP 问题回答、旧材料诊断、改动前后对比、测试取舍、结构化产物、回填草稿、待确认事项和进入下一步门禁。每个 P0 测试切口、覆盖批次、用例批次、数据集、自动化 suite、证据归档批次都要独立停审；所有 Step 完成后再做跨切口、跨覆盖、跨 suite、跨 evidence 总审计。

## 4. 统一测试口径

- 测试层级：pure unit/property → application/flow fake → repository/UoW contract → adapter/SDK/Git/filesystem contract → CLI/E2E/release gate；后两层受 blocker 限制。
- 测试用例 ID 使用 TC-SYNC-*；证据计划 ID 使用 EV-*；这些只是计划标识。
- 正式 artifact 规则固定为 artifacts/test/<run_id>/；报告规则固定为 reports/runs/<run_id>/ 与 reports/acceptance/；不得引用 latest，不得写 project 子目录。
- 失败 suite 即使未来执行也必须保留 report.json、stdout/stderr 和 failure reason；本轮不生成这些文件。
- raw secret、credential、endpoint/body、文件正文、Git stdout/stderr、provider response、完整 sensitive ref 和完整业务正文不得进入 fixture、日志、artifact、report 或 evidence。
- Query zero-write；不把 local commit、ACK、job report、telemetry、cache 或 static mapping 升格为 Artifact/Baseline/Review accepted/evidence/readiness。
- 真实外部正向 integration 只能在相应 owner/tool/store contract 和 fixture 可构造后从 blocked/waiting 转为可执行；当前不伪造。

## 5. 当前恢复点

~~~text
current_document = 05-测试方案.md
current_step = 15
current_module = formal_document_assembly
gate_status = pass_with_upstream_blockers
next_allowed_action = user_review_formal_05
formal_05_status = formal / stop_review
formal_05_calibration_write_allowed = completed / closed
formal_05_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
~~~
