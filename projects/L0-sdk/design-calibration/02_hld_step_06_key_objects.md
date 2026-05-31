## Step 6. 关键对象轮廓

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-sdk/02-概要设计.md` §6 关键对象轮廓

### 2. 本步输入

- Step 5 已收敛的主要组成部分、职责与边界：
  - `projects/L0-sdk/design-calibration/02_hld_step_05_components_boundary.md` §7.1 ~ §7.13
- Step 4 已收敛的代码主体框架映射：
  - `projects/L0-sdk/design-calibration/02_hld_step_04_code_subject_framework.md` §7.1 ~ §7.4
- Step 3 已收敛的结构性约束：
  - `projects/L0-sdk/design-calibration/02_hld_step_03_constraints.md` §7.1 ~ §7.3
- 架构设计已收稳的职责边界、数据所有权和交互方式：
  - `projects/L0-sdk/01-架构设计.md` §4 / §8 / §9 / §10 / §13

### 3. SOP 问题回答

1. 哪些对象如果不在概要设计层点名，详细设计会重新发明主语？

   回答：必须点名 SDK 共同语义、上游派生视图、服务 client 视图、事件 client 视图、横切默认策略、package candidate、验证证据、兼容判断和 deprecated 记录相关对象。否则详细设计会在接口、处理流或状态机中临时发明 `baseline`、`binding view`、`candidate`、`evidence`、`compatibility` 等主语，导致三语言语义、上游版本引用、验证证据和兼容演进无法对齐。

2. Step 5 的对象候选池中，哪些候选对象正式进入本步独立展开？

   回答：正式展开 `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap`、`DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState`、`ServiceClientView`、`ServiceCapabilityRef`、`BusEventClientView`、`EventSemanticMapping`、`ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef`。

3. Step 5 的对象候选池中，哪些名称只是字段类型、DTO、port、repository、API、trigger 或实现细节，不应作为关键对象展开？

   回答：`Entry`、`Trigger`、`Port`、`Repository`、`Runner`、`Adapter`、DTO、schema、package layout、具体语言目录和 backend SDK 原始响应都不在本步当领域对象展开。`CoreContractRef`、`TransportSemanticId`、`FakeBoundaryRef`、`LanguageRuntimeRef`、`PackageArtifactRef`、`RunnerRef` 等可作为字段类型或引用类型出现，但当前不单独成节。

4. 每个对象属于哪个主要组成部分？

   回答：本步在每个对象基本信息表中通过“所属部分”回指 Step 5 七个主要组成部分，避免对象脱离业务结构孤立存在。

5. 每个对象是什么类型？

   回答：本步区分 domain truth object、value object、projection / view object、state enum / value object、reference object、policy、guard、audit / evidence object、decision object 和 domain record。对象类型只到概要设计层，不展开 Rust trait、struct、enum 的完整定义。

6. 每个对象至少需要哪些关键字段骨架？

   回答：每个对象至少列出能支撑 Step 8 处理流和 Step 9 状态机的关键字段，例如语义基线版本、语言集合、上游版本引用、snapshot freshness、服务能力引用、事件语义映射、策略等级、candidate 状态、evidence 结果、兼容等级和迁移说明引用。

7. 每个关键字段分别是什么类型，且每个字段的作用是什么？

   回答：所有字段表使用 `字段 / 类型 / 作用` 三列，类型写概要设计层类型名，例如 `SdkBaselineId`、`LanguageSet`、`UpstreamVersionRef`、`SnapshotFreshnessState`、`CapabilitySet`、`EvidenceResult`，不写完整 Rust 字段声明、泛型、数据库列或序列化 schema。

8. 哪些对象存在状态集合，且每个状态的作用是什么？

   回答：`SnapshotFreshnessState`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord` 存在明确状态集合；部分 policy / guard 对象通过策略等级或裁决结果表达状态倾向，但不作为独立状态机展开。

9. 每个对象有哪些成员函数骨架，且每个函数的作用是什么？

   回答：本步只列概要级行为，例如 `assert_language_consistency(LanguageId language_id)`、`mark_stale(UpstreamVersionRef upstream_ref)`、`can_publish_candidate(VerificationEvidence evidence)`、`decide_compatibility(CompatibilityInput input)`。函数参数必须写明类型名和参数名，不写返回类型或实现。

10. 每个对象有哪些工厂函数骨架，且每个工厂函数的作用是什么？

   回答：本步为需要创建或派生的对象列出 `from_*`、`create_*` 或 `derive_*` 工厂函数，例如 `from_upstream_snapshot(UpstreamSnapshot snapshot)`、`create_candidate(PackageCandidateInput input)`、`from_validation_run(ValidationRun run)`。

11. 每个成员函数 / 工厂函数的参数分别是什么类型？

   回答：所有函数参数均按 `TypeName param_name` 书写；无参数函数保留空参数列表，例如 `is_terminal()`。

