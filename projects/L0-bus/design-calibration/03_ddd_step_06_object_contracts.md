# Step 6. 逐模块定义对象实现契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-bus/03-详细设计.md` §5 模块实现契约中的对象实现契约 / §6 全局对象索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 模块主轴、对象归属和依赖方向 | 确认对象主要归属 `domain` 模块 |
| `projects/L0-bus/02-概要设计.md` §6 | 关键对象轮廓、字段骨架、成员函数和禁止事项 | 作为对象实现契约直接输入 |
| `projects/L0-bus/02-概要设计.md` §9 | 状态集合和状态流转 | 作为状态 enum 和变体表输入 |
| `03_ddd_step_03_coding_runtime_constraints.md` | Rustdoc 风格中文注释、源码转写英文、字段 / 函数必须写类型 | 作为 Rust 契约片段写法约束 |
| `standards/document/详细设计书写规范.md` §5.5 | 对象小节、类型定义、字段表、函数表、enum 变体表格式 | 作为本步输出格式 |

已确认结论：

```text
本 Step 重点定义 domain 模块对象实现契约。
contracts 模块的 DTO / Event / Job / View 在 Step 8 定义。
application 模块的 service 函数级处理流在 Step 9 定义。
application port / repository trait 在 Step 7 定义。
infra 模块的 adapter / config / runtime builder 在 Step 7 / Step 14 定义。
api / worker / jobs 模块的 handler / runner / binary contract 在 Step 8 / Step 9 定义。
```

依赖的前序 Step：

```text
Step 5 已确认所有领域对象归属 domain 模块。
```

---

## 3. SOP 问题回答

### 3.1 每个模块中需要定义哪些 struct / enum / value object / service？

| 模块 | 本 Step 定义对象 | 后续 Step 承接 |
|---|---|---|
| `contracts` | 不在本 Step 定义 DTO 细节 | Step 8 定义 Command / Query / Event / Job / View / Receipt / protocol error |
| `domain` | 定义全部领域对象、状态 enum、policy、projection、reference object | Step 10 继续定义状态转换矩阵 |
| `application` | 本 Step 只登记 service 名称，不展开字段和函数 | Step 7 定义 port；Step 9 定义 service 调用链 |
| `infra` | 不在本 Step 定义 adapter / config 细节 | Step 7 / Step 11 / Step 14 定义 |
| `api` | 不在本 Step 定义 handler 细节 | Step 8 / Step 9 定义 |
| `worker` | 不在本 Step 定义 runner 细节 | Step 8 / Step 9 定义 |
| `jobs` | 不在本 Step 定义 binary 细节 | Step 8 / Step 9 定义 |

### 3.2 每个对象的主要责任和不变量是什么？

回答：见 §7.3~§7.8。每个对象独立成节，包含类型定义、成员变量、成员函数、工厂 / 静态函数、不变量与禁止事项。

### 3.3 每个字段的类型、作用和约束是什么？

回答：见每个对象的“成员变量”表。字段类型统一使用 Rust 类型名，不写裸字段名。

### 3.4 每个成员函数的完整签名、参数类型、返回类型和副作用是什么？

回答：见每个对象的“成员函数”表。所有函数签名必须写参数类型，例如 `accept(&mut self, ActorContext actor, Timestamp occurred_at) -> Result<(), DomainError>`。

### 3.5 哪些函数是工厂函数或静态函数？

回答：见每个对象的“工厂 / 静态函数”表。所有工厂函数使用 `Type::function(Type 参数名)` 形式。

### 3.6 哪些状态 enum 需要写变体、允许来源和允许去向？

| 状态 enum | 所属对象 | 是否进入 Step 10 状态矩阵 |
|---|---|---|
| `PublicationAcceptanceStatus` | `PublicationAcceptance` | 是 |
| `DeliveryStatus` | `DeliveryRecord` | 是 |
| `FeedbackStatus` | `FeedbackResult` | 是 |
| `RetryPlanStatus` | `RetryPlan` | 是 |
| `DeadLetterStatus` | `DeadLetterEntry` | 是 |
| `ReplayPreparationStatus` | `ReplayPreparation` | 是 |
| `ProjectionStatus` | `TransportViewProjection` / `FailureSummaryProjection` | 是 |
| `DeliveryMode` | `TransportSemantic` | 否，非状态 enum |
| `BackendKind` | `BackendCapabilityRef` | 否，非状态 enum |

### 3.7 每个 enum variant 的 Rustdoc 注释是什么？带载荷 variant 的载荷类型承载什么语义？

回答：见 §7.3~§7.8 中各 enum 的代码块和变体表。本 Step 定义的 enum 暂不使用带载荷 variant；错误 enum 的带载荷语义由 Step 12 定义。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 对象仍偏向 envelope / routing / callback schema 旧口径 | 无法支撑新版 bus truth / delivery / recovery 主线 |
| 当前 `02-概要设计.md` §6 | 已有对象轮廓，但不是 Rust struct / enum 契约 | 实现者仍需要字段类型、函数签名和 enum variant 注释 |
| Step 5 后续风险 | 若 Step 6 把 DTO、port、handler、adapter 全部混进对象章节 | 会重复 Step 7 / Step 8 / Step 9 / Step 14 |
| 状态 enum 风险 | 若只列状态名，不写 variant 注释和允许来源 / 去向 | 状态机无法被测试和实现 |

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
| 方案 A：本 Step 定义所有模块对象，包括 DTO、service、adapter、handler | 看似完整 | 会重复 Step 7 / Step 8 / Step 9 / Step 14，且 service 字段依赖 port 尚未定义 | 不采用 |
| 方案 B：本 Step 只完整定义 domain 模块对象，其他模块登记后续落点 | 聚焦领域真相和状态不变量，避免重复 | 需要后续 Step 严格补齐协议、port 和处理流 | 采用 |
| 方案 C：只列对象索引，不写 struct / enum 片段 | 文件短 | 不满足“可直接写 Rust 类型和 impl”的要求 | 不采用 |

推荐方案：方案 B。

原因：

- Step 5 已确认领域对象归 `domain`，DTO、port、handler、adapter 分属后续 Step。
- `L0-bus` 最容易出错的是状态、不变量、禁止正文和恢复链，必须优先在 domain 对象层收稳。
- 按对象独立成节能让后续 Step 7~12 精确引用。

---

## 7. 结构化中间产物

### 7.1 对象定义范围表

| 模块 | 本 Step 输出 |
|---|---|
| `contracts` | 仅登记 DTO 后续由 Step 8 定义 |
| `domain` | 完整定义领域对象、状态 enum、policy、projection、reference object |
| `application` | 仅登记 service 名称，函数和字段由 Step 7 / Step 9 补齐 |
| `infra` | 仅登记 config / adapter / runtime builder 由 Step 7 / Step 14 补齐 |
| `api` / `worker` / `jobs` | 仅登记入口对象由 Step 8 / Step 9 补齐 |

### 7.2 基础值对象归属表

| 类型族 | 归属建议 | 实现口径 |
|---|---|---|
| `*Id` | 拥有该对象的 domain 文件 | 使用 newtype，例如 `pub struct DeliveryId(String);` |
| `*Ref` | 引用目标所属 domain 文件；来自 core 的 ref 使用 `core-contracts` 类型 | 只保存引用，不保存正文 |
| `*Reason` | 触发该原因的 domain 文件 | Step 12 可继续细化错误映射 |
| `*Status` | 拥有状态的 domain 对象文件 | 必须写 enum 代码块和变体表 |
| `Timestamp` | 优先使用 `core-contracts` 或统一时间值对象 | 不直接使用裸字符串 |
| `ActorContext` / `TraceContextRef` | 优先来自 `core-contracts` 或本仓轻量 wrapper | 不做认证授权实现 |
| `Version` / `Count` / `No` / `Key` | 使用 newtype | 避免裸 `String` / `u64` 在领域层扩散 |

### 7.3 `domain/publication.rs` 对象实现契约

#### 7.3.1 `PublicationMaterial`

##### 类型定义

