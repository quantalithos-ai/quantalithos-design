# 06 验收标准校准 · Step 10 可观测性、审计与证据门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10
- 回填章节：正式 `06-验收标准.md` §10

### 1.1 Step 内计划

- [x] 读取 Step 3/4/9、03 §14、05 §9/§13~§14
- [x] 隔离业务 audit/telemetry、test raw、human report、acceptance projection、review/signoff
- [x] 固定 same-run raw/report/check/index/final seal eligibility 链和无环 writer order
- [x] 完成 planned candidate registry、projection manifest/四文件、review/handoff 门禁
- [x] 逐 evidence/report gate 停审并做 orphan/static/cycle/redaction 审计
- [x] 完成回填草稿、自检与 Step 11 进入门禁

## 2. 本步输入

| 输入 | 固定事实 |
|---|---|
| `03-详细设计.md` §14 | `ToolAuditEntry` 是业务本地事实并与 outcome pair atomic；log/metric/trace 是安全观测，不是 audit/truth/evidence |
| `05-测试方案.md` §9 | release=`ci-test`，11 P0 owning suites + same-run smoke + exact 11 checks；status/pairing/redaction 规则闭集 |
| `05` §13 | common artifact schema/digest、pre-check index、final seal、manifest、writer order、fixed paths、review lifecycle |
| Step 3 | baseline 只接受 matching passed release seal + matching committed projection；当前所有实例 `not_bound` |
| Step 4 | formal entry 要求 required final slot eligible/pending review；current process=`not_entered` |
| Step 5~9 | 39 AC、37 protocols、state/NFR gate 已固定；证据门禁只能追溯，不重定义 oracle |

## 3. SOP 问题回答

1. **哪些行为必须有 audit record？**

   已成立 tool invocation 的 no-execution 或 source-backed terminal outcome 必须与 `ToolAuditEntry` 同 UoW 成对；identity/definition/binding 等变化使用各自正式 fact，handoff 使用 eligibility/material/attempt/gap。不得为所有行为另造通用 AuditEvent，也不得用日志/Bus ack/Obs projection 补 audit。

2. **哪些行为必须有 trace/log/metric？**

   五类 entry、Store/UoW/Port、accepted/rejected/blocked/replay、state/phase/error/unknown、Query freshness、Job bounded summary、config/builder failure、dependency resolution 都应有 safe signal。它们使用 closed low-cardinality label、typed safe ref、metadata-derived TraceContext；observer failure/cancellation 不得改变业务结果。

3. **哪些报告必须归档？**

   单一 release run 的 context/source/config metadata、11 suite raw/report/stdout/stderr/cases/journals、11 check JSON、`evidence-index.json`、`gate-summary.json`、run human reports/evidence pages、四份 acceptance staging/fixed copies、projection manifest，以及按 source tuple append 的 review blocks。失败/blocked/cancelled 也必须保留 safe material。

4. **证据缺失是否导致不通过？**

   尚未送验时保持 `not_entered`；送验后 P0 required raw/report/check/index/seal/manifest/slot 缺失或 invalid 使 evidence gate 不通过，不能口头补证。`pending_review` 不能自动 pass；P1/future 未纳入 scope 时只保留 residual。

5. **证据如何复查？**

   先验证 common schema/self-digest/same-run path，再由 seal 验证 suite/check/index/manifest digest，按 M1->captured seal/index/staging/fixed->M2 算法固定 projection bytes，最后按 AC/VF 检查 final eligibility 与 review。过程中不重开 mutable fixed files。

6. **Index/gate/redaction/handoff 是否完整？**

   `evidence-index.json` 必须覆盖 complete planned slot registry 和 concrete trace，但它只有 derivation。`gate-summary.json` 必须闭合 full release denominator、checks、final eligibility 与 manifest。redaction scan 必须包含 frozen pre-seal tree/staging。handoff/VETO/risk/issues 是工作投影，必须经审查，不能预填 verdict/signoff/risk acceptance。

7. **每个 P0 EV 如何回指？**

   final seal item -> matching index item -> same-run suite/case/report/digest -> concrete TC/DS/oracle -> AC/VF；derived CORE/RULE/DATA/NFR 也必须展开到 concrete refs。静态 JSON 或手写表不能独立宣告覆盖。

## 4. 当前文档问题诊断

