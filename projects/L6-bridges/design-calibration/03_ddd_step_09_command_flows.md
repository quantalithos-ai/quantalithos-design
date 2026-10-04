# L6-bridges 03 Step9：Command独立处理流

仅六个既有Application command；逐流追加与停审。下文代码是数据流伪代码，不是实现或编译证明。省略的绑定来自各流构造表，所有tx内Result失败立即进入唯一rollback分支；共享审计/seed/条件handoff与actual result规则见[共享合同](03_ddd_step_09_shared_flow_contracts.md)§4~6，不生成新helper。

Step13最小补口：C01/C02/C03/C05在G0查原key/结果前调用对应Input.canonical_meaning，再由LocalUnitOfWorkPort.qualify_meaning核完整typed语义。四成员全签名和逐字段来源见Step7 callables§10；得到ManagementBody的四payload完整原Request，保安装/原binding、local CAS及maintenance/revocation、parent/origin/known_result和初绑四字段。leaf Configuration/Binding/Mapping/Callback不能替代完整body，C05不得掺fresh action ID；后续Domain factory/读取/事务/结果及原19业务入口不变。

## 1. C01 ConfigureBridgeInstallation

### 1.1 入口与目标

入口：ManagementDispatcher::Configure -> `ConfigureInstallationInput::from_parts(context, installation, action, draft, config_expected, local_expected)` -> `ConfigureBridgeInstallation::execute(input, control)`；仓内签名沿Step7 callables§5。模块Application/U1；目标BridgeInstallation。

问题/来源：[Step8§2](03_ddd_step_08_command_protocols.md)、Step6 Domain BridgeInstallation、Step7 InstallationRepository/ConfigQualificationPort/UoW。诊断：Configure不能等同永远None，显式重启也不等ApplyRevision；config/local版本不可相互代替。采用Step8精确动作分支，不采用Active覆盖、自动资格建立或secret解析。Step7的Configure-only-None泛述按当步精确消费限定，不回改前序。

| DTO/input -> 对象参数全集 | 来源、动作guard与缺失出口 |
|---|---|
| context四字段 | actual host actor/metadata/authority/trace；key仅metadata.request，不能正文/trace派生 |
| installation/action/config_expected/local_expected | 初建None/Configure/None/Absent；重启Some/Configure/Some/Present；其他动作Some/Some/Present，不默换CAS |
| draft七字段namespace/platform_kind/revision/capability/secret_binding/route_policy/basis | qualify_draft输出的完整受核safe draft；初建revision1，existing checked next；只opaque refs，无secret值 |
| configure九参 | UoW技术installation ID + 上述七字段 + InstallationQualificationRefSlot::Missing；Configured/local1 |
| apply_revision三参 | 原完整行 + qualified draft、actual config expected、actual local expected |
| suspend/restart_configured/retire三参 | 原完整行 + qualified draft.basis、config expected、local expected；稳定设置与actual原行相同，不能隐式替换配置 |
| read/expected/key/meaning/原operation | 初建已核配置basis+host authority形成受权namespace BridgeLocalReadPurpose::Command读；existing先subject授权。meaning含五DTO字段全部stable含义；原dedup/result优先，Absent唯一初建，Present完整baseline |

### 1.2 函数级调用图：ConfigureBridgeInstallation

```text
[API ManagementDispatcher]
  | call Input.from_parts -> ConfigureBridgeInstallation.execute
  v
[ConfigQualificationPort + InstallationRepository]
  | call qualify_draft
  | query find_by_namespace (create) or get (existing)
  | query original dedup/result; call compare_expected
  v
[BridgeInstallation]
  | call configure or apply_revision/suspend/restart_configured/retire
  v
[LocalUnitOfWorkPort + InstallationRepository + safe trace]
  | tx begin; save stage + dedup; append audit/result/conditional handoff
  | call seal_plan; tx commit or rollback
  v
[SafeReadQualificationPort + actual repository snapshot]
  | query actual result; call LocalViewProjector.project
  | return local result only; zero platform/secret IO
```

关键说明：

- 配置资格与双轴CAS在事务外准备，实际提交只证明本地配置变化。
- 初建、显式重启和其他动作排他；图不授平台运行、secret解析或发送资格。

### 1.3 关键伪代码

```rust
// [ConfigQualificationPort.qualify_draft(InstallationConfigDraft draft, ConfigurationMutationKind action, Option<ExpectedConfigRevision> expected, ActorRef actor, BridgeCallControl control)]
let qualified = config.qualify_draft(&draft, action, config_expected.as_ref(), &actor, control).await?;
// Established分支才继续；正式basis不建立即拒绝。read/session按1.1构造，不对初建调用不存在subject。
// [InstallationRepository.find_by_namespace(InstallationNamespace namespace, BridgeLocalReadSession read, BridgeCallControl control)]
let existing_namespace = installations.find_by_namespace(&namespace, &session, control).await?;
// [InstallationRepository.get(BridgeInstallationRef installation, BridgeLocalReadSession read, BridgeCallControl control)]
let existing = /* Some定位时才调用 */ installations.get(&installation_ref, &session, control).await?;
// 原key/meaning/current与G0§4逐名读取；已提交同义结果返回，不能重复配置。
// [BridgeInstallation.configure(BridgeInstallationRef installation_ref, InstallationNamespace namespace, PlatformKind platform_kind, ConfigRevision config_revision, CapabilitySnapshotRef capability_ref, OpaqueSecretBindingRef secret_binding, RoutePolicyRef route_policy, ConfigurationBasisRef configuration_basis, InstallationQualificationRefSlot qualification)]
let candidate = /* only actual absent */ BridgeInstallation::configure(new_ref, namespace, platform_kind, revision, capability, secret_binding, route_policy, basis, InstallationQualificationRefSlot::Missing)?;
// existing独占分支，不执行上方初建factory；从完整row移出候选并穷尽动作。
match action {
    ConfigurationMutationKind::ApplyRevision => {
        // [BridgeInstallation.apply_revision(InstallationConfigDraft draft, ExpectedConfigRevision expected, ExpectedLocalRevision local)]
        candidate.apply_revision(qualified_draft, config_cas, local_cas)?;
    }
    ConfigurationMutationKind::Configure => {
        // [BridgeInstallation.restart_configured(ConfigurationBasisRef basis, ExpectedConfigRevision expected, ExpectedLocalRevision local)]
        candidate.restart_configured(basis, config_cas, local_cas)?;
    }
    ConfigurationMutationKind::Suspend => {
        // [BridgeInstallation.suspend(ConfigurationBasisRef basis, ExpectedConfigRevision expected, ExpectedLocalRevision local)]
        candidate.suspend(basis, config_cas, local_cas)?;
    }
    ConfigurationMutationKind::Retire => {
        // [BridgeInstallation.retire(ConfigurationBasisRef basis, ExpectedConfigRevision expected, ExpectedLocalRevision local)]
        candidate.retire(basis, config_cas, local_cas)?;
    }
}
// [LocalUnitOfWorkPort.compare_expected(ExpectedLocalRevisionSet expected, BridgeLocalReadContext read, BridgeCallControl control)]
let cas = uow.compare_expected(&expected_set, &read, control).await?;
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 宿主保本次mutation/original；不能由begin失败证明rollback或重建operation。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [InstallationRepository.stage(BridgeInstallation candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged = installations.stage(&candidate, local_expected, &mut tx, control).await;
// staged成功才逐项执行G0§5 audit/dedup/seed/条件handoff与plan.validate_before_commit。
// [LocalUnitOfWorkPort.seal_plan(QualifiedLocalMutationPlan plan, BridgeLocalTransaction tx, BridgeCallControl control)]
let sealed = uow.seal_plan(&plan, &mut tx, control).await;
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* all successful */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* any stage/guard/seal error, exclusive branch */ uow.rollback(tx, control).await;
// actual Committed才读回原result/current installation；其他actual分支保原mutation，不输出配置已完成。
```

