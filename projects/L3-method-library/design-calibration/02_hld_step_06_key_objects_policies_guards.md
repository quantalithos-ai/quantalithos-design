# L3-method-library 02 概要 Step 6 附录 B: Policy / Guard / Boundary 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 状态: object_batch_completed
> 当前模式: full-restart
> Policy / guard 只表达判断边界,不保存业务 truth。

---

## 1. 本附录职责边界

| 项目 | 内容 |
|---|---|
| 承载对象 | policy、guard、boundary、invariant。 |
| 当前对象范围 | `FormalizationEligibilityRule`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`ExternalBodyBoundaryRule`;`PackageCompositionRule`。 |
| 本附录不承载 | truth 当前状态、read material 字段全集、typed ref 家族正文、audit/history、job / worker / DDL。 |
| 深度限制 | 只写判断责任、关键输入骨架、禁止事项和来源回指;不写完整算法、矩阵或配置规则。 |

## 2. 必读输入

| 文档 | 用途 |
|---|---|
| `02_hld_step_06_key_objects.md` §4 | policy / guard 候选池和并入裁决。 |
| `02_hld_step_05_components_boundary.md` §5.26 | policy / invariant 候选来源。 |
| `00-需求文档.md` §10 / §14 / §16 | 业务规则、验收否决和追溯来源。 |
| `01-架构设计.md` §3 / §4 / §8 / §13 | 约束、职责、依赖方向和横切边界。 |
| L1-governance policy 附录 | 只参考 policy 卡片格式,不复制 Governance 规则语义。 |

## 3. 对象索引

| 对象 | 对象类别 | Step 5 组成部分 | 当前状态 |
|---|---|---|---|
| `FormalizationEligibilityRule` | policy / invariant | 正式化与版本 | object_written |
| `DefinitionUseBoundaryGuard` | guard / boundary | 受控消费 | object_written |
| `DownstreamConsumptionBoundary` | boundary object | 受控消费 | object_written |
| `ConsistencyProtectionPolicy` | policy / guard | 追溯与一致性保护 | object_written |
| `RelationIntegrityRule` | policy / invariant | 关系与分发语义 | object_written |
| `ExternalBodyBoundaryRule` | guard / boundary | 外部摘要与引用 | object_written |
| `PackageCompositionRule` | policy / invariant | 外围包与方法集组织 | object_written |

## 4. 模块状态表

| 顺序 | 模块 | 状态 | 产物 | 下一动作 |
|---:|---|---|---|---|
| 1 | 附录框架:再写入 | done | 文件头、职责、索引、模板和停审。 | 等待主控推进。 |
| 2 | boundary / guard 批次:先思考 | done | 见 `8`:受控消费、外部正文和外围边界判断。 | 已完成;本批对象已写入。 |
| 3 | boundary / guard 批次:再写入 | done | `DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule` 三个对象卡片。 | 进入 policy / invariant 批次先思考。 |
| 4 | policy / invariant 批次:先思考 | done | 见 `10`:正式化、一致性、关系和包组成 policy 裁决。 | 等待确认后写本批对象正文。 |
| 5 | policy / invariant 批次:再写入 | done | `FormalizationEligibilityRule`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`PackageCompositionRule` 四个对象卡片。 | 本附录对象批次完成;进入 views/materials 附录先思考。 |

## 5. 对象卡片模板

```text
## B?. `ObjectName`

| 项 | 内容 |
|---|---|
| 所属部分 | `Step 5 组成部分` |
| 对象类型 | policy / guard / boundary / invariant |
| 结构责任 | ... |
| 来源回指 | ... |
| 边界说明 | ... |

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

- 不写完整 policy engine、规则矩阵、配置键、决策表或算法实现。
- 不让 policy / guard 保存业务 truth、外部正文、下游运行状态或 raw diagnostic。
- 不用 policy 对象替代 Step 9 状态迁移。
- 不把 marketplace 交易、安装或履约规则写成本仓 boundary。

## 7. 停审记录

| 检查项 | 结论 |
|---|---|
| 是否只创建框架 | no:已完成 boundary / guard 批次对象卡片 |
| 是否写对象卡片正文 | yes:已完成 boundary / guard 批次对象卡片 |
| 是否回填正式 §6 | no |
| 下一动作 | 等待确认后进入 `views_materials catalog / consumption material 批次:先思考`。 |

## 8. Boundary / Guard 批次:先思考

### 8.1 问题回答

- 本批只处理 boundary / guard 对象,不处理全部 policy/invariant。当前进入写入批次的对象是 `DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule`。
- `DefinitionUseBoundaryGuard` 与 `DownstreamConsumptionBoundary` 必须同批思考,因为二者共同保护 Definition vs Use:前者负责阻止使用方反向拥有定义 truth,后者负责表达下游消费边界。
- `ExternalBodyBoundaryRule` 也进入本批,因为它是外部正文、artifact/archive 正文、证据正文、marketplace 交易正文不得入仓的统一 guard,会被正式化、追溯、关系、受控消费和外围组织共同引用。
- `PackageCompositionRule` 暂不进入本批对象正文。它虽然承担外围隔离,但本质是 package / method set composition invariant,应留到 policy / invariant 批次与 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule` 一起处理。
- 本批不写完整算法、规则矩阵、配置键、决策表、接口、DTO、repository 或状态迁移;只裁决 guard/boundary 对象写入边界。

