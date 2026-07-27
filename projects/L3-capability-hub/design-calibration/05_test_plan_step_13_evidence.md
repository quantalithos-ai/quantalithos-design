# L3-capability-hub 05 测试方案 Step 13: 测试报告与证据归档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/测试方案书写规范.md` §§4.4、4.6、5.13
> 上游状态: Steps 1~12 completed
> Step 状态: `accepted-design / not-executed`
> 日期: 2026-07-25

本文只定义 future evidence contract、artifact/report schema、生成和审查顺序、保留与删除门禁。本文中的 `EV-CH-*` 是稳定证据合同 ID，不是真实 evidence alias；所有结果、run、artifact、report、digest、review、验收和签署状态均为 `not_evaluated`。

---

## 1. 本步目标、输入与禁止范围

### 1.1 目标

1. 将 Step 6 的 189 个唯一 `EVC-CH-*` candidate 一对一提升为 189 个稳定 `EV-CH-*` 证据合同 ID。
2. 固定 `TC -> DS -> EV contract -> primary suite -> raw artifact -> report -> AC/VF consumer` 的完整追溯链。
3. 固定 raw artifact、run report、acceptance handoff 和 review material 的目录、最小 schema、生成顺序、redaction、配对、审查、保留和删除合同。
4. 保证失败、阻塞、超时、flaky、无效和取消结果同样留证，且任何静态表、手工 Markdown 或跨 run 拼接都不能制造通过证据。
5. 给 formal 06 提供可裁决的证据消费入口，但不替 formal 06 作出验收结论。

### 1.2 输入

| 输入 | 本步承接 | 状态 |
|---|---|---|
| formal 00 `AC-CH-001..037`、`VF-CH-001..013` | future acceptance consumer 与 veto consumer | active design input; not evaluated |
| formal 03/04 与 DDD Step 16 | typed oracle、zero-effect、state/TX/binding/observation/config authority | active exact source |
| Step 5 | 37 AC、13 VF planned consumer direction | complete |
| Step 6 | 189 `TC/DR/EVC` canonical records | complete |
| Step 7 | 189 `DS` logical data contracts | complete |
| Step 8 | seven future environment contracts和fixed config placement | complete; environments not claimed |
| Step 9 | ten suites、five gates、nine checks、four report builders和fixed roots | complete design contract; scripts not claimed |
| Steps 10~12 | NFR、defect/retest、entry/exit/evidence readiness | complete design contract; execution pending |
| old formal 05/06 | historical direction only | no authority for ID、path、result、threshold or signoff |

### 1.3 禁止范围

- 不生成或声称真实 `run_id`、artifact、report、digest、evidence alias、pass/fail、coverage、defect closure、review 或 acceptance signoff。
- 不把 runtime/tools execution、governance approval、method body/source、marketplace listing、provider route/cost 或 SDK client/cache 当成 Hub 正向证据。
- 不用 acceptance draft、release smoke、缺陷记录、风险接受表或静态 JSON 代替 canonical case raw evidence。
- 不发明未由 active source 给出的 30/90/180 天等保留期限。
- 不引用 `latest`；正式证据始终绑定一个显式且不可变的 `<run_id>`。
- 不修改 formal 05；仅 Step 15 可以装配正式文档。

## 2. SOP 十六问回答

