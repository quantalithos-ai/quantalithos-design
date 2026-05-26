# Step 6. 关键对象轮廓

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L3-method-library/02-概要设计.md` §6 关键对象轮廓

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 主要组成部分 | 已确认 7 个业务主要组成部分及其职责、代码主体和边界 |
| Step 4 代码主体框架 | 已点名 application service、domain object、policy、projection、outbox、port、job 等主语 |
| Step 3 约束条件 | Definition / Use 分离、P0 / P1 分离、published 不可原地修改、fingerprint、audit、outbox、snapshot |
| 当前 02 对象线索 | MethodContent、7 类 definition、AuditRecord、OutboxEvent、DefinitionSnapshot、ReadModel、Projection、MethodPlugin、MethodConfiguration |

已确认结论：

```text
Step 6 必须独立输出关键对象轮廓,不能折叠进 Step 5 的主要组成部分小节。
本步写对象骨架,不写完整 Rust struct、trait、返回类型、数据库列或协议 schema。
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

必须点名的对象分为 6 类。

| 类别 | 对象 |
|---|---|
| 定义真相对象 | MethodContent、Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef |
| 生命周期与发布对象 | MethodContentLifecycle、DefinitionVersion、Fingerprint、AuditRecord |
| 引用与边界对象 | DefinitionReference、BoundaryViolation |
| 同步对象 | OutboxEvent、DefinitionSnapshot |
| 查询投影对象 | DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection |
| P1 位置对象 | MethodPlugin、MethodConfiguration |

本轮不把所有 application service、repository port、job 都作为对象独立展开。它们已经在 Step 5 被点名,在 Step 7 / Step 8 和详细设计中继续展开更合适。

### 3.2 每个对象属于哪个主要组成部分？

回答：

| 对象 | 所属主要组成部分 |
|---|---|
| MethodContent、7 类 definition、DefinitionReference | 方法定义真相与规则 |
| MethodContentLifecycle、DefinitionVersion、Fingerprint、AuditRecord | 方法定义生命周期与发布治理 |
| BoundaryViolation | 关系校验与边界保护 |
| OutboxEvent、DefinitionSnapshot | 定义同步与快照供给 |
| DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection | 查询解析与审计追溯 |
| MethodPlugin、MethodConfiguration | P1 资产打包与配置组装 |

### 3.3 每个对象是什么类型？

回答：

| 对象 | 类型 |
|---|---|
| MethodContent | domain aggregate |
| Qualification / RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef | domain aggregate subtype |
| MethodContentLifecycle / DefinitionVersion / Fingerprint / DefinitionReference | value object |
| AuditRecord | audit record |
| BoundaryViolation | domain error / boundary record |
| OutboxEvent | outbox record |
| DefinitionSnapshot | DTO / sync artifact |
| DefinitionReadModel / DefinitionTraceProjection / ViewProfileProjection | query projection |
| MethodPlugin / MethodConfiguration | P1 domain aggregate |

### 3.4 每个对象至少需要哪些关键字段骨架？

回答：

字段只保留概要设计层必须稳定的骨架。共同字段如下：

```text
content_id
kind
lifecycle
version
fingerprint
created_by
updated_by
published_by
published_at
supersedes_content_id
definition_body
```

不同对象再补充自身关键字段,例如：

```text
Qualification.level_model
RoleDefinition.provided_qualifications
TaskDefinition.required_qualifications
WorkProductDefinition.acceptance_profile
ProcessTemplateDef.task_uses
ViewProfile.match_key
AIPolicyDef.policy_source_ref
OutboxEvent.snapshot_ref
DefinitionSnapshot.source_version
```

### 3.5 每个关键字段分别是什么类型，且每个字段的作用是什么？

回答：

本步在每个对象小节中使用 `字段 / 类型 / 作用` 表达。类型使用概要设计层类型名,例如 `MethodContentId`、`MethodContentKind`、`LifecycleValue`、`FingerprintValue`、`ActorRef`、`DefinitionBody`。

### 3.6 哪些对象存在状态集合，且每个状态的作用是什么？

回答：

