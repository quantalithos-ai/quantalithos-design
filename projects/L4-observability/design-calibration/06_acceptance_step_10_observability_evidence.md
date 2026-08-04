# L4-observability 06-验收标准 Step 10：定义可观测性、审计与证据门禁

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `10 / 定义可观测性、审计与证据门禁` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `runtime_observation_and_run_evidence_dual_chain` |
| formal_document_write | `not_allowed_until_step_15` |
| real execution | `not_run`;没有真实 run/artifact/report/evidence |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §12 |
| gate_status | `pass_for_observability_evidence_gate_design` |
| next_allowed_action | `start_current_06_step_11` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧模板沿用了不存在的泛化 `NormalizedLogRecord` / `MetricPoint` / `TraceSpanRecord` /
`AuditEventProjection` 摘要，且没有把 current `03` 的 Layer A~D、redaction/recursion、99-row evidence index 和
run-scoped provenance 连成可裁决门禁；旧内容不作为 current truth。

## 1. 本步目标、输入与权威顺序

### 1.1 目标与双链边界

本 Step 同时定义两条必须分离、但可以在验收报告中互相引用的链：

```text
本仓运行观测 / 审计材料链
typed protocol -> redaction -> Layer A telemetry / Layer B durable fact
             -> Layer C propagation material / Layer D read-handoff surface

送验验收证据链
exact TC + exact DS -> raw case artifact -> primary suite report / check report
                   -> same-run evidence index -> acceptance handoff / review
```

第一条链验证 `L4-observability` 自身是否安全、可关联、可审计、可降级；第二条链验证未来某次送验是否有真实、
同 run、可复查的证据。任一链完整都不能自动推出另一链通过。产品内 `ReportHandoffRecord`、trace、metric、log、
audit projection、candidate EV 和 acceptance handoff 都不是最终验收裁决 owner。

### 1.2 输入与权威顺序

| 输入 | 本步用途 |
|---|---|
| 验收 SOP Step 10 / 书写规范 §5.10 | 证据门禁、报告完整性、handoff、停审和跨证据审计要求 |
| `00-需求文档.md` §13~§14 | `NFR-OBS-003/006/011/014/015/016/021~024`、`AC-OBS-002~005/028~031`、`VF-OBS-002~010` |
| `03-详细设计.md` §14 | Layer A~D、finite vocabulary、log/metric/span、native audit、redaction、recursion、correlation、handoff/no-write |
| `04-配置设计.md` §8/§10/§12 | sensitive output、profile/lane、downstream evidence 和 fail-fast 边界 |
| `05-测试方案.md` §9/§10/§13/§14 | 9 suite、5 scripts、16 cuts、99 TC、82 DS、canonical root、report producer、residual |
| current Step 01~09 | baseline、AC、redline、protocol/state/UoW/NFR 和 candidate linkage 规则 |
| L1 reference Step 10 | 只参考证据矩阵、P0 traceability、report audit、handoff review 的粒度，不复制其 truth/ID |

权威顺序为 current 正式 `00~05` -> current Step 01~09 -> current SOP/书写规范。README、旧正式 06、旧 Step 10、
旧产品栈和旧证据编号均是 `historical_material`。

### 1.3 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 回答 14 个 SOP 问题并分离双链 | §2 | done |
| 固定观测材料 schema / timing / forbidden fields | §3~§5 | done |
| 固定 10 个 observation gates | §6 | done |
| 固定 9 个 run evidence/report gates | §7~§8 | done |
| 完成 99/99 exact provenance、停审和跨证据审计 | §9~§13 | done |

## 2. SOP 问题回答

