# L3-method-library 02 概要 Step 6 附录 E: Operations / Peripheral 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 状态: peripheral_object_batch_completed
> 当前模式: full-restart
> Operations / peripheral 对象不得成为核心闭环前置,也不得替代核心 truth。

---

## 1. 本附录职责边界

| 项目 | 内容 |
|---|---|
| 承载对象 | maintenance task、recovery、progress、package、method set。 |
| 当前对象范围 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MethodPackage`;`MethodSetAssembly`。 |
| 本附录不承载 | job 调度、worker、queue、retry policy、runtime task implementation、marketplace 交易履约、UI / SDK 状态。 |
| 深度限制 | 只写概要对象骨架和边界;不写调度、执行、恢复脚本、topic 或实现机制。 |

## 2. 必读输入

| 文档 | 用途 |
|---|---|
| `02_hld_step_06_key_objects.md` §4 | operations / peripheral 候选池和附录索引。 |
| `02_hld_step_05_components_boundary.md` §5.25 / §5.26 | 维护支撑和外围增强边界。 |
| `00-需求文档.md` §7 / §9 / §13 / §14 | 核心闭环、外围增强、可用性和验收口径。 |
| `01-架构设计.md` §6 / §9 / §10 / §14 | 子域、数据一致性、后台承接和演进路线。 |
| L1-governance Step 6 主控和 projection / audit 附录 | 只参考 maintenance / reconciliation 边界表达方式。 |

## 3. 对象索引

| 对象 | 对象类别 | Step 5 组成部分 | 当前状态 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | operation task | 后台维护与收敛 | object_written |
| `TraceMaterialRefreshTask` | operation task | 后台维护与收敛 | object_written |
| `ConsistencyRecoveryTask` | recovery task | 后台维护与收敛 | object_written |
| `MethodPackage` | peripheral truth candidate | 外围包与方法集组织 | object_written |
| `MethodSetAssembly` | peripheral truth candidate | 外围包与方法集组织 | object_written |

## 4. 模块状态表

| 顺序 | 模块 | 状态 | 产物 | 下一动作 |
|---:|---|---|---|---|
| 1 | 附录框架:再写入 | done | 文件头、职责、索引、模板和停审。 | 等待主控推进。 |
| 2 | maintenance task 批次:先思考 | done | refresh / recovery task 边界和下一写入对象。 | 已完成;进入写入批次。 |
| 3 | maintenance task 批次:再写入 | done | maintenance 对象卡片骨架。 | 已完成;进入 peripheral organization 先思考。 |
| 4 | peripheral organization 批次:先思考 | done | package / method set 组织边界和下一写入对象。 | 已完成;进入写入批次。 |
| 5 | peripheral organization 批次:再写入 | done | peripheral 对象卡片骨架。 | 已完成;返回主控进入跨附录闭环审计。 |

## 5. 对象卡片模板

```text
## E?. `ObjectName`

| 项 | 内容 |
|---|---|
| 所属部分 | `Step 5 组成部分` |
| 对象类型 | operation task / recovery task / peripheral aggregate |
| 结构责任 | ... |
| 来源回指 | ... |
| 非核心前置边界 | ... |

| 字段 | 类型 | 作用 |
|---|---|---|

| 状态候选 | 作用 |
|---|---|

| 成员函数 | 作用 |
|---|---|

| 工厂函数 | 作用 |
|---|---|

