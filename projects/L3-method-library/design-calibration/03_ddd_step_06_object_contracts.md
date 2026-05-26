# Step 6. 逐模块定义对象实现契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节：`03-详细设计.md` §5 模块实现契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 模块实现契约主轴 | 已确认 13 个 P0 实现模块与依赖方向 |
| Step 4 实现单元与文件布局 | 已确认 6 crate Rust workspace 和 P0 必建文件树 |
| Step 3 实现约束 | Rustdoc 中文注释、完整参数类型、无统一认证、gateway 安全边界 |
| `02-概要设计.md` §6 | 已确认关键对象轮廓,但仍是概要层对象骨架 |
| `03-详细设计.md` 现有 §25~§27 | 已有对象、service、repository 契约草稿,但组织方式需要校准 |

已确认结论：

```text
Step 6 要先收稳“对象家族”和“对象卡片写法”。
每个正式对象必须能继续下沉到字段、状态、成员函数、工厂函数、不变量和禁止事项。
本步不展开 trait / port / adapter、HTTP / JSON / proto、DDL、事务处理流;这些留给 Step 7 之后。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认 P0 / P1 范围。
Step 3 已确认 Rust 契约写法和安全边界。
Step 4 已确认 workspace / crate / file tree。
Step 5 已确认模块主轴。
```

---

## 3. SOP 问题回答

1. 哪些对象必须在详细设计层独立成卡？

   回答：必须独立成卡的对象分为五组：调用上下文对象、Definition truth 对象、引用 / 证据 / 同步对象、查询 / 投影对象、P1 后置对象。它们不能继续混在全局对象大表中,否则实现者仍需在多个章节之间拼装字段和行为。

2. 每个对象应该归属于哪个实现模块？

   回答：对象归属必须承接 Step 5 的模块主轴。`MethodContent`、7 类 payload、lifecycle、version、fingerprint、reference 属于 `domain::*`;Command / Query / Event / Job DTO 属于 `contracts`;投影和 checkpoint 是 query / operations read model;repository / port 不在本步作为业务对象展开,留给 Step 7。

3. 对象实现契约最少应该包含什么？

   回答：每个对象卡片至少包含：对象摘要、成员变量表、状态集合表、成员函数表、工厂函数表、不变量 / 禁止事项。字段必须写类型和作用;函数必须写参数类型、返回类型和作用;公开对象与函数后续要转写为 Rustdoc 中文注释。

