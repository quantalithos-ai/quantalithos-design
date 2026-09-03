# L2-member-images 05 测试方案 Step 6：测试场景与用例设计

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填位置：正式 `05-测试方案.md` 第 6 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 将 Step 5 追溯项展开为稳定编号的正向、负向、边界、非法迁移、幂等、并发、恢复和边界用例。 |
| 本步输入 | Step 1~5；03 Step 6~16 的对象/协议/状态/错误/测试切口；04 的配置失败矩阵。 |
| 本步输出 | 协议族用例矩阵、跨切口用例模板、当前 blocker 的执行上限。 |
| gate_status | `pass_with_explicit_blockers`；所有 TC 仅为规划，不代表已执行。 |

## 1. 统一用例规则

- 每个 TC 必须引用正式对象、字段、状态和 `ImageProtocolErrorKind`/`DomainError`；不使用旧口语状态。
- Command/Job 的 accepted/commit/replay 用例标为 `future-reopen`；当前可执行切口在 validation/context 后断言 zero-effect/no-write。
- Query 用例必须断言没有 UoW、idempotency reserve、save、gap creation、refresh、rebuild 或外部 adapter call。
- 两条 inbound 用例固定断言 `accepted_input=false`；outbound 只做零库存审计。

## 2. Command 用例矩阵（10）

| 用例 ID | Command / 场景 | 前置与输入 | 预期/断言 | 自动化 |
|---|---|---|---|---|
| `TC-CMD-001` | `DefineImageVariant` 合法 typed ref | actor、metadata、mapping ref 形状合法 | 当前 B01 前停在 context；不得 begin UoW/写 definition；future reopen 才断言 `Draft` | 是 |
| `TC-CMD-002` | `CaptureAssemblyBaseline` 缺 component/seed ref | required static ref 缺失 | `Missing`/`Blocked`，不填默认值、不写 baseline | 是 |
| `TC-CMD-003` | `ProposeVariantRevision` 从 `Superseded`/`Blocked` 原地复活 | 正式 lifecycle 与 replacement ref | `InvalidTransition`，对象不变；必须 future 新 context | 是 |
| `TC-CMD-004` | `RequestBuildIntent` stale/incompatible baseline | version 或 pin 不匹配 | `Blocked`/`Conflict`，不产生 candidate、digest 或 build success | 是 |
| `TC-CMD-005` | `RecordBuildOutcome` 含 provider body/裸 digest | outcome source 越过 body-free boundary | `ContractViolation`/`Blocked`；body 不入 truth、trace、log 或 result | 是 |
| `TC-CMD-006` | `EvaluateCandidateEligibility` gate evidence 不完整 | candidate ref 存在但 owner policy/evidence pending | 保守 `Unknown`/`Blocked`；不返回 `Passed`/`Eligible` | 是 |
| `TC-CMD-007` | `RecordArtifactHandoff` owner ref 不可验证 | Artifact handoff schema pending | local gap/blocked marker 设计；不 mint `ConsumableArtifactReference` | 是 |
| `TC-CMD-008` | `PublishInstantiableEntry` 未满足 pinned entry | candidate/eligibility/consumer 条件缺任一 | `Blocked`；不产 consumer confirmation、launch 或 readiness | 是 |
| `TC-CMD-009` | `TransitionAvailability` 非法 state edge | 以正式 SupplyEntry matrix 构造非法边 | `InvalidTransition`；append-only history 不增加伪成功 transition | 是 |
| `TC-CMD-010` | `RollbackOrRetireEntry` duplicate/conflict | 相同/不同 canonical input 的同 key | future reopen：stored replay 或 `Conflict`；当前 B01 stop，不保存 result | 是 |

通用 command 负向模板：缺 metadata/actor、unknown enum、非法 typed ref、重复 key、version mismatch、UoW failure、commit unknown、adapter unavailable 均不得 silent fallback；任何 local mutation 失败必须回滚或停在已定义的 safe disposition。

## 3. Query 用例矩阵（10）

