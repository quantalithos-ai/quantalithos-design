# Step 11. 定义持久化、事务与一致性契约

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 11 中间产物。
> 本步定义 SDK 本地数据如何被保存、查询、加锁、版本控制、写入 outbox、刷新 projection，以及如何保持一致性。
> 本步不写数据库迁移脚本，不绑定具体数据库产品，不新增 Step 7 未定义的 repository / projection / outbox port。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-sdk/03-详细设计.md` §10 数据持久化、事务与一致性契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已定义 repository、projection、artifact、outbox、idempotency、unit of work port | 作为数据访问函数和存储边界来源 |
| `03_ddd_step_09_function_flows.md` | 已定义每条处理流的事务边界和状态 / event 副作用 | 作为事务边界表来源 |
| `03_ddd_step_10_state_matrix.md` | 已定义状态转换矩阵和非法转换处理 | 作为持久化状态字段和状态一致性要求来源 |
| `03_ddd_step_04_units_file_layout.md` | 已确认 `crates/infra` 提供 in-memory / filesystem 默认 adapter | 作为 P0 存储实现形态输入 |
| `projects/L0-sdk/01-架构设计.md` | 已确认 SDK 不拥有 core / bus / service truth，不做 public registry publish | 约束数据所有权和引用边界 |
| `standards/document/详细设计讨论流程_SOP.md` Step 11 | 要求数据所有权表、存储对象表、Repository 函数表、事务边界表、一致性策略表 | 作为本步输出结构依据 |

已确认结论：

```text
L0-sdk 拥有 SDK 本地 truth、candidate、evidence、compatibility、deprecated、version ref、idempotency、outbox 和 projection。
L0-sdk 不拥有 core / bus / formal API / service 业务 truth。
P0 不要求数据库迁移脚本；实现可以先用 in-memory / filesystem adapter，但 repository / transaction / consistency contract 必须稳定。
Artifact body 与本地 truth 不是同一事务资源；truth 只保存 artifact ref / digest / metadata。
Outbox publish 在 truth 提交后执行，发布失败不能回滚 truth。
```

---

## 3. SOP 问题回答

### 3.1 哪些数据对象由本仓拥有？

| 数据对象 | 是否由 SDK 拥有 | 说明 |
|---|---|---|
| `SdkSemanticBaseline` | 是 | SDK 共同语义基线 truth |
| `ClientCapabilityModel` / `CrossLanguageConceptMap` | 是 | baseline 的组成部分 |
| `DerivedBindingView` / `LanguageBindingView` | 是 | SDK 从上游 snapshot 派生出的本地 view |
| `ServiceClientView` / `BusEventClientView` | 是 | SDK client view truth |
| `PackageCandidate` / `LanguageArtifact` | 是 | 本地 package candidate 和 artifact metadata |
| `VerificationEvidence` | 是 | SDK 验证证据 truth |
| `CompatibilityDecision` / `DeprecatedApiRecord` / `MigrationGuideRef` | 是 | SDK 兼容和演进 truth / reference |
| `UpstreamVersionRef` | 是，但只作为引用 | SDK 保存上游版本、snapshot、digest 引用，不保存上游正文 |
| `IdempotencyRecord` | 是 | SDK 写路径、consumer、job 幂等锚点；runtime boundary 可保存 runtime-scoped 技术幂等记录但不写 SDK domain truth |
| `SdkOutboxEvent` | 是 | SDK 已提交事实的 outbox 记录 |
| capability / evidence / compatibility / docs projection | 是，但为可重建 read model | 不反写真相 |

### 3.2 哪些只是引用、快照或投影？

| 类别 | 示例 | 持久化口径 |
|---|---|---|
| 上游引用 | `CoreContractRef`、`CoreSnapshotRef`、`TransportSemanticId`、`FormalApiRef` | 只保存 ref / version / digest / observed_at |
| 外部 payload 引用 | `PayloadRef`、`PayloadDigest` | 只保存 ref / digest，不保存 payload body |
| Artifact 引用 | `PackageArtifactRef`、`ArtifactDigest` | truth 保存 metadata；artifact body 在 artifact store |
| 文档引用 | `DocumentRef`、`MigrationGuideRef.document_ref` | 只保存 document ref，不复制文档正文 |
| Projection | capability / evidence / compatibility / docs example view | 可重建，不作为业务 truth 来源 |
| Source snapshot | `CoreContractSnapshot`、`BusSemanticSnapshot`、`FormalApiSnapshot` | source port 返回输入，不进入 SDK truth 正文 |

### 3.3 repository 函数如何命名，参数和返回是什么？

回答：沿用 Step 7 已定义函数。本步在 §7.4 汇总 repository / projection / outbox 函数，并补充锁、事务、版本要求。

### 3.4 哪些处理流需要事务，事务内必须完成哪些写入？

回答：见 §7.5。写路径 command、inbound consumer、candidate / evidence / compatibility job 和 projection rebuild 需要 `UnitOfWork`；runtime boundary、query 和 source freshness read-only check 不需要写事务。

### 3.5 是否需要乐观锁、行锁、版本号、outbox 或 projection？

| 机制 | 是否需要 | 适用位置 |
|---|---|---|
| 乐观锁 / `ExpectedVersion` | 是 | baseline、derived view、client view、candidate、deprecated API |
| 行锁 / `get_for_update` 语义 | 是，抽象为 repository lock | candidate、baseline、需要写入状态的 view |
| 版本号 | 是 | 所有可更新 truth / projection |
| outbox | 是 | 所有会传播 SDK 已提交事实的写路径 |
| projection | 是 | capability、evidence、compatibility、docs example read model |
| 分布式事务 | 否 | P0 不跨 artifact store / event bus 做分布式事务 |

### 3.6 如果事件发布或 projection 更新失败，如何恢复？

| 失败场景 | 恢复口径 |
|---|---|
| 事务内 projection 更新失败 | 回滚本次 truth 写入；调用方重试 |
| projection rebuild batch 失败 | 回滚该 batch；保留旧 projection；下次从 cursor / scope 重跑 |
| outbox append 失败 | 回滚本次 truth 写入，因为事实无法传播 |
| outbox publish 失败 | 不回滚 truth；outbox 保持 pending / retryable |
| artifact store 写入成功但 truth 事务失败 | artifact 成为 orphan，可由后续清理 job 处理；不得出现在 candidate truth 中 |
| source snapshot 暂不可用 | 不写 truth；返回 retryable dependency error |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| Step 7 | 已定义 repository / projection / artifact / outbox port，但没有说明哪些对象是 truth | 实现者可能把 projection 或 source snapshot 当 truth | 本步补数据所有权表 |
| Step 9 | 写路径都提到事务，但事务内必须一起提交的内容分散 | 可能漏写 outbox、幂等或 projection | 本步收敛事务边界表 |
| Step 10 | 状态矩阵已定义，但状态持久化字段和版本要求未收口 | 状态更新可能没有乐观锁 | 本步要求可更新 truth 带 version / expected version |
| Artifact | artifact body 与 candidate truth 的事务关系不清 | 构建失败或事务失败可能产生脏状态 | 本步明确 truth 只保存 artifact ref / digest，artifact orphan 可清理 |
| Outbox | append 与 publish 关系容易混淆 | publisher 失败可能错误回滚 truth | 本步明确 append 在 truth 事务内，publish 在提交后 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据所有权 | 分散在对象和 port 文档 | 明确 SDK truth、引用、projection、artifact store 边界 | 防止复制上游 truth |
| 存储对象 | 只有 repository 名称 | 每个存储对象有用途、主键、索引和版本字段 | 支撑实现 |
| Repository 函数 | Step 7 有签名 | 补充锁 / 事务要求和一致性语义 | 支撑并发 |
| 事务边界 | Step 9 有每流描述 | 汇总成可实现事务表 | 支撑 Step 12/13 |
| Outbox | 只有 port | 明确 append 与 publish 的事务关系 | 防止外部发布污染 truth |
| Projection | 只有 projection port | 明确同事务更新 / batch rebuild / stale marker | 防止 query 隐式写入 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：本步直接写数据库 DDL / migration | 实施快 | 当前尚未绑定数据库，会过早固定技术实现 | 不采用 |
| 方案 B：写存储对象契约、repository 函数、事务边界和一致性策略，不写迁移脚本 | 保持实现自由，同时足够指导代码 | 需要实施阶段选择 adapter 细节 | 采用 |
| 方案 C：artifact store 与 truth repository 做一个大事务 | 理论一致 | P0 不做分布式事务，filesystem / runner 难保证 | 不采用 |
| 方案 D：artifact body 先写 store，truth 只提交 ref / digest，失败时 orphan 可清理 | 简单且符合本地 artifact 现实 | 需要后续清理策略 | 采用 |
| 方案 E：projection 异步最终一致 | 写路径快 | P0 query 可能读不到必要状态 | 部分采用；写后必须可见的 projection 同事务更新，批量 rebuild 可异步 |

推荐方案：方案 B + D，projection 使用“写后必要投影同事务更新，批量 rebuild 异步补偿”。

原因：

- 详细设计要支撑 1:1 实现，但当前还未进入具体数据库迁移阶段。
- SDK 的关键一致性是本地 truth、idempotency、outbox 和 read model 的一致，而不是绑定某个数据库。
- artifact body 与 external publish 都不应进入本地 truth 写事务。

---

## 7. 结构化中间产物

### 7.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `SdkSemanticBaseline` | `domain_semantic` / `application_services` | `SdkSemanticBaselineService` | `QueryService`、candidate / compatibility service | 保存时必须带 version；baseline、capability projection、outbox 同事务 |
| `ClientCapabilityModel` | `domain_semantic` | `SdkSemanticBaselineService` | service / event / package candidate service | 作为 baseline 组成部分保存，不单独成为上游 truth |
| `CrossLanguageConceptMap` | `domain_semantic` | `SdkSemanticBaselineService` | generator、candidate、query | 必须与 supported languages 一致 |
| `UpstreamVersionRef` | `domain_upstream_view` | `ContractConsumptionService`、upstream consumer | freshness job、query、candidate service | 只保存 ref / digest / observed_at，不保存上游正文 |
| `DerivedBindingView` | `domain_upstream_view` | `ContractConsumptionService` | package candidate service、query | 保存时带 version；freshness 必须为 `Fresh` 才可生成 candidate |
| `LanguageBindingView` | `domain_upstream_view` | `ContractConsumptionService` | generator、package builder、query | `language_view_id` 由 `DerivedViewId + LanguageId` 稳定派生；不允许新增 derived view 中不存在的能力 |
| `ServiceClientView` | `domain_service_client` | `ContractConsumptionService` | runtime service call、query、candidate service | 保存时带 version；support 状态不能由 runtime call 反写 |
| `BusEventClientView` | `domain_event_client` | `ContractConsumptionService` | runtime event call、query、candidate service | 不保存 bus runtime truth |
| `PackageCandidate` | `domain_package_candidate` | `PackageCandidateService`、validation / compatibility service | query、validation、compatibility | 状态更新必须通过 `get_for_update` + expected version |
| `LanguageArtifact` metadata | `domain_package_candidate` | package build flow | candidate query、evidence flow | truth 只保存 artifact ref / digest 和来源 `language_view_id`，不保存 artifact body |
| `VerificationEvidence` | `domain_evidence` | validation consumer / smoke / docs / boundary jobs | query、compatibility service | 不保存 raw body / secret；result 与 redaction 分离 |
| `CompatibilityDecision` | `domain_compatibility_evolution` | compatibility command / job | query、candidate gate | RequiresMigration 必须有 migration ref |
| `DeprecatedApiRecord` | `domain_compatibility_evolution` | deprecate command | query、docs / migration consumer | lifecycle 更新必须带 expected version |
| `MigrationGuideRef` | `domain_compatibility_evolution` | deprecate / compatibility flow | query、docs | 只保存 document ref，不复制文档正文 |
| `IdempotencyRecord` | `application_ports` / `infra_adapters` | SDK domain write flows / consumers / jobs；runtime boundary technical flow | write flows；runtime replay lookup | key + digest 唯一；同 key 不同 digest 冲突；runtime 技术记录不反写 SDK domain truth |
| `SdkOutboxEvent` | `application_ports` / `infra_adapters` | write flows | outbox publisher | append 与 truth 同事务；publish 后单独 mark published |
| Projection views | `infra_adapters` / projection ports | write flows / rebuild job | query | 可重建；不得反写真相 |

### 7.2 引用、snapshot、artifact 与 projection 边界表

| 边界对象 | 类型 | 是否 SDK truth | 保存内容 | 禁止保存 |
|---|---|---|---|---|
| `CoreContractSnapshot` | source snapshot | 否 | 可作为 source port 返回值参与派生 | core 契约正文进入 SDK truth |
| `BusSemanticSnapshot` | source snapshot | 否 | 可作为 source port 返回值参与派生 | bus delivery / retry / replay truth |
| `FormalApiSnapshot` | source snapshot | 否 | formal API ref、version、digest | service implementation source |
| `PayloadRef` / `PayloadDigest` | external payload reference | 否 | ref、digest | payload body |
| `PackageArtifactRef` / metadata | artifact metadata | 是，metadata only | artifact ref、digest、language、candidate ID | package artifact body、secret |
| `DocumentRef` | document reference | 否 | document ref、version | migration document body |
| `DiagnosticRef` | diagnostic reference | 否 | diagnostic ref | raw logs with secret / body |
| Projection view | read model | 是，可重建 | query view、version、consistency marker | 作为 truth source 反写 domain |

### 7.3 存储对象契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `semantic_baselines` | 保存当前和历史 SDK semantic baseline | `baseline_id`；`baseline_version` unique | `is_current`、`created_at` | `version` |
| `upstream_version_refs` | 保存 core / bus / formal API 当前引用 | `(source_kind, version_ref)` | `source_kind`、`observed_at` | `version` |
| `derived_binding_views` | 保存 derived binding view | `view_id` | `freshness_state`、`upstream_ref` | `version` |
| `language_binding_views` | 保存 language-specific view | `language_view_id`；`(view_id, language_id)` unique | `language_id`、`view_id`、`freshness_state` | `version` |
| `service_client_views` | 保存 service client view | `service_view_id` | `freshness_state`、`capability_id` | `version` |
| `event_client_views` | 保存 bus event client view | `event_view_id` | `freshness_state`、`event_type` | `version` |
| `package_candidates` | 保存 package candidate truth | `candidate_id`；`candidate_version` unique | `status`、`baseline_version` | `version` |
| `language_artifact_metadata` | 保存 candidate artifact metadata | `artifact_ref` | `candidate_id`、`language_id`、`language_view_id`、`digest` | `version` |
| `verification_evidence` | 保存验证证据 | `evidence_id` | `candidate_id`、`result`、`redaction_status` | `version` |
| `compatibility_decisions` | 保存 compatibility decision | `decision_id` | `candidate_id`、`decision_state` | `version` |
| `deprecated_api_records` | 保存 deprecated API lifecycle | `api_ref` | `lifecycle_state`、`language_id` | `version` |
| `migration_guide_refs` | 保存 migration guide reference | `migration_ref_id` | `api_ref`、`from_version`、`to_version` | `version` |
| `sdk_idempotency_records` | 保存幂等锚点 | `idempotency_key` | `scope`、`created_at`、`status` | `version` |
| `sdk_outbox_events` | 保存待发布 SDK fact | `outbox_event_id` | `status`、`topic`、`created_at` | `version` |
| `capability_projection` | capability summary read model | `projection_key` | `baseline_version`、`language_id` | `projection_version` |
| `evidence_projection` | evidence read model | `projection_key` | `candidate_id`、`result` | `projection_version` |
| `compatibility_projection` | compatibility read model | `projection_key` | `candidate_id`、`decision_state` | `projection_version` |
| `docs_example_projection` | docs example read model | `projection_key` | `candidate_id`、`language_id` | `projection_version` |

说明：

- 表名是实现契约中的 logical storage object，不代表必须立即写 SQL DDL。
- P0 in-memory adapter 可以用 collection / map 实现同等约束。
- 后续 durable adapter 必须保持主键、唯一键、索引和版本语义。

### 7.4 Repository / Projection / Outbox 函数一致性表

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `SemanticBaselineRepository.get_for_update(UnitOfWorkHandle uow)` | 写事务中读取当前 baseline | 必须在 UoW 内锁定当前 baseline | `Option<SdkSemanticBaseline>` | `RepositoryError` |
| `SemanticBaselineRepository.save(SdkSemanticBaseline baseline, ExpectedVersion expected_version, UnitOfWorkHandle uow)` | 保存 baseline | UoW 内；校验 expected version | `Version` | `RepositoryError::VersionConflict` |
| `DerivedViewRepository.save_binding_view(DerivedBindingView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)` | 保存 derived view | UoW 内；校验 expected version | `Version` | `RepositoryError` |
| `DerivedViewRepository.mark_stale_by_upstream(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)` | 按上游变化标记 stale | UoW 内；批量更新 affected views | `StaleMarkResult` | `RepositoryError` |
| `ServiceClientViewRepository.save(ServiceClientView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)` | 保存 service client view | UoW 内；校验 version | `Version` | `RepositoryError` |
| `EventClientViewRepository.save(BusEventClientView view, ExpectedVersion expected_version, UnitOfWorkHandle uow)` | 保存 event client view | UoW 内；校验 version | `Version` | `RepositoryError` |
| `CandidateRepository.insert(PackageCandidate candidate, UnitOfWorkHandle uow)` | 新增 candidate | UoW 内；candidate version 唯一 | `Version` | `RepositoryError` |
| `CandidateRepository.get_for_update(PackageCandidateId candidate_id, UnitOfWorkHandle uow)` | 锁定 candidate | UoW 内；写状态前必用 | `Option<PackageCandidate>` | `RepositoryError` |
| `CandidateRepository.save(PackageCandidate candidate, ExpectedVersion expected_version, UnitOfWorkHandle uow)` | 保存 candidate 状态 | UoW 内；校验 version | `Version` | `RepositoryError::VersionConflict` |
| `EvidenceRepository.insert(VerificationEvidence evidence, UnitOfWorkHandle uow)` | 新增 evidence | UoW 内；evidence ID 唯一 | `Version` | `RepositoryError` |
| `CompatibilityRepository.save_decision(CompatibilityDecision decision, UnitOfWorkHandle uow)` | 保存 compatibility decision | UoW 内；decision ID 唯一 | `Version` | `RepositoryError` |
| `CompatibilityRepository.save_deprecated_api(DeprecatedApiRecord record, ExpectedVersion expected_version, UnitOfWorkHandle uow)` | 保存 deprecated API lifecycle | UoW 内；校验 version | `Version` | `RepositoryError` |
| `VersionRefRepository.upsert_upstream_ref(UpstreamVersionRef upstream_ref, UnitOfWorkHandle uow)` | 保存上游版本引用 | UoW 内；source + version 唯一 | `Version` | `RepositoryError` |
| `SdkIdempotencyRepository.reserve(IdempotencyKey key, CommandDigest digest, UnitOfWorkHandle uow)` | 占用幂等 key | 必须与业务 truth 同事务 | `IdempotencyReservation` | `RepositoryError::IdempotencyConflict` |
| `SdkIdempotencyRepository.complete(IdempotencyKey key, CommandReceiptRef receipt_ref, UnitOfWorkHandle uow)` | 完成幂等记录 | 必须与业务结果同事务 | `()` | `RepositoryError` |
| `RuntimeIdempotencyRepository.reserve(IdempotencyKey key, CommandDigest digest)` | 占用 runtime-scoped 幂等 key | 不开启 SDK domain UoW；通过原子写入 / 唯一键保护技术记录 | `IdempotencyReservation` | `RepositoryError::IdempotencyConflict` |
| `RuntimeIdempotencyRepository.complete(IdempotencyKey key, CommandReceiptRef receipt_ref)` | 完成 runtime 幂等记录 | boundary 返回后写技术记录；不得写 domain truth、projection 或 outbox | `()` | `RepositoryError` |
| `SdkOutboxPort.append(SdkOutboxEvent event, UnitOfWorkHandle uow)` | 写入 outbox fact | 必须与业务 truth 同事务 | `()` | `OutboxError` |
| `SdkOutboxPort.load_pending(OutboxCursor cursor, PageLimit limit)` | 读取待发布 event | 无写事务；读取 committed outbox | `OutboxEventPage` | `OutboxError` |
| `SdkOutboxPort.mark_published(SdkOutboxEventId event_id, PublishedEventRef published_ref, UnitOfWorkHandle uow)` | 标记已发布 | 单独小事务 | `()` | `OutboxError` |
| `PackageArtifactStorePort.put_artifact(PackageArtifactWrite artifact)` | 写 artifact body / metadata source | 不参与 UoW；返回 ref 后再提交 truth | `PackageArtifactRef` | `ArtifactError` |
| `PackageArtifactStorePort.verify_digest(PackageArtifactRef artifact_ref, ArtifactDigest expected_digest)` | 校验 artifact digest | 无写事务 | `DigestVerificationResult` | `ArtifactError` |
| `PackageArtifactStorePort.materialize_artifacts(PackageArtifactMaterializationInput input)` | 为 smoke / docs / boundary runner 物化 candidate artifact | runner 前置读侧操作；不写 domain truth | `PackageArtifactMaterializationResult` | `ArtifactError` |
| `SdkCapabilityProjectionPort.upsert_summary(SdkCapabilitySummaryView summary, UnitOfWorkHandle uow)` | 更新 capability projection | 写后必要 projection 与 truth 同事务 | `()` | `ProjectionError` |
| `EvidenceProjectionPort.upsert_evidence_view(EvidenceView view, UnitOfWorkHandle uow)` | 更新 evidence projection | 与 evidence 写入同事务 | `()` | `ProjectionError` |
| `CompatibilityProjectionPort.upsert_compatibility_view(CompatibilityView view, UnitOfWorkHandle uow)` | 更新 compatibility projection | 与 decision 写入同事务 | `()` | `ProjectionError` |
| `DocsExampleProjectionPort.replace_examples(Vec<DocsExampleView> examples, UnitOfWorkHandle uow)` | 替换 docs example projection | batch UoW | `()` | `ProjectionError` |

### 7.5 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `UpdateSdkSemanticBaselineFlow` | baseline lock 后 | baseline、capability projection、outbox、idempotency 完成后 | domain validation、version conflict、projection failure、outbox append failure | baseline save、capability projection upsert、outbox append、idempotency complete |
| `RefreshDerivedBindingViewFlow` | source snapshot 和 current semantic baseline / concept map 读取成功后 | derived view、language views、version refs、outbox 完成后 | snapshot derivation failure、concept map missing / mismatch、view conflict、outbox append failure | derived view save、language view save、version ref upsert、freshness event append |
| Upstream changed consumer | event 基础校验后 | version ref、stale mark、outbox、idempotency 完成后 | missing ref、duplicate conflict、repository failure | version ref upsert、affected view stale mark、outbox append、idempotency complete |
| `GeneratePackageCandidateFlow` | baseline / view fresh gate 通过后 | candidate、outbox、idempotency 完成后 | freshness gate failed、candidate duplicate、outbox failure | candidate insert、candidate generated event append、idempotency complete |
| `BuildLanguagePackagesFlow` | artifact build + digest verify 成功后 | candidate artifact metadata 保存后 | candidate version conflict、metadata save failure | candidate save、artifact metadata attach、idempotency complete |
| `RunCrossLanguageSmokeFlow` / `ValidateDocsExamplesFlow` / `VerifyBoundaryPoliciesFlow` | candidate artifact 物化成功,runner result 返回并通过 redaction / boundary 校验后 | evidence、candidate update、projection、outbox 完成后 | artifact missing / materialization failure、unredacted、failed gate where blocking、repository failure、outbox failure | evidence insert、candidate status update if allowed、projection update、outbox append |
| `ConsumeValidationRunFinishedFlow` | event 基础校验后 | evidence、candidate、projection、outbox、idempotency 完成后 | candidate missing、unredacted evidence、repository failure | evidence insert、candidate update、projection update、outbox append、idempotency complete |
| `RecordCompatibilityDecisionFlow` | candidate / evidence lookup 成功后 | decision、compatibility projection、outbox、idempotency 完成后 | missing evidence、migration ref missing、outbox failure | decision save、projection update、outbox append、idempotency complete |
| `CheckCompatibilityFlow` | compatibility runner result 返回后 | decision、projection、outbox 完成后 | runner failure、missing evidence、repository failure | decision save、projection update、outbox append |
| `DeprecateSdkApiFlow` | deprecated record lookup 成功后 | deprecated record、outbox、idempotency 完成后 | lifecycle illegal、migration missing、version conflict | deprecated record save、outbox append、idempotency complete |
| `RebuildSdkProjectionsFlow` | truth batch 读取后 | 每个 projection batch replace 后 | projection write failure | projection batch replace |
| `OutboundEventPublishFlow` | outbox pending event 读取后 | mark published 小事务 | publisher failure 不回滚 truth；mark published failure 保留可重试 | outbox published marker |
| Query read only | 不开启写事务 | 不适用 | 不适用 | 不写 truth，不写 projection |
| Runtime boundary call / publish | 不开启 SDK domain truth 写事务；write-like runtime call 可写幂等技术记录 | boundary 返回并完成幂等记录后 | formal / fake / bus boundary error 只返回 result；idempotency conflict 返回冲突 | 不写 SDK domain truth，不生成 service / bus runtime truth |

### 7.6 一致性策略表

| 一致性主题 | 策略 | 失败处理 |
|---|---|---|
| Truth + idempotency | 写路径必须在同一 UoW 内 reserve / complete idempotency 与业务结果 | 失败回滚；重复请求返回已有 receipt 或 conflict |
| Truth + outbox append | 需要传播事实的写路径必须在同一 UoW 内 append outbox | append 失败回滚 truth |
| Outbox publish | publish 在 truth commit 后执行 | publisher failure 保留 pending，后续 retry |
| Truth + required projection | 写后必须立即可查询的 projection 与 truth 同 UoW 更新 | projection failure 回滚 truth |
| Projection rebuild | batch 读取 truth 后替换 read model | batch failure 回滚该 batch，truth 不变 |
| Artifact body + truth metadata | artifact body 先写 store 并 verify digest；truth 事务只保存 ref / digest | truth failure 留下 orphan artifact，不对外可见 |
| Source snapshot + derived view | source snapshot 只作为输入；derived view 保存 ref / digest | source failure 不写本地 truth |
| Runtime boundary result | formal / fake / bus boundary result 不写 SDK truth | 返回 diagnostic ref；调用方按错误处理 |
| Compatibility gate | decision、projection、outbox 同 UoW | failed / missing evidence 不允许 candidate stable |
| Deprecated lifecycle | record version + lifecycle gate | illegal transition 返回 conflict，不写成功 event |

### 7.7 乐观锁、幂等与版本规则

#### 7.7.1 乐观锁规则

| 对象 | 版本字段 | 写入函数 | 冲突处理 |
|---|---|---|---|
| `SdkSemanticBaseline` | `version` | `SemanticBaselineRepository.save(...)` | 返回 `VersionConflict`，调用方重新读取 |
| `DerivedBindingView` | `version` | `DerivedViewRepository.save_binding_view(...)` | 返回 `VersionConflict` |
| `LanguageBindingView` | `version` | `DerivedViewRepository.save_language_view(...)` | 返回 `VersionConflict` |
| `ServiceClientView` | `version` | `ServiceClientViewRepository.save(...)` | 返回 `VersionConflict` |
| `BusEventClientView` | `version` | `EventClientViewRepository.save(...)` | 返回 `VersionConflict` |
| `PackageCandidate` | `version` | `CandidateRepository.save(...)` | 返回 `VersionConflict` |
| `DeprecatedApiRecord` | `version` | `CompatibilityRepository.save_deprecated_api(...)` | 返回 `VersionConflict` |

#### 7.7.2 幂等键规则

| 接口 / Job / Event | 幂等键 | digest 来源 | 重复请求处理 |
|---|---|---|---|
| Command API | `CommandMetadata.request.idempotency_key` | normalized command DTO | 缺失则 validation；同 key 同 digest 返回已有 receipt；不同 digest conflict |
| Inbound Event Consumer | `event_id + source_ref + idempotency_key` | event payload digest | duplicate skip / return prior result |
| Operations Job | `job_run_id + target id / scope` | job input digest | same digest replay summary；different digest conflict |
| Outbox publish | `outbox_event_id` | outbox payload digest | already published 返回 published ref |

#### 7.7.3 版本读写规则

| 场景 | 规则 |
|---|---|
| `get_for_update` | 只能在 UoW 内使用；用于即将更新的 truth |
| `get` / `list` | 只读，不锁定，不开启写事务 |
| `save(expected_version)` | expected version 必须来自本次读取对象 |
| projection query | 返回 projection version / consistency marker |
| source latest | 不改变 SDK 本地 current ref，除非进入 refresh / consume flow |

### 7.8 Outbox 与 projection 恢复规则

#### 7.8.1 Outbox 状态与恢复

| outbox 状态 | 进入条件 | 后续动作 | 失败处理 |
|---|---|---|---|
| `Pending` | truth transaction append 成功 | publisher 读取并发布 | publisher failure 保持 pending |
| `Published` | publish 成功并 `mark_published` 成功 | 不再发布 | duplicate publish 返回已有 published ref |
| `PublishFailed` | 可选实现：超过重试或 schema invalid | 人工处理或修复数据 | 不回滚 truth |

说明：

- `PublishFailed` 是 outbox 实现状态，不是 Step 6 domain enum。
- schema invalid 是设计 / 实现错误，进入 Step 12 错误模型和 reports。

#### 7.8.2 Projection 恢复

| projection | 正常更新 | 恢复方式 |
|---|---|---|
| capability projection | baseline / capability model 写入时同事务 upsert | `RebuildSdkProjections` 从 baseline 和 views 重建 |
| evidence projection | evidence 写入时同事务 upsert | 从 `verification_evidence` 重建 |
| compatibility projection | decision / deprecated 写入时同事务 upsert | 从 compatibility repository 重建 |
| docs example projection | docs validation 写入时 replace / upsert | 从 docs evidence 和 artifact refs 重建 |

恢复约束：

- projection rebuild 不得修改 truth。
- projection stale 只能通过 consistency marker 暴露，不得由 query 自动修复。
- rebuild dry run 不写 projection。

### 7.9 Artifact 一致性规则

| 场景 | 规则 |
|---|---|
| artifact 写入成功，digest verify 成功 | 可以在 candidate truth 事务中保存 `PackageArtifactRef` / `ArtifactDigest` |
| artifact 物化成功 | 只作为 runner 输入,不得写入 `LanguageArtifact`、`PackageCandidate` 或 evidence truth |
| artifact 写入成功，truth 事务失败 | artifact 成为 orphan，不出现在 candidate view；可由后续 cleanup 处理 |
| digest verify 失败 | 不保存 candidate artifact metadata；返回 validation error |
| artifact store 不可用 | build flow 返回 dependency error；candidate 状态不推进 |
| public registry publish | 不在 P0，不能反向修改 candidate `Stable` |

### 7.10 数据边界禁止事项

| 禁止事项 | 原因 |
|---|---|
| 保存 core / bus / formal API snapshot 正文为 SDK truth | SDK 只拥有派生 view 和 ref |
| 保存 service request / response body | 违反 boundary / redaction 策略 |
| 保存 raw secret / credential material | 违反 credential protection |
| Query 自动写 projection 或 refresh source | Query 必须只读 |
| Runtime boundary 调用结果写 SDK truth | SDK 不是 server gateway 或 bus runtime |
| Outbox publish 失败回滚 truth | publish 是 post-commit 外部动作 |
| Projection rebuild 改写 domain truth | projection 是 read model |
| Artifact body 被当作 candidate truth | candidate truth 只保存 ref / digest / metadata |

### 7.11 Step 11 统一复核

#### 7.11.1 Step 7 port 覆盖复核

| Port 类别 | 是否覆盖 | 说明 |
|---|---|---|
| technical port | 是 | `UnitOfWork`、`ClockPort`、`IdGeneratorPort` 在事务与版本规则中覆盖 |
| idempotency repository | 是 | §7.7.2 |
| truth repository | 是 | §7.1、§7.3、§7.4 |
| projection port | 是 | §7.3、§7.4、§7.8.2 |
| source port | 是 | §7.2、§7.6 |
| boundary port | 是 | 明确不写 SDK truth |
| runner port | 是 | runner result 进入 evidence / decision 的事务规则 |
| artifact store | 是 | §7.9 |
| outbox | 是 | §7.8.1 |

#### 7.11.2 Step 9 处理流事务复核

| 流类别 | 是否已定义事务 | 说明 |
|---|---|---|
| Command 写路径 | 是 | local truth command 同 UoW 保存 truth / projection / outbox / idempotency |
| Runtime boundary | 是 | 无本地写事务 |
| Inbound Event Consumer | 是 | 每 event 一个事务 |
| Query | 是 | 无写事务 |
| Outbound Event Publish | 是 | post-commit publish，小事务 mark published |
| Operations Job | 是 | 每 item 或每 projection batch 一个事务 |

#### 7.11.3 Step 10 状态持久化复核

| 状态 enum | 持久化位置 | 版本 / 并发要求 |
|---|---|---|
| `SnapshotFreshnessState` | derived / language / client view records | view version |
| `CapabilitySupportState` | service capability ref / service client view | service view version |
| `PackageCandidateStatus` | package candidate record | candidate version + get_for_update |
| `EvidenceResult` | verification evidence record | evidence immutable or append-only |
| `EvidenceRedactionStatus` | verification evidence record | evidence immutable or append-only |
| `CompatibilityDecisionState` | compatibility decision record | decision version / append-only decision preferred |
| `DeprecatedApiLifecycleState` | deprecated API record | expected version |

#### 7.11.4 禁止漂移复核

| 禁止漂移项 | 本 Step 固定口径 |
|---|---|
| DDL / migration 作为当前必需 | 禁止；当前只定义 logical storage contract |
| Source snapshot 成为 SDK truth | 禁止 |
| Query 修复 projection | 禁止 |
| Outbox publish 回滚 truth | 禁止 |
| Artifact body 进入 candidate truth | 禁止 |
| Runtime boundary result 写本地状态 | 禁止 |
| Projection 反写真相 | 禁止 |

---

## 8. 回填草稿

正式 `projects/L0-sdk/03-详细设计.md` 回填时，§10 应按以下方式引用本文件：

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §10.1 数据所有权实现表 | 本文件 §7.1 / §7.2 | 摘录 SDK truth、引用、artifact、projection 边界 |
| §10.2 存储对象契约 | 本文件 §7.3 | 摘录 logical storage object 表 |
| §10.3 Repository / Projection / Outbox 函数一致性 | 本文件 §7.4 | 摘录函数、锁、事务、返回和错误 |
| §10.4 事务边界 | 本文件 §7.5 | 摘录各处理流事务边界 |
| §10.5 一致性策略 | 本文件 §7.6~§7.9 | 摘录 idempotency、outbox、projection、artifact 规则 |
| §10.6 禁止事项 | 本文件 §7.10 / §7.11.4 | 摘录数据边界红线 |
| §11 错误模型 | 本文件失败场景 | 作为 Step 12 输入 |
| §12 并发、幂等与重入保护 | 本文件 §7.7 | 作为 Step 13 输入 |

回填规则：

- 正式文档不得把本文件的 logical storage object 误写为已确认 SQL migration。
- 如果后续实施选择 durable database，必须保持本文件主键、唯一键、索引和 version 语义。
- 如果 Step 12 / Step 13 发现错误恢复或幂等规则不完整，必须回到本文件补事务 / 一致性口径。

---

## 9. 待确认事项

| 待确认项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 当前是否写数据库迁移脚本 | A. 写 DDL / migration；B. 只写 logical storage contract | 推荐 B | 尚未绑定数据库，过早写迁移会限制 adapter |
| Artifact body 是否进入 truth 事务 | A. 进入；B. 不进入，只提交 ref / digest / metadata | 推荐 B | P0 不做分布式事务；orphan artifact 可清理 |
| Projection 更新是否全部异步 | A. 全部异步；B. 写后必要 projection 同事务，批量 rebuild 异步 | 推荐 B | 保证关键 query 可见性，同时允许恢复 |
| Compatibility decision 是否可原地改写 | A. 可改写；B. 建议 append-only，新 decision supersede 旧结论 | 推荐 B | 避免历史兼容结论被静默覆盖 |
| Evidence 是否可原地从 failed 改 passed | A. 可改；B. 不可，创建新 evidence | 推荐 B | 保留验证历史，避免证据污染 |

当前推荐方案已写入本 Step。若后续需要改变任一结论，必须同步 Step 7 / Step 9 / Step 10。

---

## 10. 进入下一步条件

进入 Step 12 的条件：

- 数据所有权、引用 / snapshot / projection / artifact 边界已经明确。
- 所有 repository / projection / outbox 关键函数都有锁、事务、版本和错误语义。
- 每类写路径、consumer、job、query、runtime boundary 和 outbound publish 的事务关系已经收稳。
- outbox、projection、artifact、source 和 boundary 的失败恢复口径已经足够进入错误模型。

下一步：

```text
Step 12. 定义错误模型、异常分支与恢复口径

重点问题:
1. Step 8 的 SdkProtocolError 如何映射 Step 6 / 7 / 11 的内部错误?
2. 哪些错误可重试、不可重试或需要人工介入?
3. 事务失败、version conflict、idempotency conflict、outbox publish failure、artifact orphan 如何处理?
4. 哪些异常需要写 audit、diagnostic ref、event 或 report evidence?
```