| 旧 06 问题 | 影响 | 本步修正 |
|---|---|---|
| 证据写成 “trace / compare / regression” | 无路径、run、digest 或 owner | 固定 raw/report/index/seal/manifest 链 |
| audit、metrics、trace、evidence 混写 | 业务事实与测试证明互相替代 | 六类对象 authority 明确隔离 |
| 空 checkbox 就能表示通过 | 可伪造结果 | actual status 只由 verified artifact + 06 review 得出 |
| 没有 final seal 与 pre-index 区别 | derivation 可能被误作 eligible | 只有 passed release seal 提供 final eligibility |
| fixed acceptance files 可手改/直读 | mixed projection/race | manifest-last、double-read、captured bytes |
| “reviewed”隐含签署/风险接受 | 责任越权 | review explanation、risk acceptance、signoff 三者分离 |

## 5. 改动前后与裁决取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| Evidence ID | 泛化报告名 | candidate slot + fixed-run instance tuple | 稳定设计名且不伪造实例 |
| Eligibility | report 存在 | final seal closed precedence | checks/redaction 后才可资格化 |
| Acceptance files | 手工清单 | exact-byte manifest-bound working projection | 防 mixed/new-old 文件 |
| Review | 可改结论 | post-seal append-only explanation | machine truth 不回写 |
| Audit | 日志替代 | outcome/audit pair + domain facts | 业务追溯独立成立 |

## 6. 结构化中间产物

### 6.1 六类对象 authority

| Object class | Canonical examples | Owns | Must not own / replace |
|---|---|---|---|
| business truth/audit | `ToolInvocationOutcome`,`ToolAuditEntry`,evolution/binding fact,attempt/gap | L2 domain decision/history | test result、delivery/Observed、external body |
| telemetry | structured log、metric、span | safe diagnostic/operation/state/phase signal | outcome/audit、commit、readiness、evidence |
| machine test artifact | case/suite/journal/check/index/seal JSON | run-scoped test truth/provenance/final evidence eligibility | business truth、06 verdict/signoff |
| human report | `reports/runs/<run_id>/*.md` | readable projection of verified raw/seal | raw replacement、eligibility rewrite |
| acceptance working projection | four staging/fixed Markdown + manifest | source-bound handoff/VETO/risk/issues working set | verdict、signoff、risk acceptance、test truth |
| review/decision record | append-only review blocks；future acceptance decision/signatures | human explanation and authorized decision at 06 layer | machine eligibility rewrite、test fabrication |

### 6.2 Business audit and telemetry gate

| Gate | Through condition | Failure condition | Concrete TC / candidate | Fixed evidence direction | Impact |
|---|---|---|---|---|---|
| `EG-L2T-001` outcome/audit pair | accepted/no-execution terminal 与 `ToolAuditEntry` 经唯一 pair API 同 UoW；refs/actor/correlation/time 对称 | log/metric/ack 补 audit、half pair、duplicate second audit、body copied | `TC-L2T-OBS-004~005`,`TC-L2T-OUTCOME-001/003/007`; `EV-CAND-L2T-OBS-001`,`EV-CAND-L2T-OUTCOME-001` | `application-core`,`observability-redaction`,`transaction-concurrency` suite raw/reports + pair check | P0 hard |
| `EG-L2T-002` structured log | required operation/safe subject/state/error/phase/diagnostic refs；accepted only after confirmed commit | body/secret/stack/full ref；marker/Observed/delivery 推 accepted | `TC-L2T-OBS-001/005/008`; `EV-CAND-L2T-OBS-001` | `observability-redaction` raw/report + redaction check | P0 |
| `EG-L2T-003` metrics | only closed operation/result/error/state/freshness/port/view/count/duration labels | actor/subject/request/key/body/digest/endpoint/topic/credential/free text label | `TC-L2T-OBS-002/008`; `EV-CAND-L2T-OBS-001` | `artifacts/test/<run_id>/suites/observability-redaction/`; `reports/runs/<run_id>/suites/observability-redaction.md`; redaction/cardinality assertions | P0 |
| `EG-L2T-004` trace/span | TraceContext only from formal metadata；safe operation/phase attrs；span 不等 commit | random business identity、full payload、endpoint inference、cross-phase context fabrication | `TC-L2T-OBS-003/008`; `EV-CAND-L2T-OBS-001` | `artifacts/test/<run_id>/suites/observability-redaction/`; `reports/runs/<run_id>/suites/observability-redaction.md`; schema/redaction assertions | P0 |
| `EG-L2T-005` Query/Job observer | Query effects=0；Job only bounded report/projection/gap signal；observer failure cannot cancel/repair | inline write/refresh/repair、accepted/executed inference、observer drives result | `TC-L2T-OBS-006`; `EV-CAND-L2T-OBS-001` | raw under `observability-redaction`,`query-purity`,`entry-worker-job`; `reports/runs/<run_id>/suites/observability-redaction.md`,`query-purity.md`,`entry-worker-job.md`; effect journals | P0 hard |
| `EG-L2T-006` owner/status observation | Hub/Auth/Sandbox/Bus/Obs error/status/ref 分离；local pair/attempt immutable | status 覆盖 owner/local fact、fake/health/marker 升 readiness | `TC-L2T-OBS-007/009`; `EV-CAND-L2T-OBS-001` | raw under `observability-redaction`,`controlled-seam`; `reports/runs/<run_id>/suites/observability-redaction.md`,`controlled-seam.md`; blocker check | P0 local；positive conditional |

