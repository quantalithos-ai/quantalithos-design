# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
> 回填章节: `03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约
> 生成日期: 2026-06-09
> 状态: 已完成

---

### 1. Step 状态

| 项目 | 状态 |
|---|---|
| Step 1 upstream boundary | 已完成 |
| Step 2 scope | 已完成 |
| Step 3 constraints | 已完成 |
| Step 4 file layout | 已完成 |
| Step 5 module contracts | 已完成 |
| Step 6 object contracts | 已完成 |
| Step 7 trait / port / adapter contracts | 已完成 |
| Step 8 protocol contracts | 已完成 |

本 Step 只生成 `design-calibration/03_ddd_step_08_protocol_contracts.md` 中间产物,不直接编辑正式 `03-详细设计.md`。正式文档装配必须留到 Step 19。

---

### 2. 本步目标

把 HLD Step 7 的接口骨架和 Step 6 / Step 7 已闭合的对象、port、result store、outbox payload snapshot、projection marker、page helper 转换为可以 1:1 落码的协议契约。

本步必须覆盖:

- 同步 Command API。
- 同步 Query API。
- Inbound Event Consumer 协议。
- Outbound Event 协议与 outbox payload snapshot 口径。
- Operations Job 输入、输出、report 与 duplicate replay surface。

本步不定义函数级处理流、事务边界、状态转换矩阵、错误恢复策略、配置绑定、测试 case 或实施 commit boundary。这些分别由 Step 9~17 继续收口。

---

### 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command / Query / Consumer / Event / Job 名称和边界 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 request/result/event/job 必须引用的对象、view、marker、state、ref、reason |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository page、outbox snapshot、stored result、publisher、resolver、handoff port |
| `设计真相源闭环与可落码性标准.md` | 已生效 | 校验 public DTO 二级类型、字段来源、构造闭环、重复回放和 payload snapshot |
| `详细设计讨论流程_SOP.md` | 已生效 | 要求按协议族分批停审,不得一次性平铺全仓 schema |

---

### 4. 分批写入计划

> 分批写入只限制单次写入规模,不限制章节最终详尽程度。若一个协议族超过单批容量,继续拆成多批补全字段、映射、错误和停审记录。

| 批次 | 协议族 | 内容 | 状态 |
|---|---|---|---|
| 8.0 | shared protocol helper | 协议总纪律、operation / route / envelope / result / page / error helper、协议总表 | [x] 已写入 |
| 8.1-a | Command shared + context / input / gate / decision | command envelope/result、前 6 个 command DTO | [x] 已写入 |
| 8.1-b | Approval / policy command | approval、policy、shared rules、conflict command DTO | [x] 已写入 |
| 8.1-c | Control / compliance / nonconformity command | control、AIIA、SoA、nonconformity、corrective command DTO | [x] 已写入 |
| 8.2-a | Query shared + context / decision / approval | query response/page/visibility surface、前 5 个 query DTO | [x] 已写入 |
| 8.2-b | Policy / control / compliance / nonconformity query | policy、control、compliance、nonconformity query DTO | [x] 已写入 |
| 8.2-c | Search / trace / dashboard / reconciliation query | search page、trace view、dashboard、reconciliation response | [x] 已写入 |
| 8.3-a | Inbound event shared | event envelope、dedup、receipt、unsupported / delayed / rejected 口径 | [x] 已写入 |
| 8.3-b | Inbound event payloads | 9 个 inbound consumer payload schema 与 snapshot / stale marker 映射 | [x] 已写入 |
| 8.4-a | Outbound event shared | outbound envelope、topic map、payload snapshot builder、publisher contract | [x] 已写入 |
| 8.4-b | Outbound truth payloads | context/gate/decision/approval/policy/shared/conflict/control/compliance/nonconformity events | [x] 已写入 |
| 8.4-c | Outbound trace / derived payloads | trace available、derived view changed、schema version / snapshot audit | [x] 已写入 |
| 8.5-a | Operations job shared | job metadata/input/result/report、stored job report duplicate replay | [x] 已写入 |
| 8.5-b | Operations job DTOs | 7 个 job input/output schema 与 port / report 映射 | [x] 已写入 |
| 8.6 | final audit | public secondary type closure、DTO -> object/port/flow audit、停审记录 | [x] 已写入 |

---

### 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮需要定义哪些协议? | HLD Step 7 中列出的 22 个 Command、14 个 Query、9 个 Inbound Consumer、12 个 Outbound Event、7 个 Operations Job 全部进入本 Step。 |
| API / Command / Query / Event / Job 是否按协议族拆分? | 是。Command 按业务模块拆分;Query 按 view / projection surface 拆分;Event 分 inbound/outbound;Job 分 shared metadata 和具体 job。 |
| 每个 request / response / event / job 是否要有字段级 schema? | 是。每个 public DTO 必须列字段、类型、来源、目标对象 / port、必填约束和禁止保存的正文。 |
| 二级公开类型是否必须闭合? | 是。只要字段类型出现在 public DTO / event / job / receipt / report 中,必须在 Step 6 已定义或在本 Step 明确归属和 schema。 |
| Query denied 如何表达? | Query denied 不映射为普通 error,而是返回 `GovernanceVisibilityMarker.is_visible = false` 的 not-visible surface;body 必须为空或 redacted。 |
| Page helper 如何映射? | Public `GovernancePageRequest/GovernancePageInfo` 映射到 Step 7 `GovernanceRepositoryPage/Page<T>`;cursor opaque,limit guard 留给 Step 14。 |
| Inbound unsupported version 如何处理? | 返回 worker receipt / item result `UnsupportedVersion`,不解析 payload、不写 snapshot、不 mark stale、不保存外部正文。 |
| Outbound payload 何时生成? | accepted transaction 内由 Step 8 payload builder 从 committed truth change / trace / visibility marker 生成 serialized snapshot;publisher 只读取 stored snapshot。 |
| Job duplicate 如何处理? | 通过 Step 7 stored result repository 读取 `JobReport` surface;duplicate 不重新扫描、不重新发布、不重建 projection。 |
| 每个协议族何时停审? | 每个协议族写完后记录 DTO 构造闭环、二级类型闭环、错误/幂等/actor/metadata 闭环和后续 Step 9 flow 承接情况。 |

---

### 6. 协议总表

#### 6.1 Command protocol inventory

| Command | Request DTO | Response DTO | 目标对象 / 结果 | Operation name |
|---|---|---|---|---|
| `CreateGovernanceContext` | `CreateGovernanceContextRequest` | `GovernanceContextCommandResult` | `GovernanceContext` | `CreateGovernanceContext` |
| `SubmitGovernanceInput` | `SubmitGovernanceInputRequest` | `GovernanceInputCommandResult` | `GovernanceInput` | `SubmitGovernanceInput` |
| `UpdateGovernanceInputState` | `UpdateGovernanceInputStateRequest` | `GovernanceInputCommandResult` | `GovernanceInput` | `UpdateGovernanceInputState` |
| `OpenGovernanceGate` | `OpenGovernanceGateRequest` | `GateCommandResult` | `Gate` | `OpenGovernanceGate` |
| `RecordGovernanceDecision` | `RecordGovernanceDecisionRequest` | `GovernanceDecisionCommandResult` | `GovernanceDecision` / `Gate` | `RecordGovernanceDecision` |
| `SupersedeGovernanceDecision` | `SupersedeGovernanceDecisionRequest` | `GovernanceDecisionCommandResult` | `GovernanceDecision` | `SupersedeGovernanceDecision` |
| `AssignApprovalResponsibility` | `AssignApprovalResponsibilityRequest` | `ApprovalResponsibilityCommandResult` | `ApprovalResponsibility` / `ResponsibilityChain` | `AssignApprovalResponsibility` |
| `RecordApprovalVote` | `RecordApprovalVoteRequest` | `ApprovalResponsibilityCommandResult` | `ApprovalResponsibility` / `ResponsibilityChain` | `RecordApprovalVote` |
| `DelegateApprovalResponsibility` | `DelegateApprovalResponsibilityRequest` | `ApprovalResponsibilityCommandResult` | `ApprovalResponsibility` | `DelegateApprovalResponsibility` |
| `ActivatePolicyEffectiveFact` | `ActivatePolicyEffectiveFactRequest` | `PolicyCommandResult` | `PolicyEffectiveFact` | `ActivatePolicyEffectiveFact` |
| `UpdatePolicyEffectiveFactState` | `UpdatePolicyEffectiveFactStateRequest` | `PolicyCommandResult` | `PolicyEffectiveFact` | `UpdatePolicyEffectiveFactState` |
| `UpdateSharedRuleSet` | `UpdateSharedRuleSetRequest` | `SharedRuleCommandResult` | `SharedRuleSet` | `UpdateSharedRuleSet` |
| `ResolvePolicyConflict` | `ResolvePolicyConflictRequest` | `PolicyConflictCommandResult` | `PolicyConflictRecord` | `ResolvePolicyConflict` |
| `AssessControlApplicability` | `AssessControlApplicabilityRequest` | `ControlCommandResult` | `ControlApplicability` | `AssessControlApplicability` |
| `RecordControlReview` | `RecordControlReviewRequest` | `ControlReviewCommandResult` | `ControlReview` | `RecordControlReview` |
| `SubmitAIIAConclusion` | `SubmitAIIAConclusionRequest` | `ComplianceConclusionCommandResult` | `AIIAConclusion` | `SubmitAIIAConclusion` |
| `SubmitSoAConclusion` | `SubmitSoAConclusionRequest` | `ComplianceConclusionCommandResult` | `SoAConclusion` | `SubmitSoAConclusion` |
| `ApproveComplianceConclusion` | `ApproveComplianceConclusionRequest` | `ComplianceConclusionCommandResult` | `AIIAConclusion` / `SoAConclusion` | `ApproveComplianceConclusion` |
| `RaiseNonconformity` | `RaiseNonconformityRequest` | `NonconformityCommandResult` | `NonconformityRecord` | `RaiseNonconformity` |
| `ConfirmNonconformityCause` | `ConfirmNonconformityCauseRequest` | `NonconformityCommandResult` | `NonconformityRecord` | `ConfirmNonconformityCause` |
| `PlanCorrectiveAction` | `PlanCorrectiveActionRequest` | `CorrectiveActionCommandResult` | `CorrectiveAction` / `NonconformityRecord` | `PlanCorrectiveAction` |
| `CompleteCorrectiveAction` | `CompleteCorrectiveActionRequest` | `CorrectiveActionCommandResult` | `CorrectiveAction` | `CompleteCorrectiveAction` |
| `VerifyNonconformity` | `VerifyNonconformityRequest` | `NonconformityCommandResult` | `VerificationResult` / `NonconformityRecord` | `VerifyNonconformity` |

#### 6.2 Query protocol inventory

| Query | Request DTO | Response DTO | 读取目标 | Operation name |
|---|---|---|---|---|
| `GetGovernanceContext` | `GetGovernanceContextRequest` | `GovernanceQueryResponse<GovernanceContextView>` | context truth summary | `GetGovernanceContext` |
| `GetGovernanceInput` | `GetGovernanceInputRequest` | `GovernanceQueryResponse<GovernanceInputView>` | input truth summary | `GetGovernanceInput` |
| `GetGateDecision` | `GetGateDecisionRequest` | `GovernanceQueryResponse<DecisionSummaryView>` | gate / decision view | `GetGateDecision` |
| `ListPendingGovernanceDecisions` | `ListPendingGovernanceDecisionsRequest` | `GovernancePageResponse<DecisionSummaryView>` | decision projection page | `ListPendingGovernanceDecisions` |
| `GetApprovalResponsibility` | `GetApprovalResponsibilityRequest` | `GovernanceQueryResponse<ApprovalResponsibilityView>` | responsibility truth summary | `GetApprovalResponsibility` |
| `GetPolicyEffectiveView` | `GetPolicyEffectiveViewRequest` | `GovernanceQueryResponse<PolicyEffectiveView>` | policy projection | `GetPolicyEffectiveView` |
| `GetPolicyConflict` | `GetPolicyConflictRequest` | `GovernanceQueryResponse<PolicyConflictView>` | conflict truth summary | `GetPolicyConflict` |
| `GetControlCoverage` | `GetControlCoverageRequest` | `GovernanceQueryResponse<ControlCoverageView>` | control coverage projection | `GetControlCoverage` |
| `GetComplianceConclusion` | `GetComplianceConclusionRequest` | `GovernanceQueryResponse<ComplianceConclusionView>` | AIIA / SoA truth summary | `GetComplianceConclusion` |
| `GetNonconformityStatus` | `GetNonconformityStatusRequest` | `GovernanceQueryResponse<NonconformityStatusView>` | nonconformity projection | `GetNonconformityStatus` |
| `SearchGovernanceFacts` | `SearchGovernanceFactsRequest` | `GovernancePageResponse<GovernanceFactSearchResultItem>` | fact search projection | `SearchGovernanceFacts` |
| `GetGovernanceTrace` | `GetGovernanceTraceRequest` | `GovernancePageResponse<GovernanceTraceRecordView>` | trace record page | `GetGovernanceTrace` |
| `GetGovernanceDashboard` | `GetGovernanceDashboardRequest` | `GovernanceQueryResponse<GovernanceDashboardView>` | dashboard projection | `GetGovernanceDashboard` |
| `GetGovernanceReconciliationReport` | `GetGovernanceReconciliationReportRequest` | `GovernanceQueryResponse<GovernanceReconciliationReportView>` | reconciliation report | `GetGovernanceReconciliationReport` |

#### 6.3 Event and job protocol inventory

| 协议类别 | 数量 | 本 Step 覆盖 |
|---|---:|---|
| Inbound Event Consumer | 9 | envelope、payload、receipt、dedup、unsupported version、snapshot / stale marker 映射 |
| Outbound Event | 12 | envelope、topic key、event schema version、payload、stored outbox snapshot 映射 |
| Operations Job | 7 | metadata、input、output、report、duplicate replay、partial failure surface |

---

### 7. Shared protocol helper

#### 7.1 协议归属与命名

```rust
/// Names a public Governance command protocol.
pub struct GovernanceCommandName(pub String);

/// Names a public Governance query protocol.
pub struct GovernanceQueryName(pub String);

/// Names a public Governance inbound event consumer.
pub struct GovernanceInboundConsumerName(pub String);

/// Names a public Governance outbound event protocol.
pub struct GovernanceOutboundEventName(pub String);

/// Names a public Governance operations job protocol.
pub struct GovernanceJobName(pub String);

/// Identifies a public Governance protocol surface without binding HTTP, RPC, queue, or cron.
pub struct GovernanceProtocolSurfaceRef(pub String);
```

| 类型 | 作用 | 来源 / 约束 |
|---|---|---|
| `GovernanceCommandName` | command DTO / result / route 映射名 | 必须等于 §6.1 command 名称之一;非空 |
| `GovernanceQueryName` | query DTO / response / route 映射名 | 必须等于 §6.2 query 名称之一;非空 |
| `GovernanceInboundConsumerName` | inbound consumer 名称 | 必须等于 §8.3 payload 表中的 consumer 名称之一 |
| `GovernanceOutboundEventName` | outbound event 名称 | 必须能映射到 `GovernanceOutboxEventKind` |
| `GovernanceJobName` | operations job 名称 | 必须等于 Step 6 `GovernanceOperationsJobKind` 之一 |
| `GovernanceProtocolSurfaceRef` | stored result / route / topic-neutral surface ref | 不保存 transport path、topic secret、payload body 或 handler name |

#### 7.2 Command request / response envelope

```rust
/// Public command request envelope.
pub struct GovernanceCommandRequest<T> {
    /// Trusted actor context injected by the inbound boundary.
    pub actor: ActorContext,
    /// Core command metadata.
    pub metadata: CommandMetadata,
    /// Governance command operation name.
    pub command_name: GovernanceCommandName,
    /// Command-specific request payload.
    pub body: T,
}

