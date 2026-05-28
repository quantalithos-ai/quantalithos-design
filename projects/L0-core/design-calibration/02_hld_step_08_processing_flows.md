# Step 8. 关键处理流 / 重要函数数据流

> 本版本承接 Step 7 已收敛的 API / 接口骨架,把 `L0-core` 的关键写路径、读路径和后台作业路径收束为可继续下钻的处理流骨架。
> 本步只回答“哪些关键接口需要独立处理流,处理流中有哪些关键函数 / service / domain / projection / outbox 接点,哪些边界要留给详细设计”,不展开完整伪代码、SQL、错误码、重试参数或协议级时序。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
- 回填章节: `projects/L0-core/02-概要设计.md` §8 关键处理流 / 重要函数数据流

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 API / 接口骨架 | `CreateContractDraft`、`UpdateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle`、`GetContractDefinition`、`TraceContractEvolution`、`ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob` 等接口已收稳 | 作为处理流的起点和终点 |
| Step 6 关键对象轮廓 | `ContractDefinition`、`ContractLifecycle`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex`、`ContractFactRecord`、`DownstreamConsumptionRef` 等对象已收稳 | 作为 domain / projection / outbox 节点的主语来源 |
| Step 5 主要组成部分、职责与边界 | 契约变更承接、契约真相、兼容性门禁、快照派生、引用索引、后台校验六个业务部分已收稳 | 作为每条处理流归属到哪一部分的依据 |
| 架构 Step 9 关键交互与通信方式 | 已确认同步请求 / 响应、异步事实传播、后台延后承接三类边界 | 作为写路径、读路径、作业路径的分流依据 |
| 架构 Step 10 关键技术选型 | 已确认本仓不是在线服务、不是 bus 实现、不是 SDK 本体 | 作为“不要把流程写成实现细节”的边界依据 |

已确认结论:

```text
P0 Command 必须画独立处理流.
会改写本地状态的读 / 写边界、会影响查询一致性或传播可靠性的 Operations Job 必须画独立处理流.
纯读取 Query 如果只是简单读取投影,可以走通用读路径;如果涉及 projection not ready、fallback 或 trace 追溯,必须画独立处理流.
本步必须写出处理流中的关键函数参数类型骨架,但不写完整函数实现。
```

依赖的前序 Step:

```text
Step 6 已确认关键对象轮廓。
Step 7 已确认 API / 接口骨架。
```

---

## 3. SOP 问题回答

### 3.1 哪些关键接口必须画独立处理流?

回答:

本仓不把所有接口都画成独立图,而是按“会不会改变主线成立”来决定是否独立成图。

| 接口 / 处理族 | 是否画独立处理流 | 原因 |
|---|---|---|
| `CreateContractDraft` / `UpdateContractDraft` | 是,共用一张图 | 同为草稿写路径,入口不同但编排和写入边界一致 |
| `SubmitContractForReview` | 是 | 进入评审 / 门禁,状态迁移独立 |
| `PublishContractBaseline` | 是 | 发布门禁、基线生成、快照派生触发都必须单独说明 |
| `UpdateContractLifecycle` | 是 | 弃用 / 退役 / supersede 影响终态和追溯 |
| `GetContractDefinition` / `ListContractDefinitions` / `GetContractReleaseBaseline` / `GetContractReleaseSnapshot` / `GetContractPackage` / `GetContractGuideSample` | 否,使用通用读路径 | 只是只读视图读取,读模型即可说明 |
| `TraceContractEvolution` / `GetCompatibilityTrace` | 是 | 依赖 trace projection / compatibility trace index,且可能涉及 projection not ready |
| `ValidateContractChangeJob` / `RecalculateFingerprintJob` | 是,共用一张作业图 | 都属于后台校验和复算,并影响发布前结论 |
| `DeriveReleaseSnapshotJob` | 是 | 派生只读快照,影响下游消费 |
| `RebuildContractIndexJob` | 是 | 影响查询一致性和重建口径 |
| `PublishContractFactJob` | 是 | 影响 outbox 和事实传播 |

### 3.2 哪些处理流必须点名关键函数参数类型?

回答:

只要处理流里出现函数调用,就必须写成 `TypeName param_name` 形式,不能写裸参数名。

例如:

```text
ContractDefinition.create_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
ContractDefinition.update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
ContractLifecycle.can_transition_to(ContractLifecycle target)
ContractReleaseBaseline.mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
ContractReadModel.matches_query(ContractQuery query)
ContractTraceProjection.append_trace_item(TraceItem item)
```

### 3.3 哪些处理流可以共用,哪些必须单独?

回答:

- `CreateContractDraft` 和 `UpdateContractDraft` 可以共用一张草稿写路径图,因为两者的入口不同,但写入对象、幂等边界和 outbox 边界一致。
- `GetContractDefinition`、`ListContractDefinitions`、`GetContractReleaseBaseline`、`GetContractReleaseSnapshot`、`GetContractPackage`、`GetContractGuideSample` 可以共用通用读路径,因为它们都只读,且不需要改写投影。
- `TraceContractEvolution` 和 `GetCompatibilityTrace` 必须单独成组,因为它们依赖追溯投影和兼容索引,且更容易出现 projection not ready 的边界。
- `ValidateContractChangeJob` 和 `RecalculateFingerprintJob` 可以共用后台校验 / 复算路径。
- `DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`PublishContractFactJob` 必须独立成图,因为它们分别影响快照、一致性索引和事实传播。

