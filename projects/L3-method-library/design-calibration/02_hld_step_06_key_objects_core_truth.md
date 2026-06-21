# L3-method-library 02 概要 Step 6 附录 A: Core Truth / State 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 状态: object_batch_completed
> 当前模式: full-restart
> 本文件给附录框架、对象索引和分批对象概要骨架,不定义完整对象契约。

---

## 1. 本附录职责边界

| 项目 | 内容 |
|---|---|
| 承载对象 | core truth、state owner、support summary。 |
| 当前对象范围 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalMethodAssetVersion`;`FormalizationState`;`MethodAssetRelation`;`FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary`。 |
| 本附录不承载 | policy / guard 算法、read model 细节、typed ref 家族、trace/audit/history 正文、operation/job/peripheral 实现。 |
| 深度限制 | 只写概要对象骨架;字段、状态、成员函数和工厂函数不得下沉到完整 Rust / schema / persistence。 |

## 2. 必读输入

| 文档 | 用途 |
|---|---|
| `02_hld_step_06_key_objects.md` §4 | 主控候选池、组成部分分布和附录索引。 |
| `02_hld_step_05_components_boundary.md` §5.26 | Step 6 展开门禁和候选来源。 |
| `00-需求文档.md` §7 / §9 / §10 / §11 / §16 | 核心闭环、功能、业务规则、数据归属和追溯来源。 |
| `01-架构设计.md` §4 / §6 / §9 / §10 | 职责边界、子域、数据所有权和交互约束。 |
| L1-governance Step 6 truth 附录 | 只参考对象卡片格式,不得复制 Governance 领域语义。 |

## 3. 对象索引

| 对象 | 对象类别 | Step 5 组成部分 | 当前状态 |
|---|---|---|---|
| `MethodAssetDefinition` | core truth | 方法资产定义与目录 | object_written |
| `MethodAssetCatalogEntry` | core truth | 方法资产定义与目录 | object_written |
| `FormalMethodAssetVersion` | core truth / version state | 正式化与版本 | object_written |
| `FormalizationState` | state owner / state vocabulary | 正式化与版本 | object_written |
| `MethodAssetRelation` | support truth | 关系与分发语义 | object_written |
| `FormalizationBasisSummary` | support summary | 正式化与版本 | object_written |
| `ExternalSourceSummary` | support summary / external basis | 外部摘要与引用 | object_written |
| `ConsumptionImpactSummary` | support summary | 追溯与一致性保护 | object_written |

## 4. 模块状态表

| 顺序 | 模块 | 状态 | 产物 | 下一动作 |
|---:|---|---|---|---|
| 1 | 附录框架:再写入 | done | 文件头、职责、索引、模板和停审。 | 等待主控推进到对象批次。 |
| 2 | core truth 批次 A:定义与目录:先思考 | done | 见 `8`:对象分批、来源回指、写入边界。 | 等待确认后写 `MethodAssetDefinition` 与 `MethodAssetCatalogEntry`。 |
| 3 | core truth 批次 A:定义与目录:再写入 | done | 见 `A1` / `A2` 与 `9`:定义 truth 与目录 truth 对象卡片骨架。 | 进入批次 B 先思考。 |
| 4 | core truth 批次 B:正式化与版本状态:先思考 | done | 见 `10`:`FormalMethodAssetVersion` 与 `FormalizationState` 写入边界。 | 等待确认后写本批对象正文。 |
| 5 | core truth 批次 B:正式化与版本状态:再写入 | done | 见 `A3` / `A4` 与 `11`:正式版本与状态 owner 对象卡片骨架。 | 进入批次 C 先思考。 |
| 6 | support truth 批次 C:关系:先思考 | done | 见 `12`:`MethodAssetRelation` 写入边界。 | 等待确认后写本批对象正文。 |
| 7 | support truth 批次 C:关系:再写入 | done | 见 `A5` 与 `13`:关系 truth 对象卡片骨架。 | 进入批次 D 先思考。 |
| 8 | support summary 批次 D:先思考 | done | 见 `14`:summary 对象边界、依赖顺序和写入边界裁决。 | 等待确认后写本批对象正文。 |
| 9 | support summary 批次 D:再写入 | done | 见 `A6` / `A7` / `A8` 与 `15`:summary 对象卡片骨架。 | 进入 `policies_guards` 附录先思考。 |

## 5. 对象卡片模板

```text
## A?. `ObjectName`

| 项 | 内容 |
|---|---|
| 所属部分 | `Step 5 组成部分` |
| 对象类型 | core truth / state / support summary |
| 结构责任 | ... |
| 来源回指 | `00` / `01` / Step 5 source refs |
| 边界说明 | ... |

| 字段 | 类型 | 作用 |
|---|---|---|

| 状态候选 | 作用 |
|---|---|

| 成员函数 | 作用 |
|---|---|

| 工厂函数 | 作用 |
|---|---|

| 禁止事项 | 说明 |
|---|---|
```

## 6. 本附录禁止事项

- 不写 repository、port、adapter、DTO、event payload、database table 或 persistence index。
- 不保存 governance 执行正文、artifact 正文、外部标准正文、下游运行状态或 raw audit log。
- 不恢复旧 `MethodContent` 七类、fingerprint、snapshot、outbox 或历史 P0/P1 主线。
- 不把 summary 对象写成外部 truth 副本。

## 7. 停审记录

| 检查项 | 结论 |
|---|---|
| 是否只创建框架 | pass |
| 是否写对象卡片正文 | yes:批次 A/B/C/D 八个对象已写入 |
| 是否回填正式 §6 | no |
| 下一动作 | 等待确认后进入 `policies_guards boundary / guard 批次:先思考`。 |

## 8. Core Truth 批次 A:定义与目录:先思考

### 8.1 问题回答

- 本附录不能一次性写完 8 个对象。`MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalMethodAssetVersion`、`FormalizationState`、`MethodAssetRelation` 和三类 summary 的来源、状态 owner 和边界不同,必须分批。
- 第一批只写 `MethodAssetDefinition` 与 `MethodAssetCatalogEntry`。它们共同提供方法资产定义 truth、稳定 subject 和目录 / 适用语境锚点,是后续正式化、消费、关系、追溯和 summary 的共同来源。
- `FormalMethodAssetVersion` 与 `FormalizationState` 不进入第一批,因为它们依赖已成立的 definition / catalog 语境,并且涉及正式化状态来源,应在第二批单独思考。
- `MethodAssetRelation` 不进入第一批,因为关系端点必须回指已成立 definition ref / catalog 语境,同时还要受正式化和分发边界约束。
- `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 不进入第一批,因为它们是 summary / boundary 对象,必须防止被写成外部 truth、治理执行 truth 或下游运行 truth 副本。

### 8.2 诊断

| 对象 | 当前判断 | 原因 |
|---|---|---|
| `MethodAssetDefinition` | 第一批写入 | 直接承接 FR-ML-001、BR-ML-001、BR-ML-003 和 Step 5 `方法资产定义与目录`;不先写它,后续对象会缺 subject anchor。 |
| `MethodAssetCatalogEntry` | 第一批写入 | 直接承接 FR-ML-002、BR-ML-002 和 Step 5 目录 / 适用语境;目录 truth 需与 definition truth 分开,避免 catalog view 成为第二 truth。 |
| `FormalMethodAssetVersion` | 第二批写入 | 依赖 definition / catalog anchor,承接正式版本边界和版本语义稳定。 |
| `FormalizationState` | 第二批写入 | 作为状态 owner / state vocabulary 线索,需要和正式版本一起约束,完整迁移留 Step 9。 |
| `MethodAssetRelation` | 第三批写入 | 是 support truth,端点来源和 relation integrity 需先有 definition / version 语义。 |
| `FormalizationBasisSummary` | 第四批写入 | 是正式化依据 summary,必须和 external summary / governance basis ref 边界分清。 |
| `ExternalSourceSummary` | 第四批写入 | 是外部摘要边界,不得保存外部正文、治理执行或 artifact 正文。 |
| `ConsumptionImpactSummary` | 第四批写入 | 是下游影响摘要,不得保存下游运行 truth。 |

