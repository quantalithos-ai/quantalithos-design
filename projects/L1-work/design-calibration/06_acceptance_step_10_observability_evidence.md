# Step 10. 定义可观测性、审计与证据门禁

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 10 中间产物。
> 本步把 trace、audit、structured log、metric、测试报告、EV 索引、redaction 和验收交接转成可裁决门禁。
> 本步不生成真实运行报告,不定义告警阈值、dashboard、日志保留周期或运维 runbook。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
- 回填章节: `projects/L1-work/06-验收标准.md` §10 可观测性、审计与证据门禁
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03-详细设计.md` §14 | 日志、指标、trace、audit、outbox、safe fields 和禁止字段 | 可观测性与审计门禁来源 |
| `design-calibration/03_ddd_step_15_observability_audit.md` | 日志埋点表、指标埋点表、审计事件表、观测字段边界 | 证据和字段边界来源 |
| `04-配置设计.md` §8 | logs、error response、audit / trace、reports / artifacts 的 forbidden / allowed 字段 | redaction 和边界扫描来源 |
| `05-测试方案.md` §10 / §13 | NFR 可观测性、证据归档表、报告结构、evidence index 最小字段、报告审查清单 | report 和 evidence 门禁来源 |
| Step 1~9 中间产物 | 固定 `<run_id>`、门禁、红线、接口、状态、NFR | 本步证据闭环前置 |

已确认结论:

```text
P0 验收不得用口头确认替代证据。
P0 证据必须优先从 `reports/runs/<run_id>` 读取,再回指 `artifacts/test/<run_id>`。
正式 acceptance handoff 路径使用当前 `05-测试方案.md` 定义的 `reports/acceptance/handoff.md`。
redaction / boundary scan 失败时,不得通过证据门禁。
```

## 3. SOP 问题回答

### 3.1 哪些行为必须有 audit record?

accepted business truth change 必须有 `WorkTraceRecord`、`WorkAuditTrail` 和 `WorkOutboxRecord` 证据。Query 不写业务 audit。

| 行为 | 必须审计的对象 |
|---|---|
| Project create / lifecycle / backlog availability | `ProjectCreatedAudit`、`ProjectLifecycleChangedAudit`、`BacklogAvailabilityChangedAudit` |
| ProjectMember assign / responsibility change | `ProjectMemberAssignedAudit`、`ProjectMemberResponsibilityChangedAudit` |
| WorkItem / ChildWorkItem create / lifecycle | `WorkItemCreatedAudit`、`WorkItemLifecycleChangedAudit` |
| Work promotion request / review | `WorkPromotionRequestedAudit`、`WorkPromotionReviewedAudit` |
| dependency / blocker change | `WorkDependencyChangedAudit`、`WorkBlockerChangedAudit` |
| iteration open / commitment / lifecycle | `IterationOpenedAudit`、`IterationCommitmentChangedAudit` |
| inbound snapshot / pending intake | `InboundReferenceSnapshotChangedAudit`、`PendingPromoteIntakeRecordedAudit` |
| outbox publish / failure | `OutboxPublishedAudit`、`OutboxPublicationFailedAudit` |
| projection / reference / handoff / reconciliation | `ProjectionFreshnessChangedAudit`、`ReferenceResolutionFailedAudit`、`TraceHandoffPreparedAudit`、`ArchiveHandoffPreparedAudit`、`ReconciliationReportedAudit` |
| commit unknown | `CommitStatusUnknownAudit` 或等价固定 diagnostic evidence |

### 3.2 哪些行为必须有 trace / log / metric?

| 行为 | 必须存在的观测材料 |
|---|---|
| Command accepted / rejected / duplicate / conflict | structured log、metric、accepted 时 trace / audit / outbox |
| Query hit / missing / not visible / stale / failed | structured log、metric;不得写 audit / outbox / idempotency |
| Inbound consumer accepted / duplicate / dead-letter | structured log、metric、dedup / marker report |
| Outbox publish success / failure / retry | structured log、metric、publication marker / report |
| Projection rebuild success / failure | structured log、metric、freshness marker / report |
| Reference resolver success / failure | structured log、metric、reference state / failed marker |
| Handoff success / failure | structured log、metric、handoff marker / failed report |
| Config validation reject | structured log、metric、config-fast / redline report |

所有日志、指标、audit、trace 和 diagnostic 只能使用 safe refs / safe summary,不得保存 raw secret、raw token、raw payload、source body、provider response body、runtime reasoning body、artifact body 或 archive long-term body。

### 3.3 哪些测试报告必须归档?

| 报告 | 固定路径 |
|---|---|
| run summary | `reports/runs/<run_id>/summary.md` |
| gate results | `reports/runs/<run_id>/gate-results.md` |
| evidence index | `reports/runs/<run_id>/evidence-index.md` |
| redaction check | `reports/runs/<run_id>/redaction-check.md` |
| nfr summary | `reports/runs/<run_id>/nfr-summary.md` |
| release summary | `reports/runs/<run_id>/release-summary.md` |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` |
| EV detail reports | `reports/runs/<run_id>/evidence/EV-WORK-<TYPE>-<NNN>.md` |
| acceptance handoff | `reports/acceptance/handoff.md` |
| veto checklist | `reports/acceptance/veto-checklist.md` |
| risk acceptance | `reports/acceptance/risk-acceptance.md` |
| open issues | `reports/acceptance/open-issues.md` |

