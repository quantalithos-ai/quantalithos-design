# L6-bridges 02 Step 6：关键对象轮廓

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§6。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step4/5；SOP6/规范4.6已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done / 六部分串行 |
| 结构化/复杂度 | done / 六附录20卡 |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step4/5；SOP6/规范4.6；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

问题1~16按U1~U6逐部分回答于下列模块思考与六附录：20局部候选逐一独立正式化；guard/ref/view切片、API/port/repository明确排除。字段typed、函数参数以TypeName parameter表示；无完整schema/返回签名/DDL。状态有主语，不把immutable receipt/audit/view画生命周期。

### U1 思考

配置资格、关系授权、三mapping定位必须分离；message mapping的建立依据只能是受权管理或已知owner/平台结果，不允许任意external ID认领内部事实。

筛选：BridgeInstallation ← U1-C1；ExternalBinding ← U1-C2；ExternalIdentityMapping ← U1-C3；ExternalLocationMapping ← U1-C3；ExternalMessageMapping ← U1-C3 / U2-C3 / U3-C3全部独立保留，分别为局部实体/记录/投影。CurrentBindingGuard / MappingSourceGuard仅以上对象不变量，AuthorizedBasisRef / ActorTargetRef / PlatformLocator仅typed字段，无自身本地truth/生命周期；BindingSafeView字段类型按BridgeLocalView slice承接；BindingQualificationPort、MappingRepository、InstallationRepository为接口，留Step7。字段与函数只到概要骨架；每个stateful主语预期在Step9闭合，receipt/audit/view不画状态机。思考done，当前U1对象写入允许。

### U2 思考

必须先分平台来源、当前内部资格和owner交接三段。安全material无资格时拒绝/blocked，不能为可恢复性写正文。缺原mapping变化隔离，不冒充create。

筛选：InboundHandoffRecord ← U2-C1~C3全部独立保留，分别为局部实体/记录/投影。IngressAuthorityGuard / SourceIsolationGuard仅以上对象不变量，SafeSourceRef / BridgeTargetMode / ActorRef仅typed字段，无自身本地truth/生命周期；InboundStageView字段类型按BridgeLocalView slice承接；PlatformIngressPort、ConversationHandoffPort、InboundRepository为接口，留Step7。字段与函数只到概要骨架；每个stateful主语预期在Step9闭合，receipt/audit/view不画状态机。思考done，当前U2对象写入允许。

### U3 思考

plan、effect、attempt和receipt是不同主语；Gate降级是获准的存在性/安全提示/入口能力选择，不是把审批正文截短。投递payload只私有瞬时重建，原plan失效不能在同effect换材料。

筛选：SafePresentationPlan ← U3-C1；DeliveryIntent ← U3-C2~C3；DeliveryAttempt ← U3-C2~C3；PlatformReceipt ← U3-C2~C3全部独立保留，分别为局部实体/记录/投影。PresentationGuard / DispatchEligibilityGuard仅以上对象不变量，CommittedSourceRef / AllowedProjectionRef / AttachmentGrantRef仅typed字段，无自身本地truth/生命周期；DeliveryStageView字段类型按BridgeLocalView slice承接；PresentationQualificationPort、PlatformDeliveryPort、DeliveryRepository为接口，留Step7。字段与函数只到概要骨架；每个stateful主语预期在Step9闭合，receipt/audit/view不画状态机。思考done，当前U3对象写入允许。

### U4 思考

签名只能验证来源；action binding必须把actor责任和target/owner revision绑牢。one-use在局部原子claim后不可复活；owner未知只按原operation查结果，不重新approve。

筛选：ExternalActionBinding ← U4-C1；CallbackHandoffRecord ← U4-C2~C3全部独立保留，分别为局部实体/记录/投影。CallbackResponsibilityGuard / OneUseGuard仅以上对象不变量，OwnerActionRef / ActorResponsibilityRef / SourceIntentRef仅typed字段，无自身本地truth/生命周期；CallbackStageView字段类型按BridgeLocalView slice承接；CallbackVerificationPort、ActorResponsibilityPort、OwnerActionPort、CallbackRepository为接口，留Step7。字段与函数只到概要骨架；每个stateful主语预期在Step9闭合，receipt/audit/view不画状态机。思考done，当前U4对象写入允许。

### U5 思考

