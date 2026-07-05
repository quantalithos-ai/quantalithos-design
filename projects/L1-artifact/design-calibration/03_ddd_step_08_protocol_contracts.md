# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
> 回填章节: `03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前 Step | Step 8 `定义 API / Command / Query / Event / Job 协议契约` |
| 当前 gate | pass |
| 输入基线 | 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`;本轮 `03_ddd_step_01`~`03_ddd_step_07` |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_08_protocol_contracts.md` |
| 回填目标 | 正式 `03-详细设计.md` §7 |
| 下一步 | 等待用户确认后进入 Step 9 `定义逐接口函数级处理流` |

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/project_execution_ledger.md` | 已读取 | 确认 Step 7 completed 且用户已确认进入 Step 8 |
| `projects/L1-artifact/design-calibration/03_ddd_calibration_flow.md` | 已读取 | 确认详细设计当前恢复点和 Step 8 输出路径 |
| `projects/L1-artifact/design-calibration/03_ddd_step_05_module_contracts.md` | 已完成 | 提供模块 owner、entry 模块和 service 主轴 |
| `projects/L1-artifact/design-calibration/03_ddd_step_06_object_contracts.md` | 已完成 | 提供 public carrier、truth object、view/report、record、stored result 和 state enum |
| `projects/L1-artifact/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 application service callable surface、repository/relay/publisher port 和 result envelope |
| `projects/L1-artifact/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 16 Command、13 Query、6 Inbound Consumer、8 Outbound Event、6 Operations Job 名称 |
| `projects/L1-artifact/design-calibration/02_hld_step_08_processing_flows.md` | 已完成 | 提供 Step 9 处理流的上游骨架 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供详细设计承接红线 |
| `projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` | 已读取 | 作为协议契约粒度和 closure audit 的对照框架 |
| `standards/document/详细设计讨论流程_SOP.md` | 已读取 | 要求 Step 8 按协议族小循环、字段级 DTO 和停审记录执行 |
| `standards/document/详细设计书写规范.md` | 已读取 | 要求 public protocol 二级类型、event envelope / receipt、job I/O 字段级闭口 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 要求 DTO、result、receipt、outbound snapshot、job duplicate replay 和 support carrier 可落码 |

---

## 3. 本步目标

把 HLD Step 7 的接口骨架和 Step 6 / Step 7 已闭合的对象、service input、stored result、relay payload snapshot、query read model 和 job report 继续转译成 public protocol schema。

本步必须闭口:

- API shared protocol helper、operation name、protocol surface、rejection、page、visibility / freshness / degraded surface。
- 16 个 Command 的 request DTO、accepted response DTO、rejected response surface、route-neutral mapping 和 service input source map。
- 13 个 Query 的 request DTO、response DTO、page response、not-visible / degraded / stale surface 和 no-write mapping。
- 6 个 Inbound Event Consumer 的 envelope、payload、receipt、duplicate / unsupported / delayed / rejected 口径。
- 8 个 Outbound Event 的 envelope、payload、topic-neutral key、stored payload snapshot builder 和 relay publication worker contract。
- 6 个 Operations Job 的 request / response / report replay schema,以及 worker-only relay publication loop 的 internal job-like protocol。

本步不定义:

- HTTP path、RPC method、topic 名称、transport secret 或部署参数。
- repository DDL、transaction ordering、retry interval、dead-letter policy。
- Step 9 函数级处理流、Step 10 状态转换矩阵、Step 11 持久化一致性细节。
- 外部仓正文、provider raw body、UI label、runtime log body 或 archive package body。

---

## 4. 分批写入计划

| 批次 | 协议族 | 内容 | 状态 |
|---|---|---|---|
| 8.0 | shared protocol helper | 协议总纪律、operation / route / envelope / result / page / error helper、协议总表 | [x] 已写入 |
| 8.1 | Command protocol | command shared envelope、effect summary、16 个 request/result DTO、service input source map、route mapping | [x] 已写入 |
| 8.2 | Query protocol | query envelope、visibility/freshness/degraded surface、13 个 request/response DTO、page mapping | [x] 已写入 |
| 8.3 | Inbound Event protocol | event envelope、6 个 payload、receipt disposition、stored receipt replay、consumer service input map | [x] 已写入 |
| 8.4 | Outbound Event protocol | outbound envelope、8 个 payload、stored payload snapshot builder、relay worker publication mapping | [x] 已写入 |
| 8.5 | Operations Job protocol | job metadata、6 个 job input、job report response、duplicate replay、relay publication facade | [x] 已写入 |
| 8.6 | closure audit | 二级类型、DTO 到 Step 6/7/9、body-free boundary、完成清单 | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮需要定义哪些 public protocol? | HLD Step 7 中列出的 16 个 Command、13 个 Query、6 个 Inbound Event Consumer、8 个 Outbound Event 和 6 个 Operations Job 全部进入本 Step。 |
| Outbound Event 是否是 public entry service? | 不是。Outbound Event 是 stored relay payload snapshot + worker relay publication loop,public contract 是 event envelope / payload schema 和 stored snapshot,不是同步 API。 |
| API / worker / jobs 是否可以直连 repository? | 不可以。`api`、`worker`、`jobs` 只能构造 protocol envelope 和调用 Step 7 application service / facade,不得读取 repository、publisher、resolver 或 UoW。 |
| Command duplicate 如何返回? | same digest duplicate 只能通过 `StoredArtifactResultRepository.get_command_result(...)` 或 `get_command_rejection(...)` 回放完整 stored surface,不得重跑 mutation。 |
| Query denied 如何表达? | Query denied 不作为 command rejection,而是 `ArtifactQuerySurface.visibility = NotVisible` 且 body 为空或 redacted。Query 仍然 no-write。 |
| Inbound unsupported version 如何处理? | 返回 stored / public receipt `UnsupportedSchema`,不解析 payload、不 mark stale、不保存外部正文、不进入 service body。 |
| Outbound payload 何时生成? | accepted transaction 内从 `ArtifactCommittedChange` 和 Step 8 typed payload builder 生成 serialized snapshot;publisher 只读取 stored snapshot。 |
| Job duplicate 如何处理? | 通过 stored job report replay 返回 `ArtifactJobProtocolResponse`,duplicate 不重新扫描、不重建、不发布、不交接。 |
| 每个协议族何时停审? | 每个协议族写完后记录 DTO 构造闭环、二级类型闭环、service input 映射、错误/幂等/metadata 闭环和 Step 9 承接情况。 |

---

## 6. 协议总表

### 6.1 Command protocol inventory

| Command | Request DTO | Accepted response DTO | Service target | Operation name |
|---|---|---|---|---|
| `RegisterArtifactIntake` | `RegisterArtifactIntakeRequest` | `ArtifactCommandResponse<ArtifactIntakeCommandResult>` | `ArtifactIntakeReviewService.register_artifact_intake` | `RegisterArtifactIntake` |
| `EstablishArtifactFact` | `EstablishArtifactFactRequest` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactTruthWriteService.establish_artifact_fact` | `EstablishArtifactFact` |
| `CreateArtifactVersionCandidate` | `CreateArtifactVersionCandidateRequest` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactTruthWriteService.create_artifact_version_candidate` | `CreateArtifactVersionCandidate` |
| `PublishArtifactVersion` | `PublishArtifactVersionRequest` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactTruthWriteService.publish_artifact_version` | `PublishArtifactVersion` |
| `SupersedeArtifactVersion` | `SupersedeArtifactVersionRequest` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactTruthWriteService.supersede_artifact_version` | `SupersedeArtifactVersion` |
| `EstablishArtifactLineageLink` | `EstablishArtifactLineageLinkRequest` | `ArtifactCommandResponse<ArtifactLineageCommandResult>` | `ArtifactTruthWriteService.establish_artifact_lineage_link` | `EstablishArtifactLineageLink` |
| `RejectArtifactLineageLink` | `RejectArtifactLineageLinkRequest` | `ArtifactCommandResponse<ArtifactLineageCommandResult>` | `ArtifactTruthWriteService.reject_artifact_lineage_link` | `RejectArtifactLineageLink` |
| `CreateArtifactBaselineCandidate` | `CreateArtifactBaselineCandidateRequest` | `ArtifactCommandResponse<ArtifactBaselineCommandResult>` | `ArtifactTruthWriteService.create_artifact_baseline_candidate` | `CreateArtifactBaselineCandidate` |
| `FreezeArtifactBaseline` | `FreezeArtifactBaselineRequest` | `ArtifactCommandResponse<ArtifactBaselineCommandResult>` | `ArtifactTruthWriteService.freeze_artifact_baseline` | `FreezeArtifactBaseline` |
| `SupersedeArtifactBaseline` | `SupersedeArtifactBaselineRequest` | `ArtifactCommandResponse<ArtifactBaselineCommandResult>` | `ArtifactTruthWriteService.supersede_artifact_baseline` | `SupersedeArtifactBaseline` |
| `OpenArtifactReviewAnchor` | `OpenArtifactReviewAnchorRequest` | `ArtifactCommandResponse<ArtifactReviewCommandResult>` | `ArtifactIntakeReviewService.open_artifact_review_anchor` | `OpenArtifactReviewAnchor` |
| `AssignArtifactResponsibility` | `AssignArtifactResponsibilityRequest` | `ArtifactCommandResponse<ArtifactReviewCommandResult>` | `ArtifactIntakeReviewService.assign_artifact_responsibility` | `AssignArtifactResponsibility` |
| `RegisterAutomationArtifactInput` | `RegisterAutomationArtifactInputRequest` | `ArtifactCommandResponse<ArtifactAutomationCommandResult>` | `ArtifactIntakeReviewService.register_automation_artifact_input` | `RegisterAutomationArtifactInput` |
| `AcceptAutomationArtifactInput` | `AcceptAutomationArtifactInputRequest` | `ArtifactCommandResponse<ArtifactAutomationCommandResult>` | `ArtifactIntakeReviewService.accept_automation_artifact_input` | `AcceptAutomationArtifactInput` |
| `IssueConsumableArtifactReference` | `IssueConsumableArtifactReferenceRequest` | `ArtifactCommandResponse<ArtifactConsumptionCommandResult>` | `ArtifactTruthWriteService.issue_consumable_artifact_reference` | `IssueConsumableArtifactReference` |
| `RecordArtifactConsumptionBackref` | `RecordArtifactConsumptionBackrefRequest` | `ArtifactCommandResponse<ArtifactConsumptionCommandResult>` | `ArtifactTruthWriteService.record_artifact_consumption_backref` | `RecordArtifactConsumptionBackref` |

### 6.2 Query protocol inventory

| Query | Request DTO | Response DTO | Service target | Write behavior |
|---|---|---|---|---|
| `GetArtifactFact` | `GetArtifactFactRequest` | `ArtifactQueryResponse<ArtifactFactView>` | `ArtifactReadConsumptionService.get_artifact_fact` | no-write |
| `GetArtifactVersion` | `GetArtifactVersionRequest` | `ArtifactQueryResponse<ArtifactVersionView>` | `ArtifactReadConsumptionService.get_artifact_version` | no-write |
| `ListArtifactVersionsByFact` | `ListArtifactVersionsByFactRequest` | `ArtifactPageResponse<ArtifactVersionSummaryView>` | `ArtifactReadConsumptionService.list_artifact_versions_by_fact` | no-write |
| `GetArtifactLineageSummary` | `GetArtifactLineageSummaryRequest` | `ArtifactQueryResponse<ArtifactLineageView>` | `ArtifactReadConsumptionService.get_artifact_lineage_summary` | no-write |
| `GetArtifactBaseline` | `GetArtifactBaselineRequest` | `ArtifactQueryResponse<ArtifactBaselineView>` | `ArtifactReadConsumptionService.get_artifact_baseline` | no-write |
| `GetArtifactReviewSummary` | `GetArtifactReviewSummaryRequest` | `ArtifactQueryResponse<ArtifactReviewView>` | `ArtifactReadConsumptionService.get_artifact_review_summary` | no-write |
| `GetArtifactReadSurface` | `GetArtifactReadSurfaceRequest` | `ArtifactQueryResponse<ArtifactReadSurfaceView>` | `ArtifactReadConsumptionService.get_artifact_read_surface` | no-write |
| `GetArtifactTrace` | `GetArtifactTraceRequest` | `ArtifactPageResponse<ArtifactTraceRecord>` | `ArtifactReadConsumptionService.get_artifact_trace` | no-write |
| `SearchArtifactFacts` | `SearchArtifactFactsRequest` | `ArtifactPageResponse<ArtifactFactSummaryView>` | `ArtifactReadConsumptionService.search_artifact_facts` | no-write |
| `GetArtifactPreview` | `GetArtifactPreviewRequest` | `ArtifactQueryResponse<ArtifactPreviewView>` | `ArtifactReadConsumptionService.get_artifact_preview` | no-write |
| `GetArtifactReport` | `GetArtifactReportRequest` | `ArtifactQueryResponse<ArtifactReportView>` | `ArtifactReadConsumptionService.get_artifact_report` | no-write |
| `GetArtifactReconciliationReport` | `GetArtifactReconciliationReportRequest` | `ArtifactQueryResponse<ArtifactReconciliationReport>` | `ArtifactReadConsumptionService.get_artifact_reconciliation_report` | no-write |
| `GetExternalReferenceResolution` | `GetExternalReferenceResolutionRequest` | `ArtifactQueryResponse<ArtifactReferenceResolutionView>` | `ArtifactReadConsumptionService.get_external_reference_resolution` | no-write |

