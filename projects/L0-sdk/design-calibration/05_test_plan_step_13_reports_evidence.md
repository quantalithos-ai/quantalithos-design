# L0-sdk 05 测试方案 Step 13:定义测试报告与证据归档

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §13 测试报告与证据归档
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 定义测试报告与证据归档 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_13_reports_evidence.md` |

本步只定义证据要求、目录结构、报告脚本映射和审查补充要求,不填写任何实际执行结论。回归策略与残余风险留给 Step 14。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_05_traceability_matrix.md` | 继承 `EV-SDK-*` 证据编号和需求 / 用例追溯 |
| `05_test_plan_step_06_cases.md` | 继承 `TC-SDK-*` 用例族、断言点和自动化候选 |
| `05_test_plan_step_09_automation_ci_gates.md` | 继承 gate / check / report 脚本、artifact root 和 report root |
| `05_test_plan_step_10_special_nonfunctional.md` | 继承专项证据、redaction / boundary scan 和观测证据要求 |
| `05_test_plan_step_11_defects_retest.md` | 继承缺陷关闭所需失败证据、修复证据和复验证据 |
| `05_test_plan_step_12_entry_exit_criteria.md` | 继承退出时必须存在的 artifact、report、case result 和 evidence ref |

## 3. SOP 问题回答

### 3.1 每类测试输出什么证据?

| 测试类别 | 输出证据 |
|---|---|
| contract / DTO / schema | schema roundtrip result、field validation result、error envelope result |
| semantic / language surface | semantic baseline report、language surface diff、concept map check |
| boundary / event | boundary receipt、fake marker、diagnostic ref、event mapping report |
| trace / security | error mapping report、trace propagation report、redaction scan result |
| candidate / docs / smoke | candidate receipt、artifact digest、install result、docs runner result、smoke result |
| compatibility / deprecated | compatibility decision、migration guide ref、deprecated lifecycle result |
| consistency / recovery | idempotency replay result、conflict result、outbox retry result、projection rebuild result |
| observability | metrics sample, audit event sample, diagnostic ref and forbidden field scan |

### 3.2 证据保存在哪里?

| 证据层级 | 保存位置 |
|---|---|
| 原始机器证据 | `artifacts/test/<run_id>` |
| 人类可读 run report | `reports/runs/<run_id>` |
| 验收交接报告 | `reports/acceptance` |
| 人 / Agent 审查补充 | `reports/review` |

禁止使用 `artifacts/test/<project>/<run_id>`、`reports/<project>` 或 `latest`。

### 3.3 证据如何关联用例和验收项?

每条证据必须通过以下字段关联:

| 关联字段 | 用途 |
|---|---|
| `run_id` | 关联一次测试执行 |
| `suite_id` | 关联 PR / main / nightly / candidate / staging suite |
| `case_id` | 关联 `TC-SDK-*` 用例 |
| `evidence_id` | 关联 `EV-SDK-*` 证据 |
| `requirement_id` / `rule_id` | 关联 F / BR / 非功能 / 一票否决 |
| `artifact_ref` | 指向原始机器证据 |
| `report_ref` | 指向人类可读报告 |

### 3.4 哪些日志、trace、DB snapshot 或报告必须保留?

| 材料 | 保留要求 |
|---|---|
| stdout / stderr | 每个 suite 必须保留,失败 suite 也必须保留 |
| `report.json` | 每个 suite 必须生成,失败时也必须包含 failure reason |
| trace / diagnostic refs | 必须保留 ref 和 safe summary,不得保存完整业务正文 |
| repository / store snapshot | 仅在 integration / recovery failure 需要时保留 sanitized snapshot |
| metrics / audit sample | 观测专项必须保留低基数字段和审计事件摘要 |
| redaction / boundary scan report | security、candidate、report check 必须保留 |
| acceptance handoff | 验收交接时必须保留摘要、veto checklist、risk acceptance 和 open issues |

### 3.5 证据保留多久?

| 证据类型 | 保留规则 |
|---|---|
| P0 通过证据 | 至少保留到本轮验收完成并归档 |
| P0 失败证据 | 至少保留到缺陷关闭、复验通过并完成验收审查 |
| S0 / S1 缺陷证据 | 随缺陷记录保留,不得在关闭前清理 |
| P1 / P2 风险证据 | 保留到风险被接受、转入后续计划或关闭 |
| 本地临时 fixture | 可在 report 和 evidence index 生成后清理 |

更长期归档周期由实施计划或运维策略定义,测试方案只规定最小保留口径。

### 3.6 原始机器证据是否统一进入 `artifacts/test/<run_id>`?

