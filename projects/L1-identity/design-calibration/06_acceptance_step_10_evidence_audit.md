# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义可观测性、审计与证据门禁 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~9 已审核通过;新版 `03` observability / audit、`05` evidence archive / report schema |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_10_evidence_audit.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

定义 L1-identity 验收必须具备哪些可观测性、审计和证据材料,以及缺失、伪造、静态声明、脱敏失败或 report pairing 断裂时如何裁决。

本 Step 只定义:

- accepted / rejected / degraded / duplicate / job / handoff / config / fake 路径的 trace、audit、log、metric、report 证据门禁。
- `EV-ID-*` 到 `TC-ID-*`、suite artifact、report path、验收项 / VETO 的追溯闭环。
- `reports/runs/<run_id>`、`artifacts/test/<run_id>`、`reports/acceptance` 和 `reports/review` 的必备路径。
- redaction、dependency boundary、report audit、no static evidence、acceptance handoff、veto checklist、risk acceptance 的检查口径。

本 Step 不裁决具体 VETO 是否触发,不处理缺陷分级 / 复验,不接受风险,不新增 evidence ID、TC、artifact schema、产品 DTO、观测后端或运维告警阈值。这些分别留 Step 11~13 或上游设计。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | 提供 P0 功能验收项与核心 EV 关系 |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供 body-free、redaction、dependency、query no-write、job no-repair 证据要求 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已审核通过 | 提供 stored replay、fake parity、state / transaction evidence 要求 |
| `06_acceptance_step_09_nonfunctional.md` | 已审核通过 | 提供 NFR、redaction、config、safe diagnostic、dependency evidence 要求 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 log、metric、business trace / audit / report / marker、runtime/config/fake redaction 规则 |
| `05_test_plan_step_13_evidence.md` | 已审核通过 | 提供正式 `EV-ID-*`、artifact/report 结构、report 生成脚本、review 文件和 evidence authenticity 审计 |
| `05-测试方案.md` §9 / §13 | 正式输入 | 提供 P0 blocking suite、report paths、release checks、evidence index 和 acceptance artifacts |
| 验收 SOP Step 10 | 当前流程标准 | 提供本 Step 必答问题和证据门禁表结构 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些行为必须有 audit record? | accepted identity truth change 必须有 `IdentityTraceRecord` / `AuditTrail` / outbox / stored result 等正式 business audit 载体;consumer/callback accepted branch 必须有 receipt / marker / reference or projection material;job 只能对 projection/reference/report/outbox/handoff/job report 写 report/audit,不得修 truth;query 不写 business audit。 |
| 哪些行为必须有 trace / log / metric? | entry validation、command accepted/rejected、query visible/not-visible/degraded、duplicate replay、consumer accepted/delayed/quarantined、publisher/handoff outcome、projection/reference/reconciliation job、config/runtime/adapter/fake failure 都必须有 safe structured log / metric 或 safe issue refs;指标 label 只能低基数。 |
| 哪些测试报告必须归档? | 所有 P0 blocking suite report、`gate-summary.md`、`evidence-index.md`、`redaction-check.md`、`dependency-boundary.md`、`report-audit.md`、suite artifacts、acceptance handoff、veto checklist、risk acceptance、open issues 和 review notes 均按固定路径归档。 |
| 证据缺失是否导致不通过? | P0 EV 缺 raw artifact、suite report、evidence-index item、report path 或 redaction/dependency/report audit 失败时,验收不得通过。若只是 P1 selected-run 不可用,进入 Step 13 residual,不计 P0 pass。 |
| 证据如何被复查? | 复查从 `reports/runs/<run_id>/evidence-index.md` 进入,回到 `artifacts/test/<run_id>/suites/...` 的 raw artifact / case JSON / digest,再对照 suite report、gate summary、redaction/dependency/report audit 和 acceptance review 文件。 |
| `reports/runs/<run_id>/evidence-index.md` 是否覆盖全部 P0 EV? | 必须覆盖 `EV-ID-CORE-001`、`EV-ID-CONTRACT-001`、`EV-ID-STATE-001`、`EV-ID-CMD-001`、`EV-ID-QUERY-001`、`EV-ID-CONSUMER-001`、`EV-ID-OUTBOX-001`、`EV-ID-JOB-001`、`EV-ID-IDEMP-001`、`EV-ID-CONFIG-001`、`EV-ID-REDACTION-001`、`EV-ID-ARCH-001`、`EV-ID-NFR-001`、`EV-ID-REPORT-001`。 |
| `reports/runs/<run_id>/gate-results.md` 是否覆盖全部 release gate? | identity 正式 `05` 使用 `reports/runs/<run_id>/gate-summary.md`,不是 SOP 通用名 `gate-results.md`。验收按 `gate-summary.md` 裁决,且必须覆盖所有 P0 blocking suite / checks。 |
| `reports/runs/<run_id>/redaction-check.md` 是否证明 artifact 和 report 不含 raw secret / raw body? | 必须证明 artifact、suite report、generated report、acceptance draft 和 review material 无 forbidden body、credential、raw secret、token、full sensitive ref;失败直接阻断并交 Step 11。 |
| `reports/acceptance/handoff.md` 是否已由人 / Agent 审查补充? | 必须有 run id、source refs、blocking suite、residual、交付说明和审查补充区;缺失时不得宣称送验交接完整。 |
| `reports/acceptance/veto-checklist.md` 是否覆盖所有一票否决项? | 必须覆盖 `VETO-ID-001~006`,并回指 evidence item / raw artifact / report;本 Step 只验覆盖,是否触发由 Step 11 裁决。 |
| `reports/acceptance/risk-acceptance.md` 是否支撑有条件通过? | 有条件通过必须有该文件,并列明 residual、接受人、影响范围、触发条件和截止动作;不得覆盖 P0 redline / VETO。 |
| 每个 P0 EV 是否能回指测试用例、suite artifact、report path 和验收项? | 本 Step 在 §8.2 固定 EV 闭环表,缺任一环均阻断。 |
| 所有证据门禁完成后是否存在静态造证据映射、orphan EV、report 缺失或 acceptance 初稿未经审查? | 本 Step 要求 `EV-ID-REPORT-001`、`report-audit.md`、no static evidence check 和 review notes 共同裁决;发现则不通过。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| SOP Step 10 | 通用路径写 `gate-results.md` | identity 正式 `05` 使用 `gate-summary.md`;本 Step 明确按项目路径裁决 |
| `03` Step 15 | log / metric / audit / report 字段很多 | 本 Step 不复刻字段全集,只抽验收必须存在和禁止替代 |
| `05` Step 13 | 证据归档是测试方案视角 | 本 Step 转成验收裁决:缺失、失败、静态证据和 redaction fail 如何影响通过 |
| Step 9 | 已绑定 NFR EV,但未审计 evidence index 完整性 | 本 Step 专门审计 `EV-ID-*` 到 report / artifact / AC / VETO |
| `reports/acceptance/*` | 可由脚本生成初稿,但不能自动裁决 | 本 Step 要求人 / Agent review 补充,正式结论留 Step 14 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 证据引用 | 只说引用 `EV-ID-*` | 固定 EV、TC、artifact、report、AC/VETO 和缺失影响 | 可复查 |
| gate report | SOP 通用 `gate-results.md` | identity 使用 `gate-summary.md` | 与正式 `05` 一致 |
| observability | 可能把日志当审计 | 明确 logs/metrics 不替代 business audit,query no-write | 防止伪证据 |
| redaction | 只扫最终报告可能漏 raw artifact | artifact + report + acceptance/review material 都必须 clean | 防止证据层泄漏 |
| acceptance handoff | 容易被当最终结论 | 只作送验交接和审查补充,不得自动 pass | Step 14 再签署 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把 `reports/acceptance/handoff.md` 作为通过结论 | A. 是;B. 只作为送验交接材料 | 采用 B。最终结论留 Step 14。 |
| 是否允许人工补写缺失 EV | A. 可补写;B. 不可补写,必须从 raw artifact/report 生成 | 采用 B。防止静态造证据。 |
| 是否要求真实 observability backend report | A. 要求;B. 要求 safe log/metric/audit/report evidence,不绑定后端产品 | 采用 B。符合 Step 9 P0 边界。 |
| 是否把 VETO 是否触发放在本 Step | A. 是;B. 本 Step 只验 veto checklist 覆盖,触发裁决留 Step 11 | 采用 B。符合章节分工。 |
| 是否允许 evidence index 使用 `latest` | A. 可用;B. 不可用,必须固定 `<run_id>` | 采用 B。验收基线必须可复现。 |

