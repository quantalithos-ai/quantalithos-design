# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节：`05-测试方案.md` §13

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 测试报告与证据归档 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 只定义未来证据结构；不生成真实 run_id、artifact、report、verdict 或 signoff |
| 停审结论 | P0 evidence family、目录、schema、脚本与真实性审计可追溯 |

## 2. 证据 ID 与状态规则

正式证据实例采用 `EV-MS-<FAMILY>-<NNN>` 形式，并由 `run_id + evidence_id + suite + artifact_digest` 唯一定位。Step 6 的 `EV-CAND-*` 只是候选族，不是执行证据。

| 证据族 | 覆盖范围 |
|---|---|
| `EV-MS-CORE-*` | C-MS-1~5 最小闭环 / release smoke |
| `EV-MS-CONTRACT-*` | refs、metadata、DTO、schema/version、error carrier |
| `EV-MS-DOMAIN-*` | 29 对象、不变量、policy、state matrix |
| `EV-MS-CMD-*` | 10 Command、UoW、duplicate/conflict/rollback |
| `EV-MS-QUERY-*` | 6 Query、visibility、degraded、no-write |
| `EV-MS-CONSUMER-*` | 5 Consumer、version/dedup/late/gap/receipt |
| `EV-MS-MATERIAL-*` | HostFactMaterial、immutable outbox snapshot |
| `EV-MS-JOB-*` | 7 Job、selector、report、partial、no-truth-repair |
| `EV-MS-IDEMP-*` | duplicate、digest、revision、concurrency、unknown |
| `EV-MS-CONFIG-*` | profile、strict JSON、source priority、builder |
| `EV-MS-REDACTION-*` | log/metric/audit/trace/report/artifact no-output |
| `EV-MS-ARCH-*` | compile/runtime/event/ref/adapter/fake dependency boundary |
| `EV-MS-NFR-*` | availability、recovery、observability、performance candidate |
| `EV-MS-REPORT-*` | raw/report pairing、index integrity、static evidence audit |

证据主状态只表达执行状态，不表达验收裁决：`passed`、`failed`、`partial`、`skipped`、`unavailable`、`not_run`。未闭合 sibling 的正向路径使用 `status=unavailable|not_run` 并附 `blocker_status=blocked|waiting|pending`；不得生成 ready、accepted 或 signoff 证据。

## 3. P0 证据归档表

| 证据 ID | 来源 suite / check | 原始位置 | 报告位置 | 关联用例 | 后续 AC / VF |
|---|---|---|---|---|---|
| `EV-MS-CORE-001` | `release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | representative core cases | AC-MS-001~005; VF-MS-001 |
| `EV-MS-CONTRACT-001` | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `TC-CONTRACT-*` | AC-MS-006~017 |
| `EV-MS-DOMAIN-001` | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `TC-DOMAIN-*`;`TC-STATE-*` | AC-MS-022~027; VF-MS-004/006 |
| `EV-MS-CMD-001` | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `TC-INTENT-*`…`TC-CLOSE-*` | AC-MS-006~017; VF-MS-002~007 |
| `EV-MS-QUERY-001` | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `TC-QUERY-*` | AC-MS-012/017/021; VF-MS-007 |
| `EV-MS-CONSUMER-001` | `entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | `TC-CONSUMER-*` | AC-MS-011~017; VF-MS-006/007 |
| `EV-MS-MATERIAL-001` | `infra-runtime-fake` / replay | suite artifact root(s) | corresponding concrete suite report(s) | `TC-MATERIAL-001` | AC-MS-017/032; VF-MS-007 |
| `EV-MS-JOB-001` | `operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `TC-JOB-*` | AC-MS-015~017/039; VF-MS-007 |
| `EV-MS-IDEMP-001` | `service-flow-fast` / replay | suite artifact root(s) | corresponding concrete suite report(s) | `TC-IDEMP-*` | AC-MS-007/014/038; VF-MS-006 |
| `EV-MS-CONFIG-001` | `config-redline` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | `TC-CONFIG-*` | AC-MS-023/029/036; VF-MS-004/008 |
| `EV-MS-REDACTION-001` | `redaction-boundary` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | `TC-REDACTION-*` | AC-MS-028~032/036~039; VF-MS-005 |
| `EV-MS-ARCH-001` | `dependency-boundary` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | `TC-ARCH-001` | AC-MS-027/036; VF-MS-008 |
| `EV-MS-NFR-001` | release / replay / redaction | contributing suite artifact roots | `reports/runs/<run_id>/summary.md` + contributing suite reports | `TC-NFR-*` / relevant cuts | AC-MS-034~039 |
| `EV-MS-REPORT-001` | report-audit checks | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | report integrity cases | AC-MS-037; VF-MS-009 |

表中路径是未来固定结构，不表示当前目录、run 或结果已存在。

## 4. Artifact 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/config-digest.json
  meta/source-refs.json
  evidence-index.json
  suites/<suite>/
    report.json
    stdout.log
    stderr.log
    cases/<case_id>.json
    artifacts/<safe_artifact_name>.json
```

