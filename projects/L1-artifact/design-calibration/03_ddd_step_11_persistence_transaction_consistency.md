# Step 11. 持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填章节: `03-详细设计.md` §10 持久化、事务与一致性契约
> 生成日期: 2026-07-04
> 状态: 已完成

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 持久化、事务与一致性契约 |
| 当前状态 | 已完成 |
| 输入基线 | 需求、架构、概要、Step 1~10 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` |
| 停审方式 | 按 logical store、repository 函数、transaction boundary、一致性 / 恢复策略分批写入;全部完成后做跨 Step 6~10 闭环审计 |

---

## 2. 本步目标

本 Step 把 Step 6 的对象字段、Step 7 的 repository / UnitOfWork / relay / reference / result / handoff port、Step 9 的函数级事务顺序、Step 10 的状态矩阵收束成可实现的持久化与一致性契约。

实现侧必须按本 Step 保存 artifact truth、support state、local mirror snapshot、derived view、trace / audit / history / relay、handoff material、idempotency record 和 stored result。若某个 flow 需要更新已有 state,必须使用本 Step 明确的 `ArtifactRepositoryVersion` 来源;不得用 cursor、timestamp、event sequence、page token、trace id 或 hard-coded version 代替 optimistic version。

本步不定义物理数据库产品、DDL 语法、SQL index 名称、migration 文件、retry 次数、topic 名称、transport route、错误 enum 全量变体或实施 commit boundary。物理 schema 可由 infra 设计或实施计划细化,但 durable adapter 与 in-memory fake 必须保留本 Step 的主键、唯一性、索引、version、transaction 和 append-only 语义。

---

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 已完成 | 固定 L1-artifact 只拥有 artifact truth、body-free references、projection、handoff 和 local mirror,不拥有 sibling 正文 |
| `01-架构设计.md` | 已完成 | 固定数据所有权、异步传播、relay、projection、external reference snapshot、audit / handoff 边界 |
| `02-概要设计.md` | 已完成 | 提供模块、对象、状态和处理流的概要归属 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 truth object、view/report、trace/audit/history/handoff/idempotency object 字段和 factory |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 `ArtifactUnitOfWork`、repository、resolver、publisher、handoff、result store、id generator 和 versioned read 函数 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 Command / Query / Event / Job DTO、stored result surface、payload snapshot schema 和 public view/report surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command / query / consumer / publisher / job / handoff flow 的事务顺序和副作用 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 state transition、terminal state、retry / failed / stale / unavailable / handoff marker guard |
| `projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | 已读取 | 作为 Step 11 logical store、repository 语义、事务顺序和一致性审计粒度参考 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已生效 | 检查 version 来源、payload snapshot、stored result、affected view 和 append-only record 闭环 |

---

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 11.1 | 文件骨架、SOP 问题回答、数据所有权实现表、logical store 契约表 | [x] 已写入 |
| 11.2 | Repository 函数持久化语义表、version / unique key / index 规则 | [x] 已写入 |
| 11.3 | Command / consumer / relay publisher / job / handoff transaction boundary 表 | [x] 已写入 |
| 11.4 | 一致性策略、失败恢复、no-write query、no-repair job 规则 | [x] 已写入 |
| 11.5 | 前序契约回填、跨 Step 6~10 闭环审计、进入 Step 12 条件 | [x] 已写入 |

