# L6-bridges 06 Step8：状态事务

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step8 / 书写§5.8；回填正式06§8。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| state_tx_consistency | pass | design_static_only_external_gates_open | enter_step_9 | Step7 26独立卡；03§9完整21机/§10~12 UoW/unique/CAS/retry；§16.2/16.6/16.8；04 driver/runtime/current/rate/secret；05 state_pair_registry与STATE/LOCAL/KEY/CURSOR/RATE/RECOVERY/ENTRY具体TC。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

21状态机逐项，150合法pair/375未列有向候选；7事务/幂等/位置/限流/恢复/非递归/技术phase联合门禁。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§8已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

Step7 26独立卡；03§9完整21机/§10~12 UoW/unique/CAS/retry；§16.2/16.6/16.8；04 driver/runtime/current/rate/secret；05 state_pair_registry与STATE/LOCAL/KEY/CURSOR/RATE/RECOVERY/ENTRY具体TC。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1~2. 按05 registry镜像当前03§9的21正式enum/150pair；factory不算迁移，未列有向候选全部拒绝，还要测列内guard失败。
3. whole-U候选完整typed写集合、unique/reservation/full expected、immutable seed、audit/条件handoff，actualcommit才truth；foreign IO在tx外。
4. 六namespace/同effect/one-use/fence/rate/sharedlane、两coverage与各revision轴独立。
5~6. pure错误/driver conflict/commit unknown/foreign unknown分开，不发明InvalidStateTransition或NoIo state。
7~9. 每机字段/enum、每pair原member@flow/guard/candidate/U/no-write、副作用/TC/EV精确回指；逐项停审和跨矩阵source hash检查。

#### AC-STATE-BR-M01 可审查决策记录

- 问题/依据：M01 BridgeInstallationState / BridgeInstallation如何在03§9 M01完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及BIND的BridgeInstallation；currentinstallation/config/seams三轴与原config/local expected；state固定构造/实际hydrate；exact BridgeInstallationState=Configured/Qualified/Blocked/Suspended/Retired；12合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Configured不能因ref shape直接Qualified，Retired不复活；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M02 可审查决策记录

- 问题/依据：M02 ExternalBindingState / ExternalBinding如何在03§9 M02完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及BIND的ExternalBinding；主体/两端/directions_actions/generation/actor_basis/authorization_basis及current；exact ExternalBindingState=Pending/Active/Suspended/Revoked/Expired；9合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Pending/Active不是安装资格或owner权限；Revoked/Expired终态不得复活；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M03 可审查决策记录

- 问题/依据：M03 IdentityMappingState / ExternalIdentityMapping如何在03§9 M03完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及MAP的ExternalIdentityMapping；binding/generation/external_account/internal_actor/actor_kind/basis与actualcurrent；exact IdentityMappingState=Valid/Stale/Revoked；3合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：externalaccount不可建GlobalMember或推human/AI责任；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M04 可审查决策记录

- 问题/依据：M04 LocationMappingState / ExternalLocationMapping如何在03§9 M04完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及MAP的ExternalLocationMapping；external_location/parent_location/internal_target/binding/generation/basis同subject；exact LocationMappingState=Valid/Stale/Revoked；3合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：location/parentkind独立，不从Workspace推频道权限或默认root；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M05 可审查决策记录

- 问题/依据：M05 MessageMappingState / ExternalMessageMapping如何在03§9 M05完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及MAP的ExternalMessageMapping；source_ref_version/change_kind/owner_result/effect_ref/origin_marker/mapping_basis/generation_direction；exact MessageMappingState=Linked/Stale/Tombstoned；3合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Linked仅known结果，Tombstoned保历史，外部delete不抹ownertruth；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M06 可审查决策记录

- 问题/依据：M06 InboundHandoffState / InboundHandoffRecord如何在03§9 M06完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及INBOUND的InboundHandoffRecord；verified_source/target_mode/actor_ref/material_ref/required_digest_ref/protocol_disposition/owner_result/operation_ref；exact InboundHandoffState=Verified/Blocked/Quarantined/HandoffPending/OwnerAccepted/OwnerRejected/Indeterminate；10合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：ACK单独record_protocol_disposition不能OwnerAccepted；unknown不换operation；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M07 可审查决策记录

- 问题/依据：M07 PresentationState / SafePresentationPlan如何在03§9 M07完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及PRESENT的SafePresentationPlan；source_ref_version/binding_context/projection_ref/disclosure_basis/attachment_grants/presentation_kind/capability_ref；exact PresentationState=Qualified/Degraded/Blocked/Stale；4合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Degraded only授权安全无敏感/无action提示，不能自行截正文；单测状态标签不足，guard及完整副作用必测；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只验证最终state或只取一条代表边”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M08 可审查决策记录

- 问题/依据：M08 DeliveryIntentState / DeliveryIntent如何在03§9 M08完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/DELIVERY的DeliveryIntent完整原字段：intent_ref:DeliveryIntentRef；effect_ref:DeliveryEffectRef；operation_ref:BridgeOperationRef；source_projection:StableSourceProjectionRef；target_context:ImmutableDeliveryTargetRef；operation_kind:ExternalDeliveryKind；plan_ref:PresentationPlanRef；lane_ref:DispatchLaneRef；retry_basis:RetryEligibilityRefSlot；state:DeliveryIntentState；local_revision:LocalRevision；exact DeliveryIntentState=Planned/Dispatching/RetryWait/PlatformAccepted/KnownRejected/Indeterminate/Blocked/Unsupported；14合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：RetryWait完整NoEffect五源与current，PlatformAccepted非已读/内部执行；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M09 可审查决策记录

- 问题/依据：M09 DeliveryAttemptState / DeliveryAttempt如何在03§9 M09完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/DELIVERY的DeliveryAttempt完整原字段：attempt_ref:AttemptRef；intent_effect:DeliveryIntentEffectRef；claim_ref:FencedClaimRef；qualification_ref:DispatchEligibilityRef；attempt_window:AuthorizedAttemptWindowRef；result_ref:PlatformBusinessResultRefSlot；state:DeliveryAttemptState；local_revision:LocalRevision；exact DeliveryAttemptState=Claimed/InFlight/KnownAccepted/KnownRejected/Indeterminate/NotDispatched；9合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Claimed不是Reserved、NoIo不是state；NotDispatched只NoIo本地证明；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M10 可审查决策记录

- 问题/依据：M10 ExternalActionState / ExternalActionBinding如何在03§9 M10完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CALLBACK的ExternalActionBinding完整原字段：action_binding_ref:ExternalActionBindingRef；installation_ref:BridgeInstallationRef；source_intent:SourceIntentMessageRef；actor_responsibility:ActorResponsibilityRef；target_action:OwnerTargetActionRef；owner_revision:OwnerActionStateRevision；binding_generation:BindingGeneration；expiry_one_use:ActionExpiryOneUseRef；authorization_basis:ActionAuthorizationBasisRef；one_use_claim:OneUseClaimRefSlot；state:ExternalActionState；local_revision:LocalRevision；exact ExternalActionState=Active/Claimed/Expired/Revoked；3合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：one-use Claim一次，不续期或复活Expired/Revoked；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M11 可审查决策记录

- 问题/依据：M11 CallbackHandoffState / CallbackHandoffRecord如何在03§9 M11完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CALLBACK的CallbackHandoffRecord完整原字段：callback_ref:CallbackRecordRef；operation_ref:BridgeOperationRef；action_binding_ref:ExternalActionBindingRefSlot；verification_ref:CallbackVerificationRefSlot；owner_action_ref:OwnerTargetActionRefSlot；one_use_claim:OneUseClaimRefSlot；protocol_disposition:ProtocolAckDisposition；owner_result:OwnerActionResultRefSlot；state:CallbackHandoffState；local_revision:LocalRevision；exact CallbackHandoffState=Verified/Blocked/Rejected/OwnerPending/OwnerAccepted/OwnerRejected/Indeterminate；8合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：OwnerPending actualclaimcommit后才handoff；ACK/deferred非Decision；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M12 可审查决策记录

- 问题/依据：M12 DedupState / DedupRecord如何在03§9 M12完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/KEY的DedupRecord完整原字段：dedup_ref:DedupRecordRef；namespace_scope:DedupNamespaceScope；idempotency_key:QualifiedIdempotencyKey；semantic_identity:BodyFreeOperationMeaningRef；operation_effect:OriginalOperationEffectRef；result_ref:SafeOriginalResultRefSlot；retention_window:QualifiedRetentionWindowRef；state:DedupState；local_revision:LocalRevision；exact DedupState=Reserved/ResultRecorded/Indeterminate/Expired；6合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Reserved+Missing不能判Fresh，Expired不能重新execute；Job和targetop不同；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M13 可审查决策记录

- 问题/依据：M13 StreamCursorState / StreamCursor如何在03§9 M13完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CURSOR的StreamCursor完整原字段：cursor_ref:StreamCursorRef；namespace_stream:CursorNamespaceStream；epoch:QualifiedStreamEpoch；position:OpaqueStreamPositionSlot；comparator_ref:AuthoritativeComparatorRefSlot；coverage_ref:ContinuityCoverageRefSlot；revision:CursorRevision；state:StreamCursorState；local_revision:LocalRevision；exact StreamCursorState=Ready/Incomparable/Blocked；6合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：position不可字符串比较，requalify sameepoch不advance，不越gap；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M14 可审查决策记录

- 问题/依据：M14 GapState / GapRecord如何在03§9 M14完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CURSOR的GapRecord完整原字段：gap_ref:GapRef；cursor_ref:StreamCursorRef；operation_ref:BridgeOperationRef；range_ref:QualifiedGapRangeRef；reason:SafeGapReason；coverage_ref:AuthoritativeCoverageRefSlot；recovery_ref:RecoveryRecordRefSlot；window_basis:RecoveryWindowRefSlot；state:GapState；local_revision:LocalRevision；exact GapState=Open/Probing/Closed/Manual；6合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：GapState没有Partial；partial回Open/fullcoverage只close，不必advancecursor；列内guard反例与全副作用是本机验收组成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只报state覆盖或端到端最后成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M15 可审查决策记录