### 3.4 处理流中哪些边界不能留到详细设计才发现?

回答:

- `Create / Update` 写路径必须明确幂等和版本边界。
- `PublishContractBaseline` 必须明确门禁先于基线,快照可以后续派生。
- `TraceContractEvolution` 必须明确追溯索引 / 事实记录的读取顺序,不能把追溯读写混成一个步骤。
- `DeriveReleaseSnapshotJob` 必须明确 snapshot 是派生物,不能反向成为真相。
- `RebuildContractIndexJob` 必须明确它只重建读面,不改写契约真相。
- `PublishContractFactJob` 必须明确它是事实输出,不是 bus 投递实现。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 Step 8 缺位 | 原 `02` 没有把关键写路径 / 读路径 / 作业路径单独拉出来 | 详细设计会重新发明函数调用链 |
| 旧版流程表达 | 容易把 service、repository、outbox、projection 混写成一条线 | 读者分不清哪一段是 domain,哪一段是 persistence,哪一段是事实输出 |
| 旧版边界 | 没有区分纯读路径和 trace / 兼容追溯路径 | projection not ready、fallback 或 stale 视图容易被漏掉 |
| 旧版作业语义 | 校验、派生、重建、复算和事实发布容易混在一起 | 后续测试与实现很难按职责分开 |
| 旧版函数表达 | 容易写成裸参数调用或完整实现脚本 | 不符合概要设计层的骨架表达要求 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 处理流粒度 | 混在对象章、接口章或一句话描述里 | 按关键写路径 / 读路径 / 作业路径独立收口 | 让详细设计能继续按功能写下去 |
| 函数表达 | 裸参数或完整实现倾向 | 只写关键函数名,参数必须带类型 | 既能定位关键调用,又不滑向实现层 |
| 写路径 | 创建、更新、提交、发布混写 | 创建 / 更新 / 提交 / 发布 / 生命周期迁移分开 | 便于理解状态变化和 outbox 边界 |
| 读路径 | 所有查询被视为同一类 | 简单读路径与追溯读路径分开 | 避免 projection not ready 边界被吞掉 |
| 作业路径 | 校验、派生、重建、事实发布混写 | 独立成作业图 | 避免把后台承接伪装成同步完成 |
| 结果边界 | 只写“成功” | 明确 result / event / projection / outbox 终点 | 让后续测试和验收有落点 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按接口名称逐个画完整图 | 最直观 | 图太碎,重复多,容易把概要设计写成接口目录 | 不采用 |
| 方案 B: 按写路径 / 读路径 / 作业路径分组画图 | 边界清晰,便于复用 | 需要在每组里说明覆盖了哪些接口 | 采用 |
| 方案 C: 只画一张总流程图 | 简洁 | 无法支撑详细设计,也无法定位关键函数和状态边界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 处理流覆盖清单

