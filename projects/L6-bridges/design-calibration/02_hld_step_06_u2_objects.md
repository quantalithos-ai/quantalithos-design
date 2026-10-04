# L6-bridges 02 Step6 U2：入站交接对象附录

## 模块状态

done / pass；当前U2先骨架/思考后写入并停审；输入Step5 U2、01同名单元，规范4.6。完整Step门禁见主文件。

## 筛选与对象骨架

### InboundHandoffRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U2 入站交接 |
| 对象类型 | 局部交接记录 |
| 主要责任 | 安全输入阶段、owner交接与独立protocol disposition |
| 功能来源 | U2-C1~C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| record_ref | InboundRecordRef | 局部安全记录identity |
| source_ref | SafeSourceRefSlot | verified来源可无replay资格；handoff前必须有安全可读材料来源，无raw event |
| operation_ref | BridgeOperationRef | 原owner交接identity，重复/恢复复用 |
| mapping_context | AuthorizedMappingContextRefSlot | 未受权可缺；handoff前当前relation/generation、原change/thread mapping必齐 |
| target_mode | BridgeTargetModeSlot | 本地未受权阶段可缺；导出owner协议时BridgeTargetMode required，不自造模式 |
| actor_ref | ActorRefSlot | 本地未受权阶段可缺；导出owner协议时ActorRef required，AppendFact为Integration |
| material_ref | QualifiedMaterialRefSlot | blocked可缺；handoff前owner可接收safe payload/ref及有效性必须成立 |
| required_digest_ref | OwnerRequiredDigestRefSlot | Required分支必有且匹配，由qualified material合同供给；非正文hash证据 |
| protocol_disposition | ProtocolAckDisposition | 平台ACK阶段，与owner结果分离 |
| owner_result | OwnerHandoffResultRefSlot | accepted/rejected/pending的真实owner结果引用 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| verified | 来源验证已成立，未证明内部可交接 |
| blocked | 材料/责任/资格缺口 |
| quarantined | 伪来源/回环/冲突/缺原关系被隔离 |
| handoff_pending | 原operation已局部接管并尝试交owner |
| owner_accepted | owner正式accepted fact/manifestation，不等Turn |
| owner_rejected | owner明确拒绝 |
| indeterminate | owner effect未知，仅同operation对账 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| qualify(AuthorizedMappingContextRef context, QualifiedMaterialRef material) | 核actor/target mode/digest来源 |
| begin_handoff(BridgeOperationRef operation, HandoffClaimRef claim) | 网络前记录原operation |
| apply_owner_result(OwnerHandoffResultRef result) | 真实结果finalize，不看ACK升级 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_verified(VerifiedPlatformSourceRef source, SafeSourceRef safe_source, BridgeOperationRef operation) | 无安全来源时不能承诺replay；无raw inbox |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不制造submitTurn/accepted，不持久化正文、私有context或原body digest。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


## 模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选处理 | pass | 1个对象独立成节；guard/ref/切片/port排除依据见主文件当前模块 |
| 功能/字段/行为闭环 | pass | 每卡回指capability；关键字段typed；参数TypeName parameter，无返回实现签名 |
| 状态与责任 | pass | lifecycle只属局部主语；immutable记录/projection标不适用；owner/platform truth只引用 |
| 反查 | pass | Step8使用当前对象；Step9按状态适用性筛选；新增对象必须回本Step |
| 缺口 | preserved | support carrier完整合同留03；BR-UP不关闭，未建立实现资格 |
