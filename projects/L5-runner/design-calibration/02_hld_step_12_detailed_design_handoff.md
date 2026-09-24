# Step 12. 详细设计承接清单

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 12 / 详细设计承接清单 |
| 状态 | `completed` |
| 当前模块 | `detailed_design_handoff:self_reviewed` |
| gate_status | `pass` |
| gate_reason | Step 4～11 已收稳的代码主体、六部分、17 对象、接口/port、处理流、状态、异常、配置和测试/证据切口均映射到 03 展开项；回退规则与 blocker 限制明确。 |
| next_allowed_action | `read_and_start_step_13` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复台账、02 flow、Step 11，读取概要 SOP Step 12 与书写规范 §4.12。
- [x] 逐项提取 Step 4～11 已收稳主语，不新增对象、接口、流程或状态。
- [x] 映射 03 需要继续展开的模块/文件布局、类型、函数、事务、adapter、页面、配置和测试切口。
- [x] 标注 owner 合同未闭合时只允许 planned/blocked skeleton 的承接项。
- [x] 建立详细设计发现冲突时的概要回退矩阵。
- [x] 完成完整性审计并同步 flow / 项目台账。

## 2. 承接原则

1. 本清单只交付 Step 4～11 已收稳的稳定输入；它不是 03 的任务排期、实现计划或测试用例全集。
2. 03 可以决定具体语言/runtime/仓库布局、module/file/type/function/transaction/error/test 契约，但必须先重新核验真实仓库、标准和上游公开 surface，不能从 README/旧 03 自动继承。
3. `RUN-UP-001~008` 相关正向 adapter/consumer 只能设计 required contract、blocked/not-ready path 和 planned boundary；不得写成 available/implemented。
4. 如果 03 需要新增、删除、合并或改名会改变语义的主要组成部分、关键对象、正式 Command/Query/Consumer/Job/port、处理流或状态轴，必须先回退 02 对应 Step 修正。
5. 03 必须把可测试性作为契约切口展开，但不能生成测试结果、run_id、evidence、verdict 或 readiness。

