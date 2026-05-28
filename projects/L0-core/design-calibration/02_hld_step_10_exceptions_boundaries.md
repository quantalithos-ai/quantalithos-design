# Step 10. 异常与边界场景轮廓

> 本版本承接 Step 8 的关键处理流和 Step 9 的状态流转,把 `L0-core` 里不能留到详细设计才发现的关键异常路径与边界场景收束出来。
> 本步只回答“哪些异常必须在概要设计层先点名、由哪个部分处理、会不会影响主线状态或传播关系”,不展开完整错误码、重试参数、补偿脚本或恢复流程细节。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
- 回填章节: `projects/L0-core/02-概要设计.md` §10 异常与边界场景轮廓

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 8 关键处理流 | 草稿写路径、评审提交、基线发布、生命周期迁移、读路径、追溯路径、后台校验 / 复算、快照派生、索引重建、事实发布等处理流已收稳 | 作为异常落点的主体背景 |
| Step 9 状态机与状态流转 | 已明确主线状态族、允许迁移、禁止迁移和状态传播方向 | 作为异常是否改变状态传播的判断依据 |
| Step 7 API / 接口骨架 | 已明确写入口、读入口、事件输出和作业入口的边界 | 作为异常落在哪个接口族的依据 |
| 架构 Step 9 / Step 10 | 已确认本仓不是在线服务,异常处理不能写成 bus 实现、UI 规则或工具链脚本 | 作为“不写什么”的边界依据 |

已确认结论:

```text
异常与边界场景必须点名那些会改变主线理解的失败路径,例如幂等冲突、非法状态迁移、兼容性不通过、快照派生失败、读面 not ready、索引 stale、事实发布失败和引用失效。
本步只写会影响主流程骨架的异常,不写错误码全集、重试参数、补偿脚本和数据库恢复策略。
```

依赖的前序 Step:

```text
Step 8 已确认关键处理流。
Step 9 已确认状态机与状态流转。
```

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名?

回答:

| 异常场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 命令幂等键重复或重复提交 | `ContractCommandApi` / `ContractChangeService` | 视为幂等重复,不能产生第二次写入 |
| 非法状态迁移 | `ContractLifecycle` / `ContractDefinition` | 直接拒绝,保持原状态不变 |
| 兼容性不通过 | `ContractCompatibilityService` / `ValidateContractChangeJob` | 阻断发布,保持基线在 `prepared` 或 `released` 的前序态 |
| 发布门禁缺失或 gate 引用无效 | `PublishContractBaseline` / `ContractReleaseService` | 不进入 `released`,必须回到可审查状态 |
| 快照派生失败 | `DeriveReleaseSnapshotJob` / `ContractReleaseSnapshot` | 基线可保持已发布,快照保持 `building` 或待重试语义,失败事实由作业记录表达 |
| 读面未就绪或 stale | `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex` | 返回可解释的 stale / rebuilding 视图,不能伪装成最新 |
| 事实发布失败 | `PublishContractFactJob` / `ContractFactRecord` | 保留 failed / pending 状态,不能伪装成已传播完成 |
| 外部引用 broken / stale | `ExternalReference` / `EventCatalogReference` | 显式暴露引用失效,不能补造正文 |
| 下游消费引用 stale | `DownstreamConsumptionRef` | 显式暴露过期,等待刷新 |

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机?

回答:

| 边界场景 | 改变的对象 / 部分 | 影响方式 |
|---|---|---|
| 命令重复提交 | 命令入口 / 契约变更承接部分 | 必须通过幂等键和版本边界避免重复写入 |
| 兼容性不通过 | 兼容性门禁与发布基线部分 | `ContractReleaseBaseline` 不能进入 `released` |
| 快照派生滞后 | 快照派生与下游消费部分 | `ContractReleaseSnapshot` 可晚于 baseline,但不能反写真相 |
| 读面 stale | 引用索引与追溯查询部分 | `ContractReadModel` / `ContractTraceProjection` 必须显式表达可重建状态 |
| 事实发布失败 | 后台校验与事实输出部分 | `ContractFactRecord` 必须保留失败态,不能吞掉事实输出失败 |
| 外部引用失效 | 引用索引与追溯查询部分 | `ExternalReference` / `EventCatalogReference` 不能继续表现为已确认 |

### 3.3 哪些失败不能留到详细设计才发现?

回答:

- 幂等键重复时是否允许第二次写入,必须在概要设计层明确“不允许产生第二次副作用”。
- 兼容性不通过时是否还能发布 baseline,必须明确“不可以”。
- 快照失败是否反向回滚 baseline,必须明确“不回滚真相,只保留快照失败态”。
- 读面 stale 时是否还能继续服务查询,必须明确“可以返回 stale 语义,但不能伪装成最新”。
- 事实发布失败时是否等同于契约事实不存在,必须明确“不是,只是传播失败”。
- 引用 broken 时是否允许自动补造正文,必须明确“不允许”。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

