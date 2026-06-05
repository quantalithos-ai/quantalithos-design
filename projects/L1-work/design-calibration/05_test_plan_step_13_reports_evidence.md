# Step 13. 定义测试报告与证据归档

> 本步定义 `05-测试方案.md` §13 的测试报告、证据归档、报告生成脚本映射和人工 / Agent 审查补充要求。本步只定义报告结构和留证要求,不填写实际执行结论、不替代新版 `06-验收标准.md` 的验收裁决。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 13 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §13 测试报告与证据归档 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 取得 `FR-WORK-*`、`BR-WORK-*`、`AC-WORK-*` 到 `TC-WORK-*` / `EV-WORK-*` 的覆盖关系 |
| `05_test_plan_step_06_cases_matrix.md` | 取得 P0 用例矩阵、用例族和断言面 |
| `05_test_plan_step_07_test_data.md` | 取得 `DS-WORK-*` 数据集、captured output、redaction scan 和 cleanup 要求 |
| `05_test_plan_step_09_automation_gates.md` | 取得 gate / check / report 脚本分类、artifact / report 路径和 suite 输出 |
| `05_test_plan_step_10_special_non_functional.md` | 取得 NFR、redaction、观测、审计和故障恢复专项证据 |
| `05_test_plan_step_11_defects_retest.md` | 取得缺陷关闭证据、失败 artifact、复验 run id 和自动化防回归要求 |
| `05_test_plan_step_12_entry_exit.md` | 取得退出准则、release redline、evidence pack 和残余风险移交条件 |
| `04-配置设计.md` §11 / §12 | 确认报告与 artifact 中禁止 raw secret、token、payload、source body 和 `latest` |
| `测试方案讨论流程_SOP.md` Step 13 | 本步问题、期望表格、目录结构和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 每类测试输出什么证据? | P0 suite 输出 `report.json`、stdout / stderr、失败原因、safe structured log、redaction / path / evidence check 结果和对应 `EV-WORK-*` 证据页。专项测试额外输出性能观察、可用性、幂等一致性、观测审计和恢复报告。 |
| 证据保存在哪里? | 原始机器证据统一进入 `artifacts/test/<run_id>/...`;人类可读报告统一进入 `reports/runs/<run_id>/...`;验收交接报告进入 `reports/acceptance/...`。 |
| 证据如何关联用例和验收项? | `reports/runs/<run_id>/evidence-index.md` 必须列出 `EV-WORK-* -> TC-WORK-* -> AC-WORK-* -> artifact refs`。所有 P0 `EV-WORK-*` 都必须能回指固定 `<run_id>` 下的 artifact。 |
| 哪些日志、trace、DB snapshot 或报告必须保留? | 保留 suite report、stdout / stderr、safe structured log、trace / audit / outbox / job report、repository snapshot digest、redaction scan、path check、evidence index check 和 release summary。不得保留 raw body 或 secret。 |
| 证据保留多久? | P0 证据保留策略由实施 / 运维阶段确定;本步只要求正式引用绑定 `<run_id>`、artifact / report 路径稳定、不可用 `latest`。若后续新增保留周期,必须回写 `07` / `09` 或运维规范。 |
| 原始机器证据是否统一进入 `artifacts/test/<run_id>`? | 是。禁止 `artifacts/test/<project>/<run_id>`、`artifacts/test/latest` 和混用项目子目录。 |
| 人类可读报告是否统一进入 `reports/runs/<run_id>`? | 是。suite summary、gate results、redaction check、evidence index、release summary 都写入该 run 目录。 |
| 验收交接报告是否统一进入 `reports/acceptance`? | 是。`reports/acceptance/handoff.md` 是交给新版 `06-验收标准.md` 的测试事实摘要,但不写最终验收裁决。 |
| 哪些报告由 `scripts/reports/*` 自动生成? | `collect_gate_reports.sh`、`build_evidence_index.sh`、`build_redaction_report.sh`、`build_release_summary.sh` 生成报告初稿;可在实施阶段拆分具体脚本,但路径和输入输出不能变。 |
| 哪些报告必须由人或 Agent 审查补充? | `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md`、`risk-acceptance.md` 和 review notes 需要人 / Agent 复核失败解释、残余风险、缺陷状态和验收引用完整性。 |
| 失败 suite 是否仍产出 `report.json`、stdout / stderr log 和 failure reason? | 是。失败 suite 必须留原始失败证据,不得用后续成功 run 覆盖首次失败 artifact。 |
| redaction / boundary scan 如何证明 artifact 和 report 不含 raw secret 或完整业务正文? | release redline 必须运行 forbidden output scan、report path check、fake marker check 和 evidence index check;报告只记录 sanitized hit location,不得复制命中正文。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 5 / Step 6 | 已有 `EV-WORK-*` 编号族,但没有定义证据文件和报告索引结构 | 本步定义 evidence index、证据页和 artifact 引用规则 |
| Step 9 | 已定义 suite、脚本和路径,但报告结构仍分散在 gate 表中 | 本步收敛 artifacts / reports / acceptance 目录结构 |
| Step 10 | 已定义 NFR 专项证据,但没有统一归档入口 | 本步把 redaction、性能观察、恢复、幂等和观测报告纳入证据归档 |
| Step 11 | 已定义缺陷关闭证据,但没有说明失败 artifact 如何保留 | 本步要求失败 suite 也必须产出 report / log / failure reason |
| Step 12 | 已定义 release evidence pack 退出条件,但没有报告包内容 | 本步定义 release summary、evidence index 和 acceptance handoff |
| 旧 `05-测试方案.md` | 旧报告结构无法对应新版 `EV-WORK-*`、run-scoped path 和 no `latest` | 本步重建正式 §13 回填草稿 |