## 3. 详细设计承接清单总表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 六个业务组成部分：context/selection、material、run lifecycle、resource/recovery、diagnosis/handoff、entry/presentation | 映射到真实实现单元、module/file/package 边界与依赖方向；保持业务轴与 Inbound/Application/Domain/Ports/Persistence/Projection/Operations 实现轴分离。 |
| 共同入口 `RunnerEntryFacade` 与页面/CLI/product adapter 不旁路 | 定义各入口 handler/presenter/DTO mapping、ActorContext 注入、Command/Query dispatch 与一致错误呈现；不得直连 owner client/store。 |
| 17 个关键对象及其唯一 ownership | 定义语言级类型、字段全集、构造/方法签名、不变量、serialization/persistence mapping、versioning 与 unit-test seams；不得合并为万能 `RunnerRun`。 |
| Safe refs/bindings/metadata 是跨对象 shared vocabulary | 收稳 `SelectionBinding`、`MaterialSourceBinding`、`QualifiedMaterialBinding`、ExpectedBasis、Actor/Command/Correlation/Idempotency、source/freshness/visibility typed contracts；避免 shadow owner DTO。 |
| 11 个 Command 与 metadata/idempotency 边界 | 定义 command DTO、handler/service 函数、validation order、local transaction、idempotency collision、typed result/error 与 authorization/context boundary。 |
| 12 个 Query 与 no-write 边界 | 定义 query DTO、repository/projection read、snapshot consistency、pagination/cropping/fallback/not-ready、visibility filtering 和 presenter mapping；证明无 refresh/repair/write。 |
| 4 个 planned inbound Consumers（当前 blocked） | 仅在正式 event contract 已核验时定义 envelope mapping、dedup/order/gap/cursor transaction 与 consumer adapter；否则只保留 planned/blocked skeleton 和 query/reconcile fallback。 |
| 当前无 Runner outbound event family | 不创建 publisher/topic/outbox；若发现正式消费者需求，回退 00/01 与 02 Step 7～9。Local operation journal 不得命名/解释为 global outbox。 |
| 5 个 Operations Jobs | 定义 claim/lease、scheduling trigger、checkpoint/cancellation、basis recheck、crash recovery、bounded concurrency、job result 与 manual execution seam；job success 不映射 owner success。 |
| 14 个 required ports | 定义 trait/interface、typed request/response/error/capability/readiness、adapter boundary、test double contract 与 composition injection；owner surface 未闭合保持 blocked。 |
| 通用 Command 双事务骨架 | 定义 transaction coordinator/repository UoW、local intent/operation record、external call crash windows、receipt apply 和 outcome-probe/reconcile；网络/长任务不得包在本地事务。 |
| 通用 Query no-write、Consumer readiness、Job basis recheck | 定义 read service、projection repository、contract readiness gate、dedup storage、job claim 与 expected-version 机制；提供架构测试/negative tests 验证边界。 |
| selection/authority 处理流 | 展开 exact version validation、context/authority adapter mapping、generation concurrency、selection invalidation fan-out 与 refresh semantics。 |
| acquire/verify/cache 处理流 | 展开 locator abstraction、download/checkpoint/cancel、quarantine/promotion、verification provider、file/store atomicity、safe release 与 crash recovery；不锁 owner 未提供算法。 |
| run/control 处理流 | 展开 run/control request DTO、expected owner basis、idempotency/correlation、receipt/result mapping、unknown recovery 与 projection update；不得调用 Sandbox 私有 backend。 |
| resource/cleanup/reconcile 处理流 | 展开 platform probes、safe resource keys、ProtectionInputs、cleanup operation、RecoveryCase query fan-in、partial result、manual-review contract 与 release sequencing。 |
| preview/diagnosis/handoff 处理流 | 展开 safe source DTO、redaction boundary、bounded preview builder、failure signal precedence、handoff material/receipt mapping 和 retention interaction；不保存 raw body。 |
| read-model/refresh 处理流 | 展开 section query orchestration、parallel/snapshot reads、refresh generation、per-source partial/freshness、presenter/page mapping 与 no-write enforcement。 |
| 多轴状态集合与允许/禁止迁移 | 为各 Runner-owned object 定义 language enum/value、transition guard/table 与 persistence version；owner projection enum 仅做 adapter mapping，不能本地控制。 |
| Selection generation 是 immutable successor | 定义 monotonic generation allocation、expected-version concurrency、old-generation invalidation lookup 与 race tests。 |
| transfer/integrity/cache/protection 四轴 | 定义跨对象 transaction 与 promotion/release guard；证明 complete 不推 verified、qualified 不推 releasable。 |
| RunIntent/ControlIntent/OwnerRunProjection 多轴 | 定义状态 transition functions、receipt/result application、source-order checks 与 stale handling；证明 accepted 不推 running，stop confirmed 不推 cleaned。 |
| ProtectionGuard/RecoveryCase 状态机 | 定义 inputs completeness、unknown default、freeze scope、query-only reconcile、resolution basis 与 manual-review authorization；禁止 automatic replay。 |
| Handoff/preview/diagnosis/evidence 边界 | 定义 handoff state transitions、safe material schema、receipt application、diagnostic view；类型/命名中明确 non-evidence。 |
| ConnectivityView 与 RunnerReadModel 仅为投影 | 定义 observation adapters、section composition、degraded/not-ready mapping；online 不改 domain 状态，read model 不持久化为第二 truth。 |
| 跨轴失效与传播关系 | 定义 application-level invalidation coordinator、projection refresh triggers、affected-subject indexing 和 transaction boundaries；不得反写 owner truth。 |
| Step 10 关键异常及两类 crash window | 定义 typed error taxonomy、adapter mapping、malformed schema、storage failure、clock jump、concurrency conflict、crash injection 与 recovery decision table。 |
| fail-closed、no replay、double-view、redaction fallback 禁止 | 形成 negative contract tests/property tests/failure-injection seams，证明不发生隐式版本、状态升级、保护绕过或 raw fallback。 |
| 配置只影响装配/provider/budget/job/presentation | 定义 `RuntimeConfig` 分组、loader/validator、adapter/store/job config、secret-ref resolver、runtime builder injection、config provenance 与 typed failure。 |
| Domain、ownership、state/security/transaction 不可配置化 | 用类型边界、validator negative cases 和 architecture tests 防止 domain 读原始配置、unsafe feature flags 或 private adapters。 |
| SDK-first 和依赖方向 | 核验真实 L0-core/L0-sdk package/version/surface；只允许正式编译依赖，运行期 owner 不成为 sibling source/path dependency。 |
| 逻辑页面/CLI/product experience | 定义选择/材料/运行/资源恢复/诊断等逻辑页面或 view sections、command availability、progress/freshness/source/restricted/unknown 呈现及跨平台 capability degradation；不以 UI state 代替 domain state。 |
| 本地 persistence 只保存 local truth/safe refs/projections | 选择 store 技术后定义 schema/migration/index/optimistic concurrency/retention/corruption handling；禁止 owner body、secret、raw logs、evidence body。 |
| Telemetry 与正式 evidence 分离 | 定义 redacted local telemetry fields/sink boundary、correlation 和 failure behavior；不创建 audit/evidence/report/verdict/signoff 类型或结果。 |