| 禁止事项 | 说明 |
|---|---|
```

## 6. 本附录禁止事项

- 不写 job、worker、queue、topic、retry、scheduler、cron、lock 或 storage details。
- 不让维护任务创建、修改或修复 core truth。
- 不把 `MethodPackage` / `MethodSetAssembly` 写成核心定义、正式版本、受控消费或追溯成立前置。
- 不写 marketplace listing、交易、购买、安装、结算或履约对象。

## 7. 停审记录

| 检查项 | 结论 |
|---|---|
| 是否只创建框架 | pass |
| 是否写对象卡片正文 | no |
| 是否回填正式 §6 | no |
| 下一动作 | 等待主控按顺序进入 `peripheral organization 批次:先思考`。 |

## 8. Maintenance Task 批次:先思考

### 8.1 问题回答

- 本批只讨论后台维护与收敛中的 task / recovery 对象边界和下一写入分组,不写对象卡片正文。
- 下一写入批次只写三个对象:`ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`。
- 这三个对象必须保持 operation/support 性质,不得成为业务 truth、状态 owner、job 调度实现或 worker 运行记录。
- `ReadMaterialRefreshTask` 只负责正式读取材料、目录材料、消费材料、关系/分发读取材料的刷新语义,不得修改 `MethodAssetDefinition`、`FormalMethodAssetVersion`、`MethodAssetRelation` 等 truth。
- `TraceMaterialRefreshTask` 只负责追溯材料、证据 lineage、影响摘要读取材料的刷新语义,不得保存证据正文、raw audit log、report body 或 artifact/archive 包体。
- `ConsistencyRecoveryTask` 只负责材料缺失、引用失效、传播滞后、摘要不一致等可恢复线索的收敛,不得自动重做正式化、修复 core truth、复制外部正文或绕过消费边界。

### 8.2 诊断

- 后台维护对象最大的风险是被写成实现层 job。Step 6 只能表达 task / recovery 的领域边界、输入 refs、scope 和状态候选,不能落 scheduler、queue、topic、worker、retry、lock、storage 或 telemetry schema。
- 维护任务不能修复业务 truth。正式定义、正式版本、关系、外部摘要和外围组织的 truth 必须由各自对象和正式流程改变;维护任务只能推动派生材料、progress view、history 和 recovery 线索收敛。
- 读取材料刷新和追溯材料刷新需要拆开。前者服务 catalog/consumption/relation/distribution 等读取材料;后者服务 trace/audit/history/evidence/impact 等追溯材料,两者来源和禁止正文不同。
- 恢复任务不是补偿事务。它只能标记、挂起、重试承接或要求人工 / 正式流程介入,不能用私有规则生成缺失 schema、创建外部 ref、改写正式状态或假设下游运行事实。
- `MaintenanceProgressView` 已在 views/materials 附录写完,`MaintenanceRunRef`、`RefreshScopeRef` 和 `MaintenanceRunHistory` 已在 refs/trace/audit 附录写完;本批只引用这些对象,不重复写 view/ref/history。

### 8.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| `ReadMaterialRefreshTask` | 下一批写入 | 需要表达正式读取材料和消费材料的后台收敛语义,但必须避免成为 cache/index/job 实现。 |
| `TraceMaterialRefreshTask` | 下一批写入 | 需要表达追溯材料、证据 lineage 和影响摘要材料刷新语义,但必须保持 body-free。 |
| `ConsistencyRecoveryTask` | 下一批写入 | 需要表达引用、摘要、传播或派生材料异常后的恢复收敛语义,但不得自动修复 truth。 |
| `MaintenanceProgressView` | 不写入本批 | 已在 views/materials 附录完成,本批只可引用。 |
| `MaintenanceRunRef`;`RefreshScopeRef` | 不写入本批 | 已在 refs_trace_audit typed ref 批次完成,本批只可引用。 |
| `MaintenanceRunHistory` | 不写入本批 | 已在 refs_trace_audit history 批次完成,本批只可引用。 |
| job / worker / scheduler / queue / retry / lock | 排除 | 属于实现设计或运行承载,不属于 Step 6 概要对象。 |

### 8.4 结构化中间产物

| 下一写入对象 | 必须表达 | 不得表达 |
|---|---|---|
| `ReadMaterialRefreshTask` | refresh scope、maintenance run、来源 truth refs、目标 read materials、待收敛 / 已收敛 / 不可用状态候选。 | cache/index/store、job id、worker、queue、topic、调度、重试、DB 表。 |
| `TraceMaterialRefreshTask` | trace subject、evidence lineage、impact summary、audit/history material 刷新语义。 | raw log、telemetry、report body、证据正文、artifact 包体、证据 JSON。 |
| `ConsistencyRecoveryTask` | recovery scope、异常来源、恢复动作语义、人工 / 正式流程介入线索。 | 自动修复 core truth、重做正式化、绕过消费边界、复制外部正文、扫描下游运行 truth。 |

### 8.5 下一写入批次边界

- 只允许进入 `maintenance task 批次:再写入`。
- 只写 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 三个对象卡片。
- 对象卡片只包含基本信息、字段骨架、状态候选、成员函数、工厂函数和禁止事项。
- 不写 job/worker/scheduler/queue/topic/retry/lock/storage/cache/index/telemetry 实现。
- 不写接口、DTO、event/outbox payload、处理流、状态迁移矩阵、恢复脚本或正式 `02-概要设计.md` §6。

### 8.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:3 个 maintenance task / recovery 对象 |
| 是否把 job/worker 实现混入本批 | no |
| 是否避免维护任务反写 core truth | pass |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `operations_peripheral maintenance task 批次:再写入`;只写 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 三个对象卡片,不得写 job/worker、接口、流程、状态迁移或正式 §6。

## E1. `ReadMaterialRefreshTask`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | operation task / read material refresh |
| 结构责任 | 表达正式读取材料、目录材料、消费材料、关系/分发读取材料的后台刷新和收敛语义。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.26`;`00-需求文档.md` FR-ML-005/006;NFR-ML-004~006/013/015/016;`01-架构设计.md` §9/§10/§11。 |
| 非核心前置边界 | 只推动派生读取材料收敛;不创建、修改或修复 `MethodAssetDefinition`、`FormalMethodAssetVersion`、`MethodAssetRelation` 或外部摘要 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| read_refresh_task_ref | ReadMaterialRefreshTaskRef | 读取材料刷新任务稳定引用。 |
| maintenance_run_ref | MaintenanceRunRef | 回指维护运行语境。 |
| refresh_scope_ref | RefreshScopeRef | 限定刷新范围。 |
| source_truth_refs | MethodAssetTruthRefSet | 指向派生读取材料所依据的正式 truth refs。 |
| target_material_refs | ReadMaterialRefSet | 标识待刷新或待验证的读取材料。 |
| progress_view_ref | Option<MaintenanceProgressViewRef> | 可选维护进度读取视图。 |

