# L3-capability-hub 04 配置设计 Step 14：风险与待确认事项

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 14
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §14
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_14_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 `定义风险与待确认事项` |
| 输入基线 | Steps 1~13 全部impact/risk/open-item sections；formal 03 risk/test/implementation handoff |
| active risk items | 17；全部有classification、owner、blocking scope、interim rule和reopen/closure target |
| current P0 `待回写` | 0 |
| current P0 `阻塞待确认` | 0 |
| unresolved upstream blocker | 0 |
| formal 04 | not created；Step 15 may assemble only from completed Steps 1~14 |

## 2. 本步目标、输出与限制

本 Step 汇总配置设计阶段所有仍需后续确认的事项，并严格区分：

- 当前 P0 配置契约是否完整；
- 某项只阻塞实现、测试、验收或部署，而不阻塞正式 04；
- 某项何时会触发 formal 03/04 controlled reopen；
- 哪些是跨仓 non-blocking debt，不能被伪报为已修复；
- 哪些责任永久不属于 Capability Hub，不能被包装成“待确认功能”。

本 Step 只做风险治理和 Step 15 门禁，不选择产品、backend、path、environment value、test command、acceptance evidence或deployment procedure，不创建正式 04，也不修改 formal 03。Future trigger 不是当前代码契约；因此不得把“future可能影响03”填成当前 `是否影响03=是 / 无回写` 的矛盾状态。

## 3. 本步输入与覆盖

| Source | Closed input | Remaining handoff extracted here |
|---|---|---|
| Step 1 | active 00~03、historical isolation、two L0 debts/target repo/product facts | debt/prerequisite ownership |
| Step 2 | P0/P1/P2 scope and seven residual risks | product boundary、P2 rejection |
| Step 3 | 10 control planes and sole raw reader/builder | owner/reopen boundary |
| Step 4 | 9 categories、22 forbidden surfaces、startup-only | out-of-scope and reload triggers |
| Step 5 | source precedence and dynamic-source exclusions | environment/config-center trigger |
| Step 6 | three profiles and complete predicate | environment/product readiness |
| Step 7 | 18 modules、27 rows、strict schema/material registries | implementation/product prerequisites |
| Step 8 | provider-to-constructor security path | provider/memory/rotation prerequisite |
| Step 9 | V0~V8、Stage 0~7、entry barriers | framework/probe/cutover prerequisites |
| Step 10 | review/audit/restart/rollback | artifact/release/audit product prerequisite |
| Step 11 | failure/safe observation intent | backend/alert/fallback prerequisite |
| Step 12 | 05/06/07/09 ownership | downstream-document and evidence work |
| Step 13 | no legacy migration and future evolution gate | first-release/dual-version future trigger |

Coverage: `13/13` Steps scanned. Historical README and old 05/06 were read only to identify authority conflict; they do not define a current risk solution or config key.

## 4. SOP 六问回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| 哪些配置问题仍可能影响落地？ | target repo、L0-core wire/key debt、concrete durable/transport/secret/TLS/observer products、framework/probe/cutover/audit mechanism、actual environment values、formal 05/06/07/09及future schema evolution。它们按精确阻塞范围保留。 |
| 哪些事项会阻塞测试、验收、实施或运维？ | old 05/06阻塞真实测试/验收结论；target repo和产品选择阻塞对应implementation boundary；artifact/cutover/alert/runbook事实阻塞Deployment operations readiness；none blocks product-neutral formal 04 assembly。 |
| 每个待确认事项需要谁确认？ | 表8.1逐项给出design/core/contracts/implementation/dependency/security/release/test/acceptance/operations owners，不使用泛化“团队确认”。 |
| 未确认前如何处理？ | 使用严格保守分支：不伪造产品/路径/值；Deployment不能Fake；Configured必须fail-closed；observer可Off；unsupported dynamic controls reject；没有真实run/evidence/signoff。 |
| 哪些配置结论改变了03代码契约？ | Steps 1~13 当前采纳结论均未改变formal 03；raw schema细化完全落在03已委托的04责任内。 |
| 这些影响是否已回写，还是阻塞待确认？ | 当前没有需回写项。Future V2/new profile/source/provider health/config center/hot reload/public warning等一旦进入范围，必须先把相应trigger改为active并回开指定03/04 Steps；在此之前它们不是当前正式契约。 |

