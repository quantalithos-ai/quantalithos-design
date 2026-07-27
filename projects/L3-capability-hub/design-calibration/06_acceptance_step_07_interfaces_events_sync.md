# L3-capability-hub 06 验收标准 Step 7: 定义接口、事件与跨仓同步验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/验收标准书写规范.md` §5.7
> 回填章节: `06-验收标准.md` §7
> Step 状态: `completed-designed / not-evaluated`
> 日期: 2026-07-26

本 Step 将 formal `03-详细设计.md` 的 `26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job = 83` 个协议/流程，以及跨仓依赖裁剪，转成接口、事件和同步验收门禁。本文不声称任何 API、worker、job、bus、adapter、下游仓、run 或 evidence instance 已存在。

## 1. Step 状态、目标与边界

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 7 接口、事件与跨仓同步验收 |
| 直接协议库存 | C01~C26、Q01~Q33、I01~I06、O01~O10、J01~J08；以 active formal 03 为准 |
| 依赖类型 | 编译期依赖、运行期/API/adapter 依赖、事件协作依赖、下游消费/handoff 依赖 |
| 本步输出 | 依赖类型矩阵、协议族门禁、Inbound/Outbound/Job同步门禁、停审记录、跨接口审计 |
| 本步不做 | 状态/TX/幂等的 primary 裁决（Step 8）、NFR（Step 9）、证据真实性（Step 10）、VETO（Step 11） |
| 目标项目数量 | `26/33/6/10/8 = 83/83`；参考项目若有不同数量，只作 historical/reference material |
| 当前事实 | 所有接口/事件/job结果均 `not_evaluated`；无真实 route/topic/run/report/signoff |

## 2. 输入与 authority precedence

| 输入 | 用途 | 不得推断 |
|---|---|---|
| `00-需求文档.md` §§6/9/10/12 | FR、依赖方向、BR、跨仓职责和接口类型 | 下游已实现 |
| `01-架构设计.md` §§5/8/9/10 | context、依赖类型、通信/ownership边界 | transport/deployment已选定 |
| `02-概要设计.md` §§7~10 | interface family、component handoff、flow boundary | exact implementation exists |
| `03-详细设计.md` §§7~8/13 | exact protocol names、flow、metadata、read/write/capture/job boundary | protocol passed |
| `03_ddd_step_08_protocol_contracts.md` | typed envelope、route-neutral identity、event source/capture、job request/response | broker/topic/consumer group exists |
| `03_ddd_step_09_function_flows.md` | exact call order、barrier、no-write、Durable/reentry semantics | runtime execution result |
| `04-配置设计.md` §§6/12 | binding/profile/entry and external dependency seam | selected environment exists |
| `05` Steps 5~9/13 | TC/DS/EV、suite、raw/report and dependency checks | evidence instance exists |
| Step 5/6 | functional and ownership redlines | interface verdict already passed |

Active source wins over old formal 06, README and L1 reference counts. The old L1-governance Step 7 protocol counts are not copied into CH identifiers or inventory.

## 3. SOP 十二问回答