- 问题/依据：M15 DispatchLaneState / DispatchLane如何在03§9 M15完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/RATE的DispatchLane原字段：lane_ref:DispatchLaneRef；order_scope:QualifiedLaneOrderScope；head_dependency:DeliveryDependencyRefSlot；claim_fence:FencedClaimRefSlot；unresolved_head:Option<AttemptEffectRef>；rate_bounds:QualifiedRateLimitBoundSet；retry_budget:RetryBudgetRef；revision:LaneRevision；state:DispatchLaneState；local_revision:LocalRevision；exact DispatchLaneState=Ready/Held/Cooldown/Blocked；9合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：lease失效不清unknownhead，sharedbucket跨lane最大下界原子；已知authority/current/原子副作用不能只测标签；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M16 可审查决策记录

- 问题/依据：M16 RecoveryState / RecoveryRecord如何在03§9 M16完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/RECOVERY的RecoveryRecord原字段：recovery_ref:RecoveryRecordRef；original_subject:OriginalRecoverableSubjectRef；operation_effect:OriginalOperationEffectRef；authorization_basis:RecoveryAuthorizationRef；qualification_ref:RecoveryQualificationRefSlot；probe_result:AuthoritativeProbeResultRefSlot；resolution_kind:SafeRecoveryResolutionKind；safe_reason:SafeReasonCode；state:RecoveryState；local_revision:LocalRevision；exact RecoveryState=Requested/Probing/Resolved/Blocked/Manual；8合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Resolved only原known/finalize/fullgap/qualifiedsameeffecteligibility，不重执行；已知authority/current/原子副作用不能只测标签；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M17 可审查决策记录

- 问题/依据：M17 SafeHandoffState / SafeHandoffRecord如何在03§9 M17完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/AUDIT的SafeHandoffRecord原字段：handoff_ref:SafeHandoffRef；source_audit_ref:SafeAuditRef；canonical_material_ref:CanonicalSafeMaterialRef；producer_admission:ProducerAdmissionRef；operation_ref:BridgeOperationRef；consumer_result:ConsumerDispositionRefSlot；retention_window:QualifiedRetentionWindowRef；claim:QualificationSlot<SafeHandoffClaimRef>；producer_revision:SafeProducerSchemaRevision；state:SafeHandoffState；local_revision:LocalRevision；exact SafeHandoffState=Pending/Dispatching/ConsumerAccepted/ConsumerRejected/Indeterminate/Blocked；10合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：ConsumerAccepted only真实disposition；当前producer无Bridges准入blocked；已知authority/current/原子副作用不能只测标签；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M18 可审查决策记录

- 问题/依据：M18 RuntimeExecutionPhase / RuntimeExecutionState如何在03§9 M18完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY的RuntimeExecutionState原字段：RuntimeRequiredSeams/RuntimeAvailability/RuntimeExecutionState原budget/phase/unresolved；exact RuntimeExecutionPhase=Constructed/Active/Draining/StoppedLocal/StoppedWithUnknown；4合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：StoppedLocal只本地无unresolved，StoppedWithUnknown不能撤销foreignIO；技术机无hydrate/durable/revision不是domainalias；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M19 可审查决策记录

- 问题/依据：M19 JobInvocationPhase / JobInvocationState如何在03§9 M19完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY的JobInvocationState原字段：原JobInvocationPlan/phase/result/unresolved，actual invocation/returned时点；exact JobInvocationPhase=Pending/Dispatched/CompletedLocal/CancelledLocal/Indeterminate；5合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：CompletedLocal不是业务完成或测试run，CancelledLocal不证明NoEffect；技术机无hydrate/durable/revision不是domainalias；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M20 可审查决策记录

- 问题/依据：M20 SourceSessionPhase / PlatformSourceSession如何在03§9 M20完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY的PlatformSourceSession原字段：installation/family/mode/source/epoch/session/budget原字段，sourcecontinuitynoticeE01；exact SourceSessionPhase=Configured/Active/Disconnected/NotEstablished/Stopped；10合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：Disconnected/NotEstablished不是无gap，重连不证明coverage；技术机无hydrate/durable/revision不是domainalias；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-STATE-BR-M21 可审查决策记录

- 问题/依据：M21 WorkerBatchPhase / WorkerSchedulingBatch如何在03§9 M21完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY的WorkerSchedulingBatch原字段：原ownedplans/inflight/index/boundedresults/unresolved/budget/phase；exact WorkerBatchPhase=Collected/Dispatching/CompletedLocal/StoppedLocal/StoppedWithUnknown；8合法pair，factory不计范围裁决，所需副作用是否同阶段成立？
- 诊断：empty boundedpage不是全量完成，StoppedWithUnknown保原op/effect；技术机无hydrate/durable/revision不是domainalias；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“本地phase完成就意味着owner/platform/consumer成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-001 可审查决策记录

- 问题/依据：whole-U原子提交/完整expected/actualproof如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的QualifiedLocalMutationPlan.mutation/original/writes/expected/seed/audit/observation/handoff；LocalUnitOfWorkPort.begin/seal_plan/commit/rollback；八Repositorytypedstage；config/generation/cursor/lane/local独立轴范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-002 可审查决策记录

- 问题/依据：stablemeaning/key/effect跨入口与immutable结果如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的六DedupNamespaceScope/QualifiedIdempotencyKey/BodyFreeOperationMeaningRef/OriginalOperationEffectRef；StableEffectIdentity；PreparedStoredResultSeed/PreparedResultPayload与原resultID/key/meaning/scope；C04/E02范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-003 可审查决策记录

- 问题/依据：claim/one-use/fence先actualcommit后效果如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的ExternalActionBinding.one_use_claim、CallbackHandoffRecord.one_use_claim；DeliveryIntent/Attempt及DispatchLane.claim_fence/unresolved_head；SafeHandoffRecord.claim；actualCommittedLocalMutationRef与finalcurrent范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-004 可审查决策记录

- 问题/依据：cursor/gap双coverage与epoch/revision一致性如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的GapRecord.close(AuthoritativeCoverageRef)、StreamCursor.advance(ComparablePositionRef,ContinuityCoverageRef,ExpectedCursorRevision,ExpectedLocalRevision)；CursorNamespaceStream/QualifiedStreamEpoch/AuthoritativeComparatorRef；原全expected范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-005 可审查决策记录

- 问题/依据：lane顺序/shared ratebounds/retry预算如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的DispatchLane.order_scope/head_dependency/claim_fence/unresolved_head/rate_bounds/retry_budget/revision/local_revision；QualifiedRateLimitBoundSet/QualifiedLaneOrderScope；RetryEligibility/04字段资格范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-006 可审查决策记录

- 问题/依据：四authority恢复与targetexpiry不重执行如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的LocalCommitDisposition、OwnerHandoff/OwnerAction结果、KnownPlatformBusinessResult/NoEffectBasis、ConsumerDisposition；AuthoritativeRecoveryPort的正式资格/只读probe边界，RecoveryRecord::begin_probe/resolve/block/require_manual原成员；J05qualify_dedup_expiry目标businesskey/op与Jobkey/op范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-TX-BR-007 可审查决策记录

- 问题/依据：非递归producer与技术phase不伪造副作用如何在03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL的MutationObservationRequirement.OwnerPermitsAuditOnly/Mandatory/OptionalQualified/NonRecursiveResultOnly；SafeObservationPort.qualify_nonrecursive；E04/J04/J02Consumer/J05Handoff；M18~21原phase范围裁决，所需副作用是否同阶段成立？
- 诊断：多个正式主语在同阶段的副作用必须同一actualbasis成立，局部标签或成功计数无法证明原子性；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只校最终状态或平均成功率”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

有150列内pair并不保证375补集或guard失败被测；技术四机无store/rehydrate，不可照搬Domain CAS；无actualproof或强制producercontract依旧不能正向运行。当前03本地expiry补口已经closed_design_contract，current retention仍未获准。

## 5. 改动前后对比

| 项 | 易误判 | 本步裁决 |
|---|---|---|
| 状态 | 用送达/完成口语替enum | 21枚举逐字，允许边与补集精确 |
| 事务 | stage/plan就是提交 | actual driver proof与完整write/read集合 |
| phase | localCompleted等foreign成功 | 原unresolved不清，四机纯技术 |
| unknown | timeout/rollback就是无效果 | 四authority独立只读恢复、原op/effect保留 |

## 6. 验收裁决取舍与复杂度

复杂度高；每机独立decision→卡含完整pair镜像→staticstop；再7独立联合门禁。复制只验收索引，不定义第二套状态机；guard缩写唯一沿03§9该机原guard表，所有二级required/source/clock/CAS需全参数测试。

## 7. 结构化中间产物

### 8.1 共同矩阵/副作用口径

唯一状态定义为03§9/§16.6；05 state_pair_registry是原矩阵的封闭测试枚举。21机/101正式值/150允许pair（123durable、27技术）及375未列有向候选（完整state×state，包括未列同态；只读/no-op不是迁移）；factory/rehydrate/getter不冒称迁移。每机下表逐列保原member_flow、guard、candidate_commit与illegal_error；缩写E0~E4、U及IQ/DC等guard条件唯一展开于03§9该机原表，不能省required字段/current/expected/clock或把“同上”脱离该机上下文。

E0=InconsistentFields；E1=InvalidValue/WrongKind；E2=MissingRequired/OutOfScope/Expired；E3=UnknownEffect；E4=ForbiddenMaterial。pure guard失败全部字段/revision零变且zero新IO/audit；driver conflict须实际rollback proof，未知保original/phase。Domain pure candidate≠actual commit；M18~21只技术内存phase，没有rehydrate/store/local_revision/audit。阶段结果不能作另一authority通过证据。

### 8.2 独立状态机门禁

