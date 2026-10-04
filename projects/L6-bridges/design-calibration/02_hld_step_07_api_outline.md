# L6-bridges 02 Step 7：API / 接口骨架

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§7。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step5/6；owner合同；SOP7/规范4.7已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done / 六部分串行 |
| 结构化/复杂度 | done / 五类入口与23port |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step5/6；owner合同；SOP7/规范4.7；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

问题1~11按六U串行归属核验：6 Command改局部truth、4 Query严格只读、4 Consumer消费验证后的正式来源、1条件安全Outbound Event、5可靠性Job；共20入口/事件主语。平台发送不当Outbound Event，owner command不当本仓API。每个入口有typed输入/输出/对象归属/后续独立flow；SDK元数据与trusted actor来自正式边界，不实现human认证。

### U1 思考

U1对象能力由C01 ConfigureBridgeInstallation、C02 ManageExternalBinding、C03 MaintainExternalMapping、J05 RefreshBridgeQualificationJob承接；BindingApplication、MappingApplication作为编排归属。所有owner/平台port只是本地语义要求，不注册外部账号，不创建GlobalMember/Conversation/Workspace，不把OAuth或管理员身份当内部授权。 Query统一归U6，其他U提供既有slice而不加读写混合接口。无未归属入口，思考done，当前部分允许写入。

### U2 思考

U2对象能力由E01 PlatformInputReceivedConsumer承接；InboundApplication作为编排归属。所有owner/平台port只是本地语义要求，不创建Turn、不缓存消息/附件正文、不由显示名识别回环、不声称ACK已提交。 Query统一归U6，其他U提供既有slice而不加读写混合接口。无未归属入口，思考done，当前部分允许写入。

### U3 思考

U3对象能力由C04 PrepareExternalDelivery、E02 CommittedSourceAvailableConsumer、J01 DispatchQueuedDeliveryJob承接；PresentationApplication、DeliveryApplication作为编排归属。所有owner/平台port只是本地语义要求，不拥有外部消息truth、Decision或Artifact；不保存payload、附件和私有URL；不以source提交证明送达。 Query统一归U6，其他U提供既有slice而不加读写混合接口。无未归属入口，思考done，当前部分允许写入。

### U4 思考

U4对象能力由C05 BindExternalAction、E03 PlatformCallbackReceivedConsumer承接；CallbackApplication作为编排归属。所有owner/平台port只是本地语义要求，不批准Gate/Decision，不执行Tools/Runtime，不记录token/context/response URL/敏感审批。 Query统一归U6，其他U提供既有slice而不加读写混合接口。无未归属入口，思考done，当前部分允许写入。

### U5 思考

U5对象能力由C06 RequestBridgeRecovery、J02 ReconcileBridgeOperationJob、J03 ReconcileStreamGapJob承接；ContinuityApplication、RecoveryJob作为编排归属。所有owner/平台port只是本地语义要求，不承诺exactly-once或全局顺序，不做无界自动重试，不持久化raw replay事件。 Query统一归U6，其他U提供既有slice而不加读写混合接口。无未归属入口，思考done，当前部分允许写入。

### U6 思考

U6对象能力由E04 SafeHandoffDispositionConsumer、O01 BridgeLocalDispositionRecordedEvent、J04 RetrySafeHandoffJob、Q01 GetBindingMappingView、Q02 GetBridgeOperationView、Q03 GetContinuityView、Q04 GetSafeHandoffView承接；SafeReadApplication、SafeHandoffApplication作为编排归属。所有owner/平台port只是本地语义要求，不生成报告、EV、verdict、signoff，不收raw消息/secret/敏感审批，不让query隐式写审计。 Query统一归U6，其他U提供既有slice而不加读写混合接口。无未归属入口，思考done，当前部分允许写入。

## 4. 当前文档问题诊断