| # | 问题 | 收口答案 |
|---:|---|---|
| 1 | 每个 P0 Command 如何验收？ | C01~C26 each use exact request/metadata/operation key, typed handler/service result, declared UoW/effect, stored replay and negative branch; no generic CRUD substitute. |
| 2 | 每个 P0 Query 如何验收？ | Q01~Q33 each performs visibility/read-gate first, returns exact single/page surface, distinguishes NotVisible/degraded/missing/empty, and proves zero UoW/save/capture/collaboration/rebuild calls. |
| 3 | 每个 Inbound 如何验收？ | I01~I06 validate header/source/schema before payload decode, typed ref/state and receipt symmetry, duplicate replay, forbidden-body rejection and no undeclared core mutation. |
| 4 | 每个 Outbound 如何证明可消费/可重放？ | O01~O10 originate from the exact committed change/material source, persist complete body-free snapshot/capture, preserve schema/source/trace/scope, and expose a stable collaboration/ref continuation; replay uses stored capture/result, never current-state reconstruction. |
| 5 | 每个 Job 如何证明幂等/恢复？ | J01~J08 use frozen normalized-key plan, ordinal target journal, target/final report symmetry, crash/reentry and duplicate replay; jobs never repair core truth or rescan to infer a new plan. |
| 6 | 跨仓同步成功标准？ | The Hub proves its formal ref/snapshot/event/API/job seam with controlled/fake/disabled dependencies; it does not require another repository's internal implementation unless the immutable scope explicitly includes it. |
| 7 | 依赖如何分类？ | `L0-core/core-contracts` is the sole compile-time candidate; external source/governance/method/secret/document/consumer/observability are runtime Port seams; bus and change signals are event collaboration; SDK/runtime/tools/console/marketplace are downstream consumption. |
| 8 | 各类依赖用什么证据？ | Compile: dependency/Rustdoc/static contract checks. Runtime: typed adapter fake/disabled/configured outcomes. Event: source/capture/receipt/replay and topic-neutral key checks. Handoff/downstream: query/view/report/ref contract, not full product implementation. |
| 9 | 是否固定真实 topic/route？ | Only formal protocol name, logical event key, schema and job surface are acceptance identities. Physical topic, endpoint, consumer group, credential and deployment route remain configuration/deployment inputs. |
| 10 | 下游未就绪如何裁决？ | A controlled/disabled seam can establish Hub boundary semantics; missing selected downstream produces `blocked_dependency`/selected residual, never P0 pass and never a fabricated failure of Hub truth. |
| 11 | 每项是否停审？ | Each protocol family and each dependency row is reviewed for exact formal names, type, direction, fields/statuses, TC/DS/EV, fixed path and downstream scope. |
| 12 | 跨接口是否有冲突？ | Static design audit target is `83/83`, dependency-type conflict `0`, route/topic drift `0`, downstream-full-implementation requirement `0`, orphan evidence consumer `0`; actual run must re-evaluate these. |

## 4. 公共接口/事件/Job验收合同

### 4.1 Shared metadata and identity

| Family | Required authority | Required positive surface | Required negative surface |
|---|---|---|---|
| Command | actor、trace、schema、operation/idempotency key、expected version where declared | exact typed request -> exact typed outcome; accepted truth/effects/result are symmetric | malformed metadata/body, stale/duplicate/forbidden input, caller timeout cannot cancel owned invocation |
| Query | actor、trace、schema、visibility subject/scope、opaque cursor | resolver-first exact single/page surface; visible empty is distinct from NotVisible/degraded | no UoW/save/reserve/capture/event/job/rebuild; loaded contradiction is `ConsistencyDefect` in Step 8, not half-success |
| Inbound | source actor/event/schema、message key、trace/idempotency | header-first typed receipt, ref/state/material effect only as card allows | unsupported schema no payload parse/write; duplicate returns stored receipt; source/body mismatch is typed failure |
| Outbound | exact committed source/change/material, schema, trace, scope, occurrence | complete immutable snapshot + capture + typed collaboration result/ref | current-state re-read, report-as-core-event, raw body, local delivery lifecycle, external failure rollback |
| Job | actor、run/normalized key、trace、schema, frozen plan | typed response/report, target ordinal, journal and final outcome symmetry | scheduler inference, plan rescan/replan, nested mutation, unbounded retry, duplicate new effect |

Every interface gate uses the following future evidence path contract:

```text
case raw   = artifacts/test/<run_id>/suites/<primary-suite>/cases/<tc-id>.json
suite raw  = artifacts/test/<run_id>/suites/<primary-suite>/suite-result.json
report     = reports/runs/<run_id>/suites/<primary-suite>.md
index      = reports/runs/<run_id>/evidence-index.md
```

The path is a contract only. No `<run_id>`, raw artifact, report or evidence instance is currently claimed.

### 4.2 Verdict semantics

| Result | Interface interpretation | Verdict impact |
|---|---|---|
| `passed` | All required exact protocol members and branches produce raw-derived typed results and zero-effect assertions in one run | contributes to the owning AC; not a final acceptance verdict by itself |
| `failed` | protocol/schema/source/effect/order/replay/no-write oracle is violated | blocks owning P0 interface/functional gate |
| `blocked_dependency` | required selected seam or prerequisite unavailable | not pass; blocks selected claim, and blocks P0 only when the dependency is a declared P0 prerequisite |
| `invalid_artifact` | missing/cross-run/static/manual/digest/schema/pairing evidence | cannot be adjudicated; no risk waiver |
| `not_evaluated` | design-only state in this artifact | no verdict |
| `not_decided` | evidence exists without required review/authorization | no verdict |

