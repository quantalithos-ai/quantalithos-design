# L0-sdk 06 验收标准 Step 10: 可观测性、审计与证据门禁

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 10 中间产物。
> 本步定义 trace、log、metric、audit record、test artifact、run report 和 acceptance handoff 的验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义可观测性、审计与证据门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §10 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `03-详细设计.md` §14 | 已完成 | 提取日志、指标、trace、audit、diagnostic 和禁止字段 |
| `03_ddd_step_15_observability_audit.md` | 已确认 | 作为可观测性和审计埋点契约真相源 |
| `05-测试方案.md` §9 / §10 / §13 | 已完成 | 提取 gate、专项证据、report / artifact 目录和 redaction check |
| `05_test_plan_step_13_reports_evidence.md` | 已确认 | 作为 evidence ID、报告结构和 acceptance 输出真相源 |
| `06_acceptance_step_03_baseline.md` | 已确认 | 继承固定 `<run_id>`、禁止 `latest` 和非法路径 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承进入验收前必须有完整证据和 handoff |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承非功能、观测、redaction 和风险承接口径 |

---

## 3. SOP 问题回答

### 3.1 哪些行为必须有 audit record?

以下行为涉及 SDK truth、candidate、evidence、compatibility、deprecated、boundary 或安全红线，必须留下 audit record 或等价 evidence ref。

| 行为 | 必须存在的 audit / evidence | 失败影响 |
|---|---|---|
| 更新 semantic baseline | `SdkSemanticBaselineUpdatedAudit` | baseline 变化不可追溯，不通过 |
| 刷新 derived / language / client view | `DerivedBindingViewRefreshedAudit` | freshness 不可追溯，不通过 |
| 调用 service boundary | `ServiceBoundaryCallRecordedAudit` 或 boundary diagnostic ref | 最小接入不可审计，不通过 |
| 调用 bus event boundary | `BusEventBoundaryCallRecordedAudit` 或 publish diagnostic ref | event client 行为不可审计，不通过 |
| 记录 compatibility decision | `CompatibilityDecisionRecordedAudit` | 兼容结论不可追溯，不通过 |
| deprecated lifecycle 变化 | `DeprecatedApiRecordedAudit` | 静默 deprecated / removed 风险，不通过 |
| 消费上游 changed event | `UpstreamChangeConsumedAudit` | stale / freshness 变化不可追溯，不通过 |
| 记录 validation evidence | `ValidationEvidenceRecordedAudit` | candidate gate 证据不可追溯，不通过 |
| 生成 package candidate | `PackageCandidateGeneratedAudit` | candidate 来源不可追溯，不通过 |
| 附加 package artifact | `PackageArtifactAttachedAudit` | artifact / digest 不可追溯，不通过 |
| 验证 boundary policy | `BoundaryPolicyVerifiedAudit` | fake / redaction / credential 证据缺失，不通过 |
| 发布 SDK outbox event | `SdkOutboxPublishedAudit` 或 outbox publish evidence | event 传播不可复查，不通过 |
| rebuild projection | `ProjectionRebuiltAudit` | projection 恢复不可复查，不通过 |
| 拒绝 boundary violation | `BoundaryViolationAudit` | 安全拒绝不可复查，不通过 |

### 3.2 哪些行为必须有 trace / log / metric?

| 行为 | trace / log / metric 要求 | 失败影响 |
|---|---|---|
| Command API | `trace_id`、operation、result、duration、idempotency result | 不能定位写路径，不通过或阻断复验 |
| Query API | query、result、consistency marker、duration | stale / not found 不可定位，不通过 |
| Inbound Event Consumer | event kind、event id、source ref、duplicate / consumed result | event 幂等不可复查，不通过 |
| Outbound Event Publisher | outbox event id、topic / event kind、publish result、retryable marker | publish retry 不可复查，不通过 |
| Operations Job | job run id、job kind、item ref、result、duration | partial success 和重跑不可复查，不通过 |
| Boundary / Runner / Artifact adapter | boundary kind / runner kind、diagnostic ref、retryable marker | 依赖失败不可定位，不通过 |
| Evidence / Compatibility / Candidate gate | evidence kind、result、redaction status、decision state | gate 结论不可定位，不通过 |
| Repository / Projection / Idempotency | store kind、operation、conflict / replay / error result | 一致性和并发失败不可复验，不通过 |

