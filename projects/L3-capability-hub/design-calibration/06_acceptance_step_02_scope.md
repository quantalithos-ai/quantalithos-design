# L3-capability-hub 06 验收标准 Step 2: 明确验收目标与范围

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/验收标准书写规范.md` §5.2
> 回填章节: `06-验收标准.md` §2
> Step 状态: `completed-designed / continuous execution`
> 日期: 2026-07-25

---

## 1. 本步目标、输入与边界

### 1.1 目标

把formal 00和formal 05中的scope、P0/P1/P2、AC/VF与non-scope转成验收裁决范围，明确核心语义、selected product、release handoff和production readiness在最终结论中的不同地位。

### 1.2 Inputs

| Input | Exact scope material |
|---|---|
| Step 1 | authority、must-answer/non-answer、future baseline facts |
| formal 00 §§2~3,14~15 | 5 closures、core/peripheral scope、37 AC、13 VF、non-goals |
| formal 01 | Hub bounded ownership and adjacent-system seams |
| formal 02~04 | component/object/flow/state/config and selected-product boundaries |
| formal 05 §2 | 12 test goals、P0/P1/P2、scope/non-scope、veto direction |
| formal 05 §§12~14 | P0/selected/release exit、EV consumers、regression/risk applicability |

### 1.3 This Step does not do

- 不固定真实baseline/run/environment；
- 不分配具体acceptance gate row或pass/fail条件；
- 不把selected product、release或operations scope声称为ready；
- 不填写verdict、risk acceptance或signoff。

## 2. SOP six-question answers

| Question | Closed answer |
|---|---|
| 1. 核心裁决目标？ | 裁决Capability Hub能否作为capability access truth owner闭合identity、registry、descriptor、governance/method seams、formal exposure/trace/consumer boundary，并用可验证证据阻断13个VF。 |
| 2. P0/P1/P2如何划分？ | P0为product-neutral formal semantics、full canonical denominator、config/observation/evidence integrity；P1为selected durable/adapter/source/route/TLS/observer parity；P2为production capacity/SLO/multi-region/dynamic controls/advanced discovery等future operations/evolution。 |
| 3. 哪些下游只验接缝？ | governance、method-library、runtime/tools、SDK、marketplace、provider/secret、observability/audit、external collaboration只验typed ref/safe summary/Port/event/no-write/no-body/no-owner-leak；不验其内部truth。 |
| 4. 哪些非范围影响结论？ | P0外部owner功能缺失本身不失败；若Hub吸收责任则VF。P1 unavailable不影响P0 semantic verdict但阻断selected claim；release manifest要求的P1 unavailable阻断release handoff；P2缺失不影响当前P0/release，必须显示为not claimed。 |
| 5. 哪些范围可能一票否决？ | 五个closure断裂、identity/registry替代、descriptor material、approval/method ownership、reverse writes、incomplete exposure、trace/winner/forbidden data/dependency/historical leakage，完整对应VF-001..013。 |
| 6. 哪些范围必须用DDD正式名？ | 所有43+7 objects/helpers、250 protocols、36 Ports、22/110 repositories、83 C/Q/I/O/J flows、24/111/638 states、TX01..22、BIND01..12、OBS01..12、CFG-F01..18及typed error/profile/entry；禁止generic “功能正常”。 |

## 3. Diagnosis and scope choices

### 3.1 Historical diagnosis

| Historical scope | Why invalid now | Active replacement |
|---|---|---|
| MCP/A2A registration objects | source type replaced identity truth | identity + registry closure |
| Provider contract/KMS | merges descriptor and secret platform | body-free descriptor + secret ref boundary |
| allow/deny decision refresh | merges governance/runtime enforcement | governance result seam + formal exposure prerequisite |
| cost/audit mainline | cost/execution/audit store outside Hub | trace/capture/body-free audit ref and no ownership |
| metadata/lookup views | may become second truth | controlled views with exact source/freshness/no-write |
| staging product E2E | product facts unselected | P0 controlled semantics + separately scoped P1 parity |

### 3.2 Scope decision table

| Issue | Decision | Reason |
|---|---|---|
| Are all 37 AC P0 adjudication directions? | yes；each must get a conclusion under an applicable manifest | formal 00 owns all AC；022/028 adjudicate peripheral non-pollution, not feature delivery |
| Does absent peripheral feature pass automatically? | no automatic pass；requires scope manifest + absence/no-owner/no-effect evidence | absence must not hide a partial or leaking implementation |
| Does selected product parity gate P0? | no | product-neutral P0 semantic denominator is separately closed |
| Can release omit a required selected dependency? | no, when immutable release manifest declares it required | unavailable is blocked, not not-applicable |
| Does lack of numeric SLO fail AC-033? | numeric part remains not-evaluated；structural performance invariants remain blocking | no sourced numeric target exists |
| Does formal 06 claim production readiness? | no | formal 09/selected operations evidence absent |

## 4. Acceptance goals

| Goal ID | Priority | Adjudication goal | Requirement direction |
|---|---|---|---|
| `A-GOAL-CH-01` | P0 | stable capability identity is unique, explicit and non-substitutable | AC001/006~008;VF001/002/010 |
| `A-GOAL-CH-02` | P0 | registry lifecycle/visibility remains the controlled directory truth | AC002/009~011;VF001/003/010 |
| `A-GOAL-CH-03` | P0 | adapter descriptor and safe summaries are body-free and do not own provider/secret truth | AC003/012~014/032/035;VF004/011 |
| `A-GOAL-CH-04` | P0 | governance seam and access review remain distinct from approval/Policy | AC004/015/016/027;VF005/009 |
| `A-GOAL-CH-05` | P0 | method relation remains body-free and does not import definition ownership | AC004/017/031/032;VF006/012 |
| `A-GOAL-CH-06` | P0 | formal exposure/visibility/consumer view is source-symmetric and incomplete capability is never consumable | AC005/019/020;VF007/008 |
| `A-GOAL-CH-07` | P0 | change/impact/trace/capture and derived outputs are explainable and non-authoritative | AC018/021/025/027/030/036/037;VF007/009 |
| `A-GOAL-CH-08` | P0 | exact flows/states/UoW/idempotency/race/recovery preserve one truth | AC023~025/029/036;VF007/010 |
| `A-GOAL-CH-09` | P0 | config/profile/entry/assembly fail closed with no fallback/partial root | AC023~027/034/035;VF004/011/012 |
| `A-GOAL-CH-10` | P0 | dependency、Rustdoc、redaction、observation and evidence provenance satisfy all static/runtime redlines | AC026/032/035~037;VF011~013 |
| `A-GOAL-CH-11` | boundary P0 | absent or implemented peripheral enhancements cannot change core truth | AC022/028;VF007/010/011/013 |
| `A-GOAL-CH-12` | P1/R4 | selected product and release handoff add parity/evidence confidence without compensating P0 | formal 05 §§8/12/14 |

## 5. Four-layer acceptance scope

| Scope layer | What is adjudicated | Required result semantics | Not claimed |
|---|---|---|---|
| `SCOPE-CH-P0-SEMANTIC` | formal 00~05 product-neutral contract including all 37 AC and 13 VF | all applicable P0 gates passed, all VF negative, denominator/evidence complete | selected product or release readiness |
| `SCOPE-CH-P1-SELECTED` | immutable selected durable/external/source/route/TLS/observer parity subset | passed or explicitly blocked/failed per selected manifest | P0 substitute |
| `SCOPE-CH-R4-RELEASE` | compatible P0 + release-required selected refs + smoke/check/report/review handoff | release handoff eligible or blocked/noneligible | final production deployment or self-signoff |
| `SCOPE-CH-P2-OPERATIONS` | capacity/SLO/retention/backend/multi-region/dynamic controls/advanced features | future/not claimed unless later formal sources and evidence exist | current acceptance pass condition |

## 6. P0 scope matrix

| Scope ID | Acceptance subject | Exact inventory / source | Adjudication objective | Outside subject |
|---|---|---|---|---|
| `AS-CH-P0-01` | five core closures | C-CH-1..5;AC001..005 | every closure has complete object/flow/state/evidence chain | external implementation internals |
| `AS-CH-P0-02` | functional capability | FR001..016;AC006..021 | each FR's declared result and prohibited substitution/effect are proven | peripheral feature completion |
| `AS-CH-P0-03` | peripheral non-pollution | FR-E01..E07;BR-E001;AC022/028 | absent or present feature never changes core truth/ownership | feature UX/capacity/product quality |
| `AS-CH-P0-04` | business rules | BR001..037;AC023..027 | invariant、forbidden owner、explicit mutation、adjacent boundary and trace rules hold | redefining BR |
| `AS-CH-P0-05` | data ownership | AC029..032 | truth/snapshot/ref/forbidden-body classes remain distinct | external body lifecycle |
| `AS-CH-P0-06` | public/static surface | 7 modules、43+7 objects、250 protocols、36 Ports | exact inventory/dependency/schema/Rustdoc rules | implementation naming beyond formal contract |
| `AS-CH-P0-07` | application flows | 26 C + 33 Q + 6 I + 10 O + 8 J | every flow's typed terminal/effect/no-effect/phase owner holds | external event delivery internals |
| `AS-CH-P0-08` | state/consistency | 24 families/111 variants/638 pairs、TX01..22 | current/reserved/illegal、UoW、winner、replay、Unknown、A/B/C、Job reentry hold | DB engine-specific internals |
| `AS-CH-P0-09` | config/binding | BIND01..12、CFG-F01..18、18/27/21 catalog、3 profiles/entries | strict source/graph/cardinality/material/activation/failure/frozen-root rules | selected product config values |
| `AS-CH-P0-10` | NFR structural | NFR001..020;AC033..037 | six specialties' structural/zero-effect/security/observation gates pass | invented numeric target |
| `AS-CH-P0-11` | automation/evidence | 189 TC/DS/EV、10 suites、main denominator、9 checks、fixed roots | complete same-run raw-derived/redacted/paired/nonstatic evidence | design-time files as evidence |
| `AS-CH-P0-12` | defect/regression | S/A/B classes、R0~R4、13 surfaces、12 full triggers | no S/P0-A/open blocker；required retest scope complete | fake closure/waiver |

## 7. Adjacent-system seam scope

| Adjacent owner | Hub acceptance can adjudicate | Hub acceptance cannot adjudicate | Failure impact |
|---|---|---|---|
| `L1-governance` | typed result ref/state/safe summary、seam relation、access-review separation、unavailable behavior | approval、Policy、shared rules、workflow decision truth | ownership or review substitution triggers VF005 |
| `L3-method-library` | typed asset ref/body-free relation/family mismatch/unavailable | method body/source/publication/execution lifecycle | body/source ownership triggers VF006 |
| runtime/tools | formal exposure/controlled view/consumer ref/impact feedback boundary | invocation、tool result、route/quota/enforcement | reverse write/execution ownership triggers VF007 |
| `L0-sdk` | server exposure boundary and SDK consumer ref | package/client/cache/binding/release truth | client/cache ownership triggers VF007/012 |
| marketplace | optional body-free ecosystem summary/ref | listing/ranking/pricing/transaction/fulfillment | local listing/transaction truth triggers VF011 |
| provider/secret platform | typed descriptor boundary、opaque refs、safe failure | route/cost/failover/quota/runtime body、secret value/lifecycle | body/runtime truth triggers VF004/011 |
| observability/audit | exact safe projection/ref、Off/Redacted neutrality | raw backend body/store truth、acceptance decision | body/store truth triggers VF011 |
| external collaboration | immutable local snapshot/capture and typed status/intent binding | attempt/retry/DLQ/physical delivery truth | local delivery truth or rollback triggers VF007/009 |

## 8. Non-scope impact classification

| Class | Meaning | Verdict effect | Evidence rule |
|---|---|---|---|
| `excluded_no_effect` | feature/system is outside current manifest and has no Hub surface | no P0 failure | manifest + no undeclared surface/check evidence |
| `boundary_only` | adjacent function exists but Hub only owns seam | seam gate P0；adjacent internal result not evaluated | exact ref/Port/event/no-write/no-body evidence |
| `selected_conditional` | selected product parity desired but not in P0 | selected claim blocked if unavailable；P0 unchanged | selected immutable manifest and distinct run |
| `release_required_by_manifest` | release explicitly depends on selected product or smoke | missing/nonpass blocks R4 handoff | release manifest + explicit lower-run refs |
| `future_operations` | no active design/threshold/operations baseline | not claimed；not eligible for pass language | risk/reopen trigger only |
| `forbidden_absorption` | Hub attempts to own external truth/body/lifecycle | immediate veto where mapped | negative/redaction/dependency evidence |

`not_applicable_by_manifest` is permitted only when a closed manifest proves the gate truly does not apply. Unavailable is never automatically not-applicable.

## 9. AC coverage partition by acceptance Step

| AC partition | Count | Primary acceptance Step | Secondary cross-check |
|---|---:|---|---|
| AC001..005 core closures | 5 | Step 5 | Steps 6~10 |
| AC006..021 FR capabilities | 16 | Step 5 | Steps 6~8 |
| AC022 peripheral isolation | 1 | Step 5 | Steps 6/9 |
| AC023..028 rule/boundary | 6 | Step 6 | Steps 5/7/8/11 |
| AC029..032 data ownership | 4 | Step 6 | Steps 7/10/11 |
| AC033 performance structural | 1 | Step 9 | Steps 5/8 |
| AC034 availability | 1 | Step 9 | Steps 7/8 |
| AC035 security | 1 | Step 9 | Steps 6/10/11 |
| AC036 trace/consistency | 1 | Step 8/9 | Steps 5/7/10 |
| AC037 observability | 1 | Step 9/10 | Steps 6/7 |
| **total** | **37** | **all have primary owner** | **missing=0** |

Secondary mapping does not create duplicate acceptance ownership; Step 15 will audit each AC has one primary decision row and all cross-gates are referenced.

## 10. Veto scope

| VF | Veto subject | Scope relation |
|---|---|---|
| VF001 | any of five closures incomplete | all P0 core subjects |
| VF002 | identity substitution | AS01/02/04/05 |
| VF003 | registry substitution | AS01/02/04/08 |
| VF004 | descriptor/provider/secret/runtime truth | AS01/02/05/09 |
| VF005 | approval/Policy/shared-rules ownership | seam scope + AS04/05 |
| VF006 | method body/source/type ownership | seam scope + AS05/06 |
| VF007 | Query/downstream/derived/event/Job reverse write | AS07/08 + seam scope |
| VF008 | incomplete formal exposure | AS01/02/07/08 |
| VF009 | untraceable change/capture/impact | AS04/07/08/10 |
| VF010 | duplicate/split truth | AS01/07/08 |
| VF011 | forbidden body/store truth | AS05/09/10/11 |
| VF012 | illegal compile dependency/ownership | AS06/09 |
| VF013 | historical acceptance mainline re-entry | every scope and formal document |

All 13 remain non-waivable and apply across P0/P1/R4 whenever their subject is present.

## 11. Formal-name enforcement

Acceptance rows in Steps 5~10 must use exact design terms and ranges rather than aliases:

- `CapabilityIdentity*`, registry/descriptor/seam/relation/exposure/trace/reference objects as named in formal 03；
- exact C01..26/Q01..33/I01..06/O01..10/J01..08 formal flow names and typed result/error；
- exact 24 state-family names and current/reserved/illegal classification；
- `Durable|NotDurable|Unknown`, `ConsistencyDefect`, `CommitOutcomeUnknown`, A/B/C and frozen plan/ordinal terms；
- `Local|Integration|Deployment`, `api|worker|jobs`, V0~V8 and Stage 0~7；
- exact observation inventories and Rustdoc nested-member gate。

If an acceptance condition cannot cite the exact formal name, it is a design-source gap or an overly vague acceptance row and must not be approved.

## 12. Upstream impact and scope audit

| Audit | Result |
|---|---|
| five closures covered | 5/5 |
| AC primary scope owner | 37/37;missing=0 |
| VF scope | 13/13;waivable=0 |
| P0 selected product dependency | 0 |
| P1 unavailable treated as P0 pass/fail | 0 |
| peripheral absence automatic pass | 0 |
| adjacent internal truth adjudicated by Hub | 0 |
| production readiness claimed | 0 |
| old object/threshold active scope | 0 |
| upstream writeback/blocker | 0/0 |

## 13. Formal §2 fill draft

Formal §2 shall include:

1. twelve acceptance goals；
2. P0 semantic/P1 selected/R4 release/P2 operations layers；
3. twelve P0 subject rows and adjacent seam matrix；
4. non-scope impact classes, including strict `not_applicable_by_manifest`；
5. 37 AC partition and 13 veto scope；
6. explicit non-claim for external internals and production readiness。

The formal chapter must omit SOP questions、historical diagnosis and option tradeoffs。

## 14. Step 3 entry gate

| Criterion | Result |
|---|---|
| core acceptance goal is determinable | pass-designed |
| P0/P1/R4/P2 separated | pass-designed |
| all 37 AC have primary scope owner | pass-designed |
| all 13 VF linked and non-waivable | pass-designed |
| adjacent seams bounded | pass-designed |
| exact formal-name requirement retained | pass-designed |
| unresolved upstream blocker | none |
| next Step | fix immutable acceptance baseline contracts without filling real values |

```text
document = 06-验收标准.md
step = 2
status = 06_step_02_completed_continuous_execution
ac_scope = 37/37
vf_scope = 13/13
acceptance_entered = false
formal_06_modified = false
unresolved_upstream_blocker = none
next_allowed_action = enter_06_step_03_baseline
commit_required = no
```