| 对象 | 状态集合 |
|---|---|
| MethodContent / 7 类 definition | draft、in_review、published、deprecated、retired、superseded |
| OutboxEvent | pending、published、failed、dead_letter |
| MethodPlugin(P1) | draft、published、deprecated、retired |
| MethodConfiguration(P1) | draft、active、superseded、retired |

`DefinitionSnapshot`、`AuditRecord`、`Fingerprint`、`DefinitionReference`、projection 类对象本身不需要独立生命周期状态。

### 3.7 每个对象有哪些成员函数骨架，且每个函数的作用是什么？

回答：

本步只为有领域行为的对象列成员函数骨架。典型成员函数：

```text
MethodContent.submit_for_review(ActorContext actor)
MethodContent.publish(ApprovedGateRef gate_ref, ActorContext actor)
MethodContent.deprecate(LifecycleReason reason, ActorContext actor)
MethodContent.retire(LifecycleReason reason, ActorContext actor)
MethodContent.supersede(MethodContentId new_content_id, ActorContext actor)
MethodContentLifecycle.can_transition_to(LifecycleValue target)
Fingerprint.matches(FingerprintValue other)
DefinitionReference.points_to(MethodContentId content_id)
```

projection、DTO、record 类对象只保留必要构造或查询视图责任,不强行写领域成员函数。

### 3.8 每个对象有哪些工厂函数骨架，且每个工厂函数的作用是什么？

回答：

典型工厂函数：

```text
MethodContent.create_draft(MethodContentDraftSpec spec, ActorContext actor)
Qualification.from_method_content(MethodContent content)
DefinitionSnapshot.from_published_content(MethodContent content)
OutboxEvent.from_publish_result(PublishResult result)
AuditRecord.from_lifecycle_change(LifecycleChange change)
```

完整返回类型、错误类型和实现逻辑留给详细设计。

### 3.9 每个成员函数 / 工厂函数的参数分别是什么类型？

回答：

本步所有函数参数按 `TypeName param_name` 书写,例如：

```text
publish(ApprovedGateRef gate_ref, ActorContext actor)
create_draft(MethodContentDraftSpec spec, ActorContext actor)
from_publish_result(PublishResult result)
```

不使用裸参数名,不写完整 Rust 签名。

### 3.10 哪些对象虽然已经在 Step 5 被列为代码主体 / 模块，但仍必须在本步独立展开对象骨架？

回答：

必须独立展开：

```text
MethodContent
7 类 MethodContent subtype
MethodContentLifecycle
DefinitionReference
Fingerprint
AuditRecord
OutboxEvent
DefinitionSnapshot
DefinitionReadModel
DefinitionTraceProjection
ViewProfileProjection
MethodPlugin(P1)
MethodConfiguration(P1)
```

暂不独立展开：

```text
MethodContentCommandService
PublishGovernanceService
DefinitionSyncService
SnapshotExportService
ViewProfileResolveService
DefinitionTraceQueryService
MethodOperationsService
Repository / Port / Job
```

原因：这些更适合在 Step 7 接口骨架、Step 8 处理流和详细设计中展开。

### 3.11 哪些字段、函数或结构已经属于详细设计，不应在本步写完整？

回答：