#### AC-STATE-BR-M01 M01 BridgeInstallationState / BridgeInstallation

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-001、AC-BR-037、AC-BR-038；03§9 M01完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及BIND |
| 正式对象/字段/协议/状态 | BridgeInstallation；currentinstallation/config/seams三轴与原config/local expected；state固定构造/实际hydrate；exact BridgeInstallationState=Configured/Qualified/Blocked/Suspended/Retired；12合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；Configured不能因ref shape直接Qualified，Retired不复活；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-002","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Configured | Qualified | `BridgeInstallation.record_qualification` @ J05 | IQ + 原config/local expected | 建立qualification；local checked next；U installation | E0/E1/E2 |
| Blocked | Qualified | `BridgeInstallation.record_qualification` @ J05 | IQ，不借旧失效Slot | 同上，config含义不变 | E0/E1/E2 |
| Configured | Blocked | `BridgeInstallation.block` @ J05 | IB + local expected | 缺口状态及资格按原卡；U installation | E0/E1/E2 |
| Qualified | Blocked | `BridgeInstallation.block` @ J05 | IB + local expected | 阻新IO，保已发生effect | E0/E1/E2 |
| Configured | Suspended | `BridgeInstallation.suspend` @ C01 | IC当前basis/config/local | checked config/local next；U installation | E0/E1/E2 |
| Qualified | Suspended | `BridgeInstallation.suspend` @ C01 | IC当前basis/config/local | 同上，不取消旧IO | E0/E1/E2 |
| Blocked | Suspended | `BridgeInstallation.suspend` @ C01 | IC当前basis/config/local | 同上 | E0/E1/E2 |
| Suspended | Configured | `BridgeInstallation.restart_configured` @ C01 | IC显式重启；旧config/local | config/local next、资格失效；需另J05 | E0/E1/E2 |
| Configured | Retired | `BridgeInstallation.retire` @ C01 | IC退役授权、config/local | U installation终态；保所有历史 | E0/E1/E2 |
| Qualified | Retired | `BridgeInstallation.retire` @ C01 | 同上 | 同上 | E0/E1/E2 |
| Blocked | Retired | `BridgeInstallation.retire` @ C01 | 同上 | 同上 | E0/E1/E2 |
| Suspended | Retired | `BridgeInstallation.retire` @ C01 | 同上 | 同上 | E0/E1/E2 |

#### AC-STATE-BR-M02 M02 ExternalBindingState / ExternalBinding

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-002、AC-BR-037、AC-BR-038；03§9 M02完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及BIND |
| 正式对象/字段/协议/状态 | ExternalBinding；主体/两端/directions_actions/generation/actor_basis/authorization_basis及current；exact ExternalBindingState=Pending/Active/Suspended/Revoked/Expired；9合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；Pending/Active不是安装资格或owner权限；Revoked/Expired终态不得复活；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-002","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Pending | Active | `ExternalBinding.activate` @ C02 | BA双expected、next generation | 两Slot建立、generation/local next；U binding | E0/E1/E2 |
| Suspended | Active | `ExternalBinding.activate` @ C02 | BA重新显式授权，同target/action含义 | 新generation，不复用旧current；U binding | E0/E1/E2 |
| Active | Suspended | `ExternalBinding.suspend` @ C02/J05 | BM暂停、原两expected | generation/local next；阻新IO | E0/E1/E2 |
| Pending | Revoked | `ExternalBinding.revoke` @ C02/J05 | BR双expected，J05仅actual正式候选 | 两Slot失效、generation/local next；保历史 | E0/E1/E2 |
| Active | Revoked | `ExternalBinding.revoke` @ C02/J05 | 同上 | 同上；不取消已发生效果 | E0/E1/E2 |
| Suspended | Revoked | `ExternalBinding.revoke` @ C02/J05 | 同上 | 同上 | E0/E1/E2 |
| Pending | Expired | `ExternalBinding.expire` @ C02/J05 | BM正式expiry、双expected、now | local变化按原generation规则，保历史 | E0/E1/E2 |
| Active | Expired | `ExternalBinding.expire` @ C02/J05 | 同上 | 阻新动作，旧known-only finalize另核 | E0/E1/E2 |
| Suspended | Expired | `ExternalBinding.expire` @ C02/J05 | 同上 | 原relation终态；U binding | E0/E1/E2 |

#### AC-STATE-BR-M03 M03 IdentityMappingState / ExternalIdentityMapping

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-003、AC-BR-037、AC-BR-038；03§9 M03完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及MAP |
| 正式对象/字段/协议/状态 | ExternalIdentityMapping；binding/generation/external_account/internal_actor/actor_kind/basis与actualcurrent；exact IdentityMappingState=Valid/Stale/Revoked；3合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；externalaccount不可建GlobalMember或推human/AI责任；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-003","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Valid | Stale | `ExternalIdentityMapping.invalidate` @ C03/J05 | II + local expected | local next；两端不换；U identity | E0/E1/E2 |
| Valid | Revoked | `ExternalIdentityMapping.revoke` @ J05 | IR实际候选 + local expected | local next；历史保留；U identity | E0/E1/E2 |
| Stale | Revoked | `ExternalIdentityMapping.revoke` @ J05 | IR不借旧Active current | 同上，无复活 | E0/E1/E2 |

#### AC-STATE-BR-M04 M04 LocationMappingState / ExternalLocationMapping

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-003、AC-BR-037、AC-BR-038；03§9 M04完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及MAP |
| 正式对象/字段/协议/状态 | ExternalLocationMapping；external_location/parent_location/internal_target/binding/generation/basis同subject；exact LocationMappingState=Valid/Stale/Revoked；3合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；location/parentkind独立，不从Workspace推频道权限或默认root；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-003","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Valid | Stale | `ExternalLocationMapping.invalidate` @ C03/J05 | LI + local expected | local next；原parent/target保留；U location | E0/E1/E2 |
| Valid | Revoked | `ExternalLocationMapping.revoke` @ J05 | LR完整actual候选/local | local next；原关系解除；U location | E0/E1/E2 |
| Stale | Revoked | `ExternalLocationMapping.revoke` @ J05 | LR，不强求失效旧current | 同上，无复活 | E0/E1/E2 |

#### AC-STATE-BR-M05 M05 MessageMappingState / ExternalMessageMapping

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-006、AC-BR-037、AC-BR-038；03§9 M05完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及MAP |
| 正式对象/字段/协议/状态 | ExternalMessageMapping；source_ref_version/change_kind/owner_result/effect_ref/origin_marker/mapping_basis/generation_direction；exact MessageMappingState=Linked/Stale/Tombstoned；3合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；Linked仅known结果，Tombstoned保历史，外部delete不抹ownertruth；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-003","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Linked | Stale | `ExternalMessageMapping.invalidate` @ C03/J05 | MI + local expected | local next；原locator/result/source不删；U message | E0/E1/E2 |
| Linked | Tombstoned | `ExternalMessageMapping.record_tombstone` @ C03 | MT actual正式处分 | local next；只记原处分历史；U message | E0/E1/E2/E3 |
| Stale | Tombstoned | `ExternalMessageMapping.record_tombstone` @ C03 | MT核当前删除处置，不借旧失效资格 | 同上；不复活消费资格 | E0/E1/E2/E3 |

#### AC-STATE-BR-M06 M06 InboundHandoffState / InboundHandoffRecord

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-005、AC-BR-037、AC-BR-038；03§9 M06完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及INBOUND |
| 正式对象/字段/协议/状态 | InboundHandoffRecord；verified_source/target_mode/actor_ref/material_ref/required_digest_ref/protocol_disposition/owner_result/operation_ref；exact InboundHandoffState=Verified/Blocked/Quarantined/HandoffPending/OwnerAccepted/OwnerRejected/Indeterminate；10合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；ACK单独record_protocol_disposition不能OwnerAccepted；unknown不换operation；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-004","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Verified | Blocked | `InboundHandoffRecord.block` @ E01 | HV已有原行+finite材料/权限缺口/local | local next；安全拒绝；U inbound | E0/E1/E2 |
| Verified | Quarantined | `InboundHandoffRecord.quarantine` @ E01 | HV已有原meaning/row、finite loop/conflict/local | local next；零raw/假actor；U inbound | E0/E1/E2/E4 |
| Verified | HandoffPending | `InboundHandoffRecord.begin_handoff` @ E01 B | HC/HQ，首次resume/recovery None | claim对应接管、local next；actual B才可能owner IO | E0/E1/E2 |
| Blocked | HandoffPending | `InboundHandoffRecord.begin_handoff` @ E01原op重入 | HR + HC/HQ完整 | 同op续接、零新original；U inbound | E0/E1/E2/E3 |
| HandoffPending | OwnerAccepted | `InboundHandoffRecord.apply_owner_result` @ E01 C/J02 | HO Accepted/local expected | actual owner_result/accepted关联；U inbound+合格known mapping | E0/E1/E2/E3 |
| HandoffPending | OwnerRejected | `InboundHandoffRecord.apply_owner_result` @ E01 C/J02 | HO Rejected/local expected | 原拒绝结果保真；U inbound | E0/E1/E2/E3 |
| HandoffPending | Indeterminate | `InboundHandoffRecord.mark_unknown` @ E01 C | 同op可能effect但无known/local | 保original/claim、local next；U inbound | E0/E1/E2 |
| Indeterminate | OwnerAccepted | `InboundHandoffRecord.apply_owner_result` @ J02 | HO权威同op已知/local | known-only finalize，零再次handoff | E0/E1/E2/E3 |
| Indeterminate | OwnerRejected | `InboundHandoffRecord.apply_owner_result` @ J02 | HO权威确定拒绝/local | 同上 | E0/E1/E2/E3 |
| Indeterminate | HandoffPending | `InboundHandoffRecord.begin_handoff` @ E01原op重入 | HR + HC/HQ，unknown不能冒NoEffect | same op有据续接；actual claim后才外部调用 | E0/E1/E2/E3 |

