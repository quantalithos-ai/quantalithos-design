# Step 13. 定义测试报告与证据归档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节: `05-测试方案.md` §13 测试报告与证据归档

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义测试报告与证据归档 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 追溯矩阵;Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验;Step 12 进出准则 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_13_evidence.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

定义测试执行后必须留下哪些 raw artifact、run report、evidence index、acceptance handoff 初稿和人工 / Agent 审查补充材料,并明确每个 P0 测试切口如何从真实 suite artifact 追溯到用例和后续验收引用。

本 Step 只回答:

- 每类 P0 测试输出什么证据。
- 证据保存在什么目录,目录是否绑定固定 `run_id`。
- Step 6 的 `EV-CAND-*` 如何收敛到正式 `EV-GOV-*` 证据族。
- 每个证据如何回指 TC-GOV、suite、artifact root、report path 和后续 AC / VETO。
- 哪些报告由脚本生成,哪些必须由人 / Agent 审查补充。
- 失败 suite 如何保留 `report.json`、stdout/stderr 和 failure reason。
- redaction、dependency、artifact/report pairing 和 no-static-evidence 如何证明证据真实。

本 Step 不填写实际执行结果,不裁决验收 pass / fail,不生成真实 `run_id`,不把 `reports/acceptance/*` 写成自动通过报告。新版 `06-验收标准.md` 才负责正式验收裁决和 VETO 结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供 C-GOV / FR-GOV / BR-GOV / AC-GOV / VF-GOV 到证据族的追溯 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 TC-GOV-* 用例和 `EV-CAND-*` 候选证据 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 suite、gate、artifact root、report root 和脚本 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 redaction、dependency、no truth repair、observability 和 performance sample 证据口径 |
| `05_test_plan_step_11_defects_retest.md` | 已完成 | 提供缺陷关闭证据、复验证据和防回归证据要求 |
| `05_test_plan_step_12_entry_exit.md` | 已完成 | 提供退出前 raw artifact/report pairing、static evidence 阻断和 residual 处理 |
| `测试方案书写规范.md` §5.13 | 标准输入 | 提供报告结构、证据归档表和写法规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类测试输出什么证据? | Contract/domain/service/query/consumer/outbox/job/config/redaction/dependency/release smoke/report audit 均输出 suite raw artifact、case result、suite human report 和对应 EV-GOV 证据条目。 |
| 证据保存在哪里? | 原始机器证据统一进入 `artifacts/test/<run_id>`;人类可读报告统一进入 `reports/runs/<run_id>`;送验交接初稿进入 `reports/acceptance`;审查补充进入 `reports/review`。 |
| 证据如何关联用例和验收项? | 每个 evidence item 必须记录 `tc_refs`、`suite`、`artifact_path`、`report_path`、`ac_refs`、`veto_refs`、`run_id` 和 artifact digest。 |
| 哪些日志、trace、DB snapshot 或报告必须保留? | P0 不要求真实 DB snapshot;必须保留 suite `report.json`、case JSON、stdout/stderr、gate summary、redaction report、dependency report、report audit、evidence index、release smoke scenario report、job report和安全脱敏 trace/audit refs。 |
| 证据保留多久? | P0 release candidate 证据至少保留到该候选版本验收结束后和后续缺陷复验关闭后;具体天数属于项目归档策略,本 Step 不固定数字。 |
| 原始机器证据是否统一进入 `artifacts/test/<run_id>`? | 是,不得带项目子目录,不得使用 `latest`。 |
| 人类可读报告是否统一进入 `reports/runs/<run_id>`? | 是,所有 run report 必须从 raw artifact 推导。 |
| 验收交接报告是否统一进入 `reports/acceptance`? | 是,但只能作为脚本生成初稿 + 人 / Agent 审查补充,不得静态宣告 VETO passed。 |
| 哪些报告由 `scripts/reports/*` 自动生成? | suite reports、gate summary、evidence index、acceptance handoff 初稿、veto checklist 初稿、risk acceptance 初稿、open issues 初稿均由 report scripts 从 artifacts/reports/defect inputs 推导。 |
| 哪些报告必须由人或 Agent 审查补充? | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、`reports/review/reviewer-notes.md`、`reports/review/agent-review.md` 必须允许人工 / Agent 审查补充。 |
| 失败 suite 是否仍产出 artifact? | 是。失败 suite 必须保留 `report.json`、stdout/stderr、failure reason、safe diagnostic ref 和已执行 case result。 |
| redaction / boundary scan 如何证明安全? | `check_redaction.sh` 必须扫描 artifact 和 report;`check_dependency_boundary.sh` 必须扫描依赖图;两个 report 自身也必须脱敏。 |
| 每个 P0 evidence 是否能回指真实 artifact? | 是。`EV-GOV-*` 不得只来自静态 JSON 或手写表,必须从 suite artifact / report pair 推导。 |
| 每类报告完成后是否停审? | 是。见 §8.9 和 §8.10。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 使用 `EV-CAND-*`,没有正式归档 ID | 本 Step 固定 `EV-GOV-*` 证据族 |
| Step 9 | 固定 artifact/report root,但 evidence index 尚未定义 | 本 Step 固定 evidence index schema 和生成脚本 |
| Step 10 | 专项证据仍为候选 | 本 Step 纳入 redaction、dependency、observability、performance sample 证据族 |
| Step 11 | 缺陷关闭证据未绑定路径 | 本 Step 绑定 failed/fixed run artifact 和 review report |
| Step 12 | 退出要求 evidence candidate,但未定义正式归档结构 | 本 Step 固定目录、报告、审查和真实性审计 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 证据 ID | `EV-CAND-*` 候选 | `EV-GOV-*` 证据族 + run item | 支撑正式 `05` 回填和后续 `06` 引用 |
| 证据来源 | suite/report 方向明确但未收口 | 必须从 raw artifact/report pair 推导 | 防止静态造证据 |
| `reports/acceptance` | 未定义 | 只作为交接初稿和审查补充 | 不提前裁决验收 |
| failed suite | 未明确是否保留 | 必须保留失败 artifact | 支撑缺陷复验和审计 |
| redaction/dependency | 门禁存在 | 进入证据真实性必审项 | 一票否决风险需要可追溯证据 |

