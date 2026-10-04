# L6-bridges 03 Step10：U1配置、绑定与映射状态

共用错误E0~E4、U提交及测试简称见[主文件§6](03_ddd_step_10_state_matrix.md#6-共用转换错误与副作用契约)。只在逐机到达时追加；本页不拥有Identity/Workspace或外部账号、频道、消息truth。

## M01 / BridgeInstallation

### 问题、诊断与取舍

归属U1 Domain `binding/bridge_installation.rs`；enum=`BridgeInstallationState`。字段/全部函数签名唯一回指[Step6 BridgeInstallation](03_ddd_step_06_domain_contracts.md#bridgeinstallation)，流程回指Step9 Command§2/C01、Job§6/J05、Query§2/Q01。问题是配置接纳能否直接运行；诊断为config revision、安全seam资格与local CAS三者不同。采用Configured后J05核资格，不把SDK/OAuth/API Key/KMS/route ref的shape当实际已绑定。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Configured | 已接纳安全配置、资格未立 | 否 | record_qualification/block/suspend/retire；apply_revision字段维护 |
| Qualified | 本次config/seam资格成立，业务IO仍重核 | 否 | block/suspend/retire；安全读取 |
| Blocked | 必要seam不足 | 否 | record_qualification/suspend/retire；apply_revision |
| Suspended | 显式阻新运行 | 否 | restart_configured/retire；apply_revision |
| Retired | 本地安装退役历史 | 是 | 受权读取原历史/结果；零新IO |

### ASCII转换图

```text
[configure] -> Configured --qualification--> Qualified
                  |  ^                         |
                  v  |                         v
                Blocked --qualification--> Qualified
                  \             |             /
                   +--------> Suspended --restart--> Configured
                   all nonterminal --retire--> Retired
```

图只摘要；Configured也可suspend，Qualified也可block。退役不证明旧owner/platform效果撤销或旧unknown消失。

### 字段guard与构造

| 标签 | typed字段及唯一来源 |
|---|---|
| IQ | InstallationRepository.get/read_snapshot完整11字段及local revision；ConfigQualificationPort.qualify_installation取得同namespace/config_revision/capability_ref/secret_binding/route_policy的InstallationQualificationRef；validity与actual now匹配 |
| IB | 原configuration_basis/config及Qualified Slot失效依据；ConfigQualificationPort.qualify_binding_invalidation实际QualificationMaintenanceBasisRef，不写SDK原错误 |
| IC | C01 DTO mutation/draft/expected；qualify_draft当前ConfigurationBasisRef，ExpectedConfigRevision与loaded相等，draft.revision为checked next；ExpectedLocalRevision另核 |

首建`BridgeInstallation.configure` @ C01：同namespace/platform、config_revision=1、qualification=Missing、local_revision=1；Installation.stage为Absent。已存在namespace unique winner只原结果复用；rehydrate只actual stored basis，不以其建立current。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
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

### 同态维护、非法与副作用

`BridgeInstallation.apply_revision`仅Configured/Blocked/Suspended字段维护：完整新draft同namespace、IC双expected、revision checked next，资格Stale/Missing；state不变，不能把Blocked当Qualified。Qualified必须先独立suspend实际提交，Retired不能替换。不是额外生命周期边或默认重启。

| 非法请求 | 精确处置 / audit |
|---|---|
| Retired出边、Qualified直接apply_revision、无explicit basis重启 | E0或E2；纯对象零修改，零新audit |
| config CAS匹配但local不匹配、溢出、namespace/platform或secret用途错 | E0/E1/E2；driver PE::Conflict/Denied；不半替换引用 |
| 无provider/能力/route实际资格却要求Qualified | PE::NotEstablished/Unavailable；不靠factory绕过IQ，旧known结果保真 |

具体U：Installation.stage同driver Present/首建Absent、完整expected + 原Management/Qualification dedup/result/audit及正式条件handoff；零解析secret、零平台IO、零历史删除或projection写。Q01只能读取current裁剪。停止/重启/退役既不等外部撤销，也不释放old claim。planned D逐12边及非法补集；A查配置basis；L双CAS/unique/unknown commit；P核secret仅opaque ref；R核退役历史读取不变。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 5状态、12迁移与原enum/02允许表一致；5个迁移成员及同态apply_revision具名存在；IC/IQ/IB、三轴/U/无平台IO人工核验。无reserved边；外部seam未建立不提升资格 |

## M02 / ExternalBinding

### 问题、诊断与取舍

归属U1 Domain `binding/external_binding.rs`；enum=`ExternalBindingState`。全字段/签名回指[Step6 ExternalBinding](03_ddd_step_06_domain_contracts.md#externalbinding)，触发Step9 C02/J05，各IO重核和Q01只读。问题是Pending/Suspended如何获得Active；采用显式BindingActivationQualification，而非要求原relation已Active或让外部安装principal代所有owner授权。暂停/撤销与迟到known结果分开，不批量伪造下游状态。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Pending | 已提案，正式依据可能未齐 | 否 | activate/revoke/expire；无业务IO |
| Active | 同代际两端/动作资格可消费，IO前仍重核 | 否 | assert_current/suspend/revoke/expire |
| Suspended | 阻原relation新动作及旧排队 | 否 | activate新授权代际/revoke/expire |
| Revoked | 原relation撤销 | 是 | 受权历史及原结果finalize，不恢复授权 |
| Expired | 正式期限已到 | 是 | 同上，不由timer自行复活 |

### ASCII转换图

```text
[propose] -> Pending --explicit activate--> Active
                                           |  ^
                                       suspend|activate(new generation)
                                           v  |
                                        Suspended
  Pending / Active / Suspended --revoke--> Revoked
  Pending / Active / Suspended --expire--> Expired
```

不是Policy/Gate状态机；Active仅local relation可消费，不承诺未来永久授权。

### 字段guard与构造

| 标签 | typed字段 / current取得 |
|---|---|
| BA | MappingRepository.get_binding完整10字段；BindingQualificationPort.qualify_activation核原installation/external_scope/internal_target/directions_actions/actor_basis/authorization_basis、expected generation及now；next_generation checked next，两Slot当前Established |
| BM | qualify_maintenance(Suspend/Expire)当前QualificationMaintenanceBasisRef、原binding/scope/window；Expire有正式expiry及actual now，不由created_at推断 |
| BR | qualify_revocation正式RevocationBasisRef覆盖同binding/target/action；ExpectedGeneration、ExpectedLocalRevision分别等原读；basis不借PAT/平台role |

`ExternalBinding.propose` @ C02：八业务参、Pending、generation=1/local=1，两Slot可Missing但必须明确；stage_binding Absent。Pending与Suspended激活都只BA，无默认Active。`assert_current`纯只Active，检查CurrentBindingQualification的原代际/动作/两端/window；跨U资格port IO前再次验证撤销。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
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

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Revoked/Expired激活、Active再次activate、Pending暂停、同target换action后续旧generation | E0/E2，零修改；新关系须新受权提案，不换ID逃撤销 |
| 只有external_id/管理员token，无formal actor/两端authority | PE::Denied/NotEstablished；E2；不能创建GlobalMember或绕Policy/Gate |
| current到期但J05未写Expired，仍要求IO | assert_current/current port立即E2/PE::Stale；后台状态不授权 |

具体U：Mapping.stage_binding Present + 完整expected、原Management/Qualification key/result/audit/正式条件handoff；零owner/platform IO，零其他对象批量改state/删claim。代际变化让旧mapping/plan/action资格即时不适用，J05只能按各对象原合法边维护，迟到结果保原op而非继承新代际。planned D逐9边/非法；A两端与actor/Policy；C旧代际排队/late result；L双CAS/溢出/unique/commit unknown；R终态history裁剪。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 5状态/9迁移与enum/02一致；C02/J05实际typed候选及原成员、BA/BM/BR双expected/U已核，无reserved；J05不activate或造撤销来源；外部positive仍受原资格阻塞 |

## M03 / ExternalIdentityMapping

### 问题、诊断与取舍

归属U1 Domain `binding/external_identity_mapping.rs`；enum=`IdentityMappingState`。字段/完整签名回指[Step6 ExternalIdentityMapping](03_ddd_step_06_domain_contracts.md#externalidentitymapping)，C03/J05及Q01。采用三态原关系机；external_id、bot标记或mention不生成GlobalMember/ActorRef，Stale不得原地重新link。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Valid | 当前两端账号kind/责任/代际可消费 | 否 | assert_applicable/invalidate/revoke |
| Stale | 原依据或代际不适用，历史保留 | 否 | revoke；受限只读，不能授IO |
| Revoked | 局部mapping撤销 | 是 | 只读历史；无恢复 |

### ASCII转换图

```text
[link] -> Valid --invalidate--> Stale
            |                    |
            +------revoke--------+--> Revoked
```

撤销的是local relation，不是外部账号或内部Identity。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| IA | Mapping.get_identity/get_binding完整9字段、外部account.namespace/kind/id、actor_kind/internal_actor、binding_ref/generation/basis；ActorResponsibilityPort实际正式责任 + Binding.qualify_identity_mapping/current；assert_applicable只Valid/current/now |
| II | Binding.qualify_mapping_invalidation原MappingRef与MappingInvalidationBasisRef、actor；ExpectedLocalRevision等actual row，保原account/actor/generation |
| IR | Binding.qualify_revocation核actual正式RevocationBasisRef覆盖同mapping/两端/actor/action；不是从失效reason转型，local expected另核 |

`ExternalIdentityMapping.link` @ C03：九参完整、IA同Active代际/current/window，固定Valid/local1，Mapping.stage_identity Absent及same account/relation/generation唯一；已存在只actual读取/原结果复用。rehydrate非重新授权。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Valid | Stale | `ExternalIdentityMapping.invalidate` @ C03/J05 | II + local expected | local next；两端不换；U identity | E0/E1/E2 |
| Valid | Revoked | `ExternalIdentityMapping.revoke` @ J05 | IR实际候选 + local expected | local next；历史保留；U identity | E0/E1/E2 |
| Stale | Revoked | `ExternalIdentityMapping.revoke` @ J05 | IR不借旧Active current | 同上，无复活 | E0/E1/E2 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Stale/Revoked -> Valid，任意external_id mint GlobalMember，human默认为Integration | E0/E2或PE::Denied/NotEstablished；零修改/新audit，正式actor来源缺失不补 |
| account-kind/actor-kind/namespace错、current代际旧、expected错 | E1/E2/E0；原relation即时拒绝，不依赖J05及时写Stale |
| 用C03 Invalidate表示revoke | PE::InvalidInput；当前五variant没有mapping revoke，不能强转basis或加wire动作 |

02概念表C03解除的允许state边保留，但当前具体入口以Step9 J05的actual撤销候选取得面实现；不是新协议，也不把C03误标可调用。具体U：Mapping.stage_identity Present、完整原relation read-set/local expected + 原key/result/audit/条件handoff；零Identity/平台账号写、零secret/owner IO。planned D逐3边及终态补集；A正式actor与两端授权；C旧代际/同key变义；Lunique/CAS/commit未知；R无披露资格不出账号/actor ref。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 3状态/3边逐enum/02/原成员匹配；IA/II/IR的实际完整取得面、C03/J05 trigger差异及U/测试已核；无新增reserved，外部identity资格不关闭 |

## M04 / ExternalLocationMapping

### 问题、诊断与取舍

归属U1 Domain `binding/external_location_mapping.rs`；enum=`LocationMappingState`。全字段/签名回指[Step6 ExternalLocationMapping](03_ddd_step_06_domain_contracts.md#externallocationmapping)，C03/J05/Q01。频道、DM、topic、thread的kind/parent和正式target不能扁平化；采用明确ParentLocationRefSlot，不从频道ID推thread root，也不把external workspace当内部Workspace。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Valid | 当前位置kind/parent/两端依据可消费 | 否 | resolve_target/invalidate/revoke |
| Stale | 原定位或依据/代际失效 | 否 | revoke；受权history读取 |
| Revoked | 原位置关系解除 | 是 | 只读历史；无复活 |

### ASCII转换图

```text
[link] -> Valid --invalidate--> Stale
            |                    |
            +------revoke--------+--> Revoked
```

只解除local定位关系，不删外部channel/thread或内部Conversation/Workspace。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| LA | Mapping.get_location/get_binding及actual parent/root/target完整9字段；Binding.qualify_location_mapping/current核external_location kind/namespace、parent_location、internal_target/binding/generation/basis；正式target owner与action/now一致 |
| LI | Binding.qualify_mapping_invalidation原Location MappingRef/actor/MappingInvalidationBasisRef，local expected原row；parent/target历史不抹 |
| LR | J05 actual正式RevocationBasisRef经qualify_revocation，原两端/责任/scope及local expected齐；不从Missing parent或clock合成撤销 |

`ExternalLocationMapping.link` @ C03：九参LA、Valid/local1、stage_location Absent及同位置/relation/generation unique；Thread/Topic原parent必须Established，NotApplicable只正式kind适用，Missing/Stale拒绝。`resolve_target`只Valid/current/action/now，零修改/owner创建；rehydrate不授current。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Valid | Stale | `ExternalLocationMapping.invalidate` @ C03/J05 | LI + local expected | local next；原parent/target保留；U location | E0/E1/E2 |
| Valid | Revoked | `ExternalLocationMapping.revoke` @ J05 | LR完整actual候选/local | local next；原关系解除；U location | E0/E1/E2 |
| Stale | Revoked | `ExternalLocationMapping.revoke` @ J05 | LR，不强求失效旧current | 同上，无复活 | E0/E1/E2 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Stale/Revoked原地link，Thread缺parent当Channel，跨topic/root/target或代际 | E0/E1/E2；current端口Stale/Denied，零修改/新audit |
| C03 Invalidate当Revoke、external workspace自动创建内部Workspace | PE::InvalidInput/Denied/NotEstablished；不加第六mapping动作或owner写入口 |

具体U：Mapping.stage_location Present、原relation/parent读集及各subject实际local expected + 原key/result/audit/条件handoff；C03无显式mapping revoke，原允许边在J05正式候选下可用。零平台/Workspace/Conversation写，旧intent不得换target越过Stale。planned D逐3边/非法；A两端及parent资格；B四平台channel/DM/topic/thread差异；C旧target/effect不挪；Lunique/CAS/commit未知；R受限history。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 3状态/3边匹配enum/02/原成员，parent完整读取及J05 actual候选/U/测试已核；无reserved、无owner实体写，外部parent/target合同仍受原门禁 |

## M05 / ExternalMessageMapping

### 问题、诊断与取舍

归属U1 Domain `binding/external_message_mapping.rs`；enum=`MessageMappingState`。全字段/签名回指[Step6 ExternalMessageMapping](03_ddd_step_06_domain_contracts.md#externalmessagemapping)，C03/E01/J01/J05/Q01。已知owner/platform回链与删除处分不同；采用原source/version/origin及typed known结果，不从ACK、Edit/Delete通知或OwnerAccepted生成Tombstone。敏感正文不入映射。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Linked | 原locator/source/known结果受权关联 | 否 | match_change/invalidate/record_tombstone |
| Stale | 消费资格失效，locator历史仍保留 | 否 | 仅原known删除处分可record_tombstone |
| Tombstoned | 原删除处分已记，非owner实体删除 | 是 | 受限历史核对；无回Linked |

### ASCII转换图

```text
[link_known] -> Linked --invalidate--> Stale
                 |                      |
                 +---known disposition--+--> Tombstoned
```

Tombstoned只记录原变化结果，不转化成平台/Conversation实体真相。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| ML | Mapping.get_message及原binding/generation完整11字段；external_message/source_ref_version/change_kind/owner_result/effect_ref/generation_direction/origin_marker/mapping_basis；Binding.qualify_message_mapping与KnownMappingResultRef同原locator/target/source/代际，origin核self-send回环 |
| MI | Binding.qualify_mapping_invalidation actual MappingInvalidationBasisRef、actor和message ref；local expected等actual row；保原known回链 |
| MT | C03 caller处分经Binding.qualify_tombstone实际正式owner解引用；同原message/source/version/target/actor/Delete/current/期限/撤销；不是shape合法就获准；原row仅Linked/Stale/local CAS |

`ExternalMessageMapping.link_known` @ C03/E01/J01：十二参完整ML，固定Linked/local1；OwnerAccepted分支Established owner slot，PlatformAccepted分支Established原effect；AuthorizedRelation不伪造accepted；新link拒绝无原mapping的Delete。stage_message Absent及原locator/action/generation unique。Edit/Delete/Reply必须原mapping并调用`match_change`，缺原source/mapping fresh E01采用既有零durable carve-out，不hash正文/dummy source。Tombstoned只受限历史核对，不重新适用变化。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Linked | Stale | `ExternalMessageMapping.invalidate` @ C03/J05 | MI + local expected | local next；原locator/result/source不删；U message | E0/E1/E2 |
| Linked | Tombstoned | `ExternalMessageMapping.record_tombstone` @ C03 | MT actual正式处分 | local next；只记原处分历史；U message | E0/E1/E2/E3 |
| Stale | Tombstoned | `ExternalMessageMapping.record_tombstone` @ C03 | MT核当前删除处置，不借旧失效资格 | 同上；不复活消费资格 | E0/E1/E2/E3 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| ACK/accepted/平台delete通知直接Tombstoned、跨locator或异版本处分 | E2/E3、PE::NotEstablished/Denied；零候选/audit，不创建owner删除接口 |
| Tombstoned回Linked、旧key/version晚到create当新消息、无known结果建Linked | E0/E2/E3；保原op/结果、零复活/第二effect |
| 把raw message/body hash/token/附件URL写mapping/audit | E4；只正式safe refs、private瞬时材料，不能绕Artifact/Gate |

02概念允许E01/J01迟到delete finalize，但当前具体flow没有qualified处分分支；本步只C03显式MT，E01/J01 known回链不隐式tombstone，J05仅invalidate。不是reserved新成员或新增入口。具体U：C03选定message；E01 owner结果/J01 attempt结果同其原对象完整CAS+Mapping.stage_message，原key/immutable result/audit/正式条件handoff；不能部分提交回链。MT compatible owner查询缺失时NotEstablished保原状态。planned D逐3边/终态；A处分actor/current；Csource/change/origin回环及unknown不link；B四平台编辑删除线程差异；L关联CAS/unique/late结果；P禁止正文/secret；R受限历史。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 3状态/3边匹配enum/02/原成员；ML/MI/MT/current/实际回链及C03显式删除处分已核，E01/J01零隐式tombstone、J05不delete；U/测试闭合，无reserved，owner compatible资格未解除 |