#### AC-STATE-BR-M07 M07 PresentationState / SafePresentationPlan

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-007、AC-BR-037、AC-BR-038；03§9 M07完整状态/guard/非法表与§16.2/16.6；05 planned state_pair_registry/CUT-BR-STATE及PRESENT |
| 正式对象/字段/协议/状态 | SafePresentationPlan；source_ref_version/binding_context/projection_ref/disclosure_basis/attachment_grants/presentation_kind/capability_ref；exact PresentationState=Qualified/Degraded/Blocked/Stale；4合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair、全部typedguard/current/required/CAS/clock与原member@flow成立才candidate；Degraded only授权安全无敏感/无action提示，不能自行截正文；actualdriver提交后才durable，完整封闭TC参数必须有已知result/no-write相邻反例 |
| 失败条件 | 任何未列有向pair被接纳，或列内guard失败仍改字段/revision；required Slot缺失/跨scope/错kind/expired/CAS/overflow仍迁移；后续flow结果补当前state，未知提升known |
| 副作用断言 | 本机候选/具体repo和原full expected集合+key/result/audit/条件handoff同U；非法pure全部字段零变化、zero新effect/audit；无actualcommitproof不外呼，unknown保原op/phase；不给projection/平台truth |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-006","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Qualified | Stale | `SafePresentationPlan.invalidate` @ J01/J05 | PI原版本/target/期限、local expected | local next；原refs不换；U plan | E0/E1/E2 |
| Degraded | Stale | `SafePresentationPlan.invalidate` @ J01/J05 | 同上，降级资格也失效 | 同上 | E0/E1/E2 |
| Qualified | Blocked | `SafePresentationPlan.block` @ J01/J05 | PI当前资格不成立+finite reason/local | local next；阻派发；U plan | E0/E1/E2 |
| Degraded | Blocked | `SafePresentationPlan.block` @ J01/J05 | 同上，不创建action | 同上 | E0/E1/E2 |

#### AC-STATE-BR-M08 M08 DeliveryIntentState / DeliveryIntent

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-009、AC-BR-037、AC-BR-038；03§9 M08完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/DELIVERY |
| 正式对象/字段/协议/状态 | DeliveryIntent完整原字段：intent_ref:DeliveryIntentRef；effect_ref:DeliveryEffectRef；operation_ref:BridgeOperationRef；source_projection:StableSourceProjectionRef；target_context:ImmutableDeliveryTargetRef；operation_kind:ExternalDeliveryKind；plan_ref:PresentationPlanRef；lane_ref:DispatchLaneRef；retry_basis:RetryEligibilityRefSlot；state:DeliveryIntentState；local_revision:LocalRevision；exact DeliveryIntentState=Planned/Dispatching/RetryWait/PlatformAccepted/KnownRejected/Indeterminate/Blocked/Unsupported；14合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；RetryWait完整NoEffect五源与current，PlatformAccepted非已读/内部执行；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-008","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Planned | Dispatching | `DeliveryIntent.claim` @ J01 A | DC同effect/claim/current/all bounds | local next；同U新attempt+lane claim；actual提交不是已IO | E0/E1/E2/E3 |
| RetryWait | Dispatching | `DeliveryIntent.claim` @ J01 A | DC + Established DR、全部等待下界及预算有效 | 同上，原effect不换 | E0/E1/E2/E3 |
| Planned | Blocked | `DeliveryIntent.block` @ J01 | DB真实缺口/local | local next，零receipt/平台IO；U intent | E0/E1/E2 |
| RetryWait | Blocked | `DeliveryIntent.block` @ J01 | DB/local，保原retry历史 | 同上 | E0/E1/E2 |
| Planned | Unsupported | `DeliveryIntent.mark_unsupported` @ J01 | DB正式capability/finite reason/local | 原intent终态；无send替代edit/delete/reply | E0/E1/E2 |
| RetryWait | Unsupported | `DeliveryIntent.mark_unsupported` @ J01 | 同上 | 同上 | E0/E1/E2 |
| Dispatching | PlatformAccepted | `DeliveryIntent.apply_receipt` @ J01 C/J02 | DK Accepted/local | known结果引用，U attempt/receipt/intent/lane | E0/E1/E2/E3 |
| Dispatching | KnownRejected | `DeliveryIntent.apply_receipt` @ J01 C/J02 | DK确定终态Rejected/local | 原拒绝保真，非transport错误 | E0/E1/E2/E3 |
| Dispatching | RetryWait | `DeliveryIntent.schedule_retry` @ J01 C/J02 | DR完整五源/local/now | 建立retry_basis/local next；零新attempt/send | E0/E1/E2/E3 |
| Dispatching | Indeterminate | `DeliveryIntent.mark_unknown` @ J01 C | actual同AttemptEffectRef/finite reason/local | 保原effect/claim/head；U intent+attempt/lane | E0/E1/E2 |
| Indeterminate | PlatformAccepted | `DeliveryIntent.apply_receipt` @ J02 | DK权威同effect known | 只finalize；不再次dispatch | E0/E1/E2/E3 |
| Indeterminate | KnownRejected | `DeliveryIntent.apply_receipt` @ J02 | DK确定原effect拒绝 | 同上 | E0/E1/E2/E3 |
| Indeterminate | RetryWait | `DeliveryIntent.schedule_retry` @ J02 | DR同effect权威NoEffect，非NoIo | 只记eligibility；后续J01重新全部核验 | E0/E1/E2/E3 |
| Blocked | Planned | `DeliveryIntent.restore_planned` @ J02 | DP，完整原plan仍有效 | 原含义恢复/local next；同U原subject+recovery；零IO | E0/E1/E2/E3 |

#### AC-STATE-BR-M09 M09 DeliveryAttemptState / DeliveryAttempt

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-009、AC-BR-037、AC-BR-038；03§9 M09完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/DELIVERY |
| 正式对象/字段/协议/状态 | DeliveryAttempt完整原字段：attempt_ref:AttemptRef；intent_effect:DeliveryIntentEffectRef；claim_ref:FencedClaimRef；qualification_ref:DispatchEligibilityRef；attempt_window:AuthorizedAttemptWindowRef；result_ref:PlatformBusinessResultRefSlot；state:DeliveryAttemptState；local_revision:LocalRevision；exact DeliveryAttemptState=Claimed/InFlight/KnownAccepted/KnownRejected/Indeterminate/NotDispatched；9合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；Claimed不是Reserved、NoIo不是state；NotDispatched只NoIo本地证明；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-008","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Claimed | InFlight | `DeliveryAttempt.begin_io` @ J01 B | AC当前fence/资格/local/now，actual A | local next；U attempt；actual B后一次IO | E0/E1/E2 |
| Claimed | NotDispatched | `DeliveryAttempt.record_not_dispatched` @ J01/J02原NoIo finalize | AN权威未IO + 原actual Claimed | local next；终态attempt；lane/intent各合法边另核 | E0/E1/E2/E3 |
| InFlight | KnownAccepted | `DeliveryAttempt.record_result` @ J01 C/J02 | AK Accepted/local | result SlotEstablished；U attempt/intent/receipt/lane | E0/E1/E2/E3 |
| InFlight | KnownRejected | `DeliveryAttempt.record_result` @ J01 C/J02 | AK Rejected/local | 同上；retry资格不由本标签授予 | E0/E1/E2/E3 |
| InFlight | Indeterminate | `DeliveryAttempt.mark_unknown` @ J01 C | actual原可能IO、finite reason/local | 保claim/effect；U关联unknown head | E0/E1/E2 |
| Claimed | Indeterminate | `DeliveryAttempt.mark_unknown` @ J02 crash恢复 | actual原stage无法证IO/local | local next；保original，不造receipt | E0/E1/E2 |
| Indeterminate | KnownAccepted | `DeliveryAttempt.record_result` @ J02 | AK权威同attempt accepted | 只finalize，零再次dispatch | E0/E1/E2/E3 |
| Indeterminate | KnownRejected | `DeliveryAttempt.record_result` @ J02 | AK权威确定拒绝 | 同上 | E0/E1/E2/E3 |
| Indeterminate | NotDispatched | `DeliveryAttempt.record_not_dispatched` @ J01 D/J02原NoIo finalize | AN，C实际提交后的original行 | 只finalize；旧attempt不可重用 | E0/E1/E2/E3 |

#### AC-STATE-BR-M10 M10 ExternalActionState / ExternalActionBinding

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-010、AC-BR-037、AC-BR-038；03§9 M10完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CALLBACK |
| 正式对象/字段/协议/状态 | ExternalActionBinding完整原字段：action_binding_ref:ExternalActionBindingRef；installation_ref:BridgeInstallationRef；source_intent:SourceIntentMessageRef；actor_responsibility:ActorResponsibilityRef；target_action:OwnerTargetActionRef；owner_revision:OwnerActionStateRevision；binding_generation:BindingGeneration；expiry_one_use:ActionExpiryOneUseRef；authorization_basis:ActionAuthorizationBasisRef；one_use_claim:OneUseClaimRefSlot；state:ExternalActionState；local_revision:LocalRevision；exact ExternalActionState=Active/Claimed/Expired/Revoked；3合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；one-use Claim一次，不续期或复活Expired/Revoked；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-009","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Active | Claimed | `ExternalActionBinding.claim_once` @ E03 B | XA/XC full current/local/now | one_use Established与原op固定；同U callback OwnerPending+dedup | E0/E1/E2/E3 |
| Active | Expired | `ExternalActionBinding.expire` @ J05 | XE actual正式expiry/local/now | local next；原source/授权历史保留；U action | E0/E1/E2 |
| Active | Revoked | `ExternalActionBinding.revoke` @ J05 | XR actual原basis/local | local next；阻后续动作；U action | E0/E1/E2 |

