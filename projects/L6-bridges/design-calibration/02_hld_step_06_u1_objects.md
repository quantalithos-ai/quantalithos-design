# L6-bridges 02 Step6 U1：受权绑定与映射对象附录

## 模块状态

done / pass；当前U1先骨架/思考后写入并停审；输入Step5 U1、01同名单元，规范4.6。完整Step门禁见主文件。

## 筛选与对象骨架

### BridgeInstallation

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U1 受权绑定与映射 |
| 对象类型 | 局部配置实体 |
| 主要责任 | 安装命名空间与版本化config/能力/secret绑定，不表示平台安装truth |
| 功能来源 | U1-C1；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| installation_ref | BridgeInstallationRef | 本仓稳定配置identity |
| namespace | InstallationNamespace | platform/server/environment/installation，外部workspace非内部Workspace |
| platform_kind | PlatformKind | Slack/Mattermost/Telegram/Discord类型，不承诺支持 |
| config_revision | ConfigRevision | 受权配置版本，与generation/能力版本分离 |
| capability_ref | CapabilitySnapshotRef | 逐安装入口/方法/方向/版本资格引用 |
| secret_binding | OpaqueSecretBindingRef | provider/version/scope/revoke资格，无raw值 |
| route_policy | RoutePolicyRef | 获准endpoint/context与出入口隔离，无私有URL |
| qualification | InstallationQualificationRefSlot | configured/blocked时可缺；qualified时必须有current有限资格/basis/expiry，不替内部授权 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| configured | 配置已接纳但未证明可运行 |
| qualified | 当前seam资格可用，不证明任何业务提交 |
| blocked | 能力/secret/route依据缺失 |
| suspended | 管理停用阻新派发 |
| retired | 本地配置停用终态，保历史引用 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| apply_revision(ConfigRevision revision, ConfigurationBasisRef basis) | 受权配置更新，不修改历史effect |
| record_qualification(InstallationQualificationRef qualification) | 维护job写资格，不经query刷新 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| configure(InstallationNamespace namespace, ConfigurationBasisRef basis, OpaqueSecretBindingRef secret_binding) | 仅本地安全配置初始化 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不存token/secret；不以qualified宣称平台授权或绑定可用。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### ExternalBinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U1 受权绑定与映射 |
| 对象类型 | 局部授权关系聚合 |
| 主要责任 | 将外部位置/主体与内部typed target按basis绑定 |
| 功能来源 | U1-C2；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| binding_ref | ExternalBindingRef | 本仓relation identity |
| installation_ref | BridgeInstallationRef | 隔离安装命名空间 |
| external_scope | ExternalScopeLocator | 平台账户/位置kind与scope定位 |
| internal_target | BridgeInternalTargetRef | 正式Conversation/scope等typed target，来源先resolver |
| actor_basis | ActorResponsibilityRefSlot | pending可缺；active前human/AI/Integration责任链必齐，不由external ID生成 |
| authorization_basis | AuthorizedBindingBasisRefSlot | pending可缺；active必须正式授权ref/version、可见性与expiry |
| directions_actions | BridgeDirectionActionSet | 明确inbound/outbound/callback及action范围 |
| generation | BindingGeneration | 每次可执行关系变化CAS代际 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| pending | 必要依据未齐，不许可动作 |
| active | 当前relation可消费，仍需每次owner gate |
| suspended | 暂停阻新动作与旧排队 |
| revoked | 终态撤销，不能复活原relation |
| expired | 到期不可执行；历史关联保留 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| activate(AuthorizedBindingBasisRef basis, ExpectedGeneration expected) | 只有完整current资格激活 |
| suspend(ExpectedGeneration expected, SafeReasonCode reason) | 递增generation并阻后续dispatch |
| revoke(ExpectedGeneration expected, RevocationBasisRef basis) | 撤销关系，不撤销已发生owner/平台事实 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| propose(ExternalScopeLocator external_scope, BridgeInternalTargetRef target, AuthorizedBindingBasisRef basis) | 构造显式待核relation |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 配置/OAuth/签名不授内部权；revoked/expired需新关系与新basis，不复活。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### ExternalIdentityMapping

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U1 受权绑定与映射 |
| 对象类型 | 局部受权mapping实体 |
| 主要责任 | 关联外部account kind与正式内部责任ref |
| 功能来源 | U1-C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| mapping_ref | IdentityMappingRef | 局部mapping identity |
| external_account | ExternalAccountLocator | platform/installation/server/account-kind及opaque ID |
| actor_kind | BridgeActorKind | human/AI/Integration，不转换成统一GlobalMember |
| internal_actor | ActorRef | 正式actor resolver结果；AI可引用GlobalMember，不替participant资格 |
| binding_ref | ExternalBindingRef | 当前受权relation |
| generation | BindingGeneration | mapping代际 |
| basis | IdentityMappingBasisRef | 来源/版本/有效期；human owner缺口保持blocked |

