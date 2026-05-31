# Step 6. 逐模块定义对象实现契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-sdk/03-详细设计.md` §5 模块实现契约中的对象实现契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_03_coding_runtime_constraints.md` | Rust 契约、中文 Rustdoc、真实源码英文、字段 / 函数必须写类型 | 作为对象、字段、enum variant 和公开函数写法约束 |
| `03_ddd_step_04_units_file_layout.md` | workspace 多 crate + 三语言 package 目录 | 作为对象落文件和模块归属依据 |
| `03_ddd_step_05_module_contracts_axis.md` | 16 个实现职责模块、模块依赖方向和代码主体归属映射 | 作为本步对象分组主轴 |
| `projects/L0-sdk/02-概要设计.md` §6 | 关键对象轮廓、字段骨架、成员函数和禁止事项 | 作为对象契约下沉的直接输入 |
| `projects/L0-sdk/02-概要设计.md` §9 | 状态主语、状态集合、允许推进主线状态和禁止迁移 | 作为状态 enum 和变体表输入 |
| `standards/document/详细设计书写规范.md` §5.5 | 对象小节、类型定义、字段表、函数表、enum 变体表格式 | 作为本步输出格式依据 |

已确认结论：

```text
Step 6 必须按 Step 5 的模块主轴逐模块展开对象。
每个正式领域对象必须独立成小节。
字段必须写类型、作用和约束。
函数必须写完整签名、参数类型、返回类型和副作用 / 不变量。
enum 必须写类型定义和变体表,每个 variant 必须有 Rustdoc 注释。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
Step 3 已确认编码、runtime、仓库、提交和安全边界约束。
Step 4 已确认 workspace 多 crate、三语言 package 目录和文件布局。
Step 5 已确认模块实现契约主轴和对象归属。
```

---

## 3. SOP 问题回答

### 3.1 每个模块中需要定义哪些 struct / enum / value object / service？

| 模块 | 本 Step 定义对象 | 后续 Step 承接 |
|---|---|---|
| `contracts` | 不在本 Step 定义 Command / Query / Event / Job DTO 细节；仅登记上下文和协议支撑对象后移 | Step 8 定义协议 schema |
| `domain_semantic` | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` | Step 10 校验语义状态影响 |
| `domain_upstream_view` | `DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` | Step 10 定义 freshness 转换矩阵 |
| `domain_service_client` | `ServiceClientView`、`ServiceCapabilityRef`、`CapabilitySupportState` | Step 10 定义 support 状态矩阵 |
| `domain_event_client` | `BusEventClientView`、`EventSemanticMapping` | Step 8 / Step 9 定义事件接口与处理流 |
| `domain_boundary_policy` | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` | Step 12 / Step 15 定义错误、审计和观测映射 |
| `domain_package_candidate` | `PackageCandidate`、`LanguageArtifact`、`PackageCandidateStatus` | Step 10 定义 candidate 状态矩阵 |
| `domain_evidence` | `VerificationEvidence`、`EvidenceResult`、`EvidenceRedactionStatus` | Step 10 / Step 15 定义证据状态与审计 |
| `domain_compatibility_evolution` | `CompatibilityDecision`、`CompatibilityDecisionState`、`DeprecatedApiRecord`、`DeprecatedApiLifecycleState`、`MigrationGuideRef` | Step 10 定义兼容与 deprecated 状态 |
| `application_services` | 只登记 service 名称和对象归属，不展开 port 字段全集 | Step 7 定义 port；Step 9 定义函数级处理流 |
| `application_ports` | 不在本 Step 定义 trait 方法 | Step 7 定义 trait / port / adapter 契约 |
| `infra_adapters` | 不在本 Step 定义 adapter / config 细节 | Step 7 / Step 11 / Step 14 定义 |
| `rust_client_facade` | `SdkClient`、`ServiceClient`、`EventClient`、`ClientContext` 的 public surface 对象骨架 | Step 8 / Step 9 定义 public API 和处理流 |
| `language_package_surface` | 不作为 SDK truth 对象展开 | Step 8 / Step 16 定义 package surface、artifact 和 smoke |
| `cli_entry` / `jobs` | 不在本 Step 定义 handler / runner 细节 | Step 8 / Step 9 定义 |

### 3.2 每个对象的主要责任和不变量是什么？

回答：见 §7.3~§7.11。每个对象独立成节，包含类型定义、成员变量、成员函数、工厂 / 静态函数、不变量与禁止事项。

### 3.3 每个字段的类型、作用和约束是什么？

回答：见每个对象的“成员变量”表。字段类型统一使用 Rust 类型名，不写裸字段名。

### 3.4 每个成员函数的完整签名、参数类型、返回类型和副作用是什么？

回答：见每个对象的“成员函数”表。所有函数签名必须写参数类型，例如 `assert_language_supported(&self, language_id: LanguageId) -> Result<(), SdkDomainError>`。

### 3.5 哪些函数是工厂函数或静态函数？

回答：见每个对象的“工厂 / 静态函数”表。所有工厂函数使用 `Type::function(Type 参数名)` 形式。

### 3.6 哪些状态 enum 需要写变体、允许来源和允许去向？

| 状态 enum | 所属模块 | 是否进入 Step 10 状态矩阵 |
|---|---|---|
| `SnapshotFreshnessState` | `domain_upstream_view` | 是 |
| `CapabilitySupportState` | `domain_service_client` | 是 |
| `PackageCandidateStatus` | `domain_package_candidate` | 是 |
| `EvidenceResult` | `domain_evidence` | 是 |
| `EvidenceRedactionStatus` | `domain_evidence` | 是 |
| `CompatibilityDecisionState` | `domain_compatibility_evolution` | 是 |
| `DeprecatedApiLifecycleState` | `domain_compatibility_evolution` | 是 |

### 3.7 每个 enum variant 的 Rustdoc 注释是什么？带载荷 variant 的载荷类型承载什么语义？

回答：见 §7.4、§7.5、§7.8、§7.9、§7.10。当前状态 enum 不使用带载荷 variant；错误 enum 的带载荷语义由 Step 12 定义。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 对象仍围绕 generated binding、client wrapper、subscription helper 和 release manifest | 无法支撑新版 semantic baseline、freshness、candidate evidence 和 compatibility 主线 |
| `02-概要设计.md` §6 | 已有对象轮廓，但不是 Rust struct / enum 契约 | 实现者仍需字段类型、函数签名、状态 enum 和不变量 |
| Step 5 | 已明确对象归属，但尚未逐对象展开 | Step 7~10 缺少稳定主语 |
| evidence 状态 | 概要中 `VerificationEvidence` 同时表达 result 和 redaction marker | 详细设计需要拆成 `EvidenceResult` 与 `EvidenceRedactionStatus`，但保持概要语义 |
| 三语言 package | 容易把 Python / TypeScript 对象写成第二套 truth | 需要明确它们只作为 package surface，不在 Step 6 拥有 domain truth |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象表达 | 概要级字段和函数骨架 | Rust struct / enum / policy 契约 | 支撑 1:1 实现 |
| 对象组织 | 关键对象按主要组成部分列举 | 按 Step 5 实现职责模块逐对象展开 | 保持详细设计与文件布局一致 |
| 状态表达 | 状态名和禁止迁移 | enum 代码块 + variant Rustdoc + 变体表 | 支撑状态机与测试 |
| evidence 表达 | result 与 redaction marker 混在 `VerificationEvidence` | 拆成 `EvidenceResult` 与 `EvidenceRedactionStatus` | 保持 passed / failed 与 redacted / unredacted 语义独立 |
| client surface | Rust / Python / TypeScript 容易并列成 truth | Rust client facade 给对象骨架；Python / TS 后移到 package surface / smoke | 避免三套 truth |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：本 Step 定义所有 DTO、port、handler、adapter 和 job runner | 看似完整 | 会重复 Step 7 / Step 8 / Step 9 / Step 14，且协议 schema 尚未收口 | 不采用 |
| 方案 B：本 Step 完整定义 domain 对象和 Rust client facade 核心对象，DTO / port / adapter / handler 后移 | 聚焦 truth、状态和 public client 主语，避免重复 | 需要后续 Step 严格补齐协议和端口 | 采用 |
| 方案 C：只列对象索引，不写 struct / enum 片段 | 文件短 | 不满足“可直接写 Rust 类型和 impl”的要求 | 不采用 |
| 方案 D：Python / TypeScript 也按 Rust struct 等量展开 | 看似三语言完整 | 会让语言 package 拥有 SDK truth，且超出 Rust 实现契约主线 | 不采用 |

推荐方案：方案 B。

原因：

- Step 5 已确认 `domain_*` 和 `rust_client_facade` 是本步最需要下沉的对象主语。
- DTO、port、adapter、handler 和 job runner 在后续 Step 有专门章节，提前展开会制造冲突。
- 拆分 evidence result 与 redaction status 能消除“redacted 等于 passed”的误读。

---

## 7. 结构化中间产物

### 7.1 对象定义范围表

| 模块 | 本 Step 输出 |
|---|---|
| `contracts` | 只登记上下文 / metadata / receipt 等支撑对象后移到 Step 8，不展开 Command / Query / Event / Job schema |
| `domain_semantic` | 完整定义语义基线、能力模型和跨语言概念映射对象 |
| `domain_upstream_view` | 完整定义派生视图、语言视图、上游版本引用和 freshness 状态 |
| `domain_service_client` | 完整定义服务 client view、capability ref 和 support 状态 |
| `domain_event_client` | 完整定义 bus event client view 和 event semantic mapping |
| `domain_boundary_policy` | 完整定义横切 policy 和 guard |
| `domain_package_candidate` | 完整定义 package candidate、language artifact 和 candidate 状态 |
| `domain_evidence` | 完整定义 verification evidence、evidence result 和 redaction status |
| `domain_compatibility_evolution` | 完整定义 compatibility、deprecated 和 migration ref |
| `application_services` | 登记 service 对象名，字段与函数由 Step 7 / Step 9 补齐 |
| `rust_client_facade` | 定义 Rust public client surface 的对象骨架 |
| `language_package_surface`、`cli_entry`、`jobs` | 后移到 Step 8 / Step 9 / Step 16 |

### 7.2 基础值对象归属表

| 类型族 | 归属建议 | 实现口径 |
|---|---|---|
| `*Id` | 拥有该对象的 domain 文件 | 使用 newtype，例如 `pub struct PackageCandidateId(String);` |
| `*Ref` | 引用目标所属文件；来自 core / bus 的 ref 使用上游 contracts 类型 | 只保存引用，不复制正文 |
| `*Status` / `*State` | 拥有状态的 domain 对象文件 | 必须写 enum 代码块和变体表 |
| `Timestamp` | 优先使用 `core-contracts` 时间值对象 | 不直接使用裸字符串 |
| `ActorContext` / `TraceContextRef` | 优先来自 `core-contracts` 或本仓轻量 wrapper | 不做认证授权实现 |
| `LanguageId` / `SdkConceptId` / `ClientCapabilityId` | `domain_semantic` | 使用 newtype，避免裸 `String` 扩散 |
| `ArtifactRef` / `DiagnosticRef` | `domain_evidence` 或 `domain_package_candidate` | 只保存引用，不保存 raw artifact body |

