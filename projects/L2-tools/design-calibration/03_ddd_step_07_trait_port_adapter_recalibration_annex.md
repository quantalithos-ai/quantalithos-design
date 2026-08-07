# L2-tools 03 详细设计 Step 7 R-7 接缝再校准附录

> 创建日期: 2026-08-05
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 对标: `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`

## 0. 本批次门禁与输入

| 项目 | 结论 |
|---|---|
| 前序输入 | R-5 module cards、R-6 object/carrier closure、现有 Step 7 六份模块附录、Step 8/9 现有协议/flow。 |
| 本批目标 | 将每个 application-owned trait、Store、external Port、entry facade 和 recovery helper 绑定到唯一 caller、implementer、request/result/error、UoW/version/page 语义。 |
| 写入范围 | 只写本附录和受影响的 calibration 台账；不写正式 `03-详细设计.md`，不实现代码。 |
| 固定规模 | 7 named external Ports；6 truth/attempt Store groups + `ProjectionStore`；`IdempotencyStore` 作为 technical Store。 |
| 允许的未知 | `L2T-UP-001~009` 的 owner/schema/mapping/route/client/readiness 继续保持 `blocked` / `unavailable`。 |
| 禁止新增 | 不新增业务 identity、状态主语、Store group、external lifecycle、transport、route、broker receipt 或 SDK client。 |

### 0.1 SOP 问题回答

1. **哪些模块定义 / 实现 / 调用接缝？** `application` 定义所有 repository、UoW、technical、external 和 inbound use-case trait；`infra` 实现；`api`、`worker`、`jobs` 只调用 application facade；`contracts` / `domain` 不做 I/O。
2. **每个方法的版本和事务从哪里来？** 版本只来自同一 Store 的 `Loaded<T>::expected_version`；写入携带同一 `&dyn ToolsUnitOfWork`；append-only 方法不接收 expected version，但必须返回 `AppendResult`。
3. **分页如何闭合？** 每个 list/search 接收 typed scope + `RepositoryPageRequest`，返回 `RepositoryPage<T>` 或显式 `ProjectionPageRead<T>`；cursor 绑定 filter digest / watermark，不能由 service 拼接。
4. **外部 Port 如何表达开放合同？** 语义阻断用 `PortResolution::Blocked`，调用/适配器故障用 `PortCallError`；生产 blocked adapter 实现完整 trait，fake 只验证本地分支。
5. **恢复由谁拥有？** application service 负责同 authority 的 commit resolution、claim continuation 和 local attempt fencing；adapter 不重试、不提交、不推断外部状态；entry 不恢复 truth。

### 0.2 现有材料诊断与取舍

| 诊断 | 处理 |
|---|---|
| 现有 Step 7 trait 签名大体完整，但 caller / implementer / phase 回指分散 | 本附录建立唯一 seam ledger；既有 trait 仍是签名 authority，本附录只补调用时序和映射。 |
| `ConsumerAppendOperation` 的 variant 到 Store method 只在 Step 9 表中出现 | 在 §5.2 固定 1:1 映射、返回 ref 和冲突处理，并回指 Store 签名。 |
| continuation 的 `Prepared` marker、attempt version token 和 phase-2 replay 没有单一方法级说明 | 在 §5.3 固定 exact helper / Store call sequence；不增加第二个 attempt Store。 |
| `SafeMaterialContinuationInput`、`LocalResultRef`、`CommandUseCaseResult` 在多个文件重复出现 | R-6 annex 为 canonical authority；受影响文件改为引用，重复代码标为 superseded。 |
| Step 6 uses `HubSnapshotRef`, while an older Step 7 store draft used `HubControlledSnapshotRef` | `HubSnapshotRef` is the only current Rust-facing reference. The longer name is a superseded historical alias and is forbidden in Step 7+, Step 8/9 recalibration and formal assembly. |
| `03_ddd_calibration_flow.md` 末尾仍写 R-5 next action | 本批次结束时修正为 R-7，防止恢复点倒退。 |

## 1. 唯一方法级约定

### 1.1 方法命名和返回面的规则

| 规则 | 固定口径 |
|---|---|
| Async object-safe surface | 所有 I/O trait 方法使用既有 `PortFuture<'a, T>`、`Send + Sync`；不选择 executor 或 macro。 |
| Read | `get_*` / `find_*` 不接 UoW、不启动隐藏事务、不调用 external Port；versioned subject 返回 `Option<Loaded<T>>`。 |
| List | typed scope + `RepositoryPageRequest` 是完整输入；返回页内 `source_watermark`；空页与 unavailable/rebuilding 不混淆。 |
| Mutable save | `save_*(value, expected_version, uow)` 的 token 必须来自紧邻的 `Loaded<T>`；stale token -> `RepositoryError::VersionConflict`，零写入。 |
| Create | `create_*(value, uow)` 返回 `Loaded<T>`；返回 token 只在同一 UoW commit 确认后可用于 replay。 |
| Append | `append_*/insert_*` 返回 `AppendResult<Ref>`；`ExistingEqual` 必须先 canonical-equality 校验，`Conflict` 不覆盖。 |
| Projection | `ProjectionWriteResult` 只比较 source watermark / projection version；不得修改 T1/T2 truth。 |
| External call | Port 调用不携带 UoW；一次逻辑调用；side-effect ambiguity 必须返回 `SideEffectOutcomeUnknown` 或等价 typed uncertainty。 |
| Entry | API/worker/jobs 只构造 protocol input、调用 facade、映射结果；不直接访问 Store/Port/UoW/domain。 |

### 1.2 统一错误与恢复归属

| 错误 / resolution | 产生方 | application 行为 | 禁止行为 | fake 要求 |
|---|---|---|---|---|
| `RepositoryError::Unavailable` | Store adapter | 已有 claim 且无 side effect 时按 flow abort；否则保留 incomplete/gap | 读 current truth 猜 replay | 可注入同一错误，不转成功 |
| `RepositoryError::VersionConflict` | versioned Store save | 返回 conflict / integrity；重新读取只能由明确 flow 允许 | last-write-wins、重放旧 value | 与 durable 同样零写入 |
| `RepositoryError::CommitOutcomeUnknown` / `UnitOfWorkError::CommitOutcomeUnknown` | UoW manager | 调 `resolve_commit(transaction_ref)`；Unknown -> manual/incomplete | 盲目重试写入或 Port | 可确定性模拟 committed/rolled-back/unknown |
| `PortResolution::Blocked` | blocked adapter / open upstream | 生成 typed assessment/gap/blocked attempt；保留 local subject | 假造 Available、fallback host/client | 同一 blocker id / branch |
| `PortResolution::Unavailable` | external adapter | fail closed；只在 flow 允许时保存 safe gap | cached allow / inferred readiness | 同一 unavailable summary |
| `PortCallError::SideEffectOutcomeUnknown` | side-effect adapter | 保存 uncertainty attempt，claim 不完成，进入 manual owner | 自动第二次 Port call、伪造 no-execution | 可注入并断言 exactly-once fence |
| `PortCallError::ForbiddenBody` / `InvalidResponse` | adapter boundary | reject/quarantine，零 raw body 落库 | 把 body 转 safe summary 后继续 | 同样拒绝 body |

## 2. application foundation 逐方法 seam ledger

### 2.1 UoW / Clock / ID / visibility

| Exact method | Caller | Implementer | Input / output | UoW / version rule | Error / recovery | Test cut |
|---|---|---|---|---|---|---|
| `ToolsUnitOfWorkManager::begin() -> PortFuture<Result<Box<dyn ToolsUnitOfWork>, UnitOfWorkError>>` | 每个写 use case 的 application service | infra durable/fake UoW manager | no input；active `ToolsUnitOfWork` with `transaction_ref` + immutable `commit_candidate` | 必须在第一个 local write 前调用；同一 atomic family 只用一个 UoW | begin failure 不创建 claim/result；fake 可返回 unavailable | begin failure；candidate uniqueness；foreign UoW |
| `ToolsUnitOfWork::transaction_ref() -> &TransactionRef` | commit resolver / safe error context | infra UoW | borrowed opaque transaction ref | 只用于同 authority `resolve_commit`；不进入 public truth | missing/foreign ref -> `UnitOfWorkError` | resolve same ref；no string parsing |
| `ToolsUnitOfWork::commit_candidate() -> &CommitCandidate` | result / idempotency staging helper | infra UoW | immutable candidate stamp | result/claim must carry this exact candidate before commit | candidate mismatch -> integrity; no response | candidate copied symmetrically |
| `ToolsUnitOfWorkManager::commit(uow) -> PortFuture<Result<CommitReceipt, UnitOfWorkError>>` | application service only | infra durable/fake | owned active UoW | only matching receipt makes staged refs visible | unknown -> `resolve_commit`; known rollback may re-enter only if flow permits | commit/rollback/unknown matrix |
| `ToolsUnitOfWorkManager::rollback(uow) -> PortFuture<Result<(), UnitOfWorkError>>` | application pre-side-effect abort | infra durable/fake | owned active UoW | no staged value/ref may leak | rollback failure remains technical failure; no fake success | staged rows invisible |
| `ToolsUnitOfWorkManager::resolve_commit(&TransactionRef) -> PortFuture<Result<CommitResolution, UnitOfWorkError>>` | recovery helper after unknown commit | same local authority | transaction ref -> `Committed(receipt)` / `RolledBack` / `Unknown` | never resolves through another backend | Unknown leaves claim incomplete/manual | all three outcomes |
| `ClockPort::now() -> Result<ApplicationTime, TechnicalPortError>` | application before domain/assessment/attempt factory | infra/fake clock | no input -> application time frame | capture once per logical flow; commit time still from receipt | clock unavailable -> no domain write unless flow has safe blocked branch | deterministic time / no adapter clock |
| `IdGeneratorPort::new_*_id() -> Result<TypedId, TechnicalPortError>` | application service before factory | infra/fake generator | exact typed ID family listed in foundation annex | domain/handler/adapter never concatenate IDs | generator failure is technical, no partial write | all generated families; collision guard |
| `ReadVisibilityResolverPort::resolve(&VisibilityResolutionInput) -> PortFuture<Result<VisibilityDecision, ApplicationError>>` | every Query service after local owner-scope read | infra/fake over formal local scope | typed subject/actor/consumer/owner scope/view class/read time | no UoW; no persistence; no external refresh | unavailable -> fail closed; no visible fallback | visible/not-found/forbidden/stale/unavailable |

