# Step 6. 逐模块定义对象实现契约

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节: `projects/L1-conversation/03-详细设计.md` §5 模块实现契约中的对象实现契约 / §6 全局对象索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 模块主轴、对象归属和依赖方向 | 确认对象主要归属 `domain` 模块 |
| `projects/L1-conversation/02-概要设计.md` §6 | 关键对象轮廓、字段骨架、状态集合、成员函数和禁止事项 | 作为对象实现契约直接输入 |
| `projects/L1-conversation/02-概要设计.md` §9 | 状态定义与状态流转 | 作为状态 enum 和变体表输入 |
| `03_ddd_step_03_coding_runtime_constraints.md` | Rust 源码英文、rustdoc 覆盖公开契约、字段 / 函数必须写类型 | 作为 Rust 契约片段写法约束 |
| `standards/document/详细设计书写规范.md` §5.5 | 对象小节、类型定义、字段表、函数表、enum 变体表格式 | 作为本步输出格式 |

已确认结论:

```text
本 Step 重点定义 domain 模块对象实现契约。
contracts 模块的 DTO / Event / Job / View 在 Step 8 定义。
application 模块的 service 函数级处理流在 Step 9 定义。
application port / repository trait 在 Step 7 定义。
infra 模块的 adapter / config / runtime builder 在 Step 7 / Step 11 / Step 14 定义。
api / worker / jobs 模块的 handler / runner / binary contract 在 Step 8 / Step 9 定义。
```

依赖的前序 Step:

```text
Step 5 已确认所有领域对象归属 domain 模块。
```

---

## 3. SOP 问题回答

### 3.1 每个模块中需要定义哪些 struct / enum / value object / service？

| 模块 | 本 Step 定义对象 | 后续 Step 承接 |
|---|---|---|
| `contracts` | 不在本 Step 定义 DTO 细节 | Step 8 定义 Command / Query / Consumer / Event / Job / View / Receipt / protocol error |
| `domain` | 完整定义领域对象、状态 enum、policy、projection、reference object、history record、handoff record | Step 10 继续定义状态转换矩阵 |
| `application` | 本 Step 只登记 service 名称,不展开字段和函数 | Step 7 定义 port;Step 9 定义 service 调用链 |
| `infra` | 不在本 Step 定义 adapter / config 细节 | Step 7 / Step 11 / Step 14 定义 |
| `api` | 不在本 Step 定义 handler 细节 | Step 8 / Step 9 定义 |
| `worker` | 不在本 Step 定义 runner 细节 | Step 8 / Step 9 定义 |
| `jobs` | 不在本 Step 定义 binary 细节 | Step 8 / Step 9 定义 |

### 3.2 每个对象的主要责任和不变量是什么？

回答:见 §7.3~§7.10。每个对象独立成节,包含类型定义、成员变量、成员函数、工厂 / 静态函数、不变量与禁止事项。

### 3.3 每个字段的类型、作用和约束是什么？

回答:见每个对象的“成员变量”表。字段类型统一使用 Rust 类型名,不写裸字段名。

### 3.4 每个成员函数的完整签名、参数类型、返回类型和副作用是什么？

回答:见每个对象的“成员函数”表。所有函数签名必须写参数类型,例如 `can_accept_fact(&self, actor: ActorRef, scope: &ParticipantScope) -> bool`。

### 3.5 哪些函数是工厂函数或静态函数？

回答:见每个对象的“工厂 / 静态函数”表。所有工厂函数使用 `Type::function(Type 参数名) -> Result<Type, DomainError>` 形式。

### 3.6 哪些状态 enum 需要写变体、允许来源和允许去向？

| 状态 enum | 所属对象 | 是否进入 Step 10 状态矩阵 |
|---|---|---|
| `ConversationTruthState` | truth core | 是 |
| `ConversationSpaceLifecycleState` | `ConversationSpace` | 是 |
| `ParticipantScopeState` | `ParticipantScope` | 是 |
| `VisibilityScopeState` | `VisibilityScope` | 是 |
| `ScopeChangeState` | `ScopeChangeRecord` | 是 |
| `ConversationFactState` | contracts shared enum;`ConversationFact` 直接复用 | 是 |
| `FactAppendResult` | `FactAppendReceipt` | 是 |
| `ManifestationState` | contracts shared enum;`CrossDomainManifestation` 直接复用 | 是 |
| `ReferenceResolutionState` | contracts shared enum;reference / snapshot / projection 直接复用 | 是 |
| `ProjectionFreshnessState` | `ConversationProjectionState` | 是 |
| `ConversationChangeCursorState` | contracts shared enum;`ConversationChangeCursor` 和 query view 直接复用 | 是 |
| `ConversationOutboxPublicationState` | `ConversationOutboxRecord` | 是 |
| `TraceRetentionState` | `ConversationTraceContext` | 是 |
| `TraceHandoffState` | `TraceHandoffRecord` | 是 |
| `ArchiveHandoffState` | `ArchiveHandoffRecord` | 是 |

### 3.7 每个 enum variant 的 Rustdoc 注释是什么？带载荷 variant 的载荷类型承载什么语义？

回答:本 Step 的状态 enum 都在 §7.3~§7.10 给出代码块和变体表。本 Step 暂不定义带载荷 variant;错误 enum 的带载荷语义由 Step 12 定义。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 对象仍围绕 `Turn`、`StreamEvent`、AG-UI 和 event-to-turn mapping | 无法支撑新版 Conversation truth、scope、fact、manifestation、trace、projection 和 handoff 主线 |
| 当前 `02-概要设计.md` §6 | 已有对象轮廓,但不是 Rust struct / enum 契约 | 实现者仍需要字段类型、函数签名和 enum variant 注释 |
| Step 5 后续风险 | 若 Step 6 把 DTO、port、handler、adapter 全部混进对象章节 | 会重复 Step 7 / Step 8 / Step 9 / Step 14 |
| 状态 enum 风险 | 若只列状态名,不写 variant 注释和允许来源 / 去向 | 状态机无法被测试和实现 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象表达 | 概要级字段和函数骨架 | Rust struct / enum / policy 契约 | 支撑 1:1 实现 |
| 对象归属 | 概要对象候选池 | 全部领域对象归 `domain` 模块 | 对齐 Step 5 |
| enum 说明 | 状态名和用途 | enum 代码块 + variant Rustdoc + 变体表 | 满足规范和可测试性 |
| DTO / port / handler | 可能被误写进对象章节 | 明确后移到 Step 7 / Step 8 / Step 9 | 避免重复和边界混乱 |
| 值对象类型 | 概要中散落出现 | 本 Step 给出基础值对象归属表 | 减少“使用了未定义结构体”的风险 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 本 Step 定义所有模块对象,包括 DTO、service、adapter、handler | 看似完整 | 会重复 Step 7 / Step 8 / Step 9 / Step 14,且 service 字段依赖 port 尚未定义 | 不采用 |
| 方案 B: 本 Step 只完整定义 domain 模块对象,其他模块登记后续落点 | 聚焦领域 truth、状态和不变量,避免重复 | 需要后续 Step 严格补齐协议、port 和处理流 | 采用 |
| 方案 C: 只列对象索引,不写 struct / enum 片段 | 文件短 | 不满足“可直接写 Rust 类型和 impl”的要求 | 不采用 |

推荐方案:方案 B。

原因:

- Step 5 已确认领域对象归 `domain`,DTO、port、handler、adapter 分属后续 Step。
- `L1-conversation` 最容易出错的是 truth 归属、可见性、来源正文排除、显化引用和 handoff 边界,必须优先在 domain 对象层收稳。
- 按对象独立成节能让后续 Step 7~12 精确引用。

---

## 7. 结构化中间产物

### 7.1 对象定义范围表

| 模块 | 本 Step 输出 |
|---|---|
| `contracts` | 仅登记 DTO 后续由 Step 8 定义 |
| `domain` | 完整定义领域对象、状态 enum、policy、projection、reference object、history record、handoff record |
| `application` | 仅登记 service 名称,函数和字段由 Step 7 / Step 9 补齐 |
| `infra` | 仅登记 config / adapter / runtime builder 由 Step 7 / Step 14 补齐 |
| `api` / `worker` / `jobs` | 仅登记入口对象由 Step 8 / Step 9 补齐 |

### 7.2 基础值对象归属表

| 类型族 | 归属建议 | 实现口径 |
|---|---|---|
| `*Id` | 拥有该对象的 domain 文件 | 使用 newtype,例如 `pub struct ConversationSpaceId(String);` |
| `*Ref` | 引用目标所属 domain 文件;来自 core 的 ref 使用 `core-contracts` 类型 | 只保存引用,不保存正文 |
| `*Reason` | 触发该原因的 domain 文件 | Step 12 可继续细化错误映射 |
| `*State` / `*Status` / `*Result` | 拥有状态的 domain 对象文件 | 必须写 enum 代码块和变体表 |
| `Timestamp` | 优先使用 `core-contracts` 或统一时间值对象 | 不直接使用裸字符串 |
| `ActorContext` / `ActorRef` | re-export `core-contracts` 类型 | 不做认证授权实现,不复制 identity truth |
| `TraceContextRef` | conversation contracts 中对 core `TraceId` 的 alias / wrapper | 只保存 trace id,不创建第二 trace truth |
| `SystemActorRef` | conversation contracts 中包装 core `ActorRef` | 必须校验 `ActorKind::System` |
| `ConsumerContext` | conversation contracts | `consumer_ref`、可选 `actor_ref` / `visibility_scope_ref` / `purpose_ref`;不承载 request id、trace、page 或 consistency |
| `Version` / `Count` / `Sequence` / `Key` | 使用 newtype | 避免裸 `String` / `u64` 在领域层扩散 |

### 7.2.1 PH-02 共享值对象正式 schema

本小节补齐 PH-02 `space / scope / visibility` boundary 直接落码所需的基础值对象。实现侧不得把下列类型临时实现成裸 `String`、空 struct 或另一套字段。

归属口径:

- `ConversationSpaceKind`、`ConversationOwnerRef`、`ConversationParticipantRef`、`ConversationParticipantRole`、`ConsumerRef`、`ScopeSnapshotRef`、`CommandReasonRef`、`ScopeChangeReason`、`SpaceCloseReason`、`RestrictionReason` 和 `VisibilityRestrictionReason` 属于 `conversation-contracts/src/refs.rs` 或与其同层的 contracts value module。
- `VisibilityLevel`、`VisibilityRuleSet`、`VisibilityReadRuleSet`、`VisibilityAppendRuleSet`、`VisibilityManifestationRuleSet`、`VisibilityReviewRuleSet` 及其子类型属于 `conversation-contracts/src/visibility.rs`。
- `domain/space.rs`、`domain/scope.rs` 和 `domain/policies.rs` 只能消费这些 contracts value object,不得让 `contracts` 反向依赖 `domain`。

#### 7.2.1.1 space / owner / participant / consumer

```rust
/// Describes the logical kind of a conversation space.
pub enum ConversationSpaceKind {
    /// A project-scoped conversation space.
    Project,
    /// A personal conversation space owned through an actor reference.
    Personal,
    /// A system-owned conversation space.
    System,
    /// A space created to expose a cross-domain manifestation.
    Manifestation,
}

/// Describes what upstream owner namespace the space points to.
pub enum ConversationOwnerKind {
    /// The owner reference points to a workspace.
    Workspace,
    /// The owner reference points to a project.
    Project,
    /// The owner reference points to a work item.
    WorkItem,
    /// The owner reference points to an actor-owned personal scope.
    Actor,
    /// The owner reference points to a system owner.
    System,
}

/// References the owner of a conversation space without owning its lifecycle.
pub struct ConversationOwnerRef {
    /// The owner namespace.
    pub owner_kind: ConversationOwnerKind,
    /// Stable upstream reference for the owner.
    pub external_ref: ExternalReferenceRef,
}

/// Describes a conversation-local participant role.
pub enum ConversationParticipantRole {
    /// Can manage the space boundary and participate.
    Owner,
    /// Can manage participant or visibility updates when policy allows it.
    Maintainer,
    /// Can append and read under the visibility scope.
    Member,
    /// Can read under the visibility scope but cannot append.
    Observer,
}

/// References a participant and its conversation-local role.
pub struct ConversationParticipantRef {
    /// Actor participating in the conversation.
    pub actor_ref: ActorRef,
    /// Conversation-local role for the actor.
    pub participant_role: ConversationParticipantRole,
}

/// Describes the kind of read or output consumer.
pub enum ConsumerKind {
    /// A direct actor consumer.
    Actor,
    /// A system-owned consumer.
    System,
    /// An external integration consumer.
    Integration,
    /// A projection or maintenance job consumer.
    ProjectionJob,
}

/// References a consumer used by visibility checks and query outputs.
pub struct ConsumerRef {
    /// Consumer namespace.
    pub consumer_kind: ConsumerKind,
    /// Stable consumer reference for audit and cursor ownership.
    pub external_ref: ExternalReferenceRef,
    /// Actor backing the consumer when the consumer is actor-based.
    pub actor_ref: Option<ActorRef>,
}
```

约束:

- `ConversationOwnerRef` 只保存 owner 引用,不解析 workspace / project / work item / actor / system 的生命周期。
- `ConversationSpaceKind::Personal` 必须使用 `ConversationOwnerKind::Actor` 或能解析到 actor-owned personal scope 的 `external_ref`。
- `ParticipantScope.participants` 按 `ConversationParticipantRef.actor_ref` 去重;同一 actor 在同一 scope 中只能有一个 conversation-local role。
- `ConversationParticipantRole::Observer` 不授予 append 能力;`Owner`、`Maintainer`、`Member` 可作为 append 候选,仍需通过 visibility / truth policy。
- `ConsumerKind::Actor` 必须携带 `actor_ref = Some(...)`;其他 consumer kind 可以携带 actor_ref 作为审计来源,但不能据此绕过 visibility rule。

#### 7.2.1.2 visibility level 与 rule set

```rust
/// Describes the maximum default visibility breadth from narrow to wide.
pub enum VisibilityLevel {
    /// Only explicitly allowed consumers can read.
    Private,
    /// Conversation participants can read when rules allow it.
    Participants,
    /// Project-scoped consumers can read when rules allow it.
    Project,
    /// Workspace-scoped consumers can read when rules allow it.
    Workspace,
    /// Any trusted consumer can read when rules allow it.
    Public,
}

/// Pure data rule set consumed by visibility scope and policy.
pub struct VisibilityRuleSet {
    /// Maximum visibility breadth allowed by this rule set.
    pub maximum_visibility: VisibilityLevel,
    /// Rules used by read and subscription outputs.
    pub read_rules: VisibilityReadRuleSet,
    /// Rules used when facts are appended.
    pub append_rules: VisibilityAppendRuleSet,
    /// Rules used when external facts are manifested.
    pub manifestation_rules: VisibilityManifestationRuleSet,
    /// Rules used by review and trace reads.
    pub review_rules: VisibilityReviewRuleSet,
}

/// Read visibility rules.
pub struct VisibilityReadRuleSet {
    /// References to committed external rule definitions.
    pub rule_refs: Vec<VisibilityRuleRef>,
    /// Inline rule specs accepted by the trusted command boundary.
    pub inline_rules: Vec<VisibilityRuleSpec>,
}

/// Append visibility rules.
pub struct VisibilityAppendRuleSet {
    /// References to committed external rule definitions.
    pub rule_refs: Vec<VisibilityRuleRef>,
    /// Inline rule specs accepted by the trusted command boundary.
    pub inline_rules: Vec<VisibilityRuleSpec>,
}

/// Manifestation visibility rules.
pub struct VisibilityManifestationRuleSet {
    /// References to committed external rule definitions.
    pub rule_refs: Vec<VisibilityRuleRef>,
    /// Inline rule specs accepted by the trusted command boundary.
    pub inline_rules: Vec<VisibilityRuleSpec>,
}

/// Review visibility rules.
pub struct VisibilityReviewRuleSet {
    /// References to committed external rule definitions.
    pub rule_refs: Vec<VisibilityRuleRef>,
    /// Inline rule specs accepted by the trusted command boundary.
    pub inline_rules: Vec<VisibilityRuleSpec>,
}

/// References a committed visibility rule definition.
pub struct VisibilityRuleRef {
    /// Stable rule reference.
    pub external_ref: ExternalReferenceRef,
}

/// Describes what a visibility rule targets.
pub enum VisibilityRuleTargetKind {
    /// The rule targets one consumer.
    Consumer,
    /// The rule targets one participant role.
    ParticipantRole,
    /// The rule targets the conversation owner.
    Owner,
    /// The rule targets all current participants.
    AllParticipants,
    /// The rule targets the project scope.
    ProjectScope,
    /// The rule targets the workspace scope.
    WorkspaceScope,
}

/// Pure data target for a visibility rule.
pub struct VisibilityRuleTarget {
    /// Target kind.
    pub target_kind: VisibilityRuleTargetKind,
    /// Required when target kind is Consumer.
    pub consumer_ref: Option<ConsumerRef>,
    /// Required when target kind is ParticipantRole.
    pub participant_role: Option<ConversationParticipantRole>,
    /// Required when target kind is Owner, ProjectScope, or WorkspaceScope.
    pub owner_ref: Option<ConversationOwnerRef>,
}

/// Describes whether a visibility rule allows or denies the target.
pub enum VisibilityRuleEffect {
    /// Allow the target if other guards also pass.
    Allow,
    /// Deny the target even if a broader rule would allow it.
    Deny,
}

/// Inline visibility rule accepted by trusted command input.
pub struct VisibilityRuleSpec {
    /// Rule target.
    pub target: VisibilityRuleTarget,
    /// Rule effect.
    pub effect: VisibilityRuleEffect,
    /// Reason or policy evidence behind this rule.
    pub reason_ref: Option<CommandReasonRef>,
}
```

比较与校验规则:

- `VisibilityLevel` 的正式顺序从窄到宽为 `Private < Participants < Project < Workspace < Public`。
- `VisibilityScope::from_participant_scope(...)` 必须使用 `default_visibility` 初始化 `VisibilityScope.default_visibility`,并生成 `maximum_visibility <= default_visibility` 的默认 `VisibilityRuleSet`。
- `VisibilityScope::narrow_to(new_rules, actor)` 只允许 `new_rules.maximum_visibility <= current.visibility_rules.maximum_visibility` 且 `new_rules.maximum_visibility <= self.default_visibility`。
- `VisibilityScopeState::Sealed` 后,任何提高 `maximum_visibility`、新增更宽 `Allow` 目标或删除更窄 `Deny` 规则的请求都必须返回 `DomainError::InvalidStateTransition`。
- `VisibilityRuleTarget` 必须按 `target_kind` 精确携带对应字段;`Consumer` 只能带 `consumer_ref`,`ParticipantRole` 只能带 `participant_role`,`Owner` 必须带任意 owner kind 的 `owner_ref`,`ProjectScope` 必须带 `owner_kind = Project` 的 `owner_ref`,`WorkspaceScope` 必须带 `owner_kind = Workspace` 的 `owner_ref`,`AllParticipants` 不带三类可选字段。
- inline rule spec 只能保存 ref、role、level、effect 和 reason ref,不得保存外部正文、prompt、artifact body、runtime output body 或 secret。

#### 7.2.1.3 reason、close mode 与 snapshot ref

```rust
/// Stable reason code carried by a trusted command.
pub struct CommandReasonCode(String);

/// References why a command or state change was requested.
pub struct CommandReasonRef {
    /// Stable reason code for machine checks and tests.
    pub reason_code: CommandReasonCode,
    /// Optional supporting reference to ticket, policy, source event, or operator note.
    pub supporting_ref: Option<ExternalReferenceRef>,
}

/// Describes the kind of scope change.
pub enum ScopeChangeReasonKind {
    /// Initial scope was created with the space.
    InitialCreate,
    /// Participant was added.
    ParticipantAdded,
    /// Participant was removed.
    ParticipantRemoved,
    /// Visibility was narrowed.
    VisibilityNarrowed,
    /// Visibility was sealed.
    VisibilitySealed,
    /// Space was closed or moved to read-only.
    SpaceClosed,
    /// Policy required a restriction.
    PolicyRestriction,
    /// Policy allowed a recovery.
    Recovery,
}

/// Explains why a scope change exists.
pub struct ScopeChangeReason {
    /// Shared command reason reference.
    pub reason_ref: CommandReasonRef,
    /// Scope change kind.
    pub reason_kind: ScopeChangeReasonKind,
}

/// Describes the requested close mode.
pub enum SpaceCloseMode {
    /// Move the space to read-only.
    ReadOnly,
    /// Close the space.
    Closed,
    /// Mark the space as archived after archive intent is available.
    Archived,
}

/// Explains why a space close command was requested.
pub struct SpaceCloseReason {
    /// Shared command reason reference.
    pub reason_ref: CommandReasonRef,
    /// Requested close mode.
    pub close_mode: SpaceCloseMode,
}

/// Describes why a truth or participant scope became restricted.
pub enum RestrictionKind {
    /// A policy decision required restriction.
    Policy,
    /// Ownership boundary did not match.
    Ownership,
    /// Source reference could not be resolved.
    SourceUnresolved,
    /// Safety or redaction rule required restriction.
    Safety,
    /// Operations action required restriction.
    Operations,
}

/// Explains a truth or participant restriction.
pub struct RestrictionReason {
    /// Shared command reason reference.
    pub reason_ref: CommandReasonRef,
    /// Restriction kind.
    pub restriction_kind: RestrictionKind,
}

/// Describes why visibility became restricted.
pub enum VisibilityRestrictionKind {
    /// Visibility rules were narrowed by policy or command.
    PolicyNarrowed,
    /// Consumer was not authorized.
    UnauthorizedConsumer,
    /// Source boundary required restriction.
    SourceBoundary,
    /// Safety or redaction rule required restriction.
    Safety,
    /// Visibility was sealed.
    Sealed,
}

/// Explains a visibility restriction.
pub struct VisibilityRestrictionReason {
    /// Shared command reason reference.
    pub reason_ref: CommandReasonRef,
    /// Visibility restriction kind.
    pub restriction_kind: VisibilityRestrictionKind,
}

/// Describes which scope family a snapshot belongs to.
pub enum ScopeKind {
    /// Conversation space lifecycle snapshot.
    Space,
    /// Participant scope snapshot.
    Participant,
    /// Visibility scope snapshot.
    Visibility,
}

/// References a scope snapshot without embedding the full scope body.
pub struct ScopeSnapshotRef {
    /// Scope family.
    pub scope_kind: ScopeKind,
    /// Space that owns the snapshot.
    pub space_id: ConversationSpaceId,
    /// Required when scope kind is Participant.
    pub participant_scope_id: Option<ParticipantScopeId>,
    /// Required when scope kind is Visibility.
    pub visibility_scope_id: Option<VisibilityScopeId>,
    /// Required for participant / visibility snapshots; optional for space lifecycle snapshots.
    pub scope_version: Option<ScopeVersion>,
}
```

约束:

- `CommandReasonRef` 是业务 / 审计原因引用,不替代 `CommandMetadata.request`,也不重复承载 request id、trace 或 idempotency。
- `SpaceCloseMode::Archived` 必须和 `archive_intent_ref = Some(...)` 一起出现;否则 `CloseConversationSpaceRequest` reject。
- `SpaceCloseMode::ReadOnly` 映射到 `ConversationSpaceLifecycleState::ReadOnly`;`Closed` 映射到 `Closed`;`Archived` 映射到 `Archived`。
- `ScopeSnapshotRef.scope_kind = Participant` 时必须携带 `participant_scope_id` 和 `scope_version`,且 `visibility_scope_id = None`。
- `ScopeSnapshotRef.scope_kind = Visibility` 时必须携带 `visibility_scope_id` 和 `scope_version`,且 `participant_scope_id = None`。
- `ScopeSnapshotRef.scope_kind = Space` 时只要求 `space_id`,两个 scope id 必须为 `None`;若 repository 提供 space version,可填入 `scope_version`。
- `ScopeChangeRecord.previous_scope_ref` 和 `new_scope_ref` 必须使用同一个 `scope_kind` 和同一个 `space_id`。
- create-space 初始 `ScopeChangeRecord` 的正式口径为 `scope_kind = Space`。`previous_scope_ref` 使用同一 `space_id`、两个 scope id 为 `None`、`scope_version = None`,表示预创建占位,不代表已有持久化 space;`new_scope_ref` 使用同一 `space_id`、两个 scope id 为 `None`,PH-02 下 `scope_version = None`。