## 8. 结构化中间产物

### 8.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| `AC-EV-001` | accepted business audit | accepted command / consumer / callback / job-owned mutation 有正式 trace/audit/outbox/stored result/receipt/report refs | accepted surface 能回指 safe actor/reason/source/operation refs;日志不替代业务 audit | accepted 无 trace/audit/stored surface;rejected/degraded 伪造 accepted trace |
| `AC-EV-002` | query / degraded no-write observability | query log/metric、query report、write-audit evidence、safe issue refs | query visible/not-visible/degraded/missing/stale 均可定位且无写 side effect | query 写 trace/audit/idempotency/stored result/projection repair |
| `AC-EV-003` | duplicate replay evidence | stored command result、typed receipt、job report、duplicate log/metric、idempotency evidence | duplicate same digest 只 replay stored surface;report 指向原 stored refs | duplicate 重跑 mutation/job 或从 current truth 重构结果 |
| `AC-EV-004` | job / handoff / outbox report evidence | operations job report、outbox/handoff attempt/receipt/issue refs、item refs、failed refs | job report 可 replay;Delivered 有 receipt;retry/failure 只改正式 marker/report | no receipt marked delivered;terminal retry;job repair truth;report 缺 item refs |
| `AC-EV-005` | P0 EV index completeness | `reports/runs/<run_id>/evidence-index.md` and raw `evidence-index.json` | 全部 P0 `EV-ID-*` 回指 TC、suite artifact、report path、AC/VETO、status、digest | orphan EV/TC/AC/VETO;EV 缺 artifact/report/digest/status |
| `AC-EV-006` | gate summary completeness | `reports/runs/<run_id>/gate-summary.md`;all P0 suite reports | P0 blocking suite/check 均有结果,failed/partial 不被覆盖成 passed | gate summary 缺 suite、隐藏失败、使用 `latest` 或未固定 run |
| `AC-EV-007` | redaction / forbidden material scan | `reports/runs/<run_id>/redaction-check.md`;redaction artifacts | artifact、report、acceptance、review 材料均 clean | raw body、credential、raw secret、token、full sensitive ref 泄漏 |
| `AC-EV-008` | dependency boundary evidence | `reports/runs/<run_id>/dependency-boundary.md`;dependency graph digest | 无 non-core sibling business compile dependency;违规 ref 可定位 | dependency report 缺失或发现 dependency loop |
| `AC-EV-009` | report generation audit | `reports/runs/<run_id>/report-audit.md`;`EV-ID-REPORT-001` | raw artifact / report pairing 完整,no static evidence check 通过 | 手写 pass、静态 EV/VETO pass、blocking suite 缺 raw artifact |
| `AC-EV-010` | acceptance handoff and review | `reports/acceptance/handoff.md`;`reports/review/agent-review.md`;`reports/review/reviewer-notes.md` | handoff 有 run/source/suite/residual/review 补充;review 不替代 artifact | 缺 handoff 或未审查补充却宣称送验完整 |
| `AC-EV-011` | veto checklist coverage | `reports/acceptance/veto-checklist.md` | 覆盖 `VETO-ID-001~006`,每项回指 evidence / artifact / report | 任一 VETO 缺覆盖;静态声明 pass;触发项未进入 Step 11 |
| `AC-EV-012` | risk acceptance support | `reports/acceptance/risk-acceptance.md`;`reports/acceptance/open-issues.md` | 有条件通过时 residual 有接受人、影响、动作、截止;不覆盖 VETO | 缺风险接受却有条件通过;用 residual 降级 P0/VETO |