### 7.3 `domain_semantic` 对象实现契约

#### 7.3.1 `SdkSemanticBaseline`

##### 类型定义

```rust
/// SDK 共同语义基线。
///
/// 该对象维护 Rust / Python / TypeScript 官方 SDK 必须共同遵守的平台语义、
/// 能力模型、概念映射和上游版本引用,不保存任何上游契约正文或服务端业务事实。
pub struct SdkSemanticBaseline {
    /// 语义基线唯一标识。
    pub baseline_id: SdkBaselineId,

    /// 当前语义基线版本。
    pub baseline_version: SdkBaselineVersion,

    /// 本基线支持的语言集合。
    pub supported_languages: Vec<LanguageId>,

    /// 当前可暴露 SDK 能力模型。
    pub capability_model: ClientCapabilityModel,

    /// Rust / Python / TypeScript 概念映射。
    pub concept_map: CrossLanguageConceptMap,

    /// 本基线引用的上游 core / bus / formal API 版本。
    pub upstream_refs: Vec<UpstreamVersionRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `baseline_id` | `SdkBaselineId` | 标识一条共同语义基线 | 系统生成，不复用 |
| `baseline_version` | `SdkBaselineVersion` | 表达语义基线版本 | 单调递增，不等同 package version |
| `supported_languages` | `Vec<LanguageId>` | 支持语言集合 | P0 必须覆盖 Rust / Python / TypeScript |
| `capability_model` | `ClientCapabilityModel` | SDK 能力可暴露性模型 | 必须与 concept map 一致 |
| `concept_map` | `CrossLanguageConceptMap` | 跨语言概念映射 | 不允许语言目录单独定义平台语义 |
| `upstream_refs` | `Vec<UpstreamVersionRef>` | 上游版本引用 | 只保存引用，不复制正文 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_language_supported(&self, language_id: LanguageId) -> Result<(), SdkDomainError>` | 校验语言是否进入基线 | `language_id` 是待校验语言 | `Result<(), SdkDomainError>` | 只读，不修改状态 |
| `assert_capability_supported(&self, capability_id: ClientCapabilityId) -> Result<(), SdkDomainError>` | 校验能力是否可暴露 | `capability_id` 是 SDK 能力标识 | `Result<(), SdkDomainError>` | 必须委托 `capability_model` |
| `assert_no_cross_language_drift(&self) -> Result<(), SdkDomainError>` | 校验三语言概念无漂移 | 无 | `Result<(), SdkDomainError>` | 必须委托 `concept_map` |
| `derive_next(&self, change: SdkBaselineChange, actor: ActorContext, now: Timestamp) -> Result<SdkSemanticBaseline, SdkDomainError>` | 派生下一版语义基线 | `change` 是已批准变更 | 新 `SdkSemanticBaseline` | 不修改旧基线 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `SdkSemanticBaseline::create(initial: SdkSemanticBaselineSpec, actor: ActorContext, now: Timestamp) -> Result<SdkSemanticBaseline, SdkDomainError>` | 创建初始语义基线 | `initial` 包含语言、能力、概念和上游引用 | `SdkSemanticBaseline` | 初始化 SDK 官方语义 |
| `SdkSemanticBaseline::rehydrate(row: SdkSemanticBaselineRow) -> Result<SdkSemanticBaseline, SdkDomainError>` | 从持久化记录恢复对象 | `row` 是 repository 读取结果 | `SdkSemanticBaseline` | repository 恢复 |

##### 不变量与禁止事项

- `supported_languages` P0 不得缺少 Rust / Python / TypeScript。
- `concept_map` 中每个 supported capability 必须能映射到所有 supported language。
- `upstream_refs` 只保存版本 / snapshot / digest 引用，不保存上游正文。
- 不能读取配置、调用生成器、调用服务端 API 或发布事件。

#### 7.3.2 `ClientCapabilityModel`

##### 类型定义

```rust
/// 官方 SDK 能力模型。
///
/// 该对象表达哪些平台能力可以通过 SDK 暴露,哪些能力明确不支持或等待上游边界稳定。
pub struct ClientCapabilityModel {
    /// 能力模型唯一标识。
    pub model_id: CapabilityModelId,

    /// 已支持能力集合。
    pub supported_capabilities: Vec<ClientCapabilityId>,

    /// 不支持能力集合和原因。
    pub unsupported_capabilities: Vec<UnsupportedCapability>,

    /// 能力来源引用,指向 core / bus / formal API 或文档证据。
    pub capability_sources: Vec<CapabilitySourceRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `model_id` | `CapabilityModelId` | 标识能力模型 | 系统生成 |
| `supported_capabilities` | `Vec<ClientCapabilityId>` | 可暴露 SDK 能力 | 每项必须有来源引用 |
| `unsupported_capabilities` | `Vec<UnsupportedCapability>` | 明确不支持能力 | 必须带 reason |
| `capability_sources` | `Vec<CapabilitySourceRef>` | 能力来源 | 不得指向服务仓源码 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `supports(&self, capability_id: ClientCapabilityId) -> bool` | 判断能力是否支持 | `capability_id` 是待查询能力 | `bool` | 只读 |
| `requires_formal_boundary(&self, capability_id: ClientCapabilityId) -> Result<bool, SdkDomainError>` | 判断能力是否必须绑定 formal API | `capability_id` 是能力标识 | `Result<bool, SdkDomainError>` | unsupported 时返回错误 |
| `mark_unsupported(&mut self, capability_id: ClientCapabilityId, reason: UnsupportedReason) -> Result<(), SdkDomainError>` | 标记能力不支持 | `reason` 说明不支持原因 | `Result<(), SdkDomainError>` | 从 supported 移除同名能力 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ClientCapabilityModel::from_sources(sources: Vec<CapabilitySourceRef>) -> Result<ClientCapabilityModel, SdkDomainError>` | 从来源引用构建能力模型 | `sources` 是上游和 formal API 引用 | `ClientCapabilityModel` | 更新语义基线 |

##### 不变量与禁止事项

- 同一 `ClientCapabilityId` 不得同时出现在 supported 和 unsupported。
- `supported_capabilities` 不得依赖 fake-only 证据宣称生产可用。
- 不保存服务端业务事实，不执行服务能力调用。

#### 7.3.3 `CrossLanguageConceptMap`

##### 类型定义

```rust
/// 跨语言概念映射。
///
/// 该对象维护同一 SDK 概念在 Rust / Python / TypeScript 中的名称、形态和语义约束,
/// 允许语言 idiomatic 表达,但不允许平台语义漂移。
pub struct CrossLanguageConceptMap {
    /// 概念映射唯一标识。
    pub map_id: ConceptMapId,

    /// 概念映射条目。
    pub concept_entries: Vec<ConceptMappingEntry>,

    /// 该映射覆盖的语言集合。
    pub language_set: Vec<LanguageId>,

    /// 语义所有者引用。
    pub semantic_owner: SemanticOwnerRef,

    /// 已检测到的漂移标记。
    pub drift_markers: Vec<ConceptDriftMarker>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `map_id` | `ConceptMapId` | 标识概念映射 | 系统生成 |
| `concept_entries` | `Vec<ConceptMappingEntry>` | 记录每个概念的语言表达 | 每个 supported language 必须有 entry |
| `language_set` | `Vec<LanguageId>` | 映射覆盖语言集合 | 必须与 baseline 支持语言一致 |
| `semantic_owner` | `SemanticOwnerRef` | 指向语义所有者 | 不得指向语言 package |
| `drift_markers` | `Vec<ConceptDriftMarker>` | 记录漂移风险 | 非空时不能支撑 stable candidate |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `map_concept(&self, concept_id: SdkConceptId, language_id: LanguageId) -> Result<LanguageSymbolRef, SdkDomainError>` | 查找某语言概念表达 | `concept_id` 是平台概念；`language_id` 是目标语言 | `LanguageSymbolRef` | 只读 |
| `assert_no_drift(&self, language_id: LanguageId, concept_id: SdkConceptId) -> Result<(), SdkDomainError>` | 校验指定概念无漂移 | 指定语言和概念 | `Result<(), SdkDomainError>` | 只读 |
| `register_drift(&mut self, marker: ConceptDriftMarker) -> Result<(), SdkDomainError>` | 登记漂移标记 | `marker` 说明漂移来源 | `Result<(), SdkDomainError>` | 会阻断 stable candidate |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `CrossLanguageConceptMap::create(entries: Vec<ConceptMappingEntry>, language_set: Vec<LanguageId>, owner: SemanticOwnerRef) -> Result<CrossLanguageConceptMap, SdkDomainError>` | 创建概念映射 | `entries`、`language_set`、`owner` | `CrossLanguageConceptMap` | 初始化或更新语义基线 |

##### 不变量与禁止事项

- `concept_entries` 必须覆盖 `language_set` 中所有语言。
- language package 可以提供表达，但不能成为 `semantic_owner`。
- 存在 blocking drift marker 时不得生成 verified / stable candidate。

### 7.4 `domain_upstream_view` 对象实现契约

#### 7.4.1 `UpstreamVersionRef`

##### 类型定义

```rust
/// 上游版本引用。
///
/// 该对象记录 SDK 当前观察到的 core、bus 或 formal API 来源版本,只保存引用和摘要,
/// 不保存上游契约正文、事件 payload 或服务端业务正文。
pub struct UpstreamVersionRef {
    /// 上游来源类别。
    pub source_kind: UpstreamSourceKind,

    /// 上游来源标识。
    pub source_id: UpstreamSourceId,

    /// 上游版本号。
    pub version: UpstreamVersion,

    /// 上游 snapshot 或契约摘要。
    pub digest: ContentDigest,

