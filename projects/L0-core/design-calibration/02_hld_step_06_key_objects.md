# Step 6. 关键对象轮廓

> 本版本承接 Step 5 已收敛的主要组成部分，将 `L0-core` 的关键对象固定为概要设计层对象卡片。
> 本步只回答“有哪些对象、分别属于哪个主要组成部分、对象类型、关键字段、状态集合、成员函数、工厂函数和禁止事项”，不展开接口骨架、完整处理流、数据库结构或 port / job 实现契约。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-core/02-概要设计.md` §6 关键对象轮廓

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 主要组成部分 | 已确认 6 个业务主要组成部分和 1 个支撑主体集合 |
| Step 4 代码主体框架 | 已点名共享契约核心、领域契约包、本地索引 / 投影 / 引用、后台校验与事实输出等主语 |
| Step 3 结构性约束 | 契约真相、Definition / Use 分离、P0 / P1 分离、发布门禁、快照兜底、事实输出、引用边界 |
| 当前对象线索 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`CompatibilityStatus`、`ContractEvolutionRecord`、`ContractFactRecord`、`IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage`、`StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection`、`ExternalReference`、`DownstreamConsumptionRef` |

已确认结论：

```text
Step 6 必须独立输出关键对象轮廓,不能折叠进 Step 5 的主要组成部分小节。
本步写对象骨架,不写完整 Rust struct、trait、返回类型、数据库列或协议 schema。
对象必须按独立小节展开;如果存在家族共性,可以先写共享骨架说明,再分别列对象卡片。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认设计目标和范围。
Step 3 已确认结构性约束。
Step 4 已确认代码主体框架。
Step 5 已确认主要组成部分、职责与边界。
```

---

## 3. SOP 问题回答

### 3.1 哪些对象如果不在概要设计层点名，详细设计会重新发明主语？

回答：

本仓需要显式点名的对象分为 5 组。

| 类别 | 关键对象 | 对应主要组成部分 | 为什么必须点名 |
|---|---|---|---|
| 契约真相对象 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` | 契约真相与领域契约组织 | 它们是共享契约来源仓的真相主语，不能只停留在组件级描述 |
| 发布与一致性对象 | `ContractReleaseBaseline`、`CompatibilityStatus` | 兼容性门禁与发布基线 | 它们决定何时可以正式收口和发布 |
| 快照、事实与下游引用对象 | `ContractReleaseSnapshot`、`ContractFactRecord`、`DownstreamConsumptionRef` | 快照派生与下游消费、后台校验与事实输出 | 它们决定发布后的只读消费面和事实输出链路 |
| 领域契约包对象 | `IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage` | 契约真相与领域契约组织 | 它们是面向下游消费域的正式共享契约包主语 |
| 索引、引用与追溯对象 | `StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection`、`ExternalReference` | 引用索引与追溯查询 | 它们是后续只读查询、标准映射、引用追溯和外部引用的稳定主语 |

### 3.2 每个对象属于哪个主要组成部分？

回答：

| 对象 | 所属主要组成部分 |
|---|---|
| `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` | 契约真相与领域契约组织 |
| `ContractReleaseBaseline`、`CompatibilityStatus` | 兼容性门禁与发布基线 |
| `ContractReleaseSnapshot`、`ContractFactRecord`、`DownstreamConsumptionRef` | 快照派生与下游消费 / 后台校验与事实输出 |
| 六个 `ContractPackage` 对象 | 契约真相与领域契约组织 |
| `StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection`、`ExternalReference` | 引用索引与追溯查询 |

### 3.3 哪些对象必须在本步独立展开，哪些对象必须后移？

回答：

| 本步独立展开 | 本步后移 |
|---|---|
| 上述 5 组关键对象 | `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger` |
|  | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService` |
|  | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ReferenceRepository`、`AuditLogPort`、`OutboxPort`、`GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort`、`EventPublisherPort`、`ClockPort`、`IdGeneratorPort`、`UnitOfWork` |
|  | 所有 jobs，如 `ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob` |

### 3.4 每个关键字段、状态、成员函数和工厂函数应如何写？

回答：