| 接口 / 处理族 | 是否画独立处理流 | 处理流类型 | 原因 |
|---|---|---|---|
| `CreateContractDraft` / `UpdateContractDraft` | 是 | 草稿写路径 | 同属草稿写入和版本推进,可共用一张图 |
| `SubmitContractForReview` | 是 | 写路径 | 进入评审和门禁,状态迁移独立 |
| `PublishContractBaseline` | 是 | 写路径 | 门禁、基线和快照触发需要单独说明 |
| `UpdateContractLifecycle` | 是 | 写路径 | 弃用 / 退役 / supersede 影响终态和追溯 |
| `GetContractDefinition` / `ListContractDefinitions` / `GetContractReleaseBaseline` / `GetContractReleaseSnapshot` / `GetContractPackage` / `GetContractGuideSample` | 否,共用通用读路径 | 读路径 | 只是只读视图读取 |
| `TraceContractEvolution` / `GetCompatibilityTrace` | 是 | 追溯读路径 | 依赖追溯投影,且更容易遇到 stale / not ready 边界 |
| `ValidateContractChangeJob` / `RecalculateFingerprintJob` | 是 | 作业路径 | 影响门禁和派生判断 |
| `DeriveReleaseSnapshotJob` | 是 | 作业路径 | 直接影响只读快照派生 |
| `RebuildContractIndexJob` | 是 | 作业路径 | 直接影响查询一致性 |
| `PublishContractFactJob` | 是 | 作业路径 | 直接影响事实输出 |

### 7.2 草稿写路径

#### 7.2.1 `CreateContractDraft / UpdateContractDraft` 处理流

```text
<CreateContractDraft / UpdateContractDraft>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionDraftSpec spec / ContractDefinitionId definition_id
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  - 做请求级幂等与基础输入校验
  │
  ▼
<ContractChangeService>
  - 读取 ContractDefinition / ContractLifecycle
  - 决定 create_draft 或 update_draft
  - 通过 ClockPort.now() 获取 Timestamp now
  │
  ▼
<ContractDefinition>
  - create_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
  - update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
  │
  ▼
<ContractDefinitionRepository / OutboxPort>
  - save(ContractDefinition definition, Version expected_version)
  - append(ContractEvolutionRecord record)
  │
  ▼
<ContractChangeReceipt / ContractDraftChanged>
```

关键设计点:
- create 和 update 共用同一草稿写路径,差异只在入口数据。
- 幂等键必须在命令入口处理,不能留到 domain 层补救。
- 草稿写入不等于正式发布,不会在本图内触发基线发布。
- outbox 只记录事实和可感知变化,不承担 bus 投递实现。

### 7.3 评审提交与基线发布路径

#### 7.3.1 `SubmitContractForReview` 处理流

```text
<SubmitContractForReview>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionId definition_id
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  │
  ▼
<ContractReleaseService>
  - 读取 ContractDefinition / ContractLifecycle
  - 判断是否可进入 review
  │
  ▼
<ContractLifecycle>
  - can_transition_to(ContractLifecycle target)
  - is_terminal()
  │
  ▼
<ContractDefinitionRepository / OutboxPort>
  - save(ContractDefinition definition, Version expected_version)
  - append(ContractEvolutionRecord record)
  │
  ▼
<ContractReviewReceipt / ContractReviewSubmitted>
```

关键设计点:
- 提交评审只改变状态流转,不等于正式发布。
- 如果评审路径需要兼容性校验,校验结果应进入作业路径,不要塞进命令同步完成。
- 状态迁移必须通过 `ContractLifecycle.can_transition_to(ContractLifecycle target)` 明确约束。

