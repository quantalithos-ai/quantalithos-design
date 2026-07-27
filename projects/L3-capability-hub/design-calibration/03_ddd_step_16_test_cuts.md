# L3-capability-hub 03 详细设计 Step 16：测试切口与最小验证清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16
> 回填章节：`projects/L3-capability-hub/03-详细设计.md` §15
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`03_step_16_completed_continuous_execution`
> 真实性边界：本文只定义未来测试义务和 oracle；没有执行测试、生成 run_id、artifact、report、evidence 或验收结论。

---

## 1. 开工、读取闭包与历史隔离

| 输入 | 读取内容 | 本步承接结论 |
|---|---|---|
| 详细设计 SOP Step 16、书写规范 §5.15 | 四类必备测试切口表、关键协议正反向、合法/非法状态转换、脚本契约边界 | 本文不得替代正式 `05-测试方案.md` |
| 通用规范与真相源闭环标准 | 测试 oracle 必须回指正式 owner，不允许从日志或 mock 自造业务事实 | fake 只注入既有 Port / repository / clock / id / UoW seam |
| 正式 `00/01/02` | capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure、controlled consumer view、trace/impact/material/reference边界 | execution、tools、marketplace、governance approval、method body均为负向断言 |
| Step 5~8 | 7 个 workspace member、43 个 HLD 对象 + 7 个 application helper、36 Port、22 repository trait / 110 method、250 public protocol type | module/object/protocol contract cut 的精确 inventory |
| Step 9 | `26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job = 83` 条独立 flow | 每条 flow 至少一条正向和一条异常 cut，且保留 transaction/no-write/post-commit oracle |
| Step 10 | 24 个 state-like enum / 111 active variant；`638 = 239 current + 98 reserved + 301 illegal` pair | exact enum/variant、current/reserved/illegal、same-state/no-op、terminal gate |
| Step 11~13 | single persistence authority、22/110 repository、三态 commit resolution、17 error、51 issue、canonical digest、两态 idempotency、Job 三阶段 | transaction、rollback、crash、duplicate、race、commit-unknown 与 durable/fake parity cut |
| Step 14 | 27 local/base + 9 external Port、14 external callable、6 source、10 route、8 Job dispatch、Configured/Fake/Disabled/Missing | configuration/binding/activation/failure-injection cut |
| Step 15 | 60 log、48 metric、27 span、3 event、20 durable profile、Off/Redacted、11 count reader | owner/cardinality/redaction/no-cancellation cut |

旧正式 `03/05/06`、README 中围绕 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS/Vault、runtime/tools gateway、marketplace listing、旧 outbox relay 或历史性能数字的测试内容均为 `historical_material`。本文不继承旧 TC 编号、阈值、run、evidence alias、签署或“已通过”状态。

## 2. 目标、非目标与 SOP 五问

### 2.1 本步目标

1. 为每个 module/object/protocol/state/transaction/binding/observability 契约给出可实现的最小测试入口。
2. 明确 fake seam、输入控制点、positive/negative scenario、typed oracle 和零副作用断言。
3. 为正式 `05` 留出完整用例、数据、环境、自动化、非功能和证据设计空间。
4. 任何后续实现若改变对象、字段、variant、Port、flow、state 或 error，必须先回开对应详细设计 Step，再更新测试切口。

### 2.2 明确非目标

- 不规定覆盖率百分比、执行排期、CI 产品、数据库/消息产品、容器拓扑或真实外部系统地址。
- 不声明测试文件、fixture、脚本、artifact 或 report 已经存在。
- 不以 log、metric、span、mock invocation 自身证明业务 truth；业务 oracle 只能来自 typed return、正式 repository read、stored result/receipt/report 或明确的 zero-write spy。
- 不把外部 governance approval、runtime/tools execution、SDK client/cache、marketplace listing、method/document/provider body 纳入 Hub 正向测试对象。

### 2.3 SOP 五问回答

| 问题 | 本项目答案 |
|---|---|
| 每个模块至少测什么？ | `contracts`测schema/ref/codec/canonical bytes；`domain`测factory/member/invariant/state；`application`测83 flow编排、幂等、UoW和side-effect顺序；`infra`测22/110 repository、single authority、binding/fake parity；`api/worker/jobs`测entry metadata、non-cancelling invocation、activation/drain和typed terminal。 |
| 每个接口至少测什么？ | 每个C/Q/I/O/J均有本文件§7的positive与abnormal cut；写通道额外测duplicate/conflict/rollback，Query额外测strict no-write，Outbound额外测A/B/C，Job额外测plan/target/final。 |
| 状态机如何测？ | 以Step 10 exact enum/variant和638 pair分类为参数源；覆盖每个current方向、每个reserved callable零调用、每个illegal分组、terminal rewrite和same-state exact no-op。 |
| 一致性、幂等和并发如何测？ | 用deterministic fake authority、barrier、failure injection和linearizable recovery read控制reserve race、CAS、commit三态、rollback、capture/job phase crash；oracle同时检查winner、carrier、sidecar、stored surface和调用次数。 |
| 哪些留给正式05？ | TC编号/优先级、fixture文件、数据全集、真实durable/external联调、命令最终绑定、覆盖率阈值、artifact/report格式、evidence alias分配与执行策略。 |