| # | 问题 | 收口答案 |
|---:|---|---|
| 1 | 每类测试输出什么证据？ | 每个 canonical TC 输出 case raw record；每个参数化 identity 输出 parameter raw record；每个 suite/check/gate 输出对应 raw result；报告只从这些同 run raw sources 投影。 |
| 2 | 证据保存在哪里？ | raw 统一在 `artifacts/test/<run_id>`；人类可读 run reports 在 `reports/runs/<run_id>`；送验初稿在 `reports/acceptance`；review notes 在 `reports/review`。 |
| 3 | 如何关联用例和验收项？ | 189 个 `EV-CH-*` 与 `TC-CH-*`、`DS-CH-*`、primary suite 一一绑定；真实 evidence index row 还必须有同 run raw/report refs、digest 和 `AC-CH-*`/`VF-CH-*` consumer refs。 |
| 4 | 哪些日志、trace、DB snapshot 或报告保留？ | 保留 run/gate/suite/case/parameter/check raw records、safe stdout/stderr、必要的 body-free state/version/history/call-order/trace-ref/fixture/config manifests、所有 suite/check/run/gate/evidence/audit reports；禁止完整业务正文和 secret material。 |
| 5 | 证据保留多久？ | 当前没有数字政策。最低事件门禁是：验收裁决完成、关联缺陷/复验/争议关闭，并且正式 delivery retention policy 已激活后，才可评估删除；任一条件未满足都保留。 |
| 6 | raw 是否统一进入 fixed root？ | 是，只允许 `artifacts/test/<run_id>`，不得插入 project 子目录。 |
| 7 | run reports 是否统一进入 fixed root？ | 是，只允许 `reports/runs/<run_id>`。 |
| 8 | acceptance handoff 是否统一进入 fixed root？ | 是，统一进入 `reports/acceptance`，且必须显式绑定所引用 run IDs。 |
| 9 | 哪些报告自动生成？ | Step 9 的 suite reports、run summary、gate summary、evidence candidate/index projection由`scripts/reports/*`合同生成；本 Step 增加 redaction、dependency、pairing/no-static audit及acceptance draft的生成合同，但不声称脚本存在。 |
| 10 | 哪些报告必须人工或 Agent 审查？ | 所有 acceptance drafts、review notes，以及正式交付前的 evidence index、veto checklist、redaction/boundary/report audit都需复核；审查不能替代 raw evidence。 |
| 11 | 失败 suite 是否仍留 report/stdout/stderr/reason？ | 是。失败和所有非 passed 状态必须保留 `suite-result.json`、case/parameter records、safe stdout/stderr、safe failure class/reason；报告生成失败也必须保留 raw 和 missing-path audit。 |
| 12 | redaction/boundary scan 如何证明无泄漏？ | `check_redaction.sh` 扫描 raw、stdout/stderr和全部 reports；`check_responsibility_boundary.sh`验证禁止责任；finding只保存safe class/location/digest，不回显被禁止内容。 |
| 13 | P0 evidence ID 如何回指真实 suite artifact？ | ID合同本身不算证据。只有 evidence index 从同 run passed/non-passed case raw + suite report pair推导，并含digest时，才形成该 run 的 evidence instance。 |
| 14 | 每个 EV 如何回指完整链？ | 强制字段包括run、EV、TC、DS、suite、case raw path/digest、suite report path、AC refs和条件性VF refs；缺任一必填字段即`invalid_artifact`。 |
| 15 | 每类报告是否通过停审？ | 当前只完成设计停审：schema/source/review/redaction合同完整；实际 artifact existence/readability/result/review必须在每个真实 run 独立停审。 |
| 16 | 是否存在 orphan/static/missing/redaction/reference gap？ | 设计静态审计为0；future execution必须重新运行orphan/duplicate/pairing/no-static/redaction/consumer审计，不能继承本设计结论。 |

## 3. 诊断、身份模型与取舍

### 3.1 当前问题诊断

| 问题 | 风险 | 本步处理 |
|---|---|---|
| Step 6 只有 `EVC` candidate | 06 无稳定 evidence contract可引用 | 一对一提升为稳定 `EV` contract，ordinal/family不变 |
| 稳定 ID 容易被误读为已有证据 | 静态造证据 | 明确区分 contract identity 与 run-scoped instance；无raw/report pair即不存在instance |
| Step 9 只有 candidate index | 无法裁决 AC/VF | 扩展正式 evidence index schema和consumer refs，但仍必须从raw生成 |
| check结果混入canonical case分母 | 189计数被膨胀 | 9个check evidence contract独立，不分配额外canonical `EV-CH-*` |
| release smoke/retest/risk acceptance重复分配EV | 同一语义多重证据authority | 作为report/handoff material引用既有EV和run，不创建canonical case evidence |
| retention没有正式天数 | 擅造运营政策 | 采用事件门禁最低保留；数字期限留正式delivery policy选择 |
| acceptance report可手改 | 人工把pending改pass | draft/review与raw authority分离，任何裁决必须保留引用和审查人真实记录 |

### 3.2 三层身份模型

| 层 | 形式 | 何时存在 | 能否表示通过 |
|---|---|---|---|
| candidate | `EVC-CH-<FAMILY>-<NNN>` | Step 6 design record | 否 |
| formal evidence contract | `EV-CH-<FAMILY>-<NNN>` | 本 Step design record | 否 |
| run-scoped evidence instance | evidence-index row keyed by explicit `run_id + evidence_id` | 真实case raw、suite raw/report、digest均存在且schema/pairing通过后 | 只能保留raw-derived status；不能自行改写 |

正式证据合同转换规则：

```text
EVC-CH-<FAMILY>-<NNN> -> EV-CH-<FAMILY>-<NNN>
TC-CH-<FAMILY>-<NNN>  -> EV-CH-<FAMILY>-<NNN>
```

例外仅是 DS flow family命名差异：`TC/EV CMD|QUERY|INBOUND|OUTBOUND|JOB` 对应 `DS-CH-FLOW-C|Q|I|O|J` 的相同 ordinal。禁止重排、合并、拆分或复用 ordinal。

### 3.3 Instance completeness predicate

对一个显式 run 中的 canonical evidence instance `e`：

