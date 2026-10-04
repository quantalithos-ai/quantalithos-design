# L6-bridges 03 Step8：Command协议

## 1. C1范围与批次

主文件C1问题/诊断/取舍已done；只六个既有命令，不开平台send、审批、通用replay入口。wrapper、严格codec、core metadata与outer错误唯一见[共享协议](03_ddd_step_08_shared_protocol.md)。以下声明唯一归属计划`crates/contracts/src/commands.rs`；二级类型沿Step6原schema。Rust是设计，不是实现。

| 批次 / 协议 | 模块 / 目标 | 既有依赖port | 未来Step9 flow | 停审 |
|---|---|---|---|---|
| C1 / C01 ConfigureBridgeInstallation | U1 / BridgeInstallation | ConfigQualificationPort、InstallationRepository及原mutation支持 | ConfigureBridgeInstallation | pass |
| C1 / C02 ManageExternalBinding | U1 / ExternalBinding | BindingQualificationPort、InstallationRepository、MappingRepository及原mutation支持 | ManageExternalBinding | pass |
| C1 / C03 MaintainExternalMapping | U1 / 三mapping | BindingQualificationPort、ActorResponsibilityPort、MappingRepository及原mutation支持 | MaintainExternalMapping | pass |
| C2 / C04 PrepareExternalDelivery | U3 / SafePresentationPlan、DeliveryIntent | 原Installation/Mapping/Binding/Actor/Config/Presentation/Delivery及mutation支持 | PrepareExternalDelivery | pass |
| C2 / C05 BindExternalAction | U4 / ExternalActionBinding | 原Installation/Binding/CallbackVerification/Actor/OwnerAction/Mapping/Delivery/Callback及mutation支持 | BindExternalAction | pass |
| C2 / C06 RequestBridgeRecovery | U5 / RecoveryRecord | AuthoritativeRecoveryPort、ContinuityRepository及mutation支持 | RequestBridgeRecovery | pass |

所有fixed内部路由均为计划JSON POST；principal来自实际已认证host，body不含actor/context。固定路径不含subject/token；HTTP产品未选，无已启listener。请求是`BridgeCommandRequest<本节Request>`，响应是唯一`BridgeCommandResponse`。

Step13受权同义补口：C01/C02/C03/C05各Input.canonical_meaning完整保本页原safe body/CAS及variant字段，得到Step6 ManagementCommandMeaning的对应payload，再用BodyFreeOperationMeaningRef::ManagementBody；Request/wrapper/路由/metadata不变。ManagementCommandMeaning.canonical_bytes(max_bytes)的impl归同crate commands.rs，直接按本页private原字段及已有safe leaf getter编码，调用方不需把DTO字段公开或整体Clone。初绑C05不使用还不存在的action ID或E03 Callback meaning。C04/E02仍共用Outbound effect，C06仍原Recovery meaning；所有current/授权规则不因同义载体成立而改变。