#### AC-STATE-BR-M11 M11 CallbackHandoffState / CallbackHandoffRecord

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-011、AC-BR-037、AC-BR-038；03§9 M11完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CALLBACK |
| 正式对象/字段/协议/状态 | CallbackHandoffRecord完整原字段：callback_ref:CallbackRecordRef；operation_ref:BridgeOperationRef；action_binding_ref:ExternalActionBindingRefSlot；verification_ref:CallbackVerificationRefSlot；owner_action_ref:OwnerTargetActionRefSlot；one_use_claim:OneUseClaimRefSlot；protocol_disposition:ProtocolAckDisposition；owner_result:OwnerActionResultRefSlot；state:CallbackHandoffState；local_revision:LocalRevision；exact CallbackHandoffState=Verified/Blocked/Rejected/OwnerPending/OwnerAccepted/OwnerRejected/Indeterminate；8合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；OwnerPending actualclaimcommit后才handoff；ACK/deferred非Decision；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-009","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Verified | OwnerPending | `CallbackHandoffRecord.begin_handoff` @ E03 B | CVF/CVC all current/local/now | one_use原op绑定、local next；同U action Claimed | E0/E1/E2/E3 |
| Verified | Blocked | `CallbackHandoffRecord.block` @ E03 | 已有CVF record、finite合同缺口/local | local next；安全拒绝；零claim/owner | E0/E1/E2 |
| Verified | Rejected | `CallbackHandoffRecord.reject` @ E03 | 已有CVF record、finite冲突/期限/local | local next；不保存被拒raw | E0/E1/E2/E4 |
| OwnerPending | OwnerAccepted | `CallbackHandoffRecord.apply_owner_result` @ E03 C/J02 | CVO known Accepted/local | owner_result Established；U callback/原关联 | E0/E1/E2/E3 |
| OwnerPending | OwnerRejected | `CallbackHandoffRecord.apply_owner_result` @ E03 C/J02 | CVO known Rejected/local | 原拒绝保真；action仍Claimed | E0/E1/E2/E3 |
| OwnerPending | Indeterminate | `CallbackHandoffRecord.mark_unknown` @ E03 C | actual同op可能effect、finite reason/local | 保one-use/original；零再approve | E0/E1/E2 |
| Indeterminate | OwnerAccepted | `CallbackHandoffRecord.apply_owner_result` @ J02 | CVO权威same-op Accepted | 只finalize；action不回Active | E0/E1/E2/E3 |
| Indeterminate | OwnerRejected | `CallbackHandoffRecord.apply_owner_result` @ J02 | CVO权威same-op Rejected | 同上 | E0/E1/E2/E3 |

#### AC-STATE-BR-M12 M12 DedupState / DedupRecord

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-012、AC-BR-037、AC-BR-038；03§9 M12完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/KEY |
| 正式对象/字段/协议/状态 | DedupRecord完整原字段：dedup_ref:DedupRecordRef；namespace_scope:DedupNamespaceScope；idempotency_key:QualifiedIdempotencyKey；semantic_identity:BodyFreeOperationMeaningRef；operation_effect:OriginalOperationEffectRef；result_ref:SafeOriginalResultRefSlot；retention_window:QualifiedRetentionWindowRef；state:DedupState；local_revision:LocalRevision；exact DedupState=Reserved/ResultRecorded/Indeterminate/Expired；6合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；Reserved+Missing不能判Fresh，Expired不能重新execute；Job和targetop不同；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-010","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Reserved | ResultRecorded | `DedupRecord.attach_result` @ C/E/J已取得原actual结果的后续阶段 | KM/KR/local expected | result SlotEstablished/local next；U原subject+dedup | E0/E1/E2/E3 |
| Reserved | Indeterminate | `DedupRecord.mark_unknown` @ E01/E03/J01/J04 | KM/KU/local | 保原op/effect；U关联unknown | E0/E1/E2 |
| Indeterminate | ResultRecorded | `DedupRecord.attach_result` @ J02/E04原known finalize | KM/KR权威原结果/local | known关联，零第二效果 | E0/E1/E2/E3 |
| Reserved | Expired | `DedupRecord.expire` @ J05 Dedup分支 | KE/current/input expected | 仅state/local next，目标Present+独立Job dedup/seed/audit/正式条件规则同U；保tombstone | E0/E1/E2/E3 |
| ResultRecorded | Expired | `DedupRecord.expire` @ J05 Dedup分支 | KE/current/input expected | 同上，不改immutable result | E0/E1/E2/E3 |
| Indeterminate | Expired | `DedupRecord.expire` @ J05 Dedup分支 | KE/current/input expected且unknown不能丢 | 同上，原effect责任不因expiry清除 | E0/E1/E2/E3 |

#### AC-STATE-BR-M13 M13 StreamCursorState / StreamCursor

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-012、AC-BR-037、AC-BR-038；03§9 M13完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CURSOR |
| 正式对象/字段/协议/状态 | StreamCursor完整原字段：cursor_ref:StreamCursorRef；namespace_stream:CursorNamespaceStream；epoch:QualifiedStreamEpoch；position:OpaqueStreamPositionSlot；comparator_ref:AuthoritativeComparatorRefSlot；coverage_ref:ContinuityCoverageRefSlot；revision:CursorRevision；state:StreamCursorState；local_revision:LocalRevision；exact StreamCursorState=Ready/Incomparable/Blocked；6合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；position不可字符串比较，requalify sameepoch不advance，不越gap；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-011","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Ready | Ready | `StreamCursor.advance` @ J03 C | SA After/actual完整stage coverage、双expected | position/coverage及cursor/local checked next；独立U cursor | E0/E1/E2/E3 |
| Ready | Incomparable | `StreamCursor.mark_incomparable` / `StreamCursor.lose_comparator` @ E01/J03/J05合法维护 | SI/source范围、local expected | comparator Stale/Missing、保旧position/epoch；必要gap同U | E0/E1/E2 |
| Ready | Blocked | `StreamCursor.block` @ J03/J05 | SB正式basis/local | local next，保旧position/coverage事实 | E0/E1/E2 |
| Incomparable | Blocked | `StreamCursor.block` @ J03/J05 | SB/local | 同上 | E0/E1/E2 |
| Incomparable | Ready | `StreamCursor.requalify_same_epoch` @ J03/J05 | SQ全部same epoch/双expected/now | 建立资格、双revision按原卡；不advance position | E0/E1/E2/E3 |
| Blocked | Ready | `StreamCursor.requalify_same_epoch` @ J03/J05 | SQ，不拼新epoch/丢unknown gap | 同上 | E0/E1/E2/E3 |

#### AC-STATE-BR-M14 M14 GapState / GapRecord

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-012、AC-BR-037、AC-BR-038；03§9 M14完整矩阵/guard/非法表与§16.2/16.6；05 state_pair_registry/CUT-BR-STATE/CURSOR |
| 正式对象/字段/协议/状态 | GapRecord完整原字段：gap_ref:GapRef；cursor_ref:StreamCursorRef；operation_ref:BridgeOperationRef；range_ref:QualifiedGapRangeRef；reason:SafeGapReason；coverage_ref:AuthoritativeCoverageRefSlot；recovery_ref:RecoveryRecordRefSlot；window_basis:RecoveryWindowRefSlot；state:GapState；local_revision:LocalRevision；exact GapState=Open/Probing/Closed/Manual；6合法pair，factory不计 |
| 通过条件 | 逐下表全部允许pair，全部typedguard/current/required/CAS/clock/原member@flow齐才purecandidate；GapState没有Partial；partial回Open/fullcoverage只close，不必advancecursor；actual wholeU提交后才durable；每pair/guard失败/未列补集完整封闭TC实例 |
| 失败条件 | 未列pair被接纳或列内guard失败仍修改；required缺失/错kind/跨scope/expiry/CAS/overflow被忽略；先后阶段错用或造NoIo/Partial等state |
| 副作用断言 | 具体repo/full expected集合与key/result/audit/条件handoff同U；pureillegal零字段/版本变化与zeroIO/audit；unknown保original/effect/phase，不以staged/resultSlot推actualcommit或foreignknown |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-011","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Open | Probing | `GapRecord.begin_probe` @ J03 A | GP/recovery current/local | window/recovery原关联、local next；同U recovery Probing | E0/E1/E2/E3 |
| Probing | Closed | `GapRecord.close` @ J03 B | GC complete authoritative/local | coverage Established/local next；同U recovery Resolved | E0/E1/E2/E3 |
| Open | Manual | `GapRecord.require_manual` @ J03 | GU真实缺口/local | finite原因、原range保留；U gap/recovery各合法边 | E0/E1/E2 |
| Probing | Manual | `GapRecord.require_manual` @ J03 B | GU未知/不可判/local | 同上，不清除未覆盖责任 | E0/E1/E2 |
| Probing | Open | `GapRecord.retain_uncovered` @ J03 B | GU actual同range partial probe/local | 原range保留，局部覆盖不伪Closed | E0/E1/E2/E3 |
| Manual | Probing | `GapRecord.begin_probe` @ C06受权后J03 A | GP actual显式授权+原range/source/window齐 | 同U原recovery Probing，不换gap/op | E0/E1/E2/E3 |

#### AC-STATE-BR-M15 M15 DispatchLaneState / DispatchLane

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-013、AC-BR-037、AC-BR-038；03§9 M15完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/RATE |
| 正式对象/字段/协议/状态 | DispatchLane原字段：lane_ref:DispatchLaneRef；order_scope:QualifiedLaneOrderScope；head_dependency:DeliveryDependencyRefSlot；claim_fence:FencedClaimRefSlot；unresolved_head:Option<AttemptEffectRef>；rate_bounds:QualifiedRateLimitBoundSet；retry_budget:RetryBudgetRef；revision:LaneRevision；state:DispatchLaneState；local_revision:LocalRevision；exact DispatchLaneState=Ready/Held/Cooldown/Blocked；9合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，lease失效不清unknownhead，sharedbucket跨lane最大下界原子；actual原子commit后才durable，每pair/guard失败/非法补集全参数测 |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；actualproducer/current/required或fullCAS缺失却提交 |
| 副作用断言 | 本机specificrepo/full expected+dedup/result/audit/条件handoff同U；非法purezero修改/IO/audit，unknown保原op/effect/phase，Mandatory/非递归规则current不fallback |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-012","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Ready | Held | `DispatchLane.claim` @ J01 A | LC/LF + 双expected/now | claim/fence建立、lane/local next；同U intent/attempt | E0/E1/E2/E3 |
| Held | Ready | `DispatchLane.release` @ J01 C/J02 | LR known/noIO、原claim/无head、双expected | 仅clear本地claim/双revision；零no-effect推断 | E0/E1/E2/E3 |
| Held | Cooldown | `DispatchLane.apply_bounds` @ J01 C/J02 | LB + actual原release处置/双expected | 合并全bounds、clear claim按原卡；Unknown仍保head | E0/E1/E2/E3 |
| Ready | Cooldown | `DispatchLane.apply_bounds` @ J01 | LB全scope向量/双expected | rate_bounds合并不缩短、双revision；不重置budget | E0/E1/E2 |
| Ready | Blocked | `DispatchLane.block` @ J01/J05 | LX actual维护basis/双expected | 保原scope/window/head，双revision | E0/E1/E2 |
| Held | Blocked | `DispatchLane.block` / `DispatchLane.release` @ J01/J02/J05合法分支 | block=LX保claim；release=LR Unknown/依赖未立且实际处置 | block保旧claim/unknown；release只清local claim且保unresolved_head | E0/E1/E2/E3 |
| Cooldown | Blocked | `DispatchLane.block` @ J01/J05 | LX当前欠缺/双expected | 原bounds/budget/head保留 | E0/E1/E2 |
| Cooldown | Ready | `DispatchLane.finish_cooldown` @ J01/J05 | LC/LX全bounds到期、无head/未处置claim/双expected/now | 双revision；不清未知、不授权send | E0/E1/E2/E3 |
| Blocked | Ready | `DispatchLane.restore_ready` @ J02/J05 | LX + LC实际current，head若有先actual权威finalize | 原scope恢复、合格head处理/双revision；不产生retry权 | E0/E1/E2/E3 |