| 用例 ID | Query / 场景 | 读取路径 | 预期/断言 |
|---|---|---|---|
| `TC-QUERY-001` | `GetImageVariantDefinition` hit/missing | exact local truth/view | 返回 body-free view 或 `Missing`；无写 |
| `TC-QUERY-002` | `GetAssemblyDerivation` stale projection | existing projection marker | 返回 `Stale`/`Unavailable`；不触发 rebuild |
| `TC-QUERY-003` | `GetBuildTrace` partial history | direct history | 返回既有安全字段与 gap；不补 attempt/candidate |
| `TC-QUERY-004` | `GetProvenanceAndEligibility` owner unavailable | local qualification refs | `Unknown`/`Gap`；不把 source ACK 当 gate conclusion |
| `TC-QUERY-005` | `ResolveInstantiableEntry` consumer contract pending | local entry + consumer gap | `ConsumerHandoffGap`/`Unavailable`；不返回可实例化 readiness |
| `TC-QUERY-006` | `ListAvailableVariants` empty/page boundary | explicit `ImageRepositoryPageRequest` | empty page 合法；不全表扫描、不创建状态 |
| `TC-QUERY-007` | `GetAvailabilityHistory` append-only page | history store | 顺序/after/limit 正确；不改写历史 |
| `TC-QUERY-008` | `GetImageTrace` forbidden body fixture | trace view | raw body/secret 被省略或拒绝；无 trace append |
| `TC-QUERY-009` | `GetContractGaps` explicit scope | gap store | 只读既有 gap；未知 scope -> `Unavailable`，不创建 gap |
| `TC-QUERY-010` | `GetProjectionFreshness` `RequireFresh`/`InspectMarker` | existing freshness marker | 无 companion/marker -> `Unavailable`；不得 direct-read 升级 `Fresh` |

## 4. Inbound、Job 与 outbound 用例

| 用例 ID | 边界 | 操作 | 预期 |
|---|---|---|---|
| `TC-IN-001` | `ConsumeVerifiedBuildRequest` | unavailable/unknown marker | `InboundContractMarker`，`accepted_input=false`；无 parse/UoW/dedup/receipt |
| `TC-IN-002` | `ConsumeVerifiedSourceRefresh` | unsupported/reopen marker | `Rejected`/`ReopenRequired`；不写 snapshot/gap/trace |
| `TC-JOB-001` | `RunNightlyBuildSweep` | explicit page + B01 stop | no scheduler/cursor/full scan；返回 bounded disposition |
| `TC-JOB-002` | `ReconcileBuildAttempts` | attempt page + unknown outcome | 不从 ACK 生成 candidate；partial/blocked disposition |
| `TC-JOB-003` | `ReevaluatePendingQualifications` | qualification scope | 不 mint gate/evidence；Q-MI-004 时 blocked |
| `TC-JOB-004` | `RefreshExternalReferenceSnapshots` | exact ref scope | provider unavailable -> gap/marker；不把 cache 当 truth |
| `TC-JOB-005` | `RebuildImageDerivedViews` | explicit projection key | `PF-UNAVAILABLE-RECOVERY` 未闭时 blocked；Query 不可代替 recovery |
| `TC-JOB-006` | `ReconcileArtifactAndConsumerHandoffs` | handoff/gap page | 保持 Artifact/consumer 分域；不返回 confirmation |
| `TC-EVENT-001` | outbound inventory audit | inspect contracts/workspace plan | `ImageOutboundEventInventory::NoneAuthorized`；零 event/outbox/publisher |

## 5. 跨切口一致性与安全用例

| 用例 ID | 风险 | 断言 |
|---|---|---|
| `TC-CON-001` | 同 key 同 canonical input | future reopen 读取 stored result，不重算 current truth |
| `TC-CON-002` | 同 key 不同 canonical input | `Conflict`，不覆盖首个 reservation |
| `TC-CON-003` | optimistic version race | 只有正式 version 可判断冲突；cursor 不得当 version |
| `TC-CON-004` | commit unknown | 不宣称 committed；按正式错误/unknown 处置，不盲重试 |
| `TC-CON-005` | local save/projection/result 部分失败 | UoW 顺序和回滚边界可观察；不留下伪成功 |
| `TC-SEC-001` | secret/raw body 进入日志/trace/report | redaction scan 失败并阻断，输出只含 safe ref/reason |
| `TC-SEC-002` | `Available/Fresh/Assembled` 升格 readiness | 跨 subject 负向断言全部拒绝 |