### 1.4 事务边界

事务外受权draft/current/namespace读取与observability preflight；pure候选无IO。一个local tx原子覆盖installation、原dedup、immutable stored seed、唯一audit和条件handoff；same-driver检查namespace唯一/config expected/local CAS全等。任何stage/校验失败actual rollback；commit/rollback未知保原mutation/op，不新begin重放。无外部投递、凭据解析、provider验证或资格refresh。

### 1.5 错误映射

decode/optional/版本组合错误=有限InvalidInput；不授权=Denied/不披露；缺正式配置/codec/driver=Blocked/Unavailable；namespace或CAS竞争=Conflict，只有受权same-meaning winner复用。Unsupported action/state拒绝，Retired无回边。取消在effect前Cancelled；提交后未知用原operation/phase，不用NoIo推断本地未提交。原结果披露失效时不输出hidden subject/op。

### 1.6 状态与事件副作用

初建Configured；Configure重启Suspended -> Configured；ApplyRevision仅Configured/Blocked/Suspended合法原state字段更新；Suspend原合法态 -> Suspended；Retire原合法态 -> Retired。qualification保持Missing/Stale，只有J05可建立current。config与local各checked next，source/generation不顺带改。实际变化产生G0唯一audit/result/条件O01；duplicate/no-op不另记。Step10候选为BridgeInstallationState，未创建矩阵文件。

### 1.7 测试切口与停审

沿Step4既有command/domain/local-mutation测试责任：初建唯一namespace、四动作和显式重启；完整七字段/CAS双轴、Qualified先暂停、Retired拒绝；same key同义/异义、并发Absent winner、observability mandatory缺失；seal漏写/extra、rollback/commit unknown与cancel保原op；secret值/外呼/运行qualified声明均零。仅planned，不执行。

| 停审项 | 结论 / 修正 |
|---|---|
| DTO/对象/port | pass_design_only；Step8§2五字段与Step7六参input、九参configure/原成员闭合；初建read不依赖不存在subject |
| tx/error/state/副作用 | pass_design_only；原CAS/唯一/actual提交/G0原result纪律，零平台效果/secret解析，无新state或outbox |
| 测试/phase/复杂度 | pass_design_only；既有测试责任，BR-UP-006/007/009正向资格保持blocked；无helper或新入口；下一只C02 |

## 2. C02 ManageExternalBinding

### 2.1 入口与目标

ManagementDispatcher::ManageBinding -> `ManageBindingInput::from_parts(context, installation, binding, meaning, maintenance, revocation, local_expected)` -> `ManageExternalBinding::execute(input, control)`。Application/U1，目标ExternalBinding；[Step8§3](03_ddd_step_08_command_protocols.md)、Step6 Domain同名卡、Step7 binding ports为唯一来源。

问题/诊断：Pending/Suspended激活不应循环要求原Active；proposal actor不是caller，PAT/安装管理权不等两端许可。采用显式五动作和两种资格，拒绝自动激活、target替换、批量改mapping。relation动作不建立owner/platform truth。

| DTO -> 原factory/成员 | 完整来源 / guard |
|---|---|
| proposal六字段 | installation/binding/meaning/maintenance/revocation/local_expected原值；context来自host；Propose None/Absent，其余Some/Present |
| meaning七字段 | action/actor/scope/target/actions/generation/basis全量入typed meaning；责任Missing不升级，display_name None；generation只expected |
| propose八参 | UoW binding ID、原installation、scope/target、正式责任Slot、已核授权Slot、actions、generation1；Pending/local1 |
| activate四参 | qualify_activation的完整BindingActivationQualification、meaning expected generation、实际local expected、uow actual now；next generation由资格与Domain核 |
| suspend/revoke/expire | actual完整row；qualify_maintenance/revocation返回的正式basis、expected generation/local，expire另actual now；两端/动作保持，不造新relation |
| tx候选/原结果 | 原management scope受权read再qualify_local_read；原key/七字段及optional完整meaning，actual expected集、G0 ID/audit/seed/conditional handoff |

### 2.2 函数级调用图：ManageExternalBinding

```text
[ManagementDispatcher -> ManageExternalBinding]
  | call Input.from_parts; qualify local read
  | query InstallationRepository.get / MappingRepository.get_binding
  | query dedup/result and compare original meaning
  v
[BindingQualificationPort]
  | call qualify_proposal / qualify_activation / qualify_maintenance / qualify_revocation
  v
[ExternalBinding]
  | call propose / activate / suspend / expire / revoke
  v
[LocalUnitOfWorkPort + MappingRepository + safe trace]
  | tx begin; save stage_binding + dedup; append audit/result/conditional handoff
  | call seal_plan; tx commit or rollback
  v
[Current safe result disclosure]
  | return actual local mutation only; zero owner/platform command
```

关键说明：

- proposal/activation/maintenance/revocation分别消费自己的正式依据，Pending读/激活不要求旧Active。
- relation与代际是本地受权关联，不是两端truth；实际commit不触发owner命令。

### 2.3 关键伪代码