```rust
/// 发布材料引用对象，表达发布方提交给 bus 的契约引用、payload 引用和执行上下文。
///
/// 该对象只保存引用和上下文，不保存业务 payload 正文，也不重新定义 L0-core 事件契约。
pub struct PublicationMaterial {
    /// 一次发布材料的唯一标识。
    pub publication_id: PublicationId,

    /// 发布材料来源系统。
    pub source_system: SourceSystem,

    /// 发布材料来源记录引用。
    pub source_record_ref: SourceRecordRef,

    /// 指向 L0-core 中已定义事件契约的引用。
    pub core_event_ref: CoreEventRef,

    /// 指向 L0-core 已提交事件 envelope 的引用；直接发布入口可以为空。
    pub core_event_envelope_ref: Option<CoreEventEnvelopeRef>,

    /// 指向发布方 payload 正文的引用，不包含 payload body。
    pub payload_ref: PayloadRef,

    /// payload 引用类型。
    pub payload_kind: PayloadKind,

    /// payload 正文摘要。
    pub payload_digest: PayloadDigest,

    /// 请求的平台投递语义；P0 只允许 `AtLeastOnce`。
    pub delivery_mode: DeliveryMode,

    /// 请求的目标订阅范围。
    pub target_scope: TargetScope,

    /// 指向已提交 outbox fact 的引用；同步发布入口可以为空。
    pub outbox_fact_ref: Option<OutboxFactRef>,

    /// 发起发布的 actor 上下文，由外部可信入口传入。
    pub actor: ActorContext,

    /// 跨仓 trace 上下文引用。
    pub trace_ref: TraceContextRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `publication_id` | `PublicationId` | 标识一次发布材料 | 系统生成，不得复用 |
| `source_system` | `SourceSystem` | 标识发布材料来源系统 | direct command 直接传入；outbox fact 必须从 source metadata 补齐 |
| `source_record_ref` | `SourceRecordRef` | 标识来源记录 | 与 `source_system` 共同用于幂等 / 唯一约束 |
| `core_event_ref` | `CoreEventRef` | 指向 core 事件契约 | 必须来自 `core-contracts` 或其正式引用 |
| `core_event_envelope_ref` | `Option<CoreEventEnvelopeRef>` | 指向已提交 core event envelope 实例 | direct command 可为空；outbox fact 必须有值；不得当成 `core_event_ref` |
| `payload_ref` | `PayloadRef` | 指向 payload 正文 | 不得包含 payload body |
| `payload_kind` | `PayloadKind` | payload 引用类型 | P0 只接受引用型 payload |
| `payload_digest` | `PayloadDigest` | payload 摘要 | 用于幂等和审计，不读取 payload body |
| `delivery_mode` | `DeliveryMode` | 请求的平台投递语义 | P0 只允许 `AtLeastOnce` |
| `target_scope` | `TargetScope` | 请求的目标范围 | 工厂映射为 domain `SubscriberScope` 时必须校验 |
| `outbox_fact_ref` | `Option<OutboxFactRef>` | 关联已提交 outbox fact | 只允许 committed fact |
| `actor` | `ActorContext` | 审计 actor 上下文 | 不做认证，只透传可信上下文 |
| `trace_ref` | `TraceContextRef` | trace 关联 | 必须进入后续 audit / event |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `has_core_contract(&self) -> bool` | 判断是否具备 core 契约引用 | 无 | `bool` | 不修改对象 |
| `has_payload_reference(&self) -> bool` | 判断是否只保存 payload 引用 | 无 | `bool` | 不读取 payload body |
| `is_from_outbox(&self) -> bool` | 判断材料是否来自 outbox relay | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PublicationMaterial::from_accept_publication_command(AcceptPublicationCommand command, ActorContext actor, CommandMetadata meta) -> Result<PublicationMaterial, DomainError>` | 从接入发布命令构造发布材料 | `command` 携带 core event、payload、delivery mode、target scope，`actor` / `meta` 携带上下文 | `Result<PublicationMaterial, DomainError>` | `AcceptPublication` |
| `PublicationMaterial::from_outbox_fact(CommittedOutboxFactInput input, ActorContext actor, EventMetadata meta) -> Result<PublicationMaterial, DomainError>` | 从已提交 outbox fact 输入构造发布材料 | `input` 必须已经包含 `core_event_ref`、`delivery_mode`、`target_scope` 和 `core_event_envelope_ref` | `Result<PublicationMaterial, DomainError>` | `ConsumeCommittedOutboxFact` |

##### outbox fact 字段映射规则

| 输入字段 | 映射到 | 说明 |
|---|---|---|
| `input.core_event_ref` | `PublicationMaterial.core_event_ref` | 正式 core 事件契约引用；必须由 outbox source adapter 从 core envelope metadata 中解析或补齐 |
| `input.core_event_envelope_ref` | `PublicationMaterial.core_event_envelope_ref` | 已提交 envelope 实例引用；只用于来源追溯和审计，不得当成契约引用 |
| `input.delivery_mode` | `PublicationMaterial.delivery_mode` | P0 只允许 `DeliveryMode::AtLeastOnce` |
| `input.target_scope` | `PublicationMaterial.target_scope` | 后续 `TransportSemantic::derive(...)` 使用它与订阅范围校验 |
| `input.source_system` / `input.source_record_ref` | `PublicationMaterial.source_system` / `PublicationMaterial.source_record_ref` | 用于来源追溯、幂等和唯一约束 |
| `input.payload_ref` / `input.payload_kind` / `input.payload_digest` | `PublicationMaterial` payload 字段 | 只保存引用、类型与摘要，不读取 payload body |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 payload body | 只能保存 `PayloadRef` |
| 不重新定义 core event | 只能引用 `CoreEventRef` |
| 不混淆 envelope 与 contract | `CoreEventEnvelopeRef` 是已提交 envelope 实例，`CoreEventRef` 是正式事件契约引用 |
| 保留 delivery 语义输入 | `delivery_mode` 和 `target_scope` 必须随 material 保存，否则 PH-03 无法从 accepted material 派生传递语义 |
| outbox fact 必须已提交 | 未提交 fact 不得生成接入事实 |

#### 7.3.2 `PublicationAcceptanceStatus`

##### 类型定义

```rust
/// 发布材料接入状态集合。
///
/// 该枚举表达 bus 对发布材料的接入判定结果；合法迁移由 `PublicationAcceptance` 控制。
pub enum PublicationAcceptanceStatus {
    /// 接入判定尚未完成，不能进入 delivery 主线。
    Pending,

    /// 发布材料已被 bus 接受，可以进入 delivery 主线。
    Accepted,

    /// 发布材料已被拒绝，不能进入 delivery 主线。
    Rejected,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | `/// 接入判定尚未完成，不能进入 delivery 主线。` | 初始接入状态 | 新建对象 | `Accepted` / `Rejected` |
| `Accepted` | `/// 发布材料已被 bus 接受，可以进入 delivery 主线。` | 可进入 delivery | `Pending` | 终止 |
| `Rejected` | `/// 发布材料已被拒绝，不能进入 delivery 主线。` | 接入拒绝 | `Pending` | 终止 |

#### 7.3.3 `PublicationAcceptance`

##### 类型定义

```rust
/// 发布材料接入事实，记录 bus 是否接受某个发布材料进入传递链。
///
/// 接受或拒绝都必须可审计；`Rejected` 状态不得进入 delivery 主线。
pub struct PublicationAcceptance {
    /// 接入事实唯一标识。
    pub acceptance_id: PublicationAcceptanceId,

    /// 被判定的发布材料标识。
    pub publication_id: PublicationId,

    /// 当前接入状态。
    pub status: PublicationAcceptanceStatus,

    /// 拒绝原因；仅在 rejected 状态下存在。
    pub reject_reason: Option<PublicationRejectReason>,

    /// 接入成功时间；仅在 accepted 状态下存在。
    pub accepted_at: Option<Timestamp>,

    /// 与最终接入判定关联的审计引用；仅在 Accepted / Rejected 后存在。
    pub decision_audit_ref: Option<AuditRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `acceptance_id` | `PublicationAcceptanceId` | 标识接入事实 | 系统生成 |
| `publication_id` | `PublicationId` | 关联发布材料 | 必须来自 `PublicationMaterial` |
| `status` | `PublicationAcceptanceStatus` | 表达接入状态 | 只能经成员函数改变 |
| `reject_reason` | `Option<PublicationRejectReason>` | 记录拒绝原因 | 仅 `Rejected` 非空 |
| `accepted_at` | `Option<Timestamp>` | 记录接受时间 | 仅 `Accepted` 非空 |
| `decision_audit_ref` | `Option<AuditRef>` | 关联最终接入判定审计条目 | `Accepted` / `Rejected` 后必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `accept(&mut self, ActorContext actor, Timestamp occurred_at, AuditRef audit_ref) -> Result<(), DomainError>` | 标记接入成功 | `actor` 为操作者，`occurred_at` 为发生时间，`audit_ref` 为审计引用 | `Result<(), DomainError>` | 仅允许 `Pending -> Accepted` |
| `reject(&mut self, PublicationRejectReason reason, ActorContext actor, AuditRef audit_ref) -> Result<(), DomainError>` | 标记接入拒绝 | `reason` 为拒绝原因 | `Result<(), DomainError>` | 仅允许 `Pending -> Rejected` |
| `is_accepted(&self) -> bool` | 判断是否可进入 delivery | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PublicationAcceptance::start_pending(PublicationMaterial material, ActorContext actor) -> PublicationAcceptance` | 创建 pending 接入事实 | `material` 为发布材料，`actor` 为操作者 | `PublicationAcceptance` | 接入判定开始 |
| `PublicationAcceptance::rehydrate(PersistedPublicationAcceptance row) -> Result<PublicationAcceptance, DomainError>` | 从持久化记录重建 | `row` 为持久化行 | `Result<PublicationAcceptance, DomainError>` | repository 读取 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 接受或拒绝必须关联审计 | `decision_audit_ref` 不得为空 |
| `Rejected` 不得进入 delivery | application 必须检查 `is_accepted()` |
| 状态终止后不得回退 | `Accepted` / `Rejected` 是终止状态 |

