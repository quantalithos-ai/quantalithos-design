# L3-method-library 02 概要 Step 6 附录 C: View / Read Material 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 状态: object_batch_completed
> 当前模式: full-restart
> Projection / view / read material 只能只读、可重建、可过期,不得反写真相。

---

## 1. 本附录职责边界

| 项目 | 内容 |
|---|---|
| 承载对象 | projection、view、read material、freshness 相关对象。 |
| 当前对象范围 | `MethodAssetCatalogView`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`MethodAssetConsumptionReadMaterial`;`MethodAssetTraceMaterial`;`MethodAssetTraceView`;`ConsumptionImpactView`;`MethodAssetRelationView`;`DistributionReadMaterial`;`ExternalSourceSummaryView`;`MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView`。 |
| 本附录不承载 | truth 当前状态、policy 算法、typed ref 定义、audit/history 正文、job / worker / cache product。 |
| 深度限制 | 只写 read model / material 的派生来源、非 truth 边界和可见性语义,不写 projection 实现。 |

## 2. 必读输入

| 文档 | 用途 |
|---|---|
| `02_hld_step_06_key_objects.md` §4 | view / material 候选池和附录索引。 |
| `02_hld_step_05_components_boundary.md` §5.25 / §5.26 | read model 非 truth 和 Step 6 展开门禁。 |
| `00-需求文档.md` §9 / §13 / §14 | 消费、追溯、可用性和验收口径。 |
| `01-架构设计.md` §9 / §10 / §11 | 数据所有权、一致性和后台延后承接。 |
| L1-governance projection 附录 | 只参考 projection 卡片格式和禁止事项。 |

## 3. 对象索引

| 对象 | 对象类别 | Step 5 组成部分 | 当前状态 |
|---|---|---|---|
| `MethodAssetCatalogView` | projection / read model | 方法资产定义与目录 | object_written |
| `MethodAssetConsumptionMaterial` | read material | 受控消费 | object_written |
| `MethodAssetAvailabilityView` | projection / availability view | 受控消费 | object_written |
| `MethodAssetConsumptionReadMaterial` | read material | 受控消费 | merged_into_MethodAssetConsumptionMaterial |
| `MethodAssetTraceMaterial` | trace material | 追溯与一致性保护 | object_written |
| `MethodAssetTraceView` | projection / trace view | 追溯与一致性保护 | object_written |
| `ConsumptionImpactView` | projection / impact view | 追溯与一致性保护 | object_written |
| `MethodAssetRelationView` | projection / relation view | 关系与分发语义 | object_written |
| `DistributionReadMaterial` | read material | 关系与分发语义 | object_written |
| `ExternalSourceSummaryView` | projection / summary view | 外部摘要与引用 | object_written |
| `MaintenanceProgressView` | projection / progress view | 后台维护与收敛 | object_written |
| `MethodPackageView` | projection / peripheral view | 外围包与方法集组织 | object_written |
| `MethodSetAssemblyView` | projection / peripheral view | 外围包与方法集组织 | object_written |

## 4. 模块状态表

| 顺序 | 模块 | 状态 | 产物 | 下一动作 |
|---:|---|---|---|---|
| 1 | 附录框架:再写入 | done | 文件头、职责、索引、模板和停审。 | 等待主控推进。 |
| 2 | catalog / consumption material 批次:先思考 | done | 目录、消费和可用性材料边界。 | 等待主控确认后进入写入。 |
| 3 | catalog / consumption material 批次:再写入 | done | `MethodAssetCatalogView`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView` 三个对象卡片。 | 已完成;进入 trace / relation / external view 批次先思考。 |
| 4 | trace / relation / external view 批次:先思考 | done | 追溯、关系、分发和外部摘要 view/material 边界。 | 等待主控确认后进入写入。 |
| 5 | trace / relation / external view 批次:再写入 | done | 六个 trace / relation / external view/material 对象卡片。 | 已完成;进入 maintenance / peripheral view 批次先思考。 |
| 6 | maintenance / peripheral view 批次:先思考 | done | 维护进度和外围 view 边界。 | 已完成;进入写入批次。 |
| 7 | maintenance / peripheral view 批次:再写入 | done | `MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView` 三个对象卡片。 | 已完成;等待主控进入 refs_trace_audit。 |

## 5. 对象卡片模板

```text
## C?. `ObjectName`

| 项 | 内容 |
|---|---|
| 所属部分 | `Step 5 组成部分` |
| 对象类型 | projection / view / read material |
| 结构责任 | ... |
| 来源回指 | ... |
| 派生来源 | truth / summary / ref source |
| 非 truth 边界 | ... |

| 字段 | 类型 | 作用 |
|---|---|---|

| freshness / availability 候选 | 作用 |
|---|---|

| 成员函数 | 作用 |
|---|---|

| 工厂函数 | 作用 |
|---|---|