### 6.3 Raw artifact and human report gates

| Gate | Required object/path | Through condition | Failure condition / impact |
|---|---|---|---|
| `EG-L2T-007` run context | `artifacts/test/<run_id>/meta/context.json` | common schema/digest valid；`gate_id=release`,`config_profile=ci-test`；roots exact；11 suite/check refs closed；non-`latest` | missing/mismatch/cross-run=`invalid_artifact`; no formal entry |
| `EG-L2T-008` source/config/data/blocker | same-run `meta/source-status.json`,`meta/config-digest.json`,dataset/blocker refs | status/ref conditions valid；safe config digest only；source `not_available/uncommitted` not upgraded | fake commit/raw config/missing dataset/blocker digest blocks entry/eligibility |
| `EG-L2T-009` cases/journals | `suites/<suite>/cases/<tc_ref>.json`,`journals/*.json` | TC/DS/oracle/candidate refs exist；assertions closed；zero-effect shown by empty journal；schema/self-digest/redaction valid | derived TC、handwritten result、missing assertion/digest/safe failure makes item invalid/unavailable |
| `EG-L2T-010` suite artifact | `suites/<suite>/report.json`,redacted `stdout.log`,`stderr.log` | exact full denominator；case maps/digests equal；non-clean cannot pass；failure retained | missing stdout/stderr/case/report、hidden filter、failed deleted=`invalid_artifact` |
| `EG-L2T-011` human suite report | `reports/runs/<run_id>/suites/<suite>.md` | exact-byte digest bound；same-run raw case/suite refs；failure/blocked visible through safe refs | unpaired/cross-run/manual report不能支撑 evidence |
| `EG-L2T-012` 11 mandatory checks | `artifacts/test/<run_id>/checks/<check>.json` | release exact closed set，filename/identity/input digest/redaction/status valid；all passed for acceptable seal | missing/non-passed/non-clean/动态删减 blocks release；cannot risk-accept |

11 checks 的完整 identity 为：`check_case_manifest`、`check_dependency_boundary`、`check_profile_isolation`、`check_query_no_write`、`check_job_boundedness`、`check_phase_unknown_fence`、`check_outcome_audit_pair`、`check_redaction_boundary`、`check_blocker_truth`、`check_artifact_report_pairing`、`check_no_static_evidence`。

### 6.4 Index and final seal gates

| Gate | Through condition | Failure condition | Fixed path / decision |
|---|---|---|---|
| `EG-L2T-013` pre-check index | `generation_status=succeeded`; complete candidate set sorted/unique；每 item 回指 same-run concrete TC/suite/artifact/report/digest/AC/VF；`redaction_status=clean`; derivation status closed | item 写 `eligible`、读 checks/seal、cross-run merge、static mapping、generator/schema failed 后伪造 item | `artifacts/test/<run_id>/evidence-index.json`; trace only, never final eligibility |
| `EG-L2T-014` final release seal | common/self digest valid；matching context；11 suites + smoke + 11 checks；index digest；published manifest digest；redaction clean；`status=passed` | non-release/profile mismatch、single-suite/nightly、missing denominator/check、publication invalid、index failed、cross-run/digest mismatch | `artifacts/test/<run_id>/gate-summary.json`; only machine eligibility source |
| `EG-L2T-015` final eligibility item | slot set/order exactly index；source index digest equal；precedence `invalid > ineligible > unavailable > pending_review > eligible`; safe reason conditional | pre-index non-derived promoted；blocked/not-run marked eligible；pending review erased；invalid publish leaves eligible | seal `evidence_eligibility`; eligible is necessary, not sufficient for AC pass |
| `EG-L2T-016` no cross-run/static evidence | one release run/profile only；candidate instance tuple includes run/slot/suite/TC/artifact digest；no `latest` | cherry-pick multiple runs、health/endpoint/fake/open blocker/static JSON/old fixed file promoted | no-static/pair/blocker checks；failure P0/VETO candidate |

