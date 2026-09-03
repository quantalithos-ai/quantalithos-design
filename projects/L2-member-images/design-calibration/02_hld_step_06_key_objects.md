# L2-member-images 02 概要 Step 6: 关键对象轮廓

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 6 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 7 文件；字段与函数均为概要骨架，不是完整 schema 或实现

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 5 五个主要组成部分、对象发现维度 / 候选池、Step 4 主体框架和 Step 3 约束 |
| 规范 | 已读取概要设计 SOP Step 6 与书写规范 §4.6；字段表、函数表和对象独立成节规则已应用 |
| 本步目标 | 从候选池正式化关键对象，冻结所属部分、关键字段类型、状态、行为骨架和禁止事项，并为 Step 7~9 反查提供唯一主语 |
| 本步禁止 | 新增未来自 Step 5 的对象；写完整字段全集、serialization、完整函数签名、DDL、外部 DTO / SDK body；读取旧正式 02 |

## 1. 对象候选池筛选说明

| 候选名称 / 类别 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` | DefinitionAssembly truth / state | 正式关键对象 | 它们分别承载 family、variant、完整静态输入和 revision，不能合并为单一 image record。 |
| `MappingSourceSnapshot`、`ComponentPinSet`、`SeedPlacementBinding` | DefinitionAssembly reference / boundary | 正式值对象 / snapshot | 需要表达来源、pin、placement 与 validity，但不保存外部正文。 |
| `AssemblyCompletenessGuard`、`PinIntegrityGuard`、`CandidateFormationGuard`、`ProvenanceCompletenessGuard`、`ApplicableGateGuard`、`EntryPinGuard`、`AvailabilityTransitionGuard`、`ReferenceValidityGuard`、`ProjectionReadOnlyGuard` | Policy / invariant | 正式 policy / guard 对象 | 这些 guard 直接决定后续结构和 fail-closed，不应散落为临时 helper。 |
| `BuildInputGuard` | BuildCandidate policy candidate | 不单独正式化 | 输入完整性已由 `AssemblyCompletenessGuard`、`BuildInputSnapshot.verify_complete(...)` 和 `CandidateFormationGuard` 分阶段承担；另建同义 guard 会形成重复判断源。 |
| `BuildIntent`、`BuildAttempt`、`BuildInputSnapshot`、`BuildOutcomeConclusion`、`CandidateImage` | BuildCandidate truth / state / boundary | 正式关键对象 | intent、attempt、input、external outcome 与 candidate 阶段不同，必须独立。 |
| `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision`、`ArtifactHandoffRecord` | Qualification truth / handoff | 正式关键对象 | provenance、applicable gate、eligibility、Artifact handoff 分域。 |
| `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap` | SupplyEntry truth / state / boundary | 正式关键对象 | availability、pinned entry、consumer gap 不同 owner / 生命周期。 |
| `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness`、`ImageTraceRecord`、`ImageDerivedReadModel` | ReferenceDerived boundary / projection / audit | 正式关键对象 | 表达受控影子、缺口、投影 freshness、追溯和可重建读模型。 |
| `MappingRef`、`ComponentReleaseRef`、`SeedTemplateRef`、`RegistryImageRef`、`EvidenceConclusionRef`、`ArtifactConsumableRef` | external reference | 仅作字段类型 | exact contract 和正文 owner 在相邻仓；不在本步展开成外部领域对象。 |
| `CommandMetadata`、`ActorContext`、`IdempotencyKey`、`EventEnvelope`、`JobContext` | interface / invocation context | 留 Step 7 / 03 | 它们是接口输入骨架，不是镜像域 truth。 |
| `Repository`、`Port`、`Adapter`、`ProjectionBuilder`、`DTO`、数据库表、后端 SDK response | implementation / boundary carrier | 不作为关键对象 | 由 Step 7 / 03 定义接口与实现契约，不能反向成为领域主语。 |

## 2. 对象正式化原则

- 每个正式对象只归属一个主要组成部分；跨部分只通过 typed ref、已提交 fact、snapshot 或 safe view 关联。
- 外部正文、secret、live memory、checkpoint、workspace live content、job / log / report body 不得成为字段。
- 状态轴按阶段分别成立；没有一个对象代表全链路 `ready`。
- 函数骨架只表达保护 invariant 的行为，参数使用 `TypeName param_name`，返回类型与实现留给 03。
- 纯 projection / history / policy 对象如果没有独立生命周期，省略不适用的状态或工厂表，并在表外说明原因。

## 3. DefinitionAssembly 对象

### 3.1 `ImageFamilyDefinition`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | domain aggregate |
| 主要责任 | 标识一组同源 image variant 的本仓 family 语义，不拥有 RoleDefinition 或 component 正文。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `family_id` | `ImageFamilyId` | 稳定 family 身份。 |
| `family_name` | `ImageFamilyName` | 供人类 / 查询识别的安全名称。 |
| `variant_refs` | `ImageVariantRefSet` | 关联本仓 variant，不嵌入 variant 正文。 |
| `source_context` | `DefinitionSourceContext` | 记录来源语境与形成原因。 |
| `active_revision_ref` | `OptionalVariantRevisionRef` | 指向当前有效 revision，不表示 available。 |
| `history_ref` | `DefinitionHistoryRef` | 回指不可覆盖的修订历史。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | family 语义已建立但尚未有可用 variant revision。 |
| `resolved` | 本地 family 关系完整且可供 variant 继续判断。 |
| `superseded` | 后续 family 语义替代当前版本，旧事实保留。 |
| `blocked` | 来源或边界冲突使新 revision 不可形成。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_variant(ImageVariantRef variant_ref)` | 将已存在的本仓 variant 关联到 family。 |
| `set_active_revision(VariantRevisionRef revision_ref, RevisionReason reason)` | 在 revision guard 通过后更新 family 当前指针。 |
| `supersede(DefinitionRevisionRef replacement_ref, ActorContext actor)` | 追加替代关系而不覆盖历史。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create(ImageFamilyId family_id, ImageFamilyName family_name, DefinitionSourceContext source_context)` | 建立初始 family 语义。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 RoleDefinition / mapping body | 仅可保存 source snapshot / ref。 |
| 以 family 状态表示 candidate / eligibility / availability | 各阶段由独立对象承载。 |

### 3.2 `ImageVariantDefinition`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | domain entity |
| 主要责任 | 表达一个 image variant 的 persona / assembly 身份和受控来源绑定。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `variant_id` | `ImageVariantId` | variant 稳定身份。 |
| `family_ref` | `ImageFamilyRef` | 回指所属 family。 |
| `persona_binding` | `PersonaBinding` | 表达 persona 语义来源，不保存 persona live behavior。 |
| `mapping_snapshot_ref` | `MappingSourceSnapshotRef` | 回指经验证的 Role mapping 来源。 |
| `current_revision_ref` | `OptionalVariantRevisionRef` | 指向本仓当前 revision。 |
| `definition_status` | `VariantDefinitionStatus` | 表达 resolved / blocked / superseded。 |
| `revision_history_ref` | `DefinitionHistoryRef` | 追溯变更语境。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | 尚未通过来源与装配完整性判断。 |
| `resolved` | variant identity 与来源绑定可供 baseline 形成。 |
| `blocked` | mapping / input / policy gap 阻断新 revision。 |
| `superseded` | variant identity 被显式替代，历史仍可读。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `bind_mapping(MappingSourceSnapshot mapping_snapshot)` | 绑定 body-free mapping 来源与 validity。 |
| `propose_revision(AssemblyBaseline baseline, RevisionReason reason)` | 从完整 baseline 产生 revision 候选。 |
| `mark_blocked(ContractGap gap)` | 记录不能形成 positive definition 的原因。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `define(ImageVariantId variant_id, ImageFamilyRef family_ref, PersonaBinding persona_binding, MappingSourceSnapshot mapping_snapshot)` | 建立初始 variant definition。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| hardcode Role -> variant mapping | mapping owner 在 Method Library。 |
| 读取 live runtime / member 状态补齐定义 | static / live 必须分离。 |

### 3.3 `AssemblyBaseline`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | immutable value / aggregate boundary |
| 主要责任 | 固化一个 variant 可判断的完整静态装配输入集合。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `baseline_id` | `AssemblyBaselineId` | 本次完整输入语境身份。 |
| `variant_ref` | `ImageVariantRef` | 关联 variant。 |
| `component_pins` | `ComponentPinSet` | runtime / tools / member / extras 等必要 pinned refs。 |
| `seed_bindings` | `SeedPlacementBindingSet` | policy / memory / workspace template ref 与 placement。 |
| `mapping_snapshot` | `MappingSourceSnapshot` | 记录 mapping source identity / validity。 |
| `base_ref` | `BaseImageRef` | 固定 base 身份；hardened base future 时保持 absent / pending。 |
| `completeness` | `BaselineCompleteness` | 区分 complete / incomplete / conflict。 |
| `captured_at` | `Timestamp` | 固定判断语境时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `incomplete` | 必要 pin、placement 或 source validity 缺失。 |
| `complete` | 所有当前必要静态输入可验证且 immutable。 |
| `conflict` | 来源或版本彼此冲突，禁止 buildable revision。 |
| `superseded` | 被新的 baseline 取代，历史不覆盖。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_complete()` | 判断是否满足当前 necessary input 集合。 |
| `bind_component(ComponentReleaseRef component_ref)` | 将已验证 component ref 加入 baseline。 |
| `bind_seed(SeedPlacementBinding seed_binding)` | 加入静态 seed placement，不接收 live body。 |
| `supersede(AssemblyBaselineRef replacement_ref)` | 建立新 baseline 的替代关系。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(ImageVariantRef variant_ref, MappingSourceSnapshot mapping_snapshot, ComponentPinSet component_pins, SeedPlacementBindingSet seed_bindings, BaseImageRef base_ref, Timestamp captured_at)` | 从受控 refs 固化一次完整装配语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 component / seed semantic body | 只保存 ref、pin、placement 与 safe summary。 |
| 用 default / latest / live state 填缺口 | incomplete 必须阻断后续 positive lane。 |

### 3.4 `VariantRevision`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | domain aggregate / history anchor |
| 主要责任 | 将 variant definition 与 immutable assembly baseline 绑定为可追溯 revision。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `revision_id` | `VariantRevisionId` | revision 身份。 |
| `variant_ref` | `ImageVariantRef` | 关联 variant。 |
| `baseline_ref` | `AssemblyBaselineRef` | 绑定完整输入语境。 |
| `derivation_ref` | `DerivationRecordRef` | 回指变更与派生原因。 |
| `revision_status` | `VariantRevisionStatus` | 区分 proposed / buildable / invalid / superseded。 |
| `supersedes_ref` | `OptionalVariantRevisionRef` | 保留演进链。 |
| `created_at` | `Timestamp` | 记录成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `proposed` | revision 候选已形成，尚未通过完整性 guard。 |
| `buildable` | 允许创建 build intent；不代表 build 成功。 |
| `invalid` | 来源 / pin / derivation 冲突，不能进入 build。 |
| `superseded` | 新 revision 已替代其当前效力。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate(AssemblyCompletenessGuard guard)` | 依据当前 guard 判断 revision 是否 buildable。 |
| `supersede(VariantRevisionRef replacement_ref, RevisionReason reason)` | 追加替代关系。 |
| `can_start_build()` | 只判断本地 revision 前置条件，不启动外部工作。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `propose(ImageVariantRef variant_ref, AssemblyBaselineRef baseline_ref, DerivationRecordRef derivation_ref)` | 建立 revision 候选。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 build / candidate / eligibility 状态写入 revision | 后续阶段有独立对象。 |
| 原地重写 baseline 或 digest | 历史必须 append / supersede。 |