## 3. Test-cut identity 与 oracle 规则

| Prefix | Scope | Identity rule |
|---|---|---|
| `CUT-MOD-*` | workspace member / module | 一个成员一个主 cut，必要时拆 owner boundary |
| `CUT-OBJ-*` | object/value/protocol construction | 按正式对象或闭合 family，不创造测试专用业务对象 |
| `CUT-FLOW-C/Q/I/O/J-*` | 83 条 exact flow | ID 与 Step 9 顺序一一对应 |
| `CUT-STATE-*` | 24 state-like family | exact enum name 为唯一状态词汇 |
| `CUT-TX-*` | persistence/UoW/idempotency/concurrency | 以 authority、phase 和 carrier symmetry 为 identity |
| `CUT-BIND-*` | config/runtime/external binding | 以 Stage / Port / source / route / Job owner 为 identity |
| `CUT-OBS-*` | observability/redaction | 以 Step 15 profile owner、plane、phase 为 identity |

每个 test cut 的 oracle 按以下优先级判定：

```text
typed public/application terminal
  -> exact repository/stored carrier state when persistence is expected
  -> exact sidecar/capture/journal symmetry
  -> exact zero-write / zero-call spy for prohibited effects
  -> observer projection only as observer-contract oracle
```

不得使用日志文本、错误字符串、`Debug` 输出、elapsed-time 猜测、mock 返回以外的内部 map、current-truth reconstruction 或外部系统状态替代正式 oracle。

## 4. Fake seam 与 deterministic fixture contract

| Seam | Required controllable behavior | Required observations | Forbidden shortcut |
|---|---|---|---|
| `CapabilityClock` / ID generator | frozen/advanced time、deterministic unique IDs、collision injection | exact created/updated time and ref derivation | wall clock / random retry |
| 22 repository traits | missing/existing/version conflict/unique conflict/stable page/order/asymmetry | exact method calls、keys、expected version、staged set | private finder、full map scan、hidden auto-repair |
| `CapabilityUnitOfWorkManager` | begin/commit/rollback、Durable/NotDurable/Unknown、stable tx ref、barrier | staged members、resolution calls、rollback precedence | boolean commit、row absence as resolution |
| idempotency/stored surface | absent reserve、same digest winner、different digest conflict、Reserved/Completed、missing/corrupt surface | one reserve、one winner read、no rerun、surface symmetry | TTL expiry、blind retry、current truth rebuild |
| 9 external Ports / 14 callables | Configured success/typed failure/timeout/permanent invalid/contract mismatch; Fake/Disabled | exact body-free request、call count、typed result | raw body capture、generic unavailable、fake success for Missing |
| Inbound source driver | header/schema/body-size/trusted actor gates、opaque completion | no dispatch before header pass、exact completion action | offset/lease/attempt as business state |
| event collaboration | exact capture load、typed collaboration return、intent bind | phase call order、no local delivery state | publish raw payload、outbox/DLQ lifecycle |
| Job runner | deterministic frozen plan、target barrier、terminal cell、deadline observation | per-phase UoW、ordinal order、one terminal write | scope rescan、whole-run UoW、deadline cancellation |
| observer sink | plane-specific record capture、field rejection、sink failure | profile identity、owner、redacted fields、non-recursion | observer result changes caller or commit |

Fixture values must be synthetic and body-free. Formal `05` will define files and generators; Step 16 only requires factories capable of producing valid/invalid refs, exact enum variants, bounded protocol metadata, opaque body carriers, digest-domain inputs and stable versions.

## 5. 模块测试切口汇总

| Cut | Module / contract | Minimum verification | Suggested type |
|---|---|---|---|
| `CUT-MOD-01` | `contracts` | 250 public types compile/construct/roundtrip where serialized；all ref/value validation；canonical request field bytes deterministic；unknown/forbidden field and schema-version rejection；public surface never imports domain-only type | unit + compile-time contract |
| `CUT-MOD-02` | `domain` | 43 HLD objects factory/member invariants；24 exact state families；reason/ref/source/version symmetry；illegal/terminal/no-op produce zero mutation | table-driven unit |
| `CUT-MOD-03` | `application` | 83 services/handlers call only declared Port；write guard order；resolver-before-UoW where declared；same-UoW effects；duplicate/no-write/post-commit boundaries | service tests with fakes |
| `CUT-MOD-04` | `infra` | one persistence authority；22 traits/110 methods；CAS/unique/index/page/order；Durable/Fake parity；Stage 0~7 all-or-nothing assembly | adapter contract + integration seam |
| `CUT-MOD-05` | `api` | exact route/body/schema/metadata mapping；pre-dispatch rejection；observation timeout does not cancel owned invocation；safe response mapping | handler contract |
| `CUT-MOD-06` | `worker` | 6 source slots；header-first gate；opaque delivery completion；one exact continuation；activation barrier and shutdown precedence | runtime seam + deterministic task test |
| `CUT-MOD-07` | `jobs` | 8 closed dispatches；input symmetry；non-cancelling deadline observation；plan/target/final phase and terminal-cell single write | runner/service test |

### 5.1 Cross-module dependency cuts