## 6. 状态、配置、观测、依赖、恢复与性能用例

| 用例 ID | 场景 | 前置与输入 | 预期 / 断言 | 自动化 |
|---|---|---|---|---|
| `TC-STATE-001` | `DefinitionLifecycle` 合法与非法边 | `Draft` definition、正式 mapping safe conclusion | 仅正式合法边可由 future factory 产生；`Blocked`/`Superseded` 不得原地 `Resolved` | 是 |
| `TC-STATE-002` | `BaselineCompleteness` 与 static pin | incomplete/missing/mutable static ref | `Complete` 不能由缺失、mutable、live 或外部 body 补齐；对象保持 safe disposition | 是 |
| `TC-STATE-003` | `VariantRevisionLifecycle` replacement | `Proposed` / `Invalid` / `Superseded` revision | `Invalid`/`Superseded` 不得原地 `Buildable`；新语境须关联 replacement | 是 |
| `TC-STATE-004` | `BuildIntentLifecycle` guard | pending/blocked intent fixture | `Blocked`/`Cancelled` 不得 `Accepted`；accepted 不等 builder acceptance | 是 |
| `TC-STATE-005` | snapshot / attempt terminal isolation | incomplete/invalid snapshot；unknown/failed attempt | `Invalid` snapshot 不得 complete；`Unknown`/`Failed` attempt 不得原地 `Succeeded` | 是 |
| `TC-STATE-006` | candidate / provenance / gate isolation | candidate, provenance, gate fixtures | `Formed`、`Complete`、`Passed` 各自独立；缺 authority/evidence 不得 `Passed` | 是 |
| `TC-STATE-007` | eligibility / Artifact handoff layering | pending/blocked qualification fixture | `Eligible` 不等 Artifact `Accepted`；image ref/ACK/fake 不得形成 `Accepted` | 是 |
| `TC-STATE-008` | availability transition history | `Proposed` transition and prior history | 仅正式边；`Committed`/`Rejected` 不得回 `Proposed` 或互换；history append-only | 是 |
| `TC-STATE-009` | instantiable entry terminal isolation | unavailable/available/superseded/retired entry | `Superseded`/`Retired` 不得 `Available`；`Available` 不等 runtime/consumer | 是 |
| `TC-STATE-010` | consumer gap / reference validity | consumer gap and external safe conclusion fixture | `Available` 不关闭 gap；`Stale` 不得直接 `Resolved`；non-Valid 不得原地 Valid | 是 |
| `TC-STATE-011` | projection freshness | stale/rebuilding/fresh/unavailable marker | `Unavailable` 不得转 `Rebuilding`/`Fresh`；`Fresh` 不等 readiness | 是 |
| `TC-STATE-012` | idempotency / inbound state | reserved/conflict marker and inbound marker fixture | Query 不 reserve；inbound 只允许 `Unavailable`/`Rejected`/`ReopenRequired` 且 `accepted_input=false` | 是 |
| `TC-STATE-013` | 跨状态阶段隔离 | `Resolved`/`Complete`/`Buildable`/`Eligible`/`Available`/`Fresh` fixtures | 任一 local state 不得推导 build、Artifact、consumer、runtime 或 readiness | 是 |
| `TC-STATE-014` | 19 matrices coverage index | 所有 19 state matrix 的合法、非法、terminal/replacement rows | 每矩阵至少一合法、一非法和阶段隔离断言；20 subject 范围不合并为 global lifecycle | 是 |
| `TC-STATE-015` | failure / blocked / unknown terminal semantics | negative state fixtures | `Blocked`、`Invalid`、`Conflict`、`Unknown`、`Stale` 不得以 cache/fake/ACK 原地复活 | 是 |
| `TC-STATE-016` | pending owner resolution boundary | `MI-UP-*` / `Q-MI-*` marker fixture | only ref/gap/unknown/marker；无 positive external oracle | 是 |
| `TC-STATE-017` | `Assembled` composition boundary | `ImageRuntimeAssemblyState::{Assembled,Blocked}` fixture | local composition 不启动 process、worker、scheduler 或 container；不解除 DDD/owner blocker | 是 |
| `TC-STATE-018` | no audit on no-audit paths | Command/Job B01/B02、Query、inbound marker、config fixture | no trace/history/audit record on paths prohibited by 03 §14 | 是 |
| `TC-STATE-019` | state naming drift scan | test corpus / planned source identifiers | 不使用 `Ready`、`Published`、`Running`、`Delivered` 等非正式口语状态 | 是 |
| `TC-CONFIG-001` | strict JSON/schema | legal and unknown/duplicate/comment/trailing-comma JSON fixtures | valid P0 shape typed binding；非法 whole-config reject | 是 |
| `TC-CONFIG-002` | source priority conflict | safe absence / project JSON / invalid allowlisted env selector | invalid high-priority value 不回退 JSON/null | 是 |
| `TC-CONFIG-003` | profile and fake isolation | `local-dev` / `ci-test` / fake selector fixture | fake 仅 `ci-test + TestOnly`；production-like / fake 混用 reject | 是 |
| `TC-CONFIG-004` | sensitive selector / no-output | opaque ref, raw secret/body/URL/credential fixture | raw sensitive value rejected or redacted；不输出 raw input | 是 |
| `TC-CONFIG-005` | startup-only activation | builder before/after freeze fixture | reload/LKG/online override reject；restart required；`Assembled` 不等 readiness | 是 |
| `TC-OBS-001` | log/metric/span safe field scan | forbidden sentinel and safe-category fixture | only body-free low-cardinality category fields；无 ID/ref/key/payload/digest/tag/endpoint/secret | 是 |
| `TC-OBS-002` | trace/audit boundary | future trace fixture and current no-audit paths | trace only in legal future UoW; Query/current stop/marker/config 不写 trace；log/span 不替代 audit/evidence | 是 |
| `TC-DEP-001` | dependency category / sibling compile cut | planned workspace dependency metadata | active sibling Cargo dependency remains zero; compile/runtime/event/ref/adapter/fake 不漂移 | 是 |
| `TC-REC-001` | unavailable/recovery fail-closed | `ProjectionFreshnessLifecycle::Unavailable` and `PF-UNAVAILABLE-RECOVERY` fixture | no query repair, no blind retry, no invented `Unavailable -> Rebuilding/Fresh`; report blocked only | 是 |
| `TC-PERF-001` | read-only performance baseline candidate | repeatable read-only workload design | only future measurement plan; no latency, throughput, capacity or pass verdict without approved baseline | 条件 |

