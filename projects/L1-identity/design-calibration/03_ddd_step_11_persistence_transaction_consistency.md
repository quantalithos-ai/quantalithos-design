# Step 11. 持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
> 当前状态: Step 11 persistence / transaction consistency 已完成;等待用户审核后进入 Step 12 error / recovery
> 本文件性质: 详细设计 Step 11 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只在当前批次写当前批次内容;不得提前生成后续 Step 文件;不得直接修改正式 `03-详细设计.md`

---

## 1. Step 状态 + Step 内计划

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 11 persistence / transaction consistency |
| 当前批次 | 11.5 cross-step closure / Step 12 handoff |
| 当前结论 | Step 11 已完成:11.1~11.4 覆盖 data ownership、logical store、repository semantics、transaction boundary、consistency/recovery/fake parity,并完成 Step 12 handoff |
| 本批是否写完整持久化契约 | 是。Step 11 中间产物已完整,但不直接回填正式 `03-详细设计.md` |
| 下一批 | Step 12 error / recovery |
| 停审要求 | 用户审核通过 Step 11 后进入 Step 12;若审核发现对象、store、repository、transaction 或 fake parity 漏项,先回 11.1~11.4 修正 |

### 1.2 Step 11 目标

Step 11 的目标是把 Step 6 的对象字段、Step 7 的 repository / UnitOfWork / outbox / projection / reference / result / entry port、Step 9 的函数级事务顺序、Step 10 的状态矩阵收束成可实现的持久化与一致性契约。

实现侧必须按本 Step 保存 identity-owned truth、source / reference marker、projection / read view、trace / audit、outbox、handoff、idempotency record、stored result、typed receipt envelope、job report、runtime / entry marker。若某个 flow 需要更新已有 state,必须使用本 Step 明确的 `IdentityVersion` 来源;不得用 cursor、timestamp、source version、job cursor、page cursor、idempotency key、request digest、route string 或 hard-coded version 代替 optimistic version。

本 Step 不定义物理数据库产品、DDL 语法、SQL index 名称、migration 文件、HTTP status、retry/backoff 数字、broker topic、transport route、adapter config schema、最终错误 enum 全集或实施 commit boundary。物理 schema 可由 infra 设计或实施计划细化,但 durable adapter 与 in-memory fake 必须保留本 Step 的 logical key、unique key、index、version、transaction、append-only 和 no-write/no-repair 语义。

### 1.3 Step 11 分批计划

| 批次 | 主题 | 输出 | 停审重点 | 状态 |
|---|---|---|---|---|
| 11.0 | framework / input boundary / batch plan | 文件骨架、SOP 问题、输入材料、分批表、红线、11.1 入口 | 是否承接 Step 10 handoff;是否不提前写 store 细节 | 已完成 |
| 11.1 | data ownership / logical store inventory | 数据所有权实现表、logical store / projection / report / marker 契约表 | identity-owned vs external body-free refs;mutable vs append-only vs read model | 已完成 |
| 11.2 | repository persistence semantics | Step 7 repository 函数的 key/index/version/UoW 语义表 | 不新增 Step 7 方法;version/read/save 配对闭合 | 已完成 |
| 11.3 | transaction boundary by flow family | command、query、consumer/callback、outbox publish、handoff、operations job、entry 的事务边界表 | 同事务必须写入;rollback 条件;query no-write | 已完成 |
| 11.4 | consistency / recovery / fake parity | optimistic conflict、append-only、stored replay、projection/reference eventual consistency、fake/durable parity | no hidden read-on-save;no private fake maps;no duplicate rerun | 已完成 |
| 11.5 | cross-step closure / Step 12 handoff | Step 6~10 闭环审计、open item 决策、进入 Step 12 条件 | persistence 不私补 schema;error/recovery 后移 | 已写入,待审核 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 已有正式/中间产物 | 固定 L1-identity 只拥有 identity truth、marker、projection、trace/audit 和本地 replay/report material,不拥有 sibling 正文 |
| `01-架构设计.md` | 已有正式/中间产物 | 固定数据所有权、异步传播、adapter/fake、runtime/entry 和外部依赖边界 |
| `02-概要设计.md` | 已有正式/中间产物 | 提供模块、对象、状态和处理流的概要归属 |
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | 提供 truth object、state value、view/report、trace/audit、outbox/handoff、idempotency、stored result、job report、runtime/entry 字段和 factory |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | 提供 `IdentityUnitOfWork`、repository、resolver、publisher、handoff、stored result、job report、operation context、dispatch target 和 fake/durable port surface |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | 提供 command/query/event/job DTO、consumer receipt、stored replay、outbox payload marker、job report surface 和 entry-facing protocol shell |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 提供 command/query/consumer/callback/outbox/job flow 的 transaction order、duplicate replay、no-write/no-repair 和 side-effect inventory |
| `03_ddd_step_10_state_matrix.md` | 已完成并待审核 | 提供 state transition、terminal/retry/failure guard、version/cursor/key separation、Step 11 handoff |
| `04_config_*` calibration files | 已存在 | 后续 Step 14 输入;本 Step 只读取 runtime/config/adapter persistence boundary,不写配置 schema |
| `standards/document/详细设计讨论流程_SOP.md` | 当前标准 | Step 11 输出结构、问题、执行约束 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 当前标准 | version/cursor/idempotency/stored result/fake parity 可落码门禁 |
| `L1-governance` Step 11 中间产物 | 参考 | 仅参考组织粒度和停审方式,不复制业务对象 |

---

## 3. SOP 问题回答

| SOP 问题 | 本轮回答 |
|---|---|
| 哪些数据对象由本仓拥有 | 11.1 展开。初步范围包括 member/lifecycle/role/career/memory truth、source/reference marker、projection/view/report、trace/audit、outbox/handoff、idempotency/stored result/receipt/job report、runtime/entry marker。 |
| 哪些只是引用、快照或投影 | 11.1 展开。所有 external role/work/memory/archive/source/config/adapter material 只能保存 typed ref、safe summary、source version、marker、digest、body-free issue 或 local resolution state;不得保存外部正文。 |
| repository 函数如何命名,参数和返回是什么 | 11.2 展开。函数签名以 Step 7 为准;Step 11 只补 logical store、key/index、version、UoW、append-only 和 fake/durable 行为,不得新增私有 repository 方法。 |
| 哪些处理流需要事务,事务内必须完成哪些写入 | 11.3 展开。command accepted、consumer/callback accepted、outbox/handoff marker update、projection rebuild、reference refresh、reconciliation/job report、idempotency/stored result complete 需要写事务;query 和 pre-dispatch entry no-write。 |
| 是否需要乐观锁、行锁、版本号、outbox 或 projection | 需要 optimistic version 和 unique key;是否需要显式 row lock / isolation level 不在本 Step 强制。outbox、projection、reference、stored replay 都必须有 logical persistence 语义和 fake/durable parity。 |
| 如果事件发布或 projection 更新失败,如何恢复 | 11.4 展开。原则是 propagation/projection/reference failure 写本地 marker/report/issue,不回滚 accepted truth;duplicate replay 不重跑;query 不修复。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 来源 | 当前风险 | Step 11 处理 |
|---|---|---|
| Step 7 port | trait 已有,但每个函数的 logical key、index、version、append-only / mutable 语义尚未统一 | 11.2 按 repository family 写语义表 |
| Step 9 flow | 每条 flow 已有顺序,但跨 flow 的 begin/commit/rollback 和同事务必须写入尚未矩阵化 | 11.3 写 transaction boundary |
| Step 10 state matrix | 状态已闭口,但 terminal/retry/recovery 对应的 durable state / expected_version 来源需固定 | 11.1~11.4 承接 |
| stored result / typed receipt / job report | duplicate replay 已固定 no-rerun,但 durable replay surface 与 typed envelope/report 保存时序需固定 | 11.1~11.3 承接 |
| query no-write | Step 9/10 已固定 no-write,但 repository 读取路径必须禁止 hidden rebuild/refresh | 11.2~11.4 承接 |
| fake parity | Step 7/10 已禁止 private fake maps/default success,但 fake logical indexes/version conflict 需逐 store 约束 | 11.4 承接 |
| Step 11~16 文件 | identity 目前尚未生成 Step 11~16 DDD 中间产物 | 本文件从 Step 11 开始逐步建立;不得引用不存在的后续结论作为已闭口事实 |

---

## 5. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否写具体 DDL | A. 直接写 SQL DDL;B. 写 logical store 契约 | 采用 B。项目尚未锁定物理数据库;fake/durable 必须等价实现 key/index/version/transaction 语义。 |
| 是否一次性写完所有 persistence | A. 一次性写全;B. 按 data ownership、repository semantics、transaction、consistency 分批 | 采用 B。Step 11 涉及 truth、read model、outbox、handoff、stored replay、entry/runtime,一次写全容易遗漏 version/source 规则。 |
| 是否允许 Step 11 新增 repository 方法 | A. 允许为了持久化补方法;B. 不允许,必须回 Step 7 | 采用 B。Step 11 只解释 Step 7 方法语义;缺读取面/保存面必须回 Step 7/9/10 闭口。 |
| mutable state 并发控制 | A. adapter 自行决定;B. `Versioned<T>` + `IdentityVersion` optimistic update | 采用 B。所有 update existing state 必须有正式 version 来源。 |
| append-only material | A. 也走 expected_version;B. generated ref / unique key + UoW append | 采用 B。trace/audit/history/outbox/stored shell/report item 等 append-only material 不覆盖旧行。 |
| duplicate replay | A. duplicate 重新执行 service;B. 从 stored result / receipt / job report 读取 | 采用 B。与 Step 10 保持一致。 |
| query stale/missing | A. query 自动修复;B. query surface only | 采用 B。query no-write 是跨 Step 硬约束。 |

---

## 6. Step 11 redlines

| Redline | 违反例 | 正确处理 |
|---|---|---|
| 不新增 Step 7 repository 方法 | Step 11 写 `find_by_scope(...)` 但 Step 7 没有 | 暂停回 Step 7/9/10 |
| 不用 cursor/key/version 互相替代 | 用 source version 当 optimistic version | 使用 loaded `IdentityVersion` |
| 不让 query hidden write | query miss 时 repository 自动 rebuild view | query 返回 missing/degraded/stale surface |
| 不让 fake 私有 map 补索引 | fake 从 ref 字符串推 scope/view/subject | formal index / mapper / lookup |
| 不重跑 duplicate | stored result missing 时重新执行 command/job | Step 12/13 replay error |
| 不保存外部正文 | stored report 保存 raw adapter response / receipt body | 保存 body-free marker / issue refs |
| 不把 entry failure 写成业务结果 | runtime unavailable 保存 rejected command result | entry pre-dispatch surface only |
| 不把 propagation failure 回滚 truth | publish failed 回滚 accepted member truth | update outbox/handoff/job issue only |

---

## 7. 结构化中间产物

### 7.1 11.0 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 11.0 范围 | 通过 | 只建立框架、输入、计划、取舍和红线 |
| 是否读取 SOP | 通过 | Step 11 目标/输出/问题已承接 |
| 是否承接 Step 10 handoff | 通过 | versioned read/save、transaction order、stored replay、query no-write、job no-repair、fake parity 均进入计划 |
| 是否提前写 store 细节 | 未提前 | logical store inventory 留 11.1 |
| 是否新增 repository 方法 | 未新增 | 11.0 未定义函数签名 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.2 11.1 data ownership / logical store inventory