| 状态候选 | 作用 |
|---|---|
| RefreshPending | 刷新任务已形成,尚未完成读取材料收敛。 |
| RefreshInProgress | 刷新任务正在推进,但不代表 truth 已变化。 |
| RefreshConverged | 读取材料已与来源 truth 对齐。 |
| RefreshStale | 来源 truth 或范围变化后,读取材料需要再次刷新。 |
| RefreshUnavailable | 当前刷新不可用,读取侧需显式暴露不可用或旧材料口径。 |

| 成员函数 | 作用 |
|---|---|
| covers_scope(RefreshScopeRef refresh_scope_ref) | 判断任务是否覆盖指定刷新范围。 |
| targets_material(ReadMaterialRef material_ref) | 判断任务是否覆盖指定读取材料。 |
| mark_stale(ReadMaterialStalenessReasonRef reason_ref) | 标记读取材料待刷新。 |
| assert_not_truth_repair() | 校验任务不尝试修复 core truth。 |

| 工厂函数 | 作用 |
|---|---|
| from_refresh_scope(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef refresh_scope_ref) | 从维护运行和刷新范围建立读取材料刷新任务。 |
| from_stale_material(ReadMaterialRef material_ref, RefreshScopeRef refresh_scope_ref) | 从过期读取材料建立刷新任务。 |

| 禁止事项 | 说明 |
|---|---|
| 不写实现机制 | cache、index、store、job id、worker、queue、topic、scheduler、retry、lock 和 DB 表不属于本对象。 |
| 不反写 truth | 任务只能刷新派生材料,不能创建、修改、删除或修复正式 truth。 |
| 不替代进度视图 | 可见状态由 `MaintenanceProgressView` 承接,本对象只表达任务语义。 |