## 5. 当前问题诊断

| Problem | Risk if mishandled | Step 14 correction |
|---|---|---|
| future trigger mixed with current impact | false `是否影响03=是 / 无回写` contradiction | current impact ledger and future trigger register separated |
| product-neutral schema | may be called Deployment-ready without products | product implementation/operations scopes remain blocked |
| target repo absence | may be ignored until implementation agent starts | retained as all-boundary implementation prerequisite |
| old 05/06 presence | may be treated as active evidence plan | explicitly historical; T022/T038 full rebuild required |
| README conflict | runtime/provider/cost/approval responsibilities may return | retained for T070 disposition; no authority now |
| observer design | 155 profiles may be mistaken for active backend/signals | backend and real signal availability remain prerequisite |
| safe digest wording | may invite secret-derived arbitrary hash | omit sensitive digest unless exact safe projection is implemented |
| zero current blocker | may be misread as all delivery ready | classification table states exact blocked downstream scopes |

## 6. 改动前后对比

| Dimension | Before Step 14 | After Step 14 |
|---|---|---|
| risk inventory | distributed in 13 files | 17 stable active items with owners/scopes/actions |
| 03 impact | per-Step zero plus conditional notes | 13/13 current ledger + separate future trigger register |
| downstream readiness | described by individual Step | test/acceptance/implementation/operations blocked scopes explicit |
| product uncertainty | repeated unselected notes | consolidated by binding family and stop rule |
| formal assembly | implicit no-blocker statements | exact Step 15 gate with zero pending writeback/confirmation |

## 7. 风险分类规则

| Classification | Exact meaning | Blocks formal 04? | Required treatment |
|---|---|---|---|
| `non_blocking_debt` | upstream formal design lags an authorized exact dependency assumption | no | monitor trigger; reopen affected boundary on semantic delta |
| `implementation_prerequisite` | design is closed but code/repo/product/framework fact is absent | no | boundary remains not-started until preflight proves it |
| `downstream_work` | another formal document/process must still be rebuilt | no | complete in sequence; no result/evidence claim before then |
| `controlled_reopen` | current design is valid, but a named future selection may require contract change | no until triggered | stop affected boundary and reopen exact owner Steps |
| `future_evolution` | capability/version is unsupported now and may be proposed later | no | reject now; run full design path if proposed |
| `out_of_scope` | responsibility belongs elsewhere and must not enter Hub | no | reject/leakage veto; redirect to owning project |
| `current_design_blocker` | current P0 contract is contradictory, missing or not codeable | yes | must be `待回写` or `阻塞待确认`; count is currently zero |

## 8. 结构化中间产物

### 8.1 Active risk register