| Cut | Verify | Oracle |
|---|---|---|
| `CUT-MOD-DEP-01` | seven workspace members and 15 allowed local direct edges | dependency metadata/static check; no reverse edge |
| `CUT-MOD-DEP-02` | only `core-contracts = { path = "../quantalithos-core/crates/contracts" }` is a sibling Cargo edge | static manifest check; all non-core siblings absent |
| `CUT-MOD-DEP-03` | API/Worker/Jobs receive selected application graph, never repository or external adapter directly | constructor/type dependency check |
| `CUT-MOD-DOC-01` | every public struct/enum, struct field, variant, variant payload field, trait/method and public callable carries English `///`; enum struct variant fields have no `pub` | source/static documentation check after implementation |

## 6. Object、codec 与 Port contract cuts

| Cut family | Inventory | Positive cut | Negative cut / oracle |
|---|---:|---|---|
| `CUT-OBJ-CORE` | 43 HLD objects | each factory produces exact valid initial object; each callable preserves invariant/version/time/source | invalid ref/state/reason/source rejected with zero persisted effect |
| `CUT-OBJ-HELPER` | 7 application helpers | canonical digest/capture/stored/journal helpers are deterministic and body-free | cross-channel/key/domain mismatch rejected; no generic bytes fallback |
| `CUT-OBJ-PROTOCOL` | 250 public types | exact DTO/envelope/view/receipt/report variant construction and stable codec | unknown schema, missing required field, forbidden duplicated envelope field rejected |
| `CUT-OBJ-DIGEST` | four `[u8; 32]` digest domains | same declared canonical fields => same digest; domain prefix separates channels | map order/pretty/Debug/raw body cannot affect or substitute canonical bytes |
| `CUT-PORT-LOCAL` | 27 local/base Ports | exact callable success/failure shape and Send async future parity | no `?Send`, hidden method, private finder or second authority |
| `CUT-PORT-EXTERNAL` | 9 Ports / 14 callables | body-free typed request/result for Configured and DeterministicFake | Disabled returns exact NotConfigured surface; Missing never constructs graph |
| `CUT-REPO-ALL` | 22 traits / 110 methods | parameterized contract registry invokes every exact method with key/index/version/order oracle | uncovered method, undeclared index, hidden mutation or fake/durable divergence fails gate |

## 7. 接口测试切口汇总

### 7.1 Command：26/26

所有 Command 共享四个附加 oracle：same key/same digest只重放stored surface；same key/different digest冲突且winner不变；fresh accepted UoW中的declared truth/sidecar/capture/result/completion原子；pre-commit失败全部回滚且post-commit collaboration失败不回滚local truth。

| Cut / flow | Positive minimum | Abnormal minimum | Exact effect oracle |
|---|---|---|---|
| `CUT-FLOW-C-01` establish access context | new identity + source ref/state accepted | invalid source symmetry or duplicate conflict | identity/change/trace/capture/result atomic; no provider body |
| `CUT-FLOW-C-02` correct identity | loaded expected version corrected | stale version or terminal identity | winner unchanged; no hidden source reconstruction |
| `CUT-FLOW-C-03` retire identity | active identity retires | already terminal / illegal pair | exact history/change/trace; no relation cascade |
| `CUT-FLOW-C-04` record access review fact | valid body-free review recorded | approval/policy body or inconsistent subject | review + identity revision only; no governance approval truth |
| `CUT-FLOW-C-05` register registry entry | identified capability registered | missing identity / duplicate registry | registry/change/trace/capture atomic |
| `CUT-FLOW-C-06` update registry lifecycle | legal current transition | illegal/reserved/expected-version conflict | exact transition or zero mutation |
| `CUT-FLOW-C-07` update visibility basis | actual basis delta | exact no-op / invalid applicability | no fake history on no-op |
| `CUT-FLOW-C-08` retire registry entry | legal retirement | terminal reopen | no automatic exposure/runtime mutation |
| `CUT-FLOW-C-09` establish descriptor | accepted descriptor for registry | missing registry / body-bearing provider contract | descriptor/change/trace/capture; no execution endpoint body |
| `CUT-FLOW-C-10` replace descriptor | old replaced + new accepted | same descriptor / wrong predecessor | two-object symmetry and one change record |
| `CUT-FLOW-C-11` record risk summary | body-free safe summary revision | forbidden raw risk/policy material | summary/descriptor history symmetry |
| `CUT-FLOW-C-12` attach secret reference | resolver ref/state + safe summary attached | secret value/credential or mismatched resolver response | no secret body persistence/observation |
| `CUT-FLOW-C-13` attach governance seam | relation from valid review/ref | missing review / approval body | seam/change/trace/capture; audit handoff calls=0 |
| `CUT-FLOW-C-14` replace governance seam | exact current relation replaced | wrong prior ref/state | no governance workflow mutation; audit handoff calls=0 |
| `CUT-FLOW-C-15` expire governance seam | legal expiry | terminal/illegal transition | reason/source/version exact |
| `CUT-FLOW-C-16` attach method relation | body-free method ref relation | method body/source/package supplied | relation/change/trace/capture only |
| `CUT-FLOW-C-17` remove method relation | current relation removed | terminal rewrite / wrong subject | no method-library mutation |
| `CUT-FLOW-C-18` establish formal exposure | prerequisites produce exposure + visibility | missing/unresolved prerequisite | same-UoW exposure/visibility/change/trace/capture; no runtime allow |
| `CUT-FLOW-C-19` update visibility applicability | source-version symmetric revision | stale source/mismatched consumer | no runtime/tools call |
| `CUT-FLOW-C-20` suspend formal exposure | legal suspend | illegal terminal/current pair | controlled view propagation only when declared |
| `CUT-FLOW-C-21` retire formal exposure | exposure + visibility retirement | partial/asymmetric source | no SDK package/client/cache mutation |
| `CUT-FLOW-C-22` record impact fact | exact change/trace forms identified impact | unknown change or subject mismatch | impact/trace/capture atomic |
| `CUT-FLOW-C-23` record trace handoff summary | local HandoffPending revision commits then optional handoff | handoff timeout/failure | local trace remains Durable; only this flow calls trace handoff |
| `CUT-FLOW-C-24` record reference state | exact kind resolver observation stored | wrong kind/subject/state response | change_record_refs and traceability_refs remain empty as designed |
| `CUT-FLOW-C-25` register document reference | body-free document ref/state | document body/schema body | no descriptor/document-store write |
| `CUT-FLOW-C-26` register consumer reference | runtime-tools or SDK typed ref/state | execution result, SDK response/package | no execution/client/cache truth |