### 8.2 诊断

| 对象 | 当前判断 | 来源回指 | 边界风险 |
|---|---|---|---|
| `DefinitionUseBoundaryGuard` | 本批写入 | `00-需求文档.md` BR-ML-003/005/012~018;NFR-ML-007/008;`01-架构设计.md` §4/§8/§9;Step 5 `5.14`;Step 5 `5.26.2` | 若缺失,Step 7/8 可能让下游 DTO、读取材料或消费流程私自创建 / 修改定义 truth。 |
| `DownstreamConsumptionBoundary` | 本批写入 | `00-需求文档.md` FR-ML-005;BR-ML-003/005/007/008/012~018/021;`01-架构设计.md` §6/§9/§10;Step 5 `5.14`;Step 5 `5.26.1` | 若写成下游同步状态或运行状态,会把受控消费边界变成下游运行 truth。 |
| `ExternalBodyBoundaryRule` | 本批写入 | `00-需求文档.md` BR-ML-018/019/022;NFR-ML-007;`01-架构设计.md` §4/§9/§13;Step 5 `5.20`;Step 5 `5.26.1` | 若缺失,外部标准全文、ADR 正文、artifact 正文、archive 包、证据文件或 marketplace 正文可能被误写入 summary、trace 或 package。 |
| `PackageCompositionRule` | 后续写入 | `00-需求文档.md` FR-ML-E-001/002;BR-ML-016;BR-ML-E-001;`01-架构设计.md` §6/§9/§14;Step 5 `5.24` | 是 package / method set composition invariant,应与 policy/invariant 批次共同裁决,不混入本批 guard。 |

### 8.3 取舍

- 本批把 `DefinitionUseBoundaryGuard` 和 `DownstreamConsumptionBoundary` 分开:guard 表达禁止下游反写和越权使用,boundary 表达允许下游如何按正式版本、消费材料和消费语境使用。
- 本批不把 `DownstreamConsumptionBoundary` 写成 `MethodAssetConsumptionMaterial` 的字段补充,因为消费边界会被接口、流程、状态和测试反复引用,需要独立对象卡片。
- 本批把 `ExternalBodyBoundaryRule` 提前写入,因为它是跨多个组成部分的正文禁止规则;如果等到 external ref 附录才写,正式化依据、追溯材料和外围 package 可能先各自形成私有正文判断。
- 本批只允许字段骨架出现 typed ref 类型线索,例如 `ConsumptionContextRef`、`ExternalSourceRef`、`ArtifactArchiveRef`,但 typed ref 家族正文归 `refs_trace_audit` 附录。
- 本批不选择具体 policy engine、配置矩阵、resolver、query visibility、引用解析算法或外部文件访问机制。

### 8.4 结构化中间产物

| 下一写入对象 | 允许写入 | 禁止写入 |
|---|---|---|
| `DefinitionUseBoundaryGuard` | guard 责任、输入来源、禁止下游反写定义 truth、成员函数骨架和禁止事项。 | 下游执行状态、成员状态、治理执行、UI 渲染、交易履约、完整 policy engine。 |
| `DownstreamConsumptionBoundary` | boundary 责任、消费方语境、正式版本 / 消费材料边界、可消费 / 不可消费概要口径。 | 下游同步成功记录、运行时状态、消费方私有模型、DTO / repository / event。 |
| `ExternalBodyBoundaryRule` | 外部正文禁止、artifact/archive/证据/marketplace 正文禁止、body-free 校验骨架。 | 外部正文摘录、文件内容、archive 包体、对象存储内容、外部 API payload。 |

### 8.5 下一写入批次边界

| 项目 | 边界 |
|---|---|
| 下一批 | `boundary / guard 批次:再写入` |
| 写入对象 | `DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule` |
| 允许写入 | 三个概要对象卡片,包括所属部分、对象类型、结构责任、来源回指、边界说明、字段、成员函数、工厂函数和禁止事项。 |
| 禁止写入 | policy/invariant 批次对象正文、完整算法、规则矩阵、配置项、接口、处理流、状态迁移、持久化、事件、read model、typed ref 家族正文。 |
| 完成后门禁 | 三个对象均回指 Step 5 组成部分;能解释 Definition vs Use、下游消费边界和外部正文禁止;未保存业务 truth、外部正文或下游运行状态。 |