回答:

只需要讲到三个层次:

1. 这个异常落在哪个主语或部分上处理。
2. 这个异常会不会改变状态族、outbox、projection 或下游感知。
3. 这个异常在概要设计层的正确语义是什么,而不是实现怎么重试。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 Step 10 缺位 | 原 `02` 没有把关键异常和边界单独收束 | 后续详细设计会临时补异常,导致骨架不稳定 |
| 旧版异常表达 | 容易把异常写成错误码或恢复脚本 | 会滑进实现层 |
| 旧版边界 | 不区分真相失败、读面 stale、事实传播失败和引用失效 | 容易把不同失败混成一类 |
| 旧版传播口径 | 不明确异常是否影响 outbox / projection / downstream | 后续测试和验收无法定位失败边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 异常范围 | 没有独立章 | 只收关键异常和边界场景 | 避免把错误码全集写进概要设计 |
| 失败语义 | 只写失败 | 明确真相失败、读面 stale、传播失败和引用失效的差异 | 便于后续实现和测试分层 |
| 处理边界 | 不清楚落在哪个部分 | 明确到命令入口、门禁、作业、读面和引用面 | 让详细设计继续按职责展开 |
| 主线影响 | 不明确 | 明确会不会影响 outbox、projection、downstream | 防止异常被轻描淡写 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 罗列所有错误码 | 完整 | 太细,会变成实现规范 | 不采用 |
| 方案 B: 只写影响主线理解的关键异常 | 边界清晰,可继续下钻 | 需要筛选 | 采用 |
| 方案 C: 只写一小段“有异常” | 简短 | 对详细设计帮助不大 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 关键异常场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 命令幂等键重复或重复提交 | `ContractCommandApi` / `ContractChangeService` | 视为幂等重复,不能产生第二次写入 |
| 非法状态迁移 | `ContractLifecycle` / `ContractDefinition` | 直接拒绝,保持原状态不变 |
| 兼容性不通过 | `ContractCompatibilityService` / `ValidateContractChangeJob` | 阻断发布,保持基线在前序态 |
| 发布门禁缺失或 gate 引用无效 | `PublishContractBaseline` / `ContractReleaseService` | 不进入 `released`,必须回到可审查状态 |
| 快照派生失败 | `DeriveReleaseSnapshotJob` / `ContractReleaseSnapshot` | 基线可保持已发布,快照保持 `building` 或待重试语义,失败事实由作业记录表达 |
| 读面未就绪或 stale | `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex` | 返回可解释的 stale / rebuilding 视图 |
| 事实发布失败 | `PublishContractFactJob` / `ContractFactRecord` | 保留 failed / pending 状态 |
| 外部引用 broken / stale | `ExternalReference` / `EventCatalogReference` | 显式暴露引用失效 |
| 下游消费引用 stale | `DownstreamConsumptionRef` | 显式暴露过期,等待刷新 |

### 7.2 发布与派生异常影响图

```text
<PublishContractBaseline>
  │
  ├─ gate invalid / compatibility incompatible
  │      └─ keep <ContractReleaseBaseline> in prepared
  │
  └─ gate valid / compatibility compatible
         ├─ mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
         └─ schedule DeriveReleaseSnapshotJob
                │
                ├─ success -> <ContractReleaseSnapshot ready> -> downstream can consume
                └─ failed   -> <ContractReleaseSnapshot building> + <job failure fact> -> baseline still released
```

关键说明:
- 兼容性失败和 gate 失效只影响是否能发布,不代表契约真相不存在。
- 快照失败不会把已经发布的 baseline 反向打回草稿。
- 下游消费只能依赖已发布或已准备好的快照,不能假装异常不存在。

### 7.3 读面异常影响图

```text
<GetContractDefinition / TraceContractEvolution>
  │
  ├─ read model ready / trace projection ready
  │      └─ return Result / View
  │
  └─ read model stale / rebuilding / trace projection not ready
         ├─ return stale / rebuilding view
         └─ schedule RebuildContractIndexJob
```

关键说明:
- 读面异常是可解释的,不等于真相失败。
- 如果读面尚未就绪,应显式暴露 stale / rebuilding,而不是伪装成最新。
- 重建作业是修复读面,不是改写契约真相。

### 7.4 事实发布异常影响图

```text
<PublishContractFactJob>
  │
  ├─ success -> <FactOutboxEvent / ContractFactPublished>
  │
  └─ failed  -> <ContractFactRecord failed>
                -> preserve retryable / archived state
```

关键说明:
- 事实发布失败不是契约事实不存在,只是传播失败。
- 失败状态必须显式存在,不能吞掉。

---

## 8. 回填草稿

可直接回填到 `02-概要设计.md` 的起草结构:

```md
## 10. 异常与边界场景轮廓

> 校准来源:
> - `design-calibration/02_hld_step_10_exceptions_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键异常场景表”“发布与派生异常影响图”“读面异常影响图”“事实发布异常影响图”小节,了解本章如何把关键失败路径收束为可执行异常轮廓。