## 5. 改动前后对比

| 维度 | Step 12 后 | Step 13 收敛后 |
|---|---|---|
| 证据编号 | `EV-WORK-*` 已能支撑退出准则 | 每个证据族有归档位置、来源 suite 和验收引用 |
| 原始证据 | gate 输出路径已定义 | 目录结构、必备文件和失败 suite 输出明确 |
| 人类报告 | release evidence pack 已是退出条件 | `reports/runs/<run_id>` 的报告文件和生成脚本明确 |
| 验收交接 | 需要交给新版 06 | `reports/acceptance/handoff.md` 和审查补充项明确 |
| redaction | 已是 redline | artifact / report / acceptance 全链路扫描和禁止正文规则明确 |
| 上游影响 | 无 | 无;不新增测试用例、配置项、协议字段或验收裁决 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只保留 CI 平台测试报告 | 成本低 | 无法稳定回指 `EV / TC / AC`,CI 平台也不是设计事实源 | 不采用 |
| 方案 B: 机器证据、run 报告和验收交接报告分层归档 | 可审计、可追溯,能支撑新版 06 | 需要 report 脚本和人工 / Agent 审查纪律 | 采用 |
| 方案 C: 把所有证据直接写进 `reports/acceptance` | 验收方读取方便 | 原始证据和交接摘要混杂,容易泄露 raw body | 不采用 |
| 方案 D: 使用 `latest` 指向最后一次 run | 使用方便 | 不可复核,违反 Step 9 / Step 12 退出规则 | 不采用 |

采用方案 B。

原因:

- `L1-work` 的 P0 验收依赖证据链,不是单个测试命令绿灯。
- 原始 artifact、可读报告和验收交接报告的读者不同,必须分层。
- raw secret、payload、source body 和相邻仓正文泄露是 release redline,报告结构必须默认支持扫描和人工复核。

## 7. 结构化中间产物

