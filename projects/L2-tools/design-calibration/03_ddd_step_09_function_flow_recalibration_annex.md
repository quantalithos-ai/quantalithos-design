# L2-tools Step 9 R-9 函数流再校准附录：37-flow exact closure

> 状态: completed / pass
> 主文件: `03_ddd_step_09_function_flows.md`
> 输入: Step 6 object/carrier contracts、Step 7 Store/Port seams、Step 8 protocol contracts、Step 9 flow annexes
> 对标: `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md`
> 范围: `CF-01~13`、`QF-01~11`、`IF-01~05`、`OF-01~04`、`JF-01~04`，共 37 条

本附录不是新的业务设计。它是 R-9 的可落码审计层：逐条把已经完成的 flow annex
重新对齐到唯一 DTO、入口 owner、Step 6 callable、Step 7 Store/Port、UoW/phase、状态、
accepted effect、错误 / replay 和最小测试切口。若本附录与旧正式 `03-详细设计.md` 或旧
README 冲突，旧材料标记为 `historical_material`，不反向污染当前设计。

## 1. R-9 规则与 canonical authority

### 1.1 每条 flow 的固定审计字段

每一行 flow closure card 必须回答以下问题；`N/A` 只允许用于明确没有该副作用的 Query
或 blocked external branch，不能用空泛的“按规范处理”替代。

| 字段 | 约束 |
|---|---|
| DTO / protocol | 必须是 Step 8 的闭合名称、版本和 payload；不得重新命名。 |
| Entry / owner | 入口只能调用一个 application facade；entry 不读 Store、不持有 UoW。 |
| Domain callable | 只能引用 Step 6 已存在的 factory/member/pure projector；application-local mapper 必须显式标注。 |
| Store / Port seam | 必须逐名回指 Step 7 方法；不存在的方法只能进入 blocker，不得由 flow 发明。 |
| UoW / phase | 标明 pre-read、claim、local write、external call、post-external local write 和 commit resolution。 |
| Version / watermark | version 只能来自 `Loaded<T>.expected_version`；read / projection / Job 使用同一声明水位。 |
| State | 只推进本仓拥有的 state；assessment/ref/attempt 的状态不能冒充外部 owner truth。 |
| Accepted effects | 逐列出 truth、assessment/gap、projection stale、stored result、trace/audit/outbox、external call。 |
| Error / replay | 区分 deterministic rejection、conflict、blocked/unavailable、commit unknown、duplicate 和 in-flight。 |
| Test cuts | 至少覆盖 positive、deterministic negative、conflict/duplicate、blocked/degraded；Query 还必须验证零写。 |

### 1.2 共享 phase fence

```text
ordinary Command:
  validate/read/optional observational Port
    -> one local UoW (reserve + domain write + typed result/error + stale/trace/audit/outbox where applicable)
    -> commit or same-authority resolve_commit

Consumer:
  envelope/digest precheck
    -> phase-1 claim UoW commit
    -> bounded read / observational Port / formal Command re-entry
    -> phase-2 local facts + receipt + claim completion UoW

Query:
  validate -> visibility resolver -> named read -> pure mapper -> response
  (zero UoW, zero mutation, zero external Port)

Outbound Event:
  committed safe material
    -> phase-1 Prepared attempt + claim commit
    -> exactly one side-effecting collaboration Port call outside UoW
    -> phase-2 attempt disposition + stored continuation result

Job:
  bounded claim commit -> one target at a time
    -> target local UoW (JF-04 adds one external feedback call before that UoW)
    -> final durable JobReport UoW
```

`Prepared`、`SubmissionOutcomeUnknown`、`Blocked` 和 `Unavailable` 均是 fail-closed local
surfaces。它们不能触发自动第二次 external call，也不能被 `Completed`、`Accepted`、
`Delivered` 或 `Observed` 替换。任何 commit outcome unknown 都先调用同一 persistence
authority 的 `resolve_commit(transaction_ref)`；未确认时停止当前 flow，不盲目重跑。

### 1.3 Canonical naming audit

| Concept | Canonical current name | Historical / forbidden alias | Decision |
|---|---|---|---|
| Hub snapshot ref | `HubSnapshotRef` | `HubControlledSnapshotRef` | 旧 alias 仅作 `historical_material`，正式 03 不得出现为新类型。 |
| Job public name | `ToolJobName` | `ToolJobKind` in Step 6 draft | `JobReport.job` 使用 `ToolJobName`；`job_kind` 不再作为第二字段。 |
| Job public carrier | `JobReport.job` | `JobReport.job_kind` | Step 8 shared protocol carrier 是唯一 public authority。 |
| Bus feedback | `BusDeliveryFeedbackRequest::ResolveStored` / `ValidateInbound` | generic feedback request | 两种 mode 不互换；Bus 与 Observation 独立。 |
| Observation feedback | `ObservationFeedbackRequest::ResolveStored` / `ValidateInbound` | Bus status request | 不得把 observation 结果写入 Bus status 或反之。 |
| Current relation lookup | `CapabilityBindingStore::find_current_by_tool` | implicit global binding scan | JF-01 只接受显式非空 `tool_ids`；旧空集合全扫文字为 historical。 |

### 1.4 Application-local helper rule

以下 helper 只表示 application 内的纯 mapper、闭合 match 或 bounded dispatcher，不是新
Store、Port、scheduler、run 或 hidden transaction：

