# L1-conversation 05 测试方案 Step 13: 定义测试报告与证据归档

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §13 测试报告与证据归档
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 定义测试报告与证据归档 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_13_reports_evidence.md` |

本步定义测试执行后的原始 artifact、可读 report、验收交接报告、EV 编号和归档索引。回归策略、残余风险和正式 `05-测试方案.md` 汇总分别留给 Step 14 和 Step 15。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_05_traceability_matrix.md` | FR / BR / NFR 到证据类别的追溯 | 作为 EV 分组来源 |
| `05_test_plan_step_06_cases.md` | TC 矩阵和证据占位 | 作为 EV 与 TC 映射来源 |
| `05_test_plan_step_09_automation_ci_gates.md` | suite、script、artifact、report 输出 | 作为目录结构和报告生成来源 |
| `05_test_plan_step_10_special_nonfunctional.md` | redaction、观测、恢复和路径红线 | 作为 redaction / veto 证据来源 |
| `05_test_plan_step_11_defects_retest.md` | 缺陷关闭证据和风险接受规则 | 作为 failure / retest / risk report 来源 |
| `05_test_plan_step_12_entry_exit_criteria.md` | 退出准则和证据路径前置 | 作为 evidence readiness 门禁来源 |
| `03-详细设计.md` §15.4 / `04-配置设计.md` §7 / §11 / §12 | scripts、artifacts、reports、redaction 和 path shape | 作为路径真相源 |

## 3. SOP 问题回答

### 3.1 每类测试输出什么证据?

每类测试至少输出 suite `report.json`、stdout / stderr、failure summary、TC result、EV 索引项和 redaction / boundary 扫描结果。Service、worker、job、query 和 release gate 还必须输出状态断言、event / outbox / handoff / projection 摘要、trace / audit refs 和 path shape 结果。

### 3.2 证据保存在哪里?

原始机器证据固定保存到 `artifacts/test/<run_id>`。人类可读报告固定保存到 `reports/runs/<run_id>`。验收交接材料固定保存到 `reports/acceptance`。不得出现 `artifacts/test/<project>/<run_id>`、`reports/<project>` 或 `latest`。

### 3.3 证据如何关联用例和验收项?

`artifacts/test/<run_id>/evidence-index.json` 记录 EV、TC、suite、artifact path、report path、design source 和验收主题。`reports/runs/<run_id>/evidence-index.md` 是人类可读索引。正式 AC 编号不在本步生成,由 `06-验收标准.md` 生成后回指本步 EV。

### 3.4 哪些日志、trace、DB snapshot 或报告必须保留?

必须保留 stdout / stderr、suite report、failure summary、redaction check、gate results、trace / audit ref 摘要、outbox / handoff / projection / consistency diagnostic 摘要。若实现使用 DB 或持久化 store,只保留脱敏 schema / row-count / key refs / digest 摘要,不得保存完整业务正文或 raw secret。

### 3.5 证据保留多久?

P0 release candidate 的 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 至少保留到对应验收结论关闭。`reports/acceptance` 保留到当前 release line 的验收交接完成。非 release 的 PR / main CI 证据可按实现仓 CI 策略清理,但不得影响被验收引用的固定 `<run_id>`。

### 3.6 原始机器证据是否统一进入 `artifacts/test/<run_id>`?

是。所有 gate、test runner、redaction scan、failure summary 和 run metadata 均进入 `artifacts/test/<run_id>`。不允许把原始机器证据散落到 `reports/` 或项目名子目录。

### 3.7 人类可读报告是否统一进入 `reports/runs/<run_id>`?

是。`scripts/reports/generate_reports.sh` 从 `artifacts/test/<run_id>` 生成 `reports/runs/<run_id>` 下的 summary、evidence index、gate results、redaction check 和 suite reports。

### 3.8 验收交接报告是否统一进入 `reports/acceptance`?

是。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 是验收交接固定入口。脚本可以生成初稿,但必须由人或 Agent 审查补充后才能作为验收交接依据。

### 3.9 哪些报告由 `scripts/reports/*` 自动生成?

`summary.md`、`evidence-index.md`、`gate-results.md`、suite report、redaction check 汇总和 acceptance 初稿可以由 `scripts/reports/generate_reports.sh` 生成。若后续实现拆分脚本,不得改变输入输出路径和 EV / TC / suite 追溯结构。