### 6.5 Planned candidate slot registry and acceptance consumer

每个 release index 与 final seal 都必须包含以下 30 个唯一 slot，按 slot 升序排列。表中 report 均位于 `reports/runs/<run_id>/suites/`；derived slot 必须展开同 run concrete sources，不能产生 `TC-L2T-CORE/RULE/DATA/NFR-*`。

| Candidate slot | Concrete source / owning report | AC / VF consumer | Eligibility gate |
|---|---|---|---|
| `EV-CAND-L2T-CORE-001` | selected existing core TC refs；`local-closure.md` + referenced owning reports | `AC-L2T-001~005`;`VF-L2T-001` | selected refs all eligible；aggregate does not copy cases |
| `EV-CAND-L2T-FOUNDATION-001` | `FOUNDATION-001~018`;`contract-domain.md` | `AC-L2T-024~033`;`VF-L2T-002/008` | full family + redaction/schema valid |
| `EV-CAND-L2T-CONTRACT-001` | `CONTRACT-001~008`;`application-core.md` | `AC-L2T-006~008`;`VF-L2T-002/011` | positive/negative/replay/terminal complete |
| `EV-CAND-L2T-BIND-001` | `BIND-001~008`,`CONSUMER-001`;`application-core.md`,`entry-worker-job.md`,`controlled-seam.md` | `AC-L2T-009~011`;`VF-L2T-003/005` | local/negative eligible；provider positive remains residual |
| `EV-CAND-L2T-INV-001` | `INV-001~008`;`application-core.md` | `AC-L2T-012~014`;`VF-L2T-004` | canonical carrier parity and no-execution complete |
| `EV-CAND-L2T-PRE-001` | `PRE-001~010`;`application-core.md`,`controlled-seam.md` | `AC-L2T-015~018`;`VF-L2T-005/006` | local/fail-closed/phase complete；positive blocked separate |
| `EV-CAND-L2T-OUTCOME-001` | `OUTCOME-001~010`;`application-core.md`,`transaction-concurrency.md` | `AC-L2T-019~022`;`VF-L2T-007/009/011` | pair/XOR/source/late/status complete |
| `EV-CAND-L2T-HANDOFF-001` | `HANDOFF-001~008`,`CONT-001~004`;`application-core.md`,`entry-worker-job.md` | `AC-L2T-022/029`;`VF-L2T-006~009` | four gates + local attempt/unknown complete |
| `EV-CAND-L2T-QUERY-001` | `QUERY-001~011`;`query-purity.md` | `AC-L2T-023~025`;`VF-L2T-009` | all queries and zero-effect check eligible |
| `EV-CAND-L2T-CONSUMER-001` | `CONSUMER-001~005`;`entry-worker-job.md` | `AC-L2T-018/021/029`;`VF-L2T-006/009` | claim/source/receipt/re-entry complete |
| `EV-CAND-L2T-CONT-001` | `CONT-001~004`;`entry-worker-job.md` | `AC-L2T-022/029` | four event continuations + no second call complete |
| `EV-CAND-L2T-JOB-001` | `JOB-001~004`;`entry-worker-job.md` | `AC-L2T-023/025/031`;`VF-L2T-009` | bounded/no-repair/report/replay complete |
| `EV-CAND-L2T-STATE-001` | `STATE-001~012`;`contract-domain.md`,`transaction-concurrency.md` | `AC-L2T-024~026`;`VF-L2T-011` | six families, illegal/late/phase labels complete |
| `EV-CAND-L2T-TX-001` | `TX-001~010`;`transaction-concurrency.md` | `AC-L2T-024/038`;`VF-L2T-007/011` | UoW/pair/commit/report effects complete |
| `EV-CAND-L2T-CONC-001` | `CONC-001~023`;`transaction-concurrency.md` | `AC-L2T-038`;`VF-L2T-011` | replay/CAS/unknown/late/watermark complete |
| `EV-CAND-L2T-ERR-001` | `ERR-001~012`;`transaction-concurrency.md` | `AC-L2T-020/038` | typed errors and recovery owner complete |
| `EV-CAND-L2T-CFG-001` | aggregate concrete CFG refs；`config-validator.md`,`config-assembly.md` | `AC-L2T-024~028`;`VF-L2T-005/012` | aggregate only; all four subfamilies traceable |
| `EV-CAND-L2T-CFG-T-001` | `CFG-T-001~012`;`config-validator.md`,`config-assembly.md` | `AC-L2T-024~028`; related VF | type/source/profile validator complete |
| `EV-CAND-L2T-CFG-A-001` | `CFG-A-001~010`;`config-validator.md`,`config-assembly.md` | `AC-L2T-024~028`; related VF | assembly candidate/adapter boundary complete |
| `EV-CAND-L2T-CFG-F-001` | `CFG-F-001~020`;`config-validator.md`,`config-assembly.md` | `AC-L2T-024~028`; related VF | fail-fast/builder/no-partial complete |
| `EV-CAND-L2T-CFG-X-001` | `CFG-X-001~012`;`config-validator.md`,`config-assembly.md` | `AC-L2T-024~028`; related VF | cross-field/redline/override complete |
| `EV-CAND-L2T-OBS-001` | `OBS-001~009`;`observability-redaction.md` | `AC-L2T-021/029/033/039`;`VF-L2T-007~009` | safe signal/pair/status/redaction/parity complete |
| `EV-CAND-L2T-RULE-001` | derived from mapped concrete boundary cases；`static-boundary.md` + owning reports | `AC-L2T-024~029` | all referenced concrete items eligible；no standalone case |
| `EV-CAND-L2T-DATA-001` | derived field/ref/body cases；`observability-redaction.md`,`static-boundary.md` + owning reports | `AC-L2T-030~033` | DR coverage and all-surface scan clean |
| `EV-CAND-L2T-NFR-AVAIL-001` | §10 mapped concrete `PRE/OUTCOME/HANDOFF/QUERY/CONSUMER/JOB/ERR/OBS`; relevant reports | `AC-L2T-034~035` | structural sources eligible；no numeric/provider promotion |
| `EV-CAND-L2T-NFR-SEC-001` | mapped `FOUNDATION/PRE/HANDOFF/CFG/OBS/VETO`; security reports/checks | `AC-L2T-036`; related VF | redaction/dependency/blocker checks passed |
| `EV-CAND-L2T-NFR-AUDIT-001` | mapped `OUTCOME/HANDOFF/CONSUMER/CONT/OBS`; relevant reports | `AC-L2T-037` | pair/source/time-point trace complete |
| `EV-CAND-L2T-NFR-CONS-001` | mapped `STATE/TX/CONC/ERR` and adjacent cases；relevant reports | `AC-L2T-038`; related VF | one winner/replay/unknown/late complete |
| `EV-CAND-L2T-NFR-OBS-001` | mapped `FOUNDATION/OUTCOME/HANDOFF/QUERY/CONSUMER/JOB/OBS/VETO`; relevant reports | `AC-L2T-039`; related VF | local safe observability complete；route readiness separate |
| `EV-CAND-L2T-VETO-001` | `VETO-001~013` + mapped 25 NC；`static-boundary.md` + owning reports/checks | `VF-L2T-001~013` | every VF has traceable non-trigger result; any trigger ineligible |