4. 哪些对象有状态集合？

   回答：`MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、`PluginLifecycle(P1)`、`ConfigurationLifecycle(P1)` 必须显式定义状态集合。`DefinitionSnapshot`、`ContentRef`、`CanonicalFingerprint`、query projection 本身不拥有业务生命周期。

5. P1 对象是否进入本步？

   回答：进入,但必须单列为 P1 后置对象。`MethodPlugin`、`MethodConfiguration`、`EffectiveContentSet` 只引用 `PublishedContentRef`,不得阻塞 P0 MethodContent 的 create / publish / event / query 主链。

6. 命名上应以哪个版本为准？

   回答：本步以当前 `03-详细设计.md` 中更明确的实现名为准：`ContentVersion`、`CanonicalFingerprint`、`ContentRef`、`PublishedContentRef`、`DefinitionSnapshot`、`DefinitionEventEnvelope`。`DefinitionVersion` / `Fingerprint` 视为概要或旧草稿中的泛称,后续回填正式文档时应统一。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §25 | 已有大量对象卡片,但按旧章节线散布 | 实现者难以看出对象家族和模块归属 |
| `03-详细设计.md` §26 | domain method、application service、validation service 混在同一章 | 对象行为和 service 编排边界容易混淆 |
| `03-详细设计.md` §27 | repository / port trait 与对象章节相邻 | 容易把 persistence port 当成业务结构体 |
| Step 5 模块表 | 仍出现 `DefinitionVersion` / `Fingerprint` 这类泛称 | 与现有详细设计里的 `ContentVersion` / `CanonicalFingerprint` 不一致 |
| snapshot 引用 | 文中同时出现 `SnapshotRef` / `SnapshotBlobRef` / `BlobRef` | 需要区分逻辑 snapshot 引用和物理 object storage 引用 |
| P1 对象 | 现有文档有 P1 卡片,但扫描时容易和 P0 主线混读 | 可能误以为 P1 plugin/configuration 是 P0 必实现前置 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象组织 | 对象散布在 §25~§27 | 先按对象家族总览,再逐对象成卡 | 让实现者先知道有哪些对象和归属 |
| 对象卡片 | 字段、函数、状态分散 | 每个对象固定“摘要 / 字段 / 状态 / 成员函数 / 工厂函数 / 禁止事项” | 支撑 1:1 转写 Rust struct / enum / impl |
| 命名 | `DefinitionVersion` / `Fingerprint` 与 `ContentVersion` / `CanonicalFingerprint` 并存 | 本步采用 `ContentVersion` / `CanonicalFingerprint` | 避免实现时出现两套 value object |
| snapshot 引用 | `SnapshotRef`、`SnapshotBlobRef`、`BlobRef` 边界不清 | 逻辑引用用 `SnapshotRef`,物理 payload 引用用 `SnapshotBlobRef` / storage ref | 避免 event/query 和 object storage 指针混用 |
| P1 表达 | P1 对象和 P0 对象连续出现 | P1 单独列为后置对象家族 | 保持 Step 2 的 P0 / P1 分离 |
| repository / port | 可能被当作对象卡片的一部分 | repository / port 留给 Step 7 | 避免把接口抽象和领域对象混写 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 保持现有 §25~§27 顺序 | 改动少 | 对象、service、port 混在一起,不符合新版详细设计主轴 | 不采用 |
| 严格按 13 个模块逐模块列对象 | 代码归属清楚 | 同一对象家族会被拆散,不利于先理解对象模型 | 局部采用,作为对象归属字段 |
| 按对象家族组织,再标注模块归属 | 能同时看清对象模型和代码落点 | 需要额外维护对象家族总表 | 采用 |
| 将 P1 对象完全删除 | P0 更纯粹 | 后续 plugin/configuration 衔接信息丢失 | 不采用 |
| 保留 P1 对象但单独后置 | 不污染 P0 主线,又保留扩展边界 | 需要每个 P1 对象明确“不得阻塞 P0” | 采用 |

---

## 7. 结构化中间产物

### 7.1 对象家族总表

| 对象家族 | 对象 | 归属模块 / 层 | 主要责任 | 本步处理 |
|---|---|---|---|---|
| 调用上下文 | `ActorContext`、`RequestMeta`、`ApprovedGateRef`、`IdempotencyRecord` | `contracts` / application reliable record | 承接 gateway 注入上下文、发布证据和幂等记录 | 独立成卡 |
| Definition truth | `MethodContent`、`MethodContentKind`、`MethodContentPayload`、7 类 payload、`MethodContentLifecycle`、`ContentVersion`、`CanonicalFingerprint` | `domain::content` / `domain::definitions` | 维护方法定义真相、生命周期、版本和语义指纹 | 独立成卡 |
| 引用与边界 | `ContentRef`、`PublishedContentRef`、`ReferenceValidationResult`、`BoundaryViolation` | `domain::content` / `domain::policies` | 约束 definition 间引用,阻断 Definition / Use 混入 | 独立成卡 |
| 证据与同步 | `AuditRecord`、`OutboxEvent`、`DefinitionSnapshot`、`SnapshotRef`、`SnapshotBlobRef`、`DefinitionEventEnvelope`、`OutboxRelayCheckpoint`、`ReplayCursor` | sync / persistence / operations | 形成 audit、snapshot、outbox、replay 可追溯链 | 独立成卡 |
| 查询与投影 | `ContentSummaryView`、`DefinitionTraceView`、`ViewProfileResolveResult`、`ContentVersionView`、`ProjectionCheckpoint` | query projection / operations | 支撑只读查询、追溯和 projection rebuild | 独立成卡 |
| P1 后置 | `MethodPlugin`、`MethodPluginItem`、`MethodConfiguration`、`EffectiveContentSet`、`PluginLifecycle`、`ConfigurationLifecycle` | P1 domain / query output | 后置打包 published definitions 和解析配置 | 单独后置成卡 |
| 接口抽象 | repository / port / adapter trait | `application::ports` / infra | 隔离数据库、bus、object storage、governance | 不在本步展开,进入 Step 7 |

### 7.2 对象关系图

#### 对象关系图: Definition truth 到同步、查询与 P1 引用

```text
[ActorContext] + [RequestMeta]
        | attach
        v