### 3.10 哪些报告必须由人或 Agent 审查补充?

`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、`reports/review/reviewer-notes.md` 和 `reports/review/agent-review.md` 必须由人或 Agent 审查补充。自动生成的初稿不能替代审查结论。

### 3.11 失败 suite 是否仍产出 `report.json`、stdout/stderr log 和 failure reason?

是。失败 suite 仍必须产出 `report.json`、`stdout.log`、`stderr.log`、`failure-summary.md` 或等价 machine-readable failure reason。P0 失败不得只用 CI 红叉表示。

### 3.12 redaction / boundary scan 如何证明 artifact 和 report 不含 raw secret 或完整业务正文?

`scripts/checks/check_redaction.sh` 必须扫描 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。报告中只保留命中类别、路径、字段名、safe digest 或 redacted marker,不得复制 raw secret、token、private key、runtime reasoning body、bridge platform body 或完整业务正文。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧稿没有 run-scoped artifact / report / acceptance 三层证据结构 | 不继承旧证据结构 |
| Step 5 | 只有证据类别,没有 EV 编号 | 本步生成 EV 编号和追溯索引 |
| Step 6 | 用例证据列均为“待 Step 13” | 本步为 TC 分配 EV |
| Step 9 | 已定义脚本和输出路径 | 本步细化目录树、报告结构和脚本映射 |
| Step 11 / 12 | 已定义关闭证据和退出准则 | 本步转为验收交接报告和 evidence readiness |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 证据编号 | 只有类别和占位 | 生成 `EV-CONV-*` 编号 |
| 证据位置 | 只知道 artifact / report root | 明确 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 目录树 |
| 用例追溯 | TC 只写待 Step 13 | TC 映射到 EV 和验收主题 |
| 报告生成 | 脚本路径已知 | 明确哪些自动生成、哪些需人 / Agent 审查 |
| 失败证据 | 缺少失败 suite 归档规则 | 失败也必须保留 report、log 和 failure reason |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| EV 粒度 | 每个 TC 一个 EV | 按证据族聚合,一个 EV 覆盖一组同源 TC | B | 保持索引可读,又能覆盖全部 P0 |
| AC 编号是否本步生成 | 本步生成 AC | 只写验收主题,正式 AC 留给 06 | B | 避免测试方案越权定义验收标准 |
| reports/acceptance 是否全自动 | 只由脚本生成 | 脚本初稿 + 人 / Agent 审查补充 | B | 验收交接需要解释范围、风险和否决结论 |
| 失败 suite 是否产出报告 | 失败不产出 | 失败也产出最小报告和 failure reason | B | 缺陷复验和验收裁决需要失败证据 |
| 是否保存 DB snapshot 全量 | 保存完整 dump | 只保存脱敏摘要和 refs | B | Conversation 禁止保存完整业务正文和 secret |

## 7. 结构化中间产物

### 7.1 artifacts 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/design-baseline.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/failure-summary.md
  suites/<suite>/tc-results.json
  suites/<suite>/redaction-scan.json
  diagnostics/<suite>/*.json
```

关键说明:

- `meta/context.json` 记录 run id、profile、started_at、commit、config profile 和 script versions。
- `evidence-index.json` 是机器可读 EV / TC / suite / artifact / report 索引。
- `diagnostics` 只能保存 safe refs、state、count、digest 和 error category,不得保存完整业务正文。
- 失败 suite 必须保留最小 `report.json`、stdout / stderr 和 failure summary。

### 7.2 reports 目录结构

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    suites/<suite>.md
    evidence/EV-CONV-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

关键说明:

- `reports/runs/<run_id>` 从固定 `artifacts/test/<run_id>` 生成,不得引用 `latest`。
- `reports/acceptance/*` 可以由脚本生成初稿,但必须有人或 Agent 审查。
- `reports/review/*` 记录审查补充,不改写原始机器结果。