#### 7.3.4 `DeliveryMode`

##### 类型定义

```rust
/// 平台级投递语义分类。
///
/// 当前 P0 默认支持 at-least-once；更强语义必须通过后续专项评估。
pub enum DeliveryMode {
    /// 至少一次投递语义，允许重复 delivery 或重复 feedback，并依赖幂等锚点识别。
    AtLeastOnce,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `AtLeastOnce` | `/// 至少一次投递语义，允许重复 delivery 或重复 feedback，并依赖幂等锚点识别。` | P0 默认投递语义 | 不适用 | 不适用 |

#### 7.3.5 `TransportSemantic`

##### 类型定义

```rust
/// 平台级传递语义值对象，隔离具体后端产品差异。
///
/// 该对象只表达 bus 层语义和后端能力引用，不保存 MQ 裸参数或业务路由正文。
pub struct TransportSemantic {
    /// 传递语义唯一标识。
    pub semantic_id: TransportSemanticId,

    /// 关联的发布材料标识。
    pub publication_id: PublicationId,

    /// 平台级投递语义。
    pub delivery_mode: DeliveryMode,

    /// 目标订阅范围。
    pub target_scope: SubscriberScope,

    /// 后端能力引用。
    pub backend_capability_ref: BackendCapabilityRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `semantic_id` | `TransportSemanticId` | 标识一组传递语义 | 系统生成 |
| `publication_id` | `PublicationId` | 关联发布材料 | 必须来自 accepted publication |
| `delivery_mode` | `DeliveryMode` | 表达平台投递语义 | P0 默认 `AtLeastOnce` |
| `target_scope` | `SubscriberScope` | 表达订阅目标范围 | 不保存业务路由正文 |
| `backend_capability_ref` | `BackendCapabilityRef` | 指向后端能力 | 不保存 secret 或裸配置 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `requires_durable_record(&self) -> bool` | 判断是否需要持久化 delivery | 无 | `bool` | P0 应返回 true |
| `matches_scope(&self, SubscriberScope scope) -> bool` | 判断订阅范围是否匹配 | `scope` 为候选订阅范围 | `bool` | 不修改对象 |
| `uses_backend(&self, BackendCapabilityRef capability_ref) -> bool` | 判断是否绑定某后端能力 | `capability_ref` 为能力引用 | `bool` | 不读取后端配置 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `TransportSemantic::derive(PublicationMaterial material, BackendCapabilityRef capability_ref, SubscriberScope target_scope) -> Result<TransportSemantic, DomainError>` | 从发布材料和后端能力推导平台语义 | `material` 必须通过接入判定；`target_scope` 必须与 `material.target_scope` 归一化后匹配 | `Result<TransportSemantic, DomainError>` | 接入后形成 delivery 语义 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存后端裸参数 | 只保存 `BackendCapabilityRef` |
| 不表达业务路由正文 | 业务路由属于发布方或业务域 |
| 不绕过平台语义 | adapter 必须映射该对象，不得直接读取业务输入 |

#### 7.3.6 `PayloadBoundaryGuard`

##### 类型定义

```rust
/// 发布材料禁止正文守卫，判断 payload body、raw secret 等内容是否被错误带入 bus。
///
/// 该策略对象只做边界判断，不解析业务 payload，也不承担认证授权。
pub struct PayloadBoundaryGuard {
    /// 禁止正文策略引用。
    pub forbidden_body_policy_ref: ForbiddenBodyPolicyRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `forbidden_body_policy_ref` | `ForbiddenBodyPolicyRef` | 指向禁止正文策略口径 | 来自配置或默认策略引用 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `rejects_body(&self, PublicationMaterial material) -> bool` | 判断材料是否携带禁止正文 | `material` 为待检查材料 | `bool` | 不解析 payload body |
| `allows_reference(&self, PayloadRef payload_ref) -> bool` | 判断 payload 引用是否可接受 | `payload_ref` 为正文引用 | `bool` | 只验证引用形态 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `PayloadBoundaryGuard::default_for_bus() -> PayloadBoundaryGuard` | 创建 bus 默认禁止正文守卫 | 无 | `PayloadBoundaryGuard` | P0 默认配置 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不解析 payload body | guard 只检查边界 |
| 不替代认证授权 | actor 和权限由外层可信入口或治理引用提供 |
| raw secret 不得通过 | secret 只能以 reference 形式出现 |

### 7.4 `domain/delivery.rs` 对象实现契约

#### 7.4.1 `DeliveryStatus`

##### 类型定义

```rust
/// Delivery 生命周期状态集合。
///
/// 该枚举只表达 bus 拥有的 delivery truth 状态，不表达后端产品原始状态或订阅方业务状态。
pub enum DeliveryStatus {
    /// Delivery 已计划，尚未开始投递。
    Scheduled,

    /// Delivery 正在交给后端传输能力推进。
    Dispatching,

    /// Delivery 已到达订阅方或等待反馈。
    Delivered,

    /// Delivery 投递或反馈失败，等待恢复判断。
    Failed,

    /// Delivery 已进入死信，后续只能通过受控恢复链处理。
    DeadLettered,

    /// Delivery 已完成，是正常终止状态。
    Completed,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Scheduled` | `/// Delivery 已计划，尚未开始投递。` | 初始投递计划 | 新建对象 / retry | `Dispatching` / `Failed` |
| `Dispatching` | `/// Delivery 正在交给后端传输能力推进。` | 后端投递中 | `Scheduled` | `Delivered` / `Failed` |
| `Delivered` | `/// Delivery 已到达订阅方或等待反馈。` | 等待反馈 | `Dispatching` | `Completed` / `Failed` |
| `Failed` | `/// Delivery 投递或反馈失败，等待恢复判断。` | 失败候选 | `Scheduled` / `Dispatching` / `Delivered` | `Scheduled` / `DeadLettered` |
| `DeadLettered` | `/// Delivery 已进入死信，后续只能通过受控恢复链处理。` | 死信终止 / 恢复前置 | `Failed` | 终止 |
| `Completed` | `/// Delivery 已完成，是正常终止状态。` | 正常终止 | `Delivered` | 终止 |

#### 7.4.2 `DeliveryRecord`

##### 类型定义

```rust
/// Delivery 真相记录，保存 bus 拥有的投递状态、目标订阅方和尝试摘要。
///
/// 该对象维护 delivery 状态不变量，不直接调用 MQ SDK，也不保存订阅方业务结果正文。
pub struct DeliveryRecord {
    /// Delivery 唯一标识。
    pub delivery_id: DeliveryId,

    /// 关联的发布材料标识。
    pub publication_id: PublicationId,

    /// 目标订阅方引用。
    pub subscriber_ref: SubscriberRef,

    /// 当前 delivery 生命周期状态。
    pub status: DeliveryStatus,

    /// 已发生的投递尝试次数。
    pub attempt_count: AttemptCount,

    /// bus 级 delivery 幂等键。
    pub idempotency_key: IdempotencyKey,

    /// 最近一次投递尝试引用。
    pub last_attempt_ref: Option<DeliveryAttemptRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `delivery_id` | `DeliveryId` | 标识一次 delivery | 系统生成 |
| `publication_id` | `PublicationId` | 关联发布材料 | 必须来自 accepted publication |
| `subscriber_ref` | `SubscriberRef` | 标识目标订阅方 | 不保存订阅方业务模型 |
| `status` | `DeliveryStatus` | 表达 delivery truth 状态 | 只能经成员函数改变 |
| `attempt_count` | `AttemptCount` | 记录尝试次数 | 不得小于已保存 attempt 数 |
| `idempotency_key` | `IdempotencyKey` | 支撑 bus 级幂等 | 不得由 payload body 推导 |
| `last_attempt_ref` | `Option<DeliveryAttemptRef>` | 指向最近投递尝试 | 仅引用，不保存后端正文 |

##### 成员函数

阶段落地约束：

- PH-03 / commit-03-a 只落地 `start_attempt(...)`、`mark_delivered(...)`、`mark_failed(...)` 和 `can_transition_to(...)`，用于支撑 `RunDeliveryProgressionFlow` 推进到 `Delivered / Failed`。
- `mark_completed(FeedbackResult feedback, ActorContext actor)` 归 PH-05 / commit-05-a 的 `RecordDeliveryFeedbackFlow`，不得作为 PH-03 delivery domain API 或测试前置。

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `start_attempt(&mut self, BackendCapabilityRef capability_ref, Timestamp occurred_at) -> Result<DeliveryAttempt, DomainError>` | 开始一次投递尝试 | `capability_ref` 为后端能力引用 | `Result<DeliveryAttempt, DomainError>` | 仅允许 `Scheduled -> Dispatching` |
| `mark_delivered(&mut self, DeliveryAttempt attempt, ActorContext actor) -> Result<(), DomainError>` | 标记投递到达 | `attempt` 为已结束尝试 | `Result<(), DomainError>` | 仅允许 `Dispatching -> Delivered` |
| `mark_failed(&mut self, FailureReason reason, ActorContext actor) -> Result<(), DomainError>` | 标记投递失败 | `reason` 为失败原因 | `Result<(), DomainError>` | 允许进入 `Failed`，必须由 application 写 history / audit |
| `mark_completed(&mut self, FeedbackResult feedback, ActorContext actor) -> Result<(), DomainError>` | 根据 ack 反馈标记完成 | `feedback` 必须为成功反馈 | `Result<(), DomainError>` | 仅允许 `Delivered -> Completed` |
| `can_transition_to(&self, DeliveryStatus target_status) -> bool` | 判断是否允许迁移 | `target_status` 为目标状态 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DeliveryRecord::schedule(TransportSemantic semantic, SubscriberRef subscriber_ref, IdempotencyKey key) -> Result<DeliveryRecord, DomainError>` | 基于传递语义创建 scheduled delivery | `semantic` 必须需要 durable record | `Result<DeliveryRecord, DomainError>` | delivery progression |
| `DeliveryRecord::rehydrate(PersistedDeliveryRecord row) -> Result<DeliveryRecord, DomainError>` | 从持久化记录重建 | `row` 为持久化行 | `Result<DeliveryRecord, DomainError>` | repository 读取 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存订阅方业务结果正文 | 只保存 bus 级状态和引用 |
| 不直接调用 MQ SDK | 后端调用必须经 `TransportBackendPort` |
| `Completed` 后不得重新 dispatch | replay 必须走 `ReplayPreparation` |
| 状态变化必须留 history / audit | application 负责同事务写入 |

#### 7.4.3 `DeliveryAttempt`

##### 类型定义

```rust
/// 单次 delivery 投递尝试记录。
///
/// 该对象保存尝试编号、后端投递引用和时间边界，不拥有 delivery 最终状态。
pub struct DeliveryAttempt {
    /// 投递尝试唯一标识。
    pub attempt_id: DeliveryAttemptId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 该 delivery 下的尝试序号。
    pub attempt_no: AttemptNo,

    /// 后端投递结果引用，不包含后端完整私有响应正文。
    pub backend_ref: Option<BackendDeliveryRef>,

    /// 尝试开始时间。
    pub started_at: Timestamp,

    /// 尝试结束时间。
    pub finished_at: Option<Timestamp>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `attempt_id` | `DeliveryAttemptId` | 标识一次投递尝试 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须来自 `DeliveryRecord` |
| `attempt_no` | `AttemptNo` | 表示第几次尝试 | 必须递增 |
| `backend_ref` | `Option<BackendDeliveryRef>` | 关联后端投递引用 | 不保存后端响应正文 |
| `started_at` | `Timestamp` | 尝试开始时间 | 必须存在 |
| `finished_at` | `Option<Timestamp>` | 尝试结束时间 | 结束后必须不早于 `started_at` |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `finish(&mut self, BackendDeliveryResult result, Timestamp occurred_at) -> Result<(), DomainError>` | 记录后端投递归一化结果 | `result` 为后端归一化结果 | `Result<(), DomainError>` | 设置 `backend_ref` 和 `finished_at` |
| `is_finished(&self) -> bool` | 判断尝试是否结束 | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DeliveryAttempt::start(DeliveryId delivery_id, AttemptNo attempt_no, Timestamp started_at) -> DeliveryAttempt` | 创建投递尝试 | `attempt_no` 为递增序号 | `DeliveryAttempt` | `DeliveryRecord::start_attempt` |
| `DeliveryAttempt::rehydrate(PersistedDeliveryAttempt row) -> Result<DeliveryAttempt, DomainError>` | 从持久化记录重建 | `row` 为持久化行 | `Result<DeliveryAttempt, DomainError>` | repository 读取 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存后端完整私有响应正文 | 只保存 `BackendDeliveryRef` 或归一化结果引用 |
| 不改变 delivery 最终状态 | 状态由 `DeliveryRecord` 控制 |
| attempt 序号必须递增 | 不允许覆盖历史尝试 |

#### 7.4.4 `DeliveryLifecycle`

##### 类型定义

```rust
/// Delivery 状态迁移策略。
///
/// 该策略集中判断 delivery 状态迁移是否合法，防止 worker 或 adapter 直接改写状态。
pub struct DeliveryLifecycle {
    /// 允许迁移规则引用。
    pub allowed_transitions_ref: DeliveryTransitionRuleRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `allowed_transitions_ref` | `DeliveryTransitionRuleRef` | 指向允许迁移规则 | 来自默认规则或配置引用 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_transition(&self, DeliveryStatus from_status, DeliveryStatus to_status) -> bool` | 判断状态迁移是否允许 | `from_status` / `to_status` 为状态对 | `bool` | 不修改对象 |
| `rejects_reopen(&self, DeliveryRecord delivery) -> bool` | 判断是否拒绝重新打开终止状态 | `delivery` 为目标记录 | `bool` | 保护 `Completed` / `DeadLettered` |
| `requires_history(&self, DeliveryStatus from_status, DeliveryStatus to_status) -> bool` | 判断迁移是否必须写 history | `from_status` / `to_status` 为状态对 | `bool` | 不写 history，由 application 执行 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DeliveryLifecycle::default_for_bus() -> DeliveryLifecycle` | 创建默认 delivery 状态规则 | 无 | `DeliveryLifecycle` | P0 默认 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 delivery 当前状态 | 当前状态保存在 `DeliveryRecord` |
| 不根据后端裸状态直接迁移 | 后端状态必须先归一化 |
| 不写 repository | policy 只判断，不持久化 |

### 7.5 `domain/feedback.rs` 对象实现契约

#### 7.5.1 `FeedbackStatus`

##### 类型定义

```rust
/// Bus 级反馈状态集合。
///
/// 该枚举只表达 delivery 反馈在 bus 层的归一化结果，不表达订阅方业务处理细节。
pub enum FeedbackStatus {
    /// 订阅方确认处理成功。
    Ack,

