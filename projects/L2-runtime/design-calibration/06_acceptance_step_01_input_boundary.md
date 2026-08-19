# L2-runtime 06 验收标准 Step 1：验收输入边界

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填位置：正式 `06-验收标准.md` §1
> 状态：`completed_continuous_authorized`
> 输入模式：current formal sources first；旧正式 06 仅作后置污染审计
> 事实边界：本 Step 不生成送验 baseline、evidence、verdict、signoff 或 readiness

## 1. 本步目标与输入

本步确认 06 能消费什么、必须裁决什么、不得重新定义什么，以及哪些开放项不阻塞裁决合同设计但阻塞实际验收进入或正向结论。

| Input | Authority/status | Step 1 use | Not inherited as fact |
|---|---|---|---|
| current standards + acceptance SOP/writing spec | normative | 15-Step、15章、三值 verdict、证据与风险规则 | legacy standard wording |
| formal `00-需求文档.md` | current requirement truth | 20 core/4 peripheral FR、44 BR、19 NFR、36 AC、8 VF、owner/data boundary | test result、acceptance result |
| formal `01-架构设计.md` | current architecture truth | bounded context、依赖方向、local-first、owner/redline | deployment/implementation readiness |
| formal `02-概要设计.md` | current overview truth | 8 business parts、5 technical layers、flow/object/API/state outline | detailed field/protocol override |
| formal `03-详细设计.md` | current implementation contract | 7 crates、12 CAP、objects/Ports、17/12/6/6/7、31 SM、UoW/error/replay/observation | actual code existence or pass |
| formal `04-配置设计.md` | current config contract | strict JSON、4 env、4 entry、12/153/39、13 slots、7 jobs、V0~V12、cold replacement | selected products、environment readiness |
| formal `05-测试方案.md` + registry | current evidence-generation contract | 37 CUT、172+5、8 suites、9 checks、M0~M5、DTO/path/status、G0~G3、blocker/risk handoff | registry/planned EV as actual evidence |
| upstream formal chains/ledgers | owner seam truth | Tools/Hub/Method/Sandbox/Obs/Core/Bus/SDK/Gov/Artifact contract and blocker applicability | owner implementation/qualification beyond formal fact |
| delivery/build/run/report package | required future acceptance input | must form fixed baseline tuple before review | currently absent; no invented ID |
| old formal 06 + old calibration | historical_material | detect stale identity, denominator, path, verdict contamination | 18 states、109 EV、old TC/suites、13-risk set |

## 2. SOP 问题回答

| SOP question | Current answer | Authority |
|---|---|---|
| 本轮依据哪些需求和设计 | only current formal Runtime 00~05 plus current owner contracts and standards | source precedence in formal 05 §1 |
| 哪些测试证据支撑裁决 | future M3 evidence instances mechanically derived from one fixed run's valid case artifact + owning suite report + required checks; reviewed M4/M5 handoff | formal 05 §13 |
| 哪些交付版本/环境/数据成为基线 | future exact implementation revision/workspace status/build identity, formal config snapshot pair, source/case/selector/blocker manifests, fixture/seed/fault digests and fixed run | formal 05 §§7~13 |
| 什么不写入 06 | test-case invention, implementation plan, deployment steps, test execution log, owner contract redefinition | acceptance SOP boundaries |
| 是否存在阻塞生成的缺口 | no blocker prevents complete design of decision contract; all actual baseline/run/evidence are absent, so actual review remains `not_entered` | formal 05 §§12~14 |

## 3. 验收标准必须回答 / 不再回答

| Must decide in 06 | Must not re-decide in 06 |
|---|---|
| a fixed candidate是否满足每个适用 `AC-L2R-001~036` | Runtime requirements, crate/layer/object/Port/protocol/state/config design |
| each `VF-L2R-001~008` is not_triggered/triggered/not_evaluable and its global effect | new VF, state, protocol, test case, EV ID or threshold |
| evidence instance/paths/digests/status/review are eligible for acceptance | how runner/fake/repository/adapter is implemented |
| G1/G2/G3 scope and blocked positive seam effect on a named candidate | external owner truth, adapter qualification or readiness by inference |
| defect closure, risk eligibility/acceptance, condition manifest and expiry | accepting S/A/VF or missing evidence to meet schedule |
| verdict and signoff roles for one immutable decision package | fabricate signer, date, risk acceptance or current verdict |

## 4. Dependency classification and owner boundary