## E2. `TraceMaterialRefreshTask`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | operation task / trace material refresh |
| 结构责任 | 表达追溯材料、审计线索、证据 lineage、影响摘要和历史材料的后台刷新与收敛语义。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.16`;Step 5 `5.26`;`00-需求文档.md` FR-ML-007/008/009;BR-ML-020~022;NFR-ML-009~011/013/015/016;`01-架构设计.md` §9/§10/§13。 |
| 非核心前置边界 | 只推动追溯材料和审计可读线索收敛;不保存 raw log、证据正文、report body、artifact/archive 包体或外部正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| trace_refresh_task_ref | TraceMaterialRefreshTaskRef | 追溯材料刷新任务稳定引用。 |
| maintenance_run_ref | MaintenanceRunRef | 回指维护运行语境。 |
| refresh_scope_ref | RefreshScopeRef | 限定刷新范围。 |
| trace_subject_refs | TraceSubjectRefSet | 指向需要刷新追溯材料的主体集合。 |
| audit_trail_refs | MethodAssetAuditTrailRefSet | 可选审计轨迹 refs。 |
| evidence_lineage_refs | MethodAssetEvidenceLineageRefSet | 可选证据 lineage refs。 |
| impact_source_refs | ConsumptionImpactSourceRefSet | 可选消费影响来源 refs。 |

| 状态候选 | 作用 |
|---|---|
| TraceRefreshPending | 追溯材料刷新任务已形成。 |
| TraceRefreshInProgress | 追溯材料正在刷新或重建。 |
| TraceRefreshConverged | 追溯材料与当前安全来源线索对齐。 |
| TraceRefreshPartial | 只有部分追溯主体或 lineage 完成刷新。 |
| TraceRefreshUnavailable | 追溯材料暂不可用,不得用 raw log 或证据正文补齐。 |

| 成员函数 | 作用 |
|---|---|
| covers_subject(TraceSubjectRef trace_subject_ref) | 判断任务是否覆盖指定追溯主体。 |
| includes_evidence_lineage(MethodAssetEvidenceLineageRef lineage_ref) | 判断任务是否覆盖指定证据 lineage。 |
| mark_partial(TraceMaterialPartialReasonRef reason_ref) | 标记部分刷新状态。 |
| assert_body_free() | 校验任务不携带 raw log、report body 或证据正文。 |

| 工厂函数 | 作用 |
|---|---|
| from_trace_subjects(MaintenanceRunRef maintenance_run_ref, TraceSubjectRefSet trace_subject_refs) | 从追溯主体集合建立刷新任务。 |
| from_evidence_lineage(MethodAssetEvidenceLineageRef lineage_ref, RefreshScopeRef refresh_scope_ref) | 从证据 lineage 建立追溯刷新任务。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw log | 日志、trace span、telemetry、metric 和 event payload 不属于本对象。 |
| 不保存证据正文 | 证据文件、报告正文、artifact 正文和 archive 包体不得进入。 |
| 不写刷新算法 | trace 计算、lineage 重建、影响传播和 report 生成算法留给后续设计。 |

## E3. `ConsistencyRecoveryTask`

| 项 | 内容 |
|---|---|
| 所属部分 | 后台维护与收敛 |
| 对象类型 | recovery task / consistency convergence |
| 结构责任 | 承接读取材料缺失、追溯材料缺失、外部引用失效、传播滞后、摘要不一致或外围不可用等可恢复异常的收敛语义。 |
| 来源回指 | Step 5 `5.22`;Step 5 `5.26`;`00-需求文档.md` FR-ML-008;NFR-ML-004~006/013~016;`01-架构设计.md` §9/§10/§13。 |
| 非核心前置边界 | 只能推动恢复收敛、挂起、显式不可用或正式流程介入;不得自动修复 core truth、重做正式化、绕过消费边界或复制外部正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| recovery_task_ref | ConsistencyRecoveryTaskRef | 一致性恢复任务稳定引用。 |
| maintenance_run_ref | MaintenanceRunRef | 回指维护运行语境。 |
| recovery_scope_ref | RefreshScopeRef | 限定恢复影响范围。 |
| recovery_reason_ref | ConsistencyRecoveryReasonRef | 标识恢复触发原因。 |
| affected_subject_refs | TraceSubjectRefSet | 可选受影响主体集合。 |
| related_material_refs | ReadMaterialRefSet | 可选关联读取 / 追溯材料 refs。 |
| escalation_ref | Option<FormalInterventionRef> | 可选正式流程或人工介入线索。 |

| 状态候选 | 作用 |
|---|---|
| RecoveryNeeded | 发现可恢复异常,需要收敛动作。 |
| RecoveryInProgress | 正在推进恢复或正式介入。 |
| RecoveryConverged | 异常已按边界收敛。 |
| RecoverySuspended | 恢复被挂起,等待外部依据、下游摘要或正式裁决。 |
| RecoveryRejected | 异常不可由维护任务恢复,必须保持显式失败或交给正式流程。 |

| 成员函数 | 作用 |
|---|---|
| covers_scope(RefreshScopeRef recovery_scope_ref) | 判断恢复任务是否覆盖指定范围。 |
| concerns_subject(TraceSubjectRef trace_subject_ref) | 判断恢复是否影响指定主体。 |
| require_formal_intervention(FormalInterventionRef escalation_ref) | 标记需要正式流程或人工介入。 |
| assert_recovery_boundary() | 校验恢复不越过 truth、外部正文和消费边界。 |

| 工厂函数 | 作用 |
|---|---|
| from_recovery_reason(RefreshScopeRef recovery_scope_ref, ConsistencyRecoveryReasonRef recovery_reason_ref) | 从恢复范围和原因建立恢复任务。 |
| from_failed_refresh(MaintenanceRunRef maintenance_run_ref, RefreshScopeRef recovery_scope_ref) | 从失败的维护运行建立恢复任务。 |

| 禁止事项 | 说明 |
|---|---|
| 不自动修复 truth | 不能创建、修改或删除 definition、formal version、relation、external summary 或 package truth。 |
| 不重做正式化 | 正式化、版本替代、撤回或批准必须由正式流程完成。 |
| 不复制外部正文 | 引用失效或摘要缺失时,不得复制标准、artifact、证据、marketplace 或下游正文补齐。 |
| 不扫描下游运行 truth | process、identity、runtime、member-images、UI 或 SDK 内部状态不得成为恢复输入。 |

## 9. Maintenance Task 批次:再写入

### 9.1 写入内容

- 已写入 `E1 ReadMaterialRefreshTask` 对象卡片。
- 已写入 `E2 TraceMaterialRefreshTask` 对象卡片。
- 已写入 `E3 ConsistencyRecoveryTask` 对象卡片。
- 已确认 maintenance task / recovery 对象只表达 operation/support 语义,不成为 business truth、job 实现或状态迁移矩阵。
- 已将本附录对象索引中三个 maintenance task / recovery 对象状态更新为 `object_written`。
- 已将本附录当前恢复点推进到 `peripheral organization 批次:先思考`。

### 9.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 job / worker / scheduler / queue / topic / retry / lock / storage | no |
| 写 cache / index / DB table / projection rebuild algorithm | no |
| 写 event payload / outbox schema / report schema / telemetry schema | no |
| 写接口 / DTO / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 9.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成三个 maintenance task / recovery 对象卡片 | pass |
| 是否保持 operation/support 而非业务 truth | pass |
| 是否避免 job/worker 和恢复脚本越界 | pass |
| 是否避免自动修复 truth 或复制外部正文 | pass |
| 是否允许进入下一模块 | pass:下一模块为 `peripheral organization 批次:先思考` |

next_allowed_action: 等待用户确认后进入 `operations_peripheral peripheral organization 批次:先思考`;只思考 `MethodPackage`、`MethodSetAssembly` 写入边界,不得直接写对象卡片正文、marketplace 交易、安装履约、接口、流程、状态迁移或正式 §6。

## 10. Peripheral Organization 批次:先思考

### 10.1 问题回答

- 本批只讨论外围包与方法集组织的对象写入边界,不写对象卡片正文。
- 下一写入批次只写两个对象:`MethodPackage`、`MethodSetAssembly`。
- `MethodPackage` 表达围绕已成立方法资产定义、正式版本、关系和分发语义形成的外围包组织语义。
- `MethodSetAssembly` 表达组织级方法集组装语义,用于组织采用、复用或发现一组方法资产。
- 二者都是 peripheral truth candidate,不是核心定义、正式版本、受控消费、追溯或关系 truth 的前置。
- 二者可以引用已闭合的 core refs、formal version refs、relation / distribution refs、package / method set refs 和 marketplace context refs。
- 二者不得表示 marketplace listing、定价、订单、购买、订阅、结算、安装、履约、退款、package binary、archive body、组织运行配置、UI 匹配状态或 AI policy override 实现。

### 10.2 诊断

- 外围组织对象最大的风险是被写成第二套方法资产定义。对象卡片必须明确其成员只引用已成立或允许引用的方法资产,不能复制 definition body、formal version body 或 consumption material body。
- `MethodPackage` 容易滑向 marketplace 商品、安装包或 artifact/archive 包体。本仓只拥有外围组织语义和 safe ref/context,交易、安装、履约和包体生命周期必须留在边界外。
- `MethodSetAssembly` 容易滑向组织运行配置、console UI 匹配状态或 AI policy override。Step 6 只能表达组织级方法集的组装 truth candidate,不表达运行期配置执行、UI 体验和策略 override 算法。
- `PackageCompositionRule` 已在 policies/guards 附录完成,本批对象只引用组合边界,不重复创建 rule 对象。
- `MethodPackageView`、`MethodSetAssemblyView` 已在 views/materials 附录完成,本批对象只表达 truth candidate,不写读取模型第二 truth。
- `MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef` 和 `PackageAssemblyHistory` 已在 refs/trace/audit 附录完成,本批只引用这些 ref/history,不重复写 typed ref 或 history 卡片。

### 10.3 取舍

| 候选 | 本批裁决 | 理由 |
|---|---|---|
| `MethodPackage` | 下一批写入 | Step 5 明确要求承载方法资产包组织语义,但必须标注外围增强和非核心前置。 |
| `MethodSetAssembly` | 下一批写入 | Step 5 明确要求承载组织级方法集组装语义,但不得覆盖正式版本、消费边界或关系 truth。 |
| `PackageCompositionRule` | 不写入本批 | 已在 policies/guards 附录完成,本批只引用其边界。 |
| `MethodSetAssemblyRule` | 并入 `MethodSetAssembly` 禁止事项 / invariant | 当前不单独成对象,避免重复 policy;组装边界在对象卡和后续 Step 8 guard 中承接。 |
| `MethodPackageView`;`MethodSetAssemblyView` | 不写入本批 | 已在 views/materials 附录完成,不得写成第二 truth。 |
| `MethodPackageRef`;`MethodSetAssemblyRef`;`MarketplaceContextRef` | 不写入本批 | 已在 refs_trace_audit typed ref 批次完成,本批只引用。 |
| marketplace listing / order / install / fulfillment | 排除 | 属于 `L6-marketplace` 或外部生态边界,不得进入本仓对象卡片。 |

### 10.4 结构化中间产物

| 下一写入对象 | 必须表达 | 不得表达 |
|---|---|---|
| `MethodPackage` | package stable ref、成员 asset refs、formal version / relation / distribution refs、composition rule ref、marketplace context ref、外围可用状态候选。 | marketplace listing、商品、价格、订单、购买、订阅、结算、安装、履约、package binary、archive body、artifact body。 |
| `MethodSetAssembly` | assembly stable ref、organization / adoption context ref、package refs、method asset refs、version / consumption boundary refs、组装有效性和外围不可用状态候选。 | 组织运行配置、console UI 状态、SDK 本地状态、AI policy override 实现、运行期 capability binding、下游采用成功事实。 |

### 10.5 下一写入批次边界

- 只允许进入 `peripheral organization 批次:再写入`。
- 只写 `MethodPackage`、`MethodSetAssembly` 两个对象卡片。
- 对象卡片只包含基本信息、字段骨架、状态候选、成员函数、工厂函数和禁止事项。
- 字段必须使用 typed refs / ref set / summary refs,不得使用 marketplace id、listing id、package file path、URL、route param 或 free-form string 替代稳定引用。
- 不写 marketplace 交易、安装履约、包体格式、artifact/archive 生命周期、组织运行配置、UI 匹配、AI policy override 实现、接口、DTO、处理流、状态迁移矩阵或正式 `02-概要设计.md` §6。

### 10.6 自检

| 检查项 | 结论 |
|---|---|
| 是否写对象卡片正文 | no |
| 是否裁决下一写入对象 | pass:2 个 peripheral organization 对象 |
| 是否把外围组织写成核心闭环前置 | no |
| 是否避免 marketplace / 安装履约 / 包体越界 | pass |
| 是否避免重复写已完成的 rule / view / ref / history | pass |
| 是否回填正式 §6 | no |

next_allowed_action: 等待用户确认后进入 `operations_peripheral peripheral organization 批次:再写入`;只写 `MethodPackage`、`MethodSetAssembly` 两个对象卡片,不得写 marketplace 交易、安装履约、包体、组织运行配置、接口、流程、状态迁移或正式 §6。

## E4. `MethodPackage`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | peripheral aggregate / package organization truth candidate |
| 结构责任 | 表达围绕已成立或允许引用的方法资产定义、正式版本、关系和分发语义形成的外围方法资产包组织语义。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26`;`00-需求文档.md` FR-ML-E-001/002;BR-ML-016;BR-ML-E-001;NFR-ML-004/005/007;`01-架构设计.md` §6/§9/§10/§14。 |
| 非核心前置边界 | 不作为核心定义、正式化、受控消费或追溯一致性成立前置;不成为 marketplace listing、安装包正文、artifact/archive 包体或交易履约 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| method_package_ref | MethodPackageRef | 方法资产包稳定引用。 |
| package_member_refs | MethodAssetDefinitionRefSet | 包内成员方法资产定义引用集合。 |
| formal_version_refs | FormalMethodAssetVersionRefSet | 可选成员正式版本引用集合。 |
| distribution_context_refs | DistributionContextRefSet | 支撑外围发现或分发语义的上下文引用。 |
| composition_rule_ref | PackageCompositionRuleRef | 回指包组成边界规则。 |
| marketplace_context_ref | Option<MarketplaceContextRef> | 可选生态发现上下文,不代表交易或上架事实。 |
| package_history_ref | Option<PackageAssemblyHistoryRef> | 可选外围组织变化历史引用。 |