## 5. 跨仓依赖类型与验收方式矩阵

| Dependency / boundary | Type | Hub acceptance seam | Allowed evidence | Forbidden conclusion |
|---|---|---|---|---|
| `L0-core` / `core-contracts` | compile-time | one declared shared-contract edge; exact type/codec compatibility | `FOUNDATION-008..011`, `BIND`, dependency/Rustdoc checks | copied types, extra sibling Cargo edge or source replacement |
| `L0-bus` | event collaboration | logical event envelope, capture/collaboration/ref continuation, inbound receipt | INBOUND/OUTBOUND/OBS/CONFIG cases | physical broker readiness or bus implementation as Hub truth |
| external MCP/A2A/API/document/secret source | runtime Port | body-free resolver, descriptor/ref, typed unavailable/forbidden | CMD/QUERY/INBOUND/BIND/CONFIG | Hub executes provider or stores provider/secret body |
| `L1-governance` | runtime + event seam | governance result ref/state, access-review separation | CMD/QUERY/INBOUND/OUTBOUND boundary cases | Hub creates approval/Policy/shared_rules |
| `L3-method-library` | runtime + event seam | body-free `MethodAssetRef` and relation | CMD/QUERY/INBOUND/OUTBOUND boundary cases | method body/source/version/lifecycle in Hub |
| `L2-runtime` / `L2-tools` | downstream/runtime consumer | formal exposure, controlled view, consumer ref and feedback | QUERY/INBOUND/OUTBOUND/derived cases | execution result/allow-deny/cache as Hub truth |
| `L0-sdk` | downstream server/client boundary | SDK server exposure and typed consumer ref | Q19/Q32/O06/O07/BOUNDARY cases | SDK client/package/cache implementation in Hub |
| `L5-console` / `L6-marketplace` | downstream/optional read-only | management/search/discovery snapshot | Q24/Q25/Q27/J05/O09 | UI/listing/transaction/pricing/fulfillment truth |
| `L4-observability` | event + handoff | audit/observation ref, safe summary, handoff | Q23/Q26/Q33/I05/J04/OBS | observability store/log/metric/trace body as source |

Dependency type is part of the acceptance row. A missing runtime/event consumer cannot be silently reclassified as compile-time or as a passed product feature.

## 6. Command and Query interface gates

### 6.1 Command exact inventory gate

| Gate | Exact formal members | TC / DS / EV contract | Pass condition | Failure condition | Report / impact |
|---|---|---|---|---|---|
| `AC-CH-IF-CMD` | `C01..C26`: `EstablishCapabilityAccessContext`, `CorrectCapabilityIdentity`, `RetireCapabilityIdentity`, `RecordCapabilityAccessReviewFact`, `RegisterCapabilityInRegistry`, `UpdateRegistryLifecycleState`, `UpdateRegistryVisibilityBasis`, `RetireCapabilityRegistryEntry`, `EstablishAdapterDescriptor`, `ReplaceAdapterDescriptor`, `RecordDescriptorRiskConstraintSummary`, `AttachDescriptorSecretReference`, `AttachGovernanceSeamRelation`, `ReplaceGovernanceSeamRelation`, `ExpireGovernanceSeamRelation`, `AttachCapabilityMethodRelation`, `RemoveCapabilityMethodRelation`, `EstablishFormalExposureBoundary`, `UpdateFormalVisibilityApplicability`, `SuspendFormalExposureBoundary`, `RetireFormalExposureBoundary`, `RecordCapabilityChangeImpactFact`, `RecordTraceabilityHandoffSummary`, `RecordReferenceResolutionState`, `RegisterExternalDocumentReference`, `RegisterCapabilityConsumerReference` | `TC/DS/EV-CH-CMD-001..026`; supporting STATE/TX/BIND selectors are those linked by each DS row | every C member has exact route-neutral identity, metadata, typed request/outcome, declared owner/effect, expected version/idempotency behavior, stored result/replay and negative branch; accepted effect/source/history/capture is symmetric | missing/renamed/duplicate command; generic CRUD or old alias; metadata/body/schema mismatch; undeclared Port/UoW/write; duplicate reruns; caller timeout cancels owned work; forbidden responsibility or body | primary suite `service-command-query`; raw case/suite/report/index under fixed run; failure blocks every AC consuming the affected C member and may trigger Step 11 |