### 7.2 Query：33/33

Every Query cut must assert repository/UoW write calls, reserve calls, capture calls, handoff/collaboration calls, repair calls and runtime execution calls are all zero. Resolver-first failure maps to the declared visible/not-visible/degraded surface; it never falls back to unrestricted current truth.

| Cut / flow | Positive minimum | Abnormal minimum | Surface oracle |
|---|---|---|---|
| `CUT-FLOW-Q-01` get identity | visible exact identity | missing/degraded resolver | typed single surface; no write |
| `CUT-FLOW-Q-02` search identities | stable page/order/cursor | empty/not-visible page | no hidden full scan |
| `CUT-FLOW-Q-03` get review fact | exact/current optional fact | absent/inconsistent relation | optional body-free review only |
| `CUT-FLOW-Q-04` get registry entry | visible entry + identity | missing/degraded | typed truth view |
| `CUT-FLOW-Q-05` list registry entries | stable typed page | empty/invalid cursor | no rebuild |
| `CUT-FLOW-Q-06` get visibility semantics | entry + optional exposure/visibility | source mismatch | explicit optional semantics, not runtime decision |
| `CUT-FLOW-Q-07` get descriptor | exact/current descriptor | unavailable/not-visible | no provider request body |
| `CUT-FLOW-Q-08` get risk summary | safe summary | absent/stale/unavailable | closed state/reason |
| `CUT-FLOW-Q-09` get secret safe summary | safe summary + ref/state | missing/forbidden | no secret value/credential |
| `CUT-FLOW-Q-10` list descriptors | stable capability-bound page | empty/invalid scope | no generic descriptor scan |
| `CUT-FLOW-Q-11` get governance seam | relation + ref/state | missing/degraded | no approval/policy body |
| `CUT-FLOW-Q-12` get governance separation | review + optional seam | absent seam | separation surface, never allow/deny |
| `CUT-FLOW-Q-13` get method relation | relation + ref/state | missing/degraded | no method body/source |
| `CUT-FLOW-Q-14` list relations | kind-bound page | unsupported kind/cursor | no cross-kind union |
| `CUT-FLOW-Q-15` get exposure | exposure + visibility | missing/asymmetric visibility | formal boundary only |
| `CUT-FLOW-Q-16` get visibility applicability | exact applicability | stale/mismatched source | not runtime authorization |
| `CUT-FLOW-Q-17` get controlled view | exact/current view | stale/partial/unavailable | explicit freshness surface |
| `CUT-FLOW-Q-18` list runtime-tools consumable | consumer-bound page | invalid consumer ref/not-visible | no tool execution |
| `CUT-FLOW-Q-19` get SDK boundary | server boundary view | missing SDK ref/degraded | no SDK client/package/cache |
| `CUT-FLOW-Q-20` get access trace | append-only stable page | partial/pending/invalid cursor | historical refs preserved |
| `CUT-FLOW-Q-21` get change impact | exact or trace-linked impact | absent/mismatch | optional impact view |
| `CUT-FLOW-Q-22` get downstream summary | typed feedback page | empty/partial/unavailable | no downstream mutation |
| `CUT-FLOW-Q-23` get audit handoff trace | trace + body-free refs/states | partial/missing external ref | no audit/evidence body |
| `CUT-FLOW-Q-24` search directory | stable projection page | stale/unavailable/empty | no projection rebuild |
| `CUT-FLOW-Q-25` browse directory | stable browse page | stale/invalid cursor | no ranking/listing owner merge |
| `CUT-FLOW-Q-26` get audit export summary | exact/current summary | partial/stale/unavailable | no archive body/evidence alias |
| `CUT-FLOW-Q-27` get ecosystem discovery | read-only summary | stale/partial/unavailable | no marketplace listing truth |
| `CUT-FLOW-Q-28` get reconciliation report | immutable exact/scope page | missing/invalid nested cursor | no reconciliation rerun |
| `CUT-FLOW-Q-29` get reference state | all canonical values explicit | resolver unavailable/mismatch | no raw external body |
| `CUT-FLOW-Q-30` get document reference | typed ref + state | missing/degraded | no document body |
| `CUT-FLOW-Q-31` get runtime-tools ref | typed ref + state | missing/degraded | no execution state/result |
| `CUT-FLOW-Q-32` get SDK ref | typed ref + state | missing/degraded | no SDK body |
| `CUT-FLOW-Q-33` get observability/audit ref | typed ref + state | missing/degraded | no telemetry/audit/evidence body |