| 不在本步展开 | 原因 |
|---|---|
| 完整 Rust struct / enum | 属于详细设计实现契约 |
| 完整函数返回类型、错误类型、泛型、生命周期 | 属于详细设计 |
| DTO / JSON / proto 字段全集 | 属于接口详细设计 |
| 数据库列、索引、约束 | 属于详细设计 |
| repository trait 全量函数 | 属于详细设计 |
| 校验算法细节、fingerprint canonical 序列化算法 | 属于详细设计 |
| P1 plugin dependency DAG 和 variability 算法 | P1 后置 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6.8 对象归属说明 | 只有对象归属,没有按对象独立定义字段、状态、函数和禁止事项 | 详细设计仍会重新发明对象骨架 |
| §9 关键设计决策 | 有 MethodContent 元模型等决策,但不是对象轮廓 | 无法直接承接到 struct / enum 设计 |
| §11 / §12 接口与流程 | 点名了 API 和流程,但对象输入输出骨架不稳 | Step 7 / Step 8 缺少稳定对象主语 |
| §15 数据所有权 | 列了 truth / record / projection,但没有对象函数和字段骨架 | 只能表达归属,不能驱动 03 详细设计 |
| 全文 | application service、policy、record、projection 混在一起 | 需要先把关键对象与服务 / 处理流分开 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 对象表达方式 | 对象归属表 + 零散概念说明 | 每个关键对象独立小节 | 符合最新概要设计规范 |
| 字段表达 | 多数只写概念名 | 字段 / 类型 / 作用三列表 | 让 03 能按类型骨架继续展开 |
| 行为表达 | 分散在流程和接口章节 | 成员函数 / 工厂函数单独成表 | 避免对象行为被处理流吞掉 |
| 状态表达 | 生命周期散落在流程中 | 有状态对象单独列状态集合 | 支撑 Step 9 状态机 |
| P1 对象 | 混入 P0 主链说明 | 保留对象位置,标记本轮不展开 | 防止 P1 污染 P0 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有对象合成一个总览表 | 短,容易扫读 | 不符合规范,字段和函数无法表达清楚 | 不采用 |
| 每个 Step 5 代码主体都展开对象骨架 | 最完整 | 过重,会把 service、port、job 也提前写成详细设计 | 不采用 |
| 只展开会影响定义真相、状态、同步、查询和 P1 边界的关键对象 | 粒度适中,能支撑 03 | 部分 service / port 留到后续 Step | 采用 |

---

## 7. 结构化中间产物

### 7.1 对象分布说明

| 主要组成部分 | 关键对象 |
|---|---|
| 方法定义生命周期与发布治理 | MethodContentLifecycle、DefinitionVersion、Fingerprint、AuditRecord |
| 方法定义真相与规则 | MethodContent、Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef、DefinitionReference |
| 关系校验与边界保护 | BoundaryViolation |
| 定义同步与快照供给 | OutboxEvent、DefinitionSnapshot |
| 查询解析与审计追溯 | DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection |
| P1 资产打包与配置组装 | MethodPlugin、MethodConfiguration |

本章默认不画对象分布图。上表已经能表达对象归属,且画图容易误读成类图或 ER 图。

### 7.2 MethodContent

#### 7.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义真相与规则 |
| 对象类型 | domain aggregate |
| 主要责任 | 承载 P0 7 类方法定义资产的共同真相、生命周期锚点、版本锚点和引用锚点 |

#### 7.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| content_id | MethodContentId | 标识一条方法定义资产 |
| kind | MethodContentKind | 区分 7 类 P0 definition |
| lifecycle | MethodContentLifecycle | 表达 draft / published 等生命周期 |
| version | DefinitionVersion | 标识定义版本 |
| fingerprint | Fingerprint | 标识 canonical 内容语义指纹 |
| definition_body | DefinitionBody | 承载结构化定义正文 |
| references | DefinitionReferenceList | 承载与其他 definition 的引用关系 |
| supersedes_content_id | OptionalMethodContentId | 指向被替代的旧版本 |
| created_by | ActorRef | 记录创建者 |
| published_by | OptionalActorRef | 记录发布者 |

#### 7.2.3 状态集合

| 状态 | 作用 |
|---|---|
| draft | 草稿状态,允许编辑 |
| in_review | 已提交审核,等待 gate |
| published | 已发布,可被下游消费 |
| deprecated | 已废弃,历史引用保留,新引用应避免 |
| retired | 已退役,拒绝新引用 |
| superseded | 已被新版本替代 |

#### 7.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| submit_for_review(ActorContext actor) | 将 draft 推进到 in_review |
| publish(ApprovedGateRef gate_ref, ActorContext actor) | 将通过 gate 的内容发布为 published |
| deprecate(LifecycleReason reason, ActorContext actor) | 将 published 内容标记为 deprecated |
| retire(LifecycleReason reason, ActorContext actor) | 将内容标记为 retired |
| supersede(MethodContentId new_content_id, ActorContext actor) | 建立新旧版本替代关系 |
| can_be_referenced() | 判断当前定义是否允许被新引用 |

#### 7.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create_draft(MethodContentDraftSpec spec, ActorContext actor) | 创建草稿定义 |
| rehydrate(MethodContentRecord record) | 从持久化记录恢复聚合 |