| 禁止事项 | 说明 |
|---|---|
```

## 6. 本附录禁止事项

- 不把 view、projection、cache、report 或 read material 写成第二 truth。
- 不写 projection rebuild 算法、存储产品、索引结构、缓存实现或查询 DTO。
- 不保存外部正文、下游运行状态或 UI 私有状态。
- 不通过 view 反向修改 core truth、summary 或 ref。

## 7. 停审记录

| 检查项 | 结论 |
|---|---|
| 是否只创建框架 | no:已完成 catalog / consumption material 批次对象卡片 |
| 是否写对象卡片正文 | yes:已完成全部 view / material 对象卡片 |
| 是否回填正式 §6 | no |
| 下一动作 | 等待主控按顺序进入 `refs_trace_audit typed ref 批次:先思考`。 |

## 8. Catalog / Consumption Material 批次:先思考

### 8.1 问题回答

- 本批只讨论目录读取、正式消费材料和可用性读取三类 view / material 对象,不进入 trace、relation、external、maintenance 或 peripheral view。
- 下一写入批次应写三个对象卡片:`MethodAssetCatalogView`、`MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`。
- `MethodAssetConsumptionReadMaterial` 不再独立成节。它与 `MethodAssetConsumptionMaterial` 同源,都服务受控消费读取,若拆成两个对象会制造“消费材料 truth / 消费读取材料 truth”的双主语风险。
- `MethodAssetCatalogView` 必须从 `MethodAssetDefinition` 和 `MethodAssetCatalogEntry` 派生,服务目录识别、适用语境读取和查询效率,但不能替代 definition truth 或 catalog entry。
- `MethodAssetConsumptionMaterial` 必须表达正式版本在指定消费语境下的只读材料边界,承接 `FormalMethodAssetVersion`、`MethodAssetDefinitionRef`、`DownstreamConsumptionBoundary` 和 `ConsumptionContextRef`,但不能保存下游运行 truth。
- `MethodAssetAvailabilityView` 必须表达可消费、不可消费、待收敛、过期或不可用等读取线索,并点名 `MethodAssetAvailabilityState` 的状态词表来源;完整状态迁移留 Step 9。

### 8.2 诊断

- 本批最大的风险是把 projection / view / material 写成第二 truth。目录 view 命中、消费材料存在、可用性 view 可读,都不能反向证明定义 truth、正式版本 truth 或消费边界发生改变。
- 目录读取和目录 truth 必须分开。`MethodAssetCatalogEntry` 已在 core truth 附录承载目录语义,`MethodAssetCatalogView` 只能是查询和识别材料。
- 消费材料和可用性 view 必须分开。消费材料表达“下游可按边界读取什么正式语义材料”,可用性 view 表达“某个消费语境下当前是否可读 / 待收敛 / 不可用”。
- `01-架构设计.md` 已把正式读取与消费材料定位为读取 / 投影数据,并允许最终一致、待收敛和显式不可用;因此本批对象需要有 freshness / availability 线索,但不写 projection rebuild 算法。
- L1-governance projection 附录只提供对象卡片深度参照:基本信息、字段骨架、状态或 freshness、成员函数、工厂函数和禁止事项;不得复制 Governance 领域对象或语义。

### 8.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| `MethodAssetCatalogView` | 下一批独立写入 | 目录识别和适用语境读取需要稳定 read model,但必须保持非 truth。 |
| `MethodAssetConsumptionMaterial` | 下一批独立写入 | 受控消费需要正式材料边界,否则下游容易复制定义正文或自建私有模型。 |
| `MethodAssetAvailabilityView` | 下一批独立写入 | 下游需要可消费 / 待收敛 / 不可用线索,但这些线索不得成为正式版本 truth。 |
| `MethodAssetConsumptionReadMaterial` | 并入 `MethodAssetConsumptionMaterial` | 读取形态与消费材料同源,拆分会制造重复边界和双对象状态。 |
| `MethodAssetAvailabilityState` | 并入 `MethodAssetAvailabilityView` 点名 | Step 6 只固定状态词表 owner,状态迁移留 Step 9。 |
| `CatalogScopeRef`;`ConsumptionContextRef` | 后移到 typed ref 附录 | 本批只作为字段类型引用,不写 ref body。 |

### 8.4 结构化中间产物

| 下一写入对象 | 所属部分 | 必须表达 | 不得表达 |
|---|---|---|---|
| `MethodAssetCatalogView` | 方法资产定义与目录 | 派生来源、目录 scope、定义 / 目录锚点、freshness、非 truth 边界。 | catalog truth、搜索索引实现、query DTO、缓存结构。 |
| `MethodAssetConsumptionMaterial` | 受控消费 | 正式版本锚点、消费语境、下游边界、只读消费摘要、stale / blocked / unavailable 线索。 | 下游私有定义副本、运行事实、鉴权矩阵、同步包或旧 snapshot。 |
| `MethodAssetAvailabilityView` | 受控消费 | 消费语境下的 availability 状态、来源材料、projection freshness 和不可用语义。 | 正式化裁决、版本 truth、完整状态迁移矩阵、projection rebuild 流程。 |

### 8.5 下一写入批次边界

- 只允许进入 `catalog / consumption material 批次:再写入`。
- 只写 `C1 MethodAssetCatalogView`、`C2 MethodAssetConsumptionMaterial`、`C3 MethodAssetAvailabilityView` 三个对象卡片。
- 不写 `MethodAssetConsumptionReadMaterial` 独立卡片;只在 `MethodAssetConsumptionMaterial` 的说明或禁止事项中承接“读取形态并入”。
- 不写 trace / relation / external / maintenance / package view 对象。
- 不写 projection rebuild 算法、cache/index/store、query DTO、接口、流程、状态迁移或正式 `02-概要设计.md` §6。

### 8.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:`MethodAssetCatalogView`;`MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView` |
| 是否处理 `MethodAssetConsumptionReadMaterial` | pass:并入 `MethodAssetConsumptionMaterial` |
| 是否保持 view / material 非 truth | pass |
| 是否回填正式 §6 | no |

## C1. `MethodAssetCatalogView`

| 项 | 内容 |
|---|---|
| 所属部分 | 方法资产定义与目录 |
| 对象类型 | projection / read model |
| 结构责任 | 提供方法资产身份、目录语义和适用语境的只读识别材料,支撑目录读取和查询入口。 |
| 来源回指 | Step 5 `5.12`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-002;BR-ML-002;`01-架构设计.md` §6/§9/§10。 |
| 派生来源 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`CatalogScopeRef`;目录读取材料维护。 |
| 非 truth 边界 | 不是 definition truth、catalog entry truth、搜索索引实现或缓存产品;view 过期不改变来源 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| catalog_view_ref | MethodAssetCatalogViewRef | 目录视图稳定引用。 |
| definition_ref | MethodAssetDefinitionRef | 回指方法资产定义锚点。 |
| catalog_entry_ref | MethodAssetCatalogEntryRef | 回指目录语义来源。 |
| catalog_scope_ref | CatalogScopeRef | 视图覆盖的目录范围或适用语境。 |
| catalog_summary | MethodAssetCatalogSummary | 面向读取的 body-free 目录摘要。 |
| source_cursor_ref | MethodAssetCatalogProjectionCursorRef | 标记视图派生来源位置,防止被误当 truth。 |

| freshness / availability 候选 | 作用 |
|---|---|
| CatalogViewFresh | 视图与当前 definition / catalog truth 对齐。 |
| CatalogViewStale | 来源 definition、catalog entry 或 scope 变化后等待刷新。 |
| CatalogViewUnavailable | 派生视图暂不可用,但不影响定义和目录 truth 成立。 |

| 成员函数 | 作用 |
|---|---|
| covers_scope(CatalogScopeRef catalog_scope_ref) | 判断视图是否覆盖指定目录范围。 |
| assert_derived_from(MethodAssetDefinitionRef definition_ref) | 校验视图来源定义锚点未漂移。 |
| mark_stale(CatalogViewStalenessReasonRef reason_ref) | 标记视图过期,不修改来源 truth。 |
| safe_summary() | 返回可公开读取的目录摘要,不泄漏外部正文。 |

| 工厂函数 | 作用 |
|---|---|
| from_catalog_truth(MethodAssetDefinition definition, MethodAssetCatalogEntry catalog_entry) | 从定义和目录 truth 派生目录视图。 |
| unavailable(CatalogScopeRef catalog_scope_ref, CatalogViewUnavailableReasonRef reason_ref) | 表达目录范围下视图暂不可用。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代目录 truth | 目录语义以 `MethodAssetCatalogEntry` 为准,view 只能读取。 |
| 不保存搜索实现 | 索引结构、排序算法、缓存键和 query DTO 不属于本对象。 |
| 不触发定义变更 | 读取、刷新或重建 view 不得创建、修改或删除 definition truth。 |
| 不保存外部正文 | 外部来源、artifact、archive 或证据正文不得进入目录视图。 |

## C2. `MethodAssetConsumptionMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | read material / boundary |
| 结构责任 | 承载下游按边界读取和引用正式方法资产语义所需的只读消费材料。 |
| 来源回指 | Step 5 `5.14`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-005/006;BR-ML-003/005/008;`01-架构设计.md` §6/§9/§10。 |
| 派生来源 | `FormalMethodAssetVersion`;`MethodAssetDefinitionRef`;`DownstreamConsumptionBoundary`;`ConsumptionContextRef`。 |
| 非 truth 边界 | 不是下游私有定义副本、同步包、旧 snapshot、运行事实或授权矩阵;读取形态并入本对象。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| consumption_material_ref | MethodAssetConsumptionMaterialRef | 消费材料稳定引用。 |
| formal_version_ref | FormalMethodAssetVersionRef | 指向可消费的正式版本。 |
| definition_ref | MethodAssetDefinitionRef | 回指定义锚点,防止材料成为第二定义 truth。 |
| consumption_context_ref | ConsumptionContextRef | 标识 process、identity、runtime、member-images 等消费语境。 |
| boundary_ref | DownstreamConsumptionBoundaryRef | 指向适用的下游消费边界。 |
| consumption_summary | MethodAssetConsumptionSummary | 面向下游的只读正式语义摘要。 |
| source_cursor_ref | MethodAssetConsumptionMaterialCursorRef | 标记派生来源位置和刷新依据。 |

| freshness / availability 候选 | 作用 |
|---|---|
| ConsumptionMaterialReady | 材料已由正式版本和边界派生,可被受控读取。 |
| ConsumptionMaterialStale | 来源正式版本、定义或边界变化后等待刷新。 |
| ConsumptionMaterialBlocked | 当前消费语境被边界阻止,不得输出正式材料。 |
| ConsumptionMaterialUnavailable | 材料暂不可用,但来源 truth 不受影响。 |

| 成员函数 | 作用 |
|---|---|
| assert_from_formal_version(FormalMethodAssetVersionRef formal_version_ref) | 校验材料锚定正式版本。 |
| assert_context(ConsumptionContextRef consumption_context_ref) | 校验材料适用消费语境。 |
| assert_boundary(DownstreamConsumptionBoundary boundary) | 校验材料未越过 Definition vs Use 边界。 |
| mark_stale(ConsumptionMaterialStalenessReasonRef reason_ref) | 标记消费材料待刷新。 |

| 工厂函数 | 作用 |
|---|---|
| from_formal_version(FormalMethodAssetVersion formal_version, DownstreamConsumptionBoundary boundary) | 从正式版本和消费边界派生材料。 |
| blocked_by_boundary(FormalMethodAssetVersionRef formal_version_ref, DownstreamConsumptionBoundary boundary) | 表达正式版本存在但当前语境不可消费。 |

