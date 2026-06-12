# Step 13. 并发、幂等与重入保护

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 并发、幂等与重入保护 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~12 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md` |
| 停审方式 | 按 SOP 问题回答、并发资源、幂等键 / digest、重复处理、重入恢复和测试切口分批写入;完成后做跨 Step 7~12 闭环审计 |

## 2. 本步目标

本 Step 把 Governance 写路径、事件消费、后台 job、outbox 发布、projection / reference 维护和 handoff / export 任务中的并发、重复调用和重入恢复规则收束为可落码矩阵。

实现侧必须能从本 Step 判断:

- 哪些资源必须使用 optimistic `GovernanceVersion` 或唯一键保护。
- 哪些入口必须 reserve idempotency,哪些入口必须保持 read-only。
- Command、Inbound Event Consumer、Operations Job 的幂等键来自哪里。
- `GovernanceRequestDigest` 覆盖哪些稳定输入,明确排除哪些易变 metadata。
- duplicate same digest 如何返回 stored accepted command result / stored command rejection / consumer receipt / job report。
- same key different digest、in-flight reservation、commit status unknown、stored result missing 如何处理。
- dual publisher、projection rebuild、reference refresh、handoff/export 等 job 重入如何防止重复副作用。
- Step 16 应如何拆出并发和幂等测试切口。

本步不定义幂等记录保留期、具体 hash crate、HTTP/RPC status code、DLQ 名称、worker retry backoff、scheduler 配置、日志字段和告警规则。这些由 Step 14、Step 15、Step 16 和具体 adapter 实现承接。

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 `GovernanceOperationContext`、`GovernanceIdempotencyRecord`、`StoredGovernanceOperationResult`、`GovernanceJobReportAssembly` 和 mutable truth 对象 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 `Versioned<T>`、`GovernanceVersion`、truth repository、projection/reference/outbox/handoff repository、idempotency repository、stored result repository |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 23 个 command、14 个 query、9 个 inbound consumer、13 个 outbound event、7 个 operations job 的 public DTO 和 metadata |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / outbox / job / handoff / export 的函数级处理顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 domain 状态迁移、technical state、terminal state 和 duplicate / retry / failed disposition |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 UoW 边界、atomic save / complete 顺序、payload snapshot、projection/reference/outbox version 来源和恢复规则 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 `VersionConflict`、`IdempotencyConflict`、`DuplicateResultMissing`、`CommitStatusUnknown`、`AlreadyInProgress` 等错误映射 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已检查 | 检查幂等 key / digest / result ref / expected version / query no-write / sidecar truth 是否闭合 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 13.1 | 文件骨架、SOP 问题回答、设计原则、当前闭环诊断 | [x] 已写入 |
| 13.2 | 并发场景表、冲突资源、控制方式、失败错误、测试切口 | [x] 已写入 |
| 13.3 | 幂等键、digest 规则、23 command / 9 consumer / 7 job key matrix | [x] 已写入 |
| 13.4 | 重复处理矩阵、重入保护、commit unknown、outbox / projection / reference / handoff job 重入规则 | [x] 已写入 |
| 13.5 | 前序契约回填审计、测试切口、回填草稿、进入下一步条件 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些处理流可能并发修改同一资源? | 所有 23 个 Command 写路径都可能并发修改 Governance-owned mutable truth。9 个 Inbound Event Consumer 可能并发修改 reference state、snapshot、stale marker 和 stored consumer receipt envelope。7 个 Operations Job 可能并发修改 outbox publication state、projection state/body、reference state、reconciliation report、handoff/export marker 和 stored job report。Query 只读,不得参与写并发。 |
| 哪些接口、事件或 job 可能被重复调用? | 所有 Command 可能因客户端超时 / retry 重复。所有 Inbound Event 可能因 event bus redelivery / upstream ack 丢失重复。所有 Operations Job 可能因 scheduler rerun、worker crash、operator retry 重复。Outbound publisher 可能由多个 worker 同时处理同一 pending outbox record。 |
| 幂等键来自请求、事件、job 参数还是数据库唯一约束? | Command 幂等键来自 `CommandMetadata` 归一化后的 `GovernanceOperationIdempotencyKey`;Inbound Event 幂等键来自 `GovernanceInboundEventEnvelope.dedup_key`,并且只能通过 `GovernanceOperationContext::from_inbound_event(...)` 归一化;Job 幂等键来自 `GovernanceJobMetadata.idempotency_key`。数据库唯一键只保护 business uniqueness 或 storage uniqueness,不能替代 stored result replay。Outbox per-record publish 使用 `GovernanceOutboxRef + GovernanceVersion`,不使用 public idempotency key。 |
| 重复请求应该返回既有结果、跳过、覆盖还是报错? | same operation + same key + same digest + completed 时必须读取 stored accepted command result / stored command rejection / consumer receipt envelope / job report 并返回既有 surface。same key + different digest 必须返回 `IdempotencyConflict`。same key still reserved / in-flight 必须返回 retryable unavailable / delayed,不得并发执行第二次 mutation。Query 重复读取只返回当前 authorized read surface,不写幂等记录。 |
| 并发冲突如何测试? | Step 16 必须覆盖 optimistic version conflict、business unique conflict、duplicate same digest replay、same key different digest conflict、in-flight reservation、stored result missing、commit unknown retry、event redelivery、dual outbox publisher、projection stale vs rebuild、reference refresh race、handoff/export retry 和 job partial rerun。 |

## 6. 设计原则

| 原则 | 正式口径 |
|---|---|
| operation namespace | 幂等唯一键为 `operation_name + idempotency_key`,不同 operation 可以复用同一 raw key 字符串,不得互相判 duplicate。 |
| stable digest | `GovernanceRequestDigest` 只覆盖会改变业务结果的稳定输入,用于区分 same request 与 key reuse conflict。 |
| volatile metadata exclusion | digest 不包含 request id、requested_at、trace id、job run id、transport header、delivery attempt、retry counter、随机 id 或当前时间。 |
| stored replay | duplicate same digest 必须读取 `StoredGovernanceResultRepository.get_command_result/get_command_rejection/get_consumer_receipt/get_job_report`,不得从 current truth / current projection / pending outbox 重新计算。 |
| in-flight no second writer | 同 operation/key 处于 reserved 或 already-in-progress 时,第二个调用不得进入 domain transition / resolver / publisher / job body。 |
| optimistic update | 所有 mutable truth、projection/reference/outbox/handoff marker 更新必须使用正式 `Versioned<T>` 读取到的 `GovernanceVersion`。 |
| append-only side effects | trace、history、audit record、outbox append 是 accepted transaction 的 append-only side effect,不得通过覆盖旧 record 实现并发保护。 |
| query no-write | Query 不 reserve idempotency、不 append trace、不 mark stale、不 refresh snapshot、不 rebuild projection、不 repair report。 |
| job no truth repair | Operations Job 只能维护 outbox / projection / reference / report / handoff/export marker,不得修复 core Governance truth。 |
| missing sidecar no recompute | completed idempotency missing stored result、outbox payload snapshot missing、marker trace missing 等是一致性缺陷,不得临时回查 current truth 重建。 |

## 7. 当前闭环诊断

| 检查项 | 结论 | 依据 |
|---|---|---|
| idempotency reserve surface | 通过 | Step 7 `GovernanceIdempotencyRepository.reserve(...)` 返回 `Reserved` / `Duplicate(result_ref)` / `Conflict` |
| stored result replay surface | 通过 | Step 7 `StoredGovernanceResultRepository.get_command_result/get_command_rejection/get_consumer_receipt/get_job_report` |
| result save before complete | 通过 | Step 9 / Step 11 要求 same UoW 内先保存 stored result,再 `complete` idempotency |
| in-flight reservation | 通过 | Step 12 `IdempotencyError::AlreadyInProgress` 映射为 delayed / temporarily unavailable |
| command truth version | 通过 | Step 7 truth repositories 均提供 `get_*_with_version` 和 `save(... expected_version ...)` |
| reference refresh version | 通过 | Step 7 `ReferenceSnapshotRepository.get_reference_state_with_version` 和 versioned `list_reference_states` |
| outbox publish version | 通过 | Step 7 `list_pending_with_payload` 返回 `Versioned<GovernanceOutboxPendingItem>` |
| projection affected views | 通过 | Step 7 `list_views_affected_by_truth_change` / `list_views_affected_by_references` |
| handoff marker version | 通过 | Step 7 `GovernanceHandoffRepository.get_with_version` / `save_marker(... expected_version ...)` |
| commit unknown recovery | 有口径 | Step 12 已要求 must idempotency-check;本 Step 细化 retry 顺序 |

## 8. 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 同一 Command 被客户端并发重试 | `idempotency_records(operation_name,key)` | atomic reserve + digest compare | `AlreadyInProgress` / `IdempotencyConflict` | `TC-GVN-IDEM-001` / `TC-GVN-IDEM-002` |
| `CreateGovernanceContextFlow` 并发创建同一 subject/source active context | `GovernanceContext` active index, context id | idempotency first;business uniqueness on active `(subject_ref, source_ref)` when policy requires | unique conflict / domain rejected | `TC-GVN-CONC-CONTEXT-001` |
| `SubmitGovernanceInputFlow` 与 context lifecycle 并发 | `GovernanceContext.version`, `GovernanceInput` membership | context versioned read;input create in same UoW | `VersionConflict` / `DomainRejected` | `TC-GVN-CONC-INPUT-001` |
| `UpdateGovernanceInputStateFlow` 并发 accept/reject/supersede | `GovernanceInput.version` | `get_with_version(input_ref)` + expected version save | `VersionConflict` / invalid transition | `TC-GVN-CONC-INPUT-002` |
| `OpenGovernanceGateFlow` 并发为同 context/kind 开 gate | `Gate` active index, `GovernanceContext.version` | context expected version + open gate uniqueness | conflict / domain rejected | `TC-GVN-CONC-GATE-001` |
| `RecordGovernanceDecisionFlow` 并发记录同 gate decision | `Gate.version`, `GovernanceDecision` current-by-gate index | gate expected version + current decision uniqueness | `VersionConflict` / domain rejected | `TC-GVN-CONC-DECISION-001` |
| `SupersedeGovernanceDecisionFlow` 并发 supersede 同 decision | `GovernanceDecision.version`, next decision id/current index | current decision expected version + new decision append | `VersionConflict` | `TC-GVN-CONC-DECISION-002` |
| `AssignApprovalResponsibilityFlow` 并发创建/追加责任链 | `ApprovalResponsibility`, `ResponsibilityChain.version` | responsibility create uniqueness + chain expected version | conflict / `VersionConflict` | `TC-GVN-CONC-APPROVAL-001` |
| `RecordApprovalVoteFlow` 并发投票 / 重投票 | `ApprovalResponsibility.version`, optional `ResponsibilityChain.version` | responsibility expected version + vote state matrix | `VersionConflict` / invalid transition | `TC-GVN-CONC-APPROVAL-002` |
| `DelegateApprovalResponsibilityFlow` 并发 delegate / vote | `ApprovalResponsibility.version` | expected version + state matrix | `VersionConflict` / invalid transition | `TC-GVN-CONC-APPROVAL-003` |
| `ActivatePolicyEffectiveFactFlow` 并发激活同 method policy / scope | `PolicyEffectiveFact` comparable active index, conflict records | policy fact create uniqueness + conflict detection in same UoW | unique conflict / pending conflict | `TC-GVN-CONC-POLICY-001` |
| `UpdatePolicyEffectiveFactStateFlow` 并发 suspend/supersede/retire | `PolicyEffectiveFact.version`, conflict records | expected version + state matrix | `VersionConflict` | `TC-GVN-CONC-POLICY-002` |
| `UpdateSharedRuleSetFlow` 并发更新同 scope rule set | `SharedRuleSet.version`, active-by-scope index | rule set expected version + active index | `VersionConflict` / unique conflict | `TC-GVN-CONC-RULE-001` |
| `ResolvePolicyConflictFlow` 并发 resolve/waive/invalidate | `PolicyConflictRecord.version`, optional `Gate.version` / decision ref | conflict expected version + formal decision guard | `VersionConflict` / domain rejected | `TC-GVN-CONC-CONFLICT-001` |
| `AssessControlApplicabilityFlow` 并发 assessment 同 context/control snapshot | `ControlApplicability.version`, active applicability index | active uniqueness + expected version for existing record | conflict / `VersionConflict` | `TC-GVN-CONC-CONTROL-001` |
| `RecordControlReviewFlow` 并发 review state update | `ControlReview.version`, `ControlApplicability.version` | review expected version + applicability guard | `VersionConflict` / invalid transition | `TC-GVN-CONC-CONTROL-002` |
| `SubmitAIIAConclusionFlow` / `SubmitSoAConclusionFlow` 并发创建同 context/artifact branch | `AIIAConclusion` / `SoAConclusion` active index | conclusion uniqueness + same UoW submit transition | conflict / domain rejected | `TC-GVN-CONC-COMPLIANCE-001` |
| `ApproveComplianceConclusionFlow` 并发 approve/reject/revoke | `AIIAConclusion.version` / `SoAConclusion.version` | branch-specific expected version + state matrix | `VersionConflict` | `TC-GVN-CONC-COMPLIANCE-002` |
| `RaiseNonconformityFlow` 并发基于同 source signal raise | `NonconformityRecord` source index | source uniqueness when formal source is unique;idempotency otherwise | conflict / duplicate replay | `TC-GVN-CONC-NC-001` |
| `ConfirmNonconformityCauseFlow` 并发确认不同 cause | `NonconformityRecord.version` | expected version + state matrix | `VersionConflict` | `TC-GVN-CONC-NC-002` |
| `PlanCorrectiveActionFlow` 并发计划 active action | `NonconformityRecord.version`, active `CorrectiveAction` index | record expected version + active action uniqueness | `VersionConflict` / domain rejected | `TC-GVN-CONC-ACTION-001` |
| `CompleteCorrectiveActionFlow` 并发 start/complete/cancel/fail | `CorrectiveAction.version`, optional `NonconformityRecord.version` | action expected version;record expected version when moving to verification | `VersionConflict` | `TC-GVN-CONC-ACTION-002` |
| `VerifyNonconformityFlow` 并发 verify / close | `VerificationResult` id, `NonconformityRecord.version` | verification append + record expected version for passed closure | `VersionConflict` | `TC-GVN-CONC-VERIFY-001` |
| inbound event redelivery | `idempotency_records(consumer_name,dedup_key)`, reference state | event dedup + digest;reference expected version | duplicate replay / `IdempotencyConflict` | `TC-GVN-EVENT-DEDUP-001` |
| two consumers update same reference state | `ReferenceResolutionState.version`, typed snapshot key | `get_reference_state_with_version` / versioned list + expected version | `VersionConflict` / delayed | `TC-GVN-REF-CONC-001` |
| command reads stale external snapshot while consumer refreshes | reference state, actor/method/evidence/process/work/runtime snapshot | command guard uses loaded state;consumer writes state/stale marker in own UoW | dependency unavailable / version conflict | `TC-GVN-REF-CONC-002` |
| accepted command stale marker vs projection rebuild | `DerivedGovernanceViewState.version`, cursor | `mark_stale` uses formal affected view list + cursor monotonicity | version conflict / older cursor no-op | `TC-GVN-PROJ-CONC-001` |
| two rebuild jobs update same projection | projection view body/state, idempotency record | job idempotency + projection expected version | duplicate report / `VersionConflict` | `TC-GVN-PROJ-CONC-002` |
| dual outbox publisher | `GovernanceOutboxRecord.publication_state/version` | pending item version passed to `mark_published/mark_failed/mark_dead_lettered` | version conflict treated as item conflict/skipped | `TC-GVN-OUTBOX-CONC-001` |
| publisher sees missing payload snapshot | outbox payload sidecar | do not rebuild payload;mark failed/dead-letter by outbox version when allowed | `ConsistencyDefect` item failure | `TC-GVN-OUTBOX-CONC-002` |
| reference refresh job races consumer update | reference state / snapshot version | versioned reference list + expected version save | item `VersionConflict`, partial report | `TC-GVN-JOB-REF-001` |
| reconciliation runs while truth changes | reconciliation report only | report captures scope/cursor;does not write truth | stale report finding / partial | `TC-GVN-RECON-CONC-001` |
| trace handoff / archive / external GRC export retried | `GovernanceHandoffMarker.version`, marker unique key | job idempotency + marker expected version + target/handoff identity | duplicate report / version conflict / failed marker | `TC-GVN-HANDOFF-CONC-001` |

## 9. 幂等键与 digest 总规则

### 9.1 统一 key 规则

| 入口类型 | operation source | raw key source | normalized key | duplicate result source |
|---|---|---|---|---|
| Command | Step 8 `Operation name` | `CommandMetadata` idempotency key | `GovernanceOperationIdempotencyKey` | `StoredGovernanceResultRepository.get_command_result(result_ref)` or `get_command_rejection(result_ref)` by stored kind |
| Inbound Event Consumer | `GovernanceInboundConsumerName` | `GovernanceInboundEventEnvelope.dedup_key` normalized by `GovernanceOperationContext::from_inbound_event(...)` | `GovernanceOperationIdempotencyKey` | `StoredGovernanceResultRepository.get_consumer_receipt(result_ref).receipt` |
| Operations Job | `GovernanceOperationsJobKind` / `GovernanceOperationName` | `GovernanceJobMetadata.idempotency_key` | `GovernanceOperationIdempotencyKey` | `StoredGovernanceResultRepository.get_job_report(result_ref)` |
| Query | query operation name only for observability | none | none | none;read current authorized surface |
| Outbox per-record publish | outbox record identity | `GovernanceOutboxRef` + pending item `GovernanceVersion` | not idempotency store | outbox state/version check |

### 9.2 `GovernanceRequestDigest` canonical input

| Include | Exclude |
|---|---|
| operation name / channel | idempotency key |
| route-bound resource refs | request id / event delivery id / job run id |
| trusted actor ref and effective authority scope when it changes semantics | trace id / trace context random ids |
| command request DTO stable fields | requested_at / received_at / current time |
| inbound source event ref, source ref, schema version, source version ref, payload digest / snapshot refs | transport headers / bus offset / delivery attempt |
| job kind, job input scope, page, explicit refs, target refs, policy/config refs that affect output | worker retry counter / scheduler attempt counter |
| expected version when the command DTO / flow requires it as semantic guard | generated truth ids created after reservation |
| body-free snapshot refs and digest refs | external body, artifact body, method body, process/work/runtime body |

Digest v1 must use deterministic field ordering and stable enum variant names. `None` vs omitted must be normalized by DTO validation before digest calculation. Digest value must be body-free and redacted;it is not an authorization token and must not be used as a visibility decision.

## 10. Command 幂等键表

| Command | 幂等键 | Digest stable input | 重复请求处理 |
|---|---|---|---|
| `CreateGovernanceContext` | `CommandMetadata` key | actor effective scope、`subject_ref`、`source_ref` | stored `GovernanceContextCommandResult`;no second context |
| `SubmitGovernanceInput` | `CommandMetadata` key | actor scope、`context_ref`、`input_kind`、`source_ref` | stored `GovernanceInputCommandResult`;no duplicate input |
| `UpdateGovernanceInputState` | `CommandMetadata` key | actor scope、`input_ref`、`target_state`、`pending_evidence_ref`、`reject_reason`、`superseded_by`、expected version when present | stored `GovernanceInputCommandResult` |
| `OpenGovernanceGate` | `CommandMetadata` key | actor scope、`context_ref`、`gate_kind`、`approver_requirement_intent`、expected version when present | stored `GateCommandResult`;no second open gate for same accepted request |
| `RecordGovernanceDecision` | `CommandMetadata` key | actor scope、`gate_ref`、`decision_kind`、`outcome_ref`、`finalization_intent`、expected version when present | stored `GovernanceDecisionCommandResult` |
| `SupersedeGovernanceDecision` | `CommandMetadata` key | actor scope、`current_decision_ref`、`next_decision_kind`、`next_outcome_ref`、`next_finalization_intent`、expected version when present | stored `GovernanceDecisionCommandResult` |
| `AssignApprovalResponsibility` | `CommandMetadata` key | actor scope、`context_ref`、`requirement_intent`、`actor_ref`、`chain_ref`、expected version when present | stored `ApprovalResponsibilityCommandResult` |
| `RecordApprovalVote` | `CommandMetadata` key | actor scope、`responsibility_ref`、`vote`、`evidence_ref`、expected version when present | stored `ApprovalResponsibilityCommandResult` |
| `DelegateApprovalResponsibility` | `CommandMetadata` key | actor scope、`responsibility_ref`、`delegate_actor_ref`、`delegation_reason`、expected version when present | stored `ApprovalResponsibilityCommandResult` |
| `ActivatePolicyEffectiveFact` | `CommandMetadata` key | actor scope、`policy_snapshot` ref/state/digest fields、`subject_ref`、`scope_ref`、`priority`、`activation_intent` | stored `PolicyCommandResult` |
| `UpdatePolicyEffectiveFactState` | `CommandMetadata` key | actor scope、`policy_fact_ref`、`update_intent` including snapshot/reason/next ref、expected version when present | stored `PolicyCommandResult` |
| `UpdateSharedRuleSet` | `CommandMetadata` key | actor scope、`rule_set_ref`、`subject_ref`、`scope_ref`、`update_intent` including rule/reason、expected version when present | stored `SharedRuleCommandResult` |
| `ResolvePolicyConflict` | `CommandMetadata` key | actor scope、`conflict_ref`、`resolution_intent` including gate/decision/reason、expected version when present | stored `PolicyConflictCommandResult` |
| `AssessControlApplicability` | `CommandMetadata` key | actor scope、`context_ref`、`control_snapshot` ref/state/digest fields、`assessment_intent` | stored `ControlCommandResult` |
| `RecordControlReview` | `CommandMetadata` key | actor scope、`review_ref`、`applicability_ref`、`review_intent` including reviewer/evidence/reason/decision/next ref、expected version when present | stored `ControlReviewCommandResult` |
| `SubmitAIIAConclusion` | `CommandMetadata` key | actor scope、`context_ref`、`artifact_ref`、`submission_intent` | stored accepted `ComplianceConclusionCommandResult` or stored rejected `GovernanceProtocolRejection` |
| `SubmitSoAConclusion` | `CommandMetadata` key | actor scope、`context_ref`、`artifact_ref`、`control_coverage_ref`、`submission_intent` | stored accepted `ComplianceConclusionCommandResult` or stored rejected `GovernanceProtocolRejection` |
| `ApproveComplianceConclusion` | `CommandMetadata` key | actor scope、`conclusion_ref`、`approval_intent` including decision/reason、expected version when present | stored `ComplianceConclusionCommandResult` |
| `RaiseNonconformity` | `CommandMetadata` key | actor scope、`context_ref`、`severity`、`source_ref`、`owner_ref` | stored `NonconformityCommandResult` |
| `ConfirmNonconformityCause` | `CommandMetadata` key | actor scope、`nonconformity_ref`、`cause_ref`、expected version when present | stored `NonconformityCommandResult` |
| `PlanCorrectiveAction` | `CommandMetadata` key | actor scope、`nonconformity_ref`、`owner_ref`、`work_ref`、expected version when present | stored `CorrectiveActionCommandResult` |
| `CompleteCorrectiveAction` | `CommandMetadata` key | actor scope、`action_ref`、`update_intent` including evidence/reason、expected version when present | stored `CorrectiveActionCommandResult` |
| `VerifyNonconformity` | `CommandMetadata` key | actor scope、`nonconformity_ref`、`evidence_ref`、`verification_state`、`verifier_ref`、expected version when present | stored `NonconformityCommandResult` |

## 11. Inbound Event Consumer 幂等键表

| Consumer | 幂等键 | Digest stable input | 重复请求处理 |
|---|---|---|---|
| `ConsumeIdentityActorCapabilityChanged` | `GovernanceInboundEventEnvelope.dedup_key` | source family、source event ref、source ref、schema version、source version ref、actor snapshot ref/state/digest fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不重写 snapshot |
| `ConsumeProcessGovernanceContextChanged` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、process context ref/state fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不重写 process context snapshot |
| `ConsumeWorkGovernanceContextChanged` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、work context ref/state fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不重写 work context snapshot |
| `ConsumeArtifactEvidenceChanged` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、evidence summary ref / artifact ref digest fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不重写 evidence summary |
| `ConsumeMethodPolicyDefinitionChanged` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、method policy snapshot ref/scope/state/digest fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不重写 policy snapshot |
| `ConsumeMethodControlDefinitionChanged` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、method control snapshot ref/state/digest fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不重写 control snapshot |
| `ConsumeRuntimeSignalRecorded` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、runtime signal ref/state fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不创建 core truth |
| `ConsumeConversationContextChanged` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、conversation context ref/state digest fields | stored `GovernanceConsumerReceiptEnvelope.receipt`;不保存 transcript body |
| `ConsumeObservabilityAlertRaised` | envelope dedup key | source family、source event ref、source ref、schema version、source version ref、alert/runtime signal body-free refs and state markers | stored `GovernanceConsumerReceiptEnvelope.receipt`;不保存 alert body / stack trace |

Unsupported schema version must return `UnsupportedVersion` receipt without parsing payload and without reserving a digest that depends on payload body. If the envelope has no source event ref or dedup key, the worker rejects before snapshot / stale marker writes.

## 12. Operations Job 幂等键表

| Job | 幂等键 | Digest stable input | 重复请求处理 |
|---|---|---|---|
| `PublishGovernanceOutbox` | `GovernanceJobMetadata.idempotency_key` | actor scope、job kind、`PublishGovernanceOutboxJobInput.page` and publish config refs that affect item selection | stored `GovernanceJobReport`;不重新 list pending、不重新 publish |
| `RebuildGovernanceProjections` | job metadata key | actor scope、scope ref、projection set、page/from cursor fields | stored `GovernanceJobReport`;不重新 rebuild |
| `RefreshExternalContextSnapshots` | job metadata key | actor scope、refresh scope, explicit refs / unhealthy / governance scope, page | stored `GovernanceJobReport`;不重新 resolve |
| `RunGovernanceReconciliation` | job metadata key | actor scope、`GovernanceReconciliationInput`, inspected view/outbox/reference/report refs, cursor/scope fields | stored `GovernanceJobReport`;不重新 produce report |
| `PrepareGovernanceTraceHandoff` | job metadata key | actor scope、trace refs、target ref | stored `GovernanceJobReport`;不重新 deliver handoff |
| `PrepareGovernanceArchiveHandoff` | job metadata key | actor scope、trace refs、report refs、target ref | stored `GovernanceJobReport`;不重新 deliver archive |
| `PrepareExternalGrcExport` | job metadata key | actor scope、truth snapshot ref/digest fields、target ref | stored `GovernanceJobReport`;不重新 export |

Job duplicate replay must not enter the job body. It must not scan outbox, rebuild projection, refresh external context, rerun reconciliation, redeliver handoff, or regenerate export package.

## 13. 重复处理矩阵

| Existing state / reserve outcome | Incoming digest | Service 行为 | 对外结果 |
|---|---|---|---|
| no existing record | any valid digest | `reserve` -> `Reserved`;继续正常 flow | success、normal rejection 或 retryable failure |
| existing completed same operation/key | same digest | `reserve` -> `Duplicate(result_ref)`;rollback current UoW;read stored surface by operation kind and result kind | replay stored accepted command result / stored command rejection / consumer receipt envelope receipt / job report |
| existing completed same operation/key | different digest | `reserve` -> `Conflict` or mapped `IdempotencyConflict`;no domain/job body | conflict;caller must use original request or new key |
| existing reserved / in-flight same operation/key | same digest | `reserve` returns `IdempotencyError::AlreadyInProgress` or mapped unavailable;no mutation | retry later / delayed |
| existing reserved / in-flight same operation/key | different digest | no mutation;record conflict if repository returned idempotency ref and UoW permits | `IdempotencyConflict` |
| completed but stored result missing | same digest | do not recompute;raise `DuplicateResultMissing` / `ConsistencyDefect` | temporarily unavailable / degraded + operations intervention |
| completed result wrong kind | same digest | do not cast or rebuild;raise `DuplicateResultMissing` | temporarily unavailable / degraded |
| idempotency store unavailable | any | no business write | dependency unavailable / retry later |
| query repeated | n/a | no idempotency record;perform normal authorized read | current read surface |
| outbox publish second worker | n/a | item version conflict or already published;do not alter truth | item skipped/failed in report |

## 14. 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command handler timeout after accepted commit | client retry with same key | completed idempotency points to stored command result | replay stored accepted result;do not append new trace/outbox |
| Command handler timeout after save-before rejected commit | client retry with same key | completed idempotency points to stored command rejection | replay stored rejected outcome;do not rerun resolver/policy and do not write truth/trace/outbox/stale |
| Command retry while first execution in-flight | parallel client retry | `AlreadyInProgress` / reserved same key | return temporarily unavailable;caller retries same key later |
| Command same key with changed body | client bug / replay drift | digest mismatch | `IdempotencyConflict`;no truth write |
| Command UoW commit status unknown | connection drop / store unknown | retry same key;reserve outcome and stored result decide | duplicate -> replay;in-flight -> unavailable;no blind domain rerun |
| Stored result save fails before idempotency complete | repository failure | same UoW rollback | retry same key after rollback;no completed record without result |
| Idempotency complete fails after result save within UoW | repository failure | same UoW rollback or commit unknown handling | retry same key;inspect reserve outcome;manual if unknown |
| Inbound event redelivery | event bus at-least-once | dedup key + digest + stored consumer receipt envelope | duplicate receipt replay;no snapshot/stale rewrite |
| Inbound event same dedup key different payload | upstream defect | digest conflict | rejected/dead-letter;no snapshot overwrite |
| Unsupported event version redelivered | unsupported schema | version checked before payload parse | return unsupported receipt;no mutation |
| Publish job worker crash after partial item handling | worker crash / scheduler rerun with new key | per item outbox version + publication state | new job scans remaining pending/failed retryable records;old key returns old report |
| Publish job duplicate same key | scheduler duplicate | job idempotency + stored report | report replay;no publish call |
| Publisher publish succeeded but mark_published failed | external side effect uncertain | outbox remains pending/failed;event id/outbox ref must support downstream dedup | later job may republish;truth not changed |
| Projection rebuild crash | worker crash | projection state/freshness marker + job key | new job rebuilds from committed truth;duplicate key returns old report |
| Projection stale marker races rebuild | command accepted while rebuild running | cursor monotonicity + view state version | stale marker with newer cursor wins;older rebuild cannot mark fresh over newer cursor |
| Reference refresh partial failure | resolver / worker failure | per reference state version and failed refs | new job retries failed refs;successful snapshots preserved |
| Reconciliation job rerun | scheduler/operator | job idempotency for duplicate;report is read-only output | duplicate returns stored report;new key computes current drift but does not repair truth |
| Trace / archive / external GRC handoff retry | adapter failure / operator retry | marker identity, marker version, job idempotency | retry updates marker state with expected version;delivered marker not duplicated |
| Handoff/export duplicate same key | scheduler duplicate | stored job report replay | no re-delivery to target |

## 15. `CommitStatusUnknown` 重入口径

`CommitStatusUnknown` 表示 UnitOfWork adapter 无法确认 durable commit 是否已应用。任何 handler / runner 都不得用新 idempotency key 盲重试,也不得在返回前执行补偿发布或补偿 truth mutation。

Retry / audit sequence:

```text
Input: operation_name, idempotency_key, original stable GovernanceRequestDigest