### 8.2 P0 EV 闭环表

| Evidence ID | 测试用例 | suite artifact | report path | 验收项 / VETO | 缺失影响 |
|---|---|---|---|---|---|
| `EV-ID-CORE-001` | representative `TC-ID-CMD-*`;`TC-ID-QUERY-*`;`TC-ID-OUTBOX-*`;`TC-ID-JOB-*`;`TC-ID-CONFIG-*`;`TC-ID-REDACTION-*` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | `AC-FUNC-*`;`AC-NFR-*`;`VETO-ID-001~006` | release core closure 不成立 |
| `EV-ID-CONTRACT-001` | `TC-ID-CONTRACT-001~004` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-BND-*`;`AC-SYNC-*`;`AC-NFR-003/004` | public contract / body-free 证据不足 |
| `EV-ID-STATE-001` | `TC-ID-DOMAIN-001~006`;`TC-ID-STATE-001~002` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-STATE-*`;`AC-NFR-007`;`VETO-ID-001/004` | 状态和 append-only 裁决不足 |
| `EV-ID-CMD-001` | `TC-ID-CMD-001~015` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `AC-FUNC-*`;`AC-TX-001`;`AC-NFR-003/005/007` | command accepted/rejected 证据不足 |
| `EV-ID-QUERY-001` | `TC-ID-QUERY-001~015` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `AC-FUNC-*`;`AC-TX-004`;`AC-NFR-002`;`VETO-ID-002` | query no-write / degraded 裁决不足 |
| `EV-ID-CONSUMER-001` | `TC-ID-CONSUMER-001~006` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-SYNC-*`;`AC-TX-002`;`AC-NFR-005`;`VETO-ID-002/003` | consumer/callback receipt 证据不足 |
| `EV-ID-OUTBOX-001` | `TC-ID-OUTBOX-001~010` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `AC-SYNC-*`;`AC-STATE-003`;`VETO-ID-003` | outbox publish / marker 证据不足 |
| `EV-ID-JOB-001` | `TC-ID-JOB-001~008` | `artifacts/test/<run_id>/suites/operations-replay-core/`;`artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-TX-003`;`AC-NFR-005/009`;`VETO-ID-002/005` | job report-only / no truth repair 证据不足 |
| `EV-ID-IDEMP-001` | `TC-ID-IDEMP-001~011` | `artifacts/test/<run_id>/suites/infra-runtime-fake/`;`artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | `AC-IDEM-*`;`AC-CONC-*`;`AC-NFR-006/012`;`VETO-ID-001/002/005` | replay / fault / fake parity 裁决不足 |
| `EV-ID-CONFIG-001` | `TC-ID-CONFIG-001~004` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | `AC-NFR-010/012`;`VETO-ID-006` | config fail-fast / no fake success 证据不足 |
| `EV-ID-REDACTION-001` | `TC-ID-CONTRACT-004`;`TC-ID-CMD-010`;`TC-ID-REDACTION-001~003` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | `AC-BND-*`;`AC-NFR-004/008`;`VETO-ID-003` | redaction 失败直接阻断 |
| `EV-ID-ARCH-001` | `TC-ID-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | `AC-BND-*`;`AC-NFR-011`;`VETO-ID-006` | dependency boundary 不可裁决 |
| `EV-ID-NFR-001` | related `TC-ID-QUERY-*`;`TC-ID-JOB-*`;`TC-ID-REDACTION-*`;`TC-ID-CONFIG-*` | `artifacts/test/<run_id>/suites/<suite>/` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-NFR-001/002/008/010` | NFR sample / degraded / observability 不可裁决 |
| `EV-ID-REPORT-001` | existing blocking suite case refs only | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | all `AC-*`;all `VETO-ID-*` evidence integrity | raw artifact/report pairing 或 no-static 证据不足 |