`reserve_or_replay`、`stage_command_replay`、`commit_confirmed`、`resolve_visibility`、
`map_*`、`require_*`、`ensure_*`、`plan_bounded_targets`、`process_one_target`、
`plan_binding_targets`、`process_binding_target`、`plan_reference_targets`、
`process_reference_target`、`load_reference_target_at_watermark`、
`load_projection_source_bundle`、`rebuild_projection_target`、`stored_feedback_request`、
`map_feedback_resolution`、`append_optional_gap`、`map_projection_write_result` 和
`assemble_report`。实现 agent 不得把它们变成未审议的 trait method；其内部每一个 I/O
仍必须调用本附录列出的正式 Step 7 seam。

## 2. 37-flow inventory and phase matrix

| Family | IDs | Count | Phase shape | Family gate |
|---|---:|---:|---|---|
| Command | `CF-01~13` | 13 | ordinary local UoW; `CF-10/12/13` have named multi-phase boundaries | pass |
| Query | `QF-01~11` | 11 | resolver-first read only | pass |
| Inbound Consumer | `IF-01~05` | 5 | claim -> read/Port/re-entry -> receipt | pass |
| Outbound Event | `OF-01~04` | 4 | Prepared -> one submit -> local disposition | pass |
| Operations Job | `JF-01~04` | 4 | bounded claim -> target UoW -> report | pass |
| **Total** |  | **37** |  | **pass** |

## 3. Command flow closure cards (`CF-01~13`)

### 3.1 Command matrix