12. 哪些对象虽然已经在 Step 5 被列为代码主体 / 模块，但仍必须在本步独立展开对象骨架？

   回答：`SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap`、`DerivedBindingView`、`LanguageBindingView`、`ServiceClientView`、`BusEventClientView`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord` 必须从 Step 5 的代码主体升级为本步关键对象骨架。

13. Step 8 处理流或 Step 9 状态机预计会使用哪些对象，它们是否已经在本步正式定义？

   回答：Step 8 预计会使用语义基线、上游派生视图、service client view、event client view、横切 policy、candidate、evidence 和 compatibility 对象；Step 9 预计会使用 snapshot freshness、candidate status、verification result、compatibility level、deprecated lifecycle。上述对象都在本步正式定义或作为字段类型明确保留。

14. 哪些字段、函数或结构已经属于详细设计，不应在本步写完整？

   回答：完整 public SDK API、完整 DTO / JSON / proto schema、完整 Rust struct / enum、trait 约束、错误码全集、数据库列、artifact 文件格式、runner 命令、package manager 配置、CI 脚本和跨语言目录结构都后移到详细设计、测试方案或实施计划。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 只围绕 binding、wrapper、event、docs、release 旧主题描述 | 缺少可被详细设计承接的正式对象骨架 |
| 旧对象表达 | 没有从 Step 5 对象候选池筛选正式对象 | 后续接口、流程和状态机容易各自发明对象 |
| 旧字段表达 | 没有字段类型和字段作用 | 详细设计无法判断对象边界、引用边界和状态承载位置 |
| 旧行为表达 | 缺少成员函数和工厂函数骨架 | 处理流会退化成自然语言步骤,无法映射到对象责任 |
| 旧边界表达 | Entry、Adapter、Port、DTO 与领域对象混在一起 | 容易把接口层或实现层结构误写成领域 truth |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象来源 | 从旧主题临时抽名词 | 从 Step 5 对象发现维度表筛选 | 保持主要组成部分、对象、流程和状态机一致 |
| 对象组织 | 对象总览式描述 | 每个关键对象独立成节 | 支撑详细设计 1:1 承接 |
| 字段粒度 | 只写对象名或职责 | 写关键字段、字段类型和作用 | 防止对象边界不清 |
| 行为粒度 | 不写对象行为 | 写成员函数 / 工厂函数骨架并标注参数类型 | 让 Step 8 能引用对象行为 |
| 边界控制 | API / adapter / port 与对象混写 | 明确哪些只留给 Step 7 或详细设计 | 避免概要设计滑进实现细节 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只保留对象总览表 | 文件短,容易扫读 | 不能说明字段、状态、函数和禁止事项,详细设计仍要重建对象 | 不采用 |
| 方案 B：按主要组成部分嵌套对象定义 | 与 Step 5 结构一致 | 会让第 6 章重复第 5 章,对象也容易被部分边界遮住 | 不采用 |
| 方案 C：先筛选候选池,再按关键对象独立成节,通过“所属部分”回指 Step 5 | 对象主语稳定,能支撑接口、流程和状态机 | 文件较长,需要分批写入和校验 | 采用 |

### 7. 结构化中间产物

#### 7.1 对象候选池筛选说明

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `SdkSemanticBaseline` | truth | 独立展开 | SDK 共同语义真相,所有 client view 和兼容判断都依赖它 |
| `ClientCapabilityModel` | truth / value object | 独立展开 | 表达官方 client 能力边界,防止语言包各自扩展能力 |
| `CrossLanguageConceptMap` | policy / value object | 独立展开 | 支撑 Rust / Python / TypeScript 概念一致性 |
| `DerivedBindingView` | projection / view | 独立展开 | 承接上游契约派生结果,不是 raw binding |
| `LanguageBindingView` | projection / view | 独立展开 | 表达单语言 binding 视图和 idiomatic 投影 |
| `UpstreamVersionRef` | reference | 独立展开 | 版本追溯是 SDK 派生视图成立前提 |
| `SnapshotFreshnessState` | state | 独立展开 | stale / pending / unsupported / verified 等判断需要正式状态 |
| `ServiceClientView` | projection / view | 独立展开 | 服务能力访问的 SDK 级视图 |
| `ServiceCapabilityRef` | reference | 独立展开 | 指向 formal API 背后的服务能力,避免源码依赖服务仓 |
| `BusEventClientView` | projection / view | 独立展开 | 事件 client 必须服从 `L0-bus` 语义 |
| `EventSemanticMapping` | value object | 独立展开 | 连接 SDK 事件表达与 bus semantic |
| `ErrorMappingPolicy` | policy | 独立展开 | SDK 错误表达需要跨语言一致 |
| `TracePropagationPolicy` | policy | 独立展开 | trace 传播是 service / event client 共用横切规则 |
| `RedactionPolicy` | policy | 独立展开 | 禁止正文和敏感字段处理必须成为显式策略 |
| `CredentialProtectionPolicy` | policy | 独立展开 | 凭据材料保护不能依赖单语言习惯 |
| `BoundaryGuard` | guard | 独立展开 | 用于阻止 forbidden body、越界 capability 和 fake success |
| `PackageCandidate` | truth / state | 独立展开 | P0 本地 package candidate 的核心真相 |
| `VerificationEvidence` | audit / evidence | 独立展开 | 证明 smoke、docs example 和兼容验证是否成立 |
| `CompatibilityDecision` | decision / state | 独立展开 | 支撑跨语言兼容判断和 breaking change 表达 |
| `DeprecatedApiRecord` | domain record / state | 独立展开 | 记录 deprecated 生命周期和迁移边界 |
| `MigrationGuideRef` | reference | 独立展开 | deprecated 和 compatibility 需要可追溯迁移说明 |
| `CompatibilityPolicy` | policy | 不独立展开 | 当前作为 `CompatibilityDecision` 的规则来源,详细设计再决定是否拆成独立 policy |
| `SdkCapabilityProjection` | projection | 不独立展开 | 当前作为查询视图字段来源,Step 7 展开 query skeleton |
| `EvidenceProjection` | projection | 不独立展开 | 当前由 `VerificationEvidence` 支撑,Step 7 / 详细设计展开读取接口 |
| `Entry` / `Trigger` / `Port` / `Repository` / `Runner` / `Adapter` | API / implementation boundary | 不独立展开 | 属于 Step 7 接口骨架或详细设计实现边界 |
| `CoreContractRef` / `TransportSemanticId` / `FakeBoundaryRef` / `LanguageRuntimeRef` / `PackageArtifactRef` / `RunnerRef` | reference field type | 仅作字段类型 | 当前只需作为字段类型支撑对象引用,不独立承担对象责任 |

#### 7.2 关键对象分布说明

| 主要组成部分 | 独立展开对象 |
|---|---|
| 官方客户端语义核心 | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` |
| 上游契约消费与派生视图 | `DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` |
| 平台能力访问与正式边界适配 | `ServiceClientView`、`ServiceCapabilityRef` |
| 事件客户端视图 | `BusEventClientView`、`EventSemanticMapping` |
| 横切默认行为 | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` |
| package candidate 与验证证据 | `PackageCandidate`、`VerificationEvidence` |
| 文档、兼容与演进 | `CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` |

#### 7.3 SdkSemanticBaseline

##### 7.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 官方客户端语义核心 |
| 对象类型 | domain truth object |
| 主要责任 | 维护 SDK 官方共同语义基线,作为三语言 client、派生视图、验证和兼容判断的共同依据 |

##### 7.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `baseline_id` | `SdkBaselineId` | 标识一条 SDK 语义基线 |
| `baseline_version` | `SemanticVersion` | 表达该基线的版本 |
| `supported_languages` | `LanguageSet` | 记录当前基线覆盖的官方语言集合 |
| `capability_model` | `ClientCapabilityModel` | 指向当前基线下允许暴露的 client 能力 |
| `concept_map` | `CrossLanguageConceptMap` | 维护三语言概念映射 |
| `upstream_refs` | `UpstreamVersionRefSet` | 记录该基线承接的上游 core / bus / formal API 版本 |

##### 7.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_language_supported(LanguageId language_id)` | 判断某语言是否属于当前官方支持范围 |
| `assert_capability_supported(ClientCapabilityId capability_id)` | 判断某项 client 能力是否被当前基线允许暴露 |
| `assert_concept_aligned(LanguageId language_id, SdkConceptId concept_id)` | 判断某语言下的概念表达是否仍对齐共同语义 |
| `is_compatible_with(UpstreamVersionRef upstream_ref)` | 判断某个上游版本引用是否仍被当前基线接受 |

##### 7.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_initial(SdkBaselineInput input)` | 从初始基线输入创建 SDK 共同语义基线 |
| `derive_next(SdkSemanticBaseline previous_baseline, BaselineChangeSet change_set)` | 基于上一基线和变更集派生下一版基线 |
| `rehydrate(SdkBaselineRecord record)` | 从持久化记录恢复基线对象 |

##### 7.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不重新定义上游 truth | 只能引用 `L0-core`、`L0-bus` 和 formal API 的版本结果 |
| 不被单语言实现牵引 | Rust / Python / TypeScript 的 idiomatic 表达不能单独改写平台语义 |
| 不保存业务正文 | 基线只保存语义、能力和引用,不保存请求、响应或事件 payload 正文 |

#### 7.4 ClientCapabilityModel

##### 7.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 官方客户端语义核心 |
| 对象类型 | value object |
| 主要责任 | 表达官方 SDK client 可以暴露哪些平台能力、哪些能力明确不支持或需要后续裁剪 |