---

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据对象由本仓拥有? | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership`、intake/review/automation/consumption support objects、derived state、external resolution state、local mirror snapshot、trace/history/audit/handoff/refresh record、relay item/payload snapshot、prepared handoff material、idempotency record 和 stored result 由本仓拥有。 |
| 哪些只是引用、快照或投影? | Work/process/governance/method/runtime/external content 只能以 typed ref、safe summary ref、source version、digest、local mirror snapshot、resolution state 或 marker 保存。Summary/read/preview/report/reconciliation 是派生读模型或报告,不得反写 core truth。 |
| repository 函数如何命名,参数和返回是什么? | 函数签名以 Step 7 为准。本 Step 只补持久化语义:mutable truth / state 使用 `get_*_with_version(...) -> Versioned<T>` 和 `save(... expected_version, &uow)`;append-only record append 不使用 expected_version 但必须在 UoW 内;relay publication update 必须使用 versioned pending list 返回的 `ArtifactRepositoryVersion`。 |
| 哪些处理流需要事务,事务内必须完成哪些写入? | Command accepted path、inbound consumer accepted path、relay publication marker update、projection rebuild item、reference refresh item、reconciliation report save、handoff material save、idempotency/result completion 都需要 `ArtifactUnitOfWork`。Query 不开启写事务。 |
| 是否需要乐观锁、行锁、版本号、relay 或 projection? | 需要乐观锁和版本号。P0 不要求显式行锁或具体数据库隔离级别,但 repository 必须通过 `ArtifactRepositoryVersion` 防止 lost update。Accepted truth path 必须同事务写 change/trace/audit/relay/stored result/idempotency complete 和必要 derived stale marker。 |
| 如果 relay 发布或 projection 更新失败,如何恢复? | Relay publish 失败只更新 relay item publication state,不回滚 committed truth。Projection rebuild 失败写 `ArtifactDerivedFreshnessState::Failed` 或 `Unavailable`,query 返回 stale/degraded/unavailable surface。Reference refresh 失败写 `ArtifactExternalResolutionState::Failed` 或 job failed item,不得补造 external truth。Handoff 失败保存 failed/retryable handoff record 和 stored job report,不得保存 external body。 |

---

## 6. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否写具体 DDL | A. 直接写 SQL DDL;B. 写 logical store 契约 | 采用 B。项目尚未锁定物理数据库,但 fake / durable adapter 必须具备等价 key、index、version 和 transaction 语义。 |
| mutable truth 并发控制 | A. adapter 自行决定;B. `Versioned<T>` + `ArtifactRepositoryVersion` 统一 optimistic update | 采用 B。所有 update existing state 的路径必须有正式 version 来源。 |
| trace/history/relay record | A. 也使用 expected_version;B. append-only with generated id and UoW | 采用 B。append-only record 以 generated ref / unique key 防重复,不覆盖已有行。 |
| relay payload | A. publish 时重查 truth 构造;B. accepted transaction 保存 stored payload snapshot | 采用 B。publisher 只发布 stored snapshot,防止 truth 后续变化污染已提交事件。 |
| projection / reference failure | A. 回滚 source truth;B. 标记 stale/failed/unavailable 并异步恢复 | 采用 B。projection / reference 是派生和本地 snapshot,不得反写真相。 |
| duplicate replay | A. duplicate 重新执行 service;B. 从 stored result / receipt / report 读取 | 采用 B。same key same digest duplicate 不重跑 mutation、scan、publish 或 handoff。 |
| handoff material | A. 只返回 adapter result,不保存 marker/material;B. 保存 body-free marker/material + stored job report | 采用 B。保留可审计、可查询、可 replay 的 material,但不保存 archive/observability/sync body。 |

---

## 7. 数据所有权实现表

| 数据对象 | 拥有模块 / repository | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `ArtifactFact` | `domain` / `ArtifactFactRepository` | `EstablishArtifactFactFlow`, version publish/supersede current bind | command service, query, projection, reconciliation, handoff | mutable truth;existing update uses loaded version;fact change with relay/stored result in same UoW |
| `ArtifactContentFactContext` | `domain` / `ArtifactContentContextRepository` | fact establish, future content verification | command service, query, projection | mutable support truth;no external body;digest only as integrity marker |
| `ArtifactVersion` | `domain` / `ArtifactVersionRepository` | publish/supersede/freeze/retire flows | query, lineage, baseline, projection, handoff | mutable truth;formal version ref stable;current binding owned by fact |
| `ArtifactVersionCandidate` | `domain` / `ArtifactVersionCandidateRepository` | create candidate, future reject/supersede | publish command, audit/query | mutable support truth;must carry `submission_ref`;never public formal version |
| `ArtifactLineageLink` | `domain` / `ArtifactLineageRepository` | establish/reject/retire lineage | query, trace, projection, reconciliation | mutable truth;endpoints formal version only;basis ref only |
| `ArtifactBaseline` | `domain` / `ArtifactBaselineRepository` | create candidate, freeze, supersede, retire | query, archive/sync handoff, projection | mutable truth;candidate has no freeze context;Frozen must have review anchor |
| `ArtifactBaselineMembership` | `domain` / `ArtifactBaselineMembershipRepository` | create candidate members, freeze/remove | baseline query, archive/sync handoff | mutable support truth;frozen terminal;member version formal only |
| `ArtifactIntakeContext` | `domain` / `ArtifactIntakeContextRepository` | register intake, establish fact transfer, consumer continuation | fact establish, query/audit | mutable support truth;pending reference cannot transfer to truth |
| `ArtifactSubmissionRecord` | `domain` / `ArtifactSubmissionRepository` | register intake, future supersede/reject | candidate creation, audit | mutable/append-oriented support;accepted submission needed for version candidate |
| `ArtifactReviewAnchor` | `domain` / `ArtifactReviewAnchorRepository` | open review, assign responsibility, future close/invalidate | freeze baseline, query, projection | mutable support;review does not mutate artifact truth |
| `ArtifactResponsibilityAssignment` | `domain` / `ArtifactResponsibilityRepository` | assign/future accept/release | review query, audit | mutable support;actor ref only,no actor profile |
| `AutomationArtifactInput` | `domain` / `AutomationArtifactInputRepository` | register/accept automation input | intake/review flow, query/audit | mutable support;candidate-only;no runtime body |
| `ConsumableArtifactReference` | `domain` / `ConsumableArtifactReferenceRepository` | issue consumable, future restrict/stale/unavailable | read surface, backref, sync handoff | mutable support truth;does not create read surface body |
| `ArtifactConsumptionBackref` | `domain` / `ArtifactConsumptionBackrefRepository` | record backref, future stale/retire | read surface, trace, sync handoff | mutable support;explicit command only;query cannot write |
| `ArtifactDerivedViewState` | `domain` / `ArtifactDerivedViewStateRepository` | accepted change stale marker, rebuild/refresh job | query, job, reconciliation | mutable maintenance state;source cursor only from UoW;never truth source |
| summary/read/preview/report views | `contracts` / summary/read/preview/report repositories | rebuild/report jobs | query, search, dashboard/handoff | derived stores;may be stale/unavailable;never source of truth |
| `ExternalReferenceResolutionState` | `domain` / `ExternalReferenceResolutionStateRepository` | inbound consumer, refresh job | intake/fact guards, query, jobs | mutable local reference state;resolver outcome only,no external body |
| `ArtifactLocalMirrorSnapshot` | `application/infra` / `ArtifactLocalMirrorSnapshotRepository` | content source consumer / refresh job | reference query, guards | body-free local mirror;external body excluded |
| change records | `domain` / `ArtifactChangeRecordRepository` | accepted fact/version/lineage/baseline commands | trace/audit/query/handoff | append-only;constructed from accepted transition only |
| boundary audit records | `domain` / `ArtifactBoundaryAuditRepository` | intake/review/automation accepted paths | audit/query | append-only;does not replace support object state |
| `ArtifactTraceRecord` | `domain` / `ArtifactTraceRepository` | backref/handoff trace append | trace query, handoff, observability | append-only;query cannot repair missing trace |
| `ArtifactHandoffRecord` | `domain` / `ArtifactHandoffRecordRepository` | handoff jobs | operations query, archive/sync/observability audit | append-only;failure does not rollback truth |
| `ExternalMirrorRefreshRecord` | `domain` / `ExternalMirrorRefreshRecordRepository` | consumer/refresh job | reference query, audit | append-only;records refresh outcome only |
| relay item + payload snapshot | `application` / `ArtifactCommittedChangeRelayRepository` | accepted command/job change append, relay publication facade | relay worker | relay item mutable publication state;payload snapshot immutable;publisher does not rebuild |
| prepared handoff material | `application` / `PreparedArtifactHandoffRepository` | handoff jobs | handoff delivery / duplicate job report | body-free material;target body not owned |
| idempotency record | `application` / `ArtifactIdempotencyRepository` | command/consumer/job templates | duplicate path | operation+channel+actor+key+digest unique;complete points to stored result |
| stored operation result | `application` / `StoredArtifactResultRepository` | command accepted/rejected, consumer receipt, job report | duplicate replay, API/worker/job response | immutable replay surface;does not recompute from current truth |

---

## 8. Logical store / collection 契约表

| Logical store | Contains | Primary key | Required secondary keys / indexes | Versioning |
|---|---|---|---|---|
| `artifact_fact_store` | `ArtifactFact` | `artifact_fact_ref` | `content_context_ref`, `definition_ref`, optional `current_version_ref` | yes |
| `artifact_content_context_store` | `ArtifactContentFactContext` | `content_context_ref` | `content_source_ref` unique when formal source converges one context | yes |
| `artifact_version_store` | `ArtifactVersion` | `artifact_version_ref` | `artifact_fact_ref`, current lookup by fact through fact store | yes |
| `artifact_version_candidate_store` | `ArtifactVersionCandidate` | `artifact_version_candidate_ref` | `artifact_fact_ref`, `submission_ref` | yes |
| `artifact_lineage_store` | `artifact_lineage_link_ref` | `artifact_lineage_link_ref` | `(source_version_ref,target_version_ref,relation_kind)` unique for active lineage | yes |
| `artifact_baseline_store` | `ArtifactBaseline` | `artifact_baseline_ref` | `baseline_scope_ref`, current/frozen by scope | yes |
| `artifact_baseline_membership_store` | `ArtifactBaselineMembership` | `artifact_baseline_membership_ref` | `artifact_baseline_ref`, `(artifact_baseline_ref, artifact_version_ref)` | yes |
| `artifact_intake_store` | `ArtifactIntakeContext` | `artifact_intake_context_ref` | `source_ref` | yes |
| `artifact_submission_store` | `ArtifactSubmissionRecord` | `artifact_submission_ref` | `intake_context_ref` | yes |
| `artifact_review_store` | `ArtifactReviewAnchor` | `artifact_review_anchor_ref` | open by `truth_anchor_ref` | yes |
| `artifact_responsibility_store` | `ArtifactResponsibilityAssignment` | `artifact_responsibility_assignment_ref` | `review_anchor_ref`, `responsible_party_ref` | yes |
| `automation_input_store` | `AutomationArtifactInput` | `automation_artifact_input_ref` | `automation_source_ref`, `derived_from_ref` | yes |
| `consumable_reference_store` | `ConsumableArtifactReference` | `consumable_artifact_reference_ref` | `(truth_anchor_ref, consumer_scope_ref)`, `truth_anchor_ref` | yes |
| `consumption_backref_store` | `ArtifactConsumptionBackref` | `artifact_consumption_backref_ref` | `consumable_ref`, `consumer_ref`, `(consumer_ref, consumable_ref)` | yes |
| `artifact_summary_view_store` | fact/version/lineage/baseline/review summary views | typed view ref | source truth ref per view type | yes |
| `artifact_read_surface_store` | `ArtifactReadSurfaceView` | `artifact_read_surface_view_ref` | `consumable_ref` | yes |
| `artifact_preview_view_store` | `ArtifactPreviewView` | `artifact_preview_view_ref` | `truth_anchor_ref` | yes |
| `artifact_report_view_store` | `ArtifactReportView` | `artifact_report_view_ref` | `report_scope_ref` | yes |
| `artifact_reconciliation_report_store` | `ArtifactReconciliationReport` | `artifact_reconciliation_report_ref` | `reconciliation_scope_ref` | yes |
| `artifact_derived_state_store` | `ArtifactDerivedViewState` | `artifact_derived_view_state_ref` | `derived_view_kind` | yes |
| `external_resolution_state_store` | `ExternalReferenceResolutionState` | `external_reference_resolution_state_ref` | `(external_ref, reference_kind)`, refresh scope | yes |
| `local_mirror_snapshot_store` | `ArtifactLocalMirrorSnapshot` | `snapshot_ref` | `(external_ref, reference_kind)` latest | no overwrite by version;save append/replace by ref |
| `artifact_change_record_store` | fact/version/lineage/baseline change records | typed record ref | subject truth ref | append-only |
| `artifact_boundary_audit_store` | input/review/automation audit records | typed record ref | intake/review/automation subject ref | append-only |
| `artifact_trace_store` | `ArtifactTraceRecord` | `artifact_trace_record_ref` | `truth_anchor_ref`, `consumer_ref` | append-only |
| `artifact_handoff_record_store` | `ArtifactHandoffRecord` | `artifact_handoff_record_ref` | `(truth_anchor_ref, channel_ref)`, `channel_ref` | append-only |
| `external_refresh_record_store` | `ExternalMirrorRefreshRecord` | `external_mirror_refresh_record_ref` | `external_ref` | append-only |
| `artifact_relay_store` | pending relay item and publication state | `artifact_relay_item_ref` | publication state, payload snapshot ref | yes for publication marker |
| `artifact_relay_payload_snapshot_store` | `ArtifactRelayPayloadSnapshot` | `payload_snapshot_ref` | event kind, core trace id | immutable |
| `prepared_handoff_store` | `PreparedArtifactHandoffMaterial` | `handoff_record_ref` | target ref, material kind | immutable per handoff record |
| `artifact_idempotency_store` | idempotency reservation/completion | idempotency ref | `(operation_name, channel_kind, actor_ref, idempotency_key)`, digest | yes or atomic compare |
| `stored_artifact_result_store` | command result/rejection, inbound receipt, job report | `result_ref` | operation name, surface ref | immutable |

---

## 9. Repository 函数持久化语义

本节把 Step 7 的 repository 函数映射到 logical store、version 来源和事务语义。函数签名仍以 Step 7 为准;本节不新增 callable surface,只固定实现方必须满足的持久化行为。

### 9.1 mutable truth / support repository 语义

| Repository | Read surface | Save surface | Create expected_version | Update expected_version | 关键唯一性 / 冲突语义 |
|---|---|---|---|---|---|
| `ArtifactFactRepository` | `get_with_version`, `find_by_content_context`, `list_by_definition` | `save(fact, expected_version, uow)` | `None` only for new `artifact_fact_ref` | loaded `Versioned<ArtifactFact>.version` | `artifact_fact_ref` unique;`content_context_ref` cannot silently map to multiple active facts |
| `ArtifactContentContextRepository` | `get_with_version`, `find_by_source` | `save(context, expected_version, uow)` | `None` for first context | loaded context version | configured source uniqueness is enforced by repository;duplicate source is not a merge |
| `ArtifactVersionRepository` | `get_with_version`, `find_current_by_fact`, `list_by_fact` | `save(version, expected_version, uow)` | `None` for new formal version | loaded version version | current binding is controlled by `ArtifactFact.current_version_ref`,not by reinterpreting page order |
| `ArtifactVersionCandidateRepository` | `get_with_version`, `list_by_fact` | `save(candidate, expected_version, uow)` | `None` for new candidate | loaded candidate version | candidate identity stable;publish updates loaded candidate only |
| `ArtifactLineageRepository` | `get_with_version`, `find_by_endpoints`, `list_by_version` | `save(link, expected_version, uow)` | `None` for new link | loaded link version | `(source_version_ref,target_version_ref,relation_kind)` active uniqueness prevents duplicate established relation |
| `ArtifactBaselineRepository` | `get_with_version`, `find_current_by_scope`, `list_by_scope` | `save(baseline, expected_version, uow)` | `None` for candidate baseline | loaded baseline version | one current/frozen baseline per scope is repository-enforced when formal policy requires current lookup |
| `ArtifactBaselineMembershipRepository` | `get_with_version`, `list_by_baseline` | `save(membership, expected_version, uow)` | `None` for selected member | loaded membership version | `(artifact_baseline_ref, artifact_version_ref)` uniqueness prevents duplicate member rows |
| `ArtifactIntakeContextRepository` | `get_with_version`, `find_by_source` | `save(intake_context, expected_version, uow)` | `None` for registered intake | loaded intake version | same source conflict is explicit rejection or idempotent replay,not silent reuse |
| `ArtifactSubmissionRepository` | `get_with_version`, `list_by_intake_context` | `save(submission, expected_version, uow)` | `None` for new submission | loaded submission version | accepted submission is required by candidate flow;list order is not a state machine |
| `ArtifactReviewAnchorRepository` | `get_with_version`, `find_open_by_truth_anchor` | `save(review_anchor, expected_version, uow)` | `None` for new review | loaded review version | open review uniqueness by truth anchor is repository-enforced |
| `ArtifactResponsibilityRepository` | `get_with_version`, `list_by_review_anchor`, `list_by_actor` | `save(assignment, expected_version, uow)` | `None` for new assignment | loaded assignment version | actor list is query/index support;it does not authorize hidden actor profile reads |
| `AutomationArtifactInputRepository` | `get_with_version`, `list_by_source` | `save(input, expected_version, uow)` | `None` for new input | loaded input version | automation input remains candidate/support state;accepted automation does not create fact/version truth |
| `ConsumableArtifactReferenceRepository` | `get_with_version`, `find_by_truth_anchor_and_scope`, `list_by_truth_anchor` | `save(reference, expected_version, uow)` | `None` for issued consumable ref | loaded reference version | `(truth_anchor_ref, consumer_scope_ref)` uniqueness prevents duplicate read handle |
| `ArtifactConsumptionBackrefRepository` | `get_with_version`, `list_by_consumable`, `list_by_consumer` | `save(backref, expected_version, uow)` | `None` for new backref | loaded backref version | backref creation is explicit command only;query cannot insert missing backref |

Mutable repository rules:

- `expected_version = None` is legal only for new identity creation inside the UoW that owns that create.
- Updating an existing row requires the `ArtifactRepositoryVersion` returned by a same-flow versioned read/list item.
- A list page item version may be used only to update that exact item;it cannot update sibling rows from the same page.
- A repository conflict maps to Step 12 version/conflict taxonomy;service must not retry by overwriting current state.
- Domain methods may mutate in-memory objects, but repository save is the only durable transition point.

### 9.2 append-only record repository 语义

| Repository | Append surface | Store | Version rule | Duplicate guard |
|---|---|---|---|---|
| `ArtifactChangeRecordRepository.append_fact_change` | fact accepted transition record | `artifact_change_record_store` | append-only;no expected version | generated record ref unique |
| `ArtifactChangeRecordRepository.append_version_change` | version publish/supersede record | `artifact_change_record_store` | append-only;no expected version | generated record ref unique |
| `ArtifactChangeRecordRepository.append_lineage_change` | lineage establish/reject record | `artifact_change_record_store` | append-only;no expected version | generated record ref unique |
| `ArtifactChangeRecordRepository.append_baseline_change` | baseline freeze/supersede record | `artifact_change_record_store` | append-only;no expected version | generated record ref unique |
| `ArtifactBoundaryAuditRepository.append_input_resolution` | intake/source resolution audit | `artifact_boundary_audit_store` | append-only | generated audit ref unique |
| `ArtifactBoundaryAuditRepository.append_review_trace` | review open/responsibility audit | `artifact_boundary_audit_store` | append-only | generated review trace ref unique |
| `ArtifactBoundaryAuditRepository.append_automation_audit` | automation intake audit | `artifact_boundary_audit_store` | append-only | generated automation audit ref unique |
| `ArtifactTraceRepository.append` | traceability record | `artifact_trace_store` | append-only | generated trace ref unique |
| `ArtifactHandoffRecordRepository.append` | handoff outcome record | `artifact_handoff_record_store` | append-only | generated handoff record ref unique |
| `ExternalMirrorRefreshRecordRepository.append` | reference/mirror refresh outcome | `external_refresh_record_store` | append-only | generated refresh record ref unique |

Append-only rules:

- Append-only records are never updated in place. A later status or correction requires a new formal record or a mutable marker already defined by Step 6 / Step 7.
- Append operations must be inside an `ArtifactUnitOfWork` when they belong to an accepted command, consumer, job or handoff path.
- Append record fields must come from the accepted transition, resolver outcome, handoff outcome or loaded snapshot;they must not be reconstructed from current truth later.
- Query may list append-only records, but may not append trace/audit/history to explain a missing row.

### 9.3 projection / read model repository 语义

| Repository | Lookup / list surface | Save surface | Version source | Degraded behavior |
|---|---|---|---|---|
| `ArtifactSummaryViewRepository` | `get_*_with_version`, `find_*`, `search_fact_summaries` | `save_*_summary(view, expected_version, uow)` | view read/list version;`None` for first materialization | query returns missing/degraded summary surface;query does not rebuild |
| `ArtifactReadSurfaceRepository` | `get_with_version`, `find_by_consumable` | `save(view, expected_version, uow)` | read surface version | missing view maps to degraded read surface branch |
| `ArtifactPreviewViewRepository` | `find_by_truth_anchor` | `save(view, expected_version, uow)` | preview view version | missing preview maps to degraded preview branch |
| `ArtifactReportViewRepository` | `find_by_scope` | `save(view, expected_version, uow)` | report view version | missing report maps to report not-ready/degraded branch |
| `ArtifactReconciliationReportRepository` | `find_by_scope` | `save(report, expected_version, uow)` | prior report version | missing report is not repaired by query |
| `ArtifactDerivedViewStateRepository` | `get_with_version`, `find_by_kind` | `save(state, expected_version, uow)` | derived state version | stale/failed/unavailable is surfaced to query and job report |

Projection rules:

- Projection rows and derived state are replaceable materialized views, not truth.
- Rebuild success must save view body and `ArtifactDerivedViewState` in the same UoW when both are changed by one item.
- Stale markers created by command/consumer paths must be committed before stored result completion.
- If affected view lookup cannot identify a formal view/state ref, the accepted path must fail or return the Step 12 classified issue;it must not synthesize view refs from strings.
- Search/list indexes are projection stores. They cannot be used to decide truth state transitions.

### 9.4 reference / mirror repository 语义

| Repository | Read surface | Save surface | Version source | Ownership rule |
|---|---|---|---|---|
| `ExternalReferenceResolutionStateRepository` | `get_with_version`, `find_by_external_ref_and_kind`, `list_by_refresh_scope` | `save(state, expected_version, uow)` | state read/list version;`None` for first sighting | stores local resolution state only,no sibling truth |
| `ArtifactLocalMirrorSnapshotRepository` | `get`, `find_latest_by_external_ref` | `save(snapshot, uow)` | snapshot immutable by ref;latest lookup is read-only | body-free local mirror only;external content body excluded |
| `ExternalMirrorRefreshRecordRepository` | `list_by_external_ref` | `append(record, uow)` | append-only | records refresh attempt/outcome;does not replace resolution state |

Reference rules:

- Resolver `ApplicationError` is transport/application failure;business unresolved/failed outcomes must come from `ArtifactReferenceRefreshResolution`.
- `assign_reference_cursor()` may be called only after reference state, mirror snapshot or refresh record writes are staged in the UoW.
- Reference state may mark derived views stale;it must not create `ArtifactFact`, `ArtifactVersion`, `ArtifactBaseline` or sibling truth objects.
- Mirror snapshots store refs, summary refs, digest and source version only.

### 9.5 relay / handoff / idempotency / stored result repository 语义

| Repository | Write surface | Read / replay surface | Version source | Consistency rule |
|---|---|---|---|---|
| `ArtifactCommittedChangeRelayRepository.append` | save pending relay item + stored payload snapshot | `list_pending_with_payload`, `get_payload_snapshot` | append no expected version | accepted change cannot commit without payload snapshot |
| `ArtifactCommittedChangeRelayRepository.mark_*` | update publication state | pending list item | pending item version | publish marker update never reloads current truth |
| `PreparedArtifactHandoffRepository.save` | save body-free material keyed by handoff record | `get(handoff_record_ref)` | immutable per handoff record | delivery consumes material;does not rebuild package from truth |
| `ArtifactIdempotencyRepository.reserve` | reserve operation key+digest | duplicate returns stored result ref | atomic reservation token / version | duplicate does not mutate truth,reference,relay or handoff |
| `ArtifactIdempotencyRepository.complete` | bind result ref | duplicate replay | reserved idempotency ref | result must already exist |
| `StoredArtifactResultRepository.save` | immutable result envelope | typed `get_*` replay | append/immutable | duplicate replay returns stored surface only |

Idempotency/result rules:

- `ArtifactIdempotencyRepository.reserve(...)` must be inside the UoW that owns the operation, before domain mutation.
- Same key same digest duplicate rolls back the active UoW and reads stored result by `result_ref`.
- Same key different digest returns conflict;it must not continue mutation with the same key.
- Stored result must be saved before `complete(...)`.
- After `complete(...)`, the flow must not perform additional business writes in that UoW.

### 9.6 repository semantic stop-review

| 检查项 | 结论 | 依据 |
|---|---|---|
| mutable truth update 是否全部有 version 来源 | pass | §9.1 固定 versioned read/list item 来源 |
| append-only 记录是否避免覆盖 | pass | §9.2 固定 append-only rule |
| projection / report 是否不反写真相 | pass | §9.3 固定 materialized view rule |
| reference / mirror 是否 body-free | pass | §9.4 固定 local snapshot ownership |
| relay payload snapshot 是否 durable | pass | §9.5 固定 append same-UoW rule |
| duplicate replay 是否闭合 | pass | §9.5 固定 stored result before complete |

---

## 10. Version / cursor / identity 规则

### 10.1 `ArtifactRepositoryVersion` 来源规则

| 场景 | 合法来源 | 禁止来源 |
|---|---|---|
| update existing truth/support row | `get_with_version(...)` 或 `find_*` 返回的 `Versioned<T>.version` | timestamp、page cursor、truth cursor、id string、request digest |
| update list page item | `Page<Versioned<T>>.items[i].version` | page `next_cursor`、list filter、row order |
| update projection/view/report | matching view/report/state versioned lookup | source truth version、source cursor、query page token |
| update reference state | state versioned lookup/list item | external source version、mirror snapshot ref、resolver checked_at |
| update relay publication state | `list_pending_with_payload(...)` 返回的 pending item version | relay payload snapshot ref、publication ref、transport receipt |
| create new row | `expected_version = None` | hard-coded zero version or fake initial version |

`ArtifactRepositoryVersion` is a repository compare token. It does not encode business freshness, event ordering or visibility. It must not be serialized into public API response unless Step 8 names such a field.

### 10.2 `ArtifactTruthCursor` / `ArtifactReferenceCursor` 规则

| Cursor | Produced by | Legal uses | Illegal uses |
|---|---|---|---|
| `ArtifactTruthCursor` | `ArtifactUnitOfWork.assign_truth_cursor()` | committed truth change, change record, relay payload snapshot, derived stale marker | repository optimistic update, idempotency digest, page resume |
| reference cursor through `assign_reference_cursor()` | `ArtifactUnitOfWork.assign_reference_cursor()` | reference state change, mirror refresh record, derived stale marker from reference change | truth event cursor, external source version, relay publication version |
| `ArtifactRepositoryCursor` | repository page/list functions | pagination only | version, truth ordering, source freshness, idempotency |

Cursor assignment rules:

- `assign_truth_cursor()` may run only after truth/support mutations and required append records are staged.
- `assign_reference_cursor()` may run only after reference/mirror mutations and refresh records are staged.
- Cursor generation inside a rolled-back UoW produces no durable cursor.
- A query may display a stored cursor, but cannot allocate a new cursor.

### 10.3 identity / unique key rules

| Identity family | Generator / source | Stability rule |
|---|---|---|
| truth refs | `IdGeneratorPort` current Step 7 functions | generated once,never recomputed from content/source strings |
| candidate/support refs | `IdGeneratorPort` or request-provided formal ref when Step 8 defines it | request body cannot override generated ref unless protocol says so |
| view refs | projection assembler / repository lookup | query cannot build view refs from truth ref strings |
| relay item / payload refs | `IdGeneratorPort.new_artifact_relay_item_ref` and `new_artifact_relay_payload_snapshot_ref` | payload ref remains immutable after append |
| handoff record refs | `IdGeneratorPort.new_artifact_handoff_record_ref` | material is keyed by formal handoff record ref |
| idempotency ref | idempotency repository reservation | client idempotency key is not the row ref |
| result ref | stored result repository / id generator | immutable replay anchor |

Identity rules:

- Ref newtypes are opaque. Adapter, service and tests must not parse embedded strings to infer kind, owner, state or source.
- A unique secondary key may reject duplicates, but it may not silently merge two requests.
- Duplicate command semantics belong to idempotency;truth uniqueness conflict without matching idempotency is a formal rejection/error branch.

---

## 11. Transaction boundary matrix

| Flow family | Opens write UoW | External call inside UoW? | Same-UoW writes | Commit point | Rollback effect |
|---|---|---|---|---|---|
| accepted command | yes | resolver calls only when Step 9 flow explicitly places them before/staged mutation;publisher/delivery no | idempotency reserve, truth/support save, append records, relay item+payload, stale marker, stored result, idempotency complete | after result complete | no truth,records,relay,result,idempotency completion visible |
| command rejection after reserve | yes | resolver may have been called before rejection | stored rejection result, idempotency complete or conflict marker | after rejection result complete | no rejection replay unless committed |
| duplicate command | begin then rollback | no | none after duplicate detected | no write commit | returns stored result from prior completed operation |
| public query | no write UoW | no resolver/publisher/delivery | none | none | not applicable |
| inbound consumer accepted | yes | resolver may be called before final save branch | idempotency reserve, reference state, mirror snapshot, refresh record, stale marker, stored receipt, idempotency complete | after receipt complete | no reference/mirror/result visible |
| relay publisher marker update | yes per item or batch marker | publish call outside UoW before marker update | publication state marker only | after marker update | original accepted truth remains committed |
| rebuild derived views job | yes per job or item | no external publisher/delivery | idempotency reserve, view body, derived state, optional relay, job report, idempotency complete | after job report complete | source truth unchanged |
| refresh reference job | yes per job or item | resolver call may occur before save branch | reference state, mirror snapshot, refresh record, stale marker, job report, idempotency complete | after job report complete | source truth unchanged |
| reconciliation job | yes | no | reconciliation report, derived state if named, job report, idempotency complete | after report/result complete | no repair side effect |
| handoff preparation job | yes | delivery may occur before final record only if Step 9 flow requires delivery outcome | handoff record, prepared material, optional trace/relay, job report, idempotency complete | after report complete | truth unchanged;no material visible |

Transaction boundary red lines:

- No long-running transaction may span relay publish loops across unrelated items if adapter cannot preserve per-item marker correctness.
- External publish/delivery failure must not roll back the accepted truth transaction that created the work item.
- Stored result completion is the last business write in command/consumer/job flows.
- Query handlers may use read transactions if infra needs them, but they must expose no write-capable UoW to service code.

---

## 12. Command transaction ordering

### 12.1 accepted command ordering

```text
validate protocol DTO and operation context
begin ArtifactUnitOfWork
reserve idempotency(context, request_digest)
  Duplicate -> rollback UoW, read StoredArtifactResultRepository by result_ref, return replay
  Conflict -> save/return conflict branch according to Step 12