## 7. 证据归档设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否为每个 TC 固定一个 EV | A. 每个 TC 一个 EV;B. 按证据族 + case result 绑定 TC | 采用 B。TC 数量多,run item 可精确绑定单个 TC |
| evidence index 是否可手写 | A. 可手写;B. 必须从 artifact/report 推导 | 采用 B。防止伪证据 |
| acceptance report 是否自动 pass | A. 自动 pass;B. 只生成初稿,需审查补充 | 采用 B。验收裁决属于新版 `06` |
| failed artifact 是否归档 | A. 只归档 passed;B. failed 也归档 | 采用 B。失败证据是缺陷闭环输入 |
| performance 是否生成 pass EV | A. 生成 pass EV;B. 只生成 sample/trend EV | 采用 B。当前无硬阈值 |

## 8. 结构化中间产物

### 8.1 正式证据 ID 规则

`EV-GOV-*` 是正式证据族 ID。每次执行产生的具体证据实例必须由 `run_id + evidence_id + suite + artifact_digest` 唯一定位。

| 证据族 | 对应候选 | 含义 |
|---|---|---|
| `EV-GOV-CORE-*` | `EV-CAND-GOV-CORE-*` | 核心业务闭环和 release smoke |
| `EV-GOV-CONTRACT-*` | `EV-CAND-GOV-CONTRACT-*` | DTO、metadata、digest、protocol roundtrip |
| `EV-GOV-STATE-*` | `EV-CAND-GOV-STATE-*` | domain invariant、policy、state matrix |
| `EV-GOV-CMD-*` | `EV-CAND-GOV-CMD-*` | command accepted/rejected/duplicate/UoW |
| `EV-GOV-QUERY-*` | `EV-CAND-GOV-QUERY-*` | query hit/missing/not-visible/degraded/no-write |
| `EV-GOV-CONSUMER-*` | `EV-CAND-GOV-CONSUMER-*` | inbound consumer accepted/duplicate/unsupported/delayed |
| `EV-GOV-OUTBOX-*` | `EV-CAND-GOV-OUTBOX-*` | stored payload snapshot、publish marker、topic map |
| `EV-GOV-JOB-*` | `EV-CAND-GOV-JOB-*` | operations job report、partial failure、no truth repair |
| `EV-GOV-IDEMP-*` | `EV-CAND-GOV-IDEMP-*` | idempotency、stored result/report replay、race guard |
| `EV-GOV-CONFIG-*` | `EV-CAND-GOV-CONFIG-*` | profile、strict config、topic completeness、runtime builder |
| `EV-GOV-REDACTION-*` | `EV-CAND-GOV-REDACTION-*` | logs/metrics/audit/report/artifact forbidden body scan |
| `EV-GOV-ARCH-*` | `EV-CAND-GOV-ARCH-*` | compile-time dependency boundary |
| `EV-GOV-NFR-*` | `EV-CAND-GOV-NFR-*` | performance sample、availability/degraded、observability sample |
| `EV-GOV-REPORT-*` | `EV-CAND-GOV-REPORT-*` | artifact/report pairing、no static evidence、gate summary |