    /// 订阅方或投递链路返回失败。
    Fail,

    /// Delivery 超过允许等待时间。
    Timeout,

    /// 重复 delivery 或重复 feedback 被识别。
    Duplicate,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Ack` | `/// 订阅方确认处理成功。` | 成功反馈 | 外部反馈 / 后端信号 | 终止 |
| `Fail` | `/// 订阅方或投递链路返回失败。` | 失败反馈 | 外部反馈 / 后端信号 | 终止 |
| `Timeout` | `/// Delivery 超过允许等待时间。` | 超时反馈 | timeout signal | 终止 |
| `Duplicate` | `/// 重复 delivery 或重复 feedback 被识别。` | 幂等命中 | 幂等检查 | 终止 |

#### 7.5.2 `FeedbackResult`

##### 类型定义

```rust
/// Bus 级反馈结果，表达 ack、fail、timeout 或 duplicate 的归一化事实。
///
/// 该对象不保存订阅方业务结果正文，也不生成治理决策。
pub struct FeedbackResult {
    /// 反馈唯一标识。
    pub feedback_id: FeedbackId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 反馈状态。
    pub status: FeedbackStatus,

    /// 失败、超时或重复原因。
    pub reason: Option<FeedbackReason>,

    /// 反馈接收时间。
    pub received_at: Timestamp,

    /// 反馈发起者或系统 actor。
    pub actor: ActorContext,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `feedback_id` | `FeedbackId` | 标识一次反馈 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须存在 |
| `status` | `FeedbackStatus` | 表达反馈结果 | 工厂函数决定 |
| `reason` | `Option<FeedbackReason>` | 记录失败 / 超时 / 重复原因 | `Ack` 可为空，其他状态应有原因 |
| `received_at` | `Timestamp` | 反馈接收时间 | 必须存在 |
| `actor` | `ActorContext` | 反馈 actor | 外部可信入口或系统 actor |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_success(&self) -> bool` | 判断是否为成功反馈 | 无 | `bool` | 仅 `Ack` 为 true |
| `is_failure(&self) -> bool` | 判断是否进入失败恢复候选 | 无 | `bool` | `Fail` / `Timeout` 为 true |
| `is_duplicate(&self) -> bool` | 判断是否为重复反馈 | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `FeedbackResult::ack(DeliveryId delivery_id, ActorContext actor, Timestamp received_at) -> FeedbackResult` | 创建 ack 反馈 | `delivery_id` 为目标 delivery | `FeedbackResult` | `RecordDeliveryFeedback` |
| `FeedbackResult::fail(DeliveryId delivery_id, FeedbackReason reason, ActorContext actor, Timestamp received_at) -> FeedbackResult` | 创建 fail 反馈 | `reason` 为失败原因 | `FeedbackResult` | 订阅方 fail |
| `FeedbackResult::timeout(DeliveryId delivery_id, TimeoutReason reason, Timestamp received_at) -> FeedbackResult` | 创建 timeout 反馈 | `reason` 为超时原因 | `FeedbackResult` | timeout signal |
| `FeedbackResult::duplicate(DeliveryId delivery_id, IdempotencyKey key, Timestamp received_at) -> FeedbackResult` | 创建 duplicate 反馈 | `key` 为幂等键 | `FeedbackResult` | 幂等命中 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不表达订阅方业务补偿 | 只表达 bus 级反馈 |
| 不生成治理决策 | failure 只进入 failure material / recovery |
| duplicate 不改变既有 delivery truth | application 返回既有结果或 duplicate receipt |

#### 7.5.3 `IdempotencyAnchor`

##### 类型定义

```rust
/// Bus 级幂等锚点，用于识别重复 publication、delivery 或 feedback。
///
/// 该对象只处理 bus 层重复识别，不接管订阅方业务副作用幂等。
pub struct IdempotencyAnchor {
    /// 幂等锚点唯一标识。
    pub anchor_id: IdempotencyAnchorId,

    /// 幂等作用域。
    pub scope: IdempotencyScope,

    /// 幂等键。
    pub key: IdempotencyKey,

    /// 已绑定的处理记录引用。
    pub bound_record_ref: RecordRef,

    /// 锚点创建时间。
    pub created_at: Timestamp,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `anchor_id` | `IdempotencyAnchorId` | 标识幂等锚点 | 系统生成 |
| `scope` | `IdempotencyScope` | 区分 publication / delivery / feedback 等作用域 | 同 key 不同 scope 不冲突 |
| `key` | `IdempotencyKey` | 幂等键 | 不得由 payload body 直接生成 |
| `bound_record_ref` | `RecordRef` | 指向已处理记录 | append-only |
| `created_at` | `Timestamp` | 创建时间 | 必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `matches(&self, IdempotencyKey key) -> bool` | 判断 key 是否匹配 | `key` 为待检查幂等键 | `bool` | 不修改对象 |
| `is_bound_to(&self, RecordRef record_ref) -> bool` | 判断是否绑定某记录 | `record_ref` 为记录引用 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `IdempotencyAnchor::bind(IdempotencyScope scope, IdempotencyKey key, RecordRef record_ref, Timestamp created_at) -> IdempotencyAnchor` | 创建并绑定幂等锚点 | `scope` / `key` / `record_ref` 共同确定锚点 | `IdempotencyAnchor` | command / consumer 幂等落库 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不接管业务副作用幂等 | 订阅方业务幂等由订阅方负责 |
| 不使用 payload body 作为依据 | 使用 key、引用和 trace |
| 绑定后不可改写 | 防止重复请求改变既有结果 |

#### 7.5.4 `DeliveryHistoryEntry`

##### 类型定义

```rust
/// Delivery 生命周期历史条目。
///
/// 该对象是 append-only 记录，用于审计和恢复链，不覆盖 `DeliveryRecord` 当前状态。
pub struct DeliveryHistoryEntry {
    /// 历史条目唯一标识。
    pub history_id: DeliveryHistoryId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 迁移前状态。
    pub from_status: DeliveryStatus,