### 8.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做先思考 | pass |
| 是否写对象卡片正文 | no |
| 是否裁决下一批写入对象 | pass:`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule` |
| 是否把 `PackageCompositionRule` 混入本批 | no:后续 policy / invariant 批次处理 |
| 是否写算法、配置、接口、流程或状态迁移 | no |
| 是否回填正式 §6 | no |

## B1. `DefinitionUseBoundaryGuard`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | guard / boundary |
| 结构责任 | 防止方法资产定义 truth、正式版本和下游使用语境混淆;阻断下游私有定义、消费材料反写和未授权使用口径。 |
| 来源回指 | Step 5 `5.14`;Step 5 `5.26.2`;`00-需求文档.md` BR-ML-003/005/012~018;`01-架构设计.md` §4/§8/§9。 |
| 边界说明 | 只表达 Definition vs Use 的判断边界;不保存下游运行状态,不实现鉴权矩阵,不替代一致性保护策略。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | DefinitionUseBoundaryGuardRef | guard 自身稳定引用。 |
| protected_definition_ref | MethodAssetDefinitionRef | 被保护的方法资产定义锚点。 |
| protected_formal_version_ref | FormalMethodAssetVersionRef | 被保护的正式版本边界。 |
| consumption_context_ref | ConsumptionContextRef | guard 适用的下游消费语境。 |
| boundary_ref | DownstreamConsumptionBoundaryRef | 关联的下游消费边界。 |
| violation_kind_set | DefinitionUseViolationKindSet | 可识别的 Definition vs Use 越界类别集合。 |
| guard_reason_ref | DefinitionUseGuardReasonRef | guard 判断的安全原因引用。 |

| 成员函数 | 作用 |
|---|---|
| assert_material_uses_formal_version(MethodAssetConsumptionMaterialRef consumption_material_ref) | 校验消费材料只能引用正式版本,不能成为定义副本。 |
| assert_context_within_boundary(ConsumptionContextRef consumption_context_ref) | 校验消费语境在已声明边界内。 |
| reject_downstream_definition_write(DownstreamWriteAttemptRef write_attempt_ref) | 拒绝下游对定义 truth 或正式版本的反写。 |
| mark_violation(DefinitionUseViolationRef violation_ref) | 记录越界线索,供追溯和一致性保护承接。 |

| 工厂函数 | 作用 |
|---|---|
| protect_formal_consumption(MethodAssetDefinitionRef definition_ref, FormalMethodAssetVersionRef formal_version_ref, DownstreamConsumptionBoundaryRef boundary_ref) | 为正式版本消费建立 guard。 |
| violated(DefinitionUseViolationRef violation_ref, DownstreamConsumptionBoundaryRef boundary_ref) | 从已识别越界线索建立 guard violation 口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存下游运行 truth | process、identity、runtime、member-images、UI 或 marketplace 的运行状态不得进入 guard。 |
| 不写成权限矩阵 | role、token、scope、策略引擎和配置开关留给后续接口 / 配置设计。 |
| 不替代正式化 | guard 不能把非正式定义提升为正式版本。 |
| 不保存原始请求正文 | 违规请求、外部正文和证据正文只能以 body-free ref / marker 承接。 |

## B2. `DownstreamConsumptionBoundary`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | boundary object |
| 结构责任 | 固定下游如何按正式版本、消费材料和消费语境使用方法资产,并声明不可反写和不可拥有的边界。 |
| 来源回指 | Step 5 `5.14`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-005;BR-ML-003/005/007/008/012~018/021;`01-架构设计.md` §6/§9/§10。 |
| 边界说明 | 只定义本仓向下游暴露的消费边界;不保存同步成功、安装、运行、交易或下游私有模型。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| boundary_ref | DownstreamConsumptionBoundaryRef | 下游消费边界引用。 |
| consumption_context_ref | ConsumptionContextRef | 边界适用的消费语境。 |
| formal_version_requirement | FormalVersionRequirement | 要求消费必须锚定正式版本。 |
| allowed_use_kind_set | MethodAssetAllowedUseKindSet | 允许读取、引用、组装或分发等使用类别。 |
| forbidden_write_kind_set | DownstreamForbiddenWriteKindSet | 禁止下游反写定义、正式版本、消费材料或追溯材料。 |
| material_scope_ref | MethodAssetConsumptionMaterialScopeRef | 边界允许的消费材料范围。 |
| boundary_reason_ref | ConsumptionBoundaryReasonRef | 边界成立或受限的安全原因引用。 |