```rust
// [BindingQualificationPort.qualify_local_read(BridgeLocalReadContext candidate, BridgeCallControl control)]
let read_q = binding_port.qualify_local_read(&read_candidate, control).await?;
// [InstallationRepository.get(BridgeInstallationRef installation, BridgeLocalReadSession read, BridgeCallControl control)]
let installed = installations.get(&installation, &session, control).await?;
// [MappingRepository.get_binding(ExternalBindingRef binding, BridgeLocalReadSession read, BridgeCallControl control)]
let row = /* existing only */ mappings.get_binding(&binding_ref, &session, control).await?;
// G0§4先判原key/result，不在复用之后重新激活。以下五分支排他，均在begin前。
// [BindingQualificationPort.qualify_proposal(BridgeInstallationRef installation, ExternalScopeLocator external, BridgeInternalTargetRef target, ActorRef actor, BridgeDirectionActionSet actions, AuthorizedBindingBasisRef basis, BridgeCallControl control)]
let proposal_q = /* Propose only */ binding_port.qualify_proposal(&installation, &scope, &target, &actor, &actions, &basis, control).await?;
// [ExternalBinding.propose(ExternalBindingRef binding_ref, BridgeInstallationRef installation_ref, ExternalScopeLocator external_scope, BridgeInternalTargetRef internal_target, ActorResponsibilityRefSlot actor_basis, AuthorizedBindingBasisRefSlot authorization_basis, BridgeDirectionActionSet directions_actions, BindingGeneration generation)]
let candidate = /* Propose */ ExternalBinding::propose(new_ref, installation, scope, target, actor_slot, basis_slot, actions, initial_generation)?;
// [BindingQualificationPort.qualify_activation(ExternalBinding binding, ExpectedGeneration expected, ActorRef actor, AuthorizedBindingBasisRef basis, BridgeCallControl control)]
let activation = /* Activate */ binding_port.qualify_activation(&original_binding, &generation_expected, &actor, &basis, control).await?;
// [ExternalBinding.activate(BindingActivationQualification current, ExpectedGeneration expected, ExpectedLocalRevision local, SafeInstant now)]
candidate.activate(activation_current, generation_expected, local_cas, now)?;
// [BindingQualificationPort.qualify_maintenance(ExternalBinding binding, BindingMutationKind action, ActorRef actor, QualificationMaintenanceBasisRef basis, BridgeCallControl control)]
let maintenance_q = /* Suspend/Expire */ binding_port.qualify_maintenance(&original_binding, action, &actor, &maintenance_basis, control).await?;
// [ExternalBinding.suspend(QualificationMaintenanceBasisRef basis, ExpectedGeneration expected, ExpectedLocalRevision local)]
candidate.suspend(current_maintenance, generation_expected, local_cas)?;
// [ExternalBinding.expire(QualificationMaintenanceBasisRef basis, ExpectedGeneration expected, ExpectedLocalRevision local, SafeInstant now)]
candidate.expire(current_maintenance, generation_expected, local_cas, now)?;
// [BindingQualificationPort.qualify_revocation(BridgeViewSubjectRef subject, ActorRef actor, RevocationBasisRef basis, BridgeCallControl control)]
let revocation_q = /* Revoke */ binding_port.qualify_revocation(&subject, &actor, &revocation_basis, control).await?;
// [ExternalBinding.revoke(RevocationBasisRef basis, ExpectedGeneration expected, ExpectedLocalRevision local)]
candidate.revoke(current_revocation, generation_expected, local_cas)?;
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // relation原key/operation和本次mutation保留，零新stage或owner IO。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [MappingRepository.stage_binding(ExternalBinding candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let stage = mappings.stage_binding(&candidate, local_expected, &mut tx, control).await;
// stage成功后G0 append_audit/stage_result/条件handoff、plan guard和seal；错误actual rollback。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* all stage/seal successful */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive error branch */ uow.rollback(tx, control).await;
```

### 2.4 事务边界

资格/完整读取在tx外；一个local tx覆盖binding候选、dedup/audit/result/conditional handoff。driver比较installation baseline、原binding local/generation及唯一relation，成功才可称local变更；不在tx内访问Identity/Governance。旧代际IO通过current立即拒绝，不以J05批次完成为前提。actual unknown保原mutation/op，重复请求只按原结果/真实阶段处理。

### 2.5 错误映射

optional组合/缺完整提案InvalidInput；无两端/责任合同Blocked或Denied；过期/旧代际Stale；CAS/semantic竞争Conflict。禁止owner权限fallback。原local结果只current过滤后披露；post-commit失去披露权不泄漏ref。commit未知/取消保原phase，撤销本地成功不能说已撤回owner动作。

### 2.6 状态与事件副作用

Propose -> Pending；Activate Pending/Suspended -> Active并建立两Slot/checked-next generation；Suspend Active -> Suspended；Revoke Pending/Active/Suspended -> Revoked；Expire同三态 -> Expired且实际expiry证明。Revoked/Expired无回边；generation/local独立，不回写owner/mapping结果。实际mutation唯一安全audit/result及qualified条件O01；无duplicate audit、owner事件、outbox、job run。Step10候选ExternalBindingState。

### 2.7 测试切口与停审

`crates/application/tests/authorization_flow_tests.rs`、`crates/domain/tests/local_guards_tests.rs`：Pending激活无需Active循环、Suspended显式激活、角色与候选actor分离、缺两端/目标/action/责任拒绝、维护与撤销optional穷尽、terminal拒绝；`continuity_flow_tests.rs`/`local_commit_boundary_tests.rs`：same key/meaning、双版本竞争、撤销后旧mapping即时拒绝、actual unknown/mandatory缺失。无测试执行。

| 停审项 | 结论 / 修正 |
|---|---|
| 构造/port | pass_design_only；八参propose、四参activation及维护/撤销方法均在Step6/7，输入七参不丢optional |
| tx/error/state/副作用 | pass_design_only；五动作排他、两端current与两轴、唯一local事务，零owner或平台IO |
| 测试/phase/复杂度 | pass_design_only；既有target、BR-UP-002/003保持开放，无新权限签发/关联批量系统；下一C03 |

## 3. C03 MaintainExternalMapping

### 3.1 入口与目标

ManagementDispatcher::MaintainMapping -> `MaintainMappingInput::from_parts(context, binding, generation, change, local_expected)` -> `MaintainExternalMapping::execute`。Application/U1；[Step8§4](03_ddd_step_08_command_protocols.md)、Step6三mapping、Step7 MappingRepository/BindingQualificationPort/ActorResponsibilityPort。

问题/诊断：五variant不能压缩为任意map；known结果不等relation授权，Tombstone不能仅凭wire disposition获权。受权R1已补BindingQualificationPort.qualify_tombstone，核actual原message/source/target/Delete/current/actor后才原成员record_tombstone；缺compatible正式owner处置仍NotEstablished。S9-GAP-TOMBSTONE关闭的是本地callable缺口，不是上游准入。不新增Revoke、内部成员/频道/Turn或猜thread/root。

| DTO -> 对象全集 | 唯一来源 / guard |
|---|---|
| proposal四字段及context | 原binding/generation/change/local_expected；API穷尽AuthorizedMappingChange -> BridgeMappingChange，同字段不丢；Link Absent、Invalidate/Tombstone Present |
| LinkIdentity四字段 -> link九参 | UoW mapping ID、account/kind/已有actor、binding/actual generation、已核identity basis、current binding、actual now；actor责任另qualify_actor，不创建GlobalMember |
| LinkLocation四字段 -> link九参 | ID、location/parent/target、binding/generation、已核location basis/current/now；parent缺失不猜root |
| LinkMessage七字段 -> link_known十二参 | ID、message/source/change、OwnerAccepted或PlatformAccepted对应的owner/effect Slot、direction/origin/basis、known result/current/now；非适用Slot显式Missing；AuthorizedRelation/unknown/ACK/Delete初链拒绝 |
| Invalidate二字段 | get_identity/get_location/get_message原完整row -> qualify_mapping_invalidation -> 各invalidate(basis, local_cas)；不改两端/结果 |
| Tombstone二字段 | 原get_message + original delete disposition候选；只actual original current受权处置才record_tombstone(disposition, local_cas)，目前缺上述核验面则零mutation阻断 |
| key/meaning/expected | 原metadata管理key、全部variant稳定字段/版本/方向/origin/条件；full relation/generation及exact row expected；current资格不是caller self-asserted |

