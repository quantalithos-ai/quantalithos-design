# L2-member-images 03 详细设计 Step 9：逐接口函数级处理流

> 创建日期：2026-08-28  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9  
> 回填位置：正式 `03-详细设计.md` 第 8 章（当前禁止装配）  
> 粒度基线：参照 `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md` 的逐协议、逐 flow、逐批停审与最终跨 flow 审计格式；不继承其治理对象、outbox、publisher、delivery、report 或正向外部合同。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 恢复入口 | 已先读取 `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、Step 8 协议契约、Step 7 port/adapter 契约、Step 6 对象契约、Step 5 模块契约、02 HLD Step 7/8/9、Step 9 SOP/书写规范与真相源闭环标准。 |
| 用户授权 | 用户最新“继续”解除 Step 8→Step 9 门禁；本 Step 完成后必须停审，未经再次明确确认不得创建 Step 10。 |
| 本步目标 | 将 Step 8 的 10 Command、10 Query、2 个条件入站 boundary、0 outbound event 和 6 个 bounded Operations Job 逐一展开为应用层函数级 flow、调用图、伪代码、UoW/错误/状态/测试切口与跨 flow 审计。 |
| 可调用上限 | 只能调用 Step 6 已定义的 domain factory/member/guard 与 Step 7 已定义的 application-owned port；缺失 surface 一律记录 blocker，不在 flow 中临时发明 repository、adapter、outbox、publisher、route、topic、scheduler、receipt 或 product binding。 |
| 不变边界 | 本仓仅拥有镜像定义/静态装配、构建意图/本地结果归纳、资格、本地 supply、body-free snapshot/gap/trace/projection/replay 真相；不拥有 member、runtime、tool、adapter、live memory/checkpoint、container、Artifact、Member Service 或 governance truth。 |
| 出站边界 | `MI-UP-009` 未闭口；outbound inventory 严格为零。任何 flow 只可产生 local truth/trace/gap/projection/replay effect，不得新增 outbox、publisher、delivery、payload、topic、receipt 或 outbound flow。 |
| 条件入站边界 | `MI-UP-005` 未闭口；两个 consumer 只能检查 marker 并返回 fail-closed disposition，不接收 envelope/payload、不 reserve/dedup、不写 truth、不创建 receipt。 |
| 本步禁止 | 不读取旧正式 `03-详细设计.md`；不写实现代码/Cargo/测试结果/digest/run_id/report/evidence/verdict/signoff/readiness；不修改其他项目；不提交 commit。 |

## 1. Step 内计划、批次与门禁

### 1.1 分批写入计划

| 批次 | Flow 族 | 覆盖量 | 当前状态 | 局部完成门禁 |
|---:|---|---:|---|---|
| 9.0 | shared flow discipline / inventory | 1 套共享规则、28 条 inventory | `completed_stop_review` | 固定 command/query/inbound/job 的合法 transaction 与副作用上限；明确 outbound 为零。 |
| 9.1-a | DefinitionAssembly Command | 3 | `completed_stop_review` | Define/Capture/Propose 逐条收敛为 validation/context→B01；future local repo/resolver/guard/UoW/replay 仅作 reopen mapping。 |
| 9.1-b | BuildCandidate Command | 2 | `completed_stop_review` | Intent 与 outcome/candidate 分离；builder ACK/observed ref 不能形成 candidate shortcut。 |
| 9.1-c | Qualification Command | 2 | `completed_stop_review` | qualification 与 Artifact handoff 分离；未闭口 gate/Artifact 仅 future gap/blocked mapping。 |
| 9.1-d | SupplyEntry Command | 3 | `completed_stop_review` | local entry/history 与 consumer/container 外部事实分离。 |
| 9.2-a | direct truth Query | 4 | `completed_stop_review` | query 不开写 UoW、不 reserve、不创建 projection；Fresh 偏好不得降级。 |
| 9.2-b | supply/reference/page Query | 6 | `completed_stop_review` | 页码、gap selector、trace source、existing projection marker 均使用 Step 8/7 既有 surface。 |
| 9.3 | conditional inbound | 2 | `completed_stop_review` | marker-only、accepted_input=false；不形成任何正向写路径。 |
| 9.4 | outbound event | 0 | `completed_stop_review` | 以零库存停审；不创建 flow。 |
| 9.5-a | Build/Qualification Job | 3 | `completed_stop_review` | action marker→boundary→explicit page→B01/reopen；无 scheduler/run/report。 |
| 9.5-b | Reference/Projection/Handoff Job | 3 | `completed_stop_review` | reference/projection/handoff 局部 future mapping不反写 core truth、不接受/确认外部合同。 |
| 9.6 | final audit / handoff | 1 套 | `completed_stop_review` | 已审计 DTO→object→port→flow、UoW、状态、replay、outbound absence、pending/phase boundary。 |

### 1.2 Flow 总表

| Flow | 对应协议 | application owner | 主要 local subject | 写入边界 | Step 10 候选状态 | 状态 |
|---|---|---|---|---|---|---|
| `DefineImageVariantFlow` | `DefineImageVariant` | `DefinitionAssemblyCoordinator` | family / variant | future local truth + trace + replay | definition | 已停审（B01/B02） |
| `CaptureAssemblyBaselineFlow` | `CaptureAssemblyBaseline` | `DefinitionAssemblyCoordinator` | baseline / pins / bindings | future local truth + trace/gap + replay | baseline | 已停审（B01/B02） |
| `ProposeVariantRevisionFlow` | `ProposeVariantRevision` | `DefinitionAssemblyCoordinator` | revision / active variant | future local truth + trace + replay | revision | 已停审（B01/B02） |
| `RequestBuildIntentFlow` | `RequestBuildIntent` | `BuildIntentCoordinator` | intent / snapshot | future local truth + trace/gap + replay | intent / snapshot | 已停审（B01/B02） |
| `RecordBuildOutcomeFlow` | `RecordBuildOutcome` | `BuildIntentCoordinator` | attempt / outcome / candidate | future local truth + trace/gap + replay | attempt / candidate | 已停审（B01/B02） |
| `EvaluateCandidateEligibilityFlow` | `EvaluateCandidateEligibility` | `QualificationCoordinator` | provenance / gate / eligibility | future local truth + trace/gap + replay | provenance / gate / eligibility | 已停审（B01/B02/Q-MI-004） |
| `RecordArtifactHandoffFlow` | `RecordArtifactHandoff` | `QualificationCoordinator` | local handoff record / gap | future local Pending/Gap + trace + replay | handoff | 已停审（B01/B02/MI-UP-007） |
| `PublishInstantiableEntryFlow` | `PublishInstantiableEntry` | `AvailabilityCoordinator` | entry / publish transition | future local truth + trace + replay | entry / transition | 已停审（B01/B02） |
| `TransitionAvailabilityFlow` | `TransitionAvailability` | `AvailabilityCoordinator` | transition / entry | future local history/truth + trace + replay | transition / entry | 已停审（B01/B02） |
| `RollbackOrRetireEntryFlow` | `RollbackOrRetireEntry` | `AvailabilityCoordinator` | prior/target entry / transition | future local history/truth + trace + replay | entry / transition | 已停审（B01/B02） |
| `GetImageVariantDefinitionFlow` | `GetImageVariantDefinition` | `query_service` | definition local truth / existing view | read-only | query surface only | 已停审 |
| `GetAssemblyDerivationFlow` | `GetAssemblyDerivation` | `query_service` | baseline / revision / bindings | read-only | query surface only | 已停审 |
| `GetBuildTraceFlow` | `GetBuildTrace` | `query_service` | intent / attempt / outcome / candidate | read-only | query surface only | 已停审 |
| `GetProvenanceAndEligibilityFlow` | `GetProvenanceAndEligibility` | `query_service` | provenance / gate / eligibility | read-only | query surface only | 已停审 |
| `ResolveInstantiableEntryFlow` | `ResolveInstantiableEntry` | `query_service` | entry / consumer gap / existing view | read-only | query surface only | 已停审（MI-UP-001 positive lane pending） |
| `ListAvailableVariantsFlow` | `ListAvailableVariants` | `query_service` | available entries page | read-only | query surface only | 已停审 |
| `GetAvailabilityHistoryFlow` | `GetAvailabilityHistory` | `query_service` | transition history page | read-only | query surface only | 已停审 |
| `GetImageTraceFlow` | `GetImageTrace` | `query_service` | trace page | read-only | query surface only | 已停审 |
| `GetContractGapsFlow` | `GetContractGaps` | `query_service` | selected local gap page | read-only | query surface only | 已停审 |
| `GetProjectionFreshnessFlow` | `GetProjectionFreshness` | `query_service` | existing freshness marker | read-only | freshness only | 已停审 |
| `ConsumeVerifiedBuildRequestFlow` | conditional inbound | `worker` → application boundary | marker only | no write | inbound marker only | 已停审（MI-UP-005 reopen） |
| `ConsumeVerifiedSourceRefreshFlow` | conditional inbound | `worker` → application boundary | marker only | no write | inbound marker only | 已停审（MI-UP-005 reopen） |
| `RunNightlyBuildSweepFlow` | `RunNightlyBuildSweep` | `BuildIntentCoordinator` | buildable revision page | future local intent/replay only | job marker / intent | 已停审（B01/B02） |
| `ReconcileBuildAttemptsFlow` | `ReconcileBuildAttempts` | `BuildIntentCoordinator` | attempt page | future local outcome/attempt/candidate/replay only | attempt / candidate | 已停审（B01/B02/Q-MI-003） |
| `ReevaluatePendingQualificationsFlow` | `ReevaluatePendingQualifications` | `QualificationCoordinator` | evaluation page | future local evaluation/decision/replay only | gate / eligibility | 已停审（B01/B02/Q-MI-004） |
| `RefreshExternalReferenceSnapshotsFlow` | `RefreshExternalReferenceSnapshots` | `ReferenceIntakeCoordinator` | exact snapshot source | future local snapshot/gap/trace/replay only | reference / gap | 已停审（B01/B02） |
| `RebuildImageDerivedViewsFlow` | `RebuildImageDerivedViews` | `ProjectionRebuilder` | explicit existing projection key | future local view/freshness/trace/replay only | freshness | 已停审（B01/B02） |
| `ReconcileArtifactAndConsumerHandoffsFlow` | `ReconcileArtifactAndConsumerHandoffs` | Qualification + Availability coordinator | selected handoff/gap page | future local Pending/Gap/Stale/replay only | handoff / consumer gap | 已停审（B01/B02/MI-UP-001/007） |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用法 |
|---|---|---|
| 重建版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 已停审 | 承接镜像资产层职责、五 capability、truth/projection 分离与跨仓 dependency 分类；不重写其结论。 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 确认 coordinator、domain、entry 和 infra 的责任归属与禁止事项。 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 只调用已定义的 factory/member/guard/state carrier；不为 flow 新增 domain helper。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 每个 repository/resolver/UoW/idempotency/boundary 调用必须回指其中签名；不新建 port。 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 复用 10/10/2/0/6 的 request/result/page/freshness/canonical/replay 与 blocker 上限。 |
| `L1-governance` Step 9 | 仅格式/粒度参照 | 借鉴逐 flow ASCII、伪代码、停审和 final audit；不引入其 outbox/publisher/report/approval 领域。 |
| `L2-member`、`L2-member-service` 进行中材料 | sibling pending | 仅维持 ref/gap/reopen seam；不视为合同或源码依赖。 |

## 3. SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 哪些协议必须有函数级 flow？ | Step 8 inventory 的全部 28 个非-outbound logical surface 都必须有独立 flow；outbound inventory 为 0，因此没有 outbound flow。 |
| 2 | 如何分批？ | 先 shared discipline，再按 Definition/Build/Qualification/Supply command、direct/page query、conditional inbound、job、final audit 的顺序；每项独立停审。 |
| 3 | 入口函数是什么？ | 入口是 Step 8 `handle_*` logical facade / query handler / marker handler / job handler；不绑定 HTTP/RPC/topic/scheduler。 |
| 4 | 调用哪些 service、domain、repository、outbox？ | 仅 application coordinator、Step 6 domain method/guard、Step 7 UoW/repository/resolver/idempotency/boundary。没有 outbox、publisher 或 delivery 调用。 |
| 5 | DTO 在哪里校验/构造对象？ | application 在 canonicalize/reserve 后、UoW 内 exact-load并逐字段映射；新 local ID/time 只来自 `ImageIdGeneratorPort`/`ImageClockPort`；domain factory/member拒绝不完整或错配输入。 |
| 6 | 必填字段缺失如何处理？ | 在 DTO validation、exact load、resolver/boundary disposition 或 domain guard 处返回 `Missing`/`ContractViolation`/`Blocked`/`Unavailable`；不得填默认 ref、timestamp、digest、body 或 fake state。 |
| 7 | Step 7 port 是否够用？ | local Command/Query/Job 只使用已有 typed port；条件入站只用 `inspect_inbound_boundary`。若 future owner contract需要 envelope/acceptance/confirmation，则保持 blocker并重开 Step 7~9。 |
| 8 | 事务在哪里开始/提交/回滚？ | Command 和 Job 的 accepted/local-disposition path 使用同一个 `ReadWrite` UoW；query和marker-only inbound不开始 UoW。任何 local write/version/result failure回滚；外部观察不是 commit evidence。 |
| 9 | 哪些状态与事件副作用被修改？ | 仅 Step 6 local lifecycle、gap/freshness/trace/replay；无 outbound event。具体 transition 将回指 Step 10候选，而非提前写矩阵。 |
| 10 | 最小测试切口？ | 每 flow都列 success/local blocked/missing/conflict/duplicate/no-write 等最小切口；不伪造测试执行结果。 |
| 11 | 单 flow 停审如何判断？ | DTO→object→port、UoW/version、error、state/trace/gap/replay、test、forbidden external side effect 均可回指现有源，且没有新建未授权 carrier。 |
| 12 | 跨 flow 是否冲突？ | final audit 检查 UoW、state owner、trace/replay、page/freshness、boundary blocker、outbound absence与 phase boundary；未闭外部合同只允许保留 pending。 |

## 4. 当前材料问题诊断

| 诊断项 | 当前材料位置 | 若直接实施的风险 | 本 Step 处置 |
|---|---|---|---|
| HLD flow 合并多个 command | `02_hld_step_08` §3/§5/§10 | implementation 可能把不同 DTO、UoW、transition 和 replay 混成同一 handler | 将 10 个 command 拆为独立 flow，只共享固定 command discipline。 |
| 10 个 Query 只有协议级 view 规则 | Step 8 §4 | 实现可能在 query 中 refresh、rebuild或从 truth 降级满足 Fresh | 将每个 query 明确为 no-write，并固定 direct/projection/page/marker 分支。 |
| inbound HLD 描述过正向 | HLD §6 | `MI-UP-005` 未闭时可能误造 envelope/dedup/intent mutation | 仅留 marker inspection flow，并明确无 accepted path。 |
| Job 容易被解释为 scheduler worker | Step 8 §7 | 可能生成 scheduler/run/report/cursor或全表扫描 | 每个 job 先 action marker，再 explicit page/exact target；结果仅 local disposition。 |
| L1-governance 有出站条目 | 参照材料 §17 | 易误将 outbox/publisher复制至本仓 | 以零库存 audit 替代整个 outbound flow batch。 |
| Step 7 只定义 port、未规定 sequence | Step 7 §15.2 | 可能顺序不一致、duplicate重跑或 external ACK当 commit | 本 Step 明确 command/job/query/inbound 模板和各 flow 调用顺序。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Command 处理 | 仅 Step 8 DTO/构造表与 HLD 合并骨架 | 10 条独立 application flow，逐条定义 UoW、load/guard/save/replay 与停审 | 避免实现端自行组合对象和 transaction。 |
| Query 处理 | 共享 no-write 规则 | 10 条独立 read flow，显式处理 direct/projection/page/freshness/content-state | 防止 Fresh/Visible/page/gap 语义漂移。 |
| inbound | 条件消费的未来方向 | 两条 marker-only fail-closed flow | 不在 `MI-UP-005` 未闭时制造正向消费合同。 |
| Job | bounded DTO 和 marker | 六条独立 scope/boundary/replay flow | 防止 scheduler/run/report 或未分页 scan 被补入。 |
| 副作用 | 可被 L1-governance 格式误导 | trace/gap/projection/replay only，outbound strict zero | 坚守本仓当前 authority。 |

## 6. 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| 为每个 logical protocol 保留独立 flow，共享模板只表达共同纪律 | 可逐项回指 DTO/object/port，利于 Step 10~16 | 文档较长 | 采用。 |
| 合并同类 Command/Query/Job 为单一“通用流程” | 篇幅短 | 会隐藏不同 factory、selector、state与 blocker | 不采用。 |
| 复制 L1-governance 的 outbox/publisher/reconciliation report 流 | 格式看似完整 | 超出 `MI-UP-009` 与本仓边界 | 不采用；outbound batch为零。 |
| 为 pending 对端补临时 envelope、manifest、digest 或 confirmation | 可看似形成正向闭环 | 私造 owner truth且污染 downstream contract | 不采用；只用 typed ref/gap/blocked/reopen。 |
| 把 Job 解释成常驻 scheduler/worker | 便于想象运行方式 | 未授权且会引入 run/report/lease/cursor state | 不采用；只建 bounded in-process logical call。 |

## 7. 结构化中间产物

### 7.1 Shared Command flow discipline

所有 Command flow 必须使用下列固定顺序。只有已在 Step 8 定义 canonical input 的 Command 可以进入 reservation；`canonicalize` 失败时不得 reserve、更不得写 local truth。这里的“trace”仅是本仓 append-only `ImageTraceRecord`，不是 observability backend、report 或 evidence。

```text
[logical API / facade entry]
  | validate ImageCommandRequest<T>, actor kind, typed refs and request-local rules
  | map ImageCommandName -> canonical literal -> ImageOperationName
  | build ImageOperationContext::from_write(...); recorded_at = ImageClockPort.now()
  | canonicalizer.canonicalize(context, protocol input)
  v
