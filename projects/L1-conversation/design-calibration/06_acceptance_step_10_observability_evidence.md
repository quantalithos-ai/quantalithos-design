# L1-conversation 06 验收标准 Step 10: 定义可观测性、审计与证据门禁

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §10 可观测性、审计与证据门禁
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义可观测性、审计与证据门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_10_observability_evidence.md` |

本步定义哪些日志、指标、审计、EV、报告和 acceptance handoff 必须存在,才能支持验收裁决。它不重新定义测试用例、不写运维 dashboard,也不提前合并 Step 11 的一票否决清单。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `03-详细设计.md` §14 | 日志、指标、审计事件和字段边界 | 作为 observability / audit 真相源 |
| `03_ddd_step_15_observability_audit.md` | 完整日志表、指标表、审计事件表和禁止字段表 | 作为本步审计门禁来源 |
| `05-测试方案.md` §13 | artifacts / reports / acceptance 目录和 EV 编号 | 作为证据路径真相源 |
| `05_test_plan_step_13_reports_evidence.md` | EV 归档、报告生成、evidence-index 字段和保留规则 | 作为证据完整性来源 |
| `05-测试方案.md` §9 / §10 / §11 | suite、redaction、缺陷和 release gate 规则 | 作为 gate 和 redaction 裁决来源 |
| `06_acceptance_step_09_nonfunctional_gate.md` | AC-NFR-007、AC-NFR-010、AC-NFR-011、AC-NFR-012 | 作为非功能证据承接来源 |

## 3. SOP 问题回答

### 3.1 哪些行为必须有 audit record?

写 truth、改变 scope / visibility、追加或撤回 fact、显化跨域事实、创建 review anchor、请求 trace / archive handoff、消费 inbound event、产生 idempotency conflict、拒绝 boundary violation、推进 outbox、projection、reference、handoff、consistency report 和 cursor state 的行为必须有 audit 或 evidence ref。普通 query 可只记录日志 / 指标,但 visibility denied、cursor invalid、trace / review / projection 等敏感查询必须可追溯。

### 3.2 哪些行为必须有 trace / log / metric?

10 个 Command、11 个 Query、6 个 Inbound Consumer、outbox publish、resolver / snapshot refresh、projection / cursor job、trace / archive handoff、operations job、repository / UnitOfWork error、config validation 和 redaction / boundary violation 都必须至少形成 safe log 或 metric。日志和 trace 只能包含 stable ref、operation、state、error code、duration 和 safe diagnostic ref。

### 3.3 哪些测试报告必须归档?

必须归档 `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md`、suite report、EV detail report、`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md`。失败 suite 也必须有 `report.json`、stdout / stderr、failure summary 和 machine-readable failure reason。

### 3.4 证据缺失是否导致不通过?

P0 EV、gate result、redaction check、release report 或 acceptance handoff 缺失时,送验不成立或不通过。`redaction-check.md` 命中 raw secret、raw body、runtime reasoning body、bridge platform body 或 artifact body 时,不得通过证据门禁。`risk-acceptance.md` 缺 owner、后续动作或截止时间时,不得有条件通过。

### 3.5 证据如何被复查?

复查从 `reports/runs/<run_id>/evidence-index.md` 开始,回指 `reports/runs/<run_id>/evidence/EV-CONV-*.md`、suite report 和 `artifacts/test/<run_id>` 的机器证据。`reports/acceptance/*` 必须由人或 Agent 审查补充,不得把自动生成初稿当作最终验收结论。

### 3.6 `reports/runs/<run_id>/evidence-index.md` 是否覆盖全部 P0 EV?

必须覆盖 `EV-CONV-TRUTH-001`、`EV-CONV-FACT-001`、`EV-CONV-AUTH-001`、`EV-CONV-MAN-001`、`EV-CONV-CONSUMER-001`、`EV-CONV-HANDOFF-001`、`EV-CONV-OUTBOX-001`、`EV-CONV-DERIVED-001`、`EV-CONV-CONFIG-001`、`EV-CONV-REDACTION-001`、`EV-CONV-GATE-001` 和 `EV-CONV-ACCEPT-001`。

### 3.7 `reports/runs/<run_id>/gate-results.md` 是否覆盖全部 release gate?

必须覆盖 PR / main / nightly / release 中进入送验基线的 suite,尤其是 `SUITE-CONV-MAIN-*`、`SUITE-CONV-RELEASE-REDLINE` 和 `SUITE-CONV-RELEASE-REPORT`。P0-blocking suite 缺结果、失败原因缺失或无法回指 artifact,均视为 gate evidence 不合格。

### 3.8 `reports/runs/<run_id>/redaction-check.md` 是否证明 artifact 和 report 不含 raw secret / raw body?

必须证明 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 均已扫描。通过报告只能包含命中类别、路径、字段名、safe digest 或 redacted marker;失败报告不得复制 raw secret、token、完整业务正文或外部 source body。

### 3.9 `reports/acceptance/handoff.md` 是否已由人 / Agent 审查补充?

必须审查补充。handoff 至少说明送验范围、design baseline、implementation commit / build / image、run id、P0 / P1 边界、controlled seam 范围、风险摘要和最终建议。自动生成初稿不能单独作为通过依据。

### 3.10 `reports/acceptance/veto-checklist.md` 是否覆盖所有一票否决项?

必须覆盖 Step 11 将汇总的全部 veto 候选,包括核心闭环缺失、授权失效、forbidden body / secret 泄漏、source truth 被补造、query / projection / report 反写、fake-as-production、path shape 错误和证据缺失。

### 3.11 `reports/acceptance/risk-acceptance.md` 是否支撑有条件通过?

只有风险属于 P1/P2、S2/S3 或 readiness 缺口,且有 owner、影响、接受理由、后续动作和截止时间时,才支撑有条件通过。S0 / S1、redaction violation、授权失效、source truth isolation 失败和证据路径错误不得风险接受。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 缺少固定 EV、reports 和 acceptance handoff 门禁 | 不继承旧证据结构 |
| `03-详细设计.md` §14 | 已有日志 / 指标 / 审计字段,但不是验收格式 | 本步转成 `AC-OBS-*` / `AC-AUDIT-*` |
| `05-测试方案.md` §13 | 已有 EV 和目录树,但验收影响未裁决 | 本步转成 `AC-EVID-*` 和 report 检查表 |
| Step 9 产物 | 已定义证据路径和 observability 风险 | 本步展开具体文件与缺失影响 |
| Step 11 尚未生成 | veto checklist 的具体否决项尚未正式落地 | 本步先定义 checklist 必须覆盖 Step 11 全量否决项 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 可观测性 | 只说日志 / 指标 / 审计必须安全 | 定义哪些行为必须有 log / metric / audit |
| 证据入口 | 只知道 EV 和路径 | 定义 evidence-index、gate-results、redaction-check 的通过 / 失败口径 |
| acceptance handoff | 只知道目录 | 定义 handoff、veto、risk、open issues 的审查要求 |
| 失败 suite | 可能只有 CI 失败结果 | 必须保留 report、log 和 failure reason |
| redaction | 只作为测试脚本 | 作为证据门禁和一票否决候选输入 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否用口头确认替代缺失 evidence | 可以 | 不可以,必须有固定报告或 risk record | B | 验收必须可复查 |
| acceptance handoff 是否全自动 | 全自动即可 | 脚本初稿 + 人 / Agent 审查补充 | B | 需要解释范围、风险和限制 |
| redaction 失败是否可风险接受 | 可接受 | 不可接受 | B | raw secret / forbidden body 泄漏直接破坏安全边界 |
| 审计是否要求独立 audit store | 要求 | 不要求,先验 receipt / trace / evidence ref | B | 详细设计未定义独立 AuditRepository |
| P0 证据是否从 artifacts 直接读 | 直接读 artifacts | 先读 reports,再回指 artifacts | B | `reports/runs/<run_id>` 是验收可读入口 |

## 7. 结构化中间产物

### 7.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-OBS-001 | safe log / metric / trace | command、query、consumer、outbox、resolver、projection、handoff、job、repository、config、boundary 的 safe log / metric / trace ref | 必须字段存在;标签低基数;禁止字段不存在 | 核心能力成功 / 异常不可观察;日志或指标含正文 / secret / 高风险字段 |
| AC-AUDIT-001 | truth / scope / fact / manifestation audit | space、scope、visibility、fact append / retract、manifestation、review anchor audit 或 evidence ref | 能复盘 actor、subject、source、from / to state、result、reason 和 time | 关键变化无 audit / evidence ref;审计保存 forbidden body |
| AC-AUDIT-002 | outbox / projection / handoff / job audit | outbox published / failed、projection freshness、reference resolution、handoff delivered / failed、consistency report、cursor maintenance audit | 传播、派生、交接和 job 结果可复查 | publish / handoff / rebuild / validation 失败无 evidence |
| AC-EVID-001 | EV 索引 | `reports/runs/<run_id>/evidence-index.md` 和 `artifacts/test/<run_id>/evidence-index.json` | 全部 P0 EV 可回指 TC、suite、artifact、report 和 design source | P0 EV 缺失;索引路径断裂;使用 `latest` 或 `<project>` 层级 |
| AC-EVID-002 | Gate 结果 | `reports/runs/<run_id>/gate-results.md` | P0-blocking suite、release redline、release report 均有结果和失败摘要 | P0 suite 缺结果;失败无原因;gate result 无 artifact 回指 |
| AC-EVID-003 | Redaction / boundary scan | `reports/runs/<run_id>/redaction-check.md` | 扫描 artifacts 和 reports;无 raw secret、raw body、forbidden body;失败只保留 safe hit summary | 命中 raw secret / body;报告复制敏感原文;未扫描 artifacts 或 reports |
| AC-EVID-004 | Suite / failure evidence | `reports/runs/<run_id>/suites/*.md`;`artifacts/test/<run_id>/suites/*` | 成功和失败 suite 都有 report、stdout / stderr、tc-results、failure summary | 失败只有 CI 红叉;缺 stdout / stderr 或 failure reason |
| AC-EVID-005 | Acceptance handoff | `reports/acceptance/handoff.md` | 已审查并说明 baseline、送验范围、run id、commit / build、P0 / P1 边界和结论建议 | 自动初稿未审查;缺 baseline / run id / scope |
| AC-EVID-006 | Veto checklist | `reports/acceptance/veto-checklist.md` | 覆盖 Step 11 全量 veto 项,每项有证据和结论 | veto 项未覆盖;redaction / auth / source isolation 无结论 |
| AC-EVID-007 | Risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时,每项风险有 owner、影响、接受理由、后续动作和截止时间 | 用风险接受覆盖 S0 / S1 或一票否决;风险缺 owner / deadline |
| AC-EVID-008 | Open issues / review notes | `reports/acceptance/open-issues.md`;`reports/review/*.md` | 未关闭问题分级清楚;review 补充不改写机器证据 | S0 / S1 未关闭仍送验;review 改写原始结果 |

### 7.2 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 artifact、TC、suite、design source | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | release gate、P0-blocking suite 和失败摘要完整 | 不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | artifact 和 report 均已扫描;无 raw secret / raw body | 一票否决候选 |
| 运行摘要 | `reports/runs/<run_id>/summary.md` | run id、baseline、profile、commit / build、suite summary 清楚 | 交接不完整 |
| Suite 报告 | `reports/runs/<run_id>/suites/<suite>.md` | 每个送验 suite 都有可读结果和失败说明 | 对应 gate 不成立 |
| EV 明细 | `reports/runs/<run_id>/evidence/EV-CONV-*.md` | EV 关联 TC 和关键断言清楚 | 对应 AC 不能裁决 |
| 验收交接 | `reports/acceptance/handoff.md` | 已审查并说明送验范围 | 交接不完整 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | VETO 全部有结论 | 不通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人和后续动作 | 不得有条件通过 |
| 开放问题 | `reports/acceptance/open-issues.md` | 未关闭问题分级和阻断性清楚 | 不能判断最终结论 |

### 7.3 Acceptance Handoff 检查表

| 检查项 | 必须说明 | 失败影响 |
|---|---|---|
| 送验范围 | 本次验收包含 / 不包含的 AC、suite、profile 和 controlled seam | scope 不清则交接不成立 |
| 基线 | design commit、implementation commit / build / image、config profile、run id | baseline 不清则不能复查 |
| P0 结果 | P0 AC、P0-blocking suite、EV、gate 和 redaction 状态 | 缺结果则不通过 |
| P1 / P2 缺口 | production-like、真实下游、容量数字、dashboard / runbook 等缺口 | 未记录则不得宣称 readiness |
| veto 结论 | Step 11 全量否决项的 pass / fail / not applicable | 缺结论则不通过 |
| risk acceptance | 有条件通过风险的 owner、动作和截止时间 | 缺 owner / deadline 则不得有条件通过 |
| reviewer note | 人 / Agent 审查补充和最终建议 | 未审查则不能作为最终交接 |

### 7.4 证据复查链路图

```text
[reports/acceptance/handoff.md]
  | references run_id and conclusion
  v
[reports/runs/<run_id>/evidence-index.md]
  | maps AC / EV / TC / suite
  v
[reports/runs/<run_id>/evidence/EV-CONV-*.md]
  | links readable assertions
  v
[artifacts/test/<run_id>/suites/<suite>/report.json]
  | contains machine evidence
  v
[stdout / stderr / failure-summary / tc-results / redaction-scan]
```

关键说明:

- 正式验收先读 `reports/runs/<run_id>`,再回指 `artifacts/test/<run_id>`。
- `reports/acceptance` 是交接和结论入口,但不能替代机器证据。
- 失败证据必须保留,否则无法判断缺陷、复验和风险接受。
- 任何层级都不得使用 `latest` 或 `<project>` 目录层。

### 7.5 EV 覆盖清单

| EV | 主题 | 必须覆盖 |
|---|---|---|
| `EV-CONV-TRUTH-001` | space / scope truth | `TC-CONV-SPACE-*`;`TC-CONV-SCOPE-*` |
| `EV-CONV-FACT-001` | fact append / retract / idempotency | `TC-CONV-FACT-*`;`TC-CONV-TX-001` |
| `EV-CONV-AUTH-001` | authorized query / search | `TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001` |
| `EV-CONV-MAN-001` | manifestation / source isolation | `TC-CONV-MAN-*` |
| `EV-CONV-CONSUMER-001` | inbound consumer / quarantine | `TC-CONV-CONSUMER-*` |
| `EV-CONV-HANDOFF-001` | trace / archive handoff | `TC-CONV-TRACE-001`;`TC-CONV-HANDOFF-*` |
| `EV-CONV-OUTBOX-001` | outbox publish / retry / rerun | `TC-CONV-OUTBOX-*` |
| `EV-CONV-DERIVED-001` | projection / cursor / consistency | `TC-CONV-DERIVED-*`;`TC-CONV-CURSOR-001`;`TC-CONV-CONSISTENCY-001` |
| `EV-CONV-CONFIG-001` | config / path shape | `TC-CONV-CONFIG-001`;`TC-CONV-REPORT-001` |
| `EV-CONV-REDACTION-001` | redaction / boundary | `TC-CONV-FACT-004`;`TC-CONV-CONSUMER-003`;`TC-CONV-REDACTION-001` |
| `EV-CONV-GATE-001` | gate status | all P0-blocking TC |
| `EV-CONV-ACCEPT-001` | acceptance handoff | all P0 EV and veto checklist |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §10 时摘录。

```markdown
## 10. 可观测性、审计与证据门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_10_observability_evidence.md` 的“证据门禁表”“Report 完整性检查表”“Acceptance Handoff 检查表”“证据复查链路图”和“EV 覆盖清单”小节，了解日志、指标、审计、EV、报告和验收交接如何支撑最终裁决。

本轮可观测性、审计与证据验收以 `AC-OBS-001`、`AC-AUDIT-001~002` 和 `AC-EVID-001~008` 为裁决入口。P0 evidence 必须优先从 `reports/runs/<run_id>` 读取,再回指 `artifacts/test/<run_id>`。正式证据路径固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`,不得使用 `latest` 或 `<project>` 层级。

`reports/runs/<run_id>/evidence-index.md` 必须覆盖全部 P0 EV,`gate-results.md` 必须覆盖 P0-blocking suite 和 release gate,`redaction-check.md` 必须证明 artifact 与 report 不含 raw secret、raw body 或 forbidden body。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 可以由脚本生成初稿,但必须由人或 Agent 审查补充后才能作为验收交接依据。
```

## 9. 待确认事项

无阻塞进入 Step 11 的待确认事项。

后续必须继续收口:

- Step 11 将把本步的 redaction fail、evidence missing、fake-as-production、path shape 错误和审计 / 证据不可复查纳入一票否决判断。
- Step 12 将定义证据缺失、S0 / S1 缺陷和复验证据的分级与放行规则。
- Step 13 将定义 `risk-acceptance.md` 中哪些 P1 / P2 或 readiness 缺口可以支撑有条件通过。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 审计和观测门禁明确 | 通过 | `AC-OBS-001`、`AC-AUDIT-001~002` 已覆盖 |
| P0 EV 证据门禁完整 | 通过 | `AC-EVID-001` 和 EV 覆盖清单已覆盖 12 个 EV |
| report 完整性可检查 | 通过 | evidence-index、gate-results、redaction-check、suite、EV 和 acceptance path 已固定 |
| acceptance handoff 可检查 | 通过 | handoff、veto、risk、open issues 和 review note 已定义 |
| redaction / boundary 失败影响清楚 | 通过 | redaction failure 不得通过证据门禁 |
| 可以进入 Step 11 | 通过 | 下一步定义一票否决项 |