### 2.2 `IdempotencyStore` exact phase use

| Exact method | Caller / phase | Implementer | Required symmetry | Error / recovery owner |
|---|---|---|---|---|
| `get(&IdempotencyScope, &IdempotencyKey) -> PortFuture<Result<Option<Loaded<IdempotencyRecord>>, RepositoryError>>` | every Command/Consumer/Job/continuation precheck | infra/fake | key scope and digest checked by `IdempotencyRecord::classify_duplicate` | read unavailable -> no claim; caller maps safe unavailable |
| `reserve(record, &dyn ToolsUnitOfWork) -> PortFuture<Result<IdempotencyReserveResult, RepositoryError>>` | phase-1 claim after precheck | infra/fake | `Reserved(Loaded<T>)` token is used for subsequent save; `Existing` is not success | existing branch rolls back phase-1 UoW; conflict classification stays application-owned |
| `save_record(record, expected_version, &dyn ToolsUnitOfWork) -> PortFuture<Result<ExpectedVersion, RepositoryError>>` | phase completion / abort | infra/fake | token comes from `Reserved` or exact reload; same UoW as stored result/receipt/report | version conflict -> incomplete/integrity; no second claim |
| `store_command_result(result, &dyn ToolsUnitOfWork) -> PortFuture<Result<StoredCommandResultRef, RepositoryError>>` | Command phase completion | infra/fake | exact `StoredCommandValue` + error snapshot + candidate stamp | result write failure rolls back command family |
| `store_consumer_receipt(receipt, &dyn ToolsUnitOfWork) -> PortFuture<Result<ConsumerReceiptRef, RepositoryError>>` | Consumer phase-2 completion | infra/fake | receipt refs/gaps attributable to source envelope | no broker ack; failure leaves claim incomplete |
| `store_job_report(report, &dyn ToolsUnitOfWork) -> PortFuture<Result<JobReportRef, RepositoryError>>` | Job phase completion | infra/fake | report cursor/watermark/output refs exact | no run/evidence assertion |
| `get_command_result(&StoredCommandResultRef) -> PortFuture<Result<Option<StoredCommandResult>, RepositoryError>>` | duplicate mapping only | infra/fake | operation/value/ref/digest symmetry | missing result with committed record -> integrity |
| `get_consumer_receipt(&ConsumerReceiptRef) -> PortFuture<Result<Option<ConsumerReceipt>, RepositoryError>>` | duplicate Consumer replay | infra/fake | exact stored receipt, no rescan | missing -> integrity, never re-run |
| `get_job_report(&JobReportRef) -> PortFuture<Result<Option<JobReport>, RepositoryError>>` | duplicate Job replay | infra/fake | exact job key/digest/watermark | missing -> integrity, never re-run |

`IdempotencyStore` does not own business state transitions. `IdempotencyRecord::claim`,
`continue_claim`, `commit_*`, `abort` are pure state guards; Store methods persist the guarded
record. `CF-10` uses the handoff prepared marker, `CF-12/OF` uses `ExternalSubmissionAttempt::Prepared`,
and `IF-03` uses its Consumer claim to fence the single derived `CF-11` re-entry.

### 2.3 Foundation stop review

| Item | Result | Evidence / correction |
|---|---|---|
| Every technical method has caller and implementer | pass | §2.1-2.2; existing foundation annex remains signature authority |
| Version source is never guessed | pass | `Loaded<T>` / `Reserved(Loaded<IdempotencyRecord>)` only |
| Commit unknown has same-authority recovery | pass | `resolve_commit(transaction_ref)` only |
| Query visibility is no-write | pass | resolver receives no UoW and cannot refresh |
| Durable/fake parity | pass | same owned types, failure classes and phase visibility |

## 3. Truth and attempt Store seam ledger

The existing Store trait fragments in
`03_ddd_step_07_module_application_stores_annex.md` remain the only signature authority. The
following rows close the method-level wiring that was previously spread across flow prose. Every
row has one application caller and one infra/fake implementer family; a method not listed here is
not available to a flow.

### 3.1 `ToolContractStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `get_contract(&ToolId) -> Result<Option<Loaded<ToolContract>>, RepositoryError>` | contract Commands; invocation/query bundle | `infra::repositories::ToolContractStoreAdapter` / fake | no UoW; returned token is only save token | unavailable propagates; missing is typed not-found | missing/current/loaded token |
| `get_contract_owner_scope(&ToolId) -> Result<Option<OwnerScopeRef>, RepositoryError>` | Query visibility and API owner-scope precheck | same adapter/fake | no UoW; scope comes from local contract row/index | absent scope -> `NotFound` or integrity per query; never infer from actor/tool string | scope absent/mismatch |
| `get_definition(&ToolId, DefinitionRevision) -> Result<Option<Loaded<FormalToolDefinition>>, RepositoryError>` | establish/evolve/adopt/invocation/query | same adapter/fake | no UoW; `Loaded.expected_version` fences `save_definition` | missing revision is explicit; serialization conflict on invalid state | candidate/current/superseded and token |
| `get_current_bundle(&ToolId) -> Result<Option<ToolContractReadBundle>, RepositoryError>` | CF-01/03/04; QF-01/02/09/11 | same adapter/fake | no UoW; one bundle watermark, both Loaded values | pointer/definition mismatch -> serialization conflict, never partial bundle | common-watermark symmetry |
| `get_definition_comparison_bundle(&ToolId, DefinitionRevision, DefinitionRevision) -> Result<Option<ToolDefinitionComparisonReadBundle>, RepositoryError>` | CF-02; QF-02/QF-09 | same adapter/fake | no UoW; base/target loaded at one watermark | absent either side -> `None`; alien impact/mismatch -> integrity | reversed pair, missing impact, stale watermark |
| `get_compatibility_impact(&CompatibilityImpactRef) -> Result<Option<ToolCompatibilityImpact>, RepositoryError>` | CF-03 and impact Query | same adapter/fake | no UoW; immutable append has no version token | missing ref is not compatible by default | exact pair/basis and missing |
| `get_evolution_fact(&EvolutionFactRef) -> Result<Option<ToolContractEvolutionFact>, RepositoryError>` | safe material/event mapper and contract Query | same adapter/fake | no UoW; immutable fact | missing source blocks material; invalid persisted fact -> serialization conflict | source ref attribution |
| `find_impact_for_pair(&ToolId, DefinitionRevision, DefinitionRevision) -> Result<Option<ToolCompatibilityImpact>, RepositoryError>` | adopt precondition | same adapter/fake | no UoW; exact pair lookup, no latest scan | multiple canonical matches -> integrity; no match -> blocked/unverifiable | pair collision / no impact |
| `list_evolution_facts(ToolEvolutionScope, RepositoryPageRequest) -> Result<RepositoryPage<ToolContractEvolutionFact>, RepositoryError>` | bounded Job and history Query | same adapter/fake | page filter digest and source watermark are adapter-validated | invalid cursor -> `CursorInvalid`; next page is explicit | stable order/cursor reuse |
| `create_contract(ToolContract, &dyn ToolsUnitOfWork) -> Result<Loaded<ToolContract>, RepositoryError>` | CF-01 | same persistence authority/fake | create token returned from same UoW; no guessed initial version | uniqueness -> `UniquenessConflict`; foreign UoW -> zero write | duplicate create/rollback |
| `save_contract(ToolContract, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<ToolContract>, RepositoryError>` | CF-03/04 lifecycle transition | same adapter/fake | token must come from `get_contract` in same flow; same UoW as fact/stale/result | stale -> version conflict, no overwrite; commit unknown belongs UoW manager | concurrent adopt/retire |
| `insert_definition(FormalToolDefinition, &dyn ToolsUnitOfWork) -> Result<AppendResult<FormalToolDefinitionRef>, RepositoryError>` | CF-01/02 candidate creation | same adapter/fake | append-only semantic key `(tool_id, revision)`; same UoW | equal requires canonical equality; differing revision content -> conflict | equal/revision conflict |
| `save_definition(FormalToolDefinition, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<FormalToolDefinition>, RepositoryError>` | CF-03 state promotion/supersede | same adapter/fake | token from `get_definition`; same UoW as contract pointer | stale or illegal state -> typed conflict; no current fallback | candidate -> current -> superseded |
| `append_compatibility_impact(ToolCompatibilityImpact, &dyn ToolsUnitOfWork) -> Result<AppendResult<CompatibilityImpactRef>, RepositoryError>` | CF-02 | same adapter/fake | semantic key includes pair and basis digest | equal replay; different basis conflict | compatible/conditional/incompatible |
| `append_evolution_fact(ToolContractEvolutionFact, &dyn ToolsUnitOfWork) -> Result<AppendResult<EvolutionFactRef>, RepositoryError>` | CF-01/03/04 | same adapter/fake | append-only; correlation/kind digest prevents duplicate fact | equal replay; different fact conflict; no event publish | fact ordering/duplicate |