[ReadWrite UoW]
  | ImageUnitOfWorkManager.begin(boundary)
  | idempotency.reserve(context, stable_input_ref, uow)
  | Duplicate -> rollback; load stored replay body; return DuplicateReplay
  | Conflict -> rollback; return Conflict
  v
[exact load / resolver / domain guard]
  | load only Step 7 typed local truth with versions
  | call named body-free resolver/boundary only when this flow permits it
  | call Step 6 factory/member/guard; no direct field mutation
  v
[stage local effect]
  | save/update local truth with Absent or Exact(loaded.version)
  | append local trace when a local subject/gap/freshness effect is committed
  | save existing projection freshness only when this flow has an existing affected view surface
  | save stored command result; complete idempotency
  | commit UoW
  v
[ImageCommandResult]
  | Accepted / Blocked / Rejected / Unavailable / Unknown, local refs and NoneAuthorized outbound inventory
```

关键说明：

- `DuplicateReplay` 必须从 `ImageIdempotencyRepositoryPort::get_replay_body` 读取已存 body，绝不重新 load/resolver/guard/save。
- `Blocked`/`Unavailable` 可在同一 UoW 保存已经定义的 local gap/negative disposition；不能借此形成 candidate、eligibility、entry、Artifact accepted 或 consumer confirmation。
- 外部 resolver/boundary 的 `ACK`、presence、safe observation、slot availability 或 future consumer seam 不是 UoW commit 证据。
- 所有 Command 的 `effects.outbound_event_inventory = ImageOutboundEventInventory::NoneAuthorized`；本图中没有 outbox/publisher/delivery 步骤。

### 7.2 Shared Query flow discipline

```text
[logical query entry]
  | validate ImageQueryRequest<T>, typed selector, explicit page and ImageQueryContext
  | map ImageQueryName -> canonical literal -> ImageOperationName
  | do not build write metadata, UoW, idempotency reservation or replay body
  v
[query service]
  | verify only local read reachability supplied by read_scope_ref
  | if unresolved owner authorization would be required -> Unavailable, not NotVisible
  | choose the exact Step 8 direct-truth/history or existing-projection path
  v
[read port]
  | exact get / explicit page / existing projection marker lookup
  | no refresh, rebuild, gap creation, trace append or external adapter call
  v
[view mapper]
  | map body-free local refs/states/gaps/page/freshness/content-state
  | RequireFresh only accepts an existing Fresh projection
  | direct truth/history always maps freshness=None, never Fresh
  v
[ImageQueryResponse<T> / ImageQueryPageResponse<T>]
```

关键说明：

- `Visible` 是 local read reachability，不是 authorization success；需要未闭合 authorization truth时一律 `Unavailable`。
- 没有 projection companion 的 Query 收到 `RequireFresh` 或 `InspectMarker` 时 fail-closed；不得退化至 direct truth/history。
- Query 的 `Partial` 只能按 Step 8 的 content-state matrix 携带既有安全字段和 typed gap；不能查询时创建 gap。

### 7.3 Shared conditional inbound flow discipline

```text
[future worker logical entry]
  | name is known, but envelope/payload/event id/transport are not defined
  v
[ImageEntryBoundaryPort.inspect_inbound_boundary(marker)]
  | Unavailable / Rejected / ReopenRequired
  v
[ImageInboundBoundaryResult]
  | accepted_input = false
  | return local marker disposition only
```

当前无 UoW、no canonicalizer、no reservation、no dedup、no receipt、no delay/quarantine、no BuildIntent/snapshot/trace write。只有在 owner 正式闭合 event family、identity/version、envelope/payload、source authority、dedup/receipt 与 transport semantics 后才可重开 Step 7~9。

### 7.4 Shared Operations Job flow discipline

```text
[bounded jobs caller]
  | validate ImageOperationsJobRequest<T>, System actor, explicit scope/page
  | map ImageOperationsJobName -> canonical literal -> ImageOperationName
  | map job name -> ImageJobActionKind -> ImageJobActionMarker::declare(...)
  v
[ImageEntryBoundaryPort.inspect_job_action_boundary]
  | Blocked/ReopenRequired -> return local JobDisposition; no page read
  | Declared -> continue
  v
[ReadWrite UoW + replay]
  | canonicalize exact job body; reserve idempotency
  | duplicate -> rollback; return stored JobDisposition body
  v
[bounded local body]
  | select one explicit repository page or exact target only
  | call only declared application facade/domain/port surface
  | stage allowed local disposition/marker/truth derived by this job
  | save JobDisposition; complete; commit
```

关键说明：

- `ImageJobPageRequest` 只能一对一映射 `ImageRepositoryPageRequest { after, limit }`；`after=None` 是第一页，不是 scheduler cursor；没有默认 batch/full scan。
- job result 是 per-subject local disposition，不是 run report；禁止 `run_id`、schedule、lease、start/end time、count、metric、evidence、verdict、signoff、digest、Artifact/consumer confirmation。
- 没有 outbound job、publisher job、delivery retry job 或 scheduler binding。

### 7.5 当前可调用性与 write-path blocker

本节是 Step 9 的校准诊断，不是新的 domain object、protocol、runtime state、stored gap 或 implementation work item。它只约束本 Step 能否把已定义 surface 连接成一个**可合法实施**的函数调用链。

| 校准 blocker | 已有材料 | 缺失的 callable surface | 直接影响 | 本 Step 的 fail-closed 处置 | 允许的修复位置 |
|---|---|---|---|---|---|
| `DDD-S9-B01`：canonical input 只有字段顺序 | Step 8 §2.6 和各 Command/Job 的 canonical 排序；Step 7 `ImageOperationInputCanonicalizerPort` | 没有任何具体 `CanonicalImageOperationInput` 实现、protocol-to-input mapper 或其构造函数 | 所有新的 Command / Job 无法合法调用 `canonicalize`，因此不能拿到 `StableOperationInputRef` 或进入 `reserve` | 在 input validation 与 operation context 构造后停止；不开始 UoW、不读取/写入 repository、不调用 external seam | 重开 Step 7/8，定义每个写协议的 concrete canonical-input carrier / mapper；不得在 Step 9 临时命名或伪造。 |
| `DDD-S9-B02`：stored-result replay identity 不可构造 | Step 6 仅定义 `ImageOperationResultId` / `ImageOperationResultRef` 字段 carrier；Step 7 `save_stored_result` / `complete` 均要求已存在的 ref | 没有 result-id / result-ref 的 factory、mapper 或其他合法来源 | 即使 B01 解除，新的 Command / Job 也不能调用 `StoredImageOperationResult::record`、`save_stored_result` 或 `complete`，不能形成 replayable commit | 不得通过 direct struct literal、随机 ID、digest、request key、external ref 或重新执行来代替 result ref；新写入必须在任何 local mutation 前停止 | 重开 Step 6/7/8，收稳 result identity 的唯一构造、result shell 与 replay-body 的一致性约束。 |

`DDD-S9-B01/B02` 不等同 `ContractGap`、`ConsumerHandoffGap`、`SafeReason`、artifact gap 或任何可持久化 runtime record；因此当前 flow 也不得为了“记录 blocker”而调用 `ContractGap::open`、repository save、trace append、projection marker、idempotency reservation 或 stored result port。

| Flow 类别 | 当前可合法执行的最大路径 | 不可越过的点 | 不得发生的副作用 |
|---|---|---|---|
| Command（10） | DTO / actor / metadata shape validation → Step 8 name mapper → `ImageOperationContext::from_write` | B01；即使未来 B01 解除，B02 仍在 result-store 前阻断 | UoW、reserve、local truth / gap / trace / projection write、resolver / builder / qualification / consumer seam、outbound。 |
| Query（10） | 完整 read-only path，可调用 exact/page/existing-projection read surface | read scope / freshness / local relation缺口按 Query surface fail-closed | UoW、reserve、replay、trace、gap、freshness、refresh、rebuild、external seam。 |
| conditional inbound（2） | `InboundContractMarker` → `inspect_inbound_boundary` → marker-only disposition | `MI-UP-005`；没有 envelope/payload/authority | context write、canonicalize、reserve、receipt、BuildIntent/snapshot/trace write。 |
| Operations Job（6） | System actor / metadata / scope validation → `ImageJobActionMarker::declare` → `inspect_job_action_boundary` | Declared 后的 B01；B02 仍阻断任何 new disposition commit | page select、resolver/adapter、truth/projection/gap write、stored JobDisposition、scheduler/run/report/outbound。 |

当前已经存在的 duplicate replay 也不能被本 Step 假定为可达：进入 `ImageIdempotencyRepositoryPort::reserve` 本身要求 B01 的 stable input；只有修复后 `reserve` 返回 `Duplicate { result_ref }`，flow 才可严格调用既有 `get_stored_result` 与 `get_replay_body`。在此之前，任何“读取旧 result”“重新计算结果”或“假设 duplicate”均属于伪造路径。

### 7.6 Shared write-flow stop rule

下列 Rust 风格伪代码只展示所有 Command / Job 共用的**当前合法停止点**；它不引入未定义的 result constructor、protocol mapper、error factory 或 repository helper。每条具体写 flow 会在自己的小节列出 DTO→目标对象→port 映射，但该映射在 B01/B02 解除前均为不可到达的下游设计意图，不是可执行调用。

```rust
// 适用于任一 Step 8 Command 或 Operations Job 入口。
// [ImageOperationContext::from_write(ImageOperationChannel, ImageOperationName, OperationMetadata)]
let context = ImageOperationContext::from_write(channel, operation_name, metadata)?;

// STOP DDD-S9-B01:
// Step 8 仅定义 canonical field order，未定义可作为
// `&dyn CanonicalImageOperationInput` 传入的 concrete carrier / mapper。
// 因此不得调用 ImageOperationInputCanonicalizerPort::canonicalize。

// No ImageUnitOfWorkManager::begin, no ImageIdempotencyRepositoryPort::reserve,
// no domain factory/member, no repository save/append, no external seam call.
// Even after B01 is corrected, STOP DDD-S9-B02 before any mutation until a legal
// ImageOperationResultRef construction path exists for save_stored_result/complete.
```

| 审计项 | 当前结论 |
|---|---|
| 错误 surface | 入口可将缺口暴露为未持久化的 fail-closed protocol error；不能伪造 `result_ref`、replayed result、stored negative disposition 或 exact runtime verdict。具体 error constructor 尚未定义，因此本 Step 不把它写成新的 function call。 |
| UoW / rollback | B01/B02 前没有合法 begin；不存在 staged write，也就没有可 commit / rollback 的 local effect。若未来实现错误地先写后发现 B02，必须 rollback entire UoW；本 Step 不把这一未来要求写成当前可执行 sequence。 |
| state / trace / gap / freshness | 零变更。B01/B02 是 design-calibration blocker，不可转化为 domain lifecycle、trace、gap 或 freshness object。 |
| outbound | 固定 `ImageOutboundEventInventory::NoneAuthorized`；无 outbox、publisher、delivery、receipt 或 topic。 |
| 最小验证切口 | 静态 contract test：任一新 Command/Job 在缺 concrete canonical carrier 或 result-ref factory 时，不得到达 `begin`、`reserve`、任何 repository save/append 或 external seam call。未执行测试、不记录 verdict。 |

### 7.7 Flow 与真相源、端口、状态的预审矩阵

| Flow 族 | Step 8 surface | Step 6 object/guard | Step 7 callable surface | UoW | 外部 side effect | 当前上限 |
|---|---|---|---|---|---|---|
| Definition Command | Define/Capture/Propose | definition/baseline/revision/pin guards | definition repo + assembly resolver + technical/replay | ReadWrite | resolver inspection only | static ref-only / local truth。 |
| Build Command | Request/Record | intent/snapshot/attempt/outcome/candidate guards | build repo + builder/registry + technical/replay | ReadWrite | controlled handoff/safe observation only | no product execution/digest/publish truth。 |
| Qualification Command | Evaluate/Artifact | provenance/gate/eligibility/handoff | qualification repo + boundary + technical/replay | ReadWrite | non-positive boundary assessment only | no gate inventory/Artifact acceptance。 |
| Supply Command | Publish/Transition/Rollback | entry/transition guards | supply repo + technical/replay | ReadWrite | none | no Member Service/container/registry change。 |
| Query | 10 query request/response | views/read guards | exact/page/projection reads | none | none | existing local truth/projection only。 |
| conditional inbound | 2 boundary result | inbound marker | entry boundary inspection | none | none | accepted_input=false。 |
| Job | 6 job request/result | action marker + selected domain objects | entry boundary + exact/page port + technical/replay | ReadWrite only after Declared | limited resolver/boundary observation | no scheduler/run/report/outbound。 |

## 8. Command flow batch 9.1：逐命令处理流

### 8.0 本批共同可执行性判定

下列十条 Command 的 Step 8 DTO、逻辑入口、对象归属和目标 port 已经存在，但 `DDD-S9-B01` 与 `DDD-S9-B02` 使它们**目前没有一条能够合法进入本地写事务**。因此每条小节同时保留两层信息：

1. **当前函数级流**只到 DTO / actor / metadata 的本地 shape 校验、Step 8 穷尽名称映射和 `ImageOperationContext::from_write`；随后 fail-closed 停止。
2. **重开后映射**只列已存在的对象工厂、成员函数和 port，供修复 Step 6~8 后重新审阅；它不是当前可调用链，不得据此开始 UoW、resolver、repository 或 external seam。

这一区分避免把“对象和 port 已被命名”误写成“写路径已经可实施”。每个 flow 的 transaction、state、trace、gap、replay 均以当前零写入为准；只要 B01/B02 未解除，就不得把下面的未来映射实施为局部 shortcut。

### 8.1 `DefineImageVariantFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_define_image_variant(ImageCommandRequest<DefineImageVariantRequest>)`；`DefinitionAssemblyCoordinator`。 |
| 目标 | 为 existing 或 new local family 绑定一个 body-free mapping snapshot，并定义 local variant；不读取 RoleDefinition / mapping body。 |
| 当前可调用上限 | 校验 `family` selector、non-empty `persona_label`、typed `mapping_snapshot_ref`、participant actor 与 write metadata；构造 `Command/DefineImageVariant` operation context 后在 B01 停止。 |
| 当前禁止 | `get_*`、`find_family_by_name_with_version`、ID 生成、family/variant factory、UoW、trace、gap、replay、Method Library resolver 与任何 outbound。 |

#### 调用图: `DefineImageVariant` 当前合法停止流

```text
[logical API entry]
  | call local DTO and actor shape validation
  v