#### 7.3.2 `PublishContractBaseline` 处理流

```text
<PublishContractBaseline>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionId definition_id / ApprovedGateRef gate_ref
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  │
  ▼
<ContractReleaseService>
  - 校验 gate_ref
  - 协调 ContractCompatibilityService
  │
  ▼
<ContractReleaseBaseline>
  - mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
  - bind_snapshot(ContractReleaseSnapshot snapshot)
  │
  ▼
<ContractReleaseBaselineRepository / OutboxPort>
  - save(ContractReleaseBaseline baseline, Version expected_version)
  - append(ContractFactRecord record)
  - schedule DeriveReleaseSnapshotJob
  │
  ▼
<ContractBaselineReceipt / ContractBaselinePublished>
```

关键设计点:
- 门禁先于基线,快照可以后续派生,不能在本图里把两者混成一个同步完成。
- 基线是收口锚点,快照是派生读面,二者必须分开表达。
- 发布后事实输出仍然通过 outbox 或事实作业完成,不直接等于 bus 投递。

### 7.4 生命周期迁移路径

#### 7.4.1 `UpdateContractLifecycle` 处理流

```text
<UpdateContractLifecycle>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionId definition_id / ContractLifecycle target / LifecycleReason reason
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  │
  ▼
<ContractChangeService>
  - 读取当前 ContractLifecycle
  - 判断 can_transition_to(target)
  │
  ▼
<ContractLifecycle>
  - can_transition_to(ContractLifecycle target)
  - allows_edit()
  - is_terminal()
  │
  ▼
<ContractDefinitionRepository / OutboxPort>
  - save(ContractDefinition definition, Version expected_version)
  - append(ContractEvolutionRecord record)
  │
  ▼
<ContractLifecycleReceipt / ContractLifecycleChanged>
```

关键设计点:
- 弃用、退役和 supersede 共享同一迁移口径,但结果状态不同。
- 若迁移涉及新旧定义关系,必须通过演进记录显式保留替代锚点。
- 终态一旦成立,后续可编辑性和新增引用能力必须在状态逻辑中显式收束。

### 7.5 通用读路径

#### 7.5.1 `GetContractDefinition / ListContractDefinitions / GetContractReleaseBaseline / GetContractReleaseSnapshot / GetContractPackage / GetContractGuideSample` 处理流

```text
<GetContractDefinition / ListContractDefinitions / GetContractReleaseBaseline / GetContractReleaseSnapshot / GetContractPackage / GetContractGuideSample>
  │
  ▼
<ContractQueryApi>
  - 接收 QueryMetadata metadata
  - 解析 query / id / consumer_domain
  │
  ▼
<ContractReadModel / ContractReleaseBaseline / ContractReleaseSnapshot / ContractPackageView>
  - matches_query(ContractQuery query)
  - is_read_only()
  │
  ▼
<Result / View>
```

关键设计点:
- 这是纯只读路径,不触发写入、门禁或事实发布。
- 简单读路径可以共用同一骨架,不必为每个 query 单独画图。
- 如果某个查询需要 projection not ready 或 fallback,应另起独立图,本步不把 fallback 预设进主线。

### 7.6 追溯读路径

#### 7.6.1 `TraceContractEvolution / GetCompatibilityTrace` 处理流

```text
<TraceContractEvolution / GetCompatibilityTrace>
  │
  ▼
<ContractQueryApi>
  - 接收 ContractTraceQuery query / ContractDefinitionId definition_id
  - 接收 QueryMetadata metadata / ActorContext actor(可选)
  │
  ▼
<ContractTraceService>
  - 读取 ContractTraceProjection / CompatibilityTraceIndex
  - 必要时组合 ContractFactRecord
  │
  ▼
<ContractTraceProjection / CompatibilityTraceIndex>
  - append_trace_item(TraceItem item)
  - append_trace(CompatibilityTraceItem item)
  │
  ▼
<ContractTraceView / CompatibilityTraceView>
```

