# L6-bridges 02 Step12：supporting type使用与03闭口索引

> design-only / type_contract_pending；从当前Step6对象字段/typed函数及Step7/8已讨论协议/port抽取，未新建领域对象或实现schema。条目数243。
> 03必须定义全部条目或绑定真实external shared契约；本表不是实施台账、代码或readiness。

## 1. 统一闭口要求

每项给类型kind、字段/值域/序列化、可选性/required-by-state、owned/public/internal边界、source/resolver、版本/scope/visibility/expiry/revoke、失败/unknown及测试切口。任何local safe ref/container不拥有引用目标真相，也不自带权限。

SDK metadata沿SDK03§7.3；BridgeTargetMode/ActorRef required沿Conversation03§7.4；其余名称是本地概要合同要求，不声称上游同名类型已存在。basis/material/actor责任/coverage/secret/admission等必须通过§7相应正式port authority关闭；仅local结构不能解除BR-UP。

Slot必须定义missing/established/stale或适用的exact variant，并与执行/accepted状态required guard逐项对应；无资格可以局部blocked/ref欠缺，不能构造假ref或绕owner required payload。结果类别不能合GlobalSuccess。

## 2. 类型与使用位置

| 概要类型 | 已出现位置 | 03必须闭口 |
|---|---|---|

| `LocalCasDisposition` | §7 repositories；局部CAS成功/冲突/不可判typed结果 | 03完整定义/来源/scope/失败与required-by-state；private payload/handle不入durable/log/trace/证据，结果不明保unknown |
| `LocalCommitDisposition` | §7 LocalUnitOfWorkPort；§8通用规则/§10事务未知/§12driver提交proof | 03完整定义/来源/scope/失败与required-by-state；private payload/handle不入durable/log/trace/证据，结果不明保unknown |
| `PrivateQualifiedPayload` | §7 PlatformDeliveryPort；private瞬时获准payload，不落盘 | 03完整定义/来源/scope/失败与required-by-state；private payload/handle不入durable/log/trace/证据，结果不明保unknown |
| `PrivateSecretHandle` | §7 SecretResolutionPort/PlatformDeliveryPort；private最小scope/lifetime | 03完整定义/来源/scope/失败与required-by-state；private payload/handle不入durable/log/trace/证据，结果不明保unknown |
| `TransientQualifiedMaterialHandle` | §7 PrivateMaterialPort；private瞬时材料读取/转换 | 03完整定义/来源/scope/失败与required-by-state；private payload/handle不入durable/log/trace/证据，结果不明保unknown |