| 项目 | 写法口径 |
|---|---|
| 关键字段 | 使用 `字段 / 类型 / 作用` 三列，字段类型必须写明概要设计层类型名 |
| 状态集合 | 使用 `状态 / 作用 / 进入方式 / 退出方式` 四列；如果对象不拥有独立状态，要明确写 `无独立状态` |
| 成员函数 | 使用 `函数签名 / 作用` 两列；函数参数必须写类型名和参数名，例如 `publish(ApprovedGateRef gate_ref, ActorContext actor)` |
| 工厂函数 | 使用 `函数签名 / 作用` 两列；同样必须写明参数类型 |
| 禁止事项 | 使用短表或短句列出对象不能承担的职责 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 5 主要组成部分 | 只停留在 part / module 级别 | 详细设计还会重新发明对象主语 |
| 旧版 `02` 第 6 章 | 只列对象归属或对象类型，缺少字段、状态、函数和禁止事项 | 不能直接支撑 `03` 的 struct / enum / value object 写法 |
| 旧版 `02` 第 7~8 章 | 接口和处理流已经出现，但对象骨架没有固定 | `03` 中的 API 和 flow 无法稳定回指对象 |
| 旧版输出 | service / port / job 与对象主语混读 | 会把概要设计写成“对象 + 服务 + 端口”的混合目录 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象表达 | 只在 part 或模块里顺带提名 | 每个关键对象独立成节 | 让详细设计可以一一回指 |
| 字段表达 | 只给概念名 | 关键字段用 `字段 / 类型 / 作用` 明确写出 | 避免实现时再猜类型 |
| 行为表达 | 成员函数散落在流程和接口里 | 成员函数与工厂函数单独成表 | 让对象职责和处理流分开 |
| 状态表达 | 状态词散落在文本中 | 状态集合单独成表 | 让状态机后续能独立成章 |
| 边界表达 | service / port / job 容易混进对象章 | 明确后移到 Step 7 / Step 8 / 详细设计 | 避免概要设计滑进实现层 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只写对象总览表 | 写得快 | 无法支撑详细设计 | 不采用 |
| 把 service / port / job 一起写进对象章 | 结构完整 | 会把对象章写乱，边界不清 | 不采用 |
| 按对象家族组织，先写共享骨架，再写单对象卡片 | 既能收敛共性，也能保留单对象边界 | 需要额外维护家族总览 | 采用 |
| 所有对象都写成同样长度的长卡片 | 信息齐全 | 重复过多，阅读成本高 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 对象分布说明

```text
契约真相与领域契约组织
├─ ContractDefinition
├─ ContractScope
├─ ContractVersion
├─ ContractLifecycle
├─ ContractEvolutionRecord
├─ IdentityContractPackage
├─ ConversationContractPackage
├─ WorkContractPackage
├─ ProcessContractPackage
├─ GovernanceContractPackage
└─ ArtifactContractPackage

兼容性门禁与发布基线
├─ ContractReleaseBaseline
└─ CompatibilityStatus

快照派生与下游消费 / 后台校验与事实输出
├─ ContractReleaseSnapshot
├─ ContractFactRecord
└─ DownstreamConsumptionRef

引用索引与追溯查询
├─ StandardMappingIndex
├─ EventCatalogReference
├─ CompatibilityTraceIndex
├─ ContractReadModel
├─ ContractTraceProjection
└─ ExternalReference
```

关键说明：

- 该图表达的是“关键对象属于哪个主要组成部分”，不是文件树。
- `ContractFactRecord` 虽然由后台校验与事实输出承接，但它和快照 / 下游引用一起构成发布后的事实链路。
- `ContractReleaseSnapshot`、`ContractFactRecord` 和 `DownstreamConsumptionRef` 不反向拥有 `ContractDefinition` 真相。

### 7.2 契约真相对象族

#### 7.2.1 共享骨架说明

这一族对象共同支撑 `L0-core` 的共享契约真相。它们通常共享：

| 共同字段 / 行为 | 作用 |
|---|---|
| `definition_id` / `kind` / `lifecycle` / `version` / `fingerprint` | 固定契约真相锚点 |
| `submit_for_review` / `publish` / `deprecate` / `retire` / `supersede` | 固定真相生命周期变化路径 |
| `create_draft` / `rehydrate` | 固定草稿创建与持久化恢复路径 |