load required truth/support/reference rows with versions
run domain policy and transition methods
save new/updated truth/support rows with expected versions
append change/audit/trace records required by flow
assign_truth_cursor()
mark affected derived view state stale when flow names affected views
build ArtifactCommittedChange and stored ArtifactRelayPayloadSnapshot when flow emits outbound change
append relay item + payload snapshot
save StoredArtifactOperationResult::CommandResult
complete idempotency(idempotency_ref, result_ref)
commit UoW
return command outcome from stored surface fields
```

Accepted command invariants:

| Invariant | Reason |
|---|---|
| idempotency reserve before mutation | duplicate/conflict cannot create partial truth |
| truth/support save before change record / relay | records describe actual accepted transition |
| append record before stored result complete | duplicate replay must imply durable audit trail when flow requires one |
| relay payload snapshot before stored result complete | accepted outcome cannot lose outbound work |
| stale marker before stored result complete | query freshness reflects committed change |
| stored result before idempotency complete | duplicate replay cannot point to missing result |
| no business writes after idempotency complete | completed idempotency declares operation durable |

### 12.2 command rejection after reserve

If a command reserves idempotency but is rejected by formal resolver, reference state, visibility, domain policy or state guard before accepted truth save, it must use this ordering:

```text
begin ArtifactUnitOfWork
reserve idempotency(context, request_digest)
  Duplicate -> rollback and replay stored result/rejection
