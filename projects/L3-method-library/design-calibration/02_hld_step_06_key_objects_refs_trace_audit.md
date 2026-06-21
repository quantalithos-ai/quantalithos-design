# L3-method-library 02 概要 Step 6 附录 D: Reference / Trace / Audit 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 状态: object_batch_completed
> 当前模式: full-restart
> Reference 只保存 typed ref 或摘要边界;trace / audit / history / lineage 不替代当前 truth。

---

## 1. 本附录职责边界

| 项目 | 内容 |
|---|---|
| 承载对象 | typed ref、external ref、trace、audit、history、lineage。 |
| 当前对象范围 | `MethodAssetDefinitionRef`;`CatalogScopeRef`;`GovernanceBasisRef`;`ConsumptionContextRef`;`TraceSubjectRef`;`ConsumptionImpactSourceRef`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef`;`ExternalSourceRef`;`ArtifactArchiveRef`;`MaintenanceRunRef`;`RefreshScopeRef`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef`;`MethodAssetAuditTrail`;history / lineage 对象。 |
| 本附录不承载 | core truth 字段全集、policy 算法、read model 实现、job / worker / event payload、外部正文。 |
| 深度限制 | 只写 typed ref 责任、body-free trace/audit 责任和来源回指,不写 payload schema。 |

## 2. 必读输入

| 文档 | 用途 |
|---|---|
| `02_hld_step_06_key_objects.md` §4 | ref / trace / audit 候选池和附录索引。 |
| `02_hld_step_05_components_boundary.md` §5.25 / §5.26 | typed ref、history / audit / lineage 和正文禁止门禁。 |
| `00-需求文档.md` §10 / §11 / §13 / §16 | 业务边界、数据归属、可追溯和追溯矩阵。 |
| `01-架构设计.md` §8 / §9 / §13 | 依赖方向、数据所有权、横切审计和引用边界。 |
| L1-governance reference / audit 附录 | 只参考 reference / audit 卡片格式。 |

## 3. 对象索引

| 对象 | 对象类别 | Step 5 组成部分 | 当前状态 |
|---|---|---|---|
| `MethodAssetDefinitionRef` | typed ref | 方法资产定义与目录 | object_written |
| `CatalogScopeRef` | typed ref | 方法资产定义与目录 | object_written |
| `GovernanceBasisRef` | typed ref / external basis | 正式化与版本 | object_written |
| `ConsumptionContextRef` | typed ref | 受控消费 | object_written |
| `TraceSubjectRef` | typed ref | 追溯与一致性保护 | object_written |
| `ConsumptionImpactSourceRef` | typed ref | 追溯与一致性保护 | object_written |
| `RelatedMethodAssetRef` | typed ref | 关系与分发语义 | object_written |
| `MethodAssetDistributionRef` | typed ref / distribution boundary | 关系与分发语义 | object_written |
| `DistributionContextRef` | typed ref | 关系与分发语义 | object_written |
| `ExternalSourceRef` | external ref | 外部摘要与引用 | object_written |
| `ArtifactArchiveRef` | external ref / archive boundary | 外部摘要与引用 | object_written |
| `MaintenanceRunRef` | typed ref | 后台维护与收敛 | object_written |
| `RefreshScopeRef` | typed ref | 后台维护与收敛 | object_written |
| `MethodPackageRef` | typed ref | 外围包与方法集组织 | object_written |
| `MethodSetAssemblyRef` | typed ref | 外围包与方法集组织 | object_written |
| `MarketplaceContextRef` | typed ref / external ecosystem | 外围包与方法集组织 | object_written |
| `MethodAssetAuditTrail` | audit trail | 追溯与一致性保护 | object_written |
| `MethodAssetDefinitionHistory` | history record | 方法资产定义与目录 | object_written |
| `FormalizationHistory` | history record | 正式化与版本 | object_written |
| `ConsumptionTraceMaterial` | trace material / history | 追溯与一致性保护 | object_written |
| `MethodAssetEvidenceLineage` | lineage | 追溯与一致性保护 | object_written |
| `RelationChangeHistory` | history record | 关系与分发语义 | object_written |
| `ExternalBasisAcceptanceHistory` | history record | 外部摘要与引用 | object_written |
| `MaintenanceRunHistory` | history record | 后台维护与收敛 | object_written |
| `PackageAssemblyHistory` | history record | 外围包与方法集组织 | object_written |

## 4. 模块状态表

| 顺序 | 模块 | 状态 | 产物 | 下一动作 |
|---:|---|---|---|---|
| 1 | 附录框架:再写入 | done | 文件头、职责、索引、模板和停审。 | 等待主控推进。 |
| 2 | typed ref 批次:先思考 | done | ref 家族分组和来源边界。 | 已完成;进入写入批次。 |
| 3 | typed ref 批次:再写入 | done | 16 个 typed / external ref 对象卡片骨架。 | 已完成;进入 trace / audit / history 先思考。 |
| 4 | trace / audit / history 批次:先思考 | done | trace、audit、history、lineage 边界和下一写入分组。 | 已完成;进入对象卡片写入批次。 |
| 5 | trace / audit / history 批次:再写入 | done | trace / audit / history / lineage 对象卡片骨架。 | 已完成;等待主控进入 operations_peripheral 附录。 |

## 5. 对象卡片模板

```text
## D?. `ObjectName`

| 项 | 内容 |
|---|---|
| 所属部分 | `Step 5 组成部分` |
| 对象类型 | typed ref / external ref / trace / audit / history / lineage |
| 结构责任 | ... |
| 来源回指 | ... |
| body-free 边界 | ... |

| 字段 | 类型 | 作用 |
|---|---|---|

| 成员函数 | 作用 |
|---|---|

| 工厂函数 | 作用 |
|---|---|

| 禁止事项 | 说明 |
|---|---|
```

## 6. 本附录禁止事项

- 不把 typed ref 降级为裸字符串、route param、URL、marketplace id 或文件路径。
- 不保存 process、identity、governance、artifact、marketplace、console 或 SDK 内部 truth。
- 不保存外部正文、artifact 正文、archive 包、证据文件正文或 raw audit log。
- 不写 event payload、outbox schema、report schema 或 storage schema。

## 7. 停审记录

| 检查项 | 结论 |
|---|---|
| 是否只创建框架 | no:已写入 typed ref 对象批次 |
| 是否写对象卡片正文 | yes:16 个 typed / external ref 对象已写入 |
| 是否回填正式 §6 | no |
| 下一动作 | 等待主控按顺序进入 `operations_peripheral maintenance task 批次:先思考`。 |

## 8. Typed Ref 批次:先思考

### 8.1 问题回答

