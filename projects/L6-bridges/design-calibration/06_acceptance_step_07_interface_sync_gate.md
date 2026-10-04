# L6-bridges 06 Step7：接口同步

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step7 / 书写§5.7；回填正式06§7。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| interface_sync_gate | pass | design_static_only_external_gates_open | enter_step_8 | Step6 17红线；00§6/12/14；01§8依赖裁剪；03§7完整protocol/固定surface、§8全部flow、§16.3~16.5；04 route/adapter资格；05各TC/EV。 |

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

6C/4Q/4E/1条件O/5J=20独立协议；另外shared codec、compile、owner runtime、平台/secret/route、event source、local driver/runtime 6个接缝项。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§7已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

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

Step6 17红线；00§6/12/14；01§8依赖裁剪；03§7完整protocol/固定surface、§8全部flow、§16.3~16.5；04 route/adapter资格；05各TC/EV。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. C/Q按fixed route+exact wrapper/body/core metadata/current验收；Q zero write。
2. E normalized不是第三public入口，actual owning source lease及safe recipe/ACK独立；replay须可恢复safe ref/current。
3. Job原subject、original、技术key、claim、actual commit及受权恢复，no run writer。
4. success按各owner/platform/consumer实际authority，不能以transport ACK代。
5. 依赖未就绪只证明local fail-closed/controlled contract，承诺actual positive保持blocked。
6~7. compile仅core与qualified SDK；runtime核port/API/adapter，不要求L1源码；event核注册source/publish/consume/position/replay。
8~9. 20canonical协议逐字段及fixed route/logical label/bin；topic/provider未established只配置资格，不发明已注册topic。
10~12. P0无条件放行缺口，停审与跨接口审查见逐卡及尾表。

#### AC-SYNC-BR-C01 可审查决策记录

- 问题/依据：C01 ConfigureBridgeInstallation如何在03§7正式协议及§8同名处理流；04配置/route；05对应CUT的POST /bridges/v1/commands/configure-installation；BridgeCommandRequest.version/metadata/body→ConfigureBridgeInstallationRequest.installation/action/draft/config_expected/local_expected；draft.namespace/platform_kind/revision/capability/secret_binding/route_policy/basis；BridgeCommandResponse.version/result范围裁决，所需副作用是否同阶段成立？
- 诊断：必须以该fixed Command独立当前阶段裁决，不能把下一Job/owner结果补作当前通过；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“共用HTTP200或最后送达代表本Command通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-C02 可审查决策记录

- 问题/依据：C02 ManageExternalBinding如何在03§7正式协议及§8同名处理流；04配置/route；05对应CUT的POST /bridges/v1/commands/manage-binding；BridgeCommandRequest.version/metadata/body→ManageExternalBindingRequest.proposal；BindingActionProposal.installation/binding/meaning/maintenance/revocation/local_expected；meaning.action/actor/scope/target/actions/generation/basis；BridgeCommandResponse.version/result范围裁决，所需副作用是否同阶段成立？
- 诊断：必须以该fixed Command独立当前阶段裁决，不能把下一Job/owner结果补作当前通过；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“共用HTTP200或最后送达代表本Command通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-C03 可审查决策记录

- 问题/依据：C03 MaintainExternalMapping如何在03§7正式协议及§8同名处理流；04配置/route；05对应CUT的POST /bridges/v1/commands/maintain-mapping；BridgeCommandRequest.version/metadata/body→MaintainExternalMappingRequest.proposal；AuthorizedMappingProposal.binding/generation/change/local_expected；AuthorizedMappingChange LinkIdentity/LinkLocation/LinkMessage/Invalidate/Tombstone；BridgeCommandResponse.version/result范围裁决，所需副作用是否同阶段成立？
- 诊断：必须以该fixed Command独立当前阶段裁决，不能把下一Job/owner结果补作当前通过；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“共用HTTP200或最后送达代表本Command通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-C04 可审查决策记录

- 问题/依据：C04 PrepareExternalDelivery如何在03§7正式协议及§8同名处理流；04配置/route；05对应CUT的POST /bridges/v1/commands/prepare-delivery；BridgeCommandRequest.version/metadata/body→PrepareExternalDeliveryRequest.source/target/kind；CommittedSourceVersionRef、ImmutableDeliveryTargetRef、ExternalDeliveryKind；BridgeCommandResult；BridgeCommandResponse.version/result范围裁决，所需副作用是否同阶段成立？
- 诊断：必须以该fixed Command独立当前阶段裁决，不能把下一Job/owner结果补作当前通过；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“共用HTTP200或最后送达代表本Command通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-C05 可审查决策记录

- 问题/依据：C05 BindExternalAction如何在03§7正式协议及§8同名处理流；04配置/route；05对应CUT的POST /bridges/v1/commands/bind-action；BridgeCommandRequest.version/metadata/body→BindExternalActionRequest.binding/source/target/responsibility；SourceIntentMessageRef、OwnerTargetActionRef、ActorResponsibilityRef；ExternalActionBinding；BridgeCommandResponse.version/result范围裁决，所需副作用是否同阶段成立？
- 诊断：必须以该fixed Command独立当前阶段裁决，不能把下一Job/owner结果补作当前通过；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“共用HTTP200或最后送达代表本Command通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-C06 可审查决策记录

- 问题/依据：C06 RequestBridgeRecovery如何在03§7正式协议及§8同名处理流；04配置/route；05对应CUT的POST /bridges/v1/commands/request-recovery；BridgeCommandRequest.version/metadata/body→RequestBridgeRecoveryRequest.subject/original/authorization；OriginalRecoverableSubjectRef、OriginalOperationEffectRef、RecoveryAuthorizationRef；BridgeCommandResponse.version/result范围裁决，所需副作用是否同阶段成立？
- 诊断：必须以该fixed Command独立当前阶段裁决，不能把下一Job/owner结果补作当前通过；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“共用HTTP200或最后送达代表本Command通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-Q01 可审查决策记录

- 问题/依据：Q01 GetBindingMappingView如何在03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT的POST /bridges/v1/queries/binding-mapping-view；BridgeQueryRequest.version/metadata/body.subject；GetBindingMappingViewRequest=BridgeBindingViewQuery；Installation/Binding/Mapping允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability范围裁决，所需副作用是否同阶段成立？
- 诊断：同一种View不意味着四Query可以互换主语或自动修复；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“合并四Query并遇到stale先refresh”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-Q02 可审查决策记录

- 问题/依据：Q02 GetBridgeOperationView如何在03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT的POST /bridges/v1/queries/operation-view；BridgeQueryRequest.version/metadata/body.subject；GetBridgeOperationViewRequest=BridgeOperationViewQuery；Operation/Inbound/Presentation/Intent/Attempt/Receipt/Action/Callback允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability范围裁决，所需副作用是否同阶段成立？
- 诊断：同一种View不意味着四Query可以互换主语或自动修复；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“合并四Query并遇到stale先refresh”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-Q03 可审查决策记录

