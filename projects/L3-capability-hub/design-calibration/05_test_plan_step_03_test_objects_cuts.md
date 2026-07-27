# L3-capability-hub 05 测试方案 Step 3：抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节：`projects/L3-capability-hub/05-测试方案.md` §3
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`05_step_03_completed_continuous_execution`
> 真实性边界：本文建立 planned test-object/cut registry；没有创建测试文件、运行测试、分配 evidence alias 或形成 pass/fail 结果。

---

## 1. 本步目标、输入与输出

| 项目 | 内容 |
|---|---|
| 目标 | 从 formal 02/03/04 抽取所有 P0 test objects 和最小风险切口，固定 exact source、risk、oracle class 和建议发现层 |
| 直接输入 | formal 03 §§3~15、`03_ddd_step_16_test_cuts.md`、formal 04 §§5~12、config Steps 11/12 |
| 输出 | object/cut master registry、state/flow/config inventories、P0 cut stop-review、cross-cut source audit |
| 留给后续 | Step 4 决定分层策略；Step 5 建追溯；Step 6 分配完整 `TC-*`；Step 7~13补数据/环境/自动化/专项/证据 |

## 2. SOP 十问回答

| 问题 | 收口答案 |
|---|---|
| 哪些 domain/value/policy 必须单测？ | formal 03 的 43 个 HLD objects、7 application helpers、24 state families、ref/value/canonical digest invariants 和 250 public protocol types；不得用旧 `ProviderContract` 等对象替代。 |
| 哪些 application service 必须 service test？ | 83 exact C/Q/I/O/J flows全部；Command/Inbound/Job含idempotency/UoW，Query含strict no-write，Outbound含A/B/C，Job含plan/target/final。 |
| 哪些 repository/adapter/worker 必须集成验证？ | 22 repository traits/110 methods、one authority、UoW三态、9 external Ports/14 callables、6 Worker sources、10 routes、8 Jobs dispatch与Stage 0~7/barriers。 |
| 哪些协议必须验证？ | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job全部一一登记，不允许 family helper 取代 exact flow registration。 |
| 哪些状态/事务/幂等/恢复必须单列？ | 24/111/638 state matrix、22 `CUT-TX-*`、commit unknown、rollback、reserve winner/loser、crash/reentry、cursor/index asymmetry。 |
| 哪些字段/DTO/ref混同是负向切口？ | missing/unknown/forbidden field、schema mismatch、body-bearing input、wrong subject/family/kind/source/version、digest-domain混用、secret/raw body、enum spelling drift。 |
| 状态名依据什么？ | formal 03 §9 exact Rust enum/variant spelling；禁止HLD小写词、generic active/ready/failed或旧状态。 |
| 每个切口回指何处？ | `CUT-*` exact source 为 DDD Step 16 §§5~11并回指 formal 03 owning section；`CFG-F-*` source为config Step 11并回指 formal 04 §§5~11。 |
| 是否存在 orphan P0 contract？ | 当前静态抽取审计为0；7 modules、83 flows、24 states、22 TX、12 binding、12 observation及configuration 18 failures均有切口。 |
| P0 cuts 是否通过停审？ | 是，按本文件§10 family registry逐项验证source/risk/layer/future-case obligation；exact member counts无缺口，未声称执行通过。 |

## 3. Cut identity、数量与 oracle precedence

### 3.1 Canonical count

| Family | Exact registered cuts | Identity rule |
|---|---:|---|
| module/dependency/doc | 11 | `CUT-MOD-01..07`, `CUT-MOD-DEP-01..03`, `CUT-MOD-DOC-01` |
| object/helper/protocol/digest | 4 | `CUT-OBJ-CORE/HELPER/PROTOCOL/DIGEST`；成员由inventory参数化 |
| local/external Port | 2 | `CUT-PORT-LOCAL/EXTERNAL` |
| repositories | 1 | `CUT-REPO-ALL`，参数集必须exact 22/110 |
| flows | 83 | `C01..26/Q01..33/I01..06/O01..10/J01..08` |
| states | 24 | `CUT-STATE-01..24` |
| transaction/consistency/concurrency | 22 | `CUT-TX-01..22` |
| binding/config assembly | 12 | `CUT-BIND-01..12` |
| observability/redaction | 12 | `CUT-OBS-01..12` |
| **DDD exact cut total** | **171** | sum of exact registered cuts |
| configuration failure expansion | 18 | `CFG-F-01..18`；与binding cuts交叉但保留独立source/failure identity |

Mechanical raw token count `178` from DDD Step 16 is not the cut total：it includes seven explanatory prefix tokens (`CUT-MOD-`、`CUT-FLOW-C`、`CUT-STATE-` 等)。Formal 05 must use `171 exact CUT + 18 CFG-F obligations`, not claim 178 tests or 189 executed cases.