**Store stop review:** `ToolContractStore` has complete current/candidate/history reads, exact
compare-token writes and bounded history pages. No method resolves Core authority or creates an
event; those remain `SharedContractAuthorityPort` and later safe-material mapping.

### 3.2 `CapabilityBindingStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `get_binding(&CapabilityBindingId) -> Result<Option<Loaded<CapabilityBinding>>, RepositoryError>` | CF-06/07; QF-03; gap resolution | `infra::repositories::CapabilityBindingStoreAdapter` / fake | no UoW; token fences `save_binding` | missing is explicit; invalid persisted relation -> serialization conflict | loaded/terminal history |
| `find_current_by_tool(&ToolId) -> Result<Option<Loaded<CapabilityBinding>>, RepositoryError>` | CF-05/06; QF-03; invocation anchor | same adapter/fake | no UoW; at most one nonterminal relation, including explicit-unbound | multiple current rows -> integrity; no name lookup | bound/unbound/multiple current |
| `get_binding_owner_scope(&CapabilityBindingId) -> Result<Option<OwnerScopeRef>, RepositoryError>` | Query visibility | same adapter/fake | no UoW; local relation scope only | absent -> anti-enumeration/not-found; never derive from Hub ref | scope mismatch |
| `get_snapshot(&HubSnapshotRef) -> Result<Option<HubControlledSnapshot>, RepositoryError>` | binding view, material source validation | same adapter/fake | no UoW; immutable source ref | missing snapshot blocks assessment/material; no Hub refresh | ref mismatch |
| `get_assessment(&BindingAssessmentRef) -> Result<Option<CapabilityBindingAssessment>, RepositoryError>` | invocation anchor, Query, event source | same adapter/fake | no UoW; immutable ref read | missing is stale/unverifiable, not latest inference | exact assessment |
| `get_latest_assessment_for_binding(&CapabilityBindingId) -> Result<Option<CapabilityBindingAssessment>, RepositoryError>` | CF-08/QF-03 | same adapter/fake | no UoW; deterministic `(consumed_at, assessment_id)` selection | equal frame with differing content -> integrity; never scan external source | equal ordering conflict |
| `list_bindings_by_hub_capability(HubCapabilityBindingLookupScope, RepositoryPageRequest) -> Result<RepositoryPage<Loaded<CapabilityBinding>>, RepositoryError>` | IF-01 bounded reverse lookup | same adapter/fake | scope digest from `HubCapabilityBindingLookupScope::filter_digest`; one page | invalid cursor/filter -> cursor error; next page becomes gap | page bound/continuation |
| `get_change_fact(&BindingChangeFactRef) -> Result<Option<CapabilityBindingChangeFact>, RepositoryError>` | BindingChange material/event | same adapter/fake | no UoW; immutable fact | missing source blocks event | replacement successor symmetry |
| `list_assessments(BindingAssessmentScope, RepositoryPageRequest) -> Result<RepositoryPage<CapabilityBindingAssessment>, RepositoryError>` | QF-03/JF-01 | same adapter/fake | scope/page watermark required | cursor conflict -> no partial page | stable order |
| `list_change_facts(BindingChangeScope, RepositoryPageRequest) -> Result<RepositoryPage<CapabilityBindingChangeFact>, RepositoryError>` | history Query/JF-01 | same adapter/fake | bounded page; fact cursor not version | invalid cursor/unavailable explicit | formal/invalidation history |
| `create_binding(CapabilityBinding, &dyn ToolsUnitOfWork) -> Result<Loaded<CapabilityBinding>, RepositoryError>` | CF-05 declaration | same persistence authority/fake | create token returned in same UoW | current relation uniqueness conflict; no overwrite | first declaration |
| `save_binding(CapabilityBinding, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<CapabilityBinding>, RepositoryError>` | CF-06 replacement / CF-07 invalidation | same adapter/fake | token from `get_binding`; same UoW as change fact | stale -> conflict; no relation repair | concurrent replacement |
| `append_snapshot(HubControlledSnapshot, &dyn ToolsUnitOfWork) -> Result<AppendResult<HubSnapshotRef>, RepositoryError>` | IF-01 and CF-05/06 | same adapter/fake | source authority/revision/summary digest semantic key | equal only after source attribution; conflict -> integrity | blocked vs available snapshot |
| `append_assessment(CapabilityBindingAssessment, &dyn ToolsUnitOfWork) -> Result<AppendResult<BindingAssessmentRef>, RepositoryError>` | IF-01 and binding Commands | same adapter/fake | immutable basis/consumption key; never mutates Binding | equal replay; differing basis conflict | assessment branches |
| `append_change_fact(CapabilityBindingChangeFact, &dyn ToolsUnitOfWork) -> Result<AppendResult<BindingChangeFactRef>, RepositoryError>` | CF-05/06/07 | same adapter/fake | append-only fact; successor required only for replacement | equal replay; successor asymmetry integrity | formal replacement/invalidation |

**Store stop review:** relation truth, Hub snapshot, assessment and change fact remain separate;
reverse lookup is bounded and local; no Store method calls Hub or changes an invocation anchor.

### 3.3 `ToolInvocationStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `get_invocation(&ToolInvocationId) -> Result<Option<ToolInvocation>, RepositoryError>` | CF-11 source validation; direct Query | `infra::repositories::ToolInvocationStoreAdapter` / fake | no UoW; immutable canonical invocation read | missing -> blocked subject; no body reconstruction | exact invocation refs |
| `get_invocation_owner_scope(&ToolInvocationId) -> Result<Option<OwnerScopeRef>, RepositoryError>` | Query visibility | same adapter/fake | no UoW; local owner scope only | absent -> not-found/unavailable per visibility | anti-enumeration |
| `get_admission(&ToolInvocationId) -> Result<Option<InvocationAdmission>, RepositoryError>` | QF-04/QF-05; CF-11 | same adapter/fake | no UoW; immutable admission | missing -> awaiting/blocked, never infer admitted | late admission |
| `get_invocation_read_bundle(&ToolInvocationId) -> Result<Option<ToolInvocationReadBundle>, RepositoryError>` | QF-04; CF-11 | same adapter/fake | one local watermark; optional outcome ref | invocation/admission mismatch -> serialization conflict | bundle symmetry |
| `list_by_tool(ToolInvocationScope, RepositoryPageRequest) -> Result<RepositoryPage<ToolInvocation>, RepositoryError>` | JF-01/QF list | same adapter/fake | typed scope/page/watermark | invalid cursor/unavailable explicit | bounded list |
| `insert_invocation(ToolInvocation, &dyn ToolsUnitOfWork) -> Result<AppendResult<ToolInvocationRef>, RepositoryError>` | CF-08 | same adapter/fake | semantic key `invocation_id`; same UoW as admission/result when needed | equal exact replay; different intent conflict | duplicate invocation |
| `append_admission(InvocationAdmission, &dyn ToolsUnitOfWork) -> Result<AppendResult<InvocationAdmissionRef>, RepositoryError>` | CF-08 | same adapter/fake | one admission per invocation; append-only | alternate admission -> conflict/gap, no overwrite | admit/reject/unavailable |

**Store stop review:** InvocationStore exposes exactly the read bundle required to construct
`ToolInvocationView`; it does not read Runtime plan/loop state or call any external authority.