不能把“owner有GetGateDecision/RecordApprovalVote”当作已完成Bridge-readable/action兼容合同。这里定义的是本地port最低typed语义要求；具体上游callable、材料和可见性来源绑定留03，缺失blocked。query不得以读取审计为由写audit或修复。

## 5. 改动前后对比

| 对象能力 | 本Step入口闭合 | 不冒称 |
|---|---|---|
| config/binding/mapping | 三管理Command与资格Job | 外部安装或human授权实现 |
| owner/effect/callback | 分离Consumer/Command/Job结果 | ACK=Turn或receipt=delivery |
| safe material/read | 条件Event/consumer/job与四Query | canonical payload、consumer准入已提供 |

## 6. 设计取舍

本地Command、consumer和job共享核心guard但不混接口类别；query单独no-write。Outbound Event只列条件安全阶段事实，不发明所有mutation outbox。23个port最低要求逐项typed，非上游新增方法声明；SDK/OAuth/API Key/KMS/route seam重新审资格，仍未选。复杂度六U分批加shared表；依规范本Step不画任何flow图。

## 7. 结构化中间产物

### 分类与metadata权威

| 类别 | 定义 / 输入authority |
|---|---|
| Command API | 显式局部mutation；ActorContext来自可信正式入口，CommandMetadata.request.idempotency_key必有，trace取metadata.request.trace_id；不另传顶层IdempotencyKey/TraceId。 |
| Query API | ActorContext + QueryMetadata；page/consistency沿SDK；不创建dedup/audit/job，无主动平台/owner状态probe。 |
| Inbound Event Consumer | envelope显式event_id/source_ref/idempotency_key；可信source/context/proof与原operation；平台raw材料只private瞬时。exact envelope编码/producer binding到03。 |
| Outbound Event | 只传播本仓已提交、body-free且schema/admission明确的局部阶段；不是平台send或owner mutation。 |
| Operations Job | 已有subject、授权维护basis、受信job context与连续性metadata；稳定原operation/effect，不伪造run或user actor。 |

输入/输出类型是本地概要骨架：BridgeCommandResult/BridgeReadResult/consume/job result各保留local_recorded、blocked、denied、conflict、unknown及safe result ref/version等适用分支；不造统一业务success。AuthorizedMappingProposal必须有identity/location/message typed variant与正式两端basis，不能用generic string。JobContinuityMetadata只表达已有source/job invocation/claim/trace与幂等scope，完整schema/来源到03，非声称SDK存在该类型。


### U1 接口

#### Command骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| C01 ConfigureBridgeInstallation | InstallationConfigDraft draft; ConfigurationBasisRef basis; ExpectedConfigRevision expected; ActorContext actor; CommandMetadata metadata | BridgeCommandResult<BridgeInstallationRef> | BindingApplication；核config/secret/capability seam | BridgeInstallation revision/资格；DedupRecord；SafeAuditRecord；对象能力U1-C1 |
| C02 ManageExternalBinding | BindingActionProposal proposal; AuthorizedBindingBasisRef basis; ExpectedGeneration expected; ActorContext actor; CommandMetadata metadata | BridgeCommandResult<ExternalBindingRef> | BindingApplication；显式propose/activate/suspend/revoke/到期处置 | ExternalBinding generation；去重与安全审计；不改已发生外部事实；对象能力U1-C2 |
| C03 MaintainExternalMapping | AuthorizedMappingProposal proposal; MappingBasisRef basis; ExpectedGeneration expected; ActorContext actor; CommandMetadata metadata | BridgeCommandResult<MappingRef> | MappingApplication；identity/location/message三branch来源资格 | 对应三mapping/CAS；同键变义conflict；不造内部实体；对象能力U1-C3 |