/// Public command response envelope.
pub struct GovernanceCommandResponse<T> {
    /// Stored application result ref.
    pub result_ref: GovernanceApplicationResultRef,
    /// Command operation name.
    pub command_name: GovernanceCommandName,
    /// Command-specific result payload.
    pub result: T,
    /// Trace records appended by the accepted command.
    pub trace_refs: GovernanceTraceRecordRefSet,
    /// Outbox records appended by the accepted command.
    pub outbox_refs: GovernanceOutboxRefSet,
}
```

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `actor` | `ActorContext` | trusted API boundary | 必填;handler 不从 body 推导 actor |
| `metadata` | `CommandMetadata` | API / SDK command metadata | 必须含 core trace id 和 idempotency key 来源 |
| `command_name` | `GovernanceCommandName` | route / handler mapping | 必须与 body DTO 匹配 |
| `body` | `T` | request DTO | 不得携带外部正文;只携带 refs、summary refs、reason、intent |
| `result_ref` | `GovernanceApplicationResultRef` | IdGenerator + StoredGovernanceResultRepository | duplicate replay 返回同一个 ref |
| `result` | `T` | command service result DTO | 必须能回指 changed truth refs |
| `trace_refs` | `GovernanceTraceRecordRefSet` | accepted transaction trace append | rejected / duplicate replay 不新建 trace |
| `outbox_refs` | `GovernanceOutboxRefSet` | accepted transaction outbox append | 只来自 truth change;query / validation failure 不生成 |

#### 7.3 Query request / response envelope

```rust
/// Public query request envelope.
pub struct GovernanceQueryRequest<T> {
    /// Trusted actor context injected by the inbound boundary.
    pub actor: ActorContext,
    /// Core query metadata.
    pub metadata: QueryMetadata,
    /// Governance query operation name.
    pub query_name: GovernanceQueryName,
    /// Query-specific request body.
    pub body: T,
}

/// Public single-body query response.
pub struct GovernanceQueryResponse<T> {
    /// Query operation name.
    pub query_name: GovernanceQueryName,
    /// Shared public response surface.
    pub surface: GovernanceViewSurface,
    /// Response body when visible.
    pub body: Option<T>,
}

/// Public paged query response.
pub struct GovernancePageResponse<T> {
    /// Query operation name.
    pub query_name: GovernanceQueryName,
    /// Shared public response surface.
    pub surface: GovernanceViewSurface,
    /// Page information mapped from repository / projection page.
    pub page_info: GovernancePageInfo,
    /// Visible page items.
    pub items: Vec<T>,
}
```

| 规则 | 说明 |
|---|---|
| not visible body | `surface.visibility.is_visible == false` 时 `body = None` 且 `items` 必须为空 |
| degraded query | degraded / stale / unavailable 只写 `surface.degraded` / `surface.freshness`,不得在 query 内 refresh / rebuild |
| page mapping | Step 7 `Page<T>.items` 映射到 `items`;`next_cursor` 映射到 `GovernancePageInfo.next_cursor`;`has_more = next_cursor.is_some()` |
| query no idempotency | Query 不使用 `GovernanceOperationIdempotencyKey`,不保存 stored result,不 append outbox |

#### 7.4 Protocol error and validation surface

```rust
/// References a redacted public protocol validation issue.
pub struct GovernanceProtocolValidationIssueRef(pub String);

/// Ordered unique protocol validation issue refs.
pub struct GovernanceProtocolValidationIssueRefSet(pub Vec<GovernanceProtocolValidationIssueRef>);

/// Public protocol-level rejection surface.
pub struct GovernanceProtocolRejection {
    /// Protocol surface that rejected the request.
    pub surface_ref: GovernanceProtocolSurfaceRef,
    /// Redacted validation issue refs.
    pub issue_refs: GovernanceProtocolValidationIssueRefSet,
    /// Optional degraded marker for dependency or adapter unavailable cases.
    pub degraded: Option<GovernanceDegradedMarker>,
}
```

| 规则 | 说明 |
|---|---|
| validation issue body-free | issue ref 不保存 request body、event body、adapter response、stack trace 或 secret |
| application error mapping | 具体 `ApplicationError` / `DomainError` 到 protocol rejection 的映射留给 Step 12;本 Step 固定 payload surface |
| policy denied command | command policy denied 是 rejected error surface,不得伪造 command result / trace / outbox |
| query visibility denied | query visibility denied 不走 `GovernanceProtocolRejection`,而走 `GovernanceQueryResponse.surface.visibility` |

---

### 8. Command API protocol

Command API 是唯一同步改写 Governance truth / history / trace / outbox 的 public protocol family。所有 Command 必须使用 `GovernanceCommandRequest<T>` envelope,并通过 `CommandMetadata` 提供 core trace id、idempotency key 和请求 digest 来源。Command body 只能携带 ref、safe summary ref、reason、state intent 和 body-free intent,不得携带 process/work/artifact/method/runtime/conversation/external GRC 正文。

#### 8.1 Command shared result and secondary types

```rust
/// Summarizes the accepted truth side effects returned by a command result.
pub struct GovernanceCommandEffectSummary {
    /// Source cursor after the accepted truth change.
    pub source_cursor: GovernanceTruthCursor,
    /// Changed outbox subjects.
    pub subject_refs: Vec<GovernanceOutboxSubjectRef>,
    /// Trace records appended in the accepted transaction.
    pub trace_refs: GovernanceTraceRecordRefSet,
    /// Outbox records appended in the accepted transaction.
    pub outbox_refs: GovernanceOutboxRefSet,
}

/// Body-free approval requirement intent carried by command DTOs.
pub struct ApproverRequirementIntent {
    /// Optional role required for approval.
    pub required_role_ref: Option<RoleRef>,
    /// Capabilities required for approval.
    pub required_capability_refs: CapabilityRefSet,
    /// Approval threshold required by policy or command intent.
    pub approval_threshold: ApprovalThreshold,
    /// Delegation rule requested for this responsibility.
    pub delegation_rule: DelegationRule,
}