### 3.5 `MappingSourceSnapshot`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | body-free reference snapshot |
| 主要责任 | 固定 Role / mapping 来源身份、版本、validity 与 freshness，不复制 mapping body。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref` | `MappingRef` | 回指 Method Library 正式来源。 |
| `source_revision` | `SourceRevision` | 固定来源版本语境。 |
| `validity` | `ReferenceValidity` | 区分 valid / stale / conflict / unavailable。 |
| `captured_at` | `Timestamp` | 标记 snapshot 时点。 |
| `safe_conclusion` | `SafeReferenceConclusion` | 记录可安全消费的结论，不保存正文。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_usable()` | 判断当前 snapshot 是否可用于 definition。 |
| `mark_stale(ReferenceReason reason)` | 将过期状态显式化。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(MappingRef source_ref, SourceRevision source_revision, SafeReferenceConclusion safe_conclusion, Timestamp captured_at)` | 从正式 ref 形成 body-free snapshot。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 RoleDefinition 或 mapping body | 违反唯一 owner。 |
| stale 时 fallback 到 guessed mapping | 只能 blocked / unavailable。 |

### 3.6 `ComponentPinSet`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | immutable value object |
| 主要责任 | 汇总必要 component / extras / base release refs 与 compatibility context。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `runtime_ref` | `ComponentReleaseRef` | 固定 runtime release。 |
| `tools_ref` | `ComponentReleaseRef` | 固定 tools / extras release。 |
| `member_ref` | `ComponentReleaseRef` | 固定 member release，MI-UP-002 未闭口时可缺失并 blocked。 |
| `extras_refs` | `ComponentReleaseRefSet` | 固定角色 extras 组件集合。 |
| `pin_completeness` | `PinCompleteness` | 判断必要项是否完整。 |
| `compatibility_context` | `CompatibilityContextRef` | 回指正式 compatibility 结论，不自造报告。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_complete(RequiredComponentSet required_components)` | 判断当前 scope 下必要 pin 是否齐全。 |
| `contains_mutable_selector()` | 拒绝 latest / mutable selector。 |
| `diff(ComponentPinSet other_pin_set)` | 形成可追溯的 pin 差异摘要。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assemble(ComponentReleaseRef runtime_ref, ComponentReleaseRef tools_ref, ComponentReleaseRef member_ref, ComponentReleaseRefSet extras_refs, CompatibilityContextRef compatibility_context)` | 从 pinned refs 建立集合。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 source path / package version 代替正式 release ref | 不能证明可复现或 owner。 |
| 保存 component contract / binary body | 只保留 ref 和 safe compatibility context。 |

### 3.7 `SeedPlacementBinding`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | reference / placement value object |
| 主要责任 | 绑定 policy / memory / workspace seed template ref 与静态 placement。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `template_ref` | `SeedTemplateRef` | 回指正式 template owner。 |
| `seed_kind` | `SeedKind` | 区分 policy / memory / workspace 等静态类别。 |
| `placement` | `StaticPlacement` | 描述进入镜像的静态位置语义。 |
| `source_validity` | `ReferenceValidity` | 防止缺失 / stale template 形成 positive baseline。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_static_safe()` | 判断 placement 不携带 live / secret body。 |
| `matches(SeedTemplateRef template_ref, StaticPlacement placement)` | 判定重复 binding。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `bind(SeedTemplateRef template_ref, SeedKind seed_kind, StaticPlacement placement)` | 形成 owner-neutral 的静态 binding。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 policy / memory / workspace semantic body | 只保存 ref 和 placement。 |
| 将 live memory、checkpoint 或 credential 当 seed | static / live 红线不可配置化。 |

