# L3-capability-hub 05 测试方案 Step 14: 回归策略与残余风险

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 14
> 书写规范: `standards/document/测试方案书写规范.md` §5.14
> 上游状态: Steps 1~13 completed
> Step 状态: `accepted-design / not-executed`
> 日期: 2026-07-25

本文定义 change-to-regression、全量门禁、风险分类、风险接受资格和受控重开合同。本文不执行回归，不创建缺陷、run、artifact、报告、风险接受记录、签署或release事实。

---

## 1. 本步目标、输入与边界

### 1.1 目标

1. 将 requirement/design/config/code/test-tool/evidence变化映射到exact canonical case、suite、check与gate回归范围。
2. 区分targeted diagnosis、minimum change regression、full main regression、selected integration regression和release requalification，防止小范围pass冒充P0完整退出。
3. 固定触发`10 suites / 189 canonical TC / 638 state pairs / 9 checks`全量main的条件。
4. 汇总当前设计债务、实现/产品/运维前置条件、future evolution和out-of-scope guard；不把尚未满足的前置条件伪装成“已接受风险”。
5. 明确哪些未来residual具备formal 06风险接受资格，哪些S/P0-A/VF/redaction/ownership/evidence问题永远不可接受。
6. 给Step 15正式装配、formal 06验收裁决和formal 07实施boundary提供可直接引用的回归合同。

### 1.2 输入

| 输入 | 本步承接 | 不得改写 |
|---|---|---|
| formal 00~04 | requirements、truth/redline、objects/flows/state/TX/config/observation authority | 不通过回归策略降低P0语义 |
| Step 3/5/6 | 189 exact obligations、requirement/AC/VF追溯、canonical TC/DS/EV identity | 不增删canonical denominator |
| Steps 8~10 | seven environments、ten suites/five gates/nine checks、20 NFR specialties | 不声称环境/script/gate存在 |
| Step 11 | seven observation classes、S/A/B、13 VF、13 change surfaces和retest规则 | 不允许S/P0-A waiver |
| Step 12 | P0/selected/release separate entry/exit | targeted回归不得替代full main |
| Step 13 | 189 formal EV contract、raw/report/provenance/review/retention | 不创建evidence instance或接受记录 |
| DDD Step 18 / Config Step 14 | active debt/prerequisite/reopen/out-of-scope inventory | 不虚报resolved或accepted |

### 1.3 本步不做

- 不选择CI平台、issue tracker、产品、环境、adapter、observability backend、artifact store或retention数字。
- 不预填具体人名、risk acceptance ID、时间、签名、审批结果或缺陷状态。
- 不继承旧formal 05/06的P95、30s、99.9%、KMS/Vault、旧TC或旧对象。
- 不把selected product unavailable、目标仓缺失、formal 07未完成或真实测试未执行记为P0 pass。
- 不把runtime/tools execution、governance approval、method body/source、marketplace listing、provider route/cost或SDK client/cache纳入Hub正向回归。
- 不修改formal 05；只有Step 15可以装配。

## 2. SOP 五问回答

| # | 问题 | 收口答案 |
|---:|---|---|
| 1 | 哪些变更触发最小回归？ | 任何formal source、public/internal contract、flow/state/TX/config/binding/observation、fixture/generator、gate/check/report变化，至少执行changed identity、同family风险分支、primary suite、直接消费者suite和适用checks；见§5。 |
| 2 | 哪些变更触发全量回归？ | requirement/AC/VF、public protocol/digest、shared invariant/state generator、UoW/idempotency/commit semantics、dependency/ownership/redaction、config graph/profile/entry、gate status/provenance/evidence schema变化，任一S修复或P0漏检均触发完整main；见§6。 |
| 3 | 哪些风险暂不覆盖？ | 真实实现/环境尚不存在；具体durable/external/source/route/TLS/observer产品、production capacity/SLO、numeric retention、future schema evolution和外围P2增强均没有执行覆盖。它们按前置条件或future risk登记，不被写成passed。 |
| 4 | 谁接受残余风险？ | 只有formal 06定义的验收责任角色可对合格B/non-P0 residual作出真实接受；架构/安全/测试/运维owner需共同确认适用面。当前没有真实接受人或签署，状态均为`pending_not_accepted`或`not_eligible`。 |
| 5 | 哪些风险必须转入验收标准？ | P0/selected/release适用性、selected product证据、numeric threshold absence、evidence retention policy、B/residual资格、13 VF、S/P0-A、evidence/review/signoff provenance必须由formal 06闭合。 |