#### 7.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| published 核心字段原地修改 | 必须通过新版本和 supersede 表达 |
| 保存下游 Use truth | QualificationProfile、ProcessInstance、WorkItem 等不能进入本对象 |
| 直接发布事件 | 事件发布通过 outbox,不由 domain 直接调用 L0-bus |

### 7.3 7 类 MethodContent subtype

#### 7.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义真相与规则 |
| 对象类型 | domain aggregate subtype |
| 主要责任 | 表达 7 类 P0 方法定义资产各自的专属语义字段和引用关系 |

#### 7.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| qualification.level_model | QualificationLevelModel | 定义 Qualification 的等级模型 |
| role_definition.provided_qualifications | QualificationRefList | 定义角色提供或要求的 Qualification |
| task_definition.required_qualifications | QualificationRefList | 定义任务所需 Qualification |
| task_definition.input_outputs | WorkProductDefinitionRefList | 定义任务输入输出制品 |
| work_product_definition.acceptance_profile | AcceptanceProfile | 定义制品验收口径 |
| process_template_def.task_uses | TaskDefinitionUseList | 定义流程模板引用哪些任务 |
| view_profile.match_key | ViewProfileMatchKey | 定义 role + object_kind + scope 匹配键 |
| ai_policy_def.policy_source_ref | PolicySourceRef | 指向 governance 可消费的 policy source |

#### 7.3.3 状态集合

| 状态 | 作用 |
|---|---|
| 同 MethodContent | subtype 共享 MethodContent 生命周期 |

#### 7.3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| validate_kind_specific_rules() | 校验 subtype 自身语义规则 |
| collect_references() | 收集本 subtype 引用的其他 definition |
| to_snapshot_body() | 生成 snapshot 中的 subtype 正文骨架 |

#### 7.3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_method_content(MethodContent content) | 从 MethodContent 聚合视图取得 subtype 视图 |

#### 7.3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 7 类拆成 7 个主要组成部分 | 它们是对象类型,不是职责主线 |
| 在 subtype 中保存下游实例 | subtype 只保存 definition,不保存 runtime |

### 7.4 MethodContentLifecycle

#### 7.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义生命周期与发布治理 |
| 对象类型 | value object / state model |
| 主要责任 | 表达 MethodContent 生命周期值和可转换规则 |

#### 7.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| value | LifecycleValue | 当前生命周期值 |
| changed_at | Timestamp | 最近状态变化时间 |
| changed_by | ActorRef | 最近状态变化操作者 |

#### 7.4.3 状态集合

| 状态 | 作用 |
|---|---|
| draft | 可编辑草稿 |
| in_review | 等待审核 |
| published | 可消费版本 |
| deprecated | 保留历史但不推荐新引用 |
| retired | 不允许新引用 |
| superseded | 被新版本替代 |

#### 7.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| can_transition_to(LifecycleValue target) | 判断是否允许转换到目标状态 |
| allows_edit() | 判断当前状态是否允许编辑 |
| allows_new_reference() | 判断当前状态是否允许被新引用 |
| is_terminal() | 判断是否为终止状态 |

#### 7.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| initial_draft(ActorContext actor) | 创建初始 draft 状态 |
| from_persisted(LifecycleValue value, ActorRef changed_by, Timestamp changed_at) | 从持久化值恢复生命周期 |

#### 7.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 绕过状态转换规则直接赋值 | 必须通过受控转换 |
| 把状态转换结果写入下游仓 | 下游只能同步或引用状态 |

### 7.5 DefinitionVersion

#### 7.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义生命周期与发布治理 |
| 对象类型 | value object |
| 主要责任 | 表达定义资产版本,支撑 supersede、snapshot 和下游幂等 |

#### 7.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| version | VersionValue | 当前版本值 |
| previous_version | OptionalVersionValue | 上一个版本 |
| supersedes_content_id | OptionalMethodContentId | 被替代内容 |

#### 7.5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| next() | 生成下一版本值 |
| is_newer_than(DefinitionVersion other) | 判断版本先后 |

#### 7.5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| initial() | 创建初始版本 |
| from_persisted(VersionValue value) | 从持久化版本恢复 |

#### 7.5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 fingerprint 替代 version | fingerprint 表达语义内容,version 表达版本序列 |

### 7.6 Fingerprint