#### 7.2.2 `ContractDefinition`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain aggregate |
| 主要责任 | 维护共享契约定义真相、版本锚点、生命周期锚点、引用锚点和演进锚点 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `definition_id` | `ContractDefinitionId` | 标识一条契约定义 |
| `kind` | `ContractKind` | 区分契约定义类别 |
| `scope` | `ContractScope` | 表达该契约适用范围 |
| `version` | `ContractVersion` | 表达当前版本位置 |
| `lifecycle` | `ContractLifecycle` | 表达当前生命周期状态 |
| `body_ref` | `ContractBodyRef` | 指向契约正文骨架或 canonical body |
| `fingerprint` | `ContractFingerprint` | 表达 canonical 语义指纹 |
| `reference_set` | `ContractReferenceList` | 保存允许的结构化引用 |
| `evolution_history` | `ContractEvolutionRecordList` | 保存演进轨迹骨架 |
| `created_by` | `ActorRef` | 记录创建者 |
| `updated_at` | `Timestamp` | 记录最近更新时间 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `draft` | 草稿,不作为权威引用 | `create_draft` | `submit_for_review` |
| `in_review` | 已进入评审流程 | `submit_for_review` | `publish` |
| `published` | 权威共享契约真相 | `publish` | `deprecate` / `retire` / `supersede` |
| `deprecated` | 已弃用但保留追溯 | `deprecate` | `retire` / `supersede` |
| `retired` | 退役终态 | `retire` | 无 |
| `superseded` | 被新定义替代 | `supersede` | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)` | 更新草稿正文和元信息 |
| `submit_for_review(ActorContext actor, Timestamp now)` | 将草稿送入评审状态 |
| `publish(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | 在门禁通过后正式发布 |
| `deprecate(LifecycleReason reason, ActorContext actor, Timestamp now)` | 标记为弃用 |
| `retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | 标记为退役 |
| `supersede(ContractDefinitionId new_definition_id, ActorContext actor, Timestamp now)` | 建立新旧定义替代关系 |
| `can_transition_to(ContractLifecycle target)` | 判断是否允许迁移到目标生命周期 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)` | 创建草稿定义 |
| `rehydrate(ContractDefinitionRecord record)` | 从持久化记录恢复聚合 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 保存下游实现正文 | 只能保存共享契约真相 |
| 绕过生命周期直接改写已发布真相 | 必须通过状态迁移函数 |
| 直接发布事件 | 事件发布由 outbox / application 编排 |

#### 7.2.3 `ContractScope`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | value object / policy subject |
| 主要责任 | 定义某份契约允许覆盖的标准范围、消费边界和共享边界 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `scope_id` | `ContractScopeId` | 范围锚点 |
| `owner_domain` | `ContractDomain` | 表达范围归属 |
| `scope_kind` | `ContractScopeKind` | 表达范围类别 |
| `rules` | `ScopeRuleList` | 记录适用规则 |
| `reference_set` | `ContractReferenceSet` | 记录范围内可引用对象 |

状态集合表：

| 状态 | 作用 |
|---|---|
| 无独立状态 | 范围本身不单独演进,由 `ContractDefinition` 生命周期约束 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `contains(ContractKind kind)` | 判断是否覆盖某类契约 |
| `matches(ContractScope other)` | 判断两个范围是否一致 |
| `overlaps_with(ContractScope other)` | 判断两个范围是否重叠 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create(ContractDomain owner_domain, ContractScopeKind scope_kind, ScopeRuleList rules)` | 创建范围对象 |
| `from_persisted(ContractScopeRecord record)` | 从持久化记录恢复范围对象 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把范围本身当成发布真相 | 范围只定义边界,不拥有正文 |
| 保存下游实现细节 | 只能表达共享边界与规则 |

#### 7.2.4 `ContractVersion`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | value object |
| 主要责任 | 表达契约版本位置和替代序列 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `version` | `VersionValue` | 当前版本号 |
| `previous_version` | `Option<VersionValue>` | 前一版本 |
| `supersedes_definition_id` | `Option<ContractDefinitionId>` | 被当前版本替代的定义 |
| `version_kind` | `ContractVersionKind` | 版本表达方式 |

状态集合表：

| 状态 | 作用 |
|---|---|
| 无独立状态 | 版本只表达顺序,不表达流程状态 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `next()` | 生成下一版本 |
| `is_newer_than(ContractVersion other)` | 判断版本新旧关系 |
| `is_initial()` | 判断是否初始版本 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `initial()` | 创建初始版本 |
| `from_persisted(VersionValue value)` | 从持久化值恢复版本 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 用版本替代生命周期 | 版本不表达 draft / published 等状态 |
| 用版本替代 fingerprint | 版本与语义指纹不是同一概念 |

#### 7.2.5 `ContractLifecycle`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | value object / state model |
| 主要责任 | 维护生命周期状态和合法迁移 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `state` | `LifecycleValue` | 当前生命周期状态 |
| `changed_at` | `Timestamp` | 最近状态变更时间 |
| `changed_by` | `ActorRef` | 最近状态变更者 |
| `reason` | `Option<LifecycleReason>` | 状态变化原因 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `draft` | 草稿,可编辑 | `initial_draft` | `in_review` |
| `in_review` | 待发布评审 | `submit_for_review` | `published` |
| `published` | 正式发布 | `publish` | `deprecated` / `retired` / `superseded` |
| `deprecated` | 已弃用 | `deprecate` | `retired` / `superseded` |
| `retired` | 退役终态 | `retire` | 无 |
| `superseded` | 被替代终态 | `supersede` | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `can_transition_to(ContractLifecycle target)` | 判断是否允许迁移 |
| `allows_edit()` | 判断是否允许编辑正文 |
| `allows_new_reference()` | 判断是否允许新增引用 |
| `is_terminal()` | 判断是否为终态 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `initial_draft(ActorContext actor)` | 创建初始草稿状态 |
| `from_persisted(LifecycleValue value)` | 从持久化值恢复状态 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 绕过状态迁移函数直接赋值 | 必须通过合法迁移路径 |
| 把生命周期状态写成外部系统状态码 | 生命周期属于本仓真相 |

#### 7.2.6 `ContractEvolutionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain record |
| 主要责任 | 记录新增、变更、废弃、退役和 supersede 的追溯锚点 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ContractEvolutionRecordId` | 演进记录 ID |
| `definition_id` | `ContractDefinitionId` | 关联定义 |
| `action` | `ContractEvolutionAction` | 记录动作 |
| `before_version` | `Option<ContractVersion>` | 变更前版本 |
| `after_version` | `Option<ContractVersion>` | 变更后版本 |
| `actor_ref` | `ActorRef` | 操作者 |
| `gate_ref` | `Option<ApprovedGateRef>` | 门禁引用 |
| `reason` | `Option<LifecycleReason>` | 变化原因 |
| `fingerprint_before` | `Option<ContractFingerprint>` | 变更前指纹 |
| `fingerprint_after` | `Option<ContractFingerprint>` | 变更后指纹 |
| `occurred_at` | `Timestamp` | 发生时间 |

状态集合表：

| 状态 | 作用 |
|---|---|
| 无独立状态 | 它只记录事实,不拥有业务生命周期 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `from_definition_change(ContractDefinition definition, ActorContext actor, Timestamp now)` | 从定义变化生成记录 |
| `from_release_result(ContractReleaseBaseline baseline, ActorContext actor, Timestamp now)` | 从发布结果生成记录 |
| `bind_snapshot(ContractReleaseSnapshot snapshot)` | 关联发布快照 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create(ContractEvolutionRecordSpec spec, ActorContext actor, Timestamp now)` | 创建演进记录 |
| `rehydrate(ContractEvolutionRecordRow record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把演进记录当成第二真相 | 它只做追溯锚点 |
| 用自由文本代替结构化演进信息 | 演进记录必须可追踪 |

### 7.3 发布与一致性对象族

#### 7.3.1 共享骨架说明

这一族对象共同支撑发布前后的门禁、一致性和派生产物。它们通常共享：

| 共同字段 / 行为 | 作用 |
|---|---|
| `definition_id` / `version` / `fingerprint` / `gate_ref` / `status` | 固定发布与一致性锚点 |
| `mark_*` / `bind_*` / `from_*` | 固定发布与派生操作路径 |
| `read-only after release` | 发布后产物必须是只读或派生式对象 |

#### 7.3.2 `ContractReleaseBaseline`

| 项 | 内容 |
|---|---|
| 所属部分 | 兼容性门禁与发布基线 |
| 对象类型 | domain record |
| 主要责任 | 表达某一版本契约已经正式收口的基线 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `baseline_id` | `ContractReleaseBaselineId` | 基线 ID |
| `definition_id` | `ContractDefinitionId` | 对应定义 |
| `version` | `ContractVersion` | 对应版本 |
| `scope` | `ContractScope` | 发布范围 |
| `compatibility_status` | `CompatibilityStatus` | 兼容判断结果 |
| `gate_ref` | `ApprovedGateRef` | 已通过门禁的引用 |
| `fingerprint` | `ContractFingerprint` | 发布指纹 |
| `snapshot_ref` | `Option<ContractReleaseSnapshotRef>` | 已绑定快照引用 |
| `released_by` | `ActorRef` | 发布者 |
| `released_at` | `Timestamp` | 发布时间 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `prepared` | 已准备,未正式发布 | `create_draft` | `mark_released` |
| `released` | 已正式收口 | `mark_released` | `supersede` / `retire` |
| `superseded` | 被新基线替代 | `supersede` | 无 |
| `retired` | 基线退役 | `retire` | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `can_be_released()` | 判断是否满足发布条件 |
| `mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | 标记正式发布 |
| `bind_snapshot(ContractReleaseSnapshot snapshot)` | 绑定发布快照 |
| `supersede(ContractReleaseBaselineId new_baseline_id, ActorContext actor, Timestamp now)` | 标记被替代 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create_draft(ContractDefinition definition, CompatibilityStatus compatibility_status, ActorContext actor, Timestamp now)` | 创建发布基线草稿 |
| `rehydrate(ContractReleaseBaselineRecord record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 让快照反向修改基线 | 基线是真相锚点,快照是派生物 |
| 绕过门禁直接发布 | 必须携带已批准 gate 引用 |

#### 7.3.3 `CompatibilityStatus`

| 项 | 内容 |
|---|---|
| 所属部分 | 兼容性门禁与发布基线 |
| 对象类型 | value object / state model |
| 主要责任 | 表达兼容判断结果和发布可行性 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `value` | `CompatibilityValue` | 兼容性结果 |
| `checked_at` | `Timestamp` | 最近检查时间 |
| `checked_by` | `ActorRef` | 最近检查操作者 |
| `blocking_reason` | `Option<CompatibilityReason>` | 阻断原因 |
| `trace_ref` | `Option<CompatibilityTraceRef>` | 兼容追溯引用 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `pending` | 兼容判断未完成 | `pending()` | `compatible` / `incompatible` |
| `compatible` | 可继续发布 | `mark_compatible` | 仅在重新检查时回到 `pending` |
| `incompatible` | 不可继续发布 | `mark_incompatible` | 仅在重新检查时回到 `pending` |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `is_passable()` | 判断是否可以放行发布 |
| `blocks_release()` | 判断是否阻断发布 |
| `mark_compatible(ActorContext actor, Timestamp now)` | 标记兼容 |
| `mark_incompatible(ActorContext actor, CompatibilityReason reason, Timestamp now)` | 标记不兼容 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `pending()` | 创建待检查状态 |
| `from_persisted(CompatibilityValue value)` | 从持久化值恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 将兼容结果写成自然语言结论 | 必须保留结构化状态 |
| 把兼容结果当作最终真相正文 | 它只是发布门禁结果 |

#### 7.3.4 `ContractReleaseSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | 快照派生与下游消费 |
| 对象类型 | domain snapshot / read model source |
| 主要责任 | 表达从发布基线派生出的只读消费快照 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `ContractReleaseSnapshotId` | 快照 ID |
| `baseline_id` | `ContractReleaseBaselineId` | 所属基线 |
| `definition_id` | `ContractDefinitionId` | 对应定义 |
| `version` | `ContractVersion` | 对应版本 |
| `fingerprint` | `ContractFingerprint` | 快照指纹 |
| `lifecycle` | `ContractLifecycle` | 快照来源生命周期 |
| `body_ref` | `SnapshotBlobRef` | 快照正文引用 |
| `consumer_scope` | `ContractScope` | 消费面范围 |
| `exported_at` | `Timestamp` | 导出时间 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `building` | 正在派生 | `from_baseline` | `ready` |
| `ready` | 可供下游读取 | 派生完成 | `superseded` / `archived` |
| `superseded` | 被新快照替代 | 新快照生成 | 无 |
| `archived` | 归档态 | 运维归档 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `from_baseline(ContractReleaseBaseline baseline, SnapshotBlobRef body_ref, ActorContext actor, Timestamp now)` | 从基线派生快照 |
| `is_read_only()` | 判断是否只读 |
| `matches_version(ContractVersion version)` | 判断是否匹配指定版本 |
| `can_be_consumed()` | 判断是否可被下游消费 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `rehydrate(ContractReleaseSnapshotRecord record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 成为第二份真相 | 快照只能派生,不能回写真相 |
| 丢失 version / fingerprint | 会破坏追溯和幂等 |

#### 7.3.5 `ContractFactRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台校验与事实输出 |
| 对象类型 | domain / outbox-related record |
| 主要责任 | 表达契约变化可感知事实 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `fact_id` | `ContractFactRecordId` | 事实记录 ID |
| `fact_kind` | `ContractFactKind` | 事实类型 |
| `definition_id` | `ContractDefinitionId` | 关联定义 |
| `baseline_id` | `ContractReleaseBaselineId` | 关联基线 |
| `snapshot_ref` | `Option<ContractReleaseSnapshotRef>` | 关联快照 |
| `trace_ref` | `Option<ContractTraceRef>` | 事实追溯引用 |
| `actor_ref` | `ActorRef` | 触发操作者 |
| `occurred_at` | `Timestamp` | 发生时间 |
| `payload_ref` | `Option<FactPayloadRef>` | 事实正文引用 |
| `delivery_status` | `FactDeliveryStatus` | 输出传播状态 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `pending` | 已生成,待输出 | `from_release_change` | `published` / `failed` |
| `published` | 已形成事实输出 | `mark_published` | `archived` |
| `failed` | 事实输出失败 | `mark_failed` | `pending` / `archived` |
| `archived` | 事实记录归档 | 运维归档 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `from_release_change(ContractReleaseBaseline baseline, ContractReleaseSnapshot snapshot, ActorContext actor, Timestamp now)` | 从发布变化生成事实记录 |
| `mark_published(Timestamp published_at)` | 标记输出成功 |
| `mark_failed(FactFailureReason reason, Timestamp now)` | 标记输出失败 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create(ContractFactRecordSpec spec, ActorContext actor, Timestamp now)` | 创建事实记录 |
| `rehydrate(ContractFactRecordRow record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把事实记录当成契约真相正文 | 它只记录可感知事实 |
| 绕过事实输出链路直接写外部投递 | 输出可靠性由后台校验与 outbox 保证 |

#### 7.3.6 `DownstreamConsumptionRef`

| 项 | 内容 |
|---|---|
| 所属部分 | 快照派生与下游消费 |
| 对象类型 | reference model |
| 主要责任 | 表达下游仓消费某个基线或快照的引用关系 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumption_ref_id` | `DownstreamConsumptionRefId` | 消费引用 ID |
| `downstream_domain` | `DownstreamDomainRef` | 下游消费域 |
| `baseline_id` | `ContractReleaseBaselineId` | 对应基线 |
| `snapshot_ref` | `Option<ContractReleaseSnapshotRef>` | 对应快照 |
| `consumed_at` | `Option<Timestamp>` | 最近消费时间 |
| `consumption_status` | `DownstreamConsumptionStatus` | 消费状态 |
| `consumer_hint` | `Option<String>` | 消费提示 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `pending` | 尚未消费 | `create` | `synced` |
| `synced` | 已消费或已绑定 | `mark_consumed` | `stale` |
| `stale` | 消费引用过期 | 新基线出现 | `synced` |
| `retired` | 引用退役 | 运维退役 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `bind_snapshot(ContractReleaseSnapshotRef snapshot_ref)` | 绑定快照引用 |
| `mark_consumed(Timestamp consumed_at)` | 标记已消费 |
| `mark_stale()` | 标记为过期 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create(DownstreamDomainRef downstream_domain, ContractReleaseBaseline baseline, ActorContext actor, Timestamp now)` | 创建下游消费引用 |
| `rehydrate(DownstreamConsumptionRefRecord record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 保存下游实现正文 | 这里只保存稳定引用 |
| 把消费引用当作消费逻辑本身 | 消费逻辑属于下游仓 |

### 7.4 领域契约包对象族

#### 7.4.1 共享骨架说明

这一族对象共同承载面向下游消费域的共享契约包。它们通常共享：

| 共同字段 / 行为 | 作用 |
|---|---|
| `package_id` / `consumer_domain` / `definition_refs` / `lifecycle` / `snapshot_ref` | 固定契约包锚点 |
| `create_draft` / `publish` / `retire` / `contains` | 固定包级操作路径 |
| `consumer_domain` 固定值 | 区分 identity / conversation / work / process / governance / artifact 六个消费域 |

#### 7.4.2 `IdentityContractPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain package |
| 主要责任 | 承载 identity 消费面需要稳定读取的共享契约集合 |
| 固定域 | `identity` |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `package_id` | `ContractPackageId` | 契约包 ID |
| `consumer_domain` | `ContractDomain` | 固定为 identity |
| `package_version` | `ContractPackageVersion` | 契约包版本 |
| `definition_refs` | `ContractDefinitionRefList` | 包内定义引用 |
| `snapshot_ref` | `Option<ContractReleaseSnapshotRef>` | 对应发布快照 |
| `lifecycle` | `ContractPackageLifecycle` | 包生命周期 |
| `published_at` | `Option<Timestamp>` | 发布时间 |
| `package_summary` | `ContractPackageSummary` | 包摘要 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `draft` | 草稿包 | `create_draft` | `publish` |
| `published` | 可消费包 | `publish` | `deprecated` / `retired` |
| `deprecated` | 已弃用 | `deprecated` | `retired` |
| `retired` | 退役终态 | `retire` | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `add_definition_ref(ContractDefinitionId definition_id)` | 追加定义引用 |
| `publish(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | 发布契约包 |
| `retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | 退役契约包 |
| `contains(ContractDefinitionId definition_id)` | 判断是否包含某个定义 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create_draft(ContractPackageDraftSpec spec, ActorContext actor, Timestamp now)` | 创建草稿契约包 |
| `rehydrate(ContractPackageRecord record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 复制下游实现正文 | 契约包只保存共享契约集合 |
| 发布后原地修改核心组合 | 变更应通过新版本和替代关系表达 |

#### 7.4.3 `ConversationContractPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain package |
| 主要责任 | 承载 conversation 消费面需要稳定读取的共享契约集合 |
| 固定域 | `conversation` |

说明：其字段、状态、成员函数和工厂函数与 7.4.2 的共享骨架同构，差异只在 `consumer_domain` 与 `package_summary` 的消费侧语义。

#### 7.4.4 `WorkContractPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain package |
| 主要责任 | 承载 work 消费面需要稳定读取的共享契约集合 |
| 固定域 | `work` |

说明：同构于 7.4.2 的共享骨架。

#### 7.4.5 `ProcessContractPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain package |
| 主要责任 | 承载 process 消费面需要稳定读取的共享契约集合 |
| 固定域 | `process` |

说明：同构于 7.4.2 的共享骨架。

#### 7.4.6 `GovernanceContractPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain package |
| 主要责任 | 承载 governance 消费面需要稳定读取的共享契约集合 |
| 固定域 | `governance` |

说明：同构于 7.4.2 的共享骨架。

#### 7.4.7 `ArtifactContractPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 契约真相与领域契约组织 |
| 对象类型 | domain package |
| 主要责任 | 承载 artifact 消费面需要稳定读取的共享契约集合 |
| 固定域 | `artifact` |

说明：同构于 7.4.2 的共享骨架。

### 7.5 索引、引用与追溯对象族

#### 7.5.1 共享骨架说明

这一族对象共同承担标准映射、事件目录引用、兼容追溯、只读查询和外部引用。它们通常共享：

| 共同字段 / 行为 | 作用 |
|---|---|
| `*_id` / `status` / `updated_at` / `source_ref` | 固定索引与引用锚点 |
| `rebuild` / `refresh` / `invalidate` / `match` | 固定索引与追溯操作路径 |
| 只读重建 | 这些对象必须可从权威真相重建 |

#### 7.5.2 `StandardMappingIndex`

| 项 | 内容 |
|---|---|
| 所属部分 | 引用索引与追溯查询 |
| 对象类型 | local index |
| 主要责任 | 维护外部标准概念到本仓契约语义的映射 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `index_id` | `StandardMappingIndexId` | 索引 ID |
| `standard_ref` | `StandardRef` | 标准引用 |
| `contract_kind` | `ContractKind` | 对应契约类别 |
| `mapping_rules` | `MappingRuleList` | 映射规则 |
| `index_state` | `IndexState` | 索引状态 |
| `updated_at` | `Timestamp` | 最近更新时间 |
| `updated_by` | `ActorRef` | 最近更新者 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `draft` | 尚未稳定 | `create_draft` | `active` |
| `active` | 可用映射 | `rebuild` | `stale` / `retired` |
| `stale` | 需要重建 | 标准或定义变化 | `active` |
| `retired` | 退役 | 运维退役 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `map_to_contract(ContractDefinitionId definition_id)` | 记录标准到契约的映射 |
| `rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)` | 重新构建索引 |
| `is_consistent_with(ContractDefinition definition)` | 判断是否与定义一致 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create_draft(StandardRef standard_ref, ActorContext actor, Timestamp now)` | 创建草稿索引 |
| `rehydrate(StandardMappingIndexRecord record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把标准正文复制进索引 | 索引只保存映射关系 |
| 让索引成为真相来源 | 真相仍在 ContractDefinition |

#### 7.5.3 `EventCatalogReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 引用索引与追溯查询 |
| 对象类型 | reference model |
| 主要责任 | 表达事件目录的本地引用入口 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_id` | `EventCatalogReferenceId` | 引用 ID |
| `catalog_ref` | `EventCatalogRef` | 事件目录引用 |
| `contract_kind` | `ContractKind` | 对应契约类别 |
| `catalog_version` | `CatalogVersion` | 目录版本 |
| `reference_state` | `ReferenceState` | 引用状态 |
| `resolved_at` | `Option<Timestamp>` | 解析时间 |
| `resolved_by` | `Option<ActorRef>` | 解析者 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `pending` | 待解析 | `create_draft` | `resolved` |
| `resolved` | 已解析 | `resolve` | `stale` / `retired` |
| `stale` | 目录已变更 | 目录更新 | `resolved` |
| `retired` | 退役 | 运维退役 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `resolve(EventCatalogRef catalog_ref, ActorContext actor, Timestamp now)` | 解析目录引用 |
| `invalidate(String reason, ActorContext actor, Timestamp now)` | 使引用失效 |
| `points_to(ContractKind kind)` | 判断是否指向指定契约类别 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `from_catalog_ref(EventCatalogRef catalog_ref, ActorContext actor, Timestamp now)` | 从目录引用创建本地引用 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把目录正文复制进本地引用 | 这里只保存引用入口 |
| 用自由文本替代结构化目录引用 | 必须可追溯 |

#### 7.5.4 `CompatibilityTraceIndex`

| 项 | 内容 |
|---|---|
| 所属部分 | 引用索引与追溯查询 |
| 对象类型 | projection / index |
| 主要责任 | 支撑兼容状态、破坏性变化和废弃追溯 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_index_id` | `CompatibilityTraceIndexId` | 追溯索引 ID |
| `definition_id` | `ContractDefinitionId` | 对应定义 |
| `baseline_id` | `ContractReleaseBaselineId` | 对应基线 |
| `compatibility_status` | `CompatibilityStatus` | 兼容结果 |
| `violation_summary` | `CompatibilityViolationSummary` | 违例摘要 |
| `trace_state` | `TraceIndexState` | 索引状态 |
| `updated_at` | `Timestamp` | 最近更新时间 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `building` | 正在重建 | `append_trace` | `ready` |
| `ready` | 可追溯 | 重建完成 | `stale` / `retired` |
| `stale` | 需要重建 | 定义变化 | `ready` |
| `retired` | 退役 | 运维退役 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `append_trace(CompatibilityTraceItem item)` | 追加兼容追溯项 |
| `is_rebuildable()` | 判断是否可重建 |
| `matches_baseline(ContractReleaseBaseline baseline)` | 判断是否匹配基线 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `from_compatibility_result(CompatibilityResult result, ActorContext actor, Timestamp now)` | 从兼容判断结果创建索引 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把追溯索引当成兼容真相 | 真相仍在 baseline / status |
| 丢失基线引用 | 无法追踪兼容判断来源 |

#### 7.5.5 `ContractReadModel`

| 项 | 内容 |
|---|---|
| 所属部分 | 引用索引与追溯查询 |
| 对象类型 | query projection |
| 主要责任 | 支撑契约列表、详情和只读查询 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `read_model_id` | `ContractReadModelId` | 只读视图 ID |
| `definition_id` | `ContractDefinitionId` | 对应定义 |
| `summary` | `ContractSummary` | 列表 / 详情摘要 |
| `current_version` | `ContractVersion` | 当前版本 |
| `current_status` | `LifecycleValue` | 当前状态 |
| `scope` | `ContractScope` | 当前范围 |
| `read_model_state` | `ReadModelState` | 只读视图状态 |
| `updated_at` | `Timestamp` | 最近更新时间 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `rebuilding` | 正在重建 | `refresh_from_definition` | `ready` |
| `ready` | 可查询 | 重建完成 | `stale` |
| `stale` | 需刷新 | 定义或索引变化 | `ready` |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `refresh_from_definition(ContractDefinition definition)` | 从权威定义刷新只读视图 |
| `matches_query(ContractQuery query)` | 判断是否匹配查询条件 |
| `is_read_only()` | 明确只读属性 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `from_definition(ContractDefinition definition, ActorContext actor, Timestamp now)` | 从定义生成只读视图 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 用 read model 反写真相 | 只读视图不能改写定义 |

#### 7.5.6 `ContractTraceProjection`

| 项 | 内容 |
|---|---|
| 所属部分 | 引用索引与追溯查询 |
| 对象类型 | query projection |
| 主要责任 | 支撑版本、引用、审计、快照和事实追溯 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_id` | `ContractTraceProjectionId` | 投影 ID |
| `definition_id` | `ContractDefinitionId` | 对应定义 |
| `trace_items` | `TraceItemList` | 追溯项列表 |
| `audit_refs` | `AuditRefList` | 审计引用 |
| `snapshot_refs` | `SnapshotRefList` | 快照引用 |
| `event_refs` | `EventRefList` | 事件引用 |
| `projection_state` | `ProjectionState` | 投影状态 |
| `updated_at` | `Timestamp` | 最近更新时间 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `rebuilding` | 正在重建 | `append_trace_item` | `ready` |
| `ready` | 可追溯 | 重建完成 | `stale` |
| `stale` | 需要刷新 | 有新事件或快照 | `ready` |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `append_trace_item(TraceItem item)` | 追加追溯项 |
| `from_trace_sources(TraceSourceSet sources)` | 从审计 / 事件 / 快照来源构建投影 |
| `is_rebuildable()` | 判断是否可重建 |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `rehydrate(ContractTraceProjectionRecord record)` | 从持久化记录恢复 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把投影当成审计原文 | 投影可重建,不能替代原始事实 |

#### 7.5.7 `ExternalReference`

| 项 | 内容 |
|---|---|
| 所属部分 | 引用索引与追溯查询 |
| 对象类型 | reference model |
| 主要责任 | 表达标准、草案、ADR、评审和外部消费等外部引用 |

关键字段表：

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_id` | `ExternalReferenceId` | 外部引用 ID |
| `reference_kind` | `ExternalReferenceKind` | 引用类型 |
| `reference_uri` | `ExternalUri` | 外部 URI |
| `reference_title` | `String` | 外部标题 |
| `reference_state` | `ReferenceState` | 引用状态 |
| `resolved_at` | `Option<Timestamp>` | 解析时间 |
| `source_hint` | `Option<String>` | 来源提示 |

状态集合表：

| 状态 | 作用 | 进入方式 | 退出方式 |
|---|---|---|---|
| `pending` | 待解析 | `create` | `resolved` |
| `resolved` | 已解析 | `resolve` | `broken` / `retired` |
| `broken` | 引用失效 | URI 失效 | `resolved` |
| `retired` | 退役 | 运维退役 | 无 |

成员函数表：

| 函数签名 | 作用 |
|---|---|
| `resolve()` | 标记引用已解析 |
| `invalidate(String reason, ActorContext actor, Timestamp now)` | 使引用失效 |
| `points_to(ExternalUri uri)` | 判断是否指向指定 URI |

工厂函数表：

| 函数签名 | 作用 |
|---|---|
| `create(ExternalReferenceKind kind, ExternalUri uri, ActorContext actor, Timestamp now)` | 创建外部引用 |

禁止事项表：

| 禁止事项 | 说明 |
|---|---|
| 把外部正文复制进本仓 | 这里只保留可追溯引用 |
| 用文本标签替代结构化 URI | 必须可被机器追踪 |

### 7.6 本步不展开的支撑对象

这一批对象已经在 Step 4 / Step 5 被点名，但本步不展开完整对象卡片,留给 Step 7 / Step 8 / 详细设计继续承接：

```text
ContractCommandApi
ContractQueryApi
ContractOperationsTrigger
ContractChangeService
ContractReleaseService
ContractCompatibilityService
ContractSnapshotService
ContractTraceService
ContractFactService
ContractOperationsService
ContractDefinitionRepository
ContractBaselineRepository
SnapshotRepository
ReferenceRepository
AuditLogPort
OutboxPort
GateDecisionPort
ReferenceResolverPort
BlobRefPort
EventPublisherPort
ClockPort
IdGeneratorPort
UnitOfWork
ValidateContractChangeJob
DeriveReleaseSnapshotJob
RebuildContractIndexJob
RecalculateFingerprintJob
PublishContractFactJob
OutboxRelayWorker
```

---

## 8. 回填草稿

可直接回填到 `02-概要设计.md` 的起草结构：

```md
## 6. 关键对象轮廓

### 6.1 对象分布说明

| 主要组成部分 | 关键对象 |
|---|---|

### 6.2 契约真相对象族

#### 6.2.1 ContractDefinition
#### 6.2.2 ContractScope
#### 6.2.3 ContractVersion
#### 6.2.4 ContractLifecycle
#### 6.2.5 ContractEvolutionRecord

### 6.3 发布与一致性对象族

#### 6.3.1 ContractReleaseBaseline
#### 6.3.2 CompatibilityStatus

### 6.4 快照、事实与下游引用对象族

#### 6.4.1 ContractReleaseSnapshot
#### 6.4.2 ContractFactRecord
#### 6.4.3 DownstreamConsumptionRef

### 6.5 领域契约包对象族

#### 6.5.1 IdentityContractPackage
#### 6.5.2 ConversationContractPackage
#### 6.5.3 WorkContractPackage
#### 6.5.4 ProcessContractPackage
#### 6.5.5 GovernanceContractPackage
#### 6.5.6 ArtifactContractPackage

### 6.6 索引、引用与追溯对象族

#### 6.6.1 StandardMappingIndex
#### 6.6.2 EventCatalogReference
#### 6.6.3 CompatibilityTraceIndex
#### 6.6.4 ContractReadModel
#### 6.6.5 ContractTraceProjection
#### 6.6.6 ExternalReference
```

---

## 9. 待确认事项

- 暂无必须阻塞 Step 7 的未决项。

---

## 10. 进入下一步条件

```text
已明确详细设计必须承接哪些关键对象、每个对象的责任和骨架边界，且没有下沉到完整字段模型、函数实现或数据库结构。
可以进入 Step 7 API / 接口骨架。
```
