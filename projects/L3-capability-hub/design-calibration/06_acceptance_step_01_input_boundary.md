# L3-capability-hub 06 验收标准 Step 1: 确认验收输入边界

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/验收标准书写规范.md` §5.1
> 回填章节: `06-验收标准.md` §1
> Step 状态: `completed-designed / continuous execution`
> 日期: 2026-07-25

---

## 1. 本步目标、输入与输出

### 1.1 目标

确认新版formal 06承接哪些requirement、architecture、HLD、DDD、configuration、test/evidence和delivery输入，哪些问题必须由验收标准裁决，哪些问题继续由上游或formal 07/09负责。

本Step不定义具体gate，不固定真实delivery/run，不填写pass/fail、risk decision或signature。

### 1.2 已读取输入

| Input | Status | Exact Step-1 use |
|---|---|---|
| `00-需求文档.md` | active formal | 5 closures、16 FR、37 BR、20 NFR、37 AC、13 VF、data/responsibility boundaries |
| `01-架构设计.md` | active formal | truth ownership、dependency direction、cross-boundary and security redlines |
| `02-概要设计.md` | active formal | 8 components、43 object outlines、interface/flow/state/error groupings |
| `03-详细设计.md` | active formal | exact public/object/Port/repository/flow/state/TX/error/binding/observation contracts |
| `04-配置设计.md` | active formal | strict source/profile/entry/catalog/activation/failure/secret boundaries |
| `05-测试方案.md` | active formal | 189 TC/DS/EV contracts、suites/gates/checks/reports、entry/exit、defect/evidence/regression rules |
| `05_test_plan_step_05_traceability_coverage.md` | active exact expansion | bidirectional AC/VF/cut mappings |
| `05_test_plan_step_13_evidence.md` | active exact expansion | raw/report/EV schema、same-run predicate、37 AC/13 VF consumers |
| `05_test_plan_step_14_regression_risks.md` | active exact expansion | R0~R4、16 current risks、never-acceptable set |
| current formal 06 | historical material | old subject/topology/threshold/evidence contamination only |
| acceptance SOP/writing standard | governing standards | 15-Step order、item-loop、15 formal chapters and output rules |

### 1.3 Required outputs

1. authority/input map；
2. acceptance must-answer and must-not-answer registries；
3. test evidence and future delivery baseline boundary；
4. historical material disposition；
5. formal §1 fill draft and Step 2 gate。

## 2. SOP five-question answers

| SOP question | Closed answer |
|---|---|
| 1. 本轮依据哪些需求和设计？ | 只依据active formal 00~05及其exact calibration expansion。00定义AC/VF和责任；01~04定义可判定design/config contract；05定义如何产生、校验和保留evidence。旧06/README不得成为authority。 |
| 2. 哪些测试证据支撑裁决？ | 189个`EV-CH-*` formal contracts及其未来explicit-run instances；fixed roots为`artifacts/test/<run_id>`、`reports/runs/<run_id>`，acceptance/review drafts必须显式引用run。九checks用于qualify/invalidate bundle但不新增EV。 |
| 3. 哪些版本、环境和数据成为基线？ | Step 3未来固定formal refs/digests、implementation source revision、core dependency、immutable config/profile/entry、environment、189 TC/DS/EV manifests、638 registry、run/artifact/report refs。当前真实值均未建立。 |
| 4. 哪些内容不应进入06？ | requirement/design/test-case invention、fixture/harness/script implementation、commit/phase planning、product selection、deployment/runbook、production threshold/retention detail、runtime/tools execution、approval、method body、marketplace listing、provider route/cost、SDK client/cache。 |
| 5. 是否有阻塞06生成的上游缺口？ | 无。00~05设计authority足以定义future acceptance contract。真实delivery/environment/run/evidence缺失阻止实际进入验收和真实verdict，但不阻止Steps 1~15设计。 |

## 3. Current material diagnosis

| Material / location | Problem | Disposition |
|---|---|---|
| old formal 06 structure | 10 chapters, no exact calibration sources | whole-file historical；Step 15 replace |
| old functional gates | Register MCP/A2A/provider、policy decision、cost/audit are obsolete owners | no alias；derive only from current AC/FR/design |
| old environment baseline | test/staging PG、KMS/Vault、bus、dry-run consumers assert unselected products | do not inherit；Step 3 requires explicit future baseline |
| old evidence cells | API/DB/log/model review have no TC/EV/run/digest | replace by canonical same-run evidence predicate |
| old NFR table | P95/30s/100% values conflict with current not-evaluated numeric policy | historical denylist；cannot become acceptance threshold |
| old defect release | A “视情况” has no owner/evidence/expiry and conflicts with current P0 A block | rebuild in Steps 12~13 |
| old risk rows | team labels appear as if acceptors but no authorization or decision | accepted count remains 0 |
| old signature table | empty placeholders may be mistaken for pending real review | Step 14 defines schema/status only；no person generated |

No old row is migrated by renaming. Old terms may appear only in historical/redline statements.

## 4. Before/after and acceptance design choices

| Axis | Historical approach | Active approach | Reason |
|---|---|---|---|
| authority | old 02/03/05 shorthand | exact active 00~05 hierarchy | prevents stale subject re-entry |
| acceptance identity | free-text functional rows | preserve `AC-CH-001..037` and `VF-CH-001..013` | one requirement owner and traceability |
| evidence | API/DB/log labels | `EV-CH-*` + same-run raw/report/digest/check predicate | independently auditable |
| baseline | “current batch/test/staging” | immutable refs/digests and explicit run IDs | no implicit latest/current |
| result | empty checkbox | closed future status and verdict matrices | absence cannot imply pass |
| risk | generic team accepts | eligible real residual + authorized role + evidence + expiry | prevents design-time fake acceptance |
| external seams | positive adjacent-system E2E | Hub contract + no-write/no-body/no-ownership negative gate | preserves project ownership |

### 4.1 Key choices

| Question | Decision | Rationale |
|---|---|---|
| Copy 189 test rows into formal 06? | no；acceptance items consume exact sets through canonical mapping | avoids second test authority while keeping exact source links |
| Reallocate AC IDs? | no | formal 00 owns AC identities |
| Allocate new acceptance-gate IDs later? | yes only as `AG-CH-*` item-loop identities if Steps 5~10 need multiple gates per AC；they must map to existing AC/VF | separates formal requirement AC from gate row without renaming it |
| Treat missing delivery as failed? | no；`not_entered|blocked|not_evaluable` depending future gate | no execution occurred |
| Allow design static audit as acceptance evidence? | no | design completeness is not delivery behavior |
| Let Agent review sign? | no | Agent review is advisory provenance only |

## 5. Acceptance authority and input map

| Source | Exact acceptance inputs | Formal 06 treatment | Prohibited treatment |
|---|---|---|---|
| formal 00 | C-CH-1..5、FR/BR/NFR、AC/VF、scope/data/responsibility | scope、functional/data/NFR/veto and verdict conditions | rewriting requirement priority/meaning |
| formal 01 | Hub truth boundary、only allowed compile candidate、runtime/event seams | architecture/dependency/data redline gates | selecting topology/product |
| formal 02 | components/objects/interfaces/flows/states/errors | acceptance subject grouping and cross-component completeness | replacing exact DDD oracle |
| formal 03 | exact fields/types/callables、83 flows、638 states、TX/error/recovery/observation | design refs and typed pass/fail conditions | inferring implementation exists |
| formal 04 | 18/27/21 catalog、3 profiles/entries、bindings/activation/failure | baseline validity、config/data/security/entry gates | filling real config or secret |
| formal 05 §§3~12 | cuts/cases/data/environment/automation/NFR/defect/entry-exit | exact test selection and prerequisite/exit conditions | repeating test procedure as acceptance prose |
| formal 05 §13 | 189 EV contracts、raw/report/index/review | evidence completeness/provenance gate | calling contract an instance |
| formal 05 §14 | regression and risk eligibility | release requalification、risk never-acceptable rules | pre-accepting current risks |
| future delivery handoff | source/config/environment/run and evidence refs | Step 3 baseline and Step 4 entry | fabricate placeholder values |

### 5.1 Authority precedence

```text
formal 00 requirement and AC/VF meaning
  -> formal 01/02 responsibility and component boundary
  -> formal 03/04 exact design/config oracle
  -> formal 05 TC/DS/EV and provenance contract
  -> formal 06 acceptance decision contract
  -> real delivery/evidence/review instances at execution time