| `ActionAuthorizationBasisRef` | U4/ExternalActionBinding.authorization_basis；U4/ExternalActionBinding 参数 basis；§7 C05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ActionExpiryOneUseRef` | U4/ExternalActionBinding.expiry_one_use | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ActorContext` | §7 C01；§7 C02；§7 C03；§7 C04；§7 C05；§7 C06；§7 Q01；§7 Q02；§7 Q03；§7 Q04；§7 SafeReadQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ActorRef` | U1/ExternalIdentityMapping.internal_actor；U1/ExternalIdentityMapping 参数 actor；§7 ConversationHandoffPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ActorRefSlot` | U2/InboundHandoffRecord.actor_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ActorResponsibilityRef` | U1/ExternalIdentityMapping 参数 actor；U4/ExternalActionBinding.actor_responsibility；§7 BindingQualificationPort；§7 ActorResponsibilityPort；§7 OwnerActionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ActorResponsibilityRefSlot` | U1/ExternalBinding.actor_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AllowedProjectionRef` | §7 PresentationQualificationPort；§7 PrivateMaterialPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AllowedProjectionRefSlot` | U3/SafePresentationPlan.projection_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AttachmentGrantRefSet` | §7 PresentationQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AttachmentGrantRefSetSlot` | U3/SafePresentationPlan.attachment_grants | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AttemptEffectRef` | U3/PlatformReceipt.attempt_effect；U3/PlatformReceipt 参数 attempt | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AttemptRef` | U3/DeliveryIntent 参数 attempt；U3/DeliveryAttempt.attempt_ref；§7 DeliveryRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthoritativeComparatorRefSlot` | U5/StreamCursor.comparator_ref；U5/StreamCursor 参数 comparator | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthoritativeCoverageRef` | U5/GapRecord 参数 coverage；§7 AuthoritativeRecoveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthoritativeCoverageRefSlot` | U5/GapRecord.coverage_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthoritativeProbeResultRef` | U5/RecoveryRecord 参数 result；§7 AuthoritativeRecoveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthoritativeProbeResultRefSlot` | U5/RecoveryRecord.probe_result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedAttemptWindowRef` | U3/DeliveryAttempt.attempt_window | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedBindingBasisRef` | U1/ExternalBinding 参数 basis；§7 C02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedBindingBasisRefSlot` | U1/ExternalBinding.authorization_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedMappingContextRef` | U2/InboundHandoffRecord 参数 context；U3/SafePresentationPlan.binding_context；U3/SafePresentationPlan 参数 target | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedMappingContextRefSlot` | U2/InboundHandoffRecord.mapping_context | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedMappingProposal` | §7 C03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedMappingSnapshot` | §7 MappingRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedReadScopeRef` | U6/BridgeLocalView.scope_ref；§7 SafeReadQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `AuthorizedSafeSubjectRefSet` | U6/SafeAuditRecord.subject_refs | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BindingActionProposal` | §7 C02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BindingGeneration` | U1/ExternalBinding.generation；U1/ExternalIdentityMapping.generation；U1/ExternalLocationMapping.generation；U4/ExternalActionBinding.binding_generation | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BodyFreeMutationMaterial` | U6/SafeAuditRecord 参数 material | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BodyFreeOperationMeaningRef` | U5/DedupRecord.semantic_identity；U5/DedupRecord 参数 meaning | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeActorKind` | U1/ExternalIdentityMapping.actor_kind | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeBindingViewQuery` | §7 Q01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeCommandResult` | §7 C01；§7 C02；§7 C03；§7 C04；§7 C05；§7 C06 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeContinuityViewQuery` | §7 Q03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeDirectionActionSet` | U1/ExternalBinding.directions_actions | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeInstallationRef` | U1/BridgeInstallation.installation_ref；U1/ExternalBinding.installation_ref；U4/ExternalActionBinding.installation_ref；§7 C01；§7 J05；§7 InstallationRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeInternalTargetRef` | U1/ExternalBinding.internal_target；U1/ExternalBinding 参数 target；U1/ExternalLocationMapping.internal_target；U1/ExternalLocationMapping 参数 target；§7 BindingQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeOperationRef` | U2/InboundHandoffRecord.operation_ref；U2/InboundHandoffRecord 参数 operation；U3/DeliveryIntent.operation_ref；U4/ExternalActionBinding 参数 operation；U4/CallbackHandoffRecord.operation_ref；U4/CallbackHandoffRecord 参数 operation；U6/SafeAuditRecord.operation_ref；U6/SafeHandoffRecord.operation_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeOperationViewQuery` | §7 Q02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeReadResult` | §7 Q01；§7 Q02；§7 Q03；§7 Q04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeTargetMode` | §7 ConversationHandoffPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeTargetModeSlot` | U2/InboundHandoffRecord.target_mode | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `BridgeViewSubjectRef` | U6/BridgeLocalView.view_subject；U6/BridgeLocalView 参数 subject；§7 SafeReadQualificationPort；§7 SafeTraceRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CallbackConsumeResult` | §7 E03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CallbackRecordRef` | U4/CallbackHandoffRecord.callback_ref；§7 CallbackRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CallbackSafeEnvelope` | §7 E03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CallbackSnapshot` | §7 CallbackRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CallbackVerificationRef` | U4/CallbackHandoffRecord 参数 verification；§7 E03；§7 CallbackVerificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CallbackVerificationRefSlot` | U4/CallbackHandoffRecord.verification_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CanonicalSafeMaterialRef` | U6/SafeHandoffRecord.canonical_material_ref；U6/SafeHandoffRecord 参数 material；§7 O01；§7 SafeObservationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CapabilitySnapshotRef` | U1/BridgeInstallation.capability_ref；U3/SafePresentationPlan.capability_ref；§7 PlatformIngressPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CommandMetadata` | §7 C01；§7 C02；§7 C03；§7 C04；§7 C05；§7 C06 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CommittedLocalMutationRef` | §7 LocalUnitOfWorkPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CommittedSourceRefEnvelope` | §7 E02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CommittedSourceVersionRef` | U3/SafePresentationPlan.source_ref_version；U3/SafePresentationPlan 参数 source；§7 C04；§7 E02；§7 PresentationQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ComparablePositionRef` | U5/StreamCursor 参数 candidate | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ConfigRevision` | U1/BridgeInstallation.config_revision；U1/BridgeInstallation 参数 revision | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ConfigurationBasisRef` | U1/BridgeInstallation 参数 basis；§7 C01；§7 ConfigQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ConsumerDispositionRef` | U6/SafeHandoffRecord 参数 result；§7 E04；§7 SafeObservationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ConsumerDispositionRefSlot` | U6/SafeHandoffRecord.consumer_result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ContinuityCoverageRef` | U5/StreamCursor 参数 coverage | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ContinuityCoverageRefSlot` | U5/StreamCursor.coverage_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ContinuitySnapshot` | §7 ContinuityRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CurrentActionQualification` | U4/ExternalActionBinding 参数 qualification；§7 OwnerActionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CurrentBindingQualification` | U1/ExternalIdentityMapping 参数 current；U1/ExternalLocationMapping 参数 current；§7 BindingQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CurrentMaterialQualification` | §7 PrivateMaterialPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CurrentPresentationQualification` | U3/SafePresentationPlan 参数 qualification；§7 PresentationQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CurrentReadQualification` | U6/SafeAuditRecord 参数 read_basis；U6/BridgeLocalView 参数 read_basis；§7 SafeReadQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CursorNamespaceStream` | U5/StreamCursor.namespace_stream；U5/StreamCursor 参数 stream | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `CursorRevision` | U5/StreamCursor.revision | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DedupNamespaceScope` | U5/DedupRecord.namespace_scope；U5/DedupRecord 参数 namespace；§7 ContinuityRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DedupRecordRef` | U5/DedupRecord.dedup_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DeliveryDependencyRefSlot` | U5/DispatchLane.head_dependency；§7 LaneRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DeliveryEffectRef` | U3/DeliveryIntent.effect_ref；U3/PlatformReceipt 参数 effect | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DeliveryEffectRefSlot` | U1/ExternalMessageMapping.effect_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DeliveryIntentEffectRef` | U3/DeliveryAttempt.intent_effect | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DeliveryIntentRef` | U3/DeliveryIntent.intent_ref；U3/DeliveryAttempt 参数 intent；U5/DispatchLane 参数 intent；§7 C04；§7 J01；§7 DeliveryRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |

| `DeliverySnapshot` | §7 DeliveryRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DirectionActionKind` | U1/ExternalLocationMapping 参数 action；§7 BindingQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DisclosureQualificationRef` | U3/SafePresentationPlan 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DisclosureQualificationRefSlot` | U3/SafePresentationPlan.disclosure_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DispatchEligibilityRef` | U3/DeliveryIntent 参数 qualification；U3/DeliveryAttempt.qualification_ref；U3/DeliveryAttempt 参数 qualification；U5/DispatchLane 参数 qualification；§7 J01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DispatchJobResult` | §7 J01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `DispatchLaneRef` | U3/DeliveryIntent.lane_ref；U5/DispatchLane.lane_ref；§7 LaneRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExistingLocalSnapshot` | U6/BridgeLocalView 参数 snapshot；§7 SafeTraceRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExpectedConfigRevision` | §7 C01；§7 InstallationRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExpectedCursorRevision` | U5/StreamCursor 参数 expected | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExpectedGeneration` | U1/ExternalBinding 参数 expected | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExpectedLaneRevision` | U5/DispatchLane 参数 expected；§7 LaneRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExpectedLocalRevision` | §7 InboundRepository；§7 DeliveryRepository；§7 CallbackRepository；§7 ContinuityRepository；§7 SafeTraceRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExpectedLocalRevisionSet` | §7 LocalUnitOfWorkPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalAccountLocator` | U1/ExternalIdentityMapping.external_account；U1/ExternalIdentityMapping 参数 account；§7 ActorResponsibilityPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalActionBindingRef` | U4/ExternalActionBinding.action_binding_ref；U4/CallbackHandoffRecord 参数 binding；§7 C05；§7 CallbackVerificationPort；§7 CallbackRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalActionBindingRefSlot` | U4/CallbackHandoffRecord.action_binding_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalBindingRef` | U1/ExternalBinding.binding_ref；U1/ExternalIdentityMapping.binding_ref；U1/ExternalLocationMapping.binding_ref；§7 C02；§7 C04；§7 J05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalChangeKind` | U1/ExternalMessageMapping.change_kind；U1/ExternalMessageMapping 参数 kind | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalDeliveryKind` | U3/DeliveryIntent.operation_kind；§7 C04；§7 PresentationQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalLocationLocator` | U1/ExternalLocationMapping.external_location；U1/ExternalLocationMapping 参数 location | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalMessageLocator` | U1/ExternalMessageMapping.external_message；U1/ExternalMessageMapping 参数 locator | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ExternalScopeLocator` | U1/ExternalBinding.external_scope；U1/ExternalBinding 参数 external_scope；§7 BindingQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `FencedClaimRef` | U3/DeliveryIntent 参数 claim；U3/DeliveryAttempt.claim_ref；U3/DeliveryAttempt 参数 claim；§7 PlatformDeliveryPort；§7 LaneRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `FencedClaimRefSlot` | U5/DispatchLane.claim_fence | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `GapRecoveryJobResult` | §7 J03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `GapRef` | U5/GapRecord.gap_ref；§7 J03；§7 ContinuityRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `HandoffClaimRef` | U2/InboundHandoffRecord 参数 claim | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `HandoffConsumeResult` | §7 E04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `IdentityMappingBasisRef` | U1/ExternalIdentityMapping.basis；U1/ExternalIdentityMapping 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `IdentityMappingRef` | U1/ExternalIdentityMapping.mapping_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ImmutableDeliveryTargetRef` | U3/DeliveryIntent.target_context；U3/DeliveryIntent 参数 target；§7 PresentationQualificationPort；§7 PlatformDeliveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InboundConsumeResult` | §7 E01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InboundRecordRef` | U2/InboundHandoffRecord.record_ref；§7 InboundRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InboundSafeEnvelope` | §7 E01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InboundSnapshot` | §7 InboundRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `IngressVerificationResult` | §7 PlatformIngressPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InstallationConfigDraft` | §7 C01；§7 ConfigQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InstallationNamespace` | U1/BridgeInstallation.namespace；U1/BridgeInstallation 参数 namespace | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InstallationQualificationRef` | U1/BridgeInstallation 参数 qualification；§7 ConfigQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InstallationQualificationRefSlot` | U1/BridgeInstallation.qualification | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `InstallationSnapshot` | §7 InstallationRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `JobContinuityMetadata` | §7 J01；§7 J02；§7 J03；§7 J04；§7 J05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `KnownMappingResultRef` | U1/ExternalMessageMapping 参数 result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `KnownPlatformBusinessResult` | §7 PlatformDeliveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `KnownPlatformBusinessResultKind` | U3/PlatformReceipt.result_kind；U3/PlatformReceipt 参数 kind | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `LaneRevision` | U5/DispatchLane.revision | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `LaneSnapshot` | §7 LaneRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `LocalAttemptDispositionRef` | U5/DispatchLane 参数 disposition | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `LocalMutationRef` | U6/SafeAuditRecord.mutation_ref；U6/SafeAuditRecord 参数 mutation | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `LocationMappingBasisRef` | U1/ExternalLocationMapping.basis；U1/ExternalLocationMapping 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `LocationMappingRef` | U1/ExternalLocationMapping.mapping_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `MappingBasisRef` | U1/ExternalMessageMapping 参数 basis；§7 C03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `MappingGenerationDirection` | U1/ExternalMessageMapping.generation_direction | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `MappingInvalidationBasisRef` | U1/ExternalIdentityMapping 参数 basis；U1/ExternalLocationMapping 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `MappingRef` | §7 C03；§7 MappingRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `MessageMappingRef` | U1/ExternalMessageMapping.mapping_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `NoEffectBasisRef` | U3/DeliveryIntent 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `NoEffectBasisRefSlot` | U3/PlatformReceipt.no_effect_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OneUseClaimRef` | U4/CallbackHandoffRecord 参数 claim；§7 CallbackRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OneUseClaimRefSlot` | U4/CallbackHandoffRecord.one_use_claim | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OpaqueSecretBindingRef` | U1/BridgeInstallation.secret_binding；U1/BridgeInstallation 参数 secret_binding；§7 SecretResolutionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OpaqueStreamPositionSlot` | U5/StreamCursor.position | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OriginalHandoffOperationRef` | §7 SafeObservationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OriginalOperationEffectRef` | U5/DedupRecord.operation_effect；U5/RecoveryRecord.operation_effect；U5/RecoveryRecord 参数 operation；§7 C06；§7 AuthoritativeRecoveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OriginalOperationRef` | §7 ConversationHandoffPort；§7 InboundRepository；§7 OwnerActionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OriginalRecoverableSubjectRef` | U5/RecoveryRecord.original_subject；U5/RecoveryRecord 参数 subject；§7 C06；§7 AuthoritativeRecoveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerAcceptedRefSlot` | U1/ExternalMessageMapping.owner_result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerActionQualificationRef` | U4/CallbackHandoffRecord 参数 qualification | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerActionResultRef` | U4/CallbackHandoffRecord 参数 result；§7 OwnerActionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerActionResultRefSlot` | U4/CallbackHandoffRecord.owner_result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerActionStateRevision` | U4/ExternalActionBinding.owner_revision | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerChangeDispositionRef` | U1/ExternalMessageMapping 参数 disposition | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerHandoffResultRef` | U2/InboundHandoffRecord 参数 result；§7 ConversationHandoffPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerHandoffResultRefSlot` | U2/InboundHandoffRecord.owner_result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerRequiredDigestRefSlot` | U2/InboundHandoffRecord.required_digest_ref；§7 ConversationHandoffPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerTargetActionRef` | U4/ExternalActionBinding.target_action；U4/ExternalActionBinding 参数 action；§7 C05；§7 ActorResponsibilityPort；§7 OwnerActionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `OwnerTargetActionRefSlot` | U4/CallbackHandoffRecord.owner_action_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ParentLocationRefSlot` | U1/ExternalLocationMapping.parent_location | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PlatformBusinessResultRef` | U3/DeliveryAttempt 参数 result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |

| `PlatformBusinessResultRefSlot` | U3/DeliveryAttempt.result_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PlatformKind` | U1/BridgeInstallation.platform_kind | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PlatformRateLimitBasisRef` | U5/DispatchLane 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PlatformReceiptRef` | U3/DeliveryIntent 参数 receipt；U3/PlatformReceipt.receipt_ref；§7 DeliveryRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PlatformResultAuthorityRef` | U3/PlatformReceipt.authority_basis；U3/PlatformReceipt 参数 authority | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PresentationInvalidationBasisRef` | U3/SafePresentationPlan 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PresentationPlanRef` | U3/SafePresentationPlan.plan_ref；U3/DeliveryIntent.plan_ref；U3/DeliveryIntent 参数 plan | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PrivateCallbackContext` | §7 CallbackVerificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `PrivateIngressContext` | §7 PlatformIngressPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ProducerAdmissionRef` | U6/SafeHandoffRecord.producer_admission；U6/SafeHandoffRecord 参数 admission；§7 O01；§7 J04；§7 SafeObservationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ProtocolAckDisposition` | U2/InboundHandoffRecord.protocol_disposition；U4/CallbackHandoffRecord.protocol_disposition | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ProtocolAckPlan` | §7 PlatformIngressPort；§7 CallbackVerificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualificationInvalidationPlan` | §7/8 J05；各对象所属Application失效处理 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualificationJobResult` | §7 J05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualificationMaintenanceBasisRef` | §7 J05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedCallbackContext` | §7 E03 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedGapRangeRef` | U5/GapRecord.range_ref；U5/GapRecord 参数 range | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedIdempotencyKey` | U5/DedupRecord.idempotency_key；U5/DedupRecord 参数 key | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedIngressContext` | §7 E01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedLaneOrderScope` | U5/DispatchLane.order_scope；U5/DispatchLane 参数 scope | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedLocalMutationPlan` | §7 LocalUnitOfWorkPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedMaterialRef` | U2/InboundHandoffRecord 参数 material；§7 ConversationHandoffPort；§7 PrivateMaterialPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedMaterialRefSlot` | U2/InboundHandoffRecord.material_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedPresentationKind` | U3/SafePresentationPlan.presentation_kind | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedRateLimitBounds` | §7 PlatformDeliveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedRateLimitBoundSet` | U5/DispatchLane.rate_bounds；§7 LaneRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedRetentionWindowRef` | U5/DedupRecord.retention_window；U6/SafeHandoffRecord.retention_window | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedSecretUseContext` | §7 SecretResolutionPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QualifiedStreamEpoch` | U5/StreamCursor.epoch；U5/StreamCursor 参数 epoch | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `QueryMetadata` | §7 Q01；§7 Q02；§7 Q03；§7 Q04；§7 SafeReadQualificationPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RateLimitQualificationRef` | U5/DispatchLane 参数 rate_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryAuthorizationRef` | U5/RecoveryRecord 参数 basis；§7 C06 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryJobResult` | §7 J02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryQualificationRef` | U5/GapRecord 参数 qualification；U5/RecoveryRecord 参数 qualification；§7 J03；§7 AuthoritativeRecoveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryQualificationRefSlot` | U5/RecoveryRecord.qualification_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryRecordRef` | U5/RecoveryRecord.recovery_ref；§7 C06；§7 J02；§7 ContinuityRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryRecordRefSlot` | U5/GapRecord.recovery_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RecoveryWindowRef` | U5/GapRecord.window_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RetentionExpiryBasisRef` | U5/DedupRecord 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RetryBudgetRef` | U3/DeliveryIntent 参数 budget；U5/DispatchLane.retry_budget | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RetryEligibilityRefSlot` | U3/DeliveryIntent.retry_basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RevocationBasisRef` | U1/ExternalBinding 参数 basis；U4/ExternalActionBinding 参数 basis | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `RoutePolicyRef` | U1/BridgeInstallation.route_policy | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeAuditRef` | U6/SafeAuditRecord.audit_ref；U6/SafeHandoffRecord.source_audit_ref；U6/SafeHandoffRecord 参数 source；§7 O01；§7 SafeTraceRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeBasisRefSet` | U6/SafeAuditRecord.basis_refs | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeConsumerResultEnvelope` | §7 E04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeEventMetadata` | §7 O01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeGapReason` | U5/GapRecord.reason；U5/GapRecord 参数 reason | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeHandoffClaimRef` | U6/SafeHandoffRecord 参数 claim | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeHandoffJobResult` | §7 J04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeHandoffRef` | U6/SafeHandoffRecord.handoff_ref；§7 J04；§7 SafeTraceRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeHandoffSnapshot` | §7 SafeTraceRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeHandoffViewQuery` | §7 Q04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeOriginalResultRef` | U5/DedupRecord 参数 result | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeOriginalResultRefSlot` | U5/DedupRecord.result_ref | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafePresentationPlan` | §7 C04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeProducerSchemaRevision` | U6/SafeAuditRecord.producer_revision | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeReasonCode` | U1/ExternalBinding 参数 reason；U3/DeliveryIntent 参数 reason；U3/DeliveryAttempt 参数 reason；U3/PlatformReceipt.safe_reason；U5/GapRecord 参数 reason；U5/RecoveryRecord.safe_reason；U5/RecoveryRecord 参数 reason | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeRecoveryResolutionKind` | U5/RecoveryRecord.resolution_kind；U5/RecoveryRecord 参数 kind | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeSourceRef` | U2/InboundHandoffRecord 参数 safe_source | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeSourceRefSlot` | U2/InboundHandoffRecord.source_ref；§7 PlatformIngressPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeSourceVersionRef` | U1/ExternalMessageMapping.source_ref_version；U1/ExternalMessageMapping 参数 source；§7 ConversationHandoffPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeStageReason` | U6/SafeAuditRecord.stage_reason | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeStageSlice` | U6/BridgeLocalView.stage_slice | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SafeViewDisposition` | U6/BridgeLocalView.availability | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SourceConsumeResult` | §7 E02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `SourceIntentMessageRef` | U4/ExternalActionBinding.source_intent；U4/ExternalActionBinding 参数 source；§7 C05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `StableEffectIdentity` | U3/DeliveryIntent 参数 effect；§7 PlatformDeliveryPort | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `StableSourceProjectionRef` | U3/DeliveryIntent.source_projection | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `StreamCursorRef` | U5/StreamCursor.cursor_ref；U5/GapRecord.cursor_ref；U5/GapRecord 参数 cursor；§7 J03；§7 ContinuityRepository | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `StreamEpochChangeRef` | U5/StreamCursor 参数 epoch | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `TrustedConsumerContext` | §7 E04 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `TrustedJobContext` | §7 J01；§7 J02；§7 J03；§7 J04；§7 J05 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `TrustedProducerContext` | §7 E02 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `TrustedTraceRef` | U6/SafeAuditRecord.trace_ref；U6/SafeAuditRecord 参数 trace | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `VerifiedExternalMessageLocatorSlot` | U3/PlatformReceipt.external_locator | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `VerifiedOriginMarkerRef` | U1/ExternalMessageMapping.origin_marker | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `VerifiedPlatformSourceRef` | U2/InboundHandoffRecord 参数 source；§7 E01 | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `ViewFreshnessKind` | U6/BridgeLocalView.freshness | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |
| `VisibleSafeRefSet` | U6/BridgeLocalView.qualified_refs | 完整typed定义或正式shared绑定；对应§7 port/source authority、version/scope/expiry/failure及state required，禁止raw材料与权限推断 |

## 3. 收束与资格

待03逐项设计关闭；不在02给完整schema/DDL/函数返回签名。凡改变主语/能力/状态边而非类型细化，回02重审。真实owner/平台/consumer资格不足，受影响分支blocked/waiting，不由类型定义伪造。