### 8.3 取舍

- 第一批写入对象数量控制为 2 个,不是为了让文件最终短,而是为了让每次写入都可审查、可停审。
- 第一批可以使用 `MethodAssetDefinitionRef`、`CatalogScopeRef`、`ExternalSourceSummaryRef` 等作为字段类型线索,但不得在本附录展开 typed ref 家族;typed ref 正文归 `refs_trace_audit` 附录。
- 第一批可以点名 definition / catalog 的状态候选,但不得写完整状态迁移;状态归属和状态流转留给 Step 9 反查。
- 第一批不得写 `MethodAssetCatalogView`、`MethodAssetConsumptionMaterial`、formal version view、repository、port、DTO、event、database table 或旧 snapshot / fingerprint / outbox。

### 8.4 结构化中间产物

| 写入批次 | 对象 | 来源回指 | 写入边界 |
|---|---|---|---|
| 批次 A | `MethodAssetDefinition`;`MethodAssetCatalogEntry` | `00-需求文档.md` FR-ML-001/002,BR-ML-001~003;`01-架构设计.md` §6/§9;Step 5 `0R.9`/`0R.10`;Step 5 `5.26` | 写基本信息、字段骨架、状态候选、成员函数、工厂函数和禁止事项。 |
| 批次 B | `FormalMethodAssetVersion`;`FormalizationState` | FR-ML-003/004;BR-ML-004/007/009/010/019/020;Step 5 `5.12`;Step 5 `5.26` | 写正式版本和状态 owner,不写版本算法或迁移矩阵。 |
| 批次 C | `MethodAssetRelation` | FR-ML-006/008;BR-ML-011/016;Step 5 `5.18`;Step 5 `5.26` | 写定义性关系 truth,不写 graph algorithm、marketplace transaction 或 distribution protocol。 |
| 批次 D | `FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` | FR-ML-007/008/009;BR-ML-011/019~022;Step 5 `5.12`/`5.16`/`5.20`;01 §9 summary ownership | 写 summary / boundary 对象,不写外部正文、治理执行、证据正文或下游运行 truth。 |

### 8.5 下一写入批次边界

| 项目 | 边界 |
|---|---|
| 下一批 | `core truth 批次 A:定义与目录:再写入` |
| 写入对象 | `MethodAssetDefinition`;`MethodAssetCatalogEntry` |
| 允许写入 | 每个对象的基本信息、关键字段骨架、状态候选、成员函数骨架、工厂函数骨架、禁止事项。 |
| 禁止写入 | typed ref 家族正文、catalog view、formal version、consumption material、trace / audit、policy guard、接口、repository、DTO、DDL、event payload、状态迁移矩阵。 |
| 完成后门禁 | 两个对象都有 Step 5 组成部分、功能来源、边界说明;字段和函数未下沉到详细设计;未恢复旧 `MethodContent` / snapshot / fingerprint / outbox。 |

### 8.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做先思考 | pass |
| 是否写对象卡片正文 | no |
| 是否裁决下一批写入对象 | pass:`MethodAssetDefinition`;`MethodAssetCatalogEntry` |
| 是否回填正式 §6 | no |
| 是否进入 Step 7/8/9 | no |

next_allowed_action: 等待用户确认后进入 `core truth 批次 A:定义与目录:再写入`;只写 `MethodAssetDefinition` 与 `MethodAssetCatalogEntry` 两个对象卡片。

## A1. `MethodAssetDefinition`

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | core truth / aggregate |
| 结构责任 | 承载本仓拥有的方法资产定义语义、稳定身份和定义边界,为正式化、消费、关系和追溯提供共同 subject anchor。 |
| 来源回指 | `00-需求文档.md` FR-ML-001;BR-ML-001;BR-ML-003;`01-架构设计.md` §6/§9;Step 5 `0R.9`/`0R.10`;Step 5 `5.26.1`。 |
| 边界说明 | 只拥有方法资产定义 truth;不裁决正式化结果,不保存外部正文、治理执行、artifact 正文、下游运行状态或旧 P0 content。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| definition_ref | MethodAssetDefinitionRef | 方法资产定义的稳定 typed ref,供正式化、消费、关系和追溯引用。 |
| definition_kind | MethodAssetDefinitionKind | 表达定义语义类别,不得恢复旧 P0 七类对象主轴。 |
| identity_key | MethodAssetIdentityKey | 支撑定义身份稳定判断,防止同一方法资产被重复定义。 |
| definition_summary | MethodAssetDefinitionSummary | 承载本仓拥有的定义语义摘要,不保存外部正文或 artifact 正文。 |
| source_summary_refs | ExternalSourceSummaryRefSet | 记录允许进入本仓的外部摘要来源,不拥有外部 truth。 |
| catalog_entry_refs | MethodAssetCatalogEntryRefSet | 连接定义与目录语境,但不把目录读取材料写成定义 truth。 |

| 状态候选 | 作用 |
|---|---|
| DefinitionEstablished | 定义 truth 已建立,可作为目录、正式化和追溯的锚点。 |
| DefinitionUnderAdjustment | 定义语义正在调整或等待显式变化确认,不得隐式改变既有正式版本含义。 |
| DefinitionRetired | 定义已退出当前使用语境,但历史引用和追溯线索仍需保留。 |

| 成员函数 | 作用 |
|---|---|
| assert_identity_stable(MethodAssetIdentityKey identity_key) | 校验定义身份未漂移。 |
| attach_catalog_entry(MethodAssetCatalogEntryRef catalog_entry_ref) | 将定义锚点连接到目录项。 |
| record_definition_adjustment(DefinitionAdjustmentSummary adjustment_summary) | 记录定义调整线索,不直接裁决正式版本结果。 |
| assert_definition_boundary(DownstreamConsumptionBoundary boundary) | 防止下游消费语境反向拥有或改写定义 truth。 |

| 工厂函数 | 作用 |
|---|---|
| from_accepted_definition(MethodAssetIdentityKey identity_key, MethodAssetDefinitionSummary definition_summary) | 从已被本仓接受的定义语义建立 definition truth。 |
| from_definition_adjustment(MethodAssetDefinitionRef definition_ref, DefinitionAdjustmentSummary adjustment_summary) | 基于显式调整线索形成新的定义状态线索。 |

| 禁止事项 | 说明 |
|---|---|
| 不裁决正式化结果 | 是否进入正式使用语境属于 `FormalMethodAssetVersion` / `FormalizationState`。 |
| 不保存外部正文 | 外部标准、治理裁决、artifact、archive 或示例正文只能以摘要 / ref 进入。 |
| 不保存下游运行 truth | process、identity、runtime、member-images、marketplace、UI 或 artifact 的运行事实不得成为定义成立条件。 |
| 不恢复旧 P0 对象拆分 | 旧 `MethodContent` 七类清单只能作为后置差异审计材料。 |

## A2. `MethodAssetCatalogEntry`

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | core truth / catalog entity |
| 结构责任 | 承载方法资产目录身份、目录范围和适用语境,让人类和系统能稳定识别定义来源。 |
| 来源回指 | `00-需求文档.md` FR-ML-002;BR-ML-002;`01-架构设计.md` §6/§9;Step 5 `0R.9`/`0R.10`;Step 5 `5.26.1`。 |
| 边界说明 | 目录项是识别和适用语境 truth,不是搜索索引、UI 分类、catalog view、正式消费可用性或 marketplace 履约事实。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| catalog_entry_ref | MethodAssetCatalogEntryRef | 目录项自身稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 目录项所属的方法资产定义锚点。 |
| catalog_scope_ref | CatalogScopeRef | 表达目录范围、适用语境或组织语境。 |
| catalog_identity | MethodAssetCatalogIdentity | 支撑人类和系统识别目录项。 |
| applicability_summary | CatalogApplicabilitySummary | 概要表达适用语境,完整判断留给后续流程和状态。 |
| display_summary | MethodAssetDisplaySummary | 为 catalog view 派生展示材料提供来源,不等于 UI 状态。 |