### 3.4 `ExecutionHandoffStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `get_requirement(&ToolInvocationId) -> Result<Option<ExecutionRequirement>, RepositoryError>` | CF-09/10; QF-05 | `infra::repositories::ExecutionHandoffStoreAdapter` / fake | no UoW; derived immutable requirement | missing -> unsupported/blocked, no auth inference | requirement classes |
| `get_authorization_assessment(&AuthorizationAssessmentRef) -> Result<Option<AuthorizationConsumptionAssessment>, RepositoryError>` | precondition view; CF-11 audit basis | same adapter/fake | no UoW; immutable assessment | missing -> stale/unverifiable | exact result ref |
| `get_latest_authorization_assessment(&ToolInvocationId) -> Result<Option<AuthorizationConsumptionAssessment>, RepositoryError>` | CF-09/QF-05 | same adapter/fake | deterministic source/basis ordering | conflicting equal frame -> integrity; no latest by arrival | allow/deny/constrained |
| `list_authorization_assessments_by_result(AuthorizationAssessmentLookupScope, RepositoryPageRequest) -> Result<RepositoryPage<AuthorizationConsumptionAssessment>, RepositoryError>` | IF-02 bounded reverse lookup | same adapter/fake | scope requires external result + subject; page digest | missing fields reject; next page -> gap | bounded clue fan-out |
| `get_sandbox_readiness(&SandboxReadinessSnapshotRef) -> Result<Option<SandboxReadinessSnapshot>, RepositoryError>` | CF-10/QF-05 | same adapter/fake | no UoW; formal source snapshot only | missing/blocked remains unavailable | readiness stale/conflict |
| `get_handoff(&ExecutionHandoffId) -> Result<Option<Loaded<ExecutionHandoff>>, RepositoryError>` | CF-10/QF-05 | same adapter/fake | token fences `save_handoff` | missing -> blocked; stale token never guessed | preparing/ready/blocked |
| `get_latest_handoff_by_invocation(&ToolInvocationId) -> Result<Option<Loaded<ExecutionHandoff>>, RepositoryError>` | QF-05; recovery | same adapter/fake | deterministic local handoff generation/order | multiple active -> integrity; no scan fallback | one current handoff |
| `get_handoff_attempt(&ExecutionHandoffAttemptId) -> Result<Option<Loaded<ExecutionHandoffAttempt>>, RepositoryError>` | CF-10 post-call recovery | same adapter/fake | token fences terminal save | missing prepared marker -> manual/integrity; never re-call | exactly-one Port call |
| `list_handoff_attempts(ExecutionHandoffAttemptScope, RepositoryPageRequest) -> Result<RepositoryPage<ExecutionHandoffAttempt>, RepositoryError>` | QF-05/JF-02 | same adapter/fake | bounded page and watermark | cursor invalid/unavailable explicit | attempt history |
| `get_precondition_read_bundle(&ToolInvocationId) -> Result<Option<ExecutionPreconditionReadBundle>, RepositoryError>` | CF-10/11; QF-05 | same adapter/fake | one watermark; latest handoff/attempt use Loaded tokens | cross-ref mismatch -> integrity | bundle with no-execution ref |
| `append_requirement(ExecutionRequirement, &dyn ToolsUnitOfWork) -> Result<AppendResult<ExecutionRequirementRef>, RepositoryError>` | CF-09 | same adapter/fake | semantic invocation/anchor/evaluation key | equal replay; differing basis conflict | repeated evaluation |
| `append_authorization_assessment(AuthorizationConsumptionAssessment, &dyn ToolsUnitOfWork) -> Result<AppendResult<AuthorizationAssessmentRef>, RepositoryError>` | CF-09 | same adapter/fake | immutable source/basis frame | equal replay; conflict -> gap | blocked/allow/deny |
| `append_sandbox_readiness(SandboxReadinessSnapshot, &dyn ToolsUnitOfWork) -> Result<AppendResult<SandboxReadinessSnapshotRef>, RepositoryError>` | CF-09 | same adapter/fake | authority/mapping revision key | unavailable/blocked snapshot remains typed | mapping blocker |
| `create_handoff(ExecutionHandoff, &dyn ToolsUnitOfWork) -> Result<Loaded<ExecutionHandoff>, RepositoryError>` | CF-10 | same adapter/fake | create token returned before side-effect call | uniqueness conflict -> no Port call | prepared handoff |
| `save_handoff(ExecutionHandoff, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<ExecutionHandoff>, RepositoryError>` | CF-10 local disposition | same adapter/fake | token from `get_handoff`; same UoW as result | stale -> no external retry | handoff state fence |
| `create_handoff_attempt(ExecutionHandoffAttempt, &dyn ToolsUnitOfWork) -> Result<Loaded<ExecutionHandoffAttempt>, RepositoryError>` | CF-10 before Sandbox call | same adapter/fake | creates `Prepared`; returned token is post-call compare token | duplicate prepared -> existing marker, no second call | crash before call |
| `save_handoff_attempt(ExecutionHandoffAttempt, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<ExecutionHandoffAttempt>, RepositoryError>` | CF-10 after Sandbox call | same adapter/fake | token from `create/get_handoff_attempt`; one terminal transition | outcome unknown stays unknown/manual | all terminal dispositions |

**Store stop review:** `ExecutionHandoffAttempt` is versioned local fencing truth, not an external
run. Authorization and Sandbox results are immutable consumption records; no method can create a
provider receipt or retry policy.

### 3.5 `OutcomeAuditStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `get_source_assessment(&ExecutionSourceAssessmentRef) -> Result<Option<ExecutionSourceAssessment>, RepositoryError>` | CF-11 replay/view; QF-06 | `infra::repositories::OutcomeAuditStoreAdapter` / fake | no UoW; immutable assessment | missing ref -> blocked/unverifiable; no source reconstruction | accepted/blocked/missing |
| `list_source_assessments(ExecutionSourceAssessmentScope, RepositoryPageRequest) -> Result<RepositoryPage<ExecutionSourceAssessment>, RepositoryError>` | JF-02 and integrity Query | same adapter/fake | typed scope/page/watermark | invalid cursor/unavailable explicit | bounded source history |
| `get_outcome_audit_pair(&ToolInvocationId) -> Result<Option<OutcomeAuditPair>, RepositoryError>` | CF-08/11; QF-06; replay | same adapter/fake | no UoW; pair read is atomic and one local watermark if bundled | half pair -> `SerializationConflict`; missing is explicit | pair symmetry/late material |
| `get_outcome(&ToolInvocationOutcomeId) -> Result<Option<ToolInvocationOutcome>, RepositoryError>` | direct view/diagnostic | same adapter/fake | no UoW; immutable terminal read | missing outcome never synthesized from audit | outcome class |
| `get_audit_entry(&ToolAuditEntryId) -> Result<Option<ToolAuditEntry>, RepositoryError>` | direct audit view/diagnostic | same adapter/fake | no UoW; immutable append read | missing audit with outcome -> integrity | audit symmetry |
| `append_source_assessment(ExecutionSourceAssessment, &dyn ToolsUnitOfWork) -> Result<AppendResult<ExecutionSourceAssessmentRef>, RepositoryError>` | CF-11 accepted/conservative branch | same persistence authority/fake | semantic source/mapping/consumption key; same UoW as pair/gaps/result | equal after canonical source attribution; conflict -> integrity | source revision conflict |
| `insert_outcome_audit_pair(OutcomeAuditPair, &dyn ToolsUnitOfWork) -> Result<OutcomeAuditInsertResult, RepositoryError>` | CF-08 no-execution / CF-11 accepted | same adapter/fake | one indivisible method; same UoW as source assessment and stored result | `TerminalConflict` never overwrites; half pair impossible | inserted/equal/conflict/rollback |

`OutcomeAuditStore` has no separate `insert_outcome` or `insert_audit`. Application must map
`OutcomeAuditInsertResult::ExistingEqual` only after checking canonical invocation, source basis,
outcome class and audit refs. A committed pair is the only input from which an `OutcomeAuditView`
may be built; a local attempt or external status cannot substitute for it.