本批只定义 logical persistence inventory,不是物理 DDL。Durable adapter 可以合并或拆分物理表,但必须保留本节的 identity-owned boundary、主键 / 唯一键、正式索引、version、append-only、stored replay 和 no-write/no-repair 语义。In-memory fake 必须按同一 logical store 行为实现,不得通过私有 map、字符串前缀解析、默认 valid、query hidden rebuild 或 duplicate rerun 补齐缺口。

#### 7.2.1 数据所有权实现表

| 数据对象 / 对象族 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `GlobalMember` / `IdentityAnchorState` | identity member truth | establish / terminal lifecycle application service 通过 `GlobalMemberRepository` | establish reuse guard、member query、lifecycle service、projection / report | member ref 唯一;anchor hold 是 versioned update;terminal hold 不释放或复用 ref |
| `GlobalLifecycleState` | identity lifecycle truth | establish initial lifecycle、explicit lifecycle transition service | lifecycle query、member summary projection、high-risk lifecycle guard、report | member current lifecycle 一行一真相;update 必须用 loaded `IdentityVersion`;不得从 runtime / ProjectMember 推导 |
| `RoleCapabilitySummary` / `RoleCapabilitySourceSnapshot` | identity role/capability summary truth | maintain role/capability command、source changed consumer、reference refresh job | role query、member summary projection、reconciliation、guard precheck | summary 与 source snapshot 分别 versioned;source lookup 使用 typed source ref;不得保存 role / capability definition body、method body 或 evidence body |
| `CareerRecord` | identity career append-only truth / history | append career、correction command、work participation consumer | career query、member summary projection、audit / report | create append-only;旧 record 只允许 loaded-version explanatory state update,例如 superseded marker;duplicate source marker 必须有正式索引 |
| `MemoryReference` | identity memory/archive relation truth | maintain memory reference、memory source consumer、archive handoff callback | memory query、member summary projection、handoff / reconciliation | relation state versioned;按 member / memory / archive / handoff body-free ref 建索引;不得保存 memory body、embedding、archive package、receipt body |
| `MemberSummaryView` / `ProjectionState` | identity read model / projection state | accepted write 标 stale;rebuild job replace view / mark fresh or failed | query service、visibility service、reconciliation | view ref 必须来自 builder / lookup;query 只读不 rebuild;projection state versioned,source cursor 不等于 optimistic version |
| `IdentityTraceRecord` | identity trace / history material | accepted command、consumer/job/reference marker、correction flow | trace query、audit assembly、handoff、report | append-only;subject 必须来自 formal mapper;cursor 来自 accepted truth cursor 或 formal marker cursor |
| `AuditTrail` / audit entries | identity audit material | accepted application services append body-free audit entry | audit query、handoff preparation、report | audit aggregate versioned;entry append 不保存 raw log、request body、external body 或 secret |
| `TraceHandoffIntent` | identity trace handoff marker | prepare handoff job/service、handoff callback、retry/cancel service | handoff query、job replay、audit | intent state versioned;`Delivered` 必须有 formal attempt + receipt marker;target/scope/material body-free |
| `ReferenceResolutionState` / typed reference sidecars | identity external reference tracking | consumer sidecar update、external reference refresh job、resolver result mapper | command precheck、query visibility preparation、refresh/reconciliation job | bundle key 是 `ExternalReferenceRef`;typed sidecar save 必须显式绑定同一 bundle和 loaded bundle version;source version / safe summary ref 不得当 expected_version |
| `ReconciliationReport` / findings / issues | identity maintenance report | reconciliation job | report query、job duplicate replay、evidence/audit | report-only;不得修复 core truth 或 external truth;finding/issue 只保存 safe marker |
| `IdentityOutboxRecord` / payload marker | identity propagation marker | accepted application services create pending outbox;publisher job updates state | outbox publish job、trace query、report | accepted-only append pending record;publish state update versioned;payload 只保存 body-free marker/topic boundary,不保存 outbound body |
| `IdentityIdempotencyRecord` | identity application replay guard | command / consumer / callback / job service reserve and complete | duplicate detection、stored replay | unique `(operation_name, idempotency_key)`;same key different digest conflict;same digest replay 必须有 stored result |
| `StoredIdentityOperationResult` / command effect / receipt / job report | identity application replay material | accepted/rejected command、consumer receipt、handoff callback receipt、job completion | duplicate replay、audit/report | stored surface immutable after save;duplicate 不重跑 mutation;不得保存 public raw response body、raw event body 或 raw job log |
| runtime config shell / assembly / adapter availability / entry validation and dispatch markers | identity infra / entry technical material | runtime builder、adapter catalog、API/worker/jobs entry guard | entry readiness、dispatch guard、diagnostics | runtime-local marker;不等于 business accepted/rejected;不保存 secret/raw env/full config/raw request |

#### 7.2.2 logical store 契约表

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `identity_global_members` | member anchor truth | PK `member_ref` | `anchor_state`,`source_ref`,`created_by_ref` | `identity_version` |
| `identity_global_lifecycles` | member lifecycle current truth | PK `member_ref` | `lifecycle_state`,`reason_ref`,`governance_basis_ref`,`changed_at` | `identity_version` |
| `role_capability_summaries` | current / historical role capability summary truth | PK `summary_ref`;unique current `member_ref` when policy requires one current summary | `member_ref`,`summary_state`,`source_snapshot_ref`,`safe_summary_ref` | `identity_version` |
| `role_capability_source_snapshots` | role/capability source snapshot | PK `snapshot_ref`;unique typed `source_ref` for current source snapshot | `source_ref`,`source_kind`,`source_state`,`source_version_ref` | `identity_version` |
| `career_records` | append-only career facts and correction records | PK `career_record_ref`;source duplicate key by `source_marker_ref` when append policy requires | `member_ref`,`source_marker_ref`,`record_state`,`append_time`,`original_record_ref` | append create has row version;state update uses `identity_version` |
| `career_correction_index` | original record -> correction record lookup | unique `(original_record_ref, correction_record_ref)` | `original_record_ref`,`correction_record_ref` | owned by `career_records` append |
| `memory_references` | memory/archive/handoff relation truth | PK `memory_reference_ref`;unique active `(member_ref, memory_ref)` / `(member_ref, archive_ref)` when relation kind applies | `member_ref`,`memory_ref`,`archive_ref`,`handoff_ref`,`reference_state` | `identity_version` |
| `member_summary_views` | body-free member summary read model | PK `member_summary_view_ref`;unique current `(member_ref, visibility_scope_ref)` | `member_ref`,`visibility_scope_ref`,`read_surface_kind`,`visibility_result_ref`,`source_cursor` | replaced under projection state version |
| `identity_projection_states` | projection freshness and rebuild state | PK `projection_ref` or stable `view_ref` | `projection_kind`,`source_identity_ref`,`freshness_state`,`source_cursor`,`last_issue_ref` | `identity_version` |
| `projection_dependency_index` | accepted truth -> affected projection lookup | unique `(dependency_kind, dependency_ref, projection_ref)` | `dependency_ref`,`projection_ref`,`projection_kind` | no standalone version;updated in same UoW as producing relation |
| `external_reference_states` | tracked external reference bundle state | PK `reference_state_ref`;unique `reference_ref` | `owner_ref`,`reference_kind`,`resolution_state`,`source_version_ref`,`checked_at` | `identity_version` |
| `external_reference_owner_index` | owner / kind / stale target lookup for refresh and reconciliation | unique `(owner_ref, reference_ref, reference_kind)` | `owner_ref`,`reference_kind`,`resolution_state`,`reference_ref` | owned by `external_reference_states` save |
| `external_reference_sidecars` | typed safe summary / snapshot / marker sidecar bound to reference bundle | unique `(reference_ref, sidecar_kind, sidecar_ref)` | `reference_ref`,`sidecar_kind`,`sidecar_ref`,`source_version_ref` | uses same loaded bundle `identity_version`;no standalone optimistic version |
| `identity_trace_records` | accepted trace, marker trace and correction trace | PK `trace_record_ref` | `member_ref`,`subject_ref`,`change_kind_ref`,`source_cursor` | append-only;no optimistic overwrite |
| `identity_audit_trails` | audit trail aggregate / timeline owner | PK `audit_trail_ref`;unique `audit_subject_ref` | `audit_subject_ref`,`member_ref`,`audit_scope_ref`,`visibility_result_ref`,`read_surface_kind`,`latest_trace_ref`,`audit_cursor_ref` | `identity_version`;accepted write create uses `IdentityAcceptedAuditTrailMarkerMapper` for scope / visibility markers |
| `identity_audit_entries` | body-free audit trail entries | unique `(audit_trail_ref, ordinal_or_cursor)` | `audit_trail_ref`,`trace_record_ref`,`change_kind_ref`,`visibility_result_ref`,`occurred_at`,`audit_cursor_ref` | owned by audit trail append;accepted write entry visibility marker comes from `IdentityAcceptedAuditTrailMarkerMapper` |
| `trace_handoff_intents` | trace handoff marker and state | PK `handoff_intent_ref` | `member_ref`,`target_ref`,`scope_ref`,`handoff_state`,`receipt_ref`,`issue_ref` | `identity_version` |
| `trace_handoff_items` | handoff intent trace / audit item set | unique `(handoff_intent_ref, trace_record_ref)`;optional audit item unique by `audit_trail_ref` | `trace_record_ref`,`audit_trail_ref`,`target_ref` | owned by handoff intent save |
| `identity_outbox_records` | accepted-only outbound publication marker | PK `outbox_record_ref`;optional unique `(trace_record_ref, event_kind_ref)` | `outbox_state`,`topic_key_ref`,`subject_ref`,`trace_record_ref`,`attempt_ref` | `identity_version` |
| `identity_outbox_payload_markers` | immutable body-free outbound payload marker | PK `payload_marker_ref` | `event_kind_ref`,`subject_ref`,`schema_marker_ref`,`trace_record_ref` | immutable |
| `identity_idempotency_records` | operation idempotency reservation and completion | PK `idempotency_record_ref`;unique `(operation_name, idempotency_key)` | `request_digest`,`idempotency_state`,`stored_result_ref`,`operation_channel` | `identity_version` or atomic reservation token |
| `stored_identity_operation_results` | command / consumer / callback / job replay surface | PK `stored_result_ref` | `operation_name`,`operation_context_ref`,`stored_result_kind`,`created_at` | immutable after save |
| `identity_command_effect_summaries` | accepted command effect summary | PK `effect_summary_ref` | `truth_ref`,`truth_cursor`,`stored_result_ref`,`outbox_record_ref` | immutable after save |
| `identity_consumer_receipt_envelopes` | typed consumer/callback receipt replay material | PK `receipt_ref` | `operation_context_ref`,`source_ref`,`receipt_kind`,`stored_result_ref` | immutable after save |
| `identity_job_run_reports` | operations job report replay material | PK `job_report_ref`;unique `job_run_ref` | `job_name`,`scope_ref`,`job_result_kind`,`cursor_ref`,`stored_result_ref` | immutable after completion;partial/failed issue refs preserved |
| `identity_reconciliation_reports` | report-only reconciliation output | PK `reconciliation_report_ref` | `scope_ref`,`target_ref`,`report_state`,`generated_at` | immutable or superseded with `identity_version` |
| `identity_runtime_config_shells` | runtime profile / safe config evidence marker | PK `runtime_config_ref` or `(profile_ref, build_ref)` | `profile_ref`,`config_evidence_ref`,`config_validation_state` | runtime-local version optional |
| `identity_runtime_assembly_states` | runtime wiring lifecycle marker | PK `runtime_assembly_ref` | `assembly_state`,`profile_ref`,`issue_ref` | runtime-local version optional |
| `identity_adapter_availability` | adapter slot availability marker | PK `adapter_ref` | `adapter_mode`,`availability_state`,`issue_ref` | runtime-local version optional |
| `identity_entry_dispatch_markers` | API / worker / jobs validation and dispatch marker | PK `entry_context_ref` | `entry_kind`,`validation_state`,`dispatch_state`,`target_ref`,`operation_context_ref` | entry-local;not business replay version |

