# Step 9. 状态机与状态流转

> 本版本承接 Step 8 已收敛的关键处理流,把 `L0-core` 中会影响主线成立的状态集合、状态流转方向和传播关系单独收束。
> 本步只回答“哪些对象族有正式状态、哪些迁移允许或禁止、状态如何影响 outbox / projection / 下游感知”,不展开状态机代码实现、数据库状态列、错误码或 UI 展示规则。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
- 回填章节: `projects/L0-core/02-概要设计.md` §9 状态定义与状态流转

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 8 关键处理流 | 草稿写路径、评审提交、基线发布、生命周期迁移、通用读路径、追溯读路径、后台校验 / 复算、快照派生、索引重建、事实发布等处理流已收稳 | 作为状态迁移的触发来源 |
| Step 6 关键对象轮廓 | `ContractDefinition`、`ContractLifecycle`、`CompatibilityStatus`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`ContractFactRecord`、`DownstreamConsumptionRef`、`ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex`、`ContractPackage` 等对象已收稳 | 作为状态族的主体来源 |
| Step 7 API / 接口骨架 | `CreateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle`、`ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`PublishContractFactJob` 等接口已收稳 | 作为状态迁移触发动作来源 |
| 架构 Step 9 / Step 10 | 已确认本仓不是在线服务,而是契约来源仓; 状态变化必须影响 outbox / projection / 下游感知,但不能侵入 bus 实现 | 作为状态传播边界依据 |

已确认结论:

```text
本仓没有单一全局状态机,而是由若干对象族的正式状态模型共同构成。
其中真正影响主线成立的状态族是 ContractDefinition lifecycle、CompatibilityStatus、ContractReleaseBaseline、ContractReleaseSnapshot、ContractFactRecord、DownstreamConsumptionRef、ContractReadModel / ContractTraceProjection / CompatibilityTraceIndex,以及 ContractPackageLifecycle。
状态变化必须明确影响 outbox、projection 或下游感知,但不能把 bus 实现、错误码或 UI 展示规则混进来。
```

依赖的前序 Step:

```text
Step 6 已确认关键对象轮廓。
Step 8 已确认关键处理流。
```

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态?

回答:

本仓不采用单一全局状态机,而是采用多个对象族的状态模型。下面这些状态族会直接影响主线成立:

| 对象族 | 状态集合 | 是否进入正常主线 | 主要触发 |
|---|---|---|---|
| `ContractDefinition` / `ContractLifecycle` | `draft`、`in_review`、`published`、`deprecated`、`retired`、`superseded` | 是 | `CreateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle` |
| `CompatibilityStatus` | `pending`、`compatible`、`incompatible` | 是 | `ValidateContractChangeJob`、发布门禁结果 |
| `ContractReleaseBaseline` | `prepared`、`released`、`superseded`、`retired` | 是 | `PublishContractBaseline`、`UpdateContractLifecycle` |
| `ContractReleaseSnapshot` | `building`、`ready`、`superseded`、`archived` | 是 | `DeriveReleaseSnapshotJob`、运维归档 |
| `ContractFactRecord` | `pending`、`published`、`failed`、`archived` | 是 | `PublishContractFactJob` |
| `DownstreamConsumptionRef` | `pending`、`synced`、`stale`、`retired` | 是 | 快照刷新、下游消费反馈、运维退役 |
| `ContractReadModel` | `rebuilding`、`ready`、`stale` | 是 | `RebuildContractIndexJob`、定义变更 |
| `ContractTraceProjection` | `rebuilding`、`ready`、`stale` | 是 | `RebuildContractIndexJob`、事实追加 |
| `CompatibilityTraceIndex` | `building`、`ready`、`stale`、`retired` | 是 | `ValidateContractChangeJob`、兼容性变更、重建 |
| `ContractPackageLifecycle` | `draft`、`published`、`deprecated`、`retired` | 是 | 包发布、包退役、替代 |
| `ExternalReference` / `EventCatalogReference` | `pending`、`resolved`、`stale` / `broken`、`retired` | 是,但属于引用辅助状态 | 标准 / 目录引用更新 |

### 3.2 每个状态的含义是什么,是否可以进入正常主线?

回答:

#### `ContractDefinition` / `ContractLifecycle`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `draft` | 草稿,可编辑 | 是 | 入口状态 |
| `in_review` | 已送评审或门禁 | 是 | 正常主线中的中间态 |
| `published` | 正式发布 | 是 | 当前权威可消费态 |
| `deprecated` | 已弃用 | 是 | 保留追溯,但不再作为首选 |
| `retired` | 退役终态 | 是 | 终态,不可回到主线 |
| `superseded` | 被新定义替代 | 是 | 终态,通过新定义接管主线 |

#### `CompatibilityStatus`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | 兼容判断未完成 | 是 | 可进入校验流程 |
| `compatible` | 可继续发布 | 是 | 正常放行态 |
| `incompatible` | 不可继续发布 | 是 | 允许存在,但阻断发布 |

#### `ContractReleaseBaseline`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `prepared` | 已准备,未正式发布 | 是 | 基线发布前状态 |
| `released` | 已正式收口 | 是 | 正式基线态 |
| `superseded` | 被新基线替代 | 是 | 终态 |
| `retired` | 基线退役 | 是 | 终态 |

#### `ContractReleaseSnapshot`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `building` | 正在派生 | 是 | 允许后台生成 |
| `ready` | 可供下游读取 | 是 | 正常消费态 |
| `superseded` | 被新快照替代 | 是 | 终态 |
| `archived` | 归档态 | 是 | 终态 |

#### `ContractFactRecord`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | 已生成,待输出 | 是 | 可进入事实输出链路 |
| `published` | 已形成事实输出 | 是 | 正常完成态 |
| `failed` | 事实输出失败 | 是 | 允许存在,需显式修复 |
| `archived` | 事实记录归档 | 是 | 终态 |

#### `DownstreamConsumptionRef`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | 尚未消费 | 是 | 初始化态 |
| `synced` | 已消费或已绑定 | 是 | 正常消费态 |
| `stale` | 消费引用过期 | 是 | 仍可见,但需刷新 |
| `retired` | 引用退役 | 是 | 终态 |

#### `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `rebuilding` / `building` | 正在重建 | 是 | 允许后台维护 |
| `ready` | 可查询 / 可追溯 | 是 | 正常读面 |
| `stale` | 需要刷新 | 是 | 允许存在,但不应被误认为最新 |
| `retired` | 退役 | 仅 `CompatibilityTraceIndex` 和少数索引族适用 | 终态 |