load minimal refs needed for rejection reason
save StoredArtifactOperationResult::CommandRejection
complete idempotency(idempotency_ref, rejected_result_ref)
commit UoW
return rejected outcome
```

Rejected command rules:

- No truth cursor is assigned.
- No relay item is appended unless a future flow explicitly defines rejection event.
- No derived view stale marker is written for rejected command.
- Rejection envelope must carry formal rejection code and redacted issue refs according to Step 12.

---

## 13. Inbound consumer transaction ordering

```text
validate inbound envelope, event kind and schema version
begin ArtifactUnitOfWork
reserve idempotency(consumer operation context, event digest)
  Duplicate -> rollback UoW, read stored inbound receipt, return replay
resolve external reference if Step 9 flow requires resolver
load existing ExternalReferenceResolutionState with version when present
save resolution state with expected version or create new state
save body-free mirror snapshot when resolver returned one
append ExternalMirrorRefreshRecord
assign_reference_cursor()
mark affected derived state stale when formally identified
save StoredArtifactOperationResult::InboundReceipt
complete idempotency
commit UoW
return public receipt envelope
```

Consumer write rules:

| Area | Allowed | Forbidden |
|---|---|---|
| reference | save local `ExternalReferenceResolutionState` | creating sibling truth or storing sibling body |
| mirror | save body-free `ArtifactLocalMirrorSnapshot` | storing external content body |
| derived | mark existing derived state stale when affected view is formal | rebuild view body inline unless Step 9 job flow is invoked |
| trace/audit | append only when Step 9 consumer flow names it | invent trace for missing truth |
| result | stored inbound receipt envelope | returning duplicate by recomputing current state |

Consumer consistency notes:

- Unsupported schema may return rejected/unsupported receipt without reference mutation if Step 12 maps it before reserve.
- Unresolved resolver outcome may still save resolution state and refresh record;this is not an application exception.
- `ApplicationError` from resolver does not authorize storing arbitrary failure reason text as domain state until Step 12 maps it.

---

## 14. Relay publication transaction ordering

Relay publication separates external publish from the original accepted truth transaction.

```text
worker calls ArtifactRelayPublicationService.publish_pending_artifact_relays(page)
pending_page = ArtifactCommittedChangeRelayRepository.list_pending_with_payload(page)
for each Versioned<ArtifactPendingRelayItem>
  snapshot = ArtifactCommittedChangeRelayRepository.get_payload_snapshot(item.payload_snapshot_ref)
  if snapshot missing:
    begin UoW
    mark_failed or mark_retryable with pending item version
    commit UoW
    continue
  outcome = ArtifactRelayPublisherPort.publish(item, snapshot)
  begin UoW
  Published -> mark_published(relay_item_ref, publication_ref, pending_version)
  Retryable -> mark_retryable(relay_item_ref, reason, pending_version)
  Failed -> mark_failed(relay_item_ref, reason, pending_version)
  commit UoW
