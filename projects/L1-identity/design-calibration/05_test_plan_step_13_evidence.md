# Step 13. 定义测试报告与证据归档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节: `05-测试方案.md` §13 测试报告与证据归档

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义测试报告与证据归档 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 5 追溯矩阵;Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验;Step 12 进入 / 退出准则 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_13_evidence.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

定义 L1-identity 测试执行后必须留下哪些 raw artifact、run report、evidence index、acceptance handoff 初稿和人 / Agent 审查补充材料,并明确每个 P0 测试切口如何从真实 suite artifact 追溯到用例和后续验收引用。

本 Step 只回答:

- 每类 P0 测试输出什么证据。
- 证据保存在什么目录,目录是否绑定固定 `run_id`。
- Step 6 的 `EV-CAND-ID-*` 如何收敛为正式 `EV-ID-*` 证据族。
- 每个证据如何回指 `TC-ID-*`、suite、artifact root、report path、`AC-ID-*` 和 `VETO-ID-*`。
- 哪些报告由脚本生成,哪些必须由人 / Agent 审查补充。
- 失败 suite 如何保留 `report.json`、stdout/stderr 和 failure reason。
- redaction、dependency、artifact/report pairing 和 no-static-evidence 如何证明证据真实。

本 Step 不填写实际执行结果,不裁决验收 pass / fail,不生成真实 `run_id`,不把 `reports/acceptance/*` 写成自动通过报告。新版 `06-验收标准.md` 才负责正式验收裁决和 VETO 结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 已审核通过 | 提供 C-ID / FR-ID / BR-ID / NFR-ID / AC-ID / VETO-ID 到证据族的追溯 |
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 `TC-ID-*` 用例和 `EV-CAND-ID-*` 候选证据 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 提供 suite、gate、artifact root、report root 和脚本 |
| `05_test_plan_step_10_nonfunctional.md` | 已审核通过 | 提供 redaction、dependency、no truth repair、observability 和 performance sample 证据口径 |
| `05_test_plan_step_11_defects_retest.md` | 已审核通过 | 提供缺陷关闭证据、复验证据和防回归证据要求 |
| `05_test_plan_step_12_entry_exit.md` | 已审核通过 | 提供退出前 raw artifact/report pairing、static evidence 阻断和 residual 处理 |
| `测试方案书写规范.md` §5.13 | 标准输入 | 提供报告结构、证据归档表和写法规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类测试输出什么证据? | Contract/domain/service/query/consumer/outbox/job/config/redaction/dependency/release smoke/report audit 均输出 suite raw artifact、case result、suite human report 和对应 `EV-ID-*` 证据条目。 |
| 证据保存在哪里? | 原始机器证据统一进入 `artifacts/test/<run_id>`;人类可读报告统一进入 `reports/runs/<run_id>`;送验交接初稿进入 `reports/acceptance`;审查补充进入 `reports/review`。 |
| 证据如何关联用例和验收项? | 每个 evidence item 必须记录 `tc_refs`、`suite_refs`、`artifact_paths`、`report_paths`、`ac_refs`、`veto_refs`、`run_id` 和 artifact digest。 |
| 哪些日志、trace、DB snapshot 或报告必须保留? | P0 不要求真实 DB snapshot;必须保留 suite `report.json`、case JSON、stdout/stderr、gate summary、redaction report、dependency report、report audit、evidence index、release smoke scenario report、job report 和安全脱敏 trace/audit refs。 |
| 证据保留多久? | P0 release candidate 证据至少保留到该候选版本验收结束且相关缺陷复验关闭后。具体天数属于项目归档策略,本 Step 不固定数字。 |
| 原始机器证据是否统一进入 `artifacts/test/<run_id>`? | 是,不得带项目子目录,不得使用 `latest`。 |
| 人类可读报告是否统一进入 `reports/runs/<run_id>`? | 是,所有 run report 必须从 raw artifact 推导。 |
| 验收交接报告是否统一进入 `reports/acceptance`? | 是,但只能作为脚本生成初稿 + 人 / Agent 审查补充,不得静态宣告 VETO passed。 |
| 哪些报告由 `scripts/reports/*` 自动生成? | suite reports、gate summary、evidence index、acceptance handoff 初稿、veto checklist 初稿、risk acceptance 初稿、open issues 初稿均由 report scripts 从 artifacts、run reports 和缺陷输入推导。 |
| 哪些报告必须由人或 Agent 审查补充? | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、`reports/review/reviewer-notes.md`、`reports/review/agent-review.md` 必须允许人 / Agent 审查补充。 |
| 失败 suite 是否仍产出 artifact? | 是。失败 suite 必须保留 `report.json`、stdout/stderr、failure reason、safe diagnostic ref 和已执行 case result。 |
| redaction / boundary scan 如何证明安全? | `check_redaction.sh` 必须扫描 artifact 和 report;`check_dependency_boundary.sh` 必须扫描依赖图;两个 report 自身也必须脱敏。 |
| 每个 P0 evidence 是否能回指真实 artifact? | 是。`EV-ID-*` 不得只来自静态 JSON 或手写表,必须从 suite artifact / report pair 推导。 |
| 每个 EV 是否能回指用例、suite、artifact root、report path 和验收 AC / VETO? | 是。`EV-ID-REPORT-001` 也必须回指已有 blocking suite case refs,不得新增 report-only TC。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 使用 `EV-CAND-ID-*`,没有正式归档 ID | 本 Step 固定 `EV-ID-*` 证据族 |
| Step 9 | 固定 artifact/report root,但 evidence index 尚未定义 | 本 Step 固定 evidence index 字段和生成脚本 |
| Step 10 | 专项证据仍为候选 | 本 Step 纳入 redaction、dependency、observability、performance sample 证据族 |
| Step 11 | 缺陷关闭证据未绑定路径 | 本 Step 绑定 failed/fixed run artifact 和 review report |
| Step 12 | 退出要求 evidence candidate,但未定义正式归档结构 | 本 Step 固定目录、报告、审查和真实性审计 |
| report audit | Step 9 明确不新增 report-only TC / candidate | 本 Step 只给 report integrity evidence,关联已有 blocking suite case refs |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 证据 ID | `EV-CAND-ID-*` 候选 | `EV-ID-*` 证据族 + run item | 支撑正式 `05` 回填和后续 `06` 引用 |
| 证据来源 | suite/report 方向明确但未收口 | 必须从 raw artifact/report pair 推导 | 防止静态造证据 |
| `reports/acceptance` | 未定义 | 只作为交接初稿和审查补充 | 不提前裁决验收 |
| failed suite | 未明确是否保留 | 必须保留失败 artifact | 支撑缺陷复验和审计 |
| redaction/dependency | 门禁存在 | 进入证据真实性必审项 | 一票否决风险需要可追溯证据 |
| report audit | 只有 suite/check 口径 | 固定为 `EV-ID-REPORT-001`,不新增 report-only TC | 保持 Step 9 边界 |