### 7.2.2 PH-04 / PH-05 public query / consumer 共享值对象正式 schema

本小节补齐 PH-04 `query DTO / read model / projection freshness` 和 PH-05 `inbound consumer public DTO` boundary 直接落码所需的共享值对象。实现侧不得把下列类型实现为空 struct、裸字符串别名或另一个未记录字段集。

归属口径:

- `ConversationReadModelId` 和 `ConversationChangeCursorRef` 属于 `conversation-contracts/src/refs.rs`。
- `SearchIndexProjectionId`、`ChangeCursorProjectionId`、`ConversationChangeCursorEntryId`、`SearchQueryText` 和 `PageLimit` 属于 `conversation-contracts/src/refs.rs`。
- `ConversationChangeCursorEntry` 属于 `conversation-contracts/src/views.rs` 的 shared projection DTO;`domain/projection.rs::ChangeCursorProjection` 直接复用该类型,不得另建 domain-only mirror struct。
- `ConversationFactState` 属于 `conversation-contracts/src/refs.rs`,与 `ProjectionFreshnessState` 同为 public view / event 可见共享 enum;`domain/fact.rs::ConversationFact` 必须直接复用该 enum,不得在 domain 内另建同名 enum 或 mirror enum。
- `ManifestationState` 属于 `conversation-contracts/src/refs.rs`,与 `ConversationFactState` 同为 public command result / event / query 可见共享 enum;`domain/manifestation.rs::CrossDomainManifestation` 必须直接复用该 enum,不得在 domain 内另建同名 enum 或 mirror enum。
- `ReferenceResolutionState` 属于 `conversation-contracts/src/refs.rs`,与 `ProjectionFreshnessState` 同为 public event / query / job report 可见共享 enum;`domain/reference.rs`、`domain/manifestation.rs` 和 projection 维护对象必须直接复用该 enum,不得在 domain 内另建同名 enum 或 mirror enum。
- `BridgeTargetMode` 属于 `conversation-contracts/src/refs.rs`,是 `BridgeMappedFactReceivedEvent` payload 的公开协议 enum;`ConsumeBridgeMappedFactReceivedFlow` 必须直接读取该字段选择 append fact 或 manifestation 分支,不得从 `fact_kind`、bridge adapter 名称或 routing rule 隐式推导。
- `ConversationChangeCursorState` 属于 `conversation-contracts/src/refs.rs`,与 `ProjectionFreshnessState` 同为 public query view 可见共享 enum;`domain/cursor.rs::ConversationChangeCursor` 必须直接复用该 enum。
- `ConversationOutboxEventKind` 属于 `conversation-contracts/src/refs.rs`,供 domain outbox、change cursor entry 和 outbound event DTO 共享;不得在 domain / contracts 分别复制。
- `EventId`、`EventEnvelopeRef`、`EventSourceRef`、`PolicyId` 和 `DiagnosticRef` 属于 `conversation-contracts/src/refs.rs`,用于 inbound source envelope、consumer receipt、manifestation policy 和 quarantine diagnostic;不得用裸字符串替代。
- `ConversationReadModelId` 是 projection identity,不是 truth id;不得写入 command result、outbox truth payload 或 upstream source ref。
- `ConversationChangeCursorRef` 是 query / read model 对游标的轻量引用,不替代 `ConversationChangeCursor` 对象本身。
- `SearchQueryText` 只表示已进入 query boundary 的搜索文本,不保存搜索结果、payload body 或 external body。
- `EventEnvelopeRef` 是 source envelope 引用,不是 `EventId`、`ConversationOutboxRecordId`、`ConversationEventId` 或 payload ref。
- `EventSourceRef` 是 source event producer / source object 的稳定安全引用,不保存上游对象正文。

```rust
/// Lightweight reference to a conversation fact without carrying payload body.
pub struct ConversationFactRef {
    /// Stable fact id.
    pub fact_id: ConversationFactId,
    /// Space that owns the fact.
    pub space_id: ConversationSpaceId,
    /// Append sequence used for ordering.
    pub append_sequence: ConversationFactSequence,
}

/// Lightweight reference to a cross-domain manifestation.
pub struct CrossDomainManifestationRef {
    /// Stable manifestation id.
    pub manifestation_id: CrossDomainManifestationId,
    /// Space that owns the manifestation record.
    pub space_id: ConversationSpaceId,
}

/// Stable id for a change cursor.
pub struct ConversationChangeCursorId(pub String);

/// Monotonic fact sequence scoped to a conversation space.
pub struct ConversationFactSequence(pub u64);

/// Monotonic outbox or change sequence scoped to a conversation space.
pub struct ConversationOutboxSequence(pub u64);

/// Source event id used by inbound consumers.
pub struct EventId(pub String);

/// Stable reference to the original inbound source envelope.
pub struct EventEnvelopeRef(pub String);

/// Stable source producer or source object pointer for routing and deduplication.
pub struct EventSourceRef(pub String);

/// Stable configured policy id.
pub struct PolicyId(pub String);

/// Safe diagnostic reference for quarantine and audit without storing raw payload.
pub struct DiagnosticRef(pub String);

/// Describes lifecycle state for a conversation fact.
pub enum ConversationFactState {
    /// The fact was accepted and can be read under visibility scope.
    Accepted,
    /// The fact exists but requires stricter visibility filtering.
    VisibilityRestricted,
    /// The fact was formally retracted but remains traceable.
    Retracted,
    /// The fact is isolated because source, safety, or boundary checks failed.
    Quarantined,
}

/// Describes manifestation lifecycle for an external fact in conversation.
pub enum ManifestationState {
    /// The external fact is manifested and can be read under visibility rules.
    Manifested,
    /// The manifested snapshot or source version is stale.
    Stale,
    /// The manifestation was revoked but remains traceable.
    Revoked,
    /// The source cannot currently be resolved.
    Unresolved,
}

/// Describes resolution and freshness state for an external reference or snapshot.
pub enum ReferenceResolutionState {
    /// The reference is resolved and aligned with the known source version.
    Fresh,
    /// The reference was resolved before but the source version changed.
    Stale,
    /// The reference is waiting for asynchronous resolution.
    Pending,
    /// The reference cannot currently be resolved.
    Unresolved,
    /// The reference is invalid and must not be used for display.
    Invalid,
}

/// Stable reference to the manifestation policy selected for an inbound source fact.
pub struct ManifestationPolicyRef {
    /// Policy family applied by the consumer or command path.
    pub policy_kind: ManifestationPolicyKind,
    /// Stable policy identifier within the configured policy set.
    pub policy_id: PolicyId,
}

/// Classifies which manifestation policy family applies to a source event.
pub enum ManifestationPolicyKind {
    /// Policy used for governance committed facts.
    GovernanceFact,
    /// Policy used for artifact committed facts.
    ArtifactFact,
    /// Policy used for bridge mapped facts that create manifestations.
    BridgeMappedFact,
    /// Configured default policy for trusted source events.
    DefaultTrustedSource,
}

/// Describes how an actor or membership change affects conversation visibility.
pub enum VisibilityImpact {
    /// The event may change read access and all affected read models must be stale.
    ReadScopeChanged,
    /// The event may change append access and append guards must refresh before write.
    AppendScopeChanged,
    /// The event may change manifestation visibility and external reference projections must be stale.
    ManifestationScopeChanged,
    /// The event affects identity metadata only and does not change visibility rules.
    NoVisibilityChange,
    /// The event impact cannot be narrowed safely, so all affected projections must be stale.
    UnknownConservative,
}

/// Outcome category returned by inbound event consumers.
pub enum ConsumerReceiptOutcome {
    /// The event changed local state or markers.
    Accepted,
    /// The event was already processed with the same digest.
    Duplicate,
    /// The event was rejected into quarantine because its envelope or payload is not safe to process.
    Quarantined,
    /// The event was valid but cannot be fully applied until a required reference resolves.
    Delayed,
    /// The event caused no local change.
    NoOp,
}

/// Selects how a bridge mapped fact should enter conversation.
pub enum BridgeTargetMode {
    /// Append the mapped fact as a conversation fact.
    AppendFact,
    /// Manifest the mapped external fact into the conversation space.
    ManifestExternalFact,
}

/// Receipt returned by inbound event consumers.
pub struct ConsumerReceipt {
    /// Source event id from the inbound event envelope.
    pub event_id: EventId,
    /// Source envelope reference for audit and dead-letter replay.
    pub event_envelope_ref: EventEnvelopeRef,
    /// Source system and object reference that produced the event.
    pub event_source_ref: EventSourceRef,
    /// Deduplication key used by the consumer.
    pub idempotency_key: IdempotencyKey,
    /// Consumer outcome.
    pub outcome: ConsumerReceiptOutcome,
    /// Application result reference when the consumer produced a durable local result.
    pub result_ref: Option<CommandResultRef>,
    /// Quarantine marker written for invalid envelope or unsafe payload.
    pub quarantine_ref: Option<QuarantineRecordRef>,
    /// Projection or reference state marker changed by the consumer.
    pub projection_state_ref: Option<ConversationProjectionStateId>,
    /// Trace context used for logs and audit.
    pub trace_ref: TraceContextRef,
}

/// Generic inbound event envelope owned by conversation contracts.
pub struct InboundEventEnvelope<T> {
    /// Source event id used for deduplication.
    pub event_id: EventId,
    /// Reference to the original source envelope, not the payload body.
    pub event_envelope_ref: EventEnvelopeRef,
    /// Stable source system/object pointer for routing and deduplication.
    pub event_source_ref: EventSourceRef,
    /// Idempotency key supplied by the event bridge or derived from event id + source ref.
    pub idempotency_key: IdempotencyKey,
    /// Event occurrence time from the source envelope.
    pub occurred_at: Timestamp,
    /// Trace reference propagated from the source envelope.
    pub trace_ref: TraceContextRef,
    /// Typed event payload.
    pub payload: T,
}

/// Stable quarantine record reference for invalid inbound events.
pub struct QuarantineRecordRef {
    /// Source event id that was quarantined.
    pub event_id: EventId,
    /// Safe diagnostic reference for the quarantine reason.
    pub diagnostic_ref: DiagnosticRef,
}

/// Stable id for an authorized read model projection.
pub struct ConversationReadModelId(pub String);

/// Stable id for a derived search index projection.
pub struct SearchIndexProjectionId(pub String);

/// Stable id for a derived change cursor projection.
pub struct ChangeCursorProjectionId(pub String);

/// Lightweight reference to a change cursor owned by a consumer in a space.
pub struct ConversationChangeCursorRef {
    /// Stable cursor id.
    pub cursor_id: ConversationChangeCursorId,
    /// Space that owns the cursor.
    pub space_id: ConversationSpaceId,
    /// Consumer that owns the cursor.
    pub consumer_ref: ConsumerRef,
}

/// Stable id for one entry in the change cursor projection.
pub struct ConversationChangeCursorEntryId(pub String);

/// Query text accepted by SearchConversationHistory.
pub struct SearchQueryText(pub String);

/// Maximum number of records returned by query or repository page reads.
pub struct PageLimit(pub u32);

/// Query-visible change entry derived from committed outbox records.
pub struct ConversationChangeCursorEntry {
    /// Stable entry id derived from space and outbox sequence.
    pub entry_id: ConversationChangeCursorEntryId,
    /// Space that owns the change.
    pub space_id: ConversationSpaceId,
    /// Outbox sequence used for cursor resume.
    pub outbox_sequence: ConversationOutboxSequence,
    /// Fact sequence when the change points at a fact.
    pub fact_sequence: Option<ConversationFactSequence>,
    /// Fact ref when the change is fact-scoped.
    pub fact_ref: Option<ConversationFactRef>,
    /// Manifestation ref when the change is manifestation-scoped.
    pub manifestation_ref: Option<CrossDomainManifestationRef>,
    /// Event kind represented by the change.
    pub event_kind: ConversationOutboxEventKind,
    /// Visibility scope checked before returning the entry.
    pub visibility_scope_id: VisibilityScopeId,
    /// Committed time copied from ConversationOutboxRecord.committed_at.
    pub occurred_at: Timestamp,
}

/// Stable id for a projection freshness state.
pub struct ConversationProjectionStateId(pub String);

/// Projection kind visible to query and operations.
pub enum ConversationProjectionKind {
    /// Authorized read model projection.
    ReadModel,
    /// Search index projection.
    Search,
    /// Change cursor projection.
    ChangeCursor,
    /// External reference projection.
    ExternalReference,
}

/// Describes projection freshness and rebuild lifecycle.
pub enum ProjectionFreshnessState {
    /// Projection is aligned with the source position.
    Fresh,
    /// Projection lags behind committed truth.
    Stale,
    /// Projection is currently being rebuilt.
    Rebuilding,
    /// Projection rebuild failed and reads must degrade or expose failure.
    Failed,
    /// Projection is disabled and must not be used for reads.
    Disabled,
}

/// Source position covered by a derived projection.
pub struct ConversationSourcePosition {
    /// Last committed fact sequence covered by the projection.
    pub last_fact_sequence: ConversationFactSequence,
    /// Last committed outbox sequence covered by the projection.
    pub last_outbox_sequence: ConversationOutboxSequence,
}

/// Reference to a projection rebuild attempt.
pub struct ProjectionRebuildRef {
    /// Stable rebuild id.
    pub rebuild_id: ProjectionRebuildId,
    /// Job run that started the rebuild.
    pub job_run_id: JobRunId,
    /// Projection kind being rebuilt.
    pub projection_kind: ConversationProjectionKind,
    /// Timestamp when rebuild began.
    pub started_at: Timestamp,
}

/// Stable projection rebuild id.
pub struct ProjectionRebuildId(pub String);

/// Reference to the latest projection failure diagnostic.
pub struct ProjectionErrorRef {
    /// Stable projection error id.
    pub projection_error_id: ProjectionErrorId,
    /// Machine-readable error code.
    pub error_code: ProjectionErrorCode,
    /// Optional external diagnostic or report ref.
    pub diagnostic_ref: Option<ExternalReferenceRef>,
}

/// Stable projection error id.
pub struct ProjectionErrorId(pub String);

/// Machine-readable projection failure code.
pub struct ProjectionErrorCode(pub String);

/// Reason for marking a projection stale.
pub enum ProjectionStaleReason {
    /// A fact was appended.
    FactAppended,
    /// A fact was retracted.
    FactRetracted,
    /// Visibility scope changed.
    VisibilityScopeChanged,
    /// Actor or participant data changed.
    ActorChanged,
    /// External source changed.
    ExternalSourceChanged,
    /// Outbox or change sequence has a gap.
    OutboxGap,
    /// Operator or maintenance code invalidated the projection.
    ManualInvalidation,
}

/// Reason for disabling a projection.
pub struct ProjectionDisableReason {
    /// Shared command or configuration reason.
    pub reason_ref: CommandReasonRef,
}

/// Reason for marking a change cursor stale.
pub enum CursorStaleReason {
    /// Outbox sequence has a gap.
    OutboxGap,
    /// Projection lag prevents reliable resume.
    ProjectionLag,
    /// Source truth changed outside the cursor window.
    SourceChanged,
    /// Visibility or participant scope changed.
    VisibilityChanged,
}
```

PH-05 consumer 公共类型归属与校验规则:

- `InboundEventEnvelope<T>`、`ConsumerReceipt`、`ConsumerReceiptOutcome`、`ManifestationPolicyRef`、`ManifestationPolicyKind`、`VisibilityImpact` 和 `QuarantineRecordRef` 均属于 `conversation-contracts/src/events.rs` 或 `conversation-contracts/src/refs.rs`。实现可以按文件职责拆分,但不得让这些 public consumer 类型依赖 domain crate。
- `InboundEventEnvelope<T>.event_id`、`event_envelope_ref`、`event_source_ref`、`idempotency_key`、`occurred_at`、`trace_ref` 为所有 inbound consumer 必填字段;缺失任一字段时返回 `ConsumerReceipt { outcome: Quarantined, quarantine_ref: Some(...) }`,不得写 business truth。
- `event_envelope_ref` 是来源 envelope 引用,不等于 `event_id`,也不等于 `ConversationOutboxRecordId`。
- `idempotency_key` 的 dedup 作用域为 consumer operation + `event_id` + `event_source_ref`;same digest duplicate 返回 `ConsumerReceiptOutcome::Duplicate`,不得重写 snapshot、manifestation、fact、projection 或 outbox。
- `ConsumerReceipt.result_ref` 只在已产生 durable local result 时填写;quarantine / delayed / no-op path 可以为空。
- `ManifestationPolicyRef` 只引用已配置或已解析的显化策略,不得携带策略正文;缺失时由 consumer config 默认策略派生,若无默认策略则 quarantine。
- `VisibilityImpact::UnknownConservative` 必须导致 affected spaces 的 read model / external reference projection stale marker;不得被当作 no-op。

| 类型 | 字段 / 派生口径 | 约束 |
|---|---|---|
| `ConversationFactRef` | `fact_id`、`space_id`、`append_sequence` | 不包含 payload body;`append_sequence` 只用于排序和 cursor |
| `CrossDomainManifestationRef` | `manifestation_id`、`space_id` | 不包含 external source body 或 snapshot body |
| `ConversationChangeCursorId` | opaque string | 由 `space_id + consumer_ref` 稳定派生 |
| `ConversationFactSequence` | `u64` newtype | 同一 space 内单调递增;初始零值使用 `ConversationFactSequence(0)` |
| `ConversationOutboxSequence` | `u64` newtype | 同一 space 内单调递增;初始零值使用 `ConversationOutboxSequence(0)` |
| `EventId` | opaque string from source envelope | inbound consumer dedup id;不等同于 trace id、request id 或 conversation outbox event id |
| `EventEnvelopeRef` | opaque string / source envelope pointer | 用于 replay / audit;不等同于 event id、outbox record id 或 payload ref |
| `EventSourceRef` | opaque string / source producer + source object pointer | 用于 routing 和 dedup;不保存 source object body |
| `PolicyId` | opaque configured policy id | 用于 manifestation policy lookup;不携带 policy body |
| `DiagnosticRef` | opaque safe diagnostic pointer | 用于 quarantine audit;不保存 raw payload、secret 或 resolver error body |
| `ConversationFactState` | `Accepted`、`VisibilityRestricted`、`Retracted`、`Quarantined` | contracts / domain / event / query view 共享;不得复制第二套 enum |
| `ManifestationState` | `Manifested`、`Stale`、`Revoked`、`Unresolved` | contracts / domain / command result / event 共享;不得复制第二套 enum |
| `ReferenceResolutionState` | `Fresh`、`Stale`、`Pending`、`Unresolved`、`Invalid` | contracts / domain / consumer / job report 共享;不得复制第二套 enum |
| `BridgeTargetMode` | `AppendFact`、`ManifestExternalFact` | `BridgeMappedFactReceivedEvent.target_mode` 的正式类型;append 分支必须要求 `fact_kind = BridgeMapped`;manifest 分支不得把 bridge 平台正文写入 truth |
| `ConversationReadModelId` | 由 `space_id + consumer_ref` 稳定派生,编码为实现可比较的 opaque string | 同一 `space_id` 与同一 `consumer_ref` 必须得到同一 id;不得使用随机 id |
| `SearchIndexProjectionId` | 由 repository key `space_id` 稳定派生 | 同一 space 的 search projection 必须得到同一 id;不得随机生成 |
| `ChangeCursorProjectionId` | 由 repository key `space_id` 稳定派生 | 同一 space 的 change cursor projection 必须得到同一 id;不得随机生成 |
| `ConversationChangeCursorRef` | `cursor_id`、`space_id`、`consumer_ref` | 三个字段必须与目标 `ConversationChangeCursor` 一致 |
| `ConversationChangeCursorEntryId` | 由 `space_id + outbox_sequence` 稳定派生 | 同一 committed outbox record 只能生成一个 entry id |
| `SearchQueryText` | transparent string newtype | `trim()` 后不得为空;不保存 payload body;长度上限若未由配置覆盖,P0 默认 256 UTF-8 bytes |
| `PageLimit` | `u32` newtype | 用于 query page / repository page 读取数量上限;必须 `> 0`;不得与 job `BatchSize` 混用 |
| `ConversationChangeCursorEntry` | `entry_id`、`space_id`、`outbox_sequence`、`fact_sequence`、`fact_ref`、`manifestation_ref`、`event_kind`、`visibility_scope_id`、`occurred_at` | 只引用变化,不保存 fact payload、manifestation body 或 outbox payload body |
| `ConversationProjectionStateId` | 由 repository key `space_id + projection_kind` 稳定派生 | 同一 space / projection kind 必须得到同一 id;不得随机生成 |
| `ConversationProjectionKind` | `ReadModel`、`Search`、`ChangeCursor`、`ExternalReference` | 不等于具体 repository / adapter 名称 |
| `ProjectionFreshnessState` | `Fresh`、`Stale`、`Rebuilding`、`Failed`、`Disabled` | contracts view 和 domain projection 共享;stale / failed 不得隐藏 |
| `ConversationSourcePosition` | `last_fact_sequence`、`last_outbox_sequence` | 两个 sequence 都只能前进;缺省空位用零值表达 |
| `ProjectionRebuildRef` | `rebuild_id`、`job_run_id`、`projection_kind`、`started_at` | 只引用 rebuild attempt,不保存 job report body |
| `ProjectionErrorRef` | `projection_error_id`、`error_code`、`diagnostic_ref` | failed marker 必须保留;不保存错误日志正文 |
| `ProjectionStaleReason` | enum | 只作为状态变化原因,不反写真相 |
| `ProjectionDisableReason` | `reason_ref` | 禁用 projection 不等于删除 truth |
| `CursorStaleReason` | enum | cursor stale 不等于 fact stale |

稳定派生规则:

- `ConversationReadModelId::for_consumer(space_id, consumer_ref)` 是正式生成口径;实现可使用 canonical serialization + digest / slug,但输出必须 deterministic。
- `SearchIndexProjectionId::for_space(space_id)` 是正式生成口径;repository key 只使用 `space_id`。
- `ChangeCursorProjectionId::for_space(space_id)` 是正式生成口径;repository key 只使用 `space_id`。
- `PageLimit::from_query_or_default(limit, config_default, config_max)` 是 public query 的正式限制口径;缺省使用 config default,超过 config max 返回 `ProtocolError::InvalidQuery` 或按协议明确截断。P0 采用 reject,不得静默改用 job `BatchSize`。
- `ConversationChangeCursorId` 在 `ConversationChangeCursor::start_from(...)` 中按 `space_id + consumer_ref` 稳定派生;若未来需要多 cursor,必须先新增 cursor purpose / stream key 字段再扩展派生口径。
- `ConversationChangeCursorRef::from_cursor(cursor)` 必须复制 `cursor.cursor_id`、`cursor.space_id` 和 `cursor.consumer_ref`,不得只保存 `cursor_id`。
- `ConversationChangeCursorEntryId::from_outbox(space_id, outbox_sequence)` 是正式生成口径;不得从数组下标、分页 token 或随机数生成。
- `ConversationChangeCursorEntry::from_outbox(outbox)` 必须复制 `outbox.space_id`、`outbox.outbox_sequence`、`outbox.event_kind`、`outbox.fact_sequence`、`outbox.fact_ref`、`outbox.manifestation_ref`、`outbox.visibility_scope_id` 和 `outbox.committed_at`;`occurred_at = outbox.committed_at`。`from_outbox(...)` 不得读取 wall clock,不得从 payload body、fact repository 或 manifestation repository 反查字段。
- `ConversationOutboxRecord` 是 change cursor rebuild 的 committed truth log;任何进入 `ConversationOutboxRepository.list_committed_since(...)` 返回值的 record 必须已经持久化 `committed_at` 与 cursor entry 构造字段。若 outbox 不指向 fact,`fact_sequence` 和 `fact_ref` 必须为 `None`;若 outbox 不指向 manifestation,`manifestation_ref` 必须为 `None`。
- `ConversationProjectionStateId::for_projection(space_id, projection_kind)` 是正式生成口径;`ConversationProjectionState.space_id` 必须与 repository key 和 query view 的 `space_id` 一致。
- `ConversationFactRef::from_fact(fact)` 必须复制 `fact_id`、`space_id` 和 `append_sequence`,不得复制 `payload_ref`。
- `CrossDomainManifestationRef::from_manifestation(manifestation)` 必须复制 `manifestation_id` 和 `space_id`,不得复制 `external_fact_ref`、`snapshot_ref` 或 source body。
- `ConversationSourcePosition::zero()` 使用 `ConversationFactSequence(0)` 和 `ConversationOutboxSequence(0)`,用于 empty / initial projection marker。

### 7.3 `domain/truth.rs` 对象实现契约

#### 7.3.1 `ConversationTruthState`

```rust
/// Describes whether conversation truth can be appended, read, restricted, handed off, or closed.
pub enum ConversationTruthState {
    /// Truth is established and accepts append and read operations under scope policies.
    Open,
    /// Truth no longer accepts new facts but still allows authorized read, review, and handoff.
    ReadOnly,
    /// Truth is available only through restricted read or write paths.
    Restricted,
    /// Truth has committed handoff work that must be published or delivered.
    HandoffPending,
    /// Truth is closed and only supports controlled trace and handoff paths.
    Closed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | `Truth is established and accepts append and read operations under scope policies.` | 可写可读 | 创建 space | `ReadOnly`、`Restricted`、`HandoffPending`、`Closed` |
| `ReadOnly` | `Truth no longer accepts new facts but still allows authorized read, review, and handoff.` | 停写但可读 | `Open`、`Restricted` | `HandoffPending`、`Closed` |
| `Restricted` | `Truth is available only through restricted read or write paths.` | 受限读写 | `Open`、`ReadOnly` | `Open`、`ReadOnly`、`Closed` |
| `HandoffPending` | `Truth has committed handoff work that must be published or delivered.` | 存在交接意图 | `Open`、`ReadOnly` | `Open`、`ReadOnly`、`Closed` |
| `Closed` | `Truth is closed and only supports controlled trace and handoff paths.` | 终态 | `Open`、`ReadOnly`、`Restricted`、`HandoffPending` | 不适用 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `allows_append(&self, space: &ConversationSpace, actor: ActorRef) -> bool` | 判断是否允许追加事实 | `space` 为当前空间;`actor` 为发起者 | `bool` | 不修改状态 |
| `allows_read(&self, visibility: &VisibilityScope, consumer: ConsumerRef) -> bool` | 判断是否允许授权读取 | `visibility` 为可见范围;`consumer` 为读取方 | `bool` | 不绕过可见性 |
| `requires_handoff(&self) -> bool` | 判断是否需要 outbox / handoff 承接 | 无 | `bool` | 只读 |
| `is_terminal(&self) -> bool` | 判断是否终止 | 无 | `bool` | `Closed` 为终态 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationTruthState::open_for_space(space_id: ConversationSpaceId, actor: ActorRef) -> Self` | 创建初始可写 truth 状态 | `space_id` 为对话空间;`actor` 为创建者 | `Self` | space 创建成功后 |
| `ConversationTruthState::restricted(reason: RestrictionReason) -> Self` | 创建受限状态 | `reason` 为受限原因 | `Self` | 可见性或边界异常 |

不变量与禁止事项:

- projection stale 不能改变 truth 状态。
- outbox 发布成功不是 truth 成立前置。
- 状态 enum 不携带外部正文。

#### 7.3.2 `ConversationTruthPolicy`