## 4. 按主要组成部分的 03 承接矩阵

| 组成部分 | 固定输入 | 03 必须展开的实现单元 | 接口 / adapter | 页面 / view | 状态 / 流程 | 核心测试切口 |
|---|---|---|---|---|---|---|
| Context and explicit selection | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection` | entry facade、context resolver、selection service/repository、authority projection | context + release authority adapters；selection commands/queries | context/release chooser/selection posture sections | selected/checking/current/stale/invalidated/blocked；换选传播 | reject latest；authority missing/revoke/scope conflict；generation race；query no-write |
| Material acquisition and qualification | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` | acquisition/qualification services、worker、cache/store、verifier orchestration | material source/verifier/cache ports；acquisition commands/queries/jobs | material progress、verification、cache/protection sections | transfer/quarantine/integrity/qualified/protection 分轴 | transfer complete 非 verified；digest mismatch；resume recheck；protected eviction blocked；crash-safe promotion/release |
| Run intent and lifecycle | `RunIntent`、`ControlIntent`、`OwnerRunProjection` | lifecycle/control services、intent repos、projection updater | Sandbox run + Runtime status adapters；run/control commands/query/consumers | request/execution/control/result source-attributed section | draft/submitting/accepted/rejected/unknown；owner execution projection | ACK non-running；unknown no-replay；idempotency conflict；owner state gap；stop non-cleanup |
| Resource, cleanup and recovery protection | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | probe service、guard evaluator、cleanup coordinator、reconcile/manual-review service/job | platform + Sandbox cleanup/read + clock/connectivity ports | conflict/cleanup/protection/recovery/connectivity sections | protected/releasable/unknown；frozen/querying/reconciled/conflict/manual-review | probe vs lease conflict；all protection inputs；disconnect/restart; partial reconcile；storage/clock failure |
| Preview, diagnosis and handoff | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | preview/diagnosis builders、redaction coordinator、handoff service/repos/jobs | diagnostic/redaction/Observability/Archive ports；query/handoff/consumer | bounded preview、diagnosis、handoff posture | draft/pending/accepted/delivered/blocked/failed/unknown | raw body never persists；redaction failure blocks；receipt non-evidence；unknown no-resend |
| Entry and presentation composition | `RunnerReadModel`、`ConnectivityView` | read-model composer、presenters、GUI/CLI/product adapters、refresh job | all Command/Query facade + connectivity observation | logical pages/sections and cross-platform degraded UX | online/degraded/offline/reconnecting/reconciling/manual_review projection only | partial section composition；render no-write；entry parity；refresh generation race |