#### Job骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| J05 RefreshBridgeQualificationJob | 已存在BridgeInstallationRef/ExternalBindingRef及受限关联subject refs；QualificationMaintenanceBasisRef basis; TrustedJobContext context; JobContinuityMetadata metadata | QualificationJobResult；本地qualification revision、QualificationInvalidationPlan与audit；关联mapping/plan/action/lane/cursor适用性由各所属Application失效处理；不创建权限 | BindingApplication编排；只maintenance当前资格及已有原operation证明，不把claim/lease当无效果；U1-C1~C3 |

#### 本地port要求（非上游callable声明）

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| BindingQualificationPort | ExternalScopeLocator + BridgeInternalTargetRef + ActorResponsibilityRef + DirectionActionKind | CurrentBindingQualification / denied / missing_source / stale | 正式owner授权链仅语义需求，BR-UP-002/003/005；human/AI/Integration与locator分开 |
| MappingRepository | MappingRef / InstallationNamespace / ExpectedGeneration + authorized mapping变化 | AuthorizedMappingSnapshot / LocalCasDisposition | 本地repository；只受限scope读写，message必须known结果源；不从ref文本推scope |
| InstallationRepository | BridgeInstallationRef + ExpectedConfigRevision + qualified配置变化 | InstallationSnapshot / LocalCasDisposition | 本地config repo；不创建外部安装 |

#### 归属停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 分类与承接 | pass | C01/C02/C03/J05各回U1capability与§6对象；内部helper不升API |
| metadata/权威 | pass | trusted context/source、namespace幂等、独立结果；owner port未声称已适配 |
| 后续flow | pass | 除O01由真实mutation/J04承接外，各入口在Step8独立成图；非适用类别不新增空接口 |
| 缺口与深度 | preserved | 无HTTP path/JSON/proto/完整callback；BR-UP不关闭 |


### U2 接口

#### Consumer骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| E01 PlatformInputReceivedConsumer | 平台private adapter验证后的安全输入；InboundApplication | InboundSafeEnvelope envelope：event_id/source_ref/idempotency_key；VerifiedPlatformSourceRef source; QualifiedIngressContext context | InboundConsumeResult；InboundHandoffRecord、owner disposition、known mapping、dedup；ACK独立 | typed envelope安全来源；current scope/代际；U2-C1~C3 |

#### 本地port要求（非上游callable声明）

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| PlatformIngressPort | InstallationNamespace + transient PrivateIngressContext + CapabilitySnapshotRef | IngressVerificationResult + SafeSourceRefSlot + ProtocolAckPlan | 本地adapter contract；原始body仅private瞬时验证/转换；缺safe接管不承诺replay |
| ConversationHandoffPort | BridgeTargetMode + ActorRef + SafeSourceVersionRef + QualifiedMaterialRef + OwnerRequiredDigestRefSlot + OriginalOperationRef | OwnerHandoffResultRef / pending / indeterminate / blocked | 消费已有BridgeMappedFactReceivedEvent语义；AppendFact Integration/BridgeMapped/required digest，ManifestExternalFact ref；结果/兼容资格BR-UP-001，不宣称新方法 |
| InboundRepository | InboundRecordRef / OriginalOperationRef + ExpectedLocalRevision + 安全记录变化 | InboundSnapshot / LocalCasDisposition | 本地记录，ACK/owner result分栏，无正文inbox |

#### 归属停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 分类与承接 | pass | E01各回U2capability与§6对象；内部helper不升API |
| metadata/权威 | pass | trusted context/source、namespace幂等、独立结果；owner port未声称已适配 |
| 后续flow | pass | 除O01由真实mutation/J04承接外，各入口在Step8独立成图；非适用类别不新增空接口 |
| 缺口与深度 | preserved | 无HTTP path/JSON/proto/完整callback；BR-UP不关闭 |


### U3 接口

#### Command骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| C04 PrepareExternalDelivery | CommittedSourceVersionRef source; ExternalBindingRef binding; ExternalDeliveryKind kind; ActorContext actor; CommandMetadata metadata | BridgeCommandResult<DeliveryIntentRef> | PresentationApplication；current basis/Gate/附件/能力与stable effect | SafePresentationPlan、DeliveryIntent、dedup与审计；此入口不外呼；对象能力U3-C1~C3 |

