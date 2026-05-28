# Step 10. 定义状态机与转换矩阵

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 10 中间产物。
> 本步只收稳状态集合、状态转换图、转换矩阵、非法转换错误和状态副作用。
> 本步不新增业务协议,不改写 Step 6 已确认的 enum 变体名称,不展开事务隔离、持久化表结构或错误恢复细节。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
- 回填章节: `projects/L0-core/03-详细设计.md` §9 状态机与转换矩阵

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `02-概要设计.md` §9 | 已定义状态族、允许迁移和禁止迁移轮廓 | 作为状态机族和主线迁移来源 |
| Step 6 对象实现契约 | 已定义状态 enum、领域对象成员函数和应用服务函数 | 作为状态名、触发函数和对象边界来源 |
| Step 7 Port / Adapter 契约 | 已定义 repository、reference、projection、outbox 等 port | 作为 projection / outbox 边界状态的触发来源 |
| Step 8 协议契约 | 已定义 Command / Query / Event / Job 协议清单 | 作为状态变化可被外部触发的入口来源 |
| Step 9 函数级处理流 | 已定义会触发状态变化的 Command / Job / Event flow | 作为转换矩阵中的处理流来源 |

已确认结论:

```text
状态名必须使用 Step 6 中的 Rust enum 变体名,例如 Draft / InReview / Published。
状态转换必须能回指 Step 6 的对象函数、Step 9 的处理流或 Step 7 的 port 边界。
Query 路径不得修改 truth 状态;read model / projection 状态只表达读面可用性。
Outbox runtime 状态不在本步扩展为领域状态机;本步只固定 L0-core 自有状态对象。
```

---

## 3. 本步写作策略

本步沿用长文档写作规则:

```text
骨架先行 + 分批填充 + 状态推进 + 格式约束 + 最后收口
```

写作约束:

- 每个正式状态机必须包含状态集合表、ASCII 状态图、转换矩阵。
- 每个转换矩阵中的状态名必须与 Step 6 enum 变体完全一致。
- 每个触发函数必须写出对象名、函数名和参数类型。
- P0 已有处理流触发的转换必须写入矩阵。
- 当前 P0 没有入口但 Step 6 已出现的状态迁移,必须标注为 P1 / operations / 待回补,不能伪装成已实现入口。
- 非法转换统一映射到 `DomainError::IllegalStateTransition`,再由 application service 映射为 `ApplicationError::PreconditionFailed`。
- 非法转换默认写审计意图,但具体审计落点在 Step 15 固定。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 | 覆盖状态机 |
|---|---|---|---|
| 10.1 | [x] | 状态机总览与统一规则 | 全部状态机 |
| 10.2 | [x] | 契约定义生命周期状态机 | `ContractLifecycleState` |
| 10.3 | [x] | 发布与兼容状态机 | `CompatibilityValue`、`ContractReleaseBaselineStatus`、`ContractReleaseSnapshotStatus` |
| 10.4 | [x] | 事实传播与消费状态机 | `FactDeliveryStatus`、`DownstreamConsumptionStatus` |
| 10.5 | [x] | 引用与读面投影状态机 | `ReferenceState`、`IndexState`、`TraceIndexState`、`ReadModelState`、`ProjectionState` |
| 10.6 | [x] | 契约包生命周期状态机 | `ContractPackageLifecycleState` |
| 10.7 | [x] | 非法转换处理表 | 全部状态机 |
| 10.8 | [x] | Step 10 统一复核 | 全部状态机 |

---

## 5. SOP 问题回答

### 5.1 当前仓有哪些正式状态机？

| 状态机 | 状态 enum | 所属对象 | 是否 P0 必须实现 | 说明 |
|---|---|---|---|---|
| 契约定义生命周期 | `ContractLifecycleState` | `ContractLifecycle` / `ContractDefinition` | 是 | 主线 truth 状态机 |
| 兼容性状态 | `CompatibilityValue` | `CompatibilityStatus` | 是 | 发布门禁前置状态 |
| 发布基线状态 | `ContractReleaseBaselineStatus` | `ContractReleaseBaseline` | 是 | 发布锚点状态 |
| 发布快照状态 | `ContractReleaseSnapshotStatus` | `ContractReleaseSnapshot` | 是 | 快照派生和消费状态 |
| 事实输出状态 | `FactDeliveryStatus` | `ContractFactRecord` | 是 | 事实记录传播状态 |
| 下游消费状态 | `DownstreamConsumptionStatus` | `DownstreamConsumptionRef` | 是 | 下游消费引用状态 |
| 外部引用状态 | `ReferenceState` | `ExternalReference` / `EventCatalogReference` | 是 | 外部引用有效性状态 |
| 标准映射索引状态 | `IndexState` | `StandardMappingIndex` | 是 | 标准映射索引可用性状态 |
| 兼容追溯索引状态 | `TraceIndexState` | `CompatibilityTraceIndex` | 是 | 兼容追溯读面状态 |
| 只读模型状态 | `ReadModelState` | `ContractReadModel` | 是 | 查询 read model 可用性状态 |
| 追溯投影状态 | `ProjectionState` | `ContractTraceProjection` | 是 | 追溯 projection 可用性状态 |
| 契约包生命周期 | `ContractPackageLifecycleState` | `ContractPackageLifecycle` | P1 / 包管理扩展 | Step 6 已定义,但 Step 8 / 9 尚未提供包写协议 |

不作为本步正式状态机:

| 项 | 原因 |
|---|---|
| `ContractFactKind` | 分类 enum,不是状态机 |
| `ExternalReferenceKind` | 分类 enum,不是状态机 |
| `ContractScopeKind` | 分类 enum,不是状态机 |
| outbox event 内部状态 | 属于 `OutboxPort` 持久化 / relay 实现细节,Step 11 / 12 再定义 |

### 5.2 每个状态机的状态集合是什么？

状态集合在 §10.2 ~ §10.6 逐一展开。统一要求是:状态集合必须完全使用 Step 6 enum 变体名,不得使用概要设计中的小写展示名替代。

### 5.3 哪些函数会触发状态转换？

触发来源分三类:

| 触发来源 | 示例 | 说明 |
|---|---|---|
| domain object 函数 | `ContractDefinition.publish(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | 修改 truth 聚合或领域对象状态 |
| application service / job flow | `ContractReleaseService.publish_contract_baseline(PublishContractBaseline command, ActorContext actor, CommandMetadata meta)` | 编排多个对象状态变化 |
| port 边界 | `ProjectionStorePort.mark_stale(ProjectionName projection_name, ProjectionStaleReason reason, Timestamp marked_at)` | 只影响读面 / projection / adapter 状态 |

### 5.4 每个转换的前置条件、副作用和错误是什么？

每个状态机小节均按统一矩阵列出:

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|

### 5.5 非法转换应该返回什么错误，是否写审计？

统一口径:

| 层级 | 错误 | 审计口径 |
|---|---|---|
| domain object | `DomainError::IllegalStateTransition` | 领域对象不直接写审计 |
| application service | `ApplicationError::PreconditionFailed` | 对外返回前写审计意图 |
| port / adapter | `PortError::Conflict` 或 `PortError::InvalidState` | 由调用方映射并写审计意图 |
| query | 不修改状态;状态不可用时返回 `ApplicationError::PreconditionFailed` 或带 stale 标记的 view | 查询不写状态变更审计 |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| 概要设计使用小写状态名,Step 6 使用 Rust enum 变体名 | 实现者容易写出两套状态码 | 本步全部使用 `Draft`、`InReview` 等 enum 变体名 |
| Step 9 中出现 `fact pending -> queued`,但 Step 6 没有 `Queued` 变体 | 事实状态与 outbox 队列状态容易混淆 | 本步明确 `FactDeliveryStatus` 没有 `Queued`;队列由 outbox 记录表达 |
| 部分读面状态在概要设计中写作 `ready`,Step 6 中实际是 `Active` | read model / projection 状态名不一致 | 本步以 `Active` 为准 |
| 部分状态 enum 已定义,但 P0 协议未提供写入口 | 可能误以为所有迁移都已可外部触发 | 本步区分 P0、P1 / operations 和待回补入口 |
| 非法转换没有统一错误口径 | 实现时每个对象可能返回不同错误 | 本步统一 domain / application / port 映射 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 状态表达 | 概要设计只有状态图和允许 / 禁止清单 | 每个状态机都有状态集合表、ASCII 图和转换矩阵 |
| 状态名 | 小写展示名和 Rust enum 变体名混用 | 全部使用 Step 6 enum 变体名 |
| 触发函数 | 只知道哪些 flow 会修改状态 | 每条转换都绑定对象函数、service flow 或 port 函数 |
| 非法转换 | 只写“禁止” | 写明错误类型和审计口径 |
| 读面状态 | 和 truth 状态容易混在一起 | 明确 read model / projection 只表达查询可用性 |
| outbox 状态 | 容易被误当成领域状态机 | 明确 outbox 状态由持久化 / relay 处理,不扩展领域 enum |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 状态矩阵是否覆盖所有 enum | 只覆盖主线 truth enum | 覆盖所有正式状态 enum,但标注 P0 / P1 | B | Step 6 已正式定义多个状态对象,详细设计应给实现者完整约束 |
| 状态名使用小写还是 enum 变体 | 沿用概要设计小写 | 使用 Rust enum 变体 | B | 实现契约必须贴近代码,减少转换误差 |
| outbox 是否作为状态机 | 加入本步 | 不加入本步,留给持久化 / relay | B | 当前没有正式 outbox 状态 enum,且 outbox 是 port / adapter 边界 |
| 非法转换是否写审计 | 只返回错误 | application service 记录审计意图 | B | 非法状态迁移是重要操作事实,但 domain object 不应直接写审计 |

---

## 9. 结构化中间产物

### 9.1 状态机总览图

```text
[ContractDefinition truth]
  ContractLifecycleState
        |
        | publish gate passed
        v
[Release truth]
  CompatibilityValue -> ContractReleaseBaselineStatus -> ContractReleaseSnapshotStatus
        |
        | fact / snapshot / projection jobs
        v
[Propagation state]
  FactDeliveryStatus -> DownstreamConsumptionStatus
        |
        | reference / rebuild / stale marking
        v
[Read side state]
  ReferenceState / IndexState / TraceIndexState / ReadModelState / ProjectionState

[Package extension]
  ContractPackageLifecycleState