| 成员函数 | 作用 |
|---|---|
| assert_context_allowed(ConsumptionContextRef consumption_context_ref) | 判断消费语境是否在边界内。 |
| assert_formal_version_required(FormalMethodAssetVersionRef formal_version_ref) | 校验使用锚点必须是正式版本。 |
| assert_use_kind_allowed(MethodAssetUseKind use_kind) | 判断使用类别是否被允许。 |
| reject_forbidden_write(DownstreamWriteAttemptRef write_attempt_ref) | 拒绝下游反写或私有 ownership 越界。 |

| 工厂函数 | 作用 |
|---|---|
| for_consumption_context(ConsumptionContextRef consumption_context_ref, FormalVersionRequirement formal_version_requirement) | 为指定消费语境建立边界。 |
| scope_limited(ConsumptionContextRef consumption_context_ref, ConsumptionBoundaryReasonRef reason_ref) | 建立范围受限的消费边界。 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有下游 truth | 下游执行、安装、运行、绑定、展示和交易事实不属于本对象。 |
| 不替代消费材料 | boundary 只声明允许和禁止,不承载正式语义材料正文。 |
| 不替代接口契约 | request / response / DTO / repository 留给 Step 7 和详细设计。 |
| 不保存 marketplace 履约 | listing、订单、安装、付费和交付状态属于 `L6-marketplace`。 |

## B3. `ExternalBodyBoundaryRule`

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | guard / boundary |
| 结构责任 | 统一禁止外部正文、artifact/archive 正文、证据正文和 marketplace 正文进入本仓 truth、summary、trace 或外围组织对象。 |
| 来源回指 | Step 5 `5.20`;Step 5 `5.26.1`;`00-需求文档.md` BR-ML-018/019/022;NFR-ML-007;`01-架构设计.md` §4/§9/§13。 |
| 边界说明 | 只允许 body-free summary/ref/lineage 进入本仓;外部解析、文件获取、对象存储和 API payload 不在本对象内定义。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | ExternalBodyBoundaryRuleRef | 外部正文边界规则引用。 |
| external_source_ref | OptionExternalSourceRef | 被检查的外部来源引用。 |
| artifact_archive_ref | OptionArtifactArchiveRef | 被检查的 artifact / archive 引用。 |
| forbidden_body_kind_set | ForbiddenExternalBodyKindSet | 明确禁止进入本仓的正文类别。 |
| allowed_summary_kind_set | ExternalSummaryKindSet | 允许保留的摘要、marker、lineage 或 typed ref 类别。 |
| boundary_reason_ref | ExternalBodyBoundaryReasonRef | 正文被拒绝或摘要被接受的原因引用。 |
| lineage_marker_ref | OptionMethodAssetEvidenceLineageRef | 需要追溯时的 body-free lineage 线索。 |

| 成员函数 | 作用 |
|---|---|
| assert_summary_body_free(ExternalSourceSummaryRef summary_ref) | 校验外部来源摘要不携带正文。 |
| assert_basis_body_free(FormalizationBasisSummaryRef basis_summary_ref) | 校验正式化依据摘要不携带治理、标准或 artifact 正文。 |
| reject_external_body(ExternalBodyCandidateRef body_candidate_ref) | 拒绝外部正文、archive 包体、证据文件正文或 payload 入仓。 |
| allow_lineage_ref(MethodAssetEvidenceLineageRef lineage_ref) | 允许 body-free lineage 作为追溯线索。 |

| 工厂函数 | 作用 |
|---|---|
| default_no_body_rule(ExternalBodyBoundaryRuleRef rule_ref) | 建立本仓默认外部正文禁止规则。 |
| from_rejected_body(ExternalBodyCandidateRef body_candidate_ref, ExternalBodyBoundaryReasonRef reason_ref) | 从正文越界候选建立拒绝口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 标准全文、ADR 正文、论文档、artifact 正文、archive 包和证据文件正文不得进入本仓。 |
| 不保存外部 API payload | resolver 响应、文件下载结果、对象存储内容和二进制包不属于本对象。 |
| 不替代外部来源 truth | 外部系统仍拥有外部正文和生命周期,本仓只保存摘要 / ref / lineage。 |
| 不表达 marketplace 交易正文 | listing 正文、交易、安装和履约材料不得通过本规则进入方法库 truth。 |

## 9. Boundary / Guard 批次:再写入

### 9.1 写入内容