[DefinitionAssemblyCoordinator.handle_define_image_variant]
  | call Step 8 name mapping: DefineImageVariant
  | call ImageClockPort.now
  | call OperationMetadata::new
  | call ImageOperationContext::from_write
  v
[DDD-S9-B01 stop]
  | no CanonicalImageOperationInput carrier or mapper
  v
[fail-closed ImageProtocolError surface]
```

关键说明：

- 本图只表示当前可执行的 application 边界；它没有开始 `ImageUnitOfWork`，也没有读取 local family 或 snapshot。
- `mapping_snapshot_ref` 的 exact-kind 只能做 DTO shape 检查；“该 ref 是否存在 / 可用”需要 repository read，当前不得提前触发。
- `ImageOutboundEventInventory::NoneAuthorized` 固定，不存在 outbox、publisher 或 delivery 节点。

```rust
// Local DTO shape validation rejects an absent actor, empty label, malformed selector, or wrong typed ref.
let operation_name = ImageOperationName(
    NonEmptyText::parse("DefineImageVariant".to_owned())?,
);
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01: no concrete CanonicalImageOperationInput or protocol-to-input mapper exists.
// Do not begin a UoW, reserve idempotency, read a repository, or call a domain/external seam.
return Err(/* existing Step 8 fail-closed protocol-error mapping; no new error factory */);
```

| DTO 字段 | 重开后目标对象 / named callable surface | 当前状态 |
|---|---|---|
| `family=Existing(ref)` | `DefinitionAssemblyRepositoryPort::get_family_with_version` → loaded `ImageFamilyDefinition` | 不可读。 |
| `family=New(name)` | `find_family_by_name_with_version` → `ImageFamilyDefinition::create(ImageLocalId, NonEmptyText)` | 不可 lookup / mint。 |
| `persona_label` | `ImageVariantDefinition::define(ImageLocalId, ImageFamilyDefinitionRef, NonEmptyText, MappingSourceSnapshotRef)` | 仅 shape 可校验。 |
| `mapping_snapshot_ref` | `get_mapping_snapshot_with_version` → `MappingSourceSnapshot::is_usable_for_definition` | 不可读；不得访问 Method Library body。 |
| resulting refs | `family.attach_variant`、`family.mark_resolved` / `variant.mark_resolved` only after loaded local validity; `save_family` / `save_variant` | B01/B02 前不可到达。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW、无 `ExpectedLocalObjectVersion`。重开后需同一 `ReadWrite` UoW 保存 new/updated family 与 new variant；existing family 的 version 必须只来自 `Versioned<ImageFamilyDefinition>`，new object 才能用 `Absent`。 |
| 错误映射 | 入口 shape error 按 Step 8 映射 `Missing` / `ContractViolation`；context 构造失败同样 fail-closed。B01 映射为当前未持久化的 `Unavailable` / contract-design blocker，不得伪造 family/variant ref、gap 或 replay。 |
| 状态与副作用 | 当前零状态变化、零 trace、零 gap、零 freshness、零 stored result；未来 `Resolved` 仅为 local definition relation，不等 baseline、build、candidate 或 supply。 |
| 最小测试切口 | malformed `Existing` ref / blank label rejected before context；valid DTO reaches context then B01; spy asserts no UoW/reservation/repository/ID/resolver call; no local mutation or outbound side effect。 |

#### `DefineImageVariantFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| 当前 callable path 是否真实 | `pass_with_blocker` | 只使用已定义 metadata/context factory；B01 前没有假 canonicalizer。 |
| DTO 到未来对象映射是否可追溯 | `pass_as_reopen_mapping` | family selector、variant label、mapping snapshot均能回指 Step 6/7；不把该表当 current mutation authority。 |
| local / external truth 是否分离 | `pass` | 只计划 local family/variant；mapping owner truth保持外置。 |
| 下一条件 | `blocked` | 先修复 B01/B02 并重开 Step 7~9。 |

### 8.2 `CaptureAssemblyBaselineFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_capture_assembly_baseline(ImageCommandRequest<CaptureAssemblyBaselineRequest>)`；`DefinitionAssemblyCoordinator`。 |
| 目标 | 将 runtime/tools/member/supervisor/role-extra pins 与 policy/memory/workspace/role-extra static seed bindings、base image ref 固化为 local immutable baseline；不接受 live state、mount、path、secret 或 template body。 |
| 当前可调用上限 | 检查 variant ref、每个 pin 的 slot/ref 形状、seed kind/placement、base ref 与 metadata；构造 `Command/CaptureAssemblyBaseline` context 后 B01 停止。 |
| 当前禁止 | 逐 pin/seed/base resolver、variant/snapshot read、`ComponentPinSet::assemble`、`SeedPlacementBinding::bind`、baseline factory、gap/trace/UoW/replay。 |

#### 调用图: `CaptureAssemblyBaseline` 当前合法停止流

```text
[logical API entry]
  | call static-only DTO validation
  v
[DefinitionAssemblyCoordinator.handle_capture_assembly_baseline]
  | call Step 8 name mapping: CaptureAssemblyBaseline
  | call ImageClockPort.now
  | call OperationMetadata::new
  | call ImageOperationContext::from_write
  v
[DDD-S9-B01 stop]
  | no canonical input carrier for ordered pins and seed bindings
  v
[fail-closed ImageProtocolError surface]
```

关键说明：

- DTO validation may reject duplicate input slot declarations or live-state categories by shape; it must not ask a resolver whether an external ref is usable.
- The static input set is not a build request: no intent, attempt, image, digest or registry operation occurs in this flow.
- B01/B02 are calibration blockers, not a persisted `ContractGap`; no `ContractGap::open` is allowed merely to report them.

```rust
// Reject local-shape violations: empty input collections where protocol requires them,
// duplicate slot declarations, or a live/mount/path/secret field masquerading as a static binding.
let operation_name = ImageOperationName(
    NonEmptyText::parse("CaptureAssemblyBaseline".to_owned())?,
);
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02 before resolver, UoW, object factory, or local persistence.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后目标对象 / named callable surface | 当前状态 |
|---|---|---|
| `variant_ref` / `mapping_snapshot_ref` | `get_variant_with_version` / `get_mapping_snapshot_with_version` and their exact relation check | 不可读。 |
| `component_pins` | per-item `ImageAssemblyReferenceResolverPort::inspect_component_for_assembly` → `ComponentPinSet::assemble` → `PinIntegrityGuard::check_pins` | 不可 resolver / factory。 |
| `seed_bindings` | per-item `inspect_seed_for_assembly` → `SeedPlacementBinding::bind` → `AssemblyCompletenessGuard::check_seed_bindings` | 不可 resolver / factory。 |
| `base_image_ref` | `inspect_base_image_for_assembly` → `AssemblyBaseline::capture` → `AssemblyCompletenessGuard::check_baseline` | 不可 resolver / factory。 |
| local baseline | `AssemblyBaseline::apply_completeness` → `save_baseline(..., Absent, uow)` | B01/B02 前不可到达。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前没有 UoW。重开时 baseline create 使用 `Absent`；若 flow 写入已有 variant / snapshot state，其 version只能来自 exact `Versioned<T>` load，且 resolver observation不构成 commit evidence。 |
| 错误映射 | Input shape 的 mutable selector、missing mandatory field、duplicate slot是 `ContractViolation` / `Missing`；owner ref unavailable/unknown只能在 future resolver path映射 `Blocked` / `Unavailable` / `Unknown`，不得当前写 negative baseline。 |
| 状态与副作用 | 当前零变化。未来 `BaselineCompleteness::Complete` 只表静态输入闭合，不启动 builder、不创造 candidate、不代表 runtime/member/container/live memory。 |
| 最小测试切口 | static-only validator rejects live seed/mutable selector; valid shape reaches B01; spy asserts no resolver, repo, UoW, ID, trace or projection call; no baseline ref is returned. |

#### `CaptureAssemblyBaselineFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| static/live 边界 | `pass` | 各 DTO 字段仅承接 static body-free refs；live state 一律入口拒绝。 |
| ref→factory→guard 映射 | `pass_as_reopen_mapping` | 每类 pin/seed/base都有 Step 7 named resolver 和 Step 6 named object/guard；当前不调用。 |
| transaction / replay 是否被伪造 | `pass_with_blocker` | B01/B02 前明确为零 transaction / replay。 |
| 下一条件 | `blocked` | 修复 B01/B02 后重审 resolver 与 UoW sequencing。 |

### 8.3 `ProposeVariantRevisionFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_propose_variant_revision(ImageCommandRequest<ProposeVariantRevisionRequest>)`；`DefinitionAssemblyCoordinator`。 |
| 目标 | 以一个既有 immutable baseline 为基础新建 variant revision，并在 local guards 后归纳 `Buildable` / `Invalid`；不创建 build intent、builder handoff 或 image digest。 |
| 当前可调用上限 | 检查 typed variant/baseline/prior-revision refs、safe derivation reason 与 metadata；构造 `Command/ProposeVariantRevision` context 后 B01 停止。 |
| 当前禁止 | variant/baseline/prior revision exact load、revision ID、`VariantRevision::propose`、validation、pointer/supersede update、repository write、UoW/replay。 |

#### 调用图: `ProposeVariantRevision` 当前合法停止流

```text
[logical API entry]
  | call typed-ref and SafeReason shape validation
  v
[DefinitionAssemblyCoordinator.handle_propose_variant_revision]
  | call Step 8 name mapping: ProposeVariantRevision
  | call ImageClockPort.now
  | call OperationMetadata::new
  | call ImageOperationContext::from_write
  v
[DDD-S9-B01 stop]
  | no canonical input carrier for baseline and optional prior revision
  v
[fail-closed ImageProtocolError surface]
```

关键说明：

- `prior_revision_ref=None` is an explicit protocol value, but its semantic validity cannot be established before local reads; no active-revision pointer is guessed.
- A local `Buildable` revision is only a later `RequestBuildIntent` precondition; it never proves build, digest, candidate or entry success.
- No HLD-era `DerivationRecordRef` is introduced: `SafeReason` remains the only supplied derivation explanation.

```rust
// Validate the exact typed refs and the SafeReason category/related-ref shape locally.
let operation_name = ImageOperationName(
    NonEmptyText::parse("ProposeVariantRevision".to_owned())?,
);
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01: do not canonicalize, reserve, load local objects, or create a revision.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后目标对象 / named callable surface | 当前状态 |
|---|---|---|
| `variant_ref` / `baseline_ref` | `get_variant_with_version` + `get_baseline_with_version`; verify same variant and complete baseline | 不可读。 |
| `derivation_reason` | `VariantRevision::propose(ImageLocalId, ..., SafeReason, UtcTimestamp)` | 仅 shape 可校验。 |
| new revision | `VariantRevision::validate(&baseline, &AssemblyCompletenessGuard, &PinIntegrityGuard)` → `save_revision(..., Absent, uow)` | 不可 factory/save。 |
| optional `prior_revision_ref` | `get_revision_with_version` → `prior.supersede(new_revision_ref, reason)` → versioned `save_revision` | `None` 不得被 current-pointer 补齐。 |
| variant pointer | loaded `ImageVariantDefinition::link_revision(new_revision_ref)` → versioned `save_variant` | B01/B02 前不可到达。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW。重开后 new revision uses `Absent`; loaded prior revision / variant use their exact versions; any save failure must roll back all proposed pointer/supersede changes. |
| 错误映射 | Invalid typed ref/reason is `ContractViolation`; B01 is current fail-closed error. Baseline incompleteness, relation conflict and stale owner inputs are only future post-read outcomes, not current persisted `Invalid` state. |
| 状态与副作用 | Current zero writes. Future guard can produce `Buildable` or `Invalid`; it cannot produce `BuildIntent`, external build action, trace/replay, or outbound until the reopened path passes its own design audit. |
| 最小测试切口 | self-referential prior ref rejected by local shape rule; valid request stops at B01; spy asserts no revision/family/variant repository access; future mapping test is explicitly deferred. |

#### `ProposeVariantRevisionFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| reason / optional-ref 语义 | `pass` | `None` 与 missing 不混同；不从 current pointer推导 prior。 |
| future state owner | `pass_as_reopen_mapping` | 仅 `VariantRevision::validate` 能归纳 buildability；没有 builder side effect。 |
| current write prohibition | `pass_with_blocker` | B01/B02 前没有 revision、pointer、trace、gap或replay mutation。 |
| 下一条件 | `blocked` | 等 canonical input 与 result identity 构造闭合后重审。 |

### 8.4 `RequestBuildIntentFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_request_build_intent(ImageCommandRequest<RequestBuildIntentRequest>)`；`BuildIntentCoordinator`。 |
| 目标 | 把已持久化的 `Buildable` revision 与一个 body-free command/nightly trigger 登记为本地 intent；不等 builder handoff、attempt、image、digest 或发布。 |
| 当前可调用上限 | 校验 revision typed ref、trigger kind/ref 的本地形状、actor 与 metadata；映射 `Command/RequestBuildIntent` context 后在 B01 停止。`VerifiedInboundEvent` 在 `MI-UP-005` 下入口即不可构造。 |
| 当前禁止 | revision read、intent/snapshot/attempt ID、`BuildIntent::request`、`BuildInputSnapshot::capture`、`BuildAttempt::start`、builder handoff、UoW、replay、gap/trace。 |

#### 调用图: `RequestBuildIntent` 当前合法停止流

```text
[logical API / bounded job facade]
  | validate revision_ref, trigger kind/ref, actor and metadata shape
  | reject VerifiedInboundEvent at current conditional-event boundary
  v
[BuildIntentCoordinator.handle_request_build_intent]
  | map Step 8 name: RequestBuildIntent
  | clock.now -> OperationMetadata::new -> ImageOperationContext::from_write
  v
[DDD-S9-B01 stop]
  | canonical request carrier / mapper is absent
  v
[fail-closed protocol error; zero local write]
```

关键说明：

- `NightlySweep` is only a trigger kind plus caller-provided body-free ref; it is not a scheduler tick, date, run identifier or evidence of execution.
- The current stop happens before reading whether the revision is `Buildable`; it therefore cannot return a persisted intent, gap, snapshot or duplicate replay.
- `VerifiedInboundEvent` does not become a command fallback: its future source must first close the conditional inbound contract and reopen Steps 7–9.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("RequestBuildIntent".to_owned())?,
);
// Validate revision_ref and ImageBuildTriggerInput shape. In particular, reject
// VerifiedInboundEvent while MI-UP-005 remains pending; do not synthesize a trigger_ref.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02. No revision read, UoW, reservation, intent factory,
// snapshot/attempt creation, builder call, trace, gap, or result persistence is legal.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| `revision_ref` | `DefinitionAssemblyRepositoryPort::get_revision_with_version` → verify `Buildable` → `BuildIntent::request` | 仅 typed shape；不可 read/factory。 |
| `trigger.kind/ref` | application trigger guard; command/nightly may supply a body-free ref, while verified-event requires closed inbound authority | 当前仅形状；不可 gap/save。 |
| new intent | `ImageIdGeneratorPort` → `BuildIntent::request` → `BuildCandidateRepositoryPort::save_intent(Absent, uow)` | B01/B02 前不可到达。 |
| subsequent snapshot / attempt | only a separately reopened build-handoff path may call `BuildInputSnapshot::capture` / `BuildAttempt::start` / `BuilderRegistryPort::submit_handoff` | 不属于本 command 的当前路径。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW。重开后 existing revision only uses its `Versioned` exact version if changed; new intent/snapshot/attempt use `Absent`; any result-identity failure rolls back the entire staged local chain. |
| 错误映射 | blank/wrong typed fields are `Missing` / `ContractViolation`; verified-event is current `Blocked` / `Unavailable` boundary. B01/B02 are unpersisted fail-closed errors, not a `ContractGap`. |
| 状态与副作用 | 当前零状态、trace、gap、freshness、replay。未来 `BuildIntent::Accepted` is local intent only and never builder acceptance, image identity, candidate or availability. |
| 最小测试切口 | malformed trigger/ref rejected before context; valid command/nightly request stops at B01; verified-event request rejected without a fallback; spies observe no revision/build repository, UoW, idempotency or builder call. |