### 10.1 关键异常场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 命令幂等键重复或重复提交 | `ContractCommandApi` / `ContractChangeService` | 视为幂等重复,不能产生第二次写入 |
| 非法状态迁移 | `ContractLifecycle` / `ContractDefinition` | 直接拒绝,保持原状态不变 |
| 兼容性不通过 | `ContractCompatibilityService` / `ValidateContractChangeJob` | 阻断发布,保持基线在前序态 |
| 发布门禁缺失或 gate 引用无效 | `PublishContractBaseline` / `ContractReleaseService` | 不进入 `released`,必须回到可审查状态 |
| 快照派生失败 | `DeriveReleaseSnapshotJob` / `ContractReleaseSnapshot` | 基线可保持已发布,快照保持 `building` 或待重试语义,失败事实由作业记录表达 |
| 读面未就绪或 stale | `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex` | 返回可解释的 stale / rebuilding 视图 |
| 事实发布失败 | `PublishContractFactJob` / `ContractFactRecord` | 保留 failed / pending 状态 |
| 外部引用 broken / stale | `ExternalReference` / `EventCatalogReference` | 显式暴露引用失效 |
| 下游消费引用 stale | `DownstreamConsumptionRef` | 显式暴露过期,等待刷新 |

### 10.2 发布与派生异常影响图

```text
<PublishContractBaseline>
  │
  ├─ gate invalid / compatibility incompatible
  │      └─ keep <ContractReleaseBaseline> in prepared
  │
  └─ gate valid / compatibility compatible
         ├─ mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
         └─ schedule DeriveReleaseSnapshotJob
                │
                ├─ success -> <ContractReleaseSnapshot ready> -> downstream can consume
                └─ failed   -> <ContractReleaseSnapshot building> + <job failure fact> -> baseline still released
```

### 10.3 读面异常影响图

```text
<GetContractDefinition / TraceContractEvolution>
  │
  ├─ read model ready / trace projection ready
  │      └─ return Result / View
  │
  └─ read model stale / rebuilding / trace projection not ready
         ├─ return stale / rebuilding view
         └─ schedule RebuildContractIndexJob
```

### 10.4 事实发布异常影响图

```text
<PublishContractFactJob>
  │
  ├─ success -> <FactOutboxEvent / ContractFactPublished>
  │
  └─ failed  -> <ContractFactRecord failed>
                -> preserve retryable / archived state
```

### 10.5 允许 / 禁止口径

| 场景 | 允许 | 禁止 |
|---|---|---|
| 幂等重复 | 返回幂等语义或拒绝重复副作用 | 产生第二次写入 |
| 兼容性不通过 | 阻断发布 | 伪装成发布成功 |
| 快照失败 | 保留 baseline 已发布,快照失败可见 | 回滚已发布真相 |
| 读面 stale | 显式返回 stale / rebuilding | 假装最新 |
| 事实发布失败 | 保留 failed / pending | 吞掉失败 |
| 引用 broken | 显式暴露失效 | 补造正文 |
```

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 读面 stale 时是否默认返回 stale 视图 | A. 返回 stale 视图; B. 直接失败; C. 回退到写模型 | A | 读面滞后是允许的,但必须显式可见 | 已确认采用 A |
| 快照失败是否回滚 baseline | A. 回滚; B. 不回滚,保留快照失败态; C. 静默重试 | B | baseline 已是真相锚点,不能被派生失败反向打回 | 已确认采用 B |
| 事实发布失败是否等同于契约事实不存在 | A. 是; B. 不是,只是传播失败; C. 由下游自行判断 | B | 事实和传播是两件事,必须分开表达 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确关键异常路径与边界场景及其处理部分。
- 已明确哪些失败只影响读面或传播,哪些失败会阻断发布主线。
- 已明确异常不能下沉为错误码全集或补偿脚本。
- 可以进入 Step 11 详细设计承接清单。
```

---

## 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 读面 stale 时是否默认返回 stale 视图 | A. 返回 stale 视图; B. 直接失败; C. 回退到写模型 | A | 读面滞后是允许的,但必须显式可见 | 已确认采用 A |
| 快照失败是否回滚 baseline | A. 回滚; B. 不回滚,保留快照失败态; C. 静默重试 | B | baseline 已是真相锚点,不能被派生失败反向打回 | 已确认采用 B |
| 事实发布失败是否等同于契约事实不存在 | A. 是; B. 不是,只是传播失败; C. 由下游自行判断 | B | 事实和传播是两件事,必须分开表达 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确关键异常路径与边界场景及其处理部分。
- 已明确哪些失败只影响读面或传播,哪些失败会阻断发布主线。
- 已明确异常不能下沉为错误码全集或补偿脚本。
- 可以进入 Step 11 详细设计承接清单。
```
