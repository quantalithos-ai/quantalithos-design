# L6-bridges 02 Step6 U6：安全读取与追溯支撑对象附录

## 模块状态

done / pass；当前U6先骨架/思考后写入并停审；输入Step5 U6、01同名单元，规范4.6。完整Step门禁见主文件。

## 筛选与对象骨架

### SafeAuditRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U6 安全读取与追溯支撑 |
| 对象类型 | 不可变局部安全历史记录 |
| 主要责任 | 唯一mutation producer阶段记录；不是evidence |
| 功能来源 | U6-C1；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| audit_ref | SafeAuditRef | 局部历史identity |
| mutation_ref | LocalMutationRef | 真实本仓变更及UoW/revision |
| operation_ref | BridgeOperationRef | 原operation关联 |
| subject_refs | AuthorizedSafeSubjectRefSet | 当前获准记录的安全对象引用 |
| stage_reason | SafeStageReason | 独立阶段与有限reason |
| basis_refs | SafeBasisRefSet | 来源/version/scope，不含敏感审批 |
| trace_ref | TrustedTraceRef | 沿可信metadata来源，不重复造trace |
| producer_revision | SafeProducerSchemaRevision | body-free producer契约版本，不证明准入 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| 不适用 | 不可变结果/历史或只读projection；不构造独立生命周期 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| safe_summary(CurrentReadQualification read_basis) | 只在当前可读scope读取已记录摘要 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_mutation(LocalMutationRef mutation, BodyFreeMutationMaterial material, TrustedTraceRef trace) | 与mutation同UoW写安全记录；拒绝不造accepted |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 无消息/附件/secret/私有callback/rawerror/bodyhash/敏感Gate；不造EV/report/verdict。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### SafeHandoffRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U6 安全读取与追溯支撑 |
| 对象类型 | 局部安全交接状态记录 |
| 主要责任 | canonical safe producer材料的真实consumer交接；条件具备才建 |
| 功能来源 | U6-C2；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| handoff_ref | SafeHandoffRef | 局部交接identity |
| source_audit_ref | SafeAuditRef | 真实唯一安全producer来源 |
| canonical_material_ref | CanonicalSafeMaterialRef | 正式schema与ref-only材料，不含body |
| producer_admission | ProducerAdmissionRef | consumer准入scope/version，缺失blocked |
| operation_ref | BridgeOperationRef | handoff namespace稳定operation |
| consumer_result | ConsumerDispositionRefSlot | 实际accepted/rejected/pending/unknown ref |
| retention_window | QualifiedRetentionWindowRef | 受限安全交接窗口/预算 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| pending | canonical材料及准入具备，尚未交接 |
| dispatching | 可能已交给consumer |
| consumer_accepted | consumer正式结果，不等evidence/验收 |
| consumer_rejected | consumer明确拒绝 |
| indeterminate | 交接结果未知 |
| blocked | 缺准入/schema/权限或材料失效 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| begin_handoff(ProducerAdmissionRef admission, SafeHandoffClaimRef claim) | 只交canonical安全材料 |
| apply_consumer_result(ConsumerDispositionRef result) | 不以本地日志替consumer accepted |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_canonical(SafeAuditRef source, CanonicalSafeMaterialRef material, ProducerAdmissionRef admission) | 没有canonical payload不发明每变更outbox |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 不复制Observability report/evidence真相，不用empty/material cache补准入。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


### BridgeLocalView

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | U6 安全读取与追溯支撑 |
| 对象类型 | 只读局部projection |
| 主要责任 | 基于既有状态和当前可读资格提供有限视图 |
| 功能来源 | U6-C3；Step5同名候选 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_subject | BridgeViewSubjectRef | 既有installation/binding/operation/continuity/handoff subject |
| scope_ref | AuthorizedReadScopeRef | resolver先行，非ref字符串推scope |
| stage_slice | SafeStageSlice | 各独立阶段，不给GlobalSuccess |
| qualified_refs | VisibleSafeRefSet | 仅当前允许的refs/count；未获准隐去 |
| freshness | ViewFreshnessKind | 已有revision与stale/degraded说明，不执行refresh |
| availability | SafeViewDisposition | qualified/degraded/denied/unavailable，不用空值冒充失败 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| 不适用 | 不可变结果/历史或只读projection；不构造独立生命周期 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| project(CurrentReadQualification read_basis, ExistingLocalSnapshot snapshot) | 纯只读，过滤隐含count/ref泄漏 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_existing(BridgeViewSubjectRef subject, ExistingLocalSnapshot snapshot, CurrentReadQualification read_basis) | 不创建domain记录或运行job |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 责任边界 | 无审计/idempotency写、refresh/repair/replay；不返回rawbody/secret/敏感Gate。 |
| 材料与深度 | 安全ref需来源/版本/可见性/失效合同；不落raw body/secret/敏感材料；完整schema/签名/DDL到03 |


## 模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 候选处理 | pass | 3个对象独立成节；guard/ref/切片/port排除依据见主文件当前模块 |
| 功能/字段/行为闭环 | pass | 每卡回指capability；关键字段typed；参数TypeName parameter，无返回实现签名 |
| 状态与责任 | pass | lifecycle只属局部主语；immutable记录/projection标不适用；owner/platform truth只引用 |
| 反查 | pass | Step8使用当前对象；Step9按状态适用性筛选；新增对象必须回本Step |
| 缺口 | preserved | support carrier完整合同留03；BR-UP不关闭，未建立实现资格 |