| 问题 | Current 回答 |
|---|---|
| 哪些行为必须有 audit record | accepted local mutation、safety disposition、correlation/signal、audit/evidence append、handoff/retention/no-write/gap transition、outbox/publication、Job plan/item/report 等必须使用 `03` 已定义的 native owner/history/marker/report；runtime telemetry 不能替代 durable record。 |
| 哪些行为必须有 trace/log/metric | public Command/Query/Consumer/Job、UoW、repository/resolver、outbox/external phase、config assembly、redaction/dependency/report checks 都必须有 safe finite telemetry 或 check report；Query 的 telemetry 不得产生 durable write。 |
| 哪些测试报告必须归档 | 每个 required primary suite、每个 required check、同 run `summary/evidence-index/gate-results/redaction/metric/dependency/report-audit/input-integrity`，以及 acceptance `handoff/veto-checklist/risk-acceptance/open-issues`（适用时）都必须有固定路径和状态。 |
| 证据缺失是否导致不通过 | P0 raw case、suite report、required check、digest、evidence index 或 provenance 缺失时不可裁决；硬红线/脱敏/依赖/report audit 失败时总体不通过。 |
| 证据如何被复查 | 从 `reports/runs/<run_id>/evidence-index.md` 按 exact candidate EV 回到 TC、DS、primary suite、report digest，再回到 `artifacts/test/<run_id>/...` raw case/check；不能从摘要反推 raw。 |
| evidence-index 是否覆盖全部 P0 EV | 必须覆盖 current `05_test_plan_step_13_evidence.md` 的 99/99 exact rows；每个 `TC-OBS-*` 与同 suffix `EV-CAND-OBS-*` 一一对应，不能用 family wildcard 代替真实行。 |
| gate-results 是否覆盖 release gate | 必须记录 9 primary suites、required checks、lane/profile、blocked/not_run/conditional/indeterminate 和失败优先级；不能只列绿色数量。 |
| redaction-check 是否覆盖 artifact/report | 必须扫描 raw artifact、suite/run report、acceptance/review 初稿和 stdout/stderr；扫描未执行、输入缺失或 scanner 失败不得写 clean。 |
| handoff 是否已由人/Agent 审查 | generator 只能产生待审草稿；正式验收前必须记录 reviewer/Agent review status、范围、冲突、open issue 和修正，不得由脚本默认签署。 |
| veto-checklist 是否覆盖所有 VETO | Step 11 固定的每个 VETO 都必须有红线来源、exact TC/EV/check、report path、status、finding 和 review；缺证据不是“未触发”。 |
| risk-acceptance 是否支撑条件通过 | 只有 non-VETO、非 S 级、范围内且有 owner/acceptor/action/deadline/trigger 的 residual 才能进入条件通过候选；当前不生成任何接受事实。 |
| 每个 P0 EV 是否能回指 TC/suite/artifact/report/AC/VF | 必须能完整回指；缺任一关系为 orphan/provenance failure，并不得在 Step 14 形成正向结论。 |
| evidence/report 门禁是否逐项停审 | 是。每个 gate 要检查存在性、可解析性、same-run、digest、status truthfulness、redaction、review 和 no-static-evidence；完成后才允许进入跨证据审计。 |
| 是否存在静态造证据/orphan/report缺失/未审查初稿 | 设计阶段禁止；未来由 `EVG-OBS-006/007/008/009` 和 `report-audit.md` 检查。当前状态是 `not_established`，不是 clean。 |

## 3. 本仓观测材料分层与 truth boundary

### 3.1 Layer A~D 归属

| Layer | 材料 | owner / durability | 可证明什么 | 明确不能证明 |
|---|---|---|---|---|
| A | structured log、runtime metric、runtime span | process/host sink；out-of-band、best-effort | operation/phase/result/error/correlation 的安全观察 | accepted、published、delivered、fresh、业务执行 truth、验收通过 |
| B | receipt、safety、correlation、safe signal、audit projection、evidence linkage、handoff、retention/no-write/gap/reference 及 native history | 本仓 domain owner + repository；durable | observation-side fact、projection、marker、history 和可追溯关系 | source business/Governance/Artifact/Identity/runtime/archive truth、正文、verdict/signoff |
| C | outbox snapshot/publication、Job plan/claim/fence/item/report、external intent/token | 对应本仓 propagation/execution owner | 已提交的本地传播/执行材料及恢复语义 | 从 telemetry 恢复、外部消费完成、H13 positive、业务 truth 改变 |
| D | Query view、diagnostic、evidence-index input、report handoff、peripheral export | committed read 或 formally prepared local handoff | 只读/交接准备、缺口、可见性和消费目的 | source repair、final verdict、真实 evidence alias、signoff |