- 问题/依据：Q03 GetContinuityView如何在03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT的POST /bridges/v1/queries/continuity-view；BridgeQueryRequest.version/metadata/body.subject；GetContinuityViewRequest=BridgeContinuityViewQuery；Dedup/Cursor/Gap/Lane/Recovery允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability范围裁决，所需副作用是否同阶段成立？
- 诊断：同一种View不意味着四Query可以互换主语或自动修复；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“合并四Query并遇到stale先refresh”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-Q04 可审查决策记录

- 问题/依据：Q04 GetSafeHandoffView如何在03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT的POST /bridges/v1/queries/safe-handoff-view；BridgeQueryRequest.version/metadata/body.subject；GetSafeHandoffViewRequest=SafeHandoffViewQuery；Audit/Handoff允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability范围裁决，所需副作用是否同阶段成立？
- 诊断：同一种View不意味着四Query可以互换主语或自动修复；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“合并四Query并遇到stale先refresh”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-E01 可审查决策记录

- 问题/依据：E01 PlatformInputReceivedConsumer如何在03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT的logical bridge.v1.platform-input-received；四平台已定义HTTP routes或registered resident source；InboundSafeEnvelope→InboundSafePayload.Message/Continuity；actual PlatformInputReceivedInput.consumer/invocation.Private(candidate_event_key,private)或Continuity；InboundConsumeResult范围裁决，所需副作用是否同阶段成立？
- 诊断：logical envelope字段不等actual source/接纳资格，private/transport/owner各阶段必须沿原合同；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“发布或收到normalized envelope就算同步完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-E02 可审查决策记录

- 问题/依据：E02 CommittedSourceAvailableConsumer如何在03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT的logical bridge.v1.committed-source-available；SafeEventTransportHost/owning SafeTransportEventLease；CommittedSourceRefEnvelope.payload.source/target/kind；consumer/event_key来自注册host/envelope recipe；SourceConsumeResult.disposition/operation/intent/local_commit/reason范围裁决，所需副作用是否同阶段成立？
- 诊断：logical envelope字段不等actual source/接纳资格，private/transport/owner各阶段必须沿原合同；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“发布或收到normalized envelope就算同步完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-E03 可审查决策记录

- 问题/依据：E03 PlatformCallbackReceivedConsumer如何在03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT的logical bridge.v1.platform-callback-received；callback private HTTP/registered resident host；CallbackSafeEnvelope(CallbackSafePayload)；actual PlatformCallbackReceivedInput.consumer/candidate_event_key/private；CallbackHandoffRecord/ExternalActionBinding范围裁决，所需副作用是否同阶段成立？
- 诊断：logical envelope字段不等actual source/接纳资格，private/transport/owner各阶段必须沿原合同；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“发布或收到normalized envelope就算同步完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-E04 可审查决策记录

- 问题/依据：E04 SafeHandoffDispositionConsumer如何在03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT的logical bridge.v1.safe-handoff-disposition；qualified safe transport lease original=Some原handoff op；SafeConsumerResultEnvelope.payload.handoff/original/disposition；SafeObservationPort.qualify_disposition；HandoffConsumeResult.disposition/operation/consumer/local_commit/reason范围裁决，所需副作用是否同阶段成立？
- 诊断：logical envelope字段不等actual source/接纳资格，private/transport/owner各阶段必须沿原合同；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“发布或收到normalized envelope就算同步完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-O01 可审查决策记录

- 问题/依据：O01 BridgeLocalDispositionRecordedEvent如何在03§7条件Outbound、§8.1/8.21；04 consumer资格；Observability当前producer map；05 AUDIT/ENTRY/EVIDENCE的logical bridge.v1.local-disposition-recorded；SafeObservationPort::handoff；九字段version/metadata/source/material/admission/handoff/original/schema/retention；SafeAuditRecord/SafeHandoffRecord范围裁决，所需副作用是否同阶段成立？
- 诊断：当前Observability static map无Bridges，这个卡定义未来qualification而不能释放positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“producer配置enable就可签同步通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-J01 可审查决策记录

- 问题/依据：J01 DispatchQueuedDeliveryJob如何在03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT的fixed typed library/dispatch_queued_delivery bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；DispatchQueuedDeliveryJobRequest.delivery: DeliveryIntentEffectRef；DispatchJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立范围裁决，所需副作用是否同阶段成立？
- 诊断：Job技术invocation/key/result与businessoriginal/效果/target不能互代或省字段；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“一次Job完成就宣布对应业务或整个外部流完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-J02 可审查决策记录

- 问题/依据：J02 ReconcileBridgeOperationJob如何在03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT的fixed typed library/reconcile_bridge_operation bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；ReconcileBridgeOperationJobRequest.recovery: RecoveryRecordRef；subject: OriginalRecoverableSubjectRef（Inbound/Callback/Intent/Handoff，非Gap）；RecoveryJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立范围裁决，所需副作用是否同阶段成立？
- 诊断：Job技术invocation/key/result与businessoriginal/效果/target不能互代或省字段；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“一次Job完成就宣布对应业务或整个外部流完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-J03 可审查决策记录

- 问题/依据：J03 ReconcileStreamGapJob如何在03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT的fixed typed library/reconcile_stream_gap bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；ReconcileStreamGapJobRequest.gap: GapRef；GapRecoveryJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立范围裁决，所需副作用是否同阶段成立？
- 诊断：Job技术invocation/key/result与businessoriginal/效果/target不能互代或省字段；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“一次Job完成就宣布对应业务或整个外部流完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-J04 可审查决策记录

- 问题/依据：J04 RetrySafeHandoffJob如何在03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT的fixed typed library/retry_safe_handoff bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；RetrySafeHandoffJobRequest.handoff: SafeHandoffRef；SafeHandoffJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立范围裁决，所需副作用是否同阶段成立？
- 诊断：Job技术invocation/key/result与businessoriginal/效果/target不能互代或省字段；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“一次Job完成就宣布对应业务或整个外部流完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-J05 可审查决策记录

- 问题/依据：J05 RefreshBridgeQualificationJob如何在03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT的fixed typed library/refresh_bridge_qualification bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；RefreshBridgeQualificationJobRequest.subject: BridgeViewSubjectRef；expected: ExpectedLocalRevision；QualificationJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立范围裁决，所需副作用是否同阶段成立？
- 诊断：Job技术invocation/key/result与businessoriginal/效果/target不能互代或省字段；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“一次Job完成就宣布对应业务或整个外部流完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-SHARED 可审查决策记录