### 3.2 Oracle precedence

```text
typed public/application terminal
  -> exact repository/stored carrier state when persistence is expected
  -> exact sidecar/capture/journal symmetry
  -> exact zero-write / zero-call spy for prohibited effects
  -> observer projection only for observer-contract assertions
```

Log text、error string、`Debug`/`Display`、elapsed time、private map、mock invocation count alone、current-truth reconstruction和external product state都不能替代正式business oracle。

## 4. Module、object、Port 与 repository objects

| Test object | Exact source | Cut | Primary risk | Suggested discovery layer |
|---|---|---|---|---|
| `contracts` | formal 03 §§4~7 | `CUT-MOD-01` | 250 protocol schema/ref/codec/canonical bytes drift | compile/static + unit contract |
| `domain` | formal 03 §§5~6/9 | `CUT-MOD-02`, `CUT-OBJ-CORE` | invariant/state/version/source mismatch | table-driven unit |
| `application` | formal 03 §§5/8/10~12 | `CUT-MOD-03` | wrong Port/order/UoW/idempotency/effect | service with deterministic fakes |
| `infra` | formal 03 §§5/10/13 | `CUT-MOD-04` | second authority, repository parity, partial graph | adapter contract + integration seam |
| `api` | formal 03 §§5/7/8/13 | `CUT-MOD-05` | predecode/metadata/timeout/response mapping | handler contract |
| `worker` | formal 03 §§5/7/8/13 | `CUT-MOD-06` | six-source/header/barrier/drain/receipt | runtime seam + deterministic tasks |
| `jobs` | formal 03 §§5/7/8/12~13 | `CUT-MOD-07` | dispatch/plan/target/final/reentry | runner/service |
| workspace dependency graph | formal 03 §§3~4 | `CUT-MOD-DEP-01..03` | reverse/sibling/type leakage | static manifest/import check |
| Rust public documentation | formal 03 §3.2 | `CUT-MOD-DOC-01` | declaration/struct field/variant/payload/method documentation omission | source/static check |
| 7 application helpers | formal 03 §6 | `CUT-OBJ-HELPER` | canonical/body-free/domain/channel mixing | unit/property contract |
| 250 public protocol types | formal 03 §§6~7 | `CUT-OBJ-PROTOCOL` | unknown/missing/forbidden field, codec drift | compile/unit/codec contract |
| four digest domains | formal 03 §12 | `CUT-OBJ-DIGEST` | map/pretty/raw body/domain collision | property + fixture vectors |
| 27 local/base Ports | formal 03 §§6/13 | `CUT-PORT-LOCAL` | hidden/private/`?Send`/second authority | compile + contract suite |
| 9 external Ports / 14 callables | formal 03 §§6/13 | `CUT-PORT-EXTERNAL` | generic error/body/family fallback | fake/configured/disabled contract |
| 22 repository traits / 110 methods | formal 03 §§6/10 | `CUT-REPO-ALL` | uncovered method/CAS/index/page/order divergence | parameterized fake/durable suite |

## 5. Protocol and flow cut registry

| Family | Exact cuts | Shared positive obligation | Shared abnormal/effect obligation | Later case rule |
|---|---:|---|---|---|
| Command | `CUT-FLOW-C-01..26` | exact accepted terminal + declared same-UoW members | invalid/precondition/conflict/rollback; duplicate replay; winner unchanged; forbidden-domain zero calls | each 26 ID registered at least once, family helper only supplements |
| Query | `CUT-FLOW-Q-01..33` | exact visible/optional/page/degraded surface | write/UoW/reserve/capture/handoff/collaboration/repair/execution calls all zero | each 33 ID gets positive + missing/degraded/boundary branch |
| Inbound | `CUT-FLOW-I-01..06` | header/schema/actor/ref gate + exact typed receipt | unsupported/body/duplicate/mismatch; no unrelated truth write | each source slot exact, no generic event consumer |
| Outbound | `CUT-FLOW-O-01..10` | official immutable source/snapshot/capture Durable then collaboration | Phase A rollback, B independent failure, C CAS/Unknown; no local delivery lifecycle | each route family exact once, no wildcard route |
| Job | `CUT-FLOW-J-01..08` | frozen plan, per-target terminal, immutable report | reserve race/crash/partial/Unknown/reentry; no scope rescan/truth repair | each dispatch exact with plan/target/final branches |

Exact flow names and their positive/abnormal/effect oracles remain canonical in `03_ddd_step_16_test_cuts.md` §7. Step 6 must copy those names and cannot collapse `C/Q/I/O/J` into generic CRUD or E2E cases.

## 6. State cut registry

