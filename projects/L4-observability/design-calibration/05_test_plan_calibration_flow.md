
# L4-observability 05-测试方案 校准流程工作台

## 执行状态

| 字段 | 值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案` |
| mode | `full-restart` |
| started_at | `2026-07-06` |
| source_policy | 旧正式文档和 README 只作为 `historical_material`;正式结论以本轮 Step 产物和新版正式文档为准 |
| gate_status | `pass_current_05_full_document_gate_with_inherited_affected_open` |
| gate_reason | Step 14 已闭合回归触发表、全量 P0 manifest、残余风险和不可接受红线；Step 15 已按 current Step 01~14 重建正式 05 并通过章节、索引、真实性和来源门禁；记录层已将旧 gate 名称标为 historical mapping，并统一状态 owner 计数 |
| next_allowed_action | `start_current_06_step_01_full_restart` |

## 总流程计划

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Step 01 确认测试输入边界 | current `00/01/02/03/04`;测试 SOP / 书写规范；`03` §15~§17；`04` §8~§13 | `design-calibration/05_test_plan_step_01_input_boundary.md` | done | all | done | done | done | pass | current 输入、历史材料、协议基线、验收方向和 blocker/affected 已收口；未写正式正文 | start current Step 02 | inherited affected；no new blocker |
| Step 02 明确测试目标、范围和非范围 | current `00/01/02/03/04`;Step 01；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_02_scope.md` | done | all | done | done | done | pass | P0/P1/P2/Forbidden、非范围、接缝和 VETO 处置已收口；无新增 blocker | start current Step 03 | inherited affected |
| Step 03 抽取测试对象与测试切口 | current `02/03/04`;Step 01~02；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_03_test_objects_cuts.md` | done | all | done | done | done | pass | 七模块、60 个 exact protocol、27 个正式 state owner、技术协调状态、UoW/恢复/配置/安全/依赖切口已逐项停审；未写正式正文 | start current Step 04 | inherited affected；no new blocker |
| Step 04 制定测试策略与分层 | current `02/03/04`;Step 03；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_04_strategy_layers.md` | done | all | done | done | done | pass | 九层风险驱动策略、七模块/五协议族/27状态映射和横切红线分层已收口；未写正式正文 | start current Step 05 | inherited affected；no new blocker |
| Step 05 建立需求追溯与覆盖矩阵 | current `00~04`;Step 03~04；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_05_traceability_coverage.md` | done | all | done | done | done | pass_with_affected_open | 13核心FR、26规则、34数据、24 NFR、31 AC、10 VF 与16反向切口的双向矩阵已收口；候选TC/EV均为planned | start current Step 06 | inherited affected；no new blocker |
| Step 06 设计测试场景与用例矩阵 | current `00~04`;Step 03~05；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_06_cases.md` | done | all | done | done | done | pass_with_affected_open | 99个唯一TC与99个candidate EV、16切口、60 exact protocol、27正式状态owner+1技术状态及UoW/恢复/phase均已闭合；I05/J06保持blocked/conditional | start current Step 07 | inherited affected；no new blocker |
| Step 07 设计测试数据 | current `00~04`;Step 06；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_07_test_data.md` | done | all | done | done | done | pass_with_affected_open | 82个唯一dataset、99/99 TC、27+1状态corpus、16切口停审与污染/清理/替身审计已收口；I05/J06无positive fixture | start current Step 08 | inherited affected；no new blocker |
| Step 08 设计测试环境与配置矩阵 | current `00~04`;Step 07；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_08_environment_config.md` | done | all | done | done | done | pass_with_affected_open | 6 lane、3 profile、compile/runtime/event/handoff分类、25 config failure、82 dataset环境承载与not-established真实性审计已收口 | start current Step 09 | inherited affected；no new blocker |
| Step 09 设计自动化与 CI/CD 门禁 | current `00~04`;Step 08；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_09_automation_gates.md` | done | all | done | done | done | pass_current_with_inherited_affected_open | 9 suite、99/99 TC/EV、6 lane、82 dataset、五脚本 contract、artifact/report provenance、failure/redaction/metric/dependency gates 已收口；未生成真实执行事实 | start current Step 10 | inherited affected；no new blocker |
| Step 10 设计专项测试与非功能验证 | current `00~04`;Step 09；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_10_nonfunctional.md` | done | all_nonfunctional_axes | done | done | done | pass_current_step_10_with_inherited_affected_open | 12 专项主轴、故障注入和安全/证据/交接闭环已收口；未生成真实执行事实 | start current Step 11 | inherited affected；no new blocker |
| Step 11 定义缺陷管理与复验规则 | current `00~04`;Step 10；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_11_defects_retest.md` | done | defect_taxonomy_escalation_retest_closure | done | done | done | pass_current_step_11_with_inherited_affected_open | S/A/B/R、VETO、复验和关闭证据规则已收口；未创建真实缺陷或执行事实 | start current Step 12 | inherited affected；no new blocker |
| Step 12 定义进入准则与退出准则 | current `00~04`;Step 11；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_12_entry_exit.md` | done | entry_exit_gate_matrix | done | done | done | pass_current_step_12_with_inherited_affected_open | 设计推进门禁、真实测试 entry/exit、blocked/not_run/conditional、lane 真实性和 raw artifact/report pairing 已收口；未生成执行事实 | start current Step 13 | inherited affected；no new blocker |
| Step 13 定义测试报告与证据归档 | current `00~04`;Step 12；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_13_evidence.md` | done | run_scoped_evidence_archive_and_provenance | done | done | done | pass_current_step_13_with_inherited_affected_open | 99 条 exact TC/DS/EV/suite/lane/path join、9 suite、82 dataset、canonical artifact/report、失败保留、五脚本和 provenance/acceptance/review 边界已闭合；无真实执行事实 | start current Step 14 | inherited affected；no new blocker |
| Step 14 定义回归策略与残余风险 | current `00~04`;Step 13；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_14_regression_risks.md` | done | regression_trigger_and_residual_risk_closure | done | done | done | pass_current_step_14_with_inherited_affected_open | 回归触发表、9 suite/99 TC 全量 P0 合同、9 residual、不可风险接受项和 06 转入项已闭合；不表示执行通过 | start current 05 Step 15 | inherited affected |
| Step 15 正式整理为 05-测试方案 | current `00~04`;Step 01~14；测试 SOP / 书写规范 | `design-calibration/05_test_plan_step_15_formal_document_assembly.md` | done | formal_test_plan_assembly_and_cross_chapter_gate | done | done | done | pass_current_05_full_document_gate_with_inherited_affected_open | 正式 05 已由 current Step 01~14 重建；15章、99/82/9/6/5 索引、来源、真实性和下游承接审计通过 | start current 06 Step 01 full restart | inherited affected |