[MethodContentCommandService]
        | call
        v
[MethodContent]
        | owns
        +--> [MethodContentPayload]
        | owns
        +--> [MethodContentLifecycle]
        | publish with
        +--> [ContentVersion] + [CanonicalFingerprint] + [ApprovedGateRef]
        | create evidence
        +--> [AuditRecord]
        | create snapshot
        +--> [DefinitionSnapshot] --> [SnapshotRef] --> [SnapshotBlobRef]
        | create event
        +--> [OutboxEvent] --> [DefinitionEventEnvelope]
        | expose published ref
        +--> [PublishedContentRef]
                  |
                  | referenced by P1 only after publish
                  v
        [MethodPlugin] --> [MethodConfiguration] --> [EffectiveContentSet]

[OutboxEvent] + [DefinitionSnapshot] + [AuditRecord]
        | rebuild/query
        v
[ContentSummaryView] + [DefinitionTraceView] + [ContentVersionView]
```

关键说明：

- 图表达对象之间的引用和生成关系,不表达函数级处理流。
- `MethodContent` 是 Definition truth 的聚合根;projection、snapshot、event 都不能反写真相。
- `SnapshotRef` 表达逻辑 snapshot 引用,`SnapshotBlobRef` 表达 object storage payload 引用。
- P1 对象只能读取 `PublishedContentRef`,不得复制或修改 P0 MethodContent 正文。

### 7.3 对象卡片统一写法

正式文档中每个对象必须按以下结构展开：

```md
#### `ObjectName`

对象摘要:

| 项 | 内容 |
|---|---|
| 所属层 | <domain aggregate / value object / DTO / projection / persistence record> |
| 建议文件 | `<crate>/<module>/<file>.rs` |
| 主要责任 | <对象维护什么事实或不变量> |
| 不属于它的内容 | <禁止塞入的职责> |

成员变量:

| 成员变量 | 类型 | 作用 | 约束 / 变更规则 |
|---|---|---|---|

状态集合:

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|

成员函数:

| 函数签名 | 返回 | 作用 |
|---|---|---|

工厂函数:

| 函数签名 | 返回 | 作用 |
|---|---|---|

