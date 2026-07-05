# Step 13. 定义测试报告与证据归档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节: `05-测试方案.md` §13 测试报告与证据归档

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义测试报告与证据归档 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 追溯矩阵;Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验;Step 12 进入/退出准则;`04` Step 12 下游承接 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_13_evidence.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

定义 Artifact 测试执行后的 raw artifact、run report、candidate evidence index、acceptance handoff 初稿和人工 / Agent 审查补充材料如何组织、命名、归档和追溯。

本 Step 只回答:

- 每类 P0 测试输出什么证据,并由哪些 suites / checks 产出。
- 原始机器证据、人类可读报告、acceptance draft 和 review notes 各自保存在哪里。
- Step 6 / Step 9 的 `EV-CAND-ART-*` 如何在当前阶段成为可归档、可追溯、可送验引用的 candidate evidence,同时不提前冻结 formal EV 编号。
- 每个 candidate evidence 如何回指 `TC-ART-*`、suite、artifact root、report path、第 14 章验收方向和 `VF-ART-*`。
- 哪些报告由脚本生成,哪些必须由人 / Agent 审查补充。
- 失败 suites、failed checks、selected-run unavailable 和 residual risk 需要保留哪些失败证据。
- redaction、dependency、artifact/report pairing 和 no-static-evidence 如何证明证据真实性。