```text
exists(e) =
  explicit_run_id
  AND canonical_evidence_contract
  AND exact_primary_tc_ds_pair
  AND one_primary_suite_owner
  AND case_raw_record_present
  AND suite_raw_result_present
  AND suite_report_present
  AND raw_and_report_digests_verified
  AND redaction_passed
  AND artifact_report_pairing_passed
  AND no_static_evidence_passed
  AND acceptance_consumers_nonempty
```

`exists(e)`只是证据实例完整，不等于`passed`。状态必须逐字来自case raw record并受suite/gate worst-status约束；缺失、重复、跨run、digest不匹配或手工补写均为`invalid_artifact`。

## 4. 正式证据合同库存与精确计数

### 4.1 Family inventory

| Family | Exact contract range | Count | Primary semantic owner |
|---|---|---:|---|
| FOUNDATION | `EV-CH-FOUNDATION-001..018` | 18 | module/object/protocol/Port/repository/binding foundations |
| CMD | `EV-CH-CMD-001..026` | 26 | exact Command flows |
| QUERY | `EV-CH-QUERY-001..033` | 33 | exact Query flows and no-write |
| INBOUND | `EV-CH-INBOUND-001..006` | 6 | six inbound source flows |
| OUTBOUND | `EV-CH-OUTBOUND-001..010` | 10 | immutable collaboration flows |
| JOB | `EV-CH-JOB-001..008` | 8 | operations job lifecycle flows |
| STATE | `EV-CH-STATE-001..024` | 24 | 24 state families / 638 parameter pairs |
| TX | `EV-CH-TX-001..022` | 22 | transaction/consistency/idempotency cuts |
| BIND | `EV-CH-BIND-001..012` | 12 | config/external binding cuts |
| OBS | `EV-CH-OBS-001..012` | 12 | observability/audit/redaction cuts |
| CONFIG | `EV-CH-CONFIG-001..018` | 18 | configuration failure cuts |
| **Total** | **11 families** | **189** | **one-to-one with 189 TC/DS/EVC** |

Arithmetic:

```text
18 + 26 + 33 + 6 + 10 + 8 + 24 + 22 + 12 + 12 + 18 = 189
```

### 4.2 Suite partition

| Primary suite | Formal evidence contract owner | Count | Canonical report path |
|---|---|---:|---|
| `static-contract-docs` | FOUNDATION `{001,008..011,013..015}` | 8 | `reports/runs/<run_id>/suites/static-contract-docs.md` |
| `domain-state` | FOUNDATION `{002,012}` + STATE `001..024` | 26 | `.../suites/domain-state.md` |
| `service-command-query` | FOUNDATION `003` + CMD `001..026` + QUERY `001..033` | 60 | `.../suites/service-command-query.md` |
| `entry-inbound` | FOUNDATION `005..006` + INBOUND `001..006` | 8 | `.../suites/entry-inbound.md` |
| `outbound-collaboration` | OUTBOUND `001..010` | 10 | `.../suites/outbound-collaboration.md` |
| `jobs-lifecycle` | FOUNDATION `007` + JOB `001..008` | 9 | `.../suites/jobs-lifecycle.md` |
| `repository-transaction` | FOUNDATION `{004,016,018}` + TX `001..022` | 25 | `.../suites/repository-transaction.md` |
| `runtime-binding` | FOUNDATION `017` + BIND `001..012` | 13 | `.../suites/runtime-binding.md` |
| `observability-redaction` | OBS `001..012` | 12 | `.../suites/observability-redaction.md` |
| `configuration-strict` | CONFIG `001..018` | 18 | `.../suites/configuration-strict.md` |
| **Total** | **unique primary owner** | **189** | **missing=0; duplicate=0** |

### 4.3 Check evidence与辅助材料

九个mandatory checks各自产生`check-result.json`和check report。它们证明manifest、state registry、dependency、Rustdoc、config、responsibility、redaction、pairing和no-static-evidence gate，不属于189 canonical case evidence，不获得新的`EV-CH-*`编号。

| Auxiliary material | Evidence role | Canonical EV count effect |
|---|---|---:|
| 9 check raw/report pairs | qualify or invalidate canonical evidence bundle | 0 |
| release smoke report | references selected existing EV instances and scenario assertions | 0 |
| defect/retest bundle | pairs old/new explicit runs and impacted EV set | 0 |
| risk acceptance draft | records eligible residual decision, never supplies P0/VF pass | 0 |
| reviewer/Agent notes | review provenance and disputes | 0 |

## 5. Raw artifact contract

### 5.1 Fixed directory

```text
artifacts/test/<run_id>/
  meta/context.json
  run-manifest.json
  evidence-index.json
  gates/<gate-id>/gate-result.json
  suites/<suite-id>/
    suite-result.json
    report.json
    cases/<tc-id>.json
    parameters/<parameter-result-id>.json
    stdout.log
    stderr.log
  checks/<check-id>/check-result.json
```