### 3.8 `AssemblyCompletenessGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | policy / guard |
| 主要责任 | 检查必要输入、source validity、seed static-safe 与 static / live 边界，并返回保守结论。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `required_input_policy` | `RequiredInputPolicyRef` | 当前适用必要输入集合来源。 |
| `static_live_boundary` | `StaticLiveBoundary` | 保护正文与 live state 分离。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check_baseline(AssemblyBaseline baseline)` | 返回 complete / incomplete / conflict 结论。 |
| `check_seed(SeedPlacementBindingSet seed_bindings)` | 检查 placement 与 static-safe。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_policy(RequiredInputPolicyRef required_input_policy, StaticLiveBoundary static_live_boundary)` | 构造完整性 guard，不加载外部正文。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 通过默认值放宽完整性 | missing 必须阻断。 |
| 将 policy guard 变成 governance approval truth | 只执行本仓结构不变量。 |

### 3.9 `PinIntegrityGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `DefinitionAssembly` |
| 对象类型 | policy / guard |
| 主要责任 | 检查必要 component / extras / base ref 是否完整、immutable 且未使用 mutable selector。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `required_input_policy` | `RequiredInputPolicyRef` | 识别当前语境的必要 pin 集合。 |
| `allowed_selector_policy` | `SelectorPolicyRef` | 禁止 `latest`、guessed version 和 mutable selector。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check_pins(ComponentPinSet pins)` | 返回 complete / incomplete / conflict，并拒绝 mutable selector。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_policy(RequiredInputPolicyRef required_input_policy, SelectorPolicyRef allowed_selector_policy)` | 从必要输入与 selector policy 构造 pin guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 mutable selector 转换为 immutable identity | 缺失正式 pin 时只能 blocked。 |
| 以 source path 或猜测版本补齐 release ref | 正式 release ref 不可由本仓制造。 |

## 4. BuildCandidate 对象

### 4.1 `BuildIntent`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `BuildCandidate` |
| 对象类型 | domain aggregate |
| 主要责任 | 记录一次来源明确的构建意图，不等于已提交外部任务。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `intent_id` | `BuildIntentId` | 构建意图身份。 |
| `revision_ref` | `VariantRevisionRef` | 绑定可构建 revision。 |
| `trigger_kind` | `BuildTriggerKind` | 区分 nightly、approved change、conditional event。 |
| `trigger_ref` | `BuildTriggerRef` | 回指来源，不保存 event body。 |
| `intent_status` | `BuildIntentStatus` | 区分 accepted / pending / blocked / cancelled。 |
| `correlation_id` | `CorrelationId` | 关联 attempt / candidate / trace。 |
| `created_at` | `Timestamp` | 意图成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `accepted` | 来源与 revision 前置通过，可创建 attempt。 |
| `pending` | 等待 verified source / external contract。 |
| `blocked` | 当前 lane 因缺口不能形成正向工作。 |
| `cancelled` | 在外部副作用前被明确取消，历史保留。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `accept(BuildTriggerContext trigger_context)` | 形成可追踪 accepted intent。 |
| `block(ContractGap gap)` | 记录 pending seam 对 intent 的阻断。 |
| `cancel(CancellationReason reason)` | 终结未执行意图。 |
| `can_start_attempt()` | 判断是否满足本地前置，不调用 builder。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `request(VariantRevisionRef revision_ref, BuildTriggerKind trigger_kind, BuildTriggerRef trigger_ref, CorrelationId correlation_id)` | 建立构建意图候选。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 event arrival 当 accepted | 必须验证 authority 和 revision。 |
| 把 intent 当 candidate / digest | 阶段事实分离。 |

### 4.2 `BuildAttempt`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `BuildCandidate` |
| 对象类型 | domain entity / history record |
| 主要责任 | 记录一次基于 immutable input snapshot 的外部构建尝试及其本地观察结论。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `BuildAttemptId` | 尝试身份。 |
| `intent_ref` | `BuildIntentRef` | 回指 intent。 |
| `input_snapshot_ref` | `BuildInputSnapshotRef` | 锁定输入语境。 |
| `handoff_ref` | `BuildHandoffRef` | 回指外部交接关系。 |
| `attempt_status` | `BuildAttemptStatus` | 区分 created / handoff_pending / outcome_pending / succeeded / failed / unknown。 |
| `outcome_ref` | `OptionalBuildOutcomeRef` | 只指向 safe outcome conclusion。 |
| `supersedes_ref` | `OptionalBuildAttemptRef` | 恢复新 attempt 的替代链。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `created` | 本地 attempt 已建立，尚未交接。 |
| `handoff_pending` | 等待外部 adapter 接受或确认交接。 |
| `outcome_pending` | 外部副作用已发生但 outcome 未确定。 |
| `succeeded` | 获得可验证 outcome，仍需 candidate formation guard。 |
| `failed` | 获得明确失败结论。 |
| `unknown` | side effect / commit / external result 不可判定，禁止普通 retry / success。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `submit(BuildHandoffContext handoff_context)` | 记录受控交接，不宣称外部成功。 |
| `record_outcome(BuildOutcomeConclusion outcome)` | 绑定 safe outcome。 |
| `mark_unknown(UnknownEffectReason reason)` | 保护未知副作用语义。 |
| `supersede(BuildAttemptRef replacement_ref, RecoveryReason reason)` | 以新 attempt 恢复，不覆盖旧尝试。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `start(BuildIntentRef intent_ref, BuildInputSnapshotRef input_snapshot_ref, BuildHandoffRef handoff_ref)` | 建立初始 attempt。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 builder success 直接设置 candidate | 必须先形成可验证 outcome。 |
| unknown 状态普通重试 | 需等待 resolution 或新语境策略。 |