#### Consumer骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| E02 CommittedSourceAvailableConsumer | 已资格化owner committed事件，具体event binding待03；PresentationApplication | CommittedSourceRefEnvelope envelope：event_id/source_ref/idempotency_key；CommittedSourceVersionRef source; TrustedProducerContext context | SourceConsumeResult；同C04语义生成plan/intent；不造producer已提交事实、不直接发平台 | typed envelope安全来源；current scope/代际；U3-C1~C2 |

#### Job骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| J01 DispatchQueuedDeliveryJob | 已存在DeliveryIntentRef；TrustedJobContext context; JobContinuityMetadata metadata; DispatchEligibilityRef qualification | DispatchJobResult；DeliveryAttempt、PlatformReceipt、intent、known message mapping、audit；网络不在UoW | DeliveryApplication；只原effect/claim/lane/当前资格；U3-C2~C3 / U5-C3 |

#### 本地port要求（非上游callable声明）

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| PresentationQualificationPort | CommittedSourceVersionRef + ImmutableDeliveryTargetRef + ExternalDeliveryKind + current context | CurrentPresentationQualification / AllowedProjectionRef / AttachmentGrantRefSet / blocked | Governance/Artifact/条件Workspace具体binding缺口BR-UP-003/004/005；GetGateDecision等查询存在不等外显授权 |
| PlatformDeliveryPort | StableEffectIdentity + ImmutableDeliveryTargetRef + transient PrivateQualifiedPayload + PrivateSecretHandle + FencedClaimRef | KnownPlatformBusinessResult / QualifiedRateLimitBounds / indeterminate / not_dispatched / unsupported | adapter send/edit/delete/reply/probe各有资格；禁止隐式retry；业务结果与HTTP分开，probe无write |
| DeliveryRepository | DeliveryIntentRef / AttemptRef / PlatformReceiptRef + ExpectedLocalRevision + safe变化 | DeliverySnapshot / LocalCasDisposition | intent含义不可变，attempt追加，known receipt才能回链mapping |

#### 归属停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 分类与承接 | pass | C04/E02/J01各回U3capability与§6对象；内部helper不升API |
| metadata/权威 | pass | trusted context/source、namespace幂等、独立结果；owner port未声称已适配 |
| 后续flow | pass | 除O01由真实mutation/J04承接外，各入口在Step8独立成图；非适用类别不新增空接口 |
| 缺口与深度 | preserved | 无HTTP path/JSON/proto/完整callback；BR-UP不关闭 |


### U4 接口

#### Command骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| C05 BindExternalAction | SourceIntentMessageRef source; OwnerTargetActionRef action; ActionAuthorizationBasisRef basis; ActorContext actor; CommandMetadata metadata | BridgeCommandResult<ExternalActionBindingRef> | CallbackApplication；source/actor/target/revision/expiry/one-use绑定 | ExternalActionBinding；dedup与审计；无入口合同blocked；对象能力U4-C1 |

#### Consumer骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| E03 PlatformCallbackReceivedConsumer | 平台private callback验证后；CallbackApplication | CallbackSafeEnvelope envelope：event_id/source_ref/idempotency_key；CallbackVerificationRef verification; QualifiedCallbackContext context | CallbackConsumeResult；CallbackHandoffRecord与one-use claim；原owner action交接；ACK/defer独立 | typed envelope安全来源；current scope/代际；U4-C2~C3 |