| 禁止事项 | 说明 |
|---|---|
| 不成为下游私有定义副本 | 下游只能读取或引用材料,不得拥有或改写 definition truth。 |
| 不保存下游运行 truth | 流程执行、成员状态、运行绑定、镜像构建和 UI 状态不得进入材料。 |
| 不隐式正式化 | 生成或读取消费材料不得创建正式版本。 |
| 不拆出平行读取对象 | `MethodAssetConsumptionReadMaterial` 并入本对象,避免重复状态和重复边界。 |

## C3. `MethodAssetAvailabilityView`

| 项 | 内容 |
|---|---|
| 所属部分 | 受控消费 |
| 对象类型 | projection / availability view |
| 结构责任 | 表达正式方法资产在指定消费语境下的可用、不可用、待收敛或过期读取线索。 |
| 来源回指 | Step 5 `5.14`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-005;NFR-ML-001/004/006;`01-架构设计.md` §9/§10/§11。 |
| 派生来源 | `FormalMethodAssetVersionRef`;`MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`;后台读取材料维护。 |
| 非 truth 边界 | 不是正式版本 truth、正式化状态、消费边界或下游同步状态;availability 变化不得反写来源 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| availability_view_ref | MethodAssetAvailabilityViewRef | 可用性视图引用。 |
| formal_version_ref | FormalMethodAssetVersionRef | 视图对应的正式版本。 |
| consumption_context_ref | ConsumptionContextRef | 视图适用的消费语境。 |
| availability_state | MethodAssetAvailabilityState | 可消费、不可消费、待收敛、过期或不可用状态线索。 |
| source_material_ref | OptionMethodAssetConsumptionMaterialRef | 已生成消费材料时的来源引用。 |
| projection_freshness_ref | MethodAssetAvailabilityFreshnessRef | 表达视图相对来源材料的新鲜度。 |
| unavailable_reason_ref | OptionMethodAssetAvailabilityUnavailableReasonRef | 视图不可用或不可消费时的安全原因引用。 |

| freshness / availability 候选 | 作用 |
|---|---|
| AvailableForConsumption | 当前消费语境可读取正式消费材料。 |
| PendingConvergence | 来源 truth 已成立,但读取材料或下游感知仍在收敛。 |
| NotAvailableForContext | 当前消费语境不满足边界要求。 |
| AvailabilityStale | 视图落后于正式版本、消费材料或边界变化。 |
| AvailabilityUnavailable | 视图暂不可用,但来源 truth 仍按原状态判断。 |

| 成员函数 | 作用 |
|---|---|
| refresh_from_material(MethodAssetConsumptionMaterial consumption_material) | 从消费材料刷新可用性读取线索。 |
| mark_pending_convergence(ConsumptionContextRef consumption_context_ref) | 标记消费语境下仍在收敛。 |
| mark_not_available(DownstreamConsumptionBoundary boundary) | 表达当前边界下不可消费。 |
| assert_derived_from(FormalMethodAssetVersionRef formal_version_ref) | 校验视图来源正式版本未漂移。 |

| 工厂函数 | 作用 |
|---|---|
| from_consumption_material(MethodAssetConsumptionMaterial consumption_material) | 从已生成消费材料派生可用性视图。 |
| unavailable_for_context(FormalMethodAssetVersionRef formal_version_ref, ConsumptionContextRef consumption_context_ref) | 表达特定消费语境下视图不可用。 |
| pending_convergence(FormalMethodAssetVersionRef formal_version_ref, ConsumptionContextRef consumption_context_ref) | 表达正式版本已成立但读取材料仍待收敛。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代正式版本 | 可用性 view 不能创建、废弃或替换正式版本。 |
| 不保存下游同步结果 | 下游是否已安装、同步、运行或展示不属于本对象。 |
| 不写完整状态迁移 | Step 6 只固定状态词表 owner,完整迁移留 Step 9。 |
| 不绕过消费边界 | 可用性为可读不等于扩大 `DownstreamConsumptionBoundary` 授权。 |

## 9. Catalog / Consumption Material 批次:再写入

### 9.1 写入内容

- 已写入 `C1 MethodAssetCatalogView` 对象卡片,固定目录 read model 的派生来源和非 truth 边界。
- 已写入 `C2 MethodAssetConsumptionMaterial` 对象卡片,固定正式消费材料的只读材料边界。
- 已写入 `C3 MethodAssetAvailabilityView` 对象卡片,固定可用性 view 的状态词表 owner 和读取边界。
- 已将 `MethodAssetConsumptionReadMaterial` 明确并入 `MethodAssetConsumptionMaterial`,不生成独立对象卡片。
- 已将本附录对象索引中三项状态更新为 `object_written`。
- 已将本附录当前恢复点推进到 `trace / relation / external view 批次:先思考`。

### 9.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 trace / relation / external view 对象 | no |
| 写 maintenance / peripheral view 对象 | no |
| 写 projection rebuild 算法 / cache / index / store | no |
| 写接口 / DTO / repository / event / DDL | no |
| 写处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 9.3 停审记录