#### `ContractPackageLifecycle`

| 状态 | 含义 | 是否进入正常主线 | 说明 |
|---|---|---|---|
| `draft` | 包草稿 | 是 | 对应消费域尚未收口 |
| `published` | 可消费包 | 是 | 正常消费态 |
| `deprecated` | 已弃用 | 是 | 保留兼容期 |
| `retired` | 退役终态 | 是 | 终态 |

### 3.3 哪些接口、事件或动作会触发状态迁移?

回答:

| 触发动作 | 触发的状态族 | 迁移方向 | 说明 |
|---|---|---|---|
| `CreateContractDraft` | `ContractLifecycle` | `draft` | 初始化草稿状态 |
| `UpdateContractDraft` | `ContractLifecycle` / `ContractReadModel` | `draft` 保持或重算 | 草稿内容更新不一定改变生命周期,但会影响读面 |
| `SubmitContractForReview` | `ContractLifecycle` | `draft -> in_review` | 进入评审 / 门禁 |
| `PublishContractBaseline` | `ContractLifecycle` / `ContractReleaseBaseline` / `CompatibilityStatus` | `in_review -> published` / `prepared -> released` | 发布收口并形成基线 |
| `UpdateContractLifecycle` | `ContractLifecycle` / `ContractReleaseBaseline` | `published -> deprecated / retired / superseded` | 生命周期迁移 |
| `ValidateContractChangeJob` | `CompatibilityStatus` | `pending -> compatible / incompatible` | 兼容性判定 |
| `DeriveReleaseSnapshotJob` | `ContractReleaseSnapshot` | `building -> ready` | 派生快照 |
| `PublishContractFactJob` | `ContractFactRecord` | `pending -> published / failed` | 事实输出 |
| `RebuildContractIndexJob` | `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex` | `rebuilding / building -> ready` | 重建读面和追溯面 |
| 下游消费刷新 | `DownstreamConsumptionRef` | `pending -> synced -> stale -> synced` | 记录消费关系 |

### 3.4 哪些迁移明确允许,哪些迁移明确禁止?

回答:

#### 允许迁移清单

| 对象族 | 允许迁移 |
|---|---|
| `ContractLifecycle` | `draft -> in_review -> published -> deprecated -> retired`、`published -> superseded` |
| `CompatibilityStatus` | `pending -> compatible / incompatible`、重新检查后回到 `pending` |
| `ContractReleaseBaseline` | `prepared -> released -> superseded / retired` |
| `ContractReleaseSnapshot` | `building -> ready -> superseded / archived` |
| `ContractFactRecord` | `pending -> published / failed -> archived` |
| `DownstreamConsumptionRef` | `pending -> synced -> stale -> synced`、`synced / stale -> retired` |
| `ContractReadModel` / `ContractTraceProjection` | `rebuilding / building -> ready -> stale` |
| `CompatibilityTraceIndex` | `building -> ready -> stale -> retired` |