### 3.2 观测材料 schema 约束

| Schema / owner | 必须表达 | 必须禁止 | 产生时点 / failure |
|---|---|---|---|
| `ObservationRuntimeLog`（Layer A） | finite `operation`/`phase`/`result_kind`/`error_kind`、safe issue/ref、可选 trusted correlation、bounded duration/count | raw request/event/log/metric/trace/body、key/digest/token、endpoint/secret、真实 run/evidence/verdict | typed allowlist 后 serialization；mapping/sink失败只 suppression + process-local counter |
| `ObservationRuntimeMetric`（Layer A） | `observability_` metric、声明的 type、finite allowlisted labels、duration/count 或 complete snapshot gauge | ref/key/digest/free text/high-cardinality/业务正文；backend ack 作为 truth | formal boundary 后记录；未声明 label、无法解析或 sink failure 不改业务结果 |
| `ObservationRuntimeSpan`（Layer A） | trusted parent/trace context、finite operation/family/phase、typed outcome/status、safe issue ref | 从 parent 推导 actor/business truth、raw attributes、token/digest/provider body、missing trace 回填 durable DTO | entry/phase boundary；missing trace 只保留 process-local span |
| `ObservationReceipt` / `SafetyDisposition` | body-free source/purpose、typed disposition、redaction/safety marker、source/version relation | raw material、secret、未经 redaction 的 summary、source truth state | accepted/rejected/quarantine UoW；unsafe input fail closed |
| `CorrelationContext` / `SafeSignal` | typed source/trace/causation ref、safe summary、signal kind/state、freshness/gap | opaque ref 推导 actor/subject/work/decision；raw telemetry 直接落库 | formal intake+safety 后；source mismatch/raw summary typed reject |
| `AuditProjection` / `EvidenceLinkage` | source audit ref、safe subject/context、boundary ref、purpose、digest summary、visibility/gap/provenance | source audit/evidence/artifact/identity/governance body、verdict、signoff | append-only owner UoW；body/wrong owner/missing digest blocked |
| `ReportHandoffRecord` / `AuthenticityHint` | immutable evidence-index input ref、consumer purpose、redaction/visibility/gap/readiness、owner-backed provenance | report body、real run/evidence alias、final verdict/signoff；`Delivered` 不等于验收通过 | local prepare/deliver/finalize；missing basis -> blocked/placeholder/insufficient |
| `RetentionMarker` / `ActiveReferenceProtection` | hold/release/conflict、active refs、archive eligibility、reason/version/CAS | fixed TTL、cleanup command、source deletion authority、backend retention equivalence | protection/marker UoW；active reference blocks release/cleanup |
| `NoWriteViolation` / `Gap` / `JobReport` | attempted target class、reason、scope、status、recovery/manual posture、safe refs | actual source repair、fabricated completion、raw target/body | formal observation-side transition；persist failure cannot authorize attempted write |

### 3.3 Correlation 与 recursion rules

1. `trace_ref`、`causation_ref`、`correlation_context_ref` 只提供关联语境；它们不生成业务主键、actor、subject、decision、artifact 或 execution truth。
2. accepted/published/delivered/finalize telemetry 只能在对应 local commit/finalize 后 emit；commit/external unknown 保持 `indeterminate`。
3. duplicate/replay 只能记录 runtime replay outcome，不增加 history/outbox/intent/item/accepted-change metric。
4. telemetry emitter/sink 不得调用本仓 Command、Consumer、Job、Maintenance、Publication 或自回流 `SafeSignal`。
5. sink failure、drop、retry、retention 或 backend ack 不能改变 durable owner、retry authority、业务结论或验收结论。