return batch result
```

Relay publication rules:

- The publish call receives only `ArtifactPendingRelayItem` and `ArtifactRelayPayloadSnapshot`.
- The original accepted truth UoW is already committed and is never reopened.
- Missing payload snapshot is a consistency failure branch;publisher must not rebuild from truth.
- Optimistic conflict on marker update means another worker changed the item;the current worker records item-level conflict according to Step 12 / Step 13 and moves on.
- Relay publication does not use command/job idempotency or stored result replay.

---

## 15. Operations job / handoff transaction ordering

### 15.1 operations job write matrix

| Job flow | Reads | Writes | Forbidden writes |
|---|---|---|---|
| `RebuildArtifactDerivedViewsFlow` | truth snapshot, existing view/state, reference snapshots when required | view body, summary/read/preview/report view, derived state, optional relay, stored job report | fact/version/lineage/baseline/intake/review/consumption truth |
| `RefreshExternalReferenceStatesFlow` | reference state list, resolver outcome, mirror snapshot lookup | reference state, mirror snapshot, refresh record, stale marker, stored job report | core truth, command result, external body |
| `RunArtifactReconciliationFlow` | truth snapshot, projection/reference/relay state | reconciliation report, derived/report state, stored job report | automatic truth/projection/relay repair outside named report writes |
| `PrepareArtifactArchiveHandoffFlow` | baseline/report/trace snapshot, target config | handoff record, prepared archive material, optional delivery outcome, stored job report | archive body, truth mutation |
| `PrepareArtifactObservabilityHandoffFlow` | trace/review/truth refs, target config | handoff record, prepared observability material, optional trace/relay, stored job report | observability backend body, truth mutation |
| `PrepareArtifactSyncHandoffFlow` | consumable/read surface/trace snapshot, target config | handoff record, prepared sync material, optional delivery outcome, stored job report | sync target body, truth mutation |

### 15.2 job ordering template

```text
validate job request and operation context
begin ArtifactUnitOfWork
reserve idempotency(job context, request_digest)
  Duplicate -> rollback, read stored job report, return replay