##### 7.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `model_id` | `ClientCapabilityModelId` | 标识一组 client 能力模型 |
| `supported_capabilities` | `CapabilitySet` | 记录当前可暴露能力集合 |
| `unsupported_capabilities` | `CapabilitySet` | 记录当前明确不支持或暂不进入 P0 的能力 |
| `capability_sources` | `UpstreamVersionRefSet` | 标注能力来源于哪些上游版本 |
| `boundary_notes` | `CapabilityBoundaryNoteSet` | 解释能力边界、fake boundary 和 not verified 的原因 |

##### 7.4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports(ClientCapabilityId capability_id)` | 判断某项 SDK 能力是否在支持集合内 |
| `mark_unsupported(ClientCapabilityId capability_id, BoundaryReason reason)` | 将能力标记为不支持并记录边界原因 |
| `requires_formal_boundary(ClientCapabilityId capability_id)` | 判断能力是否必须通过 formal API 边界访问 |
| `explain_boundary(ClientCapabilityId capability_id)` | 为能力查询和文档说明提供边界解释 |

##### 7.4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_semantic_baseline(SdkSemanticBaseline baseline)` | 从 SDK 语义基线派生能力模型 |
| `merge_from_views(DerivedBindingView derived_view, ServiceClientView service_view, BusEventClientView event_view)` | 从派生视图、服务视图和事件视图合成能力模型 |

##### 7.4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不承诺未验证能力 | 未通过 candidate 验证的能力不能被标为 supported |
| 不替代服务端授权 | 能力模型只表达 SDK 暴露范围,不执行身份认证或权限裁决 |
| 不隐藏 unsupported | 不支持能力必须显式可解释,不能静默缺失 |

#### 7.5 CrossLanguageConceptMap

##### 7.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 官方客户端语义核心 |
| 对象类型 | value object |
| 主要责任 | 维护同一 SDK 概念在 Rust、Python、TypeScript 中的名称、表达和行为边界映射 |

##### 7.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `map_id` | `ConceptMapId` | 标识一组跨语言概念映射 |
| `concept_entries` | `ConceptMappingEntrySet` | 记录 SDK 概念到各语言表达的映射 |
| `language_set` | `LanguageSet` | 表达映射覆盖的语言集合 |
| `semantic_owner` | `SdkBaselineId` | 指向拥有该映射的语义基线 |
| `drift_markers` | `ConceptDriftMarkerSet` | 记录可能产生语义漂移的位置 |

##### 7.5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `resolve(LanguageId language_id, SdkConceptId concept_id)` | 解析某个 SDK 概念在指定语言中的表达 |
| `assert_no_drift(LanguageId language_id, SdkConceptId concept_id)` | 判断指定语言表达是否偏离共同语义 |
| `compare_languages(LanguageId left_language, LanguageId right_language, SdkConceptId concept_id)` | 比较同一概念在两种语言中的表达差异 |
| `mark_drift(SdkConceptId concept_id, ConceptDriftReason reason)` | 标记某概念存在语义漂移风险 |

##### 7.5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_baseline(SdkSemanticBaseline baseline)` | 从共同语义基线生成初始跨语言概念映射 |
| `from_language_views(LanguageBindingView rust_view, LanguageBindingView python_view, LanguageBindingView typescript_view)` | 从三语言 binding 视图建立概念映射 |

##### 7.5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把语言习惯当平台语义 | idiomatic 表达只能作为映射结果,不能成为 truth 来源 |
| 不压平语言差异 | 允许语言表达不同,但必须能回到同一 SDK 概念 |
| 不隐藏 drift | 语义漂移必须显式标记并进入兼容或验证流程 |

#### 7.6 DerivedBindingView

##### 7.6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 上游契约消费与派生视图 |
| 对象类型 | projection / view object |
| 主要责任 | 表达从 `L0-core`、`L0-bus` 和 formal API 派生出来的 SDK binding 消费视图 |

##### 7.6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `DerivedBindingViewId` | 标识一份派生 binding 视图 |
| `upstream_refs` | `UpstreamVersionRefSet` | 记录视图承接的上游版本集合 |
| `language_views` | `LanguageBindingViewSet` | 保存各语言对应的 binding 视图 |
| `freshness_state` | `SnapshotFreshnessState` | 表示该派生视图是否新鲜、过期或等待确认 |
| `unsupported_items` | `UnsupportedBindingItemSet` | 记录不能派生或暂不支持的契约元素 |

##### 7.6.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_fresh()` | 判断派生视图是否可被当前 candidate 使用 |
| `find_language_view(LanguageId language_id)` | 查找指定语言的 binding 视图 |
| `mark_stale(UpstreamVersionRef upstream_ref)` | 因上游版本变化将视图标记为过期 |
| `record_unsupported(UpstreamSymbolRef symbol_ref, UnsupportedReason reason)` | 记录无法派生的上游符号 |

##### 7.6.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_upstream_refs_and_symbols(Vec<UpstreamVersionRef> refs, Vec<CapabilitySymbol> symbols)` | 从上游版本引用和 application 层提取出的能力符号派生 SDK binding 视图 |
| `rehydrate(DerivedBindingViewRecord record)` | 从持久化记录恢复派生视图 |

##### 7.6.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不制造第二契约 | 只能派生上游 truth,不能自行定义 proto、CloudEvent 或 ErrorCode truth |
| 不源码依赖服务仓 | formal API 背后的服务实现不能成为派生来源 |
| 不把 stale 视图当 fresh | 过期视图必须显式阻止 candidate 或标记 not verified |

#### 7.7 LanguageBindingView

##### 7.7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 上游契约消费与派生视图 |
| 对象类型 | projection / value object |
| 主要责任 | 表达某一官方语言下的 SDK binding 视图,并保留其与共同语义和上游版本的追溯关系 |

##### 7.7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `language_view_id` | `LanguageBindingViewId` | 标识某语言 binding 视图 |
| `language_id` | `LanguageId` | 标识 Rust、Python 或 TypeScript 语言 |
| `concept_map_ref` | `ConceptMapId` | 指向跨语言概念映射 |
| `binding_items` | `BindingItemSet` | 表达该语言可生成或可暴露的 binding 项 |
| `idiomatic_notes` | `LanguageIdiomaticNoteSet` | 说明语言惯用表达与共同语义的差异 |
| `freshness_state` | `SnapshotFreshnessState` | 表达该语言视图的新鲜度 |

##### 7.7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `resolve_binding(SdkConceptId concept_id)` | 根据 SDK 概念解析该语言下的 binding 项 |
| `assert_semantic_alignment(CrossLanguageConceptMap concept_map)` | 判断语言视图是否仍对齐跨语言概念映射 |
| `mark_not_verified(VerificationReason reason)` | 将语言视图标记为未验证 |
| `contains_symbol(UpstreamSymbolRef symbol_ref)` | 判断该语言视图是否覆盖某个上游符号 |

##### 7.7.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive_for_language(LanguageId language_id, DerivedBindingView derived_view)` | 从整体派生视图生成某语言视图 |
| `rehydrate(LanguageBindingViewRecord record)` | 从持久化记录恢复语言视图 |