- 已写入 `DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 三个概要对象卡片。
- 三个对象均回指 Step 5 组成部分,并分别覆盖 Definition vs Use、下游消费边界和外部正文禁止。
- 已将本附录对象索引中三个对象状态更新为 `object_written`。
- 已将本附录下一动作推进到 `policy / invariant 批次:先思考`。

### 9.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 `FormalizationEligibilityRule` / `ConsistencyProtectionPolicy` / `RelationIntegrityRule` / `PackageCompositionRule` | no:留给 policy / invariant 批次 |
| 写完整算法 / 规则矩阵 / 配置键 | no |
| 写接口 / DTO / repository / event / DDL | no |
| 写处理流 / 状态迁移 | no |
| 写 read model 或 typed ref 家族正文 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 9.3 停审记录

| 检查项 | 结论 |
|---|---|
| 三个 boundary / guard 对象是否完成概要卡片 | pass |
| 是否保持 body-free / no downstream truth / no external body | pass |
| 是否越界写 policy / invariant 批次对象 | no |
| 是否允许进入下一模块 | pass:下一模块为 `policy / invariant 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `policy / invariant 批次:先思考`;只思考 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个对象的写入边界,不得直接写对象卡片正文、完整算法、规则矩阵、配置、接口、流程、状态迁移或正式 §6。

## 10. Policy / Invariant 批次:先思考

### 10.1 问题回答