    /// 迁移后状态。
    pub to_status: DeliveryStatus,

    /// 迁移原因。
    pub reason: HistoryReason,

    /// 发生时间。
    pub occurred_at: Timestamp,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `history_id` | `DeliveryHistoryId` | 标识历史条目 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须存在 |
| `from_status` | `DeliveryStatus` | 原状态 | 必须符合状态迁移矩阵 |
| `to_status` | `DeliveryStatus` | 目标状态 | 必须符合状态迁移矩阵 |
| `reason` | `HistoryReason` | 迁移原因 | 不保存业务正文 |
| `occurred_at` | `Timestamp` | 发生时间 | 必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `describes_transition(&self, DeliveryStatus from_status, DeliveryStatus to_status) -> bool` | 判断是否描述某次迁移 | `from_status` / `to_status` 为状态对 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DeliveryHistoryEntry::transition(DeliveryId delivery_id, DeliveryStatus from_status, DeliveryStatus to_status, HistoryReason reason, Timestamp occurred_at) -> DeliveryHistoryEntry` | 创建状态迁移历史 | 参数描述一次迁移 | `DeliveryHistoryEntry` | 状态变化同事务写入 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改既有历史 |
| 不覆盖当前状态 | 当前状态在 `DeliveryRecord` |
| 关键状态变化必须留 history | recovery 和 replay 依赖历史链 |

### 7.6 `domain/recovery.rs` 对象实现契约

#### 7.6.1 `RetryPlanStatus`

##### 类型定义

```rust
/// 重试计划状态集合。
///
/// 该枚举表达失败 delivery 的重试计划是否仍可执行。
pub enum RetryPlanStatus {
    /// 重试已计划，等待下一次尝试。
    Scheduled,

    /// 重试次数已经耗尽，需要进入 dead-letter 判断。
    Exhausted,

    /// 重试计划已被取消，不得继续派发。
    Cancelled,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Scheduled` | `/// 重试已计划，等待下一次尝试。` | 初始可重试 | 新建对象 | `Exhausted` / `Cancelled` |
| `Exhausted` | `/// 重试次数已经耗尽，需要进入 dead-letter 判断。` | 重试耗尽 | `Scheduled` | 终止 |
| `Cancelled` | `/// 重试计划已被取消，不得继续派发。` | 取消重试 | `Scheduled` | 终止 |

#### 7.6.2 `RetryPlan`

##### 类型定义

```rust
/// 失败 delivery 的重试计划。
///
/// 该对象表达下一次重试时间、剩余次数和状态，不直接执行投递。
pub struct RetryPlan {
    /// 重试计划唯一标识。
    pub retry_plan_id: RetryPlanId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 下一次尝试时间。
    pub next_attempt_at: Timestamp,

    /// 剩余重试次数。
    pub remaining_attempts: AttemptCount,

    /// 当前重试计划状态。
    pub status: RetryPlanStatus,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `retry_plan_id` | `RetryPlanId` | 标识重试计划 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须处于失败恢复候选 |
| `next_attempt_at` | `Timestamp` | 下次尝试时间 | 必须来自策略计算 |
| `remaining_attempts` | `AttemptCount` | 剩余次数 | 不得为负 |
| `status` | `RetryPlanStatus` | 重试计划状态 | 只能经成员函数改变 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_exhausted(&mut self, ActorContext actor) -> Result<(), DomainError>` | 标记重试耗尽 | `actor` 为操作者或系统 actor | `Result<(), DomainError>` | 仅允许 `Scheduled -> Exhausted` |
| `cancel(&mut self, ActorContext actor, RecoveryReason reason) -> Result<(), DomainError>` | 取消重试计划 | `reason` 为取消原因 | `Result<(), DomainError>` | 仅允许 `Scheduled -> Cancelled` |
| `has_remaining_attempts(&self) -> bool` | 判断是否仍可重试 | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `RetryPlan::create(DeliveryRecord delivery, FailureReason reason, RetryPolicyRef policy_ref, Timestamp now) -> Result<RetryPlan, DomainError>` | 基于失败 delivery 创建重试计划 | `policy_ref` 指向重试策略 | `Result<RetryPlan, DomainError>` | `RequestRetry` / retry cycle |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不直接执行投递 | retry dispatch 由 application / worker 调用 |
| 耗尽后必须进入 DLQ 判断 | 不能静默丢弃失败 |
| 不保存完整 retry 算法正文 | 参数细节由配置和策略引用承接 |

#### 7.6.3 `DeadLetterStatus`

##### 类型定义

```rust
/// 死信条目处置状态集合。
///
/// 该枚举表达 DLQ 条目是否待处理、审查中或已经关闭。
pub enum DeadLetterStatus {
    /// 死信条目已打开，等待处理。
    Open,

    /// 死信条目正在审查。
    Reviewing,

    /// 死信条目已关闭。
    Closed,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | `/// 死信条目已打开，等待处理。` | 初始死信状态 | 新建对象 | `Reviewing` / `Closed` |
| `Reviewing` | `/// 死信条目正在审查。` | 审查中 | `Open` | `Closed` |
| `Closed` | `/// 死信条目已关闭。` | 终止状态 | `Open` / `Reviewing` | 终止 |

#### 7.6.4 `DeadLetterEntry`

##### 类型定义

```rust
/// 死信条目，表达进入 DLQ 的失败材料和可信追溯链。
///
/// 该对象必须关联 delivery history 和 audit chain，不能直接触发 replay。
pub struct DeadLetterEntry {
    /// 死信条目唯一标识。
    pub dead_letter_id: DeadLetterId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 失败原因。
    pub failure_reason: FailureReason,

    /// 关联 delivery 历史引用。
    pub history_ref: DeliveryHistoryRef,

    /// 关联审计链引用。
    pub audit_chain_ref: AuditChainRef,

    /// 当前死信处置状态。
    pub status: DeadLetterStatus,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `dead_letter_id` | `DeadLetterId` | 标识死信条目 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须已失败 |
| `failure_reason` | `FailureReason` | 记录失败原因 | 不保存 payload body |
| `history_ref` | `DeliveryHistoryRef` | 关联历史链 | 必须存在 |
| `audit_chain_ref` | `AuditChainRef` | 关联审计链 | 必须存在 |
| `status` | `DeadLetterStatus` | 死信处置状态 | 只能经成员函数改变 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `start_review(&mut self, ActorContext actor) -> Result<(), DomainError>` | 标记进入审查 | `actor` 为操作者 | `Result<(), DomainError>` | 仅允许 `Open -> Reviewing` |
| `close(&mut self, ActorContext actor, CloseReason reason) -> Result<(), DomainError>` | 关闭死信 | `reason` 为关闭原因 | `Result<(), DomainError>` | 进入 `Closed` |
| `has_trusted_chain(&self) -> bool` | 判断是否具备可信链 | 无 | `bool` | 检查 history 和 audit 引用 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `DeadLetterEntry::from_failed_delivery(DeliveryRecord delivery, FailureMaterial material, AuditChainRef audit_chain_ref) -> Result<DeadLetterEntry, DomainError>` | 从失败 delivery 创建死信 | `material` 为失败材料 | `Result<DeadLetterEntry, DomainError>` | `MoveDeliveryToDeadLetter` |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 必须具备 history / audit chain | replay preparation 依赖可信链 |
| 不直接触发 replay | replay 必须通过 `ReplayPreparation` |
| 不保存业务正文 | 只保存引用和失败摘要 |

#### 7.6.5 `ReplayPreparationStatus`

##### 类型定义

```rust
/// Replay preparation 状态集合。
///
/// 该枚举表达重放准备材料是否仍为草稿、已就绪、被拒绝或被替代。
pub enum ReplayPreparationStatus {
    /// 重放准备材料仍是草稿，不能执行 replay。
    Draft,