#### `RequestBuildIntentFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| trigger / intent boundary | `pass` | command/nightly input remains distinct from inbound event and builder execution. |
| future object chain | `pass_as_reopen_mapping` | revision → intent is named; snapshot/attempt are not smuggled into current command. |
| current mutation safety | `pass_with_blocker` | B01/B02 keep all write ports and external seams unreachable. |
| 下一条件 | `blocked` | define concrete canonical input and result identity, then reopen the flow. |

### 8.5 `RecordBuildOutcomeFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_record_build_outcome(ImageCommandRequest<RecordBuildOutcomeRequest>)`；`BuildIntentCoordinator`。 |
| 目标 | 将已被受控 mapping 成 body-free observation 的 outcome 归纳到 existing attempt；只有完整 output identity 和 formation guard 才能形成 local candidate。 |
| 当前可调用上限 | 校验 attempt ref、outcome result-kind 与 optional-field 配对、safe reason、actor/metadata；构造 `Command/RecordBuildOutcome` context 后 B01 停止。 |
| 当前禁止 | attempt/snapshot/outcome/candidate read、`BuilderRegistryPort::inspect_outcome`、`BuildOutcomeConclusion::conclude`、`CandidateImage::form`、attempt transition、UoW/replay/trace。 |

#### 调用图: `RecordBuildOutcome` 当前合法停止流

```text
[controlled API integration mapping]
  | validate body-free attempt/outcome shape
  | reject ACK, HTTP status, tag, cache or raw digest as outcome input
  v
[BuildIntentCoordinator.handle_record_build_outcome]
  | map Step 8 name: RecordBuildOutcome
  | clock.now -> metadata -> write operation context
  v
[DDD-S9-B01 stop]
  | no canonical carrier for ordered outcome optional semantics
  v
[fail-closed protocol error; no adapter observation or local mutation]
```

关键说明：

- This handler consumes only an already-safe DTO mapping; it does not receive provider callback body and must not ask the adapter to reconstruct one.
- `Succeeded` lacking either immutable image ref or verified output identity is a shape/contract failure, never a prompt to infer a digest.
- An `Unknown` or `Unavailable` observation would be a future local attempt conclusion, not an automatic retry or candidate shortcut.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("RecordBuildOutcome".to_owned())?,
);
// Validate result-kind / Option pairing and safe, body-free refs locally.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02: do not inspect the builder, load an attempt, form outcome/candidate,
// or persist an attempt transition/result.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| `attempt_ref` | `BuildCandidateRepositoryPort::get_attempt_with_version` + exact snapshot/outcome relation reads | 不可 read。 |
| `outcome` | optional-pair guard → `BuildOutcomeConclusion::conclude` → `attempt.record_outcome` | 仅 shape；不可 factory/member。 |
| successful refs | load complete snapshot → `CandidateFormationGuard::check` → `CandidateImage::form` | Q-MI-003 remains external-positive blocker; B01/B02 prevent all calls now. |
| local saves | `save_outcome(Absent)` + versioned `save_attempt` + optional `save_candidate(Absent)` + append trace/result/replay | 不可开始 UoW。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW。重开时 attempt is saved with exact loaded version; new outcome/candidate use `Absent`; any mismatch, candidate guard failure or result completion failure rolls back every staged change. |
| 错误映射 | malformed outcome is `Missing`/`ContractViolation`; B01/B02 are fail-closed before adapter or repository. Future `Unknown`/`Unavailable` must stay explicit, and duplicate must replay rather than inspect again. |
| 状态与副作用 | 当前零写。未来 `Succeeded` attempt and `Formed` candidate remain separate; no Artifact, supply, digest calculation, registry publish or outbound event follows. |
| 最小测试切口 | invalid result-kind/Option pairs fail before context; valid DTO stops at B01; spies assert no builder/repository/UoW; future guard test must reject ACK/tag-only candidate formation. |

#### `RecordBuildOutcomeFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| observation / candidate separation | `pass` | outcome is not a candidate and safe ref is not a computed digest. |
| future UoW mapping | `pass_as_reopen_mapping` | version source and factory sequence are named without claiming callability. |
| pending adapter boundary | `pass_with_blocker` | Q-MI-003 and B01/B02 prohibit a current positive path. |
| 下一条件 | `blocked` | reopen after canonical/result construction and owner seam review. |

### 8.6 `EvaluateCandidateEligibilityFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_evaluate_candidate_eligibility(ImageCommandRequest<EvaluateCandidateEligibilityRequest>)`；`QualificationCoordinator`。 |
| 目标 | 将 candidate、complete snapshot、body-free provenance source 与 authority/gate safe inputs纳入本地 qualification context；不拥有 gate inventory、evidence body 或 supply truth。 |
| 当前可调用上限 | 校验 candidate/snapshot/execution/output typed refs、source/gate collection去重与 optional existing-context shape；构造 `Command/EvaluateCandidateEligibility` context 后 B01 停止。 |
| 当前禁止 | candidate/snapshot/context exact read、qualification boundary、provenance/gate/eligibility factory、gap/UoW/trace/replay。 |

#### 调用图: `EvaluateCandidateEligibility` 当前合法停止流

```text
[logical API / bounded reevaluation facade]
  | validate body-free ref collections, explicit optional context refs
  | reject gate/evidence body, inventory, policy text and default-pass interpretation
  v
[QualificationCoordinator.handle_evaluate_candidate_eligibility]
  | map Step 8 name: EvaluateCandidateEligibility
  | clock.now -> metadata -> write operation context
  v
[DDD-S9-B01 stop]
  | no canonical carrier for sorted source/conclusion collections
  v
[fail-closed protocol error; no gate boundary or local qualification write]
```

关键说明：

- `gate_authority_ref=None`, `applicable_gate_set_ref=None`, or an empty conclusion collection is not a pass; it can only become a future Pending/Blocked/Unknown local outcome after the reopened write path.
- Existing provenance/evaluation refs are explicit replacement contexts; the handler must not infer them from trace/history.
- `Eligible` would remain image-local and cannot publish, hand off Artifact, or resolve consumer state.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("EvaluateCandidateEligibility".to_owned())?,
);
// Validate typed candidate/snapshot/output refs; sort/deduplicate only for shape checking.
// Do not read a gate inventory or evidence body.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02: no UoW, candidate/qualification reads, boundary assessment,
// gap opening, provenance/gate/eligibility factory, trace or replay save.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| candidate/snapshot/execution/output refs | exact `get_candidate_with_version` / `get_snapshot_with_version`; relation and formation guards | 不可 read。 |
| sources / existing provenance | `ProvenanceBinding::bind` or exact load/supersede → `save_provenance` | 仅 collection shape；不可 bind/save。 |
| authority/gate refs and conclusions | `QualificationBoundaryPort::assess_gate_boundary` / evidence assessment → `GateEvaluation::open` / `record_conclusion` | Q-MI-004 only non-positive boundary currently; B01/B02 stop earlier. |
| eligibility | `EligibilityDecision::decide` → `decision.evaluate(candidate, provenance, gates)` → `save_eligibility` | 不可 factory/save。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW。重开后 new provenance/gate/decision contexts use `Absent`; explicit existing contexts use exact versions; any cross-candidate mismatch or result-save failure rolls back all staged local contexts. |
| 错误映射 | invalid ref/collection shape is `ContractViolation`; B01/B02 is current fail-closed. Q-MI-004 later maps only to blocked/unknown/unavailable/gap unless formal owner input is re-reviewed. |
| 状态与副作用 | 当前零 mutation. Future `Complete` provenance, `Passed` gate and `Eligible` decision are three distinct local states; none establishes Artifact acceptance, entry availability or readiness. |
| 最小测试切口 | duplicate source/conclusion refs rejected locally; valid request stops at B01; spy asserts no QualificationBoundary/qualification repository/UoW; a future test must prove empty/pending authority cannot map to pass. |

#### `EvaluateCandidateEligibilityFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| authority truth boundary | `pass` | only typed refs/safe conclusions are accepted; inventory/body remain external. |
| future context sequencing | `pass_as_reopen_mapping` | provenance → gate → eligibility is explicit and cross-candidate guarded. |
| current positive prohibition | `pass_with_blocker` | B01/B02 and Q-MI-004 keep all qualifying calls unreachable. |
| 下一条件 | `blocked` | reopen concrete write carriers and qualification owner contracts before implementation. |

### 8.7 `RecordArtifactHandoffFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_record_artifact_handoff(ImageCommandRequest<RecordArtifactHandoffRequest>)`；`QualificationCoordinator`。 |
| 目标 | 将 eligible candidate 对 Artifact owner 的本地 handoff observation保持在 Pending/Gap lane；不创建 Artifact、lineage、consumable ref、acceptance 或 delivery。 |
| 当前可调用上限 | 校验 candidate/eligibility refs 与 optional Artifact/resolution ref 形状；构造 `Command/RecordArtifactHandoff` context 后 B01 停止。 |
| 当前禁止 | candidate/eligibility read、Artifact boundary assessment、`ArtifactHandoffRecord::open/record_gap`、`ContractGap::open`、UoW/replay/trace。 |

#### 调用图: `RecordArtifactHandoff` 当前合法停止流

```text
[logical API / reconciliation facade]
  | validate local refs and explicit None/Some Artifact fields
  | reject any attempt to treat image ref, tag, receipt or config as Artifact ref
  v
[QualificationCoordinator.handle_record_artifact_handoff]
  | map Step 8 name: RecordArtifactHandoff
  | clock.now -> metadata -> write operation context
  v
[DDD-S9-B01 stop]
  | no canonical carrier for the optional Artifact/resolution pair
  v
[fail-closed protocol error; no Artifact seam call or local gap write]
```

关键说明：

- `Some(artifact_ref)` is still non-positive at the current boundary because `MI-UP-007` has not closed its schema and acceptance conditions.
- The design-calibration blocker itself is not a persisted handoff or contract gap; no object can be opened solely to report B01/B02.
- A future `Accepted` path is explicitly excluded until formal Artifact schema and owner resolution are re-reviewed.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("RecordArtifactHandoff".to_owned())?,
);
// Validate candidate/eligibility exact kinds and explicit optional Artifact fields.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02: do not assess Artifact boundary, open a handoff/gap,
// save local state, append trace, or complete replay.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| `candidate_ref` / `eligibility_ref` | exact candidate + `QualificationRepositoryPort::get_eligibility_with_version`; verify Formed/Eligible relation | 不可 read。 |
| optional Artifact refs | `QualificationBoundaryPort::assess_artifact_handoff_boundary` only | MI-UP-007 gives non-positive assessment only; current call unreachable. |
| local observation | ID → `ArtifactHandoffRecord::open` → `ContractGap::open` → `record_gap` → versioned saves | B01/B02 前不可 factory/save。 |
| accepted state | future only `bind_artifact_ref(ArtifactConsumableRef, ContractResolutionRef)` after contract re-open | 当前严禁调用。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW. Future Pending/Gap local record and gap are new `Absent` objects; future updates use exact version; all local writes rollback together if result/replay completion fails. |
| 错误映射 | malformed refs/optional relation=`ContractViolation`; B01/B02 current fail-closed. MI-UP-007 later remains `Blocked`/`Unavailable`/`Gap`, never implicit accepted. |
| 状态与副作用 | 当前零 changes. Future records may be Pending/Gap only; no Artifact ref mint, lineage, storage locator, receipt, outbound message or owner mutation. |
| 最小测试切口 | malformed optional pair rejected; valid request stops at B01; spies observe no qualification boundary/repository/UoW; future adapter test rejects a positive acceptance result under pending contract. |

#### `RecordArtifactHandoffFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| Artifact ownership | `pass` | local handoff observation remains separate from Artifact truth. |
| future negative lane | `pass_as_reopen_mapping` | Pending/Gap sequence is named, Accepted remains unreachable. |
| current write safety | `pass_with_blocker` | no gap/handoff result is fabricated before B01/B02 repair. |
| 下一条件 | `blocked` | MI-UP-007 plus B01/B02 require a reopened flow review. |

### 8.8 `PublishInstantiableEntryFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_publish_instantiable_entry(ImageCommandRequest<PublishInstantiableEntryRequest>)`；`AvailabilityCoordinator`。 |
| 目标 | 为 candidate/provenance/eligibility/image immutable chain 创建 local pinned entry 与 local Publish history；不触及 registry、Artifact、Member Service、container 或 runtime。 |
| 当前可调用上限 | 校验 variant/candidate/qualification/image/prior-entry typed refs与 metadata；构造 `Command/PublishInstantiableEntry` context 后 B01 停止。 |
| 当前禁止 | candidate/qualification/entry/current-facts read、entry pin/transition guard、entry/transition factory、UoW/replay/trace；不得调用 Member Service seam。 |

#### 调用图: `PublishInstantiableEntry` 当前合法停止流

```text
[logical API entry]
  | validate explicit local/external typed refs and prior_entry None semantics
  | reject mutable image selector or consumer/container fields
  v
[AvailabilityCoordinator.handle_publish_instantiable_entry]
  | map Step 8 name: PublishInstantiableEntry
  | clock.now -> metadata -> write operation context
  v
[DDD-S9-B01 stop]
  | no canonical carrier for the pinned-chain request
  v
[fail-closed protocol error; no local entry/history or consumer call]
```

关键说明：

- “Publish” is local supply history only. It does not publish to a registry or notify a consumer, even after the write path is later reopened.
- `prior_entry_ref=None` means first local publish intent, not permission to silently replace an existing current entry.
- `ImmutableImageRef` remains owner-supplied identity; no raw digest or tag is calculated or normalized here.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("PublishInstantiableEntry".to_owned())?,
);
// Validate all typed refs, immutable-image kind, and explicit prior-entry optionality.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02: no supply/qualification/build read, pin guard, entry/transition
// factory, current-facts lookup, Member Service seam, UoW, trace, or stored result.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| variant/candidate/eligibility/provenance/image refs | exact local reads → `EntryPinGuard::check_entry` | 不可 read/guard。 |
| prior entry | `find_current_entry_by_variant_with_version` / exact prior read → conflict check | `None` 不得当前推断。 |
| entry + Publish transition | IDs → `InstantiableEntry::create` + `AvailabilityTransition::propose(Publish)` → transition guard/commit → `save_entry` + `append_availability_transition` | B01/B02 前不可到达。 |
| consumer relation | never part of publish command; a later separate seam may open local consumer gap only | 当前不得 call MemberService port。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW. Future new entry/transition use `Absent`; any prior/current entry uses exact version; entry and append-only transition must commit atomically with result/replay or roll back. |
| 错误映射 | malformed/mutable image ref=`ContractViolation`; B01/B02 current stop. Later missing chain / conflicting current entry are `Missing`/`Blocked`/`Conflict`, never a fallback to registry or consumer state. |
| 状态与副作用 | 当前零 write. Future `Available` means only a local pinned supply entry; no Member Service confirmation, container lifecycle or readiness follows. |
| 最小测试切口 | mutable image selector rejected before context; valid request stops at B01; spies observe no build/qualification/supply/UoW/consumer calls; future test proves publish does not emit outbound or consumer action. |

#### `PublishInstantiableEntryFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| pinned-chain boundary | `pass` | all local prerequisites are explicit and consumer status is excluded. |
| local publish semantics | `pass_as_reopen_mapping` | entry and append-only history are paired without external publication. |
| current write prohibition | `pass_with_blocker` | B01/B02 prevent entry/history construction. |
| 下一条件 | `blocked` | repair write carriers before reopening entry/transition sequencing. |

### 8.9 `TransitionAvailabilityFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_transition_availability(ImageCommandRequest<TransitionAvailabilityRequest>)`；`AvailabilityCoordinator`。 |
| 目标 | 对 `Publish` / `Replace` / `Rollback` / `Retire` 追加一条 local availability history；不将它解释为任何外部生命周期变化。 |
| 当前可调用上限 | 校验 variant、action-specific candidate/prior/resulting refs、reason、metadata；构造 `Command/TransitionAvailability` context 后 B01 停止。 |
| 当前禁止 | current facts/entry exact reads、transition factory/guard/commit、entry save、UoW/replay/trace。 |