## 7. 证据归档设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否为每个 TC 固定一个 EV | A. 每个 TC 一个 EV;B. 按证据族 + case result 绑定 TC | 采用 B。TC 数量多,run item 可精确绑定单个 TC |
| evidence index 是否可手写 | A. 可手写;B. 必须从 artifact/report 推导 | 采用 B。防止伪证据 |
| acceptance report 是否自动 pass | A. 自动 pass;B. 只生成初稿,需审查补充 | 采用 B。验收裁决属于新版 `06` |
| failed artifact 是否归档 | A. 只归档 passed;B. failed 也归档 | 采用 B。失败证据是缺陷闭环输入 |
| performance 是否生成 pass EV | A. 生成 pass EV;B. 只生成 sample/trend EV | 采用 B。当前无硬阈值 |
| report audit 是否新增 TC | A. 新增 report-only TC;B. 不新增,只绑定已有 TC | 采用 B。Step 9 已明确无 report-only TC |

## 8. 结构化中间产物

### 8.1 正式证据 ID 规则

`EV-ID-*` 是正式证据族 ID。每次执行产生的具体证据实例必须由 `run_id + evidence_id + suite_refs + artifact_digest` 唯一定位。

| 证据族 | 对应候选 | 含义 |
|---|---|---|
| `EV-ID-CORE-*` | Step 5 `EV-ID-CORE-*` / Step 6 representative candidates | 核心业务闭环和 release smoke |
| `EV-ID-CONTRACT-*` | `EV-CAND-ID-CONTRACT-*` | DTO、metadata、schema version、body-free schema |
| `EV-ID-STATE-*` | `EV-CAND-ID-STATE-*` | domain invariant、policy、state guards |
| `EV-ID-CMD-*` | `EV-CAND-ID-CMD-*` | command accepted/rejected/duplicate/UoW |
| `EV-ID-QUERY-*` | `EV-CAND-ID-QUERY-*` | query hit/missing/not-visible/degraded/no-write |
| `EV-ID-CONSUMER-*` | `EV-CAND-ID-CONSUMER-*` | inbound consumer/callback accepted/duplicate/unsupported/delayed |
| `EV-ID-OUTBOX-*` | `EV-CAND-ID-OUTBOX-*` | stored payload snapshot、publish marker、topic/target binding |
| `EV-ID-JOB-*` | `EV-CAND-ID-JOB-*` | operations job report、partial failure、no truth repair |
| `EV-ID-IDEMP-*` | `EV-CAND-ID-IDEMP-*` | idempotency、stored result/report replay、race guard |
| `EV-ID-CONFIG-*` | `EV-CAND-ID-CONFIG-*` | profile、strict config、topic completeness、runtime builder |
| `EV-ID-REDACTION-*` | `EV-CAND-ID-REDACTION-*` | logs/metrics/audit/report/artifact forbidden body scan |
| `EV-ID-ARCH-*` | `EV-CAND-ID-ARCH-*` | compile-time dependency boundary |
| `EV-ID-NFR-*` | Step 5 `EV-ID-NFR-*` / Step 10 sample candidates | performance sample、availability/degraded、observability sample |
| `EV-ID-REPORT-*` | Existing `EV-CAND-ID-*` only | artifact/report pairing、no static evidence、gate summary integrity |