    /// SDK 观察到该版本的时间。
    pub observed_at: Timestamp,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `source_kind` | `UpstreamSourceKind` | 区分 core / bus / formal API | 不得写成 service 仓源码路径 |
| `source_id` | `UpstreamSourceId` | 标识来源 | 与 `source_kind` 共同唯一 |
| `version` | `UpstreamVersion` | 上游版本 | 必须可排序或可比较 |
| `digest` | `ContentDigest` | 上游内容摘要 | 只保存摘要，不保存正文 |
| `observed_at` | `Timestamp` | 观察时间 | 来自 clock port |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `matches(&self, other_ref: UpstreamVersionRef) -> bool` | 判断是否同一上游版本 | `other_ref` 是待比较引用 | `bool` | 只读 |
| `is_newer_than(&self, other_ref: UpstreamVersionRef) -> Result<bool, SdkDomainError>` | 判断是否更新 | `other_ref` 是基准引用 | `Result<bool, SdkDomainError>` | 不同来源不可比较 |
| `requires_refresh(&self, latest_ref: UpstreamVersionRef) -> Result<bool, SdkDomainError>` | 判断是否需要刷新 | `latest_ref` 是最新引用 | `Result<bool, SdkDomainError>` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `UpstreamVersionRef::from_snapshot(source_kind: UpstreamSourceKind, snapshot_ref: SnapshotRef, digest: ContentDigest, observed_at: Timestamp) -> Result<UpstreamVersionRef, SdkDomainError>` | 从上游 snapshot 构造引用 | 包含来源、snapshot、摘要和时间 | `UpstreamVersionRef` | freshness check |

##### 不变量与禁止事项

- 不保存上游 schema、payload、response body 或服务端业务正文。
- 不同 `source_kind` 的引用不能直接比较新旧。
- 不能用本地配置伪造上游版本。

#### 7.4.2 `SnapshotFreshnessState`

##### 类型定义

```rust
/// 派生视图的新鲜度状态。
///
/// 该枚举判断 SDK 派生视图是否可用于 package candidate。只有 `Fresh` 可以支撑 candidate。
pub enum SnapshotFreshnessState {
    /// 已对齐当前已知上游版本,可用于 candidate。
    Fresh,

    /// 已发现上游变化,等待刷新或验证。
    PendingRefresh,

    /// 本地派生视图落后于上游版本。
    Stale,

    /// 上游变化当前无法派生或不进入 SDK 范围。
    Unsupported,

    /// 无法确认上游版本或检查结果缺失。
    Unknown,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Fresh` | `/// 已对齐当前已知上游版本,可用于 candidate。` | 支撑 candidate 生成 | `PendingRefresh`、`Stale`、`Unknown` | `PendingRefresh`、`Stale` |
| `PendingRefresh` | `/// 已发现上游变化,等待刷新或验证。` | 暂停 candidate | `Fresh`、`Stale`、`Unknown` | `Fresh`、`Stale`、`Unsupported` |
| `Stale` | `/// 本地派生视图落后于上游版本。` | 阻断 verified / stable | `Fresh`、`PendingRefresh`、`Unknown` | `PendingRefresh`、`Fresh` |
| `Unsupported` | `/// 上游变化当前无法派生或不进入 SDK 范围。` | 显式裁剪 | `PendingRefresh`、`Unknown` | `PendingRefresh` |
| `Unknown` | `/// 无法确认上游版本或检查结果缺失。` | 保守阻断 | 初始 / 检查失败 | `PendingRefresh`、`Fresh`、`Unsupported` |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_usable_for_candidate(&self) -> bool` | 判断是否可用于 candidate | 无 | `bool` | 只有 `Fresh` 返回 true |
| `can_transition_to(&self, target: SnapshotFreshnessState) -> bool` | 判断状态迁移是否合法 | `target` 是目标状态 | `bool` | 只读，完整矩阵在 Step 10 复核 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `SnapshotFreshnessState::initial_unknown() -> SnapshotFreshnessState` | 初始未知状态 | 无 | `SnapshotFreshnessState` | 初次创建派生视图 |

##### 不变量与禁止事项

- `Fresh` 不能由配置开关直接伪造。
- `Unsupported` 和 `Unknown` 不得支撑 verified / stable candidate。
- Query 不得触发状态迁移。

#### 7.4.3 `DerivedBindingView`

##### 类型定义

```rust
/// SDK 派生 binding 视图。
///
/// 该对象表达从 core、bus 和 formal API 派生出的 SDK 可消费能力视图,
/// 只保存符号、引用和 freshness,不复制上游契约正文。
pub struct DerivedBindingView {
    /// 派生视图唯一标识。
    pub view_id: DerivedViewId,

    /// 参与派生的上游来源引用。
    pub source_refs: Vec<UpstreamVersionRef>,

    /// 当前派生视图的新鲜度状态。
    pub freshness_state: SnapshotFreshnessState,

    /// 可进入 SDK 能力模型的符号集合。
    pub capability_symbols: Vec<CapabilitySymbol>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `view_id` | `DerivedViewId` | 标识派生视图 | 系统生成 |
| `source_refs` | `Vec<UpstreamVersionRef>` | 上游版本引用 | 必须覆盖本视图涉及来源 |
| `freshness_state` | `SnapshotFreshnessState` | 视图可用性 | 只有 `Fresh` 可用于 candidate |
| `capability_symbols` | `Vec<CapabilitySymbol>` | 派生出的能力符号 | 不等同 public client surface |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_fresh(&self) -> Result<(), SdkDomainError>` | 校验视图新鲜 | 无 | `Result<(), SdkDomainError>` | stale / unknown / unsupported 返回错误 |
| `contains_capability(&self, capability_id: ClientCapabilityId) -> bool` | 判断是否包含能力 | `capability_id` 是 SDK 能力标识 | `bool` | 只读 |
| `mark_freshness(&mut self, state: SnapshotFreshnessState) -> Result<(), SdkDomainError>` | 更新 freshness | `state` 是目标状态 | `Result<(), SdkDomainError>` | 必须符合状态迁移 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DerivedBindingView::from_upstream_snapshots(refs: Vec<UpstreamVersionRef>, symbols: Vec<CapabilitySymbol>) -> Result<DerivedBindingView, SdkDomainError>` | 从上游引用和符号创建派生视图 | `refs` 和 `symbols` | `DerivedBindingView` | `RefreshDerivedBindingView` |

##### 不变量与禁止事项

- 不复制 core / bus / formal API 正文。
- `capability_symbols` 不能绕过 `ClientCapabilityModel` 直接暴露给 package。
- stale / unsupported / unknown 视图不得生成 verified candidate。

#### 7.4.4 `LanguageBindingView`

##### 类型定义

```rust
/// 单语言 binding 视图。
///
/// 该对象表达某一种语言对 `DerivedBindingView` 的 idiomatic 投影,
/// 但不得改变 SDK 平台语义。
pub struct LanguageBindingView {
    /// 目标语言。
    pub language_id: LanguageId,

    /// 来源派生视图标识。
    pub derived_view_id: DerivedViewId,

    /// 平台符号到语言符号的映射。
    pub symbol_map: Vec<LanguageSymbolMapping>,

    /// 单语言视图的新鲜度状态。
    pub freshness_state: SnapshotFreshnessState,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `language_id` | `LanguageId` | 目标语言 | P0 为 Rust / Python / TypeScript |
| `derived_view_id` | `DerivedViewId` | 来源派生视图 | 必须存在且 fresh |
| `symbol_map` | `Vec<LanguageSymbolMapping>` | 语言符号映射 | 必须可由 concept map 校验 |
| `freshness_state` | `SnapshotFreshnessState` | 单语言投影新鲜度 | 不得比来源视图更乐观 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_semantic_alignment(&self, concept_map: CrossLanguageConceptMap) -> Result<(), SdkDomainError>` | 校验语言视图语义对齐 | `concept_map` 是共同概念映射 | `Result<(), SdkDomainError>` | 只读 |
| `symbol_for(&self, capability_id: ClientCapabilityId) -> Result<LanguageSymbolRef, SdkDomainError>` | 查询某能力语言符号 | `capability_id` 是能力标识 | `LanguageSymbolRef` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `LanguageBindingView::derive_for_language(view: DerivedBindingView, language_id: LanguageId, concept_map: CrossLanguageConceptMap) -> Result<LanguageBindingView, SdkDomainError>` | 从共同派生视图生成语言视图 | `view`、`language_id`、`concept_map` | `LanguageBindingView` | package build 前 |

##### 不变量与禁止事项

- 不允许语言视图新增未在 `DerivedBindingView` 中出现的能力。
- 不允许语言 idiomatic 表达改变平台概念含义。
- 不直接读取 package 目录或生成器输出。

### 7.5 `domain_service_client` 与 `domain_event_client` 对象实现契约

#### 7.5.1 `CapabilitySupportState`

##### 类型定义

```rust
/// 服务能力支持状态。
///
/// 该枚举表达某个服务能力是否可以作为正式 SDK 能力暴露。
pub enum CapabilitySupportState {
    /// 能力具备正式 API 且可进入 SDK candidate。
    Supported,

    /// 能力只能通过 fake 或 fixture 目标验证,不得宣称生产可用。
    FakeOnly,

    /// 能力边界或上游契约尚未确认。
    Pending,

    /// 能力明确不进入当前 SDK 范围。
    Unsupported,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Supported` | `/// 能力具备正式 API 且可进入 SDK candidate。` | 可进入正式 SDK 能力 | `Pending` | `Pending`、`Unsupported` |
| `FakeOnly` | `/// 能力只能通过 fake 或 fixture 目标验证,不得宣称生产可用。` | 最小接入验证 | `Pending`、`Unsupported` | `Supported`、`Unsupported` |
| `Pending` | `/// 能力边界或上游契约尚未确认。` | 暂缓暴露 | 初始、`Supported`、`FakeOnly` | `Supported`、`FakeOnly`、`Unsupported` |
| `Unsupported` | `/// 能力明确不进入当前 SDK 范围。` | 显式裁剪 | `Pending`、`FakeOnly` | `Pending`、`FakeOnly` |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_production_supported(&self) -> bool` | 判断是否生产可用 | 无 | `bool` | 只有 `Supported` 返回 true |
| `is_candidate_blocking(&self) -> bool` | 判断是否阻断 stable | 无 | `bool` | `FakeOnly` / `Pending` / `Unsupported` 返回 true |
| `can_transition_to(&self, target: CapabilitySupportState) -> bool` | 判断状态迁移 | `target` 是目标状态 | `bool` | 完整矩阵由 Step 10 复核 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `CapabilitySupportState::initial_pending() -> CapabilitySupportState` | 初始 pending | 无 | `CapabilitySupportState` | 新能力发现 |

##### 不变量与禁止事项

- `FakeOnly` 不得被 package candidate 当成生产可用能力。
- `Supported` 必须有 formal API 或等价正式边界引用支撑。

#### 7.5.2 `ServiceCapabilityRef`

##### 类型定义

```rust
/// 服务能力引用。
///
/// 该对象指向 formal API 背后的服务能力,用于 SDK 判断是否可以封装调用入口。
pub struct ServiceCapabilityRef {
    /// 服务能力标识。
    pub capability_id: ClientCapabilityId,

    /// formal API 引用。
    pub formal_api_ref: Option<FormalApiRef>,

    /// fake 或 fixture 验证目标引用。
    pub fake_boundary_ref: Option<FakeBoundaryRef>,

    /// 能力支持状态。
    pub support_state: CapabilitySupportState,