##### 7.7.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不拥有平台语义 | 语言视图只能表达语言投影,不能独自修改语义 |
| 不绕过共同映射 | 所有语言 binding 都必须可回指 `CrossLanguageConceptMap` |
| 不隐藏未验证状态 | 未经过 smoke 或 docs example 的语言视图不能被标为 verified |

#### 7.8 UpstreamVersionRef

##### 7.8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 上游契约消费与派生视图 |
| 对象类型 | reference object |
| 主要责任 | 记录 SDK 派生视图、candidate、evidence 和兼容判断所依赖的上游版本引用 |

##### 7.8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `upstream_name` | `UpstreamProjectName` | 标识上游项目,例如 `L0-core` 或 `L0-bus` |
| `artifact_kind` | `UpstreamArtifactKind` | 标识引用的是契约、语义快照、formal API 或文档 |
| `version` | `UpstreamVersion` | 记录上游版本号或语义版本 |
| `commit_ref` | `CommitRef` | 记录可追溯提交 |
| `document_ref` | `DesignDocumentRef` | 指向被引用的设计文档或校准产物 |

##### 7.8.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(UpstreamVersionRef other_ref)` | 判断两个上游引用是否指向同一版本来源 |
| `is_newer_than(UpstreamVersionRef other_ref)` | 判断当前引用是否新于另一引用 |
| `requires_refresh(UpstreamVersionRef latest_ref)` | 判断上游最新引用是否要求 SDK 刷新派生视图 |

##### 7.8.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_design_document(DesignDocumentRef document_ref)` | 从设计文档引用生成上游版本引用 |
| `from_contract_snapshot(ContractSnapshotRef snapshot_ref)` | 从契约快照引用生成上游版本引用 |

##### 7.8.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不代表上游 truth 本身 | 它只记录引用,不复制上游契约或业务事实 |
| 不使用模糊版本 | 不能只写 latest 或当前目录,必须可追溯 |
| 不替代兼容判断 | 版本变化是否兼容由 `CompatibilityDecision` 判断 |

#### 7.9 SnapshotFreshnessState

##### 7.9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 上游契约消费与派生视图 |
| 对象类型 | state enum / value object |
| 主要责任 | 表达派生视图、语言视图或上游快照相对当前上游版本的新鲜度 |

##### 7.9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `state` | `FreshnessValue` | 当前新鲜度状态 |
| `observed_ref` | `UpstreamVersionRef` | 当前视图实际承接的上游引用 |
| `latest_known_ref` | `UpstreamVersionRef` | 当前已知上游最新引用 |
| `reason` | `FreshnessReason` | 状态形成原因 |
| `checked_at` | `ObservedAt` | 最近一次检查时间 |

##### 7.9.3 状态集合

| 状态 | 作用 |
|---|---|
| `Fresh` | 视图已对齐当前已知上游版本 |
| `PendingRefresh` | 已发现上游变化,正在等待刷新或验证 |
| `Stale` | 视图落后于上游,不得作为 verified candidate 的依据 |
| `Unsupported` | 上游变化当前无法派生或暂不纳入 SDK 范围 |
| `Unknown` | 无法确认上游版本或检查结果缺失 |

##### 7.9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_usable_for_candidate()` | 判断当前新鲜度是否允许进入 candidate 生成 |
| `mark_pending(UpstreamVersionRef latest_ref, FreshnessReason reason)` | 标记发现上游变化但尚未完成刷新 |
| `mark_stale(UpstreamVersionRef latest_ref, FreshnessReason reason)` | 标记当前视图已经过期 |
| `mark_fresh(UpstreamVersionRef latest_ref)` | 标记当前视图已经对齐最新上游版本 |

##### 7.9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_refs(UpstreamVersionRef observed_ref, UpstreamVersionRef latest_known_ref)` | 根据已观察版本和最新已知版本生成新鲜度状态 |
| `unknown(FreshnessReason reason)` | 生成无法确认的新鲜度状态 |

##### 7.9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不静默降级 | stale、unsupported 或 unknown 必须显式影响 candidate 和能力查询 |
| 不伪装 verified | 只有 fresh 且验证通过的视图才能支撑 verified 结论 |
| 不保存上游内容正文 | 只保存版本引用、原因和检查结果 |

#### 7.10 ServiceClientView

##### 7.10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 平台能力访问与正式边界适配 |
| 对象类型 | projection / view object |
| 主要责任 | 表达 SDK 对某组服务能力的 client 视图,并明确这些能力如何经 formal API 或 fake boundary 被访问 |

##### 7.10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `ServiceClientViewId` | 标识一份服务 client 视图 |
| `capability_refs` | `ServiceCapabilityRefSet` | 记录该视图暴露的服务能力引用 |
| `formal_boundary_refs` | `FormalBoundaryRefSet` | 记录能力对应的 formal API 边界 |
| `fake_boundary_refs` | `FakeBoundaryRefSet` | 记录验证或本地测试可用的 fake / fixture 边界 |
| `default_policies` | `ClientPolicySet` | 记录应用到该视图的错误、trace、redaction 和凭据保护策略 |
| `freshness_state` | `SnapshotFreshnessState` | 表达该服务视图是否仍对齐上游契约 |

##### 7.10.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `resolve_capability(ServiceCapabilityRef capability_ref)` | 查找服务能力在 SDK client 中的访问视图 |
| `requires_fake_boundary(ServiceCapabilityRef capability_ref)` | 判断某能力当前是否只能通过 fake / fixture 边界验证 |
| `assert_formal_boundary_available(ServiceCapabilityRef capability_ref)` | 确认能力具备正式 API 边界 |
| `apply_policy(ClientPolicySet policy_set)` | 将横切默认策略绑定到服务 client 视图 |

##### 7.10.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assemble_from_capabilities(ClientCapabilityModel capability_model, DerivedBindingView derived_view)` | 从能力模型和派生视图组装服务 client 视图 |
| `from_formal_api(FormalApiSnapshot api_snapshot, ClientPolicySet policy_set)` | 从 formal API 快照和默认策略生成服务 client 视图 |

##### 7.10.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为服务端 gateway | 它只表达 SDK client 视图,不承载服务端路由或业务事务 |
| 不拥有业务事实 | 服务能力背后的事实仍归对应服务仓 |
| 不保存生产正文 | 请求、响应和业务 payload 不进入该视图 |

#### 7.11 ServiceCapabilityRef

##### 7.11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 平台能力访问与正式边界适配 |
| 对象类型 | reference object |
| 主要责任 | 标识 SDK 暴露的一项服务能力及其 formal API 来源,用于避免 SDK 源码依赖服务实现仓 |

##### 7.11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `capability_id` | `ServiceCapabilityId` | 标识服务能力 |
| `provider_project` | `UpstreamProjectName` | 标识能力所属服务项目 |
| `formal_api_ref` | `FormalApiRef` | 指向服务能力的正式 API 契约 |
| `capability_kind` | `ServiceCapabilityKind` | 区分 command、query、operation 或其他能力类别 |
| `support_state` | `CapabilitySupportState` | 标识 supported、unsupported、fake only 或 pending |

##### 7.11.3 状态集合

