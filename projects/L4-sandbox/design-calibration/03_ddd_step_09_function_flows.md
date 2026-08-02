# Step 9. 逐接口定义函数级处理流

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 9
> 回填章节: `03-详细设计.md` §8 逐接口函数级处理流
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 8 协议契约、Step 7 port 契约和 Step 6 对象契约基础上,逐协议定义函数级调用链、DTO 到对象构造步骤、事务边界、错误映射、状态与事件副作用、测试切口和 per-flow 停审。本步不写 DDL、真实 route/topic、配置 key、真实测试结果、run_id、evidence alias、验收签署或实施 commit boundary。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 9 | 是。Step 8 审查点后用户已回复“同意”,允许进入 Step 9。 |
| 项目级台账是否允许进入 Step 9 | 是。`project_execution_ledger.md` 原恢复点为 Step 8 `pass_wait_review`,用户确认后可进入 Step 9。 |
| 文档级 flow 是否允许进入 Step 9 | 是。`03_ddd_calibration_flow.md` 原记录 Step 9 `blocked_by_step_8_review`,用户确认后门禁满足。 |
| 是否已读取 Step 8 协议契约 | 是。Step 8 已闭口 10 Command、13 Query、9 Inbound Event Consumer、13 Outbound Event、10 Operations Job 的 public protocol surface。 |
| 是否已读取 Step 7 port 契约 | 是。Step 7 已闭口 application facade、truth / projection / relay / idempotency / stored result repository、resolver、backend、handoff、publisher、UoW 和 entry adapter。 |
| 是否已读取 Step 6 对象契约 | 是。Step 6 已闭口 domain truth、status enum、factory / transition method、application result / receipt / report 和 support carrier。 |
| 是否已读取详细设计 SOP Step 9 | 是。本步必须输出处理流总表、按类别批次表、每接口处理流、ASCII 调用图、关键伪代码、事务边界、错误映射、状态 / 事件副作用、测试切口、单 flow 停审和跨 flow 审计。 |
| 是否已读取详细设计书写规范 §5.8 | 是。本步必须使用 Rust 风格伪代码,标注 `对象.函数(Type 参数名)`、tx begin / commit / rollback、save、append 和外部调用位置。 |
| 是否发现阻塞 Step 9 的上游 blocker | 未发现阻塞本步生成的 blocker。发现 Step 8 query selector 与 Step 7 读取面存在细粒度差异,本步以 flow 规则收口:只有 Step 7 有正式读取面的 selector 执行;缺读取面的 selector 返回 `Validation` / `MissingProjection` / `Degraded`,并交给 Step 11 索引读取面承接,不得在 flow 中临时发明 repository method。 |

---

## 2. 本步目标

本步要把 Step 8 的协议契约落成实现者可编码的函数级处理流。重点不是重新定义 DTO 或 port,而是明确每个协议如何进入 application facade、何时 begin UoW、何时 reserve idempotency、何时调用 repository / port / domain method、何时保存 truth / trace / relay / projection stale / stored result、哪些错误 rollback、哪些错误保存可 replay result、哪些 query 必须 no-write。

本步必须闭口:

- 55 个 Step 8 协议的 flow 覆盖。
- Command mutation 的 idempotency、UoW、domain transition、truth save、audit、relay、projection stale、stored result、commit / rollback 顺序。
- Query 的 selector normalization、read port、view assembly、empty / not visible / stale / degraded / missing projection surface 和 no-write。
- Consumer 的 envelope validation、dedup / stored receipt、trusted source gate、reference marker cursor、receipt、ack / retry / quarantine 规则。
- Outbound relay append / publish / feedback 的 source cursor、payload source、publisher outcome、no-rollback。
- Operations Job 的 target selection、per-item processing、partial failure report、stored report replay 和 no core truth repair。
- per-flow 测试切口和 Step 10 状态矩阵候选。

本步不处理:

- Step 10 的完整状态转换矩阵。
- Step 11 的持久化 shape、index、DDL、事务隔离级别、物理 outbox 表。
- Step 12 的完整错误恢复 taxonomy。
- Step 13 的幂等窗口、并发锁粒度和 retry backoff。
- Step 14 的配置 key、默认值和 adapter wiring。
- Step 16 的测试用例全集或真实执行结果。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` | 已读取 | 提供 protocol、DTO、result、receipt、report、query surface、error 和 stored replay surface。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 提供 facade、repository、port、UoW、idempotency、stored result、relay、projection、entry callable surface。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供 domain object、status enum、factory / transition method、guard、application result / receipt / report carrier。 |
| `02_hld_step_08_processing_flows.md` | 已读取 | 提供概要层 12 条关键处理流和边界提示。 |
| 正式 `00/01/02` | 已读取 | 提供需求、架构、概要设计边界:truth ownership、fail-closed、handoff no-rollback、cleanup / redline、query no-write、job no core repair。 |
| L1 artifact / governance Step 9 样例 | 已读取 | 参考 shared transaction template、per-flow 分批、小节粒度和跨 flow 审计组织方式。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取恢复点、Step 8、Step 7、Step 6、Step 9 SOP、书写规范和真相源标准。 | done | 用户确认 Step 8 后允许进入 Step 9。 |
| 2 | 提取 55 个协议并按 Command、Query、Inbound Consumer、Outbound Relay、Operations Job 分批。 | done | 形成 flow inventory。 |
| 3 | 写共享 command / query / consumer / relay / job 模板。 | done | 避免重复且固定 UoW / stored result / cursor / no-write 规则。 |
| 4 | 逐 Command 写 flow 差异、调用链、事务、副作用、错误和测试切口。 | done | 10 个 Command flow 独立停审。 |
| 5 | 逐 Query 写 selector、读取面、view assembly、degraded / empty surface 和 no-write 测试。 | done | 13 个 Query flow 独立停审。 |
| 6 | 逐 Inbound Event Consumer 写 envelope / dedup / write target / receipt / ack 规则。 | done | 9 个 Consumer flow 独立停审。 |
| 7 | 逐 Outbound Event 写 payload source,并定义 relay append / publish flow。 | done | 13 个 outbound payload flow + publish flow 停审。 |
| 8 | 逐 Operations Job 写 target selection、per-item transaction、report item refs 和 duplicate replay。 | done | 10 个 Job flow 独立停审。 |
| 9 | 输出跨 flow 事务 / 状态 / relay / projection / stored result / phase boundary 审计。 | done | Step 10 可进入状态矩阵。 |
| 10 | 更新 flow 和项目台账。 | done | 停在 Step 9 审查点,不创建 Step 10。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些协议必须拥有函数级处理流 | Step 8 中 55 个协议全部拥有 flow 覆盖。Command / Query / Consumer / Job 独立小节;Outbound event 按 payload source 独立小节,并共用 relay append / publish transaction。 |
| 如何分批 | 五批:Command mutation、Query no-write read、Inbound Consumer、Outbound Relay、Operations Job。 |
| 每个处理流入口函数是什么 | 入口函数沿用 Step 8 protocol function signatures,并映射到 Step 7 facade:command -> `SandboxCommandService`;query -> `SandboxQueryService`;consumer -> `SandboxConsumerService`;job -> `SandboxJobService`;outbound -> relay append / publish service。 |
| 入口函数调用哪些 service / domain / repository / outbox | 各 flow 小节写明 facade、domain method、repository / port 和 relay / projection / audit / stored result side effect。 |
| DTO 在哪一步校验 / 派生 / 转换 | entry 先做 protocol validation;application 做 authority / scope / idempotency;domain factory / transition 只接收 Step 6 carrier;缺字段按 Step 8 error mapping。 |
| 字段缺失如何处理 | Command: validation / rejected / fail-closed / pending;Query: empty / not visible / degraded / missing projection;Consumer: delayed / quarantined / rejected;Outbound: no relay append;Job: skipped / partial failed / degraded。 |
| 每个 port 调用是否已在 Step 7 定义 | 是。若 Step 8 selector 需要 Step 7 没有的细粒度读取面,本步禁止临时发明 port,并返回 `Validation` / `MissingProjection` / `Degraded` 或登记 Step 11 索引承接。 |
| 事务在哪里开始 / 提交 / 回滚 | mutation / consumer / job item 在 reserve / validation 后 begin UoW;所有 truth / trace / relay / stale / stored result stage 完成后 commit;port validation failure before write rollback or no UoW;duplicate replay no UoW mutation。 |
| 哪些状态会修改,哪些事件写入 | 每个 flow 的状态 / 副作用表列出 Step 10 状态候选、audit trace、relay record、projection stale marker、stored result。 |
| 每个 flow 测试切口 | 每个 flow 小节列出至少成功、缺失/拒绝、duplicate replay、rollback/no-write/no-rollback 切口。 |
| 跨 flow 是否有冲突 | §18 审计未发现 unresolved 冲突。query selector 读取面差异已作为 current-boundary rule 和 Step 11 handoff item 收口。 |

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本步处理 |
|---|---|---|
| Step 8 协议数较多 | 逐协议全量展开容易重复,压缩又会丢可落码粒度。 | 采用 shared template + per-flow 独立小节;每个协议仍有入口、调用链、事务、副作用和测试切口。 |
| Query selector 与读取面 | Step 8 中部分 query 支持 object-specific selector,Step 7 只闭口 snapshot/projection/audit 等读取面。 | Step 9 定义 selector normalization:没有正式读取面的 selector 不扫描、不拼 ref,返回 degraded/validation 并交 Step 11 索引承接。 |
| accepted truth cursor | 若 cursor 来源不固定,trace / relay / stale / stored result 会漂移。 | Command accepted path 在 truth stage 后调用 `uow.assign_truth_change_cursor()`;reference-only path 调 `assign_reference_marker_cursor()`。 |
| Consumer receipt trace | reference-only consumer 可能伪造 trace subject。 | reference-only accepted receipt 可 `trace_record_ref=None`;只有有正式 subject 的 flow append trace。 |
| Job report replay | accumulator 私有 refs 会导致 duplicate replay 信息不完整。 | 每个 job report item ref 写入 `SandboxJobReportDto` 并保存 stored result。 |
| relay no-rollback | publish failure 可能回滚 source truth。 | relay append 在 source truth transaction 中;publish job 单独更新 relay record,不触碰 source truth。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个协议完整复制一套 40 行伪代码 | 局部独立。 | 大量重复,审查噪声高。 | 不采用。 |
| B. 只写五个 family flow | 简洁。 | 不满足 per-protocol 可落码审计。 | 不采用。 |
| C. Shared template + per-flow 独立差异表和伪代码钩子 | 可审查且不丢粒度。 | 需要严格列出每个 flow 的差异。 | 采用。 |
| D. 为 query 临时新增 finder repository | 让 selector 全部可跑。 | 违反 Step 7 port 契约,实现端会自造读取面。 | 不采用;缺读取面交 Step 11。 |
| E. Consumer 直接调用 command service 改 core truth | 少写一层。 | trusted source 会绕过 command gate。 | 不采用;只有 `ConsumeSandboxControlRequested` 可映射到正式 control command path。 |

---

## 8. Flow inventory

### 8.1 Command flow inventory

| Flow | 协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `OpenControlledExecutionContextFlow` | `OpenControlledExecutionContext` | `open_controlled_execution_context(...)` | command UoW | `ControlledExecutionIntakeStatus`;identity status | accepted / unresolved / duplicate / rollback |
| `EstablishExecutionBoundaryFlow` | `EstablishExecutionBoundary` | `establish_execution_boundary(...)` | command UoW + backend port | `BoundaryDecisionStatus`;handle / lease | established / rejected / backend unavailable / no weak fallback |
| `EvaluatePolicyExecutionFlow` | `EvaluatePolicyExecution` | `evaluate_policy_execution(...)` | command UoW + policy port | `PolicyExecutionDecisionStatus` | accepted / fail-closed / high-risk blocked / duplicate |
| `StartControlledExecutionRunFlow` | `StartControlledExecutionRun` | `start_controlled_execution_run(...)` | command UoW + backend launch | `ControlledExecutionRunStatus` | running / failed before start / policy denied |
| `RecordCaptureResultFlow` | `RecordCaptureResult` | `record_capture_result(...)` | command UoW + capture port | `CaptureStatus` | complete / partial / failed / no artifact body |
| `OpenMaterialHandoffFlow` | `OpenMaterialHandoff` | `open_material_handoff(...)` | command UoW + handoff ports | `HandoffStatus`;relay pending | delivered / retryable / failed / no rollback |
| `SubmitSandboxControlFlow` | `SubmitSandboxControl` | `submit_sandbox_control(...)` | command UoW | `ControlFactStatus` | accepted / conflicted / duplicate / no runtime recover |
| `ClassifySandboxFailureFlow` | `ClassifySandboxFailure` | `classify_sandbox_failure(...)` | command UoW | `FailureClassificationStatus` | classified / pending input / unknown not success |
| `EvaluateCleanupReadinessFlow` | `EvaluateCleanupReadiness` | `evaluate_cleanup_readiness(...)` | command UoW | `CleanupGuardStatus` | allowed / blocked / pending investigation |
| `RecordRedlineContainmentFlow` | `RecordRedlineContainment` | `record_redline_containment(...)` | command UoW + investigation port | `RedlineContainmentStatus` | detected / contained / handoff pending / no advisory-only |

### 8.2 Query / consumer / outbound / job flow inventory

| Flow family | 协议数 | 入口 facade | 事务 | 状态变化 | 停审 |
|---|---:|---|---|---|---|
| Query read flows | 13 | `SandboxQueryService` | no-write;read only | none | pass |
| Inbound consumer flows | 9 | `SandboxConsumerService` | consumer UoW where accepted | reference / handoff / relay marker only | pass |
| Outbound relay flows | 13 payloads + publish | relay append / `SandboxEventPublisherPort` | append in source tx;publish in relay tx | `EventRelayStatus` | pass |
| Operations job flows | 10 | `SandboxJobService` | per-job or per-item UoW | maintenance / projection / derived / relay only | pass |

---

## 9. Shared command transaction template

所有 Command flow 复用本模板,flow 小节只列分支差异。模板中的函数均来自 Step 6 / Step 7 / Step 8。

```text
[api/worker entry]
  | call SandboxApiEntryAdapter.map_command_context(...)
  | call validate(CommandRequestDto)
  v