## 4. Redaction / forbidden material 门禁

### 4.1 Forbidden corpus

以下材料在 domain、store、event、outbox、Layer A telemetry、Layer D report、artifact、acceptance/review 中均必须为零：

| 类别 | 禁止样例 | 处置 |
|---|---|---|
| 输入/运行正文 | raw request/event/log/metric/trace、raw prompt、provider/runtime/sandbox body | pre-parse/reject/quarantine；不输出原文或 hash surrogate |
| 外部 truth 正文 | source audit、Governance decision、Artifact/evidence、Identity、archive/package body | 只保留 typed body-free ref/summary；wrong owner blocked |
| 敏感材料 | secret、credential、token、endpoint、topic、route、private locator、full sensitive ref | private adapter memory only；public/domain/report deny |
| 验收伪造 | real `run_id`、evidence alias、passed evidence、final verdict、signoff | design planned / blocked / not_evaluated；report-audit finding |
| 逃逸编码 | Debug dump、display chain、hash/base64/digest 反向承载正文 | scanner finding；不得以编码绕过 |

### 4.2 Redaction gate

| Gate ID | 检查 | 通过条件 | 失败条件 | 证据入口 |
|---|---|---|---|---|
| `OBS-MAT-001` | pre-serialization allowlist | typed safe fields 经 redaction 后才进入 serializer/append/sink | unsafe field 先序列化、fallback dump、forbidden field 落 durable | `TC-OBS-RED-*`;`TC-OBS-SIG-*`;`redaction-check.md` |
| `OBS-MAT-002` | body-free persistence/event | domain/store/outbox/event/report 只含 safe refs/summary/digest summary | 任一正文、secret、完整 ref 或 encoded body 出现 | `TC-OBS-ING/EVD/AUD/RPT-*`;raw scan |
| `OBS-MAT-003` | metric label safety | metric name/type/label key/value 来自 finite allowlist；无 ref/key/digest/free text | 未声明、高基数、正文或动态 route/handler 标签 | `TC-OBS-SIG-006`;`metric-label-check.md` |
| `OBS-MAT-004` | report/acceptance scan | raw artifact、stdout/stderr、suite/run/acceptance/review 均扫描，scanner/input digest 可验证 | scanner 未执行、输入缺失却 clean、报告二次泄露 | `TC-OBS-RPT-005`;`report-audit.md`;`redaction-check.md` |

## 5. Runtime observation/audit evidence gates

| Gate ID | 主题 | 必须存在 | 通过条件 | 失败条件 | 影响 |
|---|---|---|---|---|---|
| `OBS-MAT-005` | accepted mutation audit | native receipt/safety/transition/history/outbox/result 按 `03` owner 成对存在；runtime log/span只能作辅助 | mandatory durable record 与 owner UoW 同步；failure rollback | log/span success替代native audit，或accepted后缺history/outbox/result | P0 failed；可能触发 `VF-OBS-001/004/005` |
| `OBS-MAT-006` | correlation / trace propagation | trusted trace/causation/source context 按 exact phase 传播，missing/partial 显式 | parent/child relation、source parity、safe visibility成立 | 从 opaque span 推导业务 truth，current span覆盖stored context，missing被补造 | P0 failed |
| `OBS-MAT-007` | log/metric/trace result timing | accepted/published/delivered/duplicate/indeterminate 只在正式边界后出现 | typed outcome、phase、error/recovery、safe refs 与 commit/finalize 顺序一致 | pre-commit success、sink ack冒充业务结果、unknown被写成成功/失败确定 | P0 failed |
| `OBS-MAT-008` | audit/evidence linkage | `AuditProjection`/`EvidenceLinkage` body-free、owner/digest/purpose/visibility/gap唯一 | relation 可从 native owner 回查；preview 不 mint durable alias | body、wrong owner、missing digest、多义 linkage、Query写入 | P0 failed；可能触发 `VF-OBS-003/004/006` |
| `OBS-MAT-009` | retention/no-write/report handoff | marker/protection/no-write/job report/handoff record 有 reason/status/version/refs | active protection、blocked、manual、gap 和 authenticity 清楚；只写本仓 owner | backend TTL/telemetry ack当marker；Query/Job/report修外部 truth；Delivered当verdict | P0 failed；可能触发 `VF-OBS-005/007` |
| `OBS-MAT-010` | self-observation guard | call graph、sink spy、loopback binding 和 suppression counter 可验证 | emitter不调用own façade、不回流、不产生nested telemetry | recursion、sink failure触发业务写/重试/回流，或无法检查 | P0 failed；VETO candidate |