- 问题/依据：shared codec/metadata/finite错误闭合如何在00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT的bridge.v1；C/Q version/metadata/body、version/result；E五字段及J wrapper；六core reexport；BridgeProtocolError.issue/area/reason；03§7/§16.5范围裁决，所需副作用是否同阶段成立？
- 诊断：该类依赖必须以自己的authority与证据裁决，不能借另一类接口的成功补齐；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“候选架构/controlledfake等同实际可用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-COMPILE 可审查决策记录

- 问题/依据：L0-core/L0-sdk编译期候选闭包如何在00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT的01§8 compile候选；03 root workspace dependency/Contracts六core reexport；04固定兼容pin/features；SDK adapter外层消费范围裁决，所需副作用是否同阶段成立？
- 诊断：该类依赖必须以自己的authority与证据裁决，不能借另一类接口的成功补齐；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“候选架构/controlledfake等同实际可用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-OWNER 可审查决策记录

- 问题/依据：七上游runtime API/SDK/adapter与typed权威如何在00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT的ConversationHandoffPort、ActorResponsibilityPort、BindingQualificationPort、PresentationQualificationPort、OwnerActionPort、SafeReadQualificationPort、SafeObservationPort；SDKtyped客户端；owner正式callable/schema/basis/current范围裁决，所需副作用是否同阶段成立？
- 诊断：该类依赖必须以自己的authority与证据裁决，不能借另一类接口的成功补齐；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“候选架构/controlledfake等同实际可用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-PLATFORM 可审查决策记录

- 问题/依据：四平台adapter及OAuth/APIKey/KMS/route重核如何在00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT的SlackPlatformAdapter/MattermostPlatformAdapter/TelegramPlatformAdapter/DiscordPlatformAdapter及bound family；04 actual SDK/API/service pin/install/source mode/grant/secret/route/capability；PlatformIngressPort/PlatformDeliveryPort/SecretResolutionPort范围裁决，所需副作用是否同阶段成立？
- 诊断：该类依赖必须以自己的authority与证据裁决，不能借另一类接口的成功补齐；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“候选架构/controlledfake等同实际可用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-EVENT 可审查决策记录

- 问题/依据：事件来源/订阅/publish/replay与projection阶段如何在00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT的qualified SafeEventTransportHost/SafeTransportEventLease、PlatformSourceHost；E01~04/O01 logical labels；L0-bus条件carrier/source recipe/namespace/epoch/comparator/实际disposition范围裁决，所需副作用是否同阶段成立？
- 诊断：该类依赖必须以自己的authority与证据裁决，不能借另一类接口的成功补齐；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“候选架构/controlledfake等同实际可用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-SYNC-BR-LOCAL 可审查决策记录

- 问题/依据：技术driver/executor/clock/ID/runtime资格如何在00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT的LocalUnitOfWorkPort/八Repository/BridgeCallControl；qualifiedsame-driverread/write/unique/CAS/seal/commit与readonlyLocalCommitDisposition；RuntimeExecutionPhase/JobInvocationPhase/SourceSessionPhase/WorkerBatchPhase；04技术bindings范围裁决，所需副作用是否同阶段成立？
- 诊断：该类依赖必须以自己的authority与证据裁决，不能借另一类接口的成功补齐；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“候选架构/controlledfake等同实际可用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

上一阶段来源说明有§8 shorthand；正式03当前public协议位于§7、处理流位于§8、Domain/闭环§16。要沿当前真实章节与canonical名称，不能以历史topic或候选SDK推运行事实。

## 5. 改动前后对比

| 校准 | 原风险 | 本步决定 |
|---|---|---|
| surface | generic webhook/topic含混 | 十fixed POST、private/safe host、五typed Job与条件O逐项 |
| 依赖 | package/runtime混用 | 三依赖类别独立证据与未就绪处理 |
| success | ACK或fake直接提升 | 当前scope/actual权威及阶段独立 |
| 版本 | body/detail名猜测 | 逐字沿03§7/8及完整字段 |

## 6. 验收裁决取舍与复杂度

复杂度高；26独立项采用decision→规范卡→实际静态停审。规范只增加人工裁决项，不新增接口、wrapper、topic、脚本或machine字段。全部gate current planned，缺actual不风险接受。

## 7. 结构化中间产物

### 7.1 协议与依赖共同规则

公共协议唯一为03§7，处理流为§8；bridge.v1、finite错误issue/area/reason、完整递归codec、unknown/duplicate字段拒绝、metadata由各族唯一承载。字段shape不是authority。每张卡固定正式surface；actual route/topic/broker/SDK/host/driver/secret选择都必须在04 seam核验，不声称已注册。

C/Q十个fixed planned JSON POST；E01/E03实际private HTTP/resident host，E02/E04 safe transport owning lease；normalized envelope不增加第三入口；O01条件SafeObservationPort无publish API；J typed library/五bin/eligible bounded batch非HTTP。形式字段名单在卡中，二级所有variant/Slots/载荷按原03§7 factory全量测，不能取代表实例。

### 7.2 独立接口/事件/Job门禁