#### 本地port要求（非上游callable声明）

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| CallbackVerificationPort | InstallationNamespace + transient PrivateCallbackContext + ExternalActionBindingRef + current capability | CallbackVerificationRef / rejected / expired / blocked + ProtocolAckPlan | 签名/source验证仅来源，不授业务权；token/URL绝不落盘 |
| ActorResponsibilityPort | ExternalAccountLocator + OwnerTargetActionRef + current owner revision | ActorResponsibilityRef / denied / missing_source | human资格未证明blocked，AI Identity正式身份锚点不代action许可 |
| OwnerActionPort | OwnerTargetActionRef + ActorResponsibilityRef + CurrentActionQualification + OriginalOperationRef + owner revision | OwnerActionResultRef / pending / rejected / indeterminate | RecordApprovalVote/RecordGovernanceDecision仅已存在动作候选，须正式Bridge-compatible资格；owner二次核验，不自动选择approve |
| CallbackRepository | ExternalActionBindingRef / CallbackRecordRef + OneUseClaimRef + ExpectedLocalRevision | CallbackSnapshot / OneUseClaimRefSlot / LocalCasDisposition | claim+原operation+record+dedup同局部UoW，claimed不复活 |

#### 归属停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 分类与承接 | pass | C05/E03各回U4capability与§6对象；内部helper不升API |
| metadata/权威 | pass | trusted context/source、namespace幂等、独立结果；owner port未声称已适配 |
| 后续flow | pass | 除O01由真实mutation/J04承接外，各入口在Step8独立成图；非适用类别不新增空接口 |
| 缺口与深度 | preserved | 无HTTP path/JSON/proto/完整callback；BR-UP不关闭 |


### U5 接口

#### Command骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| C06 RequestBridgeRecovery | OriginalRecoverableSubjectRef subject; RecoveryAuthorizationRef basis; OriginalOperationEffectRef original; ActorContext actor; CommandMetadata metadata | BridgeCommandResult<RecoveryRecordRef> | ContinuityApplication；显式维护资格与原subject定位 | RecoveryRecord requested；dedup/审计，不在命令内重发；对象能力U5-C4 |

#### Job骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| J02 ReconcileBridgeOperationJob | 已存在RecoveryRecordRef及原subject/op；TrustedJobContext context; JobContinuityMetadata metadata | RecoveryJobResult；RecoveryRecord与原局部disposition finalize；已知成功不外呼，unknown->manual | RecoveryJob；owner/platform/consumer权威probe；U5-C4 |
| J03 ReconcileStreamGapJob | 已存在GapRef/StreamCursorRef；RecoveryQualificationRef qualification; TrustedJobContext context; JobContinuityMetadata metadata | GapRecoveryJobResult；GapRecord/StreamCursor；无raw replay，无comparator/coverage不推进 | RecoveryJob；同stream/epoch的coverage与安全材料来源；U5-C2 / C4 |

#### 本地port要求（非上游callable声明）

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| ContinuityRepository | DedupNamespaceScope / StreamCursorRef / GapRef / RecoveryRecordRef + ExpectedLocalRevision | ContinuitySnapshot / LocalCasDisposition | 语义唯一/位置比较/范围coverage分别guard；无rawbody hash |
| AuthoritativeRecoveryPort | OriginalRecoverableSubjectRef + OriginalOperationEffectRef + RecoveryQualificationRef | AuthoritativeProbeResultRef / AuthoritativeCoverageRef / unknown / unavailable | 本地composition port，绑定对应owner/platform/consumer只读结果查询；正式callable/窗口/coverage缺口BR-UP-001/006/009 |
| LaneRepository | DispatchLaneRef + DeliveryDependencyRefSlot + QualifiedRateLimitBoundSet + ExpectedLaneRevision | LaneSnapshot / FencedClaimRef / cooldown / blocked | 本地lane/CAS；有全局bucket时多lane共享下界，不假全局总序 |

#### 归属停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 分类与承接 | pass | C06/J02/J03各回U5capability与§6对象；内部helper不升API |
| metadata/权威 | pass | trusted context/source、namespace幂等、独立结果；owner port未声称已适配 |
| 后续flow | pass | 除O01由真实mutation/J04承接外，各入口在Step8独立成图；非适用类别不新增空接口 |
| 缺口与深度 | preserved | 无HTTP path/JSON/proto/完整callback；BR-UP不关闭 |