| 状态候选 | 作用 |
|---|---|
| CatalogEntryActive | 目录项当前可作为识别和查找锚点。 |
| CatalogEntryScopeLimited | 目录项存在明确适用范围限制,不得被泛化为全局可用。 |
| CatalogEntryRetired | 目录项退出当前目录语境,但历史 trace / audit 仍需可解释。 |

| 成员函数 | 作用 |
|---|---|
| bind_definition(MethodAssetDefinitionRef definition_ref) | 将目录项绑定到定义锚点。 |
| assert_applicable_to_scope(CatalogScopeRef catalog_scope_ref) | 判断目录项是否适用于给定目录语境。 |
| update_applicability(CatalogApplicabilitySummary applicability_summary) | 更新适用语境摘要,不改变定义 truth。 |
| retire_from_catalog(CatalogRetirementReason reason_ref) | 标记目录项退出当前目录语境。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition(MethodAssetDefinitionRef definition_ref, CatalogScopeRef catalog_scope_ref) | 基于定义锚点建立目录项。 |
| from_reclassification(MethodAssetCatalogEntryRef catalog_entry_ref, CatalogScopeRef catalog_scope_ref) | 基于显式重分类形成新的目录语境线索。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代定义 truth | 目录项只表达识别和适用语境,不能独立创建或修改方法资产定义。 |
| 不等同搜索索引 | 搜索、排序、全文检索或 UI 展示状态不属于目录项 truth。 |
| 不承担正式消费可用性 | 是否可被正式消费由受控消费和正式化对象共同约束。 |
| 不保存 marketplace 履约事实 | listing、交易、安装和结算属于 `L6-marketplace`。 |

## 9. Core Truth 批次 A:定义与目录:再写入

### 9.1 写入内容

- 已写入 `A1. MethodAssetDefinition` 对象卡片。
- 已写入 `A2. MethodAssetCatalogEntry` 对象卡片。
- 已将对象索引中两个对象状态更新为 `object_written`。
- 已将模块状态表中批次 A 再写入更新为 `done`。

### 9.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 typed ref 家族正文 | no |
| 写 catalog view / read material | no |
| 写 formal version / formalization state | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 9.3 停审记录

| 检查项 | 结论 |
|---|---|
| 两个对象是否都有来源回指 | pass |
| 两个对象是否都有边界说明 | pass |
| 字段 / 状态 / 函数是否保持概要骨架 | pass |
| 是否恢复旧 `MethodContent` / snapshot / fingerprint / outbox | no |
| 是否允许进入下一模块 | pass:下一模块为 `core truth 批次 B:正式化与版本状态:先思考` |

next_allowed_action: 等待用户确认后进入 `core truth 批次 B:正式化与版本状态:先思考`;只思考 `FormalMethodAssetVersion` 与 `FormalizationState` 写入边界,不得直接写对象卡片正文。

## 10. Core Truth 批次 B:正式化与版本状态:先思考

### 10.1 问题回答

- 本批只处理 `FormalMethodAssetVersion` 与 `FormalizationState`。二者共同回答“方法资产定义何时进入正式使用语境”以及“正式引用依赖哪个稳定版本边界”。
- `FormalMethodAssetVersion` 必须和 `FormalizationState` 同批思考,因为 `01-架构设计.md` §9.2 要求正式化与版本语义建立保持强一致;只写版本而不写状态 owner,会让正式 / 非正式隔离没有状态来源。
- `FormalizationBasisSummary` 不进入本批。它是依据摘要 / 引用边界,不是正式版本 truth 或状态 owner;若在本批展开,容易把治理执行、标准正文或 artifact 正文误迁入核心 truth。
- `FormalizationEligibilityRule` 与 `VersionStabilityRule` 不进入本批对象正文。资格判断和版本稳定规则属于 `policies_guards` 附录,本批只能点名它们对版本 / 状态的约束。
- 本批不选择 semver、hash、fingerprint、snapshot、schema version、storage version 或具体发布算法。Step 6 只固定概要对象骨架,完整状态迁移、处理流和接口留给 Step 7~9。

### 10.2 诊断

| 对象 | 当前判断 | 来源回指 | 边界风险 |
|---|---|---|---|
| `FormalMethodAssetVersion` | 本批写入 | `00-需求文档.md` FR-ML-004;BR-ML-004/010/020;`01-架构设计.md` §6/§9;Step 5 `5.12`;Step 5 `5.26.1` | 若写成 hash / fingerprint / snapshot,会把版本语义降级为实现机制。 |
| `FormalizationState` | 本批写入 | `00-需求文档.md` FR-ML-003;BR-ML-007/009/019/020;`01-架构设计.md` §6/§9;Step 5 `5.12`;Step 5 `5.26.1` | 若只写成枚举值而没有 owner / 来源,Step 9 会再次私造状态迁移。 |

### 10.3 取舍

- `FormalMethodAssetVersion` 的字段骨架应围绕 definition anchor、catalog context、formalization state、version boundary summary、basis summary ref 和 trace source 展开,但不得写完整版本号算法或不可变存储策略。
- `FormalizationState` 的状态候选只表达概要词表,例如 pending / eligible / formalized / blocked / superseded / retired 等方向;完整迁移矩阵、失败分支和恢复规则留给 Step 9。
- `FormalizationState` 可以引用 `FormalizationBasisSummaryRef` / `GovernanceBasisRef` 作为依据线索,但不能拥有治理裁决正文或执行状态。
- 本批可以说明下游不得消费未正式化资产,但不能写 `MethodAssetConsumptionMaterial`、availability view、query surface 或消费 guard 细节。
- 本批可以点名版本语义变化必须显式,但 `ConsistencyProtectionPolicy`、impact summary、trace material 和 audit trail 仍留给后续附录批次。

### 10.4 结构化中间产物

| 下一写入对象 | 允许写入 | 禁止写入 |
|---|---|---|
| `FormalMethodAssetVersion` | 基本信息、来源回指、正式版本边界字段骨架、状态候选、成员函数骨架、工厂函数骨架、禁止事项。 | semver/hash/fingerprint/snapshot 算法、repository、DTO、event payload、DDL、formal version view、下游消费材料。 |
| `FormalizationState` | 基本信息、状态 owner 责任、状态词表候选、状态判断成员函数骨架、工厂函数骨架、禁止事项。 | 完整状态迁移矩阵、治理执行 workflow、policy enforce 规则、审批 Gate 过程、读取触发正式化、恢复流程。 |

### 10.5 下一写入批次边界

| 项目 | 边界 |
|---|---|
| 下一批 | `core truth 批次 B:正式化与版本状态:再写入` |
| 写入对象 | `FormalMethodAssetVersion`;`FormalizationState` |
| 允许写入 | 两个对象的概要卡片,包括所属部分、对象类型、结构责任、来源回指、边界说明、字段、状态候选、成员函数、工厂函数和禁止事项。 |
| 禁止写入 | `FormalizationBasisSummary` 正文、policy / guard 对象正文、正式版本读取材料、接口、处理流、状态迁移矩阵、持久化、事件、旧 publish / snapshot / fingerprint / outbox 主线。 |
| 完成后门禁 | 两个对象均回指 Step 5 `正式化与版本`;能解释正式 / 非正式隔离和稳定版本边界;未保存外部正文、治理执行、下游运行 truth 或实现机制。 |