## 6. Acceptance run evidence gates

### 6.1 证据门禁主表

`EVG-OBS-*` 是验收证据结构的稳定 gate ID，不是新的 evidence alias，也不替代 `EV-CAND-OBS-*`。

| Gate ID | 证据主题 | 固定路径/输入 | 通过条件 | 失败条件 | 影响 |
|---|---|---|---|---|---|
| `EVG-OBS-001` | P0 evidence index completeness | `reports/runs/<run_id>/evidence-index.md` + `artifacts/test/<run_id>/evidence-index.json` | current `05` 99/99 exact TC rows均有同 suffix candidate EV、AC/VF refs、DS、primary suite、lane/profile、artifact/report path、digest/status | orphan/duplicate/missing row、wildcard、cross-run、无 digest、静态手写 index | 不可裁决；P0 不通过 |
| `EVG-OBS-002` | raw artifact completeness | `artifacts/test/<run_id>/meta/*`、suite metadata/report/case/check raw | 9 suite、required checks、99 case linkage、82 DS manifest、失败/blocked也有最小 failure record | 删除失败材料、空 artifact、缺 manifest、case/suite 不匹配、缺 input integrity | blocked；不得用 summary补齐 |
| `EVG-OBS-003` | human-readable report pairing | `reports/runs/<run_id>/summary.md`、`suites/<suite_id>.md`、`input-integrity.md` | 每份 report 从同一 raw root 生成，status/failure/blocked/not_run/conditional完整，可回指 digest | 手写补洞、复制旧 run、隐藏失败、run mismatch、缺 required suite report | blocked / failed |
| `EVG-OBS-004` | gate result completeness | `reports/runs/<run_id>/gate-results.md` | 9 suite、5 script/check、lane/profile、required/optional、failure precedence 和 residual均列明 | 只汇总 passed、缺 required check、blocked被吞掉、不同 profile拼接 | 不通过 |
| `EVG-OBS-005` | redaction / metric safety | `redaction-check.md`、`metric-label-check.md` + raw check output | artifact、report、acceptance/review扫描 clean；negative leak安全失败；metric allowlist完整 | raw/secret/high-cardinality、scanner未执行却clean、report二次泄露 | VETO / 不通过 |
| `EVG-OBS-006` | dependency / history / truth audit | `dependency-boundary.md`、静态 corpus、source snapshot | only `L0-core/core-contracts` compile edge；no historical/product/static evidence upgrade；writer graph合规 | non-core edge、历史数值成为current、source writer越权、扫描缺失 | VETO / 不通过 |
| `EVG-OBS-007` | report provenance audit | `reports/runs/<run_id>/report-audit.md` | raw->suite report->run report->candidate link均同 run、同 TC/DS/suite、digest一致；无 `latest`/static pass | orphan EV、静态 JSON/Markdown造结果、跨 run、空 raw、failed改passed | 不可裁决；可能 VETO |
| `EVG-OBS-008` | acceptance handoff review | `reports/acceptance/handoff.md`、`open-issues.md`、`reports/review/*` | selected run、scope、baseline、缺口、blocked/residual、review version、审查角色和修正均有回指 | 模板代替审查、缺 selected run、open issue被删除、handoff宣告最终通过 | handoff not_ready；不得退出 |
| `EVG-OBS-009` | VETO/risk evidence input | `veto-checklist.md`、适用时 `risk-acceptance.md` | 每项 VETO逐项有来源/EV/report/status/review；risk只列可接受 residual并有 owner/acceptor/action/deadline/trigger | 默认全 passed、缺证据当未触发、接受 VETO/S级、无接受人仍条件通过 | 不通过；Step 13/14 blocked |