### U6 接口

#### Query骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| Q01 GetBindingMappingView | BridgeBindingViewQuery query; ActorContext actor; QueryMetadata metadata | BridgeReadResult<BridgeLocalView> | 既有BridgeInstallation/ExternalBinding/三mapping只读snapshot | SafeReadApplication；current read basis与scope；qualified/degraded/denied/unavailable；无写；对象能力U6-C3 / U1 |
| Q02 GetBridgeOperationView | BridgeOperationViewQuery query; ActorContext actor; QueryMetadata metadata | BridgeReadResult<BridgeLocalView> | 既有inbound/intent/attempt/receipt/callback/recovery阶段 | SafeReadApplication；无GlobalSuccess、无rawbody、无owner/platform probe/refresh；对象能力U6-C3 |
| Q03 GetContinuityView | BridgeContinuityViewQuery query; ActorContext actor; QueryMetadata metadata | BridgeReadResult<BridgeLocalView> | 既有dedup/cursor/gap/lane安全slice | SafeReadApplication；隐藏未授权count/ref；不维护水位/修gap；对象能力U6-C3 / U5 |
| Q04 GetSafeHandoffView | SafeHandoffViewQuery query; ActorContext actor; QueryMetadata metadata | BridgeReadResult<BridgeLocalView> | 既有SafeAuditRecord/SafeHandoffRecord的安全slice | SafeReadApplication；局部记录不作evidence；query不写audit/idempotency；对象能力U6-C3 |

#### Consumer骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| E04 SafeHandoffDispositionConsumer | Observability正式consumer结果来源；SafeHandoffApplication；binding待核 | SafeConsumerResultEnvelope envelope：event_id/source_ref/idempotency_key；ConsumerDispositionRef result; TrustedConsumerContext context | HandoffConsumeResult；仅SafeHandoffRecord与dedup/安全审计；没有canonical结果不得构造accepted | typed envelope安全来源；current scope/代际；U6-C2 |

#### Event骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| O01 BridgeLocalDispositionRecordedEvent | 本仓真实mutation的唯一SafeAuditRecord来源；仅canonical schema已绑定时形成交接intent | Observability等已准入consumer | CanonicalSafeMaterialRef material; SafeAuditRef source; ProducerAdmissionRef admission; SafeEventMetadata metadata；传播body-free阶段/ref/version/有限reason；无合同仅局部audit，不普发每mutation outbox；U6-C1~C2 |

#### Job骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| J04 RetrySafeHandoffJob | 已存在SafeHandoffRef；ProducerAdmissionRef admission; TrustedJobContext context; JobContinuityMetadata metadata | SafeHandoffJobResult；仅handoff attempt/disposition与audit；consumer unknown需权威查询或幂等合同 | SafeHandoffApplication；同canonical材料/operation对账或受限重交；U6-C2 |

#### 本地port要求（非上游callable声明）

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| SafeObservationPort | CanonicalSafeMaterialRef + ProducerAdmissionRef + OriginalHandoffOperationRef | ConsumerDispositionRef / pending / rejected / indeterminate | Observability准入/材料schema与consumer callable未闭口，BR-UP-006；不能自造evidence |
| SafeReadQualificationPort | ActorContext + resolved BridgeViewSubjectRef + AuthorizedReadScopeRef + QueryMetadata | CurrentReadQualification / denied / unavailable | 只读资格请求；不得借metadata取secret或由projection推权限 |
| SafeTraceRepository | SafeAuditRef / SafeHandoffRef / BridgeViewSubjectRef + qualified scope + ExpectedLocalRevision（写时） | ExistingLocalSnapshot / SafeHandoffSnapshot / LocalCasDisposition | query只读分支无写；mutation材料唯一producer、body-free |