- 本批只讨论 typed ref / external ref 家族分组、来源边界和下一写入对象,不写 ref 对象卡片正文。
- 下一写入批次应写 16 个 ref 对象:`MethodAssetDefinitionRef`、`CatalogScopeRef`、`GovernanceBasisRef`、`ConsumptionContextRef`、`TraceSubjectRef`、`ConsumptionImpactSourceRef`、`RelatedMethodAssetRef`、`MethodAssetDistributionRef`、`DistributionContextRef`、`ExternalSourceRef`、`ArtifactArchiveRef`、`MaintenanceRunRef`、`RefreshScopeRef`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef`。
- `MethodSetAssemblyRef` 必须进入本批。Step 5 `5.24` 已把它列为 reference candidate,且 `MethodSetAssemblyView` 已使用它作为来源锚点;若不补入 typed ref 家族,后续接口和流程会只能靠字符串或私有 id 承接 assembly。
- 本批不写 `MethodAssetAuditTrail`、history、lineage 或 trace material 对象;这些留给 `trace / audit / history 批次:先思考`。
- 本批不新增 `StandardAdrSourceRef`、`EvidenceLineageRef`、`ExternalSourceLineageRef`、`RelationDistributionLineageRef` 等额外 ref 对象。它们在本轮 Step 6 中分别由 `ExternalSourceRef`、`ArtifactArchiveRef`、`MethodAssetEvidenceLineage`、`RelationChangeHistory` 或后续 trace / lineage 批次承接。

### 8.2 诊断

- typed ref 是本仓避免 free-form string、route param、URL、marketplace id、package file path 和 worker id 进入正式设计的边界对象。
- core ref 与 support ref 不能混为一谈。`MethodAssetDefinitionRef` 是核心 subject 锚点;`MethodAssetDistributionRef`、`ExternalSourceRef`、`ArtifactArchiveRef` 和 `MarketplaceContextRef` 是支撑或外部边界,不得升级为来源 truth。
- external ref 必须保持 body-free。`GovernanceBasisRef`、`ExternalSourceRef`、`ArtifactArchiveRef` 和 `MarketplaceContextRef` 只能保存稳定引用、摘要或上下文线索,不得保存治理执行、标准全文、artifact 正文、archive 包体、listing、交易、安装或履约状态。
- operation ref 必须保持非运行实现。`MaintenanceRunRef` 和 `RefreshScopeRef` 只标识维护运行语境和刷新范围,不得等同 worker、scheduler、queue、cron、lock 或 retry 实现。
- peripheral ref 必须保持外围隔离。`MethodPackageRef`、`MethodSetAssemblyRef` 和 `MarketplaceContextRef` 可以被 package / method set view 或生态发现读取,但不能成为核心定义、正式化、受控消费或追溯成立前置。

### 8.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| core subject refs | 下一批写入 | `MethodAssetDefinitionRef`;`CatalogScopeRef` 是定义、目录、正式化、消费、关系和追溯的稳定锚点。 |
| formalization / consumption refs | 下一批写入 | `GovernanceBasisRef`;`ConsumptionContextRef` 保护外部治理依据和下游消费语境不被字符串化。 |
| trace / impact refs | 下一批写入 | `TraceSubjectRef`;`ConsumptionImpactSourceRef` 支撑追溯主体和影响来源,但不保存 raw trace 或下游运行 truth。 |
| relation / distribution refs | 下一批写入 | `RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef` 区分关系端点、分发语义和分发上下文。 |
| external refs | 下一批写入 | `ExternalSourceRef`;`ArtifactArchiveRef` 统一正文禁止边界和 artifact/archive 引用。 |
| maintenance refs | 下一批写入 | `MaintenanceRunRef`;`RefreshScopeRef` 限定维护语境和刷新范围,不固定 job 实现。 |
| peripheral refs | 下一批写入 | `MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef` 保护外围组织和生态发现不反写核心。 |
| trace / audit / history / lineage 对象 | 后移 | 需要单独讨论 body-free audit、history、lineage 和 no raw log 边界。 |
| 额外历史 ref 名称 | 不新增 | 当前对象池已能承接;若后续 trace/audit 批次发现缺口,再按门禁补充。 |

### 8.4 结构化中间产物

| 下一写入组 | 对象 | 必须表达 | 不得表达 |
|---|---|---|---|
| core / formal refs | `MethodAssetDefinitionRef`;`CatalogScopeRef`;`GovernanceBasisRef`;`ConsumptionContextRef` | 来源 owner、稳定 identity、适用 scope / context、不可字符串化边界。 | 定义正文、目录 view、治理执行正文、下游运行状态。 |
| trace / relation refs | `TraceSubjectRef`;`ConsumptionImpactSourceRef`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef` | trace subject、impact source、关系端点、分发语义和上下文边界。 | raw trace、影响计算算法、关系 truth 修改、同步成功或 marketplace 交易。 |
| external / operation / peripheral refs | `ExternalSourceRef`;`ArtifactArchiveRef`;`MaintenanceRunRef`;`RefreshScopeRef`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef` | body-free 外部引用、维护语境、刷新范围、外围 package/set/ecosystem 上下文。 | 外部正文、archive 包体、worker/job 实现、package file path、listing id、交易/安装/履约。 |

### 8.5 下一写入批次边界

- 只允许进入 `typed ref 批次:再写入`。
- 只写 16 个 typed / external ref 对象卡片;可按 core/formal、trace/relation、external/operation/peripheral 三个 patch 组分批写入。
- 不写 `MethodAssetAuditTrail`、`MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial`、`MethodAssetEvidenceLineage`、`RelationChangeHistory`、`ExternalBasisAcceptanceHistory`、`MaintenanceRunHistory`、`PackageAssemblyHistory`。
- 不写 event payload、outbox schema、report schema、storage schema、resolver algorithm、接口、处理流、状态迁移或正式 `02-概要设计.md` §6。
- 不保存外部正文、artifact 正文、archive 包、证据文件正文、raw audit log、marketplace 交易或下游运行 truth。

### 8.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:16 个 typed / external ref 对象 |
| 是否把 trace / audit / history 混入本批 | no |
| 是否补齐 `MethodSetAssemblyRef` 候选 | pass |
| 是否保持 body-free / no raw log | pass |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit typed ref 批次:再写入`;只写 typed / external ref 对象卡片,不得写 trace/audit/history/lineage 对象、payload schema、接口、流程、状态迁移或正式 §6。

## D1. `MethodAssetDefinitionRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | typed ref / subject boundary |
| 结构责任 | 为方法资产定义提供稳定引用锚点,供正式化、版本、消费、关系、追溯和外围读取共同使用。 |
| 来源回指 | Step 5 `5.10`;Step 5 `5.26`;`00-需求文档.md` FR-ML-001/002;BR-ML-001~003;`01-架构设计.md` §6/§9。 |
| body-free 边界 | 只保存稳定身份线索和来源归属,不保存定义正文、目录 view、外部正文或下游运行事实。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| definition_ref | MethodAssetDefinitionRefValue | 方法资产定义稳定 identity。 |
| definition_kind | MethodAssetDefinitionKind | 指明引用所指向的定义语义类别。 |
| owner_context_ref | MethodLibraryOwnerContextRef | 标识该 ref 由本仓定义 truth 产生。 |
| identity_digest_ref | MethodAssetIdentityDigestRef | 支撑防重、审计和跨材料一致性校验。 |
| issued_at_ref | MethodAssetRefIssueTimeRef | 标记 ref 形成时间线索,不等同生命周期状态。 |

| 成员函数 | 作用 |
|---|---|
| same_definition(MethodAssetDefinitionRef other) | 判断两个引用是否指向同一方法资产定义。 |
| assert_owner_context(MethodLibraryOwnerContextRef owner_context_ref) | 校验引用来源仍属于本仓定义 truth 边界。 |
| supports_formalization_subject() | 判断该 ref 是否可作为正式化、版本和追溯 subject。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition_identity(MethodAssetDefinitionIdentity identity) | 从已接受的定义身份建立 typed ref。 |
| from_existing_ref(MethodAssetDefinitionRef definition_ref) | 接收既有 typed ref,防止重新拼接字符串引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不从 route 或字符串拼接 | route param、旧 P0 类型名、URL、文件路径或外部 id 不得替代本 ref。 |
| 不携带定义正文 | 定义正文和语义摘要属于 `MethodAssetDefinition`,不是 ref 的职责。 |
| 不反向拥有下游 truth | process、identity、runtime、member-images、marketplace 或 artifact 运行事实不得进入 ref。 |

## D2. `CatalogScopeRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | typed ref / scope boundary |
| 结构责任 | 标识目录范围、适用语境或组织识别语境,让 catalog entry、catalog view 和消费材料能共享同一 scope 锚点。 |
| 来源回指 | Step 5 `5.10`;Step 5 `5.26`;`00-需求文档.md` FR-ML-002;BR-ML-002;`01-架构设计.md` §9。 |
| body-free 边界 | 只表达目录 scope identity,不保存目录 view、搜索索引、组织运行配置或 UI 分类正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| catalog_scope_ref | CatalogScopeRefValue | 目录范围稳定 identity。 |
| scope_kind | CatalogScopeKind | 区分全局、组织、资产族或消费语境等 scope 类别。 |
| owner_context_ref | MethodLibraryOwnerContextRef | 标识 scope 由本仓目录语义承接。 |
| scope_digest_ref | CatalogScopeDigestRef | 支撑 scope 一致性校验。 |
| parent_scope_ref | Option<CatalogScopeRef> | 可选上级 scope 线索,不表达继承算法。 |

| 成员函数 | 作用 |
|---|---|
| same_scope(CatalogScopeRef other) | 判断两个目录范围是否同一 stable scope。 |
| is_global_scope() | 判断是否为全局目录范围。 |
| assert_catalog_usable() | 校验该 scope 可用于 catalog entry / catalog view。 |

| 工厂函数 | 作用 |
|---|---|
| from_catalog_scope_identity(CatalogScopeIdentity identity) | 从正式目录范围身份建立 typed ref。 |
| from_context(CatalogScopeKind scope_kind, MethodLibraryOwnerContextRef owner_context_ref) | 从本仓目录语境建立 scope ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不写 scope 继承算法 | scope 覆盖、继承或权限判断留给后续 policy / flow。 |
| 不替代 catalog truth | 目录项和目录视图不得只靠 scope ref 证明成立。 |
| 不保存 UI 分类 | UI 分类、搜索标签和展示分组不属于本 ref。 |

## D3. `GovernanceBasisRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | typed ref / external basis |
| 结构责任 | 指向正式化所需治理结论、标准依据、ADR 或外部依据摘要,保护治理执行与正文不进入本仓。 |
| 来源回指 | Step 5 `5.12`;Step 5 `5.20`;Step 5 `5.26`;`00-需求文档.md` FR-ML-003/009;BR-ML-019/020/022;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存依据引用和摘要校验线索,不保存治理裁决正文、执行过程、标准全文、会议记录或证据正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| governance_basis_ref | GovernanceBasisRefValue | 治理或外部依据稳定引用。 |
| basis_kind | GovernanceBasisKind | 区分治理结论、标准、ADR、外部方法论或验收依据。 |
| external_source_ref | Option<ExternalSourceRef> | 可选外部来源 typed ref。 |
| summary_digest_ref | Option<ExternalSummaryDigestRef> | 对已接收摘要做一致性校验。 |
| accepted_at_ref | Option<ExternalBasisAcceptedTimeRef> | 记录依据被接收的时间线索,不表达审批流程。 |