## 3. 诊断、概念和取舍

### 3.1 问题诊断

| 问题 | 风险 | 本步处理 |
|---|---|---|
| Step 11偏向缺陷修复 | non-defect design/config/tool变化漏回归 | 扩为13类change surface |
| minimum regression容易被当P0完成 | 189 denominator被缩小 | 明确minimum只证明changed scope；正式P0仍需full main |
| shared source影响难以定位 | 单suite绿但相邻owner回归 | direct consumer + cross-suite扩散规则 |
| report/evidence变化被当非业务 | 可静态造证据或改写失败 | provenance变化强制pairing/no-static并常触发full main |
| “暂不覆盖”混同“接受” | 无人签署却被放行 | prerequisite、pending risk、accepted residual三态分离 |
| 无正式数字政策 | 擅造性能/保留阈值 | 保持not_evaluated并转formal 06/09 |
| selected unavailable可能被P0掩盖 | release parity虚构 | P0、selected、release回归分别裁决 |

### 3.2 回归层级

| Level | Purpose | Minimum content | Can establish P0 exit? |
|---|---|---|---|
| `R0-targeted-diagnostic` | 重现单一finding/开发反馈 | exact TC/parameter/check only | no |
| `R1-minimum-change` | 证明changed surface和直接相邻面 | changed TC + family branches + primary/consumer suites + checks | no |
| `R2-full-main` | 重新证明完整P0 semantic baseline | 10 suites、189 TC、638 pairs、9 applicable main checks、Step13 evidence chain | yes,if all Step12 criteria genuinely pass |
| `R3-selected-integration` | 证明chosen product parity | bound selected subset + Deployment artifact + product-safe checks | no P0 substitute;required only where manifest says |
| `R4-release-requalification` | 重新形成release/acceptance handoff | explicit passed main/selected refs + release smoke + 9 checks + reports/review-ready bundle | no acceptance decision by itself |

任意层级的实际执行必须使用新的显式run ID并按Step 13留证。R0/R1可供实现反馈与缺陷复验，但不能缩小R2 denominator。

### 3.3 取舍

| Option | Decision | Reason |
|---|---|---|
| 每次变化都直接全量 | reject as default | 可按风险最小定位，但硬触发器仍全量 |
| 只跑changed case | reject | shared builders、state、UoW、report链会扩散 |
| selected真实产品替代controlled P0 | reject | 产品可用性和P0语义authority不同 |
| evidence/report变化只跑脚本unit | reject | 必须证明真实suite raw到report链未被篡改 |
| 自动retry后只保留pass | reject | flaky和旧失败provenance必须保留 |
| 当前文档直接接受residual | reject | formal 06和真实owner尚未裁决 |

## 4. Change impact selection algorithm

每个future change/fix必须先生成immutable impact manifest，按以下顺序求回归范围：

```text
changed formal source / file / declaration / config row / script
  -> exact Step 3 cut identities
  -> canonical TC / DS / EV identities
  -> primary suite owners
  -> shared producer and direct consumer suites
  -> mandatory checks
  -> full-main trigger evaluation
  -> selected/release applicability evaluation
  -> explicit run manifests and Step 13 evidence contract
```

### 4.1 Impact manifest fields

| Field | Required content | Failure behavior |
|---|---|---|
| change identity | future commit/change ref and source baseline | absent -> regression selection blocked |
| changed authority | exact formal section/cut/config row/public declaration/script contract | vague “module changed” insufficient |
| impacted TC/DS/EV | finite exact set or reviewed closed range | empty set requires explicit no-behavior proof |
| primary/consumer suites | exact Step 9 suite IDs | owner omission blocks selection |
| checks | exact applicable 9-check subset | redline check cannot be waived |
| full-trigger decision | yes/no + rule ID | no implicit judgment |
| selected/release impact | required/not-applicable-by-manifest + reason | unavailable not equal not-applicable |
| baseline and run refs | only at actual execution | design plan leaves placeholders empty |

### 4.2 Expansion rules