### 8.3 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | run id、source refs、profile、suite summary、status 可复查 | 送验基线不完整 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | 全部 P0 EV 回指 TC、artifact、report、AC/VETO、digest、status | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-summary.md` | 全部 P0 blocking suite/check 结果完整,failed 不被覆盖 | 不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | artifact/report/acceptance/review 无 raw body / raw secret | 不通过并进入 Step 11 |
| 依赖边界 | `reports/runs/<run_id>/dependency-boundary.md` | no non-core sibling business compile dependency | 不通过并进入 Step 11 |
| report audit | `reports/runs/<run_id>/report-audit.md` | artifact/report pairing、no static evidence、gate summary integrity 通过 | 不通过 |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` | 每个 P0 suite 有 report,状态与 raw `report.json` 一致 | 缺失 suite 不可裁决 |
| evidence detail | `reports/runs/<run_id>/evidence/EV-ID-<TYPE>-<NNN>.md` | 若生成,必须和 evidence index / raw artifact digest 一致 | 不一致视为 report audit failure |
| acceptance handoff | `reports/acceptance/handoff.md` | run/source/suite/residual/review 补充完整 | 不得宣称送验交接完整 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VETO-ID-001~006` 全覆盖,有 evidence 回指 | Step 11 不可裁决 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时必须完整;无 residual 可标 none | 缺失时不得有条件通过 |
| open issues | `reports/acceptance/open-issues.md` | S/A/B/R、复验 run、关闭证据可追溯 | Step 12/13 不可裁决 |
| review notes | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | orphan、pairing、redaction、dependency、static evidence 审查有结论 | 缺 review 时 handoff 不完整 |