### 4.3 `BuildInputSnapshot`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `BuildCandidate` |
| 对象类型 | immutable snapshot |
| 主要责任 | 固定一次 attempt 的完整输入、source identity 与 pin 语境。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `BuildInputSnapshotId` | snapshot 身份。 |
| `revision_ref` | `VariantRevisionRef` | 回指 variant revision。 |
| `baseline_ref` | `AssemblyBaselineRef` | 回指完整装配输入。 |
| `source_refs` | `BuildSourceRefSet` | 记录各输入 source ref / release ref。 |
| `input_digest` | `InputSetDigest` | 绑定输入集合 identity。 |
| `snapshot_status` | `SnapshotStatus` | 区分 complete / incomplete / invalid。 |
| `captured_at` | `Timestamp` | 固定判断时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `complete` | 当前 attempt 所需输入与 source identity 齐全且 immutable。 |
| `incomplete` | 缺少必要静态输入；不得交接外部构建。 |
| `invalid` | snapshot 与 revision、baseline 或 source identity 冲突；必须形成新 snapshot 语境。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_immutable()` | 判断 snapshot 是否可作为 attempt 输入。 |
| `verify_complete(RequiredInputSet required_inputs)` | 检查必要 source 是否齐全。 |
| `matches(VariantRevisionRef revision_ref)` | 防止 snapshot 与 revision 漂移。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(VariantRevisionRef revision_ref, AssemblyBaselineRef baseline_ref, BuildSourceRefSet source_refs, InputSetDigest input_digest, Timestamp captured_at)` | 固化构建输入语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 live state / secret / observed body | 只允许静态、受控输入。 |
| 在 snapshot 后补 mutable input | 缺失必须新建 snapshot / intent。 |

### 4.4 `BuildOutcomeConclusion`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `BuildCandidate` |
| 对象类型 | safe external outcome record |
| 主要责任 | 把外部构建 / registry 结果压缩为本仓可判定的保守结论。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `outcome_id` | `BuildOutcomeId` | 结论身份。 |
| `attempt_ref` | `BuildAttemptRef` | 回指 attempt。 |
| `external_ref` | `ExternalExecutionRef` | 外部执行身份，不保存 job body。 |
| `result_kind` | `BuildResultKind` | success / failed / unknown / unavailable。 |
| `output_ref` | `OptionalImmutableOutputRef` | 可验证输出引用，不能由猜测生成。 |
| `reported_at` | `Timestamp` | 结论时点。 |
| `safe_reason` | `SafeReason` | 结构化原因 / gap。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_candidate_eligible_input()` | 只判断是否可供 candidate guard 继续判断。 |
| `is_unknown()` | 区分未知副作用，阻止正向推导。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `conclude(BuildAttemptRef attempt_ref, ExternalExecutionRef external_ref, BuildResultKind result_kind, OptionalImmutableOutputRef output_ref, SafeReason safe_reason, Timestamp reported_at)` | 从 adapter safe result 形成结论。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw log / report / callback body | 只保存 safe result / ref。 |
| result_kind=success 时自动生成 digest / candidate | 需要独立 provenance 与 candidate guard。 |

### 4.5 `CandidateImage`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `BuildCandidate` |
| 对象类型 | domain entity |
| 主要责任 | 表达已通过 candidate formation 的不可变输出身份，供 Qualification 继续判断。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `candidate_id` | `CandidateImageId` | candidate 身份。 |
| `attempt_ref` | `BuildAttemptRef` | 回指构建尝试。 |
| `revision_ref` | `VariantRevisionRef` | 回指来源 revision。 |
| `output_ref` | `ImmutableOutputRef` | 输出引用 / digest carrier。 |
| `formation_basis` | `CandidateFormationBasis` | 记录通过何种 safe outcome 形成。 |
| `candidate_status` | `CandidateStatus` | formed / rejected / blocked / unknown。 |
| `formed_at` | `Timestamp` | candidate 成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `formed` | candidate 关系已由本仓规则成立。 |
| `rejected` | 输出或 outcome 不满足 candidate guard。 |
| `blocked` | 依赖或 contract gap 阻止判定。 |
| `unknown` | 外部副作用无法判定，不能推导 eligibility。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `qualify(ProvenanceBinding provenance_binding)` | 将 candidate 交给资格阶段，不直接设置 eligible。 |
| `reject(CandidateReason reason)` | 形成拒绝结论。 |
| `is_immutable()` | 判断 candidate output identity 是否不可变。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `form(BuildAttemptRef attempt_ref, VariantRevisionRef revision_ref, ImmutableOutputRef output_ref, CandidateFormationBasis formation_basis)` | 由 candidate guard 形成 candidate。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 candidate 当 eligible / available | 后续阶段必须独立成立。 |
| 用 registry tag / mutable selector 作为 output identity | 生产入口必须 immutable pinned。 |

### 4.6 `CandidateFormationGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `BuildCandidate` |
| 对象类型 | policy / guard |
| 主要责任 | 检查 attempt、snapshot、safe outcome、immutable output ref 的一致性。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `required_outcome_kinds` | `AllowedBuildResultSet` | 规定可进入 candidate 判断的结论类别。 |
| `output_identity_policy` | `ImmutableOutputPolicy` | 要求输出可验证且不可变。 |
| `correlation_policy` | `CorrelationPolicy` | 防止 outcome 归属错配。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check(BuildAttempt attempt, BuildInputSnapshot snapshot, BuildOutcomeConclusion outcome)` | 返回 formed / rejected / blocked / unknown 结论。 |
| `check_identity(ImmutableOutputRef output_ref, InputSetDigest input_digest)` | 检查输出与输入语境关系。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_policy(AllowedBuildResultSet required_outcome_kinds, ImmutableOutputPolicy output_identity_policy, CorrelationPolicy correlation_policy)` | 构造本地 candidate guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 接受 external ACK 作为唯一成功条件 | 必须有可验证 output / correlation。 |

## 5. Qualification 对象