/// Specifies how RecordGovernanceDecision should finalize a proposed decision.
pub enum GovernanceDecisionFinalizationIntent {
    /// Create the decision as proposed without finalizing it.
    ProposedOnly,
    /// Approve the decision with an evidence basis.
    Approve { basis_ref: EvidenceSummaryRef },
    /// Reject the decision with a reason and optional evidence basis.
    Reject {
        reason: GovernanceRejectReason,
        basis_ref: Option<EvidenceSummaryRef>,
    },
    /// Waive the decision with a reason and optional evidence basis.
    Waive {
        reason: GovernanceWaiveReason,
        basis_ref: Option<EvidenceSummaryRef>,
    },
}
```

| 类型 / 字段 | 来源 | 目标 | 约束 |
|---|---|---|---|
| `GovernanceCommandEffectSummary.source_cursor` | accepted transaction | trace/outbox/reconciliation 对齐 | opaque;不得当 optimistic version |
| `subject_refs` | `GovernanceTruthChange.subject_ref` | outbound event and stale marker audit | 每个 changed truth 至少一个 subject ref |
| `ApproverRequirementIntent` | command body / policy summary | `ApproverRequirement::from_policy` 或 application requirement builder | 不保存 role / capability body |
| `GovernanceDecisionFinalizationIntent` | decision command body | `GovernanceDecision.approve/reject/waive` | `ProposedOnly` 不得被下游当 final outcome |

#### 8.2 Command result DTOs for context, input, gate and decision

```rust
/// Command result for GovernanceContext mutations.
pub struct GovernanceContextCommandResult {
    /// Changed context ref.
    pub context_ref: GovernanceContextRef,
    /// Current context state after the command.
    pub context_state: GovernanceContextState,
    /// Governed subject covered by the context.
    pub subject_ref: GovernedSubjectRef,
    /// Source supporting the context.
    pub source_ref: GovernanceSourceRef,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for GovernanceInput mutations.
pub struct GovernanceInputCommandResult {
    /// Changed input ref.
    pub input_ref: GovernanceInputRef,
    /// Actor that received or most recently transitioned the input.
    pub actor_ref: ActorRef,
    /// Owning context ref.
    pub context_ref: GovernanceContextRef,
    /// Current input state after the command.
    pub input_state: GovernanceInputState,
    /// Optional pending evidence ref.
    pub pending_evidence_ref: Option<EvidenceSummaryRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for Gate mutations.
pub struct GateCommandResult {
    /// Changed gate ref.
    pub gate_ref: GateRef,
    /// Owning context ref.
    pub context_ref: GovernanceContextRef,
    /// Current gate state after the command.
    pub gate_state: GateState,
    /// Required responsibility when the command bound the gate to a pending decision.
    pub required_responsibility_ref: Option<ApprovalResponsibilityRef>,
    /// Attached decision when the gate is decided.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for GovernanceDecision mutations.
pub struct GovernanceDecisionCommandResult {
    /// Changed decision ref.
    pub decision_ref: GovernanceDecisionRef,
    /// Gate that owns the decision.
    pub gate_ref: GateRef,
    /// Current decision state after the command.
    pub decision_state: GovernanceDecisionState,
    /// Outcome ref recorded on the decision.
    pub outcome_ref: GovernanceDecisionOutcomeRef,
    /// Optional evidence basis.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Later decision when the current decision was superseded.
    pub superseded_by: Option<GovernanceDecisionRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}
```

| Result DTO | 构造来源 | 必须回指 | 禁止事项 |
|---|---|---|---|
| `GovernanceContextCommandResult` | saved `GovernanceContext` + accepted trace/outbox refs | `GovernanceContextRef`、`GovernedSubjectRef`、`GovernanceSourceRef` | 不返回 subject/source body |
| `GovernanceInputCommandResult` | saved `GovernanceInput` | `GovernanceInputRef`、`ActorRef`、`GovernanceContextRef` | 不把 input accepted 当 decision;不返回 actor profile body |
| `GateCommandResult` | saved final `Gate` | `GateRef`、optional responsibility/decision | `OpenGovernanceGate` 无 requirement 时 responsibility 为 `None`;有 requirement 时来自 same-command pending-decision binding;不等同 process waiting gate |
| `GovernanceDecisionCommandResult` | saved `GovernanceDecision` | decision/gate/outcome/basis refs | 不返回 evidence body 或 downstream work |

#### 8.3 Context / input / gate / decision command DTO schema

```rust
/// Creates a Governance context for a governed external subject.
pub struct CreateGovernanceContextRequest {
    /// Governed subject ref.
    pub subject_ref: GovernedSubjectRef,
    /// Source that triggered or supports the context.
    pub source_ref: GovernanceSourceRef,
}

/// Submits an input under an existing Governance context.
pub struct SubmitGovernanceInputRequest {
    /// Existing context ref.
    pub context_ref: GovernanceContextRef,
    /// Input kind.
    pub input_kind: GovernanceInputKind,
    /// Source that produced the input.
    pub source_ref: GovernanceSourceRef,
}

/// Updates a Governance input state.
pub struct UpdateGovernanceInputStateRequest {
    /// Input being updated.
    pub input_ref: GovernanceInputRef,
    /// Target input state requested by the caller.
    pub target_state: GovernanceInputState,
    /// Evidence ref required by PendingEvidence or accepted path.
    pub pending_evidence_ref: Option<EvidenceSummaryRef>,
    /// Reject reason required when target state is Rejected.
    pub reject_reason: Option<GovernanceInputRejectReason>,
    /// Replacement input when target state is Superseded.
    pub superseded_by: Option<GovernanceInputRef>,
}

/// Opens a Governance gate under a ready context.
pub struct OpenGovernanceGateRequest {
    /// Context that owns the gate.
    pub context_ref: GovernanceContextRef,
    /// Gate business kind.
    pub gate_kind: GateKind,
    /// Optional body-free approval requirement intent.
    pub approver_requirement_intent: Option<ApproverRequirementIntent>,
}

/// Records a formal Governance decision for a gate.
pub struct RecordGovernanceDecisionRequest {
    /// Gate waiting for decision.
    pub gate_ref: GateRef,
    /// Decision business kind.
    pub decision_kind: GovernanceDecisionKind,
    /// Outcome ref to record.
    pub outcome_ref: GovernanceDecisionOutcomeRef,
    /// Finalization requested after proposal.
    pub finalization_intent: GovernanceDecisionFinalizationIntent,
}

/// Supersedes an existing finalized Governance decision.
pub struct SupersedeGovernanceDecisionRequest {
    /// Existing decision to supersede.
    pub current_decision_ref: GovernanceDecisionRef,
    /// New decision kind.
    pub next_decision_kind: GovernanceDecisionKind,
    /// New outcome ref.
    pub next_outcome_ref: GovernanceDecisionOutcomeRef,
    /// Finalization requested for the new decision.
    pub next_finalization_intent: GovernanceDecisionFinalizationIntent,
}
```

| Request DTO | 字段来源 | 构造 / 调用目标 | 缺失字段处理 |
|---|---|---|---|
| `CreateGovernanceContextRequest` | caller body + trusted actor envelope | `GovernanceContext::from_subject(new_id, subject_ref, source_ref, actor)` | missing subject/source => rejected before id generation |
| `SubmitGovernanceInputRequest` | caller body + command actor context | `GovernanceInput::receive(new_id, input_kind, source_ref, context_ref, actor_ref)` | missing context/input kind/source/actor => rejected |
| `UpdateGovernanceInputStateRequest` | caller body + loaded input/context | `accept` / `reject` / `wait_for_evidence` / `supersede` | target-specific reason/ref missing => rejected |
| `OpenGovernanceGateRequest` | caller body + loaded context | `Gate::open(new_id, context, gate_kind, actor)`;if `approver_requirement_intent` is absent, final gate remains `Open`;if present, create requirement/responsibility/chain and call `gate.request_decision_by_ref(created_responsibility_ref, context_ref, actor)` before saving final gate | context not ready => policy/domain rejected;missing/invalid requirement intent => rejected;`RecordGovernanceDecision` must not perform the `Open -> PendingDecision` precheck transition |
| `RecordGovernanceDecisionRequest` | caller body + loaded gate | `GovernanceDecision::propose(new_id, gate, kind, outcome, actor)` then `approve(basis_ref, actor)` / `reject(reason, basis_ref, actor)` / `waive(reason, basis_ref, actor)` when finalization intent requests it | finalization-specific required basis/reason missing => rejected;Reject/Waive optional basis is passed through unchanged |
| `SupersedeGovernanceDecisionRequest` | caller body + loaded current decision/gate | create next decision, apply the same finalization mapping, then current `supersede(next_ref, actor)` | current not finalized or next intent invalid => rejected |

#### 8.4 Command route mapping for 8.1-a

| Route / RPC neutral entry | Request envelope | Response envelope | Idempotency |
|---|---|---|---|
| `CreateGovernanceContext` | `GovernanceCommandRequest<CreateGovernanceContextRequest>` | `GovernanceCommandResponse<GovernanceContextCommandResult>` | required |
| `SubmitGovernanceInput` | `GovernanceCommandRequest<SubmitGovernanceInputRequest>` | `GovernanceCommandResponse<GovernanceInputCommandResult>` | required |
| `UpdateGovernanceInputState` | `GovernanceCommandRequest<UpdateGovernanceInputStateRequest>` | `GovernanceCommandResponse<GovernanceInputCommandResult>` | required |
| `OpenGovernanceGate` | `GovernanceCommandRequest<OpenGovernanceGateRequest>` | `GovernanceCommandResponse<GateCommandResult>` | required |
| `RecordGovernanceDecision` | `GovernanceCommandRequest<RecordGovernanceDecisionRequest>` | `GovernanceCommandResponse<GovernanceDecisionCommandResult>` | required |
| `SupersedeGovernanceDecision` | `GovernanceCommandRequest<SupersedeGovernanceDecisionRequest>` | `GovernanceCommandResponse<GovernanceDecisionCommandResult>` | required |

#### 8.5 8.1-a stop-review

| 检查项 | 结论 |
|---|---|
| DTO 能否构造目标对象 | 是。6 个 request 均能回指 Step 6 context/input/gate/decision factory 或 member method。 |
| 二级公开类型是否闭合 | 是。`ApproverRequirementIntent` 和 `GovernanceDecisionFinalizationIntent` 已在本批定义;其他字段均来自 Step 6。 |
| actor / metadata / idempotency 是否闭合 | 是。统一由 `GovernanceCommandRequest<T>` envelope 和 Step 6/7 operation context 承接。 |
| trace / outbox 返回是否闭合 | 是。result 使用 `GovernanceCommandEffectSummary`;具体 append 顺序留给 Step 9 / 11。 |
| 是否保存外部正文 | 否。所有字段均为 ref、state、reason 或 intent。 |

#### 8.6 Approval / policy command result DTOs

```rust
/// Command result for approval responsibility mutations.
pub struct ApprovalResponsibilityCommandResult {
    /// Changed responsibility ref.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Optional chain touched by the command.
    pub chain_ref: Option<ResponsibilityChainRef>,
    /// Owning Governance context.
    pub context_ref: GovernanceContextRef,
    /// Current responsibility state after the command.
    pub responsibility_state: ApprovalResponsibilityState,
    /// Assigned actor, when available.
    pub actor_ref: Option<ActorRef>,
    /// Recorded vote, when available.
    pub vote: Option<GovernanceVote>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for policy effective fact mutations.
pub struct PolicyCommandResult {
    /// Changed policy fact ref.
    pub policy_fact_ref: PolicyEffectiveFactRef,
    /// Scope where the policy applies.
    pub scope_ref: GovernanceScopeRef,
    /// Current policy state after the command.
    pub policy_state: PolicyEffectiveState,
    /// Method policy snapshot used by the current fact.
    pub policy_snapshot: MethodPolicySnapshot,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for shared rule set mutations.
pub struct SharedRuleCommandResult {
    /// Changed shared rule set ref.
    pub rule_set_ref: SharedRuleSetRef,
    /// Scope where the rule set applies.
    pub scope_ref: GovernanceScopeRef,
    /// Current rule set state after the command.
    pub rule_set_state: SharedRuleSetState,
    /// Current rule refs.
    pub rule_refs: SharedRuleRefSet,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for policy conflict mutations.
pub struct PolicyConflictCommandResult {
    /// Changed conflict ref.
    pub conflict_ref: PolicyConflictRef,
    /// Scope where the conflict was handled.
    pub scope_ref: GovernanceScopeRef,
    /// Current conflict state after the command.
    pub conflict_state: PolicyConflictState,
    /// Formal resolution decision when available.
    pub resolution_ref: Option<GovernanceDecisionRef>,
    /// Pending gate when decision is still required.
    pub pending_gate_ref: Option<GateRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}
```

| Result DTO | 构造来源 | 必须回指 | 禁止事项 |
|---|---|---|---|
| `ApprovalResponsibilityCommandResult` | saved responsibility + optional saved chain | responsibility/context/actor/vote refs | 不保存 actor profile 或 capability body |
| `PolicyCommandResult` | saved `PolicyEffectiveFact` | policy fact/scope/snapshot/state | 不保存 AIPolicyDef body |
| `SharedRuleCommandResult` | saved `SharedRuleSet` | rule set/scope/rule refs/state | 不保存 rule expression / standard body |
| `PolicyConflictCommandResult` | saved `PolicyConflictRecord` | conflict/scope/decision/gate refs | 不修改 policy fact 或 rule set truth |

#### 8.7 Approval command DTO schema

```rust
/// Assigns or creates an approval responsibility for a Governance context.
pub struct AssignApprovalResponsibilityRequest {
    /// Context that owns the responsibility.
    pub context_ref: GovernanceContextRef,
    /// Body-free requirement intent.
    pub requirement_intent: ApproverRequirementIntent,
    /// Actor to assign immediately, when known.
    pub actor_ref: Option<ActorRef>,
    /// Whether the responsibility should be appended to a responsibility chain.
    pub chain_ref: Option<ResponsibilityChainRef>,
}

/// Records a vote on an approval responsibility.
pub struct RecordApprovalVoteRequest {
    /// Responsibility receiving the vote.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Vote value.
    pub vote: GovernanceVote,
    /// Optional evidence summary supporting the vote.
    pub evidence_ref: Option<EvidenceSummaryRef>,
}

/// Delegates an approval responsibility to another actor.
pub struct DelegateApprovalResponsibilityRequest {
    /// Responsibility being delegated.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Actor receiving the delegation.
    pub delegate_actor_ref: ActorRef,
    /// Delegation reason.
    pub delegation_reason: DelegationReason,
}
```

| Request DTO | 字段来源 | 构造 / 调用目标 | 缺失字段处理 |
|---|---|---|---|
| `AssignApprovalResponsibilityRequest` | caller body + loaded context + optional actor snapshot | build `ApproverRequirement`, `ApprovalResponsibility::require`, optional `assign`, optional chain append | context/requirement missing => rejected;actor assignment requires resolved capability snapshot |
| `RecordApprovalVoteRequest` | caller body + command actor | `ApprovalResponsibility::record_vote(vote, actor)` | missing responsibility/vote => rejected;actor mismatch => domain rejected |
| `DelegateApprovalResponsibilityRequest` | caller body + command actor + delegate snapshot | `ApprovalResponsibility::delegate_to(delegate, reason, actor)` | missing delegate/reason => rejected;delegate not allowed => policy rejected |

#### 8.8 Policy / shared rules / conflict command DTO schema

```rust
/// Finalization intent for a newly proposed policy effective fact.
pub enum PolicyActivationIntent {
    /// Create the fact as Proposed.
    ProposeOnly,
    /// Create then activate the fact with the supplied snapshot.
    Activate,
}

/// Updates an existing policy fact state.
pub enum PolicyFactStateUpdateIntent {
    /// Activate or reactivate using a resolved snapshot.
    Activate { snapshot: MethodPolicySnapshot },
    /// Suspend the policy fact.
    Suspend { reason: PolicySuspendReason },
    /// Supersede the policy fact with a later fact.
    Supersede { next_ref: PolicyEffectiveFactRef },
    /// Retire the policy fact.
    Retire { reason: PolicyRetireReason },
}

/// Applies one shared rule set update.
pub enum SharedRuleSetUpdateIntent {
    /// Create a draft set for scope when no rule_set_ref is supplied.
    Draft,
    /// Activate the draft rule set.
    Activate,
    /// Add one rule ref.
    AddRule { rule_ref: SharedRuleRef },
    /// Deprecate one rule ref.
    DeprecateRule {
        rule_ref: SharedRuleRef,
        reason: SharedRuleReason,
    },
    /// Retire the whole rule set.
    Retire { reason: SharedRuleReason },
}

/// Resolves or changes a policy conflict.
pub enum PolicyConflictResolutionIntent {
    /// Move a detected conflict to pending decision.
    MarkPendingDecision { gate_ref: GateRef },
    /// Resolve the conflict with a formal decision.
    Resolve { decision_ref: GovernanceDecisionRef },
    /// Waive the conflict with a formal decision and reason.
    Waive {
        decision_ref: GovernanceDecisionRef,
        reason: GovernanceWaiveReason,
    },
    /// Mark the conflict invalid.
    Invalidate { reason: PolicyConflictInvalidReason },
}

/// Activates or proposes a policy effective fact.
pub struct ActivatePolicyEffectiveFactRequest {
    /// Method policy snapshot used to create the fact.
    pub policy_snapshot: MethodPolicySnapshot,
    /// Governance scope where the fact applies.
    pub scope_ref: GovernanceScopeRef,
    /// Policy priority inside comparable scope.
    pub priority: PolicyPriority,
    /// Initial activation intent.
    pub activation_intent: PolicyActivationIntent,
}

/// Updates an existing policy effective fact lifecycle.
pub struct UpdatePolicyEffectiveFactStateRequest {
    /// Policy fact being updated.
    pub policy_fact_ref: PolicyEffectiveFactRef,
    /// Requested update.
    pub update_intent: PolicyFactStateUpdateIntent,
}

/// Updates shared rules for one scope or existing rule set.
pub struct UpdateSharedRuleSetRequest {
    /// Existing rule set, when updating an existing set.
    pub rule_set_ref: Option<SharedRuleSetRef>,
    /// Scope required when drafting a new set.
    pub scope_ref: GovernanceScopeRef,
    /// Requested shared rule operation.
    pub update_intent: SharedRuleSetUpdateIntent,
}

/// Resolves or advances a policy conflict record.
pub struct ResolvePolicyConflictRequest {
    /// Conflict being handled.
    pub conflict_ref: PolicyConflictRef,
    /// Requested conflict handling intent.
    pub resolution_intent: PolicyConflictResolutionIntent,
}
```

| Request DTO | 字段来源 | 构造 / 调用目标 | 缺失字段处理 |
|---|---|---|---|
| `ActivatePolicyEffectiveFactRequest` | method snapshot resolver/consumer + caller scope/priority | `PolicyEffectiveFact::propose(new_id, snapshot, scope, priority, actor)` then optional `activate` | missing snapshot/scope/priority => rejected |
| `UpdatePolicyEffectiveFactStateRequest` | caller body + loaded policy fact | `activate` / `suspend` / `supersede` / `retire` | state-specific reason/snapshot/next ref missing => impossible by enum shape |
| `UpdateSharedRuleSetRequest` | caller body + loaded or new rule set | `SharedRuleSet::draft` then `activate` / `add_rule` / `deprecate_rule` / `retire` | missing scope for draft or missing existing set for non-draft => rejected |
| `ResolvePolicyConflictRequest` | caller body + loaded conflict/gate/decision | `mark_pending_decision` / `resolve` / `waive` / `invalidate` | missing formal decision for resolve/waive impossible by enum shape |

#### 8.9 Command route mapping for 8.1-b

| Route / RPC neutral entry | Request envelope | Response envelope | Idempotency |
|---|---|---|---|
| `AssignApprovalResponsibility` | `GovernanceCommandRequest<AssignApprovalResponsibilityRequest>` | `GovernanceCommandResponse<ApprovalResponsibilityCommandResult>` | required |
| `RecordApprovalVote` | `GovernanceCommandRequest<RecordApprovalVoteRequest>` | `GovernanceCommandResponse<ApprovalResponsibilityCommandResult>` | required |
| `DelegateApprovalResponsibility` | `GovernanceCommandRequest<DelegateApprovalResponsibilityRequest>` | `GovernanceCommandResponse<ApprovalResponsibilityCommandResult>` | required |
| `ActivatePolicyEffectiveFact` | `GovernanceCommandRequest<ActivatePolicyEffectiveFactRequest>` | `GovernanceCommandResponse<PolicyCommandResult>` | required |
| `UpdatePolicyEffectiveFactState` | `GovernanceCommandRequest<UpdatePolicyEffectiveFactStateRequest>` | `GovernanceCommandResponse<PolicyCommandResult>` | required |
| `UpdateSharedRuleSet` | `GovernanceCommandRequest<UpdateSharedRuleSetRequest>` | `GovernanceCommandResponse<SharedRuleCommandResult>` | required |
| `ResolvePolicyConflict` | `GovernanceCommandRequest<ResolvePolicyConflictRequest>` | `GovernanceCommandResponse<PolicyConflictCommandResult>` | required |

#### 8.10 8.1-b stop-review

| 检查项 | 结论 |
|---|---|
| DTO 能否构造目标对象 | 是。approval DTO 覆盖 requirement/responsibility/chain;policy DTO 覆盖 propose/activate/suspend/supersede/retire;conflict DTO 覆盖 pending/resolve/waive/invalidate。 |
| 二级公开类型是否闭合 | 是。新增 intent enum 均在本批定义;字段类型来自 Step 6 shared refs、states、reasons。 |
| actor / metadata / idempotency 是否闭合 | 是。统一由 command envelope 提供;domain transition actor 来自 trusted `ActorContext`。 |
| 外部正文边界 | 已闭合。method policy、shared rule、actor capability 只用 snapshot/ref,不保存正文。 |
| 后续 flow 承接 | Step 9 必须定义 resolver / repository load、policy guard、history、trace、outbox append 顺序。 |

#### 8.11 Control / compliance / corrective command result DTOs

```rust
/// Command result for control applicability mutations.
pub struct ControlCommandResult {
    /// Changed control applicability ref.
    pub applicability_ref: ControlApplicabilityRef,
    /// Owning Governance context.
    pub context_ref: GovernanceContextRef,
    /// Current applicability state.
    pub applicability_state: ControlApplicabilityState,
    /// Method control snapshot used by the fact.
    pub control_snapshot: MethodControlSnapshot,
    /// Evidence basis when present.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for control review mutations.
pub struct ControlReviewCommandResult {
    /// Changed control review ref.
    pub review_ref: ControlReviewRef,
    /// Control applicability being reviewed.
    pub applicability_ref: ControlApplicabilityRef,
    /// Current review state.
    pub review_state: ControlReviewState,
    /// Reviewer actor ref.
    pub reviewer_ref: ActorRef,
    /// Evidence basis when present.
    pub evidence_ref: Option<EvidenceSummaryRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for AIIA / SoA compliance conclusion mutations.
pub struct ComplianceConclusionCommandResult {
    /// Changed compliance conclusion ref.
    pub conclusion_ref: ComplianceConclusionRef,
    /// Owning Governance context.
    pub context_ref: GovernanceContextRef,
    /// Current conclusion state.
    pub conclusion_state: ComplianceConclusionState,
    /// Artifact source ref.
    pub artifact_ref: ArtifactRef,
    /// Optional formal decision ref.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Optional SoA control coverage ref.
    pub control_coverage_ref: Option<ControlCoverageRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for nonconformity mutations.
pub struct NonconformityCommandResult {
    /// Changed nonconformity ref.
    pub nonconformity_ref: NonconformityRef,
    /// Owning Governance context.
    pub context_ref: GovernanceContextRef,
    /// Current nonconformity state.
    pub nonconformity_state: NonconformityState,
    /// Active corrective action when present.
    pub active_action_ref: Option<CorrectiveActionRef>,
    /// Closure verification result when present.
    pub verification_ref: Option<VerificationResultRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}

/// Command result for corrective action mutations.
pub struct CorrectiveActionCommandResult {
    /// Changed corrective action ref.
    pub action_ref: CorrectiveActionRef,
    /// Owning nonconformity ref.
    pub nonconformity_ref: NonconformityRef,
    /// Current corrective action state.
    pub action_state: CorrectiveActionState,
    /// Optional work collaboration ref.
    pub work_ref: Option<WorkGovernanceContextRef>,
    /// Completion evidence when present.
    pub completion_evidence_ref: Option<EvidenceSummaryRef>,
    /// Accepted side-effect summary.
    pub effect: GovernanceCommandEffectSummary,
}
```

#### 8.12 Control / compliance / corrective intent DTOs

```rust
/// Applicability decision requested for a control assessment.
pub enum ControlApplicabilityAssessmentIntent {
    /// Leave assessment pending after creating the fact.
    PendingAssessment,
    /// Mark the control applicable.
    Applicable { basis_ref: EvidenceSummaryRef },
    /// Mark the control not applicable.
    NotApplicable { reason: ControlExcludeReason },
    /// Exclude the control with reason and evidence basis.
    Excluded {
        reason: ControlExcludeReason,
        basis_ref: EvidenceSummaryRef,
    },
}

/// Control review lifecycle intent.
pub enum ControlReviewIntent {
    /// Plan a new review for an applicable control.
    Plan { reviewer_ref: ActorRef },
    /// Start an existing review.
    Start { reviewer_ref: ActorRef },
    /// Pass an existing review with evidence.
    Pass { evidence_ref: EvidenceSummaryRef },
    /// Fail an existing review with reason and evidence.
    Fail {
        reason: ControlFailureReason,
        evidence_ref: EvidenceSummaryRef,
    },
    /// Waive an existing review with a formal decision.
    Waive { decision_ref: GovernanceDecisionRef },
    /// Supersede an existing review.
    Supersede { next_ref: ControlReviewRef },
}

/// Review submission requested for a drafted compliance conclusion.
pub enum ComplianceSubmissionIntent {
    /// Keep the conclusion drafted.
    DraftOnly,
    /// Submit the conclusion for review with evidence.
    SubmitForReview { evidence_ref: EvidenceSummaryRef },
}

/// Approval or rejection requested for an existing compliance conclusion.
pub enum ComplianceApprovalIntent {
    /// Approve with a formal decision.
    Approve { decision_ref: GovernanceDecisionRef },
    /// Reject with a formal decision and reason.
    Reject {
        decision_ref: GovernanceDecisionRef,
        reason: GovernanceRejectReason,
    },
    /// Revoke a finalized conclusion with a formal decision.
    Revoke { decision_ref: GovernanceDecisionRef },
}

/// Corrective action state update intent.
pub enum CorrectiveActionUpdateIntent {
    /// Start the corrective action.
    Start,
    /// Complete the corrective action with evidence.
    Complete { evidence_ref: EvidenceSummaryRef },
    /// Cancel the corrective action.
    Cancel { reason: CorrectiveActionCancelReason },
    /// Fail the corrective action.
    Fail { reason: CorrectiveActionFailureReason },
}
```

#### 8.13 Control / compliance command DTO schema

```rust
/// Assesses applicability of a method control for a Governance context.
pub struct AssessControlApplicabilityRequest {
    /// Context where the control is assessed.
    pub context_ref: GovernanceContextRef,
    /// Method control snapshot.
    pub control_snapshot: MethodControlSnapshot,
    /// Requested assessment result.
    pub assessment_intent: ControlApplicabilityAssessmentIntent,
}

/// Plans or updates a control review.
pub struct RecordControlReviewRequest {
    /// Existing review when updating; absent when planning.
    pub review_ref: Option<ControlReviewRef>,
    /// Control applicability required when planning a new review.
    pub applicability_ref: ControlApplicabilityRef,
    /// Requested review lifecycle operation.
    pub review_intent: ControlReviewIntent,
}

/// Submits an AIIA conclusion linked to an artifact ref.
pub struct SubmitAIIAConclusionRequest {
    /// Context that owns the conclusion.
    pub context_ref: GovernanceContextRef,
    /// Artifact source ref.
    pub artifact_ref: ArtifactRef,
    /// Optional submission intent after drafting.
    pub submission_intent: ComplianceSubmissionIntent,
}

/// Submits a SoA conclusion linked to an artifact and control coverage ref.
pub struct SubmitSoAConclusionRequest {
    /// Context that owns the conclusion.
    pub context_ref: GovernanceContextRef,
    /// Artifact source ref.
    pub artifact_ref: ArtifactRef,
    /// Control coverage summary ref required for SoA review / approval.
    pub control_coverage_ref: ControlCoverageRef,
    /// Optional submission intent after drafting.
    pub submission_intent: ComplianceSubmissionIntent,
}

/// Approves, rejects, or revokes an AIIA / SoA conclusion.
pub struct ApproveComplianceConclusionRequest {
    /// Existing conclusion union ref.
    pub conclusion_ref: ComplianceConclusionRef,
    /// Requested approval operation.
    pub approval_intent: ComplianceApprovalIntent,
}
```

| Request DTO | 字段来源 | 构造 / 调用目标 | 缺失字段处理 |
|---|---|---|---|
| `AssessControlApplicabilityRequest` | caller body + method control snapshot resolver | `ControlApplicability::assess(new_id, context, snapshot, actor)` then mark applicable/not applicable/exclude | missing snapshot/context impossible by schema; invalid snapshot => rejected |
| `RecordControlReviewRequest` | caller body + loaded applicability/review | `ControlReview::plan` or `start/pass/fail/waive/supersede` | plan requires reviewer; update requires existing review |
| `SubmitAIIAConclusionRequest` | caller artifact ref + loaded context | `AIIAConclusion::from_artifact` then optional `submit_for_review` | artifact/context missing => rejected; evidence needed for submit |
| `SubmitSoAConclusionRequest` | caller artifact + coverage + context | `SoAConclusion::from_artifact`, `attach_control_coverage`, optional submit | coverage missing impossible by schema |
| `ApproveComplianceConclusionRequest` | caller body + loaded conclusion + loaded decision | AIIA / SoA `approve` / `reject` / `revoke` | formal decision required by enum shape |

#### 8.14 Nonconformity / corrective command DTO schema

```rust
/// Raises a formal Governance nonconformity.
pub struct RaiseNonconformityRequest {
    /// Context where the nonconformity is raised.
    pub context_ref: GovernanceContextRef,
    /// Severity of the nonconformity.
    pub severity: NonconformitySeverity,
    /// Source signal or formal input ref.
    pub source_ref: GovernanceSourceRef,
    /// Owner actor for corrective handling.
    pub owner_ref: ActorRef,
}

/// Confirms the cause of a raised nonconformity.
pub struct ConfirmNonconformityCauseRequest {
    /// Nonconformity being updated.
    pub nonconformity_ref: NonconformityRef,
    /// Cause summary ref.
    pub cause_ref: NonconformityCauseRef,
}

/// Plans a corrective action under a nonconformity.
pub struct PlanCorrectiveActionRequest {
    /// Nonconformity receiving the action.
    pub nonconformity_ref: NonconformityRef,
    /// Owner actor for the corrective action.
    pub owner_ref: ActorRef,
    /// Optional work collaboration context.
    pub work_ref: Option<WorkGovernanceContextRef>,
}

/// Updates a corrective action lifecycle.
pub struct CompleteCorrectiveActionRequest {
    /// Corrective action being updated.
    pub action_ref: CorrectiveActionRef,
    /// Requested corrective action update.
    pub update_intent: CorrectiveActionUpdateIntent,
}

/// Creates a verification result and optionally closes the nonconformity when passed.
pub struct VerifyNonconformityRequest {
    /// Nonconformity being verified.
    pub nonconformity_ref: NonconformityRef,
    /// Evidence used for verification.
    pub evidence_ref: EvidenceSummaryRef,
    /// Verification conclusion state.
    pub verification_state: VerificationState,
    /// Verifier actor.
    pub verifier_ref: ActorRef,
}
```

| Request DTO | 字段来源 | 构造 / 调用目标 | 缺失字段处理 |
|---|---|---|---|
| `RaiseNonconformityRequest` | caller body + loaded context | `NonconformityRecord::raise(new_id, context, severity, source, owner, actor)` | missing owner/severity/source/context => rejected |
| `ConfirmNonconformityCauseRequest` | caller body + loaded record | `NonconformityRecord::confirm_cause(cause_ref, actor)` | missing cause impossible by schema |
| `PlanCorrectiveActionRequest` | caller body + loaded record | `CorrectiveAction::plan(new_id, record, owner, work_ref, actor)` then record `start_correction` in Step 9 when allowed | missing owner/record => rejected |
| `CompleteCorrectiveActionRequest` | caller body + loaded action | `start` / `complete` / `cancel` / `fail` | reason/evidence missing impossible by enum shape |
| `VerifyNonconformityRequest` | caller body + loaded record | `VerificationResult::from_evidence(new_id, record, evidence, verifier, state)`;if passed then record `close(result, actor)` | failed/inconclusive must not close |

#### 8.15 Command route mapping for 8.1-c

| Route / RPC neutral entry | Request envelope | Response envelope | Idempotency |
|---|---|---|---|
| `AssessControlApplicability` | `GovernanceCommandRequest<AssessControlApplicabilityRequest>` | `GovernanceCommandResponse<ControlCommandResult>` | required |
| `RecordControlReview` | `GovernanceCommandRequest<RecordControlReviewRequest>` | `GovernanceCommandResponse<ControlReviewCommandResult>` | required |
| `SubmitAIIAConclusion` | `GovernanceCommandRequest<SubmitAIIAConclusionRequest>` | `GovernanceCommandResponse<ComplianceConclusionCommandResult>` | required |
| `SubmitSoAConclusion` | `GovernanceCommandRequest<SubmitSoAConclusionRequest>` | `GovernanceCommandResponse<ComplianceConclusionCommandResult>` | required |
| `ApproveComplianceConclusion` | `GovernanceCommandRequest<ApproveComplianceConclusionRequest>` | `GovernanceCommandResponse<ComplianceConclusionCommandResult>` | required |
| `RaiseNonconformity` | `GovernanceCommandRequest<RaiseNonconformityRequest>` | `GovernanceCommandResponse<NonconformityCommandResult>` | required |
| `ConfirmNonconformityCause` | `GovernanceCommandRequest<ConfirmNonconformityCauseRequest>` | `GovernanceCommandResponse<NonconformityCommandResult>` | required |
| `PlanCorrectiveAction` | `GovernanceCommandRequest<PlanCorrectiveActionRequest>` | `GovernanceCommandResponse<CorrectiveActionCommandResult>` | required |
| `CompleteCorrectiveAction` | `GovernanceCommandRequest<CompleteCorrectiveActionRequest>` | `GovernanceCommandResponse<CorrectiveActionCommandResult>` | required |
| `VerifyNonconformity` | `GovernanceCommandRequest<VerifyNonconformityRequest>` | `GovernanceCommandResponse<NonconformityCommandResult>` | required |

#### 8.16 8.1-c stop-review

| 检查项 | 结论 |
|---|---|
| DTO 能否构造目标对象 | 是。control、review、AIIA、SoA、nonconformity、corrective、verification DTO 均能回指 Step 6 factory / method。 |
| 二级公开类型是否闭合 | 是。新增 intent enum 在本批定义;其他字段来自 Step 6 shared refs、states、reasons。 |
| closure / verification 是否闭合 | 是。`VerifyNonconformityRequest` 显式携带 `VerificationState`;只有 `Passed` 可在 Step 9 flow 中调用 close。 |
| SoA coverage 是否闭合 | 是。`SubmitSoAConclusionRequest.control_coverage_ref` 必填;AIIA 不携带 coverage。 |
| external body boundary | 已闭合。artifact、evidence、work、method control 只用 ref / snapshot。 |

---

### 9. Query API protocol

Query API 只读取 truth summary、projection、trace、reference state 或 report surface。Query 不得 reserve idempotency、不得 append trace/outbox、不得 mark stale、不得 refresh external reference、不得 rebuild projection。所有 Query 必须使用 `GovernanceQueryRequest<T>` envelope 和 `GovernanceQueryResponse<T>` / `GovernancePageResponse<T>` response。

#### 9.1 Query shared view DTOs for context, input and approval

```rust
/// Public read view for one Governance context.
pub struct GovernanceContextView {
    /// Context being read.
    pub context_ref: GovernanceContextRef,
    /// Governed subject ref.
    pub subject_ref: GovernedSubjectRef,
    /// Current context state.
    pub context_state: GovernanceContextState,
    /// Source that supports the context.
    pub source_ref: GovernanceSourceRef,
    /// Pending external reference state when present.
    pub pending_reference_state: Option<ReferenceResolutionState>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}

/// Public read view for one Governance input.
pub struct GovernanceInputView {
    /// Input being read.
    pub input_ref: GovernanceInputRef,
    /// Actor that received or most recently transitioned the input.
    pub actor_ref: ActorRef,
    /// Owning context.
    pub context_ref: GovernanceContextRef,
    /// Input kind.
    pub input_kind: GovernanceInputKind,
    /// Current input state.
    pub input_state: GovernanceInputState,
    /// Source that produced the input.
    pub source_ref: GovernanceSourceRef,
    /// Pending evidence summary when present.
    pub pending_evidence_ref: Option<EvidenceSummaryRef>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}

/// Public read view for one approval responsibility.
pub struct ApprovalResponsibilityView {
    /// Responsibility being read.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Owning context.
    pub context_ref: GovernanceContextRef,
    /// Optional responsibility chain.
    pub chain_ref: Option<ResponsibilityChainRef>,
    /// Current responsibility state.
    pub responsibility_state: ApprovalResponsibilityState,
    /// Assigned actor when available.
    pub actor_ref: Option<ActorRef>,
    /// Recorded vote when available.
    pub vote: Option<GovernanceVote>,
    /// Actor capability snapshot summary when loaded.
    pub actor_snapshot: Option<ActorCapabilitySnapshot>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}
```

| View DTO | 构造来源 | 必须暴露 | 禁止事项 |
|---|---|---|---|
| `GovernanceContextView` | loaded `GovernanceContext` + reference state | context/subject/source/state/surface | 不刷新 source;不保存 subject body |
| `GovernanceInputView` | loaded `GovernanceInput` | input/actor/context/source/state/pending evidence | 不读取 actor profile body 或 evidence body |
| `ApprovalResponsibilityView` | loaded responsibility + optional chain/snapshot | responsibility/context/state/actor/vote | 不读取 identity profile 或 credential |

#### 9.2 Query request DTOs for 8.2-a

```rust
/// Reads one Governance context.
pub struct GetGovernanceContextRequest {
    /// Context ref.
    pub context_ref: GovernanceContextRef,
}

/// Reads one Governance input.
pub struct GetGovernanceInputRequest {
    /// Input ref.
    pub input_ref: GovernanceInputRef,
}

/// Reads a gate / decision summary by either gate or decision ref.
pub struct GetGateDecisionRequest {
    /// Gate ref, when querying by gate.
    pub gate_ref: Option<GateRef>,
    /// Decision ref, when querying by decision.
    pub decision_ref: Option<GovernanceDecisionRef>,
}

/// Lists pending Governance decisions under scope or context filters.
pub struct ListPendingGovernanceDecisionsRequest {
    /// Optional Governance scope filter.
    pub scope_ref: Option<GovernanceScopeRef>,
    /// Optional context filter.
    pub context_ref: Option<GovernanceContextRef>,
    /// Page request.
    pub page: GovernancePageRequest,
}

/// Reads one responsibility or the active responsibility for a context.
pub struct GetApprovalResponsibilityRequest {
    /// Responsibility ref, when known.
    pub responsibility_ref: Option<ApprovalResponsibilityRef>,
    /// Context ref, when listing or resolving active responsibility.
    pub context_ref: Option<GovernanceContextRef>,
}
```

| Request DTO | 读取 port / source | Response DTO | 缺失字段处理 |
|---|---|---|---|
| `GetGovernanceContextRequest` | `GovernanceContextRepository.get_with_version` + reference state | `GovernanceQueryResponse<GovernanceContextView>` | missing context ref => rejected |
| `GetGovernanceInputRequest` | `GovernanceInputRepository.get_with_version` | `GovernanceQueryResponse<GovernanceInputView>` | missing input ref => rejected |
| `GetGateDecisionRequest` | gate / decision repository + projection summary | `GovernanceQueryResponse<DecisionSummaryView>` | both refs missing or both present => rejected |
| `ListPendingGovernanceDecisionsRequest` | decision/projection page | `GovernancePageResponse<DecisionSummaryView>` | page missing => rejected |
| `GetApprovalResponsibilityRequest` | responsibility repository + optional identity snapshot | `GovernanceQueryResponse<ApprovalResponsibilityView>` | both refs missing => rejected |

#### 9.3 Query route mapping for 8.2-a

| Route / RPC neutral entry | Request envelope | Response envelope | Write behavior |
|---|---|---|---|
| `GetGovernanceContext` | `GovernanceQueryRequest<GetGovernanceContextRequest>` | `GovernanceQueryResponse<GovernanceContextView>` | no-write |
| `GetGovernanceInput` | `GovernanceQueryRequest<GetGovernanceInputRequest>` | `GovernanceQueryResponse<GovernanceInputView>` | no-write |
| `GetGateDecision` | `GovernanceQueryRequest<GetGateDecisionRequest>` | `GovernanceQueryResponse<DecisionSummaryView>` | no-write |
| `ListPendingGovernanceDecisions` | `GovernanceQueryRequest<ListPendingGovernanceDecisionsRequest>` | `GovernancePageResponse<DecisionSummaryView>` | no-write |
| `GetApprovalResponsibility` | `GovernanceQueryRequest<GetApprovalResponsibilityRequest>` | `GovernanceQueryResponse<ApprovalResponsibilityView>` | no-write |

#### 9.4 8.2-a stop-review

| 检查项 | 结论 |
|---|---|
| Query response body 是否有字段级 schema | 是。新增 context/input/approval 三个 view DTO;decision summary 复用 Step 6 `DecisionSummaryView`。 |
| visibility denied 是否闭合 | 是。统一由 `GovernanceQueryResponse.surface.visibility` 表达;not visible 时 body 为空。 |
| Page helper 是否闭合 | 是。pending decisions 使用 public `GovernancePageRequest` / `GovernancePageResponse` 映射 Step 7 repository page。 |
| Query 是否可能写入 | 否。本批全部标记 no-write;stale/degraded 只走 surface marker。 |

#### 9.5 Query view DTOs for policy conflict and compliance conclusion

```rust
/// Public read view for one policy conflict record.
pub struct PolicyConflictView {
    /// Conflict being read.
    pub conflict_ref: PolicyConflictRef,
    /// Governance scope where the conflict applies.
    pub scope_ref: GovernanceScopeRef,
    /// Current conflict state.
    pub conflict_state: PolicyConflictState,
    /// Conflicting policy refs.
    pub conflicting_policy_refs: PolicyEffectiveFactRefSet,
    /// Shared rule set involved when available.
    pub shared_rule_set_ref: Option<SharedRuleSetRef>,
    /// Formal resolution decision when available.
    pub resolution_ref: Option<GovernanceDecisionRef>,
    /// Pending gate when decision is required.
    pub pending_gate_ref: Option<GateRef>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}

/// Public read view for one AIIA or SoA compliance conclusion.
pub struct ComplianceConclusionView {
    /// Conclusion union ref.
    pub conclusion_ref: ComplianceConclusionRef,
    /// Owning Governance context.
    pub context_ref: GovernanceContextRef,
    /// Current conclusion state.
    pub conclusion_state: ComplianceConclusionState,
    /// Artifact source ref.
    pub artifact_ref: ArtifactRef,
    /// Optional review evidence.
    pub review_evidence_ref: Option<EvidenceSummaryRef>,
    /// Formal decision when finalized.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Optional SoA control coverage ref.
    pub control_coverage_ref: Option<ControlCoverageRef>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}
```

| View DTO | 构造来源 | 必须暴露 | 禁止事项 |
|---|---|---|---|
| `PolicyConflictView` | loaded `PolicyConflictRecord` + query surface | conflict/scope/policy/rule/decision/gate refs | 不读取 policy body 或 rule expression |
| `ComplianceConclusionView` | loaded `AIIAConclusion` or `SoAConclusion` | conclusion/context/artifact/evidence/decision/coverage refs | 不读取 artifact / AIIA / SoA body |

#### 9.6 Policy / control / compliance / nonconformity query request schema

```rust
/// Reads policy effective view for a Governance scope.
pub struct GetPolicyEffectiveViewRequest {
    /// Governance scope to read.
    pub scope_ref: GovernanceScopeRef,
}

/// Reads one policy conflict.
pub struct GetPolicyConflictRequest {
    /// Conflict ref.
    pub conflict_ref: PolicyConflictRef,
}

/// Reads control coverage for a Governance context.
pub struct GetControlCoverageRequest {
    /// Context whose coverage should be read.
    pub context_ref: GovernanceContextRef,
}

/// Reads one AIIA or SoA compliance conclusion.
pub struct GetComplianceConclusionRequest {
    /// Conclusion union ref.
    pub conclusion_ref: ComplianceConclusionRef,
}

/// Reads one nonconformity status view.
pub struct GetNonconformityStatusRequest {
    /// Nonconformity ref.
    pub nonconformity_ref: NonconformityRef,
}
```

| Request DTO | 读取 port / source | Response DTO | 缺失 / degraded 处理 |
|---|---|---|---|
| `GetPolicyEffectiveViewRequest` | projection policy view + view state | `GovernanceQueryResponse<PolicyEffectiveView>` | missing scope => rejected;stale => freshness marker |
| `GetPolicyConflictRequest` | conflict repository | `GovernanceQueryResponse<PolicyConflictView>` | missing conflict => body None + degraded missing marker |
| `GetControlCoverageRequest` | projection control coverage view | `GovernanceQueryResponse<ControlCoverageView>` | missing context => rejected;stale => freshness marker |
| `GetComplianceConclusionRequest` | compliance conclusion repository | `GovernanceQueryResponse<ComplianceConclusionView>` | union branch must be preserved;missing => degraded marker |
| `GetNonconformityStatusRequest` | projection status view or nonconformity summary | `GovernanceQueryResponse<NonconformityStatusView>` | missing nonconformity => degraded marker |

#### 9.7 Query route mapping for 8.2-b

| Route / RPC neutral entry | Request envelope | Response envelope | Write behavior |
|---|---|---|---|
| `GetPolicyEffectiveView` | `GovernanceQueryRequest<GetPolicyEffectiveViewRequest>` | `GovernanceQueryResponse<PolicyEffectiveView>` | no-write |
| `GetPolicyConflict` | `GovernanceQueryRequest<GetPolicyConflictRequest>` | `GovernanceQueryResponse<PolicyConflictView>` | no-write |
| `GetControlCoverage` | `GovernanceQueryRequest<GetControlCoverageRequest>` | `GovernanceQueryResponse<ControlCoverageView>` | no-write |
| `GetComplianceConclusion` | `GovernanceQueryRequest<GetComplianceConclusionRequest>` | `GovernanceQueryResponse<ComplianceConclusionView>` | no-write |
| `GetNonconformityStatus` | `GovernanceQueryRequest<GetNonconformityStatusRequest>` | `GovernanceQueryResponse<NonconformityStatusView>` | no-write |

#### 9.8 8.2-b stop-review

| 检查项 | 结论 |
|---|---|
| Query response body 是否有字段级 schema | 是。新增 `PolicyConflictView` 和 `ComplianceConclusionView`;复用 Step 6 policy/control/nonconformity views。 |
| union ref 是否闭合 | 是。`ComplianceConclusionRef` 保留 AIIA / SoA branch,不得用字符串种类替代。 |
| projection stale 是否闭合 | 是。policy/control/nonconformity projection stale 只进入 `GovernanceViewSurface.freshness/degraded`。 |
| external body boundary | 已闭合。artifact、policy、rule、control、evidence 只暴露 ref / summary ref。 |

#### 9.9 Search / trace query view DTOs

```rust
/// Public search result item for body-free Governance fact search.
pub struct GovernanceFactSearchResultItem {
    /// Stable result ref.
    pub result_ref: GovernanceFactSearchResultRef,
    /// Fact kind.
    pub fact_kind: GovernanceFactKind,
    /// Read subject represented by this item.
    pub read_subject_ref: GovernanceReadSubjectRef,
    /// Optional scope for the fact.
    pub scope_ref: Option<GovernanceScopeRef>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}

/// Public trace record view.
pub struct GovernanceTraceRecordView {
    /// Trace record ref.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Trace subject.
    pub subject_ref: GovernanceTraceSubjectRef,
    /// Trace kind.
    pub trace_kind: GovernanceTraceKind,
    /// Source cursor captured by the trace when available.
    pub source_cursor: Option<GovernanceTruthCursor>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}

/// Public reconciliation report query view.
pub struct GovernanceReconciliationReportView {
    /// Report ref returned by the query.
    pub report_ref: GovernanceReconciliationReportRef,
    /// Report body when visible.
    pub report: Option<GovernanceReconciliationReport>,
    /// Shared public query surface.
    pub surface: GovernanceViewSurface,
}
```

| View DTO | 构造来源 | 必须暴露 | 禁止事项 |
|---|---|---|---|
| `GovernanceFactSearchResultItem` | fact search projection | result/kind/read subject/scope/surface | 不保存 fact body 或 search-highlight source text |
| `GovernanceTraceRecordView` | `GovernanceTraceRepository.list_by_subject` | trace/subject/kind/cursor/surface | 不保存 command/event payload body |
| `GovernanceReconciliationReportView` | report repository / projection | report ref + optional report body | not visible 时 report 必须为空 |

#### 9.10 Search / trace / dashboard / reconciliation query request schema

```rust
/// Searches body-free Governance facts.
pub struct SearchGovernanceFactsRequest {
    /// Optional scope filter.
    pub scope_ref: Option<GovernanceScopeRef>,
    /// Optional fact kind filter.
    pub fact_kind: Option<GovernanceFactKind>,
    /// Optional read subject filter.
    pub read_subject_ref: Option<GovernanceReadSubjectRef>,
    /// Page request.
    pub page: GovernancePageRequest,
}

/// Reads Governance trace records for a subject.
pub struct GetGovernanceTraceRequest {
    /// Trace subject.
    pub subject_ref: GovernanceTraceSubjectRef,
    /// Optional trace kind filter.
    pub trace_kind: Option<GovernanceTraceKind>,
    /// Page request.
    pub page: GovernancePageRequest,
}

/// Reads a Governance dashboard for scope.
pub struct GetGovernanceDashboardRequest {
    /// Dashboard scope.
    pub scope_ref: GovernanceScopeRef,
}

/// Reads a reconciliation report by ref or latest scope report.
pub struct GetGovernanceReconciliationReportRequest {
    /// Specific report ref when known.
    pub report_ref: Option<GovernanceReconciliationReportRef>,
    /// Scope used when reading latest report.
    pub scope_ref: Option<GovernanceScopeRef>,
}
```

| Request DTO | 读取 port / source | Response DTO | 缺失 / degraded 处理 |
|---|---|---|---|
| `SearchGovernanceFactsRequest` | fact search projection | `GovernancePageResponse<GovernanceFactSearchResultItem>` | page required;stale projection => freshness/degraded marker |
| `GetGovernanceTraceRequest` | `GovernanceTraceRepository.list_by_subject` | `GovernancePageResponse<GovernanceTraceRecordView>` | missing subject/page => rejected |
| `GetGovernanceDashboardRequest` | dashboard projection | `GovernanceQueryResponse<GovernanceDashboardView>` | stale/missing projection => degraded marker |
| `GetGovernanceReconciliationReportRequest` | report repository / latest report index | `GovernanceQueryResponse<GovernanceReconciliationReportView>` | both report and scope missing => rejected |

#### 9.11 Query route mapping for 8.2-c

| Route / RPC neutral entry | Request envelope | Response envelope | Write behavior |
|---|---|---|---|
| `SearchGovernanceFacts` | `GovernanceQueryRequest<SearchGovernanceFactsRequest>` | `GovernancePageResponse<GovernanceFactSearchResultItem>` | no-write |
| `GetGovernanceTrace` | `GovernanceQueryRequest<GetGovernanceTraceRequest>` | `GovernancePageResponse<GovernanceTraceRecordView>` | no-write |
| `GetGovernanceDashboard` | `GovernanceQueryRequest<GetGovernanceDashboardRequest>` | `GovernanceQueryResponse<GovernanceDashboardView>` | no-write |
| `GetGovernanceReconciliationReport` | `GovernanceQueryRequest<GetGovernanceReconciliationReportRequest>` | `GovernanceQueryResponse<GovernanceReconciliationReportView>` | no-write |

#### 9.12 8.2-c stop-review

| 检查项 | 结论 |
|---|---|
| Search / trace secondary types 是否闭合 | 是。新增 search item、trace view、reconciliation report view 字段级 schema。 |
| Page mapping 是否闭合 | 是。search 和 trace 均使用 public page helper 映射 Step 7 page。 |
| Trace body boundary | 已闭合。trace view 只返回 trace ref、subject、kind、cursor、surface,不返回 command/event payload body。 |
| Query protocol family 是否完整 | 是。14 个 HLD Query 均有 request/response envelope、view DTO 或 Step 6 view 引用。 |

---

### 10. Inbound Event Consumer protocol

Inbound Event Consumer 只承接外部事实的 body-free summary、snapshot、reference state、pending marker、stale marker 和 receipt。Consumer 不得直接创建 `GovernanceDecision`、`PolicyEffectiveFact`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord` 等 core truth。

#### 10.1 Inbound event shared envelope

```rust
/// Public inbound event envelope consumed by Governance workers.
pub struct GovernanceInboundEventEnvelope<T> {
    /// Upstream source family.
    pub source_family: GovernanceInboundEventSourceFamily,
    /// Source event identity.
    pub source_event_ref: GovernanceSourceEventRef,
    /// Event subject reference.
    pub source_ref: ExternalGovernanceReferenceRef,
    /// Event schema version.
    pub event_version: GovernanceEventSchemaVersion,
    /// Dedup key for idempotent consumer handling.
    pub dedup_key: GovernanceEventDedupKey,
    /// Source version when provided by upstream.
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    /// Core distributed trace id propagated from upstream.
    pub core_trace_id: TraceId,
    /// Event-specific body-free payload.
    pub payload: T,
}

/// Public receipt returned by an inbound consumer operation.
pub struct GovernanceInboundEventReceipt {
    /// Source event handled.
    pub source_event_ref: GovernanceSourceEventRef,
    /// Consumer operation name.
    pub consumer_name: GovernanceInboundConsumerName,
    /// Worker disposition.
    pub disposition: GovernanceWorkerDisposition,
    /// Stored application result ref when accepted or duplicate replay.
    pub result_ref: Option<GovernanceApplicationResultRef>,
    /// Trace record created for accepted receipt when applicable.
    pub trace_record_ref: Option<GovernanceTraceRecordRef>,
    /// Reference state touched by the consumer.
    pub reference_state_ref: Option<ExternalGovernanceReferenceRef>,
    /// Views marked stale by the consumer.
    pub affected_view_refs: DerivedGovernanceViewRefSet,
    /// Redacted worker validation issues.
    pub validation_issue_refs: GovernanceWorkerValidationIssueRefSet,
}
```

| Envelope field | 来源 | 约束 |
|---|---|---|
| `source_family` | worker route / event metadata | 必须与 consumer 名称匹配 |
| `source_event_ref` | upstream event id/ref | 缺失则 rejected;不进入 dedup reserve |
| `source_ref` | event subject summary | 缺失则 rejected;不得从 payload body 猜 |
| `event_version` | event schema version | unsupported => `UnsupportedVersion`;不解析 payload |
| `dedup_key` | event metadata / canonical source event key | 缺失则 rejected;duplicate 使用 stored receipt |
| `source_version_ref` | upstream event metadata | 可为空;若存在必须进入 snapshot / reference state |
| `core_trace_id` | upstream core `TraceId` | 缺失则 rejected 或使用 Step 12 明确的 redacted fallback |
| `payload` | body-free event payload | 不得携带 upstream body;只携带 ref、snapshot、summary、state marker |

#### 10.2 Inbound receipt dispositions

| Disposition | 触发条件 | 写入行为 | 返回要求 |
|---|---|---|---|
| `Accepted` | schema supported、dedup reserved、payload valid、application consumer 成功 | 保存 snapshot / reference state / stale marker / receipt;可 append trace marker | `result_ref` 必须为 `Some` |
| `Duplicate` | dedup key 已完成且 digest 匹配 | 不重新写 snapshot / stale marker | 返回 stored receipt / result ref |
| `Delayed` | source temporarily unavailable、required resolver unavailable、retryable adapter issue | 不写 core truth;可保存 delayed receipt issue | 返回 issue refs;后续 retry 由 Step 13 定义 |
| `Rejected` | envelope missing required field、payload invalid、forbidden body detected | 不写 snapshot / stale marker | 返回 redacted issue refs |
| `UnsupportedVersion` | `event_version` 不在 supported schema set | 不解析 payload、不写 snapshot、不 mark stale | 返回 issue ref 和 source event ref |

#### 10.3 Inbound consumer operation table

| Consumer | Envelope body | Accepted write target | Stale view source |
|---|---|---|---|
| `ConsumeIdentityActorCapabilityChanged` | `IdentityActorCapabilityChangedPayload` | `ActorCapabilitySnapshot`、`ReferenceResolutionState` | `ProjectionRepository.list_views_affected_by_references` |
| `ConsumeProcessGovernanceContextChanged` | `ProcessGovernanceContextChangedPayload` | `ProcessGovernanceContextRef`、`ReferenceResolutionState` | affected process/governance context views |
| `ConsumeWorkGovernanceContextChanged` | `WorkGovernanceContextChangedPayload` | `WorkGovernanceContextRef`、`ReferenceResolutionState` | affected work/governance context views |
| `ConsumeArtifactEvidenceChanged` | `ArtifactEvidenceChangedPayload` | `EvidenceSummaryRef`、`ReferenceResolutionState` | affected compliance views |
| `ConsumeMethodPolicyDefinitionChanged` | `MethodPolicyDefinitionChangedPayload` | `MethodPolicySnapshot`、`ReferenceResolutionState` | affected policy views |
| `ConsumeMethodControlDefinitionChanged` | `MethodControlDefinitionChangedPayload` | `MethodControlSnapshot`、`ReferenceResolutionState` | affected control coverage views |
| `ConsumeRuntimeSignalRecorded` | `RuntimeSignalRecordedPayload` | `RuntimeSignalRef`、`ReferenceResolutionState`、optional pending input marker | affected context / dashboard views |
| `ConsumeConversationContextChanged` | `ConversationContextChangedPayload` | `GovernanceSourceRef` reference state / trace stale marker | affected trace / decision views |
| `ConsumeObservabilityAlertRaised` | `ObservabilityAlertRaisedPayload` | `RuntimeSignalRef` or `GovernanceSourceRef` reference state / pending nonconformity marker | affected nonconformity / dashboard views |

#### 10.4 8.3-a stop-review

| 检查项 | 结论 |
|---|---|
| Envelope 字段是否闭合 | 是。source event、source ref、version、dedup、source version、trace、payload 均有正式字段。 |
| Unsupported version 是否闭合 | 是。明确不解析 payload、不写 snapshot、不 mark stale。 |
| Duplicate replay 是否闭合 | 是。duplicate 必须读取 stored receipt / result ref,不得重跑 consumer mutation。 |
| Consumer 是否会写 core truth | 否。accepted target 限制在 snapshot、reference、pending marker、stale marker、receipt。 |

#### 10.5 Inbound event payload schema

```rust
/// Identity actor capability change payload.
pub struct IdentityActorCapabilityChangedPayload {
    /// Body-free actor capability snapshot.
    pub actor_snapshot: ActorCapabilitySnapshot,
}

/// Process governance context change payload.
pub struct ProcessGovernanceContextChangedPayload {
    /// Body-free process governance context ref.
    pub process_context_ref: ProcessGovernanceContextRef,
}

/// Work governance context change payload.
pub struct WorkGovernanceContextChangedPayload {
    /// Body-free work governance context ref.
    pub work_context_ref: WorkGovernanceContextRef,
}

/// Artifact evidence change payload.
pub struct ArtifactEvidenceChangedPayload {
    /// Evidence summary ref.
    pub evidence_ref: EvidenceSummaryRef,
    /// Artifact ref associated with the evidence.
    pub artifact_ref: Option<ArtifactRef>,
}

/// Method policy definition change payload.
pub struct MethodPolicyDefinitionChangedPayload {
    /// Body-free method policy snapshot.
    pub policy_snapshot: MethodPolicySnapshot,
}

/// Method control definition change payload.
pub struct MethodControlDefinitionChangedPayload {
    /// Body-free method control snapshot.
    pub control_snapshot: MethodControlSnapshot,
}

/// Runtime or capability signal recorded payload.
pub struct RuntimeSignalRecordedPayload {
    /// Runtime signal ref.
    pub runtime_signal_ref: RuntimeSignalRef,
    /// Optional source ref to create a pending Governance input marker.
    pub source_ref: Option<GovernanceSourceRef>,
}

/// Conversation context changed payload.
pub struct ConversationContextChangedPayload {
    /// Governance source ref represented by the conversation.
    pub source_ref: GovernanceSourceRef,
    /// Optional read subject affected by the conversation.
    pub read_subject_ref: Option<GovernanceReadSubjectRef>,
}

/// Observability alert or audit summary payload.
pub struct ObservabilityAlertRaisedPayload {
    /// Source ref for the alert or audit summary.
    pub source_ref: GovernanceSourceRef,
    /// Optional runtime signal ref when the alert maps to runtime signal.
    pub runtime_signal_ref: Option<RuntimeSignalRef>,
    /// Optional severity mapped to a future nonconformity input.
    pub severity: Option<NonconformitySeverity>,
}
```

| Payload | 必填字段来源 | Accepted save target | 禁止事项 |
|---|---|---|---|
| `IdentityActorCapabilityChangedPayload` | identity event safe summary | `save_actor_capability_snapshot` + reference state | 不保存 actor profile / credential body |
| `ProcessGovernanceContextChangedPayload` | process event safe summary | `save_process_context_ref` + reference state | 不保存 process instance/activity/waiting body |
| `WorkGovernanceContextChangedPayload` | work event safe summary | `save_work_context_ref` + reference state | 不保存 work item/project body |
| `ArtifactEvidenceChangedPayload` | artifact/evidence safe summary | `save_evidence_summary_ref` + reference state | 不保存 evidence / artifact body |
| `MethodPolicyDefinitionChangedPayload` | method-library policy safe summary | `save_method_policy_snapshot` + reference state | 不保存 AIPolicyDef body |
| `MethodControlDefinitionChangedPayload` | method-library control safe summary | `save_method_control_snapshot` + reference state | 不保存 ControlDefinition / standard body |
| `RuntimeSignalRecordedPayload` | runtime/capability event summary | `save_runtime_signal_ref` + optional pending input marker | 不保存 execution log |
| `ConversationContextChangedPayload` | conversation event summary | source reference state / trace stale marker | 不保存 message body |
| `ObservabilityAlertRaisedPayload` | observability alert safe summary | source/reference state + optional runtime signal / pending nonconformity marker | 不保存 alert body / stack trace |

#### 10.6 Inbound event envelope specializations

| Consumer | Public input type | Supported source family | Supported event version |
|---|---|---|---|
| `ConsumeIdentityActorCapabilityChanged` | `GovernanceInboundEventEnvelope<IdentityActorCapabilityChangedPayload>` | `Identity` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeProcessGovernanceContextChanged` | `GovernanceInboundEventEnvelope<ProcessGovernanceContextChangedPayload>` | `Process` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeWorkGovernanceContextChanged` | `GovernanceInboundEventEnvelope<WorkGovernanceContextChangedPayload>` | `Work` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeArtifactEvidenceChanged` | `GovernanceInboundEventEnvelope<ArtifactEvidenceChangedPayload>` | `Artifact` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeMethodPolicyDefinitionChanged` | `GovernanceInboundEventEnvelope<MethodPolicyDefinitionChangedPayload>` | `Method` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeMethodControlDefinitionChanged` | `GovernanceInboundEventEnvelope<MethodControlDefinitionChangedPayload>` | `Method` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeRuntimeSignalRecorded` | `GovernanceInboundEventEnvelope<RuntimeSignalRecordedPayload>` | `Runtime` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeConversationContextChanged` | `GovernanceInboundEventEnvelope<ConversationContextChangedPayload>` | `Conversation` | `GovernanceEventSchemaVersion(\"v1\")` |
| `ConsumeObservabilityAlertRaised` | `GovernanceInboundEventEnvelope<ObservabilityAlertRaisedPayload>` | `Observability` | `GovernanceEventSchemaVersion(\"v1\")` |

#### 10.7 Payload to application closure

| Consumer | Application operation target | Reference state source | Affected views |
|---|---|---|---|
| Identity actor capability | upsert actor snapshot | `actor_snapshot.snapshot_state` | reference affected views |
| Process governance context | upsert process context ref | `process_context_ref.snapshot_state` | context / decision / dashboard related views |
| Work governance context | upsert work context ref | `work_context_ref.snapshot_state` | context / nonconformity / dashboard related views |
| Artifact evidence | upsert evidence ref | envelope `source_ref` + source version | compliance / control views |
| Method policy definition | upsert method policy snapshot | `policy_snapshot.snapshot_state` | policy effective views |
| Method control definition | upsert method control snapshot | `control_snapshot.snapshot_state` | control coverage views |
| Runtime signal recorded | upsert runtime signal ref | `runtime_signal_ref.signal_state` | context / dashboard views |
| Conversation context changed | save source reference state | envelope `source_ref` + optional read subject | trace / decision views |
| Observability alert raised | save source/reference state + optional runtime signal | payload runtime signal or envelope source ref | nonconformity / dashboard views |

#### 10.8 8.3-b stop-review

| 检查项 | 结论 |
|---|---|
| 9 个 inbound payload 是否字段级闭合 | 是。每个 payload 均有 struct schema、保存目标和 source family/version。 |
| DTO 是否引用未定义二级类型 | 否。所有字段来自 Step 6 shared refs/snapshots/states 或本 Step envelope。 |
| Accepted write target 是否越界 | 否。只保存 snapshot、reference state、pending marker、stale marker、receipt。 |
| source body 是否进入 Governance | 否。payload 均为 body-free ref/snapshot/summary。 |

---

### 11. Outbound Event protocol

Outbound Event 只能从 accepted Governance truth change、trace / handoff marker、derived view state 变化或 outbox maintenance state 构造。发布失败不得回滚 truth。Publisher 必须读取 Step 7 `GovernanceOutboxPayloadSnapshot`,不得按 current truth 重新构造 payload。

#### 11.1 Outbound event envelope and topic key

```rust
/// Topic-neutral outbound event routing key.
pub struct GovernanceOutboundTopicKey(pub String);

/// Public outbound event envelope.
pub struct GovernanceOutboundEventEnvelope<T> {
    /// Outbound event kind.
    pub event_kind: GovernanceOutboxEventKind,
    /// Event schema version.
    pub event_version: GovernanceEventSchemaVersion,
    /// Outbox record that owns this publication.
    pub outbox_ref: GovernanceOutboxRef,
    /// Subject changed by the event.
    pub subject_ref: GovernanceOutboxSubjectRef,
    /// Source cursor captured at accepted transaction time.
    pub source_cursor: GovernanceTruthCursor,
    /// Trace record associated with the event.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Core distributed trace id captured at accepted transaction time.
    pub core_trace_id: TraceId,
    /// Topic-neutral routing key.
    pub topic_key: GovernanceOutboundTopicKey,
    /// Event-specific body-free payload.
    pub payload: T,
}

/// Builder input for a stored outbound payload snapshot.
pub struct GovernanceOutboundPayloadBuildInput<T> {
    /// Accepted truth change or maintenance event kind.
    pub event_kind: GovernanceOutboxEventKind,
    /// Outbox ref created for this event.
    pub outbox_ref: GovernanceOutboxRef,
    /// Outbox subject.
    pub subject_ref: GovernanceOutboxSubjectRef,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
    /// Trace ref created in the same accepted transaction.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Core distributed trace id.
    pub core_trace_id: TraceId,
    /// Topic key.
    pub topic_key: GovernanceOutboundTopicKey,
    /// Event payload DTO.
    pub payload: T,
}
```

| Envelope field | 来源 | 约束 |
|---|---|---|
| `event_kind` | `GovernanceTruthChange.event_kind` or maintenance event kind | non-empty;topic map must cover it |
| `event_version` | supported schema map | P0 supported value: `v1`;publisher must not alter |
| `outbox_ref` | saved `GovernanceOutboxRecord.to_ref()` | required for publication marker |
| `subject_ref` | `GovernanceTruthChange.subject_ref` | body-free subject identity |
| `source_cursor` | accepted truth change or view state source cursor | opaque;not optimistic version |
| `trace_ref` | same transaction trace | required for audit / handoff |
| `core_trace_id` | command / job / consumer context | copied into stored payload snapshot;type is core-contracts `TraceId` |
| `topic_key` | Step 14 topic map | not a hardcoded transport topic in domain |
| `payload` | Step 8 outbound payload DTO | body-free refs, states, markers only |

#### 11.2 Outbound payload snapshot builder contract

```rust
/// Builds a stored outbound payload snapshot from an accepted envelope.
pub struct GovernanceOutboundPayloadSnapshotBuilder;
```

| Function signature | 作用 | 参数 | 返回 | 约束 |
|---|---|---|---|---|
| `pub fn build<T>(snapshot_ref: GovernanceOutboxPayloadSnapshotRef, envelope: GovernanceOutboundEventEnvelope<T>) -> Result<GovernanceOutboxPayloadSnapshot, ContractError>` | 序列化 outbound envelope 并形成 stored snapshot | generated snapshot ref、typed envelope | `GovernanceOutboxPayloadSnapshot` | serialization must include envelope payload;publisher receives stored snapshot only |

| Snapshot field | 映射来源 |
|---|---|
| `snapshot_ref` | application generated payload snapshot ref |
| `event_kind` | `envelope.event_kind` |
| `subject_ref` | `envelope.subject_ref` |
| `schema_version` | `envelope.event_version` |
| `serialized_payload` | serialized `GovernanceOutboundEventEnvelope<T>` |
| `core_trace_id` | `envelope.core_trace_id` |

#### 11.3 Outbound topic map

| Event | Event kind value | Topic key rule | Payload schema |
|---|---|---|---|
| `GovernanceContextChanged` | `GovernanceOutboxEventKind("GovernanceContextChanged")` | `governance.context.changed.v1` | `GovernanceContextChangedPayload` |
| `GateChanged` | `GovernanceOutboxEventKind("GateChanged")` | `governance.gate.changed.v1` | `GateChangedPayload` |
| `GovernanceDecisionChanged` | `GovernanceOutboxEventKind("GovernanceDecisionChanged")` | `governance.decision.changed.v1` | `GovernanceDecisionChangedPayload` |
| `ApprovalResponsibilityChanged` | `GovernanceOutboxEventKind("ApprovalResponsibilityChanged")` | `governance.approval.changed.v1` | `ApprovalResponsibilityChangedPayload` |
| `PolicyEffectiveFactChanged` | `GovernanceOutboxEventKind("PolicyEffectiveFactChanged")` | `governance.policy.effective.changed.v1` | `PolicyEffectiveFactChangedPayload` |
| `SharedRuleSetChanged` | `GovernanceOutboxEventKind("SharedRuleSetChanged")` | `governance.shared-rule-set.changed.v1` | `SharedRuleSetChangedPayload` |
| `PolicyConflictChanged` | `GovernanceOutboxEventKind("PolicyConflictChanged")` | `governance.policy-conflict.changed.v1` | `PolicyConflictChangedPayload` |
| `ControlApplicabilityChanged` | `GovernanceOutboxEventKind("ControlApplicabilityChanged")` | `governance.control-applicability.changed.v1` | `ControlApplicabilityChangedPayload` |
| `ComplianceConclusionChanged` | `GovernanceOutboxEventKind("ComplianceConclusionChanged")` | `governance.compliance-conclusion.changed.v1` | `ComplianceConclusionChangedPayload` |
| `NonconformityChanged` | `GovernanceOutboxEventKind("NonconformityChanged")` | `governance.nonconformity.changed.v1` | `NonconformityChangedPayload` |
| `GovernanceTraceAvailable` | `GovernanceOutboxEventKind("GovernanceTraceAvailable")` | `governance.trace.available.v1` | `GovernanceTraceAvailablePayload` |
| `DerivedGovernanceViewChanged` | `GovernanceOutboxEventKind("DerivedGovernanceViewChanged")` | `governance.derived-view.changed.v1` | `DerivedGovernanceViewChangedPayload` |

#### 11.4 8.4-a stop-review

| 检查项 | 结论 |
|---|---|
| Outbound envelope 是否字段级闭合 | 是。event kind/version/outbox/subject/cursor/trace/topic/payload 均有字段。 |
| Payload snapshot 是否闭合 | 是。明确 stored snapshot 从 typed envelope 序列化形成,publisher 不回查 current truth。 |
| topic map 是否有正式入口 | 是。12 个 HLD outbound event 均有 topic key rule 和 payload schema 名称。 |
| event schema version 是否闭合 | P0 固定 supported value `v1`;unsupported inbound 与 outbound schema evolution 留给 Step 13/14。 |

#### 11.5 Outbound truth payload schema

```rust
/// Governance context or input changed payload.
pub struct GovernanceContextChangedPayload {
    /// Changed context ref.
    pub context_ref: GovernanceContextRef,
    /// Optional changed input ref.
    pub input_ref: Option<GovernanceInputRef>,
    /// Context state after change.
    pub context_state: GovernanceContextState,
    /// Optional input state after change.
    pub input_state: Option<GovernanceInputState>,
    /// Governed subject.
    pub subject_ref: GovernedSubjectRef,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Gate changed payload.
pub struct GateChangedPayload {
    /// Changed gate ref.
    pub gate_ref: GateRef,
    /// Owning context ref.
    pub context_ref: GovernanceContextRef,
    /// Gate state after change.
    pub gate_state: GateState,
    /// Optional required responsibility.
    pub required_responsibility_ref: Option<ApprovalResponsibilityRef>,
    /// Optional attached decision.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Governance decision changed payload.
pub struct GovernanceDecisionChangedPayload {
    /// Changed decision ref.
    pub decision_ref: GovernanceDecisionRef,
    /// Owning gate ref.
    pub gate_ref: GateRef,
    /// Decision state after change.
    pub decision_state: GovernanceDecisionState,
    /// Outcome ref.
    pub outcome_ref: GovernanceDecisionOutcomeRef,
    /// Optional evidence basis.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Approval responsibility changed payload.
pub struct ApprovalResponsibilityChangedPayload {
    /// Changed responsibility ref.
    pub responsibility_ref: ApprovalResponsibilityRef,
    /// Optional responsibility chain.
    pub chain_ref: Option<ResponsibilityChainRef>,
    /// Owning context.
    pub context_ref: GovernanceContextRef,
    /// Responsibility state after change.
    pub responsibility_state: ApprovalResponsibilityState,
    /// Optional actor.
    pub actor_ref: Option<ActorRef>,
    /// Optional vote.
    pub vote: Option<GovernanceVote>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Policy effective fact changed payload.
pub struct PolicyEffectiveFactChangedPayload {
    /// Changed policy fact ref.
    pub policy_fact_ref: PolicyEffectiveFactRef,
    /// Scope where it applies.
    pub scope_ref: GovernanceScopeRef,
    /// Policy state after change.
    pub policy_state: PolicyEffectiveState,
    /// Method policy snapshot ref.
    pub policy_snapshot: MethodPolicySnapshot,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Shared rule set changed payload.
pub struct SharedRuleSetChangedPayload {
    /// Changed rule set ref.
    pub rule_set_ref: SharedRuleSetRef,
    /// Scope where it applies.
    pub scope_ref: GovernanceScopeRef,
    /// Rule set state after change.
    pub rule_set_state: SharedRuleSetState,
    /// Rule refs currently in the set.
    pub rule_refs: SharedRuleRefSet,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Policy conflict changed payload.
pub struct PolicyConflictChangedPayload {
    /// Changed conflict ref.
    pub conflict_ref: PolicyConflictRef,
    /// Scope where conflict applies.
    pub scope_ref: GovernanceScopeRef,
    /// Conflict state after change.
    pub conflict_state: PolicyConflictState,
    /// Conflicting policy refs.
    pub conflicting_policy_refs: PolicyEffectiveFactRefSet,
    /// Optional resolution decision.
    pub resolution_ref: Option<GovernanceDecisionRef>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Control applicability changed payload.
pub struct ControlApplicabilityChangedPayload {
    /// Changed applicability ref.
    pub applicability_ref: ControlApplicabilityRef,
    /// Owning context.
    pub context_ref: GovernanceContextRef,
    /// Applicability state after change.
    pub applicability_state: ControlApplicabilityState,
    /// Method control snapshot.
    pub control_snapshot: MethodControlSnapshot,
    /// Optional evidence basis.
    pub basis_ref: Option<EvidenceSummaryRef>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Compliance conclusion changed payload.
pub struct ComplianceConclusionChangedPayload {
    /// Changed conclusion union ref.
    pub conclusion_ref: ComplianceConclusionRef,
    /// Owning context.
    pub context_ref: GovernanceContextRef,
    /// Conclusion state after change.
    pub conclusion_state: ComplianceConclusionState,
    /// Artifact source ref.
    pub artifact_ref: ArtifactRef,
    /// Optional decision ref.
    pub decision_ref: Option<GovernanceDecisionRef>,
    /// Optional SoA control coverage.
    pub control_coverage_ref: Option<ControlCoverageRef>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}

/// Nonconformity changed payload.
pub struct NonconformityChangedPayload {
    /// Changed nonconformity ref.
    pub nonconformity_ref: NonconformityRef,
    /// Owning context.
    pub context_ref: GovernanceContextRef,
    /// Nonconformity state after change.
    pub nonconformity_state: NonconformityState,
    /// Optional active action ref.
    pub active_action_ref: Option<CorrectiveActionRef>,
    /// Optional verification result ref.
    pub verification_ref: Option<VerificationResultRef>,
    /// Source cursor.
    pub source_cursor: GovernanceTruthCursor,
}
```

| Payload | Constructed from | Required event kind | Body boundary |
|---|---|---|---|
| `GovernanceContextChangedPayload` | saved context/input + truth change | `GovernanceContextChanged` | subject/source/input body excluded |
| `GateChangedPayload` | saved gate | `GateChanged` | process waiting gate body excluded |
| `GovernanceDecisionChangedPayload` | saved decision | `GovernanceDecisionChanged` | evidence body excluded |
| `ApprovalResponsibilityChangedPayload` | saved responsibility/chain | `ApprovalResponsibilityChanged` | actor profile excluded |
| `PolicyEffectiveFactChangedPayload` | saved policy fact | `PolicyEffectiveFactChanged` | AIPolicyDef body excluded |
| `SharedRuleSetChangedPayload` | saved shared rule set | `SharedRuleSetChanged` | rule expression/standard body excluded |
| `PolicyConflictChangedPayload` | saved conflict | `PolicyConflictChanged` | policy/rule body excluded |
| `ControlApplicabilityChangedPayload` | saved applicability | `ControlApplicabilityChanged` | ControlDefinition/evidence body excluded |
| `ComplianceConclusionChangedPayload` | saved AIIA/SoA conclusion | `ComplianceConclusionChanged` | artifact/AIIA/SoA body excluded |
| `NonconformityChangedPayload` | saved nonconformity/action/verification refs | `NonconformityChanged` | work/evidence/runtime body excluded |

#### 11.6 8.4-b stop-review

| 检查项 | 结论 |
|---|---|
| 10 个 truth outbound payload 是否字段级闭合 | 是。每个 payload 都有 refs/state/cursor 字段和构造来源。 |
| Payload 是否能从 accepted truth 构造 | 是。字段均来自 saved object、truth change cursor、trace/outbox accepted context。 |
| 是否保存 sibling body | 否。所有 payload 均只保存 refs、state、snapshot、summary ref。 |
| event kind 映射是否闭合 | 是。每个 payload 均绑定 §11.3 的 event kind。 |

#### 11.7 Trace and derived view outbound payload schema

```rust
/// Governance trace available payload.
pub struct GovernanceTraceAvailablePayload {
    /// Trace subject.
    pub subject_ref: GovernanceTraceSubjectRef,
    /// Trace record available to consumers.
    pub trace_ref: GovernanceTraceRecordRef,
    /// Trace kind.
    pub trace_kind: GovernanceTraceKind,
    /// Optional handoff marker when the trace was prepared for handoff.
    pub handoff_marker_ref: Option<GovernanceHandoffMarkerRef>,
    /// Optional source cursor.
    pub source_cursor: Option<GovernanceTruthCursor>,
}

/// Derived Governance view changed payload.
pub struct DerivedGovernanceViewChangedPayload {
    /// View whose freshness changed.
    pub view_ref: DerivedGovernanceViewRef,
    /// Current freshness state.
    pub freshness_state: DerivedGovernanceViewFreshnessState,
    /// Source cursor associated with the view state.
    pub source_cursor: Option<GovernanceTruthCursor>,
    /// Optional degraded marker for unavailable or failed projection state.
    pub degraded: Option<GovernanceDegradedMarker>,
}
```

| Payload | Constructed from | Required event kind | Body boundary |
|---|---|---|---|
| `GovernanceTraceAvailablePayload` | saved trace record + optional handoff marker | `GovernanceTraceAvailable` | no command/event payload body |
| `DerivedGovernanceViewChangedPayload` | saved `DerivedGovernanceViewState` | `DerivedGovernanceViewChanged` | no view body unless already in projection store |

#### 11.8 Outbound stored snapshot audit

| Audit item | Rule |
|---|---|
| `GovernanceOutboxRecord.event_kind` | must equal `GovernanceOutboxPayloadSnapshot.event_kind` |
| `GovernanceOutboxRecord.subject_ref` | must equal `GovernanceOutboxPayloadSnapshot.subject_ref` |
| `GovernanceOutboxRecord.trace_ref` | must be represented in serialized outbound envelope |
| `GovernanceOutboxRecord.source_cursor` | must be represented in serialized outbound envelope |
| `GovernanceOutboxPayloadSnapshot.schema_version` | must be `GovernanceEventSchemaVersion("v1")` for P0 |
| publisher input | must be `(GovernanceOutboxRecord, GovernanceOutboxPayloadSnapshot)`, never current truth object |
| publish failure | updates only publication state / failure marker, never changes truth |

#### 11.9 8.4-c stop-review

| 检查项 | 结论 |
|---|---|
| Trace / derived payload 是否字段级闭合 | 是。两个 payload 均有 ref/state/cursor/marker schema。 |
| Outbound payload snapshot 是否可审计 | 是。record 与 snapshot 字段对齐规则已列出。 |
| Publisher 是否需要 current truth | 否。publisher 只接收 stored snapshot 和 outbox record。 |
| Outbound protocol family 是否完整 | 是。12 个 HLD outbound event 均已定义 payload、topic key、snapshot rule。 |

---

### 12. Operations Job protocol

Operations Job 是显式后台维护入口,只允许维护 outbox publication state、projection、reference snapshot、reconciliation report、handoff marker 和 external GRC export marker。Job 不得作为业务 command,不得静默修复 Governance truth。

#### 12.1 Job shared metadata and result envelope

```rust
/// Public job metadata carried by all Governance operations jobs.
pub struct GovernanceJobMetadata {
    /// Job kind.
    pub job_kind: GovernanceOperationsJobKind,
    /// Job run id.
    pub run_id: GovernanceJobRunId,
    /// Job idempotency key.
    pub idempotency_key: GovernanceJobIdempotencyKey,
    /// System or operator actor.
    pub actor: ActorContext,
    /// Core distributed trace id.
    pub core_trace_id: TraceId,
}

/// Public job request envelope.
pub struct GovernanceJobRequest<T> {
    /// Shared job metadata.
    pub metadata: GovernanceJobMetadata,
    /// Job-specific input.
    pub input: T,
}

/// Public job response envelope.
pub struct GovernanceJobResponse {
    /// Job kind.
    pub job_kind: GovernanceOperationsJobKind,
    /// Job run id.
    pub run_id: GovernanceJobRunId,
    /// Final job disposition.
    pub disposition: GovernanceJobRunDisposition,
    /// Stored application result ref.
    pub result_ref: Option<GovernanceApplicationResultRef>,
    /// Job report for fresh run or stored replay.
    pub report: Option<GovernanceJobReport>,
    /// Redacted validation issues.
    pub validation_issue_refs: GovernanceJobValidationIssueRefSet,
}
```

| Field | 来源 | 约束 |
|---|---|---|
| `job_kind` | scheduler / explicit job request | must be one of 7 Step 6 job kinds |
| `run_id` | `IdGeneratorPort.new_job_run_id` or scheduler-provided validated run id | not result id |
| `idempotency_key` | scheduler / operator request | missing => rejected before application mutation |
| `actor` | system/operator actor context | no login/auth body stored |
| `core_trace_id` | scheduler / caller metadata | copied to report and handoff marker |
| `result_ref` | stored result repository | duplicate replay uses existing result ref |
| `report` | job report assembly or stored result load | duplicate must not rerun job body |

#### 12.2 Job duplicate replay contract

| Scenario | Required behavior | Forbidden behavior |
|---|---|---|
| first run accepted | reserve idempotency, run job body, save `StoredGovernanceOperationResult(JobReport)`, complete idempotency | return report without stored result |
| duplicate same key/digest | load `StoredGovernanceResultRepository.get_job_report(result_ref)` and return `DuplicateReplayed` | rescan outbox/reference/projection/handoff |
| duplicate missing stored report | return rejected/degraded result per Step 12/13 | silently rerun job |
| conflict same key different digest | return rejected/conflict issue | reuse stored result |

#### 12.3 8.5-a stop-review

| 检查项 | 结论 |
|---|---|
| Job metadata 是否字段级闭合 | 是。kind/run/key/actor/trace 均显式字段。 |
| Duplicate replay 是否闭合 | 是。必须读取 stored job report;不得重跑 job body。 |
| Result surface 是否闭合 | 是。`GovernanceJobResponse` 包含 disposition、result ref、report、redacted issues。 |
| Job 是否会修复 truth | 否。shared contract 明确禁止业务 truth repair。 |

#### 12.4 Operations job input DTO schema

```rust
/// Public DTO that maps to application-local ExternalContextRefreshScope.
pub enum ExternalContextRefreshScopeDto {
    /// Refresh explicitly supplied references.
    ExplicitRefs(ExternalGovernanceReferenceRefSet),
    /// Refresh currently unhealthy tracked references.
    UnhealthyReferences,
    /// Refresh references indexed under a Governance scope.
    GovernanceScope(GovernanceScopeRef),
}

/// Publish pending Governance outbox records.
pub struct PublishGovernanceOutboxJobInput {
    /// Page of pending outbox records to publish.
    pub page: GovernancePageRequest,
}

/// Projection set requested by a rebuild job.
pub struct GovernanceProjectionSetRefSet(pub Vec<DerivedGovernanceViewRef>);

/// Rebuild selected Governance projections from committed truth.
pub struct RebuildGovernanceProjectionsJobInput {
    /// Scope to rebuild.
    pub scope_ref: GovernanceScopeRef,
    /// Projection views to rebuild.
    pub projection_set: GovernanceProjectionSetRefSet,
    /// Page used when rebuilding in batches.
    pub page: GovernancePageRequest,
}

/// Refresh external context snapshots and reference states.
pub struct RefreshExternalContextSnapshotsJobInput {
    /// Public refresh scope.
    pub refresh_scope: ExternalContextRefreshScopeDto,
    /// Page of tracked references to process.
    pub page: GovernancePageRequest,
}

/// Run Governance reconciliation.
pub struct RunGovernanceReconciliationJobInput {
    /// Reconciliation input.
    pub reconciliation_input: GovernanceReconciliationInput,
}

/// Prepare trace handoff.
pub struct PrepareGovernanceTraceHandoffJobInput {
    /// Trace refs to include.
    pub trace_refs: GovernanceTraceRecordRefSet,
    /// Handoff target.
    pub target_ref: TraceHandoffTargetRef,
}

/// Prepare archive handoff.
pub struct PrepareGovernanceArchiveHandoffJobInput {
    /// Trace refs to include.
    pub trace_refs: GovernanceTraceRecordRefSet,
    /// Report refs to include.
    pub report_refs: GovernanceReportRefSet,
    /// Archive target.
    pub target_ref: TraceHandoffTargetRef,
}

/// Prepare external GRC export.
pub struct PrepareExternalGrcExportJobInput {
    /// Governance truth snapshot to export.
    pub truth_snapshot: GovernanceTruthSnapshot,
    /// External GRC target.
    pub target_ref: TraceHandoffTargetRef,
}
```

| Job | Public request type | Application target | Report refs/counters |
|---|---|---|---|
| `PublishGovernanceOutbox` | `GovernanceJobRequest<PublishGovernanceOutboxJobInput>` | outbox repository `list_pending_with_payload`, publisher port, mark published/failed | outbox refs, scanned/changed/failed counts |
| `RebuildGovernanceProjections` | `GovernanceJobRequest<RebuildGovernanceProjectionsJobInput>` | projection replace view/state | view refs, report refs |
| `RefreshExternalContextSnapshots` | `GovernanceJobRequest<RefreshExternalContextSnapshotsJobInput>` | reference repository `list_reference_states` + resolver + save snapshot/state | refreshed/failed reference refs |
| `RunGovernanceReconciliation` | `GovernanceJobRequest<RunGovernanceReconciliationJobInput>` | reconciliation report builder/repository | report refs, finding refs via report |
| `PrepareGovernanceTraceHandoff` | `GovernanceJobRequest<PrepareGovernanceTraceHandoffJobInput>` | trace handoff port + marker save | handoff marker refs, failed refs |
| `PrepareGovernanceArchiveHandoff` | `GovernanceJobRequest<PrepareGovernanceArchiveHandoffJobInput>` | archive handoff port + marker save | handoff marker refs, report refs |
| `PrepareExternalGrcExport` | `GovernanceJobRequest<PrepareExternalGrcExportJobInput>` | external GRC export port + marker save | handoff/export marker refs, report refs |

#### 12.5 Job input mapping and validation

| Input DTO | Required fields | Maps to Step 7 / Step 6 | Rejected when |
|---|---|---|---|
| `PublishGovernanceOutboxJobInput` | `page` | `GovernanceOutboxRepository.list_pending_with_payload` | page missing or limit invalid |
| `RebuildGovernanceProjectionsJobInput` | scope, projection set, page | `GovernanceTruthSnapshot` + projection replace methods | projection set empty unless explicitly allowed in Step 9 |
| `RefreshExternalContextSnapshotsJobInput` | refresh scope, page | `ExternalContextRefreshScope` application helper | explicit refs empty or unsupported scope |
| `RunGovernanceReconciliationJobInput` | reconciliation input | `GovernanceReconciliationInput` / report factory | input view/outbox refs inconsistent with scope |
| `PrepareGovernanceTraceHandoffJobInput` | trace refs, target | handoff port prepare/deliver | trace refs empty or target disabled |
| `PrepareGovernanceArchiveHandoffJobInput` | trace refs, report refs, target | archive handoff port | both trace/report refs empty or target disabled |
| `PrepareExternalGrcExportJobInput` | truth snapshot, target | export port prepare/deliver | snapshot empty/invalid or target disabled |

#### 12.6 Job response and route mapping

| Job route | Request envelope | Response envelope | Duplicate behavior |
|---|---|---|---|
| `PublishGovernanceOutbox` | `GovernanceJobRequest<PublishGovernanceOutboxJobInput>` | `GovernanceJobResponse` | stored report replay |
| `RebuildGovernanceProjections` | `GovernanceJobRequest<RebuildGovernanceProjectionsJobInput>` | `GovernanceJobResponse` | stored report replay |
| `RefreshExternalContextSnapshots` | `GovernanceJobRequest<RefreshExternalContextSnapshotsJobInput>` | `GovernanceJobResponse` | stored report replay |
| `RunGovernanceReconciliation` | `GovernanceJobRequest<RunGovernanceReconciliationJobInput>` | `GovernanceJobResponse` | stored report replay |
| `PrepareGovernanceTraceHandoff` | `GovernanceJobRequest<PrepareGovernanceTraceHandoffJobInput>` | `GovernanceJobResponse` | stored report replay |
| `PrepareGovernanceArchiveHandoff` | `GovernanceJobRequest<PrepareGovernanceArchiveHandoffJobInput>` | `GovernanceJobResponse` | stored report replay |
| `PrepareExternalGrcExport` | `GovernanceJobRequest<PrepareExternalGrcExportJobInput>` | `GovernanceJobResponse` | stored report replay |

#### 12.7 8.5-b stop-review

| 检查项 | 结论 |
|---|---|
| 7 个 job input 是否字段级闭合 | 是。每个 job 都有 public input struct、route mapping 和 validation source。 |
| application-local helper 是否泄露 | 否。`ExternalContextRefreshScopeDto` 显式映射到 Step 7 helper,public DTO 不直接依赖 application-local enum。 |
| duplicate replay 是否闭合 | 是。所有 job 都统一走 stored report replay。 |
| job 是否会修复 truth | 否。job 只写 outbox publication、projection、reference snapshot、report、handoff/export marker。 |

---

### 13. Cross-protocol closure audit

#### 13.1 Newly defined public secondary types

| Type | Protocol family | Owner module | Closure source |
|---|---|---|---|
| `GovernanceCommandName` | shared API | `contracts` | Step 8 §7.1 |
| `GovernanceQueryName` | shared API | `contracts` | Step 8 §7.1 |
| `GovernanceInboundConsumerName` | inbound event | `contracts` | Step 8 §7.1 |
| `GovernanceOutboundEventName` | outbound event | `contracts` | Step 8 §7.1 |
| `GovernanceJobName` | jobs | `contracts` | Step 8 §7.1 |
| `GovernanceProtocolSurfaceRef` | shared API/result | `contracts` | Step 8 §7.1 |
| `GovernanceProtocolValidationIssueRef` / Set | protocol rejection | `contracts` | Step 8 §7.4 |
| `GovernanceCommandEffectSummary` | command result | `contracts` | Step 8 §8.1 |
| `ApproverRequirementIntent` | command request | `contracts` | Step 8 §8.1 |
| command intent enums | command request | `contracts` | Step 8 §8.1, §8.8, §8.12 |
| additional query view DTOs | query response | `contracts` | Step 8 §9.1, §9.5, §9.9 |
| `GovernanceInboundEventEnvelope<T>` | inbound event | `contracts` | Step 8 §10.1 |
| `GovernanceInboundEventReceipt` | inbound event result | `contracts` | Step 8 §10.1 |
| 9 inbound payload DTOs | inbound event | `contracts` | Step 8 §10.5 |
| `GovernanceOutboundTopicKey` | outbound event | `contracts` | Step 8 §11.1 |
| `GovernanceOutboundEventEnvelope<T>` | outbound event | `contracts` | Step 8 §11.1 |
| 12 outbound payload DTOs | outbound event | `contracts` | Step 8 §11.5, §11.7 |
| `GovernanceJobMetadata` | jobs | `contracts` | Step 8 §12.1 |
| `GovernanceJobRequest<T>` / `GovernanceJobResponse` | jobs | `contracts` | Step 8 §12.1 |
| `ExternalContextRefreshScopeDto` | jobs | `contracts` | Step 8 §12.4 |
| 7 job input DTOs | jobs | `contracts` | Step 8 §12.4 |

#### 13.2 DTO to object / port / flow closure audit

| Protocol family | Step 6 object closure | Step 7 port closure | Step 9 flow required |
|---|---|---|---|
| Command | all request/result DTOs map to domain factories or member methods | truth repositories, trace/history, outbox, result store | 22 command flows with transaction/outbox/history order |
| Query | query request/view DTOs map to truth, projection, trace, report, reference state | truth repositories, projection repository, trace repository, page helper | 14 query flows with visibility/freshness/degraded handling |
| Inbound Event | payloads map to snapshot/ref/reference state helper objects | reference repository, projection affected views, stored receipt | 9 consumer flows with dedup/unsupported/delayed/rejected behavior |
| Outbound Event | payloads map to accepted truth change, trace, view state | outbox repository payload snapshot, publisher port | outbox append/publish flows with stored snapshot and version marker |
| Operations Job | job input/report DTOs map to job report assembly, handoff marker, reconciliation input | outbox/projection/reference/handoff/export/result repositories and ports | 7 job flows with duplicate replay, partial failure, report save |

#### 13.3 Public body boundary audit

| External family | Allowed in Step 8 DTOs | Forbidden |
|---|---|---|
| identity | `ActorRef`, `ActorCapabilitySnapshot`, role/capability refs | profile, credential, auth body |
| process | `ProcessGovernanceContextRef`, trace/source refs | process instance/activity/waiting body |
| work | `WorkGovernanceContextRef`, work/project refs inside snapshot helper | work item/project/iteration body |
| artifact | `ArtifactRef`, `EvidenceSummaryRef`, `ControlCoverageRef` | artifact/evidence/AIIA/SoA body |
| method | `MethodPolicySnapshot`, `MethodControlSnapshot` | AIPolicyDef, ControlDefinition, standard body |
| runtime | `RuntimeSignalRef` | execution log, runtime payload body |
| conversation | `GovernanceSourceRef`, read subject ref | message body, conversation transcript |
| observability | `GovernanceSourceRef`, `RuntimeSignalRef`, severity ref | alert body, stack trace, log body |
| external GRC/archive | `TraceHandoffTargetRef`, `HandoffPackageRef`, `GovernanceReportRef` | target config secret, archive package body, external GRC document body |

#### 13.4 Step 8 completion checklist

| Checklist | Status |
|---|---|
| 22 Command request/result schemas are defined | [x] |
| 14 Query request/response schemas are defined | [x] |
| 9 Inbound Event envelope/payload/receipt schemas are defined | [x] |
| 12 Outbound Event envelope/payload/topic/snapshot schemas are defined | [x] |
| 7 Operations Job metadata/input/response/report replay schemas are defined | [x] |
| Public DTO secondary types have schema and ownership | [x] |
| Query view/page/marker response surfaces are field-level | [x] |
| Inbound unsupported/duplicate/delayed/rejected dispositions are explicit | [x] |
| Outbound stored payload snapshot prevents publisher current-truth lookup | [x] |
| Job duplicate replay uses stored job report, not rerun | [x] |

#### 13.5 Remaining work for later Steps

| Item | Deferred to | Reason |
|---|---|---|
| Function-level command/query/event/job flow | Step 9 | Step 8 only fixes protocol schema |
| State transition matrix | Step 10 | Step 8 references existing states but does not define allowed transitions |
| Persistence table / version / transaction ordering | Step 11 | Step 8 references repository surfaces but not storage layout |
| Error code mapping and recovery behavior | Step 12 | Step 8 defines rejection/receipt surfaces only |
| Idempotency digest algorithm and duplicate conflict matrix | Step 13 | Step 8 fixes fields and replay surface only |
| Topic binding / config / adapter target validation | Step 14 | Step 8 gives topic key rule, not deployment binding |
| Test cases and acceptance gates | Step 16+ | Step 8 does not define executable tests |

---

### 14. 回填草稿

正式 `03-详细设计.md` Step 19 装配时:

- §7.1 引用本文件 §7 的 shared protocol helper。
- §7.2 摘录 §8 Command API protocol。
- §7.3 摘录 §9 Query API protocol。
- §7.4 摘录 §10 Inbound Event protocol。
- §7.5 摘录 §11 Outbound Event protocol。
- §7.6 摘录 §12 Operations Job protocol。
- §7.7 摘录 §13 cross-protocol closure audit。

---

### 15. 进入下一步条件

- Command / Query / Inbound Event / Outbound Event / Job 五类协议均已有字段级 schema。
- 所有 public DTO 二级类型均有归属、字段或明确复用 Step 6 类型。
- 每个 DTO 能回指 Step 6 对象、Step 7 port 或 Step 9 待写 flow。
- Query visibility / freshness / degraded surface 不再是普通 error 或隐式修复。
- Inbound consumer duplicate / unsupported / delayed / rejected / accepted receipt 口径闭合。
- Outbound payload snapshot 闭合,发布路径不需要 current truth lookup。
- Job duplicate report replay 闭合,不需要重跑 job。
- 可以进入 Step 9 “逐接口定义函数级处理流”。
