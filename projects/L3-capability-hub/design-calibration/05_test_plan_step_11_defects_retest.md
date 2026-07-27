# L3-capability-hub 05 测试方案 Step 11: 缺陷管理与复验规则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/测试方案书写规范.md` §5.11
> 回填章节: `projects/L3-capability-hub/05-测试方案.md` §11
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> Step 状态: `accepted-designed`
> 当前任务: `T033`

---

## 1. 本步目标、输入与边界

### 1.1 目标

建立可执行的测试观察分类、产品/实现缺陷严重度、阻断与风险接受、复验范围、关闭证据和自动化防回归规则，保证：

- `VF-CH-001..013`任一命中均为S级且不可降级、waive或风险接受；
- P0 canonical case与blocking check的正式契约偏差至少为A级并阻断测试退出；
- 测试脚本/基础设施故障、设计源冲突、环境prerequisite和无阈值sample不被伪装成产品缺陷；
- 修复后至少重跑原case、同family风险面、primary suite和受影响check；共享契约变更扩展到full main/release；
- 失败前artifact和复验artifact使用不同显式run ID并同时保留；
- 新发现的P0覆盖缺口必须补到existing canonical case parameter/assertion或受控重开Step 6，不允许只留手工复验；
- 不创建真实defect ID、owner、run、artifact、report、签署或关闭事实。

### 1.2 权威输入

| 输入 | 本步用途 | 不得改写 |
|---|---|---|
| formal `00` §14 | 37 AC方向与13 veto | 不改变veto或宣告验收 |
| Step 5 | AC/VF到测试family的planned追溯 | 不升格family placeholder为正式证据 |
| Step 6 | 189 canonical TC、typed/zero-effect oracle和candidate | 不修改case而逃避缺陷 |
| Step 9 | 10 suites、5 gates、9 checks、closed run status和raw/report provenance | 不把invalid run算pass |
| Step 10 | 20 NFR、专项红线、无numeric baseline结论 | 不将sample偏差制造成缺陷 |
| formal `03/04` | exact object/state/flow/error/config/observation authority | 设计冲突必须回写owner，不由缺陷系统私自裁决 |

### 1.3 本步不做

- 不选择issue tracker、字段schema、组织角色姓名、SLA、修复时限或审批产品。
- 不创建`DEF-CH-*`编号或假定缺陷已发现、已分配、已修复、已关闭。
- 不将设计文档静态审计状态当成实际测试pass。
- 不分配正式EV、真实run ID、artifact digest、报告链接或验收签字。
- 不允许“已知问题”“环境问题”覆盖S/A阻断，也不允许后一次pass覆盖旧失败记录。

## 2. SOP 五问回答

| 问题 | 设计结论 |
|---|---|
| 1. 哪些属于S级阻断？ | 13个veto任一命中；truth/ownership/security/exposure/trace/idempotency/dependency/historical主线被打穿；redaction泄漏；raw-less/static evidence可被当pass；commit/duplicate/recovery产生第二truth。 |
| 2. 哪些可风险接受？ | S不可接受；P0 A在本轮测试退出/送验前不可接受；B仅限不影响P0 oracle/evidence的非核心表现或P1；environment/future项记prerequisite/residual而非产品缺陷。 |
| 3. 修复后回归哪些用例？ | 原失败TC/parameter、同family边界、primary suite和受影响checks必跑；contracts/state/UoW/config/runtime/observer/report等共享面按§9扩到多suite或full main/release。 |
| 4. 关闭需要哪些证据？ | 分类/影响/根因、失败run raw/report、修复范围、复验新run raw/report、case/suite/check状态、回归范围完整性和自动化处置；当前只定义未来字段。 |
| 5. 何时新增自动化？ | 手工发现P0、release先于lower suite发现、现有parameter/oracle漏检、scanner/check漏检、同类复发或设计新P0分支时必须补；优先扩existing case，新增canonical TC需受控重开Step 6。 |

## 3. 诊断、前后变化与取舍

### 3.1 当前问题诊断