### 6.3 Event and job protocol inventory

| 协议类别 | 数量 | 本 Step 覆盖 |
|---|---:|---|
| Inbound Event Consumer | 6 | envelope、payload、dedup、receipt、unsupported / delayed / rejected / quarantined 口径 |
| Outbound Event | 8 | envelope、event kind、topic-neutral key、payload DTO、stored payload snapshot builder、publisher stored-snapshot-only 规则 |
| Operations Job | 6 | metadata、input、response、stored job report replay、partial failure surface |
| Relay publication loop | 1 internal facade | worker-only `PublishPendingArtifactRelays` protocol,不作为 public command/query/job |

---

## 7. Shared protocol helper

### 7.1 协议归属与命名

以下 public protocol helper 归 `contracts`。它们只定义 body-free API surface,不得承载 transport route、topic secret、external body 或 handler 私有名称。

```rust
/// Artifact command 协议名称。
pub struct ArtifactCommandName(pub String);

/// Artifact query 协议名称。
pub struct ArtifactQueryName(pub String);

/// Artifact inbound consumer 协议名称。
pub struct ArtifactInboundConsumerName(pub String);

/// Artifact outbound event 协议名称。
pub struct ArtifactOutboundEventName(pub String);

/// Artifact operations job 协议名称。
pub struct ArtifactJobName(pub String);

/// 协议层 stored result、receipt、route-neutral surface 的公开引用。
pub struct ArtifactProtocolSurfaceRef(pub String);

/// 协议层 stored result 的公开引用。
pub struct ArtifactProtocolResultRef(pub String);

/// 协议层 operation 名称。
pub struct ArtifactProtocolOperationName(pub String);

/// 协议校验问题引用。
pub struct ArtifactProtocolValidationIssueRef(pub String);

/// 协议校验问题引用集合。
pub struct ArtifactProtocolValidationIssueRefSet(pub Vec<ArtifactProtocolValidationIssueRef>);
```

| Type | 来源 | 约束 |
|---|---|---|
| `ArtifactCommandName` | §6.1 command inventory | 必须等于 inventory 中的 command 名称之一 |
| `ArtifactQueryName` | §6.2 query inventory | 必须等于 inventory 中的 query 名称之一 |
| `ArtifactInboundConsumerName` | §10 inbound consumer table | 必须与 payload DTO / service input 一一对应 |
| `ArtifactOutboundEventName` | `ArtifactOutboundEventKind` | 必须可唯一映射到 Step 7 relay `event_kind` |
| `ArtifactJobName` | §12 job table | 必须等于 6 个 public operations job 名称之一 |
| `ArtifactProtocolSurfaceRef` | protocol normalization / stored result | 不保存 path、topic、payload body、handler name 或 storage row id |
| `ArtifactProtocolResultRef` | public result / receipt / report identity | 由 entry mapper 从 application-local `ArtifactApplicationResultRef` 复制;public DTO 不直接暴露 application helper type |
| `ArtifactProtocolOperationName` | rejection / validation surface | 必须等于 command、consumer 或 job protocol 名称之一;不使用 HTTP path、topic 或 cron 名 |

### 7.2 Command request / response envelope

```rust
/// Artifact command request envelope。
pub struct ArtifactCommandRequest<T> {
    /// Actor、trace、idempotency key 和 command metadata。
    pub metadata: CommandMetadata,
    /// Route-neutral command name。
    pub command_name: ArtifactCommandName,
    /// Command-specific request body。
    pub body: T,
}

/// Artifact command accepted response envelope。
pub struct ArtifactCommandResponse<T> {
    /// Route-neutral command name。
    pub command_name: ArtifactCommandName,
    /// Stored result ref, duplicate replay 必须回放同一 ref。
    pub result_ref: ArtifactProtocolResultRef,
    /// Accepted command-specific result。
    pub body: T,
    /// Accepted side-effect summary。
    pub effect: ArtifactCommandEffectSummary,
}

/// Artifact command outcome union。
pub enum ArtifactCommandOutcome<T> {
    /// Command accepted and returned typed result。
    Accepted(ArtifactCommandResponse<T>),
    /// Command rejected before accepted truth mutation。
    Rejected(ArtifactProtocolRejection),
}
```

| Field | 类型 | 来源 | 约束 |
|---|---|---|---|
| `metadata` | `CommandMetadata` | API / SDK command metadata | 必须含 actor、core trace id、idempotency key 和 request digest 输入 |
| `command_name` | `ArtifactCommandName` | route / handler normalization | 必须与 `body` DTO 类型匹配 |
| `result_ref` | `ArtifactProtocolResultRef` | mapped from Step 7 stored result repository output | duplicate replay 使用同一 stored result identity,但 public DTO 不暴露 application helper type |
| `effect` | `ArtifactCommandEffectSummary` | accepted transaction result | 不得由 API handler 反查 repository 拼装 |

### 7.3 Query request / response envelope

```rust
/// Artifact query request envelope。
pub struct ArtifactQueryRequest<T> {
    /// Actor、trace、consistency hint 和 query metadata。
    pub metadata: QueryMetadata,
    /// Route-neutral query name。
    pub query_name: ArtifactQueryName,
    /// Query-specific request body。
    pub body: T,
}

/// Artifact query response envelope。
pub struct ArtifactQueryResponse<T> {
    /// Route-neutral query name。
    pub query_name: ArtifactQueryName,
    /// Query public surface。
    pub surface: ArtifactQuerySurface,
    /// Visible body;not-visible 或 rejected readable path 时必须为空。
    pub body: Option<T>,
}

/// Artifact query page response envelope。
pub struct ArtifactPageResponse<T> {
    /// Route-neutral query name。
    pub query_name: ArtifactQueryName,
    /// Query public surface。
    pub surface: ArtifactQuerySurface,
    /// Returned page items。
    pub items: Vec<T>,
    /// Page metadata copied from repository page result。
    pub page: ArtifactPageSurface,
}
```

Query 不使用 command idempotency key、不保存 stored result、不 append relay item、不写 trace / backref / stale marker。Query handler 返回 `Result<ArtifactQueryResponse<T>, ApplicationError>` 或 `Result<ArtifactPageResponse<T>, ApplicationError>`,其中 not-visible / stale / degraded 属于 `surface` 而不是 infrastructure error。

### 7.4 Query surface / page / freshness helper

```rust
/// Query visibility result。
pub enum ArtifactQueryVisibility {
    /// Actor can read the response body。
    Visible,
    /// Actor cannot read the response body。
    NotVisible,
    /// Visibility cannot be decided from current committed state。
    VisibilityUnknown,
}

/// Query freshness marker。
pub enum ArtifactQueryFreshness {
    /// Source projection / view is fresh。
    Fresh,
    /// Source projection / view is stale but readable。
    StaleReadable,
    /// Source projection / view is rebuilding。
    Rebuilding,
    /// Freshness does not apply to this truth read。
    NotApplicable,
}

/// Query degraded reason。
pub enum ArtifactQueryDegradedReason {
    /// Requested truth or projection is missing。
    MissingSource,
    /// Projection exists but is stale beyond read policy。
    StaleSource,
    /// External reference state is unresolved。
    ExternalReferenceUnresolved,
    /// External reference state is failed or unavailable。
    ExternalReferenceUnavailable,
    /// Requested body is redacted by visibility。
    Redacted,
}

/// Query public surface。
pub struct ArtifactQuerySurface {
    /// Visibility decision copied from read policy / read model。
    pub visibility: ArtifactQueryVisibility,
    /// Freshness decision copied from derived view state when applicable。
    pub freshness: ArtifactQueryFreshness,
    /// Optional degraded reasons;empty means normal visible / not-visible response。
    pub degraded_reasons: Vec<ArtifactQueryDegradedReason>,
    /// Optional source cursor copied from truth / projection / report read model。
    pub source_cursor: Option<ArtifactTruthCursor>,
}

/// Public page metadata。
pub struct ArtifactPageSurface {
    /// Stable page cursor returned by repository page result。
    pub page_cursor: Option<ArtifactPageCursor>,
    /// Returned item count。
    pub returned_count: u32,
    /// Whether repository reports a next page。
    pub has_next: bool,
}

/// Public page cursor used by API / job request DTOs。
pub struct ArtifactPageCursor(pub String);

/// Public page request used by API / job request DTOs。
pub struct ArtifactPageRequest {
    /// Optional public page cursor。
    pub cursor: Option<ArtifactPageCursor>,
    /// Requested page limit。
    pub limit: u32,
}

/// Public inbound receipt disposition。
pub enum ArtifactInboundReceiptDisposition {
    /// Payload accepted and local reference / stale marker updated。
    Accepted,
    /// Same dedup key and same digest already processed。
    Duplicate,
    /// Required upstream ref is not yet resolvable。
    Delayed,
    /// Payload is valid schema but rejected by policy / selector。
    Rejected,
    /// Schema version is unsupported。
    UnsupportedSchema,
    /// Dedup conflict or unsafe payload relation was quarantined。
    Quarantined,
}

/// Public job report outcome。
pub enum ArtifactJobProtocolOutcome {
    /// Job completed all requested work。
    Completed,
    /// Job completed part of the requested work and reported failed refs。
    PartiallyCompleted,
    /// Job failed before producing useful changes。
    Failed,
}
```

surface 来源红线:

- `visibility` 只能来自 `ArtifactReadVisibilityPolicy` 或 application read model 的正式 visibility decision,不得由 API handler 从 error string 推断。
- `freshness` 只能来自 `ArtifactDerivedViewState`、summary view state、report state 或 read model marker,不得由 timestamp / cache age 拼接。
- `degraded_reasons` 只能由 query service 复制 Step 6/7 read model、reference state、derived state 或 policy output,不得在 entry 层临时发明。
- Query response body 不能包含外部正文、provider raw payload、archive package body、runtime log 或 conversation transcript。
- `ArtifactPageRequest` 是 public DTO;entry normalizer 必须显式转换成 Step 7 application-local `ArtifactRepositoryPage`,不得在 public DTO 中暴露 `ArtifactRepositoryCursor`。
- `ArtifactPageSurface.page_cursor` 是 public cursor;response mapper 必须从 Step 7 `Page<T>.next_cursor` 复制 / 包装,不得把 repository cursor helper 直接暴露给 public DTO。
- `ArtifactInboundReceiptDisposition` 和 `ArtifactJobProtocolOutcome` 是 public protocol labels;它们分别从 Step 6 application-local `ArtifactInboundDisposition` 和 `ArtifactJobOutcome` 映射,不得让 public DTO 直接依赖 application helper。

### 7.5 Protocol rejection surface