    /// 边界类别。
    pub boundary_kind: ServiceBoundaryKind,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `capability_id` | `ClientCapabilityId` | 标识 SDK 能力 | 必须存在于能力模型 |
| `formal_api_ref` | `Option<FormalApiRef>` | 指向正式服务边界 | `Supported` 必须有值 |
| `fake_boundary_ref` | `Option<FakeBoundaryRef>` | 指向 fake / fixture 目标 | 仅证明最小接入 |
| `support_state` | `CapabilitySupportState` | 支持状态 | 不得由配置绕过 |
| `boundary_kind` | `ServiceBoundaryKind` | 边界类型 | 不得表示服务仓源码依赖 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_supported(&self) -> bool` | 判断是否正式支持 | 无 | `bool` | 只有 `Supported` 返回 true |
| `requires_formal_api(&self) -> bool` | 判断是否需要 formal API | 无 | `bool` | `Supported` 必须 true |
| `assert_callable(&self) -> Result<(), SdkDomainError>` | 校验是否允许调用 | 无 | `Result<(), SdkDomainError>` | `Unsupported` / `Pending` 返回错误 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ServiceCapabilityRef::from_formal_api(capability_id: ClientCapabilityId, formal_api_ref: FormalApiRef) -> Result<ServiceCapabilityRef, SdkDomainError>` | 从 formal API 构造正式能力引用 | 能力和 formal API 引用 | `ServiceCapabilityRef` | formal API changed |
| `ServiceCapabilityRef::fake_only(capability_id: ClientCapabilityId, fake_ref: FakeBoundaryRef) -> Result<ServiceCapabilityRef, SdkDomainError>` | 构造 fake-only 能力引用 | 能力和 fake 引用 | `ServiceCapabilityRef` | smoke / docs 验证 |

##### 不变量与禁止事项

- `Supported` 必须绑定 `formal_api_ref`。
- `FakeOnly` 不能支撑生产可用声明。
- 不能保存服务端业务对象正文。

#### 7.5.3 `ServiceClientView`

##### 类型定义

```rust
/// SDK 服务能力 client 视图。
///
/// 该对象表达 SDK 当前可向调用方暴露哪些服务能力、这些能力来自哪些 formal API 或 fake boundary。
pub struct ServiceClientView {
    /// 服务 client 视图标识。
    pub service_view_id: ServiceViewId,

    /// 服务能力引用集合。
    pub capability_refs: Vec<ServiceCapabilityRef>,

    /// 视图新鲜度状态。
    pub freshness_state: SnapshotFreshnessState,

    /// 运行期边界引用集合。
    pub boundary_refs: Vec<ServiceBoundaryRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `service_view_id` | `ServiceViewId` | 标识服务 client 视图 | 系统生成 |
| `capability_refs` | `Vec<ServiceCapabilityRef>` | 可见服务能力 | 必须来自能力模型和 formal / fake 边界 |
| `freshness_state` | `SnapshotFreshnessState` | 视图新鲜度 | 非 `Fresh` 阻断 candidate |
| `boundary_refs` | `Vec<ServiceBoundaryRef>` | 运行边界引用 | 不得包含服务仓源码路径 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_capability_supported(&self, capability_ref: ServiceCapabilityRef) -> Result<(), SdkDomainError>` | 校验能力可调用 | `capability_ref` 是服务能力引用 | `Result<(), SdkDomainError>` | 只读 |
| `requires_fake_boundary(&self, capability_ref: ServiceCapabilityRef) -> Result<bool, SdkDomainError>` | 判断是否 fake-only | `capability_ref` 是服务能力引用 | `Result<bool, SdkDomainError>` | 只读 |
| `supported_capabilities(&self) -> Vec<ClientCapabilityId>` | 列出正式支持能力 | 无 | `Vec<ClientCapabilityId>` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ServiceClientView::from_capabilities(refs: Vec<ServiceCapabilityRef>, freshness_state: SnapshotFreshnessState) -> Result<ServiceClientView, SdkDomainError>` | 从能力引用构造服务视图 | 能力引用和 freshness | `ServiceClientView` | Refresh / formal API changed |

##### 不变量与禁止事项

- 服务视图不拥有服务端业务 truth。
- Query 可读取视图，但不能触发 refresh。
- fake-only 能力不能进入 production supported 列表。

#### 7.5.4 `BusEventClientView`

##### 类型定义

```rust
/// Bus 事件客户端视图。
///
/// 该对象表达 SDK 可封装的 L0-bus 事件能力,但不拥有 publication、delivery、retry 或 replay truth。
pub struct BusEventClientView {
    /// 事件 client 视图标识。
    pub event_view_id: EventViewId,

    /// SDK 事件语义映射集合。
    pub mapping_set: Vec<EventSemanticMapping>,

    /// 事件视图新鲜度。
    pub freshness_state: SnapshotFreshnessState,

    /// 支持的事件 client 操作。
    pub supported_operations: Vec<EventClientOperation>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `event_view_id` | `EventViewId` | 标识事件视图 | 系统生成 |
| `mapping_set` | `Vec<EventSemanticMapping>` | SDK 事件到 bus semantic 的映射 | 必须对齐 `bus-contracts` |
| `freshness_state` | `SnapshotFreshnessState` | 视图新鲜度 | 非 `Fresh` 阻断 candidate |
| `supported_operations` | `Vec<EventClientOperation>` | 支持操作 | P0 不重定义 bus runtime |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `supports_operation(&self, operation: EventClientOperation) -> bool` | 判断操作是否支持 | `operation` 是事件操作 | `bool` | 只读 |
| `assert_bus_semantic_aligned(&self, semantic_ref: BusSemanticRef) -> Result<(), SdkDomainError>` | 校验 bus semantic 对齐 | `semantic_ref` 是 bus 语义引用 | `Result<(), SdkDomainError>` | 不读取 bus runtime |
| `mapping_for(&self, sdk_event_name: SdkEventName) -> Result<EventSemanticMapping, SdkDomainError>` | 查找事件映射 | `sdk_event_name` 是 SDK 事件名 | `EventSemanticMapping` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `BusEventClientView::from_bus_semantics(mappings: Vec<EventSemanticMapping>, freshness_state: SnapshotFreshnessState) -> Result<BusEventClientView, SdkDomainError>` | 从 bus semantic 构造事件视图 | 映射集合和 freshness | `BusEventClientView` | bus semantic changed |

##### 不变量与禁止事项

- 不实现 publication / delivery / retry / replay truth。
- 不保存事件 payload 正文。
- 事件视图只封装 SDK client 体验。

#### 7.5.5 `EventSemanticMapping`

##### 类型定义

```rust
/// SDK 事件表达到 L0-bus 语义的映射。
pub struct EventSemanticMapping {
    /// SDK 侧事件名。
    pub sdk_event_name: SdkEventName,

    /// L0-bus 语义标识。
    pub bus_semantic_id: BusSemanticId,

    /// 对应事件 client 操作。
    pub operation: EventClientOperation,

    /// 映射版本。
    pub mapping_version: MappingVersion,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `sdk_event_name` | `SdkEventName` | SDK 事件名 | 不得替代 bus semantic |
| `bus_semantic_id` | `BusSemanticId` | bus 语义引用 | 必须来自 `bus-contracts` |
| `operation` | `EventClientOperation` | 事件操作 | publish / subscribe 等 client 视图操作 |
| `mapping_version` | `MappingVersion` | 映射版本 | 上游变化后可更新 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `matches_sdk_event(&self, sdk_event_name: SdkEventName) -> bool` | 判断是否匹配 SDK 事件名 | `sdk_event_name` 是待匹配事件名 | `bool` | 只读 |
| `assert_bus_semantic(&self, bus_semantic_id: BusSemanticId) -> Result<(), SdkDomainError>` | 校验 bus 语义一致 | `bus_semantic_id` 是目标语义 | `Result<(), SdkDomainError>` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `EventSemanticMapping::create(sdk_event_name: SdkEventName, bus_semantic_id: BusSemanticId, operation: EventClientOperation) -> Result<EventSemanticMapping, SdkDomainError>` | 创建事件语义映射 | SDK 事件、bus 语义和操作 | `EventSemanticMapping` | 事件视图刷新 |

##### 不变量与禁止事项

- 不能把 SDK 事件名当成 bus truth。
- 不能为未知 bus semantic 创建 mapping。

### 7.6 `domain_boundary_policy` 对象实现契约

#### 7.6.1 `ErrorMappingPolicy`

##### 类型定义

```rust
/// SDK 错误映射策略。
///
/// 该策略维护上游错误、边界错误和 SDK public error 在三语言中的一致表达。
pub struct ErrorMappingPolicy {
    /// 策略标识。
    pub policy_id: PolicyId,

    /// 上游错误到 SDK 错误种类的映射。
    pub error_kind_map: Vec<ErrorKindMapping>,

    /// 三语言错误形态定义。
    pub language_shapes: Vec<LanguageErrorShape>,

    /// 关联的脱敏规则引用。
    pub redaction_rule_ref: RedactionRuleRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `policy_id` | `PolicyId` | 标识错误映射策略 | 系统生成 |
| `error_kind_map` | `Vec<ErrorKindMapping>` | 映射错误分类 | 不保存 raw error body |
| `language_shapes` | `Vec<LanguageErrorShape>` | 语言侧错误外形 | 必须覆盖三语言 |
| `redaction_rule_ref` | `RedactionRuleRef` | 脱敏规则引用 | 映射前必须脱敏 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `map_source_error(&self, source_error: SourceErrorDescriptor) -> Result<SdkErrorDescriptor, SdkDomainError>` | 映射来源错误 | `source_error` 是脱敏后的来源错误描述 | `SdkErrorDescriptor` | 不保留 raw body |
| `assert_language_shape(&self, language_id: LanguageId, error_kind: SdkErrorKind) -> Result<(), SdkDomainError>` | 校验语言错误形态 | 语言和错误种类 | `Result<(), SdkDomainError>` | 只读 |
| `requires_redaction(&self, source_error: SourceErrorDescriptor) -> bool` | 判断是否必须脱敏 | 来源错误描述 | `bool` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ErrorMappingPolicy::create(spec: ErrorMappingPolicySpec) -> Result<ErrorMappingPolicy, SdkDomainError>` | 创建策略 | `spec` 是策略定义 | `ErrorMappingPolicy` | 初始化横切默认 |

##### 不变量与禁止事项

- 不能输出生产请求 / 响应正文。
- 语言错误形态可 idiomatic，但错误语义必须一致。

#### 7.6.2 `TracePropagationPolicy`

##### 类型定义

```rust
/// Trace 传播策略。
///
/// 该策略约束 SDK client、formal API boundary 和 bus boundary 如何传递 trace context。
pub struct TracePropagationPolicy {
    /// 策略标识。
    pub policy_id: PolicyId,

    /// 必须出现的 trace 字段。
    pub required_fields: Vec<TraceFieldName>,

    /// 需要传播 trace 的目标集合。
    pub propagation_targets: Vec<TracePropagationTarget>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `policy_id` | `PolicyId` | 标识 trace 策略 | 系统生成 |
| `required_fields` | `Vec<TraceFieldName>` | 必填 trace 字段 | 不得为空 |
| `propagation_targets` | `Vec<TracePropagationTarget>` | 传播目标 | formal API / bus / runner |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_required_fields(&self, trace_context: TraceContext) -> Result<(), SdkDomainError>` | 校验 trace 字段 | `trace_context` 是调用上下文 | `Result<(), SdkDomainError>` | 只读 |
| `inject_trace(&self, request: BoundaryRequest, trace_context: TraceContext) -> Result<BoundaryRequest, SdkDomainError>` | 注入 trace | 请求和 trace | 带 trace 的请求 | 不修改原请求 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `TracePropagationPolicy::default_p0() -> TracePropagationPolicy` | 创建 P0 默认策略 | 无 | `TracePropagationPolicy` | 默认 runtime builder |

##### 不变量与禁止事项

- trace 只能携带定位信息，不得携带业务正文或 secret。
- 不负责长期观测存储。

#### 7.6.3 `RedactionPolicy`

##### 类型定义

```rust
/// 敏感信息脱敏策略。
///
/// 该策略约束 SDK 证据、错误、报告和诊断引用中不得出现正文和敏感值。
pub struct RedactionPolicy {
    /// 策略标识。
    pub policy_id: PolicyId,