| 状态候选 | 作用 |
|---|---|
| PackageDraft | 外围包组织语义正在形成,不得影响核心闭环。 |
| PackageReady | 包成员引用与组合边界已满足外围可用条件。 |
| PackageDeprecated | 包组织语义不再推荐使用,但不改写成员方法资产 truth。 |
| PackageUnavailable | 外围包不可用或生态上下文不可用,核心定义和正式版本仍成立。 |

| 成员函数 | 作用 |
|---|---|
| contains_member(MethodAssetDefinitionRef definition_ref) | 判断包是否包含指定方法资产定义引用。 |
| uses_distribution_context(DistributionContextRef context_ref) | 判断包是否使用指定分发上下文。 |
| assert_composition_boundary(PackageCompositionRuleRef rule_ref) | 校验包成员不越过组合边界。 |
| assert_not_marketplace_truth() | 校验对象不承载 marketplace 交易、安装或履约事实。 |

| 工厂函数 | 作用 |
|---|---|
| from_members(MethodPackageRef method_package_ref, MethodAssetDefinitionRefSet package_member_refs) | 从稳定包引用和成员方法资产 refs 建立外围包组织语义。 |
| from_distribution_context(MethodPackageRef method_package_ref, DistributionContextRefSet distribution_context_refs) | 从分发上下文建立外围包组织语义。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代核心 truth | 不创建、复制、覆盖或修复 `MethodAssetDefinition`、`FormalMethodAssetVersion`、`MethodAssetRelation` 或消费材料 truth。 |
| 不保存包体 | package binary、archive body、artifact body、外部 package storage 内容和安装包正文不得进入。 |
| 不承担 marketplace 交易 | listing、定价、订单、购买、订阅、结算、安装、履约、退款和商业授权事实属于边界外。 |
| 不写实现细节 | 包格式、导出机制、repository、DB 表、event payload、adapter 和同步协议留给后续设计或边界外系统。 |