1. Exact failed/changed TC and every affected parameter identity always run.
2. Shared helper/generator/codec/policy/guard changes expand to every canonical owner using it, not a representative sample.
3. State generator/transition classifier changes rerun all 638 pairs even if onefamily changed;case owner remains24 STATE cases.
4. Repository/UoW/idempotency changes expand to every Command/Inbound/Outbound/Job consumer that uses the changed authority.
5. Config/binding changes expand through V0~V8、Stage 0~7、entry barrier、failure cleanup and affected API/Worker/Jobs entry.
6. Observer/redaction changes rerun every changed producer profile and scan all generated raw/report surfaces.
7. Gate/check/report schema/status/provenance changes must execute real nonpass fixtures and at least one complete suite-to-report chain;full triggers apply per§6.
8. Any uncertain impact defaults to broader R2, never to an unrecorded waiver.

## 5. Exact regression trigger matrix

| ID | Changed/fixed surface | R1 exact minimum | Mandatory adjacent suites/checks | R2/R4 trigger | Responsible role |
|---|---|---|---|---|---|
| `REG-CH-01` | protocol/ref/metadata/codec/digest/public schema | changed FOUNDATION/flow TC + all codec/digest negative fixtures | static-contract-docs；direct service/entry consumers；case manifest、Rustdoc、redaction | any public wire/digest/identity/provenance semantic change -> R2 + release requalification | contracts + test owner |
| `REG-CH-02` | domain object/factory/policy/state guard | changed member/state TC and all legal/reserved/illegal branches in affected families | domain-state；service/repository consumers；state registry | shared invariant/terminal/no-op/exposure guard or state generator -> all638 + R2 | domain owner |
| `REG-CH-03` | Command/application/UoW orchestration | changed CMD plus accepted/rejected/duplicate/conflict/unknown/rollback branches | service-command-query；repository/outbound/observation as called；case manifest | atomic members、idempotency、trace/capture、commit terminal or formal write-set -> R2 | application owner |
| `REG-CH-04` | Query/visibility/degraded/read model | changed QUERY plus no-write/unavailable/invalid/stale branches；all33 if shared query helper | service-command-query；domain/repository/config/observation；responsibility | any Query write、body ownership、formal visibility source or shared projection -> R2 | application owner |
| `REG-CH-05` | API/Inbound/Worker header/source/receipt/lifecycle | changed INBOUND + relevant FOUNDATION05/06 and all affected six-source branches | entry-inbound；service/runtime/config/redaction | entry barrier、body/source ownership、receipt/replay or owned invocation cancellation -> R2/R4 | API/Worker owner |
| `REG-CH-06` | Outbound immutable snapshot / A-B-C collaboration | changed OUTBOUND + TX17..19 branches | outbound-collaboration；repository/service/jobs/observation；responsibility/redaction | local truth、stable intent、external status ownership、route family or retry semantic -> R2/R4 | collaboration owner |
| `REG-CH-07` | Job plan/ordinal/journal/report/reentry | changed JOB + TX20 and immutable report formations | jobs-lifecycle；repository/outbound/config/pairing | frozen plan、target order、reentry、terminal/final report or no-repair semantic -> R2/R4 | Jobs owner |
| `REG-CH-08` | repository method/UoW/idempotency/commit/race | changed FOUNDATION04/16/18 + affected TX + exact repository methods | repository-transaction；all service/entry/outbound/jobs consumers；state registry as affected | authority、110-method contract、commit tri-state、winner/result store、CAS/ordering -> R2/R4 | persistence owner |
| `REG-CH-09` | runtime binding/config/profile/entry/provider/retry | affected BIND + CONFIG and exact catalog rows/stages | runtime-binding + configuration-strict + affected entries；config/dependency/Rustdoc | graph、profile、entry、source priority、Configured/Disabled/Missing、retry/cleanup/safety -> R2/R4 | config/infra owner |
| `REG-CH-10` | observability/redaction/audit profiles | affected OBS + CONFIG16 + producer flow branches | observability-redaction + every changed producer suite；redaction/responsibility | selector/redactor/sink、profile schema、business-neutrality or forbidden corpus -> R2/R4 | observability/security owner |
| `REG-CH-11` | gate/check/report/evidence/index/review pipeline | failing and passing tool fixtures + actual affected suite raw-to-report projection | pairing、no-static、case manifest、redaction and changed check；referenced suites | aggregate status、denominator、digest/path、EV/AC/VF schema or acceptance draft logic -> R2/R4 | test tooling/release owner |
| `REG-CH-12` | Rust public documentation/declaration shape | failed declaration plus full Rustdoc scan | static-contract-docs；Rustdoc；compile/dependency if signature changed | any declaration/schema/field/variant/payload/trait/method/callable semantic change -> R2 | contracts/documentation owner |
| `REG-CH-13` | dependency graph/product binding/public type source | full graph/import/signature scan + affected Port/binding cases | static-contract-docs + runtime-binding/configuration；dependency/responsibility | any sibling edge、public foreign type、copied replacement or ownership direction -> R2/R4 | architecture/dependency owner |