```rust
/// 协议拒绝分类。
pub enum ArtifactProtocolRejectionCode {
    /// Request envelope 缺字段或字段格式错误。
    InvalidEnvelope,
    /// Request body 缺少必填 ref / marker / intent。
    MissingRequiredField,
    /// Request body 与 route-neutral operation name 不匹配。
    OperationMismatch,
    /// Command idempotency key 与 request digest 冲突。
    DuplicateConflict,
    /// Domain / policy guard 拒绝。
    PolicyRejected,
    /// Request 尝试携带 forbidden body。
    BodyForbidden,
    /// Request schema version 不被支持。
    UnsupportedSchema,
}

/// Public protocol rejection。
pub struct ArtifactProtocolRejection {
    /// Rejected protocol surface。
    pub surface_ref: ArtifactProtocolSurfaceRef,
    /// Rejected operation name。
    pub operation_name: ArtifactProtocolOperationName,
    /// Rejection code。
    pub rejection_code: ArtifactProtocolRejectionCode,
    /// Redacted validation issue refs。
    pub issue_refs: ArtifactProtocolValidationIssueRefSet,
    /// Stored result ref,如果 rejection 已持久化用于 duplicate replay。
    pub result_ref: Option<ArtifactProtocolResultRef>,
}
```

Command handler 对可预期协议拒绝返回 `ArtifactCommandOutcome::Rejected`,只有 infrastructure failure、repository failure、UoW failure、serialization defect 或 adapter failure 使用 `ApplicationError`。Inbound consumer 和 job 有独立 receipt / report surface,不复用 command rejection。

---

## 8. Command API protocol

Command API 是唯一同步改写 Artifact truth / history / trace / relay snapshot 的 public protocol family。所有 Command 必须使用 `ArtifactCommandRequest<T>` envelope,并通过 `CommandMetadata` 提供 actor、core trace id、idempotency key、request digest 和 request time 来源。Command body 只能携带 typed ref、reason carrier、state intent、body-free summary ref 和 safe marker,不得携带 artifact content body、external source body、runtime log、conversation body、archive body 或 downstream private copy。

### 8.1 Command effect summary and result DTOs

```rust
/// Accepted command side-effect summary。
pub struct ArtifactCommandEffectSummary {
    /// Truth anchor touched by the command when one exists。
    pub truth_anchor_ref: Option<ArtifactTruthAnchorRef>,
    /// Accepted fact change record。
    pub fact_change_record_ref: Option<ArtifactFactChangeRecordRef>,
    /// Accepted version change record。
    pub version_change_record_ref: Option<ArtifactVersionChangeRecordRef>,
    /// Accepted lineage change record。
    pub lineage_change_record_ref: Option<ArtifactLineageChangeRecordRef>,
    /// Accepted baseline change record。
    pub baseline_change_record_ref: Option<ArtifactBaselineChangeRecordRef>,
    /// Accepted trace record。
    pub trace_record_ref: Option<ArtifactTraceRecordRef>,
    /// Relay items appended in the accepted transaction。
    pub relay_item_refs: Vec<ArtifactRelayItemRef>,
    /// Accepted truth cursor returned by the transaction boundary。
    pub source_cursor: Option<ArtifactTruthCursor>,
}

/// Intake command result。
pub struct ArtifactIntakeCommandResult {
    /// Created or updated intake context。
    pub intake_context_ref: ArtifactIntakeContextRef,
    /// Optional created submission。
    pub submission_ref: Option<ArtifactSubmissionRef>,
    /// Optional input resolution record。
    pub resolution_record_ref: Option<ArtifactInputResolutionRecordRef>,
}

/// Truth command result for fact / version mutations。
pub struct ArtifactTruthCommandResult {
    /// Touched truth anchor。
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    /// Optional fact change record。
    pub fact_change_record_ref: Option<ArtifactFactChangeRecordRef>,
    /// Optional version change record。
    pub version_change_record_ref: Option<ArtifactVersionChangeRecordRef>,
    /// Optional trace record。
    pub trace_record_ref: Option<ArtifactTraceRecordRef>,
}

/// Lineage command result。
pub struct ArtifactLineageCommandResult {
    /// Created or changed lineage link。
    pub artifact_lineage_link_ref: ArtifactLineageLinkRef,
    /// Lineage change record。
    pub change_record_ref: ArtifactLineageChangeRecordRef,
}

/// Baseline command result。
pub struct ArtifactBaselineCommandResult {
    /// Created or changed baseline。
    pub artifact_baseline_ref: ArtifactBaselineRef,
    /// Membership refs included in the baseline result。
    pub membership_refs: ArtifactBaselineMembershipRefSet,
    /// Baseline change record。
    pub change_record_ref: ArtifactBaselineChangeRecordRef,
}

/// Review command result。
pub struct ArtifactReviewCommandResult {
    /// Review anchor touched by the command。
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    /// Optional responsibility assignment created or changed。
    pub responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
    /// Review trace record。
    pub trace_record_ref: ArtifactReviewTraceRecordRef,
}

/// Automation boundary command result。
pub struct ArtifactAutomationCommandResult {
    /// Automation input touched by the command。
    pub automation_input_ref: AutomationArtifactInputRef,
    /// Automation audit record。
    pub audit_record_ref: AutomationIntakeAuditRecordRef,
    /// Optional intake context after acceptance。
    pub intake_context_ref: Option<ArtifactIntakeContextRef>,
}

/// Consumption command result。
pub struct ArtifactConsumptionCommandResult {
    /// Optional consumable artifact reference。
    pub consumable_ref: Option<ConsumableArtifactReferenceRef>,
    /// Optional consumption backref。
    pub backref_ref: Option<ArtifactConsumptionBackrefRef>,
    /// Optional trace record。
    pub trace_record_ref: Option<ArtifactTraceRecordRef>,
}
```

| Result DTO | Step 7 source | Forbidden fallback |
|---|---|---|
| `ArtifactIntakeCommandResult` | `ArtifactIntakeWriteResult` | 不从 intake repository 重读后拼装 |
| `ArtifactTruthCommandResult` | `ArtifactTruthWriteResult` | 不从 changed object state 推测 missing record ref |
| `ArtifactLineageCommandResult` | `ArtifactLineageWriteResult` | 不把 lineage ref 当 truth anchor union 自动扩展 |
| `ArtifactBaselineCommandResult` | `ArtifactBaselineWriteResult` | 不动态解析 current version 填充 membership |
| `ArtifactReviewCommandResult` | `ArtifactReviewWriteResult` | 不返回 actor profile body |
| `ArtifactAutomationCommandResult` | `ArtifactAutomationWriteResult` | 不返回 runtime signal body |
| `ArtifactConsumptionCommandResult` | `ArtifactConsumptionWriteResult` | 不把 query read trace 当 write trace |

### 8.2 Intake / fact / version command request DTOs

```rust
/// Register Artifact intake request。
pub struct RegisterArtifactIntakeRequest {
    /// Source of body-free artifact content。
    pub source_ref: ArtifactContentSourceRef,
    /// Intake kind。
    pub intake_kind: ArtifactIntakeKind,
    /// Optional method artifact definition ref。
    pub definition_ref: Option<ArtifactDefinitionRef>,
    /// Optional work context ref。
    pub work_context_ref: Option<ArtifactWorkContextRef>,
    /// Optional process context ref。
    pub process_context_ref: Option<ArtifactProcessContextRef>,
    /// Optional governance context ref。
    pub governance_context_ref: Option<ArtifactGovernanceContextRef>,
}

/// Establish Artifact fact request。
pub struct EstablishArtifactFactRequest {
    /// Intake context accepted by prior intake command。
    pub intake_context_ref: ArtifactIntakeContextRef,
    /// Artifact definition ref。
    pub definition_ref: ArtifactDefinitionRef,
    /// Optional review anchor used as establish basis。
    pub review_anchor_ref: Option<ArtifactReviewAnchorRef>,
}

/// Create Artifact version candidate request。
pub struct CreateArtifactVersionCandidateRequest {
    /// Artifact fact for the candidate。
    pub artifact_fact_ref: ArtifactFactRef,
    /// Proposed content context ref;body-free only。
    pub proposed_content_context_ref: ArtifactContentFactContextRef,
    /// Candidate source ref。
    pub candidate_source_ref: ArtifactContentSourceRef,
    /// Submission record that produced this candidate。
    pub submission_ref: ArtifactSubmissionRef,
}

/// Publish Artifact version request。
pub struct PublishArtifactVersionRequest {
    /// Candidate selected for publish。
    pub artifact_version_candidate_ref: ArtifactVersionCandidateRef,
    /// Publish reason / basis。
    pub publish_reason: ArtifactChangeBasisRef,
}

/// Supersede Artifact version request。
pub struct SupersedeArtifactVersionRequest {
    /// Current formal version。
    pub current_version_ref: ArtifactVersionRef,
    /// Next formal version。
    pub next_version_ref: ArtifactVersionRef,
    /// Supersede reason / basis。
    pub supersede_reason: ArtifactChangeBasisRef,
}
```

| Request DTO | Service input | Field source map |
|---|---|---|
| `RegisterArtifactIntakeRequest` | `RegisterArtifactIntakeInput` | `context` from envelope metadata;remaining fields copied 1:1 from request |
| `EstablishArtifactFactRequest` | `EstablishArtifactFactInput` | `context` from envelope metadata;`intake_context_ref` / `definition_ref` / `review_anchor_ref` copied 1:1 |
| `CreateArtifactVersionCandidateRequest` | `CreateArtifactVersionCandidateInput` | `context` from envelope metadata;`artifact_fact_ref` / `proposed_content_context_ref` / `candidate_source_ref` / `submission_ref` copied 1:1 |
| `PublishArtifactVersionRequest` | `PublishArtifactVersionInput` | `context` from envelope metadata;candidate and reason copied 1:1 |
| `SupersedeArtifactVersionRequest` | `SupersedeArtifactVersionInput` | `context` from envelope metadata;current / next / reason copied 1:1 |

### 8.3 Lineage / baseline command request DTOs

```rust
/// Establish Artifact lineage link request。
pub struct EstablishArtifactLineageLinkRequest {
    /// Source version ref。
    pub source_version_ref: ArtifactVersionRef,
    /// Target version ref。
    pub target_version_ref: ArtifactVersionRef,
    /// Relation kind。
    pub relation_kind: ArtifactLineageRelationKind,
    /// Relation basis ref。
    pub basis_ref: ArtifactLineageBasisRef,
}

/// Reject Artifact lineage link request。
pub struct RejectArtifactLineageLinkRequest {
    /// Existing lineage link ref。
    pub artifact_lineage_link_ref: ArtifactLineageLinkRef,
    /// Reject reason / basis。
    pub reject_reason: ArtifactLineageBasisRef,
}

/// Create Artifact baseline candidate request。
pub struct CreateArtifactBaselineCandidateRequest {
    /// Baseline scope。
    pub baseline_scope_ref: ArtifactBaselineScopeRef,
    /// Formal version refs selected as members。
    pub member_version_refs: Vec<ArtifactVersionRef>,
    /// Membership reason。
    pub membership_reason: ArtifactBaselineMembershipReason,
}

/// Freeze Artifact baseline request。
pub struct FreezeArtifactBaselineRequest {
    /// Baseline to freeze。
    pub artifact_baseline_ref: ArtifactBaselineRef,
    /// Review anchor used as freeze context。
    pub freeze_context_ref: ArtifactReviewAnchorRef,
}

/// Supersede Artifact baseline request。
pub struct SupersedeArtifactBaselineRequest {
    /// Current baseline。
    pub current_baseline_ref: ArtifactBaselineRef,
    /// Next baseline。
    pub next_baseline_ref: ArtifactBaselineRef,
}
```

| Request DTO | Service input | Field source map |
|---|---|---|
| `EstablishArtifactLineageLinkRequest` | `EstablishArtifactLineageLinkInput` | `context` from envelope metadata;source / target / kind / basis copied 1:1 |
| `RejectArtifactLineageLinkRequest` | `RejectArtifactLineageLinkInput` | `context` from envelope metadata;link ref and reject reason copied 1:1 |
| `CreateArtifactBaselineCandidateRequest` | `CreateArtifactBaselineCandidateInput` | `context` from envelope metadata;scope, ordered member refs and reason copied 1:1 |
| `FreezeArtifactBaselineRequest` | `FreezeArtifactBaselineInput` | `context` from envelope metadata;baseline and review anchor copied 1:1 |
| `SupersedeArtifactBaselineRequest` | `SupersedeArtifactBaselineInput` | `context` from envelope metadata;current and next baseline copied 1:1 |

Baseline request red lines:

- `member_version_refs` must be stable ordered and duplicate rejected before service input creation;empty set is invalid for candidate creation.
- `FreezeArtifactBaselineRequest` cannot carry dynamic current-version resolver instruction;membership is owned by the baseline truth.
- `SupersedeArtifactBaselineRequest` does not delete prior baseline or hide membership history.