关键设计点:
- 追溯查询不是普通列表查询,它需要读取投影和事实记录的组合视图。
- 如果追溯投影未就绪,不能把它伪装成普通 read model,应暴露 stale / rebuilding 语义。
- 追溯路径允许保留可选 actor 元信息,但不把它写成鉴权机制。

### 7.7 后台校验与复算路径

#### 7.7.1 `ValidateContractChangeJob / RecalculateFingerprintJob` 处理流

```text
<ValidateContractChangeJob / RecalculateFingerprintJob>
  │
  ▼
<ContractOperationsService>
  - 驱动 ContractCompatibilityService / FingerprintPolicy
  - 读取 ContractDefinition / ContractLifecycle
  │
  ▼
<ContractDefinition / CompatibilityStatus>
  - can_transition_to(ContractLifecycle target)
  - mark_compatible(ActorContext actor, Timestamp now)
  - mark_incompatible(ActorContext actor, CompatibilityReason reason, Timestamp now)
  │
  ▼
<ValidationReport / ContractFingerprint / ContractCompatibilityStatusChanged>
```

关键设计点:
- 这是后台校验和复算路径,不直接发布基线。
- 兼容性结论可影响后续发布,但不是发布本身。
- 指纹复算是派生事实,必须与权威定义保持可重建关系。

### 7.8 快照派生路径

#### 7.8.1 `DeriveReleaseSnapshotJob` 处理流

```text
<DeriveReleaseSnapshotJob>
  │
  ▼
<ContractOperationsService>
  - 读取 ContractReleaseBaseline
  - 准备 SnapshotBlobRef
  │
  ▼
<ContractReleaseSnapshot>
  - from_baseline(ContractReleaseBaseline baseline, SnapshotBlobRef body_ref, ActorContext actor, Timestamp now)
  - is_read_only()
  │
  ▼
<ContractReleaseSnapshotRepository / OutboxPort>
  - save(ContractReleaseSnapshot snapshot, Version expected_version)
  - append(ContractFactRecord record)
  │
  ▼
<ContractReleaseSnapshot / ContractSnapshotReady>
```

关键设计点:
- 快照是发布基线的派生读面,不是第二份真相。
- 快照可晚于基线生成,但一旦生成必须保持只读属性。
- 下游消费关系应通过快照或消费引用表达,不能反向写回真相。

### 7.9 索引重建路径

#### 7.9.1 `RebuildContractIndexJob` 处理流

```text
<RebuildContractIndexJob>
  │
  ▼
<ContractOperationsService>
  - 读取 ContractDefinition / ContractEvolutionRecord / ContractFactRecord
  │
  ▼
<ContractReadModel / ContractTraceProjection / CompatibilityTraceIndex>
  - refresh_from_definition(ContractDefinition definition)
  - from_trace_sources(TraceSourceSet sources)
  - append_trace(CompatibilityTraceItem item)
  │
  ▼
<ReadModel / TraceProjection / IndexReady>
```

关键设计点:
- 索引重建是读面维护,不是权威真相写入。
- 重建路径可能跑得比写路径慢,但不能改变契约真相。
- 如果索引与事实不一致,优先把重建当成修复读面的作业,不是改写业务对象。

### 7.10 事实发布路径

#### 7.10.1 `PublishContractFactJob` 处理流

```text
<PublishContractFactJob>
  │
  ▼
<ContractOperationsService>
  - 读取 ContractFactRecord / Outbox 记录
  │
  ▼
<ContractFactRecord / OutboxPort>
  - mark_published(Timestamp published_at)
  - mark_failed(FactFailureReason reason, Timestamp now)
  │
  ▼
<FactOutboxEvent / delivery state / ContractFactPublished>
```