| 问题 | 风险 | 处置 |
|---|---|---|
| gate non-pass不等于产品bug | 把环境/runner问题误归实现 | 先做observation classification，再定severity |
| 13 veto跨多个suite | 单case修复后漏回归相邻面 | 建立veto到suite/check和full-gate映射 |
| A级可被“风险接受”滥用 | P0未闭合却退出 | 当前P0 A不可用于测试退出或送验 |
| defect关闭可能只看新pass | 删除失败历史或假修复 | old/new explicit run pair强制保留 |
| 缺失自动化可能随手新增TC | canonical denominator漂移 | existing assertion/parameter优先；新增TC受控重开 |
| 设计矛盾可能被实现patch掩盖 | 真相源分叉 | 分类为design blocker并重开owner文档 |

### 3.2 改动前后

| 维度 | Step 11前 | Step 11后 |
|---|---|---|
| non-pass | closed status但无triage | product/tool/design/prerequisite/sample五类分离 |
| severity | 无项目级规则 | S/A/B定义且veto全S |
| risk acceptance | 未闭口 | S及P0 A不得支持退出；B/R条件明确 |
| retest | 无变更面扩散规则 | targeted/family/suite/main/release五级决策 |
| closure evidence | raw/report path已有 | 失败前后双run、范围和防回归字段齐全 |
| new automation | 无升级机制 | assertion/parameter/check扩展与canonical reopen分离 |

### 3.3 设计取舍

| 方案 | 裁决 | 理由 |
|---|---|---|
| 每个gate failure直接S | reject | runner/infra和普通P0契约偏差需先归因 |
| 所有P0偏差至少A且阻断退出 | accept | P0 denominator定义为完整主线 |
| A级允许当前送验waiver | reject | 会破坏Step 12可判定退出门禁 |
| B用于selected/unthresholded sample | conditional | only after confirming no P0 contract/evidence impact |
| 修复后只跑原case | reject | shared contracts and negative boundaries有扩散风险 |
| diagnostic retry覆盖旧run | reject | 破坏provenance和flaky识别 |

## 4. Test observation classification before severity

只有`OBS-CLASS-IMPLEMENTATION`进入S/A/B产品/实现缺陷分级。其他类别仍可阻断gate，但不能冒充implementation result。

| Observation class | 判定条件 | 处理 | Gate status relationship |
|---|---|---|---|
| `OBS-CLASS-IMPLEMENTATION` | valid case/data/environment/harness下，observed behavior违反formal 00~04 oracle | 按S/A/B分级、修复、复验 | usually `failed` |
| `OBS-CLASS-TEST-SYSTEM` | case manifest、fixture、fake、runner、check、report generator自身错误/不稳定 | 修复测试系统；原run保持invalid/non-pass；重跑受影响suite | `failed`,`timed_out`,`flaky_detected`,`invalid_artifact` |
| `OBS-CLASS-DESIGN-BLOCKER` | active formal sources矛盾、缺失可观察oracle或无法1:1落码 | 停止affected cut，重开exact owning Step并同步下游 | no pass; design blocker |
| `OBS-CLASS-PREREQUISITE` | compatible core-contracts、实现仓、selected product/environment/config artifact等尚不存在或不可用 | 记录exact prerequisite和scope；不可记test pass/fail | `blocked_dependency` |
| `OBS-CLASS-NUMERIC-SAMPLE` | duration/throughput value存在但没有active numeric threshold | 保留sample，status=`not_evaluated` against numeric target | structural case may pass; numeric verdict absent |
| `OBS-CLASS-EXPECTED-ORACLE` | exact scripted unavailable/timeout/error按typed oracle与zero-effect成立 | case可pass，不创建defect | `passed` only for that declared case |
| `OBS-CLASS-INCOMPLETE-RUN` | cancelled、unexpected timeout、missing required cell或report failure且根因未定 | 保留partial raw data，先调查分类 | non-pass |

Classification requires raw input/config/profile/entry/case/parameter and harness provenance. “Cannot reproduce” does not turn a valid prior failure into pass or closed defect.

## 5. Product/implementation defect severity