### 8.4 Review / automation / consumption command request DTOs

```rust
/// Open Artifact review anchor request。
pub struct OpenArtifactReviewAnchorRequest {
    /// Truth anchor under review。
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    /// Review reason。
    pub review_reason: ArtifactReviewReason,
}

/// Assign Artifact responsibility request。
pub struct AssignArtifactResponsibilityRequest {
    /// Review anchor receiving responsibility assignment。
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    /// Responsible actor。
    pub responsible_party_ref: ActorRef,
    /// Assignment basis。
    pub basis_ref: ArtifactResponsibilityBasisRef,
}

/// Register automation Artifact input request。
pub struct RegisterAutomationArtifactInputRequest {
    /// Automation source ref。
    pub automation_source_ref: AutomationSourceRef,
    /// Candidate kind。
    pub candidate_kind: AutomationArtifactCandidateKind,
    /// Artifact truth anchor this candidate derives from。
    pub derived_from_ref: ArtifactTruthAnchorRef,
}

/// Accept automation Artifact input request。
pub struct AcceptAutomationArtifactInputRequest {
    /// Automation input to accept。
    pub automation_input_ref: AutomationArtifactInputRef,
    /// Intake context to bind after acceptance。
    pub intake_context_ref: ArtifactIntakeContextRef,
}

/// Issue consumable Artifact reference request。
pub struct IssueConsumableArtifactReferenceRequest {
    /// Truth anchor to expose for consumption。
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    /// Consumer scope。
    pub consumer_scope_ref: ArtifactConsumerScopeRef,
}

/// Record Artifact consumption backref request。
pub struct RecordArtifactConsumptionBackrefRequest {
    /// Adjacent consumer。
    pub consumer_ref: AdjacentConsumerRef,
    /// Consumable ref used by the consumer。
    pub consumable_ref: ConsumableArtifactReferenceRef,
    /// Consumption reason。
    pub consumption_reason: ArtifactConsumptionReason,
}
```

| Request DTO | Service input | Field source map |
|---|---|---|
| `OpenArtifactReviewAnchorRequest` | `OpenArtifactReviewAnchorInput` | `context` from envelope metadata;truth anchor and reason copied 1:1 |
| `AssignArtifactResponsibilityRequest` | `AssignArtifactResponsibilityInput` | `context` from envelope metadata;review anchor, actor and basis copied 1:1 |
| `RegisterAutomationArtifactInputRequest` | `RegisterAutomationArtifactInputInput` | `context` from envelope metadata;source, candidate kind and derived anchor copied 1:1 |
| `AcceptAutomationArtifactInputRequest` | `AcceptAutomationArtifactInputInput` | `context` from envelope metadata;automation input and intake context copied 1:1 |
| `IssueConsumableArtifactReferenceRequest` | `IssueConsumableArtifactReferenceInput` | `context` from envelope metadata;truth anchor and consumer scope copied 1:1 |
| `RecordArtifactConsumptionBackrefRequest` | `RecordArtifactConsumptionBackrefInput` | `context` from envelope metadata;consumer, consumable and reason copied 1:1 |

### 8.5 Command route mapping

| Route-neutral entry | Request envelope | Accepted response envelope | Rejected response | Idempotency |
|---|---|---|---|---|
| `RegisterArtifactIntake` | `ArtifactCommandRequest<RegisterArtifactIntakeRequest>` | `ArtifactCommandResponse<ArtifactIntakeCommandResult>` | `ArtifactProtocolRejection` | required |
| `EstablishArtifactFact` | `ArtifactCommandRequest<EstablishArtifactFactRequest>` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactProtocolRejection` | required |
| `CreateArtifactVersionCandidate` | `ArtifactCommandRequest<CreateArtifactVersionCandidateRequest>` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactProtocolRejection` | required |
| `PublishArtifactVersion` | `ArtifactCommandRequest<PublishArtifactVersionRequest>` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactProtocolRejection` | required |
| `SupersedeArtifactVersion` | `ArtifactCommandRequest<SupersedeArtifactVersionRequest>` | `ArtifactCommandResponse<ArtifactTruthCommandResult>` | `ArtifactProtocolRejection` | required |
| `EstablishArtifactLineageLink` | `ArtifactCommandRequest<EstablishArtifactLineageLinkRequest>` | `ArtifactCommandResponse<ArtifactLineageCommandResult>` | `ArtifactProtocolRejection` | required |
| `RejectArtifactLineageLink` | `ArtifactCommandRequest<RejectArtifactLineageLinkRequest>` | `ArtifactCommandResponse<ArtifactLineageCommandResult>` | `ArtifactProtocolRejection` | required |
| `CreateArtifactBaselineCandidate` | `ArtifactCommandRequest<CreateArtifactBaselineCandidateRequest>` | `ArtifactCommandResponse<ArtifactBaselineCommandResult>` | `ArtifactProtocolRejection` | required |
| `FreezeArtifactBaseline` | `ArtifactCommandRequest<FreezeArtifactBaselineRequest>` | `ArtifactCommandResponse<ArtifactBaselineCommandResult>` | `ArtifactProtocolRejection` | required |
| `SupersedeArtifactBaseline` | `ArtifactCommandRequest<SupersedeArtifactBaselineRequest>` | `ArtifactCommandResponse<ArtifactBaselineCommandResult>` | `ArtifactProtocolRejection` | required |
| `OpenArtifactReviewAnchor` | `ArtifactCommandRequest<OpenArtifactReviewAnchorRequest>` | `ArtifactCommandResponse<ArtifactReviewCommandResult>` | `ArtifactProtocolRejection` | required |
| `AssignArtifactResponsibility` | `ArtifactCommandRequest<AssignArtifactResponsibilityRequest>` | `ArtifactCommandResponse<ArtifactReviewCommandResult>` | `ArtifactProtocolRejection` | required |
| `RegisterAutomationArtifactInput` | `ArtifactCommandRequest<RegisterAutomationArtifactInputRequest>` | `ArtifactCommandResponse<ArtifactAutomationCommandResult>` | `ArtifactProtocolRejection` | required |
| `AcceptAutomationArtifactInput` | `ArtifactCommandRequest<AcceptAutomationArtifactInputRequest>` | `ArtifactCommandResponse<ArtifactAutomationCommandResult>` | `ArtifactProtocolRejection` | required |
| `IssueConsumableArtifactReference` | `ArtifactCommandRequest<IssueConsumableArtifactReferenceRequest>` | `ArtifactCommandResponse<ArtifactConsumptionCommandResult>` | `ArtifactProtocolRejection` | required |
| `RecordArtifactConsumptionBackref` | `ArtifactCommandRequest<RecordArtifactConsumptionBackrefRequest>` | `ArtifactCommandResponse<ArtifactConsumptionCommandResult>` | `ArtifactProtocolRejection` | required |

所有 command route 的 public handler 返回形态是 `Result<ArtifactCommandOutcome<T>, ApplicationError>`。same idempotency key + same digest 的 duplicate replay 必须回放 accepted response 或 rejected response;same key + different digest 必须返回 `DuplicateConflict` rejection 并持久化 conflict marker,不得执行 domain service。

### 8.6 Command protocol stop-review

| 检查项 | 结论 |
|---|---|
| 16 个 Command 是否都有 request DTO | 是 |
| 16 个 Command 是否都映射到 Step 7 service input | 是,§8.2~§8.4 已逐项列 source map |
| accepted result 是否字段级闭口 | 是,全部从 Step 7 shared output carrier 复制 |
| command envelope 是否包含 metadata/idempotency | 是,统一使用 `ArtifactCommandRequest<T>` |
| command body 是否 body-free | 是,仅 typed ref、reason、kind、state intent 和 ref set |
| duplicate replay 是否闭口 | 是,stored command result / rejection surface 由 Step 7 repository 读取 |
| Step 9 承接 | Step 9 必须为 16 个 command 写 transaction、policy、history、relay snapshot 和 stored-result 顺序 |

---

## 9. Query API protocol

Query API 是 read-only public protocol family。所有 Query 必须使用 `ArtifactQueryRequest<T>` envelope,由 `QueryMetadata` 提供 actor、core trace id、consistency hint、page request 和 read purpose。Query 不使用 command idempotency、不保存 stored result、不 append relay item、不写 `ArtifactTraceRecord` / `ArtifactConsumptionBackref` / stale marker。not-visible、missing、stale、unresolved 和 degraded 都必须进入 `ArtifactQuerySurface`。

### 9.1 Query view DTOs

```rust
/// Artifact fact public view。
pub struct ArtifactFactView {
    /// Fact truth ref。
    pub artifact_fact_ref: ArtifactFactRef,
    /// Artifact definition ref。
    pub definition_ref: ArtifactDefinitionRef,
    /// Content context ref。
    pub content_context_ref: ArtifactContentFactContextRef,
    /// Current fact state。
    pub fact_state: ArtifactFactState,
    /// Optional current formal version。
    pub current_version_ref: Option<ArtifactVersionRef>,
    /// Optional summary view ref。
    pub summary_view_ref: Option<ArtifactFactSummaryViewRef>,
}

/// Artifact version public view。
pub struct ArtifactVersionView {
    /// Version ref。
    pub artifact_version_ref: ArtifactVersionRef,
    /// Owning fact ref。
    pub artifact_fact_ref: ArtifactFactRef,
    /// Version state。
    pub version_state: ArtifactVersionState,
    /// Optional candidate source。
    pub candidate_ref: Option<ArtifactVersionCandidateRef>,
    /// Optional summary view ref。
    pub summary_view_ref: Option<ArtifactVersionSummaryViewRef>,
}

/// Artifact lineage public view。
pub struct ArtifactLineageView {
    /// Version whose lineage is being read。
    pub artifact_version_ref: ArtifactVersionRef,
    /// Lineage link refs in stable order。
    pub relation_refs: ArtifactLineageLinkRefSet,
    /// Optional summary view ref。
    pub summary_view_ref: Option<ArtifactLineageSummaryViewRef>,
}

/// Artifact baseline public view。
pub struct ArtifactBaselineView {
    /// Baseline ref。
    pub artifact_baseline_ref: ArtifactBaselineRef,
    /// Baseline state。
    pub baseline_state: ArtifactBaselineState,
    /// Membership refs。
    pub membership_refs: ArtifactBaselineMembershipRefSet,
    /// Optional summary view ref。
    pub summary_view_ref: Option<ArtifactBaselineSummaryViewRef>,
}

/// Artifact review public view。
pub struct ArtifactReviewView {
    /// Review anchor ref。
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    /// Review state。
    pub review_state: ArtifactReviewState,
    /// Optional responsibility assignment。
    pub responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
    /// Optional summary view ref。
    pub summary_view_ref: Option<ArtifactReviewSummaryViewRef>,
}

/// Artifact external reference resolution public view。
pub struct ArtifactReferenceResolutionView {
    /// Resolution state ref。
    pub resolution_state_ref: ExternalReferenceResolutionStateRef,
    /// External ref。
    pub external_ref: ExternalSourceRef,
    /// Reference kind。
    pub reference_kind: ArtifactExternalReferenceKind,
    /// Current resolution state。
    pub resolution_state: ArtifactExternalResolutionState,
    /// Optional local mirror snapshot。
    pub snapshot_ref: Option<LocalMirrorSnapshotRef>,
    /// Optional last refresh record。
    pub last_refresh_record_ref: Option<ExternalMirrorRefreshRecordRef>,
}
```

| View DTO | Step 7 read model source | Field closure |
|---|---|---|
| `ArtifactFactView` | `ArtifactFactReadModel` | fact fields + content context + optional summary view |
| `ArtifactVersionView` | `ArtifactVersionReadModel` | version fields + optional summary view |
| `ArtifactLineageView` | `ArtifactLineageReadModel` | lineage links and optional summary view |
| `ArtifactBaselineView` | `ArtifactBaselineReadModel` | baseline + memberships + optional summary view |
| `ArtifactReviewView` | `ArtifactReviewReadModel` | review anchor + optional responsibility + optional summary |
| `ArtifactReadSurfaceView` | Step 6 public view object | returned directly from `ArtifactReadSurfaceReadModel.surface_view` |
| `ArtifactPreviewView` | Step 6 public view object | returned directly from `ArtifactPreviewReadModel.preview_view` |
| `ArtifactReportView` | Step 6 public view object | returned directly from `ArtifactReportReadModel.report_view` |
| `ArtifactReconciliationReport` | Step 6 public report object | returned directly from `ArtifactReconciliationReadModel.report` |
| `ArtifactReferenceResolutionView` | `ArtifactReferenceResolutionReadModel` | state + snapshot + refresh record refs only |

### 9.2 Core truth query request DTOs

```rust
/// Get Artifact fact request。
pub struct GetArtifactFactRequest {
    /// Fact ref。
    pub artifact_fact_ref: ArtifactFactRef,
}