### 3.6 `ExternalSubmissionStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `get_eligibility(&SafeHandoffEligibilityId) -> Result<Option<SafeHandoffEligibility>, RepositoryError>` | CF-12/QF-06 | `infra::repositories::ExternalSubmissionStoreAdapter` / fake | no UoW; immutable eligibility | missing -> no material/attempt | eligible/ineligible/unverifiable |
| `find_eligibility(&SafeHandoffSourceKey, ExternalCollaborationClass) -> Result<Option<SafeHandoffEligibility>, RepositoryError>` | CF-12 duplicate/source lookup | same adapter/fake | exact source key + target; no latest scan | multiple matches -> integrity | target-specific key |
| `get_material(&SafeHandoffMaterialId) -> Result<Option<SafeHandoffMaterial>, RepositoryError>` | continuation entry / event mapper | same adapter/fake | no UoW; committed immutable material only | missing -> `ProtocolError::blocked_without_subject`; no attempt | missing/committed symmetry |
| `find_material_for_eligibility(&SafeHandoffEligibilityId) -> Result<Option<SafeHandoffMaterial>, RepositoryError>` | CF-12/QF-06 | same adapter/fake | exact eligibility relation | multiple material rows -> integrity | duplicate material |
| `get_attempt(&ExternalSubmissionAttemptId) -> Result<Option<Loaded<ExternalSubmissionAttempt>>, RepositoryError>` | OF phase-2; IF-04/05; JF-04 recovery | same adapter/fake | token fences `save_attempt`; no hidden refresh | missing prepared marker -> manual/integrity | post-call recovery |
| `find_attempt_for_event(&SafeHandoffMaterialId, &ToolEventId, ExternalCollaborationClass) -> Result<Option<Loaded<ExternalSubmissionAttempt>>, RepositoryError>` | every OF continuation before phase-1 | same adapter/fake | semantic key `(material,event,target)`; returns existing Prepared/terminal | conflicting duplicate -> integrity; Prepared is not proof call absent | exactly-one Port call |
| `list_attempts(ExternalSubmissionAttemptScope, RepositoryPageRequest) -> Result<RepositoryPage<Loaded<ExternalSubmissionAttempt>>, RepositoryError>` | QF-06/JF-04 | same adapter/fake | stable logical order + page watermark; each item has version token | cursor/unavailable explicit | bounded attempt page |
| `get_latest_bus_status(&ExternalSubmissionAttemptId) -> Result<Option<BusDeliveryStatusRef>, RepositoryError>` | QF-06/JF-04 | same adapter/fake | latest by formal authority consumption frame, not arrival time | conflicting refs are returned as gap input, never selected silently | referenced/stale/conflict |
| `get_latest_observation_status(&ExternalSubmissionAttemptId) -> Result<Option<ObservationMaterialRef>, RepositoryError>` | QF-06/JF-04 | same adapter/fake | same authority/time rule, independent from Bus | conflict -> gap; absent != observed | observed/unknown/blocked |
| `append_eligibility(SafeHandoffEligibility, &dyn ToolsUnitOfWork) -> Result<AppendResult<SafeHandoffEligibilityRef>, RepositoryError>` | CF-12 | same persistence authority/fake | semantic key `(source,target,four-check digest)` | equal replay; different checks conflict | four-gate matrix |
| `append_material(SafeHandoffMaterial, &dyn ToolsUnitOfWork) -> Result<AppendResult<SafeHandoffMaterialRef>, RepositoryError>` | CF-12 before continuation | same adapter/fake | immutable eligibility + safe-content digest | duplicate equal only; no body reconstruction | redaction/body-free |
| `create_attempt(ExternalSubmissionAttempt, &dyn ToolsUnitOfWork) -> Result<Loaded<ExternalSubmissionAttempt>, RepositoryError>` | OF phase-1 after claim | same adapter/fake | only `Prepared`; returned token fences post-call save | existing semantic attempt returns existing marker; no second Port call | prepare commit fence |
| `save_attempt(ExternalSubmissionAttempt, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<ExternalSubmissionAttempt>, RepositoryError>` | OF phase-2 after exactly one Port call | same adapter/fake | token from `create_attempt` or `get_attempt`; one `Prepared -> terminal` transition | stale -> unknown/integrity; never retry | all local dispositions |
| `append_bus_status(BusDeliveryStatusRef, &dyn ToolsUnitOfWork) -> Result<AppendResult<BusDeliveryStatusRefId>, RepositoryError>` | IF-04 phase-2 / JF-04 stored feedback | same adapter/fake | append-only formal Bus ref, unique source/attempt/status basis | equal replay; conflict opens gap | formal vs blocked feedback |
| `append_observation_status(ObservationMaterialRef, &dyn ToolsUnitOfWork) -> Result<AppendResult<ObservationMaterialRefId>, RepositoryError>` | IF-05 phase-2 / JF-04 stored feedback | same adapter/fake | append-only formal Observation ref, independent from Bus | equal replay; conflict opens gap | formal vs blocked observation |

`ExternalSubmissionStore` never changes `SafeHandoffMaterial`, outcome/audit, or external
delivery/observation truth. `Prepared` and `SubmissionOutcomeUnknown` are read as manual/in-flight
states; a duplicate continuation returns the stored local view and performs zero collaboration
Port calls.

### 3.7 `ProjectionStore`

| Exact method and result | Caller / use | Implementer | Version / page / UoW | Error and recovery | Test cut |
|---|---|---|---|---|---|
| `append_reference_assessment(ReferenceValidityAssessment, &dyn ToolsUnitOfWork) -> Result<AppendResult<ReferenceAssessmentRef>, RepositoryError>` | IF-01/02 and JF-01/02 | `infra::projection_store::ProjectionStoreAdapter` / fake | immutable assessment append; same UoW as receipt/gaps | equal replay; basis conflict -> integrity | valid/stale/missing/unverifiable |
| `list_reference_assessments(ReferenceAssessmentScope, RepositoryPageRequest) -> Result<RepositoryPage<ReferenceValidityAssessment>, RepositoryError>` | QF-07/JF-02 | same adapter/fake | typed scope/page/watermark | cursor/unavailable explicit | bounded reference page |
| `get_gap(&ConsistencyGapId) -> Result<Option<Loaded<ConsistencyGap>>, RepositoryError>` | CF-13/QF-07/OF-04 | same adapter/fake | token fences `save_gap` | missing subject -> blocked_without_subject only when no attributable ref | gap view |
| `find_open_gap(&ConsistencyGapKey) -> Result<Option<Loaded<ConsistencyGap>>, RepositoryError>` | all gap append/resolve flows | same adapter/fake | canonical key; token returned for resolve | equal basis can reuse; different basis conflict | duplicate open gap |
| `list_gaps(ConsistencyGapQueryScope, RepositoryPageRequest) -> Result<RepositoryPage<Loaded<ConsistencyGap>>, RepositoryError>` | QF-07/JF-01/02/04 | same adapter/fake | item tokens retained; bounded page | cursor/filter mismatch -> cursor error | page continuation |
| `create_gap(ConsistencyGap, &dyn ToolsUnitOfWork) -> Result<Loaded<ConsistencyGap>, RepositoryError>` | Consumer phase-2, CF-11/12, OF gap mapping | same authority/fake | create token returned; semantic open-key uniqueness | equal existing gap requires canonical equality; conflict -> integrity | gap create/replay |
| `save_gap(ConsistencyGap, ExpectedVersion, &dyn ToolsUnitOfWork) -> Result<Loaded<ConsistencyGap>, RepositoryError>` | CF-13 resolution/supersede | same adapter/fake | token from `get_gap/find_open_gap`; same UoW as decision | stale -> conflict; no repair of subject | legal transitions |
| `get_consistency_report(&ReferenceConsistencyReportKey) -> Result<ProjectionRead<ReferenceConsistencyReport>, RepositoryError>` | CF-03/04/13; QF-07; closure verification | same adapter/fake | selector chooses exact/persisted latest completed watermark; no rebuild | Missing/Rebuilding/Unavailable/Failed remain structural | fresh/stale/missing |
| `write_consistency_report(ReferenceConsistencyReport, &dyn ToolsUnitOfWork) -> Result<ProjectionWriteResult, RepositoryError>` | JF-02 rebuild | same adapter/fake | compare source watermark/projection version; same UoW | stale write result is explicit; source truth untouched | rebuild compare |
| `get_search_projection(&ToolId) -> Result<Option<ToolContractSearchProjection>, RepositoryError>` | QF-08 and guidance assembly | same adapter/fake | no live current fallback; persisted projection only | missing -> unavailable/degraded | projection missing |
| `search_tool_contracts(ToolContractSearchScope, RepositoryPageRequest) -> Result<ProjectionPageRead<ToolContractSearchProjection>, RepositoryError>` | QF-08 | same adapter/fake | page preserves empty vs unavailable/rebuilding and watermark | no write/refresh | empty visibility seed |
| `write_search_projection(ToolContractSearchProjection, &dyn ToolsUnitOfWork) -> Result<ProjectionWriteResult, RepositoryError>` | JF-03 | same adapter/fake | compare source watermark; no T1/T2 mutation | stale/conflict explicit | rebuild/idempotent write |
| `get_diff_summary(&ToolContractDiffKey) -> Result<ProjectionRead<ToolContractDiffSummary>, RepositoryError>` | QF-02/QF-09 | same adapter/fake | selector and watermark symmetry | missing/degraded explicit | exact pair |
| `write_diff_summary(ToolContractDiffSummary, &dyn ToolsUnitOfWork) -> Result<ProjectionWriteResult, RepositoryError>` | JF-03 | same adapter/fake | source pair watermark compare | no contract adoption | stale write |
| `get_diagnostic_summary(&ToolDiagnosticKey) -> Result<ProjectionRead<ToolDiagnosticSummary>, RepositoryError>` | QF-10 | same adapter/fake | no hidden refresh | unavailable -> degraded view | no-write query |
| `write_diagnostic_summary(ToolDiagnosticSummary, &dyn ToolsUnitOfWork) -> Result<ProjectionWriteResult, RepositoryError>` | JF-03 | same adapter/fake | projection-only write | never repair source | failed build |
| `get_consumer_guidance(&ToolConsumerGuidanceKey) -> Result<ProjectionRead<ToolConsumerGuidanceView>, RepositoryError>` | QF-11 | same adapter/fake | exact revision or persisted BuiltCurrent selector | stale revision not silently current | guidance revision |
| `write_consumer_guidance(ToolConsumerGuidanceView, &dyn ToolsUnitOfWork) -> Result<ProjectionWriteResult, RepositoryError>` | JF-03 | same adapter/fake | compare target revision/watermark | no auth/plan/client decision | rebuild |
| `list_projection_targets(ProjectionRebuildScope, RepositoryPageRequest) -> Result<RepositoryPage<ProjectionTargetRef>, RepositoryError>` | JF-03 bounded target selection | same adapter/fake | page cursor scoped to rebuild kind/filter/watermark | next cursor carried in `JobReport`, not hidden loop | bounded slice |
| `mark_affected_stale(&LocalTruthRef, LocalTruthWatermark, RepositoryPageRequest, &dyn ToolsUnitOfWork) -> Result<RepositoryPage<ProjectionWriteResult>, RepositoryError>` | truth-changing CF-01~07/13 | same adapter/fake | one bounded reverse-index page; same command UoW; page next cursor becomes `PropagationIncomplete` gap | reverse index unavailable -> explicit gap; never external scan | one-page fence/continuation |

