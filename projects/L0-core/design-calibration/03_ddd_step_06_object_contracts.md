# Step 6. 逐模块定义对象实现契约

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 6 中间产物总控文件。
> 本步只收稳对象实现契约,不展开 Trait / Port / Adapter 方法全集、API / Command / Query / Event / Job schema、函数级处理流、持久化事务或测试方案。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节: `projects/L0-core/03-详细设计.md` §5 模块实现契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 3 实现约束 | Rust 契约片段使用中文 Rustdoc 风格注释;真实实现仓源码注释使用英文 | 约束对象、字段、enum variant 和公开函数的注释写法 |
| Step 4 实现单元与文件布局 | 已确认 `contracts` / `domain` / `application` / `infra` / `cli` / `jobs` workspace 多 crate 架构 | 作为对象落文件和模块归属依据 |
| Step 5 模块实现契约主轴 | 已确认 15 个实现职责模块 | 作为对象分章和模块归属依据 |
| `02-概要设计.md` §6 | 已确认关键对象轮廓、字段、状态集合、成员函数和工厂函数骨架 | 作为对象契约下沉的直接输入 |
| `standards/document/详细设计书写规范.md` §5.5 | 要求每个对象独立成小节,字段写类型,函数写参数类型,enum variant 写注释 | 作为本步输出格式依据 |

已确认结论:

```text
Step 6 必须按模块逐对象展开。
每个对象必须独立成小节。
字段必须写类型、作用和约束。
函数必须写完整签名、参数类型、返回类型和副作用 / 不变量。
enum 必须写类型定义和变体表,每个 variant 必须有 Rustdoc 注释。
```

---

## 3. 本步写作策略

由于 L0-core 的对象数量较多,本步采用“先骨架、后分章节补齐、最后统一复核”的方式。

```text
Step 6 总控文件
  |
  +-- 先收稳对象分组、写法规则和章节计划
  |
  +-- 再按模块逐章补齐对象实现契约
  |
  +-- 最后统一检查对象命名、字段类型、函数签名、enum 注释和模块归属
```

写作约束:

- 每次只补齐一个章节或一组强相关章节。
- 如果一次计划写入的内容预计超过 500 行,必须拆成多次写入;每次写入控制在 500 行以内。
- 拆批时必须保持对象卡片完整,不能把同一个对象的类型定义、字段表、函数表和不变量拆散到不同批次。
- 不把所有对象堆进一个全局对象大表。
- 不在本步定义 repository / port trait 的方法全集。
- 不在本步定义完整 Command / Query / Event / Job 协议 schema。
- 不在本步写 DDL、事务伪代码、运行时配置或测试用例细节。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 | 覆盖模块 | 主要对象 |
|---|---|---|---|---|
| 6.1 | [x] | 对象契约总览与统一写法 | 全部模块 | 对象分类、对象卡片模板、enum 写法规则 |
| 6.2 | [x] | 资产与公共协议支撑对象 | `contract_source_assets` / `release_snapshot_assets` / `contracts` | `ContractSourceRef`、`ContractPackageSourceRef`、`ReleaseSnapshotRef`、`ActorContext`、`ActorRef`、`CommandMetadata`、`QueryMetadata`、`RequestMetadata`、`Receipt`、`ErrorResponse` |
| 6.3 | [x] | 契约定义真相对象 | `domain_definition` | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` |
| 6.4 | [x] | 领域契约包对象 | `domain_packages` | `IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage`、共享 package value object |
| 6.5 | [x] | 发布、快照、消费引用与事实对象 | `domain_release` / `domain_snapshot` / `domain_fact` | `ContractReleaseBaseline`、`CompatibilityStatus`、`ContractReleaseSnapshot`、`DownstreamConsumptionRef`、`ContractFactRecord` |
| 6.6 | [x] | 引用、索引与追溯投影对象 | `domain_reference_projection` | `ExternalReference`、`StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection` |
| 6.7 | [x] | 领域策略与应用服务对象 | `domain_policies` / `application_services` | `ScopePolicy`、`BoundaryGuard`、`DefinitionUseBoundaryGuard`、`ReferenceValidationPolicy`、`FingerprintPolicy`、`ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService` |
| 6.8 | [x] | Step 6 统一复核 | 全部模块 | 对象归属、字段类型、函数签名、enum variant 注释、不变量、禁止事项 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个模块中需要定义哪些 struct / enum / value object / service? | Step 6 已按 `contract_source_assets`、`release_snapshot_assets`、`contracts`、`domain_definition`、`domain_packages`、`domain_release`、`domain_snapshot`、`domain_reference_projection`、`domain_fact`、`domain_policies`、`application_services` 逐组展开对象。`application_ports`、`infra_adapters`、`cli_entry`、`jobs` 的 trait、adapter、handler、job runner 留给 Step 7~9。 |
| 每个对象的主要责任和不变量是什么? | 每个对象卡片均包含类型定义和“不变量与禁止事项”。核心边界是: domain 对象不访问 infra; projection 不改写真相; snapshot 不反向拥有 definition; fact record 不等于 bus runtime; service 只依赖 port trait。 |
| 每个字段的类型、作用和约束是什么? | 每个对象均有“成员变量”表,字段列包含字段名、类型、作用和约束。 |
| 每个成员函数的完整签名、参数类型、返回类型和副作用是什么? | 每个对象均有“成员函数”表,函数签名包含参数类型和返回类型,副作用 / 不变量列说明状态变化、只读判断或禁止外部 I/O。 |
| 哪些函数是工厂函数或静态函数? | 每个对象均有“工厂 / 静态函数”表,覆盖 `new`、`create_draft`、`from_baseline`、`from_definition`、`rehydrate`、`pending`、`initial_draft` 等创建 / 恢复函数。 |
| 哪些状态 enum 需要写变体、允许来源和允许去向? | 已补齐 `ContractLifecycleState`、`ContractPackageLifecycleState`、`ContractReleaseBaselineStatus`、`CompatibilityValue`、`ContractReleaseSnapshotStatus`、`DownstreamConsumptionStatus`、`FactDeliveryStatus`、`ReferenceState`、`IndexState`、`TraceIndexState`、`ReadModelState`、`ProjectionState` 等状态 enum 的变体表。完整转换矩阵留给 Step 10 复核。 |
| 每个 enum variant 的 Rustdoc 注释是什么? | 每个 enum 代码块中 variant 均有 `///` 注释;变体表也保留可直接转写为 Rustdoc 的注释文本。非状态 enum 的来源 / 去向写为“不适用”。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 对象契约仍基于旧共享 primitive / DTO 口径 | 不能直接承接新版 L0-core 契约来源主线 |
| `02-概要设计.md` §6 | 已有对象骨架,但不是完整 Rust 实现契约 | 实现者仍需补字段约束、返回类型、副作用和 enum 注释 |
| Step 5 模块主轴 | 已明确对象归属,但尚未逐对象展开 | Step 7~10 缺少稳定主语 |
| `application_services` | 概要设计只列 service 名称和用例方向 | 实现者无法知道 service 依赖哪些策略 / port,也无法确定哪些函数属于对象契约 |
| 状态对象 | 概要设计只列状态集合 | Step 10 前必须先固定 enum、variant 注释和初步允许来源 / 去向 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象组织方式 | 关键对象只在概要设计中按对象族说明 | 详细设计按模块逐对象展开 | 支撑 1:1 实现 |
| 字段定义 | 只说明字段类型和作用 | 补齐字段约束、变更规则和 Rustdoc 注释 | 降低实现歧义 |
| 函数定义 | 只说明函数名和作用 | 补齐完整签名、参数类型、返回类型、副作用和不变量 | 支撑直接写 impl |
| enum 定义 | 状态集合只在概要层说明 | 补齐 enum 类型定义、variant 注释和迁移语义 | 支撑状态机 Step 10 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一次性写完整 Step 6 单文件 | 文件集中 | 内容过长,难 review,容易遗漏字段 / 注释 / 函数签名 | 不采用 |
| 按对象族分批写入同一总控文件 | 易于逐步 review,最终仍保持一个 Step 文件 | 文件会较长,需要最后统一复核 | 采用 |
| 拆成多个 Step 6 子文件 | 单文件较短 | 正式回填和状态管理更复杂 | 暂不采用;如单文件过长再拆 |
| application service 不作为对象展开 | 文档更短 | 无法说明 service 依赖字段和用例函数签名 | 不采用 |
| application service 作为对象展开,函数级流程后移 | 既固定代码主体,又避免提前写伪代码 | Step 9 仍需补完整调用链 | 采用 |

---

## 9. 结构化中间产物

> 本节将按 6.1~6.8 逐步补齐。

### 9.1 对象契约总览与统一写法

本节先固定 Step 6 的统一写法。后续 9.2~9.7 必须按本节格式补齐对象实现契约。

#### 9.1.1 对象分组总览

| 分组 | 覆盖模块 | 对象类型 | 后续章节 | 本步展开边界 |
|---|---|---|---|---|
| 资产引用对象 | `contract_source_assets` / `release_snapshot_assets` | asset ref / source ref / snapshot ref | 9.2 | 只定义引用结构、路径语义和只读 / 真相边界 |
| 公共协议支撑对象 | `contracts` | context / metadata / receipt / error support DTO | 9.2 | 只定义跨接口复用对象;Command / Query / Event / Job 完整 schema 留给 Step 8 |
| 契约定义真相对象 | `domain_definition` | aggregate / value object / state / record | 9.3 | 定义契约真相、生命周期、版本和演进记录 |
| 领域契约包对象 | `domain_packages` | package aggregate / package value object | 9.4 | 定义六个消费域契约包和共享 package 行为 |
| 发布、快照、消费与事实对象 | `domain_release` / `domain_snapshot` / `domain_fact` | release record / snapshot / reference / fact record / state | 9.5 | 定义发布基线、快照派生、下游消费引用和事实输出记录 |
| 引用、索引与投影对象 | `domain_reference_projection` | reference / local index / read projection / trace projection | 9.6 | 定义只读查询和追溯对象;不得改写真相 |
| 策略与应用服务对象 | `domain_policies` / `application_services` | policy object / service object | 9.7 | 定义纯策略对象和应用服务依赖字段;函数级流程留给 Step 9 |

#### 9.1.2 对象类型边界

| 对象类型 | 典型对象 | 可以包含 | 禁止包含 |
|---|---|---|---|
| `asset ref` | `ContractSourceRef`、`ReleaseSnapshotRef` | 逻辑路径、版本锚点、只读 / 真相语义 | 文件系统读写实现、具体序列化解析逻辑 |
| `support DTO` | `ActorContext`、`CommandMetadata`、`Receipt` | 跨接口复用的上下文、元数据和响应支撑字段 | 业务状态迁移、repository 调用、外部 I/O |
| `domain aggregate` | `ContractDefinition` | 聚合内字段、生命周期入口、领域不变量 | 持久化细节、事件投递、CLI / job 入口逻辑 |
| `domain value object` | `ContractScope`、`ContractVersion` | 值语义、比较、校验、不可变派生 | 跨聚合事务、外部工具调用 |
| `domain state enum` | `ContractLifecycle`、`CompatibilityStatus` | 状态值、状态判断、合法迁移辅助 | 绕过聚合直接改写真相 |
| `domain record` | `ContractEvolutionRecord`、`ContractFactRecord` | 追溯锚点、事实锚点、审计友好的不可变记录 | 作为后台 worker 或 bus runtime |
| `projection / index` | `ContractReadModel`、`ContractTraceProjection` | 查询视图字段、重建判断、只读匹配函数 | 反向修改 `ContractDefinition` |
| `domain policy` | `ScopePolicy`、`FingerprintPolicy` | 纯规则判断、纯计算、领域错误返回 | repository、filesystem、bus、gateway、toolchain 执行 |
| `application service` | `ContractChangeService`、`ContractReleaseService` | port 依赖字段、use case 函数签名、事务编排入口 | 具体 infra adapter 实现、协议 schema 展开、函数级伪代码细节 |

#### 9.1.3 对象卡片固定结构

后续每个对象必须独立成小节,不能把多个对象合并到一个表中。

固定写法:

````md
##### `<TypeName>`

###### 类型定义

```rust
/// <对象作用与不变量说明>
pub struct TypeName {
    /// <字段作用与约束>
    pub field_name: FieldType,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|

###### 不变量与禁止事项

- <不变量或禁止事项>
````

写法要求:

- `TypeName` 必须与 Step 5 的代码主体归属映射一致。
- 类型定义代码块必须使用 `rust`。
- struct、字段、enum、enum variant 和公开函数必须写 Rustdoc 风格中文注释。
- 成员变量表中的类型必须写完整类型名,不能只写 `id`、`ref`、`meta` 这类泛称。
- 函数签名中的参数必须写类型名,例如 `update_draft(&mut self, spec: ContractDefinitionDraftSpec, actor: ActorContext, now: Timestamp)`。
- 返回值必须明确写 `Result<..., ...>` 或具体类型,不能省略。

#### 9.1.4 enum 固定写法

所有 enum 都必须给出类型定义代码块和变体表。即使 enum 不是状态机,也必须说明每个 variant 的业务语义。

固定写法:

```rust
/// 契约生命周期状态集合。
///
/// 该枚举只表达状态值本身;合法迁移必须由 `ContractLifecycle` 或聚合函数控制。
pub enum ContractLifecycleState {
    /// 草稿状态,不允许被下游作为权威契约引用。
    Draft,

    /// 评审中状态,表示契约已经进入发布前检查路径。
    InReview,

    /// 已发布状态,表示契约已经成为权威共享契约。
    Published,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `/// 草稿状态,不允许被下游作为权威契约引用。` | 表示可编辑草稿 | `Type::initial_draft(...)` | `InReview` |
| `InReview` | `/// 评审中状态,表示契约已经进入发布前检查路径。` | 表示发布前检查中 | `Draft` | `Published` |
| `Published` | `/// 已发布状态,表示契约已经成为权威共享契约。` | 表示权威契约 | `InReview` | 后续由正式状态矩阵定义 |

写法要求:

- enum 类型注释必须说明该 enum 表达的是状态、分类、错误集合还是结果集合。
- 每个 variant 上方必须有 `///` 注释。
- 状态类 enum 的 `允许来源` 和 `允许去向` 必须写清楚;完整状态矩阵仍留给 Step 10。
- 非状态类 enum 的 `允许来源` 和 `允许去向` 可写 `不适用`。
- 带载荷 variant 必须说明载荷类型的语义,例如 `Validation(ValidationError)` 表示字段、payload 或协议校验失败。

#### 9.1.5 函数签名写法

| 函数类别 | 写法示例 | 说明 |
|---|---|---|
| 成员函数 | `pub fn update_draft(&mut self, spec: ContractDefinitionDraftSpec, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 修改对象自身状态;必须写 `&mut self` 和错误类型 |
| 只读成员函数 | `pub fn can_transition_to(&self, target: ContractLifecycleState) -> bool` | 不修改状态;返回判断结果 |
| 工厂函数 | `pub fn create_draft(spec: ContractDefinitionDraftSpec, actor: ActorContext, now: Timestamp) -> Result<ContractDefinition, DomainError>` | 从命令载荷或领域 spec 创建新对象 |
| 恢复函数 | `pub fn rehydrate(record: ContractDefinitionRecord) -> Result<ContractDefinition, DomainError>` | 从持久化记录恢复对象;不得触发新业务副作用 |
| 纯策略函数 | `pub fn evaluate(scope: ContractScope, candidate: ContractDefinitionDraftSpec) -> Result<ScopeDecision, DomainError>` | 不依赖 repository 或外部 I/O |
| 应用服务函数 | `pub async fn create_contract_draft(&self, command: CreateContractDraft, actor: ActorContext, meta: CommandMetadata) -> Result<ContractChangeReceipt, ApplicationError>` | 编排 use case;函数级处理流留给 Step 9 |

函数表必须补充:

| 列 | 要求 |
|---|---|
| 函数签名 | 必须包含可见性、函数名、参数类型、返回类型 |
| 作用 | 说明函数负责维护什么领域语义 |
| 参数说明 | 逐个解释参数对象的来源和用途 |
| 返回 | 明确成功返回对象和错误类型 |
| 副作用 / 不变量 | 说明是否修改对象状态、是否产生记录、是否禁止外部 I/O |

#### 9.1.6 Rustdoc 注释粒度

Rust 契约片段必须按以下粒度写注释:

| 目标 | 是否必须注释 | 注释内容 |
|---|---|---|
| `struct` / `enum` / `trait` | 必须 | 类型表达的业务边界和不变量 |
| struct 字段 | 必须 | 字段作用、来源或约束 |
| enum variant | 必须 | 该取值的业务语义和使用场景 |
| public function | 必须 | 函数作用、关键约束或副作用 |
| private helper | 本文通常不写 | 详细设计不提前展开私有 helper |

示例:

```rust
/// 契约定义聚合根,维护共享契约真相、生命周期和演进不变量。
pub struct ContractDefinition {
    /// 契约定义唯一标识,创建后不得变更。
    pub definition_id: ContractDefinitionId,

    /// 当前生命周期状态,所有状态迁移必须通过聚合函数完成。
    pub lifecycle: ContractLifecycle,
}

impl ContractDefinition {
    /// 更新草稿内容,仅允许在可编辑生命周期内调用。
    pub fn update_draft(
        &mut self,
        spec: ContractDefinitionDraftSpec,
        actor: ActorContext,
        now: Timestamp,
    ) -> Result<(), DomainError> {
        todo!("详细设计只表达签名契约,不在本步实现函数体")
    }
}
```

#### 9.1.7 本步不展开的内容

| 内容 | 不在本步展开的原因 | 后续 Step |
|---|---|---|
| repository / port trait 方法全集 | 属于外部依赖边界契约 | Step 7 |
| infra adapter 字段和实现细节 | 依赖 port 契约和持久化取舍 | Step 7 / Step 11 |
| Command / Query / Event / Job 完整 schema | 属于协议契约 | Step 8 |
| 逐接口函数级伪代码 | 依赖对象、trait 和协议都收稳后才能写 | Step 9 |
| 完整状态转换矩阵 | 需要先收稳所有状态 enum | Step 10 |
| DDL、索引、事务边界 | 属于持久化和一致性契约 | Step 11 |
| 测试用例细节 | 属于测试切口和测试方案 | Step 16 / `05-测试方案.md` |

### 9.2 资产与公共协议支撑对象

本节覆盖 `contract_source_assets`、`release_snapshot_assets` 和 `contracts` 中的基础支撑对象。

边界说明:

| 模块 | 本节定义 | 本节不定义 |
|---|---|---|
| `contract_source_assets` | 契约源码逻辑引用对象 | 文件系统 adapter、源码格式解析器 |
| `release_snapshot_assets` | 发布快照逻辑引用对象 | 快照导出流程、snapshot store 实现 |
| `contracts` | actor、metadata、receipt、error 等跨接口支撑对象 | Command / Query / Event / Job 完整 schema |

#### 9.2.1 `ContractSourceRef`

###### 类型定义

```rust
/// 契约源码逻辑引用,指向 `contract-source/` 中的一份结构化契约来源。
///
/// 该对象只表达引用语义和边界校验结果,不负责读取文件、解析源码或执行工具链。
pub struct ContractSourceRef {
    /// 契约源码逻辑路径,必须位于 `contract-source/` 根目录之下。
    pub source_path: ContractSourcePath,

    /// 契约源码类别,用于区分核心契约、领域包契约和外部引用说明。
    pub source_kind: ContractSourceKind,

    /// 该源码引用关联的契约定义标识,尚未绑定定义时允许为空。
    pub definition_id: Option<ContractDefinitionId>,

    /// 该源码的语义指纹,用于判断源码是否发生漂移。
    pub fingerprint: Option<ContractFingerprint>,
}
```

辅助 enum:

```rust
/// 契约源码类别集合。
///
/// 该枚举只表达源码在 `contract-source/` 下的组织类别,不表达具体文件格式。
pub enum ContractSourceKind {
    /// 共享契约核心源码。
    Core,

    /// 面向某个下游消费域的契约包源码。
    Package,

