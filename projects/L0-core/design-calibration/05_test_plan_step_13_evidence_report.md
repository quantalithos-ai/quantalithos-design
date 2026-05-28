# Step 13. 定义测试报告与证据归档

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-core/05-测试方案.md` §13

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 5 覆盖矩阵 | 需求 / 规则到 evidence id 的映射 | 建立证据到需求和验收的追溯 |
| Step 6 用例矩阵 | 用例 ID、断言点和自动化候选 | 定义每个 P0 用例证据 |
| Step 9 自动化门禁 | suite 报告 ID | 定义自动化报告归档 |
| Step 10 专项测试 | 专项证据和一票否决证据 | 定义专项证据归档 |
| Step 12 退出准则 | 报告和残余风险归档要求 | 定义退出前必须具备的证据 |

依赖的前序 Step：Step 1~12 已确认。

## 3. SOP 问题回答

1. 每类测试输出什么证据?

   回答：unit / service 输出测试报告和覆盖关键断言；contract 输出 DTO / CloudEvent / schema roundtrip 报告；integration 输出 repository、audit、outbox、transaction、projection 证据；worker 输出 job 运行和重跑证据；config 输出配置来源、校验和失效模式报告；E2E 输出最小闭环报告；专项输出安全、审计、trace、恢复和性能 baseline 证据。

2. 证据保存在哪里?

   回答：设计阶段只规定逻辑归档位置：`artifacts/test/l0-core/<run_id>/...`。实际 CI artifact bucket、文件系统路径或制品仓库由实施计划和 CI 实现确定,但必须保留相同目录语义。

3. 证据如何关联用例和验收项?

   回答：每份证据必须包含 `run_id`、suite、case_id、evidence_id、commit、config_profile、result、trace_id 或 report_id。正式验收标准通过 evidence_id 和 case_id 引用测试方案,不重新定义测试用例。

4. 哪些日志、trace、DB snapshot 或报告必须保留?

   回答：必须保留自动化报告、失败日志、关键 trace / audit 摘要、CloudEvent fixture、配置解析报告、outbox relay 报告、job rerun 报告、release-like E2E 报告和残余风险表。不得保留 raw secret、外部正文全文或生产敏感数据。

5. 证据保留多久?

   回答：P0 release gate 证据至少保留到下一次正式 release baseline 被验收并可追溯；S/A 缺陷复验证据至少保留到缺陷关闭后的下一轮回归完成；具体保留周期由部署运维或组织级质量规范确定。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §11 | 报告和证据仍围绕旧 shared primitive admission | 当前 P0 用例无法被验收引用 |
| `05-测试方案.md` §11 | 没有统一 evidence id 到 case id 的关系 | 证据不可追溯 |
| `05-测试方案.md` §11 | 保存位置和保留规则不明确 | 后续验收无法复核 |
| `05-测试方案.md` §11 | 未强调不得保存 raw secret 和外部正文 | 证据归档可能违反安全边界 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 证据主题 | admission / registry 报告 | unit、service、contract、integration、worker、config、E2E、special evidence | 对齐新版测试对象 |
| 追溯方式 | 报告名称粗略 | evidence_id + case_id + run_id + commit + profile | 支撑验收引用 |
| 保存位置 | 未明确 | `artifacts/test/l0-core/<run_id>/...` 逻辑结构 | 支撑实施落地 |
| 保留规则 | 未明确 | P0 release gate 和 S/A 复验证据保留到可追溯阶段 | 支撑审计 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 测试方案直接填写执行结果 | 看起来完整 | 混淆方案和执行报告 | 不采用 |
| B. 只保留 CI 成功 / 失败状态 | 简单 | 无法支撑验收和复盘 | 不采用 |
| C. 定义 evidence id、保存语义和报告结构,执行结果由后续测试报告填写 | 边界清晰,可追溯 | 需要实施时遵守目录语义 | 采用 |

## 7. 结构化中间产物

### 7.1 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| EV-CI-FMT-001 | 格式 / 静态检查报告 | `fmt_lint_suite` | `artifacts/test/l0-core/<run_id>/ci/fmt_lint/` | 全局 | 代码质量门禁 |
| EV-UNIT-001 | 单元测试报告 | `unit_domain_suite` | `artifacts/test/l0-core/<run_id>/unit/` | TC-CMD-*、TC-IDEM-* | 领域不变量 |
| EV-SVC-001 | 应用服务测试报告 | `service_command_query_suite` | `artifacts/test/l0-core/<run_id>/service/` | TC-CMD-*、TC-QUERY-*、TC-IDEM-* | P0 主线 |
| EV-CONTRACT-001 | DTO / schema roundtrip 报告 | `dto_schema_contract_suite` | `artifacts/test/l0-core/<run_id>/contract/schema/` | TC-DTO-001 | 契约兼容 |
| EV-CONTRACT-002 | CloudEvent / relay boundary 报告 | `outbox_relay_boundary_suite` | `artifacts/test/l0-core/<run_id>/contract/outbox/` | TC-EVENT-001、TC-OUTBOX-* | 事实传播边界 |
| EV-INT-001 | repository / transaction / projection 集成报告 | `integration_persistence_suite` | `artifacts/test/l0-core/<run_id>/integration/` | TC-OUTBOX-001、TC-TXN-001、TC-QUERY-002 | 一致性 |
| EV-WORKER-001 | job / worker 报告 | `worker_job_suite` | `artifacts/test/l0-core/<run_id>/worker/` | TC-JOB-* | 后台承接 |
| EV-CONFIG-001 | 配置测试报告 | `config_smoke_suite` + config failure gate | `artifacts/test/l0-core/<run_id>/config/` | TC-CONFIG-* | 配置门禁 |
| EV-AUDIT-001 | 审计证据报告 | audit fixture / trace query | `artifacts/test/l0-core/<run_id>/audit/` | TC-AUDIT-001 | 可追溯 |
| EV-TRACE-001 | trace 传播报告 | log / audit / event scan | `artifacts/test/l0-core/<run_id>/trace/` | TC-AUDIT-001、TC-E2E-001 | 可观测 |
| EV-SEC-001 | 禁止正文入仓扫描报告 | negative fixture scan | `artifacts/test/l0-core/<run_id>/security/body_boundary/` | TC-SCOPE-002 | 安全边界 |
| EV-SEC-002 | raw secret 扫描报告 | config / log / audit scan | `artifacts/test/l0-core/<run_id>/security/secret_boundary/` | TC-CONFIG-003 | 密钥边界 |
| EV-NFR-001 | 性能 / job / query baseline 报告 | `nfr_baseline_suite` | `artifacts/test/l0-core/<run_id>/nfr/` | TC-NFR-001 | 非功能 |
| EV-E2E-001 | 最小闭环报告 | `e2e_minimal_loop_suite` | `artifacts/test/l0-core/<run_id>/e2e/minimal_loop/` | TC-E2E-001 | 发布候选 |
| EV-NIGHTLY-001 | nightly 恢复 / 并发报告 | `nightly_fault_recovery_suite` | `artifacts/test/l0-core/<run_id>/nightly/` | TC-CONC-*、TC-JOB-*、TC-OUTBOX-* | 残余风险 |

### 7.2 测试报告结构

```text
L0-core Test Report
  run_id
  commit
  config_profile
  started_at / finished_at
  suite summary
  P0 case result table
  failed / skipped cases
  defect links
  evidence index
  one-vote-veto check
  residual risk table