**Store stop review:** `ProjectionStore` exposes every D1 read/write needed by Queries and Jobs,
but no method can write T1/T2 truth. Empty pages, stale projections and unavailable dependencies
remain typed surfaces; a Command never loops beyond its bounded stale page.

## 4. Seven external Port exact seam ledger

The Rust signatures and carrier fields remain authoritative in
`03_ddd_step_07_module_application_external_ports_annex.md`. This ledger adds the missing
per-method wiring required by the detailed-design callable standard. An application flow may call
only a row below, with the named request/result pair; adapter-private overloads are not part of the
design.

### 4.1 Compile authority, Hub source and canonical invocation entry

| Exact method | Caller / phase | Implementer | Request source and result guard | Error / blocker / recovery | Fake parity and minimum cut |
|---|---|---|---|---|---|
| `SharedContractAuthorityPort::resolve(&SharedContractAuthorityRequest) -> PortFuture<Result<PortResolution<SharedContractAuthorityResolution>, PortCallError>>` | `CF-01`, `CF-02`, shared-contract integrity slice before any business UoW | `infra::source_resolvers::CoreSharedContractAuthorityAdapter`; explicit blocked adapter; deterministic fake | Request is copied from the selected `DefinitionSourceInput`/candidate family and required capability. `Available` must echo family and candidate authority, and may name a package/type only when that exact Core authority proves it. | Missing Tools schema or unfrozen authority -> `Blocked(L2T-UP-007/008)` or `Unverifiable`; malformed inventory result -> `InvalidResponse`; application may persist candidate-only/blocked assessment but cannot invent a Core type. | Same family/revision/capability symmetry; fake covers compatible, candidate-only, missing, conflicting and malformed, but never proves a real compile dependency. |
| `HubControlledSourcePort::resolve_snapshot(&HubControlledSourceRequest) -> PortFuture<Result<PortResolution<HubControlledSourceResolution>, PortCallError>>` | `CF-05` and `CF-06`, after local contract/relation pre-read and before command UoW | `infra::source_resolvers::HubControlledSourceAdapter`; blocked adapter; fake | Request fields come 1:1 from `HubCapabilityCandidateInput`, tool identity and command correlation. `Available` must echo capability ID/revision/locator under one formal `HubAuthorityRef`; application alone constructs `HubCapabilityRef`, `HubControlledSnapshot` and assessment. | Blocked/unavailable/stale/conflicting/unverifiable becomes conservative assessment/gap or fail-closed command result; no name lookup, cached registry row or relation mutation. | Exact candidate/result mismatch is rejected in durable and fake; test bound, explicit-unbound bypass, stale, conflict, forbidden body and unavailable. |
| `HubControlledSourcePort::validate_change_clue(&HubCapabilityChangeClueInput) -> PortFuture<Result<PortResolution<HubControlledSourceResolution>, PortCallError>>` | `IF-01` after committed Consumer claim and envelope gate, before phase-2 UoW | same Hub adapter family | Input must be produced by `from_validated_envelope`; source event/authority/version/correlation and safe clue fields remain inseparable. Result is assessment input only, never a registry update. | Attributable blocked/conflict can create snapshot-independent gap; unattributable failure aborts before effect. One bounded local reverse page follows; no external scan. | Fake preserves envelope/result symmetry and identical gap-only behavior; test withdrawn clue without invalidating Binding and next-page gap. |
| `InvocationCallerPort::submit(SubmitToolInvocationRequest, CommandMetadata) -> PortFuture<Result<SubmitToolInvocationResult, ApplicationError>>` | Runtime/direct caller/API adapter; canonical `CF-08` entry | application `invocation_service`, delegating to the exact `ToolCommandUseCases` command variant | Owned Step 8 request/metadata are passed unchanged through the semantic entry; result is the exact typed `SubmitToolInvocation` command surface, including replay/conflict/unavailable. | Validation/application error is returned through the same mapper; no infra implementation, SDK client, transport body or caller-specific fallback. `L2T-UP-009` remains open. | Direct caller and API must produce byte-equivalent digest/result for equal semantic input; fake application facade cannot bypass idempotency or admission. |

### 4.2 Authorization and Sandbox seams

| Exact method | Caller / phase | Implementer | Request source and result guard | Error / blocker / recovery | Fake parity and minimum cut |
|---|---|---|---|---|---|
| `AuthorizationConsumptionPort::consume_result(&AuthorizationConsumptionRequest) -> PortFuture<Result<PortResolution<AuthorizationConsumptionResolution>, PortCallError>>` | `CF-09` after invocation/definition/requirement load, outside UoW | formal authorization-result adapter when contract closes; mandatory blocked adapter now; fake | Request copies invocation/tool/revision/actor/requirement/class/selector/constraint capabilities/correlation. Result must echo invocation-bound subject/result/revision and only closed safe decision/constraint carriers. | `L2T-UP-001/002` -> stable blocked branch. No selector/default may produce allow; timeout/unavailable is fail-closed; application persists only assessment/gap in the later UoW. | Fake supports allow/constrained/deny solely for application branch tests and must also cover blocked, mismatched subject/revision and forbidden body. |
| `AuthorizationConsumptionPort::validate_change_clue(&AuthorizationResultChangeClueInput) -> PortFuture<Result<PortResolution<AuthorizationConsumptionResolution>, PortCallError>>` | `IF-02` after committed Consumer claim, before phase-2 UoW | same adapter families | Input comes only from validated envelope. Resolution validates external result ID + subject + revision + source/correlation; it cannot refresh or rewrite an earlier authorization assessment. | Blocked/unverifiable creates one `ReferenceValidityAssessment` plus attributable gap; reverse lookup is bounded and read-only; missing attribution returns safe blocked error. | Durable/fake use same resolution-to-assessment mapping and page continuation behavior; no fake cached allow. |
| `SandboxExecutionPort::resolve_readiness(&SandboxReadinessRequest) -> PortFuture<Result<PortResolution<SandboxReadinessResolution>, PortCallError>>` | `CF-09` outside UoW, after exact requirement construction | formal Sandbox mapping adapter when closed; mandatory blocked adapter; fake | Request binds invocation, requirement, carrier, isolation and correlation. Result must echo authority/carrier/mapping revision and body-free readiness summary; it does not return a run/receipt. | `L2T-UP-003/004` -> mapping-blocked snapshot/gap. Unavailable never falls back to host/direct execution. | Fake covers ready, carrier unavailable, mapping blocked, correlation mismatch and forbidden body with identical local snapshot factories. |
| `SandboxExecutionPort::submit_handoff(&SandboxExecutionHandoffRequest) -> PortFuture<Result<PortResolution<SandboxExecutionHandoffLocalResponse>, PortCallError>>` | `CF-10` only, after phase-1 claim + `ExecutionHandoffAttempt::Prepared` commit and outside all UoWs | same Sandbox adapter families | Request is built from the committed handoff/requirement/mapping revision and safe canonical execution summary. Exactly one call is allowed for the attempt. Valid response carries only local disposition, optional source-locator candidate, response revision and safe summary. | Proven pre-call timeout may become local failure; `SideEffectOutcomeUnknown` saves `CallOutcomeUnknown`, leaves claim incomplete and forbids another call. Mapping/receipt open -> blocked, no host fallback. | Fake tracks call count by attempt ID, refuses a second call, and returns all local dispositions/unknown without inventing execution lifecycle. |
| `ExecutionSourceIntakePort::map_source(&ExecutionSourceIntakeRequest) -> PortFuture<Result<PortResolution<ExecutionSourceIntakeResolution>, PortCallError>>` | `CF-11` only; `IF-03` must formally re-enter `CF-11` and must not pre-call this Port | formal Sandbox source adapter when closed; mandatory blocked adapter; fake | Input is derived from exact validated source candidate and carries source event/authority/version, invocation, handoff correlation, external execution ref, source class/revision and safe summary. `Available` must prove authority, mapping revision and all identity/correlation symmetries. | Blocked/unverifiable/missing creates source assessment/gap only; accepted outcome/audit still requires `CF-11` domain guards and atomic store insert. No locator/delivery inference. | Direct `CF-11` and `IF-03` re-entry use the same scripted outcomes and result mapping; test mismatch, blocked, accepted safe classes and no second mapping call on replay. |

### 4.3 Safe event collaboration seam