不变量 / 禁止事项:
- <约束>
```

### 7.4 代表性对象卡片

#### `MethodContent`

对象摘要:

| 项 | 内容 |
|---|---|
| 所属层 | domain aggregate |
| 建议文件 | `method_library_domain/src/content/aggregate.rs` |
| 主要责任 | 维护 P0 MethodContent definition truth、payload、lifecycle、version、fingerprint 和 supersede 关系 |
| 不属于它的内容 | HTTP request、repository、bus event publisher、object storage client、下游 Use truth |

成员变量:

| 成员变量 | 类型 | 作用 | 约束 / 变更规则 |
|---|---|---|---|
| `content_id` | `ContentId` | definition 唯一 ID | 创建后不可变 |
| `content_family_id` | `ContentFamilyId` | version / supersede 家族 ID | 同一替代链保持一致 |
| `kind` | `MethodContentKind` | P0 definition 类型 | 创建后不可变 |
| `name` | `String` | 展示名称 | 非空 |
| `description` | `String` | definition 说明 | 不作为唯一标识 |
| `payload` | `MethodContentPayload` | 7 类 definition 正文之一 | 必须与 `kind` 匹配 |
| `references` | `Vec<ContentRef>` | definition 间普通引用 | 只能引用允许 kind |
| `lifecycle` | `MethodContentLifecycle` | 生命周期状态事实 | 只能通过领域函数迁移 |
| `version` | `Option<ContentVersion>` | 当前业务版本 | draft 可空,published 必填 |
| `fingerprint` | `Option<CanonicalFingerprint>` | canonical 语义指纹 | published 后必填 |
| `supersedes_content_id` | `Option<ContentId>` | 当前 definition 替代的旧 content | supersede 新定义时可填 |
| `superseded_by_content_id` | `Option<ContentId>` | 替代当前 definition 的新 content | 当前 content 被替代后填写 |
| `created_by` | `ActorId` | 创建者 | 审计字段 |
| `created_at` | `Timestamp` | 创建时间 | 不参与 fingerprint |
| `updated_at` | `Timestamp` | 更新时间 | 不参与 fingerprint |
| `revision` | `Revision` | 乐观锁版本 | 保存时校验 |

状态集合：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `draft` | 草稿,不可被下游作为权威引用 | create / seed draft | submit_for_review |
| `in_review` | 已提交评审,等待发布 gate | submit_for_review | publish |
| `published` | 已发布权威 definition | publish | deprecate / retire / supersede |
| `deprecated` | 已弃用,保留追溯 | deprecate | retire / supersede |
| `retired` | 退役终态 | retire | 无 |
| `superseded` | 被新 definition 替代的终态 | supersede | 无 |

成员函数：

| 函数签名 | 返回 | 作用 |
|---|---|---|
| `ensure_revision(Revision expected_revision)` | `Result<(), MethodLibraryError>` | 校验乐观锁版本 |
| `ensure_payload_matches_kind()` | `Result<(), MethodLibraryError>` | 校验 `kind` 与 payload variant 一致 |
| `ensure_definition_boundary()` | `Result<(), MethodLibraryError>` | 校验 payload 未混入下游 Use truth |
| `update_draft(String name, Option<String> description, MethodContentPayload payload, ActorContext actor, Timestamp now)` | `Result<(), MethodLibraryError>` | 只允许 draft 修改正文和元信息 |
| `submit_for_review(ActorContext actor, Timestamp now)` | `Result<(), MethodLibraryError>` | 将 draft 迁移为 in_review |
| `publish(ApprovedGateRef gate_ref, ContentVersion version, CanonicalFingerprint fingerprint, ActorContext actor, Timestamp now)` | `Result<(), MethodLibraryError>` | 固定 gate / version / fingerprint 并进入 published |
| `deprecate(String reason, ActorContext actor, Timestamp now)` | `Result<(), MethodLibraryError>` | 标记 deprecated |
| `retire(String reason, ActorContext actor, Timestamp now)` | `Result<(), MethodLibraryError>` | 标记 retired |
| `mark_superseded_by(ContentId next_content_id, String reason, ActorContext actor, Timestamp now)` | `Result<(), MethodLibraryError>` | 标记被新 definition 替代 |
| `is_published_like()` | `bool` | 判断是否具备可引用的 published 事实 |

工厂函数：

| 函数签名 | 返回 | 作用 |
|---|---|---|
| `MethodContent::create_draft(ContentId content_id, ContentFamilyId content_family_id, MethodContentKind kind, String name, Option<String> description, MethodContentPayload payload, ActorContext actor, Timestamp now)` | `Result<MethodContent, MethodLibraryError>` | 创建 draft aggregate |
| `MethodContent::rehydrate(MethodContentRecord record)` | `Result<MethodContent, MethodLibraryError>` | 从持久化记录重建 aggregate,不触发业务事件 |

不变量 / 禁止事项：

- `MethodContentKind` 只包含 7 类 P0 definition,不包含 P1 plugin / configuration。
- published 后不得原地修改 payload 语义字段、references、version、fingerprint 或 gate 证据。
- domain object 不访问数据库、不发布事件、不调用 governance / object storage。

#### `MethodContentLifecycle`

对象摘要:

| 项 | 内容 |
|---|---|
| 所属层 | domain value object |
| 建议文件 | `method_library_domain/src/content/lifecycle.rs` |
| 主要责任 | 维护 MethodContent 生命周期状态和合法迁移 |
| 不属于它的内容 | audit record、HTTP status、repository save 逻辑 |

成员变量:

| 成员变量 | 类型 | 作用 | 约束 / 变更规则 |
|---|---|---|---|
| `state` | `LifecycleState` | 当前生命周期状态 | 只能按状态机迁移 |
| `changed_at` | `Timestamp` | 最近状态变更时间 | 由 application clock 注入 |
| `changed_by` | `ActorId` | 最近状态变更者 | 用于审计 |
| `reason` | `Option<String>` | 状态变更原因 | deprecate / retire / supersede 必填 |

成员函数:

| 函数签名 | 返回 | 作用 |
|---|---|---|
| `can_transition_to(MethodContentLifecycle target)` | `bool` | 判断状态迁移是否合法 |
| `is_terminal()` | `bool` | 判断是否为 retired / superseded 终态 |
| `allows_draft_update()` | `bool` | 判断是否允许更新 draft 正文 |
| `requires_version()` | `bool` | 判断当前状态是否必须具备业务版本 |

工厂函数:

| 函数签名 | 返回 | 作用 |
|---|---|---|
| `MethodContentLifecycle::initial_draft()` | `MethodContentLifecycle` | 返回初始 draft 状态 |
| `MethodContentLifecycle::from_persisted(String value)` | `Result<MethodContentLifecycle, MethodLibraryError>` | 从持久化值解析生命周期 |

#### `DefinitionSnapshot` / `OutboxEvent`

| 对象 | 所属层 | 关键字段 | 成员函数 / 工厂函数 | 禁止事项 |
|---|---|---|---|---|
| `DefinitionSnapshot` | sync artifact / domain snapshot | `snapshot_id: SnapshotId`、`content_id: ContentId`、`version: ContentVersion`、`fingerprint: CanonicalFingerprint`、`payload_ref: SnapshotBlobRef` | `DefinitionSnapshot::from_published(MethodContent content, SnapshotBlobRef payload_ref, ActorId actor_id, Timestamp now)` | 不替代 MethodContent write model |
| `SnapshotRef` | value object | `snapshot_id`、`schema_version`、`blob_ref` | `verify_matches(ContentId content_id, ContentVersion version, CanonicalFingerprint fingerprint)` | 不保存 snapshot 正文 |
| `OutboxEvent` | persistence record | `event_id: OutboxEventId`、`payload: DefinitionEventEnvelope`、`status: OutboxStatus`、`retry_count: u32` | `new_pending(DefinitionEventEnvelope envelope, PayloadHash payload_hash, IdempotencyKey key, Timestamp now)`、`mark_published(Timestamp now)`、`mark_failed(String reason, Option<Timestamp> next_retry_at)` | 不作为业务真相;不自行产生业务事件 |
| `DefinitionEventEnvelope` | integration event DTO | `event_id`、`event_type`、`schema_version`、`content_ref: PublishedContentRef`、`snapshot_ref: Option<SnapshotRef>` | `DefinitionEventEnvelope::from_published(...)` | 不携带下游 Use truth |

#### `ContentSummaryView` / `DefinitionTraceView` / `ViewProfileResolveResult`

| 对象 | 所属层 | 关键字段 | 作用 | 禁止事项 |
|---|---|---|---|---|
| `ContentSummaryView` | projection / read model | `content_id`、`kind`、`name`、`lifecycle_state`、`version`、`fingerprint`、`updated_at` | 支持列表、筛选和摘要展示 | 不反向覆盖 write model |
| `DefinitionTraceView` | projection / read model | `content_id`、`version_chain`、`audit_refs`、`event_refs`、`snapshot_refs`、`supersede_refs` | 支持版本、audit、event、snapshot、supersede 链追溯 | 不替代 audit / outbox 原始记录 |
| `ViewProfileResolveResult` | query result DTO | `view_profile_id`、`version`、`fingerprint`、`field_rules`、`action_rules`、`resolved_at` | 返回 ViewProfile 解析结果 | 不保存 UI runtime state;不反写 ViewProfile |
| `ContentVersionView` | query result DTO | `content_id`、`version`、`fingerprint`、payload 摘要 | 返回指定版本的只读展示视图 | 不作为 update payload |
| `ProjectionCheckpoint` | operations record | `checkpoint_name`、`last_processed_event_id`、`updated_at`、`failure_reason` | 记录 projection rebuild 位置 | 不修改 write model |

#### P1 后置对象

| 对象 | 所属层 | 关键字段 | 成员函数 / 工厂函数 | P0 边界 |
|---|---|---|---|---|
| `MethodPlugin` | P1 domain aggregate | `plugin_id`、`plugin_key`、`version`、`items: Vec<MethodPluginItem>`、`lifecycle_state` | `validate_content_refs(...)`、`validate_dependency_dag(...)`、`publish(ActorContext actor, Timestamp now)` | 只引用 `PublishedContentRef`,不复制 P0 正文 |
| `MethodPluginItem` | P1 value object | `item_key`、`content_ref: PublishedContentRef`、`required` | `from_published_ref(PublishedContentRef content_ref)` | 不引用 draft / retired / superseded content |
| `MethodConfiguration` | P1 domain aggregate | `configuration_id`、`selected_plugin_refs`、`effective_content_set`、`lifecycle_state` | `resolve_effective_content_set(...)`、`activate(ActorContext actor, Timestamp now)` | 不反向修改 plugin 或 MethodContent |
| `EffectiveContentSet` | P1 query / domain output | `content_refs: Vec<PublishedContentRef>`、`resolved_at` | `validate_unique_refs()` | 不作为 MethodContent 写入源 |

### 7.5 命名对齐表

| 现有写法 | 本步正式口径 | 说明 |
|---|---|---|
| `DefinitionVersion` | `ContentVersion` | 当前详细设计主要使用 `ContentVersion`;回填时应统一 |
| `Fingerprint` | `CanonicalFingerprint` | 避免把普通 hash 和 canonical 语义指纹混用 |
| `DefinitionReference` | `ContentRef` / `PublishedContentRef` | 普通引用和已发布稳定引用必须拆开 |
| `SnapshotRef` | `SnapshotRef` | event / query / replay 使用的逻辑 snapshot 引用 |
| `SnapshotBlobRef` / `BlobRef` | `SnapshotBlobRef` | object storage payload 物理引用,不等同于逻辑 snapshot 引用 |
| `AiPolicyDef` / `AIPolicyDef` | `AIPolicyDef` | 保持当前 P0 payload 命名风格一致 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

```md
## 6. 全局对象 / Trait / API 索引