| ID | Risk / open item | Class | Owner / confirmer | Exact blocking scope | Interim rule | Reopen / closure target |
|---|---|---|---|---|---|---|
| `CH-CFG-R01` | L0-core `IdempotencyKey::as_str()`/byte semantics not yet formalized upstream | non_blocking_debt | L0-core contracts design owner；Hub contracts/test owner | affected normalized-key/digest fixture on dependency semantic change | use exact raw UTF-8 bytes; no trim/case-fold/normalization/Display/serde substitution | dependency delta -> reopen DDD Steps 8/13/14/16 and formal 04/05 |
| `CH-CFG-R02` | L0-core shared serde wire shape not a permanent formal promise | non_blocking_debt | L0-core/contracts owner；Hub codec/test owner | shared-field fixture/digest compatibility on dependency change | pin current audited v1 fixture; do not claim upstream permanent commitment | wire delta -> reopen DDD Steps 8/13/14/16 and 04/05 |
| `CH-CFG-R03` | target implementation repo/Cargo/workspace/git facts absent | implementation_prerequisite | formal 07 Step 3 / repository owner | all implementation boundaries | complete 04~07 only; claim no repo/branch/commit/readiness facts | formal 07 preflight then implementation ledger |
| `CH-CFG-R04` | durable local authority product/schema/migration capability unselected | controlled_reopen | architecture/persistence/implementation/operations owners | Deployment local authority adapter boundary | one product-neutral durable branch; no inMemory fallback or config-only migration | product selection -> DDD Step 14 + 04 Steps 7~11 + 07/09 |
| `CH-CFG-R05` | transport/endpoint/adapters for 9 external Ports unselected | controlled_reopen | dependency/adapter/security owners | each Configured external Port boundary | closed product-neutral refs; Disabled only when explicitly configured | selected product requiring new material/constructor -> reopen 03/04 |
| `CH-CFG-R06` | concrete feeds/trusted-actor mechanism for 6 Worker sources unselected | controlled_reopen | source/security/Worker owners | selected Configured Worker source boundaries | family/feed/actor pair remains atomic; no partial six-source activation | product/schema mismatch -> DDD source/entry binding + 04 |
| `CH-CFG-R07` | concrete outbound transport for 10 routes unselected | controlled_reopen | collaboration/transport/security owners | Configured collaboration boundary | exact 10-route graph; no provider route/cost/failover/delivery truth | product needs new route semantics -> reopen owner design |
| `CH-CFG-R08` | secret provider, memory/zeroization/session API and TLS material API unselected | controlled_reopen | security/provider/adapter owners | every Configured material constructor and Deployment readiness | provider-to-exact-constructor shortest lifetime; no raw root/output/fallback | product selection -> DDD constructor review + 04 Steps 7~11 + 07/09 |
| `CH-CFG-R09` | product-specific constructor probe/readiness capability unknown | implementation_prerequisite | adapter/entry/release owners | activation proof for selected product | do not fabricate probe; require equivalent deterministic constructor/barrier predicate | 07 boundary preflight; reopen if product cannot satisfy barrier |
| `CH-CFG-R10` | concrete artifact store/review/audit/cutover/unknown-resolution mechanism unselected | implementation_prerequisite | release/config/security/operations owners | real configuration release/cutover/rollback | immutable product-neutral artifact and external outcome predicates only | 07/09 procedure; reopen if mechanism weakens Step 10 |
| `CH-CFG-R11` | safe config projection/digest algorithm and retention/access backend not implemented | implementation_prerequisite | implementation/security/test/operations owners | drift/audit evidence and production operations | record safe classes/refs; omit sensitive digest until exact projection is proven | formal 05/07/09; new carrier/repository -> reopen 03 |
| `CH-CFG-R12` | concrete observability backend/crate/facade and independent sink fallback unselected | controlled_reopen | observability/config/infra owners | instrumentation backend boundary only | Off/Redacted; existing private backend-neutral cuts; no business effect | select backend -> reopen DDD Steps 14/15 and formal 04/07 as matrix requires |
| `CH-CFG-R13` | alert thresholds/windows/routes/dashboard/retention/runbook absent | implementation_prerequisite | operations/SRE/security owners | Deployment operations readiness | only safe intent/profile fields; no claimed alert | formal 09 with real SLO/platform facts |
| `CH-CFG-R14` | old formal 05/06 are historical and not rebuilt | downstream_work | test and acceptance design owners | test execution/evidence and acceptance decision claims | no old TC/AC/result reused; rebuild after formal 04 | T022~T053 |
| `CH-CFG-R15` | formal 07 and 09 absent | downstream_work | implementation-plan and operations owners | implementation start and production operations | no task/commit/deployment/runbook invented in 04 | T054~T069 for 07/ledgers; 09 remains later owner |
| `CH-CFG-R16` | first released schema/binary matrix and dual-version need unknown | future_evolution | design/release/implementation owners | only future migration/version boundary | initial v1 remains design candidate; old/unknown schema rejects | future proposal -> 03/04/05/07/09 version gate |
| `CH-CFG-R17` | README still states execution/provider/cost/approval-like responsibilities | out_of_scope | Capability Hub design owner | reader/implementation authority confusion | formal 00~04 outrank README; no leaked key/object/task | T070 README disposition; any code request fails responsibility gate |

### 8.2 Open-question table