关键设计点:
- 事实发布是可感知输出,不是 bus 实现。
- 失败状态必须显式保留,不能伪装成已传播完成。
- 事实记录和 outbox 记录要能支持后续审计和重放,但不反写契约真相。

---

## 8. 回填草稿

可直接回填到 `02-概要设计.md` 的起草结构:

```md
## 8. 关键处理流 / 重要函数数据流

> 校准来源:
> - `design-calibration/02_hld_step_08_processing_flows.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“处理流覆盖清单”“草稿写路径”“评审提交与基线发布路径”“生命周期迁移路径”“通用读路径”“追溯读路径”“后台校验与复算路径”“快照派生路径”“索引重建路径”“事实发布路径”小节,了解本章如何从接口骨架收敛到关键函数数据流。

### 8.1 处理流覆盖清单

| 接口 / 处理族 | 是否画独立处理流 | 处理流类型 | 原因 |
|---|---|---|---|
| `CreateContractDraft` / `UpdateContractDraft` | 是,共用一张图 | 草稿写路径 | 同属草稿写入和版本推进,可共用一张图 |
| `SubmitContractForReview` | 是 | 写路径 | 进入评审和门禁,状态迁移独立 |
| `PublishContractBaseline` | 是 | 写路径 | 门禁、基线和快照触发需要单独说明 |
| `UpdateContractLifecycle` | 是 | 写路径 | 弃用 / 退役 / supersede 影响终态和追溯 |
| `GetContractDefinition` / `ListContractDefinitions` / `GetContractReleaseBaseline` / `GetContractReleaseSnapshot` / `GetContractPackage` / `GetContractGuideSample` | 否,共用通用读路径 | 读路径 | 只是只读视图读取 |
| `TraceContractEvolution` / `GetCompatibilityTrace` | 是 | 追溯读路径 | 依赖追溯投影,且更容易遇到 stale / not ready 边界 |
| `ValidateContractChangeJob` / `RecalculateFingerprintJob` | 是 | 作业路径 | 影响门禁和派生判断 |
| `DeriveReleaseSnapshotJob` | 是 | 作业路径 | 直接影响只读快照派生 |
| `RebuildContractIndexJob` | 是 | 作业路径 | 直接影响查询一致性 |
| `PublishContractFactJob` | 是 | 作业路径 | 直接影响事实输出 |

### 8.2 草稿写路径

#### 8.2.1 `CreateContractDraft / UpdateContractDraft` 处理流

```text
<CreateContractDraft / UpdateContractDraft>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionDraftSpec spec / ContractDefinitionId definition_id
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  - 做请求级幂等与基础输入校验
  │
  ▼
<ContractChangeService>
  - 读取 ContractDefinition / ContractLifecycle
  - 决定 create_draft 或 update_draft
  - 通过 ClockPort.now() 获取 Timestamp now
  │
  ▼
<ContractDefinition>
  - create_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
  - update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
  │
  ▼
<ContractDefinitionRepository / OutboxPort>
  - save(ContractDefinition definition, Version expected_version)
  - append(ContractEvolutionRecord record)
  │
  ▼
<ContractChangeReceipt / ContractDraftChanged>
```

### 8.3 评审提交与基线发布路径

#### 8.3.1 `SubmitContractForReview` 处理流

```text
<SubmitContractForReview>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionId definition_id
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  │
  ▼
<ContractReleaseService>
  - 读取 ContractDefinition / ContractLifecycle
  - 判断是否可进入 review
  │
  ▼
<ContractLifecycle>
  - can_transition_to(ContractLifecycle target)
  - is_terminal()
  │
  ▼
<ContractDefinitionRepository / OutboxPort>
  - save(ContractDefinition definition, Version expected_version)
  - append(ContractEvolutionRecord record)
  │
  ▼
<ContractReviewReceipt / ContractReviewSubmitted>
```

#### 8.3.2 `PublishContractBaseline` 处理流