#### 7.2.3 external body-free reference / snapshot boundary

| 外部材料 | 所属 owner | identity 允许保存 | 禁止保存 | version / cursor 规则 |
|---|---|---|---|---|
| account / credential / auth session | account / auth bounded context | `IdentitySourceRef`, actor marker, safe validation issue marker | credential secret、session token、account profile body | 不作为 member truth;不得推导 lifecycle 或 anchor state |
| ProjectMember / project / work item | project / work bounded context | `ProjectParticipationRef`, `WorkSourceRef`, `CareerSourceMarkerRef`, safe summary ref, source version marker | project body、work item body、assignment body、raw work event | source version 只进 source marker / safe summary,不得当 `IdentityVersion` |
| method role / capability definition and evidence | method-library / evidence owner | role/capability source ref, evidence ref, safe summary ref, source snapshot marker | RoleDefinition、CapabilityDefinition、method body、evidence body、automatic scoring material | typed source lookup 不解析字符串;expected_version 来自 loaded summary/snapshot/bundle |
| governance basis | governance bounded context | `GovernanceBasisRef`, `GovernanceBasisSummary`, body-free issue marker | governance decision body、policy body、approval raw note | high-risk guard 只消费 summary;basis ref presence 不等于 valid |
| memory / archive / handoff package | memory / archive owner | `MemoryRef`, `ArchiveRef`, `ArchiveHandoffRef`, `MemorySafeSummaryRef`, `HandoffReceiptRef` marker | memory body、embedding、index、archive package、receipt body | delivered 必须有 formal receipt marker;receipt body 不进入 identity |
| external reference bundle source | external provider / sibling module | `ExternalReferenceRef`, local owner ref, safe summary marker, source version marker, resolution state | external正文、diagnostic body、provider raw response | optimistic update 使用 loaded bundle `IdentityVersion`,不得使用 source version |
| runtime config / adapter / transport | infra / deployment owner | profile ref、safe config evidence、adapter mode、availability issue marker | secret、raw env、full config body、HTTP response body、broker raw message | runtime state 只决定 entry readiness / degraded surface,不保存 business rejected/stored result |

#### 7.2.4 mutable / append-only / read model storage classification

| 分类 | 代表 store | 写入模型 | version / consistency 规则 |
|---|---|---|---|
| mutable versioned truth | `identity_global_members`, `identity_global_lifecycles`, `role_capability_summaries`, `role_capability_source_snapshots`, `memory_references` | create `None`,update loaded version | `IdentityVersion` 来自 versioned read / create result;state transition 由 Step 10 矩阵约束 |
| append-only truth/history | `career_records` append path,`identity_trace_records`,history/correction trace | create-only append | 不覆盖旧 material;correction / supersession 通过新 record + loaded-version marker 表达 |
| versioned aggregate + entry append | `identity_audit_trails`, `trace_handoff_intents` | aggregate loaded-version update,entry/item set 同 UoW 保存 | aggregate version 控制并发;entry/item 不单独替代 aggregate version |
| read model / projection | `member_summary_views`, `identity_projection_states`, `projection_dependency_index` | accepted write 只 mark stale;job rebuild replace/fresh/failed | query no-write;view ref 来自 builder / lookup;source cursor 不等于 optimistic version |
| reference bundle / sidecar | `external_reference_states`, `external_reference_sidecars`, `external_reference_owner_index` | bundle versioned update;sidecar 同 bundle expected_version | ExternalReferenceRef 是 bundle key;source version / business source ref 不自动等于 bundle key |
| propagation marker | `identity_outbox_records`, `identity_outbox_payload_markers`, `trace_handoff_intents` | accepted append pending;publisher/handoff callback versioned state update | side-effect failure 不回滚 accepted truth;Published 不等于 Delivered |
| replay / idempotency support | `identity_idempotency_records`, `stored_identity_operation_results`, `identity_consumer_receipt_envelopes`, `identity_job_run_reports` | reserve then complete with stored result / receipt / report | duplicate replay 只读 stored surface;stored missing 不重跑 mutation |
| runtime / entry technical marker | runtime config / assembly / adapter / entry dispatch stores | runtime-local marker update | entry valid / dispatch success 不等于 application accepted;不进入 command stored result |

#### 7.2.5 11.1 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 11.1 范围 | 通过 | 只写数据所有权、logical store、external boundary 和分类;未写 repository 函数语义 / transaction boundary |
| identity-owned 对象是否覆盖 Step 6/10 主语 | 通过 | member/lifecycle/role/career/memory、projection/reference/report、outbox/handoff、idempotency/stored replay、runtime/entry 均已覆盖 |
| external body-free boundary 是否明确 | 通过 | account/project/work/method/governance/memory/archive/runtime 均只保存 typed ref、safe summary、source version、marker、issue 或 local state |
| version / cursor / source version 是否分离 | 通过 | logical store 明确 `IdentityVersion`、source cursor、source version、page cursor 不互相替代 |
| 是否新增 Step 7 repository 方法 | 未新增 | 本批只定义 store/index/owner 语义;函数级语义留 11.2 |
| 是否写具体 DDL / migration | 未写 | durable 可以合并或拆分物理表,但必须等价实现 logical contract |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.3 11.2 repository persistence semantics

本批承接 Step 7 已定义的 repository / read-side port。表内函数名必须与 Step 7 surface 对齐;本批不得新增 repository 方法、DTO 字段、状态 variant 或 mapper。若实施需要本批未列的读取面 / 保存面 / versioned read / stored replay surface,必须回 Step 7/8/9/10 修正,不能在 adapter 或 fake 内私补。

#### 7.3.1 通用 repository persistence 规则

| 规则 | 正式口径 |
|---|---|
| read 不接 UoW | `get` / `find` / `list` / `resolve` 只读取 committed state,不隐式 begin transaction,不 hidden write |
| write 必接 UoW | `save` / `append` / `update` / `complete` / `mark` 必须接收同一 `&dyn IdentityUnitOfWork`,具体同事务组合留 11.3 |
| optimistic version | mutable update 的 `expected_version` 只能来自 matching versioned read / create result / reserve outcome;不得用 cursor、timestamp、source version、page cursor、request digest 或 idempotency key |
| create version | `expected_version: None` 只表示 create path;若 key 已存在且不是同一 immutable material,必须 duplicate/conflict |
| append-only | trace、career append、effect summary、stored result、receipt envelope、payload marker 等 append-only material 不覆盖旧行 |
| page cursor | `IdentityRepositoryPage` / `IdentityRepositoryCursor` 只用于分页,不得当 truth cursor、projection cursor、job cursor 或 optimistic version |
| no external body | repository 只保存 Step 6 body-free truth/ref/summary/marker/issue/report material,不得保存 external正文、raw event、raw request、adapter response、secret 或 receipt body |
| no hidden resolver | repository 不调用 external resolver、publisher、handoff adapter 或 authorization adapter;相关 port surface 留 Step 7 external ports |
| fake parity | fake 必须按同一 key/index/version/append-only/missing/conflict 语义实现,不得解析 opaque ref 字符串或用私有 map 补正式 lookup |

#### 7.3.2 UnitOfWork / cursor persistence semantics

| 函数 | logical key / store | version / UoW 语义 | 禁止事项 |
|---|---|---|---|
| `IdentityUnitOfWorkManagerPort.begin` | 创建 transaction handle,绑定 `IdentityTransactionRef` | write flow 入口调用;不分配 committed cursor | query 不调用;不创建业务 row |
| `IdentityUnitOfWorkManagerPort.commit` | 提交 staged writes | commit 后 staged version/cursor 才可见 | commit 后继续使用同一 UoW |
| `IdentityUnitOfWorkManagerPort.rollback` | 丢弃 staged writes | rollback 不泄露 cursor、stored result、outbox、trace | rollback 后保留半写入 material |
| `IdentityCursorAssignerPort.assign_truth_change_cursor` | accepted truth boundary cursor | 同一 accepted command transaction 调一次并复用 | timestamp/version/id/digest 替代 cursor |
| `IdentityCursorAssignerPort.assign_reference_marker_cursor` | reference-only marker cursor | reference state / sidecar / marker staged 后调用 | source version / event dedupe key 替代 cursor |

#### 7.3.3 core truth repository semantics

| 函数 | logical store / key | version / UoW | 持久化语义 / 禁止事项 |
|---|---|---|---|
| `GlobalMemberRepository.get_member_with_version` | `identity_global_members` by `member_ref` | returns `Versioned<GlobalMember>` | read-only;version 只用于 `save_member`;missing 不自动建档 |
| `GlobalMemberRepository.get_anchor_state` | `identity_global_members` by `member_ref` | no update version | read-only guard;不得从 account/runtime/ProjectMember 推导 anchor |
| `GlobalMemberRepository.list_members` | `identity_global_members` page index | page cursor only | body-free ref scan;不修复 lifecycle/projection |
| `GlobalMemberRepository.save_member` | PK `member_ref` | create `None`;update loaded member version;UoW write | member ref unique;terminal hold 不释放 ref;不自动写 lifecycle/trace/outbox |
| `GlobalLifecycleRepository.get_lifecycle_with_version` | `identity_global_lifecycles` by `member_ref` | returns lifecycle version | read-only;version 只用于 lifecycle transition save |
| `GlobalLifecycleRepository.list_lifecycles` | lifecycle page / state indexes | page cursor only | body-free scan;不根据 runtime disabled 改 lifecycle |
| `GlobalLifecycleRepository.save_lifecycle(member_ref, lifecycle_state, expected_version, uow)` | `identity_global_lifecycles` PK `member_ref` from explicit argument | create `None`;update version from `get_lifecycle_with_version(member_ref)`;UoW write | current lifecycle 一行一真相;不得从 lifecycle_state、reason_ref、governance_basis_ref、actor 或 source string 推断 member key;不自动释放 anchor |
| `RoleCapabilityRepository.get_summary_with_version` | `role_capability_summaries` by `summary_ref` | returns summary version | read-only;不从 safe summary marker 拼 truth |
| `RoleCapabilityRepository.find_current_summary_by_member` | current summary index by `member_ref` | returns versioned summary | current 判定来自 formal index;不得用 list 后 ad hoc 选择 |
| `RoleCapabilityRepository.list_summaries_by_member` | summary member index | page cursor only | read-only;不保存 role/capability definition body |
| `RoleCapabilityRepository.get_source_snapshot_with_version` | `role_capability_source_snapshots` by `snapshot_ref` | returns snapshot version | source version 不等于 `IdentityVersion` |
| `RoleCapabilityRepository.find_source_snapshot_by_source` | typed source index by `source_ref` | returns versioned snapshot | 不解析 source ref 字符串;不调用 resolver |
| `RoleCapabilityRepository.save_source_snapshot` | PK `snapshot_ref`;unique typed source index | create `None`;update loaded snapshot version;UoW write | 只保存 safe source/snapshot markers;不保存 method/evidence body |
| `RoleCapabilityRepository.save_summary` | PK `summary_ref`;current member index | create `None`;update loaded summary version;UoW write | policy/service 决定 source usable;repo 不隐式降级 |
| `CareerRecordRepository.get_career_record` | `career_records` by `career_record_ref` | returns row version | read-only;version 只用于 explanatory state update |
| `CareerRecordRepository.list_records_by_member` | career member index | page cursor only | stable order;empty 不触发 create |
| `CareerRecordRepository.find_records_by_source_marker` | career source marker index | page cursor only | duplicate audit;不扫描 work body |
| `CareerRecordRepository.find_duplicate_source_record` | duplicate source marker unique/current index | no update version | append guard;不得 silently ignore duplicate append |
| `CareerRecordRepository.list_corrections_for_record` | `career_correction_index` | page cursor only | reads correction refs;不覆盖原 record |
| `CareerRecordRepository.append_career_record` | `career_records` append by `career_record_ref` | create-only;UoW write | append-only;不得 update/delete/reorder existing record |
| `CareerRecordRepository.save_career_record_state` | `career_records` by loaded `career_record_ref` | expected loaded record version;UoW write | 只写 superseded / correction marker 等解释性状态,不替换正文 |
| `MemoryReferenceRepository.get_memory_reference_with_version` | `memory_references` by `memory_reference_ref` | returns relation version | read-only;不读取 memory/archive body |
| `MemoryReferenceRepository.list_references_by_member` | memory relation member index | page cursor only | query/list no-create |
| `MemoryReferenceRepository.find_reference_by_memory` | unique active `(member_ref, memory_ref)` | returns versioned relation | 不保存 memory body、embedding、index |
| `MemoryReferenceRepository.find_reference_by_archive` | unique active `(member_ref, archive_ref)` | returns versioned relation | 不保存 archive package metadata |
| `MemoryReferenceRepository.find_reference_by_handoff` | handoff ref index | returns versioned relation | handoff marker 不等于 delivered receipt |
| `MemoryReferenceRepository.find_callback_target_by_handoff` | handoff callback target index | returns target ref only | callback raw body 不直改 truth |
| `MemoryReferenceRepository.save_memory_reference` | PK `memory_reference_ref`;member/memory/archive/handoff indexes | create `None`;update loaded relation version;UoW write | 不反写 external owner truth;不伪造 delivered |