| ID / DTO | Entry / owner | Exact domain callable | Exact Store / Port seam | UoW / phase / version | State + accepted effects | Error / replay / test cut |
|---|---|---|---|---|---|---|
| `CF-01` `EstablishToolContractRequest` -> `ToolCommandResponse<ToolContractView>` | `ToolCommandUseCases::execute`; contract application service | `FormalToolDefinition::formalize` -> `promote_to_current`; `ToolContract::establish`; `ToolContractEvolutionFact::record`; `map_contract_view` | pre-read `SharedContractAuthorityPort::resolve`; `ToolContractStore::get_contract/get_definition`; write `create_contract`, `insert_definition`, `append_evolution_fact`; `IdempotencyStore::store_command_result` | external read before UoW; one UoW for contract/definition/fact/result/claim; new writes use `None`, returned versions become replay basis | `none -> Active`; first definition `Candidate -> Current`; accepted writes contract, definition, evolution fact, stored result; no binding/outcome/external event | invalid body/identity/source blocker -> zero write; uniqueness conflict; equal digest typed replay; commit unknown resolve. Tests: success, invalid first revision, authority blocked, existing identity, duplicate/conflict, append rollback. |
| `CF-02` `AssessToolDefinitionChangeRequest` -> `ToolCompatibilityImpactView` | `ToolCommandUseCases::execute`; contract evolution service | `FormalToolDefinition::formalize(Candidate)`; `ToolCompatibilityImpact::assess`; `map_compatibility_impact_view` | `ToolContractStore::get_current_bundle/get_definition`; `SharedContractAuthorityPort::resolve`; write `insert_definition`, `append_compatibility_impact`; stored command result | source/current reads pre-UoW; one UoW candidate+impact+result; no current pointer mutation | new definition remains `Candidate`; impact immutable; no stale mark because current truth unchanged | malformed/empty protected scope, source unavailable, candidate duplicate, incomparable source -> zero/rollback; equal replay. Tests cover compatible/conditional/incompatible/unverifiable and exact empty semantics. |
| `CF-03` `AdoptToolDefinitionRevisionRequest` -> `ToolContractView` | `ToolCommandUseCases::execute`; contract evolution service | `ToolContract::adopt_revision`; `FormalToolDefinition::mark_superseded/promote_to_current`; `ToolContractEvolutionFact::record` | `ToolContractStore::get_current_bundle/get_definition/get_compatibility_impact`; conditional `ProjectionStore::get_consistency_report`; write `save_definition` twice, `save_contract`, `append_evolution_fact`, `ProjectionStore::mark_affected_stale` | closure read pre-UoW; one UoW atomically switches both revisions, contract pointer, fact, first stale page, continuation gap, replay; expected versions from loaded bundle | candidate `Current`; prior current `Superseded`; D1 becomes stale; historical invocation anchors unchanged | missing/mismatched/incompatible closure, CAS/projection conflict -> rollback; stale propagation cursor becomes gap; duplicate exact view; no implicit adoption retry. |
| `CF-04` `RetireToolContractRequest` -> `ToolContractView` | `ToolCommandUseCases::execute`; contract service | `ToolContract::request_retirement` or `complete_retirement`; `ToolContractEvolutionFact::record` | `ToolContractStore::get_current_bundle`; complete-only `ProjectionStore::get_consistency_report`; write `save_contract`, `append_evolution_fact`, `mark_affected_stale` | closure read pre-UoW; one UoW lifecycle/fact/stale page/gap/result; loaded contract version required | `Active -> RetirementPending -> Retired`; definition remains historical current pointer; no delete/resurrection | wrong action/state, stale/partial closure, version conflict -> no partial transition; same action replay; different action same key conflict. |
| `CF-05` `DeclareCapabilityBindingRequest` -> `CapabilityBindingView` | `ToolCommandUseCases::execute`; binding service | `HubCapabilityRef::resolve`; `HubControlledSnapshot::from_port`; `CapabilityBinding::declare`; `CapabilityBindingAssessment::assess`; `CapabilityBindingChangeFact::record` | pre-read `ToolContractStore::get_contract`, `CapabilityBindingStore::find_current_by_tool`; Bound-only `HubControlledSourcePort::resolve_snapshot`; write `create_binding`, optional `append_snapshot`, `append_assessment`, `append_change_fact` | Hub call outside UoW; one local UoW for relation/facts/result; new expected version `None` | `none -> BoundActive` or `ExplicitUnbound`; assessment immutable; no registry mutation/authorization | explicit-unbound makes zero Hub call; blocked/mismatch/current relation conflict -> zero relation write; duplicate replay. |
| `CF-06` `ReplaceCapabilityBindingRequest` -> `CapabilityBindingView` | `ToolCommandUseCases::execute`; binding replacement service | `CapabilityBinding::begin_replacement` -> `replace`; `CapabilityBindingAssessment::assess`; `CapabilityBindingChangeFact::record` | `CapabilityBindingStore::get_binding`; Bound-only Hub resolve; write CAS `save_binding(old)`, `create_binding(new)`, optional snapshot/assessment/fact, `ProjectionStore::mark_affected_stale` | Hub read pre-UoW; one atomic old/new relation UoW; old `expected_version` and uniqueness enforced by Store | old `Active -> ReplacementPending -> Replaced(successor)`; new `Active`; old anchors fixed; D1 stale | non-active/same ID/Hub blocker/CAS/unique conflict rolls back both; duplicate replays successor view; no second current relation. |
| `CF-07` `InvalidateCapabilityBindingRequest` -> `CapabilityBindingView` | `ToolCommandUseCases::execute`; binding service | `CapabilityBinding::invalidate`; `CapabilityBindingChangeFact::record`; gap mapper | `CapabilityBindingStore::get_binding`; write CAS `save_binding`, `append_change_fact`; `ProjectionStore::mark_affected_stale/create_gap` | one UoW relation/fact/stale/gap/result; expected version from loaded relation | `Active/ReplacementPending -> Invalidated`; explicit-unbound not synthesized; historical anchors untouched | terminal/missing/version conflict -> no write; source gap is explanatory only; exact replay and stale continuation tested. |
| `CF-08` `SubmitToolInvocationRequest` -> `ToolInvocationView` or stored no-execution error | API and `InvocationCallerPort::submit` delegate `ToolCommandUseCases::execute`; invocation service | `InvocationContextRefs::from_formal_context`; `InvocationContractAnchor::anchor`; `ToolInvocation::canonicalize`; admission policy; `ToolInvocationOutcome::no_execution_*`; `ToolAuditEntry::record` | `ToolContractStore::get_current_bundle`; `CapabilityBindingStore::find_current_by_tool/get_latest_assessment_for_binding`; write `ToolInvocationStore::insert_invocation/append_admission`, `OutcomeAuditStore::insert_outcome_audit_pair`, `ProjectionStore::create_gap`, stored result | all stable reads before one UoW; invocation/admission/no-execution pair/gaps/result atomic; no external Port | immutable invocation; admission `Admitted/AwaitingPrecondition/Rejected/Unavailable`; no-execution requires indivisible outcome+audit | missing contract/binding, stale assessment, raw body, terminal state -> deterministic or committed no-execution; duplicate typed response/error; pair conflict rolls back. |
| `CF-09` `EvaluateExecutionPreconditionsRequest` -> `ExecutionPreconditionView` or committed conservative error | `ToolCommandUseCases::execute`; precondition service | `ExecutionRequirement::derive`; `AuthorizationConsumptionAssessment::consume/fail_closed`; `SandboxReadinessSnapshot::from_port/mapping_blocked`; `ExecutionPrecondition::evaluate`; no-execution outcome/audit factories | reads `ToolInvocationStore::get_invocation_read_bundle`; `ToolContractStore::get_current_bundle`; `CapabilityBindingStore` assessment/snapshot; observational `AuthorizationConsumptionPort::consume_result`, `SandboxExecutionPort::resolve_readiness`; writes `ExecutionHandoffStore::append_requirement/append_authorization_assessment/append_sandbox_readiness`, outcome pair/gap | observational Ports outside UoW; one local UoW for requirement/assessments/terminal pair/result; exact consumption time | requirement immutable; auth/readiness assessment immutable; positive `Ready` only if both formal seams verified; otherwise `Awaiting/Blocked/Rejected` | owner pending/unavailable/conflict -> fail closed; no self-authorization or sandbox inference; same digest replays without second Port call; tests for all assessment variants. |
| `CF-10` `PrepareExecutionHandoffRequest` -> `ExecutionHandoffCommandView` | `ToolCommandUseCases::execute`; handoff service | `ExecutionHandoff::prepare/evaluate_eligibility`; `ExecutionHandoffAttempt::prepare`; no-execution pair mapper | reads invocation/requirement/bundle; `SandboxExecutionPort::submit_handoff` side effect; writes `ExecutionHandoffStore::create_handoff/create_handoff_attempt/save_handoff_attempt`, outcome pair/gaps, stored result | phase 1 UoW commits claim + prepared handoff/attempt; commit resolve; exactly one Sandbox call outside UoW; phase 2 CAS saves local disposition/result; no automatic retry | handoff `Preparing -> Eligible/Blocked/Invalidated`; attempt `Prepared -> AttemptedLocally/LocallyFailed/CarrierUnavailable/MappingBlocked/CallOutcomeUnknown`; no accepted/run/capture/receipt truth | prepared/unknown re-entry never calls Sandbox again; mapping blocker remains local gap; side-effect ambiguity manual-owner; tests one-call and phase-2 unknown. |
| `CF-11` `AcceptExecutionSourceRequest` -> `OutcomeAuditView` or committed safe error | API/direct adapter and `IF-03` formal re-entry; outcome normalization service | `ExecutionSourceAssessment::from_port/blocked`; `ToolInvocationOutcome::from_source`; `ToolAuditEntry::record`; outcome/audit pair mapper | reads invocation/handoff/attempt; `ExecutionSourceIntakePort::map_source` outside UoW; writes `OutcomeAuditStore::append_source_assessment/insert_outcome_audit_pair`, gaps, stored result | source Port read outside UoW; one UoW assessment + pair/gap/result; no external delivery writes | assessment immutable; accepted source -> one of source-backed terminal classes; no-execution not constructed here; local pair first | source identity/class/authority mismatch -> gap/no guessed outcome; unavailable/blocked fail closed; duplicate replay no second Port; pair conflict terminal integrity. |
| `CF-12` `PrepareSafeExternalHandoffRequest` -> `SafeExternalHandoffView` | `ToolCommandUseCases::execute`; safe-handoff service | `SafeHandoffEligibility::evaluate`; `SafeHandoffMaterial::prepare`; semantic event mapper; `ContinuationKey::derive` | source-specific reads; writes `ExternalSubmissionStore::append_eligibility/append_material`; delegates exactly one `SafeMaterialContinuationUseCases::continue_material` -> OF branch | eligibility read pre-UoW; phase 1 commits eligibility/material/claim before continuation; OF owns external call and phase 2; CF-12 never calls collaboration directly | eligibility `Eligible/Ineligible/Unverifiable`; material only for eligible; attempt local state only; no source truth mutation | forbidden body/failed four-check -> ineligible/no material; duplicate material/attempt replay; continuation Prepared/Unknown returned as manual/local, never Delivered. |
| `CF-13` `RecordConsistencyGapResolutionRequest` -> `ConsistencyGapView` or pending/error | `ToolCommandUseCases::execute`; integrity service | `ConsistencyGap::mark_resolution_pending/resolve/supersede`; evidence/ref symmetry mapper | `ProjectionStore::get_gap`; typed owner read (existing Store or named observational Port only); write `save_gap`, stored result; no generic authority query | phase 1 UoW may mark pending + claim; commit resolve; owner re-read outside UoW; phase 2 CAS verifies same evidence and resolves/persists result | `Open -> ResolutionPending -> Resolved`; detection path may supersede; subject truth unchanged | missing/terminal/mismatched evidence, owner blocked/unavailable, concurrent supersede -> pending/error; same evidence replay; no fake run/evidence/signoff. |