[SandboxCommandService::<command>]
  | call SandboxUnitOfWorkManager.begin()
  | call SandboxIdempotencyRepository.reserve(&uow, ctx)
  | if Duplicate -> map stored result and rollback/no-op
  | call repository / resolver / adapter ports
  | call DomainObject.factory_or_transition(...)
  | save truth group
  | append audit trace
  | append pending relay where canonical payload exists
  | list affected projections and mark stale
  | save stored command result
  | complete idempotency
  | call uow.assign_truth_change_cursor()
  | commit
  v
[SandboxCommandResultDto]
```

```rust
// [SandboxUnitOfWorkManager.begin()]
let uow = uow_manager.begin().await?;

// [SandboxIdempotencyRepository.reserve(SandboxServiceCallContext ctx)]
match idempotency_repo.reserve(&*uow, ctx.clone()).await? {
    SandboxIdempotencyReservation::Duplicate(stored) => {
        uow_manager.rollback(uow).await?;
        return Ok(SandboxServiceOutcome::from_stored_result(stored));
    }
    SandboxIdempotencyReservation::Conflict(conflict) => {
        uow_manager.rollback(uow).await?;
        return Err(SandboxApplicationError::idempotency_conflict(conflict));
    }
    SandboxIdempotencyReservation::Reserved(record) => {
        // Flow-specific reads, domain methods, saves, audit and relay happen here.
    }
}
```

| 模板规则 | 约束 |
|---|---|
| duplicate replay | 不调用 resolver / backend / repository mutation;直接从 `SandboxStoredOperationResult` 映射 result。 |
| rejected before mutation | rollback UoW;如果 idempotency 已 reserve,保存 rejected result only when Step 8 says replayable public result required。 |
| accepted mutation | stage truth、audit、relay、projection stale、stored result 后,调用 `assign_truth_change_cursor()` 并复制 cursor。 |
| projection stale | 先 `list_projections_affected_by_truth(...)`,再对 existing projection refs `mark_projection_stale(...)`;不得拼 projection ref。 |
| relay append | 只有 Step 8 有 canonical outbound payload 的 accepted path 才 append;无 payload source 时 relay refs 为空。 |
| raw errors | adapter / repository raw error 不进入 DTO;通过 `SandboxPublicErrorDto` 映射。 |

---

## 10. Shared query read template

```text
[api query entry]
  | call SandboxApiEntryAdapter.map_query_context(...)
  | call validate(QueryRequestDto)
  v
[SandboxQueryService::<query>]
  | no write UoW
  | normalize selector only through Step 7 read ports
  | call snapshot/projection/derived/audit repository
  | assemble contracts view DTO
  | map empty / not visible / stale / degraded / missing projection
  v
[SandboxQueryResponseDto<T> or SandboxPagedResponseDto<T>]
```

| Query rule | 约束 |
|---|---|
| no-write | 不调用 `SandboxUnitOfWorkManager.begin()` 的 write path,不 save truth,不 append relay,不 mark stale。 |
| selector normalization | 只允许使用 Step 7 读取面:status snapshot by context、projection by projection ref、derived by derived/report ref、audit by subject。缺细粒度 finder 时返回 `Validation` / `MissingProjection` / `Degraded`。 |
| visibility | actor / scope 不合法返回 `NotVisible` or `Restricted`,不得先读取 body 再过滤。 |
| degraded | material / projection / report integrity 缺失只复制 repository / projection marker;service 不从 error string 合成 marker。 |
| empty page | 仍返回 page-level surface 和 `SandboxPageInfoDto`。 |

---

## 11. Shared inbound consumer template

```text
[worker event entry]
  | call SandboxWorkerEntryAdapter.map_event_context(envelope)
  | validate SandboxInboundEventEnvelopeDto<TPayload>
  | validate trusted source gate / schema_version / payload_digest / forbidden_body_markers
  v
[SandboxConsumerService]
  | begin UoW if accepted write is needed
  | reserve dedup/idempotency by envelope
  | load target reference / handoff / relay state when Step 7 port exists
  | apply reference-only or feedback transition
  | assign reference marker cursor if mark stale
  | save receipt as stored result
  | commit
  v