### 8.2 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 后续验收引用 |
|---|---|---|---|---|---|
| `EV-ID-CORE-001` | release scenario report | `release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/`;`reports/runs/<run_id>/suites/release-main-smoke.md` | representative `TC-ID-CMD-*`;`TC-ID-QUERY-*`;`TC-ID-OUTBOX-*`;`TC-ID-JOB-*`;`TC-ID-CONFIG-*`;`TC-ID-REDACTION-*` | `AC-ID-001~005`;`VETO-ID-001~006` |
| `EV-ID-CONTRACT-001` | protocol report | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `TC-ID-CONTRACT-001~004` | `AC-ID-006~015`;`VETO-ID-003` |
| `EV-ID-STATE-001` | domain/state report | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `TC-ID-DOMAIN-001~006`;`TC-ID-STATE-001~002` | `AC-ID-001~014`;`VETO-ID-001/004` |
| `EV-ID-CMD-001` | service command report | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `TC-ID-CMD-001~015` | `AC-ID-001~015`;`VETO-ID-001~004` |
| `EV-ID-QUERY-001` | query no-write report | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `TC-ID-QUERY-001~015` | `AC-ID-001~015`;`VETO-ID-002` |
| `EV-ID-CONSUMER-001` | worker consumer/callback report | `entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `TC-ID-CONSUMER-001~006` | `AC-ID-006~015`;`VETO-ID-002/003` |
| `EV-ID-OUTBOX-001` | outbox publish report | `operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `TC-ID-OUTBOX-001~010` | `AC-ID-001~015`;`VETO-ID-003` |
| `EV-ID-JOB-001` | job replay/report-only report | `operations-replay-core`;`entry-worker-job` | `artifacts/test/<run_id>/suites/<suite>/` | `TC-ID-JOB-001~008` | `AC-ID-001~015`;`VETO-ID-002/005` |
| `EV-ID-IDEMP-001` | consistency/fault report | `infra-runtime-fake`;`operations-replay-core` | `artifacts/test/<run_id>/suites/<suite>/` | `TC-ID-IDEMP-001~011` | `AC-ID-009/014/015`;`VETO-ID-001/002/005` |
| `EV-ID-CONFIG-001` | config redline report | `config-redline` | `artifacts/test/<run_id>/suites/config-redline/`;`reports/runs/<run_id>/suites/config-redline.md` | `TC-ID-CONFIG-001~004` | `AC-ID-015`;`VETO-ID-006` |
| `EV-ID-REDACTION-001` | redaction scan report | `redaction-boundary`;`check_redaction.sh` | `artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` | `TC-ID-CONTRACT-004`;`TC-ID-CMD-010`;`TC-ID-REDACTION-001~003` | `AC-ID-011~015`;`VETO-ID-003` |
| `EV-ID-ARCH-001` | dependency graph report | `dependency-boundary`;`check_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/dependency-boundary/`;`reports/runs/<run_id>/dependency-boundary.md` | `TC-ID-ARCH-001` | `AC-ID-011~015`;`VETO-ID-006` |
| `EV-ID-NFR-001` | performance/degraded/observability sample | `release-main-smoke`;`operations-replay-core`;`redaction-boundary` | `artifacts/test/<run_id>/suites/<suite>/` | related `TC-ID-QUERY-*`;`TC-ID-JOB-*`;`TC-ID-REDACTION-*`;`TC-ID-CONFIG-*` | `AC-ID-015` |
| `EV-ID-REPORT-001` | report integrity audit | `report-generation-audit`;pairing/static checks | `artifacts/test/<run_id>/suites/report-generation-audit/`;`reports/runs/<run_id>/report-audit.md` | existing blocking suite case refs only;no report-only TC | supports all `AC-ID-*` / `VETO-ID-*` evidence integrity |