| Question | Current impact | Required confirmer | Before confirmation |
|---|---|---|---|
| Which durable authority and migration mechanism will Deployment use? | blocks `CH-CFG-R04` implementation/ops only | architecture/persistence/operations | no Deployment readiness claim; no inMemory fallback |
| Which products implement each of 9 Ports, 6 sources and 10 routes? | blocks corresponding Configured boundaries | dependency/source/collaboration owners | use Disabled/Fake only where profile/branch legally selects it |
| Which provider/TLS APIs satisfy shortest-lifetime and expiry/revocation rules? | blocks sensitive configured constructors | security/provider owners | ref-only; fail-closed; no raw material |
| How are immutable artifacts reviewed, stored, cut over and resolved when outcome is unknown? | blocks real release | release/config/operations | no cutover/rollback fact or auto resolution |
| What is the safe canonical config projection/digest? | blocks digest-backed evidence | security/implementation/test | omit sensitive digest; retain category/ref semantics |
| Which observability backend and non-recursive fallback exist? | blocks concrete instrumentation | observability/infra owner | Off valid; Redacted projection only; no signal claim |
| What real environment maps to each profile/entry/artifact? | blocks deployment procedure | operations/release | canonical profiles only; no real values/path |
| When will 05/06/07 be rebuilt and 09 authored? | blocks downstream execution/readiness | project/test/acceptance/implementation/operations owners | follow current continuous design sequence; no result claims |
| Will a future version require dual-schema support or dynamic config? | no current impact | architecture/design/release | V1 only; dynamic source/reload rejected |
| Have the two L0-core assumptions changed? | only changed dependency triggers impact | L0-core/contracts owners | exact current assumption, retain debt IDs |

### 8.3 Current Step 1~13 detailed-design impact ledger

| Step | Current accepted conclusion | Changes formal 03? | Current status |
|---:|---|---|---|
| 1 | consume exact typed/binding baseline and isolate old material | no | 无回写 |
| 2 | 27 rows are P0 schema obligations; products deferred; P2 excluded | no | 无回写 |
| 3 | group existing surface into 10 control planes; sole raw reader/builder | no | 无回写 |
| 4 | startup-only categories and forbidden invariants | no | 无回写 |
| 5 | constants < JSON < bounded env; no dynamic/admin source | no | 无回写 |
| 6 | Local/Integration/Deployment exact profile matrix | no | 无回写 |
| 7 | strict raw schema/keys/bounds resolve into existing typed root | no | 无回写 |
| 8 | ref-only secret/provider-to-constructor boundary | no | 无回写 |
| 9 | V0~V8/Stage 0~7/barriers clarify existing assembly | no | 无回写 |
| 10 | immutable artifact/review/restart/rollback around existing root | no | 无回写 |
| 11 | existing error/Port/typed/observer taxonomy retained | no | 无回写 |
| 12 | allocate downstream document responsibilities only | no | 无回写 |
| 13 | no legacy migration; future version gate only | no | 无回写 |

Aggregate current status: `13/13 无回写`; `待回写=0`; `阻塞待确认=0`.

### 8.4 Future controlled-reopen trigger register

| Trigger | First affected authority | Required reopen | Current treatment |
|---|---|---|---|
| new/changed typed root field or schema-version variant | formal 03 object/config contract | DDD Steps 6/14 plus affected protocol/flow/test Steps; 04 Steps 7~14 | unsupported; no implementation |
| adapter constructor/Port/callable/error/typed outcome changes | formal 03 Port/error/flow | DDD Steps 7/9/12/14; then 04 | affected boundary stopped |
| new profile/source/entry/binding kind | architecture + formal 03 | 01, DDD Steps 6/14, 04 Steps 4~14 | unsupported |
| config center/admin override/watch/hot reload/online LKG | architecture/runtime lifecycle | 01, DDD Steps 4/7/9/12/14/15, 04 Steps 3~14 | rejected in v1 |
| public deprecation warning or config API | formal 03 protocol/error | DDD Steps 8/9/12/15, then 04/05/06 | no public warning now |
| Hub-owned config audit repository/event/state | formal 01/03 data/observation | architecture + DDD objects/Ports/persistence/flow/observation | forbidden until reopened |
| product needs raw secret/body/provider route/cost/failover | security/responsibility | reject or upstream architecture restart | cannot be accepted as adapter-private shortcut |
| runtime/tools/listing/approval/method body/SDK delivery requested | formal 00/01 responsibility | reject and hand to owning project | out of scope, not a Hub backlog item |

### 8.5 Blocking-scope matrix