### 8.2 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 后续验收引用 |
|---|---|---|---|---|---|
| `EV-GOV-CORE-001` | release scenario report | `release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/`;`reports/runs/<run_id>/suites/release-main-smoke.md` | representative TC-GOV-CMD/QUERY/OUTBOX/JOB/CONFIG/REDACTION | AC-GOV-001~005;VF-GOV-001 |
| `EV-GOV-CONTRACT-001` | protocol report | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | TC-GOV-CONTRACT-001~004 | AC-GOV-006~015 |
| `EV-GOV-STATE-001` | domain/state report | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | TC-GOV-DOMAIN-001~005;TC-GOV-STATE-001~006 | AC-GOV-016~021;VF-GOV-005~006 |
| `EV-GOV-CMD-001` | service command report | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | TC-GOV-CMD-001~030 | AC-GOV-006~021;VF-GOV-002~009 |
| `EV-GOV-QUERY-001` | query no-write report | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | TC-GOV-QUERY-001~016 | AC-GOV-009~031;VF-GOV-009 |
| `EV-GOV-CONSUMER-001` | worker consumer report | `entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/` | TC-GOV-CONSUMER-001~012 | AC-GOV-009~031;VF-GOV-002~004 |
| `EV-GOV-OUTBOX-001` | outbox publish report | `operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | TC-GOV-OUTBOX-001~015 | AC-GOV-009~031;VF-GOV-003/009 |
| `EV-GOV-JOB-001` | job replay report | `operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | TC-GOV-JOB-001~010 | AC-GOV-010/030/031;VF-GOV-009 |
| `EV-GOV-IDEMP-001` | consistency/fault report | `infra-runtime-fake`;`operations-replay-core` | `artifacts/test/<run_id>/suites/<suite>/` | TC-GOV-IDEMP-001~013 | AC-GOV-030~031;VF-GOV-006/009 |
| `EV-GOV-CONFIG-001` | config redline report | `config-redline` | `artifacts/test/<run_id>/suites/config-redline/`;`reports/runs/<run_id>/suites/config-redline.md` | TC-GOV-CONFIG-001~008 | AC-GOV-026~031 |
| `EV-GOV-REDACTION-001` | redaction scan report | `redaction-boundary`;`check_redaction.sh` | `artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` | TC-GOV-REDACTION-001~004 | AC-GOV-025/028/031;VF-GOV-003/007 |
| `EV-GOV-ARCH-001` | dependency graph report | `dependency-boundary`;`check_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/dependency-boundary/`;`reports/runs/<run_id>/dependency-boundary.md` | TC-GOV-ARCH-001 | AC-GOV-019;VF-GOV-010 |
| `EV-GOV-NFR-001` | performance/degraded/observability sample | `release-main-smoke`;`operations-replay-core`;`redaction-boundary` | `artifacts/test/<run_id>/suites/<suite>/` | TC-GOV-NFR-*;TC-GOV-CONFIG-* | AC-GOV-026~031 |
| `EV-GOV-REPORT-001` | report integrity audit | `report-generation-audit` | `artifacts/test/<run_id>/suites/report-generation-audit/`;`reports/runs/<run_id>/report-audit.md` | all P0 suite pairing | supports all AC / VETO evidence integrity |