Command inventory is a member registry, not a count-only assertion. Each `TC-CH-CMD-NNN` maps to `DS-CH-FLOW-C-NNN` and `EV-CH-CMD-NNN`; no L1 `GOV` ID may appear in the active CH row.

### 6.2 Query exact inventory and no-write gate

| Gate | Exact formal members | TC / DS / EV contract | Pass condition | Failure condition | Report / impact |
|---|---|---|---|---|---|
| `AC-CH-IF-QUERY` | `Q01..Q33`: identity, registry, descriptor, governance/method, exposure/consumer, trace/impact, derived/export/discovery/report and eight reference query surfaces as listed in formal 03 §7.3 | `TC/DS/EV-CH-QUERY-001..033`; STATE/OBS supporting selectors per DS | each Query invokes visibility/read resolver before target read; exact single/page surface preserves owner/version/source/state/reason/cursor; visible empty, missing, NotVisible, degraded, stale and unavailable remain distinct; zero UoW/reserve/save/capture/collaboration/rebuild/repair | query writes truth/projection/reference/receipt/report; reads first item/cursor to infer visibility; loaded owner/version/sidecar contradiction becomes degraded half-body; runtime execution, SDK client/cache, listing or raw observation body leaks | primary suite `service-command-query`; no-write and consistency raw assertions + report/index; any violation blocks Query/consuming AC |

## 7. Inbound, Outbound and Job synchronization gates

### 7.1 Inbound Event Consumer gate

| Gate | Exact members | TC / DS / EV contract | Pass condition | Failure condition | Report / impact |
|---|---|---|---|---|---|
| `AC-CH-IF-INBOUND` | `I01..I06`: governance result ref, method asset ref, downstream impact, external capability source, audit material ref, external document ref consumers | `TC/DS/EV-CH-INBOUND-001..006`; relevant BIND/OBS/CONFIG selectors | header/source/schema/trusted actor validated before decode/reserve; accepted local effect is only the exact ref/state/summary/receipt in the card; duplicate returns stored typed receipt; matching resolver/source symmetry is checked; unsupported version is rejected without payload parse/write | payload decoded before header gate; external body/approval/method/execution/audit material persisted; duplicate changes truth; caller contradiction hidden as success; inbound event creates undeclared identity/descriptor/exposure mutation; source failure text becomes protocol truth | primary suite `entry-inbound`; raw case, suite report and evidence index; failure blocks relevant FR/AC and may feed `VF-CH-007/011` |

### 7.2 Outbound event capture/collaboration gate

| Gate | Exact members | TC / DS / EV contract | Pass condition | Failure condition | Report / impact |
|---|---|---|---|---|---|
| `AC-CH-IF-OUTBOUND` | `O01..O10`: identity, registry, descriptor, governance seam, method relation, formal exposure, controlled view, change impact, derived material, reference resolution | `TC/DS/EV-CH-OUTBOUND-001..010`; TX/OBS supporting selectors | source is exact committed change/material record; complete body-free snapshot includes source/schema/trace/subject/version/scope/digest/bytes as formalized; local UoW establishes `Captured`/Durable before external collaboration; stable intent/ref is route-neutral; replay uses stored capture; external failure does not rollback local truth | report/reconciliation/observer becomes core event source; snapshot incomplete or reconstructed from current state; topic/route string changes event identity; local outbox/delivery lifecycle invented; raw body/secret/method/approval/provider/SDK/listing material emitted; external status rewrites local truth | primary suite `outbound-collaboration`; raw `O01..O10`, capture/report/index; failure blocks AC-CH-021 and relevant functional/redline gate |