### 3.2 Command cross-check

All 13 commands have one named owner, one canonical DTO, one domain transition surface and one
typed stored result/error. Commands never write external Bus/Observability stores. Only `CF-10` and
`CF-12` perform side-effecting external submission, and both have a committed local marker before
the call. `CF-13` is verification of gap state, not subject repair.

## 4. Query flow closure cards (`QF-01~11`)

### 4.1 Query matrix

| ID / DTO | Entry / owner | Exact read / mapper | Store / Port seam | Read phase / state | Error / zero-effect tests |
|---|---|---|---|---|---|
| `QF-01` `GetToolContractRequest` -> `ToolContractView` | `ToolQueryUseCases::handle`; contract query service | `ToolContractView::project` | `ToolContractStore::get_contract_owner_scope`, `get_current_bundle`; `ReadVisibilityResolverPort::resolve` | resolver first, then current bundle; no state transition/effect | owner missing NotFound; not visible/unavailable/integrity surfaces; zero UoW/write/Port tests. |
| `QF-02` `CompareToolDefinitionRevisionsRequest` -> `ToolContractDiffView` | query service; contract evolution read | `ToolContractDiffSummary::compare`, `map_contract_diff_view` | owner scope; `ToolContractStore::get_definition_comparison_bundle`; visibility resolver | common read watermark from bundle; fresh computed view, never persists impact | invalid/equal/reversed pair, missing definition, mismatched impact/watermark; zero projection write/adoption tests. |
| `QF-03` `GetCapabilityBindingRequest` -> `CapabilityBindingView` | query service; binding read | `CapabilityBindingView::project` | `CapabilityBindingStore::get_binding/find_current_by_tool/get_binding_owner_scope/get_latest_assessment_for_binding/get_assessment/get_snapshot`; `ProjectionStore::list_gaps`; visibility resolver | selected immutable assessment/snapshot and bounded gap page; no refresh | missing relation, assessment conflict, snapshot mismatch, visibility/unavailable; assert no Hub call, no append, no UoW. |
| `QF-04` `GetToolInvocationRequest` -> `ToolInvocationView` | query service; invocation read | `ToolInvocationView::project` | `ToolInvocationStore::get_invocation_owner_scope/get_invocation_read_bundle`; visibility resolver | immutable invocation/admission/outcome refs at stored watermark | alien/missing pair, not visible, unavailable; zero outcome repair/external read. |
| `QF-05` `GetExecutionPreconditionViewRequest` -> `ExecutionPreconditionView` | query service; precondition read | `ExecutionPreconditionView::project` | invocation owner/bundle; `ExecutionHandoffStore::get_precondition_read_bundle`; visibility resolver | optional requirement/assessment/readiness bundle; stale/degraded surface preserved | missing bundle, mismatched invocation, blocked material; zero auth/Sandbox Port and zero writes. |
| `QF-06` `GetOutcomeAuditRequest` -> `OutcomeAuditView` | query service; outcome read | `OutcomeAuditView::project` | invocation owner/bundle; `OutcomeAuditStore::get_outcome_audit_pair`; `ExternalSubmissionStore::get_eligibility/find_material_for_eligibility/get_attempt/get_latest_bus_status/get_latest_observation_status`; bounded gaps | pair is atomic; external refs optional and independent; no latest-by-arrival inference | absent pair -> empty/typed not-found per protocol; ref mismatch/degraded; zero mutation and no feedback call. |
| `QF-07` `GetReferenceConsistencyReportRequest` -> report view | query service; integrity read | `ReferenceConsistencyReportView::project` | `ProjectionStore::get_consistency_report`; visibility resolver | exact/latest watermark selector; Missing/Readable/Stale/Rebuilding/Unavailable/Failed mapped distinctly | bad scope/key/watermark; visible empty vs degraded; zero rebuild/mark-stale. |
| `QF-08` `SearchToolContractsRequest` -> page | query service; D1 search read | `ToolContractSearchItem::from_projection` and page mapper | `ProjectionStore::search_tool_contracts`; visibility resolver; public cursor decoder | bounded page, source watermark/freshness/cursor symmetry; no live truth fallback | invalid cursor/filter, empty, stale/rebuilding/unavailable/failed; zero projection write/current lookup. |
| `QF-09` `CompareToolContractsRequest` -> diff view | query service; D1 diff read | `ToolContractDiffView::from_projection` | `ProjectionStore::get_diff_summary`; visibility resolver | stored diff only; no fallback to QF-02 direct compute | pair/key/schema/watermark mismatch, Missing/Degraded; zero compute/write/adoption. |
| `QF-10` `GetToolDiagnosticRequest` -> diagnostic view | query service; diagnostic read | `ToolDiagnosticView::from_projection` | closed subject owner scope router; `ProjectionStore::get_diagnostic_summary`; visibility resolver | diagnostic D1 material may be stale; source identity retained | unsupported subject, missing projection, degraded states; zero repair and no external Port. |
| `QF-11` `GetToolConsumerGuidanceRequest` -> guidance view | query service; guidance read | `ToolConsumerGuidanceView::from_projection` | contract owner scope; `ProjectionStore::get_consumer_guidance`; visibility resolver | exact revision or persisted `BuiltCurrent`; no live current-definition lookup | consumer/revision/key mismatch, forbidden executable material, stale/unavailable; zero SDK/Runtime/client decision. |