#### 调用图: `TransitionAvailability` 当前合法停止流

```text
[logical API / internal facade]
  | validate action-specific Option semantics
  | Publish/Replace/Rollback/Retire remain distinct; do not infer targets from history
  v
[AvailabilityCoordinator.handle_transition_availability]
  | map Step 8 name: TransitionAvailability
  | clock.now -> metadata -> write operation context
  v
[DDD-S9-B01 stop]
  | no canonical carrier for action and exact optional refs
  v
[fail-closed protocol error; no history append or entry mutation]
```

关键说明：

- Current facts are local repository facts only. They must never be reconstructed from newest history, consumer confirmation, registry state or container health.
- A transition is append-only; it cannot overwrite an old transition, even if a future guard rejects the new request.
- The command does not construct a missing resulting entry; publishing a new entry is a separate command/factory path.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("TransitionAvailability".to_owned())?,
);
// Validate action-kind-specific refs and explicit None semantics before context construction.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02: no current-facts lookup, entry read, transition proposal/guard,
// append, entry update, UoW, replay or trace.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| `variant_ref` / action refs | `load_current_availability_facts` + exact entry reads as action needs | 不可 read。 |
| `transition_kind` / optional refs | `AvailabilityTransition::propose` → `AvailabilityTransitionGuard` → commit/reject member | 仅 shape；不可 factory/guard。 |
| entry linkage | versioned `save_entry` only for legal Replace/Rollback/Retire effect; `append_availability_transition(Absent)` always appends | B01/B02 前不可 save。 |
| history/result | append trace + result/replay only after staged local history/entry is valid | 当前不可产生。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW. Reopened flow loads local current facts and exact entries before guard; entries use exact versions, new history uses `Absent`, and all local effects rollback on conflict/result failure. |
| 错误映射 | invalid action/ref pairing is `ContractViolation`; B01/B02 current stop. Future stale facts/version mismatch yields `Blocked`/`Conflict`, never last-write-wins. |
| 状态与副作用 | 当前零 write. Future `Committed` is local history only; it does not publish, notify, launch, retire a container or close a consumer gap. |
| 最小测试切口 | invalid Retire-with-resulting-entry rejected; valid action stops at B01; spies observe no current-facts/repository/UoW call; future test proves append-only history and no external seam. |

#### `TransitionAvailabilityFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| action-specific semantics | `pass` | four actions retain independent required-ref rules. |
| future append/version mapping | `pass_as_reopen_mapping` | current facts, guard, entry save and append are ordered. |
| current no-write invariant | `pass_with_blocker` | no local transition is produced before B01/B02 resolution. |
| 下一条件 | `blocked` | reopen after concrete canonical/result carriers are defined. |

### 8.10 `RollbackOrRetireEntryFlow`

| 项目 | 当前收敛 |
|---|---|
| 协议 / 入口 | `handle_rollback_or_retire_entry(ImageCommandRequest<RollbackOrRetireEntryRequest>)`；`AvailabilityCoordinator`。 |
| 目标 | 对一个 explicit local current entry 执行 rollback 或 retire，保留 immutable chain 和 append-only history；不删除任何对象，也不调用 consumer/runtime/registry。 |
| 当前可调用上限 | 校验 entry ref、仅允许 Rollback/Retire、resulting-entry optionality、safe reason、metadata；构造 `Command/RollbackOrRetireEntry` context 后 B01 停止。 |
| 当前禁止 | entry/current facts/target read、transition factory/guard、entry retire/supersede、history append、UoW/replay/trace。 |

#### 调用图: `RollbackOrRetireEntry` 当前合法停止流

```text
[logical API entry]
  | validate Rollback/Retire-only action and target/reason shape
  | reject Publish/Replace and any tag/latest fallback
  v
[AvailabilityCoordinator.handle_rollback_or_retire_entry]
  | map Step 8 name: RollbackOrRetireEntry
  | clock.now -> metadata -> write operation context
  v
[DDD-S9-B01 stop]
  | no canonical carrier for rollback/retire request
  v
[fail-closed protocol error; zero local history/entry mutation]
```

关键说明：

- Rollback points to an existing verified immutable entry through a new transition; it does not revive or rewrite an old transition.
- Retire retains the entry and all pin/provenance history. There is no delete, registry action, container action, or Member Service callback.
- B01/B02 block the write path before determining whether the named entry is current; no “not current” fact is fabricated.

```rust
let operation_name = ImageOperationName(
    NonEmptyText::parse("RollbackOrRetireEntry".to_owned())?,
);
// Validate entry_ref, allowed transition kind, explicit target Option, and SafeReason shape.
let metadata = OperationMetadata::new(
    request.metadata.idempotency_key,
    request.metadata.correlation_ref,
    request.actor.map(|actor| actor.actor_ref),
    request.metadata.causation_ref,
    clock.now(),
);
let _context = ImageOperationContext::from_write(
    ImageOperationChannel::Command,
    operation_name,
    metadata,
)?;

// STOP DDD-S9-B01/B02: no entry/current-facts load, target validation, transition proposal,
// retire/supersede member, append/save, external call, trace or replay.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| DTO 字段 | 重开后对象 / port 顺序 | 当前状态 |
|---|---|---|
| `entry_ref` | `get_entry_with_version` + `load_current_availability_facts` | 不可 read。 |
| rollback target / reason | exact target entry read → immutable pin/variant guard → `AvailabilityTransition::propose(Rollback)` | 仅 shape；不可 guard/factory。 |
| retire | `AvailabilityTransition::propose(Retire)` → strict guard → `entry.retire(transition_ref, reason)` | 不可 factory/member。 |
| local persistence | `append_availability_transition(Absent)` + versioned entry/current target saves + trace/result/replay | B01/B02 前不可 UoW。 |

| 审计面 | 当前结论 |
|---|---|
| 事务与版本 | 当前无 UoW. Reopened rollback/retire reads every existing entry/current fact before mutation; new history is `Absent`, existing entries use exact versions, and all staged state/result writes are one rollback unit. |
| 错误映射 | invalid action/Option/reason is `ContractViolation`; B01/B02 current stop. Future non-current or unverifiable target remains `InvalidTransition`/`Blocked`/`Unavailable`, never tag/latest substitution. |
| 状态与副作用 | 当前零 write. Future rollback changes local pointer/history only; retire becomes local `Retired`; neither implies external rollback/retire, consumer confirmation or readiness. |
| 最小测试切口 | Publish/Replace rejected locally; Rollback without target and Retire with target rejected; valid request stops at B01; spies observe no supply/UoW/external call. |

#### `RollbackOrRetireEntryFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| rollback / retire distinction | `pass` | target and reason semantics remain action-specific. |
| immutable/history preservation | `pass_as_reopen_mapping` | future chain uses a new transition and no deletion. |
| current boundary | `pass_with_blocker` | B01/B02 prevent a fabricated local rollback/retire fact. |
| 下一条件 | `blocked` | reopen after write-carrier and result-identity closure. |

### 8.11 Command batch 9.1 停审汇总

| Command flow | 当前 callable result | future mapping | outbound | 停审结论 |
|---|---|---|---|---|
| Define / Capture / Propose | validation → context → B01 | definition/baseline/revision local truth | `NoneAuthorized` | `pass_with_blocker` |
| Request / Record | validation → context → B01 | intent/outcome/candidate local truth | `NoneAuthorized` | `pass_with_blocker` |
| Evaluate / Artifact | validation → context → B01 | qualification or Pending/Gap local truth | `NoneAuthorized` | `pass_with_blocker` |
| Publish / Transition / Rollback | validation → context → B01 | local supply entry/history only | `NoneAuthorized` | `pass_with_blocker` |

十个 command 的 B01/B02 处置一致：没有 concrete canonical input 和合法 result identity，就没有 UoW、reservation、duplicate replay、repository/resolver/boundary 调用、factory/member、trace/gap/projection/result write 或 outbound。此一致性不是 “所有 command 等价”，每一条的 DTO、future object chain、state上限和测试切口仍在各节独立保留。

## 9. Query flow batch 9.2：逐查询只读处理流

### 9.0 本批共同 no-write 判定

十条 Query 均可走完整只读链，但每一条只可使用 Step 7 已存在的 exact/page/既有 projection read surface。任何 Query 都不得构造 write metadata、开启 UoW、canonicalize、reserve、写 replay、append trace、创建 gap/marker/view、refresh source、调用 builder/qualification/Member Service adapter，或把 `RequireFresh` 静默降级为 direct truth。`Visible` 只表示 local read reachability；若必须依赖尚未闭口的 owner authorization 才能判定可见性，返回 `Unavailable`，不伪造 `NotVisible`。

### 9.1 `GetImageVariantDefinitionFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_image_variant_definition(ImageQueryRequest<GetImageVariantDefinitionRequest>)`；`query_service`。 |
| read path | `variant_ref` → `DefinitionAssemblyRepositoryPort::get_variant_with_version` → optional exact linked revision read → domain-to-view mapper。 |
| projection / freshness | direct truth has `freshness=None`; `RequireFresh` only accepts an already-existing compatible projection marker and otherwise returns `Unavailable`; `InspectMarker` is unavailable because this query has no independent marker-only body. |

#### 调用图: `GetImageVariantDefinition` 只读流

```text
[logical query entry]
  | validate exact variant_ref and ImageQueryContext
  | validate local read scope / freshness preference
  v
[query_service]
  | DefinitionAssemblyRepositoryPort.get_variant_with_version(variant_ref)
  | if linked -> get_revision_with_version(current_revision_ref)
  v
[view mapper]
  | ImageVariantDefinitionView + Empty/Gap/Unavailable surface
  v
[ImageQueryResponse]
```

```rust
let variant = definitions.get_variant_with_version(&request.body.variant_ref).await?;
let response = match variant {
    None if scope_is_confirmed(&request.context) => ImageQueryResponse::empty(),
    None => ImageQueryResponse::unavailable(/* existing safe surface mapping */),
    Some(loaded) => map_variant_and_exact_linked_revision_read_only(loaded, &request.context).await?,
};
// No UoW, reserve, trace, gap, projection write, refresh or external adapter call.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| exact variant missing + visible scope | `Visible + Empty`。 |
| linked revision missing / relation broken | definition body may remain; `Gap + Partial` or `Unavailable` with no guessed pointer. |
| `RequireFresh` without existing Fresh compatible view | `Unavailable`; do not rebuild or downgrade. |
| repository failure / unresolved visibility | `Unavailable`; no fallback lookup by label/mapping. |

最小测试切口：wrong-kind ref rejects; exact missing maps Empty only with confirmed scope; broken linked revision maps Gap; RequireFresh does not rebuild; spies assert no write/UoW/adapter calls。

#### `GetImageVariantDefinitionFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| exact truth source | `pass` | variant and linked revision use only typed exact reads. |
| freshness/no-write | `pass` | direct truth never claims Fresh and never creates projection state. |
| 下一条件 | `pass` | no write-path blocker applies to this read flow. |

### 9.2 `GetAssemblyDerivationFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_assembly_derivation(ImageQueryRequest<GetAssemblyDerivationRequest>)`；`query_service`。 |
| read path | exact revision → exact `baseline_ref` → static component/seed/base fields → safe view mapper; no resolver or owner body read. |
| freshness | direct derivation truth defaults to `None`; a requested existing projection may expose only an existing marker; no `RequireFresh` fallback or rebuild. |

#### 调用图: `GetAssemblyDerivation` 只读流

```text
[query entry]
  | validate revision_ref, context and preference
  v
[DefinitionAssemblyRepositoryPort]
  | get_revision_with_version(revision_ref)
  | get_baseline_with_version(revision.baseline_ref)
  v
[static-only mapper]
  | pins / seed bindings / base ref / safe reason
  v
[Complete | Partial | Gap | Empty | Unavailable response]
```

```rust
let revision = definitions.get_revision_with_version(&request.body.revision_ref).await?;
let response = map_revision_then_exact_baseline_read_only(revision, &request.context).await?;
// Never inspect mapping/component/seed/base resolver, never refresh snapshot, never write.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| revision absent + visible scope | `Empty`。 |
| baseline absent or cross-variant | `Gap + Partial`; do not take latest baseline/current pointer. |
| incomplete/conflicting static binding | return existing safe fields with `Gap`/`Stale`; no owner-body retry. |
| owner/static availability needed but not locally readable | `Unavailable`; no resolver call. |

最小测试切口：missing revision=Empty; missing baseline=Gap; live/path/secret never appears in view; RequireFresh does not launch rebuild; no resolver/UoW/write calls。

#### `GetAssemblyDerivationFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| static/live boundary | `pass` | response is refs/categories/states only. |
| exact relation | `pass` | revision baseline ref is the sole lookup source. |
| 下一条件 | `pass` | read-only flow is complete. |

### 9.3 `GetBuildTraceFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_build_trace(ImageQueryRequest<GetBuildTraceRequest>)`；`query_service`。 |
| read path | selector=`Intent` uses exact intent + attempt history; selector=`Variant` uses persisted revision/intents/attempt relations in repository order; optional outcome/candidate exact lookup. |
| freshness | direct trace aggregation uses `None`; an existing BuildTrace projection can be consulted only as marker/read surface; query never calls `BuilderRegistryPort::inspect_outcome`. |

#### 调用图: `GetBuildTrace` 只读流

```text
[query entry]
  | validate selector kind and context
  v
[BuildCandidate / Definition reads]
  | Intent: get intent -> list attempts
  | Variant: list persisted revisions -> list intents -> attempts
  | exact outcome / candidate lookup only when linked
  v
[trace aggregation mapper]
  | preserve Failed / Unknown history and selector identity
  v
[page-less trace response]
```

```rust
let chains = load_persisted_build_chains_by_exact_selector(&request.body.selector).await?;
let response = map_build_trace_read_only(chains, &request.context)?;
// No builder/registry inspection, retry, outcome creation, candidate formation or write side effect.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| no persisted chain + visible selector | `Empty`。 |
| attempt/outcome/candidate relation broken | `Gap + Partial`; retain safe rows and do not fabricate a candidate. |
| `Unknown` attempt | included as `Unknown`, never hidden or retried. |
| freshness requested without existing Fresh view | `Unavailable`; no rebuild. |

最小测试切口：Intent and Variant selectors do not cross-infer; unknown attempt remains visible; broken outcome relation=Gap; spies observe no builder/UoW/replay/trace append。

#### `GetBuildTraceFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| selector / history isolation | `pass` | persisted chain only, no adapter recomputation. |
| degraded truth | `pass` | Partial/Gap preserves safe history. |
| 下一条件 | `pass` | no mutation surface is introduced. |

### 9.4 `GetProvenanceAndEligibilityFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_provenance_and_eligibility(ImageQueryRequest<GetProvenanceAndEligibilityRequest>)`；`query_service`。 |
| read path | exact candidate → persisted provenance/evaluation/eligibility relation reads → state/ref/reason mapper. |
| freshness | no independent projection body is created; direct truth uses `None`, and `RequireFresh` without an existing compatible Fresh view returns `Unavailable`. |

#### 调用图: `GetProvenanceAndEligibility` 只读流

```text
[query entry]
  | validate candidate_ref / read context
  v
[BuildCandidate + Qualification repositories]
  | get_candidate_with_version
  | exact/history relation reads for provenance, gate evaluation, eligibility
  v
[qualification view mapper]
  | preserve distinct provenance / gate / eligibility states
  v
[Complete | Partial | Gap | Empty | Unavailable]
```

```rust
let candidate = builds.get_candidate_with_version(&request.body.candidate_ref).await?;
let response = map_persisted_qualification_chain_read_only(candidate, &request.context).await?;
// No assess_gate_boundary, evidence lookup, reevaluation, UoW, result or replay call.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| candidate absent + visible scope | `Empty`。 |
| candidate present but one local qualification link absent | `Gap + Partial` or safe empty body; do not select another history item. |
| owner gate/evidence not readable | `Unavailable`/`Gap`; no external assessment. |
| non-positive lifecycle | map actual Pending/Blocked/Ineligible etc.; never infer supply/Artifact result. |

最小测试切口：candidate without chain=Gap; conflicting relation does not choose a history row; eligibility view omits entry/consumer state; no qualification boundary/UoW/write invocation。

#### `GetProvenanceAndEligibilityFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| qualification truth ownership | `pass` | only committed local refs/states are read. |
| no external re-evaluation | `pass` | Q-MI-004 remains visible, not queried around. |
| 下一条件 | `pass` | read flow is closed. |

### 9.5 `ResolveInstantiableEntryFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_resolve_instantiable_entry(ImageQueryRequest<ResolveInstantiableEntryRequest>)`；`query_service` / availability read facade。 |
| read path | exact variant → `SupplyEntryRepositoryPort::find_current_entry_by_variant_with_version` → bounded local consumer-gap read / existing projection marker only. |
| visibility / consumer | local `Available` entry is a narrow supply fact. A pending/absent consumer contract is gap-visible; query does not call `MemberServiceSupplyPort`, mint a gap, or return positive consumer resolution. |

#### 调用图: `ResolveInstantiableEntry` 只读流

```text
[query entry]
  | validate variant_ref, optional consumer contract ref and context
  v
[SupplyEntryRepositoryPort]
  | find_current_entry_by_variant_with_version
  | list_consumer_handoff_gaps(Some(entry_ref), bounded internal read) when entry exists
  v
[resolution mapper]
  | local entry + existing consumer gap + safe disposition
  v
[Entry resolution response]
```

```rust
let entry = supply.find_current_entry_by_variant_with_version(&request.body.variant_ref).await?;
let response = map_existing_entry_and_consumer_gap_read_only(entry, &request.body.consumer, &request.context).await?;
// Do not call MemberServiceSupplyPort; do not open/resolve/stale a gap; do not write.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| current entry absent + visible scope | `Empty`。 |
| entry exists + existing Open/Stale consumer gap | entry can be shown, `status=Gap`, consumer ref remains visible. |
| consumer contract pending but no existing gap | `Gap`/`Unavailable` marker only; query must not mint `ConsumerHandoffGap`. |
| `RequireFresh` lacks existing Fresh supply marker | `Unavailable`; no rebuild. |

最小测试切口：local entry does not yield consumer confirmation; missing gap is not created; entry absent=Empty; pending consumer contract yields Gap/Unavailable; spies observe no Member Service/UoW/write call。

#### `ResolveInstantiableEntryFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| entry / consumer separation | `pass` | local supply and consumer status remain two surfaces. |
| gap no-write | `pass` | query only reads existing gap context. |
| 下一条件 | `pass_with_pending` | MI-UP-001 blocks positive consumer resolution only. |

### 9.6 `ListAvailableVariantsFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_list_available_variants(ImageQueryRequest<ListAvailableVariantsRequest>)`；`query_service`。 |
| read path | explicit public cursor/limit → mapper → `SupplyEntryRepositoryPort::list_available_entries(page)` → exact variant reads for labels → page/view mapper. |
| freshness | existing SupplyCatalog marker may annotate page; `RequireFresh` rejects non-Fresh/missing marker; no catalog rebuild. |

#### 调用图: `ListAvailableVariants` 只读分页流

```text
[query entry]
  | validate public cursor / non-zero bounded limit / context
  v
[page mapper + supply repository]
  | ImageRepositoryPageRequest(after, limit)
  | list_available_entries(page)
  | per item: exact get_variant_with_version(entry.variant_ref)
  v
[page mapper]
  | stable items + opaque next cursor + existing freshness marker
  v
[ImageQueryPageResponse]
```

```rust
let page = map_public_page_read_only(request.body.page_cursor, request.body.limit)?;
let entries = supply.list_available_entries(&page).await?;
let response = map_available_entry_page_with_exact_variant_labels(entries, &request.context).await?;
// No page-result save, no entry/history repair, no rebuild, no UoW.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| empty page + confirmed local scope | `Visible + Empty` with empty page. |
| one entry has missing/cross-kind variant relation | `Gap + Partial`; safe other entries may remain. |
| stale existing marker and allowed stale preference | page plus explicit `Stale`; never `Fresh`. |
| malformed cursor/limit | query `ContractViolation`; no fallback/default page. |

最小测试切口：cursor never becomes a version; missing variant yields Partial/Gap not label guess; empty page≠consumer readiness; RequireFresh does not rebuild; no write/adapter calls。

#### `ListAvailableVariantsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| bounded page mapping | `pass` | public cursor maps one-to-one to repository page. |
| local availability limit | `pass` | catalog does not assert Member Service/container state. |
| 下一条件 | `pass` | only read ports are used. |

### 9.7 `GetAvailabilityHistoryFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_availability_history(ImageQueryRequest<GetAvailabilityHistoryRequest>)`；`query_service`。 |
| read path | exact variant + explicit page → `SupplyEntryRepositoryPort::list_availability_history_by_variant` → append-only history item mapper. |
| freshness | direct history has `None`; `RequireFresh`/`InspectMarker` cannot fabricate a history projection and therefore fail closed unless an existing compatible marker was explicitly supplied by the protocol path. |

#### 调用图: `GetAvailabilityHistory` 只读分页流

```text
[query entry]
  | validate variant_ref / cursor / limit / context
  v
[SupplyEntryRepositoryPort]
  | list_availability_history_by_variant(variant_ref, page)
  v
[history mapper]
  | preserve repository order and action-specific Option semantics
  v
[history page response]
```

```rust
let page = map_public_page_read_only(request.body.page_cursor, request.body.limit)?;
let history = supply.list_availability_history_by_variant(&request.body.variant_ref, &page).await?;
let response = map_append_only_history_read_only(history, &request.context)?;
// No current-pointer repair, transition append, replay, trace, UoW or external lookup.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| no local history + visible scope | `Empty`。 |
| action-specific relation malformed | `Gap + Partial`; do not choose newest/current substitute. |
| store unavailable / scope unresolved | `Unavailable`。 |
| non-Fresh requested without compatible existing marker | `Unavailable`; no rebuild. |

最小测试切口：history stays repository order; Retire/resulting-entry contradiction=Gap; empty page stays Empty; no append/save/UoW; RequireFresh never writes。

#### `GetAvailabilityHistoryFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| append-only read | `pass` | query cannot modify, repair or delete history. |
| action Option handling | `pass` | mapper keeps action-specific None semantics. |
| 下一条件 | `pass` | no write surface. |

### 9.8 `GetImageTraceFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_image_trace(ImageQueryRequest<GetImageTraceRequest>)`；`query_service`。 |
| read path | exact `LocalObjectRef` + explicit page → `ReferenceDerivedRepositoryPort::list_trace_by_subject` → local/external source-separated trace mapper. |
| freshness | trace has no projection companion; `RequireFresh` / `InspectMarker` is `Unavailable`, never a trace rebuild or a direct-truth substitute. |

#### 调用图: `GetImageTrace` 只读分页流

```text
[query entry]
  | validate typed local subject / cursor / limit / context
  v
[ReferenceDerivedRepositoryPort]
  | list_trace_by_subject(local_subject, page)
  v
[trace mapper]
  | local_refs and external_refs remain separate
  v
[trace page response]
```

```rust
let page = map_public_page_read_only(request.body.page_cursor, request.body.limit)?;
let trace = references.list_trace_by_subject(&request.body.subject_ref, &page).await?;
let response = map_explain_only_trace_read_only(trace, &request.context)?;
// No append trace, truth repair, source lookup, replay or UoW.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| no trace + visible subject scope | `Empty`。 |
| source kind mismatch | `Gap + Partial`; do not rewrite/drop trace. |
| `RequireFresh` / `InspectMarker` | `Unavailable` because no marker companion exists. |
| repository unavailable | `Unavailable`; no log/provider fallback. |

最小测试切口：external source cannot become local subject; missing trace=Empty; source mismatch=Gap; freshness preference does not create marker; no append/UoW/adapter call。

#### `GetImageTraceFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| explain-only boundary | `pass` | trace never becomes truth or evidence/report. |
| local/external typing | `pass` | source classes remain distinct. |
| 下一条件 | `pass` | read-only flow is complete. |

### 9.9 `GetContractGapsFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_contract_gaps(ImageQueryRequest<GetContractGapsRequest>)`；`query_service`。 |
| read path | selector maps one-to-one: ContractLane→`list_open_gaps_by_lane`; ContractBoundary→`list_gaps_by_boundary`; ConsumerEntry→`list_consumer_handoff_gaps(Some(entry_ref), page)`。 |
| freshness | only an existing compatible ContractGapSummary marker can satisfy `RequireFresh`; no union scan, external owner recheck, gap creation or projection rebuild. |

#### 调用图: `GetContractGaps` 只读分页流

```text
[query entry]
  | validate one bounded selector / cursor / limit / context
  v
[selector mapper]
  | ContractLane      -> ReferenceDerived list_open_gaps_by_lane
  | ContractBoundary  -> ReferenceDerived list_gaps_by_boundary
  | ConsumerEntry     -> Supply list_consumer_handoff_gaps(Some(entry))
  v
[typed branch mapper]
  | ContractGap and ConsumerHandoffGap stay separate
  v
[gap page response]
```

```rust
let page = map_public_page_read_only(request.body.page_cursor, request.body.limit)?;
let rows = read_one_explicit_gap_selector(&request.body.selector, &page).await?;
let response = map_typed_gap_page_read_only(rows, &request.context)?;
// No global union/post-filter, owner resolver, gap open/resolve/stale, UoW or replay.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| bounded selector has no local row | `Empty`; it does not close an owner contract. |
| one safe row has a broken relation | `Gap + Partial`; other safe rows stay visible. |
| selector cannot map exactly to a port | `ContractViolation`; no fallback scan. |
| marker/read/store unavailable | `Unavailable`; no external owner lookup. |

最小测试切口：each selector calls exactly one repository method; no selector becomes global union; empty does not mean closed; broken consumer gap relation=Partial/Gap; no resolver/UoW/write call。

#### `GetContractGapsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| bounded selector mapping | `pass` | each public selector maps exactly one read port. |
| gap lifecycle safety | `pass` | query neither opens nor resolves/stales a gap. |
| 下一条件 | `pass` | no external seam is invoked. |

### 9.10 `GetProjectionFreshnessFlow`

| 项目 | 收敛 |
|---|---|
| 入口 | `handle_get_projection_freshness(ImageQueryRequest<GetProjectionFreshnessRequest>)`；`query_service`。 |
| read path | explicit protocol selector → `ImageProjectionLookupKey` → `find_read_model_ref_by_key` → `find_freshness_by_read_model_with_version` → freshness mapper. |
| preference | `InspectMarker` may expose an existing Rebuilding marker with no body; `RequireFresh` accepts only existing Fresh; missing/non-fresh is `Unavailable`; no rebuild/source truth read. |

#### 调用图: `GetProjectionFreshness` 只读流

```text
[query entry]
  | validate projection kind / optional variant relation / context
  v
[key mapper + projection repository]
  | find_read_model_ref_by_key(key)
  | find_freshness_by_read_model_with_version(existing_view)
  v
[freshness mapper]
  | Fresh | Stale | Rebuilding | Unavailable | Empty | Gap
  v
[freshness response]
```

```rust
let key = map_protocol_projection_selector(&request.body.selector)?;
let existing_view = projections.find_read_model_ref_by_key(&key).await?;
let response = map_existing_freshness_marker_read_only(existing_view, &request.context).await?;
// Do not load committed truth, begin rebuild, save freshness/read model, or reserve replay.
return Ok(response);
```

| surface branch | 结果 |
|---|---|
| no existing view/marker + confirmed scope | `Empty + None`; not Fresh. |
| existing Rebuilding + `InspectMarker` | `Rebuilding + None`; no wait/job trigger. |
| non-Fresh or missing marker + `RequireFresh` | `Unavailable`; no rebuild. |
| view/marker relation broken | `Gap + ContractViolation`; no watermark inference. |

最小测试切口：selector does not derive key from route/cursor; Rebuilding remains marker-only; RequireFresh cannot write/rebuild; broken relation=Gap; no truth snapshot/UoW/write calls。

#### `GetProjectionFreshnessFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| existing-marker only | `pass` | no query-time identity or freshness minting. |
| preference semantics | `pass` | Fresh is narrow projection watermark only. |
| 下一条件 | `pass` | read-only flow is complete. |

### 9.11 Query batch 9.2 停审汇总

| Query family | exact/page source | Empty / Partial / Gap / Stale / Rebuilding / Unavailable | no-write assertion |
|---|---|---|---|
| definition / derivation / build / qualification | DefinitionAssembly / BuildCandidate / Qualification typed reads | direct truth uses `None`; broken relations produce Gap/Partial; RequireFresh cannot downgrade | no UoW/reserve/adapter/trace/gap write |
| entry / catalog / history | Supply exact/page reads and existing marker only | local availability stays narrow; consumer pending remains Gap; stale marker explicit | no consumer call or entry/history mutation |
| trace / gaps / freshness | ReferenceDerived / selected gap page / Projection existing marker | no marker companion→RequireFresh/InspectMarker unavailable; typed Gap branches preserved | no refresh/rebuild/gap mutation/truth snapshot read |

All ten Query flows have an independent exact/page mapper and a testable no-write assertion. None uses the command/job B01/B02 path because none canonicalizes, reserves, saves a result, or begins a UoW.

## 10. 条件入站与 outbound 零库存审计（batch 9.3 / 9.4）

### 10.1 `ConsumeVerifiedBuildRequestFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_consume_verified_build_request() -> Result<ImageInboundBoundaryResult, ImageProtocolError>`；planned worker → application boundary facade。 |
| 输入 | 无 request DTO、无 envelope、payload、event ID、offset、receipt、dedup key、source identity 或 transport metadata。 |
| 唯一 callable surface | `InboundContractMarker` for `ConsumeVerifiedBuildRequest` → `ImageEntryBoundaryPort::inspect_inbound_boundary(&marker)`。 |
| 固定结果 | `accepted_input=false`; only `Unavailable` / `Rejected` / `ReopenRequired`; no write path。 |

#### 调用图: `ConsumeVerifiedBuildRequest` marker-only 流

```text
[planned worker logical entry]
  | select named boundary only; accepts no transport input
  v
[InboundContractMarker]
  | Unavailable | Rejected | ReopenRequired
  v
[ImageEntryBoundaryPort.inspect_inbound_boundary]
  | map safe disposition to ImageInboundBoundaryResult
  v
[accepted_input = false]
```

```rust
let marker = composition.inbound_marker_for(
    ImageInboundConsumerName::ConsumeVerifiedBuildRequest,
)?;
let assessment = entry_boundary.inspect_inbound_boundary(&marker).await?;
return Ok(map_inbound_boundary_disposition(
    ImageInboundConsumerName::ConsumeVerifiedBuildRequest,
    assessment,
    /* accepted_input */ false,
));
// No write context, canonicalizer, UoW, reservation, receipt, dedup, BuildIntent or trace.
```

| branch | current result / forbidden effect |
|---|---|
| marker `Unavailable` | unavailable disposition; no BuildIntent/snapshot/attempt/candidate. |
| marker `Rejected` | rejected disposition; no payload parse, receipt, quarantine or dedup record. |
| marker `ReopenRequired` | reopen disposition; no claim that a future event was received. |
| marker/port unavailable or name mismatch | `Unavailable` / `ContractViolation`; no broker fallback or default marker mint. |

最小测试切口：function has no input parameter; all marker variants force `accepted_input=false`; injected envelope-like data cannot compile into this surface; spies observe no command/UoW/idempotency/repository call。

#### `ConsumeVerifiedBuildRequestFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| input absence | `pass_with_blocker` | no transport/receipt schema exists while MI-UP-005 is pending. |
| truth no-write | `pass` | BuildIntent path is structurally unreachable. |
| 下一条件 | `reopen_required` | formal inbound authority/envelope/dedup/receipt contract must close first. |

### 10.2 `ConsumeVerifiedSourceRefreshFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_consume_verified_source_refresh() -> Result<ImageInboundBoundaryResult, ImageProtocolError>`；planned source-refresh worker boundary。 |
| 输入 | 无 request DTO、source ref/body、event envelope、revision/freshness data、receipt、dedup 或 adapter response。 |
| 唯一 callable surface | matching `InboundContractMarker` → `ImageEntryBoundaryPort::inspect_inbound_boundary(&marker)`。 |
| 固定结果 | `accepted_input=false`; returns only boundary disposition; does not refresh source or projection。 |