## E5. `MethodSetAssembly`

| 项 | 内容 |
|---|---|
| 所属部分 | 外围包与方法集组织 |
| 对象类型 | peripheral aggregate / method set assembly truth candidate |
| 结构责任 | 表达组织级方法集组装语义,用于组织采用、复用或发现一组方法资产或方法资产包。 |
| 来源回指 | Step 5 `5.24`;Step 5 `5.26`;`00-需求文档.md` FR-ML-E-001/003;BR-ML-E-001;NFR-ML-004/005/007;`01-架构设计.md` §6/§9/§10/§14。 |
| 非核心前置边界 | 不作为核心闭环前置;不覆盖正式版本、消费边界、关系 truth、组织运行配置、UI 匹配状态或 AI policy override 实现。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| method_set_assembly_ref | MethodSetAssemblyRef | 组织级方法集组装稳定引用。 |
| adoption_context_ref | ConsumptionContextRef | 表达方法集采用或复用语境,不等同于下游采用成功事实。 |
| package_refs | MethodPackageRefSet | 可选被组装的方法资产包引用集合。 |
| method_asset_refs | MethodAssetDefinitionRefSet | 可选直接组装的方法资产定义引用集合。 |
| formal_version_refs | FormalMethodAssetVersionRefSet | 可选成员正式版本引用集合。 |
| consumption_boundary_ref | DownstreamConsumptionBoundaryRef | 回指受控消费边界,避免方法集绕过正式消费材料。 |
| assembly_history_ref | Option<PackageAssemblyHistoryRef> | 可选组装变化历史引用。 |