#### 7.6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义生命周期与发布治理 |
| 对象类型 | value object |
| 主要责任 | 表达 canonical definition 内容的语义指纹 |

#### 7.6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| value | FingerprintValue | 指纹值 |
| algorithm | FingerprintAlgorithm | 指纹算法标识 |
| canonical_source_ref | CanonicalSourceRef | 参与计算的 canonical 内容引用 |

#### 7.6.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| matches(FingerprintValue other) | 判断指纹是否一致 |
| differs_from(FingerprintValue other) | 判断是否存在 drift |

#### 7.6.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_canonical_definition(CanonicalDefinition canonical) | 从 canonical 内容生成指纹 |
| from_persisted(FingerprintValue value, FingerprintAlgorithm algorithm) | 从持久化值恢复 |

#### 7.6.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用自然语言摘要生成 fingerprint | 必须基于 canonical 内容 |
| 由下游猜测 fingerprint | fingerprint 由 method-library 权威生成 |

### 7.7 DefinitionReference

#### 7.7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义真相与规则 |
| 对象类型 | value object |
| 主要责任 | 表达 definition 之间的引用关系 |

#### 7.7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| target_content_id | MethodContentId | 被引用定义 |
| target_kind | MethodContentKind | 被引用定义类型 |
| target_version | OptionalDefinitionVersion | 可选固定版本 |
| reference_role | DefinitionReferenceRole | 引用角色,如 required / provided / input / output |

#### 7.7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| points_to(MethodContentId content_id) | 判断是否指向指定定义 |
| requires_published_target() | 判断目标是否必须已发布 |

#### 7.7.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create(MethodContentId target_content_id, MethodContentKind target_kind, DefinitionReferenceRole reference_role) | 创建定义引用 |

#### 7.7.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 引用下游实例对象 | 只能引用 method-library definition |
| 用自由文本表达权威引用 | 必须使用受控 ID 和 kind |

### 7.8 AuditRecord

#### 7.8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 方法定义生命周期与发布治理 |
| 对象类型 | audit record |
| 主要责任 | 记录生命周期变化、发布、废弃、退役、supersede 的审计事实 |

#### 7.8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| audit_id | AuditRecordId | 标识审计记录 |
| content_id | MethodContentId | 关联定义资产 |
| action | AuditAction | 审计动作 |
| actor_ref | ActorRef | 操作者 |
| gate_ref | OptionalApprovedGateRef | 发布 gate 引用 |
| reason | OptionalLifecycleReason | 变更原因 |
| before_version | OptionalDefinitionVersion | 变更前版本 |
| after_version | OptionalDefinitionVersion | 变更后版本 |
| fingerprint | OptionalFingerprint | 关联指纹 |
| occurred_at | Timestamp | 发生时间 |

#### 7.8.3 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_lifecycle_change(LifecycleChange change) | 从生命周期变化生成审计记录 |
| from_publish_result(PublishResult result) | 从发布结果生成审计记录 |

#### 7.8.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 事后覆盖审计记录 | 审计记录应追加,不覆盖历史 |
| 缺少 actor_ref | 发布、废弃、退役必须可追溯操作者 |

### 7.9 BoundaryViolation

#### 7.9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 关系校验与边界保护 |
| 对象类型 | domain error / boundary record |
| 主要责任 | 表达 Definition / Use 边界或引用边界违例 |

#### 7.9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| violation_id | BoundaryViolationId | 标识违例 |
| violation_kind | BoundaryViolationKind | 违例类型 |
| source_ref | BoundarySourceRef | 触发违例的请求或对象 |
| target_ref | OptionalBoundaryTargetRef | 相关目标对象 |
| message | BoundaryMessage | 概要说明 |

#### 7.9.3 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_use_truth_write(BoundarySourceRef source_ref) | 表达下游 Use truth 写入违例 |
| from_invalid_reference(DefinitionReference reference) | 表达非法引用违例 |

#### 7.9.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把违例静默吞掉 | 必须能阻断写入或留痕 |
| 用通用错误替代边界违例 | 边界违例需要可审计和可测试 |

### 7.10 OutboxEvent

#### 7.10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 定义同步与快照供给 |
| 对象类型 | outbox record |
| 主要责任 | 作为定义变化事件的可靠发布源 |