/// Get Artifact version request。
pub struct GetArtifactVersionRequest {
    /// Version ref。
    pub artifact_version_ref: ArtifactVersionRef,
}

/// List Artifact versions by fact request。
pub struct ListArtifactVersionsByFactRequest {
    /// Fact ref。
    pub artifact_fact_ref: ArtifactFactRef,
    /// Page request。
    pub page: ArtifactPageRequest,
}

/// Get Artifact lineage summary request。
pub struct GetArtifactLineageSummaryRequest {
    /// Version ref used as lineage subject。
    pub artifact_version_ref: ArtifactVersionRef,
}

/// Get Artifact baseline request。
pub struct GetArtifactBaselineRequest {
    /// Baseline ref。
    pub artifact_baseline_ref: ArtifactBaselineRef,
}

/// Get Artifact review summary request。
pub struct GetArtifactReviewSummaryRequest {
    /// Review anchor ref。
    pub review_anchor_ref: ArtifactReviewAnchorRef,
}
```

| Request DTO | Service input | Response body |
|---|---|---|
| `GetArtifactFactRequest` | `GetArtifactFactInput` | `ArtifactFactView` |
| `GetArtifactVersionRequest` | `GetArtifactVersionInput` | `ArtifactVersionView` |
| `ListArtifactVersionsByFactRequest` | `ListArtifactVersionsByFactInput` | `ArtifactPageResponse<ArtifactVersionSummaryView>` |
| `GetArtifactLineageSummaryRequest` | `GetArtifactLineageSummaryInput` | `ArtifactLineageView` |
| `GetArtifactBaselineRequest` | `GetArtifactBaselineInput` | `ArtifactBaselineView` |
| `GetArtifactReviewSummaryRequest` | `GetArtifactReviewSummaryInput` | `ArtifactReviewView` |

### 9.3 Consumption / trace / search query request DTOs

```rust
/// Get Artifact read surface request。
pub struct GetArtifactReadSurfaceRequest {
    /// Optional consumable ref lookup。
    pub consumable_ref: Option<ConsumableArtifactReferenceRef>,
    /// Optional truth anchor lookup。
    pub truth_anchor_ref: Option<ArtifactTruthAnchorRef>,
    /// Adjacent consumer requesting the read。
    pub consumer_ref: AdjacentConsumerRef,
}

/// Get Artifact trace request。
pub struct GetArtifactTraceRequest {
    /// Truth anchor whose trace is requested。
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    /// Page request。
    pub page: ArtifactPageRequest,
}

/// Search Artifact facts request。
pub struct SearchArtifactFactsRequest {
    /// Optional definition filter。
    pub definition_ref: Option<ArtifactDefinitionRef>,
    /// Optional fact state filter。
    pub fact_state: Option<ArtifactFactState>,
    /// Optional baseline scope filter。
    pub baseline_scope_ref: Option<ArtifactBaselineScopeRef>,
    /// Page request。
    pub page: ArtifactPageRequest,
}
```

| Request DTO | Service input | Response body | Special surface |
|---|---|---|---|
| `GetArtifactReadSurfaceRequest` | `GetArtifactReadSurfaceInput` | `ArtifactReadSurfaceView` | visibility / freshness / degraded are mandatory surface fields |
| `GetArtifactTraceRequest` | `GetArtifactTraceInput` | `ArtifactPageResponse<ArtifactTraceRecord>` | no trace write,only read existing trace |
| `SearchArtifactFactsRequest` | `SearchArtifactFactsInput` | `ArtifactPageResponse<ArtifactFactSummaryView>` | stale projection uses freshness marker |

Read surface selector rule:

- Exactly one of `consumable_ref` or `truth_anchor_ref` must be present unless Step 9 later defines a rejected selector branch.
- `consumer_ref` is required for all branches;query service may call visibility policy,entry handler may not decide visibility.
- Query never records consumption backref;backref write requires `RecordArtifactConsumptionBackref` command.

### 9.4 Derived / report / reference query request DTOs

```rust
/// Get Artifact preview request。
pub struct GetArtifactPreviewRequest {
    /// Truth anchor whose preview is requested。
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
}

/// Get Artifact report request。
pub struct GetArtifactReportRequest {
    /// Report scope。
    pub report_scope_ref: ArtifactReportScopeRef,
}

/// Get Artifact reconciliation report request。
pub struct GetArtifactReconciliationReportRequest {
    /// Reconciliation scope。
    pub reconciliation_scope_ref: ArtifactReconciliationScopeRef,
}

/// Get external reference resolution request。
pub struct GetExternalReferenceResolutionRequest {
    /// Optional direct resolution state ref。
    pub resolution_state_ref: Option<ExternalReferenceResolutionStateRef>,
    /// Optional external source ref。
    pub external_ref: Option<ExternalSourceRef>,
    /// Optional reference kind for external ref lookup。
    pub reference_kind: Option<ArtifactExternalReferenceKind>,
}
```

| Request DTO | Service input | Response body | Missing / degraded rule |
|---|---|---|---|
| `GetArtifactPreviewRequest` | `GetArtifactPreviewInput` | `ArtifactPreviewView` | missing preview => degraded missing marker |
| `GetArtifactReportRequest` | `GetArtifactReportInput` | `ArtifactReportView` | missing report => degraded missing marker |
| `GetArtifactReconciliationReportRequest` | `GetArtifactReconciliationReportInput` | `ArtifactReconciliationReport` | missing report => degraded missing marker |
| `GetExternalReferenceResolutionRequest` | `GetExternalReferenceResolutionInput` | `ArtifactReferenceResolutionView` | unresolved / failed state => degraded marker,not refresh |

External reference selector rule:

- `resolution_state_ref` branch reads by exact state ref.
- `external_ref + reference_kind` branch reads by external ref and kind.
- Both branches missing is rejected before service call.
- Both branches present must be rejected unless Step 9 defines exact precedence;current Step 8 does not allow fallback precedence.

### 9.5 Query route mapping

| Route-neutral entry | Request envelope | Response envelope | Write behavior |
|---|---|---|---|
| `GetArtifactFact` | `ArtifactQueryRequest<GetArtifactFactRequest>` | `ArtifactQueryResponse<ArtifactFactView>` | no-write |
| `GetArtifactVersion` | `ArtifactQueryRequest<GetArtifactVersionRequest>` | `ArtifactQueryResponse<ArtifactVersionView>` | no-write |
| `ListArtifactVersionsByFact` | `ArtifactQueryRequest<ListArtifactVersionsByFactRequest>` | `ArtifactPageResponse<ArtifactVersionSummaryView>` | no-write |
| `GetArtifactLineageSummary` | `ArtifactQueryRequest<GetArtifactLineageSummaryRequest>` | `ArtifactQueryResponse<ArtifactLineageView>` | no-write |
| `GetArtifactBaseline` | `ArtifactQueryRequest<GetArtifactBaselineRequest>` | `ArtifactQueryResponse<ArtifactBaselineView>` | no-write |
| `GetArtifactReviewSummary` | `ArtifactQueryRequest<GetArtifactReviewSummaryRequest>` | `ArtifactQueryResponse<ArtifactReviewView>` | no-write |
| `GetArtifactReadSurface` | `ArtifactQueryRequest<GetArtifactReadSurfaceRequest>` | `ArtifactQueryResponse<ArtifactReadSurfaceView>` | no-write |
| `GetArtifactTrace` | `ArtifactQueryRequest<GetArtifactTraceRequest>` | `ArtifactPageResponse<ArtifactTraceRecord>` | no-write |
| `SearchArtifactFacts` | `ArtifactQueryRequest<SearchArtifactFactsRequest>` | `ArtifactPageResponse<ArtifactFactSummaryView>` | no-write |
| `GetArtifactPreview` | `ArtifactQueryRequest<GetArtifactPreviewRequest>` | `ArtifactQueryResponse<ArtifactPreviewView>` | no-write |
| `GetArtifactReport` | `ArtifactQueryRequest<GetArtifactReportRequest>` | `ArtifactQueryResponse<ArtifactReportView>` | no-write |
| `GetArtifactReconciliationReport` | `ArtifactQueryRequest<GetArtifactReconciliationReportRequest>` | `ArtifactQueryResponse<ArtifactReconciliationReport>` | no-write |
| `GetExternalReferenceResolution` | `ArtifactQueryRequest<GetExternalReferenceResolutionRequest>` | `ArtifactQueryResponse<ArtifactReferenceResolutionView>` | no-write |

### 9.6 Query protocol stop-review

| 检查项 | 结论 |
|---|---|
| 13 个 Query 是否都有 request DTO | 是 |
| Query response body 是否字段级 schema | 是,Step 8 新增 truth wrapper views,Step 6 public view/report 直接复用 |
| visibility / freshness / degraded 是否闭口 | 是,统一由 `ArtifactQuerySurface` 表达 |
| Query 是否可能写入 | 否,全部 route mapping 标记 no-write |
| Page response 是否闭口 | 是,`ArtifactPageSurface` 复制 repository page result,不携带 storage cursor body |
| Selector 冲突是否闭口 | 是,read surface 和 external resolution selector 冲突必须 rejected |
| Step 9 承接 | Step 9 必须逐 Query 明确 visible / not-visible / degraded / missing / stale 分支 |

---

## 10. Inbound Event Consumer protocol

Inbound Event Consumer 只承接外部事实的 body-free ref、summary、source version、reference state、pending marker、stale marker 和 receipt。Consumer 不得直接创建 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ConsumableArtifactReference` 或 `ArtifactConsumptionBackref` truth。

### 10.1 Inbound event shared envelope

```rust
/// Inbound source family。
pub enum ArtifactInboundSourceFamily {
    /// L1-work source。
    Work,
    /// L1-process source。
    Process,
    /// L1-governance source。
    Governance,
    /// L3-method-library source。
    MethodLibrary,
    /// L2-runtime or L3-capability-hub source。
    RuntimeCapability,
    /// External content source。
    ExternalContent,
}

/// Event schema version。
pub struct ArtifactInboundEventSchemaVersion(pub String);

/// Source event id。
pub struct ArtifactSourceEventId(pub String);

/// Inbound event dedup key。
pub struct ArtifactInboundDedupKey(pub String);

/// Inbound event envelope。
pub struct ArtifactInboundEventEnvelope<T> {
    /// Source family。
    pub source_family: ArtifactInboundSourceFamily,
    /// Consumer operation name。
    pub consumer_name: ArtifactInboundConsumerName,
    /// Source event id。
    pub source_event_id: ArtifactSourceEventId,
    /// Source event schema version。
    pub schema_version: ArtifactInboundEventSchemaVersion,
    /// Source ref associated with the event。
    pub source_ref: ExternalSourceRef,
    /// Source version ref if provided by upstream。
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    /// Dedup key。
    pub dedup_key: ArtifactInboundDedupKey,
    /// Core trace id。
    pub core_trace_id: TraceId,
    /// Event-specific payload。
    pub payload: T,
}

/// Inbound event public receipt。
pub struct ArtifactInboundEventReceipt {
    /// Stored receipt result ref。
    pub result_ref: ArtifactProtocolResultRef,
    /// Consumer name。
    pub consumer_name: ArtifactInboundConsumerName,
    /// Receipt disposition。
    pub disposition: ArtifactInboundReceiptDisposition,
    /// Optional resolution state ref touched by the consumer。
    pub resolution_state_ref: Option<ExternalReferenceResolutionStateRef>,
    /// Optional refresh record ref。
    pub refresh_record_ref: Option<ExternalMirrorRefreshRecordRef>,
    /// Optional trace record ref。
    pub trace_record_ref: Option<ArtifactTraceRecordRef>,
    /// Stale derived view state refs marked by the consumer。
    pub stale_view_state_refs: Vec<ArtifactDerivedViewStateRef>,
}
```