| 成员函数 | 作用 |
|---|---|
| is_governance_conclusion() | 判断是否指向治理结论类依据。 |
| has_external_source() | 判断是否存在外部来源 typed ref。 |
| assert_body_free() | 校验本 ref 只承载引用和摘要线索。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_source(GovernanceBasisKind basis_kind, ExternalSourceRef external_source_ref) | 从外部来源建立治理依据 ref。 |
| from_accepted_summary(GovernanceBasisKind basis_kind, ExternalSummaryDigestRef summary_digest_ref) | 从已接收的 body-free summary 建立依据 ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存治理执行 | 审批、裁决执行、责任分派或治理运行状态仍归 governance 边界。 |
| 不保存外部正文 | 标准全文、ADR 正文、外部文档正文和证据正文不得进入本 ref。 |
| 不隐式正式化 | 依据 ref 存在不代表方法资产已正式化。 |

## D4. `ConsumptionContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | typed ref / consumption boundary |
| 结构责任 | 标识下游按边界消费正式方法资产的语境,防止消费方用字符串或运行状态反向拥有定义 truth。 |
| 来源回指 | Step 5 `5.14`;Step 5 `5.26`;`00-需求文档.md` FR-ML-005/006;BR-ML-003/005/008/012~018/021;`01-架构设计.md` §6/§9/§10。 |
| body-free 边界 | 只保存消费语境引用,不保存下游运行状态、执行实例、成员状态、UI 会话、同步包或授权矩阵。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| consumption_context_ref | ConsumptionContextRefValue | 消费语境稳定 identity。 |
| consumer_kind | MethodAssetConsumerKind | 区分 process、identity、runtime、member-images 或其他正式消费方类别。 |
| consumer_scope_ref | ConsumerScopeRef | 标识消费方 scope,不保存消费方内部 truth。 |
| boundary_ref | DownstreamConsumptionBoundaryRef | 指向受控消费边界。 |
| context_digest_ref | ConsumptionContextDigestRef | 支撑语境一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_context(ConsumptionContextRef other) | 判断两个消费语境是否相同。 |
| assert_consumer_kind(MethodAssetConsumerKind consumer_kind) | 校验消费方类别未漂移。 |
| assert_boundary(DownstreamConsumptionBoundaryRef boundary_ref) | 校验消费语境受正式边界约束。 |

| 工厂函数 | 作用 |
|---|---|
| from_consumer_scope(MethodAssetConsumerKind consumer_kind, ConsumerScopeRef consumer_scope_ref) | 从下游消费 scope 建立 typed ref。 |
| from_boundary(DownstreamConsumptionBoundaryRef boundary_ref, ConsumerScopeRef consumer_scope_ref) | 从消费边界和 scope 建立消费语境 ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存下游运行 truth | 流程实例、成员生命周期、运行绑定、镜像构建和 UI 状态不得进入本 ref。 |
| 不替代消费材料 | 可消费内容由 `MethodAssetConsumptionMaterial` 承接,不是本 ref。 |
| 不绕过正式化 | 消费语境存在不代表未正式化资产可被正式消费。 |

## D5. `TraceSubjectRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | typed ref / trace subject |
| 结构责任 | 统一标识可被追溯的方法资产定义、正式版本、消费材料、关系或外部依据 subject。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-007/009;BR-ML-020/021;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只标识 trace subject,不保存 raw trace、审计日志、event payload、证据正文或外部正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| trace_subject_ref | TraceSubjectRefValue | 追溯主体稳定 identity。 |
| subject_kind | TraceSubjectKind | 区分 definition、formal version、consumption material、relation 或 external basis。 |
| subject_ref | MethodAssetSubjectTypedRef | 指向被追溯对象的正式 typed ref。 |
| subject_digest_ref | Option<TraceSubjectDigestRef> | 支撑追溯材料一致性校验。 |
| issued_by_ref | MethodLibraryTraceIssuerRef | 标识本仓追溯语境的形成来源。 |

| 成员函数 | 作用 |
|---|---|
| same_subject(TraceSubjectRef other) | 判断两个追溯主体是否同一。 |
| assert_subject_kind(TraceSubjectKind subject_kind) | 校验追溯主体类别。 |
| is_definition_subject() | 判断是否指向方法资产定义。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition_ref(MethodAssetDefinitionRef definition_ref) | 从定义 typed ref 建立追溯主体。 |
| from_formal_version_ref(FormalMethodAssetVersionRef formal_version_ref) | 从正式版本 typed ref 建立追溯主体。 |
| from_consumption_material_ref(MethodAssetConsumptionMaterialRef consumption_material_ref) | 从消费材料 ref 建立追溯主体。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代具体 typed ref | 需要 definition、version 或 material ref 时,不得用 trace subject 弱化类型。 |
| 不保存 raw trace | trace span、log line、事件 payload 和审计正文不得进入本 ref。 |
| 不反推状态迁移 | 追溯主体存在不代表状态已经变化。 |

## D6. `ConsumptionImpactSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | typed ref / impact source |
| 结构责任 | 标识消费影响分析的来源变化,让影响摘要可回指版本语义变化、边界变化或下游消费语境变化。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-008;BR-ML-011/020/021;`01-架构设计.md` §9/§10。 |
| body-free 边界 | 只保存影响来源引用和摘要线索,不保存影响计算结果全集、下游运行 truth 或变更正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| impact_source_ref | ConsumptionImpactSourceRefValue | 消费影响来源稳定 identity。 |
| source_kind | ConsumptionImpactSourceKind | 区分版本变化、边界变化、关系变化、材料过期或外部依据变化。 |
| trace_subject_ref | TraceSubjectRef | 回指被分析的追溯主体。 |
| change_basis_ref | Option<GovernanceBasisRef> | 可选变化依据引用。 |
| source_digest_ref | Option<ImpactSourceDigestRef> | 支撑影响来源一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_source(ConsumptionImpactSourceRef other) | 判断两个影响来源是否相同。 |
| is_version_change_source() | 判断是否由正式版本语义变化触发。 |
| assert_trace_subject(TraceSubjectRef trace_subject_ref) | 校验影响来源回指的追溯主体。 |

| 工厂函数 | 作用 |
|---|---|
| from_version_change(FormalMethodAssetVersionRef formal_version_ref) | 从正式版本变化建立影响来源 ref。 |
| from_boundary_change(DownstreamConsumptionBoundaryRef boundary_ref) | 从消费边界变化建立影响来源 ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存影响算法 | 影响分类、传播和计算规则留给后续处理流或 policy。 |
| 不保存下游状态 | 下游实际运行、执行结果、安装状态或同步状态不得进入本 ref。 |
| 不替代影响摘要 | 影响结论由 `ConsumptionImpactSummary` / view 承接。 |