1. Retry with the same operation_name + idempotency_key + stable digest.
2. Rebuild the original `GovernanceOperationContext` from the same command / inbound event / job metadata, then call `GovernanceIdempotencyRepository.reserve(context, digest, uow)`.
3. If reserve returns Duplicate(result_ref):
     rollback current UoW;
     load stored accepted command result / command rejection / consumer receipt envelope / job report by operation kind and stored kind;
     return replay if present and correct kind.
4. If reserve returns Conflict:
     return IdempotencyConflict;do not mutate.
5. If reserve returns IdempotencyError::AlreadyInProgress or dependency unavailable:
     return retryable unavailable;do not mutate.
6. If reserve returns Reserved after an unknown previous attempt:
     continue only when adapter-specific audit confirms the previous UoW did not commit.
     P0 default is to return temporarily unavailable and require reconciliation rather than blind mutation.
7. If stored result is missing or wrong kind:
     raise DuplicateResultMissing / ConsistencyDefect;do not reconstruct from current truth.
```

P0 的正式能力是只读审计 + 拒绝盲重试。自动修复 `Reserved` unknown、清理 stuck reservation 或合成 missing result 需要新的 durable repair contract,不得由实现侧自行补。

## 16. Outbox / projection / reference / handoff 细化规则

### 16.1 Outbox publication

| 规则 | 口径 |
|---|---|
| pending scan | `GovernanceOutboxRepository.list_pending_with_payload(page)` 返回 `Versioned<GovernanceOutboxPendingItem>` |
| payload source | publisher 只读取 stored `GovernanceOutboxPayloadSnapshot`;不得回查 current truth |
| success marker | `mark_published(outbox_ref, publication_ref, expected_version, uow)` 使用 pending item version |
| retryable failure | `mark_failed(outbox_ref, failure_reason, expected_version, uow)` 使用 pending item version |
| fatal failure | `mark_dead_lettered(outbox_ref, reason, expected_version, uow)` 使用 pending item version |
| dual worker | 第二 worker 的 expected_version mismatch 只影响 item report,不得创建新 event 或改 truth |
| missing snapshot | consistency defect;不得 rebuild payload;按 Step 12/17.4 进入 failed/dead-letter/report |

### 16.2 Projection stale / rebuild

| 规则 | 口径 |
|---|---|
| affected views | 只能来自 Step 7 formal list methods,不得拼接 ad hoc `DerivedGovernanceViewRef` |
| stale marker | command / consumer accepted path 使用 truth/reference cursor mark stale |
| rebuild source | rebuild job 只从 committed Governance truth snapshot / formal projection source 读 |
| cursor monotonicity | older cursor cannot overwrite newer fresh/stale state |
| query behavior | query 只返回 freshness/degraded marker,不得触发 rebuild |

### 16.3 Reference snapshot refresh

| 规则 | 口径 |
|---|---|
| scope expansion | `ReferenceSnapshotRepository.list_reference_states(refresh_scope, page)` 或 Step 7 等价正式读取面 |
| version source | each item uses `Versioned<ReferenceResolutionState>.version` |
| save rule | refresh success/failure uses expected version;conflict becomes item-level failure/delayed |
| body boundary | resolver returns only refs/summaries/source version/digest/snapshot state;forbidden body rejects item |
| duplicate job | stored job report replay;does not resolve refs again |

### 16.4 Handoff / archive / external GRC export

| 规则 | 口径 |
|---|---|
| marker identity | marker ref and target ref are formal body-free refs;delivery body/package is not stored in Governance truth |
| trace_refs | marker trace refs must follow Step 10 non-empty rule,including external GRC export marker |
| state update | delivered/failed/cancelled marker updates use marker expected version |
| retry | retry same job key returns stored report;operator retry with new key reloads marker by ref/version |
| no duplicate delivery | delivered marker cannot be delivered again by same marker state transition;adapter should also use marker/ref as external idempotency token |

## 17. 并发与幂等测试切口

| 测试切口 | 覆盖点 | 建议测试类型 |
|---|---|---|
| `TC-GVN-IDEM-001` | command same key same digest returns stored accepted command result or stored command rejection;no new truth/trace/outbox/stale | application service |
| `TC-GVN-IDEM-002` | command same key different digest returns `IdempotencyConflict`;no domain call | application service |
| `TC-GVN-IDEM-003` | in-flight same key maps to temporarily unavailable;no second mutation | idempotency fake |
| `TC-GVN-IDEM-004` | digest excludes request id、trace id、requested_at、job run id | contract unit |
| `TC-GVN-IDEM-005` | same raw key on different operation does not cross-replay result | application service |
| `TC-GVN-DUP-RESULT-001` | completed idempotency with missing/wrong result returns `DuplicateResultMissing`;no recompute | result store fake |
| `TC-GVN-COMMIT-UNKNOWN-001` | retry after commit unknown uses same key and reserve/result replay before mutation | service + fake UoW |
| `TC-GVN-CONC-TRUTH-001` | stale `GovernanceVersion` on mutable truth returns version conflict | repository fake |
| `TC-GVN-CONC-TRUTH-002` | active unique key conflict does not overwrite existing truth | repository fake |
| `TC-GVN-EVENT-DEDUP-001` | event redelivery same digest returns stored `GovernanceConsumerReceiptEnvelope.receipt`;no snapshot/stale rewrite | consumer service |
| `TC-GVN-EVENT-DEDUP-002` | event same dedup key different digest rejected/dead-lettered | consumer service |
| `TC-GVN-EVENT-UNSUPPORTED-001` | unsupported version does not parse payload and does not mark stale | worker contract |
| `TC-GVN-OUTBOX-CONC-001` | dual publisher only one versioned publication marker succeeds | outbox fake + job service |
| `TC-GVN-OUTBOX-CONC-002` | payload snapshot missing is consistency defect;publisher does not rebuild from truth | outbox fake |
| `TC-GVN-PROJ-CONC-001` | older cursor cannot overwrite newer projection state | projection fake |
| `TC-GVN-PROJ-IDEM-001` | duplicate rebuild job returns stored report;does not rebuild | job service |
| `TC-GVN-REF-CONC-001` | reference refresh race preserves existing state and reports item conflict | reference fake |
| `TC-GVN-REF-IDEM-001` | duplicate refresh job returns stored report;does not call resolver | job service |
| `TC-GVN-RECON-IDEM-001` | duplicate reconciliation job returns stored report;new key recomputes report without truth repair | job service |
| `TC-GVN-HANDOFF-CONC-001` | delivered marker cannot be delivered twice under versioned transition | handoff fake |
| `TC-GVN-HANDOFF-IDEM-001` | duplicate handoff/export job returns stored report;does not redeliver | job service |
| `TC-GVN-QUERY-NOWRITE-001` | repeated query performs no idempotency,trace,stale,refresh or rebuild write | query service |

## 18. 前序契约回填审计

| 前序 Step | 审计结论 | 是否需要回填 |
|---|---|---|
| Step 6 object contracts | `GovernanceOperationIdempotencyKey`、`GovernanceRequestDigest`、`GovernanceIdempotencyRecord`、`StoredGovernanceOperationResult`、`GovernanceJobReportAssembly` 已闭合;digest 算法由本 Step 细化 | 不需要 |
| Step 7 ports | idempotency reserve/complete/conflict、stored result get/save、versioned truth/projection/reference/outbox/handoff 读取面已闭合 | 不需要 |
| Step 8 protocol | Command/Consumer/Job metadata 均提供幂等键来源;Query 明确 no-write;Job duplicate 有 stored report surface | 不需要 |
| Step 9 flows | shared command / consumer / job templates 已按 reserve -> duplicate replay -> mutation -> stored result -> complete 排序 | 不需要 |
| Step 10 state matrix | illegal transition、technical states、handoff marker trace refs、duplicate/retry disposition 已能承接本 Step | 不需要 |
| Step 11 persistence | UoW 顺序、version 来源、payload snapshot、projection/reference/outbox consistency 已闭合 | 不需要 |
| Step 12 error recovery | `AlreadyInProgress`、`DuplicateResultMissing`、`CommitStatusUnknown`、`IdempotencyConflict` 已有错误映射;本 Step 只细化重入顺序 | 不需要 |

## 19. 回填草稿

> 校准来源:
> - `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
>
> 延伸阅读:
> - Step 7 `GovernanceIdempotencyRepository` / `StoredGovernanceResultRepository`
> - Step 8 Command / Inbound Event / Operations Job metadata
> - Step 11 UoW、version、outbox payload snapshot 和 projection/reference consistency
> - Step 12 duplicate、version conflict、commit unknown 和 consistency defect 映射