### 3.4 证据缺失是否导致不通过?

| 缺失 / 失败 | 裁决 |
|---|---|
| 缺 `reports/runs/<run_id>/evidence-index.md` | 送验不成立 |
| P0 `EV-WORK-*` 缺失或无法回指 `TC / AC / artifact` | 不通过或送验不成立 |
| 缺 `reports/runs/<run_id>/gate-results.md` | release gate 不成立 |
| 缺 `redaction-check.md` 或 redaction failed | 阻断;Step 11 一票否决候选 |
| 缺 `reports/acceptance/handoff.md` | 验收交接不完整,不得宣称送验完整 |
| 缺 `veto-checklist.md` | 不得裁决通过 / 有条件通过 |
| 缺 `risk-acceptance.md` 且存在风险 / B/C 缺陷 | 不得有条件通过 |
| `latest` 出现在正式证据路径 | 阻断 release evidence pack |

### 3.5 证据如何被复查?

复查必须从 `reports/runs/<run_id>` 开始,再回到 artifact。

```text
reports/runs/<run_id>/gate-results.md
  -> suite result / gate result
  -> reports/runs/<run_id>/evidence-index.md
  -> EV-WORK-* detail report
  -> artifacts/test/<run_id>/...
  -> safe logs / snapshots / redaction scan / failure reason
```

每条 P0 证据必须能关联:

```text
EV-WORK-* -> TC-WORK-* -> AC-WORK-* -> design_contract_refs -> artifact_refs
```

### 3.6 `evidence-index.md` 是否覆盖全部 P0 EV?

必须覆盖 `EV-WORK-CORE-*`、`MEMBER-*`、`FORMAL-*`、`PROMOTE-*`、`DEP-*`、`ITER-*`、`QUERY-*`、`OPS-*`、`CFG-*`、`NFR-*`。每条 P0 EV 至少包含 `evidence_id`、`test_case_ids`、`acceptance_ids`、`suite`、`run_id`、`artifact_refs`、`report_refs`、`design_contract_refs`、`redaction_status`、`review_status`。

### 3.7 `gate-results.md` 是否覆盖全部 release gate?

必须覆盖 `release-main-smoke`、`release-config-redline`、`release-evidence-pack` 和被选入 release 的 `service-all`、`integration-p0`、`worker-job-contract`、`consumer-outbox`、`config-redaction`、`operations-replay` / `integration-like-seam` selected 项。

### 3.8 `redaction-check.md` 是否证明 artifact 和 report 不含 raw secret / raw body?

必须证明以下位置均通过扫描:

| 位置 | 不得出现 |
|---|---|
| logs / safe logs | raw secret、raw token、raw payload、source body |
| error response | credential material、provider response body、source body |
| audit / trace | raw credential、raw DSN、forbidden body |
| reports / artifacts | raw secret、raw payload、runtime reasoning body、artifact body |
| DTO / event dump / repository snapshot | external body、ImplementationPlan body、runtime progress body |

### 3.9 `reports/acceptance/handoff.md` 是否已由人 / Agent 审查补充?

必须由人或 Agent 审查补充送验范围、固定基线、已执行 gate、开放问题、残余风险入口和引用报告。它不写最终验收裁决,最终裁决由正式 `06-验收标准.md` §14 承担。

### 3.10 `veto-checklist.md` 是否覆盖所有一票否决项?