`report.json`是失败与成功suite都必须产出的machine-readable suite projection；`suite-result.json`是suite aggregate raw authority。若runner在生成`report.json`前异常终止，gate必须生成独立safe incomplete marker并将suite置为非passed，禁止人工补成passed report。

### 5.2 Run and context schema

| Record | Required fields | Invariant |
|---|---|---|
| `meta/context.json` | schema version、explicit run ID、source revision、formal baseline refs/digests、environment ID、profile、entries、safe tool versions | immutable per run；不保存secret/config body |
| `run-manifest.json` | run/gate ID、suite/check manifests + digests、189 identity set digest、638 pair registry digest、config artifact digest/ref、start/finish timestamps、aggregate status | manifest frozen before execution；no hidden retry/selection |
| `evidence-index.json` | schema version、run ID、generated-from refs/digests、0..189 evidence rows、generation status | raw-derived only；运行未完整时允许partial rows但不得宣告complete/pass |

### 5.3 Case evidence raw schema

| Field | Required | Contract |
|---|---|---|
| `schema_version` | yes | closed supported version |
| `run_id` | yes | explicit，等于artifact root run segment |
| `evidence_id` | yes | exact `EV-CH-*` converted from canonical candidate |
| `candidate_id` | yes | matching `EVC-CH-*`，用于设计追溯而非结果authority |
| `tc_id` / `ds_id` | yes | exact one-to-one identities |
| `source_cut_refs` | yes | Step 6 exact cut refs，nonempty |
| `primary_suite` / `role` | yes | role closed to `primary` for denominator；secondary attempt cannot create a second instance |
| `scenario_id` / `parameter_refs` | yes | exact selected branch；STATE includes individual `SP-CH-*` refs |
| `oracle_status` | yes | closed raw status；never inferred from report |
| `typed_assertions` | yes | result/state/version/history/call order/phase assertions and observed safe values |
| `zero_effect_assertions` | yes | forbidden writes/calls/events/material/ownership effects |
| `fixture_manifest_ref` / `fixture_digest` | yes | exact DS construction and cleanup namespace provenance |
| `config_manifest_ref` / `config_digest` | yes | immutable config/profile/entry provenance |
| `safe_failure_class` / `safe_failure_reason` | conditional | required for every non-passed status；不得回显body/secret |
| `started_at` / `finished_at` | yes | machine timestamps；不作为伪造run example写入设计仓 |
| `artifact_digest` | yes | digest of canonicalized raw record/blob set |

Allowed infrastructure/result status与Step 9一致：`passed|failed|timed_out|flaky_detected|blocked_dependency|invalid_artifact|cancelled`。expected typed unavailable/timeout oracle可以产生`passed` domain result；harness timeout或unexpected unavailable必须使用非passed infrastructure status。

### 5.4 Suite, parameter and check schema

| Record | Minimum content | Hard rule |
|---|---|---|
| `suite-result.json` | suite ID、required/observed TC/DS/EV sets、case refs/digests、parameter registry digest、status distribution、worst status、cleanup status、duration | 不能以executed count决定pass；missing/duplicate/nonpass cell保留 |
| `report.json` | suite result ref/digest、safe case summary、safe failure classes、stdout/stderr refs/digests | raw-derived machine projection；failed suite也必须生成或标记generation failure |
| `parameters/*.json` | owner TC/EV、parameter identity、expected/observed typed class、status、safe finding | STATE完整覆盖638个pair identities，不得采样替代 |
| `check-result.json` | check ID、input manifests/digests、scope、closed status、safe findings/locations、timestamps | finding不得包含被检查的forbidden material |
| `gate-result.json` | required suites/checks、raw refs/digests、report-generation statuses、aggregate worst status | release/nightly不能补偿main；missing report keeps nonpass |

### 5.5 Failed and incomplete suite retention

| Condition | Must retain | Forbidden |
|---|---|---|
| assertion failed | suite/case/parameter raw、`report.json`、safe stdout/stderr、failure class/reason | 删除失败、只保留重试pass |
| timed out/cancelled | partial raw、last completed phase、safe timeout/cancel reason、stdout/stderr | 伪造后续case结果 |
| flaky detected | every immutable attempt、ordering/seed refs、aggregate flaky status | retry-to-pass覆盖旧attempt |
| dependency blocked | unavailable prerequisite ref/class、selected/P0 scope、safe diagnostic | 将unavailable记为pass |
| invalid artifact | parser/pairing/digest/schema finding、affected paths、raw bytes按redaction policy保留 | 手改report/evidence index补洞 |
| report generation failed | raw suite/check/gate results、partial report、missing path list、builder status | 无report仍创建complete EV |
| redaction finding | redacted finding class/location/digest、quarantined artifact ref | 在finding中复制secret/body |

## 6. Report contract and generation order

