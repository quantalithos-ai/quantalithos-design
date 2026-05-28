# Step 11. 定义持久化、事务与一致性契约

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 11 中间产物。
> 本步只收稳数据所有权、存储对象、repository 函数、事务边界、一致性策略和恢复口径。
> 本步不写数据库迁移脚本,不强制选择具体数据库,不实现 `L0-bus` runtime,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
- 回填章节: `projects/L0-core/03-详细设计.md` §10 数据持久化、事务与一致性契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` §9 | 数据所有权与一致性策略 | 作为 truth / snapshot / projection / reference 的归属边界 |
| Step 4 文件布局 | `contract-source/`、`release-snapshots/`、`l0_core_infra` 下 source / snapshot / projection / audit / outbox / unit_of_work adapter | 作为存储对象和 adapter 落点 |
| Step 6 对象实现契约 | 聚合、快照、引用、事实、projection、状态对象 | 作为持久化对象全集 |
| Step 7 Trait / Port 契约 | `UnitOfWork`、repository、audit、outbox、projection 等 port | 作为 repository 函数和事务边界来源 |
| Step 9 函数级处理流 | Command / Query / Event / Job 的事务边界 | 作为事务场景来源 |
| Step 10 状态机 | 状态转换和非法转换规则 | 作为保存前后状态一致性约束 |

已确认结论:

```text
项目尚未进入开发,本步不写迁移脚本。
P0 可以先采用文件型 adapter,但实现必须保留 repository / unit of work / outbox / projection 抽象。
真相、审计和 outbox 的写入必须在同一事务边界内成立。
快照、projection、下游消费刷新和 outbox relay 可以最终一致,但失败必须显式保留。
```

---

## 3. 本步写作策略

本步按“实现契约优先,存储技术后置”展开:

```text
先定数据归属 -> 再定存储对象 -> 再定 repository 函数 -> 再定事务边界 -> 最后定一致性和恢复
```

写作约束:

- 不把“文件目录”“数据库表”“内存对象”混为一谈;本步统一称为“存储对象”。
- 存储对象可以被文件、数据库或后续 KV 实现承载,但主键、唯一键、版本字段和一致性规则必须固定。
- repository 函数必须写参数类型、返回类型、锁 / 事务要求和错误类型。
- 写路径必须说明 `UnitOfWork.transact(...)` 内必须完成哪些写入。
- outbox 和 projection 不能只点名,必须说明同事务、异步补偿和失败恢复方式。
- 如果发现 Step 7 port 缺少必要持久化函数,必须显式列为 Step 7 回补项,不能在实现时临时发明。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 11.1 | [x] | 数据所有权实现表 |
| 11.2 | [x] | 存储对象契约表 |
| 11.3 | [x] | Repository / Port 函数契约表 |
| 11.4 | [x] | 事务边界表 |
| 11.5 | [x] | 一致性策略表 |
| 11.6 | [x] | 失败恢复与补偿口径 |
| 11.7 | [x] | Step 11 统一复核 |

---

## 5. SOP 问题回答

### 5.1 哪些数据对象由本仓拥有？

本仓拥有契约真相、发布基线、发布快照元数据、事实记录、审计、outbox 记录、引用关系和查询投影;不拥有外部标准正文、ADR 正文、下游实现正文、运行事件实例正文或工具链完整报告正文。

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `ContractDefinition` | `domain_definition` | `ContractChangeService`、`ContractReleaseService` | command / query / job | 强一致 |
| `ContractReleaseBaseline` | `domain_release` | `ContractReleaseService` | release / snapshot / query / job | 发布边界强一致 |
| `ContractReleaseSnapshot` 元数据 | `domain_release` / `domain_reference_projection` | `ContractSnapshotService` | snapshot query / trace / downstream | 与快照资产最终一致,元数据写入需事务保护 |
| `ContractFactRecord` | `domain_fact` | `ContractFactService` | outbox relay / trace / recovery | 与 outbox 写入同事务或可恢复补偿 |
| `AuditRecord` | `application_ports` / `infra_adapters` | 所有写路径 service | trace / audit query | 与关键 truth 写入同事务 |
| `FactOutboxEvent` | `application_ports` / `infra_adapters` | command / job / fact service | `OutboxRelayWorker` | 与来源事实同事务写入,发布最终一致 |
| `ExternalReference` / `EventCatalogReference` | `domain_reference_projection` | reference operations / services | query / release policy | 引用有效性一致 |
| `StandardMappingIndex` | `domain_reference_projection` | operations / reference service | query / validation | projection 最终一致 |
| `CompatibilityTraceIndex` | `domain_reference_projection` | `ContractCompatibilityService` / rebuild job | query / release | 校验结果写入一致,读面可 stale |
| `ContractReadModel` / `ContractTraceProjection` | `domain_reference_projection` | rebuild job / projection service | query | 最终一致,stale 显式暴露 |
| `DownstreamConsumptionRef` | `domain_reference_projection` | snapshot / operations service | downstream query / trace | 最终一致,不得表示下游强事务成功 |

### 5.2 哪些只是引用、快照或投影？

| 类别 | 对象 | 说明 |
|---|---|---|
| 引用 | `ExternalReference`、`EventCatalogReference`、`StandardRef`、`ApprovedGateRef`、`SnapshotBlobRef`、`FactPayloadRef` | 只保存 URI / ref / 版本 / 状态,不保存外部正文 |
| 快照 | `ContractReleaseSnapshot`、`release-snapshots/` 资产 | 从基线派生的只读消费面,不得反向改写真相 |
| 投影 | `ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex`、`StandardMappingIndex` | 查询和追溯优化视图,不得作为写路径真相 |
| 运行边界 | outbox event、relay 状态 | 本仓持久化待发布事实,不实现 `L0-bus` ack / retry / dead-letter runtime |

### 5.3 repository 函数如何命名，参数和返回是什么？

Repository 函数以 Step 7 已定义 port 为主。本步发现并回补两个 P0 写入缺口:

| 缺口 | 原因 | 本步处理 |
|---|---|---|
| `ContractFactRepository` 未在 Step 7 单独定义 | Step 9 已使用 fact repository,Step 6 已定义 `ContractFactRecord` | 已回补到 Step 7 |
| `DownstreamConsumptionRef` 缺少保存函数 | Step 6 定义对象,Step 9 快照派生需要维护消费引用 | 已回补到 `SnapshotRepository` |

完整函数契约在 §9.3 展开。

### 5.4 哪些处理流需要事务，事务内必须完成哪些写入？

| 处理流 | 是否需要事务 | 同事务内必须完成 |
|---|---|---|
| `CreateContractDraftFlow` | 是 | definition insert、audit append、outbox append |
| `UpdateContractDraftFlow` | 是 | definition save、audit append、outbox append |
| `SubmitContractForReviewFlow` | 是 | definition save、audit append、outbox append |
| `PublishContractBaselineFlow` | 是 | definition save、baseline insert、audit append、outbox append |
| `UpdateContractLifecycleFlow` | 是 | definition save、audit append、outbox append |
| `ValidateContractChangeJobFlow` | 是,但工具链执行在事务外 | compatibility / trace 写入、audit append、outbox append |
| `DeriveReleaseSnapshotJobFlow` | 是,但 exporter 执行在事务外 | snapshot metadata insert / save、consumption ref 写入、audit append、outbox append |
| `PublishContractFactJobFlow` | 是 | fact status update、outbox append、audit append |
| `OutboxRelayFlow` | 每条状态更新单独事务 | mark published / failed |
| `RebuildContractIndexJobFlow` | projection 批次事务 | replace read models、replace trace projections、watermark update |
| Query flow | 否 | 不允许写入 |

### 5.5 是否需要乐观锁、行锁、版本号、outbox 或 projection？

| 机制 | 是否需要 | 使用位置 |
|---|---|---|
| `aggregate_version` / `expected_version` | 是 | definition、baseline、snapshot、fact 等可修改对象 |
| `get_for_update(...)` | 是 | command 写路径读取待修改 definition |
| 当前基线唯一约束 | 是 | 每个 definition 当前只能有一个 `Released` baseline |
| outbox | 是 | command / job 事实传播 |
| projection watermark / rebuild id | 是 | 批量重建 read model / trace projection |
| 行锁具体实现 | 待 adapter | 文件型实现可用文件锁;数据库实现可用 row lock |

### 5.6 如果事件发布或 projection 更新失败，如何恢复？

| 失败点 | 恢复口径 |
|---|---|
| outbox append 在来源事务内失败 | 整个 command / job 回滚,不得形成无事件的 truth 成功 |
| event publish 失败 | truth 已提交;outbox 记录标记 failed,后续 replay |
| mark published / failed 失败 | 保留 outbox 原状态,下一轮 relay 重新读取或人工恢复 |
| projection replace 失败 | truth 不回滚;旧 projection 保留,水位不前进或标记 stale |
| snapshot exporter 失败 | baseline 不回滚;不写 ready 快照,job 记录失败并可重试 |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| 旧详细设计尚未区分 truth / snapshot / projection / reference | 容易把快照和投影当成契约真相 | 本步按数据所有权重新分类 |
| Step 9 已写 `FactRepository.get_pending(...)`,但 Step 7 未定义 `ContractFactRepository` | 实现者会临时发明 fact repository | 已回补 `ContractFactRepository` |
| `DownstreamConsumptionRef` 有对象和状态,但 repository 只有 list | 快照派生无法保存消费引用 | 已回补 `insert_consumption_ref` / `save_consumption_ref` |
| outbox 和 audit 在多个 flow 中出现,但事务关系需要明确 | 可能出现 truth 成功但 outbox / audit 缺失 | 本步要求来源写路径同事务 |
| projection 重建和 truth 更新关系不清 | 可能把 projection 失败误作发布失败 | 本步明确 projection 最终一致,失败不回滚 truth |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 存储对象 | 只在对象和 port 中分散出现 | 统一成数据所有权和存储对象契约 |
| 事务边界 | Step 9 有处理流级描述 | 本步固定每个场景的开始、提交、回滚和同事务写入 |
| repository 函数 | Step 7 已有主体,但 fact / consumption ref 有缺口 | 本步明确回补项和函数签名 |
| outbox | 只知道 append / relay | 明确来源事务内 append,relay 事务外发布,状态更新单条事务 |
| projection | 只知道 replace / stale | 明确最终一致、水位、失败保留旧视图 |
| 迁移脚本 | 未定 | 本步明确不写迁移脚本,只写实现契约 |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否选择具体数据库 | 现在锁定数据库和 DDL | 先定义存储对象与 repository 契约 | B | 项目未进入开发,且当前架构允许文件型 adapter 起步 |
| truth / audit / outbox 是否同事务 | 分开写,失败后补偿 | 同事务写入 | B | 契约真相变化必须可审计且可传播,不能形成静默成功 |
| projection 写入是否阻塞发布 | 发布等待 projection 完成 | 发布提交后 projection 最终一致 | B | projection 是读面,不能反向阻塞 truth |
| snapshot exporter 是否在事务内执行 | 放在事务内 | exporter 事务外,结果写入再进事务 | B | 避免长事务持有外部工具执行 |
| fact 是否只存在 outbox | 只用 outbox 记录事实 | fact record 与 outbox 分离 | B | fact 是审计 / 追溯对象,outbox 是发布队列 |

---

## 9. 结构化中间产物

### 9.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `ContractDefinition` | `domain_definition` | `ContractDefinitionRepository.insert/save` | definition repository / projection rebuild | 强一致,乐观锁 |
| `ContractReleaseBaseline` | `domain_release` | `ContractBaselineRepository.insert/save` | release / snapshot / trace / query | 发布边界强一致,当前基线唯一 |
| `ContractReleaseSnapshot` | `domain_release` | `SnapshotRepository.insert/save` | snapshot query / trace / downstream | 元数据事务一致,资产最终一致 |
| `DownstreamConsumptionRef` | `domain_reference_projection` | `SnapshotRepository.insert_consumption_ref/save_consumption_ref` | snapshot / trace / query | 最终一致,状态显式 |
| `ContractFactRecord` | `domain_fact` | `ContractFactRepository.insert/save` | fact service / trace / recovery | 与 outbox 可恢复一致 |
| `AuditRecord` | `application_ports` | `AuditLogPort.append` | audit / trace | 关键写路径同事务 |
| `IdempotencyRecord` | `application_ports` | `IdempotencyRepository.reserve/complete` | command / job retry / replay | 与关键 truth 写入同事务或等效原子预占 |
| `FactOutboxEvent` | `application_ports` | `OutboxPort.append/mark_*` | relay worker / recovery | append 同事务,relay 最终一致 |
| `ExternalReference` | `domain_reference_projection` | `ReferenceRepository.save_external_reference` | release / trace / query | 引用有效性一致 |
| `EventCatalogReference` | `domain_reference_projection` | `ReferenceRepository.save_event_catalog_reference` | release / trace / query | 引用有效性一致 |
| `StandardMappingIndex` | `domain_reference_projection` | `ReferenceRepository.save_standard_mapping` | query / validation | projection 最终一致 |
| `CompatibilityTraceIndex` | `domain_reference_projection` | `ReferenceRepository` 或 `ProjectionStorePort` | compatibility query / release | 校验结果一致,读面可 stale |
| `ContractReadModel` | `domain_reference_projection` | `ProjectionStorePort.replace_read_models` | query | 最终一致,watermark |
| `ContractTraceProjection` | `domain_reference_projection` | `ProjectionStorePort.replace_trace_projections` | trace query | 最终一致,watermark |
| `contract-source/` 资产 | `contract_source_assets` | source store adapter | definition repository / toolchain | 与 definition fingerprint 对账 |
| `release-snapshots/` 资产 | `release_snapshot_assets` | snapshot store / exporter | downstream / snapshot query | 与 snapshot metadata fingerprint 对账 |

### 9.2 存储对象契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `contract_definitions` 或 `contract-source/index` | 保存契约定义真相 | `definition_id` | `kind`、`scope.owner_domain`、`lifecycle.state`、`updated_at` | `aggregate_version` |
| `contract_release_baselines` | 保存发布基线 | `baseline_id` | `definition_id + status`、`definition_id + version` | `aggregate_version` |
| `contract_release_snapshots` | 保存快照元数据 | `snapshot_id` | `baseline_id`、`definition_id + version`、`status` | `aggregate_version` |
| `downstream_consumption_refs` | 保存下游消费引用 | `consumption_ref_id` | `baseline_id`、`downstream_domain`、`consumption_status` | 可选 `aggregate_version` |
| `contract_fact_records` | 保存可追溯事实 | `fact_id` | `definition_id`、`baseline_id`、`delivery_status`、`occurred_at` | `aggregate_version` |
| `audit_records` | 保存审计记录 | `audit_id` | `resource_ref`、`actor_ref`、`occurred_at` | 无;append-only |
| `idempotency_records` | 保存写请求 / job 幂等记录 | `scope + idempotency_key` | `operation`、`request_id`、`status`、`created_at` | 可选 `record_version` |
| `outbox_events` | 保存待发布事实事件 | `event_id` | `status`、`event_type`、`source_ref`、`idempotency_key` | `delivery_version` 或状态版本 |
| `external_references` | 保存外部引用 | `reference_id` | `reference_uri`、`reference_kind`、`reference_state` | 可选状态版本 |
| `event_catalog_references` | 保存事件目录引用 | `reference_id` | `catalog_ref`、`contract_kind`、`reference_state` | 可选状态版本 |
| `standard_mapping_indexes` | 保存标准映射索引 | `index_id` | `standard_ref`、`contract_kind`、`index_state` | 可选状态版本 |
| `compatibility_trace_indexes` | 保存兼容追溯索引 | `trace_index_id` | `definition_id`、`baseline_id`、`trace_state` | 可选状态版本 |
| `contract_read_models` | 保存查询只读模型 | `read_model_id` | `definition_id`、`current_status`、`scope`、`updated_at` | `projection_version` |
| `contract_trace_projections` | 保存追溯投影 | `projection_id` | `definition_id`、`projection_state`、`updated_at` | `projection_version` |
| `projection_watermarks` | 保存投影重建水位 | `projection_name` | `rebuild_id`、`updated_at` | `watermark_version` |
| `release_snapshot_assets` | 保存只读快照资产 | `snapshot_ref` / path | `baseline_id`、`fingerprint` | manifest version |

关键说明:

- 上表不是 DDL,而是实现契约。文件型实现可以用 manifest / index 文件承载;数据库实现可以映射成表。
- `audit_records` 应 append-only;不得通过 save 覆盖历史审计。
- `outbox_events` 的状态字段属于 outbox 记录,不是 `FactDeliveryStatus` 的 enum 扩展。

### 9.3 Repository / Port 函数契约表

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `UnitOfWork.transact<T, F, Fut>(F operation)` | 执行事务闭包 | 写路径必须使用;文件型实现需要进程级文件锁和原子提交 | `Result<T, PortError>` | `PortError` |
| `ContractDefinitionRepository.get(ContractDefinitionId definition_id)` | 只读读取定义 | 无写锁 | `Result<Option<ContractDefinition>, PortError>` | `PortError` |
| `ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)` | 读取待修改定义 | 必须在事务内获得写锁或等效锁 | `Result<Option<ContractDefinition>, PortError>` | `PortError` |
| `ContractDefinitionRepository.insert(ContractDefinition definition)` | 插入新定义 | 事务内;唯一键检查 | `Result<(), PortError>` | `PortError` |
| `ContractDefinitionRepository.save(ContractDefinition definition, Version expected_version)` | 保存定义 | 事务内;校验 `aggregate_version` | `Result<(), PortError>` | `PortError` |
| `ContractBaselineRepository.get_current_by_definition(ContractDefinitionId definition_id)` | 读取当前基线 | 可只读;发布时需与 definition 写事务同一上下文 | `Result<Option<ContractReleaseBaseline>, PortError>` | `PortError` |
| `ContractBaselineRepository.insert(ContractReleaseBaseline baseline)` | 插入基线 | 事务内;校验当前 released 唯一性 | `Result<(), PortError>` | `PortError` |
| `ContractBaselineRepository.save(ContractReleaseBaseline baseline, Version expected_version)` | 保存基线状态 | 事务内;乐观锁 | `Result<(), PortError>` | `PortError` |
| `SnapshotRepository.insert(ContractReleaseSnapshot snapshot)` | 插入快照元数据 | 事务内;资产写入成功后调用 | `Result<(), PortError>` | `PortError` |
| `SnapshotRepository.save(ContractReleaseSnapshot snapshot, Version expected_version)` | 保存快照状态 | 事务内;乐观锁 | `Result<(), PortError>` | `PortError` |
| `SnapshotRepository.insert_consumption_ref(DownstreamConsumptionRef ref)` | 插入消费引用 | 事务内;唯一键检查 | `Result<(), PortError>` | `PortError` |
| `SnapshotRepository.save_consumption_ref(DownstreamConsumptionRef ref, Version expected_version)` | 保存消费引用状态 | 事务内;乐观锁或状态版本 | `Result<(), PortError>` | `PortError` |
| `ContractFactRepository.get_pending(BatchSize batch_size)` | 读取待输出事实 | relay / fact job 可只读;需要避免重复处理 | `Result<Vec<ContractFactRecord>, PortError>` | `PortError` |
| `ContractFactRepository.insert(ContractFactRecord fact)` | 插入事实记录 | 事务内;可与 outbox append 同事务 | `Result<(), PortError>` | `PortError` |
| `ContractFactRepository.save(ContractFactRecord fact, Version expected_version)` | 保存事实状态 | 事务内;乐观锁 | `Result<(), PortError>` | `PortError` |
| `AuditLogPort.append(AuditRecord record)` | 追加审计 | 关键写路径事务内;查询路径不调用 | `Result<(), PortError>` | `PortError` |
| `IdempotencyRepository.reserve(IdempotencyScope scope, IdempotencyKey key, OperationName operation, RequestPayloadFingerprint payload_fingerprint, RequestId request_id, Timestamp now)` | 预占幂等键或返回 replay decision | 写路径事务内;`scope + key` 原子唯一 | `Result<IdempotencyDecision, PortError>` | `PortError` |
| `IdempotencyRepository.complete(IdempotencyScope scope, IdempotencyKey key, Receipt receipt, Timestamp completed_at)` | 保存完成状态和可重放回执 | 与 truth / audit / outbox 成功写入同事务或等效原子提交 | `Result<(), PortError>` | `PortError` |
| `OutboxPort.append(FactOutboxEvent event)` | 写待发布事件 | 来源 command / job 事务内 | `Result<(), PortError>` | `PortError` |
| `OutboxPort.fetch_pending(BatchSize batch_size)` | 拉取待发布事件 | 事务外;实现需避免重复发布或支持幂等 | `Result<Vec<FactOutboxEvent>, PortError>` | `PortError` |
| `OutboxPort.mark_published(OutboxEventId event_id, Timestamp published_at)` | 标记已发布 | 单条事务 | `Result<(), PortError>` | `PortError` |
| `OutboxPort.mark_failed(OutboxEventId event_id, OutboxFailureReason reason, Timestamp failed_at)` | 标记发布失败 | 单条事务 | `Result<(), PortError>` | `PortError` |
| `ProjectionStorePort.replace_read_models(ContractReadModelBatch batch, ProjectionRebuildId rebuild_id)` | 替换 read model 批次 | projection 批次事务;成功后推进水位 | `Result<ProjectionWriteReceipt, PortError>` | `PortError` |
| `ProjectionStorePort.replace_trace_projections(ContractTraceProjectionBatch batch, ProjectionRebuildId rebuild_id)` | 替换 trace projection 批次 | projection 批次事务;成功后推进水位 | `Result<ProjectionWriteReceipt, PortError>` | `PortError` |
| `ProjectionStorePort.mark_stale(ProjectionName projection_name, ProjectionStaleReason reason, Timestamp marked_at)` | 标记投影过期 | 可在来源事务后异步执行;失败需可重试 | `Result<(), PortError>` | `PortError` |

Step 7 回补结果:

| 回补位置 | 已新增 |
|---|---|
| `SnapshotRepository` | `insert_consumption_ref(...)`、`save_consumption_ref(...)` |
| `application_ports` | 新增 `ContractFactRepository` trait,包含 `get_pending(...)`、`insert(...)`、`save(...)` |

### 9.4 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| 创建草稿 | `ContractChangeService.create_contract_draft(...)` 调用 `UnitOfWork.transact(...)` | definition insert、audit、outbox 全部成功后 | validation、唯一键、audit、outbox、提交失败 | `ContractDefinitionRepository.insert`、`AuditLogPort.append`、`OutboxPort.append` |
| 更新草稿 | `ContractChangeService.update_contract_draft(...)` | definition save、audit、outbox 全部成功后 | not found、非法状态、expected version 冲突、outbox 失败 | `get_for_update`、`save`、`audit`、`outbox` |
| 提交评审 | `ContractChangeService.submit_contract_for_review(...)` | definition save、audit、outbox 全部成功后 | 非 `Draft`、版本冲突、audit / outbox 失败 | `get_for_update`、`save`、`audit`、`outbox` |
| 发布基线 | `ContractReleaseService.publish_contract_baseline(...)` | definition save、baseline insert、audit、outbox 全部成功后 | gate invalid、fingerprint mismatch、compatibility blocked、当前基线冲突 | `definition.save`、`baseline.insert`、`audit`、`outbox` |
| 生命周期迁移 | `ContractReleaseService.update_contract_lifecycle(...)` | definition save、audit、outbox 全部成功后 | 非法状态迁移、版本冲突、outbox 失败 | `definition.save`、`audit`、`outbox` |
| 兼容性校验结果写入 | toolchain 执行完成后进入 `ContractCompatibilityService.validate_contract_change(...)` 事务 | trace / status 保存、audit、outbox 成功后 | toolchain result invalid、trace 保存失败、outbox 失败 | compatibility status / trace、audit、outbox |
| 快照派生结果写入 | exporter 与 snapshot asset 写入成功后进入 `ContractSnapshotService.derive_release_snapshot(...)` 事务 | snapshot metadata、consumption refs、audit、outbox 成功后 | baseline missing、fingerprint mismatch、snapshot save 失败、outbox 失败 | snapshot insert/save、consumption refs、audit、outbox |
| 事实发布整理 | `ContractFactService.publish_contract_fact(...)` | fact save、outbox append、audit 成功后 | fact 状态非法、outbox 失败、audit 失败 | fact save、outbox append、audit |
| outbox relay 状态更新 | 每条 event publish 完成后 | `mark_published` 或 `mark_failed` 成功后 | 状态更新失败 | 只更新当前 outbox event |
| projection 重建 | `ContractOperationsService.rebuild_contract_index(...)` 写 projection 阶段 | replace read model、replace trace projection、水位更新成功后 | projection 写失败、水位失败 | projection replace、watermark |
| 查询 | 不开启写事务 | 不适用 | 不适用 | 无写入 |

### 9.5 一致性策略表

| 数据关系 / 场景 | 一致性策略 | 实现要求 | 失败处理 |
|---|---|---|---|
| definition 内部字段 | 强一致 | 聚合函数一次性修改生命周期、版本、fingerprint、演进记录 | 回滚 |
| definition + audit + outbox | 强一致 | 同一个 `UnitOfWork` 内保存 | 任一失败则回滚 |
| idempotency + truth + receipt | 强一致或等效原子预占 | reserve 在写入前完成,complete 与 truth / audit / outbox 成功提交绑定 | complete 失败则写路径整体失败或保持可重试 |
| definition + baseline | 发布边界强一致 | 发布时同事务保存 definition 和 baseline | 任一失败则不发布 |
| baseline + snapshot asset | 最终一致 | exporter 先产出资产,再事务保存 snapshot metadata;metadata 不得指向未校验资产 | 资产失败不写 metadata;metadata 失败保留资产为 orphan candidate |
| snapshot + downstream consumption ref | 最终一致 | 同一快照结果事务内维护消费引用 | 失败则快照元数据不进入 ready 或保持可重试 |
| fact record + outbox | 可恢复强一致 | fact 状态变更和 outbox append 同事务 | outbox 失败回滚 fact 状态 |
| outbox + L0-bus publish | 最终一致 | publish 在事务外,mark 状态单条事务 | publish 失败标记 failed 或保留 pending |
| projection + truth | 最终一致 | truth 提交后 projection 标记 stale 或批量重建 | projection 失败不回滚 truth |
| external reference + external body | 引用有效性一致 | 只保存引用状态和元数据,不复制正文 | 解析失败标记 invalidated / stale |
| source asset + definition | 指纹一致 | definition fingerprint 必须能对账 source asset | 指纹不一致阻断发布 |

### 9.6 失败恢复与补偿口径

| 失败场景 | 保留状态 | 恢复动作 | 不允许的做法 |
|---|---|---|---|
| command 写入 truth 成功但 audit / outbox 失败 | 不应出现;事务回滚 | 修复 port 后重试 command | 保留无审计 / 无 outbox 的 truth |
| 幂等 complete 失败 | truth / audit / outbox 不应提交为成功 | 回滚事务后使用同一 idempotency key 重试 | 返回成功但无法 replay receipt |
| snapshot asset 写入成功但 metadata 失败 | orphan snapshot asset candidate | 清理 orphan 或重跑派生 | 暗中把 asset 当作 ready 快照 |
| outbox publish 成功但 mark published 失败 | outbox 仍可能是 pending | 幂等 publish 或人工标记 | 删除 outbox 记录 |
| outbox publish 失败 | pending 或 failed | relay replay / operations replay | 把 truth 回滚 |
| projection replace 失败 | 旧 projection active 或 stale | 重跑 rebuild job | 让查询误报为最新 |
| compatibility toolchain 失败 | no new compatible status 或 failed audit | 重跑 validation job | 自动发布 baseline |
| reference resolver 失败 | `ReferenceState::Stale` 或 `Invalidated` | 重新解析或人工确认 | 复制外部正文补齐 |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §10 先写数据所有权,再写存储对象和 repository 函数。
2. 不写数据库迁移脚本;只写存储对象实现契约。
3. 文件型 adapter 与数据库 adapter 都必须满足同一 repository / transaction 契约。
4. command 写路径必须保留 truth + audit + outbox 同事务要求。
5. command / job 幂等必须保留 idempotency reserve / complete 与 receipt replay 约束。
6. projection / snapshot / relay 必须明确最终一致与失败恢复。
7. Step 7 已回补的 repository 函数必须在正式文档组装时同步回填到 Trait / Port 契约章节。
```