必须覆盖 `VF-WORK-001`~`008` 和 release redline 候选。每项必须有结论、证据引用、缺陷引用和 reviewer status。

### 3.11 `risk-acceptance.md` 是否支撑有条件通过?

若存在 B/C 缺陷、非阻断专项未覆盖或 P1/P2 遗留风险,必须记录风险描述、影响、缓解动作、后续 owner、接受人和截止条件。S 级、一票否决、P0 evidence 缺失、raw secret / body 泄露、重复 truth 和 `latest` 路径不得风险接受。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 证据写成“测试报告 / 日志”等泛化入口 | 无法复查 | 固定 report / artifact 路径和最小字段 |
| 旧 `06-验收标准.md` | 没有 evidence index / redaction / acceptance handoff / veto / risk 闭环 | 无法裁决通过或有条件通过 | 本步补证据门禁 |
| SOP 示例 | 使用 `reports/acceptance/handoff.md` 泛化路径 | 与当前 `05` 的 `reports/acceptance/handoff.md` 一致 | handoff 文件名固定为 `handoff.md`,固定 `run_id` 写入正文和审查元数据 |
| `03` 观测契约 | 已定义 log / metric / audit 字段边界 | 需要验收裁决表承接 | 本步引用 |
| `05` 证据归档 | 已定义 `EV / TC / AC`、report、artifact 和审查清单 | 需要转成通过 / 失败条件 | 本步引用 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 证据入口 | 泛化测试报告 | 固定 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>` | 可复核 |
| EV 追溯 | 未定义字段 | 固定 evidence index 最小字段 | 支撑 `AC / TC / EV / artifact` 闭环 |
| Redaction | 泛化安全检查 | 固定 `redaction-check.md` 和 forbidden output 清单 | 防止泄露 |
| Acceptance handoff | 未固定 | `reports/acceptance/handoff.md` | 与 `05` 一致 |
| Veto / risk | 分散在后续章节 | 本步只定义必须存在的证据文件 | Step 11 / 13 继续裁决 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 口头确认关键 gate 已跑 | 快速 | 不可复核,违背验收标准定位 | 不采用 |
| 方案 B: 以 `reports/runs/<run_id>` 为证据入口,再回指 artifact | 可复查,路径稳定 | 需要 report / artifact 生成纪律 | 采用 |
| 方案 C: 直接引用 CI 系统页面 | 方便查看 | URL 易失效,不满足固定证据路径 | 不采用 |
| 方案 D: acceptance handoff 直接写最终裁决 | 看起来完整 | 裁决权应在正式 `06` §14 | 不采用 |

推荐方案 B。

原因:

- 验收标准是裁决文档,证据必须可复查。
- `reports/runs/<run_id>` 是人审入口,`artifacts/test/<run_id>` 是机器证据入口。
- acceptance handoff 只提供事实和风险入口,不能替代最终裁决。

## 7. 结构化中间产物

### 7.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| `EVG-WORK-AUDIT-001` | Accepted truth audit | `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、structured log、metric | 每个 accepted business truth change 均有 trace / audit / outbox / result ref 证据 | accepted truth 缺 trace / audit / outbox |
| `EVG-WORK-AUDIT-002` | Reject / conflict observability | structured log、metric、failure reason | invalid / domain reject / not visible / idempotency conflict / version conflict 有 safe log 和 metric,无业务 trace / outbox | reject path 缺观测或写 accepted audit / outbox |
| `EVG-WORK-QUERY-001` | Query observability no-write | query log / metric、no-write assertion | Query hit / missing / not visible / stale / failed 均可观察,且不写 audit / outbox / idempotency | Query 写状态或无法解释 degraded surface |
| `EVG-WORK-JOB-001` | Job report / marker | OPS job report、failed marker、rerun report | publish / rebuild / refresh / reconciliation / handoff 成功和失败均有 report / marker | job silent success、failure 缺 report、rerun 覆盖证据 |
| `EVG-WORK-LOG-001` | Structured log safe fields | safe logs | 日志含 `trace_context_ref`、`operation`、`status`、`error_kind`、`duration_ms` 等 safe fields | 日志缺关键字段或含 raw forbidden material |
| `EVG-WORK-METRIC-001` | Low-cardinality metric | metric report / observability audit | 指标使用 `operation`、`result`、`error_kind`、`view_kind`、`job_kind`、`adapter_kind` 等低基数标签 | 指标含 record id、payload digest 全量、free text 或 sensitive value |
| `EVG-WORK-INDEX-001` | EV index | `reports/runs/<run_id>/evidence-index.md` | P0 EV 全覆盖,每条有 `EV / TC / AC / suite / run_id / artifact_refs / report_refs / design_contract_refs / redaction_status / review_status` | 缺 P0 EV、字段缺失、无法回指 artifact |
| `EVG-WORK-GATE-001` | Gate results | `reports/runs/<run_id>/gate-results.md` | release gate 和 selected gate 有 pass / fail / skipped reason / defect refs | release gate 缺结果或 skipped 无理由 |
| `EVG-WORK-REDACTION-001` | Redaction / boundary scan | `reports/runs/<run_id>/redaction-check.md`;redaction artifacts | raw secret / token / payload / source body / runtime reasoning body / artifact body 零命中 | 任一命中或缺 redaction report |
| `EVG-WORK-REPORT-001` | Report path stability | `reports/runs/<run_id>/*`;path check | 所有正式引用都固定 `<run_id>`,无 `latest` | 使用 `latest` 或错误 root |
| `EVG-WORK-HANDOFF-001` | Acceptance handoff | `reports/acceptance/handoff.md` | 人 / Agent 已补送验范围、基线、gate、开放问题、风险入口;不写最终裁决 | 缺 handoff、未审查、写最终裁决 |
| `EVG-WORK-VETO-001` | Veto checklist | `reports/acceptance/veto-checklist.md` | `VF-WORK-001`~`008` 和 release redline 均有结论、证据、缺陷、review status | 缺任一 veto 项或无证据结论 |
| `EVG-WORK-RISK-001` | Risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过所需风险均有接受人、owner、后续动作和截止条件 | 风险无 owner / 接受人,或 S / veto 风险被接受 |
| `EVG-WORK-FAILURE-001` | Failure evidence preservation | failed suite artifact、failure reason、defect refs | 失败 suite 也保留 `report.json`、stdout / stderr、failure reason 和缺陷引用 | 失败证据被成功 run 覆盖或缺 failure reason |