| 状态 | 作用 |
|---|---|
| `Supported` | 能力具备正式 API 且可进入 SDK candidate |
| `FakeOnly` | 能力只能通过 fake / fixture 验证,不得宣称生产可用 |
| `Pending` | 能力边界或上游契约尚未确认 |
| `Unsupported` | 能力明确不进入当前 SDK 范围 |

##### 7.11.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_supported()` | 判断能力是否可作为正式 SDK 能力暴露 |
| `requires_formal_api()` | 判断该能力是否必须绑定 formal API |
| `mark_fake_only(FakeBoundaryRef fake_boundary_ref, BoundaryReason reason)` | 将能力标记为只能通过 fake / fixture 边界验证 |
| `mark_unsupported(BoundaryReason reason)` | 将能力标记为当前不支持 |

##### 7.11.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_formal_api(FormalApiRef formal_api_ref)` | 从正式 API 引用创建服务能力引用 |
| `fake_only(ServiceCapabilityId capability_id, FakeBoundaryRef fake_boundary_ref)` | 创建仅可 fake / fixture 验证的能力引用 |

##### 7.11.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不引用服务源码路径 | 只能引用 formal API 或 fake boundary,不能绑定服务实现目录 |
| 不模糊 support 状态 | fake only、pending、unsupported 必须与 supported 区分 |
| 不表达权限结果 | 是否有权限调用由安全入口或服务端决定 |

#### 7.12 BusEventClientView

##### 7.12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 事件客户端视图 |
| 对象类型 | projection / view object |
| 主要责任 | 表达 SDK 基于 `L0-bus` 语义提供的事件发布、订阅、结果感知和失败感知 client 视图 |

##### 7.12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `BusEventClientViewId` | 标识一份事件 client 视图 |
| `transport_semantic_id` | `TransportSemanticId` | 指向 `L0-bus` transport semantic 来源;类型复用 `bus-contracts::metadata::TransportSemanticId` |
| `event_mappings` | `EventSemanticMappingSet` | 记录 SDK 事件表达与 bus semantic 的映射 |
| `supported_operations` | `EventClientOperationSet` | 表达当前支持的事件发布、订阅或结果读取能力 |
| `freshness_state` | `SnapshotFreshnessState` | 表达事件视图是否仍对齐 bus 语义 |
| `default_policies` | `ClientPolicySet` | 应用于事件 client 的横切默认策略 |

##### 7.12.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `resolve_event_mapping(TransportSemanticId transport_semantic_id)` | 根据 bus transport semantic 查找 SDK 事件映射 |
| `supports_operation(EventClientOperation operation)` | 判断事件 client 是否支持某类操作 |
| `assert_transport_semantic_aligned(TransportSemanticId transport_semantic_id)` | 判断视图是否仍对齐指定 bus transport semantic 版本 |
| `apply_policy(ClientPolicySet policy_set)` | 绑定错误、trace、redaction 等横切默认策略 |

##### 7.12.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assemble_from_bus_snapshot(BusSemanticSnapshot bus_snapshot, EventSemanticMappingSet mapping_set)` | 从 bus 语义快照和映射集合组装事件 client 视图 |
| `rehydrate(BusEventClientViewRecord record)` | 从持久化记录恢复事件 client 视图 |

##### 7.12.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不实现 bus runtime | delivery、retry、DLQ、replay 和 tap truth 归 `L0-bus` |
| 不保存事件 payload | 事件正文不进入 SDK 视图或证据正文 |
| 不自定义 transport semantic | 事件 transport 语义必须来源于 `L0-bus` |

#### 7.13 EventSemanticMapping

##### 7.13.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 事件客户端视图 |
| 对象类型 | value object |
| 主要责任 | 维护 SDK 事件表达与 `L0-bus` publication、delivery、feedback、recovery 等语义之间的映射关系 |

##### 7.13.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `mapping_id` | `EventSemanticMappingId` | 标识一条事件语义映射 |
| `sdk_event_name` | `SdkEventName` | 表达 SDK 对调用方暴露的事件名称 |
| `transport_semantic_id` | `TransportSemanticId` | 指向 `L0-bus` 中对应 transport semantic |
| `operation_kind` | `EventClientOperationKind` | 标识发布、订阅、反馈或恢复相关操作类别 |
| `semantic_constraints` | `EventSemanticConstraintSet` | 记录事件映射必须遵守的 bus 语义约束 |

##### 7.13.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_sdk_event(SdkEventName sdk_event_name)` | 判断映射是否匹配指定 SDK 事件名称 |
| `assert_transport_semantic(TransportSemanticId transport_semantic_id)` | 判断映射是否指向指定 bus transport semantic |
| `explain_constraints()` | 输出该映射所承接的 bus 语义约束说明 |

##### 7.13.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_transport_semantic(TransportSemanticId transport_semantic_id, SdkEventName sdk_event_name)` | 从 bus transport semantic 和 SDK 事件名称创建映射 |
| `from_mapping_entry(EventMappingEntry mapping_entry)` | 从映射条目恢复事件语义映射 |

##### 7.13.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不弱化 bus 语义 | SDK 事件名称不能改变 bus 对 publication、delivery、feedback 或 recovery 的含义 |
| 不保存事件正文 | 映射只保存名称、语义和约束,不保存 payload |
| 不成为订阅运行态 | 订阅 offset、重试和投递状态归 bus runtime |

#### 7.14 ErrorMappingPolicy

##### 7.14.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 横切默认行为 |
| 对象类型 | policy |
| 主要责任 | 将上游 formal API、bus 语义和本地验证错误映射为跨语言一致的 SDK 错误表达 |

##### 7.14.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `ErrorMappingPolicyId` | 标识一组错误映射策略 |
| `source_error_kinds` | `SourceErrorKindSet` | 记录可被映射的上游错误类别 |
| `sdk_error_kinds` | `SdkErrorKindSet` | 记录 SDK 对外暴露的错误类别 |
| `language_error_shapes` | `LanguageErrorShapeSet` | 约束三语言错误表达差异 |
| `redaction_rule_ref` | `RedactionPolicyRef` | 指向错误信息脱敏规则 |

##### 7.14.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `map_source_error(SourceErrorDescriptor source_error)` | 将上游错误描述映射为 SDK 错误类别 |
| `assert_language_shape(LanguageId language_id, SdkErrorKind error_kind)` | 判断某语言错误表达是否符合共同策略 |
| `requires_redaction(SourceErrorDescriptor source_error)` | 判断错误信息是否需要 redaction |
| `explain_mapping(SourceErrorKind source_error_kind)` | 输出错误映射原因,供文档和调试使用 |

##### 7.14.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_baseline(SdkSemanticBaseline baseline)` | 从 SDK 共同语义基线生成默认错误映射策略 |
| `from_mapping_rules(ErrorMappingRuleSet rule_set)` | 从错误映射规则集合创建策略 |

##### 7.14.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不透出上游原始正文 | 原始错误正文和敏感内容必须先经过 redaction |
| 不让单语言自定义错误语义 | 语言可以有惯用异常类型,但错误类别必须对齐 |
| 不吞掉错误 | SDK 不能把上游错误伪装为成功 |

#### 7.15 TracePropagationPolicy

##### 7.15.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 横切默认行为 |
| 对象类型 | policy |
| 主要责任 | 约束 SDK 在 service client、event client、candidate 验证和 docs example 中如何传播 trace 语义 |