### 7.3 Operations Job gate

| Gate | Exact members | TC / DS / EV contract | Pass condition | Failure condition | Report / impact |
|---|---|---|---|---|---|
| `AC-CH-IF-JOB` | `J01..J08`: registry reconciliation, controlled consumer view, directory projection, audit export summary, ecosystem discovery summary, derived reconciliation, external reference refresh, event collaboration repair | `TC/DS/EV-CH-JOB-001..008`; STATE/TX/BIND/OBS supporting selectors | closed dispatch maps each request to one handler; frozen normalized-key plan and ordinal journal survive crash/reentry; target/final report and result refs symmetric; duplicate returns stored report; disabled/unavailable dependency has typed disposition; no core-truth repair | scheduler/CLI infers business identity; plan rescans/replans; duplicate reruns mutation; partial target silently dropped; job writes registry/identity/descriptor/exposure or event source; report/body/evidence/signoff becomes truth; commit-unknown fabricated as success | primary suite `jobs-lifecycle`; raw/report/index plus repository-TX evidence; failure blocks relevant AC and can trigger Step 11 |

## 8. Cross-repository synchronization acceptance

| AC | Synchronization subject | Dependency type | Protocol/event/job surface | Pass condition | Failure condition | Evidence / impact |
|---|---|---|---|---|---|---|
| `AC-CH-SYNC-001` | shared contract compatibility | compile-time | `core-contracts` only | declared shared types/metadata/codec contract compiles and exact field/bytes semantics match; no copied sibling type | missing/incompatible shared contract, extra sibling compile edge, copied DTO or direct import | `FOUNDATION-008..011`, BIND; `static-contract-docs` + dependency report; blocks P0 |
| `AC-CH-SYNC-002` | external source/governance/method/ref adapters | runtime | typed Ports used by C/Q/I/J | configured/fake/disabled/missing outcomes map to formal typed result/error; body-free ref/source symmetry and no hidden fallback | direct sibling source dependency, raw error text mapping, unavailable silently passed, external body stored | BIND/CONFIG + relevant CMD/QUERY/INBOUND/OBS; blocks affected seam only unless P0 prerequisite |
| `AC-CH-SYNC-003` | bus/change collaboration | event collaboration | I01..I06 and O01..O10 | logical event schema/key/source/capture/receipt/replay contract is complete; transport binding is injected configuration, not business identity | topic/route used as source truth, missing capture/receipt, duplicate delivery rewrites truth, external delivery lifecycle owned locally | INBOUND/OUTBOUND/BIND/OBS; `entry-inbound`/`outbound-collaboration`; blocks affected P0 |
| `AC-CH-SYNC-004` | runtime/tools/SDK consumers | downstream/API/event | Q15..19/Q31..32, C26, O06..07, I03 | server exposure/controlled view/ref and consumer feedback seam is consumable with typed unavailable/NotVisible; no consumer full implementation required | consumer cache/client/execution result defines Hub truth, missing consumer treated as Hub pass, consumer writes core truth | QUERY/INBOUND/OUTBOUND; `service-command-query`/`outbound-collaboration`; selected or P0 per scope manifest |
| `AC-CH-SYNC-005` | console/marketplace/observability/handoff | downstream/handoff/event | Q23~28/Q33, I05, J04~06, O09 | read-only/export/audit handoff has source/scope/result/ref and safe summary; disabled/absent optional target is explicit | listing/transaction/audit store/observer body becomes owner; export/report repairs core truth; optional product status substitutes P0 | QUERY/JOB/OBS/BIND; selected residual unless boundary leakage |

Physical topic, endpoint, consumer group, cron and deployment product are not acceptance identities in this Step. Their selected bindings are consumed later from `04`/`07` configuration contracts.

## 9. 接口/事件/Job 停审记录