Envelope rules:

- `schema_version` unsupported returns `UnsupportedSchema` receipt and must not parse payload fields.
- `dedup_key` duplicate same digest replays stored receipt;duplicate conflict returns `Quarantined` or `Rejected` according to Step 12 mapping.
- `source_ref` and `source_version_ref` are body-free refs,not source body.
- Worker constructs `ArtifactInboundEventCallContext` only through Step 7 operation context factory;worker does not save receipt directly.

### 10.2 Inbound payload DTOs

```rust
/// Work context changed payload。
pub struct WorkArtifactContextChangedPayload {
    /// Work context ref。
    pub work_context_ref: ArtifactWorkContextRef,
}

/// Process context changed payload。
pub struct ProcessArtifactContextChangedPayload {
    /// Process context ref。
    pub process_context_ref: ArtifactProcessContextRef,
}

/// Governance context changed payload。
pub struct GovernanceArtifactContextChangedPayload {
    /// Governance context ref。
    pub governance_context_ref: ArtifactGovernanceContextRef,
}

/// Method artifact definition changed payload。
pub struct MethodArtifactDefinitionChangedPayload {
    /// Artifact definition ref。
    pub definition_ref: ArtifactDefinitionRef,
}

/// Runtime artifact signal recorded payload。
pub struct RuntimeArtifactSignalRecordedPayload {
    /// Automation source ref。
    pub automation_source_ref: AutomationSourceRef,
    /// Optional derived truth anchor hint。
    pub derived_truth_anchor_ref: Option<ArtifactTruthAnchorRef>,
}

/// External content source changed payload。
pub struct ExternalContentSourceChangedPayload {
    /// Artifact content source ref。
    pub source_ref: ArtifactContentSourceRef,
}
```

| Consumer | Envelope specialization | Service input | Accepted write target |
|---|---|---|---|
| `ConsumeWorkArtifactContextChanged` | `ArtifactInboundEventEnvelope<WorkArtifactContextChangedPayload>` | `ConsumeWorkArtifactContextChangedInput` | work context ref / resolution state / stale marker |
| `ConsumeProcessArtifactContextChanged` | `ArtifactInboundEventEnvelope<ProcessArtifactContextChangedPayload>` | `ConsumeProcessArtifactContextChangedInput` | process context ref / resolution state / stale marker |
| `ConsumeGovernanceArtifactContextChanged` | `ArtifactInboundEventEnvelope<GovernanceArtifactContextChangedPayload>` | `ConsumeGovernanceArtifactContextChangedInput` | governance context ref / resolution state / stale marker |
| `ConsumeMethodArtifactDefinitionChanged` | `ArtifactInboundEventEnvelope<MethodArtifactDefinitionChangedPayload>` | `ConsumeMethodArtifactDefinitionChangedInput` | definition ref / resolution state / fact-intake stale marker |
| `ConsumeRuntimeArtifactSignalRecorded` | `ArtifactInboundEventEnvelope<RuntimeArtifactSignalRecordedPayload>` | `ConsumeRuntimeArtifactSignalRecordedInput` | automation source ref / pending automation marker |
| `ConsumeExternalContentSourceChanged` | `ArtifactInboundEventEnvelope<ExternalContentSourceChangedPayload>` | `ConsumeExternalContentSourceChangedInput` | content source ref / resolution state / intake stale marker |

### 10.3 Inbound payload to service input closure

| Payload | Field source map | Forbidden fallback |
|---|---|---|
| `WorkArtifactContextChangedPayload` | `context` from envelope;`work_context_ref` copied from payload | 不解析 work body |
| `ProcessArtifactContextChangedPayload` | `context` from envelope;`process_context_ref` copied from payload | 不解析 process execution body |
| `GovernanceArtifactContextChangedPayload` | `context` from envelope;`governance_context_ref` copied from payload | 不解析 decision / policy body |
| `MethodArtifactDefinitionChangedPayload` | `context` from envelope;`definition_ref` copied from payload | 不保存 method definition body |
| `RuntimeArtifactSignalRecordedPayload` | `context` from envelope;source and optional anchor copied | 不保存 runtime log / capability output body |
| `ExternalContentSourceChangedPayload` | `context` from envelope;`source_ref` copied from payload | 不保存 external content body |

### 10.4 Inbound receipt disposition

| Disposition | Meaning | Stored receipt required | Mutation allowed |
|---|---|---|---|
| `Accepted` | Payload accepted and local reference / stale marker updated | yes | yes,within consumer boundary |
| `Duplicate` | Same dedup key and same digest already processed | yes,replay prior receipt | no rerun |
| `Delayed` | Required upstream ref not yet resolvable | yes | optional pending marker only |
| `Rejected` | Payload is valid schema but violates policy / selector | yes | no truth mutation |
| `UnsupportedSchema` | Schema version unsupported | yes | no parse, no marker |
| `Quarantined` | Dedup conflict or unsafe payload relation | yes | no truth mutation |

### 10.5 Inbound event stop-review

| 检查项 | 结论 |
|---|---|
| 6 个 consumer 是否都有 envelope + payload | 是 |
| payload 是否 body-free | 是,只含 typed ref、source version 和 optional anchor |
| receipt / duplicate replay 是否闭口 | 是,`ArtifactInboundEventReceipt` 对齐 Step 7 stored receipt envelope |
| unsupported schema 是否闭口 | 是,不解析 payload、不写 marker |
| worker 是否可直连 repository | 否,只能调用 `ArtifactIntakeReviewService` |
| Step 9 承接 | Step 9 必须逐 consumer 写 accepted / duplicate / delayed / rejected / unsupported 分支 |

---

## 11. Outbound Event protocol

Outbound Event 只能从 accepted Artifact truth change、trace / handoff record、derived view state 变化或 relay maintenance state 构造。发布失败不得回滚 truth。Publisher 必须读取 Step 7 `ArtifactRelayPayloadSnapshot`,不得按 current truth 重新构造 payload。

### 11.1 Outbound event envelope and topic-neutral key

```rust
/// Topic-neutral routing key。
pub struct ArtifactOutboundTopicKey(pub String);

/// Outbound event envelope。
pub struct ArtifactOutboundEventEnvelope<T> {
    /// Outbound event kind。
    pub event_kind: ArtifactOutboundEventKind,
    /// Public event name。
    pub event_name: ArtifactOutboundEventName,
    /// Event schema version。
    pub schema_version: ArtifactEventSchemaVersion,
    /// Relay item ref。
    pub relay_item_ref: ArtifactRelayItemRef,
    /// Payload snapshot ref。
    pub payload_snapshot_ref: ArtifactRelayPayloadSnapshotRef,
    /// Subject truth anchor when applicable。
    pub subject_ref: Option<ArtifactTruthAnchorRef>,
    /// Accepted truth cursor。
    pub source_cursor: ArtifactTruthCursor,
    /// Core trace id。
    pub core_trace_id: TraceId,
    /// Topic-neutral routing key。
    pub topic_key: ArtifactOutboundTopicKey,
    /// Event-specific payload。
    pub payload: T,
}

/// Outbound payload build input。
pub struct ArtifactOutboundPayloadBuildInput<T> {
    /// Payload snapshot ref generated for this event。
    pub payload_snapshot_ref: ArtifactRelayPayloadSnapshotRef,
    /// Relay item ref generated for this event。
    pub relay_item_ref: ArtifactRelayItemRef,
    /// Event envelope to serialize。
    pub envelope: ArtifactOutboundEventEnvelope<T>,
}

/// Outbound payload snapshot build error。
pub enum ArtifactOutboundPayloadBuildError {
    /// Envelope event kind and payload type do not match。
    EventKindMismatch,
    /// Serialized envelope would include forbidden body。
    BodyForbidden,
    /// Serialization failed before snapshot persistence。
    SerializationFailed,
}
```

Envelope source rules:

- `event_kind` comes from Step 7 `ArtifactCommittedChange` variant mapping.
- `source_cursor` comes from accepted transaction cursor,not page cursor,repository version,timestamp or trace id.
- `topic_key` is topic-neutral and configuration-free;actual transport topic is Step 14 / config binding.
- `payload` must be body-free and must match §11.3 payload schema for the `event_kind`.

### 11.2 Outbound payload DTOs

```rust
/// Artifact fact changed payload。
pub struct ArtifactFactChangedPayload {
    pub artifact_fact_ref: ArtifactFactRef,
    pub content_context_ref: ArtifactContentFactContextRef,
    pub change_kind: ArtifactFactChangeKind,
}

/// Artifact version changed payload。
pub struct ArtifactVersionChangedPayload {
    pub artifact_version_ref: ArtifactVersionRef,
    pub artifact_fact_ref: ArtifactFactRef,
    pub version_state: ArtifactVersionState,
}

/// Artifact lineage changed payload。
pub struct ArtifactLineageChangedPayload {
    pub artifact_lineage_link_ref: ArtifactLineageLinkRef,
    pub source_version_ref: ArtifactVersionRef,
    pub target_version_ref: ArtifactVersionRef,
    pub relation_kind: ArtifactLineageRelationKind,
}

/// Artifact baseline changed payload。
pub struct ArtifactBaselineChangedPayload {
    pub artifact_baseline_ref: ArtifactBaselineRef,
    pub baseline_scope_ref: ArtifactBaselineScopeRef,
    pub baseline_state: ArtifactBaselineState,
}

/// Artifact review changed payload。
pub struct ArtifactReviewChangedPayload {
    pub review_anchor_ref: ArtifactReviewAnchorRef,
    pub responsibility_assignment_ref: Option<ArtifactResponsibilityAssignmentRef>,
    pub review_state: ArtifactReviewState,
}

/// Consumable Artifact reference changed payload。
pub struct ConsumableArtifactReferenceChangedPayload {
    pub consumable_ref: ConsumableArtifactReferenceRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub reference_state: ConsumableArtifactReferenceState,
}

/// Artifact trace available payload。
pub struct ArtifactTraceAvailablePayload {
    pub trace_record_ref: ArtifactTraceRecordRef,
    pub truth_anchor_ref: ArtifactTruthAnchorRef,
    pub handoff_record_ref: Option<ArtifactHandoffRecordRef>,
    pub trace_state: ArtifactTraceState,
}

/// Artifact derived view state changed payload。
pub struct ArtifactDerivedViewStateChangedPayload {
    pub derived_view_state_ref: ArtifactDerivedViewStateRef,
    pub derived_view_kind: ArtifactDerivedViewKind,
    pub freshness_state: ArtifactDerivedFreshnessState,
}
```

### 11.3 Committed change to payload map

| `ArtifactCommittedChange` variant | Event kind | Payload DTO | Subject |
|---|---|---|---|
| `Fact` | `ArtifactFactChanged` | `ArtifactFactChangedPayload` | `ArtifactTruthAnchorRef::Fact(artifact_fact_ref)` |
| `Version` | `ArtifactVersionChanged` | `ArtifactVersionChangedPayload` | `ArtifactTruthAnchorRef::Version(artifact_version_ref)` |
| `Lineage` | `ArtifactLineageChanged` | `ArtifactLineageChangedPayload` | `ArtifactTruthAnchorRef::Lineage(artifact_lineage_link_ref)` |
| `Baseline` | `ArtifactBaselineChanged` | `ArtifactBaselineChangedPayload` | `ArtifactTruthAnchorRef::Baseline(artifact_baseline_ref)` |
| `Review` | `ArtifactReviewChanged` | `ArtifactReviewChangedPayload` | none unless Step 9 loads review truth anchor |
| `Consumable` | `ConsumableArtifactReferenceChanged` | `ConsumableArtifactReferenceChangedPayload` | `truth_anchor_ref` from committed change |
| `Traceability` | `ArtifactTraceAvailable` | `ArtifactTraceAvailablePayload` | `truth_anchor_ref` from committed change |
| `DerivedViewState` | `ArtifactDerivedViewStateChanged` | `ArtifactDerivedViewStateChangedPayload` | none |

Review and derived event subject rule:

- `Review` payload does not invent a truth anchor;Step 9 may load review anchor and set `subject_ref` only if the committed change source provides it.
- `DerivedViewState` payload uses `derived_view_state_ref` as payload subject and leaves envelope `subject_ref = None`;publisher / downstream must not infer a truth anchor from view kind.