```

关键说明:

- `ContractLifecycleState` 是最核心 truth 生命周期。
- 发布状态和兼容状态不替代契约定义生命周期,只作为发布门禁和发布锚点。
- 事实、消费、引用和读面状态都不能反向改写 `ContractDefinition`。
- 契约包生命周期属于包管理扩展,当前 P0 只定义矩阵,不新增外部写协议。

### 9.2 统一状态转换错误

| 场景 | domain 错误 | application 映射 | 是否保持原状态 |
|---|---|---|---|
| from / to 不在允许矩阵 | `DomainError::IllegalStateTransition` | `ApplicationError::PreconditionFailed` | 是 |
| 终态继续迁移 | `DomainError::IllegalStateTransition` | `ApplicationError::PreconditionFailed` | 是 |
| 缺少必须 reason / gate / evidence | `DomainError::InvariantViolation` | `ApplicationError::PreconditionFailed` | 是 |
| 乐观锁冲突导致状态保存失败 | 不进入 domain 错误 | `ApplicationError::Conflict` | 是 |
| projection port 状态更新失败 | 不进入 domain 错误 | `ApplicationError::Port` | 是 |

### 9.3 `ContractLifecycleState` 状态机

#### 9.3.1 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | 可编辑草稿,不能被下游作为权威契约引用 | 否 | `update_draft`、`submit_for_review` |
| `InReview` | 发布前检查中 | 否 | `publish`;P1 可支持退回草稿 |
| `Published` | 权威共享契约 | 否 | `deprecate`、`retire`、`supersede` |
| `Deprecated` | 仍可追溯但不建议新增消费 | 否 | `retire`、`supersede` |
| `Retired` | 生命周期终止 | 是 | 只读查询、追溯 |
| `Superseded` | 被新定义替代 | 是 | 只读查询、追溯 |

#### 9.3.2 状态转换图

```text
<ContractLifecycleState>
  Draft
    | ContractDefinition.submit_for_review(ActorContext actor, Timestamp now)
    v
  InReview
    | ContractDefinition.publish(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
    v
  Published
    | ContractDefinition.deprecate(LifecycleReason reason, ActorContext actor, Timestamp now)
    v
  Deprecated
    | ContractDefinition.retire(LifecycleReason reason, ActorContext actor, Timestamp now)
    v
  Retired

  Published
    | ContractDefinition.retire(LifecycleReason reason, ActorContext actor, Timestamp now)
    v
  Retired

  Published / Deprecated
    | ContractDefinition.supersede(ContractDefinitionId new_definition_id, ActorContext actor, Timestamp now)
    v
  Superseded

  InReview
    | P1: 评审驳回后退回草稿
    v
  Draft
```

关键说明:

- `Draft` 的创建由 `ContractDefinition::create_draft(...)` 完成,不是从其他状态迁移而来。
- `InReview -> Draft` 在 Step 6 变体表中被允许,但当前 Step 8 / 9 没有 P0 command 和对象函数;本步标注为 P1 回补。
- `Retired` 和 `Superseded` 是终态,不得回到 `Published`、`InReview` 或 `Draft`。

#### 9.3.3 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Draft` | `ContractDefinition::create_draft(ContractDefinitionId definition_id, ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)` | 范围、正文引用、边界校验通过 | 初始化 `ContractLifecycle::initial_draft(...)`,追加创建演进记录 | `DomainError::InvariantViolation` |
| `Draft` | `Draft` | `ContractDefinition.update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)` | 当前状态 `allows_edit() == true`;expected version 匹配 | 更新 `body_ref`、`fingerprint`、`reference_set`、`updated_at`,追加草稿演进记录 | `DomainError::IllegalStateTransition` |
| `Draft` | `InReview` | `ContractDefinition.submit_for_review(ActorContext actor, Timestamp now)` | 草稿内容完整;引用校验通过 | 生命周期迁移,追加评审演进记录,写 `ContractReviewSubmitted` outbox | `DomainError::IllegalStateTransition` |
| `InReview` | `Published` | `ContractDefinition.publish(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | gate approved;fingerprint 匹配;compatibility passable | 生命周期迁移,追加发布演进记录,与 baseline release 同事务保存 | `DomainError::IllegalStateTransition` |
| `Published` | `Deprecated` | `ContractDefinition.deprecate(LifecycleReason reason, ActorContext actor, Timestamp now)` | `reason` 存在;当前未终止 | 生命周期迁移,写 `ContractLifecycleChanged` outbox | `DomainError::IllegalStateTransition` |
| `Published` | `Retired` | `ContractDefinition.retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | `reason` 存在;当前未终止 | 生命周期迁移,写 `ContractLifecycleChanged` outbox | `DomainError::IllegalStateTransition` |
| `Deprecated` | `Retired` | `ContractDefinition.retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | `reason` 存在;当前未终止 | 生命周期迁移,写 `ContractLifecycleChanged` outbox | `DomainError::IllegalStateTransition` |
| `Published` | `Superseded` | `ContractDefinition.supersede(ContractDefinitionId new_definition_id, ActorContext actor, Timestamp now)` | `new_definition_id` 有效且不是自身 | 生命周期迁移,追加替代演进记录,写 `ContractLifecycleChanged` outbox | `DomainError::IllegalStateTransition` |
| `Deprecated` | `Superseded` | `ContractDefinition.supersede(ContractDefinitionId new_definition_id, ActorContext actor, Timestamp now)` | `new_definition_id` 有效且不是自身 | 生命周期迁移,追加替代演进记录,写 `ContractLifecycleChanged` outbox | `DomainError::IllegalStateTransition` |
| `InReview` | `Draft` | P1:`ContractDefinition.return_to_draft(ReviewRejectionReason reason, ActorContext actor, Timestamp now)` | 当前 P0 无 command;需要后续补对象函数和协议 | 退回草稿并追加评审驳回记录 | `DomainError::IllegalStateTransition` |

#### 9.3.4 处理流绑定

| 处理流 | 状态转换 |
|---|---|
| `CreateContractDraftFlow` | 创建 `Draft` |
| `UpdateContractDraftFlow` | `Draft -> Draft` |
| `SubmitContractForReviewFlow` | `Draft -> InReview` |
| `PublishContractBaselineFlow` | `InReview -> Published` |
| `UpdateContractLifecycleFlow` | `Published / Deprecated -> Deprecated / Retired / Superseded` |

### 9.4 发布与兼容状态机

#### 9.4.1 `CompatibilityValue` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 尚未完成兼容性判断 | 否 | `mark_compatible`、`mark_incompatible` |
| `Compatible` | 兼容性检查通过,可进入发布判断 | 否 | `reset_pending`、只读查询 |
| `Incompatible` | 兼容性检查不通过,阻断发布 | 否 | `reset_pending`、只读查询 |

#### 9.4.2 `CompatibilityValue` 状态转换图

```text
<CompatibilityValue>
  Pending
    | CompatibilityStatus.mark_compatible(ActorContext actor, Option<CompatibilityTraceRef> trace_ref, Timestamp now)
    v
  Compatible
    | CompatibilityStatus.reset_pending(ActorContext actor, Timestamp now)
    v
  Pending

  Pending
    | CompatibilityStatus.mark_incompatible(ActorContext actor, CompatibilityReason reason, Option<CompatibilityTraceRef> trace_ref, Timestamp now)
    v
  Incompatible
    | CompatibilityStatus.reset_pending(ActorContext actor, Timestamp now)
    v
  Pending
```

#### 9.4.3 `CompatibilityValue` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Pending` | `CompatibilityStatus::pending(ActorContext actor, Timestamp now)` | 草稿变化、发布前校验或重新检查请求成立 | 初始化检查时间和检查者 | `DomainError::InvariantViolation` |
| `Pending` | `Compatible` | `CompatibilityStatus.mark_compatible(ActorContext actor, Option<CompatibilityTraceRef> trace_ref, Timestamp now)` | toolchain / gate 判定兼容;无阻断原因 | 记录检查者、检查时间和追溯引用;写 `ContractCompatibilityStatusChanged` outbox | `DomainError::IllegalStateTransition` |
| `Pending` | `Incompatible` | `CompatibilityStatus.mark_incompatible(ActorContext actor, CompatibilityReason reason, Option<CompatibilityTraceRef> trace_ref, Timestamp now)` | toolchain / gate 判定不兼容;`reason` 存在 | 记录阻断原因、检查者、检查时间和追溯引用;写 `ContractCompatibilityStatusChanged` outbox | `DomainError::IllegalStateTransition` |
| `Compatible` | `Pending` | `CompatibilityStatus.reset_pending(ActorContext actor, Timestamp now)` | definition、baseline 或规则变化需要重新检查 | 清理或更新检查上下文,保留历史追溯 | `DomainError::IllegalStateTransition` |
| `Incompatible` | `Pending` | `CompatibilityStatus.reset_pending(ActorContext actor, Timestamp now)` | 修正后重新检查 | 清理或更新检查上下文,保留历史追溯 | `DomainError::IllegalStateTransition` |

关键说明:

- 不允许 `Compatible -> Incompatible` 或 `Incompatible -> Compatible` 直接覆盖;必须先回到 `Pending`,再生成新的检查结论。
- `Compatible` 不等于已经发布,只表示发布服务可以继续检查 gate、fingerprint 和基线条件。

#### 9.4.4 `ContractReleaseBaselineStatus` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | 已准备但尚未正式发布 | 否 | `mark_released` |
| `Released` | 已正式发布的发布锚点 | 否 | `bind_snapshot`、`supersede`、`retire` |
| `Superseded` | 已被新基线替代 | 是 | 只读查询、追溯 |
| `Retired` | 已退役 | 是 | 只读查询、追溯 |

#### 9.4.5 `ContractReleaseBaselineStatus` 状态转换图

```text
<ContractReleaseBaselineStatus>
  Prepared
    | ContractReleaseBaseline.mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
    v
  Released
    +-----------------------------+
    |                             |
    | supersede(...)              | retire(...)
    v                             v
  Superseded                    Retired
```

#### 9.4.6 `ContractReleaseBaselineStatus` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Prepared` | `ContractReleaseBaseline::create_draft(ContractReleaseBaselineId baseline_id, ContractDefinition definition, CompatibilityStatus compatibility_status, ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | definition 可发布;compatibility passable;gate approved;fingerprint 匹配 | 创建准备态基线,绑定 definition、version、scope、gate 和 fingerprint | `DomainError::InvariantViolation` |
| `Prepared` | `Released` | `ContractReleaseBaseline.mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)` | gate 仍有效;基线未发布;definition 已进入 `Published` 或同事务即将进入 `Published` | 标记发布者和发布时间;写 `ContractBaselinePublished` outbox | `DomainError::IllegalStateTransition` |
| `Released` | `Released` | `ContractReleaseBaseline.bind_snapshot(ReleaseSnapshotRef snapshot_ref)` | `snapshot_ref` 匹配当前基线 | 绑定快照引用;不改变状态 | `DomainError::InvariantViolation` |
| `Released` | `Superseded` | `ContractReleaseBaseline.supersede(ContractReleaseBaselineId new_baseline_id, ActorContext actor, Timestamp now)` | 新基线有效且不是自身 | 标记被替代,保留追溯 | `DomainError::IllegalStateTransition` |
| `Released` | `Retired` | `ContractReleaseBaseline.retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 进入退役终态,不得再绑定新快照 | `DomainError::IllegalStateTransition` |

关键说明:

- `Prepared -> Released` 只能由 `PublishContractBaselineFlow` 完成。
- `Released -> Prepared` 禁止;基线一旦发布不可回退为准备态。

#### 9.4.7 `ContractReleaseSnapshotStatus` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Building` | 正在从发布基线派生快照 | 否 | `mark_ready` |
| `Ready` | 可供下游消费 | 否 | `archive`;P1 可支持 supersede |
| `Superseded` | 已被新快照替代 | 是 | 只读查询、追溯 |
| `Archived` | 已归档 | 是 | 只读查询、追溯 |

#### 9.4.8 `ContractReleaseSnapshotStatus` 状态转换图

```text
<ContractReleaseSnapshotStatus>
  Building
    | ContractReleaseSnapshot.mark_ready(ContractFingerprint fingerprint, SnapshotBlobRef body_ref, Timestamp now)
    v
  Ready
    +-----------------------------+
    |                             |
    | P1: mark_superseded(...)    | archive(...)
    v                             v
  Superseded                    Archived
```

#### 9.4.9 `ContractReleaseSnapshotStatus` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Building` | `ContractReleaseSnapshot::from_baseline(ContractReleaseSnapshotId snapshot_id, ContractReleaseBaseline baseline, SnapshotBlobRef body_ref, ActorContext actor, Timestamp now)` | baseline 为 `Released`;快照正文引用可生成 | 创建快照元数据,只保存 `SnapshotBlobRef` | `DomainError::InvariantViolation` |
| `Building` | `Ready` | `ContractReleaseSnapshot.mark_ready(ContractFingerprint fingerprint, SnapshotBlobRef body_ref, Timestamp now)` | exporter 成功;fingerprint 与快照正文匹配 | 标记可消费;保存快照元数据;写 `ContractSnapshotReady` outbox | `DomainError::IllegalStateTransition` |
| `Ready` | `Archived` | `ContractReleaseSnapshot.archive(ActorContext actor, Timestamp now)` | 快照不再需要作为当前消费面 | 进入归档终态 | `DomainError::IllegalStateTransition` |
| `Ready` | `Superseded` | P1:`ContractReleaseSnapshot.mark_superseded(ReleaseSnapshotRef new_snapshot_ref, ActorContext actor, Timestamp now)` | 新快照有效且替代当前快照;当前 P0 尚未定义该成员函数 | 标记被新快照替代,保留追溯 | `DomainError::IllegalStateTransition` |

关键说明:

- `Building -> Ready` 是 P0 必须实现路径,由 `DeriveReleaseSnapshotJobFlow` 触发。
- 快照派生失败不引入 `Failed` 状态;失败由 job 失败事实、审计和重试机制表达。
- `Ready -> Building` 禁止;需要重新派生时应创建新快照或进入 P1 替代流程。

#### 9.4.10 处理流绑定

| 处理流 | 状态转换 |
|---|---|
| `ValidateContractChangeJobFlow` | `CompatibilityValue::Pending -> Compatible / Incompatible` |
| `PublishContractBaselineFlow` | `ContractLifecycleState::InReview -> Published`;`ContractReleaseBaselineStatus::Prepared -> Released` |
| `DeriveReleaseSnapshotJobFlow` | `ContractReleaseSnapshotStatus::Building -> Ready` |
| `UpdateContractLifecycleFlow` | 可能触发旧 baseline / snapshot 的 `Released / Ready -> Superseded / Retired / Archived` 承接,具体 P1 操作入口需后续补齐 |

### 9.5 事实传播与消费状态机

#### 9.5.1 `FactDeliveryStatus` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 事实已生成,等待输出 | 否 | `mark_published`、`mark_failed` |
| `Published` | 事实已成功输出 | 否 | `archive` |
| `Failed` | 事实输出失败,可恢复 | 否 | `reset_pending`、`mark_published`、`archive` |
| `Archived` | 事实记录已归档 | 是 | 只读查询、追溯 |

#### 9.5.2 `FactDeliveryStatus` 状态转换图

```text
<FactDeliveryStatus>
  Pending
    +-----------------------------+
    |                             |
    | mark_published(...)         | mark_failed(...)
    v                             v
  Published                     Failed
    |                             |
    | archive(...)                | reset_pending(...)
    v                             v
  Archived                     Pending

  Failed
    | mark_published(...)
    v
  Published

  Failed
    | archive(...)
    v
  Archived
```

#### 9.5.3 `FactDeliveryStatus` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Pending` | `ContractFactRecord::create(ContractFactRecordSpec spec, ActorContext actor, Timestamp now)` | fact kind、definition、baseline、snapshot 引用满足约束 | 创建事实锚点;可同事务写 outbox | `DomainError::InvariantViolation` |
| 创建 | `Pending` | `ContractFactRecord::from_release_change(ContractFactRecordId fact_id, ContractReleaseBaseline baseline, Option<ContractReleaseSnapshot> snapshot, ActorContext actor, Timestamp now)` | baseline / snapshot 匹配 | 创建发布相关事实锚点 | `DomainError::InvariantViolation` |
| `Pending` | `Published` | `ContractFactRecord.mark_published(Timestamp published_at)` | outbox relay 或事实发布边界确认成功 | 标记输出成功时间;可写 `ContractFactPublished` 摘要 | `DomainError::IllegalStateTransition` |
| `Pending` | `Failed` | `ContractFactRecord.mark_failed(FactFailureReason reason, Timestamp now)` | relay / publisher 返回失败;`reason` 存在 | 保留失败状态和审计引用 | `DomainError::IllegalStateTransition` |
| `Failed` | `Pending` | `ContractFactRecord.reset_pending(ActorContext actor, Timestamp now)` | 可重试;未归档 | 重新进入待输出,保留历史失败记录 | `DomainError::IllegalStateTransition` |
| `Failed` | `Published` | `ContractFactRecord.mark_published(Timestamp published_at)` | 重试发布成功 | 标记输出成功时间 | `DomainError::IllegalStateTransition` |
| `Published` | `Archived` | `ContractFactRecord.archive(ActorContext actor, Timestamp now)` | 归档策略允许 | 进入归档终态 | `DomainError::IllegalStateTransition` |
| `Failed` | `Archived` | `ContractFactRecord.archive(ActorContext actor, Timestamp now)` | 不再重试且归档策略允许 | 进入归档终态 | `DomainError::IllegalStateTransition` |

关键说明:

- `FactDeliveryStatus` 没有 `Queued` 状态。
- Step 9 中“fact pending -> queued”的含义应修正为:事实保持 `Pending`,并写入 outbox 待发布记录。
- outbox 的 pending / published / failed 是 relay 持久化状态,不是 `ContractFactRecord.delivery_status` 的新增 enum。

#### 9.5.4 `DownstreamConsumptionStatus` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 尚未消费或尚未绑定下游消费 | 否 | `mark_consumed`、`bind_snapshot` |
| `Synced` | 已消费或已绑定 | 否 | `mark_stale`、`retire` |
| `Stale` | 消费引用过期,需要刷新 | 否 | `mark_consumed`、`retire` |
| `Retired` | 消费引用退役 | 是 | 只读查询、追溯 |

#### 9.5.5 `DownstreamConsumptionStatus` 状态转换图

```text
<DownstreamConsumptionStatus>
  Pending
    | DownstreamConsumptionRef.mark_consumed(Timestamp consumed_at)
    v
  Synced
    | DownstreamConsumptionRef.mark_stale()
    v
  Stale
    | DownstreamConsumptionRef.mark_consumed(Timestamp consumed_at)
    v
  Synced

  Synced / Stale
    | DownstreamConsumptionRef.retire(LifecycleReason reason, ActorContext actor, Timestamp now)
    v
  Retired
```

#### 9.5.6 `DownstreamConsumptionStatus` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Pending` | `DownstreamConsumptionRef::create(DownstreamConsumptionRefId consumption_ref_id, DownstreamDomainRef downstream_domain, ContractReleaseBaseline baseline, ActorContext actor, Timestamp now)` | baseline 可消费;downstream domain 有效 | 创建消费引用;可等待 snapshot 绑定 | `DomainError::InvariantViolation` |
| `Pending` | `Pending` | `DownstreamConsumptionRef.bind_snapshot(ReleaseSnapshotRef snapshot_ref)` | snapshot 匹配 baseline | 绑定快照引用;状态不变 | `DomainError::InvariantViolation` |
| `Pending` | `Synced` | `DownstreamConsumptionRef.mark_consumed(Timestamp consumed_at)` | 下游确认消费或本地绑定完成 | 写入最近消费时间 | `DomainError::IllegalStateTransition` |
| `Synced` | `Stale` | `DownstreamConsumptionRef.mark_stale()` | 新 baseline / snapshot 出现或消费引用过期 | 暴露 stale 给查询方和下游刷新任务 | `DomainError::IllegalStateTransition` |
| `Stale` | `Synced` | `DownstreamConsumptionRef.mark_consumed(Timestamp consumed_at)` | 下游重新消费或刷新成功 | 更新最近消费时间 | `DomainError::IllegalStateTransition` |
| `Synced` | `Retired` | `DownstreamConsumptionRef.retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 进入终态 | `DomainError::IllegalStateTransition` |
| `Stale` | `Retired` | `DownstreamConsumptionRef.retire(LifecycleReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 进入终态 | `DomainError::IllegalStateTransition` |

关键说明:

- `Retired -> Synced` 禁止。
- `Pending -> Retired` 当前不开放;如果未消费引用需要取消,后续应单独定义 cancel / tombstone 语义,不能复用退役。
- 消费状态不代表下游仓完成强一致写入,只表达本仓可感知的消费关系。

#### 9.5.7 处理流绑定

| 处理流 | 状态转换 |
|---|---|
| `PublishContractFactJobFlow` | 创建或整理 `FactDeliveryStatus::Pending`;不创建 `Queued` |
| `OutboxRelayFlow` | outbox relay 成功后可触发 `FactDeliveryStatus::Pending / Failed -> Published`;失败后触发 `Pending -> Failed` |
| `DeriveReleaseSnapshotJobFlow` | 创建 / 刷新 `DownstreamConsumptionRef`,绑定 snapshot,等待或标记消费状态 |
| `RebuildContractIndexJobFlow` | 可能把过期消费引用暴露给读面,但不得直接假装下游已同步 |

### 9.6 引用与读面投影状态机

#### 9.6.1 `ReferenceState` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | 待解析 | 否 | `resolve`、`invalidate` |
| `Resolved` | 已解析且当前可用 | 否 | `mark_stale`、`invalidate` |
| `Invalidated` | 已失效 | 是 | 只读查询、追溯 |
| `Stale` | 已过期,需要重新解析 | 否 | `resolve`、`invalidate` |

#### 9.6.2 `ReferenceState` 状态转换图

```text
<ReferenceState>
  Pending
    +-------------------------+
    |                         |
    | resolve(...)            | invalidate(...)
    v                         v
  Resolved                 Invalidated
    |
    | mark_stale(...)
    v
  Stale
    +-------------------------+
    |                         |
    | resolve(...)            | invalidate(...)
    v                         v
  Resolved                 Invalidated
```

#### 9.6.3 `ReferenceState` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Pending` | `ExternalReference::create(ExternalReferenceId reference_id, ExternalReferenceKind kind, ExternalUri uri, String title, ActorContext actor, Timestamp now)` | URI 合法;不保存外部正文 | 创建外部引用元数据 | `DomainError::InvariantViolation` |
| 创建 | `Pending` | `EventCatalogReference::from_catalog_ref(EventCatalogReferenceId reference_id, EventCatalogRef catalog_ref, ContractKind contract_kind, ActorContext actor, Timestamp now)` | catalog ref 合法;不保存事件实例正文 | 创建事件目录引用元数据 | `DomainError::InvariantViolation` |
| `Pending` | `Resolved` | `ExternalReference.resolve(ActorContext actor, Timestamp now)` | resolver 证明引用可用 | 写入 `resolved_at` | `DomainError::IllegalStateTransition` |
| `Pending` | `Resolved` | `EventCatalogReference.resolve(CatalogVersion catalog_version, ActorContext actor, Timestamp now)` | event catalog ref 可解析;`catalog_version` 有效 | 写入目录版本、解析时间和解析者 | `DomainError::IllegalStateTransition` |
| `Pending` | `Invalidated` | `ExternalReference.invalidate(ReferenceInvalidationReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 标记失效,保留引用元数据 | `DomainError::IllegalStateTransition` |
| `Pending` | `Invalidated` | `EventCatalogReference.invalidate(ReferenceInvalidationReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 标记目录引用失效 | `DomainError::IllegalStateTransition` |
| `Resolved` | `Stale` | `ExternalReference.mark_stale(ActorContext actor, Timestamp now)` | 上游引用可能变化或解析结果过期 | 暴露 stale,等待重新解析 | `DomainError::IllegalStateTransition` |
| `Resolved` | `Invalidated` | `ExternalReference.invalidate(ReferenceInvalidationReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 标记失效 | `DomainError::IllegalStateTransition` |
| `Resolved` | `Invalidated` | `EventCatalogReference.invalidate(ReferenceInvalidationReason reason, ActorContext actor, Timestamp now)` | `reason` 存在 | 标记目录引用失效 | `DomainError::IllegalStateTransition` |
| `Stale` | `Resolved` | `ExternalReference.resolve(ActorContext actor, Timestamp now)` | 重新解析成功 | 更新解析时间 | `DomainError::IllegalStateTransition` |
| `Stale` | `Invalidated` | `ExternalReference.invalidate(ReferenceInvalidationReason reason, ActorContext actor, Timestamp now)` | 重新解析确认不可用或人工废弃 | 标记失效 | `DomainError::IllegalStateTransition` |

关键说明:

- `EventCatalogReference` 复用 `ReferenceState`,但当前 Step 6 没有 `mark_stale` 成员函数;事件目录引用过期时应通过 `invalidate(...)` 或后续 P1 补 `mark_stale(...)`。
- `Invalidated` 是终态,不得重新 `resolve`。

#### 9.6.4 `IndexState` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | 草稿索引,尚不可作为稳定查询依据 | 否 | 激活或重建 |
| `Active` | 可用索引 | 否 | `map_to_contract`、`rebuild`、mark stale |
| `Stale` | 已过期,需要重建 | 否 | `rebuild` |
| `Rebuilding` | 正在重建 | 否 | 完成后进入 `Active` |

#### 9.6.5 `IndexState` 状态转换图

```text
<IndexState>
  Draft
    | StandardMappingIndex.rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)
    v
  Active
    | ProjectionStorePort.mark_stale(ProjectionName projection_name, ProjectionStaleReason reason, Timestamp marked_at)
    v
  Stale
    | StandardMappingIndex.rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)
    v
  Rebuilding
    | rebuild completed
    v
  Active

  Active
    | StandardMappingIndex.rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)
    v
  Rebuilding