load page/snapshot/target state
for each item selected by current job page
  load versioned mutable state when updating existing item
  apply only job-allowed mutation
  save changed view/state/report/handoff/material with expected versions where applicable
  append relay only when Step 9 names committed change variant
save StoredArtifactOperationResult::JobReport
complete idempotency
commit UoW
return job report
```

Job consistency notes:

- P0 permits one UoW for the job page or one UoW per item plus final report only if the report exactly reflects committed item outcomes. Step 13 will refine retry semantics.
- Duplicate job returns stored report;it does not rescan, republish, rebuild, refresh or prepare handoff material.
- Fatal pre-validation before idempotency reserve may return rejected job response according to Step 12.
- Jobs cannot repair missing truth;they may produce failed item refs, stale states or reconciliation findings.

### 15.3 handoff preparation / delivery notes

| Handoff flow | Material source | Delivery source | Failure persistence |
|---|---|---|---|
| archive | baseline refs, report refs, trace refs from snapshot/repositories | `PreparedArtifactArchiveHandoff` | handoff record + job report |
| observability | truth anchor refs, trace refs, review anchors | `PreparedArtifactObservabilityHandoff` | handoff record + job report |
| sync | consumable refs, read surface refs, trace refs | `PreparedArtifactSyncHandoff` | handoff record + job report |

Handoff material must be body-free. A failed handoff does not delete prepared material, change artifact truth or mutate external target state inside artifact persistence.

---

## 16. Query no-write boundary

| Query family | Reads allowed | Writes forbidden | Missing / degraded behavior |
|---|---|---|---|
| core truth queries | fact/version/lineage/baseline/review/responsibility repositories, summary views | trace append, audit append, relay append, projection rebuild | not found or degraded summary surface |
| consumption/read surface queries | consumable ref, read surface, backref, trace list, visibility source | issue consumable, record backref, rebuild read surface | not-visible, stale, degraded or empty page |
| trace queries | trace repository, handoff record repository | create missing trace, repair audit | empty trace page or degraded traceability surface |
| search queries | summary/search projection, derived state | rebuild search facts, refresh reference | stale/degraded marker |
| preview/report/reconciliation queries | preview/report/reconciliation stores, derived state | run report/reconciliation job | report missing/not-ready/degraded |
| external reference queries | resolution state, mirror snapshot, refresh records | call resolver, save refresh state | unresolved/failed/degraded surface |

Query rules:

- Query may read `Versioned<T>` but must not pass those versions into writes.
- Visibility denial must return the Step 8/12 visibility result surface, not a generic repository failure.
- Query must not reserve idempotency, save stored result, append relay or allocate truth/reference cursor.
- Empty page is a valid response when the selected repository page is empty;it does not justify hidden pre-list scanning.

---

## 17. 一致性策略与 failure recovery

### 17.1 consistency strategy table

| Data / side effect | Consistency strategy | Success condition | Failure / recovery |
|---|---|---|---|
| core artifact truth | local strong consistency inside UoW | truth save committed with expected version and stored result | rollback command UoW;no partial truth visible |
| support truth / boundary state | local strong consistency inside UoW | support save committed with expected version | rollback and return classified rejection/error |
| change/audit/trace records | same-UoW append with accepted transition | append rows visible before stored result complete | accepted path fails before commit |
| relay item + payload snapshot | same-UoW durable capture | item and snapshot committed together | command/job rollback if append fails |
| relay publication marker | eventual consistency by worker | marker updated with pending item version | retry/conflict/failure state;truth unchanged |
| projection stale marker | same-UoW with source change | affected state marked stale before result complete | accepted path fails if marker required but cannot be saved |
| projection rebuild | eventual consistency by job | view body and state saved atomically for item | state failed/unavailable or job failed item |
| reference refresh | eventual consistency by consumer/job | state/snapshot/refresh record committed with reference cursor | delayed/failed state and stored receipt/report |
| reconciliation report | eventual report generation | report saved and job result points to it | failed report/job item;no truth repair |
| handoff material / record | eventual handoff preparation/delivery | material/record/report committed | failed/retryable record/report;truth unchanged |
| idempotency / stored result | local strong consistency with operation | stored result saved before idempotency complete | completed-with-missing-result is internal consistency failure |

### 17.2 failure recovery table

| Failure | Detected at | Persisted signal | Recovery path | Forbidden recovery |
|---|---|---|---|---|
| optimistic version conflict | repository save / marker update | Step 12 conflict error or failed item | reload and retry through formal operation | overwrite row without version |
| same key same digest duplicate | idempotency reserve | duplicate reservation with result ref | replay stored result | rerun mutation/job/publish |
| same key different digest | idempotency reserve | conflict reservation/rejection | return duplicate conflict | continue with same key |
| completed idempotency missing result | duplicate replay | internal consistency issue | fail fast and operator repair path from Step 12/13 | rebuild result from current truth |
| relay payload snapshot missing | relay publisher | relay failed/retryable marker | operator repair or formal re-enqueue if Step 13 allows | rebuild payload from truth/projection |
| relay marker version conflict | relay marker update | item skipped/conflict in batch result | next scan reloads item | force update by item ref only |
| projection source truth missing | rebuild job | failed/unavailable state or job failed item | rerun after source restored | create artificial truth |
| projection view save conflict | projection repository | job failed item | reload and retry item | blind replace |
| resolver unresolved outcome | resolver result | unresolved/waiting state and receipt/report | later consumer/job refresh | treat as application exception |
| resolver application failure | resolver call | failed item or transient error per Step 12 | retry according to Step 13 | write untyped error text as domain state |
| handoff target disabled | config/adapter registry | failed job report or handoff record when accepted | enable target and rerun formal job | call disabled adapter |
| handoff delivery failure | delivery port outcome | failed/retryable handoff record and job report | formal retry job | mutate truth or delete material |
| query projection missing | query lookup | degraded/missing surface | run maintenance job separately | rebuild inside query |

### 17.3 cross-store consistency invariants

| Invariant | Enforced by | Consequence if broken |
|---|---|---|
| accepted command result implies durable truth/support writes | UoW ordering §12 | duplicate replay would lie about durable state |
| accepted truth change implies change/audit/relay/stale writes when flow requires them | same-UoW append/stale rules | audit gap or lost outbound event |
| relay item implies stored payload snapshot | relay append repository | publisher cannot legally publish |
| derived view source cursor never exceeds committed truth/reference cursor | UoW cursor assignment | query freshness lies |
| idempotency complete implies stored result exists | result-before-complete ordering | duplicate cannot replay |
| handoff material keyed by handoff record exists for prepared report | handoff save ordering | delivery duplicate cannot load material |
| reference state resolved with snapshot ref implies body-free snapshot exists | reference save ordering | query shows resolved state without local mirror |
| append-only record ref is immutable | append-only repository rule | audit/history loses evidentiary value |

---

## 18. Logical persistence schema notes and anti-patterns

### 18.1 relay payload snapshot schema

`ArtifactRelayPayloadSnapshot` is a stored outbound event shell captured during the accepted transaction. Its serialized payload is built from Step 8 outbound DTO fields and the committed change source.

| Field | Source | Persistence rule |
|---|---|---|
| `payload_snapshot_ref` | id generator | primary key;immutable |
| `event_kind` | `ArtifactCommittedChange` variant | finite enum from Step 7 |
| `schema_version` | outbound payload builder / Step 8 protocol | stored with payload |
| `serialized_payload` | Step 8 event DTO serialization | immutable bytes or equivalent typed stored shell |
| `core_trace_id` | operation context / trace source | searchable audit correlation |

Replay rule: publisher publishes exactly the stored payload snapshot plus envelope metadata. It never recomputes event body from current truth.

### 18.2 projection lookup / dependency schema

Artifact may implement projection lookup as dedicated columns or dependency rows. Either way, it must support these formal lookups from Step 7 / Step 9:

| Lookup need | Required stable source |
|---|---|
| fact summary by fact | `artifact_fact_ref` index on fact summary view |
| version summary by version | `artifact_version_ref` index on version summary view |
| lineage summary by version | relation index that maps version ref to lineage summary |
| baseline summary by baseline | `artifact_baseline_ref` index |
| review summary by anchor | `review_anchor_ref` index |
| read surface by consumable | `consumable_ref` index |
| preview by truth anchor | `truth_anchor_ref` index |
| report by scope | `report_scope_ref` index |
| reconciliation by scope | `reconciliation_scope_ref` index |
| derived state by kind | `derived_view_kind` index |

No flow may derive a view ref by concatenating strings. Missing lookup rows map to formal missing/degraded surface or failed maintenance item.

### 18.3 stored result schema

| Field | Source | Rule |
|---|---|---|
| `result_ref` | stored result repository / id generator | primary key |
| `operation_name` | operation context | must match idempotency operation |
| `surface_ref` | stored result surface builder | public replay anchor |
| result kind | enum variant `CommandResult`, `CommandRejection`, `InboundReceipt`, `JobReport` | typed getters must reject mismatched kind |
| created time | clock port | audit metadata only,not version |
| payload fields | Step 8 command/receipt/job surface | immutable after save |

Stored result anti-corruption rule: duplicate replay uses typed getter matching operation family. If kind mismatches, this is an internal consistency error, not a reason to recompute.

### 18.4 handoff material schema

| Handoff kind | Required refs | Body ownership rule |
|---|---|---|
| archive | handoff record ref, target ref, baseline refs, report refs, trace refs | archive body external;artifact stores refs only |
| observability | handoff record ref, target ref, truth anchor refs, trace refs, review anchor refs | observability payload external;artifact stores refs only |
| sync | handoff record ref, target ref, consumable refs, read surface refs, trace refs | sync body external;artifact stores refs only |

Handoff material may be read by delivery adapter and duplicate job report. It must not become a second truth store for artifact content.

### 18.5 consistency anti-patterns

| Anti-pattern | Risk | Required approach |
|---|---|---|
| publish by loading current truth | event payload changes after accepted transition | publish stored payload snapshot |
| update row without expected version | lost update | use versioned read/list version |
| use cursor as optimistic version | false conflict or missed conflict | cursor for ordering/freshness only |
| query repairs projection/reference/trace | hidden mutation | return degraded/stale/not-ready surface |
| duplicate job reruns scan | duplicate side effects | replay stored job report |
| handoff delivery rebuilds package from truth | delivery payload drifts | consume prepared material |
| create view refs by string templates | projection identity drift | use repository lookup/resolver |
| persist external body in mirror snapshot | data ownership breach | store body-free refs, summary refs, digest |
| save idempotency complete before result | duplicate points to missing result | save result first |
| append audit later after accepted truth commit | audit gap window | append in same UoW |

---

## 19. 前序契约回填

| Formal section target | 回填内容 | Source |
|---|---|---|
| `03-详细设计.md` §5 application port | `ArtifactRepositoryVersion` 只能来自 versioned read/list;`ArtifactUnitOfWork` 是 accepted write path 的 transaction boundary | §9~§12 |
| `03-详细设计.md` §5 domain object | domain 不访问 repository、不生成 id、不提交事务、不发布 relay | §9 / Step 6 |
| `03-详细设计.md` §5 infra adapter | durable adapter 可自由选物理 store,但必须保留 logical key/index/version/append-only semantics | §8 / §18 |
| `03-详细设计.md` §8 function flow | command/consumer/relay/job/handoff/query transaction ordering | §11~§16 |
| `03-详细设计.md` §9 state matrix | stale/failed/unavailable/published/delivered state must have durable marker and version rule | §10 / §17 |
| `03-详细设计.md` §10 persistence | logical store table、repository semantic table、transaction boundary table、一致性策略 table | §8~§18 |
| `03-详细设计.md` §10 relay | relay record + payload snapshot same UoW;publisher only reads stored snapshot | §9.5 / §14 / §18.1 |
| `03-详细设计.md` §10 projection | query no-write;replace view/state atomically;missing lookup returns degraded/not-ready surface | §9.3 / §16 / §18.2 |
| `03-详细设计.md` §10 idempotency | stored result saved before idempotency complete;duplicate replays stored surface | §9.5 / §12 / §18.3 |
| `03-详细设计.md` §10 handoff | prepared handoff material body-free;delivery failure affects handoff/job report only | §15 / §18.4 |

---

## 20. Cross-step closure audit

| Audit item | 结论 | 说明 |
|---|---|---|
| Step 6 object 字段是否有 durable home | pass | §7 / §8 覆盖 truth、support、projection、reference、trace、handoff、relay、idempotency、stored result |
| Step 7 repository 是否有 persistence semantics | pass | §9 固定 mutable / append-only / projection / reference / relay / result semantics |
| Step 8 DTO/result/event/job 是否有 storage surface | pass | relay payload snapshot、stored operation result、job report、consumer receipt、view/report store 均有落点 |
| Step 9 transaction ordering 是否收束 | pass | §12~§15 汇总 command、consumer、relay、job、handoff ordering |
| Step 10 state matrix 是否有 persistence guard | pass | stale/failed/unavailable/published/delivered/retryable states 均有 store/version/append rule |
| query no-write 是否闭合 | pass | §16 覆盖 core、read、trace、search、report、reference query |
| relay snapshot source 是否闭合 | pass | §14 / §18.1 禁止 current truth rebuild |
| stored result replay 是否闭合 | pass | §9.5 / §18.3 固定 typed replay |
| external ownership boundary 是否闭合 | pass | §9.4 / §18.4 禁止 external body and handoff body ownership |
| implementation-facing ambiguity 是否剩余 | pass | 本 Step 未新增 port/type;只为 Step 7 已闭口 surface 补持久化与事务规则 |

---

## 21. Step 12~16 handoff

| Later Step | Handoff item |
|---|---|
| Step 12 Error / recovery | version conflict、duplicate conflict、missing stored result、missing relay payload、projection lookup missing、resolver application failure、target disabled、commit failure 的 exact error taxonomy |
| Step 13 Concurrency / idempotency | retry count/window、dead-letter policy、partial job commit granularity、relay worker conflict retry、operator recovery |
| Step 14 Config / external binding | relay topic/schema binding、handoff target registry、resolver endpoint availability、mirror retention |
| Step 15 Observability / audit | UoW commit metrics、relay publication counters、job item outcomes、idempotency replay counters、consistency issue alerts |
| Step 16 Test cuts | repository contract tests、transaction ordering tests、no-write query tests、relay snapshot-only tests、duplicate replay tests、reference body-free tests、handoff material tests |

---

## 22. Stop-review checklist

| Checklist item | 结论 | Evidence |
|---|---|---|
| 数据所有权实现表已覆盖本仓 owned truth/support/reference/projection/relay/handoff/result | pass | §7 |
| logical store table 已覆盖 key/index/version/append-only behavior | pass | §8 |
| repository function persistence semantics 已覆盖 Step 7 surfaces | pass | §9 |
| version/cursor/identity 来源已固定 | pass | §10 |
| transaction boundary matrix 已覆盖 command/query/consumer/relay/job/handoff | pass | §11~§16 |
| consistency strategy and recovery 已覆盖 relay/projection/reference/handoff/stored result | pass | §17 |
| schema notes and anti-patterns 已记录 implementation red lines | pass | §18 |
| formal document backfill points 已列出 | pass | §19 |
| Step 12 handoff 已明确 | pass | §21 |

---

## 23. 回填草稿

以下内容供 Step 19 装配正式 `03-详细设计.md` 时使用,不得在 Step 19 前直接改正式文档。

```markdown
## 10. 持久化、事务与一致性契约