### 7.1 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| `EV-WORK-CORE-001`~`004` | command result、UoW snapshot digest、outbox / trace / idempotency report | `service-core` / `service-all` | `artifacts/test/<run_id>/suites/service-core/`;`reports/runs/<run_id>/evidence/EV-WORK-CORE-*.md` | `TC-WORK-CORE-001`~`004` | `AC-WORK-001/006/014/016/018/019` |
| `EV-WORK-MEMBER-001`~`004` | member snapshot ref、resolver outcome、safe log、negative report | `service-all` / `integration-p0` | `artifacts/test/<run_id>/suites/service-all/`;`reports/runs/<run_id>/evidence/EV-WORK-MEMBER-*.md` | `TC-WORK-MEMBER-001`~`004` | `AC-WORK-002/007/014/016/017/018` |
| `EV-WORK-FORMAL-001`~`005` | Work truth snapshot digest、forbidden body scan、event dump scan | `service-all` / `config-redaction` | `artifacts/test/<run_id>/suites/service-all/`;`artifacts/test/<run_id>/redaction-scan/` | `TC-WORK-FORMAL-001`~`005` | `AC-WORK-003/008/014/015/016/020` |
| `EV-WORK-PROMOTE-001`~`005` | promote decision report、runtime body rejection evidence、version conflict report | `service-all` / `worker-job-contract` | `artifacts/test/<run_id>/suites/worker-job-contract/` | `TC-WORK-PROMOTE-001`~`005` | `AC-WORK-003/009/015/016/017/020` |
| `EV-WORK-DEP-001`~`005` | dependency graph assertion、blocker evidence ref report、cycle reject report | `service-all` | `artifacts/test/<run_id>/suites/service-all/` | `TC-WORK-DEP-001`~`005` | `AC-WORK-010/019/020/027/028` |
| `EV-WORK-ITER-001`~`005` | iteration / commitment state snapshot、UoW report、state reject report | `service-all` / `integration-p0` | `artifacts/test/<run_id>/suites/integration-p0/` | `TC-WORK-ITER-001`~`005` | `AC-WORK-004/011/014/016/017/020` |
| `EV-WORK-QUERY-001`~`008` | query response report、projection freshness report、no-write assertion | `api-contract-fast` / `integration-p0` | `artifacts/test/<run_id>/suites/api-contract-fast/`;`reports/runs/<run_id>/evidence/EV-WORK-QUERY-*.md` | `TC-WORK-QUERY-001`~`008` | `AC-WORK-005/012/017/019/021/022/023/027` |
| `EV-WORK-OPS-001`~`006` | job report、outbox state report、rebuild / refresh / reconciliation / handoff report | `worker-job-contract` / `consumer-outbox` / `operations-replay` | `artifacts/test/<run_id>/suites/worker-job-contract/`;`artifacts/test/<run_id>/suites/operations-replay/` | `TC-WORK-OPS-001`~`006` | `AC-WORK-013/015/019/021/025/029` |
| `EV-WORK-CFG-001`~`017` | config loader report、redaction scan、fake marker check、path check | `config-fast` / `config-redaction` / `release-config-redline` | `artifacts/test/<run_id>/suites/config-fast/`;`artifacts/test/<run_id>/redaction-scan/` | `TC-WORK-CFG-001`~`017` | `AC-WORK-020/023/026/029` |
| `EV-WORK-NFR-001`~`005` | performance observation、availability,security,idempotency,observability report | `service-all` / `config-redaction` / `release-evidence-pack` | `reports/runs/<run_id>/nfr-*.md`;`reports/runs/<run_id>/observability-audit.md` | `TC-WORK-NFR-001`~`005` | `AC-WORK-024`~`029` |