[SandboxConsumerReceiptDto -> WorkerAckDecision]
```

| Consumer rule | 约束 |
|---|---|
| trusted source | 不能绕过 envelope、schema、source isolation、forbidden body、dedup 或 state gate。 |
| reference-only trace | 无正式 trace subject 时 `trace_record_ref=None`;不得伪造 subject。 |
| stale cursor | reference / summary marker path 用 `assign_reference_marker_cursor()`,不得用 event dedup key / source version / timestamp。 |
| duplicate | 返回 stored receipt,不重复写 reference / handoff / relay。 |
| core truth | consumer 不伪造 context accepted、policy accepted、artifact stored、observability stored 或 investigation completed。 |

---

## 12. Shared outbound relay template

Outbound event 分两段:source flow append relay record;publish job 发送 relay record。

```text
[accepted command / maintenance state transaction]
  | build SandboxOutboundEventEnvelopeDto<TPayload> from committed truth refs
  | call SandboxEventRelayRecord.pending(...)
  | call SandboxEventRelayRepository.append_pending_relay(&uow, relay)
  v
[relay record pending]

[PublishSandboxEventRelay job]
  | list pending relay records with Versioned<T>
  | call SandboxEventPublisherPort.publish(relay, trace)
  | relay.mark_delivered / retryable / dead_letter / failed
  | save_relay_record(expected_version)
  | save job report / stored result
```

| Relay rule | 约束 |
|---|---|
| source cursor | accepted truth uses `assign_truth_change_cursor()`;reference-only marker uses `assign_reference_marker_cursor()`。 |
| payload source | event kind 不替代 payload;payload fields come from Step 8 outbound payload schema。 |
| publish failure | 只更新 relay record / job report;不回滚 source truth。 |
| no payload | 没有 canonical payload source时不创建 relay record。 |

---

## 13. Shared operations job template

```text
[jobs entry]
  | call SandboxJobEntryAdapter.build_job_context(input)
  | validate SandboxJobInputDto<TSpec>
  | reserve job idempotency
  v
[SandboxJobService::run_job]
  | list targets through Step 7 maintenance/projection/derived/relay repositories
  | for each target:
  |   begin item UoW if mutation needed
  |   load Versioned<T>
  |   call adapter / domain maintenance method
  |   save target marker / relay / projection / derived / report
  |   record SandboxJobReportItemDto
  | finish report
  | save stored job report
  | complete idempotency
  v
[SandboxJobReportDto]
```

| Job rule | 约束 |
|---|---|
| target selection | 只用 Step 7 selection repository / projection / derived repo,不得扫描 adapter private state。 |
| partial failure | per-item failure enters report;job may return `PartialFailed`,not hide failure。 |
| duplicate replay | returns stored report;does not re-publish,refresh,rebuild,retry or inspect again。 |
| no core repair | job does not create context,accept policy,start run,or overwrite core truth success。 |

---

## 14. Command flow batch

### 14.1 `OpenControlledExecutionContextFlow`

| 项 | 内容 |
|---|---|
| 协议 | `OpenControlledExecutionContext` |
| 入口 | `SandboxCommandService::open_controlled_execution_context(ctx, input)` |
| 目标对象 | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ExecutionContextResolution`;`SandboxAuditTrace` |
| 依赖 port | `ContextReferenceResolverPort`;`SandboxTruthRepository`;`SandboxAuditTraceRepository`;`SandboxIdGeneratorPort`;idempotency / stored result |

```text
[Command/OpenControlledExecutionContext]
  | validate metadata, source refs, responsibility context
  v
[CommandService]
  | tx begin + reserve
  | call ContextReferenceResolverPort.resolve_context_refs(...)
  | call ControlledExecutionContext.open_pending(...)
  | call ExecutionContextResolution.from_resolver_result(...)
  | call ExecutionEnvironmentIdentity.bind(...)
  | call ControlledExecutionContext.accept(...) or reject(...)
  | save context + identity
  | append audit + relay + stored result
  | commit
```

```rust
// [ContextReferenceResolverPort.resolve_context_refs(ExternalSourceRefSet refs)]
let resolution = resolver.resolve_context_refs(input.execution_source_refs, ctx.trace_context()).await?;
// [ControlledExecutionContext.open_pending(ControlledExecutionContextRef ref, ExternalSourceRefSet refs, ExecutionResponsibilityContext ctx)]
let responsibility_context = input.responsibility_context;
let mut context = ControlledExecutionContext::open_pending(
    ids.next_context_ref()?,
    input.execution_source_refs,
    responsibility_context.clone(),
)?;
let resolution = ExecutionContextResolution::from_resolver_result(
    ids.next_execution_context_resolution_ref()?,
    context.context_ref.clone(),
    resolution,
)?;
// [ExecutionEnvironmentIdentity.bind(ControlledExecutionContext context, ExecutionResponsibilityContext responsibility)]
let identity = ExecutionEnvironmentIdentity::bind(
    ids.next_environment_identity_ref()?,
    &context,
    ExecutionResponsibilityAnchor::from_context(&responsibility_context, ctx.trace_context())?,
    ctx.trace_context(),
)?;
if resolution.supports_execution_identity() {
    context.accept(&resolution, &identity)?;
} else {
    context.reject(SandboxReason::from_resolution(&resolution), ctx.trace_ref())?;
}
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| accepted / rejected result 均在同一 UoW 保存 context、identity、audit、stored result;duplicate rollback no-op | unresolved -> `ReferenceUnresolved`;forbidden body -> `ForbiddenExternalBody`;scope invalid -> `NotAuthorized` | `ControlledExecutionIntakeStatus`;`SandboxExecutionContextChanged`;affected projections stale by existing refs | accepted;unresolved rejected;duplicate replay;forbidden body no write;rollback hides context |

### 14.2 `EstablishExecutionBoundaryFlow`

| 项 | 内容 |
|---|---|
| 协议 | `EstablishExecutionBoundary` |
| 入口 | `SandboxCommandService::establish_execution_boundary(ctx, input)` |
| 目标对象 | `BoundaryRequirementSet`;`BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`LeaseRecord` |
| 依赖 port | `SandboxTruthRepository`;`BackendCapabilityPort`;`IsolationBackendPort`;audit / relay / projection / stored result |

```text
[Command/EstablishExecutionBoundary]
  | load context/version + identity
  | validate context accepted + identity active/matched
  | bind injected SandboxBoundaryProfileConfig + service.runtime_generation_ref
  | call BoundaryRequirementSet.from_context_and_requirements(...)
  | call BackendCapabilityPort.load_capability_summary(...)
  | call IsolationBackendPort.establish_environment(...)
  | map outcome to BoundaryEstablishmentDecision
  | call CoherentBoundary.established(...) or rejected(...)
  | create LeaseRecord when handle is active
  | save_boundary_group(requirement, decision, boundary, handle, lease)
  | append audit + boundary event relay + stale projections + stored result
```

```rust
// [SandboxTruthRepository.get_context_with_version(ControlledExecutionContextRef)]
let context = truth_repo.get_context_with_version(input.context_ref).await?.ok_or_missing()?;
let identity = truth_repo.get_environment_identity_with_version(input.environment_identity_ref).await?.ok_or_missing()?;
context.value.require_accepted()?;
identity.value.require_active_for(&context.value)?;
let requirement = BoundaryRequirementSet::from_context_and_requirements(
    ids.next_boundary_requirement_ref()?,
    &context.value,
    &identity,
    input.boundary_requirements.resource_limits,
    input.boundary_requirements.filesystem_boundary,
    input.boundary_requirements.network_boundary,
    input.boundary_requirements.process_boundary,
    input.boundary_requirements.workspace_boundary,
    boundary_profile.boundary_profile_ref.clone(),
    boundary_profile.limit_template_ref.clone(),
    runtime_generation_ref.clone(),
)?;
let capability = backend_capability.load_capability_summary(input.backend_capability_summary_ref, requirement.clone(), ctx.trace_context()).await?;
let backend_outcome = isolation_backend.establish_environment(context.value.clone(), identity.value, requirement.clone(), capability.clone(), ctx.trace_context()).await?;
let decision_ref = ids.next_boundary_decision_ref()?;
let boundary_ref = ids.next_coherent_boundary_ref()?;
let (decision, boundary, handle, lease) = match backend_outcome.outcome_status {
    IsolationBackendOutcomeStatus::Established => {
        let handle_ref = backend_outcome.handle_ref.clone().ok_or(
            InfraError::OutcomeClassificationMissing,
        )?;
        let lease_window = backend_outcome.lease_window.clone().ok_or(
            InfraError::OutcomeClassificationMissing,
        )?;
        let handle = IsolationEnvironmentHandle::active(
            handle_ref,
            context.value.context_ref.clone(),
            capability.backend_profile_ref.clone(),
        )?;
        let lease = LeaseRecord::open(ids.next_lease_ref()?, &handle, lease_window)?;
        let handle = handle.with_lease(lease.lease_ref.clone())?;
        let decision = BoundaryEstablishmentDecision::established(decision_ref, &requirement, &capability)?;
        let boundary = CoherentBoundary::established(boundary_ref, decision.clone(), handle.clone())?;
        (decision, boundary, Some(handle), Some(lease))
    }
    IsolationBackendOutcomeStatus::Unsupported => {
        let reason = backend_outcome.reason.clone().ok_or(
            InfraError::OutcomeClassificationMissing,
        )?;
        let decision = BoundaryEstablishmentDecision::reject(decision_ref, &requirement, Some(&capability), reason)?;
        let boundary = CoherentBoundary::rejected(boundary_ref, decision.clone())?;
        (decision, boundary, None, None)
    }
    IsolationBackendOutcomeStatus::Failed | IsolationBackendOutcomeStatus::Unavailable => {
        let reason = backend_outcome.reason.clone().ok_or(
            InfraError::OutcomeClassificationMissing,
        )?;
        let decision = BoundaryEstablishmentDecision::failed(decision_ref, &requirement, Some(&capability), reason)?;
        let partial_handle = backend_outcome.handle_ref.clone().map(|handle_ref| {
            IsolationEnvironmentHandle::failed(
                handle_ref,
                context.value.context_ref.clone(),
                capability.backend_profile_ref.clone(),
            )
        }).transpose()?;
        let boundary = CoherentBoundary::failed(
            boundary_ref,
            decision.clone(),
            partial_handle.as_ref().map(|handle| handle.isolation_handle_ref.clone()),
        )?;
        (decision, boundary, partial_handle, None)
    }
};
truth_repo.save_boundary_group(&*uow, requirement, decision, boundary, handle, lease, None).await?;
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| backend outcome is obtained before save;save group + audit + relay + stored result commit together | unsupported -> `BoundaryRejected`;adapter unavailable -> `AdapterUnavailable`;weak fallback -> rejected | `BoundaryDecisionStatus`;`BoundaryCoherenceStatus`;`SandboxBoundaryChanged`;lease seed | established;unsupported rejected;adapter unavailable pending/failed;no silent degrade;duplicate replay |

### 14.3 `EvaluatePolicyExecutionFlow`

| 项 | 内容 |
|---|---|
| 协议 | `EvaluatePolicyExecution` |
| 入口 | `SandboxCommandService::evaluate_policy_execution(ctx, input)` |
| 目标对象 | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` |
| 依赖 port | `PolicySummaryPort`;`SandboxTruthRepository`;audit / relay / stored result |