### 4.2 Query cross-check

All Query flows are resolver-first and read-only. No Query calls Hub, Authorization, Sandbox,
Bus, Observability or SDK. `QF-02` (fresh direct comparison) and `QF-09` (stored D1 diff) are
deliberately non-interchangeable. `QF-06` reads Bus and Observation independently and never
updates either status. Empty, stale, rebuilding, unavailable and failed are distinct public
dispositions, not null coercions.

## 5. Inbound Consumer closure cards (`IF-01~05`)

### 5.1 Consumer matrix

| ID / envelope | Entry / owner | Exact callable / Port | Phase and writes | State / effect | Error / replay / tests |
|---|---|---|---|---|---|
| `IF-01` `InboundEventEnvelope<HubCapabilityChangeCluePayload>` | `InboundConsumerUseCases::consume`; Hub clue consumer | `HubCapabilityChangeClueInput::from_validated_envelope`; `HubControlledSourcePort::validate_change_clue`; `CapabilityBindingStore::list_bindings_by_hub_capability`; `HubControlledSnapshot::from_port`; `CapabilityBindingAssessment::assess` | phase-1 claim UoW commit; Port and bounded reverse page; phase-2 `append_snapshot/append_assessment/create_gap/store_consumer_receipt` | immutable snapshot/assessment; Binding relation unchanged; next reverse page becomes propagation gap | unsupported/body/source conflict reject/quarantine; blocked attributable clue gap; duplicate receipt no Port/page; tests zero relation mutation, bounded cursor, fake/durable parity. |
| `IF-02` `InboundEventEnvelope<AuthorizationResultChangeCluePayload>` | consumer service; authorization clue | `AuthorizationResultChangeClueInput::from_validated_envelope`; `AuthorizationConsumptionPort::validate_change_clue`; `ExecutionHandoffStore::list_authorization_assessments_by_result`; `ReferenceValidityAssessment` | phase-1 claim; external clue validation outside UoW; phase-2 assessment/gap/receipt | immutable reference assessment; authorization truth and local authorization assessment untouched; open owner contract normally `GapRecorded` | owner blocked/unavailable -> attributable gap only; missing identity -> no receipt; duplicate zero call; tests source isolation, mismatch, page continuation. |
| `IF-03` `InboundEventEnvelope<SandboxExecutionSourcePayload>` | consumer service; formal re-entry path | `InboundEventEnvelope::derive_integration_command_metadata`; calls `CF-11` `AcceptExecutionSource` only; receipt mapper | phase-1 claim; CF-11 owns source Port/UoW; independent phase-2 receipt/claim completion | source assessment + indivisible outcome/audit or gap; Consumer never writes core truth directly | transient CF-11 keeps claim incomplete/retry; committed result/error maps exact receipt; duplicate no re-entry; tests API/direct/consumer parity and no source body. |
| `IF-04` `InboundEventEnvelope<BusDeliveryStatusFeedbackPayload>` | consumer service; Bus feedback | `ExternalSubmissionStore::get_attempt`; `SafeEventCollaborationPort::resolve_bus_delivery(ValidateInbound)`; `BusDeliveryStatusRef::from_feedback` | phase-1 claim; get + feedback Port outside UoW; phase-2 `append_bus_status/create_gap/store receipt` | append-only Bus ref; attempt/outcome/audit unchanged; never Delivered inference | locator/attempt/correlation mismatch quarantine; blocked route gap; duplicate zero feedback/write; tests Bus/Observation separation and one call. |
| `IF-05` `InboundEventEnvelope<ObservationStatusFeedbackPayload>` | consumer service; Observation feedback | `ExternalSubmissionStore::get_attempt`; `SafeEventCollaborationPort::resolve_observation(ValidateInbound)`; `ObservationMaterialRef::from_formal_source` | same claim/read/Port/phase-2 shape as IF-04, but independent Store method | append-only Observation ref; no observed-success/body/store retention truth | route/source mismatch, blocked/unavailable, duplicate and commit unknown; tests no Bus cross-write and no Observability store mutation. |