| 检查项 | 结论 |
|---|---|
| 三个 catalog / consumption material 对象是否完成概要卡片 | pass |
| 是否保持 read model / material 非 truth | pass |
| 是否避免独立写 `MethodAssetConsumptionReadMaterial` | pass |
| 是否越界写 projection 实现或接口 | no |
| 是否允许进入下一模块 | pass:下一模块为 `trace / relation / external view 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `trace / relation / external view 批次:先思考`;只思考 `MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactView`、`MethodAssetRelationView`、`DistributionReadMaterial`、`ExternalSourceSummaryView` 的写入边界,不得直接写对象卡片正文、projection 实现、接口、流程、状态迁移或正式 §6。

## 10. Trace / Relation / External View 批次:先思考

### 10.1 问题回答

- 本批只思考追溯、一致性影响、关系读取、分发读取和外部摘要读取材料,不进入维护进度、外围 package / method set view。
- 下一写入批次应写六个对象卡片:`MethodAssetTraceMaterial`、`MethodAssetTraceView`、`ConsumptionImpactView`、`MethodAssetRelationView`、`DistributionReadMaterial`、`ExternalSourceSummaryView`。
- `MethodAssetTraceMaterial` 需要独立写入,因为它承接正式化依据、版本变化、消费语境、关系 / 分发变化和外部依据 lineage 的 body-free 追溯材料,但不是 raw audit log。
- `MethodAssetTraceView` 需要独立写入,因为它是面向查询 / 审计视角的派生 trace 读取视图,不得替代 trace material、audit trail 或 history。
- `ConsumptionImpactView` 需要独立写入,因为 `ConsumptionImpactSummary` 已作为 support summary 表达影响摘要 truth-like 线索,view 只负责读取、聚合和可见性。
- `MethodAssetRelationView` 与 `DistributionReadMaterial` 需要同批思考,因为二者共同服务关系读取和分发语义读取,但不能成为关系 truth 或 marketplace listing。
- `ExternalSourceSummaryView` 需要独立写入,因为外部摘要可被正式化、追溯、关系和外围组织读取,但 view 不能保存外部正文或外部系统状态。

### 10.2 诊断

- 本批横跨三个 Step 5 组成部分,最大风险是把“可读视图”误写成新 truth。trace material、relation view、distribution material 和 external summary view 都必须只读、可重建、可过期。
- 追溯材料与审计 / 历史 / lineage 必须分开。`MethodAssetTraceMaterial` 和 `MethodAssetTraceView` 可以组织可读追溯线索,但 `MethodAssetAuditTrail`、history、lineage 对象应留给 `refs_trace_audit` 附录。
- 影响 view 与影响 summary 必须分开。`ConsumptionImpactSummary` 已在 core truth / support summary 承接摘要边界,`ConsumptionImpactView` 只能从 summary、trace material 和消费语境派生。
- 关系读取与关系 truth 必须分开。`MethodAssetRelation` 已在 core truth 附录承载关系 truth,`MethodAssetRelationView` 只能服务读取和查询。
- 分发读取不得滑向 marketplace。`DistributionReadMaterial` 只表达方法资产分发语义读取材料,不得保存 listing、价格、订单、安装、交付或履约事实。
- 外部摘要读取不得复制外部正文。`ExternalSourceSummaryView` 只从 `ExternalSourceSummary`、external ref 和 body-free marker 派生,不得保存标准全文、ADR 正文、artifact / archive 正文或证据文件正文。

### 10.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| `MethodAssetTraceMaterial` | 下一批独立写入 | 追溯材料是变化解释和一致性保护的读取材料来源,但不等于 audit/history。 |
| `MethodAssetTraceView` | 下一批独立写入 | 追溯查询需要只读 view,避免查询直接消费 raw trace material 或 audit trail。 |
| `ConsumptionImpactView` | 下一批独立写入 | 影响摘要读取需要 projection,但不能拥有下游运行 truth。 |
| `MethodAssetRelationView` | 下一批独立写入 | 关系读取需要派生 view,但关系 truth 仍由 `MethodAssetRelation` 承载。 |
| `DistributionReadMaterial` | 下一批独立写入 | 分发语义需要被消费和外围组织读取,但不得成为 marketplace listing。 |
| `ExternalSourceSummaryView` | 下一批独立写入 | 外部摘要需要可读 view,但外部正文和外部生命周期不入仓。 |
| `MethodAssetAuditTrail`;history;lineage | 留给 `refs_trace_audit` | 这些是 trace/audit/history/lineage 对象,不属于 view/material 批次。 |
| `ExternalSourceRef`;`ArtifactArchiveRef`;`DistributionContextRef` | 留给 `refs_trace_audit` | 本批只作为字段类型或派生来源引用,不写 typed ref body。 |

### 10.4 结构化中间产物

| 下一写入对象 | 所属部分 | 必须表达 | 不得表达 |
|---|---|---|---|
| `MethodAssetTraceMaterial` | 追溯与一致性保护 | 追溯主体、正式版本 / 消费语境 / 外部依据线索、body-free 追溯材料、freshness。 | raw audit log、history 正文、证据正文、lineage 算法。 |
| `MethodAssetTraceView` | 追溯与一致性保护 | 从 trace material 派生的只读追溯视图、可见性和过期语义。 | trace truth、审计 trail、查询 DTO、UI 展示状态。 |
| `ConsumptionImpactView` | 追溯与一致性保护 | 从 impact summary / trace material 派生的影响读取视图。 | 下游运行状态、同步成功记录、影响计算算法。 |
| `MethodAssetRelationView` | 关系与分发语义 | 从 relation truth 派生的关系读取视图和 freshness。 | 关系 truth、图算法、关系写入流程。 |
| `DistributionReadMaterial` | 关系与分发语义 | 分发语义读取材料、分发语境、消费辅助线索。 | marketplace listing、交易、安装、履约、分发协议。 |
| `ExternalSourceSummaryView` | 外部摘要与引用 | 外部摘要读取视图、body-free 来源线索、可用 / 过期语义。 | 外部正文、artifact/archive 包体、外部 API payload。 |

### 10.5 下一写入批次边界

- 只允许进入 `trace / relation / external view 批次:再写入`。
- 只写 `C4 MethodAssetTraceMaterial`、`C5 MethodAssetTraceView`、`C6 ConsumptionImpactView`、`C7 MethodAssetRelationView`、`C8 DistributionReadMaterial`、`C9 ExternalSourceSummaryView` 六个对象卡片。
- 不写 `MethodAssetAuditTrail`、history、lineage、typed ref 家族正文或 maintenance / peripheral view。
- 不写 projection rebuild 算法、trace 计算算法、关系图算法、marketplace 交易模型、外部解析机制、接口、流程、状态迁移或正式 `02-概要设计.md` §6。

### 10.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:六个 view/material 对象 |
| 是否保持 trace / relation / external view 非 truth | pass |
| 是否把 audit/history/lineage 或 typed ref 混入本批 | no |
| 是否回填正式 §6 | no |

## C4. `MethodAssetTraceMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | trace material / read material |
| 结构责任 | 汇聚正式化依据、版本变化、消费语境、关系 / 分发变化和外部依据 lineage 的 body-free 追溯材料。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26.1`;`00-需求文档.md` FR-ML-007/008;BR-ML-011/020/021/022;`01-架构设计.md` §6/§9/§10。 |
| 派生来源 | `FormalMethodAssetVersion`;`FormalizationBasisSummary`;`MethodAssetConsumptionMaterial`;`MethodAssetRelation`;`ExternalSourceSummary`。 |
| 非 truth 边界 | 不是 raw audit log、telemetry、history、lineage truth 或证据正文;trace material stale 不改变来源 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| trace_material_ref | MethodAssetTraceMaterialRef | 追溯材料稳定引用。 |
| trace_subject_ref | TraceSubjectRef | 追溯主体,可指向定义、正式版本、消费材料、关系或外部依据。 |
| formal_version_ref | OptionFormalMethodAssetVersionRef | 关联的正式版本线索。 |
| consumption_material_ref | OptionMethodAssetConsumptionMaterialRef | 关联的消费材料线索。 |
| relation_ref | OptionMethodAssetRelationRef | 关联的关系变化线索。 |
| external_summary_refs | ExternalSourceSummaryRefSet | 关联的外部摘要来源,不保存正文。 |
| trace_summary | MethodAssetTraceSummary | 面向读取的 body-free 追溯摘要。 |
| source_cursor_ref | MethodAssetTraceMaterialCursorRef | 标记材料派生来源位置和刷新依据。 |

| freshness / availability 候选 | 作用 |
|---|---|
| TraceMaterialReady | 追溯材料已可用于变化解释和一致性保护。 |
| TraceMaterialStale | 来源正式版本、消费材料、关系或外部摘要变化后等待刷新。 |
| TraceMaterialIncomplete | 已有部分线索,但 lineage 或影响摘要尚未收敛。 |
| TraceMaterialUnavailable | 追溯材料暂不可用,但来源 truth 不受影响。 |

| 成员函数 | 作用 |
|---|---|
| assert_subject(TraceSubjectRef trace_subject_ref) | 校验追溯材料属于指定主体。 |
| link_external_summary(ExternalSourceSummaryRef external_summary_ref) | 连接外部安全摘要线索。 |
| mark_stale(TraceMaterialStalenessReasonRef reason_ref) | 标记材料过期,不修改来源 truth。 |
| safe_trace_summary() | 返回不含 raw log / external body 的追溯摘要。 |

| 工厂函数 | 作用 |
|---|---|
| from_version_change(FormalMethodAssetVersionRef formal_version_ref, FormalizationBasisSummaryRef basis_summary_ref) | 从正式版本变化和依据摘要派生追溯材料。 |
| from_consumption_context(MethodAssetConsumptionMaterialRef consumption_material_ref, TraceSubjectRef trace_subject_ref) | 从消费材料和追溯主体派生追溯材料。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw log | telemetry、raw audit dump、handler log 和 report body 不属于本对象。 |
| 不替代 audit/history | 审计 trail、历史记录和 lineage 对象留给 `refs_trace_audit` 附录。 |
| 不保存外部正文 | 标准、ADR、artifact、archive 或证据正文只能以 summary/ref 进入。 |
| 不修复来源 truth | trace material 刷新不得修改 definition、formal version、relation 或 consumption truth。 |

## C5. `MethodAssetTraceView`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | projection / trace view |
| 结构责任 | 提供面向查询、审计视角和一致性解释的只读追溯视图。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26.2`;`00-需求文档.md` FR-ML-007/008;NFR-ML-002;`01-架构设计.md` §10/§11。 |
| 派生来源 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetEvidenceLineage` ref 线索。 |
| 非 truth 边界 | 不是 trace material truth、audit trail、history 或 UI 状态;只服务读取和解释。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| trace_view_ref | MethodAssetTraceViewRef | 追溯视图稳定引用。 |
| trace_material_ref | MethodAssetTraceMaterialRef | 视图来源追溯材料。 |
| trace_subject_ref | TraceSubjectRef | 视图覆盖的追溯主体。 |
| impact_summary_refs | ConsumptionImpactSummaryRefSet | 关联影响摘要集合。 |
| visibility_marker_ref | MethodAssetTraceVisibilityMarkerRef | 表达可读、不可见或降级读取线索。 |
| projection_freshness_ref | MethodAssetTraceViewFreshnessRef | 视图相对 trace material 的新鲜度。 |

| freshness / availability 候选 | 作用 |
|---|---|
| TraceViewReadable | 当前视图可供读取。 |
| TraceViewStale | 追溯材料或影响摘要变化后视图待刷新。 |
| TraceViewPartiallyAvailable | 部分线索可读,部分 lineage 或 impact 仍待收敛。 |
| TraceViewUnavailable | 视图不可用,但不改变 trace material 或 source truth。 |

| 成员函数 | 作用 |
|---|---|
| covers_subject(TraceSubjectRef trace_subject_ref) | 判断视图是否覆盖指定追溯主体。 |
| includes_impact(ConsumptionImpactSummaryRef impact_summary_ref) | 判断视图是否包含指定影响摘要。 |
| mark_stale(MethodAssetTraceViewStalenessReasonRef reason_ref) | 标记视图过期。 |
| redact_for_visibility(MethodAssetTraceVisibilityMarkerRef visibility_marker_ref) | 按读取可见性生成安全视图。 |

| 工厂函数 | 作用 |
|---|---|
| from_trace_material(MethodAssetTraceMaterial trace_material) | 从追溯材料派生视图。 |
| unavailable(TraceSubjectRef trace_subject_ref, MethodAssetTraceViewUnavailableReasonRef reason_ref) | 建立不可用视图口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不成为 trace truth | 追溯语义以 trace material 和相关 summary/ref 为准。 |
| 不保存 audit 正文 | audit trail、history 和证据正文不得嵌入 view。 |
| 不写查询 DTO | request、response、分页、排序和 visibility protocol 留给 Step 7。 |
| 不反写材料 | view stale 或缺失不得触发核心 truth 修改。 |

## C6. `ConsumptionImpactView`

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯与一致性保护 |
| 对象类型 | projection / impact view |
| 结构责任 | 将消费影响摘要、追溯材料和消费语境组织成只读影响视图,用于解释变化影响范围。 |
| 来源回指 | Step 5 `5.16`;Step 5 `5.26.2`;`00-需求文档.md` FR-ML-008;BR-ML-011/020/021;`01-架构设计.md` §9/§10。 |
| 派生来源 | `ConsumptionImpactSummary`;`MethodAssetTraceMaterial`;`MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`。 |
| 非 truth 边界 | 不拥有下游运行状态、同步成功记录、回报协议或影响计算算法;view 只读可重建。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| impact_view_ref | ConsumptionImpactViewRef | 消费影响视图引用。 |
| impact_summary_ref | ConsumptionImpactSummaryRef | 视图来源影响摘要。 |
| trace_material_ref | OptionMethodAssetTraceMaterialRef | 关联追溯材料线索。 |
| affected_context_refs | ConsumptionContextRefSet | 受影响消费语境集合。 |
| impact_state | ConsumptionImpactViewState | 已知、未知、待承接、过期或不可用的读取状态。 |
| projection_freshness_ref | ConsumptionImpactViewFreshnessRef | 影响视图新鲜度。 |

| freshness / availability 候选 | 作用 |
|---|---|
| ImpactKnown | 影响范围可解释。 |
| ImpactUnknown | 影响范围尚不可确定,但不扫描下游 truth。 |
| ImpactPendingAcknowledgement | 等待正式回报摘要或维护收敛。 |
| ImpactViewStale | 来源摘要或追溯材料变化后视图待刷新。 |
| ImpactViewUnavailable | 视图暂不可用,不影响来源 summary。 |

| 成员函数 | 作用 |
|---|---|
| covers_context(ConsumptionContextRef consumption_context_ref) | 判断影响视图是否覆盖指定消费语境。 |
| assert_from_summary(ConsumptionImpactSummaryRef impact_summary_ref) | 校验来源影响摘要未漂移。 |
| mark_unknown(ConsumptionImpactUnknownReasonRef reason_ref) | 表达影响未知但不补写下游状态。 |
| mark_stale(ConsumptionImpactViewStalenessReasonRef reason_ref) | 标记影响视图过期。 |

| 工厂函数 | 作用 |
|---|---|
| from_impact_summary(ConsumptionImpactSummary impact_summary, MethodAssetTraceMaterialRef trace_material_ref) | 从影响摘要和追溯材料派生视图。 |
| unknown_for_change(TraceSubjectRef trace_subject_ref, ConsumptionImpactUnknownReasonRef reason_ref) | 为变化主体建立影响未知视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存下游运行 truth | process、identity、runtime、member-images 的状态正文不得进入 view。 |
| 不表达回报协议 | 下游回报格式、对账协议和同步机制留后续接口 / 流程设计。 |
| 不替代 impact summary | 影响摘要边界以 `ConsumptionImpactSummary` 为准。 |
| 不计算完整影响图 | 影响计算算法、扫描策略和恢复策略不在 Step 6 写入。 |

## C7. `MethodAssetRelationView`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | projection / relation view |
| 结构责任 | 提供方法资产定义性关系的只读读取视图,支持关系浏览、影响解释和消费语境辅助。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.26.2`;`00-需求文档.md` FR-ML-006;BR-ML-008/011/016/021;`01-架构设计.md` §6/§9。 |
| 派生来源 | `MethodAssetRelation`;`MethodAssetDefinitionRef`;`FormalMethodAssetVersionRef`;`RelationIntegrityRule` 判断线索。 |
| 非 truth 边界 | 不是 relation truth、图数据库、推荐结果或运行依赖图;view 不创建或修改关系。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| relation_view_ref | MethodAssetRelationViewRef | 关系视图稳定引用。 |
| relation_ref | MethodAssetRelationRef | 视图来源关系 truth。 |
| source_definition_ref | MethodAssetDefinitionRef | 关系源端定义锚点。 |
| target_definition_ref | MethodAssetDefinitionRef | 关系目标端定义锚点。 |
| relation_kind | MethodAssetRelationKind | 概要关系语义类别。 |
| relation_summary | MethodAssetRelationSummary | 面向读取的关系摘要。 |
| projection_freshness_ref | MethodAssetRelationViewFreshnessRef | 关系视图相对来源 truth 的新鲜度。 |