是。所有 gate、check、suite 和 failure artifact 的机器输出必须进入 `artifacts/test/<run_id>`。该目录可以按 suite 分层,但不得额外加项目名层级。

### 3.7 人类可读报告是否统一进入 `reports/runs/<run_id>`?

是。每次测试执行的人类可读报告必须进入 `reports/runs/<run_id>`。该目录包含 summary、evidence index、gate results、redaction check、suite report 和 per-evidence 说明。

### 3.8 验收交接报告是否统一进入 `reports/acceptance`?

是。验收交接报告统一进入 `reports/acceptance`,并引用固定 `run_id`。验收交接不得引用 `latest`。

### 3.9 哪些报告由 `scripts/reports/*` 自动生成?

| 报告 | 生成脚本 |
|---|---|
| run summary | `scripts/reports/generate_reports.sh` |
| evidence index | `scripts/reports/generate_reports.sh` |
| gate results | `scripts/reports/generate_reports.sh` |
| suite markdown reports | `scripts/reports/generate_reports.sh` |
| acceptance summary | `scripts/reports/generate_acceptance_summary.sh` |

### 3.10 哪些报告必须由人或 Agent 审查补充?

| 报告 | 审查补充要求 |
|---|---|
| `reports/acceptance/handoff.md` | 补充验收结论、固定 run id 和交接说明 |
| `reports/acceptance/veto-checklist.md` | 逐项确认一票否决是否触发 |
| `reports/acceptance/risk-acceptance.md` | 补充 S2 / S3 或 P1 / P2 风险接受原因和 owner |
| `reports/acceptance/open-issues.md` | 列出非阻断遗留问题和后续入口 |
| `reports/review/agent-review.md` | 由 Agent 汇总证据一致性和缺口 |
| `reports/review/reviewer-notes.md` | 由人类 reviewer 补充判断和裁决意见 |

### 3.11 失败 suite 是否仍产出 `report.json`、stdout/stderr log 和 failure reason?

是。失败 suite 必须仍产出:

```text
suites/<suite>/report.json
suites/<suite>/stdout.log
suites/<suite>/stderr.log
suites/<suite>/failure-reason.md
```

缺少 failure report 本身会阻断退出。

### 3.12 redaction / boundary scan 如何证明 artifact 和 report 不含 raw secret 或完整业务正文?

`scripts/checks/check_redaction.sh` 必须扫描 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。报告必须列出扫描范围、禁止模式、命中数量和结果。通过条件是 raw secret、token、private key、credential value、request / response / payload body 命中数均为 0。

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 缺少新版 artifact / report 目录约束,也没有定义失败 suite 的证据要求 |
| Step 5 / Step 6 | 已有 `EV-SDK-*` 和 `TC-SDK-*`,但还未定义证据归档格式 |
| Step 9 | 已定义脚本和输出根,本步需要补齐目录结构和报告内容 |
| Step 12 | 已要求退出时证据存在,本步需要定义证据如何生成和保存 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 原始证据位置 | 容易散落或带项目名层级 | 统一 `artifacts/test/<run_id>` |
| 人类可读报告 | 未固定 | 统一 `reports/runs/<run_id>` |
| 验收报告 | 未固定 | 统一 `reports/acceptance` |
| 失败 suite | 可能只有退出码 | 必须有 `report.json`、stdout、stderr 和 failure reason |
| 审查补充 | 未区分自动生成和人工判断 | `scripts/reports/*` 生成初稿,人 / Agent 补充 acceptance / review |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否在测试方案填写执行结论 | 不填写 | 本章只定义证据要求 |
| 是否允许 `latest` | 不允许 | 验收证据必须可追溯到固定 `run_id` |
| 是否保留完整业务正文用于调试 | 不允许 | 只能保留 ref、digest、safe summary 和 redacted evidence |
| 是否把报告生成脚本放在 `reports/` | 不允许 | `reports/` 是输出目录,脚本必须在 `scripts/reports/` |

## 7. 结构化中间产物