## 2. C01 ConfigureBridgeInstallation

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/commands/configure-installation` |
| caller / handler | 已认证且有配置管理资格的内部调用方 / API ManagementDispatcher::Configure -> ConfigureBridgeInstallation::execute |
| exact callable | `execute<'a>(&'a self, input: ConfigureInstallationInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>`；完整原定义见Step7 callables§5 |
| actor / scope | actual ActorContext；管理资格必须同安装/namespace/config来源；OAuth/PAT不授内部权 |

```rust
/// C01完整安全配置命令，不接受secret值、私有URL或运行资格自报。
pub struct ConfigureBridgeInstallationRequest {
    /// 初建为None，其他情况定位原受权安装。
    installation: Option<BridgeInstallationRef>,
    /// 显式配置动作，不能从draft差异猜动作。
    action: ConfigurationMutationKind,
    /// Step6完整七字段draft，只有具名配置/能力/secret/route引用。
    draft: InstallationConfigDraft,
    /// 原config CAS；初建None，后续必须Some。
    config_expected: Option<ExpectedConfigRevision>,
    /// 原local CAS；初建Absent，后续Present。
    local_expected: LocalRevisionCondition,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(installation: Option<BridgeInstallationRef>, action: ConfigurationMutationKind, draft: InstallationConfigDraft, config_expected: Option<ExpectedConfigRevision>, local_expected: LocalRevisionCondition) -> Result<Self, ContractViolation>` | /// 完整复制并核下表动作/optional/namespace组合；零IO，不生成ID、clock或资格。 |
| `pub fn into_parts(self) -> (Option<BridgeInstallationRef>, ConfigurationMutationKind, InstallationConfigDraft, Option<ExpectedConfigRevision>, LocalRevisionCondition)` | /// 一次性移交原五字段，供API零IO组装完整input，不改变CAS或draft。 |

| 字段 / 分支 | 来源 -> Step7 input / Step6目标 | 缺失 / guard |
|---|---|---|
| installation、action、config_expected、local_expected | 调用方受权提案 -> ConfigureInstallationInput同名字段 | 不自报namespace解析结果，不把local条件替代config条件。 |
| draft.namespace/platform_kind/revision | 正式安全配置 -> 原draft；初建configure的namespace/platform/config_revision | 首次revision=1；后续checked next，不推source/lane版本。 |
| draft.capability/secret_binding/route_policy/basis | 正式具名ref -> configure的capability_ref/secret_binding/route_policy/configuration_basis | ConfigQualificationPort重验；shape/ref存在不等产品、provider或secret可用。 |
| Configure初建 | None / None / Absent；draft.revision=1 | 原installation尚未存在；同namespace唯一与dedup/UoW失败不得生成第二行。 |
| Configure显式重启 | Some / Some / Present；actual Suspended原行 | 仅restart_configured；安装/原配置稳定设置匹配、revision由该成员checked next，不能用于覆盖已有Active配置；新资格仍Missing/Stale，交J05。 |
| ApplyRevision | Some / Some / Present；draft.revision=expected next | 同namespace完整替换；Qualified须先合法suspend；不换历史effect target。 |
| Suspend / Retire | Some / Some / Present；draft带原稳定设置及拟提交checked-next revision | 只消费受权basis与CAS；capability/secret/route等必须与actual原行相同，不借动作名隐式ApplyRevision。 |

构造闭环：初建`BridgeInstallation::configure`全部九入参=技术ID、draft七字段、显式`InstallationQualificationRefSlot::Missing`，固定Configured/local=1。existing完整行由InstallationRepository读取并以原rehydrate核identity/revision/hydration；对应`apply_revision/suspend/restart_configured/retire`原成员逐项消费draft/basis、config/local expected，其他字段保持原行。`LocalUnitOfWorkPort`提供actual now/ID、同源CAS/commit；只有actual local commit后出LocalCommitted，不证明adapter qualified。

同key完整含义：installation、action、draft全部stable设置/refs/版本、config与local条件；trace/requested_at/current资格续期时刻不入同义比较。duplicate先current披露重验后复用原结果，不再做配置效果。C01安全audit记录动作、原subject/op/CAS与finite状态，不能记录secret绑定的值或原错误。

## 3. C02 ManageExternalBinding

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/commands/manage-binding` |
| caller / handler | 经显式relation管理授权的内部调用方 / API ManagementDispatcher::ManageBinding -> ManageExternalBinding::execute |
| exact callable | `execute<'a>(&'a self, input: ManageBindingInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>` |
| actor / scope | actual ActorContext；proposal actor Slot是责任候选，不是caller；target owner及两端授权须current核验 |

```rust
/// C02唯一完整relation提案，所有basis只是待正式重验的输入。
pub struct BindingActionProposal {
    /// actual受权安装，仍须完整读取。
    installation: BridgeInstallationRef,
    /// Propose为None，其他动作保原relation。
    binding: Option<ExternalBindingRef>,
    /// Step6完整七字段动作/两端/责任/代际/授权含义。
    meaning: BindingMeaning,
    /// Suspend/Expire必需的正式维护候选，其他动作None。
    maintenance: Option<QualificationMaintenanceBasisRef>,
    /// Revoke必需的正式撤销候选，其他动作None。
    revocation: Option<RevocationBasisRef>,
    /// creation与existing行的严格local CAS条件。
    local_expected: LocalRevisionCondition,
}

/// C02具名body，避免HLD proposal与DDD Request双承载授权字段。
pub struct ManageExternalBindingRequest {
    /// 唯一完整proposal，meaning内授权候选与proposal内CAS不重复承载。
    proposal: BindingActionProposal,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `BindingActionProposal::from_parts(installation: BridgeInstallationRef, binding: Option<ExternalBindingRef>, meaning: BindingMeaning, maintenance: Option<QualificationMaintenanceBasisRef>, revocation: Option<RevocationBasisRef>, local_expected: LocalRevisionCondition) -> Result<Self, ContractViolation>` | /// 核action条件组合及same installation/namespace，完整保六字段；不授relation动作。 |
| `BindingActionProposal::into_parts(self) -> (BridgeInstallationRef, Option<ExternalBindingRef>, BindingMeaning, Option<QualificationMaintenanceBasisRef>, Option<RevocationBasisRef>, LocalRevisionCondition)` | /// 一次性移交全部提案字段，不把Missing actor升级为Established。 |
| `ManageExternalBindingRequest::from_proposal(proposal: BindingActionProposal) -> Result<Self, ContractViolation>` | /// 接纳已校完整proposal，零IO。 |
| `ManageExternalBindingRequest::into_proposal(self) -> BindingActionProposal` | /// 保原proposal交对应API mapper。 |

| proposal字段 | 原来源 -> target | 条件 / 缺失处理 |
|---|---|---|
| installation / binding / local_expected | 受权命令/actual snapshot条件 -> ManageBindingInput同名字段 | Propose只能None/Absent，其他Some/Present；不替换原binding。 |
| meaning.action/actor/scope/target/actions/generation/basis | 原七字段 -> input.meaning -> relation两端/责任Slot/动作/generation/授权Slot | expected generation只条件；body basis不得self-authorize；actual资格通过BindingQualificationPort取得。 |
| maintenance / revocation | 正式scope维护/撤销候选 -> input同名 | Suspend/Expire=Some维护且None撤销；Revoke反之；Propose/Activate两者None；多带同样拒绝，不默丢。 |
| Propose | generation条件值1、完整两端/动作提案 | `ExternalBinding::propose`用技术binding ID、installation、scope、target、actor Slot、经核basis Slot、actions、初始generation1；Pending/local1，不允许IO。 |
| Activate | actual原Pending/Suspended行 + explicit current activation | `BindingActivationQualification`完整安装/binding/expected/checked-next generation/target/actor/basis/actions/window由BindingQualificationPort取得；`activate(current,expected,local,actual now)`，不能循环要求已Active。 |
| Suspend / Revoke / Expire | 原完整relation与actual正式basis | 原成员消费对应basis、meaning.generation、local，Expire另actual now；所有scope/target/actions保持原意，终态无回边。 |

API从wrapper原metadata与actual host actor/authority/trace构造唯一BridgeCommandCallContext，再移交proposal六字段；不在API读取repo或生成ID。existing行完整从MappingRepository/InstallationRepository取得，不能只读state/ref然后重造relation。成功内存候选必须同UoW CAS/dedup/result/audit/条件handoff实际提交。

同key含义包括六proposal字段及meaning所有stable两端/动作/basis版本/expected/local条件；None与Some不同义。重复激活不生成新代际，撤销不撤回已发生owner/platform事实，generation过期不得换成最新后继续。audit只安全relation动作、original与known local结果。

## 4. C03 MaintainExternalMapping

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/commands/maintain-mapping` |
| caller / handler | 有两端mapping管理资格的内部调用方 / API ManagementDispatcher::MaintainMapping -> MaintainExternalMapping::execute |
| exact callable | `execute<'a>(&'a self, input: MaintainMappingInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>` |
| actor / scope | actual caller；identity.actor是已有正式映射候选；external_id不能创建GlobalMember或participant |

```rust
/// Contracts mapping提案，仅描述五个既有分支，不引用Application enum。
pub enum AuthorizedMappingChange {
    /// 两端账号与正式actor显式关联。
    LinkIdentity {
        /// 安装隔离的完整external account。
        account: ExternalAccountLocator,
        /// 明确责任kind，不从bot标记猜。
        kind: BridgeActorKind,
        /// 正式既有actor，display_name必须None。
        actor: ActorRef,
        /// 正式两端mapping依据候选。
        basis: IdentityMappingBasisRef,
    },
    /// 频道/topic/thread/parent与owner target显式关联。
    LinkLocation {
        /// 完整typed位置，不是频道显示名。
        location: ExternalLocationLocator,
        /// 明确parent适用性，不以缺失猜root。
        parent: ParentLocationRefSlot,
        /// 已有正式内部target候选。
        target: BridgeInternalTargetRef,
        /// 两端及parent/kind依据候选。
        basis: LocationMappingBasisRef,
    },
    /// actual known-result消息回链；unknown不可调用。
    LinkMessage {
        /// 完整原消息定位。
        message: ExternalMessageLocator,
        /// exact安全source版本。
        source: SafeSourceVersionRef,
        /// 原create/edit/delete/reply变化。
        change: ExternalChangeKind,
        /// actual owner/platform已知结果候选，不从ACK推断。
        result: KnownMappingResultRef,
        /// 原relation/generation与生成方向。
        direction: MappingGenerationDirection,
        /// verified origin与self-send关联候选。
        origin: VerifiedOriginMarkerRef,
        /// 原消息/版本/两端basis候选。
        basis: MappingBasisRef,
    },
    /// 原mapping正式失效，保历史关联。
    Invalidate {
        /// 必须实际存在且same relation/generation。
        mapping: MappingRef,
        /// 正式失效候选，不是任意撤销字符串。
        basis: MappingInvalidationBasisRef,
    },
    /// 原known delete处置形成墓碑，不删owner实体。
    Tombstone {
        /// 必须实际存在的message mapping。
        mapping: MessageMappingRef,
        /// 原owner实际change disposition候选。
        disposition: OwnerChangeDispositionRef,
    },
}

/// C03完整提案，local CAS与relation代际各有唯一字段。
pub struct AuthorizedMappingProposal {
    /// 原受权relation。
    binding: ExternalBindingRef,
    /// 原binding generation条件。
    generation: ExpectedGeneration,
    /// 唯一穷尽typed mapping动作。
    change: AuthorizedMappingChange,
    /// 初建Absent，修改existing Present。
    local_expected: LocalRevisionCondition,
}

/// C03具名body，只包装完整proposal。
pub struct MaintainExternalMappingRequest {
    /// 唯一完整两端/动作/CAS提案。
    proposal: AuthorizedMappingProposal,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `AuthorizedMappingChange::validate(self) -> Result<Self, ContractViolation>` | /// 穷尽核各variant完整safe载荷、kind/namespace/parent；LinkMessage只OwnerAccepted/PlatformAccepted，AuthorizedRelation有限拒绝；不取得current授权。 |
| `AuthorizedMappingProposal::from_parts(binding: ExternalBindingRef, generation: ExpectedGeneration, change: AuthorizedMappingChange, local_expected: LocalRevisionCondition) -> Result<Self, ContractViolation>` | /// 完整复制四字段并核Link为Absent、其余Present及same namespace/generation；零IO。 |
| `AuthorizedMappingProposal::into_parts(self) -> (ExternalBindingRef, ExpectedGeneration, AuthorizedMappingChange, LocalRevisionCondition)` | /// 移交原四字段，API只match change并逐字段映射原BridgeMappingChange。 |
| `MaintainExternalMappingRequest::from_proposal(proposal: AuthorizedMappingProposal) -> Result<Self, ContractViolation>` | /// 接纳已校完整proposal，不解析ref推target。 |
| `MaintainExternalMappingRequest::into_proposal(self) -> AuthorizedMappingProposal` | /// 原值交唯一C03 mapper，零效果。 |

| exact branch -> Step7 change | Step6 factory / 必填来源 | 拒绝边界 |
|---|---|---|
| LinkIdentity四字段逐一同名 | `ExternalIdentityMapping::link(mapping ID,account,kind,actor,binding,actual generation,basis,current,actual now)`；ID/UoW技术来源、current BindingQualificationPort；ActorResponsibilityPort核actor/kind | external account不能当actor；display_name、cross namespace、缺正式责任/授权拒绝。 |
| LinkLocation四字段逐一同名 | `ExternalLocationMapping::link(mapping ID,location,parent,target,binding,actual generation,basis,current,actual now)`；parent/target按正式qualification核 | thread缺parent不降为channel；external workspace/server非内部Workspace。 |
| LinkMessage七字段逐一同名 | `ExternalMessageMapping::link_known(mapping ID,message,source,change,owner_result Slot,effect Slot,direction,origin,basis,result,current,actual now)`；KnownMappingResultRef穷尽处理：OwnerAccepted填原owner Slot、PlatformAccepted填原effect Slot，非适用Slot显式Missing；AuthorizedRelation只关系授权，不能用于本分支，InvalidInput | 新link不接受Delete、unknown/ACK/AuthorizedRelation不造回链；结果/source/target/version/generation任一不符拒绝。 |
| Invalidate(mapping,basis) | 完整typed原行 -> 对应`invalidate(basis,local)`，不变更identity/两端/历史结果 | 已终态不得复活；失效不是删除owner/platform。 |
| Tombstone(mapping,disposition) | 完整message原行 -> `record_tombstone(disposition,local)`；actual original delete资格重验 | 不接不存在mapping，不能删历史result/accepted。 |

proposal.binding/generation/local_expected到MaintainMappingInput同名；change只做原五variant穷尽零IO转换，mapping ref不能替代完整row/current资格。此surface不增加Revoke或自动remap分支；relation显式撤销仍C02，当前revoked guard立即拒绝所有旧mapping执行，后续J05只能按原正式维护合同处置，不由decoder猜动作。

同key比较完整四proposal字段和change全部typed stable含义，特别result/source版本/方向/origin/basis与local条件；不序列化raw正文作hash，不以展示名字/时间或资格续期改变同义。actual UoW安全audit/dedup/result与known message回链一起提交；未知保持original，不先写Linked再等结果。

## 5. 共用结果、错误与C1组内审查

| BridgeCommandResult exact variant | HTTP计划 / 保留含义 |
|---|---|
| LocalCommitted(view) / OriginalReused(view) | 200，完整原已过滤BridgeLocalView；不是owner接受或外部送达。 |
| Indeterminate(view) | 202，完整原已过滤阶段与original；不生成新key/op或把未知作无效果。 |
| Rejected(reason) | 409仅Conflict，Unauthorized=403，其余422；不带hidden ref/count。 |
| Unavailable(reason) | 503；缺foreign/codec/产品合同不是空成功，不承诺retry。 |
| NotDisclosed(reason) | 403；固定安全拒绝，不披露原subject存在。 |

结构outer错误沿G0，不用port错误造view。上述结果variant/data的完整schema唯一见Step6 shared§16；view字段/marker当前原schema，Q组另逐字段映射，不复制新的CommandResult<T>。本表只面向已认证内部调用方，不能原样回给平台。

C1复杂度：三个Request、两个完整deferred proposal、一个typed change；零新port/状态/authority/业务对象。所有factory完整校shape，into_parts/into_proposal一次性消费；enum为穷尽match，不新增mutable getter。草稿承接未来正式03§7三个独立小节与§6索引。

设计人工自检：C01全部configure入参及existing纯成员来源齐；C02 pending activation/双Slot/expected-next明确；C03五variant与三factory/两变更闭口，Contracts不依赖Application。静态检查记录后才开放C2。最小计划测试沿`contracts/tests/protocol_surface_tests.rs`及原binding/mapping用例：optional组合、跨namespace、local/config/generation轴互换、unknown message、无parent、同key变义、current撤销、post-effect保original、forbidden材料。全部planned，未运行。

C1组内停审pass：五文档29表/18围栏行、573唯一定义、缺失类型/重复/字段Rustdoc错误0；主文件记录实际口径后进入C2。

## 6. C04 PrepareExternalDelivery

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/commands/prepare-delivery` |
| caller / handler | 已认证且有原source/target动作资格的内部调用方 / ManagementDispatcher::PrepareDelivery -> PrepareExternalDelivery::execute |
| exact callable | `execute<'a>(&'a self, input: PrepareDeliveryInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>` |
| authority | actor、source、binding两端、Gate/附件及外显资格分别current重验；不能由committed或body ref推出可外显 |

```rust
/// C04只准备原逻辑effect，客户端不能携正文或声称已送达。
pub struct PrepareExternalDeliveryRequest {
    /// owner actual committed source及exact版本候选。
    source: CommittedSourceVersionRef,
    /// 安装/位置/parent/generation不可变target候选。
    target: ImmutableDeliveryTargetRef,
    /// 明确create/edit/delete/reply，不自动换method。
    kind: ExternalDeliveryKind,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(source: CommittedSourceVersionRef, target: ImmutableDeliveryTargetRef, kind: ExternalDeliveryKind) -> Result<Self, ContractViolation>` | /// 完整校同source/target/kind结构；不生成effect，不取得外显权。 |
| `pub fn into_parts(self) -> (CommittedSourceVersionRef, ImmutableDeliveryTargetRef, ExternalDeliveryKind)` | /// 移交原三字段到PrepareDeliveryInput同名字段，零IO。 |

| 目标 / 全部factory入参来源 | 缺失 / 边界 |
|---|---|
| SafePresentationPlan::prepare：plan ID来自UoW；source来自body并owner重验；binding_context来自完整两端/current mapping；projection/disclosure/attachment Slots、presentation_kind及qualification来自PresentationQualificationPort；capability来自ConfigQualificationPort；actual now来自UoW | Missing/Stale只能Blocked；explicit可披露且无动作降级才Degraded，不能默认输出敏感Gate或审批。Artifact grant缺失不下载/公开链接。 |
| DeliveryIntent::from_plan：intent/effect/op IDs由原reservation/UoW，source_projection由actual原plan、target/kind由原body/current核验，plan_ref原plan，lane由原qualified scope/Lane合同，retry Slot初始Missing，StableEffectIdentity与CurrentPresentationQualification来自正式qualification，actual now | 仅current可执行plan生成Planned；Blocked plan不得造可派发intent，blocked结果保真实local阶段。来源不同入口不生成不同逻辑effect。 |
| 已有同stable effect | DeliveryRepository原完整intent/plan/result和retained meaning优先；当前可披露才OriginalReused，变义Conflict；不改原plan/target或新effect。 |

C04 key仍core metadata；logical effect按正式`StableEffectIdentity::Delivery`和完整`DeliveryOperationMeaning`规范生成，与E02相同source/version/target/kind必同effect。trace、event ID、Command key、展示内容不是effect identity。此用例零PlatformDeliveryPort调用，不生成attempt/receipt；仅J01在实际claim/current核验后send。safe audit只实际准备/blocked局部mutation与原result，日志/证据无外显正文。

## 7. C05 BindExternalAction

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/commands/bind-action` |
| caller / handler | 已认证且有原binding/action管理资格的内部调用方 / ManagementDispatcher::BindAction -> BindExternalAction::execute |
| exact callable | `execute<'a>(&'a self, input: BindActionInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>` |
| authority | actual caller、account责任、source/disclosure与owner action分别核验；按钮/签名不授审批权 |

```rust
/// C05初始known source-action relation，不消费回调或执行owner命令。
pub struct BindExternalActionRequest {
    /// 原explicit受权relation候选。
    binding: ExternalBindingRef,
    /// 原known intent/message/source关联候选。
    source: SourceIntentMessageRef,
    /// owner目标/action kind候选。
    target: OwnerTargetActionRef,
    /// 正式account/actor/action责任候选。
    responsibility: ActorResponsibilityRef,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(binding: ExternalBindingRef, source: SourceIntentMessageRef, target: OwnerTargetActionRef, responsibility: ActorResponsibilityRef) -> Result<Self, ContractViolation>` | /// 完整校原关联及责任kind结构，不取得action授权。 |
| `pub fn into_parts(self) -> (ExternalBindingRef, SourceIntentMessageRef, OwnerTargetActionRef, ActorResponsibilityRef)` | /// 原四字段移交BindActionInput同名字段，不能替换owner目标。 |

构造闭环：InstallationRepository完整原安装；Mapping/Delivery读取完整relation、原intent/known platform message/source。CallbackVerificationPort仅核`known source`，不要求尚不存在callback验证ref；ActorResponsibilityPort及OwnerActionPort建立正式`ActionBindingQualification`和CurrentActionQualification。`ExternalActionBinding::bind`十二入参完整来源：action ID=UoW，installation=原relation，source_intent=原source，actor_responsibility=actual责任，target_action=actual owner target，owner_revision=owner当前条件，binding_generation=current relation，expiry_one_use/authorization_basis=正式owner，one_use_claim=显式Missing，current=正式qualification，now=actual UoW。固定Active/local1，不写Decision，不claim、不send、不生成CallbackHandoffRecord。

同key完整四字段与source/target/action/责任stable版本逐一比较；重复绑定复用原action/expiry，不续期或生成second one-use。敏感Gate未证明动作/存在性可外显则拒绝绑定，不以低敏感placeholder保留可点击审批。audit仅actual local relation创建/原result，不包含审批详情或回调token。

## 8. C06 RequestBridgeRecovery

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/commands/request-recovery` |
| caller / handler | 已认证且获原subject维护授权的内部调用方 / ManagementDispatcher::RequestRecovery -> RequestBridgeRecovery::execute |
| exact callable | `execute<'a>(&'a self, input: RequestRecoveryInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>` |
| authority | AuthoritativeRecoveryPort::qualify_request先核actual caller、原subject/op/effect/scope；输入authorization只是候选 |

```rust
/// C06原subject有界恢复请求，不是通用replay或重发。
pub struct RequestBridgeRecoveryRequest {
    /// 原实际可恢复主语，不能凭ref造行。
    subject: OriginalRecoverableSubjectRef,
    /// 原operation/effect及kind，未知不能替换。
    original: OriginalOperationEffectRef,
    /// 正式维护请求授权候选，不代表probe源就绪。
    authorization: RecoveryAuthorizationRef,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(subject: OriginalRecoverableSubjectRef, original: OriginalOperationEffectRef, authorization: RecoveryAuthorizationRef) -> Result<Self, ContractViolation>` | /// 校same主语/op/scope结构并完整复制，不证明no-effect或请求获准。 |
| `pub fn into_parts(self) -> (OriginalRecoverableSubjectRef, OriginalOperationEffectRef, RecoveryAuthorizationRef)` | /// 原三字段移交RequestRecoveryInput，不生成新operation。 |

`RecoveryRecord::request`八入参闭口：recovery ID=技术UoW；original_subject/operation_effect=body与actual完整原行相互核验；authorization_basis=qualify_request正式结果；qualification_ref/probe_result=显式Missing；resolution_kind=Unresolved；safe_reason=实际有限接纳原因。不替换原unknown或将request标Resolved；existing recovery按原subject/op查重，不用新core key生成第二恢复事实。

actual local申请、dedup/audit/result提交后才LocalCommitted。零probe、零send、零cursor推进；后续J02/J03仍需正式source/window/预算及全部current资格。已知恢复结果只允许same-op finalize，NotFound/timeout不证明NoEffect。同key完整三个stable字段及scope一致，重复只原result/current过滤。

## 9. C2复杂度、草稿与停审

三个Request共十字段，无新authority/port、run/report、发送或审批入口。各DTO有完整factory和一次性消费，stable结果/错误沿§5/G0；逐factory补查数据来源，不把Missing资格当默认成功。future正式03§7只装配六独立协议及本schema/guard，不混过程记录。

人工检查C04零send、C05无callback前提/无claim、C06先请求授权/零probe、完整factory/actor/current、stable effect跨C04/E02与unknown-original边界pass；静态审计后才进入Q。计划测试沿原protocol/API及三用例：sensitive Gate explicit degraded/禁止action、attachment expiry、duplicate跨入口effect、初绑source已知、责任撤销、request无probe、post-commit未知；全部planned，未执行。

C2组内静态停审pass：五文档36表/24围栏行、576唯一定义/当步17声明，重复/结构错误0，diff-check通过；只进入Q，不改变产品/上游资格。