## 历史材料处理

旧 `README.md`、旧 `00/01/02/03/05/06`、提前生成的 Step 04~15 草稿和旧性能 / DB / TimescaleDB / Grafana / 147 event / P95 数字只作为 historical_material。新版结论必须从当前 SOP、上游正式文档和当前 Step 结构化产物重新进入正式正文。旧 `04/07` 缺失记录为历史链路缺口,本轮已补建。

## 跨 Step 审计结论

| 审计项 | 结论 |
|---|---|
| 是否存在未生成 Step 文件 | 否 |
| 是否存在正式正文无具体校准来源 | 否,正式文档每章均列出具体 `design-calibration/...` |
| 是否沿用旧 README 或旧正式文档作为当前 truth | 否,旧材料仅作为 historical_material 和差异诊断输入 |
| 是否存在业务 truth 反写 | 否,本仓只拥有观测投影、审计投影、指标 / trace / log / report / retention marker |
| 是否伪造 commit / run_id / evidence alias / 测试结果 | 否 |

## Current checkpoint: 05 formal assembly complete

此前本文件中 Step 14 以前的恢复记录保留为 historical；以下是唯一 current 指针。05 的记录层校准不改变
测试执行状态，也不关闭任何 inherited affected。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前完成 Step | Step 15 `正式文档装配` |
| gate_status | `pass_current_05_full_document_gate_with_inherited_affected_open` |
| formal 05 | current full-restart；15章主链；由 Step 01~14 current 产物装配 |
| current design counts | 16 cuts；60 protocols；27+1 states；99 TC；82 dataset；9 suite；6 lane；5 scripts |
| execution reality | target implementation repo、CI、RuntimeLike、真实 run/artifact/report/evidence 均未建立；`not_run_by_design` |
| new upstream blocker | `none` |
| inherited blocker / affected | I05 payload/schema/binding、H13 controlled、UoW/recovery/external phase/outbox/report/secondary owner 和 `03-RPR-S09-PER-FLOW` 保持开放 |
| next_allowed_action | `start_current_06_step_01_full_restart` |
| commit | 不需要；用户未要求提交 |