### 7.2 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | 送验范围、baseline、suite 摘要完整 | 交接不完整 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 `TC / AC / artifact` | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | release gate 结果完整 | 不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | 无 raw secret / raw body | 阻断,Step 11 一票否决候选 |
| NFR 摘要 | `reports/runs/<run_id>/nfr-summary.md` | NFR observation / redline / defect refs 完整 | NFR 门禁不可裁决 |
| release summary | `reports/runs/<run_id>/release-summary.md` | redline、evidence pack、defect status 有结论 | release gate 不成立 |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` | PR / main / release selected suite 均有结果 | 对应 gate 不可裁决 |
| EV detail | `reports/runs/<run_id>/evidence/EV-WORK-<TYPE>-<NNN>.md` | 关键 P0 EV 有详情和 artifact ref | 对应 AC 不可裁决 |
| artifact root | `artifacts/test/<run_id>/...` | artifact refs 存在,失败 artifact 保留 | 证据不可复查 |

### 7.3 Acceptance Handoff 检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| 验收交接 | `reports/acceptance/handoff.md` | 已审查并说明送验范围、baseline、gate、open issues、risk links | 交接不完整 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | `VF-WORK-*` 与 release redline 全部有结论 | 不得通过 / 有条件通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人、owner、后续动作、截止条件 | 不得有条件通过 |
| 开放问题 | `reports/acceptance/open-issues.md` | B / C 缺陷、非阻断风险和后续专项有入口 | 风险交接不完整 |
| review notes | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | 人 / Agent 审查记录只写事实、问题和建议,不替代裁决 | 审查证据不足 |

### 7.4 Evidence Index 最小字段门禁

| 字段 | 必填 | 失败影响 |
|---|---|---|
| `evidence_id` | 是 | EV 无法识别 |
| `test_case_ids` | 是 | 无法回指测试 |
| `acceptance_ids` | 是 | 无法回指验收项 |
| `suite` | 是 | 无法定位执行来源 |
| `run_id` | 是 | 证据不可固定 |
| `artifact_refs` | 是 | 无法复查机器证据 |
| `report_refs` | 是 | 无法复查人读报告 |
| `design_contract_refs` | P0 必填 | 无法证明符合设计 |
| `redaction_status` | 是 | 无法判断 forbidden output |
| `defect_refs` | 失败时必填 | 缺陷不可闭环 |
| `review_status` | 验收交接前必填 | 未审查不得送验 |

### 7.5 证据复查图

#### 证据复查图: Report To Artifact

```text
Acceptance review
  -> reports/acceptance/handoff.md
  -> reports/acceptance/veto-checklist.md
  -> reports/acceptance/risk-acceptance.md
        |
        v