    /// 禁止出现的模式集合。
    pub forbidden_patterns: Vec<ForbiddenPattern>,

    /// 正文处理规则集合。
    pub body_rules: Vec<BodyRedactionRule>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `policy_id` | `PolicyId` | 标识脱敏策略 | 系统生成 |
| `forbidden_patterns` | `Vec<ForbiddenPattern>` | 禁止出现的敏感模式 | 只能收紧，不能配置关闭 |
| `body_rules` | `Vec<BodyRedactionRule>` | 正文处理规则 | 默认禁止 raw body |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_no_forbidden_body(&self, message: ObservedMessage) -> Result<(), SdkDomainError>` | 校验消息不含禁止正文 | `message` 是待检查材料 | `Result<(), SdkDomainError>` | 只读 |
| `redact_message(&self, message: ObservedMessage) -> Result<RedactedMessage, SdkDomainError>` | 脱敏消息 | 待处理消息 | `RedactedMessage` | 不返回 raw body |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `RedactionPolicy::strict_default() -> RedactionPolicy` | 创建严格默认策略 | 无 | `RedactionPolicy` | P0 默认 |

##### 不变量与禁止事项

- 不能通过配置关闭 forbidden patterns。
- redaction 成功不等于 verification passed。

#### 7.6.4 `CredentialProtectionPolicy`

##### 类型定义

```rust
/// 凭据材料保护策略。
///
/// 该策略要求 SDK 只保存凭据引用,不得保存明文 credential material。
pub struct CredentialProtectionPolicy {
    /// 策略标识。
    pub policy_id: PolicyId,

    /// 凭据存储规则。
    pub storage_rule: CredentialStorageRule,

    /// 允许的凭据引用类型。
    pub allowed_ref_kinds: Vec<CredentialRefKind>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `policy_id` | `PolicyId` | 标识凭据策略 | 系统生成 |
| `storage_rule` | `CredentialStorageRule` | 凭据存储规则 | P0 禁止明文保存 |
| `allowed_ref_kinds` | `Vec<CredentialRefKind>` | 允许引用类型 | 不得包含 plain secret |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `protect(&self, credential_material: CredentialMaterial) -> Result<CredentialRef, SdkDomainError>` | 转换凭据为引用 | `credential_material` 是调用方传入凭据材料 | `CredentialRef` | 不保存明文 |
| `allow_fake_credential(&self, credential_ref: CredentialRef) -> bool` | 判断 fake credential 是否允许 | `credential_ref` 是引用 | `bool` | 只用于验证目标 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `CredentialProtectionPolicy::no_plain_secret() -> CredentialProtectionPolicy` | 创建禁止明文策略 | 无 | `CredentialProtectionPolicy` | 默认配置 |

##### 不变量与禁止事项

- 不能把 credential material 写入 truth、evidence、error、report。
- fake credential 不能伪装生产凭据。

#### 7.6.5 `BoundaryGuard`

##### 类型定义

```rust
/// SDK 边界守卫。
///
/// 该对象组合能力模型、脱敏策略和凭据策略,阻止越界能力、正文泄露和 fake success。
pub struct BoundaryGuard {
    /// 当前能力模型。
    pub capability_model: ClientCapabilityModel,

    /// 脱敏策略。
    pub redaction_policy: RedactionPolicy,

    /// 凭据保护策略。
    pub credential_policy: CredentialProtectionPolicy,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `capability_model` | `ClientCapabilityModel` | 能力允许边界 | 不得被语言包覆盖 |
| `redaction_policy` | `RedactionPolicy` | 正文和敏感值边界 | 默认严格 |
| `credential_policy` | `CredentialProtectionPolicy` | 凭据材料边界 | 禁止明文 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_capability_allowed(&self, capability_id: ClientCapabilityId) -> Result<(), SdkDomainError>` | 校验能力允许 | `capability_id` 是能力标识 | `Result<(), SdkDomainError>` | 不修改状态 |
| `assert_body_allowed(&self, message: ObservedMessage) -> Result<(), SdkDomainError>` | 校验正文边界 | `message` 是待检查材料 | `Result<(), SdkDomainError>` | 委托 redaction policy |
| `assert_not_fake_success(&self, evidence: VerificationEvidence) -> Result<(), SdkDomainError>` | 阻止 fake success 伪装生产成功 | `evidence` 是验证证据 | `Result<(), SdkDomainError>` | fake-only 不得支撑 stable |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `BoundaryGuard::new(capability_model: ClientCapabilityModel, redaction_policy: RedactionPolicy, credential_policy: CredentialProtectionPolicy) -> BoundaryGuard` | 创建边界守卫 | 三个策略对象 | `BoundaryGuard` | application service / client facade |

##### 不变量与禁止事项

- 不执行认证、授权或治理审批。
- 不调用 formal API、bus runtime 或 runner。
- 只做边界规则校验。

### 7.7 `domain_package_candidate` 对象实现契约

#### 7.7.1 `PackageCandidateStatus`

##### 类型定义

```rust
/// SDK package candidate 状态。
///
/// 该枚举表达本地 candidate 从草稿、验证到稳定基线的状态。`Stable` 不等于公共注册表发布。
pub enum PackageCandidateStatus {
    /// candidate 已创建但尚未完成验证。
    Draft,

    /// candidate 存在未验证能力、fake-only 能力或缺失证据。
    NotVerified,

    /// candidate 验证失败。
    Failed,

    /// candidate 已通过当前 P0 验证。
    Verified,

    /// candidate 已通过验证、兼容和文档门禁,成为本地稳定基线。
    Stable,

    /// candidate 已被后续候选替代。
    Superseded,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `/// candidate 已创建但尚未完成验证。` | 初始候选 | 创建 | `NotVerified`、`Verified`、`Failed`、`Superseded` |
| `NotVerified` | `/// candidate 存在未验证能力、fake-only 能力或缺失证据。` | 暂停稳定化 | `Draft`、`Verified` | `Verified`、`Failed`、`Superseded` |
| `Failed` | `/// candidate 验证失败。` | 阻断候选 | `Draft`、`NotVerified`、`Verified` | `Superseded` |
| `Verified` | `/// candidate 已通过当前 P0 验证。` | 可进入兼容门禁 | `Draft`、`NotVerified` | `Stable`、`NotVerified`、`Failed`、`Superseded` |
| `Stable` | `/// candidate 已通过验证、兼容和文档门禁,成为本地稳定基线。` | 本地稳定基线 | `Verified` | `Superseded` |
| `Superseded` | `/// candidate 已被后续候选替代。` | 历史状态 | 任意非终态 | 无 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_transition_to(&self, target: PackageCandidateStatus) -> bool` | 判断状态迁移 | `target` 是目标状态 | `bool` | 完整矩阵由 Step 10 复核 |
| `is_terminal(&self) -> bool` | 判断是否终态 | 无 | `bool` | `Superseded` 为终态 |
| `allows_public_surface_use(&self) -> bool` | 判断是否可用于 public surface | 无 | `bool` | `Verified` / `Stable` 返回 true |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PackageCandidateStatus::initial_draft() -> PackageCandidateStatus` | 创建初始状态 | 无 | `PackageCandidateStatus` | 新 candidate |

##### 不变量与禁止事项

- `Stable` 不等于 crates.io / PyPI / npm 公共发布。
- `Failed` 不能直接变成 `Verified` 或 `Stable`。
- `NotVerified` 不得被报告成通过。

#### 7.7.2 `LanguageArtifact`

##### 类型定义

```rust
/// 单语言 SDK 产物引用。
///
/// 该对象记录 Rust、Python 或 TypeScript 包构建产物的引用、摘要和语言信息,
/// 不保存 package body。
pub struct LanguageArtifact {
    /// 语言标识。
    pub language_id: LanguageId,

    /// artifact 引用。
    pub artifact_ref: PackageArtifactRef,

    /// artifact 摘要。
    pub artifact_digest: ContentDigest,

    /// 生成该 artifact 的语言视图。
    pub language_view_id: LanguageBindingViewId,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `language_id` | `LanguageId` | 产物语言 | P0 为 Rust / Python / TypeScript |
| `artifact_ref` | `PackageArtifactRef` | 产物引用 | 不保存包体 |
| `artifact_digest` | `ContentDigest` | 产物摘要 | 用于 evidence 和审计 |
| `language_view_id` | `LanguageBindingViewId` | 来源语言视图 | 必须可追溯 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `matches_language(&self, language_id: LanguageId) -> bool` | 判断语言是否匹配 | 目标语言 | `bool` | 只读 |
| `assert_digest(&self, digest: ContentDigest) -> Result<(), SdkDomainError>` | 校验摘要 | `digest` 是待比较摘要 | `Result<(), SdkDomainError>` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `LanguageArtifact::record(language_id: LanguageId, artifact_ref: PackageArtifactRef, artifact_digest: ContentDigest, language_view_id: LanguageBindingViewId) -> Result<LanguageArtifact, SdkDomainError>` | 记录语言包产物 | 语言、引用、摘要、来源视图 | `LanguageArtifact` | package build 完成 |

##### 不变量与禁止事项

- 不保存 package body。
- 不能脱离 `LanguageBindingView` 独立生成。
- 三语言 candidate 必须至少各有一个 artifact。

#### 7.7.3 `PackageCandidate`

##### 类型定义

```rust
/// SDK package candidate。
///
/// 该对象表达一次本地 SDK 候选版本、三语言产物、上游引用和验证状态。
pub struct PackageCandidate {
    /// candidate 唯一标识。
    pub candidate_id: PackageCandidateId,

    /// candidate 版本。
    pub candidate_version: PackageCandidateVersion,

    /// 三语言 package artifact 引用。
    pub language_artifacts: Vec<LanguageArtifact>,

    /// candidate 基于的上游版本引用。
    pub upstream_refs: Vec<UpstreamVersionRef>,

    /// candidate 当前状态。
    pub status: PackageCandidateStatus,