```

#### 9.6.6 `IndexState` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Draft` | `StandardMappingIndex::create_draft(StandardMappingIndexId index_id, StandardRef standard_ref, ContractKind contract_kind, ActorContext actor, Timestamp now)` | standard ref 和 contract kind 合法 | 创建草稿映射索引 | `DomainError::InvariantViolation` |
| `Draft` | `Active` | `StandardMappingIndex.rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)` | 映射规则完整且可生成 | 更新映射规则和更新时间 | `DomainError::IllegalStateTransition` |
| `Active` | `Stale` | `ProjectionStorePort.mark_stale(ProjectionName projection_name, ProjectionStaleReason reason, Timestamp marked_at)` | 定义、标准或规则变化 | 持久化 stale 标记,不改写真相 | `PortError::InvalidState` |
| `Active` | `Rebuilding` | `StandardMappingIndex.rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)` | operations job 开始重建 | 标记重建中 | `DomainError::IllegalStateTransition` |
| `Stale` | `Rebuilding` | `StandardMappingIndex.rebuild(StandardRef standard_ref, ActorContext actor, Timestamp now)` | stale 索引可重建 | 标记重建中 | `DomainError::IllegalStateTransition` |
| `Rebuilding` | `Active` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | 重建完成且写入成功 | 保存新索引,更新水位 | `ApplicationError::Port` |