#### AC-STATE-BR-M16 M16 RecoveryState / RecoveryRecord

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-014、AC-BR-037、AC-BR-038；03§9 M16完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/RECOVERY |
| 正式对象/字段/协议/状态 | RecoveryRecord原字段：recovery_ref:RecoveryRecordRef；original_subject:OriginalRecoverableSubjectRef；operation_effect:OriginalOperationEffectRef；authorization_basis:RecoveryAuthorizationRef；qualification_ref:RecoveryQualificationRefSlot；probe_result:AuthoritativeProbeResultRefSlot；resolution_kind:SafeRecoveryResolutionKind；safe_reason:SafeReasonCode；state:RecoveryState；local_revision:LocalRevision；exact RecoveryState=Requested/Probing/Resolved/Blocked/Manual；8合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，Resolved only原known/finalize/fullgap/qualifiedsameeffecteligibility，不重执行；actual原子commit后才durable，每pair/guard失败/非法补集全参数测 |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；actualproducer/current/required或fullCAS缺失却提交 |
| 副作用断言 | 本机specificrepo/full expected+dedup/result/audit/条件handoff同U；非法purezero修改/IO/audit，unknown保原op/effect/phase，Mandatory/非递归规则current不fallback |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-013","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Requested | Probing | `RecoveryRecord.begin_probe` @ J02/J03 A | RQ全current/local | qualification Established/local next；U recovery/Gap各合法边 | E0/E1/E2/E3 |
| Requested | Blocked | `RecoveryRecord.block` @ J02/J03 | RB实际失效basis/local | 保original、finite reason/local next | E0/E1/E2 |
| Probing | Blocked | `RecoveryRecord.block` @ J02/J03 B | RB/local | 不Resolved/不新effect | E0/E1/E2 |
| Probing | Resolved | `RecoveryRecord.resolve` @ J02/J03 B | RK FinalizeOnly 或 RR SameEffectRetryEligible 或 RG GapCovered；各typed参数exclusive、local | actual probe/result+resolution/local next；关联known-only U | E0/E1/E2/E3 |
| Requested | Manual | `RecoveryRecord.require_manual` @ J02/J03 | 来源/window欠缺/finite reason/local | resolution_kind Manual；保unknown | E0/E1/E2 |
| Probing | Manual | `RecoveryRecord.require_manual` @ J02/J03 B | actualUnknown/Unavailable/partial不可判/local | 同上，不能清head/gap | E0/E1/E2 |
| Manual | Probing | `RecoveryRecord.begin_probe` @ C06显式授权后J02/J03 A | RQ actual完整重新授权，同subject/op | qualification重建，原effect/range不换 | E0/E1/E2/E3 |
| Blocked | Probing | `RecoveryRecord.begin_probe` @ C06显式授权后J02/J03 A | RQ同上，不借旧失效current | 同上 | E0/E1/E2/E3 |

#### AC-STATE-BR-M17 M17 SafeHandoffState / SafeHandoffRecord

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、AC-BR-037、AC-BR-038；03§9 M17完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/AUDIT |
| 正式对象/字段/协议/状态 | SafeHandoffRecord原字段：handoff_ref:SafeHandoffRef；source_audit_ref:SafeAuditRef；canonical_material_ref:CanonicalSafeMaterialRef；producer_admission:ProducerAdmissionRef；operation_ref:BridgeOperationRef；consumer_result:ConsumerDispositionRefSlot；retention_window:QualifiedRetentionWindowRef；claim:QualificationSlot<SafeHandoffClaimRef>；producer_revision:SafeProducerSchemaRevision；state:SafeHandoffState；local_revision:LocalRevision；exact SafeHandoffState=Pending/Dispatching/ConsumerAccepted/ConsumerRejected/Indeterminate/Blocked；10合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，ConsumerAccepted only真实disposition；当前producer无Bridges准入blocked；actual原子commit后才durable，每pair/guard失败/非法补集全参数测 |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；actualproducer/current/required或fullCAS缺失却提交 |
| 副作用断言 | 本机specificrepo/full expected+dedup/result/audit/条件handoff同U；非法purezero修改/IO/audit，unknown保原op/effect/phase，Mandatory/非递归规则current不fallback |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-016","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Pending | Dispatching | `begin_handoff` @ J04 A（O01后也复用此唯一claim通路） | HF/HC 全 current、claim 实际 reservation、local CAS | audit/dedup/immutable seed/record/claim 同 U；commit unknown 不外呼 | E0/E1/E2/E3 |
| Pending | Blocked | `block` @ J05 | HB actual basis/current 失效 | 保 canonical/op；安全 local mutation，零 consumer IO | E0/E1/E2 |
| Dispatching | ConsumerAccepted | `apply_consumer_result` @ E04/J04 B/J02 B | HK actual same-op known Accepted + local CAS | 结果关联原 row/seed/audit；不产生新 canonical/O01 | E0/E1/E2/E3 |
| Dispatching | ConsumerRejected | `apply_consumer_result` @ E04/J04 B/J02 B | HK actual same-op known Rejected + local CAS | 同上；Rejected 不释放 claim 语义之外的事实 | E0/E1/E2/E3 |
| Dispatching | Indeterminate | `mark_unknown` @ E04/J04 B | HU actual possible effect/finite reason/local | 保原 claim/material/op；不新增 producer/consumer call | E0/E1/E2 |
| Dispatching | Blocked | `block` @ J05 | HB 合法维护 basis；保 unknown claim | local-only block；零重交 | E0/E1/E2/E3 |
| Indeterminate | ConsumerAccepted | `apply_consumer_result` @ E04/J02/J04 | HK 权威 same-op Accepted | known-only finalize；不回 Pending/不重交 | E0/E1/E2/E3 |
| Indeterminate | ConsumerRejected | `apply_consumer_result` @ E04/J02/J04 | HK 权威 same-op Rejected | 同上 | E0/E1/E2/E3 |
| Indeterminate | Pending | `resume_pending` @ J04 R | HR formal NoEffect + current/admission/预算全齐 | 原 record actual commit；下一 U 才 claim/外呼 | E0/E1/E2/E3 |
| Blocked | Pending | `resume_pending` @ J04 R | HR 同原材料/op、实际 NoEffect/current requalification | 同上；不凭 timeout/NotFound/ACK lost | E0/E1/E2/E3 |

#### AC-STATE-BR-M18 M18 RuntimeExecutionPhase / RuntimeExecutionState

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-038、AC-BR-037、AC-BR-038；03§9 M18完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY |
| 正式对象/字段/协议/状态 | RuntimeExecutionState原字段：RuntimeRequiredSeams/RuntimeAvailability/RuntimeExecutionState原budget/phase/unresolved；exact RuntimeExecutionPhase=Constructed/Active/Draining/StoppedLocal/StoppedWithUnknown；4合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，StoppedLocal只本地无unresolved，StoppedWithUnknown不能撤销foreignIO；仅实际host/invocation/session/batch发生原local事实才phase变更，unresolved正确并集/保留，非durablebusinessstate |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；伪rehydrate/store/CAS/audit技术phase |
| 副作用断言 | 纯local技术phase无Repository/UoW/audit/producer；触发的Applicationactualmutation另遵wholeU；取消/断连/停止不撤销或清unknown，不输出run/report/evidence或全库完成 |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Constructed | Active | `RuntimeExecutionState::begin` @ runtime composition | `RuntimeRequiredSeams` 全部 Required seam actual current、`RuntimeAvailability::Qualified`、budget 有界、actual now | 只建立本地 host；不创建业务 effect | `CV::InconsistentFields` / `CV::MissingRequired` / `PE::NotEstablished` |
| Active | Draining | `begin_shutdown` @ runtime host | 仅Active；shutdown_budget bounded、四资源元组与原budget全等；deadline由受信host在本次停止事件经同域clock+批准窗口checked派生；全部guard通过后替换budget，输入unresolved与既有集合并集 | 本地停止旗标；不撤销外部IO；guard失败零修改 | `CV::InconsistentFields` / `CV::UnknownEffect` |
| Draining | StoppedLocal | `record_local_stop` | 实际 unresolved 集合为空，所有 scoped wait/session 已结束 | 只写本地 phase | `CV::UnknownEffect` / `CV::InconsistentFields` |
| Draining | StoppedWithUnknown | `record_local_stop` | 实际 unresolved 集合非空，逐项保留 typed 原 op/effect | 只写本地 phase；交 Application 原恢复责任 | `CV::InconsistentFields` |