`EG-L2T-017` candidate registry gate 通过条件：index/seal slot set 恰等于以上 30 项，所有 item 都有完整 source linkage；required P0 item 的最终状态在 formal exit 时必须为 `eligible`。`pending_review` 仅可进入人工审查，`ineligible/unavailable/invalid` 均不能支撑对应 AC/VF closure。

### 6.6 Acceptance projection and manifest gates

| Gate | Required surface | Through condition | Failure condition / impact |
|---|---|---|---|
| `EG-L2T-018` staging set | `reports/runs/<run_id>/acceptance-draft/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | exactly four；front matter schema/run/index ref+digest/set key 一致；pre-seal generated and frozen before checks；all included in redaction scan | reads seal/final reports、prefills verdict/signoff/accepted risk、missing/mixed file => invalid projection |
| `EG-L2T-019` publisher/lock | `.projection.lock` held exclusively/non-blocking from first fixed replace through seal write；same-directory temp + replace | one release writer；lock descriptor actually held；failure returns invalid and does not fall back old fixed view | file existence treated as lock、wait/concurrent publish、partial view claimed usable => release integrity failure |
| `EG-L2T-020` manifest | `reports/acceptance/projection-manifest.json` closed schema/self-digest；same source run/index；exactly four ordered roles/paths/digests；written last | schema/digest/path/order/tuple mismatch、manifest absent、unknown field => whole fixed projection invalid | manifest is publication marker only, not gate status/eligibility/signoff |
| `EG-L2T-021` snapshot consumer | read M1 -> capture matching seal/index/four staging+fixed bytes/front matter -> read M2；digests equal；then only captured bytes | reopen mutable paths、M1/M2 drift、staging/fixed byte mismatch、old manifest fallback | pause/invalid evidence; new release run required |
| `EG-L2T-022` passed seal + projection | seal `status=passed`, `acceptance_projection_status=published`, manifest ref/digest exact；manifest does not reference seal | published files without seal、passed seal without valid projection、cycle seal->projection->seal | no formal evidence entry |

### 6.7 Handoff, VETO, risk, issues and review gates

| Surface | Fixed path / provenance | Through condition | Failure / authority boundary |
|---|---|---|---|
| acceptance handoff | `reports/acceptance/handoff.md` exact staging copy + matching manifest/seal | scope/baseline/run/index/blocker/residual refs complete；review block records inspected/disputed/follow-up | draft alone not reviewed；does not declare acceptance verdict/signoff |
| VETO checklist | `reports/acceptance/veto-checklist.md` | all `VF-L2T-001~013` and concrete VETO/NC refs present；06 review consumes final seal results | pre-seal draft cannot infer check result；missing VF blocks closure |
| risk proposal | `reports/acceptance/risk-acceptance.md` | residual proposal fields complete and matched to Step 13 review | projection is not accepted risk；no acceptor/signature/deadline => cannot conditional pass |
| open issues | `reports/acceptance/open-issues.md` | blocker/residual/failed/unavailable/pending item refs complete；none silently closed | omission or historical overwrite blocks handoff; not a defect authority by itself |
| review blocks | `reports/review/reviewer-notes.md`,`agent-review.md` source-tuple append blocks | schema/block ID/run/index/seal digest/role/time/disposition valid；correction uses supersedes ID；safe/redacted | may explain/supplement/dispute only；cannot change seal eligibility, sign risk or fabricate execution |

`EG-L2T-023` acceptance handoff gate 要求以上四个 fixed projection 文件与 matching review source tuple 均可验证、所有 `pending_review` 有 authorized disposition，且 Step 13/14 的风险接受和签署记录独立完成。否则交接不完整或其映射门禁保持 pending，不得用“Agent 已审查”替代证据。

### 6.8 Acyclic writer and reader order

```text
metadata
  -> case / journal / redacted stdout+stderr / suite report
  -> pre-index human suite reports
  -> evidence-index.json (derivation only)
  -> evidence pages + four run-scoped acceptance staging files
  -> non-redaction checks
  -> final redaction check over frozen pre-seal tree
  -> locked four fixed-file replacements
  -> projection-manifest.json last
  -> gate-summary.json final seal binds index + manifest
  -> safe final human projections
  -> append-only review records
  -> 06 AC/VF/defect/risk/signoff decision