### 8.3 测试切口到证据 / 验收映射表

| 测试切口 | 用例 ID | Suite / Gate | 证据 ID | artifact root | report path | 后续 AC / VETO |
|---|---|---|---|---|---|---|
| core governance closure | TC-GOV-CORE-*;representative TC-GOV-* | `release-main-smoke` | `EV-GOV-CORE-001` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | AC-GOV-001~005;VF-GOV-001 |
| contracts/domain/state | TC-GOV-CONTRACT-*;TC-GOV-DOMAIN-*;TC-GOV-STATE-* | `contract-domain-fast` | `EV-GOV-CONTRACT-001`;`EV-GOV-STATE-001` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | AC-GOV-006~021 |
| command/query service | TC-GOV-CMD-*;TC-GOV-QUERY-* | `service-flow-fast` | `EV-GOV-CMD-001`;`EV-GOV-QUERY-001` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | AC-GOV-006~031;VF-GOV-009 |
| consumer/entry/job | TC-GOV-CONSUMER-*;TC-GOV-JOB-* | `entry-worker-job` | `EV-GOV-CONSUMER-001`;`EV-GOV-JOB-001` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | AC-GOV-009~031 |
| outbox/operations replay | TC-GOV-OUTBOX-*;TC-GOV-JOB-*;TC-GOV-IDEMP-* | `operations-replay-core` | `EV-GOV-OUTBOX-001`;`EV-GOV-JOB-001`;`EV-GOV-IDEMP-001` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | AC-GOV-010/030/031;VF-GOV-009 |
| config gates | TC-GOV-CONFIG-* | `config-redline`;release config check | `EV-GOV-CONFIG-001` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | AC-GOV-026~031 |
| redaction and body boundary | TC-GOV-REDACTION-*;TC-GOV-CMD-030;TC-GOV-CONSUMER-004 | `redaction-boundary`;release redaction check | `EV-GOV-REDACTION-001` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | VF-GOV-003/007 |
| dependency boundary | TC-GOV-ARCH-001 | `dependency-boundary`;release dependency check | `EV-GOV-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | AC-GOV-019;VF-GOV-010 |
| report integrity | all P0 suite pairing | `report-generation-audit` | `EV-GOV-REPORT-001` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | evidence integrity VETO |
| P1 selected-run | future selected TC only | `p1-real-like-selected-run` | future P1 EV | `artifacts/test/<run_id>/suites/p1-real-like-selected-run/` | `reports/runs/<run_id>/suites/p1-real-like-selected-run.md` | residual only,not P0 |

### 8.4 Artifact 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/config-digest.json
  meta/source-commits.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<case_id>.json
  suites/<suite>/artifacts/<safe_artifact_name>.json
```

约束:

- `meta/context.json` 必须包含 `run_id`、suite list、config profile、started_at、tool version 和 redacted environment summary。
- `meta/source-commits.json` 必须记录 design commit、implementation commit、core-contracts commit 或等价 source refs。
- `evidence-index.json` 只能由 suite raw artifact 和 generated reports 推导。
- `stdout.log`、`stderr.log` 必须经过 redaction scan;失败日志也不得回显 secret/body。
- `cases/<case_id>.json` 必须符合 §8.4.1 raw artifact JSON schema,并回指 TC-GOV id、status、assertions、safe failure reason、evidence candidate / formal evidence family 和 artifact digest。

### 8.4.1 Raw artifact JSON schema

P0 raw artifact JSON 由 jobs/gate/report artifact writer 生成。字段名、枚举和 digest 规则如下,不得由具体 binary 自行发明。

Shared enums:

| Enum | Values | Scope |
|---|---|---|
| `GovernanceArtifactStatus` | `passed`,`failed`,`partial`,`skipped`,`unavailable` | suite,case,evidence item,safe artifact |
| `GovernanceAssertionStatus` | `passed`,`failed`,`skipped`,`not_run` | case assertion item |
| `GovernanceArtifactDigestAlgorithm` | `sha256` | every JSON artifact with `artifact_digest` |
| `GovernanceRedactionStatus` | `clean`,`failed`,`not_applicable` | evidence index / scan-derived artifact |
| `GovernanceReviewStatus` | `pending`,`reviewed`,`disputed` | evidence index only |