关键说明:

- `IndexState` 只用于标准映射索引,不能被写路径当成 `ContractDefinition` 真相状态。
- `Rebuilding` 是读面可观测状态,不是错误。

#### 9.6.7 `TraceIndexState` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 兼容追溯索引可查询 | 否 | `append_trace`、`mark_stale`、rebuild |
| `Stale` | 索引需重建 | 否 | rebuild |
| `Rebuilding` | 后台重建中 | 否 | 完成后进入 `Active` |

#### 9.6.8 `TraceIndexState` 状态转换图

```text
<TraceIndexState>
  Active
    | CompatibilityTraceIndex.mark_stale(Timestamp now)
    v
  Stale
    | ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)
    v
  Rebuilding
    | CompatibilityTraceIndex::from_compatibility_result(...)
    v
  Active

  Active
    | rebuild requested
    v
  Rebuilding
```

#### 9.6.9 `TraceIndexState` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Active` | `CompatibilityTraceIndex::from_compatibility_result(CompatibilityTraceIndexId trace_index_id, CompatibilityResult result, ActorContext actor, Timestamp now)` | compatibility result 完整 | 创建可查询追溯索引 | `DomainError::InvariantViolation` |
| `Active` | `Active` | `CompatibilityTraceIndex.append_trace(CompatibilityTraceItem item, Timestamp now)` | item 与 baseline / definition 匹配 | 追加追溯项,更新时间 | `DomainError::InvariantViolation` |
| `Active` | `Stale` | `CompatibilityTraceIndex.mark_stale(Timestamp now)` | 兼容规则、基线或定义变化 | 暴露 stale | `DomainError::IllegalStateTransition` |
| `Active` | `Rebuilding` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | 重建任务开始 | 标记重建中或通过 projection replace 表达 | `ApplicationError::PreconditionFailed` |
| `Stale` | `Rebuilding` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | stale 索引可重建 | 标记重建中 | `ApplicationError::PreconditionFailed` |
| `Rebuilding` | `Active` | `CompatibilityTraceIndex::from_compatibility_result(CompatibilityTraceIndexId trace_index_id, CompatibilityResult result, ActorContext actor, Timestamp now)` | 重建结果完整且可保存 | 替换索引,更新水位 | `DomainError::InvariantViolation` |

