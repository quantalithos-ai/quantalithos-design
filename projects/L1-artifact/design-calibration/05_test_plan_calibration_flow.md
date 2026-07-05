# L1-artifact 05 测试方案校准流程

> 对应正式文档: `projects/L1-artifact/05-测试方案.md`
> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md`
> 书写规范: `standards/document/测试方案书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `00/01/02/03/04` 复核并重写 `L1-artifact` 的 `05-测试方案.md`
> 当前状态: Step 15 已完成;正式 `05-测试方案.md` 已装配,等待用户审查

---

## 1. 本轮重写原则

- 新版 `05` 必须直接承接正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`,尤其是 `03` §7~§15 与 `design-calibration/03_ddd_step_16_test_cuts.md`,以及 `04` §6~§12 的配置测试承接口径。
- 旧版 `05-测试方案.md` 与旧 `06-验收标准.md` 只作为历史诊断和方向输入,不得直接继承旧用例编号、旧环境矩阵、旧术语或旧证据口径。
- 测试方案只定义如何验证正式需求、架构、详细设计和配置契约,不得新增 `03/04` 未定义的 schema、port、state、error、profile、source priority、runtime builder contract 或 failure strategy。
- 若 `05` 在设计测试切口、证据面或门禁时发现 `03/04` 缺口,必须记录待确认事项并回流到对应正式设计文档;不得用测试方案私补设计真相源。
- 本轮每个 Step 完成后停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 新版正式文档 | 需求、规则、非功能、验收和一票否决输入 |
| `projects/L1-artifact/01-架构设计.md` | 新版正式文档 | 架构边界、依赖裁剪、数据所有权和横切约束输入 |
| `projects/L1-artifact/02-概要设计.md` | 新版正式文档 | 测试对象轮廓、接口骨架、处理流、状态组和配置影响输入 |
| `projects/L1-artifact/03-详细设计.md` | 新版正式文档 | 模块、对象、协议、flow、状态、事务、错误、幂等、观测和最小测试切口的直接输入 |
| `projects/L1-artifact/design-calibration/03_ddd_step_16_test_cuts.md` | 已完成 | 作为最小测试切口和高风险测试主轴的直接来源 |
| `projects/L1-artifact/04-配置设计.md` | 新版正式文档 | profile、配置校验、redaction、builder fail-fast、degraded/no-write 和 replay 测试输入 |
| `standards/document/测试方案讨论流程_SOP.md` | 最新测试方案流程标准 | Step 1~15 执行依据 |
| `standards/document/测试方案书写规范.md` | 最新正式文档结构标准 | 正式 `05` 装配依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物和台账规范 | Step / flow / project ledger 纪律依据 |
| 旧 `05-测试方案.md` | 早于新版正式 `03/04` | 只作为历史诊断输入;不得直接继承 |
| 旧 `06-验收标准.md` | 早于新版正式 `03/04` | 只作为验收方向输入;新版 evidence / veto 需后续重建 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认测试输入边界 | 新版 `00/01/02/03/04`、旧 `05/06`、测试 SOP / 规范 | `05_test_plan_step_01_input_boundary.md` | 无 | 已完成;已纳入正式 `05` | 上游关系、旧 `05/06` 降级、必须回答 / 不再回答、输入风险明确 | 已纳入正式 `05` §1 |
| 2 | 明确测试目标、范围和非范围 | Step 1、新版 `00/03/04` | `05_test_plan_step_02_scope.md` | Step 1 | 已完成;已纳入正式 `05` | P0/P1/P2 测试范围、非范围和判定边界闭合 | 已纳入正式 `05` §2 |
| 3 | 抽取测试对象与测试切口 | Step 2、新版 `02/03`、`03_ddd_step_16_test_cuts.md` | `05_test_plan_step_03_test_objects_cuts.md` | Step 2 | 已完成;已纳入正式 `05` | 模块 / 协议 / 状态 / 一致性 / 配置 / 观测测试对象闭合 | 已纳入正式 `05` §3 |
| 4 | 制定测试策略与分层 | Step 3、新版 `01/03/04` | `05_test_plan_step_04_strategy_layers.md` | Step 3 | 已完成;已纳入正式 `05` | unit / service / worker / job / fake integration / release gate 分层闭合 | 已纳入正式 `05` §4 |
| 5 | 建立需求追溯与覆盖矩阵 | Step 2~4、新版 `00/03/04` | `05_test_plan_step_05_traceability_coverage.md` | Step 4 | 已完成;已纳入正式 `05` | `FR/BR/NFR/VF` 到测试对象、用例和 evidence 的追溯闭合 | 已纳入正式 `05` §5 |
| 6 | 设计测试场景与用例矩阵 | Step 3~5 | `05_test_plan_step_06_cases.md` | Step 5 | 已完成;已纳入正式 `05` | 正向 / 负向 / 边界 / 非法转换 / duplicate replay / no-write / no-truth-repair 用例闭合 | 已纳入正式 `05` §6 |
| 7 | 设计测试数据 | Step 6、`00/03/04` | `05_test_plan_step_07_test_data.md` | Step 6 | 已完成;已纳入正式 `05` | truth / version / lineage / baseline / replay / redaction / failure 数据闭合 | 已纳入正式 `05` §7 |
| 8 | 设计测试环境与配置矩阵 | Step 6~7、`04-配置设计.md` | `05_test_plan_step_08_environment_config.md` | Step 7 | 已完成;已纳入正式 `05` | 四个 P0 profile、fake/controlled/replay 环境矩阵和配置承接闭合 | 已纳入正式 `05` §8 |
| 9 | 设计自动化与 CI/CD 门禁 | Step 5~8 | `05_test_plan_step_09_automation_gates.md` | Step 8 | 已完成;已纳入正式 `05` | PR / main / nightly / release / selected-run 套件、脚本契约、artifact/report 根目录和 `TC-ART-*` / `EV-CAND-ART-*` 映射闭合 | 已纳入正式 `05` §9 |
| 10 | 设计专项测试与非功能验证 | Step 5~9、`00/01/03/04` | `05_test_plan_step_10_nonfunctional.md` | Step 9 | 已完成;已纳入正式 `05` | truth ownership、cross-repo consumption、redaction、安全、恢复、审计、observability 和依赖边界专项测试闭合 | 已纳入正式 `05` §10 |
| 11 | 定义缺陷管理与复验规则 | Step 6~10 | `05_test_plan_step_11_defects_retest.md` | Step 10 | 已完成;已纳入正式 `05` | `S/A/B/R` 分级、P0 blocker、复验范围、closing evidence 和防回归触发闭合 | 已纳入正式 `05` §11 |
| 12 | 定义进入准则与退出准则 | Step 5~11 | `05_test_plan_step_12_entry_exit.md` | Step 11 | 已完成;已纳入正式 `05` | entry / exit checklist、blocker / residual 边界、环境与证据职责闭合 | 已纳入正式 `05` §12 |
| 13 | 定义测试报告与证据归档 | Step 5~12、`04` §12 | `05_test_plan_step_13_evidence.md` | Step 12 | 已完成;已纳入正式 `05` | reports / artifacts / candidate evidence / acceptance handoff draft 闭合 | 已纳入正式 `05` §13 |
| 14 | 定义回归策略与残余风险 | Step 5~13 | `05_test_plan_step_14_regression_risks.md` | Step 13 | 已完成;已纳入正式 `05` | 变更触发、最小回归集和残余风险闭合 | 已纳入正式 `05` §14 |
| 15 | 整理正式测试方案文档 | Step 1~14、书写规范 | `05_test_plan_step_15_formal_document_assembly.md` 与 `../05-测试方案.md` | Step 14 | 已完成;待用户审查 | 正式 `05` 每章有校准来源,正式 `05` 已装配且未引入未确认口径 | 等待正式 `05` 用户审查 |

---

## 4. Step 内统一执行模板

每个 `05_test_plan_step_*` 文件必须按以下结构落盘:

1. Step 状态
2. 本步输入
3. SOP 问题回答
4. 当前文档问题诊断
5. 改动前后对比
6. 测试设计取舍
7. 结构化中间产物
8. 对上游设计的影响判定
9. 回填草稿
10. 待确认事项
11. 进入下一步条件

涉及测试对象、测试切口、用例、数据、环境、门禁和 evidence 的 Step,必须按“正式设计来源 -> 测试对象 -> 场景 / 断言 -> 数据 / 环境 -> evidence / gate”小循环展开,不得先生成全局大表再事后补来源和断言口径。

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ART-TEST-WATCH-001 | 旧 `05` 仍按旧测试主线组织,缺少新版 `03` 的 16 Command / 13 Query / 6 Consumer / 8 Event / 6 Job 协议盘点 | 旧 `05` 诊断 | Step 1 降级为历史输入 |
| ART-TEST-WATCH-002 | `03_ddd_step_16_test_cuts.md` 已给出最小测试切口,`05` 不得绕过它另起一套主轴 | 新版 `03` Step 16 | Step 1 起纳入直接输入 |
| ART-TEST-WATCH-003 | `04` 已正式闭合 profile、source priority、redaction、builder fail-fast 和 operations replay | 正式 `04` §6~§12 | Step 1~10 必须使用新版配置术语 |
| ART-TEST-WATCH-004 | `06-验收标准.md` 仍是历史材料,不能反向定义新版 evidence / veto | 旧 `06` 诊断 | Step 1 只保留验收方向输入 |
| ART-TEST-WATCH-005 | 若测试设计发现 `03/04` 不能稳定支撑验证或证据 | 测试 SOP / 可落码性要求 | 记录待确认并回流设计,不得在 `05` 私补 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `05-测试方案.md` | 已创建并完成装配 |
| 当前完成 Step | Step 15 已完成;等待用户审查 |
| 当前下一步 | 审查正式 `05-测试方案.md` 与 `05_test_plan_step_15_formal_document_assembly.md` |
| 是否创建 / 替换未来 Step 文件 | 已创建 `05_test_plan_calibration_flow.md`、`05_test_plan_step_01_input_boundary.md`、`05_test_plan_step_02_scope.md`、`05_test_plan_step_03_test_objects_cuts.md`、`05_test_plan_step_04_strategy_layers.md`、`05_test_plan_step_05_traceability_coverage.md`、`05_test_plan_step_06_cases.md`、`05_test_plan_step_07_test_data.md`、`05_test_plan_step_08_environment_config.md`、`05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_10_nonfunctional.md`、`05_test_plan_step_11_defects_retest.md`、`05_test_plan_step_12_entry_exit.md`、`05_test_plan_step_13_evidence.md`、`05_test_plan_step_14_regression_risks.md` 与 `05_test_plan_step_15_formal_document_assembly.md`;正式 `05-测试方案.md` 已按新版 15 章主链完成装配 |
| 旧 `05/06` 如何处理 | 只作历史诊断和方向输入;到对应 Step 时按新版 `00/01/02/03/04` 重写 |