### 11.4 Stored payload snapshot builder contract

```rust
/// Outbound payload snapshot builder。
pub trait ArtifactOutboundPayloadSnapshotBuilder {
    /// Serialize outbound envelope and create stored relay payload snapshot。
    fn build<T>(
        &self,
        payload_snapshot_ref: ArtifactRelayPayloadSnapshotRef,
        event_kind: ArtifactOutboundEventKind,
        schema_version: ArtifactEventSchemaVersion,
        envelope: ArtifactOutboundEventEnvelope<T>,
    ) -> Result<ArtifactRelayPayloadSnapshot, ArtifactOutboundPayloadBuildError>;
}
```

| Builder output field | Source |
|---|---|
| `payload_snapshot_ref` | generated by Step 7 `IdGeneratorPort.new_artifact_relay_payload_snapshot_ref()` |
| `event_kind` | committed change variant mapping |
| `schema_version` | envelope schema version |
| `serialized_payload` | serialized `ArtifactOutboundEventEnvelope<T>` |
| `core_trace_id` | envelope `core_trace_id` |

Stored snapshot red lines:

- Builder serializes the complete envelope,not just payload body.
- Repository saves `ArtifactPendingRelayItem` + `ArtifactRelayPayloadSnapshot` in the same accepted transaction.
- Publisher receives `ArtifactPendingRelayItem` + `ArtifactRelayPayloadSnapshot` only;publisher cannot call truth repositories or projection repositories.
- Missing snapshot during publication is `mark_failed` or `mark_retryable`,not current-truth reconstruction.

### 11.5 Outbound topic-neutral map

| Event kind | Event name | Topic-neutral key | Primary consumers |
|---|---|---|---|
| `ArtifactFactChanged` | `ArtifactFactChanged` | `artifact.fact.changed` | work、process、governance、conversation、workspace |
| `ArtifactVersionChanged` | `ArtifactVersionChanged` | `artifact.version.changed` | work、process、governance、archive、sync |
| `ArtifactLineageChanged` | `ArtifactLineageChanged` | `artifact.lineage.changed` | work、process、governance、observability |
| `ArtifactBaselineChanged` | `ArtifactBaselineChanged` | `artifact.baseline.changed` | work、governance、archive、sync |
| `ArtifactReviewChanged` | `ArtifactReviewChanged` | `artifact.review.changed` | conversation、workspace、governance |
| `ConsumableArtifactReferenceChanged` | `ConsumableArtifactReferenceChanged` | `artifact.consumable.changed` | SDK、console、sync、conversation、workspace |
| `ArtifactTraceAvailable` | `ArtifactTraceAvailable` | `artifact.trace.available` | observability、archive、conversation |
| `ArtifactDerivedViewStateChanged` | `ArtifactDerivedViewStateChanged` | `artifact.derived_view_state.changed` | workspace、console、report consumers |

Topic-neutral key is not a broker topic. Config binding later maps it to concrete topic / exchange / stream. Step 8 forbids secrets, endpoints and retry policies in protocol DTOs.

### 11.6 Outbound event stop-review

| 检查项 | 结论 |
|---|---|
| 8 个 outbound event 是否都有 payload schema | 是 |
| payload 是否与 `ArtifactCommittedChange` variant 唯一映射 | 是 |
| stored payload snapshot 是否闭口 | 是,builder output 对齐 Step 7 repository |
| publisher 是否需要 current truth lookup | 否,只消费 pending item + stored snapshot |
| topic / transport 是否混入协议 | 否,只给 topic-neutral key |
| Step 9 承接 | Step 9 必须在 accepted write / job flow 内列出 committed change、snapshot build、relay append 顺序 |

---

## 12. Operations Job protocol

Operations Job 是显式后台维护入口,只允许维护 derived view、external reference state、reconciliation report、handoff material 和 stored job report。Job 不得作为业务 command,不得静默修复 Artifact truth。

### 12.1 Job shared metadata and response envelope

```rust
/// Job run id。
pub struct ArtifactJobRunId(pub String);

/// Job idempotency key。
pub struct ArtifactJobIdempotencyKey(pub String);

/// Job run disposition。
pub enum ArtifactJobRunDisposition {
    /// Fresh run completed。
    Completed,
    /// Fresh run partially completed。
    PartiallyCompleted,
    /// Fresh run failed。
    Failed,
    /// Stored report replay。
    DuplicateReplayed,
    /// Request rejected before job body。
    Rejected,
}

/// Job validation issue ref。
pub struct ArtifactJobValidationIssueRef(pub String);

/// Job validation issue ref set。
pub struct ArtifactJobValidationIssueRefSet(pub Vec<ArtifactJobValidationIssueRef>);

/// Public truth snapshot scope for job request DTOs。
pub enum ArtifactTruthSnapshotScopeDto {
    /// Baseline scope snapshot。
    Baseline(ArtifactBaselineScopeRef),
    /// Report scope snapshot。
    Report(ArtifactReportScopeRef),
    /// Reconciliation scope snapshot。
    Reconciliation(ArtifactReconciliationScopeRef),
    /// Consumer scope snapshot。
    Consumer(ArtifactConsumerScopeRef),
}

/// Public reference refresh scope for job request DTOs。
pub enum ArtifactReferenceRefreshScopeDto {
    /// Explicit external refs in request order after dedup。
    ExplicitExternalRefs(Vec<ExternalSourceRef>),
    /// All tracked refs by reference kind。
    ByReferenceKind(ArtifactExternalReferenceKind),
    /// Only tracked unhealthy refs。
    UnhealthyOnly,
}

/// Job metadata。
pub struct ArtifactJobMetadata {
    /// Job operation name。
    pub job_name: ArtifactJobName,
    /// Job run id。
    pub run_id: ArtifactJobRunId,
    /// Job idempotency key。
    pub idempotency_key: ArtifactJobIdempotencyKey,
    /// Actor used by job runner。
    pub actor_ref: ActorRef,
    /// Core trace id。
    pub core_trace_id: TraceId,
}

/// Job request envelope。
pub struct ArtifactJobRequest<T> {
    /// Job metadata。
    pub metadata: ArtifactJobMetadata,
    /// Job-specific input。
    pub body: T,
}

/// Job public report。
pub struct ArtifactJobReport {
    /// Stored result ref。
    pub result_ref: ArtifactProtocolResultRef,
    /// Job outcome copied from application result and mapped to public label。
    pub outcome: ArtifactJobProtocolOutcome,
    /// Changed view refs。
    pub changed_view_refs: Vec<OpaqueRef>,
    /// Changed state refs。
    pub changed_state_refs: Vec<OpaqueRef>,
    /// Handoff record refs。
    pub handoff_record_refs: Vec<ArtifactHandoffRecordRef>,
    /// Failed refs。
    pub failed_refs: Vec<OpaqueRef>,
}

/// Job response envelope。
pub struct ArtifactJobProtocolResponse {
    /// Job operation name。
    pub job_name: ArtifactJobName,
    /// Job run id。
    pub run_id: ArtifactJobRunId,
    /// Run disposition。
    pub disposition: ArtifactJobRunDisposition,
    /// Stored job report for fresh run or duplicate replay。
    pub report: Option<ArtifactJobReport>,
    /// Redacted validation issue refs。
    pub validation_issue_refs: ArtifactJobValidationIssueRefSet,
}
```

Job metadata rules:

- `ArtifactJobMetadata` maps to Step 7 `ArtifactJobCallContext` through `ArtifactOperationContextFactory`.
- `actor_ref` must be system / operator actor supplied by job runner metadata;job body cannot override actor authority.
- `idempotency_key` is required for all public jobs;duplicate replay uses stored job report.
- `ArtifactJobReport` fields must copy Step 7 `ArtifactMaintenanceJobResult`,map application-local `ArtifactJobOutcome` to `ArtifactJobProtocolOutcome`,and not aggregate by reading repository after return.
- `ArtifactTruthSnapshotScopeDto` maps 1:1 to Step 7 application-local `ArtifactTruthSnapshotScope`;entry layer must not let adapter infer scope from strings.
- `ArtifactReferenceRefreshScopeDto` maps 1:1 to Step 7 application-local `ArtifactReferenceRefreshScope`;unsupported branch is rejected before service call.
- `ArtifactPageRequest` maps to Step 7 application-local `ArtifactRepositoryPage`;public cursor and repository cursor are not the same type.

### 12.2 Job input DTO schema

```rust
/// Rebuild Artifact derived views job input。
pub struct RebuildArtifactDerivedViewsJobInput {
    /// Derived view kinds to rebuild。
    pub derived_view_kinds: Vec<ArtifactDerivedViewKind>,
    /// Truth snapshot scope。
    pub snapshot_scope: ArtifactTruthSnapshotScopeDto,
    /// Repository page request。
    pub page: ArtifactPageRequest,
}

/// Refresh external reference states job input。
pub struct RefreshExternalReferenceStatesJobInput {
    /// Refresh scope。
    pub refresh_scope: ArtifactReferenceRefreshScopeDto,
    /// Repository page request。
    pub page: ArtifactPageRequest,
}

/// Run Artifact reconciliation job input。
pub struct RunArtifactReconciliationJobInput {
    /// Reconciliation scope。
    pub reconciliation_scope_ref: ArtifactReconciliationScopeRef,
    /// Truth snapshot scope。
    pub snapshot_scope: ArtifactTruthSnapshotScopeDto,
    /// Repository page request。
    pub page: ArtifactPageRequest,
}

/// Prepare Artifact archive handoff job input。
pub struct PrepareArtifactArchiveHandoffJobInput {
    /// Handoff target。
    pub target_ref: AdjacentConsumerRef,
    /// Truth snapshot scope。
    pub snapshot_scope: ArtifactTruthSnapshotScopeDto,
    /// Repository page request。
    pub page: ArtifactPageRequest,
}

/// Prepare Artifact observability handoff job input。
pub struct PrepareArtifactObservabilityHandoffJobInput {
    /// Handoff target。
    pub target_ref: AdjacentConsumerRef,
    /// Truth anchors to include。
    pub truth_anchor_refs: Vec<ArtifactTruthAnchorRef>,
    /// Repository page request。
    pub page: ArtifactPageRequest,
}

/// Prepare Artifact sync handoff job input。
pub struct PrepareArtifactSyncHandoffJobInput {
    /// Handoff target。
    pub target_ref: AdjacentConsumerRef,
    /// Consumer scope。
    pub consumer_scope_ref: ArtifactConsumerScopeRef,
    /// Repository page request。
    pub page: ArtifactPageRequest,
}
```

| Job | Request envelope | Application target | Report refs/counters |
|---|---|---|---|
| `RebuildArtifactDerivedViews` | `ArtifactJobRequest<RebuildArtifactDerivedViewsJobInput>` | `ArtifactDerivedMaintenanceService.rebuild_artifact_derived_views` | changed view/state refs, failed refs |
| `RefreshExternalReferenceStates` | `ArtifactJobRequest<RefreshExternalReferenceStatesJobInput>` | `ArtifactDerivedMaintenanceService.refresh_external_reference_states` | changed state refs, refresh / failed refs |
| `RunArtifactReconciliation` | `ArtifactJobRequest<RunArtifactReconciliationJobInput>` | `ArtifactDerivedMaintenanceService.run_artifact_reconciliation` | report refs, changed state refs, failed refs |
| `PrepareArtifactArchiveHandoff` | `ArtifactJobRequest<PrepareArtifactArchiveHandoffJobInput>` | `ArtifactDerivedMaintenanceService.prepare_artifact_archive_handoff` | handoff record refs, failed refs |
| `PrepareArtifactObservabilityHandoff` | `ArtifactJobRequest<PrepareArtifactObservabilityHandoffJobInput>` | `ArtifactDerivedMaintenanceService.prepare_artifact_observability_handoff` | handoff record refs, trace refs via report |
| `PrepareArtifactSyncHandoff` | `ArtifactJobRequest<PrepareArtifactSyncHandoffJobInput>` | `ArtifactDerivedMaintenanceService.prepare_artifact_sync_handoff` | handoff record refs, changed read surface refs |

### 12.3 Job input validation and duplicate replay

