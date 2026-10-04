# L6-bridges 03 Step6：Domain逐对象实现契约

当前D1；来源为Step5 Domain能力、02六对象/17状态边、当前Contracts。仅本Step对象contract，不是实现代码。六U是一个Domain role内部业务轴；BridgeLocalView不在此重复定义。

## 1. 共用执行与结构纪律

19个模型按D1~D6串行，每组先问题/诊断/取舍/capability及映射，再独立卡/草稿/自检。每个factory覆盖全部business必填字段，state固定允许初态、local_revision由首次UoW固定1；所有ref由Application技术ID/source port给入。重建参数完整并带实际LocalHydrationBasisRef，不能从API caller指定已提交/已接受状态。所有mutation方法只修改内存，无repo/client/clock/log/owner/platform IO。

state迁移与generation/config/cursor/lane/local-revision更新在同一次纯方法中先校验、checked计算后赋值，失败零修改；Application提交原子CAS，未提交的内存变化不是truth。已有safe ref/window结构不代表current许可。17状态enum和特殊Slot唯一来自Contracts，receipt/audit immutable、view在contracts、无新GlobalSuccess。

## 2. D1 / U1配置、显式relation与mapping

### 问题回答、诊断与取舍

U1承接受权安全配置、显式relation和三种typed mapping；02概要省略的id/namespace/完整两端/初态/CAS必须在factory闭口。配置qualified不证明relation可用；mapping valid仍不是human认证、participant或GlobalMember创建。采用完整typed输入与current guard；拒绝用external ID/display name猜actor、channel名猜scope、OAuth授内部权或通用restore。configuration_basis、local_revision和hydration proof是支撑字段，不增业务对象或owner truth。

| capability | 输入 | 输出 / 状态副作用 | 功能到对象 / 类别 | 后续 |
|---|---|---|---|---|
| U1-C1 | full安全config、正式配置basis、capability/secret/route引用 | configured/资格维护/暂停/退役内存变化 | BridgeInstallation / local config entity | ConfigQualificationPort/InstallationRepository/Step11/14 |
| U1-C2 | 明确两端、责任/basis Slots、受限动作集/代际 | pending/active/suspended/revoked/expired | ExternalBinding / authorized relation | BindingQualificationPort/MappingRepository/Step7/10 |
| U1-C3-account | verified namespace/account-kind及正式ActorRef/current basis | valid/stale/revoked，不创建actor | ExternalIdentityMapping / relation entity | ActorResponsibilityPort/Identity绑定 |
| U1-C3-location | verified channel/DM/topic/thread、明确parent及owner target | valid/stale/revoked，不创建channel/workspace | ExternalLocationMapping / relation entity | MappingRepository/owner resolver |
| U1-C3-message | 原locator/source-version/已知结果及origin basis | linked/stale/tombstoned安全关联 | ExternalMessageMapping / result relation | Inbound/Delivery结果及MappingRepository |


### BridgeInstallation
归属`binding/bridge_installation.rs`；U1-C1版本化安全配置和当前seam资格；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | configure/rehydrate | Configured；不可任意caller指定终态 |
| 完整替换受权同namespace安全设置；qualification置Stale/Missing | config_revision/全部config refs/qualification | `apply_revision` | Configured/Blocked/Suspended字段更新非lifecycle边；Qualified须先suspend |
| 维护写当前seam资格 | current完整config/capability/secret/route | `record_qualification` | Configured/Blocked -> Qualified |
| 缺资格阻运行 | qualification/maintenance basis | `block` | Configured/Qualified -> Blocked |
| 受权暂停且配置CAS递增 | configuration_basis/config_revision | `suspend` | Configured/Qualified/Blocked -> Suspended |
| 显式重启仍未qualified | basis/config_revision/qualification | `restart_configured` | Suspended -> Configured |
| 受权终态退役 | basis/config_revision | `retire` | Configured/Qualified/Blocked/Suspended -> Retired |