    /// 关联验证证据引用集合。
    pub evidence_refs: Vec<VerificationEvidenceRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `candidate_id` | `PackageCandidateId` | 标识 candidate | 系统生成 |
| `candidate_version` | `PackageCandidateVersion` | 本地候选版本 | 不等同公共 registry version |
| `language_artifacts` | `Vec<LanguageArtifact>` | 三语言产物 | P0 必须覆盖三语言 |
| `upstream_refs` | `Vec<UpstreamVersionRef>` | 上游版本引用 | 必须与 freshness 对齐 |
| `status` | `PackageCandidateStatus` | candidate 状态 | 状态迁移受 guard 控制 |
| `evidence_refs` | `Vec<VerificationEvidenceRef>` | 证据引用 | 不保存证据正文 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_verified(&mut self, evidence: VerificationEvidence) -> Result<(), SdkDomainError>` | 标记已验证 | `evidence` 是通过且已脱敏证据 | `Result<(), SdkDomainError>` | 失败 / 未脱敏证据不得通过 |
| `mark_failed(&mut self, reason: CandidateFailureReason, now: Timestamp) -> Result<(), SdkDomainError>` | 标记失败 | 失败原因和时间 | `Result<(), SdkDomainError>` | 状态进入 `Failed` |
| `mark_stable(&mut self, decision: CompatibilityDecision) -> Result<(), SdkDomainError>` | 标记本地稳定 | `decision` 是兼容决策 | `Result<(), SdkDomainError>` | 必须先 `Verified` 且兼容门禁通过 |
| `supersede(&mut self, next_candidate_id: PackageCandidateId, now: Timestamp) -> Result<(), SdkDomainError>` | 标记被替代 | 后续 candidate id | `Result<(), SdkDomainError>` | 进入 `Superseded` |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PackageCandidate::create(candidate_version: PackageCandidateVersion, language_artifacts: Vec<LanguageArtifact>, upstream_refs: Vec<UpstreamVersionRef>) -> Result<PackageCandidate, SdkDomainError>` | 创建 candidate | 版本、产物、上游引用 | `PackageCandidate` | `GeneratePackageCandidate` |
| `PackageCandidate::rehydrate(row: PackageCandidateRow) -> Result<PackageCandidate, SdkDomainError>` | 从持久化记录恢复 | repository row | `PackageCandidate` | repository 恢复 |

##### 不变量与禁止事项

- 非 `Fresh` 上游视图不得生成 verified candidate。
- `Stable` 只表示本地稳定基线，不表示公共发布。
- fake-only / skipped / failed / unredacted evidence 不能支撑 `Stable`。

### 7.8 `domain_evidence` 对象实现契约

#### 7.8.1 `EvidenceResult`

##### 类型定义

```rust
/// 验证结果状态。
///
/// 该枚举表达验证项是否通过,不表达证据是否已脱敏。
pub enum EvidenceResult {
    /// 验证项通过。
    Passed,

    /// 验证项失败。
    Failed,

    /// 验证项尚未执行或无结论。
    NotVerified,

    /// 验证项因范围裁剪被显式跳过。
    Skipped,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Passed` | `/// 验证项通过。` | 支撑候选验证 | `NotVerified` | `Failed` |
| `Failed` | `/// 验证项失败。` | 阻断候选 | `NotVerified`、`Passed` | 无 |
| `NotVerified` | `/// 验证项尚未执行或无结论。` | 保守阻断 | 初始 | `Passed`、`Failed`、`Skipped` |
| `Skipped` | `/// 验证项因范围裁剪被显式跳过。` | 显示裁剪 | `NotVerified` | 无 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_passing(&self) -> bool` | 判断是否通过 | 无 | `bool` | 只有 `Passed` true |
| `is_blocking(&self) -> bool` | 判断是否阻断 stable | 无 | `bool` | 非 `Passed` 阻断 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `EvidenceResult::initial_not_verified() -> EvidenceResult` | 初始未验证 | 无 | `EvidenceResult` | 新证据项 |

##### 不变量与禁止事项

- `Skipped` 不能当作 `Passed`。
- `Passed` 仍需配合 `EvidenceRedactionStatus::Redacted` 才能支撑 candidate。

#### 7.8.2 `EvidenceRedactionStatus`

##### 类型定义

```rust
/// 证据脱敏状态。
///
/// 该枚举表达证据是否可被安全引用,不表达验证是否通过。
pub enum EvidenceRedactionStatus {
    /// 证据已脱敏,可以被安全引用。
    Redacted,

    /// 证据尚未脱敏或脱敏失败。
    Unredacted,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Redacted` | `/// 证据已脱敏,可以被安全引用。` | 安全引用条件 | `Unredacted` | 无 |
| `Unredacted` | `/// 证据尚未脱敏或脱敏失败。` | 阻断报告和 stable | 初始 | `Redacted` |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_safe_to_reference(&self) -> bool` | 判断是否可引用 | 无 | `bool` | 只有 `Redacted` true |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `EvidenceRedactionStatus::initial_unredacted() -> EvidenceRedactionStatus` | 初始未脱敏 | 无 | `EvidenceRedactionStatus` | 新证据 |

##### 不变量与禁止事项

- `Redacted` 不等于 `Passed`。
- 未脱敏证据不得进入 reports 或 outbound event。

#### 7.8.3 `VerificationEvidence`

##### 类型定义

```rust
/// SDK 验证证据。
///
/// 该对象记录 smoke、docs example、boundary、compatibility 等验证结论和脱敏 artifact 引用。
pub struct VerificationEvidence {
    /// 证据唯一标识。
    pub evidence_id: VerificationEvidenceId,

    /// 关联 candidate。
    pub candidate_id: PackageCandidateId,

    /// 证据类别。
    pub evidence_kind: EvidenceKind,

    /// 验证结果。
    pub result: EvidenceResult,

    /// 脱敏状态。
    pub redaction_status: EvidenceRedactionStatus,

    /// 脱敏后的 artifact 引用。
    pub artifact_ref: EvidenceArtifactRef,

    /// fake / formal 目标标记。
    pub target_marker: VerificationTargetMarker,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `evidence_id` | `VerificationEvidenceId` | 标识证据 | 系统生成 |
| `candidate_id` | `PackageCandidateId` | 关联候选 | 必须存在 |
| `evidence_kind` | `EvidenceKind` | 证据类型 | smoke / docs / boundary / compatibility |
| `result` | `EvidenceResult` | 验证结果 | `Passed` 才可能支撑 candidate |
| `redaction_status` | `EvidenceRedactionStatus` | 脱敏状态 | `Redacted` 才可引用 |
| `artifact_ref` | `EvidenceArtifactRef` | 证据 artifact 引用 | 不保存正文 |
| `target_marker` | `VerificationTargetMarker` | fake / formal 标记 | fake-only 不证明生产可用 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_passing(&self) -> bool` | 判断验证是否通过 | 无 | `bool` | 委托 `result` |
| `assert_redacted(&self, policy: RedactionPolicy) -> Result<(), SdkDomainError>` | 校验证据可安全引用 | `policy` 是脱敏策略 | `Result<(), SdkDomainError>` | 不读取 artifact body |
| `is_blocking_candidate(&self) -> bool` | 判断是否阻断 candidate | 无 | `bool` | failed / skipped / unredacted / fake-only 可能阻断 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `VerificationEvidence::from_runner_result(candidate_id: PackageCandidateId, result: RunnerResult, policy: RedactionPolicy) -> Result<VerificationEvidence, SdkDomainError>` | 从 runner 结果生成证据 | candidate、runner 结果和脱敏策略 | `VerificationEvidence` | smoke / docs / boundary runner |

##### 不变量与禁止事项

- 不保存 raw request / response / payload / secret。
- `Passed + Unredacted` 不得支撑 candidate。
- fake target 证据必须显式标记。

### 7.9 `domain_compatibility_evolution` 对象实现契约

#### 7.9.1 `CompatibilityDecisionState`

##### 类型定义

```rust
/// 兼容性决策状态。
///
/// 该枚举表达 candidate 对既有 SDK 语义基线的兼容结论。
pub enum CompatibilityDecisionState {
    /// 变化不破坏既有 SDK 使用方。
    Compatible,

    /// 变化需要使用方按照迁移说明调整。
    RequiresMigration,

    /// 变化构成 breaking change。
    Breaking,

    /// 兼容性证据不足。
    PendingEvidence,

    /// 候选变化被兼容治理拒绝。
    Rejected,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Compatible` | `/// 变化不破坏既有 SDK 使用方。` | 允许进入 stable 门禁 | `PendingEvidence` | `Breaking`、`Rejected` |
| `RequiresMigration` | `/// 变化需要使用方按照迁移说明调整。` | 有条件进入 stable | `PendingEvidence` | `Breaking`、`Rejected` |
| `Breaking` | `/// 变化构成 breaking change。` | 阻断 stable | `PendingEvidence`、`Compatible` | 无 |
| `PendingEvidence` | `/// 兼容性证据不足。` | 初始 / 暂停 | 初始 | `Compatible`、`RequiresMigration`、`Breaking`、`Rejected` |
| `Rejected` | `/// 候选变化被兼容治理拒绝。` | 阻断 stable | `PendingEvidence`、`Compatible`、`RequiresMigration` | 无 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_blocking_release(&self) -> bool` | 判断是否阻断 stable | 无 | `bool` | `Breaking` / `PendingEvidence` / `Rejected` true |
| `requires_migration(&self) -> bool` | 判断是否需要迁移说明 | 无 | `bool` | `RequiresMigration` true |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `CompatibilityDecisionState::initial_pending() -> CompatibilityDecisionState` | 初始 pending evidence | 无 | `CompatibilityDecisionState` | 新兼容检查 |

##### 不变量与禁止事项

- `Breaking` / `Rejected` 不得进入 `PackageCandidateStatus::Stable`。
- `RequiresMigration` 必须绑定 migration guide。

#### 7.9.2 `CompatibilityDecision`

##### 类型定义

```rust
/// SDK 兼容性决策。
///
/// 该对象记录 candidate 相对既有语义基线的兼容结论、证据引用和迁移说明引用。
pub struct CompatibilityDecision {
    /// 决策唯一标识。
    pub decision_id: CompatibilityDecisionId,

    /// 关联 candidate。
    pub candidate_id: PackageCandidateId,

    /// 决策状态。
    pub decision_state: CompatibilityDecisionState,

    /// 支撑决策的证据引用。
    pub evidence_refs: Vec<VerificationEvidenceRef>,