### 8.4 Acceptance handoff 检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| 送验交接 | `reports/acceptance/handoff.md` | 固定 `<run_id>`、需求/设计/测试 source refs、P0 suite 列表、配置 profile、residual 摘要、审查补充区 | 缺失则不能宣称送验交接完整 |
| 一票否决清单 | `reports/acceptance/veto-checklist.md` | `VETO-ID-001~006` 每项有 evidence / artifact / report 回指 | Step 11 不可进入最终裁决 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 有条件通过场景有接受人、影响、动作、截止;VETO 不得接受 | 缺失则不得有条件通过 |
| 未关闭问题 | `reports/acceptance/open-issues.md` | S/A/B/R 缺陷、复验 run、关闭证据和阻断状态清楚 | Step 12/13 不可裁决 |
| 人 / Agent review | `reports/review/reviewer-notes.md`;`reports/review/agent-review.md` | 审查 orphan EV、orphan TC、report pairing、redaction、dependency、static evidence | 缺 review 时 acceptance 初稿不得视为完成 |

### 8.5 可观测性 / 审计载体边界表

| 载体 | 必须证明 | 禁止替代 / 禁止内容 | 关联门禁 |
|---|---|---|---|
| `IdentityTraceRecord` / `AuditTrail` | accepted truth change 可追溯到 safe actor、reason、source、operation、time | raw request/event body、adapter response、raw log、secret | `AC-EV-001`;`AC-NFR-005` |
| structured log | entry、rejected、degraded、duplicate、failure 可定位 | 替代 business audit;记录 raw body / credential / full sensitive ref | `AC-EV-001~004`;`AC-EV-007` |
| metric | count / duration / status / low-cardinality state 可观察 | ref/id/key/topic raw string/free text label | `AC-EV-002`;`AC-NFR-008` |
| outbox / event record | accepted-only event material body-free,publication state 可追溯 | downstream consumed 语义、raw payload body、topic raw string label | `AC-EV-004` |
| consumer / callback receipt | accepted / duplicate / delayed / quarantined receipt 可 replay | parse original payload on duplicate;raw receipt body | `AC-EV-003`;`AC-EV-004` |
| job report | item refs、failed refs、report refs、duration/count、safe issue refs | job truth repair、raw replay input、private fake map | `AC-EV-004`;`AC-EV-009` |
| redaction report | artifact/report/acceptance/review clean | 只扫最终 report;忽略 raw artifact | `AC-EV-007` |
| evidence index | EV -> TC -> artifact -> report -> AC/VETO 完整 | static pass、orphan EV、`latest` path | `AC-EV-005`;`AC-EV-009` |

### 8.6 证据门禁停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `AC-EV-001` | accepted business audit | 通过 | 具体 VETO 裁决留 Step 11 |
| `AC-EV-002` | query/degraded observability no-write | 通过 | query failure 缺陷分级留 Step 12 |
| `AC-EV-003` | duplicate replay evidence | 通过 | stored missing public wording 留 Step 12 |
| `AC-EV-004` | job/handoff/outbox report evidence | 通过 | terminal/retry defect 分级留 Step 12 |
| `AC-EV-005` | evidence index completeness | 通过 | 实际 run 缺失时不得通过 |
| `AC-EV-006` | gate summary completeness | 通过 | 使用 identity `gate-summary.md` |
| `AC-EV-007` | redaction scan | 通过 | 泄漏交 Step 11 |
| `AC-EV-008` | dependency boundary | 通过 | dependency loop 交 Step 11 |
| `AC-EV-009` | report audit / no static evidence | 通过 | report audit fail 阻断 |
| `AC-EV-010` | acceptance handoff / review | 通过 | handoff 不代表最终通过 |
| `AC-EV-011` | veto checklist coverage | 通过 | 触发与否留 Step 11 |
| `AC-EV-012` | risk acceptance support | 通过 | 具体接受规则留 Step 13 |