结构体注释门禁属于`REG-CH-12`：future public Rust每个declaration、struct field、enum variant及payload field、trait、method和callable均需英文`///`；enum struct-variant fields不得写field-level `pub`。任何遗漏至少A级并阻断当前P0退出。

## 6. Full main and release trigger contract

### 6.1 R2 full-main denominator

```text
10 primary suites
189 / 189 canonical TC
189 / 189 canonical DS
189 / 189 formal EV contracts represented by raw-derived rows
638 / 638 state pairs = 239 current + 98 reserved + 301 illegal
9 mandatory checks according to main manifest
all Step 13 raw/report/provenance gates
```

R2使用Step 9 exact ten suite IDs，不创建新的“回归suite”。任何suite/case/pair/check缺失、重复、nonpassed或invalid都使R2不完整。

### 6.2 Unconditional R2 triggers

| Trigger ID | Trigger | Required consequence |
|---|---|---|
| `FULL-CH-01` | formal 00 requirement/BR/NFR/AC/VF semantic change | reopen owning design/test steps；new baseline后R2 |
| `FULL-CH-02` | formal 01~04 truth ownership、public contract、flow/state/TX/config/observation semantic change | impacted design sync + R2 |
| `FULL-CH-03` | any S defect fix or any `VF-CH-001..013` related change | R2；R4 before handoff |
| `FULL-CH-04` | P0 A reveals shared contract or unknown impact | R2 after focused fix verification |
| `FULL-CH-05` | previously missing P0 branch/assertion/check or denominator drift | controlled reopen Step 6/9 as needed；R2 |
| `FULL-CH-06` | shared protocol/digest/state generator/UoW/idempotency/repository authority changed | R2 with all638 where state-related |
| `FULL-CH-07` | config graph/profile/entry/source priority/fail-fast/fallback/barrier semantics changed | R2 |
| `FULL-CH-08` | dependency/responsibility/redaction/Rustdoc scanner or governing redline changed | R2；R4 if release evidence affected |
| `FULL-CH-09` | gate aggregate/status/required-cell/retry semantics changed | nonpass tool fixtures + R2 |
| `FULL-CH-10` | raw/report/evidence schema、digest/pairing/no-static logic or AC/VF mapping changed | R2 + rebuilt reports；R4 |
| `FULL-CH-11` | source/config baseline changes after any formal evidence run begins | preserve invalidated run；new R2 run |
| `FULL-CH-12` | impact cannot be bounded with exact TC/suite/check set | default R2；no guess-based minimum |

### 6.3 R3/R4 triggers

| Condition | R3 selected | R4 release |
|---|---|---|
| selected product/adapter/config version changes | rerun exact selected parity subset | required if release manifest consumes that product |
| Deployment artifact/credential/TLS ref changes | rerun affected constructors/barrier/product-safe cleanup | rerun release checks and handoff reports |
| release smoke/check/report builder changes | selected only if product scope affected | always requalify R4；cannot reuse old summary |
| main baseline or run changes | selected result must bind compatible baseline or rerun | new explicit main reference required |
| product unavailable | `blocked_dependency` | release blocked when required；never P0 compensation |

## 7. Regression evidence and defect pairing

| Regression level | Future evidence requirement | Prohibited shortcut |
|---|---|---|
| R0 | raw diagnostic result with explicit run/attempt and safe reason | overwriting original failure |
| R1 | exact impact manifest、affected suite/check raw/report、EV rows、scope summary | calling it full P0 |
| R2 | complete Step 13 run bundle for exact denominator | stitching passing rows from unrelated runs |
| R3 | selected product/config manifest、subset raw/report、unavailable truth | treating unavailable as not-applicable/pass |
| R4 | explicit lower-run refs、release raw/checks/reports、review-ready acceptance drafts | release script self-approving acceptance |
| defect retest | immutable failed run + distinct fixed run + impacted regression set | deleting failure or using same run ID |