### 10.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做先思考 | pass |
| 是否写对象卡片正文 | no |
| 是否裁决下一批写入对象 | pass:`FormalMethodAssetVersion`;`FormalizationState` |
| 是否把依据摘要并入本批 | no |
| 是否选择版本算法或状态迁移矩阵 | no |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `core truth 批次 B:正式化与版本状态:再写入`;只写 `FormalMethodAssetVersion` 与 `FormalizationState` 两个对象卡片,不得写 basis summary、policy guard、read model、接口、流程、状态迁移矩阵或旧机制。

## A3. `FormalMethodAssetVersion`

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | core truth / version boundary |
| 结构责任 | 承载已正式化方法资产的稳定版本语义边界,为受控消费、追溯、关系和外围组织提供可引用的正式版本锚点。 |
| 来源回指 | `00-需求文档.md` FR-ML-004;BR-ML-004;BR-ML-010;BR-ML-020;`01-架构设计.md` §6/§9;Step 5 `5.12`;Step 5 `5.26.1`。 |
| 边界说明 | 只表达正式版本语义和显式变化边界;不选择 semver/hash/fingerprint/snapshot 算法,不保存治理执行、外部正文、artifact 正文或下游运行 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| formal_version_ref | FormalMethodAssetVersionRef | 正式方法资产版本的稳定 typed ref。 |
| definition_ref | MethodAssetDefinitionRef | 版本所属的方法资产定义锚点。 |
| catalog_entry_ref | MethodAssetCatalogEntryRef | 版本成立时对应的目录 / 适用语境线索。 |
| formalization_state_ref | FormalizationStateRef | 回指使版本成立的正式化状态 owner。 |
| version_boundary_summary | FormalVersionBoundarySummary | 概要表达本版本稳定语义边界,不等同具体版本号算法。 |
| basis_summary_refs | FormalizationBasisSummaryRefSet | 记录支撑版本成立的正式依据摘要引用。 |
| supersedes_version_ref | OptionalFormalMethodAssetVersionRef | 指向被显式替代的上一正式版本,不做隐式覆盖。 |
| trace_subject_ref | TraceSubjectRef | 为后续追溯和审计材料提供 subject 边界。 |

| 状态候选 | 作用 |
|---|---|
| FormalVersionCandidate | 已识别候选版本边界,但仍等待正式化状态闭合。 |
| FormalVersionEstablished | 正式版本边界已成立,可作为受控消费和追溯锚点。 |
| FormalVersionSuperseded | 版本已被后续显式版本或等价正式变化口径替代。 |
| FormalVersionRetired | 版本退出当前正式使用语境,但历史引用和追溯仍保留。 |

| 成员函数 | 作用 |
|---|---|
| assert_definition_matches(MethodAssetDefinitionRef definition_ref) | 校验版本仍绑定同一方法资产定义锚点。 |
| assert_boundary_stable(FormalVersionBoundarySummary boundary_summary) | 判断版本语义边界未被静默覆盖。 |
| link_formalization_state(FormalizationStateRef formalization_state_ref) | 绑定使版本成立的正式化状态。 |
| supersede_with(FormalMethodAssetVersionRef next_version_ref) | 用显式后续版本替代当前版本。 |
| retire(VersionRetirementReason reason_ref) | 标记版本退出当前正式使用语境。 |

| 工厂函数 | 作用 |
|---|---|
| from_formalization_state(MethodAssetDefinitionRef definition_ref, FormalizationStateRef formalization_state_ref, FormalVersionBoundarySummary boundary_summary) | 从已闭合的正式化状态建立正式版本边界。 |
| from_explicit_version_change(FormalMethodAssetVersionRef previous_version_ref, VersionSemanticChangeSummary change_summary) | 基于显式版本语义变化形成后续正式版本线索。 |

| 禁止事项 | 说明 |
|---|---|
| 不等同版本号算法 | semver、hash、fingerprint、schema version 或 storage snapshot 不是本对象的概要结论。 |
| 不被读取隐式创建 | query、sync、cache hit、下游引用或运行时使用不得触发正式版本成立。 |
| 不保存外部正文 | 治理结论、标准、ADR、artifact、archive 或证据正文只能通过摘要 / ref 进入。 |
| 不拥有下游消费状态 | 下游是否已同步、运行或展示不影响正式版本 truth 成立。 |

## A4. `FormalizationState`

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | state owner / state vocabulary |
| 结构责任 | 表达方法资产定义进入正式使用语境的状态 owner 和状态词表来源,为正式版本建立、受控消费和 Step 9 状态流转提供锚点。 |
| 来源回指 | `00-需求文档.md` FR-ML-003;BR-ML-007;BR-ML-009;BR-ML-019;BR-ML-020;`01-架构设计.md` §6/§9;Step 5 `5.12`;Step 5 `5.26.1`。 |
| 边界说明 | 只承载正式化状态和可追溯原因线索;不执行治理审批、policy enforce、标准解释、artifact 生命周期或下游消费判断。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| formalization_state_ref | FormalizationStateRef | 正式化状态 owner 的稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 状态所属的方法资产定义锚点。 |
| catalog_entry_ref | MethodAssetCatalogEntryRef | 状态判断所处的目录 / 适用语境线索。 |
| state_kind | FormalizationStateKind | 概要状态词表,完整迁移留 Step 9。 |
| state_reason_summary | FormalizationStateReasonSummary | 记录进入当前状态的安全原因摘要。 |
| basis_summary_refs | FormalizationBasisSummaryRefSet | 记录可用于正式化判断的依据摘要引用。 |
| governance_basis_refs | GovernanceBasisRefSet | 记录条件型治理依据引用,不拥有治理执行 truth。 |
| current_formal_version_ref | OptionalFormalMethodAssetVersionRef | 在已正式化时指向当前正式版本边界。 |

| 状态候选 | 作用 |
|---|---|
| FormalizationPendingBasis | 正式化所需依据仍缺失、不可判定或等待承接。 |
| FormalizationEligible | 定义与依据已满足进入正式使用语境的概要条件。 |
| Formalized | 方法资产已通过显式正式化进入正式使用语境。 |
| FormalizationBlocked | 因依据、边界或治理条件不满足而不能正式化。 |
| FormalizationSuperseded | 状态已被后续正式化判断或版本变化替代。 |
| FormalizationRetired | 正式化语境已退出当前使用范围,历史状态仍可追溯。 |

| 成员函数 | 作用 |
|---|---|
| assert_explicit_trigger(FormalizationTriggerSummary trigger_summary) | 校验状态变化来自显式正式化意图,不是读取或同步副作用。 |
| mark_eligible(FormalizationBasisSummaryRefSet basis_summary_refs) | 基于依据摘要进入可正式化状态。 |
| mark_formalized(FormalMethodAssetVersionRef formal_version_ref) | 绑定正式版本并进入已正式化状态。 |
| block(FormalizationBlockReason reason_ref) | 记录不可正式化原因。 |
| supersede(FormalizationStateRef next_state_ref) | 由后续状态判断替代当前状态。 |
| retire(FormalizationRetirementReason reason_ref) | 标记正式化语境退出当前使用范围。 |

| 工厂函数 | 作用 |
|---|---|
| pending_for_definition(MethodAssetDefinitionRef definition_ref, MethodAssetCatalogEntryRef catalog_entry_ref) | 为已建立的定义和目录语境创建待正式化状态。 |
| from_basis_summary(MethodAssetDefinitionRef definition_ref, FormalizationBasisSummaryRefSet basis_summary_refs) | 基于已承接的依据摘要形成可判断状态线索。 |
| from_explicit_formalization(MethodAssetDefinitionRef definition_ref, FormalMethodAssetVersionRef formal_version_ref) | 从显式正式化结果形成已正式化状态。 |