### 6.1 对象家族总览

| 对象家族 | 对象 | 归属模块 / 层 | 主要责任 | 展开位置 |
|---|---|---|---|---|

### 6.2 调用上下文对象

按对象卡片展开:
- ActorContext
- RequestMeta
- ApprovedGateRef
- IdempotencyRecord

### 6.3 Definition truth 对象

按对象卡片展开:
- MethodContent
- MethodContentKind
- MethodContentPayload
- Qualification
- RoleDefinition
- TaskDefinition
- WorkProductDefinition
- ProcessTemplateDef
- ViewProfile
- AIPolicyDef
- MethodContentLifecycle
- ContentVersion
- CanonicalFingerprint

### 6.4 引用、证据与同步对象

按对象卡片展开:
- ContentRef
- PublishedContentRef
- ReferenceValidationResult
- BoundaryViolation
- AuditRecord
- OutboxEvent
- DefinitionSnapshot
- SnapshotRef
- SnapshotBlobRef
- DefinitionEventEnvelope
- OutboxRelayCheckpoint
- ReplayCursor

### 6.5 查询、投影与追溯对象

按对象卡片展开:
- ContentSummaryView
- DefinitionTraceView
- ViewProfileResolveResult
- ContentVersionView
- ProjectionCheckpoint

### 6.6 P1 后置对象