| freshness / availability 候选 | 作用 |
|---|---|
| RelationViewFresh | 视图与当前 relation truth 对齐。 |
| RelationViewStale | 关系 truth 或端点正式语境变化后待刷新。 |
| RelationViewUnavailable | 关系视图不可用,但不影响 relation truth。 |

| 成员函数 | 作用 |
|---|---|
| connects(MethodAssetDefinitionRef source_ref, MethodAssetDefinitionRef target_ref) | 判断视图是否表达指定端点关系。 |
| assert_from_relation(MethodAssetRelationRef relation_ref) | 校验来源关系 truth 未漂移。 |
| mark_stale(MethodAssetRelationViewStalenessReasonRef reason_ref) | 标记视图过期。 |
| safe_relation_summary() | 返回不含外部正文或 marketplace 状态的关系摘要。 |

| 工厂函数 | 作用 |
|---|---|
| from_relation(MethodAssetRelation relation) | 从关系 truth 派生关系视图。 |
| unavailable(MethodAssetRelationRef relation_ref, MethodAssetRelationViewUnavailableReasonRef reason_ref) | 表达指定关系视图不可用。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代关系 truth | 关系成立、废弃和替代以 `MethodAssetRelation` 为准。 |
| 不写图算法 | 图遍历、排序、推荐和查询优化不属于 Step 6。 |
| 不保存 marketplace 状态 | listing、交易、安装和履约不属于关系视图。 |
| 不反写端点 | 关系 view 不得创建或修改 definition、formal version 或 relation。 |