Any changed source/config after execution starts invalidates that run for formal evidence. Reports may compare runs but no single`EV`instance can merge raw rows from multipleruns。

## 8. Risk taxonomy and acceptance eligibility

| Class | Meaning | Current P0 effect | Acceptance eligibility |
|---|---|---|---|
| `non_blocking_design_debt` | current exact assumption works but upstream formal sync may change | no block until trigger；monitor | not a run residual；reopen on trigger |
| `implementation_prerequisite` | design closed but repo/code/script/environment fact absent | blocks implementation/execution scope | not acceptable as proof |
| `selected_prerequisite` | chosen product/config/credential/environment needed for R3/R4 | no P0 substitute；blocks selected/release scope | may be recorded as non-P0 unavailable only when release does not require it |
| `acceptance_policy_pending` | formal 06 owner/criterion/policy not yet closed | blocks corresponding acceptance claim | formal 06 must decide,not this Step |
| `operations_policy_pending` | deployment/SLO/retention/alert/runbook fact absent | blocks production operations claim | formal 09/owner must decide |
| `controlled_reopen` | future selection may require contract delta | no current block；trigger blocks affected scope | not waivable if contract mismatch occurs |
| `future_evolution` | unsupported future feature/version | no current P0 block | may be deferred,never claimed tested |
| `out_of_scope_guard` | responsibility belongs elsewhere | proposed Hub implementation blocked | never accepted into Hub scope |
| `eligible_execution_residual` | real B/non-P0 finding with complete evidence and no P0/VF impact | formal 06 decision required | only class eligible for real acceptance |

## 9. Current risk and prerequisite register

No row below is a real accepted residual。`Acceptance status` is deliberately `not_eligible` or `pending_not_accepted`。

| ID | Risk / missing fact | Class | Exact impact | Interim mitigation / test rule | Owner / formal target | Acceptance status |
|---|---|---|---|---|---|---|
| `CH-TEST-R01` | L0-core `IdempotencyKey::as_str()` byte semantics not formalized upstream | non_blocking_design_debt | normalized key/digest/inbound fixtures if semantics change | pin exact raw UTF-8 bytes；no trim/case-fold/normalization/Display/serde substitute | L0 contracts + Hub contracts/test；reopen DDD 8/13/14/16 and 05 | not_eligible |
| `CH-TEST-R02` | shared serde wire shape is not an upstream permanent promise | non_blocking_design_debt | protocol fixtures/digests/compatibility | pin audited v1 bytes；dependency delta triggers codec/full regression | L0 contracts + Hub test；reopen DDD 8/13/14 and 05 | not_eligible |
| `CH-TEST-R03` | target implementation repo/Cargo/workspace/git facts absent | implementation_prerequisite | all code/test/gate/report execution | formal 07 preflight；claim no repo/branch/commit/command result | repository owner + formal 07 | not_eligible |
| `CH-TEST-R04` | gate/check/report scripts and test harness not implemented/proven | implementation_prerequisite | all R0~R4 execution/evidence | formal 07 boundaries must implement and self-test nonpass paths | test tooling owner + formal 07 | not_eligible |
| `CH-TEST-R05` | durable local authority product/schema/migration capability unselected | selected_prerequisite / controlled_reopen | selected repository parity and Deployment | P0 controlled authority provesPort semantics；no inMemory fallback；product mismatch reopens03/04 | architecture/persistence/07/09 | pending_not_accepted |
| `CH-TEST-R06` | 9 external Port adapters、6 Worker source mechanisms、10 routes unselected | selected_prerequisite / controlled_reopen | R3 external/source/route parity | Fake/Controlled/Disabled P0；Configured unavailable blocks selected/release | adapter/source/collaboration owners + 07/09 | pending_not_accepted |
| `CH-TEST-R07` | secret provider、TLS/memory/zeroization/session API unselected | selected_prerequisite / controlled_reopen | Deployment constructor/security/redaction proof | shortest lifetime and ref-only contract；no raw value/fallback；selection reopens03/04 | security/provider owner + 07/09 | pending_not_accepted |
| `CH-TEST-R08` | concrete observability backend/facade/sink fallback unselected | controlled_reopen | production signal implementation and selected parity | P0 exact backend-neutral profiles + Off/Redacted；no business effect | observability/config/infra + 07/09 | pending_not_accepted |
| `CH-TEST-R09` | constructor readiness probes、artifact store、review/cutover/unknown-resolution mechanism unselected | implementation_prerequisite | activation/release/config rollback evidence | deterministic barrier and immutable product-neutral artifact contract；no fabricated probe/cutover | config/release/operations + 07/09 | not_eligible |
| `CH-TEST-R10` | numeric performance/capacity/SLO baseline absent | acceptance_policy_pending / operations_policy_pending | no numeric latency/throughput/availability verdict | collect mandatory samples only；structural oracles remain blocking | product/architecture/SRE + formal 06/09 | pending_not_accepted |
| `CH-TEST-R11` | evidence retention days/backend/access/deletion policy absent | operations_policy_pending | cannot claim long-term retention compliance | Step13 event-based minimum；no deletion before formal policy | security/operations/acceptance + formal 06/09 | pending_not_accepted |
| `CH-TEST-R12` | formal 06 acceptance roles、risk decision and signoff contract not rebuilt | acceptance_policy_pending | no acceptance/risk/signature claim allowed | complete T038~T053；all draft decisions remainempty | acceptance design owner | not_eligible |
| `CH-TEST-R13` | formal 07/implementation boundaries and implementation ledger not built | implementation_prerequisite | implementation cannot start from test plan alone | complete T054~T069；initializepre-implementation only | implementation-plan owner | not_eligible |
| `CH-TEST-R14` | alert thresholds/windows/routes/dashboard/runbook and formal 09 absent | operations_policy_pending | no production monitoring/operations readiness claim | retain exact safe profile intent；formal09 selects real platform facts | SRE/security/operations | pending_not_accepted |
| `CH-TEST-R15` | first release/schema matrix and future dual-version/dynamic config need unknown | future_evolution | only future compatibility/migration | current initial v1 candidate；unknown schema anddynamic reload rejected | design/release owner；future03/04/05/07/09 reopen | pending_not_accepted |
| `CH-TEST-R16` | README retains execution/provider/cost/approval shorthand and peripheral P2 capabilities remain outside core | out_of_scope_guard / future_evolution | reader confusion or responsibility absorption | formal00~05 outrank README；T070 disposition；negative boundary tests only | Hub design owner / owning external projects | not_eligible |