##### 7.15.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `TracePropagationPolicyId` | 标识一组 trace 传播策略 |
| `trace_context_kind` | `TraceContextKind` | 表达使用的 trace 上下文类型 |
| `required_trace_fields` | `TraceFieldSet` | 记录必须携带的 trace 字段 |
| `language_bindings` | `LanguageTraceBindingSet` | 记录各语言如何表达 trace context |
| `missing_trace_behavior` | `MissingTraceBehavior` | 定义缺失 trace 时的默认行为 |

##### 7.15.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `inject_trace(TraceContext trace_context, ClientRequestEnvelope request_envelope)` | 将 trace context 注入 SDK 请求或事件 envelope |
| `extract_trace(ClientResponseEnvelope response_envelope)` | 从响应或事件 envelope 中提取 trace context |
| `assert_required_fields(TraceContext trace_context)` | 判断 trace context 是否包含必需字段 |
| `handle_missing_trace(MissingTraceReason reason)` | 按默认策略处理缺失 trace 的场景 |

##### 7.15.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_baseline(SdkSemanticBaseline baseline)` | 根据共同语义基线创建默认 trace 传播策略 |
| `from_trace_profile(TraceProfile trace_profile)` | 从 trace profile 创建传播策略 |

##### 7.15.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不发明观测标准 | trace 语义必须对齐上游和平台约定 |
| 不携带业务正文 | trace context 不能包含请求、响应或事件正文 |
| 不静默丢失 trace | 缺失或非法 trace 必须有可解释默认行为 |

#### 7.16 RedactionPolicy

##### 7.16.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 横切默认行为 |
| 对象类型 | policy |
| 主要责任 | 约束 SDK 如何处理业务正文、敏感字段、错误信息、证据和日志中的脱敏边界 |

##### 7.16.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `RedactionPolicyId` | 标识一组 redaction 策略 |
| `forbidden_body_kinds` | `ForbiddenBodyKindSet` | 记录禁止进入 SDK truth 或 evidence 的正文类别 |
| `sensitive_field_rules` | `SensitiveFieldRuleSet` | 记录敏感字段识别和替换规则 |
| `evidence_redaction_mode` | `EvidenceRedactionMode` | 约束验证证据中的脱敏方式 |
| `audit_marker` | `RedactionAuditMarker` | 标记 redaction 已执行的审计信息 |

##### 7.16.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `redact_message(ObservedMessage message)` | 对错误、日志或证据消息执行脱敏 |
| `reject_forbidden_body(BodyDescriptor body_descriptor)` | 对禁止正文执行拒绝而不是存储 |
| `mark_evidence_redacted(VerificationEvidence evidence)` | 标记验证证据已经执行 redaction |
| `assert_no_forbidden_body(ObservedMessage message)` | 判断观察消息是否包含禁止正文 |

##### 7.16.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `strict_default()` | 创建默认严格 redaction 策略 |
| `from_security_profile(SecurityProfile security_profile)` | 从安全 profile 创建 redaction 策略 |

##### 7.16.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不允许配置关闭禁止正文边界 | 配置只能收紧或补充 redaction,不能关闭底线规则 |
| 不保存原文后再脱敏 | 禁止正文不能先进入 SDK truth 或 evidence |
| 不把 redaction 当成功验证 | 脱敏只说明边界处理完成,不代表业务能力验证通过 |

#### 7.17 CredentialProtectionPolicy

##### 7.17.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 横切默认行为 |
| 对象类型 | policy |
| 主要责任 | 约束 SDK 对凭据材料、token、secret、fake credential 和测试凭据的处理边界 |

##### 7.17.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `CredentialProtectionPolicyId` | 标识一组凭据保护策略 |
| `credential_kinds` | `CredentialKindSet` | 记录需要保护的凭据材料类别 |
| `storage_rule` | `CredentialStorageRule` | 约束凭据是否可存储及如何引用 |
| `redaction_policy_ref` | `RedactionPolicyRef` | 指向凭据 redaction 策略 |
| `fake_credential_rule` | `FakeCredentialRule` | 约束 fake / fixture 场景凭据使用 |

##### 7.17.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `protect(CredentialMaterial credential_material)` | 对凭据材料执行保护或引用化处理 |
| `reject_plain_secret(CredentialMaterial credential_material)` | 拒绝明文 secret 进入 SDK 状态或证据 |
| `allow_fake_credential(FakeCredentialRef fake_credential_ref)` | 判断 fake / fixture 凭据是否可用于验证 |
| `redact_credential(CredentialMaterial credential_material)` | 生成脱敏后的凭据展示信息 |

##### 7.17.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `strict_default(RedactionPolicy redaction_policy)` | 基于严格 redaction 策略创建默认凭据保护策略 |
| `from_credential_profile(CredentialProfile credential_profile)` | 从凭据 profile 创建保护策略 |

##### 7.17.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存明文凭据 | 明文 token、secret 和 credential body 不能进入 SDK truth、evidence 或日志 |
| 不执行身份校验 | 该策略只保护凭据材料,不决定登录或授权结果 |
| 不混淆 fake 凭据和生产凭据 | fake credential 必须在 evidence 和 candidate 中显式标注 |

#### 7.18 BoundaryGuard

##### 7.18.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 横切默认行为 |
| 对象类型 | guard |
| 主要责任 | 在 SDK 入口、处理流和验证流中阻止 forbidden body、越界 capability、fake success 和未验证能力被当成正式结果 |

##### 7.18.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `guard_id` | `BoundaryGuardId` | 标识一个边界守卫 |
| `redaction_policy` | `RedactionPolicy` | 用于判断和处理禁止正文 |
| `credential_policy` | `CredentialProtectionPolicy` | 用于判断凭据材料边界 |
| `capability_model` | `ClientCapabilityModel` | 用于判断能力是否在 SDK 范围内 |
| `violation_rules` | `BoundaryViolationRuleSet` | 记录违反边界时的裁决规则 |

##### 7.18.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_capability_allowed(ClientCapabilityId capability_id)` | 判断能力是否允许被 SDK 入口使用 |
| `assert_body_allowed(BodyDescriptor body_descriptor)` | 判断请求、响应、事件或证据正文是否允许进入当前流程 |
| `assert_not_fake_success(VerificationEvidence evidence)` | 阻止 fake / fixture 结果被标成生产成功 |
| `raise_violation(BoundaryViolation violation)` | 生成边界违规结果,供错误映射和证据记录使用 |

##### 7.18.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_default_policies(ClientCapabilityModel capability_model, RedactionPolicy redaction_policy, CredentialProtectionPolicy credential_policy)` | 从能力模型和默认安全策略创建边界守卫 |
| `strict_default(SdkSemanticBaseline baseline)` | 基于共同语义基线创建严格默认边界守卫 |

##### 7.18.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不被配置绕过 | 配置不能关闭 guard 对 forbidden body 和 fake success 的判断 |
| 不替代服务端权限 | guard 只判断 SDK 边界,不承担服务端授权 |
| 不吞掉违规 | 边界违规必须显式进入错误或验证证据 |

#### 7.19 PackageCandidate