#### 禁止迁移清单

| 对象族 | 明确禁止 |
|---|---|
| `ContractLifecycle` | `retired -> published`、`superseded -> draft`、`retired -> in_review` |
| `ContractReleaseBaseline` | `released -> prepared`、绕过门禁直接进入 `released` |
| `ContractReleaseSnapshot` | `ready -> building` 作为普通状态回退 | 
| `ContractFactRecord` | `published -> pending` 伪装成未输出 |
| `DownstreamConsumptionRef` | `retired -> synced` |
| `ContractReadModel` / `ContractTraceProjection` | `ready -> published` 这类把读面当真相的迁移 |
| `CompatibilityStatus` | `compatible -> incompatible` 直接覆盖而不保留复核痕迹 |

### 3.5 状态变化如何影响 outbox、projection、下游感知或只读供给?

回答:

| 状态变化 | 影响对象 | 影响方式 |
|---|---|---|
| `ContractLifecycle` 变化 | outbox / fact record | 生成 `ContractEvolutionRecord`、`ContractFactRecord` 和对应事件 |
| `PublishContractBaseline` | snapshot / downstream refs | 触发 `ContractReleaseSnapshot` 派生,更新 `DownstreamConsumptionRef` |
| `CompatibilityStatus` 变化 | outbox / gate / trace | 影响是否可发布,并可输出兼容性事实 |
| `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex` 变化 | projection / query view | 影响只读查询和追溯查询的一致性 |
| `ContractFactRecord` 变化 | outbox / downstream感知 | 影响事实发布状态和下游可见性 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 Step 9 缺位 | 原 `02` 没有把正式状态族单独收束 | 详细设计会把生命周期、基线、快照、读面状态混成一团 |
| 旧版状态表达 | 容易只写“有状态”而不写迁移和传播 | 后续难以判断哪些状态是终态、哪些状态可恢复 |
| 旧版范围 | 没有区分主线状态与辅助引用状态 | 容易把 reference / index 的状态和真相状态混写 |
| 旧版传播关系 | outbox / projection / downstream 感知边界不清 | 会把状态机写成纯内存状态，不像来源仓 |
| 旧版禁止迁移 | 不明确哪些跳转禁止 | 后续实现可能把终态当普通状态回退 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态建模 | 隐含在对象、接口和流程里 | 独立收口为状态族 | 让详细设计知道哪些状态是真的主线 |
| 主状态 | 只有笼统生命周期概念 | 明确 ContractLifecycle、CompatibilityStatus、Baseline、Snapshot、Fact、ReadModel、TraceIndex、Package 这些状态族 | 避免把读面和真相面混掉 |
| 迁移判断 | 只写动作名 | 明确允许 / 禁止迁移 | 让实现和测试有边界 |
| 状态传播 | 只写“会影响下游” | 明确影响 outbox、projection 和下游感知的方向 | 保护 `L0-core` 的来源仓语义 |
| 终态表达 | 不够清晰 | 终态与可恢复态都明确列出 | 便于后续恢复和审计设计 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写一个大状态机 | 简洁 | 违背本仓多对象族的真实状态结构 | 不采用 |
| 方案 B: 按对象族分别写状态表,再补主线传播图 | 贴合实际,可支撑详细设计 | 比单表更长 | 采用 |
| 方案 C: 只写生命周期,不写读面和事实状态 | 短 | 读面和传播边界会缺失 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 状态族总览

```text
主线状态族
├─ ContractLifecycle
├─ CompatibilityStatus
├─ ContractReleaseBaseline
├─ ContractReleaseSnapshot
├─ ContractFactRecord
├─ DownstreamConsumptionRef
├─ ContractReadModel
├─ ContractTraceProjection
├─ CompatibilityTraceIndex
└─ ContractPackageLifecycle

辅助引用状态族
├─ ExternalReference
└─ EventCatalogReference
```

### 7.2 主线生命周期状态图

```text
<ContractLifecycle>
  draft
    │ CreateContractDraft
    ├──────────────────────────────────────────────┐
    ▼                                              │
  in_review                                        │
    │ SubmitContractForReview                      │
    ▼                                              │
  published                                        │
    │ PublishContractBaseline                      │
    ├───────────────┬───────────────┬──────────────┘
    ▼               ▼               ▼
deprecated       superseded       retired
```