原始机器证据只能进入 `artifacts/test/<run_id>`，禁止加入项目名子目录，禁止使用 `latest`。

## 5. Reports 目录结构

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-results.md
    evidence-index.md
    redaction-check.md
    dependency-boundary.md
    report-audit.md
    suites/<suite>.md
    evidence/EV-MS-<FAMILY>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

`reports/runs/<run_id>` 是人类可读报告，`reports/acceptance` 是待审交接初稿，`reports/review` 是人工 / Agent 补充；任何目录都不得静态制造 passed。

## 6. Raw artifact JSON 最小 schema

### 6.1 `meta/context.json`

| 字段 | 必填 | 类型 / 约束 |
|---|---|---|
| `schema_version` | 是 | `member_service.artifact.v1` |
| `run_id` | 是 | 非 `latest` 的固定 run id |
| `suite_refs` | 是 | suite 字符串数组 |
| `config_profile` | 是 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` 或 future approved profile |
| `started_at` | 是 | timestamp |
| `tool_version` | 是 | gate/report writer 版本或 source ref |
| `redacted_environment` | 是 | 仅安全键和值 |
| `artifact_root` | 是 | `artifacts/test/<run_id>` |
| `report_root` | 是 | `reports/runs/<run_id>` |
| `artifact_digest_algorithm` | 是 | `sha256` |
| `artifact_digest` | 是 | `sha256:<64 lowercase hex>`，不含自身计算 |

### 6.2 `meta/source-refs.json`

| 字段 | 必填 | 约束 |
|---|---|---|
| `schema_version` | 是 | `member_service.artifact.v1` |
| `run_id` | 是 | 与 context 相同 |
| `design_source_ref` | 是 | 设计来源安全 ref；当前未生成 |
| `implementation_source_ref` | 是 | 实现来源安全 ref；当前未生成 |
| `core_contracts_source_ref` | 是 | core source ref；当前 pending |
| `workspace_status_ref` | 否 | safe dirty-status ref，不含 diff body |
| `artifact_digest_algorithm` / `artifact_digest` | 是 | 同一 sha256 规则 |

### 6.3 `meta/config-digest.json`

| 字段 | 必填 | 约束 |
|---|---|---|
| `schema_version` | 是 | `member_service.artifact.v1` |
| `run_id` | 是 | 与 context 相同 |
| `config_profile` | 是 | 选定 profile |
| `config_digest_algorithm` | 是 | `sha256` |
| `config_digest` | 是 | 仅脱敏有效配置摘要 |
| `redacted_config_ref` | 是 | opaque/safe ref，不含 secret/body |
| `artifact_digest_algorithm` / `artifact_digest` | 是 | 同一 sha256 规则 |

### 6.4 `suites/<suite>/report.json`

| 字段 | 必填 | 约束 |
|---|---|---|
| `schema_version` | 是 | `member_service.artifact.v1` |
| `run_id` | 是 | 与 context 相同 |
| `suite` | 是 | suite id |
| `status` | 是 | passed/failed/partial/skipped/unavailable/not_run |
| `blocker_status` | 条件 | blocked/waiting/pending；仅用于合同或环境 blocker |
| `case_refs` | 是 | case id 数组 |
| `case_digests` | 是 | case id → sha256 digest |
| `safe_failure_reason_ref` | 条件 | failed/partial/unavailable/not_run 时必填；不含 stack/body |
| `duration_ms` | 是 | non-negative integer |
| `config_profile` | 是 | profile |
| `started_at` / `finished_at` | 是 | timestamp |
| `stdout_digest` / `stderr_digest` | 否 | redacted log digest |
| `artifact_digest_algorithm` / `artifact_digest` | 是 | 同一 sha256 规则 |

### 6.5 `cases/<case_id>.json`

| 字段 | 必填 | 约束 |
|---|---|---|
| `schema_version` | 是 | `member_service.artifact.v1` |
| `run_id` / `suite` / `case_id` | 是 | 与路径一致 |
| `tc_refs` | 是 | 至少一个 `TC-*` |
| `status` | 是 | suite 状态枚举 |
| `blocker_status` | 条件 | blocked/waiting/pending 的附加分类 |
| `assertions` | 是 | assertion array |
| `safe_failure_reason_ref` | 条件 | 未通过或未执行时的 safe ref |
| `evidence_candidate_refs` | 是 | `EV-CAND-*` 数组，可为空 |
| `evidence_family_refs` | 是 | `EV-MS-*` 族 |
| `artifact_refs` | 是 | 同 suite 下的安全相对路径 |
| `artifact_digest_algorithm` / `artifact_digest` | 是 | sha256 |

Assertion 对象至少包含 `assertion_id`、`status`（passed/failed/skipped/not_run）、`expected_ref`，可选 `actual_ref`、`message_ref`、`safe_failure_reason_ref`；不得含 raw body、secret、stack 或外部正文。

## 7. Evidence index 最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `schema_version` | 是 | `member_service.artifact.v1` |
| `run_id` | 是 | 固定 run id，不是 latest |
| `items` | 是 | 只能从真实 raw artifacts / generated reports 推导 |
| `artifact_digest_algorithm` / `artifact_digest` | 是 | sha256 |

每个 evidence item 至少包含：

| 字段 | 必填 | 约束 |
|---|---|---|
| `evidence_id` | 是 | `EV-MS-*` |
| `suite` | 是 | 真实来源 suite |
| `status` | 是 | passed/failed/partial/skipped/unavailable/not_run |
| `blocker_status` | 条件 | blocked/waiting/pending；不得替代真实执行状态 |
| `tc_refs` | 是 | `TC-*` |
| `ac_refs` | 是 | `AC-MS-*`；未来 `06` 消费 |
| `veto_refs` | 条件 | `VF-MS-*` |
| `artifact_path` | 是 | `artifacts/test/<run_id>/...` |
| `report_path` | 是 | `reports/runs/<run_id>/...` |
| `artifact_digest` | 是 | source raw artifact digest |
| `generated_from` | 是 | script + input artifact refs |
| `redaction_status` | 是 | clean/failed/not_applicable |
| `review_status` | 是 | pending/reviewed/disputed |

## 8. Digest 与真实性规则

- P0 artifact digest algorithm 固定为 `sha256`；digest 输入为去掉自身字段后的 canonical UTF-8 JSON，object keys lexicographic sort，数组保持存储顺序。
- stdout/stderr 是脱敏日志；其 digest 可被 suite report 引用，不在日志内嵌入 raw JSON。
- evidence index 必须由真实 artifact/report 关系推导；不能从静态映射表、手写 JSON 或默认状态生成 evidence。
- 缺少 raw artifact、report、digest、TC/AC/VF 追溯、redaction scan 或 failure reason 时，证据状态为 incomplete/failed/unavailable，不能为 passed。
- failed/partial/unavailable suite 仍需归档 report、case、stdout/stderr 和 safe failure reason。
- 合同或环境 blocker 通过 `blocker_status=blocked|waiting|pending` 表达；不得把 blocker 状态直接改写为 passed、ready 或 signoff。

## 9. 报告生成脚本映射

| 报告 | 输入 | 计划脚本 | 输出 | 人 / Agent 审查 |
|---|---|---|---|---|
| suite report | suite report.json + case artifacts | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查 case、失败原因和边界 |
| gate results | suite reports | `scripts/reports/build_gate_summary.sh` | `reports/runs/<run_id>/gate-results.md` | 检查阻断 / 告警分类 |
| evidence index | raw artifacts + reports | `scripts/reports/generate_evidence_index.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV/TC/AC/VF/path/digest |
| redaction check | artifact/report scan | `scripts/checks/check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` | 检查扫描完整性 |
| dependency check | dependency graph | `scripts/checks/check_dependency_boundary.sh` | `reports/runs/<run_id>/dependency-boundary.md` | 检查 compile seam |
| report audit | raw/report pairing | `scripts/checks/check_artifact_report_pairing.sh` + `check_no_static_evidence.sh` | `reports/runs/<run_id>/report-audit.md` | 阻断 orphan/static evidence |
| acceptance handoff | reports + residual | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/handoff.md` | 人 / Agent 补充交接和风险 |
| veto checklist draft | evidence index + VF / defect / audit | planned `generate_veto_checklist.sh` | `reports/acceptance/veto-checklist.md` | 不得默认全部通过 |
| risk acceptance draft | residual / unavailable markers | planned `generate_risk_acceptance.sh` | `reports/acceptance/risk-acceptance.md` | 必须列 owner、范围、触发条件 |
| open issues draft | defects + failed / pending suite reports | planned `generate_open_issues.sh` | `reports/acceptance/open-issues.md` | 不得遗漏 S/A blocker |

## 10. 失败 suite 与审查补充

| 失败类型 | 必须保留 | 禁止行为 |
|---|---|---|
| assertion failed | report、case、stdout/stderr、safe failure reason | 删除失败材料、改写 passed |
| config invalid | validation artifact、safe issue ref | 输出 env/secret value |
| redaction leak | failed scan artifact、脱敏诊断 | 回显 sentinel/body |
| dependency violation | dependency graph、safe offending ref | 隐藏违规 edge |
| report generation failed | partial audit、缺失路径 | 手写 evidence index 补洞 |
| sibling positive unavailable | unavailable/blocker marker | 计为 P0 passed 或修复完成 |

人工 / Agent 审查只能解释运行范围、边界、争议和 residual，不能替代 raw artifact：

| 审查材料 | 审查重点 | 可否替代 raw artifact |
|---|---|---|
| `reports/acceptance/handoff.md` | source refs、运行范围、P0/P1/P2、未覆盖项 | 否 |
| `reports/acceptance/veto-checklist.md` | 每个 VF 是否有真实 EV 和 raw artifact | 否 |
| `reports/acceptance/risk-acceptance.md` | residual 的 owner、影响、触发条件 | 否 |
| `reports/acceptance/open-issues.md` | S/A blocker、failed suite、missing report | 否 |
| `reports/review/reviewer-notes.md` | 人工评审结论和争议 | 否 |
| `reports/review/agent-review.md` | 追溯、redaction、boundary、static evidence 复核 | 否 |

## 11. 跨证据真实性 / 追溯审计

| 审计项 | 通过标准 |
|---|---|
| 无 orphan EV | 每个 EV 回指真实 suite artifact 和 report |
| 无静态造证据 | evidence index 从 raw/report pair 推导 |
| 无 report 缺 artifact | 每个 report 有 raw artifact digest |
| redaction 完整 | 扫描 artifacts、reports、logs、metrics、audit、trace fixture |
| dependency 可证明 | report 能说明 compile/runtime/event/ref/adapter/fake 分类 |
| failed suite 可审计 | failed/partial/unavailable 保留完整失败材料 |
| 验收引用不断裂 | ac_refs/veto_refs 可供新版 `06` 消费 |
| 不提前裁决 | 本方案不写 acceptance pass/fail、signoff 或 readiness |

## 12. 回填草稿与进入条件

正式 §13 应包含证据族、P0 归档表、artifact/report 目录、JSON schema 最小字段、生成脚本、失败保留和真实性审计；所有路径为 planned run-scoped 结构。

- [x] P0 用例都有证据族和归档方式。
- [x] 证据与报告路径固定且不引用 latest。
- [x] 执行状态与 blocker_status 分离，失败 / unavailable 材料保留规则明确。
- [x] acceptance handoff、VETO checklist、risk acceptance 和 open issues 均只作为 planned 待审输出。
- [x] 可进入 Step 14。