### 7.2 报告生成表

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| suite summary | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/collect_gate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释、设计契约引用和 suite 范围是否准确 |
| gate results | `artifacts/test/<run_id>/suites/*/report.json` | `scripts/reports/collect_gate_reports.sh` | `reports/runs/<run_id>/gate-results.md` | 确认阻断 / 非阻断分类符合 Step 9 / Step 12 |
| evidence index | `artifacts/test/<run_id>/evidence-index.json` 和 suite reports | `scripts/reports/build_evidence_index.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 `EV / TC / AC / artifact` 是否全链路可追溯 |
| redaction report | redaction scan artifacts、path check、fake marker check | `scripts/reports/build_redaction_report.sh` | `reports/runs/<run_id>/redaction-check.md` | 确认只写 sanitized location,不得复制 raw secret 或正文 |
| NFR summary | suite metrics、job reports、safe logs | `scripts/reports/build_release_summary.sh` 或专项脚本 | `reports/runs/<run_id>/nfr-summary.md` | 确认旧性能数字只作观察,不被写成 P0 硬阈值 |
| release summary | gate results、evidence index、redaction report、defect status | `scripts/reports/build_release_summary.sh` | `reports/runs/<run_id>/release-summary.md` | 确认 release redline 和 evidence pack 均有结论 |
| acceptance handoff | `reports/runs/<run_id>/*` | `scripts/reports/build_release_summary.sh` | `reports/acceptance/handoff.md` | 人 / Agent 补充交接说明、开放问题、残余风险入口;不写验收裁决 |

### 7.3 artifacts 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/failure-reason.json
  suites/<suite>/safe-logs.jsonl
  suites/<suite>/snapshots/*.digest
  redaction-scan/report.json
  checks/report-paths.json
  checks/fake-marker.json
  checks/evidence-index.json
```

关键说明:

- 失败 suite 也必须写 `report.json`、stdout / stderr 和 failure reason。
- snapshot 只允许保存 digest、ref、summary 或 redacted marker,不得保存 raw body。
- `meta/context.json` 只记录 run id、commit、profile、suite、start / end time 和 safe config source summary。
- 正式引用必须绑定固定 `<run_id>`,不得引用 `latest`。

### 7.4 reports 目录结构

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-results.md
    evidence-index.md
    redaction-check.md
    nfr-summary.md
    release-summary.md
    suites/<suite>.md
    evidence/EV-WORK-<TYPE>-<NNN>.md
  acceptance/handoff.md
  acceptance/veto-checklist.md
  acceptance/risk-acceptance.md
  acceptance/open-issues.md
  review/reviewer-notes.md
  review/agent-review.md
```

关键说明:

- `reports/runs/<run_id>` 是某次执行的可读事实报告。
- `reports/acceptance/handoff.md` 是给新版 `06-验收标准.md` 消费的交接摘要。
- `reports/acceptance/risk-acceptance.md` 只记录待 Step 14 / 06 评审的风险,不得在 Step 13 批准风险接受。
- `reports/review/*` 用于人工 / Agent 审查记录,不得替代 evidence index。

### 7.5 evidence index 最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `evidence_id` | 是 | `EV-WORK-*` |
| `test_case_ids` | 是 | 一个或多个 `TC-WORK-*` |
| `acceptance_ids` | 是 | 一个或多个 `AC-WORK-*` |
| `suite` | 是 | 产生该证据的 suite |
| `run_id` | 是 | 固定 run id,不得写 `latest` |
| `artifact_refs` | 是 | `artifacts/test/<run_id>/...` |
| `report_refs` | 是 | `reports/runs/<run_id>/...` |
| `design_contract_refs` | P0 必填 | 对应 `03-详细设计.md` 或 `04-配置设计.md` 的契约入口 |
| `redaction_status` | 是 | passed / failed / not_applicable |
| `defect_refs` | 失败时必填 | 关联 S / A / B / C 缺陷 |
| `review_status` | 验收交接前必填 | pending / reviewed / needs_followup |

### 7.6 报告审查清单

| 审查项 | 通过条件 | 失败处理 |
|---|---|---|
| `EV / TC / AC` 可追溯 | 每个 P0 `EV-WORK-*` 都能回指 `TC-WORK-*` 和 `AC-WORK-*` | 补 evidence index 或回到 Step 5 / Step 6 修正 |
| artifact 路径稳定 | 所有引用都在 `artifacts/test/<run_id>` | 修正报告并重跑 `check_report_paths.sh` |
| 无 `latest` | 正式报告和验收交接无 `latest` | 阻断 release evidence pack |
| 无 forbidden output | 报告、artifact、review notes 无 raw secret / token / payload / source body | 阻断退出,修复后重跑 redaction |
| 失败证据保留 | 失败 suite 的原始 artifact 未被成功 run 覆盖 | 恢复或重跑并记录新缺陷 |
| 缺陷闭环 | S / P0 A 缺陷为 0,B / C 有处理计划 | S / P0 A 阻断退出;B / C 进入 Step 14 |
| 验收交接边界 | `reports/acceptance` 只提供事实和风险入口,不写最终裁决 | 移除验收裁决文字,交给新版 06 |

### 7.7 证据流图

图类型: 证据流图

图标题: L1-work 测试证据归档与验收交接

```text
[scripts/gates/*]
  |
  v
[artifacts/test/<run_id>]
  |
  v
[scripts/reports/*]
  |
  +--> [reports/runs/<run_id>/suites]
  |
  +--> [reports/runs/<run_id>/evidence-index.md]
  |
  +--> [reports/runs/<run_id>/redaction-check.md]
  |
  v
[reports/acceptance/handoff.md]
  |
  v
[06-验收标准 consume evidence]
```

关键说明:

- gate 只生成机器证据和 suite artifact,不直接写验收裁决。
- report 脚本从固定 `<run_id>` 的 artifact 生成可读报告。
- acceptance handoff 必须经过人 / Agent 审查补充。
- 新版 `06-验收标准.md` 消费证据并做裁决,不是 Step 13 的职责。

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 证据归档使用既有 `EV-WORK-*`、`TC-WORK-*`、`AC-WORK-*` 编号族 | 否 | 测试报告结构,无设计契约变化 | 无 | 无回写 |
| 原始证据、可读报告、验收交接报告分层归档 | 否 | 承接 Step 9 / Step 12 路径口径 | 无 | 无回写 |
| `reports/acceptance` 只提供交接事实,不做验收裁决 | 否 | 文档职责边界,交给新版 `06` | 无 | 无回写 |
| P0 证据保留周期未在本步定硬规则 | 否 | 运维 / 实施策略留待后续文档 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续要求把证据保留周期、reports root 或 artifacts root 做成 runtime config,必须先回写 `03-详细设计.md` 和 `04-配置设计.md`。
```

## 9. 回填草稿

正式 `05-测试方案.md` §13 建议采用以下结构:

```text
13. 测试报告与证据归档
  13.1 证据归档表
  13.2 报告生成表
  13.3 artifacts 目录结构
  13.4 reports 目录结构
  13.5 evidence index 最小字段
  13.6 报告审查清单
  13.7 证据流图
  13.8 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §13.1 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.1 |
| §13.2 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.2 |
| §13.3 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.3 |
| §13.4 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.4 |
| §13.5 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.5 |
| §13.6 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.6 |
| §13.7 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §7.7 |
| §13.8 | `design-calibration/05_test_plan_step_13_reports_evidence.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 14 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| 路径口径 | 是否确认 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 为正式路径 |
| evidence index | 是否确认 `EV / TC / AC / artifact` 是 P0 证据最小追溯链 |
| 失败 suite | 是否确认失败 suite 也必须保留 `report.json`、stdout / stderr 和 failure reason |
| 验收边界 | 是否确认 Step 13 不做验收裁决,只给新版 `06` 提供证据 |
| redaction | 是否确认报告和 artifact 不得包含 raw secret、token、payload、source body 或完整业务正文 |

## 11. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 用例都有证据归档方式 | 通过 |
| 原始机器证据路径已统一为 `artifacts/test/<run_id>` | 通过 |
| 人类可读报告路径已统一为 `reports/runs/<run_id>` | 通过 |
| 验收交接报告路径已统一为 `reports/acceptance` | 通过 |
| 报告生成脚本映射和人工 / Agent 审查要求已定义 | 通过 |
| formal `05-测试方案.md` 未被本步修改 | 通过 |