关键说明:
- `draft`、`in_review`、`published`、`deprecated`、`superseded`、`retired` 是主线 lifecycle 状态。
- `published` 既可以进入弃用 / 退役,也可以被新定义 supersede。
- `retired` 是终态,不允许直接回到主线。

### 7.3 发布与派生传播图

```text
<CompatibilityStatus>
  pending
    │ ValidateContractChangeJob
    ├───────────────┬───────────────┐
    ▼               ▼               │
compatible     incompatible        │
    │ PublishContractBaseline       │
    ▼                               │
<ContractReleaseBaseline>           │
  prepared                          │
    │ mark_released                  │
    ▼                               │
  released                          │
    │ DeriveReleaseSnapshotJob      │
    ▼                               │
<ContractReleaseSnapshot>           │
  building                          │
    │ append outbox / fact           │
    ▼                               │
  ready                             │
```

关键说明:
- `CompatibilityStatus` 先决定是否可进入发布。
- `ContractReleaseBaseline` 是收口锚点,`ContractReleaseSnapshot` 是派生读面。
- 事实输出和快照派生都必须显式通过作业或 outbox 表达,不能假装成同步完成。

### 7.4 读面与事实传播图

```text
<ContractFactRecord>
  pending
    │ PublishContractFactJob
    ▼
  published
    │ outbox / downstream relay
    ▼
  archived

<DownstreamConsumptionRef>
  pending
    │ snapshot ready / consumer refresh
    ▼
  synced
    │ new baseline / stale view
    ▼
  stale
```

关键说明:
- 事实记录和消费引用都是可感知状态,但不是契约真相本体。
- `stale` 是允许存在的状态,用来提醒需要刷新,不是错误。

### 7.5 读面索引状态图

```text
<ContractReadModel / ContractTraceProjection / CompatibilityTraceIndex>
  rebuilding / building
    │ RebuildContractIndexJob
    ▼
  ready
    │ definition / fact change
    ▼
  stale
```

关键说明:
- 读面状态只用于查询一致性和可追溯性。
- `stale` 不表示真相失效,只表示读面需要重建。

---

## 8. 回填草稿

可直接回填到 `02-概要设计.md` 的起草结构:

```md
## 9. 状态定义与状态流转

> 校准来源:
> - `design-calibration/02_hld_step_09_state_machine.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“状态族总览”“主线生命周期状态图”“发布与派生传播图”“读面与事实传播图”“读面索引状态图”小节,了解本章如何把多个对象族的状态收束为可执行状态模型。

### 9.1 状态族总览

| 对象族 | 状态集合 | 是否进入正常主线 | 主要触发 |
|---|---|---|---|
| `ContractDefinition` / `ContractLifecycle` | `draft`、`in_review`、`published`、`deprecated`、`retired`、`superseded` | 是 | `CreateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle` |
| `CompatibilityStatus` | `pending`、`compatible`、`incompatible` | 是 | `ValidateContractChangeJob`、发布门禁结果 |
| `ContractReleaseBaseline` | `prepared`、`released`、`superseded`、`retired` | 是 | `PublishContractBaseline`、`UpdateContractLifecycle` |
| `ContractReleaseSnapshot` | `building`、`ready`、`superseded`、`archived` | 是 | `DeriveReleaseSnapshotJob`、运维归档 |
| `ContractFactRecord` | `pending`、`published`、`failed`、`archived` | 是 | `PublishContractFactJob` |
| `DownstreamConsumptionRef` | `pending`、`synced`、`stale`、`retired` | 是 | 快照刷新、下游消费反馈、运维退役 |
| `ContractReadModel` | `rebuilding`、`ready`、`stale` | 是 | `RebuildContractIndexJob`、定义变更 |
| `ContractTraceProjection` | `rebuilding`、`ready`、`stale` | 是 | `RebuildContractIndexJob`、事实追加 |
| `CompatibilityTraceIndex` | `building`、`ready`、`stale`、`retired` | 是 | `ValidateContractChangeJob`、兼容性变更、重建 |
| `ContractPackageLifecycle` | `draft`、`published`、`deprecated`、`retired` | 是 | 包发布、包退役、替代 |

### 9.2 主线生命周期状态图

```text
<ContractLifecycle>
  draft
    │ CreateContractDraft
    ├──────────────────────────────────────────────┐
    ▼                                              │
  in_review                                        │
    │ SubmitContractForReview                      │
    ▼                                              │
  published                                        │
    │ PublishContractBaseline                      │
    ├───────────────┬───────────────┬──────────────┘
    ▼               ▼               ▼
deprecated       superseded       retired
```

### 9.3 发布与派生传播图