### 7.3 Inbound、Outbound 与 Job：24/24

| Cut / flow | Positive minimum | Abnormal minimum | Exact oracle |
|---|---|---|---|
| `CUT-FLOW-I-01` governance result ref changed | header/schema pass and ref/state revision | unsupported schema, duplicate, subject mismatch | typed receipt; seam/approval writes=0 |
| `CUT-FLOW-I-02` method asset ref changed | ref/state revision | unsupported/duplicate/body-bearing input | relation/method body writes=0 |
| `CUT-FLOW-I-03` downstream impact reported | summary revision | invalid source/duplicate/delayed | typed receipt; core truth writes=0 |
| `CUT-FLOW-I-04` external source ref changed | source ref/state revision | mismatch/duplicate | identity/descriptor writes=0 |
| `CUT-FLOW-I-05` audit material ref changed | audit ref/state revision | body/evidence/duplicate | handoff/evidence writes=0 |
| `CUT-FLOW-I-06` document ref changed | document ref/state revision | body/schema/duplicate | descriptor/document body writes=0 |
| `CUT-FLOW-O-01` identity changed | A capture Durable, B collaboration, optional C bind | missing/asymmetric source, B failure, C Unknown | no local delivery state; A/B/C independent |
| `CUT-FLOW-O-02` registry changed | registry source captured | reconciliation report as source rejected | source/snapshot/capture symmetry |
| `CUT-FLOW-O-03` descriptor changed | exact descriptor record captured | raw provider body/mismatch | body-free immutable snapshot |
| `CUT-FLOW-O-04` seam changed | exact seam record captured | approval/policy body | no governance truth copy |
| `CUT-FLOW-O-05` method relation changed | exact relation record captured | method body/source | no method-library mutation |
| `CUT-FLOW-O-06` exposure changed | exact exposure record captured | runtime allow/deny payload | no runtime execution state |
| `CUT-FLOW-O-07` consumer view availability | exact view revision captured | wrong source version | no consumer cache owner merge |
| `CUT-FLOW-O-08` impact identified | exact identified impact captured | non-identified/mismatched trace | no synthetic impact |
| `CUT-FLOW-O-09` derived material refreshed | one of four allowed source variants | unsupported material/report variant | exact schema/route; no marketplace listing |
| `CUT-FLOW-O-10` reference changed | canonical reference revision captured | wrong kind/state/source | no raw external document/result |
| `CUT-FLOW-J-01` registry reconciliation | frozen plan -> per-target -> immutable report | reserve race, partial failure, commit Unknown | no registry repair; journal/report symmetry |
| `CUT-FLOW-J-02` refresh consumer view | view revision per eligible target | stale plan/target failure/duplicate | no exposure/core truth mutation |
| `CUT-FLOW-J-03` rebuild directory | projection revision | partial/failure/duplicate | no source truth/ranking service mutation |
| `CUT-FLOW-J-04` prepare audit export | body-free export summary | missing refs/partial/failure | no audit body/evidence generation |
| `CUT-FLOW-J-05` rebuild ecosystem discovery | read-only summary | partial/failure/duplicate | no marketplace listing/transaction |
| `CUT-FLOW-J-06` derived reconciliation | immutable report | incomplete basis/failure/duplicate | no automatic material rebuild |
| `CUT-FLOW-J-07` refresh external references | canonical state revisions | resolver mismatch/timeout/duplicate | no external body or core truth repair |
| `CUT-FLOW-J-08` repair collaboration | official snapshot collaborate + intent bind | missing/corrupt snapshot, B failure, C Unknown | no new event/source rebuild/local delivery state |

Coverage gate: exact IDs `C01..C26`, `Q01..Q33`, `I01..I06`, `O01..O10`, `J01..J08` must appear once in the future formal test traceability registry. A family-level helper may implement common assertions, but cannot replace an exact flow case registration.

## 8. 状态机测试切口：24/24