| Level | Definition | Capability Hub examples | Required action | Blocking |
|---|---|---|---|---|
| S | veto、truth/ownership/security/evidence integrity破坏，或可能产生不可解释/第二份正式truth | any `VF-CH-*`;forbidden body persisted/emitted;unresolved exposure made visible;Query/Job/downstream reverse-write;duplicate winner split;static evidence accepted | must fix;no risk acceptance;full affected regression and gate proof | yes,immediate |
| A | P0 canonical typed/zero-effect/config/observation/documentation contract失败但未命中S | wrong typed error,missing required state branch,wrong API mapping,missing Rustdoc field/variant/method,cleanup order mismatch without survivor,missing required profile | must fix before Step-12 exit/acceptance handoff;retest family/suite/check | yes for current test exit |
| B | confirmed non-P0 or presentation/maintainability issue with no P0 result/provenance impact | P1 selected parity defect;human report wording while raw/schema/status remain exact;nonblocking local diagnostic ergonomics | schedule or explicitly accept;retain scope and trigger | no P0 block |

Environment unavailable, future product gaps and numeric samples are prerequisites/residuals, not automatically B defects. Test-system defects use the same impact discipline for gate recovery but remain separately typed from product severity.

## 6. Thirteen vetoes: mandatory S mapping

| Veto | S trigger | Primary cases/suites | Mandatory checks / retest extent |
|---|---|---|---|
| `VF-CH-001` | C1~C5 any closure cannot be formed | all owner Command/Query/state families;main 10 suites | full main + release closure after fix |
| `VF-CH-002` | URL/provider/tool/runtime/SDK/listing/derived view replaces identity | FOUNDATION02/12,CMD01..03,STATE01;domain/service | responsibility,case-manifest,redaction;affected identity family + main |
| `VF-CH-003` | registry becomes allowlist/runtime/cache/listing/availability bit | CMD05..08,registry Queries,STATE03 | responsibility + config/dependency where source changed |
| `VF-CH-004` | descriptor stores secret or provider runtime/quota/route/cost/failover/retry truth | CMD09..12,Q descriptor family,STATE04..06,OBS08/12 | redaction,responsibility,config;full affected main |
| `VF-CH-005` | Hub owns approval/Policy/shared_rules or review substitutes approval | CMD04,13..15,Q12,STATE02/07 | responsibility,redaction;governance/exposure regression |
| `VF-CH-006` | relation stores method body/source/version/type truth | CMD16..17,method Queries,STATE08 | responsibility,redaction,dependency;method/exposure regression |
| `VF-CH-007` | runtime/tools/SDK/product/Query/derived/event/Job reverse-writes core truth | all Q/I/O/J plus CMD26,STATE14..24,TX20 | responsibility,artifact pairing;all affected suites + main/release |
| `VF-CH-008` | incomplete capability becomes formal visible/consumable | CMD18..21,Q15..19,STATE07/09/10/14 | state registry,responsibility;exposure family + release closure |
| `VF-CH-009` | required change/source/scope/impact/trace/capture missing or asymmetric | Command families,Q20..23,Outbound,STATE11..13 | case manifest,pairing,redaction;all affected mutation/outbound paths |
| `VF-CH-010` | duplicate/race/replay produces duplicate identity/registry/descriptor/exposure | STATE01/03/04/09/20,TX08..20 | state registry,case manifest;repository/service/outbound/jobs + main |
| `VF-CH-011` | cost/finance/telemetry/audit/listing/production body enters Hub truth | FOUNDATION01/14,OBS08/12,CONFIG08/16 | redaction,responsibility,no-static-evidence;full output/store scan |
| `VF-CH-012` | non-core sibling compile ownership or copied replacement | FOUNDATION08..10,BIND12 | dependency,Rustdoc/responsibility as affected;full static/main/release |
| `VF-CH-013` | historical objects/numbers/topology/IDs become active acceptance mainline | FOUNDATION01/08..11,CONFIG17 plus manifests/docs | case/config/responsibility/no-static-evidence;full static/release audit |

All 13 rows are non-waivable. A test-system defect that temporarily prevents proving a veto negative still blocks exit until the check is repaired and rerun; it does not mean the product veto was observed.

## 7. Suite/check failure triage matrix

### 7.1 Primary suites