| 禁止事项 | 说明 |
|---|---|
| 不执行治理流程 | Governance Gate、审批、policy enforce 和裁决执行属于 `L1-governance` 或后续 policy 语义。 |
| 不被使用隐式触发 | 下游读取、引用、同步、缓存命中或运行时使用不得改变正式化状态。 |
| 不保存外部正文 | 治理、标准、ADR、artifact、archive 或证据正文只能以 summary/ref 进入。 |
| 不写完整迁移矩阵 | 允许状态词表候选;触发条件、允许迁移和异常恢复留给 Step 9。 |

## 11. Core Truth 批次 B:正式化与版本状态:再写入

### 11.1 写入内容

- 已写入 `A3. FormalMethodAssetVersion` 对象卡片。
- 已写入 `A4. FormalizationState` 对象卡片。
- 已将对象索引中两个对象状态更新为 `object_written`。
- 已将模块状态表中批次 B 再写入更新为 `done`。

### 11.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 `FormalizationBasisSummary` 正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 formal version view / read material | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写完整状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 11.3 停审记录

| 检查项 | 结论 |
|---|---|
| 两个对象是否都有来源回指 | pass |
| 两个对象是否都回到 Step 5 `正式化与版本` | pass |
| 字段 / 状态 / 函数是否保持概要骨架 | pass |
| 是否选择版本算法、hash、fingerprint 或 snapshot | no |
| 是否恢复旧 publish / outbox 主线 | no |
| 是否允许进入下一模块 | pass:下一模块为 `support truth 批次 C:关系:先思考` |

next_allowed_action: 等待用户确认后进入 `support truth 批次 C:关系:先思考`;只思考 `MethodAssetRelation` 写入边界,不得直接写对象卡片正文,不得回填正式 §6。

## 12. Support Truth 批次 C:关系:先思考

### 12.1 问题回答

- 本批只处理 `MethodAssetRelation`。它回答“方法资产之间有哪些定义性关系,这些关系如何成为受控消费、追溯和外围组织的稳定语义输入”。
- `MethodAssetRelation` 属于 support truth,不是核心定义 truth、不是正式版本 truth,也不是 read model。它应依附已成立的 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalMethodAssetVersion` 和 `FormalizationState`。
- `MethodAssetDistributionRef`、`DistributionContextRef`、`RelatedMethodAssetRef` 等 typed ref / boundary 对象不在本批展开,它们归 `refs_trace_audit` 附录。
- `RelationIntegrityRule` 与 `DistributionBoundaryRule` 不在本批展开,它们归 `policies_guards` 附录;本批只说明 `MethodAssetRelation` 需要被这些规则保护。
- `MethodAssetRelationView`、`DistributionReadMaterial` 和关系读取材料不在本批展开,它们归 `views_materials` 附录;本批不得把读取材料写成第二关系 truth。

### 12.2 诊断

| 对象 | 当前判断 | 来源回指 | 边界风险 |
|---|---|---|---|
| `MethodAssetRelation` | 本批写入 | `00-需求文档.md` FR-ML-006/008;BR-ML-008/011/016/021;`01-架构设计.md` §6/§9;Step 5 `5.18`;Step 5 `5.26.1` | 若写成运行依赖图、推荐结果、marketplace listing 或同步成功记录,会破坏 Definition vs Use 和 marketplace 边界。 |

### 12.3 取舍

- `MethodAssetRelation` 的字段骨架应围绕 source / target definition ref、formal version context、relation kind summary、distribution context signal、relation basis summary 和 trace subject 展开。
- 关系端点必须是 typed ref,不能由 free-form asset id、route param、marketplace id、package path 或外部 URL 直接拼接。
- 本批可以点名关系状态候选,例如 proposed / active / constrained / superseded / retired,但完整迁移和关系完整性判断留给 Step 9 与 `RelationIntegrityRule`。
- 本批不写图遍历算法、关系推荐、关系排序、搜索索引、分发协议、event topic、repository、database index 或 marketplace 上架 / 安装 / 履约事实。
- 关系变化可能影响消费范围和一致性保护,但 `ConsumptionImpactSummary`、`RelationChangeHistory` 和 trace / audit 仍留给后续 summary / trace 附录,本批只保留回指线索。

### 12.4 结构化中间产物

| 下一写入对象 | 允许写入 | 禁止写入 |
|---|---|---|
| `MethodAssetRelation` | 基本信息、来源回指、关系 truth 字段骨架、状态候选、成员函数骨架、工厂函数骨架、禁止事项。 | `MethodAssetDistributionRef` 正文、typed ref 家族正文、RelationIntegrityRule、read model、graph algorithm、marketplace transaction、repository、DTO、event payload、DDL。 |

### 12.5 下一写入批次边界

| 项目 | 边界 |
|---|---|
| 下一批 | `support truth 批次 C:关系:再写入` |
| 写入对象 | `MethodAssetRelation` |
| 允许写入 | 一个概要对象卡片,包括所属部分、对象类型、结构责任、来源回指、边界说明、字段、状态候选、成员函数、工厂函数和禁止事项。 |
| 禁止写入 | 分发 typed ref 正文、policy / guard 对象正文、关系读取材料、trace / history 正文、接口、处理流、状态迁移矩阵、持久化、事件、旧同步 / snapshot / outbox 主线。 |
| 完成后门禁 | 对象回指 Step 5 `关系与分发语义`;能解释关系 truth、分发语义边界和 marketplace 非职责;未保存外部正文、下游运行 truth 或实现机制。 |

### 12.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做先思考 | pass |
| 是否写对象卡片正文 | no |
| 是否裁决下一批写入对象 | pass:`MethodAssetRelation` |
| 是否把 distribution ref / policy / view 并入本批 | no |
| 是否写图算法或 marketplace 交易事实 | no |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `support truth 批次 C:关系:再写入`;只写 `MethodAssetRelation` 一个对象卡片,不得写 distribution ref、policy guard、read model、trace/history、接口、流程、状态迁移矩阵或旧机制。

## A5. `MethodAssetRelation`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | support truth / relation aggregate |
| 结构责任 | 承载方法资产之间的定义性关系,为受控消费、追溯一致性、分发语义和外围组织提供稳定关系输入。 |
| 来源回指 | `00-需求文档.md` FR-ML-006;FR-ML-008;BR-ML-008;BR-ML-011;BR-ML-016;BR-ML-021;`01-架构设计.md` §6/§9;Step 5 `5.18`;Step 5 `5.26.1`。 |
| 边界说明 | 只表达本仓拥有的定义性关系 truth;不表达运行依赖图、推荐结果、搜索索引、同步成功记录、marketplace listing、交易、安装或履约事实。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| relation_ref | MethodAssetRelationRef | 方法资产关系的稳定 typed ref。 |
| source_definition_ref | MethodAssetDefinitionRef | 关系源端方法资产定义锚点。 |
| target_definition_ref | MethodAssetDefinitionRef | 关系目标端方法资产定义锚点。 |
| relation_kind | MethodAssetRelationKind | 概要表达关系语义类别,不下沉到完整关系枚举矩阵。 |
| relation_scope_ref | CatalogScopeRef | 表达关系成立的目录 / 适用语境范围。 |
| source_formal_version_ref | OptionalFormalMethodAssetVersionRef | 关系源端关联的正式版本语境线索。 |
| target_formal_version_ref | OptionalFormalMethodAssetVersionRef | 关系目标端关联的正式版本语境线索。 |
| distribution_context_ref | OptionalDistributionContextRef | 指向可被分发或外围发现理解的语义上下文,不代表分发执行成功。 |
| relation_basis_summary_refs | ExternalSourceSummaryRefSet | 记录支撑关系成立的外部摘要或依据摘要线索。 |
| trace_subject_ref | TraceSubjectRef | 为关系变化追溯和一致性保护提供 subject 边界。 |

| 状态候选 | 作用 |
|---|---|
| RelationProposed | 关系语义被提出,等待端点、正式化或边界条件确认。 |
| RelationActive | 关系已作为定义性关系 truth 成立,可被消费和追溯引用。 |
| RelationConstrained | 关系只在特定目录、正式版本或分发语境下成立。 |
| RelationSuperseded | 关系已被后续显式关系变化替代。 |
| RelationRetired | 关系退出当前适用语境,历史引用和追溯仍保留。 |

| 成员函数 | 作用 |
|---|---|
| assert_endpoints_defined(MethodAssetDefinitionRef source_definition_ref, MethodAssetDefinitionRef target_definition_ref) | 校验关系端点均为已建立的方法资产定义锚点。 |
| assert_formalization_boundary(FormalizationStateRef formalization_state_ref) | 校验关系使用的正式化边界可被解释。 |
| constrain_to_scope(CatalogScopeRef relation_scope_ref) | 将关系限制在明确目录或适用语境内。 |
| attach_distribution_context(DistributionContextRef distribution_context_ref) | 连接分发语义上下文,不表示分发执行成功。 |
| record_relation_change(RelationChangeSummary change_summary) | 记录显式关系变化线索,供追溯一致性保护使用。 |
| supersede(MethodAssetRelationRef next_relation_ref) | 用后续关系 truth 替代当前关系。 |
| retire(RelationRetirementReason reason_ref) | 标记关系退出当前适用语境。 |

| 工厂函数 | 作用 |
|---|---|
| from_definition_endpoints(MethodAssetDefinitionRef source_definition_ref, MethodAssetDefinitionRef target_definition_ref, MethodAssetRelationKind relation_kind) | 从两个方法资产定义锚点建立候选定义性关系。 |
| from_formal_relation_context(MethodAssetDefinitionRef source_definition_ref, MethodAssetDefinitionRef target_definition_ref, FormalMethodAssetVersionRef formal_version_ref) | 基于正式版本语境形成关系 truth。 |
| from_explicit_relation_change(MethodAssetRelationRef previous_relation_ref, RelationChangeSummary change_summary) | 基于显式关系变化形成后续关系线索。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代定义或正式版本 truth | 关系只连接已成立的定义 / 版本语义,不能创建或修改方法资产定义。 |
| 不等同运行依赖图 | 流程调用、运行依赖、推荐结果、搜索排序或 UI 分类不是关系 truth。 |
| 不保存 marketplace 事实 | listing、交易、订单、购买、安装、结算和履约属于 `L6-marketplace`。 |
| 不保存外部正文 | 外部标准、artifact、archive、package 或 marketplace 正文只能以 summary/ref 进入。 |
| 不写关系完整性算法 | 关系完整性和越界保护由 `RelationIntegrityRule` / `DistributionBoundaryRule` 及后续流程承接。 |

## 13. Support Truth 批次 C:关系:再写入

### 13.1 写入内容

- 已写入 `A5. MethodAssetRelation` 对象卡片。
- 已将对象索引中 `MethodAssetRelation` 状态更新为 `object_written`。
- 已将模块状态表中批次 C 再写入更新为 `done`。

### 13.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 distribution ref / context ref 正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 relation view / distribution read material | no |
| 写 trace / history / lineage 正文 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写完整状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 13.3 停审记录

| 检查项 | 结论 |
|---|---|
| `MethodAssetRelation` 是否完成概要对象卡片 | pass |
| 对象是否回到 Step 5 `关系与分发语义` | pass |
| 字段 / 状态 / 函数是否保持概要骨架 | pass |
| 是否写 graph algorithm / relation traversal / search index | no |
| 是否写 marketplace listing / transaction / install / fulfillment | no |
| 是否允许进入下一模块 | pass:下一模块为 `support summary 批次 D:先思考` |

next_allowed_action: 等待用户确认后进入 `support summary 批次 D:先思考`;只思考 `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 三个 summary 对象的写入边界,不得直接写对象卡片正文,不得回填正式 §6。