| Cut | Exact state family | Positive/current minimum | Illegal/reserved/special oracle |
|---|---|---|---|
| `CUT-STATE-01` | `CapabilityIdentityState` | accepted initial/correction/retirement edges | terminal reopen and wrong source => zero mutation |
| `CUT-STATE-02` | `CapabilityAccessReviewFactState` | valid draft/recorded formation and terminal history | approval body/terminal rewrite forbidden |
| `CUT-STATE-03` | `RegistryLifecycleState` | each current lifecycle direction used by flow | reserved caller count=0; illegal pair zero effects |
| `CUT-STATE-04` | `AdapterDescriptorState` | draft-in-UoW -> accepted/unresolved/replaced | persisted Draft and unsupported retire route rejected |
| `CUT-STATE-05` | `DescriptorRiskConstraintSummaryState` | exact ready/partial/unavailable/supersede behavior | reverse recovery only through declared callable |
| `CUT-STATE-06` | `SecretHandlingSafeSummaryState` | stale/unavailable/forbidden safe transitions | secret truth/value never used as oracle |
| `CUT-STATE-07` | `GovernanceSeamState` | attach/reactivate/expire/unresolved/replace/forbidden | approval/policy cannot advance state |
| `CUT-STATE-08` | `CapabilityMethodRelationState` | active/stale/unresolved/removed/forbidden | method body cannot advance or repair |
| `CUT-STATE-09` | `FormalExposureState` | pending/accepted/active/suspended/unavailable/retired edges | runtime decision cannot advance; terminal no reopen |
| `CUT-STATE-10` | `FormalVisibilityState` | source-version-symmetric applicability | stale/mismatched source and runtime authorization rejected |
| `CUT-STATE-11` | `TraceabilityState` | recorded/partial/handoff-pending/superseded revision | external handoff cannot rewrite local terminal |
| `CUT-STATE-12` | `CapabilityImpactState` | identified/partial/delayed/ignored/resolved | reserved/illegal and fake source zero effects |
| `CUT-STATE-13` | `DownstreamImpactSummaryState` | each factory feedback outcome and legal revision | impact/source truth writes=0 |
| `CUT-STATE-14` | `ConsumerViewFreshnessState` | stale/rebuilding/ready/partial/unavailable | Query and runtime/SDK calls cannot mutate |
| `CUT-STATE-15` | `DirectoryProjectionState` | rebuild current pairs and exact no-op | source truth, ranking/listing writes=0 |
| `CUT-STATE-16` | `AuditExportState` | ready/partial/stale/unavailable current pairs | raw audit/evidence/signoff calls=0 |
| `CUT-STATE-17` | `EcosystemDiscoveryState` | ready/partial/stale/unavailable current pairs | marketplace/runtime/core writes=0 |
| `CUT-STATE-18` | `ReferenceResolutionValue` | all seven/eight kind-specific allowed values and precedence | wrong kind/scope/trace and forbidden body rejected |
| `CUT-STATE-19` | `CapabilityEventCaptureState` | `Captured -> IntentBound` with stable intent | Delivered/Failed/PendingDelivery local variants absent; terminal CAS protected |
| `CUT-STATE-20` | `CapabilityIdempotencyState` | `Reserved -> Completed` with matching surface | no persisted Conflict; Completed rewrite forbidden |
| `CUT-STATE-21` | `CapabilityJobExecutionState` | `Planned -> Finalized` only after all terminal | incomplete target set/final result mismatch rejected |
| `CUT-STATE-22` | `CapabilityJobExecutionTargetOutcome` | Planned to Succeeded/Failed/Skipped | terminal outcome overwrite and cross-ordinal update rejected |
| `CUT-STATE-23` | `EventCollaborationStatus` | all typed external outcomes observed | local save/transition/count=0; external owner preserved |
| `CUT-STATE-24` | `ReconciliationReportState` | each valid immutable factory outcome | in-place transition/update absent; new run uses new report id |

Global matrix gate:

| Classification | Baseline | Future test registration rule |
|---|---:|---|
| current | 239 | every exact current direction appears in a parameter row; multi-source guard variants are distinct inputs |
| reserved | 98 | each grouped reserved source/target asserts declared callable/route invocation count = 0 |
| illegal | 301 | each grouped illegal source/target asserts exact typed rejection and all field/version/time/side effects = 0 |
| active variants | 111 | exact Rust spelling only; no HLD lowercase or generic active/ready/failed alias |

## 9. Persistence、transaction、consistency、idempotency 与 concurrency cuts