关键说明:

- `TraceIndexState` 没有 `Retired` 变体;概要设计中如出现 `retired` 应回到 `Stale` / `Active` / `Rebuilding` 口径。
- 兼容追溯查询遇到 `Stale` 时,必须显式返回 stale 标记或提示重建,不能假装最新。

#### 9.6.10 `ReadModelState` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 只读模型可查询 | 否 | `refresh_from_definition`、`mark_stale` |
| `Stale` | 只读模型过期 | 否 | rebuild / refresh |
| `Rebuilding` | 正在重建 | 否 | 完成后进入 `Active` |

#### 9.6.11 `ReadModelState` 状态转换图

```text
<ReadModelState>
  Active
    | ContractReadModel.mark_stale(Timestamp now)
    v
  Stale
    | ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)
    v
  Rebuilding
    | ContractReadModel::from_definition(...) / refresh_from_definition(...)
    v
  Active

  Active
    | rebuild requested
    v
  Rebuilding
```

#### 9.6.12 `ReadModelState` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Active` | `ContractReadModel::from_definition(ContractReadModelId read_model_id, ContractDefinition definition, ActorContext actor, Timestamp now)` | definition 可被投影;不保存完整正文 | 创建可查询 read model | `DomainError::InvariantViolation` |
| `Active` | `Active` | `ContractReadModel.refresh_from_definition(ContractDefinition definition, Timestamp now)` | definition 是权威来源 | 刷新摘要、版本、生命周期状态和范围 | `DomainError::InvariantViolation` |
| `Active` | `Stale` | `ContractReadModel.mark_stale(Timestamp now)` | definition 变化或 projection stale 标记到达 | 暴露 stale | `DomainError::IllegalStateTransition` |
| `Active` | `Rebuilding` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | 重建任务开始 | 标记重建中或通过 projection store 水位表达 | `ApplicationError::PreconditionFailed` |
| `Stale` | `Rebuilding` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | stale read model 可重建 | 标记重建中 | `ApplicationError::PreconditionFailed` |
| `Rebuilding` | `Active` | `ProjectionStorePort.replace_read_models(ContractReadModelBatch batch, ProjectionRebuildId rebuild_id)` | 批次投影生成成功 | 替换 read model 批次,更新水位 | `PortError::InvalidState` |