### 6.2 99/99 exact provenance contract

权威 exact index 是 `projects/L4-observability/design-calibration/05_test_plan_step_13_evidence.md` §8.2.1，
不是全文 `05` 中重复出现的 family 表。其 99 行必须满足：

| Join 维度 | 要求 | 发现异常时 |
|---|---|---|
| `TC-OBS-*` | 99 个稳定且唯一 | duplicate/orphan 立即阻断 |
| `EV-CAND-OBS-*` | 与 TC suffix 一一相等 | suffix mismatch 不猜测修复 |
| `DS-OBS-*` | 每行至少一个 exact dataset，来自 82 manifest | family/wildcard 不能替代 |
| primary suite | 每行唯一主 suite；secondary check不创建第二主归属 | duplicate primary 阻断 |
| lane/profile | 记录 exact lane + `LocalTest`/`IntegrationLike`/`RuntimeLike` | 真实性等级不能跨级替代 |
| raw/report | 同一 `<run_id>` 下 artifact/report path + digest | 缺 raw、跨 run、`latest` 阻断 |
| AC/VF | 至少一个 current `AC-OBS-*`，必要时 `VF-OBS-*` | 无裁决主语为 orphan |
| status | 真实执行才可 `passed/failed/...`；设计期为 planned | planned/static结果不得伪装执行 |

当前只能声明设计 contract 为 `99/99 planned linkage`；不存在真实 run 或 evidence，因此不能声明任何 EV、AC 或 VETO 结果。

## 7. Canonical paths 与交接审查