| Cuts | Exact state families | Minimum future case obligation |
|---|---|---|
| `CUT-STATE-01..06` | `CapabilityIdentityState`, `CapabilityAccessReviewFactState`, `RegistryLifecycleState`, `AdapterDescriptorState`, `DescriptorRiskConstraintSummaryState`, `SecretHandlingSafeSummaryState` | valid current directions、reserved caller=0、illegal/terminal zero mutation、safe-summary no secret truth |
| `CUT-STATE-07..12` | `GovernanceSeamState`, `CapabilityMethodRelationState`, `FormalExposureState`, `FormalVisibilityState`, `TraceabilityState`, `CapabilityImpactState` | no approval/method/runtime authority、source/version symmetry、external handoff cannot rewrite local truth |
| `CUT-STATE-13..18` | `DownstreamImpactSummaryState`, `ConsumerViewFreshnessState`, `DirectoryProjectionState`, `AuditExportState`, `EcosystemDiscoveryState`, `ReferenceResolutionValue` | Query/job no mutation、no ranking/listing/audit body、kind-specific precedence |
| `CUT-STATE-19..24` | `CapabilityEventCaptureState`, `CapabilityIdempotencyState`, `CapabilityJobExecutionState`, `CapabilityJobExecutionTargetOutcome`, `EventCollaborationStatus`, `ReconciliationReportState` | capture/intent CAS、Reserved->Completed only、plan/final symmetry、external status no local state、immutable report |

Global generated/parameter registry must contain exact `239 current + 98 reserved + 301 illegal = 638` pairs across `111` active variants. A grouped test implementation is allowed only when its generated evidence can identify every exact pair and expected classification.

## 7. Consistency、binding and observation cuts

| Family | Exact cuts | Required risk branches | Required zero/fidelity oracle |
|---|---:|---|---|
| repository/UoW | `CUT-TX-01..07` | method classes、CAS、same-UoW、staged failure、rollback failure、NotDurable、Unknown resolution | no partial visibility/guessing/blind retry |
| idempotency/reentry | `CUT-TX-08..14` | winner、same/different digest、corrupt stored surface、orphan Reserved、Job journal symmetry | no rerun/current-truth rebuild/second reservation |
| concurrency/outbound/job | `CUT-TX-15..22` | writer race、collect-before-mutate、A/B/C crash、Job phase crash、cursor corruption、digest domain | exact one winner/effect; declared recovery only |
| runtime binding | `CUT-BIND-01..06` | typed root、profile、27 authority、9 Ports、6 sources/barrier | Missing blocks、Disabled exact、no partial/fallback |
| collaboration/jobs/technical | `CUT-BIND-07..12` | 10 routes、8 dispatches、retry classification、shutdown、codec/header、core-contracts prerequisite | no wildcard/generic execute/scheduler retry/copied core |
| observability profiles | `CUT-OBS-01..04` | 60 log、48 metric、27 span+3 events、20 durable | exact owner/source/cardinality/Durable; Unknown emits none |
| redaction/failure | `CUT-OBS-05..12` | Off、Redacted required/optional/atomic/material/count/sink/four-plane/historical owner | business byte-equivalent, no raw material/recursive fallback/extra authority |

## 8. Configuration failure expansion registry

| Cut range | Test objects | Required branch | Exact oracle |
|---|---|---|---|
| `CFG-F-01..04` | file/parser/source/env/type/range/profile/entry | missing/BOM/comment/duplicate/unknown/null/coercion/invalid env/bounds | V0~V6 reject; no constructor/exposure/raw diagnostic; invalid env no JSON fallback |
| `CFG-F-05..08` | reference graph/Disabled/provider/TLS | orphan/cycle/family/collision/omission/provider denial/expiry/revoke/mismatch | complete reject; Missing != Disabled; no fallback/secret output |
| `CFG-F-09..11` | Stage 0~7/barrier/9-6-10 graph | fail each stage/barrier/member | reverse prefix disposal; no listener/task/facade/reduced graph |
| `CFG-F-12..14` | activated Port/Query/Worker/Jobs/Outbound | typed temporary/permanent/invalid/partial/commit/rollback failures | exact formal 03 surface/effect/retry; no generic config error/marker fabrication |
| `CFG-F-15..18` | frozen root/observer/unsupported controls/rollback target | drift/active dependency/sink/admin-hot-reload/revoked target | new candidate reject or safe omission; current root/business truth unchanged |

Each of 18 IDs must receive at least one stable `TC-*` in Step 6 or an explicit justified merge that still preserves ID-level traceability. This registry does not claim those cases exist yet.

## 9. Test-cut small-loop contract

Every exact P0 cut proceeds through this later design loop：

```text
formal object / source
  -> exact cut ID and risk
  -> positive + negative + boundary branches
  -> preconditions/action/typed and effect oracles
  -> synthetic data and deterministic seam
  -> minimum discovery layer + broader confidence layer
  -> automation trigger and missing-result behavior
  -> evidence placeholder and formal 06 consumer
```