```

Formal 06 may narrow no active requirement, may not redefine a design oracle, and may not upgrade raw status.

## 6. Test evidence boundary

### 6.1 Evidence levels

| Level | Current existence | Acceptance use |
|---|---|---|
| `EVC-CH-*` candidate | designed | trace predecessor only |
| `EV-CH-*` contract | 189 designed contracts | required identity/schema/consumer map |
| run-scoped EV instance | none | future raw-derived acceptance input |
| check raw/report | none | future evidence qualification/invalidation |
| acceptance/review drafts | none | future handoff/review containers, no default verdict |
| final acceptance record | none | Step 14 schema; real process only |

### 6.2 Mandatory future evidence predicate

Every accepted P0 gate must reference explicit baseline + run, exact TC/DS/EV, one primary suite, same-run case/suite raw and report, verified digests, passed redaction/pairing/no-static checks, exact AC/VF refs and completed authorized review. Missing any cell is not evaluable or nonpass according to the later gate; it is never manual-passable.

### 6.3 Fixed paths

| Purpose | Future path contract | Rule |
|---|---|---|
| raw authority | `artifacts/test/<run_id>` | explicit run only；no `latest` |
| run reports | `reports/runs/<run_id>` | raw-derived；cannot upgrade status |
| acceptance drafts | `reports/acceptance` | must list exact run IDs；no default decision/signature |
| review records | `reports/review` | advisory/review provenance；cannot own product truth |

## 7. Acceptance must-answer registry

| ID | Question formal 06 must answer | Owning Step |
|---|---|---|
| `AM-CH-01` | Which P0/P1/P2 and seam subjects are being adjudicated? | 2 |
| `AM-CH-02` | What immutable formal/delivery/config/environment/data/evidence baseline is used? | 3 |
| `AM-CH-03` | What allows acceptance to enter, pause, resume and exit? | 4 |
| `AM-CH-04` | What exact conditions make all 37 AC pass/fail? | 5~10 |
| `AM-CH-05` | How do data ownership and architecture/dependency redlines adjudicate? | 6 |
| `AM-CH-06` | How do 83 interfaces/events/jobs and adjacent seams adjudicate without owner leakage? | 7 |
| `AM-CH-07` | How do 638 states、UoW、idempotency、race、A/B/C and reentry adjudicate? | 8 |
| `AM-CH-08` | How do 20 NFR adjudicate while numeric thresholds remain absent? | 9 |
| `AM-CH-09` | What makes evidence complete, authentic, redacted and reviewable? | 10 |
| `AM-CH-10` | Which 13 conditions immediately veto every other result? | 11 |
| `AM-CH-11` | How do defect/retest/regression states affect release eligibility? | 12 |
| `AM-CH-12` | Which real residual can be accepted, by whom, until when, with what evidence? | 13 |
| `AM-CH-13` | How are `passed|conditionally_passed|failed|not_evaluable` determined and signed? | 14 |
| `AM-CH-14` | How is every item reverse-audited to design/test/evidence and no orphan remains? | 15 |

## 8. Acceptance must-not-answer registry

| ID | Forbidden decision | Owner / required action |
|---|---|---|
| `AN-CH-01` | add/change requirement, AC or VF meaning | reopen formal 00 |
| `AN-CH-02` | choose architecture/product/deployment topology | formal 01/07/09/ADR |
| `AN-CH-03` | invent object/type/Port/flow/state/error/config contract | reopen formal 03/04 |
| `AN-CH-04` | invent/merge TC/DS/EV or execution procedure | reopen formal 05 |
| `AN-CH-05` | schedule phases/commit boundaries/code tasks | formal 07 |
| `AN-CH-06` | claim CI, environment, product or dependency is ready | real preflight evidence |
| `AN-CH-07` | create run/artifact/report/digest/evidence alias/result | real execution pipeline |
| `AN-CH-08` | accept VF/S/P0-A/evidence integrity/unknown impact | fix/retest or design reopen |
| `AN-CH-09` | own runtime/tools execution、governance approval、method body、listing、provider route/cost or SDK client/cache | external owners；Hub negative gate only |
| `AN-CH-10` | invent numeric SLO、retention days、alert/runbook or production readiness | controlled reopen / formal 09 |
| `AN-CH-11` | name an acceptor、timestamp、signature or verdict without real authorization | future formal acceptance process |

## 9. Future baseline facts to be fixed

| Baseline fact | Required in Step 3 | Current value | Missing impact |
|---|---|---|---|
| formal baseline refs/digests | exact 00~06 candidate refs | absent | actual acceptance cannot enter |
| implementation source revision | immutable source/build identity | absent | no delivery subject |
| core dependency identity | exact compatible `core-contracts` ref | absent | compile gates blocked |
| config/profile/entry | immutable validated artifact/digest | absent | environment/result attribution impossible |
| environment/resource manifest | exact P0/selected/release scope | absent | execution unavailable/not entered |
| data manifests | 189 DS + 638 pair digest and cleanup scope | absent | denominator cannot be proven |
| run/gate manifest | explicit run IDs and ten-suite/nine-check scope | absent | no result/evidence instance |
| artifact/report/evidence index | same-run fixed roots and verified digests | absent | no acceptance evidence |
| defects/residual/review | open/closed refs and authorized review | absent | no release/verdict decision |

These are future acceptance-entry prerequisites, not upstream design blockers.

## 10. Upstream impact and blocker determination

| Finding | Reopen 00~05? | Disposition |
|---|---|---|
| all 37 AC and 13 VF have design/test consumer direction | no | Step 5~11 refine acceptance item loops |
| 189 EV contracts exist but no instances | no | expected design-time state；Step 3/4 future prerequisite |
| delivery/version/environment facts absent | no | implementation/acceptance execution prerequisite |
| numeric NFR thresholds absent | no | preserve structural gate + `not_evaluated` numeric policy |
| old formal 06 conflicts | no active upstream impact | replace in Step 15 |
| external ownership remains separate | no | keep negative/veto mapping |

Current writeback / blocking confirmation / unresolved upstream blocker=`0 / 0 / 0`。

## 11. Formal §1 fill draft

Formal §1 shall state:

1. active authority is formal 00~05 and exact calibration sources；
2. 00 supplies AC/VF meaning, 01~04 supply design/config oracles, 05 supplies test/evidence/provenance contracts, 06 supplies decision rules；
3. old formal 06 and README shorthand are historical only；
4. delivery/version/environment/data/run/evidence are future baseline facts and currently absent；
5. formal 06 cannot invent requirement/design/test/implementation/operations facts；
6. actual verdict/risk/signoff remain unentered and empty。

The formal chapter must include an input map and truthfulness statement, not this Step's questions/diagnosis/tradeoffs.

## 12. Step 2 entry gate

| Criterion | Result |
|---|---|
| active authority chain is explicit | pass-designed |
| evidence contracts vs instances separated | pass-designed |
| must-answer / must-not-answer registries complete | `14 / 11` |
| future baseline facts identified without fake values | pass-designed |
| old formal 06 isolated | pass |
| current acceptance verdict/risk/signature fabricated | 0 |
| unresolved upstream blocker | 0 |
| next Step allowed | yes；define acceptance goals/scope only |

```text
document = 06-验收标准.md
step = 1
status = 06_step_01_completed_continuous_execution
formal_06_modified = false
acceptance_entered = false
real_evidence_created = false
unresolved_upstream_blocker = none
next_allowed_action = enter_06_step_02_scope
commit_required = no
```