dedup、stream位置、gap、lane和recovery不能合一个offset表：authority与状态触发不同。恢复job只编排原记录的qualified probe/finalize，缺ref/window/coverage则保持人工出口。

筛选：DedupRecord ← U5-C1；StreamCursor ← U5-C2；GapRecord ← U5-C2 / C4；DispatchLane ← U5-C3；RecoveryRecord ← U5-C4全部独立保留，分别为局部实体/记录/投影。SameMeaningGuard / ComparableCursorGuard / RetryEligibilityGuard仅以上对象不变量，NamespaceRef / ComparatorRef / CoverageRef / NoEffectBasisRef仅typed字段，无自身本地truth/生命周期；ContinuityView字段类型按BridgeLocalView slice承接；ContinuityRepository、AuthoritativeRecoveryPort、LaneRepository为接口，留Step7。字段与函数只到概要骨架；每个stateful主语预期在Step9闭合，receipt/audit/view不画状态机。思考done，当前U5对象写入允许。

### U6 思考

局部mutation审计、实际handoff与safe read是不同对象；view没有生命周期，不重写producer事实。只在真实canonical事件存在时交接，平台错误raw string也必须转有限reason。

筛选：SafeAuditRecord ← U6-C1；SafeHandoffRecord ← U6-C2；BridgeLocalView ← U6-C3全部独立保留，分别为局部实体/记录/投影。BodyFreeMaterialGuard / CurrentReadGuard仅以上对象不变量，ProducerAdmissionRef / ConsumerResultRef / ReadBasisRef仅typed字段，无自身本地truth/生命周期；BridgeLocalView独立projection按独立BridgeLocalView承接；SafeObservationPort、SafeReadQualificationPort、SafeTraceRepository为接口，留Step7。字段与函数只到概要骨架；每个stateful主语预期在Step9闭合，receipt/audit/view不画状态机。思考done，当前U6对象写入允许。

## 4. 当前文档问题诊断

需要保留映射kind/authority/version、stable effect、one-use与cursor coverage的独立对象，不可把多mapping压一张对象组表。另一方面OwnerRequiredDigestRef只能来自qualified material合同，不自动等正文hash或安全evidence；safe ref仍需03定义可见性/到期/解析失败。

## 5. 改动前后对比

| Step5候选 | 本Step处理 | 详细设计保留 |
|---|---|---|
| 20局部对象 | 独立基本信息/字段/状态/方法/工厂/禁止表 | 完整字段与enum序列化、ownership/UoW约束 |
| guard/ref/切片 | 不变量、字段类型与BridgeLocalView slice，非独立truth | 每support carrier正式定义、source、resolver、失效 |
| port/repository | 边界不是Domain对象 | Step7语义，03完整trait/driver |

## 6. 设计取舍

重内容六附录，按U逐个建骨架、思考、对象卡与停审，再下一U；正式§6仍保留全部独立卡而不是只链附录。mapping的typed locator与authority是骨架，不在02展开全schema。无分布图，因为唯一归属可由六附录和筛选表说明。所有support types必须由03闭口，不能由实现猜测。

## 7. 结构化中间产物