关键说明:

- `ReadModelState` 使用 `Active`,不使用概要设计早期的 `Ready`。
- 查询路径可以读取 `Stale` 并返回 stale 标记,但不得在 query 内自动重建或改写真相。

#### 9.6.13 `ProjectionState` 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Active` | 追溯投影可查询 | 否 | `append_trace_item`、`mark_stale` |
| `Stale` | 追溯投影过期 | 否 | rebuild |
| `Rebuilding` | 正在重建 | 否 | 完成后进入 `Active` |

#### 9.6.14 `ProjectionState` 状态转换图

```text
<ProjectionState>
  Active
    | ContractTraceProjection.mark_stale(Timestamp now)
    v
  Stale
    | ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)
    v
  Rebuilding
    | ContractTraceProjection::from_trace_sources(...)
    v
  Active

  Active
    | rebuild requested
    v
  Rebuilding
```

#### 9.6.15 `ProjectionState` 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Active` | `ContractTraceProjection::from_trace_sources(ContractTraceProjectionId projection_id, TraceSourceSet sources, ActorContext actor, Timestamp now)` | sources 可组合;不复制外部正文 | 创建可查询追溯投影 | `DomainError::InvariantViolation` |
| `Active` | `Active` | `ContractTraceProjection.append_trace_item(TraceItem item, Timestamp now)` | item 合法且与 definition 匹配 | 追加追溯项,更新时间 | `DomainError::InvariantViolation` |
| `Active` | `Stale` | `ContractTraceProjection.mark_stale(Timestamp now)` | 事实、审计、快照或定义变化 | 暴露 stale | `DomainError::IllegalStateTransition` |
| `Active` | `Rebuilding` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | 重建任务开始 | 标记重建中或通过 projection store 水位表达 | `ApplicationError::PreconditionFailed` |
| `Stale` | `Rebuilding` | `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` | stale projection 可重建 | 标记重建中 | `ApplicationError::PreconditionFailed` |
| `Rebuilding` | `Active` | `ProjectionStorePort.replace_trace_projections(ContractTraceProjectionBatch batch, ProjectionRebuildId rebuild_id)` | 批次投影生成成功 | 替换追溯投影批次,更新水位 | `PortError::InvalidState` |

关键说明:

- `ProjectionState` 只属于 `ContractTraceProjection`,不能用于发布基线或契约定义 truth。
- `Rebuilding` 状态是 operations job 的可观测过程,不是失败态。

#### 9.6.16 处理流绑定

| 处理流 | 状态转换 |
|---|---|
| `CreateContractDraftFlow` / `UpdateContractDraftFlow` / `PublishContractBaselineFlow` | 可触发 read model、trace projection、reference stale 标记 |
| `ValidateContractChangeJobFlow` | 创建或刷新 `CompatibilityTraceIndex::Active`,也可标记旧 trace stale |
| `RebuildContractIndexJobFlow` | `Stale / Active -> Rebuilding -> Active` |
| `CommonReadFlow` | 读取 `Active / Stale / Rebuilding`,不得改写状态 |
| `TraceContractEvolutionFlow` | 读取 trace projection 和 audit,遇到 stale 必须显式返回 |
| `GetCompatibilityTraceFlow` | 读取 compatibility trace index,遇到 stale 必须显式返回 |

### 9.7 `ContractPackageLifecycleState` 状态机

#### 9.7.1 状态集合表

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | 草稿包,允许调整包内定义引用 | 否 | `transition_to(Published)`、编辑包引用 |
| `Published` | 已发布包,允许下游消费 | 否 | `transition_to(Deprecated)`、`transition_to(Retired)` |
| `Deprecated` | 已弃用包,仍可追溯但不建议新增消费 | 否 | `transition_to(Retired)` |
| `Retired` | 已退役包,生命周期终止 | 是 | 只读查询、追溯 |

#### 9.7.2 状态转换图

```text
<ContractPackageLifecycleState>
  Draft
    | ContractPackageLifecycle.transition_to(ContractPackageLifecycleState::Published, ActorContext actor, Option<LifecycleReason> reason, Timestamp now)
    v
  Published
    +-----------------------------+
    |                             |
    | transition_to(Deprecated)   | transition_to(Retired)
    v                             v
  Deprecated                    Retired
    |
    | transition_to(Retired)
    v
  Retired
```

#### 9.7.3 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| 创建 | `Draft` | `ContractPackageLifecycle::initial_draft(ActorContext actor, Timestamp now)` | 创建草稿包 | 初始化包生命周期 | `DomainError::InvariantViolation` |
| `Draft` | `Published` | `ContractPackageLifecycle.transition_to(ContractPackageLifecycleState target, ActorContext actor, Option<LifecycleReason> reason, Timestamp now)` | `target == Published`;包内定义引用均有效 | 标记包可消费 | `DomainError::IllegalStateTransition` |
| `Published` | `Deprecated` | `ContractPackageLifecycle.transition_to(ContractPackageLifecycleState target, ActorContext actor, Option<LifecycleReason> reason, Timestamp now)` | `target == Deprecated`;`reason` 存在 | 标记包弃用 | `DomainError::IllegalStateTransition` |
| `Published` | `Retired` | `ContractPackageLifecycle.transition_to(ContractPackageLifecycleState target, ActorContext actor, Option<LifecycleReason> reason, Timestamp now)` | `target == Retired`;`reason` 存在 | 进入终态 | `DomainError::IllegalStateTransition` |
| `Deprecated` | `Retired` | `ContractPackageLifecycle.transition_to(ContractPackageLifecycleState target, ActorContext actor, Option<LifecycleReason> reason, Timestamp now)` | `target == Retired`;`reason` 存在 | 进入终态 | `DomainError::IllegalStateTransition` |

关键说明:

- 契约包生命周期已在 Step 6 定义,但 Step 8 / 9 当前没有包写 Command;因此本矩阵作为 P1 / 包管理扩展的领域约束。
- P0 实现可以先提供领域对象和 repository 支撑,但不暴露外部写入口。