#### 状态集合

| 状态 | 作用 |
|---|---|
| valid | 当前版本可消费，仍需当前责任/visibility |
| stale | 依据或代际已不适用 |
| revoked | 局部关系撤销终态 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_applicable(CurrentBindingQualification current, ActorResponsibilityRef actor) | 校验当前kind与责任链 |
| invalidate(MappingInvalidationBasisRef basis) | 标失效，保历史定位 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| link(ExternalAccountLocator account, ActorRef actor, IdentityMappingBasisRef basis) | 只创建关系，不创建主体 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不从mention/display name认人；不自动创建GlobalMember或human认证链。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### ExternalLocationMapping

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U1 受权绑定与映射 |
| 对象类型 | 局部受权mapping实体 |
| 主要责任 | 关联channel/DM/topic/thread及内部scope |
| 功能来源 | U1-C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| mapping_ref | LocationMappingRef | 局部关系identity |
| external_location | ExternalLocationLocator | 安装、kind、channel/DM/topic/thread全定位 |
| parent_location | ParentLocationRefSlot | 明确父子/root，非所有平台都有thread |
| internal_target | BridgeInternalTargetRef | owner确定的Conversation/scope与target mode |
| binding_ref | ExternalBindingRef | 显式授权relation |
| generation | BindingGeneration | 禁止旧目标继续消费 |
| basis | LocationMappingBasisRef | 两端定位/方向/version/能力依据 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| valid | 当前关系可消费 |
| stale | 定位/basis/代际失效 |
| revoked | 局部关系撤销终态 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| resolve_target(CurrentBindingQualification current, DirectionActionKind action) | 拒绝跨kind/方向或默认频道 |
| invalidate(MappingInvalidationBasisRef basis) | 历史定位不被新配置覆写 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| link(ExternalLocationLocator location, BridgeInternalTargetRef target, LocationMappingBasisRef basis) | 构造已解释父子关系的mapping |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不从channel名猜scope，不将外部workspace/team/guild当内部Workspace。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### ExternalMessageMapping

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U1 受权绑定与映射 |
| 对象类型 | 局部来源/结果关联实体 |
| 主要责任 | 回链原external message/change和内部已知accepted ref或原effect |
| 功能来源 | U1-C3 / U2-C3 / U3-C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| mapping_ref | MessageMappingRef | 局部关联identity |
| external_message | ExternalMessageLocator | 安装、位置kind、message及thread/root |
| source_ref_version | SafeSourceVersionRef | 安全来源/版本，不含正文hash |
| change_kind | ExternalChangeKind | create/edit/delete/reply；差异明确 |
| owner_result | OwnerAcceptedRefSlot | 已知fact/manifestation ref，不冒充Turn |
| effect_ref | DeliveryEffectRefSlot | 已知outbound结果原effect，不由平台body生成 |
| generation_direction | MappingGenerationDirection | 关系代际与inbound/outbound |
| origin_marker | VerifiedOriginMarkerRef | 经验证来源及self-send关系，不信用户自报 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| linked | 定位与已知结果回链成立 |
| stale | 当前消费依据失效，历史locator不抹除 |
| tombstoned | 已知受权delete disposition，保原关联；非内部实体删除 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| match_change(ExternalChangeKind kind, SafeSourceVersionRef source) | 仅原mapping与可解释版本 |
| record_tombstone(OwnerChangeDispositionRef disposition) | 记录局部受权变化结果而非删除owner truth |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| link_known(ExternalMessageLocator locator, KnownMappingResultRef result, MappingBasisRef basis) | 只有受权管理/已知owner或平台结果构造 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 缺原mapping用U2隔离/gap；不可把未知receipt编成locator，不物理删除owner真相。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


## 模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选处理 | pass | 5个对象独立成节；guard/ref/切片/port排除依据见主文件当前模块 |
| 功能/字段/行为闭环 | pass | 每卡回指capability；关键字段typed；参数TypeName parameter，无返回实现签名 |
| 状态与责任 | pass | lifecycle只属局部主语；immutable记录/projection标不适用；owner/platform truth只引用 |
| 反查 | pass | Step8使用当前对象；Step9按状态适用性筛选；新增对象必须回本Step |
| 缺口 | preserved | support carrier完整合同留03；BR-UP不关闭，未建立实现资格 |