```text
[Command/EvaluatePolicyExecution]
  | load context + immutable boundary requirement by typed ref
  | verify requirement belongs to context
  | call PolicySummaryPort.load_policy_applicability(...)
  | derive HighRiskActionDecision from snapshot.high_risk_markers
  | call PolicyExecutionDecision.accept/reject/fail_closed/block
  | save_policy_group
  | append audit + policy event relay + stale projections + stored result
```

```rust
let context = truth_repo.get_context_with_version(input.context_ref).await?.ok_or_missing()?;
let requirement = truth_repo.get_boundary_requirement(input.boundary_requirement_ref).await?.ok_or_missing()?;
requirement.require_context(&context.value)?;
// [PolicySummaryPort.load_policy_applicability(PolicyApplicabilitySnapshotRef, ControlledExecutionContext, BoundaryRequirementSet, SandboxTraceContext)]
let snapshot = policy_port.load_policy_applicability(
    ids.next_policy_snapshot_ref()?,
    context.value.clone(),
    requirement.clone(),
    input.policy_source_refs,
    input.authorization_summary,
    input.high_risk_action_markers,
    ctx.trace_context(),
).await?;
let policy_decision_ref = ids.next_policy_decision_ref()?;
let high_risk_decision = HighRiskActionDecision::decide(
    ids.next_high_risk_action_decision_ref()?,
    policy_decision_ref.clone(),
    snapshot.high_risk_markers.clone(),
)?;
// [PolicyExecutionDecision.accept/reject/fail_closed/block(...)]
let decision = if snapshot.requires_fail_closed() {
    PolicyExecutionDecision::fail_closed(
        policy_decision_ref,
        &snapshot,
        &requirement,
        SandboxReason::from_policy_applicability(snapshot.applicability_status),
        ctx.trace_ref(),
    )?
} else if snapshot.explicitly_denies_execution() {
    PolicyExecutionDecision::reject(
        policy_decision_ref,
        &snapshot,
        &requirement,
        SandboxReason::from_policy_authorization(snapshot.authorization_disposition),
        ctx.trace_ref(),
    )?
} else if high_risk_decision.action_status != HighRiskActionDecisionStatus::Allowed {
    PolicyExecutionDecision::block(
        policy_decision_ref,
        &snapshot,
        &requirement,
        high_risk_decision.block_reason.clone().unwrap_or_else(|| {
            SandboxReason::from_high_risk_status(high_risk_decision.action_status)
        }),
        ctx.trace_ref(),
    )?
} else {
    PolicyExecutionDecision::accept(policy_decision_ref, &snapshot, &requirement, ctx.trace_ref())?
};
truth_repo.save_policy_group(&*uow, snapshot, decision, Some(high_risk_decision), None).await?;
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| snapshot / decision / high-risk decision saved as one policy group | missing/conflicted/stale policy -> `PolicyFailClosed`;raw policy body forbidden | `PolicyExecutionDecisionStatus`;`SandboxPolicyDecisionChanged` | accepted;fail-closed;high-risk blocked;missing policy no allow;duplicate replay |

### 14.4 `StartControlledExecutionRunFlow`

| 项 | 内容 |
|---|---|
| 协议 | `StartControlledExecutionRun` |
| 入口 | `SandboxCommandService::start_controlled_execution_run(ctx, input)` |
| 目标对象 | `ControlledExecutionRun` |
| 依赖 port | `SandboxTruthRepository`;`SandboxClockPort`;`IsolationBackendPort`;audit / relay / stored result |

```text
[Command/StartControlledExecutionRun]
  | load context + boundary + exact handle + exact persisted lease + policy decision
  | verify context executable, boundary established, handle active/matched, lease active/not-expired, policy permits
  | call ControlledExecutionRun.prepare(...)
  | call IsolationBackendPort.launch_run(...)
  | call run.mark_running(...) or mark_failed(...)
  | save_run + audit + run event relay + stored result
```

```rust
let context = truth_repo.get_context_with_version(input.context_ref).await?.ok_or_missing()?;
let boundary = truth_repo.get_boundary_with_version(input.coherent_boundary_ref).await?.ok_or_missing()?;
let boundary_handle_ref = boundary.value.isolation_handle_ref.clone().ok_or(
    DomainError::BoundaryCoherenceViolation,
)?;
if boundary_handle_ref != input.handle_ref {
    return Err(DomainError::BoundaryCoherenceViolation.into());
}
let handle = truth_repo.get_isolation_handle_with_version(boundary_handle_ref).await?.ok_or_missing()?;
let lease_ref = handle.value.require_active_for_boundary(&boundary.value)?;
let lease = truth_repo.get_lease_with_version(lease_ref).await?.ok_or_missing()?;
lease.value.require_active_for_handle(&handle.value, clock.now()?)?;
let policy = truth_repo.get_policy_decision_with_version(input.policy_decision_ref).await?.ok_or_missing()?;
if !policy.value.permits_execution() {
    return Err(DomainError::PolicyFailClosedBypass.into());
}
let mut run = ControlledExecutionRun::prepare(
    ids.next_run_ref()?,
    &context.value,
    &boundary.value,
    &policy.value,
    &handle.value,
)?;
let launch_outcome = isolation_backend.launch_run(run.clone(), handle.value.clone(), ctx.trace_context()).await?;
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| launch outcome mapped before save;save run / audit / relay / stored result in one UoW | boundary / handle / lease mismatch -> `BoundaryRejected`;lease inactive / expired or backend unavailable -> `AdapterUnavailable`;policy non-accepted -> `PolicyFailClosed` | `ControlledExecutionRunStatus`;`SandboxRunChanged`;lease不在本flow改写 | running success;inactive / expired lease call=0;backend failure maps failed;policy denied call=0;no tools semantic execution |

### 14.5 `RecordCaptureResultFlow`

| 项 | 内容 |
|---|---|
| 协议 | `RecordCaptureResult` |
| 入口 | `SandboxCommandService::record_capture_result(ctx, input)` |
| 目标对象 | `CaptureFact`;`CapturedMaterialRef`;`ObservabilityMaterialRef` |
| 依赖 port | `SandboxTruthRepository`;`ExecutionCapturePort`;audit / relay / stored result |

```text
[Command/RecordCaptureResult]
  | load run
  | call ExecutionCapturePort.collect_capture(run,...)
  | call CaptureFact.complete/partial/failed(...)
  | save_capture_handoff_group(capture=Some, handoff=None)
  | append audit + capture event relay + stale projections + stored result
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| capture facts saved independent of later handoff;handoff failure cannot rollback capture | missing run -> `ReferenceUnresolved`;forbidden body -> `ForbiddenExternalBody`;capture adapter unavailable -> `AdapterUnavailable` | `CaptureStatus`;`SandboxCaptureChanged` | complete;partial;failed;no stdout/stderr body persisted;duplicate replay |

### 14.6 `OpenMaterialHandoffFlow`

| 项 | 内容 |
|---|---|
| 协议 | `OpenMaterialHandoff` |
| 入口 | `SandboxCommandService::open_material_handoff(ctx, input)` |
| 目标对象 | `HandoffFact`;`SandboxEventRelayRecord` |
| 依赖 port | `SandboxTruthRepository`;`MaterialHandoffPort`;`ObservabilityMaterialPort`;`SandboxEventRelayRepository`;stored result |

```text
[Command/OpenMaterialHandoff]
  | load capture / material refs
  | call HandoffFact.open_pending(...)
  | call MaterialHandoffPort.handoff_material(...)
  | optionally call ObservabilityMaterialPort.handoff_observability_material(...)
  | call HandoffFact.mark_delivered/retryable/failed(...)
  | save_capture_handoff_group(handoff=Some)
  | append audit + handoff event relay + stored result
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| capture already committed;handoff status committed separately;adapter failure saves retryable/failed result not rollback capture | target unknown -> `Validation`;adapter failed -> public failed/retryable | `HandoffStatus`;`SandboxMaterialHandoffChanged`;cleanup may remain blocked | delivered;retryable;failed no rollback;observability handoff does not assert store truth |