## C8. `DistributionReadMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | 关系与分发语义 |
| 对象类型 | read material |
| 结构责任 | 组织方法资产面向受控消费和外围发现的分发语义读取材料。 |
| 来源回指 | Step 5 `5.18`;Step 5 `5.26.2`;`00-需求文档.md` FR-ML-006;BR-ML-016/021;`01-架构设计.md` §6/§9/§10。 |
| 派生来源 | `MethodAssetRelation`;`MethodAssetDistributionRef`;`DistributionContextRef`;`DownstreamConsumptionBoundary`。 |
| 非 truth 边界 | 不是 marketplace listing、交易履约、安装状态、分发协议或下游同步事实。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| distribution_material_ref | DistributionReadMaterialRef | 分发读取材料引用。 |
| distribution_ref | MethodAssetDistributionRef | 分发语义引用,typed ref 正文留后续附录。 |
| distribution_context_ref | DistributionContextRef | 分发读取材料适用语境。 |
| relation_refs | MethodAssetRelationRefSet | 支撑分发语义的关系集合。 |
| consumption_context_refs | ConsumptionContextRefSet | 可辅助受控消费的消费语境集合。 |
| distribution_summary | MethodAssetDistributionSummary | 面向读取的分发语义摘要。 |
| source_cursor_ref | DistributionReadMaterialCursorRef | 派生来源位置和刷新依据。 |

| freshness / availability 候选 | 作用 |
|---|---|
| DistributionMaterialReady | 材料可用于受控消费和外围发现。 |
| DistributionMaterialStale | 来源关系或分发语境变化后待刷新。 |
| DistributionMaterialBlocked | 分发边界或消费边界阻止输出。 |
| DistributionMaterialUnavailable | 材料暂不可用,不影响关系 truth。 |

| 成员函数 | 作用 |
|---|---|
| covers_distribution_context(DistributionContextRef distribution_context_ref) | 判断材料是否覆盖指定分发语境。 |
| includes_relation(MethodAssetRelationRef relation_ref) | 判断材料是否包含指定关系来源。 |
| assert_consumption_boundary(DownstreamConsumptionBoundary boundary) | 校验分发读取未扩大消费授权。 |
| mark_stale(DistributionReadMaterialStalenessReasonRef reason_ref) | 标记材料过期。 |

| 工厂函数 | 作用 |
|---|---|
| from_relation_view(MethodAssetRelationView relation_view, DistributionContextRef distribution_context_ref) | 从关系视图和分发语境派生材料。 |
| blocked(DistributionContextRef distribution_context_ref, DistributionReadMaterialBlockReasonRef reason_ref) | 表达分发读取被边界阻止。 |

| 禁止事项 | 说明 |
|---|---|
| 不成为 marketplace listing | 上架、价格、订单、购买、安装和履约属于 `L6-marketplace`。 |
| 不保存下游同步状态 | 同步成功、消费方安装和运行结果不属于本对象。 |
| 不扩大消费授权 | 分发材料不能绕过 `DownstreamConsumptionBoundary`。 |
| 不写分发协议 | topic、event、payload、API 和传输机制留 Step 7/8。 |

## C9. `ExternalSourceSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | 外部摘要与引用 |
| 对象类型 | projection / summary view |
| 结构责任 | 提供外部来源安全摘要的只读视图,支撑正式化、追溯、关系和外围组织读取。 |
| 来源回指 | Step 5 `5.20`;Step 5 `5.26.2`;`00-需求文档.md` BR-ML-018/019/022;NFR-ML-005/007;`01-架构设计.md` §9/§13。 |
| 派生来源 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`。 |
| 非 truth 边界 | 不是外部来源 truth、外部正文副本、artifact/archive 包体或外部系统状态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| external_summary_view_ref | ExternalSourceSummaryViewRef | 外部摘要视图稳定引用。 |
| external_summary_ref | ExternalSourceSummaryRef | 视图来源安全摘要。 |
| external_source_ref | OptionExternalSourceRef | 外部来源引用,正文不入仓。 |
| artifact_archive_ref | OptionArtifactArchiveRef | artifact/archive 引用,包体不入仓。 |
| summary_kind | ExternalSummaryKind | 外部摘要类别。 |
| body_free_marker_ref | ExternalBodyFreeMarkerRef | 标记摘要满足正文禁止边界。 |
| projection_freshness_ref | ExternalSourceSummaryViewFreshnessRef | 摘要视图新鲜度。 |

| freshness / availability 候选 | 作用 |
|---|---|
| ExternalSummaryViewFresh | 视图与当前安全摘要对齐。 |
| ExternalSummaryViewStale | 外部摘要或引用可用性变化后待刷新。 |
| ExternalSummaryViewRejected | 来源违反正文边界,不得输出摘要视图。 |
| ExternalSummaryViewUnavailable | 视图暂不可用,不改变已接受摘要。 |

| 成员函数 | 作用 |
|---|---|
| assert_body_free() | 校验视图不携带外部正文。 |
| assert_from_summary(ExternalSourceSummaryRef external_summary_ref) | 校验来源安全摘要未漂移。 |
| mark_stale(ExternalSourceSummaryViewStalenessReasonRef reason_ref) | 标记视图过期。 |
| reject_body_violation(ExternalBodyBoundaryViolationRef violation_ref) | 因正文边界违规拒绝输出视图。 |

| 工厂函数 | 作用 |
|---|---|
| from_external_summary(ExternalSourceSummary external_summary) | 从外部安全摘要派生读取视图。 |
| rejected(ExternalSourceSummaryRef external_summary_ref, ExternalBodyBoundaryViolationRef violation_ref) | 建立正文边界违规的拒绝视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 标准全文、ADR 正文、artifact 内容、archive 包和证据文件正文不得进入 view。 |
| 不拥有外部生命周期 | 外部系统状态、治理执行、artifact 发布和 marketplace 履约不属于本对象。 |
| 不替代 summary truth | 安全摘要边界以 `ExternalSourceSummary` 为准。 |
| 不写外部解析机制 | URL、文件路径、parser、resolver、API payload 和存储机制留后续设计。 |

## 11. Trace / Relation / External View 批次:再写入

### 11.1 写入内容

- 已写入 `C4 MethodAssetTraceMaterial` 对象卡片。
- 已写入 `C5 MethodAssetTraceView` 对象卡片。
- 已写入 `C6 ConsumptionImpactView` 对象卡片。
- 已写入 `C7 MethodAssetRelationView` 对象卡片。
- 已写入 `C8 DistributionReadMaterial` 对象卡片。
- 已写入 `C9 ExternalSourceSummaryView` 对象卡片。
- 已将本附录对象索引中六个对象状态更新为 `object_written`。
- 已将本附录当前恢复点推进到 `maintenance / peripheral view 批次:先思考`。

### 11.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 maintenance / peripheral view 对象 | no |
| 写 audit / history / lineage 对象 | no |
| 写 typed ref 家族正文 | no |
| 写 projection rebuild / trace 计算 / 关系图 / 外部解析算法 | no |
| 写接口 / DTO / repository / event / DDL | no |
| 写处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 11.3 停审记录

| 检查项 | 结论 |
|---|---|
| 六个 trace / relation / external view/material 对象是否完成概要卡片 | pass |
| 是否保持 view / material 非 truth | pass |
| 是否避免 audit/history/lineage 和 typed ref 越界 | pass |
| 是否避免 marketplace / external body 越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `maintenance / peripheral view 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `maintenance / peripheral view 批次:先思考`;只思考 `MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView` 的写入边界,不得直接写对象卡片正文、job/worker、UI 状态、marketplace 交易、接口、流程、状态迁移或正式 §6。

## 12. Maintenance / Peripheral View 批次:先思考

### 12.1 问题回答