| Deliverable / action | Current gate | Blocking items | Current allowed action |
|---|---|---|---|
| formal 04 assembly | open after this Step | none | Step 15 source assembly and static audit |
| formal 05 rebuild | blocked until formal 04 | `CH-CFG-R14` | start T022 after T021 |
| formal 06 rebuild | blocked until formal 05 | `CH-CFG-R14` | start T038 after T037 |
| formal 07 | blocked until formal 05/06 | `CH-CFG-R03/R14/R15` | start T054 after T053 |
| implementation start | blocked | `CH-CFG-R03`, formal 07/ledgers; product-specific boundaries add R04~R12 | design only |
| Deployment configured boundary | blocked per product | R04~R13 and formal 09 | no readiness/deployment claim |
| Local/Integration design and future fake tests | design complete, execution absent | formal 05/07/repo | write plans only, no pass claim |
| future V2/dynamic config | unsupported | R16 + trigger register | reject proposal until design reopen |

## 9. 风险停审与跨回写审计

| Audit item | Result | Notes |
|---|---|---|
| Steps scanned | `13/13` | all impact/risk/open sections |
| active risk items classified | `17/17` | owner/scope/action/target present |
| current accepted conclusion changes 03 | `0/13` | all current statuses `无回写` |
| current `待回写` | `0` | Step 15 gate passes |
| current `阻塞待确认` | `0` | Step 15 gate passes |
| unresolved upstream blocker | `0` | downstream/product prerequisites retained |
| future trigger mislabeled current contract | `0` | separate register |
| product/path/value/backend invented | `0` | unselected facts retained |
| downstream missing docs called complete | `0` | exact blocked scopes recorded |
| fake implementation/test/evidence/signoff/deployment | `0` | none |
| raw secret/body/sensitive digest leakage | `0` | omit/fail-closed rules retained |
| forbidden responsibility as open Hub feature | `0` | out-of-scope register retained |
| historical README/05/06 authority restored | `0` | historical only |
| Rust contract/comment delta | `0/0` | future change keeps full English `///` gate |

## 10. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| classify 17 risks and distinguish downstream blocked scopes | 否 | risk governance | 不适用 | 无回写 |
| retain two L0-core debts with exact assumptions/reopen triggers | 否 | upstream debt monitoring | formal 03 §17 already owns debt | 无回写 |
| allow formal 04 assembly with product-neutral unimplemented material | 否 | configuration/document lifecycle | formal 03 delegates raw/product detail | 无回写 |
| keep future contract-changing capabilities out of current P0 | 否 | controlled-reopen policy | trigger register only | 无回写 |

Detailed-design gate: `待回写=0`, `阻塞待确认=0`. No current conclusion has `是否影响03=是`. Future triggers are not accepted conclusions and must be activated/reassessed before implementation.

## 11. Formal §14 回填草稿

Formal `04-配置设计.md` §14 must include:

1. the seven-class risk taxonomy；
2. all 17 active risks with owners, blocking scopes, interim rules and targets；
3. open-question and blocking-scope tables；
4. 13/13 current detailed-design impact ledger；
5. future controlled-reopen triggers；
6. Step 15 gate: `待回写=0`, `阻塞待确认=0`, upstream blocker=0；
7. explicit truthfulness note that formal design does not prove product/repo/test/acceptance/deployment readiness。

Formal §14 may compact wording but may not drop IDs, blocked scopes, the two L0-core debt assumptions, target-repo prerequisite, historical README/05/06 disposition or future stop rules.

## 12. 待确认事项

All current open questions are recorded in §8.2 with exact treatment. None requires an answer to assemble product-neutral formal 04. They remain mandatory preflight inputs for their downstream boundary and cannot be silently marked resolved by Step 15.

## 13. Step 15 entry gate

| Condition | Result |
|---|---|
| all Step 1~13 open items recorded | pass |
| risk owner/blocking scope/interim action/target complete | pass `17/17` |
| current detailed-design impact ledger complete | pass `13/13` |
| current pending writeback | `0` |
| current blocking confirmation | `0` |
| current upstream blocker | `0` |
| formal 04 source chapters available | pass Steps 1~14 |
| product/implementation/evidence facts remain unclaimed | pass |
| future triggers excluded from P0 contract | pass |

Step 14 is complete and Step 15 may assemble formal `04-配置设计.md`. Step 15 must read all Steps 1~14, use the exact 15-chapter writing-standard chain, preserve per-chapter calibration sources, and run source/key/profile/failure/cross-document audits before marking T021 complete.
