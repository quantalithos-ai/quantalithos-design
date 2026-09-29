# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 正式回填：`05-测试方案.md` §3
> 日期：2026-09-13
> 状态：`completed / pass_with_blocked_real_seams / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 从正式 02/03/04 抽取所有 P0 对象和稳定测试切口，并做逐切口停审与孤儿契约审计 |
| 输入 | Step 2、03 §4～15、03 Step 16、04 §7/9/11/12 |
| gate_status | `completed / pass_with_blocked_real_seams` |
| gate_reason | 固定分母全部有测试入口；外部/durable positive 明确保留 blocked |
| next_allowed_action | 创建并完成 Step 4 |
| source_files | 正式 02/03/04；03 Step 06～16；Step 1～2 |

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 模块/对象抽取 | §6.1～6.2 | done | 6 crates/26 objects/8 services 无孤儿 |
| 协议/状态抽取 | §6.3～6.4 | done | 30/32、18 states 全覆盖 |
| 横切风险抽取 | §6.5～6.6 | done | UoW/unknown/config/source/evidence 可定位 |
| 逐 CUT 停审 | §6.7 | done | 来源、风险、层级、blocked lane 明确 |
| 跨切口审计 | §6.8 | done | 无孤儿/重复/命名/phase 冲突 |
| 复杂度/回填/影响 | §7～10 | done | Step 6 再拆具体用例，不提前编号 |

## 2. 本步输入

| 输入 | 抽取内容 |
|---|---|
| 正式 03 §4～6 | 6 crates、26 正式对象、8 services、7 port families、文件与测试路径 |
| 正式 03 §7～9 | 3C/5Q/5E/17J、30 logical/32 method surfaces、18 状态 |
| 正式 03 §10～14 | UoW/CAS/read-set、错误/恢复、幂等/重入、config binding、observability |
| 03 Step 16 | 已核验的最小测试切口和 positive 证明上限 |
| 正式 04 §7/9/11/12 | 55 keys、strict load、runtime assembly、failure/config test cuts |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 domain/value/policy 必须单测？ | contracts 的 `DeclaredArchiveScope`、`GovernanceDecisionRef` 与 24 个 domain 对象全部；shared DTO/ref/enum 另做 contract/property。每个对象至少 factory/rehydrate/invariant/失败不改 self，18 状态对象另测合法/非法迁移。 |
| 哪些 services 必须 service test？ | 8 个：`ArchiveRequestService`、`SourceCaptureService`、`BundleAssemblyService`、`BundleVerificationService`、`PlacementService`、`LifecycleExecutionService`、`RestoreService`、`ArchiveQueryService`；覆盖 30 flow、UoW、完整 replay 与 no-write。 |
| 哪些 repo/adapter/worker 集成测试？ | local store/UoW/result/claim/cursor、6 external business seams、runtime builder、API handler、5 consumer 与 17 job runner；fake/durable 必须等价，真实 seam 未闭合时 blocked。 |
| 哪些协议必须测？ | 3 Command、5 Query、5 Consumer、17 Job 全部；E04/J12 各两个互斥 method surface；3 outbound candidate 只测不存在 ready publish surface。 |
| 哪些状态/事务/恢复单列？ | 18 状态主语、CAS/unique/read-set/range/negative/fence、intent-before-effect、local probe、external exact reconcile、partial resume、same/same、same/different、result missing、current disclosure。 |
| 哪些字段/ref 混同必须负向？ | envelope/payload 重复、wrong typed ref、workspace canonical elevation、Artifact/ref/body 混同、ACK/commit 混同、operation digest/Bundle digest 混同、public/private cursor、owner/receiver/target mismatch、raw body/secret leakage。 |
| 状态名以何为准？ | 唯一以 03 Step 10 的 18 个状态 enum 与边集合为准；classification、DTO disposition、runtime assembly 和 owner state 不伪装成统一状态机。 |
| P0 是否有孤儿？ | 无。见 §6.8；具体 field/variant 和可执行步骤留 Step 6。 |

## 4. 当前材料问题诊断与前后对比

| 诊断 | 风险 | 处理 |
|---|---|---|
| 旧 05 对象全部不是当前正式分母 | 用例无法回指落码契约 | 废弃，按 26 对象/30 入口重新抽取 |
| 03 Step 16 已含 TC-AR-* 切口 ID | 若直接视作正式用例会缺步骤/数据/证据 | 本 Step 只承接为风险切口；Step 5/6 统一注册正式 TC |
| 配置 55 key 尚无逐 key 测试对象 | 可能遗漏非法 winner/cross-field | 独立 `CUT-AR-CONFIG`，Step 8 建全量矩阵 |
| external positive 依赖多 | E2E 容易用万能 fake 冒充 | 每个相关 CUT 设 local negative 与 formal blocked lane |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 对象 | 旧 snapshot/index/retention/review | 6 crates、26 objects、8 services、7 ports |
| 协议 | 14 个旧操作 | 30 logical/32 surfaces 全枚举 |
| 状态 | 少量口语成功/失败 | 18 正式状态主语 + classification 分离 |
| 横切 | digest/hold/query 零散 | 18 个稳定 CUT 覆盖 authority/UoW/replay/effect/config/report |

## 5. 测试设计取舍

| 议题 | 结论 | 理由 |
|---|---|---|
| 每个对象是否独立 CUT | 按对象清单全覆盖，但按 module/object family 形成一个 CUT | 控制矩阵规模，Step 6 再按风险拆断言 |
| 每个协议是否独立 CUT | 保留协议 family CUT，并逐入口盘点 | 既保证分母，又避免 30 个同义 CUT |
| 状态是否按 18 个独立 CUT | 一个 STATE CUT，内部 18 行逐项停审 | 状态唯一来源相同 |
| config 是否并入 infra | 独立 CONFIG CUT | 55 key、source/profile/fake 边界足够复杂 |
| evidence 是否只放 Step 13 | 设 REPORT CUT，schema/路径细化留 Step 13 | 防止证据真实性成为事后补丁 |

## 6. 结构化中间产物

### 6.1 模块与测试发现路径（planned）

| 模块 | 计划测试文件 | 测试对象 | 首要 CUT |
|---|---|---|---|
| contracts | `crates/contracts/tests/protocol_boundaries.rs` | 2 objects、public DTO/ref/enum/view/result | CONTRACT/AUTHORITY |
| domain | `crates/domain/tests/domain_invariants.rs`、`state_axis_boundaries.rs` | 24 objects、18 states | OBJECT/STATE |
| application | `crates/application/tests/admission_consistency.rs`、`query_no_write.rs`、`operation_boundaries.rs` | 8 services、UoW、30 flows | COMMAND/QUERY/CONSUMER/JOB/UOW |
| infra | `crates/infra/tests/adapter_contracts.rs`、`wiring_fail_closed.rs` | 7 ports、store、builder/config | PORT/CONFIG/DEPENDENCY |
| api | `crates/api/tests/handler_boundaries.rs` | 3C+5Q handler | COMMAND/QUERY/SECURITY |
| worker | `crates/worker/tests/consumer_boundaries.rs`、`operation_recovery.rs` | 5E+17J、claim/fence/checkpoint | CONSUMER/JOB/EFFECT |

路径均为 planned，不证明实现仓或文件存在。

### 6.2 26 正式对象覆盖索引

| CP | 对象 | 主要断言 |
|---|---|---|
| CP1 | `DeclaredArchiveScope`、`ArchiveRequest`、`ArchiveJob`、`ArchiveJobStageRecord` | checked scope、admission、aggregate/stage、append history、原子创建 |
| CP2 | `ArchiveSourceBinding`、`CaptureAttempt`、`CaptureCoverage`、`SourceCaptureFinding` | source/owner/fence/version/coverage、late/conflict、history保真 |
| CP3 | `ArchiveBundle`、`BundleManifest`、`ManifestEntry`、`ManifestClosure`、`ClosureFinding` | immutable revision、exact set、closure、seal basis、不完整不 seal |
| CP4 | `VerificationAssessment`、`CompatibilityAssessment`、`VerificationFinding` | fixed input/target、immutable result、Unknown/Unsupported/IntegrityFailed |
| CP5 | `ArchivePlacement`、`GovernanceDecisionRef`、`LifecycleExecution`、`ExternalActionRecord` | decision/execution 分离、ACK/commit/unknown、intent/effect history |
| CP6 | `RestoreRequest`、`RestorePlan`、`RestoreItem`、`RestoreHandoff`、`HandoffOutcome`、`CompensationRecord` | frozen owner/item set、owner isolation、mapping、unknown/compensation、无上游写 |

### 6.3 Protocol 盘点

| 族 | 分母 | 主要验证 | 切口 |
|---|---:|---|---|
| Command | 3 | admission/result/UoW/duplicate/conflict/unknown；Accepted 不越级 | COMMAND |
| Query | 5 | current visibility、safe page、partial/stale/unknown、所有 write/effect spy=0 | QUERY |
| Consumer | 5 | envelope/schema/dedup/late/receipt/ACK boundary | CONSUMER |
| Job | 17 | fixed target、claim/fence/checkpoint、intent/effect/reconcile/partial report | JOB/EFFECT |
| routed methods | +2 method surfaces | E04/J12 placement/lifecycle 互斥路由 | CONSUMER/JOB |
| Outbound candidate | 3 blocked | 无 outbox/publisher/topic/delivery path | OUTBOUND-ABSENCE |

### 6.4 18 状态主语索引

| 族 | 状态主语 | 主要负向 |
|---|---|---|
| admission/job | `RequestAdmissionState`、`JobAggregatePosture`、`ArchiveJobStage` | 终态复活、跨 kind/跳 stage、局部→全局成功 |
| source/bundle/assessment | `SourceBindingState`、`CaptureAttemptState`、`ArchiveBundleState`、`VerificationPosture` | Auxiliary 绑定、timeout→Failed、旧 basis seal、fake→Verified |
| external effect | `PlacementState`、`RetrievalState`、`LifecycleExecutionState`、`ExternalActionPosture` | ACK=commit、Committed=Retrievable、hold 绕过、unknown→failure |
| restore | `RestorePlanState`、`RestoreItemState`、`RestoreHandoffState`、`CompensationState` | set drift、跨 owner、ACK=success、compensation 抹历史 |
| technical | `ArchiveIdempotencyState`、`WorkerEntryState`、`WorkerClaimState` | 异 digest 改旧记录、entry=business complete、stale fence commit |

### 6.5 稳定 P0 测试切口

| CUT | 对象 / 来源 | 风险与最早发现层 | formal positive 姿态 |
|---|---|---|---|
| `CUT-AR-CONTRACT` | typed refs/DTO/envelope/view/result；03 §5/7 | wrong-kind、缺字段、roundtrip、body 泄漏；contract | local planned |
| `CUT-AR-OBJECT` | 26 objects；03 §5/6 | invariant/rehydrate/failure self mutation；domain | local planned |
| `CUT-AR-STATE` | 18 states；03 §9 | 非法迁移、多轴传播；domain/service | local planned |
| `CUT-AR-COMMAND` | C01～C03；03 §7/8 | UoW/admission/replay/unknown；service/API | external prerequisites blocked |
| `CUT-AR-QUERY` | Q01～Q05；03 §7/8 | disclosure/cursor/no-write；service/API | continuation positive blocked |
| `CUT-AR-CONSUMER` | E01～E05；03 §7/8 | schema/dedup/late/ACK；worker | formal event seam blocked |
| `CUT-AR-JOB` | J01～J17；03 §7/8 | claim/phase/report/partial；service/worker | affected external jobs blocked |
| `CUT-AR-UOW` | store/UoW；03 §10 | atomicity/CAS/read-set/range/negative/probe；integration | durable blocked |
| `CUT-AR-IDEMPOTENCY` | operation record/result；03 §10～12 | complete replay/digest conflict/result missing | durable codec/store blocked |
| `CUT-AR-EFFECT` | source/storage/receiver effect；03 §8/10～12 | intent-first/dispatch knowledge/exact reconcile | real adapters blocked |
| `CUT-AR-AUTHORITY` | 8 source classes；00 §11/03 §7 | owner/material classification、Auxiliary、不反写 | owner positive blocked |
| `CUT-AR-RESTORE` | CP6/J13～17/E05 | per-owner material/handoff/outcome/compensation | receiver positive blocked |
| `CUT-AR-CONFIG` | 12 domains/55 keys；04 §3～11 | source priority/cross-field/slot/fake/fail-closed | real binding blocked |
| `CUT-AR-SECURITY` | redaction/safe view；03 §11/14、04 §8 | raw body/secret/ref/key leakage、hidden metadata | safe local planned |
| `CUT-AR-OBSERVE` | telemetry/native records；03 §14 | sink non-interference、low cardinality、no self-loop | backend/handoff blocked |
| `CUT-AR-DEPENDENCY` | compile/runtime/event/ref/adapter/fake；01/03/04 | sibling/SDK/provider compile 污染 | static planned；Core exact pending |
| `CUT-AR-RESOURCE` | 04 budgets / NFR | L/L+1、bounded/continuation、no silent Complete | numeric baseline pending |
| `CUT-AR-REPORT` | 05 evidence contract / truth standard | static EV、missing raw、cross-run、redaction failure | planned；0 evidence now |

### 6.6 必测负向闭环

| 风险 | CUT | 必须断言 |
|---|---|---|
| workspace/ref/observability 补 canonical | AUTHORITY/CONTRACT | rejection/Partial/Blocked，manifest 不变 Complete |
| same key/different input | IDEMPOTENCY | Conflict；原 reservation/result 不变 |
| completed result missing | IDEMPOTENCY/UOW | ResultMissing/ConsistencyDefect；零重跑/effect |
| local commit unknown | UOW | 只 `probe_commit` + exact read；absence 不等 Aborted |
| external may dispatched | EFFECT | CommitUnknown；只 exact J04/J12/J16/probe |
| cursor/principal/snapshot mismatch | QUERY/SECURITY | Stale/NotAvailable；不混页、不写 |
| required slot missing/mismatch/degraded/disabled | CONFIG | facade 不暴露；production 不 fake fallback |
| owner/receiver/material mismatch | RESTORE | 零 intent/dispatch；新 plan revision |
| outbound 偷渡 | OUTBOUND-ABSENCE/DEPENDENCY | 无 outbox store、publisher、topic、delivery evidence |
| telemetry/redaction failure | OBSERVE/SECURITY | 不改变业务 result；敏感值零输出 |

### 6.7 P0 CUT 停审记录

| CUT 组 | 来源/风险/层级审查 | 结论 | 后续要求 |
|---|---|---|---|
| CONTRACT/OBJECT/STATE | exact source、局部早发现 | pass | Step 6 展开字段/状态族用例 |
| COMMAND/QUERY/CONSUMER/JOB | 30/32 分母完整 | pass_with_blocked_positive | 逐入口至少主线+关键负向 |
| UOW/IDEMPOTENCY/EFFECT | 事务与未知不被 E2E 推迟 | pass_with_durable_blocker | fake+durable parity 分离 |
| AUTHORITY/RESTORE | owner/source 边界明确 | pass_with_owner_blockers | 每类 source/owner 有 negative；positive 不伪造 |
| CONFIG/SECURITY/OBSERVE | 55-key、安全、信号边界明确 | pass | Step 8～10/13 继续展开 |
| DEPENDENCY/RESOURCE/REPORT | static/baseline/evidence 边界明确 | pass_with_pending | 不造 package graph、数字或 EV |

### 6.8 跨切口设计来源审计

| 审计项 | 结论 |
|---|---|
| 6 crates / 26 objects / 8 services | 全部有 owner 和至少一个 CUT |
| 7 port families | local store 在 UOW；六 external seams 在 EFFECT/AUTHORITY/RESTORE |
| 30 logical / 32 surfaces | 3C/5Q/5E/17J 与两 routed surfaces 全覆盖 |
| 18 state subjects | 四状态族逐项覆盖；无 GlobalState |
| 8 source classes | AUTHORITY 覆盖；workspace 固定 Auxiliary |
| 3 outbound candidates | 仅 absence/blocked，未误列 positive |
| duplicate/partial/stale/missing/conflict/unsupported/integrity/unknown | 均有独立或跨 CUT 负向入口 |
| 孤儿 P0 设计契约 | 未发现 |
| 重复 CUT / phase 越界 | 未发现；classification/result 与 state 分离，future provider/AC 未提前 |

## 7. 复杂度判断

本 Step 复杂度高，采用模块、对象、协议、状态、横切风险五批内部审计，但无需创建附属文件。正式 §3 将保留 18 个 CUT 和固定分母；逐 TC、数据、suite、EV 留 Step 5～13，避免一次大表混合职责。

## 8. 回填草稿

正式 §3 应给出 planned 测试发现路径、26 对象索引、30/32 协议盘点、18 状态组、18 个 P0 CUT、必测负向和证明上限。明确路径未创建、positive external/durable lane blocked，且 03 Step 16 的旧切口 ID 只是输入，不代表正式 05 用例或执行事实。

## 9. 对上游影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；所有对象与切口均有正式来源 |
| 新 blocker | 无 |
| 待确认 | 既有 12 upstream + 6 local pending；具体 TC/EV 编号在 Step 5～6 收敛 |

## 10. 进入下一步条件

- [x] P0 对象、协议、状态、事务、错误、并发、恢复、配置和观测均有 CUT。
- [x] 每个 CUT 有具体真相源、风险和推荐最早层。
- [x] 逐 CUT 停审和跨切口审计无 unresolved 冲突。
- [x] external positive/fake 证明上限明确。
- [x] 未提前创建 TC/EV、脚本、数据或执行结果。
- [x] 允许进入 Step 4。