建议正式文档 §10 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `10.1 数据所有权实现表` | truth / snapshot / projection / reference / outbox 归属 |
| `10.2 存储对象契约` | 存储对象、主键、索引、版本字段 |
| `10.3 Repository / Port 函数契约` | repository 函数、锁、事务要求 |
| `10.4 事务边界` | command、job、relay、projection 的事务表 |
| `10.5 一致性策略` | 强一致、最终一致、引用一致、恢复一致 |
| `10.6 失败恢复与补偿` | outbox、projection、snapshot、reference 的失败恢复 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否现在写 DDL / migration | A. 立即写 DDL; B. 只写存储对象契约 | B | 项目尚未开发,且当前不锁定具体数据库 | 已按 B 作为本轮口径 |
| 初始 adapter 是否以文件存储为主 | A. 文件型 adapter 起步; B. 直接数据库 | A | Step 4 已定义 source / snapshot / projection / outbox 文件 adapter,可更快落地 | 已按 A 作为本轮口径 |
| `ContractFactRecord` 是否需要独立 repository | A. 不需要,只用 outbox; B. 需要 `ContractFactRepository` | B | fact 是追溯对象,outbox 是发布队列,职责不同 | 已按 B 作为本轮口径 |
| `DownstreamConsumptionRef` 写入放在哪个 repository | A. `SnapshotRepository`; B. `ReferenceRepository`; C. 新建 repository | A | 消费引用绑定 baseline / snapshot,与快照消费面关系最强 | 已按 A 作为本轮口径 |
| projection 失败是否回滚 truth | A. 回滚; B. 不回滚,标记 stale / 重建 | B | projection 是读面派生,不能反向阻塞 truth | 已按 B 作为本轮口径 |

---

## 12. 进入下一步条件

Step 11 完成后必须满足:

- 数据对象的拥有方、写入方、读取方和一致性要求已经明确。
- 真相、引用、快照、投影、审计和 outbox 已经分清。
- 存储对象的主键、关键索引和版本字段已经固定到实现契约层。
- repository / port 函数的参数、返回、锁 / 事务要求和错误类型已经列出。
- command / job / relay / projection / query 的事务边界已经明确。
- 幂等记录的存储对象、repository 函数和一致性要求已经回补。
- outbox、snapshot、projection、reference 的失败恢复口径已经明确。
- Step 7 需要回补的 repository 缺口已经完成回补并显式记录。
- 可以进入 Step 12 “定义错误模型、异常分支与恢复口径”。