```rust
/// U1-C1版本化安全配置和当前seam资格；不拥有owner或平台truth。
pub struct BridgeInstallation {
    /// local配置identity。
    installation_ref: BridgeInstallationRef,
    /// 精确安装namespace。
    namespace: InstallationNamespace,
    /// 平台分类。
    platform_kind: PlatformKind,
    /// 配置CAS。
    config_revision: ConfigRevision,
    /// 逐method能力ref。
    capability_ref: CapabilitySnapshotRef,
    /// 精确provider/key/version。
    secret_binding: OpaqueSecretBindingRef,
    /// 受权route ref。
    route_policy: RoutePolicyRef,
    /// 配置授权。
    configuration_basis: ConfigurationBasisRef,
    /// 资格Slot。
    qualification: InstallationQualificationRefSlot,
    /// 本对象业务状态。
    state: BridgeInstallationState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| installation_ref | `BridgeInstallationRef` | local配置identity；Application ID source/首次UoW |
| namespace | `InstallationNamespace` | 精确安装namespace；受权config |
| platform_kind | `PlatformKind` | 平台分类；namespace一致decoder |
| config_revision | `ConfigRevision` | 配置CAS；首次1；受权配置变化checked next |
| capability_ref | `CapabilitySnapshotRef` | 逐method能力ref；ConfigQualificationPort |
| secret_binding | `OpaqueSecretBindingRef` | 精确provider/key/version；same config source |
| route_policy | `RoutePolicyRef` | 受权route ref；same source，不存URL |
| configuration_basis | `ConfigurationBasisRef` | 配置授权；current配置owner |
| qualification | `InstallationQualificationRefSlot` | 资格Slot；Configure必须Missing；维护job建立current |
| state | `BridgeInstallationState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn configure(installation_ref: BridgeInstallationRef, namespace: InstallationNamespace, platform_kind: PlatformKind, config_revision: ConfigRevision, capability_ref: CapabilitySnapshotRef, secret_binding: OpaqueSecretBindingRef, route_policy: RoutePolicyRef, configuration_basis: ConfigurationBasisRef, qualification: InstallationQualificationRefSlot) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Configured，local_revision=1；所有namespace/platform/ref一致，config_revision初始1、qualification显式Missing；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(installation_ref: BridgeInstallationRef, namespace: InstallationNamespace, platform_kind: PlatformKind, config_revision: ConfigRevision, capability_ref: CapabilitySnapshotRef, secret_binding: OpaqueSecretBindingRef, route_policy: RoutePolicyRef, configuration_basis: ConfigurationBasisRef, qualification: InstallationQualificationRefSlot, state: BridgeInstallationState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn apply_revision(&mut self, draft: InstallationConfigDraft, expected: ExpectedConfigRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 完整替换受权同namespace安全设置；qualification置Stale/Missing；Configured/Blocked/Suspended字段更新非lifecycle边；Qualified须先suspend；所有revision匹配、draft.revision=checked next；不覆写历史effect。 |
| 成员 | `pub fn record_qualification(&mut self, qualification: InstallationQualificationRef, expected: ExpectedConfigRevision, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 维护写当前seam资格；Configured/Blocked -> Qualified；来源须匹配当前config revision/安装/窗口，零网络。 |
| 成员 | `pub fn block(&mut self, basis: QualificationMaintenanceBasisRef, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 缺资格阻运行；Configured/Qualified -> Blocked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn suspend(&mut self, basis: ConfigurationBasisRef, expected: ExpectedConfigRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 受权暂停且配置CAS递增；Configured/Qualified/Blocked -> Suspended；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn restart_configured(&mut self, basis: ConfigurationBasisRef, expected: ExpectedConfigRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 显式重启仍未qualified；Suspended -> Configured；qualification失效；必须另行J05新核。 |
| 成员 | `pub fn retire(&mut self, basis: ConfigurationBasisRef, expected: ExpectedConfigRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 受权终态退役；Configured/Qualified/Blocked/Suspended -> Retired；保历史ref，Retired无回边。 |
| 只读成员 | `pub fn installation_ref(&self) -> &BridgeInstallationRef` | /// 读取local配置identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 读取精确安装namespace，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn platform_kind(&self) -> &PlatformKind` | /// 读取平台分类，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn config_revision(&self) -> &ConfigRevision` | /// 读取配置CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn capability_ref(&self) -> &CapabilitySnapshotRef` | /// 读取逐method能力ref，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn secret_binding(&self) -> &OpaqueSecretBindingRef` | /// 读取精确provider/key/version，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn route_policy(&self) -> &RoutePolicyRef` | /// 读取受权route ref，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn configuration_basis(&self) -> &ConfigurationBasisRef` | /// 读取配置授权，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn qualification(&self) -> &InstallationQualificationRefSlot` | /// 读取资格Slot，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &BridgeInstallationState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的BridgeInstallationState；允许边逐项对照02 Step9，未列边禁止。


### ExternalBinding
归属`binding/external_binding.rs`；U1-C2经显式授权的external relation；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | propose/rehydrate | Pending；不可任意caller指定终态 |
| 显式原target/动作集/责任激活 | 两Slot/generation | `activate` | Pending/Suspended -> Active |
| 受权暂停并递增generation | 原generation/受权basis | `suspend` | Active -> Suspended |
| 正式撤销终态并递增generation | 当前scope revoke依据 | `revoke` | Pending/Active/Suspended -> Revoked |
| 当前正式到期终态 | 授权窗口/代际 | `expire` | Pending/Active/Suspended -> Expired |
| 纯核当前Active两端/代际/动作 | 原relation/两Slot | `assert_current` | 只Active消费 |

```rust
/// U1-C2经显式授权的external relation；不拥有owner或平台truth。
pub struct ExternalBinding {
    /// local relation identity。
    binding_ref: ExternalBindingRef,
    /// 原安装。
    installation_ref: BridgeInstallationRef,
    /// 外部typed scope。
    external_scope: ExternalScopeLocator,
    /// 正式内部target。
    internal_target: BridgeInternalTargetRef,
    /// 原责任Slot。
    actor_basis: ActorResponsibilityRefSlot,
    /// 显式授权Slot。
    authorization_basis: AuthorizedBindingBasisRefSlot,
    /// 受限动作集合。
    directions_actions: BridgeDirectionActionSet,
    /// relation代际。
    generation: BindingGeneration,
    /// 本对象业务状态。
    state: ExternalBindingState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| binding_ref | `ExternalBindingRef` | local relation identity；Application ID/同UoW |
| installation_ref | `BridgeInstallationRef` | 原安装；受权配置 |
| external_scope | `ExternalScopeLocator` | 外部typed scope；verified decoder |
| internal_target | `BridgeInternalTargetRef` | 正式内部target；owner resolver |
| actor_basis | `ActorResponsibilityRefSlot` | 原责任Slot；正式责任链，pending可Missing |
| authorization_basis | `AuthorizedBindingBasisRefSlot` | 显式授权Slot；formal qualification，pending可Missing |
| directions_actions | `BridgeDirectionActionSet` | 受限动作集合；明确提案，不是自动授权 |
| generation | `BindingGeneration` | relation代际；首次1/许可变化checked next |
| state | `ExternalBindingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn propose(binding_ref: ExternalBindingRef, installation_ref: BridgeInstallationRef, external_scope: ExternalScopeLocator, internal_target: BridgeInternalTargetRef, actor_basis: ActorResponsibilityRefSlot, authorization_basis: AuthorizedBindingBasisRefSlot, directions_actions: BridgeDirectionActionSet, generation: BindingGeneration) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Pending，local_revision=1；generation初始1；两端namespace及正式target一致，Pending无动作许可；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(binding_ref: ExternalBindingRef, installation_ref: BridgeInstallationRef, external_scope: ExternalScopeLocator, internal_target: BridgeInternalTargetRef, actor_basis: ActorResponsibilityRefSlot, authorization_basis: AuthorizedBindingBasisRefSlot, directions_actions: BridgeDirectionActionSet, generation: BindingGeneration, state: ExternalBindingState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn activate(&mut self, current: BindingActivationQualification, expected: ExpectedGeneration, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 显式原target/动作集/责任激活；Pending/Suspended -> Active；current原binding/installation/target/actions一致，expected相符，新代际=checked next，两Slot建立。 |
| 成员 | `pub fn suspend(&mut self, basis: QualificationMaintenanceBasisRef, expected: ExpectedGeneration, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 受权暂停并递增generation；Active -> Suspended；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn revoke(&mut self, basis: RevocationBasisRef, expected: ExpectedGeneration, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 正式撤销终态并递增generation；Pending/Active/Suspended -> Revoked；两Slot失效，已发生owner/platform结果不撤销。 |
| 成员 | `pub fn expire(&mut self, basis: QualificationMaintenanceBasisRef, expected: ExpectedGeneration, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 当前正式到期终态；Pending/Active/Suspended -> Expired；必须正式expiry证明，到期即时拒绝IO，不等job。 |
| 成员 | `pub fn assert_current(&self, current: &CurrentBindingQualification, action: DirectionActionKind, now: SafeInstant) -> Result<(), ContractViolation>` | /// 纯核当前Active两端/代际/动作；只Active消费；零修改，IO前port重新核撤销。 |
| 只读成员 | `pub fn binding_ref(&self) -> &ExternalBindingRef` | /// 读取local relation identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn installation_ref(&self) -> &BridgeInstallationRef` | /// 读取原安装，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn external_scope(&self) -> &ExternalScopeLocator` | /// 读取外部typed scope，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn internal_target(&self) -> &BridgeInternalTargetRef` | /// 读取正式内部target，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn actor_basis(&self) -> &ActorResponsibilityRefSlot` | /// 读取原责任Slot，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn authorization_basis(&self) -> &AuthorizedBindingBasisRefSlot` | /// 读取显式授权Slot，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn directions_actions(&self) -> &BridgeDirectionActionSet` | /// 读取受限动作集合，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn generation(&self) -> &BindingGeneration` | /// 读取relation代际，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &ExternalBindingState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的ExternalBindingState；允许边逐项对照02 Step9，未列边禁止。


### ExternalIdentityMapping
归属`binding/external_identity_mapping.rs`；U1-C3-account受权账号责任关联；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | link/rehydrate | Valid；不可任意caller指定终态 |
| 纯核两端、kind/责任、代际 | actor/mapping/basis | `assert_applicable` | 只Valid |
| 当前依据或kind/代际失效 | 原basis/local CAS | `invalidate` | Valid -> Stale |
| 受权解除关系保历史 | 正式原scope revoke basis | `revoke` | Valid/Stale -> Revoked |

```rust
/// U1-C3-account受权账号责任关联；不拥有owner或平台truth。
pub struct ExternalIdentityMapping {
    /// local mapping identity。
    mapping_ref: IdentityMappingRef,
    /// namespace/account-kind/ID。
    external_account: ExternalAccountLocator,
    /// human/AI/Integration正式分类。
    actor_kind: BridgeActorKind,
    /// 正式actor。
    internal_actor: ActorRef,
    /// 原relation。
    binding_ref: ExternalBindingRef,
    /// 原代际。
    generation: BindingGeneration,
    /// 两端依据。
    basis: IdentityMappingBasisRef,
    /// 本对象业务状态。
    state: IdentityMappingState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| mapping_ref | `IdentityMappingRef` | local mapping identity；Application技术ID |
| external_account | `ExternalAccountLocator` | namespace/account-kind/ID；verified decoder |
| actor_kind | `BridgeActorKind` | human/AI/Integration正式分类；责任resolver |
| internal_actor | `ActorRef` | 正式actor；ActorResponsibilityPort/Identity；display_name=None |
| binding_ref | `ExternalBindingRef` | 原relation；current Active |
| generation | `BindingGeneration` | 原代际；current relation |
| basis | `IdentityMappingBasisRef` | 两端依据；formal mapping qualification |
| state | `IdentityMappingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn link(mapping_ref: IdentityMappingRef, external_account: ExternalAccountLocator, actor_kind: BridgeActorKind, internal_actor: ActorRef, binding_ref: ExternalBindingRef, generation: BindingGeneration, basis: IdentityMappingBasisRef, current: CurrentBindingQualification, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Valid，local_revision=1；current relation/generation/account namespace及formal actor kind一致；不创建GlobalMember；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(mapping_ref: IdentityMappingRef, external_account: ExternalAccountLocator, actor_kind: BridgeActorKind, internal_actor: ActorRef, binding_ref: ExternalBindingRef, generation: BindingGeneration, basis: IdentityMappingBasisRef, state: IdentityMappingState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn assert_applicable(&self, current: &CurrentBindingQualification, actor: &ActorResponsibilityRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// 纯核两端、kind/责任、代际；只Valid；zero mutation，不能从mention或bot标志补actor。 |
| 成员 | `pub fn invalidate(&mut self, basis: MappingInvalidationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 当前依据或kind/代际失效；Valid -> Stale；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn revoke(&mut self, basis: RevocationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 受权解除关系保历史；Valid/Stale -> Revoked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 只读成员 | `pub fn mapping_ref(&self) -> &IdentityMappingRef` | /// 读取local mapping identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn external_account(&self) -> &ExternalAccountLocator` | /// 读取namespace/account-kind/ID，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn actor_kind(&self) -> &BridgeActorKind` | /// 读取human/AI/Integration正式分类，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn internal_actor(&self) -> &ActorRef` | /// 读取正式actor，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn binding_ref(&self) -> &ExternalBindingRef` | /// 读取原relation，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn generation(&self) -> &BindingGeneration` | /// 读取原代际，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn basis(&self) -> &IdentityMappingBasisRef` | /// 读取两端依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &IdentityMappingState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的IdentityMappingState；允许边逐项对照02 Step9，未列边禁止。


### ExternalLocationMapping
归属`binding/external_location_mapping.rs`；U1-C3-location位置parent和owner target关联；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | link/rehydrate | Valid；不可任意caller指定终态 |
| 纯核明确两端和动作后读target | location/parent/target/basis | `resolve_target` | 只Valid |
| 定位/parent/代际/basis失效 | 原basis/local CAS | `invalidate` | Valid -> Stale |
| 显式受权解除 | 原scope revoke basis | `revoke` | Valid/Stale -> Revoked |

```rust
/// U1-C3-location位置parent和owner target关联；不拥有owner或平台truth。
pub struct ExternalLocationMapping {
    /// local mapping identity。
    mapping_ref: LocationMappingRef,
    /// channel/DM/topic/thread全定位。
    external_location: ExternalLocationLocator,
    /// root/parent明确适用性。
    parent_location: ParentLocationRefSlot,
    /// 正式target。
    internal_target: BridgeInternalTargetRef,
    /// 原relation。
    binding_ref: ExternalBindingRef,
    /// 原代际。
    generation: BindingGeneration,
    /// 两端kind/parent/方向依据。
    basis: LocationMappingBasisRef,
    /// 本对象业务状态。
    state: LocationMappingState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| mapping_ref | `LocationMappingRef` | local mapping identity；Application技术ID |
| external_location | `ExternalLocationLocator` | channel/DM/topic/thread全定位；verified decoder |
| parent_location | `ParentLocationRefSlot` | root/parent明确适用性；source能力及原父mapping |
| internal_target | `BridgeInternalTargetRef` | 正式target；owner resolver |
| binding_ref | `ExternalBindingRef` | 原relation；current Active |
| generation | `BindingGeneration` | 原代际；same relation |
| basis | `LocationMappingBasisRef` | 两端kind/parent/方向依据；formal qualification |
| state | `LocationMappingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn link(mapping_ref: LocationMappingRef, external_location: ExternalLocationLocator, parent_location: ParentLocationRefSlot, internal_target: BridgeInternalTargetRef, binding_ref: ExternalBindingRef, generation: BindingGeneration, basis: LocationMappingBasisRef, current: CurrentBindingQualification, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Valid，local_revision=1；parent必须按kind满足；正式target与current一致，不把external workspace当内部Workspace；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(mapping_ref: LocationMappingRef, external_location: ExternalLocationLocator, parent_location: ParentLocationRefSlot, internal_target: BridgeInternalTargetRef, binding_ref: ExternalBindingRef, generation: BindingGeneration, basis: LocationMappingBasisRef, state: LocationMappingState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn resolve_target(&self, current: &CurrentBindingQualification, action: DirectionActionKind, now: SafeInstant) -> Result<&BridgeInternalTargetRef, ContractViolation>` | /// 纯核明确两端和动作后读target；只Valid；缺parent或wrong-kind不默认频道；零修改。 |
| 成员 | `pub fn invalidate(&mut self, basis: MappingInvalidationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 定位/parent/代际/basis失效；Valid -> Stale；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn revoke(&mut self, basis: RevocationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 显式受权解除；Valid/Stale -> Revoked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 只读成员 | `pub fn mapping_ref(&self) -> &LocationMappingRef` | /// 读取local mapping identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn external_location(&self) -> &ExternalLocationLocator` | /// 读取channel/DM/topic/thread全定位，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn parent_location(&self) -> &ParentLocationRefSlot` | /// 读取root/parent明确适用性，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn internal_target(&self) -> &BridgeInternalTargetRef` | /// 读取正式target，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn binding_ref(&self) -> &ExternalBindingRef` | /// 读取原relation，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn generation(&self) -> &BindingGeneration` | /// 读取原代际，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn basis(&self) -> &LocationMappingBasisRef` | /// 读取两端kind/parent/方向依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &LocationMappingState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的LocationMappingState；允许边逐项对照02 Step9，未列边禁止。


### ExternalMessageMapping
归属`binding/external_message_mapping.rs`；U1-C3-message原消息与真实known关联；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | link_known/rehydrate | Linked；不可任意caller指定终态 |
| 纯核原消息与版本的变化适用 | 原source/version/locator | `match_change` | Linked；Tombstoned只可受限历史核对 |
| 原消费依据失效 | 原basis/代际 | `invalidate` | Linked -> Stale |
| 仅原locator实际受权delete disposition | owner change实际结果 | `record_tombstone` | Linked/Stale -> Tombstoned |

```rust
/// U1-C3-message原消息与真实known关联；不拥有owner或平台truth。
pub struct ExternalMessageMapping {
    /// local relation identity。
    mapping_ref: MessageMappingRef,
    /// 原message/root/thread。
    external_message: ExternalMessageLocator,
    /// 原安全source版本。
    source_ref_version: SafeSourceVersionRef,
    /// 原change。
    change_kind: ExternalChangeKind,
    /// 原已知owner结果。
    owner_result: OwnerAcceptedRefSlot,
    /// 原outbound effect。
    effect_ref: DeliveryEffectRefSlot,
    /// 原relation代际动作。
    generation_direction: MappingGenerationDirection,
    /// 可信来源与self-send关联。
    origin_marker: VerifiedOriginMarkerRef,
    /// 受权两端关联依据。
    mapping_basis: MappingBasisRef,
    /// 本对象业务状态。
    state: MessageMappingState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| mapping_ref | `MessageMappingRef` | local relation identity；Application ID |
| external_message | `ExternalMessageLocator` | 原message/root/thread；verified result/source |
| source_ref_version | `SafeSourceVersionRef` | 原安全source版本；owner/source qualification |
| change_kind | `ExternalChangeKind` | 原change；verified decoder |
| owner_result | `OwnerAcceptedRefSlot` | 原已知owner结果；actual accepted或明确不适用的Missing |
| effect_ref | `DeliveryEffectRefSlot` | 原outbound effect；actual known平台结果/原intent |
| generation_direction | `MappingGenerationDirection` | 原relation代际动作；qualified binding |
| origin_marker | `VerifiedOriginMarkerRef` | 可信来源与self-send关联；actual platform/local mapping |
| mapping_basis | `MappingBasisRef` | 受权两端关联依据；formal mapping qualification |
| state | `MessageMappingState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn link_known(mapping_ref: MessageMappingRef, external_message: ExternalMessageLocator, source_ref_version: SafeSourceVersionRef, change_kind: ExternalChangeKind, owner_result: OwnerAcceptedRefSlot, effect_ref: DeliveryEffectRefSlot, generation_direction: MappingGenerationDirection, origin_marker: VerifiedOriginMarkerRef, mapping_basis: MappingBasisRef, result: KnownMappingResultRef, current: CurrentBindingQualification, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Linked，local_revision=1；result与原locator/target/source/代际对应；OwnerAccepted必对应Established owner slot，PlatformAccepted必对应Established原effect；受权relation不伪造accepted；新link不接受无原mapping的Delete；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(mapping_ref: MessageMappingRef, external_message: ExternalMessageLocator, source_ref_version: SafeSourceVersionRef, change_kind: ExternalChangeKind, owner_result: OwnerAcceptedRefSlot, effect_ref: DeliveryEffectRefSlot, generation_direction: MappingGenerationDirection, origin_marker: VerifiedOriginMarkerRef, mapping_basis: MappingBasisRef, state: MessageMappingState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn match_change(&self, kind: ExternalChangeKind, source: &SafeSourceVersionRef, current: &CurrentBindingQualification) -> Result<(), ContractViolation>` | /// 纯核原消息与版本的变化适用；Linked；Tombstoned只可受限历史核对；Edit/Delete/Reply须原mapping，不能以late create复活；zero mutation。 |
| 成员 | `pub fn invalidate(&mut self, basis: MappingInvalidationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 原消费依据失效；Linked -> Stale；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn record_tombstone(&mut self, disposition: OwnerChangeDispositionRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 仅原locator实际受权delete disposition；Linked/Stale -> Tombstoned；保留原locator/结果/source；不删除owner实体。 |
| 只读成员 | `pub fn mapping_ref(&self) -> &MessageMappingRef` | /// 读取local relation identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn external_message(&self) -> &ExternalMessageLocator` | /// 读取原message/root/thread，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn source_ref_version(&self) -> &SafeSourceVersionRef` | /// 读取原安全source版本，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn change_kind(&self) -> &ExternalChangeKind` | /// 读取原change，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn owner_result(&self) -> &OwnerAcceptedRefSlot` | /// 读取原已知owner结果，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn effect_ref(&self) -> &DeliveryEffectRefSlot` | /// 读取原outbound effect，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn generation_direction(&self) -> &MappingGenerationDirection` | /// 读取原relation代际动作，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn origin_marker(&self) -> &VerifiedOriginMarkerRef` | /// 读取可信来源与self-send关联，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn mapping_basis(&self) -> &MappingBasisRef` | /// 读取受权两端关联依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &MessageMappingState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的MessageMappingState；允许边逐项对照02 Step9，未列边禁止。


### D1草稿与模块停审
U1只存safe config、relation及三个typed mapping；五factory显式id/两端/slot/basis输入，无假提交。Pending激活单独BindingActivationQualification，不能循环要求已Active；IO使用CurrentBindingQualification。所有state边与02 U1允许边相符，合法纯field修订不新增业务state；关联失效/CAS/audit交Application。五对象能力/字段来源/factory/状态/边界反查pass，读写方法不触平台owner；BR-UP保留。新增hydration/activation支撑卡及精确读取点交Step7，不新增业务对象。

## 3. D2 / U2安全入站与owner交接

### 问题回答、诊断与取舍
Inbound承接verified source、未受权/隔离、owner required材料、原op交接与结果；ACK独立。02的factory未覆盖record ID、Slots、digest适用性和真实verified basis，本步补齐。采用一个ref-only局部记录；reject durable raw inbox或ACK升级Accepted。重放只同op且有权威no-effect/source-window/current资格；blocked不是重交许可。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| U2-C1 | qualified source/namespace/origin、safe ref欠缺 | Verified/Quarantined有限局部记录 | InboundHandoffRecord / local handoff | PlatformIngressPort，E01/Step8 |
| U2-C2 | current actor/target/mode/material/digest/mapping | 纯qualify与durable接管要求 | 同对象，非Conversation实体 | ConversationHandoffPort/PrivateMaterialPort/UoW |
| U2-C3 | 原op actual owner结果/probe | OwnerAccepted/Rejected/Indeterminate | 同对象，原result关联 | InboundRepository/AuthoritativeRecoveryPort |


### InboundHandoffRecord
归属`inbound/inbound_handoff_record.rs`；U2-C1~C3安全来源接管与原owner op交接；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | from_verified/rehydrate | Verified；不可任意caller指定终态 |
| 补齐原mapping/actor/mode/material/digest输入 | 全部owner-required Slots | `qualify` | Verified/Blocked同态字段更新 |
| 材料/授权缺口 | finite reason | `block` | Verified -> Blocked |
| 伪来源/回环/冲突/缺原mapping隔离 | verified source/finite reason | `quarantine` | Verified -> Quarantined |
| 原op完整required guard后接管交接 | allrequired Slots/claim/原op | `begin_handoff` | Verified/Blocked/Indeterminate -> HandoffPending |
| 真实同opowner结果纯finalize | actual result/原target/op | `apply_owner_result` | HandoffPending/Indeterminate -> OwnerAccepted/OwnerRejected |
| 可能有owner effect但无确知结果 | 原op/source保留 | `mark_unknown` | HandoffPending -> Indeterminate |
| 实际ACK结果字段更新 | protocol_disposition | `record_protocol_disposition` | 业务state不变 |

```rust
/// U2-C1~C3安全来源接管与原owner op交接；不拥有owner或平台truth。
pub struct InboundHandoffRecord {
    /// local record identity。
    record_ref: InboundRecordRef,
    /// 真实协议验证依据。
    verified_source: VerifiedPlatformSourceRef,
    /// 真实来源回环依据。
    origin_marker: VerifiedOriginMarkerRef,
    /// 安全材料source或缺口。
    source_ref: SafeSourceRefSlot,
    /// 原owner operation。
    operation_ref: BridgeOperationRef,
    /// 原两端mapping。
    mapping_context: AuthorizedMappingContextRefSlot,
    /// owner正式模式。
    target_mode: BridgeTargetModeSlot,
    /// 正式责任actor。
    actor_ref: ActorRefSlot,
    /// 合格材料引用。
    material_ref: QualifiedMaterialRefSlot,
    /// owner digest要求。
    required_digest_ref: OwnerRequiredDigestRefSlot,
    /// 实际ACK阶段。
    protocol_disposition: ProtocolAckDisposition,
    /// 原owner实际结果。
    owner_result: OwnerHandoffResultRefSlot,
    /// 本对象业务状态。
    state: InboundHandoffState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| record_ref | `InboundRecordRef` | local record identity；Application ID/UoW |
| verified_source | `VerifiedPlatformSourceRef` | 真实协议验证依据；PlatformIngressPort |
| origin_marker | `VerifiedOriginMarkerRef` | 真实来源回环依据；same verification |
| source_ref | `SafeSourceRefSlot` | 安全材料source或缺口；qualified source，缺失不承诺replay |
| operation_ref | `BridgeOperationRef` | 原owner operation；首次reservation后不可替换 |
| mapping_context | `AuthorizedMappingContextRefSlot` | 原两端mapping；BindingQualificationPort |
| target_mode | `BridgeTargetModeSlot` | owner正式模式；ConversationHandoffPort |
| actor_ref | `ActorRefSlot` | 正式责任actor；ActorResponsibilityPort；AppendFact=Integration |
| material_ref | `QualifiedMaterialRefSlot` | 合格材料引用；PrivateMaterialPort/owner，不存body |
| required_digest_ref | `OwnerRequiredDigestRefSlot` | owner digest要求；current material，非body hash |
| protocol_disposition | `ProtocolAckDisposition` | 实际ACK阶段；private entry，非owner结果 |
| owner_result | `OwnerHandoffResultRefSlot` | 原owner实际结果；owner actual，同op，初始Missing |
| state | `InboundHandoffState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn from_verified(record_ref: InboundRecordRef, verified_source: VerifiedPlatformSourceRef, origin_marker: VerifiedOriginMarkerRef, source_ref: SafeSourceRefSlot, operation_ref: BridgeOperationRef, mapping_context: AuthorizedMappingContextRefSlot, target_mode: BridgeTargetModeSlot, actor_ref: ActorRefSlot, material_ref: QualifiedMaterialRefSlot, required_digest_ref: OwnerRequiredDigestRefSlot, protocol_disposition: ProtocolAckDisposition, owner_result: OwnerHandoffResultRefSlot) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Verified，local_revision=1；verified_source/origin同namespace；owner_result初始Missing；可缺Slots仍Verified不表示可交接；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(record_ref: InboundRecordRef, verified_source: VerifiedPlatformSourceRef, origin_marker: VerifiedOriginMarkerRef, source_ref: SafeSourceRefSlot, operation_ref: BridgeOperationRef, mapping_context: AuthorizedMappingContextRefSlot, target_mode: BridgeTargetModeSlot, actor_ref: ActorRefSlot, material_ref: QualifiedMaterialRefSlot, required_digest_ref: OwnerRequiredDigestRefSlot, protocol_disposition: ProtocolAckDisposition, owner_result: OwnerHandoffResultRefSlot, state: InboundHandoffState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn qualify(&mut self, context: AuthorizedMappingContextRef, mode: BridgeTargetMode, actor: ActorRef, material: CurrentMaterialQualification, current: CurrentBindingQualification, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 补齐原mapping/actor/mode/material/digest输入；Verified/Blocked同态字段更新；原op/source不变；current basis/mode/actor/digest/source版本相符，零IO。 |
| 成员 | `pub fn block(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 材料/授权缺口；Verified -> Blocked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn quarantine(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 伪来源/回环/冲突/缺原mapping隔离；Verified -> Quarantined；不保存被拒绝raw input或创造假的qualified actor。 |
| 成员 | `pub fn begin_handoff(&mut self, claim: HandoffClaimRef, current: CurrentBindingQualification, material: CurrentMaterialQualification, resume: Option<NoEffectBasisRef>, recovery: Option<RecoveryQualificationRef>, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原op完整required guard后接管交接；Verified/Blocked/Indeterminate -> HandoffPending；Verified首次交接；Blocked/Indeterminate必须same-op权威no-effect、recovery/source窗口/预算及完整current；不能用timeout/NotFound。 |
| 成员 | `pub fn apply_owner_result(&mut self, result: OwnerHandoffResultRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 真实同opowner结果纯finalize；HandoffPending/Indeterminate -> OwnerAccepted/OwnerRejected；Accepted必须actual accepted ref；Pending只HandoffPending同态record结果，未知转mark_unknown；无网络。 |
| 成员 | `pub fn mark_unknown(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 可能有owner effect但无确知结果；HandoffPending -> Indeterminate；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn record_protocol_disposition(&mut self, ack: ProtocolAckDisposition, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 实际ACK结果字段更新；业务state不变；只verified原source的实际ACK，不能触owner状态。 |
| 只读成员 | `pub fn record_ref(&self) -> &InboundRecordRef` | /// 读取local record identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn verified_source(&self) -> &VerifiedPlatformSourceRef` | /// 读取真实协议验证依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn origin_marker(&self) -> &VerifiedOriginMarkerRef` | /// 读取真实来源回环依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn source_ref(&self) -> &SafeSourceRefSlot` | /// 读取安全材料source或缺口，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_ref(&self) -> &BridgeOperationRef` | /// 读取原owner operation，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn mapping_context(&self) -> &AuthorizedMappingContextRefSlot` | /// 读取原两端mapping，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn target_mode(&self) -> &BridgeTargetModeSlot` | /// 读取owner正式模式，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn actor_ref(&self) -> &ActorRefSlot` | /// 读取正式责任actor，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn material_ref(&self) -> &QualifiedMaterialRefSlot` | /// 读取合格材料引用，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn required_digest_ref(&self) -> &OwnerRequiredDigestRefSlot` | /// 读取owner digest要求，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn protocol_disposition(&self) -> &ProtocolAckDisposition` | /// 读取实际ACK阶段，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn owner_result(&self) -> &OwnerHandoffResultRefSlot` | /// 读取原owner实际结果，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &InboundHandoffState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的InboundHandoffState；允许边逐项对照02 Step9，未列边禁止。


### D2草稿与模块停审
Inbound局部verified只指来源成立，所有owner-required Slots、材料/target mode/actor/digest和当前binding齐才接管；blocked/indeterminate重交需要原op权威no-effect和完整受权恢复，quarantined/owner终态无执行回边。ACK字段更新不改owner state，Pending只记录真实Pending结果不宣称Accepted。能力/字段/factory/允许边/安全责任自检pass，下一D3；BR-UP-001/002/004/008/009未关闭。

## 4. D3 / U3安全外显和原effect投递

### 问题回答、诊断与取舍
U3需要plan、不可变logical intent、追加attempt、immutable known receipt四个对象；full payload留private seam。qualified/degraded/blocked来自实际presentation资格，不由bool或低敏感label默认；current不足不生成按钮/附件链接。采用ref-only plan和同source/projection/target/generation/effect的投递结构；排除HTTP ACK当业务accepted、盲重试、同effect换plan。明确NoIoProofRef与NoEffectBasisRef不是同义：已调用但明确无效果不等从未调用。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| U3-C1 | owner committed source、获准projection/disclosure/附件/能力 | Qualified/Degraded/Blocked纯plan | SafePresentationPlan / local planner entity | PresentationQualificationPort/PrivateMaterialPort |
| U3-C2-effect | 原plan/source/target/namespace语义 | immutable logical effect | DeliveryIntent / effect aggregate | DeliveryRepository/ContinuityRepository/C04-E02一致性 |
| U3-C2-attempt | current eligibility/lane/fence/window | Claimed/InFlight/Unknown | DeliveryAttempt / local attempt | PlatformDeliveryPort/LocalUoW |
| U3-C3 | actual qualified known business result | immutable ref-only receipt及原intent finalize | PlatformReceipt / immutable local record | DeliveryRepository/MappingRepository/Step11/12 |


### SafePresentationPlan
归属`delivery/safe_presentation_plan.rs`；U3-C1原source获准外显规划；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | prepare/rehydrate | Qualified/Degraded/Blocked，严格由qualification及presentation_kind判定；不可任意caller指定终态 |
| 纯核原source/projection/target/basis/附件及期限 | 全部Slots/capability | `assert_current` | 只Qualified/Degraded |
| 原source/projection/target或资格失效 | source/projection/basis | `invalidate` | Qualified/Degraded -> Stale |
| 当前资格无法证明 | 原basis/finite reason | `block` | Qualified/Degraded -> Blocked |

```rust
/// U3-C1原source获准外显规划；不拥有owner或平台truth。
pub struct SafePresentationPlan {
    /// local plan identity。
    plan_ref: PresentationPlanRef,
    /// owner committed source版本。
    source_ref_version: CommittedSourceVersionRef,
    /// 原两端与受众。
    binding_context: AuthorizedMappingContextRef,
    /// 获准projection。
    projection_ref: AllowedProjectionRefSlot,
    /// 存在性/提示/route/action披露依据。
    disclosure_basis: DisclosureQualificationRefSlot,
    /// 获准附件或明确empty。
    attachment_grants: AttachmentGrantRefSetSlot,
    /// 完整允许或无动作安全降级。
    presentation_kind: QualifiedPresentationKind,
    /// 逐method安装能力。
    capability_ref: CapabilitySnapshotRef,
    /// 本对象业务状态。
    state: PresentationState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| plan_ref | `PresentationPlanRef` | local plan identity；Application技术ID |
| source_ref_version | `CommittedSourceVersionRef` | owner committed source版本；actual producer source |
| binding_context | `AuthorizedMappingContextRef` | 原两端与受众；formal mapping qualification |
| projection_ref | `AllowedProjectionRefSlot` | 获准projection；PresentationQualificationPort |
| disclosure_basis | `DisclosureQualificationRefSlot` | 存在性/提示/route/action披露依据；owner/Governance current |
| attachment_grants | `AttachmentGrantRefSetSlot` | 获准附件或明确empty；Artifact actual grant；必要不可省略 |
| presentation_kind | `QualifiedPresentationKind` | 完整允许或无动作安全降级；explicit disclosure |
| capability_ref | `CapabilitySnapshotRef` | 逐method安装能力；qualified config |
| state | `PresentationState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn prepare(plan_ref: PresentationPlanRef, source_ref_version: CommittedSourceVersionRef, binding_context: AuthorizedMappingContextRef, projection_ref: AllowedProjectionRefSlot, disclosure_basis: DisclosureQualificationRefSlot, attachment_grants: AttachmentGrantRefSetSlot, presentation_kind: QualifiedPresentationKind, capability_ref: CapabilitySnapshotRef, qualification: QualificationSlot<CurrentPresentationQualification>, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Qualified/Degraded/Blocked，严格由qualification及presentation_kind判定，local_revision=1；Established且三Slot齐且匹配原plan才Qualified；explicit允许无动作降级才Degraded；Missing/Stale=>Blocked，不编造ref；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(plan_ref: PresentationPlanRef, source_ref_version: CommittedSourceVersionRef, binding_context: AuthorizedMappingContextRef, projection_ref: AllowedProjectionRefSlot, disclosure_basis: DisclosureQualificationRefSlot, attachment_grants: AttachmentGrantRefSetSlot, presentation_kind: QualifiedPresentationKind, capability_ref: CapabilitySnapshotRef, state: PresentationState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn assert_current(&self, qualification: &CurrentPresentationQualification, now: SafeInstant) -> Result<(), ContractViolation>` | /// 纯核原source/projection/target/basis/附件及期限；只Qualified/Degraded；qualification原plan/ref/版本完整，降级禁止action；zero mutation。 |
| 成员 | `pub fn invalidate(&mut self, basis: PresentationInvalidationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 原source/projection/target或资格失效；Qualified/Degraded -> Stale；保原refs不变义；Stale无restore。 |
| 成员 | `pub fn block(&mut self, basis: PresentationInvalidationBasisRef, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 当前资格无法证明；Qualified/Degraded -> Blocked；原Blocked不能自动升qualified；新材料需新plan。 |
| 只读成员 | `pub fn plan_ref(&self) -> &PresentationPlanRef` | /// 读取local plan identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn source_ref_version(&self) -> &CommittedSourceVersionRef` | /// 读取owner committed source版本，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn binding_context(&self) -> &AuthorizedMappingContextRef` | /// 读取原两端与受众，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn projection_ref(&self) -> &AllowedProjectionRefSlot` | /// 读取获准projection，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn disclosure_basis(&self) -> &DisclosureQualificationRefSlot` | /// 读取存在性/提示/route/action披露依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn attachment_grants(&self) -> &AttachmentGrantRefSetSlot` | /// 读取获准附件或明确empty，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn presentation_kind(&self) -> &QualifiedPresentationKind` | /// 读取完整允许或无动作安全降级，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn capability_ref(&self) -> &CapabilitySnapshotRef` | /// 读取逐method安装能力，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &PresentationState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的PresentationState；允许边逐项对照02 Step9，未列边禁止。


### DeliveryIntent
归属`delivery/delivery_intent.rs`；U3-C2/C3固化逻辑effect含义；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | from_plan/rehydrate | Planned；不可任意caller指定终态 |
| 原effect/lane/current资格下claim | 原source/target/effect/plan/lane | `claim` | Planned/RetryWait -> Dispatching |
| 权威同effect已知终态业务结果 | receipt.actual attempt/effect/kind | `apply_receipt` | Dispatching/Indeterminate -> PlatformAccepted/KnownRejected |
| 可能已发效果，保原身份 | same effect/原attempt | `mark_unknown` | Dispatching -> Indeterminate |
| 权威no-effect和全资格下有限等待 | 同effect no-effect/预算/原plan/window/rate | `schedule_retry` | Dispatching/Indeterminate -> RetryWait |
| 未IO时current资格或材料欠缺 | 原资格/finite reason | `block` | Planned/RetryWait -> Blocked |
| 逐method明确不支持且无合法降级 | 实际capability ref | `mark_unsupported` | Planned/RetryWait -> Unsupported |
| 只临时seam恢复且已证原effect无结果 | 原source/projection/target/effect完整 | `restore_planned` | Blocked -> Planned |

```rust
/// U3-C2/C3固化逻辑effect含义；不拥有owner或平台truth。
pub struct DeliveryIntent {
    /// local intent。
    intent_ref: DeliveryIntentRef,
    /// 不可变effect。
    effect_ref: DeliveryEffectRef,
    /// 原producer/management op。
    operation_ref: BridgeOperationRef,
    /// 原source/projection版本。
    source_projection: StableSourceProjectionRef,
    /// 原安装/位置/parent/generation。
    target_context: ImmutableDeliveryTargetRef,
    /// send/edit/delete/reply。
    operation_kind: ExternalDeliveryKind,
    /// 原plan。
    plan_ref: PresentationPlanRef,
    /// 受限顺序lane。
    lane_ref: DispatchLaneRef,
    /// 同effectretry资格。
    retry_basis: RetryEligibilityRefSlot,
    /// 本对象业务状态。
    state: DeliveryIntentState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| intent_ref | `DeliveryIntentRef` | local intent；Application ID/UoW |
| effect_ref | `DeliveryEffectRef` | 不可变effect；首次dedup接管，重复保原 |
| operation_ref | `BridgeOperationRef` | 原producer/management op；reservation |
| source_projection | `StableSourceProjectionRef` | 原source/projection版本；原plan |
| target_context | `ImmutableDeliveryTargetRef` | 原安装/位置/parent/generation；qualified mapping |
| operation_kind | `ExternalDeliveryKind` | send/edit/delete/reply；原safe meaning |
| plan_ref | `PresentationPlanRef` | 原plan；existing qualified/degraded plan |
| lane_ref | `DispatchLaneRef` | 受限顺序lane；same qualified scope |
| retry_basis | `RetryEligibilityRefSlot` | 同effectretry资格；初始Missing，actual authoritative basis |
| state | `DeliveryIntentState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn from_plan(intent_ref: DeliveryIntentRef, effect_ref: DeliveryEffectRef, operation_ref: BridgeOperationRef, source_projection: StableSourceProjectionRef, target_context: ImmutableDeliveryTargetRef, operation_kind: ExternalDeliveryKind, plan_ref: PresentationPlanRef, lane_ref: DispatchLaneRef, retry_basis: RetryEligibilityRefSlot, effect: StableEffectIdentity, plan: CurrentPresentationQualification, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Planned，local_revision=1；StableEffectIdentity必须Delivery且effect ID/DeliveryOperationMeaning与完整原source/target/kind一致；plan current匹配；retry初始Missing；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(intent_ref: DeliveryIntentRef, effect_ref: DeliveryEffectRef, operation_ref: BridgeOperationRef, source_projection: StableSourceProjectionRef, target_context: ImmutableDeliveryTargetRef, operation_kind: ExternalDeliveryKind, plan_ref: PresentationPlanRef, lane_ref: DispatchLaneRef, retry_basis: RetryEligibilityRefSlot, state: DeliveryIntentState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn claim(&mut self, qualification: DispatchEligibilityRef, claim: FencedClaimRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原effect/lane/current资格下claim；Planned/RetryWait -> Dispatching；RetryWait须Established同effect资格及全部等待下界；IO另核actual local commit。 |
| 成员 | `pub fn apply_receipt(&mut self, receipt: &PlatformReceipt, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 权威同effect已知终态业务结果；Dispatching/Indeterminate -> PlatformAccepted/KnownRejected；retryable拒绝须由schedule_retry从原state处理，不先落KnownRejected再复活。 |
| 成员 | `pub fn mark_unknown(&mut self, attempt: AttemptEffectRef, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 可能已发效果，保原身份；Dispatching -> Indeterminate；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn schedule_retry(&mut self, retry: RetryEligibilityRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 权威no-effect和全资格下有限等待；Dispatching/Indeterminate -> RetryWait；不能仅business rejected/timeout/NotFound；known成功只finalize。 |
| 成员 | `pub fn block(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 未IO时current资格或材料欠缺；Planned/RetryWait -> Blocked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn mark_unsupported(&mut self, capability: CapabilitySnapshotRef, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 逐method明确不支持且无合法降级；Planned/RetryWait -> Unsupported；不是bool设置成功/降级；来源缺失只Blocked。 |
| 成员 | `pub fn restore_planned(&mut self, current: CurrentPresentationQualification, no_effect: NoEffectBasisRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 只临时seam恢复且已证原effect无结果；Blocked -> Planned；不能更换plan，Unsupported/Accepted/KnownRejected无回边。 |
| 只读成员 | `pub fn intent_ref(&self) -> &DeliveryIntentRef` | /// 读取local intent，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn effect_ref(&self) -> &DeliveryEffectRef` | /// 读取不可变effect，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_ref(&self) -> &BridgeOperationRef` | /// 读取原producer/management op，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn source_projection(&self) -> &StableSourceProjectionRef` | /// 读取原source/projection版本，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn target_context(&self) -> &ImmutableDeliveryTargetRef` | /// 读取原安装/位置/parent/generation，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_kind(&self) -> &ExternalDeliveryKind` | /// 读取send/edit/delete/reply，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn plan_ref(&self) -> &PresentationPlanRef` | /// 读取原plan，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn lane_ref(&self) -> &DispatchLaneRef` | /// 读取受限顺序lane，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn retry_basis(&self) -> &RetryEligibilityRefSlot` | /// 读取同effectretry资格，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &DeliveryIntentState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的DeliveryIntentState；允许边逐项对照02 Step9，未列边禁止。


### DeliveryAttempt
归属`delivery/delivery_attempt.rs`；U3-C2/C3单次追加投递attempt；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | claim_for/rehydrate | Claimed；不可任意caller指定终态 |
| 最终原fence/current资格后标可能IO | same attempt/effect/fence/window | `begin_io` | Claimed -> InFlight |
| 原attempt/effect actual known结果 | actual source/kind | `record_result` | InFlight/Indeterminate -> KnownAccepted/KnownRejected |
| IO结果未知或恢复无法证明是否离开 | 原attempt/effect | `mark_unknown` | InFlight/Claimed -> Indeterminate |
| 同attempt权威从未发起IO | actual no-IO proof | `record_not_dispatched` | Claimed/Indeterminate -> NotDispatched |

```rust
/// U3-C2/C3单次追加投递attempt；不拥有owner或平台truth。
pub struct DeliveryAttempt {
    /// 唯一attempt。
    attempt_ref: AttemptRef,
    /// 原intent/effect。
    intent_effect: DeliveryIntentEffectRef,
    /// 原lane claim/fence。
    claim_ref: FencedClaimRef,
    /// 调用前资格。
    qualification_ref: DispatchEligibilityRef,
    /// 受权调用窗口。
    attempt_window: AuthorizedAttemptWindowRef,
    /// known结果Slot。
    result_ref: PlatformBusinessResultRefSlot,
    /// 本对象业务状态。
    state: DeliveryAttemptState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| attempt_ref | `AttemptRef` | 唯一attempt；Application ID/同UoW |
| intent_effect | `DeliveryIntentEffectRef` | 原intent/effect；existing intent |
| claim_ref | `FencedClaimRef` | 原lane claim/fence；UoW reservation；IO前必须durable |
| qualification_ref | `DispatchEligibilityRef` | 调用前资格；current ports，不含secret值 |
| attempt_window | `AuthorizedAttemptWindowRef` | 受权调用窗口；current eligible |
| result_ref | `PlatformBusinessResultRefSlot` | known结果Slot；初始Missing，actual adapter结果 |
| state | `DeliveryAttemptState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn claim_for(attempt_ref: AttemptRef, intent_effect: DeliveryIntentEffectRef, claim_ref: FencedClaimRef, qualification_ref: DispatchEligibilityRef, attempt_window: AuthorizedAttemptWindowRef, result_ref: PlatformBusinessResultRefSlot, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Claimed，local_revision=1；claim原attempt/intent/effect/lane一致，current eligibility/window完整且result初始Missing；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(attempt_ref: AttemptRef, intent_effect: DeliveryIntentEffectRef, claim_ref: FencedClaimRef, qualification_ref: DispatchEligibilityRef, attempt_window: AuthorizedAttemptWindowRef, result_ref: PlatformBusinessResultRefSlot, state: DeliveryAttemptState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn begin_io(&mut self, claim: FencedClaimRef, qualification: DispatchEligibilityRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 最终原fence/current资格后标可能IO；Claimed -> InFlight；Application必须先提交此阶段，再跨private seam；crash不能回Claimed。 |
| 成员 | `pub fn record_result(&mut self, result: PlatformBusinessResultRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 原attempt/effect actual known结果；InFlight/Indeterminate -> KnownAccepted/KnownRejected；HTTP/protocol ACK不够；结果附Established Slot，零网络。 |
| 成员 | `pub fn mark_unknown(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// IO结果未知或恢复无法证明是否离开；InFlight/Claimed -> Indeterminate；Claimed只J02 crash恢复路径；不由lease推NotDispatched。 |
| 成员 | `pub fn record_not_dispatched(&mut self, proof: NoIoProofRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 同attempt权威从未发起IO；Claimed/Indeterminate -> NotDispatched；NoEffectBasis不自动满足未dispatch；终态attempt不能再InFlight。 |
| 只读成员 | `pub fn attempt_ref(&self) -> &AttemptRef` | /// 读取唯一attempt，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn intent_effect(&self) -> &DeliveryIntentEffectRef` | /// 读取原intent/effect，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn claim_ref(&self) -> &FencedClaimRef` | /// 读取原lane claim/fence，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn qualification_ref(&self) -> &DispatchEligibilityRef` | /// 读取调用前资格，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn attempt_window(&self) -> &AuthorizedAttemptWindowRef` | /// 读取受权调用窗口，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn result_ref(&self) -> &PlatformBusinessResultRefSlot` | /// 读取known结果Slot，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &DeliveryAttemptState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的DeliveryAttemptState；允许边逐项对照02 Step9，未列边禁止。


### PlatformReceipt
归属`delivery/platform_receipt.rs`；U3-C3只记录known业务响应；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | from_known/rehydrate | 无业务state；immutable local_revision=1；不可任意caller指定终态 |
| 纯核原effect关联 | attempt_effect | `matches_effect` | 不适用，immutable |
| 只读known分类 | result_kind | `business_result` | 不适用，immutable |

```rust
/// U3-C3只记录known业务响应；不拥有owner或平台truth。
pub struct PlatformReceipt {
    /// local receipt。
    receipt_ref: PlatformReceiptRef,
    /// 原attempt/effect。
    attempt_effect: AttemptEffectRef,
    /// business accepted/rejected。
    result_kind: KnownPlatformBusinessResultKind,
    /// 实际结果locator或明确不适用。
    external_locator: VerifiedExternalMessageLocatorSlot,
    /// 真实method结果权威。
    authority_basis: PlatformResultAuthorityRef,
    /// 明确no-effect或缺失。
    no_effect_basis: NoEffectBasisRefSlot,
    /// finite reason。
    safe_reason: SafeReasonCode,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| receipt_ref | `PlatformReceiptRef` | local receipt；Application技术ID |
| attempt_effect | `AttemptEffectRef` | 原attempt/effect；actual known结果 |
| result_kind | `KnownPlatformBusinessResultKind` | business accepted/rejected；qualified adapter mapping |
| external_locator | `VerifiedExternalMessageLocatorSlot` | 实际结果locator或明确不适用；same method authoritative response |
| authority_basis | `PlatformResultAuthorityRef` | 真实method结果权威；PlatformDeliveryPort |
| no_effect_basis | `NoEffectBasisRefSlot` | 明确no-effect或缺失；same actual result，不由拒绝默认 |
| safe_reason | `SafeReasonCode` | finite reason；safe error mapper |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn from_known(receipt_ref: PlatformReceiptRef, attempt_effect: AttemptEffectRef, result_kind: KnownPlatformBusinessResultKind, external_locator: VerifiedExternalMessageLocatorSlot, authority_basis: PlatformResultAuthorityRef, no_effect_basis: NoEffectBasisRefSlot, safe_reason: SafeReasonCode, known: KnownPlatformBusinessResult) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；无业务state；immutable local_revision=1，local_revision=1；known必须实际与全部fields一致；create accepted需要locator，delete按method明确NotApplicable；unknown不得构造receipt；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(receipt_ref: PlatformReceiptRef, attempt_effect: AttemptEffectRef, result_kind: KnownPlatformBusinessResultKind, external_locator: VerifiedExternalMessageLocatorSlot, authority_basis: PlatformResultAuthorityRef, no_effect_basis: NoEffectBasisRefSlot, safe_reason: SafeReasonCode, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn matches_effect(&self, effect: &DeliveryEffectRef) -> bool` | /// 纯核原effect关联；不适用，immutable；zero mutation/IO，不证明送达或已读。 |
| 成员 | `pub fn business_result(&self) -> &KnownPlatformBusinessResultKind` | /// 只读known分类；不适用，immutable；不返回raw platform body。 |
| 只读成员 | `pub fn receipt_ref(&self) -> &PlatformReceiptRef` | /// 读取local receipt，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn attempt_effect(&self) -> &AttemptEffectRef` | /// 读取原attempt/effect，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn result_kind(&self) -> &KnownPlatformBusinessResultKind` | /// 读取business accepted/rejected，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn external_locator(&self) -> &VerifiedExternalMessageLocatorSlot` | /// 读取实际结果locator或明确不适用，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn authority_basis(&self) -> &PlatformResultAuthorityRef` | /// 读取真实method结果权威，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn no_effect_basis(&self) -> &NoEffectBasisRefSlot` | /// 读取明确no-effect或缺失，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn safe_reason(&self) -> &SafeReasonCode` | /// 读取finite reason，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。无独立业务state；local_revision首次1固定，immutable对象不提供setter。


### D3草稿与模块停审
四对象全部business字段、固定初态和完整hydrate显式。Intent receipt消费收实际PlatformReceipt对象，不以ref名称推结果；NoIo与NoEffect区分、KnownRejected/Unsupported无恢复回边、blocked恢复不更换原plan。初版unsupported bool已在本组停审前拆为block与mark_unsupported typed方法。factory/17机承接/known receipt无机/字段来源与private排除自检pass，下一D4；配置/secret当前资格和local claim durable证明由Application提交/ports在IO前核，不让Domain直接获取secret。

## 5. D4 / U4一次性外部action与owner交接

### 问题回答、诊断与取舍
action绑定原source-intent/known message/actor/target/action/owner revision/代际/expiry；callback消费只交正式owner动作。02未存claimed原op关联，本步补one_use_claim字段，Claimed必须Established并与原Callback/Dedup同UoW。Verified必须完整validation，初始验证失败只安全entry disposition，不伪造Verified business record再拒绝。采用immutable原操作关联；排除签名/平台admin/低敏感button当审批权限、unknown再approve、claimed复活。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| U4-C1 | 正式disclosure/action/actor/source/expiry资格 | Active/Claimed/Expired/Revoked | ExternalActionBinding / local one-use relation | CallbackRepository/ActorResponsibilityPort/OwnerActionPort |
| U4-C2 | full callback verification/current owner条件 | Verified/OwnerPending、原one-use关联 | CallbackHandoffRecord / local record | CallbackVerificationPort/LocalUoW |
| U4-C3 | same-op actual owner result/probe | OwnerAccepted/Rejected/Indeterminate | 同callback对象，非Decision实体 | OwnerActionPort/AuthoritativeRecoveryPort |


### ExternalActionBinding
归属`callback/external_action_binding.rs`；U4-C1获准一次性外部交互relation；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | bind/rehydrate | Active；不可任意caller指定终态 |
| 原source/actor/target/action/state/expiry全匹配后一次接管 | 原action/source/owner_revision/generation/one_use_claim | `claim_once` | Active -> Claimed |
| 正式expiry即时不再可执行 | 原expiry basis | `expire` | Active -> Expired |
| 原action/relation受权撤销 | current revoke basis | `revoke` | Active -> Revoked |
| 纯核原完整动作 | all原固定字段 | `assert_current` | 只Active可消费 |

```rust
/// U4-C1获准一次性外部交互relation；不拥有owner或平台truth。
pub struct ExternalActionBinding {
    /// local action identity。
    action_binding_ref: ExternalActionBindingRef,
    /// 原安装。
    installation_ref: BridgeInstallationRef,
    /// 原intent/known message/source。
    source_intent: SourceIntentMessageRef,
    /// 正式有权actor。
    actor_responsibility: ActorResponsibilityRef,
    /// 正式owner目标动作。
    target_action: OwnerTargetActionRef,
    /// 正式owner当前状态条件。
    owner_revision: OwnerActionStateRevision,
    /// 原relation代际。
    binding_generation: BindingGeneration,
    /// 正式期限one-use basis。
    expiry_one_use: ActionExpiryOneUseRef,
    /// 动作授权独立于披露。
    authorization_basis: ActionAuthorizationBasisRef,
    /// 原claim不可换op。
    one_use_claim: OneUseClaimRefSlot,
    /// 本对象业务状态。
    state: ExternalActionState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| action_binding_ref | `ExternalActionBindingRef` | local action identity；Application ID |
| installation_ref | `BridgeInstallationRef` | 原安装；current relation |
| source_intent | `SourceIntentMessageRef` | 原intent/known message/source；actual known platform映射 |
| actor_responsibility | `ActorResponsibilityRef` | 正式有权actor；ActorResponsibilityPort |
| target_action | `OwnerTargetActionRef` | 正式owner目标动作；OwnerActionPort |
| owner_revision | `OwnerActionStateRevision` | 正式owner当前状态条件；same owner |
| binding_generation | `BindingGeneration` | 原relation代际；current binding |
| expiry_one_use | `ActionExpiryOneUseRef` | 正式期限one-use basis；owner/CallbackRepository |
| authorization_basis | `ActionAuthorizationBasisRef` | 动作授权独立于披露；actual owner |
| one_use_claim | `OneUseClaimRefSlot` | 原claim不可换op；初始Missing，Claimed必Established |
| state | `ExternalActionState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn bind(action_binding_ref: ExternalActionBindingRef, installation_ref: BridgeInstallationRef, source_intent: SourceIntentMessageRef, actor_responsibility: ActorResponsibilityRef, target_action: OwnerTargetActionRef, owner_revision: OwnerActionStateRevision, binding_generation: BindingGeneration, expiry_one_use: ActionExpiryOneUseRef, authorization_basis: ActionAuthorizationBasisRef, one_use_claim: OneUseClaimRefSlot, current: CurrentActionQualification, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Active，local_revision=1；必须明确获准action/disclosure入口；原known message合法；current匹配全部固定条件，one_use_claim初始Missing；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(action_binding_ref: ExternalActionBindingRef, installation_ref: BridgeInstallationRef, source_intent: SourceIntentMessageRef, actor_responsibility: ActorResponsibilityRef, target_action: OwnerTargetActionRef, owner_revision: OwnerActionStateRevision, binding_generation: BindingGeneration, expiry_one_use: ActionExpiryOneUseRef, authorization_basis: ActionAuthorizationBasisRef, one_use_claim: OneUseClaimRefSlot, state: ExternalActionState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn claim_once(&mut self, operation: BridgeOperationRef, claim: OneUseClaimRef, current: CurrentActionQualification, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原source/actor/target/action/state/expiry全匹配后一次接管；Active -> Claimed；claim原action/callback/op一致，同UoW与Callback Pending+dedup绑定；Claimed无回边。 |
| 成员 | `pub fn expire(&mut self, basis: ActionExpiryOneUseRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 正式expiry即时不再可执行；Active -> Expired；current owner实际到期，不能以job delay续权。 |
| 成员 | `pub fn revoke(&mut self, basis: RevocationBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 原action/relation受权撤销；Active -> Revoked；已claimed原op只对账，不撤销已发生owner事实。 |
| 成员 | `pub fn assert_current(&self, current: &CurrentActionQualification, now: SafeInstant) -> Result<(), ContractViolation>` | /// 纯核原完整动作；只Active可消费；zero mutation，owner执行时仍二次核Gate/Policy。 |
| 只读成员 | `pub fn action_binding_ref(&self) -> &ExternalActionBindingRef` | /// 读取local action identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn installation_ref(&self) -> &BridgeInstallationRef` | /// 读取原安装，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn source_intent(&self) -> &SourceIntentMessageRef` | /// 读取原intent/known message/source，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn actor_responsibility(&self) -> &ActorResponsibilityRef` | /// 读取正式有权actor，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn target_action(&self) -> &OwnerTargetActionRef` | /// 读取正式owner目标动作，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn owner_revision(&self) -> &OwnerActionStateRevision` | /// 读取正式owner当前状态条件，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn binding_generation(&self) -> &BindingGeneration` | /// 读取原relation代际，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn expiry_one_use(&self) -> &ActionExpiryOneUseRef` | /// 读取正式期限one-use basis，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn authorization_basis(&self) -> &ActionAuthorizationBasisRef` | /// 读取动作授权独立于披露，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn one_use_claim(&self) -> &OneUseClaimRefSlot` | /// 读取原claim不可换op，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &ExternalActionState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的ExternalActionState；允许边逐项对照02 Step9，未列边禁止。


### CallbackHandoffRecord
归属`callback/callback_handoff_record.rs`；U4-C2/C3原callback与正式owner action；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | from_verified/rehydrate | Verified；不可任意caller指定终态 |
| 全资格及durable one-use原op接管 | 全部required Slots/current owner条件 | `begin_handoff` | Verified -> OwnerPending |
| 正式合同或basis不可用 | finite资格reason | `block` | Verified -> Blocked |
| 已verified原记录后发现过期/冲突/跨目标 | 当前验证有限拒绝理由 | `reject` | Verified -> Rejected |
| owner二次核验真实结果 | same op/target/action/result | `apply_owner_result` | OwnerPending/Indeterminate -> OwnerAccepted/OwnerRejected |
| owner动作效果未知 | 原one_use/op保留 | `mark_unknown` | OwnerPending -> Indeterminate |
| 实际ACK字段更新 | protocol_disposition | `record_protocol_disposition` | 业务state不变 |

```rust
/// U4-C2/C3原callback与正式owner action；不拥有owner或平台truth。
pub struct CallbackHandoffRecord {
    /// local record identity。
    callback_ref: CallbackRecordRef,
    /// 原owner op。
    operation_ref: BridgeOperationRef,
    /// 原action。
    action_binding_ref: ExternalActionBindingRefSlot,
    /// 完整来源责任验证。
    verification_ref: CallbackVerificationRefSlot,
    /// 正式动作。
    owner_action_ref: OwnerTargetActionRefSlot,
    /// one-use原op关联。
    one_use_claim: OneUseClaimRefSlot,
    /// 实际protocol ACK。
    protocol_disposition: ProtocolAckDisposition,
    /// 同opactual owner结果。
    owner_result: OwnerActionResultRefSlot,
    /// 本对象业务状态。
    state: CallbackHandoffState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| callback_ref | `CallbackRecordRef` | local record identity；Application ID |
| operation_ref | `BridgeOperationRef` | 原owner op；首次dedup，一次消费复用 |
| action_binding_ref | `ExternalActionBindingRefSlot` | 原action；完整verified资格 |
| verification_ref | `CallbackVerificationRefSlot` | 完整来源责任验证；CallbackVerificationPort |
| owner_action_ref | `OwnerTargetActionRefSlot` | 正式动作；OwnerActionPort |
| one_use_claim | `OneUseClaimRefSlot` | one-use原op关联；初始Missing，Pending必Established |
| protocol_disposition | `ProtocolAckDisposition` | 实际protocol ACK；private entry |
| owner_result | `OwnerActionResultRefSlot` | 同opactual owner结果；初始Missing，actual owner response |
| state | `CallbackHandoffState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn from_verified(callback_ref: CallbackRecordRef, operation_ref: BridgeOperationRef, action_binding_ref: ExternalActionBindingRefSlot, verification_ref: CallbackVerificationRefSlot, owner_action_ref: OwnerTargetActionRefSlot, one_use_claim: OneUseClaimRefSlot, protocol_disposition: ProtocolAckDisposition, owner_result: OwnerActionResultRefSlot, current: QualifiedCallbackContext) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Verified，local_revision=1；action/verification/owner_action三Slot必Established且对应current；one_use和owner_result初始Missing；无敏感context/token；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(callback_ref: CallbackRecordRef, operation_ref: BridgeOperationRef, action_binding_ref: ExternalActionBindingRefSlot, verification_ref: CallbackVerificationRefSlot, owner_action_ref: OwnerTargetActionRefSlot, one_use_claim: OneUseClaimRefSlot, protocol_disposition: ProtocolAckDisposition, owner_result: OwnerActionResultRefSlot, state: CallbackHandoffState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn begin_handoff(&mut self, claim: OneUseClaimRef, qualification: OwnerActionQualificationRef, current: CurrentActionQualification, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 全资格及durable one-use原op接管；Verified -> OwnerPending；三required Slots Established；one-use原action/callback/op一致；Application atomic commit先于owner IO。 |
| 成员 | `pub fn block(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 正式合同或basis不可用；Verified -> Blocked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn reject(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 已verified原记录后发现过期/冲突/跨目标；Verified -> Rejected；初始伪源失败不通过此factory制造Verified。 |
| 成员 | `pub fn apply_owner_result(&mut self, result: OwnerActionResultRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// owner二次核验真实结果；OwnerPending/Indeterminate -> OwnerAccepted/OwnerRejected；Pending只OwnerPending同态字段记录；不在本仓制造Decision。 |
| 成员 | `pub fn mark_unknown(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// owner动作效果未知；OwnerPending -> Indeterminate；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn record_protocol_disposition(&mut self, ack: ProtocolAckDisposition, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 实际ACK字段更新；业务state不变；ACK/defer不升级one-use或owner状态。 |
| 只读成员 | `pub fn callback_ref(&self) -> &CallbackRecordRef` | /// 读取local record identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_ref(&self) -> &BridgeOperationRef` | /// 读取原owner op，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn action_binding_ref(&self) -> &ExternalActionBindingRefSlot` | /// 读取原action，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn verification_ref(&self) -> &CallbackVerificationRefSlot` | /// 读取完整来源责任验证，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn owner_action_ref(&self) -> &OwnerTargetActionRefSlot` | /// 读取正式动作，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn one_use_claim(&self) -> &OneUseClaimRefSlot` | /// 读取one-use原op关联，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn protocol_disposition(&self) -> &ProtocolAckDisposition` | /// 读取实际protocol ACK，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn owner_result(&self) -> &OwnerActionResultRefSlot` | /// 读取同opactual owner结果，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &CallbackHandoffState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的CallbackHandoffState；允许边逐项对照02 Step9，未列边禁止。


### D4草稿与模块停审
两对象factory保持完整Verified/Active输入；one-use原claim新增稳定字段，Claimed对应原callback/op不复活。验证失败entry直接finite拒绝，不制造假的Verified record；owner_pending之前三required Slots和当前Gate/actor/动作状态齐，unknown只同op权威finalize。没有token/response URL/审批正文。能力、字段来源、factory、state边和责任自检pass；下一D5，BR-UP-002/003/008仍open。

## 6. D5 / U5幂等、cursor、gap、lane与恢复

### 问题回答、诊断与取舍
五对象分别拥有local continuity，不造平台全局顺序/投递truth。Dedup同key变义拒绝且窗口到期不许可新execute；cursor stage/stream/epoch独立，权威comparator和coverage缺失不前进；gap未知范围和恢复窗口欠缺必须能安全保留；lane即使释放local claim也保unknown head；recovery只是原op/effect probe和local finalize。补RecoveryWindowRefSlot、Gap原tracking operation、Lane unresolved_head及Unresolved恢复分类，避免伪造窗口/ref/已完成结果。未采用lease/NotFound/队列空当no-effect或coverage。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| U5-C1 | namespace/scope/key/meaning/原op/窗口 | reserve/result/unknown/expired | DedupRecord / local record | ContinuityRepository/Step11/13 |
| U5-C2-position | registered stream/epoch/comparator/coverage | stage-specific ready/advance/incomparable | StreamCursor / local tracker | ContinuityRepository/qualified source |
| U5-C2-gap | 原cursor/未知或已知range/缺口原因 | open/probing/closed/manual | GapRecord / local gap | AuthoritativeRecoveryPort/J03 |
| U5-C3 | scope/dependency/claim/所有rate下界/预算 | ready/held/cooldown/blocked | DispatchLane / local order control | LaneRepository/shared bucket store |
| U5-C4 | 原subject/op/effect/current维护授权/window/probe | requested/probing/resolved/blocked/manual | RecoveryRecord / maintenance record | AuthoritativeRecoveryPort/LocalUoW |


### DedupRecord
归属`continuity/dedup_record.rs`；U5-C1六namespace原操作与原结果去重；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | reserve/rehydrate | Reserved；不可任意caller指定终态 |
| 同key变义Conflict | semantic_identity | `match_meaning` | 任意state纯核 |
| 原op真实结果关联 | same original/actual stored payload | `attach_result` | Reserved/Indeterminate -> ResultRecorded |
| 原跨边界效果未知 | 原operation_effect | `mark_unknown` | Reserved -> Indeterminate |
| 正式去重窗口到期 | retention/basis | `expire` | Reserved/ResultRecorded/Indeterminate -> Expired |

```rust
/// U5-C1六namespace原操作与原结果去重；不拥有owner或平台truth。
pub struct DedupRecord {
    /// local record。
    dedup_ref: DedupRecordRef,
    /// 六namespace及scope。
    namespace_scope: DedupNamespaceScope,
    /// 原technical key。
    idempotency_key: QualifiedIdempotencyKey,
    /// 安全结构含义。
    semantic_identity: BodyFreeOperationMeaningRef,
    /// 原op/effect-kind/ID。
    operation_effect: OriginalOperationEffectRef,
    /// 实际stored结果。
    result_ref: SafeOriginalResultRefSlot,
    /// 去重/恢复有限窗口。
    retention_window: QualifiedRetentionWindowRef,
    /// 本对象业务状态。
    state: DedupState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| dedup_ref | `DedupRecordRef` | local record；Application ID/UoW |
| namespace_scope | `DedupNamespaceScope` | 六namespace及scope；trusted entry/resolver |
| idempotency_key | `QualifiedIdempotencyKey` | 原technical key；原metadata或qualified source |
| semantic_identity | `BodyFreeOperationMeaningRef` | 安全结构含义；对应操作族source/target/version |
| operation_effect | `OriginalOperationEffectRef` | 原op/effect-kind/ID；首次reservation后不改 |
| result_ref | `SafeOriginalResultRefSlot` | 实际stored结果；初始Missing |
| retention_window | `QualifiedRetentionWindowRef` | 去重/恢复有限窗口；formal retention policy |
| state | `DedupState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn reserve(dedup_ref: DedupRecordRef, namespace_scope: DedupNamespaceScope, idempotency_key: QualifiedIdempotencyKey, semantic_identity: BodyFreeOperationMeaningRef, operation_effect: OriginalOperationEffectRef, result_ref: SafeOriginalResultRefSlot, retention_window: QualifiedRetentionWindowRef) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Reserved，local_revision=1；key/retention namespace与scope一致、result Missing；唯一性由LocalUoW原子接管，无body hash；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(dedup_ref: DedupRecordRef, namespace_scope: DedupNamespaceScope, idempotency_key: QualifiedIdempotencyKey, semantic_identity: BodyFreeOperationMeaningRef, operation_effect: OriginalOperationEffectRef, result_ref: SafeOriginalResultRefSlot, retention_window: QualifiedRetentionWindowRef, state: DedupState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn match_meaning(&self, meaning: &BodyFreeOperationMeaningRef) -> Result<(), ContractViolation>` | /// 同key变义Conflict；任意state纯核；zero write；Expired也不允许原key再execute。 |
| 成员 | `pub fn attach_result(&mut self, result: SafeOriginalResultRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 原op真实结果关联；Reserved/Indeterminate -> ResultRecorded；当前可读取资格仍由Application复用时核，不在此授披露。 |
| 成员 | `pub fn mark_unknown(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 原跨边界效果未知；Reserved -> Indeterminate；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn expire(&mut self, basis: RetentionExpiryBasisRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 只J05经qualify_dedup_expiry当前核原row/window/scope及维护authority；原window已到期、proof仍current、local匹配；Reserved/ResultRecorded/Indeterminate -> Expired，local checked next；原key/meaning/op/result/retention不变，保tombstone与未解决原effect，不删记录后盲重执行；guard失败零修改。 |
| 只读成员 | `pub fn dedup_ref(&self) -> &DedupRecordRef` | /// 读取local record，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn namespace_scope(&self) -> &DedupNamespaceScope` | /// 读取六namespace及scope，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn idempotency_key(&self) -> &QualifiedIdempotencyKey` | /// 读取原technical key，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn semantic_identity(&self) -> &BodyFreeOperationMeaningRef` | /// 读取安全结构含义，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_effect(&self) -> &OriginalOperationEffectRef` | /// 读取原op/effect-kind/ID，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn result_ref(&self) -> &SafeOriginalResultRefSlot` | /// 读取实际stored结果，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn retention_window(&self) -> &QualifiedRetentionWindowRef` | /// 读取去重/恢复有限窗口，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &DedupState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的DedupState；允许边逐项对照02 Step9，未列边禁止。


### StreamCursor
归属`continuity/stream_cursor.rs`；U5-C2独立stage流tracker；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | initialize/rehydrate | Ready若current comparator Established，否则Incomparable；不可任意caller指定终态 |
| 可比已覆盖候选推进 | 原position/epoch/comparator/coverage/revision | `advance` | Ready -> Ready |
| 断开/epoch变化保旧position | 原epoch/position | `mark_incomparable` | Ready -> Incomparable |
| 比较资格失效 | comparator_ref | `lose_comparator` | Ready -> Incomparable |
| scope/source/window无资格 | formal basis/reason | `block` | Ready/Incomparable -> Blocked |
| 原epoch完整资格重新成立 | 同原stream/epoch及source coverage | `requalify_same_epoch` | Incomparable/Blocked -> Ready |

```rust
/// U5-C2独立stage流tracker；不拥有owner或平台truth。
pub struct StreamCursor {
    /// local cursor。
    cursor_ref: StreamCursorRef,
    /// stage/stream/安装/scope。
    namespace_stream: CursorNamespaceStream,
    /// 原epoch。
    epoch: QualifiedStreamEpoch,
    /// 原位置/未初始化。
    position: OpaqueStreamPositionSlot,
    /// source比较资格。
    comparator_ref: AuthoritativeComparatorRefSlot,
    /// 本阶段完整覆盖。
    coverage_ref: ContinuityCoverageRefSlot,
    /// cursor专用CAS。
    revision: CursorRevision,
    /// 本对象业务状态。
    state: StreamCursorState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| cursor_ref | `StreamCursorRef` | local cursor；Application ID |
| namespace_stream | `CursorNamespaceStream` | stage/stream/安装/scope；registered source |
| epoch | `QualifiedStreamEpoch` | 原epoch；actual source |
| position | `OpaqueStreamPositionSlot` | 原位置/未初始化；source；initialize Uninitialized |
| comparator_ref | `AuthoritativeComparatorRefSlot` | source比较资格；actual registered comparator/欠缺 |
| coverage_ref | `ContinuityCoverageRefSlot` | 本阶段完整覆盖；initialize Missing，actual local+source证明 |
| revision | `CursorRevision` | cursor专用CAS；初始1，合法推进checked next |
| state | `StreamCursorState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn initialize(cursor_ref: StreamCursorRef, namespace_stream: CursorNamespaceStream, epoch: QualifiedStreamEpoch, position: OpaqueStreamPositionSlot, comparator_ref: AuthoritativeComparatorRefSlot, coverage_ref: ContinuityCoverageRefSlot, revision: CursorRevision, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Ready若current comparator Established，否则Incomparable，local_revision=1；position Uninitialized、coverage Missing、revision1；source epoch/window真实，comparator Missing只能Incomparable；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(cursor_ref: StreamCursorRef, namespace_stream: CursorNamespaceStream, epoch: QualifiedStreamEpoch, position: OpaqueStreamPositionSlot, comparator_ref: AuthoritativeComparatorRefSlot, coverage_ref: ContinuityCoverageRefSlot, revision: CursorRevision, state: StreamCursorState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn advance(&mut self, candidate: ComparablePositionRef, coverage: ContinuityCoverageRef, expected: ExpectedCursorRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 可比已覆盖候选推进；Ready -> Ready；同stage/stream/epoch、candidate.base=current、After且全range已覆盖；Equal纯no-op、Before拒绝，不越gap；cursor/local revision原子更新。 |
| 成员 | `pub fn mark_incomparable(&mut self, change: StreamEpochChangeRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 断开/epoch变化保旧position；Ready -> Incomparable；不替epoch或拼接新session，gap由Application写同UoW。 |
| 成员 | `pub fn lose_comparator(&mut self, basis: QualificationMaintenanceBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 比较资格失效；Ready -> Incomparable；Slot置Stale/Missing，保水位。 |
| 成员 | `pub fn block(&mut self, reason: SafeReasonCode, basis: QualificationMaintenanceBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// scope/source/window无资格；Ready/Incomparable -> Blocked；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn requalify_same_epoch(&mut self, epoch: QualifiedStreamEpoch, comparator: AuthoritativeComparatorRef, coverage: ContinuityCoverageRef, expected: ExpectedCursorRevision, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原epoch完整资格重新成立；Incomparable/Blocked -> Ready；新epoch必须另explicit initialize，不比较跨epoch；不自动推进position。 |
| 只读成员 | `pub fn cursor_ref(&self) -> &StreamCursorRef` | /// 读取local cursor，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn namespace_stream(&self) -> &CursorNamespaceStream` | /// 读取stage/stream/安装/scope，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn epoch(&self) -> &QualifiedStreamEpoch` | /// 读取原epoch，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn position(&self) -> &OpaqueStreamPositionSlot` | /// 读取原位置/未初始化，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn comparator_ref(&self) -> &AuthoritativeComparatorRefSlot` | /// 读取source比较资格，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn coverage_ref(&self) -> &ContinuityCoverageRefSlot` | /// 读取本阶段完整覆盖，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn revision(&self) -> &CursorRevision` | /// 读取cursor专用CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &StreamCursorState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的StreamCursorState；允许边逐项对照02 Step9，未列边禁止。


### GapRecord
归属`continuity/gap_record.rs`；U5-C2/C4保留原安全缺口；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | detect/rehydrate | Open；不可任意caller指定终态 |
| 同gap/range受权probe接管 | current comparator/source/window/budget及原tracking op | `begin_probe` | Open/Manual -> Probing |
| actual完整覆盖原缺口 | same gap/range/stream/epoch | `close` | Probing -> Closed |
| 权威结果仍有未覆盖范围 | same gap/range actual result | `retain_uncovered` | Probing -> Open |
| 缺source/window/comparator或不可判 | finite reason | `require_manual` | Open/Probing -> Manual |

```rust
/// U5-C2/C4保留原安全缺口；不拥有owner或平台truth。
pub struct GapRecord {
    /// local gap。
    gap_ref: GapRef,
    /// 原cursor。
    cursor_ref: StreamCursorRef,
    /// 原gap tracking op。
    operation_ref: BridgeOperationRef,
    /// known/unknown原range。
    range_ref: QualifiedGapRangeRef,
    /// 有限缺口原因。
    reason: SafeGapReason,
    /// actual完整coverage。
    coverage_ref: AuthoritativeCoverageRefSlot,
    /// 原受权恢复记录。
    recovery_ref: RecoveryRecordRefSlot,
    /// 恢复window或欠缺。
    window_basis: RecoveryWindowRefSlot,
    /// 本对象业务状态。
    state: GapState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| gap_ref | `GapRef` | local gap；Application技术ID |
| cursor_ref | `StreamCursorRef` | 原cursor；existing read |
| operation_ref | `BridgeOperationRef` | 原gap tracking op；detect同UoW local-only技术op，恢复不换 |
| range_ref | `QualifiedGapRangeRef` | known/unknown原range；qualified source比较/actual local disconnect |
| reason | `SafeGapReason` | 有限缺口原因；adapter/source |
| coverage_ref | `AuthoritativeCoverageRefSlot` | actual完整coverage；初始Missing |
| recovery_ref | `RecoveryRecordRefSlot` | 原受权恢复记录；初始Missing/真实同subject计划 |
| window_basis | `RecoveryWindowRefSlot` | 恢复window或欠缺；formal source；Missing可安全保gap |
| state | `GapState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn detect(gap_ref: GapRef, cursor_ref: StreamCursorRef, operation_ref: BridgeOperationRef, range_ref: QualifiedGapRangeRef, reason: SafeGapReason, coverage_ref: AuthoritativeCoverageRefSlot, recovery_ref: RecoveryRecordRefSlot, window_basis: RecoveryWindowRefSlot) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Open，local_revision=1；原cursor/range对应，coverage Missing；window欠缺不能probe但能保留Open，operation是实际local-onlytracking，不是外部成功；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(gap_ref: GapRef, cursor_ref: StreamCursorRef, operation_ref: BridgeOperationRef, range_ref: QualifiedGapRangeRef, reason: SafeGapReason, coverage_ref: AuthoritativeCoverageRefSlot, recovery_ref: RecoveryRecordRefSlot, window_basis: RecoveryWindowRefSlot, state: GapState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn begin_probe(&mut self, recovery: RecoveryRecordRef, qualification: RecoveryQualificationRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 同gap/range受权probe接管；Open/Manual -> Probing；Manual须显式新维护授权；不可改变range/epoch，真实window建立Slot。 |
| 成员 | `pub fn attach_recovery(&mut self, recovery: RecoveryRecordRef, original: OriginalOperationEffectRef, basis: RecoveryAuthorizationRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// Open/Manual同态；原gap/tracking op/source/range/current申请依据一致，Missing -> Established(recovery)；已有同ref零变化、不同ref Conflict；只在C06同UoW与原RecoveryRecord关联，不签probe资格、不换epoch/range。 |
| 成员 | `pub fn close(&mut self, coverage: AuthoritativeCoverageRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// actual完整覆盖原缺口；Probing -> Closed；Unknown range需source对原gap明确完整性证明，不以count/empty推断。 |
| 成员 | `pub fn retain_uncovered(&mut self, probe: AuthoritativeProbeResultRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 权威结果仍有未覆盖范围；Probing -> Open；保原gap/range；不以部分coverage关闭。 |
| 成员 | `pub fn require_manual(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 缺source/window/comparator或不可判；Open/Probing -> Manual；不伪造已恢复、窗口或丢弃缺口。 |
| 只读成员 | `pub fn gap_ref(&self) -> &GapRef` | /// 读取local gap，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn cursor_ref(&self) -> &StreamCursorRef` | /// 读取原cursor，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_ref(&self) -> &BridgeOperationRef` | /// 读取原gap tracking op，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn range_ref(&self) -> &QualifiedGapRangeRef` | /// 读取known/unknown原range，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn reason(&self) -> &SafeGapReason` | /// 读取有限缺口原因，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn coverage_ref(&self) -> &AuthoritativeCoverageRefSlot` | /// 读取actual完整coverage，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn recovery_ref(&self) -> &RecoveryRecordRefSlot` | /// 读取原受权恢复记录，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn window_basis(&self) -> &RecoveryWindowRefSlot` | /// 读取恢复window或欠缺，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &GapState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的GapState；允许边逐项对照02 Step9，未列边禁止。



### DispatchLane
归属`continuity/dispatch_lane.rs`；U5-C3局部顺序与共享rate下界；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | for_scope/rehydrate | Ready；不可任意caller指定终态 |
| 同原intent/current scope/预算/依赖原子claim | 全字段/current qualification | `claim` | Ready -> Held |
| 合并所有scope下界不缩短 | 原bounds/claim/same-attempt实际release | `apply_bounds` | Held/Ready -> Cooldown |
| 只释放本地原claim | claim_fence/原attempt | `release` | Held -> Ready；Unknown/dependency未立则Held -> Blocked |
| scope/window/dependency失效 | formal current失效依据 | `block` | Ready/Held/Cooldown -> Blocked |
| 全部平台下界到期且current资格仍成立 | 完整bounds/budget/current | `finish_cooldown` | Cooldown -> Ready |
| 原scope/依赖/current资格显式恢复 | 原head actual probe/当前全部资格 | `restore_ready` | Blocked -> Ready |

```rust
/// U5-C3局部顺序与共享rate下界；不拥有owner或平台truth。
pub struct DispatchLane {
    /// local lane。
    lane_ref: DispatchLaneRef,
    /// 明确order/resource/scope。
    order_scope: QualifiedLaneOrderScope,
    /// 原create/thread依赖。
    head_dependency: DeliveryDependencyRefSlot,
    /// 当前本地claim。
    claim_fence: FencedClaimRefSlot,
    /// 释放后仍未知的原head。
    unresolved_head: Option<AttemptEffectRef>,
    /// 全部适用下界向量。
    rate_bounds: QualifiedRateLimitBoundSet,
    /// 原scope窗口内预算。
    retry_budget: RetryBudgetRef,
    /// lane专用CAS。
    revision: LaneRevision,
    /// 本对象业务状态。
    state: DispatchLaneState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| lane_ref | `DispatchLaneRef` | local lane；Application ID/UoW |
| order_scope | `QualifiedLaneOrderScope` | 明确order/resource/scope；qualified mapping/adapter |
| head_dependency | `DeliveryDependencyRefSlot` | 原create/thread依赖；known mapping或formal NotRequired |
| claim_fence | `FencedClaimRefSlot` | 当前本地claim；初始Missing，Held必Established |
| unresolved_head | `Option<AttemptEffectRef>` | 释放后仍未知的原head；初始None；actual unknown原attempt不能越过 |
| rate_bounds | `QualifiedRateLimitBoundSet` | 全部适用下界向量；current rate authority/actual响应 |
| retry_budget | `RetryBudgetRef` | 原scope窗口内预算；qualified policy及store actual usage |
| revision | `LaneRevision` | lane专用CAS；初始1；同UoW checked next |
| state | `DispatchLaneState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn for_scope(lane_ref: DispatchLaneRef, order_scope: QualifiedLaneOrderScope, head_dependency: DeliveryDependencyRefSlot, claim_fence: FencedClaimRefSlot, unresolved_head: Option<AttemptEffectRef>, rate_bounds: QualifiedRateLimitBoundSet, retry_budget: RetryBudgetRef, revision: LaneRevision, rate_basis: RateLimitQualificationRef) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Ready，local_revision=1；claim Missing、unresolved_head None、revision1；initial dependency与rate/source完整，不以缺adapter资格构造Ready；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(lane_ref: DispatchLaneRef, order_scope: QualifiedLaneOrderScope, head_dependency: DeliveryDependencyRefSlot, claim_fence: FencedClaimRefSlot, unresolved_head: Option<AttemptEffectRef>, rate_bounds: QualifiedRateLimitBoundSet, retry_budget: RetryBudgetRef, revision: LaneRevision, state: DispatchLaneState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn claim(&mut self, intent: DeliveryIntentRef, qualification: DispatchEligibilityRef, claim: FencedClaimRef, expected: ExpectedLaneRevision, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 同原intent/current scope/预算/依赖原子claim；Ready -> Held；unresolved_head必须None；head依赖满足且所有下界到；fence原lane/intent/attempt一致，IO须actual durable proof。 |
| 成员 | `pub fn apply_bounds(&mut self, bounds: QualifiedRateLimitBoundSet, release: Option<LocalAttemptDispositionRef>, expected: ExpectedLaneRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 合并所有scope下界不缩短；Held/Ready -> Cooldown；Held须给same claim实际处置，Unknown保unresolved_head；budget不能因lease/等待重置。 |
| 成员 | `pub fn release(&mut self, disposition: LocalAttemptDispositionRef, expected: ExpectedLaneRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 只释放本地原claim；Held -> Ready；Unknown/dependency未立则Held -> Blocked；clear current claim；Unknown保unresolved_head并阻candidate，不能将lease过期分类NoIo。 |
| 成员 | `pub fn block(&mut self, basis: QualificationMaintenanceBasisRef, reason: SafeReasonCode, expected: ExpectedLaneRevision, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// scope/window/dependency失效；Ready/Held/Cooldown -> Blocked；已可能IO保原claim/unknown，禁止重新claim。 |
| 成员 | `pub fn finish_cooldown(&mut self, current: DispatchEligibilityRef, expected: ExpectedLaneRevision, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 全部平台下界到期且current资格仍成立；Cooldown -> Ready；unresolved_head必须None；无旧未处理claim；不由config缩短等待。 |
| 成员 | `pub fn restore_ready(&mut self, current: DispatchEligibilityRef, resolved_head: Option<AuthoritativeProbeResultRef>, expected: ExpectedLaneRevision, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原scope/依赖/current资格显式恢复；Blocked -> Ready；存在unresolved_head须同原attempt/effect权威已知或no-effect结果并由Application先finalize；Unknown/Unavailable不可清除。 |
| 只读成员 | `pub fn lane_ref(&self) -> &DispatchLaneRef` | /// 读取local lane，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn order_scope(&self) -> &QualifiedLaneOrderScope` | /// 读取明确order/resource/scope，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn head_dependency(&self) -> &DeliveryDependencyRefSlot` | /// 读取原create/thread依赖，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn claim_fence(&self) -> &FencedClaimRefSlot` | /// 读取当前本地claim，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn unresolved_head(&self) -> &Option<AttemptEffectRef>` | /// 读取释放后仍未知的原head，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn rate_bounds(&self) -> &QualifiedRateLimitBoundSet` | /// 读取全部适用下界向量，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn retry_budget(&self) -> &RetryBudgetRef` | /// 读取原scope窗口内预算，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn revision(&self) -> &LaneRevision` | /// 读取lane专用CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &DispatchLaneState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的DispatchLaneState；允许边逐项对照02 Step9，未列边禁止。


### RecoveryRecord
归属`continuity/recovery_record.rs`；U5-C4原subject/op/effect受权维护；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | request/rehydrate | Requested；不可任意caller指定终态 |
| 同原subject/op当前scope/window/source/预算probe | current资格/authorization_basis | `begin_probe` | Requested/Manual/Blocked -> Probing |
| actual原op已知结果/完整coverage/明确受限同effect资格 | probe same subject/op/effect及结果类别 | `resolve` | Probing -> Resolved |
| scope/basis失效停止probe | formal失效依据 | `block` | Requested/Probing -> Blocked |
| 来源/窗口缺失或仍未知 | finite reason | `require_manual` | Requested/Probing -> Manual |

```rust
/// U5-C4原subject/op/effect受权维护；不拥有owner或平台truth。
pub struct RecoveryRecord {
    /// local recovery identity。
    recovery_ref: RecoveryRecordRef,
    /// 既有原subject。
    original_subject: OriginalRecoverableSubjectRef,
    /// 原op/effect-kind/ID。
    operation_effect: OriginalOperationEffectRef,
    /// 显式受权恢复依据。
    authorization_basis: RecoveryAuthorizationRef,
    /// probe current资格或缺口。
    qualification_ref: RecoveryQualificationRefSlot,
    /// 实际权威结果或未知。
    probe_result: AuthoritativeProbeResultRefSlot,
    /// 实际恢复结论。
    resolution_kind: SafeRecoveryResolutionKind,
    /// 有限reason。
    safe_reason: SafeReasonCode,
    /// 本对象业务状态。
    state: RecoveryState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| recovery_ref | `RecoveryRecordRef` | local recovery identity；Application技术ID |
| original_subject | `OriginalRecoverableSubjectRef` | 既有原subject；受权snapshot，不新造external实体 |
| operation_effect | `OriginalOperationEffectRef` | 原op/effect-kind/ID；same existing record |
| authorization_basis | `RecoveryAuthorizationRef` | 显式受权恢复依据；当前Policy/Gate维护授权 |
| qualification_ref | `RecoveryQualificationRefSlot` | probe current资格或缺口；初始Missing |
| probe_result | `AuthoritativeProbeResultRefSlot` | 实际权威结果或未知；初始Missing |
| resolution_kind | `SafeRecoveryResolutionKind` | 实际恢复结论；initial Unresolved；actual probe后确定 |
| safe_reason | `SafeReasonCode` | 有限reason；safe mapper |
| state | `RecoveryState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn request(recovery_ref: RecoveryRecordRef, original_subject: OriginalRecoverableSubjectRef, operation_effect: OriginalOperationEffectRef, authorization_basis: RecoveryAuthorizationRef, qualification_ref: RecoveryQualificationRefSlot, probe_result: AuthoritativeProbeResultRefSlot, resolution_kind: SafeRecoveryResolutionKind, safe_reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Requested，local_revision=1；原subject/op/effect已存在；authorization真实但不代表probe source就绪；qualification/probe Missing、resolution Unresolved；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(recovery_ref: RecoveryRecordRef, original_subject: OriginalRecoverableSubjectRef, operation_effect: OriginalOperationEffectRef, authorization_basis: RecoveryAuthorizationRef, qualification_ref: RecoveryQualificationRefSlot, probe_result: AuthoritativeProbeResultRefSlot, resolution_kind: SafeRecoveryResolutionKind, safe_reason: SafeReasonCode, state: RecoveryState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn begin_probe(&mut self, qualification: RecoveryQualificationRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 同原subject/op当前scope/window/source/预算probe；Requested/Manual/Blocked -> Probing；Manual/Blocked必须显式授权重新建立，原effect/range不换；只probe无send。 |
| 成员 | `pub fn resolve(&mut self, result: AuthoritativeProbeResultRef, kind: SafeRecoveryResolutionKind, retry: Option<RetryEligibilityRef>, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// actual原op已知结果/完整coverage/明确受限同effect资格；Probing -> Resolved；FinalizeOnly需actual known；GapCovered需full原range；SameEffectRetryEligible需no-effect及当前全部资格；Unknown/Unavailable/Unresolved/Manual不能Resolved。 |
| 成员 | `pub fn block(&mut self, basis: QualificationMaintenanceBasisRef, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// scope/basis失效停止probe；Requested/Probing -> Blocked；保原subject/op/effect，kind不伪造resolved。 |
| 成员 | `pub fn require_manual(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 来源/窗口缺失或仍未知；Requested/Probing -> Manual；resolution_kind=Manual，不修owner或平台truth。 |
| 只读成员 | `pub fn recovery_ref(&self) -> &RecoveryRecordRef` | /// 读取local recovery identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn original_subject(&self) -> &OriginalRecoverableSubjectRef` | /// 读取既有原subject，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_effect(&self) -> &OriginalOperationEffectRef` | /// 读取原op/effect-kind/ID，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn authorization_basis(&self) -> &RecoveryAuthorizationRef` | /// 读取显式受权恢复依据，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn qualification_ref(&self) -> &RecoveryQualificationRefSlot` | /// 读取probe current资格或缺口，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn probe_result(&self) -> &AuthoritativeProbeResultRefSlot` | /// 读取实际权威结果或未知，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn resolution_kind(&self) -> &SafeRecoveryResolutionKind` | /// 读取实际恢复结论，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn safe_reason(&self) -> &SafeReasonCode` | /// 读取有限reason，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &RecoveryState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的RecoveryState；允许边逐项对照02 Step9，未列边禁止。

### D5草稿与模块停审
五对象已独立闭口：namespace-key-meaning-original result，stage-stream-epoch-position-comparator-coverage，原gap/range与窗口欠缺，lane original head/claim和多scope等待下界，原subject只读probe/finalize。恢复Unresolved补齐初态；Gap窗口Slot保未知；lane释放Unknown不清head，shared bucket下界仍由LaneRepository跨lane原子合并；Domain无SDK retry。17允许边中本组五机均逐条有typed方法承接；factory/field/required状态/边界自检pass，下一D6；BR-UP-007/008/009保留。

## 7. D6 / U6安全mutation历史与canonical交接

### 问题回答、诊断与取舍
SafeAuditRecord是不变mutation阶段材料，不是evidence；SafeHandoffRecord只在actual canonical/schema/admission具备才创建。缺mandatory条件先阻对应mutation/IO，不制造empty canonical或每次变更outbox；Query不产生这两对象。采用同UoW唯一producer与独立consumer分类；unknown只有原handoff op权威probe/no-effect+current准入可再交。BridgeLocalView唯一在Contracts，Domain无view副本。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| U6-C1 | real mutation、获准安全subject/basis/stage/trace/schema | immutable local audit | SafeAuditRecord / safe history | SafeTraceRepository/LocalUoW/Step15 |
| U6-C2 | real canonical/准入/原op/window、actual consumer结果 | pending/dispatch/accepted/rejected/unknown | SafeHandoffRecord / local handoff | SafeObservationPort/Repository/J04 |
| U6-C3 | 既有snapshot/current read qualification | filtered view，Domain无新增对象 | Contracts BridgeLocalView，Application projector | SafeReadQualificationPort/Step8/9 |


### SafeAuditRecord
归属`traceability/safe_audit_record.rs`；U6-C1真实local mutation安全不变历史；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | from_mutation/rehydrate | 无业务state；immutable local_revision=1；不可任意caller指定终态 |
| 仅当前允许该主语及stage的安全记录读取 | 原stage/source scope与read.disclosure | `safe_summary` | 不适用，immutable |

```rust
/// U6-C1真实local mutation安全不变历史；不拥有owner或平台truth。
pub struct SafeAuditRecord {
    /// local audit identity。
    audit_ref: SafeAuditRef,
    /// 真实local变更。
    mutation_ref: LocalMutationRef,
    /// 原operation。
    operation_ref: BridgeOperationRef,
    /// 获准record主语。
    subject_refs: AuthorizedSafeSubjectRefSet,
    /// 真实stage及finite reason。
    stage_reason: SafeStageReason,
    /// 安全依据集合。
    basis_refs: SafeBasisRefSet,
    /// 原可信trace。
    trace_ref: TrustedTraceRef,
    /// producer schema版本。
    producer_revision: SafeProducerSchemaRevision,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| audit_ref | `SafeAuditRef` | local audit identity；Application ID/UoW |
| mutation_ref | `LocalMutationRef` | 真实local变更；same UoW reservation/实际提交，不是外部事实 |
| operation_ref | `BridgeOperationRef` | 原operation；same mutation |
| subject_refs | `AuthorizedSafeSubjectRefSet` | 获准record主语；producer policy current |
| stage_reason | `SafeStageReason` | 真实stage及finite reason；实际本地变更 |
| basis_refs | `SafeBasisRefSet` | 安全依据集合；same policy/qualified sources |
| trace_ref | `TrustedTraceRef` | 原可信trace；metadata |
| producer_revision | `SafeProducerSchemaRevision` | producer schema版本；actual registered schema |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn from_mutation(audit_ref: SafeAuditRef, mutation_ref: LocalMutationRef, operation_ref: BridgeOperationRef, subject_refs: AuthorizedSafeSubjectRefSet, stage_reason: SafeStageReason, basis_refs: SafeBasisRefSet, trace_ref: TrustedTraceRef, producer_revision: SafeProducerSchemaRevision, material: BodyFreeMutationMaterial) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；无业务state；immutable local_revision=1，local_revision=1；material全部获准fields与上述一一对应；同mutation唯一audit，只有same UoW commit才成为local truth；不构造evidence/report；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(audit_ref: SafeAuditRef, mutation_ref: LocalMutationRef, operation_ref: BridgeOperationRef, subject_refs: AuthorizedSafeSubjectRefSet, stage_reason: SafeStageReason, basis_refs: SafeBasisRefSet, trace_ref: TrustedTraceRef, producer_revision: SafeProducerSchemaRevision, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn safe_summary(&self, read: &CurrentReadQualification, now: SafeInstant) -> Result<&SafeStageReason, ContractViolation>` | /// 仅当前允许该主语及stage的安全记录读取；不适用，immutable；不授权全部字段；Application再做visible refs/count过滤；zero mutation/IO。 |
| 只读成员 | `pub fn audit_ref(&self) -> &SafeAuditRef` | /// 读取local audit identity，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn mutation_ref(&self) -> &LocalMutationRef` | /// 读取真实local变更，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_ref(&self) -> &BridgeOperationRef` | /// 读取原operation，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn subject_refs(&self) -> &AuthorizedSafeSubjectRefSet` | /// 读取获准record主语，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn stage_reason(&self) -> &SafeStageReason` | /// 读取真实stage及finite reason，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn basis_refs(&self) -> &SafeBasisRefSet` | /// 读取安全依据集合，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn trace_ref(&self) -> &TrustedTraceRef` | /// 读取原可信trace，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn producer_revision(&self) -> &SafeProducerSchemaRevision` | /// 读取producer schema版本，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。无独立业务state；local_revision首次1固定，immutable对象不提供setter。


### SafeHandoffRecord
归属`traceability/safe_handoff_record.rs`；U6-C2canonical材料原consumer交接；纯local Domain对象。

| 能力 | 必需字段 | factory / 成员 | 状态约束 |
|---|---|---|---|
| 创建/结构重建 | 下列全字段 | from_canonical/rehydrate | Pending；不可任意caller指定终态 |
| 原canonical/准入/window原op claim | 全field/current actual资格 | `begin_handoff` | Pending -> Dispatching |
| 正式同handoff op结果finalize | actual consumer/source/op | `apply_consumer_result` | Dispatching/Indeterminate -> ConsumerAccepted/ConsumerRejected |
| consumer效果未知 | 原material/op/claim保留 | `mark_unknown` | Dispatching -> Indeterminate |
| 准入/schema/material失效 | current失效basis | `block` | Pending/Dispatching -> Blocked |
| 原材料/op合法且明确未接纳 | same original权威no-effect及current | `resume_pending` | Indeterminate/Blocked -> Pending |

```rust
/// U6-C2canonical材料原consumer交接；不拥有owner或平台truth。
pub struct SafeHandoffRecord {
    /// local handoff。
    handoff_ref: SafeHandoffRef,
    /// 真实唯一producer。
    source_audit_ref: SafeAuditRef,
    /// actual canonical/schema引用。
    canonical_material_ref: CanonicalSafeMaterialRef,
    /// 正式consumer准入。
    producer_admission: ProducerAdmissionRef,
    /// handoff namespace原op。
    operation_ref: BridgeOperationRef,
    /// actual consumer分类。
    consumer_result: ConsumerDispositionRefSlot,
    /// 准入交接有限窗口。
    retention_window: QualifiedRetentionWindowRef,
    /// 原本地交接claim。
    claim: QualificationSlot<SafeHandoffClaimRef>,
    /// canonical精确schema。
    producer_revision: SafeProducerSchemaRevision,
    /// 本对象业务状态。
    state: SafeHandoffState,
    /// 技术local CAS版本。
    local_revision: LocalRevision,
}
```
| 字段 | 类型 | 约束 / 进入来源 |
|---|---|---|
| handoff_ref | `SafeHandoffRef` | local handoff；Application ID/UoW |
| source_audit_ref | `SafeAuditRef` | 真实唯一producer；existing mutation audit |
| canonical_material_ref | `CanonicalSafeMaterialRef` | actual canonical/schema引用；SafeObservationPort，不存body |
| producer_admission | `ProducerAdmissionRef` | 正式consumer准入；Observability current |
| operation_ref | `BridgeOperationRef` | handoff namespace原op；首次reservation不换 |
| consumer_result | `ConsumerDispositionRefSlot` | actual consumer分类；初始Missing |
| retention_window | `QualifiedRetentionWindowRef` | 准入交接有限窗口；formal policy |
| claim | `QualificationSlot<SafeHandoffClaimRef>` | 原本地交接claim；初始Missing，Dispatching Established |
| producer_revision | `SafeProducerSchemaRevision` | canonical精确schema；actual producer contract |
| state | `SafeHandoffState` | 本对象业务状态；factory固定初态；hydrate只取实际local store |
| local_revision | `LocalRevision` | 技术local CAS版本；首次固定1；后续actual local UoW |

| 类别 | 完整签名 | 中文Rustdoc / 副作用及guard |
|---|---|---|
| 工厂 | `pub fn from_canonical(handoff_ref: SafeHandoffRef, source_audit_ref: SafeAuditRef, canonical_material_ref: CanonicalSafeMaterialRef, producer_admission: ProducerAdmissionRef, operation_ref: BridgeOperationRef, consumer_result: ConsumerDispositionRefSlot, retention_window: QualifiedRetentionWindowRef, claim: QualificationSlot<SafeHandoffClaimRef>, producer_revision: SafeProducerSchemaRevision, current: CurrentSafeHandoffQualification, now: SafeInstant) -> Result<Self, ContractViolation>` | /// 全部业务字段显式输入；Pending，local_revision=1；current原handoff/audit/material/op/schema/窗口一致，consumer/claim初始Missing；没有canonical/admission不构造对象；零IO，不mint ref/clock。 |
| 重建 | `pub fn rehydrate(handoff_ref: SafeHandoffRef, source_audit_ref: SafeAuditRef, canonical_material_ref: CanonicalSafeMaterialRef, producer_admission: ProducerAdmissionRef, operation_ref: BridgeOperationRef, consumer_result: ConsumerDispositionRefSlot, retention_window: QualifiedRetentionWindowRef, claim: QualificationSlot<SafeHandoffClaimRef>, producer_revision: SafeProducerSchemaRevision, state: SafeHandoffState, local_revision: LocalRevision, stored: LocalHydrationBasisRef) -> Result<Self, ContractViolation>` | /// 同subject/revision的LocalHydrationBasisRef下完整重建；检查stored字段与state-required结构，不重新授权限；无副作用。 |
| 成员 | `pub fn begin_handoff(&mut self, current: CurrentSafeHandoffQualification, claim: SafeHandoffClaimRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原canonical/准入/window原op claim；Pending -> Dispatching；Application先durable此阶段，再外部consumer IO；不造empty payload。 |
| 成员 | `pub fn apply_consumer_result(&mut self, result: ConsumerDispositionRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 正式同handoff op结果finalize；Dispatching/Indeterminate -> ConsumerAccepted/ConsumerRejected；Pending只Dispatching同态record；不是transport ACK/evidence/verdict。 |
| 成员 | `pub fn mark_unknown(&mut self, reason: SafeReasonCode, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// consumer效果未知；Dispatching -> Indeterminate；所有guard先通过，才纯内存修改与checked local_revision递增；未列边拒绝。 |
| 成员 | `pub fn block(&mut self, reason: SafeReasonCode, basis: QualificationMaintenanceBasisRef, local: ExpectedLocalRevision) -> Result<(), ContractViolation>` | /// 准入/schema/material失效；Pending/Dispatching -> Blocked；已有IO unknown仍保原claim，不默认重交。 |
| 成员 | `pub fn resume_pending(&mut self, current: CurrentSafeHandoffQualification, no_effect: NoEffectBasisRef, local: ExpectedLocalRevision, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原材料/op合法且明确未接纳；Indeterminate/Blocked -> Pending；schema/current admission真实且原canonical不变；timeout/日志/NotFound不能证明未收。 |
| 只读成员 | `pub fn handoff_ref(&self) -> &SafeHandoffRef` | /// 读取local handoff，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn source_audit_ref(&self) -> &SafeAuditRef` | /// 读取真实唯一producer，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn canonical_material_ref(&self) -> &CanonicalSafeMaterialRef` | /// 读取actual canonical/schema引用，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn producer_admission(&self) -> &ProducerAdmissionRef` | /// 读取正式consumer准入，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn operation_ref(&self) -> &BridgeOperationRef` | /// 读取handoff namespace原op，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn consumer_result(&self) -> &ConsumerDispositionRefSlot` | /// 读取actual consumer分类，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn retention_window(&self) -> &QualifiedRetentionWindowRef` | /// 读取准入交接有限窗口，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn claim(&self) -> &QualificationSlot<SafeHandoffClaimRef>` | /// 读取原本地交接claim，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn producer_revision(&self) -> &SafeProducerSchemaRevision` | /// 读取canonical精确schema，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn state(&self) -> &SafeHandoffState` | /// 读取本对象局部state，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |
| 只读成员 | `pub fn local_revision(&self) -> &LocalRevision` | /// 读取该对象local CAS，不授执行/披露资格；Application当前visibility过滤后才可输出；零IO/修改。 |

不变量：字段私有；失败零修改；state迁移只下列边，成功内存变化仍须Application同UoW CAS/result/audit/conditional canonical提交才成为local truth。reconstruction不是执行资格，所有IO前正式current ports再核。状态enum唯一见Contracts的SafeHandoffState；允许边逐项对照02 Step9，未列边禁止。

### D6草稿与模块停审
Audit唯一实际mutation安全材料，immutable无独立state，stage/read资格不能默认全字段披露；Contracts补ReadDisclosureRules使view/count边界稳定。Handoff只actual canonical/schema/admission，原consumer op不换，Blocked/Unknown重交必须明确no-effect及完整current条件，不把accepted当evidence。两卡factory/来源/状态/边界自检pass。D1~D6全部完成，19Domain模型及17state主语完整；唯一BridgeLocalView在Contracts，下一只Application载体模块。

<!-- step06-domain-tail -->