Digest rule:

- `artifact_digest_algorithm` is always `sha256` in P0.
- `artifact_digest` format is `sha256:<64 lowercase hex chars>`.
- Digest input is canonical UTF-8 JSON for the same object with `artifact_digest` omitted.
- Canonical JSON uses lexicographically sorted object keys,arrays in stored order,no insignificant whitespace,JSON strings escaped by the JSON encoder,and no timestamps or paths outside the declared fields.
- `stdout.log` and `stderr.log` are redacted log artifacts and do not carry embedded JSON digest;their digests may be referenced from a suite or safe artifact JSON item.

`meta/context.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | string,`governance.artifact.v1` | fixed P0 schema marker |
| `run_id` | yes | `GovernanceJobRunId` or gate run id string | must not be `latest` |
| `suite_refs` | yes | array of suite strings | sorted by writer |
| `config_profile` | yes | string | selected profile |
| `started_at` | yes | timestamp string | entry start time |
| `tool_version` | yes | string | jobs/gate writer version or source ref |
| `redacted_environment` | yes | object | safe keys / redacted values only |
| `artifact_root` | yes | string | run-scoped output root |
| `report_root` | yes | string | run-scoped report root |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

`meta/source-commits.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | `governance.artifact.v1` | fixed |
| `run_id` | yes | string | same run id |
| `design_source_ref` | yes | string | design commit or equivalent source ref |
| `implementation_source_ref` | yes | string | implementation commit or equivalent source ref |
| `core_contracts_source_ref` | yes | string | core contracts source ref |
| `workspace_status_ref` | no | string | safe dirty-status ref,not diff body |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

`meta/config-digest.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | `governance.artifact.v1` | fixed |
| `run_id` | yes | string | same run id |
| `config_profile` | yes | string | selected profile |
| `config_digest_algorithm` | yes | `sha256` | digest of redacted effective config summary |
| `config_digest` | yes | `sha256:<hex>` | no raw secret/body |
| `redacted_config_ref` | yes | string | safe config ref or generated ref |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

`suites/<suite>/report.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | `governance.artifact.v1` | fixed |
| `run_id` | yes | string | same run id |
| `suite` | yes | string | suite id |
| `status` | yes | `GovernanceArtifactStatus` | aggregate suite status |
| `case_refs` | yes | array of case ids | all executed/planned case files in this suite |
| `case_digests` | yes | object map case id -> digest | each referenced case JSON digest |
| `failure_reason_ref` | no | string | safe reason ref only |
| `duration_ms` | yes | non-negative integer | suite duration |
| `config_profile` | yes | string | selected profile |
| `started_at` | yes | timestamp string | suite start |
| `finished_at` | yes | timestamp string | suite finish |
| `stdout_digest` | no | string | digest of redacted stdout.log if present |
| `stderr_digest` | no | string | digest of redacted stderr.log if present |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

`suites/<suite>/cases/<case_id>.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | `governance.artifact.v1` | fixed |
| `run_id` | yes | string | same run id |
| `suite` | yes | string | suite id |
| `case_id` | yes | string | case id |
| `tc_refs` | yes | array of `TC-GOV-*` ids | at least one |
| `status` | yes | `GovernanceArtifactStatus` | case status |
| `assertions` | yes | array of assertion objects | see below |
| `safe_failure_reason_ref` | no | string | safe reason ref only |
| `evidence_candidate_refs` | yes | array of `EV-CAND-*` ids | may be empty only for non-evidence helper cases |
| `evidence_family_refs` | yes | array of `EV-GOV-*` ids | formal evidence families covered |
| `artifact_refs` | yes | array of safe artifact relative paths | under the same suite artifact root |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

Assertion object:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `assertion_id` | yes | string | stable within case |
| `status` | yes | `GovernanceAssertionStatus` | assertion status |
| `expected_ref` | yes | string | safe expected condition ref |
| `actual_ref` | no | string | safe actual result ref,not raw body |
| `message_ref` | no | string | safe diagnostic ref |
| `failure_reason_ref` | no | string | safe failure reason ref |

Root `evidence-index.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | `governance.artifact.v1` | fixed |
| `run_id` | yes | string | same run id |
| `items` | yes | array of evidence items | derived only from raw artifacts and generated reports |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