### 3.2 函数级调用图：MaintainExternalMapping

```text
[ManagementDispatcher -> MaintainExternalMapping]
  | call Input.from_parts; query original key/result
  | query get_binding + exact mapping row or exact find_* uniqueness
  v
[BindingQualificationPort + ActorResponsibilityPort]
  | call qualify_current + branch qualifier
  | reject unsupported authority/source gap before tx
  v
[Typed mapping Domain]
  | call link/link_known/invalidate; tombstone only actual qualified source
  v
[LocalUnitOfWorkPort + MappingRepository]
  | tx begin; save exact stage_identity/location/message
  | append dedup/audit/result/conditional handoff; seal; tx commit/rollback
  v
[Current visibility -> actual local result]
  | no account/Conversation/platform creation; no external delete
```

关键说明：

- 五variant只选择自己的typed mapping/current/CAS；已知结果才允许message回链。
- Tombstone缺current解引用时止于tx之前，图不代表平台删除或内部对象创建。

### 3.3 关键伪代码

```rust
// [MappingRepository.get_binding(ExternalBindingRef binding, BridgeLocalReadSession read, BridgeCallControl control)]
let binding_row = mapping_repo.get_binding(&binding, &session, control).await?;
// [BindingQualificationPort.qualify_current(ExternalBinding binding, DirectionActionKind action, ActorRef actor, BridgeCallControl control)]
let relation_q = qualification.qualify_current(&actual_binding, direction_action, &caller, control).await?;
// 五分支排他；具体find_identity/location/message或get_*只用qualified session。
// [ActorResponsibilityPort.qualify_actor(ActorRef actor, BridgeInternalTargetRef target, DirectionActionKind action, BridgeCallControl control)]
let actor_q = /* LinkIdentity */ actors.qualify_actor(&mapped_actor, &target, direction_action, control).await?;
// [BindingQualificationPort.qualify_identity_mapping(CurrentBindingQualification current, ExternalAccountLocator external, ActorRef actor, IdentityMappingBasisRef basis, BridgeCallControl control)]
let identity_q = qualification.qualify_identity_mapping(&current, &account, &mapped_actor, &identity_basis, control).await?;
// [ExternalIdentityMapping.link(IdentityMappingRef mapping_ref, ExternalAccountLocator external_account, BridgeActorKind actor_kind, ActorRef internal_actor, ExternalBindingRef binding_ref, BindingGeneration generation, IdentityMappingBasisRef basis, CurrentBindingQualification current, SafeInstant now)]
let identity = ExternalIdentityMapping::link(new_identity, account, kind, mapped_actor, binding, actual_generation, qualified_identity_basis, current, now)?;
// [BindingQualificationPort.qualify_location_mapping(CurrentBindingQualification current, ExternalLocationLocator external, ParentLocationRefSlot parent, BridgeInternalTargetRef target, LocationMappingBasisRef basis, BridgeCallControl control)]
let location_q = /* LinkLocation */ qualification.qualify_location_mapping(&current, &location, &parent, &target, &location_basis, control).await?;
// [ExternalLocationMapping.link(LocationMappingRef mapping_ref, ExternalLocationLocator external_location, ParentLocationRefSlot parent_location, BridgeInternalTargetRef internal_target, ExternalBindingRef binding_ref, BindingGeneration generation, LocationMappingBasisRef basis, CurrentBindingQualification current, SafeInstant now)]
let location_candidate = ExternalLocationMapping::link(new_location, location, parent, target, binding, actual_generation, qualified_location_basis, current, now)?;
// [BindingQualificationPort.qualify_message_mapping(CurrentBindingQualification current, ExternalMessageLocator message, SafeSourceVersionRef source, KnownMappingResultRef known, MappingBasisRef basis, BridgeCallControl control)]
let message_q = /* LinkMessage */ qualification.qualify_message_mapping(&current, &message, &source, &known, &mapping_basis, control).await?;
// [ExternalMessageMapping.link_known(MessageMappingRef mapping_ref, ExternalMessageLocator external_message, SafeSourceVersionRef source_ref_version, ExternalChangeKind change_kind, OwnerAcceptedRefSlot owner_result, DeliveryEffectRefSlot effect_ref, MappingGenerationDirection generation_direction, VerifiedOriginMarkerRef origin_marker, MappingBasisRef mapping_basis, KnownMappingResultRef result, CurrentBindingQualification current, SafeInstant now)]
let message_candidate = ExternalMessageMapping::link_known(new_message, message, source, change, owner_slot, effect_slot, direction, origin, qualified_mapping_basis, known, current, now)?;
// [BindingQualificationPort.qualify_mapping_invalidation(MappingRef mapping, ActorRef actor, MappingInvalidationBasisRef basis, BridgeCallControl control)]
let invalidation_q = /* Invalidate */ qualification.qualify_mapping_invalidation(&mapping_ref, &caller, &invalidation_basis, control).await?;
// [ExternalMessageMapping.invalidate(MappingInvalidationBasisRef basis, ExpectedLocalRevision local)]
/* message branch; identity/location use their same-signature original member */ candidate.invalidate(qualified_invalidation, local_cas)?;
// [BindingQualificationPort.qualify_tombstone(ExternalMessageMapping mapping, CurrentBindingQualification current, ActorRef actor, OwnerChangeDispositionRef disposition, BridgeCallControl control)]
let tombstone_q = /* exclusive Tombstone branch */ qualification.qualify_tombstone(&actual_message, &current, &caller, &requested_disposition, control).await?;
// [ExternalMessageMapping.record_tombstone(OwnerChangeDispositionRef disposition, ExpectedLocalRevision local)]
/* Qualified only, exact original locator/source/Delete; other branches do not call */ candidate.record_tombstone(qualified_disposition, local_cas)?;
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 原mapping语义/operation与mutation保留，不报告mapping已生效。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [MappingRepository.stage_message(ExternalMessageMapping candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let stage = /* exact branch, otherwise stage_identity/stage_location */ mapping_repo.stage_message(&message_candidate, local_expected, &mut tx, control).await;
// G0逐项dedup/audit/seed/条件handoff -> validate/seal，任一失败独占rollback。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* all successful */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive failure */ uow.rollback(tx, control).await;
```

### 3.4 事务边界

资格与原行/exact unique lookup tx外；Link只actual absent可创建，existing保持完整hydration。单tx仅选定typed mapping + dedup/audit/result/条件handoff，同时重核relation generation/local read-set及mapping唯一，不写其他mapping/owner。Tombstone当前不开始tx；known source欠缺同样fail-closed。CAS winner必须当前受权同义才能读回；未知保原mutation/op。

### 3.5 错误映射