### 6.1 Fixed directories

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-summary.md
    evidence-index.md
    redaction-check.md
    dependency-boundary.md
    responsibility-boundary.md
    report-audit.md
    suites/<suite-id>.md
    checks/<check-id>.md
    evidence/EV-CH-<FAMILY>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

`reports/acceptance/*`和`reports/review/*`必须在正文中记录其引用的显式run IDs；目录本身不带run segment不代表可以使用隐式current run。任何正式引用、链接、摘要和审查记录都禁止使用`latest`。

### 6.2 Generation order

```text
1. gate/test/check runners
   -> artifacts/test/<run_id> raw records
2. generate_suite_reports.sh
   -> suite/check readable projections
3. build_run_summary.sh + build_gate_summary.sh
   -> complete-cell and worst-status reports
4. redaction/dependency/responsibility checks
   -> check raw + readable check reports
5. check_artifact_report_pairing.sh + check_no_static_evidence.sh
   -> report-audit inputs
6. build_evidence_candidate_index.sh / future formal evidence projection
   -> evidence-index.md + per-EV pages only from verified pairs
7. acceptance draft builders
   -> reports/acceptance/* with no default verdict/signature
8. human / Agent review
   -> reports/review/* and reviewed acceptance supplements
```

若任何前序步骤失败，后序报告可生成incomplete/blocked summary用于诊断，但不能生成complete/passed evidence bundle。

### 6.3 Report builders and consumers

以下都是 future implementation contracts，不表示脚本或输出已存在。

| Output | Raw/input authority | Future script contract | Human / Agent review |
|---|---|---|---|
| suite reports | suite raw + case/parameter records | `scripts/reports/generate_suite_reports.sh` | 检查denominator、失败说明、raw refs和safe projection |
| run summary | run/gate/suite/check raw + suite reports | `scripts/reports/build_run_summary.sh` | 检查worst status、missing cells和P0/P1 separation |
| gate summary | frozen gate manifest + all required raw statuses | `scripts/reports/build_gate_summary.sh` | 检查未被nightly/release补偿 |
| evidence candidate/formal index | same-run case raw + suite raw/report + verified digests | Step 9 `scripts/reports/build_evidence_candidate_index.sh`；实现时扩为本Step formal schema或增加受控builder | 检查189 identity、AC/VF refs、orphan/duplicate/cross-run为0 |
| redaction report | redaction check raw covering artifacts and reports | `scripts/checks/check_redaction.sh` + report projection | 检查scan scope和finding不回显内容 |
| dependency report | dependency check raw | `scripts/checks/check_dependency_boundary.sh` + report projection | 检查只允许正式compile boundary |
| responsibility report | responsibility check raw | `scripts/checks/check_responsibility_boundary.sh` + report projection | 检查七类forbidden ownership均为0 |
| report audit | pairing + no-static check raw | `scripts/checks/check_artifact_report_pairing.sh`;`scripts/checks/check_no_static_evidence.sh` | 检查missing raw/report/digest/static rows |
| acceptance handoff draft | explicit run reports、evidence index、defect/residual refs | future `scripts/reports/generate_acceptance_handoff.sh` | 必须补充交付边界；不得自签验收 |
| veto checklist draft | evidence index、check reports、defect state | future `scripts/reports/generate_veto_checklist.sh` | 逐VF核对真实EV/raw，不得默认pass |
| risk acceptance draft | eligible residual records only | future `scripts/reports/generate_risk_acceptance.sh` | 必须由formal 06允许的真实owner审查；VF/S/P0-A不可进入 |
| open issues draft | nonpassed cells、defects、prerequisites、disputes | future `scripts/reports/generate_open_issues.sh` | 检查是否遗漏blocker |

### 6.4 Evidence index and per-EV report schema

| Field | Required | Rule |
|---|---|---|
| `run_id` | yes | explicit and immutable |
| `evidence_id` | yes | one canonical `EV-CH-*` |
| `candidate_id` | yes | exact predecessor `EVC-CH-*` |
| `tc_id` / `ds_id` | yes | exact one-to-one pair |
| `primary_suite` | yes | one of ten exact suites |
| `status` | yes | copied from raw; report cannot upgrade |
| `artifact_root` | yes | exact `artifacts/test/<run_id>` |
| `case_artifact_path` / `case_artifact_digest` | yes | same run |
| `suite_artifact_path` / `suite_artifact_digest` | yes | same run |
| `suite_report_path` / `suite_report_digest` | yes | exact `reports/runs/<run_id>/suites/...` |
| `ac_refs` | yes | nonempty exact `AC-CH-*` set |
| `veto_refs` | conditional | required where evidence qualifies any `VF-CH-*` |
| `generated_from` | yes | builder identity and input refs/digests |
| `redaction_status` | yes | `passed|failed|not_applicable_by_manifest`;P0 evidence requirespassed |
| `pairing_status` / `static_evidence_status` | yes | P0 requirespassed |
| `review_status` | yes | `pending|reviewed|disputed`;not acceptance verdict |