Evidence item:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `evidence_id` | yes | `EV-GOV-*` | formal evidence family id |
| `suite` | yes | string | source suite |
| `status` | yes | `GovernanceArtifactStatus` | evidence status |
| `tc_refs` | yes | array of `TC-GOV-*` | traceability |
| `ac_refs` | yes | array of `AC-GOV-*` | acceptance traceability |
| `veto_refs` | no | array of `VF-GOV-*` | required when VETO relevant |
| `artifact_path` | yes | string | run-scoped raw artifact path |
| `report_path` | yes | string | run-scoped generated report path |
| `artifact_digest` | yes | `sha256:<hex>` | digest of source raw artifact |
| `generated_from` | yes | array of strings | script/source artifact refs |
| `redaction_status` | yes | `GovernanceRedactionStatus` | safe output check status |
| `review_status` | yes | `GovernanceReviewStatus` | human/agent review status |

`suites/<suite>/artifacts/<safe_artifact_name>.json`:

| Field | Required | Type / values | Notes |
|---|---|---|---|
| `schema_version` | yes | `governance.artifact.v1` | fixed |
| `run_id` | yes | string | same run id |
| `suite` | yes | string | suite id |
| `artifact_name` | yes | string | safe file stem |
| `artifact_kind` | yes | string | writer-defined safe kind |
| `status` | yes | `GovernanceArtifactStatus` | artifact status |
| `safe_refs` | yes | array of strings | safe refs only |
| `safe_summary` | no | object | redacted/body-free summary only |
| `artifact_digest_algorithm` | yes | `sha256` | shared digest rule |
| `artifact_digest` | yes | string | digest of this object excluding this field |

### 8.5 Reports 目录结构

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
    evidence/EV-GOV-<FAMILY>-<NNN>.md
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

- `reports/runs/<run_id>` 是一次运行的人类可读报告根目录。
- `reports/acceptance/*` 是送验交接初稿和审查补充位置,不得由静态数据默认写成 passed。
- `reports/review/*` 保存人工 / Agent 审查意见,可引用 run reports,不得替代 raw artifact。
- 所有 report path 必须绑定固定 `<run_id>`,不得引用 `latest`。

### 8.6 报告生成脚本映射

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| suite report | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释、case refs、safe diagnostics 是否准确 |
| gate summary | all suite `report.json` | `scripts/reports/build_gate_summary.sh` | `reports/runs/<run_id>/gate-summary.md` | 检查 blocking/non-blocking 分类是否正确 |
| evidence index | suite artifacts + suite reports | `scripts/reports/generate_evidence_index.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV / TC / AC / VETO 是否可追溯 |
| redaction report | artifact/report scan result | `scripts/checks/check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` | 检查扫描范围是否覆盖 artifact and report |
| dependency report | dependency graph raw artifact | `scripts/checks/check_dependency_boundary.sh` | `reports/runs/<run_id>/dependency-boundary.md` | 检查只允许 `L0-core` / core-contracts compile upstream |
| report audit | artifact/report pairing raw artifact | `scripts/checks/check_artifact_report_pairing.sh`;`scripts/checks/check_no_static_evidence.sh` | `reports/runs/<run_id>/report-audit.md` | 检查 orphan EV、缺 raw artifact、静态造证据 |
| acceptance handoff | run reports + evidence index + defect/residual input | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/handoff.md` | 必须人工 / Agent 补充交付说明和边界 |
| veto checklist draft | evidence index + redaction/dependency/report audit + defect status | `scripts/reports/generate_veto_checklist.sh` | `reports/acceptance/veto-checklist.md` | 不得默认全部 passed;必须逐项引用证据 |
| risk acceptance draft | residual records + P1/P2 unavailable markers | `scripts/reports/generate_risk_acceptance.sh` | `reports/acceptance/risk-acceptance.md` | 必须有接受人、范围和触发条件 |
| open issues draft | defects + failed/pending suite reports | `scripts/reports/generate_open_issues.sh` | `reports/acceptance/open-issues.md` | 必须人工 / Agent 审查是否遗漏阻断项 |