## 5. Required port 与 blocker 承接矩阵

| Required port | 03 可立即展开 | 03 禁止声称 | Blocker |
|---|---|---|---|
| `ContextReadPort` | Runner-side trait、safe result/error/readiness、blocked adapter | exact SDK method ready | `RUN-UP-008` + owner conditions |
| `ReleaseAuthorityReadPort` | required semantic types、not-ready/blocked paths、adapter boundary | Release/Governance exact DTO/authority chain available | `RUN-UP-001/002/008` |
| `MaterialSourcePort` | locator/manifest abstraction、safe secret-ref boundary、blocked adapter | transport/locator schema implemented | `RUN-UP-001/008` |
| `IntegrityVerifierPort` | verifier request/result semantics、policy-required failure | local algorithm/policy is authoritative | `RUN-UP-001/002/008` |
| `MaterialCachePort` | local abstraction、quarantine/promote/release transaction contract | actual provider/repository exists unless real repo confirms | local tech decision |
| `SandboxRunPort` | Runner-facing required DTO/state semantics、unknown/error contract | request/control/lease/cleanup/reconcile integration ready | `RUN-UP-003/007/008` |
| `RuntimeStatusReadPort` | safe status/result required view、unavailable path | Runtime exact surface exists | `RUN-UP-004/008` |
| `PlatformResourcePort` | capability/probe abstraction与 unsupported/unknown | cross-platform coverage or allocation authority | `RUN-UP-007` + tech decision |
| `DiagnosticReadPort` | bounded safe DTO contract、restricted/partial path | raw log access or diagnostic integration ready | `RUN-UP-005/008` |
| `ObservabilityHandoffPort` | safe handoff/receipt semantics、blocked adapter | evidence/report pipeline ready | `RUN-UP-005/008` |
| `ArchiveReferencePort` | optional safe ref abstraction、unavailable fallback | restore/archive core capability ready | `RUN-UP-006/008` |
| `RunnerStateStorePort` | repository/UoW/expected-version/transaction contract | store implementation exists before repo/tech confirmation | local tech decision |
| `ClockConnectivityPort` | monotonic/freshness/connectivity/suspend abstraction | all platforms behave identically | local tech decision |
| `RedactionPort` | mandatory redaction result/error contract、deny-on-failure | optional bypass or full policy availability | `RUN-UP-005/008` + policy source |

## 6. Command / Query / Consumer / Job 详细化要求

| 接口类别 | 03 必须收口 | 必须保持的边界 |
|---|---|---|
| Commands | 完整 input/result/error types、handler/service signature、ActorContext/metadata/idempotency、validation sequence、transaction/side-effect split | 写 local intent，不写 owner truth；ambiguous→unknown/reconcile。 |
| Queries | input/view types、visibility、projection/read repository、snapshot/fallback/truncation/not-ready | pure no-write；不 refresh/repair；缺失不补 success。 |
| Planned Consumers | readiness gate、正式 envelope mapping、dedup/order/gap transaction（合同闭合后） | 当前 blocked；event 只承接 owner fact；不按到达顺序猜 current。 |
| Operations Jobs | trigger/claim/checkpoint/cancel/basis recheck/result/error/recovery | job success 非 owner success；不自动 replay unknown。 |
| Required Ports | trait/interface + typed semantic DTO/error/capability/readiness + adapter mapping | 名称不证明 owner API；SDK/public API only。 |
| Outbound Events | 不适用 | 03 不得自行新增。 |

## 7. 页面、命令与用户体验承接

03 至少应把以下逻辑入口映射到共同 use case；这些是逻辑页面/section，不预先决定 GUI 框架或文件结构：