| Cut | Scenario / injection | Required oracle |
|---|---|---|
| `CUT-TX-01` | every 110 repository method success/missing/conflict class | exact key/index/order/version, no hidden finder, durable/fake parity |
| `CUT-TX-02` | create/update/append/insert-only constraint timing | expected version only from `Loaded<T>`; winner unchanged on conflict |
| `CUT-TX-03` | source + change/trace/material/capture/result same-UoW success | all declared members visible together after `Durable` |
| `CUT-TX-04` | failure at each staged write and rollback success | no staged member visible; original error preserved |
| `CUT-TX-05` | rollback failure after known pre-commit error | rollback diagnostic independent; original failure not overwritten; no failed business fact |
| `CUT-TX-06` | commit returns `NotDurable` | no accepted carrier/projection; exact recovery surface |
| `CUT-TX-07` | commit returns `Unknown`, later resolves Durable/NotDurable | no premature result; same tx ref + barrier + linearizable exact read only |
| `CUT-TX-08` | reserve absent winner | one Reserved record, fresh effect allowed once |
| `CUT-TX-09` | reserve loser same key/same digest | rollback/discard local plan, one exact winner read, stored replay, effect calls=0 |
| `CUT-TX-10` | reserve loser same key/different digest | conflict surface, winner unchanged, effect calls=0 |
| `CUT-TX-11` | Completed with missing/corrupt stored result/receipt/report | `ConsistencyDefect`; no current-truth reconstruction or rerun |
| `CUT-TX-12` | Command/Inbound committed orphan Reserved | consistency defect; no second reservation or blind retry |
| `CUT-TX-13` | Job Reserved + matching Planned journal | exact frozen-plan reentry; no scope rescan |
| `CUT-TX-14` | Job Reserved without/asymmetric journal | consistency defect; no plan regeneration |
| `CUT-TX-15` | two writers same expected version | one durable winner; loser reload/retry only where policy explicitly allows |
| `CUT-TX-16` | affected-material collect-before-mutate race | deterministic typed union, one revision per eligible material, no full scan |
| `CUT-TX-17` | Outbound Phase A crash/rollback | snapshot/capture/source atomic; no collaboration before Durable |
| `CUT-TX-18` | Phase B timeout/failure | local source/capture unchanged; no delivery state or rollback |
| `CUT-TX-19` | Phase C CAS race/Unknown | one stable intent bind or exact recovery; no duplicate collaboration caused by observer |
| `CUT-TX-20` | Job initial/each target/final crash points | each UoW independently recoverable; terminal journal and effect symmetry |
| `CUT-TX-21` | stable cursor/index asymmetry/corruption | typed consistency failure; no generic scan/fallback |
| `CUT-TX-22` | digest canonical-byte boundary | same fields stable, domain/channel variant separated, retry metadata excluded |

## 10. Configuration 与 external binding cuts

| Cut | Positive profiles | Negative profiles / oracle |
|---|---|---|
| `CUT-BIND-01` | validated typed root and complete Stage 0~7 graph | raw missing/invalid/unknown/conflicting source fails before partial graph escapes |
| `CUT-BIND-02` | Local durable or parity-complete deterministic fake | Deployment fake count must be 0; required local Port cannot be Disabled |
| `CUT-BIND-03` | Integration Configured/Fake/explicit Disabled external slots | Missing/wrong family/dangling ref/profile mismatch blocks activation |
| `CUT-BIND-04` | all 27 local/base Ports share authority A | second store authority/private finder/partial prefix fails construction |
| `CUT-BIND-05` | all 9 external Ports and 14 callables exact typed outcomes | generic adapter, raw response, cross-family fallback rejected |
| `CUT-BIND-06` | six enabled Inbound source tasks parked before barrier | Disabled has no task/fetch/receipt; Missing blocks; header failure dispatch=0 |
| `CUT-BIND-07` | ten routes map official immutable snapshots | wildcard, per-route silent default, payload rebuild and dynamic marketplace/runtime route rejected |
| `CUT-BIND-08` | eight Job dispatches exact kind/input/result | generic execute, unknown kind fallback, scheduler-owned business retry rejected |
| `CUT-BIND-09` | timeout and retry classification by phase | commit Unknown/consistency/codec/permanent/unexpected never enters mutation retry |
| `CUT-BIND-10` | shutdown stop/drain/join precedence | original failure preserved; no local queue/DLQ/attempt lifecycle |
| `CUT-BIND-11` | stable serde/raw-value bounded header and SHA domain behavior | generic `Value`, map iteration, pretty/Display/Debug and algorithm selector rejected |
| `CUT-BIND-12` | sibling `core-contracts` path available and compatible | absence/incompatibility is prerequisite blocker, never local copied replacement |

Formal `04` will assign concrete config keys, sources, defaults, units, bounds and activation behavior. Tests must be generated from that catalog; no implementation may infer those values from this Step.

## 11. Observability、audit 与 redaction cuts

| Cut | Verification | Required oracle |
|---|---|---|
| `CUT-OBS-01` | 60 structured-log profiles | exact primary/folded owner, event key/level/terminal/allowed fields; no raw cause/body |
| `CUT-OBS-02` | 48 metric profiles | 34 Counter/12 Histogram/2 Gauge; closed low-cardinality labels; 17/51 selector uniqueness |
| `CUT-OBS-03` | 27 spans + 3 fixed events | exact lifecycle and parent/current/historical link; observation timeout does not end owned invocation |
| `CUT-OBS-04` | 20 durable profiles | existing carrier + exact `Durable` + symmetry; request-local returns and Unknown emit none |
| `CUT-OBS-05` | `Off` mode | no field construction, sink call, violation/fallback; business flow unchanged |
| `CUT-OBS-06` | `Redacted` required source | forbidden/missing/unprojectable required field rejects entire emission; business flow unchanged |
| `CUT-OBS-07` | optional and atomic correlation | optional missing omits field; atomic historical group all-or-none |
| `CUT-OBS-08` | material classes | whole actor, secret/document/audit inner id, serialized/private/external body rejected |
| `CUT-OBS-09` | 11 count readers | 4 Inbound + 6 Job counts include zero; audit-ref count conditional; private wrappers unread |
| `CUT-OBS-10` | redaction/sink failure | at most one non-sensitive non-recursive fallback; caller/UoW/retry unchanged |
| `CUT-OBS-11` | four-plane same occurrence | planes may coexist but cannot source each other or add business decision |
| `CUT-OBS-12` | forbidden historical owner | provider cost/secret/runtime/tools/marketplace/approval/method body profile count=0 |