Per-EV Markdown page is a readable projection of one index row and its safe assertion summary。它不能内嵌raw secret/body，不能改变status，也不能在raw row不存在时单独存在。

## 7. Test cut, EV and acceptance consumer mapping

### 7.1 Evidence family to test cut mapping

| Test cut family | Canonical TC | Suite | Formal EV | Artifact root | Report path | Acceptance consumer direction |
|---|---|---|---|---|---|---|
| foundation/module/object/protocol | FOUNDATION `001..018` | four exact owners in §4.2 | FOUNDATION `001..018` | `artifacts/test/<run_id>` | owner suite report + evidence page | AC 001~037 according to Step 5 source;VF 001/012/013 |
| Command flow | CMD `001..026` | service-command-query | CMD `001..026` | same | service suite + evidence page | AC 001~032;VF 002~010 as exact Step 5 mapping |
| Query flow | QUERY `001..033` | service-command-query | QUERY `001..033` | same | service suite + evidence page | AC functional/data/NFR;VF reverse-write/exposure/trace |
| Inbound flow | INBOUND `001..006` | entry-inbound | INBOUND `001..006` | same | entry suite + evidence page | AC seam/trace/availability;VF governance/method/trace |
| Outbound flow | OUTBOUND `001..010` | outbound-collaboration | OUTBOUND `001..010` | same | outbound suite + evidence page | AC change/collaboration;VF traceability/forbidden data |
| Job flow | JOB `001..008` | jobs-lifecycle | JOB `001..008` | same | jobs suite + evidence page | AC derived/availability/consistency;VF reverse-write |
| State family | STATE `001..024`;638 parameter pairs | domain-state | STATE `001..024` | same | domain suite + evidence page | AC identity/registry/exposure/data;VF 002/003/008/010 |
| TX/consistency/idempotency | TX `001..022` | repository-transaction | TX `001..022` | same | repository suite + evidence page | AC truth/consistency;VF 007/009/010 |
| binding/runtime graph | BIND `001..012` | runtime-binding | BIND `001..012` | same | binding suite + evidence page | AC boundary/availability/security;VF 005/006/012 |
| observability/redaction | OBS `001..012` | observability-redaction | OBS `001..012` | same | observation suite + evidence page | AC 032/035~037;VF 004/005/006/011/013 |
| configuration failure | CONFIG `001..018` | configuration-strict | CONFIG `001..018` | same | config suite + evidence page | AC 034~037 and config-related functional AC;VF 004/011/012 |

“according to Step 5”不是省略追溯：实现期case manifest必须物化每条TC/EV的exact AC/VF set，并由case-manifest/evidence审计与Step 5矩阵求集合等价；本Step不重复粘贴189行以避免形成第二mapping authority。

### 7.2 AC consumer registry: 37/37

| AC range | Evidence selection rule | Decision owner/status |
|---|---|---|
| `AC-CH-001..005` | consume five closure families using exact TC/EV sets behind Step 5 §§4~6 | formal 06 / `not_evaluated` |
| `AC-CH-006..021` | each consumes the canonical EV set mapped to matching `FR-CH-001..016` | formal 06 / `not_evaluated` |
| `AC-CH-022` | peripheral isolation negative boundary EVs;P2 feature absence cannot fail core | formal 06 / `not_evaluated` |
| `AC-CH-023..028` | consume exact BR ranges and their negative/zero-effect EVs | formal 06 / `not_evaluated` |
| `AC-CH-029..032` | consume truth/snapshot/reference/forbidden-body EV sets across state/TX/OBS | formal 06 / `not_evaluated` |
| `AC-CH-033..037` | consume Step 10 NFR-specialty canonical EV sets plus mandatory samples/check reports | formal 06 / `not_evaluated` |

Completeness: `5 + 16 + 1 + 6 + 4 + 5 = 37`;missing/extra=0。任何future formal 06缩小或扩大consumer set都必须受控回开Step 5/13，不可在acceptance report临时改映射。

### 7.3 VF consumer registry: 13/13

| VF | Required evidence direction | Non-waivable rule |
|---|---|---|
| `VF-CH-001` | all five closure families、189 identity completeness、no orphan cut | missing/failed triggers veto |
| `VF-CH-002` | identity replacement rejection + unchanged identity state/effects | no risk acceptance |
| `VF-CH-003` | registry substitution rejection + state/TX invariants | no risk acceptance |
| `VF-CH-004` | descriptor forbidden provider/secret/route/cost material scans | no risk acceptance |
| `VF-CH-005` | governance approval/Policy/shared-rules ownership calls/writes zero | no risk acceptance |
| `VF-CH-006` | method body/source/type dependency/write zero | no risk acceptance |
| `VF-CH-007` | Query/downstream/derived/event/job reverse writes zero | no risk acceptance |
| `VF-CH-008` | nonformal candidates cannot become formal-visible | no risk acceptance |
| `VF-CH-009` | change/trace/capture exact symmetry | no risk acceptance |
| `VF-CH-010` | reserve/winner/digest/concurrency one-truth evidence | no risk acceptance |
| `VF-CH-011` | forbidden data scans over code/raw/report/log/span/metric surfaces | no risk acceptance |
| `VF-CH-012` | dependency graph/import/public-signature check evidence | no risk acceptance |
| `VF-CH-013` | historical object/threshold/topology/TC-ID leakage check | no risk acceptance |