| Exact method | Caller / phase | Implementer | Request source and result guard | Error / blocker / recovery | Fake parity and minimum cut |
|---|---|---|---|---|---|
| `SafeEventCollaborationPort::submit(&SafeEventSubmissionRequest) -> PortFuture<Result<PortResolution<SafeEventSubmissionLocalResponse>, PortCallError>>` | `OF-01~04` continuation only, after committed material/event and phase-1 `ExternalSubmissionAttempt::Prepared` | formal Bus/collaboration adapter when route contract closes; mandatory blocked adapter; fake | Request contains committed material ref, exact target and the closed Step 8 semantic event envelope. Adapter validates but cannot rebuild or mutate the event. One call per semantic attempt; response is local disposition + optional locator/revision only. | `L2T-UP-004~006` -> route blocked. Ambiguous side effect -> `SubmissionOutcomeUnknown`, incomplete claim/manual owner; no auto-resubmit. Submitted locally never means delivered/observed. | Fake call counter is keyed by `(material,event,target)` and must reject repeat; covers submitted, local reject, route blocked, degraded and outcome unknown. |
| `SafeEventCollaborationPort::resolve_bus_delivery(&BusDeliveryFeedbackRequest) -> PortFuture<Result<PortResolution<BusDeliveryFeedbackSafeResolution>, PortCallError>>` | `IF-04 ValidateInbound` after claim; `JF-04 ResolveStored` in one bounded slice | formal Bus feedback adapter when closed; blocked adapter; fake | Closed request enum prevents inbound candidate and stored refresh from mixing. Result must prove Bus authority, attempt, locator, delivery ref/status and feedback revision; it cannot alter attempt. | Blocked/unavailable/conflict yields attributable status/gap or safe failure. No polling loop, broker ack, delivery retry or arrival-time latest choice. | Same mode validation and append result under fake/durable; test locator/revision mismatch, equal replay, conflict and no attempt mutation. |
| `SafeEventCollaborationPort::resolve_observation(&ObservationFeedbackRequest) -> PortFuture<Result<PortResolution<ObservationFeedbackSafeResolution>, PortCallError>>` | `IF-05 ValidateInbound` after claim; `JF-04 ResolveStored` in one bounded slice | formal Observability adapter when closed; blocked adapter; fake | Closed request/result stays distinct from Bus. Result proves observation authority, attempt/optional locator/material, status, source and route revisions; no observation body. | `L2T-UP-005/006` -> blocked/unverifiable gap. No observability store, retention, alert, evidence or acceptance inference. | Fake/durable preserve independent observation status semantics; test absent material ref, route mismatch, equal replay/conflict and zero audit mutation. |

### 4.4 External Port stop review

| Review item | Result | Closure |
|---|---|---|
| Seven named Ports and eleven exact methods | pass | §4.1-4.3; no unnamed resolver/client/publisher was added. |
| Caller and call phase | pass | Every method names CF/IF/OF/JF entry and UoW placement. |
| Request/result construction | pass | Existing external-port annex is the field authority; this ledger fixes the exact source and symmetry checks. |
| Semantic blocked vs call failure | pass | `PortResolution` vs `PortCallError` remains exhaustive and body-free. |
| Side-effect fence | pass | Only Sandbox handoff and event submit are side-effecting; both have committed prepared marker and unknown-outcome branch. |
| Production blocked adapters and fakes | pass | Open contracts stay blocked; fake success is limited to local branch tests. |

## 5. Cross-seam application helpers and canonical authority

### 5.1 Canonical carrier authority and superseded duplicates

| Carrier / callable | Sole current authority | Step 7 use | Superseded / forbidden alternative |
|---|---|---|---|
| `ContinuationKey`, `SafeMaterialContinuationInput` and their `derive/from_committed_material/validate/canonical_digest` methods | `03_ddd_step_06_object_contracts_recalibration_annex.md` §4.2 | Worker continuation facade takes the type by value; application reloads material and revalidates it before attempt lookup. | The repeated struct body in the older entry annex is explanatory only; worker-generated key, event name, route, retry or scheduler fields are forbidden. |
| `LocalResultRef`, `LocalAbortReason` | same R-6 annex §4.4 | Consumer append executor and receipt mapper use only these closed refs/reasons. | Generic string ref, broker receipt, run ID, evidence alias and post-side-effect abort are forbidden. |
| `CommandUseCaseResult<T>` | same R-6 annex §4.3 | Only `IF-03` inspects committed/replayed `CF-11` results before public API mapping. | A transient error cannot be converted to a stored Consumer receipt. |
| `ExternalSubmissionAttempt` fields/state/factories | `03_ddd_step_06_module_outcome_audit_handoff_annex.md` §10 plus the R-6 object index | Store create/save and continuation map use the same object. | Step 7/9 cannot introduce a second attempt DTO or delivery/observation state. |
| `HubSnapshotRef` | Step 6 `CapabilityBindingAssessment` / `HubControlledSnapshot` contract | `CapabilityBindingStore::get_snapshot/append_snapshot`; Consumer result mapping. | `HubControlledSnapshotRef` is a superseded alias from older Step 7/02 wording and must not appear in formal 03. |
| `ConsumerAppendOperation`, `ConsumerAppendPlan`, `ConsumerStoreBundle` | `03_ddd_step_09_consumer_flows_annex.md` §3 | Step 7 fixes their Store wiring below; Step 9 remains the helper signature authority. | Adapter-specific batch write, dynamic repository selection or raw vector of closures is forbidden. |

`03_ddd_step_07_module_entry_boundaries_annex.md` therefore remains the facade/signature index, not
a second schema owner. Its repeated `SafeMaterialContinuationInput` code block is superseded by
R-6 and must be assembled as a reference only. The same rule applies to explanatory copies of
`LocalResultRef` or `CommandUseCaseResult` elsewhere.

### 5.2 `ConsumerAppendOperation` 1:1 Store execution matrix

`execute_consumer_append` performs one closed `match`. It does not select a Store from a string,
does not commit, and does not swallow `Conflict`. All operations in one `ConsumerAppendPlan` use
the same phase-2 `&dyn ToolsUnitOfWork`; the receipt and idempotency completion are staged only
after every operation has yielded an attributable `LocalResultRef`.

| Variant | Only legal Store call | Successful `LocalResultRef` | Equal/conflict mapping | Required ordering / forbidden effect |
|---|---|---|---|---|
| `HubSnapshot(value)` | `CapabilityBindingStore::append_snapshot(value, uow)` | `HubSnapshot(returned_ref)` | `Appended` and canonically verified `ExistingEqual` return the ref; `Conflict` -> integrity, rollback whole plan. | Before assessments that reference it; cannot create/update Binding. |
| `BindingAssessment(value)` | `CapabilityBindingStore::append_assessment(value, uow)` | `BindingAssessment(returned_ref)` | Same append mapping; identity/basis mismatch is never equal. | After its snapshot when present; cannot mutate relation or invocation anchor. |
| `ReferenceAssessment(value)` | `ProjectionStore::append_reference_assessment(value, uow)` | `ReferenceAssessment(returned_ref)` | Equal only for exact subject/authority/revision/basis/consumption frame; conflict rolls back. | Before gaps whose basis contains the assessment; cannot repair reference source. |
| `BusStatus(value)` | `ExternalSubmissionStore::append_bus_status(value, uow)` | `BusStatus(returned_ref_id)` | Equal replay returns ID; conflicting authority/attempt/status basis -> integrity/gap path, not overwrite. | Independent of Observation; cannot save attempt, outcome or audit. |
| `ObservationStatus(value)` | `ExternalSubmissionStore::append_observation_status(value, uow)` | `ObservationStatus(returned_ref_id)` | Equal replay returns ID; conflicting source/route/attempt basis -> integrity/gap path. | Independent of Bus; cannot write observability store or audit. |
| `Gap(value)` | `ProjectionStore::create_gap(value, uow)` after `find_open_gap` canonical-key check | `Gap(created_or_equal_ref)` | No generic `AppendResult`: missing key creates; existing canonical-equal reuses its ref; differing basis/content -> conflict and rollback. | All basis refs must already exist in plan or prior committed truth; cannot mutate the gap subject. |

The exact `LocalResultRef` variant is constructed from the Store return, never from an input ID.
If a later operation fails, all earlier staged refs remain invisible because the whole plan rolls
back. Fake and durable executors must emit the same ordered ref set and identical error branch.

### 5.3 Outbound continuation and `ExternalSubmissionAttempt::prepare` fence

The full factory surface is fixed here as the missing Step 7 callable bridge while the object and
state meanings remain owned by Step 6:

```rust
impl ExternalSubmissionAttempt {
    /// Creates the durable pre-call marker for one exact semantic event submission.
    pub fn prepare(
        attempt_id: ExternalSubmissionAttemptId,
        material: &SafeHandoffMaterial,
        event: &ToolSemanticEventEnvelope,
        target_class: ExternalCollaborationClass,
        attempted_at: AttemptTime,
    ) -> Result<Self, DomainError>;
}
```

| Factory input / result | Exact invariant |
|---|---|
| `attempt_id` | Comes only from `IdGeneratorPort::new_submission_attempt_id`; non-empty/collision-safe; not event ID, worker run or external locator. |
| `material` | Must be committed, eligible, immutable, body-free and expose the exact material class/source refs used by `event`. |
| `event` | `event_id`, name, schema, material ref, source refs, correlations and fact time must pass Step 8 envelope symmetry; adapter cannot rebuild it. |
| `target_class` | Must equal both `material.target_class` and the continuation input target; target is explicit even though available from material so mismatched call sites fail before persistence. |
| `attempted_at` | Captured once from `ClockPort` before phase-1 object construction; it is local attempt time, not route/delivery/observation time. |
| returned object | State exactly `Prepared`; event/material/target fields filled; local failure, locator and route revision absent. No external call has yet been made. |