## 14. Support Summary 批次 D:先思考

### 14.1 问题回答

- 本批只处理 `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 三个 support summary 对象。它们共同解决“外部依据、正式化依据、下游影响如何以安全摘要进入本仓”,但各自不能替代核心 truth。
- 三个对象必须同批思考,因为它们都承担 summary / boundary 职责,都需要防止正文入仓、治理执行入仓和下游运行 truth 入仓。如果拆散,Step 7/8 可能会为每条路径私造摘要或 ref。
- `ExternalSourceSummary` 是外部材料进入本仓的安全摘要边界,来源包括治理结论、标准、ADR、artifact / archive 或 marketplace 生态引用,但不拥有这些外部来源的正文或生命周期。
- `FormalizationBasisSummary` 是正式化与版本判断使用的依据摘要,它可以引用 `ExternalSourceSummary` 或 governance basis,但只表达“可用于正式化的依据线索”,不执行治理审批,也不保存治理裁决正文。
- `ConsumptionImpactSummary` 是追溯与一致性保护使用的下游影响摘要,只表达已知、未知、待承接或待确认的影响口径,不能保存 process、identity、runtime、member-images 等下游运行状态正文。

### 14.2 诊断

| 对象 | 当前判断 | 来源回指 | 边界风险 |
|---|---|---|---|
| `ExternalSourceSummary` | 本批写入 | `00-需求文档.md` BR-ML-019/022;`01-架构设计.md` §9;Step 5 `5.20`;Step 5 `5.26.1` | 若写成外部正文摘录、artifact 元数据镜像或 marketplace 对象副本,会形成外部 truth 副本。 |
| `FormalizationBasisSummary` | 本批写入 | `00-需求文档.md` FR-ML-003/004/007;BR-ML-019/020;`01-架构设计.md` §9/§10;Step 5 `5.12`;Step 5 `5.26.1` | 若写成治理执行、审批流程或 policy enforce 结果,会把 `L1-governance` 职责迁入本仓。 |
| `ConsumptionImpactSummary` | 本批写入 | `00-需求文档.md` FR-ML-008;BR-ML-011/020/021;`01-架构设计.md` §9/§10;Step 5 `5.16`;Step 5 `5.26.1` | 若写成下游运行状态、同步成功记录或对账协议,会破坏 Definition vs Use 和下游数据归属。 |

### 14.3 取舍

- 本批保留三个独立 summary 对象,不把 `FormalizationBasisSummary` 并入 `FormalizationState`,因为依据摘要需要在正式化状态之外独立承接、复用和追溯。
- 本批保留 `ExternalSourceSummary` 独立对象,不把它拆到每个消费方对象内,因为外部正文禁止边界必须统一,否则正式化、追溯、关系和外围组织会各自复制外部来源。
- 本批保留 `ConsumptionImpactSummary` 独立对象,不把它并入受控消费材料,因为它描述“变化对既有消费的影响”,不是消费材料自身,也不是下游实时状态。
- 三个 summary 可以使用 typed ref 字段类型线索,例如 `ExternalSourceRef`、`GovernanceBasisRef`、`ConsumptionContextRef`、`TraceSubjectRef`,但这些 ref 家族正文归 `refs_trace_audit` 附录。
- 本批可以点名状态候选,例如 accepted / pending / unavailable / unknown / stale,但完整状态迁移和恢复规则留给 Step 9 与 operations / recovery 附录。

### 14.4 结构化中间产物

| 下一写入对象 | 允许写入 | 禁止写入 |
|---|---|---|
| `FormalizationBasisSummary` | 正式化依据摘要对象卡片,包含依据来源、适用定义 / 版本语境、摘要状态、成员函数和禁止事项。 | 治理审批流程、policy enforce、治理裁决正文、标准全文、artifact 正文、完整证据 schema。 |
| `ExternalSourceSummary` | 外部来源安全摘要对象卡片,包含来源类型、外部引用、摘要边界、acceptance 线索和正文禁止事项。 | 外部正文摘录、archive 包、artifact 生命周期、marketplace 交易 / listing 正文、外部系统运行状态。 |
| `ConsumptionImpactSummary` | 下游影响摘要对象卡片,包含影响范围、已知 / 未知口径、消费语境线索、追溯 subject 和禁止事项。 | 下游内部状态、运行日志、同步成功记录、回报协议、对账算法、下游仓私有 truth。 |

### 14.5 下一写入批次边界

| 项目 | 边界 |
|---|---|
| 下一批 | `support summary 批次 D:再写入` |
| 写入对象 | `FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` |
| 允许写入 | 三个概要对象卡片,包括所属部分、对象类型、结构责任、来源回指、边界说明、字段、状态候选、成员函数、工厂函数和禁止事项。 |
| 禁止写入 | typed ref 家族正文、policy / guard 对象正文、read model、trace / audit / history 正文、接口、处理流、状态迁移矩阵、持久化、事件、外部正文、治理执行、下游运行 truth。 |
| 完成后门禁 | 三个对象均回指 Step 5 组成部分;能解释 summary / ref / body-free 边界;未复制外部、治理、artifact、marketplace 或下游运行事实。 |

### 14.6 自检

| 检查项 | 结论 |
|---|---|
| 是否只做先思考 | pass |
| 是否写对象卡片正文 | no |
| 是否裁决下一批写入对象 | pass:`FormalizationBasisSummary`;`ExternalSourceSummary`;`ConsumptionImpactSummary` |
| 是否把外部正文 / 治理执行 / 下游运行 truth 写入本仓 | no |
| 是否写接口、流程、状态迁移或持久化 | no |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `support summary 批次 D:再写入`;只写 `FormalizationBasisSummary`、`ExternalSourceSummary`、`ConsumptionImpactSummary` 三个对象卡片,不得写 typed ref 家族正文、policy guard、read model、trace/history、接口、流程、状态迁移矩阵或旧机制。

## A6. `FormalizationBasisSummary`

| 项 | 内容 |
|---|---|
| 所属部分 | 正式化与版本 |
| 对象类型 | support summary / basis boundary |
| 结构责任 | 承载可用于正式化与版本判断的安全依据摘要,让治理结论、标准、ADR 或 artifact/archive 线索能够被引用而不迁入正文。 |
| 来源回指 | `00-需求文档.md` FR-ML-003;FR-ML-004;FR-ML-007;BR-ML-019;BR-ML-020;`01-架构设计.md` §9/§10;Step 5 `5.12`;Step 5 `5.26.1`。 |
| 边界说明 | 只表达正式化依据摘要和引用线索;不执行治理审批、policy enforce、标准解释、artifact 生命周期或证据文件管理。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| basis_summary_ref | FormalizationBasisSummaryRef | 正式化依据摘要的稳定 typed ref。 |
| definition_ref | MethodAssetDefinitionRef | 依据适用的方法资产定义锚点。 |
| catalog_entry_ref | OptionalMethodAssetCatalogEntryRef | 依据适用的目录或语境线索。 |
| basis_kind | FormalizationBasisKind | 概要表达依据类别,例如治理结论、标准、ADR、artifact 或 archive 线索。 |
| external_summary_refs | ExternalSourceSummaryRefSet | 连接外部安全摘要,不保存外部正文。 |
| governance_basis_refs | GovernanceBasisRefSet | 记录条件型治理依据引用,不拥有治理执行 truth。 |
| applicability_summary | FormalizationBasisApplicabilitySummary | 概要说明该依据可支持哪些正式化判断。 |
| trace_subject_ref | TraceSubjectRef | 为后续正式化追溯和审计提供 subject 边界。 |

| 状态候选 | 作用 |
|---|---|
| BasisPending | 依据摘要已登记但仍等待来源可用性、适用性或边界确认。 |
| BasisAccepted | 依据摘要可用于正式化判断。 |
| BasisRejected | 依据摘要因边界、适用性或安全原因不可用于正式化。 |
| BasisUnavailable | 依据来源暂不可用或不可判定,正式化应保持挂起或待依据。 |
| BasisSuperseded | 依据摘要已被后续更明确的依据线索替代。 |

| 成员函数 | 作用 |
|---|---|
| assert_body_free() | 校验依据摘要没有携带治理、标准、ADR、artifact 或 archive 正文。 |
| assert_applicable_to_definition(MethodAssetDefinitionRef definition_ref) | 判断依据摘要是否适用于给定定义锚点。 |
| link_external_summary(ExternalSourceSummaryRef external_summary_ref) | 连接外部来源安全摘要。 |
| mark_accepted(FormalizationBasisAcceptanceReason reason_ref) | 标记依据摘要可用于正式化判断。 |
| mark_unavailable(ExternalSourceUnavailableReason reason_ref) | 标记依据来源不可用或不可判定。 |
| supersede_with(FormalizationBasisSummaryRef next_basis_summary_ref) | 用后续依据摘要替代当前依据摘要。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_summary(MethodAssetDefinitionRef definition_ref, ExternalSourceSummaryRef external_summary_ref, FormalizationBasisKind basis_kind) | 从外部安全摘要形成正式化依据摘要。 |
| from_governance_basis(MethodAssetDefinitionRef definition_ref, GovernanceBasisRef governance_basis_ref) | 从治理依据引用形成正式化依据摘要,不复制治理执行正文。 |
| from_basis_reassessment(FormalizationBasisSummaryRef previous_basis_summary_ref, FormalizationBasisReassessmentSummary reassessment_summary) | 基于显式复核形成后续依据摘要线索。 |

| 禁止事项 | 说明 |
|---|---|
| 不执行治理审批 | Gate、审批、policy enforce、裁决过程和治理执行状态不属于本对象。 |
| 不保存外部正文 | 标准全文、ADR 正文、artifact 正文、archive 包或证据文件正文只能被引用。 |
| 不直接建立正式版本 | 依据摘要只能作为正式化判断输入,不能绕过 `FormalizationState` / `FormalMethodAssetVersion`。 |
| 不写证据 schema | 证据字段全集、验收 artifact schema 和审计 report 留给后续测试 / 验收设计。 |

## A7. `ExternalSourceSummary`

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | support summary / external basis |
| 结构责任 | 承载外部治理、标准、ADR、artifact、archive 或 marketplace 生态来源的安全摘要,为定义、正式化、追溯、关系和外围组织提供 body-free 依据线索。 |
| 来源回指 | `00-需求文档.md` BR-ML-019;BR-ML-022;NFR-ML-007;`01-架构设计.md` §9/§10;Step 5 `5.20`;Step 5 `5.26.1`。 |
| 边界说明 | 只拥有本仓可使用的安全摘要和引用状态;不拥有外部来源正文、外部生命周期、治理执行、artifact 包、archive 包、marketplace 交易或外部系统运行 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| external_summary_ref | ExternalSourceSummaryRef | 外部来源安全摘要的稳定 typed ref。 |
| external_source_ref | ExternalSourceRef | 指向外部来源的 typed ref,不等同正文入仓。 |
| source_kind | ExternalSourceKind | 概要表达外部来源类别。 |
| safe_summary | ExternalSafeSummary | 本仓允许保存的安全摘要。 |
| source_version_ref | OptionalExternalSourceVersionRef | 外部来源版本线索,不拥有其版本 truth。 |
| artifact_archive_ref | OptionalArtifactArchiveRef | artifact / archive 引用线索,不保存包体或证据正文。 |
| acceptance_state | ExternalBasisAcceptanceStateKind | 概要表达摘要是否可被本仓使用,完整状态迁移留 Step 9。 |
| captured_context_ref | OptionalTraceSubjectRef | 为摘要承接、变更和审计解释提供 subject 边界。 |

| 状态候选 | 作用 |
|---|---|
| ExternalSummaryCaptured | 外部安全摘要已被本仓承接。 |
| ExternalSummaryAccepted | 摘要通过边界检查,可作为依据或追溯线索使用。 |
| ExternalSummaryRejected | 摘要因正文、权限、来源或边界问题不可使用。 |
| ExternalSummaryUnavailable | 外部来源暂不可用、不可解析或不可判定。 |
| ExternalSummarySuperseded | 摘要已被后续来源版本或更安全摘要替代。 |

| 成员函数 | 作用 |
|---|---|
| assert_no_body_payload() | 校验摘要未携带外部正文、包体或证据文件正文。 |
| assert_source_ref_typed(ExternalSourceRef external_source_ref) | 校验外部来源由 typed ref 表达,不是 URL / path / 字符串拼接。 |
| mark_accepted(ExternalBasisAcceptanceReason reason_ref) | 标记外部摘要可进入本仓语义判断。 |
| mark_rejected(ExternalBasisRejectionReason reason_ref) | 标记外部摘要被拒绝并记录安全原因线索。 |
| mark_unavailable(ExternalSourceUnavailableReason reason_ref) | 标记外部来源不可用或不可判定。 |
| supersede_with(ExternalSourceSummaryRef next_external_summary_ref) | 用后续安全摘要替代当前摘要。 |

| 工厂函数 | 作用 |
|---|---|
| from_typed_source(ExternalSourceRef external_source_ref, ExternalSafeSummary safe_summary) | 从 typed external source ref 和安全摘要建立外部摘要。 |
| from_artifact_reference(ArtifactArchiveRef artifact_archive_ref, ExternalSafeSummary safe_summary) | 从 artifact / archive 引用建立安全摘要,不复制包体。 |
| from_source_refresh(ExternalSourceSummaryRef previous_summary_ref, ExternalSafeSummary refreshed_summary) | 基于来源刷新形成后续安全摘要。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 标准、ADR、artifact、archive、marketplace listing 或外部文档正文不得作为字段进入。 |
| 不拥有外部生命周期 | 外部来源创建、审批、发布、归档、交易、安装或履约不属于本仓。 |
| 不替代正式化依据判断 | 外部摘要可被 `FormalizationBasisSummary` 使用,但不直接形成正式化结果。 |
| 不写引用解析实现 | URL 解析、文件访问、provider 调用、重试和刷新实现留给后续接口 / 流程。 |

## A8. `ConsumptionImpactSummary`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | support summary / impact boundary |
| 结构责任 | 承载正式方法资产变化对既有消费的影响摘要,为显式变化识别、追溯解释和一致性保护提供安全输入。 |
| 来源回指 | `00-需求文档.md` FR-ML-008;BR-ML-011;BR-ML-020;BR-ML-021;NFR-ML-006;`01-架构设计.md` §9/§10;Step 5 `5.16`;Step 5 `5.26.1`。 |
| 边界说明 | 只保存下游影响的正式摘要和未知 / 待承接口径;不保存 process、identity、runtime、member-images 或其他下游运行状态正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| impact_summary_ref | ConsumptionImpactSummaryRef | 消费影响摘要的稳定 typed ref。 |
| changed_formal_version_ref | FormalMethodAssetVersionRef | 触发影响判断的正式版本或显式版本变化线索。 |
| impacted_definition_ref | MethodAssetDefinitionRef | 被影响的方法资产定义锚点。 |
| consumption_context_refs | ConsumptionContextRefSet | 已知受影响消费语境引用,不保存下游内部状态。 |
| impact_kind | ConsumptionImpactKind | 概要表达影响类别。 |
| impact_disposition | ConsumptionImpactDispositionKind | 表达已知、未知、待承接、待确认或无影响等安全口径。 |
| downstream_summary_refs | DownstreamImpactSummaryRefSet | 可选下游正式回报摘要引用,不拥有回报协议正文。 |
| trace_subject_ref | TraceSubjectRef | 为影响变化追溯和一致性保护提供 subject 边界。 |

| 状态候选 | 作用 |
|---|---|
| ImpactUnknown | 影响尚不可判定,不得假定无影响。 |
| ImpactPendingDownstreamSummary | 等待下游正式影响摘要承接。 |
| ImpactKnown | 已形成可解释影响摘要。 |
| ImpactNoKnownEffect | 当前依据下未发现已知影响,但不等同扫描所有下游 truth。 |
| ImpactSuperseded | 当前影响摘要已被后续版本变化或后续回报替代。 |

| 成员函数 | 作用 |
|---|---|
| assert_formal_change(FormalMethodAssetVersionRef changed_formal_version_ref) | 校验影响摘要来自正式版本或显式语义变化。 |
| mark_unknown(ConsumptionImpactUnknownReason reason_ref) | 标记影响不可判定或缺少正式摘要。 |
| attach_consumption_context(ConsumptionContextRef consumption_context_ref) | 关联受影响消费语境引用,不复制下游状态。 |
| attach_downstream_summary(DownstreamImpactSummaryRef downstream_summary_ref) | 连接下游正式影响摘要引用。 |
| classify_impact(ConsumptionImpactKind impact_kind) | 记录概要影响类别。 |
| supersede_with(ConsumptionImpactSummaryRef next_impact_summary_ref) | 用后续影响摘要替代当前摘要。 |

| 工厂函数 | 作用 |
|---|---|
| from_formal_version_change(FormalMethodAssetVersionRef changed_formal_version_ref, MethodAssetDefinitionRef impacted_definition_ref) | 从正式版本变化建立待判断影响摘要。 |
| from_downstream_summary(FormalMethodAssetVersionRef changed_formal_version_ref, DownstreamImpactSummaryRef downstream_summary_ref) | 从下游正式摘要引用建立影响摘要,不复制下游运行 truth。 |
| unknown_for_change(FormalMethodAssetVersionRef changed_formal_version_ref, ConsumptionImpactUnknownReason reason_ref) | 为影响不可判定场景建立安全未知口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存下游运行状态 | 流程实例、成员状态、runtime 执行、同步成功、缓存命中或 UI 展示状态不得入仓。 |
| 不要求下游同步完成 | 下游摘要缺失时保留 unknown / pending,不得回滚或阻塞已成立的核心 truth。 |
| 不写回报协议 | 订阅、轮询、事件 payload、对账算法和重试策略留给 Step 7/8/operations。 |
| 不替代一致性保护策略 | 影响摘要是输入线索,保护判断由 `ConsistencyProtectionPolicy` 和后续流程承接。 |

## 15. Support Summary 批次 D:再写入

### 15.1 写入内容

- 已写入 `A6. FormalizationBasisSummary` 对象卡片。
- 已写入 `A7. ExternalSourceSummary` 对象卡片。
- 已写入 `A8. ConsumptionImpactSummary` 对象卡片。
- 已将对象索引中三个 summary 对象状态更新为 `object_written`。
- 已将模块状态表中批次 D 再写入更新为 `done`。

### 15.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 typed ref 家族正文 | no |
| 写 policy / guard 对象正文 | no |
| 写 read model / projection | no |
| 写 trace / history / audit 正文 | no |
| 写接口 / repository / DTO / DDL / event payload | no |
| 写完整状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 15.3 停审记录

| 检查项 | 结论 |
|---|---|
| 三个 summary 对象是否完成概要对象卡片 | pass |
| 对象是否分别回到 Step 5 `正式化与版本`、`外部摘要与引用`、`追溯与一致性保护` | pass |
| 字段 / 状态 / 函数是否保持概要骨架 | pass |
| 是否保存外部正文 / 治理执行 / 下游运行 truth | no |
| 是否允许进入下一模块 | pass:下一模块为 `policies_guards boundary / guard 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `policies_guards boundary / guard 批次:先思考`;只思考 boundary / guard 对象批次、来源回指和写入边界,不得直接写对象卡片正文,不得回填正式 §6。