### 10.1 数据所有权与 logical store
- L1-artifact 持久化拥有 ArtifactFact、ArtifactContentFactContext、ArtifactVersion、ArtifactVersionCandidate、ArtifactLineageLink、ArtifactBaseline、ArtifactBaselineMembership、intake/review/automation/consumption support state、derived view state、external resolution state、local mirror snapshot、trace/audit/history/handoff/refresh record、relay item/payload snapshot、prepared handoff material、idempotency record 和 stored result。
- Sibling 模块正文只允许通过 typed ref、safe summary ref、source version、digest、local mirror snapshot、resolution state 或 marker 进入。
- durable adapter 与 in-memory fake 必须保留 logical store 的 primary key、secondary key、version、append-only 和 transaction 行为。

### 10.2 Repository version and append-only rules
- Mutable truth/support/projection/reference state update 必须使用 `Versioned<T>` 返回的 `ArtifactRepositoryVersion`。
- `expected_version = None` 只表示创建新 identity。
- trace/history/audit/handoff/refresh records append-only,不得覆盖。

### 10.3 Transaction ordering
- Command accepted path: reserve idempotency, load versioned state, save truth/support, append records, assign cursor, mark stale, append relay snapshot, save stored result, complete idempotency, commit.
- Consumer accepted path: reserve idempotency, save reference/mirror/refresh, assign reference cursor, mark stale, save receipt, complete idempotency, commit.
- Relay publisher only reads pending item and stored payload snapshot;publication marker update uses pending item version.
- Query path is read-only and cannot rebuild, refresh, append, reserve idempotency or save stored result.

### 10.4 Consistency and recovery
- Relay/projection/reference/handoff are eventually consistent maintenance surfaces.
- Stored result must be saved before idempotency complete.
- Missing relay payload, missing stored result, projection source missing, resolver application failure and handoff target disabled are formal recovery cases for Step 12 / Step 13.
```

---

## 24. 进入下一步条件

Step 11 已完成。进入 Step 12 前需要用户确认:

```text
Step 12 定义错误模型、异常分支与恢复口径
```