#### 7.10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| event_id | OutboxEventId | 标识事件 |
| event_kind | MethodLibraryEventKind | 事件类型 |
| content_id | MethodContentId | 关联定义资产 |
| kind | MethodContentKind | 关联定义类型 |
| version | DefinitionVersion | 关联版本 |
| fingerprint | Fingerprint | 关联指纹 |
| snapshot_ref | OptionalSnapshotRef | 完整定义快照引用 |
| status | OutboxStatus | 发布状态 |
| occurred_at | Timestamp | 事实发生时间 |

#### 7.10.3 状态集合

| 状态 | 作用 |
|---|---|
| pending | 等待 relay 发布 |
| published | 已成功发布到 L0-bus |
| failed | 发布失败,等待重试 |
| dead_letter | 多次失败后进入人工处理 |

#### 7.10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_published(Timestamp published_at) | 标记发布成功 |
| mark_failed(OutboxFailureReason reason) | 标记发布失败 |
| can_retry() | 判断是否允许重试 |

#### 7.10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_publish_result(PublishResult result) | 从发布结果生成事件 |
| from_retire_result(RetireResult result) | 从退役结果生成事件 |

#### 7.10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 绕过 outbox 直接发 bus | 会破坏可靠发布 |
| 事件载荷承载完整大正文 | 完整定义通过 snapshot 获取 |

### 7.11 DefinitionSnapshot

#### 7.11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 定义同步与快照供给 |
| 对象类型 | DTO / sync artifact |
| 主要责任 | 表达下游可同步的完整定义快照 |

#### 7.11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| snapshot_id | DefinitionSnapshotId | 标识快照 |
| content_id | MethodContentId | 关联定义资产 |
| kind | MethodContentKind | 定义类型 |
| version | DefinitionVersion | 定义版本 |
| fingerprint | Fingerprint | 语义指纹 |
| lifecycle | MethodContentLifecycle | 生命周期 |
| body | DefinitionSnapshotBody | 快照正文 |
| exported_at | Timestamp | 导出时间 |

#### 7.11.3 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_published_content(MethodContent content) | 从已发布定义生成快照 |
| from_version(MethodContent content, DefinitionVersion version) | 从指定版本生成快照 |

#### 7.11.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 成为第二定义真相 | snapshot 是同步制品,权威真相仍是 MethodContent |
| 省略 version / fingerprint | 下游幂等和 drift 判断依赖这些字段 |

### 7.12 查询投影对象

#### 7.12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 查询解析与审计追溯 |
| 对象类型 | query projection |
| 主要责任 | 支撑列表、详情、追溯、ResolveViewProfile 等高频只读查询 |

#### 7.12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| DefinitionReadModel.content_id | MethodContentId | 查询视图中的定义 ID |
| DefinitionReadModel.summary | MethodContentSummary | 列表 / 详情摘要 |
| DefinitionTraceProjection.content_id | MethodContentId | 追溯视图中的定义 ID |
| DefinitionTraceProjection.trace_items | DefinitionTraceItemList | 版本、fingerprint、audit、event、snapshot 链 |
| ViewProfileProjection.match_key | ViewProfileMatchKey | role + object_kind + scope 匹配键 |
| ViewProfileProjection.active_view_profile_id | MethodContentId | 当前 active ViewProfile |

#### 7.12.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| is_rebuildable() | 表达 projection 可从权威真相重建 |
| matches(ViewProfileMatchKey match_key) | 判断 ViewProfileProjection 是否匹配查询键 |

#### 7.12.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_method_content(MethodContent content) | 从定义真相构建 read model |
| from_trace_sources(TraceSourceSet sources) | 从 audit / event / snapshot 来源构建追溯投影 |

#### 7.12.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| projection 反写真相 | projection 可重建,不得覆盖 write model |
| 用 projection 判断发布合法性 | 发布规则由 domain / policy 判断 |

### 7.13 MethodPlugin(P1)

#### 7.13.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | P1 资产打包与配置组装 |
| 对象类型 | P1 domain aggregate |
| 主要责任 | 表达一组 MethodContent 的方法资产包 |

#### 7.13.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| plugin_id | MethodPluginId | 标识资产包 |
| lifecycle | PluginLifecycle | 表达 plugin 生命周期 |
| content_refs | MethodContentRefList | 引用已发布 MethodContent |
| package_metadata_ref | PackageMetadataRef | 面向 marketplace 的包元数据 |