Run reports
  -> reports/runs/<run_id>/gate-results.md
  -> reports/runs/<run_id>/evidence-index.md
  -> reports/runs/<run_id>/redaction-check.md
        |
        v
Artifacts
  -> artifacts/test/<run_id>/suites/<suite>/report.json
  -> artifacts/test/<run_id>/safe-logs / snapshots / redaction-scan
```

关键说明:

- 验收复查从 acceptance handoff 和 run reports 开始。
- evidence index 是 `AC / TC / EV / artifact` 的连接点。
- redaction failed、缺 EV、缺 gate result 或 `latest` 路径均不能通过证据门禁。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 P0 证据必须以 `reports/runs/<run_id>` 为入口并回指 `artifacts/test/<run_id>` | 否 | 证据门禁承接 | 无 | 无回写 |
| 确认 acceptance handoff 使用 `reports/acceptance/handoff.md` | 否 | 已与正式 `05-测试方案.md` 路径对齐 | 无 | 无回写 |
| 确认 redaction / boundary scan 失败不得通过证据门禁 | 否 | 安全与证据红线承接 | Step 11 | 待后续 Step |
| 确认 `veto-checklist.md` 和 `risk-acceptance.md` 只是 Step 11 / 13 裁决输入,不替代最终结论 | 否 | 裁决边界 | Step 11 / Step 13 | 待后续 Step |

说明:

```text
本步没有新增日志字段、指标字段、审计事件、报告文件或证据字段。
本步只把已确认的可观测性、审计和证据归档口径转成可裁决门禁。
```

## 9. 回填草稿

正式 `06-验收标准.md` §10 建议采用以下结构:

```text
10. 可观测性、审计与证据门禁
  10.1 Trace / audit / outbox / log / metric 门禁
  10.2 Evidence index 门禁
  10.3 Gate results 与 suite report 门禁
  10.4 Redaction 与 forbidden output 门禁
  10.5 Acceptance handoff / veto / risk 交接门禁
  10.6 证据缺失的裁决影响
```

正文草稿:

```text
本章用于裁决 `L1-work` 的可观测性、审计和证据是否足以支撑验收。P0 验收不得使用口头确认、临时 CI 页面或 `latest` 路径替代固定证据。所有 P0 证据必须从 `reports/runs/<run_id>` 读取,并能回指 `artifacts/test/<run_id>`。

accepted business truth change 必须有 `WorkTraceRecord`、`WorkAuditTrail`、`WorkOutboxRecord`、structured log 和 metric。reject、conflict、not visible、duplicate、resolver failure、publisher failure、projection failure、handoff failure 和 commit unknown 必须有 safe log / metric / report,但不得写 accepted business audit 或 outbox。redaction / boundary scan 失败、缺 P0 EV、缺 release gate result、缺 veto checklist 或正式证据路径使用 `latest` 时,不得通过证据门禁。
```

## 10. 待确认事项

无阻塞进入 Step 11 的待确认事项。

后续 Step 必须继续收口:

- Step 11 将 redaction failed、缺 P0 evidence、缺 gate result、非 core compile dependency、query / job 反写、重复 truth 和关键变化不可追溯纳入一票否决裁决。
- Step 12 将证据缺失、redaction failed、gate failed 对应缺陷分级和复验口径转成正式规则。
- Step 13 将 `risk-acceptance.md` 中可接受风险和不可接受风险分开裁决。

## 11. 进入下一步条件

- [x] 必须有 audit record 的行为已经列明。
- [x] 必须有 trace / log / metric 的行为已经列明。
- [x] 必须归档的测试报告已经列明。
- [x] 证据缺失的裁决影响已经列明。
- [x] 证据复查路径已经定义。
- [x] `evidence-index.md` P0 EV 覆盖要求已经定义。
- [x] `gate-results.md` release gate 覆盖要求已经定义。
- [x] `redaction-check.md` forbidden output 要求已经定义。
- [x] acceptance handoff、veto checklist、risk acceptance 的检查口径已经定义。
- [x] 用户审核并确认本 Step。