#### 7.3.4 trace / audit / history / handoff repository semantics

| 函数 | logical store / key | version / UoW | 持久化语义 / 禁止事项 |
|---|---|---|---|
| `IdentityTraceRecordRepository.get_trace_record` | `identity_trace_records` by `trace_record_ref` | returns version only for supersession marker | missing 不补写 trace |
| `IdentityTraceRecordRepository.list_trace_records_by_member` | trace member index | page cursor only | stable committed order;不读取 truth 后修复 |
| `IdentityTraceRecordRepository.list_trace_records_by_subject` | trace subject index | page cursor only | subject 来自 formal mapper;不解析字符串 |
| `IdentityTraceRecordRepository.list_trace_records_after_cursor` | subject + truth/reference marker cursor index | cursor is formal truth/marker cursor | 不用 timestamp/version/digest 当 cursor |
| `IdentityTraceRecordRepository.list_trace_records_by_change_kind` | member + change kind index | page cursor only | change kind 是 body-free marker |
| `IdentityTraceRecordRepository.append_trace_record` | append PK `trace_record_ref` | create-only;UoW write | append-only;不 update/delete/reorder trace |
| `IdentityTraceRecordRepository.mark_trace_superseded_by_correction` | loaded trace row | expected loaded trace version;UoW write | 只写 supersession marker;不覆盖旧 trace |
| `IdentityAuditTrailRepository.get_audit_trail_with_version` | `identity_audit_trails` by `audit_trail_ref` | returns audit aggregate version | read-only;version 用于 save/append |
| `IdentityAuditTrailRepository.find_audit_trail_by_subject` | unique `audit_subject_ref` | returns versioned trail | missing 由 service 用 id generator 创建;repo 不隐式创建 |
| `IdentityAuditTrailRepository.list_audit_entries` | `identity_audit_entries` by trail/scope/cursor | audit cursor + page cursor only | audit cursor 不等于 truth cursor;不保存 raw log |
| `IdentityAuditTrailRepository.save_audit_trail` | PK `audit_trail_ref`;unique subject | create `None`;update loaded trail version;UoW write | accepted write create must use `AuditTrail::from_accepted_write(...)` with scope / visibility markers from `IdentityAcceptedAuditTrailMarkerMapper`;不修复 missing trace |
| `IdentityAuditTrailRepository.append_audit_entry` | audit entry set owned by trail | expected loaded trail version;UoW write | entry 引用 trace ref;accepted write visibility marker comes from `IdentityAcceptedAuditTrailMarkerMapper`;不保存 trace body/debug body |
| `IdentityTraceHistoryRepository.list_history_by_member` | read facade over trace/audit stores | page cursor only | 不创建第二套 history row |
| `IdentityTraceHistoryRepository.list_history_by_subject` | read facade by trace subject | page cursor only | 不从 raw subject 字符串查询 |
| `IdentityTraceHistoryRepository.list_history_between_cursors` | trace subject + cursor range | truth/reference marker cursor only | 不用 audit/page cursor 替代 |
| `IdentityTraceHistoryRepository.list_supersession_chain` | trace supersession relation | page cursor only | read-only;不修改旧 trace |
| `TraceHandoffIntentRepository.get_handoff_intent_with_version` | `trace_handoff_intents` by `intent_ref` | returns intent version | read-only;不调用 handoff adapter |
| `TraceHandoffIntentRepository.list_handoff_intents_by_member` | handoff member index | page cursor only | 不读取 archive package |
| `TraceHandoffIntentRepository.list_handoff_intents_by_trace` | `trace_handoff_items` trace index | page cursor only | missing 不创建 intent |
| `TraceHandoffIntentRepository.list_handoff_intents_by_audit_trail` | handoff audit item index | page cursor only | 不从 audit subject 拼 trail ref |
| `TraceHandoffIntentRepository.list_handoff_intents_by_target` | handoff target index | page cursor only | 不解析 target path/bucket |
| `TraceHandoffIntentRepository.list_retryable_handoff_intents` | handoff state + optional target index | page cursor only | retryable 只由 `HandoffState`;不定义 backoff |
| `TraceHandoffIntentRepository.save_handoff_intent` | PK `handoff_intent_ref`;trace/audit/target indexes | create `None`;update loaded intent version;UoW write | `Delivered` 必须有 formal receipt marker;不保存 receipt body |

#### 7.3.5 projection / read / reference / report repository semantics

| 函数 | logical store / key | version / UoW | 持久化语义 / 禁止事项 |
|---|---|---|---|
| `IdentityProjectionRepository.find_member_summary_view_ref` | `member_summary_views` unique `(member_ref, visibility_scope_ref)` written by `save_member_summary_view` from loaded view fields | read-only | stable lookup;missing 由 query surface 处理;不拼 view ref;不从 `visibility_result_ref` 反推 scope |
| `IdentityProjectionRepository.get_member_summary_view` | view PK `member_summary_view_ref` | read-only | view ref 必须来自 formal lookup/request;missing 不 rebuild |
| `IdentityProjectionRepository.get_projection_state_with_version` | `identity_projection_states` by `projection_ref` | returns projection state version | projection cursor 不当 version |
| `IdentityProjectionRepository.find_projection_state_ref` | projection state lookup index | read-only | only returns state ref;missing 不创建 |
| `IdentityProjectionRepository.list_projection_states` | projection state page index | page cursor only | job/report scan;不修复 truth |
| `IdentityProjectionRepository.list_stale_projection_states` | maintenance scope + stale index | page cursor only | rebuild job selection;query 不调用 rebuild |
| `IdentityProjectionRepository.get_projection_source_cursor` | projection source cursor store | read-only | cursor 来自 projection builder/committed scan;不等于 page cursor/version |
| `IdentityProjectionRepository.expand_affected_projection_refs` | `projection_dependency_index` by accepted subject refs | read-only | subject refs 来自 mapper;不解析 subject string |
| `IdentityProjectionRepository.save_member_summary_view` | `member_summary_views` PK + current `(member_ref, visibility_scope_ref)` index | create `None`;update loaded view/projection version;UoW write | projection builder only;view 必须携带 `visibility_scope_ref`;保存时同步写 lookup index;不保存 forbidden body |
| `IdentityProjectionRepository.save_projection_state` | `identity_projection_states` PK | create `None`;update loaded state version;UoW write | 不修改 core truth |
| `IdentityProjectionRepository.mark_projection_stale` | projection state PK | expected loaded projection version;UoW write | state carries source cursor;不使用 timestamp/idempotency key |
| `IdentityReadVisibilityRepository.resolve_member_summary_read` | read mapping index by member/view/consumer/context | read-only | returns access summary;不从 route/member string 拼 scope |
| `IdentityReadVisibilityRepository.resolve_trace_read` | read mapping by trace subject/consumer/context | read-only | trace subject 来自 mapper/request-loaded trace |
| `IdentityReadVisibilityRepository.resolve_audit_read` | read mapping by audit subject/scope/consumer/context | read-only | not-visible 不当 not-found |
| `IdentityReadVisibilityRepository.resolve_report_read` | read mapping by report ref/consumer/context | read-only | 不从 report id 拼 scope |
| `IdentityReadVisibilityRepository.resolve_reconciliation_scope_read` | read mapping by maintenance scope/consumer/context | read-only | list reports 前 precheck;不先扫描后推断 |
| `IdentityReadVisibilityRepository.resolve_projection_state_read` | read mapping by projection/state ref/consumer/context | read-only | 不从 projection ref 字符串推 visibility scope |
| `IdentityReadVisibilityRepository.resolve_reference_state_read` | read mapping by external reference/owner/consumer/context | read-only | 不调用 external resolver;不把 owner 当 scope |
| `IdentityReadVisibilityRepository.resolve_outbox_record_read` | read mapping by outbox/subject/topic filter | read-only | 不读取 payload body/topic secret |
| `IdentityReadVisibilityRepository.resolve_handoff_intent_read` | read mapping by handoff intent/consumer/context | read-only | 不读取 receipt body,target path,archive package |
| `IdentityReadVisibilityRepository.get_visibility_decision` | visibility decision by `visibility_result_ref` | read-only | 不调用 external auth |
| `IdentityReadVisibilityRepository.save_visibility_decision` | visibility decision material | create `None`;update loaded decision version;UoW write | optional material only;query 不写 truth |
| `IdentityReferenceStateRepository.get_reference_state_with_version` | `external_reference_states` by `ExternalReferenceRef` | returns bundle version | version 是 state/sidecar save expected_version 来源 |
| `IdentityReferenceStateRepository.find_reference_state_ref` | reference state lookup by external ref | read-only | missing 不创建 bundle |
| `IdentityReferenceStateRepository.list_reference_states_by_owner` | owner index | page cursor only | owner 来自 formal mapper;不从 external ref 推断 |
| `IdentityReferenceStateRepository.list_reference_states_by_kind` | reference kind index | page cursor only | kind 是 enum;不解析 string prefix |
| `IdentityReferenceStateRepository.list_stale_reference_states` | maintenance scope + stale index | page cursor only | query 不触发 refresh |
| `IdentityReferenceStateRepository.get_typed_sidecar_refs` | `external_reference_sidecars` by `reference_ref` | read-only | all sidecars same bundle;不保存 external body |
| `IdentityReferenceStateRepository.save_reference_state` | `external_reference_states` PK/unique external ref | create `None`;update loaded bundle version;UoW write | 不修复 external truth |
| `IdentityReferenceStateRepository.save_typed_sidecar_refs` | sidecar set by `(reference_ref, sidecar_kind, sidecar_ref)` | expected loaded bundle version;UoW write | 不把 business source ref 当 bundle key;不跨 bundle 共用 version |
| `IdentityMaintenanceRepository.expand_maintenance_targets` | maintenance target catalog/index | read-only | returns projection/reference/report targets only;不返回 truth write target |
| `IdentityMaintenanceRepository.list_projection_targets_for_rebuild` | scope -> projection target index | read-only page | 不从 scope string 拼 projection ref |
| `IdentityMaintenanceRepository.list_reference_targets_for_refresh` | scope -> external reference target index | read-only page | 不把 business source ref 自动转 bundle ref |
| `IdentityMaintenanceRepository.list_report_targets` | scope -> report target index | read-only page | 不执行 repair/remediation |
| `IdentityReconciliationReportRepository.get_report_with_version` | `identity_reconciliation_reports` by report ref | returns report version | read-only;不从 scope/time 拼 report ref |
| `IdentityReconciliationReportRepository.list_reports_by_scope` | report scope index | page cursor only | scope 来自 request/job/config marker |
| `IdentityReconciliationReportRepository.list_reports_by_target` | report target index | page cursor only | target 是 maintenance target;不返回 repair action |
| `IdentityReconciliationReportRepository.list_reports_by_state` | report state index | page cursor only | Partial/Failed 必须可见 |
| `IdentityReconciliationReportRepository.save_report` | report PK | create `None`;update loaded report version;UoW write | report-only;不修 truth;不保存 raw diagnostic/body |