- 本批只讨论维护进度读取视图和外围 package / method set 读取视图,不进入维护 task、recovery task、package truth 或 method set truth。
- 下一写入批次应写三个对象卡片:`MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView`。
- `MaintenanceProgressView` 必须表达维护 run、刷新范围、材料 freshness、待收敛、待恢复、显式不可用等读取线索,但不能替代 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask` 或 `ConsistencyRecoveryTask`。
- `MethodPackageView` 必须从外围 `MethodPackage`、核心 definition / version / relation / distribution 引用和 marketplace context/ref 派生,但不能成为 package truth、marketplace listing、安装包或交易履约状态。
- `MethodSetAssemblyView` 必须从外围 `MethodSetAssembly`、package/member refs、composition rule 和 consumption / distribution 边界派生,但不能成为 method set truth、组织运行配置或 UI 匹配状态。
- `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MethodPackage`、`MethodSetAssembly` 属于 operations / peripheral 附录,本批只引用其作为派生来源或非 truth 边界。

### 12.2 诊断

- 本批风险集中在两个方向:一是把维护进度 view 写成维护任务 truth 或 job 执行状态;二是把外围 package / method set view 写成核心闭环前置或 marketplace 交易对象。
- Step 5 已明确 `后台维护与收敛` 是 support-operation,只维护正式读取材料、消费材料、追溯材料、外部引用有效性线索和恢复收敛,不得创建或修复核心业务 truth。
- Step 5 也已明确 `外围包与方法集组织` 是 peripheral,可以组织方法资产包和组织级方法集,但核心定义、正式化、受控消费和追溯一致性不能依赖它才成立。
- 因此三个 view 都必须保留 freshness / availability / unavailable 线索,让读取侧能解释材料是否待收敛或外围不可用,但这些线索不得反向改变来源 truth。
- L1-governance projection 附录只提供卡片深度参照:结构责任、字段骨架、新鲜度或状态候选、成员函数、工厂函数和禁止事项;本批不得复制 governance 领域语义。

### 12.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| `MaintenanceProgressView` | 下一批独立写入 | 维护 run、refresh scope 和材料收敛状态需要可读线索,但必须保持非 task truth。 |
| `MethodPackageView` | 下一批独立写入 | 外围 package 需要查询和生态发现读取材料,但不能替代 package truth 或 marketplace listing。 |
| `MethodSetAssemblyView` | 下一批独立写入 | 组织级方法集需要只读组装视图,但不能替代 method set truth、组织配置或消费边界。 |
| `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` | 移交 operations / peripheral 附录 | 这些是 operation / recovery 对象,不是 view/material。 |
| `MethodPackage`;`MethodSetAssembly` | 移交 operations / peripheral 附录 | 二者是外围 truth candidate,不是读取视图。 |
| `MaintenanceObservationMarker`;`PeripheralAvailabilityState` | 不独立成对象 | 本批只在 view 中点名线索,完整状态 owner 和迁移留 Step 9 反查。 |
| marketplace listing / transaction / installation | 排除 | 属于 `L6-marketplace` 或外部系统,本仓最多保存 ref/context,不得保存交易履约 truth。 |

### 12.4 结构化中间产物

| 下一写入对象 | 所属部分 | 必须表达 | 不得表达 |
|---|---|---|---|
| `MaintenanceProgressView` | 后台维护与收敛 | maintenance run/ref、refresh scope、材料 freshness、待收敛/待恢复/不可用线索、非 task truth 边界。 | job/worker/scheduler、retry、queue/topic、维护任务 truth、核心 truth 修复流程、telemetry truth。 |
| `MethodPackageView` | 外围包与方法集组织 | package 读取摘要、成员 definition/version/distribution refs、marketplace/context ref、外围不可用隔离。 | package truth、marketplace listing、交易/安装/履约、artifact/archive 包体、核心定义或正式版本 truth。 |
| `MethodSetAssemblyView` | 外围包与方法集组织 | method set 读取摘要、package/member refs、composition rule 结果线索、adoption context 和 freshness。 | method set truth、组织运行配置、AI policy override、UI 匹配状态、消费授权扩大。 |

### 12.5 下一写入批次边界

- 只允许进入 `maintenance / peripheral view 批次:再写入`。
- 只写 `C10 MaintenanceProgressView`、`C11 MethodPackageView`、`C12 MethodSetAssemblyView` 三个对象卡片。
- 不写 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MethodPackage`、`MethodSetAssembly` 的对象卡片;它们属于 operations / peripheral 附录。
- 不写 job、worker、scheduler、queue、topic、retry、runtime task implementation、storage、index、cache 或 telemetry schema。
- 不写 marketplace listing、定价、订单、购买、安装、结算、履约或外部 package storage。
- 不写接口、DTO、处理流、状态迁移、正式 `02-概要设计.md` §6 或 Step 7~9 内容。

### 12.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:`MaintenanceProgressView`;`MethodPackageView`;`MethodSetAssemblyView` |
| 是否保持 view / material 非 truth | pass |
| 是否避免 maintenance task / peripheral truth 越界 | pass |
| 是否避免 marketplace / UI / job 实现越界 | pass |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `maintenance / peripheral view 批次:再写入`;只写 `MaintenanceProgressView`、`MethodPackageView`、`MethodSetAssemblyView` 三个对象卡片,不得写 maintenance task、peripheral truth、job/worker、marketplace 交易、接口、流程、状态迁移或正式 §6。

## C10. `MaintenanceProgressView`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | projection / progress view |
| 结构责任 | 提供维护 run、刷新范围、派生材料收敛和恢复线索的 body-free 只读视图。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.26.3`;`00-需求文档.md` NFR-ML-004/005/006/013;`01-架构设计.md` §9/§10/§12。 |
| 派生来源 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceRunRef`;`RefreshScopeRef`;material freshness refs。 |
| 非 truth 边界 | 不是维护任务 truth、job 状态、telemetry truth、验收报告或核心业务 truth;view 过期不修复来源对象。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| progress_view_ref | MaintenanceProgressViewRef | 维护进度视图稳定引用。 |
| maintenance_run_ref | MaintenanceRunRef | 回指维护运行语境,不等同 worker 或 scheduler id。 |
| refresh_scope_ref | RefreshScopeRef | 标识本视图覆盖的刷新或恢复范围。 |
| progress_summary | MaintenanceProgressSummary | body-free 维护进度摘要,不保存任务输出正文。 |
| material_freshness_refs | MaterialFreshnessRefSet | 指向相关读取材料、追溯材料或外围材料的新鲜度线索。 |
| recovery_line_refs | ConsistencyRecoveryLineRefSet | 指向待恢复或已恢复线索,不包含恢复脚本或日志。 |
| source_cursor_ref | MaintenanceProgressCursorRef | 标记视图派生来源位置和刷新依据。 |

| freshness / availability 候选 | 作用 |
|---|---|
| MaintenanceConverged | 覆盖范围内派生材料已与来源 truth 对齐。 |
| MaintenancePending | 维护动作已登记或等待执行,读取侧可见待收敛。 |
| MaintenanceStale | 来源 truth、summary 或 ref 变化后视图待刷新。 |
| MaintenanceRecoveryNeeded | 存在可恢复的一致性或材料缺失线索。 |
| MaintenanceUnavailable | 维护视图暂不可用,但不影响核心 truth 成立。 |

| 成员函数 | 作用 |
|---|---|
| covers_scope(RefreshScopeRef refresh_scope_ref) | 判断视图是否覆盖指定刷新范围。 |
| assert_run(MaintenanceRunRef maintenance_run_ref) | 校验视图来源维护运行未漂移。 |
| mark_pending(MaintenancePendingReasonRef reason_ref) | 标记待收敛读取线索。 |
| mark_recovery_needed(ConsistencyRecoveryLineRef recovery_line_ref) | 标记需要恢复承接,但不执行恢复。 |
| safe_progress_summary() | 输出不含日志、任务正文或 telemetry body 的维护摘要。 |

| 工厂函数 | 作用 |
|---|---|
| from_maintenance_sources(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef refresh_scope_ref, MaintenanceProgressSummary progress_summary) | 从维护来源摘要派生进度视图。 |
| unavailable(RefreshScopeRef refresh_scope_ref, MaintenanceProgressUnavailableReasonRef reason_ref) | 建立维护视图不可用口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代维护任务 | task / recovery 对象由 operations / peripheral 附录承载。 |
| 不写 job 实现 | worker、scheduler、queue、topic、retry、lock 和 task runtime 不属于本对象。 |
| 不修复核心 truth | 维护视图只能暴露待收敛或待恢复,不得修改 definition、version、consumption、relation 或 summary truth。 |
| 不保存日志正文 | raw log、telemetry body、report body 和 evidence file body 不得进入视图。 |

