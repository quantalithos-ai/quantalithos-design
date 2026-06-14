# L1-identity 测试方案校准工作台

> 对应正式文档: `projects/L1-identity/05-测试方案.md`
> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md`
> 书写规范: `standards/document/测试方案书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `00/01/02/03/04` 重建 `L1-identity` 的 `05-测试方案.md`
> 当前状态: Step 15 formal assembly 已审核通过;新版 `05-测试方案.md` 可作为 `06` 和实施计划输入

---

## 1. 本轮重写原则

- 新版 `05` 必须承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和已审核通过的 `04-配置设计.md`。
- `03-详细设计.md` §15 与 `design-calibration/03_ddd_step_16_test_cuts.md` 是测试对象、测试切口和最小验证入口的直接来源。
- 旧版 `05-测试方案.md` 与旧版 `06-验收标准.md` 只作为历史诊断和验收方向输入,不得直接继承旧命名、旧用例编号、旧环境口径、旧证据口径或旧自动化门禁。
- 测试方案只定义如何验证正式设计契约,不得新增 `03/04` 未定义的 schema、port、state、error、DTO、config key、fixture、CI、artifact、evidence 或验收裁决。
- 每个 P0 测试切口必须回指正式设计真相源;发现测试不可设计或不可留证时,记录为待确认事项并回写对应上游文档。
- 正式 `05-测试方案.md` 只能在 Step 15 由 Step 1~14 中间产物装配生成,不得提前直接改写正式文档。
- 本轮每个 Step 完成后停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 新版正式输入 | 需求目标、核心能力、FR / BR / NFR、AC / VETO 和数据边界来源 |
| `projects/L1-identity/01-架构设计.md` | 新版正式输入 | 仓级边界、依赖裁剪、数据所有权和横切红线来源 |
| `projects/L1-identity/02-概要设计.md` | 新版正式输入 | 组件、关键对象、接口骨架、处理流、状态和异常边界来源 |
| `projects/L1-identity/03-详细设计.md` | 直接输入 | module、object、protocol、flow、state、transaction、error、idempotency、config、observability 和 test cuts 来源 |
| `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` | 直接输入 | 最小测试切口、模块 / 接口 / 状态 / 一致性 / 配置 / 观测验证入口来源 |
| `projects/L1-identity/04-配置设计.md` | 已审核通过 | profile、source priority、strict JSON、redaction、runtime builder、adapter failure、rollback digest 和下游承接来源 |
| `projects/L1-identity/05-测试方案.md` | 旧 / 待重建草案 | 只作为历史诊断输入;不得覆盖新版 `00`~`04` |
| `projects/L1-identity/06-验收标准.md` | 旧 / 待重建草案 | 只作为验收方向输入;正式 evidence / veto 口径后续重建 |
| `standards/document/测试方案讨论流程_SOP.md` | 当前流程标准 | Step 1~15 执行依据 |
| `standards/document/测试方案书写规范.md` | 当前书写标准 | 正式 `05` 装配依据 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认测试输入边界 | 新版 `00/01/02/03/04`、Step 16 test cuts、旧 `05/06`、测试 SOP / 规范 | `05_test_plan_step_01_input_boundary.md` | 无 | 已审核通过 | 上游权威、旧文档降级、必须回答 / 不再回答、输入风险明确 | 已进入 Step 2 |
| 2 | 明确测试目标、范围和非范围 | Step 1、新版 `00` AC / VETO、新版 `03/04` | `05_test_plan_step_02_scope.md` | Step 1 | 已审核通过 | P0/P1/P2 测试范围和非范围闭合 | 已进入 Step 3 |
| 3 | 抽取测试对象与测试切口 | Step 2、`03` §15、Step 16 test cuts | `05_test_plan_step_03_test_objects_cuts.md` | Step 2 | 已审核通过 | 模块、Command、Query、Event、Job、状态、一致性、配置、观测切口闭合 | 已进入 Step 4 |
| 4 | 制定测试策略与分层 | Step 3、架构 / 详细设计边界 | `05_test_plan_step_04_strategy_layers.md` | Step 3 | 已审核通过 | contract/domain/application/infra/API/worker/jobs/gate 分层职责闭合 | 已进入 Step 5 |
| 5 | 建立需求追溯与覆盖矩阵 | Step 2~4、`00` traceability、`03/04` cuts | `05_test_plan_step_05_traceability_coverage.md` | Step 4 | 已审核通过 | FR / BR / NFR / AC / VETO 到测试切口覆盖明确 | 已进入 Step 6 |
| 6 | 设计测试场景与用例矩阵 | Step 3~5 | `05_test_plan_step_06_cases.md` | Step 5 | 已审核通过 | P0 用例编号、正向/负向/边界/恢复断言闭合 | 已进入 Step 7 |
| 7 | 设计测试数据 | Step 6、数据归属和 forbidden material 规则 | `05_test_plan_step_07_test_data.md` | Step 6 | 已审核通过 | fixture、seed、safe summary、forbidden body negative data 闭合 | 已进入 Step 8 |
| 8 | 设计测试环境与配置矩阵 | Step 6~7、`04` profiles/config | `05_test_plan_step_08_environment_config.md` | Step 7 | 已审核通过 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` 与 adapter mode 测试矩阵闭合 | 已进入 Step 9 |
| 9 | 设计自动化与 CI/CD 门禁 | Step 6~8 | `05_test_plan_step_09_automation_gates.md` | Step 8 | 已审核通过 | suite、gate、script、artifact/report 产面闭合 | 已进入 Step 10 |
| 10 | 设计专项测试与非功能验证 | Step 5~9、NFR / redline | `05_test_plan_step_10_nonfunctional.md` | Step 9 | 已审核通过 | 性能、可用性、安全、观测、redaction 和 fake parity 验证口径闭合 | 已进入 Step 11 |
| 11 | 定义缺陷管理与复验规则 | Step 6~10 | `05_test_plan_step_11_defects_retest.md` | Step 10 | 已审核通过 | 缺陷分级、复验触发、阻塞规则和回归入口闭合 | 已进入 Step 12 |
| 12 | 定义进入准则与退出准则 | Step 2~11 | `05_test_plan_step_12_entry_exit.md` | Step 11 | 已审核通过 | entry / exit / veto / residual risk 前置关系闭合 | 已进入 Step 13 |
| 13 | 定义测试报告与证据归档 | Step 6~12 | `05_test_plan_step_13_evidence.md` | Step 12 | 已审核通过 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 evidence index 口径闭合 | 已进入 Step 14 |
| 14 | 定义回归策略与残余风险 | Step 6~13 | `05_test_plan_step_14_regression_risks.md` | Step 13 | 已审核通过 | 变更触发、最小/全量回归、残余风险和待确认项闭合 | 已进入 Step 15 |
| 15 | 整理正式测试方案文档 | Step 1~14、书写规范 | `05_test_plan_step_15_formal_document_assembly.md` 与 `../05-测试方案.md` | Step 14 | 已审核通过 | 正式 `05` 每章有校准来源,无旧口径残留,无未处理上游 blocker | 可进入新版 `06` 重建 |

---

## 4. Step 内统一执行模板

每个 `05_test_plan_step_*` 文件必须按以下结构落盘:

1. Step 状态
2. 本步目标
3. 本步输入
4. SOP 问题回答
5. 当前文档问题诊断
6. 改动前后对比
7. 测试设计取舍
8. 结构化中间产物
9. 对上游设计的影响判定
10. 回填草稿
11. 待确认事项
12. 进入下一步条件

涉及测试切口的 Step 必须按测试对象 / 设计真相源 -> 测试切口 -> 场景 -> 用例 -> 数据 -> 自动化 -> 证据的小循环展开,不得先生成全局用例大表再事后补来源、数据和 evidence。

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ID-TEST-WATCH-001 | 旧 `05/06` 早于新版 `03/04`,包含旧对象、旧流程和旧环境口径 | 旧 `05/06` 诊断 | Step 1 降级为历史诊断和方向输入 |
| ID-TEST-WATCH-002 | 正式测试编号、fixture、CI、evidence 仍未定义 | `03` §15 / §17 | 由新版 `05` Step 6~13 正式分配 |
| ID-TEST-WATCH-003 | 性能 / 可用性 baseline 不继承旧硬阈值 | `00` NFR / AC、`03` 风险 | Step 10/12/13 建立 sample、baseline 或评审口径 |
| ID-TEST-WATCH-004 | `04` 已固定 profile 与 adapter mode 分离 | `04` §6 / §12 | Step 8 必须承接,不得恢复 old environment 术语 |
| ID-TEST-WATCH-005 | 测试不能补 schema、port、state、error、DTO 或 evidence object | `03` §15 / §17 | 发现缺口时记录 blocker 并回写上游设计 |
| ID-TEST-WATCH-006 | forbidden material / redaction 是 0 容忍测试主题 | `00` NFR / VETO、`03` §14/15、`04` §8/12 | Step 6/7/10/13 必须形成可执行扫描和留证口径 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `05-测试方案.md` | Step 15 已按 15 章主链重新装配、通过本地自检并经用户审核通过 |
| 当前完成 Step | Step 15 formal assembly 已审核通过 |
| 当前下一步 | 进入新版 `06-验收标准.md` 重建或实施计划承接 |
| 是否创建 / 替换未来 Step 文件 | 未创建未来 Step |
| 旧 `05-测试方案.md` 如何处理 | 只作历史诊断;到 Step 15 按 Step 1~14 结果重建正式文档 |