## D7. `RelatedMethodAssetRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | typed ref / relation endpoint |
| 结构责任 | 标识方法资产关系中的目标端点,让关系对象不用裸 asset id、URL 或 marketplace id 表达关联。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.26`;`00-需求文档.md` FR-ML-006/008;BR-ML-008/011;`01-架构设计.md` §9。 |
| body-free 边界 | 只保存关系端点引用,不保存目标资产正文、关系图算法、分发结果或 marketplace 交易事实。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| related_asset_ref | RelatedMethodAssetRefValue | 关系目标端点稳定 identity。 |
| target_definition_ref | MethodAssetDefinitionRef | 指向目标方法资产定义。 |
| target_version_ref | Option<FormalMethodAssetVersionRef> | 可选目标正式版本。 |
| relation_scope_ref | CatalogScopeRef | 关系适用的目录或语境范围。 |
| endpoint_digest_ref | Option<RelationEndpointDigestRef> | 支撑端点一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| points_to_definition(MethodAssetDefinitionRef definition_ref) | 判断端点是否指向指定定义。 |
| has_formal_version() | 判断端点是否绑定正式版本。 |
| assert_relation_scope(CatalogScopeRef catalog_scope_ref) | 校验关系端点适用范围。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition(MethodAssetDefinitionRef definition_ref, CatalogScopeRef catalog_scope_ref) | 从定义 ref 和 scope 建立关系端点。 |
| from_formal_version(FormalMethodAssetVersionRef formal_version_ref, CatalogScopeRef catalog_scope_ref) | 从正式版本 ref 建立关系端点。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存目标正文 | 目标资产定义正文或消费材料不得复制到关系端点。 |
| 不替代关系 truth | 关系成立、方向和约束由 `MethodAssetRelation` / integrity rule 承接。 |
| 不使用 marketplace id | listing、package path、URL 或外部 id 不得替代关系端点 ref。 |

## D8. `MethodAssetDistributionRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | typed ref / distribution boundary |
| 结构责任 | 标识方法资产分发语义或可发现边界,让 distribution material 可回指正式来源而不进入交易或安装事实。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.26`;`00-需求文档.md` FR-ML-006;BR-ML-008/016;`01-架构设计.md` §8/§9。 |
| body-free 边界 | 只保存分发语义引用和上下文线索,不保存 marketplace listing、订单、安装、履约、同步包或分发协议正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| distribution_ref | MethodAssetDistributionRefValue | 分发语义稳定 identity。 |
| distribution_kind | MethodAssetDistributionKind | 区分目录分发、包分发、生态发现或候选下游分发。 |
| source_definition_ref | MethodAssetDefinitionRef | 分发来源方法资产定义。 |
| distribution_context_ref | DistributionContextRef | 分发适用语境。 |
| distribution_digest_ref | Option<DistributionDigestRef> | 支撑分发引用一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_distribution(MethodAssetDistributionRef other) | 判断两个分发引用是否同一。 |
| assert_source(MethodAssetDefinitionRef definition_ref) | 校验分发来源定义。 |
| assert_context(DistributionContextRef distribution_context_ref) | 校验分发语境。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition(MethodAssetDefinitionRef definition_ref, DistributionContextRef distribution_context_ref) | 从定义 ref 和分发语境建立 distribution ref。 |
| from_package(MethodPackageRef package_ref, DistributionContextRef distribution_context_ref) | 从 package ref 和分发语境建立 distribution ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存交易履约 | 定价、订单、购买、结算、安装和履约属于 marketplace。 |
| 不替代消费授权 | 是否可消费由正式版本、消费材料和边界共同约束。 |
| 不写分发协议 | topic、payload、同步包、API schema 和传输协议不属于本对象。 |

## D9. `DistributionContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | typed ref / distribution context |
| 结构责任 | 标识分发、发现或候选下游读取发生的上下文,为 relation view、distribution read material 和外围发现提供 scope。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.24`;Step 5 `5.26`;`00-需求文档.md` FR-ML-006;FR-ML-E-002;BR-ML-008/016;`01-架构设计.md` §8/§9。 |
| body-free 边界 | 只保存分发上下文引用,不保存 marketplace listing、生态交易、安装状态、外部 API payload 或同步结果。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| distribution_context_ref | DistributionContextRefValue | 分发上下文稳定 identity。 |
| context_kind | DistributionContextKind | 区分目录、package、method set、marketplace 或候选下游上下文。 |
| catalog_scope_ref | Option<CatalogScopeRef> | 可选目录范围。 |
| marketplace_context_ref | Option<MarketplaceContextRef> | 可选生态发现上下文。 |
| context_digest_ref | Option<DistributionContextDigestRef> | 支撑上下文一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_context(DistributionContextRef other) | 判断两个分发上下文是否同一。 |
| is_marketplace_context() | 判断是否关联 marketplace / ecosystem 发现。 |
| assert_catalog_scope(CatalogScopeRef catalog_scope_ref) | 校验目录分发范围。 |

| 工厂函数 | 作用 |
|---|---|
| from_catalog_scope(CatalogScopeRef catalog_scope_ref) | 从目录范围建立分发上下文。 |
| from_marketplace_context(MarketplaceContextRef marketplace_context_ref) | 从生态发现上下文建立分发上下文。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 marketplace 正文 | listing、订单、购买、结算、安装和履约正文不得进入本 ref。 |
| 不代表同步成功 | 分发上下文存在不等于同步、安装或消费成功。 |
| 不替代关系和分发对象 | 关系 truth 与 distribution ref 仍需独立表达。 |

## D10. `ExternalSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | external ref / body-free boundary |
| 结构责任 | 为标准、ADR、方法论文档、治理依据、artifact 线索或 marketplace 语境提供稳定外部来源引用。 |
| 来源回指 | Step 5 `5.20`;Step 5 `5.26`;`00-需求文档.md` FR-ML-009;BR-ML-018~022;`01-架构设计.md` §8/§9/§13。 |
| body-free 边界 | 只保存外部来源引用、类别和摘要校验线索,不保存外部正文、网页正文、文档正文、artifact 包体或外部 API payload。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| external_source_ref | ExternalSourceRefValue | 外部来源稳定 identity。 |
| source_kind | ExternalSourceKind | 区分标准、ADR、治理结论、外部文档、artifact 线索或生态对象。 |
| source_namespace_ref | ExternalSourceNamespaceRef | 标识外部来源命名空间。 |
| source_version_ref | Option<ExternalSourceVersionRef> | 可选外部来源版本线索。 |
| summary_digest_ref | Option<ExternalSummaryDigestRef> | 支撑已接收摘要的一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_source(ExternalSourceRef other) | 判断两个外部来源引用是否同一。 |
| has_version() | 判断是否带外部版本线索。 |
| assert_body_free() | 校验引用没有携带外部正文。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_source_key(ExternalSourceKind source_kind, ExternalSourceNamespaceRef source_namespace_ref) | 从正式外部来源键建立 external ref。 |
| from_versioned_source(ExternalSourceKind source_kind, ExternalSourceNamespaceRef source_namespace_ref, ExternalSourceVersionRef source_version_ref) | 从带版本的外部来源建立 ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不从 URL 私造 | free-form URL、网页地址、文件路径、外部 id 或 route param 不得直接替代 ref。 |
| 不保存外部正文 | 标准、ADR、外部文档、治理记录、artifact 或 marketplace 正文不得进入本 ref。 |
| 不替代外部系统 truth | 外部来源生命周期和权限仍归来源系统或相邻仓。 |

## D11. `ArtifactArchiveRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | external ref / archive boundary |
| 结构责任 | 指向 artifact、证据文件、archive 包或制品归档的外部引用,为证据线索和外部摘要提供 body-free 锚点。 |
| 来源回指 | Step 5 `5.20`;Step 5 `5.26`;`00-需求文档.md` FR-ML-009;BR-ML-018/022;`01-架构设计.md` §8/§9/§13。 |
| body-free 边界 | 只保存 artifact/archive 引用和摘要校验线索,不保存 artifact 正文、证据正文、archive 包体、文件内容或生命周期状态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| artifact_archive_ref | ArtifactArchiveRefValue | artifact/archive 稳定引用。 |
| artifact_kind | ArtifactArchiveKind | 区分证据文件、归档包、模板、示例或制品线索。 |
| external_source_ref | Option<ExternalSourceRef> | 可选外部来源引用。 |
| archive_digest_ref | Option<ArtifactArchiveDigestRef> | 支撑归档摘要校验。 |
| retention_context_ref | Option<ArtifactRetentionContextRef> | 标识保留或引用语境,不保存存储策略。 |

| 成员函数 | 作用 |
|---|---|
| same_archive(ArtifactArchiveRef other) | 判断两个 artifact/archive 引用是否同一。 |
| has_digest() | 判断是否具备摘要校验线索。 |
| assert_body_free() | 校验引用不携带 artifact 正文或 archive 包体。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_source(ExternalSourceRef external_source_ref, ArtifactArchiveKind artifact_kind) | 从外部来源建立 artifact/archive ref。 |
| from_archive_digest(ArtifactArchiveKind artifact_kind, ArtifactArchiveDigestRef archive_digest_ref) | 从摘要校验线索建立 archive ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 artifact 正文 | 文档、证据文件、制品、模板、示例和 archive 包体不得进入本 ref。 |
| 不拥有生命周期 | artifact 创建、权限、保留、删除和归档生命周期归 artifact/archive 边界。 |
| 不替代证据 lineage | 证据来源链由 lineage/history 对象承接,不是 archive ref 本身。 |