    /// 迁移说明引用。
    pub migration_ref: Option<MigrationGuideRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `decision_id` | `CompatibilityDecisionId` | 标识决策 | 系统生成 |
| `candidate_id` | `PackageCandidateId` | 关联 candidate | 必须存在 |
| `decision_state` | `CompatibilityDecisionState` | 兼容状态 | 状态影响 stable 门禁 |
| `evidence_refs` | `Vec<VerificationEvidenceRef>` | 证据引用 | 不保存证据正文 |
| `migration_ref` | `Option<MigrationGuideRef>` | 迁移说明引用 | `RequiresMigration` 必填 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `requires_migration(&self) -> bool` | 判断是否需要迁移 | 无 | `bool` | 委托 state |
| `is_blocking_release(&self) -> bool` | 判断是否阻断 stable | 无 | `bool` | 委托 state |
| `assert_can_stabilize(&self) -> Result<(), SdkDomainError>` | 校验可稳定化 | 无 | `Result<(), SdkDomainError>` | breaking / rejected / pending 返回错误 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `CompatibilityDecision::record(candidate_id: PackageCandidateId, decision_state: CompatibilityDecisionState, evidence_refs: Vec<VerificationEvidenceRef>, migration_ref: Option<MigrationGuideRef>) -> Result<CompatibilityDecision, SdkDomainError>` | 记录兼容决策 | candidate、状态、证据、迁移引用 | `CompatibilityDecision` | `CheckCompatibility` |

##### 不变量与禁止事项

- `RequiresMigration` 必须绑定 `migration_ref`。
- 决策不能替代 ADR；只保存引用和结论。
- breaking / rejected 不能被配置绕过。

#### 7.9.3 `DeprecatedApiLifecycleState`

##### 类型定义

```rust
/// SDK API deprecated 生命周期状态。
pub enum DeprecatedApiLifecycleState {
    /// 已发布 deprecated 通知但仍可用。
    Announced,

    /// API 已正式 deprecated。
    Deprecated,

    /// API 已进入计划移除窗口。
    PendingRemoval,

    /// API 已从 SDK 中移除。
    Removed,

    /// 记录已被新方案或新决策覆盖。
    Superseded,
}
```

##### enum 变体表

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Announced` | `/// 已发布 deprecated 通知但仍可用。` | 提前通知 | 创建 | `Deprecated`、`Superseded` |
| `Deprecated` | `/// API 已正式 deprecated。` | 引导迁移 | `Announced` | `PendingRemoval`、`Superseded` |
| `PendingRemoval` | `/// API 已进入计划移除窗口。` | 计划移除 | `Deprecated` | `Removed`、`Superseded` |
| `Removed` | `/// API 已从 SDK 中移除。` | 不再可用 | `PendingRemoval` | 无 |
| `Superseded` | `/// 记录已被新方案或新决策覆盖。` | 历史状态 | 任意非终态 | 无 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_transition_to(&self, target: DeprecatedApiLifecycleState) -> bool` | 判断迁移是否合法 | `target` 是目标状态 | `bool` | 禁止 `Announced -> Removed` |
| `is_available(&self) -> bool` | 判断 API 是否仍可用 | 无 | `bool` | `Removed` false |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DeprecatedApiLifecycleState::initial_announced() -> DeprecatedApiLifecycleState` | 初始公告状态 | 无 | `DeprecatedApiLifecycleState` | 新 deprecated 记录 |

##### 不变量与禁止事项

- 禁止静默移除：`Announced` 不能直接到 `Removed`。

#### 7.9.4 `MigrationGuideRef` 与 `DeprecatedApiRecord`

##### 类型定义

```rust
/// 迁移说明引用。
pub struct MigrationGuideRef {
    /// 迁移说明标识。
    pub guide_id: MigrationGuideId,

    /// 起始版本。
    pub from_version: PackageCandidateVersion,

    /// 目标版本。
    pub to_version: PackageCandidateVersion,

    /// 覆盖语言集合。
    pub language_set: Vec<LanguageId>,

    /// 迁移说明文档引用。
    pub document_ref: DocumentRef,
}

/// SDK API deprecated 记录。
pub struct DeprecatedApiRecord {
    /// API 引用。
    pub api_ref: SdkApiRef,

    /// 生命周期状态。
    pub lifecycle_state: DeprecatedApiLifecycleState,

    /// 公告时间。
    pub announced_at: Timestamp,

    /// 迁移说明引用。
    pub migration_ref: Option<MigrationGuideRef>,

    /// 计划移除信息。
    pub removal_plan: Option<RemovalPlan>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `guide_id` | `MigrationGuideId` | 标识迁移说明 | 系统生成 |
| `from_version` | `PackageCandidateVersion` | 起始版本 | 小于目标版本 |
| `to_version` | `PackageCandidateVersion` | 目标版本 | 大于起始版本 |
| `language_set` | `Vec<LanguageId>` | 覆盖语言 | 必须覆盖受影响语言 |
| `document_ref` | `DocumentRef` | 文档引用 | 不复制正文 |
| `api_ref` | `SdkApiRef` | API 引用 | 指向 SDK public surface |
| `lifecycle_state` | `DeprecatedApiLifecycleState` | deprecated 状态 | 受状态机控制 |
| `announced_at` | `Timestamp` | 公告时间 | 必填 |
| `migration_ref` | `Option<MigrationGuideRef>` | 迁移说明 | deprecated 后应有值 |
| `removal_plan` | `Option<RemovalPlan>` | 移除计划 | pending removal 必填 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `covers_api(&self, api_ref: SdkApiRef) -> bool` | 判断 migration 是否覆盖 API | `api_ref` 是 API 引用 | `bool` | `MigrationGuideRef` 只读函数 |
| `covers_language(&self, language_id: LanguageId) -> bool` | 判断是否覆盖语言 | `language_id` 是语言 | `bool` | 只读 |
| `mark_deprecated(&mut self, migration_ref: MigrationGuideRef, now: Timestamp) -> Result<(), SdkDomainError>` | 标记 deprecated | 迁移引用和时间 | `Result<(), SdkDomainError>` | 从 announced 到 deprecated |
| `schedule_removal(&mut self, removal_plan: RemovalPlan, now: Timestamp) -> Result<(), SdkDomainError>` | 计划移除 | 移除计划和时间 | `Result<(), SdkDomainError>` | 需要已有 migration |
| `mark_removed(&mut self, now: Timestamp) -> Result<(), SdkDomainError>` | 标记已移除 | 时间 | `Result<(), SdkDomainError>` | 只能从 pending removal |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `MigrationGuideRef::create(from_version: PackageCandidateVersion, to_version: PackageCandidateVersion, language_set: Vec<LanguageId>, document_ref: DocumentRef) -> Result<MigrationGuideRef, SdkDomainError>` | 创建迁移引用 | 版本、语言和文档引用 | `MigrationGuideRef` | 兼容治理 |
| `DeprecatedApiRecord::announce(api_ref: SdkApiRef, migration_ref: Option<MigrationGuideRef>, now: Timestamp) -> Result<DeprecatedApiRecord, SdkDomainError>` | 创建 deprecated 公告 | API、迁移引用、时间 | `DeprecatedApiRecord` | `DeprecateSdkApi` |

##### 不变量与禁止事项

- 不复制迁移文档正文，只保存 `DocumentRef`。
- `PendingRemoval` 必须有 `RemovalPlan`。
- `Removed` 后不得再作为可用能力返回。

### 7.10 `application_services` 对象登记

本 Step 不展开 application service 的 port 字段全集和函数级调用链。原因是 service 依赖的 repository、source、boundary、runner、artifact、outbox 和 unit of work trait 由 Step 7 定义；逐接口函数流程由 Step 9 定义。本节只固定 service 对象主语、所属文件和本步边界，避免后续漏写。

| Service 对象 | 建议文件 | 主要责任 | 本 Step 固定内容 | 后续展开 |
|---|---|---|---|---|
| `SdkSemanticBaselineService` | `crates/application/src/semantic_baseline_service.rs` | 编排 `UpdateSdkSemanticBaseline` | service 名称、归属、依赖 domain_semantic | Step 7 / Step 9 |
| `ContractConsumptionService` | `crates/application/src/contract_consumption_service.rs` | 编排上游 snapshot 消费、derived view 和 freshness | service 名称、归属、依赖 domain_upstream_view | Step 7 / Step 9 |
| `ServiceClientAssemblyService` | `crates/application/src/service_client_assembly.rs` | 编排 formal / fake service boundary 调用与 read | service 名称、归属、依赖 service client / boundary policy | Step 7 / Step 9 |
| `EventClientAssemblyService` | `crates/application/src/event_client_assembly.rs` | 编排 bus publish / subscription boundary | service 名称、归属、依赖 event client / boundary policy | Step 7 / Step 9 |
| `PackageCandidateService` | `crates/application/src/package_candidate_service.rs` | 编排 candidate 和 language package build | service 名称、归属、依赖 candidate / artifact port | Step 7 / Step 9 |
| `CandidateValidationService` | `crates/application/src/candidate_validation_service.rs` | 编排 smoke / docs / boundary evidence | service 名称、归属、依赖 evidence / runner port | Step 7 / Step 9 |
| `CompatibilityGovernanceService` | `crates/application/src/compatibility_governance.rs` | 编排 compatibility 和 deprecated lifecycle | service 名称、归属、依赖 compatibility / evidence | Step 7 / Step 9 |
| `QueryService` | `crates/application/src/query_service.rs` | 编排只读 query | service 名称、归属、查询不改写真相 | Step 7 / Step 9 |

统一禁止事项：

- application service 不能依赖 concrete infra adapter 类型。
- application service 不能绕过 domain 对象直接写状态。
- application service 不能执行认证、授权或治理审批。
- Query service 不能触发 refresh、candidate、compatibility 或 deprecated 状态迁移。

### 7.11 `rust_client_facade` 对象实现契约

#### 7.11.1 `ClientContext`

##### 类型定义

```rust
/// Rust SDK client 调用上下文。
///
/// 该对象承接调用方传入的 actor、trace 和 credential 引用,不执行认证授权,
/// 不保存明文 credential material。
pub struct ClientContext {
    /// 调用方 actor 上下文。
    pub actor: ActorContext,

    /// trace 上下文。
    pub trace_context: TraceContext,

    /// 凭据引用。
    pub credential_ref: Option<CredentialRef>,

    /// 当前 client 目标 profile。
    pub target_profile: ClientTargetProfile,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `actor` | `ActorContext` | 调用方上下文 | 由外部可信入口传入 |
| `trace_context` | `TraceContext` | trace 传播 | 不保存业务正文 |
| `credential_ref` | `Option<CredentialRef>` | 凭据引用 | 不保存明文 |
| `target_profile` | `ClientTargetProfile` | formal / fake 目标 profile | fake 必须显式标记 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `with_trace(&self, trace_context: TraceContext) -> ClientContext` | 派生新 trace context | 新 trace | `ClientContext` | 不修改原对象 |
| `assert_no_plain_secret(&self) -> Result<(), SdkDomainError>` | 校验无明文凭据 | 无 | `Result<(), SdkDomainError>` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ClientContext::from_gateway_headers(headers: GatewayHeaders, target_profile: ClientTargetProfile) -> Result<ClientContext, SdkDomainError>` | 从可信入口 header 构造上下文 | header 和 target | `ClientContext` | Rust client 初始化 |

##### 不变量与禁止事项

- 不执行认证、授权或 governance。
- 不保存 secret body。
- fake target 必须显式出现在 `target_profile`。

#### 7.11.2 `SdkClient`

##### 类型定义

```rust
/// Rust 官方 SDK client 入口。
///
/// 该对象聚合 service client、event client 和 capability query 入口,
/// 提供 developer-facing Rust surface,不是 server gateway。
pub struct SdkClient {
    /// client 上下文。
    pub context: ClientContext,

    /// 服务能力 client。
    pub service_client: ServiceClient,

    /// 事件 client。
    pub event_client: EventClient,