variant缺字段/kind/parent/AuthorizedRelation/unknown新link=InvalidInput；来源/责任无法核=Blocked；跨scope/撤销=Denied/Stale；unique/CAS不同义=Conflict；来源read-only unavailable不转“可创建”。tx错误沿G0实际rollback/unknown，不返回映射已生效。caller disposition shape正确仍不足以Tombstoned。

### 3.6 状态与事件副作用

identity/location首Valid，Invalidate Valid -> Stale；message首Linked，Invalidate Linked -> Stale；Tombstone只有qualify_tombstone实际Qualified才Linked/Stale -> Tombstoned。C03没有Revoke分支，不恢复terminal；origin/direction/result历史保持。只actual mapping mutation的safe audit/result/条件O01，零平台删除或内部truth写。Step10候选三Mapping state。

### 3.7 测试切口与停审

`authorization_flow_tests.rs`/`local_guards_tests.rs`覆盖五variant、namespace/kind/AI责任、parent/thread、known两variant/错误AuthorizedRelation、方向/origin/version、unknown/ACK拒绝、Tombstone解引用缺口零stage；`continuity_flow_tests.rs`/`local_commit_boundary_tests.rs`覆盖双版本/唯一竞争/同义winner/commit unknown；private边界不留消息体。均沿Step4 planned路径，未运行。

| 停审项 | 结论 / 修正 |
|---|---|
| DTO/对象/port | 受权R1 pass_design；五分支及qualify_tombstone/current读取面闭合，外部兼容未立仍blocked |
| tx/error/state/副作用 | pass_design_only；完整known才回链，缺资格零写；actual local并非owner/platform事实，无新state/outbox |
| 测试/phase/复杂度 | pass_design_only；测试target既有、缺口需后续明确合同修订授权，不冒称positive可实现；下一C04 |

## 4. C04 PrepareExternalDelivery

### 4.1 入口与目标

ManagementDispatcher::PrepareDelivery -> `PrepareDeliveryInput::from_parts(context, source, target, kind)` -> `PrepareExternalDelivery::execute`；Application/U3。来源：[Step8§6](03_ddd_step_08_command_protocols.md)、Step6 SafePresentationPlan/DeliveryIntent、Step7 presentation/delivery及完整mapping/current ports。实际补读Conversation03§7.1~7.4、Artifact03§5~8、Workspace03§7~8：只owner committed/safe projection/grant；Workspace只正式required read，不是授权owner。

问题/诊断：Command key与E02 producer key不同，逻辑effect必须相同；prepare不能隐含send。受权R2已显式注入LaneRepository并由qualify_lane取得完整scope/依赖/rate/预算，按scope唯一复用或insert_for_scope两轴Absent首建。S9-GAP-PREPARE-LANE/LANE-INSERT本地合同闭口；不拼target ID或每intent私建lane。实际capability/qualification缺失仍阻Planned，安全Blocked plan只记录真实write set。

| DTO/对象参数全集 | 来源与缺失出口 |
|---|---|
| context/source/target/kind | host context + 原body三字段；source须owner actual commit，target同relation/location/message/generation，kind不自动fallback |
| complete mapping | InstallationRepository.get；MappingRepository.get_binding/find_location/find_message/read_authorized_snapshot；current relation/actor/action及完整parent；Edit/Delete/Reply缺原known message拒绝 |
| StableEffectIdentity/DeliveryOperationMeaning | 原current source/projection版本+immutable target+kind纯typed构造，经qualify_effect/qualify_meaning；零正文hash、trace/event/C key不入effect |
| SafePresentationPlan::prepare十参 | UoW plan ID、source、已核mapping context、actual projection/disclosure/attachment Slots、actual presentation kind/capability/qualification、actual now；Missing/Stale可作真实Blocked候选，不补ref |
| DeliveryIntent::from_plan十二参 | actual intent/effect/operation技术identity、原source_projection/target/kind/plan/lane、Missing retry、stable effect/current/now；lane缺合法取得面则整个Planned分支不调用，不预造intent/op业务成功 |
| dedup/audit/seed/expected | 同原key/meaning、actual完整read-set、G0 safe material。仅实际stage的Blocked plan或合法planned变化可进入G0，不记录虚拟发送/附件下载 |

### 4.2 函数级调用图：PrepareExternalDelivery

```text
[ManagementDispatcher -> PrepareExternalDelivery]
  | call Input.from_parts; query original dedup/result
  | query full installation/relation/location/message snapshot
  v
[Config + Binding + Actor + Presentation qualification ports]
  | call qualify_installation/qualify_current/qualify_mapping/qualify
  | call qualify_effect; query DeliveryRepository.find_by_effect
  +--> existing same effect: current safe original result, no fresh plan
  +--> missing lane source: Blocked, zero dispatchable intent
  v
[SafePresentationPlan (+ DeliveryIntent only with full sources)]
  | call prepare (and from_plan only qualified lane source established)
  v
[LocalUnitOfWorkPort + DeliveryRepository]
  | tx begin; save stage_plan/qualified stage_intent; append safe mutation set
  | seal; tx commit or rollback; zero PlatformDeliveryPort
```

关键说明：

- C04/E02不同请求键必须共享同一stable effect唯一约束，duplicate不mint第二effect。
- lane来源缺口阻fresh Planned；Blocked plan真实写集不含虚拟intent，整个flow零send。

### 4.3 关键伪代码