## D12. `MaintenanceRunRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | typed ref / maintenance context |
| 结构责任 | 标识一次维护、刷新、修复或收敛运行的设计级语境,供进度 view、history 和任务材料回指。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.26`;`00-需求文档.md` NFR-ML-004~006/013/015;`01-架构设计.md` §10/§11/§13。 |
| body-free 边界 | 只保存维护运行引用和语境线索,不保存 worker、scheduler、queue、cron、lock、retry、日志或 telemetry 实现。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| maintenance_run_ref | MaintenanceRunRefValue | 维护运行稳定 identity。 |
| run_kind | MaintenanceRunKind | 区分读取材料刷新、追溯材料刷新、一致性恢复或外围收敛。 |
| refresh_scope_ref | RefreshScopeRef | 维护运行覆盖的刷新范围。 |
| requested_by_ref | Option<MaintenanceRequestSourceRef> | 可选维护请求来源。 |
| run_digest_ref | Option<MaintenanceRunDigestRef> | 支撑运行语境一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_run(MaintenanceRunRef other) | 判断两个维护运行引用是否同一。 |
| assert_scope(RefreshScopeRef refresh_scope_ref) | 校验维护运行范围。 |
| is_recovery_run() | 判断是否为一致性恢复类运行。 |

| 工厂函数 | 作用 |
|---|---|
| from_refresh_scope(MaintenanceRunKind run_kind, RefreshScopeRef refresh_scope_ref) | 从刷新范围建立维护运行 ref。 |
| from_recovery_request(RefreshScopeRef refresh_scope_ref, MaintenanceRequestSourceRef requested_by_ref) | 从恢复请求建立维护运行 ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不等同 worker/job | worker id、job id、queue id、cron 名称、lock key 和 retry token 不得替代本 ref。 |
| 不保存运行日志 | 日志、telemetry、metric、trace span 和 raw audit log 不得进入本 ref。 |
| 不修改 truth | 维护运行 ref 存在不代表来源 truth 或 projection 已被修改。 |

## D13. `RefreshScopeRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | typed ref / refresh scope |
| 结构责任 | 标识读取材料、追溯材料、外部摘要、关系分发或外围 view 的刷新 / 恢复范围。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.26`;`00-需求文档.md` NFR-ML-004~006/013;`01-架构设计.md` §10/§11。 |
| body-free 边界 | 只保存刷新范围引用,不保存查询条件实现、调度参数、批处理游标、锁、重试或 cache key。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| refresh_scope_ref | RefreshScopeRefValue | 刷新范围稳定 identity。 |
| scope_kind | RefreshScopeKind | 区分 catalog、consumption、trace、relation、external、maintenance 或 peripheral 范围。 |
| subject_ref | Option<TraceSubjectRef> | 可选被刷新主体。 |
| catalog_scope_ref | Option<CatalogScopeRef> | 可选目录范围。 |
| scope_digest_ref | Option<RefreshScopeDigestRef> | 支撑范围一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_scope(RefreshScopeRef other) | 判断两个刷新范围是否同一。 |
| covers_subject(TraceSubjectRef trace_subject_ref) | 判断范围是否覆盖指定追溯主体。 |
| is_peripheral_scope() | 判断是否为外围材料刷新范围。 |

| 工厂函数 | 作用 |
|---|---|
| from_subject(RefreshScopeKind scope_kind, TraceSubjectRef trace_subject_ref) | 从追溯主体建立刷新范围。 |
| from_catalog_scope(RefreshScopeKind scope_kind, CatalogScopeRef catalog_scope_ref) | 从目录范围建立刷新范围。 |

| 禁止事项 | 说明 |
|---|---|
| 不写调度实现 | scheduler、queue、cron、batch cursor、lock 和 retry 细节留给后续实现设计。 |
| 不替代维护任务 | 任务、进度和恢复语义由 operation/peripheral 附录对象承接。 |
| 不扩大核心范围 | peripheral scope 失败不得阻塞核心定义、正式化、消费和追溯闭环。 |

## D14. `MethodPackageRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | typed ref / peripheral package |
| 结构责任 | 为方法资产包、package view 和生态发现提供稳定外围引用,防止 package 被文件路径、listing id 或 marketplace id 替代。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26`;`00-需求文档.md` FR-ML-E-001/002;BR-ML-E-001;`01-架构设计.md` §8/§9。 |
| body-free 边界 | 只保存 package identity 和外围组织语境,不保存安装包、插件包体、配置正文、交易履约或 marketplace listing。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| method_package_ref | MethodPackageRefValue | 方法资产包稳定 identity。 |
| package_kind | MethodPackageKind | 区分资产包、配置包、插件语义包或生态发现包。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 包内方法资产定义 refs。 |
| distribution_context_ref | Option<DistributionContextRef> | 可选分发 / 发现语境。 |
| package_digest_ref | Option<MethodPackageDigestRef> | 支撑 package 语义一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| contains_definition(MethodAssetDefinitionRef definition_ref) | 判断 package 是否包含指定方法资产定义。 |
| assert_peripheral_only() | 校验 package ref 不成为核心闭环前置。 |
| same_package(MethodPackageRef other) | 判断两个 package ref 是否同一。 |

| 工厂函数 | 作用 |
|---|---|
| from_package_identity(MethodPackageIdentity package_identity) | 从正式 package 身份建立 typed ref。 |
| from_member_refs(MethodAssetDefinitionRefSet member_definition_refs) | 从方法资产成员 refs 建立 package ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不从路径或 listing 私造 | package file path、listing id、marketplace id、URL、route param 或外部 id 不得替代 ref。 |
| 不保存包体 | 插件包、配置包、archive 包和安装包正文不得进入本 ref。 |
| 不阻塞核心闭环 | package 能力失败不得影响 definition、formalization、consumption 和 trace 主链成立。 |

## D15. `MethodSetAssemblyRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | typed ref / peripheral assembly |
| 结构责任 | 标识组织级方法集组装语义,供 method set assembly view、package relation 和外围采用评估引用。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26`;`00-需求文档.md` FR-ML-E-001/003;BR-ML-E-001;`01-架构设计.md` §8/§9。 |
| body-free 边界 | 只保存方法集组装引用和成员 refs,不保存组织运行配置、AI policy override、UI 匹配状态或 marketplace 履约。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| method_set_assembly_ref | MethodSetAssemblyRefValue | 方法集组装稳定 identity。 |
| assembly_kind | MethodSetAssemblyKind | 区分组织方法集、场景方法集或外围采用组合。 |
| package_refs | MethodPackageRefSet | 方法集关联的 package refs。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 方法集直接关联的核心方法资产 refs。 |
| assembly_digest_ref | Option<MethodSetAssemblyDigestRef> | 支撑组装语义一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| contains_package(MethodPackageRef package_ref) | 判断方法集是否包含指定 package。 |
| contains_definition(MethodAssetDefinitionRef definition_ref) | 判断方法集是否直接包含指定方法资产定义。 |
| assert_peripheral_only() | 校验方法集组装不成为正式消费授权或核心 truth。 |

| 工厂函数 | 作用 |
|---|---|
| from_package_refs(MethodPackageRefSet package_refs) | 从 package refs 建立方法集组装 ref。 |
| from_member_refs(MethodAssetDefinitionRefSet member_definition_refs) | 从核心方法资产 refs 建立组装 ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存组织运行配置 | 组织启用、执行、安装、权限和 UI 匹配状态不属于本 ref。 |
| 不替代 package truth | package 成员和 composition 规则仍由外围对象和规则承接。 |
| 不承载 policy override | 高级策略变体或 AI policy override 只能作为后续外围设计线索。 |

## D16. `MarketplaceContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | typed ref / external ecosystem boundary |
| 结构责任 | 标识 marketplace 或生态发现上下文,让 package、method set 和 distribution 只保留外围发现线索。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26`;`00-需求文档.md` FR-ML-E-002;BR-ML-016;BR-ML-E-001;`01-架构设计.md` §8/§9。 |
| body-free 边界 | 只保存 ecosystem context ref,不保存 marketplace listing、价格、订单、购买、结算、安装、履约或商业记录正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| marketplace_context_ref | MarketplaceContextRefValue | 生态发现上下文稳定 identity。 |
| ecosystem_kind | MarketplaceEcosystemKind | 区分 marketplace、catalog federation、external discovery 或评估语境。 |
| external_source_ref | Option<ExternalSourceRef> | 可选外部来源引用。 |
| distribution_context_ref | Option<DistributionContextRef> | 可选分发语境。 |
| context_digest_ref | Option<MarketplaceContextDigestRef> | 支撑上下文一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| same_context(MarketplaceContextRef other) | 判断两个 ecosystem context 是否同一。 |
| has_distribution_context() | 判断是否关联正式分发语境。 |
| assert_no_transaction_scope() | 校验上下文没有携带交易履约语义。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_source(ExternalSourceRef external_source_ref, MarketplaceEcosystemKind ecosystem_kind) | 从外部生态来源建立 marketplace context ref。 |
| from_distribution_context(DistributionContextRef distribution_context_ref) | 从分发语境建立 ecosystem context ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存交易履约 | 定价、订单、购买、结算、安装和履约正文属于 `L6-marketplace`。 |
| 不替代 package/distribution ref | package 组织和分发语义仍由对应 ref / truth 承接。 |
| 不升级为核心前置 | marketplace 不可用不得阻塞核心方法资产定义、正式化、消费和追溯。 |

## 9. Typed Ref 批次:再写入

### 9.1 写入内容

- 已写入 core / formal / consumption refs:`D1 MethodAssetDefinitionRef`、`D2 CatalogScopeRef`、`D3 GovernanceBasisRef`、`D4 ConsumptionContextRef`。
- 已写入 trace / relation refs:`D5 TraceSubjectRef`、`D6 ConsumptionImpactSourceRef`、`D7 RelatedMethodAssetRef`、`D8 MethodAssetDistributionRef`、`D9 DistributionContextRef`。
- 已写入 external / operation / peripheral refs:`D10 ExternalSourceRef`、`D11 ArtifactArchiveRef`、`D12 MaintenanceRunRef`、`D13 RefreshScopeRef`、`D14 MethodPackageRef`、`D15 MethodSetAssemblyRef`、`D16 MarketplaceContextRef`。
- 已确认 `MethodSetAssemblyRef` 独立进入本批,用于承接 Step 5 和 `MethodSetAssemblyView` 的来源锚点。
- 已将本附录对象索引中 16 个 typed / external ref 状态更新为 `object_written`。
- 已将本附录当前恢复点推进到 `trace / audit / history 批次:先思考`。

### 9.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 trace / audit / history / lineage 对象 | no |
| 写 `MethodAssetAuditTrail` 或任何 history 对象卡片 | no |
| 新增 `StandardAdrSourceRef` / `EvidenceLineageRef` 等额外 ref | no |
| 写 event payload / outbox schema / report schema / storage schema | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 9.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 16 个 typed / external ref 对象卡片 | pass |
| 是否保持 ref body-free | pass |
| 是否避免外部正文、artifact 包体、marketplace 交易和下游运行 truth 越界 | pass |
| 是否避免 trace/audit/history/lineage 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `trace / audit / history 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit trace / audit / history 批次:先思考`;只思考 trace、audit、history、lineage 对象边界,不得直接写对象卡片正文、payload schema、接口、流程、状态迁移或正式 §6。

## 10. Trace / Audit / History 批次:先思考

### 10.1 问题回答

- 本批只讨论 trace、audit、history、lineage 对象边界和下一写入分组,不写对象卡片正文。
- 下一写入批次应写 9 个对象:`MethodAssetAuditTrail`、`MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial`、`MethodAssetEvidenceLineage`、`RelationChangeHistory`、`ExternalBasisAcceptanceHistory`、`MaintenanceRunHistory`、`PackageAssemblyHistory`。
- 这些对象必须保持 body-free / no raw log。它们只能组织变化线索、来源回指、摘要校验、主体引用和可审计解释,不得保存事件 payload、raw audit dump、telemetry、report body、证据文件正文、外部正文或 artifact/archive 包体。
- history / audit / lineage 不替代当前 truth。定义当前语义仍归 `MethodAssetDefinition`;正式版本仍归 `FormalMethodAssetVersion`;关系当前 truth 仍归 `MethodAssetRelation`;外部摘要仍归 `ExternalSourceSummary`;维护和外围对象仍按各自 owner 承接。
- 本批不新增 `ConsumptionLineageRef`、`EvidenceLineageRef`、`ExternalSourceLineageRef`、`RelationDistributionLineageRef` 等额外 ref 名称。其语义分别由 `ConsumptionTraceMaterial`、`MethodAssetEvidenceLineage`、`ExternalBasisAcceptanceHistory`、`RelationChangeHistory` 和既有 typed refs 承接。

### 10.2 诊断

- 追溯对象的主要风险是把“可解释的变化线索”写成第二 truth。history 只能解释过去发生过的变化、依据和影响,不能用来反推当前定义、正式化、关系、外部依据或外围组装状态。
- audit trail 的主要风险是被写成 raw log 或 observability dump。`MethodAssetAuditTrail` 必须是面向审计和验收的业务变化线索组织,不是日志表、trace span、telemetry schema、report artifact 或 event outbox。
- evidence lineage 的主要风险是保存证据正文。`MethodAssetEvidenceLineage` 只能串联 version、release、引用、外部来源和 artifact/archive ref,不得持有证据文件、标准全文、ADR 正文或验收报告正文。
- consumption trace 的主要风险是保存下游运行状态。`ConsumptionTraceMaterial` 只能让正式消费回溯到定义来源、正式版本和消费语境,不得保存 process instance、member state、runtime binding、image build、UI 会话或 SDK 调用正文。
- maintenance / package history 的主要风险是外围或运行实现反写核心。`MaintenanceRunHistory` 不保存 worker/job/scheduler 实现;`PackageAssemblyHistory` 不保存 marketplace 交易、安装包、组织启用或履约状态。

### 10.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| `MethodAssetDefinitionHistory` | 下一批写入 | 需要解释定义建立、调整、退役等变化来源,但不得替代 definition truth。 |
| `FormalizationHistory` | 下一批写入 | 需要解释正式化、版本语义变化和治理 / 外部依据承接,但不得保存治理执行。 |
| `ConsumptionTraceMaterial` | 下一批写入 | 需要支撑正式消费回溯到定义来源、正式版本和消费语境,但不得保存下游运行 truth。 |
| `MethodAssetAuditTrail` | 下一批写入 | 需要组织审计可读变化线索,但必须区别于 raw log、telemetry 和 report body。 |
| `MethodAssetEvidenceLineage` | 下一批写入 | 需要串联版本、发布、引用和证据线索,但不得保存证据或 artifact 正文。 |
| `RelationChangeHistory` | 下一批写入 | 需要解释关系和分发语义变化,但不得替代 relation truth 或 marketplace 交易。 |
| `ExternalBasisAcceptanceHistory` | 下一批写入 | 需要说明外部依据何时被承接、失效或挂起,但不得保存外部正文或治理执行。 |
| `MaintenanceRunHistory` | 下一批写入 | 需要说明维护 / 恢复动作来源和结果线索,但不得记录 worker、queue、cron 或 raw log。 |
| `PackageAssemblyHistory` | 下一批写入 | 需要说明外围 package / method set 组织变化,但不得成为核心闭环前置或 marketplace 履约记录。 |
| 额外 lineage/ref 名称 | 不新增 | 当前 9 个对象和已完成 typed refs 足以承接 Step 5 线索;若 Step 7/8 后续发现缺口,再按门禁补充。 |

### 10.4 结构化中间产物

| 下一写入组 | 对象 | 必须表达 | 不得表达 |
|---|---|---|---|
| core / formal / consumption history | `MethodAssetDefinitionHistory`;`FormalizationHistory`;`ConsumptionTraceMaterial` | 定义变化、正式化依据、版本语义变化、正式消费回溯链路。 | 当前 truth、治理执行、下游运行状态、完整状态迁移。 |
| audit / evidence / relation lineage | `MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`RelationChangeHistory` | 审计可读线索、证据 lineage、关系 / 分发变化解释。 | raw log、telemetry、report body、证据正文、关系图算法、marketplace 交易。 |
| external / maintenance / peripheral history | `ExternalBasisAcceptanceHistory`;`MaintenanceRunHistory`;`PackageAssemblyHistory` | 外部依据承接 / 失效、维护恢复线索、外围组装变化。 | 外部正文、artifact 包体、worker/job 实现、package 包体、组织运行配置、安装履约。 |