### 5.1 `ProvenanceBinding`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Qualification` |
| 对象类型 | immutable domain value / relation |
| 主要责任 | 将 candidate、完整 input snapshot、execution outcome 和 output digest 绑定成可追溯来源链。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `binding_id` | `ProvenanceBindingId` | provenance relation 身份。 |
| `candidate_ref` | `CandidateImageRef` | 回指 candidate。 |
| `input_snapshot_ref` | `BuildInputSnapshotRef` | 回指完整输入。 |
| `execution_ref` | `ExternalExecutionRef` | 外部执行 identity。 |
| `output_digest` | `OutputDigest` | candidate output 的不可变 identity。 |
| `source_chain` | `ProvenanceSourceChain` | 记录可回链的来源类别。 |
| `completeness` | `ProvenanceCompleteness` | complete / incomplete / conflict。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `complete` | 所需来源链可验证。 |
| `incomplete` | 缺少必要来源，不能进入 eligibility。 |
| `conflict` | digest / input / execution 关系冲突。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `verify()` | 检查来源链完整性与一致性。 |
| `bind_gate(GateEvaluation gate_evaluation)` | 关联资格判断，但不改变外部 gate truth。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `bind(CandidateImageRef candidate_ref, BuildInputSnapshotRef input_snapshot_ref, ExternalExecutionRef execution_ref, OutputDigest output_digest, ProvenanceSourceChain source_chain)` | 固化 provenance 关系。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 无来源地生成 digest | digest 必须绑定完整 input / execution / output。 |
| 保存 evidence / Artifact 正文 | 只持 ref / safe conclusion。 |

### 5.2 `GateEvaluation`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Qualification` |
| 对象类型 | domain evaluation record |
| 主要责任 | 记录当前 authority 下 applicable gate 的本地评估结果和缺口。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `evaluation_id` | `GateEvaluationId` | 评估身份。 |
| `candidate_ref` | `CandidateImageRef` | 评估对象。 |
| `applicable_gate_set` | `ApplicableGateSetRef` | 回指正式 authority 的适用门禁集合。 |
| `conclusions` | `GateConclusionSet` | 保存 safe conclusion / ref，不保存证据正文。 |
| `evaluation_status` | `GateEvaluationStatus` | pending / passed / failed / blocked / unknown。 |
| `evaluated_at` | `Timestamp` | 评估时点。 |
| `supersedes_ref` | `OptionalGateEvaluationRef` | 新评估替代链。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | applicable gate 尚未完整收集。 |
| `passed` | 当前 applicable gate 均获得可验证 positive conclusion；不等于 availability。 |
| `failed` | 至少一项 gate 明确失败。 |
| `blocked` | gate authority / evidence 不可判定。 |
| `unknown` | 外部结果无法确认，禁止默认通过。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_conclusion(EvidenceConclusionRef conclusion_ref)` | 记录 safe conclusion。 |
| `close(GateClosureContext closure_context)` | 在 applicable set 完整且可验证时关闭评估。 |
| `supersede(GateEvaluationRef replacement_ref, EvaluationReason reason)` | 新语境重评估，不覆盖旧结果。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(CandidateImageRef candidate_ref, ApplicableGateSetRef applicable_gate_set)` | 建立待评估语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 枚举未获 authority 的 gate kind / priority | Q-MI-004 未闭口时保持 authority-driven。 |
| missing / unknown 自动通过 | 必须 fail closed。 |

### 5.3 `EligibilityDecision`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Qualification` |
| 对象类型 | domain decision truth |
| 主要责任 | 根据 candidate、provenance 与 gate evaluation 形成镜像域 eligibility。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_id` | `EligibilityDecisionId` | eligibility 判断身份。 |
| `candidate_ref` | `CandidateImageRef` | 绑定 candidate。 |
| `provenance_ref` | `ProvenanceBindingRef` | 绑定来源链。 |
| `gate_evaluation_ref` | `GateEvaluationRef` | 绑定适用 gate 判断。 |
| `eligibility_status` | `EligibilityStatus` | pending / eligible / ineligible / blocked。 |
| `decision_reason` | `EligibilityReason` | 结构化判断依据。 |
| `decided_at` | `Timestamp` | 成立时点。 |
| `supersedes_ref` | `OptionalEligibilityDecisionRef` | 重评估替代链。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | 仍等待 provenance / gate 结论。 |
| `eligible` | 镜像域资格成立，可供 SupplyEntry 判断。 |
| `ineligible` | 明确不满足当前资格。 |
| `blocked` | 缺 authority / contract / safe conclusion，不能作正向判断。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate(ProvenanceBinding provenance_binding, GateEvaluation gate_evaluation)` | 形成本地 eligibility decision。 |
| `supersede(EligibilityDecisionRef replacement_ref, EvaluationReason reason)` | 以新 evaluation 恢复。 |
| `permits_supply()` | 只判断是否可交给 availability，不创建 entry。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `decide(CandidateImageRef candidate_ref, ProvenanceBindingRef provenance_ref, GateEvaluationRef gate_evaluation_ref, EligibilityReason decision_reason)` | 建立待判定或已判定语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 代表 Artifact formalization / consumer confirmation | 这些是独立 boundary。 |
| 通过配置绕过 applicable gate | domain invariant 与 authority 不可配置化。 |