Count audit: 16/16 rows haveclass、impact、interim rule、owner/target and explicit acceptance status。No status is`accepted`。

## 10. Future execution residual record contract

Only a real finding classified `eligible_execution_residual` may enter formal acceptance review。

| Field | Required | Rule |
|---|---|---|
| residual ID | yes | created by real process,not prefilled here |
| explicit baseline/run/evidence refs | yes | no static/implicit run |
| observation class and severity | yes | only confirmed B/non-P0 eligible |
| impacted TC/EV/AC and excluded VF | yes | VF impact set must beempty |
| reason not fixed before decision | yes | concrete,not “known issue” |
| bounded impact and duration | yes | cannot cover unknown/P0 scope |
| mitigation/monitor/reopen trigger | yes | exact owner and action |
| accepting authority | yes | must be authorized by formal06 |
| decision/status/timestamp/signature provenance | yes when actually decided | absent now；no fabricated value |
| expiry/review point | yes | indefinite acceptance forbidden |

### 10.1 Never acceptable

| Finding | Required disposition |
|---|---|
| any `VF-CH-001..013` | fix/retest；S；R2/R4 as applicable |
| any confirmed S | fix/retest；no waiver |
| current P0 A | fix/retest before P0 exit/handoff |
| design contradiction/missing P0 oracle | reopen exact formal owner |
| P0 prerequisite unavailable | gate blocked；not residual pass |
| forbidden body/secret/material leak | fix + full affected redaction scan |
| forbidden responsibility/dependency ownership | remove + dependency/responsibility/full regression |
| static/raw-less/cross-run evidence or digest mismatch | invalidate evidence；repair pipeline + rebuild from raw |
| missing canonical TC/DS/EV/pair/suite/check | incomplete R2；no count waiver |
| fake review/signature/acceptor | invalidate acceptance material |

## 11. Formal 06 and 07 handoff

### 11.1 Mandatory formal 06 decisions

| Item | 05 supplies | 06 must decide |
|---|---|---|
| P0/selected/release relationship | separate Step12/R2~R4 contracts | exact acceptance applicability and required run refs |
| functional/redline gates | 189 EV and 13 VF consumers | pass/fail/veto decision matrix |
| NFR numeric absence | samples + structural oracles | keep not_evaluated or establish sourced threshold through controlled reopen |
| residual eligibility | taxonomy + never-acceptable list | authorized roles、decision fields、expiry/reopen conditions |
| retention | event-based minimum | any formal duration/access/deletion policy or downstream owner |
| review/signoff | evidence/review schema | final decision and signature provenance contract |