### 14.7 `SubmitSandboxControlFlow`

| 项 | 内容 |
|---|---|
| 协议 | `SubmitSandboxControl` |
| 入口 | `SandboxCommandService::submit_sandbox_control(ctx, input)` |
| 目标对象 | `ControlFact`;optional `FailureClassification` |
| 依赖 port | `SandboxTruthRepository`;audit / relay / stored result |

```text
[Command/SubmitSandboxControl]
  | load context
  | call ControlFact.accept(...)
  | call ControlFact.conflicts_with(existing) when existing loaded
  | optionally seed FailureClassification.classify(...)
  | save_safety_group(control + optional failure)
  | append audit + control event relay + stored result
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| control fact and optional failure seed saved as one safety group | conflict -> `VersionConflict` / rejected result;unknown control -> `Validation` | `ControlFactStatus`;`SandboxControlChanged` | kill/cancel accepted;conflict rejected;duplicate replay;does not runtime recover |

### 14.8 `ClassifySandboxFailureFlow`

| 项 | 内容 |
|---|---|
| 协议 | `ClassifySandboxFailure` |
| 入口 | `SandboxCommandService::classify_sandbox_failure(ctx, input)` |
| 目标对象 | `FailureClassification` |
| 依赖 port | `SandboxTruthRepository`;`BackendLifecycleInspectionPort`;audit / relay / stored result |

```text
[Command/ClassifySandboxFailure]
  | load context and optional run/capture/policy truth
  | optionally inspect backend lifecycle
  | call FailureClassification.classify(...)
  | save_safety_group(failure)
  | append audit + failure event relay + stored result
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| classification truth committed with trace / relay / stored result | source markers empty -> pending input;unknown -> not success | `FailureClassificationStatus`;`SandboxFailureChanged` | policy deny;timeout;backend failure;unknown pending;redline failure |

### 14.9 `EvaluateCleanupReadinessFlow`

| 项 | 内容 |
|---|---|
| 协议 | `EvaluateCleanupReadiness` |
| 入口 | `SandboxCommandService::evaluate_cleanup_readiness(ctx, input)` |
| 目标对象 | `CleanupGuard` |
| 依赖 port | `SandboxTruthRepository`;`InvestigationHandoffPort`;audit / relay / stored result |

```text
[Command/EvaluateCleanupReadiness]
  | load context + capture + handoff + redline/investigation summary
  | call CleanupGuard.evaluate(...)
  | save_safety_group(cleanup_guard)
  | append audit + cleanup event relay + stale projections + stored result
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| guard evaluation saves status only;environment release remains later guarded flow | missing capture -> pending evidence;handoff not terminal -> blocked;investigation missing -> pending | `CleanupGuardStatus`;`SandboxCleanupChanged` | allowed;blocked by handoff;pending investigation;non-allowed does not release |

### 14.10 `RecordRedlineContainmentFlow`

| 项 | 内容 |
|---|---|
| 协议 | `RecordRedlineContainment` |
| 入口 | `SandboxCommandService::record_redline_containment(ctx, input)` |
| 目标对象 | `RedlineContainment`;optional `FailureClassification` |
| 依赖 port | `SandboxTruthRepository`;`InvestigationHandoffPort`;audit / relay / stored result |

```text
[Command/RecordRedlineContainment]
  | load context + boundary
  | call RedlineContainment.detect/contain/handoff_pending(...)
  | optionally call InvestigationHandoffPort.handoff_investigation(...)
  | save_safety_group(redline + optional failure)
  | append audit + redline event relay + stored result