| Owner/seam | Dependency type | Acceptance checks | What cannot be accepted locally |
|---|---|---|---|
| `L0-core` | compile candidate | exact source/version/contract compatibility; only allowed compile candidate | unverified binding or shadow schema |
| `L0-bus` | event | stored immutable event, publish/replay/receipt posture and gap | delivery/Observed/exactly-once without owner evidence |
| `L0-sdk` | downstream ref | public DTO/compatibility reference where in scope | Runtime reverse package dependency or SDK readiness |
| `L2-tools` | runtime/adapter | canonical request, five guards, record-before-call, finite result/reconcile | tool execution/Sandbox cleanup truth from local fake |
| Capability Hub | runtime/ref | identity/exposure/descriptor safe-view contract | registry/formal exposure/provider adapter truth ownership |
| Method Library | ref/runtime | body-free definition/source ref/version/freshness | method body/source or dirty workspace as immutable baseline |
| Governance | runtime/ref | effective decision/policy safe view and fail-closed use | approval/policy truth creation or acceptance by Runtime |
| Sandbox | runtime via Tools | zero direct Runtime Port/host fallback; positive owner evidence when available | isolation/execution/cleanup from design or fake |
| Observability | event/runtime handoff | body-free candidate/attempt/gap and redaction; independent positive evidence | backend/Observed/audit/evidence truth from local carrier |
| model/memory/checkpoint/child/handoff/projection | adapter/runtime | provider-neutral refs, finite posture, fence, owner-specific G2/G3 evidence | route/secret/quota/cost/body/member/container/backend truth |
| Artifact/product/member/marketplace | ref/out-of-scope | typed ref + forbidden-boundary checks | body/lineage/evidence/verdict/container/image/listing ownership |

## 5. Continuous blocker and current acceptance posture

| Blocker/preflight | Blocks | Does not block | Current acceptance posture |
|---|---|---|---|
| `L2R-UP-001~003` | real Tools/Sandbox action, receipt/feedback/cleanup and shared schema qualification | local canonical request/guard/record/fence/fail-closed gate design | positive lane `not_evaluable/blocked_dependency` until owner facts |
| `L2R-UP-004` | real model materializer/decision/provider qualification | provider-neutral local semantics and finite fake | no provider readiness verdict |
| `L2R-UP-005` | durable memory lifecycle qualification | working memory/ref/candidate/gap semantics | no durable write/delete verdict |
| `L2R-UP-006~007` | exact shared routes/schemas and real Sandbox/Obs qualification | local types, event store, spies and redaction | no delivery/Observed/backend readiness |
| `L2R-UP-008` | immutable Method Library provenance | current dirty workspace source disclosure | baseline cannot be claimed immutable |
| `L2R-CP-001` | physical checkpoint durability/resume qualification | Prepared/Unknown split and local fence tests | no physically Committed/resumable verdict |
| `L2R-ENTRY-001` | production actor/scope/member entry composition | typed fixtures and authority-before-existence | no production entry/member lifecycle verdict |
| `L2R-IMPL-001` | all actual local execution/evidence | complete design of implementation/acceptance contracts | acceptance process remains `not_entered` |
| `L2R-LANG-001` | toolchain/product preflight and runnable implementation | planned Rust 2024/1.93 contract review | no build/toolchain readiness |

## 6. Current source precedence and historical pollution audit

```text
current standards
  -> Runtime formal 00 -> 01 -> 02 -> 03 -> 04 -> 05
  -> current owner seam contract / blocker fact
  -> one future immutable delivery + run + evidence package
  -> formal 06 decision rules
```

| Historical contamination | Current rule |
|---|---|
| 18 state subjects | reject; current denominator is SM-01~31 |
| 109 candidate EV slots | reject; current registry is 177 explicit TC/EV pairs |
| old `TC-CMD/QRY/INE/OUT/JOB-*` | reject; current IDs are `TC-Cxx/Qxx/Exx/Oxx/Jxx-001` plus canonical families |
| old suite/report names | reject; current eight suites and fixed report DTO/path apply |
| `RR-001~013` only | reject; current risk inventory is `L2R-RR-001~014` |
| static table/design/fake/ping as evidence | reject; planned M0 remains non-evidence |
| current “通过/有条件通过/不通过” | reject; process is `not_entered`, no decision package exists |

## 7. 回填草稿

正式 §1 应列出 current formal 00~05、owner seams、future delivery/evidence package 的消费关系，明确 dependency six-type acceptance surface、continuous blockers and fail-closed posture，并声明 old 06 只作 historical audit。当前 06 只定义未来 decision contract；没有 actual baseline/run/evidence/verdict。

## 8. Step 1 stop-review

| Audit | Result |
|---|---|
| current formal inputs | 00~05 roles and non-inheritance boundaries explicit |
| test/evidence boundary | 177 planned identities separated from future M3 instances |
| dependency types | compile/runtime/event/ref/adapter/fake explicit |
| blocker transmission | 12 rows retained without readiness promotion |
| historical pollution | 18-state/109-EV/legacy TC/suite/risk/verdict rejected |
| actual acceptance facts | none; process remains not_entered |

```text
step_status = completed_continuous_authorized
actual_baseline_run_evidence = 0
actual_verdict_signoff_readiness = 0
next_step = Step 2
formal_06_write_allowed = false_until_step_15
```