### 10.5 下一写入批次边界

- 只允许进入 `trace / audit / history 批次:再写入`。
- 可按 core/formal/consumption history、audit/evidence/relation lineage、external/maintenance/peripheral history 三个 patch 组写入。
- 只写 9 个对象的概要卡片:基本信息、字段骨架、成员函数、工厂函数、禁止事项。
- 不写完整 payload schema、event/outbox schema、report schema、storage schema、audit log schema、证据 JSON、DB table、接口、处理流、状态迁移或正式 `02-概要设计.md` §6。
- 不保存外部正文、artifact 正文、archive 包、证据文件正文、raw audit log、telemetry、marketplace 交易、安装 / 履约、下游运行 truth 或治理执行过程。

### 10.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:9 个 trace / audit / history / lineage 对象 |
| 是否把 raw log / report / evidence body 混入本批 | no |
| 是否新增额外 lineage/ref 名称 | no |
| 是否保持 history / audit / lineage 非当前 truth | pass |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit trace / audit / history 批次:再写入`;只写 9 个 trace / audit / history / lineage 对象卡片,不得写 payload schema、接口、流程、状态迁移或正式 §6。

## D17. `MethodAssetDefinitionHistory`

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | history record / definition lineage |
| 结构责任 | 记录方法资产定义建立、调整、重分类或退役的 body-free 历史线索,用于解释定义变化来源。 |
| 来源回指 | Step 5 `5.10`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-001/002/007;BR-ML-001~003/020/021;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存变化类型、定义 ref、摘要校验和依据 ref,不保存定义正文、旧版本正文、外部正文或 raw audit log。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| definition_history_ref | MethodAssetDefinitionHistoryRef | 定义历史记录稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 回指被解释的方法资产定义。 |
| change_kind | MethodAssetDefinitionChangeKind | 表达建立、调整、重分类、退役等变化类别。 |
| trace_subject_ref | TraceSubjectRef | 将历史记录接入追溯主体。 |
| change_basis_ref | Option<GovernanceBasisRef> | 可选变化依据引用。 |
| before_digest_ref | Option<MethodAssetIdentityDigestRef> | 变化前摘要线索,不保存旧正文。 |
| after_digest_ref | Option<MethodAssetIdentityDigestRef> | 变化后摘要线索,不保存新正文。 |

| 成员函数 | 作用 |
|---|---|
| concerns_definition(MethodAssetDefinitionRef definition_ref) | 判断历史记录是否属于指定定义。 |
| is_retirement_change() | 判断是否为退役类变化。 |
| assert_body_free() | 校验历史记录不携带定义正文或外部正文。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition_change(MethodAssetDefinitionRef definition_ref, MethodAssetDefinitionChangeKind change_kind) | 从定义变化线索建立历史记录。 |
| from_basis(MethodAssetDefinitionRef definition_ref, GovernanceBasisRef change_basis_ref) | 从变化依据建立定义历史记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代当前定义 truth | 当前定义语义仍由 `MethodAssetDefinition` 承载。 |
| 不保存定义正文 | 历史只保存 ref、摘要和变化线索,不得保存正文 diff。 |
| 不写 audit payload | event payload、raw audit dump、telemetry 和 report body 不属于本对象。 |

## D18. `FormalizationHistory`

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | history record / formalization lineage |
| 结构责任 | 记录方法资产正式化、版本语义变化、挂起、撤回或替代的可解释历史线索。 |
| 来源回指 | Step 5 `5.12`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-003/004/007/009;BR-ML-004/009/010/019/020/022;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存正式版本 ref、正式化状态线索、依据 ref 和摘要校验,不保存治理执行、裁决正文或版本正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| formalization_history_ref | FormalizationHistoryRef | 正式化历史记录稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 回指被正式化的方法资产定义。 |
| formal_version_ref | Option<FormalMethodAssetVersionRef> | 可选正式版本引用。 |
| formalization_change_kind | FormalizationChangeKind | 表达进入正式、版本变化、挂起、撤回或替代。 |
| basis_ref | Option<GovernanceBasisRef> | 正式化或版本变化依据引用。 |
| formalization_state_ref | Option<FormalizationStateRef> | 指向状态 owner 的历史线索,不写状态迁移矩阵。 |
| version_digest_ref | Option<FormalVersionDigestRef> | 正式版本摘要校验线索。 |

| 成员函数 | 作用 |
|---|---|
| concerns_formal_version(FormalMethodAssetVersionRef formal_version_ref) | 判断历史记录是否属于指定正式版本。 |
| requires_basis() | 判断该类变化是否必须具备依据引用。 |
| assert_no_governance_body() | 校验没有携带治理裁决正文或执行过程。 |

| 工厂函数 | 作用 |
|---|---|
| from_formalization(MethodAssetDefinitionRef definition_ref, GovernanceBasisRef basis_ref) | 从正式化依据建立历史记录。 |
| from_version_change(FormalMethodAssetVersionRef formal_version_ref, FormalizationChangeKind change_kind) | 从正式版本变化建立历史记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代正式版本 truth | 当前正式版本语义仍由 `FormalMethodAssetVersion` 承载。 |
| 不保存治理执行 | gate、审批、policy enforce、责任分派和执行状态不属于本仓 history。 |
| 不写状态迁移 | 完整 formalization 状态流转留 Step 9。 |

## D19. `ConsumptionTraceMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 / 追溯与一致性保护 |
| 对象类型 | trace material / consumption history |
| 结构责任 | 让正式消费材料可回溯到定义来源、正式版本、消费语境和边界依据,支撑 BR-ML-021。 |
| 来源回指 | Step 5 `5.14`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-005/006/007/008;BR-ML-003/005/008/011/020/021;`01-架构设计.md` §9/§10/§13。 |
| body-free 边界 | 只保存消费材料 ref、消费语境 ref、正式版本 ref 和 trace subject,不保存下游运行状态或 SDK/UI 调用正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| consumption_trace_material_ref | ConsumptionTraceMaterialRef | 正式消费追溯材料稳定引用。 |
| consumption_material_ref | MethodAssetConsumptionMaterialRef | 回指被消费的只读材料。 |
| formal_version_ref | FormalMethodAssetVersionRef | 回指消费所依据的正式版本。 |
| definition_ref | MethodAssetDefinitionRef | 回指定义来源。 |
| consumption_context_ref | ConsumptionContextRef | 标识正式消费语境。 |
| boundary_ref | DownstreamConsumptionBoundaryRef | 指向消费边界。 |
| trace_subject_ref | TraceSubjectRef | 接入追溯主体链路。 |