### 8.3 测试切口到证据 / 验收映射表

| 测试切口 | 用例 ID | Suite / check | 证据 ID | artifact root | report path | 后续 AC / VETO |
|---|---|---|---|---|---|---|
| identity core closure | representative `TC-ID-CMD/QUERY/OUTBOX/JOB/CONFIG/REDACTION-*` | `release-main-smoke` | `EV-ID-CORE-001` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | `AC-ID-001~005`;`VETO-ID-001~006` |
| contracts/domain/state | `TC-ID-CONTRACT-*`;`TC-ID-DOMAIN-*`;`TC-ID-STATE-*` | `contract-domain-fast` | `EV-ID-CONTRACT-001`;`EV-ID-STATE-001` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-ID-001~015` |
| command/query service | `TC-ID-CMD-*`;`TC-ID-QUERY-*` | `service-flow-fast` | `EV-ID-CMD-001`;`EV-ID-QUERY-001` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `AC-ID-001~015`;`VETO-ID-001~004` |
| consumer/callback/job entry | `TC-ID-CONSUMER-*`;`TC-ID-JOB-*` | `entry-worker-job` | `EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-ID-006~015`;`VETO-ID-002/003/005` |
| outbox/operations replay | `TC-ID-OUTBOX-*`;`TC-ID-JOB-*`;`TC-ID-IDEMP-*` | `operations-replay-core` | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `AC-ID-009/014/015`;`VETO-ID-005` |
| config gates | `TC-ID-CONFIG-*` | `config-redline` | `EV-ID-CONFIG-001` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | `AC-ID-015`;`VETO-ID-006` |
| redaction and body boundary | `TC-ID-REDACTION-*`;`TC-ID-CONTRACT-004`;`TC-ID-CMD-010` | `redaction-boundary`;`check_redaction.sh` | `EV-ID-REDACTION-001` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | `AC-ID-011~015`;`VETO-ID-003` |
| dependency boundary | `TC-ID-ARCH-001` | `dependency-boundary`;`check_dependency_boundary.sh` | `EV-ID-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | `AC-ID-011~015`;`VETO-ID-006` |
| report integrity | existing blocking suite case refs | `report-generation-audit`;pairing/static checks | `EV-ID-REPORT-001` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | evidence integrity for all `AC-ID-*` / `VETO-ID-*` |
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
- `meta/source-commits.json` 必须记录 design source ref、implementation source ref、core contracts source ref 或等价 source refs。
- `evidence-index.json` 只能由 suite raw artifact 和 generated reports 推导。
- `stdout.log`、`stderr.log` 必须经过 redaction scan;失败日志也不得回显 secret/body。
- `cases/<case_id>.json` 必须回指 `TC-ID-*`、status、assertions、safe failure reason、evidence candidate / formal evidence family 和 artifact digest。

### 8.5 Raw artifact 字段规则

Raw artifact 是测试证据 schema,不是产品 DTO。实现仓的 writer 可以使用任意语言实现,但字段和值必须稳定。

Shared status:

