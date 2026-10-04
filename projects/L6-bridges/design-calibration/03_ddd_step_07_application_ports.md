# L6-bridges 03 Step7：Application逐U端口契约

## 1. 唯一归属、共用签名与读写规则

本页只在各组思考许可后顺序追加；23既有业务port唯一在Application，Infra实现，19具体use case调用。所有路径均是Step4计划，非已建源码；不声明foreign同名API存在。

所有方法返回`BridgePortFuture<'a,T>`，其唯一错误`BridgePortError`及有限资格`BridgeQualificationOutcome<T>`见[支持卡](03_ddd_step_07_application_support.md)。以下trait均可dyn注入：只有lifetime泛型，无泛型方法/关联Future/dyn async fn；Future不要求Send，限定当前scoped call。

读取`read`同时携current受权context及Committed/Transaction baseline；所有key的namespace、scope、purpose、actor、validity与driver必须一致，缺权先Denied，不能泄露NotFound。mutable单行`Option<BridgeVersioned<T>>`，snapshot保Step6全部字段与read_basis。None仅获准精确查找无行，不证明无效果、回滚或过期可重跑。多候选不能取first；歧义有限Conflict/InvariantViolation。

分页`page.filter`必须与方法具名keys一致，普通关联list只LocalIdentity，eligible只EligibleAtThenIdentity且固定as_of。limit受context/control共同约束；next绑定主体/授权/筛选/source，不直接出wire。snapshot内Vec不能静默截断影响state guard所需范围：不足返回Unavailable，或先经具名分页读齐后形成满足预算的完整snapshot；不靠“部分集合”证明无active attempt/gap/claim。

写方法只接同driver登记的`&mut BridgeLocalTransaction`，expected须与tx.expected逐主语一致，Absent插入、Present实际原revision CAS；新/变更候选保Domain已定义revision规则。成功只`BridgeStagedWriteRef`，不出committed hydration，调用失败不默认rollback。唯一键、claim/one-use、全部subject/dedup/stored result/audit及条件handoff同一次UoW；actual commit在LocalUnitOfWorkPort。网络不进事务。

每个方法调用前消耗control预算、核实际clock/window/取消；`Cancelled`只本地停止。qualified业务处置与调用错误分开，既有owner/platform/consumer/commit结果各保原阶段，不从HTTP状态、错误文本、超时或factory推状态。

## 2. A1 / U1 binding、config与mapping

### 2.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| Pending/Suspended显式激活与Active current | BindingQualificationPort | C02、跨U IO、J05 | Identity/Governance及target owner组合适配 | Step8 C02、Step9、Step10 binding guards |
| external账号/位置/message两端授权与代际 | BindingQualificationPort、MappingRepository | C03、E01/E03、J01/J05、Q01 | owner qualification组合；同源LocalStoreAdapter | Step8 mapping提案、Step11唯一/CAS |
| Installation完整config/qualification与local revision | InstallationRepository；配置资格在A7 | C01、全部入口前置、J05、Q01 | LocalStoreAdapter | Step9 config接纳、Step14/04产品 |
| 受权关联失效与双向查询 | 具名list/find/snapshot | C02/C03/J05/Q01 | 同driver只读/事务 | 不跨namespace、不从ref推truth |

### BindingQualificationPort

定义`crates/application/src/ports/binding.rs`；资格需求，不拥有Identity、Policy/Gate或目标truth。所有候选basis均须实际解引用及核两端/主体/action/revocation/window；结果Qualified才可消费，shape constructor不授权。

```rust
/// 核显式绑定、两端映射与本次local读取责任；不自行签发权限。
pub trait BindingQualificationPort {
    /// 当前核验候选local读上下文，不以ref合法性授读权。
    fn qualify_local_read<'a>(&'a self, candidate: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeLocalReadContext>>;
    /// 核拟建relation两端与动作范围，只返回正式显式提案依据。
    fn qualify_proposal<'a>(&'a self, installation: &'a BridgeInstallationRef, external: &'a ExternalScopeLocator, target: &'a BridgeInternalTargetRef, actor: &'a ActorRef, actions: &'a BridgeDirectionActionSet, basis: &'a AuthorizedBindingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<AuthorizedBindingBasisRef>>;
    /// 核Pending/Suspended激活及许可新代际，不要求已有Active资格。
    fn qualify_activation<'a>(&'a self, binding: &'a ExternalBinding, expected: &'a ExpectedGeneration, actor: &'a ActorRef, basis: &'a AuthorizedBindingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BindingActivationQualification>>;
    /// 核Active原relation/action/责任链与撤销到期，最后IO前仍再核。
    fn qualify_current<'a>(&'a self, binding: &'a ExternalBinding, action: DirectionActionKind, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentBindingQualification>>;
    /// 当前核原relation暂停或到期维护依据；不激活relation。
    fn qualify_maintenance<'a>(&'a self, binding: &'a ExternalBinding, action: BindingMutationKind, actor: &'a ActorRef, basis: &'a QualificationMaintenanceBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualificationMaintenanceBasisRef>>;
    /// 当前核终态撤销依据，不把管理principal自动当所有owner授权。
    fn qualify_revocation<'a>(&'a self, subject: &'a BridgeViewSubjectRef, actor: &'a ActorRef, basis: &'a RevocationBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RevocationBasisRef>>;
    /// 核账号kind、正式actor责任与原relation；external_id不创建GlobalMember。
    fn qualify_identity_mapping<'a>(&'a self, current: &'a CurrentBindingQualification, external: &'a ExternalAccountLocator, actor: &'a ActorRef, basis: &'a IdentityMappingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<IdentityMappingBasisRef>>;
    /// 核位置/parent/root与正式target，parent不能从频道ID拼接。
    fn qualify_location_mapping<'a>(&'a self, current: &'a CurrentBindingQualification, external: &'a ExternalLocationLocator, parent: &'a ParentLocationRefSlot, target: &'a BridgeInternalTargetRef, basis: &'a LocationMappingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<LocationMappingBasisRef>>;
    /// 核known原结果/message/source回链；unknown不能建Linked。
    fn qualify_message_mapping<'a>(&'a self, current: &'a CurrentBindingQualification, message: &'a ExternalMessageLocator, source: &'a SafeSourceVersionRef, known: &'a KnownMappingResultRef, basis: &'a MappingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<MappingBasisRef>>;
    /// 从完整实际mapping读面核原change/thread/actor动作上下文。
    fn qualify_mapping<'a>(&'a self, snapshot: &'a AuthorizedMappingSnapshot, current: &'a CurrentBindingQualification, action: DirectionActionKind, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<AuthorizedMappingContextRef>>;
    /// 核原mapping失效或known删除处置，不允许任意caller写tombstone。
    fn qualify_mapping_invalidation<'a>(&'a self, mapping: &'a MappingRef, actor: &'a ActorRef, basis: &'a MappingInvalidationBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<MappingInvalidationBasisRef>>;
    /// 解引用正式owner删除处置，核同message/source/version/target/actor/Delete/current，不删除任何owner实体。
    fn qualify_tombstone<'a>(&'a self, mapping: &'a ExternalMessageMapping, current: &'a CurrentBindingQualification, actor: &'a ActorRef, disposition: &'a OwnerChangeDispositionRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<OwnerChangeDispositionRef>>;
}
```

| 方法组 | 输入来源 / 输出后置条件 | missing / stale / conflict | 测试切口 |
|---|---|---|---|
| local_read / proposal | trusted actor及正式source；输出完整scope/window与same actor/两端 | 缺实际owner合同Blocked/Unavailable，无默认tenant | ref合法但未授权、跨kind/scope拒绝 |
| activation / current | actual relation+generation；activation明确next，current只原Active | CAS以本地原读为准；Pending不要求Active，撤销/expiry立即Stale | Pending可核激活、旧代际不可外呼 |
| maintenance / revocation | 维护只Suspend/Expire；Revocation独立basis | 其余action InvalidInput；到期须actual now，不按日志 | 不从PAT/role/lease授维护权 |
| 三mapping / mapping context | current两端、parent、known结果、完整snapshot | Edit/Delete/Reply缺原mapping不可猜；AI只正式锚点，外部human需正式来源 | 原target/action/source版本一致、unknown不可Linked |
| invalidation | 已知原mapping/当前正式失效依据 | 只失效已核关联，不重建owner truth | revoke后current即时阻、后台J05非放行条件 |
| tombstone | caller disposition经正式owner来源解引用；同原mapping的external locator/source version/binding generation/target/Delete与actor责任，核期限及撤销；只回原处置ref | 仅Linked/Stale；原CAS另核。owner无compatible处置查询面NotEstablished，wrong source/kind或权限Denied；ACK/平台delete通知不作owner处置 | 外部delete不自动Tombstoned，typed合法但过期/异actor拒绝；known处置与原回链一起保留 |

### InstallationRepository

定义`crates/application/src/ports/binding.rs`；LocalStoreAdapter实现，C01/J05写，各用例和Q01按受权用途读。

```rust
/// 保存本地安装安全引用、配置版本与资格状态，不保存凭据。
pub trait InstallationRepository {
    /// 精确读取完整安装及local版本与hydration。
    fn get<'a>(&'a self, installation: &'a BridgeInstallationRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<BridgeInstallation>>>;
    /// 同namespace唯一反查；不默认创建或跨安装命中。
    fn find_by_namespace<'a>(&'a self, namespace: &'a InstallationNamespace, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<BridgeInstallation>>>;
    /// current config与qualification完整快照，仅已提交baseline。
    fn read_snapshot<'a>(&'a self, installation: &'a BridgeInstallationRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<InstallationSnapshot>>;
    /// 本获准namespace的既有安装页，不扫描其他tenant。
    fn list_by_namespace<'a>(&'a self, namespace: &'a InstallationNamespace, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<BridgeInstallation>>>;
    /// configure/apply/suspend/restart/retire候选只stage，同tx CAS。
    fn stage<'a>(&'a self, candidate: &'a BridgeInstallation, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
}
```

get/find/snapshot读完整11字段、read_basis与local revision；配置revision单独核，不替local CAS。find有唯一namespace约束，多命中InvariantViolation，不取最新时间。list仅Installation filter。stage首建Absent、其余Present；qualification更新/retired都不删原result/unknown。raw settings、token、secret、private route均不能入行；同key结果/audit的stage由UoW共同提交。

### MappingRepository

定义`crates/application/src/ports/binding.rs`；LocalStoreAdapter实现，C02/C03/E01/J01/J05写，跨U和Q01受权读。relation归此port，不再新建BindingRepository。

```rust
/// 经授权relation及三mapping的完整本地读写，不拥有外部账号/频道/消息truth。
pub trait MappingRepository {
    /// 原relation完整版本行。
    fn get_binding<'a>(&'a self, binding: &'a ExternalBindingRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalBinding>>>;
    /// 同安装完整relation页；filter固定Binding。
    fn list_bindings<'a>(&'a self, installation: &'a BridgeInstallationRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalBinding>>>;
    /// 同安装external scope所有受限relation候选，禁止取第一项猜target。
    fn find_bindings_for_external<'a>(&'a self, installation: &'a BridgeInstallationRef, external: &'a ExternalScopeLocator, action: DirectionActionKind, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalBinding>>>;
    /// 同安装内部target反查relation；target须已正式解析。
    fn find_bindings_for_target<'a>(&'a self, installation: &'a BridgeInstallationRef, target: &'a BridgeInternalTargetRef, action: DirectionActionKind, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalBinding>>>;
    /// 原identity完整行。
    fn get_identity<'a>(&'a self, mapping: &'a IdentityMappingRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalIdentityMapping>>>;
    /// 原location完整行。
    fn get_location<'a>(&'a self, mapping: &'a LocationMappingRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalLocationMapping>>>;
    /// 原message完整行，Tombstoned也保留原版本/结果关联。
    fn get_message<'a>(&'a self, mapping: &'a MessageMappingRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalMessageMapping>>>;
    /// exact账号+relation+generation双向身份的外部查找。
    fn find_identity<'a>(&'a self, binding: &'a ExternalBindingRef, generation: &'a BindingGeneration, external: &'a ExternalAccountLocator, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalIdentityMapping>>>;
    /// exact位置+relation+generation，不按频道显示名查找。
    fn find_location<'a>(&'a self, binding: &'a ExternalBindingRef, generation: &'a BindingGeneration, external: &'a ExternalLocationLocator, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalLocationMapping>>>;
    /// 原平台message/action/generation查找，不跨方向或已删回链。
    fn find_message<'a>(&'a self, binding: &'a ExternalBindingRef, generation: &'a BindingGeneration, external: &'a ExternalMessageLocator, action: DirectionActionKind, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalMessageMapping>>>;
    /// 正式内部actor反查原identity集合，仍限relation/generation。
    fn list_identities_for_actor<'a>(&'a self, binding: &'a ExternalBindingRef, generation: &'a BindingGeneration, actor: &'a ActorRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalIdentityMapping>>>;
    /// 正式target反查位置集合，不查询owner私表。
    fn list_locations_for_target<'a>(&'a self, binding: &'a ExternalBindingRef, generation: &'a BindingGeneration, target: &'a BridgeInternalTargetRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalLocationMapping>>>;
    /// exact安全source/version回链已有known message，保每项direction。
    fn list_messages_for_source<'a>(&'a self, binding: &'a ExternalBindingRef, generation: &'a BindingGeneration, source: &'a SafeSourceVersionRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalMessageMapping>>>;
    /// 同relation三类既有mapping分别分页供失效，不使用任意Any行。
    fn list_identities<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalIdentityMapping>>>;
    /// 同relation位置页。
    fn list_locations<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalLocationMapping>>>;
    /// 同relationmessage页，含Stale/Tombstoned历史。
    fn list_messages<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalMessageMapping>>>;
    /// exact已解析mapping上下文的完整relation/三mapping/read_basis。
    fn read_authorized_snapshot<'a>(&'a self, context: &'a AuthorizedMappingContextRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<AuthorizedMappingSnapshot>>;
    /// relation候选stage，generation仍独立核。
    fn stage_binding<'a>(&'a self, candidate: &'a ExternalBinding, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// identity候选stage，不创建内部actor。
    fn stage_identity<'a>(&'a self, candidate: &'a ExternalIdentityMapping, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// location候选stage，不创建内部Conversation/channel。
    fn stage_location<'a>(&'a self, candidate: &'a ExternalLocationMapping, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// known结果回链/失效/tombstone候选stage，不直接删平台消息。
    fn stage_message<'a>(&'a self, candidate: &'a ExternalMessageMapping, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
}
```