### 3.3 哪些测试报告必须归档?

| 报告 | 固定路径 | 必须归档原因 |
|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | 说明送验范围、commit、candidate、profile 和总体结果 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 从 AC / TC / EV 回指 artifact |
| gate results | `reports/runs/<run_id>/gate-results.md` | 裁决 PR / main / nightly / candidate gate |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | 证明 artifact 和 report 不含 raw secret / raw body |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` | 说明每个 suite 成功、失败或 skipped 原因 |
| per evidence report | `reports/runs/<run_id>/evidence/EV-SDK-<TYPE>-<NNN>.md` | 支撑单项证据复查 |
| acceptance handoff | `reports/acceptance/handoff.md` | 说明正式送验基线和验收范围 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 裁决所有一票否决项 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 支撑有条件通过和 P1/P2 风险 |
| open issues | `reports/acceptance/open-issues.md` | 记录非阻断遗留和复验入口 |
| review notes | `reports/review/agent-review.md` / `reviewer-notes.md` | 记录人 / Agent 复核意见 |

### 3.4 证据缺失是否导致不通过?

证据缺失与测试失败不同。测试失败可以支撑正式“不通过”；证据缺失会让验收裁决不可审计。

| 缺失类型 | 裁决口径 |
|---|---|
| 固定 `<run_id>` 缺失 | 不得开始正式验收 |
| `reports/runs/<run_id>/evidence-index.md` 缺失 | 不得裁决 P0 通过 |
| P0 EV 缺失 | 对应 AC 不通过；如果无法定位影响范围，则送验不成立 |
| gate results 缺失 | 不得裁决对应 release / candidate gate 通过 |
| redaction check 缺失 | 不得裁决安全通过 |
| redaction check 失败 | 不通过；Step 11 默认一票否决 |
| acceptance handoff 缺失或未审查 | 不得进入正式签署 |
| veto checklist 缺失 | 不得裁决通过或有条件通过 |
| risk acceptance 缺失且存在 S2 / S3 / P1 / P2 risk | 不得有条件通过 |

### 3.5 证据如何被复查?

复查顺序固定如下：

```text
reports/acceptance/handoff.md
  -> reports/runs/<run_id>/summary.md
  -> reports/runs/<run_id>/evidence-index.md
  -> reports/runs/<run_id>/gate-results.md
  -> reports/runs/<run_id>/redaction-check.md
  -> reports/runs/<run_id>/suites/<suite>.md
  -> artifacts/test/<run_id>/suites/<suite>/report.json