### 7.1 路径约束

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/source-manifest.json
  meta/config-manifest.json
  meta/dataset-manifest.json
  gate-results.json
  evidence-index.json
  suites/<suite_id>/{suite-metadata.json,report.json,cases/<tc_id>.json,stdout.log,stderr.log,failure-summary.json,input-manifest.json,dataset-manifest.json,checks/*}

reports/runs/<run_id>/
  summary.md
  evidence-index.md
  gate-results.md
  redaction-check.md
  metric-label-check.md
  dependency-boundary.md
  report-audit.md
  input-integrity.md
  suites/<suite_id>.md
  evidence/<candidate-ev-id>.md

reports/acceptance/
  handoff.md
  veto-checklist.md
  risk-acceptance.md
  open-issues.md

reports/review/
  reviewer-notes.md
  agent-review.md
```

禁止 `latest`、project-prefixed root、跨 run 拼接、临时绝对路径、只生成 summary、手写 `passed/green`、复制旧 report
替换 run id，以及把产品内 telemetry/handoff 当作 raw acceptance evidence。

### 7.2 Acceptance 文件职责

| 文件 | generator 可写 | 人/Agent 必须审查 | 禁止表达 |
|---|---|---|---|
| `handoff.md` | selected run/suite/coverage/path/status projection | scope、异常、blocked/residual、是否回流 | final verdict/signoff/real evidence alias |
| `veto-checklist.md` | VETO 输入索引和待检查状态 | 每项 finding、证据、触发/未触发裁决 | 缺证据自动未触发/默认 passed |
| `risk-acceptance.md` | residual candidate、影响和候选动作 | acceptor、理由、deadline、trigger | 接受 VETO/S级、无接受人条件通过 |
| `open-issues.md` | blocker/affected/defect refs | owner、下一动作、回归范围 | 删除开放问题、改写状态 |
| `reviewer-notes.md` / `agent-review.md` | provenance diff/检查摘要 | 冲突、修正、审查结论 | 修改 raw artifact 或伪造结果 |

## 8. 证据门禁停审记录

### 8.1 观测材料 gate 停审

| Gate | owner/来源 | schema/字段 | redaction | timing/no-write | evidence path | 结论 |
|---|---|---|---|---|---|---|
| `OBS-MAT-001~004` | `03` §14.2/14.7；`05` telemetry checks | finite safe fields/labels | pre-serialization + whole-root scan | unsafe/sink failure suppression | raw/check reports | `pass_design` |
| `OBS-MAT-005` | `03` §14.1/14.6 | native audit/history exact owner | body-free | same UoW/rollback | service/repository raw | `pass_design` |
| `OBS-MAT-006~007` | `03` §14.2/14.5 | trusted correlation + typed outcome | no opaque inference | post-commit/finalize | telemetry recorder + TC | `pass_design` |
| `OBS-MAT-008~009` | `03` §14.6/14.9；Step 06~09 | relation/marker/handoff fields | body-free | no external truth write | service/recovery/report | `pass_design_with_affected` |
| `OBS-MAT-010` | `03` §14.8 | call graph/loopback/suppression | no fallback dump | no own façade call | static/telemetry check | `pass_design` |

### 8.2 Acceptance evidence gate 停审

| Gate | required input | exact check | 缺口影响 | 结论 |
|---|---|---|---|---|
| `EVG-OBS-001` | 99 row index | TC/EV/DS/suite/lane/path/digest join | P0不可裁决 | `pass_design` |
| `EVG-OBS-002` | raw roots + 82 DS manifest | 9 suite/99 cases/required checks/failure retention | blocked | `pass_design_with_target_precondition` |
| `EVG-OBS-003~004` | same-run reports | report generation/status/precedence | blocked | `pass_design` |
| `EVG-OBS-005~007` | redaction/metric/dependency/report audit | no body/high-cardinality/non-core/static/latest/orphan | VETO/blocked | `pass_design` |
| `EVG-OBS-008~009` | acceptance/review files | human/Agent review, VETO/risk fields | cannot exit/conditional | `pass_design_with_target_precondition` |

## 9. 跨证据裁决审计

| 审计项 | Current 结果 | 处理 |
|---|---|---|
| observation Layer A/B/C/D 与 acceptance raw evidence 混淆 | 0 allowed | 双链分离；formal §10 同时引用但不合并 truth |
| 99 exact TC/EV orphan/duplicate | 0 in design index | 真实 run 必须由 `EVG-OBS-001/007` 重验 |
| 82 DS 未进入 provenance | 设计映射已覆盖 | 真实 manifest 缺失即 blocked |
| 9 suite / 5 check/script coverage | 已由 `05` 固定 | 缺 required suite/check 不得汇总通过 |
| raw/report same-run | contract fixed | 当前无 run，状态 `not_established` |
| static evidence / `latest` / copied report | 明确禁止 | report audit nonzero + VETO candidate |
| failed/blocked/not_run/indeterminate 被吞掉 | 明确禁止 | 保留原状态，不能降级为 passed |
| redaction 扫描是否覆盖失败输出和 acceptance/review | 已要求全 root | scanner缺失/失败不写 clean |
| handoff/veto/risk 是否未经 review | 明确必须人工/Agent review | 未审查则 `not_ready` |
| telemetry/handoff 是否产生 source truth / verdict | 0 allowed | Step 06/08/11/14持续复核 |
| 新 upstream blocker | none | inherited affected继续开放 |

## 10. 未执行与真实性边界

当前目标实现仓、CI、durable store、RuntimeLike、真实 run/artifact/report/evidence 均未建立。因而：

- `EV-CAND-OBS-*` 是 planned linkage，不是正式 evidence alias。
- `OBS-MAT-*` / `EVG-OBS-*` 是设计门禁，不是执行结果。
- 不填写 `run_id`、artifact digest、report digest、passed、verdict、signoff、review approval 或 acceptance 结论。
- required lane 缺失保持 `blocked/not_run/not_evaluated`；不能用较低真实性环境替代。
- 设计材料中出现静态通过、真实 ID 或签署文本本身就是 `VF-OBS-006/010` 方向的证据真实性违规。

## 11. Inherited blocker / affected

本 Step 未发现新上游 blocker。以下 12 项继续开放，不能被 evidence design 或 acceptance handoff 关闭：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

I05 只允许 pre-parse/schema/binding fail-closed；J06 只允许 controlled `Blocked/manual`；其他 affected positive
evidence 必须等 owner/implementation closure 后重跑，并回写同 run provenance。任何 missing evidence 不能被手工
说明或 risk acceptance 伪装为已完成。

## 12. 正式 `06` §10 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“本仓观测材料分层与 truth boundary”“Redaction / forbidden material 门禁”“Runtime observation/audit evidence gates”“Acceptance run evidence gates”“Canonical paths 与交接审查”和“跨证据裁决审计”。

正式 §10 应承载以下收口结论：`L4-observability` 的 runtime telemetry、durable observation facts、propagation/execution
material 和 read/handoff surface 分层；redaction 必须先于 serialization/append/report；correlation 只提供关联语境；
evidence linkage 只能 body-free；retention marker 不等于 backend TTL；report handoff 不生成 verdict/signoff。

验收证据必须来自同一 `<run_id>` 的 raw artifact、suite/report/check 和 evidence index；当前 exact contract 为 99/99 TC/EV
planned linkage、82 DS、9 suite、5 scripts/checks。`latest`、跨 run、静态 passed、空 artifact、失败删除、未经 review 的
acceptance 草稿和真实 evidence/verdict/signoff 伪造均阻断验收。产品内 telemetry/handoff 不能替代 raw evidence，也不拥有
业务 truth 或最终裁决。

## 13. 待确认事项

| ID | 事项 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-10-01` | 实现仓脚本实际 producer ref 与 `05` planned contract 的最终绑定 | target absent | Step 07/implementation handoff 前不得写执行 path |
| `Q-06-10-02` | acceptance/review 的具体 reviewer/Agent 角色 | not assigned | Step 14 只定义角色职责，不填写姓名/签署 |
| `Q-06-10-03` | 长期 retention 对 raw/report/acceptance/review 的保留策略 | no threshold | 当前只固定 active protection 和 marker linkage |
| `Q-06-10-04` | RuntimeLike 与真实外部 endpoint | not established | selected release evidence 保持 not_evaluated |

## 14. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| 是否分离 runtime observation chain 与 acceptance evidence chain | yes |
| Layer A~D 是否与 `03` owner/timing/boundary 一致 | yes |
| 是否有 10 个 observation gates | `OBS-MAT-001~010` |
| 是否有 9 个 acceptance evidence gates | `EVG-OBS-001~009` |
| 是否保留 99/99 exact provenance、82 DS、9 suite、5 scripts | yes |
| 是否禁止 raw body/secret/high-cardinality/static evidence/latest | yes |
| 是否保留 blocked/not_run/not_evaluated 和 inherited affected | yes |
| 是否伪造 run/evidence/verdict/signoff | no |
| 新 upstream blocker | none |
| `gate_status` | `pass_for_observability_evidence_gate_design` |
| `next_allowed_action` | `start_current_06_step_11` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 15. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 10
- `standards/document/验收标准书写规范.md` §5.10
- `projects/L4-observability/00-需求文档.md` §13~§14
- `projects/L4-observability/03-详细设计.md` §14~§15
- `projects/L4-observability/04-配置设计.md`
- `projects/L4-observability/05-测试方案.md` §9~§10、§13~§14
- `projects/L4-observability/design-calibration/05_test_plan_step_13_evidence.md` §4~§10
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md` through `06_acceptance_step_09_nonfunctional.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_10_observability_evidence.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_10_observability_evidence.md`