```text
<PublishContractBaseline>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionId definition_id / ApprovedGateRef gate_ref
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  │
  ▼
<ContractReleaseService>
  - 校验 gate_ref
  - 协调 ContractCompatibilityService
  │
  ▼
<ContractReleaseBaseline>
  - mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
  - bind_snapshot(ContractReleaseSnapshot snapshot)
  │
  ▼
<ContractReleaseBaselineRepository / OutboxPort>
  - save(ContractReleaseBaseline baseline, Version expected_version)
  - append(ContractFactRecord record)
  - schedule DeriveReleaseSnapshotJob
  │
  ▼
<ContractBaselineReceipt / ContractBaselinePublished>
```

### 8.4 生命周期迁移路径

#### 8.4.1 `UpdateContractLifecycle` 处理流

```text
<UpdateContractLifecycle>
  │
  ▼
<ContractCommandApi>
  - 接收 ContractDefinitionId definition_id / ContractLifecycle target / LifecycleReason reason
  - 收集 ActorContext actor / CommandMetadata metadata / IdempotencyKey idempotency_key
  │
  ▼
<ContractChangeService>
  - 读取当前 ContractLifecycle
  - 判断 can_transition_to(target)
  │
  ▼
<ContractLifecycle>
  - can_transition_to(ContractLifecycle target)
  - allows_edit()
  - is_terminal()
  │
  ▼
<ContractDefinitionRepository / OutboxPort>
  - save(ContractDefinition definition, Version expected_version)
  - append(ContractEvolutionRecord record)
  │
  ▼
<ContractLifecycleReceipt / ContractLifecycleChanged>
```

### 8.5 通用读路径

#### 8.5.1 `GetContractDefinition / ListContractDefinitions / GetContractReleaseBaseline / GetContractReleaseSnapshot / GetContractPackage / GetContractGuideSample` 处理流

```text
<GetContractDefinition / ListContractDefinitions / GetContractReleaseBaseline / GetContractReleaseSnapshot / GetContractPackage / GetContractGuideSample>
  │
  ▼
<ContractQueryApi>
  - 接收 QueryMetadata metadata
  - 解析 query / id / consumer_domain
  │
  ▼
<ContractReadModel / ContractReleaseBaseline / ContractReleaseSnapshot / ContractPackageView>
  - matches_query(ContractQuery query)
  - is_read_only()
  │
  ▼
<Result / View>
```

### 8.6 追溯读路径

#### 8.6.1 `TraceContractEvolution / GetCompatibilityTrace` 处理流

```text
<TraceContractEvolution / GetCompatibilityTrace>
  │
  ▼
<ContractQueryApi>
  - 接收 ContractTraceQuery query / ContractDefinitionId definition_id
  - 接收 QueryMetadata metadata / ActorContext actor(可选)
  │
  ▼
<ContractTraceService>
  - 读取 ContractTraceProjection / CompatibilityTraceIndex
  - 必要时组合 ContractFactRecord
  │
  ▼
<ContractTraceProjection / CompatibilityTraceIndex>
  - append_trace_item(TraceItem item)
  - append_trace(CompatibilityTraceItem item)
  │
  ▼
<ContractTraceView / CompatibilityTraceView>
```

### 8.7 后台校验与复算路径

#### 8.7.1 `ValidateContractChangeJob / RecalculateFingerprintJob` 处理流

```text
<ValidateContractChangeJob / RecalculateFingerprintJob>
  │
  ▼
<ContractOperationsService>
  - 驱动 ContractCompatibilityService / FingerprintPolicy
  - 读取 ContractDefinition / ContractLifecycle
  │
  ▼
<ContractDefinition / CompatibilityStatus>
  - can_transition_to(ContractLifecycle target)
  - mark_compatible(ActorContext actor, Timestamp now)
  - mark_incompatible(ActorContext actor, CompatibilityReason reason, Timestamp now)
  │
  ▼
<ValidationReport / ContractFingerprint / ContractCompatibilityStatusChanged>
```

### 8.8 快照派生路径