##### 7.19.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | package candidate 与验证证据 |
| 对象类型 | domain truth object |
| 主要责任 | 表达 SDK 本地 package candidate 的版本、语言产物、上游引用、验证状态和是否可进入后续发布判断 |

##### 7.19.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `candidate_id` | `PackageCandidateId` | 标识一个本地 package candidate |
| `candidate_version` | `SemanticVersion` | 表达 candidate 对应的 SDK 版本 |
| `language_artifacts` | `LanguagePackageArtifactSet` | 记录 Rust、Python、TypeScript 产物引用 |
| `upstream_refs` | `UpstreamVersionRefSet` | 记录 candidate 承接的上游版本 |
| `status` | `PackageCandidateStatus` | 表达 candidate 当前状态 |
| `evidence_refs` | `VerificationEvidenceRefSet` | 记录支撑 candidate 判断的验证证据引用 |

##### 7.19.3 状态集合

| 状态 | 作用 |
|---|---|
| `Draft` | candidate 已创建但尚未完成验证 |
| `NotVerified` | candidate 存在未验证能力、fake only 能力或缺失证据 |
| `Failed` | candidate 验证失败,不能进入稳定判断 |
| `Verified` | candidate 通过当前 P0 要求的验证 |
| `Stable` | candidate 已通过兼容、文档和验证门禁,可作为稳定基线 |
| `Superseded` | candidate 被更新版本替代 |

##### 7.19.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_evidence(VerificationEvidence evidence)` | 将验证证据关联到 candidate |
| `mark_not_verified(VerificationReason reason)` | 标记 candidate 未达到验证要求 |
| `mark_failed(VerificationEvidence evidence)` | 基于失败证据标记 candidate 失败 |
| `mark_verified(VerificationEvidence evidence)` | 基于通过证据标记 candidate 已验证 |
| `promote_stable(CompatibilityDecision decision)` | 在兼容判断允许时将 candidate 提升为稳定 |
| `supersede(PackageCandidate next_candidate)` | 标记当前 candidate 被后续 candidate 替代 |

##### 7.19.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_candidate(PackageCandidateInput input)` | 从 candidate 生成输入创建本地 package candidate |
| `from_language_artifacts(LanguagePackageArtifactSet artifact_set, UpstreamVersionRefSet upstream_refs)` | 从三语言产物和上游引用创建 candidate |
| `rehydrate(PackageCandidateRecord record)` | 从持久化记录恢复 candidate |

##### 7.19.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不等同公共发布 | 本地 candidate 验证通过不代表已经发布到公共 registry |
| 不伪造生产可用 | fake only 或 not verified 能力不能被 candidate 标成 stable |
| 不保存业务正文 | candidate 只保存产物引用、版本、状态和证据引用 |

#### 7.20 VerificationEvidence

##### 7.20.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | package candidate 与验证证据 |
| 对象类型 | audit / evidence object |
| 主要责任 | 记录 candidate、smoke、docs example、compatibility 或边界验证的可复核证据 |

##### 7.20.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `evidence_id` | `VerificationEvidenceId` | 标识一条验证证据 |
| `candidate_ref` | `PackageCandidateRef` | 指向被验证的 package candidate |
| `evidence_kind` | `EvidenceKind` | 标识 smoke、docs example、compatibility、redaction 或 boundary 验证类别 |
| `result` | `EvidenceResult` | 表达 passed、failed、not verified 或 skipped 等结果 |
| `language_scope` | `LanguageSet` | 标识证据覆盖哪些语言 |
| `redaction_marker` | `RedactionAuditMarker` | 标识证据是否已脱敏 |
| `artifact_ref` | `EvidenceArtifactRef` | 指向外部证据产物位置 |

##### 7.20.3 状态集合

| 状态 | 作用 |
|---|---|
| `Passed` | 验证项通过 |
| `Failed` | 验证项失败 |
| `NotVerified` | 验证项未执行或无法形成结论 |
| `Skipped` | 验证项因范围裁剪被显式跳过 |
| `Redacted` | 证据已脱敏,但还需结合 result 判断验证结论 |

##### 7.20.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `assert_redacted(RedactionPolicy redaction_policy)` | 判断证据内容是否满足 redaction 要求 |
| `is_passing()` | 判断证据是否可支撑 candidate 通过 |
| `is_blocking()` | 判断证据是否阻塞 candidate 晋级 |
| `attach_artifact(EvidenceArtifactRef artifact_ref)` | 关联外部证据产物 |
| `mark_not_verified(VerificationReason reason)` | 标记证据无法形成验证结论 |

##### 7.20.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_validation_run(ValidationRun run)` | 从验证运行结果创建证据 |
| `from_docs_example_run(DocsExampleRun run)` | 从文档示例验证结果创建证据 |
| `redacted_copy(VerificationEvidence evidence, RedactionPolicy redaction_policy)` | 基于 redaction 策略创建脱敏证据 |

##### 7.20.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存原始正文 | 请求、响应、事件 payload、secret 和业务正文不能进入 evidence |
| 不把 skipped 当 passed | 跳过验证必须显式标注,不能支撑 verified |
| 不隐藏 fake 来源 | fake / fixture 验证必须在证据中显式可见 |

#### 7.21 CompatibilityDecision

##### 7.21.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 文档、兼容与演进 |
| 对象类型 | decision object |
| 主要责任 | 表达 SDK 版本、上游变化和跨语言 API 变化之间的兼容性判断 |

##### 7.21.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_id` | `CompatibilityDecisionId` | 标识一次兼容判断 |
| `baseline_ref` | `SdkBaselineId` | 指向被比较的 SDK 语义基线 |
| `candidate_ref` | `PackageCandidateRef` | 指向被判断的 candidate |
| `upstream_refs` | `UpstreamVersionRefSet` | 记录触发判断的上游版本 |
| `compatibility_level` | `CompatibilityLevel` | 表达 compatible、minor change、breaking 等兼容等级 |
| `evidence_refs` | `VerificationEvidenceRefSet` | 记录支撑判断的证据 |
| `migration_ref` | `MigrationGuideRef` | 指向需要阅读的迁移说明 |

##### 7.21.3 状态集合

| 状态 | 作用 |
|---|---|
| `Compatible` | 变化不破坏现有 SDK 使用方 |
| `RequiresMigration` | 变化需要使用方按迁移说明调整 |
| `Breaking` | 变化构成 breaking change,不能静默发布 |
| `PendingEvidence` | 证据不足,暂不能形成兼容结论 |
| `Rejected` | 候选变化被兼容治理拒绝 |

##### 7.21.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `requires_migration()` | 判断当前兼容结论是否需要迁移说明 |
| `is_blocking_release()` | 判断兼容结论是否阻塞 candidate 稳定化 |
| `attach_evidence(VerificationEvidence evidence)` | 将验证证据关联到兼容判断 |
| `attach_migration_guide(MigrationGuideRef migration_ref)` | 将迁移说明引用关联到判断 |
| `decide_from_changes(CompatibilityInput input)` | 根据变化输入生成兼容结论 |

##### 7.21.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_candidate(PackageCandidate candidate, SdkSemanticBaseline baseline)` | 从 candidate 和现有基线创建兼容判断 |
| `pending_evidence(PackageCandidate candidate, CompatibilityReason reason)` | 创建证据不足状态的兼容判断 |