#### 归属停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 分类与承接 | pass | E04/O01/J04/Q01/Q02/Q03/Q04各回U6capability与§6对象；内部helper不升API |
| metadata/权威 | pass | trusted context/source、namespace幂等、独立结果；owner port未声称已适配 |
| 后续flow | pass | 除O01由真实mutation/J04承接外，各入口在Step8独立成图；非适用类别不新增空接口 |
| 缺口与深度 | preserved | 无HTTP path/JSON/proto/完整callback；BR-UP不关闭 |


### shared seam 与平台adapter

#### 私有/共享port

| Port | typed输入要求 | typed输出要求 | 权威 / 边界 |
|---|---|---|---|
| PrivateMaterialPort | QualifiedMaterialRef / AllowedProjectionRef + CurrentMaterialQualification + exact version | TransientQualifiedMaterialHandle / denied / expired / missing_source | 私有读取/转换只瞬时；不持久化payload/digest原body；Artifact附件与Conversation payload seam待核 |
| SecretResolutionPort | OpaqueSecretBindingRef + QualifiedSecretUseContext + required version | PrivateSecretHandle / revoked / unavailable | provider ref/version/scope/rotation/refuse正式绑定待03/04；不选择KMS，不回显raw值 |
| ConfigQualificationPort | InstallationConfigDraft + ConfigurationBasisRef + capability/route/secret引用 | InstallationQualificationRef / blocked / unsupported | 安装/profile/版本/seam验证；SDK/OAuth/API Key/KMS/router选择仍not_selected |
| LocalUnitOfWorkPort | QualifiedLocalMutationPlan + ExpectedLocalRevisionSet | CommittedLocalMutationRef / LocalCommitDisposition（committed/conflict/rolled_back/indeterminate） | 仅本仓repository参与；dedup/subject/result/audit原子性；canonical handoff条件具备才同UoW，不包网络 |

#### 四平台adapter最低协议资格

| adapter / locator骨架 | inbound / callback contract | outbound / change / thread / attachment contract | cursor / lane / rate-limit / recovery |
|---|---|---|---|
| SlackPlatformAdapter；installation/workspace/account/channel/message/thread的typed定位 | HMAC/timestamp与当前安装scope分别验证，raw仅瞬时；event_id在安装来源namespace去重；Events ACK单独；callback source/action/actor/expiry仍核内部basis | send/edit/delete/reply分别绑定method/权限；thread root明确；附件仅Artifact获准ref，省略须owner basis；不存文件/正文；HTTP/business分开 | event_id不是commit位置，ts不作全局水位；method/workspace/channel及history/replies发行类别资格分别核；Retry-After下界；无权威probe/平台幂等则unknown/manual |
| MattermostPlatformAdapter；server-instance/installation/team/user/channel/post/root | 可信server/plugin/context合同验证，不假设Slack签名头；PAT只有平台权限；Blocks/legacy按部署pin；private context不留存 | post/update/delete/root各能力按实例/用户权限；无thread资格不默换channel；附件ref安全传播，拒绝私有context与下载URL日志 | session/事件identity、续接/coverage未证明则不可比/gap；限流按部署/响应资格，不从最新文档推已装能力；unknown按原post effect权威probe或manual |
| TelegramPlatformAdapter；bot-installation/account/chat/message/forum-topic-slot | polling/webhook互斥配置；secret header私有验证；update identity只在bot来源范围；callback ACK不等owner action；官网service contract仍待核 | send/edit/delete/reply及topic支持逐chat/方法资格；普通delete通知不保证完整；file/ref有效性与省略资格待Artifact/平台核验；不持久化file/download URL | polling offset/update comparator按来源合同限定，仅protocol stream；不等owner提交；retry_after可作获准动态下界，cloud固定配额/TTL/窗口不由master源码推；无安全ref/window则manual |
| DiscordPlatformAdapter；application-installation/guild-or-DM/channel/user/message/thread-channel | HTTP Ed25519与Gateway交互入口互斥；Gateway session/intent分别核；interaction token private且expiry受平台资格；签名不授内部动作 | message send/edit/delete/thread按权限/pin；content intent独立；附件ref及受众须owner basis；initial/follow-up只原action/source，敏感Gate正文始终排除 | session+sequence仅resume合法范围；Invalid Session保gap；Snowflake非跨流位置；bucket+major-resource+global下界共同作用；HTTP status不替business receipt |