### 7.3 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| EV-CONV-TRUTH-001 | space / scope truth result | PR / main service suite | `reports/runs/<run_id>/evidence/EV-CONV-TRUTH-001.md` | TC-CONV-SPACE-001~003; TC-CONV-SCOPE-001~002 | 06 待映射: conversation truth / scope |
| EV-CONV-FACT-001 | fact append / retract / idempotency result | main service suite | `reports/runs/<run_id>/evidence/EV-CONV-FACT-001.md` | TC-CONV-FACT-001~005; TC-CONV-TX-001 | 06 待映射: append-only fact |
| EV-CONV-AUTH-001 | authorized query and search result | main query suite | `reports/runs/<run_id>/evidence/EV-CONV-AUTH-001.md` | TC-CONV-QUERY-001~004; TC-CONV-SEARCH-001 | 06 待映射: authorized consumption |
| EV-CONV-MAN-001 | manifestation and source isolation result | service / integration-like suite | `reports/runs/<run_id>/evidence/EV-CONV-MAN-001.md` | TC-CONV-MAN-001~003 | 06 待映射: cross-domain manifestation |
| EV-CONV-CONSUMER-001 | inbound consumer quarantine / ref-only result | worker suite | `reports/runs/<run_id>/evidence/EV-CONV-CONSUMER-001.md` | TC-CONV-CONSUMER-001~003 | 06 待映射: inbound collaboration boundary |
| EV-CONV-HANDOFF-001 | trace / archive handoff result | service / job suite | `reports/runs/<run_id>/evidence/EV-CONV-HANDOFF-001.md` | TC-CONV-TRACE-001; TC-CONV-HANDOFF-001~003 | 06 待映射: trace and archive handoff |
| EV-CONV-OUTBOX-001 | outbox publish / retry / rerun result | worker / job suite | `reports/runs/<run_id>/evidence/EV-CONV-OUTBOX-001.md` | TC-CONV-OUTBOX-001~003 | 06 待映射: event collaboration |
| EV-CONV-DERIVED-001 | projection / cursor / consistency result | job / operations-replay suite | `reports/runs/<run_id>/evidence/EV-CONV-DERIVED-001.md` | TC-CONV-DERIVED-001~002; TC-CONV-CURSOR-001; TC-CONV-CONSISTENCY-001 | 06 待映射: derived views and diagnostics |
| EV-CONV-CONFIG-001 | config and path shape result | main config / release report suite | `reports/runs/<run_id>/evidence/EV-CONV-CONFIG-001.md` | TC-CONV-CONFIG-001; TC-CONV-REPORT-001 | 06 待映射: configuration and evidence path |
| EV-CONV-REDACTION-001 | redaction / boundary scan result | release redline + `check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` | TC-CONV-FACT-004; TC-CONV-CONSUMER-003; TC-CONV-REDACTION-001 | 06 待映射: data ownership veto |
| EV-CONV-GATE-001 | gate results and suite status | `run_ci_gate.sh` + report generator | `reports/runs/<run_id>/gate-results.md` | all P0-blocking TC | 06 待映射: P0 gate completeness |
| EV-CONV-ACCEPT-001 | acceptance handoff and veto checklist | report script + human / Agent review | `reports/acceptance/handoff.md`; `reports/acceptance/veto-checklist.md` | all P0 EV | 06 待映射: acceptance handoff |

### 7.4 报告生成映射表

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| run summary | `artifacts/test/<run_id>/meta/context.json`; suite reports | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/summary.md` | 检查范围、baseline 和失败摘要 |
| evidence index | `artifacts/test/<run_id>/evidence-index.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV / TC / suite / path 可追溯 |
| gate results | suite `report.json` and failure summaries | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/gate-results.md` | 检查 P0-blocking suite 是否齐全 |
| redaction check | artifact + report scan output | `scripts/checks/check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` | 命中项必须人工确认是否一票否决 |
| suite reports | `artifacts/test/<run_id>/suites/<suite>` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释是否准确 |
| EV detail reports | evidence index + suite artifacts | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/evidence/EV-CONV-*.md` | 检查 EV 覆盖的 TC 是否完整 |
| acceptance handoff | run reports + EV index | report script 初稿 | `reports/acceptance/handoff.md` | 必须补交付范围、baseline、结论和限制 |
| veto checklist | redaction、auth、source isolation、path shape EV | report script 初稿 | `reports/acceptance/veto-checklist.md` | 必须逐项审查所有一票否决项 |
| risk acceptance | S2 / S3 defects and residual risk | report script 初稿 | `reports/acceptance/risk-acceptance.md` | 仅有条件通过时填写,需 owner 和修复时间 |
| open issues | failure summaries and defect tracker refs | report script 初稿 | `reports/acceptance/open-issues.md` | 检查是否存在 S0 / S1 未关闭 |