#### 调用图: `ConsumeVerifiedSourceRefresh` marker-only 流

```text
[planned worker logical entry]
  | select source-refresh boundary; accepts no payload
  v
[InboundContractMarker]
  v
[ImageEntryBoundaryPort.inspect_inbound_boundary]
  | map Unavailable | Rejected | ReopenRequired
  v
[accepted_input = false; zero snapshot/projection mutation]
```

```rust
let marker = composition.inbound_marker_for(
    ImageInboundConsumerName::ConsumeVerifiedSourceRefresh,
)?;
let assessment = entry_boundary.inspect_inbound_boundary(&marker).await?;
return Ok(map_inbound_boundary_disposition(
    ImageInboundConsumerName::ConsumeVerifiedSourceRefresh,
    assessment,
    /* accepted_input */ false,
));
// No resolver, snapshot/gap/projection repository, UoW, canonicalizer, receipt or replay.
```

| branch | current result / forbidden effect |
|---|---|
| marker `Unavailable` | unavailable disposition; no resolver/source call. |
| marker `Rejected` | rejected disposition; no source body/cache/dedup storage. |
| marker `ReopenRequired` | explicit future redesign condition; not a refresh success. |
| marker/port unavailable or mismatch | `Unavailable` / `ContractViolation`; no cross-use of build marker. |

最小测试切口：function has no source argument; all marker variants keep `accepted_input=false`; spies observe no resolver/snapshot/projection/UoW/write call; a source payload attempt is contract-invalid rather than cached。

#### `ConsumeVerifiedSourceRefreshFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| source/body isolation | `pass_with_blocker` | no owner source schema is imported. |
| snapshot no-write | `pass` | refresh cannot create/update any snapshot, gap, truth or marker. |
| 下一条件 | `reopen_required` | MI-UP-005 and source owner contract must formally close. |

### 10.3 条件入站 batch 停审汇总

| Consumer | accepted input | callable port | prohibited |
|---|---:|---|---|
| `ConsumeVerifiedBuildRequest` | `false` | `inspect_inbound_boundary` only | envelope/payload/receipt/dedup/BuildIntent/snapshot/trace/UoW |
| `ConsumeVerifiedSourceRefresh` | `false` | `inspect_inbound_boundary` only | source body/resolver/snapshot/gap/projection/UoW |

两条 flow 都不是 “尚未补全的成功 consumer”；它们是当前可测试的 marker-only fail-closed boundary。`MI-UP-005` 关闭前，不得把它们升级为 event 入口或重放写路径。

### 10.4 Outbound event inventory audit：`NoneAuthorized`

| 审计项 | 结论 |
|---|---|
| outbound flow 数 | `0`。本 Step 不存在 outbound event handler、append flow、publish flow 或 delivery flow。 |
| public/event carrier | 不存在 event DTO、payload、envelope、topic、schema version、receipt、delivery state。 |
| ports / persistence | 不存在 outbox、publisher、delivery/retry port 或 repository。 |
| command/job effect | `ImageOutboundEventInventory::NoneAuthorized` 固定；local trace/gap/freshness/history/stored result不构成 event。 |
| local “publish”语义 | `PublishInstantiableEntry`仅为 local supply history，不是 registry publish、Artifact handoff、Member Service notification或任何 message delivery。 |
| reopen condition | `MI-UP-009` must formally identify owner, consumer, schema/version, delivery/failed semantics and dependency kind; then reopen Step 5/7/8/9 and related consistency steps. |

#### Outbound 零库存停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| 是否机械继承 L1-governance outbox/publisher | `pass` | no corresponding object/port/flow was introduced. |
| 是否把 local state 冒充 delivery | `pass` | no trace, gap, transition or replay result is outbound evidence. |
| 下一条件 | `blocked` | only MI-UP-009 formal closure can create a future inventory. |

## 11. Operations Job flow batch 9.5：逐 bounded action 处理流

### 11.0 当前 Job 可调用性判定

每个 Job 都可先进行 System actor、metadata、scope/page shape 校验，再严格执行 `ImageOperationsJobName -> ImageJobActionKind -> ImageJobActionMarker::declare(action_kind, None) -> ImageEntryBoundaryPort::inspect_job_action_boundary`。在 boundary 返回 `Blocked`/`ReopenRequired`/`Unavailable` 时，flow 只返回内存中的安全 disposition，**不**读 page/target、不 canonicalize、不 reserve、不写 result/gap/trace。即使 boundary=`Declared`，`DDD-S9-B01` 也在 canonicalization 前阻断 selection；`DDD-S9-B02` 在任何未来 local mutation/result保存前继续阻断。于是当前 Job 不会产生 `ImageOperationsJobResult` stored body、run/report/evidence、scheduler state或任何 local mutation。

### 11.1 `RunNightlyBuildSweepFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_run_nightly_build_sweep(ImageOperationsJobRequest<RunNightlyBuildSweepRequest>)`；`BuildIntentCoordinator`。 |
| action chain | `RunNightlyBuildSweep` → `ImageJobActionKind::NightlyBuildSweep` → `ImageJobActionMarker::declare(..., None)` → `inspect_job_action_boundary`。 |
| bounded future scope | only `BuildableRevisions { page.after, page.limit }` plus body-free `trigger_ref`; no scheduler cursor/default batch/full scan。 |
| current stop | after `Declared`, B01 prevents canonicalization/reservation and therefore prevents `list_buildable_revisions` or intent facade calls。 |

#### 调用图: `RunNightlyBuildSweep` 当前合法流

```text
[bounded jobs caller]
  | validate System actor, metadata, BuildableRevisions page and trigger_ref shape
  v
[job name -> action marker]
  | ImageJobActionMarker::declare(NightlyBuildSweep, None)
  v
[ImageEntryBoundaryPort.inspect_job_action_boundary]
  | Blocked/ReopenRequired/Unavailable -> return non-persisted disposition
  | Declared
  v
[DDD-S9-B01 stop]
  | no canonical job input; do not select page or request intent
```

```rust
validate_system_actor_and_explicit_job_page(&request)?;
let marker = ImageJobActionMarker::declare(ImageJobActionKind::NightlyBuildSweep, None)?;
match entry_boundary.inspect_job_action_boundary(&marker).await? {
    ImageJobActionAvailability::Declared => {
        // STOP DDD-S9-B01/B02 before canonicalize, reserve, list_buildable_revisions or facade call.
        return Err(/* existing Step 8 fail-closed protocol-error mapping */);
    }
    other => return Ok(map_nonpersisted_job_boundary_disposition(other)),
}
```

| future declared mapping | 当前状态 |
|---|---|
| canonicalize exact job body → reserve → `list_buildable_revisions(page)` → per revision `RequestBuildIntent` facade with `NightlySweep` trigger | B01/B02 前完全不可达。 |
| each future item keeps its explicit revision ref and safe disposition; no selected-count/report/run field | 仅 reopen rule，非当前 result。 |

错误与 replay：invalid actor/page/trigger=`ContractViolation`; boundary block returns safe non-persisted `Blocked`/`Unavailable`; after repair duplicate must load stored disposition and never reselect page. 当前没有 reservation/replay 可达。

最小测试切口：non-System actor rejected; malformed page rejected; boundary Blocked means zero page read; Declared reaches B01 with zero repository/UoW/idempotency/facade call; no scheduler/run/report fields。

#### `RunNightlyBuildSweepFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| action/marker/boundary | `pass` | bounded action is distinct from scheduler execution. |
| page / intent isolation | `pass_with_blocker` | page selection and intent write remain unreachable under B01/B02. |
| 下一条件 | `blocked` | reopen concrete write carriers before action body. |

### 11.2 `ReconcileBuildAttemptsFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_reconcile_build_attempts(ImageOperationsJobRequest<ReconcileBuildAttemptsRequest>)`；`BuildIntentCoordinator`。 |
| action chain | `ReconcileBuildAttempts` → matching `ImageJobActionKind` → marker → boundary inspection。 |
| bounded future scope | only `ReconcilableBuildAttempts { page }`; it cannot retry a handoff or scan provider state。 |
| current stop | `Declared` stops at B01 before canonicalization, page list, `BuilderRegistryPort::inspect_outcome`, or `RecordBuildOutcome` facade。 |

#### 调用图: `ReconcileBuildAttempts` 当前合法流

```text
[bounded jobs caller]
  | validate System actor / exact ReconcilableBuildAttempts page
  v
[ReconcileBuildAttempts marker -> boundary]
  | Blocked/ReopenRequired/Unavailable -> safe in-memory disposition; no list/adapter
  | Declared -> DDD-S9-B01 stop
  v
[no attempt read, no builder inspection, no retry, no mutation]
```

```rust
validate_system_actor_and_exact_scope(&request, ImageJobScopeKind::ReconcilableBuildAttempts)?;
let marker = ImageJobActionMarker::declare(ImageJobActionKind::ReconcileBuildAttempts, None)?;
let availability = entry_boundary.inspect_job_action_boundary(&marker).await?;
if !matches!(availability, ImageJobActionAvailability::Declared) {
    return Ok(map_nonpersisted_job_boundary_disposition(availability));
}
// STOP DDD-S9-B01/B02: no canonicalize/reserve/list_reconcilable_attempts/inspect_outcome.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| future declared mapping | 当前状态 |
|---|---|
| canonicalize/reserve → `list_reconcilable_attempts(page)` → per exact attempt `BuilderRegistryPort::inspect_outcome` → controlled `RecordBuildOutcome` facade | B01/B02 and Q-MI-003 keep it unreachable. |
| `Unknown` remains unknown; no retry, second attempt, or adapter cache shortcut | future invariant only. |

错误与 replay：boundary block stops before selection; invalid scope=`ContractViolation`; a future adapter `Unknown` is not retry; duplicate never reinspects adapter. 当前无 persisted job disposition。

最小测试切口：Blocked means no attempt page/adapter call; Declared stops before B01; no retry API exists; no run/report/evidence result; no write/UoW call。

#### `ReconcileBuildAttemptsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| observation/retry separation | `pass` | reconciliation is inspection-only, never a blind retry. |
| current action body | `pass_with_blocker` | B01/B02 prevent page/adapter/mutation. |
| 下一条件 | `blocked` | reopen after canonical/result and builder boundary review. |

### 11.3 `ReevaluatePendingQualificationsFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_reevaluate_pending_qualifications(ImageOperationsJobRequest<ReevaluatePendingQualificationsRequest>)`；`QualificationCoordinator`。 |
| action chain | `ReevaluatePendingQualifications` → same `ImageJobActionKind` → marker → boundary inspection。 |
| bounded future scope | only `ReevaluableQualifications { page }`; no gate inventory/evidence body/default pass。 |
| current stop | `Declared` stops at B01 before page read, boundary assessment or qualification facade。 |

#### 调用图: `ReevaluatePendingQualifications` 当前合法流

```text
[bounded jobs caller]
  | validate System actor and explicit reevaluable page
  v
[ReevaluatePendingQualifications marker -> boundary]
  | non-Declared -> non-persisted Blocked/Unavailable disposition
  | Declared -> DDD-S9-B01 stop
  v
[no evaluation list, gate/evidence lookup, decision mutation or supply action]
```

```rust
validate_system_actor_and_exact_scope(&request, ImageJobScopeKind::ReevaluableQualifications)?;
let marker = ImageJobActionMarker::declare(ImageJobActionKind::ReevaluatePendingQualifications, None)?;
match entry_boundary.inspect_job_action_boundary(&marker).await? {
    ImageJobActionAvailability::Declared => {
        // STOP before canonicalize/reserve/list_reevaluable_gate_evaluations.
        return Err(/* existing Step 8 fail-closed protocol-error mapping */);
    }
    other => return Ok(map_nonpersisted_job_boundary_disposition(other)),
}
```

| future declared mapping | 当前状态 |
|---|---|
| canonicalize/reserve → `list_reevaluable_gate_evaluations(page)` → `QualificationBoundaryPort` → qualification facade per exact context | B01/B02 stop; Q-MI-004 still allows only safe non-positive assessment. |
| result may never create Artifact Accepted or supply entry | future invariant only. |

错误与 replay：invalid actor/scope=`ContractViolation`; ReopenRequired becomes safe blocked/reopen disposition; future duplicate must not reread page or re-evaluate. `Passed`/`Eligible` cannot be defaulted from empty page or missing authority.

最小测试切口：empty page is not pass; boundary block avoids repository/qualification port; Declared stops at B01; no Artifact/entry call; no UoW/write/report fields。

#### `ReevaluatePendingQualificationsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| gate owner isolation | `pass` | job has no inventory/evidence body surface. |
| current write/action block | `pass_with_blocker` | no evaluation/decision/gap mutation occurs. |
| 下一条件 | `blocked` | reopen after canonical/result carriers and Q-MI-004 review. |

### 11.4 `RefreshExternalReferenceSnapshotsFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_refresh_external_reference_snapshots(ImageOperationsJobRequest<RefreshExternalReferenceSnapshotsRequest>)`；`ReferenceIntakeCoordinator`。 |
| action chain | `RefreshExternalReferenceSnapshots` → matching action marker → boundary inspection。 |
| bounded future scope | exactly `ExternalSnapshot { snapshot_ref }`; no source scan/event payload/body。 |
| current stop | `Declared` stops at B01 before exact snapshot read, resolver call or snapshot/gap write。 |

#### 调用图: `RefreshExternalReferenceSnapshots` 当前合法流

```text
[bounded jobs caller]
  | validate System actor and exact ExternalSnapshot ref
  v
[RefreshExternalReferenceSnapshots marker -> boundary]
  | non-Declared -> non-persisted safe disposition
  | Declared -> DDD-S9-B01 stop
  v
[no snapshot read, resolver, invalidation, supersede, gap/trace/replay write]
```

```rust
validate_system_actor_and_exact_scope(&request, ImageJobScopeKind::ExternalSnapshot)?;
let marker = ImageJobActionMarker::declare(ImageJobActionKind::RefreshExternalReferenceSnapshots, None)?;
let availability = entry_boundary.inspect_job_action_boundary(&marker).await?;
if matches!(availability, ImageJobActionAvailability::Declared) {
    // STOP DDD-S9-B01/B02 before get_external_snapshot_with_version or resolver call.
    return Err(/* existing Step 8 fail-closed protocol-error mapping */);
}
return Ok(map_nonpersisted_job_boundary_disposition(availability));
```

| future declared mapping | 当前状态 |
|---|---|
| canonicalize/reserve → exact `get_external_snapshot_with_version` → resolver for loaded declared use only → `ExternalReferenceSnapshot::capture` new context / old supersede/invalidate → versioned save/gap/trace | B01/B02 keep all calls unreachable; source owner body remains excluded. |
| source unavailable/unknown remains local negative disposition, not cache/fake valid snapshot | future invariant only. |

错误与 replay：wrong scope/source-use relation=`ContractViolation`; missing selected snapshot=`Blocked`/`Missing`; future duplicate does not resolve again; no source event payload is accepted.

最小测试切口：non-exact selector rejected; boundary blocked avoids exact read/resolver; Declared stops B01; no snapshot/trace/gap/UoW write; no source body field accepted。

#### `RefreshExternalReferenceSnapshotsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| exact-source scope | `pass` | one existing local snapshot, declared use only. |
| current source isolation | `pass_with_blocker` | no resolver/snapshot mutation before B01/B02 repair. |
| 下一条件 | `blocked` | reopen write carriers and formal owner seam as needed. |

### 11.5 `RebuildImageDerivedViewsFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_rebuild_image_derived_views(ImageOperationsJobRequest<RebuildImageDerivedViewsRequest>)`；`ProjectionRebuilder`。 |
| action chain | `RebuildImageDerivedViews` → matching action marker → boundary inspection。 |
| bounded future scope | one explicit `Projection(ImagePublicProjectionKey)`; it must first resolve to an existing read model/marker and only then load committed truth. |
| current stop | `Declared` stops at B01 before key/read-model/freshness read, truth snapshot load, rebuild, projection save or trace/replay。 |