| Job input | Required fields | Rejected when | Duplicate behavior |
|---|---|---|---|
| `RebuildArtifactDerivedViewsJobInput` | `derived_view_kinds`, `snapshot_scope`, `page` | view kind set empty unless Step 9 explicitly allows all;page invalid | stored report replay |
| `RefreshExternalReferenceStatesJobInput` | `refresh_scope`, `page` | unsupported scope branch or invalid page | stored report replay |
| `RunArtifactReconciliationJobInput` | `reconciliation_scope_ref`, `snapshot_scope`, `page` | scope / snapshot mismatch or invalid page | stored report replay |
| `PrepareArtifactArchiveHandoffJobInput` | `target_ref`, `snapshot_scope`, `page` | target disabled, invalid scope, invalid page | stored report replay |
| `PrepareArtifactObservabilityHandoffJobInput` | `target_ref`, `truth_anchor_refs`, `page` | target disabled, anchor list empty, invalid page | stored report replay |
| `PrepareArtifactSyncHandoffJobInput` | `target_ref`, `consumer_scope_ref`, `page` | target disabled, invalid consumer scope, invalid page | stored report replay |

Duplicate replay rule:

1. First run reserves idempotency, runs job body, saves `StoredArtifactOperationResult::JobReport`, completes idempotency, returns fresh report.
2. Duplicate same digest loads `StoredArtifactResultRepository.get_job_report(...)` and returns `ArtifactJobRunDisposition::DuplicateReplayed`.
3. Duplicate missing stored report is design/consistency defect and maps to Step 12 recovery;job runner must not rerun body to repair missing report.
4. Duplicate digest conflict returns `Rejected` with validation issues;job body does not run.

### 12.4 Worker-only relay publication protocol

`ArtifactRelayPublicationService` is internal worker facade,not one of the six public operations jobs. It still needs a protocol-level runner input/output so worker implementation does not directly access repository or publisher.

```rust
/// Publish pending artifact relays worker input。
pub struct PublishPendingArtifactRelaysWorkerInput {
    /// Page request used by application facade。
    pub page: ArtifactPageRequest,
}

/// Publish pending artifact relays worker response。
pub struct PublishPendingArtifactRelaysWorkerResponse {
    /// Scanned relay refs。
    pub scanned_relay_refs: Vec<ArtifactRelayItemRef>,
    /// Published relay refs。
    pub published_relay_refs: Vec<ArtifactRelayItemRef>,
    /// Retryable relay refs。
    pub retryable_relay_refs: Vec<ArtifactRelayItemRef>,
    /// Failed relay refs。
    pub failed_relay_refs: Vec<ArtifactRelayItemRef>,
}
```

| Worker entry | Application facade | Duplicate behavior | Forbidden |
|---|---|---|---|
| `PublishPendingArtifactRelays` | `ArtifactRelayPublicationService.publish_pending_artifact_relays` | no stored job replay;relay item expected version controls idempotence | direct repository scan, direct publisher call, current truth payload rebuild |

### 12.5 Operations job stop-review

| 检查项 | 结论 |
|---|---|
| 6 个 public job 是否都有 input DTO | 是 |
| job metadata / idempotency 是否闭口 | 是,`ArtifactJobMetadata` 对齐 Step 7 job context |
| job report duplicate replay 是否闭口 | 是,stored job report 对称 save/get |
| job 是否可能修复 truth | 否,只维护 derived / reference / reconciliation / handoff |
| relay publication loop 是否越权 | 否,只通过 internal facade |
| Step 9 承接 | Step 9 必须逐 job 写 scope expansion、partial failure、report save 和 duplicate replay |

---

## 13. Cross-protocol closure audit

### 13.1 Newly defined public secondary types

| Type | Protocol family | Owner module | Closure source |
|---|---|---|---|
| `ArtifactCommandName` | shared API | `contracts` | Step 8 §7.1 |
| `ArtifactQueryName` | shared API | `contracts` | Step 8 §7.1 |
| `ArtifactInboundConsumerName` | inbound event | `contracts` | Step 8 §7.1 |
| `ArtifactOutboundEventName` | outbound event | `contracts` | Step 8 §7.1 |
| `ArtifactJobName` | jobs | `contracts` | Step 8 §7.1 |
| `ArtifactProtocolSurfaceRef` | shared API/result | `contracts` | Step 8 §7.1 |
| `ArtifactProtocolResultRef` | shared API/result | `contracts` | Step 8 §7.1 |
| `ArtifactProtocolOperationName` | shared API/result | `contracts` | Step 8 §7.1 |
| `ArtifactProtocolValidationIssueRef` / Set | protocol rejection | `contracts` | Step 8 §7.1 / §7.5 |
| `ArtifactQuerySurface` / marker enums | query response | `contracts` | Step 8 §7.4 |
| `ArtifactPageSurface` | query page response | `contracts` | Step 8 §7.4 |
| `ArtifactPageCursor` / `ArtifactPageRequest` | query/job request | `contracts` | Step 8 §7.4 |
| `ArtifactInboundReceiptDisposition` | inbound event result | `contracts` | Step 8 §7.4 |
| `ArtifactJobProtocolOutcome` | jobs | `contracts` | Step 8 §7.4 |
| `ArtifactCommandEffectSummary` | command result | `contracts` | Step 8 §8.1 |
| command request DTOs | command request | `contracts` | Step 8 §8.2~§8.4 |
| command result DTOs | command response | `contracts` | Step 8 §8.1 |
| query wrapper view DTOs | query response | `contracts` | Step 8 §9.1 |
| query request DTOs | query request | `contracts` | Step 8 §9.2~§9.4 |
| `ArtifactInboundEventEnvelope<T>` | inbound event | `contracts` | Step 8 §10.1 |
| `ArtifactInboundEventReceipt` | inbound event result | `contracts` | Step 8 §10.1 |
| 6 inbound payload DTOs | inbound event | `contracts` | Step 8 §10.2 |
| `ArtifactOutboundTopicKey` | outbound event | `contracts` | Step 8 §11.1 |
| `ArtifactOutboundEventEnvelope<T>` | outbound event | `contracts` | Step 8 §11.1 |
| `ArtifactOutboundPayloadBuildError` | outbound event | `contracts` | Step 8 §11.1 |
| 8 outbound payload DTOs | outbound event | `contracts` | Step 8 §11.2 |
| `ArtifactJobMetadata` | jobs | `contracts` | Step 8 §12.1 |
| `ArtifactJobRequest<T>` / `ArtifactJobProtocolResponse` | jobs | `contracts` | Step 8 §12.1 |
| `ArtifactTruthSnapshotScopeDto` / `ArtifactReferenceRefreshScopeDto` | jobs | `contracts` | Step 8 §12.1 |
| 6 job input DTOs | jobs | `contracts` | Step 8 §12.2 |
| relay worker input / response | worker internal protocol | `worker` + `application` facade | Step 8 §12.4 |

### 13.2 DTO to object / port / flow closure audit

| Protocol family | Step 6 object closure | Step 7 port closure | Step 9 flow required |
|---|---|---|---|
| Command | all request/result DTOs map to truth/support objects, reason carriers and record refs | truth / intake / review / consumption services, stored result, relay repository | 16 command flows with transaction, domain guard, history, relay snapshot and stored result order |
| Query | request/view DTOs map to truth, projection, trace, report and reference read models | read service, truth/projection/trace/report/reference repositories | 13 query flows with visibility, freshness, degraded, selector rejection and page behavior |
| Inbound Event | payloads map to context refs, definition refs, source refs and reference state helper objects | intake/review service, stored receipt, reference/stale marker repositories | 6 consumer flows with dedup, unsupported, delayed, rejected and accepted behavior |
| Outbound Event | payloads map to `ArtifactCommittedChange`, trace/handoff, derived state | relay repository stores pending item + payload snapshot,publisher consumes stored snapshot | outbox append/publish flows with stored snapshot and expected-version marker |
| Operations Job | job input/report DTOs map to job report assembly, derived state, reference refresh, handoff material | derived maintenance service, handoff repository, stored job result | 6 job flows with duplicate replay, scope expansion, partial failure and report save |
| Relay publication | worker input/response maps to internal facade result | relay repository + publisher hidden behind `ArtifactRelayPublicationService` | publication flow with pending scan, payload lookup, publish outcome and marker update |

### 13.3 Public body boundary audit

| External family | Allowed in Step 8 DTOs | Forbidden |
|---|---|---|
| work | `ArtifactWorkContextRef`, `ExternalSourceVersionRef`, source event id | work item body, project body, iteration body |
| process | `ArtifactProcessContextRef`, source version refs | process execution / activity body |
| governance | `ArtifactGovernanceContextRef`, review / basis refs | governance decision body, policy text, control body |
| method library | `ArtifactDefinitionRef`, `ArtifactDefinitionKind`, safe refs | method definition body, standard body, raw classification text |
| runtime / capability | `AutomationSourceRef`, `ArtifactTruthAnchorRef` hint | runtime log, capability output body, diagnostic body |
| external content | `ArtifactContentSourceRef`, `ExternalSourceRef`, `LocalMirrorSnapshotRef` | external content body, provider raw payload |
| archive / observability / sync | `ArtifactHandoffRecordRef`, `ArtifactTraceRecordRef`, `AdjacentConsumerRef` | archive package body, secret endpoint, log body, sync payload body |

### 13.4 Step 8 completion checklist

| Checklist | Status |
|---|---|
| 16 Command request/result schemas are defined | [x] |
| 13 Query request/response schemas are defined | [x] |
| 6 Inbound Event envelope/payload/receipt schemas are defined | [x] |
| 8 Outbound Event envelope/payload/topic-neutral/snapshot schemas are defined | [x] |
| 6 Operations Job metadata/input/response/report replay schemas are defined | [x] |
| Public DTO secondary types have schema and ownership | [x] |
| Query view/page/visibility/freshness/degraded response surfaces are field-level | [x] |
| Inbound unsupported/duplicate/delayed/rejected/quarantined dispositions are explicit | [x] |
| Outbound stored payload snapshot prevents publisher current-truth lookup | [x] |
| Job duplicate replay uses stored job report,not rerun | [x] |
| Relay publication worker facade prevents worker direct repository / publisher access | [x] |

### 13.5 Remaining work for later Steps

| Item | Deferred to | Reason |
|---|---|---|
| Function-level command/query/event/job flow | Step 9 | Step 8 only fixes protocol schema and source maps |
| State transition matrix | Step 10 | Step 8 references existing state enums but does not define allowed transitions |
| Persistence table / optimistic version / transaction ordering | Step 11 | Step 8 references repository surfaces but not storage layout |
| Error code mapping and recovery behavior | Step 12 | Step 8 defines protocol rejection/receipt/report surfaces only |
| Idempotency digest algorithm and duplicate conflict matrix | Step 13 | Step 8 fixes fields and replay surface only |
| Config topic / endpoint binding | Step 14 | Step 8 only defines topic-neutral key |
| Observability metric / log details | Step 15 | Step 8 only defines business audit and protocol surface |

---

## 14. 回填草稿

正式 `03-详细设计.md` Step 19 装配时:

- §7.1 摘录本文件 §6 协议总表。
- §7.2 摘录本文件 §7 shared protocol helper。
- §7.3 摘录本文件 §8 Command API protocol。
- §7.4 摘录本文件 §9 Query API protocol。
- §7.5 摘录本文件 §10 Inbound Event Consumer protocol。
- §7.6 摘录本文件 §11 Outbound Event protocol。
- §7.7 摘录本文件 §12 Operations Job protocol。
- §7.8 摘录本文件 §13 cross-protocol closure audit。

正式正文只写收口契约;本文件的问题回答、stop-review 和 deferred 表保留在 calibration 中间产物。

---

## 15. 进入下一步条件

- Command / Query / Inbound Event / Outbound Event / Job 五类协议均已有字段级 schema。
- 每个 public request DTO 都能映射到 Step 7 service input 或 internal facade input。
- 每个 public response / receipt / report 都能复制 Step 7 result carrier 或 Step 6 view/report object。
- Query visibility / freshness / degraded surface 不再是普通 error 或隐式修复。
- Inbound consumer duplicate / unsupported / delayed / rejected / quarantined / accepted receipt 口径闭合。
- Outbound payload snapshot 闭合,发布路径不需要 current truth lookup。
- Job duplicate report replay 闭合,不需要重跑 job。
- 当前无阻塞 Step 9 的协议输入缺口。