本 Step 不填写实际执行结果,不生成真实 `run_id`,不发明 `AC-ART-*`,不提前裁决验收 pass / fail。正式 `05-测试方案.md` 只继承这里的归档规则;最终验收裁决仍由后续新版 `06-验收标准.md` 负责。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供第 14.1~14.5、`VF-ART-001~004` 与 `TC-ART-*` 的追溯关系 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 `TC-ART-*` 与 `EV-CAND-ART-*` 候选证据族 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 suites、checks、artifact root、report root 与脚本契约 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 truth ownership、cross-repo consumption、redaction、dependency、recovery、observability 证据口径 |
| `05_test_plan_step_11_defects_retest.md` | 已完成 | 提供失败证据、复验证据和 residual / blocker 规则 |
| `05_test_plan_step_12_entry_exit.md` | 已完成 | 提供 raw artifact/report pairing、run evidence 和退出门禁要求 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 config gate、replay、redaction、handoff 证据方向 |
| `projects/L1-governance/design-calibration/05_test_plan_step_13_evidence.md` | 已读取 | 只作为 Step 13 粒度参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类测试输出什么证据? | contracts/domain/state、command、query、consumer、outbox、relay、job、idempotency、config、redaction、dependency、report-audit 都必须输出 suite raw artifact、case result、suite report 和 candidate evidence 项。 |
| 证据保存在哪里? | 原始机器证据统一进入 `artifacts/test/<run_id>`;人类可读报告统一进入 `reports/runs/<run_id>`;送验交接初稿进入 `reports/acceptance`;人工 / Agent 审查补充进入 `reports/review`。 |
| 证据如何关联用例和验收项? | 每个 evidence item 必须记录 `tc_refs`、`suite`、`artifact_path`、`report_path`、`acceptance_refs`、`veto_refs`、`run_id` 和 artifact digest。Artifact 项目不发明 `AC-ART-*`,直接引用第 14.1~14.5 与 `VF-ART-*`。 |
| Step 13 是否现在冻结 formal EV 编号? | 不冻结。当前 authoritative evidence id 仍是 `EV-CAND-ART-*`;Step 13 只把它们变成可归档 candidate evidence index。若后续 `05` Step 15 或新版 `06` 需要 formal alias,只能在不打断 run traceability 的前提下额外映射。 |
| 哪些日志、trace、report 必须保留? | P0 必须保留 suite `report.json`、case JSON、stdout/stderr、gate summary、redaction check、dependency boundary、report audit、evidence index、replay/job reports 和 safe failure reason。 |
| 验收交接报告是否统一进入 `reports/acceptance`? | 是,但只能作为脚本生成初稿加人工 / Agent 审查补充,不得在本 Step 静态宣布验收已通过。 |
| 失败 suite 是否仍保留 artifact? | 是。failed / partial / unavailable 都必须保留 `report.json`、stdout/stderr、已执行 case JSON 和 safe failure reason。 |
| `PublishPendingArtifactRelays` 如何归档? | 必须作为独立 candidate evidence family 归档,同时在 `entry-worker-job` 与 `operations-replay-core` 两层都可追溯,不得并入 6 个 public jobs 证据统计。 |
| redaction / boundary scan 如何证明真实性? | `check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 都必须产出独立 raw artifact 和 run report,并进入 evidence audit。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 只有 `EV-CAND-ART-*` 候选族,没有归档结构 | 本 Step 固定 candidate evidence index、目录结构和生成规则 |
| Step 9 | 固定了 artifact/report root,但没有 evidence index schema 和 acceptance draft | 本 Step 补齐 evidence index、acceptance/report draft 与 review 材料 |
| Step 10 | redaction、dependency、truth ownership 是专项,但未进入归档真实性审计 | 本 Step 把它们升级为 evidence authenticity 必审项 |
| Step 11 | 失败 / 复验要留证,但未绑定固定目录和报告族 | 本 Step 绑定 failed / retest / residual 的归档位置 |
| Step 12 | 当前退出只要求真实 run evidence + candidate evidence,但没定义 candidate evidence 如何组织 | 本 Step 固定 `EV-CAND-ART-*` 在当前阶段的正式归档口径 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| evidence id 口径 | 只有候选证据族名称 | 固定 `EV-CAND-ART-*` 为当前 authoritative archive id | 与 Step 9~12 保持一致,避免过早冻结 formal EV |
| acceptance 引用 | 只有第 14 章方向和 `VF-ART` | candidate evidence item 直接记录 `14.1~14.5` 与 `VF-ART-*` | 不发明 `AC-ART-*` |
| report / artifact pairing | 只有 gate 级约束 | 固定 `artifact_path + report_path + digest + generated_from` | 防止静态造证据 |
| relay evidence | 容易与 public jobs 混合 | 单列 relay evidence family 和双 suite 可追溯规则 | 防止统计与裁决错位 |
| failed / unavailable evidence | 只有 blocker 口径 | 固定失败归档、unavailable residual 和人工审查材料 | 支撑 Step 11 / Step 14 |

## 7. 证据设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| Step 13 是否直接发明 formal `EV-ART-*` | A. 现在冻结 formal EV;B. 保持 `EV-CAND-ART-*` 为当前归档 ID | 采用 B。当前退出门禁和前序 Step 都依赖 candidate 口径。 |
| acceptance 引用是否发明 `AC-ART-*` | A. 新建一套 AC;B. 直接引用第 14.1~14.5 | 采用 B。Step 5 已固定“不发明 AC-ART”。 |
| evidence index 是否可手写 | A. 允许手写;B. 必须从 raw artifact/report 推导 | 采用 B。防止伪证据。 |
| failed suite 是否可仅留 report | A. 只留 report;B. raw artifact 与 report 都保留 | 采用 B。缺陷复验和真实性审计都需要 raw artifact。 |
| `PublishPendingArtifactRelays` 是否只在 job report 里体现 | A. 只放 job report;B. 独立 evidence family | 采用 B。它不是 public job,但又是 P0 关键链路。 |

## 8. 结构化中间产物

### 8.1 Candidate evidence family 与冻结规则

| 证据族 | 当前定位 | 说明 |
|---|---|---|
| `EV-CAND-ART-CORE-*` | authoritative candidate evidence | 对应五个核心能力最小闭环与 release smoke |
| `EV-CAND-ART-CONTRACT-*`;`EV-CAND-ART-STATE-*` | authoritative candidate evidence | 对应 contracts/domain/state |
| `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` | authoritative candidate evidence | 对应 public command/query/consumer 主链 |
| `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` | authoritative candidate evidence | 对应 event/replay/relay/job/handoff |
| `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-REDACTION-*`;`EV-CAND-ART-ARCH-*`;`EV-CAND-ART-REPORT-*` | authoritative candidate evidence | 对应一致性、配置、安全、依赖与报告真实性 |

当前规则:

- `EV-CAND-ART-*` 在 Step 13 之后就是当前 `05` 的正式归档 ID,直到 Step 15 / 新版 `06` 明确是否追加 formal alias。
- 若后续新增 formal alias,必须保持 `EV-CAND-ART-* -> artifact_path -> report_path -> run_id` 可逆追溯。
- `reports/acceptance/*` 与 `reports/review/*` 当前只能引用 `EV-CAND-ART-*`,不得私造 `EV-ART-*` 或 `AC-ART-*`。

### 8.2 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| `EV-CAND-ART-CORE-001` | release smoke 场景报告 | `release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/`;`reports/runs/<run_id>/suites/release-main-smoke.md` | representative `TC-ART-CMD-*`;`TC-ART-QUERY-*`;`TC-ART-OUTBOX-*`;`TC-ART-JOB-*` | `14.1`;`VF-ART-001` |
| `EV-CAND-ART-CONTRACT-001` | protocol / DTO / metadata 报告 | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `TC-ART-CONTRACT-001~004` | `14.2`;`14.3` |
| `EV-CAND-ART-STATE-001` | state matrix / invariant 报告 | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `TC-ART-STATE-001~003` | `14.2`;`14.3`;`VF-ART-003` |
| `EV-CAND-ART-CMD-001` | command orchestration 报告 | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `TC-ART-CMD-001~016` | `14.1`;`14.2`;`14.3` |
| `EV-CAND-ART-QUERY-001` | query read-only / degraded 报告 | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `TC-ART-QUERY-001~013`;`TC-ART-IDEMP-006` | `14.2`;`14.4`;`VF-ART-004` |
| `EV-CAND-ART-CONSUMER-001` | inbound consumer report | `entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `TC-ART-CONSUMER-001~006` | `14.2`;`14.4`;`14.5` |
| `EV-CAND-ART-OUTBOX-001` | outbound payload / publish marker 报告 | `operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `TC-ART-OUTBOX-001~008` | `14.3`;`14.4`;`14.5` |
| `EV-CAND-ART-RELAY-001` | relay facade publish / failure 报告 | `entry-worker-job`;`operations-replay-core` | `artifacts/test/<run_id>/suites/<suite>/` | `TC-ART-RELAY-001` | `14.3`;`14.5`;`VF-ART-004` |
| `EV-CAND-ART-JOB-001` | maintenance / replay / handoff 报告 | `operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `TC-ART-JOB-001~006`;`TC-ART-IDEMP-007` | `14.3`;`14.5`;`VF-ART-004` |
| `EV-CAND-ART-IDEMP-001` | duplicate / commit unknown / no recompute 报告 | `infra-runtime-fake`;`operations-replay-core` | `artifacts/test/<run_id>/suites/<suite>/` | `TC-ART-IDEMP-001~007` | `14.3`;`14.5`;`VF-ART-003`;`VF-ART-004` |
| `EV-CAND-ART-CONFIG-001` | config redline / profile matrix 报告 | `config-redline` | `artifacts/test/<run_id>/suites/config-redline/`;`reports/runs/<run_id>/suites/config-redline.md` | `TC-ART-CONFIG-001~004` | `14.3`;`14.5` |
| `EV-CAND-ART-REDACTION-001` | redaction / safe output 扫描 | `redaction-boundary`;`check_redaction.sh` | `artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` | `TC-ART-REDACTION-001~002` | `14.4`;`14.5`;`VF-ART-002` |
| `EV-CAND-ART-ARCH-001` | dependency boundary 报告 | `dependency-boundary`;`check_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/dependency-boundary/`;`reports/runs/<run_id>/dependency-boundary.md` | `TC-ART-ARCH-001` | `14.5` |
| `EV-CAND-ART-REPORT-001` | artifact/report pairing 与 no-static-evidence 审计 | `report-generation-audit` | `artifacts/test/<run_id>/suites/report-generation-audit/`;`reports/runs/<run_id>/report-audit.md` | cross-suite aggregate | supports all `14.1~14.5` 和 `VF-ART-*` 真实性 |

### 8.3 测试切口到证据 / 验收映射表

| 测试切口 | 用例 ID | Suite / Gate | 证据 ID | artifact root | report path | 验收方向 / VETO |
|---|---|---|---|---|---|---|
| core closure smoke | representative `TC-ART-*` | `release-main-smoke` | `EV-CAND-ART-CORE-001` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | `14.1`;`VF-ART-001` |
| contracts / state | `TC-ART-CONTRACT-*`;`TC-ART-STATE-*` | `contract-domain-fast` | `EV-CAND-ART-CONTRACT-001`;`EV-CAND-ART-STATE-001` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `14.2`;`14.3`;`VF-ART-003` |
| command / query | `TC-ART-CMD-*`;`TC-ART-QUERY-*`;`TC-ART-IDEMP-006` | `service-flow-fast` | `EV-CAND-ART-CMD-001`;`EV-CAND-ART-QUERY-001` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `14.2`;`14.4`;`VF-ART-004` |
| consumer / entry | `TC-ART-CONSUMER-*` | `entry-worker-job` | `EV-CAND-ART-CONSUMER-001` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | `14.2`;`14.4`;`14.5` |
| outbox / relay / jobs | `TC-ART-OUTBOX-*`;`TC-ART-RELAY-001`;`TC-ART-JOB-*`;`TC-ART-IDEMP-007` | `operations-replay-core` | `EV-CAND-ART-OUTBOX-001`;`EV-CAND-ART-RELAY-001`;`EV-CAND-ART-JOB-001` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `14.3`;`14.5`;`VF-ART-004` |
| consistency / idempotency | `TC-ART-IDEMP-*` | `infra-runtime-fake`;`operations-replay-core` | `EV-CAND-ART-IDEMP-001` | `artifacts/test/<run_id>/suites/<suite>/` | `reports/runs/<run_id>/suites/<suite>.md` | `14.3`;`14.5`;`VF-ART-003`;`VF-ART-004` |
| config gates | `TC-ART-CONFIG-*` | `config-redline` | `EV-CAND-ART-CONFIG-001` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | `14.3`;`14.5` |
| redaction / body-free | `TC-ART-REDACTION-*` | `redaction-boundary` | `EV-CAND-ART-REDACTION-001` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | `14.4`;`14.5`;`VF-ART-002` |
| dependency boundary | `TC-ART-ARCH-001` | `dependency-boundary` | `EV-CAND-ART-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | `14.5` |
| report authenticity | cross-suite aggregate | `report-generation-audit` | `EV-CAND-ART-REPORT-001` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | supports all `14.1~14.5` 和 `VF-ART-*` |

### 8.4 `artifacts/test/<run_id>` 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/source-commits.json
  meta/config-digest.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<case_id>.json
  suites/<suite>/artifacts/<safe_artifact_name>.json
```

约束:

- 不得使用 `latest`。
- `meta/context.json` 必须记录 `run_id`、suite list、config profile、artifact root、report root。
- `meta/source-commits.json` 必须记录 design / implementation / core-contracts source refs 和 safe workspace status ref。
- `evidence-index.json` 只能由 raw artifacts 与 generated reports 推导。
- `stdout.log`、`stderr.log` 允许 redacted diagnostics,禁止 raw secret、private key、credential value、完整业务正文和外部正文。

### 8.5 最小 evidence schema

`artifacts/test/<run_id>/evidence-index.json` 最小字段:

| 字段 | 必填 | 说明 |
|---|---|---|
| `schema_version` | 是 | 固定 `artifact.test.evidence.v1` |
| `run_id` | 是 | 固定运行 ID |
| `items` | 是 | candidate evidence items |
| `artifact_digest_algorithm` | 是 | 当前固定 `sha256` |
| `artifact_digest` | 是 | index 自身 digest |

Candidate evidence item 最小字段:

| 字段 | 必填 | 说明 |
|---|---|---|
| `candidate_evidence_id` | 是 | `EV-CAND-ART-*` |
| `suite` | 是 | 来源 suite / check |
| `status` | 是 | `passed` / `failed` / `partial` / `skipped` / `unavailable` |
| `tc_refs` | 是 | 对应 `TC-ART-*` |
| `acceptance_refs` | 是 | `14.1`~`14.5` 直接引用 |
| `veto_refs` | 条件必填 | 涉及 `VF-ART-*` 时必填 |
| `artifact_path` | 是 | `artifacts/test/<run_id>/...` |
| `report_path` | 是 | `reports/runs/<run_id>/...` |
| `artifact_digest` | 是 | 原始 artifact digest |
| `generated_from` | 是 | 生成脚本和输入 artifact 列表 |
| `redaction_status` | 是 | `clean` / `failed` / `not_applicable` |
| `review_status` | 是 | `pending` / `reviewed` / `disputed` |

### 8.6 `reports/` 目录结构

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-summary.md
    evidence-index.md
    redaction-check.md
    dependency-boundary.md
    report-audit.md
    suites/<suite>.md
    evidence/EV-CAND-ART-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

约束:

- `reports/runs/<run_id>` 是 run-scoped 人类可读报告根目录。
- `reports/acceptance/*` 只能是脚本初稿加人工 / Agent 审查补充,不得默认写成已通过。
- `reports/review/*` 只保存审查意见,不能替代 raw artifact。

### 8.7 报告生成脚本映射

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| suite summary | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释、case refs、safe diagnostics 是否准确 |
| gate summary | all suite reports | `scripts/reports/build_gate_summary.sh` | `reports/runs/<run_id>/gate-summary.md` | 检查 blocking / non-blocking 分类是否正确 |
| candidate evidence index | `artifacts/test/<run_id>/evidence-index.json` | `scripts/reports/build_evidence_candidates.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 `EV-CAND-ART-*` / `TC-ART-*` / `14.x` / `VF-ART-*` 是否可追溯 |
| redaction check | raw artifact + reports scan result | `scripts/checks/check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` | 检查 scan 范围覆盖 artifacts 与 reports |
| dependency boundary | dependency graph raw report | `scripts/checks/check_dependency_boundary.sh` | `reports/runs/<run_id>/dependency-boundary.md` | 检查 compile-time upstream 只有 `L0-core/core-contracts` |
| report audit | pairing + no-static-evidence raw artifact | `scripts/checks/check_artifact_report_pairing.sh`;`scripts/checks/check_no_static_evidence.sh` | `reports/runs/<run_id>/report-audit.md` | 检查 orphan EV、缺 raw artifact、手写 pass 结论 |
| acceptance handoff draft | run reports + evidence index + defect status | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/handoff.md` | 必须补充交付范围、P0/P1/P2 边界和残余风险 |
| veto checklist draft | evidence index + audit reports + blocker status | `scripts/reports/generate_veto_checklist.sh` | `reports/acceptance/veto-checklist.md` | 每个 `VF-ART-*` 都必须逐项引用真实 evidence |
| risk acceptance draft | residual / unavailable / B/R defects | `scripts/reports/generate_risk_acceptance.sh` | `reports/acceptance/risk-acceptance.md` | 必须写接受人、影响范围和触发条件 |
| open issues draft | failed / pending suites + unresolved defects | `scripts/reports/generate_open_issues.sh` | `reports/acceptance/open-issues.md` | 不得遗漏阻断项 |

### 8.8 失败 suite / unavailable 归档规则

| 失败类型 | 必须保留 | 禁止行为 |
|---|---|---|
| test assertion failed | `report.json`;case JSON;stdout/stderr;safe failure reason | 删除 failed artifact 或改写成 passed |
| config invalid | validation report;safe issue ref;config digest | 输出 raw secret/env value |
| redaction leak fixture failed as expected | failed scan artifact;redacted diagnostics | 回显被注入的 secret/body |
| dependency boundary failed | dependency raw report;offending safe ref | 隐藏失败后手写通过结论 |
| report generation failed | partial report audit;missing path list | 手写 evidence index 补洞 |
| `p1-real-like-selected-run` unavailable | unavailable marker;residual draft | 计为当前 P0 passed evidence |

### 8.9 人 / Agent 审查补充要求

| 审查材料 | 审查重点 | 是否可替代 raw artifact |
|---|---|---|
| `reports/acceptance/handoff.md` | 运行范围、commit refs、当前 P0 边界、未覆盖说明 | 否 |
| `reports/acceptance/veto-checklist.md` | `VF-ART-001~004` 是否各有真实 candidate evidence | 否 |
| `reports/acceptance/risk-acceptance.md` | residual 是否有接受人、影响面、触发条件 | 否 |
| `reports/acceptance/open-issues.md` | 是否仍有 S / A blocker、failed suite 或缺失报告 | 否 |
| `reports/review/reviewer-notes.md` | 人工复核与争议点 | 否 |
| `reports/review/agent-review.md` | Agent 对追溯、redaction、boundary、static evidence 的复核 | 否 |

### 8.10 证据归档停审记录

| 证据 / 报告 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `EV-CAND-ART-CORE-001` | release smoke 是否是场景级闭环,而非总数汇总 | 通过 | 无 |
| `EV-CAND-ART-QUERY-001` | query no-write 是否有真实 no-write raw artifact | 通过 | 无 |
| `EV-CAND-ART-RELAY-001` | relay facade 是否保持独立于 6 public jobs | 通过 | 无 |
| `EV-CAND-ART-CONFIG-001` | config gate 是否同时覆盖 strict JSON 与 no silent fallback | 通过 | 无 |
| `EV-CAND-ART-REDACTION-001` | artifacts 与 reports 是否都进入 scan | 通过 | 无 |
| `EV-CAND-ART-REPORT-001` | pairing / no-static-evidence 是否形成独立阻断证据 | 通过 | 无 |
| `reports/acceptance/*` | 是否只作为 draft + 审查补充 | 通过 | 不提前裁决验收 |

### 8.11 跨证据真实性 / 追溯审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 所有 P0 用例是否都有证据归档方式 | 通过 | 见 §8.2 / §8.3 |
| 是否存在 orphan `EV-CAND-ART-*` | 通过 | evidence item 必须回指 suite artifact/report pair |
| 是否存在静态造证据映射 | 通过 | `check_no_static_evidence.sh` 阻断 |
| 是否存在 report 缺 raw artifact | 通过 | `check_artifact_report_pairing.sh` 阻断 |
| 是否存在 artifact / report 未脱敏 | 通过 | `check_redaction.sh` 覆盖 artifacts 与 reports |
| acceptance / VETO 引用是否断裂 | 通过 | 直接记录 `14.1~14.5` 与 `VF-ART-*` |
| 是否误把 P1 selected-run 当 P0 evidence | 通过 | unavailable 只进 residual draft |

## 9. 对上游设计的影响判定

| 证据结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前继续使用 `EV-CAND-ART-*` 作为归档 ID | 否 | 测试方案与验收前置分工 | 已固定 |
| 直接引用第 14.1~14.5,不发明 `AC-ART-*` | 否 | 需求侧引用纪律 | 已固定 |
| relay facade 必须独立成 evidence family | 否 | 证据统计与验收可读性 | 已固定 |
| 若后续要求 stable formal EV alias | 是 | `05/06` 证据口径变更 | 留 Step 15 / 新版 `06` 决定 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_13_evidence.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Candidate evidence family 与冻结规则”“证据归档表”“测试切口到证据 / 验收映射表”“报告生成脚本映射”和“跨证据真实性 / 追溯审计表”小节。

正式 `05-测试方案.md` §13 应回填:

- 原始机器证据统一进入 `artifacts/test/<run_id>`;人类可读报告统一进入 `reports/runs/<run_id>`;送验交接初稿进入 `reports/acceptance`;审查补充进入 `reports/review`。
- 当前阶段的 authoritative evidence id 仍是 `EV-CAND-ART-*`;Step 13 负责把它们组织成 candidate evidence index,不提前冻结 formal EV 编号。
- Artifact 项目不发明 `AC-ART-*`;candidate evidence 直接回指第 14.1~14.5 与 `VF-ART-001~004`。
- 所有 P0 evidence 都必须从真实 suite artifact / report pair 推导,不得由静态 JSON、手写 markdown 或 `latest` 路径直接宣告通过。
- `PublishPendingArtifactRelays` 必须保持独立 evidence family,不得并入 6 个 public jobs 证据统计。
- failed / partial / unavailable suites 仍必须保留 raw artifact、suite report 和 safe failure reason;selected-run unavailable 只进入 residual draft,不冒充 P0 passed evidence。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 15 / 新版 `06` 是否需要从 `EV-CAND-ART-*` 派生 formal alias | 影响正式验收引用样式 | 当前不冻结 |
| 证据保留时长 | 影响运维与归档策略 | 当前只要求至少覆盖验收与复验关闭周期 |
| acceptance draft 模板是否需要更细的批准人字段 | 影响新版 `06` | 当前只要求可补充接受人和边界说明 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例都有证据归档方式 | 通过 | 见 §8.2 / §8.3 |
| artifact / report 根目录固定且不引用 `latest` | 通过 | 见 §8.4 / §8.6 |
| candidate evidence index 不能静态造证据 | 通过 | 见 §8.5 / §8.11 |
| failed / unavailable 归档规则明确 | 通过 | 见 §8.8 |
| acceptance report 没有提前裁决 | 通过 | 见 §8.7 / §8.9 |
| 可进入 Step 14 | 通过 | 下一步定义回归策略与残余风险;进入前等待用户审查 |