- 本批只处理 policy / invariant 对象,不回头扩写 boundary / guard 对象,也不进入 view、typed ref、trace/audit 或 operations 附录。
- 当前进入下一写入批次的对象是 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule`。
- `FormalizationEligibilityRule` 独立写入,因为它横跨 definition、catalog、basis summary 和正式版本前置条件,不能埋入 `FormalMethodAssetVersion` 字段。
- `ConsistencyProtectionPolicy` 独立写入,因为它横跨正式版本变化、消费影响摘要、既有正式消费保护和后续恢复承接,不能被 `ConsumptionImpactSummary` 或 trace material 吸收。
- `RelationIntegrityRule` 独立写入,因为关系端点、正式化状态、分发边界和 marketplace 禁止边界会被 Step 8 relation flow 反复引用。
- `PackageCompositionRule` 独立写入,但必须标注 peripheral。它约束 package / method set composition,不把外围包或方法集升级为核心闭环前置。

### 10.2 诊断

| 对象 | 当前判断 | 来源回指 | 边界风险 |
|---|---|---|---|
| `FormalizationEligibilityRule` | 本批写入 | Step 5 `5.26.1/5.26.2`;`00-需求文档.md` FR-ML-003/004;BR-ML-007/009/019/020;`01-架构设计.md` §3/§9/§10/§11 | 若缺失,读取、引用、同步或下游使用可能被误写成隐式正式化。 |
| `ConsistencyProtectionPolicy` | 本批写入 | Step 5 `5.16`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-008;BR-ML-004/010/020;`01-架构设计.md` §6/§9/§10/§13 | 若写散,正式版本变化、消费影响和既有正式引用保护会落成实现约定。 |
| `RelationIntegrityRule` | 本批写入 | Step 5 `5.18`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-006;BR-ML-016/018;`01-架构设计.md` §4/§6/§9 | 若缺失,relation 可能指向未成立资产、越界分发语义或 marketplace 履约对象。 |
| `PackageCompositionRule` | 本批写入 | Step 5 `5.24`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-E-001/002;BR-ML-016;BR-ML-E-001;NFR-ML-004;`01-架构设计.md` §6/§9/§14 | 若写成核心规则,外围 package / method set 会反向拖垮 core truth 和正式消费主链。 |

### 10.3 取舍

- 本批把 `VersionStabilityRule` 并入 `FormalMethodAssetVersion` 和 `ConsistencyProtectionPolicy`:版本稳定是正式版本不变量,而影响既有正式消费的部分由一致性保护承接,不单独新增对象。
- 本批把 `ImpactClassificationRule` 并入 `ConsumptionImpactSummary` 和 `ConsistencyProtectionPolicy`:影响分类是 summary / policy 的判断维度,不单独成为新 truth。
- 本批把 `DistributionBoundaryRule` 并入 `MethodAssetDistributionRef` 和 `RelationIntegrityRule`:分发语义边界服务 relation / distribution integrity,不另建平行 policy。
- 本批把 `MethodSetAssemblyRule` 并入 `PackageCompositionRule`:method set assembly 与 package composition 同属 peripheral composition invariant,不拆成两个重复对象。
- 本批不写完整 policy engine、规则矩阵、配置 profile、可配置开关、resolver、接口、持久化、事件或状态迁移;只为下一步对象卡片裁定概要责任和禁止事项。

### 10.4 结构化中间产物

| 下一写入对象 | 允许写入 | 禁止写入 |
|---|---|---|
| `FormalizationEligibilityRule` | 正式化资格责任、definition/catalog/basis 输入骨架、显式正式化不变量、成员函数骨架和禁止事项。 | 治理执行、审批流、policy enforce、版本号算法、hash/fingerprint、配置矩阵。 |
| `ConsistencyProtectionPolicy` | 版本语义变化保护、消费影响保护、未知影响待承接口径、成员函数骨架和禁止事项。 | 下游运行状态、同步等待所有下游、恢复算法、告警规则、operations report schema。 |
| `RelationIntegrityRule` | relation endpoint 完整性、正式化边界、分发语义边界、成员函数骨架和禁止事项。 | 推荐图算法、运行依赖图、marketplace 交易 / 安装 / 履约、外部正文解析。 |
| `PackageCompositionRule` | package / method set composition 边界、核心引用要求、外围不可前置、成员函数骨架和禁止事项。 | marketplace listing、安装包正文、artifact package 内容、组织运行配置、核心消费授权扩大。 |

### 10.5 下一写入批次边界

| 项目 | 边界 |
|---|---|
| 下一批 | `policy / invariant 批次:再写入` |
| 写入对象 | `FormalizationEligibilityRule`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`PackageCompositionRule` |
| 允许写入 | 四个概要对象卡片,包括所属部分、对象类型、结构责任、来源回指、边界说明、字段、成员函数、工厂函数和禁止事项。 |
| 禁止写入 | 完整算法、规则矩阵、配置项、接口、处理流、状态迁移、持久化、事件、read model、typed ref 家族正文、正式 §6。 |
| 完成后门禁 | 四个对象均回指 Step 5 组成部分;能解释正式化资格、一致性保护、关系完整性和外围 composition;未保存业务 truth、外部正文或下游运行状态。 |

### 10.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做先思考 | pass |
| 是否写对象卡片正文 | no |
| 是否裁决下一批写入对象 | pass:`FormalizationEligibilityRule`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`PackageCompositionRule` |
| 是否新增批次外对象 | no |
| 是否写算法、配置、接口、流程或状态迁移 | no |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `policy / invariant 批次:再写入`;只写 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个对象卡片,不得写完整算法、配置、接口、流程、状态迁移、typed ref 家族正文或正式 §6。

## B4. `FormalizationEligibilityRule`

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | policy / invariant |
| 结构责任 | 判断方法资产定义是否具备进入正式使用语境的最小资格,并阻止读取、引用、同步或运行时使用隐式触发正式化。 |
| 来源回指 | Step 5 `5.26.1/5.26.2`;`00-需求文档.md` FR-ML-003/004;BR-ML-007/009/019/020;`01-架构设计.md` §3/§9/§10/§11。 |
| 边界说明 | 只表达正式化资格判断边界;不执行治理裁决,不保存治理执行状态,不决定版本号算法或配置矩阵。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | FormalizationEligibilityRuleRef | 正式化资格规则引用。 |
| definition_requirement | MethodAssetDefinitionRequirement | 对定义成立、身份稳定和目录语境的要求。 |
| catalog_context_requirement | CatalogContextRequirement | 对目录范围和适用语境的要求。 |
| basis_requirement | FormalizationBasisRequirement | 对正式化依据摘要 / 引用的要求。 |
| governance_basis_requirement | OptionalGovernanceBasisRequirement | 条件型治理依据要求,不迁入治理执行。 |
| forbidden_trigger_kind_set | ForbiddenFormalizationTriggerKindSet | 禁止隐式触发正式化的来源类别。 |
| rejection_reason_ref | OptionFormalizationEligibilityRejectionRef | 资格不足时的安全原因引用。 |

| 成员函数 | 作用 |
|---|---|
| assert_definition_ready(MethodAssetDefinitionRef definition_ref) | 校验定义锚点具备进入正式化判断的前提。 |
| assert_catalog_context(MethodAssetCatalogEntryRef catalog_entry_ref) | 校验目录语境满足正式化前置条件。 |
| assert_basis_sufficient(FormalizationBasisSummaryRef basis_summary_ref) | 校验依据摘要足以支撑正式化判断。 |
| reject_implicit_trigger(FormalizationTriggerRef trigger_ref) | 拒绝由读取、引用、同步或运行使用触发正式化。 |

| 工厂函数 | 作用 |
|---|---|
| default_core_rule(FormalizationEligibilityRuleRef rule_ref) | 建立核心闭环默认正式化资格规则。 |
| from_basis_requirement(FormalizationEligibilityRuleRef rule_ref, FormalizationBasisRequirement basis_requirement) | 基于依据要求建立资格规则变体。 |

| 禁止事项 | 说明 |
|---|---|
| 不执行治理裁决 | governance 只能作为 summary/ref 输入,不能把 Gate、审批流或 policy enforce 迁入本仓。 |
| 不保存配置矩阵 | profile、开关、阈值和组织配置留给配置设计。 |
| 不替代正式版本对象 | 资格通过只是前置,正式版本仍由 `FormalMethodAssetVersion` 承载。 |
| 不读取下游运行状态 | 下游消费结果、流程执行、成员状态和 UI 状态不得成为资格来源。 |

## B5. `ConsistencyProtectionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | policy / guard |
| 结构责任 | 保护正式版本语义变化和消费影响变化必须显式识别,避免静默破坏既有正式消费和长期引用。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-008;BR-ML-004/010/020;`01-架构设计.md` §6/§9/§10/§13。 |
| 边界说明 | 只表达一致性保护判断边界;不保存下游运行 truth,不要求同步等待所有下游,不定义恢复算法或告警实现。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| policy_ref | ConsistencyProtectionPolicyRef | 一致性保护策略引用。 |
| protected_version_ref | FormalMethodAssetVersionRef | 被保护的正式版本引用。 |
| impact_summary_ref | OptionConsumptionImpactSummaryRef | 消费影响摘要引用。 |
| trace_material_ref | OptionMethodAssetTraceMaterialRef | 变化追溯材料引用。 |
| protected_context_refs | ConsumptionContextRefSet | 可能受影响的正式消费语境集合。 |
| protection_kind_set | ConsistencyProtectionKindSet | 需要保护的变化类别集合。 |
| unknown_impact_reason_ref | OptionConsumptionImpactUnknownReasonRef | 影响未知时的待承接原因引用。 |