#### 7.3.6 outbox / idempotency / stored replay / job report repository semantics

| 函数 | logical store / key | version / UoW | 持久化语义 / 禁止事项 |
|---|---|---|---|
| `IdentityOutboxRepository.get_outbox_record_with_version` | `identity_outbox_records` by outbox ref | returns outbox version | publish state update source;不调用 publisher |
| `IdentityOutboxRepository.list_pending_outbox_records` | state + optional topic index | page cursor only | pending 只来自 `OutboxState`;topic uses `TopicKeyRef` |
| `IdentityOutboxRepository.list_retryable_outbox_records` | retryable state + optional topic index | page cursor only | 不定义 backoff;不按 broker raw topic |
| `IdentityOutboxRepository.list_outbox_records_by_subject` | outbox subject index | page cursor only | subject 来自 mapper;不解析字符串 |
| `IdentityOutboxRepository.find_outbox_records_by_trace` | trace ref index | page cursor only | missing 不补 outbox |
| `IdentityOutboxRepository.save_outbox_record` | outbox PK;optional unique `(trace_record_ref,event_kind_ref)` | create `None`;UoW write | accepted-only pending record;不保存 event body |
| `IdentityOutboxRepository.update_outbox_state` | loaded outbox row | expected loaded outbox version;UoW write | publish failed 不回滚 accepted truth |
| `IdentityIdempotencyRepository.get_by_key` | unique `(operation_name, channel, idempotency_key)` | returns record version | channel is namespace;不跨 channel replay |
| `IdentityIdempotencyRepository.reserve` | idempotency unique key | UoW write;outcome carries reserved/existing version | same digest completed => replay;different digest => conflict;repo 不硬编码 channel |
| `IdentityIdempotencyRepository.complete_with_stored_result` | loaded idempotency row | expected loaded idempotency version;UoW write | completed 必须有 stored result ref |
| `IdentityIdempotencyRepository.complete_rejected_with_stored_result` | loaded idempotency row | expected loaded idempotency version;UoW write | 只用于可 replay rejected surface |
| `IdentityIdempotencyRepository.mark_conflict` | loaded idempotency row | expected loaded idempotency version;UoW write | 保留原 digest;不覆盖旧 record |
| `IdentityStoredResultRepository.get_stored_result` | `stored_identity_operation_results` by stored result ref | read-only immutable | missing 不重跑 mutation |
| `IdentityStoredResultRepository.find_by_operation_context` | stored result context index | read-only | 不从 raw request 查 |
| `IdentityStoredResultRepository.save_command_accepted_result` | stored result PK/context/kind index | append immutable;UoW write | generic shell only;result kind must be `CommandAccepted`;typed replay 仍需 accepted envelope |
| `IdentityStoredResultRepository.get_command_accepted_result` | `identity_command_accepted_result_envelopes` by stored result ref | read-only immutable | missing/wrong-kind/variant mismatch 不重跑 command、不重读 truth |
| `IdentityStoredResultRepository.save_command_accepted_envelope` | accepted command envelope PK/result index | append immutable;UoW write | 同 UoW 保存 typed result + effect;不保存 command request body;result DTO 不重复 effect |
| `IdentityStoredResultRepository.save_command_rejected_result` | stored result PK/context/kind index | append immutable;UoW write | generic shell only;result kind must be `CommandRejected`;internal error 不当 rejected result |
| `IdentityStoredResultRepository.get_command_rejected_result` | `identity_command_rejected_result_envelopes` by stored result ref | read-only immutable | missing/wrong-kind 不重跑 validation/domain guard |
| `IdentityStoredResultRepository.save_command_rejected_envelope` | rejected command envelope PK/result index | append immutable;UoW write | 只保存 replayable `IdentityProtocolRejection`;不保存 raw error body |
| `IdentityStoredResultRepository.save_consumer_receipt_result` | generic stored shell | append immutable;UoW write | typed replay 仍需 receipt envelope;不保存 event body |
| `IdentityStoredResultRepository.get_consumer_receipt` | `identity_consumer_receipt_envelopes` by stored result ref | read-only immutable | missing/wrong-kind 不重跑 consumer |
| `IdentityStoredResultRepository.save_consumer_receipt` | receipt envelope PK/result index | append immutable;UoW write | 同 UoW 保存完整 public receipt envelope;不保存 event body |
| `IdentityStoredResultRepository.save_job_report_result` | stored result PK/context/kind index | append immutable;UoW write | result kind `JobReport`;不保存 raw job log |
| `IdentityStoredResultRepository.save_handoff_callback_receipt_result` | generic stored shell | append immutable;UoW write | typed replay 仍需 callback receipt envelope |
| `IdentityStoredResultRepository.get_handoff_callback_receipt` | receipt envelope by stored result ref | read-only immutable | wrong-kind 不当普通 consumer receipt |
| `IdentityStoredResultRepository.save_handoff_callback_receipt` | callback receipt envelope PK/result index | append immutable;UoW write | 不保存 external receipt body/archive package/adapter response |
| `IdentityCommandEffectSummaryRepository.get_effect_summary` | `identity_command_effect_summaries` by effect ref | read-only immutable | summary refs only;不保存 raw command body |
| `IdentityCommandEffectSummaryRepository.list_effects_by_operation_context` | context index | page cursor only | context ref 来自 operation context |
| `IdentityCommandEffectSummaryRepository.list_effects_by_truth_ref` | truth ref index | page cursor only | truth ref is typed sum;不保存 external source string |
| `IdentityCommandEffectSummaryRepository.list_effects_after_cursor` | truth cursor index | page cursor only;truth cursor filter | 不用 timestamp/page cursor 替代 truth cursor |
| `IdentityCommandEffectSummaryRepository.save_effect_summary` | effect summary PK | append immutable;UoW write | 不决定 transaction order;只保存 refs |
| `IdentityJobReportRepository.get_job_report_with_version` | `identity_job_run_reports` by report ref | returns report version | read-only;不保存 raw log |
| `IdentityJobReportRepository.find_job_report_by_run` | unique `job_run_ref` | returns versioned report | duplicate job replay source;不用 name+timestamp |
| `IdentityJobReportRepository.list_job_reports_by_name` | job name index | page cursor only | job name is formal ref/enum |
| `IdentityJobReportRepository.list_job_reports_by_result` | job result index | page cursor only | Partial/Failed/RetryableFailed preserved |
| `IdentityJobReportRepository.save_job_report` | report PK/run index | create `None`;update loaded report version;UoW write | report 不修 truth;partial 不静默成功 |

#### 7.3.7 11.2 fake / durable parity 表

| repository family | fake 必须等价 | durable 必须等价 | 禁止事项 |
|---|---|---|---|
| core truth | unique key、version conflict、append-only career、duplicate source lookup | truth stores + typed indexes + optimistic update | fake query miss 自动建 truth 或保存外部正文 |
| trace/audit/history/handoff | append order、subject/cursor indexes、audit/handoff version conflict、receipt marker guard | append-only trace/audit stores + handoff state indexes | fake 用 raw body 搜索或把 adapter success 当 delivered |
| projection/read/reference/report | stable lookup missing、query no-write、bundle sidecar same-version、report-only | projection/reference/report stores + formal indexes | fake 拼 view/ref、扫描 sibling body、query rebuild/refresh |
| outbox/replay/job | same key/digest semantics、stored generic shell + typed command envelope / receipt / job report save-load symmetry、pending/retry indexes、job run uniqueness | idempotency/result/outbox/job stores + unique indexes | fake missing stored result 或 typed envelope 时重跑 mutation |

#### 7.3.8 11.2 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 11.2 范围 | 通过 | 只写 repository persistence semantics;未写完整 flow transaction boundary |
| 是否覆盖 Step 7 repository/read-side 函数 | 通过 | core truth、trace/audit/history/handoff、projection/read/reference/report、outbox/idempotency/stored result/effect/job report 均已逐函数覆盖 |
| 是否新增 Step 7 方法 | 未新增 | 只解释既有函数的 key/index/version/UoW 语义 |
| version 来源是否闭合 | 通过 | mutable update 指向 matching versioned read / reserve outcome / loaded row;append-only 不使用 expected_version |
| query no-write 是否保持 | 通过 | read/list/resolve 均标记 read-only;missing/stale 不 rebuild/refresh/repair |
| stored replay 是否保持 no-rerun | 通过 | stored result / receipt / job report missing 不允许重跑 mutation |
| fake/durable parity 是否覆盖 | 通过 | §7.3.7 固定同 key、index、version、append-only、missing/conflict 行为 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.4 11.3 transaction boundary by flow family

本批承接 Step 9 的 function flow order 和 Step 10 的 no-write / no-repair / no-rerun state boundary。它只定义事务开始、提交、回滚、同 UoW 写入和外部副作用边界;不定义最终 public error taxonomy、HTTP/status、retry/backoff、digest conflict priority 或 stored serialization。那些分别留 Step 12、Step 13、Step 14 和 Step 16。

#### 7.4.1 transaction boundary 总表

