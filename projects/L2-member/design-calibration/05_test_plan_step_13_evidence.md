# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节：`projects/L2-member/05-测试方案.md` §13「测试报告与证据归档」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_13_evidence.md`
> 真实性口径：本文只定义证据族、schema、归档路径和审查规则，不生成真实 `run_id`、artifact、report、EV 实例、verdict 或 signoff。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13：定义测试报告与证据归档 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 5 追溯；Step 6 用例；Step 9 门禁；Step 10 专项；Step 11 缺陷；Step 12 进出准则 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_13_evidence.md` |
| 回填位置 | 正式 `05-测试方案.md` §13（Step 15） |
| 停审方式 | EV 族、artifact/report 结构、生成脚本、redaction、真实性和验收交接规则完成后停审 |

## 2. 本步目标

定义测试执行后必须留下的原始机器证据、人类可读报告、evidence index、验收交接初稿和人工 / Agent 审查材料，并确保每个 P0 用例 / 切口可以从真实 suite artifact 追溯到后续 `06-验收标准.md` 的 AC / VF。证据设计不提前裁决测试或验收结果。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | AC / VF / cut 到证据候选族映射 |
| `05_test_plan_step_06_cases.md` | `TC-L2M-*` 与 `EV-CAND-L2M-*` |
| `05_test_plan_step_09_automation_gates.md` | suite、gate、script、artifact/report root |
| `05_test_plan_step_10_nonfunctional.md` | redaction、dependency、replay、observability 和性能 sample |
| `05_test_plan_step_11_defects_retest.md` | failed/fixed run、复验和防回归要求 |
| `05_test_plan_step_12_entry_exit.md` | 退出前 artifact/report pairing 和静态证据阻断 |
| `测试方案书写规范.md` §5.13 | 标准目录和证据字段 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类测试输出什么证据？ | contract/domain/service/query/consumer/job/config/builder/replay/redaction/dependency/release smoke/report audit 各输出 suite raw artifact、case result、suite report 和对应 EV-L2M 证据条目。失败 suite 也必须输出 report / stdout / stderr / failure reason。 |
| 证据保存在哪里？ | 原始机器证据统一 `artifacts/test/<run_id>`；人类可读报告统一 `reports/runs/<run_id>`；验收交接初稿 `reports/acceptance`；人工 / Agent 审查 `reports/review`。路径不带项目子目录，不使用 `latest`。 |
| EV-CAND 如何成为正式 EV？ | Step 6 的候选只说明预期证据面；执行后由 `evidence-index` 从真实 suite artifact / report pair 推导固定 `EV-L2M-*` item，绑定 `run_id`、digest、TC、suite、AC / VF。没有真实来源不得生成正式 EV。 |
| 每个 EV 如何回指？ | 至少包含 `ev_id`、`run_id`、`tc_refs`、`suite`、`gate`、`artifact_root`、`artifact_paths`、`report_path`、`artifact_digest`、`ac_refs`、`vf_refs`、`disposition`、`redaction_status`、`review_refs` 和生成时间。 |
| 哪些日志 / trace / snapshot 保留？ | P0 保留 suite `report.json`、case result、stdout/stderr、gate summary、redaction / dependency / pairing report、safe trace / audit refs、Job report 和 projection / replay summary；不要求真实 DB snapshot，也不保留 forbidden body。 |
| 报告由谁生成 / 审查？ | `scripts/reports/*` 从 raw artifact 生成 suite report、gate summary、evidence index、acceptance handoff / veto / risk 初稿；`reports/acceptance/*` 和 `reports/review/*` 必须由人 / Agent 审查补充，不能静态宣告通过。 |
| redaction / boundary 如何证明？ | `check_redaction.sh` 扫描 artifacts 与 reports 的 raw body、secret、token、private key、credential、foreign body、stack trace 和高基数字段；`check_dependency_boundary.sh` 扫描依赖图和 24 candidate non-materialization。check 自身输出也必须脱敏。 |
| 证据保留多久？ | 至少覆盖本次候选验收结束和相关缺陷复验关闭；具体天数由归档 / 运维 owner 后续确定，本 Step 不硬化数字。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 只写 DB/API/trace，无法覆盖 planned fake / blocked | 按 suite、raw artifact、report、disposition 和 blocker reason 统一归档 |
| 旧证据路径含项目子目录或固定 latest | 固定全局规范 root 和 run_id |
| EV 可能靠手写映射 | 规定从真实 artifact/report pair 推导，静态 index 不可单独成立 |
| acceptance handoff 容易写成通过 | 只生成初稿并保留人工 / Agent review，不写 verdict / signoff |

## 6. 改动前后对比

| 项 | 改动前 | 当前设计 | 原因 |
|---|---|---|---|
| 证据编号 | 旧 `EV-001` 等不稳定 | `EV-L2M-<族>-<三位>` 固定族 | 可跨 Step / 06 / 07 追溯 |
| 证据来源 | 静态记录方向 | raw artifact/report pair + digest | 防止伪证据 |
| 失败 suite | 是否保留不明确 | report.json、stdout/stderr、failure reason 必留 | 支持缺陷复验 |
| 接受报告 | 直接结论 | 脚本初稿 + 人 / Agent 审查 | 测试方案不裁决验收 |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 是否现在冻结全部 EV 实例 | 只冻结族和字段，不冻结 run 实例 | 尚未执行 |
| 是否保留 raw body 方便排错 | 不保留；只留 safe marker / fingerprint / ref | body-free 红线 |
| 是否要求 P1 外部 positive 证据 | 只有合同闭合且真实 selected run 才生成；blocked / not_run 不生成 positive EV | 不伪造外部 truth |
| 是否用静态 JSON 生成 evidence index | 不允许单独生成 | 必须存在真实 suite artifact / report 来源 |

## 8. 结构化中间产物

### 8.1 EV 证据族

| 证据族 | 覆盖内容 | 主要 TC / suite | 后续 AC / VF | 生成条件 |
|---|---|---|---|---|
| `EV-L2M-CONTRACT-*` | finite protocol、双锚、metadata、typed carrier、digest | CMD/QRY/CON schema；`contract-domain-fast` | AC-019/026/033、VF-002/007 | raw contract artifact + report |
| `EV-L2M-DOMAIN-*` | 34 对象、policy、28 状态、非法 / reserved edge | domain/state cases；`contract-domain-fast` | AC-019/020/021/029/030/031 | domain result + state trace |
| `EV-L2M-SERVICE-*` | Command / Query flow、UoW、no-write、error mapping | CMD/QRY/common；`service-flow-fast` | AC-001~017/019~021/031 | service artifact + spy log |
| `EV-L2M-ENTRY-*` | API / Consumer / Job pre-gate、receipt、report | CON/JOB/common；`api-worker-entry` | AC-002/003/011/025/031 | entry artifact + report |
| `EV-L2M-INFRA-*` | Store、CAS、append、rollback、adapter / builder | common/fault；`infra-fake-parity` | AC-019/028/030/031 | fake parity artifact |
| `EV-L2M-REPLAY-*` | duplicate、conflict、in-flight、commit unknown | common-002~005；`replay-recovery` | AC-020/030/031/033、VF-005/008 | replay artifact + same relation refs |
| `EV-L2M-JOB-*` | 5 Job、partial isolation、no source repair | JOB-001~005；`job-continuation` | AC-016/021/024/028/031 | Job report + item results |
| `EV-L2M-PROJECTION-*` | Summary / outlet / projection freshness、Query no-write | QRY-014~016、CON-013/014；`projection-readmodel` | AC-005/016/017/024/028 | projection artifact |
| `EV-L2M-REDACTION-*` | forbidden body / secret / stack / cardinality | common-007、NFR security；`redaction-boundary` | AC-025/032/033、VF-004/008 | redaction scan report |
| `EV-L2M-DEPENDENCY-*` | Core-only compile、runtime/event/ref 分类、24 candidate non-materialization | EVT-001~002；`dependency-boundary` | AC-022/026/033、VF-006/007/008 | dependency scan + candidate inventory |
| `EV-L2M-SMOKE-*` | C1~C5 local composition smoke | representative local cases；`local-smoke` | AC-001~005、VF-001/002/003/005 | release local smoke artifact |
| `EV-L2M-REPORT-*` | artifact/report pairing、index provenance、acceptance draft integrity | report audit；`report-generation-audit` | AC-033、VF-008 | report audit artifact |
| `EV-L2M-OWNER-*` | 条件化 host / Runtime / Bus / resolver / image selected run | blocked / selected; `owner-seam-selected` | 后续 06 指定 AC | only after exact contract + real run |

### 8.2 证据索引最小 schema

```json
{
  "ev_id": "EV-L2M-SERVICE-001",
  "run_id": "<fixed-run-id>",
  "project": "L2-member",
  "suite": "service-flow-fast",
  "gate": "pr|main|nightly|release|selected",
  "tc_refs": ["TC-L2M-CMD-001"],
  "cut_refs": ["application_non_query_orchestration"],
  "artifact_root": "artifacts/test/<run_id>",
  "artifact_paths": ["suites/service-flow-fast/report.json"],
  "report_path": "reports/runs/<run_id>/suites/service-flow-fast.md",
  "artifact_digest": "<computed-digest>",
  "disposition": "passed|failed|blocked|not_run|unknown",
  "ac_refs": ["AC-L2M-001"],
  "vf_refs": [],
  "redaction_status": "checked|failed|not_run",
  "review_refs": [],
  "generated_from": "real-suite-artifact-and-report"
}
```

`<fixed-run-id>` 与 `<computed-digest>` 是 schema 占位，不是执行事实。正式 EV 不得引用 `latest`、手写静态结果或不存在的 artifact。

### 8.3 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/case-results.json
  checks/redaction.json
  checks/dependency-boundary.json
  checks/artifact-report-pairing.json

reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    suites/<suite>.md
    evidence/EV-L2M-<FAMILY>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

### 8.4 报告生成 / 审查映射

| 报告 | 来源 artifact | planned 生成脚本 | 输出 | 人 / Agent 审查 |
|---|---|---|---|---|
| suite report | suite `report.json`、case result、stdout/stderr | `scripts/reports/generate_suite_reports.sh` | `reports/runs/<run_id>/suites/` | 检查 case / failure 对齐 |
| gate summary | suite reports、gate metadata | `scripts/reports/generate_gate_summary.sh` | `gate-results.md` | 检查 blocked / not_run 不伪 pass |
| evidence index | raw suite artifact + report pair | `scripts/reports/generate_evidence_index.sh` | artifact + report index | 检查 TC / cut / AC / VF 回指 |
| redaction report | redaction scan output | `scripts/reports/generate_redaction_report.sh` | `redaction-check.md` | 安全审查；泄漏即 S |
| dependency report | dependency scan + candidate inventory | `scripts/reports/generate_dependency_report.sh` | suite / checks report | 架构审查 Core-only / non-materialization |
| acceptance handoff draft | run summary、EV index、open issues、residual | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/*` | 必须人工 / Agent 补充，不写 verdict |
| review notes | 所有 report / check / diff | 人 / Agent | `reports/review/*` | 解释异常、阻塞和风险接受 |

### 8.5 测试切口到证据 / 验收映射

| 切口 | 主要 EV 族 | 主要 AC / VF | 真实性要求 |
|---|---|---|---|
| contracts / domain / state | CONTRACT / DOMAIN | AC-019/020/026/029/030/031/033、VF-002/007 | artifact + report pair |
| application / Query | SERVICE / REPLAY | AC-001~017/031、VF-001/003/005 | spy / case result；Query no-write |
| Store / adapter / builder | INFRA / DEPENDENCY | AC-022/026/028/033、VF-007/008 | fake scope explicit |
| API / Consumer / Job | ENTRY / JOB | AC-002/003/011/016/021/025/031 | receipt/report source |
| 24 candidate | DEPENDENCY | AC-026/033、VF-007/008 | no event artifact may exist |
| redaction / observability | REDACTION | AC-014/015/025/032、VF-004/008 | scan output + review |
| release local smoke | SMOKE / REPORT | AC-001~005/033、VF-001/002/003/005/008 | fixed run, no latest |
| owner selected run | OWNER | later AC / blocker-specific | only after contract closure |

## 9. 证据归档停审记录

| 证据 / 报告 | 有真实来源约束 | 有 artifact path | 有 report path | 有 TC / AC / VF 回指 | 结论 |
|---|---|---|---|---|---|
| P0 suite EV families | 是 | 是 | 是 | 是 | `pass_planned` |
| failed suite outputs | 是 | 是 | 是 | 失败原因 | `pass` |
| redaction / dependency checks | 是 | 是 | 是 | AC/VF | `pass_blocking` |
| acceptance handoff | 仅初稿 | 是 | 是 | 是 | `review_required` |
| owner selected EV | 条件化 | 合同闭合后 | 合同闭合后 | later AC | `blocked` |

## 10. 跨证据真实性 / 追溯审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| orphan EV | `none_allowed` | 每个正式 EV 必须回指 TC、suite、artifact、report |
| duplicate EV | `family+sequence_unique_required` | 生成器负责唯一性，Step 13 扫描 |
| static evidence | `blocked` | 无真实 artifact/report 不生成 EV |
| missing report / raw artifact | `blocking` | failed suite 也必须保留 pair |
| `latest` 引用 | `forbidden` | 固定 run_id |
| raw secret / body | `forbidden` | redaction scan 失败为 S |
| fake / blocked masquerading | `forbidden` | disposition / profile / blocker 必须保真 |
| acceptance verdict in 05 | `forbidden` | 交给 06，不写 pass / signoff |

## 11. 回填草稿（供正式 §13）

测试证据采用 `EV-L2M-<族>-<三位>` 族，并从真实 suite artifact / report pair 推导。原始机器证据统一保存于 `artifacts/test/<run_id>`，可读报告统一保存于 `reports/runs/<run_id>`，验收交接初稿保存于 `reports/acceptance`，人工 / Agent 审查保存于 `reports/review`。每个 EV 必须绑定固定 run_id、TC / cut、suite / gate、artifact root / paths、report path、digest、disposition、AC / VF 和 redaction / review 状态。

失败 suite 仍必须保留 `report.json`、stdout / stderr、case result 和 failure reason。`scripts/reports/*` 只能生成报告和验收交接初稿，不能写验收通过、verdict 或 signoff；任何 blocked、not_run、fake、planned 或缺 artifact 的关系都不能生成正向 EV。24 个 outbound semantic candidate 只能生成 non-materialization / dependency evidence，不能存在 event / publisher / outbox artifact。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| 实际 runner / artifact store | 实现脚本 | 由 07 / 实现仓确定；本 Step 只固定逻辑路径 |
| EV 具体序号分配 | 执行时唯一性 | 生成器从真实 artifact 推导 |
| 证据保留期 | 运维归档 | 后续 owner 确认，不在 05 硬化 |
| P1 owner selected-run | 外部 qualification | `L2M-UP-001~008` 关闭后才可生成 |

- [x] P0 切口、用例、suite、artifact、report 和 AC/VF 可追溯。
- [x] 失败、blocked、not_run、redaction、dependency 和静态证据策略已定义。
- [x] 目录、schema、生成脚本和人工 / Agent 审查职责已定义。
- [x] 未生成真实 artifact、report、EV、verdict、signoff 或 readiness。

**Step 13 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 14。