### 5.4 `ArtifactHandoffRecord`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Qualification` |
| 对象类型 | conditional handoff record |
| 主要责任 | 记录 eligible candidate 与 Artifact owner 之间的交接尝试、ref / gap 和合同状态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_id` | `ArtifactHandoffId` | 交接语境身份。 |
| `candidate_ref` | `CandidateImageRef` | 回指 image candidate。 |
| `eligibility_ref` | `EligibilityDecisionRef` | 证明本地 eligibility 语境。 |
| `artifact_ref` | `OptionalArtifactConsumableRef` | 仅在正式 ref 可验证时存在。 |
| `handoff_status` | `ArtifactHandoffStatus` | pending / gap / accepted（后者需 contract 闭口）。 |
| `gap_ref` | `OptionalContractGapRef` | 记录 MI-UP-007 缺口。 |
| `recorded_at` | `Timestamp` | 记录时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | 交接尚未得出 safe conclusion。 |
| `gap` | 合同或 owner 输入不可验证。 |
| `accepted` | 仅在正式 handoff contract 闭口后表示 owner-side 接受；当前保持 conditional。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_gap(ContractGap gap)` | 记录不完整交接，不伪造 Artifact ref。 |
| `bind_ref(ArtifactConsumableRef artifact_ref)` | 在正式 contract 允许时绑定 ref。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(CandidateImageRef candidate_ref, EligibilityDecisionRef eligibility_ref)` | 开启交接语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 定义 ArtifactVersion / lineage / baseline | owner 在 L1-artifact。 |
| 将 image eligibility 直接改写为 Artifact accepted | 两者分域。 |

### 5.5 `ProvenanceCompletenessGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Qualification` |
| 对象类型 | policy / guard |
| 主要责任 | 检查 provenance 是否完整、可回链、无冲突，并验证 digest 与 input / execution / output 的绑定。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `required_source_kinds` | `ProvenanceSourceKindSet` | 规定来源链的结构类别。 |
| `digest_policy` | `DigestBindingPolicy` | 约束 output 与 input / execution 绑定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check(ProvenanceBinding provenance_binding)` | 返回 complete / incomplete / conflict。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_policy(ProvenanceSourceKindSet required_source_kinds, DigestBindingPolicy digest_policy)` | 构造来源链完整性 guard，不加载 evidence body。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 无来源地接受 digest | digest 必须绑定完整 input / execution / output。 |
| 把 adapter availability 当 provenance 完整 | 外部可用性与来源链完整性分开。 |

### 5.6 `ApplicableGateGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Qualification` |
| 对象类型 | policy / guard |
| 主要责任 | 按正式 authority 的 applicable set 判断 gate 缺失、失败、冲突或 unknown。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `authority_ref` | `GateAuthorityRef` | 回指 gate owner，不复制 policy body。 |
| `unknown_policy` | `UnknownGatePolicy` | 明确 unknown -> blocked / pending。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate(GateEvaluation gate_evaluation)` | 返回 passed / failed / blocked / unknown。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_authority(GateAuthorityRef authority_ref, UnknownGatePolicy unknown_policy)` | 构造 authority-driven gate guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 自行枚举外部 evidence policy | Q-MI-004 未闭口。 |
| 将 missing / unknown 或 adapter availability 当 gate pass | 外部可用性与领域资格分开。 |

## 6. SupplyEntry 对象

### 6.1 `AvailabilityTransition`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `SupplyEntry` |
| 对象类型 | domain history record |
| 主要责任 | 记录 publish / replace / rollback / retire 的本地 availability 变化语境。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `transition_id` | `AvailabilityTransitionId` | transition 身份。 |
| `variant_ref` | `ImageVariantRef` | 作用 variant。 |
| `candidate_ref` | `OptionalCandidateImageRef` | 关联 eligible candidate。 |
| `entry_ref` | `OptionalInstantiableEntryRef` | 关联入口。 |
| `transition_kind` | `AvailabilityTransitionKind` | publish / replace / rollback / retire。 |
| `transition_status` | `AvailabilityTransitionStatus` | proposed / committed / rejected / superseded。 |
| `reason` | `TransitionReason` | 结构化原因。 |
| `supersedes_ref` | `OptionalAvailabilityTransitionRef` | 历史替代链。 |
| `committed_at` | `OptionalTimestamp` | 本地成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `proposed` | transition 候选已形成。 |
| `committed` | 本地 availability 变化成立，不代表 consumer / container 完成。 |
| `rejected` | 不满足 eligibility / pin / transition guard。 |
| `superseded` | 新 transition 替代当前语境，旧历史保留。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `commit(AvailabilityTransitionContext context)` | 在 guard 通过后提交 transition。 |
| `reject(TransitionReason reason)` | 记录拒绝。 |
| `supersede(AvailabilityTransitionRef replacement_ref)` | 追加替代关系。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `propose(ImageVariantRef variant_ref, AvailabilityTransitionKind transition_kind, OptionalCandidateImageRef candidate_ref, TransitionReason reason)` | 建立 transition 候选。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 原地覆盖 availability history | 恢复 / rollback 必须追加 transition。 |
| 以 registry presence / container health 直接提交 | 需本地 eligibility、pin 与 owner 边界。 |

### 6.2 `InstantiableEntry`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `SupplyEntry` |
| 对象类型 | domain supply record |
| 主要责任 | 提供下游可消费的 immutable pinned image entry 语义。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `entry_id` | `InstantiableEntryId` | 入口身份。 |
| `variant_ref` | `ImageVariantRef` | 入口所属 variant。 |
| `candidate_ref` | `CandidateImageRef` | 回指 candidate。 |
| `eligibility_ref` | `EligibilityDecisionRef` | 回指本地资格。 |
| `image_ref` | `ImmutableImageRef` | 生产可消费的不可变 image ref。 |
| `entry_status` | `InstantiableEntryStatus` | unavailable / available / superseded / retired。 |
| `provenance_ref` | `ProvenanceBindingRef` | 追溯来源链。 |
| `published_at` | `OptionalTimestamp` | 本地供给成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `unavailable` | 当前不能提供可验证 entry。 |
| `available` | 本仓 availability 与 immutable entry 成立；不代表 launch。 |
| `superseded` | 被新 entry 替代。 |
| `retired` | 明确退出供给，但历史可追溯。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `publish(EligibilityDecision eligibility_decision, ImmutableImageRef image_ref)` | 在 eligibility / pin guard 通过后形成 available entry。 |
| `supersede(InstantiableEntryRef replacement_ref)` | 替代当前入口。 |
| `retire(RetireReason reason)` | 追加 retire 事实。 |
| `is_pinned()` | 判断生产入口是否 immutable。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create(ImageVariantRef variant_ref, CandidateImageRef candidate_ref, EligibilityDecisionRef eligibility_ref, ImmutableImageRef image_ref, ProvenanceBindingRef provenance_ref)` | 从已成立资格创建入口候选。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 使用 `latest` / mutable selector | 生产入口必须 pinned。 |
| 表示容器 / consumer / product readiness | 这些属于边界外 owner。 |

### 6.3 `ConsumerHandoffGap`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `SupplyEntry` |
| 对象类型 | boundary gap record |
| 主要责任 | 表达向 Member Service 提供 pinned entry 时 exact contract、ref verification 或确认状态的缺口。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_id` | `ConsumerHandoffGapId` | gap 身份。 |
| `entry_ref` | `OptionalInstantiableEntryRef` | 关联可用入口（若已有）。 |
| `consumer_contract_ref` | `ConsumerContractRef` | 回指双方合同语境。 |
| `gap_kind` | `ConsumerGapKind` | schema / ref / qualification / confirmation 等类别。 |
| `gap_status` | `ConsumerGapStatus` | open / resolved / stale。 |
| `observed_at` | `Timestamp` | gap 记录时点，不是 observed runtime truth。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `open` | 当前 consumer 侧无法验证或使用入口。 |
| `resolved` | 合同闭口且 gap 可安全关闭；当前 MI-UP-001 未闭口时不可宣称。 |
| `stale` | 原 gap 语境过期，需新 handoff 判断。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `resolve(ConsumerConfirmationRef confirmation_ref)` | 在正式合同允许时关联确认。 |
| `mark_stale(GapReason reason)` | 使旧 gap 不再用于新判断。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(ConsumerContractRef consumer_contract_ref, ConsumerGapKind gap_kind, GapReason reason)` | 建立 consumer handoff gap。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 gap 解释为 container health / launch failure 事实 | 本仓只知道合同 / ref 语境。 |
| 在 exact contract pending 时生成 resolved | 必须保持 open / unavailable。 |