```

| 事务边界 | 错误映射 | 状态 / 事件副作用 | 测试切口 |
|---|---|---|---|
| redline truth committed even if investigation handoff is pending/failed;release not performed here | boundary mismatch -> rejected;handoff unavailable -> pending/degraded | `RedlineContainmentStatus`;`SandboxRedlineContainmentChanged`;optional failure | detected;contained;handoff pending;release rejected without guard |

### 14.11 Command batch stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DTO 构造是否闭合 | 通过 | 每个 flow 使用 Step 8 request fields 和 Step 6 carrier。 |
| domain method 是否存在 | 通过 | 使用 Step 6 factory / transition names。 |
| port 是否存在 | 通过 | 使用 Step 7 repository / adapter / UoW / stored result surface。 |
| transaction / cursor / stored result 是否清楚 | 通过 | command template 固定顺序。 |
| 状态 / relay / projection stale 是否闭合 | 通过 | Step 10 继续矩阵化。 |

---

## 15. Query flow batch

### 15.1 Query selector and no-write rules

| Query | selector rule | read port | degraded / missing rule | 测试切口 |
|---|---|---|---|---|
| `GetSandboxExecutionStatus` | requires `context_ref` | `SandboxTruthSnapshotRepository.load_status_snapshot` | missing snapshot -> `Unavailable`;not visible -> no body | visible;missing;not visible;no-write |
| `GetBoundaryStatus` | prefer `context_ref`;direct `boundary_ref` requires existing snapshot/index in Step 11 | `load_status_snapshot` | direct ref without read surface -> `Validation` current boundary | established;pending;direct ref rejected;no-write |
| `GetPolicyDecisionSummary` | prefer `context_ref`;direct decision ref only if snapshot contains relation | `load_status_snapshot` | missing snapshot -> `Degraded` | accepted;fail-closed visible;no policy body;no-write |
| `GetCaptureSummary` | prefer `context_ref` or `run_ref` only if status snapshot relation exists | `load_status_snapshot` | capture missing -> `Empty`;relation missing -> `Degraded` | complete;partial;empty;no artifact body |
| `GetMaterialHandoffStatus` | prefer `context_ref`;direct handoff ref requires Step 11 index | `load_status_snapshot` + relay repo if relay ref present | direct handoff only branch -> `Validation` current boundary | delivered;retryable;failed;no retry |
| `GetFailureControlStatus` | requires `context_ref` or snapshot-backed failure relation | `load_status_snapshot` | missing failure -> `Empty` | classified;control conflict visible;no write |
| `GetCleanupReadiness` | requires `context_ref` or snapshot-backed guard relation | `load_status_snapshot` | missing guard -> `Empty` | allowed;blocked;pending;no release |
| `GetRedlineContainmentStatus` | requires `context_ref` or snapshot-backed redline relation | `load_status_snapshot` | no redline -> `Empty`;missing required summary -> `Degraded` | contained;handoff pending;not advisory;no release |
| `GetSandboxReadProjection` | `projection_ref` branch only for current boundary;`context_ref` branch needs Step 11 index | `SandboxProjectionRepository.get_projection` | missing -> `MissingProjection`;context-only -> `MissingProjection` / handoff | fresh;stale;missing;no rebuild |
| `GetDerivedInspectPreviewTrend` | requires `derived_state_ref` or candidate from `list_derived_rebuild_candidates` only in job,not query | `SandboxDerivedRepository.get_derived_state_with_version` | missing -> `Empty`;failed -> degraded view | fresh;stale;failed;no rebuild |
| `GetBackendCapabilityComparison` | requires report/comparison ref from derived state | `SandboxDerivedRepository.get_derived_state_with_version` | no ad-hoc backend scan;missing -> `MissingProjection` | comparison visible;missing;no backend refresh |
| `GetSandboxReconciliationReport` | `report_ref` supported;latest-by-scope deferred to Step 11 index | `SandboxDerivedRepository.get_reconciliation_report` | scope-only -> `Validation` current boundary unless report ref supplied | clean;issues;scope-only rejected;no run |
| `GetSandboxAuditTrace` | `subject_ref` required | `SandboxAuditTraceRepository.list_traces_by_subject` | empty page -> `Empty` with page_info | paged;empty;not visible;no append |

### 15.2 Shared query pseudocode

```rust
// [SandboxApiEntryAdapter.map_query_context(QueryRequestDto request)]
let ctx = api_entry.map_query_context(&request)?;
// [QueryAccessDecision.visible/degraded(...)]
let access = SandboxQueryAccessDecision::visible(ctx.actor_context())?;
// [NoWriteGuard.requires_no_write()]
access.requires_no_write()?;
// [Repository read]
let view = query_reader.read_without_write(input.selector(), ctx.query_metadata()).await?;
// [SandboxQueryResponseDto<T>::from_view(...)]
return Ok(SandboxQueryResponseDto::from_view_or_surface(view));
```

### 15.3 Query independent flow notes

#### `GetSandboxExecutionStatusFlow`

调用图: `api query entry -> SandboxQueryService::get_execution_status -> load_status_snapshot(context_ref) -> SandboxExecutionStatusViewDto`. 事务: no-write. 错误: missing -> `Unavailable`;not visible -> `NotVisible`;stale snapshot -> `Stale`. 副作用: none. 测试: visible success、missing degraded、not visible redacted、assert no UoW begin。

#### `GetBoundaryStatusFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> BoundaryStatusViewDto`. 事务: no-write. direct `boundary_ref` 当前不扫描 truth store;无正式 index 时返回 `Validation` / `MissingProjection`。测试: context branch success、direct branch rejected、pending capability visible、no backend call。

#### `GetPolicyDecisionSummaryFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> PolicyDecisionSummaryViewDto`. 事务: no-write. 不读取 policy DSL / approval body。测试: accepted、rejected、fail-closed marker、no policy body。

#### `GetCaptureSummaryFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> CaptureSummaryViewDto`. 事务: no-write. capture missing with completed run maps `Degraded`;run with no capture maps `Empty`. 测试: complete / partial / failed / no artifact body。

#### `GetMaterialHandoffStatusFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> MaterialHandoffStatusViewDto`. 事务: no-write. retry is never triggered by query. 测试: delivered、retryable、failed、query no retry。

#### `GetFailureControlStatusFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> FailureControlStatusViewDto`. 事务: no-write. `Unknown` failure kind remains unknown,not success. 测试: classified、pending input、control conflict、no write。

#### `GetCleanupReadinessFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> CleanupReadinessViewDto`. 事务: no-write. `Allowed` view does not release backend. 测试: allowed view,blocked view,pending investigation,no release call。

#### `GetRedlineContainmentStatusFlow`

调用图: `api query entry -> get_execution_status -> load_status_snapshot(context_ref) -> RedlineContainmentViewDto`. 事务: no-write. Redline release cannot be performed by query. 测试: detected/contained/handoff pending;no release。

#### `GetSandboxReadProjectionFlow`

调用图: `api query entry -> SandboxQueryService::get_read_projection -> SandboxProjectionRepository.get_projection(projection_ref) -> SandboxReadProjectionDto`. 事务: no-write. context-only lookup is deferred to Step 11 projection index;current flow returns `MissingProjection` rather than inventing `projection_ref`. 测试: fresh;stale;missing projection;context-only no ad-hoc ref。

#### `GetDerivedInspectPreviewTrendFlow`

调用图: `api query entry -> get_read_projection -> SandboxDerivedRepository.get_derived_state_with_version(derived_ref) -> DerivedInspectPreviewTrendViewDto`. 事务: no-write. Query never rebuilds derived state. 测试: fresh,stale,rebuilding,failed,no rebuild。

#### `GetBackendCapabilityComparisonFlow`

调用图: `api query entry -> get_read_projection -> derived comparison state -> BackendCapabilityComparisonViewDto`. 事务: no-write. No backend capability refresh from query. 测试: comparison visible,stale/degraded,missing,no adapter call。

#### `GetSandboxReconciliationReportFlow`

调用图: `api query entry -> get_read_projection -> SandboxDerivedRepository.get_reconciliation_report(report_ref) -> SandboxReconciliationReportDto`. 事务: no-write. latest-by-scope index is Step 11 handoff;scope-only query returns validation in current boundary. 测试: clean,issues,degraded,scope-only rejected,no reconciliation run。

#### `GetSandboxAuditTraceFlow`

调用图: `api query entry -> SandboxQueryService::get_audit_trace -> SandboxAuditTraceRepository.list_traces_by_subject(subject_ref,page) -> SandboxPagedResponseDto<SandboxAuditTraceItemDto>`. 事务: no-write. page cursor is not truth cursor. 测试: first page,next page,empty page,not visible item,no append。

### 15.4 Query batch stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 Query 是否有 flow | 通过 | 13 个 query 均有独立 flow note。 |
| 是否出现未定义 repository read | 未出现 | 缺 index selector 显式返回 current-boundary degraded / validation。 |
| no-write 是否闭合 | 通过 | 所有 query 禁止 write UoW、refresh、rebuild、handoff、cleanup、redline。 |
| Step 11 handoff | 有 | projection by context、latest report by scope、direct handoff/failure/cleanup/redline selector 需要持久化索引承接。 |

---

## 16. Inbound consumer flow batch

### 16.1 Consumer flow table

| Flow | accepted write | cursor | receipt trace | ack / retry |
|---|---|---|---|---|
| `ConsumeCallerContextReferenceChangedFlow` | `ReferenceResolutionState`;projection stale | reference marker cursor | optional None | accepted/duplicate ack;delayed retry |
| `ConsumePolicySummaryChangedFlow` | reference state;affected projection stale | reference marker cursor | optional None | accepted/duplicate ack;unsupported delayed |
| `ConsumeBackendCapabilitySummaryChangedFlow` | backend reference state;boundary projection stale | reference marker cursor | optional None | accepted;delayed on stale source |
| `ConsumeIsolationBackendLifecycleSignalFlow` | lifecycle marker / optional failure seed | truth cursor if safety truth written | audit trace when safety truth | retry on adapter/source delayed |
| `ConsumeMaterialHandoffStatusChangedFlow` | `HandoffFact` status | truth cursor | audit trace | ack if matched;quarantine if mismatch |
| `ConsumeObservabilityHandoffStatusChangedFlow` | observability handoff marker | truth/reference cursor per target | optional None | ack / delayed |
| `ConsumeSandboxControlRequestedFlow` | formal control command path | truth cursor | audit trace | command result based |
| `ConsumeInvestigationHandoffStatusChangedFlow` | cleanup/redline handoff marker | truth cursor if guard updated | audit trace if subject exists | ack / delayed |
| `ConsumeSandboxTruthRelayFeedbackFlow` | relay record status | relay tx cursor not source truth cursor | relay trace | ack;dead-letter visible |

### 16.2 Consumer pseudocode

```rust
// [SandboxWorkerEntryAdapter.map_event_context(SandboxInboundEventEnvelopeDto<TPayload> envelope)]
let ctx = worker_entry.map_event_context(&envelope)?;
// [SandboxConsumerService.consume_reference_change/consume_sandbox_feedback(...)]
let uow = uow_manager.begin().await?;
let reservation = idempotency_repo.reserve(&*uow, ctx.clone()).await?;
if let SandboxIdempotencyReservation::Duplicate(stored) = reservation {
    uow_manager.rollback(uow).await?;
    return Ok(SandboxConsumerReceipt::duplicate(stored));
}
// [Flow-specific reference / feedback mutation]
let receipt = flow_specific_consume(envelope.payload, &*uow).await?;
stored_result_repo.save_result(&*uow, SandboxStoredOperationResult::from_consumer_receipt(&receipt)).await?;
uow_manager.commit(uow).await?;
```

### 16.3 Per-consumer flow notes

#### `ConsumeCallerContextReferenceChangedFlow`

Calls `ContextReferenceResolverPort.resolve_external_source_ref(...)`, `ReferenceResolutionState.track/mark_stale`, `SandboxReferenceStateRepository.save_reference_state`, `SandboxProjectionRepository.list_projections_affected_by_truth`, `mark_projection_stale`. It uses `assign_reference_marker_cursor()` after reference state is staged. Tests: accepted reference refresh, forbidden body quarantined, duplicate stored receipt, stale cursor not source version.

#### `ConsumePolicySummaryChangedFlow`

Writes policy reference state and marks affected context projections stale;does not modify `PolicyExecutionDecision` from rejected to accepted. Tests: missing policy delayed, fail-closed source stale, duplicate replay, no policy body persisted.

#### `ConsumeBackendCapabilitySummaryChangedFlow`

Writes backend capability reference state and marks boundary comparison / boundary status projections stale;does not establish boundary. Tests: unsupported capability visible, boundary not established, duplicate replay.

#### `ConsumeIsolationBackendLifecycleSignalFlow`

Loads handle/lease relation only through existing truth/snapshot references;writes orphan / failure / lease marker through `save_safety_group` when enough truth is present. Missing relation returns delayed/degraded,not fake handle. Tests: orphan suspected, handle missing delayed, no cleanup release.

#### `ConsumeMaterialHandoffStatusChangedFlow`

Loads `HandoffFact` through safety/capture-handoff truth path if available;updates delivered/retryable/failed via `HandoffFact.mark_*`;mismatch target quarantines. Tests: delivered, retryable, failed no capture rollback, target mismatch quarantined.

#### `ConsumeObservabilityHandoffStatusChangedFlow`

Records observability handoff marker only;does not assert observability store truth. Tests: delivered marker, failed marker, missing observability material rejected, no observability body.

#### `ConsumeSandboxControlRequestedFlow`

Maps payload to `SubmitSandboxControlInput` and invokes the formal control command flow through application facade, preserving command idempotency and conflict guard. Tests: kill accepted, conflict rejected, duplicate command replay, trusted source cannot bypass command gate.

#### `ConsumeInvestigationHandoffStatusChangedFlow`

Updates cleanup/redline handoff marker only when `cleanup_guard_ref` or `redline_containment_ref` matches existing truth. It does not release containment. Tests: cleanup investigation satisfied, redline handoff pending, mismatch quarantined, no release.

#### `ConsumeSandboxTruthRelayFeedbackFlow`

Loads relay record with version, maps publisher outcome to `EventRelayStatus`, saves relay record. It never touches source truth. Tests: delivered, retryable, dead-letter, source truth unchanged.

### 16.4 Consumer batch stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| envelope / payload validation | 通过 | Shared template covers all consumers。 |
| dedup / stored receipt | 通过 | duplicate returns stored receipt。 |
| reference cursor | 通过 | reference-only uses `assign_reference_marker_cursor()`。 |
| core truth success | 未越界 | consumers do not create accepted context / policy / artifact / observability truth。 |

---

## 17. Outbound relay flow batch

### 17.1 Outbound payload source table

| Outbound event | payload source | append trigger | Step 10 status source | 测试切口 |
|---|---|---|---|---|
| `SandboxExecutionContextChanged` | context / identity / resolution | `OpenControlledExecutionContextFlow` | intake status | accepted/rejected payload |
| `SandboxBoundaryChanged` | boundary / decision / handle | `EstablishExecutionBoundaryFlow` | boundary decision | established/rejected payload |
| `SandboxPolicyDecisionChanged` | policy snapshot / decision | `EvaluatePolicyExecutionFlow` | policy decision | fail-closed payload |
| `SandboxRunChanged` | controlled run | `StartControlledExecutionRunFlow` | run status | running/failed payload |
| `SandboxCaptureChanged` | capture fact / material refs | `RecordCaptureResultFlow` | capture status | complete/partial payload |
| `SandboxMaterialHandoffChanged` | handoff fact | `OpenMaterialHandoffFlow` / handoff feedback | handoff status | retryable/failed no rollback |
| `SandboxFailureChanged` | failure classification | `ClassifySandboxFailureFlow` | failure status | unknown not success |
| `SandboxControlChanged` | control fact | `SubmitSandboxControlFlow` | control status | conflict visible |
| `SandboxCleanupChanged` | cleanup guard | `EvaluateCleanupReadinessFlow` | cleanup guard status | allowed/blocked |
| `SandboxRedlineContainmentChanged` | redline containment | `RecordRedlineContainmentFlow` | redline status | contained/handoff pending |
| `SandboxProjectionChanged` | projection state | projection rebuild / mark stale | projection status | stale/fresh |
| `SandboxDerivedViewChanged` | derived state | derived maintenance | derived freshness | rebuilt/failed |
| `SandboxReconciliationFindingAvailable` | reconciliation report | reconciliation job | report status | findings only |

### 17.2 `AppendSandboxOutboundRelayFlow`

```rust
// [SandboxEventRelayRecord.pending(SandboxSourceFactRef source, SandboxEventKind kind)]
let relay = SandboxEventRelayRecord::pending(source_truth_ref, event_kind, payload_ref, source_cursor)?;
// [SandboxEventRelayRepository.append_pending_relay(&SandboxUnitOfWork, SandboxEventRelayRecord)]
let relay_ref = relay_repo.append_pending_relay(&*uow, relay).await?;
```

Transaction: append happens in the same accepted source transaction after truth stage and before stored result commit. If payload source is missing, the source flow records `relay_record_refs=[]` and does not invent payload.

### 17.3 `PublishSandboxEventRelayFlow`

This flow is also the `PublishSandboxEventRelay` job item flow. It lists `Versioned<SandboxEventRelayRecord>`, calls `SandboxEventPublisherPort.publish`, updates `EventRelayStatus`, saves with expected version and records job report item. Publish failure never rolls back source truth.

### 17.4 Outbound batch stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| payload source exists | 通过 | 13 outbound payloads map to Step 8 schemas。 |
| event kind does not replace payload | 通过 | relay record uses payload ref and source truth ref。 |
| publish failure rollback | 不存在 | publish job updates relay only。 |
| source cursor | 通过 | from truth/reference marker cursor only。 |

---

## 18. Operations job flow batch

### 18.1 Job flow table

| Job flow | selection port | mutation target | report refs | 测试切口 |
|---|---|---|---|---|
| `PublishSandboxEventRelayFlow` | `SandboxEventRelayRepository.list_pending_relay_records` | relay record | delivered/retryable/dead-letter refs | publish retry/dead-letter/duplicate |
| `RefreshSandboxReferenceStatesFlow` | `SandboxReferenceStateRepository.list_reference_states_for_refresh` | reference state + projection stale | refreshed/failed reference refs | explicit/stale scopes, cursor source |
| `RefreshBackendCapabilitySummariesFlow` | backend profile refs from job spec/current state | reference/capability summary marker | capability refs/failed profiles | unsupported not allow |
| `RetryPendingMaterialHandoffsFlow` | `SandboxMaintenanceSelectionRepository.list_pending_handoffs` | handoff fact | delivered/retryable/failed handoff refs | no capture rollback |
| `RunLeaseOrphanReaperFlow` | `list_expired_leases` | lease/orphan/cleanup markers | orphan/released/failed lease refs | no cleanup bypass |
| `EvaluatePendingCleanupGuardsFlow` | `list_pending_cleanup_guards` | cleanup guard | allowed/blocked/pending refs | no release |
| `MaintainRedlineContainmentHandoffsFlow` | `list_redline_handoff_pending` | redline handoff marker | handoff/released/terminal/failed refs | no advisory-only |
| `RebuildSandboxReadProjectionsFlow` | projection repo affected refs / job explicit refs | projection | rebuilt/stale/missing refs | snapshot required |
| `MaintainDerivedInspectPreviewTrendFlow` | `SandboxDerivedRepository.list_derived_rebuild_candidates` | derived state | rebuilt/stale/failed derived refs | derived failure not core failure |
| `RunSandboxReconciliationFlow` | `SandboxTruthSnapshotRepository.load_reconciliation_snapshot` | reconciliation report | report/finding/degraded refs | no core repair |

### 18.2 Per-job flow notes

#### `PublishSandboxEventRelayFlow`

Uses shared relay publish template. Per item transaction: publish outside source truth;save relay record with expected version;record report item. Tests: delivered, retryable, dead-letter, duplicate stored report, source truth unchanged.

#### `RefreshSandboxReferenceStatesFlow`

Lists reference states for explicit/stale/degraded scope, calls resolver, saves reference state, assigns reference marker cursor, marks existing affected projections stale. Tests: resolver success, resolver unavailable delayed, affected projections from repository only, duplicate report replay.

#### `RefreshBackendCapabilitySummariesFlow`

Calls `BackendCapabilityPort.refresh_capability_summary` for selected backend profiles, saves body-free capability state, marks boundary comparison views stale. It does not establish any boundary. Tests: supported/unsupported/stale, backend unavailable degraded, no default allow.

#### `RetryPendingMaterialHandoffsFlow`

Lists pending handoffs, calls `MaterialHandoffPort.handoff_material`, updates handoff status, records item refs. Tests: delivered, retryable, failed, capture truth unchanged.

#### `RunLeaseOrphanReaperFlow`

Lists expired leases, calls `BackendLifecycleInspectionPort.inspect_handle`, updates lease/orphan marker and possibly cleanup guard pending state. It does not release environment unless cleanup guard allowed and release flow is explicitly triggered later. Tests: orphan suspected, lifecycle unavailable, no cleanup bypass.

#### `EvaluatePendingCleanupGuardsFlow`

Lists pending cleanup guards, loads required capture/handoff/investigation summary through existing truth/snapshot, calls `CleanupGuard.evaluate`, saves guard. It does not call `IsolationBackendPort.release_environment`. Tests: allowed, blocked, pending evidence, no release.

#### `MaintainRedlineContainmentHandoffsFlow`

Lists redline handoff pending states, calls `InvestigationHandoffPort.handoff_investigation`, updates handoff summary / containment status. Release requires explicit guard and remains Step 10/12 constrained. Tests: handoff opened, port unavailable pending, no release without guard.

#### `RebuildSandboxReadProjectionsFlow`

For each target projection, calls `SandboxTruthSnapshotRepository.load_projection_rebuild_snapshot`, builds `SandboxReadProjection.rebuild_from_truth`, saves projection with expected version. It never rebuilds from existing view body. Tests: snapshot present, missing snapshot degraded, stale -> fresh, duplicate report replay.

#### `MaintainDerivedInspectPreviewTrendFlow`

Lists derived candidates, builds `DerivedInspectPreviewTrendState.from_sources`, saves fresh / failed derived state. It does not create `FailureClassification`. Tests: rebuild success, source missing failed derived, no core failure.

#### `RunSandboxReconciliationFlow`

Loads reconciliation snapshot page, builds `SandboxReconciliationReport.report_clean` or issues-found report, saves report and optional reconciliation finding relay. It does not repair truth or projection. Tests: clean, issues found, degraded snapshot, no repair.

### 18.3 Job batch stop-review

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| job input / report refs | 通过 | Step 8 report schema carries item refs。 |
| selection ports | 通过 with handoff | Existing Step 7 selection surfaces used;fine-grained indexes deferred to Step 11 where noted。 |
| duplicate replay | 通过 | stored job report returns without rerun。 |
| no core repair | 通过 | jobs maintain marker/projection/relay/report only。 |

---

## 19. Cross-flow transaction / state / relay audit

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| command UoW ordering | 通过 | reserve -> read/adapter -> domain -> save truth -> audit/relay/stale/stored result -> complete -> cursor -> commit。 |
| rollback visibility | 通过 | rollback path must hide truth,trace,relay,stale,stored result。Step 11 defines physical behavior。 |
| duplicate replay | 通过 | Command / Consumer / Job all return stored result / receipt / report without re-execution。 |
| accepted truth cursor | 通过 | command accepted path uses UoW cursor;not page/version/timestamp。 |
| reference marker cursor | 通过 | consumer / reference refresh uses UoW reference marker cursor。 |
| query no-write | 通过 | no query begins write UoW or calls mutating repository / port。 |
| relay no-rollback | 通过 | publish updates relay only;source truth stays committed。 |
| handoff no-rollback | 通过 | handoff / observability failure does not rollback capture。 |
| cleanup / redline guard | 通过 | query/job cannot release without explicit guard;redline not advisory-only。 |
| phase boundary | 通过 | no tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store、policy definition or approval truth。 |
| query selector gap | contained | Missing finder/index selectors return validation/degraded now;Step 11 must define persistence/index if product wants those branches executable。 |

---

## 20. Step 10~13 handoff items

| 后续 Step | 承接项 |
|---|---|
| Step 10 状态矩阵 | Intake、boundary、policy、run、capture、handoff、control、failure、cleanup、redline、projection、derived、relay、idempotency、job report statuses。 |
| Step 11 persistence / transaction | snapshot/index selectors,projection-by-context lookup,latest reconciliation by scope,truth cursor physical assignment,rollback visibility,stored result save/get physical shape。 |
| Step 12 error / recovery | adapter unavailable,duplicate missing result,consumer quarantine,query degraded,job partial failed,relay dead-letter,cleanup/redline release rejection。 |
| Step 13 concurrency / idempotency | command / consumer / job digest canonicalization,idempotency conflict,expected version conflict,duplicate replay under concurrent retry。 |

---

## 21. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§8 可按以下结构回填。本步不直接修改正式 `03`。

```md
## 8. 逐接口函数级处理流