| 状态候选 | 作用 |
|---|---|
| AssemblyDraft | 方法集组装语义正在形成,不影响核心闭环。 |
| AssemblyReady | 组装引用和边界满足外围可用条件。 |
| AssemblyStale | 依赖的包、方法资产或消费边界变化后需要复核。 |
| AssemblyUnavailable | 外围方法集不可用,核心定义、正式化和受控消费仍独立成立。 |

| 成员函数 | 作用 |
|---|---|
| includes_package(MethodPackageRef method_package_ref) | 判断方法集是否包含指定方法资产包。 |
| includes_asset(MethodAssetDefinitionRef definition_ref) | 判断方法集是否直接包含指定方法资产。 |
| assert_consumption_boundary(DownstreamConsumptionBoundaryRef boundary_ref) | 校验组装未绕过受控消费边界。 |
| mark_stale(MethodSetAssemblyStalenessReasonRef reason_ref) | 标记方法集需要外围复核。 |

| 工厂函数 | 作用 |
|---|---|
| from_packages(MethodSetAssemblyRef method_set_assembly_ref, MethodPackageRefSet package_refs, ConsumptionContextRef adoption_context_ref) | 从方法资产包集合和采用语境建立方法集组装语义。 |
| from_assets(MethodSetAssemblyRef method_set_assembly_ref, MethodAssetDefinitionRefSet method_asset_refs, ConsumptionContextRef adoption_context_ref) | 从方法资产 refs 和采用语境建立方法集组装语义。 |