## 7. 单切口停审与跨用例审计

| 测试切口 / 用例族 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| Command / Job | 是否将合法输入误写为 current mutation | 通过 | `TC-CMD-*` / `TC-JOB-*` 仅断言 B01/B02 前 zero-effect；future mutation 保留 reopen。 |
| Query | 是否能证明 strict no-write | 通过 | 10 项均禁止 UoW、reserve、save、gap/trace/freshness write、refresh/rebuild 与 adapter call。 |
| Inbound / outbound | marker / zero inventory 是否越界 | 通过 | inbound 固定 `accepted_input=false`；outbound 仅 `TC-EVENT-001`。 |
| State | enum、terminal/replacement 与 readiness 是否混同 | 通过 | `TC-STATE-001~019` 回指 03 §9；不使用 global ready。 |
| Config / redaction | 04 的 profile、source、sensitive、activation 是否有断言 | 通过 | `TC-CONFIG-*`、`TC-SEC-*`、`TC-OBS-*` 均为 planned。 |
| Consistency / recovery | B03 / OPEN / PF 是否被测试自行补设 | 通过 | `TC-CON-*` / `TC-REC-001` 只断言已定义保守语义与 reopen。 |
| 跨用例命名 / evidence | 是否存在旧 TC、错误状态或预造证据 | 已修复 | 不再使用 `TC-DEF/ASM/BLD/QUAL/SUP/NFR/VETO`；EV 由 Step 13 统一。 |

## 8. 结构化产物、回填草稿与待确认事项

正式 §6 回填上述用例族和统一模板。`TC-*` 是规划编号，未来执行必须在固定 run 下生成结果；不得在本文件填写通过。B01/B02、PF、MI-UP、Q-MI 关闭后，必须重开受影响 TC 并复核断言，不得沿用旧正向假设。

进入下一步条件：每个 logical surface 有 TC 入口；关键风险有负向/边界用例；用例有前置、操作、断言、自动化方向和 blocker 标签。