### 8.1 Shared Mutation / Read / Consumer / Relay / Job Templates

Command mutation follows reserve -> read/adapter -> domain -> save truth -> audit/relay/stale/stored result -> complete -> cursor -> commit. Query is no-write. Consumer uses envelope/dedup/stored receipt. Relay append and publish are separated. Jobs report item refs and replay stored reports.

### 8.2 Command Flows

OpenControlledExecutionContext, EstablishExecutionBoundary, EvaluatePolicyExecution, StartControlledExecutionRun, RecordCaptureResult, OpenMaterialHandoff, SubmitSandboxControl, ClassifySandboxFailure, EvaluateCleanupReadiness, RecordRedlineContainment.

### 8.3 Query Flows

Thirteen read-only query flows with selector normalization, projection marker and degraded surface.

### 8.4 Consumer / Outbound / Job Flows

Inbound envelope handling, outbound relay append / publish, and ten operations jobs.
```

---

## 22. 待确认事项

| 事项 | 当前处理 | 是否阻塞 Step 9 |
|---|---|---|
| Query direct selector indexes | 当前 boundary 不临时发明 finder;缺读取面返回 validation/degraded;Step 11 承接。 | 否 |
| Physical transaction / outbox implementation | Step 11 定义;本步只定义 logical UoW order。 | 否 |
| Retry/backoff/window | Step 13/14 定义;本步只定义 retryable / delayed / dead-letter surface。 | 否 |
| Real route/topic/config | 后续 transport/config/implementation binding。 | 否 |

---

## 23. 自检

| 检查项 | 结论 |
|---|---|
| 是否创建 Step 9 中间产物 | 通过。本文为 `03_ddd_step_09_function_flows.md`。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式文档仍等 Step 19 装配。 |
| 是否提前创建 Step 10 | 未创建。 |
| 每个协议是否有 flow 覆盖 | 通过。55 个协议均在 inventory 和对应批次中覆盖。 |
| 是否存在未定义 port 调用 | 未发现。query 缺 finder 的分支未临时发明 port,已返回 validation/degraded 并交 Step 11。 |
| 是否标注事务 / 错误 / 状态 / 副作用 / 测试切口 | 通过。各批次和 flow 小节均已标注。 |
| 是否发现上游 blocker | 未发现阻塞 Step 9 的上游 blocker。query selector 读取面差异为 Step 11 handoff item。 |

---

## 24. 进入下一步条件

```text
当前 Step 9 已完成并停在用户审查点。