每个veto checklist row必须引用至少一个完整EV instance或适用check raw/report pair；静态列出VF和EV合同不能形成not-triggered结论。

## 8. Redaction, provenance and review rules

### 8.1 Redaction and boundary scan

| Surface | Allowed evidence | Forbidden evidence | Failure behavior |
|---|---|---|---|
| case/suite raw | typed variants、body-free refs/digests、safe issue/failure class、bounded counts | raw secret/token/key/cert/credential、complete business/external/method/provider body | quarantine ref + safe finding；gate nonpass |
| stdout/stderr | safe runner phase/location、typed error code、ref/digest | debug dump、env/config values、request/response payload | retain redacted log/finding；never copy offending bytes to report |
| reports/evidence pages | safe summaries、IDs、paths、digests、statuses | copied raw body、private source、secret or arbitrary config | report invalid；rebuild only from clean raw |
| acceptance/review | explicit run refs、EV/AC/VF refs、decision metadata | replacing raw evidence with prose or oral confirmation | acceptance gate blocked |

Scan scope必须包括完整artifact root、完整run report root、acceptance/review drafts和生成过程captured stdout/stderr。boundary scan同时验证七类forbidden responsibility的owned code/schema/call evidence为0。

### 8.2 Pairing and no-static rules

1. 每个evidence row的raw、suite report、digest、run segment必须相同；跨run复验只能并列引用两个immutable rows，不能合并成一个row。
2. evidence page或index不能早于raw pair生成；静态mapping只用于expected manifest，不得含result status。
3. report path存在但raw missing、raw存在但report missing、digest mismatch、duplicate primary、unknown EV、unknown TC/DS、empty AC refs均为blocking finding。
4. acceptance draft只能消费passed或nonpassed的真实状态并如实投影；不能过滤nonpassed rows。
5. check evidence只能qualify/invalidate bundle，不得替某个canonical TC生成passed result。
6. 所有路径解析拒绝symlink/alias到隐式current run；正式材料绝不解析`latest`。

### 8.3 Human / Agent review

| Material | Required review | Review output | Cannot do |
|---|---|---|---|
| evidence index/per-EV pages | 189 identity、same-run provenance、AC/VF、status fidelity | reviewer/Agent note with exact disputed refs | 改raw status |
| redaction/dependency/responsibility/report audit | scope completeness、safe findings、blocking semantics | reviewed audit ref | waive VF or leak raw finding |
| acceptance handoff | P0/P1/P2/run/baseline/defect/residual boundaries | reviewed handoff supplement | sign as product acceptance without Step 14 contract |
| veto checklist | each VF has real evidence and nonwaivable treatment | reviewed checklist | default all unchecked/passed from static table |
| risk acceptance | only eligible B/non-P0 residual、owner/scope/reopen trigger | real owner decision when it exists | accept S、P0 A or any VF |
| open issues | all nonpassed/missing/disputed prerequisites | reviewed issue list | omit blocker to obtain pass |

当前没有reviewer、Agent review result、risk owner decision或signature；这些字段保持pending/empty，不能在设计仓预填。

## 9. Retention, archive and deletion lifecycle

### 9.1 Minimum event-based retention

由于active upstream没有数字保留政策，最低保留规则是以下条件全部满足前不得删除：

1. 对应run的formal acceptance decision已完成或正式裁决为不进入验收。
2. 所有关联S/A/B defect、retest pair、evidence dispute、redaction/boundary finding和open issue已关闭或由正式owner移交。
3. delivery/operations正式选择并激活了retention policy，覆盖artifact、report、review、audit与sensitive quarantine处理。
4. 没有active legal/security/investigation hold。
5. 删除候选已证明不破坏被保留acceptance/release/defect record的provenance。

### 9.2 Lifecycle

| Phase | State and action | Hard rule |
|---|---|---|
| creation | run-isolated immutable raw + generated reports | collision or pre-existing root blocks run |
| active review | reports and notes may append reviewed metadata；raw immutable | no status/body rewrite |
| defect/retest | retain failed original and distinct retest run；link by defect/retest record | never overwrite old run |
| accepted/rejected archive | freeze manifest/digests/index/review/decision refs | acceptance outcome does not permit immediate deletion |
| retention-policy evaluation | apply selected formal policy and holds | no invented local number |
| deletion | policy-authorized owner deletes complete scoped set and records deletion metadata outside deleted payload | no partial deletion that leaves false orphan evidence |