### 7.1 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| `EV-SDK-CONTRACT-001` | contract / snapshot evidence | PR / main gate | `artifacts/test/<run_id>/pr/contract` | `TC-SDK-CONTRACT-*` | F-001 / BR-001 / BR-002 |
| `EV-SDK-SEMANTIC-001` | semantic baseline evidence | PR / candidate gate | `artifacts/test/<run_id>/candidate/smoke` | `TC-SDK-SEMANTIC-*` | F-002 / BR-003 |
| `EV-SDK-BOUNDARY-001` | boundary receipt evidence | integration / candidate gate | `artifacts/test/<run_id>/main/integration` | `TC-SDK-BOUNDARY-*` | F-003 / BR-004 / BR-011 |
| `EV-SDK-EVENT-001` | event mapping evidence | main event gate | `artifacts/test/<run_id>/main/event` | `TC-SDK-EVENT-*` | F-004 / BR-001 / BR-002 |
| `EV-SDK-TRACE-001` | error / trace evidence | PR / smoke gate | `artifacts/test/<run_id>/pr/service` | `TC-SDK-TRACE-*` | F-005 |
| `EV-SDK-SECURITY-001` | redaction / credential evidence | PR / candidate redaction | `artifacts/test/<run_id>/main/checks` | `TC-SDK-SECURITY-*` | F-006 / BR-007 / BR-013 |
| `EV-SDK-CANDIDATE-001` | candidate / artifact evidence | candidate gate | `artifacts/test/<run_id>/candidate/build` | `TC-SDK-CANDIDATE-*` | F-007 |
| `EV-SDK-DOCS-001` | docs runner evidence | candidate gate | `artifacts/test/<run_id>/candidate/docs` | `TC-SDK-DOCS-*` | F-008 |
| `EV-SDK-SMOKE-001` | cross-language smoke evidence | candidate / nightly gate | `artifacts/test/<run_id>/candidate/smoke` | `TC-SDK-SMOKE-*` | F-009 |
| `EV-SDK-COMPAT-001` | compatibility / deprecated evidence | candidate / nightly gate | `artifacts/test/<run_id>/candidate/compat` | `TC-SDK-COMPAT-*` | F-010 / BR-014 |

### 7.2 报告结构表

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| `summary.md` | all suite reports | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/summary.md` | 审查 P0 是否全通过 |
| `evidence-index.md` | `evidence-index.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 evidence 与 case / requirement 关联 |
| `gate-results.md` | gate report.json | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/gate-results.md` | 检查阻断 gate 结果 |
| `redaction-check.md` | redaction check artifact | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/redaction-check.md` | 检查泄露次数为 0 |
| `suites/<suite>.md` | suite report.json | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败原因和复验状态 |
| `handoff.md` | run reports | `scripts/reports/generate_acceptance_summary.sh` | `reports/acceptance/handoff.md` | 人 / Agent 补充验收交接 |
| `risk-acceptance.md` | defects / risks | 手动或 Agent 补充 | `reports/acceptance/risk-acceptance.md` | owner、原因、期限必须齐全 |

### 7.3 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/failure-reason.md

reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    suites/<suite>.md
    evidence/EV-SDK-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §13 时摘录。

```markdown
## 13. 测试报告与证据归档

> 校准来源：
> - `design-calibration/05_test_plan_step_13_reports_evidence.md`

原始机器证据统一进入 `artifacts/test/<run_id>`,人类可读报告统一进入 `reports/runs/<run_id>`,验收交接报告统一进入 `reports/acceptance`。所有正式证据引用必须绑定固定 `run_id`,不得引用 `latest`,不得使用 `artifacts/test/<project>/<run_id>` 或 `reports/<project>`。

每个 suite 无论成功或失败都必须产出 `report.json`、`stdout.log`、`stderr.log`;失败 suite 还必须产出 failure reason。`scripts/reports/*` 负责生成报告初稿,`reports/acceptance/*` 和 `reports/review/*` 允许人 / Agent 审查补充。artifact 和 report 不得包含 raw secret、token、private key、credential value 或完整业务正文。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否允许报告引用 `latest` | 不允许 | 验收和缺陷复验需要稳定 `run_id` |
| 是否保留失败 suite 输出 | 必须保留 | 缺陷分级和复验需要 failure reason |
| 是否由脚本填写最终验收结论 | 不由脚本单独填写 | 验收交接需要人 / Agent 审查补充 |
| 是否保存完整业务正文便于调试 | 不保存 | 安全红线要求只保存 ref、digest 和 safe summary |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每类测试输出证据已定义 | 已满足 |
| 证据保存位置已定义 | 已满足 |
| 证据关联用例和验收项规则已定义 | 已满足 |
| 必须保留的日志、trace、snapshot 和报告已定义 | 已满足 |
| 证据保留规则已定义 | 已满足 |
| artifact / report / acceptance / review 目录结构已定义 | 已满足 |
| 报告生成脚本和人工 / Agent 审查补充要求已定义 | 已满足 |
| P0 用例都有证据归档方式 | 已满足 |

Step 14 可以在本文件被确认后开始,主题是定义回归策略与残余风险。