| 成员函数 | 作用 |
|---|---|
| assert_version_change_explicit(VersionChangeReasonRef reason_ref) | 校验正式版本语义变化是显式变化。 |
| require_impact_summary(ConsumptionImpactSourceRef impact_source_ref) | 要求影响变化形成摘要或明确未知口径。 |
| assert_existing_consumption_protected(ConsumptionContextRef consumption_context_ref) | 校验既有正式消费没有被静默破坏。 |
| mark_unknown_impact(ConsumptionImpactUnknownReasonRef reason_ref) | 将不可判定影响保持为待承接 / 待确认。 |

| 工厂函数 | 作用 |
|---|---|
| protect_formal_version(FormalMethodAssetVersionRef formal_version_ref) | 为正式版本建立一致性保护策略。 |
| from_impact_summary(ConsumptionImpactSummaryRef impact_summary_ref) | 基于消费影响摘要建立保护判断上下文。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存下游运行状态 | 下游内部状态、执行进度、安装结果或 UI 状态不得进入 policy。 |
| 不同步等待所有下游 | 下游可感知和摘要承接可以异步,不能反向决定本仓 truth 成立。 |
| 不定义恢复算法 | 恢复任务、重试、报告和告警留给 operations / 后续 Step。 |
| 不替代 trace/audit | policy 只判断保护边界,变化解释和审计线索由 trace / audit 对象承接。 |

## B6. `RelationIntegrityRule`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | policy / invariant |
| 结构责任 | 判断方法资产关系端点、正式化状态、分发语义和外部边界是否满足完整性要求。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-006;BR-ML-016/018;`01-架构设计.md` §4/§6/§9。 |
| 边界说明 | 只保护定义性关系和分发语义;不表达推荐图、运行依赖图、marketplace 交易安装或外部正文解析。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | RelationIntegrityRuleRef | 关系完整性规则引用。 |
| relation_ref | MethodAssetRelationRef | 被判断的方法资产关系引用。 |
| source_definition_ref | MethodAssetDefinitionRef | 关系源端定义锚点。 |
| target_definition_ref | MethodAssetDefinitionRef | 关系目标端定义锚点。 |
| formalization_requirement | RelationFormalizationRequirement | 对关系端点正式化状态的要求。 |
| distribution_boundary_ref | OptionMethodAssetDistributionRef | 分发语义边界引用。 |
| violation_reason_ref | OptionRelationIntegrityViolationRef | 完整性违规原因引用。 |

| 成员函数 | 作用 |
|---|---|
| assert_endpoint_exists(MethodAssetDefinitionRef definition_ref) | 校验关系端点指向已成立的方法资产定义。 |
| assert_endpoint_formalization(MethodAssetDefinitionRef definition_ref) | 校验端点满足关系所需正式化边界。 |
| assert_distribution_boundary(MethodAssetDistributionRef distribution_ref) | 校验分发语义没有越过 marketplace 或 artifact 正文边界。 |
| reject_runtime_dependency(RelationCandidateRef relation_candidate_ref) | 拒绝把运行依赖图、推荐图或安装关系写成定义性关系。 |