### 5.2 Consumer cross-check

All Consumers validate source actor, envelope version, forbidden-body and digest before any effect.
Only `IF-03` re-enters a subject-owning Command, and it may consume only a committed/replayed
CF-11 result. A reverse lookup is one bounded page; continuation is a typed gap for later Job
processing. Consumer receipt is not broker acknowledgment, delivery status, DLQ, run or evidence.

## 6. Outbound Event closure cards (`OF-01~04`)

### 6.1 Event matrix

| ID / event | Entry / owner | Exact mapper / Port | Phase / local state | Accepted effects | Error / replay / tests |
|---|---|---|---|---|---|
| `OF-01` `ToolContractChanged` | `SafeMaterialContinuationUseCases::continue_material`; safe material service | `map_tool_semantic_event_from_material(SafeMaterialClass::ContractChange)`; `ExternalSubmissionStore::get_material/find_attempt_for_event/create_attempt/save_attempt`; `SafeEventCollaborationPort::submit` | phase-1 Prepared attempt + claim commit; one submit outside UoW; phase-2 CAS disposition/result | immutable event envelope and local attempt; no contract mutation, delivery truth or observation | existing terminal/Prepared/Unknown returned without second call; ambiguous submit -> Unknown; tests body-free payload, identity symmetry, exactly-one call. |
| `OF-02` `CapabilityBindingChanged` | same continuation owner | mapper for `BindingChange`; same attempt Store; one `submit` | same two-phase fence; attempt local terminal only | safe binding fact refs/material attempt; no Binding replacement/invalidation or Hub registry write | source/material mismatch, route blocked, duplicate/unknown; tests successor/ref symmetry and no relation mutation. |
| `OF-03` `ToolOutcomeAuditMaterialAvailable` | same continuation owner | mapper for `OutcomeAudit`; outcome/audit pair source refs; same Store/Port | Prepared -> one submit -> local disposition | event carries safe outcome class/refs only; outcome/audit remains local source truth | tool failure is semantic payload class, not transport failure; ambiguous remains Unknown; tests four outcome classes and no raw body. |
| `OF-04` `ToolConsistencyGapChanged` | same continuation owner | mapper for `ConsistencyGap`; validates allowed transition; same Store/Port | Prepared -> one submit -> local disposition; source gap never changed | notification of exact local gap state, not resolution; no evidence body/alias/run/signoff | illegal transition/source mismatch fails pre-attempt; Prepared/terminal replay no call; tests all allowed transitions and no gap repair. |

### 6.2 Event cross-check

The four event branches share only the closed material-to-event mapper and attempt fence. They do
not share a generic event payload or a retry loop. `Prepared` and `SubmissionOutcomeUnknown` remain
manual/recovery surfaces; no branch claims downstream accepted, delivered or observed.

## 7. Operations Job closure cards (`JF-01~04`)

### 7.1 Job matrix

| ID / DTO | Entry / owner | Exact target/read/write seams | Phase / version / cursor | State + report effect | Error / replay / tests |
|---|---|---|---|---|---|
| `JF-01` `CheckCapabilityBindingConsistencyRequest` -> `JobReport` | `ToolJobUseCases::run`; `application::binding_consistency_job` | explicit non-empty `tool_ids`; `CapabilityBindingStore::find_current_by_tool`; Bound-only `HubControlledSourcePort::resolve_snapshot`; write `append_snapshot/append_assessment`, `ProjectionStore::create_gap/write_consistency_report` | claim UoW commit; deterministic `(tool_id,binding_id)` target; one target UoW; `HubSnapshotRef` from Store; `JobReport.job: ToolJobName` | missing relation unchanged; explicit-unbound assessment without Hub; bound snapshot/assessment/gap; report refs/counts durable | empty IDs invalid (not all-scan), blocked Hub partial/blocked, duplicate report no target call, CAS/commit unknown resolve; tests duplicate IDs, watermark/cursor and fake/durable parity. |
| `JF-02` `CheckReferenceIntegrityRequest` -> `JobReport` | `ToolJobUseCases::run`; `application::reference_integrity_job` | typed target-kind matrix; named local Store/Port only; `ProjectionStore::append_reference_assessment/create_gap/write_consistency_report`; `SharedContractAuthority` explicitly blocked | claim then bounded target page at `source_watermark`; target UoW per assessment/gap; no invented authority query | Valid/Missing/Blocked/Conflicting immutable assessments; report Partial/Blocked as durable refs; absence never closes gap | unsupported seam -> Unverifiable/Blocked; un-attributable target fails without fabricated subject; duplicate no rescan; tests all target kinds, source watermark, no repair. |
| `JF-03` `RebuildToolDerivedViewsRequest` -> `JobReport` | `ToolJobUseCases::run`; `application::derived_view_rebuild_job` | `ProjectionStore::list_projection_targets`; closed local source bundle match; pure projector; exact `write_consistency_report/write_search_projection/write_diff_summary/write_diagnostic_summary/write_consumer_guidance` | claim -> stable Store-provided target page -> one compare-write UoW per target -> report UoW; `Applied/AlreadyCurrent/StaleInput/Conflict/Unavailable` preserved | only D1 projection/report writes; source truth unchanged; output refs include write result/gap | missing bundle/watermark conflict no fallback; duplicate skips list/project/write; commit unknown same authority; tests all five view kinds and no external calls. |
| `JF-04` `RefreshExternalStatusRefsRequest` -> `JobReport` | `ToolJobUseCases::run`; `application::external_status_refresh_job` | explicit attempt IDs or one bounded `ExternalSubmissionStore::list_attempts`; latest Bus/Observation read; one matching `SafeEventCollaborationPort::resolve_bus_delivery/resolve_observation(ResolveStored)`; append corresponding status/gap | claim -> local attempt read; fresh filter may skip; one external call outside UoW; phase-2 status/gap UoW; final report; scope passed explicitly to target helper | append-only status refs/gaps; Bus and Observation independent; local SubmittedLocally never promoted | `only_unknown_or_stale` is typed scope arg; ambiguous/blocked/unavailable no second call; duplicate zero list/get/call/write; tests exactly-one call and phase-2 commit unknown. |