```rust
/// Guards ownership, forbidden body exclusion, derived write prevention, and handoff ordering.
pub struct ConversationTruthPolicy {
    /// Rules that decide what belongs to conversation truth.
    pub ownership_rules: ConversationOwnershipRuleSet,
    /// Rules that prevent external bodies and secrets from entering truth.
    pub body_exclusion_rules: BodyExclusionRuleSet,
    /// Rules that keep derived views read-only.
    pub derived_write_rules: DerivedWriteRuleSet,
    /// Rules that require handoff records to originate from committed truth.
    pub handoff_rules: ConversationHandoffRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `ownership_rules` | `ConversationOwnershipRuleSet` | 约束本仓 truth 归属 | 不能接管来源仓 truth |
| `body_exclusion_rules` | `BodyExclusionRuleSet` | 排除 runtime / bridge / artifact / secret 正文 | 必须默认开启 |
| `derived_write_rules` | `DerivedWriteRuleSet` | 阻止 projection / index / snapshot 反写真相 | 不得配置绕过 |
| `handoff_rules` | `ConversationHandoffRuleSet` | 约束 outbox / handoff 必须来自已提交 truth | handoff 失败不回滚 truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_truth_owner(&self, fact: &ConversationFact, space: &ConversationSpace) -> Result<(), DomainError>` | 校验事实属于本对话空间 | `fact` 为事实;`space` 为所属空间 | `Result<(), DomainError>` | 不调用外部系统 |
| `assert_external_body_excluded(&self, snapshot: &ExternalFactSnapshot) -> Result<(), DomainError>` | 校验外部快照不含禁止正文 | `snapshot` 为外部快照 | `Result<(), DomainError>` | 只检查引用和 marker |
| `assert_projection_read_only(&self, state: &ConversationProjectionState) -> Result<(), DomainError>` | 校验派生对象只读 | `state` 为派生状态 | `Result<(), DomainError>` | 不修改派生 |
| `assert_handoff_after_commit(&self, outbox: &ConversationOutboxRecord) -> Result<(), DomainError>` | 校验 outbox 来自已提交 truth | `outbox` 为传播记录 | `Result<(), DomainError>` | 不发布事件 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationTruthPolicy::default_policy() -> Self` | 构造默认 truth policy | 无 | `Self` | runtime builder 注入 |
| `ConversationTruthPolicy::from_boundary_rules(rules: ConversationBoundaryRuleSet) -> Self` | 从边界规则构造 policy | `rules` 为边界规则集合 | `Self` | 配置已校验后 |

不变量与禁止事项:

- policy 不调用 repository、port 或外部系统。
- policy 不保存来源仓正文。
- policy 不决定配置加载方式。

#### 7.3.3 `ConversationOutboxRecord`

```rust
/// Records a committed conversation truth event that must be published, handed off, retried, or suppressed.
pub struct ConversationOutboxRecord {
    /// Stable id for this outbox record.
    pub outbox_record_id: ConversationOutboxRecordId,
    /// Monotonic outbox sequence used by change cursors.
    pub outbox_sequence: ConversationOutboxSequence,
    /// Conversation space that owns the committed truth.
    pub space_id: ConversationSpaceId,
    /// Reference to the committed truth object.
    pub truth_ref: ConversationTruthRef,
    /// Event kind to publish or hand off.
    pub event_kind: ConversationOutboxEventKind,
    /// Redacted payload reference used by publishers.
    pub payload_ref: ConversationOutboxPayloadRef,
    /// Fact sequence used by change cursor entries when the outbox points at a fact.
    pub fact_sequence: Option<ConversationFactSequence>,
    /// Fact ref used by change cursor entries when the outbox points at a fact.
    pub fact_ref: Option<ConversationFactRef>,
    /// Manifestation ref used by change cursor entries when the outbox points at a manifestation.
    pub manifestation_ref: Option<CrossDomainManifestationRef>,
    /// Visibility scope used by cursor filtering and lightweight change notifications.
    pub visibility_scope_id: VisibilityScopeId,
    /// Timestamp assigned when the truth and outbox record are committed in one unit of work.
    pub committed_at: Timestamp,
    /// Publication lifecycle state.
    pub publication_state: ConversationOutboxPublicationState,
    /// Retry evidence for failed publication attempts.
    pub retry_marker: Option<OutboxRetryMarker>,
}
```

```rust
/// Describes which conversation event a committed outbox record can publish.
pub enum ConversationOutboxEventKind {
    /// Space lifecycle or owner metadata changed.
    SpaceChanged,
    /// Participant or visibility scope changed.
    ScopeChanged,
    /// A conversation fact was appended.
    FactAppended,
    /// A conversation fact was retracted.
    FactRetracted,
    /// A cross-domain manifestation changed.
    ManifestationChanged,
    /// A lightweight change notification is available for cursor polling.
    ChangeAvailable,
    /// A trace handoff was requested.
    TraceHandoffRequested,
    /// An archive handoff was requested.
    ArchiveHandoffRequested,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许的 truth ref |
|---|---|---|---|
| `SpaceChanged` | `Space lifecycle or owner metadata changed.` | 传播 space 生命周期变化 | `ConversationSpace` / `ScopeChangeRecord` |
| `ScopeChanged` | `Participant or visibility scope changed.` | 传播参与范围或可见范围变化 | `ScopeChangeRecord` |
| `FactAppended` | `A conversation fact was appended.` | 传播 fact append | `ConversationFact` |
| `FactRetracted` | `A conversation fact was retracted.` | 传播 fact retract | `ConversationFact` |
| `ManifestationChanged` | `A cross-domain manifestation changed.` | 传播显化变化 | `CrossDomainManifestation` |
| `ChangeAvailable` | `A lightweight change notification is available for cursor polling.` | 传播轻量变化通知 | 任一已提交 conversation truth |
| `TraceHandoffRequested` | `A trace handoff was requested.` | 传播 trace handoff intent | `TraceHandoffRecord` |
| `ArchiveHandoffRequested` | `An archive handoff was requested.` | 传播 archive handoff intent | `ArchiveHandoffRecord` |

```rust
/// Describes the domain object kind referenced by a conversation outbox record.
pub enum ConversationTruthRefKind {
    /// Reference points to a conversation space.
    ConversationSpace,
    /// Reference points to a scope change record.
    ScopeChange,
    /// Reference points to a conversation fact.
    ConversationFact,
    /// Reference points to a cross-domain manifestation.
    CrossDomainManifestation,
    /// Reference points to a review anchor.
    ReviewAnchor,
    /// Reference points to a trace handoff record.
    TraceHandoff,
    /// Reference points to an archive handoff record.
    ArchiveHandoff,
}
```

| 变体 | Rustdoc 注释 | 作用 |
|---|---|---|
| `ConversationSpace` | `Reference points to a conversation space.` | space truth 引用 |
| `ScopeChange` | `Reference points to a scope change record.` | scope change truth 引用 |
| `ConversationFact` | `Reference points to a conversation fact.` | fact truth 引用 |
| `CrossDomainManifestation` | `Reference points to a cross-domain manifestation.` | manifestation truth 引用 |
| `ReviewAnchor` | `Reference points to a review anchor.` | review anchor truth 引用 |
| `TraceHandoff` | `Reference points to a trace handoff record.` | trace handoff truth 引用 |
| `ArchiveHandoff` | `Reference points to an archive handoff record.` | archive handoff truth 引用 |

```rust
/// Describes publication state for a committed conversation outbox record.
pub enum ConversationOutboxPublicationState {
    /// The record waits for publication or handoff.
    Pending,
    /// The record was published or handed off successfully.
    Published,
    /// Publication failed and is scheduled for retry.
    RetryPending,
    /// Publication failed permanently and requires operations handling.
    Failed,
    /// Publication was suppressed by visibility or boundary rules.
    Suppressed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The record waits for publication or handoff.` | 等待发布 | outbox 创建 | `Published`、`RetryPending`、`Suppressed` |
| `Published` | `The record was published or handed off successfully.` | 发布完成 | `Pending`、`RetryPending` | 不适用 |
| `RetryPending` | `Publication failed and is scheduled for retry.` | 等待重试 | `Pending` | `Published`、`Failed` |
| `Failed` | `Publication failed permanently and requires operations handling.` | 永久失败 | `RetryPending`、`Pending` | 不适用 |
| `Suppressed` | `Publication was suppressed by visibility or boundary rules.` | 不发布但留证 | `Pending` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `outbox_record_id` | `ConversationOutboxRecordId` | 标识 outbox 记录 | 系统生成 |
| `outbox_sequence` | `ConversationOutboxSequence` | 支撑 change cursor 的单调位置 | 系统生成且只能前进 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须对应已提交 truth |
| `truth_ref` | `ConversationTruthRef` | 指向已提交事实、scope change、显化、review anchor 或 handoff truth | 不得指向派生视图 |
| `event_kind` | `ConversationOutboxEventKind` | 传播事件类别 | 必须和 `truth_ref` 一致 |
| `payload_ref` | `ConversationOutboxPayloadRef` | 脱敏 payload 引用 | 不含 forbidden body |
| `fact_sequence` | `Option<ConversationFactSequence>` | change cursor 的 fact 位置 | fact append / retract / manifestation-derived fact 时取对应 fact sequence;非 fact 变化必须为 `None` |
| `fact_ref` | `Option<ConversationFactRef>` | change cursor 的 fact 引用 | fact append / retract / manifestation-derived fact 时取 `ConversationFactRef::from_fact(fact)`;非 fact 变化必须为 `None` |
| `manifestation_ref` | `Option<CrossDomainManifestationRef>` | change cursor 的 manifestation 引用 | manifestation 变化取 `CrossDomainManifestationRef::from_manifestation(manifestation)`;非 manifestation 变化必须为 `None` |
| `visibility_scope_id` | `VisibilityScopeId` | cursor 过滤与 lightweight change event 的可见范围 | 必须来自已提交 truth 或 scope snapshot;不得在 projection rebuild 时推导 |
| `committed_at` | `Timestamp` | truth 与 outbox 同事务提交时间 | application service 在写事务内用 `ClockPort.now()` 取得并传入 outbox 工厂;projection rebuild 不得重新生成 |
| `publication_state` | `ConversationOutboxPublicationState` | 发布状态 | 只能由 outbox worker / job 推进 |
| `retry_marker` | `Option<OutboxRetryMarker>` | 发布失败后的重试证据 | 成功或 suppressed 后必须为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_published(&mut self, published_ref: PublishedEventRef, published_at: Timestamp) -> Result<(), DomainError>` | 标记发布完成 | 发布引用和时间 | `Result<(), DomainError>` | 只能从 `Pending` / `RetryPending` 进入 |
| `mark_retry(&mut self, reason: RetryReason, next_retry_at: Timestamp) -> Result<(), DomainError>` | 标记重试 | 失败原因和下次时间 | `Result<(), DomainError>` | 不修改 truth |
| `mark_failed(&mut self, reason: OutboxFailureReason, actor: ActorRef) -> Result<(), DomainError>` | 标记失败 | 失败原因和操作人 | `Result<(), DomainError>` | 保留证据 |
| `can_publish(&self, visibility: &VisibilityScope) -> bool` | 判断是否可发布 | 可见范围 | `bool` | 不绕过 visibility |
| `retry_count(&self) -> RetryCount` | 返回已记录重试次数 | 无 | `RetryCount` | 只读 retry marker |
| `truth_kind(&self) -> ConversationTruthRefKind` | 返回 truth ref 类型 | 无 | `ConversationTruthRefKind` | 只读 |
| `assert_event_kind(&self, expected: ConversationOutboxEventKind) -> Result<(), DomainError>` | 校验 outbox event kind | expected event kind | `Result<(), DomainError>` | 错误时不发布 |
| `assert_truth_ref_kind(&self, expected: ConversationTruthRefKind) -> Result<(), DomainError>` | 校验 truth ref 类型 | expected truth kind | `Result<(), DomainError>` | 错误时不发布 |
| `assert_committed_truth_ref(&self) -> Result<(), DomainError>` | 校验 truth ref 指向已提交 truth | 无 | `Result<(), DomainError>` | 不接受派生视图 |
| `assert_outbox_sequence_present(&self) -> Result<(), DomainError>` | 校验 outbox sequence 可用于 cursor | 无 | `Result<(), DomainError>` | sequence 缺失时不发布 change available |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationOutboxRecord::from_fact_append(fact: ConversationFact, receipt: FactAppendReceipt, committed_at: Timestamp) -> Result<Self, DomainError>` | 从事实追加形成 outbox | fact、receipt、提交时间 | `Result<Self, DomainError>` | `AppendConversationFact` |
| `ConversationOutboxRecord::from_fact_retraction(fact: ConversationFact, receipt: FactAppendReceipt, committed_at: Timestamp) -> Result<Self, DomainError>` | 从事实撤回形成 outbox | fact、撤回回执、提交时间 | `Result<Self, DomainError>` | `RetractConversationFact` |
| `ConversationOutboxRecord::from_manifestation(manifestation: CrossDomainManifestation, manifested_fact: Option<ConversationFact>, committed_at: Timestamp) -> Result<Self, DomainError>` | 从显化形成 outbox | 显化记录、可选本仓 fact、提交时间 | `Result<Self, DomainError>` | `ManifestExternalFact` |
| `ConversationOutboxRecord::from_scope_change(change: ScopeChangeRecord, visibility_scope_id: VisibilityScopeId, committed_at: Timestamp) -> Result<Self, DomainError>` | 从 scope change 形成 outbox | 范围变化记录、该变化适用的 visibility scope、提交时间 | `Result<Self, DomainError>` | scope 更新 |
| `ConversationOutboxRecord::from_review_anchor(anchor: ReviewAnchor, visibility_scope_id: VisibilityScopeId, committed_at: Timestamp) -> Result<Self, DomainError>` | 从复盘锚点形成 change available outbox | 复盘锚点、可见范围、提交时间 | `Result<Self, DomainError>` | `CreateReviewAnchor` |
| `ConversationOutboxRecord::from_trace_handoff(handoff: TraceHandoffRecord, space_id: ConversationSpaceId, visibility_scope_id: VisibilityScopeId, committed_at: Timestamp) -> Result<Self, DomainError>` | 从 trace handoff intent 形成 outbox | trace handoff、space、可见范围、提交时间 | `Result<Self, DomainError>` | `RequestTraceHandoff` |
| `ConversationOutboxRecord::from_archive_handoff(handoff: ArchiveHandoffRecord, visibility_scope_id: VisibilityScopeId, committed_at: Timestamp) -> Result<Self, DomainError>` | 从 archive handoff intent 形成 outbox | archive handoff、可见范围、提交时间 | `Result<Self, DomainError>` | `RequestArchiveHandoff` |

不变量与禁止事项:

- outbox 不能决定 truth 是否成立。
- `ConversationOutboxRecord::from_fact_append(...)` 和 `from_fact_retraction(...)` 必须设置 `fact_sequence = Some(fact.append_sequence)`、`fact_ref = Some(ConversationFactRef::from_fact(&fact))`、`visibility_scope_id = fact.visibility_scope_id`、`manifestation_ref = None`、`committed_at = committed_at`。
- `ConversationOutboxRecord::from_manifestation(...)` 必须设置 `manifestation_ref = Some(CrossDomainManifestationRef::from_manifestation(&manifestation))`、`visibility_scope_id = manifestation.visibility_scope_id`、`committed_at = committed_at`;若 `manifested_fact = Some(fact)`,则同时设置 `fact_sequence` 和 `fact_ref`,否则二者为 `None`。
- `ConversationOutboxRecord::from_scope_change(...)` 必须按 `change.scope_kind` 映射 event kind:`ScopeKind::Space` -> `ConversationOutboxEventKind::SpaceChanged`;`ScopeKind::Participant` / `ScopeKind::Visibility` -> `ConversationOutboxEventKind::ScopeChanged`。scope change outbox 的 `fact_sequence`、`fact_ref`、`manifestation_ref` 必须为 `None`,`visibility_scope_id` 来自 application service 读取到的当前可见范围或该次 visibility scope change 的目标 scope。
- `ConversationOutboxRecord::from_review_anchor(...)`、`from_trace_handoff(...)` 和 `from_archive_handoff(...)` 的 `fact_sequence`、`fact_ref`、`manifestation_ref` 默认必须为 `None`,除非对应 truth object 明确携带 fact / manifestation target ref;P0 不从 review target、trace body 或 archive scope 反查 fact。
- outbox payload 不能包含外部正文。
- 发布失败不得回滚核心 truth。
- `committed_at` 只在 command / consumer / job 写路径创建 outbox 时由 `ClockPort.now()` 确定并随 outbox 持久化。`ChangeCursorProjection::from_change_log(...)`、`ConversationChangeCursorEntry::from_outbox(...)`、query service 和 repository list 方法不得重新取时间。

### 7.4 `domain/space.rs` 与 `domain/scope.rs` 对象实现契约

#### 7.4.1 `ConversationSpace`

```rust
/// Owns the local conversation space identity, lifecycle, owner reference, and default visibility boundary.
pub struct ConversationSpace {
    /// Stable conversation space id.
    pub space_id: ConversationSpaceId,
    /// Space category such as project, personal, system, or manifestation space.
    pub space_kind: ConversationSpaceKind,
    /// External owner reference for the space.
    pub owner_ref: ConversationOwnerRef,
    /// Lifecycle state for append, read, close, and archive behavior.
    pub lifecycle_state: ConversationSpaceLifecycleState,
    /// Default visibility scope for newly appended facts.
    pub default_visibility_scope_id: VisibilityScopeId,
    /// Actor that created the space.
    pub created_by: ActorRef,
}
```

```rust
/// Describes lifecycle state for a conversation space.
pub enum ConversationSpaceLifecycleState {
    /// The space accepts facts and authorized reads.
    Active,
    /// The space rejects new facts but allows reads and trace.
    ReadOnly,
    /// The space is closed and only supports controlled trace and handoff.
    Closed,
    /// The space has been handed off to archive and keeps only required refs.
    Archived,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `The space accepts facts and authorized reads.` | 正常可写可读 | 创建 space | `ReadOnly`、`Closed`、`Archived` |
| `ReadOnly` | `The space rejects new facts but allows reads and trace.` | 停写可读 | `Active` | `Closed`、`Archived` |
| `Closed` | `The space is closed and only supports controlled trace and handoff.` | 关闭 | `Active`、`ReadOnly` | `Archived` |
| `Archived` | `The space has been handed off to archive and keeps only required refs.` | 已归档 | `Active`、`ReadOnly`、`Closed` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `space_id` | `ConversationSpaceId` | 标识对话空间 | 系统生成 |
| `space_kind` | `ConversationSpaceKind` | 区分项目、个人、系统或显化空间 | 不表达 UI 类型 |
| `owner_ref` | `ConversationOwnerRef` | 指向 workspace / project / work item / system owner | 不拥有 owner 生命周期 |
| `lifecycle_state` | `ConversationSpaceLifecycleState` | 空间生命周期 | 终态不可反向打开 |
| `default_visibility_scope_id` | `VisibilityScopeId` | 默认可见范围 | 必须指向有效 visibility scope |
| `created_by` | `ActorRef` | 创建 actor | 只引用 actor,不保存 identity truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_accept_fact(&self, actor: ActorRef, participant_scope: &ParticipantScope) -> bool` | 判断 actor 是否可在空间追加事实 | actor 与参与范围 | `bool` | 不做全局授权 |
| `close(&mut self, actor: ActorRef, reason: SpaceCloseReason) -> Result<ScopeChangeRecord, DomainError>` | 关闭空间 | actor 和关闭原因 | `Result<ScopeChangeRecord, DomainError>` | 产生 scope change |
| `archive(&mut self, actor: ActorRef, archive_intent_ref: ArchiveIntentRef) -> Result<(), DomainError>` | 标记归档承接 | actor 和归档意图 | `Result<(), DomainError>` | 不生成 archive 包 |
| `assert_owner_matches(&self, owner_ref: ConversationOwnerRef) -> Result<(), DomainError>` | 校验 owner 一致 | owner 引用 | `Result<(), DomainError>` | 不解析 owner |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationSpace::create_project_space(owner_ref: ConversationOwnerRef, actor: ActorRef) -> Result<Self, DomainError>` | 创建项目空间 | owner 与 actor | `Result<Self, DomainError>` | 项目视野对话 |
| `ConversationSpace::create_personal_space(owner_ref: ConversationOwnerRef, actor: ActorRef) -> Result<Self, DomainError>` | 创建个人空间 | owner 与 actor | `Result<Self, DomainError>` | 个人视野对话 |
| `ConversationSpace::create_system_space(owner_ref: ConversationOwnerRef, system_actor: SystemActorRef) -> Result<Self, DomainError>` | 创建系统空间 | owner 与系统 actor | `Result<Self, DomainError>` | 系统触发对话 |

不变量与禁止事项:

- 不拥有 project / workspace 生命周期。
- 不保存 Chat UI 状态。
- 空间存在不等于任意 actor 可读可写。

#### 7.4.2 `ParticipantScope`

```rust
/// Describes which actors participate in a conversation space and what participation capability they have.
pub struct ParticipantScope {
    /// Stable participant scope id.
    pub participant_scope_id: ParticipantScopeId,
    /// Space that owns this participant scope.
    pub space_id: ConversationSpaceId,
    /// Participants and their conversation-local roles.
    pub participants: Vec<ConversationParticipantRef>,
    /// Version used for optimistic concurrency and trace.
    pub scope_version: ScopeVersion,
    /// Lifecycle state of this participant scope.
    pub scope_state: ParticipantScopeState,
}
```

```rust
/// Describes participant scope usability.
pub enum ParticipantScopeState {
    /// The scope can be used for append and read checks.
    Active,
    /// The scope requires additional policy checks before use.
    Restricted,
    /// The scope is closed and only available for trace.
    Closed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `The scope can be used for append and read checks.` | 参与范围有效 | 创建 scope | `Restricted`、`Closed` |
| `Restricted` | `The scope requires additional policy checks before use.` | 参与范围受限 | `Active` | `Active`、`Closed` |
| `Closed` | `The scope is closed and only available for trace.` | 历史追溯 | `Active`、`Restricted` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `participant_scope_id` | `ParticipantScopeId` | 标识参与范围 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 `ConversationSpace` |
| `participants` | `Vec<ConversationParticipantRef>` | 参与者引用和角色 | 不保存 identity member truth |
| `scope_version` | `ScopeVersion` | 并发版本 | 更新必须递增 |
| `scope_state` | `ParticipantScopeState` | 范围状态 | `Closed` 不可恢复为 `Active` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `contains_actor(&self, actor: ActorRef) -> bool` | 判断 actor 是否在参与范围 | actor 引用 | `bool` | 不做认证 |
| `add_participant(&mut self, participant: ConversationParticipantRef, actor: ActorRef) -> Result<ScopeChangeRecord, DomainError>` | 增加参与者 | participant 与操作 actor | `Result<ScopeChangeRecord, DomainError>` | 更新版本并产生 history |
| `remove_participant(&mut self, participant: ConversationParticipantRef, actor: ActorRef) -> Result<ScopeChangeRecord, DomainError>` | 移除参与者 | participant 与操作 actor | `Result<ScopeChangeRecord, DomainError>` | 不删除 history |
| `apply_participant_update(&mut self, add_participants: Vec<ConversationParticipantRef>, remove_participants: Vec<ConversationParticipantRef>, actor: ActorRef, reason: ScopeChangeReason) -> Result<ScopeChangeRecord, DomainError>` | 应用一次参与范围命令 | add/remove 列表、actor 和变更原因 | `Result<ScopeChangeRecord, DomainError>` | 保留当前 DTO 批量口径;一次命令只能产生一个 `ScopeChangeRecord`,scope version 只递增一次;add/remove 总量不能为空,同一 actor 不得同时 add 和 remove |
| `participant_role(&self, actor: ActorRef) -> Option<ConversationParticipantRole>` | 读取参与角色 | actor 引用 | `Option<ConversationParticipantRole>` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ParticipantScope::from_initial_participants(space_id: ConversationSpaceId, participants: Vec<ConversationParticipantRef>) -> Result<Self, DomainError>` | 创建初始参与范围 | space 与参与者 | `Result<Self, DomainError>` | 创建 space |
| `ParticipantScope::restricted_from_scope(scope: ParticipantScope, reason: RestrictionReason) -> Result<Self, DomainError>` | 派生受限范围 | 既有范围与原因 | `Result<Self, DomainError>` | 可见性 / 治理异常 |

不变量与禁止事项:

- 不创建或退休 Identity member。
- 不替代全局授权系统。
- 不复制外部群组成员列表为永久 truth。

#### 7.4.3 `VisibilityScope`

```rust
/// Defines which consumers can see facts, manifestations, and read outputs in a conversation space.
pub struct VisibilityScope {
    /// Stable visibility scope id.
    pub visibility_scope_id: VisibilityScopeId,
    /// Space that owns this visibility scope.
    pub space_id: ConversationSpaceId,
    /// Visibility rules for facts, manifestations, and read outputs.
    pub visibility_rules: VisibilityRuleSet,
    /// Default visibility level for new records.
    pub default_visibility: VisibilityLevel,
    /// Version used for optimistic concurrency and trace.
    pub scope_version: ScopeVersion,
    /// Lifecycle state of this visibility scope.
    pub scope_state: VisibilityScopeState,
}
```

```rust
/// Describes visibility scope usability.
pub enum VisibilityScopeState {
    /// Default rules can authorize reads and append outputs.
    Open,
    /// Extra policy checks are required for reads and manifestation.
    Restricted,
    /// The scope is sealed and no longer allows visibility expansion.
    Sealed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | `Default rules can authorize reads and append outputs.` | 正常可见性规则 | 创建 scope | `Restricted`、`Sealed` |
| `Restricted` | `Extra policy checks are required for reads and manifestation.` | 受限可见性 | `Open` | `Open`、`Sealed` |
| `Sealed` | `The scope is sealed and no longer allows visibility expansion.` | 封存可见性 | `Open`、`Restricted` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `visibility_scope_id` | `VisibilityScopeId` | 标识可见范围 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 space |
| `visibility_rules` | `VisibilityRuleSet` from `conversation-contracts/src/visibility.rs` | 可见性规则 | 不保存外部正文;domain 只消费该 contracts DTO |
| `default_visibility` | `VisibilityLevel` | 默认可见级别 | 不得绕过 participant scope |
| `scope_version` | `ScopeVersion` | 并发版本 | 更新必须递增 |
| `scope_state` | `VisibilityScopeState` | 可见范围状态 | `Sealed` 后不能扩张 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_read(&self, consumer: ConsumerRef, fact: &ConversationFact) -> bool` | 判断 consumer 是否可读事实 | consumer 和 fact | `bool` | 不修改 scope |
| `can_manifest(&self, actor: ActorRef, external_fact_ref: &ExternalFactRef) -> bool` | 判断 actor 是否可显化外部事实 | actor 和外部引用 | `bool` | 不解析来源 |
| `narrow_to(&mut self, rules: VisibilityRuleSet, actor: ActorRef) -> Result<ScopeChangeRecord, DomainError>` | 收窄可见范围 | contracts 纯数据规则和操作 actor | `Result<ScopeChangeRecord, DomainError>` | 只能收窄,不能越权扩张 |
| `includes_scope(&self, scope_id: VisibilityScopeId) -> bool` | 判断是否包含下级范围 | scope id | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `VisibilityScope::from_participant_scope(scope: &ParticipantScope, default_visibility: VisibilityLevel) -> Result<Self, DomainError>` | 从参与范围创建默认可见范围 | participant scope 和默认级别 | `Result<Self, DomainError>` | 创建 space |
| `VisibilityScope::restricted(space_id: ConversationSpaceId, reason: VisibilityRestrictionReason) -> Result<Self, DomainError>` | 创建受限可见范围 | space 与原因 | `Result<Self, DomainError>` | 异常 / 安全约束 |

不变量与禁止事项:

- 不替代认证或全局授权。
- 不保存外部正文。
- read model 不能绕过本对象或 `VisibilityPolicy`。

#### 7.4.4 `VisibilityPolicy`

```rust
/// Applies visibility checks for append, read, manifestation, review, and derived outputs.
pub struct VisibilityPolicy {
    /// Rules used by read and subscription outputs.
    pub read_rules: VisibilityReadRuleSet,
    /// Rules used when facts are appended.
    pub append_rules: VisibilityAppendRuleSet,
    /// Rules used when external facts are manifested.
    pub manifestation_rules: VisibilityManifestationRuleSet,
    /// Rules used by review and trace reads.
    pub review_rules: VisibilityReviewRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `read_rules` | `VisibilityReadRuleSet` | 授权读取规则 | 必须用于所有 read model 输出 |
| `append_rules` | `VisibilityAppendRuleSet` | 追加事实时的可见性规则 | 不得绕过 participant scope |
| `manifestation_rules` | `VisibilityManifestationRuleSet` | 显化后的可见性规则 | 必须与 `VisibilityScope` 一致 |
| `review_rules` | `VisibilityReviewRuleSet` | 复盘 / 追溯读取规则 | 不得扩大可见范围 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_can_append(&self, actor: ActorRef, fact: &ConversationFact, visibility: &VisibilityScope) -> Result<(), DomainError>` | 校验追加可见性 | actor、fact、scope | `Result<(), DomainError>` | 不写 fact |
| `assert_can_read(&self, consumer: ConsumerRef, fact: &ConversationFact, visibility: &VisibilityScope) -> Result<(), DomainError>` | 校验读取可见性 | consumer、fact、scope | `Result<(), DomainError>` | 不泄漏不可见事实 |
| `filter_read_model(&self, read_model: ConversationReadModel, consumer: ConsumerRef) -> Result<ConversationReadModel, DomainError>` | 裁剪读取视图 | read model 和 consumer | `Result<ConversationReadModel, DomainError>` | 输出已授权视图 |
| `assert_review_allowed(&self, anchor: &ReviewAnchor, actor: ActorRef) -> Result<(), DomainError>` | 校验复盘可见性 | anchor 与 actor | `Result<(), DomainError>` | 不替代治理裁决 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `VisibilityPolicy::default_policy() -> Self` | 构造默认策略 | 无 | `Self` | runtime builder |
| `VisibilityPolicy::from_scope_rules(rules: VisibilityRuleSet) -> Self` | 从 scope 规则构造策略 | contracts 纯数据可见规则 | `Self` | scope 更新后 |

不变量与禁止事项:

- 不替代 identity / governance 最终裁决。
- 不保存完整 participant 快照。
- 不让下游 UI 自行重建可见性。

#### 7.4.5 `ScopeChangeRecord`

```rust
/// Records an applied, superseded, or rejected change to space, participant scope, or visibility scope.
pub struct ScopeChangeRecord {
    /// Stable scope change id.
    pub scope_change_id: ScopeChangeRecordId,
    /// Space affected by the change.
    pub space_id: ConversationSpaceId,
    /// Scope kind affected by the change.
    pub scope_kind: ScopeKind,
    /// Snapshot before the change.
    pub previous_scope_ref: ScopeSnapshotRef,
    /// Snapshot after the change.
    pub new_scope_ref: ScopeSnapshotRef,
    /// Actor that requested or applied the change.
    pub changed_by: ActorRef,
    /// Reason for the change.
    pub change_reason: ScopeChangeReason,
    /// Lifecycle state for this history record.
    pub change_state: ScopeChangeState,
}
```

```rust
/// Describes whether a scope change was applied, superseded, or rejected.
pub enum ScopeChangeState {
    /// The scope change was applied to truth.
    Applied,
    /// The scope change was superseded by a later scope change.
    Superseded,
    /// The scope change was rejected and only kept as audit evidence.
    Rejected,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Applied` | `The scope change was applied to truth.` | 已生效 | 创建 record | `Superseded` |
| `Superseded` | `The scope change was superseded by a later scope change.` | 被覆盖 | `Applied` | 不适用 |
| `Rejected` | `The scope change was rejected and only kept as audit evidence.` | 已拒绝 | 创建 record | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `scope_change_id` | `ScopeChangeRecordId` | 标识变化记录 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配变化对象 |
| `scope_kind` | `ScopeKind` | space / participant / visibility | 不得混用 |
| `previous_scope_ref` | `ScopeSnapshotRef` | 变化前快照引用 | 不保存完整正文 |
| `new_scope_ref` | `ScopeSnapshotRef` | 变化后快照引用 | 不保存完整正文 |
| `changed_by` | `ActorRef` | 操作 actor | 只保存引用 |
| `change_reason` | `ScopeChangeReason` | 变化原因 | 可审计 |
| `change_state` | `ScopeChangeState` | record 状态 | 只能追加或 supersede |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `relates_to_space(&self, space_id: ConversationSpaceId) -> bool` | 判断是否属于指定空间 | space id | `bool` | 只读 |
| `mark_superseded(&mut self, successor_id: ScopeChangeRecordId) -> Result<(), DomainError>` | 标记被后续变化覆盖 | successor id | `Result<(), DomainError>` | 只能从 `Applied` 进入 |
| `visible_to(&self, visibility: &VisibilityScope, consumer: ConsumerRef) -> bool` | 判断记录是否可读 | visibility 与 consumer | `bool` | 不泄漏历史 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ScopeChangeRecord::from_space_change(previous: ConversationSpace, new: ConversationSpace, actor: ActorRef) -> Result<Self, DomainError>` | 从空间变化创建记录 | 旧 / 新 space 和 actor | `Result<Self, DomainError>` | close / archive |
| `ScopeChangeRecord::from_initial_space_creation(space: &ConversationSpace, actor: ActorRef, reason: ScopeChangeReason) -> Result<Self, DomainError>` | 从创建 space 形成初始变化记录 | 新 space、actor 和原因 | `Result<Self, DomainError>` | create space |
| `ScopeChangeRecord::from_participant_scope_change(previous: ParticipantScope, new: ParticipantScope, actor: ActorRef) -> Result<Self, DomainError>` | 从参与范围变化创建记录 | 旧 / 新 scope 和 actor | `Result<Self, DomainError>` | participant update |
| `ScopeChangeRecord::from_visibility_scope_change(previous: VisibilityScope, new: VisibilityScope, actor: ActorRef) -> Result<Self, DomainError>` | 从可见范围变化创建记录 | 旧 / 新 scope 和 actor | `Result<Self, DomainError>` | visibility update |

不变量与禁止事项:

- 不能用 history record 替代当前 scope truth。
- 初始创建记录必须由 `ScopeChangeRecord::from_initial_space_creation(...)` 生成,`change_reason.reason_kind = ScopeChangeReasonKind::InitialCreate`,且 `change_reason.reason_ref` 来自 `CreateConversationSpaceRequest.reason_ref`。
- 不能保存完整外部成员正文。
- 下游不能修改 history。

### 7.5 `domain/fact.rs` 对象实现契约

#### 7.5.0 fact 共享值对象

本节定义 `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt` 共同依赖的值对象。实现侧必须直接按本节 schema 落 `crates/contracts/src/refs.rs`、`crates/contracts/src/commands.rs` 和 `crates/domain/src/fact.rs`;不得用裸字符串或自行推导 enum 替代。

```rust
/// Classifies an accepted conversation fact. This is not a UI message type.
pub enum ConversationFactKind {
    /// Human actor authored result fact.
    Human,
    /// AI member authored result fact.
    AiMember,
    /// System generated result fact.
    System,
    /// Runtime committed result fact, without reasoning body.
    RuntimeResult,
    /// Cross-domain manifestation exposed as conversation fact.
    Manifestation,
    /// Bridge mapped external fact, without external platform body.
    BridgeMapped,
}
```

| 变体 | 作用 | 禁止混同 |
|---|---|---|
| `Human` | 人类 actor 追加的结果性事实 | UI message type、read state |
| `AiMember` | AI member 追加的结果性事实 | runtime reasoning process |
| `System` | 系统 actor 追加的结果性事实 | system log body |
| `RuntimeResult` | runtime 已提交结果引用形成的事实 | chain-of-thought / tool trace |
| `Manifestation` | 外部事实显化到 conversation | external fact body |
| `BridgeMapped` | bridge 映射后的外部事实 | 外部平台 message body |

```rust
/// Classifies traceable source family for a conversation fact.
pub enum FactSourceKind {
    /// Fact came from a human or AI actor command.
    Actor,
    /// Fact came from a committed runtime result reference.
    RuntimeResult,
    /// Fact came from a bridge mapped external event or message reference.
    BridgeMapped,
    /// Fact came from a system event.
    System,
    /// Fact came from a generic inbound source event.
    SourceEvent,
}
```

| 变体 | 必须携带的 `FactSourceRef` 字段 | 禁止事项 |
|---|---|---|
| `Actor` | `actor_ref` | 不得要求 runtime / bridge ref |
| `RuntimeResult` | `actor_ref`、`runtime_result_ref` | 不得保存 reasoning body |
| `BridgeMapped` | `actor_ref`、`bridge_source_ref` | 不得保存平台原文 |
| `System` | `actor_ref`、`source_event_ref` | 不得混同 identity member truth |
| `SourceEvent` | `actor_ref`、`source_event_ref` | 不得补造 source event |

```rust
/// Stable reference to a committed runtime result, excluding reasoning body.
pub struct RuntimeResultRef {
    /// Runtime result object ref.
    pub result_ref: ExternalSourceObjectRef,
    /// Optional runtime run or execution ref.
    pub run_ref: Option<ExternalSourceObjectRef>,
    /// Optional source version ref.
    pub source_version_ref: Option<ExternalSourceVersionRef>,
}

/// Stable bridge source reference, excluding external platform message body.
pub struct BridgeSourceRef {
    /// External bridge fact or message mapping ref.
    pub bridge_fact_ref: ExternalSourceObjectRef,
    /// Optional bridge channel / tenant / integration ref.
    pub bridge_context_ref: Option<ExternalSourceObjectRef>,
    /// Optional source version ref.
    pub source_version_ref: Option<ExternalSourceVersionRef>,
    /// Optional digest provided by bridge adapter.
    pub source_digest: Option<ExternalSourceDigest>,
}

/// Stable inbound source event reference.
pub struct SourceEventRef {
    /// Source event id.
    pub event_id: EventId,
    /// Envelope ref for replay / audit.
    pub event_envelope_ref: EventEnvelopeRef,
    /// Logical event source ref.
    pub event_source_ref: EventSourceRef,
}
```

| 类型 | 字段闭环 | 禁止事项 |
|---|---|---|
| `RuntimeResultRef` | `result_ref` 必填;`run_ref`、`source_version_ref` 可选 | 不得保存 runtime prompt、reasoning、tool call body |
| `BridgeSourceRef` | `bridge_fact_ref` 必填;context、version、digest 可选 | 不得保存外部平台正文 |
| `SourceEventRef` | event id、envelope ref、source ref 全部必填 | 不得用 trace id 代替 event id |

```rust
/// Stable id for a conversation fact payload reference.
pub struct ConversationFactPayloadRefId(pub String);

/// Digest value encoded by PayloadDigestAlgorithm.
pub struct PayloadDigestValue(pub String);

/// Reference to allowed payload material. This never contains payload body.
pub struct ConversationFactPayloadRef {
    /// Stable payload reference id.
    pub payload_ref_id: ConversationFactPayloadRefId,
    /// Payload source category.
    pub payload_kind: ConversationFactPayloadKind,
    /// External or local object reference that owns the payload body.
    pub object_ref: ExternalSourceObjectRef,
    /// Whether any append input carrying this payload_ref must supply payload_digest.
    pub digest_requirement: PayloadDigestRequirement,
}

/// Classifies payload reference kind.
pub enum ConversationFactPayloadKind {
    /// Result summary already safe for conversation storage.
    ResultSummary,
    /// Runtime result payload reference.
    RuntimeResultPayload,
    /// Bridge mapped payload reference.
    BridgeMappedPayload,
    /// External fact snapshot payload reference.
    ManifestationSnapshot,
    /// System fact payload reference.
    SystemFact,
}

/// Digest requirement for payload refs.
pub enum PayloadDigestRequirement {
    /// Request must carry PayloadDigest.
    Required,
    /// Request may carry PayloadDigest.
    Optional,
    /// Request must not carry digest because payload is local and immutable by construction.
    Forbidden,
}

/// Digest evidence supplied by caller or adapter for payload refs.
pub struct PayloadDigest {
    /// Digest algorithm.
    pub algorithm: PayloadDigestAlgorithm,
    /// Digest value encoded by the selected algorithm.
    pub value: PayloadDigestValue,
}

/// Supported payload digest algorithms for P0.
pub enum PayloadDigestAlgorithm {
    /// SHA-256 digest.
    Sha256,
}
```

| `ConversationFactPayloadKind` | 默认 `digest_requirement` | 说明 |
|---|---|---|
| `ResultSummary` | `Optional` | 已由可信 command boundary 形成的结果摘要引用 |
| `RuntimeResultPayload` | `Required` | runtime 结果载体必须有 digest 证据 |
| `BridgeMappedPayload` | `Required` | bridge 映射载体必须有 digest 证据 |
| `ManifestationSnapshot` | `Required` | 外部事实快照必须有 digest 证据 |
| `SystemFact` | `Optional` | 系统事实引用可按来源配置要求 digest |

fact append 输入的 `payload_digest` 校验口径:

- `AppendConversationFactRequest.payload_digest`、`RuntimeResultCommittedEvent.payload_digest` 和 `BridgeMappedFactReceivedEvent.payload_digest` 都属于同一 payload digest 证据输入。
- 当 `payload_ref.digest_requirement = Required` 时,`payload_digest` 必须存在,否则返回 `FactAppendRejectionReason::MissingRequiredPayloadDigest`;inbound event consumer 将该错误映射为 invalid inbound envelope quarantine。
- 当 `payload_digest` 存在但与 `payload_ref.object_ref` 对应载体 digest 不匹配时,返回 `FactAppendRejectionReason::PayloadDigestMismatch`;inbound event consumer 将该错误映射为 digest mismatch quarantine。
- 当 `payload_ref.digest_requirement = Forbidden` 但 append 输入携带 digest 时,返回 `FactAppendRejectionReason::UnexpectedPayloadDigest`。
- 无论是否携带 digest,`payload_ref` 都不得包含 payload body、runtime reasoning body 或 bridge platform body。

```rust
/// Reason used when retracting an accepted conversation fact.
pub struct FactRetractionReason {
    /// Retraction category.
    pub reason_kind: FactRetractionReasonKind,
    /// External or command reason ref.
    pub reason_ref: CommandReasonRef,
}

/// Retraction categories.
pub enum FactRetractionReasonKind {
    /// Actor explicitly requested retraction.
    ActorRequested,
    /// Source was invalidated or superseded.
    SourceInvalidated,
    /// Visibility or safety boundary was violated.
    BoundaryViolation,
    /// Fact was replaced by a newer fact.
    Superseded,
    /// Operator correction.
    OperatorCorrection,
}

/// Rejection reason for append receipt.
pub enum FactAppendRejectionReason {
    /// CommandMetadata.request.idempotency_key was missing.
    MissingIdempotencyKey,
    /// Idempotency key matched a different request digest or source.
    IdempotencyConflict,
    /// Conversation space is missing, closed, archived, or unavailable.
    SpaceUnavailable,
    /// Fact kind is not allowed by FactKindRuleSet.
    FactKindNotAllowed,
    /// Fact source is missing or not traceable.
    SourceNotTraceable,
    /// Source attempts to carry forbidden body.
    ForbiddenSourceBody,
    /// Payload ref is missing.
    MissingPayloadRef,
    /// Payload ref requires digest but request did not provide it.
    MissingRequiredPayloadDigest,
    /// Payload digest is present but mismatches source payload.
    PayloadDigestMismatch,
    /// Payload digest was provided where forbidden.
    UnexpectedPayloadDigest,
    /// Payload ref attempts to carry forbidden body.
    ForbiddenPayloadBody,
    /// Visibility scope is missing, sealed, or incompatible with space.
    VisibilityScopeUnavailable,
    /// Participant scope does not allow append.
    ParticipantScopeRejected,
}
```

| 类型 | 字段 / 变体口径 | 使用位置 |
|---|---|---|
| `FactRetractionReason` | struct,包含 `reason_kind` 和 `reason_ref` | `RetractConversationFactRequest`、`ConversationFact::retract(...)` |
| `FactAppendRejectionReason` | enum,只表达拒绝分类,不保存输入正文 | `FactAppendReceipt::rejected(...)`、TC-CONV-FACT-* |

```rust
/// Allowed fact kinds for append policy.
pub struct FactKindRuleSet {
    /// Allowed fact kind list.
    pub allowed_kinds: Vec<ConversationFactKind>,
    /// Whether UI-only message categories are rejected.
    pub reject_ui_only_kinds: bool,
}

/// Source validation rules for append policy.
pub struct FactSourceRuleSet {
    /// Allowed source families.
    pub allowed_source_kinds: Vec<FactSourceKind>,
    /// Source must be result-only and traceable.
    pub require_result_only: bool,
    /// Source cannot include more than one concrete source ref.
    pub reject_mixed_concrete_sources: bool,
}

/// Scope validation rules for append policy.
pub struct FactScopeRuleSet {
    /// Space must be active and appendable.
    pub require_active_space: bool,
    /// Participant scope must permit append.
    pub require_participant_scope_appendable: bool,
    /// Visibility scope must be open or compatible with append.
    pub require_visibility_scope_open: bool,
    /// Service may derive default visibility when request omits visibility_scope_id.
    pub allow_default_visibility: bool,
}

/// Idempotency matching rules for append policy.
pub struct FactAppendIdempotencyRuleSet {
    /// Idempotency key is required for append.
    pub require_idempotency_key: bool,
    /// Fields that must match for duplicate.
    pub duplicate_match_fields: Vec<FactAppendDuplicateField>,
    /// Rejection reason used when duplicate fields do not match.
    pub conflict_reason: FactAppendRejectionReason,
}

/// Field participating in duplicate matching.
pub enum FactAppendDuplicateField {
    /// The space id must match.
    SpaceId,
    /// The fact source ref must match.
    SourceRef,
    /// The payload ref must match.
    PayloadRef,
    /// The payload digest must match when present or required.
    PayloadDigest,
    /// The visibility scope must match when explicitly supplied.
    VisibilityScopeId,
}

/// Policy-level decision for idempotency duplicate handling.
pub enum FactAppendDuplicateDecision {
    /// No existing matching append result is known.
    TreatAsNew,
    /// Return existing receipt / fact result from repository.
    ReturnExistingResult,
    /// Reject as idempotency conflict.
    RejectConflict { reason: FactAppendRejectionReason },
}
```

| 类型 | 最小字段 / 变体 | 实现口径 |
|---|---|---|
| `FactKindRuleSet` | `allowed_kinds`、`reject_ui_only_kinds` | `ConversationFactKind` 不允许 UI-only 类型 |
| `FactSourceRuleSet` | `allowed_source_kinds`、`require_result_only`、`reject_mixed_concrete_sources` | source 必须可追溯且只携带一种具体来源 |
| `FactScopeRuleSet` | active space、participant append、visibility open、default visibility 开关 | scope 规则只判断,不创建 space / scope |
| `FactAppendIdempotencyRuleSet` | key 必填、duplicate 匹配字段、冲突 reason | duplicate 和 conflict 必须区分 |
| `FactAppendDuplicateDecision` | `TreatAsNew` / `ReturnExistingResult` / `RejectConflict` | service 负责用 repository existing record 计算具体 existing receipt |

#### 7.5.1 `ConversationFact`

```rust
/// Represents a committed result-only fact appended to a conversation space.
pub struct ConversationFact {
    /// Stable fact id.
    pub fact_id: ConversationFactId,
    /// Space that owns this fact.
    pub space_id: ConversationSpaceId,
    /// Fact category.
    pub fact_kind: ConversationFactKind,
    /// Traceable source reference.
    pub source_ref: FactSourceRef,
    /// Visibility scope used for reads.
    pub visibility_scope_id: VisibilityScopeId,
    /// Reference to allowed content or payload material.
    pub payload_ref: ConversationFactPayloadRef,
    /// Append sequence within the space.
    pub append_sequence: ConversationFactSequence,
    /// Current fact state.
    pub fact_state: ConversationFactState,
}
```

`ConversationFactState` 的正式 enum 定义归属 `contracts/refs.rs`,见 §7.2.2。`domain/fact.rs` 中的 `ConversationFact` 直接引用该共享 enum;实现侧不得在 domain 复制第二套同名 enum。

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Accepted` | `The fact was accepted and can be read under visibility scope.` | 已正式追加 | 工厂创建 | `VisibilityRestricted`、`Retracted`、`Quarantined` |
| `VisibilityRestricted` | `The fact exists but requires stricter visibility filtering.` | 可见性受限 | `Accepted` | `Accepted`、`Retracted`、`Quarantined` |
| `Retracted` | `The fact was formally retracted but remains traceable.` | 已撤回 | `Accepted`、`VisibilityRestricted` | 不适用 |
| `Quarantined` | `The fact is isolated because source, safety, or boundary checks failed.` | 隔离 | `Accepted`、`VisibilityRestricted` | `Retracted` |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `fact_id` | `ConversationFactId` | 标识事实 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须指向已成立 space |
| `fact_kind` | `ConversationFactKind` | human / AI / system / manifestation / bridge 等 | 不等于 UI message type |
| `source_ref` | `FactSourceRef` | 来源引用 | 必须可追溯 |
| `visibility_scope_id` | `VisibilityScopeId` | 可见范围 | 输出必须经过裁剪 |
| `payload_ref` | `ConversationFactPayloadRef` | 允许内容或引用 | 不含 runtime 推理过程 / bridge 原文 |
| `append_sequence` | `ConversationFactSequence` | 空间内事实顺序 | 只追加递增 |
| `fact_state` | `ConversationFactState` | 事实状态 | 终态不可复活 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `attach_visibility(&mut self, visibility: &VisibilityScope) -> Result<(), DomainError>` | 绑定可见范围 | visibility scope | `Result<(), DomainError>` | 不扩大 scope |
| `restrict_visibility(&mut self, reason: VisibilityRestrictionReason, actor: ActorRef) -> Result<(), DomainError>` | 限制可见性 | 原因和 actor | `Result<(), DomainError>` | 不改 payload |
| `retract(&mut self, actor: ActorRef, reason: FactRetractionReason) -> Result<(), DomainError>` | 正式撤回事实 | actor 和原因 | `Result<(), DomainError>` | 保留追溯 |
| `is_visible_to(&self, consumer: ConsumerRef, policy: &VisibilityPolicy) -> bool` | 判断是否可读 | consumer 与 policy | `bool` | 不绕过 policy |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationFact::from_append_input(space: &ConversationSpace, fact_kind: ConversationFactKind, source: FactSourceRef, visibility: &VisibilityScope, payload_ref: ConversationFactPayloadRef) -> Result<Self, DomainError>` | 从追加输入形成事实 | space、fact kind、source、visibility、payload 引用 | `Result<Self, DomainError>` | `AppendConversationFact` / inbound fact append consumers |
| `ConversationFact::from_manifestation(manifestation: CrossDomainManifestation, visibility: &VisibilityScope) -> Result<Self, DomainError>` | 从显化形成对话事实 | manifestation 与 visibility | `Result<Self, DomainError>` | `ManifestExternalFact` |
| `ConversationFact::system_fact(space_id: ConversationSpaceId, system_actor: SystemActorRef, system_fact_ref: SystemFactRef) -> Result<Self, DomainError>` | 创建系统事实 | space、system actor、系统事实引用 | `Result<Self, DomainError>` | system event |

不变量与禁止事项:

- 不保存 runtime 推理过程。
- 不保存 bridge 外部消息正文。
- 不表达 UI 已读、折叠或草稿状态。

#### 7.5.2 `FactSourceRef`

```rust
/// Provides a traceable result-only source reference for an appended conversation fact.
pub struct FactSourceRef {
    /// Stable source reference id.
    pub source_ref_id: FactSourceRefId,
    /// Source family for the fact.
    pub source_kind: FactSourceKind,
    /// Actor that produced or represented the source.
    pub actor_ref: ActorRef,
    /// Optional runtime result reference without reasoning body.
    pub runtime_result_ref: Option<RuntimeResultRef>,
    /// Optional bridge source reference without platform message body.
    pub bridge_source_ref: Option<BridgeSourceRef>,
    /// Optional source event reference.
    pub source_event_ref: Option<SourceEventRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `source_ref_id` | `FactSourceRefId` | 标识来源引用 | 系统生成 |
| `source_kind` | `FactSourceKind` | 来源家族 | actor / runtime / bridge / system / source event |
| `actor_ref` | `ActorRef` | 产生或代表事实的 actor | 不拥有 member 生命周期 |
| `runtime_result_ref` | `Option<RuntimeResultRef>` | runtime 结果引用 | 不含 reasoning body |
| `bridge_source_ref` | `Option<BridgeSourceRef>` | bridge 映射来源 | 不含平台原文 |
| `source_event_ref` | `Option<SourceEventRef>` | 触发来源事件 | 只保存引用 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_result_only(&self) -> Result<(), DomainError>` | 校验只包含结果引用 | 无 | `Result<(), DomainError>` | 不读取正文 |
| `matches_actor(&self, actor: ActorRef) -> bool` | 判断 actor 是否匹配 | actor 引用 | `bool` | 只读 |
| `source_family(&self) -> FactSourceKind` | 返回来源家族 | 无 | `FactSourceKind` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `FactSourceRef::from_actor(actor: ActorRef) -> Self` | 从 actor 创建来源 | actor | `Self` | 人类 / AI member |
| `FactSourceRef::from_runtime_result(result_ref: RuntimeResultRef, actor: ActorRef) -> Result<Self, DomainError>` | 从 runtime 结果创建来源 | 结果引用和 actor | `Result<Self, DomainError>` | runtime 结果提交 |
| `FactSourceRef::from_bridge_mapping(source_ref: BridgeSourceRef, actor: ActorRef) -> Result<Self, DomainError>` | 从 bridge 映射创建来源 | bridge 来源和 actor | `Result<Self, DomainError>` | 外部平台映射 |
| `FactSourceRef::from_system(system_actor: SystemActorRef, source_event_ref: SourceEventRef) -> Result<Self, DomainError>` | 从系统事件创建来源 | 系统 actor 和事件引用 | `Result<Self, DomainError>` | 系统触发 |

不变量与禁止事项:

- 不能保存 chain-of-thought。
- 不能保存外部平台 message body。
- 不能混淆 actor ref 与 identity truth。

#### 7.5.3 `FactAppendPolicy`

```rust
/// Decides whether append input can become a committed conversation fact.
pub struct FactAppendPolicy {
    /// Allowed conversation fact kinds.
    pub allowed_fact_kinds: FactKindRuleSet,
    /// Source validation rules.
    pub source_rules: FactSourceRuleSet,
    /// Space and scope validation rules.
    pub scope_rules: FactScopeRuleSet,
    /// Idempotency behavior rules.
    pub idempotency_rules: FactAppendIdempotencyRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `allowed_fact_kinds` | `FactKindRuleSet` | 限定可追加事实类型 | 不含 UI-only 类型 |
| `source_rules` | `FactSourceRuleSet` | 校验来源引用 | 来源必须可追溯 |
| `scope_rules` | `FactScopeRuleSet` | 校验 space / scope | 必须已成立 |
| `idempotency_rules` | `FactAppendIdempotencyRuleSet` | 幂等与冲突规则 | duplicate 与 conflict 必须区分 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_append_allowed(&self, space: &ConversationSpace, participant: &ParticipantScope, visibility: &VisibilityScope) -> Result<(), DomainError>` | 校验空间和范围允许追加 | space、participant、visibility | `Result<(), DomainError>` | 不写事实 |
| `assert_source_allowed(&self, source: &FactSourceRef) -> Result<(), DomainError>` | 校验来源 | source ref | `Result<(), DomainError>` | 不解析外部正文 |
| `assert_fact_kind_allowed(&self, kind: ConversationFactKind) -> Result<(), DomainError>` | 校验事实类型 | kind | `Result<(), DomainError>` | 不修改输入 |
| `detect_duplicate(&self, key: IdempotencyKey, source: &FactSourceRef) -> FactAppendDuplicateDecision` | 判断幂等重复 | 幂等键和来源 | `FactAppendDuplicateDecision` | 不访问 repository |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `FactAppendPolicy::default_policy() -> Self` | 默认策略 | 无 | `Self` | runtime builder |
| `FactAppendPolicy::for_space(space: &ConversationSpace, visibility: &VisibilityScope) -> Self` | 为指定空间构造策略 | space 和 visibility | `Self` | append service |

不变量与禁止事项:

- policy 不写事实。
- 不接受不可追溯来源。
- projection / rebuild job 不能借此生成业务事实。

#### 7.5.4 `FactAppendReceipt`

```rust
/// Audits fact append result, idempotency hit, rejection reason, and trace references.
pub struct FactAppendReceipt {
    /// Stable append receipt id.
    pub append_receipt_id: FactAppendReceiptId,
    /// Space that received the append request.
    pub space_id: ConversationSpaceId,
    /// Accepted or duplicated fact id, if available.
    pub fact_id: Option<ConversationFactId>,
    /// Append result.
    pub append_result: FactAppendResult,
    /// Idempotency key used by the append request.
    pub idempotency_key: IdempotencyKey,
    /// Rejection reason when append is rejected.
    pub rejection_reason: Option<FactAppendRejectionReason>,
    /// Timestamp when this receipt was recorded.
    pub recorded_at: Timestamp,
}
```

```rust
/// Describes append outcome for a conversation fact request.
pub enum FactAppendResult {
    /// The fact was accepted and committed.
    Accepted,
    /// The request matched an already committed append result.
    Duplicate,
    /// The request was rejected by validation, policy, or idempotency conflict.
    Rejected,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Accepted` | `The fact was accepted and committed.` | 成功追加 | 工厂创建 | 不适用 |
| `Duplicate` | `The request matched an already committed append result.` | 幂等命中 | 工厂创建 | 不适用 |
| `Rejected` | `The request was rejected by validation, policy, or idempotency conflict.` | 拒绝 | 工厂创建 | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `append_receipt_id` | `FactAppendReceiptId` | 标识回执 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必填 |
| `fact_id` | `Option<ConversationFactId>` | 成功或 duplicate 对应事实 | rejected 时为空 |
| `append_result` | `FactAppendResult` | 追加结果 | 不可变 |
| `idempotency_key` | `IdempotencyKey` | 幂等键 | 必须保留 |
| `rejection_reason` | `Option<FactAppendRejectionReason>` | 拒绝原因 | accepted / duplicate 时为空 |
| `recorded_at` | `Timestamp` | 记录时间 | 系统生成 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_success(&self) -> bool` | 判断是否成功或 duplicate | 无 | `bool` | 只读 |
| `is_duplicate(&self) -> bool` | 判断是否 duplicate | 无 | `bool` | 只读 |
| `has_rejection_reason(&self, reason: FactAppendRejectionReason) -> bool` | 判断拒绝原因 | reason | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `FactAppendReceipt::accepted(fact: &ConversationFact, key: IdempotencyKey, recorded_at: Timestamp) -> Self` | 成功回执 | fact、key、时间 | `Self` | append 成功 |
| `FactAppendReceipt::duplicate(fact_id: ConversationFactId, key: IdempotencyKey, recorded_at: Timestamp) -> Self` | duplicate 回执 | fact id、key、时间 | `Self` | 幂等命中 |
| `FactAppendReceipt::rejected(space_id: ConversationSpaceId, key: IdempotencyKey, reason: FactAppendRejectionReason, recorded_at: Timestamp) -> Self` | 拒绝回执 | space、key、原因、时间 | `Self` | append 拒绝 |
| `FactAppendReceipt::retracted(fact: &ConversationFact, key: IdempotencyKey, recorded_at: Timestamp) -> Self` | 撤回回执 | fact、key、时间 | `Self` | retract 成功 |

不变量与禁止事项:

- receipt 不替代 fact truth。
- receipt 不保存拒绝输入正文。
- duplicate 不能掩盖 idempotency conflict。

### 7.6 `domain/projection.rs` 中 authorized consumption 对象实现契约

#### 7.6.1 `ConversationReadModel`

```rust
/// Represents an already-authorized read view for a conversation consumer.
pub struct ConversationReadModel {
    /// Stable read model id.
    pub read_model_id: ConversationReadModelId,
    /// Space represented by this read model.
    pub space_id: ConversationSpaceId,
    /// Consumer this view is built for.
    pub consumer_ref: ConsumerRef,
    /// Fact references visible to this consumer.
    pub visible_fact_refs: Vec<ConversationFactRef>,
    /// Manifestation references visible to this consumer.
    pub visible_manifestation_refs: Vec<CrossDomainManifestationRef>,
    /// Cursor reference for incremental read.
    pub cursor_ref: Option<ConversationChangeCursorRef>,
    /// Projection state for freshness and rebuild visibility.
    pub projection_state: ConversationProjectionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `read_model_id` | `ConversationReadModelId` | 标识读取视图 | 按 `space_id + consumer_ref` 稳定派生 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 facts / manifestations |
| `consumer_ref` | `ConsumerRef` | 读取方 | 已授权后写入 |
| `visible_fact_refs` | `Vec<ConversationFactRef>` | 可见事实引用 | 不含不可见事实 |
| `visible_manifestation_refs` | `Vec<CrossDomainManifestationRef>` | 可见显化引用 | 不含不可见显化 |
| `cursor_ref` | `Option<ConversationChangeCursorRef>` | 增量游标引用 | 可为空;存在时必须匹配同一 `space_id` / `consumer_ref` |
| `projection_state` | `ConversationProjectionState` | freshness / rebuild 状态 | stale 必须显式暴露 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `apply_visibility(self, policy: &VisibilityPolicy, consumer: ConsumerRef) -> Result<Self, DomainError>` | 裁剪读取视图 | policy 与 consumer | `Result<Self, DomainError>` | 输出已授权视图 |
| `mark_stale(&mut self, reason: ProjectionStaleReason) -> Result<(), DomainError>` | 标记过期 | stale reason | `Result<(), DomainError>` | 不改 truth |
| `attach_cursor(&mut self, cursor: ConversationChangeCursor) -> Result<(), DomainError>` | 关联游标 | cursor | `Result<(), DomainError>` | cursor 必须匹配 consumer |
| `contains_fact(&self, fact_id: ConversationFactId) -> bool` | 判断是否包含事实 | fact id | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationReadModel::from_visible_facts(space: &ConversationSpace, fact_refs: Vec<ConversationFactRef>, consumer: ConsumerRef) -> Result<Self, DomainError>` | 从授权事实创建读取视图 | space、fact refs、consumer | `Result<Self, DomainError>` | query path |
| `ConversationReadModel::empty_for_consumer(space_id: ConversationSpaceId, consumer: ConsumerRef) -> Self` | 创建空读取视图 | space 与 consumer | `Self` | 无可见事实 |

不变量与禁止事项:

- read model 是派生对象,不能反写真相。
- read model 必须完成可见性裁剪后才能输出。
- stale / failed 状态不得隐藏。
- `ConversationReadModel` 是 `domain/projection.rs` 内部派生对象。`contracts/views.rs::ConversationReadModelView` 只能由 query service / handler 在输出边界构造,不得替代本对象进入 `ProjectionRepository`、`VisibilityPolicy` 或 rebuild job。

#### 7.6.2 `ConversationChangeCursor`

```rust
/// Tracks incremental read or subscription position for an authorized consumer.
pub struct ConversationChangeCursor {
    /// Stable cursor id.
    pub cursor_id: ConversationChangeCursorId,
    /// Space read by this cursor.
    pub space_id: ConversationSpaceId,
    /// Consumer that owns this cursor.
    pub consumer_ref: ConsumerRef,
    /// Last consumed fact sequence.
    pub last_fact_sequence: ConversationFactSequence,
    /// Last consumed outbox or change sequence.
    pub last_outbox_sequence: ConversationOutboxSequence,
    /// Cursor lifecycle state.
    pub cursor_state: ConversationChangeCursorState,
}
```

```rust
/// Describes whether a change cursor can resume incremental reads.
pub enum ConversationChangeCursorState {
    /// The cursor can continue incremental reads.
    Active,
    /// The cursor is behind and requires refresh before use.
    Stale,
    /// The cursor is outside the retention window.
    Expired,
    /// The cursor cannot continue because scope or visibility changed.
    Invalidated,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Active` | `The cursor can continue incremental reads.` | 可续读 | 创建 cursor | `Stale`、`Expired`、`Invalidated` |
| `Stale` | `The cursor is behind and requires refresh before use.` | 过期但可恢复 | `Active` | `Active`、`Expired`、`Invalidated` |
| `Expired` | `The cursor is outside the retention window.` | 超出保留窗口 | `Active`、`Stale` | 不适用 |
| `Invalidated` | `The cursor cannot continue because scope or visibility changed.` | 范围变化失效 | `Active`、`Stale` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `cursor_id` | `ConversationChangeCursorId` | 标识游标 | 按 `space_id + consumer_ref` 稳定派生 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 read model |
| `consumer_ref` | `ConsumerRef` | 游标拥有者 | 不得跨 consumer 复用 |
| `last_fact_sequence` | `ConversationFactSequence` | 已消费事实位置 | 递增 |
| `last_outbox_sequence` | `ConversationOutboxSequence` | 已消费变化位置 | 递增 |
| `cursor_state` | `ConversationChangeCursorState` | 游标状态 | invalidated 不可恢复 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `advance(&mut self, fact_sequence: ConversationFactSequence, outbox_sequence: ConversationOutboxSequence) -> Result<(), DomainError>` | 推进游标 | fact / outbox sequence | `Result<(), DomainError>` | 只能递增 |
| `mark_stale(&mut self, reason: CursorStaleReason) -> Result<(), DomainError>` | 标记 stale | 原因 | `Result<(), DomainError>` | 不改 read model |
| `invalidate(&mut self, change: &ScopeChangeRecord) -> Result<(), DomainError>` | 因范围变化失效 | scope change | `Result<(), DomainError>` | 终止续读 |
| `can_resume(&self, visibility: &VisibilityScope, consumer: ConsumerRef) -> bool` | 判断能否续读 | visibility 与 consumer | `bool` | 必须重检可见性 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationChangeCursor::start_from(space_id: ConversationSpaceId, consumer: ConsumerRef, sequence: ConversationFactSequence) -> Self` | 从指定事实位置创建游标 | space、consumer、sequence | `Self` | 初始增量读;`cursor_id` 按 `space_id + consumer` 稳定派生 |
| `ConversationChangeCursor::from_read_model(read_model: &ConversationReadModel) -> Result<Self, DomainError>` | 从读取视图创建游标 | read model | `Result<Self, DomainError>` | query path |

不变量与禁止事项:

- 游标不表达事实顺序 truth。
- 游标续读必须重新校验可见性。
- 游标不绑定 SSE / WebSocket / AG-UI 等具体传输协议。

### 7.7 `domain/manifestation.rs` 对象实现契约

#### 7.7.0 manifestation / external reference 共享值对象

本节补齐 PH-05 `manifestation / external reference / resolver` boundary 直接落码所需的共享值对象。实现侧必须直接按本节 schema 落 `crates/contracts/src/refs.rs`、`crates/contracts/src/views.rs`、`crates/domain/src/manifestation.rs` 和 `crates/domain/src/reference.rs`;不得把下列类型实现为空 struct、裸字符串 alias 或自行推导 enum。

归属口径:

- `ExternalSourceSystem`、`ExternalFactKind`、`DisplaySummaryRef`、`ManifestationReason`、`ManifestationRevokeReason`、`ReferenceResolutionReason` 属于 `conversation-contracts/src/refs.rs` 或同层 shared value module。
- `ExternalFactResolution`、`DigestVerification` 属于 `conversation-contracts/src/refs.rs` 中的 resolver-facing safe DTO,由 `ExternalFactResolverPort` 返回,不得包含来源正文。
- `ExternalReferenceProjectionId`、`DegradedDisplayRefId`、`DisplayFragmentRefId`、`DegradedDisplayRef` 和 `DisplayFragmentRef` 属于 `conversation-contracts/src/refs.rs` 或 `conversation-contracts/src/views.rs` 的 projection-facing shared value object,供 `domain/reference.rs` 和 query view 复用。
- `ManifestationSourceRuleSet`、`ManifestationVisibilityRuleSet`、`ManifestationSnapshotRuleSet` 和 `ManifestationOwnershipRuleSet` 属于 `domain/manifestation.rs` 的 policy value object,不得只实现为空 struct。
- `ReferenceResolutionRuleSet`、`ReferenceFreshnessRuleSet`、`ReferenceDigestRuleSet`、`DigestMismatchDecision`、`DigestUnavailableDecision`、`DegradedViewRuleSet` 和 `DegradedViewDecision` 属于 `domain/reference.rs` 的 policy value object,不得只实现为空 struct。
- `domain/manifestation.rs` 和 `domain/reference.rs` 只能消费这些 shared value object,不得复制第二份 schema。

```rust
/// Identifies the upstream truth center that owns an external fact.
pub enum ExternalSourceSystem {
    /// The external fact is owned by L1-work.
    Work,
    /// The external fact is owned by L1-governance.
    Governance,
    /// The external fact is owned by L1-artifact.
    Artifact,
    /// The external fact is owned by L2-runtime.
    Runtime,
    /// The external fact is owned by L6-bridges.
    Bridge,
    /// The external fact is owned by L1-identity.
    Identity,
}

/// Classifies the referenced external fact without copying source truth.
pub enum ExternalFactKind {
    /// Work context or formal work fact.
    WorkContext,
    /// Governance decision or review fact.
    GovernanceDecision,
    /// Artifact evidence or artifact version fact.
    ArtifactEvidence,
    /// Runtime result committed as an external fact.
    RuntimeResult,
    /// Bridge mapped fact received from an external platform.
    BridgeMappedFact,
    /// Identity actor or participant snapshot fact.
    IdentityActorSnapshot,
}

/// Safe display summary pointer for an external fact.
pub struct DisplaySummaryRef {
    /// Stable summary reference id.
    pub summary_ref_id: DisplaySummaryRefId,
    /// Source system that generated the display summary.
    pub source_system: ExternalSourceSystem,
    /// External object represented by this summary.
    pub source_object_ref: ExternalSourceObjectRef,
    /// Source version represented by this summary.
    pub source_version_ref: ExternalSourceVersionRef,
    /// Digest of the safe summary material.
    pub summary_digest: ExternalSourceDigest,
}

/// Reason attached when manifesting an external fact into a conversation space.
pub struct ManifestationReason {
    /// Stable reason reference.
    pub reason_ref: CommandReasonRef,
    /// Machine-readable reason kind.
    pub reason_kind: ManifestationReasonKind,
}

/// Classifies why an external fact is manifested.
pub enum ManifestationReasonKind {
    /// Manifestation requested directly by a trusted command.
    ManualRequest,
    /// Manifestation created from an upstream committed event.
    SourceEvent,
    /// Manifestation created while rebuilding an external reference projection.
    ProjectionRebuild,
    /// Manifestation created for review or trace handoff.
    ReviewTrace,
}

/// Reason attached when revoking an existing manifestation.
pub struct ManifestationRevokeReason {
    /// Stable reason reference.
    pub reason_ref: CommandReasonRef,
    /// Machine-readable revoke reason kind.
    pub reason_kind: ManifestationRevokeReasonKind,
}

/// Classifies why a manifestation is revoked.
pub enum ManifestationRevokeReasonKind {
    /// Source owner marked the referenced fact unavailable.
    SourceUnavailable,
    /// Visibility policy no longer permits this manifestation.
    VisibilityRevoked,
    /// Operator explicitly revoked the manifestation.
    OperatorRevoked,
    /// Digest or source version integrity check failed.
    IntegrityFailed,
}

/// Reason attached to an external reference resolution state.
pub struct ReferenceResolutionReason {
    /// Stable reason reference.
    pub reason_ref: CommandReasonRef,
    /// Machine-readable resolution reason kind.
    pub reason_kind: ReferenceResolutionReasonKind,
}

/// Classifies why external reference resolution is pending, unresolved, stale, or failed.
pub enum ReferenceResolutionReasonKind {
    /// Resolution is waiting for an upstream snapshot or event.
    PendingSource,
    /// The referenced source object was not found.
    SourceNotFound,
    /// The referenced source object is not visible to this conversation scope.
    SourceNotVisible,
    /// Resolver returned a temporary failure or timeout.
    ResolverUnavailable,
    /// Digest verification failed.
    DigestMismatch,
    /// Source version changed and the snapshot is stale.
    SourceVersionChanged,
}

/// Safe resolver result for an external fact reference.
pub struct ExternalFactResolution {
    /// Resolved external fact reference.
    pub external_fact_ref: ExternalFactRef,
    /// Current source version observed by the resolver.
    pub source_version_ref: ExternalSourceVersionRef,
    /// Current source digest observed by the resolver.
    pub source_digest: ExternalSourceDigest,
    /// Resolution state after lookup.
    pub resolution_state: ReferenceResolutionState,
    /// Safe display summary when one is available.
    pub display_summary_ref: Option<DisplaySummaryRef>,
    /// Reason for pending, unresolved, stale, or failed resolution.
    pub resolution_reason: Option<ReferenceResolutionReason>,
}

/// Result of checking whether a known external digest still matches the source.
pub struct DigestVerification {
    /// External fact reference that was verified.
    pub external_fact_ref: ExternalFactRef,
    /// Digest supplied by Conversation.
    pub expected_digest: ExternalSourceDigest,
    /// Digest currently observed at the source, if available.
    pub actual_digest: Option<ExternalSourceDigest>,
    /// Verification outcome.
    pub verification_state: DigestVerificationState,
    /// Reason when verification fails or cannot complete.
    pub resolution_reason: Option<ReferenceResolutionReason>,
}

/// Outcome of external digest verification.
pub enum DigestVerificationState {
    /// The expected digest matches the source.
    Matched,
    /// The source digest differs from the expected digest.
    Mismatched,
    /// The resolver could not read the source digest.
    Unavailable,
}

/// Rules for source systems and fact kinds that can be manifested.
pub struct ManifestationSourceRuleSet {
    /// Source systems accepted by this manifestation policy.
    pub allowed_source_systems: Vec<ExternalSourceSystem>,
    /// External fact kinds accepted by this manifestation policy.
    pub allowed_fact_kinds: Vec<ExternalFactKind>,
    /// Whether the source version must be supported by the resolver configuration.
    pub require_supported_source_version: bool,
}

/// Rules that bind manifestation to conversation visibility.
pub struct ManifestationVisibilityRuleSet {
    /// Whether a visibility scope must be present before manifestation.
    pub require_visibility_scope: bool,
    /// Whether manifestation is allowed when the visibility scope is restricted.
    pub allow_manifestation_when_visibility_restricted: bool,
    /// Optional maximum visibility level allowed for manifested external facts.
    pub max_visibility_level: Option<VisibilityLevel>,
}

/// Rules that decide which safe snapshot state is acceptable.
pub struct ManifestationSnapshotRuleSet {
    /// Whether manifested external facts require a safe snapshot.
    pub require_safe_snapshot: bool,
    /// Whether unresolved marker records may exist without a snapshot.
    pub allow_unresolved_without_snapshot: bool,
    /// Whether the snapshot digest must match the source digest.
    pub require_digest_match: bool,
    /// Whether a stale snapshot may remain displayable as a degraded marker.
    pub allow_stale_snapshot: bool,
}

/// Rules that prevent conversation from taking ownership of source truth.
pub struct ManifestationOwnershipRuleSet {
    /// Whether source truth body copy is forbidden.
    pub forbid_source_truth_copy: bool,
    /// Whether source truth state mutation is forbidden.
    pub forbid_source_state_mutation: bool,
    /// Whether the external ref must carry source_system and source_object_ref.
    pub require_source_object_ref: bool,
}

/// Rules for whether an external reference can be resolved.
pub struct ReferenceResolutionRuleSet {
    /// Source systems accepted by the reference resolver.
    pub allowed_source_systems: Vec<ExternalSourceSystem>,
    /// Whether pending resolution markers are allowed.
    pub allow_pending_resolution: bool,
    /// Whether unresolved markers are allowed instead of fabricating local truth.
    pub allow_unresolved_marker: bool,
    /// Whether unsupported source systems immediately make the reference invalid.
    pub invalid_on_unsupported_source: bool,
}

/// Rules for freshness and refresh behavior of external snapshots.
pub struct ReferenceFreshnessRuleSet {
    /// Whether source version changes mark the reference stale.
    pub mark_stale_on_version_change: bool,
    /// Whether stale references require a refresh before normal display.
    pub require_refresh_for_stale: bool,
    /// Whether stale references may still expose degraded display summaries.
    pub allow_stale_degraded_display: bool,
}

/// Rules for external digest validation.
pub struct ReferenceDigestRuleSet {
    /// Whether snapshots must carry a source digest.
    pub require_digest_for_snapshot: bool,
    /// Decision applied when the expected digest does not match the source.
    pub mismatch_decision: DigestMismatchDecision,
    /// Decision applied when the source digest cannot be read.
    pub unavailable_decision: DigestUnavailableDecision,
}

/// Decision applied to digest mismatch.
pub enum DigestMismatchDecision {
    /// Return DomainError::DigestMismatch and leave existing local truth unchanged.
    RejectWithDomainError,
    /// Mark the reference unresolved with a digest mismatch reason.
    MarkUnresolvedWithReason,
}

/// Decision applied when digest verification cannot read the source digest.
pub enum DigestUnavailableDecision {
    /// Keep the reference pending until retry.
    MarkPending,
    /// Mark the reference unresolved.
    MarkUnresolved,
}

/// Rules for safely exposing degraded external-reference views.
pub struct DegradedViewRuleSet {
    /// Whether pending references can expose a pending marker.
    pub allow_pending_marker: bool,
    /// Whether unresolved references can expose an unresolved marker.
    pub allow_unresolved_marker: bool,
    /// Whether stale references can expose a stale safe summary.
    pub allow_stale_summary: bool,
    /// Whether degraded views must point to a degraded display reference.
    pub require_degraded_display_ref: bool,
    /// Whether falling back to source body is forbidden.
    pub forbid_source_body_fallback: bool,
}

/// Decision returned by ReferenceValidityPolicy for degraded display.
pub enum DegradedViewDecision {
    /// Hide the reference from the current view.
    Hidden,
    /// Expose a pending marker without source body.
    Pending {
        /// Reason for pending state.
        reason: ReferenceResolutionReason,
    },
    /// Expose an unresolved marker without source body.
    Unresolved {
        /// Optional degraded display reference.
        degraded_display_ref: Option<DegradedDisplayRef>,
        /// Reason for unresolved state.
        reason: ReferenceResolutionReason,
    },
    /// Expose a stale safe summary.
    StaleSummary {
        /// Degraded display reference.
        degraded_display_ref: DegradedDisplayRef,
        /// Reason for stale state.
        reason: ReferenceResolutionReason,
    },
    /// Expose an invalid marker without display material.
    Invalid {
        /// Reason for invalid state.
        reason: ReferenceResolutionReason,
    },
}

/// Stable id for an external reference projection.
pub struct ExternalReferenceProjectionId(pub String);

/// Stable id for a degraded display reference.
pub struct DegradedDisplayRefId(pub String);

/// Stable id for a display fragment reference.
pub struct DisplayFragmentRefId(pub String);

/// Safe degraded display pointer for unresolved or stale external references.
pub struct DegradedDisplayRef {
    /// Stable degraded display reference id.
    pub degraded_display_ref_id: DegradedDisplayRefId,
    /// External fact represented by the degraded marker.
    pub external_fact_ref: ExternalFactRef,
    /// Resolution state that caused degraded display.
    pub resolution_state: ReferenceResolutionState,
    /// Reason for the degraded marker.
    pub resolution_reason: ReferenceResolutionReason,
    /// Optional safe summary material.
    pub display_summary_ref: Option<DisplaySummaryRef>,
}

/// Safe display fragment pointer exposed by external reference projections.
pub struct DisplayFragmentRef {
    /// Stable display fragment reference id.
    pub display_fragment_ref_id: DisplayFragmentRefId,
    /// Space that owns the display fragment.
    pub space_id: ConversationSpaceId,
    /// External fact represented by the fragment.
    pub external_fact_ref: ExternalFactRef,
    /// Snapshot used for normal display, if available.
    pub source_snapshot_ref: Option<ExternalFactSnapshotRef>,
    /// Degraded display marker, if normal display is unavailable.
    pub degraded_display_ref: Option<DegradedDisplayRef>,
    /// Visibility scope applied to the fragment.
    pub visibility_scope_id: VisibilityScopeId,
    /// Resolution state represented by the fragment.
    pub resolution_state: ReferenceResolutionState,
}
```

| 类型 | 字段闭环 | 禁止事项 |
|---|---|---|
| `ExternalSourceSystem` | event consumer config、resolver config、`ExternalFactRef.source_system` | 不写自由字符串或 repository URL |
| `ExternalFactKind` | inbound event type、manifest command、resolver result | 不混同 fact kind 与 source lifecycle |
| `DisplaySummaryRef` | resolver safe snapshot output | 不保存 display summary body |
| `ManifestationReason` | command `manifestation_reason` 或 consumer / rebuild 派生 reason | 不作为 authorization decision |
| `ManifestationRevokeReason` | revoke domain method / future revoke flow | 不删除 manifestation history |
| `ReferenceResolutionReason` | resolver failure、pending marker、stale marker | 不保存 resolver error body |
| `ExternalFactResolution` | `ExternalFactResolverPort.resolve_external_fact(...)` | 不包含 source body、raw response 或 secret |
| `DigestVerification` | `ExternalFactResolverPort.verify_digest(...)` | 不把 mismatch 自动改写成 matched |
| `ManifestationSourceRuleSet` | `ManifestationPolicy.allowed_source_rules` | 不从 adapter 名称隐式推导 |
| `ManifestationVisibilityRuleSet` | `ManifestationPolicy.visibility_rules` | 不绕过 `VisibilityScope` |
| `ManifestationSnapshotRuleSet` | `ManifestationPolicy.snapshot_rules` | 不把来源正文当作 snapshot |
| `ManifestationOwnershipRuleSet` | `ManifestationPolicy.ownership_rules` | 不接管、修改或复制来源 truth |
| `ReferenceResolutionRuleSet` | `ReferenceValidityPolicy.resolution_rules` | 不把 unresolved 当作本地 truth |
| `ReferenceFreshnessRuleSet` | `ReferenceValidityPolicy.freshness_rules` | 不把 stale 伪装成 fresh |
| `ReferenceDigestRuleSet` | `ReferenceValidityPolicy.digest_rules` | 不忽略 mismatch |
| `DegradedViewRuleSet` | `ReferenceValidityPolicy.degraded_view_rules` | 不回退读取来源正文 |
| `DegradedViewDecision` | `ReferenceValidityPolicy.choose_degraded_view(...)` | 不修改 truth |
| `ExternalReferenceProjectionId` | `ExternalReferenceProjection.external_reference_projection_id` | 不作为 source truth id |
| `DegradedDisplayRef` | `ExternalReferenceProjection.degraded_display_ref`、query degraded marker | 不保存 external body |
| `DisplayFragmentRef` | `ExternalReferenceProjection.display_fragment(...)` | 不绕过 visibility 裁剪 |

默认策略口径:

- `ManifestationPolicy::default_policy()` 使用 `allowed_source_systems = [Work, Governance, Artifact, Runtime, Bridge, Identity]`、`allowed_fact_kinds = [WorkContext, GovernanceDecision, ArtifactEvidence, RuntimeResult, BridgeMappedFact, IdentityActorSnapshot]`、`require_supported_source_version = true`。
- 默认显化可见规则为 `require_visibility_scope = true`、`allow_manifestation_when_visibility_restricted = false`、`max_visibility_level = None`;`None` 表示不额外放宽或收窄既有 `VisibilityScope`。
- 默认显化快照规则为 `require_safe_snapshot = true`、`allow_unresolved_without_snapshot = true`、`require_digest_match = true`、`allow_stale_snapshot = false`;`allow_unresolved_without_snapshot` 只允许 unresolved marker,不允许正常 display。
- 默认显化 ownership 规则为 `forbid_source_truth_copy = true`、`forbid_source_state_mutation = true`、`require_source_object_ref = true`;该字段要求 `ExternalFactRef.source_system` 和 `ExternalFactRef.source_object_ref` 均存在,不引入新的 owner 字段。
- `ManifestationPolicy::from_allowed_sources(rules)` 必须只替换 `allowed_source_rules`,其余 `visibility_rules`、`snapshot_rules` 和 `ownership_rules` 使用默认规则。
- `ReferenceValidityPolicy::default_policy()` 使用同一组受支持 `allowed_source_systems`,并设置 `allow_pending_resolution = true`、`allow_unresolved_marker = true`、`invalid_on_unsupported_source = true`。
- 默认 freshness 规则为 `mark_stale_on_version_change = true`、`require_refresh_for_stale = true`、`allow_stale_degraded_display = true`。
- 默认 digest 规则为 `require_digest_for_snapshot = true`、`mismatch_decision = DigestMismatchDecision::RejectWithDomainError`、`unavailable_decision = DigestUnavailableDecision::MarkUnresolved`。
- 默认 degraded view 规则为 `allow_pending_marker = true`、`allow_unresolved_marker = true`、`allow_stale_summary = true`、`require_degraded_display_ref = true`、`forbid_source_body_fallback = true`。
- `ReferenceValidityPolicy::from_source_rules(rules)` 必须只替换 `resolution_rules`,其余 `freshness_rules`、`digest_rules` 和 `degraded_view_rules` 使用默认规则。

Digest mismatch 正式口径:

- 当 `DigestVerification.verification_state = DigestVerificationState::Mismatched` 且 `ReferenceDigestRuleSet.mismatch_decision = DigestMismatchDecision::RejectWithDomainError` 时,`ReferenceValidityPolicy::assert_snapshot_valid(...)` 必须返回 `DomainError::DigestMismatch`。
- `DomainError::DigestMismatch` 不得创建新的 `ExternalFactSnapshot`,不得把 `ReferenceResolutionState` 标为 `Fresh`,不得把既有 `CrossDomainManifestation.manifestation_state` 推进为 `Manifested`。
- refresh job 或 application service 可以在错误处理路径写入 `ReferenceResolutionState::Unresolved` + `ReferenceResolutionReasonKind::DigestMismatch` 的 marker / diagnostic evidence,但不得覆盖上一份已验证的 snapshot、manifestation 或 conversation truth。
- `TC-CONV-MAN-003` 的断言口径固定为:返回 `DomainError::DigestMismatch`,同时保留旧 truth,只追加 unresolved / mismatch marker 或后续 Step 13 evidence。

#### 7.7.1 `CrossDomainManifestation`

```rust
/// Records how an external committed fact is manifested into a conversation space.
pub struct CrossDomainManifestation {
    /// Stable manifestation id.
    pub manifestation_id: CrossDomainManifestationId,
    /// Space that owns the manifestation record.
    pub space_id: ConversationSpaceId,
    /// External committed fact reference.
    pub external_fact_ref: ExternalFactRef,
    /// Safe snapshot used for display or trace.
    pub snapshot_ref: Option<ExternalFactSnapshotRef>,
    /// Visibility scope for this manifestation.
    pub visibility_scope_id: VisibilityScopeId,
    /// Manifestation lifecycle state.
    pub manifestation_state: ManifestationState,
    /// Source version that was manifested.
    pub source_version_ref: ExternalSourceVersionRef,
}
```

```rust
/// Describes manifestation lifecycle for an external fact in conversation.
pub enum ManifestationState {
    /// The external fact is manifested and can be read under visibility rules.
    Manifested,
    /// The manifested snapshot or source version is stale.
    Stale,
    /// The manifestation was revoked but remains traceable.
    Revoked,
    /// The source cannot currently be resolved.
    Unresolved,
}
```

`ManifestationState` 的正式 enum 定义归属 `contracts/refs.rs`,见 §7.2.2。`domain/manifestation.rs` 中的 `CrossDomainManifestation` 直接引用该共享 enum;实现侧不得在 domain 复制第二套同名 enum。本小节保留 enum code block 是为了说明 domain 对象使用的状态语义、允许来源和允许去向。

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Manifested` | `The external fact is manifested and can be read under visibility rules.` | 已显化 | 工厂创建 | `Stale`、`Revoked`、`Unresolved` |
| `Stale` | `The manifested snapshot or source version is stale.` | 来源或快照过期 | `Manifested` | `Manifested`、`Revoked`、`Unresolved` |
| `Revoked` | `The manifestation was revoked but remains traceable.` | 已撤销 | `Manifested`、`Stale`、`Unresolved` | 不适用 |
| `Unresolved` | `The source cannot currently be resolved.` | 不可解析 | 工厂创建、`Manifested`、`Stale` | `Manifested`、`Revoked` |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `manifestation_id` | `CrossDomainManifestationId` | 标识显化记录 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须已成立 |
| `external_fact_ref` | `ExternalFactRef` | 来源正式事实引用 | 不保存来源正文 |
| `snapshot_ref` | `Option<ExternalFactSnapshotRef>` | 安全快照引用 | unresolved 可为空 |
| `visibility_scope_id` | `VisibilityScopeId` | 可见范围 | 读取必须裁剪 |
| `manifestation_state` | `ManifestationState` | 显化状态 | Revoked 终态 |
| `source_version_ref` | `ExternalSourceVersionRef` | 来源版本 | 用于 freshness |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, latest_version_ref: ExternalSourceVersionRef) -> Result<(), DomainError>` | 标记过期 | 最新来源版本 | `Result<(), DomainError>` | 不改来源 |
| `refresh_snapshot(&mut self, snapshot: ExternalFactSnapshot) -> Result<(), DomainError>` | 绑定新快照 | snapshot | `Result<(), DomainError>` | snapshot 必须匹配 ref |
| `revoke(&mut self, actor: ActorRef, reason: ManifestationRevokeReason) -> Result<(), DomainError>` | 撤销显化 | actor 和原因 | `Result<(), DomainError>` | 保留追溯 |
| `visible_to(&self, consumer: ConsumerRef, policy: &VisibilityPolicy) -> bool` | 判断是否可读 | consumer 与 policy | `bool` | 不绕过 visibility |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `CrossDomainManifestation::from_external_fact(space: &ConversationSpace, external_fact_ref: ExternalFactRef, visibility: &VisibilityScope) -> Result<Self, DomainError>` | 从外部引用形成显化记录 | space、external ref、visibility | `Result<Self, DomainError>` | manifest command |
| `CrossDomainManifestation::from_snapshot(external_fact_ref: ExternalFactRef, snapshot: ExternalFactSnapshot, visibility: &VisibilityScope) -> Result<Self, DomainError>` | 从已解析快照形成显化记录 | external ref、snapshot、visibility | `Result<Self, DomainError>` | consumer / refresh |

不变量与禁止事项:

- 不转移来源仓 truth 所有权。
- 不保存来源正文。
- 来源不可用时只能表达 unresolved / stale,不能补造事实。

#### 7.7.2 `ExternalFactRef`

```rust
/// Stable reference to an external committed fact owned by another truth center.
pub struct ExternalFactRef {
    /// Stable external fact reference id.
    pub external_fact_ref_id: ExternalFactRefId,
    /// Source system that owns the fact.
    pub source_system: ExternalSourceSystem,
    /// External fact kind.
    pub source_kind: ExternalFactKind,
    /// Source object reference.
    pub source_object_ref: ExternalSourceObjectRef,
    /// Source version reference.
    pub source_version_ref: ExternalSourceVersionRef,
    /// Digest used for integrity checks.
    pub source_digest: ExternalSourceDigest,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `external_fact_ref_id` | `ExternalFactRefId` | 标识外部引用 | 系统生成 |
| `source_system` | `ExternalSourceSystem` | 来源仓 / 来源系统 | 必须受支持 |
| `source_kind` | `ExternalFactKind` | 来源事实类型 | 不混同来源生命周期 |
| `source_object_ref` | `ExternalSourceObjectRef` | 来源对象引用 | 不保存正文 |
| `source_version_ref` | `ExternalSourceVersionRef` | 来源版本引用 | 用于 freshness |
| `source_digest` | `ExternalSourceDigest` | 来源摘要 | 用于完整性校验 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `belongs_to_source(&self, source_system: ExternalSourceSystem) -> bool` | 判断来源系统 | 来源系统 | `bool` | 只读 |
| `same_identity(&self, other: &ExternalFactRef) -> bool` | 判断是否同一来源事实身份 | 另一个 ref | `bool` | 不比较快照正文 |
| `requires_snapshot(&self) -> bool` | 判断是否必须安全快照 | 无 | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ExternalFactRef::from_work_fact(work_fact_ref: WorkFactRef, version_ref: ExternalSourceVersionRef) -> Result<Self, DomainError>` | 从 work 事实创建引用 | work ref 与版本 | `Result<Self, DomainError>` | work context changed |
| `ExternalFactRef::from_governance_decision(decision_ref: GovernanceDecisionRef, version_ref: ExternalSourceVersionRef) -> Result<Self, DomainError>` | 从治理结论创建引用 | decision ref 与版本 | `Result<Self, DomainError>` | governance fact committed |
| `ExternalFactRef::from_artifact_version(artifact_version_ref: ArtifactVersionRef) -> Result<Self, DomainError>` | 从 artifact 版本创建引用 | artifact version ref | `Result<Self, DomainError>` | artifact fact committed |
| `ExternalFactRef::from_bridge_event(bridge_event_ref: BridgeEventRef) -> Result<Self, DomainError>` | 从 bridge event 创建引用 | bridge event ref | `Result<Self, DomainError>` | bridge mapped fact |

不变量与禁止事项:

- 不包含来源正文。
- 不替代来源仓主键规范。
- 不隐式改变来源事实状态。

#### 7.7.3 `ExternalFactSnapshot`

```rust
/// Stores a safe display snapshot for an external fact without taking ownership of external truth.
pub struct ExternalFactSnapshot {
    /// Stable snapshot id.
    pub snapshot_id: ExternalFactSnapshotId,
    /// External fact reference represented by this snapshot.
    pub external_fact_ref: ExternalFactRef,
    /// Display summary reference without source body.
    pub display_summary_ref: DisplaySummaryRef,
    /// Digest copied from the source version.
    pub source_digest: ExternalSourceDigest,
    /// Timestamp when the snapshot was captured.
    pub captured_at: Timestamp,
    /// Resolution state of this snapshot.
    pub resolution_state: ReferenceResolutionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `snapshot_id` | `ExternalFactSnapshotId` | 标识快照 | 系统生成 |
| `external_fact_ref` | `ExternalFactRef` | 来源引用 | 必须稳定 |
| `display_summary_ref` | `DisplaySummaryRef` | 安全展示摘要引用 | 不含来源正文 |
| `source_digest` | `ExternalSourceDigest` | 来源摘要 | 用于校验 |
| `captured_at` | `Timestamp` | 捕获时间 | 系统生成 |
| `resolution_state` | `ReferenceResolutionState` | 解析状态 | stale / unresolved 必须暴露 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, latest_version_ref: ExternalSourceVersionRef) -> Result<(), DomainError>` | 标记过期 | 最新版本 | `Result<(), DomainError>` | 不改来源 |
| `redact_for_visibility(&self, visibility: &VisibilityScope, consumer: ConsumerRef) -> Result<DisplaySummaryRef, DomainError>` | 按可见性输出摘要 | visibility 与 consumer | `Result<DisplaySummaryRef, DomainError>` | 不泄漏正文 |
| `matches_digest(&self, digest: ExternalSourceDigest) -> bool` | 校验摘要 | digest | `bool` | 只读 |
| `snapshot_ref(&self) -> ExternalFactSnapshotRef` | 返回快照引用 | 无 | `ExternalFactSnapshotRef` | 从 `snapshot_id` 稳定派生 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ExternalFactSnapshot::from_resolved_reference(external_fact_ref: ExternalFactRef, display_summary_ref: DisplaySummaryRef, captured_at: Timestamp) -> Result<Self, DomainError>` | 从已解析引用创建快照 | ref、summary、time | `Result<Self, DomainError>` | refresh job |
| `ExternalFactSnapshot::unresolved(external_fact_ref: ExternalFactRef, reason: ReferenceResolutionReason) -> Result<Self, DomainError>` | 创建不可解析快照 | ref 与原因 | `Result<Self, DomainError>` | resolver 失败 |

不变量与禁止事项:

- 不保存来源正文或 secret。
- 快照不替代来源 truth。
- stale 不得伪装 fresh。

#### 7.7.4 `ManifestationPolicy`

```rust
/// Decides whether an external committed fact can be manifested into a conversation space.
pub struct ManifestationPolicy {
    /// Rules for allowed source systems and fact kinds.
    pub allowed_source_rules: ManifestationSourceRuleSet,
    /// Visibility rules for manifested records.
    pub visibility_rules: ManifestationVisibilityRuleSet,
    /// Rules that decide when a safe snapshot is required.
    pub snapshot_rules: ManifestationSnapshotRuleSet,
    /// Rules that prevent conversation from owning external truth.
    pub ownership_rules: ManifestationOwnershipRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `allowed_source_rules` | `ManifestationSourceRuleSet` | 允许来源规则 | 不接受未知 truth owner |
| `visibility_rules` | `ManifestationVisibilityRuleSet` | 显化可见规则 | 不绕过 scope |
| `snapshot_rules` | `ManifestationSnapshotRuleSet` | 快照要求 | 不允许正文快照 |
| `ownership_rules` | `ManifestationOwnershipRuleSet` | truth ownership 约束 | 禁止接管来源 truth |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_manifestable(&self, external_fact_ref: &ExternalFactRef, space: &ConversationSpace) -> Result<(), DomainError>` | 校验可显化 | external ref 与 space | `Result<(), DomainError>` | 不解析外部系统 |
| `assert_snapshot_allowed(&self, snapshot: &ExternalFactSnapshot, visibility: &VisibilityScope) -> Result<(), DomainError>` | 校验快照可用 | snapshot 与 visibility | `Result<(), DomainError>` | 不读取正文 |
| `assert_source_not_owned(&self, external_fact_ref: &ExternalFactRef) -> Result<(), DomainError>` | 校验不接管来源 truth | external ref | `Result<(), DomainError>` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ManifestationPolicy::default_policy() -> Self` | 构造默认策略 | 无 | `Self` | runtime builder |
| `ManifestationPolicy::from_allowed_sources(rules: ManifestationSourceRuleSet) -> Self` | 从来源规则构造策略 | source rules | `Self` | 配置已校验后 |

不变量与禁止事项:

- 不允许来源正文直接进入 fact。
- 不改变来源状态。
- 不绕过 visibility policy。

#### 7.7.5 `ReferenceValidityPolicy`

```rust
/// Decides whether an external reference is resolvable, displayable, traceable, or degraded.
pub struct ReferenceValidityPolicy {
    /// Resolution rules for external references.
    pub resolution_rules: ReferenceResolutionRuleSet,
    /// Freshness rules for snapshots and projections.
    pub freshness_rules: ReferenceFreshnessRuleSet,
    /// Digest validation rules.
    pub digest_rules: ReferenceDigestRuleSet,
    /// Degraded view rules for unresolved references.
    pub degraded_view_rules: DegradedViewRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `resolution_rules` | `ReferenceResolutionRuleSet` | 解析规则 | 不拥有来源 truth |
| `freshness_rules` | `ReferenceFreshnessRuleSet` | 新鲜度规则 | stale 必须显式 |
| `digest_rules` | `ReferenceDigestRuleSet` | 摘要校验 | digest 不匹配必须失败或降级 |
| `degraded_view_rules` | `DegradedViewRuleSet` | 降级展示规则 | 不补造来源内容 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_reference_acceptable(&self, external_fact_ref: &ExternalFactRef) -> Result<(), DomainError>` | 校验引用可接受 | external ref | `Result<(), DomainError>` | 不解析正文 |
| `assert_snapshot_valid(&self, snapshot: &ExternalFactSnapshot) -> Result<(), DomainError>` | 校验快照可用 | snapshot | `Result<(), DomainError>` | 不改 snapshot |
| `choose_degraded_view(&self, external_fact_ref: &ExternalFactRef, state: &ReferenceResolutionState) -> DegradedViewDecision` | 选择降级展示 | ref 与状态 | `DegradedViewDecision` | 不改变 truth |
| `requires_refresh(&self, state: &ReferenceResolutionState) -> bool` | 判断是否需刷新 | resolution state | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReferenceValidityPolicy::default_policy() -> Self` | 构造默认策略 | 无 | `Self` | runtime builder |
| `ReferenceValidityPolicy::from_source_rules(rules: ReferenceResolutionRuleSet) -> Self` | 从解析规则构造策略 | rules | `Self` | source resolver 配置 |

不变量与禁止事项:

- policy 不保存外部对象正文。
- unresolved 不等于 missing truth。
- 刷新只能更新本地 snapshot / projection。

### 7.8 `domain/trace.rs` 对象实现契约

#### 7.8.1 `ConversationTraceContext`

```rust
/// Links facts, manifestations, scope changes, review anchors, and retention state for conversation trace.
pub struct ConversationTraceContext {
    /// Stable trace context id.
    pub trace_context_id: ConversationTraceContextId,
    /// Space that owns this trace context.
    pub space_id: ConversationSpaceId,
    /// Facts attached to this trace context.
    pub fact_refs: Vec<ConversationFactRef>,
    /// Manifestations attached to this trace context.
    pub manifestation_refs: Vec<CrossDomainManifestationRef>,
    /// Scope changes attached to this trace context.
    pub scope_change_refs: Vec<ScopeChangeRecordRef>,
    /// Optional review anchor.
    pub review_anchor_ref: Option<ReviewAnchorRef>,
    /// Retention and handoff state.
    pub retention_state: TraceRetentionState,
}
```

```rust
/// Describes retention state for a conversation trace context.
pub enum TraceRetentionState {
    /// The trace context can accept new trace links.
    Open,
    /// The trace context is sealed and only supports reads and handoff.
    Sealed,
    /// The trace context must be handed off to observability or archive.
    HandoffPending,
    /// Local retention expired and only references remain.
    Expired,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | `The trace context can accept new trace links.` | 可追加追溯关联 | 创建 context | `Sealed`、`HandoffPending`、`Expired` |
| `Sealed` | `The trace context is sealed and only supports reads and handoff.` | 已封存 | `Open` | `HandoffPending`、`Expired` |
| `HandoffPending` | `The trace context must be handed off to observability or archive.` | 待交接 | `Open`、`Sealed` | `Sealed`、`Expired` |
| `Expired` | `Local retention expired and only references remain.` | 本地保留过期 | `Open`、`Sealed`、`HandoffPending` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `trace_context_id` | `ConversationTraceContextId` | 标识追溯上下文 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配关联对象 |
| `fact_refs` | `Vec<ConversationFactRef>` | 关联事实引用 | 不保存正文 |
| `manifestation_refs` | `Vec<CrossDomainManifestationRef>` | 关联显化引用 | 不保存来源正文 |
| `scope_change_refs` | `Vec<ScopeChangeRecordRef>` | 关联范围变化 | 只保存引用 |
| `review_anchor_ref` | `Option<ReviewAnchorRef>` | 复盘锚点 | 可为空 |
| `retention_state` | `TraceRetentionState` | 保留状态 | expired 后只留引用 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `attach_fact(&mut self, fact: &ConversationFact) -> Result<(), DomainError>` | 附加事实引用 | fact | `Result<(), DomainError>` | 不改 fact |
| `attach_manifestation(&mut self, manifestation: &CrossDomainManifestation) -> Result<(), DomainError>` | 附加显化引用 | manifestation | `Result<(), DomainError>` | 不改 manifestation |
| `attach_scope_change(&mut self, change: &ScopeChangeRecord) -> Result<(), DomainError>` | 附加范围变化引用 | scope change | `Result<(), DomainError>` | 不改 scope |
| `seal(&mut self, actor: ActorRef, reason: TraceSealReason) -> Result<(), DomainError>` | 封存追溯上下文 | actor 和原因 | `Result<(), DomainError>` | 不删除引用 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationTraceContext::from_fact_append(fact: &ConversationFact, receipt: &FactAppendReceipt) -> Result<Self, DomainError>` | 从事实追加形成追溯上下文 | fact 与 receipt | `Result<Self, DomainError>` | append flow |
| `ConversationTraceContext::from_manifestation(manifestation: &CrossDomainManifestation) -> Result<Self, DomainError>` | 从显化形成追溯上下文 | manifestation | `Result<Self, DomainError>` | manifest flow |

不变量与禁止事项:

- 不替代全局 trace store。
- 不保存完整日志正文。
- trace 不改写事实。

#### 7.8.2 `ReviewAnchor`

```rust
/// Stable anchor used for review, accountability, historical navigation, or manual inspection.
pub struct ReviewAnchor {
    /// Stable review anchor id.
    pub review_anchor_id: ReviewAnchorId,
    /// Space that owns this anchor.
    pub space_id: ConversationSpaceId,
    /// Anchor category.
    pub anchor_kind: ReviewAnchorKind,
    /// Target object reference.
    pub target_ref: ReviewTargetRef,
    /// Actor that created the anchor.
    pub created_by: ActorRef,
    /// Reference to review reason.
    pub reason_ref: ReviewReasonRef,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `review_anchor_id` | `ReviewAnchorId` | 标识复盘锚点 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 target |
| `anchor_kind` | `ReviewAnchorKind` | fact / manifestation / scope change / handoff / projection issue | 不表达治理裁决 |
| `target_ref` | `ReviewTargetRef` | 被复盘对象引用 | 只保存引用 |
| `created_by` | `ActorRef` | 创建 actor | 不保存身份正文 |
| `reason_ref` | `ReviewReasonRef` | 复盘原因引用 | 不保存长报告 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `points_to_fact(&self, fact_id: ConversationFactId) -> bool` | 判断是否指向事实 | fact id | `bool` | 只读 |
| `points_to_manifestation(&self, manifestation_id: CrossDomainManifestationId) -> bool` | 判断是否指向显化 | manifestation id | `bool` | 只读 |
| `visible_under(&self, visibility: &VisibilityScope, consumer: ConsumerRef) -> bool` | 判断是否可读 | visibility 与 consumer | `bool` | 不绕过 visibility |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReviewAnchor::for_fact(fact: &ConversationFact, actor: ActorRef, reason_ref: ReviewReasonRef) -> Result<Self, DomainError>` | 为事实创建锚点 | fact、actor、reason | `Result<Self, DomainError>` | review command |
| `ReviewAnchor::for_manifestation(manifestation: &CrossDomainManifestation, actor: ActorRef, reason_ref: ReviewReasonRef) -> Result<Self, DomainError>` | 为显化创建锚点 | manifestation、actor、reason | `Result<Self, DomainError>` | manifestation review |
| `ReviewAnchor::for_scope_change(change: &ScopeChangeRecord, actor: ActorRef, reason_ref: ReviewReasonRef) -> Result<Self, DomainError>` | 为 scope change 创建锚点 | change、actor、reason | `Result<Self, DomainError>` | scope review |

不变量与禁止事项:

- 不替代 governance decision。
- 不包含审查正文全集。
- 锚点输出仍需经过 `VisibilityPolicy`。

#### 7.8.3 `TraceHandoffRecord`

```rust
/// Records intent, state, and evidence for handoff from conversation trace to observability.
pub struct TraceHandoffRecord {
    /// Stable trace handoff id.
    pub trace_handoff_id: TraceHandoffRecordId,
    /// Trace context being handed off.
    pub trace_context_id: ConversationTraceContextId,
    /// Observability destination reference.
    pub destination_ref: ObservabilityDestinationRef,
    /// Redacted handoff payload reference.
    pub handoff_payload_ref: TraceHandoffPayloadRef,
    /// Handoff lifecycle state.
    pub handoff_state: TraceHandoffState,
    /// Retry marker for failed handoff.
    pub retry_marker: Option<HandoffRetryMarker>,
}
```

```rust
/// Describes handoff state for trace delivery.
pub enum TraceHandoffState {
    /// The handoff waits for delivery.
    Pending,
    /// The handoff was delivered successfully.
    HandedOff,
    /// The handoff failed and is scheduled for retry.
    RetryPending,
    /// The handoff failed permanently and requires operations handling.
    Failed,
    /// The handoff intent was cancelled.
    Cancelled,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The handoff waits for delivery.` | 待交接 | 工厂创建 | `HandedOff`、`RetryPending`、`Cancelled` |
| `HandedOff` | `The handoff was delivered successfully.` | 已交接 | `Pending`、`RetryPending` | 不适用 |
| `RetryPending` | `The handoff failed and is scheduled for retry.` | 待重试 | `Pending` | `HandedOff`、`Failed`、`Cancelled` |
| `Failed` | `The handoff failed permanently and requires operations handling.` | 失败 | `Pending`、`RetryPending` | 不适用 |
| `Cancelled` | `The handoff intent was cancelled.` | 取消 | `Pending`、`RetryPending` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `trace_handoff_id` | `TraceHandoffRecordId` | 标识 trace handoff | 系统生成 |
| `trace_context_id` | `ConversationTraceContextId` | 被交接 trace | 必须已提交 |
| `destination_ref` | `ObservabilityDestinationRef` | 接收目标 | 不表示外部存储实现 |
| `handoff_payload_ref` | `TraceHandoffPayloadRef` | 脱敏 payload 引用 | 不含 forbidden body |
| `handoff_state` | `TraceHandoffState` | 交接状态 | 失败不回滚 truth |
| `retry_marker` | `Option<HandoffRetryMarker>` | 重试标记 | 成功后清空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_handed_off(&mut self, receipt_ref: ObservabilityReceiptRef, handed_off_at: Timestamp) -> Result<(), DomainError>` | 标记交接成功 | receipt 和时间 | `Result<(), DomainError>` | 不改 trace truth |
| `mark_retry(&mut self, reason: HandoffRetryReason, next_retry_at: Timestamp) -> Result<(), DomainError>` | 标记重试 | 原因和下次时间 | `Result<(), DomainError>` | 保留 retry marker |
| `mark_failed(&mut self, reason: HandoffFailureReason, actor: ActorRef) -> Result<(), DomainError>` | 标记失败 | 原因和 actor | `Result<(), DomainError>` | 进入失败终态 |
| `cancel(&mut self, actor: ActorRef, reason: HandoffCancelReason) -> Result<(), DomainError>` | 取消交接 | actor 和原因 | `Result<(), DomainError>` | 记录取消证据 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `TraceHandoffRecord::from_trace_context(trace_context: &ConversationTraceContext, destination_ref: ObservabilityDestinationRef) -> Result<Self, DomainError>` | 从 trace 创建交接记录 | trace context 和目的地 | `Result<Self, DomainError>` | `RequestTraceHandoff` |
| `TraceHandoffRecord::retry_from_failure(record: &TraceHandoffRecord, reason: HandoffRetryReason) -> Result<Self, DomainError>` | 从失败记录创建重试记录 | handoff record 和原因 | `Result<Self, DomainError>` | retry job |

不变量与禁止事项:

- 交接成功不决定 truth 成立。
- payload 必须脱敏。
- observability 不能反写 Conversation truth。

#### 7.8.4 `ArchiveHandoffRecord`

```rust
/// Records intent, state, and archive reference for handing conversation history to archive.
pub struct ArchiveHandoffRecord {
    /// Stable archive handoff id.
    pub archive_handoff_id: ArchiveHandoffRecordId,
    /// Space covered by the archive handoff.
    pub space_id: ConversationSpaceId,
    /// Trace context used to build the archive handoff package.
    pub trace_context_id: ConversationTraceContextId,
    /// Scope of materials to archive.
    pub archive_scope: ArchiveScope,
    /// Archive package reference once available.
    pub archive_package_ref: Option<ArchivePackageRef>,
    /// Archive handoff lifecycle state.
    pub handoff_state: ArchiveHandoffState,
    /// Retention policy reference used for this handoff.
    pub retention_policy_ref: TraceRetentionPolicyRef,
}
```

```rust
/// Describes archive handoff state.
pub enum ArchiveHandoffState {
    /// The archive handoff waits for delivery.
    Pending,
    /// The archive handoff completed and has an archive package reference.
    Archived,
    /// The archive handoff failed and is scheduled for retry.
    RetryPending,
    /// The archive handoff failed permanently and requires operations handling.
    Failed,
    /// The archive handoff intent was cancelled.
    Cancelled,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `The archive handoff waits for delivery.` | 待归档 | 工厂创建 | `Archived`、`RetryPending`、`Cancelled` |
| `Archived` | `The archive handoff completed and has an archive package reference.` | 已归档 | `Pending`、`RetryPending` | 不适用 |
| `RetryPending` | `The archive handoff failed and is scheduled for retry.` | 待重试 | `Pending` | `Archived`、`Failed`、`Cancelled` |
| `Failed` | `The archive handoff failed permanently and requires operations handling.` | 失败 | `Pending`、`RetryPending` | 不适用 |
| `Cancelled` | `The archive handoff intent was cancelled.` | 取消 | `Pending`、`RetryPending` | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `archive_handoff_id` | `ArchiveHandoffRecordId` | 标识 archive handoff | 系统生成 |
| `space_id` | `ConversationSpaceId` | 归档空间 | 必须匹配 archive scope |
| `trace_context_id` | `ConversationTraceContextId` | 归档材料来源 trace | 必须能读取到已提交 trace context |
| `archive_scope` | `ArchiveScope` | 归档范围 | 不含正文 |
| `archive_package_ref` | `Option<ArchivePackageRef>` | 归档包引用 | 完成后必有 |
| `handoff_state` | `ArchiveHandoffState` | 交接状态 | 失败不回滚 truth |
| `retention_policy_ref` | `TraceRetentionPolicyRef` | 保留策略引用 | 必须已校验 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_archived(&mut self, archive_package_ref: ArchivePackageRef, archived_at: Timestamp) -> Result<(), DomainError>` | 标记归档完成 | package ref 和时间 | `Result<(), DomainError>` | 不保存归档包正文 |
| `mark_retry(&mut self, reason: HandoffRetryReason, next_retry_at: Timestamp) -> Result<(), DomainError>` | 标记重试 | 原因和时间 | `Result<(), DomainError>` | 保留 retry marker |
| `mark_failed(&mut self, reason: HandoffFailureReason, actor: ActorRef) -> Result<(), DomainError>` | 标记失败 | 原因和 actor | `Result<(), DomainError>` | 进入失败终态 |
| `covers_space(&self, space_id: ConversationSpaceId) -> bool` | 判断归档范围是否覆盖空间 | space id | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ArchiveHandoffRecord::from_trace_context(trace_context: &ConversationTraceContext, archive_scope: ArchiveScope, retention_policy_ref: TraceRetentionPolicyRef) -> Result<Self, DomainError>` | 从 trace 创建归档交接 | trace、scope、policy ref | `Result<Self, DomainError>` | archive handoff |
| `ArchiveHandoffRecord::from_space_close(space: &ConversationSpace, trace_context: &ConversationTraceContext, retention_policy: &TraceRetentionPolicy) -> Result<Self, DomainError>` | 从空间关闭创建归档交接 | space、trace context 和 retention policy | `Result<Self, DomainError>` | close flow |

不变量与禁止事项:

- 不保存归档包正文。
- archive 状态不替代 conversation 状态。
- archive 不能反写对话事实。

#### 7.8.5 `TraceRetentionPolicy`

```rust
/// Guards trace retention, redaction, handoff, archive, and forbidden body exclusion.
pub struct TraceRetentionPolicy {
    /// Retention window and scope rules.
    pub retention_rules: TraceRetentionRuleSet,
    /// Handoff routing rules.
    pub handoff_rules: TraceHandoffRuleSet,
    /// Redaction rules for trace materials.
    pub redaction_rules: TraceRedactionRuleSet,
    /// Rules that prevent forbidden bodies from entering trace objects.
    pub body_exclusion_rules: BodyExclusionRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `retention_rules` | `TraceRetentionRuleSet` | 保留窗口和范围 | 不决定 fact 是否成立 |
| `handoff_rules` | `TraceHandoffRuleSet` | 交接规则 | 交接后置 |
| `redaction_rules` | `TraceRedactionRuleSet` | 脱敏规则 | 默认开启 |
| `body_exclusion_rules` | `BodyExclusionRuleSet` | 禁止正文规则 | 不可配置绕过 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_retention_allowed(&self, trace_context: &ConversationTraceContext) -> Result<(), DomainError>` | 校验可保留 | trace context | `Result<(), DomainError>` | 不写 trace |
| `choose_archive_scope(&self, space: &ConversationSpace, trace_context: &ConversationTraceContext) -> ArchiveScope` | 选择归档范围 | space 和 trace | `ArchiveScope` | 不生成归档包 |
| `assert_handoff_allowed(&self, record: &TraceHandoffRecord) -> Result<(), DomainError>` | 校验交接可执行 | handoff record | `Result<(), DomainError>` | 不调用外部系统 |
| `assert_no_forbidden_body(&self, payload_ref: TraceHandoffPayloadRef) -> Result<(), DomainError>` | 校验交接材料无 forbidden body | payload ref | `Result<(), DomainError>` | 只检查引用 / marker |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `TraceRetentionPolicy::default_policy() -> Self` | 默认策略 | 无 | `Self` | runtime builder |
| `TraceRetentionPolicy::from_retention_rules(rules: TraceRetentionRuleSet) -> Self` | 从保留规则构造策略 | retention rules | `Self` | 配置已校验后 |

不变量与禁止事项:

- retention policy 不决定事实是否成立。
- 追溯材料必须引用化和脱敏。
- archive 是外部长期归档承接方,不是本仓 truth store。

### 7.9 `domain/projection.rs` 中 derived support 对象实现契约

#### 7.9.1 `ConversationProjectionState`

```rust
/// Tracks freshness, rebuild, failure, and source position for a derived conversation projection.
pub struct ConversationProjectionState {
    /// Stable projection state id.
    pub projection_state_id: ConversationProjectionStateId,
    /// Space represented by this projection state.
    pub space_id: ConversationSpaceId,
    /// Projection kind represented by this state.
    pub projection_kind: ConversationProjectionKind,
    /// Source position covered by this projection.
    pub source_position: ConversationSourcePosition,
    /// Freshness lifecycle state.
    pub freshness_state: ProjectionFreshnessState,
    /// Last rebuild reference.
    pub last_rebuild_ref: Option<ProjectionRebuildRef>,
    /// Last error reference.
    pub last_error_ref: Option<ProjectionErrorRef>,
}
```

`ProjectionFreshnessState` 的正式 enum 定义归属 `contracts/refs.rs`,见 §7.2.2;`domain/projection.rs` 的 `ConversationProjectionState` 直接使用该共享 enum,不得复制第二份状态类型。

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Fresh` | `Projection is aligned with the source position.` | 新鲜 | 初始 / rebuild 完成 | `Stale`、`Rebuilding`、`Disabled` |
| `Stale` | `Projection lags behind committed truth.` | 过期 | `Fresh`、`Failed` | `Rebuilding`、`Disabled` |
| `Rebuilding` | `Projection is currently being rebuilt.` | 重建中 | `Fresh`、`Stale`、`Failed` | `Fresh`、`Failed` |
| `Failed` | `Projection rebuild failed and reads must degrade or expose failure.` | 重建失败 | `Rebuilding` | `Stale`、`Rebuilding`、`Disabled` |
| `Disabled` | `Projection is disabled and must not be used for reads.` | 禁用 | 任意非终态 | 不适用 |

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `projection_state_id` | `ConversationProjectionStateId` | 标识派生状态 | 按 `space_id + projection_kind` 稳定派生 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 repository key |
| `projection_kind` | `ConversationProjectionKind` | read model / search / cursor / reference projection | 不混同具体 store |
| `source_position` | `ConversationSourcePosition` | 覆盖 truth 位置 | 只能前进 |
| `freshness_state` | `ProjectionFreshnessState` | freshness 状态 | stale / failed 必须暴露 |
| `last_rebuild_ref` | `Option<ProjectionRebuildRef>` | 最近重建引用 | 无重建时为空 |
| `last_error_ref` | `Option<ProjectionErrorRef>` | 最近错误引用 | fresh 时可为空 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, reason: ProjectionStaleReason) -> Result<(), DomainError>` | 标记 stale | 原因 | `Result<(), DomainError>` | 不改 truth |
| `begin_rebuild(&mut self, rebuild_ref: ProjectionRebuildRef) -> Result<(), DomainError>` | 开始重建 | rebuild ref | `Result<(), DomainError>` | 状态进入 rebuilding |
| `complete_rebuild(&mut self, source_position: ConversationSourcePosition) -> Result<(), DomainError>` | 完成重建 | source position | `Result<(), DomainError>` | source position 只能前进 |
| `fail_rebuild(&mut self, error_ref: ProjectionErrorRef) -> Result<(), DomainError>` | 重建失败 | error ref | `Result<(), DomainError>` | 读取必须降级 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ConversationProjectionState::initial(space_id: ConversationSpaceId, kind: ConversationProjectionKind, source_position: ConversationSourcePosition) -> Self` | 创建初始状态 | space、kind 与 source position | `Self` | projection 初始化;id 稳定派生 |
| `ConversationProjectionState::disabled(space_id: ConversationSpaceId, kind: ConversationProjectionKind, reason: ProjectionDisableReason) -> Self` | 创建禁用状态 | space、kind 与 reason | `Self` | 不启用某派生;id 稳定派生 |

不变量与禁止事项:

- projection state 不改写 truth。
- failed / stale 不得隐藏。
- projection 不能成为第二事实源。

#### 7.9.2 `SearchIndexProjection`

```rust
/// Derived search index reference set for locating conversation facts and manifestations.
pub struct SearchIndexProjection {
    /// Stable search projection id.
    pub search_projection_id: SearchIndexProjectionId,
    /// Space covered by this index.
    pub space_id: ConversationSpaceId,
    /// Indexed fact references.
    pub indexed_fact_refs: Vec<ConversationFactRef>,
    /// Indexed manifestation references.
    pub indexed_manifestation_refs: Vec<CrossDomainManifestationRef>,
    /// Projection freshness state.
    pub projection_state: ConversationProjectionState,
    /// Covered source position.
    pub source_position: ConversationSourcePosition,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `search_projection_id` | `SearchIndexProjectionId` | 标识搜索投影 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 indexed refs |
| `indexed_fact_refs` | `Vec<ConversationFactRef>` | 已索引事实引用 | 不保存完整正文 |
| `indexed_manifestation_refs` | `Vec<CrossDomainManifestationRef>` | 已索引显化引用 | 不保存来源正文 |
| `projection_state` | `ConversationProjectionState` | freshness 状态 | stale 必须暴露 |
| `source_position` | `ConversationSourcePosition` | 覆盖位置 | 只能前进 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, reason: ProjectionStaleReason) -> Result<(), DomainError>` | 标记 stale | 原因 | `Result<(), DomainError>` | 不改 truth |
| `attach_fact_ref(&mut self, fact_ref: ConversationFactRef) -> Result<(), DomainError>` | 添加事实引用 | fact ref | `Result<(), DomainError>` | 不保存正文 |
| `attach_manifestation_ref(&mut self, manifestation_ref: CrossDomainManifestationRef) -> Result<(), DomainError>` | 添加显化引用 | manifestation ref | `Result<(), DomainError>` | 不保存正文 |
| `covers_position(&self, source_position: ConversationSourcePosition) -> bool` | 判断覆盖位置 | source position | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `SearchIndexProjection::from_read_model(read_model: &ConversationReadModel) -> Result<Self, DomainError>` | 从读取视图形成索引 | read model | `Result<Self, DomainError>` | rebuild job |
| `SearchIndexProjection::empty_for_space(space_id: ConversationSpaceId) -> Self` | 创建空索引 | space id | `Self` | 初始化 |

不变量与禁止事项:

- 不保存完整正文副本。
- 搜索结果不是 truth。
- 查询结果输出仍需按 consumer 裁剪。

#### 7.9.3 `ChangeCursorProjection`

```rust
/// Derived change stream projection used to maintain incremental cursors.
pub struct ChangeCursorProjection {
    /// Stable change cursor projection id.
    pub change_cursor_projection_id: ChangeCursorProjectionId,
    /// Space covered by this projection.
    pub space_id: ConversationSpaceId,
    /// Change entries available for incremental consumers.
    pub cursor_entries: Vec<ConversationChangeCursorEntry>,
    /// Covered source position.
    pub source_position: ConversationSourcePosition,
    /// Projection freshness state.
    pub projection_state: ConversationProjectionState,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `change_cursor_projection_id` | `ChangeCursorProjectionId` | 标识变化投影 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 entries |
| `cursor_entries` | `Vec<ConversationChangeCursorEntry>` | 可消费变化位置 | 只引用变化 |
| `source_position` | `ConversationSourcePosition` | 覆盖 truth 位置 | 只能前进 |
| `projection_state` | `ConversationProjectionState` | freshness 状态 | failed 必须暴露 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `update_from_outbox(&mut self, outbox: &ConversationOutboxRecord) -> Result<(), DomainError>` | 从 outbox 更新投影 | outbox record | `Result<(), DomainError>` | 调用 `ConversationChangeCursorEntry::from_outbox(outbox)`,不发布事件 |
| `mark_stale(&mut self, reason: ProjectionStaleReason) -> Result<(), DomainError>` | 标记 stale | reason | `Result<(), DomainError>` | 不改 truth |
| `cursor_for(&self, consumer: ConsumerRef) -> Option<ConversationChangeCursorRef>` | 定位 consumer cursor | consumer | `Option<ConversationChangeCursorRef>` | 只读 |
| `covers_sequence(&self, sequence: ConversationFactSequence) -> bool` | 判断覆盖事实序列 | sequence | `bool` | 只读 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ChangeCursorProjection::from_change_log(space_id: ConversationSpaceId, outbox_records: Vec<ConversationOutboxRecord>) -> Result<Self, DomainError>` | 从 outbox 日志创建投影 | space 和带 cursor metadata 的 outbox records | `Result<Self, DomainError>` | rebuild cursor projection |
| `ChangeCursorProjection::empty_for_space(space_id: ConversationSpaceId) -> Self` | 创建空投影 | space id | `Self` | 初始化 |

不变量与禁止事项:

- 变化投影不能生成业务事实。
- 投影过期必须暴露 stale。
- 不绑定具体订阅协议。
- `ChangeCursorProjection::from_change_log(...)` 只能消费 `ConversationOutboxRepository.list_committed_since(...)` 返回的 committed outbox records。每条 record 必须已含 `committed_at`、`visibility_scope_id`、`fact_sequence`、`fact_ref` 和 `manifestation_ref`;projection rebuild 不得从 outbox payload、fact repository、manifestation repository 或 wall clock 补字段。
- `ChangeCursorProjection.source_position.last_outbox_sequence` 必须取已处理 entries 的最大 `outbox_sequence`;`last_fact_sequence` 必须取已处理 entries 中最大 `fact_sequence`,若没有 fact entry 则保持 `ConversationFactSequence(0)`。

#### 7.9.4 `DerivedViewPolicy`

```rust
/// Guards derived views so they remain read-only, rebuildable, and unable to write truth.
pub struct DerivedViewPolicy {
    /// Rules for read-only derived objects.
    pub read_only_rules: DerivedReadOnlyRuleSet,
    /// Rules for rebuild behavior.
    pub rebuild_rules: DerivedRebuildRuleSet,
    /// Rules for degraded read output.
    pub degraded_read_rules: DegradedReadRuleSet,
    /// Rules that prevent derived writes to truth.
    pub truth_write_block_rules: TruthWriteBlockRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `read_only_rules` | `DerivedReadOnlyRuleSet` | 派生只读规则 | 不允许 write truth |
| `rebuild_rules` | `DerivedRebuildRuleSet` | 重建规则 | 只能基于已提交 truth |
| `degraded_read_rules` | `DegradedReadRuleSet` | 降级读取规则 | 必须标记 stale / failed |
| `truth_write_block_rules` | `TruthWriteBlockRuleSet` | 阻止反写规则 | 不可配置关闭 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `assert_read_only(&self, projection_state: &ConversationProjectionState) -> Result<(), DomainError>` | 校验派生只读 | projection state | `Result<(), DomainError>` | 不改 projection |
| `assert_rebuild_allowed(&self, projection_state: &ConversationProjectionState) -> Result<(), DomainError>` | 校验可重建 | projection state | `Result<(), DomainError>` | 不改 truth |
| `choose_degraded_read(&self, projection_state: &ConversationProjectionState) -> DegradedReadDecision` | 选择降级读取 | projection state | `DegradedReadDecision` | 不隐藏状态 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DerivedViewPolicy::default_policy() -> Self` | 默认策略 | 无 | `Self` | runtime builder |
| `DerivedViewPolicy::from_rebuild_rules(rules: DerivedRebuildRuleSet) -> Self` | 从重建规则构造策略 | rules | `Self` | 配置已校验后 |

不变量与禁止事项:

- 派生对象不得生成业务事实。
- stale / failed 必须对读取方可见。
- 降级读取不等于 truth 缺失。

### 7.10 `domain/reference.rs` 对象实现契约

#### 7.10.1 `ReferenceResolutionState`

```rust
/// Describes resolution and freshness state for an external reference or snapshot.
pub enum ReferenceResolutionState {
    /// The reference is resolved and aligned with the known source version.
    Fresh,
    /// The reference was resolved before but the source version changed.
    Stale,
    /// The reference is waiting for asynchronous resolution.
    Pending,
    /// The reference cannot currently be resolved.
    Unresolved,
    /// The reference is invalid and must not be used for display.
    Invalid,
}
```

`ReferenceResolutionState` 的正式 enum 定义归属 `contracts/refs.rs`,见 §7.2.2。`domain/reference.rs`、`domain/manifestation.rs` 和 projection 维护对象直接引用该共享 enum;实现侧不得在 domain 复制第二套同名 enum。本小节保留 enum code block 是为了说明 reference 对象使用的状态语义、允许来源和允许去向。

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Fresh` | `The reference is resolved and aligned with the known source version.` | 已解析且新鲜 | 成功解析 | `Stale`、`Invalid` |
| `Stale` | `The reference was resolved before but the source version changed.` | 已过期 | `Fresh` | `Fresh`、`Pending`、`Invalid` |
| `Pending` | `The reference is waiting for asynchronous resolution.` | 等待解析 | 创建 / `Stale` | `Fresh`、`Unresolved`、`Invalid` |
| `Unresolved` | `The reference cannot currently be resolved.` | 暂不可解析 | `Pending`、`Fresh`、`Stale` | `Pending`、`Fresh`、`Invalid` |
| `Invalid` | `The reference is invalid and must not be used for display.` | 无效 | 任意非终态 | 不适用 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_display(&self) -> bool` | 判断可否展示 | 无 | `bool` | `Invalid` 不可展示 |
| `requires_refresh(&self) -> bool` | 判断是否需要刷新 | 无 | `bool` | `Stale` / `Pending` / `Unresolved` 可能需要 |
| `is_terminal(&self) -> bool` | 判断是否终态 | 无 | `bool` | `Invalid` 为终态 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReferenceResolutionState::pending(reason: ReferenceResolutionReason) -> Self` | 创建 pending 状态 | reason | `Self` | 异步解析 |
| `ReferenceResolutionState::unresolved(reason: ReferenceResolutionReason) -> Self` | 创建 unresolved 状态 | reason | `Self` | resolver 失败 |

不变量与禁止事项:

- unresolved 不改变已提交 Conversation truth。
- invalid 不可用于显示。
- state 不保存来源正文。

#### 7.10.2 `ExternalReferenceProjection`

```rust
/// Derived local projection that groups external references, safe display summaries, and resolution state.
pub struct ExternalReferenceProjection {
    /// Stable external reference projection id.
    pub external_reference_projection_id: ExternalReferenceProjectionId,
    /// Space covered by the projection.
    pub space_id: ConversationSpaceId,
    /// External fact references known to this space.
    pub external_fact_refs: Vec<ExternalFactRef>,
    /// Safe snapshot references available for display.
    pub snapshot_refs: Vec<ExternalFactSnapshotRef>,
    /// Current resolution state.
    pub resolution_state: ReferenceResolutionState,
    /// Optional degraded display fragment.
    pub degraded_display_ref: Option<DegradedDisplayRef>,
}
```

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `external_reference_projection_id` | `ExternalReferenceProjectionId` | 标识外部引用投影 | 系统生成 |
| `space_id` | `ConversationSpaceId` | 所属空间 | 必须匹配 refs |
| `external_fact_refs` | `Vec<ExternalFactRef>` | 外部事实引用集合 | 不保存正文 |
| `snapshot_refs` | `Vec<ExternalFactSnapshotRef>` | 安全快照引用 | 不保存来源正文 |
| `resolution_state` | `ReferenceResolutionState` | 解析状态 | stale / unresolved 必须暴露 |
| `degraded_display_ref` | `Option<DegradedDisplayRef>` | 降级展示引用 | 只保存允许摘要 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `attach_reference(&mut self, external_fact_ref: ExternalFactRef) -> Result<(), DomainError>` | 添加外部引用 | external ref | `Result<(), DomainError>` | 不保存来源正文 |
| `attach_snapshot(&mut self, snapshot_ref: ExternalFactSnapshotRef) -> Result<(), DomainError>` | 添加快照引用 | snapshot ref | `Result<(), DomainError>` | snapshot 必须安全 |
| `mark_unresolved(&mut self, reason: ReferenceResolutionReason) -> Result<(), DomainError>` | 标记不可解析 | reason | `Result<(), DomainError>` | 不删除引用 |
| `display_fragment(&self, consumer: ConsumerRef, visibility: &VisibilityScope) -> Result<DisplayFragmentRef, DomainError>` | 返回可展示片段 | consumer 与 visibility | `Result<DisplayFragmentRef, DomainError>` | 必须裁剪 |

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ExternalReferenceProjection::for_space(space_id: ConversationSpaceId) -> Self` | 创建空引用投影 | space id | `Self` | 初始化 |
| `ExternalReferenceProjection::from_manifestation(manifestation: &CrossDomainManifestation) -> Result<Self, DomainError>` | 从显化记录创建投影 | manifestation | `Result<Self, DomainError>` | manifest flow |

不变量与禁止事项:

- projection 不拥有来源 truth。
- 降级展示不能补造来源内容。
- 投影刷新不生成业务事实。

---

## 8. 回填草稿

正式 `03-详细设计.md` §5 / §6 可引用本文件以下内容:

- §7.1 对象定义范围表
- §7.2 基础值对象归属表
- §7.3~§7.10 domain 对象实现契约

回填时应保留校准来源:

```text
本章主要引用 `design-calibration/03_ddd_step_06_object_contracts.md`。
若需要查看完整字段、函数、工厂函数、enum variant 注释和禁止事项,继续阅读该文件 §7.3~§7.10。
```

对象、trait、协议和流程之间的闭环在后续 Step 中继续完成:

| 后续 Step | 继续补齐内容 |
|---|---|
| Step 7 | repository / resolver / publisher / handoff port trait 和 adapter 契约 |
| Step 8 | Command / Query / Consumer / Event / Job DTO 到 domain 对象构造闭环 |
| Step 9 | 逐接口函数级处理流 |
| Step 10 | 状态转换矩阵和禁止迁移 |
| Step 11 | repository、unit of work、outbox 和 projection consistency |
| Step 12 | `DomainError`、rejection reason、recovery marker 和错误映射 |

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| Rust 片段中的 rustdoc 使用中文还是英文 | A. 中文;B. 英文;C. 正式文档中文、实现片段英文 | 推荐 C | design 正文保留中文说明,实现仓源码和可转写 rustdoc 必须英文 |
| `ReferenceResolutionState` 的实现归属 | A. domain-only enum;B. contracts shared enum;C. contracts / domain 双 enum | 已确认 B | 它进入 public event / query / job report surface,正式归属 `contracts/refs.rs`,domain reference / manifestation / projection 直接复用 |
| 是否把 `ConversationReadModel` 放到 `contracts` | A. 放 contracts;B. 放 domain;C. 双层 view | 已确认 C | `domain/projection.rs::ConversationReadModel` 是 repository / policy / job 使用的内部派生对象;`contracts/views.rs::ConversationReadModelView` 是 public query DTO,不得互相替代 |
| 是否提前定义 repository 对象 | A. 本 Step 定义;B. Step 7 / Step 11 定义 | 推荐 B | repository 是 port / persistence 契约,不属于 domain object 本步主轴 |

---

## 10. 进入下一步条件

```text
domain 模块的 30 个关键对象、状态 enum、policy、projection、reference object、history record 和 handoff record 已经形成可实现契约。
字段均有类型,函数均有参数类型和返回类型,状态 enum 均有 variant rustdoc 和变体表。
可以进入 Step 7,逐模块定义 Trait / Port / Adapter 契约。
```