| flow family | 是否开启 write UoW | commit 前必须完成 | commit 后才允许 | rollback / no-write 规则 |
|---|---|---|---|---|
| API / worker / jobs entry pre-dispatch | 否 | entry context、validation、dispatch target decision 只在 entry surface 内形成 | 调用 application facade 后由 application result 接管 | pre-dispatch failure 不保存 stored result、receipt、job report 或 truth |
| command accepted | 是 | idempotency reserve、versioned load、domain transition、truth save、truth cursor、trace/audit/outbox/stale/effect、generic stored shell、typed command accepted envelope、idempotency complete | publish outbox、deliver handoff、external downstream consumption | guard/domain/repository failure before commit rollback;accepted truth 与 replay surface 同 UoW |
| command replayable rejected | 是,仅当 Step 12/13 判定该 rejected surface 可 replay | idempotency reserve、generic stored rejected shell、typed command rejected envelope、idempotency rejected complete | 无业务 side effect | 不写 truth、trace、audit、outbox、projection;不可 replay error rollback |
| query | 否 | visibility precheck、read truth/view/reference/report/outbox/handoff、assemble read surface | 无写 side effect | 禁止 UoW、idempotency、stored result、trace/audit append、projection rebuild、reference refresh |
| inbound consumer accepted / marker-only / receipt branch | 是 | idempotency reserve、payload/material guard、identity-owned truth/reference/sidecar/marker update、cursor、trace/outbox/stale when required、typed receipt envelope、stored result shell、idempotency complete | worker ack/dead-letter transport mapping | duplicate replay 不 parse/reapply payload;delayed/quarantined/noop 保存 typed receipt 时也不保存 external body |
| handoff callback accepted / failure receipt branch | 是 | callback idempotency、target lookup、formal attempt/receipt/issue marker guard、handoff or memory state update、trace/outbox/stale when required、callback receipt envelope、stored result shell、idempotency complete | worker ack/dead-letter transport mapping | `Delivered` without formal attempt + receipt rollback/rejected surface;receipt body never stored |
| outbox publish job | 是 for selected page update | job idempotency reserve、load saved outbox/payload marker、topic binding result, publisher outcome marker, outbox state update, job report item refs, stored job report, idempotency complete | downstream consumer processing | publish success/failure never rolls back accepted truth;publisher uses saved marker only |
| handoff delivery job | 是 for selected page update | job idempotency reserve、load handoff intent, target/delivery outcome marker, handoff state update, job report item refs, stored job report, idempotency complete | archive/external owner consumption | delivered requires formal attempt + receipt;target path/receipt body not stored |
| projection/reference/reconciliation jobs | 是 for selected page update/report | job idempotency reserve、load formal targets, update only projection/reference/report state, job report item refs, stored job report, idempotency complete | no external business mutation | job never repairs member/lifecycle/role/career/memory truth or external truth |
| retry propagation job | 是 for selected retry family | job idempotency reserve、select retryable outbox or handoff family、reuse publish/deliver update rules、job report/stored result/idempotency complete | schedule/backoff decision remains Step 14 | terminal Published/Delivered/Failed/Cancelled/Skipped states are not retried |

#### 7.4.2 command transaction boundary

| command group | UoW start | Same-UoW writes on accepted path | External/non-transactional work | Commit / rollback rule |
|---|---|---|---|---|
| `EstablishGlobalMemberFlow` | before idempotency reserve and member/lifecycle guard | member create,initial lifecycle create,truth cursor,trace,audit,accepted outbox material when defined,affected projection stale,effect summary,generic stored accepted shell,typed accepted envelope,idempotency complete | none after accepted commit except later outbox job | any guard/version/store failure before commit rolls back all staged rows |
| `UpdateGlobalLifecycleStateFlow` | before idempotency reserve and loaded member/lifecycle read | lifecycle update,optional anchor hold update,truth cursor,trace/audit,outbox for lifecycle/availability/anchor material,projection stale,effect summary,generic stored accepted shell,typed accepted envelope,idempotency complete | governance basis resolver output is body-free input;publish happens later | high-risk basis missing/invalid cannot partially save lifecycle or anchor |
| `MaintainRoleCapabilitySummaryFlow` | before idempotency reserve and source/snapshot/summary load | summary/snapshot/reference sidecar updates that Step 9 accepted path requires,truth cursor or reference marker cursor as applicable,trace/audit/outbox/stale,effect summary,generic stored accepted shell,typed accepted envelope,idempotency complete | source/evidence resolver calls produce safe summary/version only | source unavailable/invalid or forbidden material cannot save partial active summary |
| `AppendCareerRecordFlow` | before idempotency reserve and duplicate source guard | career append or explicit pending-review record,truth cursor,trace/audit,outbox/stale,effect summary,generic stored accepted shell,typed accepted envelope,idempotency complete | work source resolver output is body-free input | duplicate source no-new-history branch uses stored surface;does not append second record |
| `MaintainMemoryReferenceFlow` | before idempotency reserve and member/relation/source guard | memory relation create/update,optional reference sidecar,truth or marker cursor,trace/audit/outbox/stale,effect summary,generic stored accepted shell,typed accepted envelope,idempotency complete | memory/archive resolver output is body-free input | handoff marker state cannot become delivered without callback/job receipt |
| `PrepareTraceHandoffFlow` | before idempotency reserve and trace/audit/material guard | pending handoff intent,trace/audit marker when required,projection stale,effect summary,generic stored accepted shell,typed accepted envelope,idempotency complete | target resolution may validate target/scope but does not deliver | accepted command creates pending intent only;delivery is job/callback boundary |

Command duplicate replay is outside the accepted mutation branch. Same key/same digest duplicate must load the generic stored shell plus `IdentityCommandAcceptedResultEnvelope` or `IdentityCommandRejectedResultEnvelope` named by the idempotency record. It must not reload truth to reconstruct response, re-run resolver, append trace/audit/outbox, mark projections stale again, or create a second effect summary.

#### 7.4.3 query no-write transaction boundary

| query group | Required reads | Forbidden writes | Boundary result |
|---|---|---|---|
| core truth queries | visibility access summary,member/lifecycle/role/career/memory repositories,optional projection/reference state | UoW,idempotency,stored result,truth save,trace/audit,outbox,projection stale | visible/redacted/not-visible/degraded/missing/empty surface |
| member summary / trace / audit queries | stable view lookup,view read,trace/audit/history facade,visibility decision | projection rebuild,audit repair,trace append,visibility default-visible write | query surface only;stale visible stays read-only |
| maintenance / report queries | visibility resolver,projection/reference/report state/read repository | rebuild projection,refresh reference,generate reconciliation report | report/projection/reference read surface only |
| outbox / handoff queries | visibility resolver,outbox/handoff intent repository | publish,deliver,retry,mark delivered,mark failed | state view only;Published/Delivered meaning not expanded |

Query services may save no optional diagnostic material in this Step. If future implementation needs persisted query decision material, it must be a Step 7/9/11 explicit write flow, not a hidden query-side write. `save_visibility_decision(...)` remains optional application material and cannot be called from the read-only query flow unless a later batch formally creates a write boundary for it.

#### 7.4.4 consumer / callback transaction boundary

| flow | Same-UoW writes | Cursor rule | Stored replay rule | Rollback / forbidden behavior |
|---|---|---|---|---|
| `HandleRoleCapabilitySourceChangedFlow` | idempotency record,source snapshot/reference state/sidecar,marker or accepted trace,outbox/stale if Step 9 branch requires,typed receipt envelope,stored shell,idempotency complete | reference marker cursor for marker-only update;truth cursor only if accepted truth changed | duplicate loads typed consumer receipt envelope | no role/capability definition body;no source string subject |
| `HandleWorkParticipationAcceptedFlow` | idempotency record,career append or explicit noop/quarantine receipt,truth cursor if career appended,trace/outbox/stale,typed receipt envelope,stored shell,idempotency complete | appended career uses truth cursor;noop/quarantine receipt may use marker cursor only when marker trace is required | duplicate does not parse work payload or re-run duplicate lookup | duplicate source branch must not append second career record |
| `HandleMemoryReferenceSourceStateChangedFlow` | idempotency record,memory relation/reference sidecar update,truth or marker cursor,trace/outbox/stale,typed receipt envelope,stored shell,idempotency complete | relation truth change uses truth cursor;reference-only update uses marker cursor | duplicate loads typed receipt envelope | no memory body/archive package;no fake delivered state |
| `HandleArchiveHandoffResultFlow` | idempotency record,memory callback target relation update when valid,formal attempt/receipt/issue marker,trace/outbox/stale,callback receipt envelope,stored shell,idempotency complete | truth cursor if memory relation changes;marker cursor for receipt-only branch | duplicate loads handoff callback receipt envelope | callback target mismatch cannot update relation |
| `HandleTraceHandoffResultFlow` | idempotency record,handoff intent state update,formal attempt/receipt/issue marker,trace/stale,callback receipt envelope,stored shell,idempotency complete | marker cursor for handoff marker state;truth cursor not used for core member truth | duplicate loads handoff callback receipt envelope | HTTP 2xx/request sent/job log success cannot mark delivered |

Consumer/callback unsupported schema, forbidden body, transient dependency delayed, manual-review quarantined, source duplicate noop and rejected receipt branches all need a replayable typed receipt if Step 9/12/13 classifies them as application-level outcomes. They must not save external raw payload, adapter raw response, archive package, receipt body or unsafe diagnostic body.

#### 7.4.5 outbox / handoff / maintenance job transaction boundary

| job flow | Same-UoW writes | Adapter / resolver call boundary | Commit / rollback rule |
|---|---|---|---|
| `RebuildIdentityProjectionFlow` | job idempotency,projection state/view update,item refs,job report,stored job result,idempotency complete | projection source cursor read is repository read;no external truth repair | missing cursor/target records failed item/report;does not repair core truth |
| `RefreshExternalReferenceStateFlow` | job idempotency,reference state/typed sidecar,optional marker trace/stale,item refs,job report,stored job result,idempotency complete | external resolver returns body-free resolution/safe summary only | resolver failure records reference/job issue;does not delete local truth |
| `RunIdentityReconciliationFlow` | job idempotency,reconciliation report/finding/issue refs,job report,stored job result,idempotency complete | diagnostic inputs are body-free refs/markers | report-only;no truth/external repair |
| `PublishIdentityOutboxFlow` | job idempotency,outbox state updates,published/failed item refs,job report,stored job result,idempotency complete | topic binding and publisher calls use saved outbox record + payload marker | publish failure updates outbox issue/report only;accepted truth remains committed |
| `DeliverTraceHandoffFlow` | job idempotency,handoff intent state updates,attempt/receipt/issue refs,item refs,job report,stored job result,idempotency complete | target resolver and delivery port use safe material marker | delivered requires attempt + receipt;failure records issue/report only |
| `RetryIdentityPropagationFailuresFlow` | job idempotency,retryable outbox or handoff state updates,item refs,job report,stored job result,idempotency complete | reuses publish/deliver adapter boundaries | one run processes one retry family;terminal states not retried |

Operations job duplicate replay must load `StoredIdentityOperationResult(JobReport)` plus `IdentityJobRunReport`. It must not re-list stale/pending/retryable records, re-run resolver/publisher/handoff delivery, recompute item refs, mark additional stale state, or rebuild report from current repository state.

#### 7.4.6 rollback and commit visibility rules

| Rule | 正式口径 |
|---|---|
| staged visibility | truth cursor、reference marker cursor、stored result、receipt envelope、job report、outbox/handoff/projection/reference updates are visible only after commit |
| rollback cleanup | rollback removes staged rows and staged cursor assignment;duplicate replay cannot see rolled-back stored result refs |
| commit failure | if commit fails, application must not report accepted/receipt/job success;exact recovery mapping留 Step 12 |
| external side effect placement | publisher / handoff delivery outcome may be obtained during job processing, but durable publication/delivery state is only trusted after local commit |
| no two-phase external commit | external broker/archive/downstream owner is not inside Identity UoW;Identity persists only attempt/receipt/issue markers |
| accepted truth durability | accepted command truth is committed together with trace/audit/outbox/stale/effect,generic stored shell,typed command envelope and idempotency complete |
| propagation failure isolation | outbox/handoff failure updates marker/report only;it never rolls back member/lifecycle/role/career/memory accepted truth |
| query no repair | query missing/stale/degraded returns surface;it never opens UoW to repair projection/reference/audit/report |

