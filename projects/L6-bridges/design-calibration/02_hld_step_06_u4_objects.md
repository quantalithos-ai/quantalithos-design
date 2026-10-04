# L6-bridges 02 Step6 U4：交互责任交接对象附录

## 模块状态

done / pass；当前U4先骨架/思考后写入并停审；输入Step5 U4、01同名单元，规范4.6。完整Step门禁见主文件。

## 筛选与对象骨架

### ExternalActionBinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U4 交互责任交接 |
| 对象类型 | 局部一次性交互绑定实体 |
| 主要责任 | 把获准action与source/actor/target/owner revision固定 |
| 功能来源 | U4-C1；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| action_binding_ref | ExternalActionBindingRef | 安全一次性交互identity |
| installation_ref | BridgeInstallationRef | 入口命名空间 |
| source_intent | SourceIntentMessageRef | 已获准外显来源及已知message关系 |
| actor_responsibility | ActorResponsibilityRef | 有权动作责任，不从平台admin推导 |
| target_action | OwnerTargetActionRef | 正式owner目标/action范围 |
| owner_revision | OwnerActionStateRevision | 当前Gate等owner状态来源 |
| binding_generation | BindingGeneration | 关系撤销立即阻后续动作 |
| expiry_one_use | ActionExpiryOneUseRef | 授权期限与局部一次消费 |
| authorization_basis | ActionAuthorizationBasisRef | 披露与action独立正式依据 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| active | 当前可验证action，仍需owner二次核验 |
| claimed | 原operation已原子消费one-use，不可复活 |
| expired | 到期终态 |
| revoked | 撤销终态 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| claim_once(BridgeOperationRef operation, CurrentActionQualification qualification) | 与CallbackHandoffRecord/去重同UoW绑定 |
| revoke(RevocationBasisRef basis) | 阻后续动作，不取消已发生owner事实 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| bind(SourceIntentMessageRef source, OwnerTargetActionRef action, ActionAuthorizationBasisRef basis) | 不存token/response URL；无正式入口不构造 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | claimed/expired/revoked不回active；平台认证、按钮或低敏感标签不能授权审批。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### CallbackHandoffRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U4 交互责任交接 |
| 对象类型 | 局部验证/交接记录 |
| 主要责任 | 分离callback ACK、验证、one-use与owner action结果 |
| 功能来源 | U4-C2~C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| callback_ref | CallbackRecordRef | 局部记录identity |
| operation_ref | BridgeOperationRef | 原owner action操作，所有对账复用 |
| action_binding_ref | ExternalActionBindingRefSlot | rejected/blocked可缺；owner_pending前必须已知一次性绑定 |
| verification_ref | CallbackVerificationRefSlot | 受控拒绝可缺完整proof；verified/owner_pending必须有完整platform/source/actor/target/action/expiry验证 |
| owner_action_ref | OwnerTargetActionRefSlot | rejected/blocked可缺；交接前必须正式action目标 |
| one_use_claim | OneUseClaimRefSlot | verified阶段未消费；owner_pending前必须原子消费并绑原operation，不允许重发新operation |
| protocol_disposition | ProtocolAckDisposition | ACK/defer独立于业务动作 |
| owner_result | OwnerActionResultRefSlot | owner二次核验后的已知结果或未知 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| verified | 完整来源/责任/当前state验证成立 |
| blocked | 缺正式basis或入口合同 |
| rejected | tampered/expired/replayed/cross-target拒绝 |
| owner_pending | one-use已绑定原operation并交接 |
| owner_accepted | owner正式action result，不在本仓制造Decision |
| owner_rejected | owner明确拒绝 |
| indeterminate | owner动作未知，只同operation对账 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| begin_handoff(OneUseClaimRef claim, OwnerActionQualificationRef qualification) | one-use原子消费后只交owner |
| apply_owner_result(OwnerActionResultRef result) | 可信结果finalize，不看按钮/ACK |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_verified(CallbackVerificationRef verification, ExternalActionBindingRef binding, BridgeOperationRef operation) | 仅安全字段，不留私有原输入 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 未知/重复不再次approve，不持久化token、context、URL或审批正文。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


## 模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选处理 | pass | 2个对象独立成节；guard/ref/切片/port排除依据见主文件当前模块 |
| 功能/字段/行为闭环 | pass | 每卡回指capability；关键字段typed；参数TypeName parameter，无返回实现签名 |
| 状态与责任 | pass | lifecycle只属局部主语；immutable记录/projection标不适用；owner/platform truth只引用 |
| 反查 | pass | Step8使用当前对象；Step9按状态适用性筛选；新增对象必须回本Step |
| 缺口 | preserved | support carrier完整合同留03；BR-UP不关闭，未建立实现资格 |