| Gate | Exact formal inventory | TC/DS/EV and path fixed | Dependency type correct | Downstream full implementation avoided | Design stop-review |
|---|---|---|---|---|---|
| `AC-CH-IF-CMD` | 26/26 | yes | local API/runtime | yes | `pass-designed / not-evaluated` |
| `AC-CH-IF-QUERY` | 33/33 | yes | local read/downstream seam | yes | `pass-designed / not-evaluated` |
| `AC-CH-IF-INBOUND` | 6/6 | yes | event/runtime | yes | `pass-designed / not-evaluated` |
| `AC-CH-IF-OUTBOUND` | 10/10 | yes | event collaboration | yes | `pass-designed / not-evaluated` |
| `AC-CH-IF-JOB` | 8/8 | yes | job/handoff/derived | yes | `pass-designed / not-evaluated` |
| `AC-CH-SYNC-001..005` | 5/5 seam classes | yes | compile/runtime/event/downstream distinct | yes | `pass-designed / not-evaluated` |

## 10. 跨接口同步门禁审计

| 审计项 | 设计结果 | 后续 owner |
|---|---|---|
| protocol inventory | `26 + 33 + 6 + 10 + 8 = 83/83`; no orphan/duplicate active ID | Step 15 reverse audit |
| command/query exactness | every member has one canonical TC/DS/EV ordinal and formal flow name | Step 8/10/15 |
| Query no-write | all 33 have resolver-first and zero-effect predicate | Step 8/10 |
| event source/capture symmetry | all 10 outbound and 6 inbound have source/schema/ref/receipt/capture rules | Step 8/10 |
| Job replay/recovery | all 8 have frozen plan/ordinal/report/reentry contract | Step 8/12 |
| dependency classification | compile/runtime/event/downstream/handoff rows have distinct proof method | Step 15 |
| route/topic drift | physical transport names not promoted to active truth; logical keys remain formal | 04/07 handoff |
| downstream scope leakage | no full sibling implementation requirement; unavailable semantics explicit | Step 12/13 |
| reference mismatch | L1 reference protocol counts/IDs are historical; CH active inventory is authoritative | project ledger historical note |
| unresolved blocker | `0`; any later formal drift reopens owner 03/04/05 step, not this prose | controlled reopen |

## 11. 回填草稿：formal `06-验收标准.md` §7

Formal §7 should contain:

1. 26 Command、33 Query、6 Inbound、10 Outbound、8 Job exact inventory and grouped gates;
2. Command metadata/result/replay, Query visibility/no-write, Inbound header-first/receipt, Outbound source/capture/replay and Job frozen-plan/reentry rules;
3. compile-time/runtime/event-collaboration/downstream dependency mapping;
4. `AC-CH-SYNC-001..005` cross-repository seam conditions;
5. fixed `TC/DS/EV` and raw/report/index path templates;
6. explicit rule that physical topic/route/product readiness and downstream internal implementation are not inferred;
7. failure, blocked and invalid evidence impact, with Step 8~14 responsibility retained.

## 12. 待确认事项与受控重开

| 事项 | 状态 | 处理 |
|---|---|---|
| physical topic/endpoint/consumer group | not selected | 04/07 configuration binding; no acceptance ID change |
| selected downstream products | not selected | immutable scope manifest; selected blocked does not become P0 pass |
| exact adapter implementation | not established | 07 boundary skeleton and implementation plan; current gate remains contract-only |
| L1 reference count mismatch | recorded historical/reference material | active CH 83-flow inventory remains authoritative |
| numeric sync latency | no active source | no threshold; remains not_evaluated |

## 13. Step 7 完成门禁与下一步

| 条件 | 结果 |
|---|---|
| 26/33/6/10/8 protocol family gates | `83/83; pass-designed` |
| Query no-write and resolver-first | `closed` |
| Inbound header-first/receipt/replay | `closed` |
| Outbound source/capture/replay | `closed` |
| Job frozen plan/ordinal/reentry | `closed` |
| compile/runtime/event/downstream dependency type mapping | `5 seam classes; pass-designed` |
| downstream full implementation requirement | `0` |
| implementation/run/artifact/report/evidence/verdict/signoff facts | none claimed |
| unresolved upstream blocker | `0` |
| formal `06-验收标准.md` modified | `no; Step 15 only` |
| 下一步 | `enter_06_step_08_state_tx_consistency` |

Step 7 的 `pass-designed` 只表示接口、事件和同步验收合同静态闭合，不表示任何协议、事件或 Job 已执行通过。