## C11. `MethodPackageView`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | projection / peripheral view |
| 结构责任 | 提供方法资产包的只读发现和采用评估材料,支撑外围生态读取而不替代 package truth。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26.4`;`00-需求文档.md` FR-ML-E-001/002;BR-ML-E-001;`01-架构设计.md` §6/§9/§14。 |
| 派生来源 | `MethodPackage`;`MethodPackageRef`;`MethodAssetDefinitionRef`;`FormalMethodAssetVersionRef`;`DistributionContextRef`;`MarketplaceContextRef`;`PackageCompositionRule`。 |
| 非 truth 边界 | 不是 package truth、marketplace listing、交易履约、安装包、artifact 包体或核心定义 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| package_view_ref | MethodPackageViewRef | 方法资产包视图稳定引用。 |
| package_ref | MethodPackageRef | 回指外围 package 组织语义。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 包内成员定义引用集合,不复制定义正文。 |
| formal_version_refs | FormalMethodAssetVersionRefSet | 包成员可引用的正式版本线索。 |
| distribution_context_ref | OptionDistributionContextRef | 可选分发语境,不扩大受控消费授权。 |
| marketplace_context_ref | OptionMarketplaceContextRef | 可选生态发现上下文,不承载交易或履约。 |
| package_summary | MethodPackageReadSummary | body-free 包读取摘要。 |
| projection_freshness_ref | MethodPackageViewFreshnessRef | 包视图相对 package truth 和成员引用的新鲜度。 |

| freshness / availability 候选 | 作用 |
|---|---|
| PackageViewFresh | 视图与 package truth、成员引用和分发上下文对齐。 |
| PackageViewStale | package truth、成员引用或分发语境变化后待刷新。 |
| PackageViewInvalidMember | 成员引用不满足组成规则,只能暴露外围不可用或待承接。 |
| PackageViewMarketplaceContextUnavailable | 生态发现上下文不可用,但核心闭环不受影响。 |
| PackageViewUnavailable | 包视图暂不可用,不影响 package truth 或核心 truth。 |

| 成员函数 | 作用 |
|---|---|
| assert_from_package(MethodPackageRef package_ref) | 校验视图来源 package 引用未漂移。 |
| includes_definition(MethodAssetDefinitionRef definition_ref) | 判断包视图是否包含指定方法资产定义。 |
| covers_distribution_context(DistributionContextRef distribution_context_ref) | 判断视图是否覆盖指定分发语境。 |
| mark_stale(MethodPackageViewStalenessReasonRef reason_ref) | 标记 package view 待刷新。 |
| reject_marketplace_fact(MarketplaceContextRef marketplace_context_ref) | 拒绝交易、安装或履约事实进入视图。 |

| 工厂函数 | 作用 |
|---|---|
| from_package(MethodPackage method_package, PackageCompositionRule composition_rule) | 从外围 package truth 和组成规则派生读取视图。 |
| unavailable(MethodPackageRef package_ref, MethodPackageViewUnavailableReasonRef reason_ref) | 建立 package view 不可用口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 package truth | 包组织语义以 `MethodPackage` 为准,view 只读可重建。 |
| 不成为 marketplace listing | listing、定价、订单、购买、安装、结算和履约属于边界外。 |
| 不保存包体 | artifact/archive/package storage 正文不得进入视图。 |
| 不扩大消费授权 | package view 不得绕过 `DownstreamConsumptionBoundary` 或正式版本边界。 |

## C12. `MethodSetAssemblyView`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | projection / peripheral view |
| 结构责任 | 提供组织级方法集组装的只读视图,支撑采用评估和外围发现。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26.4`;`00-需求文档.md` FR-ML-E-001/003;BR-ML-E-001;`01-架构设计.md` §6/§9/§14。 |
| 派生来源 | `MethodSetAssembly`;`MethodSetAssemblyRef`;`MethodPackageRef`;`MethodAssetDefinitionRef`;`ConsumptionContextRef`;`PackageCompositionRule`。 |
| 非 truth 边界 | 不是 method set truth、组织运行配置、AI policy override、UI 匹配状态或正式消费授权。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| assembly_view_ref | MethodSetAssemblyViewRef | 方法集组装视图稳定引用。 |
| assembly_ref | MethodSetAssemblyRef | 回指组织级方法集组装语义。 |
| package_refs | MethodPackageRefSet | 方法集中参与组装的 package 引用集合。 |
| member_definition_refs | MethodAssetDefinitionRefSet | 方法集成员方法资产定义引用集合。 |
| consumption_context_refs | ConsumptionContextRefSet | 相关采用或消费语境线索,不扩大授权。 |
| composition_rule_ref | PackageCompositionRuleRef | 回指用于判断组装边界的组成规则。 |
| assembly_summary | MethodSetAssemblyReadSummary | body-free 组装读取摘要。 |
| projection_freshness_ref | MethodSetAssemblyViewFreshnessRef | 组装视图相对来源 truth 和成员引用的新鲜度。 |

| freshness / availability 候选 | 作用 |
|---|---|
| AssemblyViewFresh | 视图与 method set truth、package refs 和 composition rule 对齐。 |
| AssemblyViewStale | 组装语义、package 成员或消费语境变化后待刷新。 |
| AssemblyViewInvalidComposition | 组成规则不满足,只能暴露外围不可用或待承接。 |
| AssemblyViewPartiallyAvailable | 部分 package 或成员可读,部分外围材料仍待收敛。 |
| AssemblyViewUnavailable | 组装视图暂不可用,但核心定义和正式消费边界不受影响。 |

| 成员函数 | 作用 |
|---|---|
| assert_from_assembly(MethodSetAssemblyRef assembly_ref) | 校验视图来源组装引用未漂移。 |
| includes_package(MethodPackageRef package_ref) | 判断视图是否包含指定 package。 |
| includes_definition(MethodAssetDefinitionRef definition_ref) | 判断视图是否包含指定方法资产定义。 |
| assert_composition_rule(PackageCompositionRuleRef composition_rule_ref) | 校验视图使用的组成规则来源。 |
| mark_stale(MethodSetAssemblyViewStalenessReasonRef reason_ref) | 标记方法集视图过期。 |

| 工厂函数 | 作用 |
|---|---|
| from_assembly(MethodSetAssembly assembly, PackageCompositionRule composition_rule) | 从方法集组装 truth 和组成规则派生读取视图。 |
| unavailable(MethodSetAssemblyRef assembly_ref, MethodSetAssemblyViewUnavailableReasonRef reason_ref) | 建立方法集视图不可用口径。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 method set truth | 组装语义以 `MethodSetAssembly` 为准,view 只读可重建。 |
| 不写组织运行配置 | org runtime config、UI preset、SDK profile 和 AI policy override 不属于本对象。 |
| 不扩大消费授权 | 方法集 view 不得绕过 formal version、consumption boundary 或 relation integrity。 |
| 不成为核心前置 | 方法集视图不可用不得影响核心定义、正式化、受控消费或追溯成立。 |

## 13. Maintenance / Peripheral View 批次:再写入

### 13.1 写入内容

- 已写入 `C10 MaintenanceProgressView` 对象卡片。
- 已写入 `C11 MethodPackageView` 对象卡片。
- 已写入 `C12 MethodSetAssemblyView` 对象卡片。
- 已将本附录对象索引中三个对象状态更新为 `object_written`。
- 已将本附录当前恢复点推进到 `refs_trace_audit typed ref 批次:先思考`。

### 13.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 maintenance task / recovery task 对象 | no |
| 写 `MethodPackage` / `MethodSetAssembly` truth 对象 | no |
| 写 typed ref 正文 | no:含 `MethodSetAssemblyRef` 的正式 ref 家族留给 refs_trace_audit 批次裁决 |
| 写 job / worker / scheduler / queue / topic / retry / telemetry schema | no |
| 写 marketplace listing / transaction / installation / fulfillment | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 13.3 停审记录

| 检查项 | 结论 |
|---|---|
| 三个 maintenance / peripheral view 对象是否完成概要卡片 | pass |
| 是否保持 view / material 非 truth | pass |
| 是否避免 maintenance task / peripheral truth 越界 | pass |
| 是否避免 marketplace / UI / job 实现越界 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `refs_trace_audit typed ref 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `refs_trace_audit typed ref 批次:先思考`;只思考 typed ref / external ref 家族分组和来源边界,不得直接写 ref 对象卡片正文、trace/audit/history 对象、payload schema、接口、流程、状态迁移或正式 §6。