```text
<CompatibilityStatus>
  pending
    │ ValidateContractChangeJob
    ├───────────────┬───────────────┐
    ▼               ▼               │
compatible     incompatible        │
    │ PublishContractBaseline       │
    ▼                               │
<ContractReleaseBaseline>           │
  prepared                          │
    │ mark_released                  │
    ▼                               │
  released                          │
    │ DeriveReleaseSnapshotJob      │
    ▼                               │
<ContractReleaseSnapshot>           │
  building                          │
    │ append outbox / fact           │
    ▼                               │
  ready                             │
```

### 9.4 读面与事实传播图

```text
<ContractFactRecord>
  pending
    │ PublishContractFactJob
    ▼
  published
    │ outbox / downstream relay
    ▼
  archived

<DownstreamConsumptionRef>
  pending
    │ snapshot ready / consumer refresh
    ▼
  synced
    │ new baseline / stale view
    ▼
  stale
```

### 9.5 读面索引状态图

```text
<ContractReadModel / ContractTraceProjection / CompatibilityTraceIndex>
  rebuilding / building
    │ RebuildContractIndexJob
    ▼
  ready
    │ definition / fact change
    ▼
  stale
```

### 9.6 允许迁移清单

| 对象族 | 允许迁移 |
|---|---|
| `ContractLifecycle` | `draft -> in_review -> published -> deprecated -> retired`、`published -> superseded` |
| `CompatibilityStatus` | `pending -> compatible / incompatible`、重新检查后回到 `pending` |
| `ContractReleaseBaseline` | `prepared -> released -> superseded / retired` |
| `ContractReleaseSnapshot` | `building -> ready -> superseded / archived` |
| `ContractFactRecord` | `pending -> published / failed -> archived` |
| `DownstreamConsumptionRef` | `pending -> synced -> stale -> synced`、`synced / stale -> retired` |
| `ContractReadModel` / `ContractTraceProjection` | `rebuilding / building -> ready -> stale` |
| `CompatibilityTraceIndex` | `building -> ready -> stale -> retired` |

### 9.7 禁止迁移清单

| 对象族 | 明确禁止 |
|---|---|
| `ContractLifecycle` | `retired -> published`、`superseded -> draft`、`retired -> in_review` |
| `ContractReleaseBaseline` | `released -> prepared`、绕过门禁直接进入 `released` |
| `ContractReleaseSnapshot` | `ready -> building` 作为普通状态回退 |
| `ContractFactRecord` | `published -> pending` 伪装成未输出 |
| `DownstreamConsumptionRef` | `retired -> synced` |
| `ContractReadModel` / `ContractTraceProjection` | `ready -> published` 这类把读面当真相的迁移 |
| `CompatibilityStatus` | `compatible -> incompatible` 直接覆盖而不保留复核痕迹 |
```

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 `ExternalReference` / `EventCatalogReference` 也纳入本章主线状态图 | A. 纳入; B. 放到辅助引用状态说明; C. 不提 | B | 它们是辅助引用状态,不应抢占主线状态焦点 | 已确认采用 B |
| `ContractPackageLifecycle` 是否需要独立状态图 | A. 需要; B. 不需要,只写表; C. 合并到 `ContractLifecycle` | B | 包生命周期和定义生命周期相邻但不相同,用表足够 | 已确认采用 B |
| 读面 `stale` 是否视为错误 | A. 视为错误; B. 视为可接受但需要重建; C. 不提 | B | 读面可以滞后,但要显式可见 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确本仓没有单一全局状态机,而是多个对象族的正式状态模型。
- 已明确主线状态族、允许迁移和禁止迁移的边界。
- 已明确状态变化如何影响 outbox、projection 和下游感知。
- 可以进入 Step 10 异常与边界场景轮廓。
```

---

## 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 `ExternalReference` / `EventCatalogReference` 也纳入本章主线状态图 | A. 纳入; B. 放到辅助引用状态说明; C. 不提 | B | 它们是辅助引用状态,不应抢占主线状态焦点 | 已确认采用 B |
| `ContractPackageLifecycle` 是否需要独立状态图 | A. 需要; B. 不需要,只写表; C. 合并到 `ContractLifecycle` | B | 包生命周期和定义生命周期相邻但不相同,用表足够 | 已确认采用 B |
| 读面 `stale` 是否视为错误 | A. 视为错误; B. 视为可接受但需要重建; C. 不提 | B | 读面可以滞后,但要显式可见 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确本仓没有单一全局状态机,而是多个对象族的正式状态模型。
- 已明确主线状态族、允许迁移和禁止迁移的边界。
- 已明确状态变化如何影响 outbox、projection 和下游感知。
- 可以进入 Step 10 异常与边界场景轮廓。