| 字段域 | 允许值 |
|---|---|
| `status` | `passed`,`failed`,`partial`,`skipped`,`unavailable` |
| `assertion_status` | `passed`,`failed`,`skipped`,`not_run` |
| `redaction_status` | `clean`,`failed`,`not_applicable` |
| `review_status` | `pending`,`reviewed`,`disputed` |
| `artifact_digest_algorithm` | `sha256` |

Digest rule:

- `artifact_digest` 格式为 `sha256:<64 lowercase hex chars>`。
- Digest input 是同一 JSON object 去掉 `artifact_digest` 字段后的 canonical UTF-8 JSON。
- Canonical JSON 使用字典序 object keys、数组保持原顺序、无无意义空白。
- stdout/stderr 不嵌入 JSON digest,但其 digest 可由 suite report 引用。

`meta/context.json` 必填字段:

| Field | Type / values | Notes |
|---|---|---|
| `schema_version` | `identity.artifact.v1` | fixed P0 schema marker |
| `run_id` | string | must not be `latest` |
| `suite_refs` | array of suite strings | sorted by writer |
| `config_profile` | string | selected profile |
| `started_at` | timestamp string | entry start time |
| `tool_version` | string | jobs/gate writer version or source ref |
| `redacted_environment` | object | safe keys / redacted values only |
| `artifact_root` | string | run-scoped output root |
| `report_root` | string | run-scoped report root |
| `artifact_digest_algorithm` | `sha256` | shared digest rule |
| `artifact_digest` | string | digest of this object excluding this field |

`suites/<suite>/report.json` 必填字段:

| Field | Type / values | Notes |
|---|---|---|
| `schema_version` | `identity.artifact.v1` | fixed |
| `run_id` | string | same run id |
| `suite` | string | suite id |
| `status` | shared status | aggregate suite status |
| `case_refs` | array of case ids | all executed/planned case files in this suite |
| `case_digests` | object map | case id -> digest |
| `failure_reason_ref` | optional string | safe reason ref only |
| `duration_ms` | non-negative integer | suite duration |
| `config_profile` | string | selected profile |
| `started_at` | timestamp string | suite start |
| `finished_at` | timestamp string | suite finish |
| `stdout_digest` | optional string | digest of redacted stdout.log |
| `stderr_digest` | optional string | digest of redacted stderr.log |
| `artifact_digest_algorithm` | `sha256` | shared digest rule |
| `artifact_digest` | string | digest of this object excluding this field |

`suites/<suite>/cases/<case_id>.json` 必填字段:

| Field | Type / values | Notes |
|---|---|---|
| `schema_version` | `identity.artifact.v1` | fixed |
| `run_id` | string | same run id |
| `suite` | string | suite id |
| `case_id` | string | stable case artifact id |
| `tc_refs` | array of `TC-ID-*` | at least one for P0 cases |
| `status` | shared status | case status |
| `assertions` | array | each item has id,status,safe message/ref |
| `failure_reason_ref` | optional string | no raw body/secret |
| `evidence_candidate_refs` | array of `EV-CAND-ID-*` | from Step 6/9 |
| `evidence_refs` | array of `EV-ID-*` | formal evidence family |
| `duration_ms` | non-negative integer | case duration |
| `artifact_digest_algorithm` | `sha256` | shared digest rule |
| `artifact_digest` | string | digest of this object excluding this field |

`evidence-index.json` item 必填字段:

| Field | Type / values | Notes |
|---|---|---|
| `evidence_id` | `EV-ID-*` | formal evidence family |
| `run_id` | string | same run id |
| `suite_refs` | array | source suites/checks |
| `tc_refs` | array of existing `TC-ID-*` | report integrity uses existing blocking suite case refs |
| `ac_refs` | array of `AC-ID-*` | may be empty only for P1 residual |
| `veto_refs` | array of `VETO-ID-*` | required when evidence supports VETO |
| `artifact_paths` | array | run-scoped artifact paths |
| `artifact_digests` | array | digest refs |
| `report_paths` | array | run-scoped report paths |
| `status` | shared status | evidence status |
| `redaction_status` | shared redaction status | clean/failed/not_applicable |
| `review_status` | shared review status | pending/reviewed/disputed |
| `safe_summary` | string | human-safe summary only |