### 8.7 Evidence index 最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `run_id` | 是 | 固定运行 ID,不得为 `latest` |
| `evidence_id` | 是 | `EV-GOV-*` 证据族 |
| `suite` | 是 | 产生证据的 suite / gate |
| `status` | 是 | passed / failed / partial / unavailable / skipped,不得静态伪造 |
| `tc_refs` | 是 | 对应 TC-GOV-* |
| `ac_refs` | 是 | 后续 AC-GOV-* 引用 |
| `veto_refs` | 条件必填 | 涉及 VF-GOV 或证据完整性时必填 |
| `artifact_path` | 是 | `artifacts/test/<run_id>/...` |
| `report_path` | 是 | `reports/runs/<run_id>/...` |
| `artifact_digest` | 是 | 对 raw artifact 的 digest |
| `generated_from` | 是 | 生成脚本和输入 artifact 列表 |
| `redaction_status` | 是 | clean / failed / not-applicable |
| `review_status` | 是 | pending / reviewed / disputed |

### 8.8 失败 suite 归档规则

| 失败类型 | 必须保留 | 禁止行为 |
|---|---|---|
| test assertion failed | `report.json`;case JSON;stdout/stderr;failure reason | 删除 failed artifact 或改写 passed |
| config invalid | config validation report;safe issue ref | 输出 raw secret/env value |
| redaction leak fixture failed as expected | failed scan artifact with redacted diagnostic | 回显注入 secret/body |
| dependency boundary failed | dependency graph raw report;offending dependency safe ref | 隐藏失败并生成 passed VETO |
| report generation failed | partial report audit;missing path list | 手写 evidence index 补洞 |
| P1 selected-run unavailable | unavailable marker;residual draft | 计入 P0 failed 或 P0 passed |

### 8.9 人 / Agent 审查补充要求

| 审查材料 | 审查重点 | 是否可替代 raw artifact |
|---|---|---|
| `reports/acceptance/handoff.md` | 运行范围、commit refs、P0/P1/P2 边界、未覆盖说明 | 否 |
| `reports/acceptance/veto-checklist.md` | 每个 VETO 是否有真实 EV 和 raw artifact 支撑 | 否 |
| `reports/acceptance/risk-acceptance.md` | residual 是否有接受人、影响范围、触发条件 | 否 |
| `reports/acceptance/open-issues.md` | 是否存在 S/A 阻断缺陷、failed suite、缺 report | 否 |
| `reports/review/reviewer-notes.md` | 人工审查结论和争议点 | 否 |
| `reports/review/agent-review.md` | Agent 对证据追溯、redaction、boundary、static evidence 的复核 | 否 |

### 8.10 证据归档停审记录

| 证据 / 报告 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `EV-GOV-CORE-001` | release smoke 是否场景级断言,非通用测试计数 | 通过 | 正式结果留执行报告 |
| `EV-GOV-CONTRACT-001` | DTO / metadata / digest artifact 是否可回指 TC | 通过 | 无 |
| `EV-GOV-STATE-001` | state matrix 和 illegal transition 是否有 case artifact | 通过 | 无 |
| `EV-GOV-CMD-001` | accepted/rejected/duplicate/UoW artifact 是否存在 | 通过 | 无 |
| `EV-GOV-QUERY-001` | query no-write 是否有 write-audit / no mutation 证据 | 通过 | 无 |
| `EV-GOV-CONSUMER-001` | receipt replay / unsupported / delayed 是否有 worker artifact | 通过 | 无 |
| `EV-GOV-OUTBOX-001` | stored payload snapshot 和 publish marker 是否有 report | 通过 | 无 |
| `EV-GOV-JOB-001` | report replay / partial / no truth repair 是否可追溯 | 通过 | 无 |
| `EV-GOV-CONFIG-001` | config invalid 是否 fail-fast 且无 silent fallback | 通过 | 无 |
| `EV-GOV-REDACTION-001` | artifact and report scan 是否覆盖 | 通过 | 无 |
| `EV-GOV-ARCH-001` | dependency graph 是否能证明 sibling compile boundary | 通过 | 无 |
| `EV-GOV-REPORT-001` | pairing/no-static evidence 是否阻断 | 通过 | 无 |
| `reports/acceptance/*` | 是否只作为初稿 + 审查补充 | 通过 | 不填写 pass 结论 |