```

复查必须能从验收项回链到 `AC-*`、`TC-SDK-*`、`EV-SDK-*` 和 raw artifact。不得引用 `latest`、`artifacts/test/<project>/<run_id>` 或 `reports/<project>`。

### 3.6 `evidence-index.md` 是否覆盖全部 P0 EV?

必须覆盖全部 P0 功能证据、专项证据和关键观测证据。至少包含：

```text
EV-SDK-CONTRACT-001
EV-SDK-SEMANTIC-001
EV-SDK-BOUNDARY-001
EV-SDK-EVENT-001
EV-SDK-TRACE-001
EV-SDK-SECURITY-001
EV-SDK-CANDIDATE-001
EV-SDK-DOCS-001
EV-SDK-SMOKE-001
EV-SDK-COMPAT-001
EV-SDK-PERF-001
EV-SDK-CONFIG-001
EV-SDK-CONSISTENCY-001
EV-SDK-IDEMPOTENCY-001
EV-SDK-RECOVERY-001
EV-SDK-OBS-001
EV-SDK-AVAIL-001
```

如果某个 P0 EV 不适用，必须在 evidence index 中说明原因并回指范围裁剪；不得静默缺失。

### 3.7 `gate-results.md` 是否覆盖全部 release gate?

必须覆盖 `SUITE-SDK-PR-*`、`SUITE-SDK-MAIN-*`、`SUITE-SDK-NIGHTLY-*` 和 `SUITE-SDK-CANDIDATE-*` 的 P0 gate。`SUITE-SDK-STAGING-SMOKE` 是 P1/P2，不阻断 P0，但如果被作为风险证据引用，也必须有固定 run 记录。

### 3.8 `redaction-check.md` 是否证明 artifact 和 report 不含 raw secret / raw body?

必须证明扫描范围覆盖：

```text
artifacts/test/<run_id>
reports/runs/<run_id>
reports/acceptance
reports/review
```

通过条件是 raw secret、token、private key、credential value、request / response / payload body 命中数均为 0。任何命中都不得通过证据门禁。

### 3.9 `handoff.md` 是否已由人 / Agent 审查补充?

必须。脚本可以生成初稿，但 handoff 必须由人或 Agent 补充：

- 实现仓路径、commit sha、package version、candidate id。
- `L0-core` / `L0-bus` dependency snapshot。
- 固定 `<run_id>` 和执行 profile。
- 当前送验范围、P1/P2 非范围和已知风险。
- 指向 `evidence-index.md`、`gate-results.md`、`redaction-check.md`、`veto-checklist.md` 和 `risk-acceptance.md`。

### 3.10 `veto-checklist.md` 是否覆盖所有一票否决项?

必须覆盖 Step 11 最终收口的一票否决项。Step 10 先要求 checklist 至少预留以下主题：

| 主题 | 最低检查要求 |
|---|---|
| core / bus 双 truth | dependency snapshot + contract evidence |
| 三语言语义漂移 | semantic / smoke evidence |
| 最小接入不可运行 | boundary / docs / smoke evidence |
| sensitive leak | redaction check |
| fake 污染 production | boundary / candidate gate evidence |
| 未验证 candidate 进入 stable | candidate / evidence / compatibility gate |
| config forbidden toggle | config validation evidence |
| query / projection / runtime boundary 写 truth | consistency / boundary evidence |

### 3.11 `risk-acceptance.md` 是否支撑有条件通过?

只有当存在已接受 S2 / S3 或 P1/P2 risk 时才需要支撑“有条件通过”。每项风险必须有 owner、影响范围、接受原因、到期条件、后续动作和复验入口。存在 S0 / S1 时不得通过风险接受转成有条件通过。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 可观测性容易停留在“有日志” | 不能证明 AC / TC / EV / artifact 链路 | 本步要求 trace / log / metric / audit 与 evidence index 绑定 |
| 测试报告和验收交接边界容易混淆 | run report 是机器和人类可读证据，acceptance 是裁决交接 | 验收入口不清 | 本步拆 `reports/runs/<run_id>` 与 `reports/acceptance` |
| 失败 suite 可能缺少 failure reason | 失败无法复验 | 本步要求失败也必须有 report / stdout / stderr / failure reason |
| redaction check 若只扫 artifact 会漏 report | 报告中可能泄露敏感正文 | 本步要求同时扫描 artifacts、run reports、acceptance 和 review |
| risk acceptance 容易替代一票否决 | S0 / S1 被错误放行 | 本步明确风险接受不能覆盖 S0 / S1 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 观测证据 | 泛称 trace / log / metric | 明确哪些行为必须有 trace、log、metric、audit | 可复查 |
| 报告入口 | 证据散落在 artifacts / reports | 固定 `reports/runs/<run_id>` 和 `reports/acceptance` | 可审计 |
| EV 覆盖 | 只列功能证据 | 覆盖功能、专项、非功能和观测证据 | 不遗漏 |
| redaction | 只作为测试专项 | 变成验收硬门禁，扫描 artifacts / reports / acceptance / review | 防泄漏 |
| 有条件通过 | 风险接受条件不稳定 | risk acceptance 必须有 owner、期限、复验，且不能覆盖 S0 / S1 | 可签署 |

---

## 6. 验收设计取舍

### 6.1 是否允许口头确认替代证据

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许口头确认 | 快 | 不可审计 | 不采用 |
| B. 所有 P0 结论必须回链到 fixed report / artifact | 可审计 | 需要报告生成纪律 | 采用 |
| C. 只保留 raw artifact | 机器事实完整 | 人类验收成本过高 | 不采用 |

### 6.2 reports 优先还是 artifacts 优先

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接读 artifacts | 原始 | 不适合作为验收入口 |
| B. 先读 `reports/runs/<run_id>`，再回链 artifacts | 可读且可追溯 | 需要 evidence index 完整 | 采用 |
| C. 只读 acceptance handoff | 简单 | 缺少细节证据 | 不采用 |

### 6.3 risk acceptance 能否覆盖 S0 / S1

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 可以 | 放行灵活 | 破坏 P0 可信度 | 不采用 |
| B. 只允许 S2 / S3 / P1 / P2 risk | 边界清晰 | 需要严格分级 | 采用 |
| C. 不允许任何风险接受 | 最严格 | 无法表达非阻断遗留 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-EV-001 | P0 EV 索引 | `reports/runs/<run_id>/evidence-index.md` | 覆盖全部 P0 `EV-SDK-*`，可回指 AC / TC / artifact | 任一 P0 EV 静默缺失或无法回链 |
| AC-EV-002 | Gate 结果 | `reports/runs/<run_id>/gate-results.md` | PR / main / nightly / candidate P0 gate 均有结论 | gate 缺失、未说明 skipped 或引用 latest |
| AC-EV-003 | Redaction / boundary scan | `reports/runs/<run_id>/redaction-check.md` | artifacts / reports / acceptance / review 扫描命中数为 0 | raw secret、credential、request / response / payload body 任一命中 |
| AC-EV-004 | Trace / log / metric | `EV-SDK-OBS-001`、suite report、diagnostic refs | Command / Query / Event / Job / Boundary / Runner 均可定位 | 缺 trace、缺 diagnostic 或日志含 forbidden body |
| AC-EV-005 | Audit record | audit report 或 per-evidence report | truth、candidate、compatibility、deprecated、boundary、violation 均有 audit / evidence | 关键状态变化无 audit / evidence |
| AC-EV-006 | Raw artifact | `artifacts/test/<run_id>` | 每个 suite 有 `report.json`、stdout、stderr；失败有 reason | artifact 缺失、路径含 `<project>` 层或不可回链 |
| AC-EV-007 | Acceptance handoff | `reports/acceptance/handoff.md` | 已审查并固定 commit、candidate、dependency snapshot、run_id 和范围 | 未审查、缺基线或引用 mutable source |
| AC-EV-008 | Veto checklist | `reports/acceptance/veto-checklist.md` | 一票否决项全部有结论和证据引用 | 任一 veto 未裁决 |
| AC-EV-009 | Risk acceptance | `reports/acceptance/risk-acceptance.md` | S2 / S3 / P1 / P2 risk 有 owner、期限、复验 | 存在未接受风险却声明有条件通过 |

### 7.2 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| Run summary | `reports/runs/<run_id>/summary.md` | 说明范围、commit、candidate、profile、总体结果 | 送验说明不完整 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 artifact | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | release / candidate gate 结果完整 | 不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | 无 raw secret / raw body | 一票否决候选 |
| Suite 报告 | `reports/runs/<run_id>/suites/<suite>.md` | 每个 P0 suite 有成功 / 失败 / skipped 说明 | 对应 gate 不可裁决 |
| Per evidence | `reports/runs/<run_id>/evidence/EV-SDK-<TYPE>-<NNN>.md` | 每个 P0 EV 有可读说明 | 对应 AC 证据不完整 |
| Artifact context | `artifacts/test/<run_id>/meta/context.json` | run_id、commit、profile、fixture namespace 可复查 | 基线不可确认 |
| Suite raw report | `artifacts/test/<run_id>/suites/<suite>/report.json` | 与 suite markdown 一致 | 报告不可回链 |

### 7.3 Acceptance Handoff 检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| 验收交接 | `reports/acceptance/handoff.md` | 已审查并说明送验范围 | 交接不完整 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | VETO 全部有结论 | 不得通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人和后续动作 | 不得有条件通过 |
| 遗留问题 | `reports/acceptance/open-issues.md` | 非阻断问题有 owner 和复验入口 | 退出说明不完整 |
| Agent 复核 | `reports/review/agent-review.md` | 说明证据链一致性、缺口和建议 | 复核材料不完整 |
| Reviewer notes | `reports/review/reviewer-notes.md` | 人类 reviewer 可补充裁决意见 | 人工签署依据不足 |

### 7.4 证据复查流

图类型: 证据复查流

图标题: L0-sdk 验收证据复查链

```text
Acceptance reviewer
  |
  v