| 禁止事项 | 说明 |
|---|---|
| 不成为组织运行配置 | 不保存组织运行参数、console / SDK 本地状态、UI 匹配结果或下游采用成功事实。 |
| 不实现策略 override | AI policy override、高级 ViewProfile 匹配和组织级策略变体实现不属于本对象。 |
| 不绕过受控消费 | 方法集不能替代 `MethodAssetConsumptionMaterial`、`DownstreamConsumptionBoundary` 或正式消费材料。 |
| 不承担 marketplace 履约 | marketplace 交易、安装、授权和履约仍在边界外。 |

## 11. Peripheral Organization 批次:再写入

### 11.1 写入内容

- 已写入 `E4 MethodPackage` 对象卡片。
- 已写入 `E5 MethodSetAssembly` 对象卡片。
- 已确认二者只表达外围组织 truth candidate,不成为核心定义、正式版本、受控消费、追溯或关系 truth 的前置。
- 已确认二者只引用已成立或允许引用的 typed refs / context refs,不得使用 marketplace id、listing id、package file path、URL、route param 或 free-form string 替代稳定引用。
- 已将本附录对象索引中两个 peripheral organization 对象状态更新为 `object_written`。
- 已将本附录当前恢复点推进到返回主控执行 `跨附录闭环审计:先思考`。

### 11.2 本批未做事项

| 项目 | 结论 |
|---|---|
| 写 marketplace listing / 定价 / 订单 / 购买 / 结算 / 安装 / 履约 | no |
| 写 package binary / archive body / artifact body / 外部 package storage 内容 | no |
| 写组织运行配置 / UI 匹配状态 / SDK 本地状态 / AI policy override 实现 | no |
| 写接口 / DTO / event payload / 处理流 / 状态迁移矩阵 | no |
| 回填正式 `02-概要设计.md` §6 | no |

### 11.3 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成两个 peripheral organization 对象卡片 | pass |
| 是否保持外围增强而非核心前置 | pass |
| 是否避免 marketplace / 安装履约 / 包体越界 | pass |
| 是否避免重复写 rule / view / ref / history | pass |
| 是否允许返回主控进入跨附录闭环审计 | pass |

next_allowed_action: 返回主控,等待用户确认后进入 Step 6 `跨附录闭环审计:先思考`;不得直接回填正式 §6,不得进入 Step 7/8/9。