| Suite | Default confirmed implementation severity | Promote to S when | Minimum retest |
|---|---|---|---|
| static-contract-docs | A | dependency/ownership/historical/forbidden schema/evidence boundary hit | original row + suite + related checks |
| domain-state | A | illegal state accepted,terminal resurrection,second truth or exposure bypass | full family,638 registry if generator/shared guard changed |
| service-command-query | A | truth corruption,Query write,approval/method/runtime ownership or trace loss | original flow family + suite + affected owner suites |
| entry-inbound | A | body leak,source input rewrites truth,barrier exposes partial graph | all six sources/entries as affected + checks |
| outbound-collaboration | A | external failure rolls back truth,local delivery truth invented,duplicate bind | all O01..10 + related TX |
| jobs-lifecycle | A | Job repairs/rescans/reexecutes committed truth or fabricates terminal/report | all J01..08 + TX20 + pairing |
| repository-transaction | A | second authority/winner overwrite/duplicate effect/unsafe Unknown retry | all affected TX and dependent suites;often full main |
| runtime-binding | A | partial graph exposed,illegal fallback,forbidden dependency/product ownership | BIND01..12 + config/static checks |
| observability-redaction | A | forbidden material leak or observer changes business truth | S; all OBS + redaction/relevant business suite |
| configuration-strict | A | silent fallback,unsafe material,partial activation,mutable root or safety disable | S where truth/security affected; all CONFIG + binding |

### 7.2 Mandatory checks and report builders

| Check/builder | Initial observation class | Confirmed impact severity | Retest requirement |
|---|---|---|---|
| case manifest | test-system or implementation manifest | A;S if identities omitted to fabricate pass | check + all affected suite manifests |
| state-pair registry | test-system/domain implementation | A;S if illegal/reserved pair accepted or hidden | full 638 + domain-state |
| dependency boundary | implementation | S on forbidden edge;prerequisite if core candidate absent | check + static + main/release |
| Rustdoc coverage | implementation | A | full public declaration scan,including every struct field and enum variant/payload |
| config catalog | implementation/test-system | A;S for silent safety bypass | check + configuration/runtime suites |
| responsibility boundary | implementation | S when forbidden owner surface exists | check + source owner suites + release |
| redaction | implementation/test-system | S for leak;test-system if scanner invalid before evaluation | scanner fixtures + all affected raw/report outputs |
| artifact/report pairing | test-system/evidence pipeline | A;S if gap/static result can be accepted as pass | builder/check + all referenced suites + release |
| no-static-evidence | evidence pipeline | S if static/raw-less pass is accepted | check + candidate builder + release |
| report builder failure | test-system | A gate blocker;S only if it misrepresents failed/missing as pass | builder + pairing/no-static + affected run projection |

## 8. Risk acceptance and blocker policy

| Finding | Risk acceptance | Test exit / acceptance handoff |
|---|---|---|
| S implementation defect | forbidden | blocked |
| P0 A implementation defect | forbidden for current baseline | blocked until fixed/retested |
| A test-system defect affecting blocking result | forbidden while proof incomplete | blocked until tool fixed and gate rerun |
| B product/test-system defect | allowed only with named future owner,scope,reason,trigger and no P0/evidence impact | may exit if Step 12 other gates pass |
| design blocker | not a risk acceptance item | affected testing blocked;reopen owner document |
| missing P0 prerequisite | cannot be called pass;must be satisfied | affected gate blocked |
| selected P1 prerequisite unavailable | record residual/unavailable | P0 may remain complete;selected/release claim unavailable |
| numeric sample with no threshold | no defect verdict | numeric criterion remains not_evaluated |
| P2/future product/capacity behavior | record residual only | no claim of verification |

No acceptance role, person or signature is assigned here. Formal `06` will define who may accept eligible B/residual risks; it cannot accept a veto or P0 A as passed.

## 9. Retest scope decision matrix