### 8.11 跨证据真实性 / 追溯审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 用例是否都有证据归档方式 | 通过 | §8.2 / §8.3 覆盖所有 P0 TC family |
| 是否存在 orphan EV | 通过 | EV 必须从 suite artifact/report pair 推导 |
| 是否存在静态造证据映射 | 通过 | `check_no_static_evidence.sh` 阻断 |
| 是否存在 report 缺 raw artifact | 通过 | `check_artifact_report_pairing.sh` 阻断 |
| 是否存在 raw artifact 未脱敏 | 通过 | `check_redaction.sh` 扫描 artifact and report |
| 是否存在验收引用断裂 | 通过 | evidence index 必填 AC / VETO refs |
| 是否提前裁决验收 pass | 通过 | 本 Step 不写执行结论 |
| 是否误把 P1 selected-run 写成 P0 | 通过 | P1 only residual/unavailable |

## 9. 对上游设计的影响判定

| 证据结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| `EV-GOV-*` 作为正式证据族 | 否 | 测试方案归档细化 | 可回填 `05` |
| raw artifact 必须绑定 `artifacts/test/<run_id>` | 否 | SOP 路径收敛 | 与 Step 9 一致 |
| acceptance report 不得静态 pass | 否 | 验收证据真实性约束 | 新版 `06` 继续承接 |
| 若后续验收要求固定 VETO ID | 是 | 验收标准变更 | 新版 `06` 定义 |
| 若实现仓缺 report scripts | 否 | 实施计划任务 | 后续 `07` / 实现仓承接 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_13_evidence.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“正式证据 ID 规则”“证据归档表”“测试切口到证据 / 验收映射表”“Artifact 目录结构”“Reports 目录结构”“报告生成脚本映射”和“跨证据真实性 / 追溯审计表”小节,了解证据如何从 raw artifact 追溯到用例和后续验收引用。

正式 `05-测试方案.md` §13 应回填:

- 原始机器证据统一进入 `artifacts/test/<run_id>`,人类可读报告统一进入 `reports/runs/<run_id>`,送验交接初稿进入 `reports/acceptance`,审查补充进入 `reports/review`。
- Step 6 的 `EV-CAND-*` 在本章收敛为 `EV-GOV-*` 证据族。具体证据实例必须由 `run_id + evidence_id + suite + artifact_digest` 唯一定位。
- 所有 P0 证据必须从真实 suite artifact / report pair 推导,不得只由静态 JSON 或手写 evidence index 宣告通过。
- 失败 suite 仍必须归档 `report.json`、stdout/stderr、case result 和 failure reason。
- `reports/acceptance/*` 只能作为脚本生成初稿和人工 / Agent 审查补充,不得提前替代新版 `06-验收标准.md` 的验收裁决。
- Redaction、dependency boundary、artifact/report pairing 和 no-static-evidence 是证据真实性必审项。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 证据保留天数 | 影响归档运维 | 本 Step 只要求保留到验收和复验关闭后;不固定天数 |
| VETO 正式 ID 与 `reports/acceptance` 最终模板 | 影响新版 `06` | 本 Step 只预留引用位置 |
| implementation repo 脚本名称是否完全一致 | 影响实施计划 | 当前按 Step 9 固定;实施时若调整需回写 |
| P1 selected-run 证据是否进入同一 evidence index | 影响 residual report | 当前允许进入 index,但标记 non-P0/unavailable |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例都有证据归档方式 | 通过 | §8.2 / §8.3 |
| raw artifact 和 report 根目录固定 | 通过 | §8.4 / §8.5 |
| evidence index 不能静态造证据 | 通过 | §8.7 / §8.11 |
| failed suite 归档规则明确 | 通过 | §8.8 |
| acceptance report 没有提前裁决 | 通过 | §8.6 / §8.9 |
| 可进入 Step 14 | 通过 | 下一步定义回归策略与残余风险;进入前等待用户审查 |