```

### 7.3 证据字段要求

| 字段 | 作用 |
|---|---|
| `run_id` | 唯一标识一次测试执行 |
| `commit` | 关联被测代码版本 |
| `suite` | 关联自动化套件 |
| `case_id` | 关联测试用例 |
| `evidence_id` | 关联测试方案和验收标准 |
| `config_profile` | 关联环境 / 配置矩阵 |
| `result` | pass / fail / skipped / infra_failure |
| `trace_id` | 关联日志、审计、事件或 job |
| `redaction_check` | 确认证据不含 raw secret 或禁止正文 |

## 8. 回填草稿

```md
## 13. 测试报告与证据归档

> 校准来源：
> - `design-calibration/05_test_plan_step_13_evidence_report.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“证据归档表”“测试报告结构”和“证据字段要求”小节,了解测试证据如何被后续验收标准引用。

测试方案只定义证据要求,不填写执行结论。测试执行结果由后续测试报告或 CI artifact 产生。

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| EV-UNIT-001 | 单元测试报告 | `unit_domain_suite` | `artifacts/test/l0-core/<run_id>/unit/` | TC-CMD-*、TC-IDEM-* | 领域不变量 |
| EV-SVC-001 | 应用服务测试报告 | `service_command_query_suite` | `artifacts/test/l0-core/<run_id>/service/` | TC-CMD-*、TC-QUERY-* | P0 主线 |
| EV-CONTRACT-002 | CloudEvent / relay boundary 报告 | `outbox_relay_boundary_suite` | `artifacts/test/l0-core/<run_id>/contract/outbox/` | TC-EVENT-001、TC-OUTBOX-* | 事实传播边界 |
| EV-CONFIG-001 | 配置测试报告 | `config_smoke_suite` + config failure gate | `artifacts/test/l0-core/<run_id>/config/` | TC-CONFIG-* | 配置门禁 |
| EV-E2E-001 | 最小闭环报告 | `e2e_minimal_loop_suite` | `artifacts/test/l0-core/<run_id>/e2e/minimal_loop/` | TC-E2E-001 | 发布候选 |

每份证据必须包含 `run_id`、`commit`、`suite`、`case_id`、`evidence_id`、`config_profile`、`result` 和必要的 `trace_id`。证据不得包含 raw secret、外部正文全文或生产敏感数据。
```

## 9. 待确认事项

- 具体 CI artifact bucket、路径或制品仓库是否由 `07-实施计划.md` 指定。
- P0 release gate 证据的组织级保留周期是否需要在运维手册中进一步固定。

## 10. 进入下一步条件

- [x] P0 用例都有证据归档方式。
- [x] 证据保存语义、字段和安全边界已定义。
- [x] 测试方案未填写执行结论。
- [x] 可以进入 Step 14 定义回归策略与残余风险。