### 7.2 Job cross-check

`JobReport.job` is always `ToolJobName`; `ToolJobKind` is not emitted. All Job target selection is
bounded and cursor/watermark scoped. Jobs never own scheduler/run/lease/evidence/signoff truth and
never repair Contract, Binding, Invocation, Outcome or Audit. `JF-04` is the only Job with an
external Port call, and its `ResolveStored` request is built solely from the loaded attempt.

## 8. Full cross-flow phase / state / effect audit

### 8.1 Phase and external-call fence

| Audit item | CF | QF | IF | OF | JF | Result |
|---|---|---|---|---|---|---|
| Entry has no direct Store/Port/UoW access | pass | pass | pass | pass | pass | pass |
| Duplicate precheck precedes domain mutation | pass | N/A | pass | pass | pass | pass |
| Query has zero UoW and zero external Port | N/A | 11/11 | N/A | N/A | N/A | pass |
| Consumer phase-1 claim precedes observational Port/read | N/A | N/A | 5/5 | N/A | N/A | pass |
| Side-effecting external call follows committed marker | CF-10/12 | N/A | N/A | 4/4 | JF-04 feedback only | pass |
| External call is outside local UoW | CF-10/12 | N/A | IF-01/02/04/05 | OF-01~04 | JF-04 | pass |
| Ambiguous external call forbids automatic second call | CF-10/12 | N/A | 5/5 | 4/4 | JF-04 | pass |
| Commit unknown uses same authority resolution | 13/13 | N/A | 5/5 | 4/4 | 4/4 | pass |

### 8.2 State ownership and forbidden transitions

| State subject | Owning flow(s) | Allowed transition source | Forbidden inference checked |
|---|---|---|---|
| `ToolContract` / definition lifecycle | CF-01~04 | owning Commands only | Query/Job cannot adopt, retire or repair; old invocation anchors do not move. |
| `CapabilityBinding` | CF-05~07 | owning Commands only | IF/JF assessments never mutate relation; no registry scan or null-to-unbound inference. |
| `ToolInvocation` / admission | CF-08~09 | immutable creation + admission facts | late Hub/Auth/Sandbox clue cannot rewrite historical invocation/admission. |
| `ExecutionRequirement` / assessments | CF-09 | append-only consumption facts | requirement is not authorization truth; blocked source never becomes allow. |
| `ExecutionHandoff` / attempt | CF-10 | local handoff transition | Prepared/Unknown is not accepted/run/capture/receipt; no host fallback. |
| `ExecutionSourceAssessment` / outcome-audit pair | CF-11 / IF-03 | source acceptance Command | source clue cannot create outcome without formal mapping; pair is atomic. |
| `SafeHandoffEligibility` / material / external attempt | CF-12 / OF | local eligibility/material and continuation | local attempt is not Bus/Observation delivery. |
| `ConsistencyGap` | CF-13 and detection flows | detection opens; resolution Command verifies; event only reports | absence, event delivery or fabricated evidence cannot resolve gap. |
| Assessment / snapshot / external ref | IF/JF/Query | append/read-only | immutable point-in-time fact cannot overwrite prior basis. |
| Projection/report | QF/JF/Commands stale mark | D1 compare-write / stale marker | projection never writes T1/T2 truth. |
| Idempotency / stored result / receipt / report | all writes | exact digest + typed stored surface | in-flight/unknown never replayed as success. |

### 8.3 Accepted side-effect inventory

| Flow family | T1/T2 truth | Assessment/gap | D1 stale/projection | Stored surface | Trace/audit/outbox | External side effect |
|---|---|---|---|---|---|---|
| CF | CF-01~08, CF-10/11 local handoff/outcome facts | CF-05/07/09/11/13 as applicable | bounded stale pages; no hidden rebuild | command result/error in every accepted/rejected replayable write | local audit/outbox only where Step 7/flow explicitly names it; no invented event | CF-10 Sandbox submit; CF-12 delegates OF |
| QF | none | none | read only | none | none | none |
| IF | IF-03 formal CF-11 only | IF-01/02/04/05 | bounded continuation gap only | consumer receipt atomically with local effects | optional marker trace only if named; no broker ack | observational Port calls only |
| OF | material/attempt local only | gap from local response | none | continuation result and attempt view | semantic event material already committed | exactly one collaboration submit per eligible attempt |
| JF | no Contract/Binding/Invocation/Outcome repair | assessment/status/gap append | JF-03 projection/report; JF-01/02 reports | JobReport | none unless a named local marker is part of Store contract | JF-01 Hub read; JF-04 feedback; others none |

### 8.4 Error / replay / re-entry audit