#### 7.4.7 11.3 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 11.3 范围 | 通过 | 只写 transaction boundary;未写错误 taxonomy、幂等矩阵、retry/backoff 或测试矩阵 |
| command accepted 原子写入是否闭合 | 通过 | truth、cursor、trace/audit/outbox/stale/effect,generic stored shell,typed command envelope,idempotency complete 均在同 UoW |
| query no-write 是否闭合 | 通过 | query 不开 UoW、不写 stored result、不 repair projection/reference/report/outbox/handoff |
| consumer/callback receipt replay 是否同事务闭合 | 通过 | typed receipt envelope、stored shell、idempotency complete 与本地 marker/state update 同 UoW |
| job report replay 是否同事务闭合 | 通过 | job report、stored job result、idempotency complete 与 item state/report refs 同 UoW |
| outbox/handoff propagation failure 是否隔离 | 通过 | publish/deliver failure 只更新 marker/report,不回滚 accepted truth |
| entry pre-dispatch 是否不写业务结果 | 通过 | entry validation/dispatch failure 不保存 rejected command result、consumer receipt 或 job report |
| 是否新增 repository / DTO / state | 未新增 | 全部引用 Step 6/7/8/9/10 已有对象、port 和状态 |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.5 11.4 consistency / recovery / fake parity

本批定义 persistence 层的一致性、恢复和 fake/durable 等价规则。这里的 recovery 只表示本地 durable state、marker、report 和 replay surface 如何保持可恢复;不定义 public error/status、HTTP mapping、retry/backoff schedule、worker ack/dead-letter 或最终幂等优先级。那些继续由 Step 12、Step 13、Step 14 和 Step 16 承接。

#### 7.5.1 consistency strategy 总表

| consistency area | durable rule | recovery surface | fake parity requirement |
|---|---|---|---|
| mutable truth optimistic update | every update uses loaded `IdentityVersion`;conflict rejects current write without overwrite | caller reloads through same repository;public mapping留 Step 12 | fake must detect stale expected_version,not last-write-wins |
| append-only material | generated ref / unique key append;old rows never overwritten or reordered | duplicate key returns duplicate/conflict surface,not silent success | fake preserves append order and duplicate constraints |
| idempotency and stored replay | reserve/complete/stored surface are atomic with operation UoW | duplicate reads stored command/receipt/callback/job surface only | fake missing/wrong-kind stored result must fail,not rerun mutation |
| projection eventual consistency | accepted write marks affected projection stale;rebuild job updates view/state | query exposes stale/missing/degraded surface;job report records rebuild issues | fake uses formal dependency index and stale state,not query rebuild |
| reference eventual consistency | tracked bundle state/sidecar versioned by `ExternalReferenceRef` | refresh records resolved/stale/unavailable/unrecognized and safe issue markers | fake uses same bundle key/version,not source version |
| outbox propagation | accepted material creates pending outbox;publish only updates outbox state/report | retryable/permanent/skipped issue markers preserve accepted truth | fake publisher outcome cannot mutate truth or mean downstream consumed |
| handoff propagation | pending intent persists safe material marker;delivery/callback updates handoff marker | delivered requires attempt + receipt;failure/cancel stores issue marker | fake cannot mark delivered without formal receipt marker |
| report-only maintenance | reconciliation/job reports persist item refs/counts/issues | reports never repair truth;partial/failed remain visible | fake must preserve partial/failed item refs |
| entry/runtime technical state | entry pre-dispatch and runtime markers are separate from application result | entry failure returns entry surface only | fake entry must use dispatch catalog/facade,not direct repository |

#### 7.5.2 optimistic conflict and unique key rules

| store family | conflict trigger | required behavior | forbidden behavior |
|---|---|---|---|
| member / lifecycle | stale `IdentityVersion` or duplicate `member_ref` create | reject current write;no partial trace/outbox/stored result commit | overwrite anchor/lifecycle or release held ref |
| role summary / source snapshot | stale summary/snapshot version or duplicate typed source snapshot mismatch | reject update or duplicate mismatch;source version remains field only | use source version as expected_version |
| career record | duplicate source marker when policy says no new history;stale old record version for supersession | no second append for duplicate;supersession update requires loaded old record version | overwrite old career record content |
| memory reference | stale relation version or active member/memory/archive duplicate | reject update/create conflict;callback target mismatch does not update relation | save memory body or mark delivered from callback raw body |
| audit / handoff aggregate | stale audit trail or handoff intent version | reject append/update until reloaded | append audit/handoff entry against stale aggregate silently |
| projection / reference / outbox | stale state version on stale/fresh/publish/refresh update | reject item update and record job issue where job flow owns report | last-write-wins state transition |
| idempotency | same operation/channel/key with different digest | conflict surface;keep original digest/result ref | overwrite digest or replay across channels |
| stored result / receipt / job report | duplicate stored ref with different kind/body marker | duplicate mismatch;no mutation rerun | replace stored surface or reconstruct from current truth |

#### 7.5.3 append-only and replay recovery rules

| material | append/replay invariant | missing / wrong-kind recovery |
|---|---|---|
| `IdentityTraceRecord` | append once per generated trace ref;correction appends new trace and marks old trace by versioned update | missing trace in query/handoff/report becomes missing/degraded surface;do not recreate trace from truth |
| `AuditTrailEntry` | entry append tied to loaded audit trail version,formal trace ref and accepted audit marker mapper visibility marker | missing audit trail is service-created only in accepted write flow with `IdentityAcceptedAuditTrailMarkerMapper`;query does not repair |
| `CareerRecord` | new fact/correction is append-only;old record content immutable | duplicate source does not append;stored duplicate/noop behavior留 Step 13 |
| `IdentityOutboxRecord` / payload marker | accepted material creates pending record and immutable payload marker | duplicate command replay uses stored effect/outbox refs;does not create new outbox |
| `StoredIdentityOperationResult` | stored kind immutable after save | missing/wrong-kind replay is replay error in Step 12/13;never rerun command/consumer/job |
| `IdentityConsumerReceiptEnvelope` | public receipt envelope saved with stored shell before idempotency complete | duplicate missing envelope is replay error;do not parse original payload again |
| `IdentityJobRunReport` | report item refs/counts/issues saved before idempotency complete | duplicate missing report is replay error;do not rerun job body or rescan store |

#### 7.5.4 projection / reference eventual consistency rules

| path | consistency model | recovery / read behavior | fake/durable constraint |
|---|---|---|---|
| accepted truth -> projection stale | accepted command/consumer/callback expands affected projection refs and marks stale in same UoW | if stale mark fails before commit,the accepted transaction rolls back;after commit query sees stale/missing until rebuild | fake must use `projection_dependency_index`;no string-derived affected refs |
| projection rebuild | job reads formal target and source cursor,then saves view/state/report item refs | source cursor missing or source unavailable produces failed/partial job item,not truth repair | fake must not use timestamp/page/version as projection cursor |
| query projection read | query loads stable view ref/state only | stale/missing/degraded is read surface;no rebuild/no mark fresh | fake query must not call builder or mutate store |
| reference consumer sidecar | consumer saves state/sidecar with same loaded bundle version | conflict requires reload;source unavailable writes state/receipt only if flow owns that outcome | fake must use `ExternalReferenceRef` bundle key,not business source ref |
| reference refresh job | job updates tracked bundle state and sidecar;records report item refs/issues | resolver failure preserves last known local truth and writes safe issue/report | fake resolver failure must not delete snapshot or create accepted truth |
| reconciliation report | job writes report-only material over formal maintenance targets | findings/issues are visible report,not repair action | fake must not mutate core truth during reconciliation |

#### 7.5.5 outbox / handoff propagation recovery rules

| propagation state | durable transition rule | recovery behavior | forbidden behavior |
|---|---|---|---|
| `PendingPublish` | created only by accepted command/consumer/callback outbox material | publish job later loads pending/retryable records | create outbox from query/job report |
| `Published` | requires publisher accepted outcome and formal attempt marker | means outbound boundary published only | treat as downstream consumed or update sibling truth |
| `RetryableFailed` outbox | publish retryable issue marker saved with outbox state/job report | retry job may select it according to Step 14 schedule | retry terminal `Failed` / `SkippedByPolicy` |
| `Failed` / `SkippedByPolicy` outbox | terminal for current record unless future formal new operation exists | visible in job/report/query state | flip back to pending without formal flow |
| `PendingHandoff` | created by prepare handoff command with safe material marker | delivery job/callback later updates marker | deliver during prepare command |
| `Delivered` | requires `HandoffAttemptRef` + `HandoffReceiptRef` | visible marker;does not update memory/archive truth by itself | mark delivered on HTTP 2xx/request sent/job log success |
| `RetryableFailed` handoff | requires attempt + issue marker | retry job may select it by formal retry scope | retry terminal `Failed` / `Cancelled` / `Delivered` |
| `Failed` / `Cancelled` handoff | terminal for current intent | future delivery requires new formal intent/operation | mutate archived package or target path |

#### 7.5.6 body-free recovery and diagnostics

| surface | allowed persisted recovery material | forbidden persisted material |
|---|---|---|
| command result / effect | truth refs,cursor,trace/audit/outbox/stale refs,stored result ref,safe issue marker | raw command body,external body,secret,adapter raw response |
| query surface | view refs,state refs,redaction/degraded/missing markers,page refs | raw hidden field,authorization detail,external body |
| consumer receipt | envelope metadata,safe source/version refs,receipt kind,issue marker,stored result ref | raw event body,broker message body,external truth body |
| callback receipt | attempt/receipt/issue marker,stored result ref,body-free state refs | receipt body,archive package,target path,adapter response |
| job report | item refs,counts,cursor refs,issue refs,result kind | raw resolver/publisher/handoff error body,stack trace,secret |
| runtime / entry | safe config evidence,adapter availability issue,dispatch target ref | raw env,secret,full config body,request body |

#### 7.5.7 fake / durable parity checklist

| parity item | durable adapter requirement | fake adapter requirement | implementation blocker if missing |
|---|---|---|---|
| version conflict | compare expected loaded `IdentityVersion` for every mutable update | deterministic version counter and conflict assertion | fake accepts stale update |
| unique indexes | enforce logical unique keys from 11.1/11.2 | same key tables,not scan-derived behavior | fake allows duplicate member/current summary/outbox/idempotency key |
| append ordering | preserve committed append order by cursor/ref/index | stable deterministic order | fake returns nondeterministic list order |
| cursor visibility | truth/reference cursor visible only after commit | staged cursor hidden until commit | fake leaks rolled-back cursor |
| stored replay | save/load exact stored kind/envelope/report | same missing/wrong-kind behavior as durable | fake reruns mutation when stored result missing |
| projection lookup | stable lookup/index and explicit missing | no ad hoc view ref construction | fake builds `member-summary:<id>` on query |
| reference bundle | sidecars tied to same `ExternalReferenceRef` bundle version | same bundle map and owner/kind indexes | fake uses source version/business ref as bundle |
| outbox/handoff state | publish/deliver outcomes update marker only | controlled adapter output maps to same state/issue refs | fake mutates truth or fakes delivered/published |
| entry facade | entry uses dispatch catalog and application facade only | no test-only direct repository entry | fake tests bypass facade/UoW |
| body-free guard | reject or strip forbidden body before persistence | same guard;no raw-body side store | fake keeps raw payload for assertions |