任何未来压缩、搬迁或对象存储归档都必须保持explicit run ID、digest、raw/report relation和review/decision refs；改变path时需受控manifest，不得建立隐式alias。

## 10. Evidence and report stop reviews

### 10.1 Design stop review

| Evidence/report family | Review item | Design conclusion | Execution gap |
|---|---|---|---|
| 189 canonical EV contracts | one-to-one TC/DS/candidate/suite identity | pass-designed | no instances/results exist |
| 638 state parameters | individual raw addressability under 24 STATE EVs | pass-designed | no parameter artifacts exist |
| suite/check/gate raw | closed schema、worst status、failed retention | pass-designed | runners/scripts not claimed |
| suite/run/gate reports | raw sources、fixed paths、no status rewrite | pass-designed | reports not generated |
| evidence index/pages | completeness predicate、AC/VF refs、same-run digests | pass-designed | index/pages not generated |
| redaction/boundary/audit | full scan scope and blocking findings | pass-designed | checks not executed |
| acceptance drafts | explicit run refs、no default verdict/signature | pass-designed | formal 06 and real review pending |
| retention/deletion | event gate and future policy owner | pass-designed | numeric policy unselected |

### 10.2 Future per-run stop review

每个真实run必须逐项回答：artifact是否真实存在且schema可读；report是否由声明raw生成；EV是否回指TC/DS/suite/raw/digest/AC/VF；redaction与boundary scan是否覆盖；acceptance draft是否已由真实人或Agent审查。任何一项为否，都不得进入complete evidence bundle。

### 10.3 Cross-evidence truthfulness and traceability audit

| Audit item | Static design result | Future execution gate |
|---|---|---|
| canonical candidate/formal EV count | `189/189`;missing=0;extra=0 | case manifest equality |
| TC/DS/EV primary uniqueness | duplicate=0 by transformation rule | raw set equality and duplicate scan |
| suite partition | `189=8+26+60+8+10+9+25+13+12+18` | suite raw owner audit |
| orphan EV contract | 0 | evidence-index orphan scan |
| duplicate run-scoped EV | not evaluated | `(run_id,evidence_id)` uniqueness |
| static result/evidence mapping | forbidden by contract | no-static-evidence check |
| missing raw/report/digest | not evaluated | pairing check blocks |
| cross-run alias/implicit run | forbidden by contract | path/run equality check |
| redaction gap | no design gap | full artifact/report scan |
| AC consumer gap | `37/37`;missing=0 | evidence-index set audit |
| VF consumer gap | `13/13`;missing=0 | veto checklist evidence audit |
| failed result omission/overwrite | forbidden by contract | immutable run/retest audit |
| acceptance verdict/signature fabricated | 0 in this document | review/signoff provenance gate |
| historical material or responsibility leakage | 0 active mapping | static/boundary checks |

设计停审结论只表示未来证据链可实现，不是任何执行门禁通过。

## 11. Upstream impact, formal fill draft and Step 14 gate

### 11.1 Upstream impact

| Conclusion | Upstream impact | Disposition |
|---|---|---|
| 189 candidate可无歧义提升为formal EV contract | none | downstream evidence identity closure |
| AC/VF consumer可由Step 5 exact maps物化 | none | formal 06继续裁决 |
| retention缺少数字政策 | none current | event-based minimum；future delivery policy prerequisite |
| Step 9 candidate builder需承接formal schema | none upstream | formal 07 implementation task |
| artifact/report真实存在性未建立 | expected | execution prerequisite,not design blocker |

当前 writeback / blocking confirmation / unresolved upstream blocker = `0 / 0 / 0`。

### 11.2 Formal `05` §13 fill draft

正式章应装配：三层evidence identity；189合同和十suite精确库存；raw/report目录与schema；generation order；failed retention；AC/VF consumer；redaction/pairing/no-static/review；event-based retention；stop review与truthfulness audit。SOP问题原文、旧formal 05/06、真实结果和签署不得写入正式章。

### 11.3 Step 14 entry gate

| Criterion | Result |
|---|---|
| 189 `EVC -> EV` one-to-one transformation closed | pass-designed |
| 189 TC/DS/EV and ten-suite partition exact | pass-designed |
| raw/report/evidence schema and fixed roots closed | pass-designed |
| AC 37/37 and VF 13/13 consumer direction closed | pass-designed |
| failed/incomplete/retest provenance closed | pass-designed |
| redaction/pairing/no-static/review/retention closed | pass-designed |
| fake execution/evidence/review/signoff created | 0 |
| upstream blocker | 0 |

Step 13完成，可以进入Step 14 `定义回归策略与残余风险`。正式`05-测试方案.md`仍不得修改。