    /// 重放准备材料已满足前置条件，可以进入后续 replay 执行边界。
    Ready,

    /// 重放准备被拒绝。
    Rejected,

    /// 重放准备被新的准备材料替代。
    Superseded,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | `/// 重放准备材料仍是草稿，不能执行 replay。` | 初始准备 | 新建对象 | `Ready` / `Rejected` / `Superseded` |
| `Ready` | `/// 重放准备材料已满足前置条件，可以进入后续 replay 执行边界。` | 可进入 replay | `Draft` | 终止 |
| `Rejected` | `/// 重放准备被拒绝。` | 拒绝重放 | `Draft` | 终止 |
| `Superseded` | `/// 重放准备被新的准备材料替代。` | 被替代 | `Draft` | 终止 |

#### 7.6.6 `ReplayPreparation`

##### 类型定义

```rust
/// Replay 前置准备材料。
///
/// 该对象必须从 dead-letter 派生，并保存审计链和外部批准引用。
pub struct ReplayPreparation {
    /// 重放准备唯一标识。
    pub replay_id: ReplayPreparationId,

    /// 关联的死信条目。
    pub dead_letter_id: DeadLetterId,

    /// 当前重放准备状态。
    pub status: ReplayPreparationStatus,

    /// 关联审计链引用。
    pub audit_chain_ref: AuditChainRef,

    /// 外部允许重放的批准引用。
    pub approval_ref: Option<ReplayApprovalRef>,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `replay_id` | `ReplayPreparationId` | 标识重放准备 | 系统生成 |
| `dead_letter_id` | `DeadLetterId` | 关联死信条目 | 必须存在 |
| `status` | `ReplayPreparationStatus` | 准备状态 | 只能经成员函数改变 |
| `audit_chain_ref` | `AuditChainRef` | 审计链引用 | 必须存在 |
| `approval_ref` | `Option<ReplayApprovalRef>` | 外部批准引用 | `Ready` 时必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_ready(&mut self, ReplayApprovalRef approval_ref, ActorContext actor) -> Result<(), DomainError>` | 标记重放准备就绪 | `approval_ref` 为外部批准引用 | `Result<(), DomainError>` | 仅允许 `Draft -> Ready` |
| `reject(&mut self, ReplayRejectReason reason, ActorContext actor) -> Result<(), DomainError>` | 拒绝重放准备 | `reason` 为拒绝原因 | `Result<(), DomainError>` | 仅允许 `Draft -> Rejected` |
| `requires_trusted_chain(&self) -> bool` | 声明必须具备可信链 | 无 | `bool` | P0 固定为 true |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReplayPreparation::prepare(DeadLetterEntry entry, ActorContext actor) -> Result<ReplayPreparation, DomainError>` | 从死信创建重放准备 | `entry` 必须具备可信链 | `Result<ReplayPreparation, DomainError>` | `PrepareReplay` |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不绕过 dead-letter | 不能从普通 failed delivery 直接 replay |
| 不生成治理决策 | 只保存 `ReplayApprovalRef` |
| `Ready` 必须有 approval ref | 防止无授权重放 |

#### 7.6.7 `FailureMaterial`

##### 类型定义

```rust
/// Bus 失败事实材料，供治理、运维或观测方只读消费。
///
/// 该对象不是治理决策，不保存 payload body，只保存失败事实引用和审计引用。
pub struct FailureMaterial {
    /// 失败材料唯一标识。
    pub failure_material_id: FailureMaterialId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 失败原因。
    pub failure_reason: FailureReason,

    /// 可选死信引用。
    pub dead_letter_ref: Option<DeadLetterRef>,