### 6.4 `EntryPinGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `SupplyEntry` |
| 对象类型 | policy / guard |
| 主要责任 | 保证 entry 使用 immutable image ref、eligible candidate 和可回链 provenance。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `image_identity_policy` | `ImmutableImagePolicy` | 禁止 mutable selector。 |
| `required_eligibility` | `EligibilityRequirement` | availability 必须有本地资格。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check_entry(InstantiableEntry entry)` | 判断 entry 是否可供给。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_policy(ImmutableImagePolicy image_identity_policy, EligibilityRequirement required_eligibility)` | 构造 immutable entry guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 接受 `latest`、mutable selector 或缺 provenance 的 entry | 必须返回 rejected / blocked。 |
| 读取 consumer / container state 作为本地 availability 判据 | owner 边界不允许反写。 |

### 6.5 `AvailabilityTransitionGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `SupplyEntry` |
| 对象类型 | policy / guard |
| 主要责任 | 保证 publish / replace / rollback / retire 迁移合法且 history 不覆盖。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `allowed_transitions` | `AvailabilityTransitionRuleSet` | 约束阶段迁移方向。 |
| `history_policy` | `HistoryAppendPolicy` | 禁止原地覆盖。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check_transition(AvailabilityTransition transition, CurrentAvailabilityFacts current_facts)` | 判断 transition 是否可提交。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_rules(AvailabilityTransitionRuleSet allowed_transitions, HistoryAppendPolicy history_policy)` | 构造 availability transition guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 原地覆盖 availability history | 恢复、rollback 与 retire 必须追加新 transition。 |
| 以 consumer / container state 直接提交本地 transition | 下游状态不属于本仓 availability truth。 |

## 7. ReferenceDerived 对象

### 7.1 `ExternalReferenceSnapshot`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | external shadow snapshot |
| 主要责任 | 固定一个外部 ref / safe conclusion 的 identity、validity、freshness 与 source owner。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `ExternalReferenceSnapshotId` | snapshot 身份。 |
| `source_owner` | `SourceOwnerId` | 标识外部 truth owner。 |
| `reference_kind` | `ReferenceKind` | mapping / component / seed / builder / evidence / Artifact / consumer 等类别。 |
| `reference_identity` | `ExternalReferenceIdentity` | 仅保存 ref identity，不保存正文。 |
| `validity` | `ReferenceValidity` | valid / stale / conflict / unavailable。 |
| `safe_conclusion` | `SafeReferenceConclusion` | 可向核心承接的安全结论。 |
| `captured_at` | `Timestamp` | snapshot 时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `valid` | 可作为当前受控输入。 |
| `stale` | 仅可解释历史，不能形成新 positive decision。 |
| `conflict` | 来源或身份冲突，必须 blocked。 |
| `unavailable` | 无法读取或验证，受影响 lane 保守失败。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_usable()` | 判断是否可供指定本地判断消费。 |
| `invalidate(ReferenceReason reason)` | 将旧 shadow 标记为不可用。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(SourceOwnerId source_owner, ReferenceKind reference_kind, ExternalReferenceIdentity reference_identity, SafeReferenceConclusion safe_conclusion, Timestamp captured_at)` | 形成 body-free shadow。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 snapshot 当 source truth | source owner 仍唯一。 |
| stale 时默认沿用为新 positive 输入 | 只能 pending / blocked。 |

### 7.2 `ContractGap`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | boundary gap record |
| 主要责任 | 统一表达 exact contract、ref、schema、source validity、handoff 或 confirmation 缺口。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_id` | `ContractGapId` | gap 身份。 |
| `seam_kind` | `DependencySeamKind` | compile / runtime / event / ref / adapter / fake 语境。 |
| `owner_ref` | `SourceOwnerId` | 缺口对应 owner。 |
| `gap_kind` | `GapKind` | missing / stale / conflict / unavailable / schema-pending 等。 |
| `affected_lane` | `DecisionLane` | 只冻结受影响的新判断。 |
| `status` | `ContractGapStatus` | open / blocked / resolved / expired。 |
| `recorded_at` | `Timestamp` | gap 成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `open` | 缺口已识别，等待 owner / contract 输入。 |
| `blocked` | 受影响 positive lane 明确不可推进。 |
| `resolved` | 只有正式 authority 关闭后才能使用；当前 pending 项不得假设。 |
| `expired` | 旧 gap 语境过期，需新判断。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `affects(DecisionLane lane)` | 判断 gap 是否影响某条新决策 lane。 |
| `resolve(ContractResolutionRef resolution_ref)` | 关联正式关闭依据。 |
| `expire(GapExpiryReason reason)` | 让旧 gap 不再污染新语境。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(DependencySeamKind seam_kind, SourceOwnerId owner_ref, GapKind gap_kind, DecisionLane affected_lane)` | 建立明确 gap。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 gap 生成 positive readiness | gap 只能是 pending / blocked / unavailable 语义。 |
| 静默删除 gap | 关闭必须有新 authority / resolution ref。 |

### 7.3 `ProjectionFreshness`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | projection state value object |
| 主要责任 | 表达派生视图是否可读、是否滞后或重建中。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_name` | `ProjectionName` | 视图身份。 |
| `source_watermark` | `TruthWatermark` | 已消费正式 truth 的边界。 |
| `freshness_status` | `ProjectionFreshnessStatus` | fresh / stale / rebuilding / unavailable。 |
| `last_rebuilt_at` | `OptionalTimestamp` | 最近重建时点。 |
| `gap_ref` | `OptionalContractGapRef` | 解释无法更新的缺口。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 可从当前 truth 读取。 |
| `stale` | 可读但明确滞后。 |
| `rebuilding` | 正在从 truth 重建，读取需表达边界。 |
| `unavailable` | 当前不可读，不反写 truth。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_stale(TruthWatermark source_watermark)` | 标记派生滞后。 |
| `begin_rebuild(ProjectionRebuildContext rebuild_context)` | 开启重建语境。 |
| `mark_fresh(TruthWatermark source_watermark, Timestamp rebuilt_at)` | 在重建完成后更新 freshness。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `start(ProjectionName projection_name, TruthWatermark source_watermark)` | 建立初始 freshness。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 projection freshness 改写核心状态 | projection 只有读权限。 |

### 7.4 `ImageTraceRecord`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | immutable audit / history record |
| 主要责任 | 连接 definition、revision、intent、attempt、candidate、provenance、eligibility、availability 和 handoff / gap 的来源链。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_id` | `ImageTraceId` | trace 身份。 |
| `subject_ref` | `TraceSubjectRef` | 关联某个本仓阶段事实。 |
| `source_refs` | `TraceSourceRefSet` | 回链输入 / owner ref。 |
| `causation_ref` | `OptionalCausationRef` | 表达由哪个事实触发。 |
| `correlation_id` | `CorrelationId` | 串起同一判断语境。 |
| `recorded_at` | `Timestamp` | 追踪时点。 |
| `safe_reason` | `SafeReason` | 结构化解释。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `append(TraceSubjectRef subject_ref, TraceSourceRefSet source_refs, OptionalCausationRef causation_ref, CorrelationId correlation_id, SafeReason safe_reason)` | 追加一条不可变 trace。 |
| `links(TraceSubjectRef subject_ref)` | 查询是否形成来源链。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(TraceSubjectRef subject_ref, TraceSourceRefSet source_refs, CorrelationId correlation_id, SafeReason safe_reason, Timestamp recorded_at)` | 建立 trace record。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw log / report / external body | 只记录 safe refs / reason。 |
| 作为第二 truth 写入阶段状态 | trace 是审计 / 解释，不是决策 owner。 |