| Condition | Required disposition | Cross-flow rule |
|---|---|---|
| Deterministic invalid input | typed `InvalidInput`, zero mutation unless protocol explicitly stores a replayable rejection | Must not be changed into generic retry. |
| Missing addressable subject | `NotFound` or safe anti-enumeration surface | Query/Job cannot invent a subject from string or page row. |
| Owner/source blocked | `Blocked`/`Unavailable`/conservative assessment + attributable gap | Keep `L2T-UP-001~009` open; no positive provider claim. |
| Optimistic conflict | `Conflict` or integrity gap; rollback current UoW | Never overwrite or retry with a guessed version. |
| Same key and same digest | replay exact stored typed value/error/receipt/report | No domain transition, rescan or external call. |
| Same key and different digest | `Conflict`, zero target effect | No replacement of existing stored result. |
| Equal active claim | in-flight / `RetrySameInput` / manual recovery | Do not create a second claim or receipt. |
| Commit outcome unknown | same-authority `resolve_commit`; unresolved -> blocked/manual | Never blind rerun, especially after external call. |
| Late source/feedback clue | new assessment/ref/gap at consumption time | Never mutate historical invocation/outcome/audit. |

### 8.5 Cross-family naming and seam audit

| Check | Result | Evidence |
|---|---|---|
| 37 protocol IDs map one-to-one to flow IDs | pass | Step 8 protocol-to-flow matrix + §§3~7 |
| Every external call names a Step 7 Port method and mode | pass | CF/IF/OF/JF matrices; no generic Port |
| Bus and Observation reads/writes remain independent | pass | IF-04/05, JF-04, QF-06 |
| `HubSnapshotRef` is the only snapshot ref | pass | §1.3; Step 6/7 recalibration |
| Job report field has one authority | pass | `JobReport.job: ToolJobName`; §1.3 and §7 |
| No flow adds agent loop/LLM planning/runtime orchestration | pass | all family no-repair boundaries |
| No flow adds registry/marketplace/SDK/sandbox isolation truth | pass | §3.2, §4.2, §5.2, §6.2, §7.2 |
| No flow fabricates run/evidence/commit/test/signoff facts | pass | shared phase/error rules |

## 9. Historical material and blocker audit

### 9.1 Historical material retained but not adopted

| Material | Conflict | Current treatment |
|---|---|---|
| Step 8 old empty `tool_ids` = all bindings | Step 7 has no global binding enumerator | `historical_material`; JF-01 requires explicit non-empty IDs. |
| Step 6 `JobReport.job_kind: ToolJobKind` draft | Step 8 public carrier uses `job: ToolJobName` | `historical_material`; canonical mapping recorded, no dual field. |
| Old `HubControlledSnapshotRef` alias | Step 6/7 canonical type is `HubSnapshotRef` | forbidden alias in formal 03. |
| Generic `ReferencePort` / authority lookup | No formal Step 7 seam for Core authority | JF-02 returns blocked/unverifiable; no invented trait. |
| Event annex old “next step write Job” note | Job annex already completed | superseded by current R-9 sequence; no workflow meaning. |
| README / old formal 03 Rust service, RPC, DB, MCP, policy, builtin claims | Contradicts current runtime action-contract boundary | historical only; not assembled. |

### 9.2 Open upstream blockers

| ID | Owner / impact | R-9 handling |
|---|---|---|
| `L2T-UP-001~002` | Authorization owner/source/taxonomy; CF-09, IF-02, JF-02 | conservative assessment and fail-closed; no positive decision schema. |
| `L2T-UP-003~004` | Sandbox mapping/receipt/dead-letter; CF-10, JF-02/04, OF | local handoff/attempt only; no execution acceptance or retry truth. |
| `L2T-UP-005~006` | Observability producer/source/route; IF-05/JF-04/QF-06 | unknown/blocked observation ref; no store/retention/observed claim. |
| `L2T-UP-007` | unfrozen workspace baseline; all future implementation claims | no commit or readiness assertion. |
| `L2T-UP-008` | Core shared-contract authority/schema; CF-01/02/JF-02 | candidate-only/blocked; no Tools-specific Core type. |
| `L2T-UP-009` | SDK client seam; QF-11/downstream handoff | guidance view only; no client/wrapper. |

No new upstream blocker was discovered in R-9. These blockers do not prevent local negative,
assessment, replay and bounded-flow design, but they prevent any claim of external positive
provider, schema, route, readiness, delivery, observation, SDK or implementation readiness.

## 10. R-9 stop review

| Gate | Result | Closure |
|---|---|---|
| 13 Commands each have DTO, entry, object, seam, UoW, state, effect, error, replay and tests | pass | §3.1 + Command annex |
| 11 Queries are resolver-first and zero-write | pass | §4.1 + Query annex |
| 5 Consumers have claim-before-read and typed receipt | pass | §5.1 + Consumer annex |
| 4 outbound Events have Prepared/one-call/phase-2 fence | pass | §6.1 + Event annex |
| 4 Jobs are bounded, reportable and no-repair | pass | §7.1 + Job annex |
| All 37 flows appear exactly once | pass | `13 + 11 + 5 + 4 + 4 = 37` |
| Cross-flow phase/state/effect/error/replay audit has no unresolved local conflict | pass | §8 |
| Historical aliases and unsupported seams are explicitly fenced | pass | §9 |
| Formal 03 write gate | closed until Step 19 | Step 19 only may assemble formal document |

```text
r9_status = completed / pass
flow_count = 37
current_step = Step 9
next_allowed_action = create Step 10 state-matrix intermediate product
formal_03_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