#### 7.13.3 状态集合

| 状态 | 作用 |
|---|---|
| draft | 草稿资产包 |
| published | 已发布资产包 |
| deprecated | 已废弃资产包 |
| retired | 已退役资产包 |

#### 7.13.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| publish(ApprovedGateRef gate_ref, ActorContext actor) | 发布资产包 |
| retire(LifecycleReason reason, ActorContext actor) | 退役资产包 |

#### 7.13.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create_draft(MethodPluginDraftSpec spec, ActorContext actor) | 创建 P1 资产包草稿 |

#### 7.13.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 复制 MethodContent 正文 | plugin 只引用 MethodContent |
| 阻塞 P0 发布同步闭环 | P1 不作为 P0 前置条件 |

### 7.14 MethodConfiguration(P1)

#### 7.14.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | P1 资产打包与配置组装 |
| 对象类型 | P1 domain aggregate |
| 主要责任 | 表达组织或项目激活的一组方法资产组合 |

#### 7.14.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| configuration_id | MethodConfigurationId | 标识配置 |
| lifecycle | ConfigurationLifecycle | 表达配置生命周期 |
| selected_plugins | MethodPluginRefList | 被选择的 plugin |
| variability_applications | VariabilityApplicationList | 变体应用规则 |
| effective_content_set | MethodContentRefList | 生效的 MethodContent 集合 |

#### 7.14.3 状态集合

| 状态 | 作用 |
|---|---|
| draft | 草稿配置 |
| active | 已激活配置 |
| superseded | 被新配置替代 |
| retired | 已退役配置 |

#### 7.14.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| activate(ActorContext actor) | 激活配置 |
| supersede(MethodConfigurationId new_configuration_id, ActorContext actor) | 建立新旧配置替代关系 |
| retire(LifecycleReason reason, ActorContext actor) | 退役配置 |

#### 7.14.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create_draft(MethodConfigurationDraftSpec spec, ActorContext actor) | 创建 P1 配置草稿 |

#### 7.14.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| active 后原地修改核心组合 | 必须新版本或 supersede |
| 拥有 marketplace 交易真相 | listing / transaction / install record 归 marketplace |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §6。正式回填时应保留每个对象独立小节,但可适度裁剪本中间产物中的解释性文字。

```md
## 6. 关键对象轮廓

### 6.1 对象分布说明

| 主要组成部分 | 关键对象 |
|---|---|
| 方法定义生命周期与发布治理 | MethodContentLifecycle、DefinitionVersion、Fingerprint、AuditRecord |
| 方法定义真相与规则 | MethodContent、Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef、DefinitionReference |
| 关系校验与边界保护 | BoundaryViolation |
| 定义同步与快照供给 | OutboxEvent、DefinitionSnapshot |
| 查询解析与审计追溯 | DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection |
| P1 资产打包与配置组装 | MethodPlugin、MethodConfiguration |

本章按对象独立成节展开。每个对象至少包含基本信息,并按需包含关键字段、状态集合、成员函数、工厂函数和禁止事项。
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 6 |
|---|---|---|
| 是否同意 Step 6 只独立展开关键对象,不展开所有 service / port / job | 建议同意,service / port / job 留给 Step 7 / Step 8 / 详细设计 | 阻塞 |
| 是否同意 7 类 MethodContent subtype 合并为一个对象小节表达共同模式 | 建议同意,否则正式 §6 会过长且重复 | 阻塞 |
| 是否同意 P1 MethodPlugin / MethodConfiguration 保留对象轮廓但标记 P1 | 建议同意,保持边界但不阻塞 P0 | 不阻塞 |
| 是否同意对象函数只写参数类型,不写返回类型和完整 Rust 签名 | 建议同意,符合概要设计层级 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 7 前需要确认：

- [x] 是否同意本步列出的关键对象范围
- [x] 是否同意每个对象独立成节的格式
- [x] 是否同意 7 类 MethodContent subtype 在概要层合并表达共同对象模式
- [x] 是否同意 service / port / job 不在 Step 6 做完整对象骨架,留到接口、处理流和详细设计继续展开