用户确认后,才能进入 Step 10 `定义状态机与转换矩阵`。
进入 Step 10 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_09_function_flows.md`
4. `03_ddd_step_06_object_contracts.md` 中状态 enum / object transition 小节
5. 详细设计 SOP Step 10
6. 详细设计书写规范 §5.9
7. 真相源标准中 truth lifecycle / state-machine-to-carrier / transition helper / illegal transition 相关条目

Step 10 必须按状态机主语展开正式 enum、允许 / 禁止迁移、触发函数、前置条件、副作用和非法转换错误;不得在用户确认前创建 Step 10 文件。
```

---

## 25. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | UoW /副作用影响 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 flow / phase boundary复核 | Boundary flow原从input读取policy snapshot / decision并把decision传入backend port。 | 改为先校验context / identity,再从builder注入的boundary service typed parameters取得profile / template / generation,构造requirements、读取capability并建立environment;Policy flow后序独立执行。 | save order、idempotency、relay和stored result数量不变;只移除非法后序依赖。 |

---

## 26. PHYSICAL EOF Current Flow Override: capture / handoff / publisher (`v7.8`)

本节覆盖本文旧 `ExecutionCapturePort`、`MaterialHandoffPort`、`ObservabilityMaterialPort`、opening 内直接 delivery、relay
`Delivered` 等 historical flow 片段。public protocol 仍为 55 个，不新增 Command、Consumer、Event 或 Job；只把既有协议绑定到
Step 7 current callable surface 和 Step 10 current state owner。

### 26.1 `RecordCaptureResultFlow`

```text
load exact terminal run / handle / generation snapshot
  -> construct checked body-free CaptureCollectionRequest
  -> drop write UoW
  -> CaptureCollectionPort.collect_capture(request) at most once
  -> if external effect unknown: CaptureCollectionPort.inspect_capture(same request)
  -> validate CaptureCollectionCandidate exhaustively
  -> open fresh UoW and re-read exact committed lineage
  -> CaptureFact::record(...) directly as Complete / Partial / Failed / Unavailable
  -> save capture fact + captured material rows + observability material + audit / relay / stale / stored result
  -> assign truth cursor and commit
```

`CaptureFactStatus` 没有 `Pending`；adapter 不返回 `CaptureFact`，不写 Sandbox repository，也不分配 Sandbox identity。unknown
只允许 same-correlation inspection，禁止 blind collect retry。

### 26.2 `OpenMaterialHandoffFlow`

```text
load committed source selector and body-free source materials
  -> validate HandoffOwnershipGuard / decision / generation / fixed HandoffTargetSet
  -> HandoffFact::open(...) creates the complete aggregate
  -> create exactly one embedded HandoffTargetProgress::Pending per fixed target
  -> save aggregate + audit / relay / stale / stored command result in one UoW
  -> assign truth cursor and commit
```

opening 的 delivery adapter call budget 必须为 `0`。它不创建 attempt，不调用 publisher，也不把 downstream receipt 当成 artifact、
observability store 或 investigation truth。`HandoffFactStatus` 从完整 progress set 机械派生。

### 26.3 `RetryPendingMaterialHandoffsFlow` per-target item

```text
select exact eligible (handoff_ref, target_ref)
  -> short UoW fresh-read aggregate / target / source carriers / adapter generation
  -> allocate one HandoffDeliveryAttemptRef
  -> HandoffFact.begin_target_attempt(...) : Pending | eligible Retryable -> Attempting
  -> stage attempt relation and commit before external call
  -> HandoffTargetDeliveryPort.deliver(committed exact-attempt request) once
  -> if delivery effect unknown: inspect_same_attempt(the same request); never create a second attempt
  -> fresh UoW + expected Version
  -> map exhaustive candidate / probe to HandoffTargetDeliveryObservation
  -> HandoffFact.apply_target_observation(...)
  -> derive HandoffFactStatus from the complete progress set
  -> save aggregate + safe marker / report item and commit
```

`HandoffTargetProgressStatus` 的 current graph 为 `Pending -> Attempting`、`Retryable -> Attempting`、
`Attempting -> Delivered | Retryable | Failed`。`Delivered` / `Failed` terminal；material handoff 不使用 `DeadLetter`。任一 target
失败不得删除 earlier receipt，也不得回滚 capture、source material 或 run truth。

### 26.4 `PublishSandboxEventRelayFlow`

```text
load frozen committed relay bundle and exact attempt
  -> CAS reserve exact attempt; loser external call = 0
  -> SandboxEventPublisherPort.publish(...) at most once
  -> unknown uses existing same-attempt inspection owner; no payload rebuild
  -> fresh-read exact attempt and CAS observation
  -> SandboxEventRelayStatus = Published | Retryable | Failed | DeadLetter
  -> save relay-local result / report; source truth and source cursor unchanged
```

publisher 不读取 latest/current source 重建 payload，不由 capture / opening adapter 调用，不隐藏 retry。普通 observability hook 只在
return / inspection 后接收 body-free、低基数 diagnostic frame；hook failure 不改变 public result、state、UoW、identity、retry、
stored replay 或 cleanup decision。

### 26.5 Current flow closure

```text
current_capture_surface = CaptureCollectionPort::{collect_capture,inspect_capture}
current_delivery_surface = HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}
historical_invalid_surface = ExecutionCapturePort|MaterialHandoffPort|ObservabilityMaterialPort|MaterialHandoffAdapterOutcome
handoff_opening_delivery_calls = 0
publisher_success_status = SandboxEventRelayStatus::Published
public_protocol_count = 55_unchanged
new_public_callable = 0
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```