    /// 关联审计引用。
    pub audit_ref: AuditRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `failure_material_id` | `FailureMaterialId` | 标识失败材料 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须存在 |
| `failure_reason` | `FailureReason` | 记录失败原因 | 不保存业务正文 |
| `dead_letter_ref` | `Option<DeadLetterRef>` | 关联死信条目 | 进入 DLQ 后非空 |
| `audit_ref` | `AuditRef` | 关联审计条目 | 必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_governance_decision(&self) -> bool` | 明确该对象不是治理决策 | 无 | `bool` | 必须返回 false |
| `has_dead_letter(&self) -> bool` | 判断是否已关联死信 | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `FailureMaterial::from_feedback(FeedbackResult feedback, DeliveryHistoryEntry history, AuditRef audit_ref) -> Result<FailureMaterial, DomainError>` | 从失败反馈和历史创建失败材料 | `feedback` 必须为失败类反馈 | `Result<FailureMaterial, DomainError>` | feedback failure |
| `FailureMaterial::from_dead_letter(DeadLetterEntry entry, BusAuditEntry audit) -> Result<FailureMaterial, DomainError>` | 从死信和审计创建失败材料 | `entry` 为死信条目 | `Result<FailureMaterial, DomainError>` | DLQ output |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不是 governance decision | governance 只能消费该材料 |
| 不保存 payload body | 只保存失败原因和引用 |
| 必须可审计 | `audit_ref` 必须存在 |

#### 7.6.8 `RecoveryEligibilityPolicy`

##### 类型定义

```rust
/// 恢复允许性策略，判断 retry、dead-letter 和 replay preparation 是否允许。
///
/// 该策略只做允许性判断，不直接执行恢复动作。
pub struct RecoveryEligibilityPolicy {
    /// 恢复策略引用。
    pub policy_ref: RecoveryPolicyRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `policy_ref` | `RecoveryPolicyRef` | 指向恢复策略口径 | 来自配置引用或默认策略 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `can_retry(&self, DeliveryRecord delivery, RetryPlan plan) -> bool` | 判断是否允许 retry | `delivery` 为失败 delivery，`plan` 为重试计划 | `bool` | 不执行投递 |
| `can_dead_letter(&self, DeliveryRecord delivery, FailureMaterial material) -> bool` | 判断是否允许进入 DLQ | `material` 为失败材料 | `bool` | 不创建死信 |
| `can_prepare_replay(&self, DeadLetterEntry entry, AuditChainRef audit_chain_ref) -> bool` | 判断是否允许 replay preparation | `entry` 必须有可信链 | `bool` | 不执行 replay |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `RecoveryEligibilityPolicy::from_config(RecoveryPolicyConfigRef config_ref) -> RecoveryEligibilityPolicy` | 从配置引用创建恢复策略 | `config_ref` 为配置引用 | `RecoveryEligibilityPolicy` | runtime builder 注入 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不直接执行恢复 | 只判断允许性 |
| replay 必须检查 audit chain | 防止无可信链重放 |
| 不读取治理决策正文 | 只使用 approval / policy reference |

### 7.7 `domain/read_output.rs` 对象实现契约

#### 7.7.1 `BusAuditEntry`

##### 类型定义

```rust
/// Bus 审计条目，记录发布、delivery、feedback、recovery 和 projection 的关键动作。
///
/// 该对象 append-only，不保存业务正文，只保存 subject、actor、动作、时间和 trace 引用。
pub struct BusAuditEntry {
    /// 审计条目唯一标识。
    pub audit_id: AuditEntryId,

    /// 被审计对象引用。
    pub subject_ref: SubjectRef,

    /// 审计动作。
    pub action: AuditAction,

    /// 操作者或系统 actor。
    pub actor: ActorContext,

    /// 发生时间。
    pub occurred_at: Timestamp,

    /// 跨仓 trace 引用。
    pub trace_ref: TraceContextRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `audit_id` | `AuditEntryId` | 标识审计条目 | 系统生成 |
| `subject_ref` | `SubjectRef` | 关联被审计对象 | 必须为引用 |
| `action` | `AuditAction` | 表达审计动作 | 不保存动作正文 |
| `actor` | `ActorContext` | 操作者或系统 actor | 可信入口传入 |
| `occurred_at` | `Timestamp` | 发生时间 | 必须存在 |
| `trace_ref` | `TraceContextRef` | trace 关联 | 必须可追溯 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_for_subject(&self, SubjectRef subject_ref) -> bool` | 判断审计条目是否属于某对象 | `subject_ref` 为目标引用 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `BusAuditEntry::record(SubjectRef subject_ref, AuditAction action, ActorContext actor, TraceContextRef trace_ref, Timestamp occurred_at) -> BusAuditEntry` | 创建审计条目 | 参数描述一次审计动作 | `BusAuditEntry` | 关键状态变化和输出派生 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| append-only | 不修改既有审计 |
| 不保存业务正文 | 只保存引用和动作 |
| 关键状态变化必须有审计 | application 同事务写入 |

#### 7.7.2 `ProjectionStatus`

##### 类型定义

```rust
/// 只读投影状态集合。
///
/// 该枚举表达 projection 是否可读、过期或正在构建，不影响 bus truth。
pub enum ProjectionStatus {
    /// 投影正在构建，通常不能作为稳定查询结果。
    Building,

    /// 投影可被正常查询。
    Active,

    /// 投影落后于 bus truth，查询必须返回一致性标记。
    Stale,

    /// 投影正在重建。
    Rebuilding,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Building` | `/// 投影正在构建，通常不能作为稳定查询结果。` | 初始构建 | 新建对象 | `Active` / `Stale` |
| `Active` | `/// 投影可被正常查询。` | 可读 | `Building` / `Rebuilding` | `Stale` |
| `Stale` | `/// 投影落后于 bus truth，查询必须返回一致性标记。` | 过期 | `Active` | `Rebuilding` |
| `Rebuilding` | `/// 投影正在重建。` | 重建中 | `Stale` | `Active` / `Stale` |

#### 7.7.3 `TransportViewProjection`

##### 类型定义

```rust
/// 面向 SDK 或消费者的只读传递视图。
///
/// 该 projection 只能从 bus truth、history 和 audit 派生，不得反写 `DeliveryRecord`。
pub struct TransportViewProjection {
    /// 传递视图唯一标识。
    pub view_id: TransportViewId,

    /// 关联的 delivery 标识。
    pub delivery_id: DeliveryId,

    /// 当前投影状态。
    pub status: ProjectionStatus,

    /// 投影版本。
    pub version: ProjectionVersion,

    /// 来源审计引用。
    pub source_audit_ref: AuditRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `view_id` | `TransportViewId` | 标识传递视图 | 系统生成 |
| `delivery_id` | `DeliveryId` | 关联 delivery | 必须存在 |
| `status` | `ProjectionStatus` | 投影状态 | 不影响 bus truth |
| `version` | `ProjectionVersion` | 投影版本 | 单调递增 |
| `source_audit_ref` | `AuditRef` | 来源审计引用 | 必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, AuditRef source_audit_ref) -> Result<(), DomainError>` | 标记投影过期 | `source_audit_ref` 为触发过期的审计引用 | `Result<(), DomainError>` | 不反写 truth |
| `is_active(&self) -> bool` | 判断投影是否可正常查询 | 无 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `TransportViewProjection::derive(DeliveryRecord delivery, BusAuditEntry audit) -> Result<TransportViewProjection, DomainError>` | 从 delivery 和审计派生视图 | `audit` 为来源审计 | `Result<TransportViewProjection, DomainError>` | read output 更新 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不反写 `DeliveryRecord` | projection 只读派生 |
| 不作为 SDK client | SDK 体验属于 `L0-sdk` |
| stale 查询必须带一致性标记 | 不得伪装为 active |

#### 7.7.4 `FailureSummaryProjection`

##### 类型定义

```rust
/// 面向 governance 或 operator 的只读失败摘要。
///
/// 该 projection 是失败事实摘要，不是 governance decision。
pub struct FailureSummaryProjection {
    /// 失败摘要唯一标识。
    pub summary_id: FailureSummaryId,

    /// 来源失败材料标识。
    pub failure_material_id: FailureMaterialId,

    /// 当前投影状态。
    pub status: ProjectionStatus,

    /// 可选来源死信引用。
    pub source_dead_letter_ref: Option<DeadLetterRef>,

    /// 来源审计引用。
    pub source_audit_ref: AuditRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `summary_id` | `FailureSummaryId` | 标识失败摘要 | 系统生成 |
| `failure_material_id` | `FailureMaterialId` | 关联失败材料 | 必须存在 |
| `status` | `ProjectionStatus` | 投影状态 | 不影响 bus truth |
| `source_dead_letter_ref` | `Option<DeadLetterRef>` | 来源死信引用 | 仅 DLQ 后非空 |
| `source_audit_ref` | `AuditRef` | 来源审计引用 | 必须存在 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `mark_stale(&mut self, AuditRef source_audit_ref) -> Result<(), DomainError>` | 标记摘要过期 | `source_audit_ref` 为来源审计 | `Result<(), DomainError>` | 不反写 truth |
| `is_governance_decision(&self) -> bool` | 明确该对象不是治理决策 | 无 | `bool` | 必须返回 false |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `FailureSummaryProjection::derive(FailureMaterial material, BusAuditEntry audit) -> Result<FailureSummaryProjection, DomainError>` | 从失败材料和审计派生摘要 | `material` 为失败材料 | `Result<FailureSummaryProjection, DomainError>` | failure summary 更新 |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不是 governance decision | governance 只消费该摘要 |
| 不保存 payload body | 只保存失败材料引用 |
| 不反写 recovery truth | projection 写失败不得撤销 truth |

#### 7.7.5 `ReadOnlyOutputPolicy`

##### 类型定义

```rust
/// 只读输出策略，约束 projection 和 read material 不得反写 bus truth。
///
/// 该策略只判断输出写入是否仍属于只读派生边界。
pub struct ReadOnlyOutputPolicy {
    /// 只读输出策略引用。
    pub policy_ref: ReadOnlyPolicyRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `policy_ref` | `ReadOnlyPolicyRef` | 指向只读输出策略口径 | 默认策略或配置引用 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `allows_projection_write(&self, ProjectionWriteIntent intent) -> bool` | 判断写入是否只影响 projection | `intent` 为写入意图 | `bool` | 不执行写入 |
| `rejects_truth_write(&self, ProjectionWriteIntent intent) -> bool` | 判断是否试图反写真相 | `intent` 为写入意图 | `bool` | 必须拒绝 truth write |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `ReadOnlyOutputPolicy::default_for_projection() -> ReadOnlyOutputPolicy` | 创建默认只读输出策略 | 无 | `ReadOnlyOutputPolicy` | read output service |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不修改 bus truth | 只读输出只影响 projection / view |
| 不承担长期观测存储规则 | observability 仓负责长期存储 |
| projection 缺失不自动反写真相 | Query 返回一致性标记或触发受控 job |

### 7.8 `domain/backend.rs` 对象实现契约

#### 7.8.1 `BackendKind`

##### 类型定义

```rust
/// 后端传输能力类型。
///
/// 该枚举只表达后端种类，不保存后端连接配置或 secret。
pub enum BackendKind {
    /// 内存后端，用于 P0 默认可验证路径和测试。
    InMemory,
}
```

##### enum 变体

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `InMemory` | `/// 内存后端，用于 P0 默认可验证路径和测试。` | 默认可验证后端 | 不适用 | 不适用 |

#### 7.8.2 `BackendCapabilityRef`

##### 类型定义

```rust
/// 后端能力引用，表达后端类型、profile 和能力版本。
///
/// 该对象不保存 raw secret、连接字符串或完整后端私有配置。
pub struct BackendCapabilityRef {
    /// 后端能力唯一标识。
    pub capability_id: BackendCapabilityId,

    /// 后端类型。
    pub backend_kind: BackendKind,

    /// 后端 profile 引用。
    pub profile_ref: BackendProfileRef,

    /// 后端能力版本。
    pub capability_version: CapabilityVersion,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `capability_id` | `BackendCapabilityId` | 标识后端能力 | 系统生成或配置派生 |
| `backend_kind` | `BackendKind` | 后端类型 | P0 默认 `InMemory` |
| `profile_ref` | `BackendProfileRef` | 指向环境 profile | 不包含 secret |
| `capability_version` | `CapabilityVersion` | 能力版本 | 用于能力变化追踪 |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `is_kind(&self, BackendKind backend_kind) -> bool` | 判断后端类型 | `backend_kind` 为目标类型 | `bool` | 不读取配置正文 |
| `matches_profile(&self, BackendProfileRef profile_ref) -> bool` | 判断是否指向某 profile | `profile_ref` 为目标 profile | `bool` | 不读取 secret |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `BackendCapabilityRef::from_profile(BackendProfileRef profile_ref, BackendKind backend_kind, CapabilityVersion capability_version) -> BackendCapabilityRef` | 从 profile 引用创建能力引用 | 参数均为引用或枚举 | `BackendCapabilityRef` | runtime builder |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 不保存 raw secret | secret 只能通过 secret reference 进入 adapter |
| 不保存完整后端配置 | 配置由 Step 14 定义 |
| 不表达 bus truth 状态 | 能力变化进入 audit / view / event |

#### 7.8.3 `BackendCapabilityPolicy`

##### 类型定义

```rust
/// 后端能力映射策略，判断平台传递语义是否可映射到后端能力。
///
/// 该策略防止后端裸参数或后端差异泄漏成平台级传递语义。
pub struct BackendCapabilityPolicy {
    /// 被判断的后端能力引用。
    pub capability_ref: BackendCapabilityRef,
}
```

##### 成员变量

| 字段 | 类型 | 作用 | 约束 |
|---|---|---|---|
| `capability_ref` | `BackendCapabilityRef` | 指向后端能力 | 不包含 secret |

##### 成员函数

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `allows_mapping(&self, TransportSemantic semantic, BackendCapabilityRef capability_ref) -> bool` | 判断平台语义是否可映射到后端能力 | `semantic` 为平台语义，`capability_ref` 为目标能力 | `bool` | 不调用后端 |
| `rejects_raw_backend_leak(&self, TransportSemantic semantic) -> bool` | 判断是否存在后端裸参数泄漏 | `semantic` 为平台语义 | `bool` | 不修改对象 |

##### 工厂 / 静态函数

| 函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `BackendCapabilityPolicy::from_capability(BackendCapabilityRef capability_ref) -> BackendCapabilityPolicy` | 从后端能力引用创建策略 | `capability_ref` 为能力引用 | `BackendCapabilityPolicy` | delivery progression |

##### 不变量与禁止事项

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 后端差异不得改变平台语义 | 差异只能在 adapter 边界表达 |
| 不保存后端 secret | 只使用 `BackendCapabilityRef` |
| 不改变 delivery truth | 能力检查不直接迁移 delivery 状态 |

### 7.9 非 domain 模块对象承接表

| 模块 | 本 Step 结论 | 后续落点 |
|---|---|---|
| `contracts` | 不定义领域对象；只承载 DTO、Event、Job、View、Receipt、protocol error | Step 8 |
| `application` | application service 是用例编排对象，但其字段依赖 port，暂不在本 Step 展开 | Step 7 / Step 9 |
| `infra` | adapter、config、runtime builder 不是领域对象 | Step 7 / Step 11 / Step 14 |
| `api` | handler 不是领域对象 | Step 8 / Step 9 |
| `worker` | worker runner 不是领域对象 | Step 8 / Step 9 |
| `jobs` | job binary 不是领域对象 | Step 8 / Step 9 |

### 7.10 对象索引表

| 对象 / enum | 模块 | 文件 | 类型 | 后续主要引用 |
|---|---|---|---|---|
| `PublicationMaterial` | `domain` | `publication.rs` | value object / reference object | Step 8 / Step 9 |
| `PublicationAcceptanceStatus` | `domain` | `publication.rs` | status enum | Step 10 |
| `PublicationAcceptance` | `domain` | `publication.rs` | domain record | Step 9 / Step 10 |
| `DeliveryMode` | `domain` | `publication.rs` | classification enum | Step 8 / Step 14 |
| `TransportSemantic` | `domain` | `publication.rs` | value object | Step 9 |
| `PayloadBoundaryGuard` | `domain` | `publication.rs` | policy | Step 12 / Step 14 |
| `DeliveryStatus` | `domain` | `delivery.rs` | status enum | Step 10 |
| `DeliveryRecord` | `domain` | `delivery.rs` | aggregate / record | Step 9 / Step 11 |
| `DeliveryAttempt` | `domain` | `delivery.rs` | record | Step 9 / Step 11 |
| `DeliveryLifecycle` | `domain` | `delivery.rs` | policy | Step 10 |
| `FeedbackStatus` | `domain` | `feedback.rs` | status enum | Step 10 |
| `FeedbackResult` | `domain` | `feedback.rs` | record | Step 9 |
| `IdempotencyAnchor` | `domain` | `feedback.rs` | value object / record | Step 13 |
| `DeliveryHistoryEntry` | `domain` | `feedback.rs` | history record | Step 11 / Step 15 |
| `RetryPlanStatus` | `domain` | `recovery.rs` | status enum | Step 10 |
| `RetryPlan` | `domain` | `recovery.rs` | record | Step 9 / Step 11 |
| `DeadLetterStatus` | `domain` | `recovery.rs` | status enum | Step 10 |
| `DeadLetterEntry` | `domain` | `recovery.rs` | record | Step 9 / Step 11 |
| `ReplayPreparationStatus` | `domain` | `recovery.rs` | status enum | Step 10 |
| `ReplayPreparation` | `domain` | `recovery.rs` | record | Step 9 / Step 11 |
| `FailureMaterial` | `domain` | `recovery.rs` | read material / record | Step 8 / Step 15 |
| `RecoveryEligibilityPolicy` | `domain` | `recovery.rs` | policy | Step 10 / Step 12 |
| `BusAuditEntry` | `domain` | `read_output.rs` | audit record | Step 11 / Step 15 |
| `ProjectionStatus` | `domain` | `read_output.rs` | status enum | Step 10 |
| `TransportViewProjection` | `domain` | `read_output.rs` | projection | Step 8 / Step 11 |
| `FailureSummaryProjection` | `domain` | `read_output.rs` | projection | Step 8 / Step 11 |
| `ReadOnlyOutputPolicy` | `domain` | `read_output.rs` | policy | Step 12 |
| `BackendKind` | `domain` | `backend.rs` | classification enum | Step 14 |
| `BackendCapabilityRef` | `domain` | `backend.rs` | reference object | Step 7 / Step 14 |
| `BackendCapabilityPolicy` | `domain` | `backend.rs` | policy | Step 7 / Step 14 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §5 / §6 应从本文件摘录并收敛为以下结构：

```md
## 5. 模块实现契约

### 5.4 domain 模块

#### 5.4.1 模块职责

沿用 Step 5 的 `domain` 模块职责表。

#### 5.4.2 文件与代码主体映射

从 Step 4 的 `crates/domain/src/*.rs` 文件职责摘录。

#### 5.4.3 对象实现契约

从 `design-calibration/03_ddd_step_06_object_contracts.md` §7.3~§7.8 摘录。

#### 5.4.4 Trait / Port / Adapter 契约

由 Step 7 回填。

#### 5.4.5 模块内关键函数

由 Step 9 回填。

#### 5.4.6 模块错误类型

由 Step 12 回填。

#### 5.4.7 模块测试切口

由 Step 16 回填。

## 6. 全局对象 / Trait / API 索引

### 6.1 对象索引

从 `design-calibration/03_ddd_step_06_object_contracts.md` §7.10 摘录。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| `BackendKind` 是否只保留 `InMemory` | A. 只保留 `InMemory`；B. 预置 Kafka / NATS / Redis；C. 用字符串扩展 | 推荐 A | P0 只确认 in-memory default path，生产后端由后续 adapter 专项补充 |
| 状态 enum 是否在 Step 6 写完整迁移矩阵 | A. 本 Step 完整展开；B. 本 Step 写 variant 和来源 / 去向，Step 10 写矩阵；C. 只写状态名 | 推荐 B | 符合 SOP 分工，避免 Step 6 过度膨胀 |
| application service 是否也作为对象在 Step 6 展开 | A. 展开；B. 只登记，Step 9 写函数级处理流；C. 放到 Step 7 | 推荐 B | service 的核心是用例编排和 port 调用，放 Step 9 更准确 |
| `FailureMaterial.is_governance_decision()` 是否保留为函数 | A. 保留；B. 改成文档禁止事项；C. 删除 | 推荐 A | 这是强边界函数，能让实现和测试显式证明 failure material 不是 governance decision |

---

## 10. 进入下一步条件

```text
domain 模块内的领域对象、字段、函数、工厂函数、状态 enum、variant 注释和不变量已经定义。
非 domain 模块对象已明确后续落点，避免重复定义。
可以进入 Step 7,逐模块定义 Trait / Port / Adapter 契约。
```