##### 7.21.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代 ADR | 重大兼容取舍仍需按正式 ADR 或治理流程记录 |
| 不静默 breaking change | breaking change 必须显式阻塞或要求迁移 |
| 不只看单语言 | 兼容判断必须考虑跨语言语义一致性 |

#### 7.22 DeprecatedApiRecord

##### 7.22.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 文档、兼容与演进 |
| 对象类型 | domain record / state object |
| 主要责任 | 记录 SDK API、能力或语言表达进入 deprecated、迁移和退役过程的正式记录 |

##### 7.22.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `DeprecatedApiRecordId` | 标识一条 deprecated 记录 |
| `api_ref` | `SdkApiRef` | 指向被标记的 SDK API 或能力 |
| `deprecated_since` | `SemanticVersion` | 记录开始 deprecated 的 SDK 版本 |
| `planned_removal` | `RemovalPlanRef` | 记录计划移除版本或条件 |
| `replacement_ref` | `SdkApiRef` | 指向推荐替代 API 或能力 |
| `migration_ref` | `MigrationGuideRef` | 指向迁移说明 |
| `lifecycle` | `DeprecatedLifecycle` | 表达 deprecated 生命周期状态 |

##### 7.22.3 状态集合

| 状态 | 作用 |
|---|---|
| `Announced` | 已发布 deprecated 通知但仍可用 |
| `Deprecated` | API 已正式 deprecated,使用方应迁移 |
| `PendingRemoval` | API 已进入计划移除窗口 |
| `Removed` | API 已从 SDK 中移除 |
| `Superseded` | deprecated 记录被新的替代方案或决策覆盖 |

##### 7.22.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `announce(MigrationGuideRef migration_ref)` | 进入 announced 状态并绑定迁移说明 |
| `mark_deprecated(SemanticVersion deprecated_since)` | 将 API 正式标记为 deprecated |
| `schedule_removal(RemovalPlanRef removal_plan)` | 安排 API 移除计划 |
| `mark_removed(SemanticVersion removed_since)` | 标记 API 已移除 |
| `supersede(DeprecatedApiRecord next_record)` | 标记当前记录被后续记录替代 |

##### 7.22.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_record(SdkApiRef api_ref, MigrationGuideRef migration_ref)` | 为某 API 创建 deprecated 记录 |
| `rehydrate(DeprecatedApiRecordData record_data)` | 从持久化数据恢复 deprecated 记录 |

##### 7.22.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不静默移除 | 移除前必须有 deprecated 记录和迁移说明 |
| 不只标单语言 | 平台级 API deprecated 必须跨语言可见 |
| 不替代兼容判断 | deprecated 记录必须与 `CompatibilityDecision` 协同 |

#### 7.23 MigrationGuideRef

##### 7.23.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 文档、兼容与演进 |
| 对象类型 | reference object |
| 主要责任 | 引用 SDK 兼容变更、deprecated 或 breaking change 对应的迁移说明 |

##### 7.23.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `guide_id` | `MigrationGuideId` | 标识一份迁移说明 |
| `document_ref` | `DesignDocumentRef` | 指向迁移说明文档或章节 |
| `from_version` | `SemanticVersion` | 记录迁移起始版本 |
| `to_version` | `SemanticVersion` | 记录迁移目标版本 |
| `affected_api_refs` | `SdkApiRefSet` | 记录受影响的 API 或能力 |
| `language_scope` | `LanguageSet` | 标识迁移说明适用语言范围 |

##### 7.23.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `covers_api(SdkApiRef api_ref)` | 判断迁移说明是否覆盖某个 API |
| `covers_language(LanguageId language_id)` | 判断迁移说明是否适用于某语言 |
| `is_version_range(SemanticVersion from_version, SemanticVersion to_version)` | 判断迁移说明是否匹配指定版本区间 |

##### 7.23.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_document(DesignDocumentRef document_ref)` | 从文档引用创建迁移说明引用 |
| `for_deprecated_api(DeprecatedApiRecord deprecated_record)` | 从 deprecated 记录生成迁移说明引用 |

##### 7.23.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存迁移正文 | 本对象只保存引用和范围,不复制完整文档 |
| 不用模糊链接 | 引用必须能定位到具体文档或章节 |
| 不只覆盖单语言而冒充全局 | 语言范围必须明确 |

#### 7.24 与 Step 8 / Step 9 的反查清单

| 后续章节 | 必须能引用的对象 | 本步定义位置 | 反查结论 |
|---|---|---|---|
| Step 8 上游契约消费流 | `DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` | §7.6 ~ §7.9 | 已定义 |
| Step 8 服务 client 组装流 | `SdkSemanticBaseline`、`ClientCapabilityModel`、`ServiceClientView`、`ServiceCapabilityRef`、`BoundaryGuard` | §7.3 / §7.4 / §7.10 / §7.11 / §7.18 | 已定义 |
| Step 8 事件 client 组装流 | `BusEventClientView`、`EventSemanticMapping`、`TracePropagationPolicy`、`RedactionPolicy` | §7.12 / §7.13 / §7.15 / §7.16 | 已定义 |
| Step 8 candidate 验证流 | `PackageCandidate`、`VerificationEvidence`、`BoundaryGuard`、`CredentialProtectionPolicy` | §7.19 / §7.20 / §7.18 / §7.17 | 已定义 |
| Step 8 文档兼容流 | `CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef`、`VerificationEvidence` | §7.21 ~ §7.23 / §7.20 | 已定义 |
| Step 9 snapshot 状态机 | `SnapshotFreshnessState` | §7.9 | 已定义 |
| Step 9 candidate 状态机 | `PackageCandidate`、`VerificationEvidence` | §7.19 / §7.20 | 已定义 |
| Step 9 兼容和 deprecated 状态机 | `CompatibilityDecision`、`DeprecatedApiRecord` | §7.21 / §7.22 | 已定义 |

### 8. 回填草稿

正式 `02-概要设计.md` §6 “关键对象轮廓”直接摘录并润色本文件：

- §7.1 “对象候选池筛选说明”
- §7.2 “关键对象分布说明”
- §7.3 ~ §7.23 各关键对象独立小节
- §7.24 “与 Step 8 / Step 9 的反查清单”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

- 无阻塞进入 Step 7 的待确认事项。
- `CompatibilityPolicy` 当前不独立成节,在详细设计中可根据 `CompatibilityDecision` 的规则复杂度决定是否拆成独立 policy。
- `SdkCapabilityProjection`、`EvidenceProjection`、`CompatibilityProjection` 当前不独立成节,Step 7 和详细设计继续在查询接口和 projection 边界中展开。

### 10. 进入下一步条件

- 已从 Step 5 对象候选池完成对象正式化筛选。
- 已明确每个关键对象的所属部分、对象类型、主要责任、关键字段、状态、成员函数、工厂函数和禁止事项。
- 字段表均使用 `字段 / 类型 / 作用` 三列,字段类型均为概要设计层类型名。
- 成员函数和工厂函数参数均写明类型名和参数名。
- Step 8 / Step 9 预计使用的正式对象均能在本步找到定义。
- 未写完整 Rust struct / enum、完整协议 schema、数据库列、实现代码或详细调用链。