```rust
// [PresentationQualificationPort.qualify(CommittedSourceVersionRef source, ImmutableDeliveryTargetRef target, ExternalDeliveryKind kind, ActorRef actor, BridgeCallControl control)]
let presentation_q = presentation.qualify(&source, &target, kind, &actor, control).await?;
// [LocalUnitOfWorkPort.qualify_effect(StableEffectIdentity effect, BridgeCallControl control)]
let stable_effect = uow.qualify_effect(&typed_effect, control).await?;
// [DeliveryRepository.find_by_effect(StableEffectIdentity effect, BridgeLocalReadSession read, BridgeCallControl control)]
let existing = delivery.find_by_effect(&stable_effect, &session, control).await?;
// existing same immutable fields: original lookup/current disclosure then return. Different meaning: finite Conflict.
// [PresentationQualificationPort.qualify_lane(ImmutableDeliveryTargetRef target, CurrentPresentationQualification presentation, CapabilitySnapshotRef capability, BridgeCallControl control)]
let lane_q = presentation.qualify_lane(&target, &current, &capability, control).await?;
// [LaneRepository.find_for_scope(QualifiedLaneOrderScope scope, BridgeLocalReadSession read, BridgeCallControl control)]
let existing_lane = lanes.find_for_scope(qualified_lane.scope(), &session, control).await?;
// actual existing: validate same scope/budget/dependency and keep its ID/versions; do not rebuild it.
// [DispatchLane.for_scope(DispatchLaneRef lane_ref, QualifiedLaneOrderScope order_scope, DeliveryDependencyRefSlot head_dependency, FencedClaimRefSlot claim_fence, Option<AttemptEffectRef> unresolved_head, QualifiedRateLimitBoundSet rate_bounds, RetryBudgetRef retry_budget, LaneRevision revision, RateLimitQualificationRef rate_basis)]
let new_lane = /* actual absent only; ID from original UoW reference allocator */ DispatchLane::for_scope(new_lane_ref, scope, dependency, FencedClaimRefSlot::Missing, None, all_bounds, original_budget, initial_lane_revision, rate_basis)?;
// [SafePresentationPlan.prepare(PresentationPlanRef plan_ref, CommittedSourceVersionRef source_ref_version, AuthorizedMappingContextRef binding_context, AllowedProjectionRefSlot projection_ref, DisclosureQualificationRefSlot disclosure_basis, AttachmentGrantRefSetSlot attachment_grants, QualifiedPresentationKind presentation_kind, CapabilitySnapshotRef capability_ref, QualificationSlot<CurrentPresentationQualification> qualification, SafeInstant now)]
let plan_candidate = /* only sources actually available */ SafePresentationPlan::prepare(plan_ref, source, mapping_context, projection_slot, disclosure_slot, attachments_slot, presentation_kind, capability, qualification_slot, now)?;
// Missing/Stale is Blocked, not permission to disclose. Actual source/shape lacking entirely => no plan/stage.
// [DeliveryIntent.from_plan(DeliveryIntentRef intent_ref, DeliveryEffectRef effect_ref, BridgeOperationRef operation_ref, StableSourceProjectionRef source_projection, ImmutableDeliveryTargetRef target_context, ExternalDeliveryKind operation_kind, PresentationPlanRef plan_ref, DispatchLaneRef lane_ref, RetryEligibilityRefSlot retry_basis, StableEffectIdentity effect, CurrentPresentationQualification plan, SafeInstant now)]
let intent_candidate = /* complete qualified lane/current branch only */ DeliveryIntent::from_plan(intent_ref, effect_ref, operation_ref, source_projection, target, kind, plan_ref, lane_ref, RetryEligibilityRefSlot::Missing, stable_effect, current, now)?;
// Qualified lane source selects actual existing ID or the same-UoW new lane ID; qualification failure blocks Planned.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 原prepare operation/effect与mutation保留，不造intent成功或send。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [LaneRepository.insert_for_scope(DispatchLane candidate, LanePreparationQualification qualification, BridgeLocalTransaction tx, BridgeCallControl control)]
let lane_stage = /* absent scope only; fixed both axes Absent in expected_set */ lanes.insert_for_scope(&new_lane, &qualified_lane, &mut tx, control).await;
// Existing lane branch skips insert and keeps actual same scope/revision/head; first failure rolls back.
// [DeliveryRepository.stage_plan(SafePresentationPlan candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let plan_stage = delivery.stage_plan(&plan_candidate, LocalRevisionCondition::Absent, &mut tx, control).await;
// [DeliveryRepository.stage_intent(DeliveryIntent candidate, StableEffectIdentity effect, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let intent_stage = /* qualified Planned branch only */ delivery.stage_intent(&intent_candidate, &stable_effect, LocalRevisionCondition::Absent, &mut tx, control).await;
// G0 stage_dedup/append_audit/stage_result/condition, validate/seal. Blocked-plan path omits intent from actual writes/plan.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* successful full set */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive failure */ uow.rollback(tx, control).await;
```

### 4.4 事务边界

外部current/owner/grant/preflight全在tx外；actual local tx原子stage plan、合法intent+effect唯一（若有）以及dedup/audit/seed/条件handoff。C04/E02 unique loser不能mint第二effect，受权读actual winner；同义恢复不改原plan。仅Blocked plan的提交不占用不存在的DeliveryIntent/effect唯一或宣告Planned。commit未知仅原mutation恢复，零send/claim/attempt/receipt。

### 4.5 错误映射

未提交source、wrong method/target/body shape=InvalidInput；缺Gate/disclosure/附件/parent/capability=Blocked/Unsupported，explicit Degraded只无敏感内容且无审批动作；missing lane=NotEstablished/Blocked。unique/CAS变义Conflict；duplicate需current披露。任何网络/原result未知保原operation，原内部提交不提升外部送达。

### 4.6 状态与事件副作用

plan新建仅actual qualification裁定Qualified/Degraded/Blocked；不能在缺lane时宣告可派发。完整qualified lane实际首建/复用与plan/intent同UoW，intent新建Planned保持retry Missing。只有J01改变派发阶段；C04零attempt/receipt/message回链/平台消息或owner修改。actual local audit/result/条件O01仅实际prepare变化，不持久projection内容/附件链接。Step10候选PresentationState/DeliveryIntentState。

### 4.7 测试切口与停审

`authorization_flow_tests.rs`：Gate全显/explicit无动作降级/隐存在性、Artifact expiry、thread/编辑删除依赖、workspace required缺口；`continuity_flow_tests.rs`：C04/E02两key同effect winner、changed target/kind/source Conflict、missing lane零from_plan/intent stage；`private_material_boundary_tests.rs`/`local_commit_boundary_tests.rs`：正文/secret零保留、actual unknown、seal/mandatory拒绝。仅planned。

| 停审项 | 结论 / 修正 |
|---|---|
| 构造/port | 受权R2 pass_design；十/十二参及qualified lane五字段、两轴Absent首建/unique/CAS闭合；zero-send |
| tx/error/state/副作用 | pass_design_only；same-effect unique、Blocked真实写集、零平台/secret调用与无动作降级 |
| 测试/phase/复杂度 | pass_design_only；当前positive资格不宣ready，无新增对象/入口；下一C05 |

## 5. C05 BindExternalAction

### 5.1 入口与目标

ManagementDispatcher::BindAction -> `BindActionInput::from_parts(context, binding, source, target, responsibility)` -> `BindExternalAction::execute`。Application/U4；[Step8§7](03_ddd_step_08_command_protocols.md)、Step6 ExternalActionBinding、Step7§5.2修正factory与callback/owner ports。

问题/诊断：初绑尚没有callback；known source验证不能伪装成CallbackVerificationRef。采用`ActionBindingQualification`作为bind第十一参（Step7明确覆盖Step6）；不采用CurrentActionQualification、预claim/按钮授权或可点击敏感降级。初态沿实际enum/Step8为Active；Step7文字“Bound”仅旧术语，不能新增Bound状态。

| DTO -> factory全集 | 来源 / guard |
|---|---|
| context+四body字段 | actual host context、原binding/source/target/responsibility，reference shape不授action或外显权 |
| 完整local来源 | MappingRepository.get_binding/get_message、DeliveryRepository.read_snapshot/get_receipt、InstallationRepository.get；按SourceIntentMessageRef适用分支读取原known message/intent/source，不以HTTP/ACK证明 |
| 初绑八字段资格 | OwnerActionPort.qualify_binding输出binding/source/actor/action/owner_revision/authorization/expiry/source_verification；前置verify_bound_source与actual ActorResponsibilityPort.revalidate |
| ExternalActionBinding::bind十二参 | UoW action ID、actual installation/source/责任/target/owner revision/generation/expiry/authorization、OneUseClaimRefSlot::Missing、ActionBindingQualification、actual now |
| key/meaning/expected | metadata管理key、全部四body稳定source/action/责任版本；查原find_action_for_source和G0原result；local Absent与完整installation/binding/known source baseline，一次实际提交 |