```

`EG-L2T-024` acyclic order gate：seal 不得成为其引用的 suite/report/index/check/staging/manifest 输入；manifest 不得含 seal digest/status/eligibility；review/06 decision 不得回写 seal/index/projection。任何环、post-seal 数据反灌、raw diagnostic 进入 post-seal safe projection均为 evidence integrity failure。

### 6.9 Evidence/report 停审记录

停审维度固定为：`S` schema/path/self-digest；`P` provenance/same-run pairing；`O` oracle/AC/VF linkage；`R` redaction/safe output；`C` cycle/authority boundary。`pass` 是设计停审，不是 evidence instance 或测试结果。

| Gate set | S | P | O | R | C | 停审结论 |
|---|---:|---:|---:|---:|---:|---|
| `EG-L2T-001~006` business audit/telemetry（6 项逐项） | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 pass |
| `EG-L2T-007~012` raw/report/check（6 项逐项） | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 pass |
| `EG-L2T-013~017` index/seal/registry（5 项逐项） | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 pass |
| `EG-L2T-018~022` staging/publisher/manifest/snapshot（5 项逐项） | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 pass |
| `EG-L2T-023~024` handoff/review/acyclic（2 项逐项） | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 pass |

总计 24/24；candidate registry 为 30/30。当前没有实际 artifact、run、seal、manifest、review 或 verdict，所有未来实例状态仍 `not_entered`。

### 6.10 跨证据裁决审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Business audit vs telemetry | pass | `ToolAuditEntry`/fact/pair 不由 log/metric/span 替代；telemetry safe-only |
| Telemetry vs evidence | pass | log/metric/trace 不进入 final eligibility，只有 raw/report/check schema 能进入 evidence chain |
| Raw/report pairing | pass | same run/profile/path/digest；失败、blocked、cancelled 不删除 |
| Candidate registry | pass | 30 slots 连续覆盖 concrete families、derived groups、NFR、VETO；derived 不造 TC |
| Index vs final seal | pass | index 只有 derivation；seal 才有 `L2EvidenceStatus`，slot/order/digest 一致 |
| Seal vs projection manifest | pass | release seal 绑定 manifest，但 manifest 不反向引用 seal，writer order 无环 |
| Fixed projection snapshot | pass | M1/capture/M2、exact bytes、manifest-last；不 reopen mutable path，不 fallback old set |
| Acceptance staging | pass | pre-seal、四文件、redaction denominator；不写 verdict/signoff/accepted risk |
| Review blocks | pass | append-only safe explanation；不能改 machine status/digest 或替代 evidence |
| Redaction coverage | pass | raw/case/journal/stdout/stderr/report/staging/fixed/review 的 safe boundary 明确 |
| Static evidence | pass | no handwritten EV/health/endpoint/open blocker promotion；check required |
| P0 denominator | pass | release 11 owning suites + smoke + exact 11 checks；no hidden filter/cross-run cherry-pick |
| Missing/unavailable | pass | applicable P0 missing => invalid/unavailable/not_entered；P1 future only residual/conditional |
| VETO/risk/signoff | pass | VETO cannot risk-accept；risk acceptance and signoff deferred to Steps 13/14 |
| Upstream blockers | pass | `L2T-UP-001~009` remain open; no new blocker; no readiness/delivery/Observed claims |

### 6.11 旧材料与路径冲突审计

| Historical material / conflict | Current handling |
|---|---|
| old `06` “audit replay/trace compare” | historical only；must use business pair + fixed evidence chain |
| old README / report paths | historical only；no `reports/<project>` or project-nested raw |
| static `EV-CAND-*` or hand-written JSON | candidate/planned only；`check_no_static_evidence` blocks promotion |
| fixed Markdown without manifest | invalid working projection；no fallback to previous files |
| global matrix optional `L0-sdk` dependency wording | historical conflict; current formal 00/01/03 future/excluded boundary wins |

## 7. 回填草稿

正式 §10 应包含：business audit/telemetry distinction；P0 evidence/report/check gates；complete candidate registry；pre-index/final seal/manifest precedence；four-file snapshot and review/handoff rules；acyclic writer order；evidence stop-review and cross-evidence audit. 正文必须声明实际 `run_id`、digest、eligibility、review、verdict 和 signoff 当前均未绑定，不能由 candidate slot 或 draft projection 推导。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| actual release run/seal/index/manifest | future evidence eligibility | 当前不存在；Step 3 baseline remains `not_bound` |
| acceptance review roles and review blocks | pending_review closure | Steps 13/14 define authority; no names/signatures invented |
| evidence retention/deletion policy | artifact lifecycle | `L2T-RR-013`; no deletion or retention result claimed |
| external producer/route/observability readiness | positive qualification | `L2T-UP-004~007`; local safe handoff only |

无新增上游 blocker。

## 9. 进入下一步条件

- [x] 业务 audit、telemetry、测试 raw/report、acceptance projection、review/decision authority 分离。
- [x] 24/24 evidence/report gates 和 30/30 candidate slots 已逐项停审。
- [x] release final seal 是唯一 eligibility source；index、manifest、draft、review 均无越权。
- [x] raw/report/check/redaction/static/pairing/blocked truth 和 same-run snapshot 可复验。
- [x] 跨证据审计无 orphan、静态造证据、路径漂移、环依赖或 risk/signoff 越权。
- [x] 允许进入 Step 11：一票否决项。