#### AC-STATE-BR-M19 M19 JobInvocationPhase / JobInvocationState

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-038、AC-BR-037、AC-BR-038；03§9 M19完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY |
| 正式对象/字段/协议/状态 | JobInvocationState原字段：原JobInvocationPlan/phase/result/unresolved，actual invocation/returned时点；exact JobInvocationPhase=Pending/Dispatched/CompletedLocal/CancelledLocal/Indeterminate；5合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，CompletedLocal不是业务完成或测试run，CancelledLocal不证明NoEffect；仅实际host/invocation/session/batch发生原local事实才phase变更，unresolved正确并集/保留，非durablebusinessstate |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；伪rehydrate/store/CAS/audit技术phase |
| 副作用断言 | 纯local技术phase无Repository/UoW/audit/producer；触发的Applicationactualmutation另遵wholeU；取消/断连/停止不撤销或清unknown，不输出run/report/evidence或全库完成 |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Pending | Dispatched | `mark_dispatched` @ 五 J entry | plan/context/continuity/budget/runtime qualification actual valid；实际已交 Application | 不创建新 op；只 phase 变更 | `CV::InconsistentFields` / `PE::Denied` / `PE::NotEstablished` |
| Pending | CancelledLocal | `cancel_local_wait` @ local cancel | 只停止本地等待；unresolved 取并集，不清旧项 | 不撤回 claim/IO，不生成 no-effect | `CV::UnknownEffect` / `CV::InconsistentFields` |
| Dispatched | CompletedLocal | `record_returned` @ 五 J result | actual bounded `SafeJobResultSummary` 可见且 unresolved 为空；原 plan/subject/op 一致 | 只保存 local result；不宣称 foreign success | `CV::MissingRequired` / `CV::OutOfScope` / `PE::Unavailable` |
| Dispatched | Indeterminate | `record_returned` @ J/driver unknown | 返回或错误携同 invocation 原 unresolved；不能以空结果覆盖已有 unknown | 保原 op/effect；交恢复责任 | `PE::Indeterminate{original,phase}` |
| Dispatched | CancelledLocal | `cancel_local_wait` @ shutdown | actual local cancellation；可能已产生 effect 时 unresolved 必须保留 | 不重入队、不换 operation | `CV::UnknownEffect` |

#### AC-STATE-BR-M20 M20 SourceSessionPhase / PlatformSourceSession

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-038、AC-BR-037、AC-BR-038；03§9 M20完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY |
| 正式对象/字段/协议/状态 | PlatformSourceSession原字段：installation/family/mode/source/epoch/session/budget原字段，sourcecontinuitynoticeE01；exact SourceSessionPhase=Configured/Active/Disconnected/NotEstablished/Stopped；10合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，Disconnected/NotEstablished不是无gap，重连不证明coverage；仅实际host/invocation/session/batch发生原local事实才phase变更，unresolved正确并集/保留，非durablebusinessstate |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；伪rehydrate/store/CAS/audit技术phase |
| 副作用断言 | 纯local技术phase无Repository/UoW/audit/producer；触发的Applicationactualmutation另遵wholeU；取消/断连/停止不撤销或清unknown，不输出run/report/evidence或全库完成 |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Configured | Active | `record_connected` @ E01/E03 runner | same registration/family/mode/source；epoch actual；stateful mode session Established；basis kind exact | 只保存 adapter-local session；不写 cursor/gap | `CV::WrongKind` / `CV::MissingRequired` / `PE::NotEstablished` |
| Configured | NotEstablished | `record_unavailable` @ connect failure | actual qualification/connection 缺口与 finite reason | 保历史，不造 Active | `CV::InconsistentFields` |
| Configured | Stopped | `stop_local` @ shutdown | host stop sequence actual | 只本地停止 | `CV::InconsistentFields` |
| Active | Disconnected | `record_disconnect` @ driver/source loss | actual disconnect；保旧 epoch/session | 仅通知 Application 记录 gap 的输入；不直写 gap | `CV::InconsistentFields` |
| Active | Stopped | `stop_local` | 停止接收并 close local host | 不证明外部无效果 | `CV::InconsistentFields` |
| Disconnected | Active | `record_connected` @ qualified reconnect | 新/同 epoch actual proof；不得跨 epoch 比较 position | 只建立本地连接 | `CV::WrongKind` / `PE::Stale` |
| Disconnected | NotEstablished | `record_unavailable` | actual source/mode/binding 缺口 | 保 old epoch/session | `PE::NotEstablished` |
| Disconnected | Stopped | `stop_local` | actual stop | 只本地停止 | `CV::InconsistentFields` |
| NotEstablished | Active | `record_connected` | 完整新 qualification；不能从配置 bool 推断 | 只保存 session | `PE::NotEstablished` / `CV::MissingRequired` |
| NotEstablished | Stopped | `stop_local` | actual stop | 只本地停止 | `CV::InconsistentFields` |

#### AC-STATE-BR-M21 M21 WorkerBatchPhase / WorkerSchedulingBatch

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-038、AC-BR-037、AC-BR-038；03§9 M21完整矩阵/guard/非法表、§16.6；05 state_pair_registry/STATE/ENTRY |
| 正式对象/字段/协议/状态 | WorkerSchedulingBatch原字段：原ownedplans/inflight/index/boundedresults/unresolved/budget/phase；exact WorkerBatchPhase=Collected/Dispatching/CompletedLocal/StoppedLocal/StoppedWithUnknown；8合法pair，factory不计 |
| 通过条件 | 逐表全部允许pair/current/budget/required/window/guard及原member@flow，empty boundedpage不是全量完成，StoppedWithUnknown保原op/effect；仅实际host/invocation/session/batch发生原local事实才phase变更，unresolved正确并集/保留，非durablebusinessstate |
| 失败条件 | 未列pair或guard失败仍修改；错误phase等业务已成功；清unresolved、终态复活、deadline/lease/drop作NoEffect；伪rehydrate/store/CAS/audit技术phase |
| 副作用断言 | 纯local技术phase无Repository/UoW/audit/producer；触发的Applicationactualmutation另遵wholeU；取消/断连/停止不撤销或清unknown，不输出run/report/evidence或全库完成 |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| from | to | 正式member/触发flow | 原guard（完整条件见03§9该机） | candidate/actual副作用 | 失败错误 |
|---|---|---|---|---|---|
| Collected | Dispatching | `take_next_plan` @ worker scheduling | candidate head current/budget/scope valid；`in_flight=None`；成功后才消费 index 并建立 owned plan | 无 IO；不 mint operation/key | `CV::InconsistentFields` / `CV::Expired` / `PE::Conflict` |
| Collected | CompletedLocal | `take_next_plan(None)` @ empty bounded batch | 无候选、无 in-flight；继承unresolved不清，空页不是coverage | 只本地 phase；不是无未知证明 | `CV::InconsistentFields` |
| Collected | StoppedLocal | `stop_local` @ shutdown | actual unresolved 集合为空且无 in-flight | 只本地停止 | `CV::UnknownEffect` |
| Collected | StoppedWithUnknown | `stop_local` @ shutdown | actual unresolved 或 in-flight 原 op 存在 | 保原 candidate/operation identity | `CV::UnknownEffect` |
| Dispatching | Dispatching | `record_returned`（尚有候选） / `take_next_plan`（后续项） @ worker | returned核原in_flight subject/op/context、清在途并合并unresolved；下一take须已清在途、next candidate current/budget valid | append actual summary或换下一owned plan；两个触发各自guard，无跳项/重排 | `CV::InconsistentFields` / `CV::OutOfScope` / `PE::Conflict` |
| Dispatching | CompletedLocal | `record_returned`（最后actual返回） / `take_next_plan(None)`（已收齐） @ worker | actual原returned plan一致、所有候选已消费且无in_flight；unresolved并集仍保留 | append bounded safe summary或仅phase；非外部成功/无未知证明 | `CV::OutOfScope` / `CV::MissingRequired` |
| Dispatching | StoppedLocal | `stop_local` @ shutdown | no unresolved and no in-flight effect | 只本地停止 | `CV::UnknownEffect` |
| Dispatching | StoppedWithUnknown | `stop_local` @ shutdown/cancel | in-flight 或 actual unresolved 非空 | 合并 unresolved；不重入队 | `CV::UnknownEffect` |