### 5.2 函数级调用图：BindExternalAction

```text
[ManagementDispatcher -> BindExternalAction]
  | call Input.from_parts; query full installation/relation/known source
  | query original key/result and find_action_for_source
  v
[CallbackVerificationPort + ActorResponsibilityPort + OwnerActionPort]
  | call verify_bound_source; revalidate responsibility; qualify_binding
  v
[ExternalActionBinding]
  | call bind(ActionBindingQualification, one_use Missing)
  v
[LocalUnitOfWorkPort + CallbackRepository + safe trace]
  | tx begin; save stage_action; append original mutation set
  | seal; tx commit/rollback; zero callback claim/owner action
```

关键说明：

- 初绑消费known source/action/责任的Binding资格，不要求不存在的callback验证。
- Active action只是本地绑定；图不claim one-use、不批准Gate、不触发owner动作。

### 5.3 关键伪代码

```rust
// [CallbackRepository.find_action_for_source(SourceIntentMessageRef source, OwnerTargetActionRef target, BridgeLocalReadSession read, BridgeCallControl control)]
let existing = callbacks.find_action_for_source(&source, &target, &session, control).await?;
// G0 same key/source/action duplicate current过滤后复用，不续期或生成第二one-use。
// [CallbackVerificationPort.verify_bound_source(SourceIntentMessageRef source, OwnerTargetActionRef target, BridgeInstallation installation, BridgeCallControl control)]
let source_q = verification.verify_bound_source(&source, &target, &installation, control).await?;
// [ActorResponsibilityPort.revalidate(ActorResponsibilityRef responsibility, OwnerTargetActionRef action, BridgeCallControl control)]
let actor_q = actors.revalidate(&responsibility, &target, control).await?;
// [OwnerActionPort.qualify_binding(CurrentBindingQualification binding, SourceIntentMessageRef source, ActorResponsibilityRef actor, OwnerTargetActionRef target, SafeAuthorityRef source_verification, BridgeCallControl control)]
let binding_q = owner.qualify_binding(&current_binding, &source, &current_responsibility, &target, &source_verification, control).await?;
// [ExternalActionBinding.bind(ExternalActionBindingRef action_binding_ref, BridgeInstallationRef installation_ref, SourceIntentMessageRef source_intent, ActorResponsibilityRef actor_responsibility, OwnerTargetActionRef target_action, OwnerActionStateRevision owner_revision, BindingGeneration binding_generation, ActionExpiryOneUseRef expiry_one_use, ActionAuthorizationBasisRef authorization_basis, OneUseClaimRefSlot one_use_claim, ActionBindingQualification current, SafeInstant now)]
let candidate = ExternalActionBinding::bind(action_ref, installation_ref, source, current_responsibility, target, owner_revision, generation, expiry, authorization, OneUseClaimRefSlot::Missing, actual_binding_qualification, now)?;
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 原source-action operation与mutation保留，零callback claim或审批。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [CallbackRepository.stage_action(ExternalActionBinding candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let stage = callbacks.stage_action(&candidate, LocalRevisionCondition::Absent, &mut tx, control).await;
// G0 dedup/audit/seed/条件handoff、validate/seal；错误停止后actual rollback。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* all successful */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive failure */ uow.rollback(tx, control).await;
```

### 5.4 事务边界

known source/owner/责任/外显/current核验在tx外。单local tx只有action、dedup、audit、seed/条件handoff，并重核原generation/source/owner条件和unique source-action。无one-use reservation、CallbackHandoffRecord、private callback、secret解析或owner handoff。actual未知保原mutation，后续只能受权原local恢复。

### 5.5 错误映射

未知message/原source不存在/target不符拒绝；缺注册source verification kind/schema、owner外显/action合同=Blocked（BR-UP-003/008）；责任撤销/expiry=Stale/Denied；unique/CAS变义Conflict。signature合法不能授权。禁止为敏感Gate保留可点击低敏感placeholder；结果披露失效不泄漏action/ref。

### 5.6 状态与事件副作用

新action Active/local1、one_use Missing；不进入Claimed、不写Decision、不send。Active并非owner审批成功。actual local唯一audit/result/条件O01；duplicate零新写/期限延长。Step10候选ExternalActionState，只有E03消费one-use。

### 5.7 测试切口与停审

`authorization_flow_tests.rs`/`local_guards_tests.rs`覆盖初绑没有callback也可核source、known source/target/actor/revision/generation/expiry交集、敏感外显阻断、one-use Missing；`continuity_flow_tests.rs`/`local_commit_boundary_tests.rs`覆盖same source-action/key异义竞争、重复不续期、actual unknown与Mandatory缺口。仅planned。

| 停审项 | 结论 / 修正 |
|---|---|
| 构造/port | pass_design_only；Step7 ActionBindingQualification覆盖已采用，十二参来源、Active实际enum一致 |
| tx/error/state/副作用 | pass_design_only；zero claim/callback/owner动作/secret，原source-action唯一和actual local结果 |
| 测试/phase/复杂度 | pass_design_only；正向source/owner compatibility仍blocked，不新增验证入口；下一C06 |

## 6. C06 RequestBridgeRecovery

### 6.1 入口与目标

ManagementDispatcher::RequestRecovery -> `RequestRecoveryInput::from_parts(context, subject, original, authorization)` -> `RequestBridgeRecovery::execute`；Application/U5。来源：[Step8§8](03_ddd_step_08_command_protocols.md)、Step6 RecoveryRecord、Step7 AuthoritativeRecoveryPort/ContinuityRepository。问题/诊断：申请授权不等probe或retry；new command key不能建立第二原subject恢复。采用先qualify_request和same subject/op查重；不调用probe/read_original_result/send或清unknown。

| 构造全集 | 来源 / 缺失出口 |
|---|---|
| context+subject/original/authorization | 原三字段移交；trusted actor/metadata authority独立；candidate authority必须正式重验 |
| 原subject存在/关联 | qualify_request内部核actual完整原subject/op/effect/scope，缺source/read basis先Blocked；本用例不借未注入的Delivery/Callback repo或自己造row |
| request八参 | UoW recovery ID、已核subject/original、qualify_request受权basis、qualification/probe两Missing、Unresolved、actual有限接纳reason；Requested/local1 |
| original recovery | find_recovery(subject, original)完整actual row及G0 key/result；同义existing返回原当前stage，无新申请/期限/operation |
| key/expected/audit/seed | management metadata原key、全部三个stable字段及授权版本/作用域，recovery Absent及原read-set，G0真实local请求材料/结果，不记probe事实 |

### 6.2 函数级调用图：RequestBridgeRecovery