| 成员函数 | 作用 |
|---|---|
| traces_to_definition(MethodAssetDefinitionRef definition_ref) | 判断消费追溯是否回指指定定义。 |
| assert_context(ConsumptionContextRef consumption_context_ref) | 校验消费语境一致。 |
| assert_boundary(DownstreamConsumptionBoundaryRef boundary_ref) | 校验消费材料未越过 Definition vs Use 边界。 |

| 工厂函数 | 作用 |
|---|---|
| from_consumption_material(MethodAssetConsumptionMaterialRef consumption_material_ref, FormalMethodAssetVersionRef formal_version_ref) | 从正式消费材料建立追溯材料。 |
| from_context(MethodAssetDefinitionRef definition_ref, ConsumptionContextRef consumption_context_ref) | 从定义和消费语境建立追溯材料。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存下游运行 truth | process instance、member state、runtime binding、image build、UI 会话和 SDK 调用正文不得进入。 |
| 不替代消费材料 | 可读取内容仍由 `MethodAssetConsumptionMaterial` 承载。 |
| 不隐式正式化 | trace material 存在不代表未正式化资产可被正式消费。 |

## D20. `MethodAssetAuditTrail`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | audit trail / safe audit material |
| 结构责任 | 组织面向审计和验收可读的方法资产变化线索,串联定义、正式化、消费、关系、外部依据和维护历史。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-007/009;BR-ML-020~022;NFR-ML-009~011/015/016;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存 safe audit marker、subject refs 和历史记录 refs,不保存 raw log、telemetry、event payload、report body 或证据正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| audit_trail_ref | MethodAssetAuditTrailRef | 审计轨迹稳定引用。 |
| audit_subject_ref | TraceSubjectRef | 审计轨迹关注的主体。 |
| audit_scope_ref | MethodAssetAuditScopeRef | 审计覆盖范围。 |
| history_refs | MethodAssetHistoryRefSet | 关联 definition/formalization/relation/maintenance 等历史 refs。 |
| evidence_lineage_refs | MethodAssetEvidenceLineageRefSet | 关联证据 lineage refs。 |
| audit_summary_digest_ref | Option<AuditSummaryDigestRef> | 审计摘要一致性校验。 |

| 成员函数 | 作用 |
|---|---|
| includes_subject(TraceSubjectRef trace_subject_ref) | 判断审计轨迹是否覆盖指定主体。 |
| attach_history(MethodAssetHistoryRef history_ref) | 关联 body-free 历史记录。 |
| attach_evidence_lineage(MethodAssetEvidenceLineageRef lineage_ref) | 关联证据 lineage 线索。 |
| assert_safe_audit_material() | 校验审计轨迹没有 raw log 或正文。 |

| 工厂函数 | 作用 |
|---|---|
| from_subject(TraceSubjectRef audit_subject_ref, MethodAssetAuditScopeRef audit_scope_ref) | 从审计主体和范围建立审计轨迹。 |
| from_history_set(TraceSubjectRef audit_subject_ref, MethodAssetHistoryRefSet history_refs) | 从历史记录集合建立审计轨迹。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw log | 日志行、trace span、telemetry、metric、event payload 和 outbox body 不属于本对象。 |
| 不替代业务 truth | 审计轨迹只能解释变化线索,不能决定当前定义、版本、关系或外部摘要。 |
| 不保存 report body | 验收报告、审计报告和证据正文只能以 ref / lineage 出现。 |