按对象卡片展开,并明确“不阻塞 P0 主线”:
- MethodPlugin
- MethodPluginItem
- MethodConfiguration
- EffectiveContentSet
- PluginLifecycle
- ConfigurationLifecycle

### 6.7 本章不展开的内容

| 不在本章展开 | 后续 Step |
|---|---|
| repository / port / adapter trait | Step 7 |
| API / Command / Query / Event / Job 协议 | Step 8 |
| 逐接口函数级处理流 | Step 9 |
| 生命周期转换矩阵 | Step 10 |
| 持久化、事务与一致性 | Step 11 |
```

---

## 9. 待确认事项

- 是否在正式文档中把 `SnapshotRef` 与 `SnapshotBlobRef` 明确拆成两个类型,还是保留一个类型加字段区分。
- Step 5 模块总表中的 `DefinitionVersion` / `Fingerprint` 是否在回填正式文档时同步改为 `ContentVersion` / `CanonicalFingerprint`。
- P1 的 `PluginLifecycle` / `ConfigurationLifecycle` 是否本轮只保留索引,完整状态机留到后续 P1 设计。

---

## 10. 进入下一步条件

- 对象家族划分已经确认。
- 关键对象的正式命名已经确认。
- 对象卡片写法已经确认,字段、状态、成员函数、工厂函数均要求写类型和作用。
- P1 对象已明确为后置扩展,不会阻塞 P0 主线。
- repository / port / adapter 已从本步剥离,可以进入 Step 7 逐模块定义 Trait / Port / Adapter 契约。