reports/acceptance/handoff.md
  |
  +---> reports/acceptance/veto-checklist.md
  +---> reports/acceptance/risk-acceptance.md
  |
  v
reports/runs/<run_id>/summary.md
  |
  +---> evidence-index.md -- AC / TC / EV --> artifacts/test/<run_id>
  +---> gate-results.md
  +---> redaction-check.md
  +---> suites/<suite>.md
  |
  v
final acceptance decision
```

关键说明:

- `reports/runs/<run_id>` 是正式证据入口。
- `artifacts/test/<run_id>` 是 raw machine evidence，不直接替代 run report。
- `reports/acceptance` 是送验交接和签署输入，不得使用 `latest`。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_10_evidence_audit.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“证据门禁表”“Report 完整性检查表”“Acceptance Handoff 检查表”和“证据复查流”小节,了解本章如何把可观测性、审计和证据归档转换为验收门禁。

L0-sdk 的可观测性、审计与证据验收以 `AC-EV-001`~`AC-EV-009` 为裁决入口。所有 P0 验收结论必须能从 `reports/runs/<run_id>/evidence-index.md` 回链到 `AC-*`、`TC-SDK-*`、`EV-SDK-*` 和 `artifacts/test/<run_id>`。

正式验收优先读取 `reports/acceptance/handoff.md` 和 `reports/runs/<run_id>`，再按 evidence index 回链 raw artifact。不得使用 `latest`、`reports/<project>` 或 `artifacts/test/<project>/<run_id>` 作为正式证据路径。

Redaction / boundary scan 是硬门禁。`reports/runs/<run_id>/redaction-check.md` 必须覆盖 artifacts、run reports、acceptance 和 review 输出。raw secret、token、private key、credential value、request / response / payload body 任一命中时，不得通过证据门禁。

风险接受不能覆盖 S0 / S1。只有 S2 / S3 或 P1 / P2 risk 可以通过 `reports/acceptance/risk-acceptance.md` 支撑有条件通过。

---

## 9. 待确认事项

当前没有阻塞进入 Step 11 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否允许口头确认替代证据 | A. 允许；B. 不允许，必须回链 report / artifact | 采用 B | 验收必须可审计 |
| 是否直接读 raw artifacts | A. 直接读；B. 先读 reports，再回链 artifacts；C. 只读 handoff | 采用 B | 兼顾可读性和可追溯 |
| risk acceptance 是否覆盖 S0 / S1 | A. 可以；B. 不可以，仅覆盖 S2 / S3 / P1 / P2 risk | 采用 B | 保持一票否决和阻断缺陷边界 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 必须有 audit record 的行为已定义 | 已满足 |
| 必须有 trace / log / metric 的行为已定义 | 已满足 |
| 必须归档的测试报告已定义 | 已满足 |
| 证据缺失的裁决口径已定义 | 已满足 |
| 证据复查路径已定义 | 已满足 |
| evidence index / gate results / redaction check / handoff / veto / risk acceptance 门禁已定义 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 11,定义一票否决项。