| 逻辑入口 / section | Command / Query 承接 | 必须呈现的独立姿态 | 禁止体验捷径 |
|---|---|---|---|
| Context / Release selection | context/release queries、`SelectRelease`、`InvalidateSelection` | actor/scope/source/version/generation/authority/visibility | 自动 latest、旧 cache 代 current。 |
| Material preparation | acquisition commands/queries | transfer、pause/resume/failure、integrity、qualification、protection | complete 显示为 ready。 |
| Run request and lifecycle | `RequestRun`、`RequestRunControl`、run query | intent、request、execution、control、result/freshness | ACK/PID/port/toast 显示 running。 |
| Resource and cleanup | cleanup/resource/recovery queries | local probe、owner lease/allocation、guard、cleanup、recovery | 自动抢占、stop 后自动删。 |
| Preview and diagnosis | preview/diagnosis queries、refresh | source/freshness/visibility/truncation/classification/next step | raw body fallback、local log verdict。 |
| Diagnostic handoff | handoff command/query | draft/pending/accepted/delivered/blocked/failed/unknown | receipt 显示为 evidence/signoff。 |
| Connectivity/recovery banner or section | recovery query/read model | offline/reconnecting/reconciling/manual-review + affected sources | reconnect 自动重放或清 stale。 |

页面是否合并、桌面/CLI 的具体布局、导航、组件和视觉设计属于 03 的 presentation unit 布局与后续实现，不得改变上述语义。

## 8. Transaction、persistence 与恢复承接

| 已收稳边界 | 03 必须定义 |
|---|---|
| Local strong consistency only | aggregate repository/UoW、expected version、transaction scope、projection update ordering。 |
| External call outside transaction | operation identity、pre-call committed intent、crash window markers、receipt apply transaction、outcome query。 |
| No automatic replay unknown | recovery decision table、idempotency capability check、explicit user action vs read-only reconcile boundary。 |
| Owner projection final consistency | source version/order/gap/stale rules、query/event convergence、visibility/freshness representation。 |
| Material file/store atomicity | quarantine handle lifecycle、verification snapshot、promotion/release crash safety、metadata/bytes reconciliation。 |
| Protection before cleanup/release | complete `ProtectionInputs`、missing→unknown、basis version、re-evaluation points。 |
| Local store failure | fail-before-side-effect gate、write conflict、corruption/read-only recovery/manual review behavior。 |
| Restart/suspend/connectivity | startup recovery scan, frozen scope, clock/freshness reset, affected-source refresh, manual-review transition。 |

## 9. 配置、测试与证据边界承接

| 领域 | 03 承接 | 后续文档承接 | 禁止声明 |
|---|---|---|---|
| Configuration | typed config contracts、loader/validator/injection/error/secrets boundary | 04：正式项、值、来源、示例、操作/兼容说明 | 历史默认值或 provider 已确定。 |
| Unit/domain tests | invariants、transition tables、value/binding/guard properties | 05：完整测试方案 | 已执行/通过。 |
| Application/transaction tests | command/query flows、crash windows、idempotency/concurrency、no-write | 05 | 已有 repository/test harness。 |
| Adapter contract tests | DTO/error/capability/readiness/redaction mapping；blocked fakes 仅验证负向本地闭环 | 05；上游合同闭合后正向 integration | fake 证明真实集成。 |
| Platform/cross-platform tests | unsupported/unknown/probe safety、path/port/process abstraction | 05 | 已覆盖 Windows/macOS/Linux 或性能指标。 |
| Presentation tests | section state mapping、entry parity、source/freshness/visibility、no side effect render | 05/06 | UI 存在或验收已完成。 |
| Security/evidence tests | secret/raw body non-persistence、redaction fail-closed、local telemetry non-evidence | 05/06 + owner evidence | 本地日志/receipt 是正式证据。 |

## 10. 详细设计回退规则

如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。