所有adapter返回有限安全结果；raw error/message/headers/credential/interaction context不能出private seam。ProtocolAckPlan只表示该平台即时应答/受控拒绝，可靠接管另需safe source可恢复或owner已接纳，不用durable raw inbox实现ACK。

#### SDK / OAuth / API Key / KMS / router重核结果

| seam | 02要求 | 当前结论 / 下一闭口 |
|---|---|---|
| 平台SDK或直接API/plugin | 可关闭库内retry、输出body-free、保business result/limit/probe资格，版本与安装能力分离 | not_selected；03/04须按pin核验，包装库不补owner contract |
| OAuth / PAT / API Key / bot credentials | scope/audience/installation、CSRF/state（适用）、refresh/rotation/revoke由private provider合同；不成为内部binding basis | provider binding未建立，BR-UP-007；仅opaque ref可配置 |
| KMS/secret store | opaque provider/version/scope、private最小权限、轮换/撤销、错误safe分类；引用unknown即停止受影响操作 | not_selected，不存raw secret或fallback明文 |
| routing product | 签名原输入只private保完整，入口认证与内部actor分离；route/installation/kind精确绑定，无默认target | not_selected；03/04明确装配与失败；不存在通用channel自动路由 |
| material provider | safe ref/version/digest requirement、附件准入/链接传播与失效正式owner来源 | BR-UP-001/004/005；不拿平台body或raw digest补合同 |

来源资格沿00平台核验附录PS-01~14与01§11；公开资料登记不证明当前安装能力。Telegram官网仍unavailable历史登记，源码master仅辅助线索；四平台支持资格、账号/token/安装运行均未建立。


### 跨接口一致性审计

| 审查项 | 结论 | 依据 |
|---|---|---|
| 五类完整 | pass | C01~06、Q01~04、E01~04、O01、J01~05，共20主语，除条件O01各在Step8独立成图 |
| 对象/服务归属 | pass | 每入口回指U capability与20卡；U6查询仅读其他U现存slice |
| metadata单一来源 | pass | 命令key/trace取SDK metadata；event id/source/key取qualified envelope；job不冒充user command |
| port真相边界 | pass | 19部分port+4shared port共23语义要求，owner已存在方法与待兼容资格区分 |
| callback/平台差异 | pass | 来源认证与内部责任独立；SDK/secret/router未选；ACK/Turn/receipt/consumer不互证 |
| 输出/深度 | pass | safe result refs与有限disposition，不写完整JSON/路由/所有回调参数；support carriers留03正式化 |
| pending保持 | preserved | BR-UP及Observability十二affected不关闭，不伪造canonical事件/准入/实际交接 |

本Step不画图，遵规范4.7；流程/transaction/测试切口必须在Step8实际展开，不在接口表只用“待实现”遮住。


## 8. 回填草稿

正式§7按分类/metadata、六U五类接口、shared seam、四adapter/产品资格表回填。保留“本地port要求非已匹配上游方法”与blocked边界，不把审计过程入正式文档。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

六部分接口停审与跨审pass；五类接口、metadata、typed入出与对象/服务归属、adapter/secret资格齐全；无flow图或完整协议越界。gate_status=pass；gate_reason=interface_outline_closed；next_allowed_action=step08_independent_flows；formal_backfill_allowed=after_step14；commit_required=false。