### 9.8 非法转换处理表

| 状态机 | 明确非法转换 | 返回错误 | 是否写审计意图 |
|---|---|---|---|
| `ContractLifecycleState` | `Retired -> *`、`Superseded -> *`、`Published -> Draft`、`Deprecated -> Published` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `CompatibilityValue` | `Compatible -> Incompatible`、`Incompatible -> Compatible` 直接覆盖 | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `ContractReleaseBaselineStatus` | `Released -> Prepared`、`Superseded -> *`、`Retired -> *` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `ContractReleaseSnapshotStatus` | `Ready -> Building`、`Superseded -> *`、`Archived -> *` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `FactDeliveryStatus` | `Published -> Pending`、`Archived -> *` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `DownstreamConsumptionStatus` | `Retired -> *`、`Pending -> Stale`、`Pending -> Retired` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `ReferenceState` | `Invalidated -> *`、`Pending -> Stale` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |
| `IndexState` | `Stale -> Active` 绕过 rebuild、`Rebuilding -> Stale` 普通回退 | `DomainError::IllegalStateTransition` 或 `PortError::InvalidState` | 是 |
| `TraceIndexState` | `Stale -> Active` 绕过 rebuild | `DomainError::IllegalStateTransition` 或 `PortError::InvalidState` | 是 |
| `ReadModelState` | `Stale -> Active` 绕过 rebuild / refresh | `DomainError::IllegalStateTransition` 或 `PortError::InvalidState` | 否,query 不写;job 可写 |
| `ProjectionState` | `Stale -> Active` 绕过 rebuild | `DomainError::IllegalStateTransition` 或 `PortError::InvalidState` | 否,query 不写;job 可写 |
| `ContractPackageLifecycleState` | `Retired -> *`、`Deprecated -> Published` | `DomainError::IllegalStateTransition` -> `ApplicationError::PreconditionFailed` | 是 |

### 9.9 状态转换与处理流总绑定表

| 状态机 | 主要处理流 | 是否 P0 |
|---|---|---|
| `ContractLifecycleState` | `CreateContractDraftFlow`、`UpdateContractDraftFlow`、`SubmitContractForReviewFlow`、`PublishContractBaselineFlow`、`UpdateContractLifecycleFlow` | 是 |
| `CompatibilityValue` | `ValidateContractChangeJobFlow`、`PublishContractBaselineFlow` | 是 |
| `ContractReleaseBaselineStatus` | `PublishContractBaselineFlow`、`UpdateContractLifecycleFlow` | 是 |
| `ContractReleaseSnapshotStatus` | `DeriveReleaseSnapshotJobFlow` | 是 |
| `FactDeliveryStatus` | `PublishContractFactJobFlow`、`OutboxRelayFlow` | 是 |
| `DownstreamConsumptionStatus` | `DeriveReleaseSnapshotJobFlow`、运维刷新 | 是 |
| `ReferenceState` | reference resolve / invalidation operations | 是 |
| `IndexState` | `RebuildContractIndexJobFlow` | 是 |
| `TraceIndexState` | `ValidateContractChangeJobFlow`、`RebuildContractIndexJobFlow` | 是 |
| `ReadModelState` | `RebuildContractIndexJobFlow`、definition change stale marking | 是 |
| `ProjectionState` | `RebuildContractIndexJobFlow`、fact / audit stale marking | 是 |
| `ContractPackageLifecycleState` | 契约包管理扩展 | P1 |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §9 按状态机族组织,不按 enum 文件顺序机械堆叠。
2. 每个状态机必须保留状态集合表、ASCII 状态图和转换矩阵。
3. 状态名必须使用 Rust enum 变体名。
4. 触发函数必须能回指 Step 6 对象函数、Step 9 处理流或 Step 7 port。
5. 非法转换必须写错误类型和 application 映射。
6. read model / projection 状态必须明确只读边界,不得反向改写真相。
7. outbox 状态不写成领域状态机;只在 Step 11 / 12 定义持久化和恢复语义。
```

建议正式文档 §9 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `9.1 状态机总览` | 状态机总表、统一状态转换规则、错误映射 |
| `9.2 契约定义生命周期` | `ContractLifecycleState` 状态集合、图、矩阵 |
| `9.3 发布与兼容状态` | `CompatibilityValue`、`ContractReleaseBaselineStatus`、`ContractReleaseSnapshotStatus` |
| `9.4 事实传播与消费状态` | `FactDeliveryStatus`、`DownstreamConsumptionStatus` |
| `9.5 引用与读面状态` | `ReferenceState`、`IndexState`、`TraceIndexState`、`ReadModelState`、`ProjectionState` |
| `9.6 契约包生命周期` | `ContractPackageLifecycleState` P1 约束 |
| `9.7 非法转换处理` | 统一非法转换表和审计口径 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| `InReview -> Draft` 是否 P0 实现 | A. P0 实现退回草稿; B. P1 保留,本轮不暴露入口 | B | Step 8 / 9 没有退回草稿 command 和对象函数,本轮强行加入会扩大协议面 | 已按 B 作为本轮口径 |
| 快照 `Ready -> Superseded` 是否 P0 实现 | A. P0 实现 `mark_superseded`; B. P1 保留,本轮只实现 archive | B | 当前 P0 快照主线是 building -> ready,替代属于后续版本管理增强 | 已按 B 作为本轮口径 |
| `FactDeliveryStatus` 是否新增 `Queued` | A. 新增 enum 变体; B. 不新增,队列状态留给 outbox | B | Step 6 已固定 enum,且 queued 是 outbox 记录状态,不是事实传播结果 | 已按 B 作为本轮口径 |
| EventCatalogReference 是否需要 `mark_stale` | A. 立即回补函数; B. P1 保留,本轮用 invalidate / resolve 表达 | B | 当前 P0 不需要事件目录 stale 独立流程,避免扩大对象契约 | 已按 B 作为本轮口径 |
| read model / projection 的 `Rebuilding` 是否必须持久化到单对象 | A. 每个 projection 对象持久化 `Rebuilding`; B. 可由 projection store 水位 / rebuild record 表达 | B | 批量重建时单对象逐个写 rebuilding 成本高,Step 11 可定义水位表达 | 已按 B 作为本轮口径 |

---

## 12. 进入下一步条件

Step 10 完成后必须满足:

- 当前仓正式状态机清单已经列出。
- 每个状态机的状态集合已经使用 Step 6 enum 变体名固定。
- 每个 P0 状态转换都有触发函数、前置条件、副作用和非法错误。
- P1 / operations / 待回补转换已经显式标注,没有伪装成 P0 已实现入口。
- 事实状态与 outbox 队列状态已经分清。
- read model / projection 状态与 truth 状态已经分清。
- 非法转换统一映射到 `DomainError::IllegalStateTransition` 和 application 错误。
- 可以进入 Step 11 “定义持久化、事务与一致性契约”。