```text
[ManagementDispatcher -> RequestBridgeRecovery]
  | call Input.from_parts
  v
[AuthoritativeRecoveryPort]
  | call qualify_request (only authorization/current original relation)
  v
[ContinuityRepository + safe trace]
  | query find_recovery and original dedup/result
  v
[RecoveryRecord]
  | call request with Missing probe/qualification and Unresolved
  v
[LocalUnitOfWorkPort + ContinuityRepository]
  | tx begin; save stage_recovery; append original mutation set
  | seal; tx commit/rollback; no probe/send/cursor advance
```

关键说明：

- qualify_request只核原subject/op与申请权限，Requested不等probe、Resolved或retry许可。
- 唯一subject/op申请事务不改变原业务结果、gap关联或unknown lane head。

### 6.3 关键伪代码

```rust
// [AuthoritativeRecoveryPort.qualify_request(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, RecoveryAuthorizationRef basis, ActorRef actor, BridgeCallControl control)]
let request_q = recovery.qualify_request(&subject, &original, &authorization, &actor, control).await?;
// [ContinuityRepository.find_recovery(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, BridgeLocalReadSession read, BridgeCallControl control)]
let existing = continuity.find_recovery(&subject, &original, &session, control).await?;
// G0 original key/meaning结果优先；已有same subject/op只current受权复用，不建立第二事实。
// [RecoveryRecord.request(RecoveryRecordRef recovery_ref, OriginalRecoverableSubjectRef original_subject, OriginalOperationEffectRef operation_effect, RecoveryAuthorizationRef authorization_basis, RecoveryQualificationRefSlot qualification_ref, AuthoritativeProbeResultRefSlot probe_result, SafeRecoveryResolutionKind resolution_kind, SafeReasonCode safe_reason)]
let candidate = RecoveryRecord::request(recovery_ref, subject, original, qualified_authorization, RecoveryQualificationRefSlot::Missing, AuthoritativeProbeResultRefSlot::Missing, SafeRecoveryResolutionKind::Unresolved, safe_reason)?;
// Gap subject only: read original gap before tx, verify same original tracking operation/range and actual local CAS.
// [GapRecord.attach_recovery(RecoveryRecordRef recovery, OriginalOperationEffectRef original, RecoveryAuthorizationRef basis, ExpectedLocalRevision local)]
let gap_change = /* exclusive Gap request; Missing -> Established same new recovery */ gap_candidate.attach_recovery(recovery_ref, original, qualified_authorization, actual_gap_expected)?;
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 原申请subject/op与本次mutation保留，不重request或改变原unknown。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [ContinuityRepository.stage_recovery(RecoveryRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let stage = continuity.stage_recovery(&candidate, LocalRevisionCondition::Absent, &mut tx, control).await;
// [ContinuityRepository.stage_gap(GapRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let gap_stage = /* Gap request only, same tx complete_expected includes actual gap Present */ continuity.stage_gap(&gap_candidate, gap_condition, &mut tx, control).await;
// G0 unique original/key/meaning、audit/seed/条件handoff、validate/seal；任一失败rollback。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* full successful set */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive failure */ uow.rollback(tx, control).await;
```

### 6.4 事务边界

request资格/查重在tx外。单tx原子recovery+unique subject/op+dedup/audit/seed/条件handoff；Gap subject额外原gap.attach_recovery同态关联及其自身Present CAS，不能只find后当Established。原业务operation不换。提交未知只查该local mutation，不重新request；没有foreign恢复IO、资格probe、cursor/gap关闭或unknown清除。实际authorization不存在则不创建Requested。

Gap分支必须先`ContinuityRepository.get_gap`读完整BridgeVersioned<GapRecord>，核输入OriginalRecoverableSubjectRef::Gap/原tracking op与cursor/range一致；`actual_gap_expected`取该row.local_revision，`gap_condition=Present(actual_gap_expected)`独立于新recovery的Absent。actual已有same recovery复用、不重复attach/stage；异ref或不同原op Conflict，Probing/Closed不能attach。complete_expected包含全部两行及原dedup/result关系，不从caller/ref形状推gap版本。

### 6.5 错误映射

subject/op/kind/scope不符InvalidInput；候选授权无current来源Denied/Blocked；已过恢复窗口不能重新签申请逃避，Stale/Blocked；唯一不同义Conflict。申请成功只LocalCommitted view；不可把Requested当Resolved或retry permission。NotFound/timeout不证NoEffect；缺披露资格不输出隐藏original。

### 6.6 状态与事件副作用

新recovery Requested、resolution Unresolved、probe/qualification Missing；existing只复用不推进。原inbound/callback/intent/handoff/gap均不改，不清lane head。actual request唯一audit/result/条件O01，零probe事件/run/report。Step10候选RecoveryState，J02/J03才能合法begin_probe及受权结果。

### 6.7 测试切口与停审

`authorization_flow_tests.rs`/`continuity_flow_tests.rs`：伪original、缺授权、已过窗口、原subject/op唯一、两key同申请、key异义、零probe/send/advance、Requested不升级；`local_commit_boundary_tests.rs`：same tx唯一/CAS/observability失败、rollback/commit unknown原identity；query可见性单独核。仅planned。

| 停审项 | 结论 / 修正 |
|---|---|
| DTO/对象/port | pass_design_only；四参input、八参request、qualify_request及same subject/op反查来源闭合 |
| tx/error/state/副作用 | pass_design_only；原申请不覆盖unknown或权限、无probe/平台效果，local proof独立 |
| 测试/phase/复杂度 | pass_design_only；BR-UP-009权威source仍开放，零新replay/callable；下一Q01 |

## 7. Command批次归属与组内审计

| Flow / 协议 | 模块 / 对象 | 主要port与副作用 | 停审 |
|---|---|---|---|
| C01 ConfigureBridgeInstallation | Application/U1 / BridgeInstallation | ConfigQualification/Installation/UoW；local配置，G0安全材料 | pass_design_only |
| C02 ManageExternalBinding | Application/U1 / ExternalBinding | BindingQualification/Mapping；显式relation及代际 | pass_design_only |
| C03 MaintainExternalMapping | Application/U1 / 三mapping | BindingQualification/Actors/Mapping；actual known回链/失效 | pass_fail_closed_design；Tombstone positive blocked |
| C04 PrepareExternalDelivery | Application/U3 / plan/intent | Presentation/Delivery/Config/Binding/Actors/Mapping；zero-send | pass_fail_closed_design；fresh Planned lane来源blocked |
| C05 BindExternalAction | Application/U4 / action | Verification/Actors/OwnerAction/Callback/Delivery/Mapping/Installation；zero-claim | pass_design_only |
| C06 RequestBridgeRecovery | Application/U5 / recovery | Recovery/Continuity；zero-probe | pass_design_only |

六input/full DTO、具名factory/member/port及G0 actual提交/immutable结果纪律已逐流人工反查。两个当步读面缺口阻对应positive，不由generic helper/跨项目写入“修好”；当前六C零PlatformDelivery/owner handoff。组内静态格式/范围检查留X实际执行，无运行结果。