| Changed/fixed surface | Targeted minimum | Family/suite regression | Cross-suite/check regression | Full main/release trigger |
|---|---|---|---|---|
| protocol/ref/metadata/codec/digest | failed TC/parameter | FOUNDATION01/13..15 + static suite | dependent service/entry;Rustdoc/redaction | public schema/digest domain or candidate provenance changed |
| domain object/policy/state guard | failed member/pair | object/state family;full affected pair registry | service/repository consumers | shared guard,terminal/no-op or exposure state changed |
| Command/UoW orchestration | failed flow/branch | all shared C abnormal branches + service suite | repository/outbound/observation as affected | atomic members/idempotency/trace/capture changed |
| Query/visibility/degraded | failed Q | all 33 no-write shared branches if common helper changed | domain/repository/config/observation | any Query write/body/visibility source defect |
| Inbound/API/Worker | failed route/source | all affected six-source/header/lifecycle rows | service/runtime/config/redaction | barrier/body/source ownership changed |
| Outbound A/B/C | failed O/TX point | O01..10 + TX17..19 | service/jobs/repository/observation | local truth,stable intent or route contract changed |
| Job plan/journal/report | failed target/phase | J01..08 + TX20 | repository/outbound/config/pairing | reentry/terminalization/final report semantics changed |
| repository/UoW/idempotency | failed method/fault | 22/110 parity + relevant TX set | all service/entry/outbound/jobs users | authority,commit tri-state,winner or result store changed |
| runtime binding/config | failed stage/row | BIND01..12 + CONFIG01..18 as affected | static/dependency/Rustdoc/entry/observation | graph/profile/entry/provider/retry/safety changed |
| observation/redaction | failed profile/corpus | OBS01..12 + CONFIG16 | every producer suite whose projection changed + redaction | selector/redactor/sink/report schema changed |
| gate/check/report/evidence pipeline | failed script contract | affected check/builder fixtures | pairing/no-static/case manifest + referenced suites | status aggregation/provenance/release summary changed |
| Rust public documentation | failed declaration/field/variant/payload/method | full Rustdoc scanner | static suite;compile if declaration changed | signature/schema also changed |
| dependency graph | failed edge/import/public leak | full workspace graph/import/signature scan | static/runtime/config | any sibling edge or public type source changed |

“Full release” means a future new explicit release run after a complete main result and all nine checks. It is not claimed executable today.

## 10. Defect lifecycle and closure evidence contract

### 10.1 Planned lifecycle

```text
observed non-pass
  -> preserve raw run
  -> classify observation
  -> reproduce or validate provenance
  -> assign S/A/B only for confirmed implementation defect
  -> identify affected formal source and regression surface
  -> fix implementation or test system / reopen design owner
  -> execute new explicit retest run
  -> compare old and new artifacts without overwriting either
  -> complete required family/suite/check regression
  -> close,or retain open/residual according to policy
```

### 10.2 Minimum future defect record

| Field group | Required content | Truthfulness constraint |
|---|---|---|
| observation | source gate/suite/check, TC/DS/parameter, expected/observed safe class, first run ref | no raw secret/body in record |
| classification | observation class, confirmed severity if applicable, formal source, veto/AC/NFR impact | no severity before attribution |
| impact | object/state/flow/config/profile/entry/owner and possible persisted/external effects | distinguish confirmed vs possible |
| root cause | implementation/test-system/design/prerequisite category and affected declarations/files when known | no fabricated commit |
| remediation | intended/actual fix scope and regression decision | no “fixed” before new evidence |
| retest | new run ref, exact targeted/family/suite/check list, status and raw/report refs | new run cannot reuse/overwrite old root |
| closure | unresolved cells, automation action, eligible risk decision and future trigger | no acceptance signoff invented |

### 10.3 Closure evidence by severity/class

| Evidence item | S | A | B | Test-system blocker |
|---|---|---|---|---|
| valid failing run raw/report or provenance explanation | required | required | if observed in run | required |
| formal source and affected TC/DS/parameter | required | required | required where applicable | affected test contract required |
| fix scope and root cause | required | required | required if fixed | required |
| new explicit retest run | required | required | if closure claims fixed | required |
| family/suite/check regression | required per §9 | required per §9 | scoped | all affected proof cells |
| full main/release | where §6/§9 triggers | where shared/release surface triggers | no | if gate aggregation/provenance affected |
| automatic regression action | required | required | as applicable | required |
| risk acceptance | forbidden | forbidden for P0 | eligible with formal owner | not a substitute for proof |

Step 13 will assign formal evidence aliases and retention. This step only defines the future closure bundle; no bundle currently exists.

## 11. Automation regression policy