Step 3 closes only the first two links and recommends a layer. It does not preempt Steps 4~13.

## 10. P0 cut stop-review registry

| Review family | Exact members | Design source present | Risk specific | Suggested layer usable | Step 6 obligation explicit | Result |
|---|---:|---|---|---|---|---|
| module/dependency/doc | 11/11 | formal 03 §§3~5 + DDD16 §§5~6 | yes | yes | every ID or parameter member traceable | pass |
| object/helper/protocol/digest | 4/4 over 43+7+250 inventories | formal 03 §§6~7/12 | yes | yes | parameter registry must enumerate members | pass |
| Ports/repositories | 3/3 over 36 and 22/110 | formal 03 §§6/10/13 | yes | yes | fake/durable/Disabled/Missing branches | pass |
| Command | 26/26 | formal 03 §§7~8 + DDD16 §7.1 | yes | service | each exact flow positive+abnormal | pass |
| Query | 33/33 | formal 03 §§7~8 + DDD16 §7.2 | yes | service/read adapter | each exact flow plus strict zero-write | pass |
| Inbound/Outbound/Job | 24/24 | formal 03 §§7~8 + DDD16 §7.3 | yes | worker/service/runner | exact 6/10/8 IDs and phase effects | pass |
| state | 24/24, 638 pairs | formal 03 §9 + DDD16 §8 | yes | table/generated unit/service | pair-level classification trace | pass |
| consistency/concurrency | 22/22 | formal 03 §§10~12 + DDD16 §9 | yes | deterministic service/integration | exact injected branch and carrier oracle | pass |
| binding | 12/12 | formal 03 §13 + DDD16 §10 | yes | parser/builder/integration/static | profile/cardinality/fallback branches | pass |
| observation | 12/12 | formal 03 §14 + DDD16 §11 | yes | capture harness/static | owner/redaction/no-effect branches | pass |
| config failure expansion | 18/18 | formal 04 §§5~11 + config Step 11 | yes | parser/builder/service/static | stable TC or justified trace-preserving merge | pass |

`pass` here means the planned cut has a source, risk and later design obligation. It is not a test execution result.

## 11. Cross-cut design-source audit

| Audit item | Result | Gap / correction |
|---|---|---|
| DDD exact cut count | `171` | excluded seven explanatory prefix tokens from raw token count 178 |
| flow coverage | `26/33/6/10/8 = 83/83` | no generic family substitution |
| state coverage | `24/24`, `111`, `638=239+98+301` | exact enum spelling gate retained |
| TX/binding/observation | `22/12/12` | no missing cut |
| config failure expansion | `18/18` | remains separate from 12 binding cuts |
| orphan active design family | `0` | Step 16 cross-Step audit already covers Steps 5~15 |
| duplicate semantic authority | `0` | observer/log/mock/external state cannot replace business oracle |
| old object/TC/topology reintroduced | `0` | historical isolation retained |
| responsibility leakage | `0` | execution/approval/method body/marketplace/SDK lifecycle negative only |
| upstream writeback/blocking | `0/0` | no missing oracle found at extraction stage |

## 12. Formal §3 回填草稿

Formal §3 must include the 171-cut + 18-config-obligation count model, master family registry, module/object/Port/repository table, exact 83-flow ranges, 24-state/638-pair rule, 22/12/12 TX-binding-observation families, configuration failure ranges, oracle precedence and P0 stop-review meaning. Exact verbose per-flow/per-state rows may point to DDD Step 16 but must preserve every ID in the formal trace registry.

Formal §3 must not allocate full TC/evidence records, claim files or runs exist, choose products, or turn suggested discovery layers into an implementation fact.

## 13. 待确认事项与 Step 4 entry gate

| Item | Current impact | Treatment |
|---|---|---|
| target test framework/repository absent | no design blocker | Step 4 uses semantic layers; formal 07 binds tools after preflight |
| generated state/repository registries implementation | execution prerequisite | Step 6 specifies data/oracles, Step 9 gate contract, Step 7 fixture schema |
| concrete observer backend | P1 controlled reopen | backend-neutral capture harness only |
| exact merge of repetitive config cases | Step 6 decision | merge allowed only with all `CFG-F` trace IDs and branch-specific oracle |

| Entry condition | Result |
|---|---|
| P0 objects have cuts | pass |
| each P0 family stop-reviewed | pass, 11/11 families |
| cross-cut source audit unresolved conflicts | 0 |
| current writeback/blocking/upstream blocker | 0/0/0 |
| full TC/EV/result fabricated | 0 |
| formal 05 modified | 0 |

Step 3 is complete. Next allowed action: T026 / Step 4, define risk-based testing layers and placement rules for each cut family without assuming concrete framework files or duplicating cases across layers.