Concrete observability backend tests remain blocked until Step 15 §149 controlled reopen and formal `04` bind the backend-neutral implementation dependency.

## 12. Planned test/check script contracts

The following are design contracts for future implementation planning. Paths and commands are not claimed to exist now.

| Planned script | Type | Parameters | Input | Output contract | Failure semantics |
|---|---|---|---|---|---|
| `scripts/checks/check_design_inventory.sh` | static check | `--artifact-root` | source + generated inventory registry | machine-readable counts for 7/43+7/36/22+110/83/24+111/155+3 | non-zero on missing/extra/duplicate; no fake pass artifact |
| `scripts/checks/check_rustdoc_contract.sh` | static check | `--artifact-root` | Rust public declarations | declaration/field/variant/payload/callable omission list | non-zero on any missing English `///` or enum payload `pub` |
| `scripts/checks/check_forbidden_dependencies.sh` | static check | `--artifact-root` | Cargo manifests/module imports | dependency-edge report | non-zero on forbidden sibling/reverse/third-party type leakage |
| `scripts/checks/check_redaction_contract.sh` | check | `--artifact-root` / `--report-root` | synthetic observer artifacts only | redaction finding report | non-zero on raw body/secret/high-cardinality/forbidden ref material |
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | source, selected config profile and tests | `artifacts/test/<run_id>` | non-zero and retained failure manifest; never invent missing result |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | completed test artifacts | `reports/runs/<run_id>` | non-zero with exact missing/corrupt artifact list |

Formal `05` decides which scripts are required, their schemas and test-data bindings; formal `07` assigns implementation boundaries. No run id or evidence alias is allocated in this document.

## 13. Formal `05` handoff and minimum coverage registry

| Handoff | Baseline | Formal 05 must add |
|---|---:|---|
| modules | 7 + dependency/doc gates | exact test files/commands/environment and coverage rationale |
| objects/helpers/public types | 43 + 7 + 250 | fixture factories, property/example tables, codec compatibility data |
| Ports/repositories | 36, including 22 traits/110 methods | fake/durable contract suite registration and failure injection matrix |
| flows | 83 exact IDs | TC IDs, preconditions, input data, action, expected typed surface/effects, evidence contract |
| state | 24/111; 638 pairs | exact parameter dataset or generated registry for 239/98/301 classification |
| errors/issues | 17/51 | public mapping, precedence and no-string-classification tests |
| binding | 27 local + 9 external, 14 callables, 6/10/8 entry families | concrete config catalog and profile/environment matrix |
| observability | 60+48+27+20=155; 3 events | backend-neutral capture harness, redaction corpus and static owner/cardinality checks |

Formal 05 must preserve the distinction between a planned evidence contract and a real evidence artifact. It may define aliases and paths for future runs, but cannot mark them present until an implementation run produces them.

## 14. Cross-Step closure audit

| Source Step | Required test handoff | Coverage in this file | Gap |
|---|---|---|---:|
| Step 5 | module/file/dependency owner | §§5~6 | 0 |
| Step 6 | object/invariant/Rustdoc | §§5~6, 8 | 0 |
| Step 7 | 36 Port, 22/110 repository, fake parity | §§4, 6, 9 | 0 |
| Step 8 | public protocol and codec | §§6~7 | 0 |
| Step 9 | 83 exact flow cuts | §7 | 0 |
| Step 10 | 24/111 and 638 pair cuts | §8 | 0 |
| Step 11 | persistence/UoW/crash/cursor symmetry | §9 | 0 |
| Step 12 | 17/51 mapping/recovery precedence | §§7, 9, 11, 13 | 0 |
| Step 13 | digest/idempotency/race/reentry | §§6, 9 | 0 |
| Step 14 | profiles/bindings/dependencies | §10 | 0 |
| Step 15 | 155+3 owner/redaction/no-cancel | §11 | 0 |

### 14.1 Completion gate

| Gate | Result |
|---|---|
| module test-cut table | 7/7 plus dependency/Rustdoc gates |
| critical protocol positive + abnormal cuts | 83/83 |
| state legal + illegal/reserved cuts | 24/24; global 239/98/301 registry required |
| consistency/idempotency/concurrency cuts | 22 named cuts |
| configuration/binding cuts | 12 named cuts |
| observability/redaction cuts | 12 named cuts |
| full test plan/evidence fabricated | no |
| new Rust declaration/struct/field/comment | `0/0/0/0`; no structure-comment omission introduced |
| historical material reintroduced | 0 |
| unresolved upstream blocker | 0 |

## 15. Step 17 entry gate

Step 17 must consume this file as a handoff inventory, not turn every cut into a claimed implementation task or passed gate. It must identify implementation units/files, generated/static registries, fake seams, backend controlled reopen, and formal 05/06/07 ownership while keeping implementation ledger and planned boundary skeleton creation deferred until formal 07 completion.

```text
document = 03-详细设计.md
step = 16
status = 03_step_16_completed_continuous_execution
next_allowed_action = enter_03_step_17_implementation_handoff
test_execution_claimed = false
run_id_or_evidence_created = false
unresolved_upstream_blocker = none
commit_required = no
```