    /// 能力查询入口。
    pub capability_query: CapabilityQueryClient,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `context` | `ClientContext` | 调用上下文 | 不含明文 secret |
| `service_client` | `ServiceClient` | 服务能力调用入口 | 不拥有服务端 truth |
| `event_client` | `EventClient` | 事件 publish / subscription 入口 | 不拥有 bus runtime |
| `capability_query` | `CapabilityQueryClient` | 只读能力查询 | 不改写状态 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `service(&self) -> &ServiceClient` | 获取服务 client | 无 | `&ServiceClient` | 只读 |
| `events(&self) -> &EventClient` | 获取事件 client | 无 | `&EventClient` | 只读 |
| `capabilities(&self) -> &CapabilityQueryClient` | 获取能力查询 client | 无 | `&CapabilityQueryClient` | 只读 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `SdkClient::new(context: ClientContext, runtime: SdkRuntimeHandle) -> Result<SdkClient, SdkClientError>` | 构造 Rust SDK client | context 和 runtime handle | `SdkClient` | Rust consumer 初始化 |

##### 不变量与禁止事项

- `SdkClient` 不作为 server API 或 gateway。
- 不能直接写 repository；必须通过 application service。
- 不能隐藏 fake target 事实。

#### 7.11.3 `ServiceClient` 与 `EventClient`

##### 类型定义

```rust
/// Rust SDK 服务能力 client。
pub struct ServiceClient {
    /// 调用上下文。
    pub context: ClientContext,

    /// 服务 client view 引用。
    pub service_view_ref: ServiceViewRef,

    /// runtime handle。
    pub runtime: SdkRuntimeHandle,
}

/// Rust SDK 事件 client。
pub struct EventClient {
    /// 调用上下文。
    pub context: ClientContext,

    /// event client view 引用。
    pub event_view_ref: EventViewRef,

    /// runtime handle。
    pub runtime: SdkRuntimeHandle,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `context` | `ClientContext` | 调用上下文 | 不含明文 secret |
| `service_view_ref` | `ServiceViewRef` | 服务 client view 引用 | 不复制 view 正文 |
| `event_view_ref` | `EventViewRef` | 事件 client view 引用 | 不复制 bus truth |
| `runtime` | `SdkRuntimeHandle` | application runtime 句柄 | 只能调用 application service |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `call(&self, command: ServiceCapabilityCall) -> Result<ServiceCapabilityCallResult, SdkClientError>` | 调用服务能力 | `command` 是服务能力调用 | `ServiceCapabilityCallResult` | 不写 SDK truth |
| `read(&self, query: ServiceCapabilityReadQuery) -> Result<ServiceCapabilityReadResult, SdkClientError>` | 读取服务能力 | `query` 是只读请求 | `ServiceCapabilityReadResult` | 不改写状态 |
| `publish(&self, command: PublishBusEventCommand) -> Result<BusEventPublishResult, SdkClientError>` | 发布 bus 事件 | `command` 是 SDK 事件发布请求 | `BusEventPublishResult` | 不生成 bus delivery truth |
| `open_subscription(&self, query: OpenEventSubscriptionQuery) -> Result<EventSubscriptionView, SdkClientError>` | 打开事件订阅视图 | `query` 是订阅请求 | `EventSubscriptionView` | 不保存事件 payload |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ServiceClient::new(context: ClientContext, service_view_ref: ServiceViewRef, runtime: SdkRuntimeHandle) -> ServiceClient` | 构造服务 client | context、view、runtime | `ServiceClient` | `SdkClient::new` |
| `EventClient::new(context: ClientContext, event_view_ref: EventViewRef, runtime: SdkRuntimeHandle) -> EventClient` | 构造事件 client | context、view、runtime | `EventClient` | `SdkClient::new` |

##### 不变量与禁止事项

- `ServiceClient` 不拥有服务端业务 truth。
- `EventClient` 不拥有 bus runtime truth。
- 两者都不得绕过 `BoundaryGuard` 和 application service。

### 7.12 Step 6 统一复核表

#### 7.12.1 模块覆盖复核

| Step 5 模块 | Step 6 处理结果 | 是否满足进入 Step 7 |
|---|---|---|
| `contracts` | 明确不在 Step 6 展开 DTO schema；由 Step 8 负责 Command / Query / Event / Job 协议 | 是 |
| `domain_semantic` | 已定义 `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` | 是 |
| `domain_upstream_view` | 已定义 `UpstreamVersionRef`、`SnapshotFreshnessState`、`DerivedBindingView`、`LanguageBindingView` | 是 |
| `domain_service_client` | 已定义 `CapabilitySupportState`、`ServiceCapabilityRef`、`ServiceClientView` | 是 |
| `domain_event_client` | 已定义 `BusEventClientView`、`EventSemanticMapping` | 是 |
| `domain_boundary_policy` | 已定义 error / trace / redaction / credential policy 与 `BoundaryGuard` | 是 |
| `domain_package_candidate` | 已定义 `PackageCandidateStatus`、`LanguageArtifact`、`PackageCandidate` | 是 |
| `domain_evidence` | 已定义 `EvidenceResult`、`EvidenceRedactionStatus`、`VerificationEvidence` | 是 |
| `domain_compatibility_evolution` | 已定义 compatibility decision、deprecated API 和 migration ref 对象 | 是 |
| `application_services` | 已登记 service 主语、文件和后续展开位置 | 是 |
| `application_ports` | 明确后移到 Step 7 定义 trait / port / adapter 契约 | 是 |
| `infra_adapters` | 明确后移到 Step 7 / Step 11 / Step 14 | 是 |
| `rust_client_facade` | 已定义 `ClientContext`、`SdkClient`、`ServiceClient`、`EventClient` | 是 |
| `language_package_surface` | 明确不拥有 SDK truth，后移到 Step 8 / Step 16 | 是 |
| `cli_entry` | 明确后移到 Step 8 / Step 9 | 是 |
| `jobs` | 明确后移到 Step 8 / Step 9 | 是 |

#### 7.12.2 状态 enum 复核

| 状态 enum | 是否有类型定义 | 是否有 variant Rustdoc | 是否进入 Step 10 | 备注 |
|---|---|---|---|---|
| `SnapshotFreshnessState` | 是 | 是 | 是 | freshness 只表达 SDK 派生视图新鲜度 |
| `CapabilitySupportState` | 是 | 是 | 是 | support 不等于服务端真实可用性 |
| `PackageCandidateStatus` | 是 | 是 | 是 | candidate 发布前必须经过 evidence |
| `EvidenceResult` | 是 | 是 | 是 | result 不表达 redaction |
| `EvidenceRedactionStatus` | 是 | 是 | 是 | redaction 不表达 passed / failed |
| `CompatibilityDecisionState` | 是 | 是 | 是 | compatibility 决策需要 evidence 支撑 |
| `DeprecatedApiLifecycleState` | 是 | 是 | 是 | deprecated 生命周期受迁移说明约束 |

#### 7.12.3 后移内容复核

| 后移内容 | 后移到 | 后移原因 |
|---|---|---|
| Command / Query / Event / Job request / response JSON 或 proto 字段 | Step 8 | 协议契约需要统一定义输入、输出、metadata 和错误 envelope |
| repository / source / runner / artifact / outbox trait 方法 | Step 7 | port 需要和 adapter 一起定义依赖方向和 mock 边界 |
| 每个接口的数据流、函数调用顺序和事务边界 | Step 9 | 函数级处理流需要基于对象、port 和协议共同展开 |
| 状态迁移来源、去向、禁止迁移和测试断言 | Step 10 | Step 6 只固定状态集合，不展开完整矩阵 |
| 持久化表、索引、事务和一致性约束 | Step 11 | SDK truth 的存储边界需要在 port 和处理流之后收口 |
| 错误码、异常分支和恢复策略 | Step 12 | 错误模型需要引用协议、状态和处理流 |
| 配置项、外部依赖绑定和本地 path dependency | Step 14 | 配置设计需要承接实现布局和 adapter 绑定 |
| metrics、audit、trace 和 evidence export 细节 | Step 15 | 可观测性需要引用处理流和错误分支 |

#### 7.12.4 禁止漂移复核

| 禁止漂移项 | 本 Step 固定口径 |
|---|---|
| 三语言 truth | Rust domain / application 承载 SDK truth，Python / TypeScript 只承载 package surface |
| fake boundary | fake 必须显式进入 `ClientTargetProfile` 或 `CapabilitySupportState`，不能伪装 formal |
| credential | 只保存 `CredentialRef`，不保存明文 credential material |
| upstream truth | 只保存 core / bus / formal API 的版本、snapshot、digest 或 ref，不复制上游正文 |
| evidence | `EvidenceResult` 与 `EvidenceRedactionStatus` 分离，redacted 不是 passed |
| governance | SDK 不执行身份校验、审批或 governance 决策，只引用 actor / decision / evidence |

---

## 8. 回填草稿

正式 `projects/L0-sdk/03-详细设计.md` 回填时，§5 / §6 不重复粘贴本文件所有对象表，而应按以下引用摘录：

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §5 模块实现契约 | 本文件 §7.3~§7.11 | 按 Step 5 模块顺序摘录对象契约，并保留字段表、函数表、工厂表和不变量 |
| §6 全局对象、Trait、API 索引 | 本文件 §7.1、§7.2、§7.12 | 摘录对象定义范围、基础值对象归属和状态 enum 复核表 |
| §9 状态机与状态流转 | 本文件 §3.6、§7.12.2 | 只引用状态 enum 名称和变体集合，完整迁移矩阵由 Step 10 生成 |
| §17 风险与待确认事项 | 本文件 §9 | 若后续 Step 发现对象名或状态集合冲突，再回填为风险项 |

回填规则：

- 正式文档中对象小节必须保留 `rust` 类型定义、字段表、成员函数表、工厂 / 静态函数表和不变量。
- 如果某对象在本文件已经完整定义，正式文档只做必要摘录，不重新改名。
- 如果 Step 7~Step 10 发现 port、协议或状态矩阵要求改名，必须回到本 Step 修正对象契约，不能在正式文档中静默分叉。

---

## 9. 待确认事项

| 待确认项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| `EvidenceResult` 与 `EvidenceRedactionStatus` 是否拆分 | A. 拆分为两个 enum；B. 合并为一个状态 | 推荐 A | result 与 redaction 是两个维度，合并会导致 redacted 被误读成验证结果 |
| Python / TypeScript 是否在 Step 6 定义等量对象 | A. 后移到 package surface 和 smoke；B. 在 Step 6 定义第二套对象 | 推荐 A | P0 的实现 truth 在 Rust workspace，三语言 package 不应各自拥有 domain truth |
| application service 是否在 Step 6 写字段全集 | A. 只登记 service 主语；B. 立即写 repository / port 字段全集 | 推荐 A | 字段全集依赖 Step 7 的 trait / port 契约，提前写会造成重复和冲突 |

当前推荐方案已写入本 Step。若用户后续改变其中任一结论，需要同步回滚本文件对应对象契约。

---

## 10. 进入下一步条件

进入 Step 7 的条件：

- Step 5 的 16 个实现职责模块已经在 §7.12.1 中逐项复核。
- 需要在 Step 6 正式定义的 domain 对象、状态 enum 和 Rust client facade 对象已经完成。
- 每个正式 struct / enum / variant 已有中文 Rustdoc 风格注释。
- 每个正式对象已包含字段类型、成员函数签名、工厂 / 静态函数签名和不变量。
- DTO、port、adapter、handler、job、配置、持久化和函数流已经明确后移到正确 Step。

下一步：

```text
Step 7. 逐模块定义 Trait / Port / Adapter 契约

重点问题:
1. 每个 application service 依赖哪些 repository / source / runner / artifact / outbox port?
2. 每个 port 的 trait 方法签名是什么?
3. 哪些 adapter 是 P0 必须实现,哪些只是 fake / test adapter?
4. Rust client facade 如何通过 runtime handle 调用 application service,而不是直接依赖 infra?
```