### 5.12 并发、幂等与重入保护

Governance 写路径使用三层保护:

1. `GovernanceIdempotencyRepository.reserve(context, request_digest, uow)` 对 command、inbound event consumer 和 operations job 做 atomic reserve;repository 必须从 `GovernanceOperationContext` 复制 `channel`、`operation_name` 和 `idempotency_key`,不得由 caller 另行传入或硬编码。
2. `GovernanceRequestDigest` 区分 same request duplicate 与 same key different payload conflict。
3. Repository `Versioned<T>` / `GovernanceVersion`、formal unique key 和 cursor monotonicity 防止并发覆盖 mutable truth、projection、reference、outbox 和 handoff marker。

Command 幂等键来自 `CommandMetadata` 归一化后的 `GovernanceOperationIdempotencyKey`。Inbound Event 幂等键来自 `GovernanceInboundEventEnvelope.dedup_key`,并且只能通过 `GovernanceOperationContext::from_inbound_event(...)` 归一化为 application idempotency key。Operations Job 幂等键来自 `GovernanceJobMetadata.idempotency_key`。Query 不写幂等记录。Outbound per-record publish 不使用 application idempotency store,而是用 `GovernanceOutboxRef + GovernanceVersion` 控制 publication state。

Digest 只包含稳定业务输入:operation name、route-bound refs、trusted actor effective scope、command DTO fields、event source refs / schema version / payload digest、job input scope / page / target refs 和 expected version when semantically required。Digest 不得包含 idempotency key、request id、requested_at、trace id、job run id、transport header、delivery attempt、retry counter、随机 id、当前时间或外部正文。

