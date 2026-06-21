# L3-method-library 02 概要 Step 6: 关键对象轮廓

> 创建日期: 2026-06-16
> 状态: full_rewrite_completed
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-method-library/02-概要设计.md`
> 本轮口径: Step 6 完全重写;以当前 `00-需求文档.md`、`01-架构设计.md`、Step 5 `0R` 结论和 L1-governance Step 6 框架为第一来源;历史段 H3~H7 与 8.1~8.4 只作 historical material 和后置差异审计。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 关键对象轮廓 |
| 输出文件 | `design-calibration/02_hld_step_06_key_objects.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_05_components_boundary.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 6;`概要设计书写规范.md` 4.6;`设计文档讨论中间产物规范.md` 3.5 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md`;`02_hld_step_05_components_boundary.md`;L1-governance Step 6 主控与附录 |
| 旧材料处理 | 本文件历史段 H3~H7 与 8.1~8.4 已判定为 historical material;历史 `02-概要设计.md` §6 与 `03_ddd_*` 只作后置差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 6 已完成;等待用户确认后进入 Step 7 `开工与必读文档:先思考`;不得直接沿用既有 Step 7 文件完成态,不得进入 Step 8/9。 |

---

## 1. 完全重写必读文档

| 顺序 | 文档 | 读取重点 | 对 Step 6 的约束 |
|---:|---|---|---|
| 1 | `design-calibration/project_execution_ledger.md` | 项目级恢复点和当前 next action。 | 必须按台账从 Step 6 完全重写恢复,不得回到旧迁移路线。 |
| 2 | `design-calibration/02_hld_calibration_flow.md` | 文档级 Step 状态、阻塞关系和下一模块。 | Step 7~9 继续 blocked_by_step6_full_rewrite,不得越级。 |
| 3 | `standards/document/概要设计讨论流程_SOP.md` Step 6 | 关键对象轮廓的目标、应问问题、对象候选池筛选、单对象小节和停审要求。 | 必须按候选池筛选、对象分类、单对象骨架、Step 8/9 反查和停审推进。 |
| 4 | `standards/document/概要设计书写规范.md` 4.6 | 对象候选池筛选说明、单对象小节格式、字段 / 状态 / 成员函数 / 工厂函数表。 | 字段表使用 `字段 | 类型 | 作用`;函数参数必须写 `TypeName param_name`;不写完整 Rust 签名或数据库列。 |
| 5 | `standards/document/设计文档讨论中间产物规范.md` 3.5 | 模块级先思考后写入、历史材料后置差异审计、长文档写入批次规则。 | 先搭整体模块骨架,再逐模块先思考、后写入;100~300 行只限制单次写入批次。 |
| 6 | `standards/document/设计真相源闭环与可落码性标准.md` | 防止关键对象缺 schema / port / state / boundary 来源,以及禁止实现端自行补口。 | 对象必须有 Step 5 来源、功能来源和边界说明;typed ref / state / policy 不能靠字符串或旧实现机制补齐。 |
| 7 | `projects/L3-method-library/00-需求文档.md` | 核心能力闭环、功能需求、业务规则、数据所有权、接口依赖和追溯矩阵。 | 新 Step 6 对象必须服务定义、目录、正式化、版本、受控消费、追溯、一致性和外围隔离。 |
| 8 | `projects/L3-method-library/01-架构设计.md` | 限界上下文、子域、数据所有权、一致性、交互通信和横切关注。 | 对象不能越过本仓 truth 边界;外部系统正文、交易履约、下游运行 truth 只能以 summary/ref/boundary 出现。 |
| 9 | `design-calibration/02_hld_step_05_components_boundary.md` | 8 个组成部分、对象发现维度、Step 6~9 承接门禁。 | Step 6 的对象候选池必须直接承接新 Step 5;若候选对象没有来源,必须回退修正,不得私补。 |
| 10 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | L1-governance 主控结构:筛选说明、对象分布、附录索引、Step 8/9 反查、回填口径。 | 只参考文件组织和深度,不得复制 Governance 对象或领域语义。 |
| 11 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_*` | truth、policy、projection、reference/audit 附录写法。 | L3 附录按对象类别拆分,每个对象独立成节并保持概要深度。 |
| 12 | 当前文件历史段 H3~H7 / 8.1~8.4 和历史 `02-概要设计.md` §6 | 旧对象遗漏与污染审计。 | 只能在新结论形成后后置审计,不得作为新对象筛选第一来源。 |

---

## 2. Step 内计划

| 顺序 | 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---:|---|---|---|---|---|
| 1 | Step 6 完全重写:先思考 | done | `8.5` 完全重写裁决、必读文档、输出框架和执行顺序。 | pass | 进入“完全重写开工框架:再写入”。 |
| 2 | Step 6 完全重写开工框架:再写入 | done | 本文件头、必读文档、Step 内计划、当前有效框架、历史材料边界、flow / 台账恢复点。 | pass | 进入“主控文件候选池筛选:先思考”。 |
| 3 | 主控文件候选池筛选:先思考 | done | 见 `8.7`:参考 L1-governance 主控框架,裁决 L3 需要搭建的主控筛选框架。 | pass | 等待用户确认后进入“主控文件候选池筛选:再写入”。 |
| 4 | 主控文件候选池筛选:再写入 | done | 见 `## 4` 与 `8.8`:候选池筛选表、对象类别总表、分布表、附录索引和反查占位。 | pass | 等待用户确认后进入“五个附录文件框架:先思考”。 |
| 5 | 五个附录文件框架:先思考 | done | 见 `8.9`:5 个附录文件职责、统一模板、对象索引、创建顺序和门禁。 | pass | 等待用户确认后进入“五个附录文件框架:再写入”。 |
| 6 | 五个附录文件框架:再写入 | done | 见 `8.10`:已创建 5 个附录文件头、开工门禁、模块计划和对象索引占位。 | pass | 进入 `core_truth` 附录对象批次:先思考。 |
| 7 | `core_truth` 附录逐模块先思考 / 再写入 | done | 已完成 core truth / state / support summary 八个对象卡片。 | pass | 进入 `policies_guards boundary / guard 批次:先思考`。 |
| 8 | `policies_guards` 附录逐模块先思考 / 再写入 | done | 已完成 boundary / guard 批次和 policy / invariant 批次对象卡片。 | pass | 进入 `views_materials catalog / consumption material 批次:先思考`。 |
| 9 | `views_materials` 附录逐模块先思考 / 再写入 | done | 已完成全部 view / material 对象卡片。 | pass | 进入 `refs_trace_audit typed ref 批次:先思考`。 |
| 10 | `refs_trace_audit` 附录逐模块先思考 / 再写入 | done | typed ref、external ref、trace、audit、history、lineage 对象卡片已完成。 | pass | 进入 `operations_peripheral maintenance task 批次:先思考`。 |
| 11 | `operations_peripheral` 附录逐模块先思考 / 再写入 | done | maintenance task、recovery、peripheral organization 对象卡片已完成。 | pass | 进入跨附录闭环审计。 |
| 12 | 跨附录闭环审计:先思考 / 再写入 | done | `8.37` / `8.38` 已完成跨附录审计框架和审计表。 | pass | 进入正式 §6 回填草稿。 |
| 13 | 正式 §6 回填草稿:先思考 / 再写入 | done | `8.39` / `8.40` 已完成正式 §6 回填草稿结构和正文草稿。 | pass | 进入 Step 6 自检与停审。 |
| 14 | Step 6 自检与停审 | done | `8.41` / `8.42` 已完成 Step 6 中间产物完成门禁、自检和停审裁决;`8.43` 已记录正式 §6 回填。 | pass | 进入正式 §6 回填后检查。 |
| 15 | 正式 §6 回填后检查 | done | `8.44` / `8.45` 已完成正式 §6 对照检查、污染区分层、Step 6 关闭裁决和恢复点推进依据。 | pass | 等待用户确认后进入 Step 7 `开工与必读文档:先思考`;不得直接沿用既有 Step 7 文件完成态。 |

## 3. 当前有效主控框架

| 项目 | 当前裁决 |
|---|---|
| 重写方式 | 完全重写,不是迁移旧对象卡片。 |
| 第一来源 | 当前 `00-需求文档.md`;当前 `01-架构设计.md`;新 Step 5 `0R` 结论;L1-governance Step 6 文件组织框架。 |
| 主控文件职责 | 记录必读文档、候选池筛选、对象类别总表、对象分布、附录索引、Step 8/9 反查、跨附录审计、旧材料差异审计、正式 §6 回填口径。 |
| 附录职责 | 5 个附录分别承载对象卡片正文;主控文件不长期保留完整对象卡片正文。 |
| 旧材料职责 | 历史段 H3~H7、8.1~8.4 和历史正式 §6 只作遗漏检查、污染检查和命名漂移审计。 |
| 当前禁止动作 | 不写批次外对象正文;不回填正式 §6;不进入 Step 7/8/9。 |

### 3.1 预定附录文件

| 文件 | 目标内容 | 当前状态 |
|---|---|---|
| `02_hld_step_06_key_objects_core_truth.md` | core/support/peripheral truth 与 state 对象。 | framework_created |
| `02_hld_step_06_key_objects_policies_guards.md` | policy、guard、boundary、invariant 对象。 | object_batch_completed |
| `02_hld_step_06_key_objects_views_materials.md` | projection、view、read material、freshness 对象。 | object_batch_completed |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | typed ref、external ref、trace、audit、history、lineage 对象。 | object_batch_completed |
| `02_hld_step_06_key_objects_operations_peripheral.md` | operation/support task、recovery、progress 和 peripheral 边界对象。 | peripheral_object_batch_completed |

### 3.2 历史材料边界

| 材料 | 当前用途 | 禁止事项 |
|---|---|---|
| 本文件历史段 H3~H7 与 8.1~8.4 | 后置差异审计、遗漏检查、命名漂移检查。 | 不作为新对象候选池第一来源,不直接迁移到附录。 |
| 历史 `02-概要设计.md` §6 | 污染检查和替换范围确认。 | 不保留旧 `MethodContent` / snapshot / fingerprint / outbox 主线。 |
| 历史 `03_ddd_*` | 详细设计阶段后置差异审计。 | 不反推概要对象、状态或接口。 |

### 3.3 当前停审

| 检查项 | 结论 |
|---|---|
| 是否已完成完全重写开工框架 | pass |
| 是否创建附录文件 | yes:5 个附录框架已创建 |
| 是否写对象正文 | yes:5 个附录对象批次均已写入 |
| 是否回填正式 §6 | yes:`8.43` 已记录正式 §6 回填 |
| 是否完成回填后检查 | yes:`8.44` / `8.45` 已完成 |
| 是否允许进入下一模块 | pass:下一模块为 Step 7 `开工与必读文档:先思考`;不得直接沿用既有 Step 7 文件完成态。 |

---

## 4. 主控文件候选池筛选

### 4.1 筛选原则

| 维度 | 进入 Step 6 的条件 | 不进入 / 后移条件 |
|---|---|---|
| 来源闭合 | 能回指当前 `00-需求文档.md`、`01-架构设计.md` 和 Step 5 `5.26`。 | 只来自旧 Step 6、旧 DDD、实现类名或历史机制。 |
| 对象责任 | 承担 truth、state、summary、policy、boundary、view、ref、trace、audit、operation 或 peripheral 语义。 | 只是 API、DTO、repository、adapter、worker、job、event、DDL、配置项或协议 schema。 |
| 边界价值 | 能防止字符串拼接、外部正文复制、下游运行 truth 入仓或外围能力反写核心。 | 只是普通字段、普通枚举值、实现辅助类或展示文案。 |
| 后续承接 | Step 7/8/9 会引用其作为接口、处理流或状态来源。 | 后续 Step 可由已有对象字段、policy 说明或流程局部变量承接。 |

### 4.2 对象类别总表

| 对象类别 | 正式候选 | 预期展开位置 |
|---|---|---|
| Core truth / State | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetRelation` | `02_hld_step_06_key_objects_core_truth.md` |
| Support summary / Basis | `FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` | `02_hld_step_06_key_objects_core_truth.md`;`02_hld_step_06_key_objects_refs_trace_audit.md` |
| Policy / Guard / Boundary | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule` | `02_hld_step_06_key_objects_policies_guards.md` |
| Projection / View / Read material | `MethodAssetCatalogView`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`MethodAssetConsumptionReadMaterial`;`MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetRelationView`;`DistributionReadMaterial`;`ExternalSourceSummaryView`;`MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView` | `02_hld_step_06_key_objects_views_materials.md` |
| Reference / Typed boundary | `MethodAssetDefinitionRef`;`CatalogScopeRef`;`GovernanceBasisRef`;`ConsumptionContextRef`;`TraceSubjectRef`;`ConsumptionImpactSourceRef`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef`;`ExternalSourceRef`;`ArtifactArchiveRef`;`MaintenanceRunRef`;`RefreshScopeRef`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef` | `02_hld_step_06_key_objects_refs_trace_audit.md` |
| Trace / Audit / History / Lineage | `MethodAssetAuditTrail`;`MethodAssetDefinitionHistory`;`FormalizationHistory`;`ConsumptionTraceMaterial`;`MethodAssetEvidenceLineage`;`RelationChangeHistory`;`ExternalBasisAcceptanceHistory`;`MaintenanceRunHistory`;`PackageAssemblyHistory` | `02_hld_step_06_key_objects_refs_trace_audit.md` |
| Operations / Recovery / Peripheral | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MethodPackage`;`MethodSetAssembly` | `02_hld_step_06_key_objects_operations_peripheral.md` |

### 4.3 并入、后移或排除候选

| 候选 | 处理 | 承接位置 / 理由 |
|---|---|---|
| `MethodAssetIdentityRule` | 并入 | 并入 `MethodAssetDefinition` 的 identity invariant,不单独成 policy。 |
| `CatalogApplicabilityRule` | 并入 | 并入 `MethodAssetCatalogEntry` / `MethodAssetCatalogView` 的适用语境说明。 |
| `VersionStabilityRule` | 并入 | 并入 `FormalMethodAssetVersion` 和 `ConsistencyProtectionPolicy` 的稳定边界。 |
| `ConsumptionBoundaryPolicy` | 并入 | 并入 `DownstreamConsumptionBoundary` 和 `DefinitionUseBoundaryGuard`。 |
| `ImpactClassificationRule` | 并入 | 并入 `ConsumptionImpactSummary` 的分类口径和一致性保护判断。 |
| `DistributionBoundaryRule` | 并入 | 并入 `MethodAssetDistributionRef` 和 `RelationIntegrityRule`。 |
| `ExternalBasisAcceptanceRule` | 并入 | 并入 `ExternalSourceSummary` 与 `ExternalBodyBoundaryRule`。 |
| `MaintenanceConvergenceRule` | 并入 | 并入 `ReadMaterialRefreshTask` / `TraceMaterialRefreshTask` 的维护边界。 |
| `RecoverySafetyRule` | 并入 | 并入 `ConsistencyRecoveryTask` 的恢复安全禁止事项。 |
| `MethodSetAssemblyRule` | 并入 | 并入 `PackageCompositionRule` / `MethodSetAssembly`。 |
| `MethodAssetAvailabilityState`;`ExternalBasisAcceptanceState` | 后移并点名 | Step 6 点名 owner,完整状态迁移留 Step 9。 |
| API / DTO / request / result | 后移 | 留给 Step 7 与详细设计,不得在 Step 6 伪装成对象。 |
| repository / port / adapter / worker / job / event / topic / DDL | 排除 | 属于接口、处理流、实现或持久化层。 |
| 旧 `MethodContent` 七类、fingerprint、snapshot、outbox | 排除 | 旧机制只作差异审计,不得进入本轮对象 truth。 |
| process / identity / governance / capability-hub / marketplace / artifact 内部对象 | 排除 | 相邻仓内部 truth 只能以 summary/ref/boundary 出现。 |
| 外部正文、artifact 正文、archive 包、raw audit log | 排除 | 本仓只保存摘要、引用或 lineage,不保存正文。 |

### 4.4 关键对象与组成部分分布

| Step 5 组成部分 | 候选对象分布 |
|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`CatalogScopeRef`;identity / catalog invariant 并入对应对象。 |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationState`;`GovernanceBasisRef`;`FormalizationEligibilityRule`;version stability 并入版本与保护对象。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetConsumptionReadMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsumptionContextRef`。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactSummary`;`ConsumptionImpactView`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`TraceSubjectRef`;`ConsumptionImpactSourceRef`;trace/history/lineage 对象。 |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetRelationView`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionReadMaterial`;`DistributionContextRef`;`RelationIntegrityRule`。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceSummaryView`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalBasisAcceptanceHistory`;acceptance state 点名后移 Step 9。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;`MaintenanceRunRef`;`RefreshScopeRef`;`MaintenanceRunHistory`。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef`;`MethodPackageView`;`MethodSetAssemblyView`;`PackageAssemblyHistory`。 |

### 4.5 对象展开文件索引

| 文件 | 主控分配 | 当前状态 | 创建门禁 |
|---|---|---|---|
| `02_hld_step_06_key_objects_core_truth.md` | core truth、state owner、support summary 的对象骨架。 | object_batch_completed | 已完成 8 个对象卡片;等待后续跨附录闭环审计。 |
| `02_hld_step_06_key_objects_policies_guards.md` | policy、guard、boundary、invariant 的对象骨架。 | object_batch_completed | 已完成全部 policy / guard / boundary / invariant 对象卡片;等待后续跨附录闭环审计。 |
| `02_hld_step_06_key_objects_views_materials.md` | projection、view、read material、freshness 的对象骨架。 | object_batch_completed | 已完成全部 view / material 对象卡片;等待跨附录闭环审计。 |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | typed ref、external ref、trace、audit、history、lineage 的对象骨架。 | object_batch_completed | 已完成 typed ref、external ref、trace、audit、history、lineage 全部对象卡片;等待跨附录闭环审计。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | maintenance task、recovery、progress、package、method set 的对象骨架。 | framework_created | 必须标注不阻塞核心闭环。 |

### 4.6 Step 7 / Step 8 / Step 9 反查占位

| 后续 Step | 本候选池提供的反查入口 | 禁止做法 |
|---|---|---|
| Step 7 接口骨架 | 接口参数和返回优先使用本 Step 对象、ref、summary、material、boundary。 | Step 7 私造 DTO 字段绕过 Step 6 对象来源。 |
| Step 8 处理流 | 处理流按定义、正式化、消费、追溯、一致性、关系分发、外部引用、维护、外围组织回指对象。 | 处理流从旧 publish / snapshot / outbox / fingerprint 主线恢复。 |
| Step 9 状态机 | 状态 owner 来自 `FormalizationState`、availability / acceptance state owner、task / recovery / peripheral 可见状态。 | 用旧 `MethodContentLifecycle` 或 adapter 私有状态承接。 |

### 4.7 当前停审

| 检查项 | 结论 |
|---|---|
| 候选池是否回指 Step 5 `5.26` | pass |
| 是否创建附录文件 | yes:5 个附录框架已创建 |
| 是否写对象卡片正文 | yes:core truth、policies_guards、views_materials 对象批次已写入 |
| 是否回填正式 §6 | no |
| 是否允许进入下一模块 | pass:下一模块为 `operations_peripheral maintenance task 批次:先思考`。 |

---

## H3. Historical: 旧整体模块骨架

| 模块组 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 候选池筛选 | 从 Step 5 的必须展开、待筛选和排除项中判断正式关键对象、仅字段类型、后续接口 / port、实现细节和明确排除项。 | 不从旧 Step 6、旧 DDD 草案或历史 `MethodContent` 类型恢复对象。 |
| 单对象小节 | 对每个正式关键对象写基本信息、关键字段骨架、状态集合、成员函数、工厂函数和禁止事项。 | 不写完整 Rust struct / enum、返回类型、错误类型、trait、泛型、生命周期、实现代码或数据库列。 |
| 逐组成部分小循环 | 按 Step 5 的 8 个组成部分依次完成对象正式化,每个组成部分完成后停审。 | 不先生成全仓对象全集再补所属组成部分。 |
| read model / material | 判断 read model、material、projection 是否作为关键对象独立展开,并说明非 truth 边界。 | 不把 view、projection、cache、report 写成第二 truth。 |
| policy / guard | 判断 policy、guard、rule 是否独立成对象或归入对象能力说明。 | 不写完整校验算法、配置矩阵、policy engine 或外部 resolver 规则。 |
| reference / boundary | 明确 typed ref / boundary object 的来源和用途。 | 不用字符串拼接、route param、marketplace id、URL 或文件路径替代 typed ref。 |
| audit / history / lineage | 判断审计、历史和 lineage 对象是否独立展开,并保持 body-free。 | 不保存 raw audit log、external body、artifact 正文、archive 包或证据文件正文。 |
| 后置差异审计 | 当前对象正式化完成后再审计旧材料污染。 | 不让旧材料参与当前对象筛选和对象骨架推导。 |

---

## H4. Historical: 旧 Step 5 候选池接收

### 4.1 Step 6 必须独立展开的候选对象

| 组成部分 | Step 5 指定候选 | Step 6 处理口径 |
|---|---|---|
| 方法资产定义与目录 | MethodAssetDefinition;MethodAssetCatalogEntry;MethodAssetDefinitionRef | 必须独立筛选并展开定义 truth、目录语义和 typed ref 边界。 |
| 正式化与版本 | FormalMethodAssetVersion;FormalizationBasisSummary;FormalizationState | 必须独立筛选并展开正式版本边界、依据摘要和正式化状态线索。 |
| 受控消费 | MethodAssetConsumptionMaterial;MethodAssetAvailabilityView;DownstreamConsumptionBoundary | 必须独立筛选并展开消费材料、可用性读取和 Definition vs Use 边界。 |
| 追溯与一致性保护 | MethodAssetTraceMaterial;ConsumptionImpactSummary;ConsistencyProtectionPolicy;MethodAssetAuditTrail | 必须独立筛选并展开追溯材料、影响摘要、一致性保护和审计线索。 |
| 关系与分发语义 | MethodAssetRelation;MethodAssetDistributionRef;RelationIntegrityRule | 必须独立筛选并展开定义性关系、分发引用和关系完整性。 |
| 外部摘要与引用 | ExternalSourceSummary;ExternalSourceRef;ArtifactArchiveRef;ExternalBodyBoundaryRule | 必须独立筛选并展开外部摘要、typed ref、artifact/archive ref 和正文禁止边界。 |
| 后台维护与收敛 | ReadMaterialRefreshTask;TraceMaterialRefreshTask;ConsistencyRecoveryTask | 必须独立筛选并展开 task / recovery 语义,不得写成 job 调度或 worker。 |
| 外围包与方法集组织 | MethodPackage;MethodSetAssembly;PackageCompositionRule | 必须独立筛选并展开外围增强性质和不阻塞核心闭环。 |

### 4.2 需要筛选但不得遗漏的候选

| 候选类别 | 候选对象 | Step 6 处理要求 |
|---|---|---|
| policy / invariant | MethodAssetIdentityRule;CatalogApplicabilityRule;FormalizationEligibilityRule;VersionStabilityRule;ConsumptionBoundaryPolicy;DefinitionUseBoundaryGuard;ImpactClassificationRule;DistributionBoundaryRule;ExternalBasisAcceptanceRule;MaintenanceConvergenceRule;RecoverySafetyRule;MethodSetAssemblyRule | 逐一判断是否独立成对象、归入 guard / policy 家族或作为不变量说明。 |
| read model / material | MethodAssetCatalogView;FormalMethodAssetVersionView;MethodAssetConsumptionReadMaterial;MethodAssetTraceView;ConsumptionImpactView;MethodAssetRelationView;DistributionReadMaterial;ExternalSourceSummaryView;MaintenanceProgressView;MethodPackageView;MethodSetAssemblyView | 逐一说明派生来源和非 truth 边界。 |
| reference / boundary | CatalogScopeRef;GovernanceBasisRef;ConsumptionContextRef;TraceSubjectRef;ConsumptionImpactSourceRef;RelatedMethodAssetRef;DistributionContextRef;MaintenanceRunRef;RefreshScopeRef;MethodPackageRef;MarketplaceContextRef | 必须决定 typed ref 家族和来源边界。 |
| history / audit / lineage | MethodAssetDefinitionHistory;FormalizationHistory;ConsumptionTraceMaterial;MethodAssetEvidenceLineage;RelationChangeHistory;ExternalBasisAcceptanceHistory;MaintenanceRunHistory;PackageAssemblyHistory | 必须说明是否独立展开,并保持 body-free / no raw log / no external body。 |
| state candidate | MethodAssetAvailabilityState;ExternalBasisAcceptanceState | 必须判断是否进入状态对象或状态词表;状态迁移留给 Step 9。 |

### 4.3 Step 6 明确排除项

| 排除项 | 排除理由 | 后续若需要如何进入 |
|---|---|---|
| 旧七类 P0 `MethodContent` 直接清单 | 当前 full-restart 未采用旧对象模型作为对象来源。 | 必须从当前 00 / 01 和 Step 5 重新推导。 |
| 旧 A-H 组成部分或旧 DDD 对象草案 | 历史结构混入实现分层、旧同步机制和过细对象。 | 只可在差异审计中比较,不得作为 Step 6 输入。 |
| repository、port、adapter、DTO、handler、worker、job、event、topic、database table | 属于后续接口、流程、实现或持久化层。 | Step 7~11 若需要再按正式边界展开。 |
| fingerprint、snapshot、outbox、PostgreSQL、object storage 等旧机制 | 当前 Step 5 未授权继承历史实现机制。 | 后续若采用必须由当前设计重新闭口。 |
| process / identity / governance / capability-hub / marketplace / artifact / console / SDK 内部对象 | 属于相邻仓或外部系统。 | 只能以摘要、typed ref、消费边界或外部依赖出现。 |
| marketplace 交易、安装和履约对象 | 已明确属于 `L6-marketplace`。 | 不进入本仓对象轮廓;仅保留生态上下文 ref。 |
| 外部正文、artifact 正文、archive 包、证据文件正文、raw audit log | 已明确禁止保存正文。 | 只能作为摘要、引用或 lineage。 |

---

## H5. Historical: 旧模块执行记录

### 5.1 对象候选池筛选:先思考

问题回答:

- Step 6 的候选池筛选必须从 Step 5 的三类输入开始:必须独立展开对象、需要筛选但不得遗漏的对象、明确排除项。
- “Step 5 必须展开对象”在本 Step 中原则上进入正式关键对象小节;只有当它实际只是字段类型、typed ref 家族中的普通成员或后续接口 / 实现细节时,才允许在筛选表中降级,并必须说明原因。
- “需要筛选但不得遗漏的候选”不能静默消失。每一项都必须落到四类之一:独立关键对象、并入某个对象的 policy / invariant / field、留给 Step 7~11、明确排除。
- Step 6 不以旧 `MethodContent`、旧七类 P0、旧 fingerprint / snapshot / outbox 或历史 DDD 对象作为对象来源。旧材料只在当前候选池筛选结论形成后做差异审计。

诊断:

- 当前 Step 5 已给出 8 个组成部分和一批对象线索,对象来源足够进入 Step 6;没有发现必须回退 Step 5 的缺口。
- 关键风险是对象数量膨胀。policy / rule、read model、typed ref、history / audit 线索很多,如果全部无差别独立成节,Step 6 会提前变成详细设计对象全集。
- 另一个风险是对象压缩。`MethodAssetDefinitionRef`、`ExternalSourceRef`、`ArtifactArchiveRef`、`DownstreamConsumptionBoundary` 等看起来像字段类型,但承担边界责任;如果不点名,Step 7/8 可能会用字符串或外部 id 私补。
- read model / material 需要特别区分 truth 与派生材料。`MethodAssetAvailabilityView`、`MethodAssetConsumptionReadMaterial`、`MaintenanceProgressView` 等可以进入对象轮廓,但必须写明派生来源和非 truth 地位。
- state candidate 只在 Step 6 点名状态词表来源和对象归属;完整状态迁移必须留给 Step 9。

取舍:

- 第一层正式关键对象采用 Step 5 `5.26.1` 的必须展开清单作为主轴,按 8 个组成部分逐个筛选。
- typed ref / boundary 类候选不一律降级为字段类型。凡是承担跨仓边界、正文禁止、消费边界、外围隔离或后续接口稳定输入的 ref / boundary,应作为 reference object 或 boundary object 独立展开。
- policy / invariant 类候选优先判断是否支撑对象不变量。若只是单对象内部规则,可并入对应对象的成员函数或禁止事项;若跨对象或跨组成部分,应独立成 policy / guard 对象。
- read model / material 类候选优先作为 projection / read material 对象处理,但在对象小节中必须标注“非 truth,由哪些 truth 派生”。
- history / audit / lineage 类候选按后续追溯和一致性保护需要筛选;raw log、外部正文和证据正文不得成为对象字段。

复杂度 / 越界检查:

- 本模块只形成筛选原则和取舍,尚未写候选池筛选说明表。
- 未写对象字段、状态集合、成员函数、工厂函数、接口、流程、存储、事件或协议 schema。
- 未把旧 Step 6、旧 P0 对象、repository、port、adapter、DTO、database table、job、worker 或 outbox 当作当前对象来源。
- 下一模块只允许写“对象候选池筛选:再写入”的筛选表,不得直接展开单对象小节。

### 5.2 对象候选池筛选:再写入

#### 5.2.1 正式独立展开对象

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| MethodAssetDefinition | Truth / State | 独立关键对象 | 定义 truth 主体,后续正式化、消费、关系和追溯均以它为锚点。 |
| MethodAssetCatalogEntry | Truth / catalog | 独立关键对象 | 承载目录语义和适用语境,不能用读取索引替代。 |
| MethodAssetDefinitionRef | Reference / Boundary | 独立关键对象 | 是定义、关系、消费和追溯的 typed ref 边界,不得由字符串拼接。 |
| MethodAssetCatalogView | Projection / Read model | 独立关键对象 | 是目录读取材料的 body-free read model,必须标注派生来源和非 truth。 |
| FormalMethodAssetVersion | Truth / State | 独立关键对象 | 承载正式版本边界和稳定引用语义。 |
| FormalizationBasisSummary | Reference / summary | 独立关键对象 | 承接治理、标准、ADR 或 artifact 的摘要 / 引用,禁止保存外部正文。 |
| FormalizationState | State enum | 独立关键对象 | 正式化结果会被 Step 8 / Step 9 使用,需要先固定状态词表来源。 |
| FormalizationEligibilityRule | Policy / Invariant | 独立关键对象 | 跨定义、目录和依据摘要判断正式化资格,不适合埋入单个字段。 |
| MethodAssetConsumptionMaterial | Read material / Boundary | 独立关键对象 | 是下游正式消费的材料边界,不能变成下游私有定义副本。 |
| MethodAssetAvailabilityView | Projection / State | 独立关键对象 | 承载可用性读取和状态线索,必须与 truth 分离。 |
| DownstreamConsumptionBoundary | Boundary object | 独立关键对象 | 承担 Definition vs Use 防护,是 Step 7/8 的关键输入。 |
| DefinitionUseBoundaryGuard | Policy / Guard | 独立关键对象 | 跨消费材料和下游边界执行 guard,不能由下游自行解释。 |
| MethodAssetTraceMaterial | Audit / History | 独立关键对象 | 承载变化、依据、引用语境和消费语境的追溯材料。 |
| ConsumptionImpactSummary | Summary / Boundary | 独立关键对象 | 承接下游影响摘要,但不得保存下游运行状态正文。 |
| ConsistencyProtectionPolicy | Policy / Guard | 独立关键对象 | 保护既有正式消费不被静默破坏,后续流程和状态会引用。 |
| MethodAssetAuditTrail | Audit record | 独立关键对象 | 组织 body-free audit / history 线索,不得退化为 raw log。 |
| TraceSubjectRef | Reference / Boundary | 独立关键对象 | trace / audit / lineage 需要稳定 subject 边界,不得从字符串推导。 |
| MethodAssetRelation | Truth / relation | 独立关键对象 | 承载方法资产之间的定义性关系,不是推荐图或运行依赖图。 |
| MethodAssetDistributionRef | Reference / Boundary | 独立关键对象 | 承载分发语义边界,不能表示 marketplace 交易或安装履约。 |
| RelationIntegrityRule | Policy / Invariant | 独立关键对象 | 跨关系端点校验完整性,不应散落在 relation 字段说明中。 |
| ExternalSourceSummary | Summary / State | 独立关键对象 | 承接外部依据的安全摘要和 acceptance state,不得保存外部正文。 |
| ExternalSourceRef | Reference / Boundary | 独立关键对象 | 外部来源 typed ref,是外部正文禁止边界的稳定锚点。 |
| ArtifactArchiveRef | Reference / Boundary | 独立关键对象 | artifact / archive 只能以 ref 进入,该边界必须被显式点名。 |
| ExternalBodyBoundaryRule | Policy / Guard | 独立关键对象 | 统一禁止外部正文、artifact 正文和 archive 包进入本仓 truth。 |
| ReadMaterialRefreshTask | Task object | 独立关键对象 | 表达读取材料刷新语义,但不等于 job 调度或 worker。 |
| TraceMaterialRefreshTask | Task object | 独立关键对象 | 表达追溯材料刷新语义,不得创建新的业务 truth。 |
| ConsistencyRecoveryTask | Recovery object | 独立关键对象 | 表达一致性恢复收敛语义,不得绕过正式化 / 消费边界。 |
| MaintenanceProgressView | Projection / Read model | 独立关键对象 | operations 需要 body-free progress 读取,必须标注非 truth。 |
| MethodPackage | Peripheral aggregate | 独立关键对象 | 外围包组织语义需要点名,但必须标注不阻塞核心闭环。 |
| MethodSetAssembly | Peripheral aggregate | 独立关键对象 | 组织级方法集组装语义需要点名,不得替代核心定义或正式版本。 |
| PackageCompositionRule | Policy / Invariant | 独立关键对象 | 外围 composition 规则跨 package / set,不能混入 marketplace 履约。 |
| MethodPackageRef | Reference / Boundary | 独立关键对象 | package 外围引用边界需要 typed ref,不得使用 package file path 或 listing id。 |

#### 5.2.2 并入、后移或排除的候选

| 候选名称 | 来源维度 | 筛选结论 | 原因 / 承接 |
|---|---|---|---|
| MethodAssetIdentityRule | Policy / Invariant | 并入 MethodAssetDefinition | 只约束定义身份稳定,作为 definition invariant 和成员函数骨架展开即可。 |
| CatalogApplicabilityRule | Policy / Invariant | 并入 MethodAssetCatalogEntry | 只约束目录适用语境,不需要独立对象。 |
| VersionStabilityRule | Policy / Invariant | 并入 FormalMethodAssetVersion | 用于版本稳定边界说明;完整判断留给 Step 8/9。 |
| ConsumptionBoundaryPolicy | Policy / Invariant | 并入 DownstreamConsumptionBoundary | 与消费边界对象同源,不另建平行 policy。 |
| ImpactClassificationRule | Policy / Invariant | 并入 ConsumptionImpactSummary / ConsistencyProtectionPolicy | 作为影响摘要分类和一致性保护规则展开。 |
| DistributionBoundaryRule | Policy / Invariant | 并入 MethodAssetDistributionRef | 只说明分发引用边界,不另成对象。 |
| ExternalBasisAcceptanceRule | Policy / Invariant | 并入 ExternalSourceSummary / ExternalBodyBoundaryRule | acceptance 与正文禁止边界共同承接。 |
| MaintenanceConvergenceRule | Policy / Invariant | 并入 ConsistencyRecoveryTask | 作为 recovery task 的不变量和禁止事项展开。 |
| RecoverySafetyRule | Policy / Invariant | 并入 ConsistencyRecoveryTask | 表达恢复安全边界,不单独成对象。 |
| MethodSetAssemblyRule | Policy / Invariant | 并入 PackageCompositionRule | 与外围 composition 规则合并。 |
| FormalMethodAssetVersionView | Projection / Read model | 并入 FormalMethodAssetVersion | 作为正式版本读取材料说明,不成为第二 truth。 |
| MethodAssetConsumptionReadMaterial | Read material | 并入 MethodAssetConsumptionMaterial | 与消费材料同源,避免双对象表达同一边界。 |
| MethodAssetTraceView | Projection / Read model | 并入 MethodAssetTraceMaterial | 作为 trace material 的读取形态说明。 |
| ConsumptionImpactView | Projection / Read model | 并入 ConsumptionImpactSummary | 作为影响摘要读取形态说明。 |
| MethodAssetRelationView | Projection / Read model | 并入 MethodAssetRelation | 作为 relation 的读取形态说明。 |
| DistributionReadMaterial | Read material | 并入 MethodAssetDistributionRef | 作为分发引用的读取材料说明。 |
| ExternalSourceSummaryView | Projection / Read model | 并入 ExternalSourceSummary | 作为 external summary 的读取形态说明。 |
| MethodPackageView | Projection / Read model | 并入 MethodPackage | 作为外围 package 读取材料说明。 |
| MethodSetAssemblyView | Projection / Read model | 并入 MethodSetAssembly | 作为 method set 读取材料说明。 |
| CatalogScopeRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 MethodAssetCatalogEntry / MethodAssetCatalogView 字段骨架,不独立成节。 |
| GovernanceBasisRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 FormalizationBasisSummary,不得保存 governance 正文。 |
| ConsumptionContextRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 MethodAssetConsumptionMaterial / DownstreamConsumptionBoundary。 |
| ConsumptionImpactSourceRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 ConsumptionImpactSummary。 |
| RelatedMethodAssetRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 MethodAssetRelation。 |
| DistributionContextRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 MethodAssetDistributionRef。 |
| MaintenanceRunRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 maintenance task / progress view。 |
| RefreshScopeRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 ReadMaterialRefreshTask / TraceMaterialRefreshTask。 |
| MarketplaceContextRef | Reference / Boundary | 字段类型 / typed ref 家族成员 | 归入 MethodPackage / MethodSetAssembly,不得成为 marketplace 交易对象。 |
| MethodAssetDefinitionHistory | Audit / History | 并入 MethodAssetAuditTrail | 作为定义 history entry 类型说明,不单独成 truth。 |
| FormalizationHistory | Audit / History | 并入 MethodAssetAuditTrail | 作为正式化历史线索说明。 |
| ConsumptionTraceMaterial | Audit / History | 并入 MethodAssetTraceMaterial | 与 trace material 同源。 |
| MethodAssetEvidenceLineage | Audit / History | 并入 MethodAssetTraceMaterial / MethodAssetAuditTrail | 作为 lineage 线索说明,不得保存证据正文。 |
| RelationChangeHistory | Audit / History | 并入 MethodAssetAuditTrail | 作为关系变化历史 entry 说明。 |
| ExternalBasisAcceptanceHistory | Audit / History | 并入 ExternalSourceSummary / MethodAssetAuditTrail | 作为外部依据 acceptance history 说明。 |
| MaintenanceRunHistory | Audit / History | 并入 maintenance task / MaintenanceProgressView | 作为维护运行历史读取线索说明。 |
| PackageAssemblyHistory | Audit / History | 并入 MethodPackage / MethodSetAssembly | 作为外围组织变化历史说明。 |
| MethodAssetAvailabilityState | State candidate | 并入 MethodAssetAvailabilityView | Step 6 点名状态集合;完整迁移留 Step 9。 |
| ExternalBasisAcceptanceState | State candidate | 并入 ExternalSourceSummary | Step 6 点名 acceptance state;完整迁移留 Step 9。 |

停审记录:

- 功能是否清楚: pass。筛选表已区分正式独立对象、并入对象、字段类型 / typed ref 家族成员和后续排除边界。
- 候选对象是否有功能来源: pass。正式独立对象均来自 Step 5 `5.26.1` 或 `5.26.2`,并可回指当前 00 / 01。
- 接缝是否清楚: pass。typed ref、boundary、summary、read material、task / recovery 的边界已单独标注。
- 禁止事项是否清楚: pass。旧 P0、旧实现机制、marketplace 交易、外部正文和下游运行 truth 未进入正式对象来源。
- 是否越界: pass。未写对象字段、状态值、成员函数、工厂函数、接口、流程、存储、事件或协议 schema。

### 5.3 方法资产定义与目录:先思考

问题回答:

- 本组成部分需要正式展开四个对象:`MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`MethodAssetCatalogView`。
- `MethodAssetDefinition` 承载方法资产定义 truth。它来自 Step 5 的定义建立、定义调整和本仓拥有定义真相的职责,并回指 `FR-ML-001`、`BR-ML-001` 与数据归属中的方法资产定义真相。
- `MethodAssetCatalogEntry` 承载目录身份、目录范围和适用语境。它来自 Step 5 的目录识别和适用语境表达,并回指 `FR-ML-002`、`BR-ML-002` 与架构中的方法资产定义与目录语义核心子域。
- `MethodAssetDefinitionRef` 需要独立点名为 reference object。它是正式化、消费、关系端点和追溯主体的稳定 typed ref,不能被 route param、字符串 key、旧 P0 类型名或外部 id 替代。
- `MethodAssetCatalogView` 作为 projection / read model 独立出现,但必须明确它只由 definition 与 catalog truth 派生,不是目录 truth 或第二定义 truth。

诊断:

- 定义 truth 与目录语义应分开表达。定义对象回答“这个方法资产作为本仓 truth 是什么”,目录项回答“它如何被识别、归类和放入适用语境”;二者合并会让 catalog scope、applicability 和 downstream lookup 失去清晰承载。
- 目录读取材料不能替代目录项。`MethodAssetCatalogView` 可以服务查询和浏览,但若把它当 truth,后续 Step 7/8 会把 projection 更新误写成定义或目录变更。
- `MethodAssetIdentityRule` 不需要独立成对象。它只约束定义身份稳定,应并入 `MethodAssetDefinition` 的不变量 / 成员函数骨架。
- `CatalogApplicabilityRule` 不需要独立成对象。它只约束目录适用语境,应并入 `MethodAssetCatalogEntry` 的不变量 / 成员函数骨架。
- `CatalogScopeRef` 目前只作为目录项和目录视图中的 typed ref 字段类型承接;除非 Step 7/8 发现它承担跨仓边界或独立生命周期,否则不在本组成部分单独成节。
- `MethodAssetDefinitionHistory` 不在本组成部分独立展开。定义变化历史应由后续 `MethodAssetAuditTrail` / trace material 统一承接,避免在定义对象旁边形成第二条历史 truth。

取舍:

- 保留四个独立对象,形成 `definition truth -> catalog entry -> typed ref -> catalog view` 的最小对象链。
- 不恢复旧七类 P0 `MethodContent` 直接清单。SPEM RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplate、ViewProfile、AIPolicy 等可作为后续 definition 分类或语义来源,但不能在 Step 6 重新拆成旧对象主轴。
- 不把 definition service、catalog service、repository、query API、event、index 或 database table 写入对象小节。它们分别属于 Step 7、Step 8 或后续详细设计。
- 不提前写字段全集、状态迁移、函数签名或 schema。本模块只确认哪些对象需要在“再写入”阶段展开,以及哪些候选并入或后移。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、接口、流程、存储、事件、协议 schema 或实现规则。
- 本模块未使用旧 Step 6、旧 DDD 草案、旧 fingerprint / snapshot / outbox 或历史 `MethodContent` 模型作为对象来源。
- 下一模块只允许进入“方法资产定义与目录:再写入”,为上述四个对象写概要级对象小节和停审记录。

### 5.4 方法资产定义与目录:再写入

#### 5.4.1 MethodAssetDefinition

##### 5.4.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | aggregate / truth object |
| 主要责任 | 承载本仓拥有的方法资产定义 truth、稳定身份和定义语义边界。 |
| 来源 | Step 5 `MethodAssetDefinition`;`FR-ML-001`;`BR-ML-001`;`BR-ML-003`;数据归属中的方法资产定义真相。 |

##### 5.4.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| definition_ref | MethodAssetDefinitionRef | 方法资产定义的稳定 typed ref,供正式化、消费、关系和追溯引用。 |
| definition_kind | MethodAssetDefinitionKind | 表达定义语义类别,不得恢复旧 P0 七类对象主轴。 |
| identity_key | MethodAssetIdentityKey | 支撑身份稳定判断,避免同一方法资产被下游或目录重复定义。 |
| definition_summary | MethodAssetDefinitionSummary | 承载本仓拥有的定义语义摘要,不保存外部正文或 artifact 正文。 |
| basis_refs | ExternalSourceRefSet | 记录定义来源线索的外部摘要 / 引用,不拥有外部 truth。 |
| catalog_entry_refs | MethodAssetCatalogEntryRefSet | 连接定义与目录语境,但不把目录读取材料写成定义 truth。 |

##### 5.4.1.3 状态集合

| 状态 | 作用 |
|---|---|
| DefinitionEstablished | 定义 truth 已建立,可作为目录、正式化和追溯的锚点。 |
| DefinitionUnderAdjustment | 定义语义正在调整或等待显式变化确认,不得隐式改变既有正式版本含义。 |
| DefinitionRetired | 定义已退出当前使用语境,但历史引用和追溯线索仍需保留。 |

##### 5.4.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_identity_stable(MethodAssetIdentityKey identity_key) | 校验定义身份未漂移。 |
| attach_catalog_entry(MethodAssetCatalogEntryRef catalog_entry_ref) | 将定义锚点连接到目录项。 |
| record_definition_adjustment(DefinitionAdjustmentSummary adjustment_summary) | 记录定义调整线索,不直接裁决正式版本结果。 |
| assert_definition_boundary(DownstreamConsumptionBoundary boundary) | 防止下游消费语境反向拥有或改写定义 truth。 |

##### 5.4.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_accepted_definition(MethodAssetIdentityKey identity_key, MethodAssetDefinitionSummary definition_summary) | 从已被本仓接受的定义语义建立 definition truth。 |
| from_definition_adjustment(MethodAssetDefinitionRef definition_ref, DefinitionAdjustmentSummary adjustment_summary) | 基于显式调整线索形成新的定义状态线索。 |

##### 5.4.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不裁决正式化结果 | 是否进入正式使用语境属于 `FormalMethodAssetVersion` / `FormalizationState`。 |
| 不保存外部正文 | 外部标准、治理裁决、artifact、archive 或示例正文只能以摘要 / ref 进入。 |
| 不保存下游运行 truth | process、identity、governance、marketplace、UI 或 artifact 的运行事实不得成为定义成立条件。 |
| 不恢复旧 P0 对象拆分 | 旧 `MethodContent` 七类清单只能作为后置差异审计材料。 |

#### 5.4.2 MethodAssetCatalogEntry

##### 5.4.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | entity / catalog truth object |
| 主要责任 | 承载方法资产目录身份、目录范围和适用语境。 |
| 来源 | Step 5 `MethodAssetCatalogEntry`;目录识别;适用语境表达;`FR-ML-002`;`BR-ML-002`。 |

##### 5.4.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| catalog_entry_ref | MethodAssetCatalogEntryRef | 目录项自身稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 目录项所属的方法资产定义锚点。 |
| catalog_scope_ref | CatalogScopeRef | 表达目录范围、适用语境或组织语境。 |
| catalog_identity | MethodAssetCatalogIdentity | 支撑人类和系统识别目录项。 |
| applicability_summary | CatalogApplicabilitySummary | 概要表达适用语境,完整判断留给后续流程和状态。 |
| display_summary | MethodAssetDisplaySummary | 为 catalog view 派生展示材料提供来源,不等于 UI 状态。 |

##### 5.4.2.3 状态集合

| 状态 | 作用 |
|---|---|
| CatalogEntryActive | 目录项当前可作为识别和查找锚点。 |
| CatalogEntryScopeLimited | 目录项存在明确适用范围限制,不得被泛化为全局可用。 |
| CatalogEntryRetired | 目录项退出当前目录语境,但历史 trace / audit 仍需可解释。 |

##### 5.4.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| bind_definition(MethodAssetDefinitionRef definition_ref) | 将目录项绑定到定义锚点。 |
| assert_applicable_to_scope(CatalogScopeRef catalog_scope_ref) | 判断目录项是否适用于给定目录语境。 |
| update_applicability(CatalogApplicabilitySummary applicability_summary) | 更新适用语境摘要,不改变定义 truth。 |
| retire_from_catalog(CatalogRetirementReason reason_ref) | 标记目录项退出当前目录语境。 |

##### 5.4.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_definition(MethodAssetDefinitionRef definition_ref, CatalogScopeRef catalog_scope_ref) | 基于定义锚点建立目录项。 |
| from_reclassification(MethodAssetCatalogEntryRef catalog_entry_ref, CatalogScopeRef catalog_scope_ref) | 基于显式重分类形成新的目录语境线索。 |

##### 5.4.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代定义 truth | 目录项只表达识别和适用语境,不能独立创建或修改方法资产定义。 |
| 不等同搜索索引 | 搜索、排序、全文检索或 UI 展示状态不属于目录项 truth。 |
| 不承担正式消费可用性 | 是否可被正式消费由受控消费和正式化对象共同约束。 |
| 不保存 marketplace 履约事实 | listing、交易、安装和结算属于 `L6-marketplace`。 |

#### 5.4.3 MethodAssetDefinitionRef

##### 5.4.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | reference object |
| 主要责任 | 为方法资产定义提供稳定 typed ref,防止跨对象和跨仓引用退化为字符串。 |
| 来源 | Step 5 `MethodAssetDefinitionRef`;`BR-ML-002`;`BR-ML-003`;Step 5 reference / boundary 线索。 |

##### 5.4.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| ref_value | MethodAssetDefinitionRefValue | 稳定 opaque reference 值。 |
| namespace_ref | MethodAssetNamespaceRef | 限定 ref 的命名空间或归属边界。 |
| definition_kind_marker | MethodAssetDefinitionKind | 辅助识别定义语义类别,不作为旧 P0 对象拆分。 |
| identity_key_ref | MethodAssetIdentityKeyRef | 回指身份稳定来源。 |

##### 5.4.3.3 状态集合

| 状态 | 作用 |
|---|---|
| not_applicable | reference object 无独立业务生命周期;其有效性由 `MethodAssetDefinition` 和后续状态机解释。 |

##### 5.4.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_same_definition(MethodAssetDefinitionRef other_ref) | 判断两个引用是否指向同一方法资产定义。 |
| assert_namespace(MethodAssetNamespaceRef namespace_ref) | 校验引用没有跨命名空间漂移。 |
| match_trace_subject(TraceSubjectRef trace_subject_ref) | 支撑追溯主体与定义引用的一致性判断。 |

##### 5.4.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_identity_key(MethodAssetIdentityKey identity_key) | 从正式身份键生成稳定定义引用。 |
| from_existing_ref(MethodAssetDefinitionRef definition_ref) | 接收既有 typed ref,避免重新拼接字符串引用。 |

##### 5.4.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不从字符串私造 | route param、文件路径、marketplace id、URL 或旧对象名不得直接拼成 ref。 |
| 不携带外部正文 | ref 只表达引用边界,不携带定义正文、外部来源正文或 artifact 正文。 |
| 不表达正式版本 | 正式版本引用属于 `FormalMethodAssetVersion`。 |
| 不表达下游使用状态 | 下游消费、运行、安装或展示状态不得写入 definition ref。 |

#### 5.4.4 MethodAssetCatalogView

##### 5.4.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | projection / read model |
| 主要责任 | 从定义和目录 truth 派生目录读取材料,服务查询与识别。 |
| 来源 | Step 5 `MethodAssetCatalogView`;read model 线索;`FR-ML-002`;01 架构中的本地投影 / 读取材料约束。 |

##### 5.4.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| catalog_view_ref | MethodAssetCatalogViewRef | 目录读取视图引用。 |
| source_definition_ref | MethodAssetDefinitionRef | 派生来源的定义锚点。 |
| source_catalog_entry_ref | MethodAssetCatalogEntryRef | 派生来源的目录项锚点。 |
| catalog_scope_ref | CatalogScopeRef | 读取视图适用的目录范围。 |
| display_summary | MethodAssetDisplaySummary | 面向查询和识别的展示摘要,不等于 UI 状态。 |
| projection_source_cursor | MethodAssetCatalogProjectionCursor | 记录视图派生来源位置,防止 projection 被误当 truth。 |

##### 5.4.4.3 状态集合

| 状态 | 作用 |
|---|---|
| CatalogViewCurrent | 视图与来源 definition / catalog truth 对齐。 |
| CatalogViewStale | 来源 truth 已变化,视图等待刷新。 |
| CatalogViewUnavailable | 视图当前不可用,但不影响来源 truth 成立。 |

##### 5.4.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| refresh_from_catalog(MethodAssetDefinition definition, MethodAssetCatalogEntry catalog_entry) | 从来源 truth 刷新读取材料。 |
| assert_derived_from(MethodAssetDefinitionRef definition_ref, MethodAssetCatalogEntryRef catalog_entry_ref) | 校验视图派生来源未漂移。 |
| mark_stale(CatalogViewStalenessReason reason_ref) | 标记视图需要刷新。 |

##### 5.4.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_definition_and_catalog(MethodAssetDefinition definition, MethodAssetCatalogEntry catalog_entry) | 从定义和目录项派生目录视图。 |
| unavailable_for_scope(CatalogScopeRef catalog_scope_ref, CatalogViewUnavailableReason reason_ref) | 表达特定 scope 下读取材料暂不可用。 |

##### 5.4.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为第二 truth | catalog view 只能由 definition / catalog truth 派生。 |
| 不保存搜索引擎状态 | 排序、分词、索引刷新批次和搜索评分属于实现或查询层。 |
| 不保存 UI 会话 | 展示摘要可被 UI 消费,但不保存前端状态或交互结果。 |
| 不保存外部正文 | 外部来源和 artifact 正文仍只能通过 summary/ref 间接出现。 |

停审记录:

- 候选是否处理完: pass。`MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`MethodAssetCatalogView` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`MethodAssetIdentityRule` 已并入 `MethodAssetDefinition`;`CatalogApplicabilityRule` 与 `CatalogScopeRef` 已归入 catalog entry / view;`MethodAssetDefinitionHistory` 后移到 audit / trace 对象。
- 对象是否有功能来源: pass。四个对象均回指 Step 5、`FR-ML-001/002`、`BR-ML-001/002/003` 和 01 架构核心子域。
- 接缝是否清楚: pass。definition truth、catalog truth、typed ref 和 projection / read model 已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema 或完整状态迁移。
- 下一步只允许进入“正式化与版本:先思考”,不得跳到受控消费或批量写完整 Step 6。

### 5.5 正式化与版本:先思考

问题回答:

- 本组成部分需要正式展开四个对象:`FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState`、`FormalizationEligibilityRule`。
- `FormalMethodAssetVersion` 承载已正式化方法资产的版本边界和稳定引用语义。它来自 Step 5 的正式版本建立、版本语义变化识别,并回指 `FR-ML-004`、`BR-ML-004` 与数据归属中的方法资产正式化与版本语义。
- `FormalizationBasisSummary` 承接治理、标准、ADR、artifact 等外部依据的安全摘要 / 引用。它是正式化判断的依据材料,但不拥有外部正文、治理裁决执行或 artifact 生命周期。
- `FormalizationState` 需要作为 state enum / state object 线索独立点名。它表达方法资产定义是否处于可正式消费、待正式化、被拒绝或已退出正式语境等判断来源;完整状态迁移留 Step 9。
- `FormalizationEligibilityRule` 需要独立成 policy / invariant 对象,因为它横跨 definition ref、catalog context、basis summary 和正式 / 非正式隔离,不适合埋入单个版本字段。

诊断:

- 正式化与定义存在必须分开。`MethodAssetDefinition` 只说明本仓拥有某个方法资产定义 truth,不等于该定义可作为正式消费依据;否则会违反 `BR-ML-007`。
- 正式版本边界必须在本组成部分表达。受控消费只能消费已成立的正式版本,不能反向决定版本语义;读取、引用、同步或运行时使用也不得隐式触发正式化。
- `FormalizationBasisSummary` 与后续 `ExternalSourceSummary` 有相邻关系,但不能合并。前者是正式化判断需要的依据摘要,后者是更通用的外部来源摘要与正文禁止边界;本组成部分只持有正式化所需的 safe basis。
- `VersionStabilityRule` 不需要独立成对象。它约束正式版本语义不得静默覆盖,应并入 `FormalMethodAssetVersion` 的不变量和禁止事项。
- `FormalMethodAssetVersionView` 不独立成 truth。它只能作为正式版本读取材料说明,归入 `FormalMethodAssetVersion` 的 projection / read material 口径。
- `GovernanceBasisRef` 目前作为 `FormalizationBasisSummary` 的字段类型承接;它只引用治理依据,不引入治理执行或裁决正文。
- `FormalizationHistory` 不在本组成部分独立展开。正式化历史应由后续 `MethodAssetAuditTrail` / trace material 统一承接,避免形成第二条版本历史 truth。

取舍:

- 保留 `FormalMethodAssetVersion` 作为正式版本 truth 主体,保留 `FormalizationState` 作为状态词表来源,保留 `FormalizationBasisSummary` 作为依据摘要边界,保留 `FormalizationEligibilityRule` 作为跨对象 eligibility guard。
- 不把正式化依据写成 governance 或 artifact 私有对象。本仓只保存 summary/ref,不保存审批流、policy enforce result、标准全文、archive 包或 artifact 正文。
- 不提前定义版本号格式、hash、fingerprint、schema version、迁移算法或完整状态矩阵;这些属于后续 Step 8 / Step 9 / 03 详细设计。
- 不把版本变化的消费影响解释放入本组成部分。影响识别、trace 和一致性保护由后续 `追溯与一致性保护` 承接。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、接口、流程、存储、事件、协议 schema 或版本算法。
- 本模块未使用旧 Step 6、旧 DDD 草案、旧 fingerprint / snapshot / outbox 或历史 `MethodContent` 模型作为对象来源。
- 下一模块只允许进入“正式化与版本:再写入”,为上述四个对象写概要级对象小节和停审记录。

### 5.6 正式化与版本:再写入

#### 5.6.1 FormalMethodAssetVersion

##### 5.6.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | aggregate / truth object |
| 主要责任 | 承载已正式化方法资产的版本边界、稳定引用语义和版本语义变化线索。 |
| 来源 | Step 5 `FormalMethodAssetVersion`;`FR-ML-004`;`BR-ML-004`;`BR-ML-010`;数据归属中的方法资产正式化与版本语义。 |

##### 5.6.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| formal_version_ref | FormalMethodAssetVersionRef | 正式版本稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 指向被正式化的方法资产定义。 |
| catalog_entry_ref | MethodAssetCatalogEntryRef | 记录正式版本成立时的目录语境。 |
| formalization_state | FormalizationState | 表达该版本当前正式化状态。 |
| basis_summary_ref | FormalizationBasisSummaryRef | 指向正式化依据摘要。 |
| version_semantics_marker | VersionSemanticsMarker | 表达版本语义边界,不等于 hash 或旧 fingerprint。 |

##### 5.6.1.3 状态集合

| 状态 | 作用 |
|---|---|
| FormalVersionCandidate | 已有定义和依据,但尚未成为正式消费依据。 |
| FormalVersionActive | 当前可作为正式消费依据的版本边界。 |
| FormalVersionSuperseded | 已被显式版本语义变化替代,历史引用仍需可追溯。 |
| FormalVersionRetired | 正式版本退出当前使用语境,不得作为新消费依据。 |

##### 5.6.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_definition_matches(MethodAssetDefinitionRef definition_ref) | 校验版本归属的定义锚点未漂移。 |
| assert_basis_available(FormalizationBasisSummary basis_summary) | 校验正式化依据摘要可用于该版本判断。 |
| assert_version_semantics_stable(VersionSemanticsMarker version_semantics_marker) | 防止既有正式版本语义被静默覆盖。 |
| mark_superseded(VersionChangeReasonRef reason_ref) | 记录显式版本语义变化线索。 |

##### 5.6.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| candidate_from_definition(MethodAssetDefinitionRef definition_ref, FormalizationBasisSummaryRef basis_summary_ref) | 基于定义锚点和依据摘要形成正式版本候选。 |
| activate(FormalMethodAssetVersionRef formal_version_ref, FormalizationState formalization_state) | 将满足资格的候选标记为正式版本。 |
| supersede(FormalMethodAssetVersionRef previous_version_ref, VersionChangeReasonRef reason_ref) | 显式表达版本语义变化替代关系。 |

##### 5.6.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不修改定义 truth | 正式版本引用 definition,但不保存或改写定义正文。 |
| 不用读取行为触发正式化 | query、同步、引用或运行使用不得隐式创建正式版本。 |
| 不保存外部正文 | 治理、标准、ADR、artifact 或 archive 正文只能通过 basis summary/ref 间接出现。 |
| 不定义版本算法 | 版本号格式、hash、fingerprint、schema version 和迁移算法留后续详细设计。 |

#### 5.6.2 FormalizationBasisSummary

##### 5.6.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | summary / boundary object |
| 主要责任 | 承接正式化所需外部依据的安全摘要和 typed ref,不拥有外部正文或裁决执行。 |
| 来源 | Step 5 `FormalizationBasisSummary`;正式依据承接 capability;`BR-ML-019`;`BR-ML-020`;外部摘要与引用架构约束。 |

##### 5.6.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| basis_summary_ref | FormalizationBasisSummaryRef | 正式化依据摘要引用。 |
| definition_ref | MethodAssetDefinitionRef | 依据摘要服务的定义锚点。 |
| basis_kind | FormalizationBasisKind | 表达依据类别,如治理摘要、标准摘要、ADR 摘要或 artifact 引用。 |
| source_refs | ExternalSourceRefSet | 外部来源 typed refs,不得保存外部正文。 |
| governance_basis_ref | GovernanceBasisRef | 可选治理依据引用,不承接治理执行。 |
| evidence_marker | FormalizationEvidenceMarker | 依据材料安全线索,不等于证据文件正文。 |

##### 5.6.2.3 状态集合

| 状态 | 作用 |
|---|---|
| BasisAccepted | 依据摘要可用于正式化判断。 |
| BasisInsufficient | 依据不足,不得进入正式版本激活。 |
| BasisStale | 外部来源或治理依据可能过期,需要重新判断。 |
| BasisRejected | 依据不满足正式化资格或不符合正文边界。 |

##### 5.6.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_body_free() | 校验摘要不携带外部正文、裁决正文或 artifact 正文。 |
| assert_for_definition(MethodAssetDefinitionRef definition_ref) | 校验依据摘要服务同一个定义锚点。 |
| mark_stale(ExternalSourceRef source_ref) | 标记外部依据来源可能过期。 |
| supports_formalization(FormalizationEligibilityRule eligibility_rule) | 作为资格判断输入,不直接激活正式版本。 |

##### 5.6.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_external_summary(MethodAssetDefinitionRef definition_ref, ExternalSourceRefSet source_refs) | 从外部摘要 / 引用建立正式化依据摘要。 |
| from_governance_basis(MethodAssetDefinitionRef definition_ref, GovernanceBasisRef governance_basis_ref) | 从治理依据引用建立正式化依据摘要。 |

##### 5.6.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存治理执行 | policy enforce、审批流、裁决过程和执行日志不属于本对象。 |
| 不保存标准全文 | 标准、ADR、方法论文档和外部说明只能以 summary/ref 出现。 |
| 不保存 artifact 正文 | artifact、archive、证据文件和示例正文不得进入本对象。 |
| 不直接创建正式版本 | basis summary 是判断输入,不是正式化动作本身。 |

#### 5.6.3 FormalizationState

##### 5.6.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | state enum / state object |
| 主要责任 | 表达方法资产从非正式定义到正式版本语境的判断结果和状态线索。 |
| 来源 | Step 5 `FormalizationState`;`FR-ML-003`;`BR-ML-007`;`BR-ML-009`;Step 9 状态机输入。 |

##### 5.6.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| state_kind | FormalizationStateKind | 正式化状态类别。 |
| definition_ref | MethodAssetDefinitionRef | 状态所属的定义锚点。 |
| formal_version_ref | OptionFormalMethodAssetVersionRef | 已形成正式版本时的版本引用。 |
| basis_summary_ref | OptionFormalizationBasisSummaryRef | 状态判断所依据的摘要。 |
| reason_ref | FormalizationReasonRef | 状态变化安全原因引用。 |
| decided_at | MethodAssetTimestamp | 状态判断时间线索,不等于 version/hash。 |

##### 5.6.3.3 状态集合

| 状态 | 作用 |
|---|---|
| DraftDefinition | 定义已存在但尚未进入正式化判断。 |
| PendingFormalization | 已进入正式化判断,尚未成为正式消费依据。 |
| Formalized | 已正式化,可被正式版本引用。 |
| Rejected | 未满足正式化资格,不得作为正式消费依据。 |
| Superseded | 已被显式版本变化替代。 |
| Retired | 已退出正式使用语境。 |

##### 5.6.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_can_be_consumed() | 判断当前状态是否允许进入正式消费链路。 |
| assert_can_transition_to(FormalizationStateKind next_state_kind) | 为 Step 9 状态迁移保留合法性入口。 |
| bind_formal_version(FormalMethodAssetVersionRef formal_version_ref) | 将正式化状态绑定到正式版本引用。 |
| reject(FormalizationReasonRef reason_ref) | 标记正式化判断失败。 |

##### 5.6.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| draft_for_definition(MethodAssetDefinitionRef definition_ref) | 为已有定义建立初始正式化状态。 |
| pending(MethodAssetDefinitionRef definition_ref, FormalizationBasisSummaryRef basis_summary_ref) | 进入正式化判断。 |
| formalized(FormalMethodAssetVersionRef formal_version_ref, FormalizationBasisSummaryRef basis_summary_ref) | 形成可消费正式状态。 |

##### 5.6.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不在 Step 6 写迁移矩阵 | 这里只固定状态词表来源,完整迁移留 Step 9。 |
| 不把引用当正式化 | 被读取、同步、分发或运行使用不等于 `Formalized`。 |
| 不绕过 eligibility | `Formalized` 必须由资格判断和 basis summary 支撑。 |
| 不携带正文 | reason、basis 和 evidence 均为 body-free marker/ref。 |

#### 5.6.4 FormalizationEligibilityRule

##### 5.6.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | policy / guard |
| 主要责任 | 判断方法资产定义是否具备进入正式使用语境的最小资格。 |
| 来源 | Step 5 `FormalizationEligibilityRule`;正式化判断 capability;`BR-ML-007`;`BR-ML-009`;`BR-ML-019`。 |

##### 5.6.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | FormalizationEligibilityRuleRef | 资格规则引用。 |
| required_definition_state | MethodAssetDefinitionStateRequirement | 对定义状态的要求。 |
| required_catalog_context | CatalogContextRequirement | 对目录语境和适用范围的要求。 |
| required_basis_kind | FormalizationBasisRequirement | 对正式化依据摘要的要求。 |
| forbidden_source_kinds | ForbiddenFormalizationSourceKindSet | 禁止作为正式化依据的外部来源类别。 |

##### 5.6.4.3 状态集合

| 状态 | 作用 |
|---|---|
| RuleActive | 当前规则可用于正式化资格判断。 |
| RuleSuperseded | 规则被新规则替代,历史判断仍需可解释。 |
| RuleDisabled | 规则不可用于新正式化判断。 |

##### 5.6.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate_definition(MethodAssetDefinition definition) | 判断定义锚点是否满足正式化前提。 |
| evaluate_catalog(MethodAssetCatalogEntry catalog_entry) | 判断目录语境是否满足正式化前提。 |
| evaluate_basis(FormalizationBasisSummary basis_summary) | 判断依据摘要是否满足正式化前提。 |
| reject_for_boundary(FormalizationBoundaryViolationRef violation_ref) | 因正文、外部职责或下游运行 truth 越界而拒绝。 |

##### 5.6.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| default_core_rule(FormalizationEligibilityRuleRef rule_ref) | 建立核心闭环最小正式化资格规则。 |
| from_policy_basis(FormalizationEligibilityRuleRef rule_ref, FormalizationBasisRequirement basis_requirement) | 基于正式依据要求建立规则变体。 |

##### 5.6.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不执行治理裁决 | rule 只判断本仓正式化资格,不运行治理系统。 |
| 不保存配置矩阵 | 具体可配置规则、profile 和开关留后续配置设计。 |
| 不读取下游运行状态 | 下游消费结果、流程执行和 UI 状态不得成为资格来源。 |
| 不替代版本对象 | 资格通过只是输入,正式版本边界仍由 `FormalMethodAssetVersion` 表达。 |

停审记录:

- 候选是否处理完: pass。`FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState`、`FormalizationEligibilityRule` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`VersionStabilityRule` 已并入 `FormalMethodAssetVersion`;`FormalMethodAssetVersionView` 已归入正式版本读取材料;`GovernanceBasisRef` 已归入 `FormalizationBasisSummary`;`FormalizationHistory` 后移到 audit / trace 对象。
- 对象是否有功能来源: pass。四个对象均回指 Step 5、`FR-ML-003/004`、`BR-ML-004/007/009/010/019/020` 和 01 架构核心子域。
- 接缝是否清楚: pass。definition/catalog 输入、basis summary、formal version、state 和 eligibility guard 已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、版本算法或完整状态迁移矩阵。
- 下一步只允许进入“受控消费:先思考”,不得跳到受控消费对象小节或后续组成部分。

### 5.7 受控消费:先思考

问题回答:

- 本组成部分需要正式展开四个对象:`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard`。
- `MethodAssetConsumptionMaterial` 承载下游可读取和引用的正式消费材料。它来自 Step 5 的消费材料组织、正式消费资格判断和下游边界提示,但它不是下游私有定义副本,也不是旧 snapshot / cache / 同步包。
- `MethodAssetAvailabilityView` 承载正式方法资产在某个消费语境下的可用性读取线索。它可以点名 `MethodAssetAvailabilityState` 的状态词表来源,但不能成为正式版本 truth 或定义 truth。
- `DownstreamConsumptionBoundary` 需要作为 boundary object 独立展开。它表达下游消费时允许使用的边界、禁止反写的边界和消费语境来源,并承接 `ConsumptionContextRef` 作为 typed ref 家族成员。
- `DefinitionUseBoundaryGuard` 需要作为 policy / guard 独立展开。它跨消费材料、正式版本和下游边界执行 Definition vs Use 防护,不能被简化成 API 鉴权、权限矩阵或下游约定。

诊断:

- 受控消费必须独立于正式化与版本。正式版本回答“某个方法资产语义是否正式成立”,受控消费回答“下游在什么边界下可以使用正式语义材料”;二者合并会让读取、引用或同步行为隐式触发正式化。
- 消费材料不能成为下游私有定义副本。`MethodAssetConsumptionMaterial` 应只承载必要的正式语义摘要、版本锚点、消费语境和边界提示,不得保存 process、identity、runtime、member-images 的运行 truth。
- 可用性读取不能成为第二 truth。`MethodAssetAvailabilityView` 只从定义、正式版本、消费边界和维护收敛线索派生;当它 stale / unavailable 时,不应改变来源 truth。
- `ConsumptionBoundaryPolicy` 不需要另建平行对象。它与 `DownstreamConsumptionBoundary` 和 `DefinitionUseBoundaryGuard` 同源,可并入二者的不变量、成员函数和禁止事项。
- `MethodAssetConsumptionReadMaterial` 不需要与 consumption material 分裂成两个正式对象。它只是消费材料的读取形态,应并入 `MethodAssetConsumptionMaterial`。
- `ConsumptionTraceMaterial` 不应在本组成部分独立展开。正式消费回溯和影响解释由后续 `MethodAssetTraceMaterial` 统一承接,避免受控消费对象同时拥有 trace / audit truth。

取舍:

- 保留 `MethodAssetConsumptionMaterial` 作为 read material / boundary 对象,用于表达正式语义材料的只读消费承载。
- 保留 `MethodAssetAvailabilityView` 作为 projection / read model 对象,用于表达可用性读取和状态词表线索,完整状态迁移留 Step 9。
- 保留 `DownstreamConsumptionBoundary` 作为 boundary object,用于固定消费语境、下游边界和禁止反写口径。
- 保留 `DefinitionUseBoundaryGuard` 作为 policy / guard 对象,用于防止定义 truth、正式版本和下游使用语境混淆。
- 将 `ConsumptionContextRef` 作为 typed ref 字段类型承接,不单独成节;将消费影响和消费 trace 后移到追溯与一致性保护。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、接口、流程、存储、事件、协议 schema、权限矩阵或鉴权实现。
- 本模块未把 process、identity、runtime、member-images 的运行 truth 迁入本仓,也未让下游消费结果反向决定正式化或定义 truth。
- 本模块未使用旧 fingerprint、snapshot、outbox、PostgreSQL、object storage 或历史 P0 类型作为当前消费材料依据。
- 下一模块只允许进入“受控消费:再写入”,为上述四个对象写概要级对象小节和停审记录。

### 5.8 受控消费:再写入

#### 5.8.1 MethodAssetConsumptionMaterial

##### 5.8.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | read material / boundary object |
| 主要责任 | 承载下游可按边界读取和引用的正式方法资产消费材料。 |
| 来源 | Step 5 `MethodAssetConsumptionMaterial`;`FR-ML-005`;`FR-ML-006`;`BR-ML-005`;`BR-ML-008`;受控消费语义核心子域。 |

##### 5.8.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| consumption_material_ref | MethodAssetConsumptionMaterialRef | 消费材料稳定引用。 |
| formal_version_ref | FormalMethodAssetVersionRef | 指向可被消费的正式版本边界。 |
| definition_ref | MethodAssetDefinitionRef | 回指方法资产定义锚点,防止材料成为私有定义副本。 |
| consumption_context_ref | ConsumptionContextRef | 标识消费语境,区分 process、identity、runtime、member-images 等下游场景。 |
| boundary_ref | DownstreamConsumptionBoundaryRef | 指向本次材料适用的下游消费边界。 |
| consumption_summary | MethodAssetConsumptionSummary | 面向下游的只读正式语义摘要,不得保存外部正文或下游运行 truth。 |
| trace_subject_ref | TraceSubjectRef | 为后续追溯材料建立主体线索。 |

##### 5.8.1.3 状态集合

| 状态 | 作用 |
|---|---|
| ConsumptionMaterialPrepared | 消费材料已由正式版本和边界生成,可供受控读取。 |
| ConsumptionMaterialStale | 来源正式版本、定义或边界发生变化,材料等待刷新。 |
| ConsumptionMaterialBlocked | 当前消费语境不满足边界要求,不得作为正式消费材料。 |
| ConsumptionMaterialUnavailable | 派生材料暂不可用,但不改变来源 definition / formal version truth。 |

##### 5.8.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_from_formal_version(FormalMethodAssetVersion formal_version) | 校验消费材料来自正式版本。 |
| assert_context(ConsumptionContextRef consumption_context_ref) | 校验材料适用的消费语境。 |
| assert_boundary(DownstreamConsumptionBoundary boundary) | 校验材料没有越过 Definition vs Use 边界。 |
| mark_stale(ConsumptionMaterialStalenessReason reason_ref) | 标记材料等待刷新,不改变来源 truth。 |

##### 5.8.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_formal_version(FormalMethodAssetVersion formal_version, ConsumptionContextRef consumption_context_ref) | 从正式版本和消费语境生成只读消费材料。 |
| blocked_by_boundary(FormalMethodAssetVersionRef formal_version_ref, DownstreamConsumptionBoundary boundary) | 表达正式版本存在但当前消费边界不允许生成材料。 |

##### 5.8.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为下游私有定义副本 | 下游只能读取、引用或消费材料,不得拥有或改写 definition truth。 |
| 不保存下游运行 truth | 流程执行、成员状态、运行时绑定、镜像构建和 UI 状态不得进入本对象。 |
| 不触发正式化 | 生成或读取消费材料不得隐式创建正式版本。 |
| 不保存外部正文 | 标准、治理、artifact、archive 和证据正文不得进入消费材料。 |

#### 5.8.2 MethodAssetAvailabilityView

##### 5.8.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | projection / read model |
| 主要责任 | 表达正式方法资产在特定消费语境下的可用性读取线索。 |
| 来源 | Step 5 `MethodAssetAvailabilityView`;`MethodAssetAvailabilityState`;`FR-ML-005`;`NFR-ML-001`;01 架构中的正式真相到下游消费材料最终一致口径。 |

##### 5.8.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| availability_view_ref | MethodAssetAvailabilityViewRef | 可用性视图引用。 |
| formal_version_ref | FormalMethodAssetVersionRef | 视图对应的正式版本。 |
| consumption_context_ref | ConsumptionContextRef | 视图适用的消费语境。 |
| availability_state | MethodAssetAvailabilityState | 表达可消费、不可消费、待收敛或不可用等读取状态线索。 |
| source_material_ref | OptionMethodAssetConsumptionMaterialRef | 已生成消费材料时的来源引用。 |
| projection_source_cursor | MethodAssetAvailabilityProjectionCursor | 记录派生来源位置,防止 view 被误当 truth。 |

##### 5.8.2.3 状态集合

| 状态 | 作用 |
|---|---|
| AvailableForConsumption | 指定消费语境下可读取正式消费材料。 |
| PendingConvergence | 来源 truth 已成立,但消费材料或读取视图仍在收敛。 |
| NotAvailableForContext | 当前消费语境不满足边界要求。 |
| AvailabilityStale | 视图落后于来源 truth 或边界变化。 |
| AvailabilityUnavailable | 视图暂不可用,但不影响来源 truth 成立。 |

##### 5.8.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| refresh_from_material(MethodAssetConsumptionMaterial consumption_material) | 从消费材料刷新可用性读取线索。 |
| mark_pending_convergence(ConsumptionContextRef consumption_context_ref) | 标记下游暂未感知或材料仍需收敛。 |
| mark_not_available(DownstreamConsumptionBoundary boundary) | 表达指定边界下不可消费。 |
| assert_derived_from(FormalMethodAssetVersionRef formal_version_ref) | 校验视图来源正式版本未漂移。 |

##### 5.8.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_consumption_material(MethodAssetConsumptionMaterial consumption_material) | 从已生成消费材料派生可用性视图。 |
| unavailable_for_context(FormalMethodAssetVersionRef formal_version_ref, ConsumptionContextRef consumption_context_ref) | 表达特定消费语境下读取视图不可用。 |

##### 5.8.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为正式版本 truth | availability view 只读取正式版本和消费材料的派生状态。 |
| 不让缓存命中等于正式消费 | 查询命中、同步成功或缓存存在不等于正式化成立。 |
| 不保存下游状态正文 | 下游是否执行、安装、绑定、渲染或运行不得写入本视图。 |
| 不定义刷新机制 | 刷新任务、调度和重试细节留给后台维护与后续 Step。 |

#### 5.8.3 DownstreamConsumptionBoundary

##### 5.8.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | boundary object |
| 主要责任 | 固定下游消费语境、允许使用方式和禁止反写边界。 |
| 来源 | Step 5 `DownstreamConsumptionBoundary`;`ConsumptionContextRef`;`ConsumptionBoundaryPolicy`;`BR-ML-005`;`BR-ML-008`;相邻仓边界约束。 |

##### 5.8.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| boundary_ref | DownstreamConsumptionBoundaryRef | 下游消费边界引用。 |
| consumption_context_ref | ConsumptionContextRef | 边界适用的消费语境。 |
| allowed_use_kind_set | MethodAssetAllowedUseKindSet | 表达读取、引用、组装或分发等允许使用类别。 |
| forbidden_write_kind_set | DownstreamForbiddenWriteKindSet | 表达禁止反写定义、正式版本或消费材料的类别。 |
| formal_version_requirement | FormalVersionRequirement | 要求消费必须基于正式版本。 |
| boundary_reason_ref | ConsumptionBoundaryReasonRef | 边界成立的安全原因引用。 |

##### 5.8.3.3 状态集合

| 状态 | 作用 |
|---|---|
| BoundaryActive | 边界可用于消费资格判断。 |
| BoundaryScopeLimited | 边界只适用于指定消费语境或下游类别。 |
| BoundarySuspended | 边界暂不可用于新消费材料生成。 |
| BoundaryRetired | 边界退出当前语境,历史消费仍需可追溯。 |

##### 5.8.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_context_allowed(ConsumptionContextRef consumption_context_ref) | 判断消费语境是否在边界内。 |
| assert_use_allowed(MethodAssetUseKind use_kind) | 判断下游使用方式是否被允许。 |
| reject_downstream_write(DownstreamWriteAttemptRef write_attempt_ref) | 明确拒绝下游反写定义或正式版本。 |
| assert_formal_version_required(FormalMethodAssetVersionRef formal_version_ref) | 校验消费必须锚定正式版本。 |

##### 5.8.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| for_consumption_context(ConsumptionContextRef consumption_context_ref, FormalVersionRequirement formal_version_requirement) | 为指定消费语境建立边界。 |
| scope_limited(ConsumptionContextRef consumption_context_ref, ConsumptionBoundaryReasonRef reason_ref) | 建立受限消费边界。 |

##### 5.8.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不表达鉴权实现 | 具体权限矩阵、token、role 或 policy engine 属于后续接口 / 配置 / 实现。 |
| 不拥有下游 truth | boundary 只约束使用边界,不保存下游运行事实。 |
| 不替代正式化判断 | boundary 不能把非正式定义变成可消费正式材料。 |
| 不保存 marketplace 交易 | 定价、订单、安装和履约属于 `L6-marketplace`。 |

#### 5.8.4 DefinitionUseBoundaryGuard

##### 5.8.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | policy / guard |
| 主要责任 | 防止定义 truth、正式版本和下游使用语境混淆。 |
| 来源 | Step 5 `DefinitionUseBoundaryGuard`;`ConsumptionBoundaryPolicy`;`BR-ML-003`;`BR-ML-005`;`BR-ML-008`;`BR-ML-021`。 |

##### 5.8.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | DefinitionUseBoundaryGuardRef | guard 引用。 |
| protected_definition_ref | MethodAssetDefinitionRef | 被保护的定义锚点。 |
| protected_formal_version_ref | FormalMethodAssetVersionRef | 被保护的正式版本边界。 |
| boundary_ref | DownstreamConsumptionBoundaryRef | guard 适用的下游消费边界。 |
| violation_kind_set | DefinitionUseViolationKindSet | 可识别的越界类别集合。 |
| guard_reason_ref | DefinitionUseGuardReasonRef | guard 成立或拒绝的安全原因引用。 |

##### 5.8.4.3 状态集合

| 状态 | 作用 |
|---|---|
| GuardActive | guard 可用于消费材料和下游边界判断。 |
| GuardViolated | 已识别 Definition vs Use 越界,需要阻断或交给追溯 / 一致性保护。 |
| GuardBypassedProhibited | 表达绕过 guard 的路径不可被接受。 |
| GuardRetired | guard 规则退出当前语境,历史判断仍需可解释。 |

##### 5.8.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_consumption_material(MethodAssetConsumptionMaterial consumption_material) | 校验消费材料没有复制或改写定义 truth。 |
| assert_boundary(DownstreamConsumptionBoundary boundary) | 校验下游边界满足 Definition vs Use 防护。 |
| reject_private_definition(DownstreamDefinitionCandidateRef candidate_ref) | 拒绝下游私有定义候选进入本仓语义链。 |
| record_violation(DefinitionUseViolationRef violation_ref) | 记录越界线索,供追溯和一致性保护使用。 |

##### 5.8.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| protect_formal_consumption(MethodAssetDefinitionRef definition_ref, FormalMethodAssetVersionRef formal_version_ref) | 为正式版本消费建立 Definition vs Use guard。 |
| violated(DefinitionUseViolationRef violation_ref, DownstreamConsumptionBoundaryRef boundary_ref) | 从已识别越界线索建立 guard violation 状态。 |

##### 5.8.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代一致性保护策略 | guard 负责阻断越界,变化影响和恢复由后续一致性保护对象承接。 |
| 不执行下游动作 | 不创建流程、成员、运行时绑定、镜像或 marketplace 履约。 |
| 不保存原始违规正文 | 只保存 violation ref / reason ref,不得保存下游请求正文或外部正文。 |
| 不写成权限矩阵 | 访问控制细节留给后续接口和配置设计。 |

停审记录:

- 候选是否处理完: pass。`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`MethodAssetConsumptionReadMaterial` 已并入 `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityState` 已并入 `MethodAssetAvailabilityView`;`ConsumptionBoundaryPolicy` 已并入 boundary / guard;`ConsumptionContextRef` 已作为 typed ref 字段类型承接;`ConsumptionTraceMaterial` 后移到 trace material。
- 对象是否有功能来源: pass。四个对象均回指 Step 5、`FR-ML-005/006`、`BR-ML-003/005/008/021` 和 01 架构受控消费语义核心子域。
- 接缝是否清楚: pass。正式版本输入、消费语境、下游边界、Definition vs Use guard、追溯主体和维护刷新边界已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、鉴权矩阵、下游运行 truth 或完整状态迁移矩阵。
- 下一步只允许进入“追溯与一致性保护:先思考”,不得跳到该组成部分对象小节或后续组成部分。

### 5.9 追溯与一致性保护:先思考

问题回答:

- 本组成部分需要保留四个主对象:`MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`。
- `MethodAssetTraceMaterial` 承接定义变化、正式化依据、版本变化、引用语境和正式消费语境的 body-free 追溯材料。它解释“变化从哪里来、与哪些正式语义相关”,但不替代定义 truth、正式版本 truth 或消费材料 truth。
- `ConsumptionImpactSummary` 承接下游正式消费影响摘要。它只表达影响类别、来源线索和待承接口径,不得保存 process、identity、runtime、member-images、marketplace 或 UI 的运行状态正文。
- `ConsistencyProtectionPolicy` 需要独立成 policy / guard 对象,因为它横跨正式版本变化、消费影响识别、既有正式消费保护和后续恢复判断,不能埋入 trace material 或 impact summary 字段。
- `MethodAssetAuditTrail` 需要独立展开为 audit record / history material。它组织定义、正式化、版本、消费、关系、外部依据和外围组织变化的审计线索,但不能退化为 raw log、telemetry 或证据正文归档。
- `TraceSubjectRef` 应保持独立 reference / boundary 口径。它是 trace / audit / lineage 的稳定主体锚点,不能从字符串、旧对象名、下游 id 或 artifact path 推导。

诊断:

- 追溯、影响、一致性保护和审计需要分开。trace 解释来源和语境,impact 摘要下游影响,policy 保护正式消费不被静默破坏,audit trail 组织历史线索;四者合并会让后续 Step 8 / Step 9 无法判断哪个对象负责变化解释、影响分类、状态保护或审计展示。
- `ConsumptionImpactSourceRef` 不需要独立成对象。它更适合作为 `ConsumptionImpactSummary` 的 typed ref 字段家族成员,用于标识影响来源,但不拥有独立生命周期。
- `ImpactClassificationRule` 不需要另建平行对象。它应并入 `ConsumptionImpactSummary` 的分类口径和 `ConsistencyProtectionPolicy` 的保护判断中;完整分类流程和状态迁移留 Step 8 / Step 9。
- `MethodAssetTraceView` 不独立成 truth。它只是 trace material 的读取形态,应并入 `MethodAssetTraceMaterial` 并标注非 truth。
- `ConsumptionImpactView` 不独立成 truth。它只是 impact summary 的读取形态,应并入 `ConsumptionImpactSummary` 并标注非 truth。
- `MethodAssetEvidenceLineage` 不宜独立成业务 truth。它应作为 `MethodAssetTraceMaterial` 和 `MethodAssetAuditTrail` 的 lineage 线索出现,且只能保存 evidence marker / ref / summary,不得保存证据正文。
- `MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial` 和 `RelationChangeHistory` 不应各自形成第二条历史 truth。它们应由 trace material / audit trail 统一组织为不同来源的 body-free history line。

取舍:

- 保留 `MethodAssetTraceMaterial` 作为追溯材料主对象,承接 definition、formalization、version、consumption、relation、external basis 和 package / set 变化线索。
- 保留 `ConsumptionImpactSummary` 作为影响摘要主对象,承接正式消费影响、未知影响、待承接影响和影响来源 ref,但不读取或持有下游运行 truth。
- 保留 `ConsistencyProtectionPolicy` 作为跨对象保护策略,用于表达哪些变化必须显式识别、哪些既有正式消费不能被静默破坏、哪些情况必须进入待承接或恢复语义。
- 保留 `MethodAssetAuditTrail` 作为审计线索组织对象,用于把定义、正式化、消费、关系、外部依据和外围组织的变化线索串成可审计材料。
- 将 `TraceSubjectRef` 独立展开为 reference object;将 `ConsumptionImpactSourceRef` 作为 `ConsumptionImpactSummary` 的字段类型承接。
- 将 history / lineage 候选统一收敛到 trace material 和 audit trail,不在本组成部分拆出多个平行历史对象。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、接口、流程、存储、事件、协议 schema、审计 schema、证据 schema、恢复算法或状态迁移矩阵。
- 本模块未保存 raw log、telemetry、外部正文、artifact 正文、archive 包、证据文件正文或下游运行 truth。
- 本模块未把 trace / audit / impact 写成第二 definition truth、第二 formal version truth 或下游 runtime truth。
- 下一模块只允许进入“追溯与一致性保护:再写入”,为上述对象写概要级对象小节和停审记录;不得跳到“关系与分发语义”。

### 5.10 追溯与一致性保护:再写入

#### 5.10.1 MethodAssetTraceMaterial

##### 5.10.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | trace material / history material |
| 主要责任 | 承载方法资产定义、正式化、版本变化、引用语境和正式消费语境的 body-free 追溯材料。 |
| 来源 | Step 5 `MethodAssetTraceMaterial`;`ConsumptionTraceMaterial`;`MethodAssetEvidenceLineage`;`BR-ML-010`;`BR-ML-018`;01 架构追溯与一致性保护语义核心子域。 |

##### 5.10.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| trace_material_ref | MethodAssetTraceMaterialRef | 追溯材料稳定引用。 |
| trace_subject_ref | TraceSubjectRef | 追溯主体,可指向定义、正式版本、消费材料、关系或外围组织变化。 |
| definition_ref | OptionMethodAssetDefinitionRef | 追溯材料关联的定义锚点。 |
| formal_version_ref | OptionFormalMethodAssetVersionRef | 追溯材料关联的正式版本边界。 |
| consumption_context_ref | OptionConsumptionContextRef | 追溯材料关联的正式消费语境。 |
| basis_refs | FormalizationBasisSummaryRefSet | 正式化依据摘要引用集合,不保存依据正文。 |
| evidence_lineage_refs | MethodAssetEvidenceLineageRefSet | 证据线索引用集合,只保存 marker / ref / summary。 |

##### 5.10.1.3 状态集合

| 状态 | 作用 |
|---|---|
| TraceMaterialPrepared | 追溯材料已由正式来源整理完成。 |
| TraceMaterialStale | 来源定义、版本、关系或外部依据发生变化,追溯材料等待刷新。 |
| TraceMaterialIncomplete | 追溯材料缺少必要来源线索,需显式待承接。 |
| TraceMaterialUnavailable | 追溯材料暂不可用,但不改变来源 truth。 |

##### 5.10.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_subject(TraceSubjectRef trace_subject_ref) | 校验追溯材料主体未漂移。 |
| attach_basis(FormalizationBasisSummaryRef basis_summary_ref) | 连接正式化依据摘要引用。 |
| attach_consumption_context(ConsumptionContextRef consumption_context_ref) | 连接正式消费语境。 |
| mark_stale(TraceMaterialStalenessReason reason_ref) | 标记追溯材料需要刷新。 |

##### 5.10.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_formal_version(FormalMethodAssetVersion formal_version, TraceSubjectRef trace_subject_ref) | 从正式版本建立追溯材料。 |
| from_consumption_material(MethodAssetConsumptionMaterial consumption_material, TraceSubjectRef trace_subject_ref) | 从正式消费材料建立追溯材料。 |
| incomplete(TraceSubjectRef trace_subject_ref, TraceMaterialIncompleteReason reason_ref) | 表达追溯材料缺少必要线索。 |

##### 5.10.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代业务 truth | trace material 不成为定义、正式版本、关系或消费材料的第二 truth。 |
| 不保存外部正文 | 标准、治理、artifact、archive、证据和外部文档正文不得进入本对象。 |
| 不保存 raw log | telemetry、请求正文、运行日志和 worker 输出不属于追溯材料。 |
| 不定义刷新机制 | 刷新任务、调度和恢复流程留给后台维护与后续 Step。 |

#### 5.10.2 ConsumptionImpactSummary

##### 5.10.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | summary / boundary object |
| 主要责任 | 摘要表达方法资产变化对既有正式消费的可能影响,但不保存下游运行状态。 |
| 来源 | Step 5 `ConsumptionImpactSummary`;`ImpactClassificationRule`;`ConsumptionImpactSourceRef`;`FR-ML-008`;`BR-ML-010`;`BR-ML-018`。 |

##### 5.10.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| impact_summary_ref | ConsumptionImpactSummaryRef | 影响摘要稳定引用。 |
| impact_source_ref | ConsumptionImpactSourceRef | 影响来源引用,通常来自定义、版本、消费边界、关系或外部依据变化。 |
| affected_definition_ref | MethodAssetDefinitionRef | 受影响的方法资产定义锚点。 |
| affected_formal_version_refs | FormalMethodAssetVersionRefSet | 可能受影响的正式版本集合。 |
| affected_context_refs | ConsumptionContextRefSet | 可能受影响的正式消费语境集合。 |
| impact_kind | ConsumptionImpactKind | 影响类别摘要,不等于下游运行事实。 |
| impact_confidence | ConsumptionImpactConfidence | 表达已确认、可能、未知或待承接的判断强度。 |

##### 5.10.2.3 状态集合

| 状态 | 作用 |
|---|---|
| ImpactUnknown | 影响尚未明确,必须显式待承接。 |
| ImpactCandidate | 已识别可能影响既有正式消费。 |
| ImpactConfirmed | 已确认存在正式消费影响。 |
| ImpactDismissed | 经正式判断不影响既有正式消费。 |
| ImpactAccepted | 影响已被正式承接或纳入保护策略。 |

##### 5.10.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| classify(ImpactClassificationRuleRef rule_ref) | 根据分类规则形成影响类别摘要。 |
| assert_body_free() | 校验影响摘要不携带下游状态正文。 |
| mark_unknown(ConsumptionImpactUnknownReason reason_ref) | 标记影响未知且需要显式待承接。 |
| bind_protection_policy(ConsistencyProtectionPolicyRef policy_ref) | 将影响摘要连接到一致性保护策略。 |

##### 5.10.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_version_change(FormalMethodAssetVersionRef formal_version_ref, ConsumptionImpactSourceRef impact_source_ref) | 从版本语义变化建立影响摘要。 |
| from_boundary_change(DownstreamConsumptionBoundaryRef boundary_ref, ConsumptionImpactSourceRef impact_source_ref) | 从消费边界变化建立影响摘要。 |
| unknown_for_context(ConsumptionContextRef consumption_context_ref, ConsumptionImpactSourceRef impact_source_ref) | 表达指定消费语境下影响未知。 |

##### 5.10.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不扫描下游内部状态 | 本对象只接收正式摘要 / ref,不拥有下游运行数据。 |
| 不保存执行结果正文 | 流程执行、成员状态、运行时绑定、UI 交互和 marketplace 履约不得进入本对象。 |
| 不替代一致性保护策略 | 影响摘要说明影响,保护动作和阻断口径由 policy / recovery 承接。 |
| 不把未知写成无影响 | 无法判断时必须显式保留 unknown / pending 语义。 |

#### 5.10.3 ConsistencyProtectionPolicy

##### 5.10.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | policy / guard |
| 主要责任 | 约束定义、正式版本、消费材料和关系变化不得静默破坏既有正式消费。 |
| 来源 | Step 5 `ConsistencyProtectionPolicy`;`ImpactClassificationRule`;`BR-ML-008`;`BR-ML-010`;`BR-ML-018`;`NFR-ML-001`。 |

##### 5.10.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| policy_ref | ConsistencyProtectionPolicyRef | 一致性保护策略引用。 |
| protected_subject_ref | TraceSubjectRef | 被保护的追溯主体或正式消费主体。 |
| protected_context_refs | ConsumptionContextRefSet | 受保护的正式消费语境集合。 |
| impact_summary_refs | ConsumptionImpactSummaryRefSet | 本策略关注的影响摘要集合。 |
| required_action_kind | ConsistencyProtectionActionKind | 需要阻断、待承接、刷新、恢复或人工确认的动作类别。 |
| protection_reason_ref | ConsistencyProtectionReasonRef | 保护策略成立的安全原因引用。 |

##### 5.10.3.3 状态集合

| 状态 | 作用 |
|---|---|
| ProtectionActive | 当前策略可用于一致性保护判断。 |
| ProtectionPendingAcknowledgement | 变化影响需要正式承接或确认。 |
| ProtectionViolated | 已识别静默破坏或绕过保护的风险。 |
| ProtectionResolved | 影响已被承接或恢复,策略判断闭合。 |
| ProtectionRetired | 策略退出当前语境,历史判断仍需可解释。 |

##### 5.10.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate_impact(ConsumptionImpactSummary impact_summary) | 根据影响摘要判断保护动作。 |
| require_acknowledgement(ConsumptionImpactSummaryRef impact_summary_ref) | 要求影响进入正式承接或确认。 |
| reject_silent_breakage(TraceSubjectRef trace_subject_ref) | 阻断静默破坏既有正式消费的变化。 |
| mark_resolved(ConsistencyResolutionRef resolution_ref) | 标记保护判断已闭合。 |

##### 5.10.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| protect_consumption_context(TraceSubjectRef trace_subject_ref, ConsumptionContextRef consumption_context_ref) | 为指定正式消费语境建立保护策略。 |
| from_impact_summary(ConsumptionImpactSummary impact_summary) | 根据影响摘要建立保护策略。 |
| violated(TraceSubjectRef trace_subject_ref, ConsistencyProtectionReasonRef reason_ref) | 从已识别保护违规建立策略状态。 |

##### 5.10.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不执行恢复算法 | 具体恢复、重试、刷新和补偿流程留给后台维护与后续 Step。 |
| 不替代正式版本状态 | policy 不能把非正式定义变成正式可消费版本。 |
| 不保存下游正文 | 保护判断只使用摘要 / ref,不保存下游运行状态或请求正文。 |
| 不写成告警配置 | 告警阈值、通知渠道和运维开关不属于概要对象轮廓。 |

#### 5.10.4 MethodAssetAuditTrail

##### 5.10.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | audit record / history material |
| 主要责任 | 组织方法资产定义、正式化、版本、消费、关系、外部依据和外围组织变化的 body-free 审计线索。 |
| 来源 | Step 5 `MethodAssetAuditTrail`;`MethodAssetDefinitionHistory`;`FormalizationHistory`;`RelationChangeHistory`;`ExternalBasisAcceptanceHistory`;`PackageAssemblyHistory`;`BR-ML-018`;`BR-ML-020`。 |

##### 5.10.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| audit_trail_ref | MethodAssetAuditTrailRef | 审计线索稳定引用。 |
| trace_subject_ref | TraceSubjectRef | 审计线索所属主体。 |
| audit_entry_refs | MethodAssetAuditEntryRefSet | body-free 审计条目引用集合。 |
| trace_material_refs | MethodAssetTraceMaterialRefSet | 关联追溯材料集合。 |
| impact_summary_refs | ConsumptionImpactSummaryRefSet | 关联影响摘要集合。 |
| evidence_marker_refs | MethodAssetEvidenceMarkerRefSet | 证据 marker / ref 集合,不保存证据正文。 |
| audit_source_cursor | MethodAssetAuditSourceCursor | 表达审计线索来源位置,不等于日志 offset 或存储游标细节。 |

##### 5.10.4.3 状态集合

| 状态 | 作用 |
|---|---|
| AuditTrailOpen | 审计线索可继续追加 body-free 条目。 |
| AuditTrailSealed | 审计线索已封存用于历史解释。 |
| AuditTrailStale | 关联追溯材料或影响摘要变化,审计线索等待刷新。 |
| AuditTrailIncomplete | 必要审计来源缺失,需显式待承接。 |

##### 5.10.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| append_trace_material(MethodAssetTraceMaterialRef trace_material_ref) | 追加追溯材料引用。 |
| append_impact_summary(ConsumptionImpactSummaryRef impact_summary_ref) | 追加影响摘要引用。 |
| append_evidence_marker(MethodAssetEvidenceMarkerRef evidence_marker_ref) | 追加证据 marker / ref。 |
| seal(AuditTrailSealReason reason_ref) | 封存审计线索以支持历史解释。 |

##### 5.10.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| for_trace_subject(TraceSubjectRef trace_subject_ref) | 为追溯主体建立审计线索。 |
| from_trace_material(MethodAssetTraceMaterial trace_material) | 从追溯材料建立审计线索。 |
| incomplete(TraceSubjectRef trace_subject_ref, AuditTrailIncompleteReason reason_ref) | 表达审计来源缺失。 |

##### 5.10.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw audit log | 原始日志、telemetry、请求 / 响应正文和 worker 输出不得进入本对象。 |
| 不替代 trace material | audit trail 组织线索,不负责解释全部追溯语义。 |
| 不保存证据正文 | 证据、artifact、archive 和外部文档正文只能以 marker / ref / summary 出现。 |
| 不成为存储审计表设计 | 表结构、索引、保留周期和归档策略留给详细设计或运维设计。 |

#### 5.10.5 TraceSubjectRef

##### 5.10.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | reference object / boundary object |
| 主要责任 | 为 trace、audit、lineage 和 impact 关联提供稳定主体引用边界。 |
| 来源 | Step 5 `TraceSubjectRef`;Step 6 候选池筛选;`BR-ML-003`;`BR-ML-018`;typed ref / boundary 线索。 |

##### 5.10.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| ref_value | TraceSubjectRefValue | opaque 主体引用值。 |
| subject_kind | TraceSubjectKind | 表达主体类别,如 definition、formal version、consumption material、relation、external basis 或 package assembly。 |
| source_ref | TraceSubjectSourceRef | 主体来源引用,不得由 free-form 字符串拼接。 |
| namespace_ref | MethodAssetNamespaceRef | 限定主体引用的命名空间和归属边界。 |

##### 5.10.5.3 状态集合

| 状态 | 作用 |
|---|---|
| not_applicable | reference object 无独立业务生命周期;其有效性由被引用对象和追溯材料解释。 |

##### 5.10.5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_subject_kind(TraceSubjectKind subject_kind) | 校验主体类别符合当前追溯语境。 |
| assert_same_subject(TraceSubjectRef other_ref) | 判断两个主体引用是否指向同一追溯主体。 |
| assert_namespace(MethodAssetNamespaceRef namespace_ref) | 校验主体引用没有跨命名空间漂移。 |

##### 5.10.5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_definition_ref(MethodAssetDefinitionRef definition_ref) | 从定义 typed ref 建立追溯主体引用。 |
| from_formal_version_ref(FormalMethodAssetVersionRef formal_version_ref) | 从正式版本 typed ref 建立追溯主体引用。 |
| from_consumption_material_ref(MethodAssetConsumptionMaterialRef consumption_material_ref) | 从消费材料 typed ref 建立追溯主体引用。 |

##### 5.10.5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不从字符串私造 | route param、日志 id、旧对象名、下游 id、URL、文件路径或 artifact path 不得直接拼成主体引用。 |
| 不携带正文 | trace subject ref 只表达引用边界,不携带业务正文、证据正文或外部正文。 |
| 不表达状态判断 | 主体引用不说明是否正式化、可消费或影响已承接。 |
| 不替代具体 typed ref | 当上下文需要 definition ref、formal version ref 或 consumption material ref 时,不能用本对象弱化类型。 |

停审记录:

- 候选是否处理完: pass。`MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail` 和 `TraceSubjectRef` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`ConsumptionImpactSourceRef` 已归入 `ConsumptionImpactSummary`;`ImpactClassificationRule` 已归入 impact summary / policy;`MethodAssetTraceView` 已归入 trace material;`ConsumptionImpactView` 已归入 impact summary;`MethodAssetEvidenceLineage`、`MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial` 和 `RelationChangeHistory` 已归入 trace / audit 线索。
- 对象是否有功能来源: pass。对象均回指 Step 5、`FR-ML-008`、`BR-ML-003/010/018/020`、`NFR-ML-001` 和 01 架构追溯与一致性保护语义核心子域。
- 接缝是否清楚: pass。trace material、impact summary、consistency policy、audit trail 和 trace subject reference 已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、审计 schema、证据 schema、恢复算法或完整状态迁移矩阵。
- 下一步只允许进入“关系与分发语义:先思考”,不得跳到关系与分发语义对象小节或后续组成部分。

### 5.11 关系与分发语义:先思考

问题回答:

- 本组成部分需要正式展开三个对象:`MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule`。
- `MethodAssetRelation` 承载方法资产之间的定义性关系。它来自 Step 5 的关系语义、关系端点和外围组织支撑线索,但不是运行时依赖图、调用图、推荐结果、搜索索引或 UI 分类。
- `MethodAssetDistributionRef` 需要作为 reference / boundary object 独立展开。它表达方法资产面向正式消费、外围生态发现或包 / 方法集组织时的分发语义引用,但不承载 marketplace listing、订单、购买、结算、安装或履约事实。
- `RelationIntegrityRule` 需要作为 policy / invariant 独立展开。它横跨关系端点、正式化状态、消费边界、分发引用和外部依据边界,不能只埋入 relation 字段说明。
- `RelatedMethodAssetRef` 与 `DistributionContextRef` 需要作为 typed ref 字段家族成员承接,避免 Step 7/8 用 free-form asset id、route param、marketplace id 或外部 URL 私造关系端点。

诊断:

- 关系与分发语义必须独立于目录和消费。目录回答“资产如何被识别和放入适用语境”,受控消费回答“下游在什么边界下使用正式语义材料”,关系与分发则回答“资产之间的正式语义如何关联,以及这种关联如何被消费和外围组织理解”。
- `MethodAssetRelation` 不应与 `MethodAssetDefinition` 合并。关系有独立端点、关系语义和完整性规则;若并入定义对象,会让定义 truth 直接承载图结构和外围组织语义。
- `MethodAssetDistributionRef` 不应与 `MethodPackage` 或 `MethodSetAssembly` 合并。分发引用是核心 / 支撑语义输入,package 和 set 是外围组织增强;二者合并会让外围增强反向成为核心闭环前置。
- `DistributionBoundaryRule` 不需要独立成对象。它只约束分发引用不得越过 marketplace、安装履约和外部正文边界,应并入 `MethodAssetDistributionRef` 的禁止事项和 `RelationIntegrityRule` 的完整性判断。
- `MethodAssetRelationView` 不独立成 truth。它只是 relation 的读取形态,应并入 `MethodAssetRelation` 并标注非 truth。
- `DistributionReadMaterial` 不独立成 truth。它只是分发引用的读取材料形态,应并入 `MethodAssetDistributionRef`。
- `RelationChangeHistory` 不在本组成部分独立展开。关系变化线索已由 `MethodAssetAuditTrail` / `MethodAssetTraceMaterial` 统一承接,避免形成第二条关系历史 truth。

取舍:

- 保留 `MethodAssetRelation` 作为 relation truth / relation object,用于表达定义性关系、关系端点和关系语义边界。
- 保留 `MethodAssetDistributionRef` 作为 reference / boundary object,用于表达分发语义引用、分发上下文和 marketplace / package 边界隔离。
- 保留 `RelationIntegrityRule` 作为 policy / invariant 对象,用于约束关系端点存在性、正式化边界、关系方向和分发越界。
- 将 `DistributionBoundaryRule` 并入 `MethodAssetDistributionRef` / `RelationIntegrityRule`;将 `MethodAssetRelationView` 并入 `MethodAssetRelation`;将 `DistributionReadMaterial` 并入 `MethodAssetDistributionRef`。
- 将 `RelatedMethodAssetRef` 和 `DistributionContextRef` 作为 typed ref 字段类型承接,不在本组成部分单独成节。
- 将 `RelationChangeHistory` 交给追溯与审计对象承接,不在关系对象旁边创建平行 history truth。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、接口、流程、存储、事件、协议 schema、关系类型枚举、图遍历算法或分发协议。
- 本模块未保存 marketplace 交易、安装履约、package 正文、method set 正文、artifact 正文、archive 包、外部系统响应正文或下游运行状态。
- 本模块未把 relation view、distribution read material、搜索索引、推荐结果、运行依赖图、调用图或 UI 分类写成关系 truth。
- 下一模块只允许进入“关系与分发语义:再写入”,为上述对象写概要级对象小节和停审记录;不得跳到“外部摘要与引用”。

### 5.12 关系与分发语义:再写入

#### 5.12.1 MethodAssetRelation

##### 5.12.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | relation truth / relation object |
| 主要责任 | 承载方法资产之间的定义性关系、关系端点和关系语义边界。 |
| 来源 | Step 5 `MethodAssetRelation`;`RelatedMethodAssetRef`;`MethodAssetRelationView`;`RelationChangeHistory`;`FR-ML-009`;`BR-ML-011`;01 架构中的方法资产关系语义支撑子域。 |

##### 5.12.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| relation_ref | MethodAssetRelationRef | 方法资产关系稳定引用。 |
| source_asset_ref | MethodAssetDefinitionRef | 关系起点的方法资产定义锚点。 |
| target_asset_ref | RelatedMethodAssetRef | 关系终点的方法资产 typed ref。 |
| relation_kind | MethodAssetRelationKind | 表达定义性关系类别,不等于运行依赖或推荐结果。 |
| relation_context_ref | DistributionContextRef | 关系适用的上下文或分发语境。 |
| integrity_rule_ref | RelationIntegrityRuleRef | 关系完整性判断依据。 |
| trace_subject_ref | TraceSubjectRef | 关系变化进入追溯与审计的主体引用。 |

##### 5.12.1.3 状态集合

| 状态 | 作用 |
|---|---|
| RelationProposed | 关系已提出,等待完整性判断。 |
| RelationActive | 关系完整性满足要求,可作为正式语义关系使用。 |
| RelationScopeLimited | 关系只适用于特定上下文或分发语境。 |
| RelationSuspended | 关系暂不可用于新消费或外围组织。 |
| RelationRetired | 关系退出当前语境,历史追溯仍需保留。 |

##### 5.12.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_endpoint(MethodAssetDefinitionRef definition_ref) | 校验关系端点属于正式 typed ref。 |
| assert_integrity(RelationIntegrityRule integrity_rule) | 校验关系端点、方向和正式化边界满足完整性规则。 |
| limit_scope(DistributionContextRef distribution_context_ref) | 标记关系只在指定上下文成立。 |
| retire(RelationRetirementReason reason_ref) | 退出当前关系语境并保留追溯线索。 |

##### 5.12.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| propose(MethodAssetDefinitionRef source_asset_ref, RelatedMethodAssetRef target_asset_ref) | 从两个 typed ref 建立关系候选。 |
| activate(MethodAssetRelationRef relation_ref, RelationIntegrityRuleRef integrity_rule_ref) | 在完整性规则满足后激活关系。 |
| scope_limited(MethodAssetRelationRef relation_ref, DistributionContextRef distribution_context_ref) | 建立限定上下文的关系语义。 |

##### 5.12.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为运行依赖图 | 流程执行依赖、调用链、runtime dependency 和 image dependency 不属于本对象。 |
| 不成为推荐结果 | 排序、推荐、相似度、搜索索引和 UI 分类不得成为关系 truth。 |
| 不保存外部正文 | 外部依据、artifact、archive、package 或 method set 正文不得进入关系对象。 |
| 不替代定义 truth | 关系连接定义锚点,但不创建或修改方法资产定义。 |

#### 5.12.2 MethodAssetDistributionRef

##### 5.12.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | reference object / boundary object |
| 主要责任 | 表达方法资产面向正式消费、外围生态发现或包 / 方法集组织时的分发语义引用。 |
| 来源 | Step 5 `MethodAssetDistributionRef`;`DistributionContextRef`;`DistributionReadMaterial`;`DistributionBoundaryRule`;`FR-ML-010`;`BR-ML-012`;`BR-ML-021`。 |

##### 5.12.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| distribution_ref | MethodAssetDistributionRefValue | opaque 分发语义引用值。 |
| definition_ref | MethodAssetDefinitionRef | 被分发语义引用的方法资产定义锚点。 |
| formal_version_ref | OptionFormalMethodAssetVersionRef | 分发语义绑定的正式版本,存在时必须符合正式化边界。 |
| distribution_context_ref | DistributionContextRef | 分发语义适用的上下文。 |
| allowed_distribution_kind_set | MethodAssetDistributionKindSet | 表达允许的分发语义类别,不等于 marketplace 履约。 |
| boundary_reason_ref | DistributionBoundaryReasonRef | 分发边界成立的安全原因引用。 |

##### 5.12.2.3 状态集合

| 状态 | 作用 |
|---|---|
| DistributionRefPrepared | 分发语义引用已准备,等待边界判断。 |
| DistributionRefActive | 分发语义引用可用于正式消费或外围发现。 |
| DistributionRefScopeLimited | 分发语义只适用于指定上下文。 |
| DistributionRefSuspended | 分发语义暂不可用于新消费或外围发现。 |
| DistributionRefRetired | 分发语义退出当前语境,历史引用仍需可解释。 |

##### 5.12.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_definition(MethodAssetDefinitionRef definition_ref) | 校验分发引用指向同一方法资产定义。 |
| assert_formal_version(OptionFormalMethodAssetVersionRef formal_version_ref) | 校验分发引用没有绕过正式化边界。 |
| assert_distribution_context(DistributionContextRef distribution_context_ref) | 校验分发语义适用于给定上下文。 |
| reject_marketplace_fact(MarketplaceContextRef marketplace_context_ref) | 明确拒绝交易、安装或履约事实进入分发引用。 |

##### 5.12.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| for_definition(MethodAssetDefinitionRef definition_ref, DistributionContextRef distribution_context_ref) | 为定义锚点建立分发语义引用。 |
| for_formal_version(FormalMethodAssetVersionRef formal_version_ref, DistributionContextRef distribution_context_ref) | 为正式版本建立分发语义引用。 |
| scope_limited(MethodAssetDistributionRefValue distribution_ref, DistributionContextRef distribution_context_ref) | 建立限定上下文的分发引用。 |

##### 5.12.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不表示 marketplace listing | listing、上架、定价、订单、购买、结算和退款属于 `L6-marketplace`。 |
| 不表示安装履约 | install record、license grant、delivery package 和履约状态不得进入本对象。 |
| 不保存 package 正文 | package、method set、artifact、archive 和外部平台正文只能以 ref / summary 出现。 |
| 不绕过消费边界 | 分发语义引用不能让非正式定义或越界消费变成正式可用。 |

#### 5.12.3 RelationIntegrityRule

##### 5.12.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | policy / invariant |
| 主要责任 | 约束方法资产关系端点、方向、正式化边界、分发引用和外部依据边界。 |
| 来源 | Step 5 `RelationIntegrityRule`;`DistributionBoundaryRule`;`BR-ML-003`;`BR-ML-011`;`BR-ML-012`;`BR-ML-021`。 |

##### 5.12.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | RelationIntegrityRuleRef | 关系完整性规则引用。 |
| required_endpoint_state | RelationEndpointStateRequirement | 对关系端点存在性和可引用性的要求。 |
| required_formalization_state | RelationFormalizationRequirement | 对正式化状态和版本边界的要求。 |
| allowed_relation_kind_set | MethodAssetRelationKindSet | 允许的定义性关系类别集合。 |
| allowed_distribution_context_set | DistributionContextRefSet | 允许的分发上下文集合。 |
| forbidden_boundary_kind_set | RelationForbiddenBoundaryKindSet | 禁止越过的 marketplace、外部正文或下游运行边界。 |

##### 5.12.3.3 状态集合

| 状态 | 作用 |
|---|---|
| RuleActive | 当前规则可用于关系和分发完整性判断。 |
| RuleSuperseded | 规则被新规则替代,历史关系判断仍需可解释。 |
| RuleDisabled | 规则不可用于新关系判断。 |

##### 5.12.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate_relation(MethodAssetRelation relation) | 判断关系端点、方向和语义是否满足规则。 |
| evaluate_distribution(MethodAssetDistributionRef distribution_ref) | 判断分发引用是否越过边界。 |
| reject_missing_endpoint(RelatedMethodAssetRef related_method_asset_ref) | 拒绝指向不存在或不可引用端点的关系。 |
| reject_boundary_violation(RelationBoundaryViolationRef violation_ref) | 拒绝 marketplace、外部正文或下游运行 truth 越界。 |

##### 5.12.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| default_core_relation_rule(RelationIntegrityRuleRef rule_ref) | 建立核心关系完整性最小规则。 |
| for_distribution_context(RelationIntegrityRuleRef rule_ref, DistributionContextRef distribution_context_ref) | 建立特定分发上下文下的完整性规则。 |

##### 5.12.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不执行图算法 | 图遍历、推荐、排序、相似度和搜索算法不属于完整性规则。 |
| 不保存配置矩阵 | 可配置规则、profile 和开关留给后续配置设计。 |
| 不调用 marketplace | 本规则只表达本仓边界判断,不查询交易、安装或履约系统。 |
| 不替代追溯保护 | 关系变化的影响解释和一致性保护由 trace / impact / policy 对象承接。 |

停审记录:

- 候选是否处理完: pass。`MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`DistributionBoundaryRule` 已并入 distribution ref / integrity rule;`MethodAssetRelationView` 已归入 relation 读取形态;`DistributionReadMaterial` 已归入 distribution ref;`RelatedMethodAssetRef` 与 `DistributionContextRef` 已作为 typed ref 字段类型承接;`RelationChangeHistory` 已归入 trace / audit 线索。
- 对象是否有功能来源: pass。三个对象均回指 Step 5、`FR-ML-009/010`、`BR-ML-003/011/012/021` 和 01 架构关系 / 分发支撑子域。
- 接缝是否清楚: pass。definition endpoint、formalization boundary、distribution context、marketplace boundary、trace handoff 和 peripheral package/set 输入已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、关系类型全集、图算法、分发渠道协议、marketplace 交易或安装履约。
- 下一步只允许进入“外部摘要与引用:先思考”,不得跳到外部摘要与引用对象小节或后续组成部分。

### 5.13 外部摘要与引用:先思考

问题回答:

- 本组成部分需要正式展开四个对象:`ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`。
- `ExternalSourceSummary` 承载治理结论、标准、ADR、方法论来源、外部正文线索和 artifact / archive 线索的安全摘要。它是本仓可使用的外部依据摘要,不是外部正文副本、标准解释器、治理裁决执行记录或 artifact 元数据完整镜像。
- `ExternalSourceRef` 需要作为 reference / boundary object 独立展开。它为外部来源、标准、ADR、方法论文档或外部正文提供 typed ref 边界,不得由 free-form URL、外部 id、文件路径或网页地址替代。
- `ArtifactArchiveRef` 需要作为 reference / boundary object 独立展开。它只指向 artifact / archive 相关外部材料,不保存制品、归档包、证据文件、对象存储内容或外部生命周期。
- `ExternalBodyBoundaryRule` 需要作为 policy / guard 独立展开。它横跨正式化、追溯、关系分发、外围组织和维护刷新,统一约束外部正文、证据正文和交易履约正文不得进入本仓 truth。

诊断:

- 外部摘要与引用不能并入正式化与版本。正式化需要使用治理或标准依据,但外部来源接收、摘要化、typed ref 和正文禁止边界应统一归口,否则正式化路径会拥有治理执行或外部正文。
- 外部摘要与引用也不能并入追溯与一致性保护。追溯需要使用 basis / evidence ref 组织 lineage,但外部依据如何被摘要化、引用化和拒绝正文入仓,应先由本组成部分闭合。
- `GovernanceBasisRef` 不需要独立成节。它是正式化依据和外部摘要字段中的 typed ref 家族成员,不得保存治理裁决正文或治理执行过程。
- `ExternalBasisAcceptanceState` 不需要独立成对象。它应并入 `ExternalSourceSummary` 的状态集合,用于表达外部依据已承接、待确认、不可用或拒绝等状态线索;完整状态迁移留 Step 9。
- `ExternalBasisAcceptanceRule` 不需要独立成对象。它应并入 `ExternalSourceSummary` 的承接判断和 `ExternalBodyBoundaryRule` 的禁止事项。
- `ExternalSourceSummaryView` 不独立成 truth。它只是 external summary 的读取形态,应并入 `ExternalSourceSummary` 并标注非 truth。
- `ExternalBasisAcceptanceHistory` 不单独成历史 truth。外部依据何时被承接、失效或挂起,由 `ExternalSourceSummary` 状态线索和 `MethodAssetAuditTrail` / trace material 承接。

取舍:

- 保留 `ExternalSourceSummary` 作为 summary / state carrier,承载外部依据的安全摘要、承接状态线索和正文禁止边界结果。
- 保留 `ExternalSourceRef` 作为外部来源 typed ref,服务定义、正式化、追溯、关系分发和外围组织对外部依据的引用。
- 保留 `ArtifactArchiveRef` 作为 artifact / archive typed ref,明确 artifact 与 archive 只能以引用进入,不引入正文、包内容或存储生命周期。
- 保留 `ExternalBodyBoundaryRule` 作为跨对象 guard,统一约束外部正文、证据正文、artifact 正文、archive 包和 marketplace 交易履约正文不得入仓。
- 将 `GovernanceBasisRef` 作为 `FormalizationBasisSummary` / `ExternalSourceSummary` 的字段类型承接;将 `ExternalBasisAcceptanceState` 并入 `ExternalSourceSummary`;将 `ExternalBasisAcceptanceRule` 并入 summary / boundary rule。
- 将 `ExternalSourceSummaryView` 并入 `ExternalSourceSummary`;将 `ExternalBasisAcceptanceHistory` 归入 external summary 状态线索和 trace / audit 对象。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、summary schema、ref key 规则、外部 API、event payload、artifact schema、evidence JSON、repository 或持久化结构。
- 本模块未把治理执行、policy enforce、标准全文、ADR 正文、artifact 正文、archive 包、证据文件、marketplace 交易履约或外部系统原始响应纳入本仓 truth。
- 本模块未让外部关系、artifact、marketplace、console / SDK 或对象存储成为核心闭环前置。
- 下一模块只允许进入“外部摘要与引用:再写入”,为上述对象写概要级对象小节和停审记录;不得跳到“后台维护与收敛”。

### 5.14 外部摘要与引用:再写入

#### 5.14.1 ExternalSourceSummary

##### 5.14.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | summary / state carrier |
| 主要责任 | 承载外部依据的安全摘要、承接状态线索和正文禁止边界结果。 |
| 来源 | Step 5 `ExternalSourceSummary`;`ExternalSourceSummaryView`;`ExternalBasisAcceptanceState`;`ExternalBasisAcceptanceHistory`;`FR-ML-011`;`BR-ML-019`;`BR-ML-020`。 |

##### 5.14.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| summary_ref | ExternalSourceSummaryRef | 外部来源摘要稳定引用。 |
| source_ref | ExternalSourceRef | 被摘要化的外部来源 typed ref。 |
| source_kind | ExternalSourceKind | 表达治理结论、标准、ADR、方法论文档、外部正文或 artifact 线索类别。 |
| safe_summary_marker | ExternalSafeSummaryMarker | 安全摘要 marker,不保存外部正文。 |
| acceptance_state | ExternalBasisAcceptanceState | 表达外部依据承接状态线索。 |
| basis_refs | FormalizationBasisSummaryRefSet | 可被正式化或追溯使用的依据摘要引用。 |
| boundary_rule_ref | ExternalBodyBoundaryRuleRef | 指向正文禁止边界判断。 |

##### 5.14.1.3 状态集合

| 状态 | 作用 |
|---|---|
| ExternalBasisAccepted | 外部依据摘要已被本仓正式承接。 |
| ExternalBasisPendingReview | 外部依据摘要需要进一步确认,不得伪装为已承接。 |
| ExternalBasisUnavailable | 外部来源暂不可用,不得复制外部正文补齐。 |
| ExternalBasisRejected | 外部依据不满足承接条件或违反正文边界。 |
| ExternalBasisStale | 外部来源可能变化,摘要需要重新判断。 |

##### 5.14.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_body_free() | 校验摘要不携带标准全文、ADR 正文、artifact 正文或外部响应正文。 |
| assert_source_ref(ExternalSourceRef source_ref) | 校验摘要来源与 typed ref 一致。 |
| mark_stale(ExternalSourceStalenessReason reason_ref) | 标记外部摘要可能过期。 |
| reject_for_boundary(ExternalBodyBoundaryViolationRef violation_ref) | 因正文或外部职责越界而拒绝承接。 |

##### 5.14.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_safe_summary(ExternalSourceRef source_ref, ExternalSafeSummaryMarker safe_summary_marker) | 从外部来源引用和安全摘要 marker 建立摘要。 |
| pending_review(ExternalSourceRef source_ref, ExternalBasisPendingReason reason_ref) | 表达外部依据待确认。 |
| rejected(ExternalSourceRef source_ref, ExternalBodyBoundaryViolationRef violation_ref) | 表达外部依据因边界违规被拒绝。 |

##### 5.14.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 标准全文、ADR 正文、网页正文、外部 API payload 和文档正文不得进入本对象。 |
| 不执行治理裁决 | governance gate、policy enforce 和审批执行属于外部系统或 governance。 |
| 不拥有 artifact 生命周期 | artifact 生成、存储、归档和删除不由本对象管理。 |
| 不成为外部来源 truth | 本对象只是本仓可用摘要,不是外部系统状态副本。 |

#### 5.14.2 ExternalSourceRef

##### 5.14.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | reference object / boundary object |
| 主要责任 | 为外部来源、标准、ADR、方法论文档或外部正文提供 typed ref 边界。 |
| 来源 | Step 5 `ExternalSourceRef`;`GovernanceBasisRef`;`FR-ML-011`;`BR-ML-019`;`BR-ML-020`;typed ref / boundary 线索。 |

##### 5.14.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| ref_value | ExternalSourceRefValue | opaque 外部来源引用值。 |
| source_kind | ExternalSourceKind | 外部来源类别。 |
| source_namespace_ref | ExternalSourceNamespaceRef | 限定外部来源命名空间和责任边界。 |
| governance_basis_ref | OptionGovernanceBasisRef | 可选治理依据引用,不保存治理裁决正文。 |
| body_boundary_marker | ExternalBodyBoundaryMarker | 标记该 ref 只允许摘要 / 引用进入。 |

##### 5.14.2.3 状态集合

| 状态 | 作用 |
|---|---|
| not_applicable | reference object 无独立业务生命周期;外部可用性由 `ExternalSourceSummary` 状态线索解释。 |

##### 5.14.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_namespace(ExternalSourceNamespaceRef source_namespace_ref) | 校验外部来源没有跨命名空间漂移。 |
| assert_kind(ExternalSourceKind source_kind) | 校验外部来源类别符合当前承接语境。 |
| assert_body_boundary(ExternalBodyBoundaryRule boundary_rule) | 校验该引用只能以摘要 / marker 进入本仓。 |

##### 5.14.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_formal_source_key(ExternalSourceKind source_kind, ExternalSourceNamespaceRef source_namespace_ref) | 从正式外部来源键建立 typed ref。 |
| from_governance_basis(GovernanceBasisRef governance_basis_ref) | 从治理依据引用建立外部来源 ref。 |

##### 5.14.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不从 URL 私造 | free-form URL、文件路径、网页地址、外部 id 或 route param 不得直接替代 typed ref。 |
| 不携带外部正文 | ref 只表达引用边界,不携带正文、摘录、payload 或证据内容。 |
| 不表达外部生命周期 | 外部来源的创建、删除、发布、归档和权限状态不属于本对象。 |
| 不替代 GovernanceBasisRef | 需要明确治理依据时仍应保留 typed governance basis 字段。 |

#### 5.14.3 ArtifactArchiveRef

##### 5.14.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | reference object / boundary object |
| 主要责任 | 指向与方法资产相关的 artifact / archive 外部材料,同时禁止制品正文入仓。 |
| 来源 | Step 5 `ArtifactArchiveRef`;artifact / archive 引用线索;`FR-ML-011`;`BR-ML-020`;`BR-ML-021`。 |

##### 5.14.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| archive_ref | ArtifactArchiveRefValue | opaque artifact / archive 引用值。 |
| source_ref | ExternalSourceRef | artifact / archive 所属外部来源引用。 |
| artifact_kind | ArtifactArchiveKind | 表达 artifact、archive、evidence bundle 或 package reference 等类别。 |
| material_marker | ArtifactArchiveMaterialMarker | 安全材料 marker,不保存制品正文。 |
| boundary_rule_ref | ExternalBodyBoundaryRuleRef | 正文禁止边界依据。 |

##### 5.14.3.3 状态集合

| 状态 | 作用 |
|---|---|
| not_applicable | artifact / archive 外部生命周期不由本仓管理;可用性由外部摘要或维护检查表达。 |

##### 5.14.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_source(ExternalSourceRef source_ref) | 校验 archive 引用所属外部来源。 |
| assert_material_marker(ArtifactArchiveMaterialMarker material_marker) | 校验引用只保存安全 marker。 |
| reject_body_material(ArtifactBodyMaterialRef body_material_ref) | 拒绝 artifact / archive 正文进入本仓。 |

##### 5.14.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_external_source(ExternalSourceRef source_ref, ArtifactArchiveMaterialMarker material_marker) | 从外部来源引用和安全 marker 建立 artifact / archive ref。 |
| from_evidence_lineage(ExternalSourceRef source_ref, MethodAssetEvidenceMarkerRef evidence_marker_ref) | 从证据线索 marker 建立 archive 引用边界。 |

##### 5.14.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 artifact 正文 | 二进制、文档、模板、示例、包内容和 archive payload 不得进入本对象。 |
| 不管理对象存储 | bucket、path、signed URL、retention 和存储 lifecycle 属于后续 adapter / 运维。 |
| 不表达 marketplace 履约 | delivery package、install receipt 和授权履约不属于本对象。 |
| 不替代 evidence schema | 证据 JSON、artifact digest 和 evidence index 由测试 / 证据设计闭合。 |

#### 5.14.4 ExternalBodyBoundaryRule

##### 5.14.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | policy / guard |
| 主要责任 | 统一约束外部正文、证据正文、artifact 正文、archive 包和交易履约正文不得进入本仓 truth。 |
| 来源 | Step 5 `ExternalBodyBoundaryRule`;`ExternalBasisAcceptanceRule`;`BR-ML-019`;`BR-ML-020`;`BR-ML-021`;01 架构外部摘要与引用边界。 |

##### 5.14.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | ExternalBodyBoundaryRuleRef | 正文边界规则引用。 |
| allowed_material_kind_set | ExternalAllowedMaterialKindSet | 允许进入本仓的摘要、marker、ref 类别。 |
| forbidden_body_kind_set | ExternalForbiddenBodyKindSet | 禁止进入本仓的正文 / payload 类别。 |
| acceptance_requirement | ExternalBasisAcceptanceRequirement | 外部依据承接资格要求。 |
| boundary_reason_ref | ExternalBodyBoundaryReasonRef | 边界成立或拒绝的安全原因引用。 |

##### 5.14.4.3 状态集合

| 状态 | 作用 |
|---|---|
| RuleActive | 当前规则可用于外部摘要 / 引用承接判断。 |
| RuleSuperseded | 规则被新规则替代,历史承接判断仍需可解释。 |
| RuleDisabled | 规则不可用于新外部依据承接。 |

##### 5.14.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_summary_only(ExternalSourceSummary summary) | 校验外部依据只以摘要 / marker / ref 出现。 |
| assert_ref_only(ExternalSourceRef source_ref) | 校验外部来源引用没有携带正文。 |
| reject_external_body(ExternalBodyMaterialRef body_material_ref) | 拒绝外部正文或 payload 入仓。 |
| reject_marketplace_fulfillment(MarketplaceContextRef marketplace_context_ref) | 拒绝交易履约正文进入方法库 truth。 |

##### 5.14.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| default_body_free_rule(ExternalBodyBoundaryRuleRef rule_ref) | 建立本仓默认正文禁止边界。 |
| for_artifact_archive(ExternalBodyBoundaryRuleRef rule_ref, ArtifactArchiveKind artifact_kind) | 建立 artifact / archive 引用边界规则。 |

##### 5.14.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不执行内容审查 | 规则只表达入仓边界,不扫描、解析或审核外部正文。 |
| 不保存配置矩阵 | 可配置白名单、profile 和开关留后续配置设计。 |
| 不调用外部系统 | 外部 API、artifact store、marketplace 和 governance 调用不属于本对象。 |
| 不替代正式化资格 | 正文边界通过只是输入,不等于方法资产正式化成立。 |

停审记录:

- 候选是否处理完: pass。`ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`GovernanceBasisRef` 已作为字段类型承接;`ExternalBasisAcceptanceState` 已并入 `ExternalSourceSummary`;`ExternalBasisAcceptanceRule` 已并入 summary / boundary rule;`ExternalSourceSummaryView` 已归入 external summary 读取形态;`ExternalBasisAcceptanceHistory` 已归入状态线索和 trace / audit 对象。
- 对象是否有功能来源: pass。四个对象均回指 Step 5、`FR-ML-011`、`BR-ML-019/020/021` 和 01 架构外部摘要与引用边界。
- 接缝是否清楚: pass。definition basis、formalization basis、trace lineage、relation basis、peripheral context 和 maintenance refresh scope 已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、外部 API、artifact schema、evidence JSON、存储结构或 adapter 实现。
- 下一步只允许进入“后台维护与收敛:先思考”,不得跳到后台维护与收敛对象小节或后续组成部分。

### 5.15 后台维护与收敛:先思考

问题回答:

- 本组成部分需要正式展开四个对象:`ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`。
- `ReadMaterialRefreshTask` 承接目录视图、正式版本视图、消费材料、可用性视图、关系 / 分发读取材料和外部摘要读取材料的刷新语义。它只表达派生材料刷新任务,不是 job 调度、worker、queue、topic、outbox 或 retry policy。
- `TraceMaterialRefreshTask` 承接追溯材料、审计线索、证据 marker 线索和消费影响摘要读取材料的刷新语义。它不得创建新的 trace truth,也不得把 raw log、telemetry、证据正文或外部正文补入本仓。
- `ConsistencyRecoveryTask` 承接引用失效、摘要缺失、读取材料旧视图、消费影响未知、边界异常和恢复待承接等收敛语义。它可以并入 `MaintenanceConvergenceRule` 和 `RecoverySafetyRule` 的不变量,但不得重做正式化裁决、改写核心 truth 或绕过受控消费边界。
- `MaintenanceProgressView` 需要作为 projection / read model 独立展开,用于表达维护 run、refresh scope、待收敛、待恢复、待确认、显式不可用等可见状态。它不是维护任务 truth,也不是业务 truth。

诊断:

- Step 5 已把后台维护与收敛限定为支撑 / operation 组成部分,因此 Step 6 对象必须围绕 task、recovery 和 progress view 展开,不能转成核心业务对象。
- 如果不独立点名 refresh task / recovery task,后续 Step 7/8 容易把维护能力写成 job 名、worker loop、scheduler 或 adapter 细节,从而越过概要层。
- 如果不点名 `MaintenanceProgressView`,后续 observability / audit 可能只能依赖日志、raw task output 或实现私有状态判断维护是否完成,这会违反 body-free 和非 truth 边界。
- `MaintenanceRunRef` 与 `RefreshScopeRef` 不需要在本组成部分单独成节,但必须作为 typed ref 字段家族进入 task / progress view。它们不得由 worker id、queue id、cron 名称或 free-form scope 字符串替代。
- `MaintenanceRunHistory` 不应独立形成 history truth。维护动作来源、结果和历史解释应通过 task / progress view 与 `MethodAssetAuditTrail` / trace material 交接。
- 维护任务与恢复任务都可能有状态词表,但完整状态迁移必须留给 Step 9。本 Step 只固定状态集合轮廓和禁止事项。

取舍:

- 保留 `ReadMaterialRefreshTask` 作为 read material refresh task object,覆盖 catalog、formal version、consumption、availability、relation、distribution 和 external summary 等读取材料刷新。
- 保留 `TraceMaterialRefreshTask` 作为 trace / audit / evidence / impact material refresh task object,覆盖追溯和审计可读材料收敛。
- 保留 `ConsistencyRecoveryTask` 作为 recovery object,并把 `MaintenanceConvergenceRule` 与 `RecoverySafetyRule` 并入其不变量、成员函数和禁止事项。
- 保留 `MaintenanceProgressView` 作为 body-free progress read model,用于后续 operations / observability / acceptance 判断维护是否待收敛、待恢复或显式不可用。
- 不引入 `MethodAssetMaintenanceJob`、`WorkerRun`、`OutboxRecord`、`RetryPolicy`、`SchedulerConfig` 或 durable report 作为 Step 6 对象。若后续需要,必须在 Step 7~11 或配置 / 实施文档按正式边界另行闭口。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、接口、流程、存储、事件、协议 schema、job 名、worker loop、queue/topic/outbox、重试策略、锁策略或数据库表。
- 本模块未把 read model、projection、cache、maintenance task、progress view、report 或 recovery result 写成第二定义 truth。
- 本模块未通过恢复路径复制外部正文、artifact 正文、archive 包、治理执行正文、下游运行状态、marketplace 交易或 UI 会话状态。
- 下一模块只允许进入“后台维护与收敛:再写入”,为上述四个对象写概要级对象小节和停审记录;不得跳到“外围包与方法集组织”。

### 5.16 后台维护与收敛:再写入

#### 5.16.1 ReadMaterialRefreshTask

##### 5.16.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | task object / maintenance object |
| 主要责任 | 表达目录、正式版本、消费材料、可用性、关系、分发和外部摘要等读取材料的刷新任务语义。 |
| 来源 | Step 5 `ReadMaterialRefreshTask`;`FR-ML-005`;`FR-ML-006`;`NFR-ML-001`;`NFR-ML-013`;01 架构后台延后承接与读取材料最终一致口径。 |

##### 5.16.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| refresh_task_ref | ReadMaterialRefreshTaskRef | 读取材料刷新任务引用。 |
| maintenance_run_ref | MaintenanceRunRef | 维护运行语境引用,不等于 worker id 或 scheduler id。 |
| refresh_scope_ref | RefreshScopeRef | 限定本次刷新覆盖的定义、版本、消费、关系、分发或外部摘要范围。 |
| source_subject_refs | TraceSubjectRefSet | 本次刷新关联的来源主体集合。 |
| target_material_kind_set | ReadMaterialKindSet | 需要刷新的读取材料类别集合。 |
| refresh_reason_ref | ReadMaterialRefreshReasonRef | 触发刷新任务的安全原因引用。 |
| source_cursor | OptionalReadMaterialSourceCursor | 派生来源位置线索,不等于数据库游标或 queue offset。 |

##### 5.16.1.3 状态集合

| 状态 | 作用 |
|---|---|
| RefreshRequested | 刷新任务已被正式请求或由维护范围展开得到。 |
| RefreshInProgress | 刷新正在推进,来源 truth 不因此改变。 |
| RefreshConverged | 目标读取材料已与正式来源收敛。 |
| RefreshStale | 任务结果落后于新的来源变化,需重新刷新。 |
| RefreshUnavailable | 刷新暂不可用,但不影响来源 truth 成立。 |
| RefreshFailed | 刷新失败并需要显式暴露或进入恢复判断。 |

##### 5.16.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_scope(RefreshScopeRef refresh_scope_ref) | 校验刷新范围来自正式 typed ref。 |
| assert_targets(ReadMaterialKindSet target_material_kind_set) | 校验目标材料类别属于可刷新读取材料。 |
| mark_converged(ReadMaterialSourceCursor source_cursor) | 标记读取材料已收敛到指定来源位置。 |
| mark_unavailable(ReadMaterialUnavailableReasonRef reason_ref) | 表达刷新暂不可用,不回写核心 truth。 |

##### 5.16.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| requested(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef refresh_scope_ref) | 从维护运行和刷新范围建立读取材料刷新任务。 |
| from_source_change(TraceSubjectRef source_subject_ref, ReadMaterialRefreshReasonRef reason_ref) | 从正式来源变化建立刷新任务。 |
| unavailable(RefreshScopeRef refresh_scope_ref, ReadMaterialUnavailableReasonRef reason_ref) | 表达指定范围读取材料暂不可刷新。 |

##### 5.16.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为 job 调度实现 | cron、queue、worker、topic、outbox、retry policy 和锁策略留给后续接口 / 实施。 |
| 不创建业务 truth | 刷新任务只更新或解释读取材料,不得创建 definition、formal version、relation 或 external summary truth。 |
| 不补外部正文 | 外部摘要缺失时只能显式不可用或进入恢复判断,不得复制外部正文。 |
| 不让读取收敛决定正式化 | read material converged 不等于正式版本成立或消费边界通过。 |

#### 5.16.2 TraceMaterialRefreshTask

##### 5.16.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | task object / trace maintenance object |
| 主要责任 | 表达追溯材料、审计线索、证据 marker 线索和消费影响摘要读取材料的刷新任务语义。 |
| 来源 | Step 5 `TraceMaterialRefreshTask`;`FR-ML-007`;`FR-ML-008`;`FR-ML-009`;`BR-ML-020`;`BR-ML-022`;01 架构追溯、审计和后台维护承载。 |

##### 5.16.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| trace_refresh_task_ref | TraceMaterialRefreshTaskRef | 追溯材料刷新任务引用。 |
| maintenance_run_ref | MaintenanceRunRef | 维护运行语境引用。 |
| trace_subject_refs | TraceSubjectRefSet | 需要刷新追溯材料的主体集合。 |
| trace_material_refs | MethodAssetTraceMaterialRefSet | 已知追溯材料引用集合。 |
| audit_trail_refs | MethodAssetAuditTrailRefSet | 已知审计线索引用集合。 |
| impact_summary_refs | ConsumptionImpactSummaryRefSet | 需要同步检查的影响摘要集合。 |
| evidence_marker_refs | MethodAssetEvidenceMarkerRefSet | 证据 marker / ref 集合,不得保存证据正文。 |
| refresh_reason_ref | TraceMaterialRefreshReasonRef | 触发追溯材料刷新的安全原因引用。 |

##### 5.16.2.3 状态集合

| 状态 | 作用 |
|---|---|
| TraceRefreshRequested | 追溯材料刷新已被正式请求。 |
| TraceRefreshInProgress | 追溯材料刷新正在推进。 |
| TraceRefreshConverged | 追溯、审计或影响摘要材料已收敛。 |
| TraceRefreshIncomplete | 追溯来源缺失或证据 marker 不足,需显式待承接。 |
| TraceRefreshUnavailable | 追溯材料暂不可刷新。 |
| TraceRefreshFailed | 刷新失败并需要恢复或显式暴露。 |

##### 5.16.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_subjects(TraceSubjectRefSet trace_subject_refs) | 校验追溯主体均来自正式 typed ref。 |
| attach_audit_trail(MethodAssetAuditTrailRef audit_trail_ref) | 将审计线索纳入本次刷新范围。 |
| attach_impact_summary(ConsumptionImpactSummaryRef impact_summary_ref) | 将消费影响摘要纳入本次刷新范围。 |
| mark_incomplete(TraceMaterialIncompleteReasonRef reason_ref) | 标记追溯材料缺少必要线索。 |

##### 5.16.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| requested_for_subjects(MaintenanceRunRef maintenance_run_ref, TraceSubjectRefSet trace_subject_refs) | 为追溯主体集合建立刷新任务。 |
| from_version_change(FormalMethodAssetVersionRef formal_version_ref, TraceMaterialRefreshReasonRef reason_ref) | 从正式版本变化建立追溯刷新任务。 |
| incomplete(TraceSubjectRef trace_subject_ref, TraceMaterialIncompleteReasonRef reason_ref) | 表达指定主体追溯材料暂不完整。 |

##### 5.16.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不创建新的 trace truth | 本任务只刷新或解释已有追溯材料边界,不得生成未授权业务事实。 |
| 不保存 raw log | telemetry、worker output、请求 / 响应正文和审计日志正文不得进入任务对象。 |
| 不保存证据正文 | evidence、artifact、archive 和外部文档正文只能以 marker / ref / summary 出现。 |
| 不执行恢复算法 | 失败后的恢复收敛由 `ConsistencyRecoveryTask` 承接。 |

#### 5.16.3 ConsistencyRecoveryTask

##### 5.16.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | recovery object / maintenance object |
| 主要责任 | 表达引用失效、摘要缺失、读取材料旧视图、消费影响未知、边界异常和恢复待承接等收敛语义。 |
| 来源 | Step 5 `ConsistencyRecoveryTask`;`MaintenanceConvergenceRule`;`RecoverySafetyRule`;`FR-ML-008`;`NFR-ML-013`;`NFR-ML-015`;01 架构一致性保护与恢复承接。 |

##### 5.16.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| recovery_task_ref | ConsistencyRecoveryTaskRef | 一致性恢复任务引用。 |
| maintenance_run_ref | MaintenanceRunRef | 维护运行语境引用。 |
| recovery_scope_ref | RefreshScopeRef | 恢复或收敛范围,不使用 free-form scope 字符串。 |
| affected_subject_refs | TraceSubjectRefSet | 受恢复判断影响的主体集合。 |
| impact_summary_refs | ConsumptionImpactSummaryRefSet | 恢复判断相关的影响摘要集合。 |
| recovery_reason_ref | ConsistencyRecoveryReasonRef | 恢复任务成立的安全原因引用。 |
| safety_boundary_ref | RecoverySafetyBoundaryRef | 防止恢复越过正式化、消费或外部正文边界。 |

##### 5.16.3.3 状态集合

| 状态 | 作用 |
|---|---|
| RecoveryRequested | 恢复收敛已被正式请求。 |
| RecoveryInProgress | 恢复收敛正在推进,核心 truth 不因此改变。 |
| RecoveryPendingAcknowledgement | 需要正式承接、人工确认或下游摘要补齐。 |
| RecoveryConverged | 恢复判断已闭合,相关派生材料或摘要已收敛。 |
| RecoveryBlockedByBoundary | 恢复路径被正式化、消费、外部正文或下游 truth 边界阻断。 |
| RecoveryFailed | 恢复失败并需要显式暴露。 |

##### 5.16.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_recovery_scope(RefreshScopeRef recovery_scope_ref) | 校验恢复范围来自正式 typed ref。 |
| assert_safety_boundary(RecoverySafetyBoundaryRef safety_boundary_ref) | 校验恢复不会绕过正式边界。 |
| require_acknowledgement(ConsumptionImpactSummaryRef impact_summary_ref) | 要求影响摘要进入正式承接或确认。 |
| reject_boundary_bypass(RecoveryBoundaryViolationRef violation_ref) | 拒绝复制外部正文、重做正式化或绕过消费边界的恢复路径。 |

##### 5.16.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| requested(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef recovery_scope_ref) | 从维护运行和恢复范围建立恢复任务。 |
| from_impact_summary(ConsumptionImpactSummary impact_summary, ConsistencyRecoveryReasonRef reason_ref) | 从消费影响摘要建立恢复收敛任务。 |
| blocked_by_boundary(RefreshScopeRef recovery_scope_ref, RecoveryBoundaryViolationRef violation_ref) | 表达恢复路径因边界违规被阻断。 |

##### 5.16.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不改写核心 truth | 恢复只能推动派生材料、摘要或可见状态收敛,不得修改 definition、formal version、relation 或 external summary truth。 |
| 不重做正式化裁决 | 正式化结果和版本语义只能由正式化与版本对象 / flow 裁决。 |
| 不绕过消费边界 | 恢复不能让未正式化资产或越界消费变成正式可用。 |
| 不复制外部正文 | 外部、artifact、archive、治理、下游和 marketplace 正文不得通过恢复路径入仓。 |

#### 5.16.4 MaintenanceProgressView

##### 5.16.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | projection / read model |
| 主要责任 | 以 body-free 方式表达维护 run、刷新范围、待收敛、待恢复、待确认和显式不可用等可见状态。 |
| 来源 | Step 5 `MaintenanceProgressView`;`MaintenanceRunHistory`;`NFR-ML-015`;01 架构可观测性、韧性和后台收敛口径。 |

##### 5.16.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| progress_view_ref | MaintenanceProgressViewRef | 维护进度读取视图引用。 |
| maintenance_run_ref | MaintenanceRunRef | 维护运行语境引用。 |
| refresh_scope_ref | RefreshScopeRef | 视图覆盖的刷新或恢复范围。 |
| task_refs | MaintenanceTaskRefSet | 相关刷新 / 恢复任务引用集合。 |
| progress_state | MaintenanceProgressState | 表达 pending、in progress、converged、unavailable、failed 等读取状态线索。 |
| issue_refs | MaintenanceIssueRefSet | body-free 问题引用集合,不保存 raw diagnostic。 |
| source_cursor | OptionalMaintenanceProgressCursor | 进度视图派生来源位置。 |

##### 5.16.4.3 状态集合

| 状态 | 作用 |
|---|---|
| ProgressPending | 维护动作已排队或等待正式承接。 |
| ProgressInProgress | 维护动作正在推进。 |
| ProgressConverged | 维护范围内材料已收敛。 |
| ProgressPendingAcknowledgement | 需要正式确认、下游摘要或人工承接。 |
| ProgressUnavailable | 维护进度暂不可见或依赖不可用。 |
| ProgressFailed | 维护失败并需要显式暴露。 |

##### 5.16.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| refresh_from_tasks(MaintenanceTaskRefSet task_refs) | 从刷新 / 恢复任务派生进度视图。 |
| mark_pending_acknowledgement(MaintenanceIssueRef issue_ref) | 标记需要承接或确认。 |
| mark_unavailable(MaintenanceIssueRef issue_ref) | 表达维护进度暂不可见。 |
| assert_body_free() | 校验视图只含 refs、state 和 safe issue markers。 |

##### 5.16.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| for_run(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef refresh_scope_ref) | 为维护运行和范围建立进度视图。 |
| from_tasks(MaintenanceRunRef maintenance_run_ref, MaintenanceTaskRefSet task_refs) | 从任务集合派生进度视图。 |
| unavailable(RefreshScopeRef refresh_scope_ref, MaintenanceIssueRef issue_ref) | 表达指定范围维护进度不可见。 |

##### 5.16.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为维护 truth | progress view 只读展示维护状态,不替代刷新任务或恢复任务。 |
| 不保存 raw diagnostic | 日志、stack trace、worker output、adapter payload 和外部响应正文不得进入视图。 |
| 不决定业务状态 | progress converged 不等于正式化通过、消费可用或外部依据接受。 |
| 不定义观测指标 | 指标名、日志字段、告警阈值和报告格式留给后续观测 / 测试 / 实施文档。 |

停审记录:

- 候选是否处理完: pass。`ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 和 `MaintenanceProgressView` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`MaintenanceConvergenceRule` 与 `RecoverySafetyRule` 已并入 `ConsistencyRecoveryTask`;`MaintenanceRunRef` 与 `RefreshScopeRef` 已作为 typed ref 字段家族承接;`MaintenanceRunHistory` 已归入 task / progress view 和 trace / audit 线索。
- 对象是否有功能来源: pass。四个对象均回指 Step 5、`FR-ML-005/006/007/008/009`、`NFR-ML-001/013/015` 和 01 架构后台维护、读取材料最终一致、一致性恢复与可观测口径。
- 接缝是否清楚: pass。读取材料刷新、追溯材料刷新、一致性恢复、维护进度可见和 typed run / scope 边界已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、job 名、queue/topic/outbox、retry policy、锁策略、raw diagnostic、外部正文或完整状态迁移矩阵。
- 下一步只允许进入“外围包与方法集组织:先思考”,不得跳到外围对象小节、反查清单或后续 Step。

### 5.17 外围包与方法集组织:先思考

问题回答:

- 本组成部分需要正式展开四个对象:`MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageRef`。
- `MethodPackage` 承载方法资产包的外围组织语义。它围绕已成立或允许引用的方法资产定义、正式版本、关系和分发语义组织包,但不是 marketplace listing、交易商品、安装包正文、artifact 包或外部 package storage。
- `MethodSetAssembly` 承载组织级方法集组装语义。它可以表达组织采用、复用或组合一组方法资产的外围结构,但不能替代核心方法资产定义、正式版本、消费边界或关系 truth。
- `PackageCompositionRule` 需要独立成 policy / invariant 对象,并吸收 `MethodSetAssemblyRule`。它跨 package、method set、成员引用、正式化边界、分发上下文和 marketplace 边界,不能只埋入 package 字段。
- `MethodPackageRef` 需要作为 reference / boundary object 独立展开,因为 package 外围引用边界可能被 marketplace / ecosystem / console / SDK 消费;不得用 package file path、listing id、marketplace id、route param 或外部 URL 替代。

诊断:

- Step 5 已明确外围包与方法集组织是外围增强,不阻塞核心闭环。Step 6 对象小节必须持续标注“peripheral”,避免实现阶段把 package / method set 变成核心前置。
- `MethodPackage` 和 `MethodSetAssembly` 都可以是本仓拥有的外围组织 truth candidate,但它们的生命周期不能影响 definition、formal version、consumption material 或 trace consistency 是否成立。
- `MethodPackageView` 与 `MethodSetAssemblyView` 不应独立成 truth。它们只是外围读取材料,应分别并入 `MethodPackage` 和 `MethodSetAssembly` 的 read model 说明。
- `MarketplaceContextRef` 不需要单独成节。它只是 package / method set 与外部生态发现语境的 typed ref 字段家族成员,不得承载交易、订单、安装或履约。
- `PackageAssemblyHistory` 不应独立形成历史 truth。外围组织变化历史应由 package / set 对象和 `MethodAssetAuditTrail` / trace material 交接。
- 高级 ViewProfile 匹配、AIPolicy override 和标准映射材料当前只作为外围扩展线索,不在本组成部分进一步拆对象;若后续进入主线,必须回写 00 / 01 / 02 对应 Step。

取舍:

- 保留 `MethodPackage` 作为 peripheral aggregate / truth candidate,用于表达资产包组织语义和外围不可用隔离。
- 保留 `MethodSetAssembly` 作为 peripheral aggregate / truth candidate,用于表达组织级方法集组装语义。
- 保留 `PackageCompositionRule` 作为 policy / invariant 对象,统一承接 package composition 和 method set assembly 的边界保护。
- 保留 `MethodPackageRef` 作为 reference / boundary object,用于 package / set / marketplace / ecosystem 的稳定外围引用边界。
- 将 `MethodSetAssemblyRule` 并入 `PackageCompositionRule`;将 `MethodPackageView` 并入 `MethodPackage`;将 `MethodSetAssemblyView` 并入 `MethodSetAssembly`;将 `MarketplaceContextRef` 作为字段类型承接;将 `PackageAssemblyHistory` 归入 audit / trace 线索。

复杂度 / 越界检查:

- 本模块未写对象字段表、状态集合、成员函数表、工厂函数表、package schema、method set schema、marketplace listing schema、交易状态、安装状态、event payload、repository 或存储结构。
- 本模块未把 `MethodPackage` / `MethodSetAssembly` 写成核心定义、正式化、受控消费或追溯一致性的成立前置。
- 本模块未把 marketplace、console / SDK、artifact、外部 package storage、UI 体验或组织级运行配置写成本仓核心对象。
- 下一模块只允许进入“外围包与方法集组织:再写入”,为上述四个对象写概要级对象小节和停审记录;不得跳到反查清单或后续 Step。

### 5.18 外围包与方法集组织:再写入

#### 5.18.1 MethodPackage

##### 5.18.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | peripheral aggregate / truth candidate |
| 主要责任 | 承载围绕已成立核心方法资产的外围包组织语义。 |
| 来源 | Step 5 `MethodPackage`;`FR-ML-E-001`;`FR-ML-E-002`;`BR-ML-E-001`;01 架构外围包 / 方法集组织阶段和核心 / 外围隔离口径。 |

##### 5.18.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| package_ref | MethodPackageRef | 方法资产包稳定引用。 |
| package_identity | MethodPackageIdentity | 包身份与组织语义,不等于 marketplace listing。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 包内引用的方法资产定义集合。 |
| member_formal_version_refs | FormalMethodAssetVersionRefSet | 包内可选正式版本引用集合。 |
| distribution_context_ref | DistributionContextRef | 包组织适用的分发 / 采用上下文。 |
| marketplace_context_ref | OptionalMarketplaceContextRef | 可选生态发现上下文,不承载交易或履约。 |
| composition_rule_ref | PackageCompositionRuleRef | 包组成边界规则引用。 |
| trace_subject_ref | TraceSubjectRef | 包组织变化进入追溯与审计的主体引用。 |

##### 5.18.1.3 状态集合

| 状态 | 作用 |
|---|---|
| PackageDraft | 外围包处于草稿组织语义,不得作为核心前置。 |
| PackageActive | 外围包可用于生态发现或组织采用语境。 |
| PackageScopeLimited | 包只适用于指定组织、分发或 marketplace 上下文。 |
| PackageUnavailable | 包外围语义暂不可用,核心闭环仍成立。 |
| PackageRetired | 包退出当前外围语境,历史追溯仍需保留。 |

##### 5.18.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_members(MethodAssetDefinitionRefSet member_definition_refs) | 校验包成员均为正式 typed ref。 |
| assert_composition(PackageCompositionRule composition_rule) | 校验包组成不越过核心定义、正式化和分发边界。 |
| attach_distribution_context(DistributionContextRef distribution_context_ref) | 绑定包的分发或采用上下文。 |
| mark_unavailable(PeripheralUnavailableReasonRef reason_ref) | 表达外围包不可用但核心闭环不受影响。 |

##### 5.18.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| draft(MethodPackageRef package_ref, MethodPackageIdentity package_identity) | 建立外围包草稿语义。 |
| active(MethodPackageRef package_ref, PackageCompositionRuleRef composition_rule_ref) | 在组成规则满足后激活外围包。 |
| scope_limited(MethodPackageRef package_ref, DistributionContextRef distribution_context_ref) | 建立限定上下文的外围包。 |

##### 5.18.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为核心前置 | package 不影响 definition、formal version、consumption 或 trace consistency 是否成立。 |
| 不表示 marketplace listing | 上架、定价、订单、购买、结算、安装、履约和退款不属于本对象。 |
| 不保存包正文 | 安装包、artifact、archive、package payload 和外部 package storage 内容不得进入本对象。 |
| 不覆盖核心定义 | 包成员只能引用核心方法资产,不得创建或改写方法资产定义 truth。 |

#### 5.18.2 MethodSetAssembly

##### 5.18.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | peripheral aggregate / truth candidate |
| 主要责任 | 承载组织级方法集组装语义,表达组织采用或复用一组方法资产的外围结构。 |
| 来源 | Step 5 `MethodSetAssembly`;`FR-ML-E-001`;`FR-ML-E-003`;`BR-ML-E-001`;01 架构方法资产包与方法集组织语义。 |

##### 5.18.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| assembly_ref | MethodSetAssemblyRef | 组织级方法集组装引用。 |
| assembly_identity | MethodSetAssemblyIdentity | 方法集身份和组织语境。 |
| package_refs | MethodPackageRefSet | 参与组装的方法资产包引用集合。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 直接参与组装的方法资产定义引用集合。 |
| member_distribution_refs | MethodAssetDistributionRefSet | 参与组装的分发语义引用集合。 |
| organization_context_ref | MethodSetOrganizationContextRef | 组织级采用语境,不保存 UI 或运行配置正文。 |
| composition_rule_ref | PackageCompositionRuleRef | 组装边界规则引用。 |
| trace_subject_ref | TraceSubjectRef | 组装变化进入追溯与审计的主体引用。 |

##### 5.18.2.3 状态集合

| 状态 | 作用 |
|---|---|
| AssemblyDraft | 方法集组装处于草稿外围语义。 |
| AssemblyActive | 方法集组装可用于组织采用或外围发现。 |
| AssemblyScopeLimited | 方法集只适用于指定组织或分发语境。 |
| AssemblyUnavailable | 方法集外围语义暂不可用,核心闭环仍成立。 |
| AssemblyRetired | 方法集退出当前外围语境,历史追溯仍需保留。 |

##### 5.18.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| attach_package(MethodPackageRef package_ref) | 将外围包纳入方法集组装。 |
| attach_definition(MethodAssetDefinitionRef definition_ref) | 将核心定义引用纳入方法集组装。 |
| assert_composition(PackageCompositionRule composition_rule) | 校验方法集没有覆盖核心定义、版本和消费边界。 |
| mark_unavailable(PeripheralUnavailableReasonRef reason_ref) | 表达方法集不可用但核心闭环不受影响。 |

##### 5.18.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| draft(MethodSetAssemblyRef assembly_ref, MethodSetAssemblyIdentity assembly_identity) | 建立组织级方法集草稿语义。 |
| active(MethodSetAssemblyRef assembly_ref, PackageCompositionRuleRef composition_rule_ref) | 在组成规则满足后激活方法集组装。 |
| scope_limited(MethodSetAssemblyRef assembly_ref, MethodSetOrganizationContextRef organization_context_ref) | 建立限定组织语境的方法集组装。 |

##### 5.18.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代正式版本 | 方法集组装不能把非正式定义变成正式可消费版本。 |
| 不覆盖消费边界 | 组织级采用语境不能绕过 `DownstreamConsumptionBoundary`。 |
| 不保存 UI / console 状态 | 前端体验、选择器、会话、偏好和配置正文不属于本对象。 |
| 不成为高级策略主线 | ViewProfile 匹配、AIPolicy override 和标准映射深化留后续范围裁决。 |

#### 5.18.3 PackageCompositionRule

##### 5.18.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | policy / invariant |
| 主要责任 | 约束方法资产包和组织级方法集的成员引用、正式化边界、分发上下文和外围不可反写不变量。 |
| 来源 | Step 5 `PackageCompositionRule`;`MethodSetAssemblyRule`;`BR-ML-E-001`;`BR-ML-003`;`BR-ML-008`;01 架构核心 / 外围隔离 ADR。 |

##### 5.18.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | PackageCompositionRuleRef | 包组成规则引用。 |
| allowed_member_kind_set | PackageMemberKindSet | 允许进入 package / set 的成员类别。 |
| required_core_ref_kind_set | CoreMethodAssetRefKindSet | 要求成员必须使用的核心 typed ref 类别。 |
| allowed_distribution_context_set | DistributionContextRefSet | 允许的分发或组织上下文集合。 |
| forbidden_peripheral_write_set | PeripheralForbiddenWriteKindSet | 禁止外围组织反写核心 truth 的类别集合。 |
| boundary_reason_ref | PackageCompositionBoundaryReasonRef | 组成规则成立或拒绝的安全原因引用。 |

##### 5.18.3.3 状态集合

| 状态 | 作用 |
|---|---|
| RuleActive | 当前规则可用于 package / set composition 判断。 |
| RuleSuperseded | 规则被新规则替代,历史 package / set 判断仍需可解释。 |
| RuleDisabled | 规则不可用于新的外围组织判断。 |

##### 5.18.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate_package(MethodPackage package) | 判断方法资产包组成是否满足规则。 |
| evaluate_assembly(MethodSetAssembly assembly) | 判断方法集组装是否满足规则。 |
| reject_unstable_member(MethodAssetDefinitionRef definition_ref) | 拒绝未成立或不可引用的核心成员。 |
| reject_marketplace_boundary(MarketplaceContextRef marketplace_context_ref) | 拒绝 marketplace 交易或履约事实进入外围组织语义。 |

##### 5.18.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| default_peripheral_rule(PackageCompositionRuleRef rule_ref) | 建立外围包 / 方法集默认组成规则。 |
| for_distribution_context(PackageCompositionRuleRef rule_ref, DistributionContextRef distribution_context_ref) | 建立特定分发上下文下的组成规则。 |

##### 5.18.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不执行 marketplace 校验 | 本规则只表达本仓边界,不查询交易、安装或履约系统。 |
| 不保存配置矩阵 | 组织级配置、profile、策略开关和 UI 选项留后续配置设计。 |
| 不替代正式化 eligibility | 组成规则通过不等于方法资产正式化成立。 |
| 不执行图算法 | package / set 的推荐、排序、相似度和搜索算法不属于本对象。 |

#### 5.18.4 MethodPackageRef

##### 5.18.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | reference object / boundary object |
| 主要责任 | 为方法资产包和外围生态发现提供稳定 typed ref,防止 package 引用退化为文件路径或 marketplace id。 |
| 来源 | Step 5 `MethodPackageRef`;`MarketplaceContextRef`;`FR-ML-E-001`;`FR-ML-E-002`;`BR-ML-E-001`;typed ref / boundary 线索。 |

##### 5.18.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| ref_value | MethodPackageRefValue | opaque package reference 值。 |
| package_namespace_ref | MethodPackageNamespaceRef | 限定 package 引用命名空间。 |
| package_kind | MethodPackageKind | 表达外围包类别,不等于 marketplace 商品类别。 |
| marketplace_context_ref | OptionalMarketplaceContextRef | 可选生态发现上下文,不承载交易或履约。 |
| boundary_marker | PeripheralBoundaryMarker | 标记该 ref 只表达外围增强边界。 |

##### 5.18.4.3 状态集合

| 状态 | 作用 |
|---|---|
| not_applicable | reference object 无独立业务生命周期;其有效性由 `MethodPackage` 和外围状态解释。 |

##### 5.18.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_namespace(MethodPackageNamespaceRef package_namespace_ref) | 校验 package 引用没有跨命名空间漂移。 |
| assert_kind(MethodPackageKind package_kind) | 校验 package 引用类别符合当前外围语境。 |
| assert_peripheral_boundary(PeripheralBoundaryMarker boundary_marker) | 校验 package ref 未被当成核心 definition ref 使用。 |
| reject_listing_id(MarketplaceListingRef listing_ref) | 拒绝 marketplace listing id 替代 package typed ref。 |

##### 5.18.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_package_identity(MethodPackageIdentity package_identity) | 从正式 package 身份建立 typed ref。 |
| from_existing_ref(MethodPackageRef package_ref) | 接收既有 package typed ref,避免重新拼接。 |

##### 5.18.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不从路径或 listing 私造 | package file path、listing id、marketplace id、URL、route param 或外部 id 不得直接替代 typed ref。 |
| 不携带包正文 | package payload、安装包、artifact、archive 和外部正文不得进入 ref。 |
| 不表达交易或履约 | 购买、订阅、授权、安装、交付和退款状态不属于 package ref。 |
| 不替代 definition ref | 当上下文需要 `MethodAssetDefinitionRef` 时,不能用 package ref 弱化类型。 |

停审记录:

- 候选是否处理完: pass。`MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule` 和 `MethodPackageRef` 已完成概要级对象小节。
- 并入对象是否有承接: pass。`MethodSetAssemblyRule` 已并入 `PackageCompositionRule`;`MethodPackageView` 已归入 `MethodPackage`;`MethodSetAssemblyView` 已归入 `MethodSetAssembly`;`MarketplaceContextRef` 已作为字段类型承接;`PackageAssemblyHistory` 已归入 package / set 与 trace / audit 线索。
- 对象是否有功能来源: pass。四个对象均回指 Step 5、`FR-ML-E-001/002/003`、`BR-ML-E-001` 和 01 架构外围增强与核心闭环隔离口径。
- 接缝是否清楚: pass。核心 definition/formal version/relation/distribution 输入、package/set 外围组织、marketplace context 和 typed package ref 边界已分开表达。
- 是否越界: pass。未写 repository、port、DTO、handler、job、worker、database table、协议 schema、package schema、method set schema、marketplace listing、交易状态、安装状态、UI/console 状态或 adapter 实现。
- 下一步只允许进入“与 Step 8 / Step 9 反查清单”,不得跳到跨对象一致性审计、旧材料差异审计或 Step 7。

---

### 5.19 与 Step 8 / Step 9 反查清单:先思考

问题回答:

- 本模块只做对象覆盖反查,不提前定义 Step 8 的处理流步骤,也不提前定义 Step 9 的状态迁移矩阵。
- Step 8 预计会围绕定义目录、正式化版本、受控消费、追溯一致性、关系分发、外部摘要、维护收敛和外围组织形成处理流。每个处理流使用的对象主语必须已经在 Step 6 独立定义,或在本模块说明为何只是字段类型 / 后续接口主语。
- Step 9 预计会围绕定义状态、目录状态、正式化状态、可用性状态、追溯 / 影响 / 保护状态、关系 / 分发状态、外部依据承接状态、维护任务状态和外围 package / assembly 状态形成状态族。状态 owner 必须回到 Step 6 的对象小节,不得在 Step 9 临场新增对象。

诊断:

- 8 个组成部分的核心对象已经全部落到 Step 6:定义与目录 4 个、正式化与版本 4 个、受控消费 4 个、追溯一致性 5 个、关系分发 3 个、外部摘要 4 个、后台维护 4 个、外围组织 4 个。
- 后续 Step 8 若需要 command / query / event / job / repository / port 名称,这些名称不应回填为 Step 6 关键对象。Step 6 已保留 object / policy / guard / ref / task / view 主语,足以支撑 Step 7/8 继续展开。
- 后续 Step 9 的状态不应脱离对象成为全局散列表。当前有状态的对象已经提供状态集合轮廓;reference object 无独立生命周期的情况也已在对象小节中写明 `not_applicable`。
- 历史 Step 8 / Step 9 文件仍属于旧材料,不能作为当前反查真相源。它们若含旧 `MethodContent`、fingerprint、snapshot、outbox 或旧 A-H 主语,只能在旧材料差异审计中处理。

取舍:

- 当前反查按“预计后续家族”组织,不是按旧文件现有章节组织。这样能避免旧 Step 8 / Step 9 把历史机制反向带回当前 Step 6。
- 若某个预计处理流只需要 typed ref 或 field marker,但该 ref / marker 承担边界责任,本 Step 已把 `MethodAssetDefinitionRef`、`TraceSubjectRef`、`ExternalSourceRef`、`ArtifactArchiveRef`、`MethodPackageRef` 等保留为独立 reference / boundary object。
- 若某个预计状态只是 read model freshness、availability 或 maintenance progress,Step 6 只固定状态集合和 owner;完整触发、允许迁移和禁止迁移留 Step 9。

复杂度 / 越界检查:

- 本模块未写 Step 7 接口、Step 8 处理步骤、Step 9 状态迁移、错误码、repository、port、DTO、event、job、数据库表或实现逻辑。
- 未读取旧 Step 8 / Step 9 作为当前对象来源。
- 下一模块只允许写反查清单表,不得跳到跨对象一致性审计或旧材料差异审计。

### 5.20 与 Step 8 / Step 9 反查清单:再写入

#### 5.20.1 Step 8 预计处理流对象反查

| 预计 Step 8 处理流家族 | 必须使用的 Step 6 对象 | 覆盖结论 | 后续注意 |
|---|---|---|---|
| 方法资产定义建立 / 调整 / 目录识别 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView` | pass | 处理流不得用旧 `MethodContent` 或外部文档路径替代 definition/ref。 |
| 方法资产正式化与版本稳定 | `FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationState`;`FormalizationEligibilityRule` | pass | 处理流可使用依据摘要和资格规则,但不得保存治理执行正文或外部标准正文。 |
| 正式消费材料读取与边界判断 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | pass | 处理流不得把下游使用事实、鉴权矩阵或运行同步状态写成本仓 truth。 |
| 变化追溯、影响摘要与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`TraceSubjectRef` | pass | 处理流必须保持 body-free trace / audit / impact 语义,不得落 raw log 或下游运行状态。 |
| 方法资产关系维护与分发语义判断 | `MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule` | pass | 处理流不得把推荐图、runtime 依赖图或 marketplace 安装履约写成关系 truth。 |
| 外部依据摘要与引用承接 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule` | pass | 处理流必须只承接摘要 / ref / guard,不得读取后保存外部正文、artifact 正文或 archive 包。 |
| 读取材料刷新、追溯材料刷新和一致性恢复 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | pass | 处理流可以展开 job / task 入口,但不得让维护路径创建新的定义 truth 或绕过正式化。 |
| 外围 package / method set 组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef` | pass | 处理流必须保持外围增强性质,不得让 package / set 成为核心闭环前置。 |

#### 5.20.2 Step 9 预计状态族对象反查

| 预计 Step 9 状态族 | Step 6 状态 owner | 覆盖结论 | 后续注意 |
|---|---|---|---|
| 定义 / 目录生命周期 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetCatalogView` | pass | Step 9 需区分 definition truth 状态与 catalog view freshness,不得混为一个状态机。 |
| 正式化与正式版本状态 | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationEligibilityRule` | pass | Step 9 需说明 Draft / Pending / Formalized / Rejected / Superseded 等状态与版本状态的关系。 |
| 消费材料与可用性状态 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | pass | Step 9 需区分消费材料 stale/unavailable 与来源 definition/formal version truth。 |
| 追溯、影响和保护状态 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail` | pass | Step 9 不得把 audit stale、impact pending 或 protection pending 写成下游运行状态。 |
| 关系与分发状态 | `MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule` | pass | Step 9 需说明 relation active/superseded/deprecated 与 distribution ref active/deprecated 的传播边界。 |
| 外部依据承接状态 | `ExternalSourceSummary`;`ExternalBodyBoundaryRule` | pass | `ExternalSourceRef` / `ArtifactArchiveRef` 无独立生命周期;状态由 summary / rule 解释。 |
| 维护任务和进度状态 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | pass | Step 9 需固定 pending/in progress/converged/unavailable/failed 等状态不改写核心 truth。 |
| 外围 package / set 状态 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule` | pass | `MethodPackageRef` 无独立生命周期;外围 unavailable 不影响核心定义闭环。 |

#### 5.20.3 未定义对象风险反查

| 风险来源 | 当前判断 | 处理口径 |
|---|---|---|
| Step 8 可能需要接口 / port / repository 主语 | 不属于 Step 6 关键对象缺口 | 留 Step 7 接口骨架和 Step 8 flow 展开;不得回填成领域对象。 |
| Step 8 可能需要 event / job / worker 主语 | 不属于 Step 6 关键对象缺口 | 维护 task 已有对象 owner;具体 job / worker / event 名称后续讨论。 |
| Step 9 可能需要全局状态对象 | 当前不新增全局状态对象 | 状态必须归属已有对象;若 Step 9 发现跨对象状态传播,先写传播关系,不新增 global object。 |
| 旧 Step 8 / Step 9 使用旧对象名 | historical material 风险 | 留“旧材料差异审计”处理,不得作为当前反查失败。 |

停审记录:

- Step 8 预计对象是否均已定义: pass。8 个预计处理流家族均能回指 Step 6 已定义对象。
- Step 9 预计状态 owner 是否闭合: pass。预计状态族均有 Step 6 owner;reference object 无生命周期处已由对应 truth / summary / rule 解释。
- 是否发现必须新增对象: no。当前没有为 Step 8 / Step 9 额外新增对象的必要。
- 是否越界: pass。未写接口、处理步骤、状态迁移矩阵、错误恢复、repository、port、DTO、event、job、worker、DDL 或实现逻辑。
- 下一步只允许进入“跨对象一致性审计”,不得跳到旧材料差异审计或 Step 7。

---

### 5.21 跨对象一致性审计:先思考

问题回答:

- 跨对象一致性审计要确认 Step 6 已定义对象之间没有重复职责、归属冲突、名称漂移、孤儿对象或隐含第二 truth。
- 本审计只基于当前 Step 5 候选池、当前 Step 6 对象小节和当前 00 / 01 输入。旧 Step 6、旧 DDD 和旧概要材料仍然不得作为当前对象正确性的来源。
- 若发现对象只是字段类型或后续接口主语,需要在审计中标注是否已由筛选表处理;若发现对象应独立展开但遗漏,必须回到对象小节补齐,不能留给 Step 7/8/9 临场发明。

诊断:

- 当前对象集按 8 个组成部分组织,每部分都有 3~5 个正式对象。对象数量较多,主要风险不是遗漏主语,而是同一语义在 truth、view、summary、ref、policy 之间边界不清。
- read material / view 类对象最容易被误当成第二 truth。`MethodAssetCatalogView`、`MethodAssetAvailabilityView`、`MaintenanceProgressView` 等都必须保持派生读取材料地位。
- reference / boundary 类对象最容易被降级为字符串。`MethodAssetDefinitionRef`、`TraceSubjectRef`、`ExternalSourceRef`、`ArtifactArchiveRef`、`MethodPackageRef` 已独立成节,能防止后续接口用路径、URL、listing id 或 route param 替代。
- policy / guard 类对象分布在多个部分,名称需要防漂移。正式化、消费边界、一致性保护、关系完整性、外部正文边界和 package composition 各自服务不同边界,不能合并成一个泛化 `Policy`。

取舍:

- 不新增全局 `MethodAssetState`、`MethodAssetLifecycle` 或 `MethodAssetObject`。状态归属于具体对象,跨对象传播留 Step 9 表达。
- 不新增全局 `MethodAssetReference`。不同 ref 的边界不同:definition ref、trace subject、external source ref、artifact archive ref、distribution ref、package ref 不应被统一弱化。
- 不把 maintenance task 与 business truth 混合。维护对象只表达刷新 / 恢复 / 进度,不创建定义、正式版本、关系或外部摘要 truth。
- 外围 package / set 对象保留,但它们不参与核心闭环前置;后续正式文档必须持续标注外围增强。

复杂度 / 越界检查:

- 本模块只做审计判断,未新增对象字段、状态迁移、接口、处理流、仓储、协议、事件或实现细节。
- 下一模块只允许写跨对象一致性审计表,不得跳到旧材料差异审计或 Step 7。

### 5.22 跨对象一致性审计:再写入

#### 5.22.1 重复对象与职责重叠审计

| 审计项 | 涉及对象 | 结论 | 处理口径 |
|---|---|---|---|
| definition truth vs formal version truth | `MethodAssetDefinition`;`FormalMethodAssetVersion`;`FormalizationState` | pass | definition 负责定义主体和身份;formal version 负责进入正式使用语境后的稳定版本;formalization state 只表达正式化状态词表。 |
| catalog entry vs catalog view | `MethodAssetCatalogEntry`;`MethodAssetCatalogView` | pass | catalog entry 是目录语义对象;catalog view 是派生读取材料,不得成为第二目录 truth。 |
| consumption material vs availability view | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView` | pass | consumption material 是正式消费材料边界;availability view 是读取状态视图,不得替代正式消费材料。 |
| trace material vs audit trail | `MethodAssetTraceMaterial`;`MethodAssetAuditTrail`;`TraceSubjectRef` | pass | trace material 表达变化 / 依据 / 消费语境线索;audit trail 组织审计可读线索;subject ref 只做 typed anchor。 |
| impact summary vs consistency policy | `ConsumptionImpactSummary`;`ConsistencyProtectionPolicy` | pass | impact summary 承接下游影响摘要;policy 决定保护口径,不得互相替代。 |
| relation vs distribution | `MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule` | pass | relation 是定义性关系 truth;distribution ref 是分发语义边界;integrity rule 校验关系端点。 |
| external summary vs external ref / archive ref | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule` | pass | summary 承接安全摘要;refs 只表达引用边界;boundary rule 统一禁止正文进入。 |
| refresh task vs recovery task | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | pass | refresh task 处理派生材料刷新;recovery task 处理一致性恢复语义;progress view 是读取材料。 |
| package vs method set | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef` | pass | package 和 set 都是外围组织对象,但 package 侧重资产包,set 侧重组织级组装;composition rule 只约束组成。 |

#### 5.22.2 对象归属与边界审计

| 对象类别 | 归属是否清楚 | 风险 | 处理口径 |
|---|---|---|---|
| 核心 truth | pass | definition、formal version、relation、package/set truth 可能被下游运行状态污染 | 后续 Step 7/8/9 必须继续排除 process / identity / runtime / marketplace 运行 truth。 |
| read model / material | pass | view / material 可能被当成第二 truth | 对象小节均已标注派生来源和非 truth;Step 8/9 继续保持。 |
| summary / external basis | pass | 外部摘要可能保存正文 | `ExternalBodyBoundaryRule` 已统一禁止正文;summary 只保存安全摘要和 ref。 |
| reference / boundary object | pass | ref 可能被 route、URL、listing id 或文件路径替代 | typed ref 已独立成节;后续接口必须使用这些 ref,不得改成字符串。 |
| policy / guard | pass | 多个 policy 被泛化成一个公共策略对象 | 各 policy 已按边界拆分,不新增 global policy。 |
| maintenance task | pass | 维护任务可能隐式修复或创建业务 truth | task 对象已写明不创建 truth、不绕过正式化和消费边界。 |
| peripheral package/set | pass | 外围对象可能成为核心闭环前置 | 对象小节已标注外围增强;正式文档必须继续保留该边界。 |

#### 5.22.3 名称漂移审计

| 名称族 | 当前正式名称 | 禁止漂移方向 | 结论 |
|---|---|---|---|
| 方法资产定义 | `MethodAssetDefinition`;`MethodAssetDefinitionRef` | 旧 `MethodContent`、文件路径、markdown 文档名、下游私有 method id | pass |
| 正式化 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary` | approval result、governance execution、version hash、snapshot | pass |
| 消费 | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | consumer copy、runtime use record、authorization matrix | pass |
| 追溯 / 审计 | `MethodAssetTraceMaterial`;`MethodAssetAuditTrail`;`TraceSubjectRef` | raw log、telemetry trace id、audit table row、event payload | pass |
| 关系 / 分发 | `MethodAssetRelation`;`MethodAssetDistributionRef` | recommendation edge、runtime dependency、marketplace installation | pass |
| 外部引用 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef` | external body、artifact body、archive package、URL string | pass |
| 维护 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` | worker loop、cron job、retry queue、outbox task | pass |
| 外围组织 | `MethodPackage`;`MethodSetAssembly`;`MethodPackageRef` | marketplace listing、transaction、installation package | pass |

#### 5.22.4 孤儿对象审计

| 对象 | 是否有 Step 5 来源 | 是否有 00 / 01 功能来源 | 是否有后续承接 | 结论 |
|---|---|---|---|---|
| 8 个组成部分的正式关键对象 | yes | yes | Step 7/8/9/12 | pass |
| typed ref / boundary 对象 | yes | yes | Step 7 接口骨架和 Step 8 flow | pass |
| policy / guard 对象 | yes | yes | Step 8 guard / Step 9 状态前置 | pass |
| read model / material 对象 | yes | yes | Step 7 query / Step 8 read flow / Step 9 freshness | pass |
| audit / trace / history 对象 | yes | yes | Step 8 trace / audit flow / Step 12 DDD handoff | pass |
| maintenance task / progress 对象 | yes | yes | Step 8 maintenance flow / Step 9 task state | pass |
| peripheral package / set 对象 | yes | yes | 后续外围增强接口 / 流程 / 状态 | pass |

停审记录:

- 重复对象是否存在 unresolved 冲突: no。相近对象已通过 truth / view / summary / ref / policy / task 边界分离。
- 归属是否冲突: no。每个对象均能回指 Step 5 组成部分。
- 名称是否漂移: no。已列出禁止漂移方向,当前 Step 6 未恢复旧 `MethodContent`、fingerprint、snapshot、outbox 或 marketplace 履约主语。
- 是否存在孤儿对象: no。所有正式对象均有 Step 5 来源、00 / 01 功能来源和后续承接位置。
- 是否越界: pass。未写接口、处理流、状态迁移、存储、协议或实现细节。
- 下一步只允许进入“旧材料差异审计”,不得跳到 Step 7。

---

### 5.23 旧材料差异审计:先思考

问题回答:

- 本模块只把旧材料作为污染检查输入,不把旧材料作为当前对象来源。
- 需要审计的历史材料包括旧 `02-概要设计.md`、历史 `02_hld_step_08_processing_flows.md`、历史 `02_hld_step_09_state_machine.md` 和历史 `03_ddd_step_06_object_contracts.md`。
- 旧材料中出现的 `MethodContent`、7 类 P0 payload、fingerprint、snapshot、outbox、P1 plugin / configuration、PostgreSQL / object storage 等机制,只能作为“不得恢复”的历史口径记录。

诊断:

- 旧正式 `02-概要设计.md` 明确以 7 类 P0 `MethodContent`、fingerprint、snapshot、audit、outbox 和 P1 `MethodPlugin` / `MethodConfiguration` 为主线。这与本轮 00 / 01 重新收束后的“方法资产定义、正式化版本、受控消费、追溯一致性、外部摘要、维护收敛、外围组织”主线不一致。
- 历史 Step 8 仍包含 `CreateMethodContentDraft`、`PublishMethodContent`、`OutboxEvent`、`DefinitionSnapshot`、`Fingerprint`、`RebuildDefinitionIndex` 等旧处理流主语。当前 Step 6 不能为了兼容这些旧 flow 而恢复旧对象。
- 历史 Step 9 仍以 `MethodContentLifecycle` 和 `OutboxEventStatus` 为核心状态机。当前 Step 9 应从本轮 Step 6 的对象状态集合重新展开,不能沿用旧状态矩阵。
- 历史 DDD Step 6 已下沉到字段、函数签名、object storage、outbox、event envelope、repository / port 等详细设计和实现机制,与当前概要层 Step 6 深度不匹配。

取舍:

- 旧 `MethodContent` 不作为当前对象别名。当前统一使用 `MethodAssetDefinition` 表达定义 truth。
- 旧 `ContentVersion` / `CanonicalFingerprint` / `DefinitionSnapshot` 不直接恢复。当前正式化和版本语义由 `FormalMethodAssetVersion`、`FormalizationState`、`FormalizationBasisSummary` 和追溯 / 外部摘要对象承接。
- 旧 `OutboxEvent`、event envelope、relay checkpoint 不进入当前 Step 6。若后续 Step 7/8 需要事件协作,必须从当前对象和接口重新讨论。
- 旧 P1 plugin / configuration 不恢复为核心对象。当前外围组织用 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule` 表达,且不阻塞核心闭环。

复杂度 / 越界检查:

- 本模块没有改写旧文件,只在当前 Step 6 记录污染审计。
- 未把旧对象、旧状态、旧处理流或旧 DDD 字段反向带入当前对象集。
- 下一模块只允许写旧材料差异审计表,不得跳到自检停审或 Step 7。

### 5.24 旧材料差异审计:再写入

#### 5.24.1 历史主语污染检查表

| 历史材料主语 | 出现位置 | 当前处理结论 | 说明 |
|---|---|---|---|
| `MethodContent` / 7 类 P0 payload | 旧 `02-概要设计.md`;历史 Step 8/9;历史 DDD Step 6 | 废弃为当前对象来源 | 当前以 `MethodAssetDefinition` 作为定义 truth,不恢复旧 P0 content 聚合。 |
| `MethodContentLifecycle` | 历史 Step 9;历史 DDD Step 6 | 不恢复 | 当前状态 owner 分散到 `MethodAssetDefinition`、`FormalizationState`、`FormalMethodAssetVersion` 等对象。 |
| `ContentVersion` / `CanonicalFingerprint` | 旧 `02-概要设计.md`;历史 Step 8;历史 DDD Step 6 | 不直接恢复 | 当前版本稳定由 `FormalMethodAssetVersion` 和追溯 / 外部摘要对象承接;是否需要 fingerprint 类机制留后续重新讨论。 |
| `DefinitionSnapshot` / `SnapshotRef` / `SnapshotBlobRef` | 旧 `02-概要设计.md`;历史 Step 8;历史 DDD Step 6 | 不直接恢复 | 当前禁止保存外部正文和 archive 包;artifact/archive 只以 `ArtifactArchiveRef` 表达。 |
| `OutboxEvent` / event envelope / relay checkpoint | 旧 `02-概要设计.md`;历史 Step 8/9;历史 DDD Step 6 | 不进入 Step 6 | 事件协作若需要,应在 Step 7/8 从当前对象重新推导,不得继承旧 outbox 机制。 |
| `AuditRecord` / raw audit log | 旧 `02-概要设计.md`;历史 Step 8;历史 DDD Step 6 | 替换为当前 audit / trace 口径 | 当前使用 `MethodAssetTraceMaterial`、`MethodAssetAuditTrail`、`TraceSubjectRef`,且保持 body-free。 |
| `MethodPlugin` / `MethodConfiguration` / `EffectiveContentSet` | 旧 `02-概要设计.md`;历史 DDD Step 6 | 不恢复为核心对象 | 当前外围组织由 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule` 承接。 |
| PostgreSQL / object storage / blob ref | 历史 DDD Step 6 | 实现机制,当前排除 | 概要 Step 6 不写存储引擎、表结构、blob 指针或 object storage 规则。 |
| `CreateMethodContentDraft` / `PublishMethodContent` 等旧 flow 名 | 历史 Step 8;旧 `02-概要设计.md` | 不作为当前 Step 8 输入 | Step 8 需在 Step 7 完成后按当前对象和接口重新生成。 |
| `OutboxEventStatus` / P1 lifecycle | 历史 Step 9;旧 `02-概要设计.md` | 不作为当前 Step 9 输入 | Step 9 需从当前对象状态集合重新生成状态族。 |

#### 5.24.2 当前对象替代关系表

| 旧材料方向 | 当前 Step 6 替代 / 收束对象 | 替代关系 |
|---|---|---|
| 旧统一 definition content | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef` | 从旧 content 聚合转为方法资产定义和目录语义。 |
| 旧 publish / version / fingerprint | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`FormalizationEligibilityRule` | 从发布机制转为正式化与版本语义。 |
| 旧 snapshot / sync consumption | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary` | 从同步制品转为受控消费材料和边界。 |
| 旧 audit / event / snapshot trace | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`TraceSubjectRef` | 从技术链路追溯转为业务追溯材料和审计线索。 |
| 旧 outbox / replay / rebuild ops | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | 从 outbox/replay 机制转为维护收敛语义。 |
| 旧 P1 plugin/configuration | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef` | 从插件配置转为外围包和方法集组织语义。 |

#### 5.24.3 污染风险结论

| 风险 | 当前结论 | 后续约束 |
|---|---|---|
| 旧对象名回流 | blocked | 后续 Step 7/8/9 不得直接恢复 `MethodContent`、`DefinitionSnapshot`、`OutboxEvent` 等旧主语。 |
| 旧机制回流 | blocked | fingerprint、snapshot、outbox、object storage、PostgreSQL 等机制若后续需要,必须由当前设计重新闭口。 |
| 旧状态矩阵回流 | blocked | Step 9 必须从当前 Step 6 状态集合重新讨论,不得沿用 `MethodContentLifecycle` / `OutboxEventStatus`。 |
| 旧正式文档被误当现行 | blocked | 正式 `02-概要设计.md` 只在 Step 14 重装配,旧正文在此之前均为 historical material。 |

停审记录:

- 是否读取旧材料作后置审计: pass。已检查旧概要、历史 Step 8、历史 Step 9 和历史 DDD Step 6 的主要历史主语。
- 是否让旧材料反推当前对象: no。审计只记录污染风险,未新增当前对象。
- 是否发现当前 Step 6 必须回退修正: no。旧材料差异来自 full-restart 口径变化,不是当前对象缺口。
- 是否越界: pass。未改旧文件,未写接口、流程、状态迁移、存储或实现机制。
- 下一步只允许进入“自检与停审”,不得跳到 Step 7。

---

## H6. Historical: 旧对象正式化写入模板

后续每个组成部分必须先写“先思考”,再写对象小节。单对象小节使用以下模板:

```text
### <对象名>

#### <编号>.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | <Step 5 主要组成部分> |
| 对象类型 | aggregate / entity / value object / state enum / policy / guard / projection / reference object / audit record / history record / task / recovery object |
| 主要责任 | <一句话说明结构责任> |
| 来源 | <Step 5 候选 + 00/01 功能来源> |

#### <编号>.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|

#### <编号>.3 状态集合

| 状态 | 作用 |
|---|---|

#### <编号>.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|

#### <编号>.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|

#### <编号>.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
```

写入约束:

- 字段类型只写概要层类型名,不写 Rust 泛型、serde 名称、数据库列或协议 schema。
- 成员函数 / 工厂函数参数必须写成 `TypeName param_name`;不写返回类型、错误类型或实现逻辑。
- 对象无状态、无成员函数或无工厂函数时可省略对应小节,但必须在停审记录中说明。
- 每个对象必须回指 Step 5 组成部分和功能来源。
- 每个组成部分完成后必须停审:候选是否处理完、排除是否有理由、对象是否越界。

---

## H7. Historical: 旧当前停审

| 检查项 | 当前状态 | 说明 |
|---|---|---|
| 是否已先读取恢复点 | pass | 已读取项目台账、文档 flow 和 Step 5 完成门禁。 |
| 是否已搭建 Step 6 框架 | pass | 已建立 Step 内计划、候选池接收、模块顺序和对象写入模板。 |
| 是否已开始对象正式化结论 | pass | 已完成“对象候选池筛选:先思考 / 再写入”、8 个组成部分对象小节、“与 Step 8 / Step 9 反查清单:先思考 / 再写入”、“跨对象一致性审计:先思考 / 再写入”和“旧材料差异审计:先思考 / 再写入”。 |
| 是否提前修改正式 `02-概要设计.md` | no | 正式文档只在 Step 14 装配。 |
| 是否使用旧材料反推当前结论 | no | 旧 Step 6 只作为 historical material,后置审计前不得参与当前对象筛选。 |

当前停审:

```text
Step 6 开工读取与整体框架已完成。
旧 `02_hld_step_06_key_objects.md` 已重写为本轮 full-restart 框架。
“对象候选池筛选:先思考”已完成。
“对象候选池筛选:再写入”已完成。
“方法资产定义与目录:先思考”已完成。
“方法资产定义与目录:再写入”已完成。
“正式化与版本:先思考”已完成。
“正式化与版本:再写入”已完成。
“受控消费:先思考”已完成。
“受控消费:再写入”已完成。
“追溯与一致性保护:先思考”已完成。
“追溯与一致性保护:再写入”已完成。
“关系与分发语义:先思考”已完成。
“关系与分发语义:再写入”已完成。
“外部摘要与引用:先思考”已完成。
“外部摘要与引用:再写入”已完成。
“后台维护与收敛:先思考”已完成。
“后台维护与收敛:再写入”已完成。
“外围包与方法集组织:先思考”已完成。
“外围包与方法集组织:再写入”已完成。
“与 Step 8 / Step 9 反查清单:先思考”已完成。
“与 Step 8 / Step 9 反查清单:再写入”已完成。
“跨对象一致性审计:先思考”已完成。
“跨对象一致性审计:再写入”已完成。
“旧材料差异审计:先思考”已完成。
“旧材料差异审计:再写入”已完成。
Step 6 完成门禁: pass。
下一步只允许进入 Step 7 开工,先读取 Step 7 必读文档并搭建 `02_hld_step_07_api_interface_skeleton.md` 框架。
不得直接写正式 `02-概要设计.md`,不得跳到 Step 8 或 Step 9。
```

---

## 8. Step 6 重写裁决与历史反查 0R

> 反查触发: Step 5 已在 `02_hld_step_05_components_boundary.md` 的 `0R` 全量重写并回填正式 `02-概要设计.md` §5。虽然本文件已有一轮 Step 6 full-restart 产物,但必须重新核对对象 owner、对象粒度、旧材料污染和 Step 7~9 承接来源。

### 8.1 反查必读文档与整体模块:先思考

#### 8.1.1 必读文档

| 文档 | 读取重点 | 本次反查用途 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前恢复点、全局 blocker、恢复顺序。 | 确认当前只允许进入 Step 6 反查,不得跳到 Step 7~9。 |
| `design-calibration/02_hld_calibration_flow.md` | Step 总任务表、Step 6 状态、Step 7~9 阻塞关系。 | 确认 Step 6 是 `recheck_ready`,后续 Step 必须等待对象 owner 闭合。 |
| `design-calibration/02_hld_step_05_components_boundary.md` `0R.39` | Step 5 完成记录、8 个组成部分、下游反查门禁。 | 作为本次对象反查的第一来源。 |
| `projects/L3-method-library/02-概要设计.md` §5~§6 | 正式 §5 当前结论与正式 §6 旧正文污染。 | 确认正式 §6 仍需后续回填,不能把旧正文视为 truth。 |
| `standards/document/概要设计讨论流程_SOP.md` Step 6 | 关键对象轮廓目标、对象候选池筛选、逐组成部分停审。 | 约束反查必须按 Step 5 候选池和主要组成部分完成。 |
| `standards/document/概要设计书写规范.md` 4.6 | 对象小节格式、字段 / 状态 / 函数骨架边界。 | 检查现有 Step 6 是否越界或缺少必需表。 |
| `standards/document/设计文档讨论中间产物规范.md` 3.5 | 模块级先思考后写入、历史材料后置差异审计。 | 固定本次只先写思考,等待确认后再写入反查结论。 |

#### 8.1.2 问题回答

- 本次不是从零重写 Step 6,而是对已有 Step 6 产物做“Step 5 重写后反查”。判断标准是新 Step 5 的 8 个组成部分、对象发现线索和禁入主语。
- 反查必须回答三个问题:现有 Step 6 对象集是否仍能完整回指新 Step 5;是否存在旧 `MethodContent` / snapshot / fingerprint / outbox / marketplace 履约主语回流;是否足以让 Step 7~9 继续按新对象来源展开。
- 正式 `02-概要设计.md` §6 仍是旧材料污染区,不能在本模块直接回填。正式 §6 回填必须等 Step 6 反查写入结论通过后再进入独立写入动作。
- 当前模块只输出可审查思考记录和反查框架,不改对象字段、不新增对象小节、不进入接口、流程或状态设计。

#### 8.1.3 诊断

- 现有 `02_hld_step_06_key_objects.md` 已包含 8 个组成部分的对象小节,对象主语大体匹配新 Step 5 的组成部分:定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、外部摘要、维护收敛、外围组织。
- 现有 Step 6 文件中保留了对象候选池筛选、逐组成部分先思考 / 再写入、Step 8 / Step 9 反查清单、跨对象一致性审计和旧材料差异审计,结构上符合当前 SOP。
- 风险在于现有 Step 6 曾自称完成并允许进入 Step 7,但文档级 flow 和项目台账已被 Step 5 重写重置为 `recheck_ready`。因此不能直接沿用旧停审结论,必须在本轮重新标注通过、需修正或阻塞项。
- 正式 `02-概要设计.md` §6 仍保留旧 `MethodContent`、`Fingerprint`、`DefinitionSnapshot`、`OutboxEvent` 等主线。即使中间产物 Step 6 通过反查,正式正文仍必须后续单独回填。
- 现有 Step 6 的对象数量较多,但这不是错误本身。当前规范要求未来可能成为 struct / enum / value object / projection / policy / audit record / history record 的候选原则上独立成节;对象多于 300 行不违反批次规则。

#### 8.1.4 取舍

- 反查采用“保留主结构 + 局部修正”的策略:若现有对象能回指新 Step 5,则保留;若名称或边界与新 Step 5 不一致,在下一模块写入修正表;若出现旧主语回流,标记为 blocked 并要求替换。
- 不在本模块新增全仓对象。新增或删除对象只能在“反查:再写入”中通过对象覆盖表、缺口表和停审记录裁决。
- 不提前改 Step 7/8/9。Step 7 只能在 Step 6 反查写入结论通过后启动;Step 8 等 Step 7;Step 9 等 Step 6 和 Step 8。
- 不把正式 §6 回填混入反查思考。正式正文回填必须另设模块,并从 Step 6 反查结论提炼收口内容。

#### 8.1.5 反查模块拆分

| 顺序 | 模块 | 本模块回答 | 输出形态 | 进入条件 |
|---:|---|---|---|---|
| 1 | 反查必读文档与整体模块:先思考 | 需要读什么、反查范围是什么、如何避免直接跳写。 | 本节 `8.1`。 | Step 5 `rewritten_completed`。 |
| 2 | Step 5 -> Step 6 对象覆盖:再写入 | 8 个组成部分的候选对象是否在 Step 6 闭合。 | 覆盖表、缺口表、保留 / 修正裁决。 | 用户确认本节思考。 |
| 3 | L1-governance 式文件拆分框架:先思考 | 是否将 L3 Step 6 拆成主控文件 + 多个对象附录。 | 拆分前思考记录。 | 覆盖表通过。 |
| 4 | L1-governance 式文件拆分框架:再写入 | 固定主控文件、附录文件、对象归属和写入顺序。 | 文件拆分框架表。 | 用户确认拆分思路。 |
| 5 | 对象附录创建与迁移:先思考 | 如何从现有单文件抽取对象卡片,避免一次性大迁移。 | 迁移前思考记录。 | 文件拆分框架通过。 |
| 6 | 对象附录创建与迁移:再写入 | 创建附录框架并按批次迁移对象卡片。 | 附录文件、迁移记录、主控索引更新。 | 用户确认迁移思路。 |
| 7 | 旧主语污染与正式 §6 回填策略:先思考 | 正式 §6 旧正文如何替换,哪些不能进入。 | 回填前思考记录。 | 附录迁移完成。 |
| 8 | 正式 §6 回填草稿:再写入 | 将通过反查的对象结论提炼为正式 §6 草稿。 | 正式 §6 草稿或回填指令。 | 用户确认回填策略。 |
| 9 | flow / 台账更新 | 将 Step 6 反查完成状态写回 flow 和项目台账。 | flow / ledger 更新记录。 | 正式 §6 回填或明确暂不回填后。 |

#### 8.1.6 初步覆盖判断

| Step 5 组成部分 | 现有 Step 6 对象覆盖初判 | 初步结论 | 下一模块需核对 |
|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`。 | pass_candidate | 是否与新 §5 对象发现线索完全一致。 |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationState`;`FormalizationEligibilityRule`。 | pass_candidate | 是否存在 fingerprint / publish 语义残留。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`。 | pass_candidate | 是否与 Definition vs Use 边界保持一致。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`TraceSubjectRef`。 | pass_candidate | 是否仍有 raw audit / event / report body 语义。 |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule`。 | pass_candidate | 是否明确排除 marketplace 交易 / 安装 / 履约。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`。 | pass_candidate | 是否保持 external body / artifact body / archive package 禁入。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`。 | pass_candidate | 是否避免 job / worker / outbox 机制回流。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef`。 | pass_candidate | 是否保持 peripheral,不阻塞核心闭环。 |

#### 8.1.7 越界检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否直接回填正式 §6 | no | 本模块只写反查思考。 |
| 是否新增对象字段或函数 | no | 仅列出现有对象覆盖初判。 |
| 是否进入 Step 7/8/9 | no | 后续 Step 继续 blocked_by_step6_recheck。 |
| 是否使用旧材料反推对象 | no | 旧正式 §6 只作为污染区,不是对象来源。 |
| 是否违反批次规则 | no | 本次写入是反查思考批次,不是限制最终 Step 6 长度。 |

停审记录:

- 必读文档是否明确: pass。已列出项目台账、文档 flow、Step 5 `0R.39`、正式 §5~§6 和三份规范。
- 反查范围是否明确: pass。只反查 Step 6 对象 owner / 覆盖 / 污染 / 后续承接,不写接口、流程、状态。
- 是否允许进入下一模块: pass。下一模块只能进入“Step 5 -> Step 6 对象覆盖:再写入”。
- 是否允许直接进入正式 §6 回填或 Step 7: blocked。必须先完成覆盖表和缺口裁决。

next_allowed_action: 等待用户确认后进入“Step 6 关键对象轮廓反查:再写入”;不得直接回填正式 §6,不得进入 Step 7、Step 8 或 Step 9。

### 8.2 Step 5 -> Step 6 对象覆盖:再写入

#### 8.2.1 覆盖裁决总表

| Step 5 组成部分 | 新 §5 对象发现线索 | 现有 Step 6 承接位置 | 覆盖裁决 | 后续处理 |
|---|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`DefinitionBoundaryRule` | `5.4.1`~`5.4.4`;`MethodAssetDefinition.assert_definition_boundary(...)`;`DownstreamConsumptionBoundary`。 | pass_with_supplement | 四个核心对象已独立展开;`DefinitionBoundaryRule` 作为 definition invariant / boundary guard 补充裁决,不独立成对象。 |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`FormalizationEligibilityRule`;`VersionTransitionInvariant` | `5.6.1`~`5.6.4`;`VersionStabilityRule` 并入 `FormalMethodAssetVersion`。 | pass_with_supplement | `VersionTransitionInvariant` 与现有 `VersionStabilityRule` 同义收束,正式 §6 回填时统一写入版本边界 / invariant。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`ConsumptionContextRef`;`DefinitionVsUseRule` | `5.8.1`~`5.8.4`;`ConsumptionContextRef` 作为 typed ref 字段;`DefinitionUseBoundaryGuard`。 | pass_with_supplement | `DefinitionVsUseRule` 正式映射为 `DefinitionUseBoundaryGuard` / boundary invariant;`ConsumptionContextRef` 不独立成节。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`;`ConsistencyProtectionRule` | `5.10.1`~`5.10.5`;`MethodAssetEvidenceLineage` 并入 trace / audit;`ConsistencyProtectionPolicy`。 | pass_with_supplement | `ConsistencyProtectionRule` 统一映射为 `ConsistencyProtectionPolicy`;lineage 只保存 ref / marker / summary。 |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetDistributionContext`;`MethodAssetDistributionRef`;`RelationIntegrityRule`;`DistributionContextView` | `5.12.1`~`5.12.3`;`DistributionContextRef` 并入 `MethodAssetDistributionRef`;relation 读取形态并入 relation / distribution ref。 | pass_with_supplement | `MethodAssetDistributionContext` 不独立成 truth,以 `MethodAssetDistributionRef` + `DistributionContextRef` 表达;`DistributionContextView` 作为读取形态回填。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`;`ExternalBodyBoundaryRule`;`ExternalReferenceValidityView` | `5.14.1`~`5.14.4`;`GovernanceBasisRef` 作为字段;外部可用 / 过期状态在 summary / boundary 中表达。 | pass_with_supplement | `ExternalReferenceValidityView` 需在正式 §6 回填时作为 `ExternalSourceSummary` 的 read model / view 形态补充说明。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceRunRef`;`MaintenanceProgressView`;`MaterialConvergencePolicy` | `5.16.1`~`5.16.4`;`MaintenanceRunRef` 作为字段;convergence rule 并入 recovery task。 | pass_with_supplement | `MaterialConvergencePolicy` 统一映射为 `ConsistencyRecoveryTask` 的 convergence / recovery invariant。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`MethodPackageView`;`MethodSetAssemblyView`;`MarketplaceContextRef`;`PackageCompositionRule` | `5.18.1`~`5.18.4`;package / set view 已并入对应对象;`MarketplaceContextRef` 作为字段。 | pass | 现有 Step 6 覆盖完整,保持 peripheral;不得升级为 core truth 或 marketplace 履约。 |

#### 8.2.2 命名差异与合并裁决

| 新 §5 名称 | 现有 Step 6 名称 / 承接 | 裁决 | 理由 |
|---|---|---|---|
| `DefinitionBoundaryRule` | `MethodAssetDefinition` invariant;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | merged | 定义边界跨 definition 和 consumption boundary,不需要单独 truth 对象。 |
| `VersionTransitionInvariant` | `VersionStabilityRule`;`FormalMethodAssetVersion.assert_version_semantics_stable(...)` | rename_merge | 当前 Step 6 已覆盖版本稳定边界;正式 §6 回填使用“版本迁移 / 稳定 invariant”统一口径。 |
| `DefinitionVsUseRule` | `DefinitionUseBoundaryGuard` | rename_merge | 二者表达同一防护边界;保留 guard 名称更适合 Step 7 / Step 8 承接。 |
| `ConsistencyProtectionRule` | `ConsistencyProtectionPolicy` | rename_merge | 现有 Step 6 已把保护口径作为 policy / guard 对象展开。 |
| `MethodAssetEvidenceLineage` | `MethodAssetTraceMaterial.evidence_lineage_refs`;`MethodAssetAuditTrail` | merged | evidence lineage 是 body-free lineage 线索,不独立拥有 truth。 |
| `MethodAssetDistributionContext` | `MethodAssetDistributionRef`;`DistributionContextRef` | merged | 分发上下文是 support boundary / ref,不是 marketplace 或 runtime truth。 |
| `DistributionContextView` | `MethodAssetRelation` / `MethodAssetDistributionRef` 的读取形态 | merged_as_view | 只作为读取材料,不得成为第二 truth。 |
| `ExternalReferenceValidityView` | `ExternalSourceSummary` state;`ExternalBodyBoundaryRule` | needs_formal_supplement | 现有 Step 6 有状态和 boundary 语义,但正式 §6 回填时应显式点名 validity view 形态。 |
| `MaterialConvergencePolicy` | `ConsistencyRecoveryTask`;`MaintenanceProgressView` | merged | convergence 是 recovery task 的 invariant 和 progress view 的读取语义。 |
| `MethodPackageView`;`MethodSetAssemblyView` | `MethodPackage`;`MethodSetAssembly` | merged_as_view | 只作为外围读取材料,不独立成 truth。 |
| `MarketplaceContextRef` | `MethodPackage`;`MethodSetAssembly`;`MethodPackageRef` 字段 | field_ref | 只表达生态发现上下文,不得承载交易、安装、履约。 |

#### 8.2.3 缺口裁决

| 缺口项 | 裁决 | 处理 |
|---|---|---|
| 是否存在 Step 5 对象线索完全未承接 | no_blocker | 所有新 §5 线索均已由独立对象、并入对象、字段类型或 view 形态承接。 |
| 是否需要重写整个 Step 6 文件 | no | 现有 Step 6 主结构和逐组成部分对象小节可保留。 |
| 是否需要局部补充裁决 | yes | 本节 `8.2.1` / `8.2.2` 作为补充裁决来源,后续正式 §6 回填必须采用。 |
| 是否允许直接进入 Step 7 | blocked | Step 6 文件拆分框架和正式 §6 回填策略尚未闭合。 |
| 是否允许直接回填正式 §6 | blocked_until_split_framework | 需先按 L1-governance 框架裁决主控文件 + 对象附录拆分。 |

#### 8.2.4 后续正式 §6 回填约束

| 回填要求 | 说明 |
|---|---|
| 使用新 8 个组成部分作为对象分组 | 不恢复旧“方法定义生命周期与发布治理 / 方法定义真相与规则”等旧标题。 |
| 使用 Step 6 现有对象小节作为主体 | 保留已展开的对象基本信息、字段骨架、状态集合、成员函数、工厂函数和禁止事项。 |
| 使用 `8.2.2` 作为命名统一表 | 对 `DefinitionVsUseRule`、`ConsistencyProtectionRule` 等与现有 Step 6 名称不同的线索做一致映射。 |
| 正式正文只写收口结论 | 问题回答、诊断、取舍、差异审计留在 calibration。 |
| 不回填旧主语 | `MethodContent`、`DefinitionSnapshot`、`Fingerprint`、`OutboxEvent`、旧 P1 plugin/configuration 不得进入正式 §6。 |

停审记录:

- 对象覆盖是否完整: pass。8 个新 §5 组成部分均已映射到现有 Step 6 对象或明确合并 / 字段 / view 承接。
- 是否发现 design blocker: no。当前不需要回退 Step 5 或全量重写 Step 6。
- 是否存在必须局部修正: yes。正式 §6 回填时必须采用 `8.2.2` 的命名统一和合并裁决,尤其 `ExternalReferenceValidityView` 需显式说明为 view 形态。
- 是否越界: pass。未写正式 §6,未写 Step 7 接口、Step 8 流程、Step 9 状态迁移、DDL、event、job、topic 或配置。
- 下一步只允许进入“L1-governance 式文件拆分框架:先思考”;不得直接回填正式 §6 或进入 Step 7。

next_allowed_action: 等待用户确认后进入“L1-governance 式文件拆分框架:先思考”;不得直接回填正式 §6,不得进入 Step 7、Step 8 或 Step 9。

### 8.3 L1-governance 式文件拆分框架:先思考

#### 8.3.1 需要阅读的参考文档

| 顺序 | 文档 | 读取重点 | 对 L3 Step 6 的用途 |
|---:|---|---|---|
| 1 | `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 当前恢复点、禁止跳步、全局 blocker。 | 确认本次只讨论 Step 6 文件拆分,不进入 Step 7/8/9。 |
| 2 | `projects/L3-method-library/design-calibration/02_hld_calibration_flow.md` | Step 6 当前状态、后续 Step 阻塞关系。 | 更新文件拆分后的恢复点和 next action。 |
| 3 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | 主控文件如何只放筛选说明、对象分布、附录索引、Step 8/9 反查、回填口径。 | 作为 L3 Step 6 主控文件的结构模板。 |
| 4 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_truth_context_decision.md` | truth / state 对象附录的对象卡片格式。 | 参考 L3 core truth / formalization / consumption 附录写法。 |
| 5 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_truth_policy_compliance.md` | 第二组 truth 对象如何继续编号和分组。 | 参考 L3 trace / relation / external summary 等对象较多时如何分卷。 |
| 6 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_policies.md` | policy / guard 对象如何从 truth 对象中拆出。 | 判断 L3 的 `FormalizationEligibilityRule`、`DefinitionUseBoundaryGuard`、`ConsistencyProtectionPolicy` 等是否单独成附录。 |
| 7 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_projections.md` | projection / read model 只读、可重建、可过期的写法。 | 参考 L3 catalog / availability / maintenance / package view 的非 truth 边界。 |
| 8 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_references_audit.md` | reference / snapshot / audit / history 的拆分。 | 参考 L3 typed ref、external ref、trace / audit / lineage 的承接。 |
| 9 | `projects/L1-governance/02-概要设计.md` §6 | 正式 §6 只放对象类别总表、排除说明和延伸阅读。 | 确定 L3 正式 §6 不应粘贴完整对象卡片。 |
| 10 | `standards/document/概要设计讨论流程_SOP.md` Step 6 | Step 6 输出、逐组成部分停审、Step 8/9 反查。 | 校验拆分不改变 Step 6 产物要求。 |
| 11 | `standards/document/概要设计书写规范.md` 4.6 | 对象小节格式、字段 / 状态 / 函数骨架边界。 | 约束附录对象卡片仍需满足正式格式。 |
| 12 | `standards/document/设计文档讨论中间产物规范.md` 3.5 | 先思考后写入、长文档批次、历史材料后置审计。 | 固定本次只写拆分思考,下一步才创建 / 迁移附录。 |
| 13 | `projects/L3-method-library/design-calibration/02_hld_step_05_components_boundary.md` | 新 §5 的 8 个组成部分和对象发现线索。 | 作为 L3 附录分组第一来源。 |
| 14 | `projects/L3-method-library/design-calibration/02_hld_step_06_key_objects.md` | 现有对象卡片、对象覆盖裁决、命名统一表。 | 判断哪些内容留主控文件、哪些迁移到附录。 |
| 15 | `projects/L3-method-library/02-概要设计.md` §5~§6 | 正式 §5 当前结论与正式 §6 旧污染。 | 为后续正式 §6 摘要回填做边界输入。 |

#### 8.3.2 问题回答

- L1-governance 的 Step 6 不把所有对象卡片塞进一个大文件,而是用一个主控文件承载筛选说明、分布表、附录索引、反查清单和回填口径,再用多个对象附录承载详细对象骨架。
- L3 当前 Step 6 已经有 30 多个对象卡片,继续在单文件中追加正式 §6 回填策略和对象修正会使主控、对象正文、差异审计混在一起,不利于后续 Step 7/8/9 恢复。
- 因此,在正式 §6 回填前,应先裁决是否把 L3 Step 6 调整为 L1-governance 式结构:主控文件保留索引与门禁,对象卡片迁移或复制到按类别拆分的附录文件。
- 本模块只思考拆分方案,不创建新附录文件、不迁移对象正文、不改正式 `02-概要设计.md`。

#### 8.3.3 诊断

- L3 的对象类型分布与 L1-governance 类似:都有 truth/state、policy/guard、projection/read model、reference/boundary、audit/history,且 L3 额外有 operation/recovery 和 peripheral 组织对象。
- L3 与 L1-governance 的差异是 L3 的业务主线是“方法资产定义 -> 正式化版本 -> 受控消费 -> 追溯一致性”,而不是 Governance 的 context / decision / policy / compliance。拆分不能照抄 governance 的附录命名,必须按 L3 的 8 个组成部分和对象类别重命名。
- L3 当前 `02_hld_step_06_key_objects.md` 已经包含完整对象小节,不能简单删除或重写。更稳妥的方式是:先把它定位为 Step 6 主控 + historical inline object source,再按附录迁移计划逐批抽出对象卡片。
- 正式 `02-概要设计.md` §6 应学习 L1-governance:只写校准来源、延伸阅读、对象类别总表和排除说明。完整字段骨架、状态候选、成员函数和工厂函数留在附录。

#### 8.3.4 拟采用的 L3 附录拆分

| 文件 | 拟承载对象 | 参考 L1-governance 文件 | 裁决理由 |
|---|---|---|---|
| `02_hld_step_06_key_objects.md` | 主控:候选池筛选、对象分布、附录索引、Step 8/9 反查、旧主语污染、正式 §6 回填口径、flow / 台账更新记录。 | `02_hld_step_06_key_objects.md` | 主控文件不再承载全部对象卡片作为长期结构。 |
| `02_hld_step_06_key_objects_core_truth.md` | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetConsumptionMaterial`;`MethodAssetTraceMaterial`;`MethodAssetRelation`;`ExternalSourceSummary`;`MethodPackage`;`MethodSetAssembly`。 | truth context / truth policy 附录 | 承载核心 truth、support truth 和 peripheral truth,按 L3 主链组织。 |
| `02_hld_step_06_key_objects_policies_guards.md` | `FormalizationEligibilityRule`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule`。 | policies 附录 | 统一放 policy / guard / boundary,防止规则散落在 truth 对象里。 |
| `02_hld_step_06_key_objects_views_materials.md` | `MethodAssetCatalogView`;`MethodAssetAvailabilityView`;`MaintenanceProgressView`;`ExternalReferenceValidityView` view 形态;package / set view 形态。 | projections 附录 | 统一强调 view / material 非 truth、可重建、可过期。 |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | `MethodAssetDefinitionRef`;`TraceSubjectRef`;`ExternalSourceRef`;`ArtifactArchiveRef`;`MethodAssetAuditTrail`;evidence lineage / history 线索。 | references audit 附录 | typed ref、external ref、audit / history / lineage 需要同一边界:body-free、no raw log。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;operation recovery 线索;peripheral package / method set 的 operation 关系。 | projections + references audit 的组合 | L3 特有 operation/support 与 peripheral 降级边界需要单独停审。 |

#### 8.3.5 取舍

- 不照搬 L1-governance 的对象附录命名。采用 L3 语义命名,但保留“主控文件 + 多附录”的结构。
- 不把每个组成部分都拆成一个文件。8 个文件会过细,且会把 policy、view、ref 横切语义切散;当前以 5 个附录为宜。
- 不在主控文件继续长期保留完整对象卡片作为唯一来源。可以先保留现有正文,但后续写入应标注为迁移来源,最终让主控文件以索引和门禁为主。
- 不在本步骤创建附录文件。创建文件、迁移对象卡片、更新正式 §6 校准来源属于“文件拆分框架:再写入”之后的写入模块。

#### 8.3.6 越界检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否创建新附录文件 | no | 本模块只写拆分思考。 |
| 是否迁移对象正文 | no | 对象卡片仍留在现有 Step 6 文件。 |
| 是否改正式 §6 | no | 正式回填在拆分框架闭合后再做。 |
| 是否进入 Step 7/8/9 | no | 后续 Step 仍等待 Step 6 文件框架和正式 §6 回填策略闭合。 |
| 是否改变对象裁决 | no | 继续沿用 `8.2` 的覆盖裁决和命名统一表。 |

停审记录:

- 是否完成 L1-governance 框架读取: pass。已读取主控文件、truth 附录、projection 附录和正式 §6 摘要写法。
- 是否形成 L3 拆分候选: pass。已提出 1 个主控文件 + 5 个对象附录的候选结构。
- 是否允许进入写入模块: pass。下一步可进入“L1-governance 式文件拆分框架:再写入”,固定文件名、对象归属和创建 / 迁移顺序。
- 是否允许直接创建文件或回填正式 §6: blocked。必须等待用户确认拆分思考后再写入。

next_allowed_action: 等待用户确认后进入“L1-governance 式文件拆分框架:再写入”;不得直接创建附录文件,不得回填正式 §6,不得进入 Step 7、Step 8 或 Step 9。

### 8.4 L1-governance 式文件拆分框架:再写入

#### 8.4.1 文件职责裁决

| 文件 | 长期职责 | 本轮写入状态 | 说明 |
|---|---|---|---|
| `02_hld_step_06_key_objects.md` | Step 6 主控文件:开工门禁、候选池筛选、对象分布、附录索引、Step 8/9 反查、旧主语污染、正式 §6 回填口径、flow / 台账更新记录。 | keep_and_refactor_later | 当前暂保留既有对象卡片作为迁移来源;后续迁移完成后主控文件应以索引和门禁为主。 |
| `02_hld_step_06_key_objects_core_truth.md` | core / support / peripheral truth 与 state 对象附录。 | planned | 承载对象卡片主体,参考 L1-governance truth 附录。 |
| `02_hld_step_06_key_objects_policies_guards.md` | policy、guard、boundary、invariant 对象附录。 | planned | 防止规则散落在 truth 对象中,也便于 Step 8 flow 和 Step 9 state 回指。 |
| `02_hld_step_06_key_objects_views_materials.md` | projection、read model、view、material、freshness 相关对象附录。 | planned | 统一说明非 truth、可重建、可过期和不得反写来源 truth。 |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | typed ref、external ref、trace subject、audit / history / lineage 对象附录。 | planned | 统一保持 body-free、no raw log、no external body。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | operation/support task、recovery、progress 以及 peripheral 运行边界附录。 | planned | 统一标注后台维护和外围组织不得成为核心闭环前置。 |

#### 8.4.2 对象归属裁决

| 附录文件 | 对象 / 对象形态 | 来源位置 | 迁移说明 |
|---|---|---|---|
| `core_truth` | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetConsumptionMaterial`;`MethodAssetTraceMaterial`;`MethodAssetRelation`;`ExternalSourceSummary`;`MethodPackage`;`MethodSetAssembly` | 当前 `5.4`;`5.6`;`5.8`;`5.10`;`5.12`;`5.14`;`5.18` | 保留完整对象卡片;按 L3 主链排序,同时标注 support / peripheral 层级。 |
| `policies_guards` | `FormalizationEligibilityRule`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule`;`DefinitionBoundaryRule` merged note;`VersionTransitionInvariant` merged note;`MaterialConvergencePolicy` merged note | 当前 `5.6.4`;`5.8.3`;`5.8.4`;`5.10.3`;`5.12.3`;`5.14.4`;`5.18.3`;`8.2.2` | 独立对象照搬对象卡片;merged note 以裁决表形式进入附录,不新造对象。 |
| `views_materials` | `MethodAssetCatalogView`;`MethodAssetAvailabilityView`;`MaintenanceProgressView`;`ExternalReferenceValidityView` view note;`MethodPackageView` / `MethodSetAssemblyView` view note;`DistributionContextView` view note | 当前 `5.4.4`;`5.8.2`;`5.16.4`;`8.2.2` | 已有对象照搬对象卡片;view note 以“并入读取形态”表表达,不独立成 truth。 |
| `refs_trace_audit` | `MethodAssetDefinitionRef`;`TraceSubjectRef`;`ExternalSourceRef`;`ArtifactArchiveRef`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` lineage note;history / audit 线索 | 当前 `5.4.3`;`5.10.4`;`5.10.5`;`5.14.2`;`5.14.3`;`8.2.2` | typed ref 和 audit 对象照搬对象卡片;lineage/history 以 body-free 线索表表达。 |
| `operations_peripheral` | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` cross-ref;`MethodPackage`;`MethodSetAssembly`;`MethodPackageRef`;operation / peripheral 降级边界 | 当前 `5.16`;`5.18`;`8.2`;`8.3` | task / recovery / ref 对象照搬对象卡片;truth 对象只放 cross-ref 摘要,避免与 `core_truth` 重复。 |

#### 8.4.3 创建与迁移顺序

| 顺序 | 动作 | 输入 | 输出 | 停审点 |
|---:|---|---|---|---|
| 1 | 创建 5 个附录文件的文件头和对象索引框架。 | `8.4.1`;`8.4.2` | 5 个空骨架附录。 | 文件名、职责、对象列表无冲突。 |
| 2 | 迁移 `core_truth` 对象卡片。 | 当前 `5.4`;`5.6`;`5.8.1`;`5.10.1`;`5.12.1`;`5.14.1`;`5.18.1`;`5.18.2` | `core_truth` 附录。 | truth / state / peripheral 层级标注清楚。 |
| 3 | 迁移 `policies_guards` 对象卡片和 merged note。 | 当前 policy / guard 对象小节;`8.2.2` | `policies_guards` 附录。 | rule / guard 未新造对象,命名统一表保留。 |
| 4 | 迁移 `views_materials` 对象卡片和 view note。 | 当前 view / material 小节;`8.2.2` | `views_materials` 附录。 | view / material 明确非 truth、可重建、可过期。 |
| 5 | 迁移 `refs_trace_audit` 对象卡片和 lineage / history note。 | 当前 ref / audit 小节;`8.2.2` | `refs_trace_audit` 附录。 | typed ref 不降级为字符串;lineage 不保存正文。 |
| 6 | 迁移 `operations_peripheral` task / recovery / peripheral ref 和 cross-ref 摘要。 | 当前 `5.16`;`5.18`;`8.3` | `operations_peripheral` 附录。 | operation / peripheral 不成为核心闭环前置。 |
| 7 | 回写主控文件附录索引和迁移记录。 | 5 个附录文件 | 主控文件索引、迁移完成记录。 | 主控不再作为唯一对象正文来源。 |
| 8 | 进入旧主语污染与正式 §6 回填策略。 | 主控 + 5 附录 | 正式 §6 回填策略。 | 正式 §6 只写摘要和延伸阅读。 |

#### 8.4.4 主控文件保留 / 降噪规则

| 内容 | 处理 |
|---|---|
| `0`~`4` 开工、必读、计划、候选池接收 | 保留在主控文件。 |
| `5.1`~`5.2` 对象候选池筛选 | 保留在主控文件,作为对象筛选真相源。 |
| `5.3`~`5.18` 逐对象卡片 | 作为迁移来源暂保留;迁移完成后可改成“已迁移索引”,但不得丢失内容。 |
| `5.19`~`5.24` Step 8/9 反查、跨对象审计、旧材料差异审计 | 保留在主控文件或抽为主控审计段,不进入对象附录。 |
| `6` 对象正式化写入模板 | 保留在主控文件。 |
| `7` 当前停审 | 后续由 `8.x` 新停审记录替代,历史停审不得作为当前完成结论。 |
| `8.x` Step 5 重写后反查 | 保留在主控文件,作为本轮 recheck 的正式记录。 |

#### 8.4.5 正式 §6 回填裁决

| 项 | 裁决 |
|---|---|
| 正式 §6 是否粘贴完整对象卡片 | no。参考 L1-governance,正式 §6 只写校准来源、延伸阅读、对象类别总表、排除说明和必要对象摘要。 |
| 正式 §6 校准来源 | 主控文件 + 5 个对象附录。 |
| 正式 §6 对象类别 | Truth / State;Policy / Guard;Projection / View / Material;Reference / Boundary;Trace / Audit / History;Operation / Recovery;Peripheral Organization。 |
| 正式 §6 排除说明 | API / DTO / request / result、repository / port / adapter、inbound trigger、database table、projection implementation、external body、marketplace fulfillment、old MethodContent / snapshot / fingerprint / outbox。 |
| 正式 §6 回填前置 | 5 个附录至少完成文件框架和对象索引;对象卡片迁移可分批完成,但正式 §6 引用的对象类别必须能反查到附录。 |

#### 8.4.6 后续模块门禁

| 下一模块 | 进入条件 | 禁止事项 |
|---|---|---|
| 对象附录创建与迁移:先思考 | 本节 `8.4` 通过,用户确认。 | 不直接一次性创建并填满 5 个附录;先列迁移批次和每批对象。 |
| 对象附录创建与迁移:再写入 | 迁移思考通过。 | 不改变 `8.2` 对象裁决;不把 merged note 发明成新对象。 |
| 旧主语污染与正式 §6 回填策略:先思考 | 附录框架和必要索引完成。 | 不直接回填正式 §6;不恢复旧主语。 |
| 正式 §6 回填草稿:再写入 | 旧主语污染策略通过。 | 不粘贴完整对象卡片;不写 Step 7/8/9 内容。 |

停审记录:

- 文件拆分是否闭合: pass。已固定 1 个主控文件 + 5 个附录文件。
- 对象归属是否闭合: pass。所有现有 Step 6 对象卡片或 merged note 都有目标附录或主控位置。
- 是否创建附录文件: no。本模块只固定框架,创建文件进入下一模块。
- 是否迁移对象正文: no。本模块只定义迁移顺序,不移动正文。
- 是否允许进入 Step 7: blocked。必须先完成附录创建 / 迁移、旧主语污染策略和正式 §6 回填。

next_allowed_action: 等待用户确认后进入“对象附录创建与迁移:先思考”;不得直接创建并填满附录文件,不得回填正式 §6,不得进入 Step 7、Step 8 或 Step 9。

### 8.5 Step 6 完全重写:先思考

#### 8.5.1 问题回答

- 当前应停止“对象附录创建与迁移”路线。该路线默认保留现有 Step 6 对象卡片并迁移到附录,但现有 Step 6 是在 Step 5 完全重写前形成的单文件产物,继续迁移会把旧对象粒度、旧停审结论和旧结构债务带入新框架。
- Step 6 应完全重写,而不是在现有文件上做迁移整理。完全重写的意思是:以当前 `00-需求文档.md`、`01-架构设计.md`、Step 5 `0R` 结论和 L1-governance Step 6 框架为第一来源,重新生成主控文件和对象附录。
- 现有 Step 6 只能作为 historical material 和差异审计输入。`8.2` 的对象覆盖裁决和 `8.4` 的文件拆分框架可作为重写参考,但不能替代新 Step 6 的对象筛选、对象小节和停审。
- 当前模块只写完全重写思考,不直接清空文件、不创建附录、不迁移对象正文、不回填正式 §6。

#### 8.5.2 必读文档

| 顺序 | 文档 | 用途 |
|---:|---|---|
| 1 | `design-calibration/project_execution_ledger.md` | 确认当前恢复点切换到 Step 6 完全重写,不得按旧迁移路线继续。 |
| 2 | `design-calibration/02_hld_calibration_flow.md` | 更新文档级 flow 中 Step 6 的状态、下一动作和 Step 7~9 阻塞原因。 |
| 3 | `standards/document/概要设计讨论流程_SOP.md` Step 6 | 重新确认 Step 6 必须输出对象候选池筛选、单对象小节、Step 8/9 反查和跨对象审计。 |
| 4 | `standards/document/概要设计书写规范.md` 4.6 | 重新确认对象小节字段、状态、成员函数、工厂函数和禁止事项格式。 |
| 5 | `standards/document/设计文档讨论中间产物规范.md` 3.5 | 约束完全重写仍必须先思考后写入、分批写入、历史材料后置审计。 |
| 6 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | 参考主控文件结构:筛选说明、对象分布、附录索引、Step 8/9 反查、回填口径。 |
| 7 | `projects/L1-governance/design-calibration/02_hld_step_06_key_objects_*` | 参考 truth、policy、projection、reference/audit 附录写法。 |
| 8 | `projects/L1-governance/02-概要设计.md` §6 | 参考正式 §6 摘要化写法,不粘贴完整对象卡片。 |
| 9 | `projects/L3-method-library/00-需求文档.md` | 当前 Step 6 对象的需求来源。 |
| 10 | `projects/L3-method-library/01-架构设计.md` | 当前 Step 6 对象的架构来源、truth / view / summary / ref / operation / peripheral 边界。 |
| 11 | `design-calibration/02_hld_step_05_components_boundary.md` | 当前 Step 6 第一来源:8 个组成部分、对象发现线索、Step 6~9 承接门禁。 |
| 12 | `projects/L3-method-library/02-概要设计.md` §5~§6 | 正式 §5 是当前输入;正式 §6 是污染区,只作替换对象。 |
| 13 | 当前 `02_hld_step_06_key_objects.md` | historical material,只作差异审计和遗漏检查,不得作为重写起点。 |

#### 8.5.3 诊断

| 现状 | 风险 | 裁决 |
|---|---|---|
| 当前 Step 6 已有大量对象卡片 | 若迁移到附录,会保留旧对象筛选顺序和旧停审结论。 | 不迁移为主,改为完全重写。 |
| `8.4` 已固定主控 + 5 附录框架 | 框架可用,但对象正文仍来自旧单文件。 | 保留框架思想,重写对象正文。 |
| 正式 §6 仍是旧 `MethodContent` / snapshot / fingerprint / outbox 主线 | 如果不完全重写,正式正文回填容易混入旧对象。 | 正式 §6 必须等新 Step 6 主控 + 附录完成后摘要化回填。 |
| 当前对象线索和新 §5 基本可对齐 | 说明新 Step 6 可重写,不是 design blocker。 | 用 `8.2` 做遗漏检查,不把它当最终对象表。 |

#### 8.5.4 完全重写输出框架

| 文件 | 重写方式 | 目标内容 |
|---|---|---|
| `02_hld_step_06_key_objects.md` | 完全重写为主控文件。 | 必读文档、对象候选池筛选、对象类别总表、对象分布、附录索引、Step 8/9 反查、跨附录审计、旧材料差异审计、正式 §6 回填口径。 |
| `02_hld_step_06_key_objects_core_truth.md` | 新建并逐模块写入。 | core/support/peripheral truth 与 state 对象,按 L3 主链组织。 |
| `02_hld_step_06_key_objects_policies_guards.md` | 新建并逐模块写入。 | policy、guard、boundary、invariant 对象,不从旧对象卡片直接搬运。 |
| `02_hld_step_06_key_objects_views_materials.md` | 新建并逐模块写入。 | projection、view、read material、freshness 相关对象,强调非 truth。 |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | 新建并逐模块写入。 | typed ref、external ref、trace subject、audit、history、lineage,强调 body-free。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | 新建并逐模块写入。 | operation/support task、recovery、progress 和 peripheral 边界,强调不成为核心闭环前置。 |

#### 8.5.5 完全重写执行顺序

| 顺序 | 模块 | 写入要求 | 停审 |
|---:|---|---|---|
| 1 | 完全重写开工框架:再写入 | 将主控文件顶部状态、Step 内计划和重写规则改成 full_rewrite;旧对象卡片标记 historical。 | 不写对象正文。 |
| 2 | 主控文件候选池筛选:先思考 / 再写入 | 从新 Step 5 重新筛选正式对象、字段类型、view、ref、policy、operation、peripheral。 | 不使用旧 Step 6 反推。 |
| 3 | 五个附录文件框架:先思考 / 再写入 | 创建附录文件头、对象索引和每个附录的模块计划。 | 只写框架,不填满对象卡片。 |
| 4 | `core_truth` 附录逐模块写入 | 先思考、再写入,按对象组分批完成。 | 每批停审。 |
| 5 | `policies_guards` 附录逐模块写入 | 先思考、再写入,按 guard / boundary 家族完成。 | 每批停审。 |
| 6 | `views_materials` 附录逐模块写入 | 先思考、再写入,按 view / material / freshness 家族完成。 | 每批停审。 |
| 7 | `refs_trace_audit` 附录逐模块写入 | 先思考、再写入,按 ref / trace / audit / lineage 家族完成。 | 每批停审。 |
| 8 | `operations_peripheral` 附录逐模块写入 | 先思考、再写入,按 operation / peripheral 家族完成。 | 每批停审。 |
| 9 | 跨附录闭环审计 | 检查重复对象、孤儿对象、命名漂移、Step 8/9 反查、旧主语污染。 | 通过后才能回填正式 §6。 |
| 10 | 正式 §6 回填草稿 | 只写摘要、校准来源、对象类别表和排除说明。 | 不粘贴完整对象卡片。 |

#### 8.5.6 取舍

- 采用完全重写,不采用对象迁移。这样能避免旧对象卡片中的顺序、粒度和停审结论继续影响新 Step 6。
- 保留 `8.2` / `8.4` 作为“重写前审计记录”,但不把它们当成新 Step 6 主体。
- 新附录按对象类别拆分,不是按 8 个组成部分拆分。这样能避免 policy、view、ref、audit 横切对象散落在多个文件。
- 正式 §6 只在新主控 + 附录闭合后回填,不提前替换。

#### 8.5.7 越界检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否清空当前 Step 6 文件 | no | 本模块只写完全重写思考。 |
| 是否创建附录文件 | no | 附录创建进入后续写入模块。 |
| 是否迁移对象正文 | no | 完全重写不走迁移路线。 |
| 是否回填正式 §6 | no | 必须等新主控 + 附录完成。 |
| 是否进入 Step 7/8/9 | no | Step 7~9 继续 blocked_by_step6_full_rewrite。 |

停审记录:

- 是否采纳完全重写建议: pass。
- 是否保留对象迁移路线: no。`8.4` 作为历史裁决保留,但当前后续动作改为完全重写。
- 是否有 design blocker: no。当前缺口是文档结构和旧材料污染,不是上游真相源缺失。
- 是否允许进入下一模块: pass。下一步进入“Step 6 完全重写开工框架:再写入”。

next_allowed_action: 已进入“Step 6 完全重写开工框架:再写入”;该动作完成后转入“主控文件候选池筛选:先思考”。

### 8.6 Step 6 完全重写开工框架:再写入

#### 8.6.1 写入内容

- 文件头状态已从 `recheck_in_progress` 更新为 `full_rewrite_in_progress`。
- `Step 开工确认` 已改为完全重写口径:当前第一来源是 `00-需求文档.md`、`01-架构设计.md`、Step 5 `0R` 结论和 L1-governance Step 6 框架。
- `完全重写必读文档` 已补入项目台账、文档 flow、SOP、书写规范、真相源标准、L3 当前输入、L1-governance 主控与附录、历史材料审计入口。
- `Step 内计划` 已改为完整 full rewrite 顺序,并把当前恢复点推进到“主控文件候选池筛选:先思考”。
- `当前有效主控框架` 已明确主控职责、5 个预定附录、历史材料边界和当前停审。
- 旧 3~7 已标记为 `Historical`;旧 8 改为“Step 6 重写裁决与历史反查 0R”,保留 `8.5` 完全重写裁决作为当前路线依据。

#### 8.6.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 创建 5 个附录文件 | no |
| 写入对象候选池新表 | no |
| 写入任何对象卡片正文 | no |
| 回填正式 `02-概要设计.md` §6 | no |
| 启动 Step 7 / Step 8 / Step 9 | no |

#### 8.6.3 停审记录

| 检查项 | 结论 |
|---|---|
| 完全重写裁决是否落到主控框架 | pass |
| 旧迁移路线是否已降级为历史材料 | pass |
| 是否仍遵守先思考、后写入 | pass |
| 下一模块是否明确 | pass:`主控文件候选池筛选:先思考` |

next_allowed_action: 已进入“主控文件候选池筛选:先思考”;该动作完成后转入“主控文件候选池筛选:再写入”。

### 8.7 主控文件候选池筛选:先思考

#### 8.7.1 问题回答

- L3 Step 6 应参考 L1-governance 的主控框架,但不能复制 Governance 的对象类别语义。可复用的是文件组织方法:主控文件只保留筛选说明、对象分布、附录索引、Step 8/9 反查、设计取舍、旧材料诊断和正式 §6 回填口径;对象正文进入附录。
- L3 的候选池筛选框架应先搭主控层,再创建附录层。主控层先回答“哪些对象类别存在、哪些名称不展开、对象如何映射到 8 个组成部分、对象正文进入哪个附录”,而不是直接写每个对象字段。
- L3 与 L1-governance 的关键差异是:本仓核心是方法资产定义 truth、正式版本、受控消费、追溯一致性和外围隔离;不应引入 Governance 的 gate / decision / approval / control / nonconformity 主语,也不应继承旧 MethodContent / fingerprint / snapshot / outbox 主线。
- 当前模块只形成“需要搭建的框架”思考,不写候选池正式表、不创建附录、不写对象卡片正文、不回填正式 §6。

#### 8.7.2 L1-governance 可复用框架

| L1-governance 结构 | 可复用点 | L3 适配 |
|---|---|---|
| 本步目标 | 明确 Step 6 停在概要对象骨架层。 | L3 也只写对象类型、责任、关键字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项。 |
| 本步输入 | 把 Step 3/4/5、00、01 作为输入。 | L3 应把当前 00、01、新 Step 5 `0R` 和 L1-governance 框架作为输入,旧 Step 6 只后置审计。 |
| 对象候选池筛选说明 | 先按对象类别筛出正式关键对象,再列不展开项。 | L3 需要先按 truth/state、policy/guard、view/material、ref/summary/boundary、trace/audit/history、operations/peripheral 分层筛选。 |
| 关键对象与主要组成部分分布 | 用组成部分表检查对象归属。 | L3 应回指 Step 5 的 8 个组成部分和核心 / 支撑 / 维护 / 外围分层。 |
| 对象展开文件 | 主控 + 附录承载对象正文。 | L3 采用 5 个附录,但附录按 L3 对象类别命名,不是 Governance 附录名。 |
| Step 8 / Step 9 反查清单 | 用处理流和状态主题反查对象覆盖。 | L3 必须反查定义、正式化、消费、追溯、一致性、关系分发、外部引用、维护和外围流程 / 状态来源。 |
| 本步设计取舍 | 固定哪些东西不作为对象展开。 | L3 必须集中排除 API、DTO、repository、port、job、worker、DDL、event、外部正文、marketplace 交易和旧机制。 |
| 当前文档问题诊断 | 把旧正式正文污染变成后置审计。 | L3 应诊断旧 `MethodContent`、snapshot、fingerprint、outbox、旧 P0/P1 和旧 DDD 草案污染。 |
| 回填草稿 | 正式 §6 只摘录主表和关键摘要。 | L3 正式 §6 不粘贴对象卡片,只保留对象类别表、主要对象摘要、排除项和校准来源。 |

#### 8.7.3 L3 需要搭建的主控框架

| 框架层 | 本层要回答的问题 | 后续写入产物 |
|---|---|---|
| Step 目标与输入门禁 | Step 6 本轮从哪里来、停在哪里、旧材料如何使用。 | 主控文件“本步目标 / 本步输入 / 禁止下沉”区。 |
| 对象类别筛选 | 哪些候选进入正式关键对象,哪些并入、后移或排除。 | 主控文件“对象候选池筛选说明”。 |
| 不展开项清单 | 哪些名称属于接口、实现、外部正文、相邻仓 truth 或旧机制。 | 主控文件“不作为关键对象展开的名称”。 |
| 组成部分分布 | 每个对象回指哪个 Step 5 组成部分和对象发现维度。 | 主控文件“关键对象与主要组成部分分布”。 |
| 附录索引 | 每类对象正文放到哪个附录,附录之间如何避免重复。 | 主控文件“对象展开文件”。 |
| 对象卡片模板 | 附录内每个对象用什么骨架格式写。 | 附录文件共用模板:基本信息、字段骨架、状态候选、成员函数、工厂函数、禁止事项、来源回指。 |
| Step 7 / 8 / 9 反查 | 接口、处理流和状态是否都能回指 Step 6 对象。 | 主控文件“Step 7 / Step 8 / Step 9 反查清单”。 |
| 设计取舍 | 保留、并入、后移、排除的裁决理由。 | 主控文件“本步设计取舍”。 |
| 旧材料诊断 | 旧正式 §6 和旧 Step 6 哪些内容污染当前对象主线。 | 主控文件“旧材料差异审计”。 |
| 正式 §6 回填口径 | 正式概要只摘录哪些内容,不摘录哪些内容。 | 主控文件“回填草稿 / 回填门禁”。 |

#### 8.7.4 L3 对象类别框架

| 对象类别 | L3 适配说明 | 预期承载 |
|---|---|---|
| Core truth / State | 方法资产定义、目录、正式版本、关系等本仓拥有的正式语义。 | `core_truth` 附录。 |
| Support truth / Summary | 外部依据摘要、消费影响摘要、正式化依据摘要等不拥有外部正文的本地摘要。 | `core_truth` 或 `refs_trace_audit` 附录,后续筛选时裁决。 |
| Policy / Guard / Boundary | 正式化资格、版本稳定、Definition vs Use、正文禁止、关系完整性、外围 composition 等边界判断。 | `policies_guards` 附录。 |
| Projection / View / Read material | 目录 view、正式版本 view、消费材料、trace view、maintenance progress 等非 truth 材料。 | `views_materials` 附录。 |
| Reference / External ref / Typed boundary | 方法资产 ref、catalog scope、governance basis、external source、artifact archive、marketplace context 等 typed ref。 | `refs_trace_audit` 附录。 |
| Trace / Audit / History / Lineage | 定义变化、正式化、消费、关系、外部依据、维护和外围组织的 body-free 追溯材料。 | `refs_trace_audit` 附录。 |
| Operations / Recovery / Peripheral | refresh task、recovery task、maintenance run、package、method set 等维护或外围对象。 | `operations_peripheral` 附录。 |

#### 8.7.5 L3 主控写入顺序裁决

| 顺序 | 写入块 | 写入边界 |
|---:|---|---|
| 1 | 本步目标 / 输入 / 禁止下沉 | 只写 Step 6 深度和输入来源。 |
| 2 | 对象类别筛选说明 | 只写类别和筛选原则,不写对象卡片字段。 |
| 3 | 正式进入 Step 6 的候选对象表 | 从 Step 5 `5.26.1` 和 `5.26.2` 重新筛选,记录展开位置。 |
| 4 | 不作为关键对象展开的名称 | 集中排除旧主语、接口实现、相邻仓 truth、外部正文和旧机制。 |
| 5 | 关键对象与组成部分分布 | 回指 Step 5 的 8 个组成部分与四层边界。 |
| 6 | 对象展开文件索引 | 指向 5 个计划附录,但不创建文件。 |
| 7 | Step 7 / 8 / 9 反查清单占位 | 先定义反查维度,详细对象覆盖在附录完成后再收口。 |
| 8 | 本步设计取舍 / 旧材料诊断 / 回填口径 | 固定取舍和后续正式 §6 摘要边界。 |

#### 8.7.6 当前取舍

- 主控文件候选池筛选应先搭“类别 + 分布 + 附录索引”框架,不按 8 个组成部分逐个写对象正文。8 个组成部分用于对象归属反查,不是附录文件拆分方式。
- 附录拆分仍采用 5 类:core truth、policies guards、views materials、refs trace audit、operations peripheral。这样比按组成部分拆分更能避免 policy、view、ref、audit 横切对象重复。
- L3 的 operations / peripheral 类需要独立附录,因为维护收敛和外围包 / 方法集如果混入 core truth,会破坏“核心闭环不依赖外围和维护”的边界。
- 旧 Step 6 的对象卡片不能迁移为当前对象表。它只能在候选池写入后用于遗漏检查,例如检查是否误删了仍有 Step 5 来源的 ref、view、audit 或 state candidate。

#### 8.7.7 越界检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否创建附录文件 | no | 当前只思考主控筛选框架。 |
| 是否写对象字段 / 函数 / 状态 | no | 对象卡片留给附录逐模块写入。 |
| 是否回填正式 §6 | no | 必须等候选池、附录和反查审计完成。 |
| 是否复制 L1-governance 领域对象 | no | 只复用框架,不复制对象语义。 |
| 是否允许进入下一模块 | pass | 下一模块为“主控文件候选池筛选:再写入”。 |

next_allowed_action: 已进入“主控文件候选池筛选:再写入”;该动作完成后转入“五个附录文件框架:先思考”。

### 8.8 主控文件候选池筛选:再写入

#### 8.8.1 写入内容

- 已新增当前有效 `## 4. 主控文件候选池筛选`。
- 已写入筛选原则、对象类别总表、并入 / 后移 / 排除候选、组成部分分布、对象展开文件索引和 Step 7/8/9 反查占位。
- 已确认本模块只写主控候选池框架和表格,不创建附录、不写对象卡片正文、不回填正式 §6。

#### 8.8.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 创建 5 个附录文件 | no |
| 写入对象字段 / 状态 / 成员函数 / 工厂函数 | no |
| 回填正式 `02-概要设计.md` §6 | no |
| 启动 Step 7 / Step 8 / Step 9 | no |

#### 8.8.3 停审记录

| 检查项 | 结论 |
|---|---|
| 主控候选池是否已搭建 | pass |
| 对象类别是否覆盖 Step 5 `5.26.1` / `5.26.2` | pass |
| 排除项是否覆盖旧主语、旧机制、外部正文和相邻仓 truth | pass |
| 下一模块是否明确 | pass:`五个附录文件框架:先思考` |

next_allowed_action: 已进入“五个附录文件框架:先思考”;该动作完成后转入“五个附录文件框架:再写入”。

### 8.9 五个附录文件框架:先思考

#### 8.9.1 问题回答

- 下一步应创建 5 个附录的“空框架”,而不是直接填对象卡片。框架需要固定文件职责、对象索引、模块计划、对象卡片模板和禁止事项,让后续逐对象写入不会自行发挥。
- L1-governance 附录可复用的不是对象名称,而是附录写法:文件头回指主控文件、声明只给概要骨架、每个对象独立成节、对象卡片包含所属部分、对象类型、结构责任、字段骨架、状态候选、成员函数、工厂函数和禁止事项。
- L3 需要在 L1-governance 模板基础上补强两项:每个附录都要有 `来源回指` 和 `当前模块状态表`,因为本轮要求后续 agent 每一步都按台账和先思考 / 再写入恢复。
- 本模块只做框架思考,不创建 5 个附录文件,不写对象卡片正文,不回填正式 §6。

#### 8.9.2 附录统一文件结构

| 顺序 | 章节 | 用途 | 再写入时是否创建 |
|---:|---|---|---|
| 1 | 文件标题与状态头 | 回指主控文件、声明概要深度、标明当前状态。 | yes |
| 2 | 本附录职责边界 | 说明本文件承载哪些对象类别,不承载哪些对象。 | yes |
| 3 | 必读输入 | 回指主控 `## 4`、Step 5 `5.26`、00/01 对应边界和 L1-governance 参考。 | yes |
| 4 | 对象索引 | 列出对象名称、对象类别、Step 5 组成部分、来源、当前状态。 | yes |
| 5 | 模块状态表 | 固定“框架:再写入”之后每批对象的先思考 / 再写入顺序。 | yes |
| 6 | 对象卡片模板 | 固定每个对象必须使用的概要骨架格式。 | yes |
| 7 | 本附录禁止事项 | 防止写入接口、repository、DTO、状态迁移、DDL、外部正文或旧机制。 | yes |
| 8 | 本附录停审记录 | 记录当前只搭框架,未写对象正文。 | yes |

#### 8.9.3 共用对象卡片模板

| 模板块 | 内容要求 |
|---|---|
| 基本信息 | `所属部分`;`对象类型`;`结构责任`;`来源回指`;`边界说明`。 |
| 关键字段骨架 | 只写概要字段名、类型和作用,不得写完整 struct / schema。 |
| 状态候选 | 只写状态词表和语义,完整迁移留 Step 9。无状态对象写 `none`。 |
| 成员函数骨架 | 只写 `function_name(TypeName param_name)` 和作用,不得写返回类型、错误类型或实现。 |
| 工厂函数骨架 | 只写工厂来源和参数概要,不得写完整构造算法。 |
| 禁止事项 | 写清本对象不得拥有的 truth、正文、运行状态、外部机制或实现细节。 |
| 停审记录 | 检查来源、边界、非 truth / body-free / peripheral 隔离是否成立。 |

#### 8.9.4 五个附录职责

| 附录文件 | 职责 | 首批对象索引 |
|---|---|---|
| `02_hld_step_06_key_objects_core_truth.md` | 承载本仓核心 truth、state owner 和少量 support summary;保持方法资产定义、目录、正式版本、关系和状态 owner 清楚。 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetRelation`;`FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` |
| `02_hld_step_06_key_objects_policies_guards.md` | 承载 policy、guard、boundary、invariant;只表达判断边界,不保存业务 truth。 | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule` |
| `02_hld_step_06_key_objects_views_materials.md` | 承载 projection、view、read material 和 freshness 相关对象;必须标注非 truth、可重建、可过期。 | `MethodAssetCatalogView`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`MethodAssetConsumptionReadMaterial`;`MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetRelationView`;`DistributionReadMaterial`;`ExternalSourceSummaryView`;`MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView` |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | 承载 typed ref、external ref、trace、audit、history、lineage;必须保持 body-free 和 no raw log。 | `MethodAssetDefinitionRef`;`CatalogScopeRef`;`GovernanceBasisRef`;`ConsumptionContextRef`;`TraceSubjectRef`;`ConsumptionImpactSourceRef`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef`;`ExternalSourceRef`;`ArtifactArchiveRef`;`MaintenanceRunRef`;`RefreshScopeRef`;`MethodPackageRef`;`MarketplaceContextRef`;`MethodAssetAuditTrail`;history / lineage 对象 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | 承载维护任务、恢复任务、progress 和外围组织对象;必须说明不阻塞核心闭环。 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MethodPackage`;`MethodSetAssembly` |

#### 8.9.5 再写入创建顺序

| 顺序 | 动作 | 边界 |
|---:|---|---|
| 1 | 创建 `core_truth` 附录框架。 | 只写文件头、职责、索引、模板和停审。 |
| 2 | 创建 `policies_guards` 附录框架。 | 不写 policy 算法或矩阵。 |
| 3 | 创建 `views_materials` 附录框架。 | 不写 read model 字段全集或 projection 实现。 |
| 4 | 创建 `refs_trace_audit` 附录框架。 | 不写外部正文、raw log 或 payload。 |
| 5 | 创建 `operations_peripheral` 附录框架。 | 不写 job、worker、queue、retry 或调度。 |
| 6 | 回写主控文件附录状态。 | 将 5 个 planned 改为 framework_created,并推进到 `core_truth 附录对象批次:先思考`。 |
| 7 | 更新 flow / 台账。 | 恢复点同步到下一对象批次,不得跳到对象正文总写入。 |

#### 8.9.6 取舍

- 5 个附录在下一步可以一次性创建框架,因为这一步只是搭框架,不是填对象正文;每个文件都应保持轻量、可恢复。
- 对象卡片正文后续必须按附录逐批先思考、再写入。不能在创建框架时顺手写第一批对象。
- `Support summary / Basis` 暂允许分布在 `core_truth` 与 `refs_trace_audit` 两个附录之间,但下一步只建索引,不裁决全部字段细节。
- `Operations / Peripheral` 单独成附录,避免维护任务和外围包 / 方法集被误写成核心 truth 前置。

#### 8.9.7 越界检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否创建附录文件 | no | 当前只做先思考。 |
| 是否写对象卡片正文 | no | 只定义模板和对象索引。 |
| 是否回填正式 §6 | no | 必须等附录对象正文和反查审计完成。 |
| 是否允许进入下一模块 | pass | 下一模块为“五个附录文件框架:再写入”。 |

next_allowed_action: 等待用户确认后进入“五个附录文件框架:再写入”;只创建 5 个附录文件框架,不得写对象卡片正文,不得回填正式 §6。

### 8.10 五个附录文件框架:再写入

#### 8.10.1 写入内容

- 已创建 `02_hld_step_06_key_objects_core_truth.md`,状态为 `framework_created`。
- 已创建 `02_hld_step_06_key_objects_policies_guards.md`,状态为 `framework_created`。
- 已创建 `02_hld_step_06_key_objects_views_materials.md`,状态为 `framework_created`。
- 已创建 `02_hld_step_06_key_objects_refs_trace_audit.md`,状态为 `framework_created`。
- 已创建 `02_hld_step_06_key_objects_operations_peripheral.md`,状态为 `framework_created`。
- 每个附录只写文件头、职责边界、必读输入、对象索引、模块状态表、对象卡片模板、禁止事项和停审记录。
- 主控 `§3.1` 与 `§4.5` 已将 5 个附录状态从 `planned` 推进为 `framework_created`。

#### 8.10.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 裁决字段 / 状态 / 成员函数 / 工厂函数细节 | no |
| 回填正式 `02-概要设计.md` §6 | no |
| 启动 Step 7 / Step 8 / Step 9 | no |

#### 8.10.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 5 个附录框架创建 | pass |
| 是否保持对象正文为空 | pass |
| 是否同步主控附录索引状态 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `core_truth` 附录对象批次:先思考 |

next_allowed_action: 等待用户确认后进入 `core_truth` 附录对象批次:先思考;只允许读取主控、Step 5、00/01、core truth 附录和 L1-governance truth 附录,先裁决对象批次、来源回指和写入边界;不得直接写对象卡片正文,不得回填正式 §6。

### 8.11 `core_truth` 附录对象批次:先思考

#### 8.11.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `## 8. Core Truth 批次 A:定义与目录:先思考`。
- 已裁决 `core_truth` 附录不一次性写完 8 个对象,而是拆为:
  - 批次 A:`MethodAssetDefinition`;`MethodAssetCatalogEntry`
  - 批次 B:`FormalMethodAssetVersion`;`FormalizationState`
  - 批次 C:`MethodAssetRelation`
  - 批次 D:`FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary`
- 已裁决下一写入批次只写 `MethodAssetDefinition` 与 `MethodAssetCatalogEntry` 两个对象卡片。

#### 8.11.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 formal version / relation / summary 对象 | no |
| 回填正式 `02-概要设计.md` §6 | no |
| 启动 Step 7 / Step 8 / Step 9 | no |

#### 8.11.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 `core_truth` 批次 A 先思考 | pass |
| 下一批写入对象是否明确 | pass:`MethodAssetDefinition`;`MethodAssetCatalogEntry` |
| 是否保持先思考后写入 | pass |
| 是否越过概要设计粒度 | no |

next_allowed_action: 等待用户确认后进入 `core truth 批次 A:定义与目录:再写入`;只写 `MethodAssetDefinition` 与 `MethodAssetCatalogEntry` 两个对象卡片,不得写 typed ref 家族正文、catalog view、formal version、接口、repository、DTO、DDL、event payload 或状态迁移矩阵。

### 8.12 `core truth` 批次 A:定义与目录:再写入

#### 8.12.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A1. MethodAssetDefinition`。
- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A2. MethodAssetCatalogEntry`。
- 已将 `core_truth` 附录对象索引中两个对象状态更新为 `object_written`。
- 已将 `core_truth` 附录模块状态表中批次 A 再写入更新为 `done`。

#### 8.12.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 typed ref 家族正文 | no |
| 写 catalog view / read material | no |
| 写 formal version / formalization state | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.12.3 停审记录

| 检查项 | 结论 |
|---|---|
| `MethodAssetDefinition` 是否完成概要对象卡片 | pass |
| `MethodAssetCatalogEntry` 是否完成概要对象卡片 | pass |
| 是否保持概要设计粒度 | pass |
| 是否恢复旧 `MethodContent` / snapshot / fingerprint / outbox | no |
| 是否允许进入下一模块 | pass:下一模块为 `core truth 批次 B:正式化与版本状态:先思考` |

next_allowed_action: 等待用户确认后进入 `core truth 批次 B:正式化与版本状态:先思考`;只思考 `FormalMethodAssetVersion` 与 `FormalizationState` 写入边界,不得直接写对象卡片正文,不得回填正式 §6。

### 8.13 `core truth` 批次 B:正式化与版本状态:先思考

#### 8.13.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `## 10. Core Truth 批次 B:正式化与版本状态:先思考`。
- 已裁决批次 B 只写 `FormalMethodAssetVersion` 与 `FormalizationState` 两个对象。
- 已裁决 `FormalizationBasisSummary` 留到 support summary 批次 D,不混入版本 truth / 状态 owner。
- 已裁决 `FormalizationEligibilityRule` 与 `VersionStabilityRule` 留到 `policies_guards` 附录,本批只保留约束说明。
- 已明确下一步写入边界:只写两个概要对象卡片,不写版本算法、状态迁移矩阵、接口、流程、read model 或旧机制。

#### 8.13.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 basis summary / external summary | no |
| 写 policy / guard 对象正文 | no |
| 写 formal version view / read material | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.13.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 `core_truth` 批次 B 先思考 | pass |
| 下一批写入对象是否明确 | pass:`FormalMethodAssetVersion`;`FormalizationState` |
| 是否保持先思考后写入 | pass |
| 是否越过概要设计粒度 | no |
| 是否允许进入下一模块 | pass:下一模块为 `core truth 批次 B:正式化与版本状态:再写入` |

next_allowed_action: 等待用户确认后进入 `core truth 批次 B:正式化与版本状态:再写入`;只写 `FormalMethodAssetVersion` 与 `FormalizationState` 两个对象卡片,不得写 basis summary、policy guard、read model、接口、流程、状态迁移矩阵或旧机制。

### 8.14 `core truth` 批次 B:正式化与版本状态:再写入

#### 8.14.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A3. FormalMethodAssetVersion`。
- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A4. FormalizationState`。
- 已将 `core_truth` 附录对象索引中两个对象状态更新为 `object_written`。
- 已将 `core_truth` 附录模块状态表中批次 B 再写入更新为 `done`。
- 已将主控当前恢复点推进到 `support truth 批次 C:关系:先思考`。

#### 8.14.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 basis summary / external summary | no |
| 写 policy / guard 对象正文 | no |
| 写 formal version view / read material | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写完整状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.14.3 停审记录

| 检查项 | 结论 |
|---|---|
| `FormalMethodAssetVersion` 是否完成概要对象卡片 | pass |
| `FormalizationState` 是否完成概要对象卡片 | pass |
| 是否保持概要设计粒度 | pass |
| 是否选择 semver / hash / fingerprint / snapshot 算法 | no |
| 是否恢复旧 publish / outbox 主线 | no |
| 是否允许进入下一模块 | pass:下一模块为 `support truth 批次 C:关系:先思考` |

next_allowed_action: 等待用户确认后进入 `support truth 批次 C:关系:先思考`;只思考 `MethodAssetRelation` 写入边界,不得直接写对象卡片正文,不得回填正式 §6。

### 8.15 `support truth` 批次 C:关系:先思考

#### 8.15.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `## 12. Support Truth 批次 C:关系:先思考`。
- 已裁决批次 C 只写 `MethodAssetRelation` 一个对象。
- 已裁决 `MethodAssetDistributionRef`、`DistributionContextRef`、`RelatedMethodAssetRef` 等 typed ref / boundary 对象留到 `refs_trace_audit` 附录。
- 已裁决 `RelationIntegrityRule` 与 `DistributionBoundaryRule` 留到 `policies_guards` 附录。
- 已裁决 `MethodAssetRelationView` 和 `DistributionReadMaterial` 留到 `views_materials` 附录。
- 已明确下一步写入边界:只写一个概要对象卡片,不写图算法、分发协议、marketplace 交易、接口、流程、read model 或旧机制。

#### 8.15.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 distribution ref / context ref 正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 relation view / distribution read material | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.15.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 `support truth` 批次 C 先思考 | pass |
| 下一批写入对象是否明确 | pass:`MethodAssetRelation` |
| 是否保持先思考后写入 | pass |
| 是否越过概要设计粒度 | no |
| 是否允许进入下一模块 | pass:下一模块为 `support truth 批次 C:关系:再写入` |

next_allowed_action: 等待用户确认后进入 `support truth 批次 C:关系:再写入`;只写 `MethodAssetRelation` 一个对象卡片,不得写 distribution ref、policy guard、read model、trace/history、接口、流程、状态迁移矩阵或旧机制。

### 8.16 `support truth` 批次 C:关系:再写入

#### 8.16.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A5. MethodAssetRelation` 对象卡片。
- 已将 `core_truth` 附录对象索引中 `MethodAssetRelation` 状态更新为 `object_written`。
- 已将 `core_truth` 附录模块状态表中 `support truth 批次 C:关系:再写入` 更新为 `done`。
- 已将主控当前恢复点推进到 `support summary 批次 D:先思考`。

#### 8.16.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 distribution ref / context ref / related ref 正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 relation view / distribution read material | no |
| 写 trace / history / audit 正文 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.16.3 停审记录

| 检查项 | 结论 |
|---|---|
| `MethodAssetRelation` 是否完成概要对象卡片 | pass |
| 是否保持 support truth 边界 | pass |
| 是否把 distribution / policy / read model 混入对象正文 | no |
| 是否恢复旧 graph / publish / outbox / marketplace 主线 | no |
| 是否允许进入下一模块 | pass:下一模块为 `support summary 批次 D:先思考` |

next_allowed_action: 等待用户确认后进入 `support summary 批次 D:先思考`;只思考 `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 三个 summary 对象的写入边界,不得直接写对象卡片正文,不得回填正式 §6。

### 8.17 `support summary` 批次 D:先思考

#### 8.17.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `## 14. Support Summary 批次 D:先思考`。
- 已裁决批次 D 写入 `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 三个 support summary 对象。
- 已明确 `ExternalSourceSummary` 是外部来源安全摘要边界,不得保存外部正文、artifact 正文、archive 包、marketplace 交易或外部系统运行状态。
- 已明确 `FormalizationBasisSummary` 是正式化依据摘要,不得保存治理执行、审批流程、policy enforce 或治理裁决正文。
- 已明确 `ConsumptionImpactSummary` 是下游影响摘要,不得保存下游运行状态、同步成功记录、回报协议或对账算法。
- 已将主控当前恢复点推进到 `support summary 批次 D:再写入`。

#### 8.17.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写三个 summary 对象卡片正文 | no |
| 写 typed ref 家族正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 read model / projection | no |
| 写 trace / history / audit 正文 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.17.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 `support summary` 批次 D 先思考 | pass |
| 下一批写入对象是否明确 | pass:`FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` |
| 是否保持 summary / ref / body-free 边界 | pass |
| 是否把外部正文 / 治理执行 / 下游运行 truth 写入本仓 | no |
| 是否允许进入下一模块 | pass:下一模块为 `support summary 批次 D:再写入` |

next_allowed_action: 等待用户确认后进入 `support summary 批次 D:再写入`;只写 `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 三个对象卡片,不得写 typed ref 家族正文、policy guard、read model、trace/history、接口、流程、状态迁移矩阵或旧机制。

### 8.18 `support summary` 批次 D:再写入

#### 8.18.1 写入内容

- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A6. FormalizationBasisSummary` 对象卡片。
- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A7. ExternalSourceSummary` 对象卡片。
- 已在 `02_hld_step_06_key_objects_core_truth.md` 写入 `A8. ConsumptionImpactSummary` 对象卡片。
- 已将 `core_truth` 附录对象索引中三个 summary 对象状态更新为 `object_written`。
- 已将 `core_truth` 附录模块状态表中 `support summary 批次 D:再写入` 更新为 `done`。
- 已将主控当前恢复点推进到 `policies_guards boundary / guard 批次:先思考`。

#### 8.18.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 typed ref 家族正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 read model / projection | no |
| 写 trace / history / audit 正文 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.18.3 停审记录

| 检查项 | 结论 |
|---|---|
| 三个 summary 对象是否完成概要对象卡片 | pass |
| 是否保持 summary / ref / body-free 边界 | pass |
| 是否保存外部正文 / 治理执行 / 下游运行 truth | no |
| 是否完成 `core_truth` 附录对象批次 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `policies_guards boundary / guard 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `policies_guards boundary / guard 批次:先思考`;只思考 boundary / guard 对象批次、来源回指和写入边界,不得直接写对象卡片正文,不得回填正式 §6。

### 8.19 `policies_guards` boundary / guard 批次:先思考

#### 8.19.1 写入内容

- 已在 `02_hld_step_06_key_objects_policies_guards.md` 写入 `## 8. Boundary / Guard 批次:先思考`。
- 已裁决本批只写 `DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 三个对象。
- 已裁决 `PackageCompositionRule` 后移到 policy / invariant 批次,本批只把外围不可前置作为约束点名。
- 已明确本批不得写完整 policy engine、规则矩阵、配置项、接口、处理流、状态迁移、read model 或 typed ref 家族正文。
- 已将主控当前恢复点推进到 `policies_guards boundary / guard 批次:再写入`。

#### 8.19.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 boundary / guard 对象卡片正文 | no |
| 写 policy / invariant 批次对象正文 | no |
| 写完整算法 / 规则矩阵 / 配置项 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.19.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 boundary / guard 批次先思考 | pass |
| 下一批写入对象是否明确 | pass:`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule` |
| 是否保持先思考后写入 | pass |
| 是否把 `PackageCompositionRule` 混入本批 | no |
| 是否允许进入下一模块 | pass:下一模块为 `policies_guards boundary / guard 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `policies_guards boundary / guard 批次:再写入`;只写 `DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 三个对象卡片,不得写 policy/invariant 批次对象、完整算法、配置、接口、流程、状态迁移或正式 §6。

### 8.20 `policies_guards` boundary / guard 批次:再写入

#### 8.20.1 写入内容

- 已在 `02_hld_step_06_key_objects_policies_guards.md` 写入 `DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 三个概要对象卡片。
- 已将 `DefinitionUseBoundaryGuard` 固定为 Definition vs Use guard,用于阻止下游私有定义、消费材料反写和未授权使用口径。
- 已将 `DownstreamConsumptionBoundary` 固定为下游消费 boundary,用于声明消费语境、正式版本要求、允许使用和禁止反写边界。
- 已将 `ExternalBodyBoundaryRule` 固定为外部正文禁止 guard,用于统一阻止外部正文、artifact/archive 正文、证据正文和 marketplace 正文入仓。
- 已将主控当前恢复点推进到 `policies_guards policy / invariant 批次:先思考`。

#### 8.20.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 `FormalizationEligibilityRule` / `ConsistencyProtectionPolicy` / `RelationIntegrityRule` / `PackageCompositionRule` | no:留给 policy / invariant 批次 |
| 写完整算法 / 规则矩阵 / 配置项 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写处理流 / 状态迁移矩阵 | no |
| 写 read model 或 typed ref 家族正文 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.20.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 boundary / guard 批次再写入 | pass |
| 三个对象是否均回指 Step 5 组成部分 | pass |
| 是否保持 no downstream truth / no external body | pass |
| 是否越界写 policy / invariant 批次对象 | no |
| 是否允许进入下一模块 | pass:下一模块为 `policies_guards policy / invariant 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `policies_guards policy / invariant 批次:先思考`;只思考 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个对象的写入边界,不得直接写对象卡片正文、完整算法、配置、接口、流程、状态迁移或正式 §6。

### 8.21 `policies_guards` policy / invariant 批次:先思考

#### 8.21.1 写入内容

- 已在 `02_hld_step_06_key_objects_policies_guards.md` 写入 `## 10. Policy / Invariant 批次:先思考`。
- 已裁决下一批只写 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个对象。
- 已裁决 `VersionStabilityRule` 并入 `FormalMethodAssetVersion` 和 `ConsistencyProtectionPolicy`,不单独新增对象。
- 已裁决 `ImpactClassificationRule` 并入 `ConsumptionImpactSummary` 和 `ConsistencyProtectionPolicy`,不单独新增对象。
- 已裁决 `DistributionBoundaryRule` 并入 `MethodAssetDistributionRef` 和 `RelationIntegrityRule`,不单独新增对象。
- 已裁决 `MethodSetAssemblyRule` 并入 `PackageCompositionRule`,不单独新增对象。
- 已将主控当前恢复点推进到 `policies_guards policy / invariant 批次:再写入`。

#### 8.21.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 policy / invariant 对象卡片正文 | no |
| 写完整算法 / 规则矩阵 / 配置项 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写处理流 / 状态迁移矩阵 | no |
| 写 read model 或 typed ref 家族正文 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.21.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 policy / invariant 批次先思考 | pass |
| 下一批写入对象是否明确 | pass:`FormalizationEligibilityRule`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`PackageCompositionRule` |
| 是否保持先思考后写入 | pass |
| 是否新增批次外对象 | no |
| 是否允许进入下一模块 | pass:下一模块为 `policies_guards policy / invariant 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `policies_guards policy / invariant 批次:再写入`;只写 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个对象卡片,不得写完整算法、配置、接口、流程、状态迁移、typed ref 家族正文或正式 §6。

### 8.22 `policies_guards` policy / invariant 批次:再写入

#### 8.22.1 写入内容

- 已在 `02_hld_step_06_key_objects_policies_guards.md` 写入 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个概要对象卡片。
- 已将 `FormalizationEligibilityRule` 固定为正式化资格 policy / invariant,用于阻止隐式正式化和治理执行入仓。
- 已将 `ConsistencyProtectionPolicy` 固定为一致性保护 policy / guard,用于保护正式版本语义变化和既有正式消费。
- 已将 `RelationIntegrityRule` 固定为关系完整性 policy / invariant,用于保护关系端点、正式化状态和分发边界。
- 已将 `PackageCompositionRule` 固定为外围 composition policy / invariant,用于约束 package / method set 不反写 core truth、不扩大消费授权、不阻塞核心闭环。
- 已将主控当前恢复点推进到 `views_materials catalog / consumption material 批次:先思考`。

#### 8.22.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 view / read material 对象卡片正文 | no |
| 写完整算法 / 规则矩阵 / 配置项 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写处理流 / 状态迁移矩阵 | no |
| 写 typed ref 家族正文 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.22.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 policy / invariant 批次再写入 | pass |
| 四个对象是否均回指 Step 5 组成部分 | pass |
| 是否保持 no downstream truth / no external body / no policy engine | pass |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials catalog / consumption material 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `views_materials catalog / consumption material 批次:先思考`;只思考目录、消费材料和可用性 view 批次,不得直接写对象卡片正文,不得回填正式 §6。

### 8.23 `views_materials` catalog / consumption material 批次:先思考

#### 8.23.1 写入内容

- 已在 `02_hld_step_06_key_objects_views_materials.md` 完成本批思考记录,仅裁决目录、消费材料和可用性 view 的写入边界。
- 已确认下一写入批次只写 `MethodAssetCatalogView`、`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView` 三个对象卡片。
- 已确认 `MethodAssetConsumptionReadMaterial` 并入 `MethodAssetConsumptionMaterial`,不再作为独立对象卡片写入。
- 已确认 `MethodAssetCatalogView` 必须从 definition / catalog truth 派生,不得替代 `MethodAssetDefinition` 或 `MethodAssetCatalogEntry`。
- 已确认 `MethodAssetConsumptionMaterial` 是 read material / boundary,用于正式消费材料承载,不得成为下游私有定义副本或运行 truth。
- 已确认 `MethodAssetAvailabilityView` 是 projection / state view,只表达可消费、待收敛、过期和不可用读取线索;完整状态迁移留 Step 9。

#### 8.23.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 `MethodAssetConsumptionReadMaterial` 独立卡片 | no |
| 写 trace / relation / external / maintenance / package view 对象 | no |
| 写 projection rebuild 算法 / cache / index / store | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.23.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 catalog / consumption material 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:`MethodAssetCatalogView`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView` |
| 是否处理合并对象 | pass:`MethodAssetConsumptionReadMaterial` 并入 `MethodAssetConsumptionMaterial` |
| 是否保持 view / material 非 truth | pass |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials catalog / consumption material 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `views_materials catalog / consumption material 批次:再写入`;只写 `MethodAssetCatalogView`、`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView` 三个对象卡片,不得写 `MethodAssetConsumptionReadMaterial` 独立卡片,不得写批次外对象或正式 §6。

### 8.24 `views_materials` catalog / consumption material 批次:再写入

#### 8.24.1 写入内容

- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C1 MethodAssetCatalogView` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C2 MethodAssetConsumptionMaterial` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C3 MethodAssetAvailabilityView` 对象卡片。
- 已将 `MethodAssetConsumptionReadMaterial` 维持为并入 `MethodAssetConsumptionMaterial`,未生成独立对象卡片。
- 已将 `views_materials` 附录对象索引中三项状态更新为 `object_written`。
- 已将主控当前恢复点推进到 `views_materials trace / relation / external view 批次:先思考`。

#### 8.24.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 trace / relation / external view 对象卡片 | no |
| 写 maintenance / peripheral view 对象卡片 | no |
| 写 `MethodAssetConsumptionReadMaterial` 独立卡片 | no |
| 写 projection rebuild 算法 / cache / index / store | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.24.3 停审记录

| 检查项 | 结论 |
|---|---|
| 三个 catalog / consumption material 对象是否完成概要卡片 | pass |
| 是否保持 view / material 非 truth | pass |
| 是否避免重复消费读取对象 | pass |
| 是否越界写接口、流程、状态或正式 §6 | no |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials trace / relation / external view 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `views_materials trace / relation / external view 批次:先思考`;只思考 `MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactView`、`MethodAssetRelationView`、`DistributionReadMaterial`、`ExternalSourceSummaryView` 的写入边界,不得直接写对象卡片正文、projection 实现、接口、流程、状态迁移或正式 §6。

### 8.25 `views_materials` trace / relation / external view 批次:先思考

#### 8.25.1 写入内容

- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `Trace / Relation / External View 批次:先思考`。
- 已确认下一写入批次只写六个对象卡片:`MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactView`、`MethodAssetRelationView`、`DistributionReadMaterial`、`ExternalSourceSummaryView`。
- 已确认 `MethodAssetTraceMaterial` 和 `MethodAssetTraceView` 不替代 audit trail、history 或 lineage。
- 已确认 `ConsumptionImpactView` 只从 `ConsumptionImpactSummary`、trace material 和消费语境派生,不得拥有下游运行 truth。
- 已确认 `MethodAssetRelationView` 和 `DistributionReadMaterial` 不替代 `MethodAssetRelation` truth,也不得进入 marketplace listing、交易、安装或履约。
- 已确认 `ExternalSourceSummaryView` 只读取 body-free summary/ref/marker,不得保存外部正文、artifact/archive 包体或外部 API payload。
- 已将 `views_materials` 附录对象索引中六个对象状态更新为 `ready_for_object_write`。
- 已将主控当前恢复点推进到 `views_materials trace / relation / external view 批次:再写入`。

#### 8.25.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 maintenance / peripheral view 对象卡片 | no |
| 写 audit / history / lineage 对象 | no |
| 写 typed ref 家族正文 | no |
| 写 projection rebuild / trace 计算 / 关系图 / 外部解析算法 | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.25.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 trace / relation / external view 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:六个 view/material 对象 |
| 是否保持 view / material 非 truth | pass |
| 是否把 audit/history/lineage 或 typed ref 混入本批 | no |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials trace / relation / external view 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `views_materials trace / relation / external view 批次:再写入`;只写 `MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactView`、`MethodAssetRelationView`、`DistributionReadMaterial`、`ExternalSourceSummaryView` 六个对象卡片,不得写 audit/history/lineage、typed ref 正文、projection 实现、接口、流程、状态迁移或正式 §6。

### 8.26 `views_materials` trace / relation / external view 批次:再写入

#### 8.26.1 写入内容

- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C4 MethodAssetTraceMaterial` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C5 MethodAssetTraceView` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C6 ConsumptionImpactView` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C7 MethodAssetRelationView` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C8 DistributionReadMaterial` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C9 ExternalSourceSummaryView` 对象卡片。
- 已将 `views_materials` 附录对象索引中六个对象状态更新为 `object_written`。
- 已将主控当前恢复点推进到 `views_materials maintenance / peripheral view 批次:先思考`。

#### 8.26.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 maintenance / peripheral view 对象卡片 | no |
| 写 audit / history / lineage 对象 | no |
| 写 typed ref 家族正文 | no |
| 写 projection rebuild / trace 计算 / 关系图 / 外部解析算法 | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.26.3 停审记录

| 检查项 | 结论 |
|---|---|
| 六个 trace / relation / external view/material 对象是否完成概要卡片 | pass |
| 是否保持 view / material 非 truth | pass |
| 是否避免 audit/history/lineage 和 typed ref 越界 | pass |
| 是否避免 marketplace / external body 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials maintenance / peripheral view 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `views_materials maintenance / peripheral view 批次:先思考`;只思考 `MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView` 的写入边界,不得直接写对象卡片正文、job/worker、UI 状态、marketplace 交易、接口、流程、状态迁移或正式 §6。

### 8.27 `views_materials` maintenance / peripheral view 批次:先思考

#### 8.27.1 写入内容

- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `Maintenance / Peripheral View 批次:先思考`。
- 已确认下一写入批次只写三个对象卡片:`MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView`。
- 已确认 `MaintenanceProgressView` 只表达维护 run、refresh scope、材料 freshness、待收敛、待恢复和不可用等读取线索,不得替代 maintenance task、recovery task 或 job 状态。
- 已确认 `MethodPackageView` 只从外围 package truth、核心 refs、distribution context 和 marketplace context/ref 派生,不得成为 package truth、marketplace listing、安装包或交易履约状态。
- 已确认 `MethodSetAssemblyView` 只从 method set assembly truth、package/member refs、composition rule 和 adoption context 派生,不得成为 method set truth、组织运行配置、AI policy override 或 UI 匹配状态。
- 已确认 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MethodPackage`、`MethodSetAssembly` 属于 operations / peripheral 附录,本批不写其对象卡片。
- 已将 `views_materials` 附录对象索引中三个对象状态更新为 `ready_for_object_write`。
- 已将主控当前恢复点推进到 `views_materials maintenance / peripheral view 批次:再写入`。

#### 8.27.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 maintenance task / recovery task 对象 | no |
| 写 `MethodPackage` / `MethodSetAssembly` truth 对象 | no |
| 写 job / worker / scheduler / queue / topic / retry / telemetry schema | no |
| 写 marketplace listing / transaction / installation / fulfillment | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.27.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 maintenance / peripheral view 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:`MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView` |
| 是否保持 view / material 非 truth | pass |
| 是否避免 task / peripheral truth 和 marketplace 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials maintenance / peripheral view 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `views_materials maintenance / peripheral view 批次:再写入`;只写 `MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView` 三个对象卡片,不得写 maintenance task、peripheral truth、job/worker、marketplace 交易、接口、流程、状态迁移或正式 §6。

### 8.28 `views_materials` maintenance / peripheral view 批次:再写入

#### 8.28.1 写入内容

- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C10 MaintenanceProgressView` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C11 MethodPackageView` 对象卡片。
- 已在 `02_hld_step_06_key_objects_views_materials.md` 写入 `C12 MethodSetAssemblyView` 对象卡片。
- 已确认 `MaintenanceProgressView` 是 body-free 维护进度读取视图,不是 maintenance task、job 状态、telemetry truth 或核心业务 truth。
- 已确认 `MethodPackageView` 是外围 package 读取视图,不是 package truth、marketplace listing、安装包或交易履约状态。
- 已确认 `MethodSetAssemblyView` 是外围 method set assembly 读取视图,不是 method set truth、组织运行配置、AI policy override 或正式消费授权。
- 已将 `views_materials` 附录对象索引中三个对象状态更新为 `object_written`。
- 已将主控当前恢复点推进到 `refs_trace_audit typed ref 批次:先思考`。

#### 8.28.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 maintenance task / recovery task 对象 | no |
| 写 `MethodPackage` / `MethodSetAssembly` truth 对象 | no |
| 写 typed ref 正文 | no:含 `MethodSetAssemblyRef` 的正式 ref 家族留给 refs_trace_audit 批次裁决 |
| 写 trace / audit / history / lineage 对象 | no |
| 写 job / worker / scheduler / queue / topic / retry / telemetry schema | no |
| 写 marketplace listing / transaction / installation / fulfillment | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.28.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 maintenance / peripheral view 批次再写入 | pass |
| 三个 view 对象是否均回指 Step 5 组成部分 | pass |
| 是否保持 view / material 非 truth | pass |
| 是否避免 task / peripheral truth 和 marketplace 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `refs_trace_audit typed ref 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit typed ref 批次:先思考`;只思考 typed ref / external ref 家族分组和来源边界,不得直接写 ref 对象卡片正文、trace/audit/history 对象、payload schema、接口、流程、状态迁移或正式 §6。

### 8.29 `refs_trace_audit` typed ref 批次:先思考

#### 8.29.1 写入内容

- 已在 `02_hld_step_06_key_objects_refs_trace_audit.md` 写入 `Typed Ref 批次:先思考`。
- 已确认下一写入批次只写 16 个 typed / external ref 对象卡片:`MethodAssetDefinitionRef`、`CatalogScopeRef`、`GovernanceBasisRef`、`ConsumptionContextRef`、`TraceSubjectRef`、`ConsumptionImpactSourceRef`、`RelatedMethodAssetRef`、`MethodAssetDistributionRef`、`DistributionContextRef`、`ExternalSourceRef`、`ArtifactArchiveRef`、`MaintenanceRunRef`、`RefreshScopeRef`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef`。
- 已确认 `MethodSetAssemblyRef` 必须进入本批,因为 Step 5 已列为 reference candidate,且 `MethodSetAssemblyView` 已使用它作为来源锚点。
- 已裁决下一写入可按 core/formal、trace/relation、external/operation/peripheral 三个 patch 组分批写入,但仍属于同一个 `typed ref 批次:再写入` 模块。
- 已确认 trace、audit、history、lineage 对象留给后续批次,本批不写 raw log、payload schema 或 report schema。
- 已将 `refs_trace_audit` 附录中 16 个 ref 对象状态更新为 `ready_for_object_write`。
- 已将主控当前恢复点推进到 `refs_trace_audit typed ref 批次:再写入`。

#### 8.29.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 ref 对象卡片正文 | no |
| 写 trace / audit / history / lineage 对象 | no |
| 新增额外历史 ref 名称 | no |
| 写 event payload / outbox schema / report schema / storage schema | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.29.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 typed ref 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:16 个 typed / external ref 对象 |
| 是否补齐 `MethodSetAssemblyRef` 候选 | pass |
| 是否避免 trace / audit / history 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `refs_trace_audit typed ref 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit typed ref 批次:再写入`;只写 typed / external ref 对象卡片,不得写 trace/audit/history/lineage 对象、payload schema、接口、流程、状态迁移或正式 §6。

### 8.30 `refs_trace_audit` typed ref 批次:再写入

#### 8.30.1 写入内容

- 已在 `02_hld_step_06_key_objects_refs_trace_audit.md` 写入 16 个 typed / external ref 对象卡片。
- 已完成 core / formal / consumption refs:`MethodAssetDefinitionRef`、`CatalogScopeRef`、`GovernanceBasisRef`、`ConsumptionContextRef`。
- 已完成 trace / relation refs:`TraceSubjectRef`、`ConsumptionImpactSourceRef`、`RelatedMethodAssetRef`、`MethodAssetDistributionRef`、`DistributionContextRef`。
- 已完成 external / operation / peripheral refs:`ExternalSourceRef`、`ArtifactArchiveRef`、`MaintenanceRunRef`、`RefreshScopeRef`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef`。
- 已将 `refs_trace_audit` 附录中 16 个 ref 对象状态更新为 `object_written`。
- 已将主控当前恢复点推进到 `refs_trace_audit trace / audit / history 批次:先思考`。

#### 8.30.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 trace / audit / history / lineage 对象 | no |
| 写 event payload / outbox schema / report schema / storage schema | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.30.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 typed ref 批次再写入 | pass |
| 是否保持 ref body-free / no external body | pass |
| 是否避免 trace / audit / history 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `refs_trace_audit trace / audit / history 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit trace / audit / history 批次:先思考`;只思考 trace、audit、history、lineage 对象边界,不得直接写对象卡片正文、payload schema、接口、流程、状态迁移或正式 §6。

### 8.31 `refs_trace_audit` trace / audit / history 批次:先思考

#### 8.31.1 写入内容

- 已在 `02_hld_step_06_key_objects_refs_trace_audit.md` 写入 `Trace / Audit / History 批次:先思考`。
- 已确认下一写入批次只写 9 个对象卡片:`MethodAssetAuditTrail`、`MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial`、`MethodAssetEvidenceLineage`、`RelationChangeHistory`、`ExternalBasisAcceptanceHistory`、`MaintenanceRunHistory`、`PackageAssemblyHistory`。
- 已确认这些对象都必须保持 body-free / no raw log / no evidence body,只组织变化线索、来源回指、摘要校验和审计可读解释。
- 已裁决下一写入可按 core/formal/consumption history、audit/evidence/relation lineage、external/maintenance/peripheral history 三个 patch 组分批写入,但仍属于同一个 `trace / audit / history 批次:再写入` 模块。
- 已确认不新增 `ConsumptionLineageRef`、`EvidenceLineageRef`、`ExternalSourceLineageRef`、`RelationDistributionLineageRef` 等额外 ref 名称。
- 已将 `refs_trace_audit` 附录中 9 个 trace / audit / history / lineage 对象状态更新为 `ready_for_object_write`。
- 已将主控当前恢复点推进到 `refs_trace_audit trace / audit / history 批次:再写入`。

#### 8.31.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 event payload / outbox schema / report schema / storage schema | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.31.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 trace / audit / history 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:9 个 trace / audit / history / lineage 对象 |
| 是否保持 body-free / no raw log / no external body | pass |
| 是否允许进入下一模块 | pass:下一模块为 `refs_trace_audit trace / audit / history 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit trace / audit / history 批次:再写入`;只写 9 个 trace / audit / history / lineage 对象卡片,不得写 payload schema、接口、流程、状态迁移或正式 §6。

### 8.32 `refs_trace_audit` trace / audit / history 批次:再写入

#### 8.32.1 写入内容

- 已在 `02_hld_step_06_key_objects_refs_trace_audit.md` 写入 9 个 trace / audit / history / lineage 对象卡片。
- 已完成 core / formal / consumption history:`MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial`。
- 已完成 audit / evidence / relation lineage:`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`RelationChangeHistory`。
- 已完成 external / maintenance / peripheral history:`ExternalBasisAcceptanceHistory`、`MaintenanceRunHistory`、`PackageAssemblyHistory`。
- 已确认 history / audit / lineage 对象只保存 body-free 变化线索、来源回指、摘要校验和 safe audit material,不替代当前 truth。
- 已将 `refs_trace_audit` 附录中 9 个 trace / audit / history / lineage 对象状态更新为 `object_written`。
- 已将主控当前恢复点推进到 `operations_peripheral maintenance task 批次:先思考`。

#### 8.32.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 event payload / outbox schema / report schema / storage schema | no |
| 写 audit log schema / telemetry / metric / trace span | no |
| 写 evidence JSON / report body / artifact body / archive body | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.32.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 trace / audit / history 批次再写入 | pass |
| 是否保持 body-free / no raw log / no external body | pass |
| 是否避免 history / audit / lineage 替代当前 truth | pass |
| 是否允许进入下一模块 | pass:下一模块为 `operations_peripheral maintenance task 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `operations_peripheral maintenance task 批次:先思考`;只思考 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 写入边界,不得直接写对象卡片正文、job/worker、接口、流程、状态迁移或正式 §6。

### 8.33 `operations_peripheral` maintenance task 批次:先思考

#### 8.33.1 写入内容

- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `Maintenance Task 批次:先思考`。
- 已确认下一写入批次只写三个对象卡片:`ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`。
- 已确认三者都是 operation/support 对象,不得成为业务 truth、job 调度实现、worker 运行记录或恢复脚本。
- 已确认 `ReadMaterialRefreshTask` 只推动正式读取材料、目录材料、消费材料、关系/分发读取材料收敛,不得修改 core truth。
- 已确认 `TraceMaterialRefreshTask` 只推动追溯材料、证据 lineage 和影响摘要材料收敛,不得保存 raw log、report body、证据正文或 artifact/archive 包体。
- 已确认 `ConsistencyRecoveryTask` 只承接可恢复异常的收敛线索,不得自动重做正式化、修复 truth、复制外部正文或扫描下游运行 truth。
- 已将 `operations_peripheral` 附录中三个 maintenance task / recovery 对象状态更新为 `ready_for_object_write`。
- 已将主控当前恢复点推进到 `operations_peripheral maintenance task 批次:再写入`。

#### 8.33.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 job / worker / scheduler / queue / topic / retry / lock / storage | no |
| 写接口 / DTO / event payload / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.33.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 maintenance task 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:`ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` |
| 是否避免 job/worker 和 truth 修复越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `operations_peripheral maintenance task 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `operations_peripheral maintenance task 批次:再写入`;只写 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 三个对象卡片,不得写 job/worker、接口、流程、状态迁移或正式 §6。

### 8.34 `operations_peripheral` maintenance task 批次:再写入

#### 8.34.1 写入内容

- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `E1 ReadMaterialRefreshTask` 对象卡片。
- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `E2 TraceMaterialRefreshTask` 对象卡片。
- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `E3 ConsistencyRecoveryTask` 对象卡片。
- 已确认三者只表达 operation/support 语义,不成为 business truth、job 实现、恢复脚本或状态迁移矩阵。
- 已将 `operations_peripheral` 附录中三个 maintenance task / recovery 对象状态更新为 `object_written`。
- 已将主控当前恢复点推进到 `operations_peripheral peripheral organization 批次:先思考`。

#### 8.34.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 job / worker / scheduler / queue / topic / retry / lock / storage | no |
| 写 cache / index / DB table / projection rebuild algorithm | no |
| 写接口 / DTO / event payload / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.34.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 maintenance task 批次再写入 | pass |
| 是否保持 operation/support 而非业务 truth | pass |
| 是否避免 job/worker 和 truth 修复越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `operations_peripheral peripheral organization 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `operations_peripheral peripheral organization 批次:先思考`;只思考 `MethodPackage`、`MethodSetAssembly` 写入边界,不得直接写对象卡片正文、marketplace 交易、安装履约、接口、流程、状态迁移或正式 §6。

### 8.35 `operations_peripheral` peripheral organization 批次:先思考

#### 8.35.1 写入内容

- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `Peripheral Organization 批次:先思考`。
- 已确认下一写入批次只写两个对象卡片:`MethodPackage`、`MethodSetAssembly`。
- 已确认二者都是 peripheral truth candidate,不得成为核心定义、正式版本、受控消费、追溯或关系 truth 的前置。
- 已确认 `MethodPackage` 只表达围绕已成立方法资产形成的外围包组织语义,不得滑向 marketplace listing、安装包、artifact/archive 包体或交易履约。
- 已确认 `MethodSetAssembly` 只表达组织级方法集组装语义,不得滑向组织运行配置、console UI 匹配状态、SDK 本地状态或 AI policy override 实现。
- 已确认 `PackageCompositionRule`、`MethodPackageView`、`MethodSetAssemblyView`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef` 和 `PackageAssemblyHistory` 已在其他附录完成,本批只引用不重复写。
- 已将 `operations_peripheral` 附录中两个 peripheral organization 对象状态更新为 `ready_for_object_write`。
- 已将主控当前恢复点推进到 `operations_peripheral peripheral organization 批次:再写入`。

#### 8.35.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写对象卡片正文 | no |
| 写 marketplace 交易 / 安装履约 / 包体 / 组织运行配置 | no |
| 写接口 / DTO / event payload / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.35.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 peripheral organization 批次先思考 | pass |
| 是否裁决下一写入对象 | pass:`MethodPackage`;`MethodSetAssembly` |
| 是否避免外围组织反向成为核心前置 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `operations_peripheral peripheral organization 批次:再写入` |

next_allowed_action: 等待用户确认后进入 `operations_peripheral peripheral organization 批次:再写入`;只写 `MethodPackage`、`MethodSetAssembly` 两个对象卡片,不得写 marketplace 交易、安装履约、包体、组织运行配置、接口、流程、状态迁移或正式 §6。

### 8.36 `operations_peripheral` peripheral organization 批次:再写入

#### 8.36.1 写入内容

- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `E4 MethodPackage` 对象卡片。
- 已在 `02_hld_step_06_key_objects_operations_peripheral.md` 写入 `E5 MethodSetAssembly` 对象卡片。
- 已确认二者只表达外围组织 truth candidate,不成为核心定义、正式版本、受控消费、追溯或关系 truth 的前置。
- 已确认二者只引用已成立或允许引用的 typed refs / context refs,不得使用 marketplace id、listing id、package file path、URL、route param 或 free-form string 替代稳定引用。
- 已将 `operations_peripheral` 附录中两个 peripheral organization 对象状态更新为 `object_written`。
- 已将主控当前恢复点推进到 Step 6 `跨附录闭环审计:先思考`。

#### 8.36.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 marketplace listing / 定价 / 订单 / 购买 / 结算 / 安装 / 履约 | no |
| 写 package binary / archive body / artifact body / 外部 package storage 内容 | no |
| 写组织运行配置 / UI 匹配状态 / SDK 本地状态 / AI policy override 实现 | no |
| 写接口 / DTO / event payload / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

#### 8.36.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 peripheral organization 批次再写入 | pass |
| 是否保持外围增强而非核心前置 | pass |
| 是否避免 marketplace / 安装履约 / 包体越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 Step 6 `跨附录闭环审计:先思考` |

next_allowed_action: 等待用户确认后进入 Step 6 `跨附录闭环审计:先思考`;不得直接回填正式 §6,不得进入 Step 7/8/9。

### 8.37 跨附录闭环审计:先思考

#### 8.37.1 问题回答

- 本模块只搭建 Step 6 跨附录闭环审计框架,不直接写审计结论表。
- 下一写入批次只允许写四类审计表:
  - 对象清单完整性与重复对象审计。
  - Step 5 组成部分到 Step 6 对象覆盖审计。
  - Step 8 / Step 9 反查入口审计。
  - 旧主语污染与后续正式 §6 回填风险审计。
- 审计对象范围限定为主控文件和 5 个 Step 6 对象附录,不得引入新对象卡片、接口、处理流、状态迁移或详细设计 schema。
- 审计通过后才允许进入 `正式 §6 回填草稿:先思考`;若发现缺口,必须在 Step 6 内回到对应附录修正,不能交给 Step 7/8/9 自行补口。

#### 8.37.2 诊断

- 当前 Step 6 已写完五个附录,对象数量已经足以支撑后续 Step,但风险从“对象缺失”转为“对象之间边界漂移”。尤其是 support summary、view/material、trace/history 和 operations/peripheral 容易重复表达同一语义。
- typed ref、view、history 与 truth candidate 之间必须保持层次。若 ref 被写成对象 truth、view 被写成第二 truth、history 被写成当前状态来源,后续 Step 7/8/9 会自然产生 schema 和状态缺口。
- `MethodPackage` / `MethodSetAssembly` 已作为外围 truth candidate 写入,但相关 view/ref/history/rule 已分布在其他附录。闭环审计必须确认它们只互相引用,没有重复创建同一对象责任。
- 旧材料仍存在污染风险。主控历史段和正式 `02-概要设计.md` §6~§9 可能保留旧 `MethodContentLifecycle`、`OutboxEvent`、`DefinitionSnapshot`、`fingerprint` 等主语,下一批必须把这些列为后续回填前的禁入检查。
- Step 8 / Step 9 不能新增 Step 6 没有点名的正式对象来弥补流程或状态缺口。因此本次审计要先给出处理流和状态 owner 的反查入口,但不写流程步骤或状态迁移矩阵。

#### 8.37.3 取舍

| 审计项 | 本批裁决 | 理由 |
|---|---|---|
| 对象清单完整性 | 下一批写入 | 必须确认 A/B/C/D/E 五个附录对象都已写入,并能回指主控对象类别总表。 |
| 重复对象 / 责任重叠 | 下一批写入 | 防止 package/rule/view/ref/history 等重复表达同一 truth 或边界。 |
| Step 5 覆盖 | 下一批写入 | Step 6 必须覆盖 Step 5 八个组成部分,否则后续 Step 会缺对象来源。 |
| Step 8 反查入口 | 下一批写入 | 只写预计处理流与对象来源映射,不写流程步骤。 |
| Step 9 状态 owner 入口 | 下一批写入 | 只写状态主题与 owner 候选,不写状态迁移矩阵。 |
| 旧主语污染检查 | 下一批写入 | 正式 §6 回填前必须明确哪些旧主语不得进入新概要。 |
| 正式 §6 回填草稿 | 后移 | 跨附录审计通过后再进入,避免把未审对象直接装配进正式文档。 |
| Step 7/8/9 启动 | 禁止 | Step 6 尚未闭合,不得越级。 |

#### 8.37.4 下一写入批次结构

| 表 | 目的 | 最小列 |
|---|---|---|
| 对象总数与附录状态表 | 汇总五个附录完成情况。 | 附录;对象数;当前状态;风险 |
| 对象类别完整性表 | 对照主控 §4.2 的类别总表。 | 对象类别;预期对象;已写对象;缺口 |
| 组成部分覆盖表 | 对照 Step 5 八个组成部分。 | Step 5 组成部分;Step 6 对象来源;覆盖结论;后续承接 |
| 重复 / 边界漂移表 | 查 truth/view/ref/history/policy/peripheral 的责任边界。 | 对象组;潜在重叠;裁决;后续约束 |
| Step 8 反查入口表 | 给处理流设计提供对象入口。 | 预计处理流;必须回指对象;禁止新增 |
| Step 9 状态 owner 表 | 给状态机设计提供 owner 来源。 | 状态主题;Step 6 owner;状态迁移后移口径 |
| 旧主语污染表 | 给正式 §6~§9 回填提供禁入清单。 | 旧主语;风险;处理口径 |

#### 8.37.5 下一写入批次边界

- 只允许进入 Step 6 `跨附录闭环审计:再写入`。
- 只写审计表、审计结论和停审记录。
- 不新增对象卡片,不改对象字段,不写接口、DTO、repository、port、adapter、处理流步骤、状态迁移矩阵、配置项、测试项或正式 `02-概要设计.md` §6。
- 若发现对象缺口或责任冲突,下一批必须标记缺口并指向对应附录修正入口,不得在审计表中直接私补对象。
- 审计通过后,下一步才允许进入 `正式 §6 回填草稿:先思考`。

#### 8.37.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写审计结论表 | no |
| 是否新增对象卡片 | no |
| 是否明确下一写入批次 | pass:`跨附录闭环审计:再写入` |
| 是否保持 Step 7/8/9 blocked | pass |
| 是否允许正式 §6 回填 | no |

next_allowed_action: 等待用户确认后进入 Step 6 `跨附录闭环审计:再写入`;只写跨附录审计表和停审记录,不得直接回填正式 §6,不得进入 Step 7/8/9。

### 8.38 跨附录闭环审计:再写入

#### 8.38.1 对象总数与附录状态表

| 附录 | 对象数 | 当前状态 | 风险 |
|---|---:|---|---|
| `core_truth` | 8 | object_batch_completed | no_blocker:truth、state owner、support summary 均已写入。 |
| `policies_guards` | 7 | object_batch_completed | no_blocker:policy / guard / boundary / invariant 均已写入,并入规则已点名。 |
| `views_materials` | 12 独立卡片 + 1 merged item | object_batch_completed | no_blocker:`MethodAssetConsumptionReadMaterial` 明确并入 `MethodAssetConsumptionMaterial`。 |
| `refs_trace_audit` | 25 | object_batch_completed | no_blocker:typed ref、external ref、trace、audit、history、lineage 均已写入。 |
| `operations_peripheral` | 5 | peripheral_object_batch_completed | no_blocker:maintenance task、recovery、peripheral truth candidate 均已写入。 |

#### 8.38.2 对象类别完整性表

| 对象类别 | 预期对象 | 已写对象 / 承接口径 | 缺口 |
|---|---|---|---|
| Core truth / State | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetRelation` | 已在 `core_truth` A1~A5 写入。 | none |
| Support summary / Basis | `FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` | 已在 `core_truth` A6~A8 写入。 | none |
| Policy / Guard / Boundary | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule` | 已在 `policies_guards` B1~B7 写入。 | none |
| Projection / View / Read material | 13 个候选,其中 `MethodAssetConsumptionReadMaterial` 并入消费材料 | 12 个对象卡片已写入;`MethodAssetConsumptionReadMaterial` merged_into `MethodAssetConsumptionMaterial`。 | none |
| Reference / Typed boundary | 16 个 typed / external ref | 已在 `refs_trace_audit` D1~D16 写入。 | none |
| Trace / Audit / History / Lineage | 9 个 trace / audit / history / lineage 对象 | 已在 `refs_trace_audit` D17~D25 写入。 | none |
| Operations / Recovery / Peripheral | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MethodPackage`;`MethodSetAssembly` | 已在 `operations_peripheral` E1~E5 写入。 | none |

#### 8.38.3 Step 5 组成部分覆盖表

| Step 5 组成部分 | Step 6 对象来源 | 覆盖结论 | 后续承接 |
|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`CatalogScopeRef` | pass | Step 7 接口必须以 definition/catalog refs 和 view/material 为边界。 |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`GovernanceBasisRef`;`FormalizationEligibilityRule` | pass | Step 8 正式化流不得绕过 eligibility / basis / state owner。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsumptionContextRef` | pass_with_merge | `MethodAssetConsumptionReadMaterial` 已并入 consumption material;Step 7/8 不得恢复双对象。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactSummary`;`ConsumptionImpactView`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`TraceSubjectRef`;`ConsumptionImpactSourceRef` | pass | Step 8 追溯 / impact flow 只能使用 body-free trace/audit/summary。 |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetRelationView`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionReadMaterial`;`DistributionContextRef`;`RelationIntegrityRule` | pass | Step 8 relation/distribution flow 不得滑向 marketplace 交易或安装履约。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceSummaryView`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalBasisAcceptanceHistory` | pass | Step 8 external basis flow 必须保持 summary/ref/body-free。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;`MaintenanceRunRef`;`RefreshScopeRef`;`MaintenanceRunHistory` | pass | Step 8 maintenance flow 不得改写 core truth 或写 job/worker 实现。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef`;`MethodPackageView`;`MethodSetAssemblyView`;`PackageAssemblyHistory` | pass | Step 8 peripheral flow 不得成为核心前置或 marketplace 履约。 |

#### 8.38.4 重复 / 边界漂移表

| 对象组 | 潜在重叠 | 裁决 | 后续约束 |
|---|---|---|---|
| `MethodAssetDefinition` / `MethodAssetCatalogEntry` / `MethodAssetCatalogView` | 定义 truth 与目录读取材料可能混写。 | pass:definition/catalog entry 是 truth / catalog semantics,view 是只读派生。 | Step 7/8 不得用 catalog view 反写 definition。 |
| `MethodAssetConsumptionMaterial` / `MethodAssetConsumptionReadMaterial` | 可能形成消费材料双主语。 | pass_with_merge:`MethodAssetConsumptionReadMaterial` 已并入 `MethodAssetConsumptionMaterial`。 | 后续不得恢复独立 read material truth。 |
| `FormalMethodAssetVersion` / `FormalizationState` / `FormalizationBasisSummary` | 版本 truth、状态 owner、依据摘要可能混写。 | pass:三者分离。 | Step 8 正式化流必须分别承接版本、状态和 basis。 |
| `ExternalSourceSummary` / `ExternalSourceSummaryView` / `ExternalBasisAcceptanceHistory` | 外部摘要、读取形态、历史线索可能混写。 | pass:summary 是可用摘要,view 是读取形态,history 是变化线索。 | 不得保存外部正文或 external lifecycle truth。 |
| `MethodPackage` / `PackageCompositionRule` / `MethodPackageView` / `MethodPackageRef` / `PackageAssemblyHistory` | peripheral truth、policy、view、ref、history 可能重复表达 package。 | pass:各自边界已拆开。 | Step 7/8 只可引用,不得用 view/history/ref 替代 package truth candidate。 |
| `MethodSetAssembly` / `MethodSetAssemblyView` / `MethodSetAssemblyRef` | method set truth candidate 与读取 / ref 可能混写。 | pass:truth candidate、view、ref 分层明确。 | 不得把 method set 写成组织运行配置或 UI 状态。 |
| `ReadMaterialRefreshTask` / `MaintenanceProgressView` / `MaintenanceRunHistory` | task、progress view、history 可能混写。 | pass:task 是 operation semantic,view 是只读进度,history 是变化线索。 | Step 8 不得写 worker/job/queue 或用 maintenance task 修复 truth。 |

#### 8.38.5 Step 8 反查入口表

| 预计处理流 | 必须回指对象 | 禁止新增 |
|---|---|---|
| 方法资产定义 / 目录维护 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView`;`CatalogScopeRef` | 旧 `MethodContent`、snapshot、fingerprint、目录私有 schema。 |
| 正式化 / 版本建立 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary`;`GovernanceBasisRef`;`FormalizationEligibilityRule` | 私造 governance execution、外部正文、版本覆盖规则。 |
| 受控消费材料生成 / 读取 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsumptionContextRef` | 下游运行 truth、授权矩阵、独立 `MethodAssetConsumptionReadMaterial` truth。 |
| 追溯 / impact / audit 更新 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`ConsumptionImpactSourceRef`;`MethodAssetEvidenceLineage` | raw audit log、证据正文、report body、telemetry schema。 |
| 关系 / 分发语义维护 | `MethodAssetRelation`;`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef`;`RelationIntegrityRule`;`DistributionReadMaterial` | marketplace listing、订单、安装、履约、下游同步成功事实。 |
| 外部摘要 / 引用承接 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`ExternalBasisAcceptanceHistory` | 标准全文、artifact/archive 包体、外部 API payload。 |
| 读取材料 / 追溯材料刷新 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`MaintenanceProgressView`;`MaintenanceRunRef`;`RefreshScopeRef`;`MaintenanceRunHistory` | job、worker、queue、scheduler、retry、lock、DB schema。 |
| 一致性恢复 | `ConsistencyRecoveryTask`;`ConsistencyProtectionPolicy`;`ExternalBodyBoundaryRule`;`DefinitionUseBoundaryGuard` | 自动修复 truth、重做正式化、复制外部正文、扫描下游运行 truth。 |
| 外围包 / 方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef`;`PackageAssemblyHistory` | marketplace 交易履约、安装包正文、组织运行配置、UI 匹配状态。 |

#### 8.38.6 Step 9 状态 owner 表

| 状态主题 | Step 6 owner | 状态迁移后移口径 |
|---|---|---|
| formalization lifecycle | `FormalizationState`;`FormalMethodAssetVersion` | Step 9 定义状态迁移;Step 6 只保留状态 owner 和候选语义。 |
| consumption availability | `MethodAssetAvailabilityView`;`MethodAssetConsumptionMaterial` | `MethodAssetAvailabilityState` 已点名 owner,完整迁移留 Step 9。 |
| external basis acceptance | `ExternalSourceSummary`;`ExternalBasisAcceptanceHistory` | `ExternalBasisAcceptanceState` 已点名 owner,完整迁移留 Step 9。 |
| read material freshness | `ReadMaterialRefreshTask`;`MaintenanceProgressView`;read material objects | Step 9 只定义 freshness / staleness 状态语义,不写 job 状态机。 |
| trace material freshness | `TraceMaterialRefreshTask`;`MethodAssetTraceMaterial`;`MethodAssetTraceView` | Step 9 不得使用 raw log 或 evidence body 作为状态来源。 |
| consistency recovery | `ConsistencyRecoveryTask`;`ConsistencyProtectionPolicy` | Step 9 可定义 recovery needed/in-progress/converged/suspended/rejected。 |
| package availability | `MethodPackage`;`MethodPackageView` | Step 9 只表达外围可用性,不得影响核心定义和正式版本成立。 |
| method set assembly availability | `MethodSetAssembly`;`MethodSetAssemblyView` | Step 9 不得升级为组织运行配置状态机。 |

#### 8.38.7 旧主语污染表

| 旧主语 | 风险 | 处理口径 |
|---|---|---|
| `MethodContent` 七类 | 恢复旧内容模型,覆盖新 method asset definition 主线。 | 禁止进入正式 §6;只允许在差异审计中说明已替换。 |
| `MethodContentLifecycle` | 让旧状态机替代 `FormalizationState`、availability 和 recovery owner。 | 禁止进入 Step 9 新状态机;状态 owner 必须来自本 Step 对象。 |
| `DefinitionSnapshot` / snapshot 主线 | 把读取材料或外部摘要写成第二 truth。 | 禁止作为新对象;必要读取形态用 view/material/ref/history 承接。 |
| `fingerprint` | 用旧校验实现替代正式 typed ref / summary / lineage。 | 禁止作为概要对象主语;后续若需 digest 必须由详细设计正式闭口。 |
| `OutboxEvent` / event payload | 提前把事件协作实现写进对象轮廓。 | 禁止进入 Step 6;事件协作若需要后移 Step 7/8 并按边界定义。 |
| repository / adapter / worker / job | 把实现层承载写成领域对象。 | 禁止进入正式 §6;留给接口、处理流或详细设计。 |
| marketplace listing / install / fulfillment | 把外围生态发现升级为交易履约 truth。 | 禁止进入本仓对象;只保留 `MarketplaceContextRef` 等边界引用。 |

#### 8.38.8 审计结论与停审记录

| 检查项 | 结论 |
|---|---|
| 对象清单是否完整 | pass |
| 是否存在未承接的 Step 5 组成部分 | no |
| 是否存在必须立即修正的重复 truth | no |
| 是否存在需回到附录补对象的 blocker | no |
| 是否保持 Step 7/8/9 blocked | pass |
| 是否允许正式 §6 回填草稿 | pass:下一步进入 `正式 §6 回填草稿:先思考` |

next_allowed_action: 等待用户确认后进入 Step 6 `正式 §6 回填草稿:先思考`;不得直接回填正式文档,不得进入 Step 7/8/9。

### 8.39 正式 §6 回填草稿:先思考

#### 8.39.1 问题回答

- 本模块只思考正式 `02-概要设计.md` §6 的回填草稿结构,不直接修改正式文档。
- 正式 §6 必须替换旧 `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` 和旧 P1 plugin / configuration 主线。
- 正式 §6 不粘贴 57 个对象卡片正文,而是保留校准来源、对象类别表、关键对象家族摘要、合并 / 排除说明和后续 Step 承接入口。
- 对象字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项继续留在 Step 6 主控文件与五个对象附录中作为延伸阅读。
- 下一批 `再写入` 只允许在本 Step 主控文件写出可回填草稿,不得越过回填门禁直接改正式 `02-概要设计.md`。

#### 8.39.2 诊断

- 正式 `02-概要设计.md` §6 当前仍是旧对象污染区,从 §6.2 开始以 `MethodContent` 为核心,并继续使用生命周期、snapshot、fingerprint、outbox 和旧 P1 对象。这些内容已经与新 Step 5 / Step 6 的 method asset 主线冲突。
- Step 6 新结论已经分散在主控文件和五个附录中:8 个 core truth / support summary 对象、7 个 policy / guard 对象、12 个 view / material 对象、25 个 typed ref / trace / audit / history 对象、5 个 operations / peripheral 对象,另有 `MethodAssetConsumptionReadMaterial` 明确并入 `MethodAssetConsumptionMaterial`。
- 如果正式 §6 复制所有对象卡片,正式文档会变成对象大全,并把过程材料混进正文。如果正式 §6 只写一张对象清单,后续 Step 7/8/9 和详细设计又会失去对象责任边界。
- 因此正式 §6 应采用 L1-governance 的装配风格:正式正文收口,中间产物保留细节,用校准来源和延伸阅读保证可追溯。
- 本轮不新增对象、不改对象名、不合并新对象、不提前定义接口 / 流程 / 状态迁移;只裁决正式 §6 如何承接已通过审计的 Step 6 结论。

#### 8.39.3 取舍

| 选项 | 裁决 | 理由 |
|---|---|---|
| 在正式 §6 粘贴完整对象卡片 | no | 对象卡片属于 calibration 细节,正式概要只保留收口结论和追溯入口。 |
| 在正式 §6 只写对象类别总表 | no | 过薄,无法说明关键对象家族与 Step 5 组成部分的对应关系。 |
| 写对象类别表 + 关键对象家族摘要 | yes | 兼顾正式正文可读性和后续设计可追溯性。 |
| 写每个对象字段 / 函数骨架 | no | 字段、成员函数、工厂函数已在附录,正式正文只引用。 |
| 写合并 / 排除说明 | yes | 必须防止 `MethodAssetConsumptionReadMaterial` 被恢复为独立 truth,也必须防止旧主语回流。 |
| 写 Step 8 / Step 9 承接入口 | yes_limited | 只写对象到处理流 / 状态 owner 的承接提示,不写流程步骤或状态迁移。 |
| 直接改正式 `02-概要设计.md` | no | 当前只到 `先思考`,下一批也先在 Step 文件形成回填草稿。 |
| 启动 Step 7/8/9 | no | Step 6 正式回填草稿和自检尚未完成。 |

#### 8.39.4 正式 §6 目标结构

| 正式小节 | 目标内容 | 来源 |
|---|---|---|
| `## 6. 关键对象轮廓` 开头 | 校准来源与延伸阅读,列出主控文件和五个对象附录。 | 本文件;五个 Step 6 附录。 |
| `6.1 对象分布说明` | 按 Truth / State、Policy / Guard、Projection / View / Material、Reference / Boundary、Trace / Audit / History、Operations / Peripheral 分类列出对象。 | `8.38.2` 对象类别完整性表。 |
| `6.2 关键对象家族摘要` | 按 Step 5 八个组成部分说明关键对象家族、主要责任和不承担事项。 | `8.38.3` 组成部分覆盖表;五个附录对象卡片。 |
| `6.3 对象分层边界` | 说明 truth、state owner、summary、view/material、typed ref、history/audit、operation/peripheral 的层次关系。 | `8.38.4` 重复 / 边界漂移表。 |
| `6.4 合并、后移与排除` | 点名 merged、后移到 Step 7/8/9 或详细设计、明确排除的旧主语和实现层名称。 | `4.3`;`8.38.7` 旧主语污染表。 |
| `6.5 后续承接入口` | 简述 Step 7 接口、Step 8 处理流、Step 9 状态 owner 必须回指哪些对象类别。 | `4.6`;`8.38.5`;`8.38.6`。 |

#### 8.39.5 回填草稿来源映射

| 来源 | 回填用途 |
|---|---|
| `02_hld_step_06_key_objects.md` | 正式 §6 的候选池筛选、对象分布、合并 / 排除、Step 8/9 承接和旧主语污染裁决。 |
| `02_hld_step_06_key_objects_core_truth.md` | Truth / State 与 support summary 家族的延伸阅读来源。 |
| `02_hld_step_06_key_objects_policies_guards.md` | Policy / guard / boundary / invariant 家族的延伸阅读来源。 |
| `02_hld_step_06_key_objects_views_materials.md` | Projection / view / read material / freshness 家族的延伸阅读来源。 |
| `02_hld_step_06_key_objects_refs_trace_audit.md` | Typed ref / external ref / trace / audit / history / lineage 家族的延伸阅读来源。 |
| `02_hld_step_06_key_objects_operations_peripheral.md` | Maintenance task、recovery、package、method set 等 operations / peripheral 家族的延伸阅读来源。 |
| `02_hld_step_05_components_boundary.md` | 八个组成部分与对象家族的回指来源。 |
| `00-需求文档.md`;`01-架构设计.md` | 说明 Step 6 对象承接当前需求 / 架构基线,而不是旧 `MethodContent` 主线。 |

#### 8.39.6 下一写入批次结构

| 写入块 | 内容 | 边界 |
|---|---|---|
| 回填草稿开头 | 正式 §6 的校准来源和延伸阅读文本。 | 只写草稿,不改正式文档。 |
| 对象类别总表 | 用对象类别汇总正式关键对象。 | 不展开字段 / 函数 / 状态全集。 |
| 关键对象家族摘要 | 按 Step 5 八个组成部分概括关键对象责任。 | 不复制完整对象卡片。 |
| 分层边界说明 | 说明 truth / view / ref / history / operation / peripheral 的边界。 | 不新增对象或接口。 |
| 合并 / 排除说明 | 写 merged item、旧主语禁入和实现层后移。 | 不恢复旧主线。 |
| 后续承接入口 | 写 Step 7/8/9 如何读取本章对象结论。 | 不写 Step 7/8/9 内容。 |

#### 8.39.7 下一写入批次边界

- 只允许进入 Step 6 `正式 §6 回填草稿:再写入`。
- 只在本 Step 主控文件新增可回填草稿,不修改正式 `projects/L3-method-library/02-概要设计.md`。
- 不新增、删除、重命名或重新分配对象卡片。
- 不写接口、DTO、repository、port、adapter、event payload、处理流步骤、状态迁移矩阵、配置项、测试项、实施计划或验收项。
- 若草稿写入时发现对象清单与附录不一致,必须停回 Step 6 主控 / 附录修正,不能把不一致带入正式文档。

#### 8.39.8 自检

| 检查项 | 结论 |
|---|---|
| 是否直接修改正式 `02-概要设计.md` | no |
| 是否粘贴完整对象卡片 | no |
| 是否明确正式 §6 目标结构 | pass |
| 是否明确下一写入批次 | pass:`正式 §6 回填草稿:再写入` |
| 是否保持 Step 7/8/9 blocked | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `正式 §6 回填草稿:再写入`;只写回填草稿到本 Step 主控文件,不得直接回填正式文档,不得进入 Step 7/8/9。

### 8.40 正式 §6 回填草稿:再写入

#### 8.40.1 回填草稿

```markdown
## 6. 关键对象轮廓

> 校准来源:
> - `design-calibration/02_hld_step_06_key_objects.md`
> - `design-calibration/02_hld_step_06_key_objects_core_truth.md`
> - `design-calibration/02_hld_step_06_key_objects_policies_guards.md`
> - `design-calibration/02_hld_step_06_key_objects_views_materials.md`
> - `design-calibration/02_hld_step_06_key_objects_refs_trace_audit.md`
> - `design-calibration/02_hld_step_06_key_objects_operations_peripheral.md`
>
> 延伸阅读:
> - 建议继续阅读上述 Step 6 主控文件和五个对象附录的对象字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项。正式正文只保留对象分布、关键对象家族、分层边界、排除说明和后续承接入口。

正式进入概要设计的关键对象如下:

| 对象类别 | 正式关键对象 |
|---|---|
| Truth / State / Support summary | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalMethodAssetVersion`、`FormalizationState`、`MethodAssetRelation`、`FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` |
| Policy / Guard / Boundary | `FormalizationEligibilityRule`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`ExternalBodyBoundaryRule`、`PackageCompositionRule` |
| Projection / View / Read material | `MethodAssetCatalogView`、`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactView`、`MethodAssetRelationView`、`DistributionReadMaterial`、`ExternalSourceSummaryView`、`MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView` |
| Reference / Typed boundary | `MethodAssetDefinitionRef`、`CatalogScopeRef`、`GovernanceBasisRef`、`ConsumptionContextRef`、`TraceSubjectRef`、`ConsumptionImpactSourceRef`、`RelatedMethodAssetRef`、`MethodAssetDistributionRef`、`DistributionContextRef`、`ExternalSourceRef`、`ArtifactArchiveRef`、`MaintenanceRunRef`、`RefreshScopeRef`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef` |
| Trace / Audit / History / Lineage | `MethodAssetDefinitionHistory`、`FormalizationHistory`、`ConsumptionTraceMaterial`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`RelationChangeHistory`、`ExternalBasisAcceptanceHistory`、`MaintenanceRunHistory`、`PackageAssemblyHistory` |
| Operations / Recovery / Peripheral organization | `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MethodPackage`、`MethodSetAssembly` |

关键对象按 8 个主要组成部分分布:

| 主要组成部分 | 关键对象家族 | 责任摘要 |
|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`MethodAssetCatalogView`、`CatalogScopeRef` | 承载方法资产定义 truth、目录语义和目录读取形态,禁止恢复旧 `MethodContent` 总对象。 |
| 正式化与版本 | `FormalMethodAssetVersion`、`FormalizationState`、`FormalizationBasisSummary`、`GovernanceBasisRef`、`FormalizationEligibilityRule` | 表达正式版本、正式化状态、正式化依据摘要和资格判断,不执行治理流程,不以发布或指纹机制替代正式化。 |
| 受控消费 | `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard`、`ConsumptionContextRef` | 提供受控消费材料、可用性读取和 Definition / Use 边界,不保存下游运行 truth。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactSummary`、`ConsumptionImpactView`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`ConsumptionImpactSourceRef`、`MethodAssetEvidenceLineage` | 维护 body-free 的追溯、影响摘要、一致性保护和审计线索,不保存 raw audit log、证据正文或 report body。 |
| 关系与分发语义 | `MethodAssetRelation`、`MethodAssetRelationView`、`RelatedMethodAssetRef`、`MethodAssetDistributionRef`、`DistributionReadMaterial`、`DistributionContextRef`、`RelationIntegrityRule` | 表达方法资产之间的定义性关系和分发语义,不进入 marketplace 交易、安装或履约。 |
| 外部摘要与引用 | `ExternalSourceSummary`、`ExternalSourceSummaryView`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、`ExternalBasisAcceptanceHistory` | 只承接外部来源摘要、引用和接受历史,不复制外部正文、标准全文或 artifact/archive 包体。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunRef`、`RefreshScopeRef`、`MaintenanceRunHistory` | 表达读取材料、追溯材料和一致性恢复的 operation semantic,不写 job / worker / scheduler / queue / retry / lock 实现。 |
| 外围包与方法集组织 | `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef`、`MethodPackageView`、`MethodSetAssemblyView`、`PackageAssemblyHistory` | 表达外围增强型包与方法集组织,不得成为核心定义、正式版本、受控消费或追溯闭环的前置条件。 |

对象分层边界如下:

| 层次 | 使用规则 |
|---|---|
| Truth / State | 只有定义、目录条目、正式版本、正式化状态、关系、外围包和方法集组织能表达本仓 truth 或 truth candidate。 |
| Support summary | `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 只保存摘要和可追溯引用,不保存外部正文或下游运行事实。 |
| View / Material | view、read material 和 trace material 是只读派生或供给材料,不得反写真相或成为第二 truth。 |
| Typed ref / Boundary ref | typed ref 只表达稳定引用边界,不得用 URL、文件路径、route param、marketplace id 或 free-form string 替代。 |
| History / Audit / Lineage | history、audit 和 lineage 只记录变化线索和可追溯关系,不承载当前状态全集或 raw log 正文。 |
| Operations / Peripheral | maintenance task、recovery、package 和 method set 只能在各自边界内表达支持或外围组织语义,不得改写核心 truth。 |

以下名称不作为关键对象展开:

| 名称 / 类别 | 处理口径 |
|---|---|
| `MethodAssetConsumptionReadMaterial` | 已并入 `MethodAssetConsumptionMaterial`,后续不得恢复为独立 truth。 |
| `MethodSetAssemblyRule` | 已并入 `PackageCompositionRule` / `MethodSetAssembly`。 |
| API / DTO / request / result | 后移到 Step 7 接口骨架或详细设计。 |
| repository / port / adapter / worker / job / event / topic / database table | 属于接口、处理流、实现或持久化层,不得在本章伪装成领域对象。 |
| `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` | 旧主线禁入当前对象轮廓;若后续确需相似机制,必须按当前对象重新讨论并闭口。 |
| marketplace listing / install / fulfillment | 属于外围生态和 `L6-marketplace` 范围,本仓只保留 `MarketplaceContextRef` 等边界引用。 |

后续章节必须从本章对象回指:

| 后续章节 | 承接要求 |
|---|---|
| Step 7 / §7 API 与接口骨架 | 接口参数和返回应优先使用本章对象、typed ref、summary、material、view 或 boundary,不得私造对象来源。 |
| Step 8 / §8 关键处理流 | 处理流按定义、正式化、消费、追溯、一致性、关系分发、外部引用、维护和外围组织回指本章对象。 |
| Step 9 / §9 状态定义与状态流转 | 状态 owner 必须来自 `FormalizationState`、availability / acceptance state owner、maintenance task、recovery 或 peripheral 对象,不得沿用旧 `MethodContentLifecycle` / `OutboxEventStatus`。 |
```

#### 8.40.2 写入内容

- 已在本 Step 主控文件形成正式 `02-概要设计.md` §6 的可回填草稿。
- 草稿包含校准来源、延伸阅读、对象类别总表、八个组成部分的关键对象家族摘要、对象分层边界、合并 / 后移 / 排除说明和后续 Step 承接入口。
- 草稿明确 `MethodAssetConsumptionReadMaterial` merged_into `MethodAssetConsumptionMaterial`,避免后续恢复双对象。
- 草稿明确旧 `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` 禁入当前对象轮廓。
- 草稿未直接写入正式 `projects/L3-method-library/02-概要设计.md`。

#### 8.40.3 本批未做事项

| 项目 | 结论 |
|---|---|
| 直接回填正式 `02-概要设计.md` §6 | no |
| 粘贴完整对象卡片 | no |
| 新增 / 删除 / 重命名对象 | no |
| 写接口、DTO、port、repository、event payload | no |
| 写处理流步骤或状态迁移矩阵 | no |
| 启动 Step 7/8/9 | no |

#### 8.40.4 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成正式 §6 回填草稿 | pass |
| 是否只写 Step 主控文件 | pass |
| 是否保留校准来源和延伸阅读 | pass |
| 是否避免旧主语回流 | pass |
| 是否允许直接回填正式文档 | no |
| 是否允许进入 Step 6 自检与停审 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `自检与停审:先思考`;不得直接进入 Step 7/8/9。

### 8.41 自检与停审:先思考

#### 8.41.1 问题回答

- 本模块只思考 Step 6 最终自检和停审门禁,不直接宣布 Step 6 completed。
- Step 6 对象内容已经具备停审基础:候选池筛选、五个附录对象卡片、跨附录审计和正式 §6 回填草稿均已形成。
- 当前仍不能直接进入 Step 7,原因是正式 `02-概要设计.md` §6 尚未用 `8.40.1` 草稿回填。正式文档仍保留旧 `MethodContent` 主线,继续作为 ML-S5-GAP-002 的一部分污染区。
- 下一批 `自检与停审:再写入` 应写完成门禁检查表、正式回填门禁判断、剩余 blocker 判断和下一动作裁决。
- 如果自检通过,下一动作应是等待用户确认后把 `8.40.1` 回填到正式 `02-概要设计.md` §6,而不是直接进入 Step 7。

#### 8.41.2 诊断

- 从中间产物角度看,Step 6 已完成主要工作:主控文件完成对象类别表、附录索引、对象分布、Step 8 / Step 9 反查入口、旧主语污染表和回填草稿;五个对象附录已分别完成对象卡片。
- 从正式文档角度看,Step 6 尚未闭合。正式 `02-概要设计.md` §6 仍包含旧 `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`fingerprint` 和 `OutboxEvent` 等旧主线,与本 Step 新结论冲突。
- 因此,Step 6 自检需要区分两类 gate:
  - `calibration_gate`: 中间产物是否足以回填正式 §6。
  - `formal_doc_gate`: 正式 §6 是否已经实际回填并通过污染检查。
- 当前只能预期 `calibration_gate=pass`,但 `formal_doc_gate` 在正式回填前仍应保持 `wait_formal_backfill`。
- Step 7 的开工条件必须以正式 §6 或至少明确通过回填门禁的 Step 6 结论为输入;否则接口骨架仍可能读取旧正式 §6。

#### 8.41.3 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否在自检中直接标记 Step 6 completed | no | 正式 §6 尚未回填,正式文档仍有旧对象污染。 |
| 是否允许下一批直接回填正式文档 | no | 下一批先写自检与停审记录;正式回填需要用户确认。 |
| 是否允许下一批写 Step 7 开工记录 | no | Step 7 仍 blocked_by_step6_formal_backfill。 |
| 是否需要重新补对象附录 | no | `8.38` 已确认五个附录无对象 blocker。 |
| 是否需要调整 `8.40.1` 草稿 | no_now | 当前未发现草稿与附录清单不一致;下一批仍需做引用和禁入检查。 |
| 是否保留 ML-S5-GAP-002 | yes_partial | §6 尚未回填;§7~§9 也仍待后续反查。 |

#### 8.41.4 下一写入批次检查结构

| 检查表 | 目的 | 预期结论 |
|---|---|---|
| Step 6 产物完整性检查 | 核对候选池、五个附录、跨附录审计和回填草稿是否齐备。 | pass / blocker |
| 对象覆盖检查 | 核对 Step 5 八个组成部分是否均有 Step 6 对象承接。 | pass / blocker |
| 越界检查 | 核对是否写入接口、流程、状态迁移、DDL、event payload 或实现细节。 | pass / blocker |
| 正式回填门禁 | 判断 `8.40.1` 是否能作为正式 §6 回填来源。 | wait_user_confirm |
| Step 7 开工条件 | 判断是否允许进入 Step 7。 | blocked_until_formal_6_backfilled |
| flow / 台账下一动作 | 更新恢复点。 | 等待正式 §6 回填确认 |

#### 8.41.5 下一写入批次边界

- 只允许进入 Step 6 `自检与停审:再写入`。
- 只写检查表、停审结论和下一动作裁决。
- 不修改正式 `projects/L3-method-library/02-概要设计.md`。
- 不进入 Step 7 / Step 8 / Step 9。
- 不新增对象、不改对象卡片、不写接口、流程、状态、配置、测试、验收或实施计划。
- 若自检发现草稿与附录不一致,必须回到 Step 6 主控或对应附录修正,不能继续正式回填。

#### 8.41.6 自检

| 检查项 | 结论 |
|---|---|
| 是否直接宣布 Step 6 completed | no |
| 是否直接修改正式文档 | no |
| 是否明确下一批检查表 | pass |
| 是否保持 Step 7/8/9 blocked | pass |
| 是否允许进入 `自检与停审:再写入` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `自检与停审:再写入`;只写 Step 6 完成门禁检查和停审记录,不得直接回填正式文档,不得进入 Step 7/8/9。

### 8.42 自检与停审:再写入

#### 8.42.1 Step 6 产物完整性检查

| 检查项 | 结论 | 依据 |
|---|---|---|
| 开工门禁和必读文档 | pass | `0` / `1` 已记录项目台账、flow、SOP、书写规范、00、01、Step 5 和 L1-governance 框架。 |
| 候选池筛选 | pass | `4.1`~`4.7` 已完成筛选原则、对象类别总表、并入 / 后移 / 排除候选、组成部分分布和 Step 7/8/9 反查占位。 |
| 五个对象附录 | pass | `core_truth`、`policies_guards`、`views_materials`、`refs_trace_audit`、`operations_peripheral` 均已完成对象卡片。 |
| 每个模块先思考后写入 | pass | `8.7`~`8.40` 按主控、附录框架、对象批次、跨附录审计、回填草稿逐段记录。 |
| 跨附录闭环审计 | pass | `8.38` 已确认对象清单完整、Step 5 覆盖完整、无必须回到附录补对象的 blocker。 |
| 正式 §6 回填草稿 | pass | `8.40.1` 已形成可回填草稿。 |

#### 8.42.2 对象覆盖检查

| Step 5 组成部分 | 覆盖结论 | 说明 |
|---|---|---|
| 方法资产定义与目录 | pass | 已覆盖 definition、catalog entry、definition ref、catalog view、catalog scope。 |
| 正式化与版本 | pass | 已覆盖 formal version、formalization state、basis summary、governance basis ref、eligibility rule。 |
| 受控消费 | pass_with_merge | 已覆盖 consumption material、availability view、downstream boundary、definition/use guard、consumption context;`MethodAssetConsumptionReadMaterial` 已并入 consumption material。 |
| 追溯与一致性保护 | pass | 已覆盖 trace material、trace view、impact summary/view、consistency policy、audit trail、impact source ref、evidence lineage。 |
| 关系与分发语义 | pass | 已覆盖 relation truth、relation view、related asset ref、distribution ref/material/context 和 relation integrity rule。 |
| 外部摘要与引用 | pass | 已覆盖 external summary/view/ref、artifact archive ref、external body boundary、external basis acceptance history。 |
| 后台维护与收敛 | pass | 已覆盖 read/trace refresh task、consistency recovery task、maintenance progress view、run/scope refs、maintenance history。 |
| 外围包与方法集组织 | pass | 已覆盖 method package、method set assembly、composition rule、refs、views、marketplace context 和 assembly history。 |

#### 8.42.3 越界检查

| 越界项 | 结论 | 说明 |
|---|---|---|
| 接口 / DTO / request / result | pass | 未在 Step 6 定义正式接口或协议 schema;后移 Step 7。 |
| repository / port / adapter / database table | pass | 未写持久化表、port 方法或 adapter 实现。 |
| 处理流步骤 / job / worker / scheduler | pass | 仅写 Step 8 反查入口,未写流程步骤或调度实现。 |
| 状态迁移矩阵 | pass | 仅写状态 owner 和候选语义,完整状态迁移后移 Step 9。 |
| event payload / outbox / topic | pass | 未恢复旧 outbox 主线,事件协作后移并需按当前对象重新推导。 |
| 外部正文 / artifact body / raw audit log | pass | 均被 summary/ref/history/lineage 边界约束。 |
| marketplace listing / install / fulfillment | pass | 仅保留 `MarketplaceContextRef` 等边界引用,未进入交易履约。 |

#### 8.42.4 正式回填门禁

| 门禁项 | 结论 | 说明 |
|---|---|---|
| SOP 问题回答已覆盖 | pass | `8.5`、`8.7`、各对象批次先思考和 `8.41` 已覆盖对象筛选、排除、反查和停审问题。 |
| 当前文档问题诊断已完成 | pass | 已诊断正式 §6 旧 `MethodContent` 主线污染。 |
| 必要设计取舍已记录 | pass | 已记录完整对象卡片不进正式正文、草稿摘要化、merged / excluded 口径。 |
| 结构化中间产物已形成 | pass | 主控表、五个附录对象卡片、跨附录审计和回填草稿均已形成。 |
| 回填草稿已按书写规范整理 | pass | `8.40.1` 按正式 §6 的校准来源、对象类别、关键对象家族和排除说明组织。 |
| 待确认事项未写成正式结论 | pass | Step 7/8/9 仍为后续承接,未在 §6 草稿中写成已完成。 |
| 用户是否已确认正式回填 | wait_user_confirm | 当前用户只确认进入自检与停审,尚未确认把 `8.40.1` 写入正式文档。 |
| formal_doc_gate | wait_formal_backfill | 正式 `02-概要设计.md` §6 仍是旧主线,尚未替换。 |

#### 8.42.5 Step 7 开工条件

| 检查项 | 结论 | 说明 |
|---|---|---|
| Step 6 calibration 是否足以支撑 Step 7 | pass | 中间产物层面已具备接口骨架反查对象来源。 |
| 正式 §6 是否已回填 | blocked | 正式文档仍保留旧 §6,不能让 Step 7 从正式文档读取旧对象。 |
| 是否允许进入 Step 7 | blocked_until_formal_6_backfilled | 需要先按用户确认把 `8.40.1` 回填正式 §6,再更新 flow / 台账。 |
| 是否允许进入 Step 8/9 | blocked | Step 8 依赖 Step 7 新接口,Step 9 依赖 Step 6/8 状态来源。 |

#### 8.42.6 Blocker 处理

| Blocker ID | 当前状态 | 处理 |
|---|---|---|
| ML-S5-GAP-002 / §6 | ready_for_formal_backfill | Step 6 中间产物和回填草稿已准备好,但正式 §6 尚未回填。 |
| ML-S5-GAP-002 / §7~§9 | open | 等 Step 6 正式回填后,按 Step 7、Step 8、Step 9 逐步反查 / 重写。 |
| ML-S5-GAP-003 | open | Step 9 状态 owner 仍待 Step 8 流程和 Step 9 重写闭合。 |

#### 8.42.7 停审结论

```text
Step 6 关键对象轮廓的中间产物已完成。
当前可以进入正式 §6 回填动作,但不能直接进入 Step 7。
下一步只允许在用户确认后,将 `8.40.1` 草稿回填到正式 `projects/L3-method-library/02-概要设计.md` 的 `## 6. 关键对象轮廓`。
本次回填不得改 §7~§14,不得启动 Step 7/8/9。
正式 §6 回填完成后,再更新 flow / 台账,并重新判断是否允许进入 Step 7 反查。
```

next_allowed_action: 等待用户确认后将 `8.40.1` 回填到正式 `02-概要设计.md` §6;不得改 §7~§14,不得进入 Step 7/8/9。

### 8.43 正式 §6 回填记录

#### 8.43.1 回填动作

- 已将 `8.40.1` 的正式 §6 草稿回填到 `projects/L3-method-library/02-概要设计.md` 的 `## 6. 关键对象轮廓`。
- 回填范围限定为正式 `## 6. 关键对象轮廓` 到 `## 7. API / 接口骨架` 之前。
- 本次没有改写正式 §7~§14,没有进入 Step 7/8/9。
- 本次没有新增对象、接口、流程、状态、配置、测试、验收或实施计划。

#### 8.43.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 §6 是否使用当前 Step 6 对象类别表 | pass | 已替换为 Truth / State、Policy / Guard、View / Material、Typed ref、Trace / Audit、Operations / Peripheral 六类对象。 |
| 正式 §6 是否保留校准来源 | pass | 已列出主控文件和五个对象附录。 |
| 正式 §6 是否粘贴完整对象卡片 | no | 正式正文只保留对象分布、对象家族摘要、分层边界、排除说明和后续承接入口。 |
| 正式 §6 是否恢复旧对象主线 | no | `MethodContent` 等旧主语只出现在禁入说明中,不作为当前关键对象。 |
| 是否误改 §7~§14 | no | 本次替换止于 `## 7. API / 接口骨架` 之前。 |

#### 8.43.3 剩余污染区

| 位置 | 状态 | 处理 |
|---|---|---|
| 正式 §6 | resolved_for_current_step | 已回填当前 Step 6 结论。 |
| 正式 §7 | open | 仍是旧接口主线,必须进入 Step 7 反查 / 重写。 |
| 正式 §8 | open | 仍是旧处理流主线,必须等 Step 7 后进入 Step 8 反查 / 重写。 |
| 正式 §9 | open | 仍是旧状态主线,必须等 Step 6 / Step 8 状态来源闭合后重写或深度反查。 |

#### 8.43.4 当前裁决

```text
正式 §6 已完成回填。
Step 6 还需要做回填后检查和 flow / 台账推进裁决,不能直接进入 Step 7。
下一步只允许在用户确认后进入 Step 6 `正式 §6 回填后检查:先思考`。
```

next_allowed_action: 等待用户确认后进入 Step 6 `正式 §6 回填后检查:先思考`;不得进入 Step 7/8/9。

### 8.44 正式 §6 回填后检查:先思考

#### 8.44.1 问题回答

- 本模块只思考正式 §6 回填后的检查方式和下一写入批次,不直接宣布 Step 6 completed。
- 正式 `02-概要设计.md` 的 `## 6. 关键对象轮廓` 已按 `8.40.1` 草稿替换,替换范围止于 `## 7. API / 接口骨架` 之前。
- 当前需要检查的不是对象卡片是否重新设计,而是正式 §6 是否忠实承接 Step 6 主控和五个对象附录,是否未误改 §7~§14,以及是否把旧 `MethodContent` 主线仅保留在禁入说明中。
- 全文检索仍会在 §7~§9 和前置旧背景中命中 `MethodContent`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` 等旧词,这不应反向否定 §6 回填,但必须保留为 Step 7~9 的 open blocker。
- 下一批 `正式 §6 回填后检查:再写入` 应写正式 §6 对照检查表、污染区分布、Step 7 开工判断和 flow / 台账推进裁决。
- 当前仍不得进入 Step 7,因为 Step 6 还没有完成回填后正式停审和恢复点切换。

#### 8.44.2 诊断

- `8.43` 已记录正式 §6 回填动作,但该记录偏向事实说明,还没有形成可用于恢复的 gate 结论。
- 正式 §6 的当前结构符合概要正文摘要化要求:保留校准来源、对象类别总表、八个组成部分对象家族、分层边界、合并 / 后移 / 排除说明和后续承接入口。
- 正式 §6 没有粘贴五个附录中的完整对象卡片,因此详细对象卡仍以附录为权威中间产物。
- 正式 §6 中旧词出现的位置需要按语义分层判断:
  - 若出现在 `§6.8` 禁入说明或 `§6.9` 后续承接入口中,属于禁止沿用说明。
  - 若出现在 §7~§9,属于后续章节旧主线污染。
  - 若出现在 §1~§4 的历史背景或旧目标描述中,需要等对应章节后续是否重审再裁决,不能在本 Step 直接大范围改写。
- 因此,Step 6 的回填后检查应把正式 §6 resolved 和正式 §7~§9 open 明确拆开,避免后续 agent 误以为全文旧词必须在 Step 6 一次性清零。

#### 8.44.3 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否重新改写正式 §6 | no_now | 当前未发现 §6 与 `8.40.1` 草稿存在结构性偏差。 |
| 是否在本模块直接修 §7~§9 | no | §7~§9 分别属于接口、处理流和状态 Step,必须按后续 Step 小循环重写。 |
| 是否把全文旧词命中作为 Step 6 blocker | no | 旧词命中需要按章节归属区分;§7~§9 旧污染应进入对应 Step blocker。 |
| 是否允许下一批进入正式停审 | yes | 需要把对照检查、污染区边界和下一动作裁决写成恢复可读记录。 |
| 是否允许下一批进入 Step 7 | no | 下一批仍是 Step 6 `再写入`,不是 Step 7 开工。 |

#### 8.44.4 下一写入批次结构

| 模块 | 要写入的内容 | 预期结论 |
|---|---|---|
| 正式 §6 对照检查 | 对照 `8.40.1`、五个附录和正式 §6 的章节结构。 | pass / blocker |
| 替换范围检查 | 确认只替换 §6,未误改 §7~§14。 | pass / blocker |
| 旧词污染分层 | 将 §6 禁入说明、§7~§9 旧主线和前置背景命中分开记录。 | §6 resolved,§7~§9 open |
| Step 6 完成判断 | 判断中间产物、正式回填和回填后检查是否足以关闭 Step 6。 | ready_to_close / blocked |
| Step 7 开工门禁 | 明确 Step 7 只能在本检查写入后由用户确认启动。 | wait_user_confirm |
| flow / 台账推进 | 更新当前恢复点和下一允许动作。 | 等待进入 Step 7 `先思考` 或停留补正 |

#### 8.44.5 下一写入批次边界

- 只允许进入 Step 6 `正式 §6 回填后检查:再写入`。
- 只写检查表、污染区分层、Step 6 完成判断和下一动作裁决。
- 不新增、删除或重命名对象。
- 不修改对象附录。
- 不修改正式 §7~§14。
- 不启动 Step 7 / Step 8 / Step 9。
- 若检查发现正式 §6 与 `8.40.1` 或附录冲突,必须先回到 §6 修正,不得直接推进 Step 7。

#### 8.44.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做回填后检查思考 | pass |
| 是否直接改正式文档 | no |
| 是否直接进入 Step 7 | no |
| 是否区分 §6 resolved 和 §7~§9 open | pass |
| 是否明确下一写入批次 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `正式 §6 回填后检查:再写入`;不得进入 Step 7/8/9。

### 8.45 正式 §6 回填后检查:再写入

#### 8.45.1 正式 §6 对照检查

| 检查项 | 结论 | 依据 |
|---|---|---|
| 是否保留校准来源 | pass | 正式 §6 顶部已列出 Step 6 主控文件和五个对象附录。 |
| 是否承接对象类别总表 | pass | 正式 §6 已按 Truth / State、Policy / Guard、View / Material、Typed ref、Trace / Audit、Operations / Peripheral 六类组织。 |
| 是否覆盖 Step 5 八个组成部分 | pass | 正式 §6 已按方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织列出对象家族。 |
| 是否保留对象分层边界 | pass | 正式 §6 已区分 truth / summary / view-material / typed ref / history-audit / operation-peripheral。 |
| 是否记录 merged / excluded 口径 | pass | 正式 §6 已记录 `MethodAssetConsumptionReadMaterial` 合并、`MethodSetAssemblyRule` 合并、API / DTO / repository / event / topic / table 后移或禁入。 |
| 是否粘贴完整对象卡片 | no | 正式正文只保留摘要;完整对象卡片仍在五个附录中。 |

#### 8.45.2 替换范围检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 替换起点 | pass | 从正式 `## 6. 关键对象轮廓` 开始。 |
| 替换终点 | pass | 截止于正式 `## 7. API / 接口骨架` 之前。 |
| 是否误改正式 §7~§14 | no | §7~§14 仍保留旧内容,作为后续 Step 的污染区和重写对象。 |
| 是否新增接口 / 流程 / 状态迁移 | no | 本次回填只写关键对象轮廓和承接入口。 |
| 是否修改对象附录 | no | 回填后检查未再改五个对象附录。 |

#### 8.45.3 旧词污染分层

| 区域 | 当前状态 | 裁决 |
|---|---|---|
| 正式 §6 禁入说明 | allowed_as_banned_terms | `MethodContent`、`MethodContentLifecycle`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` 只作为禁入说明出现,不是当前对象来源。 |
| 正式 §7 | open | 仍是旧接口主线,Step 7 必须完全重审,不得把既有 Step 7 文件的完成态当成当前结论。 |
| 正式 §8 | open | 仍是旧处理流主线,必须等 Step 7 新接口骨架闭合后再重写或深度反查。 |
| 正式 §9 | open | 仍是旧状态主线,必须等 Step 6 对象和 Step 8 flow 状态来源闭合后重写或深度反查。 |
| 正式 §1~§4 旧背景命中 | defer | 旧背景命中不作为 Step 6 blocker;后续正式装配或对应章节重审时再统一裁决。 |

#### 8.45.4 Step 6 完成判断

| 门禁 | 结论 | 说明 |
|---|---|---|
| 必读文档和开工门禁 | pass | `0` / `1` 已记录项目台账、flow、SOP、书写规范、00、01、Step 5 和 L1-governance 框架。 |
| 主控候选池筛选 | pass | `4` 和 `8.7`~`8.8` 已形成对象类别、候选池、合并 / 后移 / 排除和反查入口。 |
| 附录对象卡片 | pass | 五个 Step 6 对象附录已完成对象卡片。 |
| 跨附录审计 | pass | `8.38` 已确认对象类别、Step 5 覆盖、重复边界、Step 8 / Step 9 反查入口和旧主语污染边界。 |
| 正式 §6 草稿 | pass | `8.40.1` 已形成正式正文草稿。 |
| 正式 §6 回填 | pass | `8.43` 已记录正式文档回填。 |
| 回填后检查 | pass | `8.44` / `8.45` 已完成回填后检查思考和写入。 |

#### 8.45.5 Step 7 开工门禁

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否允许进入 Step 7 开工思考 | pass_after_user_confirm | Step 6 已闭合,但 Step 7 必须先从必读文档和整体模块重新开始。 |
| 是否允许直接沿用既有 Step 7 文件完成态 | no | 既有 `02_hld_step_07_api_interface_skeleton.md` 仍按旧主线写有 done 记录,必须视为 historical material 并重审。 |
| 是否允许直接改正式 §7 | no | Step 7 需要先写开工与必读文档、整体模块和逐组成部分先思考 / 再写入。 |
| 是否允许进入 Step 8/9 | no | Step 8 依赖 Step 7 新接口骨架;Step 9 依赖 Step 6 对象和 Step 8 flow 状态来源。 |

#### 8.45.6 Flow / 台账推进裁决

```text
Step 6 关键对象轮廓: completed。
正式 §6: resolved_for_current_step。
正式 §7~§9: open,必须按后续 Step 逐步重审。
下一允许动作: 等待用户确认后进入 Step 7 `开工与必读文档:先思考`。
Step 7 既有中间产物只能作为 historical material,不得视为本轮已完成。
```

next_allowed_action: 等待用户确认后进入 Step 7 `开工与必读文档:先思考`;不得直接沿用既有 Step 7 文件完成态,不得进入 Step 8/9。