#### 调用图: `RebuildImageDerivedViews` 当前合法流

```text
[bounded jobs caller]
  | validate System actor and explicit projection key
  v
[RebuildImageDerivedViews marker -> boundary]
  | non-Declared -> non-persisted safe disposition
  | Declared -> DDD-S9-B01 stop
  v
[no projection lookup, no committed truth load, no rebuild]
```

```rust
validate_system_actor_and_exact_scope(&request, ImageJobScopeKind::Projection)?;
let marker = ImageJobActionMarker::declare(ImageJobActionKind::RebuildImageDerivedViews, None)?;
match entry_boundary.inspect_job_action_boundary(&marker).await? {
    ImageJobActionAvailability::Declared => {
        // STOP before canonicalize/reserve/find_read_model/load_committed_truth_snapshot.
        return Err(/* existing Step 8 fail-closed protocol-error mapping */);
    }
    other => return Ok(map_nonpersisted_job_boundary_disposition(other)),
}
```

| future declared mapping | 当前状态 |
|---|---|
| canonicalize/reserve → map key → `find_read_model_ref_by_key` / existing freshness read → `CommittedImageTruthSnapshotPort::load_committed_truth_snapshot` → `ProjectionFreshness::begin_rebuild` / `ImageDerivedReadModel::from_truth` / `mark_fresh` or `mark_unavailable` → versioned projection saves | B01/B02 prevent any projection/replay call now. |
| no existing view/marker → `NoOp` in future; no query-time or job-time implicit view creation | future invariant only. |

错误与 replay：wrong key=`ContractViolation`; a non-committed source=`ContractViolation`; missing existing view is future `NoOp`, not Fresh; future duplicate must not rebuild twice. Current blocked boundary/B01 result has no stored run report.

最小测试切口：key cannot derive from query route/cursor; boundary block avoids projection/truth calls; Declared stops B01; spy proves no cache/view used as truth and no query-created view; no UoW/report/evidence。

#### `RebuildImageDerivedViewsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| truth→projection direction | `pass_as_reopen_mapping` | only committed truth port is future source; view/cache never is. |
| current replay/projection block | `pass_with_blocker` | B01/B02 prevent reads/writes beyond boundary inspection. |
| 下一条件 | `blocked` | reopen after canonical/result identity closure. |

### 11.6 `ReconcileArtifactAndConsumerHandoffsFlow`

| 项目 | 当前收敛 |
|---|---|
| 入口 | `handle_reconcile_artifact_and_consumer_handoffs(ImageOperationsJobRequest<ReconcileArtifactAndConsumerHandoffsRequest>)`；Qualification + Availability controlled facade。 |
| action chain | `ReconcileArtifactAndConsumerHandoffs` → matching action marker → boundary inspection。 |
| bounded future scope | exactly one `HandoffGaps { target=ArtifactHandoffs|ConsumerHandoffGaps, page }`; no union/page scan/delivery retry。 |
| current stop | `Declared` stops at B01 before selected page, Artifact/Member Service assessment, local handoff/gap mutation or replay。 |

#### 调用图: `ReconcileArtifactAndConsumerHandoffs` 当前合法流

```text
[bounded jobs caller]
  | validate System actor, one target and explicit bounded page
  v
[ReconcileArtifactAndConsumerHandoffs marker -> boundary]
  | Blocked/ReopenRequired/Unavailable -> non-persisted safe disposition
  | Declared -> DDD-S9-B01 stop
  v
[no selected list, no Artifact/Member Service seam, no accept/resolve/confirm]
```

```rust
validate_system_actor_and_one_handoff_target_page(&request)?;
let marker = ImageJobActionMarker::declare(
    ImageJobActionKind::ReconcileArtifactAndConsumerHandoffs,
    None,
)?;
let availability = entry_boundary.inspect_job_action_boundary(&marker).await?;
if !matches!(availability, ImageJobActionAvailability::Declared) {
    return Ok(map_nonpersisted_job_boundary_disposition(availability));
}
// STOP DDD-S9-B01/B02: no canonicalize/reserve/selected list/seam call/gap or handoff write.
return Err(/* existing Step 8 fail-closed protocol-error mapping */);
```

| future declared mapping | 当前状态 |
|---|---|
| Artifact target: reserve → `list_reconcilable_artifact_handoffs(page)` → non-positive `QualificationBoundaryPort` assessment → keep/open Gap/Pending context only | B01/B02; MI-UP-007 prevents Accepted. |
| Consumer target: reserve → `list_reconcilable_consumer_handoff_gaps(page)` → `MemberServiceSupplyPort::assess_gap_reopen` → keep Open/mark Stale only | B01/B02; MI-UP-001 prevents Resolved/confirmation. |

错误与 replay：wrong target/page=`ContractViolation`; boundary blocked stops before selected list; future positive acceptance/confirmation from an adapter under pending contracts is `ContractViolation`; duplicate must not recheck external seam.

最小测试切口：exactly one target required; Blocked means neither list nor seam call; Declared stops B01; positive adapter result rejected under MI-UP-001/007; no entry availability mutation/run/report/evidence。

#### `ReconcileArtifactAndConsumerHandoffsFlow` 单 flow 停审

| 审查项 | 结论 | 处置 |
|---|---|---|
| target separation | `pass` | Artifact and consumer paths do not form a union or share acceptance semantics. |
| current owner safety | `pass_with_blocker` | no assess/accept/resolve/confirm call or local mutation occurs. |
| 下一条件 | `blocked` | MI-UP-001/007 plus B01/B02 require future reopening. |

### 11.7 Operations Job batch 停审汇总

| Job | marker-first | explicit scope | current max path | future prohibited conclusion |
|---|---|---|---|---|
| Nightly sweep | yes | buildable revision page + trigger ref | validation → boundary → B01 | scheduler/run/build success |
| Attempt reconcile | yes | reconcilable attempt page | validation → boundary → B01 | blind retry/candidate shortcut |
| Qualification reevaluate | yes | reevaluable evaluation page | validation → boundary → B01 | default pass/Artifact/supply result |
| Snapshot refresh | yes | one exact existing snapshot | validation → boundary → B01 | owner body/source-event acceptance |
| Projection rebuild | yes | explicit projection key | validation → boundary → B01 | cache/view-as-truth/readiness |
| Handoff reconcile | yes | one target + explicit page | validation → boundary → B01 | Artifact accepted/consumer resolved/confirmation |

所有 Job 都没有 scheduler/cron/lease/cursor state、run ID、报告、计数、metric、evidence、verdict、signoff、digest 或 outbound；`page.after=None` 仅为显式首次读取位置，不是进度 checkpoint。当前若 boundary is non-Declared 可返回非持久化安全 disposition；如果 boundary is Declared，一律由 B01/B02 阻止后续 read/write。将来的 Job 必须先修复 write carrier，再重开 Step 9，不得把该表解释为现有可执行 worker。

## 12. Step 9 跨 flow 闭环审计

### 12.1 覆盖与停审矩阵

| flow family | inventory | independent flow | current execution class | audit conclusion |
|---|---:|---:|---|---|
| Command | 10 | 10 | validation/context → B01; zero write | `pass_with_blocker` |
| Query | 10 | 10 | full read-only exact/page/existing marker path | `pass` |
| conditional inbound | 2 | 2 | marker-only, `accepted_input=false` | `pass_with_reopen_only` |
| outbound event | 0 | 0 | `NoneAuthorized` | `pass` |
| Operations Job | 6 | 6 | validation/marker/boundary → B01 when Declared | `pass_with_blocker` |

### 12.2 DTO → object → port → state/replay 审计

| 审计面 | 结论 |
|---|---|
| DTO / selector | Each Command and Job validates only local shape before B01; every Query maps its exact/page selector to one Step 7 read port; two inbound surfaces have no input DTO by design. |
| object construction | Future mappings name only Step 6 factories/members/guards. No flow creates an undocumented object, local ID, external ref, digest, request key, result ref, evidence or readiness fact. |
| port use | Commands/Jobs make no repository/resolver/boundary call past B01; Queries invoke only typed reads; inbound invokes only `inspect_inbound_boundary`; outbound has no port. |
| UoW / version | No current Command/Job starts a UoW. Future mapping uses `Absent` only for new objects and exact `Versioned<T>` values only for loaded objects. Query/inbound never begin UoW. |
| replay | No new reservation/replay is currently reachable because B01 precedes it. Once reopened, duplicate must read stored shell/body, never re-execute a command/job/body or adapter call. B02 blocks construction/save/complete until resolved. |
| state | Current state changes are zero on all write-class flows. Query surfaces faithfully expose Empty/Partial/Gap/Stale/Rebuilding/Unavailable; no flow equates stage-local state with external readiness. |

### 12.3 truth / projection / external-boundary 审计

| boundary | cross-flow conclusion |
|---|---|
| template / seed / build artifact vs live state | Definition/derivation flows admit static body-free refs only; no flow accepts live memory/checkpoint, workspace content/mount, container lifecycle, runtime loop or tool execution. |
| local truth vs projection | Query reads existing truth/projection only; rebuild future source is `CommittedImageTruthSnapshotPort`; query never creates/refreshes/rebuilds, and projection never becomes truth. |
| builder/registry | Record/reconcile flows neither infer outcome from ACK/tag/cache nor calculate digest; Q-MI-003 stays pending. |
| qualification / Artifact | gate inventory/evidence remain external; eligibility is local; Artifact flow/reconcile can only be future Pending/Gap under MI-UP-007, never Accepted. |
| Member Service | local entry is not manifest, instance, container, launch or health; Resolve/reconcile retain gap-only consumer seam under MI-UP-001. |
| inbound / outbound | inbound has no envelope/write receipt path under MI-UP-005; outbound inventory is exactly zero under MI-UP-009. |

### 12.4 error / recovery / phase-boundary 审计

| 类别 | Step 9 closed behavior |
|---|---|
| local shape violation | pre-context `Missing` / `ContractViolation`; no IO/write. |
| B01 / B02 | unpersisted fail-closed protocol/design blocker; never converted to gap/trace/result/readiness record. |
| query relation/store degradation | Empty only for confirmed visible absence; relation mismatch=`Gap`/`Partial`; unresolved reachability/store=`Unavailable`; `RequireFresh` cannot silently downgrade. |
| inbound pending | marker `Unavailable`/`Rejected`/`ReopenRequired`; no accepted transport input. |
| job boundary | Blocked/ReopenRequired/Unavailable stops before selection; Declared still stops B01; no retry/run report. |
| implementation phase | Step 9 is a design intermediate artifact; no code, test execution, provider, digest, build result, report, evidence, verdict, signoff, readiness, implementation repository or commit has been created. |

### 12.5 blocker / reopen ledger

| blocker | affected flow | current disposition | reopen prerequisite |
|---|---|---|---|
| `DDD-S9-B01` | all 10 Commands + all 6 Jobs after boundary | stop after context/marker; no UoW/reserve/read/write | concrete per-operation canonical input carrier and mapper in reopened Step 7/8. |
| `DDD-S9-B02` | all future Command/Job persistence/replay | no result shell/ref/save/complete | legal result ID/ref factory/mapper and shell/body consistency in reopened Step 6/7/8. |
| `MI-UP-001` | entry resolve/handoff reconciliation | local gap-only; no confirmation/resolution | formal Member Service manifest/variant/ref/qualification/confirmation contract. |
| `MI-UP-005` | conditional inbound / event trigger | marker-only, no envelope or truth write | owner event authority/schema/identity/dedup/receipt/transport semantics. |
| `MI-UP-007` | Artifact command/job | future Pending/Gap only; no Accepted | consumable ref, lineage, acceptance and resolution contract. |
| `MI-UP-009` | outbound inventory | zero flows/ports | owner/consumer/schema/delivery/failed semantics and multi-Step reopen. |
| `Q-MI-003/004` | builder / gate qualifying lanes | no product positive seam/default pass | controlled builder/registry and gate/evidence authority contracts. |

### 12.6 Step 9 final stop-review checklist

- [x] 10 Command flows each contain entry, ASCII call graph, Rust-style stop pseudocode, DTO→future-object→port mapping, UoW/version/error/state/trace/gap/replay reasoning, test cut and single-flow review.
- [x] 10 Query flows each contain exact/page/marker read path, ASCII graph, pseudocode, Empty/Partial/Gap/Stale/Rebuilding/Unavailable handling and no-write assertion.
- [x] 2 conditional inbound flows contain no input DTO/payload and return only marker-based `accepted_input=false` dispositions.
- [x] outbound inventory is `NoneAuthorized`; no outbound DTO, outbox, publisher, delivery port or flow exists.
- [x] 6 Job flows contain action marker, boundary inspection, explicit page/exact target, B01/B02 stop, future replay rule and no scheduler/run/report/evidence surface.
- [x] final audit covers DTO/object/port/UoW/version/replay/state/projection/external seams/outbound/pending/phase boundary.
- [x] Step 10 is **not** created; formal `03-详细设计.md` is **not** assembled; user confirmation is required before any next Step.

## 13. 回填草稿（禁止当前装配）

> 正式回填位置：`03-详细设计.md` 第 8 章“逐接口函数级处理流”。当前只有 Step 9 中间产物在推进，项目级与文档级门禁均禁止正式 03 装配；本节仅固定未来回填的章节轮廓。

```md
> 校准来源：
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
>
> 延伸阅读：
> - 阅读 Step 9 的 shared discipline、各 protocol flow、单 flow 停审和 final audit，了解 UoW、local truth、query no-write、job boundary、outbound zero inventory 与 pending external contract 如何收敛。

## 8. 逐接口函数级处理流

本仓的 10 个 Command、10 个 Query、2 个 fail-closed conditional inbound boundary 与 6 个 bounded Operations Job 均以 application-owned logical facade 展开。Command/Job 只在 local UoW 内保存本仓 truth、trace、existing projection marker、gap 或 stored replay；Query 严格只读；conditional inbound 不接收输入；outbound event inventory 严格为零。每条 flow 只能使用已定义的 typed object、port 和 safety carrier，外部 owner 未闭口时以 gap/blocked/unavailable/reopen 表示，不推导 digest、Artifact acceptance、Member Service confirmation 或 readiness。
```

## 9. 待确认事项

- `MI-UP-001`：Member Service formal manifest/variant/ref/qualification/confirmation 未闭口；Resolve/handoff flow 只能读 local entry/gap，不能 positive resolve 或 confirm。
- `MI-UP-002/003/006/008`：component/mapping/seed/base owner schema、compatibility 与 source authority 未闭口；definition/reference flow 只能保留 body-free ref/conclusion/gap。
- `MI-UP-004`：Core metadata/actor/authorization mapping 未闭口；neutral carrier 不等授权，未闭合权限路径必须 `Unavailable`。
- `MI-UP-005`：inbound event contract 未闭口；两个 inbound flow 无 input/receipt/dedup/write path。
- `MI-UP-007`：Artifact consumable/acceptance/lineage contract 未闭口；handoff 仅 Pending/Gap。
- `MI-UP-009`：outbound owner/consumer/schema/delivery 未闭口；outbound inventory维持零。
- `Q-MI-003/004`：builder/registry、gate/evidence/BOM policy 未闭口；不能写真实 build success/digest/positive gate/readiness。

## 10. 进入下一步条件

- [x] 10 个 Command 均有独立 flow、ASCII 调用图、伪代码、DTO→object→port mapping、UoW/error/state/trace/replay/test 切口和单 flow 停审。
- [x] 10 个 Query 均有独立 read flow、freshness/content-state/page 分支、no-write assertion 和单 flow 停审。
- [x] 两个 conditional inbound 均只保留 marker-only fail-closed flow；outbound inventory 为零且无 outbound flow。
- [x] 六个 Job 均有 action marker、boundary、explicit page/exact scope、replay、local disposition 和单 flow 停审；无 scheduler/run/report/evidence。
- [x] final audit 已检查所有 flow 的 transaction/order/state/ref/error/replay/outbound/pending/phase boundary，无未说明的本仓设计冲突。
- [x] 已更新 `03_ddd_calibration_flow.md` 与 `project_execution_ledger.md` 为 `completed_stop_review`，并停止等待用户明确确认 Step 10。