#### 8.8.1 `DeriveReleaseSnapshotJob` 处理流

```text
<DeriveReleaseSnapshotJob>
  │
  ▼
<ContractOperationsService>
  - 读取 ContractReleaseBaseline
  - 准备 SnapshotBlobRef
  │
  ▼
<ContractReleaseSnapshot>
  - from_baseline(ContractReleaseBaseline baseline, SnapshotBlobRef body_ref, ActorContext actor, Timestamp now)
  - is_read_only()
  │
  ▼
<ContractReleaseSnapshotRepository / OutboxPort>
  - save(ContractReleaseSnapshot snapshot, Version expected_version)
  - append(ContractFactRecord record)
  │
  ▼
<ContractReleaseSnapshot / ContractSnapshotReady>
```

### 8.9 索引重建路径

#### 8.9.1 `RebuildContractIndexJob` 处理流

```text
<RebuildContractIndexJob>
  │
  ▼
<ContractOperationsService>
  - 读取 ContractDefinition / ContractEvolutionRecord / ContractFactRecord
  │
  ▼
<ContractReadModel / ContractTraceProjection / CompatibilityTraceIndex>
  - refresh_from_definition(ContractDefinition definition)
  - from_trace_sources(TraceSourceSet sources)
  - append_trace(CompatibilityTraceItem item)
  │
  ▼
<ReadModel / TraceProjection / IndexReady>
```

### 8.10 事实发布路径

#### 8.10.1 `PublishContractFactJob` 处理流

```text
<PublishContractFactJob>
  │
  ▼
<ContractOperationsService>
  - 读取 ContractFactRecord / Outbox 记录
  │
  ▼
<ContractFactRecord / OutboxPort>
  - mark_published(Timestamp published_at)
  - mark_failed(FactFailureReason reason, Timestamp now)
  │
  ▼
<FactOutboxEvent / delivery state / ContractFactPublished>
```
```

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| `TraceContractEvolution` 和 `GetCompatibilityTrace` 是否共享追溯路径 | A. 共享; B. 分开; C. 合并为普通读路径 | A | 两者都依赖 trace projection / compatibility index,共享一张图更利于后续详细设计 | 已确认采用 A |
| 读路径是否默认加入 fallback | A. 加入; B. 不加入,若 future projection not ready 另起图; C. 完全不提 | B | 纯读路径要保持清爽,projection not ready 应单独处理 | 已确认采用 B |
| `ValidateContractChangeJob` 是否与 `RecalculateFingerprintJob` 共用作业图 | A. 共用; B. 分开; C. 只保留其中一个 | A | 二者同属后台校验 / 复算,但都影响发布前结论 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确哪些关键命令、查询和作业必须独立处理流。
- 已明确写路径、读路径和作业路径的关键函数调用参数类型骨架。
- 已明确哪些边界必须留到详细设计继续展开。
- 可以进入 Step 9 状态机与状态流转。
```

---

## 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| `TraceContractEvolution` 和 `GetCompatibilityTrace` 是否共享追溯路径 | A. 共享; B. 分开; C. 合并为普通读路径 | A | 两者都依赖 trace projection / compatibility index,共享一张图更利于后续详细设计 | 已确认采用 A |
| 读路径是否默认加入 fallback | A. 加入; B. 不加入,若 future projection not ready 另起图; C. 完全不提 | B | 纯读路径要保持清爽,projection not ready 应单独处理 | 已确认采用 B |
| `ValidateContractChangeJob` 是否与 `RecalculateFingerprintJob` 共用作业图 | A. 共用; B. 分开; C. 只保留其中一个 | A | 二者同属后台校验 / 复算,但都影响发布前结论 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确哪些关键命令、查询和作业必须独立处理流。
- 已明确写路径、读路径和作业路径的关键函数调用参数类型骨架。
- 已明确哪些边界必须留到详细设计继续展开。
- 可以进入 Step 9 状态机与状态流转。