### 对象候选池筛选与附录索引

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| BridgeInstallation | U1 Truth/State/Projection/Audit；U1-C1 | 独立正式关键对象 | 安装命名空间与版本化config/能力/secret绑定，不表示平台安装truth；见[U1对象附录](02_hld_step_06_u1_objects.md#bridgeinstallation) |
| ExternalBinding | U1 Truth/State/Projection/Audit；U1-C2 | 独立正式关键对象 | 将外部位置/主体与内部typed target按basis绑定；见[U1对象附录](02_hld_step_06_u1_objects.md#externalbinding) |
| ExternalIdentityMapping | U1 Truth/State/Projection/Audit；U1-C3 | 独立正式关键对象 | 关联外部account kind与正式内部责任ref；见[U1对象附录](02_hld_step_06_u1_objects.md#externalidentitymapping) |
| ExternalLocationMapping | U1 Truth/State/Projection/Audit；U1-C3 | 独立正式关键对象 | 关联channel/DM/topic/thread及内部scope；见[U1对象附录](02_hld_step_06_u1_objects.md#externallocationmapping) |
| ExternalMessageMapping | U1 Truth/State/Projection/Audit；U1-C3 / U2-C3 / U3-C3 | 独立正式关键对象 | 回链原external message/change和内部已知accepted ref或原effect；见[U1对象附录](02_hld_step_06_u1_objects.md#externalmessagemapping) |
| InboundHandoffRecord | U2 Truth/State/Projection/Audit；U2-C1~C3 | 独立正式关键对象 | 安全输入阶段、owner交接与独立protocol disposition；见[U2对象附录](02_hld_step_06_u2_objects.md#inboundhandoffrecord) |
| SafePresentationPlan | U3 Truth/State/Projection/Audit；U3-C1 | 独立正式关键对象 | 记录获准projection选择与safe材料资格，不保存payload；见[U3对象附录](02_hld_step_06_u3_objects.md#safepresentationplan) |
| DeliveryIntent | U3 Truth/State/Projection/Audit；U3-C2~C3 | 独立正式关键对象 | 固定一次外部逻辑操作含义，attempt不得变义；见[U3对象附录](02_hld_step_06_u3_objects.md#deliveryintent) |
| DeliveryAttempt | U3 Truth/State/Projection/Audit；U3-C2~C3 | 独立正式关键对象 | 追加一次可能外呼的claim/fence与有限结果；见[U3对象附录](02_hld_step_06_u3_objects.md#deliveryattempt) |
| PlatformReceipt | U3 Truth/State/Projection/Audit；U3-C2~C3 | 独立正式关键对象 | 记录已知平台业务响应的来源和locator，不复制平台truth；见[U3对象附录](02_hld_step_06_u3_objects.md#platformreceipt) |
| ExternalActionBinding | U4 Truth/State/Projection/Audit；U4-C1 | 独立正式关键对象 | 把获准action与source/actor/target/owner revision固定；见[U4对象附录](02_hld_step_06_u4_objects.md#externalactionbinding) |
| CallbackHandoffRecord | U4 Truth/State/Projection/Audit；U4-C2~C3 | 独立正式关键对象 | 分离callback ACK、验证、one-use与owner action结果；见[U4对象附录](02_hld_step_06_u4_objects.md#callbackhandoffrecord) |
| DedupRecord | U5 Truth/State/Projection/Audit；U5-C1 | 独立正式关键对象 | 隔离namespace/scope的同义操作与原结果；见[U5对象附录](02_hld_step_06_u5_objects.md#deduprecord) |
| StreamCursor | U5 Truth/State/Projection/Audit；U5-C2 | 独立正式关键对象 | 分别追踪protocol/owner/delivery流，不宣称全局水位；见[U5对象附录](02_hld_step_06_u5_objects.md#streamcursor) |
| GapRecord | U5 Truth/State/Projection/Audit；U5-C2 / C4 | 独立正式关键对象 | 保留不连续/不可比范围直到权威coverage或manual disposition；见[U5对象附录](02_hld_step_06_u5_objects.md#gaprecord) |
| DispatchLane | U5 Truth/State/Projection/Audit；U5-C3 | 独立正式关键对象 | 控制获准target lane与多级平台等待下界；见[U5对象附录](02_hld_step_06_u5_objects.md#dispatchlane) |
| RecoveryRecord | U5 Truth/State/Projection/Audit；U5-C4 | 独立正式关键对象 | 记录原operation/effect的probe/coverage和finalize-only计划；见[U5对象附录](02_hld_step_06_u5_objects.md#recoveryrecord) |
| SafeAuditRecord | U6 Truth/State/Projection/Audit；U6-C1 | 独立正式关键对象 | 唯一mutation producer阶段记录；不是evidence；见[U6对象附录](02_hld_step_06_u6_objects.md#safeauditrecord) |
| SafeHandoffRecord | U6 Truth/State/Projection/Audit；U6-C2 | 独立正式关键对象 | canonical safe producer材料的真实consumer交接；条件具备才建；见[U6对象附录](02_hld_step_06_u6_objects.md#safehandoffrecord) |
| BridgeLocalView | U6 Truth/State/Projection/Audit；U6-C3 | 独立正式关键对象 | 基于既有状态和当前可读资格提供有限视图；见[U6对象附录](02_hld_step_06_u6_objects.md#bridgelocalview) |
| CurrentBindingGuard / MappingSourceGuard | U1 Policy/Invariant | 仅对应对象guard，不独立对象 | 本仓不持有policy truth；guard没有独立identity/lifecycle，由对象函数/应用当前basis检查承接 |
| IngressAuthorityGuard / SourceIsolationGuard | U2 Policy/Invariant | 仅对应对象guard，不独立对象 | 本仓不持有policy truth；guard没有独立identity/lifecycle，由对象函数/应用当前basis检查承接 |
| PresentationGuard / DispatchEligibilityGuard | U3 Policy/Invariant | 仅对应对象guard，不独立对象 | 本仓不持有policy truth；guard没有独立identity/lifecycle，由对象函数/应用当前basis检查承接 |
| CallbackResponsibilityGuard / OneUseGuard | U4 Policy/Invariant | 仅对应对象guard，不独立对象 | 本仓不持有policy truth；guard没有独立identity/lifecycle，由对象函数/应用当前basis检查承接 |
| SameMeaningGuard / ComparableCursorGuard / RetryEligibilityGuard | U5 Policy/Invariant | 仅对应对象guard，不独立对象 | 本仓不持有policy truth；guard没有独立identity/lifecycle，由对象函数/应用当前basis检查承接 |
| BodyFreeMaterialGuard / CurrentReadGuard | U6 Policy/Invariant | 仅对应对象guard，不独立对象 | 本仓不持有policy truth；guard没有独立identity/lifecycle，由对象函数/应用当前basis检查承接 |
| AuthorizedBasisRef / ActorTargetRef / PlatformLocator | U1 Reference/Boundary | 仅typed字段 | 非本仓truth；03须定义resolver、source/version、scope、expiry和失败，不让实现猜 |
| SafeSourceRef / BridgeTargetMode / ActorRef | U2 Reference/Boundary | 仅typed字段 | 非本仓truth；03须定义resolver、source/version、scope、expiry和失败，不让实现猜 |
| CommittedSourceRef / AllowedProjectionRef / AttachmentGrantRef | U3 Reference/Boundary | 仅typed字段 | 非本仓truth；03须定义resolver、source/version、scope、expiry和失败，不让实现猜 |
| OwnerActionRef / ActorResponsibilityRef / SourceIntentRef | U4 Reference/Boundary | 仅typed字段 | 非本仓truth；03须定义resolver、source/version、scope、expiry和失败，不让实现猜 |
| NamespaceRef / ComparatorRef / CoverageRef / NoEffectBasisRef | U5 Reference/Boundary | 仅typed字段 | 非本仓truth；03须定义resolver、source/version、scope、expiry和失败，不让实现猜 |
| ProducerAdmissionRef / ConsumerResultRef / ReadBasisRef | U6 Reference/Boundary | 仅typed字段 | 非本仓truth；03须定义resolver、source/version、scope、expiry和失败，不让实现猜 |
| BindingSafeView字段类型 | U1 Projection | BridgeLocalView切片，非独立projection | 只反映现存局部阶段，共用只读过滤；无独立lifecycle/refresh任务 |
| InboundStageView字段类型 | U2 Projection | BridgeLocalView切片，非独立projection | 只反映现存局部阶段，共用只读过滤；无独立lifecycle/refresh任务 |
| DeliveryStageView字段类型 | U3 Projection | BridgeLocalView切片，非独立projection | 只反映现存局部阶段，共用只读过滤；无独立lifecycle/refresh任务 |
| CallbackStageView字段类型 | U4 Projection | BridgeLocalView切片，非独立projection | 只反映现存局部阶段，共用只读过滤；无独立lifecycle/refresh任务 |
| ContinuityView字段类型 | U5 Projection | BridgeLocalView切片，非独立projection | 只反映现存局部阶段，共用只读过滤；无独立lifecycle/refresh任务 |
| BindingQualificationPort、MappingRepository、InstallationRepository、BindingApplication、MappingApplication | U1代码主体 | 留Step7/8，非Domain对象 | Application/port/repository有边界行为，不默认升级聚合；完整class/trait/driver留03 |
| PlatformIngressPort、ConversationHandoffPort、InboundRepository、InboundApplication | U2代码主体 | 留Step7/8，非Domain对象 | Application/port/repository有边界行为，不默认升级聚合；完整class/trait/driver留03 |
| PresentationQualificationPort、PlatformDeliveryPort、DeliveryRepository、PresentationApplication、DeliveryApplication | U3代码主体 | 留Step7/8，非Domain对象 | Application/port/repository有边界行为，不默认升级聚合；完整class/trait/driver留03 |
| CallbackVerificationPort、ActorResponsibilityPort、OwnerActionPort、CallbackRepository、CallbackApplication | U4代码主体 | 留Step7/8，非Domain对象 | Application/port/repository有边界行为，不默认升级聚合；完整class/trait/driver留03 |
| ContinuityRepository、AuthoritativeRecoveryPort、LaneRepository、ContinuityApplication、RecoveryJob | U5代码主体 | 留Step7/8，非Domain对象 | Application/port/repository有边界行为，不默认升级聚合；完整class/trait/driver留03 |
| SafeObservationPort、SafeReadQualificationPort、SafeTraceRepository、SafeReadApplication、SafeHandoffApplication | U6代码主体 | 留Step7/8，非Domain对象 | Application/port/repository有边界行为，不默认升级聚合；完整class/trait/driver留03 |

六附录为本Step对象结构正文；正式§6仍逐一回填全部20对象。所有卡中的概要类型名不是已存在SDK公开schema；已存在BridgeTargetMode/ActorRef/metadata沿owner来源绑定，其余support carrier逐项由03关闭，缺口保持blocked。

#### 与Step8/9反查清单

| 部分 | 预期flow使用对象 | 状态适用性 |
|---|---|---|
| U1 | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping | BridgeInstallation：stateful；ExternalBinding：stateful；ExternalIdentityMapping：stateful；ExternalLocationMapping：stateful；ExternalMessageMapping：stateful |
| U2 | InboundHandoffRecord | InboundHandoffRecord：stateful |
| U3 | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt | SafePresentationPlan：stateful；DeliveryIntent：stateful；DeliveryAttempt：stateful；PlatformReceipt：immutable/readonly，不画机 |
| U4 | ExternalActionBinding、CallbackHandoffRecord | ExternalActionBinding：stateful；CallbackHandoffRecord：stateful |
| U5 | DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord | DedupRecord：stateful；StreamCursor：stateful；GapRecord：stateful；DispatchLane：stateful；RecoveryRecord：stateful |
| U6 | SafeAuditRecord、SafeHandoffRecord、BridgeLocalView | SafeAuditRecord：immutable/readonly，不画机；SafeHandoffRecord：stateful；BridgeLocalView：immutable/readonly，不画机 |


### 跨对象 / 组成部分审计

Step9反查一致性修正：configured/pending/verified/blocked/claimed前等阶段不能伪造尚未取得的qualification/material/one-use引用，已将对应关键字段显式为typed Slot；有权执行/接受状态必须补齐其正式来源。Slot具体variant/编码由03闭口；不改变对象owner、能力或架构选择。Inbound导出owner协议target_mode/actor/digest的required规则不变。

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选完整与归属 | pass | 20对象各有capability、唯一U；guard/ref/port/切片均有筛选理由 |
| 独立骨架 | pass | 每卡6类表；字段TypeName；成员/工厂TypeName parameter；不压成对象组 |
| 状态适用 | pass | 17局部stateful对象；PlatformReceipt/SafeAuditRecord/BridgeLocalView无独立生命周期 |
| authority链 | pass | mapping basis、required digest、known receipt与consumer disposition只引用正式来源；无rawbody hash |
| 反查与深度 | pass | 后续§8/9只能用这里已定义对象；类型全集/序列化/返回签名/DDL留03 |
| 外部资格 | preserved | BR-UP不关闭，formal对象不是安装/联调/实施成功或readiness |

复杂度：对象20个，正文不可缩总览，按六附录/逐对象100行内卡分批；不补分布图，唯一归属和ref职责由表足以说明。


## 8. 回填草稿

正式§6先筛选说明，按U排列独立对象卡；全部卡内容回填不只引用附录。包含反查表和support carrier责任，不携入逐模块诊断/停审过程。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

六U对象正式化已逐一停审；20候选、所有shared排除有理由；字段/函数typed、状态适用性明确；跨审pass，无未定义局部主语。gate_status=pass；gate_reason=object_cards_and_cross_audit_closed；next_allowed_action=step07_interfaces；formal_backfill_allowed=after_step14；commit_required=false。