find精确lookup无行返回None；Stale/Revoked/Tombstoned完整保留但不能作新IO current依据。普通list可读取历史供current过滤，不自动刷新。snapshot的identity/message None仅正式不适用或缺失，动作required缺失由资格Blocked；不可隐式创建。写入known消息必须actual OwnerAccepted或known平台结果，不以ACK/local commit补。

### 2.2 A1草稿、复杂度与停审

| 审查项 | 结论 / 后续 |
|---|---|
| 读取面 | 三port的反查、完整version行、完整snapshot、关联页承接C01~03、Q01及跨U；每个stage有同typed get/list |
| 授权来源 | binding activation/current分开；identity/channel/message并非本仓truth；human/Integration/AI责任不以external_id推定 |
| 写入版本 | LocalRevision与config/generation分轴，所有stage同tx/expected/result/audit；实际commit在A7，细节Step11 |
| 复杂度 | 不增新业务port、repository或泛化Service；同形规则只§1/A0定义，具名函数防任意lookup |
| 测试切口 | Application binding_flow_tests：跨安装/代际、歧义、Missing parent、AI/human责任、旧授权；Infra store：CAS/唯一/反查一致；只计划，不执行 |
| 设计自检 | A1人工逐签名/字段来源/边界检查pass；筛选cursor精确闭包列入X审计，下一仅A2 |

草稿：未来正式§5 Application U1小节承接本组三个trait、当前资格与read/write规则；§6只建立索引，不输出本页过程。BR-UP-002/003/007仍open。

## 3. A2 / U2 inbound与owner handoff

### 3.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| 本call raw验源、safe locator/change/origin、独立ACK计划；或actual source discontinuity | PlatformIngressPort | E01 | 四PlatformAdapter / qualified source host | Step8 E01、Step9 ACK/notice顺序；非新业务入口 |
| 原target模式、责任、owner要求材料/digest/附件与same-op交接 | ConversationHandoffPort | E01、J02 | ConversationOwnerAdapter组合Artifact/target seam | BR-UP-001/004；不得本地造Turn |
| 完整InboundHandoffRecord/source/op接管与结果 | InboundRepository | E01/J02/Q02 | LocalStoreAdapter | Step11同dedup/result/audit UoW |

### PlatformIngressPort

定义`crates/application/src/ports/inbound.rs`；只有当前安装已注册exact source/mode可调用，api/worker通过E01间接调用。

X审计发现断连只有“通知Application”的描述，没有具名输入路径；本Step在原E01加入safe source-only分支，不增加E05或20th业务callable。以下两个internal carrier唯一归此文件，均只safe字段、无平台消息体/private reply。

```rust
/// actual source host对原stream断连/换epoch的body-free材料，不是coverage或授权。
pub struct BridgeSourceContinuityNotice {
    /// 正式source recipe的notice identity，不从时间/trace/message body生成。
    event_key: SafeOpaqueId,
    /// 仅原Protocol stage来源流；不改Owner/Delivery位置。
    stream: CursorNamespaceStream,
    /// actual原epoch；不得由worker自造。
    previous: QualifiedStreamEpoch,
    /// actual新epoch或显式Missing/Stale，不以reconnect推续接。
    next: QualificationSlot<QualifiedStreamEpoch>,
    /// 原source给出的缺口范围；无法比较必须Unknown。
    range: GapRangeBounds,
    /// 正式source有限断连/换epoch原因。
    reason: SafeGapReason,
    /// actual source host材料依据，shape factory不生成proof。
    basis: SafeAuthorityRef,
}

/// Platform verifier核notice/current source后形成的local mutation读取资格。
pub struct BridgeQualifiedContinuityNotice {
    /// 完整已核原notice；不改变event key/stream/epoch/range。
    notice: BridgeSourceContinuityNotice,
    /// 受限原Protocol stream Ingress purpose读，不是Query/任意维护权。
    read: BridgeLocalReadContext,
    /// 正式同stream comparator或明确缺失，不能从通知字符串推断。
    comparator: AuthoritativeComparatorRefSlot,
    /// 正式same source/range依据，缺则不能detect gap。
    range: QualificationSlot<QualifiedGapRangeRef>,
    /// 正式epoch变更或缺失；next Missing不能制造change。
    epoch_change: QualificationSlot<StreamEpochChangeRef>,
    /// 正式原source recovery window或Missing；不授probe。
    window: RecoveryWindowRefSlot,
}
```