#### AC-TX-BR-001 whole-U原子提交/完整expected/actualproof

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-004、BR-BR-017、BR-BR-022、AC-BR-037；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | QualifiedLocalMutationPlan.mutation/original/writes/expected/seed/audit/observation/handoff；LocalUnitOfWorkPort.begin/seal_plan/commit/rollback；八Repositorytypedstage；config/generation/cursor/lane/local独立轴 |
| 通过条件 | same driver读集/unique/reservation/allsubjects全量CAS；stage集合与plan无多无漏，immutable storedseed/key/audit/conditionalhandoff原子；actualCommitted完整proof才能继续；每stage/reserve/seal/commit/rollback fault全封闭参数验证 |
| 失败条件 | 只主行CAS/部分提交、plan/row/stage作actualproof、跨driver/owner事务、mandatory材料缺失fallback；rollback未知说已回滚 |
| 副作用断言 | guard/precommit失败已证rollback全候选零落盘；commit/rollback未知保原mutation/original/phase只权威readonly，不新begin重apply；tx中零foreign/private/secretIO |
| 具体TC | ["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-014","EV-CONTRACT-010","EV-CONTRACT-020","EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-TX-BR-002 stablemeaning/key/effect跨入口与immutable结果

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-017、BR-BR-013、BR-BR-024、AC-BR-037；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | 六DedupNamespaceScope/QualifiedIdempotencyKey/BodyFreeOperationMeaningRef/OriginalOperationEffectRef；StableEffectIdentity；PreparedStoredResultSeed/PreparedResultPayload与原resultID/key/meaning/scope；C04/E02 |
| 通过条件 | sixnamespace独立全部stablemeaning逐字段codec；samekey同义唯一原op/result，同effect跨C04/E02只有一个intent；immutableA localresult不可B覆盖，B actual原recordSlots/currentview；Expired/unknownwindow不Fresh |
| 失败条件 | trace/time/bodyhash当keymeaning、samekey变target/版本、换effect重试、resultMissing视Fresh、B覆盖A payload或makeacceptedresult |
| 副作用断言 | duplicate无新businessIO/audit/reservation；conflictno新效果且不泄winner；原resultID/op/kind/scope不换，未来缺actualresult暂停B而非补造 |
| 具体TC | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-010","EV-CONTRACT-008","EV-CONTRACT-004","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-TX-BR-003 claim/one-use/fence先actualcommit后效果

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-016、BR-BR-019、AC-BR-023、AC-BR-018；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | ExternalActionBinding.one_use_claim、CallbackHandoffRecord.one_use_claim；DeliveryIntent/Attempt及DispatchLane.claim_fence/unresolved_head；SafeHandoffRecord.claim；actualCommittedLocalMutationRef与finalcurrent |
| 通过条件 | 同U原action/intent/lane/handoffclaim+dedup/audit/result，actualcommit且finalcurrent成立才owner/platform/consumer一次call；concurrentwinner唯一；新attempt复用原effect且retryformal依据 |
| 失败条件 | reserve/stage/lease当已committed；lostfence仍IO、one-use复活、lease释放清unknown、SDK隐重试或mutationcancel证明无效果 |
| 副作用断言 | claimcommit未知zero新foreignIO；可能IO后unknown保original/effect/head，readonlyprobe only；current撤销/expiry拒绝时真实NoIo不升级foreignNoEffect |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-008","EV-CONTRACT-012","EV-CONTRACT-014","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-TX-BR-004 cursor/gap双coverage与epoch/revision一致性

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-018、AC-BR-029、AC-BR-033；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | GapRecord.close(AuthoritativeCoverageRef)、StreamCursor.advance(ComparablePositionRef,ContinuityCoverageRef,ExpectedCursorRevision,ExpectedLocalRevision)；CursorNamespaceStream/QualifiedStreamEpoch/AuthoritativeComparatorRef；原全expected |
| 通过条件 | gapclose fullrange同epoch；stageadvance另有完整committedstage+closed_gaps/原comparator，authoritative比较After；allCAS/sourcebasis当前；partial/Equal/Before/Incomparable各原无推进/拒绝分支 |
| 失败条件 | gapcoverage强转stagecoverage、source/ACK推进Owner/Delivery、换epoch跳最新、opaque比较或latest空页推complete |
| 副作用断言 | 只有close资格可close该gap但cursor不advance；partial原range/水位保留；非法零修改，commitunknown原trackingop/epoch/source责任保留 |
| 具体TC | ["TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-011","EV-CONTRACT-005","EV-CONTRACT-013","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-TX-BR-005 lane顺序/shared ratebounds/retry预算

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-019、BR-BR-024、NFR-BR-010；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | DispatchLane.order_scope/head_dependency/claim_fence/unresolved_head/rate_bounds/retry_budget/revision/local_revision；QualifiedRateLimitBoundSet/QualifiedLaneOrderScope；RetryEligibility/04字段资格 |
| 通过条件 | 原headcreate/threaddependency不可越；同适用bucket跨lane原子合并最大不早于下界+policybackoff，source/attemptwindow交集；actualunit/clock/current/NoEffect/businessbudget完整；concurrent/fault/429全参数测 |
| 失败条件 | 只单responsebucket、缩Retry-After/retry_after、全局总序或未知head放行；未知预算默认无限/零，runtimebudget授businessretry |
| 副作用断言 | bounds不足/耗尽/clock不齐停止该自动操作，不换target/bucket；cooldown状态不造attempt；unknownhead保留，即便lease释放也不越序 |
| 具体TC | ["TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-012","EV-CONTRACT-008","EV-CONTRACT-017","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-TX-BR-006 四authority恢复与targetexpiry不重执行

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-019、BR-BR-020、BR-BR-024、AC-BR-031；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | LocalCommitDisposition、OwnerHandoff/OwnerAction结果、KnownPlatformBusinessResult/NoEffectBasis、ConsumerDisposition；AuthoritativeRecoveryPort的正式资格/只读probe边界，RecoveryRecord::begin_probe/resolve/block/require_manual原成员；J05qualify_dedup_expiry目标businesskey/op与Jobkey/op |
| 通过条件 | explicitcurrentrecoverybasis+原op/effect/source；各readonlyauthority分别known/unknown；NoIo≠NoEffect，NotFound≠无效果；currentdedupexpiry完整proof/window/expected只目标state变化，unknown/tombstone/result保留 |
| 失败条件 | 用另一authorityknown解除当前unknown；timeout/NotFound清unknown，恢复改target/key/正文版本；expiry删除目标后重execute |
| 副作用断言 | probe不send/append/approve；known仅sameoriginal合法finalize；missing_source/currentgap原blocked/manual；targetexpired不换成Joboriginal或新业务事实 |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013","EV-CONTRACT-010","EV-CONTRACT-014","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-TX-BR-007 非递归producer与技术phase不伪造副作用

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-022、BR-BR-023、AC-BR-034、AC-BR-038；03§8.1/9.1/10~12/16.8；04driver/current/budget；05对应closedTC/STATE/LOCAL |
| 正式对象/字段/协议/状态 | MutationObservationRequirement.OwnerPermitsAuditOnly/Mandatory/OptionalQualified/NonRecursiveResultOnly；SafeObservationPort.qualify_nonrecursive；E04/J04/J02Consumer/J05Handoff；M18~21原phase |
| 通过条件 | 每actuallocalmutation安全audit/key/result同U；非递归rule覆盖全部subjects/原source/current才handoff=None；no-op/query/pureguard/technicalphase无fakeaudit；真实returnedsummary/unresolved保留，CompletedLocal只本地 |
| 失败条件 | 缺Bridgesproducer改label借准入、默认audit-only；handofflifecycle生成第二canonical/O01；query/phase造run/evidence/audit；停止清unknown |
| 副作用断言 | 当前formalproducer/rule缺失blocked；zero新producer/通用outbox/TraceRecord/持久view/sidecar/report/run；技术机无hydrate/store，applicationmutation仍原wholeU |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-019","EV-CONTRACT-015","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualdriver/owner/platform/consumer各所测authority、current预算与正式observation规则须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

### 8.3 一致性裁决集合与源基线

| 裁决集合 | required规则 | 缺口处理 |
|---|---|---|
| 21机/101正式状态/150允许pair | 每机按03原guard/member/副作用及05state-pair registry逐row裁决 | 缺参数实例或断言暂停，不抽样代表全集 |
| 375未列有向候选及列内guard反例 | 完整state×state包含未列同态；TC-STATE-001~006覆盖终态/required/kind/scope/expiry/CAS/overflow/unknown | getter/no-op不是迁移；非法迁移零修改 |
| 源版本 | 当前03§9 exact slice SHA256=1eab0e044374c7f5f75d9029f828c0a27dba67a430614a6f2cf318581b7774a6；actual送验须重核源/build | hash/guard变化按§3重新建立基线 |
| 七联合门禁 | wholeU/fullCAS/unique/immutable结果、claim、两coverage、rate、恢复/expiry、非递归/phase分别required | 缺actual driver/producer/current资格不裁正向 |
| phase/ownertruth | factory不算迁移；Domain17机与技术4机分离，immutableAudit/Receipt不造新machine | local complete不能签foreign success |
| 副作用与证据 | 每卡pass/fail/no-write、unknown保责任及固定路径；共享EV不重复计instance | 无run不产生证据、verdict或签署 |

本章不替代03原矩阵；01~05语义不在验收中重开，任何guard或源基线变化须重新裁决受影响项。

## 8. 回填草稿

正式06§8直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15装配前过程归档

以下为本Step原§7末的设计静态审查记录，仅留过程区，不进入正式正文，不代表运行。

### 8.3 跨状态/事务停审

| 审查面 | 设计静态结论 | actual限制 |
|---|---|---|
| 21机/101正式值/150允许边 | 每机独立card+原guard/member/副作用镜像；150逐row与05registry核对errors=[] | TC全planned，未执行 |
| 375未列有向候选及列内guard反例 | TC-STATE-001~006封闭参数要求；终态/required/kind/scope/expiry/CAS/overflow/unknown反例不能代表抽样 | 缺instance/assertion暂停 |
| 源版本 | 03§9 exact slice SHA256=1eab0e044374c7f5f75d9029f828c0a27dba67a430614a6f2cf318581b7774a6，与05注册一致 | actual送验source/build另核 |
| 7联合门禁 | wholeU/fullCAS/unique/immutable结果、claim、两coverage、rate、恢复/expiry、非递归/phase各独立TC/EV | 无actualdriver/producer/currentqualification |
| phase/ownertruth | factory不算迁移，Domain17机与技术4机分离；immutableAudit/Receipt不造新machine | localcomplete不签foreignsuccess |
| 副作用与证据 | 每卡pass/fail/no-write/未知保责任及固定路径；共享EV引用不重复计instance | no actualrun/evidence/verdict |

01~05语义不重开；本章索引不替代03原矩阵。未来源hash或任何guard变化均按§3重基线并重新裁决受影响项。

### Step15修正后重审

AC-TX-BR-006：上述修正已与03§5/8.1/16正式源再核，规范id/fields/pass/fail/effects及TC/EV引用实际静态检查errors=[]。只纠正06表述，不改原业务schema/guard/测试注册表；不代表actualcase/EV/qualification。Step15跨审同时核对139卡及191字段/150pair；过程话语留此区。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| AC-STATE-BR-M01 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M02 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M03 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M04 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M05 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M06 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M07 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M08 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M09 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M10 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M11 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M12 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M13 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M14 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M15 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M16 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M17 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M18 | 正式合同/原字段、通过/失败/副作用、13个具体TC和2个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M19 | 正式合同/原字段、通过/失败/副作用、13个具体TC和2个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M20 | 正式合同/原字段、通过/失败/副作用、13个具体TC和2个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-STATE-BR-M21 | 正式合同/原字段、通过/失败/副作用、13个具体TC和2个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-001 | 正式合同/原字段、通过/失败/副作用、22个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-002 | 正式合同/原字段、通过/失败/副作用、21个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-003 | 正式合同/原字段、通过/失败/副作用、28个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-004 | 正式合同/原字段、通过/失败/副作用、19个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-005 | 正式合同/原字段、通过/失败/副作用、28个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-006 | 正式合同/原字段、通过/失败/副作用、28个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-TX-BR-007 | 正式合同/原字段、通过/失败/副作用、22个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。补集口径复核：初次诊断脚本排除self得到276；05要求完整state×state，含未列同态。已按全有向组合重算375（已列同态2），errors=[]；只读/no-op不是迁移，源矩阵未改。21机+7联合门禁逐项完成；实际比对101状态/150pair/375补集计划与源hash无漂移。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_9。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