### 8.6 Reports 目录结构

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-summary.md
    redaction-check.md
    dependency-boundary.md
    report-audit.md
    suites/<suite>.md
    evidence/EV-ID-<TYPE>-<NNN>.md
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

- `reports/runs/<run_id>/*` 必须从 `artifacts/test/<run_id>` 推导。
- `reports/acceptance/*` 可以由脚本生成初稿,但必须保留审查补充区。
- `reports/review/*` 记录人 / Agent 审查意见,不替代 raw artifact。
- 任一 report 不得包含 raw secret、token、credential value、private key、完整外部业务正文或 full sensitive ref。

### 8.7 报告生成脚本映射

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| suite reports | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释是否准确且脱敏 |
| gate summary | suite reports and suite raw reports | `scripts/reports/build_gate_summary.sh` | `reports/runs/<run_id>/gate-summary.md` | 检查 failed suite 未被覆盖成 passed |
| evidence index | `artifacts/test/<run_id>/evidence-index.json`;suite reports | `scripts/reports/generate_evidence_index.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV / TC / AC / VETO 可追溯 |
| evidence candidates | suite artifacts and reports | `scripts/reports/build_evidence_candidates.sh` | `reports/runs/<run_id>/evidence-candidates.md` | 仅作 Step 6 候选到正式 EV 的对照 |
| acceptance handoff | `reports/runs/<run_id>/*` | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/handoff.md` | 补充交付说明、版本和 residual 风险 |
| veto checklist | evidence index and release checks | `scripts/reports/generate_veto_checklist.sh` | `reports/acceptance/veto-checklist.md` | 人 / Agent 确认不得静态宣告 pass |
| risk acceptance | defects and residual inputs | `scripts/reports/generate_risk_acceptance.sh` | `reports/acceptance/risk-acceptance.md` | 确认接受人、影响和触发条件 |
| open issues | defect/retest inputs | `scripts/reports/generate_open_issues.sh` | `reports/acceptance/open-issues.md` | 确认 S/A/B/R 状态 |
| review notes | generated reports | manual / Agent review | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | 记录审查发现,不得改写 raw evidence |

### 8.8 人 / Agent 审查补充要求

| 审查对象 | 必查项 | 不允许 |
|---|---|---|
| `handoff.md` | run id、source refs、blocking suite、residual、交付说明 | 直接写验收通过 |
| `veto-checklist.md` | `VETO-ID-001~006` 均有 evidence item 和 raw artifact | 静态声明 VETO passed |
| `risk-acceptance.md` | B/R 或 P1/P2 residual 有接受人、影响范围、触发条件 | 用 residual 降级 S 级或 P0 redline |
| `open-issues.md` | S/A/B/R 状态、复验 run、缺陷关闭证据 | 删除 failed artifact 或隐藏 failure reason |
| `agent-review.md` | orphan EV、orphan TC、report pairing、redaction、dependency、static evidence | 用 Agent 总结替代 artifact |

### 8.9 失败 suite 证据规则

| 场景 | 必须保留 | 处理 |
|---|---|---|
| suite failed | `report.json`、stdout/stderr、failure reason、已执行 case JSON | report 标记 failed,不得删除 |
| suite timeout | partial `report.json` 或 timeout artifact、stdout/stderr | status=`failed` 或 `partial`,不得 pass |
| redaction failed | safe failure ref、scan summary、泄漏位置的脱敏标记 | 不得输出 raw secret/body |
| dependency failed | dependency graph digest、安全摘要、违规 dependency ref | 不得隐藏 sibling dependency |
| report generation failed | generation failure report、输入 artifact digest | 阻断退出,不得手写补 pass |
| P1 selected-run unavailable | unavailable marker、safe reason、residual entry | 不计 P0 pass |

### 8.10 证据归档停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 正式证据族是否覆盖所有 P0 suite | 通过 | §8.2 / §8.3 |
| 每个 evidence 是否有 artifact/report 来源 | 通过 | §8.2 / §8.5 |
| 是否避免静态 evidence pass | 通过 | report audit and no-static check |
| 是否避免新增 report-only TC | 通过 | `EV-ID-REPORT-001` 绑定已有 TC |
| failed suite 是否保留证据 | 通过 | §8.9 |
| acceptance report 是否未提前裁决 | 通过 | 只生成初稿 + 审查补充 |
| 正式 `05` 是否未提前改写 | 通过 | 本 Step 只写 `design-calibration` |

### 8.11 跨证据真实性 / 追溯审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| orphan EV | 通过 | 每个 `EV-ID-*` 均绑定 suite/report |
| orphan TC | 通过 | P0 `TC-ID-*` 均由 Step 9 suite 覆盖 |
| orphan AC / VETO | 通过 | `AC-ID-*` / `VETO-ID-*` 均有 evidence family |
| raw artifact 缺失 | 通过 | `check_artifact_report_pairing.sh` 阻断 |
| report 静态造证据 | 通过 | `check_no_static_evidence.sh` 阻断 |
| raw secret/body 泄漏 | 通过 | `check_redaction.sh` 阻断 |
| dependency boundary 断裂 | 通过 | `check_dependency_boundary.sh` 阻断 |
| `latest` 路径 | 通过 | 所有路径绑定 `<run_id>` |
| P1/P2 伪装 P0 | 通过 | selected-run 只进入 residual |

## 9. 对上游设计的影响判定

| 证据结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 正式 evidence ID 使用 `EV-ID-*` | 否 | 测试方案编号收敛 | 承接 Step 6 candidate |
| `EV-ID-REPORT-001` 不新增 TC | 否 | Step 9 边界延续 | 绑定已有 blocking suite case refs |
| Raw artifact 字段规则仅用于测试证据 | 否 | 测试归档 schema | 不改变产品 DTO / port |
| Acceptance reports 不自动裁决 | 否 | SOP 分工 | 新版 `06` 裁决 |
| 若实现仓无法生成 required artifact | 是 | 测试工具 / 实施计划缺口 | 回写实施计划或记录 blocker |
| 若验收方要求额外 EV 字段 | 是 | 验收证据 schema 变更 | 回写 Step 13 / 新版 `06` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_13_evidence.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“证据归档表”“测试切口到证据 / 验收映射表”“Artifact 目录结构”“Reports 目录结构”“报告生成脚本映射”和“跨证据真实性 / 追溯审计表”小节,了解测试证据如何从 raw artifact 追溯到用例和验收。

正式 `05-测试方案.md` §13 应回填:

- 原始机器证据统一进入 `artifacts/test/<run_id>`,人类可读报告统一进入 `reports/runs/<run_id>`,送验交接初稿进入 `reports/acceptance`,审查补充进入 `reports/review`。
- 正式证据族使用 `EV-ID-*`,并从 `EV-CAND-ID-*` 候选证据收敛而来。
- 每个 `EV-ID-*` 必须回指 `TC-ID-*`、suite、artifact path、report path、`AC-ID-*` 和必要的 `VETO-ID-*`。
- `EV-ID-REPORT-001` 只审计 artifact/report pairing、no static evidence 和 gate summary integrity,不得新增 report-only TC。
- 失败 suite 必须保留 raw artifact、stdout/stderr、failure reason 和已执行 case result。
- `reports/acceptance/*` 只作为脚本生成初稿和人 / Agent 审查补充,不得提前裁决验收通过。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 证据保留具体天数 | 影响归档和存储成本 | 当前只规定保留到验收和缺陷复验关闭后 |
| artifact writer 的实现语言 / crate | 影响实施计划 | 当前只规定字段和值,不规定实现方式 |
| review 报告是否需要签名字段 | 影响新版 `06` 裁决 | 当前只保留审查补充区,签名由 `06` 或项目流程固定 |
| `EV-ID-NFR-*` 是否未来增加硬阈值 | 影响 Step 14 / `06` | 当前只记录 sample/trend,硬阈值需回写 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 证据 ID 规则闭合 | 通过 | `EV-ID-*` 正式证据族已定义 |
| artifact/report 目录闭合 | 通过 | 固定 `artifacts/test/<run_id>` and `reports/runs/<run_id>` |
| raw artifact 字段规则闭合 | 通过 | 见 §8.5 |
| acceptance 初稿与验收裁决边界清楚 | 通过 | `reports/acceptance` 不自动 pass |
| report audit 不新增 TC | 通过 | 绑定已有 blocking suite case refs |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 14 | 待用户确认 | 用户审核通过后进入 Step 14: 回归策略与残余风险 |