重复处理规则:

| 情况 | 结果 |
|---|---|
| same operation + same key + same digest + completed | 读取 stored accepted command result / command rejection / consumer receipt envelope / job report 并 replay;consumer 返回 envelope.receipt;不重跑 mutation/job/publisher |
| same operation + same key + same digest + in-flight | 返回 retryable unavailable / delayed;不执行第二个 writer |
| same operation + same key + different digest | `IdempotencyConflict`;不写 business truth、snapshot、outbox 或 marker |
| completed idempotency missing stored result | `DuplicateResultMissing` / consistency defect;不得从 current truth 重建 result |
| dual outbox publisher | pending item version 决定单 winner;version conflict 进入 item report,不改 truth |
| repeated query | no-write read;返回当前 authorized surface |

## 20. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 并发场景是否覆盖 mutable truth、consumer、outbox、projection、reference、handoff/export | 通过 |
| Command / Event / Job 幂等键是否可计算 | 通过 |
| Digest 包含 / 排除字段是否明确 | 通过 |
| Duplicate / Conflict / In-flight / Missing result / Commit unknown 是否有处理口径 | 通过 |
| Query no-write 是否明确 | 通过 |
| 并发和幂等是否映射到测试切口 | 通过 |
| 是否仍需实现侧自行补 schema / port | 不需要 |

下一步进入 Step 14:配置引用与外部依赖绑定。