| 工厂函数 | 作用 |
|---|---|
| for_relation(MethodAssetRelationRef relation_ref) | 为指定方法资产关系建立完整性规则上下文。 |
| violated(MethodAssetRelationRef relation_ref, RelationIntegrityViolationRef violation_ref) | 从违规线索建立关系完整性失败口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不表达推荐算法 | 推荐、相似度、排序和搜索权重不是定义性关系 truth。 |
| 不表达运行依赖图 | runtime/process/identity 的运行依赖不得写成本仓关系。 |
| 不保存 marketplace 履约 | listing、购买、安装、交付和结算不属于关系完整性。 |
| 不保存外部正文 | 关系依据只能以 summary/ref/lineage 承接,不得保存正文。 |

## B7. `PackageCompositionRule`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | policy / invariant |
| 结构责任 | 约束 package / method set 只能围绕已成立或允许引用的方法资产组织,并防止外围组织反写核心 truth 或扩大消费授权。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-E-001/002;BR-ML-016;BR-ML-E-001;NFR-ML-004;`01-架构设计.md` §6/§9/§14。 |
| 边界说明 | 只表达 peripheral composition invariant;不把 package、method set、marketplace 生态发现或安装包变成核心闭环前置。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| rule_ref | PackageCompositionRuleRef | 包组成规则引用。 |
| package_ref | OptionMethodPackageRef | 被判断的方法资产包引用。 |
| assembly_ref | OptionMethodSetAssemblyRef | 被判断的方法集组装引用。 |
| member_definition_refs | MethodAssetDefinitionRefSet | package / method set 成员定义引用集合。 |
| allowed_distribution_refs | MethodAssetDistributionRefSet | 允许进入外围组织的分发语义引用集合。 |
| marketplace_context_ref | OptionMarketplaceContextRef | 生态发现语境引用,不承接交易履约。 |
| peripheral_reason_ref | PackageCompositionReasonRef | 组成规则成立或拒绝的安全原因引用。 |

| 成员函数 | 作用 |
|---|---|
| assert_members_defined(MethodAssetDefinitionRefSet member_definition_refs) | 校验成员均来自已成立的方法资产定义。 |
| assert_distribution_allowed(MethodAssetDistributionRef distribution_ref) | 校验分发语义允许进入外围组织。 |
| reject_core_truth_writeback(MethodPackageRef package_ref) | 拒绝 package / method set 反写定义、版本或消费边界。 |
| assert_not_core_prerequisite(MethodPackageRef package_ref) | 校验外围组织不可成为核心闭环成立前置。 |

| 工厂函数 | 作用 |
|---|---|
| for_package(MethodPackageRef package_ref) | 为方法资产包建立 composition rule 上下文。 |
| for_method_set(MethodSetAssemblyRef assembly_ref) | 为方法集组装建立 composition rule 上下文。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存安装包正文 | package 文件、archive、artifact 内容和导出包体不属于本对象。 |
| 不表达 marketplace 交易 | listing、价格、订单、购买、安装和履约属于 `L6-marketplace`。 |
| 不扩大消费授权 | 外围组织不能绕过 `DownstreamConsumptionBoundary` 或正式版本要求。 |
| 不阻塞核心闭环 | package / method set 不可用时,核心定义、正式化、受控消费和追溯仍应成立。 |

## 11. Policy / Invariant 批次:再写入

### 11.1 写入内容

- 已写入 `FormalizationEligibilityRule`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule`、`PackageCompositionRule` 四个概要对象卡片。
- 四个对象分别覆盖正式化资格、一致性保护、关系完整性和外围 composition invariant。
- 已将本附录对象索引中四个对象状态更新为 `object_written`。
- 已将本附录对象批次推进完成,下一动作交给 `views_materials catalog / consumption material 批次:先思考`。

### 11.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写完整算法 / 规则矩阵 / 配置键 | no |
| 写接口 / DTO / repository / event / DDL | no |
| 写处理流 / 状态迁移 | no |
| 写 read model 或 typed ref 家族正文 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 11.3 停审记录

| 检查项 | 结论 |
|---|---|
| 四个 policy / invariant 对象是否完成概要卡片 | pass |
| 是否保持 no downstream truth / no external body / no policy engine | pass |
| 是否将外围 package / method set 标注为 peripheral | pass |
| 是否允许进入下一模块 | pass:下一模块为 `views_materials catalog / consumption material 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `views_materials catalog / consumption material 批次:先思考`;只思考目录、消费材料和可用性 view 批次,不得直接写对象卡片正文,不得回填正式 §6。