## D21. `MethodAssetEvidenceLineage`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | lineage / evidence handoff |
| 结构责任 | 串联方法资产版本、发布、引用、外部来源和 artifact/archive 证据线索,支撑正式验收或审计回溯。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.20`;Step 5 `5.26`;`00-需求文档.md` FR-ML-009;BR-ML-020~022;NFR-ML-011;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存 evidence subject、external/artifact refs 和摘要校验线索,不保存证据文件正文、artifact 包体、标准全文或验收报告正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| evidence_lineage_ref | MethodAssetEvidenceLineageRef | 证据 lineage 稳定引用。 |
| lineage_subject_ref | TraceSubjectRef | lineage 关联的追溯主体。 |
| formal_version_ref | Option<FormalMethodAssetVersionRef> | 可选正式版本引用。 |
| external_source_refs | ExternalSourceRefSet | 外部来源 refs。 |
| artifact_archive_refs | ArtifactArchiveRefSet | artifact / archive 证据 refs。 |
| evidence_digest_ref | Option<EvidenceLineageDigestRef> | 证据线索摘要校验。 |

| 成员函数 | 作用 |
|---|---|
| concerns_subject(TraceSubjectRef trace_subject_ref) | 判断 lineage 是否关联指定主体。 |
| has_artifact_evidence() | 判断是否关联 artifact/archive refs。 |
| assert_no_evidence_body() | 校验证据正文未进入 lineage。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_sources(TraceSubjectRef lineage_subject_ref, ExternalSourceRefSet external_source_refs) | 从外部来源 refs 建立 lineage。 |
| from_artifact_refs(TraceSubjectRef lineage_subject_ref, ArtifactArchiveRefSet artifact_archive_refs) | 从 artifact/archive refs 建立 lineage。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存证据正文 | 证据文件、验收报告、artifact 正文和 archive 包体不得进入 lineage。 |
| 不替代外部来源 truth | 外部来源生命周期和权限仍归外部系统或 artifact/archive 边界。 |
| 不写证据 schema | 证据 JSON、报告字段和验收产物结构留给测试 / 验收方案。 |

## D22. `RelationChangeHistory`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | history record / relation lineage |
| 结构责任 | 记录方法资产关系、关系端点或分发语义变化的历史线索,供一致性保护和影响分析解释。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-006/008;BR-ML-008/011/016/020/021;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存 relation ref、distribution ref、端点 refs 和变化摘要,不保存关系图算法、同步协议、marketplace 交易或分发 payload。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| relation_change_history_ref | RelationChangeHistoryRef | 关系变化历史稳定引用。 |
| relation_ref | MethodAssetRelationRef | 回指关系 truth。 |
| source_definition_ref | MethodAssetDefinitionRef | 关系来源端点。 |
| target_asset_ref | RelatedMethodAssetRef | 关系目标端点。 |
| distribution_ref | Option<MethodAssetDistributionRef> | 可选分发语义引用。 |
| change_kind | RelationChangeKind | 表达建立、调整、废弃、分发语义变化等类别。 |
| impact_source_ref | Option<ConsumptionImpactSourceRef> | 可选消费影响来源。 |

| 成员函数 | 作用 |
|---|---|
| concerns_relation(MethodAssetRelationRef relation_ref) | 判断历史记录是否属于指定关系。 |
| touches_definition(MethodAssetDefinitionRef definition_ref) | 判断变化是否影响指定定义端点。 |
| has_distribution_change() | 判断是否包含分发语义变化。 |

| 工厂函数 | 作用 |
|---|---|
| from_relation_change(MethodAssetRelationRef relation_ref, RelationChangeKind change_kind) | 从关系变化建立历史记录。 |
| from_distribution_change(MethodAssetDistributionRef distribution_ref, RelationChangeKind change_kind) | 从分发语义变化建立历史记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 relation truth | 当前关系方向、约束和端点仍由 `MethodAssetRelation` 承载。 |
| 不保存关系图算法 | graph traversal、推荐、排序和传播算法不属于本对象。 |
| 不保存 marketplace 交易 | listing、订单、安装、履约和同步结果不得进入关系历史。 |

## D23. `ExternalBasisAcceptanceHistory`

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | history record / external basis lineage |
| 结构责任 | 记录外部依据被接收、更新、失效、挂起或拒绝的历史线索,解释正式化和追溯所用外部依据状态。 |
| 来源回指 | Step 5 `5.20`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-003/009;BR-ML-018~022;`01-架构设计.md` §9/§13。 |
| body-free 边界 | 只保存 external source ref、governance basis ref、摘要校验和接收状态线索,不保存外部正文、治理执行或 artifact 正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| external_basis_history_ref | ExternalBasisAcceptanceHistoryRef | 外部依据承接历史稳定引用。 |
| external_source_ref | ExternalSourceRef | 回指外部来源。 |
| governance_basis_ref | Option<GovernanceBasisRef> | 可选治理 / 标准 / ADR 依据引用。 |
| acceptance_kind | ExternalBasisAcceptanceKind | 表达接收、更新、失效、挂起或拒绝。 |
| summary_digest_ref | Option<ExternalSummaryDigestRef> | 外部摘要校验线索。 |
| evidence_lineage_ref | Option<MethodAssetEvidenceLineageRef> | 可选证据 lineage 线索。 |

| 成员函数 | 作用 |
|---|---|
| concerns_source(ExternalSourceRef external_source_ref) | 判断历史记录是否属于指定外部来源。 |
| is_suspended_or_invalid() | 判断外部依据是否处于挂起或失效线索。 |
| assert_no_external_body() | 校验没有保存外部正文。 |

| 工厂函数 | 作用 |
|---|---|
| from_accepted_source(ExternalSourceRef external_source_ref, ExternalSummaryDigestRef summary_digest_ref) | 从已接收外部摘要建立历史记录。 |
| from_basis_change(GovernanceBasisRef governance_basis_ref, ExternalBasisAcceptanceKind acceptance_kind) | 从依据承接变化建立历史记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 标准全文、ADR 正文、外部文档、网页、artifact 和证据文件正文不得进入。 |
| 不保存治理执行 | 审批、裁决过程、policy enforce 和责任分派不属于本对象。 |
| 不替代 external summary | 当前外部摘要仍由 `ExternalSourceSummary` 承载。 |

## D24. `MaintenanceRunHistory`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | history record / maintenance lineage |
| 结构责任 | 记录读取材料刷新、追溯材料刷新、一致性恢复或外围收敛运行的来源、范围和结果线索。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` NFR-ML-004~006/013/015/016;`01-架构设计.md` §10/§11/§13。 |
| body-free 边界 | 只保存 maintenance run ref、refresh scope ref、结果摘要和历史线索,不保存 worker、job、queue、cron、lock、retry、raw log 或 telemetry。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| maintenance_history_ref | MaintenanceRunHistoryRef | 维护运行历史稳定引用。 |
| maintenance_run_ref | MaintenanceRunRef | 回指维护运行语境。 |
| refresh_scope_ref | RefreshScopeRef | 回指刷新 / 恢复范围。 |
| run_kind | MaintenanceRunKind | 区分读取材料刷新、追溯刷新、一致性恢复或外围收敛。 |
| run_outcome_kind | MaintenanceRunOutcomeKind | 概要表达完成、挂起、失败、部分完成或无需动作。 |
| affected_trace_subject_refs | TraceSubjectRefSet | 可选受影响主体集合。 |
| outcome_digest_ref | Option<MaintenanceOutcomeDigestRef> | 结果摘要校验线索。 |

| 成员函数 | 作用 |
|---|---|
| concerns_run(MaintenanceRunRef maintenance_run_ref) | 判断历史记录是否属于指定维护运行。 |
| covers_scope(RefreshScopeRef refresh_scope_ref) | 判断历史记录是否覆盖指定刷新范围。 |
| is_failed_or_suspended() | 判断维护运行是否失败或挂起。 |

| 工厂函数 | 作用 |
|---|---|
| from_run(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef refresh_scope_ref) | 从维护运行和刷新范围建立历史记录。 |
| from_outcome(MaintenanceRunRef maintenance_run_ref, MaintenanceRunOutcomeKind run_outcome_kind) | 从维护结果建立历史记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存执行实现 | worker、job、scheduler、queue、cron、lock 和 retry 不属于本对象。 |
| 不保存运行日志 | raw log、telemetry、metric、trace span 和 report body 不得进入。 |
| 不反写 core truth | 维护历史不能修改定义、正式版本、关系或外部摘要 truth。 |

## D25. `PackageAssemblyHistory`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | history record / peripheral lineage |
| 结构责任 | 记录方法资产包、方法集组装、外围采用或生态发现语义变化的历史线索。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-E-001/002;BR-ML-016;BR-ML-E-001;`01-架构设计.md` §8/§9/§13。 |
| body-free 边界 | 只保存 package / method set refs、成员 refs、生态上下文和变化摘要,不保存包体、组织运行配置、marketplace 交易、安装或履约状态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| package_assembly_history_ref | PackageAssemblyHistoryRef | 外围组装历史稳定引用。 |
| package_ref | Option<MethodPackageRef> | 可选方法资产包引用。 |
| method_set_assembly_ref | Option<MethodSetAssemblyRef> | 可选方法集组装引用。 |
| assembly_change_kind | PackageAssemblyChangeKind | 表达组装、成员调整、外围采用变化或生态发现变化。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 关联的核心方法资产成员 refs。 |
| marketplace_context_ref | Option<MarketplaceContextRef> | 可选生态发现上下文。 |
| assembly_digest_ref | Option<PackageAssemblyDigestRef> | 组装变化摘要校验线索。 |

| 成员函数 | 作用 |
|---|---|
| concerns_package(MethodPackageRef package_ref) | 判断历史记录是否属于指定 package。 |
| concerns_method_set(MethodSetAssemblyRef method_set_assembly_ref) | 判断历史记录是否属于指定 method set。 |
| assert_peripheral_only() | 校验外围历史不成为核心闭环前置。 |

| 工厂函数 | 作用 |
|---|---|
| from_package_change(MethodPackageRef package_ref, PackageAssemblyChangeKind assembly_change_kind) | 从 package 变化建立历史记录。 |
| from_method_set_change(MethodSetAssemblyRef method_set_assembly_ref, PackageAssemblyChangeKind assembly_change_kind) | 从 method set 变化建立历史记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存包体 | 插件包、配置包、archive 包、安装包和文件正文不得进入。 |
| 不保存 marketplace 履约 | listing、价格、订单、购买、结算、安装和履约状态不属于本对象。 |
| 不升级为核心前置 | 外围组装历史不得阻塞核心定义、正式化、消费和追溯闭环。 |

## 11. Trace / Audit / History 批次:再写入

### 11.1 写入内容

- 已写入 core / formal / consumption history:`D17 MethodAssetDefinitionHistory`、`D18 FormalizationHistory`、`D19 ConsumptionTraceMaterial`。
- 已写入 audit / evidence / relation lineage:`D20 MethodAssetAuditTrail`、`D21 MethodAssetEvidenceLineage`、`D22 RelationChangeHistory`。
- 已写入 external / maintenance / peripheral history:`D23 ExternalBasisAcceptanceHistory`、`D24 MaintenanceRunHistory`、`D25 PackageAssemblyHistory`。
- 已确认 history / audit / lineage 对象不替代当前 truth,只保存 body-free 变化线索、来源回指、摘要校验和 safe audit material。
- 已将本附录对象索引中 9 个 trace / audit / history / lineage 对象状态更新为 `object_written`。
- 已将本附录当前恢复点推进到 `operations_peripheral maintenance task 批次:先思考`。

### 11.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 event payload / outbox schema / report schema / storage schema | no |
| 写 audit log schema / telemetry / metric / trace span | no |
| 写 evidence JSON / report body / artifact body / archive body | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 11.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 9 个 trace / audit / history / lineage 对象卡片 | pass |
| 是否保持 body-free / no raw log / no external body | pass |
| 是否避免 history / audit / lineage 替代当前 truth | pass |
| 是否避免 marketplace、artifact、governance、下游运行 truth 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `operations_peripheral maintenance task 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `operations_peripheral maintenance task 批次:先思考`;只思考 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 写入边界,不得直接写对象卡片正文、job/worker、接口、流程、状态迁移或正式 §6。