| Discovery | Required automation action | Canonical identity rule |
|---|---|---|
| existing TC missed a branch already implied by its design cut | add parameter/scenario/assertion to same TC/DS and suite | canonical count remains 189 |
| common helper/check failed to detect issue | add deterministic fixture and negative assertion to existing check/suite | no new TC merely for tooling |
| release smoke found issue lower suite should own | add lowest-layer reproducer and keep release secondary regression | primary owner remains unique |
| manual P0 discovery with existing cut owner | automate under that existing canonical TC before closure | manual-only P0 gap remains 0 |
| genuinely new formal design obligation has no cut/TC | controlled reopen formal owner,Step 3/5/6/7/8/9/10 and downstream docs | only then allocate new canonical identity |
| redaction leak corpus missing | extend forbidden corpus and scanner fixture without storing real material | use synthetic safe marker,never actual secret |
| flaky/race reproduction | deterministic barriers/schedule and preserve all attempt results | do not auto-retry to pass |
| historical contamination | extend static/responsibility/case/config checks | no alias from old IDs |

An implementation-only regression test name is not specified here. Future public Rust test helpers or declarations that are public must still have complete English `///` documentation at declaration, struct-field, enum-variant/payload, trait, method and callable granularity.

## 12. Stop review and cross-rule audit

### 12.1 Stop review

| Review item | Result | Gap / correction |
|---|---|---|
| observation classification precedes severity | pass-designed | seven classes separate implementation from tool/design/prerequisite/sample |
| S/A/B are executable | pass-designed | current P0 S/A both block exit |
| all vetoes are S and non-waivable | pass-designed | 13/13 exact rows |
| suite/check triage exists | pass-designed | 10 suites + 9 checks/report builders |
| retest scope is change-aware | pass-designed | targeted through full release levels |
| closure preserves old/new evidence | pass-designed | distinct explicit runs required |
| automation gap cannot remain manual | pass-designed | controlled extension/reopen rules |

### 12.2 Cross-rule audit

| Audit | Result | Disposition |
|---|---|---|
| `VF-CH-*` expected/mapped | 13/13;missing=0;duplicate severity=0 | all S |
| P0 A waiver path | 0 for current test exit | must fix/retest |
| product vs test-system conflation | 0 designed path | classification required |
| blocked dependency treated as defect/pass | 0 | prerequisite remains blocked |
| unthresholded sample treated as failure/pass | 0 | numeric not_evaluated |
| old failure overwrite path | 0 | explicit distinct run roots |
| single-case-only closure path for shared change | 0 | §9 expansion mandatory |
| P0 manual regression gap | 0 allowed | automate before closure |
| formal evidence/signoff fabrication | 0 | Step 13/06 future ownership |
| upstream blocker discovered | 0 | no current writeback |

`pass-designed` is not a real defect triage, fix or retest result.

## 13. Upstream impact, formal fill draft and Step 12 gate

### 13.1 Upstream impact

| Conclusion | Upstream impact | Disposition |
|---|---|---|
| 13 vetoes and all P0 failures can be classified | none | test-management refinement |
| P0 A cannot be waived for current exit | none | Step 12 consumes as exit condition |
| design blocker classification exists | none now | future contradiction reopens exact owner |
| new formal obligation discovered by testing | controlled reopen | update 00~04 owner then Steps 3~11 and downstream |
| numeric performance threshold activated | controlled reopen | formal baseline and defect severity must be revised |

Current writeback / blocking confirmation / unresolved upstream blocker = `0 / 0 / 0`.

### 13.2 Formal `05` §11 fill draft

Formal §11 must include:

- observation classification before S/A/B severity;
- S/A/B definitions,with S and current P0 A both blocking exit;
- all `VF-CH-001..013` mapped to S and exact suite/check regression;
- suite/check triage and risk-acceptance table;
- change-surface retest decision matrix;
- distinct failing/retest run provenance and closure bundle;
- automation regression rule and controlled canonical-case reopen;
- explicit statement that no actual defect/run/fix/closure exists.

Formal `05-测试方案.md` remains unchanged until Step 15.

### 13.3 Step 12 entry gate

| Condition | Status | Basis |
|---|---|---|
| severity and non-defect classifications are unambiguous | pass-designed | §§4~5 |
| all vetoes are non-waivable S | pass-designed | §6 |
| retest and closure evidence are executable | pass-designed | §§9~10 |
| automation gap policy preserves 189 canonical authority | pass-designed | §11 |
| no upstream blocker or fabricated fact exists | pass-designed | §§12~13 |

Next allowed action: read Test Plan SOP/writing-standard Step 12, Steps 8~11 and formal acceptance directions; then create `05_test_plan_step_12_entry_exit.md` without modifying formal `05`.