#### 7.5.8 11.4 stop-review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 11.4 范围 | 通过 | 只写 consistency / recovery / fake parity;未写 public error/status、retry/backoff、config 或 test IDs |
| optimistic conflict 是否闭合 | 通过 | mutable updates 必须用 loaded `IdentityVersion`;conflict 不覆盖 |
| append-only / replay 是否闭合 | 通过 | trace/career/outbox/stored result/receipt/job report 不覆盖旧 material;missing replay 不重跑 |
| projection/reference eventual consistency 是否闭合 | 通过 | query no-write;job/report marker 修复;source version 不当 optimistic version |
| outbox/handoff failure isolation 是否闭合 | 通过 | propagation failure 只写 marker/report,不回滚 accepted truth |
| body-free recovery 是否闭合 | 通过 | 只保存 refs、markers、safe issue、counts、cursor;禁止 raw body/secret/receipt body |
| fake/durable parity 是否可测试 | 通过 | 逐项列出 version、unique、append、cursor、stored replay、lookup、bundle、entry/body-free 等价要求 |
| 是否新增 repository / DTO / state | 未新增 | 全部基于 Step 6/7/8/9/10/11.1~11.3 既有 surface |
| 是否修改正式 `03` | 未修改 | 正式文档留 Step 19 |

### 7.6 11.5 cross-step closure / Step 12 handoff

本批不新增 store、repository、state、DTO、error enum 或测试用例。它只审计 Step 11 是否完整承接 Step 6~10 的持久化输入,并把必须进入 Step 12~16 的错误、幂等、配置、可观测和测试事项交接清楚。

#### 7.6.1 Step 6~10 -> Step 11 覆盖审计

| 输入来源 | Step 11 覆盖位置 | 结论 | 说明 |
|---|---|---|---|
| Step 6 truth / view / trace / audit / outbox / handoff / replay objects | 11.1 data ownership、logical store、external boundary | 通过 | member/lifecycle/role/career/memory、projection/reference/report、trace/audit/outbox/handoff、idempotency/stored result/receipt/job/runtime/entry 均有 ownership / store 归属 |
| Step 6 field source / body-free boundary | 11.1 external boundary、11.4 body-free recovery | 通过 | external body、raw event、raw receipt、secret、target path、archive package 均被排除 |
| Step 7 repository / UnitOfWork / port surface | 11.2 repository semantics、11.3 transaction boundary | 通过 | Step 7 repository/read-side 函数均有 key/index/version/UoW 语义,未新增私有方法 |
| Step 7 fake / durable parity | 11.2 parity、11.4 fake/durable parity checklist | 通过 | fake 必须实现相同 key/index/version/conflict/stored replay/no-write 语义 |
| Step 8 protocol replay / receipt / report surface | 11.1 stored stores、11.3 same-UoW replay writes、11.4 replay recovery | 通过 | command result、consumer/callback receipt、job report 均有 durable replay surface |
| Step 9 command / consumer / callback / job transaction order | 11.3 flow family boundary | 通过 | accepted truth + trace/audit/outbox/stale/effect/stored/idempotency complete 同 UoW |
| Step 9 query no-write | 11.2 read-only semantics、11.3 query boundary、11.4 query no repair | 通过 | query 不开 UoW、不写 stored result、不 rebuild/refresh/repair |
| Step 10 state matrix / terminal boundaries | 11.3 propagation/job boundary、11.4 terminal recovery rules | 通过 | Published != downstream consumed;Delivered requires receipt;job no truth repair;duplicate no rerun |
| Step 10 version/cursor/key separation | 11.1 logical stores、11.2 function semantics、11.4 conflict rules | 通过 | optimistic version、truth cursor、reference marker cursor、source version、page cursor、idempotency key 不互相替代 |

#### 7.6.2 Step 11 不承接事项确认

| 事项 | 不在 Step 11 定义的原因 | 下游 owner |
|---|---|---|
| final public error enum / rejection variant | Step 11 只定义 persistence failure surface 和 transaction effect | Step 12 |
| HTTP/RPC status code / worker ack-dead-letter | transport mapping 不属于 persistence | Step 12 / Step 14 / Step 16 |
| same key/different digest / in-flight / expiry priority | Step 11 只定义 stored replay no-rerun 和 unique key conflict | Step 13 |
| idempotency locking implementation detail | lock/isolation 不是 logical store contract 的具体实现细节 | Step 13 / implementation |
| retry/backoff/max-attempt schedule | Step 11 只定义 retryable vs terminal state persistence | Step 14 |
| route/topic/target/config profile schema | config/external binding 不是 persistence truth | Step 14 |
| observability metric/log naming | Step 11 只定义 safe issue/marker/report material | Step 15 |
| formal test case IDs / suite cuts | Step 11 只给可测试契约,不写 Step 16 测试矩阵 | Step 16 |
| formal `03-详细设计.md` assembly | calibration 中间产物不直接回填正式文档 | Step 19 / final assembly |

#### 7.6.3 Step 12 handoff register

| Handoff item | Step 11 已固定 | Step 12 必须定义 |
|---|---|---|
| invalid domain transition | state update must rollback/no side effect unless replayable rejected is explicitly classified | `IdentityDomainError` / `ApplicationError` / protocol rejection mapping and retryability |
| version conflict | stale `IdentityVersion` rejects write without overwrite | command/query/consumer/job public surface for conflict,including retry advice |
| unique conflict | duplicate formal key cannot silently overwrite | duplicate vs conflict vs no-op public priority |
| stored result or typed command/receipt/report surface missing / wrong kind | duplicate replay must not rerun mutation or reconstruct from current truth | duplicate replay error surface and operator recovery wording |
| idempotency same key different digest | original digest/result remains authoritative | application/API/worker/job conflict mapping |
| repository unavailable / commit unknown | no accepted success may be reported without committed stored surface | dependency unavailable / commit unknown mapping and caller action |
| query not-visible/missing/degraded/empty/stale-visible | query never writes repair material | public query surface priority and redaction field behavior |
| source/basis/reference unavailable or invalid | no accepted active truth unless Step 9/10 branch allows marker/report | rejected/dependency/quarantine/delayed/noop priority by protocol family |
| consumer unsupported/forbidden/quarantined/delayed/noop | replayable typed receipt must exist if treated as application outcome | worker receipt disposition and retry/dead-letter mapping |
| callback missing target / receipt invalid | no delivered without attempt + receipt marker | callback receipt rejection/failure mapping |
| publisher / handoff adapter failure | update marker/report only,do not roll back accepted truth | retryable/permanent/skipped/unsupported public/job issue mapping |
| projection/reference/report consistency defect | query/job expose degraded/failed issue;no truth repair | consistency defect error classes and manual recovery language |
| entry pre-dispatch failure | no UoW, no stored result/report/receipt | API/worker/job entry failure surface |
| forbidden body persistence attempt | persistence must reject or strip before save;fake must not keep raw body | error/rejection class and security/redaction mapping |

#### 7.6.4 Step 13~16 handoff register

| Downstream Step | Must carry from Step 11 | Must not introduce |
|---|---|---|
| Step 13 concurrency / idempotency | same key/same digest stored replay, same key/different digest conflict, stored receipt/job report no-rerun, staged cursor/result only after commit | duplicate mutation rerun, result reconstruction from current truth, idempotency key substituted by cursor/ref |
| Step 14 config / deployment | retryable vs terminal state persistence, runtime/adapter marker separation, dispatch target catalog only | config that changes domain invariant, fake/disabled adapter success, route/topic/target direct repository binding |
| Step 15 observability / audit | safe issue markers, trace/audit/outbox/handoff/job report refs, body-free diagnostics | raw request/event/config/adapter/receipt/log body persistence |
| Step 16 tests | version conflict, append-only, no-write query, no truth repair job, no duplicate rerun, no fake delivered/published, no private fake map | tests that bypass facade/UoW or assert private fake store behavior |

#### 7.6.5 Open item closure table

| 编号 | 结论 | 后续 |
|---|---|---|
| `DDD-S11-OPEN-001` | 已闭合 | 11.1 覆盖 logical store inventory;11.5 复审通过 |
| `DDD-S11-OPEN-002` | 已闭合 | 11.2 覆盖 Step 7 repository persistence semantics;11.5 复审通过 |
| `DDD-S11-OPEN-003` | 已闭合 | 11.3 覆盖 command accepted 原子顺序;11.5 复审通过 |
| `DDD-S11-OPEN-004` | 已闭合 | 11.3 覆盖 receipt/job report/stored shell 同事务 replay;11.5 复审通过 |
| `DDD-S11-OPEN-005` | 已闭合 | 11.4 覆盖 query no-write 和 fake/durable parity;11.5 复审通过 |

#### 7.6.6 Step 11 completion review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 Step 11 所有批次 | 通过 | 11.0~11.5 均已写入 |
| 是否新增上游未定义对象/port/state | 未新增 | 缺口规则仍要求回 Step 6/7/8/9/10 |
| 是否覆盖 data ownership / logical store | 通过 | 11.1 覆盖 |
| 是否覆盖 repository persistence semantics | 通过 | 11.2 覆盖 |
| 是否覆盖 transaction boundary | 通过 | 11.3 覆盖 |
| 是否覆盖 consistency / recovery / fake parity | 通过 | 11.4 覆盖 |
| 是否完成 Step 12 handoff | 通过 | 7.6.3 明确错误/恢复入口 |
| 是否直接修改正式 `03` | 未修改 | 正式文档留 Step 19 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 第 10 章后续可按下列结构装配:

```md
## 10. 持久化、事务与一致性契约

本章定义 L1-identity 的数据所有权、logical store、repository persistence semantics、transaction boundary、version / cursor / key separation、一致性恢复和 fake/durable parity。函数签名以第 6/7 章 port 为准;状态迁移以第 9 章状态矩阵为准。

### 10.1 Data ownership and logical stores
### 10.2 Repository persistence semantics
### 10.3 Transaction boundaries by flow family
### 10.4 Consistency, recovery and fake parity
### 10.5 Cross-step persistence audit
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

---

## 9. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S11-OPEN-001 | identity-owned logical store inventory 是否完整覆盖 Step 6/10 所有 mutable / append-only / read model / replay object | 11.1 | 11.1 已闭合;11.5 做跨 Step 复审 |
| DDD-S11-OPEN-002 | 每个 Step 7 repository 函数是否都有 key/index/version/UoW 持久化语义 | 11.2 | 11.2 已闭合;11.5 做跨 Step 复审 |
| DDD-S11-OPEN-003 | command accepted path 的 truth + trace/audit/outbox/stale/effect/stored result/idempotency complete 原子顺序是否闭合 | 11.3 | 11.3 已闭合;11.5 做跨 Step 复审 |
| DDD-S11-OPEN-004 | typed receipt envelope / job report / stored result shell 的 replay persistence 是否同事务闭合 | 11.3 | 11.3 已闭合;11.5 做跨 Step 复审 |
| DDD-S11-OPEN-005 | query no-write 和 fake/durable parity 是否逐 store 可测试 | 11.4 | 11.4 已闭合;11.5 做跨 Step 复审 |
| DDD-S11-OPEN-006 | Step 11 是否可以进入 Step 12 | 11.5 | 已闭合;等待用户审核 |

---

## 10. 进入下一批条件

进入 Step 12 前必须满足:

- 用户审核通过 Step 11 persistence / transaction consistency。
- Step 12 只写错误模型、异常分支与恢复口径。
- Step 12 必须承接 7.6.3 的 invalid transition、version conflict、stored replay missing/wrong-kind、query surface priority、consumer/callback receipt、publisher/handoff failure、entry pre-dispatch failure 和 forbidden body mapping。
- Step 12 不修改 Step 11 logical store / transaction boundary,不新增 repository 方法或持久化字段。
- 若 Step 12 发现错误映射需要新的 stored result kind、receipt envelope、job report field、issue marker 或 repository surface,必须暂停回 Step 6/7/8/9/10/11 闭口。