### 7.5 `ImageDerivedReadModel`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | projection / read model |
| 主要责任 | 为 catalog、manifest、trace、provenance 与 gap 查询提供可重建的只读聚合视图。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `ImageReadModelId` | 视图身份。 |
| `variant_ref` | `OptionalImageVariantRef` | 可选 variant 过滤。 |
| `definition_summary` | `SafeDefinitionSummary` | definition 的安全摘要。 |
| `stage_summaries` | `StageDecisionSummarySet` | 各阶段状态摘要，不压成 ready。 |
| `entry_summary` | `OptionalEntrySummary` | pinned entry 或 gap 摘要。 |
| `trace_summary` | `TraceSummary` | 可追溯来源摘要。 |
| `freshness` | `ProjectionFreshness` | 明确 stale / rebuilding / unavailable。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `rebuild(TruthSnapshot truth_snapshot, ProjectionFreshness freshness)` | 从正式 truth 重建视图。 |
| `read(ProjectionQuery query, ActorContext actor)` | 提供只读查询结果。 |
| `mark_unavailable(ContractGap gap)` | 让读侧显式表达不可用。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_truth(TruthSnapshot truth_snapshot, ProjectionFreshness freshness)` | 从正式 truth 建立派生读模型。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 反写 definition / candidate / eligibility / availability | projection 没有 domain mutation 权限。 |
| 用单一 `ready` 字段掩盖阶段 gap | 每阶段 summary 必须可区分。 |

### 7.6 `ReferenceValidityGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | policy / guard |
| 主要责任 | 判定 ref / snapshot / safe conclusion 是否可进入指定本地判断。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `allowed_reference_kinds` | `ReferenceKindSet` | 限定当前 seam 可消费类别。 |
| `freshness_policy` | `ReferenceFreshnessPolicy` | 约束 stale / conflict 处理。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `check(ExternalReferenceSnapshot snapshot, ReferenceUseContext use_context)` | 返回 usable / stale / blocked。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_boundary(ReferenceKindSet allowed_reference_kinds, ReferenceFreshnessPolicy freshness_policy)` | 构造边界 guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 fake / cache 当生产 source | fake 仅测试切口，cache 仅派生。 |
| stale / conflict / unavailable 时 fallback 到 guessed ref | 必须形成 blocked / gap。 |

### 7.7 `ProjectionReadOnlyGuard`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `ReferenceDerived` |
| 对象类型 | policy / guard |
| 主要责任 | 保证 projection / maintenance 只能从正式 truth 读取与重建。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_truth_policy` | `TruthSourcePolicy` | 规定只能从正式 truth 构建。 |
| `writeback_policy` | `ProjectionWritebackPolicy` | 明确禁止反写。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allow_rebuild(ProjectionRebuildContext rebuild_context)` | 判断重建是否从正式 truth 开始。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_policy(TruthSourcePolicy source_truth_policy, ProjectionWritebackPolicy writeback_policy)` | 构造只读投影 guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 projection、cache 或 fake 作为核心写入来源 | 它们只能承担读侧或测试切口。 |
| 以 rebuild 结果反写 definition / candidate / eligibility / availability | projection 没有 domain mutation 权限。 |

## 8. 对象分布与反查

| 主要组成部分 | 正式对象 | Step 7 / 8 使用 | Step 9 使用 |
|---|---|---|---|
| `DefinitionAssembly` | family、variant、baseline、revision、mapping snapshot、pin set、seed binding、assembly / pin guard | definition revision / baseline command、build intent flow | definition / revision 状态 |
| `BuildCandidate` | intent、attempt、input snapshot、outcome、candidate、candidate guard | build trigger / outcome consumer / nightly flow | intent / attempt / candidate 状态 |
| `Qualification` | provenance、gate evaluation、eligibility、Artifact handoff、qualification guards | qualify / handoff flow | gate / eligibility / handoff 状态 |
| `SupplyEntry` | availability transition、entry、consumer gap、supply guards | publish / rollback / resolve flow | availability / entry / gap 状态 |
| `ReferenceDerived` | external snapshot、contract gap、freshness、trace、read model、reference / projection guards | ref refresh / projection / reconciliation / query | projection / gap / ref validity 状态 |

## 9. 省略与降级说明

`MappingRef`、`ComponentReleaseRef`、`SeedTemplateRef`、`RegistryImageRef`、`EvidenceConclusionRef`、`ArtifactConsumableRef`、`ConsumerContractRef` 等仅作为字段类型，因为其正文、schema 和生命周期属于外部 owner；`Repository`、`Port`、`Adapter`、`DTO`、`EventEnvelope`、`JobContext` 留给 Step 7 / 03，因为它们是接缝或接口承载。各类具体 catalog / manifest / provenance / gap view 统一由 `ImageDerivedReadModel` 加 `ProjectionFreshness` 表达，避免建立多个同义第二 truth。

## 10. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Step 5 候选是否逐项处理 | `pass` | 正式对象已独立展开；字段类型 / port / DTO 已说明降级原因。 |
| 每个对象是否有唯一所属部分 | `pass` | 五部分之间不共享可写对象。 |
| 字段类型是否 body-free | `pass` | 外部输入均为 ref / snapshot / safe conclusion / gap。 |
| 状态是否被压成单一 ready | `pass` | definition、attempt、candidate、gate、eligibility、availability、projection 分轴。 |
| Step 8 预期对象是否已定义 | `pass` | 见 §8 反查表。 |
| Step 9 预期状态是否已定义 | `pass` | 各对象状态集合已列出。 |
| 是否提前写完整实现 | `pass` | 无完整 schema、返回类型、DDL、算法或调用链。 |
| MI-UP / Q 是否被关闭 | `pass` | 全部继续 pending / blocked / future。 |

## 11. 回填草稿与下一步门禁

正式第 6 章应回填对象候选池筛选结论和各正式对象的基本信息、字段 / 状态 / 函数 / 工厂 / 禁止事项；不回填本文件的过程性停审表。Step 7 / 8 / 9 只能引用上述正式对象，不得临时发明同义对象。

`gate_status = pass_stop_review`。Step 6 足以支撑 Step 7 API / 接口骨架；下一动作是读取 Step 6 与 Step 7 规范并创建 `02_hld_step_07_api_interface_skeleton.md`。