The only legal execution sequence is:

```text
load committed material
  -> SafeMaterialContinuationInput::validate(material)
  -> pure map exact ToolSemanticEventEnvelope
  -> find_attempt_for_event(material_id, event_id, target)
     -> existing any state: return stored/manual view, zero Port calls
     -> none: continue
  -> phase-1 begin
  -> reserve continuation claim
  -> ExternalSubmissionAttempt::prepare(...)
  -> ExternalSubmissionStore::create_attempt(prepared, uow)
  -> stage prepared marker on claim
  -> commit / same-authority resolve_commit
  -> exactly one SafeEventCollaborationPort::submit
  -> map response through one Step 6 record_* transition
  -> phase-2 begin
  -> get_attempt(attempt_id) and require state Prepared + same identity
  -> save_attempt(terminal, loaded.expected_version, uow)
  -> stage gaps + stored continuation result + claim completion
  -> commit / same-authority resolve_commit
```

`Prepared` proves only that phase 1 committed; after process loss it does not prove the external
call was never started. Re-entry returns an awaiting/manual view and performs zero Port calls.
`SubmissionOutcomeUnknown` proves ambiguity and also performs zero automatic Port calls forever.
Only a future separately designed manual recovery protocol may change this rule; no such protocol
exists in the current inventory.

### 5.4 Application facade and entry exact callable matrix

| Facade method | Exact caller | Dispatch input authority | Result authority | Entry forbidden surface |
|---|---|---|---|---|
| `ToolCommandUseCases::execute(ToolCommandRequest, CommandMetadata)` | API Command handler; `InvocationCallerPort` delegates only the `SubmitToolInvocation` variant; formal `IF-03` calls the internal `AcceptExecutionSource` service with derived metadata | Step 8 closed 13-variant command enum and matching metadata | Exact `ToolCommandResult`/`ApplicationError`; stored result replay comes from `IdempotencyStore` | No Store/UoW/Port/domain call, no route-derived selector, no raw body. |
| `ToolQueryUseCases::execute(ToolQueryRequest, QueryMetadata)` | API Query handler | Step 8 closed 11-variant query enum and matching metadata/page | Exact query result/surface; no-write | No refresh/rebuild/repair, Store scan, external Port or visibility guess. |
| `ToolConsumerUseCases::consume(ToolInboundConsumerInput)` | Worker after envelope/source/body gate | Step 8 closed five-envelope enum | Exact stored/replayable `ConsumerReceipt` or application error | No broker ack/retry/DLQ truth, direct Store/UoW/Port or subject repair. |
| `SafeMaterialContinuationUseCases::continue_material(SafeMaterialContinuationInput)` | Worker continuation only | R-6 canonical type built from committed material, not decoded from arbitrary carrier fields | Committed `ExternalSubmissionAttemptView` or typed error/manual state | No arbitrary event/route/retry, direct collaboration call or second attempt. |
| `ToolJobUseCases::run(ToolJobRequest, JobMetadata)` | One-shot jobs entry | Step 8 closed four-job enum, exact system actor/key/watermark/slice | Stored/replayable `JobReport` | No scheduler/lease/run/evidence/signoff truth, unbounded loop or direct repair. |

Entry handlers use this order only: decode logical version/closed variant, validate its matching
metadata/envelope, call one facade method, encode its typed result/error. They cannot construct
`ConsumerAppendOperation`, begin/resolve UoW, load Stores, call external Ports, or infer retry from
an error string. `ApiApplicationBundle`, `WorkerApplicationBundle` and `JobApplicationBundle`
expose only the facade trait objects listed above.

## 6. Infra adapter mapping and parity closure

### 6.1 Method-to-adapter binding matrix

| Application seam | Durable/formal adapter family | Blocked production adapter | Fake obligation | Forbidden fallback |
|---|---|---|---|---|
| UoW + all seven Store groups | one configured local persistence authority | not applicable; missing required store is composition error | transaction-local staged snapshot, compare token, uniqueness, cursor and commit-unknown parity | hidden/autocommit transaction, cache-only truth, cross-authority commit resolve |
| `SharedContractAuthorityPort` | Core inventory candidate adapter | required for unresolved Tools schema/revision | exact candidate/family/capability resolution outcomes | workspace-path/type-name guess |
| `HubControlledSourcePort` | formal Hub source adapter when configured and validated | allowed/required when exact binding is absent | exact safe snapshot/clue symmetry | capability name/locator fallback or registry copy |
| Authorization methods | formal result consumer only after owner/schema/source closure | mandatory under `L2T-UP-001/002` | allow/constrained/deny plus all blocked/error branches for local tests | self-authorization, cached allow, policy evaluation |
| Sandbox readiness/handoff/source | formal mapping/source adapter only after contract closure | mandatory under `L2T-UP-003/004` | readiness/local disposition/source mapping plus ambiguity and call count | host/direct execution, run lifecycle, raw capture/receipt |
| Collaboration submit/feedback | formal collaboration/Bus/Observation adapter only after route/source closure | mandatory under `L2T-UP-004~006` | submit and independent Bus/Observation feedback modes | invented topic/route, delivery/retry/DLQ/observation ownership |
| Read visibility | formal local owner-scope and configured actor-authority resolver | fail-closed unavailable implementation if required binding absent | visible/not-found/forbidden/stale/unavailable parity | authorization policy truth or external registry lookup |

### 6.2 Adapter request/result mapping algorithm

Every external adapter implements the following total sequence for each exact method:

```text
validate request carrier and supported operation/version
  -> validate configured formal binding identity
  -> if binding/schema/mapping/route is open: return stable Blocked
  -> perform one logical call; side-effecting methods have no hidden retry
  -> validate authority + subject + revision + correlation + request/result echo
  -> reject forbidden/raw body before constructing any safe result
  -> map only closed allowlisted fields to the named Port result
  -> return semantic PortResolution

failure before side effect starts or observational failure
  -> PortCallError::{Timeout|InvalidResponse|ForbiddenBody|AdapterFailure}
side-effect may have crossed boundary without valid result
  -> PortCallError::SideEffectOutcomeUnknown
```

Adapter endpoint availability, HTTP/RPC success or a fake fixture does not equal semantic
`Available`. Adapter code never opens a UoW, persists assessment/attempt/gap, advances a domain
state, classifies Consumer receipt, or selects a retry policy. Those branches stay in application.

### 6.3 Durable/fake conformance table

| Dimension | Required assertion |
|---|---|
| Trait shape | Same object-safe method signatures, owned request/result carriers and `Send` futures. |
| Store identity | Same semantic unique key and canonical equality; input IDs cannot be returned as persisted refs without successful staging. |
| Version/UoW | Same adapter-issued token, foreign/closed UoW rejection, rollback invisibility and commit-resolution outcomes. |
| Page/bundle | Same stable logical order, filter digest, watermark, next cursor and bundle symmetry; fake insertion order is irrelevant. |
| External guards | Same authority/subject/revision/correlation/body validation before `Available`. |
| Side-effect count | Sandbox handoff and collaboration submit track and assert at most one call for one durable attempt; ambiguity never produces a second call. |
| Blocker | Same stable blocker ID/owner/family/operation/reopen condition; fake positive mode is explicit and cannot be installed by a production profile. |
| Stored replay | Same complete command result, Consumer receipt, Job report and continuation view; no rerun or current-truth reconstruction. |

## 7. R-7 cross-seam audit and stop review

| Audit item | Result | Evidence / correction |
|---|---|---|
| Foundation / Store method coverage | pass | §§2-3 enumerate every current method with caller, implementation, version/page/UoW, error and test cut. |
| Seven external Ports | pass | §4 closes eleven exact methods and all blocked/fake branches. |
| Consumer append execution | pass | §5.2 fixes six variants to one Store method and one local result ref each. |
| Continuation identity and attempt fence | pass | §§5.1/5.3 bind R-6 authority, exact `prepare` signature and two-phase call sequence. |
| Entry callable closure | pass | §5.4 fixes five facades, callers, exact dispatch authority/result and forbidden surface. |
| Infra mapping / durable-fake parity | pass | §6; no backend/provider/framework product selected. |
| Unique type authority | pass after correction | `HubSnapshotRef` retained; older `HubControlledSnapshotRef` and repeated continuation struct are superseded. |
| Flow callability | pass | Current CF/QF/IF/OF helpers call only listed Store/Port/facade methods; JF/R-9 still requires its own later flow audit. |
| Upstream positive truth | unchanged/open | `L2T-UP-001~009` remain explicit blockers; no provider/schema/mapping/route/client/readiness was invented. |
| Historical pollution | pass | No old MCP/API registry, builtin inventory, same-process runtime, agent loop, orchestration, DB/broker product or external lifecycle was restored. |

```text
batch = R-7_exact_seam_closure
batch_status = completed
gate_status = pass
gate_reason = every current foundation/store/external/entry seam now has an exact caller, implementer, request/result authority, transaction/version/page rule, error/recovery owner and durable/fake parity; the only discovered local alias conflict was resolved to canonical HubSnapshotRef
next_allowed_action = read Step 8 protocol main/annexes and L1-governance Step 8, then create R-8 protocol closure addendum
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