### 11.2 Mandatory formal 07 tasks

| Task family | Required implementation-plan output |
|---|---|
| impact manifest | boundary task for change-to-cut/TC/suite/check generation and audit |
| suite/gate/check scripts | exact ten/five/nine future interfaces and nonpass fixtures |
| report/evidence pipeline | Step13 schemas、pairing/no-static/redaction and acceptance drafts |
| regression gates | R0~R4 invocation/inputs/outputs/failure behavior by boundary |
| preflight | target repo、core-contracts、product/config/environment availability |
| implementation ledger | pre-implementation state,then real boundary/run/evidence refs only after execution |

## 12. Stop review and cross-risk audit

### 12.1 Regression stop review

| Review item | Design conclusion | Gap |
|---|---|---|
| all 13 change surfaces have minimum scope | pass-designed | no actual change/run evaluated |
| shared changes expand to consumers | pass-designed | implementation call graph future input |
| all638 state pairs protected | pass-designed | generator/results not implemented |
| exact R2 denominator preserved | pass-designed | execution pending |
| R3/R4 cannot compensate R2 | pass-designed | selected products pending |
| new run/provenance required after change | pass-designed | no run exists |

### 12.2 Risk stop review

| Review item | Design conclusion | Gap/target |
|---|---|---|
| current risks classified | `16/16` | future owners must verify real prerequisites |
| fake accepted residual | 0 | formal06 pending |
| row without owner/target | 0 | none |
| row without interim rule | 0 | none |
| VF/S/P0-A acceptance path | 0 | forbidden |
| implementation prerequisite called pass | 0 | all explicit nonproof |
| numeric threshold invented | 0 | formal06/09 pending |

### 12.3 Cross-regression/residual audit

| Audit item | Result |
|---|---|
| P0 change with no regression owner | 0 |
| suite/check name invented beyondStep9 | 0 |
| targeted/minimum called P0 complete | 0 |
| P1 unavailable called P0 pass | 0 |
| old failure overwrite path | 0 |
| evidence without new explicit run | 0 |
| accepted risk/person/signature fabricated | 0 |
| out-of-scope responsibility moved intoHub | 0 |
| upstream blocker | 0 |

## 13. Upstream impact, formal fill draft and Step 15 gate

### 13.1 Upstream impact

| Conclusion | Upstream impact | Disposition |
|---|---|---|
| 13 change surfaces and R0~R4 derive from existing cases/suites | none | test execution strategy |
| 16 current risks align with DDD/config risk registers | none | preserve unresolved prerequisites honestly |
| formal06 roles/decisions absent | downstream work | T038~T053,not upstream blocker |
| formal07/repo/scripts absent | downstream/implementation prerequisite | T054~T069,not design blocker |
| future product/threshold/schema selection may change contracts | conditional | controlled reopen exact owner before implementation |

Current writeback / blocking confirmation / unresolved upstream blocker = `0 / 0 / 0`。

### 13.2 Formal `05` §14 fill draft

Formal §14应装配：R0~R4层级；impact selection；13类trigger matrix；R2 exact denominator和12个full triggers；R3/R4 rules；regression evidence；risk taxonomy；16项risk/prerequisite register；future residual schema；never-acceptable list；formal06/07 handoff。不得写入SOP问题、设计取舍、真实run/result/accepted status/person/signature。

### 13.3 Step 15 entry gate

| Criterion | Result |
|---|---|
| Steps 1~14 all independent artifacts complete | pass-designed |
| 189 TC/DS/EV and 638 pair authority unchanged | pass-designed |
| 13 change surfaces and full-main triggers closed | pass-designed |
| risk register has class/owner/impact/mitigation/status | `16/16` |
| never-acceptable set includes all VF/S/P0-A/evidence redlines | pass-designed |
| formal06/07 handoff explicit | pass-designed |
| unresolved upstream blocker | 0 |
| fabricated implementation/test/evidence/risk acceptance/signoff | 0 |

Step 14完成，可以进入Step 15正式文档装配。正式`05-测试方案.md`在Step 15写入前仍是historical material。