#### AC-SYNC-BR-C01 C01 ConfigureBridgeInstallation

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-001、AC-BR-037、AC-BR-038；03§7正式协议及§8同名处理流；04配置/route；05对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/commands/configure-installation；BridgeCommandRequest.version/metadata/body→ConfigureBridgeInstallationRequest.installation/action/draft/config_expected/local_expected；draft.namespace/platform_kind/revision/capability/secret_binding/route_policy/basis；BridgeCommandResponse.version/result |
| 通过条件 | Configure仅None+Absent初建；ApplyRevision/Suspend/Retire actual安装+Present+原config CAS；safe draft current资格完整；local/config轴独立，duplicate原meaning复用 |
| 失败条件 | 缺required/ref/version、config/local互代、retire复活、默认SDK/secret或shape当Qualified |
| 副作用断言 | zero platform send/secret值泄露；actual local row/key/result/audit同UoW；配置接受不表示实际可运行 |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-017","EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该surface actual内部host/auth/owner/config/driver须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-C02 C02 ManageExternalBinding

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-002、AC-BR-037、AC-BR-038；03§7正式协议及§8同名处理流；04配置/route；05对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/commands/manage-binding；BridgeCommandRequest.version/metadata/body→ManageExternalBindingRequest.proposal；BindingActionProposal.installation/binding/meaning/maintenance/revocation/local_expected；meaning.action/actor/scope/target/actions/generation/basis；BridgeCommandResponse.version/result |
| 通过条件 | Propose只能None/Absent；其他actualSome/Present；Activate真实两端责任/basis和generation核验；动作conditional fields穷尽；same key fullmeaning复用 |
| 失败条件 | Pending默认激活、权限self-report、撤销被旧generation绕过、同key改meaning目标 |
| 副作用断言 | 不外呼、不创建ownertruth；拒绝不改关系；actual变化unique/key/audit/条件handoff同U |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-014","EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该surface actual内部host/auth/owner/config/driver须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-C03 C03 MaintainExternalMapping

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-003、AC-BR-037、AC-BR-038；03§7正式协议及§8同名处理流；04配置/route；05对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/commands/maintain-mapping；BridgeCommandRequest.version/metadata/body→MaintainExternalMappingRequest.proposal；AuthorizedMappingProposal.binding/generation/change/local_expected；AuthorizedMappingChange LinkIdentity/LinkLocation/LinkMessage/Invalidate/Tombstone；BridgeCommandResponse.version/result |
| 通过条件 | Link Absent、失效/墓碑Present；3kind完整two ends,parent/source/result/origin/basis、currentgeneration；LinkMessage真实Known OwnerAccepted/PlatformAccepted，不接ACK/AuthorizedRelation/Delete |
| 失败条件 | external_id生GlobalMember；缺parent默认root；unknown造Linked；cross namespace/kind、mapping自动target替换 |
| 副作用断言 | owner/channel创建=0；conflict/unsupported无new effect；Tombstone保owner/result历史，不删除两端truth |
| 具体TC | ["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-003","EV-CONTRACT-005","EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该surface actual内部host/auth/owner/config/driver须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-C04 C04 PrepareExternalDelivery

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-007、AC-BR-037、AC-BR-038；03§7正式协议及§8同名处理流；04配置/route；05对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/commands/prepare-delivery；BridgeCommandRequest.version/metadata/body→PrepareExternalDeliveryRequest.source/target/kind；CommittedSourceVersionRef、ImmutableDeliveryTargetRef、ExternalDeliveryKind；BridgeCommandResult；BridgeCommandResponse.version/result |
| 通过条件 | committed及current外显/Gate/Artifact/binding/actor资格齐；同C04/E02 StableEffectIdentity复用；原source/target/kind构造sameplan/intent，degraded only授权安全表达 |
| 失败条件 | uncommitted、敏感正文或缺传播依据仍准备可派发；same effect造第二intent；自动替换kind/target |
| 副作用断言 | 只local prepare，无PlatformDeliveryPort IO；plan/intent/lane关联及key/result/audit原子，local outcome不称receipt |
| 具体TC | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-006","EV-CONTRACT-007","EV-CONTRACT-008","EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该surface actual内部host/auth/owner/config/driver须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-C05 C05 BindExternalAction

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-010、AC-BR-037、AC-BR-038；03§7正式协议及§8同名处理流；04配置/route；05对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/commands/bind-action；BridgeCommandRequest.version/metadata/body→BindExternalActionRequest.binding/source/target/responsibility；SourceIntentMessageRef、OwnerTargetActionRef、ActorResponsibilityRef；ExternalActionBinding；BridgeCommandResponse.version/result |
| 通过条件 | actual known source message/intent；actual install/binding/责任及owner action version/expiry资格；初绑不要求尚不存在callback verification；duplicate原source/action复用 |
| 失败条件 | 签名/按钮授审批；非known source或跨target/action；要求fake callback才能初绑 |
| 副作用断言 | 只bind local，不consume one-use、不发送审批或owner action、不写Decision；完整audit/key/result同U |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该surface actual内部host/auth/owner/config/driver须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-C06 C06 RequestBridgeRecovery

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-014、AC-BR-037、AC-BR-038；03§7正式协议及§8同名处理流；04配置/route；05对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/commands/request-recovery；BridgeCommandRequest.version/metadata/body→RequestBridgeRecoveryRequest.subject/original/authorization；OriginalRecoverableSubjectRef、OriginalOperationEffectRef、RecoveryAuthorizationRef；BridgeCommandResponse.version/result |
| 通过条件 | AuthoritativeRecoveryPort.qualify_request真实actor/scope/current与原subject/op；登记same recovery；Gap可申请但执行J03；request≠Resolved |
| 失败条件 | body authority自签、换op/effect；登记即probe/重发/清unknown；无实际原subject |
| 副作用断言 | zero probe/send/advance；只current请求记录，原unknown责任与identity保留，重复复用 |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013","EV-CONTRACT-001","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该surface actual内部host/auth/owner/config/driver须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-Q01 Q01 GetBindingMappingView

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-016、BR-BR-023、AC-BR-035；03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/queries/binding-mapping-view；BridgeQueryRequest.version/metadata/body.subject；GetBindingMappingViewRequest=BridgeBindingViewQuery；Installation/Binding/Mapping允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability |
| 通过条件 | 仅该allowlist定位→resolver current读资格→实际complete committed snapshot→纯projector→返回前visibility重核；metadata page/key=None；Strong不足Unavailable；已允许exact absent才NotFound，hidden Denied不泄存在 |
| 失败条件 | 跨allowlist、非null page/key、伪empty/fresh或hidden counts；依赖不可用改为空成功；projection推授权；raw resume/cursor公开 |
| 副作用断言 | DB/local/owner/platform写=0，无reserve/audit/refresh/rebuild/repair/advance/replay；unknown仅原stage marker，展示不是maintenance |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-001","EV-CONTRACT-002"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current subject读资格及actual完整local driver snapshot须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-Q02 Q02 GetBridgeOperationView

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-016、BR-BR-023、AC-BR-035；03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/queries/operation-view；BridgeQueryRequest.version/metadata/body.subject；GetBridgeOperationViewRequest=BridgeOperationViewQuery；Operation/Inbound/Presentation/Intent/Attempt/Receipt/Action/Callback允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability |
| 通过条件 | 仅该allowlist定位→resolver current读资格→实际complete committed snapshot→纯projector→返回前visibility重核；metadata page/key=None；Strong不足Unavailable；已允许exact absent才NotFound，hidden Denied不泄存在 |
| 失败条件 | 跨allowlist、非null page/key、伪empty/fresh或hidden counts；依赖不可用改为空成功；projection推授权；raw resume/cursor公开 |
| 副作用断言 | DB/local/owner/platform写=0，无reserve/audit/refresh/rebuild/repair/advance/replay；unknown仅原stage marker，展示不是maintenance |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-001","EV-CONTRACT-008"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current subject读资格及actual完整local driver snapshot须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-Q03 Q03 GetContinuityView

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-016、BR-BR-023、AC-BR-035；03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/queries/continuity-view；BridgeQueryRequest.version/metadata/body.subject；GetContinuityViewRequest=BridgeContinuityViewQuery；Dedup/Cursor/Gap/Lane/Recovery允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability |
| 通过条件 | 仅该allowlist定位→resolver current读资格→实际complete committed snapshot→纯projector→返回前visibility重核；metadata page/key=None；Strong不足Unavailable；已允许exact absent才NotFound，hidden Denied不泄存在 |
| 失败条件 | 跨allowlist、非null page/key、伪empty/fresh或hidden counts；依赖不可用改为空成功；projection推授权；raw resume/cursor公开 |
| 副作用断言 | DB/local/owner/platform写=0，无reserve/audit/refresh/rebuild/repair/advance/replay；unknown仅原stage marker，展示不是maintenance |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-001","EV-CONTRACT-011"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current subject读资格及actual完整local driver snapshot须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-Q04 Q04 GetSafeHandoffView

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-016、BR-BR-023、AC-BR-035；03§7 Query、§8对应flow、§16.4/16.5；05 READ/SURFACE及对应CUT |
| 正式对象/字段/协议/状态 | POST /bridges/v1/queries/safe-handoff-view；BridgeQueryRequest.version/metadata/body.subject；GetSafeHandoffViewRequest=SafeHandoffViewQuery；Audit/Handoff允许族；BridgeQueryResponse.version/result；BridgeLocalView六字段view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability |
| 通过条件 | 仅该allowlist定位→resolver current读资格→实际complete committed snapshot→纯projector→返回前visibility重核；metadata page/key=None；Strong不足Unavailable；已允许exact absent才NotFound，hidden Denied不泄存在 |
| 失败条件 | 跨allowlist、非null page/key、伪empty/fresh或hidden counts；依赖不可用改为空成功；projection推授权；raw resume/cursor公开 |
| 副作用断言 | DB/local/owner/platform写=0，无reserve/audit/refresh/rebuild/repair/advance/replay；unknown仅原stage marker，展示不是maintenance |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-001","EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current subject读资格及actual完整local driver snapshot须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-E01 E01 PlatformInputReceivedConsumer

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-004、FR-BR-005、FR-BR-006、BR-BR-006、BR-BR-007、AC-BR-009；03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT |
| 正式对象/字段/协议/状态 | logical bridge.v1.platform-input-received；四平台已定义HTTP routes或registered resident source；InboundSafeEnvelope→InboundSafePayload.Message/Continuity；actual PlatformInputReceivedInput.consumer/invocation.Private(candidate_event_key,private)或Continuity；InboundConsumeResult |
| 通过条件 | registered source/mode/install和private verifier当前；safe source/typed mapping/material/actor/target mode准入；同source recipe key去重/anti-loop；Private ACK按平台实际期限独立，same original owner交接；Continuity仅Protocol notice的key/cursor/gap当地记录 |
| 失败条件 | normalized第三public入口绕verification；信body marker；无safe ref自称可靠接管；ACK等owner提交；Continuity伪消息/owner调用/关闭gap |
| 副作用断言 | invalid无Inbound/Dedup/owneroperation，only实际protocol response；Continuity zero Conversation/Actor/PrivateMaterial/OwnerAction/PlatformDelivery/ACK；actual unknown保原mutation/op，raw不durable |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-005","EV-CONTRACT-011","EV-CONTRACT-019","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前注册source host/owner/consumer exact schema/安装/lease/route资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-E02 E02 CommittedSourceAvailableConsumer

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-007、FR-BR-009、BR-BR-010、AC-BR-016；03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT |
| 正式对象/字段/协议/状态 | logical bridge.v1.committed-source-available；SafeEventTransportHost/owning SafeTransportEventLease；CommittedSourceRefEnvelope.payload.source/target/kind；consumer/event_key来自注册host/envelope recipe；SourceConsumeResult.disposition/operation/intent/local_commit/reason |
| 通过条件 | 正式owner committed source/current实际资格，原safe source schema/mode/scope/version；C04/E02同StableEffectIdentity统一effect而event dedup独立；同原source/target/kind prepare，无send；transport actual一次ACK只协议 |
| 失败条件 | local label冒称上游同名event/已建topic；commit等披露许可；迟到旧version覆盖或第二effect；无transport lease/current |
| 副作用断言 | 只same plan/intent/key/result/audit同U；zeroPlatformDeliveryPort；source duplicate原结果current过滤；不可从ACK造commit/effect，无raw queue |
| 具体TC | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-006","EV-CONTRACT-008","EV-CONTRACT-007","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前注册source host/owner/consumer exact schema/安装/lease/route资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-E03 E03 PlatformCallbackReceivedConsumer

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-010、FR-BR-011、BR-BR-014、BR-BR-016、AC-BR-023；03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT |
| 正式对象/字段/协议/状态 | logical bridge.v1.platform-callback-received；callback private HTTP/registered resident host；CallbackSafeEnvelope(CallbackSafePayload)；actual PlatformCallbackReceivedInput.consumer/candidate_event_key/private；CallbackHandoffRecord/ExternalActionBinding |
| 通过条件 | 先verified source→actual stored action/source→actor/owner/action/expiry/binding核验；one-use/callback/dedup/result/audit actual claim commit后才handoff owner；same op duplicate，ACK/deferred与owner result分开，结果current读取 |
| 失败条件 | 签名即internal权限、跨user/target、claim未commit仍执行owner；stale/expired延长token；改op重交unknown；审批选择/token/context公开 |
| 副作用断言 | invalid或不足zero owner action；claim一次CAS，已claimed不复活；owner二次决定，不localDecision/Runtime/Tools；post-effect未知保责任、private只短借 |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-010","EV-CONTRACT-019","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前注册source host/owner/consumer exact schema/安装/lease/route资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-E04 E04 SafeHandoffDispositionConsumer

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、BR-BR-022、AC-BR-034；03§7四Inbound/§8.12~15/§16.5；04 source/admission；05对应CUT |
| 正式对象/字段/协议/状态 | logical bridge.v1.safe-handoff-disposition；qualified safe transport lease original=Some原handoff op；SafeConsumerResultEnvelope.payload.handoff/original/disposition；SafeObservationPort.qualify_disposition；HandoffConsumeResult.disposition/operation/consumer/local_commit/reason |
| 通过条件 | 正式consumer/source/schema/op/admission/current兼容；原handoff/audit/retained result完整读取，同original；真实disposition只对应stage；Pending不Accepted，Unknown保原，非递归规则正式Qualified才能local finalize |
| 失败条件 | ACK即ConsumerAccepted；无原handoff造canonical/audit；改label借SourceOwner/Governance准入；递归O01或fake证据 |
| 副作用断言 | 只原record+dedup/result/audit同localU，不回写consumertruth；zero new producer/canonical/O01/evidence/verdict；当前Observability无Bridgesproducer positive blocked |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-019","EV-CONTRACT-021"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前注册source host/owner/consumer exact schema/安装/lease/route资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-O01 O01 BridgeLocalDispositionRecordedEvent

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、BR-BR-022、AC-BR-034；03§7条件Outbound、§8.1/8.21；04 consumer资格；Observability当前producer map；05 AUDIT/ENTRY/EVIDENCE |
| 正式对象/字段/协议/状态 | logical bridge.v1.local-disposition-recorded；SafeObservationPort::handoff；九字段version/metadata/source/material/admission/handoff/original/schema/retention；SafeAuditRecord/SafeHandoffRecord |
| 通过条件 | 同actual mutation唯一immutable audit，currentcanonical/schema/admission/window及actual commit/claim/final核验齐；原event identity/material/op不换；正式consumer实际可消费及same-op重放合同；只条件原mutation/J04，无独立publishAPI |
| 失败条件 | local audit升EV；commit前交接、无claim双发；factory shape/admission配置即准入；假Bus/topic/SourceOwner身份或transport ACK当accepted |
| 副作用断言 | audit-only有formalrule才handoff=None；缺producer资格限制相应positive，zeroemptycanonical/O01；非递归lifecycle无新producer；unknown保sameconsumerop |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-019","EV-CONTRACT-021"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际正式Observability Bridge producer/source family/schema/非递归规则与真实consumer结果须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-J01 J01 DispatchQueuedDeliveryJob

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-009、AC-BR-037、AC-BR-038；03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT |
| 正式对象/字段/协议/状态 | fixed typed library/dispatch_queued_delivery bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；DispatchQueuedDeliveryJobRequest.delivery: DeliveryIntentEffectRef；DispatchJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立 |
| 通过条件 | 完整intent/effect/install/relation/mapping/plan/lane/allratebounds/current/private/secret；actual fenced claim同UoW commit后finally核验才最多一次method；knownbusiness才receipt；NoEffect/current/lane/window/budget齐才same-effect retry |
| 失败条件 | claim/stage当commit、SDK隐藏retry、HTTP2xx即accepted、越unknownhead或改target/kind |
| 副作用断言 | claim/result两UoW，不持tx外呼；unknown原effect/head保留；第二U保存真实attempt/receipt/lane/knownmapping或墓碑及原result/audit |
| 具体TC | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-008","EV-CONTRACT-012","EV-CONTRACT-014","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current maintenance/operations host/actual local driver/read-only probe/平台或consumer对应分支须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-J02 J02 ReconcileBridgeOperationJob

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-014、AC-BR-037、AC-BR-038；03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT |
| 正式对象/字段/协议/状态 | fixed typed library/reconcile_bridge_operation bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；ReconcileBridgeOperationJobRequest.recovery: RecoveryRecordRef；subject: OriginalRecoverableSubjectRef（Inbound/Callback/Intent/Handoff，非Gap）；RecoveryJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立 |
| 通过条件 | get_recovery实际完整row+subject/original匹配；current qualified readonly LocalCommit/Owner/Platform/Consumer分支及credential仅需时；known原stage finalize，NotFound不是NoEffect |
| 失败条件 | Gap误进J02、换op/record、probe send或重新append/approve；unknown强转resolved |
| 副作用断言 | zero send/ownernewaction；known mapping/lane完整read/CAS/current否则只保已知事实；sameoriginal immutable result不改；postprobe unknown保责任 |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013","EV-CONTRACT-014","EV-CONTRACT-008","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current maintenance/operations host/actual local driver/read-only probe/平台或consumer对应分支须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-J03 J03 ReconcileStreamGapJob

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-012、AC-BR-037、AC-BR-038；03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT |
| 正式对象/字段/协议/状态 | fixed typed library/reconcile_stream_gap bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；ReconcileStreamGapJobRequest.gap: GapRef；GapRecoveryJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立 |
| 通过条件 | actualgap/cursor/原C06recovery关联+window/stream/epoch/comparator/current；authoritative fullrange coverage才能close；另完整stage ContinuityCoverageRef才advance，partial保Open、未知Manual；actualatomicCAS |
| 失败条件 | 无recovery/basis猜权；gapcoverage当stagecoverage、跨epoch/stringcompare、再连就close；GapState.Partial |
| 副作用断言 | zero rawreplay/send；没有stagecoverage最多closegap不advance；cursor两revision轴保真；unknown/partial不完整报告 |
| 具体TC | ["TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-011","EV-CONTRACT-013","EV-CONTRACT-014","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current maintenance/operations host/actual local driver/read-only probe/平台或consumer对应分支须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-J04 J04 RetrySafeHandoffJob

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、AC-BR-037、AC-BR-038；03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT |
| 正式对象/字段/协议/状态 | fixed typed library/retry_safe_handoff bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；RetrySafeHandoffJobRequest.handoff: SafeHandoffRef；SafeHandoffJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立 |
| 通过条件 | 原record/canonical/schema/op/producer/current/window；actual claimcommit后交接，knownconsumerresult只finalize；重交需formalNoEffect或正式same-op幂等保证，resume需原合同完整条件 |
| 失败条件 | 换canonical/op、unknown盲重交、timeout/ACK/NotFound作noeffect；缺producer兼容仍发；递归producer |
| 副作用断言 | zero newcanonical/sourceaudit/O01 family；当前actualqualifiednonrecursive才同Urecord/result/audit；unknown保原consumerop/claim，不报accepted |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-013","EV-CONTRACT-014","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current maintenance/operations host/actual local driver/read-only probe/平台或consumer对应分支须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-J05 J05 RefreshBridgeQualificationJob

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-001、AC-BR-037、AC-BR-038；03§7五Job、§8.16~20/§16.3；04 qualification/runtime预算；05对应CUT |
| 正式对象/字段/协议/状态 | fixed typed library/refresh_bridge_qualification bin/Jobs dispatcher，非HTTP；BridgeJobRequest.version/metadata(JobContinuityMetadata唯一)/body；RefreshBridgeQualificationJobRequest.subject: BridgeViewSubjectRef；expected: ExpectedLocalRevision；QualificationJobResult及BridgeJobResponse唯一summary；actual JobInvocationPlan/TrustedJobContext独立 |
| 通过条件 | 十一snapshot/九body族允许集合；原expected入key/meaning，duplicate先复用原result再核当前actual；qualifiedeligible完整关联范围、具名current维护/失效；targetdedupexpiry proof独立原window/key/op |
| 失败条件 | viewenum扩大维护、缺分页关联partialinvalidate后报complete、终态复活/新grant；TTL当expiryproof，Jobop覆盖targetbusinessop |
| 副作用断言 | zero secret/material/businessprobe/send/claimaction；targetkey/result/unknown/tombstone保留，Job自身dedup/key/op独立；无source只localallowedmaintenance |
| 具体TC | ["TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-017","EV-CONTRACT-010","EV-CONTRACT-020","EV-CONTRACT-019","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际current maintenance/operations host/actual local driver/read-only probe/平台或consumer对应分支须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-SHARED shared codec/metadata/finite错误闭合

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-037、AC-BR-038、BR-BR-021；00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT |
| 正式对象/字段/协议/状态 | bridge.v1；C/Q version/metadata/body、version/result；E五字段及J wrapper；六core reexport；BridgeProtocolError.issue/area/reason；03§7/§16.5 |
| 通过条件 | unknown version/tag/duplicate/unknown field/reachable二级variant/Slot全量按exactfactory；core scalar与localtaggedenum例外保真；Commandkey仅request.idempotency_key，reason/external_ref=null；Qkey/page=null；context只trustedhost；公开errorfinite合法配对 |
| 失败条件 | 宽松decode/default/忽略重复字段、两处key/metadata、自由reason/rawerror、Domain/private类型入wire；same schema name但二级字段丢失 |
| 副作用断言 | dispatch前wrongshape/mode/surface zero业务接管/dedup/audit/artifact；already可能effect错误保原责任不缩早退 |
| 具体TC | ["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-001","EV-CONTRACT-018","EV-CONTRACT-015"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该具体compile/runtime/event/technical seam actual资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-COMPILE L0-core/L0-sdk编译期候选闭包

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-037、AC-BR-038、BR-BR-001；00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT |
| 正式对象/字段/协议/状态 | 01§8 compile候选；03 root workspace dependency/Contracts六core reexport；04固定兼容pin/features；SDK adapter外层消费 |
| 通过条件 | 实际包/路径/exports/fixedversion/features/transitiveclosure与03/04一致，contract compile和真实typed兼容证据；coreactual定义不复制；SDK只有核验qualification后才绑定，无默认path dependency |
| 失败条件 | 版本latest/未选SDK报compile兼容；owner源码依赖/Domain导入SDK；候选示意路径当实际仓/build已存在 |
| 副作用断言 | 只contract边界非下游fullrepo实现；当前没有实际build/test/commit，compile材料缺失blocked；localcontrolledsurface不报已编译 |
| 具体TC | ["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-001","EV-CONTRACT-017","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该具体compile/runtime/event/technical seam actual资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-OWNER 七上游runtime API/SDK/adapter与typed权威

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-001、BR-BR-002、BR-BR-010、BR-BR-015、AC-BR-038；00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT |
| 正式对象/字段/协议/状态 | ConversationHandoffPort、ActorResponsibilityPort、BindingQualificationPort、PresentationQualificationPort、OwnerActionPort、SafeReadQualificationPort、SafeObservationPort；SDKtyped客户端；owner正式callable/schema/basis/current |
| 通过条件 | 每实际采用owner/callable+版本/authority/ref/error/scope有exact兼容材料：Conversation模式/结果、安全材料；Identity仅AI锚点；Governance当前动作/展示；Artifact读取/传播；Workspace只provenance；Observabilityproducer/disposition；runtime成功真实owner结果 |
| 失败条件 | controlledfake证明真实owner可用；source/actor/displayname推权限；需求缺合同靠本仓发明方法；runtime要求导入owner私表/package |
| 副作用断言 | 未就绪按原拒绝无owner/平台新effect、unknown保原；BR-UP001~006与Workspace/Observability原状态不关闭；不验下游全仓 |
| 具体TC | ["TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007","TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-REAL-001","EV-CONTRACT-004","EV-CONTRACT-006","EV-CONTRACT-007","EV-CONTRACT-009","EV-CONTRACT-015","EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该具体compile/runtime/event/technical seam actual资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-PLATFORM 四平台adapter及OAuth/APIKey/KMS/route重核

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-001、FR-BR-004、FR-BR-006、FR-BR-009、FR-BR-010、BR-BR-005；00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT |
| 正式对象/字段/协议/状态 | SlackPlatformAdapter/MattermostPlatformAdapter/TelegramPlatformAdapter/DiscordPlatformAdapter及bound family；04 actual SDK/API/service pin/install/source mode/grant/secret/route/capability；PlatformIngressPort/PlatformDeliveryPort/SecretResolutionPort |
| 通过条件 | 逐四平台及所承诺family实际source/auth/ACK时限/locator/thread/edit/delete/attachment/callback/knownbusiness/probe/rate完整qualification与同run实例；OAuth或APIKey只所选实际模式，KMS/SDK/router各seamfixedpin/用途/撤销/route/SSRF/隐藏retry当前核验；secret只private |
| 失败条件 | 04链接/源码选段当实际安装/4of4；统一ACK/cursor/ratelimit/method差异；换账号/provider/fallback；不可权威probe却自动retryunknown |
| 副作用断言 | 错误模式/资格缺失不激活，不造external ID/token；所有private/raw不进证据；不建立本轮外部账号或实际投递 |
| 具体TC | ["TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-REAL-001","EV-CONTRACT-018","EV-CONTRACT-017","EV-CONTRACT-004","EV-CONTRACT-005","EV-CONTRACT-008","EV-CONTRACT-009","EV-CONTRACT-012"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该具体compile/runtime/event/technical seam actual资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-EVENT 事件来源/订阅/publish/replay与projection阶段

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-006、BR-BR-007、BR-BR-018、BR-BR-022、AC-BR-038；00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT |
| 正式对象/字段/协议/状态 | qualified SafeEventTransportHost/SafeTransportEventLease、PlatformSourceHost；E01~04/O01 logical labels；L0-bus条件carrier/source recipe/namespace/epoch/comparator/实际disposition |
| 通过条件 | 实际source publisher/subscription/topic route binding/version/scope与registeredrecipe资格；transportACK仅传输；安全ref可重解析且current/同key同meaning；cursor/gap阶段分离；O01实际consumer可消费/sameop重放材料，不写projectiontruth |
| 失败条件 | logical label当上游同名topic既有；收到消息即owner/consumer接纳；rawDLQ/bodyreplay、ACK推进业务complete、projection代authoritativecoverage |
| 副作用断言 | 无source/current/comparator不推进；gap保留不冒complete；unknown保original；producer登记缺口阻positive，不生成fakeoutbox |
| 具体TC | ["TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-019","EV-CONTRACT-011","EV-CONTRACT-016","EV-CONTRACT-021","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该具体compile/runtime/event/technical seam actual资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-SYNC-BR-LOCAL 技术driver/executor/clock/ID/runtime资格

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-013、FR-BR-014、AC-BR-037、AC-BR-038；00§6/12/14；01§8；03§7/8/13~16；04资格/配置；05对应CUT |
| 正式对象/字段/协议/状态 | LocalUnitOfWorkPort/八Repository/BridgeCallControl；qualifiedsame-driverread/write/unique/CAS/seal/commit与readonlyLocalCommitDisposition；RuntimeExecutionPhase/JobInvocationPhase/SourceSessionPhase/WorkerBatchPhase；04技术bindings |
| 通过条件 | 实际driver实现whole-U atomicity/uniquewinner/allreadsetCAS/actualcommitproof，executor/cancellation/fence/clock domain/IDpurpose/boundedbatch/strictconfiguration吻合；runtime停止保unknown与original；exact build/config binding |
| 失败条件 | in-memoryfake宣称durable能力；stage即commit、rollbackErr说无变化、borrow示意当compile；runtimebudget授businessretry；phaseCompletedLocal抹foreignunknown |
| 副作用断言 | 无actualproofzeroexternalIO；技术phase独立不签送达/owner成功；缺driver/runtime/pin/candidate或预算blocked，不创建targetrepo/run |
| 具体TC | ["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-014","EV-CONTRACT-019","EV-CONTRACT-020","EV-CONTRACT-017","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际该具体compile/runtime/event/technical seam actual资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

### 7.3 依赖分类/未就绪裁决映射

| 依赖 | 类型/合作方式 | 必要actual证据与门禁 | 未就绪口径 |
|---|---|---|---|
| L0-core/L0-sdk | compile候选；SDK另runtime客户端 | AC-SYNC-BR-COMPILE；actual package/export/pin/features/contract compile，不复制core定义 | 候选不宣已选；没有compile材料blocked |
| Conversation | runtime/条件event；typed handoff/committed source | OWNER及E01/E02；正式targetmode/material/actor/结果/current兼容及source订阅 | BR-UP-001 open；fake只local断言 |
| Identity | runtime/条件event；AI锚点 | OWNER/BIND/MAP/CALLBACK；既有AI ref与正式责任；human auth另basis | BR-UP-002 open，不创建GlobalMember |
| Governance | runtime/条件event；Policy/Gate展示/action | OWNER/PRESENT/CALLBACK；实际适用性/受众披露/owner action | BR-UP-003 open，未知fail-closed |
| Artifact | runtime/条件event；attachmentref准入/访问/传播 | OWNER/ATTACH；必要附件actualgrant/expiry/version/ref | BR-UP-004 open，不默认省略 |
| Workspace | runtime/条件event；只读provenance | OWNER/READ；正式来源/visibility，不作permission/频道owner | BR-UP-005及上游十二open |
| Observability | runtime/event；安全producer/disposition | O01/E04/J04/EVENT；准入/schema/同op/非递归/current/真实consumer | BR-UP-006及十二affected原状态，不条件放行P0 |
| 四平台/secret/route | runtime adapter/config/private seam | PLATFORM；逐install/provider/purpose/route/current/family/pin | BR-UP-007/008 open，没有4of4 |
| L0-bus/registeredsource | 条件event协作 | EVENT；真实pub/sub/position/gap/replay/safelease/ACK | 不要求源码依赖，no rawDLQ |
| localdriver/executor/clock/ID | technical runtime seam | LOCAL；actualwholeU与phase/cancellation/budget | 未established阻actualpositive |
| L5-chat/Runtime/Tools | Chat reference_only；执行背景非直接入口 | BOUND-017/OWNER；无未停审正式输入、无直执行 | 不纳入P0裁决，不解除任何上游blocker |

### 7.4 跨协议裁决规则

| 同步主题 | required规则 | 缺口处理 |
|---|---|---|
| 20canonical协议 | 6C+4Q+4E+1条件O+5J以03§7正式名称/字段/surface为准；每项独立裁决TC/EV/副作用 | 缺实际材料则planned/not_evaluated |
| 依赖类别 | 六接缝门禁不得将runtime/event写成owner package，不要求下游全仓验收 | 各类actual缺口独立blocked |
| 来源与success | source、shape、stage、ACK、owner/platform/consumer各守原authority | fake不能裁actual positive |
| 路径/重复 | 具体TC/EV固定run；共享引用不重复执行instance，O01不是callable | 不臆造topic/route/provider注册 |
| P1/后续phase | prepare/request/bind与send/probe/owner决定分开；Chat/SDK候选无放行权 | P0缺口不可风险接受 |

本章只裁本仓接缝，不裁任何下游仓的完整验收，也不以设计材料证明实际安装或投递。

## 8. 回填草稿

正式06§7直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15装配前过程归档

以下为本Step原§7末的设计静态审查记录，仅留过程区，不进入正式正文，不代表运行。

### 7.4 跨接口同步停审

| 审计主题 | 设计检查 | actual状态 |
|---|---|---|
| 20canonical协议 | 6C+4Q+4E+1条件O+5J与03实际目录逐字比对errors=[]；每项独立字段/surface/TC/EV/副作用 | planned/not_evaluated |
| 依赖类别 | 6接缝门禁；不将runtime/event写成ownerpackage，未要求下游全仓 | actual缺口保blocked |
| 来源与success | source、shape、stage、ACK、owner/platform/consumer各自权威，不以fake裁actualpositive | 无运行报告 |
| 路径/重复 | 全TC/EV固定run，复用引用不重复执行instance；O01不是第20callable | 无topic/route/provider已注册声明 |
| P1/后续phase | prepare/request/bind与send/probe/owner决定分开；Chat/SDK候选无放行权 | P0缺口不风险接受 |

本章定义的是本仓接缝验收，而非任何下游仓完整验收或实际安装/投递证明。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| AC-SYNC-BR-C01 | 正式合同/原字段、通过/失败/副作用、20个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-C02 | 正式合同/原字段、通过/失败/副作用、14个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-C03 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-C04 | 正式合同/原字段、通过/失败/副作用、17个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-C05 | 正式合同/原字段、通过/失败/副作用、9个具体TC和2个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-C06 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-Q01 | 正式合同/原字段、通过/失败/副作用、12个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-Q02 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-Q03 | 正式合同/原字段、通过/失败/副作用、12个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-Q04 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-E01 | 正式合同/原字段、通过/失败/副作用、25个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-E02 | 正式合同/原字段、通过/失败/副作用、20个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-E03 | 正式合同/原字段、通过/失败/副作用、22个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-E04 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-O01 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-J01 | 正式合同/原字段、通过/失败/副作用、23个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-J02 | 正式合同/原字段、通过/失败/副作用、23个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-J03 | 正式合同/原字段、通过/失败/副作用、22个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-J04 | 正式合同/原字段、通过/失败/副作用、23个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-J05 | 正式合同/原字段、通过/失败/副作用、36个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-SHARED | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-COMPILE | 正式合同/原字段、通过/失败/副作用、23个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-OWNER | 正式合同/原字段、通过/失败/副作用、34个具体TC和7个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-PLATFORM | 正式合同/原字段、通过/失败/副作用、48个具体TC和8个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-EVENT | 正式合同/原字段、通过/失败/副作用、28个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-SYNC-BR-LOCAL | 正式合同/原字段、通过/失败/副作用、38个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。20正式协议和6shared/dependency/qualification接缝逐项停审完成；canonical覆盖/名称、阶段、固定路径及依赖类别静态检查无缺口。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_8。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
