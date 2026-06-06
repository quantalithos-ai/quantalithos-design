# Step 15. 整理正式测试方案文档

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 15 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 15
> 回填章节: `05-测试方案.md` 全文
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。正式 `05-测试方案.md` 已从 Step 1~14 中间产物装配,旧版正式文档已先删除。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | §1 / §15 | 上游文档关系和参考 |
| `05_test_plan_step_02_scope.md` | §2 | 测试目标、范围和非范围 |
| `05_test_plan_step_03_test_objects_cuts.md` | §3 | 测试对象与切口 |
| `05_test_plan_step_04_strategy_layers.md` | §4 | 测试策略与分层 |
| `05_test_plan_step_05_traceability_coverage.md` | §5 | 需求追溯和覆盖矩阵 |
| `05_test_plan_step_06_cases_matrix.md` | §6 | 测试场景与用例设计 |
| `05_test_plan_step_07_test_data.md` | §7 | 测试数据设计 |
| `05_test_plan_step_08_environment_config.md` | §8 | 测试环境与配置矩阵 |
| `05_test_plan_step_09_automation_gates.md` | §9 | 自动化与 CI/CD 门禁 |
| `05_test_plan_step_10_nonfunctional_special.md` | §10 | 专项测试与非功能验证 |
| `05_test_plan_step_11_defect_retest.md` | §11 | 缺陷管理与复验规则 |
| `05_test_plan_step_12_entry_exit.md` | §12 | 进入准则与退出准则 |
| `05_test_plan_step_13_reports_evidence.md` | §13 | 测试报告与证据归档 |
| `05_test_plan_step_14_regression_risk.md` | §14 | 回归策略与残余风险 |

---

## 3. SOP 问题回答

1. 正式文档是否使用标准 15 章主链?

   回答:是。正式 `05-测试方案.md` 使用 `测试方案书写规范.md` 规定的 15 章主链。

2. 每章是否有具体 calibration 来源?

   回答:是。每个正式章节开头均引用具体 `design-calibration/05_test_plan_step_*.md`。

3. 是否复用旧文档内容?

   回答:否。旧正式 `05-测试方案.md` 已删除,新版从 Step 1~14 装配。

4. 是否新增未确认测试事实?

   回答:否。正式文档不新增对象字段、DTO schema、状态、错误、配置字段、AC 编号、CI 产品或实施 phase。

---

## 4. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 `05` 口径过期 | 已删除并重建 |
| `06` 已同步 | 正式 `05` 的 EV 表已回填到新版 `06` §5~§10 / §13 |
| `07` 未生成 | 正式 `05` 只定义门禁,不安排 commit |
| redaction checker 扫描规则未细化 | 正式 `05` 保留实现阶段待定,不写成已闭合规则 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 文档结构 | 12 章旧结构 | 15 章标准主链 |
| 校准来源 | 无逐章来源 | 每章引用具体 Step |
| 测试对象 | 旧模板 / 实例主线 | 7 模块、13 Command、11 Query、7 inbound、10 outbound、7 job、16 状态机 |
| 证据路径 | 待定 | `artifacts/test/<run_id>` / `reports/runs/<run_id>` |
| 风险 | 粗略残余风险 | 待 `06/07`、P1/P2、redaction、performance、target repo 风险明确 |

---

## 6. 结构化中间产物

### 6.1 正式章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | Step 1 |
| §2 本次测试目标与范围 | Step 2 |
| §3 测试对象与测试切口 | Step 3 |
| §4 测试策略与分层 | Step 4 |
| §5 需求追溯与覆盖矩阵 | Step 5 |
| §6 测试场景与用例设计 | Step 6 |
| §7 测试数据设计 | Step 7 |
| §8 测试环境与配置矩阵 | Step 8 |
| §9 自动化与 CI/CD 门禁 | Step 9 |
| §10 专项测试与非功能验证 | Step 10 |
| §11 缺陷管理与复验规则 | Step 11 |
| §12 进入准则与退出准则 | Step 12 |
| §13 测试报告与证据归档 | Step 13 |
| §14 回归策略与残余风险 | Step 14 |
| §15 参考 | Step 1 / Step 15 |

### 6.2 装配检查

| 检查项 | 结果 |
|---|---|
| 正式 05 已重新创建 | 通过 |
| 15 章主链完整 | 通过 |
| 每章有具体校准来源 | 通过 |
| 未复用旧 `TC-001` 编号 | 通过 |
| 未写未来源性能硬阈值 | 通过 |
| artifact / report 路径使用固定 `<run_id>` | 通过 |
| P1/P2 未伪装成 P0 已覆盖 | 通过 |

---

## 7. 回填草稿

正式 `05-测试方案.md` 已装配完成。后续 `06-验收标准.md` 应消费本文 EV 编号和证据路径,`07-实施计划.md` 应消费本文 suite、gate、进入 / 退出准则和残余风险。

---

## 8. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP15-OPEN-001 | 新版 `06-验收标准.md` 未同步 | 后续按验收标准 SOP 重建 |
| TP15-OPEN-002 | 新版 `07-实施计划.md` 未生成 | 后续按实施计划 SOP 生成 |
| TP15-OPEN-003 | target implementation repo 未确认 | 后续 `07` PH-01 前确认 |

---

## 9. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 正式文档已装配 | 通过 |
| 下游承接事项明确 | 通过 |
| 可进入 `06-验收标准.md` SOP | 通过 |