    /// 标准、ADR、评审或下游反馈等外部引用说明。
    Reference,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Core` | `/// 共享契约核心源码。` | 表达 `contract-source/core/` 下的源码 | 不适用 | 不适用 |
| `Package` | `/// 面向某个下游消费域的契约包源码。` | 表达 `contract-source/packages/<domain>/` 下的源码 | 不适用 | 不适用 |
| `Reference` | `/// 标准、ADR、评审或下游反馈等外部引用说明。` | 表达 `contract-source/references/` 下的引用说明 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `source_path` | `ContractSourcePath` | 定位契约源码逻辑位置 | 必须在 `contract-source/` 根目录下,不能是绝对路径 |
| `source_kind` | `ContractSourceKind` | 标识源码类别 | 必须与路径前缀一致 |
| `definition_id` | `Option<ContractDefinitionId>` | 绑定契约定义 | 草稿导入前可以为空 |
| `fingerprint` | `Option<ContractFingerprint>` | 记录语义指纹 | 未计算前可以为空 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_under_contract_source_root(&self) -> bool` | 判断引用是否位于契约源码根目录下 | 无 | `bool` | 只读判断,不访问文件系统 |
| `pub fn points_to_definition(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否绑定指定契约定义 | `definition_id: ContractDefinitionId` 表示待比较定义 | `bool` | 不修改引用 |
| `pub fn has_fingerprint(&self) -> bool` | 判断是否已有语义指纹 | 无 | `bool` | 不计算新指纹 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(source_path: ContractSourcePath, source_kind: ContractSourceKind, definition_id: Option<ContractDefinitionId>) -> Result<ContractSourceRef, ContractError>` | 创建源码引用 | `source_path` 为逻辑路径;`source_kind` 为源码类别;`definition_id` 为可选绑定定义 | `Result<ContractSourceRef, ContractError>` | 从 CLI 或 infra adapter 发现源码后创建引用 |
| `pub fn rehydrate(record: ContractSourceRefRecord) -> Result<ContractSourceRef, ContractError>` | 从持久化记录恢复引用 | `record: ContractSourceRefRecord` 为持久化记录 | `Result<ContractSourceRef, ContractError>` | projection 或 repository 恢复 |

###### 不变量与禁止事项

- `ContractSourceRef` 只表达逻辑引用,不得读取文件正文。
- `source_path` 不能逃逸到 `contract-source/` 之外。
- `source_kind` 必须与路径语义一致。
- 指纹生成和源码解析由 infra / toolchain 承担,不属于该对象。

#### 9.2.2 `ContractPackageSourceRef`

###### 类型定义

```rust
/// 领域契约包源码引用,指向 `contract-source/packages/<domain>/` 下的包级来源。
///
/// 该对象用于把消费域、包源码和包版本锚点绑定在一起。
pub struct ContractPackageSourceRef {
    /// 下游消费域,决定该包属于 identity、conversation、work、process、governance 或 artifact。
    pub consumer_domain: ContractDomain,

    /// 包级源码引用。
    pub source_ref: ContractSourceRef,

    /// 包源码关联的包版本,尚未发布时允许为空。
    pub package_version: Option<ContractPackageVersion>,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `consumer_domain` | `ContractDomain` | 标识该源码包服务哪个消费域 | 只能取 L0-core 支持的共享契约消费域 |
| `source_ref` | `ContractSourceRef` | 指向包源码位置 | `source_ref.source_kind` 必须是 `ContractSourceKind::Package` |
| `package_version` | `Option<ContractPackageVersion>` | 绑定包版本 | 发布前允许为空 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn belongs_to(&self, consumer_domain: ContractDomain) -> bool` | 判断是否属于指定消费域 | `consumer_domain: ContractDomain` 为待比较消费域 | `bool` | 不修改对象 |
| `pub fn as_source_ref(&self) -> &ContractSourceRef` | 读取底层源码引用 | 无 | `&ContractSourceRef` | 不暴露文件系统访问能力 |
| `pub fn has_package_version(&self) -> bool` | 判断是否已经绑定包版本 | 无 | `bool` | 不生成版本 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(consumer_domain: ContractDomain, source_ref: ContractSourceRef, package_version: Option<ContractPackageVersion>) -> Result<ContractPackageSourceRef, ContractError>` | 创建包源码引用 | `consumer_domain` 为消费域;`source_ref` 为包源码引用;`package_version` 为可选版本 | `Result<ContractPackageSourceRef, ContractError>` | 导入或重建包索引 |
| `pub fn rehydrate(record: ContractPackageSourceRefRecord) -> Result<ContractPackageSourceRef, ContractError>` | 从持久化记录恢复 | `record: ContractPackageSourceRefRecord` 为持久化记录 | `Result<ContractPackageSourceRef, ContractError>` | repository 恢复 |

###### 不变量与禁止事项

- 只能指向 `contract-source/packages/<domain>/` 下的包源码。
- 不能保存下游业务实现正文。
- 不能替代 `ContractPackage` 领域对象,它只是源码引用。

#### 9.2.3 `ReleaseSnapshotRef`

###### 类型定义

```rust
/// 发布快照逻辑引用,指向 `release-snapshots/` 下的只读快照资产。
///
/// 该对象只表达快照引用和发布基线绑定关系,不负责导出或读取快照正文。
pub struct ReleaseSnapshotRef {
    /// 发布快照唯一标识。
    pub snapshot_id: ContractReleaseSnapshotId,

    /// 该快照来源的发布基线。
    pub baseline_id: ContractReleaseBaselineId,

    /// 快照逻辑路径,必须位于 `release-snapshots/` 根目录下。
    pub snapshot_path: ReleaseSnapshotPath,

    /// 快照语义指纹,用于对账和漂移判断。
    pub fingerprint: ContractFingerprint,

    /// 快照导出时间。
    pub exported_at: Timestamp,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `snapshot_id` | `ContractReleaseSnapshotId` | 标识一份发布快照 | 创建后不得变更 |
| `baseline_id` | `ContractReleaseBaselineId` | 绑定来源发布基线 | 必须指向已发布或可追溯基线 |
| `snapshot_path` | `ReleaseSnapshotPath` | 定位快照逻辑路径 | 必须位于 `release-snapshots/` 下 |
| `fingerprint` | `ContractFingerprint` | 支撑快照对账 | 必须来自 canonical snapshot |
| `exported_at` | `Timestamp` | 记录导出时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn points_to_baseline(&self, baseline_id: ContractReleaseBaselineId) -> bool` | 判断是否指向指定基线 | `baseline_id: ContractReleaseBaselineId` 为待比较基线 | `bool` | 只读判断 |
| `pub fn is_under_release_snapshot_root(&self) -> bool` | 判断路径是否在快照根目录下 | 无 | `bool` | 不访问文件系统 |
| `pub fn matches_fingerprint(&self, fingerprint: ContractFingerprint) -> bool` | 判断指纹是否一致 | `fingerprint: ContractFingerprint` 为待比较指纹 | `bool` | 不重新计算指纹 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(snapshot_id: ContractReleaseSnapshotId, baseline_id: ContractReleaseBaselineId, snapshot_path: ReleaseSnapshotPath, fingerprint: ContractFingerprint, exported_at: Timestamp) -> Result<ReleaseSnapshotRef, ContractError>` | 创建发布快照引用 | 参数分别来自快照派生结果、基线和 clock | `Result<ReleaseSnapshotRef, ContractError>` | 快照导出完成后记录引用 |
| `pub fn rehydrate(record: ReleaseSnapshotRefRecord) -> Result<ReleaseSnapshotRef, ContractError>` | 从持久化记录恢复 | `record: ReleaseSnapshotRefRecord` 为持久化记录 | `Result<ReleaseSnapshotRef, ContractError>` | repository 或 projection 恢复 |

###### 不变量与禁止事项

- 发布快照引用必须只读。
- `ReleaseSnapshotRef` 不反向拥有 `ContractDefinition` 真相。
- 快照导出、读取和校验由 infra / toolchain 处理,不属于该对象。

#### 9.2.4 `ActorRef`

###### 类型定义

```rust
/// 操作者引用,表达命令、查询、后台任务或系统动作的发起主体。
///
/// 该对象只承接外层可信入口提供的主体信息,不执行认证或权限校验。
pub struct ActorRef {
    /// 操作者唯一标识。
    pub actor_id: ActorId,

    /// 操作者类型,用于区分人类、AI member、系统任务和外部集成。
    pub actor_kind: ActorKind,

    /// 可选展示名,只用于审计和可读输出。
    pub display_name: Option<String>,
}
```

辅助 enum:

```rust
/// 操作者类型集合。
///
/// 该枚举表达请求发起主体的类别,不表达授权级别。
pub enum ActorKind {
    /// 人类操作者。
    Human,

    /// AI member 操作者。
    AiMember,

    /// 系统后台任务操作者。
    System,

    /// 外部集成或自动化入口。
    Integration,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Human` | `/// 人类操作者。` | 表示由人类发起 | 不适用 | 不适用 |
| `AiMember` | `/// AI member 操作者。` | 表示由 AI member 发起 | 不适用 | 不适用 |
| `System` | `/// 系统后台任务操作者。` | 表示由内部系统任务发起 | 不适用 | 不适用 |
| `Integration` | `/// 外部集成或自动化入口。` | 表示由外部集成入口发起 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `actor_id` | `ActorId` | 标识操作者 | 必须由外层可信入口或系统任务上下文提供 |
| `actor_kind` | `ActorKind` | 表达操作者类别 | 不得用于替代权限校验 |
| `display_name` | `Option<String>` | 审计和展示辅助 | 不能作为唯一身份依据 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_system(&self) -> bool` | 判断是否系统操作者 | 无 | `bool` | 只读判断 |
| `pub fn is_ai_member(&self) -> bool` | 判断是否 AI member | 无 | `bool` | 只读判断 |
| `pub fn same_actor(&self, other: ActorRef) -> bool` | 判断是否同一操作者 | `other: ActorRef` 为待比较操作者 | `bool` | 只比较标识和类型 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_gateway_subject(subject: GatewaySubject) -> Result<ActorRef, ContractError>` | 从外层可信入口注入主体创建引用 | `subject: GatewaySubject` 为网关注入主体 | `Result<ActorRef, ContractError>` | CLI / gateway context loading |
| `pub fn system(actor_id: ActorId) -> ActorRef` | 创建系统操作者引用 | `actor_id: ActorId` 为系统任务主体 | `ActorRef` | 后台 job 或 outbox relay |

###### 不变量与禁止事项

- `ActorRef` 不做认证授权。
- `display_name` 不能作为身份判断依据。
- 权限和访问控制属于外层 gateway 或治理边界,不在 L0-core 内实现。

#### 9.2.5 `ActorContext`

###### 类型定义

```rust
/// 操作者上下文,把主体、委托关系、角色提示和请求来源绑定到一次调用。
///
/// 该对象用于审计、追溯和应用服务编排,不承担身份校验。
pub struct ActorContext {
    /// 当前实际操作者。
    pub actor: ActorRef,

    /// 可选委托来源,用于表达代办或系统代理场景。
    pub delegated_by: Option<ActorRef>,

    /// 外层可信入口传入的角色提示。
    pub role_refs: Vec<RoleRef>,

    /// 请求来源类型。
    pub request_origin: RequestOrigin,
}
```

辅助 enum:

```rust
/// 请求来源类型集合。
///
/// 该枚举表达调用来自同步入口、后台任务还是系统恢复路径。
pub enum RequestOrigin {
    /// 同步命令入口。
    Command,

    /// 同步查询入口。
    Query,

    /// 后台任务入口。
    Job,

    /// 运维或恢复入口。
    Operations,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Command` | `/// 同步命令入口。` | 表示写路径调用 | 不适用 | 不适用 |
| `Query` | `/// 同步查询入口。` | 表示读路径调用 | 不适用 | 不适用 |
| `Job` | `/// 后台任务入口。` | 表示 job 调用 | 不适用 | 不适用 |
| `Operations` | `/// 运维或恢复入口。` | 表示运维触发 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `actor` | `ActorRef` | 当前操作者 | 必须存在 |
| `delegated_by` | `Option<ActorRef>` | 委托来源 | 只能作为审计信息 |
| `role_refs` | `Vec<RoleRef>` | 角色提示 | 不得在本仓内解释成权限判定 |
| `request_origin` | `RequestOrigin` | 请求来源 | 用于审计和错误定位 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn actor_ref(&self) -> &ActorRef` | 读取当前操作者 | 无 | `&ActorRef` | 只读 |
| `pub fn is_delegated(&self) -> bool` | 判断是否委托调用 | 无 | `bool` | 只读 |
| `pub fn has_role_hint(&self, role_ref: RoleRef) -> bool` | 判断是否包含某个角色提示 | `role_ref: RoleRef` 为待比较角色 | `bool` | 不做权限校验 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_gateway_headers(headers: GatewayHeaders) -> Result<ActorContext, ContractError>` | 从外层可信入口注入的 header 构造上下文 | `headers: GatewayHeaders` 包含主体、角色提示和来源 | `Result<ActorContext, ContractError>` | CLI / gateway context loading |
| `pub fn for_system_job(actor: ActorRef) -> ActorContext` | 创建系统 job 上下文 | `actor: ActorRef` 必须是系统主体 | `ActorContext` | 后台 job |

###### 不变量与禁止事项

- `ActorContext` 不校验 token、session 或 credential。
- `role_refs` 只作为外部已判定上下文的审计提示。
- 所有写路径必须显式携带 `ActorContext`。

#### 9.2.6 `RequestMetadata`

###### 类型定义

```rust
/// 请求元数据,表达一次调用的追踪、幂等和来源信息。
///
/// 该对象是 command、query 和 job metadata 的公共基础。
pub struct RequestMetadata {
    /// 请求唯一标识。
    pub request_id: RequestId,

    /// 分布式追踪标识。
    pub trace_id: TraceId,

    /// 可选幂等键,写路径必须提供。
    pub idempotency_key: Option<IdempotencyKey>,

    /// 请求创建时间。
    pub requested_at: Timestamp,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `request_id` | `RequestId` | 标识一次请求 | 必须唯一 |
| `trace_id` | `TraceId` | 串联调用链 | 必须由入口注入或生成 |
| `idempotency_key` | `Option<IdempotencyKey>` | 支撑幂等 | command 必须有,query 可为空 |
| `requested_at` | `Timestamp` | 请求时间 | 由入口或 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断是否包含幂等键 | 无 | `bool` | 不创建幂等记录 |
| `pub fn trace_id(&self) -> &TraceId` | 读取追踪标识 | 无 | `&TraceId` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(request_id: RequestId, trace_id: TraceId, idempotency_key: Option<IdempotencyKey>, requested_at: Timestamp) -> RequestMetadata` | 创建请求元数据 | 参数由入口上下文提供 | `RequestMetadata` | command / query / job metadata 组装 |
| `pub fn from_gateway_headers(headers: GatewayHeaders, now: Timestamp) -> Result<RequestMetadata, ContractError>` | 从外层可信入口 header 构造元数据 | `headers: GatewayHeaders` 为入口 header;`now: Timestamp` 为当前时间 | `Result<RequestMetadata, ContractError>` | CLI / gateway context loading |

###### 不变量与禁止事项

- `RequestMetadata` 不保存业务 payload。
- 幂等检查由 application service 和 port 协作完成,本对象只携带键。
- `trace_id` 不能作为业务主键。

#### 9.2.7 `CommandMetadata`

###### 类型定义

```rust
/// 写请求元数据,表达 command 调用所需的追踪、幂等和原因说明。
///
/// 所有改写真相的 command 都必须携带该对象。
pub struct CommandMetadata {
    /// 公共请求元数据。
    pub request: RequestMetadata,

    /// 变更原因,用于审计和追溯。
    pub reason: Option<ChangeReason>,

    /// 外部请求来源引用,例如工单、ADR、评审或变更单。
    pub external_ref: Option<ExternalReferenceRef>,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `request` | `RequestMetadata` | 承接请求追踪和幂等 | `request.idempotency_key` 必须存在 |
| `reason` | `Option<ChangeReason>` | 记录变更原因 | 生命周期变更建议必填 |
| `external_ref` | `Option<ExternalReferenceRef>` | 绑定外部证据 | 只保存引用,不保存正文 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn idempotency_key(&self) -> Result<IdempotencyKey, ContractError>` | 读取必需幂等键 | 无 | `Result<IdempotencyKey, ContractError>` | 若为空返回错误,不创建记录 |
| `pub fn has_external_ref(&self) -> bool` | 判断是否绑定外部证据 | 无 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(request: RequestMetadata, reason: Option<ChangeReason>, external_ref: Option<ExternalReferenceRef>) -> Result<CommandMetadata, ContractError>` | 创建写请求元数据 | `request` 为公共元数据;`reason` 为变更原因;`external_ref` 为外部引用 | `Result<CommandMetadata, ContractError>` | command DTO 组装 |

###### 不变量与禁止事项

- 写路径必须携带幂等键。
- `external_ref` 只保存引用,不得复制 ADR、评审或工单正文。
- `CommandMetadata` 不替代 `ActorContext`。

#### 9.2.8 `QueryMetadata`

###### 类型定义

```rust
/// 读请求元数据,表达 query 调用所需的追踪、分页和一致性偏好。
///
/// 该对象不得携带会导致真相变更的信息。
pub struct QueryMetadata {
    /// 公共请求元数据。
    pub request: RequestMetadata,

    /// 可选分页参数。
    pub page: Option<PageRequest>,

    /// 查询一致性偏好。
    pub consistency: QueryConsistency,
}
```

辅助 enum:

```rust
/// 查询一致性偏好集合。
///
/// 该枚举表达查询希望读取权威真相还是允许读取投影。
pub enum QueryConsistency {
    /// 尽量读取权威真相或最新可用视图。
    Strong,

    /// 允许读取最终一致投影。
    Eventual,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Strong` | `/// 尽量读取权威真相或最新可用视图。` | 用于详情或关键追溯查询 | 不适用 | 不适用 |
| `Eventual` | `/// 允许读取最终一致投影。` | 用于列表和普通查询 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `request` | `RequestMetadata` | 承接请求追踪 | `idempotency_key` 可为空 |
| `page` | `Option<PageRequest>` | 支撑列表分页 | 非列表查询可为空 |
| `consistency` | `QueryConsistency` | 表达一致性偏好 | 不得绕过边界读取外部正文 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_strong_consistency(&self) -> bool` | 判断是否强一致偏好 | 无 | `bool` | 只读 |
| `pub fn page_request(&self) -> Option<&PageRequest>` | 读取分页参数 | 无 | `Option<&PageRequest>` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(request: RequestMetadata, page: Option<PageRequest>, consistency: QueryConsistency) -> QueryMetadata` | 创建读请求元数据 | `request` 为公共元数据;`page` 为分页;`consistency` 为一致性偏好 | `QueryMetadata` | query DTO 组装 |

###### 不变量与禁止事项

- `QueryMetadata` 不允许触发写入。
- query 不要求幂等键。
- 一致性偏好只是读取策略输入,不改变数据所有权。

#### 9.2.9 `Receipt`

###### 类型定义

```rust
/// 通用处理回执,表达一次 command、job 或 operations 调用的提交结果。
///
/// 该对象只表达处理结果摘要,具体业务返回对象由 Step 8 的协议契约定义。
pub struct Receipt {
    /// 回执唯一标识。
    pub receipt_id: ReceiptId,

    /// 来源请求标识。
    pub request_id: RequestId,

    /// 处理状态。
    pub status: ReceiptStatus,

    /// 可选资源引用,用于指向创建或更新后的对象。
    pub resource_ref: Option<ResourceRef>,

    /// 回执生成时间。
    pub issued_at: Timestamp,
}
```

辅助 enum:

```rust
/// 回执状态集合。
///
/// 该枚举表达调用是否已被接收、完成或拒绝。
pub enum ReceiptStatus {
    /// 请求已被接收,后续可能由后台任务继续处理。
    Accepted,

    /// 请求已经同步完成。
    Completed,

    /// 请求被拒绝,没有改变真相。
    Rejected,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Accepted` | `/// 请求已被接收,后续可能由后台任务继续处理。` | 表示异步或后续处理 | 不适用 | 不适用 |
| `Completed` | `/// 请求已经同步完成。` | 表示同步完成 | 不适用 | 不适用 |
| `Rejected` | `/// 请求被拒绝,没有改变真相。` | 表示校验失败或非法请求 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `receipt_id` | `ReceiptId` | 标识回执 | 创建后不变 |
| `request_id` | `RequestId` | 关联来源请求 | 必须来自 `RequestMetadata` |
| `status` | `ReceiptStatus` | 表达处理状态 | 不表达领域生命周期 |
| `resource_ref` | `Option<ResourceRef>` | 指向相关资源 | 只保存引用 |
| `issued_at` | `Timestamp` | 回执生成时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_success(&self) -> bool` | 判断是否成功类回执 | 无 | `bool` | `Accepted` 和 `Completed` 视为成功类 |
| `pub fn is_rejected(&self) -> bool` | 判断是否拒绝 | 无 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn accepted(receipt_id: ReceiptId, request_id: RequestId, resource_ref: Option<ResourceRef>, issued_at: Timestamp) -> Receipt` | 创建已接收回执 | 参数来自请求和资源引用 | `Receipt` | command 接收后转后台处理 |
| `pub fn completed(receipt_id: ReceiptId, request_id: RequestId, resource_ref: Option<ResourceRef>, issued_at: Timestamp) -> Receipt` | 创建完成回执 | 参数来自请求和资源引用 | `Receipt` | 同步完成 |
| `pub fn rejected(receipt_id: ReceiptId, request_id: RequestId, issued_at: Timestamp) -> Receipt` | 创建拒绝回执 | 参数来自请求 | `Receipt` | 校验失败或非法转换 |

###### 不变量与禁止事项

- `Receipt` 不表达具体业务 payload。
- `ReceiptStatus` 不是领域状态机。
- 失败详情应由 `ErrorResponse` 表达。

#### 9.2.10 `ErrorResponse`

###### 类型定义

```rust
/// 对外错误响应,表达协议边界可见的错误码、消息和追踪信息。
///
/// 该对象用于 CLI / gateway / job 输出映射,不替代领域错误或应用错误类型。
pub struct ErrorResponse {
    /// 稳定错误码。
    pub error_code: ErrorCode,

    /// 面向调用方的简短错误消息。
    pub message: String,

    /// 请求追踪标识。
    pub trace_id: TraceId,

    /// 可选字段级错误详情。
    pub details: Vec<ErrorDetail>,
}
```

辅助 enum:

```rust
/// 对外错误码集合。
///
/// 该枚举表达协议边界可见的稳定错误分类。
pub enum ErrorCode {
    /// 请求字段或 payload 不合法。
    InvalidArgument,

    /// 请求的资源不存在。
    NotFound,

    /// 当前资源版本、幂等键或唯一约束发生冲突。
    Conflict,

    /// 当前状态、门禁、fingerprint 或引用前置条件不满足。
    PreconditionFailed,

    /// 外部依赖、repository、toolchain、projection 或 outbox 暂不可用。
    DependencyUnavailable,

    /// 内部错误,调用方不能依赖具体实现细节。
    Internal,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `InvalidArgument` | `/// 请求字段或 payload 不合法。` | 输入校验失败 | 不适用 | 不适用 |
| `NotFound` | `/// 请求的资源不存在。` | 资源不存在 | 不适用 | 不适用 |
| `Conflict` | `/// 当前资源版本、幂等键或唯一约束发生冲突。` | 并发、幂等或唯一约束冲突 | 不适用 | 不适用 |
| `PreconditionFailed` | `/// 当前状态、门禁、fingerprint 或引用前置条件不满足。` | 前置条件失败 | 不适用 | 不适用 |
| `DependencyUnavailable` | `/// 外部依赖、repository、toolchain、projection 或 outbox 暂不可用。` | 外部依赖不可用 | 不适用 | 不适用 |
| `Internal` | `/// 内部错误,调用方不能依赖具体实现细节。` | 未分类内部错误 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `error_code` | `ErrorCode` | 稳定错误分类 | 必须可用于调用方分支处理 |
| `message` | `String` | 简短错误消息 | 不泄露内部实现细节 |
| `trace_id` | `TraceId` | 支撑排查 | 必须来自请求元数据 |
| `details` | `Vec<ErrorDetail>` | 字段级或引用级错误详情 | 不保存敏感正文 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_retryable(&self) -> bool` | 判断错误是否适合重试 | 无 | `bool` | 只读判断 |
| `pub fn code(&self) -> &ErrorCode` | 读取错误码 | 无 | `&ErrorCode` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_domain_error(error: DomainError, trace_id: TraceId) -> ErrorResponse` | 从领域错误映射对外响应 | `error: DomainError` 为领域错误;`trace_id: TraceId` 为追踪标识 | `ErrorResponse` | domain 到协议边界映射 |
| `pub fn from_application_error(error: ApplicationError, trace_id: TraceId) -> ErrorResponse` | 从应用错误映射对外响应 | `error: ApplicationError` 为应用错误;`trace_id: TraceId` 为追踪标识 | `ErrorResponse` | application 到协议边界映射 |

###### 不变量与禁止事项

- `ErrorResponse` 是协议边界对象,不替代内部错误枚举。
- `message` 和 `details` 不得泄露凭据、文件正文或内部路径。
- 错误码必须稳定,不能随实现细节随意变化。

### 9.3 契约定义真相对象

本节覆盖 `domain_definition` 模块中的契约定义真相对象。本批先补齐聚合根 `ContractDefinition`;其余 `ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` 后续分批补齐。

边界说明:

| 对象 | 类型 | 本节处理状态 | 说明 |
|---|---|---|---|
| `ContractDefinition` | domain aggregate | 已补齐 | 契约定义真相聚合根 |
| `ContractScope` | domain value object | 已补齐 | 契约适用范围和共享边界 |
| `ContractVersion` | domain value object | 已补齐 | 契约版本位置和替代序列 |
| `ContractLifecycle` | domain state object | 已补齐 | 生命周期状态和合法迁移辅助 |
| `ContractEvolutionRecord` | domain record | 已补齐 | 契约演进追溯记录 |

#### 9.3.1 `ContractDefinition`

###### 类型定义

```rust
/// 契约定义聚合根,维护共享契约真相、版本锚点、生命周期锚点和演进不变量。
///
/// 该对象是 `domain_definition` 模块的核心真相对象;所有正文更新、提交评审、
/// 发布、弃用、退役和替代动作都必须通过聚合函数完成。
pub struct ContractDefinition {
    /// 契约定义唯一标识,创建后不得变更。
    pub definition_id: ContractDefinitionId,

    /// 契约定义类别,用于区分 API、event、schema、job、view 等契约类型。
    pub kind: ContractKind,

    /// 契约适用范围,决定该定义属于哪个共享边界和消费面。
    pub scope: ContractScope,

    /// 当前版本位置,用于发布、替代和追溯。
    pub version: ContractVersion,

    /// 当前生命周期,所有状态迁移必须通过聚合函数完成。
    pub lifecycle: ContractLifecycle,

    /// 契约正文引用,指向 canonical body 或结构化源码正文。
    pub body_ref: ContractBodyRef,

    /// 契约正文语义指纹,用于兼容判断、漂移判断和发布对账。
    pub fingerprint: ContractFingerprint,

    /// 允许进入本定义的结构化引用集合。
    pub reference_set: ContractReferenceList,

    /// 聚合内可见的演进记录列表,用于记录关键动作的追溯锚点。
    pub evolution_history: ContractEvolutionRecordList,

    /// 创建者引用,用于审计和追溯。
    pub created_by: ActorRef,

    /// 创建时间。
    pub created_at: Timestamp,

    /// 最近更新者引用。
    pub updated_by: ActorRef,

    /// 最近更新时间。
    pub updated_at: Timestamp,

    /// 聚合版本,用于乐观锁和并发写入保护。
    pub aggregate_version: Version,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `definition_id` | `ContractDefinitionId` | 标识一条共享契约定义 | 创建后不可变 |
| `kind` | `ContractKind` | 区分契约定义类别 | 必须属于 L0-core 支持的契约类别 |
| `scope` | `ContractScope` | 表达适用范围和共享边界 | 不能覆盖下游业务实例正文 |
| `version` | `ContractVersion` | 表达当前版本位置 | 发布、替代时必须单调演进 |
| `lifecycle` | `ContractLifecycle` | 表达当前生命周期 | 只能通过聚合函数迁移 |
| `body_ref` | `ContractBodyRef` | 指向契约正文 | 只保存引用,不保存外部正文 |
| `fingerprint` | `ContractFingerprint` | 表达 canonical 语义指纹 | 更新正文后必须同步变化 |
| `reference_set` | `ContractReferenceList` | 保存允许的结构化引用 | 只能包含通过边界校验的引用 |
| `evolution_history` | `ContractEvolutionRecordList` | 保存演进轨迹 | 关键状态变化必须追加记录 |
| `created_by` | `ActorRef` | 记录创建者 | 来自 `ActorContext` |
| `created_at` | `Timestamp` | 记录创建时间 | 由 clock port 注入 |
| `updated_by` | `ActorRef` | 记录最近更新者 | 每次领域变更后更新 |
| `updated_at` | `Timestamp` | 记录最近更新时间 | 每次领域变更后更新 |
| `aggregate_version` | `Version` | 支撑乐观锁 | repository 保存时必须校验 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn update_draft(&mut self, spec: ContractDefinitionDraftSpec, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 更新草稿正文、引用集合和指纹 | `spec` 是新的草稿定义内容;`actor` 是操作者上下文;`now` 是更新时间 | `Result<(), DomainError>` | 仅允许在可编辑生命周期调用;会更新 `body_ref`、`fingerprint`、`reference_set`、`updated_by`、`updated_at` 并追加演进记录 |
| `pub fn submit_for_review(&mut self, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 将草稿提交到评审状态 | `actor` 是操作者上下文;`now` 是提交时间 | `Result<(), DomainError>` | 必须从草稿态进入评审态;会追加演进记录 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 在门禁通过后标记定义为已发布 | `gate_ref` 是已批准门禁引用;`actor` 是发布者;`now` 是发布时间 | `Result<(), DomainError>` | 必须从评审态发布;不得绕过 approved gate;会追加发布演进记录 |
| `pub fn deprecate(&mut self, reason: LifecycleReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记契约定义为弃用 | `reason` 是弃用原因;`actor` 是操作者;`now` 是弃用时间 | `Result<(), DomainError>` | 仅允许从已发布态或兼容状态进入;会保留追溯 |
| `pub fn retire(&mut self, reason: LifecycleReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记契约定义为退役 | `reason` 是退役原因;`actor` 是操作者;`now` 是退役时间 | `Result<(), DomainError>` | 退役后进入终态;不得再编辑或重新发布 |
| `pub fn supersede(&mut self, new_definition_id: ContractDefinitionId, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记当前定义被新定义替代 | `new_definition_id` 是替代者定义 ID;`actor` 是操作者;`now` 是替代时间 | `Result<(), DomainError>` | 被替代后不得继续作为当前权威定义;必须追加替代记录 |
| `pub fn can_transition_to(&self, target: ContractLifecycleState) -> bool` | 判断是否允许迁移到目标生命周期状态 | `target` 是目标状态 | `bool` | 只读判断;不修改状态 |
| `pub fn is_published(&self) -> bool` | 判断当前定义是否已经发布 | 无 | `bool` | 只读判断 |
| `pub fn allows_edit(&self) -> bool` | 判断当前定义是否允许修改正文 | 无 | `bool` | 只读判断;必须委托生命周期语义 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(definition_id: ContractDefinitionId, spec: ContractDefinitionDraftSpec, actor: ActorContext, now: Timestamp) -> Result<ContractDefinition, DomainError>` | 创建草稿契约定义 | `definition_id` 是新定义 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<ContractDefinition, DomainError>` | `CreateContractDraft` 用例中初始化聚合 |
| `pub fn rehydrate(record: ContractDefinitionRecord) -> Result<ContractDefinition, DomainError>` | 从持久化记录恢复聚合 | `record` 是 repository 读取的持久化记录 | `Result<ContractDefinition, DomainError>` | repository 恢复对象;不得产生新演进记录 |

###### 不变量与禁止事项

- `ContractDefinition` 是共享契约真相聚合根,不能保存下游业务实例、运行事件实例、凭据正文或外部文档正文。
- 已发布定义不得原地改写正文;必须通过新版本、替代或生命周期迁移表达变化。
- 生命周期迁移必须通过聚合函数完成,不能直接改写 `lifecycle` 字段。
- 正文引用、指纹和引用集合必须保持一致;更新草稿时必须同时校验和更新。
- 发布必须携带 `ApprovedGateRef`,不能由工具链结果单独决定发布真相。
- 聚合函数不得直接调用 repository、filesystem、gateway、bus 或外部工具链。

#### 9.3.2 `ContractScope`

###### 类型定义

```rust
/// 契约范围值对象,表达一份契约定义适用的共享边界、消费域和引用规则。
///
/// 该对象只表达范围语义和纯判断,不保存下游业务正文,也不访问外部系统。
pub struct ContractScope {
    /// 契约范围唯一标识。
    pub scope_id: ContractScopeId,

    /// 范围所属的契约消费域或核心共享域。
    pub owner_domain: ContractDomain,

    /// 范围类别,用于区分核心契约、领域包契约和外部引用范围。
    pub scope_kind: ContractScopeKind,

    /// 范围规则集合,用于约束该契约允许覆盖的对象类别和引用边界。
    pub rules: ScopeRuleList,

    /// 范围内允许引用的结构化对象集合。
    pub reference_set: ContractReferenceSet,
}
```

辅助 enum:

```rust
/// 契约范围类别集合。
///
/// 该枚举表达范围的业务边界,不表达具体权限。
pub enum ContractScopeKind {
    /// 核心共享契约范围。
    Core,

    /// 面向某个下游消费域的契约包范围。
    Package,

    /// 仅用于外部标准、ADR 或评审引用的范围。
    ReferenceOnly,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Core` | `/// 核心共享契约范围。` | 表达跨域共享核心契约 | 不适用 | 不适用 |
| `Package` | `/// 面向某个下游消费域的契约包范围。` | 表达领域契约包范围 | 不适用 | 不适用 |
| `ReferenceOnly` | `/// 仅用于外部标准、ADR 或评审引用的范围。` | 表达只保存引用的范围 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `scope_id` | `ContractScopeId` | 标识范围 | 创建后不可变 |
| `owner_domain` | `ContractDomain` | 表达范围归属 | 必须是允许的共享契约域 |
| `scope_kind` | `ContractScopeKind` | 表达范围类别 | 必须与 `owner_domain` 和路径语义一致 |
| `rules` | `ScopeRuleList` | 记录范围规则 | 不能允许 Use truth、运行实例或凭据正文进入 |
| `reference_set` | `ContractReferenceSet` | 记录允许引用对象 | 只能包含结构化引用 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn contains(&self, kind: ContractKind) -> bool` | 判断范围是否允许某类契约 | `kind: ContractKind` 为待判断契约类别 | `bool` | 只读判断 |
| `pub fn matches(&self, other: ContractScope) -> bool` | 判断两个范围是否语义一致 | `other: ContractScope` 为待比较范围 | `bool` | 不修改对象 |
| `pub fn overlaps_with(&self, other: ContractScope) -> bool` | 判断两个范围是否重叠 | `other: ContractScope` 为待比较范围 | `bool` | 用于冲突检查 |
| `pub fn allows_reference(&self, reference: ContractReference) -> bool` | 判断是否允许某个结构化引用 | `reference: ContractReference` 为待判断引用 | `bool` | 不解析外部正文 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(scope_id: ContractScopeId, owner_domain: ContractDomain, scope_kind: ContractScopeKind, rules: ScopeRuleList, reference_set: ContractReferenceSet) -> Result<ContractScope, DomainError>` | 创建契约范围 | 参数分别为范围 ID、归属域、范围类别、规则集合和允许引用集合 | `Result<ContractScope, DomainError>` | 创建草稿定义或契约包时构造范围 |
| `pub fn from_persisted(record: ContractScopeRecord) -> Result<ContractScope, DomainError>` | 从持久化记录恢复范围 | `record: ContractScopeRecord` 为持久化记录 | `Result<ContractScope, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractScope` 不拥有独立生命周期,由 `ContractDefinition` 或 `ContractPackage` 生命周期约束。
- 范围规则不得允许下游业务实例、运行状态、凭据正文或外部文档正文进入本仓真相。
- 范围判断必须是纯函数,不能访问 repository、filesystem、gateway 或外部 resolver。

#### 9.3.3 `ContractVersion`

###### 类型定义

```rust
/// 契约版本值对象,表达契约定义的版本位置、前序版本和替代关系。
///
/// 该对象只表达版本语义和比较规则,不直接修改契约正文或发布基线。
pub struct ContractVersion {
    /// 当前版本值。
    pub version: VersionValue,

    /// 前一版本值,初始版本为空。
    pub previous_version: Option<VersionValue>,

    /// 被当前定义替代的契约定义标识。
    pub supersedes_definition_id: Option<ContractDefinitionId>,

    /// 版本表达方式。
    pub version_kind: ContractVersionKind,
}
```

辅助 enum:

```rust
/// 契约版本表达方式集合。
///
/// 该枚举表达版本号如何解释,不负责生成发布策略。
pub enum ContractVersionKind {
    /// 语义化版本。
    Semantic,

    /// 单调递增版本。
    Monotonic,

    /// 由外部标准或上游草案绑定的版本。
    ExternalBound,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Semantic` | `/// 语义化版本。` | 表达 semver 语义 | 不适用 | 不适用 |
| `Monotonic` | `/// 单调递增版本。` | 表达内部递增序列 | 不适用 | 不适用 |
| `ExternalBound` | `/// 由外部标准或上游草案绑定的版本。` | 表达外部绑定版本 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `version` | `VersionValue` | 当前版本值 | 不能为空 |
| `previous_version` | `Option<VersionValue>` | 前一版本 | 初始版本必须为空 |
| `supersedes_definition_id` | `Option<ContractDefinitionId>` | 被替代定义 | 只有替代场景需要 |
| `version_kind` | `ContractVersionKind` | 版本解释方式 | 创建后不应随意改变 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn next(&self) -> Result<ContractVersion, DomainError>` | 生成下一版本 | 无 | `Result<ContractVersion, DomainError>` | 不修改当前版本;返回新值对象 |
| `pub fn is_newer_than(&self, other: ContractVersion) -> bool` | 判断当前版本是否新于另一个版本 | `other: ContractVersion` 为待比较版本 | `bool` | 只读比较 |
| `pub fn is_initial(&self) -> bool` | 判断是否初始版本 | 无 | `bool` | 只读判断 |
| `pub fn supersedes(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否替代指定定义 | `definition_id: ContractDefinitionId` 为待判断定义 | `bool` | 只读判断 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn initial(version_kind: ContractVersionKind) -> ContractVersion` | 创建初始版本 | `version_kind: ContractVersionKind` 为版本表达方式 | `ContractVersion` | 创建草稿定义 |
| `pub fn from_persisted(value: VersionValue, previous_version: Option<VersionValue>, supersedes_definition_id: Option<ContractDefinitionId>, version_kind: ContractVersionKind) -> Result<ContractVersion, DomainError>` | 从持久化字段恢复版本 | 参数分别为当前版本、前序版本、替代定义和版本类型 | `Result<ContractVersion, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractVersion` 是不可变值对象;版本前进应返回新对象。
- `next()` 不能倒退版本。
- 替代关系只保存定义引用,不能复制被替代定义正文。
- 版本比较必须在相同 `ContractVersionKind` 语义下进行。

#### 9.3.4 `ContractLifecycle`

###### 类型定义

```rust
/// 契约生命周期对象,维护当前状态、状态变更操作者、变更时间和变更原因。
///
/// 该对象负责状态值判断和合法迁移辅助;实际状态迁移必须由 `ContractDefinition`
/// 聚合函数触发,不能由外部直接改写字段。
pub struct ContractLifecycle {
    /// 当前生命周期状态。
    pub state: ContractLifecycleState,

    /// 最近状态变更时间。
    pub changed_at: Timestamp,

    /// 最近状态变更操作者。
    pub changed_by: ActorRef,

    /// 最近状态变更原因。
    pub reason: Option<LifecycleReason>,
}
```

辅助 enum:

```rust
/// 契约生命周期状态集合。
///
/// 该枚举只表达状态值本身;完整迁移矩阵由 Step 10 固定。
pub enum ContractLifecycleState {
    /// 草稿状态,允许编辑但不能被下游作为权威契约引用。
    Draft,

    /// 评审中状态,表示契约已经进入发布前检查路径。
    InReview,

    /// 已发布状态,表示契约已经成为权威共享契约。
    Published,

    /// 已弃用状态,表示契约仍可追溯但不建议新增消费。
    Deprecated,

    /// 已退役状态,表示契约生命周期终止。
    Retired,

    /// 已被替代状态,表示当前定义被新定义取代。
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `/// 草稿状态,允许编辑但不能被下游作为权威契约引用。` | 表示可编辑草稿 | `ContractLifecycle::initial_draft(...)` | `InReview` |
| `InReview` | `/// 评审中状态,表示契约已经进入发布前检查路径。` | 表示发布前检查中 | `Draft` | `Published` / `Draft` |
| `Published` | `/// 已发布状态,表示契约已经成为权威共享契约。` | 表示权威共享契约 | `InReview` | `Deprecated` / `Retired` / `Superseded` |
| `Deprecated` | `/// 已弃用状态,表示契约仍可追溯但不建议新增消费。` | 表示不建议新增消费 | `Published` | `Retired` / `Superseded` |
| `Retired` | `/// 已退役状态,表示契约生命周期终止。` | 表示终态 | `Published` / `Deprecated` | 无 |
| `Superseded` | `/// 已被替代状态,表示当前定义被新定义取代。` | 表示终态替代 | `Published` / `Deprecated` | 无 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `state` | `ContractLifecycleState` | 当前生命周期状态 | 只能通过生命周期函数产生新状态 |
| `changed_at` | `Timestamp` | 最近状态变更时间 | 必须由 clock port 注入 |
| `changed_by` | `ActorRef` | 最近状态变更操作者 | 必须来自 `ActorContext` |
| `reason` | `Option<LifecycleReason>` | 状态变化原因 | 弃用、退役、替代场景必须存在 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_transition_to(&self, target: ContractLifecycleState) -> bool` | 判断是否允许迁移到目标状态 | `target: ContractLifecycleState` 为目标状态 | `bool` | 只读判断;完整矩阵由 Step 10 固定 |
| `pub fn allows_edit(&self) -> bool` | 判断当前状态是否允许编辑正文 | 无 | `bool` | 只有草稿态允许编辑 |
| `pub fn allows_new_reference(&self) -> bool` | 判断当前状态是否允许新增引用 | 无 | `bool` | 已发布和终态不得新增引用 |
| `pub fn is_terminal(&self) -> bool` | 判断是否终态 | 无 | `bool` | `Retired` 和 `Superseded` 为终态 |
| `pub fn transition_to(&self, target: ContractLifecycleState, actor: ActorContext, reason: Option<LifecycleReason>, now: Timestamp) -> Result<ContractLifecycle, DomainError>` | 生成迁移后的生命周期对象 | `target` 为目标状态;`actor` 为操作者;`reason` 为原因;`now` 为迁移时间 | `Result<ContractLifecycle, DomainError>` | 不修改当前对象;若迁移非法返回错误 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn initial_draft(actor: ActorContext, now: Timestamp) -> ContractLifecycle` | 创建初始草稿生命周期 | `actor: ActorContext` 为创建者;`now: Timestamp` 为创建时间 | `ContractLifecycle` | 创建草稿定义 |
| `pub fn from_persisted(state: ContractLifecycleState, changed_at: Timestamp, changed_by: ActorRef, reason: Option<LifecycleReason>) -> Result<ContractLifecycle, DomainError>` | 从持久化字段恢复生命周期 | 参数分别为状态、变更时间、变更者和原因 | `Result<ContractLifecycle, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractLifecycle` 不直接访问 `ContractDefinitionRepository` 或外部门禁。
- 生命周期字段不得被外部代码直接改写。
- 终态 `Retired` 和 `Superseded` 不允许再迁移到非终态。
- 弃用、退役和替代必须携带 `LifecycleReason`。
- `ContractLifecycleState` 的完整状态矩阵必须在 Step 10 再次复核并固定。

#### 9.3.5 `ContractEvolutionRecord`

###### 类型定义

```rust
/// 契约演进记录,表达契约定义在创建、更新、发布、弃用、退役和替代过程中的追溯锚点。
///
/// 该对象是不可变记录;创建后不得被原地改写,只能追加新的演进记录。
pub struct ContractEvolutionRecord {
    /// 演进记录唯一标识。
    pub record_id: ContractEvolutionRecordId,

    /// 关联的契约定义标识。
    pub definition_id: ContractDefinitionId,

    /// 演进行为类型。
    pub action: ContractEvolutionAction,

    /// 变更前版本。
    pub before_version: Option<ContractVersion>,

    /// 变更后版本。
    pub after_version: Option<ContractVersion>,

    /// 操作者引用。
    pub actor_ref: ActorRef,

    /// 可选门禁引用,发布相关记录必须存在。
    pub gate_ref: Option<ApprovedGateRef>,

    /// 可选生命周期变化原因。
    pub reason: Option<LifecycleReason>,

    /// 变更前语义指纹。
    pub fingerprint_before: Option<ContractFingerprint>,

    /// 变更后语义指纹。
    pub fingerprint_after: Option<ContractFingerprint>,

    /// 可选发布快照引用。
    pub snapshot_ref: Option<ReleaseSnapshotRef>,

    /// 记录发生时间。
    pub occurred_at: Timestamp,
}
```

辅助 enum:

```rust
/// 契约演进行为集合。
///
/// 该枚举表达演进记录代表的业务动作类型。
pub enum ContractEvolutionAction {
    /// 创建草稿定义。
    DraftCreated,

    /// 更新草稿定义。
    DraftUpdated,

    /// 提交进入评审。
    SubmittedForReview,

    /// 发布为权威契约。
    Published,

    /// 标记为弃用。
    Deprecated,

    /// 标记为退役。
    Retired,

    /// 被新定义替代。
    Superseded,

    /// 绑定发布快照。
    SnapshotBound,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `DraftCreated` | `/// 创建草稿定义。` | 记录定义创建 | 不适用 | 不适用 |
| `DraftUpdated` | `/// 更新草稿定义。` | 记录草稿正文或引用变化 | 不适用 | 不适用 |
| `SubmittedForReview` | `/// 提交进入评审。` | 记录进入评审路径 | 不适用 | 不适用 |
| `Published` | `/// 发布为权威契约。` | 记录发布动作 | 不适用 | 不适用 |
| `Deprecated` | `/// 标记为弃用。` | 记录弃用动作 | 不适用 | 不适用 |
| `Retired` | `/// 标记为退役。` | 记录退役动作 | 不适用 | 不适用 |
| `Superseded` | `/// 被新定义替代。` | 记录替代动作 | 不适用 | 不适用 |
| `SnapshotBound` | `/// 绑定发布快照。` | 记录快照绑定 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `record_id` | `ContractEvolutionRecordId` | 标识演进记录 | 创建后不可变 |
| `definition_id` | `ContractDefinitionId` | 关联定义 | 必须指向已有定义 |
| `action` | `ContractEvolutionAction` | 表达动作类型 | 必须与触发函数一致 |
| `before_version` | `Option<ContractVersion>` | 记录变更前版本 | 创建初始草稿时可为空 |
| `after_version` | `Option<ContractVersion>` | 记录变更后版本 | 退役等无版本变化场景可与前版本一致 |
| `actor_ref` | `ActorRef` | 记录操作者 | 来自 `ActorContext` |
| `gate_ref` | `Option<ApprovedGateRef>` | 记录门禁证据 | `Published` 动作必须存在 |
| `reason` | `Option<LifecycleReason>` | 记录变化原因 | 弃用、退役、替代必须存在 |
| `fingerprint_before` | `Option<ContractFingerprint>` | 记录变更前指纹 | 初始创建时可为空 |
| `fingerprint_after` | `Option<ContractFingerprint>` | 记录变更后指纹 | 正文变化后必须存在 |
| `snapshot_ref` | `Option<ReleaseSnapshotRef>` | 记录绑定快照 | 仅快照绑定或发布后派生场景使用 |
| `occurred_at` | `Timestamp` | 记录发生时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn bind_snapshot(&self, snapshot_ref: ReleaseSnapshotRef, actor: ActorContext, now: Timestamp) -> Result<ContractEvolutionRecord, DomainError>` | 基于当前记录创建快照绑定记录 | `snapshot_ref` 是发布快照引用;`actor` 是操作者;`now` 是绑定时间 | `Result<ContractEvolutionRecord, DomainError>` | 不修改当前记录;返回新的 `SnapshotBound` 记录 |
| `pub fn is_release_related(&self) -> bool` | 判断是否发布相关记录 | 无 | `bool` | 只读判断 |
| `pub fn has_fingerprint_change(&self) -> bool` | 判断指纹是否发生变化 | 无 | `bool` | 只读判断 |
| `pub fn requires_gate_ref(&self) -> bool` | 判断该动作是否必须绑定门禁 | 无 | `bool` | 只读判断 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_definition_change(record_id: ContractEvolutionRecordId, definition: ContractDefinition, action: ContractEvolutionAction, actor: ActorContext, now: Timestamp) -> Result<ContractEvolutionRecord, DomainError>` | 从定义变化创建演进记录 | `record_id` 是记录 ID;`definition` 是变化后的定义;`action` 是动作;`actor` 是操作者;`now` 是发生时间 | `Result<ContractEvolutionRecord, DomainError>` | 草稿创建、草稿更新、提交评审、弃用、退役、替代 |
| `pub fn from_release_result(record_id: ContractEvolutionRecordId, baseline: ContractReleaseBaseline, actor: ActorContext, now: Timestamp) -> Result<ContractEvolutionRecord, DomainError>` | 从发布基线创建发布演进记录 | `record_id` 是记录 ID;`baseline` 是发布基线;`actor` 是发布者;`now` 是发布时间 | `Result<ContractEvolutionRecord, DomainError>` | 发布基线收口后记录发布动作 |
| `pub fn create(spec: ContractEvolutionRecordSpec, actor: ActorContext, now: Timestamp) -> Result<ContractEvolutionRecord, DomainError>` | 从记录 spec 创建演进记录 | `spec` 是演进记录规范;`actor` 是操作者;`now` 是发生时间 | `Result<ContractEvolutionRecord, DomainError>` | application service 需要显式创建追溯记录时使用 |
| `pub fn rehydrate(record: ContractEvolutionRecordRow) -> Result<ContractEvolutionRecord, DomainError>` | 从持久化行恢复演进记录 | `record` 是持久化行 | `Result<ContractEvolutionRecord, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractEvolutionRecord` 创建后不可原地修改。
- 发布记录必须携带 `ApprovedGateRef`。
- 弃用、退役和替代记录必须携带 `LifecycleReason`。
- 演进记录只能保存引用、版本、指纹和操作者锚点,不能保存外部正文。
- 快照绑定必须通过新记录表达,不能修改历史发布记录。

### 9.4 领域契约包对象

本节覆盖 `domain_packages` 模块中的领域契约包对象。为了避免六个消费域包重复实现,详细设计采用“共享包核心对象 + 六个强类型 wrapper”的实现方式。

边界说明:

| 对象 | 类型 | 本节处理状态 | 说明 |
|---|---|---|---|
| `ContractPackageCore` | package core object | 已补齐 | 六个领域契约包共享的字段和行为 |
| `ContractPackageLifecycle` | package state object | 已补齐 | 包生命周期状态 |
| `IdentityContractPackage` | domain package wrapper | 已补齐 | identity 消费域契约包 |
| `ConversationContractPackage` | domain package wrapper | 已补齐 | conversation 消费域契约包 |
| `WorkContractPackage` | domain package wrapper | 已补齐 | work 消费域契约包 |
| `ProcessContractPackage` | domain package wrapper | 已补齐 | process 消费域契约包 |
| `GovernanceContractPackage` | domain package wrapper | 已补齐 | governance 消费域契约包 |
| `ArtifactContractPackage` | domain package wrapper | 已补齐 | artifact 消费域契约包 |

设计说明:

```text
对外概念仍保留六个 ContractPackage。
实现上使用 ContractPackageCore 承载共享字段和共享行为。
六个 wrapper 固定 consumer_domain,防止实现者误把 identity 包当成 work 包保存或发布。
```

#### 9.4.1 `ContractPackageCore`

###### 类型定义

```rust
/// 领域契约包共享核心对象,维护包 ID、消费域、版本、定义引用、快照引用和生命周期。
///
/// 该对象不直接作为对外领域包暴露;六个消费域包通过强类型 wrapper 使用它。
pub struct ContractPackageCore {
    /// 契约包唯一标识。
    pub package_id: ContractPackageId,

    /// 固定消费域。
    pub consumer_domain: ContractDomain,

    /// 契约包版本。
    pub package_version: ContractPackageVersion,

    /// 包内契约定义引用集合。
    pub definition_refs: ContractDefinitionRefList,

    /// 可选发布快照引用。
    pub snapshot_ref: Option<ReleaseSnapshotRef>,

    /// 包生命周期。
    pub lifecycle: ContractPackageLifecycle,

    /// 包发布时间。
    pub published_at: Option<Timestamp>,

    /// 包摘要,用于查询展示和下游读取。
    pub package_summary: ContractPackageSummary,

    /// 包聚合版本,用于乐观锁。
    pub aggregate_version: Version,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `package_id` | `ContractPackageId` | 标识契约包 | 创建后不可变 |
| `consumer_domain` | `ContractDomain` | 固定消费域 | wrapper 必须校验固定值 |
| `package_version` | `ContractPackageVersion` | 表达包版本 | 发布后不得原地改写 |
| `definition_refs` | `ContractDefinitionRefList` | 保存包内定义引用 | 只能引用已允许进入该消费域的定义 |
| `snapshot_ref` | `Option<ReleaseSnapshotRef>` | 绑定发布快照 | 发布后可绑定,不得指向不匹配基线 |
| `lifecycle` | `ContractPackageLifecycle` | 表达包状态 | 只能通过包函数迁移 |
| `published_at` | `Option<Timestamp>` | 记录发布时间 | 未发布时为空 |
| `package_summary` | `ContractPackageSummary` | 查询展示摘要 | 不保存下游实现正文 |
| `aggregate_version` | `Version` | 支撑乐观锁 | repository 保存时必须校验 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn add_definition_ref(&mut self, definition_id: ContractDefinitionId, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 向草稿包追加定义引用 | `definition_id` 是待加入定义;`actor` 是操作者;`now` 是更新时间 | `Result<(), DomainError>` | 仅草稿态允许;不得重复加入 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布契约包 | `gate_ref` 是门禁引用;`snapshot_ref` 是可选快照;`actor` 是发布者;`now` 是发布时间 | `Result<(), DomainError>` | 必须从草稿态发布;会更新生命周期和发布时间 |
| `pub fn deprecate(&mut self, reason: LifecycleReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 弃用契约包 | `reason` 是弃用原因;`actor` 是操作者;`now` 是弃用时间 | `Result<(), DomainError>` | 已发布包才允许弃用 |
| `pub fn retire(&mut self, reason: LifecycleReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 退役契约包 | `reason` 是退役原因;`actor` 是操作者;`now` 是退役时间 | `Result<(), DomainError>` | 退役后不得重新发布 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断包是否包含某定义 | `definition_id` 是待判断定义 | `bool` | 只读判断 |
| `pub fn can_be_consumed(&self) -> bool` | 判断是否可被下游消费 | 无 | `bool` | 只有已发布包可消费 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, consumer_domain: ContractDomain, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<ContractPackageCore, DomainError>` | 创建草稿契约包核心对象 | `package_id` 是包 ID;`consumer_domain` 是固定消费域;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<ContractPackageCore, DomainError>` | 六个 wrapper 的 `create_draft` 调用 |
| `pub fn rehydrate(record: ContractPackageRecord) -> Result<ContractPackageCore, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<ContractPackageCore, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractPackageCore` 不能绕过 wrapper 直接暴露给外部 use case。
- `definition_refs` 只能保存引用,不能复制 `ContractDefinition` 正文。
- 已发布包不得原地修改定义组合;变更必须通过新版本表达。
- 包发布必须携带 `ApprovedGateRef`。
- 包对象不得升级为 L1 业务实现或 SDK 发布物。

#### 9.4.2 `ContractPackageLifecycle`

###### 类型定义

```rust
/// 契约包生命周期对象,维护包状态、变更时间、变更者和原因。
///
/// 该对象只服务领域契约包,不等同于 `ContractDefinition` 生命周期。
pub struct ContractPackageLifecycle {
    /// 当前包生命周期状态。
    pub state: ContractPackageLifecycleState,

    /// 最近状态变更时间。
    pub changed_at: Timestamp,

    /// 最近状态变更操作者。
    pub changed_by: ActorRef,

    /// 最近状态变更原因。
    pub reason: Option<LifecycleReason>,
}
```

辅助 enum:

```rust
/// 契约包生命周期状态集合。
///
/// 该枚举表达领域契约包从草稿到发布、弃用和退役的状态。
pub enum ContractPackageLifecycleState {
    /// 草稿包,允许调整包内定义引用。
    Draft,

    /// 已发布包,允许下游消费。
    Published,

    /// 已弃用包,仍可追溯但不建议新增消费。
    Deprecated,

    /// 已退役包,生命周期终止。
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `/// 草稿包,允许调整包内定义引用。` | 表示可编辑包 | `ContractPackageLifecycle::initial_draft(...)` | `Published` |
| `Published` | `/// 已发布包,允许下游消费。` | 表示可消费包 | `Draft` | `Deprecated` / `Retired` |
| `Deprecated` | `/// 已弃用包,仍可追溯但不建议新增消费。` | 表示弃用包 | `Published` | `Retired` |
| `Retired` | `/// 已退役包,生命周期终止。` | 表示终态 | `Published` / `Deprecated` | 无 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `state` | `ContractPackageLifecycleState` | 当前包状态 | 只能通过包生命周期函数迁移 |
| `changed_at` | `Timestamp` | 最近变更时间 | 由 clock port 注入 |
| `changed_by` | `ActorRef` | 最近变更者 | 来自 `ActorContext` |
| `reason` | `Option<LifecycleReason>` | 状态变化原因 | 弃用和退役必须存在 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_transition_to(&self, target: ContractPackageLifecycleState) -> bool` | 判断是否允许迁移到目标状态 | `target` 是目标状态 | `bool` | 只读判断;完整矩阵由 Step 10 复核 |
| `pub fn allows_edit(&self) -> bool` | 判断是否允许编辑包内定义引用 | 无 | `bool` | 只有草稿态允许 |
| `pub fn can_be_consumed(&self) -> bool` | 判断是否可被下游消费 | 无 | `bool` | 只有已发布态允许 |
| `pub fn transition_to(&self, target: ContractPackageLifecycleState, actor: ActorContext, reason: Option<LifecycleReason>, now: Timestamp) -> Result<ContractPackageLifecycle, DomainError>` | 生成迁移后的包生命周期 | `target` 是目标状态;`actor` 是操作者;`reason` 是原因;`now` 是迁移时间 | `Result<ContractPackageLifecycle, DomainError>` | 不修改当前对象;非法迁移返回错误 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn initial_draft(actor: ActorContext, now: Timestamp) -> ContractPackageLifecycle` | 创建初始草稿包生命周期 | `actor` 是创建者;`now` 是创建时间 | `ContractPackageLifecycle` | 创建草稿包 |
| `pub fn from_persisted(state: ContractPackageLifecycleState, changed_at: Timestamp, changed_by: ActorRef, reason: Option<LifecycleReason>) -> Result<ContractPackageLifecycle, DomainError>` | 从持久化字段恢复 | 参数分别为状态、变更时间、变更者和原因 | `Result<ContractPackageLifecycle, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- 包生命周期不等同于契约定义生命周期。
- 退役包不得再回到草稿或发布状态。
- 弃用和退役必须携带 `LifecycleReason`。
- 包生命周期对象不访问 repository、filesystem、bus 或 gateway。

#### 9.4.3 `IdentityContractPackage`

###### 类型定义

```rust
/// identity 消费域契约包,固定封装 identity 可消费的共享契约集合。
pub struct IdentityContractPackage {
    /// 契约包共享核心对象,其 `consumer_domain` 必须为 `ContractDomain::Identity`。
    pub core: ContractPackageCore,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `core` | `ContractPackageCore` | 承载包共享字段和行为 | `core.consumer_domain` 必须为 `ContractDomain::Identity` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_core(&self) -> &ContractPackageCore` | 读取共享核心对象 | 无 | `&ContractPackageCore` | 只读 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布 identity 契约包 | 参数转交 `ContractPackageCore::publish(...)` | `Result<(), DomainError>` | 固定 identity 域,不得改写为其他域 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否包含定义 | `definition_id` 是待判断定义 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<IdentityContractPackage, DomainError>` | 创建 identity 草稿包 | `package_id` 是包 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<IdentityContractPackage, DomainError>` | identity 包初始化 |
| `pub fn rehydrate(core: ContractPackageCore) -> Result<IdentityContractPackage, DomainError>` | 从共享核心恢复 wrapper | `core` 是已恢复核心对象 | `Result<IdentityContractPackage, DomainError>` | repository 恢复后强类型封装 |

###### 不变量与禁止事项

- `IdentityContractPackage` 只能服务 identity 消费域。
- 不得包含 work、process、governance、artifact 或 conversation 专属实现正文。
- 不得绕过 `ContractPackageCore` 修改包生命周期。

#### 9.4.4 `ConversationContractPackage`

###### 类型定义

```rust
/// conversation 消费域契约包,固定封装 conversation 可消费的共享契约集合。
pub struct ConversationContractPackage {
    /// 契约包共享核心对象,其 `consumer_domain` 必须为 `ContractDomain::Conversation`。
    pub core: ContractPackageCore,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `core` | `ContractPackageCore` | 承载包共享字段和行为 | `core.consumer_domain` 必须为 `ContractDomain::Conversation` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_core(&self) -> &ContractPackageCore` | 读取共享核心对象 | 无 | `&ContractPackageCore` | 只读 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布 conversation 契约包 | 参数转交 `ContractPackageCore::publish(...)` | `Result<(), DomainError>` | 固定 conversation 域 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否包含定义 | `definition_id` 是待判断定义 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<ConversationContractPackage, DomainError>` | 创建 conversation 草稿包 | `package_id` 是包 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<ConversationContractPackage, DomainError>` | conversation 包初始化 |
| `pub fn rehydrate(core: ContractPackageCore) -> Result<ConversationContractPackage, DomainError>` | 从共享核心恢复 wrapper | `core` 是已恢复核心对象 | `Result<ConversationContractPackage, DomainError>` | repository 恢复后强类型封装 |

###### 不变量与禁止事项

- `ConversationContractPackage` 只能服务 conversation 消费域。
- 不得保存聊天消息正文、运行会话正文或外部平台原文。
- 不得绕过 `ContractPackageCore` 修改包生命周期。

#### 9.4.5 `WorkContractPackage`

###### 类型定义

```rust
/// work 消费域契约包,固定封装 work 可消费的共享契约集合。
pub struct WorkContractPackage {
    /// 契约包共享核心对象,其 `consumer_domain` 必须为 `ContractDomain::Work`。
    pub core: ContractPackageCore,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `core` | `ContractPackageCore` | 承载包共享字段和行为 | `core.consumer_domain` 必须为 `ContractDomain::Work` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_core(&self) -> &ContractPackageCore` | 读取共享核心对象 | 无 | `&ContractPackageCore` | 只读 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布 work 契约包 | 参数转交 `ContractPackageCore::publish(...)` | `Result<(), DomainError>` | 固定 work 域 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否包含定义 | `definition_id` 是待判断定义 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<WorkContractPackage, DomainError>` | 创建 work 草稿包 | `package_id` 是包 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<WorkContractPackage, DomainError>` | work 包初始化 |
| `pub fn rehydrate(core: ContractPackageCore) -> Result<WorkContractPackage, DomainError>` | 从共享核心恢复 wrapper | `core` 是已恢复核心对象 | `Result<WorkContractPackage, DomainError>` | repository 恢复后强类型封装 |

###### 不变量与禁止事项

- `WorkContractPackage` 只能服务 work 消费域。
- 不得保存 backlog、iteration、work item 实例正文。
- 不得绕过 `ContractPackageCore` 修改包生命周期。

#### 9.4.6 `ProcessContractPackage`

###### 类型定义

```rust
/// process 消费域契约包,固定封装 process 可消费的共享契约集合。
pub struct ProcessContractPackage {
    /// 契约包共享核心对象,其 `consumer_domain` 必须为 `ContractDomain::Process`。
    pub core: ContractPackageCore,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `core` | `ContractPackageCore` | 承载包共享字段和行为 | `core.consumer_domain` 必须为 `ContractDomain::Process` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_core(&self) -> &ContractPackageCore` | 读取共享核心对象 | 无 | `&ContractPackageCore` | 只读 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布 process 契约包 | 参数转交 `ContractPackageCore::publish(...)` | `Result<(), DomainError>` | 固定 process 域 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否包含定义 | `definition_id` 是待判断定义 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<ProcessContractPackage, DomainError>` | 创建 process 草稿包 | `package_id` 是包 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<ProcessContractPackage, DomainError>` | process 包初始化 |
| `pub fn rehydrate(core: ContractPackageCore) -> Result<ProcessContractPackage, DomainError>` | 从共享核心恢复 wrapper | `core` 是已恢复核心对象 | `Result<ProcessContractPackage, DomainError>` | repository 恢复后强类型封装 |

###### 不变量与禁止事项

- `ProcessContractPackage` 只能服务 process 消费域。
- 不得保存 process instance、runtime checkpoint 或 BPMN 实例正文。
- 不得绕过 `ContractPackageCore` 修改包生命周期。

#### 9.4.7 `GovernanceContractPackage`

###### 类型定义

```rust
/// governance 消费域契约包,固定封装 governance 可消费的共享契约集合。
pub struct GovernanceContractPackage {
    /// 契约包共享核心对象,其 `consumer_domain` 必须为 `ContractDomain::Governance`。
    pub core: ContractPackageCore,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `core` | `ContractPackageCore` | 承载包共享字段和行为 | `core.consumer_domain` 必须为 `ContractDomain::Governance` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_core(&self) -> &ContractPackageCore` | 读取共享核心对象 | 无 | `&ContractPackageCore` | 只读 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布 governance 契约包 | 参数转交 `ContractPackageCore::publish(...)` | `Result<(), DomainError>` | 固定 governance 域 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否包含定义 | `definition_id` 是待判断定义 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<GovernanceContractPackage, DomainError>` | 创建 governance 草稿包 | `package_id` 是包 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<GovernanceContractPackage, DomainError>` | governance 包初始化 |
| `pub fn rehydrate(core: ContractPackageCore) -> Result<GovernanceContractPackage, DomainError>` | 从共享核心恢复 wrapper | `core` 是已恢复核心对象 | `Result<GovernanceContractPackage, DomainError>` | repository 恢复后强类型封装 |

###### 不变量与禁止事项

- `GovernanceContractPackage` 只能服务 governance 消费域。
- 不得保存审批正文、策略执行实例或外部合规正文。
- 不得绕过 `ContractPackageCore` 修改包生命周期。

#### 9.4.8 `ArtifactContractPackage`

###### 类型定义

```rust
/// artifact 消费域契约包,固定封装 artifact 可消费的共享契约集合。
pub struct ArtifactContractPackage {
    /// 契约包共享核心对象,其 `consumer_domain` 必须为 `ContractDomain::Artifact`。
    pub core: ContractPackageCore,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `core` | `ContractPackageCore` | 承载包共享字段和行为 | `core.consumer_domain` 必须为 `ContractDomain::Artifact` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_core(&self) -> &ContractPackageCore` | 读取共享核心对象 | 无 | `&ContractPackageCore` | 只读 |
| `pub fn publish(&mut self, gate_ref: ApprovedGateRef, snapshot_ref: Option<ReleaseSnapshotRef>, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 发布 artifact 契约包 | 参数转交 `ContractPackageCore::publish(...)` | `Result<(), DomainError>` | 固定 artifact 域 |
| `pub fn contains(&self, definition_id: ContractDefinitionId) -> bool` | 判断是否包含定义 | `definition_id` 是待判断定义 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(package_id: ContractPackageId, spec: ContractPackageDraftSpec, actor: ActorContext, now: Timestamp) -> Result<ArtifactContractPackage, DomainError>` | 创建 artifact 草稿包 | `package_id` 是包 ID;`spec` 是草稿内容;`actor` 是创建者;`now` 是创建时间 | `Result<ArtifactContractPackage, DomainError>` | artifact 包初始化 |
| `pub fn rehydrate(core: ContractPackageCore) -> Result<ArtifactContractPackage, DomainError>` | 从共享核心恢复 wrapper | `core` 是已恢复核心对象 | `Result<ArtifactContractPackage, DomainError>` | repository 恢复后强类型封装 |

###### 不变量与禁止事项

- `ArtifactContractPackage` 只能服务 artifact 消费域。
- 不得保存 artifact blob 正文、报告正文或 implementation plan 正文。
- 不得绕过 `ContractPackageCore` 修改包生命周期。

### 9.5 发布、快照、消费引用与事实对象

本节覆盖 `domain_release`、`domain_snapshot` 和 `domain_fact` 模块中的发布、快照、消费引用与事实对象。本批先补齐 `ContractReleaseBaseline` 和 `CompatibilityStatus`;其余对象后续分批补齐。

边界说明:

| 对象 | 类型 | 本节处理状态 | 说明 |
|---|---|---|---|
| `ContractReleaseBaseline` | domain release record | 已补齐 | 发布基线与发布状态锚点 |
| `CompatibilityStatus` | domain state object | 已补齐 | 兼容性判断结果 |
| `ContractReleaseSnapshot` | domain snapshot | 已补齐 | 从发布基线派生的只读快照 |
| `DownstreamConsumptionRef` | reference model | 已补齐 | 下游消费引用 |
| `ContractFactRecord` | domain fact record | 已补齐 | 契约变化可感知事实 |

#### 9.5.1 `ContractReleaseBaseline`

###### 类型定义

```rust
/// 契约发布基线,表达某一版本契约已经通过门禁并形成发布锚点。
///
/// 该对象不保存契约正文,只保存定义、版本、范围、兼容状态、门禁、指纹和快照引用。
pub struct ContractReleaseBaseline {
    /// 发布基线唯一标识。
    pub baseline_id: ContractReleaseBaselineId,

    /// 对应契约定义标识。
    pub definition_id: ContractDefinitionId,

    /// 对应契约版本。
    pub version: ContractVersion,

    /// 发布范围。
    pub scope: ContractScope,

    /// 发布前兼容性判断结果。
    pub compatibility_status: CompatibilityStatus,

    /// 已通过门禁的引用。
    pub gate_ref: ApprovedGateRef,

    /// 发布时的 canonical 指纹。
    pub fingerprint: ContractFingerprint,

    /// 可选发布快照引用。
    pub snapshot_ref: Option<ReleaseSnapshotRef>,

    /// 发布基线状态。
    pub status: ContractReleaseBaselineStatus,

    /// 发布者。
    pub released_by: ActorRef,

    /// 发布时间。
    pub released_at: Timestamp,

    /// 基线聚合版本,用于乐观锁。
    pub aggregate_version: Version,
}
```

辅助 enum:

```rust
/// 发布基线状态集合。
///
/// 该枚举表达发布基线从准备到发布、替代和退役的状态。
pub enum ContractReleaseBaselineStatus {
    /// 已准备但尚未正式发布。
    Prepared,

    /// 已正式发布。
    Released,

    /// 已被新基线替代。
    Superseded,

    /// 已退役。
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Prepared` | `/// 已准备但尚未正式发布。` | 表示基线草稿或准备态 | `ContractReleaseBaseline::create_draft(...)` | `Released` |
| `Released` | `/// 已正式发布。` | 表示发布锚点成立 | `Prepared` | `Superseded` / `Retired` |
| `Superseded` | `/// 已被新基线替代。` | 表示终态替代 | `Released` | 无 |
| `Retired` | `/// 已退役。` | 表示终态退役 | `Released` | 无 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `baseline_id` | `ContractReleaseBaselineId` | 标识发布基线 | 创建后不可变 |
| `definition_id` | `ContractDefinitionId` | 绑定契约定义 | 必须指向可发布定义 |
| `version` | `ContractVersion` | 绑定契约版本 | 必须与定义当前版本一致 |
| `scope` | `ContractScope` | 表达发布范围 | 必须与定义范围一致 |
| `compatibility_status` | `CompatibilityStatus` | 表达兼容判断结果 | 发布前必须 passable |
| `gate_ref` | `ApprovedGateRef` | 记录门禁证据 | 发布必须存在 |
| `fingerprint` | `ContractFingerprint` | 发布指纹 | 必须来自 canonical 内容 |
| `snapshot_ref` | `Option<ReleaseSnapshotRef>` | 绑定快照 | 快照派生前可为空 |
| `status` | `ContractReleaseBaselineStatus` | 基线状态 | 只能通过成员函数迁移 |
| `released_by` | `ActorRef` | 发布者 | 来自 `ActorContext` |
| `released_at` | `Timestamp` | 发布时间 | 由 clock port 注入 |
| `aggregate_version` | `Version` | 支撑乐观锁 | repository 保存时校验 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_be_released(&self) -> bool` | 判断是否满足发布条件 | 无 | `bool` | 只读判断;要求 prepared 且兼容可放行 |
| `pub fn mark_released(&mut self, gate_ref: ApprovedGateRef, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记正式发布 | `gate_ref` 是门禁引用;`actor` 是发布者;`now` 是发布时间 | `Result<(), DomainError>` | 从 prepared 进入 released;更新门禁、发布者和时间 |
| `pub fn bind_snapshot(&mut self, snapshot_ref: ReleaseSnapshotRef) -> Result<(), DomainError>` | 绑定发布快照引用 | `snapshot_ref` 是快照引用 | `Result<(), DomainError>` | 只能绑定匹配当前基线的快照 |
| `pub fn supersede(&mut self, new_baseline_id: ContractReleaseBaselineId, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记被新基线替代 | `new_baseline_id` 是新基线;`actor` 是操作者;`now` 是替代时间 | `Result<(), DomainError>` | released 才可替代;不保存新基线正文 |
| `pub fn retire(&mut self, reason: LifecycleReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记基线退役 | `reason` 是退役原因;`actor` 是操作者;`now` 是退役时间 | `Result<(), DomainError>` | 进入终态;不得再绑定新快照 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(baseline_id: ContractReleaseBaselineId, definition: ContractDefinition, compatibility_status: CompatibilityStatus, gate_ref: ApprovedGateRef, actor: ActorContext, now: Timestamp) -> Result<ContractReleaseBaseline, DomainError>` | 创建发布基线准备态 | `baseline_id` 是基线 ID;`definition` 是待发布定义;`compatibility_status` 是兼容结果;`gate_ref` 是门禁引用;`actor` 是发布者;`now` 是创建时间 | `Result<ContractReleaseBaseline, DomainError>` | `PublishContractBaseline` 用例中创建基线 |
| `pub fn rehydrate(record: ContractReleaseBaselineRecord) -> Result<ContractReleaseBaseline, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<ContractReleaseBaseline, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- 发布基线不拥有契约正文,只绑定定义、版本、指纹和门禁引用。
- `Released` 后不得原地改写基线内容。
- 兼容状态不可放行时不得发布。
- 快照引用必须匹配当前基线。
- 发布基线不得直接触发 L0-bus 投递。

#### 9.5.2 `CompatibilityStatus`

###### 类型定义

```rust
/// 兼容性状态对象,表达发布前兼容性判断结果、检查时间、检查者和阻断原因。
///
/// 该对象只表达判断结果,不直接运行兼容性工具链。
pub struct CompatibilityStatus {
    /// 当前兼容性结果。
    pub value: CompatibilityValue,

    /// 最近检查时间。
    pub checked_at: Timestamp,

    /// 最近检查操作者。
    pub checked_by: ActorRef,

    /// 可选阻断原因。
    pub blocking_reason: Option<CompatibilityReason>,

    /// 可选兼容性追溯引用。
    pub trace_ref: Option<CompatibilityTraceRef>,
}
```

辅助 enum:

```rust
/// 兼容性结果集合。
///
/// 该枚举表达契约变化是否可通过兼容性门禁。
pub enum CompatibilityValue {
    /// 尚未完成兼容性判断。
    Pending,

    /// 兼容性检查通过。
    Compatible,

    /// 兼容性检查不通过。
    Incompatible,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `/// 尚未完成兼容性判断。` | 表示待检查 | `CompatibilityStatus::pending(...)` / 重新检查 | `Compatible` / `Incompatible` |
| `Compatible` | `/// 兼容性检查通过。` | 表示可放行发布 | `Pending` | `Pending` |
| `Incompatible` | `/// 兼容性检查不通过。` | 表示阻断发布 | `Pending` | `Pending` |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `value` | `CompatibilityValue` | 表达兼容结果 | 只能通过状态函数产生 |
| `checked_at` | `Timestamp` | 最近检查时间 | 由 clock port 注入 |
| `checked_by` | `ActorRef` | 最近检查者 | 来自 `ActorContext` |
| `blocking_reason` | `Option<CompatibilityReason>` | 阻断原因 | `Incompatible` 必须存在 |
| `trace_ref` | `Option<CompatibilityTraceRef>` | 追溯引用 | 检查完成后建议存在 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_passable(&self) -> bool` | 判断是否可放行发布 | 无 | `bool` | 只有 compatible 返回 true |
| `pub fn blocks_release(&self) -> bool` | 判断是否阻断发布 | 无 | `bool` | incompatible 返回 true |
| `pub fn mark_compatible(&self, actor: ActorContext, trace_ref: Option<CompatibilityTraceRef>, now: Timestamp) -> CompatibilityStatus` | 生成兼容通过状态 | `actor` 是检查者;`trace_ref` 是追溯引用;`now` 是检查时间 | `CompatibilityStatus` | 不修改当前对象 |
| `pub fn mark_incompatible(&self, actor: ActorContext, reason: CompatibilityReason, trace_ref: Option<CompatibilityTraceRef>, now: Timestamp) -> CompatibilityStatus` | 生成不兼容状态 | `actor` 是检查者;`reason` 是阻断原因;`trace_ref` 是追溯引用;`now` 是检查时间 | `CompatibilityStatus` | 不修改当前对象 |
| `pub fn reset_pending(&self, actor: ActorContext, now: Timestamp) -> CompatibilityStatus` | 重新进入待检查 | `actor` 是操作者;`now` 是重置时间 | `CompatibilityStatus` | 用于重新检查 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn pending(actor: ActorContext, now: Timestamp) -> CompatibilityStatus` | 创建待检查状态 | `actor` 是创建者;`now` 是创建时间 | `CompatibilityStatus` | 草稿变更或重新检查 |
| `pub fn from_persisted(value: CompatibilityValue, checked_at: Timestamp, checked_by: ActorRef, blocking_reason: Option<CompatibilityReason>, trace_ref: Option<CompatibilityTraceRef>) -> Result<CompatibilityStatus, DomainError>` | 从持久化字段恢复 | 参数分别为结果、检查时间、检查者、阻断原因和追溯引用 | `Result<CompatibilityStatus, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `CompatibilityStatus` 不运行工具链,只保存工具链或人工门禁后的领域结论。
- `Incompatible` 必须携带 `CompatibilityReason`。
- `Compatible` 不代表已经发布,只代表可进入发布基线判断。
- 重新检查必须产生新的 pending 或新状态,不能静默覆盖历史追溯。

#### 9.5.3 `ContractReleaseSnapshot`

###### 类型定义

```rust
/// 契约发布快照,表达从发布基线派生出的只读消费视图。
///
/// 该对象用于下游读取、对账和恢复;它不反向拥有 `ContractDefinition` 真相。
pub struct ContractReleaseSnapshot {
    /// 发布快照唯一标识。
    pub snapshot_id: ContractReleaseSnapshotId,

    /// 来源发布基线标识。
    pub baseline_id: ContractReleaseBaselineId,

    /// 来源契约定义标识。
    pub definition_id: ContractDefinitionId,

    /// 来源契约版本。
    pub version: ContractVersion,

    /// 快照指纹。
    pub fingerprint: ContractFingerprint,

    /// 来源定义生命周期。
    pub lifecycle: ContractLifecycle,

    /// 快照正文引用。
    pub body_ref: SnapshotBlobRef,

    /// 下游消费范围。
    pub consumer_scope: ContractScope,

    /// 快照状态。
    pub status: ContractReleaseSnapshotStatus,

    /// 导出时间。
    pub exported_at: Timestamp,
}
```

辅助 enum:

```rust
/// 发布快照状态集合。
///
/// 该枚举表达快照从构建到可消费、替代和归档的状态。
pub enum ContractReleaseSnapshotStatus {
    /// 正在构建。
    Building,

    /// 可供下游消费。
    Ready,

    /// 已被新快照替代。
    Superseded,

    /// 已归档。
    Archived,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Building` | `/// 正在构建。` | 表示快照派生中 | `ContractReleaseSnapshot::from_baseline(...)` | `Ready` |
| `Ready` | `/// 可供下游消费。` | 表示可读取快照 | `Building` | `Superseded` / `Archived` |
| `Superseded` | `/// 已被新快照替代。` | 表示终态替代 | `Ready` | 无 |
| `Archived` | `/// 已归档。` | 表示终态归档 | `Ready` | 无 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `snapshot_id` | `ContractReleaseSnapshotId` | 标识发布快照 | 创建后不可变 |
| `baseline_id` | `ContractReleaseBaselineId` | 绑定来源基线 | 必须指向已发布基线 |
| `definition_id` | `ContractDefinitionId` | 绑定来源定义 | 只保存引用 |
| `version` | `ContractVersion` | 绑定来源版本 | 必须与基线一致 |
| `fingerprint` | `ContractFingerprint` | 支撑对账 | 必须与快照正文匹配 |
| `lifecycle` | `ContractLifecycle` | 保存来源生命周期快照 | 只读拷贝,不反向驱动定义 |
| `body_ref` | `SnapshotBlobRef` | 指向快照正文 | 只保存 blob 引用 |
| `consumer_scope` | `ContractScope` | 表达消费范围 | 必须来自基线或包范围 |
| `status` | `ContractReleaseSnapshotStatus` | 快照状态 | 只能通过成员函数迁移 |
| `exported_at` | `Timestamp` | 导出时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_ready(&mut self, fingerprint: ContractFingerprint, body_ref: SnapshotBlobRef, now: Timestamp) -> Result<(), DomainError>` | 标记快照可消费 | `fingerprint` 是快照指纹;`body_ref` 是正文引用;`now` 是完成时间 | `Result<(), DomainError>` | 从 building 进入 ready |
| `pub fn is_read_only(&self) -> bool` | 判断是否只读 | 无 | `bool` | 永远返回 true |
| `pub fn matches_version(&self, version: ContractVersion) -> bool` | 判断是否匹配版本 | `version` 是待比较版本 | `bool` | 只读 |
| `pub fn can_be_consumed(&self) -> bool` | 判断是否可消费 | 无 | `bool` | ready 返回 true |
| `pub fn archive(&mut self, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 归档快照 | `actor` 是操作者;`now` 是归档时间 | `Result<(), DomainError>` | 仅 ready 可归档 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_baseline(snapshot_id: ContractReleaseSnapshotId, baseline: ContractReleaseBaseline, body_ref: SnapshotBlobRef, actor: ActorContext, now: Timestamp) -> Result<ContractReleaseSnapshot, DomainError>` | 从发布基线派生快照对象 | `snapshot_id` 是快照 ID;`baseline` 是来源基线;`body_ref` 是快照正文引用;`actor` 是操作者;`now` 是导出时间 | `Result<ContractReleaseSnapshot, DomainError>` | 快照派生 job |
| `pub fn rehydrate(record: ContractReleaseSnapshotRecord) -> Result<ContractReleaseSnapshot, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<ContractReleaseSnapshot, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractReleaseSnapshot` 是只读消费面对象。
- 快照不得反向修改 `ContractDefinition` 或 `ContractReleaseBaseline`。
- 快照正文只能通过 `SnapshotBlobRef` 引用,不得内嵌正文。
- `Ready` 后不得原地改写正文和指纹。

#### 9.5.4 `DownstreamConsumptionRef`

###### 类型定义

```rust
/// 下游消费引用,表达某个下游域消费发布基线或发布快照的关系。
///
/// 该对象只保存消费引用和状态,不保存下游仓内部实现。
pub struct DownstreamConsumptionRef {
    /// 消费引用唯一标识。
    pub consumption_ref_id: DownstreamConsumptionRefId,

    /// 下游消费域。
    pub downstream_domain: DownstreamDomainRef,

    /// 被消费的发布基线。
    pub baseline_id: ContractReleaseBaselineId,

    /// 可选被消费快照引用。
    pub snapshot_ref: Option<ReleaseSnapshotRef>,

    /// 最近消费时间。
    pub consumed_at: Option<Timestamp>,

    /// 消费状态。
    pub consumption_status: DownstreamConsumptionStatus,

    /// 可选消费提示。
    pub consumer_hint: Option<String>,
}
```

辅助 enum:

```rust
/// 下游消费状态集合。
///
/// 该枚举表达消费引用从待消费到同步、过期和退役的状态。
pub enum DownstreamConsumptionStatus {
    /// 尚未消费。
    Pending,

    /// 已消费或已绑定。
    Synced,

    /// 消费引用已经过期。
    Stale,

    /// 消费引用已经退役。
    Retired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `/// 尚未消费。` | 表示待消费 | `DownstreamConsumptionRef::create(...)` | `Synced` |
| `Synced` | `/// 已消费或已绑定。` | 表示已同步 | `Pending` / `Stale` | `Stale` / `Retired` |
| `Stale` | `/// 消费引用已经过期。` | 表示需要刷新 | `Synced` | `Synced` / `Retired` |
| `Retired` | `/// 消费引用已经退役。` | 表示终态 | `Synced` / `Stale` | 无 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `consumption_ref_id` | `DownstreamConsumptionRefId` | 标识消费引用 | 创建后不可变 |
| `downstream_domain` | `DownstreamDomainRef` | 标识下游域 | 只能保存引用,不保存下游正文 |
| `baseline_id` | `ContractReleaseBaselineId` | 绑定发布基线 | 必须指向可消费基线 |
| `snapshot_ref` | `Option<ReleaseSnapshotRef>` | 绑定快照 | 快照未派生前可为空 |
| `consumed_at` | `Option<Timestamp>` | 最近消费时间 | 未消费时为空 |
| `consumption_status` | `DownstreamConsumptionStatus` | 消费状态 | 只能通过成员函数迁移 |
| `consumer_hint` | `Option<String>` | 下游消费提示 | 不能作为强一致依据 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn bind_snapshot(&mut self, snapshot_ref: ReleaseSnapshotRef) -> Result<(), DomainError>` | 绑定快照引用 | `snapshot_ref` 是快照引用 | `Result<(), DomainError>` | 快照必须匹配基线 |
| `pub fn mark_consumed(&mut self, consumed_at: Timestamp) -> Result<(), DomainError>` | 标记已消费 | `consumed_at` 是消费时间 | `Result<(), DomainError>` | pending 或 stale 可进入 synced |
| `pub fn mark_stale(&mut self) -> Result<(), DomainError>` | 标记过期 | 无 | `Result<(), DomainError>` | synced 可进入 stale |
| `pub fn retire(&mut self, reason: LifecycleReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 退役消费引用 | `reason` 是退役原因;`actor` 是操作者;`now` 是退役时间 | `Result<(), DomainError>` | 进入终态 |
| `pub fn can_be_refreshed(&self) -> bool` | 判断是否可刷新 | 无 | `bool` | stale 返回 true |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(consumption_ref_id: DownstreamConsumptionRefId, downstream_domain: DownstreamDomainRef, baseline: ContractReleaseBaseline, actor: ActorContext, now: Timestamp) -> Result<DownstreamConsumptionRef, DomainError>` | 创建下游消费引用 | `consumption_ref_id` 是引用 ID;`downstream_domain` 是下游域;`baseline` 是来源基线;`actor` 是操作者;`now` 是创建时间 | `Result<DownstreamConsumptionRef, DomainError>` | 发布基线后建立消费关系 |
| `pub fn rehydrate(record: DownstreamConsumptionRefRecord) -> Result<DownstreamConsumptionRef, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<DownstreamConsumptionRef, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `DownstreamConsumptionRef` 不保存下游仓实现正文。
- 消费状态只表达引用关系,不保证跨仓强事务。
- 退役后不得重新标记为 synced。
- `consumer_hint` 只是提示,不能作为事实判断依据。

#### 9.5.5 `ContractFactRecord`

###### 类型定义

```rust
/// 契约事实记录,表达契约变化后需要被审计、追溯或对外感知的事实锚点。
///
/// 该对象不是 L0-bus runtime 消息,也不负责投递;投递由 outbox 和 event publisher port 承担。
pub struct ContractFactRecord {
    /// 事实记录唯一标识。
    pub fact_id: ContractFactRecordId,

    /// 事实类型。
    pub fact_kind: ContractFactKind,

    /// 关联契约定义。
    pub definition_id: ContractDefinitionId,

    /// 关联发布基线。
    pub baseline_id: ContractReleaseBaselineId,

    /// 可选快照引用。
    pub snapshot_ref: Option<ReleaseSnapshotRef>,

    /// 可选追溯引用。
    pub trace_ref: Option<ContractTraceRef>,

    /// 触发操作者。
    pub actor_ref: ActorRef,

    /// 事实发生时间。
    pub occurred_at: Timestamp,

    /// 可选事实 payload 引用。
    pub payload_ref: Option<FactPayloadRef>,

    /// 事实输出传播状态。
    pub delivery_status: FactDeliveryStatus,
}
```

辅助 enum:

```rust
/// 契约事实类型集合。
///
/// 该枚举表达哪些契约变化需要被下游或审计面感知。
pub enum ContractFactKind {
    /// 契约定义已经创建。
    DefinitionCreated,

    /// 契约定义已经发布。
    BaselinePublished,

    /// 发布快照已经就绪。
    SnapshotReady,

    /// 契约生命周期已经变化。
    LifecycleChanged,

    /// 兼容性状态已经变化。
    CompatibilityChanged,
}

/// 事实输出传播状态集合。
///
/// 该枚举表达事实记录在 outbox / 发布路径中的状态。
pub enum FactDeliveryStatus {
    /// 已生成,等待输出。
    Pending,

    /// 已成功输出。
    Published,

    /// 输出失败。
    Failed,

    /// 已归档。
    Archived,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `DefinitionCreated` | `/// 契约定义已经创建。` | 表示定义创建事实 | 不适用 | 不适用 |
| `BaselinePublished` | `/// 契约定义已经发布。` | 表示发布事实 | 不适用 | 不适用 |
| `SnapshotReady` | `/// 发布快照已经就绪。` | 表示快照可消费事实 | 不适用 | 不适用 |
| `LifecycleChanged` | `/// 契约生命周期已经变化。` | 表示生命周期变化事实 | 不适用 | 不适用 |
| `CompatibilityChanged` | `/// 兼容性状态已经变化。` | 表示兼容性变化事实 | 不适用 | 不适用 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `/// 已生成,等待输出。` | 表示待发布 | `ContractFactRecord::create(...)` | `Published` / `Failed` |
| `Published` | `/// 已成功输出。` | 表示已输出 | `Pending` / `Failed` | `Archived` |
| `Failed` | `/// 输出失败。` | 表示可重试失败 | `Pending` | `Pending` / `Archived` |
| `Archived` | `/// 已归档。` | 表示终态归档 | `Published` / `Failed` | 无 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `fact_id` | `ContractFactRecordId` | 标识事实记录 | 创建后不可变 |
| `fact_kind` | `ContractFactKind` | 表达事实类型 | 必须与触发动作一致 |
| `definition_id` | `ContractDefinitionId` | 关联定义 | 只保存引用 |
| `baseline_id` | `ContractReleaseBaselineId` | 关联基线 | 发布相关事实必须存在有效基线 |
| `snapshot_ref` | `Option<ReleaseSnapshotRef>` | 关联快照 | 快照事实必须存在 |
| `trace_ref` | `Option<ContractTraceRef>` | 关联追溯 | 建议存在,用于审计 |
| `actor_ref` | `ActorRef` | 触发操作者 | 来自 `ActorContext` |
| `occurred_at` | `Timestamp` | 事实发生时间 | 由 clock port 注入 |
| `payload_ref` | `Option<FactPayloadRef>` | 事实 payload 引用 | 只保存引用,不保存大正文 |
| `delivery_status` | `FactDeliveryStatus` | 输出传播状态 | 只能通过成员函数迁移 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn mark_published(&mut self, published_at: Timestamp) -> Result<(), DomainError>` | 标记事实输出成功 | `published_at` 是输出成功时间 | `Result<(), DomainError>` | pending 或 failed 可进入 published |
| `pub fn mark_failed(&mut self, reason: FactFailureReason, now: Timestamp) -> Result<(), DomainError>` | 标记事实输出失败 | `reason` 是失败原因;`now` 是失败时间 | `Result<(), DomainError>` | pending 可进入 failed;失败原因进入审计而非本对象大正文 |
| `pub fn reset_pending(&mut self, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 将失败事实重置为待输出 | `actor` 是操作者;`now` 是重置时间 | `Result<(), DomainError>` | failed 可回到 pending |
| `pub fn archive(&mut self, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 归档事实记录 | `actor` 是操作者;`now` 是归档时间 | `Result<(), DomainError>` | published 或 failed 可归档 |
| `pub fn is_publishable(&self) -> bool` | 判断是否可输出 | 无 | `bool` | pending 返回 true |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_release_change(fact_id: ContractFactRecordId, baseline: ContractReleaseBaseline, snapshot: Option<ContractReleaseSnapshot>, actor: ActorContext, now: Timestamp) -> Result<ContractFactRecord, DomainError>` | 从发布变化创建事实记录 | `fact_id` 是事实 ID;`baseline` 是发布基线;`snapshot` 是可选快照;`actor` 是操作者;`now` 是发生时间 | `Result<ContractFactRecord, DomainError>` | 发布或快照派生后生成事实 |
| `pub fn create(spec: ContractFactRecordSpec, actor: ActorContext, now: Timestamp) -> Result<ContractFactRecord, DomainError>` | 从 spec 创建事实记录 | `spec` 是事实规范;`actor` 是操作者;`now` 是发生时间 | `Result<ContractFactRecord, DomainError>` | application service 显式创建事实 |
| `pub fn rehydrate(record: ContractFactRecordRow) -> Result<ContractFactRecord, DomainError>` | 从持久化行恢复事实记录 | `record` 是持久化行 | `Result<ContractFactRecord, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractFactRecord` 不是 bus message,也不是 outbox worker。
- 事实记录只保存引用和事实锚点,不保存大 payload 正文。
- 已归档事实不得重新发布。
- 输出失败不得删除事实,必须保留可追溯状态。
- 事实投递、ack、retry 和 dead-letter 不属于本对象职责。

### 9.6 引用、索引与追溯投影对象

本节覆盖 `domain_reference_projection` 模块中的引用、索引和追溯投影对象。本批先补齐 `ExternalReference`、`StandardMappingIndex`、`EventCatalogReference`;投影对象后续分批补齐。

边界说明:

| 对象 | 类型 | 本节处理状态 | 说明 |
|---|---|---|---|
| `ExternalReference` | reference model | 已补齐 | 标准、草案、ADR、评审、下游消费等外部引用 |
| `StandardMappingIndex` | local index | 已补齐 | 外部标准概念到本仓契约语义的映射 |
| `EventCatalogReference` | reference model | 已补齐 | 事件目录的本地引用入口 |
| `CompatibilityTraceIndex` | projection / index | 已补齐 | 兼容状态和破坏性变化追溯 |
| `ContractReadModel` | query projection | 已补齐 | 契约列表和详情只读视图 |
| `ContractTraceProjection` | query projection | 已补齐 | 版本、引用、审计、快照和事实追溯视图 |

#### 9.6.1 `ExternalReference`

###### 类型定义

```rust
/// 外部引用对象,表达标准、草案、ADR、评审和下游消费等外部资料的引用关系。
///
/// 该对象只保存引用元数据,不得复制外部正文。
pub struct ExternalReference {
    /// 外部引用唯一标识。
    pub reference_id: ExternalReferenceId,

    /// 外部引用类型。
    pub reference_kind: ExternalReferenceKind,

    /// 外部 URI。
    pub reference_uri: ExternalUri,

    /// 外部标题。
    pub reference_title: String,

    /// 引用状态。
    pub reference_state: ReferenceState,

    /// 最近解析时间。
    pub resolved_at: Option<Timestamp>,

    /// 来源提示。
    pub source_hint: Option<String>,
}
```

辅助 enum:

```rust
/// 外部引用类型集合。
///
/// 该枚举表达外部引用来源类别,不表达外部正文结构。
pub enum ExternalReferenceKind {
    /// 标准文档引用。
    Standard,

    /// 草案文档引用。
    Draft,

    /// ADR 决策记录引用。
    Adr,

    /// 评审记录引用。
    Review,

    /// 下游消费反馈引用。
    DownstreamFeedback,
}

/// 引用状态集合。
///
/// 该枚举表达外部引用是否已解析、失效或过期。
pub enum ReferenceState {
    /// 待解析。
    Pending,

    /// 已解析。
    Resolved,

    /// 已失效。
    Invalidated,

    /// 已过期,需要重新解析。
    Stale,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Standard` | `/// 标准文档引用。` | 表达外部标准来源 | 不适用 | 不适用 |
| `Draft` | `/// 草案文档引用。` | 表达草案来源 | 不适用 | 不适用 |
| `Adr` | `/// ADR 决策记录引用。` | 表达 ADR 来源 | 不适用 | 不适用 |
| `Review` | `/// 评审记录引用。` | 表达评审来源 | 不适用 | 不适用 |
| `DownstreamFeedback` | `/// 下游消费反馈引用。` | 表达下游反馈来源 | 不适用 | 不适用 |

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `/// 待解析。` | 表示尚未校验可用性 | `ExternalReference::create(...)` | `Resolved` / `Invalidated` |
| `Resolved` | `/// 已解析。` | 表示引用可用 | `Pending` / `Stale` | `Stale` / `Invalidated` |
| `Invalidated` | `/// 已失效。` | 表示引用不可用 | `Pending` / `Resolved` / `Stale` | 无 |
| `Stale` | `/// 已过期,需要重新解析。` | 表示需要刷新 | `Resolved` | `Resolved` / `Invalidated` |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `reference_id` | `ExternalReferenceId` | 标识外部引用 | 创建后不可变 |
| `reference_kind` | `ExternalReferenceKind` | 标识引用来源类别 | 必须与来源语义一致 |
| `reference_uri` | `ExternalUri` | 定位外部资料 | 只保存 URI,不保存正文 |
| `reference_title` | `String` | 可读标题 | 不作为唯一标识 |
| `reference_state` | `ReferenceState` | 表达引用状态 | 只能通过成员函数迁移 |
| `resolved_at` | `Option<Timestamp>` | 最近解析时间 | 未解析时为空 |
| `source_hint` | `Option<String>` | 来源提示 | 不能作为事实依据 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn resolve(&mut self, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记引用已解析 | `actor` 是操作者;`now` 是解析时间 | `Result<(), DomainError>` | 更新状态和解析时间,不读取外部正文 |
| `pub fn invalidate(&mut self, reason: ReferenceInvalidationReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 使引用失效 | `reason` 是失效原因;`actor` 是操作者;`now` 是失效时间 | `Result<(), DomainError>` | 进入 invalidated |
| `pub fn mark_stale(&mut self, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记引用过期 | `actor` 是操作者;`now` 是过期时间 | `Result<(), DomainError>` | resolved 可进入 stale |
| `pub fn points_to(&self, uri: ExternalUri) -> bool` | 判断是否指向指定 URI | `uri` 是待比较 URI | `bool` | 只读判断 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(reference_id: ExternalReferenceId, kind: ExternalReferenceKind, uri: ExternalUri, title: String, actor: ActorContext, now: Timestamp) -> Result<ExternalReference, DomainError>` | 创建外部引用 | `reference_id` 是引用 ID;`kind` 是引用类型;`uri` 是外部 URI;`title` 是标题;`actor` 是创建者;`now` 是创建时间 | `Result<ExternalReference, DomainError>` | 输入收口或追溯记录绑定外部引用 |
| `pub fn rehydrate(record: ExternalReferenceRecord) -> Result<ExternalReference, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<ExternalReference, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ExternalReference` 只能保存引用和元数据,不能复制外部正文。
- 引用解析由 `ReferenceResolverPort` 或 adapter 完成,本对象不访问网络。
- `source_hint` 不能替代 `reference_uri`。
- 失效引用必须显式暴露,不能伪装为正文有效。

#### 9.6.2 `StandardMappingIndex`

###### 类型定义

```rust
/// 标准映射索引,维护外部标准概念到本仓契约定义语义的映射。
///
/// 该对象服务查询和追溯,不得反向修改契约定义真相。
pub struct StandardMappingIndex {
    /// 映射索引唯一标识。
    pub index_id: StandardMappingIndexId,

    /// 外部标准引用。
    pub standard_ref: StandardRef,

    /// 对应契约类别。
    pub contract_kind: ContractKind,

    /// 标准到契约的映射规则集合。
    pub mapping_rules: MappingRuleList,

    /// 索引状态。
    pub index_state: IndexState,

    /// 最近更新时间。
    pub updated_at: Timestamp,

    /// 最近更新者。
    pub updated_by: ActorRef,
}
```

辅助 enum:

```rust
/// 索引状态集合。
///
/// 该枚举表达本地索引是否可用、过期或重建中。
pub enum IndexState {
    /// 草稿索引。
    Draft,

    /// 可用索引。
    Active,

    /// 已过期索引。
    Stale,

    /// 正在重建。
    Rebuilding,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `/// 草稿索引。` | 表示尚未发布可用 | `StandardMappingIndex::create_draft(...)` | `Active` |
| `Active` | `/// 可用索引。` | 表示可用于查询 | `Draft` / `Rebuilding` | `Stale` / `Rebuilding` |
| `Stale` | `/// 已过期索引。` | 表示需要重建 | `Active` | `Rebuilding` |
| `Rebuilding` | `/// 正在重建。` | 表示后台重建中 | `Active` / `Stale` | `Active` |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `index_id` | `StandardMappingIndexId` | 标识映射索引 | 创建后不可变 |
| `standard_ref` | `StandardRef` | 指向外部标准 | 只保存引用 |
| `contract_kind` | `ContractKind` | 绑定契约类别 | 必须与映射规则一致 |
| `mapping_rules` | `MappingRuleList` | 保存映射规则 | 不得包含外部标准正文 |
| `index_state` | `IndexState` | 表达索引状态 | 只能通过成员函数迁移 |
| `updated_at` | `Timestamp` | 最近更新时间 | 由 clock port 注入 |
| `updated_by` | `ActorRef` | 最近更新者 | 来自 `ActorContext` |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn map_to_contract(&mut self, definition_id: ContractDefinitionId, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 记录标准到契约定义的映射 | `definition_id` 是目标定义;`actor` 是操作者;`now` 是更新时间 | `Result<(), DomainError>` | 更新映射规则,不改写定义 |
| `pub fn rebuild(&mut self, standard_ref: StandardRef, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记索引重建 | `standard_ref` 是标准引用;`actor` 是操作者;`now` 是重建时间 | `Result<(), DomainError>` | 进入 rebuilding 或 active,不访问外部正文 |
| `pub fn is_consistent_with(&self, definition: ContractDefinition) -> bool` | 判断映射是否与定义一致 | `definition` 是待比较定义 | `bool` | 只读判断 |
| `pub fn is_active(&self) -> bool` | 判断索引是否可用 | 无 | `bool` | active 返回 true |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create_draft(index_id: StandardMappingIndexId, standard_ref: StandardRef, contract_kind: ContractKind, actor: ActorContext, now: Timestamp) -> Result<StandardMappingIndex, DomainError>` | 创建草稿映射索引 | `index_id` 是索引 ID;`standard_ref` 是标准引用;`contract_kind` 是契约类别;`actor` 是创建者;`now` 是创建时间 | `Result<StandardMappingIndex, DomainError>` | 标准映射初始化 |
| `pub fn rehydrate(record: StandardMappingIndexRecord) -> Result<StandardMappingIndex, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<StandardMappingIndex, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `StandardMappingIndex` 只服务查询和追溯,不得改写 `ContractDefinition`。
- 映射规则不能复制标准正文。
- stale 索引必须显式暴露,不能继续伪装为 active。
- 重建动作由 job / application service 编排,本对象不访问外部资源。

#### 9.6.3 `EventCatalogReference`

###### 类型定义

```rust
/// 事件目录引用对象,表达本仓契约与外部事件目录之间的引用关系。
///
/// 该对象只保存事件目录引用和解析状态,不保存事件实例或事件正文。
pub struct EventCatalogReference {
    /// 事件目录引用唯一标识。
    pub reference_id: EventCatalogReferenceId,

    /// 外部事件目录引用。
    pub catalog_ref: EventCatalogRef,

    /// 对应契约类别。
    pub contract_kind: ContractKind,

    /// 事件目录版本。
    pub catalog_version: CatalogVersion,

    /// 引用状态。
    pub reference_state: ReferenceState,

    /// 最近解析时间。
    pub resolved_at: Option<Timestamp>,

    /// 最近解析者。
    pub resolved_by: Option<ActorRef>,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `reference_id` | `EventCatalogReferenceId` | 标识事件目录引用 | 创建后不可变 |
| `catalog_ref` | `EventCatalogRef` | 指向事件目录 | 只保存引用 |
| `contract_kind` | `ContractKind` | 绑定契约类别 | 必须为事件相关契约类别 |
| `catalog_version` | `CatalogVersion` | 记录目录版本 | 必须与引用解析结果一致 |
| `reference_state` | `ReferenceState` | 表达引用状态 | 复用外部引用状态集合 |
| `resolved_at` | `Option<Timestamp>` | 最近解析时间 | 未解析时为空 |
| `resolved_by` | `Option<ActorRef>` | 最近解析者 | 未解析时为空 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn resolve(&mut self, catalog_version: CatalogVersion, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 标记目录引用已解析 | `catalog_version` 是解析到的目录版本;`actor` 是解析者;`now` 是解析时间 | `Result<(), DomainError>` | 更新状态、版本和解析信息 |
| `pub fn invalidate(&mut self, reason: ReferenceInvalidationReason, actor: ActorContext, now: Timestamp) -> Result<(), DomainError>` | 使目录引用失效 | `reason` 是失效原因;`actor` 是操作者;`now` 是失效时间 | `Result<(), DomainError>` | 进入 invalidated |
| `pub fn points_to(&self, kind: ContractKind) -> bool` | 判断是否指向指定契约类别 | `kind` 是待判断契约类别 | `bool` | 只读判断 |
| `pub fn is_resolved(&self) -> bool` | 判断是否已解析 | 无 | `bool` | 只读判断 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_catalog_ref(reference_id: EventCatalogReferenceId, catalog_ref: EventCatalogRef, contract_kind: ContractKind, actor: ActorContext, now: Timestamp) -> Result<EventCatalogReference, DomainError>` | 从目录引用创建本地引用对象 | `reference_id` 是引用 ID;`catalog_ref` 是目录引用;`contract_kind` 是契约类别;`actor` 是创建者;`now` 是创建时间 | `Result<EventCatalogReference, DomainError>` | 事件契约关联外部事件目录 |
| `pub fn rehydrate(record: EventCatalogReferenceRecord) -> Result<EventCatalogReference, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<EventCatalogReference, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `EventCatalogReference` 不保存事件实例或事件正文。
- 事件目录解析由 port / adapter 完成,本对象只保存解析结果。
- 引用失效必须显式暴露。
- 查询路径不得通过该对象改写真相。

#### 9.6.4 `CompatibilityTraceIndex`

###### 类型定义

```rust
/// 兼容性追溯索引,支撑兼容状态、破坏性变化和弃用影响的查询。
///
/// 该对象是 projection / index,不得反向改写发布基线或契约定义。
pub struct CompatibilityTraceIndex {
    /// 兼容性追溯索引唯一标识。
    pub trace_index_id: CompatibilityTraceIndexId,

    /// 对应契约定义标识。
    pub definition_id: ContractDefinitionId,

    /// 对应发布基线标识。
    pub baseline_id: ContractReleaseBaselineId,

    /// 当前兼容性状态。
    pub compatibility_status: CompatibilityStatus,

    /// 兼容性违例摘要。
    pub violation_summary: CompatibilityViolationSummary,

    /// 追溯索引状态。
    pub trace_state: TraceIndexState,

    /// 最近更新时间。
    pub updated_at: Timestamp,
}
```

辅助 enum:

```rust
/// 追溯索引状态集合。
///
/// 该枚举表达兼容性追溯索引是否可用或需要重建。
pub enum TraceIndexState {
    /// 可用。
    Active,

    /// 已过期。
    Stale,

    /// 正在重建。
    Rebuilding,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `/// 可用。` | 表示索引可查询 | `CompatibilityTraceIndex::from_compatibility_result(...)` / `Rebuilding` | `Stale` / `Rebuilding` |
| `Stale` | `/// 已过期。` | 表示索引需重建 | `Active` | `Rebuilding` |
| `Rebuilding` | `/// 正在重建。` | 表示后台重建中 | `Active` / `Stale` | `Active` |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `trace_index_id` | `CompatibilityTraceIndexId` | 标识追溯索引 | 创建后不可变 |
| `definition_id` | `ContractDefinitionId` | 绑定契约定义 | 只保存引用 |
| `baseline_id` | `ContractReleaseBaselineId` | 绑定发布基线 | 只保存引用 |
| `compatibility_status` | `CompatibilityStatus` | 记录兼容状态 | 不直接运行校验 |
| `violation_summary` | `CompatibilityViolationSummary` | 记录违例摘要 | 不保存工具链完整报告正文 |
| `trace_state` | `TraceIndexState` | 表达索引状态 | stale 必须显式暴露 |
| `updated_at` | `Timestamp` | 最近更新时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn append_trace(&mut self, item: CompatibilityTraceItem, now: Timestamp) -> Result<(), DomainError>` | 追加兼容追溯项 | `item` 是追溯项;`now` 是更新时间 | `Result<(), DomainError>` | 更新摘要和时间,不改写真相 |
| `pub fn is_rebuildable(&self) -> bool` | 判断是否可重建 | 无 | `bool` | stale 或 active 可重建 |
| `pub fn matches_baseline(&self, baseline: ContractReleaseBaseline) -> bool` | 判断是否匹配基线 | `baseline` 是待比较基线 | `bool` | 只读判断 |
| `pub fn mark_stale(&mut self, now: Timestamp) -> Result<(), DomainError>` | 标记索引过期 | `now` 是过期时间 | `Result<(), DomainError>` | active 可进入 stale |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_compatibility_result(trace_index_id: CompatibilityTraceIndexId, result: CompatibilityResult, actor: ActorContext, now: Timestamp) -> Result<CompatibilityTraceIndex, DomainError>` | 从兼容判断结果创建索引 | `trace_index_id` 是索引 ID;`result` 是兼容结果;`actor` 是操作者;`now` 是创建时间 | `Result<CompatibilityTraceIndex, DomainError>` | 兼容校验完成后生成投影 |
| `pub fn rehydrate(record: CompatibilityTraceIndexRecord) -> Result<CompatibilityTraceIndex, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<CompatibilityTraceIndex, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `CompatibilityTraceIndex` 是查询投影,不能修改 `CompatibilityStatus` 真相来源。
- 违例摘要不能替代完整校验报告 artifact。
- stale 状态必须显式返回给查询方或触发重建。

#### 9.6.5 `ContractReadModel`

###### 类型定义

```rust
/// 契约只读模型,支撑契约列表、详情和当前状态读取。
///
/// 该对象是 query projection,不得作为写路径真相来源。
pub struct ContractReadModel {
    /// 只读模型唯一标识。
    pub read_model_id: ContractReadModelId,

    /// 对应契约定义标识。
    pub definition_id: ContractDefinitionId,

    /// 契约摘要。
    pub summary: ContractSummary,

    /// 当前版本。
    pub current_version: ContractVersion,

    /// 当前生命周期状态。
    pub current_status: ContractLifecycleState,

    /// 当前范围。
    pub scope: ContractScope,

    /// 只读模型状态。
    pub read_model_state: ReadModelState,

    /// 最近更新时间。
    pub updated_at: Timestamp,
}
```

辅助 enum:

```rust
/// 只读模型状态集合。
///
/// 该枚举表达查询视图是否可用、过期或重建中。
pub enum ReadModelState {
    /// 可用。
    Active,

    /// 已过期。
    Stale,

    /// 正在重建。
    Rebuilding,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `/// 可用。` | 表示查询可读取 | `ContractReadModel::from_definition(...)` / `Rebuilding` | `Stale` / `Rebuilding` |
| `Stale` | `/// 已过期。` | 表示需要刷新 | `Active` | `Rebuilding` |
| `Rebuilding` | `/// 正在重建。` | 表示重建中 | `Active` / `Stale` | `Active` |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `read_model_id` | `ContractReadModelId` | 标识只读模型 | 创建后不可变 |
| `definition_id` | `ContractDefinitionId` | 绑定定义 | 只保存引用 |
| `summary` | `ContractSummary` | 查询摘要 | 不保存完整正文 |
| `current_version` | `ContractVersion` | 当前版本 | 来自定义或发布基线 |
| `current_status` | `ContractLifecycleState` | 当前状态 | 来自定义生命周期 |
| `scope` | `ContractScope` | 当前范围 | 不得用于改写真相 |
| `read_model_state` | `ReadModelState` | 视图状态 | stale 必须显式暴露 |
| `updated_at` | `Timestamp` | 最近更新时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn refresh_from_definition(&mut self, definition: ContractDefinition, now: Timestamp) -> Result<(), DomainError>` | 从权威定义刷新只读模型 | `definition` 是权威定义;`now` 是刷新时间 | `Result<(), DomainError>` | 只更新 projection 字段 |
| `pub fn matches_query(&self, query: ContractQuery) -> bool` | 判断是否匹配查询条件 | `query` 是查询条件 | `bool` | 只读判断 |
| `pub fn is_read_only(&self) -> bool` | 明确只读属性 | 无 | `bool` | 永远返回 true |
| `pub fn mark_stale(&mut self, now: Timestamp) -> Result<(), DomainError>` | 标记过期 | `now` 是过期时间 | `Result<(), DomainError>` | active 可进入 stale |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_definition(read_model_id: ContractReadModelId, definition: ContractDefinition, actor: ActorContext, now: Timestamp) -> Result<ContractReadModel, DomainError>` | 从定义生成只读模型 | `read_model_id` 是视图 ID;`definition` 是来源定义;`actor` 是操作者;`now` 是生成时间 | `Result<ContractReadModel, DomainError>` | 索引重建或定义变更后刷新查询视图 |
| `pub fn rehydrate(record: ContractReadModelRecord) -> Result<ContractReadModel, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<ContractReadModel, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractReadModel` 不能作为写路径真相。
- 只读模型不能保存完整契约正文。
- 查询路径不得通过只读模型修改 `ContractDefinition`。

#### 9.6.6 `ContractTraceProjection`

###### 类型定义

```rust
/// 契约追溯投影,支撑版本、引用、审计、快照和事实的组合追溯视图。
///
/// 该对象是 query projection,用于读取和重建,不得承载写路径真相。
pub struct ContractTraceProjection {
    /// 追溯投影唯一标识。
    pub projection_id: ContractTraceProjectionId,

    /// 对应契约定义标识。
    pub definition_id: ContractDefinitionId,

    /// 追溯项列表。
    pub trace_items: TraceItemList,

    /// 审计引用列表。
    pub audit_refs: AuditRefList,

    /// 快照引用列表。
    pub snapshot_refs: SnapshotRefList,

    /// 事件引用列表。
    pub event_refs: EventRefList,

    /// 投影状态。
    pub projection_state: ProjectionState,

    /// 最近更新时间。
    pub updated_at: Timestamp,
}
```

辅助 enum:

```rust
/// 投影状态集合。
///
/// 该枚举表达追溯投影是否可用、过期或正在重建。
pub enum ProjectionState {
    /// 可用。
    Active,

    /// 已过期。
    Stale,

    /// 正在重建。
    Rebuilding,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `/// 可用。` | 表示追溯视图可读取 | `ContractTraceProjection::from_trace_sources(...)` / `Rebuilding` | `Stale` / `Rebuilding` |
| `Stale` | `/// 已过期。` | 表示需要重建 | `Active` | `Rebuilding` |
| `Rebuilding` | `/// 正在重建。` | 表示后台重建中 | `Active` / `Stale` | `Active` |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `projection_id` | `ContractTraceProjectionId` | 标识追溯投影 | 创建后不可变 |
| `definition_id` | `ContractDefinitionId` | 绑定定义 | 只保存引用 |
| `trace_items` | `TraceItemList` | 保存追溯项 | 不保存外部正文 |
| `audit_refs` | `AuditRefList` | 绑定审计引用 | 只保存引用 |
| `snapshot_refs` | `SnapshotRefList` | 绑定快照引用 | 只保存引用 |
| `event_refs` | `EventRefList` | 绑定事件引用 | 不保存事件实例正文 |
| `projection_state` | `ProjectionState` | 投影状态 | stale 必须显式暴露 |
| `updated_at` | `Timestamp` | 最近更新时间 | 由 clock port 注入 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn append_trace_item(&mut self, item: TraceItem, now: Timestamp) -> Result<(), DomainError>` | 追加追溯项 | `item` 是追溯项;`now` 是更新时间 | `Result<(), DomainError>` | 只更新投影 |
| `pub fn is_rebuildable(&self) -> bool` | 判断是否可重建 | 无 | `bool` | active 或 stale 可重建 |
| `pub fn mark_stale(&mut self, now: Timestamp) -> Result<(), DomainError>` | 标记过期 | `now` 是过期时间 | `Result<(), DomainError>` | active 可进入 stale |
| `pub fn contains_snapshot(&self, snapshot_ref: ReleaseSnapshotRef) -> bool` | 判断是否包含快照引用 | `snapshot_ref` 是待判断快照引用 | `bool` | 只读判断 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_trace_sources(projection_id: ContractTraceProjectionId, sources: TraceSourceSet, actor: ActorContext, now: Timestamp) -> Result<ContractTraceProjection, DomainError>` | 从审计、事件和快照来源构建投影 | `projection_id` 是投影 ID;`sources` 是追溯来源集合;`actor` 是操作者;`now` 是生成时间 | `Result<ContractTraceProjection, DomainError>` | 追溯投影重建 |
| `pub fn rehydrate(record: ContractTraceProjectionRecord) -> Result<ContractTraceProjection, DomainError>` | 从持久化记录恢复 | `record` 是持久化记录 | `Result<ContractTraceProjection, DomainError>` | repository 恢复 |

###### 不变量与禁止事项

- `ContractTraceProjection` 是查询投影,不能作为写路径真相。
- 投影只保存引用和追溯项摘要,不得复制外部正文或事件实例正文。
- stale 投影必须显式暴露或触发重建。
- 追溯投影不得直接发布事实或投递事件。

### 9.7 领域策略与应用服务对象

本节覆盖 `domain_policies` 和 `application_services` 模块中的策略对象与应用服务对象。本批先补齐领域策略对象;应用服务对象后续分批补齐。

边界说明:

| 对象 | 类型 | 本节处理状态 | 说明 |
|---|---|---|---|
| `ScopePolicy` | domain policy | 已补齐 | 判断候选契约是否具有共享价值 |
| `BoundaryGuard` | domain policy | 已补齐 | 阻止外部正文、运行实例和凭据正文进入真相 |
| `DefinitionUseBoundaryGuard` | domain policy | 已补齐 | 区分 Definition truth 与 Use truth |
| `ReferenceValidationPolicy` | domain policy | 已补齐 | 校验结构化引用和外部引用边界 |
| `FingerprintPolicy` | domain policy | 已补齐 | 约束 canonical 指纹生成和对比 |
| `ContractChangeService` | application service | 已补齐 | 编排草稿、更新和提交评审 |
| `ContractReleaseService` | application service | 已补齐 | 编排发布、弃用、退役和替代 |
| `ContractCompatibilityService` | application service | 已补齐 | 编排兼容性判断 |
| `ContractSnapshotService` | application service | 已补齐 | 编排快照派生和恢复入口 |
| `ContractTraceService` | application service | 已补齐 | 编排追溯查询视图 |
| `ContractFactService` | application service | 已补齐 | 编排事实记录和 outbox 写入 |
| `ContractOperationsService` | application service | 已补齐 | 编排 seed、replay、rebuild、recalculate |

#### 9.7.1 `ScopePolicy`

###### 类型定义

```rust
/// 契约范围策略,判断候选契约是否具备进入 L0-core 共享契约真相的价值。
///
/// 该策略是纯领域规则,不得访问 repository、filesystem、gateway 或外部标准正文。
pub struct ScopePolicy {
    /// 允许进入 L0-core 的契约域集合。
    pub allowed_domains: Vec<ContractDomain>,

    /// 允许进入 L0-core 的契约类别集合。
    pub allowed_kinds: Vec<ContractKind>,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `allowed_domains` | `Vec<ContractDomain>` | 限定允许消费域 | 只能包含 L0-core 支持的共享契约域 |
| `allowed_kinds` | `Vec<ContractKind>` | 限定允许契约类别 | 不能包含运行实例或业务正文类别 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate(&self, scope: ContractScope, candidate: ContractDefinitionDraftSpec) -> Result<ScopeDecision, DomainError>` | 判断候选契约是否可进入共享范围 | `scope` 是候选范围;`candidate` 是草稿定义内容 | `Result<ScopeDecision, DomainError>` | 纯判断,不访问外部资源 |
| `pub fn allows_domain(&self, domain: ContractDomain) -> bool` | 判断是否允许消费域 | `domain` 是待判断域 | `bool` | 只读 |
| `pub fn allows_kind(&self, kind: ContractKind) -> bool` | 判断是否允许契约类别 | `kind` 是待判断类别 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default() -> ScopePolicy` | 创建默认范围策略 | 无 | `ScopePolicy` | application service 初始化 |
| `pub fn new(allowed_domains: Vec<ContractDomain>, allowed_kinds: Vec<ContractKind>) -> Result<ScopePolicy, DomainError>` | 创建自定义范围策略 | 参数分别为允许域和允许类别 | `Result<ScopePolicy, DomainError>` | 测试或后续配置化 |

###### 不变量与禁止事项

- `ScopePolicy` 不做认证授权。
- `ScopePolicy` 不访问外部标准正文。
- 策略结果不能绕过 `BoundaryGuard` 和 `DefinitionUseBoundaryGuard`。

#### 9.7.2 `BoundaryGuard`

###### 类型定义

```rust
/// 通用边界守卫,阻止外部正文、运行实例、凭据正文和下游业务真相进入 L0-core。
pub struct BoundaryGuard {
    /// 被禁止进入契约真相的载荷类别集合。
    pub forbidden_payload_kinds: Vec<ForbiddenPayloadKind>,
}
```

辅助 enum:

```rust
/// 禁止进入契约真相的载荷类别集合。
pub enum ForbiddenPayloadKind {
    /// 下游业务实例正文。
    BusinessInstanceBody,

    /// 运行时事件实例正文。
    RuntimeEventInstance,

    /// 凭据、token 或密钥正文。
    CredentialBody,

    /// 外部文档完整正文。
    ExternalDocumentBody,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `BusinessInstanceBody` | `/// 下游业务实例正文。` | 阻止业务实例进入 | 不适用 | 不适用 |
| `RuntimeEventInstance` | `/// 运行时事件实例正文。` | 阻止运行实例进入 | 不适用 | 不适用 |
| `CredentialBody` | `/// 凭据、token 或密钥正文。` | 阻止敏感正文进入 | 不适用 | 不适用 |
| `ExternalDocumentBody` | `/// 外部文档完整正文。` | 阻止复制外部正文 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `forbidden_payload_kinds` | `Vec<ForbiddenPayloadKind>` | 明确禁止载荷类别 | 默认必须包含全部红线类别 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn inspect_draft(&self, spec: ContractDefinitionDraftSpec) -> Result<(), BoundaryViolation>` | 检查草稿是否越界 | `spec` 是候选草稿 | `Result<(), BoundaryViolation>` | 纯校验 |
| `pub fn rejects(&self, payload_kind: ForbiddenPayloadKind) -> bool` | 判断是否拒绝某载荷类别 | `payload_kind` 是待判断类别 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict_default() -> BoundaryGuard` | 创建严格默认守卫 | 无 | `BoundaryGuard` | application service 初始化 |

###### 不变量与禁止事项

- `BoundaryGuard` 只返回领域校验结论,不自动清洗 payload。
- 发现越界内容必须拒绝或转为引用,不能静默吸收。
- 该对象不访问文件系统或网络。

#### 9.7.3 `DefinitionUseBoundaryGuard`

###### 类型定义

```rust
/// Definition / Use 边界守卫,防止下游使用态真相混入共享契约定义。
pub struct DefinitionUseBoundaryGuard {
    /// 允许作为定义真相出现的对象类别集合。
    pub definition_allowed_kinds: Vec<ContractKind>,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `definition_allowed_kinds` | `Vec<ContractKind>` | 定义允许类别 | 不包含下游 use instance 类别 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn ensure_definition_truth(&self, candidate: ContractDefinitionDraftSpec) -> Result<(), BoundaryViolation>` | 确保候选内容是 Definition truth | `candidate` 是候选草稿 | `Result<(), BoundaryViolation>` | 纯校验 |
| `pub fn rejects_use_truth(&self, use_ref: UseTruthRef) -> bool` | 判断是否拒绝 Use truth 引用 | `use_ref` 是使用态引用 | `bool` | 只读 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default() -> DefinitionUseBoundaryGuard` | 创建默认 Definition / Use 守卫 | 无 | `DefinitionUseBoundaryGuard` | command 输入收口 |

###### 不变量与禁止事项

- L0-core 只拥有 Definition truth,不拥有 Use truth。
- 下游实例、执行结果和运行态状态只能以引用或事实进入,不能成为契约定义正文。

#### 9.7.4 `ReferenceValidationPolicy`

###### 类型定义

```rust
/// 引用校验策略,校验定义引用、外部引用、事件目录引用和快照引用是否满足边界规则。
pub struct ReferenceValidationPolicy {
    /// 是否允许 stale 引用进入草稿。
    pub allow_stale_in_draft: bool,

    /// 是否允许 unresolved 引用发布。
    pub allow_unresolved_on_publish: bool,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `allow_stale_in_draft` | `bool` | 草稿是否允许 stale 引用 | 默认可允许,但必须显式暴露 |
| `allow_unresolved_on_publish` | `bool` | 发布是否允许未解析引用 | 默认必须为 false |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate_definition_refs(&self, refs: ContractReferenceList, lifecycle: ContractLifecycleState) -> Result<(), DomainError>` | 校验定义引用集合 | `refs` 是引用集合;`lifecycle` 是当前生命周期状态 | `Result<(), DomainError>` | 纯校验 |
| `pub fn validate_external_reference(&self, reference: ExternalReference, lifecycle: ContractLifecycleState) -> Result<(), DomainError>` | 校验外部引用 | `reference` 是外部引用;`lifecycle` 是当前状态 | `Result<(), DomainError>` | 不解析网络 |
| `pub fn validate_snapshot_ref(&self, snapshot_ref: ReleaseSnapshotRef, baseline: ContractReleaseBaseline) -> Result<(), DomainError>` | 校验快照引用 | `snapshot_ref` 是快照引用;`baseline` 是来源基线 | `Result<(), DomainError>` | 只比较引用 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict_publish_default() -> ReferenceValidationPolicy` | 创建严格发布策略 | 无 | `ReferenceValidationPolicy` | 发布前校验 |

###### 不变量与禁止事项

- 发布态不允许 unresolved 外部引用。
- 引用校验策略不访问外部系统,外部解析结果必须由 port 提供后再进入领域对象。
- broken / stale 引用必须显式暴露。

#### 9.7.5 `FingerprintPolicy`

###### 类型定义

```rust
/// 指纹策略,约束 canonical 内容与 fingerprint 的生成、对比和漂移判断。
///
/// 该策略只定义规则和对比语义,不直接执行具体 hash 工具链。
pub struct FingerprintPolicy {
    /// 指纹算法标识。
    pub algorithm: FingerprintAlgorithm,

    /// 是否要求发布前指纹稳定。
    pub require_stable_before_publish: bool,
}
```

辅助 enum:

```rust
/// 指纹算法集合。
pub enum FingerprintAlgorithm {
    /// SHA-256 指纹。
    Sha256,

    /// BLAKE3 指纹。
    Blake3,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Sha256` | `/// SHA-256 指纹。` | 标准兼容性较好 | 不适用 | 不适用 |
| `Blake3` | `/// BLAKE3 指纹。` | 本地计算较快 | 不适用 | 不适用 |

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `algorithm` | `FingerprintAlgorithm` | 指纹算法 | 必须与 toolchain 输出一致 |
| `require_stable_before_publish` | `bool` | 发布前是否要求稳定 | P0 默认 true |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn compare(&self, expected: ContractFingerprint, actual: ContractFingerprint) -> FingerprintComparison` | 对比指纹 | `expected` 是期望指纹;`actual` 是实际指纹 | `FingerprintComparison` | 纯比较 |
| `pub fn detects_drift(&self, before: ContractFingerprint, after: ContractFingerprint) -> bool` | 判断是否发生漂移 | `before` 是旧指纹;`after` 是新指纹 | `bool` | 只读 |
| `pub fn ensure_publishable(&self, fingerprint: ContractFingerprint) -> Result<(), DomainError>` | 校验发布前指纹是否满足要求 | `fingerprint` 是待发布指纹 | `Result<(), DomainError>` | 不计算新指纹 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn default_sha256() -> FingerprintPolicy` | 创建默认 SHA-256 策略 | 无 | `FingerprintPolicy` | 发布前校验和快照对账 |

###### 不变量与禁止事项

- `FingerprintPolicy` 不直接读取正文或运行 hash 工具链。
- 指纹算法必须与 infra toolchain 输出一致。
- 发布前指纹不稳定时必须拒绝发布或进入待确认事项。

#### 9.7.6 `ContractChangeService`

###### 类型定义

```rust
/// 契约变更应用服务,编排契约草稿创建、草稿更新和提交评审。
///
/// 该对象负责事务边界、策略调用、repository 调用、审计和 outbox 协作;
/// 函数级处理流在 Step 9 展开。
pub struct ContractChangeService<P>
where
    P: ContractChangePorts,
{
    /// 变更用例所需端口集合。
    pub ports: P,

    /// 契约范围策略。
    pub scope_policy: ScopePolicy,

    /// 通用边界守卫。
    pub boundary_guard: BoundaryGuard,

    /// Definition / Use 边界守卫。
    pub definition_use_guard: DefinitionUseBoundaryGuard,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractChangePorts` | 聚合 repository、unit of work、audit、outbox、clock、id 等端口 | 只依赖 port trait,不依赖具体 infra |
| `scope_policy` | `ScopePolicy` | 判断候选契约是否可进入共享范围 | 必须先于聚合创建调用 |
| `boundary_guard` | `BoundaryGuard` | 阻止越界正文进入真相 | 写路径必须调用 |
| `definition_use_guard` | `DefinitionUseBoundaryGuard` | 阻止 Use truth 混入 Definition truth | 写路径必须调用 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn create_contract_draft(&self, command: CreateContractDraft, actor: ActorContext, meta: CommandMetadata) -> Result<ContractChangeReceipt, ApplicationError>` | 创建契约草稿 | `command` 是创建命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractChangeReceipt, ApplicationError>` | 开启事务,调用策略,创建 `ContractDefinition`,保存审计和 outbox |
| `pub async fn update_contract_draft(&self, command: UpdateContractDraft, actor: ActorContext, meta: CommandMetadata) -> Result<ContractChangeReceipt, ApplicationError>` | 更新契约草稿 | `command` 是更新命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractChangeReceipt, ApplicationError>` | 读取并保存聚合,保持幂等和乐观锁 |
| `pub async fn submit_contract_for_review(&self, command: SubmitContractForReview, actor: ActorContext, meta: CommandMetadata) -> Result<ContractReviewReceipt, ApplicationError>` | 提交契约进入评审 | `command` 是提交命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractReviewReceipt, ApplicationError>` | 迁移生命周期,追加演进记录,写审计 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P, scope_policy: ScopePolicy, boundary_guard: BoundaryGuard, definition_use_guard: DefinitionUseBoundaryGuard) -> ContractChangeService<P>` | 创建变更服务 | 参数分别为端口集合和领域策略对象 | `ContractChangeService<P>` | application wiring |

###### 不变量与禁止事项

- `ContractChangeService` 不实现认证授权。
- `ContractChangeService` 不依赖具体 repository adapter。
- 所有写路径必须显式携带 `ActorContext` 和 `CommandMetadata`。
- 函数体详细调用顺序留给 Step 9,本步只固定对象字段和入口函数契约。

#### 9.7.7 `ContractReleaseService`

###### 类型定义

```rust
/// 契约发布应用服务,编排发布基线创建、发布、弃用、退役和替代。
pub struct ContractReleaseService<P>
where
    P: ContractReleasePorts,
{
    /// 发布用例所需端口集合。
    pub ports: P,

    /// 发布规则策略。
    pub release_policy: ReleasePolicy,

    /// 引用校验策略。
    pub reference_policy: ReferenceValidationPolicy,

    /// 指纹策略。
    pub fingerprint_policy: FingerprintPolicy,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractReleasePorts` | 聚合定义、基线、审计、outbox、gate、clock、id 等端口 | 只依赖 port trait |
| `release_policy` | `ReleasePolicy` | 约束发布、弃用、退役和替代 | 发布前必须调用 |
| `reference_policy` | `ReferenceValidationPolicy` | 校验定义引用和快照引用 | 发布前必须严格校验 |
| `fingerprint_policy` | `FingerprintPolicy` | 校验发布指纹稳定性 | 发布前必须调用 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn publish_contract_baseline(&self, command: PublishContractBaseline, actor: ActorContext, meta: CommandMetadata) -> Result<ContractBaselineReceipt, ApplicationError>` | 发布契约基线 | `command` 是发布命令;`actor` 是发布者;`meta` 是写请求元数据 | `Result<ContractBaselineReceipt, ApplicationError>` | 校验 gate、引用、指纹和兼容状态,保存基线、审计和 outbox |
| `pub async fn update_contract_lifecycle(&self, command: UpdateContractLifecycle, actor: ActorContext, meta: CommandMetadata) -> Result<ContractLifecycleReceipt, ApplicationError>` | 执行弃用、退役或替代 | `command` 是生命周期命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractLifecycleReceipt, ApplicationError>` | 更新定义生命周期并记录演进事实 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P, release_policy: ReleasePolicy, reference_policy: ReferenceValidationPolicy, fingerprint_policy: FingerprintPolicy) -> ContractReleaseService<P>` | 创建发布服务 | 参数分别为端口集合和发布相关策略 | `ContractReleaseService<P>` | application wiring |

###### 不变量与禁止事项

- 发布必须通过 approved gate 引用。
- 发布服务不能直接导出快照正文,快照派生由 `ContractSnapshotService` 或 job 承担。
- 发布服务不能直接投递 L0-bus。

#### 9.7.8 `ContractCompatibilityService`

###### 类型定义

```rust
/// 契约兼容性应用服务,编排兼容判断、门禁引用和兼容性追溯生成。
pub struct ContractCompatibilityService<P>
where
    P: ContractCompatibilityPorts,
{
    /// 兼容性用例所需端口集合。
    pub ports: P,

    /// 指纹策略。
    pub fingerprint_policy: FingerprintPolicy,

    /// 引用校验策略。
    pub reference_policy: ReferenceValidationPolicy,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractCompatibilityPorts` | 聚合定义读取、toolchain runner、trace repository、clock、audit 等端口 | 只依赖 port trait |
| `fingerprint_policy` | `FingerprintPolicy` | 判断指纹漂移和发布稳定性 | 不直接运行 hash |
| `reference_policy` | `ReferenceValidationPolicy` | 校验引用状态对兼容性的影响 | 不直接解析外部引用 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn validate_contract_change(&self, command: ValidateContractChange, actor: ActorContext, meta: CommandMetadata) -> Result<CompatibilityValidationReceipt, ApplicationError>` | 校验契约变化兼容性 | `command` 是兼容性校验命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<CompatibilityValidationReceipt, ApplicationError>` | 调用端口获取校验结果,生成 `CompatibilityStatus` 和 trace index |
| `pub async fn get_compatibility_status(&self, query: GetCompatibilityTrace, actor: Option<ActorContext>, meta: QueryMetadata) -> Result<CompatibilityTraceView, ApplicationError>` | 查询兼容性追溯 | `query` 是查询条件;`actor` 是可选操作者;`meta` 是读请求元数据 | `Result<CompatibilityTraceView, ApplicationError>` | 只读查询,不得改写真相 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P, fingerprint_policy: FingerprintPolicy, reference_policy: ReferenceValidationPolicy) -> ContractCompatibilityService<P>` | 创建兼容性服务 | 参数分别为端口集合和策略对象 | `ContractCompatibilityService<P>` | application wiring |

###### 不变量与禁止事项

- 兼容性服务不把工具链结果单独写成发布真相。
- 查询兼容性不得修改兼容状态。
- 兼容性校验失败必须保留可追溯原因。

#### 9.7.9 `ContractSnapshotService`

###### 类型定义

```rust
/// 契约快照应用服务,编排发布快照派生、绑定和恢复入口。
pub struct ContractSnapshotService<P>
where
    P: ContractSnapshotPorts,
{
    /// 快照用例所需端口集合。
    pub ports: P,

    /// 引用校验策略。
    pub reference_policy: ReferenceValidationPolicy,

    /// 指纹策略。
    pub fingerprint_policy: FingerprintPolicy,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractSnapshotPorts` | 聚合基线、快照 repository、blob ref、exporter、clock、audit 等端口 | 只依赖 port trait |
| `reference_policy` | `ReferenceValidationPolicy` | 校验快照引用和基线关系 | 不访问外部系统 |
| `fingerprint_policy` | `FingerprintPolicy` | 校验快照指纹 | 不直接运行 hash 工具链 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn derive_release_snapshot(&self, command: DeriveReleaseSnapshot, actor: ActorContext, meta: CommandMetadata) -> Result<ContractSnapshotReceipt, ApplicationError>` | 从发布基线派生快照 | `command` 是派生命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractSnapshotReceipt, ApplicationError>` | 调用 exporter port,保存快照和消费引用 |
| `pub async fn get_release_snapshot(&self, query: GetContractReleaseSnapshot, meta: QueryMetadata) -> Result<ContractReleaseSnapshotView, ApplicationError>` | 查询发布快照 | `query` 是快照查询;`meta` 是读请求元数据 | `Result<ContractReleaseSnapshotView, ApplicationError>` | 只读,不得反写基线 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P, reference_policy: ReferenceValidationPolicy, fingerprint_policy: FingerprintPolicy) -> ContractSnapshotService<P>` | 创建快照服务 | 参数分别为端口集合和策略对象 | `ContractSnapshotService<P>` | application wiring |

###### 不变量与禁止事项

- 快照服务不得修改 `ContractDefinition` 真相。
- 快照正文只能通过 blob / snapshot ref 绑定。
- 快照派生失败必须保留可恢复状态,不能静默吞掉错误。

#### 9.7.10 `ContractTraceService`

###### 类型定义

```rust
/// 契约追溯应用服务,编排契约定义、版本、引用、审计、快照和事实的只读追溯视图。
pub struct ContractTraceService<P>
where
    P: ContractTracePorts,
{
    /// 追溯查询所需端口集合。
    pub ports: P,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractTracePorts` | 聚合 read model、trace projection、fact、audit、snapshot 等读取端口 | 只依赖 port trait |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn trace_contract_evolution(&self, query: TraceContractEvolution, actor: Option<ActorContext>, meta: QueryMetadata) -> Result<ContractTraceView, ApplicationError>` | 查询契约演进追溯 | `query` 是追溯查询;`actor` 是可选操作者;`meta` 是读请求元数据 | `Result<ContractTraceView, ApplicationError>` | 只读查询,不得改写真相 |
| `pub async fn get_contract_definition(&self, query: GetContractDefinition, meta: QueryMetadata) -> Result<ContractDefinitionView, ApplicationError>` | 查询契约定义详情 | `query` 是定义查询;`meta` 是读请求元数据 | `Result<ContractDefinitionView, ApplicationError>` | 可读取 read model 或权威定义 |
| `pub async fn list_contract_definitions(&self, query: ListContractDefinitions, meta: QueryMetadata) -> Result<ContractDefinitionListView, ApplicationError>` | 查询契约定义列表 | `query` 是列表查询;`meta` 是读请求元数据 | `Result<ContractDefinitionListView, ApplicationError>` | 只读列表查询 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P) -> ContractTraceService<P>` | 创建追溯服务 | `ports` 是追溯查询端口集合 | `ContractTraceService<P>` | application wiring |

###### 不变量与禁止事项

- 追溯服务只读,不得通过查询路径改写真相。
- 追溯视图可以组合 projection、audit、snapshot 和 fact,但不能复制外部正文。
- stale projection 必须显式暴露或触发后续重建流程。

#### 9.7.11 `ContractFactService`

###### 类型定义

```rust
/// 契约事实应用服务,编排契约变化事实记录、审计记录和 outbox 写入。
pub struct ContractFactService<P>
where
    P: ContractFactPorts,
{
    /// 事实输出所需端口集合。
    pub ports: P,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractFactPorts` | 聚合 fact repository、outbox、audit、clock、id 等端口 | 只依赖 port trait |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn append_release_fact(&self, baseline: ContractReleaseBaseline, snapshot: Option<ContractReleaseSnapshot>, actor: ActorContext, meta: CommandMetadata) -> Result<ContractFactReceipt, ApplicationError>` | 记录发布相关事实 | `baseline` 是发布基线;`snapshot` 是可选快照;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractFactReceipt, ApplicationError>` | 写 fact、audit 和 outbox,不直接投递 bus |
| `pub async fn publish_contract_fact(&self, command: PublishContractFact, actor: ActorContext, meta: CommandMetadata) -> Result<ContractFactReceipt, ApplicationError>` | 整理待发布事实 | `command` 是事实发布命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractFactReceipt, ApplicationError>` | 更新事实状态和 outbox 记录 |
| `pub async fn mark_fact_delivery_failed(&self, fact_id: ContractFactRecordId, reason: FactFailureReason, actor: ActorContext, meta: CommandMetadata) -> Result<ContractFactReceipt, ApplicationError>` | 标记事实输出失败 | `fact_id` 是事实 ID;`reason` 是失败原因;`actor` 是操作者;`meta` 是写请求元数据 | `Result<ContractFactReceipt, ApplicationError>` | 保留失败状态以便恢复 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P) -> ContractFactService<P>` | 创建事实服务 | `ports` 是事实输出端口集合 | `ContractFactService<P>` | application wiring |

###### 不变量与禁止事项

- 事实服务不实现 L0-bus runtime。
- 事实服务不得删除失败事实。
- outbox 写入必须与事实记录保持一致性,事务细节留给 Step 11。

#### 9.7.12 `ContractOperationsService`

###### 类型定义

```rust
/// 契约运维应用服务,编排 seed、replay、rebuild、recalculate 等后台和恢复动作。
pub struct ContractOperationsService<P>
where
    P: ContractOperationsPorts,
{
    /// 运维动作所需端口集合。
    pub ports: P,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ports` | `P: ContractOperationsPorts` | 聚合 source、snapshot、projection、outbox、toolchain、clock、audit 等端口 | 只依赖 port trait |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub async fn seed_initial_core_assets(&self, command: SeedInitialCoreAssets, actor: ActorContext, meta: CommandMetadata) -> Result<OperationsReceipt, ApplicationError>` | 初始化核心契约资产 | `command` 是 seed 命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<OperationsReceipt, ApplicationError>` | 写入初始资产和审计,不得覆盖已发布真相 |
| `pub async fn rebuild_contract_index(&self, command: RebuildContractIndex, actor: ActorContext, meta: CommandMetadata) -> Result<OperationsReceipt, ApplicationError>` | 重建查询索引和追溯投影 | `command` 是重建命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<OperationsReceipt, ApplicationError>` | 只重建 projection,不得改写真相 |
| `pub async fn recalculate_fingerprint(&self, command: RecalculateFingerprint, actor: ActorContext, meta: CommandMetadata) -> Result<OperationsReceipt, ApplicationError>` | 复算 canonical 指纹 | `command` 是复算命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<OperationsReceipt, ApplicationError>` | 复算结果用于漂移判断,不得单独发布真相 |
| `pub async fn replay_outbox(&self, command: ReplayOutbox, actor: ActorContext, meta: CommandMetadata) -> Result<OperationsReceipt, ApplicationError>` | 回放 outbox 事实 | `command` 是回放命令;`actor` 是操作者;`meta` 是写请求元数据 | `Result<OperationsReceipt, ApplicationError>` | 只能处理 outbox 和发布边界,不能改写定义正文 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(ports: P) -> ContractOperationsService<P>` | 创建运维服务 | `ports` 是运维端口集合 | `ContractOperationsService<P>` | application wiring |

###### 不变量与禁止事项

- 运维服务不能绕过 application service 直接改写真相。
- rebuild 只能重建 projection / index,不能修改 definition truth。
- fingerprint 复算结果必须经过策略和门禁流程,不能直接发布。
- outbox replay 不实现 L0-bus ack / retry / dead-letter runtime。

### 9.8 Step 6 统一复核

#### 9.8.1 对象覆盖复核

| 模块 | 对象覆盖 | 结论 |
|---|---|---|
| `contract_source_assets` | `ContractSourceRef`、`ContractPackageSourceRef` | 已覆盖源码逻辑引用和包源码引用 |
| `release_snapshot_assets` | `ReleaseSnapshotRef` | 已覆盖发布快照逻辑引用 |
| `contracts` | `ActorRef`、`ActorContext`、`RequestMetadata`、`CommandMetadata`、`QueryMetadata`、`Receipt`、`ErrorResponse` | 已覆盖公共协议支撑对象;完整 Command / Query / Event / Job schema 留给 Step 8 |
| `domain_definition` | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` | 已覆盖定义真相、范围、版本、生命周期和演进记录 |
| `domain_packages` | `ContractPackageCore`、`ContractPackageLifecycle`、六个强类型 package wrapper | 已覆盖共享包核心和消费域固定 wrapper |
| `domain_release` / `domain_snapshot` / `domain_fact` | `ContractReleaseBaseline`、`CompatibilityStatus`、`ContractReleaseSnapshot`、`DownstreamConsumptionRef`、`ContractFactRecord` | 已覆盖发布、快照、消费引用和事实链路 |
| `domain_reference_projection` | `ExternalReference`、`StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection` | 已覆盖引用、索引和查询投影 |
| `domain_policies` | `ScopePolicy`、`BoundaryGuard`、`DefinitionUseBoundaryGuard`、`ReferenceValidationPolicy`、`FingerprintPolicy` | 已覆盖纯领域策略对象 |
| `application_services` | 7 个 application service | 已覆盖 service 字段依赖和用例函数签名 |

#### 9.8.2 格式复核

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每个对象独立小节 | 通过 | 对象均按 `##### TypeName` 展开 |
| 类型定义代码块 | 通过 | 每个对象均有 Rust 契约片段 |
| 字段类型 | 通过 | 成员变量表均包含字段、类型、作用、约束 |
| 函数签名 | 通过 | 成员函数和工厂函数均写参数类型与返回类型 |
| enum variant 注释 | 通过 | enum 代码块和变体表均包含 Rustdoc 注释 |
| 不变量与禁止事项 | 通过 | 每个对象均显式写出边界红线 |
| 单批写入控制 | 通过 | 重对象章节已按批次拆写,未把对象卡片拆散 |

#### 9.8.3 后续 Step 依赖复核

| 后续 Step | 可承接内容 | 仍需展开 |
|---|---|---|
| Step 7 Trait / Port / Adapter | application service 的 `P: XxxPorts` 已形成 port 主语 | 需要定义 port trait 方法全集和 infra adapter 契约 |
| Step 8 协议契约 | 公共 metadata、receipt、error 已形成支撑对象 | 需要定义 Command / Query / Event / Job schema |
| Step 9 函数级处理流 | application service 用例函数签名已固定 | 需要逐接口写调用链、事务边界、错误分支 |
| Step 10 状态机 | 状态 enum 和初步来源 / 去向已固定 | 需要形成完整状态转换矩阵 |
| Step 11 持久化一致性 | aggregate、record、projection、fact 对象已固定 | 需要定义 repository 保存规则、事务、索引和一致性 |

#### 9.8.4 复核结论

```text
Step 6 已满足“逐模块定义对象实现契约”的进入下一步条件。
本步没有提前展开 port trait、protocol schema、函数级处理流、DDL 或测试方案。
可以进入 Step 7 “逐模块定义 Trait / Port / Adapter 契约”。
```

### 9.9 Step 13 回补:幂等支撑对象

Step 13 明确 Command / Job 幂等不能只依赖 `IdempotencyKey` 字段,还需要可持久化的幂等记录、payload fingerprint 和 replay decision。本节作为 Step 13 对 Step 6 的对象契约回补。

#### 9.9.1 `IdempotencyRecord`

###### 类型定义

```rust
/// 幂等处理记录,用于保存一次写请求或 job 的幂等预占、payload 指纹和可重放回执。
///
/// 该对象属于 application 边界支撑对象,不表达领域生命周期。
pub struct IdempotencyRecord {
    /// 幂等作用域。
    pub scope: IdempotencyScope,

    /// 调用方提供或 job 派生的幂等键。
    pub key: IdempotencyKey,

    /// 业务操作名。
    pub operation: OperationName,

    /// canonical payload 指纹。
    pub payload_fingerprint: RequestPayloadFingerprint,

    /// 首次请求 ID。
    pub request_id: RequestId,

    /// 幂等处理状态。
    pub status: IdempotencyStatus,

    /// 可重放回执。
    pub receipt: Option<Receipt>,

    /// 记录创建时间。
    pub created_at: Timestamp,

    /// 完成时间。
    pub completed_at: Option<Timestamp>,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `scope` | `IdempotencyScope` | 区分 command、job、event 等幂等命名空间 | 与 `key` 组成唯一键 |
| `key` | `IdempotencyKey` | 标识一次可重放写请求 | 不得为空 |
| `operation` | `OperationName` | 标识 create / update / publish 等操作 | 同一 key 重用时必须一致 |
| `payload_fingerprint` | `RequestPayloadFingerprint` | 判断重复请求 payload 是否一致 | 只由 canonical payload 计算 |
| `request_id` | `RequestId` | 记录首次请求来源 | 不参与 payload fingerprint |
| `status` | `IdempotencyStatus` | 表达 reserved / completed | 不表达领域状态 |
| `receipt` | `Option<Receipt>` | 完成后用于 replay | `Completed` 时必须存在 |
| `created_at` | `Timestamp` | 记录创建时间 | 由 clock port 注入 |
| `completed_at` | `Option<Timestamp>` | 完成时间 | `Completed` 时必须存在 |

###### 辅助 enum

```rust
/// 幂等作用域。
pub enum IdempotencyScope {
    /// Command API 写请求。
    Command,

    /// Operations Job 执行请求。
    Job,

    /// Outbound Event 发布边界。
    Event,
}

/// 幂等记录状态。
pub enum IdempotencyStatus {
    /// 已预占,对应请求正在处理或事务尚未完成。
    Reserved,

    /// 已完成,可以返回既有 receipt。
    Completed,
}

/// 幂等预占结果。
pub enum IdempotencyDecision {
    /// 新请求,调用方可以继续执行业务写入。
    Reserved,

    /// 已完成的重复请求,调用方应直接返回既有 receipt。
    Replay(Receipt),

    /// 同一 key 对应的 payload fingerprint 不一致。
    PayloadMismatch,

    /// 同一 key 已被预占但尚未完成。
    InProgress,
}
```

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches_payload(&self, payload_fingerprint: RequestPayloadFingerprint) -> bool` | 判断重复请求 payload 是否一致 | `payload_fingerprint` 是当前请求 canonical 指纹 | `bool` | 不修改记录 |
| `pub fn complete(&mut self, receipt: Receipt, completed_at: Timestamp) -> Result<(), ContractError>` | 标记幂等记录完成 | `receipt` 是可重放回执;`completed_at` 是完成时间 | `Result<(), ContractError>` | 只能从 `Reserved` 进入 `Completed` |
| `pub fn replay_receipt(&self) -> Option<Receipt>` | 读取可重放回执 | 无 | `Option<Receipt>` | 只有 `Completed` 返回 `Some` |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(scope: IdempotencyScope, key: IdempotencyKey, operation: OperationName, payload_fingerprint: RequestPayloadFingerprint, request_id: RequestId, now: Timestamp) -> Result<IdempotencyRecord, ContractError>` | 创建幂等预占记录 | 参数来自 command / job metadata 和 canonical payload | `Result<IdempotencyRecord, ContractError>` | `IdempotencyRepository.reserve(...)` 发现新 key 时使用 |

###### 不变量与禁止事项

- `payload_fingerprint` 不得包含 `trace_id`、`request_id`、actor session 或非业务时间戳。
- `IdempotencyRecord` 不保存完整 command / job payload。
- `Event` 作用域只用于记录发布边界需要时的去重语义;P0 事件主去重仍由 outbox + CloudEvent id 承担。
- 领域对象不得依赖或读取 `IdempotencyRecord`。

#### 9.9.2 `OperationName`

###### 类型定义

```rust
/// 幂等操作名,用于标识一次写请求或 job 的 canonical 操作语义。
pub enum OperationName {
    /// 创建契约草稿。
    CreateContractDraft,

    /// 更新契约草稿。
    UpdateContractDraft,

    /// 提交契约进入评审。
    SubmitContractForReview,

    /// 发布契约基线。
    PublishContractBaseline,

    /// 更新契约生命周期。
    UpdateContractLifecycle,

    /// 校验契约变化兼容性。
    ValidateContractChangeJob,

    /// 派生发布快照。
    DeriveReleaseSnapshotJob,

    /// 重建契约索引。
    RebuildContractIndexJob,

    /// 复算 canonical fingerprint。
    RecalculateFingerprintJob,

    /// 发布契约事实。
    PublishContractFactJob,
}
```

###### 不变量与禁止事项

- `OperationName` 只表达幂等语义,不承载 payload。
- `OperationName` 的取值必须与 Step 8 / Step 9 的协议和处理流名称一致。
- 不得把 `OperationName` 用作权限校验或路由规则。

#### 9.9.3 `RequestPayloadFingerprint`

###### 类型定义

```rust
/// 写请求 canonical payload 的指纹,用于判断同一幂等键对应的 payload 是否一致。
pub struct RequestPayloadFingerprint {
    /// 指纹值,例如 canonical hash 的 hex 字符串。
    pub value: String,
}
```

###### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `value` | `String` | 保存 canonical payload 指纹 | 必须由 canonical payload 计算 |

###### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn matches(&self, other: &RequestPayloadFingerprint) -> bool` | 判断两个 payload 指纹是否一致 | `other` 是待比较指纹 | `bool` | 不修改对象 |

###### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_canonical_payload(payload: &str) -> Result<RequestPayloadFingerprint, ContractError>` | 从 canonical payload 创建指纹 | `payload` 是 canonical 序列化后的请求正文 | `Result<RequestPayloadFingerprint, ContractError>` | command / job 幂等预占前计算 |

###### 不变量与禁止事项

- 不能直接使用未规范化的原始 JSON / YAML / TOML 计算。
- 指纹不包含 trace id、request id、actor session、时间戳或展示字段。
- 不得把 `RequestPayloadFingerprint` 误当成 `ContractFingerprint` 使用。

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. 第 5 章仍按 Step 5 的模块主轴展开。
2. 每个模块内部放置本步确认的对象实现契约。
3. 第 6 章只做全局索引,不替代第 5 章的模块内对象正文。
4. 正式文档章节必须标注本中间产物为校准来源。
```

正式文档建议回填结构:

```md
## 5. 模块实现契约

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts_axis.md`
> - `design-calibration/03_ddd_step_06_object_contracts.md`

### 5.x <module_name> 模块
#### 5.x.1 模块职责
#### 5.x.2 文件与代码主体映射
#### 5.x.3 对象实现契约
<按本文件 9.2~9.7 回填对应对象卡片>
#### 5.x.4 Trait / Port / Adapter 契约
<Step 7 回填>

## 6. 全局对象 / Trait / API 索引

<只做对象、trait、API、event、job 的定义位置索引,不重复对象正文>
```

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 6 是否拆多个文件 | A. 单文件分章节; B. 多个 Step 6 子文件; C. 直接写正式 `03-详细设计.md` | A | 本轮已通过分批写入控制 review 粒度,仍保持一个中间产物文件便于状态管理 | 已确认采用 A |
| `contracts` 中的 Command / Query / Event / Job DTO 是否在本步完整展开 | A. 本步完整展开; B. 本步只写上下文和公共支撑对象,完整 schema 留给 Step 8 | B | Step 8 专门定义协议契约,本步避免提前混写 schema | 已确认采用 B |
| application service 是否作为对象在本步展开 | A. 展开 service struct 和构造依赖; B. 留到 Step 9; C. 只列名称 | A | service 是实现对象,本步已定义依赖字段和用例函数签名;函数级流程留给 Step 9 | 已确认采用 A |

---

## 12. 进入下一步条件

Step 6 完成后必须满足:

- 每个模块中需要实现的对象已经明确。
- 每个对象都有独立小节。
- 每个 struct / enum / value object / service 都有 Rust 契约片段。
- 每个字段都有类型、作用和约束。
- 每个成员函数都有完整签名、参数类型、返回类型和副作用 / 不变量。
- 每个工厂 / 静态函数都有完整签名、参数类型、返回类型和使用场景。
- 每个 enum variant 都有 Rustdoc 注释。
- 对象归属与 Step 5 模块主轴一致。
- 可以进入 Step 7 “逐模块定义 Trait / Port / Adapter 契约”。