| 完整factory签名 | 中文Rustdoc / 限制 |
|---|---|
| `BridgeSourceContinuityNotice::from_parts(event_key: SafeOpaqueId, stream: CursorNamespaceStream, previous: QualifiedStreamEpoch, next: QualificationSlot<QualifiedStreamEpoch>, range: GapRangeBounds, reason: SafeGapReason, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 完整校验actual host移交的safe材料；不生成事件identity、范围、coverage或授权。 |
| `BridgeQualifiedContinuityNotice::from_parts(notice: BridgeSourceContinuityNotice, read: BridgeLocalReadContext, comparator: AuthoritativeComparatorRefSlot, range: QualificationSlot<QualifiedGapRangeRef>, epoch_change: QualificationSlot<StreamEpochChangeRef>, window: RecoveryWindowRefSlot) -> Result<Self, ContractViolation>` | /// 复制六字段；所有Established必须正式same stream/source/epoch/range/current；Missing保缺口，不cast kind、不授coverage/probe。 |

逐字段提供同名`pub fn field(&self) -> &FieldType`只读getter，字段/返回类型与上方schema逐项同名同型，不提供mutable/raw/serde/Debug/Clone/Error-source。notice须stream.stage=Protocol、previous.stream=stream、next若Established也same stream，basis source/kind/scope/version与actual注册一致；range Known必须正式comparator，缺口不能填零/时间。qualified factory额外核notice与read的installation/scope/purpose/window一致；pure factory不授source资格。

| BridgeQualifiedContinuityNotice只读签名 | 中文Rustdoc |
|---|---|
| `pub fn notice(&self) -> &BridgeSourceContinuityNotice` | /// 纯读原完整notice。 |
| `pub fn read(&self) -> &BridgeLocalReadContext` | /// 纯读实际Ingress用途资格，不升级Query/维护。 |
| `pub fn comparator(&self) -> &AuthoritativeComparatorRefSlot` | /// 保原来源或Missing。 |
| `pub fn range(&self) -> &QualificationSlot<QualifiedGapRangeRef>` | /// 保range资格，非原notice raw bounds替代。 |
| `pub fn epoch_change(&self) -> &QualificationSlot<StreamEpochChangeRef>` | /// 保原change资格，缺时不改epoch。 |
| `pub fn window(&self) -> &RecoveryWindowRefSlot` | /// 纯读原正式窗口，不续授权。 |

```rust
/// 本次私有输入转成已验证safe来源，不拥有平台或内部Conversation truth。
pub trait PlatformIngressPort {
    /// 本call验证签名/来源、安装、source版本、原locator与anti-loop；不存raw。
    fn verify<'a>(&'a self, input: &'a PrivateIngressContext<'a>, installation: &'a BridgeInstallation, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, IngressVerificationResult>;
    /// 只核actual source discontinuity及原流local read资格，不授owner handoff或新消息权。
    fn qualify_continuity_notice<'a>(&'a self, notice: &'a BridgeSourceContinuityNotice, installation: &'a BridgeInstallation, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeQualifiedContinuityNotice>>;
}
```

input/secret均短借活owner buffer。None secret仅此正式source-mode明确不需要该secret，required缺失NotEstablished。返回Verified的namespace/source/account/message/change/origin及ACK计划全部来自actual verifier；缺material_source保Missing而不造SafeSource。Rejected/Unavailable用VerificationFailure保有限ACK计划。消息来自本桥不能简单按bot_id丢弃：必须verified origin+原effect/source匹配；普通bot消息也不自动是本桥回环。平台验证不授binding、material、actor、Turn或Gate权。

notice qualification由相同typed router核actual host材料来源、注册/family/版本/current source及原stream scope，Callback来源的source-loss只允许本地Protocol gap分支，不套消息/owner语义。Qualified后Application用既有ContinuityRepository读取exact cursor/gaps/dedup，same UoW记录incomparable/open gap/audit/result，不能advance position、close gap或创建InboundHandoffRecord/Conversation/GlobalMember。notice没有private ACK，结果ACK=NotSent；缺actual source proof/当前写资格则Blocked/Unavailable，worker保Disconnected且禁止宣称已durable gap或续接完成。

### ConversationHandoffPort

定义`crates/application/src/ports/inbound.rs`；ConversationOwnerAdapter负责映射实际owner协议，Artifact及target缺口只能资格组合，不能调用owner私表。

```rust
/// 当前owner材料准入与原operation交接需求，返回owner真实阶段。
pub trait ConversationHandoffPort {
    /// 按正式target-kind合同解析原目标模式，非频道名/类型猜测。
    fn resolve_target_mode<'a>(&'a self, mapping: &'a AuthorizedMappingContextRef, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeTargetMode>>;
    /// raw只本call转交正式owner材料准入，返回exact source/digest/附件安全资格。
    fn qualify_material<'a>(&'a self, ingress: &'a QualifiedIngressContext, mapping: &'a AuthorizedMappingContextRef, actor: &'a ActorRef, mode: &'a BridgeTargetMode, input: &'a PrivateIngressContext<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentMaterialQualification>>;
    /// 最后IO前重核原材料/target/mode，旧ref不自动仍有效。
    fn revalidate_material<'a>(&'a self, current: &'a CurrentMaterialQualification, mapping: &'a AuthorizedMappingContextRef, actor: &'a ActorRef, mode: &'a BridgeTargetMode, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentMaterialQualification>>;
    /// actual durable接管后以同operation/claim交owner，不创建内部truth。
    fn handoff<'a>(&'a self, record: &'a InboundHandoffRecord, original: &'a OriginalOperationEffectRef, claim: &'a HandoffClaimRef, binding: &'a CurrentBindingQualification, material: &'a TransientQualifiedMaterialHandle<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerHandoffResultRef>;
    /// 只读权威原operation结果，NotFound不可解释成no-effect。
    fn read_original_result<'a>(&'a self, original: &'a OriginalOperationEffectRef, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerHandoffResultRef>;
}
```

qualification必须核actor/participant、mode、target、原source/版本、附件及required digest；digest只owner给的ref，不hash外部正文。raw准入不能返回/记录owner内部材料正文。handoff必须record required Slots齐、claim actual commit+fence/current、original一致；外部网络不持local tx。结果OwnerResultKind的Accepted/Rejected/Pending/Indeterminate保独立，Accepted才含正式accepted依据；超时/未知不伪Rejected或换op。known accepted原result仍受current visibility再核，lookup本身不更新record或建回链。

### InboundRepository

定义`crates/application/src/ports/inbound.rs`；LocalStoreAdapter实现。

```rust
/// 本地入站安全接管及原阶段读取，与平台ACK和owner提交分离。
pub trait InboundRepository {
    /// 原record完整mutable行及版本。
    fn get<'a>(&'a self, record: &'a InboundRecordRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<InboundHandoffRecord>>>;
    /// exact verified source原接管，不重新解析private输入。
    fn find_by_source<'a>(&'a self, source: &'a VerifiedPlatformSourceRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<InboundHandoffRecord>>>;
    /// 原operation反查，含Indeterminate，不能不存在就重交。
    fn find_by_operation<'a>(&'a self, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<InboundHandoffRecord>>>;
    /// 完整record/dedup/original/read_basis一致已提交快照。
    fn read_snapshot<'a>(&'a self, record: &'a InboundRecordRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<InboundSnapshot>>;
    /// Verified至结果/独立ACK字段的pure候选同UoW stage。
    fn stage<'a>(&'a self, candidate: &'a InboundHandoffRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
}
```

每个lookup返回完整14字段及local revision/hydration；snapshot必要dedup关联缺失不能作fresh proof。stage首建Absent，qualify/claim前置/结果/unknown/ACK字段Present，foreign accepted不会隐式改平台ACK。原key/claim/result由Continuity/UoW同提交；安全raw source ref只有actual准入，不落外部正文。

### 3.2 A2草稿、复杂度与停审

三port本组人工设计自检pass：验源/内部授权/材料准入/本地接管/actual ACK/owner结果六面独立，完整source/op反查与读写配对，private不出safe结果。测试切口为inbound_flow_tests及四平台反腐测试：伪signature、cross-installation、echo、缺parent/digest、ACK lost、owner unknown、duplicate零新IO；只计划，未执行。复杂度仍一个E01，不增加raw inbox、Turn writer或通用replay。下一仅A3；BR-UP-001/004/008/009仍open。

## 4. A3 / U3 presentation与delivery

### 4.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| owner已提交source、projection、Gate降级与附件资格 | PresentationQualificationPort | C04/E02/J01/J05 | Governance/Conversation/Artifact及选用Workspace组合 | Step8源协议；Step9/10 guards |
| 原attempt一次method调用、known/unknown/no-IO及rate bounds | PlatformDeliveryPort | J01、J02只probe | 四PlatformAdapter | BR-UP-007~009；Step11/13 lane协调 |
| 四local模型及C04/E02共同effect、原result读写 | DeliveryRepository | C04/E02/J01/J02/J05/Q02 | LocalStoreAdapter | CAS、effect唯一、receipt immutable append |

### BridgeDeliveryCallOutcome

计划归属`crates/application/src/ports/delivery.rs`；本次原attempt的有限结果及全部已知等待下界，不合并为delivered。

```rust
/// 本次原attempt的有限结果及全部已知等待下界，不合并为delivered。
pub enum BridgeDeliveryCallOutcome {
    /// actual method已知业务结果与完整rate bounds；accepted不证明用户送达。
    Known(KnownPlatformBusinessResult),
    /// 原效果可能已发生；保原identity及已核下界，Missing不允许新调用。
    Indeterminate {
        /// attempt的typed载荷，来源按本变体约束，不接受raw材料。
        attempt: AttemptEffectRef,
        /// bounds的typed载荷，来源按本变体约束，不接受raw材料。
        bounds: QualificationSlot<QualifiedRateLimitBoundSet>,
        /// reason的typed载荷，来源按本变体约束，不接受raw材料。
        reason: SafeReasonCode,
    },
    /// actual driver确认原attempt从未发起IO；不同于平台no-effect。
    NotDispatched {
        /// attempt的typed载荷，来源按本变体约束，不接受raw材料。
        attempt: AttemptEffectRef,
        /// proof的typed载荷，来源按本变体约束，不接受raw材料。
        proof: NoIoProofRef,
        /// bounds的typed载荷，来源按本变体约束，不接受raw材料。
        bounds: QualificationSlot<QualifiedRateLimitBoundSet>,
    },
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Known(KnownPlatformBusinessResult)` | actual method已知业务结果与完整rate bounds；accepted不证明用户送达。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Indeterminate { attempt: AttemptEffectRef, bounds: QualificationSlot<QualifiedRateLimitBoundSet>, reason: SafeReasonCode }` | 原效果可能已发生；保原identity及已核下界，Missing不允许新调用。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `NotDispatched { attempt: AttemptEffectRef, proof: NoIoProofRef, bounds: QualificationSlot<QualifiedRateLimitBoundSet> }` | actual driver确认原attempt从未发起IO；不同于平台no-effect。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。不得靠timeout/cancel/lease expiry制造NotDispatched；只有正式完整limit mapping才Established。known reject与no-effect仍独立；未知或缺bounds阻相应lane，不丢同次响应已核下界。


### PresentationQualificationPort

### LanePreparationQualification

归属同`ports/delivery.rs`；Application-only。所有字段由qualify_lane的正式安装/target/action/capability与原scope预算核验产生，factory不签发资格；不得从target ID拼lane或major_resource。

```rust
/// prepare阶段可用的完整lane输入；不是dispatch资格。
pub struct LanePreparationQualification {
    /// 正式安装/绑定代际/位置/action/resource顺序scope。
    scope: QualifiedLaneOrderScope,
    /// 原create/thread依赖或正式NotRequired。
    dependency: DeliveryDependencyRefSlot,
    /// 全部global/method/resource/bucket下界，不截断。
    bounds: QualifiedRateLimitBoundSet,
    /// 原scope/window预算及actual usage，不能reset。
    budget: RetryBudgetRef,
    /// 正式rate资格来源及窗口。
    rate_basis: RateLimitQualificationRef,
}
```

| 完整签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(scope: QualifiedLaneOrderScope, dependency: DeliveryDependencyRefSlot, bounds: QualifiedRateLimitBoundSet, budget: RetryBudgetRef, rate_basis: RateLimitQualificationRef) -> Result<Self, ContractViolation>` | /// 复制全字段，核same scope/action/window和完整bounds/budget；零权限/IO。 |
| `pub fn scope(&self) -> &QualifiedLaneOrderScope` | /// 纯读原scope，禁止借ref授执行权。 |
| `pub fn dependency(&self) -> &DeliveryDependencyRefSlot` | /// 纯读原dependency。 |
| `pub fn bounds(&self) -> &QualifiedRateLimitBoundSet` | /// 纯读完整等待下界。 |
| `pub fn budget(&self) -> &RetryBudgetRef` | /// 纯读原预算，不生成新窗口。 |
| `pub fn rate_basis(&self) -> &RateLimitQualificationRef` | /// 纯读原正式来源。 |

定义`crates/application/src/ports/delivery.rs`；current组合qualification，不能自生成owner提交或Gate decision。

```rust
/// 原source与外显资格组合，缺显式降级授权时Blocked。
pub trait PresentationQualificationPort {
    /// 原NoEffect、current presentation、scope预算/window及所有rate下界五源齐才形成retry资格；零send。
    fn qualify_retry<'a>(&'a self, delivery: &'a DeliverySnapshot, lane: &'a LaneSnapshot, no_effect: &'a NoEffectBasisRef, current: &'a CurrentPresentationQualification, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RetryEligibilityRef>>;
    /// 当前核same target/action/安装capability对应lane scope、完整dependency/rate/预算，零业务发送。
    fn qualify_lane<'a>(&'a self, target: &'a ImmutableDeliveryTargetRef, presentation: &'a CurrentPresentationQualification, capability: &'a CapabilitySnapshotRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<LanePreparationQualification>>;
    /// 核source事件实际owner committed依据，不以Bus ACK/请求自报版本证明。
    fn qualify_source<'a>(&'a self, source: &'a CommittedSourceVersionRef, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CommittedSourceVersionRef>>;
    /// C04/E02按同source/target/method核projection、Gate、附件及explicit degraded。
    fn qualify<'a>(&'a self, source: &'a CommittedSourceVersionRef, target: &'a ImmutableDeliveryTargetRef, kind: ExternalDeliveryKind, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentPresentationQualification>>;
    /// 原plan最后IO前重新核target/source/action/generation/revocation/expiry。
    fn revalidate<'a>(&'a self, plan: &'a SafePresentationPlan, target: &'a ImmutableDeliveryTargetRef, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentPresentationQualification>>;
    /// 仅原intent的current dispatch交集，不新建intent或授外部effect。
    fn qualify_dispatch<'a>(&'a self, delivery: &'a DeliverySnapshot, lane: &'a LaneSnapshot, presentation: &'a CurrentPresentationQualification, bounds: &'a QualifiedRateLimitBoundSet, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<DispatchEligibilityRef>>;
    /// 原plan/source失效的正式维护依据，不把查询变repair。
    fn qualify_invalidation<'a>(&'a self, plan: &'a SafePresentationPlan, basis: &'a QualificationMaintenanceBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<PresentationInvalidationBasisRef>>;
}
```

Qualified/Degraded取决actual projection/disclosure/attachments/capability；Degraded必须明确授权且无敏感审批内容/action。Blocked不使用低敏感label、公开URL或Workspace read代替Gate。附件空集合只正式owner声明无附件或许可省略，grant expiry立即阻；线程/edit/delete缺dependency或正式method支持返回Unsupported。dispatch返回original intent/effect、原lane/dependency、全部bounds、retry预算、attempt window；不由“lane Ready”单标签授权。

### PlatformDeliveryPort

定义`crates/application/src/ports/delivery.rs`；四platform adapter实现；J01调用一次，不隐藏重试、token刷新后重发或SDK自动retry。J02原结果查询由AuthoritativeRecoveryPort调用只读分支。

```rust
/// 一次原attempt/effect的外部方法及rate/probe安全转换。
pub trait PlatformDeliveryPort {
    /// 只核原scope所有适用global/method/resource/bucket下界与完整资格。
    fn qualify_rate_bounds<'a>(&'a self, scope: &'a QualifiedLaneOrderScope, capability: &'a CapabilitySnapshotRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualifiedRateLimitBoundSet>>;
    /// 当前fence/qualified secret/payload最后核验后最多一次method effect。
    fn dispatch<'a>(&'a self, attempt: &'a DeliveryAttempt, intent: &'a DeliveryIntent, eligibility: &'a DispatchEligibilityRef, claim: &'a FencedClaimRef, payload: &'a PrivateQualifiedPayload<'a>, secret: &'a PrivateSecretHandle<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeDeliveryCallOutcome>;
    /// 原operation/effect精确readonly权威probe，不send/edit/delete。
    fn probe_original<'a>(&'a self, original: &'a OriginalOperationEffectRef, qualification: &'a RecoveryQualificationRef, secret: &'a PrivateSecretHandle<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
}
```

dispatch payload仅短借，必须原attempt/effect/plan/source/target/current secret/version/route匹配。one IO不表示exactly-once保证，未知保原effect；no-effect必须正式same-op依据，NotDispatched仅driver确认从未调用。所有已核rate headers/body hints有限映射为qualified bounds，包括429/unknown，不把raw header/body入error/log。完整bounds不足则Missing/Unavailable阻后续调用，已核下界不能清空或缩短；adapter不可吞shared/global bound。probe方法不另起业务effect，平台不提供精确probe/coverage时Unknown/Unavailable，不按NotFound猜无效果。

### DeliveryRepository

定义`crates/application/src/ports/delivery.rs`；LocalStoreAdapter；八repo同driver，receipt immutable。

```rust
/// 本地plan/intent/attempt/receipt与原effect的完整读写。
pub trait DeliveryRepository {
    /// 完整原plan及local revision。
    fn get_plan<'a>(&'a self, plan: &'a PresentationPlanRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<SafePresentationPlan>>>;
    /// 完整原intent及local revision。
    fn get_intent<'a>(&'a self, intent: &'a DeliveryIntentRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DeliveryIntent>>>;
    /// 完整原attempt、claim、window/result及local revision。
    fn get_attempt<'a>(&'a self, attempt: &'a AttemptRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DeliveryAttempt>>>;
    /// immutable known receipt完整读，不从HTTP status创建。
    fn get_receipt<'a>(&'a self, receipt: &'a PlatformReceiptRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<PlatformReceipt>>>;
    /// C04/E02共同semantic effect唯一反查，不能换入口重复prepare。
    fn find_by_effect<'a>(&'a self, effect: &'a StableEffectIdentity, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DeliveryIntent>>>;
    /// 原operation反查，未知也保原记录。
    fn find_by_operation<'a>(&'a self, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DeliveryIntent>>>;
    /// 完整plan/intent/attempts/receipts/original/read_basis；required集合不截断。
    fn read_snapshot<'a>(&'a self, intent: &'a DeliveryIntentRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<DeliverySnapshot>>;
    /// standalone plan完整root，不要求存在intent，不补投递状态。
    fn read_plan_snapshot<'a>(&'a self, plan: &'a PresentationPlanRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<PresentationSnapshot>>;
    /// 同binding既有plan页供代际失效，filter限定DeliveryPlans。
    fn list_plans_for_binding<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<SafePresentationPlan>>>;
    /// 同binding既有intent页供失效/原effect定位，filter限定DeliveryIntents。
    fn list_intents_for_binding<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<DeliveryIntent>>>;
    /// 原intent bounded attempt历史，filter限定AttemptsForIntent。
    fn list_attempts<'a>(&'a self, intent: &'a DeliveryIntentRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<DeliveryAttempt>>>;
    /// 原intent known receipt页，filter限定ReceiptsForIntent。
    fn list_receipts<'a>(&'a self, intent: &'a DeliveryIntentRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<PlatformReceipt>>>;
    /// plan候选stage。
    fn stage_plan<'a>(&'a self, candidate: &'a SafePresentationPlan, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// intent候选及原effect唯一同tx stage。
    fn stage_intent<'a>(&'a self, candidate: &'a DeliveryIntent, effect: &'a StableEffectIdentity, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// attempt候选及claim/window/result同tx stage。
    fn stage_attempt<'a>(&'a self, candidate: &'a DeliveryAttempt, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// immutable receipt只Absent append，同attempt/result关联；不覆盖原receipt。
    fn append_receipt<'a>(&'a self, candidate: &'a PlatformReceipt, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
}
```

stage_intent的effect须与source_projection/target/kind逐字段一致；唯一冲突Effect/同key变义SemanticKey，不重建ID绕冲突。attempt claim/window读面和Lane/UoW current fence核验共同成立才外呼；stage不是fence已提交。receipt local_revision=1只append，get/list完整immutable材料；unknown无KnownReceipt，读缺失不授权重试。

### 4.2 A3草稿、复杂度与停审

人工设计自检pass：C04/E02共同effect读写闭合；19模型中的四个U3模型都有get和stage/append；binding失效关联、完整snapshot、unknown/rate/no-IO类型闭口，无平台truth镜像。复杂度维持prepare与dispatch分离，不加SDK facade业务入口。计划测试切口delivery_flow_tests、platform_contract_tests、continuity_flow_tests：stale Gate/附件、明确无action degraded、跨入口duplicate、429共享bucket、原attempt unknown、receipt immutable；未执行。下一A4；BR-UP-003~009仍open。

## 5. A4 / U4 callback、actor与action

### 5.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| 验签及safe原action/source定位，零内部授权 | CallbackVerificationPort | E03、C05只known source核验 | 四PlatformAdapter | Step8 callback body与private入口 |
| external账号/AI锚点与正式human/Integration责任 | ActorResponsibilityPort | C03/C05/E01/E03 | Identity及正式认证/责任source组合 | BR-UP-002；无GlobalMember自动创建 |
| 原owner动作/状态/授权/expiry与same-op结果 | OwnerActionPort | C05/E03/J02/J05 | GovernanceOwnerAdapter | 不直接修改Decision/Gate |
| source-action及callback原record/claim/result原子接管 | CallbackRepository | C05/E03/J02/J05/Q02 | LocalStoreAdapter | one-use CAS/UoW，Step11/13 |

### 5.2 本Step发现的初绑资格冲突与唯一纠正

Step6的ExternalActionBinding.bind把current参数写为CurrentActionQualification，而该carrier强制要求实际callback验证。C05在callback尚不存在时不能制造该依据。当前只在Step7补充**初绑专用资格**，并把纯Domain bind的一个参数类型修正为下列ActionBindingQualification；不改前序文件、不增对象/状态/入口。CurrentActionQualification仍只E03 current callback，QualifiedCallbackContext仅在平台来源+责任+owner完整组合后形成。Step8/9/正式装配须采用本条，不沿旧参数回填。

### ActionBindingQualification

计划归属`crates/contracts/src/shared/authority.rs`；原known外显source-action的显式初绑资格；不是callback发生或消费证明。

```rust
/// 原known外显source-action的显式初绑资格；不是callback发生或消费证明。
pub struct ActionBindingQualification {
    /// 原relation当前资格。
    binding: CurrentBindingQualification,
    /// 原known intent/message/source。
    source: SourceIntentMessageRef,
    /// 初绑正式责任。
    actor: ActorResponsibilityRef,
    /// 明确owner动作。
    action: OwnerTargetActionRef,
    /// 当前owner条件。
    owner_revision: OwnerActionStateRevision,
    /// 明确初绑授权。
    authorization: ActionAuthorizationBasisRef,
    /// 真实one-use/expiry条件。
    expiry: ActionExpiryOneUseRef,
    /// known外显来源的核验依据。
    source_verification: SafeAuthorityRef,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| binding | `CurrentBindingQualification` | 必填 | BindingQualificationPort，same generation/action |
| source | `SourceIntentMessageRef` | 必填 | Delivery/Mapping实际known回链 |
| actor | `ActorResponsibilityRef` | 必填 | ActorResponsibilityPort；不从按钮actor字符串推 |
| action | `OwnerTargetActionRef` | 必填 | OwnerActionPort真实target/kind |
| owner_revision | `OwnerActionStateRevision` | 必填 | owner actual read，非按钮状态 |
| authorization | `ActionAuthorizationBasisRef` | 必填 | owner当前action与外显授权交集 |
| expiry | `ActionExpiryOneUseRef` | 必填 | owner current合同；不claim一次性动作 |
| source_verification | `SafeAuthorityRef` | 必填 | CallbackVerificationPort.verify_bound_source，核平台/原消息/target/source；kind为正式注册source-binding verification，不冒充CallbackVerificationRef |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: CurrentBindingQualification, source: SourceIntentMessageRef, actor: ActorResponsibilityRef, action: OwnerTargetActionRef, owner_revision: OwnerActionStateRevision, authorization: ActionAuthorizationBasisRef, expiry: ActionExpiryOneUseRef, source_verification: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；完整两端/source/action/主体/期限交集；safe factory无权限；不能制造callback/claim/owner结果。没有正式source verification kind/schema时BR-UP-003/008 blocked，不自行发明foreign标签。 |
| 只读 | `pub fn binding(&self) -> &CurrentBindingQualification` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn source(&self) -> &SourceIntentMessageRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn actor(&self) -> &ActorResponsibilityRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn action(&self) -> &OwnerTargetActionRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn owner_revision(&self) -> &OwnerActionStateRevision` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn authorization(&self) -> &ActionAuthorizationBasisRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn expiry(&self) -> &ActionExpiryOneUseRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn source_verification(&self) -> &SafeAuthorityRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：完整两端/source/action/主体/期限交集；safe factory无权限；不能制造callback/claim/owner结果。没有正式source verification kind/schema时BR-UP-003/008 blocked，不自行发明foreign标签。；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。


纯Domain修正的完整签名（计划既有`crates/domain/src/callback/external_action_binding.rs`，仅资格参数替换；工厂其他字段和Bound状态不变）：

```rust
/// 接纳实际初绑资格，不要求尚不存在的callback验证，不产生IO/claim。
pub fn bind(action_binding_ref: ExternalActionBindingRef, installation_ref: BridgeInstallationRef, source_intent: SourceIntentMessageRef, actor_responsibility: ActorResponsibilityRef, target_action: OwnerTargetActionRef, owner_revision: OwnerActionStateRevision, binding_generation: BindingGeneration, expiry_one_use: ActionExpiryOneUseRef, authorization_basis: ActionAuthorizationBasisRef, one_use_claim: OneUseClaimRefSlot, current: ActionBindingQualification, now: SafeInstant) -> Result<Self, ContractViolation>;
```

### BridgeVerifiedCallbackSource

计划归属`crates/application/src/ports/callback.rs`；实际平台验证的safe callback定位中间载体，不含owner动作授权。

```rust
/// 实际平台验证的safe callback定位中间载体，不含owner动作授权。
pub struct BridgeVerifiedCallbackSource {
    /// exact安装隔离。
    namespace: InstallationNamespace,
    /// 已核平台来源版本。
    source: VerifiedPlatformSourceRef,
    /// 经验证的原action locator。
    action_binding: ExternalActionBindingRef,
    /// 原平台actor账号。
    account: ExternalAccountLocator,
    /// 原外显消息定位。
    message: ExternalMessageLocator,
    /// 纯平台签名/nonce/期限依据。
    platform_basis: SafeAuthorityRef,
    /// 独立ACK计划。
    ack: ProtocolAckPlan,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| namespace | `InstallationNamespace` | 必填 | verifier当前注册安装 |
| source | `VerifiedPlatformSourceRef` | 必填 | raw verifier实际结果 |
| action_binding | `ExternalActionBindingRef` | 必填 | authenticated opaque callback绑定；仍须repository读取比对 |
| account | `ExternalAccountLocator` | 必填 | verifier实际account/kind；不授ActorRef |
| message | `ExternalMessageLocator` | 必填 | actual signed/source语义；缺原source拒绝 |
| platform_basis | `SafeAuthorityRef` | 必填 | 实际verifier，不当CallbackVerificationRef |
| ack | `ProtocolAckPlan` | 必填 | exact mode/deadline；非actual reply |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(namespace: InstallationNamespace, source: VerifiedPlatformSourceRef, action_binding: ExternalActionBindingRef, account: ExternalAccountLocator, message: ExternalMessageLocator, platform_basis: SafeAuthorityRef, ack: ProtocolAckPlan) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；无CurrentActionQualification/owner批准/正文或private；action/message须再与stored known source核一致，签名不授内部权。 |
| 只读 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn source(&self) -> &VerifiedPlatformSourceRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn action_binding(&self) -> &ExternalActionBindingRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn account(&self) -> &ExternalAccountLocator` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn message(&self) -> &ExternalMessageLocator` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn platform_basis(&self) -> &SafeAuthorityRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn ack(&self) -> &ProtocolAckPlan` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |

不变量/禁止：无CurrentActionQualification/owner批准/正文或private；action/message须再与stored known source核一致，签名不授内部权。；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。


### BridgeCallbackSourceResult

计划归属`crates/application/src/ports/callback.rs`；纯平台callback验源与有限ACK拒绝，不宣告业务验证完成。

```rust
/// 纯平台callback验源与有限ACK拒绝，不宣告业务验证完成。
pub enum BridgeCallbackSourceResult {
    /// 仅actual平台来源成立，下一须责任与owner核验。
    Verified(BridgeVerifiedCallbackSource),
    /// 有限验证拒绝和ACK计划；不建Verified record。
    Rejected(VerificationFailure),
    /// 模式/来源合同缺失；不可从空safe字段补成功。
    Unavailable(VerificationFailure),
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Verified(BridgeVerifiedCallbackSource)` | 仅actual平台来源成立，下一须责任与owner核验。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Rejected(VerificationFailure)` | 有限验证拒绝和ACK计划；不建Verified record。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Unavailable(VerificationFailure)` | 模式/来源合同缺失；不可从空safe字段补成功。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。


### CallbackVerificationPort

定义`crates/application/src/ports/callback.rs`；平台adapter实现。

```rust
/// callback验源和初绑known source核验，绝不直接产生审批授权。
pub trait CallbackVerificationPort {
    /// C05核known source/message/owner action关联，不虚构callback已发生。
    fn verify_bound_source<'a>(&'a self, source: &'a SourceIntentMessageRef, target: &'a OwnerTargetActionRef, installation: &'a BridgeInstallation, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<SafeAuthorityRef>>;
    /// E03仅验证平台签名/安装/nonce/期限/actor/原message/action locator。
    fn verify_source<'a>(&'a self, input: &'a PrivateCallbackContext<'a>, installation: &'a BridgeInstallation, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCallbackSourceResult>;
    /// source、actual stored action、真实责任及owner资格齐后才出完整verification ref。
    fn qualify_complete<'a>(&'a self, source: &'a BridgeVerifiedCallbackSource, action: &'a ExternalActionBinding, actor: &'a ActorResponsibilityRef, owner: &'a OwnerActionQualificationRef, expiry: &'a ActionExpiryOneUseRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CallbackVerificationRef>>;
}
```

verify_source输出不得自动生成CurrentActionQualification，source_only不是CallbackHandoffRecord::Verified。qualify_complete须比较same action、原intent/message/source、namespace、owner target/kind/revision、account责任、generation、one-use/expiry；缺任何来源Blocked。secret None只有正式mode明确不需要；nonce/dedup不在adapter私有无限cache另做真相。

### ActorResponsibilityPort

定义`crates/application/src/ports/callback.rs`；组合Identity正式AI锚点、human认证/授权及Integration责任来源，不能把任意平台用户交Identity创建成员。

```rust
/// resolver-first核两端身份与真实责任，不签发默认actor权限。
pub trait ActorResponsibilityPort {
    /// 外部账号、actual既有mapping与current relation核原actor责任。
    fn resolve_external<'a>(&'a self, account: &'a ExternalAccountLocator, mapping: &'a ExternalIdentityMapping, binding: &'a CurrentBindingQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
    /// 受信管理/Integration/AI主体核target/action/delegation责任。
    fn qualify_actor<'a>(&'a self, actor: &'a ActorRef, target: &'a BridgeInternalTargetRef, action: DirectionActionKind, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
    /// 最后owner动作前重新核same responsibility/actor/action及撤销。
    fn revalidate<'a>(&'a self, responsibility: &'a ActorResponsibilityRef, action: &'a OwnerTargetActionRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
}
```

ActorRef去display_name；AiMember只正式GlobalMember锚点，bot/PAT/OAuth scopes不替owner action权限；Human需正式认证与external account责任，缺链Blocked，不自动选择Integration。

### OwnerActionPort

定义`crates/application/src/ports/callback.rs`；GovernanceOwnerAdapter组合current Policy/Gate/owner target与版本。

```rust
/// 正式owner动作当前资格和原operation结果；不本地修改Decision。
pub trait OwnerActionPort {
    /// C05当前source/action/责任/外显交集，返回初绑资格，不执行动作。
    fn qualify_binding<'a>(&'a self, binding: &'a CurrentBindingQualification, source: &'a SourceIntentMessageRef, actor: &'a ActorResponsibilityRef, target: &'a OwnerTargetActionRef, source_verification: &'a SafeAuthorityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActionBindingQualification>>;
    /// E03独立读取实际owner action/revision/授权与期限，不接受按钮当状态。
    fn qualify_action<'a>(&'a self, action: &'a ExternalActionBinding, actor: &'a ActorResponsibilityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<OwnerActionQualificationRef>>;
    /// 核same action当前one-use/expiry，lookup不消费one-use。
    fn qualify_expiry<'a>(&'a self, action: &'a ExternalActionBinding, owner: &'a OwnerActionQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActionExpiryOneUseRef>>;
    /// callback完整验证+current owner二次核验后same-op交接，仅既有动作。
    fn handoff<'a>(&'a self, record: &'a CallbackHandoffRecord, current: &'a CurrentActionQualification, meaning: &'a ActionOperationMeaning, claim: &'a OneUseClaimRef, original: &'a OriginalOperationEffectRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerActionResultRef>;
    /// 将已核callback选择只交正式owner语义准入，返回body-free opaque语义ref。
    fn qualify_callback_semantics<'a>(&'a self, source: &'a BridgeVerifiedCallbackSource, action: &'a ExternalActionBinding, owner: &'a OwnerActionQualificationRef, input: &'a PrivateCallbackContext<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActionOperationMeaning>>;
    /// 原owner action operation的readonly实际结果，不重claim/reapprove。
    fn read_original_result<'a>(&'a self, original: &'a OriginalOperationEffectRef, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerActionResultRef>;
}
```

handoff须actual durable one-use claim与原callback/op一致，claimed终态不复活；current校验通过不替one-use CAS。敏感审批输入仅owner认可safe semantic/action ref，不将选项正文/token持久化或记日志；owner协议缺body-free兼容合同则Blocked，不自行拼审批命令。owner结果未知保same op，platform interaction ACK不当accepted。

### CallbackRepository

定义`crates/application/src/ports/callback.rs`；LocalStoreAdapter。

```rust
/// action和callback完整本地状态、one-use接管与原结果关联。
pub trait CallbackRepository {
    /// 原action完整version行。
    fn get_action<'a>(&'a self, action: &'a ExternalActionBindingRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalActionBinding>>>;
    /// 原callback完整version行。
    fn get_callback<'a>(&'a self, callback: &'a CallbackRecordRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<CallbackHandoffRecord>>>;
    /// exact known source/action反查，歧义不能取first。
    fn find_action_for_source<'a>(&'a self, source: &'a SourceIntentMessageRef, target: &'a OwnerTargetActionRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<ExternalActionBinding>>>;
    /// 原完整verified callback来源反查，不重新解析private。
    fn find_callback_for_verification<'a>(&'a self, verification: &'a CallbackVerificationRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<CallbackHandoffRecord>>>;
    /// 原operation反查，保unknown/claimed记录。
    fn find_by_operation<'a>(&'a self, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<CallbackHandoffRecord>>>;
    /// 原action/callback/original/read_basis完整一致快照。
    fn read_snapshot<'a>(&'a self, callback: &'a CallbackRecordRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<CallbackSnapshot>>;
    /// standalone action完整root，不要求callback存在，不消费one-use。
    fn read_action_snapshot<'a>(&'a self, action: &'a ExternalActionBindingRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<ActionSnapshot>>;
    /// binding既有action页供失效，filter为ActionsForBinding。
    fn list_actions_for_binding<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<ExternalActionBinding>>>;
    /// 已核原action candidate Bound/expiry/revoke同tx stage；不消费one-use。
    fn stage_action<'a>(&'a self, candidate: &'a ExternalActionBinding, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// callback验证/结果/unknown及独立ACK字段同tx stage。
    fn stage_callback<'a>(&'a self, candidate: &'a CallbackHandoffRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// 只对原Bound action在同tx唯一reservation，commit前不是actual消费证明。
    fn reserve_one_use<'a>(&'a self, action: &'a ExternalActionBindingRef, callback: &'a CallbackRecordRef, original: &'a OriginalOperationEffectRef, current: &'a CurrentActionQualification, expected: ExpectedLocalRevision, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OneUseClaimRef>;
}
```

reserve_one_use的结果为同tx reservation；action/record/dedup/result/audit同commit后才允许handoff，CAS失败不能release给新op。读面保完整expiry/source/owner_revision/claim，same callback duplicate复用stored safe result或pending，不再执行owner命令。跨message/action/actor、nonce重放、终态claimed/expired/revoked拒绝。

### 5.3 A4草稿、复杂度与停审

设计自检pass：首次绑定的callback资格依赖冲突已用当前Step精确补充纠正；平台source-only不冒充完整verification；one-use reservation与actual commit分开，五阶段结果不合并。计划测试callback_flow_tests及platform_contract_tests：初绑无callback、签名合法但无审批权、cross-message/actor/target、expired、重复callback、commit未知/owner未知；未执行。下一A5；不签发owner权限，BR-UP-002/003/008/009仍open。

## 6. A5 / U5 continuity、recovery与lane

### 6.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| 六namespace key/meaning/result、原retention与unknown tombstone | ContinuityRepository | C/E/J写、Q03只读 | LocalStoreAdapter | Step11唯一/UoW、Step13 canonical |
| 三stage独立cursor/epoch/comparator及gap完整coverage | ContinuityRepository、AuthoritativeRecoveryPort | E/J03、Q03 | LocalStoreAdapter；正式source只读probe组合 | 不以offset/time跨epoch比较 |
| 原subject恢复与local/owner/platform/consumer分阶段结果 | AuthoritativeRecoveryPort、ContinuityRepository | C06/J02/J03 | LocalCommitProbe/六owner/四platform组合 | local用独立LocalCommitDisposition |
| lane head/dependency/claim/fence及跨lane全部下界 | LaneRepository | J01/J02/J05、Q03 | LocalStoreAdapter | Step11/13真实共享协调 |

### ContinuityRepository

定义`crates/application/src/ports/continuity.rs`；完整19模型中的dedup/cursor/gap/recovery读写。

```rust
/// 本地连续性记录与原key/op，不对外宣称source完整或新执行许可。
pub trait ContinuityRepository {
    /// 原dedup完整version行。
    fn get_dedup<'a>(&'a self, dedup: &'a DedupRecordRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DedupRecord>>>;
    /// 六namespace exact qualified key查重；expired行也返回，不当fresh。
    fn find_dedup<'a>(&'a self, key: &'a QualifiedIdempotencyKey, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DedupRecord>>>;
    /// 原cursor完整版本，保独立cursor revision和epoch。
    fn get_cursor<'a>(&'a self, cursor: &'a StreamCursorRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<StreamCursor>>>;
    /// exact stage/namespace/stream当前cursor；多epoch不选时间最大项。
    fn find_cursor<'a>(&'a self, stream: &'a CursorNamespaceStream, epoch: &'a QualifiedStreamEpoch, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<StreamCursor>>>;
    /// 原gap完整range/window/coverage/recovery行。
    fn get_gap<'a>(&'a self, gap: &'a GapRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<GapRecord>>>;
    /// 原recovery完整authorization/qualification/probe状态行。
    fn get_recovery<'a>(&'a self, recovery: &'a RecoveryRecordRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<RecoveryRecord>>>;
    /// same原subject/op唯一请求，不造新operation复位unknown。
    fn find_recovery<'a>(&'a self, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<RecoveryRecord>>>;
    /// 原scope/stage流的完整本地continuity slice，保read_basis且有界。
    fn read_snapshot<'a>(&'a self, stream: &'a CursorNamespaceStream, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ContinuitySnapshot>;
    /// 同stream gap页，filter=GapsForStream，所有gap required集合不能静默丢。
    fn list_gaps<'a>(&'a self, stream: &'a CursorNamespaceStream, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<GapRecord>>>;
    /// 原subject/op recovery页，filter=RecoveriesForOperation。
    fn list_recoveries<'a>(&'a self, original: &'a OriginalOperationEffectRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<RecoveryRecord>>>;
    /// J02候选仅当前获准scope/as_of，未知仍保原identity。
    fn list_eligible_recoveries<'a>(&'a self, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<RecoveryRecord>>>;
    /// J03候选原gap，无真实coverage仍保gap。
    fn list_eligible_gaps<'a>(&'a self, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<GapRecord>>>;
    /// reserve/result/unknown/expiry dedup同tx stage，保key/meaning唯一。
    fn stage_dedup<'a>(&'a self, candidate: &'a DedupRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// cursor同tx CAS，独立expected cursor轴不可省略。
    fn stage_cursor<'a>(&'a self, candidate: &'a StreamCursor, cursor_expected: Option<&'a ExpectedCursorRevision>, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// gap初建/保留/合法coverage关闭同tx stage。
    fn stage_gap<'a>(&'a self, candidate: &'a GapRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// same原subject的request/probe/known/manual候选同tx stage。
    fn stage_recovery<'a>(&'a self, candidate: &'a RecoveryRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
}
```

首cursor明确Absent+cursor_expected=None，candidate.cursor_revision=1；更新明确Present+Some(actual原ExpectedCursorRevision)，反组合InvalidInput。复核Step6该wrapper只能已有正数revision，禁止把1伪装成原行已存在。cursor advance须same stage/stream/epoch、actual comparator及coverage、两个revision轴。去重expire保原result/operation与meaning不可覆盖；不建立到期自动清理/replay权限。eligible只有Maintenance purpose且job.kind匹配，不向Q03开放；每item最终current再核。

### AuthoritativeRecoveryPort

定义`crates/application/src/ports/continuity.rs`；Infra组合真实只读来源，local probe同storage driver/schema；外部无查询能力时Unknown，不补日志证据。

```rust
/// 原subject/op/effect的权威只读恢复，绝不发送新effect。
pub trait AuthoritativeRecoveryPort {
    /// actual driver retained journal中same subject/op唯一unresolved阶段的exact mutation；多阶段歧义Conflict、无记录None，不按时间选latest。
    fn locate_local_unknown<'a>(&'a self, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<LocalMutationRef>>;
    /// 只对actual committed stage取得同stream/epoch/full range覆盖；source coverage不能代替，partial/未知有限Unavailable。
    fn qualify_stage_coverage<'a>(&'a self, cursor: &'a StreamCursor, snapshot: &'a ContinuitySnapshot, comparator: &'a AuthoritativeComparatorRef, read: &'a BridgeLocalReadContext, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ContinuityCoverageRef>>;
    /// C06只核原subject/op的恢复请求授权，不执行probe或授重发权限。
    fn qualify_request<'a>(&'a self, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryAuthorizationRef>>;
    /// 核原subject、same operation、正式恢复窗口/预算/source。
    fn qualify<'a>(&'a self, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 原local mutation独立commit/rollback/unknown权威结果，非ProbeOutcome伪variant。
    fn probe_local_commit<'a>(&'a self, mutation: &'a LocalMutationRef, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, LocalCommitDisposition>;
    /// 原owner/platform/consumer阶段结果，只read，保原subject/op/effect。
    fn probe_original<'a>(&'a self, qualification: &'a RecoveryQualificationRef, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 原gap entire range的权威coverage；部分/NotFound不能Closed。
    fn probe_gap<'a>(&'a self, gap: &'a GapRecord, qualification: &'a RecoveryQualificationRef, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 同stream/epoch显式位置比较，不能按offset字符串或时间自比。
    fn compare_position<'a>(&'a self, stream: &'a CursorNamespaceStream, epoch: &'a QualifiedStreamEpoch, base: &'a OpaqueStreamPositionSlot, candidate: &'a OpaqueStreamPosition, comparator: &'a AuthoritativeComparatorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ComparablePositionRef>>;
}
```

local RolledBack必须actual rollback proof，missing registry/NotFound/timeout保持Indeterminate或Unavailable。foreign ProbeOutcome分Owner/Action/Platform/Consumer/Coverage/NoEffect/Unknown/Unavailable，不得跨阶段提升；NoIo与NoEffect不同。未核source/window/comparator/canonical compatibility -> Blocked/manual，保原记录与head/gap。qualify不增加Job actor业务权，C06只request不同步probe。

`qualify_stage_coverage`的read必须为Config已核same scope/stream/stage的Maintenance读，禁止Query升级；同driver在budget内读actual committed阶段journal、全部相关gap及原stage结果，输入snapshot是完整baseline不是权限来源。输出五字段逐项：stream/epoch取原cursor并核formal comparator一致；range只来自formal comparison的完整已处理范围（包含原base，范围不足不能提升）；closed_gaps为该范围内每个actual Closed gap的完整AuthoritativeCoverageRef，空集合须证明无gap；basis由同driver正式stage coverage需求核全部阶段proof后返回、exact ContinuityCoverageRef。cursor必须match snapshot.cursor、read_basis及actual原版本，任何缺页/unknown阶段/closed证明不足/row预算超限Unavailable；J03可关闭gap而不advance，J05不能跳位置。权威comparison涉及外部source时只tx外，完整覆盖验证不得靠时间/NotFound或端口私签。

### LaneRepository

定义`crates/application/src/ports/continuity.rs`；LocalStoreAdapter真实共享协调，无单进程fake保证。

```rust
/// 原lane的顺序/依赖/fence与跨lane全部rate下界。
pub trait LaneRepository {
    /// 新lane首建固定lane/local两轴Absent、scope唯一；与plan/intent/effect/dedup同UoW，只stage不授IO。
    fn insert_for_scope<'a>(&'a self, candidate: &'a DispatchLane, qualification: &'a LanePreparationQualification, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// 完整lane行及local版本，保unknown unresolved_head。
    fn get<'a>(&'a self, lane: &'a DispatchLaneRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DispatchLane>>>;
    /// exact qualified order scope唯一反查。
    fn find_for_scope<'a>(&'a self, scope: &'a QualifiedLaneOrderScope, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<DispatchLane>>>;
    /// lane/head/due候选/active attempt/read_basis完整一致，不省unknown。
    fn read_snapshot<'a>(&'a self, lane: &'a DispatchLaneRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<LaneSnapshot>>;
    /// same order scope全部有效global/method/resource/bucket下界，完整性缺口拒绝。
    fn read_shared_bounds<'a>(&'a self, scope: &'a QualifiedLaneOrderScope, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, QualifiedRateLimitBoundSet>;
    /// 当前获准bucket映射涉及的全部lane页，不限单lane假装global协调。
    fn list_affected_by_bounds<'a>(&'a self, bounds: &'a QualifiedRateLimitBoundSet, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<DispatchLane>>>;
    /// binding既有lane页，filter=LanesForBinding。
    fn list_for_binding<'a>(&'a self, binding: &'a ExternalBindingRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<DispatchLane>>>;
    /// J01 bounded既有due intent候选，非新建intent或全站扫描。
    fn list_eligible_intents<'a>(&'a self, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<DeliveryIntent>>>;
    /// 同tx原attempt claim/fence reservation；含全部shared bound与依赖条件。
    fn reserve_claim<'a>(&'a self, lane: &'a DispatchLaneRef, attempt: &'a AttemptEffectRef, eligibility: &'a DispatchEligibilityRef, lane_expected: &'a ExpectedLaneRevision, expected: &'a ExpectedLocalRevisionSet, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, FencedClaimRef>;
    /// lane候选stage；head释放须原attempt actual处置，unknown不清空。
    fn stage<'a>(&'a self, candidate: &'a DispatchLane, lane_expected: &'a ExpectedLaneRevision, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
}
```

reserve_claim非外部成功且非actual commit，必须与intent/attempt/dedup/result/audit同事务；driver核same scope锁/唯一/expected与phantom范围完整，产品不能支持则NotEstablished，禁止用in-memory mutex假装跨进程global。claim fence单调driver产生，不用时间/lease expiry重置；释放有原LocalAttemptDispositionRef，Unknown保unresolved_head阻后序。新下界取所有适用source的max，缺scope完整资格不得提前IO；J01 retry必须same intent/effect、正式NoEffect/NoIo与预算，不能只backoff后重发。

### 6.2 A5草稿、复杂度与停审

人工设计自检pass：五local对象都有完整get/stage，key/op/stream反查、eligible来源、两个revision轴、local commit独立probe与全scope lane协调明确。首cursor条件/typed filter将在X逐形复核，不把讨论点留给实现者。计划测试continuity_flow_tests与infra store/probe tests：六namespace碰撞、变义/expired unknown、跨epoch、partial coverage、lease释放仍unknown、shared bucket/CAS/fence、NotFound不是rollback；未执行。下一A6；BR-UP-001/003/006/008/009仍open。

## 7. A6 / U6 observation、safe read、audit与result

### 7.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| BodyFreeMutationMaterial/schema/canonical/admission及mandatory规则 | SafeObservationPort | C/E/J的local_mutation | ObservabilityOwnerAdapter组合safe audit provider | BR-UP-006，不发明Bridges producer family |
| 原canonical consumer handoff/current claim/result | SafeObservationPort、SafeTraceRepository | J04/E04/J02 | ObservabilityOwnerAdapter/正式transport；LocalStore | consumer ACK/accepted/evidence分开 |
| resolver-first current subject/stage/ref/count可见性 | SafeReadQualificationPort | Q01~04及结果出口 | 正式owner/current visibility组合，条件Workspace | Query零write/refresh/probe |
| immutable本地audit/result与mutable handoff | SafeTraceRepository | 所有mutation/J04/E04/Q04 | LocalStoreAdapter | same UoW/result/subject/conditional O01 |

### SafeObservationPort

定义`crates/application/src/ports/traceability.rs`；formal producer兼容缺口保留，不把已有四family扩写成Bridges admission。

```rust
/// 正式body-free producer资格和原consumer operation交接需求。
pub trait SafeObservationPort {
    /// 正式原consumer/source/window/预算只读资格；fresh J04无需伪造RecoveryRecord，不授再次handoff权。
    fn qualify_consumer_probe<'a>(&'a self, record: &'a SafeHandoffRecord, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 正式非递归规则查询，只原handoff结果/维护，核exact subjects/current；无规则NotEstablished，不降级Mandatory。
    fn qualify_nonrecursive<'a>(&'a self, record: &'a SafeHandoffRecord, material: &'a BodyFreeMutationMaterial, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<NonRecursiveObservationQualification>>;
    /// 实际owner核mandatory/optional/audit-only规则；缺权威规则不默认可选。
    fn qualify_requirement<'a>(&'a self, original: &'a OriginalOperationEffectRef, material: &'a BodyFreeMutationMaterial, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<MutationObservationRequirement>>;
    /// 原handoff的actual canonical/schema/admission/retention当前资格。
    fn qualify_handoff<'a>(&'a self, record: &'a SafeHandoffRecord, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentSafeHandoffQualification>>;
    /// 原committed audit/canonical仅same consumer op交接，不生成测试evidence。
    fn handoff<'a>(&'a self, record: &'a SafeHandoffRecord, current: &'a CurrentSafeHandoffQualification, claim: &'a SafeHandoffClaimRef, committed: &'a CommittedLocalMutationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ConsumerDispositionRef>;
    /// E04正式消费来源与原handoff/op/schema核验，不能自声明producer。
    fn qualify_disposition<'a>(&'a self, disposition: &'a ConsumerDispositionRef, handoff: &'a SafeHandoffRecord, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ConsumerDispositionRef>>;
    /// readonly原consumer结果；缺行/ACK lost不证no-effect。
    fn read_original_result<'a>(&'a self, original: &'a OriginalHandoffOperationRef, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ConsumerDispositionRef>;
}
```

qualify_requirement只用于普通mutation的Mandatory/OptionalQualified/OwnerPermitsAuditOnly三个来源；原handoff生命周期须独立qualify_nonrecursive，不允许从前三者fallback。共同MutationObservationRequirement的消费必须穷尽四variant：Mandatory/OptionalQualified须actual schema/canonical/admission与scope窗口；OwnerPermitsAuditOnly只有正式owner证明不mandatory；NonRecursiveResultOnly须formal原handoff结果/维护规则覆盖全部拟写subjects与阶段且handoff=None。preflight只核已注册安全材料模板/引用的准入，不制造未来committed事实；最终canonical安全内容/authority在同UoW与actual提交联动，未提交不发O01。Observe当前source audit producer map不含Bridges，兼容/kind未核时对应分支Blocked/Unavailable；不得套Governance producer或输出空canonical。safe audit不成为evidence/report/verdict/signoff或readiness。

### SafeReadQualificationPort

定义`crates/application/src/ports/traceability.rs`；resolver-first，只读formal qualification，支持view/result出口而非权限truth缓存。

```rust
/// 核actual current主语及各stage/ref/count披露边界。
pub trait SafeReadQualificationPort {
    /// 按trusted actor/source与显式namespace解析请求主语，先核权限再暴露存在性。
    fn qualify_subject<'a>(&'a self, actor: &'a ActorRef, namespace: &'a InstallationNamespace, subject: &'a BridgeViewSubjectRef, authority: &'a SafeAuthorityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentReadQualification>>;
    /// exact当前已解析subject形成local read context，不升级为维护读用途。
    fn qualify_local_read<'a>(&'a self, qualification: &'a CurrentReadQualification, limit: u32, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeLocalReadContext>>;
    /// 返回结果前再次核原view/ref/count disclosure；没有写/修复副作用。
    fn revalidate<'a>(&'a self, qualification: &'a CurrentReadQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentReadQualification>>;
}
```

safe opaque ref不是可见权限。Denied/Blocked不携hidden subject/ref/count，NotFound只已获准精确解析之后。scope由owner resolver，不切ref；Workspace仅正式选用且其safe read/export/provenance是required时追加核验，不替Identity/Governance准入。QueryMetadata consistency只能只读意义，不能触发refresh/probe/write/audit/dedup或Query页快照；不向公众输出repository cursor。

### SafeTraceRepository

定义`crates/application/src/ports/traceability.rs`；唯一承接audit/handoff/stored result，不存在HandoffRepository/ResultRepository第24port。

```rust
/// immutable audit/result与本地canonical handoff的完整受权存取。
pub trait SafeTraceRepository {
    /// 精确BridgeOperationRef查实际已提交original/result journal；不拼effect或kind，不查foreign系统。
    fn read_operation_snapshot<'a>(&'a self, operation: &'a BridgeOperationRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<OperationSnapshot>>;
    /// immutable audit完整行、revision=1及hydration。
    fn get_audit<'a>(&'a self, audit: &'a SafeAuditRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<SafeAuditRecord>>>;
    /// 原mutation唯一producer反查，不从日志拼材料。
    fn find_audit_for_mutation<'a>(&'a self, mutation: &'a LocalMutationRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<SafeAuditRecord>>>;
    /// 原handoff完整mutable行、claim/result与local revision。
    fn get_handoff<'a>(&'a self, handoff: &'a SafeHandoffRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<SafeHandoffRecord>>>;
    /// exact原canonical/producer/op反查handoff，不创建新交接。
    fn find_handoff<'a>(&'a self, audit: &'a SafeAuditRef, original: &'a OriginalHandoffOperationRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeVersioned<SafeHandoffRecord>>>;
    /// audit+handoff+original+read_basis完整consistent slice。
    fn read_handoff_snapshot<'a>(&'a self, audit: &'a SafeAuditRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<SafeHandoffSnapshot>>;
    /// 按actual result identity读取完整stored payload/kind/original/revision/basis。
    fn get_result<'a>(&'a self, result: &'a SafeOriginalResultRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<SafeOriginalResultRef>>;
    /// exact同qualified key/meaning原结果；变义Conflict，不返回新reservation。
    fn find_result_for_key<'a>(&'a self, key: &'a QualifiedIdempotencyKey, meaning: &'a BodyFreeOperationMeaningRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<SafeOriginalResultRef>>;
    /// same原op/effect/结果族已提交结果；actual missing不证无效果。
    fn find_result_for_operation<'a>(&'a self, original: &'a OriginalOperationEffectRef, kind: BridgeStoredResultKind, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<SafeOriginalResultRef>>;
    /// 同原operation immutable audit页，filter=AuditsForOperation。
    fn list_audits<'a>(&'a self, original: &'a OriginalOperationEffectRef, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<SafeAuditRecord>>>;
    /// J04获准scope/as_of的原handoff候选，无canonical不造候选。
    fn list_eligible_handoffs<'a>(&'a self, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeVersioned<SafeHandoffRecord>>>;
    /// immutable audit仅Absent append；同subject/result/dedup tx。
    fn append_audit<'a>(&'a self, candidate: &'a SafeAuditRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// 原handoff候选stage，claim/result/unknown不被transport ACK覆盖。
    fn stage_handoff<'a>(&'a self, candidate: &'a SafeHandoffRecord, expected: LocalRevisionCondition, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeStagedWriteRef>;
    /// 同tx原handoff claim reservation，commit前不证明可交consumer。
    fn reserve_handoff_claim<'a>(&'a self, handoff: &'a SafeHandoffRef, current: &'a CurrentSafeHandoffQualification, expected: ExpectedLocalRevision, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SafeHandoffClaimRef>;
    /// 只stage同plan的safe result seed，不预填committed/accepted；unit返回非proof。
    fn stage_result<'a>(&'a self, seed: &'a PreparedStoredResultSeed, key: &'a QualifiedIdempotencyKey, meaning: &'a BodyFreeOperationMeaningRef, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ()>;
}
```

get_result的传入safe ref仅locator+原identity，返回以实际stored行重建，不能原样“回显ref就称已存”。result只immutable保存，不提供任意overwrite。stage_result的expected固定为immutable identity/key的Absent唯一插入条件，不接受任意Present覆盖：同key/meaning/op已存在只复用actual原记录，变义冲突拒绝，读取先经get/find_result配对；这个固定条件由同driver transaction强制。stage_result在actual commit时才将PreparedResultPayload::LocalMutation替成同mutation真实Committed payload，Known也必须actual prior result；result record identity/kind/op、key/meaning、CAS和audit/conditional canonical在同driver transaction完成。Unit成功只是登记，actual revision/basis从commit后具名读取得。

### 7.2 A6草稿、复杂度与停审

人工设计自检pass：audit/result读写成对、append-only与handoff mutable CAS分开，canonical/admission/current consumer只正式来源；Query零副作用且resolver-first。计划测试safe_trace_flow_tests/result visibility/owner adapter cuts：mandatory缺准入阻IO、audit-only无默认、Bridges producer不存在、raw禁止、consumer ACK非accepted、hidden count/ref、stored result same meaning零新IO；未执行。下一A7，八repo/十四外部seam/UoW总数不变；BR-UP-005/006保持原状态。

## 8. A7 / private、secret、config与local UoW

### 8.0 ACK technical callback

计划归属`crates/application/src/ports/mod.rs`；这是Step6 `TransportHost`的scoped callback类型，不是第24业务port，不进入RuntimeSeamKind的23业务port枚举项。

X审计纠正：其safe结果`ProtocolAckExecution`原Step6归属API `platform.rs`，会造成Application/Infra反向依赖API。本Step把该类型的唯一计划定义迁到既有`crates/contracts/src/shared/outcomes.rs`，三字段`plan/disposition/source`、完整factory、只读getter和`record_actual`签名/初态约束完全沿Step6，API不再定义副本；这不是新增type或wire DTO。API/Worker/Infra/Application只单向消费Contracts carrier。类型仍无raw reply/token、IO、自动serde或业务accepted含义；factory只NotSent，actual disposition只正式host。

~~~rust
/// 执行Application已决定的协议ACK计划，只返回actual protocol阶段。
pub trait BridgeProtocolAckExecutor {
    /// Future同时短借宿主和本call reply/plan/control，不要求隐藏static client所有权。
    fn execute<'call>(
        &'call self,
        reply: &'call PrivateReplyContext<'call>,
        plan: &'call ProtocolAckPlan,
        control: &'call BridgeCallControl<'call>,
    ) -> BridgePortFuture<'call, ProtocolAckExecution>;
}
~~~

callback由Infra `PlatformPortRouter`按reply namespace/source/basis排他选择actual adapter；不能修改ACK计划、生成业务accepted或隐藏retry。E01/E03拥有private lease期间短借reply执行，结果只映射`ProtocolAckDisposition`。ACK在可靠接管前后顺序由Step9按平台deadline闭口；无论顺序，ACK均不证明local commit、owner result或外部delivery。

封存复查纠正：原HRTB Fn返回Future未显式绑定宿主自身借用，借用runtime driver的wrapper不能据此保证任意call生命周期。最终采用上方对象安全的self短借方法，call结束前宿主/reply/plan/control均保持存活；Application只调用`ack.execute(...)`。这是既有TransportHost的technical callback分面，不是新增业务port，不注册到QualifiedInfraPorts或23个RuntimeSeamKind业务项，唯一实现责任仍PlatformPortRouter -> actual driver.execute_ack。没有选择executor/client或宣称通过borrow checker。

### 8.1 Capability与对象接缝

| capability / Step6来源 | 接缝 | 调用方 | 实现方 | 后续 |
|---|---|---|---|---|
| transient qualified material与外显payload的实际owning buffer | PrivateMaterialPort | E01/J01 | private_material qualified provider | 本call lease，取消/销毁Step14/04核 |
| exact provider/key/version/purpose/route secret | SecretResolutionPort | verify/connect/deliver/probe | secrets qualified provider | rotation/revoke逐调用，产品未选 |
| 安全draft/动作/required seams/current secret资格 | ConfigQualificationPort | C01/全部IO/J05 | configuration.qualification及实际provider组合 | Step14/04配置，不预选SDK/OAuth/KMS |
| clock/ID/canonical/key与同driver原子commit | LocalUnitOfWorkPort | mutation/helper、维护选择 | LocalStoreAdapter组合技术provider | 不额外业务Clock/Id port |

### BridgeMaterialLease

计划归属`crates/application/src/ports/private_material.rs`；本call拥有的owner已准入材料buffer，短借既有TransientQualifiedMaterialHandle。

```rust
/// 本call拥有的owner已准入材料buffer，短借既有TransientQualifiedMaterialHandle。
pub struct BridgeMaterialLease {
    /// 实际瞬时buffer。
    bytes: Vec<u8>,
    /// 原材料/target/digest/附件current资格。
    qualification: CurrentMaterialQualification,
    /// 原材料读取scope。
    scope: SafeScopeRef,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| bytes | `Vec<u8>` | 必填 | PrivateMaterialPort实际provider，受核byte上限，禁止getter |
| qualification | `CurrentMaterialQualification` | 必填 | 实际qualified owner读取；不能把factory当来源 |
| scope | `SafeScopeRef` | 必填 | current正式用途交集 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(bytes: Vec<u8>, qualification: CurrentMaterialQualification, scope: SafeScopeRef) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；不Clone/Debug/serde/Display/Error-source，不durable/global/cache/detached；只受信provider构造；handle不可长于lease；drop不宣称zeroize。 |
| 只读 | `pub fn qualification(&self) -> &CurrentMaterialQualification` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn scope(&self) -> &SafeScopeRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 成员 | `pub fn borrow_handle<'s>(&'s self, current: CurrentMaterialQualification, now: SafeInstant) -> Result<TransientQualifiedMaterialHandle<'s>, BridgePortError>` | /// 比对same source/version/target/digest/attachments/scope与期限，再由current safe字段明确重建handle；只borrow bytes，不授新权。 |

不变量/禁止：不Clone/Debug/serde/Display/Error-source，不durable/global/cache/detached；只受信provider构造；handle不可长于lease；drop不宣称zeroize。；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgePayloadLease

计划归属`crates/application/src/ports/private_material.rs`；本call拥有的exact原projection渲染buffer，短借既有PrivateQualifiedPayload。

```rust
/// 本call拥有的exact原projection渲染buffer，短借既有PrivateQualifiedPayload。
pub struct BridgePayloadLease {
    /// 实际获准渲染buffer。
    bytes: Vec<u8>,
    /// 原attempt/effect。
    attempt: AttemptEffectRef,
    /// 本次外显交集。
    qualification: CurrentPresentationQualification,
    /// 渲染使用窗口。
    validity: SafeValidityWindow,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| bytes | `Vec<u8>` | 必填 | qualified projection provider，本次byte预算；无getter |
| attempt | `AttemptEffectRef` | 必填 | actual已提交claim的原identity |
| qualification | `CurrentPresentationQualification` | 必填 | Policy/Gate/附件/current target核验 |
| validity | `SafeValidityWindow` | 必填 | current与payload/provider交集 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(bytes: Vec<u8>, attempt: AttemptEffectRef, qualification: CurrentPresentationQualification, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；只原projection；不得加入敏感审批/未获准附件/secret；无Clone/Debug/serde/cache/持久化，drop非zeroize。 |
| 只读 | `pub fn attempt(&self) -> &AttemptEffectRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn qualification(&self) -> &CurrentPresentationQualification` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn validity(&self) -> &SafeValidityWindow` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 成员 | `pub fn borrow_payload<'s>(&'s self, current: CurrentPresentationQualification, now: SafeInstant) -> Result<PrivateQualifiedPayload<'s>, BridgePortError>` | /// 核原attempt/source/projection/target/generation与期限，只短借活buffer；safe ref重建不得改变原identity。 |

不变量/禁止：只原projection；不得加入敏感审批/未获准附件/secret；无Clone/Debug/serde/cache/持久化，drop非zeroize。；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeSecretLease

计划归属`crates/application/src/ports/secret.rs`；精确原provider版本的call-local secret owning buffer，禁止公开secret bytes。

```rust
/// 精确原provider版本的call-local secret owning buffer，禁止公开secret bytes。
pub struct BridgeSecretLease {
    /// 实际秘密buffer。
    secret: Vec<u8>,
    /// 原purpose/installation/scope/route资格。
    use_context: QualifiedSecretUseContext,
    /// actual provider版本。
    provider_revision: SafeRevision,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| secret | `Vec<u8>` | 必填 | SecretResolutionPort owning provider；无getter |
| use_context | `QualifiedSecretUseContext` | 必填 | 正式current secret provider用途 |
| provider_revision | `SafeRevision` | 必填 | 不静默换最新版本/环境明文fallback |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(secret: Vec<u8>, use_context: QualifiedSecretUseContext, provider_revision: SafeRevision) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；无Clone/Debug/serde/Display/Error-source/long-lived cache；借用止于lease，取消后provider不保新副本，drop不宣称zeroize。 |
| 只读 | `pub fn use_context(&self) -> &QualifiedSecretUseContext` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn provider_revision(&self) -> &SafeRevision` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 成员 | `pub fn borrow_secret<'s>(&'s self, current: QualifiedSecretUseContext, now: SafeInstant) -> Result<PrivateSecretHandle<'s>, BridgePortError>` | /// 核exact provider/key/version/purpose/installation/route/revocation/window后短借；最后dispatch仍实际provider current复核。 |

不变量/禁止：无Clone/Debug/serde/Display/Error-source/long-lived cache；借用止于lease，取消后provider不保新副本，drop不宣称zeroize。；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### BridgeLocalIdPurpose

计划归属`crates/application/src/ports/local_uow.rs`；当前local technical ID用途allowlist，不是业务请求selector或owner身份。

```rust
/// 当前local technical ID用途allowlist，不是业务请求selector或owner身份。
pub enum BridgeLocalIdPurpose {
    /// 只生成本地Installation的不可复用技术identity，不提供资格。
    Installation,
    /// 只生成本地Binding的不可复用技术identity，不提供资格。
    Binding,
    /// 只生成本地IdentityMapping的不可复用技术identity，不提供资格。
    IdentityMapping,
    /// 只生成本地LocationMapping的不可复用技术identity，不提供资格。
    LocationMapping,
    /// 只生成本地MessageMapping的不可复用技术identity，不提供资格。
    MessageMapping,
    /// 只生成本地Inbound的不可复用技术identity，不提供资格。
    Inbound,
    /// 只生成本地PresentationPlan的不可复用技术identity，不提供资格。
    PresentationPlan,
    /// 只生成本地DeliveryIntent的不可复用技术identity，不提供资格。
    DeliveryIntent,
    /// 只生成本地DeliveryEffect的不可复用技术identity，不提供资格。
    DeliveryEffect,
    /// 只生成本地Attempt的不可复用技术identity，不提供资格。
    Attempt,
    /// 只生成本地Receipt的不可复用技术identity，不提供资格。
    Receipt,
    /// 只生成本地ActionBinding的不可复用技术identity，不提供资格。
    ActionBinding,
    /// 只生成本地Callback的不可复用技术identity，不提供资格。
    Callback,
    /// 只生成本地Dedup的不可复用技术identity，不提供资格。
    Dedup,
    /// 只生成本地Cursor的不可复用技术identity，不提供资格。
    Cursor,
    /// 只生成本地Gap的不可复用技术identity，不提供资格。
    Gap,
    /// 只生成本地Lane的不可复用技术identity，不提供资格。
    Lane,
    /// 只生成本地Recovery的不可复用技术identity，不提供资格。
    Recovery,
    /// 只生成本地Audit的不可复用技术identity，不提供资格。
    Audit,
    /// 只生成本地Handoff的不可复用技术identity，不提供资格。
    Handoff,
    /// 只生成本地Operation的不可复用技术identity，不提供资格。
    Operation,
    /// 只生成本地Mutation的不可复用技术identity，不提供资格。
    Mutation,
    /// 只生成本地StoredResult的不可复用技术identity，不提供资格。
    StoredResult,
    /// 只生成本地Claim的不可复用技术identity，不提供资格。
    Claim,
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Installation` | 只生成本地Installation的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Binding` | 只生成本地Binding的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `IdentityMapping` | 只生成本地IdentityMapping的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `LocationMapping` | 只生成本地LocationMapping的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `MessageMapping` | 只生成本地MessageMapping的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Inbound` | 只生成本地Inbound的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `PresentationPlan` | 只生成本地PresentationPlan的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `DeliveryIntent` | 只生成本地DeliveryIntent的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `DeliveryEffect` | 只生成本地DeliveryEffect的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Attempt` | 只生成本地Attempt的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Receipt` | 只生成本地Receipt的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `ActionBinding` | 只生成本地ActionBinding的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Callback` | 只生成本地Callback的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Dedup` | 只生成本地Dedup的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Cursor` | 只生成本地Cursor的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Gap` | 只生成本地Gap的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Lane` | 只生成本地Lane的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Recovery` | 只生成本地Recovery的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Audit` | 只生成本地Audit的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Handoff` | 只生成本地Handoff的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Mutation` | 只生成本地Mutation的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `StoredResult` | 只生成本地StoredResult的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Claim` | 只生成本地Claim的不可复用技术identity，不提供资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeQualificationSnapshot

计划归属`crates/application/src/ports/local_snapshots.rs`；J05实际既有资格维护行的完整typed版本联合，不含owner truth。

```rust
/// J05实际既有资格维护行的完整typed版本联合，不含owner truth。
pub enum BridgeQualificationSnapshot {
    /// 原安装config资格。
    Installation(BridgeVersioned<BridgeInstallation>),
    /// 原relation资格。
    Binding(BridgeVersioned<ExternalBinding>),
    /// 原账号mapping。
    Identity(BridgeVersioned<ExternalIdentityMapping>),
    /// 原位置mapping。
    Location(BridgeVersioned<ExternalLocationMapping>),
    /// 原known message mapping。
    Message(BridgeVersioned<ExternalMessageMapping>),
    /// 原外显plan。
    Presentation(BridgeVersioned<SafePresentationPlan>),
    /// 原source-action绑定。
    Action(BridgeVersioned<ExternalActionBinding>),
    /// 原comparator/epoch资格。
    Cursor(BridgeVersioned<StreamCursor>),
    /// 原dispatch/rate资格。
    Lane(BridgeVersioned<DispatchLane>),
    /// 原producer/admission资格。
    Handoff(BridgeVersioned<SafeHandoffRecord>),
    /// 原dedup保留资格，仅允许正式expiry并保tombstone。
    Dedup(BridgeVersioned<DedupRecord>),
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Installation(BridgeVersioned<BridgeInstallation>)` | 原安装config资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Binding(BridgeVersioned<ExternalBinding>)` | 原relation资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Identity(BridgeVersioned<ExternalIdentityMapping>)` | 原账号mapping。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Location(BridgeVersioned<ExternalLocationMapping>)` | 原位置mapping。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Message(BridgeVersioned<ExternalMessageMapping>)` | 原known message mapping。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Presentation(BridgeVersioned<SafePresentationPlan>)` | 原外显plan。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Action(BridgeVersioned<ExternalActionBinding>)` | 原source-action绑定。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Cursor(BridgeVersioned<StreamCursor>)` | 原comparator/epoch资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Lane(BridgeVersioned<DispatchLane>)` | 原dispatch/rate资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Handoff(BridgeVersioned<SafeHandoffRecord>)` | 原producer/admission资格。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Dedup(BridgeVersioned<DedupRecord>)` | 原保留资格，非新execute许可。 | Continuity get_dedup或同driver UoW完整committed row/local hydration | 只J05 qualify_dedup_expiry -> expire -> stage_dedup；原key/result/unknown保持 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。无mutable getter，only actual committed rows。其他subject InvalidInput，不为J05伪造intent/operation或新的权限。

### BridgeMaintenanceSubject

计划归属`crates/application/src/jobs/mod.rs`；Application有界选择的五类既有主语，不依赖jobs crate的JobInvocationPlan。

```rust
/// Application有界选择的五类既有主语，不依赖jobs crate的JobInvocationPlan。
pub enum BridgeMaintenanceSubject {
    /// J01完整原intent/effect回链，Jobs不能从intent ID猜effect。
    Intent(DeliveryIntentEffectRef),
    /// J02完整原recovery/业务主语关联，不能从record ID解码target。
    Recovery {
        /// actual选择行的record定位；invoke重读其original/qualification。
        recovery: RecoveryRecordRef,
        /// actual同一recovery行的既有业务主语。
        subject: OriginalRecoverableSubjectRef,
    },
    /// J03原gap。
    Gap(GapRef),
    /// J04原canonical handoff。
    Handoff(SafeHandoffRef),
    /// J05已有资格subject及本次明确维护的actual版本条件。
    Qualification {
        /// 只有BridgeQualificationSnapshot支持的既有主语。
        subject: BridgeViewSubjectRef,
        /// actual选择行的local版本，进入job key与meaning；非租约时间。
        expected: ExpectedLocalRevision,
    },
}
```

| 变体 | Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Intent(DeliveryIntentEffectRef)` | J01原intent/effect完整关联。 | 完整DeliveryIntent实际行；effect不可变 | 原值装JobInvocationSubject::Delivery和J01 input，不从ID猜effect |
| `Recovery { recovery: RecoveryRecordRef, subject: OriginalRecoverableSubjectRef }` | J02原record与既有业务主语。 | 完整RecoveryRecord同一实际行 | 原值装JobInvocationSubject::Operation和J02 input；invoke按record重读original/资格后核key |
| `Gap(GapRef)` | J03原gap。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Handoff(SafeHandoffRef)` | J04原canonical handoff。 | 所属具名typed方法/actual来源；仅结构factory不授权 | 按当前分支显式处理，不推断其他阶段成功或创建新权限 |
| `Qualification { subject: BridgeViewSubjectRef, expected: ExpectedLocalRevision }` | J05已有资格subject及actual版本条件，只有BridgeQualificationSnapshot支持种类。 | 完整选择行/actual local revision；无任意新版本或默认expected | 同expected重推同key；新actual版本+正式维护依据才新的本地维护含义 |

成员/工厂：按payload完整构造及穷尽match；无默认variant、自由文本、mutable getter、raw Error-source或自动serde。

### BridgeMaintenanceSelection

计划归属`crates/application/src/jobs/mod.rs`；Application只读eligible选择的safe current载体，entry再装原JobInvocationPlan；不是新job请求。

```rust
/// Application只读eligible选择的safe current载体，entry再装原JobInvocationPlan；不是新job请求。
pub struct BridgeMaintenanceSelection {
    /// 五typed既有subject。
    subject: BridgeMaintenanceSubject,
    /// 原或fresh未执行job operation的完整连续性。
    continuity: JobContinuityMetadata,
    /// Application按subject/scope生成的trusted job key。
    key: QualifiedIdempotencyKey,
    /// actual选择scope/versions。
    read_basis: LocalSnapshotReadBasis,
    /// actual选择资格。
    selection_basis: SafeAuthorityRef,
    /// 候选窗口。
    validity: SafeValidityWindow,
}
```

| 字段 | 类型 | 必填 / 可选 | 来源与约束 |
|---|---|---|---|
| subject | `BridgeMaintenanceSubject` | 必填 | 对应实际repo eligible page的完整row |
| continuity | `JobContinuityMetadata` | 必填 | qualified key已有dedup/result/operation时复用其原operation；确无既有operation时只可用Application分配的fresh未执行operation；subject/trace/requested_at同本选择，不证明已reservation |
| key | `QualifiedIdempotencyKey` | 必填 | Application以typed subject+trusted job scope/recipe生成；不含requested_at/trace/body |
| read_basis | `LocalSnapshotReadBasis` | 必填 | 完整page/row actual driver |
| selection_basis | `SafeAuthorityRef` | 必填 | 正式current维护依据；非构造型proof |
| validity | `SafeValidityWindow` | 必填 | 当前source与job/window交集 |

| 类别 | 完整签名 | 中文Rustdoc / 不变量 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: BridgeMaintenanceSubject, continuity: JobContinuityMetadata, key: QualifiedIdempotencyKey, read_basis: LocalSnapshotReadBasis, selection_basis: SafeAuthorityRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 完整接纳上述全部字段，仅校结构与一致性，不生成权限/实际proof；只当前选择，不new effect/run；step6 ScheduledJobCandidate的JobInvocationPlan由jobs外层装配，Application禁止依赖jobs/worker/Infra；invocation重新read/CAS/current核。 |
| 只读 | `pub fn subject(&self) -> &BridgeMaintenanceSubject` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn continuity(&self) -> &JobContinuityMetadata` | /// 只读取原或fresh未执行operation/subject/trace，不证明已dispatch。 |
| 只读 | `pub fn key(&self) -> &QualifiedIdempotencyKey` | /// 只读取Application已资格化job key，不授执行权。 |
| 只读 | `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn selection_basis(&self) -> &SafeAuthorityRef` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 只读 | `pub fn validity(&self) -> &SafeValidityWindow` | /// 只读取原字段，零IO/修改；不得推导执行或公开披露资格。 |
| 消费 | `pub fn into_scheduling_parts(self) -> (BridgeMaintenanceSubject, JobContinuityMetadata, QualifiedIdempotencyKey, LocalSnapshotReadBasis, SafeAuthorityRef, SafeValidityWindow)` | /// 仅供worker按原值移交jobs plan assembler并构造ScheduledJobCandidate；消费一次、零IO，不Clone/替换/log key或生成执行资格。 |

不变量/禁止：只当前选择，不new effect/run；step6 ScheduledJobCandidate的JobInvocationPlan由jobs外层装配，Application禁止依赖jobs/worker/Infra；invocation重新read/CAS/current核。`into_scheduling_parts`只解决跨crate所有权移交，不新增构造路径或把key放入plan；字段private，无mutable getter或默认Debug/Clone/serde/Error-source。纯factory不是trusted来源，实际接缝仍验证当下来源。

### PrivateMaterialPort

定义`crates/application/src/ports/private_material.rs`；只实际owning provider，返回活lease，不从async局部buffer返回悬空handle。

```rust
/// actual qualified材料读取和exact原projection本call渲染。
pub trait PrivateMaterialPort {
    /// 最后current核验后取得原材料owning lease，不durable缓存正文。
    fn read_material<'a>(&'a self, current: &'a CurrentMaterialQualification, scope: &'a SafeScopeRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeMaterialLease>;
    /// 原attempt/effect的获准projection渲染owning lease，附件只授权引用。
    fn render_payload<'a>(&'a self, plan: &'a SafePresentationPlan, attempt: &'a AttemptEffectRef, current: &'a CurrentPresentationQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgePayloadLease>;
}
```

lease后再做current核验，短借至具名handoff/dispatch Future完成；只有safe typed结果可离开。取消须先终止本地借用/poll再结束lease，外部effect仍未知。provider必须给actual byte上限、复制/销毁策略及no raw log/error保证；未核则NotEstablished，内存alloc/drop不充当安全擦除证据。attachment token/URL不得转safe log/ref或persist，owner引用读取只本call。

### SecretResolutionPort

定义`crates/application/src/ports/secret.rs`；provider exact版本、用途及安装/route current核验。

```rust
/// opaque ref解析成当前call-owned secret，不明文fallback。
pub trait SecretResolutionPort {
    /// 按exact provider/key/version及current use资格解析，不换最新版本。
    fn resolve<'a>(&'a self, current: &'a QualifiedSecretUseContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeSecretLease>;
    /// 最后IO前actual provider核轮换/撤销/期限/route，不只本地ref shape。
    fn revalidate<'a>(&'a self, current: &'a QualifiedSecretUseContext, revision: &'a SafeRevision, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualifiedSecretUseContext>>;
}
```

OAuth、API Key、PAT、Bot token、KMS均是未选provider配置seam，不进入Contracts值。SDK不能自动refresh后以新token重发原effect；rotation需新current/config资格，正在进行的original版本不静默替换。Secret不是内部Policy/Gate授权。无provider、wrong scope/purpose、revoke/expiry分别NotEstablished/Denied/Stale；raw错误只Infra内部清洗，不出source/Display/log/evidence。

### ConfigQualificationPort

定义`crates/application/src/ports/config_qualification.rs`；配置接纳/current运行/secret用途分开。

```rust
/// 实际safe设置与逐required seam资格，不因配置存在宣告运行可用。
pub trait ConfigQualificationPort {
    /// C01当前核draft/actions/config条件/actor，输出已核safe草案不激活。
    fn qualify_draft<'a>(&'a self, draft: &'a InstallationConfigDraft, action: ConfigurationMutationKind, expected: Option<&'a ExpectedConfigRevision>, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<InstallationConfigDraft>>;
    /// actual安装config/capability/source-mode/route/required-provider交集。
    fn qualify_installation<'a>(&'a self, installation: &'a BridgeInstallation, purpose: SecretUsePurpose, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<InstallationQualificationRef>>;
    /// actual exact opaque secret用途资格，不解析值或默认credential。
    fn qualify_secret_use<'a>(&'a self, installation: &'a BridgeInstallation, purpose: SecretUsePurpose, scope: &'a SafeScopeRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualifiedSecretUseContext>>;
    /// J05原relation已知关联失效计划，generation/basis均actual owner current。
    fn qualify_binding_invalidation<'a>(&'a self, binding: &'a ExternalBinding, basis: &'a QualificationMaintenanceBasisRef, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualificationInvalidationPlan>>;
    /// J05读/选择当前获准维护scope、预算与窗口，不能授owner动作新权。
    fn qualify_maintenance_read<'a>(&'a self, scope: &'a SafeScopeRef, job: &'a TrustedJobContext, limit: u32, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeLocalReadContext>>;
    /// J05当前核原dedup已到期窗口及显式维护授权；不是TTL/clock签发authority。
    fn qualify_dedup_expiry<'a>(&'a self, record: &'a DedupRecord, read: &'a BridgeLocalReadContext, job: &'a TrustedJobContext, now: SafeInstant, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RetentionExpiryBasisRef>>;
}
```

Configure only expected None/Absent，其他动作Some(actual config expected)/Present；Suspend/Retire仍显式授权但不要求安装已经运行。qualification不选SDK/HTTP/DB/Bus/KMS/router/executor；具体seam缺正式source时Blocked/Unavailable/Unsupported。J05不能给Revoked/Expired/Retired回边、给old plan复活或使missing生成grant；只当前阻IO、合法记录原状态/失效，关联分页有界且缺完整关联则保blocked不假装全部刷新。

`qualify_dedup_expiry`只接受同driver实际Maintenance读、J05 exact subject/expected、正式actor/scope/basis与批准retention配置。核record id/local revision/六namespace/key/meaning/original/result、原window basis scope/source/revision及真实到期；当前Policy/Gate适用性与维护authority仍成立且允许保原unknown的tombstone，才返回Qualified。未到期返回原Blocked(reason,checked_at)，已Expired入口只读no-op、零mutation；缺source/actor/policy/window proof则NotEstablished/Denied/Stale/Unavailable，不能把NotFound当到期或将job.basis直接转换。若需重新核远端正式authority只在tx外；不读取外部消息体、不probe业务effect、不授send/approve权限。返回safe proof生命周期见Step6原卡；tx begin/seal核同expected、current资格窗口及store绑定。

### LocalUnitOfWorkPort

定义`crates/application/src/ports/local_uow.rs`；技术方法仍在此既有port，不增加独立Clock/Id业务seam。driver与八repo同storage/source/schema binding，实际产品尚未选。

```rust
/// 唯一本地技术来源、事务登记/封存/提交与原结果权威读取。
pub trait LocalUnitOfWorkPort {
    /// 实际受核clock，不能读客户端/平台事件时间当当前时刻。
    fn now<'a>(&'a self, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SafeInstant>;
    /// Application专门factory请求不可复用技术ID，非外部/正文派生。
    fn allocate_id<'a>(&'a self, namespace: &'a InstallationNamespace, purpose: BridgeLocalIdPurpose, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, LocalObjectId>;
    /// CommandMetadata.request的唯一Some key按current scope/source核验。
    fn qualify_command_key<'a>(&'a self, metadata: &'a CommandMetadata, scope: &'a DedupNamespaceScope, authority: &'a SafeAuthorityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, QualifiedIdempotencyKey>;
    /// actual verified event/producer key及注册recipe；不hash正文/时间/trace。
    fn qualify_event_key<'a>(&'a self, value: &'a SafeOpaqueId, source: &'a SafeAuthorityRef, scope: &'a DedupNamespaceScope, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, QualifiedIdempotencyKey>;
    /// 当前原subject trusted job item key，不能生成新business operation。
    fn qualify_job_key<'a>(&'a self, subject: &'a BridgeMaintenanceSubject, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, QualifiedIdempotencyKey>;
    /// 只校/登记完整body-free canonical结构及codec版本；保typed meaning不带raw hash。
    fn qualify_meaning<'a>(&'a self, meaning: &'a BodyFreeOperationMeaningRef, scope: &'a DedupNamespaceScope, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BodyFreeOperationMeaningRef>;
    /// C04/E02同source/projection/target/action稳定effect结构，不mint新effect ID。
    fn qualify_effect<'a>(&'a self, effect: &'a StableEffectIdentity, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, StableEffectIdentity>;
    /// 完整CAS集实际比较，Matched不是已stage/commit。
    fn compare_expected<'a>(&'a self, expected: &'a ExpectedLocalRevisionSet, read: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, LocalCasDisposition>;
    /// same mutation/原op/完整expected/已核observability规则登记唯一tx，先于reservation。
    fn begin<'a>(&'a self, mutation: &'a LocalMutationRef, original: &'a OriginalOperationEffectRef, expected: &'a ExpectedLocalRevisionSet, observation: &'a MutationObservationRequirement, read: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeLocalTransaction>;
    /// 原owner inbound claim同tx reservation，原subject/op/fence一致。
    fn reserve_handoff_claim<'a>(&'a self, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, validity: &'a SafeValidityWindow, expected: &'a ExpectedLocalRevisionSet, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, HandoffClaimRef>;
    /// 事务内完整最终plan封存；核staged候选/reservations/result/audit/条件canonical全等。
    fn seal_plan<'a>(&'a self, plan: &'a QualifiedLocalMutationPlan, tx: &'a mut BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ()>;
    /// 消费handle，实际all-or-none driver提交；未知保原mutation。
    fn commit<'a>(&'a self, tx: BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, LocalCommitDisposition>;
    /// 消费handle，只接受actual driver rollback/unknown，不把drop/cancel当rollback。
    fn rollback<'a>(&'a self, tx: BridgeLocalTransaction, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, LocalCommitDisposition>;
    /// 只读原mutation实际状态；与LocalCommitProbeAdapter同driver/schema。
    fn read_original_commit<'a>(&'a self, mutation: &'a LocalMutationRef, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, LocalCommitDisposition>;
    /// J05exact既有资格行，完整typed model/local revision/hydration。
    fn read_qualification_subject<'a>(&'a self, subject: &'a BridgeViewSubjectRef, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<BridgeQualificationSnapshot>>;
    /// J05当前scope/as_of既有资格候选页，filter=Eligible RefreshQualification。
    fn list_eligible_qualification_subjects<'a>(&'a self, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, read: &'a BridgeLocalReadSession<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeQualificationSnapshot>>;
}
```

now由技术provider实际clock，clock产品未核NotEstablished；control deadline使用同clock域，不出现try_start需要now、now先无限递归try_start的循环：now入口先检查cancel/剩余预算且只一次底层clock read，再核deadline；其余方法实际clock读受provider call budget，domain factory不能自取系统时间。

ID只Application具名factory请求，再用LocalRefToken和exact wrapper构造，namespace/purpose一一对应；store decode只能重建已有ID，API不能调用allocate_id。job key只以typed `BridgeMaintenanceSubject`、`TrustedJobContext`的正式job source recipe/current scope生成；J05的actual expected版本和维护依据stable identity/revision是meaning/key的一部分，不能只按永久subject去重，否则后续合法维护永远冲突。requested_at/trace/continuity operation/body不参与key；worker/jobs不预先伪造QualifiedIdempotencyKey。eligible选择先生成key和typed meaning，再在同一qualified read中查dedup及原result/operation：已有记录必须meaning/subject一致并复用原operation，冲突或unknown不得换operation；确无记录时Application才可分配fresh未执行Operation并构造continuity，selection本身不stage reservation或证明执行。这里的fresh continuity仅未执行本地维护关联，是对Step6 existing-snapshot来源描述的限定补充，不是已reserved/committed原operation证明；J01~04已有business effect仍必须复用actual row原operation。Jobs只把selection的continuity及J05 expected装入plan；J invoke须从input subject/expected和trusted job context重新推导同一key并重读current dedup/result，竞争者已提交的原operation优先，fresh operation不一致只能stale/reuse，不能产生第二effect。Qualified meaning的canonical encoding注册规则保持typed kind/稳定身份/版本/explicit action，不因资格续期时间/trace/request ID变化；first local生成ID不参与业务含义，existing ID参与。codec算法、加密/冲突/retention细节Step13/14；缺正式codec先NotEstablished，无默认hash body。effect先根据typed stable source/projection+immutable target+kind结构qualify/find_by_effect，再仅fresh生成local intent/effect refs。

J01~04同key的非终态原record不是永久完成：J01的actual NoIo只支持原attempt合法NotDispatched本地处置；same intent/effect重试另须authoritative NoEffect及完整RetryEligibility/current/all bounds/原业务预算，才允许原operation继续；J02可在原recovery/window预算内只读probe，J03可在原gap范围内只读coverage，J04只按原canonical/op正式幂等或no-effect合同续交。它们仍同key/original，不从重复入口创建新业务effect；terminal stored result只visibility核后复用，unknown无续交证明继续manual/blocked。J05同expected的已提交原结果只复用；新expected必须actual新行与正式维护依据，不能由timer/trace/run号滚动key。

begin不需要未生成的claim候选：先actual read+current/observability preflight、技术mutation与expected登记，再same-tx reserve claim -> Application纯构造候选 ->各具名stage/result/audit/conditional handoff ->seal_plan全等 ->commit。seal不增写候选/IO；任何遗漏、额外write、staged candidate/hydration冒充、跨namespace/source/op或mandatory失效拒绝，不允许部分commit。原plan构造成功不是committed proof；commit/rollback Err或Indeterminate都仅原mutation查询，禁止begin新mutation重放。

网络/current外部preflight不在tx持有期内；最后IO前再次核资格，tx内只same driver baseline/technical reservation/stage。actual committed proof必须包含完整revisions/原op/mutation及driver authority；get原result为SafeTraceRepository，Query只get禁止read_original_commit/probe维护动作。

受权R5：begin登记原四variant观测资格；seal_plan逐分支对照Step6 QualifiedLocalMutationPlan规则。NonRecursiveResultOnly仍要求actual local audit/result和完整subject CAS，只免正式规则所排除的新producer；规则过期/范围不足拒绝seal，不能改成audit-only重试，任何新handoff/canonical/O01夹带均InvariantViolation。

### 8.2 共用组草稿与测试切口

技术来源、private owning/borrow、transaction循环及J05完整读取闭口；callable/input仍需本组下一附录，不提前宣布A7完成。计划测试：lease越期/取消/无raw trait、secret exact版本/route、provider缺失、canonical变义、begin/reservation/seal/commit未知、same driver、J05只已有subject；未执行。细节driver/状态/产品按后续Step11~14/04，本Step不伪造运行证据。