### 7.5 evidence-index 最小字段

| 字段 | 含义 | 示例 |
|---|---|---|
| `run_id` | 固定测试运行 ID | `run-conv-20260602-001` |
| `evidence_id` | EV 编号 | `EV-CONV-FACT-001` |
| `tc_ids` | 覆盖的 TC | `["TC-CONV-FACT-001"]` |
| `suite` | 生成 suite | `SUITE-CONV-MAIN-SERVICE` |
| `artifact_paths` | 原始机器证据路径 | `artifacts/test/<run_id>/suites/main-service/report.json` |
| `report_paths` | 人类可读报告路径 | `reports/runs/<run_id>/evidence/EV-CONV-FACT-001.md` |
| `design_sources` | 设计来源 | `03_ddd_step_09_function_flows.md` |
| `acceptance_theme` | 待 06 映射验收主题 | `append-only fact` |
| `redaction_status` | 脱敏扫描状态 | `passed` / `failed` |

### 7.6 保留与清理规则

| 证据 | 保留规则 | 禁止事项 |
|---|---|---|
| release candidate raw artifacts | 至少保留到对应验收结论关闭 | 不得清理被 `reports/acceptance` 引用的 `<run_id>` |
| release candidate run reports | 至少保留到验收交接完成 | 不得改写已引用报告内容 |
| acceptance reports | 保留到当前 release line 验收交接完成 | 不得用未审查初稿宣称通过 |
| PR / main non-release artifacts | 按实现仓 CI 策略清理 | 不得作为正式验收引用 |
| redaction failure materials | 保留命中类别和 redacted path | 不得保存 raw secret 或完整正文 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §13 时摘录。

```markdown
## 13. 测试报告与证据归档

> 校准来源：
> - `design-calibration/05_test_plan_step_13_reports_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“artifacts 目录结构”“reports 目录结构”“证据归档表”“报告生成映射表”和“evidence-index 最小字段”小节，了解 P0 测试证据如何从机器原始产物追溯到验收交接材料。

原始机器证据固定写入 `artifacts/test/<run_id>`。人类可读运行报告固定写入 `reports/runs/<run_id>`。验收交接报告固定写入 `reports/acceptance`。正式证据引用必须绑定固定 `<run_id>`,不得引用 `latest`,不得增加 `<project>` 层级。

证据 ID 使用 `EV-CONV-<TYPE>-<NNN>`。`artifacts/test/<run_id>/evidence-index.json` 和 `reports/runs/<run_id>/evidence-index.md` 必须记录 EV、TC、suite、artifact path、report path、设计来源和验收主题。正式 AC 编号由 `06-验收标准.md` 生成后回指本章 EV。

`scripts/reports/generate_reports.sh` 负责从 `artifacts/test/<run_id>` 生成报告初稿。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 必须由人或 Agent 审查补充后才能作为验收交接依据。redaction / boundary scan 失败时,不得通过证据门禁。
```

## 9. 待确认事项

无阻塞进入 Step 14 的待确认事项。

后续 Step 必须继续收口:

- Step 14 处理 `reports/acceptance/risk-acceptance.md` 中允许存在的 S2 / S3 残余风险。
- Step 15 汇总正式 `05-测试方案.md` 时,必须保留 EV 表和目录结构,不得把证据路径改为自然语言描述。
- `06-验收标准.md` 生成正式 AC ID 后,必须回指本步 EV 和 `reports/runs/<run_id>/evidence-index.md`。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例都有证据归档方式 | 通过 | Step 6 所有 P0-blocking TC 均映射到 EV |
| artifacts / reports / acceptance 目录清晰 | 通过 | 三层路径固定且无 `<project>` / `latest` |
| 报告生成和审查责任清晰 | 通过 | scripts 生成初稿,人 / Agent 审查交接材料 |
| redaction / boundary 证据清晰 | 通过 | artifact 和 report 均需扫描 |
| 可以进入 Step 14 | 通过 | 下一步定义回归策略与残余风险 |