### 8.7 跨证据裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 所有 P0 EV 是否有固定 artifact / report | 通过 | 见 §8.2 |
| 所有 P0 EV 是否可回指 TC / AC / VETO | 通过 | 见 §8.2 |
| `gate-results.md` vs `gate-summary.md` 是否漂移 | 已处理 | identity 使用 `gate-summary.md` |
| redaction / dependency / report audit 是否阻断 | 通过 | `AC-EV-007~009` |
| acceptance reports 是否自动裁决 | 否 | Step 14 才给最终结论 |
| 是否允许静态造证据 | 否 | `EV-ID-REPORT-001` / no-static check |
| 是否提前裁决 VETO | 否 | 本 Step 只验 checklist 覆盖 |
| 是否提前接受风险 | 否 | 本 Step 只验 risk-acceptance support |
| 是否使用 `latest` 路径 | 否 | 全部固定 `<run_id>` |
| 是否新增 EV / TC / artifact schema | 否 | 只消费 `05` 已固定结构 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| identity 使用 `gate-summary.md` 而非 SOP 通用 `gate-results.md` | 否 | 项目路径映射 | 本 Step 明确固定 |
| `EV-ID-REPORT-001` 只审计 pairing / no static evidence | 否 | 测试方案已闭合 | 不新增 report-only TC |
| 缺 raw artifact / report pairing 阻断验收 | 否 | 承接 `05` Step 13 | Step 12/14 使用 |
| acceptance handoff 不自动通过 | 否 | 承接验收 SOP | Step 14 签署 |
| 若实际实现无法生成 evidence index / report audit | 是 | 实施或测试工具缺口 | 送 Step 12 缺陷或回实施计划 |
| 若新增 evidence 字段或新 EV | 是 | 测试方案 schema 变更 | 回 `05` Step 13 / 正式 `05` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_10_evidence_audit.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“证据门禁表”“P0 EV 闭环表”“Report 完整性检查表”“Acceptance handoff 检查表”“可观测性 / 审计载体边界表”和“跨证据裁决审计表”小节,了解证据门禁如何从观测审计契约、测试归档和验收 SOP 收敛。

正式 `06-验收标准.md` §10 应回填:

- 可观测性、审计与证据门禁按 `AC-EV-001~012` 组织。
- P0 验收必须能从 `reports/runs/<run_id>/evidence-index.md` 回到 `artifacts/test/<run_id>/...` 的 raw artifact、suite report、TC、AC/VETO 和 digest。
- identity 正式门禁结果文件为 `reports/runs/<run_id>/gate-summary.md`。
- `redaction-check.md`、`dependency-boundary.md`、`report-audit.md` 任一失败均阻断验收。
- `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 review notes 是裁决输入,不自动给出最终通过。
- 静态造证据、orphan EV、orphan TC、缺 raw artifact/report pairing、使用 `latest` 或日志替代业务审计均为不通过条件。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 实际 run 是否已生成全部 P0 artifacts / reports | 影响最终验收结论 | 当前只定义门禁;Step 14 使用真实 run 裁决 |
| review notes 是否需要签名字段 | 影响签署流程 | Step 14 处理 |
| 缺 lower-suite evidence 是否可风险接受 | 影响 Step 13 | P0 suite 缺失不得直接通过;非 P0 selected-run 可 residual |
| VETO checklist 中每项是否触发 | 影响最终结论 | Step 11 裁决 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 证据门禁表完成 | 通过 | 见 §8.1 |
| P0 EV 闭环表完成 | 通过 | 见 §8.2 |
| report 完整性检查表完成 | 通过 | 见 §8.3 |
| acceptance handoff 检查表完成 | 通过 | 见 §8.4 |
| 证据门禁停审记录完成 | 通过 | 见 §8.6 |
| 跨证据裁决审计无 unresolved 冲突 | 通过 | 见 §8.7 |
| 未提前替代 Step 11~14 | 通过 | VETO、缺陷、风险和最终签署留后续 |
| 可进入 Step 11 | 通过 | 用户已确认,进入 Step 11: 定义一票否决项 |