| 03 发现 | 必须回退的位置 | 不允许的做法 |
|---|---|---|
| 需求能力、owner 或非目标改变 | 00/01，再 full-restart 后续受影响文档 | 在 03 用“实现限制”改需求/ownership。 |
| 六个组成部分职责需合并/拆分或跨界 | 02 Step 4～5，并重审 6～13 | 只改目录/类名掩盖职责变化。 |
| 关键对象需要新增/删除/合并或 ownership 变化 | 02 Step 6，并重审 7～13 | 在 DTO/repository 中偷偷创建新 aggregate/truth。 |
| Command/Query/Consumer/Job/port 或 outbound event 需要改变 | 02 Step 7，并重审 8～13 | 在 handler/adapter 中增加隐藏入口/event。 |
| 主处理流、transaction/side-effect boundary 改变 | 02 Step 8，并重审 9～13 | 在实现里添加自动 retry/replay/共享事务。 |
| 状态轴、含义、允许/禁止迁移改变 | 02 Step 9，并重审 10～13 | 用 UI status 或 DB enum 暗改。 |
| 新异常会改变主线/跨部分协作 | 02 Step 10，并重审 11～13 | 仅以 error code/try-catch 吞掉架构影响。 |
| 配置将影响 domain invariant/ownership/security | 02 Step 11，并重审 12～13 | 增加 bypass flag 或宽松默认。 |
| 只需补字段、签名、schema、store/index、错误映射、测试 seam | 留在 03 | 无需回退，只要不改变已收稳语义。 |

## 11. 不进入承接清单的未闭环内容

以下内容不能伪装成 03 的确定输入，只进入 Step 13 风险/待确认：owner exact contracts 与 SDK surface、真实 implementation repository、语言/runtime/GUI shell/process/store/protocol/provider 选择、cross-platform workload、量化预算、正式 event readiness、测试/证据/签署状态。03 必须在各自 Step 重新读取真实来源并保留 blocker。

## 12. 完整性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 4～5 主体 | pass | 六部分、实现分层和 shared support 均有承接。 |
| Step 6 objects | pass | 17 个对象全部进入类型/持久化/测试展开，未新增 aggregate。 |
| Step 7 interfaces | pass | Commands/Queries/Consumers/Jobs/14 ports/无 outbound event 全部覆盖。 |
| Step 8 flows | pass | 六部分主流、通用 transaction/query/consumer/job 骨架均有实现展开。 |
| Step 9 states | pass | 多轴、传播、禁止迁移与 owner projection 分离均有承接。 |
| Step 10 exceptions | pass | crash/concurrency/store/clock/contract/redaction 进入 error/recovery/test seams。 |
| Step 11 config | pass | 03/04 边界、domain no-read 和不可配置化规则均有承接。 |
| 页面/命令 | pass | 所有用户能力有逻辑入口和共同 Command/Query，不锁 GUI 技术。 |
| 测试/证据 | pass | 只交测试切口，不声称结果/evidence/readiness。 |
| Blockers | pass | `RUN-UP-001~008` 只进入 planned/blocked required boundaries。 |

## 13. 回填草稿

正式 §12 使用压缩后的“概要输入→03 展开”主表，并保留按六部分的模块/接口/页面/状态/测试承接、required port blocker 表、transaction/persistence/recovery、配置/测试/证据和回退规则。正式文档不得将本清单改写为开发任务、排期或 readiness 声明。

## 14. 进入下一步条件

- [x] Step 4～11 的主要组成部分、对象、接口、流程、状态、异常与配置结论均进入承接清单。
- [x] 03 展开方向达到模块、命令、页面、状态对象、adapter、下载验证、事务恢复、配置、测试切口和证据边界粒度。
- [x] required ports 与 available adapters、planned Consumer 与真实 event readiness 明确分离。
- [x] 没有新增未经讨论的对象、接口、流程或状态，没有写开发任务/排期/实现指令。
- [x] 已明确语义主语改变时必须回退 02，并指出对应 Step。
- [x] 未闭合事实已排除出确定承接，留 Step 13 风险/待确认。

结论：`gate_status=pass`，允许进入 Step 13“设计风险与待确认事项”。
